# סכמות ומודלים (Schemas and Models)

## למה זה חשוב

לפני שכותבים שורת קוד אחת, צריך להחליט **איך הנתונים נראים**. ה-Schema הוא השלד של ה-Database — הוא מגדיר אילו טבלאות קיימות, אילו שדות בכל טבלה, ומה הקשרים ביניהן.

תכנון Schema טוב חוסך שעות של Debug, מונע שכפול נתונים, ומאפשר למערכת לגדול. תכנון Schema גרוע יוביל ל-Queries מסובכים, ביצועים ירודים, ובאגים שקשה לאתר.

## רעיונות מרכזיים

### מהו Schema?

**Schema** הוא ההגדרה הפורמלית של מבנה הנתונים ב-Database:

- אילו **טבלאות** (או Collections) קיימות
- אילו **שדות** (Columns) בכל טבלה
- מה **הטיפוס** של כל שדה (TEXT, INTEGER, BOOLEAN...)
- מה ה-**Constraints** — חוקים שהנתונים חייבים לקיים

```sql
-- זה Schema של טבלה:
CREATE TABLE products (
    id SERIAL PRIMARY KEY,          -- מזהה ייחודי
    name TEXT NOT NULL,              -- שם המוצר (חובה)
    price DECIMAL CHECK (price > 0), -- מחיר (חייב להיות חיובי)
    category TEXT DEFAULT 'general', -- קטגוריה (ברירת מחדל)
    created_at TIMESTAMP DEFAULT NOW()
);
```

!!! note "Schema = חוזה"
    ה-Schema הוא כמו חוזה בין ה-Database לקוד. הוא מבטיח שהנתונים תמיד יהיו בפורמט מסוים. אם מישהו מנסה להכניס מחיר שלילי — ה-Database ידחה את זה.

### Schema vs Schemaless

| | Schema (Relational) | Schemaless (NoSQL) |
|---|---|---|
| **הגדרה** | מבנה קבוע, מוגדר מראש | מבנה גמיש, כל מסמך יכול להיות שונה |
| **יתרון** | עקביות, בטיחות, אופטימיזציה | גמישות, פיתוח מהיר |
| **חיסרון** | שינוי Schema = Migration | אי-עקביות בנתונים |
| **דוגמה** | PostgreSQL | MongoDB |

??? tip "Schema-on-Write vs Schema-on-Read"
    - **Schema-on-Write** (Relational): ה-Schema נאכף בזמן הכתיבה. אם הנתונים לא מתאימים — הם נדחים.
    - **Schema-on-Read** (NoSQL): הנתונים נכתבים בחופשיות. ה-"Schema" נאכף בזמן הקריאה — הקוד צריך לדעת לטפל במבנים שונים.

### ER Diagrams

**Entity-Relationship Diagram** הוא כלי ויזואלי לתכנון Schema. הוא מציג ישויות (Entities), תכונות (Attributes), וקשרים (Relationships).

```
┌───────────────┐         ┌─────────────────┐
│   Student     │         │    Course       │
├───────────────┤         ├─────────────────┤
│ PK: id        │         │ PK: id          │
│ name          │╶──┐ ┌──╴│ title           │
│ email         │   │ │   │ credits         │
│ birth_date    │   │ │   │ department      │
└───────────────┘   │ │   └─────────────────┘
                    │ │
               ┌────┴─┴────┐
               │ Enrollment │
               ├────────────┤
               │ student_id │  (FK → Student)
               │ course_id  │  (FK → Course)
               │ grade      │
               │ semester   │
               └────────────┘
```

סוגי קשרים:

- **One-to-One** — לכל סטודנט יש כרטיס סטודנט אחד
- **One-to-Many** — למרצה אחד יש הרבה קורסים
- **Many-to-Many** — סטודנטים רשומים לקורסים (דרך טבלת ביניים)

### Normalization

**Normalization** היא תהליך של ארגון הנתונים כדי **למנוע שכפול** ולשמור על עקביות.

!!! warning "למה שכפול נתונים הוא בעיה?"
    אם שם הסטודנט שמור ב-5 טבלאות שונות, ואז הוא משנה את שמו — צריך לעדכן בכל 5 המקומות. אם מפספסים אחד — יש חוסר עקביות.

**שלוש צורות נורמליות עיקריות:**

- **1NF** (First Normal Form) — כל תא מכיל ערך **אטומי** אחד (לא רשימה)
- **2NF** (Second Normal Form) — כל שדה תלוי ב-Primary Key **המלא** (לא בחלק ממנו)
- **3NF** (Third Normal Form) — אין תלויות **עקיפות** — כל שדה תלוי רק ב-Key, לא בשדות אחרים

```
❌ לא ב-1NF (ערכים לא אטומיים):
┌────┬──────┬──────────────────────┐
│ id │ name │ phones               │
├────┼──────┼──────────────────────┤
│ 1  │ Alice│ 054-111, 052-222     │  ← שני ערכים בתא אחד!
└────┴──────┴──────────────────────┘

✅ ב-1NF (טבלה נפרדת לטלפונים):
┌────┬──────┐    ┌───────────┬─────────┐
│ id │ name │    │ person_id │ phone   │
├────┼──────┤    ├───────────┼─────────┤
│ 1  │ Alice│    │ 1         │ 054-111 │
└────┴──────┘    │ 1         │ 052-222 │
                 └───────────┴─────────┘
```

??? tip "לא תמיד צריך Normalization מלא"
    **Denormalization** (שכפול מכוון) לפעמים משפרת ביצועים. למשל, אם תמיד שולפים שם סטודנט ביחד עם ציון — אולי כדאי לשמור אותם ביחד כדי לחסוך JOIN. זה Trade-off בין עקביות לביצועים.

### ORM — Object-Relational Mapping

**ORM** הוא שכבת תרגום בין אובייקטים בקוד לבין שורות ב-Database.

במקום לכתוב SQL ישירות, מגדירים **מודל** (Class) שמייצג טבלה:

```python
# דוגמה עם SQLAlchemy (Python ORM)
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    grade = Column(Float)

# במקום SQL, עובדים עם אובייקטים:
alice = Student(name="Alice", grade=95.5)
session.add(alice)      # INSERT INTO students ...
session.commit()

# שליפה
students = session.query(Student).filter(Student.grade > 90).all()
```

!!! note "ORM פופולריים"
    - **Python**: SQLAlchemy, Django ORM
    - **JavaScript**: Prisma, Sequelize, TypeORM
    - **Java**: Hibernate
    - **Ruby**: ActiveRecord

## בלבולים נפוצים

- **"Schema זה רק לטבלאות SQL"** — גם ב-NoSQL יש מושג של Schema, גם אם הוא לא נאכף ברמת ה-Database. ב-MongoDB אפשר להגדיר Schema Validation, וב-Mongoose (Node.js) מגדירים Schema בקוד.
- **"ORM מחליף את הצורך ללמוד SQL"** — לא. ORM מייצר SQL מאחורי הקלעים. כשיש בעיות ביצועים, צריך לדעת SQL כדי להבין מה קורה. ORM הוא כלי נוחות, לא תחליף.
- **"יותר Normalization = יותר טוב"** — לא תמיד. Normalization מוגזם יוצר עשרות טבלאות קטנות ו-JOINs רבים, מה שפוגע בביצועים. הפתרון הוא איזון.
- **"ER Diagram הוא רק תרגיל אקדמי"** — ER Diagrams הם כלי תכנון פרקטי שמשמש צוותים בתעשייה. כלים כמו dbdiagram.io ו-Draw.io נפוצים מאוד.

## דוגמה קטנה

נניח שאנחנו מתכננים מערכת לחנות ספרים. ככה נראה תהליך התכנון:

```
שלב 1: זיהוי ישויות
────────────────────
Book, Author, Customer, Order

שלב 2: זיהוי קשרים
────────────────────
Author ──(1:M)──▶ Book       (לכל מחבר כמה ספרים)
Customer ──(M:M)──▶ Book     (לקוח קונה ספרים, דרך Order)

שלב 3: הגדרת Schema
────────────────────
```

```sql
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER REFERENCES authors(id),
    price DECIMAL NOT NULL
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    order_id INTEGER REFERENCES orders(id),
    book_id INTEGER REFERENCES books(id),
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (order_id, book_id)
);
```

??? tip "למה order_items ולא לשמור ספרים ישירות ב-orders?"
    כי **הזמנה יכולה להכיל כמה ספרים** (Many-to-Many). טבלת order_items היא טבלת ביניים (Junction Table) שמחברת בין orders ל-books. זו Normalization קלאסית.

## קישורים לנושאים אחרים

- [מהו מסד נתונים](what-is-a-database.md) — מבוא כללי ו-ACID
- [Relational מול NoSQL](relational-vs-nosql.md) — ההבדלים בין Schema קבוע ל-Schemaless
- [שאילתות ואינדקסים (Queries and Indexes)](queries-and-indexes.md) — איך שולפים נתונים מה-Schema שהגדרנו
