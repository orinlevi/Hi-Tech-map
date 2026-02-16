# Sandbox

## למה זה חשוב

דמיינו שאתם מריצים קוד שקיבלתם מהאינטרנט — ואין לכם מושג מה הוא עושה. בלי Sandbox, הקוד הזה יכול לגשת לכל קובץ במחשב, לשלוח מידע לשרת מרוחק, או למחוק את כל הדיסק.

**Sandboxing** הוא העיקרון שאומר: הרץ קוד לא מהימן בסביבה מבודדת, כך שגם אם הוא זדוני — הוא לא יכול לפגוע בשאר המערכת. זה אחד מעקרונות הבסיס של אבטחת מידע מודרנית.

## רעיונות מרכזיים

### מהו Sandbox?

Sandbox הוא **סביבת הרצה מבודדת** שמגבילה את המשאבים והפעולות שתהליך יכול לבצע.

```text
┌─────────────────────────────────────────┐
│            מערכת ההפעלה                  │
│                                         │
│  ┌─────────────┐   ┌─────────────┐      │
│  │  Sandbox A  │   │  Sandbox B  │      │
│  │ ┌─────────┐ │   │ ┌─────────┐ │      │
│  │ │ Process │ │   │ │ Process │ │      │
│  │ └─────────┘ │   │ └─────────┘ │      │
│  │ 🔒 מבודד   │   │ 🔒 מבודד   │      │
│  └─────────────┘   └─────────────┘      │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  File System, Network, Kernel    │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### דוגמאות ל-Sandboxing בפועל

**Browser Sandbox:**

- כל Tab בדפדפן רץ בתהליך (Process) נפרד
- JavaScript של אתר אחד לא יכול לגשת לנתונים של Tab אחר
- גישה ל-File System חסומה — אתר לא יכול לקרוא קבצים מהמחשב

**Container Isolation (Docker):**

- כל Container רואה רק את ה-File System שלו
- Namespaces מפרידים בין תהליכים, רשת ומשתמשים
- cgroups מגבילים CPU, זיכרון ו-I/O

!!! note "Container לא VM"
    Container חולק את ה-Kernel עם ה-Host, בניגוד ל-Virtual Machine שמריצה מערכת הפעלה שלמה. זה אומר שה-Isolation ב-Container חלש יותר מ-VM, אבל הביצועים טובים יותר.

**מנגנונים נוספים:**

- **chroot** — מגביל תהליך לתיקייה מסוימת ב-File System
- **seccomp** — מגביל אילו System Calls תהליך יכול לבצע
- **AppArmor / SELinux** — מדיניות אבטחה ברמת ה-Kernel

### Principle of Least Privilege

??? tip "העיקרון שצריך להנחות כל החלטת אבטחה"
    **תן לכל תהליך/משתמש את ההרשאות המינימליות** שנדרשות לביצוע המשימה — ולא יותר.

    - שרת Web צריך לקרוא קבצי HTML? תן לו גישת קריאה **רק** לתיקייה הרלוונטית
    - Script שמגבה מסד נתונים? תן לו הרשאת `SELECT` בלבד, לא `DROP TABLE`
    - אפליקציית Mobile? בקש הרשאות GPS רק כשהמשתמש באמת צריך מפה

```text
❌ שגוי:   chmod 777 /var/www    (כולם יכולים לקרוא, לכתוב ולהריץ)
✅ נכון:   chmod 644 /var/www    (בעלים כותב, אחרים רק קוראים)
```

!!! warning "Root/Admin — רק כשבאמת חייבים"
    הרצת תהליכים כ-Root היא מתכון לאסון. אם תוקף משתלט על תהליך שרץ כ-Root, יש לו שליטה מלאה על המכונה. תמיד השתמשו ב-User מוגבל ותנו הרשאות ספציפיות.

### שכבות של Isolation

| שכבה | מה מבודד | דוגמה |
|------|----------|-------|
| **Process** | זיכרון בין תהליכים | כל Tab בדפדפן |
| **Container** | File System, רשת, PIDs | Docker Container |
| **VM** | מערכת הפעלה שלמה | EC2 Instance |
| **Hardware** | חומרה פיזית | שרת ייעודי |

ככל שעולים בשכבות — ה-Isolation חזק יותר, אבל ה-Overhead גבוה יותר.

## בלבולים נפוצים

- **"Container = אבטחה מלאה"** — Container מספק Isolation ברמה טובה, אבל הוא לא בלתי חדיר. Kernel Exploits יכולים לפרוץ מ-Container ל-Host. לאבטחה קריטית, שלבו עם VM.
- **"Sandbox מונע את כל ההתקפות"** — Sandbox מגביל נזק, אבל לא מונע את ההתקפה עצמה. קוד זדוני עדיין יכול לרוץ בתוך ה-Sandbox.
- **"Browser Sandbox עובד רק ב-Chrome"** — כל הדפדפנים המודרניים משתמשים ב-Sandboxing. Chrome היה מהראשונים, אבל Firefox, Edge ו-Safari כולם מיישמים מנגנונים דומים.

## דוגמה קטנה

הדגמה של Isolation באמצעות Docker — נריץ תהליך שיכול לגשת רק לתיקייה אחת:

```dockerfile
# Dockerfile
FROM python:3.11-slim

# יוצרים User מוגבל (לא Root!)
RUN useradd --create-home appuser

# מעתיקים רק את מה שצריך
COPY app.py /home/appuser/app.py

# עוברים ל-User המוגבל
USER appuser
WORKDIR /home/appuser

# התהליך רואה רק את /home/appuser
CMD ["python", "app.py"]
```

```bash
# הרצה עם הגבלות נוספות
docker run \
  --read-only \            # File System לקריאה בלבד
  --memory=128m \          # מקסימום 128MB זיכרון
  --cpus=0.5 \             # חצי CPU
  --network=none \         # בלי גישה לרשת
  my-sandboxed-app
```

??? tip "מה קורה אם הקוד בתוך ה-Container מנסה לגשת לרשת?"
    עם `--network=none`, כל ניסיון לפתוח חיבור רשת ייכשל. התהליך מבודד לחלוטין מהעולם החיצוני.

## קישורים לנושאים אחרים

- [Credentials](credentials.md) — גם עם Sandbox, ניהול נכון של Credentials הוא קריטי כשכבת הגנה נוספת
- [Red, Blue & Purple Teams](red-blue-purple.md) — צוותי Red Team מנסים לפרוץ מ-Sandboxes כחלק מבדיקות חדירה
- [Docker](../04-systems/docker.md) — הכלי הנפוץ ביותר ל-Container Isolation בסביבות פיתוח ו-Production
