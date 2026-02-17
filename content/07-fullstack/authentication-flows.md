# 🔐 Authentication — OAuth, JWT, Sessions

> **Authentication — "מי אתה?" Authorization — "מה מותר לך?"**
> שני מושגים שמפתחים מבלבלים ביניהם עד היום הזה.

---

## Session-Based Authentication

```
Client          Server          DB
  │                │              │
  │── POST /login ─→│              │
  │                │── validate ──→│
  │                │←─ user data ──│
  │                │── create session (memory/Redis)
  │←─ Set-Cookie: sessionId ──│
  │                │              │
  │── GET /api (Cookie: sessionId) ──→│
  │                │── lookup session
  │←─────── data ──│
```

---

## JWT (JSON Web Token)

```
Header.Payload.Signature

Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "1", "name": "Orin", "iat": 1709000000, "exp": 1709086400 }
Signature: HMACSHA256(header + "." + payload, secret)
```

```javascript
// יצירת token
const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

// אימות
const decoded = jwt.verify(token, SECRET); // → { userId: 1, role: "admin" }
```

!!! warning "JWT Pitfalls"
    - **אל תשמרו** secrets ב-JWT payload (הוא רק Base64, לא מוצפן!)
    - **Refresh tokens** חובה — access token קצר (15 דקות), refresh ארוך (7 ימים)
    - **לא ניתן לבטל** JWT (stateless) — צריך blacklist או short expiry

---

## OAuth 2.0

OAuth = פרוטוקול שמאפשר לאפליקציה צד-שלישי גישה **מוגבלת** לחשבון המשתמש.

```
User → App: "התחבר עם Google"
App → Google: "הנה ה-client_id שלי, תחזירי לי authorization code"
Google → User: "האפליקציה הזו רוצה גישה. מאשר?"
User → Google: "כן"
Google → App: "הנה authorization_code"
App → Google: "הנה code + client_secret, תני לי access_token"
Google → App: "הנה access_token"
App → Google API: "GET /userinfo" + Bearer token
```

---

## Session מול JWT

| | Sessions | JWT |
|--|----------|-----|
| **State** | Server-side (stateful) | Client-side (stateless) |
| **Storage** | Redis/DB | Cookie/localStorage |
| **Scalability** | צריך shared store | Stateless — מושלם |
| **Revocation** | פשוט — מחק session | קשה — צריך blacklist |
| **Security** | CSRF vulnerable | XSS vulnerable |

---

## 🛤️ מאיפה מתחילים

1. **HTTP basics** — cookies, headers, HTTPS
2. **Sessions** — express-session + Redis
3. **JWT** — jsonwebtoken, refresh tokens
4. **OAuth 2.0** — Passport.js / NextAuth.js
5. **RBAC** — Role-Based Access Control

!!! tip "לימוד אקדמי"
    **קורסים**: אבטחת מידע, קריפטוגרפיה (HMAC, hashing), רשתות מחשבים (HTTP, TLS).

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Authentication ל-Authorization?"
    **Authentication** = "מי אתה?" (login, identity verification)
    **Authorization** = "מה מותר לך?" (permissions, roles, access control)

??? tip "מה ההבדל בין Sessions ל-JWT?"
    Sessions — stateful, server stores session data. JWT — stateless, token contains data.
    Sessions — easy to revoke. JWT — hard to revoke (need blacklist).

??? tip "למה צריך Refresh Tokens?"
    Access token קצר (15 min) → אם נגנב, הנזק מוגבל.
    Refresh token ארוך (7 days) → מאפשר לקבל access token חדש בלי login.
    Refresh token מאוחסן ב-httpOnly cookie (לא JS accessible).

??? tip "מה זה CSRF ואיך מגנים?"
    CSRF = אתר זדוני שולח request מהדפדפן שלך (עם הcookies שלך).
    הגנות: CSRF token, SameSite cookie attribute, double-submit cookie.
