# Client-Server

## למה זה חשוב

כמעט כל אפליקציה מודרנית בנויה על מודל **Client-Server**. כשאתם גולשים באתר, שולחים הודעה ב-WhatsApp, או מזמינים אוכל באפליקציה -- יש צד שמבקש (Client) וצד שמספק (Server). הבנה של הדינמיקה הזו היא הבסיס לכל עבודה ב-Backend, Frontend, ו-DevOps.

(אם פעם תהיתם למה כל כך קשה לבנות אפליקציית צ'אט -- התשובה מתחילה כאן.)

## רעיונות מרכזיים

### מה זה Client-Server Architecture?

- **Client** -- הצד שיוזם בקשה. לרוב זה דפדפן, אפליקציית מובייל, או כל תוכנה שמבקשת מידע.
- **Server** -- הצד שמקשיב לבקשות, מעבד אותן, ומחזיר תשובה. לרוב זה שרת עם קוד Backend.
- המודל הזה מפריד בין **מי שצורך** את השירות לבין **מי שמספק** אותו.

```
┌──────────┐         Request          ┌──────────┐
│          │  ───────────────────────► │          │
│  Client  │                          │  Server  │
│ (Browser)│  ◄─────────────────────  │ (Backend)│
│          │         Response         │          │
└──────────┘                          └──────────┘
```

??? tip "תרגום לעברית פשוטה"
    דמיינו מסעדה. אתם (Client) מזמינים אוכל. המטבח (Server) מכין ומגיש. אתם לא צריכים לדעת איך המטבח עובד, והמטבח לא צריך לדעת מה אתם עושים אחרי האוכל. זו הפרדת אחריות בגרסה הכי טעימה שלה.

### מחזור Request-Response

1. ה-Client שולח **Request** (בקשה) לשרת -- למשל `GET /api/users`.
2. השרת מקבל את הבקשה, מעבד אותה (שליפה מ-Database, חישוב לוגיקה, וכו').
3. השרת מחזיר **Response** (תשובה) עם Status Code ו-Body.
4. ה-Client מקבל את התשובה ומציג אותה למשתמש.

!!! note "כל אינטראקציה ברשת עובדת ככה"
    גם כשאתם פותחים דף אינטרנט פשוט, הדפדפן שולח עשרות בקשות -- עבור ה-HTML, CSS, JavaScript, תמונות, fonts, ועוד.

!!! note "סיפור מהשטח"
    מפתח ג'וניור עבד שבוע על באג, מבלי להבין למה ה-Frontend מציג נתונים ישנים. מה שהוא לא ידע: הדפדפן עשה Cache לתשובה הקודמת, וה-Server בכלל לא קיבל את הבקשה החדשה. **תמיד תבדקו את לשונית Network ב-DevTools לפני שאתם מאשימים את ה-Backend.**

### Browser כ-Client, Backend כ-Server

- ה-**Browser** (דפדפן) הוא ה-Client הנפוץ ביותר. הוא שולח HTTP Requests ומציג את ה-Response למשתמש.
- ה-**Backend** (למשל שרת Node.js, Django, Spring) הוא ה-Server שמעבד לוגיקה עסקית.
- ה-Backend בדרך כלל מתקשר גם עם **Database**, ובמקרה הזה ה-Backend הופך ל-Client של ה-Database.

```
┌──────────┐    HTTP     ┌──────────┐    TCP/SQL    ┌──────────┐
│ Browser  │ ──────────► │ Backend  │ ────────────► │ Database │
│ (Client) │ ◄────────── │ (Server/ │ ◄──────────── │ (Server) │
└──────────┘             │  Client) │               └──────────┘
                         └──────────┘
                              │          TCP/HTTP
                              │ ────────────────────► ┌──────────┐
                              └──────────────────────  │ External │
                                                       │   API    │
                                                       └──────────┘
```

??? tip "תרגום לעברית פשוטה"
    ה-Backend הוא כמו מתווך נדל"ן. מצד אחד הוא נותן שירות ללקוחות (Client), מצד שני הוא עצמו לקוח של בעלי הדירות (Database). מישהו תמיד עובד בשביל מישהו אחר.

### REST API -- הבסיס

**REST** (Representational State Transfer) הוא סגנון ארכיטקטורה לבניית API-ים:

- משתמש ב-HTTP Methods: `GET`, `POST`, `PUT`, `DELETE`
- כל Resource מיוצג ב-URL: `/api/users/42`
- התקשורת מבוססת על פורמטים סטנדרטיים (לרוב JSON)

```http
GET /api/products/7 HTTP/1.1
Host: example.com
Accept: application/json
```

```json
{
  "id": 7,
  "name": "Mechanical Keyboard",
  "price": 350
}
```

#### עקרונות REST שחשוב להכיר

| עיקרון | משמעות | למה זה חשוב |
|--------|--------|-------------|
| **Stateless** | כל בקשה עצמאית, אין "זיכרון" בין בקשות | מאפשר Scale אופקי בקלות |
| **Uniform Interface** | כל Resource נגיש דרך URL עקבי | קל לצרוך ולתחזק |
| **Client-Server Separation** | ה-Client וה-Server מפותחים בנפרד | שינוי ב-Frontend לא שובר את ה-Backend |
| **Cacheable** | תשובות יכולות להישמר ב-Cache | מפחית עומס על השרת |
| **Layered System** | ה-Client לא חייב לדעת אם הוא מדבר עם Proxy, LB או Server ישיר | מאפשר ארכיטקטורה מורכבת |

### API Versioning -- כשה-API משתנה

כשמשנים API, לא רוצים לשבור Clients קיימים. יש כמה גישות:

```
גישה 1: URL Versioning (הכי נפוץ)
────────────────────────────────────
GET /api/v1/users/42
GET /api/v2/users/42    ← שדות חדשים, פורמט שונה

גישה 2: Header Versioning
──────────────────────────
GET /api/users/42
Accept: application/vnd.myapi.v2+json

גישה 3: Query Parameter
────────────────────────
GET /api/users/42?version=2
```

| גישה | יתרון | חיסרון |
|------|-------|--------|
| **URL Versioning** | פשוט, ברור, קל ל-Cache | URL-ים ארוכים, דופליקציה של Routes |
| **Header Versioning** | URL נקי | פחות גלוי, קשה יותר לבדוק בדפדפן |
| **Query Parameter** | פשוט להוספה | קל לשכוח, פחות RESTful |

!!! note "סיפור מהשטח"
    חברה אחת שינתה API בלי versioning. בבוקר יום שני, 3,000 Clients חיצוניים שלחו מיילים זועמים. מאז, כלל הברזל שלהם: **כל שינוי שובר (Breaking Change) = גרסה חדשה**. תלמדו מטעויות של אחרים, זה פחות כואב.

### Stateless vs Stateful

| | Stateless | Stateful |
|---|---|---|
| **משמעות** | השרת לא זוכר כלום בין בקשות | השרת שומר מידע על ה-Client |
| **דוגמה** | REST API -- כל בקשה עצמאית | WebSocket -- חיבור פתוח רציף |
| **יתרון** | קל ל-Scale, פשוט | חוויה עשירה יותר |
| **חיסרון** | צריך לשלוח הכל כל פעם | קשה ל-Scale |

??? tip "איך REST נשאר Stateless אבל עדיין 'מזהה' אתכם?"
    באמצעות **Tokens** (כמו JWT) שנשלחים בכל בקשה ב-Header. השרת לא "זוכר" אתכם -- הוא פשוט קורא את ה-Token ומבין מי אתם מחדש בכל בקשה.

---

## מעבר ל-Request-Response: תבניות תקשורת מתקדמות

### WebSockets -- תקשורת דו-כיוונית בזמן אמת

מודל Request-Response הרגיל לא מתאים לכל מצב. מה קורה כשאתם רוצים **עדכונים בזמן אמת** -- כמו צ'אט, נתוני בורסה, או משחק מרובה משתתפים?

**WebSocket** הוא פרוטוקול שמאפשר חיבור **פתוח ורציף** בין Client ל-Server:

```
HTTP Request-Response (רגיל):
─────────────────────────────
Client ──Request──►  Server
Client ◄─Response─── Server
(החיבור נסגר)

Client ──Request──►  Server
Client ◄─Response─── Server
(החיבור נסגר שוב)


WebSocket (חיבור רציף):
───────────────────────
Client ──HTTP Upgrade──► Server     ← Handshake (פעם אחת)
       ◄─── 101 ────────

Client ══════════════════ Server    ← החיבור נשאר פתוח
Client ──Message──►       Server    ← Client שולח מתי שרוצה
Client       ◄──Message── Server    ← Server שולח מתי שרוצה
Client ──Message──►       Server
Client       ◄──Message── Server
       ...
```

#### ה-WebSocket Handshake

WebSocket מתחיל כ-HTTP Request רגיל עם בקשת Upgrade:

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

אחרי ה-Handshake, התקשורת עוברת ל-WebSocket Protocol (לא HTTP יותר).

```javascript
// Client-side (Browser)
const ws = new WebSocket('wss://example.com/chat');

ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('New message:', data);
};

// Server-side (Node.js + ws library)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Broadcast to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
```

!!! note "סיפור מהשטח"
    מפתח ניסה לבנות צ'אט בזמן אמת עם Polling -- כל שנייה שלח GET request לבדוק אם יש הודעות חדשות. עם 1,000 משתמשים, השרת קיבל 60,000 בקשות בדקה (רובן ריקות). עם WebSocket, ירד ל-כמה מאות הודעות בדקה. **הבחירה בפרוטוקול הנכון חוסכת כסף, לפעמים הרבה.**

### Server-Sent Events (SSE) -- עדכונים חד-כיווניים מהשרת

לפעמים לא צריך תקשורת דו-כיוונית. צריך רק שהשרת **ישלח עדכונים** ל-Client -- למשל, Feed של חדשות, התקדמות של Task ארוך, או התראות.

```
SSE (Server-Sent Events):
──────────────────────────
Client ──GET /events──► Server       ← בקשת HTTP רגילה
Client ◄─ data: {...}── Server       ← Server שולח event
Client ◄─ data: {...}── Server       ← Server שולח עוד event
Client ◄─ data: {...}── Server       ← והחיבור נשאר פתוח
```

| תכונה | WebSocket | SSE |
|--------|-----------|-----|
| **כיוון** | דו-כיווני | חד-כיווני (Server → Client) |
| **פרוטוקול** | ws:// / wss:// | HTTP רגיל |
| **Reconnect אוטומטי** | צריך לממש ידנית | מובנה! |
| **Binary Data** | נתמך | טקסט בלבד |
| **שימושים** | צ'אט, משחקים, שיתופי פעולה | התראות, Feeds, התקדמות |
| **Firewall Friendly** | לפעמים בעייתי | עובד מעולה (HTTP רגיל) |

```javascript
// Server-side (Node.js)
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // שולח עדכון כל 5 שניות
    const interval = setInterval(() => {
        const data = { price: Math.random() * 100, time: Date.now() };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 5000);

    req.on('close', () => clearInterval(interval));
});

// Client-side
const source = new EventSource('/events');
source.onmessage = (event) => {
    console.log('Stock update:', JSON.parse(event.data));
};
```

??? tip "תרגום לעברית פשוטה"
    WebSocket = שיחת טלפון. שני הצדדים מדברים.
    SSE = רדיו. משדרים ואתם מקשיבים. אם הרדיו נופל, הוא מתחבר מחדש לבד. נחמד, לא?

### Long Polling -- הפתרון ה"ישן" שעדיין רלוונטי

לפני WebSocket ו-SSE, השתמשו ב-**Long Polling**: ה-Client שולח Request, והשרת **לא עונה** עד שיש מידע חדש (או שעובר Timeout):

```
Regular Polling (בזבזני):
─────────────────────────
Client ──"יש חדש?"──► Server
Client ◄── "לא" ────── Server
(שנייה אחרי...)
Client ──"יש חדש?"──► Server
Client ◄── "לא" ────── Server
(שנייה אחרי...)
Client ──"יש חדש?"──► Server
Client ◄── "כן! הנה"── Server

Long Polling (יותר חכם):
────────────────────────
Client ──"תגיד לי כשיש חדש"──► Server
               ... ממתין ...
Client ◄── "הנה מידע חדש!" ─── Server  (אחרי 30 שניות)
Client ──"תגיד לי כשיש חדש"──► Server  (מיד שולח שוב)
               ... ממתין ...
```

### השוואה מלאה: מתי לבחור מה?

```
┌────────────────────────────────────────────────────────────┐
│                 מדריך בחירת פרוטוקול                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  צריך עדכונים בזמן אמת?                                   │
│  ├── לא ──► REST (Request-Response רגיל)                   │
│  └── כן                                                    │
│       ├── דו-כיווני? (שני הצדדים שולחים)                   │
│       │   ├── כן ──► WebSocket                              │
│       │   └── לא ──► SSE (Server-Sent Events)              │
│       └── בסביבה מוגבלת? (Firewall, Proxy ישן)             │
│           └── כן ──► Long Polling                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## gRPC -- תקשורת מהירה בין שירותים

### מה זה gRPC?

**gRPC** (Google Remote Procedure Call) הוא Framework לתקשורת בין שירותים שפותח על ידי Google. במקום לשלוח JSON על HTTP כמו ב-REST, gRPC משתמש ב-**Protocol Buffers** (פורמט בינארי) ו-**HTTP/2**.

```
REST:                           gRPC:
─────                           ─────
JSON (טקסט, כבד)                Protocol Buffers (בינארי, קל)
HTTP/1.1 (בקשה אחת בכל פעם)    HTTP/2 (בקשות מרובות במקביל)
קל ללמוד ולדבג                  ביצועים מעולים
נפוץ ל-Client↔Server           נפוץ ל-Server↔Server
```

#### הגדרת Service ב-gRPC

ב-gRPC מגדירים **חוזה** (Contract) בקובץ `.proto`:

```protobuf
// user_service.proto
syntax = "proto3";

service UserService {
    // Unary RPC -- כמו REST רגיל
    rpc GetUser (GetUserRequest) returns (User);

    // Server Streaming -- השרת שולח stream של תוצאות
    rpc ListUsers (ListUsersRequest) returns (stream User);

    // Client Streaming -- ה-Client שולח stream
    rpc UploadUsers (stream User) returns (UploadResponse);

    // Bidirectional Streaming -- שני הצדדים ב-stream
    rpc Chat (stream ChatMessage) returns (stream ChatMessage);
}

message GetUserRequest {
    int32 id = 1;
}

message User {
    int32 id = 1;
    string name = 2;
    string email = 3;
}
```

!!! note "סיפור מהשטח"
    חברת Fintech עברה מ-REST ל-gRPC בתקשורת בין Microservices פנימיים. ה-Latency ירד ב-40%, צריכת ה-Bandwidth ירדה ב-60%, והם חסכו 2 שרתים. לפעמים השינוי הכי קטן עושה את ההבדל הכי גדול.

### ארבעת סוגי ה-RPC ב-gRPC

```
1. Unary (כמו REST):
   Client ──Request──► Server
   Client ◄─Response── Server

2. Server Streaming:
   Client ──Request──► Server
   Client ◄─ data ──── Server
   Client ◄─ data ──── Server
   Client ◄─ data ──── Server

3. Client Streaming:
   Client ── data ───► Server
   Client ── data ───► Server
   Client ── data ───► Server
   Client ◄─Response── Server

4. Bidirectional Streaming:
   Client ══ data ═══► Server
   Client ◄═ data ════ Server
   Client ══ data ═══► Server
   Client ◄═ data ════ Server
```

### REST vs GraphQL vs gRPC -- השוואה מפורטת

| תכונה | REST | GraphQL | gRPC |
|--------|------|---------|------|
| **פורמט נתונים** | JSON | JSON | Protocol Buffers (בינארי) |
| **טרנספורט** | HTTP/1.1 or HTTP/2 | HTTP | HTTP/2 |
| **חוזה (Contract)** | OpenAPI/Swagger (אופציונלי) | Schema (חובה) | Proto files (חובה) |
| **Over/Under Fetching** | נפוץ | נפתר (Client בוחר שדות) | מוגדר מראש |
| **Streaming** | לא (רק עם SSE/WS) | Subscriptions | מובנה (4 סוגים) |
| **Browser Support** | מושלם | מושלם | דורש grpc-web |
| **Debug** | קל (curl, Postman) | בינוני (GraphQL playground) | קשה יותר (כלים ייעודיים) |
| **שימוש מומלץ** | Public APIs, CRUD | Client-heavy apps, Mobile | Microservices, High-perf |

```
Over-Fetching (בעיה של REST):
─────────────────────────────
אתם צריכים רק את שם המשתמש,
אבל GET /api/users/42 מחזיר הכל:
{
    "id": 42,
    "name": "Dana",        ← צריך
    "email": "...",         ← לא צריך
    "address": "...",       ← לא צריך
    "phone": "...",         ← לא צריך
    "preferences": {...}    ← ממש לא צריך
}

GraphQL פותר:
─────────────
query {
    user(id: 42) {
        name              ← מקבלים רק מה שביקשנו
    }
}
```

??? tip "תרגום לעברית פשוטה"
    REST זה כמו מסעדה עם תפריט קבוע -- מזמינים מנה, מקבלים מנה.
    GraphQL זה כמו בופה -- בוחרים בדיוק מה שרוצים על הצלחת.
    gRPC זה כמו delivery עם אופנוע -- הכי מהיר, אבל צריך לדעת את הכתובת המדויקת מראש.

---

## Microservices Communication Patterns

### Synchronous vs Asynchronous Communication

```
Synchronous (סינכרוני):
───────────────────────
Service A ──Request──► Service B
Service A ◄─Response── Service B
           (A ממתין ל-B)

Asynchronous (א-סינכרוני):
──────────────────────────
Service A ──Message──► Message Queue ──Message──► Service B
           (A לא ממתין, ממשיך לעבוד)
```

| | Synchronous | Asynchronous |
|---|---|---|
| **דוגמה** | REST, gRPC | RabbitMQ, Kafka, SQS |
| **Coupling** | חזק -- A תלוי ב-B | חלש -- A לא יודע על B |
| **Latency** | A ממתין ל-B | A ממשיך מיד |
| **מורכבות** | פשוט יחסית | מורכב (ordering, dedup, DLQ) |
| **מתי לבחור** | כשצריך תשובה מיידית | כשאפשר לעבד בנפרד |

### Event-Driven Architecture

```
┌──────────┐                         ┌──────────────┐
│  Orders  │── OrderCreated event ──►│ Event Bus    │
│  Service │                         │ (Kafka/      │
└──────────┘                         │  RabbitMQ)   │
                                     └──────┬───────┘
                                            │
                            ┌───────────────┼───────────────┐
                            ▼               ▼               ▼
                     ┌──────────┐   ┌──────────┐   ┌──────────┐
                     │ Payment  │   │ Inventory│   │  Email   │
                     │ Service  │   │ Service  │   │ Service  │
                     └──────────┘   └──────────┘   └──────────┘
                     "גבה תשלום"    "הורד מלאי"    "שלח אישור"
```

!!! warning "הסכנה של Distributed Systems"
    תקשורת א-סינכרונית מאפשרת Loose Coupling, אבל מביאה אתגרים: **Eventual Consistency** (המידע לא עדכני מיד בכל מקום), **Message Ordering** (הודעות יכולות להגיע בסדר שונה), ו-**Idempotency** (צריך לטפל בהודעות כפולות). אם זה נשמע לכם מסובך -- ברוכים הבאים לעולם ה-Distributed Systems.

### Saga Pattern -- טרנזקציות מבוזרות

כשפעולה עסקית כוללת מספר Microservices ומשהו נכשל באמצע:

```
Order Saga (Choreography):
──────────────────────────

1. Orders Service: צור הזמנה ───► event: OrderCreated
2. Payment Service: גבה תשלום ───► event: PaymentCompleted
3. Inventory Service: הקצה מלאי ───► event: InventoryReserved
4. Shipping Service: צור משלוח ───► event: ShipmentCreated

אם שלב 3 נכשל (אין מלאי):
3. Inventory Service ───► event: InventoryFailed
   ← Payment Service: **החזר תשלום** (Compensating Transaction)
   ← Orders Service: **בטל הזמנה** (Compensating Transaction)
```

---

## בלבולים נפוצים

- **"Server זה מחשב ספציפי"** -- לא בהכרח. Server זה **תפקיד**, לא חומרה. המחשב שלכם יכול להיות Server אם הוא מריץ תוכנה שמקשיבה לבקשות.
- **"Client זה תמיד דפדפן"** -- לא. Client יכול להיות אפליקציית מובייל, CLI, שרת אחר, או כל תוכנה שיוזמת בקשה.
- **"REST זה פרוטוקול"** -- REST הוא **סגנון ארכיטקטורה** (Architectural Style), לא פרוטוקול. הפרוטוקול שמתחת הוא HTTP.
- **"Stateless אומר שאין State בכלל"** -- יש State, אבל הוא לא נשמר **בשרת**. הוא נשמר ב-Client (Token) או ב-Database.
- **"WebSocket מחליף את HTTP"** -- WebSocket **משלים** את HTTP. ה-Handshake הראשוני הוא HTTP. רוב האפליקציות משתמשות בשניהם.
- **"gRPC תמיד עדיף על REST"** -- gRPC מצוין ל-Microservices פנימיים, אבל ל-Public API שצריך לעבוד מדפדפן, REST פשוט ונוח יותר.
- **"GraphQL פותר את כל הבעיות של REST"** -- GraphQL פותר Over/Under Fetching, אבל מוסיף **מורכבות** (N+1 queries, caching, authorization per field). אין כדור כסף.

!!! warning "טעות נפוצה בראיונות עבודה"
    הרבה אנשים מתבלבלים בין **Authentication** (מי אתה?) ל-**Authorization** (מה מותר לך?). שניהם קשורים ל-Client-Server אבל הם מושגים שונים לגמרי.

## דוגמה קטנה

נניח שאתם בונים אפליקציית רשימת מטלות (To-Do App):

```
Client (React App)                    Server (Node.js + Express)
─────────────────                    ──────────────────────────

1. המשתמש לוחץ "הוסף מטלה"
   POST /api/todos                ──►  מקבל את הבקשה
   Body: {"text": "ללמוד רשתות"}       שומר ב-Database
                                  ◄──  מחזיר: 201 Created
                                       {"id": 1, "text": "ללמוד רשתות"}

2. המשתמש רוצה לראות את כל המטלות
   GET /api/todos                 ──►  שולף מה-Database
                                  ◄──  מחזיר: 200 OK
                                       [{"id": 1, "text": "ללמוד רשתות"}]

3. המשתמש מוחק מטלה
   DELETE /api/todos/1            ──►  מוחק מה-Database
                                  ◄──  מחזיר: 204 No Content
```

??? tip "נסו בעצמכם"
    פתחו את DevTools בדפדפן (F12), עברו ללשונית **Network**, וגלשו לאתר כלשהו. תראו את כל ה-Requests שהדפדפן שולח -- זה Client-Server בפעולה!

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - רשתות מחשבים — client-server model, HTTP, sockets
    - הנדסת תוכנה — design patterns, system architecture
    - תכנות מתקדם — async I/O, networking APIs

    **קורסים מומלצים:**
    - מערכות מבוזרות — microservices, message queues, RPC
    - ארכיטקטורת תוכנה — REST, GraphQL, gRPC
    - Web Development — full-stack, APIs

    **ידע מעשי:**
    - curl, Postman — API testing
    - Express.js / Flask / FastAPI — backend frameworks
    - WebSocket, SSE — real-time communication
    - gRPC, Protocol Buffers — high-performance RPC

    **מתוכנית הלימודים שלך ב-TAU:**
    - רשתות תקשורת מחשבים (0368-3030)
    - Software Project (0368-2161)

---

## 🛤️ מאיפה מתחילים

1. **הבינו את הבסיס** -- בנו שרת HTTP פשוט (Node.js Express או Python Flask). כתבו 4 Routes בסיסיים (GET, POST, PUT, DELETE) ותתרגלו עם Postman או curl.

2. **למדו HTTP לעומק** -- קראו על Status Codes, Headers, ו-Content Types. השתמשו ב-`httpbin.org` לתרגול.

3. **בנו REST API מלא** -- צרו API עם CRUD מלא, Validation, Error Handling, ו-Authentication (JWT).

4. **הכירו WebSockets** -- בנו אפליקציית צ'אט פשוטה עם Socket.IO (Node.js) או שימוש ישיר ב-WebSocket API.

5. **התנסו ב-GraphQL** -- צרו GraphQL Schema פשוט עם Apollo Server. השוו את החוויה ל-REST.

6. **קראו על gRPC** -- התקינו gRPC, כתבו קובץ `.proto`, וצרו שירות פשוט. הבינו מתי gRPC עדיף על REST.

7. **צללו ל-Messaging** -- הריצו RabbitMQ או Redis Pub/Sub מקומית, ובנו תקשורת א-סינכרונית בין שני שירותים.

8. **קראו על Design Patterns** -- הכירו את Saga, CQRS, Event Sourcing, ו-API Gateway Pattern.

!!! tip "משאבים מומלצים"
    - **"Designing Data-Intensive Applications"** (Martin Kleppmann) -- ספר חובה לכל Backend Developer
    - **httpbin.org** -- Playground לתרגול HTTP
    - **Socket.IO Documentation** -- הדרך הקלה ביותר להתחיל עם WebSockets
    - **gRPC.io** -- הדוקומנטציה הרשמית של gRPC

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין REST, GraphQL, ו-gRPC? מתי תבחרו כל אחד?"
    **REST** מתאים ל-Public APIs ו-CRUD פשוט. הוא פשוט, מובן, ונתמך בכל פלטפורמה. **GraphQL** מתאים כשה-Client צריך גמישות בבחירת השדות שהוא מקבל (למשל, אפליקציית מובייל שרוצה להפחית Bandwidth). **gRPC** מתאים לתקשורת פנימית בין Microservices שצריכה להיות מהירה מאוד -- הוא משתמש בפורמט בינארי (Protocol Buffers) ותומך ב-Streaming. הבחירה תלויה בצרכים: **קהל חיצוני** → REST/GraphQL, **שירותים פנימיים** → gRPC, **גמישות לצרכן** → GraphQL.

??? tip "מה זה WebSocket ומתי תשתמשו בו במקום HTTP רגיל?"
    WebSocket מאפשר חיבור **דו-כיווני ורציף** בין Client ל-Server. ב-HTTP רגיל, כל Request-Response הוא עצמאי והחיבור נסגר. ב-WebSocket, החיבור נשאר פתוח ושני הצדדים יכולים לשלוח הודעות בכל רגע. שימושים: **צ'אט בזמן אמת**, **משחקים מרובי משתתפים**, **עדכוני בורסה**, **עריכה שיתופית** (כמו Google Docs). ה-Handshake מתחיל כ-HTTP Upgrade Request, ואחריו עוברים לפרוטוקול WebSocket.

??? tip "הסבירו את ההבדל בין Synchronous ל-Asynchronous Communication בין Microservices."
    ב-**Synchronous** (כמו REST/gRPC), Service A שולח בקשה ל-Service B ו**ממתין** לתשובה. זה פשוט אבל יוצר **Coupling** -- אם B קורס, A תקוע. ב-**Asynchronous** (כמו Message Queue), A שולח הודעה לתור ו**ממשיך הלאה** בלי לחכות. B יעבד כשיהיה פנוי. זה מפחית Coupling ומשפר Resilience, אבל מוסיף מורכבות: צריך לטפל ב-message ordering, duplicates, ו-dead letter queues.

??? tip "מה זה API Versioning ולמה זה חשוב?"
    כשמשנים API (הוספת/שינוי/הסרת שדות), Clients קיימים יכולים להישבר. API Versioning מאפשר להריץ **גרסאות מקבילות** כדי שלקוחות ישנים ימשיכו לעבוד. הגישה הנפוצה ביותר היא **URL versioning** (`/api/v1/users`, `/api/v2/users`). אפשרויות נוספות: Header versioning (`Accept: application/vnd.myapi.v2+json`) ו-Query parameter (`?version=2`). הכלל: **אף פעם אל תשברו לקוחות קיימים**.

??? tip "מה ההבדל בין Authentication ל-Authorization? תנו דוגמה."
    **Authentication** (אימות) = "מי אתה?" -- תהליך הזיהוי. למשל, Login עם שם משתמש וסיסמה, ואז קבלת JWT Token. **Authorization** (הרשאה) = "מה מותר לך?" -- בדיקת הרשאות אחרי שהזיהוי הצליח. למשל, משתמש רגיל יכול לקרוא פוסטים (`GET /posts`) אבל רק Admin יכול למחוק (`DELETE /posts/1`). **דוגמה**: JWT Token מכיל `role: "editor"`. Authentication = לוודא שה-Token תקין. Authorization = לבדוק שה-role מרשה את הפעולה.

??? tip "מה זה Saga Pattern ולמה צריך אותו?"
    ב-Microservices, **אין טרנזקציות מבוזרות** (אין `BEGIN TRANSACTION` שעובד על כמה databases). ה-**Saga Pattern** מפרק טרנזקציה ארוכה לרצף של **Local Transactions** בכל Service, עם **Compensating Transactions** (פעולות ביטול) במקרה של כישלון. למשל: הזמנה → תשלום → מלאי. אם המלאי נכשל, ה-Saga מפעיל: החזר תשלום → בטל הזמנה. יש שתי גישות: **Choreography** (כל Service מאזין ל-events) ו-**Orchestration** (Service מרכזי מנהל את הזרימה).

??? tip "הסבירו Over-fetching ו-Under-fetching ב-REST. איך GraphQL פותר את זה?"
    **Over-fetching**: מקבלים יותר מידע ממה שצריך. למשל, `GET /users/42` מחזיר 20 שדות כשצריך רק את השם. **Under-fetching**: צריכים מידע נוסף ונדרשות בקשות נוספות. למשל, צריך User + Posts + Comments = 3 בקשות. **GraphQL פותר** בכך שה-Client מגדיר בדיוק אילו שדות הוא רוצה בבקשה אחת: `query { user(id: 42) { name, posts { title } } }`. אבל זה מביא **אתגרים חדשים**: N+1 queries, caching מורכב יותר, ו-authorization ברמת שדה.

??? tip "מה זה Connection Pooling ולמה זה קריטי?"
    פתיחת TCP Connection חדש (כולל Handshake, TLS, Authentication) לוקחת ~10-50ms. אם כל Database query פותח connection חדש, זה בזבוז ענק. **Connection Pool** מחזיק מאגר של connections פתוחים ו**ממחזר** אותם. כשקוד צריך connection, הוא "שואל" מה-Pool ו"מחזיר" כשסיים. זה משפר ביצועים דרמטית ומונע מצב של "too many connections" שגורם ל-Database לקרוס.

---

## קישורים לנושאים אחרים

- [7 שכבות OSI](osi-7-layers.md) -- Client-Server עובד מעל שכבות הרשת. חשוב להבין את התמונה המלאה.
- [TCP/IP & HTTP](tcp-ip-http.md) -- הפרוטוקולים שמאפשרים את התקשורת בין Client ל-Server.
- [מחשב מול שרת](../04-systems/computer-vs-server.md) -- מה ההבדל בין המחשב שלכם לבין שרת שרץ ב-Cloud?
