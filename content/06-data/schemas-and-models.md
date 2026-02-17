# סכמות ומודלים (Schemas and Models)

## למה זה חשוב

לפני שכותבים שורת קוד אחת, צריך להחליט **איך הנתונים נראים**. ה-Schema הוא השלד של ה-Database — הוא מגדיר אילו טבלאות קיימות, אילו שדות בכל טבלה, ומה הקשרים ביניהן.

תכנון Schema טוב חוסך שעות של Debug, מונע שכפול נתונים, ומאפשר למערכת לגדול. תכנון Schema גרוע יוביל ל-Queries מסובכים, ביצועים ירודים, ובאגים שקשה לאתר.

!!! quote "חכמה מעולם ה-Databases"
    "שעה של תכנון Schema חוסכת שבוע של Migrations ושנה של כאבי ראש. אבל בינינו — מי באמת מתכנן לפני שמתחיל לקודד?"

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

### Constraints — השומרים של הנתונים

Constraints הם חוקים שמגנים על שלמות הנתונים:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,                          -- PK: מזהה ייחודי
    email TEXT NOT NULL UNIQUE,                      -- חובה + ייחודי
    name TEXT NOT NULL,                              -- חובה
    department_id INTEGER REFERENCES departments(id),-- FK: מפנה לטבלה אחרת
    salary DECIMAL CHECK (salary >= 0),              -- חייב להיות 0 או חיובי
    hire_date DATE DEFAULT CURRENT_DATE,             -- ברירת מחדל
    status TEXT CHECK (status IN ('active', 'inactive', 'on_leave'))  -- ערכים מותרים
);
```

| Constraint | מה הוא עושה | דוגמה |
|-----------|------------|-------|
| **PRIMARY KEY** | מזהה ייחודי לכל שורה | `id SERIAL PRIMARY KEY` |
| **NOT NULL** | השדה חייב להכיל ערך | `name TEXT NOT NULL` |
| **UNIQUE** | אין שני ערכים זהים | `email TEXT UNIQUE` |
| **FOREIGN KEY** | מפנה לשורה בטבלה אחרת | `REFERENCES departments(id)` |
| **CHECK** | תנאי שהערך חייב לקיים | `CHECK (salary >= 0)` |
| **DEFAULT** | ערך אוטומטי אם לא סופק | `DEFAULT CURRENT_DATE` |

!!! danger "בלי Constraints, כל דבר יכול להיכנס ל-Database"
    בלי `NOT NULL`, יכולים להיכנס משתמשים בלי שם. בלי `UNIQUE`, יכולים להיות שני משתמשים עם אותו email. בלי `FOREIGN KEY`, הזמנות יכולות להפנות למשתמש שלא קיים. Constraints הם קו ההגנה האחרון — **השתמשו בהם בלי חשש**.

### Data Types — בחירת הטיפוס הנכון

בחירת טיפוס נכון משפיעה על אחסון, ביצועים, ותקינות נתונים:

```sql
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid(),   -- UUID במקום SERIAL (טוב ל-Distributed)
    title VARCHAR(200) NOT NULL,         -- טקסט עם אורך מקסימלי
    description TEXT,                     -- טקסט ללא הגבלה
    start_time TIMESTAMPTZ NOT NULL,     -- תאריך+שעה עם Timezone!
    duration INTERVAL,                    -- משך זמן (e.g., '2 hours')
    location POINT,                       -- נקודה גיאוגרפית
    tags TEXT[],                          -- מערך של טקסטים
    metadata JSONB,                       -- JSON גמיש
    is_public BOOLEAN DEFAULT true,
    price NUMERIC(10, 2)                 -- 10 ספרות, 2 אחרי הנקודה
);
```

??? tip "SERIAL מול UUID — מה עדיף?"
    **SERIAL/BIGSERIAL**: מספר רץ (1, 2, 3...). יתרון: קטן, מהיר, קריא. חיסרון: ניתן לנחש (אבטחה), בעייתי ב-Distributed Systems.
    **UUID**: מזהה אקראי (e.g., `550e8400-e29b-41d4-a716-446655440000`). יתרון: ייחודי גלובלית, לא ניתן לנחש. חיסרון: גדול יותר (16 bytes), פחות קריא. **כלל אצבע**: UUID כשיש כמה שרתי Database או כשה-ID חשוף ל-API.

??? warning "TIMESTAMP מול TIMESTAMPTZ — באג שמחכה לקרות"
    `TIMESTAMP` שומר תאריך ושעה **בלי** Timezone. `TIMESTAMPTZ` שומר **עם** Timezone. אם המשתמשים שלכם בכמה אזורי זמן — **תמיד** השתמשו ב-`TIMESTAMPTZ`. אחרת תגלו שהאירוע שנקבע ל-10:00 בתל אביב מופיע כ-10:00 גם בניו יורק.

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

### Mongoose Schema — Schema ב-NoSQL

גם ב-NoSQL, בפועל צריך הגדרת מבנה. **Mongoose** (ORM ל-MongoDB) מאפשר להגדיר Schema בקוד:

```javascript
const mongoose = require('mongoose');

// הגדרת Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, min: 0, max: 150 },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    address: {
        city: String,
        street: String,
        zipCode: String
    },
    hobbies: [String],  // מערך של מחרוזות
    createdAt: { type: Date, default: Date.now }
});

// יצירת Model מה-Schema
const User = mongoose.model('User', userSchema);

// שימוש
const alice = new User({
    name: "Alice",
    email: "ALICE@example.com",  // יהפוך ל-lowercase אוטומטית
    age: 28,
    hobbies: ["coding", "hiking"]
});
await alice.save();  // Validation רץ כאן
```

!!! info "Schema ב-NoSQL — הכי טוב משני העולמות"
    עם Mongoose (או Schema Validation של MongoDB עצמו), מקבלים את ה**גמישות** של NoSQL עם ה**ביטחון** של Schema. אפשר להגדיר שדות חובה, טיפוסים, ו-Validation — אבל עדיין להוסיף שדות חדשים בלי Migration.

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

### תכנון Schema מעשי — תבנית עבודה

כשמתכננים Schema, עקבו אחרי השלבים הבאים:

```
שלב 1: זיהוי ישויות (Entities)
────────────────────────────────
שאלו: מה ה-"דברים" שהמערכת מנהלת?
User, Product, Order, Review, Category...

שלב 2: זיהוי תכונות (Attributes)
──────────────────────────────────
לכל ישות — אילו שדות צריך?
User: name, email, password_hash, created_at

שלב 3: זיהוי קשרים (Relationships)
────────────────────────────────────
מה הקשר בין הישויות?
User ──(1:M)──> Order ──(M:M)──> Product

שלב 4: הגדרת Constraints
─────────────────────────
מה חייב להיות ייחודי? מה חובה? מה ערכי ברירת מחדל?

שלב 5: בדיקה עם שאילתות
─────────────────────────
כתבו את השאילתות הנפוצות ובדקו שה-Schema תומך בהן
```

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

### דוגמה מלאה ל-Normalization

נתחיל מטבלה לא מנורמלת ונפרק אותה צעד אחרי צעד:

```sql
-- ❌ טבלה לא מנורמלת (הכל בטבלה אחת):
-- order_id | customer_name | customer_email | product_name | product_price | quantity
-- 1        | Alice         | alice@mail.com | Laptop       | 3500          | 1
-- 1        | Alice         | alice@mail.com | Mouse        | 120           | 2
-- 2        | Bob           | bob@mail.com   | Laptop       | 3500          | 1

-- בעיות: שכפול שם ומייל של לקוח, שכפול מחיר מוצר

-- ✅ אחרי Normalization ל-3NF:

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL NOT NULL CHECK (price > 0)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) NOT NULL,
    order_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL NOT NULL,  -- מחיר בזמן ההזמנה (יכול להשתנות!)
    PRIMARY KEY (order_id, product_id)
);
```

??? tip "למה unit_price ב-order_items ולא פשוט JOIN עם products?"
    כי **מחירים משתנים**! אם לקוח קנה Laptop ב-3500 ש"ח ומחר המחיר עולה ל-4000, ההזמנה הישנה צריכה לשמור את המחיר **בזמן הרכישה**. זו טעות נפוצה שמתגלה רק ב-Production.

??? tip "לא תמיד צריך Normalization מלא"
    **Denormalization** (שכפול מכוון) לפעמים משפרת ביצועים. למשל, אם תמיד שולפים שם סטודנט ביחד עם ציון — אולי כדאי לשמור אותם ביחד כדי לחסוך JOIN. זה Trade-off בין עקביות לביצועים.

### Migrations — איך משנים Schema בלי לשבור הכל

**Migration** היא שינוי מבוקר ב-Schema של Database קיים:

```sql
-- Migration: הוספת עמודת phone_number לטבלת customers
-- Up (שדרוג):
ALTER TABLE customers ADD COLUMN phone_number TEXT;

-- Down (חזרה):
ALTER TABLE customers DROP COLUMN phone_number;
```

```python
# דוגמה עם Alembic (Python Migration Tool)
# alembic revision --autogenerate -m "add phone to customers"

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('customers',
        sa.Column('phone_number', sa.Text(), nullable=True)
    )
    op.create_index('idx_customers_phone', 'customers', ['phone_number'])

def downgrade():
    op.drop_index('idx_customers_phone')
    op.drop_column('customers', 'phone_number')
```

!!! warning "Migrations מסוכנות — כללי זהירות"
    - **לעולם אל תמחקו עמודה** ב-Production בלי לוודא שאף קוד לא משתמש בה
    - **הוסיפו עמודות כ-nullable** קודם, ורק אחרי שמילאתם נתונים — הפכו ל-NOT NULL
    - **גבו** לפני כל Migration
    - **בדקו על סביבת Staging** לפני Production
    - שינוי טיפוס של עמודה עם נתונים = **Lock על הטבלה** = הכל תקוע

### ORM — Object-Relational Mapping

**ORM** הוא שכבת תרגום בין אובייקטים בקוד לבין שורות ב-Database.

במקום לכתוב SQL ישירות, מגדירים **מודל** (Class) שמייצג טבלה:

```python
# דוגמה עם SQLAlchemy (Python ORM)
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    grade = Column(Float)

    # Relationship — קשר לטבלת enrollments
    enrollments = relationship("Enrollment", back_populates="student")

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    credits = Column(Integer)

class Enrollment(Base):
    __tablename__ = 'enrollments'

    student_id = Column(Integer, ForeignKey('students.id'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    grade = Column(Float)

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course")

# שימוש:
alice = Student(name="Alice", grade=95.5)
session.add(alice)      # INSERT INTO students ...
session.commit()

# שליפה — Pythonic!
students = session.query(Student).filter(Student.grade > 90).all()
for s in students:
    print(f"{s.name}: {[e.course.title for e in s.enrollments]}")
```

### Prisma — ORM מודרני ל-TypeScript

```typescript
// schema.prisma — הגדרת Schema
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

```typescript
// שימוש — Type-safe!
const user = await prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@example.com",
    posts: {
      create: { title: "My First Post", content: "Hello!" }
    }
  },
  include: { posts: true }  // Eager loading
});
```

!!! note "ORM פופולריים"
    - **Python**: SQLAlchemy, Django ORM
    - **JavaScript/TypeScript**: Prisma, Sequelize, TypeORM, Drizzle
    - **Java**: Hibernate
    - **Ruby**: ActiveRecord
    - **Go**: GORM, Ent

!!! danger "The Object-Relational Impedance Mismatch — הבעיה שכל ORM מנסה לפתור"
    אובייקטים בקוד הם **היררכיים** (עצים). טבלאות ב-Database הם **שטוחים** (שורות ועמודות). ORM מנסה לגשר על הפער הזה, אבל זה לא תמיד מושלם. לפעמים SQL ישיר הוא הפתרון הנכון — במיוחד לשאילתות מורכבות או כשביצועים קריטיים.

## בלבולים נפוצים

- **"Schema זה רק לטבלאות SQL"** — גם ב-NoSQL יש מושג של Schema, גם אם הוא לא נאכף ברמת ה-Database. ב-MongoDB אפשר להגדיר Schema Validation, וב-Mongoose (Node.js) מגדירים Schema בקוד.
- **"ORM מחליף את הצורך ללמוד SQL"** — לא. ORM מייצר SQL מאחורי הקלעים. כשיש בעיות ביצועים, צריך לדעת SQL כדי להבין מה קורה. ORM הוא כלי נוחות, לא תחליף.
- **"יותר Normalization = יותר טוב"** — לא תמיד. Normalization מוגזם יוצר עשרות טבלאות קטנות ו-JOINs רבים, מה שפוגע בביצועים. הפתרון הוא איזון.
- **"ER Diagram הוא רק תרגיל אקדמי"** — ER Diagrams הם כלי תכנון פרקטי שמשמש צוותים בתעשייה. כלים כמו dbdiagram.io ו-Draw.io נפוצים מאוד.
- **"AUTO_INCREMENT/SERIAL מספיק תמיד כ-Primary Key"** — לא בהכרח. במערכות מבוזרות, UUID עדיף כי הוא לא דורש תיאום בין שרתים. וב-APIs ציבוריים, SERIAL חושף את מספר המשתמשים/הזמנות — מידע עסקי רגיש.

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

### דוגמה מתקדמת — Schema לאפליקציית Blog מלאה

```sql
-- Schema מלא עם כל סוגי הקשרים

-- משתמשים
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- קטגוריות (היררכיה — One-to-Many עצמי)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(id),  -- Self-reference!
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- פוסטים (One-to-Many עם users)
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES users(id) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- תגיות (Many-to-Many עם posts)
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- תגובות (One-to-Many + Self-reference לתגובות מקוננות)
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES comments(id),  -- תגובה על תגובה
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes לביצועים
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status_date ON posts(status, published_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
```

??? info "ON DELETE CASCADE — מה קורה כשמוחקים?"
    `ON DELETE CASCADE` אומר: אם מוחקים פוסט, כל התגיות והתגובות שלו נמחקות אוטומטית. אפשרויות נוספות: `ON DELETE SET NULL` (השדה הופך ל-NULL), `ON DELETE RESTRICT` (מונע מחיקה אם יש הפניות).

## 🛤️ מאיפה מתחילים

```
שבוע 1: יסודות Schema
──────────────────────
□ למדו CREATE TABLE עם Constraints (PK, FK, NOT NULL, CHECK)
□ תרגלו על dbdiagram.io — ציירו ER Diagram לפרויקט אישי
□ הבינו את ההבדל בין 1NF, 2NF, 3NF

שבוע 2: Data Types ו-Constraints מתקדמים
─────────────────────────────────────────
□ למדו על UUID, JSONB, Arrays, TIMESTAMPTZ
□ תרגלו CHECK Constraints מורכבים
□ הכירו ENUM types

שבוע 3: ORM
────────────
□ בחרו ORM (SQLAlchemy ל-Python, Prisma ל-TypeScript)
□ בנו מודלים עם Relationships
□ תרגלו CRUD דרך ORM

שבוע 4: Migrations ו-Best Practices
─────────────────────────────────────
□ למדו Alembic (Python) או Prisma Migrate
□ בצעו Migration על Database עם נתונים
□ תרגלו Schema Design לפרויקטים שונים (Blog, E-commerce, Social)
```

**משאבים מומלצים:**

- [dbdiagram.io](https://dbdiagram.io/) — כלי ויזואלי לתכנון Schema
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html) — רשימת כל הטיפוסים
- **SQLAlchemy Tutorial** — [docs.sqlalchemy.org](https://docs.sqlalchemy.org/)
- **Prisma Docs** — [prisma.io/docs](https://www.prisma.io/docs)

## 💼 שאלות לראיון עבודה

??? tip "איך תתכנן Schema למערכת הזמנות (E-commerce)?"
    ישויות: **User**, **Product**, **Order**, **OrderItem**, **Category**, **Review**. קשרים: User 1:M Order, Order M:M Product (דרך OrderItem), Product M:1 Category, User 1:M Review. שדות חשובים: `unit_price` ב-OrderItem (מחיר בזמן ההזמנה), `status` ב-Order (enum), `created_at` ו-`updated_at` בכל טבלה. Indexes על: Order.user_id, OrderItem.order_id, Product.category_id.

??? tip "מה ההבדל בין 1NF, 2NF ו-3NF?"
    **1NF**: כל תא מכיל ערך אטומי אחד (לא רשימות). **2NF**: 1NF + כל שדה תלוי ב-Primary Key המלא (רלוונטי רק ל-Composite PK). **3NF**: 2NF + אין תלויות עקיפות — שדה לא תלוי בשדה אחר שהוא לא Key. דוגמה: אם בטבלת orders יש `customer_name` — זו הפרה של 3NF כי `customer_name` תלוי ב-`customer_id`, לא ב-`order_id`.

??? tip "מתי כדאי לעשות Denormalization?"
    כש-**ביצועי קריאה** קריטיים ויש **הרבה JOINs** על אותם נתונים. דוגמאות: Dashboard שמציג סיכומים, מערכת דיווח, Search Results. שיטות: שמירת שדות מחושבים (total_amount ב-orders), Materialized Views, שכפול שדות נפוצים. **חשוב**: לתעד למה עשינו Denormalization ומה ה-Trade-off.

??? tip "מה היתרון של ORM על SQL ישיר?"
    **יתרונות ORM**: Type Safety, הגנה מ-SQL Injection, קוד קריא יותר, Migrations אוטומטיות, ניידות בין Databases, Lazy/Eager Loading מובנה. **חסרונות ORM**: N+1 Problem, שליטה מוגבלת בשאילתות מורכבות, Overhead בביצועים, "Magic" שקשה לדבג. **עצה**: השתמשו ב-ORM ל-CRUD רגיל, וכתבו Raw SQL לשאילתות מורכבות.

??? tip "מהן Migrations ולמה הן חשובות?"
    **Migration** היא שינוי מבוקר ב-Schema שמתועד כקוד (כמו Git commit ל-Database). חשיבות: **שחזור** — אפשר לחזור לגרסה קודמת. **תיאום** — כל הצוות רואה את אותם שינויים. **אוטומציה** — CI/CD יכול להריץ Migrations בסביבת Production. **תיעוד** — כל שינוי ב-Schema מתועד עם תאריך וסיבה. כלים: Alembic (Python), Flyway (Java), Prisma Migrate, Django Migrations.

??? tip "הסבר את ההבדל בין Eager Loading ו-Lazy Loading ב-ORM"
    **Lazy Loading**: נתונים קשורים נטענים רק כשניגשים אליהם. חיסרון: N+1 Problem — שליפת 100 משתמשים ואז שאילתה נפרדת להזמנות של כל אחד. **Eager Loading**: נתונים קשורים נטענים ביחד עם השאילתה הראשית (JOIN). חיסרון: עלול לטעון יותר מדי נתונים. **כלל אצבע**: Eager Loading כשיודעים שצריכים את הנתונים הקשורים, Lazy Loading כשלא בטוחים.

??? tip "איך מטפלים ב-Soft Delete מול Hard Delete?"
    **Hard Delete**: `DELETE FROM users WHERE id = 5` — השורה נמחקת לגמרי. **Soft Delete**: `UPDATE users SET deleted_at = NOW() WHERE id = 5` — השורה מסומנת כמחוקה אבל נשארת ב-DB. יתרון Soft Delete: שחזור קל, Audit Trail, עמידה ברגולציה. חיסרון: כל שאילתה צריכה `WHERE deleted_at IS NULL`, הנתונים מצטברים. פתרון: View שמסנן שורות מחוקות, או העברה לטבלת Archive.

## קישורים לנושאים אחרים

- [מהו מסד נתונים](what-is-a-database.md) — מבוא כללי ו-ACID
- [Relational מול NoSQL](relational-vs-nosql.md) — ההבדלים בין Schema קבוע ל-Schemaless
- [שאילתות ואינדקסים (Queries and Indexes)](queries-and-indexes.md) — איך שולפים נתונים מה-Schema שהגדרנו
