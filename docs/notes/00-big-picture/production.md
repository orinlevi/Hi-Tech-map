# פרודקשן (Production)

## Why it matters

אתם יכולים לכתוב את הקוד הכי מבריק בעולם -- אבל אם הוא לא **רץ בצורה יציבה בשרת אמיתי** ומשרת משתמשים אמיתיים, אין לו ערך עסקי. **Production** (או "פרודקשן") הוא הסביבה שבה הקוד שלכם באמת חי, ומהרגע שהוא שם -- הכל צריך לעבוד.

!!! note "למה זה חשוב כבר מההתחלה?"
    גם אם אתם מתחילים ללמוד, הבנת Production עוזרת לכם לכתוב קוד טוב יותר **מהיום הראשון** -- קוד שקל לבדוק, קל ל-Deploy, וקל לתחזק.

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
                        Deploy to Production 🚀
                               │
                               ▼
                        Monitoring & Alerting
                        (שומרים שהכל עובד)
```

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
- לדוגמה: "Error Rate עלה מ-0.1% ל-5% בדקה האחרונה" → SMS / Slack / PagerDuty.

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
# → הצוות בודק את ה-Feature החדש

# שלב 5: Deploy ל-Production
# → המשתמשים רואים את ה-Feature החדש

# שלב 6: Monitoring
# → Grafana מראה: Response Time = 45ms, Error Rate = 0.01%
# → הכל תקין ✅
```

??? tip "מה קורה אם משהו נשבר?"
    ```
    🔴 Alert: Error Rate spike to 12%!
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

---

## Links to other notes

- [מפת תפקידים (Roles Map)](./roles-map.md) -- מי אחראי על מה בדרך ל-Production?
- [Docker](../04-systems/docker.md) -- הכלי שפותר את "It works on my machine"
- [CI/CD](../04-systems/ci-cd.md) -- איך עושים Deploy אוטומטי בצורה בטוחה
