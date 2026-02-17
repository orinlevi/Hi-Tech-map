# למה ל-Backend צריך רשתות

## למה זה חשוב

הרבה מפתחים מתחילים חושבים שרשתות זה רק "דבר של IT". אבל בפועל, **כל שורת קוד ב-Backend שפונה ל-Database, API חיצוני, או שירות אחר -- עוברת דרך הרשת**. הבנה של רשתות היא לא אופציונלית ל-Backend Developer -- היא חלק מהעבודה היומיומית.

## רעיונות מרכזיים

### שירותי Backend מדברים אחד עם השני דרך הרשת

בסביבה מודרנית, Backend הוא לא תוכנה אחת -- אלא **אוסף של שירותים** שמתקשרים ביניהם:

```
┌──────────┐     HTTP      ┌──────────┐     TCP      ┌──────────┐
│  API     │ ────────────► │  Auth    │ ───────────► │ Database │
│  Server  │               │  Service │              │ (MySQL)  │
└────┬─────┘               └──────────┘              └──────────┘
     │
     │  HTTP/gRPC
     ▼
┌──────────┐     TCP       ┌──────────┐
│  Payment │ ────────────► │  Redis   │
│  Service │               │  Cache   │
└──────────┘               └──────────┘
```

!!! note "כל חץ בתרשים הזה הוא Network Call"
    כל תקשורת בין שירותים -- גם אם הם רצים על אותו מחשב -- עוברת דרך פרוטוקול רשת (TCP, HTTP, gRPC). לכן בעיות רשת = בעיות באפליקציה.

### Microservices -- כשכל שירות הוא עצמאי

ב-**Microservices Architecture**, האפליקציה מפוצלת לשירותים קטנים ועצמאיים:

- כל שירות רץ בתהליך (Process) נפרד
- כל שירות יכול להיכתב בשפה אחרת
- התקשורת ביניהם היא **תמיד דרך הרשת**

```
Monolith (הכל ביחד):
┌──────────────────────────────┐
│  Users + Orders + Payments   │
│  (הכל באותו תהליך)           │
└──────────────────────────────┘

Microservices (מופרד):
┌─────────┐   ┌──────────┐   ┌──────────┐
│  Users  │◄─►│  Orders  │◄─►│ Payments │
│ Service │   │  Service │   │  Service │
└─────────┘   └──────────┘   └──────────┘
     ▲              ▲              ▲
     └──────────────┼──────────────┘
                    │
            Network (HTTP/gRPC)
```

??? tip "פרוטוקולי תקשורת בין Microservices"
    - **REST over HTTP** -- הכי פשוט ונפוץ. JSON הלוך וחזור.
    - **gRPC** -- מהיר יותר, מבוסס Protocol Buffers (בינארי, לא טקסט).
    - **Message Queues** (RabbitMQ, Kafka) -- תקשורת א-סינכרונית. שירות אחד שולח הודעה, השני מעבד אותה מתי שמתאים לו.

### Database Connections הם Network Calls

כשאתם כותבים:
```python
# Python + SQLAlchemy
result = db.execute("SELECT * FROM users WHERE id = 1")
```

מאחורי הקלעים קורה:

1. **TCP Connection** נפתח לשרת ה-Database (Port 5432 ל-PostgreSQL)
2. ה-Query נשלח כ-**Network Packet**
3. התשובה חוזרת דרך הרשת
4. ה-ORM ממיר את התשובה לאובייקט

```
Backend App                           Database Server
(192.168.1.10)                       (192.168.1.20)
     │                                     │
     │── TCP Connect (port 5432) ────────►│
     │                                     │
     │── SQL Query ──────────────────────►│
     │   "SELECT * FROM users WHERE id=1" │
     │                                     │
     │◄── Result ─────────────────────────│
     │   {id: 1, name: "Dana"}            │
     │                                     │
```

!!! warning "Connection Pooling -- חובה!"
    פתיחת TCP connection חדש לכל Query היא **איטית מאוד** (Three-Way Handshake בכל פעם). לכן משתמשים ב-**Connection Pool** -- מאגר של חיבורים פתוחים שממחזרים אותם.

### Load Balancing -- חלוקת עומס

כשיש הרבה תעבורה, שרת אחד לא מספיק. **Load Balancer** מפזר את הבקשות בין מספר שרתים:

```
                    ┌──────────────┐
                    │ Load Balancer│
                    │  (Nginx)     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌─────────┐ ┌─────────┐ ┌─────────┐
         │ Server 1│ │ Server 2│ │ Server 3│
         │ (App)   │ │ (App)   │ │ (App)   │
         └─────────┘ └─────────┘ └─────────┘
```

אלגוריתמים נפוצים ל-Load Balancing:

- **Round Robin** -- כל שרת בתורו
- **Least Connections** -- שולח לשרת עם הכי פחות חיבורים פעילים
- **IP Hash** -- אותו Client תמיד מגיע לאותו שרת

### Proxies ו-Firewalls

- **Reverse Proxy** (כמו Nginx) -- יושב לפני השרתים שלכם, מקבל בקשות מבחוץ ומעביר אותן פנימה. גם מטפל ב-SSL, Caching, ו-Compression.
- **Forward Proxy** -- יושב לפני ה-Clients, משמש ב-Corporate networks לניטור ושליטה.
- **Firewall** -- מסנן תעבורת רשת לפי כללים (למשל: "חסום הכל חוץ מ-Port 80 ו-443").

```
Internet                        Your Infrastructure
─────────                       ────────────────────

Clients ──► [Firewall] ──► [Reverse Proxy/Nginx] ──► [App Servers]
                                                  ──► [Database]
                                                       (לא חשוף לאינטרנט!)
```

### API Gateway Pattern

ב-Microservices, **API Gateway** הוא נקודת כניסה אחת לכל ה-Clients:

```
┌────────┐
│ Mobile │──┐
└────────┘  │     ┌─────────────┐     ┌──────────┐
            ├────►│ API Gateway │────►│ Users    │
┌────────┐  │     │             │────►│ Orders   │
│ Web    │──┤     │ - Routing   │────►│ Payments │
└────────┘  │     │ - Auth      │     └──────────┘
            │     │ - Rate Limit│
┌────────┐  │     │ - Logging   │
│ 3rd    │──┘     └─────────────┘
│ Party  │
└────────┘
```

ה-API Gateway אחראי על:

- **Routing** -- מפנה כל בקשה לשירות הנכון
- **Authentication** -- מוודא שה-Client מזוהה
- **Rate Limiting** -- מגביל כמות בקשות (מונע abuse)
- **Logging & Monitoring** -- רושם את כל הבקשות

??? tip "כלים נפוצים ל-API Gateway"
    - **Kong** -- API Gateway מבוסס Nginx, קוד פתוח
    - **AWS API Gateway** -- שירות Managed של Amazon
    - **Nginx** -- יכול לשמש גם כ-API Gateway פשוט
    - **Traefik** -- נפוץ מאוד בסביבות Docker ו-Kubernetes

## בלבולים נפוצים

- **"Database Connection הוא מיידי"** -- לא. כל Connection כולל TCP Handshake, Authentication, ולפעמים TLS. זה יכול לקחת עשרות מילישניות. לכן **Connection Pooling** קריטי.
- **"Microservices תמיד עדיפים על Monolith"** -- לא נכון. Microservices מוסיפים **מורכבות רשתית** אדירה. לפרויקט קטן, Monolith עדיף.
- **"Load Balancer פותר את כל בעיות ה-Scale"** -- Load Balancer מחלק עומס, אבל אם ה-Database הוא ה-Bottleneck, הוספת שרתי App לא תעזור.
- **"Firewall = אבטחה מלאה"** -- Firewall מסנן תעבורת רשת, אבל לא מגן מפני פרצות ברמת האפליקציה (SQL Injection, XSS).

!!! warning "Network Latency -- האויב השקט"
    בקריאה רגילה ל-Database מקומי: ~1ms. בקריאה ל-Database ב-Cloud באזור אחר: ~50-200ms. ב-Microservices, כל Service-to-Service call מוסיף Latency. תמיד חשבו על **כמה Network Hops** יש בבקשה אחת.

## דוגמה קטנה

נניח שיש לכם חנות אונליין. מה קורה כשמשתמש לוחץ "קנה עכשיו"?

```
1. Client (Browser) ──HTTP POST──► API Gateway (:443)
   "רוצה לקנות מוצר #42"

2. API Gateway בודק JWT Token
   ──HTTP GET──► Auth Service (:8081)
   "ה-Token הזה תקין?"

3. Auth Service ──TCP──► Redis (:6379)
   בודק ב-Cache אם ה-Token valid

4. API Gateway מעביר לשירות הזמנות
   ──HTTP POST──► Orders Service (:8082)
   "צור הזמנה חדשה"

5. Orders Service ──TCP──► PostgreSQL (:5432)
   INSERT INTO orders ...

6. Orders Service ──HTTP POST──► Payment Service (:8083)
   "גבה תשלום"

7. Payment Service ──HTTPS──► External Payment API
   (Stripe, PayPal, etc.)

8. תשובה חוזרת בכל השרשרת עד ל-Client
   "ההזמנה בוצעה בהצלחה!"

סה"כ Network Hops: 7 (!)
```

??? tip "כלים לניטור תקשורת בין שירותים"
    - **Wireshark** -- לניתוח תעבורת רשת ברמה נמוכה
    - **Jaeger / Zipkin** -- Distributed Tracing -- עוקב אחרי בקשה שעוברת בין שירותים
    - **Prometheus + Grafana** -- מדידה וויזואליזציה של Latency, Throughput, Error Rate

## קישורים לנושאים אחרים

- [Client-Server](client-server.md) -- הבסיס. כל מה שדיברנו עליו פה מבוסס על מודל Client-Server, כשלפעמים ה-Backend עצמו הוא Client של שירות אחר.
- [DNS & Ports](dns-ports.md) -- בסביבת Microservices, שירותים מוצאים אחד את השני דרך DNS, והתקשורת עוברת דרך Ports ספציפיים.
- [Kubernetes](../04-systems/kubernetes.md) -- Kubernetes מנהל את ה-Networking בין Containers, כולל Service Discovery, Load Balancing, ו-Network Policies.
- [Sandbox ואבטחה](../05-security/sandbox.md) -- Network Isolation הוא חלק קריטי מאבטחת Microservices. כל שירות צריך לגשת רק למה שהוא צריך.

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - רשתות מחשבים — TCP/IP, HTTP, DNS, sockets
    - מערכות הפעלה — processes, I/O, networking stack
    - תכנות מתקדם — client-server, async I/O

    **קורסים מומלצים:**
    - מערכות מבוזרות — microservices, message queues
    - ארכיטקטורת תוכנה — design patterns, system design
    - DevOps — deployment, monitoring, load balancing

    **ידע מעשי:**
    - Node.js / Python Flask / Go — backend frameworks
    - Docker — containerization
    - nginx — reverse proxy, load balancing
    - Wireshark / curl — network debugging

    **מתוכנית הלימודים שלך ב-TAU:**
    - רשתות תקשורת מחשבים (0368-3030)
    - Software Project (0368-2161)

---

## 🛤️ מאיפה מתחילים

1. **Build a REST API** — Express.js / Flask / FastAPI
2. **"Designing Data-Intensive Applications"** — Martin Kleppmann
3. **Docker Getting Started** — containerize your API
4. **Postman** — test your endpoints
5. **Deploy to cloud** — AWS / GCP / Vercel

---

## 💼 שאלות לראיון עבודה

??? tip "למה Backend Developer צריך להבין רשתות?"
    כי כל request עובר דרך הרשת. צריך להבין: latency ואיך למזער, connection pooling, timeouts, retries, load balancing, DNS resolution, TLS handshake. בלי הבנה — debug של "האתר איטי" הופך לבלתי אפשרי.

??? tip "מה Reverse Proxy ולמה צריך?"
    **Reverse Proxy** (nginx, HAProxy) — יושב לפני הservers ומנתב requests. שימושים: (1) Load balancing, (2) SSL termination, (3) Caching, (4) Rate limiting, (5) Security (מסתיר internal servers). Forward Proxy = client-side (VPN). Reverse Proxy = server-side.

??? tip "מה Connection Pooling?"
    במקום לפתוח TCP connection חדש לכל request (יקר — handshake), שומרים pool של connections פתוחים ומשתמשים מחדש. חשוב ל-DB connections, HTTP clients, Redis. Pool size = trade-off בין throughput לresource usage.

??? tip "מה WebSocket ומתי משתמשים?"
    **WebSocket** — full-duplex communication על TCP connection אחד. Server יכול לשלוח data ללקוח בלי request. שימושים: chat, real-time notifications, live updates, gaming. Alternative: SSE (Server-Sent Events) — unidirectional, simpler.

??? tip "מה Load Balancing?"
    חלוקת traffic בין מספר servers. אלגוריתמים: **Round Robin** (פשוט), **Least Connections** (שולח לserver הכי פנוי), **IP Hash** (sticky sessions), **Weighted** (servers חזקים מקבלים יותר). L4 (TCP) vs L7 (HTTP) load balancing.
