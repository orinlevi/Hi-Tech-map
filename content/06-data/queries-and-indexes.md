# שאילתות ואינדקסים (Queries and Indexes)

## למה זה חשוב

Database יכול להכיל מיליוני רשומות — אבל זה לא שווה כלום אם לא ניתן **לשלוף** מהם מידע במהירות. **Query** (שאילתה) היא הדרך שבה שואלים את ה-Database שאלות, ו-**Index** (אינדקס) הוא המנגנון שגורם לתשובות להגיע מהר.

הבנה של שאילתות ואינדקסים היא ההבדל בין מערכת שמגיבה ב-10 milliseconds לבין מערכת שמגיבה ב-10 שניות.

## רעיונות מרכזיים

### SQL Basics — ארבע פעולות יסוד

כל פעולה על נתונים מתחלקת ל-**CRUD** — ארבע פעולות בסיסיות:

| פעולה | SQL Command | דוגמה |
|-------|-------------|-------|
| **C**reate | `INSERT` | הכנסת רשומה חדשה |
| **R**ead | `SELECT` | שליפת נתונים |
| **U**pdate | `UPDATE` | עדכון רשומה קיימת |
| **D**elete | `DELETE` | מחיקת רשומה |

```sql
-- INSERT: הכנסת סטודנט חדש
INSERT INTO students (name, email, grade)
VALUES ('Alice', 'alice@uni.ac.il', 95.5);

-- SELECT: שליפה עם תנאי
SELECT name, grade
FROM students
WHERE grade > 90
ORDER BY grade DESC;

-- UPDATE: עדכון ציון
UPDATE students
SET grade = 97.0
WHERE name = 'Alice';

-- DELETE: מחיקת סטודנט
DELETE FROM students
WHERE email = 'bob@uni.ac.il';
```

!!! warning "DELETE בלי WHERE"
    `DELETE FROM students;` — בלי `WHERE` — ימחק את **כל** הרשומות בטבלה. זו טעות נפוצה ומסוכנת. תמיד בדקו את ה-`WHERE` לפני הרצת `DELETE` או `UPDATE`.

### JOINs — חיבור טבלאות

**JOIN** מאפשר לשלוף נתונים מכמה טבלאות בשאילתה אחת:

```
students                    enrollments                 courses
┌────┬───────┐       ┌────────────┬───────────┐   ┌────┬───────────┐
│ id │ name  │       │ student_id │ course_id │   │ id │ title     │
├────┼───────┤       ├────────────┼───────────┤   ├────┼───────────┤
│ 1  │ Alice │──────▶│ 1          │ 101       │◀──│101 │ Databases │
│ 2  │ Bob   │──────▶│ 1          │ 102       │◀──│102 │ ML Intro  │
│ 3  │ Carol │       │ 2          │ 101       │   │103 │ Networks  │
└────┴───────┘       └────────────┴───────────┘   └────┴───────────┘
```

```sql
-- INNER JOIN: רק רשומות שיש להן התאמה בשתי הטבלאות
SELECT s.name, c.title
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id;

-- תוצאה:
-- Alice  | Databases
-- Alice  | ML Intro
-- Bob    | Databases
-- (Carol לא מופיעה — היא לא רשומה לשום קורס)
```

**סוגי JOIN:**

| סוג | התנהגות |
|-----|--------|
| `INNER JOIN` | רק שורות עם התאמה **בשתי** הטבלאות |
| `LEFT JOIN` | כל השורות מצד שמאל + התאמות מימין (NULL אם אין) |
| `RIGHT JOIN` | כל השורות מצד ימין + התאמות משמאל |
| `FULL OUTER JOIN` | כל השורות משני הצדדים |

??? tip "LEFT JOIN — דוגמה"
    ```sql
    SELECT s.name, c.title
    FROM students s
    LEFT JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN courses c ON e.course_id = c.id;

    -- תוצאה:
    -- Alice  | Databases
    -- Alice  | ML Intro
    -- Bob    | Databases
    -- Carol  | NULL        ← Carol מופיעה עם NULL
    ```
    `LEFT JOIN` שימושי כשרוצים לראות **גם** סטודנטים שלא נרשמו לאף קורס.

### מהו Index?

**Index** הוא מבנה נתונים שה-Database בונה כדי לזרז חיפוש — בדיוק כמו **אינדקס בסוף ספר**.

```
בלי Index:                       עם Index:
──────────────                   ──────────────
סורקים את כל הטבלה             קופצים ישירות לשורה
שורה 1... לא                   B-Tree Index על "name":
שורה 2... לא                        ┌───────┐
שורה 3... לא                        │  Bob  │
...                                 ╱         ╲
שורה 999,999... לא            ┌─────┐       ┌─────┐
שורה 1,000,000... כן!         │Alice│       │Carol│
                               └─────┘       └─────┘
O(n) — Full Table Scan         O(log n) — Index Lookup
```

```sql
-- יצירת Index
CREATE INDEX idx_students_name ON students(name);

-- עכשיו חיפוש לפי שם יהיה מהיר:
SELECT * FROM students WHERE name = 'Alice';
-- Database ישתמש ב-Index במקום לסרוק את כל הטבלה
```

!!! note "Index לא בחינם"
    כל Index תופס מקום בדיסק ומאט פעולות כתיבה (INSERT, UPDATE, DELETE) — כי ה-Database צריך לעדכן גם את ה-Index. צריך לבנות Indexes רק על שדות שמחפשים לפיהם **הרבה**.

### B-Tree vs Hash Index

| | B-Tree Index | Hash Index |
|---|---|---|
| **מבנה** | עץ מאוזן | Hash Table |
| **חיפוש שוויוני** (`= 'Alice'`) | מהיר — O(log n) | מהיר מאוד — O(1) |
| **חיפוש טווח** (`> 90`) | תומך | **לא תומך** |
| **מיון** (`ORDER BY`) | תומך | **לא תומך** |
| **ברירת מחדל** | כן (ברוב ה-DBMS) | לא |

??? tip "מתי Hash Index?"
    Hash Index מתאים כשהשאילתות הן **תמיד** חיפוש שוויוני (`WHERE email = 'x'`). אם יש צורך ב-Range Queries או מיון — B-Tree הוא הבחירה הנכונה. ברוב המקרים B-Tree הוא ברירת המחדל הנכונה.

### Query Optimization

ה-Database לא מריץ את ה-SQL שלכם "כמו שהוא" — הוא בונה **Query Plan** ובוחר את הדרך היעילה ביותר לבצע את השאילתה.

```sql
-- הצגת ה-Query Plan ב-PostgreSQL:
EXPLAIN ANALYZE
SELECT s.name, c.title
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
WHERE s.grade > 90;
```

כללי אצבע לביצועים:

- **צרו Index** על שדות שמופיעים ב-`WHERE`, `JOIN`, `ORDER BY`
- **הימנעו מ-`SELECT *`** — שלפו רק שדות שצריך
- **הימנעו מ-`LIKE '%text%'`** — חיפוש עם `%` בהתחלה לא יכול להשתמש ב-Index
- **השתמשו ב-`LIMIT`** — אם צריך רק 10 תוצאות, אל תשלפו מיליון
- **הריצו `EXPLAIN`** — זה הכלי הכי חשוב לאבחון בעיות ביצועים

!!! warning "N+1 Query Problem"
    בעיה נפוצה ב-ORM: שליפת רשימת סטודנטים (שאילתה 1), ואז לכל סטודנט שאילתה נפרדת לשליפת הקורסים שלו (N שאילתות). סה"כ N+1 שאילתות במקום שאילתה אחת עם JOIN. זו אחת מבעיות הביצועים הנפוצות ביותר.

## בלבולים נפוצים

- **"Index תמיד משפר ביצועים"** — לא. Index על שדה שאף פעם לא מחפשים לפיו מבזבז מקום ומאט כתיבות. Index צריך להתאים ל-Query Patterns.
- **"SQL הוא איטי"** — SQL עצמו מהיר מאוד. מה שאיטי הוא בדרך כלל Schema Design גרוע, חוסר Indexes, או שאילתות לא מותאמות.
- **"JOIN זה פעולה כבדה — עדיף להימנע"** — JOIN מותאם עם Indexes הוא מהיר מאוד. הבעיה היא JOIN על טבלאות ענקיות בלי Indexes.
- **"אפשר לפצות על חוסר Index עם יותר RAM"** — עד גבול מסוים. אבל כש-Database גדל מעבר לזיכרון, בלי Index תקוע עם Full Table Scan.

## דוגמה קטנה

נשווה ביצועים עם ובלי Index:

```sql
-- טבלה עם מיליון רשומות
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action TEXT,
    created_at TIMESTAMP
);

-- שאילתה בלי Index על user_id:
EXPLAIN ANALYZE
SELECT * FROM logs WHERE user_id = 42;
-- Seq Scan on logs  (cost=0.00..18334.00 rows=100 width=48)
-- Planning Time: 0.1 ms
-- Execution Time: 152.3 ms   ← סריקה של כל הטבלה

-- ניצור Index:
CREATE INDEX idx_logs_user_id ON logs(user_id);

-- אותה שאילתה אחרי Index:
EXPLAIN ANALYZE
SELECT * FROM logs WHERE user_id = 42;
-- Index Scan using idx_logs_user_id  (cost=0.42..8.44 rows=100 width=48)
-- Planning Time: 0.1 ms
-- Execution Time: 0.4 ms    ← פי 380 יותר מהיר!
```

??? tip "Composite Index"
    ```sql
    -- אם תמיד מחפשים לפי user_id + created_at ביחד:
    CREATE INDEX idx_logs_user_date ON logs(user_id, created_at);

    -- עכשיו גם השאילתה הזו תהיה מהירה:
    SELECT * FROM logs
    WHERE user_id = 42
    AND created_at > '2025-01-01';
    ```
    סדר העמודות ב-Composite Index חשוב! ה-Index עובד "משמאל לימין" — חיפוש לפי `user_id` בלבד ישתמש ב-Index, אבל חיפוש לפי `created_at` בלבד **לא**.

## קישורים לנושאים אחרים

- [סכמות ומודלים (Schemas and Models)](schemas-and-models.md) — ה-Schema מגדיר את הטבלאות שעליהן מריצים שאילתות
- [Relational מול NoSQL](relational-vs-nosql.md) — שאילתות נראות שונה מאוד בכל סוג Database
- [DB ו-ML](db-and-ml.md) — שליפת נתוני אימון ושימוש ב-Vector Search
- [סיבוכיות (Complexity)](../01-algorithmics/complexity.md) — O(n) לעומת O(log n) — זה בדיוק ההבדל בין Full Scan ל-Index Lookup

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מסדי נתונים — SQL, relational algebra, query processing
    - מבני נתונים — B-trees, hash tables, sorted arrays
    - אלגוריתמים — searching, sorting, complexity analysis

    **קורסים מומלצים:**
    - Database Internals — storage engines, query optimizers
    - Big Data — distributed queries (Spark SQL, Presto)
    - Performance Engineering — profiling, benchmarking

    **ידע מעשי:**
    - SQL — complex queries, window functions, CTEs
    - EXPLAIN / EXPLAIN ANALYZE — query plans
    - PostgreSQL / MySQL — index types, configuration
    - pgAdmin / DataGrip — DB management tools

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא למדעי הנתונים (0300-0300)
    - אלגוריתמים (0368-2160)

---

## 🛤️ מאיפה מתחילים

1. **SQLBolt** — interactive SQL tutorial
2. **"Use The Index, Luke"** — indexing tutorial (use-the-index-luke.com)
3. **PostgreSQL documentation** — excellent and comprehensive
4. **LeetCode SQL** — practice queries
5. **EXPLAIN ANALYZE** — run on your own queries

---

## 💼 שאלות לראיון עבודה

??? tip "מה Index ולמה הוא מאיץ queries?"
    **Index** = מבנה נתונים (בד"כ B-Tree) שמאפשר חיפוש מהיר. בלי index: Full Table Scan O(n). עם index: O(log n). כמו אינדקס בסוף ספר — במקום לקרוא כל עמוד, מחפשים במפתח. Trade-off: מאיץ SELECT, מאט INSERT/UPDATE.

??? tip "מה ההבדל בין B-Tree ל-Hash Index?"
    **B-Tree** — sorted, supports range queries (>, <, BETWEEN), prefix matching. Default בPostgreSQL/MySQL. O(log n).
    **Hash** — equality only (=). O(1) average. לא תומך ב-range. PostgreSQL: Hash index רק ל-equality, B-Tree preferred.

??? tip "מה Composite Index ומה הסדר חשוב?"
    **Composite Index** — index על מספר columns: `CREATE INDEX idx ON t(a, b, c)`. **Left prefix rule**: Index משמש רק אם Query כולל prefix: (a), (a,b), (a,b,c). לא (b,c) בלבד. סדר = לפי selectivity (unique first) ו-query patterns.

??? tip "מה EXPLAIN ANALYZE?"
    פקודה שמראה את ה-**query execution plan** — איך DB מבצע query: Seq Scan vs Index Scan, Join method (Hash, Merge, Nested Loop), estimated vs actual rows, time per step. `EXPLAIN ANALYZE SELECT ...`. הכלי הכי חשוב ל-query optimization.

??? tip "מה N+1 Query Problem?"
    `SELECT * FROM orders` → loop: `SELECT * FROM products WHERE id = ?` (per order). N orders = N+1 queries. פתרון: **JOIN** (`SELECT ... FROM orders JOIN products`) או **IN clause** (`WHERE id IN (...)`). ORM (Django, Rails) — use `select_related` / `includes`.

??? tip "מה Window Functions?"
    פונקציות שמחשבות על "חלון" של rows ללא GROUP BY: `ROW_NUMBER()`, `RANK()`, `LAG()/LEAD()`, `SUM() OVER()`. דוגמה: `SELECT name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC)`. חזקות ל-analytics, deduplication, running totals.
