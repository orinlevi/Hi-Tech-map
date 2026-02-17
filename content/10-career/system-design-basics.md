# 🏗️ System Design -- מבוא

## למה זה חשוב

System Design זה השלב שבו מפסיקים לחשוב על **שורות קוד** ומתחילים לחשוב על **מערכות שלמות**. זה ההבדל בין "אני יודע לבנות פונקציה" לבין "אני יודע לבנות מערכת שמשרתת מיליון משתמשים בלי שהיא קורסת ב-Black Friday".

> "בניתי אתר מדהים. הוא קרס כשנכנסו 50 אנשים בו-זמנית. באותו רגע הבנתי למה System Design חשוב."

!!! note "למה System Design חשוב לראיונות?"
    בראיון System Design, החברה בודקת אם אתם יכולים **לחשוב beyond code** -- להבין trade-offs, לקבל החלטות תחת אי-ודאות, ולתקשר רעיונות מורכבים בצורה ברורה. זו מיומנות של Senior, אבל גם Junior שמבין את הבסיס בולט.

---

## איך ניגשים לשאלת System Design

### הטעות הנפוצה ביותר

רוב האנשים קופצים ישר ל-"אני צריך Database ו-Server ו-Load Balancer ו-..." -- בלי להבין **מה בעצם בונים**.

> "System Design בלי requirements זה כמו לבנות בית בלי לשאול כמה חדרים צריך."

### המתודולוגיה -- 4 שלבים

**שלב 1: הבנת הדרישות (5 דקות)**

שאלו שאלות! זה לא רק בסדר -- זה **מצופה**.

- **Functional Requirements** -- מה המערכת צריכה לעשות?
    - "האם משתמשים צריכים להירשם?"
    - "האם צריך תמיכה ב-real-time?"
    - "מה ה-core features?"
- **Non-Functional Requirements** -- איך המערכת צריכה להתנהג?
    - "כמה משתמשים? 1,000? 10 מיליון?"
    - "מה ה-latency המקובל?"
    - "האם availability חשוב יותר מ-consistency?"

**שלב 2: High-Level Design (10 דקות)**

שרטטו את הרכיבים העיקריים ואת הקשרים ביניהם:

```
Client → Load Balancer → Web Servers → Application Logic → Database
                                              ↓
                                           Cache
                                              ↓
                                        Message Queue
```

**שלב 3: Deep Dive (15-20 דקות)**

בחרו 2-3 רכיבים קריטיים והעמיקו:

- מה ה-Database schema?
- איך מטפלים ב-caching?
- מה קורה כש-server קורס?
- איך עושים scale?

**שלב 4: Trade-offs ושיפורים (5 דקות)**

- מה ה-bottlenecks?
- מה יקרה אם התעבורה תגדל פי 100?
- מה הייתם עושים אחרת אם היה לכם יותר זמן?

---

## מושגי יסוד

### Scalability (סקלביליות)

היכולת של מערכת **לגדול** בלי שהביצועים יתדרדרו.

**שני סוגים:**

| סוג | מה זה | יתרונות | חסרונות |
|-----|--------|---------|---------|
| **Vertical Scaling** (Scale Up) | מחשב חזק יותר -- יותר RAM, CPU | פשוט, לא צריך לשנות קוד | יש גבול פיזי, יקר, single point of failure |
| **Horizontal Scaling** (Scale Out) | יותר מחשבים | אין גבול תיאורטי, redundancy | מורכב יותר, צריך Load Balancer |

> "Vertical scaling זה כמו לשים מנוע יותר חזק באוטו. Horizontal scaling זה כמו להוסיף עוד אוטובוסים לקו."

!!! tip "כלל אצבע"
    **תמיד תכננו ל-Horizontal Scaling.** גם אם עכשיו מספיק Vertical, יום אחד תגיעו לתקרה. עדיף לתכנן נכון מההתחלה.

---

### Availability (זמינות)

**כמה זמן המערכת עובדת** מתוך הזמן הכולל. נמדד ב-"nines":

| רמה | Uptime | Downtime בשנה | דוגמה |
|------|--------|--------------|-------|
| 99% (two nines) | | ~3.65 ימים | בלוג אישי |
| 99.9% (three nines) | | ~8.7 שעות | אתר e-commerce |
| 99.99% (four nines) | | ~52 דקות | שירותי ענן (AWS, GCP) |
| 99.999% (five nines) | | ~5.3 דקות | מערכות קריטיות (בנקים, בתי חולים) |

**איך משיגים High Availability:**

- **Redundancy** -- שכפול של כל רכיב קריטי
- **Failover** -- מעבר אוטומטי לגיבוי כשמשהו נופל
- **Health Checks** -- בדיקה שוטפת שהכל עובד
- **Geographic Distribution** -- פריסה על פני מספר data centers

---

### Consistency (עקביות)

**האם כל המשתמשים רואים את אותו מידע באותו רגע?**

| סוג | מה זה | מתי צריך |
|-----|--------|---------|
| **Strong Consistency** | כולם רואים את אותו מידע מיד | מערכות בנקאיות, הזמנות |
| **Eventual Consistency** | המידע מתעדכן בסופו של דבר, עם עיכוב | Social media feeds, DNS |
| **Causal Consistency** | פעולות קשורות מוצגות בסדר הנכון | מערכות צ'אט |

> "Strong consistency זה כמו שיחת טלפון -- שניכם שומעים את אותו דבר בזמן אמת. Eventual consistency זה כמו הודעת WhatsApp -- לפעמים יש וי אחד לפני שיש שניים."

---

### CAP Theorem (משפט CAP)

!!! note "משפט CAP -- הבסיס של System Design"
    במערכת מבוזרת, אתם יכולים להבטיח רק **שניים מתוך שלושה**:

    - **C** - Consistency (עקביות) -- כולם רואים את אותו מידע
    - **A** - Availability (זמינות) -- המערכת תמיד מגיבה
    - **P** - Partition Tolerance (עמידות בחלוקה) -- המערכת עובדת גם כש-nodes לא מתקשרים

    **בפועל**: P הוא חובה (רשתות תמיד יכולות להיכשל), אז הבחירה האמיתית היא בין **CP** (consistency over availability) ו-**AP** (availability over consistency).

**דוגמאות:**

| מערכת | בחירה | למה |
|-------|--------|-----|
| בנק | CP | העברת כסף חייבת להיות מדויקת. עדיף שהמערכת תהיה לא זמינה מאשר שתראה יתרה שגויה |
| Twitter Feed | AP | עדיף שתראו פוסט ישן מאשר שהאתר יהיה למטה. הפוסט החדש יגיע בסוף |
| מערכת הזמנות | CP | לא רוצים למכור את אותו כרטיס פעמיים |

---

## Building Blocks -- לבני הבניין

### Load Balancer (מאזן עומסים)

**מה זה**: מפזר תעבורה בין מספר servers.

**למה צריך**: אם יש לכם server אחד ונכנסים 10,000 בקשות בשנייה -- הוא יקרוס. Load Balancer מחלק את העבודה.

```
                    ┌──→ Server 1
Client → Load   ───┼──→ Server 2
         Balancer   └──→ Server 3
```

**אסטרטגיות חלוקה:**

- **Round Robin** -- כל בקשה ל-server הבא בתור (פשוט, אבל לא מתחשב בעומס)
- **Least Connections** -- שולח ל-server הכי פנוי
- **IP Hash** -- לפי כתובת ה-IP של המשתמש (שומר על session)

---

### Cache (מטמון)

**מה זה**: אחסון זמני של מידע שנגישות אליו תכופה, כדי לא לגשת ל-Database בכל פעם.

> "Cache זה כמו פתק שנדבק על המסך. עדיף להסתכל על הפתק מאשר לפתוח את הארון בכל פעם."

**אסטרטגיות:**

| אסטרטגיה | איך עובד | מתי להשתמש |
|----------|----------|-----------|
| **Cache-Aside** | האפליקציה בודקת cache ← אם אין, קוראת מ-DB ← שומרת ב-cache | Read-heavy workloads |
| **Write-Through** | כותבים ל-cache ול-DB בו-זמנית | כש-consistency חשוב |
| **Write-Behind** | כותבים ל-cache, ומתישהו ל-DB | כש-write performance חשוב |

**כלים נפוצים**: Redis, Memcached

!!! warning "Cache Invalidation"
    "There are only two hard things in Computer Science: cache invalidation and naming things." -- Phil Karlton

    **מתי לרענן את ה-cache?** זו אחת השאלות הקשות ביותר ב-System Design. TTL (Time To Live) הוא הפתרון הנפוץ -- המידע ב-cache פג תוקף אחרי זמן מוגדר.

---

### Message Queue (תור הודעות)

**מה זה**: מערכת שמאפשרת לרכיבים לתקשר **באופן לא סינכרוני** (asynchronous).

**למה צריך**: לא כל פעולה צריכה לקרות **עכשיו**. שליחת מייל, עיבוד תמונה, יצירת דוח -- כל אלה יכולים לחכות.

```
Producer → [Message Queue] → Consumer
           (RabbitMQ,         (Background
            Kafka,             Worker)
            SQS)
```

**דוגמה**: משתמש מעלה תמונה → שומרים את התמונה → שולחים הודעה ל-queue → worker מעבד את התמונה (resize, compress) → מעדכנים את המשתמש

**כלים נפוצים**: RabbitMQ, Apache Kafka, AWS SQS

---

### CDN (Content Delivery Network)

**מה זה**: רשת של servers מפוזרים גיאוגרפית שמגישים תוכן סטטי (תמונות, CSS, JS) מקרוב למשתמש.

**למה צריך**: אם ה-server שלכם בניו יורק ומשתמש בתל אביב מבקש תמונה -- זה לוקח זמן. CDN שומר עותק של התמונה ב-server בישראל.

**כלים נפוצים**: CloudFlare, AWS CloudFront, Akamai

---

### Database -- SQL vs NoSQL

| | SQL (Relational) | NoSQL (Non-Relational) |
|---|---|---|
| **מבנה** | טבלאות עם schema קבוע | גמיש -- documents, key-value, graph |
| **שפת שאילתה** | SQL | תלוי -- MongoDB query, CQL, etc. |
| **Scaling** | בעיקר Vertical | Horizontal בקלות |
| **ACID** | כן (transactions) | לפעמים (תלוי במימוש) |
| **מתי להשתמש** | נתונים מובנים, relationships | נתונים לא מובנים, scale גדול |
| **דוגמאות** | PostgreSQL, MySQL | MongoDB, Cassandra, Redis, DynamoDB |

??? tip "איך לבחור Database בראיון?"
    שאלו את עצמכם:

    1. **האם הנתונים מובנים?** כן → SQL. לא → NoSQL
    2. **האם צריך transactions?** כן → SQL
    3. **האם הנתונים מאוד גדולים?** כן → NoSQL (או SQL עם sharding)
    4. **האם צריך גמישות ב-schema?** כן → NoSQL
    5. **האם יש relationships מורכבים?** כן → SQL (או Graph DB)

ראו [מבוא למסדי נתונים](../06-data/what-is-a-database.md) ו-[SQL vs NoSQL](../06-data/relational-vs-nosql.md) לעומק.

---

## דוגמה 1: URL Shortener (כמו bit.ly)

### שלב 1 -- דרישות

**Functional:**

- משתמש נותן URL ארוך, מקבל URL קצר
- לחיצה על URL קצר מפנה ל-URL המקורי
- אופציונלי: סטטיסטיקות (כמה לחצו)

**Non-Functional:**

- Low latency (ההפניה צריכה להיות מהירה)
- High availability (אם הקישור לא עובד, זה חסר ערך)
- Scale: 100 מיליון URLs, 1 מיליארד redirects בחודש

### שלב 2 -- High-Level Design

```
Client → Load Balancer → Web Server → Database
                              ↓
                           Cache (Redis)
```

### שלב 3 -- Deep Dive

**איך מייצרים URL קצר?**

- **גישה 1**: Hash (MD5/SHA256) של ה-URL הארוך, לוקחים 7 תווים ראשונים
- **גישה 2**: Counter מרכזי שמייצר ID ייחודי, ממירים ל-Base62
- **גישה 3**: UUID/nanoid ושומרים ב-DB

**Database Schema:**

```sql
CREATE TABLE urls (
    short_code  VARCHAR(7) PRIMARY KEY,
    long_url    TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    click_count INTEGER DEFAULT 0
);
```

**Caching:**

- 80% מהתעבורה הולכת ל-20% מה-URLs (עיקרון פארטו)
- Redis cache עם TTL של 24 שעות
- Cache-aside strategy

### שלב 4 -- Trade-offs

- **Hash collision** -- מה קורה אם שני URLs מקבלים את אותו hash? פתרון: בדיקה ב-DB + retry
- **Read-heavy** -- הרבה יותר קריאות מכתיבות. Cache מאוד אפקטיבי
- **Analytics** -- אם צריך סטטיסטיקות, Message Queue + async processing

---

## דוגמה 2: Chat System (כמו WhatsApp)

### שלב 1 -- דרישות

**Functional:**

- שליחת הודעות 1-on-1
- Group chat
- חיווי online/offline
- היסטוריית הודעות

**Non-Functional:**

- Low latency (הודעות צריכות להגיע מהר)
- Reliability (הודעות לא הולכות לאיבוד)
- Scale: 500 מיליון משתמשים, 100 מיליארד הודעות ביום

### שלב 2 -- High-Level Design

```
Client A → WebSocket Server → Message Service → Database
                                    ↓
                              Message Queue
                                    ↓
               WebSocket Server → Client B
```

### שלב 3 -- Deep Dive

**WebSocket vs HTTP:**

- HTTP = שאלה-תשובה (client שואל, server עונה)
- WebSocket = ערוץ פתוח (שני הצדדים שולחים מתי שרוצים)
- לצ'אט, **WebSocket הוא חובה** -- אי אפשר לחכות ש-client ישאל "יש הודעות חדשות?" כל שנייה

**שמירת הודעות:**

- NoSQL (Cassandra / DynamoDB) -- כי כל הודעה היא write, והנפח עצום
- Partition by conversation_id -- כל השיחה באותו partition
- סדר כרונולוגי עם timestamp

**Online/Offline Status:**

- Heartbeat כל 30 שניות
- אם אין heartbeat 60 שניות → סטטוס offline
- Publish-Subscribe pattern -- כשמישהו משנה סטטוס, מעדכנים את כל החברים

### שלב 4 -- Trade-offs

- **Eventual consistency** -- מספיק. אם הודעה מגיעה עם עיכוב של 200ms, זה בסדר
- **Message ordering** -- חשוב! משתמשים ב-timestamp + sequence number
- **Media** -- תמונות ווידאו נשמרים ב-Object Storage (S3), ב-DB רק ה-URL

---

## טיפים לראיון System Design

!!! tip "5 כללים לראיון מוצלח"
    1. **שאלו שאלות** -- אל תניחו הנחות. המראיין רוצה לראות שאתם מבינים שצריך requirements
    2. **התחילו high-level** -- אל תקפצו ל-database schema. קודם תציירו את ה-big picture
    3. **דברו על trade-offs** -- אין פתרון מושלם. כל החלטה היא trade-off. הראו שאתם מבינים את זה
    4. **השתמשו במספרים** -- "100K requests per second" עדיף על "הרבה בקשות"
    5. **היו ישרים** -- אם אתם לא בטוחים, תגידו "אני לא בטוח, אבל ההנחה שלי היא..."

---

## 🛤️ מאיפה מתחילים

### תוכנית לימוד -- 3 שבועות

**שבוע 1: מושגי יסוד**

- [ ] קראו מדריך זה מהתחלה עד הסוף
- [ ] הבינו את ההבדלים בין SQL ל-NoSQL (ראו [SQL vs NoSQL](../06-data/relational-vs-nosql.md))
- [ ] למדו מה זה Load Balancer, Cache, Message Queue, CDN
- [ ] הכירו את CAP Theorem ותדעו לתת דוגמאות

**שבוע 2: תרגול עם דוגמאות**

- [ ] תכננו URL Shortener (לבד, ואז השוו לפתרון מקובל)
- [ ] תכננו Chat System
- [ ] תכננו Twitter Feed
- [ ] לכל תכנון -- כתבו את ה-trade-offs

**שבוע 3: mock interviews**

- [ ] עשו mock interview עם חבר/ה
- [ ] תרגלו לצייר על לוח (או על נייר)
- [ ] תרגלו לדבר בקול תוך כדי תכנון -- זה **קריטי**
- [ ] קראו case studies של מערכות אמיתיות

### משאבים מומלצים

- **System Design Interview (Alex Xu)** -- הספר הקלאסי, מומלץ מאוד
- **Designing Data-Intensive Applications (Martin Kleppmann)** -- ספר מעמיק יותר, ברמת Senior
- **ByteByteGo** (YouTube / Newsletter) -- הסברים ויזואליים מצוינים
- **System Design Primer** (GitHub) -- משאב חינמי מקיף

!!! tip "מה ללמוד באקדמיה"
    הבנת System Design דורשת ידע במערכות הפעלה, רשתות, ומבני נתונים -- כל אלה נלמדים באקדמיה.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מערכות הפעלה (0368-2162)
    - רשתות תקשורת מחשבים (0368-3030)
    - מבני נתונים (0368-2158)

---

## 💼 שאלות לראיון עבודה

??? tip "תכנן URL Shortener"
    **שלבים:**

    1. שאלו על scale (כמה URLs? כמה redirects?)
    2. שרטטו: Client → LB → Server → DB + Cache
    3. הסבירו איך מייצרים short code (hash / counter / UUID)
    4. דברו על caching strategy (Redis, TTL)
    5. דברו על read-heavy workload ואיך cache עוזר

    **Bonus**: הזכירו analytics pipeline עם Message Queue.

??? tip "תכנן מערכת צ'אט"
    **שלבים:**

    1. שאלו: 1-on-1? Groups? Media support?
    2. הסבירו למה WebSocket ולא HTTP polling
    3. שרטטו: Clients ↔ WebSocket Servers ↔ Message Queue ↔ DB
    4. בחרו NoSQL (Cassandra) והסבירו למה
    5. דברו על online status (heartbeat) ו-message ordering

    **Bonus**: הסבירו end-to-end encryption ברמה גבוהה.

??? tip "מה ההבדל בין SQL ל-NoSQL?"
    **SQL**: טבלאות, schema קבוע, relationships, ACID transactions. מתאים לנתונים מובנים עם קשרים (e-commerce, בנקאות).

    **NoSQL**: גמיש, scale out בקלות, מודלים שונים (document, key-value, graph). מתאים לנתונים לא מובנים או scale ענק.

    **הכלל**: "אם אתם לא בטוחים -- תתחילו עם SQL. עברו ל-NoSQL רק כשיש סיבה טובה."

??? tip "הסבר CAP Theorem"
    **C** = Consistency -- כולם רואים אותו מידע

    **A** = Availability -- המערכת תמיד מגיבה

    **P** = Partition Tolerance -- המערכת שורדת כשלי רשת

    **הבחירה בפועל**: P הוא חובה, אז הבחירה היא CP (בנקים) או AP (social media).

    **דוגמה**: בנק בוחר CP כי אי אפשר להראות יתרה שגויה. Twitter בוחר AP כי עדיף שתראו feed ישן מאשר שהאתר יהיה למטה.

??? tip "איך Load Balancer עובד?"
    **תפקיד**: מחלק תעבורה בין servers.

    **אסטרטגיות**: Round Robin (בתור), Least Connections (הכי פנוי), IP Hash (לפי משתמש).

    **Health Checks**: בודק כל X שניות שה-servers חיים. אם server מת -- מפסיק לשלוח אליו.

    **Layer 4 vs Layer 7**: L4 עובד ברמת TCP (מהיר), L7 עובד ברמת HTTP (חכם יותר, יכול לנתב לפי URL).

??? tip "מתי להשתמש ב-Cache?"
    **כלל אצבע**: כש-read >> write ויש נתונים "חמים" שנקראים הרבה.

    **דוגמאות**: פרופיל משתמש, feed, תוצאות חיפוש פופולריות.

    **אל תשתמשו ב-cache כש**: הנתונים משתנים כל הזמן, consistency קריטי, או שאין דפוס "hot data".

    **Cache Eviction**: LRU (Least Recently Used) הוא הנפוץ ביותר.

??? tip "מה זה Message Queue ולמה צריך?"
    **מה זה**: מערכת שמאפשרת תקשורת async בין רכיבים.

    **למה צריך**: decoupling (רכיבים לא תלויים אחד בשני), buffering (מתמודד עם spikes), reliability (הודעות לא הולכות לאיבוד).

    **דוגמה**: משתמש מזמין פיצה → שומרים הזמנה ב-DB → שולחים הודעה ל-queue → workers מטפלים: שולחים מייל אישור, מעדכנים מלאי, שולחים push notification.

??? tip "מה קורה כשה-Database הופך ל-bottleneck?"
    **פתרונות:**

    1. **Indexing** -- הוסיפו indexes על עמודות שמחפשים בהן הרבה
    2. **Read Replicas** -- שכפלו DB לקריאה בלבד
    3. **Sharding** -- חלקו את הנתונים בין כמה DB servers (לפי user_id, geography)
    4. **Caching** -- שימו cache לפני ה-DB
    5. **Denormalization** -- שכפלו נתונים כדי להימנע מ-JOINs יקרים

    **הסדר חשוב**: תמיד תנסו indexing ו-caching לפני sharding. Sharding מוסיף מורכבות עצומה.

---

## בלבולים נפוצים

!!! warning "\"צריך לזכור את כל ה-building blocks בעל פה\""
    **לא.** צריך להבין **מתי** להשתמש בכל אחד ו**למה**. בראיון, המראיין לא מצפה שתזכרו כל פרט -- הוא רוצה לראות חשיבה מערכתית.

!!! warning "\"System Design רלוונטי רק ל-Seniors\""
    **לא נכון.** חברות כמו Amazon שואלות System Design גם Juniors (ברמה בסיסית יותר). וגם אם לא שואלים -- **הידע הזה הופך אתכם למפתחים טובים יותר**.

!!! warning "\"יש תשובה אחת נכונה\""
    **אין.** System Design הוא על **trade-offs**. כל החלטה הופכת משהו לטוב יותר ומשהו אחר לפחות טוב. המראיין רוצה לראות שאתם מבינים את זה.

---

## קישורים לנושאים אחרים

- [הכנה לראיון](./interview-prep.md) -- סקירה כללית של תהליך הראיון
- [ראיון קוד](./coding-interview.md) -- ההכנה הטכנית לחלק האלגוריתמי
- [מה זה מסד נתונים](../06-data/what-is-a-database.md) -- בסיס חשוב ל-System Design
- [SQL vs NoSQL](../06-data/relational-vs-nosql.md) -- לעומק בבחירת Database
- [Client-Server](../03-networks/client-server.md) -- איך הרשת עובדת
- [CPU vs GPU](../04-systems/cpu-vs-gpu.md) -- הבנת חומרה ברמה בסיסית
