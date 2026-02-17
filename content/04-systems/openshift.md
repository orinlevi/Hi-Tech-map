# OpenShift

## למה זה חשוב

הרבה חברות ישראליות (במיוחד enterprise וביטחוני) משתמשות ב-**OpenShift** במקום Kubernetes "רגיל". אם תעבדו בארגון גדול, יש סיכוי טוב שתיתקלו ב-OpenShift:

- פופולרי בארגונים שצריכים תמיכה מסחרית ואבטחה מחמירה
- מוסיף יכולות שב-Kubernetes הרגיל צריך להגדיר לבד
- מגיע עם GUI מלא (Web Console) שמקל על ניהול
- נתמך על ידי Red Hat (חלק מ-IBM)

## רעיונות מרכזיים

### מה זה OpenShift?

**OpenShift** הוא ה-**distribution** של Red Hat ל-Kubernetes. קחו Kubernetes, הוסיפו כלי אבטחה, monitoring, GUI, CI/CD מובנה, ותמיכה מסחרית -- וקיבלתם OpenShift.

```
Kubernetes Vanilla               OpenShift
┌─────────────────────┐          ┌─────────────────────────────┐
│                     │          │  Web Console (GUI)          │
│                     │          │  ┌─────────────────────────┐│
│  Kubernetes Core    │          │  │  Kubernetes Core        ││
│  (Pods, Services,   │          │  │  (Pods, Services, etc.) ││
│   Deployments)      │          │  └─────────────────────────┘│
│                     │          │  + Routes                   │
│                     │          │  + BuildConfigs             │
│                     │          │  + ImageStreams             │
│  DIY: monitoring,   │          │  + Built-in Monitoring      │
│  security, CI/CD    │          │  + Enhanced Security (SCC)  │
│                     │          │  + OperatorHub              │
│                     │          │  + Red Hat Support          │
└─────────────────────┘          └─────────────────────────────┘
   חינם, DIY                       מסחרי, "סוללות כלולות"
```

!!! note "Kubernetes בפנים"
    כל מה שעובד ב-Kubernetes עובד גם ב-OpenShift. OpenShift **מוסיף** על K8s, לא מחליף אותו. אם אתם יודעים Kubernetes, אתם כבר יודעים 80% מ-OpenShift.

### OpenShift מול Kubernetes -- ההבדלים העיקריים

| תכונה | Kubernetes (Vanilla) | OpenShift |
|--------|---------------------|-----------|
| עלות | חינם (open source) | מסחרי (יש גם OKD חינמי) |
| GUI | אין (צריך להתקין בנפרד) | Web Console מלא מובנה |
| Routing | Ingress (צריך controller חיצוני) | **Routes** (מובנה) |
| Build | צריך CI/CD חיצוני | **BuildConfig** (מובנה) |
| Image Registry | צריך להגדיר | **ImageStream** (מובנה) |
| אבטחה | בסיסי | **SCC** (Security Context Constraints) |
| Monitoring | צריך להתקין Prometheus | Prometheus + Grafana מובנים |
| CLI | kubectl | **oc** (+ kubectl עובד גם) |

### Routes -- חשיפת אפליקציות לעולם

ב-Kubernetes רגיל, חשיפת service לאינטרנט דורשת Ingress Controller + Ingress resource. ב-OpenShift יש **Route** שעושה את זה פשוט:

```yaml
# route.yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: my-app-route
spec:
  host: my-app.example.com    # ה-URL שמשתמשים יגשו אליו
  to:
    kind: Service
    name: my-app-service
  tls:
    termination: edge          # HTTPS אוטומטי
```

```
משתמש
  │
  │ https://my-app.example.com
  v
┌──────────────┐
│    Route     │  (OpenShift Router)
└──────┬───────┘
       v
┌──────────────┐
│   Service    │
└──────┬───────┘
   ┌───┼───┐
   v   v   v
 Pod  Pod  Pod
```

### BuildConfig -- בנייה מובנית

OpenShift יכול לבנות images ישירות מקוד מקור, בלי Docker על המחשב שלכם:

```yaml
# buildconfig.yaml
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: my-app-build
spec:
  source:
    type: Git
    git:
      uri: https://github.com/myorg/my-app.git
      ref: main
  strategy:
    type: Docker                    # או Source (S2I)
    dockerStrategy:
      dockerfilePath: Dockerfile
  output:
    to:
      kind: ImageStreamTag
      name: my-app:latest
  triggers:
    - type: GitHub                  # build אוטומטי על push
```

??? tip "Source-to-Image (S2I)"
    OpenShift תומך ב-**S2I** -- טכנולוגיה שבונה image **בלי Dockerfile**. אתם נותנים קוד מקור, ו-OpenShift מזהה את השפה ובונה image אוטומטית:
    ```bash
    oc new-app python:3.11~https://github.com/myorg/my-app.git
    # OpenShift מזהה Python, מתקין dependencies, ובונה image
    ```

### ImageStreams -- ניהול Images

ImageStream הוא אבסטרקציה מעל container images שמאפשרת:

- מעקב אחרי שינויי גרסאות
- trigger אוטומטי ל-deployment כש-image מתעדכן
- הפניה ל-image בלי לדעת את ה-registry המדויק

```yaml
# imagestream.yaml
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: my-app
spec:
  tags:
    - name: latest
      from:
        kind: DockerImage
        name: registry.example.com/my-app:latest
```

### אבטחה -- Security Context Constraints (SCC)

!!! warning "הבדל חשוב"
    ב-Kubernetes רגיל, containers רצים כ-root כברירת מחדל. ב-OpenShift, **containers לא יכולים לרוץ כ-root** כברירת מחדל. זה יותר מאובטח, אבל לפעמים שובר images שמצפים לרוץ כ-root.

```bash
# בדיקת SCC הזמינים
oc get scc

# SCC נפוצים:
# restricted    -- ברירת מחדל, הכי מאובטח (לא root)
# anyuid        -- מאפשר לרוץ ככל user
# privileged    -- הרשאות מלאות (לא מומלץ)
```

### oc -- כלי ה-CLI

```bash
# login ל-cluster
oc login https://api.my-cluster.example.com

# יצירת project (namespace עם תוספות)
oc new-project my-project

# יצירת אפליקציה מ-Git
oc new-app https://github.com/myorg/my-app.git

# צפייה ב-resources
oc get pods
oc get routes
oc get builds

# חשיפת service כ-route
oc expose service my-app-service

# צפייה ב-build logs
oc logs build/my-app-build-1

# כל פקודת kubectl עובדת גם
oc get deployments   # = kubectl get deployments
```

## בלבולים נפוצים

- **"OpenShift הוא לא Kubernetes"** -- OpenShift **הוא** Kubernetes, עם תוספות. כל YAML שעובד ב-K8s עובד ב-OpenShift.
- **"אם יש לי OpenShift, לא צריך Docker"** -- עדיין צריך לדעת לכתוב Dockerfile ולהבין containers. OpenShift משתמש ב-containers, הוא רק מנהל אותם.
- **"OpenShift יקר תמיד"** -- יש **OKD** שהוא הגרסה הקהילתית (open source) של OpenShift. בחינם. אבל בלי תמיכה של Red Hat.
- **"Route ו-Ingress זה אותו דבר"** -- דומה מאוד בקונספט, אבל Route הוא resource ייחודי ל-OpenShift עם יכולות נוספות (כמו TLS passthrough מובנה). Ingress עובד גם ב-OpenShift.

## דוגמה קטנה

זרימת עבודה טיפוסית ב-OpenShift:

```bash
# 1. Login ל-cluster
oc login https://api.my-cluster.example.com
# Enter username: developer
# Enter password: ****

# 2. יצירת project
oc new-project my-web-project

# 3. Deploy אפליקציה ישירות מ-GitHub
oc new-app python:3.11~https://github.com/myorg/flask-app.git \
  --name=flask-app

# OpenShift יבנה image אוטומטית (S2I)!
# output:
# --> Creating resources ...
#     imagestream.image.openshift.io "flask-app" created
#     buildconfig.build.openshift.io "flask-app" created
#     deployment.apps "flask-app" created
#     service "flask-app" created

# 4. חשיפה לעולם
oc expose service flask-app

# 5. קבלת ה-URL
oc get route flask-app
# NAME        HOST/PORT                                   PATH  SERVICES
# flask-app   flask-app-my-web-project.apps.cluster.com   /     flask-app

# 6. בדיקה
curl http://flask-app-my-web-project.apps.cluster.com
# => Hello from Flask on OpenShift!
```

??? tip "Web Console"
    אחד היתרונות הגדולים של OpenShift הוא ה-Web Console. במקום לכתוב kubectl/oc commands, אפשר:

    - לראות את כל ה-Pods, Services, Routes בממשק גרפי
    - לראות logs ו-metrics בזמן אמת
    - לעשות deploy ישירות מהממשק
    - לנהל הרשאות ו-projects

    זה מאוד מקל על אנשים שלא רגילים ל-CLI.

## קישורים לנושאים אחרים

- [Kubernetes](kubernetes.md) -- הבסיס שעליו OpenShift בנוי
- [Docker](docker.md) -- איך בונים את ה-containers ש-OpenShift מריץ
- [CI/CD](ci-cd.md) -- BuildConfig של OpenShift הוא חלק מ-CI/CD

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מערכות מבוזרות — container orchestration
    - רשתות מחשבים — SDN, service mesh
    - אבטחת מידע — RBAC, SCCs, enterprise security

    **קורסים מומלצים:**
    - Cloud Computing — hybrid/multi-cloud
    - DevOps Engineering — CI/CD, GitOps
    - Linux Administration — RHEL, systemd, SELinux

    **ידע מעשי:**
    - oc CLI (OpenShift client)
    - Kubernetes (OpenShift = K8s++)
    - Red Hat Developer Sandbox — free OpenShift
    - Helm + Operators

    **מתוכנית הלימודים שלך ב-TAU:**
    - מערכות הפעלה (0368-2162)

---

## 🛤️ מאיפה מתחילים

1. **Red Hat Developer Sandbox** — free OpenShift cluster
2. **oc CLI** — learn the OpenShift command line
3. **"OpenShift in Action"** — Manning (ספר)
4. **Red Hat DO180** — Containers & Kubernetes course
5. **CKA + OpenShift certification** — career boost

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין OpenShift ל-Kubernetes?"
    **OpenShift = K8s + enterprise features**: built-in CI/CD (Tekton), image registry, developer console (web UI), Routes (simpler than Ingress), stricter security (SCCs), Operators ecosystem, Red Hat support. K8s = engine, OpenShift = car.

??? tip "מה Route ב-OpenShift?"
    **Route** = OpenShift's way to expose services externally. דומה ל-Ingress אבל פשוט יותר: `oc expose svc/my-service`. Auto TLS, edge/passthrough/reencrypt termination. HAProxy-based router.

??? tip "מה Security Context Constraints (SCCs)?"
    **SCC** = OpenShift security policy שמגבילה מה Pod יכול לעשות. Default: `restricted` — no root, no host networking, no privileged containers. הרבה יותר strict מ-vanilla K8s. צריך `oc adm policy` כדי לתת הרשאות מורחבות.

??? tip "מה Operators?"
    **Operator** = custom controller שמנהל application lifecycle ב-K8s/OpenShift. CRDs (Custom Resource Definitions) + controller logic. דוגמה: PostgreSQL Operator — יוצר, מגבה, ומשדרג DB clusters אוטומטית. OperatorHub = marketplace.

??? tip "מתי בוחרים OpenShift על פני vanilla K8s?"
    **OpenShift**: enterprise environment, compliance requirements (SOC2, HIPAA), Red Hat ecosystem, need for support SLA, integrated developer experience. **Vanilla K8s**: flexibility, lower cost, cloud-native (EKS/GKE), startup/small team, specific customization needs.
