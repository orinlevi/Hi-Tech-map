# DNS & Ports

## למה זה חשוב

כשאתם מקלידים `google.com` בדפדפן, מאחורי הקלעים קורה תהליך שלם של **תרגום שם לכתובת IP** -- זה DNS. וכשהבקשה מגיעה לשרת, היא צריכה לדעת **לאיזו אפליקציה** בשרת לפנות -- בשביל זה יש **Ports**. בלי DNS ו-Ports, האינטרנט כפי שאנחנו מכירים אותו לא היה עובד.

## רעיונות מרכזיים

### מה זה DNS?

**DNS** (Domain Name System) הוא ה"ספר טלפונים" של האינטרנט.

- בני אדם זוכרים שמות: `google.com`
- מחשבים עובדים עם מספרים: `142.250.80.46`
- **DNS מתרגם** שמות לכתובות IP

```
אתם מקלידים:     google.com
DNS מחזיר:        142.250.80.46
הדפדפן פונה ל:   142.250.80.46
```

!!! note "בלי DNS, היינו צריכים לזכור כתובות IP"
    תדמיינו שבמקום לגלוש ל-`youtube.com` הייתם צריכים לזכור `142.250.185.206`. זה לא ריאלי כשיש מיליארדי אתרים.

### איך DNS Resolution עובד -- צעד אחרי צעד

```
אתם מקלידים: www.example.com

┌─────────────┐
│  Your PC    │  1. בודק Cache מקומי (אולי כבר תורגם?)
│  (Browser)  │     → לא נמצא
└──────┬──────┘
       │
       ▼  2. שואל את ה-DNS Resolver (בד"כ של ספק האינטרנט)
┌─────────────┐
│  Recursive  │  3. ה-Resolver שואל את Root Server:
│  Resolver   │     "מי אחראי על .com?"
└──────┬──────┘
       │
       ▼  4. Root Server מפנה ל-TLD Server
┌─────────────┐
│ .com TLD    │  5. TLD Server אומר:
│  Server     │     "example.com מנוהל ע"י NS server הזה"
└──────┬──────┘
       │
       ▼  6. שואל את ה-Authoritative Name Server
┌─────────────┐
│Authoritative│  7. מחזיר את ה-IP:
│ Name Server │     "www.example.com = 93.184.216.34"
└─────────────┘

       ▼  8. התשובה חוזרת אליכם, נשמרת ב-Cache
```

??? tip "בדקו בעצמכם"
    ```bash
    # ראו את כל שרשרת ה-DNS
    dig +trace example.com

    # תרגום פשוט של שם לכתובת
    nslookup example.com

    # ראו מה ה-DNS Cache שלכם מכיל (macOS)
    sudo dscacheutil -flushcache
    ```

### DNS Records -- סוגי רשומות

| סוג | מה הוא עושה | דוגמה |
|-----|-------------|-------|
| **A** | שם → IPv4 | `example.com → 93.184.216.34` |
| **AAAA** | שם → IPv6 | `example.com → 2606:2800:220:1:...` |
| **CNAME** | שם → שם אחר (Alias) | `www.example.com → example.com` |
| **MX** | לאן לשלוח מיילים | `example.com → mail.example.com` |
| **NS** | מי ה-Name Server | `example.com → ns1.example.com` |
| **TXT** | מידע טקסטואלי (אימות, SPF) | `"v=spf1 include:_spf.google.com"` |

### מה זה Ports?

**Port** הוא מספר (0-65535) שמזהה **תהליך ספציפי** במחשב. אם כתובת IP היא כמו כתובת בניין, אז Port זה כמו **מספר דירה**.

```
כתובת מלאה ברשת:

     IP Address    :  Port
  ┌──────────────┐   ┌────┐
  │ 93.184.216.34│ : │ 443│
  └──────────────┘   └────┘
      הבניין          הדירה
```

### Ports שחייבים לדעת

| Port | שירות | הסבר |
|------|-------|------|
| **80** | HTTP | תעבורת Web לא מוצפנת |
| **443** | HTTPS | תעבורת Web מוצפנת |
| **22** | SSH | גישה מרוחקת מאובטחת לשרת |
| **21** | FTP | העברת קבצים |
| **53** | DNS | תרגום שמות |
| **3306** | MySQL | Database |
| **5432** | PostgreSQL | Database |
| **6379** | Redis | Cache / Message Broker |
| **27017** | MongoDB | Database |
| **3000** | Dev Server | נפוץ ב-Node.js/React (לפיתוח) |
| **8080** | Alt HTTP | Port חלופי ל-HTTP (נפוץ בפיתוח) |

!!! warning "Ports מתחת ל-1024 דורשים הרשאות Root"
    ב-Linux, רק תהליכים עם הרשאות Root (או `CAP_NET_BIND_SERVICE`) יכולים להאזין על Ports 0-1023. לכן בפיתוח מקומי משתמשים הרבה ב-3000, 8080, 8888 וכו'.

### localhost ו-127.0.0.1

```
localhost = 127.0.0.1 = "המחשב שלי עצמו"
```

- כשאתם מריצים שרת מקומי, הוא מאזין על `localhost:3000`.
- `127.0.0.1` היא כתובת ה-**Loopback** -- תעבורה שנשלחת אליה לא יוצאת מהמחשב.
- `0.0.0.0` -- מאזין על **כל** ה-Interfaces (כולל רשת חיצונית). זהירות עם זה!

```bash
# שרת Node.js שמאזין על localhost
node -e "require('http').createServer((req,res) => {
  res.end('Hello!');
}).listen(3000, '127.0.0.1')"

# עכשיו אפשר לגשת מהדפדפן:
# http://localhost:3000
# http://127.0.0.1:3000
```

??? tip "127.0.0.1 vs localhost vs 0.0.0.0"
    - `127.0.0.1` -- רק המחשב שלכם יכול לגשת
    - `localhost` -- שם שמתורגם ל-127.0.0.1 (בדרך כלל)
    - `0.0.0.0` -- כל מכשיר ברשת יכול לגשת (שימושי ב-Docker, מסוכן בלי Firewall)

## בלבולים נפוצים

- **"DNS פונה ישירות ל-Root Server בכל פעם"** -- לא. יש **Cache** בכל שכבה (דפדפן, מערכת הפעלה, Resolver). רוב ה-DNS queries נענים מ-Cache.
- **"Port 80 הוא ה-Port היחיד של HTTP"** -- לא. HTTP יכול לרוץ על כל Port. פשוט **Port 80 הוא ברירת המחדל** ולכן הדפדפן לא מציג אותו ב-URL.
- **"localhost ו-0.0.0.0 זה אותו דבר"** -- ממש לא! `localhost` נגיש רק מהמחשב שלכם, `0.0.0.0` נגיש מכל הרשת.
- **"DNS הוא שרת אחד"** -- DNS הוא **מערכת מבוזרת** ענקית עם היררכיה של שרתים ברחבי העולם.

!!! warning "DNS Poisoning / Spoofing"
    אם תוקף מצליח לשנות את תשובת ה-DNS, הוא יכול להפנות אתכם לאתר מזויף. זו סיבה טובה להשתמש ב-**DNSSEC** ולוודא שאתם גולשים ב-HTTPS.

## דוגמה קטנה

מצב נפוץ בפיתוח -- הרצת מספר שירותים מקומיים על Ports שונים:

```
┌──────────────────────────────────────────────┐
│                  localhost                     │
│                                               │
│   :3000  →  React Frontend (npm start)       │
│   :8080  →  Node.js Backend (Express)        │
│   :5432  →  PostgreSQL Database              │
│   :6379  →  Redis Cache                      │
│                                               │
└──────────────────────────────────────────────┘

React (port 3000) שולח API calls ל-Backend (port 8080).
Backend מתחבר ל-PostgreSQL (port 5432) ול-Redis (port 6379).
```

```bash
# לבדוק אילו Ports תפוסים במחשב שלכם:
# macOS/Linux:
lsof -i -P -n | grep LISTEN

# דוגמת פלט:
# node      1234  user  23u  IPv4  TCP 127.0.0.1:3000 (LISTEN)
# postgres  5678  user  5u   IPv4  TCP 127.0.0.1:5432 (LISTEN)
```

## קישורים לנושאים אחרים

- [TCP/IP & HTTP](tcp-ip-http.md) -- DNS עובד מעל UDP (Port 53), וה-Ports הם חלק מ-Transport Layer (TCP/UDP).
- [למה ל-Backend צריך רשתות](why-backend-needs-networking.md) -- שירותי Backend מתקשרים דרך DNS ו-Ports, במיוחד בסביבות Microservices.
- [Docker](../04-systems/docker.md) -- ב-Docker, Port Mapping (`-p 8080:3000`) הוא מושג קריטי. DNS פנימי מאפשר ל-Containers למצוא אחד את השני.
