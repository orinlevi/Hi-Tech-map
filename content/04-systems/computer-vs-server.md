# מחשב מול שרת (Computer vs Server)

## למה זה חשוב

כל מי שעובד ב-High Tech ישמע את המילה "שרת" עשרות פעמים ביום.
הבנה של מה זה בעצם שרת, ואיך הוא שונה מהמחשב שעליו אתם עובדים, היא בסיס הכרחי להבנת כל תשתית טכנולוגית מודרנית.

- כשמריצים קוד ב-production -- הוא רץ על שרת
- כשעושים deploy לאפליקציה -- היא עולה על שרת
- כשמדברים על "הענן" -- מדברים על שרתים של מישהו אחר

!!! note "וואלה, סיפור אמיתי"
    מפתח ג'וניור שלח פעם מייל לצוות: "הלוקלהוסט שלי לא עובד מהבית, אפשר להרים לי שרת?" -- מה שהוא התכוון זה שהוא שכח לעשות `npm start`. נקודת המוצא הזו חשובה: שרת זה לא קסם, זה מחשב עם תפקיד.

## רעיונות מרכזיים

### שרת זה פשוט מחשב עם תפקיד

אין הבדל מהותי בין מחשב לשרת. שרת הוא מחשב שמוגדר **לשרת** (to serve) בקשות של מחשבים אחרים.

| תכונה | מחשב אישי (PC) | שרת (Server) |
|--------|----------------|---------------|
| מסך | כן | בדרך כלל לא |
| מערכת הפעלה | Windows / macOS | לרוב Linux |
| זמינות | דולק כשצריך | דולק 24/7 |
| חיבור רשת | Wi-Fi / Ethernet | Ethernet מהיר, לפעמים כמה כרטיסי רשת |
| מטרה | עבודה אינטראקטיבית | שירות בקשות |
| Redundancy | אין | לרוב יש כפילות (RAID, dual PSU, dual NIC) |
| ניהול מרחוק | RDP / VNC | IPMI / iLO / iDRAC + SSH |

??? tip "למי שלא ישן אתמול בלילה"
    שרת = מחשב שלא ישן אף פעם. כמו הברמן של האינטרנט -- תמיד שם, תמיד מגיש, ואף פעם לא מתלונן (חוץ מב-logs).

### שרת פיזי מול instance בענן

```
שרת פיזי (On-Premise)          Cloud Instance (AWS / GCP / Azure)
┌──────────────────────┐        ┌──────────────────────┐
│  חומרה אמיתית שלכם   │        │  מכונה וירטואלית     │
│  בחדר שרתים שלכם     │        │  על חומרה של ספק הענן│
│  אתם אחראים על הכל   │        │  הספק אחראי על חומרה │
└──────────────────────┘        └──────────────────────┘
```

!!! note "On-Premise vs Cloud"
    - **On-Premise** (לפעמים מקוצר ל-On-Prem): השרתים פיזית אצלכם בארגון. אתם קונים, מתחזקים, ומנהלים את החומרה.
    - **Cloud**: אתם שוכרים כוח מחשוב מספק ענן. משלמים לפי שימוש, ויכולים להגדיל או להקטין קיבולת תוך דקות.

### שלושת ספקי הענן הגדולים

- **AWS** (Amazon Web Services) -- הוותיק והגדול ביותר
- **GCP** (Google Cloud Platform) -- חזק במיוחד ב-Data וב-ML
- **Azure** (Microsoft) -- פופולרי בארגונים שעובדים עם מוצרי Microsoft

### Bare Metal מול VMs מול Containers

אחד הדברים הכי חשובים להבין הוא **רמות האבסטרקציה** של חישוב. כל רמה "עוטפת" את הקודמת ומוסיפה גמישות -- אבל גם overhead:

```
┌──────────────────────────────────────────────────────┐
│  רמות אבסטרקציה של מחשוב                              │
│                                                      │
│  Bare Metal (ברזל חשוף)                               │
│  ┌────────────────────────────────────────────┐      │
│  │  OS רץ ישירות על החומרה                      │      │
│  │  ביצועים מקסימליים, שליטה מלאה               │      │
│  │  אין overhead של virtualization              │      │
│  │  דוגמה: שרת database ייעודי                  │      │
│  └────────────────────────────────────────────┘      │
│                                                      │
│  Virtual Machines (מכונות וירטואליות)                  │
│  ┌────────────────────────────────────────────┐      │
│  │  Hypervisor מחלק חומרה פיזית ל-VMs          │      │
│  │  כל VM עם OS עצמאי                          │      │
│  │  בידוד מלא בין VMs                          │      │
│  │  דוגמה: EC2 instance ב-AWS                  │      │
│  └────────────────────────────────────────────┘      │
│                                                      │
│  Containers (קונטיינרים)                              │
│  ┌────────────────────────────────────────────┐      │
│  │  חולקים kernel אחד                          │      │
│  │  קלים ומהירים לעלות                          │      │
│  │  בידוד ברמת process                          │      │
│  │  דוגמה: Docker container                    │      │
│  └────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

| תכונה | Bare Metal | VM | Container |
|--------|-----------|-----|-----------|
| זמן הפעלה | דקות (boot) | 30 שניות - דקות | שניות |
| גודל | שרת שלם | GB-ים (OS שלם) | MB-ים (רק האפליקציה) |
| בידוד | פיזי | חזק (hypervisor) | בינוני (kernel משותף) |
| ביצועים | מקסימליים | 90-98% מ-bare metal | כמעט native |
| גמישות | נמוכה | גבוהה | גבוהה מאוד |
| עלות | CAPEX גבוה | OPEX לפי שימוש | OPEX נמוך |
| דוגמה | שרת Oracle DB | EC2 / GCE | Docker / K8s Pod |

!!! note "וואלה, סיפור אמיתי"
    חברת סטארטאפ אחת שילמה 15,000$ בחודש על bare metal servers כי ה-CTO אמר "ענן זה יקר". אחרי שנה גילו שרוב השרתים רצים על 5% CPU. העברה לענן חסכה להם 80%. לפעמים bare metal הגיוני -- אבל צריך לדעת מתי.

### למה שרתים מריצים Linux?

- **יציבות** -- Linux יכול לרוץ חודשים ושנים בלי restart
- **משאבים** -- לא צריך GUI, אז יותר משאבים פנויים לעבודה האמיתית
- **חינמי וקוד פתוח** -- אין עלות רישיון
- **שליטה מלאה** -- אפשר לכוונן כל פרמטר במערכת
- **אבטחה** -- קהילה ענקית שמתקנת פרצות במהירות

??? tip "טיפ למתחילים"
    לא חייבים להתקין Linux על המחשב. אפשר להתחיל עם WSL (Windows Subsystem for Linux) על Windows, או פשוט לעבוד עם Terminal ב-macOS שמבוסס על Unix.

### הפצות Linux נפוצות בשרתים

| הפצה | מאפיין מרכזי | שימוש טיפוסי |
|------|-------------|--------------|
| **Ubuntu Server** | קל לשימוש, קהילה ענקית | סטארטאפים, development |
| **RHEL** (Red Hat Enterprise Linux) | יציבות, תמיכה מסחרית | ארגונים גדולים, enterprise |
| **CentOS Stream** | גרסה קהילתית של RHEL | שרתים שלא צריכים תמיכה |
| **Amazon Linux** | מותאם ל-AWS | EC2 instances |
| **Alpine** | מינימלי (5MB!) | Docker base images |
| **Debian** | יציב, אמין | שרתי web, database |

### Serverless -- שרתים בלי לנהל שרתים

??? tip "למי שלא ישן אתמול בלילה"
    Serverless זה כמו מונית: אתה לא צריך לדעת כלום על מכוניות, ביטוח, או חניה. אתה פשוט אומר לאן אתה רוצה להגיע ומשלם. עדיין יש נהג ומכונית (שרת), אתה פשוט לא מנהל אותם.

**Serverless** לא אומר שאין שרתים -- אומר שאתם **לא מנהלים** שרתים. ספק הענן מטפל בכל התשתית, ואתם מריצים רק קוד:

```
Traditional Server                    Serverless
┌─────────────────────┐              ┌─────────────────────┐
│  אתם מנהלים:         │              │  הספק מנהל:          │
│  - OS updates        │              │  - הכל               │
│  - Scaling           │              │                      │
│  - Patching          │              │  אתם כותבים:         │
│  - Monitoring        │              │  - פונקציה אחת       │
│  - הקוד עצמו          │              │  - וזהו!              │
└─────────────────────┘              └─────────────────────┘
```

**שירותי Serverless נפוצים:**

| שירות | ספק | מה עושה |
|-------|------|---------|
| **Lambda** | AWS | הרצת פונקציות בודדות |
| **Cloud Functions** | GCP | הרצת פונקציות בודדות |
| **Azure Functions** | Azure | הרצת פונקציות בודדות |
| **Fargate** | AWS | הרצת containers בלי לנהל שרתים |
| **Cloud Run** | GCP | הרצת containers ב-serverless |

```python
# דוגמה: AWS Lambda function
# הקוד הזה ירוץ רק כשמישהו שולח request
# משלמים רק על זמן הריצה (milliseconds!)

import json

def lambda_handler(event, context):
    name = event.get('name', 'World')
    return {
        'statusCode': 200,
        'body': json.dumps(f'Hello, {name}!')
    }

# לא צריך:
# - להגדיר שרת
# - לדאוג ל-scaling
# - לשלם כשאין traffic
```

**מתי Serverless מתאים:**

- API endpoints שמקבלים traffic לא אחיד (אחרי שתשברו את הפרודקשן פעם אחת כי לא הגדרתם scaling, תבינו למה serverless שווה)
- עיבוד events (קובץ הועלה, הודעה נשלחה)
- Cron jobs / scheduled tasks
- MVP ופרויקטים קטנים

**מתי Serverless לא מתאים:**

- Workloads עם traffic קבוע וגבוה (יכול להיות יקר)
- אפליקציות שצריכות state מתמשך
- משימות ארוכות (Lambda מוגבל ל-15 דקות)
- כשצריכים שליטה מלאה בסביבה

!!! warning "Cold Start"
    ב-Serverless, אם הפונקציה לא רצה כמה דקות, הענן "מכבה" אותה. כשמגיעה בקשה חדשה, לוקח 100ms-3s "להדליק" אותה מחדש. זה נקרא **Cold Start** וזה יכול להפריע לאפליקציות שדורשות latency נמוך.

### Edge Computing -- חישוב בקצה

**Edge Computing** מעביר חישוב **קרוב יותר למשתמש** -- במקום לשלוח הכל ל-data center מרכזי:

```
Traditional Cloud:
User (Israel) ──────────────> Data Center (US East)
              ~200ms RTT        מעבד הכל כאן

Edge Computing:
User (Israel) ──> Edge Node (Israel) ──> Origin (US East)
              ~5ms   מעבד מה שאפשר פה    רק מה שחייבים
```

**דוגמאות ל-Edge:**

| שירות | מה עושה | דוגמה |
|-------|---------|--------|
| **CloudFlare Workers** | קוד JavaScript ב-300+ מיקומים | API gateway, A/B testing |
| **AWS CloudFront Functions** | לוגיקה ב-CDN edge | URL rewriting, auth |
| **Vercel Edge Functions** | SSR קרוב למשתמש | Next.js applications |
| **Fastly Compute** | Wasm ב-edge | הגנת DDoS, routing |

??? tip "למי שלא ישן אתמול בלילה"
    Edge computing זה כמו סניף דואר שכונתי: במקום לנסוע לדואר ראשי בתל אביב בשביל כל חבילה, יש סניף קטן בשכונה שמטפל ברוב הדברים. רק דברים מסובכים מגיעים למרכז.

### Data Center -- הבית של השרתים

Data center הוא מתקן פיזי שמכיל אלפי עד מיליוני שרתים:

```
Data Center Layout (סכמטי):
┌──────────────────────────────────────────────┐
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  Row A  │  │  Row B  │  │  Row C  │     │
│  │ ┌─────┐ │  │ ┌─────┐ │  │ ┌─────┐ │     │
│  │ │Rack │ │  │ │Rack │ │  │ │Rack │ │     │
│  │ │ 42U │ │  │ │ 42U │ │  │ │ 42U │ │     │
│  │ │     │ │  │ │     │ │  │ │     │ │     │
│  │ │~40  │ │  │ │~40  │ │  │ │~40  │ │     │
│  │ │שרתים│ │  │ │שרתים│ │  │ │שרתים│ │     │
│  │ └─────┘ │  │ └─────┘ │  │ └─────┘ │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Cooling  │  │ Power    │  │ Networking│  │
│  │ System   │  │ (UPS +   │  │ (Switches │  │
│  │ (HVAC)   │  │ Generator│  │ + Routers)│  │
│  └──────────┘  └──────────┘  └───────────┘  │
└──────────────────────────────────────────────┘
```

**מושגים חשובים ב-Data Centers:**

- **Rack** -- ארון סטנדרטי (42U) שמכיל שרתים
- **U** (Unit) -- יחידת גובה (1.75 אינץ' / 4.45 ס"מ)
- **UPS** -- Uninterruptible Power Supply (חשמל גיבוי)
- **PUE** -- Power Usage Effectiveness (כמה אנרגיה הולכת לקירור מול חישוב)
- **Tier 1-4** -- רמות אמינות (Tier 4 = 99.995% uptime)

!!! note "וואלה, סיפור אמיתי"
    Google פעם שלחה צוות בחול לחקור data center שלא הגיב כצפוי. מסתבר שציפורים נכנסו למערכת האוורור ושיבשו את זרימת האוויר. Uptime 99.99% לא תמיד מכסה מקרים זואולוגיים.

## בלבולים נפוצים

- **"שרת חייב להיות מחשב חזק ויקר"** -- לא נכון. אפילו Raspberry Pi יכול לשמש כשרת. מה שהופך מחשב לשרת זה התפקיד, לא העוצמה.
- **"הענן זה משהו מאגי"** -- הענן זה פשוט שרתים של מישהו אחר. כשמעלים קוד ל-AWS, הוא רץ על מחשב פיזי אמיתי באיזה data center.
- **"On-Premise תמיד יותר זול"** -- לא בהכרח. בענן משלמים לפי שימוש ולא צריך צוות תחזוקה לחומרה. לפעמים זה יותר זול, לפעמים לא.
- **"Serverless זה בחינם"** -- לא. Serverless מאוד זול ל-traffic נמוך, אבל ל-traffic גבוה וקבוע יכול להיות יקר יותר מ-EC2 instance.
- **"Edge מחליף את ה-Cloud"** -- לא. Edge משלים את ה-cloud. הרוב המוחלט של הלוגיקה עדיין רץ ב-data centers מרכזיים.
- **"Bare Metal מיושן"** -- ממש לא. ל-workloads שדורשים ביצועים מקסימליים (databases גדולים, HPC, ML training), bare metal עדיף לפעמים על VMs.

## דוגמה קטנה

נניח שכתבתם אפליקציית web ב-Python. איך היא מגיעה למשתמשים?

```bash
# על המחשב שלכם (development)
python app.py
# האפליקציה רצה על localhost:5000
# רק אתם יכולים לגשת אליה

# על שרת (production)
# 1. מעלים את הקוד לשרת (למשל EC2 instance ב-AWS)
ssh ubuntu@my-server-ip
cd /app
python app.py --host 0.0.0.0 --port 80
# עכשיו כל העולם יכול לגשת לאפליקציה דרך ה-IP של השרת
```

!!! warning "אזהרה"
    בפועל, לעולם לא מריצים אפליקציה ישירות עם `python app.py` ב-production. משתמשים ב-Docker, ב-reverse proxy כמו Nginx, וב-process manager כמו Gunicorn. נלמד על זה בהמשך.

### דוגמה מורחבת: השוואת עלויות hosting

```
פרויקט: API endpoint שמקבל ~100K requests/day

אופציה 1: EC2 Instance (t3.medium)
  $0.0416/hour x 730 hours = ~$30/month
  + אתם מנהלים: OS updates, scaling, monitoring

אופציה 2: Serverless (AWS Lambda)
  100K requests x $0.0000002 per request = $0.02/month
  + $0.00001667 per GB-second compute
  ~$5-15/month (תלוי בזמן ריצה)
  + AWS מנהלת: הכל

אופציה 3: Container (AWS Fargate)
  ~$15-25/month
  + Fargate מנהלת: infrastructure
  + אתם מנהלים: Docker image

אופציה 4: Edge (CloudFlare Workers)
  Free tier: 100K requests/day בחינם!
  Paid: $5/month + $0.50 per million requests
  + Ultra-low latency
```

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מערכות הפעלה — Linux, processes, virtualization
    - מבנה מחשבים — server hardware, architecture

    **קורסים מומלצים:**
    - Cloud Computing — IaaS, PaaS, SaaS, serverless
    - DevOps Engineering — deployment, infrastructure management
    - רשתות מחשבים — data center networking

    **ידע מעשי:**
    - Linux CLI — ssh, systemctl, journalctl
    - AWS / GCP / Azure — cloud providers
    - Docker — containerization basics
    - VirtualBox / VMware — virtualization

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבנה מחשבים (0368-2159)
    - מערכות הפעלה (0368-2162)

---

## 🛤️ מאיפה מתחילים

1. **להבין את הבסיס** -- התקינו Linux (WSL על Windows, או השתמשו ב-Terminal ב-macOS). תלמדו פקודות בסיסיות: `ssh`, `ls`, `cd`, `top`
2. **לשחק עם שרת אמיתי** -- פתחו חשבון חינמי ב-AWS (Free Tier) והרימו EC2 instance. התחברו אליו עם SSH
3. **להבין VMs** -- נסו VirtualBox על המחשב. התקינו Ubuntu Server ותראו איך שרת נראה מבפנים
4. **לנסות Serverless** -- צרו Lambda function פשוטה ב-AWS או Cloud Function ב-GCP. ראו כמה זה קל
5. **להכיר Docker** -- התקינו Docker Desktop והריצו `docker run nginx`. ברכות, יש לכם שרת web
6. **להשוות** -- העלו את אותה אפליקציה על EC2, על Lambda, ועל Docker. השוו חוויה, עלות, ומורכבות

**משאבים מומלצים:**

- [Linux Journey](https://linuxjourney.com/) -- מדריך אינטראקטיבי ל-Linux (חינם)
- [AWS Free Tier](https://aws.amazon.com/free/) -- 12 חודשים של שירותים בחינם
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials) -- מדריכים מצוינים לשרתים

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין שרת פיזי, VM, ו-Container?"
    **שרת פיזי (Bare Metal):** מחשב שלם עם חומרה ייעודית. OS רץ ישירות על החומרה. ביצועים מקסימליים אבל גמישות נמוכה -- כל שינוי דורש עבודה ידנית.

    **VM (Virtual Machine):** שכבת תוכנה (Hypervisor) מחלקת חומרה פיזית למספר מכונות וירטואליות. כל VM מריצה OS שלם. בידוד חזק בין VMs, אבל overhead של ~2-10% בביצועים.

    **Container:** process מבודד שחולק kernel עם המארח. קל (MB-ים), מהיר לעלות (שניות), ו-portable. בידוד חלש יותר מ-VM אבל הרבה יותר efficient.

??? tip "מה ההבדל בין Continuous Delivery ל-Continuous Deployment?"
    **Continuous Delivery** -- הקוד תמיד מוכן ל-deploy אחרי שעבר את כל הבדיקות, אבל ה-deploy ל-production דורש אישור ידני (לחיצה על כפתור).

    **Continuous Deployment** -- ה-deploy ל-production אוטומטי לגמרי. כל שינוי שעובר את הבדיקות עולה מיד ל-production בלי התערבות אנושית.

    רוב הארגונים משתמשים ב-Delivery כי רוצים אישור אנושי לפני production, במיוחד במערכות קריטיות.

??? tip "מתי הייתם בוחרים Serverless ומתי שרת מסורתי?"
    **Serverless מתאים כש:**
    - Traffic לא אחיד (spikes ואז שקט)
    - פונקציות קצרות וממוקדות
    - רוצים zero maintenance
    - פרויקט בתחילת הדרך (MVP)

    **שרת מסורתי מתאים כש:**
    - Traffic קבוע וגבוה (serverless יכול להיות יקר יותר)
    - צריך שליטה מלאה בסביבה
    - משימות ארוכות (Lambda מוגבל ל-15 דקות)
    - צריך state מתמשך או persistent connections (WebSocket)

??? tip "הסבירו Cold Start ב-Serverless ואיך מתמודדים איתו?"
    **Cold Start** קורה כשפונקציה serverless לא רצה תקופה -- הספק "מכבה" אותה. כשמגיעה בקשה חדשה, צריך להקצות resources, לטעון את הקוד, ולאתחל. זה לוקח 100ms עד כמה שניות.

    **פתרונות:**
    - **Provisioned Concurrency** (AWS) -- שומרים instances חמים
    - **שפה קלה** -- Go/Rust נטענים מהר יותר מ-Java/C#
    - **מינימום dependencies** -- פחות קוד = cold start מהיר יותר
    - **Scheduled warm-up** -- ping כל כמה דקות
    - **Edge functions** -- CloudFlare Workers כמעט ללא cold start

??? tip "מה זה PUE ולמה זה חשוב ב-data centers?"
    **PUE (Power Usage Effectiveness)** = סך כל צריכת האנרגיה של ה-data center חלקי צריכת האנרגיה של ציוד ה-IT.

    PUE 1.0 = מושלם (כל האנרגיה הולכת לחישוב). PUE 2.0 = חצי מהאנרגיה הולכת לקירור/תאורה.

    Data centers מודרניים שואפים ל-PUE של 1.1-1.3. Google מדווחת על PUE ממוצע של 1.1.

    זה חשוב כי data centers צורכים 1-2% מכלל החשמל בעולם, וה-PUE משפיע ישירות על עלות תפעול ועל ה-carbon footprint.

??? tip "הסבירו את ההבדל בין IaaS, PaaS, ו-SaaS."
    **IaaS (Infrastructure as a Service)** -- אתם מקבלים VM, רשת, storage. אתם מנהלים את ה-OS, middleware, ואפליקציה. דוגמה: AWS EC2, Google Compute Engine.

    **PaaS (Platform as a Service)** -- אתם מקבלים פלטפורמה מוכנה. אתם מעלים קוד והפלטפורמה מטפלת בשאר. דוגמה: Heroku, Google App Engine, AWS Elastic Beanstalk.

    **SaaS (Software as a Service)** -- תוכנה מוכנה שמשתמשים בה דרך הדפדפן. דוגמה: Gmail, Slack, Salesforce.

    ככל שעולים במודל (IaaS -> PaaS -> SaaS), יש פחות שליטה אבל פחות עבודת תחזוקה.

## קישורים לנושאים אחרים

- [יסודות חומרה](hardware-basics.md) -- להבין מה יש בתוך השרת
- [Client-Server](../03-networks/client-server.md) -- איך מחשבים מתקשרים עם שרתים
- [Docker](docker.md) -- איך מריצים אפליקציות על שרתים בצורה מודרנית
