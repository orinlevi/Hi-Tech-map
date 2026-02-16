# Credentials

## למה זה חשוב

כל מערכת שמשרתת משתמשים צריכה לדעת **מי אתה** (Authentication) ו**מה מותר לך** (Authorization). בלי ניהול נכון של Credentials, כל דלת במערכת פתוחה לרווחה — וזה בדיוק מה שתוקפים מחפשים.

דליפות סיסמאות הן מהווקטורים הנפוצים ביותר לפריצות. הבנה של איך שומרים, מעבירים ומאמתים Credentials היא ידע בסיסי לכל מפתח.

## רעיונות מרכזיים

### מה הם Credentials?

Credentials הם כל פיסת מידע שמוכיחה זהות או מעניקה גישה:

- **Username + Password** — השילוב הקלאסי והנפוץ ביותר
- **API Keys** — מפתחות שמזהים אפליקציה (לא משתמש אנושי)
- **Tokens** — מחרוזות זמניות שמייצגות הרשאה (למשל JWT)
- **Certificates** — תעודות דיגיטליות שמבוססות על Public Key Infrastructure

### Authentication vs Authorization

| מושג | שאלה | דוגמה |
|------|-------|-------|
| **Authentication** (AuthN) | מי אתה? | התחברות עם שם משתמש וסיסמה |
| **Authorization** (AuthZ) | מה מותר לך? | האם יש לך הרשאה לצפות בדף הזה? |

!!! note "הסדר תמיד קבוע"
    קודם Authentication, אחר כך Authorization. אי אפשר לדעת מה מותר לך בלי לדעת קודם מי אתה.

### Hashing סיסמאות

!!! warning "לעולם אל תשמרו סיסמאות כ-Plaintext"
    אם מסד הנתונים נפרץ ויש בו סיסמאות בטקסט פתוח — כל המשתמשים חשופים. תמיד השתמשו ב-Hashing.

**Hashing** הוא תהליך חד-כיווני: ממירים סיסמה למחרוזת קבועה שאי אפשר (בפועל) להפוך בחזרה.

```text
סיסמה → Hash Function → Hash Value (נשמר ב-DB)

"myP@ssw0rd" → bcrypt → "$2b$12$LJ3m4ys..."
```

- **bcrypt** — האלגוריתם המומלץ. איטי בכוונה, כדי להקשות על Brute Force
- **Salt** — ערך אקראי שמתווסף לפני ה-Hashing, כך ששתי סיסמאות זהות יניבו Hash שונה

```python
import bcrypt

# יצירת Hash עם Salt
password = b"myP@ssw0rd"
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password, salt)

# בדיקת סיסמה
if bcrypt.checkpw(password, hashed):
    print("Authentication successful!")
```

### API Keys, OAuth ו-JWT

??? tip "מתי משתמשים בכל אחד?"
    - **API Key** — לזיהוי אפליקציה. פשוט אבל לא הכי מאובטח. משמש בעיקר ל-Server-to-Server.
    - **OAuth 2.0** — פרוטוקול שמאפשר למשתמש לתת לאפליקציה גישה **מוגבלת** בלי לחשוף סיסמה. למשל: "Login with Google".
    - **JWT (JSON Web Token)** — Token שמכיל מידע (Claims) על המשתמש, חתום דיגיטלית. נפוץ ב-REST APIs.

מבנה JWT:

```text
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Header  │ . │ Payload  │ . │Signature │
│(אלגוריתם)│   │ (Claims) │   │ (חתימה)  │
└──────────┘   └──────────┘   └──────────┘

eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.abc123signature
```

!!! warning "JWT לא מוצפן — הוא חתום"
    כל אחד יכול לקרוא את ה-Payload של JWT (זה רק Base64). החתימה מבטיחה שהמידע **לא שונה**, אבל לא שהוא **סודי**. לעולם אל תשימו מידע רגיש ב-Payload.

## בלבולים נפוצים

- **"Hashing = Encryption"** — לא. Encryption הוא דו-כיווני (אפשר לפענח), Hashing הוא חד-כיווני. סיסמאות עוברות Hashing, לא Encryption.
- **"API Key מספיק לאבטחה"** — API Key לבדו לא מזהה משתמש ולא מוגבל בזמן. כדאי לשלב אותו עם OAuth או JWT.
- **"Authentication ו-Authorization זה אותו דבר"** — ממש לא. אתה יכול להיות מאומת (authenticated) אבל עדיין לא מורשה (authorized) לגשת למשאב מסוים.
- **"MD5 ו-SHA-1 טובים לסיסמאות"** — הם מהירים מדי, מה שמקל על Brute Force. תמיד השתמשו באלגוריתם שתוכנן לסיסמאות כמו bcrypt או Argon2.

## דוגמה קטנה

תרחיש: משתמש מתחבר לאפליקציה ומבקש לראות את הפרופיל שלו.

```text
1. Client → Server:  POST /login  { "user": "dana", "pass": "abc123" }
   ┌─ Authentication ──────────────────────────────────────┐
   │ Server: hash("abc123") == stored_hash?  → ✅ מאומת   │
   └───────────────────────────────────────────────────────┘

2. Server → Client:  { "token": "eyJhbG..." }  (JWT)

3. Client → Server:  GET /profile  Authorization: Bearer eyJhbG...
   ┌─ Authorization ───────────────────────────────────────┐
   │ Server: האם ל-dana יש הרשאה ל-/profile? → ✅ מורשה   │
   └───────────────────────────────────────────────────────┘

4. Server → Client:  { "name": "Dana", "role": "admin" }
```

??? tip "מה קורה אם ה-Token פג תוקף?"
    ה-Server מחזיר `401 Unauthorized`, והלקוח צריך לבצע Login מחדש או להשתמש ב-Refresh Token כדי לקבל Token חדש.

## קישורים לנושאים אחרים

- [Sandbox](sandbox.md) — איך מבודדים תהליכים כדי שגם אם Credentials נגנבו, הנזק מוגבל
- [TCP/IP ו-HTTP](../03-networks/tcp-ip-http.md) — הפרוטוקולים שמעבירים את ה-Credentials ברשת (ולמה HTTPS חיוני)
- [Production](../00-big-picture/production.md) — ניהול Credentials בסביבת Production (Secrets Management, Environment Variables)
