# מהו מסד נתונים (What is a Database)

## למה זה חשוב

כל אפליקציה, אתר אינטרנט, או מערכת תוכנה צריכים לשמור נתונים — משתמשים, הזמנות, מוצרים, לוגים, ועוד. אפשר לשמור הכל בקבצים רגילים, אבל ברגע שהמערכת גדלה, זה הופך לסיוט.

**Database** הוא הפתרון: אוסף מאורגן של נתונים שמנוהל על ידי תוכנה ייעודית. הבנה של מסדי נתונים היא מיומנות בסיסית לכל מפתח — בין אם אתם בונים אפליקציית Web, מאמנים מודל ML, או מתכננים מערכת מבוזרת.

!!! quote "ציטוט שכדאי לזכור"
    "Data is the new oil" — אבל בלי Database, הנפט הזה פשוט נשפך על הרצפה ומלכלך את כל הפרויקט.

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
| **אבטחה** | הרשאות ברמת הקובץ בלבד | הרשאות ברמת טבלה, שורה, ועמודה |
| **גיבוי** | ידני, מועד לשגיאות | אוטומטי עם Point-in-Time Recovery |

!!! tip "הנה הוכחה חיה"
    תדמיינו אקסל עם מיליון שורות. עכשיו תדמיינו 50 אנשים עורכים אותו בו-זמנית. עכשיו תדמיינו שמישהו סוגר את המחשב באמצע שמירה. ברוכים הבאים לעולם בלי Database.

### סוגי מסדי נתונים — מבט-על

לפני שצוללים לעומק, הנה מפת הנוף של עולם ה-Databases:

```
                        Databases
                           │
            ┌──────────────┼──────────────┐
            │              │              │
       Relational       NoSQL        NewSQL
       (SQL)                         (Hybrid)
            │              │
     ┌──────┴───┐    ┌────┼────┬────────┐
     │          │    │    │    │        │
  PostgreSQL  MySQL  Doc  KV  Column  Graph
                     │    │    │        │
                  MongoDB Redis Cassandra Neo4j
```

| קטגוריה | דוגמאות | מתי? |
|---------|---------|------|
| **Relational** | PostgreSQL, MySQL, SQLite | נתונים מובנים עם קשרים |
| **Document** | MongoDB, CouchDB | נתונים גמישים, JSON-like |
| **Key-Value** | Redis, DynamoDB | Cache, Sessions |
| **Column-Family** | Cassandra, HBase | Big Data, כתיבה מסיבית |
| **Graph** | Neo4j, ArangoDB | רשתות חברתיות, המלצות |
| **Vector** | Pinecone, Milvus, Chroma | Embeddings, חיפוש סמנטי |
| **Time-Series** | InfluxDB, TimescaleDB | מדידות לאורך זמן, IoT |

### מהו DBMS?

**DBMS** (Database Management System) הוא התוכנה שמנהלת את ה-Database. היא מספקת:

- **שפת שאילתות** — כמו SQL — לשליפה ועדכון נתונים
- **ניהול גישה** — מי מורשה לקרוא או לכתוב
- **אופטימיזציה** — ביצוע שאילתות בצורה היעילה ביותר
- **גיבוי ושחזור** — הגנה מפני אובדן נתונים
- **ניטור וניהול** — כלים למעקב אחרי ביצועים ומשאבים

דוגמאות: **PostgreSQL**, **MySQL**, **MongoDB**, **Redis**, **SQLite**

??? info "מה ההבדל בין DBMS ל-RDBMS?"
    **RDBMS** (Relational DBMS) הוא DBMS שמבוסס על מודל Relational — כלומר טבלאות עם שורות ועמודות, עם תמיכה ב-SQL ו-ACID. כל RDBMS הוא DBMS, אבל לא כל DBMS הוא Relational. למשל, MongoDB הוא DBMS אבל לא RDBMS.

### תכונות ACID

כשמבצעים פעולה ב-Database (Transaction), אנחנו רוצים ארבעה דברים:

!!! warning "ארבע תכונות שמגנות על הנתונים"
    - **Atomicity** — או שכל הפעולה מתבצעת, או שכלום לא. אין "חצי העברה בנקאית".
    - **Consistency** — ה-Database תמיד עובר ממצב תקין למצב תקין. חוקים (Constraints) נשמרים.
    - **Isolation** — פעולות מקביליות לא רואות אחת את השינויים של השנייה עד שהן מסתיימות.
    - **Durability** — אחרי ש-Transaction הושלם, השינויים שמורים גם אם המערכת קורסת.

??? tip "לא כל Database תומך ב-ACID מלא"
    מסדי נתונים Relational (כמו PostgreSQL) בדרך כלל תומכים ב-ACID מלא. מסדי NoSQL רבים מוותרים על חלק מתכונות ה-ACID תמורת ביצועים ו-Scalability. זה Trade-off מודע — לא באג.

### ACID בפעולה — דוגמה מעשית

נניח שאליס מעבירה 100 שקל לבוב. מה קורה בלי ACID ומה קורה עם ACID?

```sql
-- Transaction: העברת כסף מאליס לבוב
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE name = 'Alice';
-- 💥 מה אם המערכת קורסת כאן?
UPDATE accounts SET balance = balance + 100 WHERE name = 'Bob';

COMMIT;
```

| מצב | בלי ACID | עם ACID |
|-----|---------|---------|
| **קריסה באמצע** | אליס איבדה 100 ש"ח, בוב לא קיבל כלום | כל ה-Transaction מתבטל (Rollback) |
| **שני משתמשים בו-זמנית** | תוצאות לא צפויות | Isolation מבטיח סדר |
| **אחרי Commit** | אולי נמחק | Durability מבטיח שמירה לדיסק |

!!! example "Isolation Levels — ארבע רמות בידוד"
    לא כל ה-Isolation שווה. יש Trade-off בין רמת הבידוד לביצועים:

    | רמה | מה מותר | ביצועים |
    |-----|---------|---------|
    | **Read Uncommitted** | קריאת נתונים שעוד לא עברו Commit | הכי מהיר |
    | **Read Committed** | קריאה רק של נתונים שעברו Commit | מהיר |
    | **Repeatable Read** | קריאה חוזרת מחזירה אותו תוצאה | בינוני |
    | **Serializable** | כאילו כל Transaction רץ לבד | הכי איטי |

### מבנה פנימי של Database

מה קורה "מתחת למכסה המנוע"?

```
┌──────────────────────────────────────────────┐
│               Application Layer              │
│          (SQL Parser, Query Optimizer)        │
├──────────────────────────────────────────────┤
│              Storage Engine                   │
│     ┌──────────────┬──────────────────┐      │
│     │   Buffer Pool │  Write-Ahead Log │      │
│     │   (Cache)     │  (WAL / Redo Log)│      │
│     └──────────────┴──────────────────┘      │
├──────────────────────────────────────────────┤
│                  Disk Storage                 │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│     │ Data    │  │ Index   │  │  WAL    │   │
│     │ Files   │  │ Files   │  │  Files  │   │
│     └─────────┘  └─────────┘  └─────────┘   │
└──────────────────────────────────────────────┘
```

??? info "Write-Ahead Log (WAL) — הסוד של Durability"
    לפני שה-Database כותב שינויים לנתונים עצמם, הוא כותב אותם ל-**WAL** — קובץ לוג רציף. אם המערכת קורסת, ה-Database יכול לשחזר את המצב מה-WAL. זו הסיבה שאחרי `COMMIT` הנתונים בטוחים — הם כבר ב-WAL, גם אם עדיין לא נכתבו לקבצי הנתונים הראשיים.

### Managed vs Self-Hosted

| | Self-Hosted | Managed (Cloud) |
|---|---|---|
| **דוגמאות** | PostgreSQL על EC2, MySQL על שרת פיזי | AWS RDS, Google Cloud SQL, Azure SQL |
| **אחריות** | אתם מנהלים הכל — גיבויים, עדכונים, Scaling | ספק הענן מטפל בתשתית |
| **עלות** | פחות עלות ישירה, הרבה עבודה | יותר יקר, פחות עבודה |
| **מתי?** | שליטה מלאה, דרישות מיוחדות | רוב המקרים ב-Production |

!!! tip "עצה מעשית"
    אם אתם לא צוות DevOps מנוסה — **התחילו עם Managed Database**. הזמן שחוסכים על ניהול תשתית שווה הרבה יותר מההפרש במחיר.

## בלבולים נפוצים

- **"Database ו-DBMS זה אותו דבר"** — לא בדיוק. ה-Database הוא הנתונים עצמם, וה-DBMS הוא התוכנה שמנהלת אותם. כשאומרים "PostgreSQL" מתכוונים ל-DBMS.
- **"SQL הוא Database"** — SQL היא **שפה** לתקשורת עם מסדי נתונים Relational. היא לא ה-Database עצמו.
- **"אפשר להסתדר בלי Database"** — עבור פרויקט קטן כן, אבל כל מערכת Production רצינית צריכה Database. גם SQLite (קובץ בודד) הוא Database.
- **"NoSQL אומר No SQL"** — למעשה NoSQL פירושו "Not Only SQL". רבים מהם תומכים בשפות שאילתות משלהם.
- **"Database בענן זה לא בטוח"** — ספקי ענן משקיעים מיליארדים באבטחה. בפועל, Database מנוהל בענן הוא לרוב **יותר מאובטח** מ-Database שהקמתם לבד על שרת ישן.
- **"כל Database מתאים לכל משימה"** — **לא**. PostgreSQL מעולה לנתוני משתמשים אבל גרוע ל-Cache. Redis מעולה ל-Cache אבל גרוע לשאילתות מורכבות. **Right tool for the right job.**

!!! danger "NULL — הערך שגורם למתכנתים לבכות משנות ה-70"
    NULL ב-Database זה לא 0, זה לא "", זה לא false. זה **"אין לי מושג"**. וזה מתנהג בצורה מפתיעה:

    ```sql
    SELECT NULL = NULL;    -- תוצאה: NULL (לא TRUE!)
    SELECT NULL != NULL;   -- תוצאה: NULL (לא TRUE!)
    SELECT NULL + 5;       -- תוצאה: NULL
    ```

    הפתרון? השתמשו ב-`IS NULL` ו-`IS NOT NULL`, ותמיד חשבו מה קורה עם ערכים חסרים.

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

### דוגמה מתקדמת — חיבור מ-Python ל-PostgreSQL

```python
import psycopg2

# חיבור ל-PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="myapp",
    user="admin",
    password="secret"  # בפרויקט אמיתי — משתנה סביבה!
)
cursor = conn.cursor()

# Transaction עם Error Handling
try:
    cursor.execute("""
        INSERT INTO users (name, email, created_at)
        VALUES (%s, %s, NOW())
    """, ("Alice", "alice@example.com"))

    cursor.execute("""
        INSERT INTO audit_log (action, user_email, timestamp)
        VALUES (%s, %s, NOW())
    """, ("USER_CREATED", "alice@example.com"))

    conn.commit()  # שתי הפעולות מתבצעות ביחד
    print("User created successfully")

except Exception as e:
    conn.rollback()  # אם משהו נכשל — הכל מתבטל
    print(f"Error: {e}")

finally:
    cursor.close()
    conn.close()
```

!!! note "תמיד השתמשו ב-Parameterized Queries"
    שימו לב ל-`%s` ול-Tuple שמועבר כפרמטר. **לעולם אל תשתמשו ב-f-string או concatenation** להרכבת SQL — זה פותח את הדלת ל-**SQL Injection**, אחת מהתקפות האבטחה הנפוצות ביותר.

    ```sql
    -- ❌ מסוכן (SQL Injection):
    f"SELECT * FROM users WHERE name = '{user_input}'"

    -- ✅ בטוח (Parameterized):
    "SELECT * FROM users WHERE name = %s", (user_input,)
    ```

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מסדי נתונים — SQL, ACID, relational model
    - מבני נתונים — trees, hash tables, storage structures

    **קורסים מומלצים:**
    - מערכות הפעלה — file systems, concurrency, transactions
    - אלגוריתמים — searching, sorting, complexity

    **ידע מעשי:**
    - SQLite / PostgreSQL — hands-on database operations
    - Python + psycopg2 / SQLAlchemy — database connectivity
    - SQL fundamentals — CREATE, INSERT, SELECT, JOIN
    - EXPLAIN ANALYZE — query performance analysis

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא למדעי הנתונים (0300-0300)
    - מבני נתונים (0368-2158)

---

## 🛤️ מאיפה מתחילים

```
שבוע 1-2: יסודות
─────────────────
□ התקינו SQLite (מגיע מותקן עם Python)
□ למדו פקודות בסיסיות: CREATE, INSERT, SELECT, UPDATE, DELETE
□ תרגלו ב-sqliteonline.com או DB Fiddle

שבוע 3-4: PostgreSQL
─────────────────────
□ התקינו PostgreSQL מקומית (או השתמשו ב-Docker)
□ למדו את ההבדלים בין SQLite ל-PostgreSQL
□ תרגלו JOINs, GROUP BY, Subqueries
□ הכירו כלי GUI כמו pgAdmin או DBeaver

שבוע 5-6: Database + קוד
─────────────────────────
□ חברו Python ל-PostgreSQL עם psycopg2
□ הכירו ORM כמו SQLAlchemy
□ בנו פרויקט קטן — למשל מערכת ניהול ספרים

שבוע 7-8: נושאים מתקדמים
─────────────────────────
□ למדו על Indexes ו-EXPLAIN
□ הכירו Migrations (Alembic / Flyway)
□ התנסו עם MongoDB (Document DB)
□ קראו על CAP Theorem ו-Distributed Databases
```

**משאבים מומלצים:**

- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) — מדריך מעולה מאפס
- [SQLBolt](https://sqlbolt.com/) — תרגול SQL אינטראקטיבי
- [Use The Index, Luke](https://use-the-index-luke.com/) — ספר חינמי על Indexes ואופטימיזציה
- **Mode SQL Tutorial** — תרגולים עם נתונים אמיתיים

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Database ל-DBMS?"
    **Database** הוא אוסף הנתונים עצמם. **DBMS** הוא התוכנה שמנהלת את הנתונים — מספקת שפת שאילתות, ניהול גישה, אופטימיזציה וגיבוי. כשאומרים "PostgreSQL" מתכוונים ל-DBMS, לא ל-Database ספציפי.

??? tip "הסבר את תכונות ACID ותן דוגמה"
    **Atomicity** — Transaction הוא all-or-nothing. דוגמה: העברה בנקאית — או שגם המשיכה וגם ההפקדה מתבצעות, או ששום דבר לא קורה.
    **Consistency** — ה-Database עובר ממצב תקין למצב תקין. דוגמה: אם יש Constraint ש-balance >= 0, אי אפשר למשוך כסף שאין.
    **Isolation** — Transactions מקבילים לא מפריעים זה לזה. דוגמה: שני אנשים שמנסים לקנות את הפריט האחרון במלאי.
    **Durability** — אחרי COMMIT, הנתונים שמורים גם אם השרת קורס. מימוש: Write-Ahead Log (WAL).

??? tip "מהו SQL Injection ואיך מתגוננים?"
    **SQL Injection** הוא מתקפה שבה התוקף מזריק SQL זדוני דרך קלט של המשתמש. לדוגמה, אם הקלט הוא `'; DROP TABLE users; --`, והקוד משתמש ב-string concatenation, הוא ימחק את כל הטבלה. **ההגנה**: תמיד להשתמש ב-**Parameterized Queries** (Prepared Statements) ולעולם לא לשרשר קלט משתמש לתוך SQL.

??? tip "מה ההבדל בין Vertical Scaling ל-Horizontal Scaling?"
    **Vertical Scaling** (Scale Up) — הגדלת המשאבים של שרת בודד (יותר CPU, RAM, Disk). פשוט אבל יש תקרה פיזית. **Horizontal Scaling** (Scale Out) — הוספת שרתים נוספים. מאפשר גדילה כמעט אינסופית אבל מסובך יותר. Relational DBs בד"כ Vertical, NoSQL בד"כ Horizontal.

??? tip "מתי תבחר SQLite ומתי PostgreSQL?"
    **SQLite**: פרויקטים קטנים, אפליקציות מובייל, Embedded Systems, Testing, Prototyping. יתרון: Zero Configuration, קובץ בודד. **PostgreSQL**: מערכות Production, גישה מקבילית גבוהה, נתונים מורכבים, צורך ב-Replication. יתרון: תמיכה מלאה ב-ACID, Extensions (כמו PostGIS, pgvector), ביצועים מצוינים.

??? tip "מהו Connection Pooling ולמה צריך את זה?"
    פתיחת חיבור ל-Database היא פעולה יקרה (TCP handshake, authentication). **Connection Pool** שומר חיבורים פתוחים ומשתף אותם בין בקשות. כלים פופולריים: **PgBouncer** ל-PostgreSQL, **HikariCP** ל-Java. בלי Pool, אפליקציה עם 1000 בקשות בו-זמנית תנסה לפתוח 1000 חיבורים — מה שיהרוס את ה-Database.

??? tip "מה ההבדל בין DELETE, TRUNCATE ו-DROP?"
    **DELETE** — מוחק שורות ספציפיות, ניתן לשחזור (Rollback), מפעיל Triggers. **TRUNCATE** — מוחק את כל השורות בטבלה, מהיר יותר, לא ניתן ל-Rollback ברוב ה-DBMS. **DROP** — מוחק את הטבלה עצמה כולל ה-Schema. `DELETE FROM users WHERE id = 5` מול `TRUNCATE TABLE users` מול `DROP TABLE users`.

??? tip "הסבר מהו Write-Ahead Log (WAL)"
    **WAL** הוא מנגנון שכותב כל שינוי ל-Log רציף **לפני** שהוא נכתב לקבצי הנתונים הראשיים. אם המערכת קורסת, ה-Database קורא את ה-WAL ומשחזר את כל ה-Transactions שהושלמו. זה מה שמאפשר **Durability** ב-ACID. PostgreSQL משתמש ב-WAL, MySQL משתמש ב-Redo Log — אותו רעיון, שם שונה.

## קישורים לנושאים אחרים

- [Relational מול NoSQL](relational-vs-nosql.md) — השוואה בין שני הסוגים העיקריים של מסדי נתונים
- [סכמות ומודלים (Schemas and Models)](schemas-and-models.md) — איך מגדירים את המבנה של הנתונים
- [למה מבני נתונים](../01-algorithmics/data-structures-why.md) — מבני הנתונים שנמצאים בתוך ה-Database (Trees, Hash Tables ועוד)
