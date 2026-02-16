# Kubernetes

## למה זה חשוב

כשיש לכם אפליקציה אחת ב-container אחד -- Docker מספיק. אבל בעולם האמיתי:

- יש עשרות עד אלפי containers
- צריך לנהל scaling (להוסיף ולהוריד instances אוטומטית)
- צריך לטפל ב-containers שנפלו (self-healing)
- צריך לנתב traffic בין containers

**Kubernetes** (בקיצור K8s) הוא הכלי הסטנדרטי בתעשייה לניהול containers ב-scale. כמעט כל ארגון גדול משתמש בו.

## רעיונות מרכזיים

### מה זה Orchestration?

**Container Orchestration** = ניהול אוטומטי של containers: מתי להריץ, כמה instances, מה עושים כשמשהו נופל, ואיך מנתבים traffic.

```
בלי Orchestration:                    עם Kubernetes:
┌─────────────────────┐              ┌─────────────────────────┐
│ docker run app1     │              │  K8s Cluster            │
│ docker run app2     │              │  ┌─────┐ ┌─────┐       │
│ docker run app3     │              │  │app x3│ │db x2│       │
│                     │              │  └─────┘ └─────┘       │
│ אוי, app2 נפל!     │              │  auto-scaling           │
│ מי יעלה אותו?      │              │  self-healing           │
│ ידנית...            │              │  load-balancing         │
└─────────────────────┘              └─────────────────────────┘
   ניהול ידני                           ניהול אוטומטי
```

### המושגים המרכזיים

#### Pod -- היחידה הבסיסית

**Pod** הוא היחידה הקטנה ביותר ב-Kubernetes. הוא עוטף container אחד או יותר שחולקים רשת ו-storage.

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
spec:
  containers:
    - name: my-app
      image: my-app:1.0
      ports:
        - containerPort: 8080
```

!!! note "למה Pod ולא Container?"
    Pod יכול להכיל כמה containers שצריכים לרוץ ביחד (למשל, אפליקציה + sidecar proxy). אבל במרבית המקרים, Pod = container אחד.

#### Deployment -- ניהול Pods

**Deployment** מגדיר **כמה** Pods צריכים לרוץ ומטפל ב-updates.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3          # תמיד 3 Pods רצים
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:2.0
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "128Mi"
              cpu: "250m"
            limits:
              memory: "256Mi"
              cpu: "500m"
```

```
Deployment (replicas: 3)
│
├── Pod 1 [my-app:2.0]  ✅ Running
├── Pod 2 [my-app:2.0]  ✅ Running
└── Pod 3 [my-app:2.0]  ✅ Running

אם Pod 2 נופל:
├── Pod 1 [my-app:2.0]  ✅ Running
├── Pod 2 [my-app:2.0]  ❌ Crashed
├── Pod 3 [my-app:2.0]  ✅ Running
└── Pod 4 [my-app:2.0]  ✅ Starting  <-- K8s מרים אחד חדש!
```

#### Service -- כתובת קבועה

**Service** נותן כתובת רשת קבועה שמפנה ל-Pods (שיכולים להיווצר ולהיהרס כל הזמן).

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app       # מצביע לכל Pods עם label "app: my-app"
  ports:
    - port: 80         # Port של ה-Service
      targetPort: 8080 # Port בתוך ה-Pod
  type: ClusterIP      # נגיש רק בתוך ה-cluster
```

```
Request מבחוץ
     │
     v
┌─────────────────────────────┐
│  Service (my-app-service)   │
│  IP: 10.0.0.50:80           │
│         │                   │
│    Load Balancer             │
│    ┌────┼────┐              │
│    v    v    v              │
│  Pod1  Pod2  Pod3           │
└─────────────────────────────┘
```

### Scaling אוטומטי

```yaml
# HorizontalPodAutoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70  # אם CPU מעל 70%, תוסיף Pods
```

```
עומס נמוך (בוקר):    ██░░░░░░░░  2 Pods
עומס בינוני (צהריים): █████░░░░░  5 Pods
עומס גבוה (מבצע):    ██████████  10 Pods
חזרה לרגיל:          ███░░░░░░░  3 Pods

K8s מוסיף ומוריד Pods אוטומטית לפי העומס!
```

### kubectl -- הכלי לניהול K8s

```bash
# צפייה ב-Pods
kubectl get pods

# צפייה ב-Deployments
kubectl get deployments

# צפייה ב-Services
kubectl get services

# הרצת Deployment
kubectl apply -f deployment.yaml

# צפייה ב-logs של Pod
kubectl logs my-app-pod-abc123

# כניסה ל-Pod (כמו docker exec)
kubectl exec -it my-app-pod-abc123 -- /bin/bash

# scaling ידני
kubectl scale deployment my-app --replicas=5

# צפייה בסטטוס הכללי
kubectl get all
```

??? tip "kubectl aliases"
    הרבה אנשים משתמשים ב-aliases כי מקלידים kubectl עשרות פעמים ביום:
    ```bash
    alias k='kubectl'
    alias kgp='kubectl get pods'
    alias kgs='kubectl get services'
    alias kgd='kubectl get deployments'
    alias kl='kubectl logs'
    ```

### ארכיטקטורת Cluster

```
Kubernetes Cluster
┌──────────────────────────────────────────────┐
│  Control Plane (Master)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │API Server│ │Scheduler │ │Controller Mgr│ │
│  └──────────┘ └──────────┘ └──────────────┘ │
│  ┌──────────┐                                │
│  │  etcd    │ (key-value store)              │
│  └──────────┘                                │
├──────────────────────────────────────────────┤
│  Worker Nodes                                │
│  ┌────────────┐  ┌────────────┐              │
│  │  Node 1    │  │  Node 2    │              │
│  │ ┌──┐ ┌──┐ │  │ ┌──┐ ┌──┐ │              │
│  │ │P1│ │P2│ │  │ │P3│ │P4│ │              │
│  │ └──┘ └──┘ │  │ └──┘ └──┘ │              │
│  │  kubelet  │  │  kubelet  │              │
│  └────────────┘  └────────────┘              │
└──────────────────────────────────────────────┘
```

!!! warning "מורכבות"
    Kubernetes הוא כלי מורכב. לא צריך להבין הכל ביום הראשון. התחילו מ-Pod, Deployment, Service -- זה 80% מהשימוש היומיומי.

## בלבולים נפוצים

- **"Kubernetes מחליף Docker"** -- לא. Kubernetes **משתמש** ב-containers (שנבנים עם Docker). K8s מנהל את ה-containers, Docker בונה אותם.
- **"צריך Kubernetes לכל פרויקט"** -- לא. לפרויקט קטן עם כמה containers, Docker Compose מספיק. K8s שווה כשיש הרבה services, צוותים, ודרישות scaling.
- **"K8s רץ רק בענן"** -- אפשר להריץ K8s גם on-premise. אבל ספקי ענן מציעים managed K8s (EKS, GKE, AKS) שחוסכים הרבה עבודת תחזוקה.
- **"Pod = Container"** -- Pod יכול להכיל כמה containers. אבל בפועל, ברוב המקרים יש container אחד לכל Pod.

## דוגמה קטנה

נניח שיש לנו אפליקציית web ו-database. ככה נריץ אותם על K8s:

```bash
# 1. יצירת Deployment לאפליקציה
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: my-web-app:1.0
          ports:
            - containerPort: 8080
EOF

# 2. חשיפת האפליקציה עם Service
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
EOF

# 3. בדיקת הסטטוס
kubectl get pods
# NAME                       READY   STATUS    RESTARTS   AGE
# web-app-6d8f7b4c5-abc12   1/1     Running   0          30s
# web-app-6d8f7b4c5-def34   1/1     Running   0          30s
# web-app-6d8f7b4c5-ghi56   1/1     Running   0          30s
```

## קישורים לנושאים אחרים

- [Docker](docker.md) -- הבסיס: איך בונים ומריצים containers
- [OpenShift](openshift.md) -- Kubernetes עם תוספות enterprise
- [CI/CD](ci-cd.md) -- איך מגיעים מקוד ל-deployment על K8s
- [למה Backend צריך רשתות](../03-networks/why-backend-needs-networking.md) -- הרשת מאחורי Services וה-Pods
