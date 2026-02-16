# Client-Server

## למה זה חשוב

כמעט כל אפליקציה מודרנית בנויה על מודל **Client-Server**. כשאתם גולשים באתר, שולחים הודעה ב-WhatsApp, או מזמינים אוכל באפליקציה -- יש צד שמבקש (Client) וצד שמספק (Server). הבנה של הדינמיקה הזו היא הבסיס לכל עבודה ב-Backend, Frontend, ו-DevOps.

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

### מחזור Request-Response

1. ה-Client שולח **Request** (בקשה) לשרת -- למשל `GET /api/users`.
2. השרת מקבל את הבקשה, מעבד אותה (שליפה מ-Database, חישוב לוגיקה, וכו').
3. השרת מחזיר **Response** (תשובה) עם Status Code ו-Body.
4. ה-Client מקבל את התשובה ומציג אותה למשתמש.

!!! note "כל אינטראקציה ברשת עובדת ככה"
    גם כשאתם פותחים דף אינטרנט פשוט, הדפדפן שולח עשרות בקשות -- עבור ה-HTML, CSS, JavaScript, תמונות, fonts, ועוד.

### Browser כ-Client, Backend כ-Server

- ה-**Browser** (דפדפן) הוא ה-Client הנפוץ ביותר. הוא שולח HTTP Requests ומציג את ה-Response למשתמש.
- ה-**Backend** (למשל שרת Node.js, Django, Spring) הוא ה-Server שמעבד לוגיקה עסקית.
- ה-Backend בדרך כלל מתקשר גם עם **Database**, ובמקרה הזה ה-Backend הופך ל-Client של ה-Database.

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

### Stateless vs Stateful

| | Stateless | Stateful |
|---|---|---|
| **משמעות** | השרת לא זוכר כלום בין בקשות | השרת שומר מידע על ה-Client |
| **דוגמה** | REST API -- כל בקשה עצמאית | WebSocket -- חיבור פתוח רציף |
| **יתרון** | קל ל-Scale, פשוט | חוויה עשירה יותר |
| **חיסרון** | צריך לשלוח הכל כל פעם | קשה ל-Scale |

??? tip "איך REST נשאר Stateless אבל עדיין 'מזהה' אתכם?"
    באמצעות **Tokens** (כמו JWT) שנשלחים בכל בקשה ב-Header. השרת לא "זוכר" אתכם -- הוא פשוט קורא את ה-Token ומבין מי אתם מחדש בכל בקשה.

## בלבולים נפוצים

- **"Server זה מחשב ספציפי"** -- לא בהכרח. Server זה **תפקיד**, לא חומרה. המחשב שלכם יכול להיות Server אם הוא מריץ תוכנה שמקשיבה לבקשות.
- **"Client זה תמיד דפדפן"** -- לא. Client יכול להיות אפליקציית מובייל, CLI, שרת אחר, או כל תוכנה שיוזמת בקשה.
- **"REST זה פרוטוקול"** -- REST הוא **סגנון ארכיטקטורה** (Architectural Style), לא פרוטוקול. הפרוטוקול שמתחת הוא HTTP.
- **"Stateless אומר שאין State בכלל"** -- יש State, אבל הוא לא נשמר **בשרת**. הוא נשמר ב-Client (Token) או ב-Database.

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

## קישורים לנושאים אחרים

- [7 שכבות OSI](osi-7-layers.md) -- Client-Server עובד מעל שכבות הרשת. חשוב להבין את התמונה המלאה.
- [TCP/IP & HTTP](tcp-ip-http.md) -- הפרוטוקולים שמאפשרים את התקשורת בין Client ל-Server.
- [מחשב מול שרת](../04-systems/computer-vs-server.md) -- מה ההבדל בין המחשב שלכם לבין שרת שרץ ב-Cloud?
