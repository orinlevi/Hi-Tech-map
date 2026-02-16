# Relational מול NoSQL

## למה זה חשוב

אחת ההחלטות הראשונות בתכנון מערכת היא **איזה סוג Database לבחור**. הבחירה הזו משפיעה על ביצועים, גמישות, ויכולת ההתרחבות (Scalability) של המערכת. בחירה לא נכונה עלולה לגרום לשכתוב יקר בהמשך.

הבנת ההבדלים בין Relational ל-NoSQL — ומתי להשתמש בכל אחד — היא מיומנות קריטית לכל מפתח ולכל ארכיטקט מערכות.

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

!!! warning "זה לא שחור-לבן"
    מערכות רבות משלבות את שניהם — **Polyglot Persistence**. למשל: PostgreSQL לנתוני משתמשים, Redis ל-Cache, ו-Elasticsearch לחיפוש טקסט. הבחירה תלויה ב-Use Case הספציפי.

### CAP Theorem

ב-מערכת מבוזרת, אפשר להבטיח **לכל היותר שניים מתוך שלושה**:

- **C** — **Consistency** — כל הצמתים רואים את אותם נתונים באותו רגע
- **A** — **Availability** — כל בקשה מקבלת תשובה (גם אם לא הכי עדכנית)
- **P** — **Partition Tolerance** — המערכת ממשיכה לעבוד גם כשיש נתק בין חלקים ממנה

??? tip "בפועל, P הוא חובה"
    ברשת אמיתית, Partition (נתק) יקרה מתישהו. אז הבחירה האמיתית היא בין **CP** (עקביות על חשבון זמינות — כמו MongoDB) לבין **AP** (זמינות על חשבון עקביות — כמו Cassandra).

## בלבולים נפוצים

- **"NoSQL טוב יותר כי הוא חדש יותר"** — לא. Relational Databases קיימים עשרות שנים מסיבה טובה. הם מצוינים למידע מובנה עם קשרים מורכבים.
- **"NoSQL לא תומך ב-Transactions"** — לא מדויק. MongoDB למשל תומך ב-Multi-Document Transactions מגרסה 4.0. זה Trade-off, לא מגבלה מוחלטת.
- **"Relational לא יכול לגדול"** — הוא יכול, אבל בדרך כלל ב-Vertical Scaling (שרת חזק יותר). שיטות כמו Sharding ו-Read Replicas מאפשרות גם Horizontal Scaling.
- **"Schema זה רע כי הוא לא גמיש"** — Schema נותן **ביטחון**: אתם יודעים בדיוק מה יש ב-Database. Schemaless נותן גמישות אבל מעביר את האחריות לקוד.

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

## קישורים לנושאים אחרים

- [מהו מסד נתונים](what-is-a-database.md) — מבוא כללי למסדי נתונים ו-ACID
- [סכמות ומודלים (Schemas and Models)](schemas-and-models.md) — איך מגדירים את מבנה הנתונים בכל גישה
- [שאילתות ואינדקסים (Queries and Indexes)](queries-and-indexes.md) — איך שולפים נתונים ביעילות מכל סוג Database
