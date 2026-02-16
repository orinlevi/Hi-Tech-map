# מהו מסד נתונים (What is a Database)

## למה זה חשוב

כל אפליקציה, אתר אינטרנט, או מערכת תוכנה צריכים לשמור נתונים — משתמשים, הזמנות, מוצרים, לוגים, ועוד. אפשר לשמור הכל בקבצים רגילים, אבל ברגע שהמערכת גדלה, זה הופך לסיוט.

**Database** הוא הפתרון: אוסף מאורגן של נתונים שמנוהל על ידי תוכנה ייעודית. הבנה של מסדי נתונים היא מיומנות בסיסית לכל מפתח — בין אם אתם בונים אפליקציית Web, מאמנים מודל ML, או מתכננים מערכת מבוזרת.

## רעיונות מרכזיים

### מהו Database?

**Database** הוא אוסף מאורגן של נתונים שנשמר באופן שמאפשר גישה, עדכון ושליפה בצורה יעילה.

!!! note "Database vs File"
    קובץ טקסט יכול לשמור נתונים — אבל מה קורה כשמאה משתמשים ניגשים לקובץ בו-זמנית? מה קורה כשצריך למצוא שורה אחת מתוך מיליון? מה קורה כשהחשמל נופל באמצע כתיבה? **Database פותר את כל הבעיות האלה.**

### למה לא סתם קבצים?

| בעיה | קבצים רגילים | Database |
|------|---------------|----------|
| **גישה מקבילית** | שני תהליכים כותבים — נתונים נדרסים | נעילות ו-Transactions מונעים התנגשויות |
| **חיפוש** | צריך לסרוק את כל הקובץ | Indexes מאפשרים חיפוש מהיר |
| **עקביות** | קריסה באמצע = נתונים פגומים | Recovery מבטיח עקביות |
| **מבנה** | כל שורה יכולה להיות שונה | Schema מגדיר מבנה אחיד |

### מהו DBMS?

**DBMS** (Database Management System) הוא התוכנה שמנהלת את ה-Database. היא מספקת:

- **שפת שאילתות** — כמו SQL — לשליפה ועדכון נתונים
- **ניהול גישה** — מי מורשה לקרוא או לכתוב
- **אופטימיזציה** — ביצוע שאילתות בצורה היעילה ביותר
- **גיבוי ושחזור** — הגנה מפני אובדן נתונים

דוגמאות: **PostgreSQL**, **MySQL**, **MongoDB**, **Redis**, **SQLite**

### תכונות ACID

כשמבצעים פעולה ב-Database (Transaction), אנחנו רוצים ארבעה דברים:

!!! warning "ארבע תכונות שמגנות על הנתונים"
    - **Atomicity** — או שכל הפעולה מתבצעת, או שכלום לא. אין "חצי העברה בנקאית".
    - **Consistency** — ה-Database תמיד עובר ממצב תקין למצב תקין. חוקים (Constraints) נשמרים.
    - **Isolation** — פעולות מקביליות לא רואות אחת את השינויים של השנייה עד שהן מסתיימות.
    - **Durability** — אחרי ש-Transaction הושלם, השינויים שמורים גם אם המערכת קורסת.

??? tip "לא כל Database תומך ב-ACID מלא"
    מסדי נתונים Relational (כמו PostgreSQL) בדרך כלל תומכים ב-ACID מלא. מסדי NoSQL רבים מוותרים על חלק מתכונות ה-ACID תמורת ביצועים ו-Scalability. זה Trade-off מודע — לא באג.

## בלבולים נפוצים

- **"Database ו-DBMS זה אותו דבר"** — לא בדיוק. ה-Database הוא הנתונים עצמם, וה-DBMS הוא התוכנה שמנהלת אותם. כשאומרים "PostgreSQL" מתכוונים ל-DBMS.
- **"SQL הוא Database"** — SQL היא **שפה** לתקשורת עם מסדי נתונים Relational. היא לא ה-Database עצמו.
- **"אפשר להסתדר בלי Database"** — עבור פרויקט קטן כן, אבל כל מערכת Production רצינית צריכה Database. גם SQLite (קובץ בודד) הוא Database.
- **"NoSQL אומר No SQL"** — למעשה NoSQL פירושו "Not Only SQL". רבים מהם תומכים בשפות שאילתות משלהם.

## דוגמה קטנה

דוגמה פשוטה עם **SQLite** ב-Python — יצירת טבלה, הכנסת נתונים, ושליפה:

```python
import sqlite3

# יצירת חיבור ל-Database (קובץ מקומי)
conn = sqlite3.connect("students.db")
cursor = conn.cursor()

# יצירת טבלה
cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        grade REAL
    )
""")

# הכנסת נתונים
cursor.execute("INSERT INTO students (name, grade) VALUES (?, ?)", ("Alice", 95.5))
cursor.execute("INSERT INTO students (name, grade) VALUES (?, ?)", ("Bob", 87.0))

# שמירת השינויים (Commit = Durability!)
conn.commit()

# שליפת נתונים
cursor.execute("SELECT name, grade FROM students WHERE grade > 90")
for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]}")  # Alice: 95.5

conn.close()
```

??? tip "מה קורה מאחורי הקלעים?"
    כש-SQLite מבצעת `commit()`, היא כותבת את השינויים לדיסק בצורה שמבטיחה **Durability** — גם אם התוכנית קורסת מיד אחרי, הנתונים שמורים. זה ה-D ב-ACID.

## קישורים לנושאים אחרים

- [Relational מול NoSQL](relational-vs-nosql.md) — השוואה בין שני הסוגים העיקריים של מסדי נתונים
- [סכמות ומודלים (Schemas and Models)](schemas-and-models.md) — איך מגדירים את המבנה של הנתונים
- [למה מבני נתונים](../01-algorithmics/data-structures-why.md) — מבני הנתונים שנמצאים בתוך ה-Database (Trees, Hash Tables ועוד)
