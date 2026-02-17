# TCP/IP & HTTP

## למה זה חשוב

**TCP/IP** הוא ה"שלד" של האינטרנט -- הפרוטוקולים שמאפשרים לכל מחשב בעולם לתקשר עם כל מחשב אחר. **HTTP** הוא הפרוטוקול שבנוי מעל TCP ומאפשר לדפדפנים ושרתים לדבר. אם אתם עובדים ב-Backend, אתם חייבים להכיר את השלושה האלה מקרוב.

## רעיונות מרכזיים

### TCP vs UDP

שני פרוטוקולים ב-Transport Layer שמשרתים מטרות שונות:

| | TCP | UDP |
|---|---|---|
| **שם מלא** | Transmission Control Protocol | User Datagram Protocol |
| **אמינות** | מבטיח שכל החבילות מגיעות ובסדר הנכון | לא מבטיח כלום -- שלח ותקווה |
| **מהירות** | איטי יותר (בגלל ה-overhead) | מהיר יותר |
| **חיבור** | Connection-oriented (Three-Way Handshake) | Connectionless |
| **שימושים** | HTTP, Email, File Transfer | Video Streaming, Gaming, DNS |

```
TCP Three-Way Handshake:
────────────────────────

Client                    Server
  │                         │
  │──── SYN ──────────────►│   "אני רוצה להתחבר"
  │                         │
  │◄──── SYN-ACK ──────────│   "בסדר, גם אני מוכן"
  │                         │
  │──── ACK ──────────────►│   "מעולה, בוא נתחיל"
  │                         │
  │◄════ Data Transfer ════►│
```

!!! note "מתי לבחור מה?"
    - צריכים ש**כל** המידע יגיע? **TCP** (אתרים, קבצים, מיילים)
    - צריכים **מהירות** ולא אכפת אם נפל Packet? **UDP** (שיחות וידאו, משחקים)

### IP Addresses

**IP** (Internet Protocol) אחראי על **כתובות** -- איך למצוא את המחשב שאליו רוצים לשלוח.

- **IPv4:** `192.168.1.1` -- 4 מספרים (0-255), מופרדים בנקודות. סה"כ ~4.3 מיליארד כתובות.
- **IPv6:** `2001:0db8:85a3:0000:0000:8a2e:0370:7334` -- 128 ביטים, כמעט אינסוף כתובות.

```
כתובות מיוחדות שחשוב להכיר:

127.0.0.1      →  localhost (המחשב שלכם)
192.168.x.x    →  רשת פרטית (LAN)
10.x.x.x       →  רשת פרטית (נפוץ בארגונים)
0.0.0.0        →  "כל הכתובות" (מאזין על הכל)
```

??? tip "למה IPv6 עדיין לא בכל מקום?"
    למרות שכתובות IPv4 נגמרו כבר מזמן, טכנולוגיית **NAT** מאפשרת לרשתות פרטיות לחלוק כתובת IPv4 אחת לגישה לאינטרנט. זה האט מאוד את המעבר ל-IPv6.

### HTTP Methods

**HTTP** (HyperText Transfer Protocol) מגדיר **שיטות** (Methods) שמתארות מה ה-Client רוצה לעשות:

| Method | מטרה | דוגמה |
|--------|------|-------|
| `GET` | לקרוא מידע | `GET /api/users` -- תן לי את רשימת המשתמשים |
| `POST` | ליצור משהו חדש | `POST /api/users` -- צור משתמש חדש |
| `PUT` | לעדכן (החלפה מלאה) | `PUT /api/users/5` -- עדכן את משתמש 5 |
| `PATCH` | לעדכן (חלקי) | `PATCH /api/users/5` -- עדכן שדה ספציפי |
| `DELETE` | למחוק | `DELETE /api/users/5` -- מחק את משתמש 5 |

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Dana",
  "email": "dana@example.com"
}
```

### HTTP Status Codes

קודי תשובה שהשרת מחזיר -- הם מחולקים למשפחות:

```
1xx  →  Informational (נדיר לראות)
2xx  →  Success       ✓ הכל עבד
3xx  →  Redirection   ↪ לך למקום אחר
4xx  →  Client Error  ✗ אתה טעית
5xx  →  Server Error  ✗ אני (השרת) טעיתי
```

הקודים שחייבים לדעת:

| קוד | שם | משמעות |
|-----|----|--------|
| **200** | OK | הכל עבד כמו שצריך |
| **201** | Created | המשאב נוצר בהצלחה |
| **301** | Moved Permanently | הדף עבר לכתובת חדשה (לצמיתות) |
| **400** | Bad Request | הבקשה שלך לא תקינה |
| **401** | Unauthorized | אתה לא מזוהה (תתחבר קודם) |
| **403** | Forbidden | אתה מזוהה אבל אין לך הרשאה |
| **404** | Not Found | המשאב לא נמצא |
| **500** | Internal Server Error | משהו נשבר בשרת |

!!! warning "401 vs 403 -- הבדל קריטי"
    - **401 Unauthorized** -- בעצם אומר "לא מאומת" (Unauthenticated). השרת לא יודע מי אתה.
    - **403 Forbidden** -- השרת יודע מי אתה, אבל אין לך **הרשאה** לגשת למשאב הזה.

### HTTPS ו-TLS

- **HTTP** שולח הכל כ-Plain Text -- כל אחד ברשת יכול לקרוא את התעבורה.
- **HTTPS** = HTTP + **TLS** (Transport Layer Security). כל התקשורת מוצפנת.
- **TLS** מבצע Handshake שבו Client ו-Server מסכימים על מפתח הצפנה משותף.

```
HTTPS Handshake (פשוט):
───────────────────────

Client                         Server
  │                              │
  │── ClientHello ─────────────►│  "אני תומך בהצפנות האלה"
  │                              │
  │◄── ServerHello + Cert ──────│  "בוא נשתמש ב-AES, הנה ה-Certificate שלי"
  │                              │
  │   (Client מאמת את ה-Cert)   │
  │                              │
  │── Key Exchange ────────────►│  "הנה המפתח המשותף שלנו"
  │                              │
  │◄════ Encrypted Data ═══════►│  כל התקשורת מוצפנת
```

## בלבולים נפוצים

- **"TCP ו-HTTP זה אותו דבר"** -- לא. TCP הוא פרוטוקול **תעבורה** (Layer 4), HTTP הוא פרוטוקול **אפליקציה** (Layer 7). HTTP רץ **מעל** TCP.
- **"GET לא יכול לשנות נתונים בשרת"** -- טכנית הוא יכול, אבל זה **נגד הכללים**. GET אמור להיות Idempotent ו-Safe.
- **"HTTPS מגן מפני הכל"** -- HTTPS מצפין את התקשורת **בדרך**, אבל לא מגן מפני פרצות בשרת עצמו, SQL Injection, XSS, וכו'.
- **"Status Code 200 אומר שהכל בסדר"** -- לפעמים שרתים מחזירים 200 עם Body שמכיל `{"error": "something went wrong"}`. זה Bad Practice אבל קורה הרבה.

## דוגמה קטנה

בואו נעקוב אחרי בקשת HTTP מלאה עם `curl`:

```bash
# שליחת GET Request
curl -v https://httpbin.org/get

# מה שנשלח:
> GET /get HTTP/2
> Host: httpbin.org
> User-Agent: curl/8.1.2
> Accept: */*

# מה שחזר:
< HTTP/2 200
< Content-Type: application/json
<
{
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.1.2"
  },
  "origin": "203.0.113.42",
  "url": "https://httpbin.org/get"
}
```

```bash
# שליחת POST Request עם JSON body
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "Dana", "age": 25}'
```

??? tip "כלי שימושי: httpbin.org"
    האתר `httpbin.org` הוא שרת שמחזיר לכם בחזרה את מה ששלחתם. מעולה לתרגול ולהבנה של HTTP בלי צורך לבנות שרת משלכם.

## קישורים לנושאים אחרים

- [7 שכבות OSI](osi-7-layers.md) -- TCP חי ב-Layer 4, IP ב-Layer 3, ו-HTTP ב-Layer 7. ראו את התמונה המלאה.
- [DNS & Ports](dns-ports.md) -- לפני שה-TCP connection נפתח, צריך DNS resolution ו-Port.
- [Credentials ואבטחת הרשאות](../05-security/credentials.md) -- HTTPS ו-TLS הם רק חלק אחד מאבטחה. מה עם סיסמאות, Tokens, ו-API Keys?

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - רשתות מחשבים — TCP/IP stack, HTTP, sockets
    - מערכות הפעלה — I/O, buffers, network syscalls
    - מבוא לאינטרנט — client-server, request-response

    **קורסים מומלצים:**
    - אבטחת רשתות — TLS, HTTPS, certificate chains
    - מערכות מבוזרות — RPC, load balancing, reverse proxy
    - Web Development — REST, GraphQL, WebSocket

    **ידע מעשי:**
    - curl, httpie — HTTP clients
    - Wireshark, tcpdump — packet analysis
    - Postman / Insomnia — API testing
    - nginx / Apache — web server configuration

    **מתוכנית הלימודים שלך ב-TAU:**
    - רשתות תקשורת מחשבים (0368-3030)

---

## 🛤️ מאיפה מתחילים

1. **curl** — שלחו HTTP requests מהטרמינל
2. **"HTTP: The Definitive Guide"** — O'Reilly (ספר מקיף)
3. **MDN Web Docs — HTTP** — reference מצוין
4. **Wireshark** — תראו TCP handshake ו-HTTP בפועל
5. **בנו web server פשוט** — Python/Node.js

---

## 💼 שאלות לראיון עבודה

??? tip "מה TCP 3-Way Handshake?"
    **SYN** → Client שולח SYN עם sequence number. **SYN-ACK** → Server מאשר ושולח SYN משלו. **ACK** → Client מאשר. עכשיו החיבור פתוח. סגירה: FIN → ACK → FIN → ACK (4-way).

??? tip "מה ההבדל בין HTTP/1.1, HTTP/2 ו-HTTP/3?"
    **HTTP/1.1** — text-based, one request per connection (or pipelining). **HTTP/2** — binary, multiplexing (multiple streams on one connection), header compression (HPACK), server push. **HTTP/3** — QUIC (UDP-based), built-in encryption, faster handshake, better mobile performance.

??? tip "מה ההבדל בין GET ל-POST?"
    **GET** — קריאת נתונים, idempotent, parameters ב-URL (query string), cacheable, limited length. **POST** — שליחת נתונים, not idempotent, parameters ב-body, not cacheable, no length limit. PUT = update (idempotent), DELETE = מחיקה, PATCH = partial update.

??? tip "מה HTTPS ואיך TLS עובד?"
    **HTTPS** = HTTP + TLS encryption. TLS handshake: (1) Client Hello (supported ciphers), (2) Server Hello + Certificate, (3) Client verifies cert, (4) Key exchange (Diffie-Hellman), (5) Symmetric encryption begins. מגן מפני MITM, eavesdropping, tampering.

??? tip "מה TCP Congestion Control?"
    TCP מנהל את קצב השליחה כדי לא להציף את הרשת. **Slow Start** — מתחיל עם window קטן, מכפיל כל RTT. **Congestion Avoidance** — גדל ליניארית. **Fast Retransmit/Recovery** — מזהה אובדן ומגיב מהר. אלגוריתמים: Reno, Cubic (default Linux), BBR (Google).

??? tip "מה Status Codes חשובים?"
    **2xx** — הצלחה: 200 OK, 201 Created, 204 No Content. **3xx** — redirect: 301 Permanent, 302 Temporary, 304 Not Modified. **4xx** — client error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Rate Limit. **5xx** — server error: 500 Internal, 502 Bad Gateway, 503 Unavailable.
