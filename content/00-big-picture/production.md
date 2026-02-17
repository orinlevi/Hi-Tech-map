# פרודקשן (Production)

## Why it matters

אתם יכולים לכתוב את הקוד הכי מבריק בעולם -- אבל אם הוא לא **רץ בצורה יציבה בשרת אמיתי** ומשרת משתמשים אמיתיים, אין לו ערך עסקי. **Production** (או "פרודקשן") הוא הסביבה שבה הקוד שלכם באמת חי, ומהרגע שהוא שם -- הכל צריך לעבוד.

הנושא הזה רלוונטי ל**כל** תפקיד בהייטק, לא רק DevOps. מפתחים כותבים קוד שצריך לרוץ שם, Data Scientists בונים מודלים שצריכים לשרת שם, ו-Product Managers צריכים להבין מה אפשרי ומה לא בסביבה הזאת. אם אתם רוצים להבין מי אחראי על מה -- ראו [מפת תפקידים (Roles Map)](./roles-map.md).

!!! note "למה זה חשוב כבר מההתחלה?"
    גם אם אתם מתחילים ללמוד, הבנת Production עוזרת לכם לכתוב קוד טוב יותר **מהיום הראשון** -- קוד שקל לבדוק, קל ל-Deploy, וקל לתחזק.

!!! note "הערת שוליים לא רשמית"
    "אצלי זה עובד" -- המשפט שגרם ליותר שיער לבן בהייטק מכל Bug בהיסטוריה. אם הקוד עובד רק על הלפטופ שלכם, יש לכם שמחה מקומית, לא Product.

---

## Core ideas

### מה זה "עולים ל-Production"?

כשמישהו אומר "עלינו ל-Production" -- הכוונה היא שהקוד עבר את כל השלבים ו**זמין למשתמשים אמיתיים**. זה לא רק "להריץ את הסקריפט" -- זה אומר שהמערכת:

- רצה על **שרתים** (לא על הלפטופ שלכם).
- מטפלת ב**אלפי/מיליוני בקשות** במקביל.
- **מתאוששת** מתקלות בצורה אוטומטית.
- **מנוטרת** -- מישהו (או משהו) יודע אם יש בעיה.

### שלוש הסביבות: Dev, Staging, Production

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     Dev      │───▶│   Staging    │───▶│  Production  │
│  (פיתוח)     │    │  (הכנה)      │    │  (חי!)       │
└──────────────┘    └──────────────┘    └──────────────┘

 המחשב שלך /        העתק של Production   השרתים האמיתיים
 שרת פיתוח          עם Data מדומה        עם משתמשים אמיתיים
```

| סביבה | מטרה | מי משתמש | Data |
|-------|------|----------|------|
| **Development** | פיתוח וניסוי | המפתח/ת | Data מדומה / מקומי |
| **Staging** | בדיקה סופית לפני Production | QA, צוות פיתוח | העתק (מסונן) של Data אמיתי |
| **Production** | שירות למשתמשים אמיתיים | כולם | Data אמיתי ורגיש |

??? tip "למה צריך Staging?"
    Staging היא "חזרה גנרלית" -- סביבה שנראית **כמעט זהה** ל-Production, אבל בלי משתמשים אמיתיים. ככה אפשר לתפוס בעיות **לפני** שהן פוגעות בלקוחות.

??? tip "ויש גם סביבות נוספות..."
    בחברות גדולות אפשר לראות גם:

    - **QA Environment** -- סביבה ייעודית לצוות הבדיקות.
    - **Pre-production / Canary** -- סביבה שמקבלת אחוז קטן מה-Traffic האמיתי לפני שפורסים לכולם.
    - **DR (Disaster Recovery)** -- עותק של Production שיעלה אם הכל קורס.

### הדרך מקוד לשירות חי

```
  כתיבת קוד
       │
       ▼
  Git Push  ──────────▶  Repository (GitHub / GitLab)
                               │
                               ▼
                        CI Pipeline רץ:
                         ├── Build (בניית הקוד)
                         ├── Tests (בדיקות אוטומטיות)
                         └── Lint (בדיקת סגנון קוד)
                               │
                          ✅ הכל עבר?
                               │
                               ▼
                        CD Pipeline:
                         ├── Build Docker Image
                         ├── Push to Registry
                         └── Deploy to Staging
                               │
                         בדיקות ב-Staging ✅
                               │
                               ▼
                        Deploy to Production
                               │
                               ▼
                        Monitoring & Alerting
                        (שומרים שהכל עובד)
```

### אסטרטגיות Deploy

לא כל Deploy הוא אותו דבר. הנה הגישות הנפוצות:

| אסטרטגיה | איך זה עובד | יתרון | חיסרון |
|-----------|-------------|-------|--------|
| **Big Bang** | מכבים את הישן, מדליקים את החדש | פשוט | Downtime, סיכון גבוה |
| **Rolling Update** | מעדכנים שרת אחרי שרת בהדרגה | אפס Downtime | יש רגע שגרסאות שונות רצות במקביל |
| **Blue-Green** | שתי סביבות זהות -- ברגע נתון מעבירים Traffic מ-Blue ל-Green | Rollback מיידי | כפול משאבים |
| **Canary Release** | פורסים קודם ל-5% מהמשתמשים, ואם הכל תקין -- ל-100% | סיכון מינימלי | מורכב יותר לניהול |
| **Feature Flags** | הקוד כבר ב-Production אבל "כבוי" עד שמפעילים | שליטה מלאה | קוד מותנה יכול להצטבר |

!!! note "הערת שוליים לא רשמית"
    Blue-Green Deployment נקרא ככה כי מישהו חשב שצבעים זה יותר מגניב מ"סביבה A" ו"סביבה B". הוא צדק. אף אחד לא רוצה להגיד "אנחנו עושים A-B Deployment".

### Docker -- למה הוא שינה את המשחק

Docker פותר את הבעיה הכי קלאסית בהייטק: **"It works on my machine"**. הוא עושה את זה על ידי אריזה של הקוד שלכם **יחד עם כל מה שהוא צריך** -- הגרסה הנכונה של Python, כל ה-Libraries, ההגדרות -- לתוך **Container** אחד.

```dockerfile
# דוגמה ל-Dockerfile פשוט
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

??? tip "Docker לעומת Virtual Machine"
    | | Docker Container | Virtual Machine |
    |---|-----------------|-----------------|
    | **גודל** | MBs | GBs |
    | **זמן עלייה** | שניות | דקות |
    | **Isolation** | ברמת Process | ברמת OS שלם |
    | **שיתוף משאבים** | חולק Kernel עם ה-Host | מריץ OS עצמאי |
    | **שימוש נפוץ** | Microservices, CI/CD | מערכות Legacy, אבטחה קריטית |

### Kubernetes -- כש-Docker לבד לא מספיק

כשיש לכם עשרות או מאות Containers שצריכים לרוץ, Docker לבד לא מספיק. **Kubernetes** (K8s) מנהל את ה-Containers בשבילכם:

- **Scaling** -- מוסיף Containers כשיש עומס, מוריד כשהעומס יורד.
- **Self-healing** -- Container שקרס? Kubernetes מרים חדש אוטומטית.
- **Load Balancing** -- מחלק Traffic בין ה-Containers.
- **Rolling Updates** -- מעדכן בהדרגה בלי Downtime.

!!! note "הערת שוליים לא רשמית"
    Kubernetes הוא כמו לנהל מלון: Docker הוא החדר הבודד, ו-Kubernetes הוא מנהל המלון שמחליט מי נכנס לאיזה חדר, מה עושים כשחדר מתקלקל, ומתי צריך לפתוח קומה נוספת. רק שהמלון הזה דורש הנדסאי תחזוקה עם תואר שני.

### Monitoring, Logging, Alerting

ברגע שהקוד ב-Production -- צריך **לדעת מה קורה**:

**Logging** (רישום)

- כל פעולה חשובה נרשמת ב-Log.
- לדוגמה: "User #1234 logged in at 14:32", "Payment failed for order #5678".
- כלים נפוצים: ELK Stack (Elasticsearch, Logstash, Kibana), Datadog.

**Monitoring** (ניטור)

- מדידה מתמדת של מדדים: CPU usage, Response Time, Error Rate, Active Users.
- כלים נפוצים: Prometheus, Grafana, New Relic.

**Alerting** (התראות)

- כש-Monitoring מזהה חריגה -- נשלחת התראה.
- לדוגמה: "Error Rate עלה מ-0.1% ל-5% בדקה האחרונה" -> SMS / Slack / PagerDuty.

**Four Golden Signals** -- ארבעת המדדים שכל מערכת צריכה לנטר:

| Signal | מה מודדים | דוגמה |
|--------|-----------|-------|
| **Latency** | כמה זמן לוקח לטפל בבקשה | Response Time = 200ms |
| **Traffic** | כמה בקשות מגיעות | 1,000 requests/sec |
| **Errors** | אחוז הבקשות שנכשלות | Error Rate = 0.5% |
| **Saturation** | כמה "מלאה" המערכת | CPU at 75%, Memory at 60% |

!!! warning "בלי Monitoring אתם עיוורים"
    אם אין Monitoring, אתם מגלים שיש בעיה רק כש**לקוח מתקשר לתמיכה**. עם Monitoring טוב, אתם מגלים בעיות **בשניות** ולפעמים אפילו **לפני** שהמשתמש מרגיש.

```python
# דוגמה פשוטה ל-Logging ב-Python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_order(order_id):
    logger.info(f"Processing order {order_id}")
    try:
        # ... logic ...
        logger.info(f"Order {order_id} completed successfully")
    except Exception as e:
        logger.error(f"Order {order_id} failed: {e}")
        raise
```

### Log Levels -- לא כל הודעה שווה

```python
logger.debug("Variable x = 42")        # פרטים לפיתוח בלבד
logger.info("Order #123 created")       # פעולה רגילה שהתרחשה
logger.warning("Disk usage at 85%")     # משהו חשוד, אבל עדיין עובד
logger.error("Payment API returned 500") # משהו נכשל
logger.critical("Database is down!")     # הכל קורס, תקראו לכולם
```

??? tip "טיפ: Log כמו שאתם הולכים לקרוא את זה בשלוש בלילה"
    כשאתם כותבים הודעת Log, תחשבו שאתם On-call ואתם צריכים להבין מה קרה. `"Error occurred"` לא עוזר. `"Payment failed for order #5678: timeout after 30s calling Stripe API"` -- זה עוזר.

### SLA, SLO, SLI -- ההבטחה למשתמשים

מושגים שכל מי שעובד עם Production צריך להכיר:

| מושג | הסבר | דוגמה |
|------|-------|-------|
| **SLA** (Service Level Agreement) | **הבטחה חוזית** ללקוח | "99.9% Uptime, אחרת נפצה אתכם" |
| **SLO** (Service Level Objective) | **יעד פנימי** (חמור יותר מ-SLA) | "נשאף ל-99.95% Uptime" |
| **SLI** (Service Level Indicator) | **המדד בפועל** | "החודש היינו ב-99.97% Uptime" |

!!! note "הערת שוליים לא רשמית"
    99.9% Uptime נשמע מדהים, נכון? זה אומר שהמערכת יכולה ליפול **8.7 שעות בשנה**. עכשיו תדמיינו שזה קורה ביום שישי אחרי הצהריים כשכולם בחופש. Uptime הוא לא רק מספר, הוא גם תזמון.

**כמה Downtime מותר?**

| Uptime | Downtime בשנה | Downtime בחודש |
|--------|---------------|----------------|
| 99% | 3.65 ימים | 7.3 שעות |
| 99.9% | 8.76 שעות | 43.8 דקות |
| 99.99% | 52.6 דקות | 4.38 דקות |
| 99.999% | 5.26 דקות | 26.3 שניות |

---

## Common confusions

!!! warning "\"זה עובד לי על המחשב\" (It works on my machine)"
    זה כנראה הבלבול הכי קלאסי בהייטק. הקוד רץ מצוין על הלפטופ שלכם, אבל נשבר ב-Production. למה?

    | סיבה | דוגמה |
    |------|-------|
    | **גרסאות שונות** | "אצלי Python 3.11, ב-Production יש 3.9" |
    | **חסרות Dependencies** | "שכחתי להוסיף library ל-`requirements.txt`" |
    | **Environment Variables** | "ה-API key מוגדר אצלי אבל לא בשרת" |
    | **Data שונה** | "בדקתי עם 10 רשומות, ב-Production יש 10 מיליון" |
    | **הרשאות** | "אצלי יש הרשאת Admin, בשרת לא" |

    **הפתרון?** Docker. כשאתם עובדים בתוך Container, הסביבה **זהה** בכל מקום -- על הלפטופ, ב-Staging, וב-Production.

!!! warning "Deploy זה לא רק 'להעתיק קבצים לשרת'"
    בעבר, Deploy היה להעתיק קבצים ב-FTP לשרת. היום, Deploy מודרני כולל:

    - בניית Docker Image
    - בדיקות אוטומטיות
    - Rollback אוטומטי אם משהו נכשל
    - Blue-Green Deployment או Canary Release

!!! warning "Production הוא לא 'סוף הדרך'"
    אחרי ש-Deploy, העבודה **לא נגמרת**. צריך לנטר, לתחזק, לתקן Bugs שמתגלים, לטפל ב-Scale כשיש יותר משתמשים, ולשדרג כשיש גרסאות חדשות.

!!! warning "Scaling Up לעומת Scaling Out"
    שתי גישות שונות לטפל בעומס:

    - **Scaling Up (Vertical)** -- לקנות שרת חזק יותר (יותר CPU, יותר RAM). פשוט אבל יקר, ויש תקרה.
    - **Scaling Out (Horizontal)** -- להוסיף עוד שרתים. מורכב יותר, אבל כמעט בלי גבול.

    רוב המערכות המודרניות מעדיפות **Scaling Out** כי זה מאפשר גדילה כמעט אינסופית וגם Redundancy -- אם שרת אחד נופל, האחרים ממשיכים.

---

## Tiny example

דמיינו שבניתם אפליקציית TODO פשוטה. ככה נראה המסלול ל-Production:

```bash
# שלב 1: פיתוח מקומי (Dev)
$ python app.py  # רץ על localhost:5000
# בודקים ידנית שהכל עובד

# שלב 2: דוחפים ל-Git
$ git add .
$ git commit -m "Add delete-task feature"
$ git push origin main

# שלב 3: CI רץ אוטומטית (GitHub Actions)
# ✅ Tests passed (14/14)
# ✅ Lint passed
# ✅ Docker image built

# שלב 4: Deploy ל-Staging
# -> הצוות בודק את ה-Feature החדש

# שלב 5: Deploy ל-Production
# -> המשתמשים רואים את ה-Feature החדש

# שלב 6: Monitoring
# -> Grafana מראה: Response Time = 45ms, Error Rate = 0.01%
# -> הכל תקין ✅
```

??? tip "מה קורה אם משהו נשבר?"
    ```
    Alert: Error Rate spike to 12%!
       │
       ▼
    DevOps / On-call Engineer רואה את ההתראה
       │
       ▼
    בודק Logs: "NullPointerException in delete_task()"
       │
       ▼
    שתי אפשרויות:
       ├── Rollback: חוזרים לגרסה הקודמת (מהיר, בטוח)
       └── Hotfix: מתקנים את ה-Bug ועושים Deploy חדש
    ```

### דוגמה: GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          pip install -r requirements.txt
          pytest tests/ -v

  build:
    needs: test  # רץ רק אם הבדיקות עברו
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Push to registry
        run: docker push myapp:${{ github.sha }}

  deploy:
    needs: build  # רץ רק אם ה-Build הצליח
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
```

!!! note "הערת שוליים לא רשמית"
    YAML -- השפה שבה רווח אחד במקום הלא נכון הופך את ה-Pipeline שלכם לשירת השמדה. מי שמצא Bug ב-YAML Indentation בניסיון הראשון מעולם לא עבד עם YAML באמת.

### דוגמה: Incident Response -- מה קורה כשהאתר נופל

```
17:00 - Alert: "Homepage returning 503 errors"
        │
        ▼
17:01 - On-call Engineer מקבל SMS + Slack notification
        │
        ▼
17:03 - בודק Dashboard: Error Rate = 45%, CPU = 98%
        │
        ▼
17:05 - מזהה: Deploy האחרון (לפני 10 דקות) הכניס Memory Leak
        │
        ▼
17:07 - מבצע Rollback לגרסה הקודמת
        │
        ▼
17:08 - Error Rate חוזר ל-0.1%, CPU חוזר ל-30%
        │
        ▼
17:10 - כותב הודעת Post-mortem ראשונית ב-Slack
        │
        ▼
למחרת - Post-mortem meeting: "מה קרה, למה, ואיך נמנע בעתיד"
```

---

## 🛤️ מאיפה מתחילים

מסלול למידה מומלץ להבנת Production:

**שלב 1: בסיס (שבוע 1-2)**

1. להבין מה זה Client-Server Architecture -- איך Browser מדבר עם Server
2. ללמוד Git בסיסי -- commit, push, pull, branches
3. להכיר את ה-Terminal / Command Line -- ניווט, הרצת פקודות בסיסיות
4. משאב מומלץ: **The Missing Semester** של MIT (חינמי)

**שלב 2: Docker (שבוע 3-4)**

1. להתקין Docker ולהריץ Container ראשון
2. לכתוב Dockerfile לפרויקט קטן (אפליקציית Flask / FastAPI)
3. להבין Docker Compose -- להריץ כמה Services ביחד
4. משאב מומלץ: **Docker Getting Started** (הדוקומנטציה הרשמית מעולה)

**שלב 3: CI/CD (שבוע 5-6)**

1. להגדיר GitHub Actions Pipeline פשוט -- Build + Test
2. להוסיף Linting ובדיקות אוטומטיות
3. להגדיר Deploy אוטומטי ל-Staging
4. משאב מומלץ: **GitHub Actions Documentation** + דוגמאות

**שלב 4: Cloud Basics (שבוע 7-8)**

1. לפתוח חשבון ב-AWS / GCP / Azure (יש Free Tier)
2. להרים שרת בסיסי (EC2 / Cloud Run / App Service)
3. לעשות Deploy של האפליקציה שלכם לענן
4. ללמוד על Load Balancers, DNS, ו-SSL

**שלב 5: Monitoring + Observability (שבוע 9-10)**

1. להוסיף Logging מסודר לאפליקציה
2. להגדיר Monitoring בסיסי (Prometheus + Grafana, או Datadog Free)
3. להגדיר Alert אחד פשוט: "שלח לי הודעה אם Error Rate עולה על 5%"

??? tip "הדרך הכי טובה ללמוד Production: לשבור דברים"
    תבנו פרויקט צדדי קטן, תעלו אותו ל-Production, ותראו מה קורה כשדברים נשברים. אין תחליף לניסיון של לקום בשלוש בלילה בגלל Alert. טוב, אולי אין צורך בשלוש בלילה -- אבל לחוות Incident אמיתי (גם אם קטן) שווה אלף מאמרים.

!!! tip "מה ללמוד באקדמיה"
    הבנת Production דורשת ידע במערכות הפעלה, תהליכי פיתוח תוכנה, ועבודת צוות.

    **מתוכנית הלימודים שלך ב-TAU:**

    - Software Project (0368-2161)
    - מערכות הפעלה (0368-2162)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין CI ל-CD?"
    **CI (Continuous Integration)** הוא תהליך שבו כל Push ל-Repository מפעיל בנייה ובדיקות אוטומטיות. המטרה: לתפוס Bugs מוקדם. **CD (Continuous Delivery/Deployment)** הוא תהליך שבו קוד שעבר את ה-CI מגיע אוטומטית ל-Staging או ל-Production. ההבדל בין Delivery ל-Deployment: ב-Delivery יש אישור ידני לפני Production, ב-Deployment הכל אוטומטי.

??? tip "הסבירו מה זה Blue-Green Deployment"
    שתי סביבות Production זהות -- Blue ו-Green. בכל רגע רק אחת מהן מקבלת Traffic. כשרוצים לפרוס גרסה חדשה: פורסים ל-Green (שלא מקבלת Traffic), בודקים שהכל תקין, ואז מעבירים את ה-Traffic מ-Blue ל-Green. אם משהו לא תקין -- חוזרים ל-Blue מיידית. היתרון: Rollback מיידי. החיסרון: צריך כפול משאבים.

??? tip "מה עושים כשיש Incident ב-Production?"
    1. **Detect** -- זיהוי הבעיה (Alert, דיווח לקוח). 2. **Triage** -- הערכת חומרה (P1-P4). 3. **Mitigate** -- פעולה מיידית להקטנת הנזק (Rollback, Scale Up, Feature Flag Off). 4. **Fix** -- תיקון השורש. 5. **Post-mortem** -- ניתוח מה קרה, למה, ומה עושים כדי שזה לא יקרה שוב. חשוב: Post-mortem צריך להיות **Blameless** -- מחפשים שורשי בעיה, לא אשמים.

??? tip "מה ההבדל בין Scaling Up ל-Scaling Out?"
    **Scaling Up (Vertical)** = שדרוג השרת הקיים (יותר CPU, RAM). **Scaling Out (Horizontal)** = הוספת שרתים נוספים. Scaling Up פשוט יותר אבל יש לו תקרה ו-Single Point of Failure. Scaling Out מורכב יותר (צריך Load Balancer, State Management) אבל כמעט בלי גבול, ומספק Redundancy.

??? tip "מה זה SLA ומה ההבדל בינו לבין SLO ו-SLI?"
    **SLA** = הבטחה חוזית ללקוח (אם נפרנו -- יש פיצוי). **SLO** = יעד פנימי שחמור יותר מ-SLA (מרווח ביטחון). **SLI** = המדד בפועל. דוגמה: SLA = 99.9% Uptime. SLO = 99.95% Uptime. SLI = 99.97% (מה שמדדנו בפועל). ה-SLO תמיד חמור מה-SLA כדי שיהיה **Error Budget** -- מרווח ביטחון לפני שמפרים את ה-SLA.

??? tip "הסבירו מה זה Docker ולמה הוא חשוב"
    Docker הוא כלי שאורז אפליקציה עם כל מה שהיא צריכה (קוד, Libraries, הגדרות) לתוך **Container** -- יחידה קלה ומבודדת שרצה באופן זהה בכל סביבה. זה פותר את "It Works on My Machine" כי ה-Container זהה בכל מקום. בנוסף: קל יותר ל-Scale (מרימים עוד Containers), ל-Deploy (שולחים Image אחד), ולנהל (Kubernetes מנהל Containers).

??? tip "מה זה Feature Flag ומתי משתמשים בזה?"
    Feature Flag (או Feature Toggle) הוא מנגנון שמאפשר להפעיל או לכבות Feature ב-Production בלי Deploy חדש. שימושים: **Gradual Rollout** (להפעיל Feature ל-10% מהמשתמשים ולבדוק), **Kill Switch** (לכבות Feature בעייתי מיידית), **A/B Testing** (להראות גרסאות שונות למשתמשים שונים), **Trunk-based Development** (כולם עובדים על Branch אחד, Features לא גמורים "כבויים").

---

## Links to other notes

- [מפת תפקידים (Roles Map)](./roles-map.md) -- מי אחראי על מה בדרך ל-Production?
- [Docker](../04-systems/docker.md) -- הכלי שפותר את "It works on my machine"
- [CI/CD](../04-systems/ci-cd.md) -- איך עושים Deploy אוטומטי בצורה בטוחה
- [AI, ML & DL](./ai-ml-dl.md) -- איך מודלי ML מגיעים ל-Production?
