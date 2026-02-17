# 🔟 OWASP Top 10 — הפגיעויות הנפוצות ביותר

> **OWASP Top 10 — הרשימה שכל מפתח צריך להכיר וכל תוקף כבר מכיר.**

!!! warning "אזהרה אתית"
    כל הטכניקות מוצגות למטרות לימוד והגנה בלבד. שימוש ללא הרשאה הוא עבירה פלילית.

---

## A01: Broken Access Control

המשתמש יכול לגשת למשאבים שאין לו הרשאה אליהם.

```
❌ GET /api/users/42/profile  → מחזיר פרופיל של user 42 גם אם אתה user 1
✅ if (req.user.id !== req.params.id && req.user.role !== "admin") return 403;
```

## A02: Cryptographic Failures

שימוש בהצפנה חלשה, אחסון סיסמאות ב-plaintext, HTTP במקום HTTPS.

```python
# ❌ MD5 — שבור
hashlib.md5(password).hexdigest()

# ✅ bcrypt עם salt
bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
```

## A03: Injection

הזרקת קוד זדוני לשאילתות — SQL, NoSQL, OS commands, LDAP.

```sql
-- ❌ SQL Injection
SELECT * FROM users WHERE name = '" + userInput + "';
-- קלט: ' OR '1'='1' --
-- תוצאה: SELECT * FROM users WHERE name = '' OR '1'='1' --';

-- ✅ Parameterized Query
SELECT * FROM users WHERE name = $1;
```

## A04: Insecure Design

ליקויים בתכנון — לא באגים בקוד, אלא בארכיטקטורה.

!!! note "דוגמה"
    אתר שמאפשר unlimited password attempts → brute force attack.
    הפתרון: rate limiting, account lockout, CAPTCHA — **בשלב העיצוב**.

## A05: Security Misconfiguration

הגדרות default שנשארו, debug mode ב-production, permissions רחבות מדי.

## A06: Vulnerable Components

שימוש בספריות עם CVEs ידועים. `npm audit` / `pip audit` / Dependabot.

## A07: Authentication Failures

סיסמאות חלשות, brute force, session fixation, credential stuffing.

## A08: Software and Data Integrity Failures

CI/CD pipelines לא מאובטחים, auto-update ללא verification.

## A09: Security Logging Failures

לא מלוגגים events חשובים — login failures, access denied, input validation failures.

## A10: SSRF (Server-Side Request Forgery)

השרת שולח requests לכתובות שהתוקף בוחר — גישה לרשת פנימית.

```python
# ❌ SSRF
url = request.args.get("url")
response = requests.get(url)  # התוקף שולח url=http://169.254.169.254/metadata

# ✅ הגנה
ALLOWED_HOSTS = ["api.example.com"]
if urlparse(url).hostname not in ALLOWED_HOSTS:
    return 403
```

---

## 🛤️ מאיפה מתחילים

1. **OWASP Top 10** — קראו את הרשימה המלאה באתר owasp.org
2. **OWASP Juice Shop** — אפליקציה vulnerable לתרגול
3. **PortSwigger Web Security Academy** — חינם, מצוין
4. **Burp Suite** — כלי בדיקת אבטחה

!!! tip "לימוד אקדמי"
    **קורסים**: אבטחת מידע, קריפטוגרפיה, רשתות מחשבים, מערכות הפעלה.
    **ידע מעשי**: CTFs, Bug Bounty programs, TryHackMe.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מבוא לאבטחת מידע (0368-3065)
    - אבטחת מוצרים ושירותים דיגיטליים (0368-3079)

---

## 💼 שאלות לראיון עבודה

??? tip "מנה 3 פגיעויות מ-OWASP Top 10 והסבר איך למנוע אותן."
    1. **Injection** — parameterized queries, ORMs, input validation.
    2. **Broken Access Control** — role-based access, server-side validation.
    3. **Cryptographic Failures** — HTTPS, bcrypt, AES-256, no MD5/SHA1.

??? tip "מה זה SQL Injection ואיך מונעים?"
    תוקף מזריק SQL code דרך input. מניעה: parameterized queries, ORMs, input sanitization.
    **לעולם** אל תשרשרו input ישירות לשאילתת SQL.

??? tip "מה ההבדל בין XSS ל-CSRF?"
    **XSS** = הזרקת JavaScript לדפדפן של הקורבן (stealing cookies, keylogging).
    **CSRF** = גרימה לדפדפן הקורבן לשלוח request לא רצוי (transfer money).

??? tip "מה זה SSRF ולמה זה מסוכן?"
    Server-Side Request Forgery — התוקף גורם לשרת לשלוח HTTP requests לכתובות פנימיות.
    מסוכן כי: גישה לmetadata services (AWS), סריקת רשת פנימית, עקיפת firewalls.
