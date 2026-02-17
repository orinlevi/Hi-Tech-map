# Relational מול NoSQL

## למה זה חשוב

אחת ההחלטות הראשונות בתכנון מערכת היא **איזה סוג Database לבחור**. הבחירה הזו משפיעה על ביצועים, גמישות, ויכולת ההתרחבות (Scalability) של המערכת. בחירה לא נכונה עלולה לגרום לשכתוב יקר בהמשך.

הבנת ההבדלים בין Relational ל-NoSQL — ומתי להשתמש בכל אחד — היא מיומנות קריטית לכל מפתח ולכל ארכיטקט מערכות.

!!! quote "אמת קשה"
    "אין Database אחד שמתאים לכל דבר — אבל יש מפתחים שמנסים להכריח MongoDB לעשות JOINs, ויש כאלה שמנסים להכניס JSON ל-PostgreSQL עמודה אחר עמודה. שניהם סובלים."

## רעיונות מרכזיים

### Relational Databases

ב-Relational Database הנתונים מאורגנים ב-**טבלאות** (Tables) עם **שורות** (Rows) ו-**עמודות** (Columns). הקשרים בין הטבלאות מוגדרים באמצעות **Foreign Keys**.

```
┌─────────────────────────────┐       ┌──────────────────────────────┐
│         students            │       │          courses             │
├────┬──────────┬─────────────┤       ├────┬───────────┬─────────────┤
│ id │ name     │ department  │       │ id │ title     │ credits     │
├────┼──────────┼─────────────┤       ├────┼───────────┼─────────────┤
│ 1  │ Alice    │ CS          │       │ 1  │ Databases │ 4           │
│ 2  │ Bob      │ Math        │       │ 2  │ ML Intro  │ 3           │
└────┴──────────┴─────────────┘       └────┴───────────┴─────────────┘
            │                                     │
            └──────────┐      ┌───────────────────┘
                       ▼      ▼
              ┌──────────────────────────┐
              │      enrollments         │
              ├────────────┬─────────────┤
              │ student_id │ course_id   │
              ├────────────┼─────────────┤
              │ 1          │ 1           │
              │ 1          │ 2           │
              │ 2          │ 1           │
              └────────────┴─────────────┘
```

**דוגמאות מוכרות:** PostgreSQL, MySQL, SQLite, Oracle, SQL Server

!!! note "מאפיינים מרכזיים"
    - **Schema קבוע** — מבנה הטבלאות מוגדר מראש
    - **SQL** — שפת שאילתות סטנדרטית ועוצמתית
    - **ACID** — תמיכה מלאה ב-Transactions
    - **JOINs** — חיבור נתונים מטבלאות שונות בשאילתה אחת

### שאילתות SQL מתקדמות — מה Relational מאפשר

הכוח האמיתי של Relational Database הוא ביכולת לבטא שאילתות מורכבות בצורה ברורה:

```sql
-- TOP 5 סטודנטים עם הממוצע הגבוה ביותר
SELECT s.name,
       COUNT(e.course_id) AS num_courses,
       AVG(e.grade) AS avg_grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
GROUP BY s.id, s.name
HAVING AVG(e.grade) > 85
ORDER BY avg_grade DESC
LIMIT 5;
```

```sql
-- סטודנטים שרשומים לכל הקורסים של מחלקת CS
SELECT s.name
FROM students s
WHERE NOT EXISTS (
    SELECT c.id FROM courses c
    WHERE c.department = 'CS'
    AND c.id NOT IN (
        SELECT e.course_id FROM enrollments e
        WHERE e.student_id = s.id
    )
);
```

```sql
-- Window Functions — דירוג סטודנטים בכל מחלקה
SELECT s.name,
       s.department,
       e.grade,
       RANK() OVER (PARTITION BY s.department ORDER BY e.grade DESC) as dept_rank
FROM students s
JOIN enrollments e ON s.id = e.student_id;
```

!!! tip "PostgreSQL — הסכין השוויצרית של עולם ה-Databases"
    PostgreSQL תומך גם בנתונים רגילים (Relational), גם ב-JSON (כמו NoSQL), גם ב-Full-Text Search, גם ב-Vector Search (עם pgvector), וגם ב-Geospatial Data (עם PostGIS). אם לא בטוחים מה לבחור — PostgreSQL הוא תמיד אופציה סבירה.

### NoSQL Databases

NoSQL הוא שם כולל לכל מה שלא Relational. יש **ארבעה סוגים עיקריים**:

| סוג | איך זה עובד | דוגמאות | מתי להשתמש |
|-----|-------------|---------|------------|
| **Document** | כל רשומה היא מסמך JSON/BSON | MongoDB, CouchDB | תוכן גמיש, CMS, פרופילים |
| **Key-Value** | מפתח → ערך, כמו Dictionary | Redis, DynamoDB | Cache, Sessions, שליפה מהירה |
| **Column-Family** | נתונים מאורגנים בעמודות, לא בשורות | Cassandra, HBase | Big Data, כתיבה מסיבית |
| **Graph** | צמתים וקשתות (Nodes & Edges) | Neo4j, ArangoDB | רשתות חברתיות, המלצות |

??? tip "Document DB — דוגמה מ-MongoDB"
    ```json
    {
      "_id": "abc123",
      "name": "Alice",
      "department": "CS",
      "courses": [
        {"title": "Databases", "credits": 4},
        {"title": "ML Intro", "credits": 3}
      ],
      "address": {
        "city": "Tel Aviv",
        "street": "Rothschild 1"
      }
    }
    ```
    שימו לב: כל המידע של הסטודנט נמצא **במסמך אחד** — בלי צורך ב-JOINs. המבנה יכול להשתנות בין מסמכים שונים (Schemaless).

### NoSQL לעומק — דוגמאות קוד לכל סוג

**MongoDB (Document DB):**

```javascript
// Aggregation Pipeline — המקבילה של GROUP BY
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$customer_id",
        total_spent: { $sum: "$amount" },
        order_count: { $sum: 1 }
    }},
    { $sort: { total_spent: -1 } },
    { $limit: 10 }
]);
```

**Redis (Key-Value):**

```python
import redis

r = redis.Redis(host='localhost', port=6379)

# שמירה עם TTL (Time-To-Live)
r.setex("session:user123", 3600, "logged_in")  # פג תוקף אחרי שעה

# Counter אטומי
r.incr("page_views:homepage")  # Thread-safe!

# Sorted Set — לדירוג בזמן אמת
r.zadd("leaderboard", {"Alice": 950, "Bob": 870, "Carol": 920})
r.zrevrange("leaderboard", 0, 2, withscores=True)
# [(b'Alice', 950.0), (b'Carol', 920.0), (b'Bob', 870.0)]
```

!!! info "Redis — כי לפעמים 1ms זה יותר מדי"
    Redis שומר **הכל בזיכרון** (In-Memory). זה מה שנותן לו מהירות של מיקרו-שניות. הוא מושלם ל-Cache, Sessions, Queues, ו-Real-time Leaderboards. אבל הוא **לא** מתאים כ-Primary Database — כי אם השרת נופל, הנתונים בזיכרון אובדים (אלא אם הגדרתם Persistence).

**Neo4j (Graph DB):**

```cypher
// מצא את כל החברים של חברים שמעוניינים ב-Machine Learning
MATCH (me:Person {name: "Alice"})-[:FRIEND]->(friend)-[:FRIEND]->(fof)
WHERE fof.interest = "Machine Learning"
AND NOT (me)-[:FRIEND]->(fof)
RETURN DISTINCT fof.name;
```

??? info "מתי Graph DB באמת זורח?"
    כשהקשרים בין הנתונים הם **הדבר החשוב ביותר**. דוגמאות: רשתות חברתיות (מי מכיר את מי), מנועי המלצות (אנשים שקנו X גם קנו Y), ניתוח הונאות (חיפוש דפוסים חשודים), וניהול תשתיות (איזה שרת מחובר לאיזה Switch).

### מתי להשתמש במה?

```
                    הנתונים מובנים       הנתונים משתנים
                    וקשורים?            ולא אחידים?
                        │                     │
                        ▼                     ▼
                   ┌─────────┐          ┌──────────┐
                   │Relational│          │  NoSQL   │
                   └─────────┘          └──────────┘
```

| שיקול | Relational | NoSQL |
|-------|-----------|-------|
| **מבנה נתונים** | אחיד וידוע מראש | משתנה או מורכב |
| **עקביות** | ACID מלא | Eventual Consistency (בד"כ) |
| **Scalability** | Vertical (שרת חזק יותר) | Horizontal (יותר שרתים) |
| **שאילתות** | SQL עוצמתי, JOINs | שאילתות פשוטות, מהירות |
| **דוגמאות שימוש** | בנקאות, ERP, הזמנות | IoT, Real-time, Big Data |
| **Schema** | חובה, מוגדר מראש | אופציונלי, גמיש |
| **עלות הכנסה** | גבוהה יותר (צריך לתכנן Schema) | נמוכה (זורקים JSON ומתחילים) |

!!! warning "זה לא שחור-לבן"
    מערכות רבות משלבות את שניהם — **Polyglot Persistence**. למשל: PostgreSQL לנתוני משתמשים, Redis ל-Cache, ו-Elasticsearch לחיפוש טקסט. הבחירה תלויה ב-Use Case הספציפי.

### תרחישים מעשיים — מה בוחרים?

| תרחיש | בחירה | למה? |
|-------|-------|------|
| **מערכת בנקאית** | PostgreSQL | ACID מלא, Transactions, Constraints |
| **צ'אט בזמן אמת** | MongoDB + Redis | מסמכים גמישים, Cache מהיר |
| **חנות E-commerce** | PostgreSQL + Redis | הזמנות ב-SQL, Cache ל-Sessions |
| **רשת חברתית** | Neo4j + PostgreSQL | קשרים ב-Graph, פרופילים ב-SQL |
| **IoT — מיליוני חיישנים** | Cassandra | כתיבה מסיבית, Horizontal Scaling |
| **מנוע חיפוש** | Elasticsearch | Full-Text Search, Aggregations |
| **מערכת RAG/AI** | PostgreSQL + pgvector | Vector Search + נתונים מובנים |

### CAP Theorem

ב-מערכת מבוזרת, אפשר להבטיח **לכל היותר שניים מתוך שלושה**:

- **C** — **Consistency** — כל הצמתים רואים את אותם נתונים באותו רגע
- **A** — **Availability** — כל בקשה מקבלת תשובה (גם אם לא הכי עדכנית)
- **P** — **Partition Tolerance** — המערכת ממשיכה לעבוד גם כשיש נתק בין חלקים ממנה

```
                    CAP Theorem
                        △
                       ╱ ╲
                      ╱   ╲
                   C ╱     ╲ A
                    ╱       ╲
                   ╱    P    ╲
                  ╱───────────╲

        CP                         AP
    (Consistency +              (Availability +
     Partition)                  Partition)
    ─────────────              ─────────────
    MongoDB                    Cassandra
    HBase                      DynamoDB
    Redis Cluster              CouchDB
```

??? tip "בפועל, P הוא חובה"
    ברשת אמיתית, Partition (נתק) יקרה מתישהו. אז הבחירה האמיתית היא בין **CP** (עקביות על חשבון זמינות — כמו MongoDB) לבין **AP** (זמינות על חשבון עקביות — כמו Cassandra).

??? info "מהו Eventual Consistency?"
    ב-Eventual Consistency, אחרי כתיבה, ייתכן שלא כל הצמתים יראו את השינוי מיד. אבל **בסופו של דבר** (תוך מילישניות עד שניות), כולם יתכנסו לאותו מצב. דוגמה: כשמפרסמים פוסט באינסטגרם, חלק מהעוקבים יראו אותו אחרי שנייה וחלק אחרי 5 שניות — וזה בסדר.

### ACID מול BASE

| | ACID (Relational) | BASE (NoSQL) |
|---|---|---|
| **A** | Atomicity | **B**asically **A**vailable |
| **C** | Consistency | **S**oft State |
| **I** | Isolation | **E**ventual Consistency |
| **D** | Durability | |
| **פילוסופיה** | "הכל חייב להיות מדויק" | "קרוב מספיק טוב, ונתקן בדרך" |
| **מתאים ל** | בנקאות, הזמנות, רפואה | Social Media, Analytics, IoT |

!!! danger "MongoDB — כי לפעמים אתה רוצה לזרוק JSON לתוך מאגר ולקוות לטוב"
    זה לא באמת נכון (MongoDB התבגר מאוד מאז הימים הראשונים), אבל הבדיחה הזו מזכירה נקודה חשובה: **חוסר Schema לא אומר חוסר תכנון**. גם ב-NoSQL צריך לחשוב על מבנה הנתונים, Indexes, ו-Access Patterns לפני שכותבים שורת קוד.

### PostgreSQL כ-NoSQL — הכי טוב משני העולמות?

PostgreSQL תומך ב-JSON באופן מקורי, מה שמאפשר לקבל חלק מיתרונות NoSQL בתוך Database Relational:

```sql
-- עמודת JSONB ב-PostgreSQL
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL NOT NULL,
    metadata JSONB  -- נתונים גמישים!
);

-- הכנסה עם JSON
INSERT INTO products (name, price, metadata)
VALUES ('Laptop', 3500, '{"brand": "Dell", "ram_gb": 16, "colors": ["silver", "black"]}');

-- שליפה מתוך JSON
SELECT name, metadata->>'brand' AS brand
FROM products
WHERE metadata->>'ram_gb'::int > 8;

-- Index על שדה JSON
CREATE INDEX idx_products_brand ON products ((metadata->>'brand'));
```

??? tip "אז למה בכלל צריך MongoDB?"
    PostgreSQL עם JSONB מעולה כש-**רוב** הנתונים הם Relational וחלק קטן הוא גמיש. אבל אם **כל** הנתונים הם מסמכים גמישים, ואתם צריכים Horizontal Scaling מסיבי — MongoDB עדיין מתאים יותר. כמו כן, ה-Aggregation Pipeline של MongoDB עשיר יותר לעבודה עם מסמכים מקוננים.

## בלבולים נפוצים

- **"NoSQL טוב יותר כי הוא חדש יותר"** — לא. Relational Databases קיימים עשרות שנים מסיבה טובה. הם מצוינים למידע מובנה עם קשרים מורכבים.
- **"NoSQL לא תומך ב-Transactions"** — לא מדויק. MongoDB למשל תומך ב-Multi-Document Transactions מגרסה 4.0. זה Trade-off, לא מגבלה מוחלטת.
- **"Relational לא יכול לגדול"** — הוא יכול, אבל בדרך כלל ב-Vertical Scaling (שרת חזק יותר). שיטות כמו Sharding ו-Read Replicas מאפשרות גם Horizontal Scaling.
- **"Schema זה רע כי הוא לא גמיש"** — Schema נותן **ביטחון**: אתם יודעים בדיוק מה יש ב-Database. Schemaless נותן גמישות אבל מעביר את האחריות לקוד.
- **"Redis מחליף Database"** — Redis הוא **Cache** מעולה, אבל הוא In-Memory. אם השרת קורס בלי Persistence, הנתונים אובדים. הוא משלים Database, לא מחליף אותו.
- **"Eventual Consistency אומר שנתונים ילכו לאיבוד"** — לא. זה אומר שיש **חלון זמן קצר** שבו צמתים שונים עשויים לראות גרסאות שונות. הנתונים לא אובדים — הם פשוט לוקחים זמן להתפשט.

## דוגמה קטנה

אותם נתונים — בשתי גישות שונות:

**Relational (SQL):**
```sql
-- יצירת טבלאות
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product TEXT,
    amount DECIMAL
);

-- שליפה עם JOIN
SELECT u.name, o.product, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.name = 'Alice';
```

**Document (MongoDB):**
```javascript
// הכנסת מסמך — הכל ביחד
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  orders: [
    { product: "Laptop", amount: 3500 },
    { product: "Mouse", amount: 120 }
  ]
});

// שליפה — בלי JOIN
db.users.findOne(
  { name: "Alice" },
  { orders: 1 }
);
```

??? tip "שימו לב להבדל"
    בגישה ה-Relational, הנתונים **מנורמלים** — כל ישות בטבלה נפרדת. בגישה ה-Document, הנתונים **מוטמעים** (Embedded) — הכל במסמך אחד. כל גישה מתאימה ל-Use Cases שונים.

### דוגמה מתקדמת — Migration בין SQL ל-NoSQL

נניח שיש לנו מערכת E-commerce ב-PostgreSQL ורוצים להעביר קטלוג מוצרים ל-MongoDB (כי לכל מוצר יש תכונות שונות):

```sql
-- PostgreSQL: מבנה נוקשה
-- בגדים יש size ו-color, אלקטרוניקה יש ram ו-storage
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price DECIMAL,
    -- עמודות שרלוונטיות רק לחלק מהמוצרים:
    size TEXT,          -- NULL לאלקטרוניקה
    color TEXT,         -- NULL לתוכנה
    ram_gb INTEGER,     -- NULL לבגדים
    storage_gb INTEGER  -- NULL לבגדים
);
-- הרבה NULLs! 😔
```

```javascript
// MongoDB: כל מוצר עם התכונות שלו
db.products.insertMany([
  {
    name: "חולצה",
    category: "clothing",
    price: 89.90,
    size: "M",
    color: "blue",
    material: "cotton"
  },
  {
    name: "MacBook Pro",
    category: "electronics",
    price: 8999,
    ram_gb: 16,
    storage_gb: 512,
    ports: ["USB-C", "MagSafe", "HDMI"]
  },
  {
    name: "Photoshop License",
    category: "software",
    price: 299,
    license_type: "annual",
    platforms: ["Windows", "macOS"]
  }
]);
// אין NULLs! כל מסמך עם השדות הרלוונטיים לו 🎯
```

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מסדי נתונים — relational model, SQL, normalization, CAP theorem
    - מבני נתונים — B-trees, hash tables, graphs

    **קורסים מומלצים:**
    - מערכות מבוזרות — distributed databases, consistency models
    - אלגוריתמים — searching, sorting, graph algorithms

    **ידע מעשי:**
    - PostgreSQL — relational queries, JSONB, indexes
    - MongoDB — document model, aggregation pipeline
    - Redis — caching, key-value operations
    - CAP Theorem — understanding trade-offs

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא למדעי הנתונים (0300-0300)

---

## 🛤️ מאיפה מתחילים

```
שלב 1: להכיר Relational קודם
───────────────────────────────
□ למדו SQL טוב — JOINs, GROUP BY, Subqueries
□ בנו פרויקט קטן עם PostgreSQL
□ תרגלו תכנון Schema ו-Normalization

שלב 2: להכיר NoSQL
───────────────────
□ התקינו MongoDB מקומית (או MongoDB Atlas — חינמי)
□ בנו API פשוט עם Node.js + MongoDB
□ השוו: איך אותו פרויקט נראה ב-SQL מול NoSQL?

שלב 3: Redis ו-Caching
───────────────────────
□ התקינו Redis מקומית
□ הוסיפו Cache Layer לפרויקט קיים
□ למדו על TTL, Eviction Policies, Pub/Sub

שלב 4: ארכיטקטורה
──────────────────
□ למדו על CAP Theorem ו-BASE
□ הכירו Polyglot Persistence
□ קראו Case Studies — איך חברות בוחרות Database
□ תרגלו שאלות System Design
```

**משאבים מומלצים:**

- [MongoDB University](https://university.mongodb.com/) — קורסים חינמיים ומעולים
- [Redis University](https://university.redis.com/) — למידת Redis מהמקור
- **"Designing Data-Intensive Applications"** (Martin Kleppmann) — הספר הכי חשוב בתחום
- [DB-Engines Ranking](https://db-engines.com/en/ranking) — דירוג פופולריות של Databases

## 💼 שאלות לראיון עבודה

??? tip "מתי לבחור SQL ומתי NoSQL?"
    **SQL** כשיש: מבנה נתונים ידוע מראש, קשרים מורכבים בין ישויות, צורך ב-Transactions (ACID), שאילתות מורכבות עם JOINs. **NoSQL** כשיש: נתונים לא אחידים, צורך ב-Horizontal Scaling, Access Patterns פשוטים (key lookup), קצבי כתיבה גבוהים מאוד. בפועל — רוב המערכות משלבות את שניהם.

??? tip "הסבר את CAP Theorem ותן דוגמה"
    CAP Theorem אומר שמערכת מבוזרת יכולה להבטיח **לכל היותר שניים** מתוך: **Consistency** (כולם רואים אותו מידע), **Availability** (כל בקשה מקבלת תשובה), **Partition Tolerance** (עובד גם עם נתק ברשת). בפועל, P הוא חובה ברשת אמיתית, אז הבחירה היא CP (MongoDB — עקביות על חשבון זמינות) או AP (Cassandra — זמינות על חשבון עקביות).

??? tip "מה זה Eventual Consistency ומתי זה מתאים?"
    Eventual Consistency אומר שאחרי כתיבה, לא כל הצמתים רואים את השינוי מיד, אבל בסופו של דבר כולם יתכנסו. **מתאים**: Social Media (פוסט מופיע אחרי שנייה אצל כולם), Analytics, DNS. **לא מתאים**: העברות בנקאיות, ניהול מלאי (שני אנשים קונים את הפריט האחרון), מערכות רפואיות.

??? tip "מהו Sharding ואיך הוא קשור ל-NoSQL?"
    **Sharding** הוא חלוקת הנתונים בין מספר שרתים (Shards). כל Shard מכיל חלק מהנתונים. צריך לבחור **Shard Key** — השדה שלפיו מחלקים. למשל, Sharding לפי `country` — כל המשתמשים מישראל בשרת אחד, כל האמריקאים בשרת אחר. NoSQL Databases (כמו MongoDB, Cassandra) תומכים ב-Sharding מובנה. Relational Databases יכולים לעשות Sharding אבל זה מסובך יותר.

??? tip "הסבר מה זה Polyglot Persistence"
    **Polyglot Persistence** הוא שימוש ב**כמה סוגי Databases** באותה מערכת, כל אחד למשימה שהוא הכי טוב בה. דוגמה: E-commerce שמשתמש ב-PostgreSQL להזמנות ומשתמשים, Redis ל-Sessions ו-Cache, Elasticsearch לחיפוש מוצרים, ו-Neo4j להמלצות "לקוחות שקנו גם קנו".

??? tip "מה היתרון של MongoDB על PostgreSQL ולהיפך?"
    **MongoDB**: Schema גמיש (לא צריך Migrations), Horizontal Scaling מובנה, מתאים למסמכים מקוננים, Aggregation Pipeline חזק. **PostgreSQL**: ACID מלא, SQL סטנדרטי, JOINs יעילים, Extensions עשירים (pgvector, PostGIS), JSONB שנותן גם גמישות. במערכת חדשה — PostgreSQL הוא בדרך כלל ברירת המחדל הטובה, אלא אם יש סיבה ספציפית ל-MongoDB.

??? tip "מתי תשתמש ב-Redis ומתי ב-Database רגיל?"
    **Redis** ל: Cache (שליפת נתונים חוזרת, תוצאות שאילתות יקרות), Session Management, Rate Limiting, Queues, Pub/Sub, Leaderboards, Real-time Counters. **Database רגיל** ל: נתונים שצריכים Persistence מוחלטת, שאילתות מורכבות, Transactions, נתונים שגדולים מכמות ה-RAM. הכלל: Redis ל-"hot data" שצריך מהר, Database ל-"cold data" שצריך לשמור לנצח.

??? tip "הסבר את ההבדל בין Embedding ל-Referencing ב-MongoDB"
    **Embedding** — לשים מסמכים מקוננים בתוך מסמך אחד (denormalization). יתרון: קריאה מהירה (הכל במקום אחד). חיסרון: שכפול נתונים, מגבלת 16MB למסמך. **Referencing** — לשמור ID שמפנה למסמך אחר (כמו Foreign Key). יתרון: אין שכפול, מסמכים קטנים. חיסרון: צריך שאילתה נוספת (כמו JOIN ידני). כלל אצבע: Embed כשהקשר הוא 1:Few ו-Reference כשהוא 1:Many או Many:Many.

## קישורים לנושאים אחרים

- [מהו מסד נתונים](what-is-a-database.md) — מבוא כללי למסדי נתונים ו-ACID
- [סכמות ומודלים (Schemas and Models)](schemas-and-models.md) — איך מגדירים את מבנה הנתונים בכל גישה
- [שאילתות ואינדקסים (Queries and Indexes)](queries-and-indexes.md) — איך שולפים נתונים ביעילות מכל סוג Database
