# Credentials

## למה זה חשוב

כל מערכת שמשרתת משתמשים צריכה לדעת **מי אתה** (Authentication) ו**מה מותר לך** (Authorization). בלי ניהול נכון של Credentials, כל דלת במערכת פתוחה לרווחה — וזה בדיוק מה שתוקפים מחפשים.

דליפות סיסמאות הן מהווקטורים הנפוצים ביותר לפריצות. הבנה של איך שומרים, מעבירים ומאמתים Credentials היא ידע בסיסי לכל מפתח.

!!! quote "עובדה מטרידה"
    הסיסמה הכי נפוצה בעולם היא עדיין `123456`. האנושות, 2024.

## רעיונות מרכזיים

### מה הם Credentials?

Credentials הם כל פיסת מידע שמוכיחה זהות או מעניקה גישה:

- **Username + Password** — השילוב הקלאסי והנפוץ ביותר
- **API Keys** — מפתחות שמזהים אפליקציה (לא משתמש אנושי)
- **Tokens** — מחרוזות זמניות שמייצגות הרשאה (למשל JWT)
- **Certificates** — תעודות דיגיטליות שמבוססות על Public Key Infrastructure
- **SSH Keys** — זוג מפתחות (Public/Private) להתחברות מאובטחת לשרתים
- **MFA Codes** — קודים זמניים ממכשיר שני (TOTP, SMS, Push Notification)

### Authentication vs Authorization

| מושג | שאלה | דוגמה |
|------|-------|-------|
| **Authentication** (AuthN) | מי אתה? | התחברות עם שם משתמש וסיסמה |
| **Authorization** (AuthZ) | מה מותר לך? | האם יש לך הרשאה לצפות בדף הזה? |

!!! note "הסדר תמיד קבוע"
    קודם Authentication, אחר כך Authorization. אי אפשר לדעת מה מותר לך בלי לדעת קודם מי אתה.

### סוגי Authentication

**Single-Factor Authentication (SFA):**

- רק סיסמה — הרמה הבסיסית ביותר, הכי פגיעה

**Multi-Factor Authentication (MFA):**

שילוב של שניים או יותר מהגורמים הבאים:

```text
┌──────────────────────────────────────────────────────┐
│           שלושת הגורמים של Authentication            │
│                                                      │
│  🔑 Something you KNOW     → סיסמה, PIN             │
│  📱 Something you HAVE     → טלפון, YubiKey          │
│  👆 Something you ARE      → טביעת אצבע, Face ID     │
│                                                      │
│  שילוב של 2+ = MFA                                  │
│  שימוש ב-1 בלבד = רמת סיכון גבוהה                   │
└──────────────────────────────────────────────────────┘
```

!!! quote "מציאות עצובה"
    "למה צריך MFA?" — שאלו עובדי החברה. "כי הסיסמה שלכם היא `CompanyName2024!`" — ענה צוות ה-IT.

**Passwordless Authentication:**

- **WebAuthn / FIDO2** — אימות באמצעות מפתח חומרה או ביומטריה
- **Magic Links** — קישור חד-פעמי שנשלח לאימייל
- **Passkeys** — הסטנדרט החדש שמחליף סיסמאות לחלוטין

### Hashing סיסמאות

!!! warning "לעולם אל תשמרו סיסמאות כ-Plaintext"
    אם מסד הנתונים נפרץ ויש בו סיסמאות בטקסט פתוח — כל המשתמשים חשופים. תמיד השתמשו ב-Hashing.

**Hashing** הוא תהליך חד-כיווני: ממירים סיסמה למחרוזת קבועה שאי אפשר (בפועל) להפוך בחזרה.

```text
סיסמה → Hash Function → Hash Value (נשמר ב-DB)

"myP@ssw0rd" → bcrypt → "$2b$12$LJ3m4ys..."
```

- **bcrypt** — האלגוריתם המומלץ. איטי בכוונה, כדי להקשות על Brute Force
- **Argon2** — הדור הבא, זוכה תחרות Password Hashing Competition. תומך בהגדרת זיכרון, CPU ומקביליות
- **Salt** — ערך אקראי שמתווסף לפני ה-Hashing, כך ששתי סיסמאות זהות יניבו Hash שונה
- **Pepper** — ערך סודי קבוע שנשמר בנפרד מה-DB (בניגוד ל-Salt שנשמר ליד ה-Hash)

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

??? tip "למה bcrypt ולא SHA-256?"
    SHA-256 מהיר מאוד — שזה נהדר ל-Integrity Checks, אבל נורא לסיסמאות. כרטיס GPU יכול לחשב **מיליארדי** SHA-256 hashes בשנייה. bcrypt תוכנן להיות איטי (cost factor), כך שגם עם חומרה חזקה, Brute Force לוקח זמן בלתי סביר.

### Rainbow Tables ואיך מתגוננים

```text
Rainbow Table — טבלת Hash מוכנה מראש:
┌────────────────┬──────────────────────────┐
│ Password       │ Hash (MD5)               │
├────────────────┼──────────────────────────┤
│ 123456         │ e10adc3949ba59abbe56...  │
│ password       │ 5f4dcc3b5aa765d61d83...  │
│ qwerty         │ d8578edf8458ce06fbc5...  │
└────────────────┴──────────────────────────┘

עם Salt — כל Hash ייחודי, Rainbow Table חסרת תועלת:
┌────────────────┬──────────┬──────────────────┐
│ Password       │ Salt     │ Hash             │
├────────────────┼──────────┼──────────────────┤
│ 123456         │ x8k2m... │ $2b$12$x8k2m... │
│ 123456         │ p3j9f... │ $2b$12$p3j9f... │
│ (אותה סיסמה — Hash שונה!)                   │
└────────────────┴──────────┴──────────────────┘
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

### OAuth 2.0 — Flow מפורט

```text
┌────────┐     ┌────────────┐     ┌──────────────┐
│  User  │     │  Client    │     │ Auth Server  │
│(דפדפן) │     │ (האפליקציה)│     │ (Google)     │
└───┬────┘     └─────┬──────┘     └──────┬───────┘
    │  1. Login      │                    │
    │ ──────────────>│                    │
    │                │  2. Redirect       │
    │                │ ──────────────────>│
    │  3. User Login + Consent            │
    │ ──────────────────────────────────> │
    │                │  4. Auth Code      │
    │                │ <─────────────────│
    │                │  5. Exchange Code  │
    │                │    for Token       │
    │                │ ──────────────────>│
    │                │  6. Access Token   │
    │                │ <─────────────────│
    │  7. Logged in! │                    │
    │ <──────────────│                    │
```

### Secrets Management — ניהול סודות בייצור

!!! warning "לעולם אל תשמרו Secrets בקוד"
    אם Secrets (API Keys, DB Passwords, Tokens) נמצאים ב-Source Code, הם יגיעו ל-Git, ומשם לכל מי שיש לו גישה ל-Repo.

**כלים לניהול Secrets:**

| כלי | שימוש | הערות |
|-----|-------|-------|
| **HashiCorp Vault** | ניהול Secrets מרכזי | Dynamic Secrets, Rotation אוטומטי |
| **AWS Secrets Manager** | Secrets בענן AWS | אינטגרציה עם IAM |
| **Azure Key Vault** | Secrets בענן Azure | HSM-backed encryption |
| **Environment Variables** | הגדרה בסביבת ההרצה | פשוט אבל לא מספיק לסביבות גדולות |
| **dotenv** | קובץ .env מקומי | **רק לפיתוח** — לעולם לא ב-Production |

```text
❌ שגוי — Secrets בקוד:
──────────────────────────
db_password = "SuperSecret123!"
api_key = "sk-abc123def456..."

✅ נכון — Secrets מ-Environment:
──────────────────────────────────
db_password = os.environ["DB_PASSWORD"]
api_key = os.environ["API_KEY"]

✅ אפילו יותר טוב — Secrets מ-Vault:
────────────────────────────────────────
db_password = vault.read("secret/db")["password"]
```

!!! quote "כל מפתח בקריירה שלו"
    "יש שני סוגי מפתחים: אלה שכבר דחפו Secret ל-Git, ואלה שעוד לא יודעים שהם דחפו Secret ל-Git."

### Credential Stuffing ו-Brute Force

**Brute Force** — ניסיון כל הסיסמאות האפשריות:

```text
attempt 1: aaaa → ❌
attempt 2: aaab → ❌
attempt 3: aaac → ❌
...
attempt 456789: P@ss → ✅ (פרצנו!)
```

**Credential Stuffing** — שימוש בסיסמאות שדלפו מאתר אחד כדי לנסות באתרים אחרים:

```text
נדלף מ-LinkedIn:       ניסיון ב-Gmail:
user: dana@mail.com    user: dana@mail.com
pass: MyDog2020!  →    pass: MyDog2020!
                       תוצאה: ✅ (אותה סיסמה!)
```

**הגנות:**

- **Rate Limiting** — הגבלת מספר ניסיונות התחברות
- **Account Lockout** — נעילת חשבון אחרי X ניסיונות כושלים
- **CAPTCHA** — אחרי מספר ניסיונות כושלים
- **Credential Monitoring** — בדיקה אם Credentials של עובדים דלפו (Have I Been Pwned API)
- **Password Policy** — דרישת סיסמה חזקה + מניעת שימוש בסיסמאות שדלפו

### תרחישי תקיפה אמיתיים

??? danger "Case Study: דליפת Uber 2022"
    **מה קרה:** תוקף קנה Credentials של קבלן חיצוני מה-Dark Web. אחרי MFA Fatigue Attack (שליחת עשרות Notifications עד שהקורבן אישר), התוקף קיבל גישה ל-VPN של Uber.

    **מה הלך לא טוב:**

    - Credentials של קבלן חיצוני לא סוננו כראוי
    - MFA בוסס על Push Notification בלבד (פגיע ל-Fatigue)
    - ברגע שנכנס — Hardcoded Credentials לשירותים פנימיים ב-PowerShell Script

    **לקחים:**

    1. MFA Fatigue-resistant (Number Matching, FIDO2)
    2. אף פעם Hardcoded Credentials
    3. Principle of Least Privilege לקבלנים חיצוניים

??? danger "Case Study: SolarWinds 2020"
    **מה קרה:** תוקפים הזריקו Backdoor לתוכנת SolarWinds Orion. כל ארגון שעדכן את התוכנה — התקין את ה-Backdoor.

    **קשר ל-Credentials:** התוקפים השתמשו ב-SAML Token Forgery — זייפו Tokens שנראו לגיטימיים כדי לקבל גישה לשירותי ענן בלי צורך בסיסמה.

    **לקחים:**

    1. Supply Chain Security — בדיקת Integrity של עדכונים
    2. ניטור Token Usage חריג
    3. Zero Trust Architecture — לא לסמוך על שום Token/Credential בלי אימות

## בלבולים נפוצים

- **"Hashing = Encryption"** — לא. Encryption הוא דו-כיווני (אפשר לפענח), Hashing הוא חד-כיווני. סיסמאות עוברות Hashing, לא Encryption.
- **"API Key מספיק לאבטחה"** — API Key לבדו לא מזהה משתמש ולא מוגבל בזמן. כדאי לשלב אותו עם OAuth או JWT.
- **"Authentication ו-Authorization זה אותו דבר"** — ממש לא. אתה יכול להיות מאומת (authenticated) אבל עדיין לא מורשה (authorized) לגשת למשאב מסוים.
- **"MD5 ו-SHA-1 טובים לסיסמאות"** — הם מהירים מדי, מה שמקל על Brute Force. תמיד השתמשו באלגוריתם שתוכנן לסיסמאות כמו bcrypt או Argon2.
- **"JWT בלי Expiration זה בסדר"** — Token בלי תפוגה הוא כמו מפתח שאי אפשר להחליף. תמיד הגדירו `exp` Claim קצר, והשתמשו ב-Refresh Token.
- **"HTTPS = אני מאובטח"** — HTTPS מגן על המידע **בתעבורה** (In Transit), אבל לא מגן על Credentials שנשמרים בצורה לא נכונה ב-DB או בקוד.

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

### Refresh Token Flow

```text
┌──────────────────────────────────────────────────────┐
│  Access Token: חיים קצרים (15 דקות)                  │
│  → משמש לכל Request                                 │
│                                                      │
│  Refresh Token: חיים ארוכים (7 ימים)                  │
│  → משמש רק לקבלת Access Token חדש                    │
│                                                      │
│  Flow:                                               │
│  1. Access Token פג → Server מחזיר 401               │
│  2. Client שולח Refresh Token ל- /token/refresh      │
│  3. Server מחזיר Access Token חדש                     │
│  4. Client ממשיך לעבוד בלי Login מחדש                 │
└──────────────────────────────────────────────────────┘
```

## 🛤️ מאיפה מתחילים

```text
שלב 1: הבסיס
├── להבין את ההבדל בין Authentication ל-Authorization
├── ללמוד איך Hashing עובד (bcrypt, Argon2)
└── להבין למה Salt חשוב

שלב 2: Tokens ו-Protocols
├── ללמוד מבנה JWT ואיך לאמת חתימה
├── להבין OAuth 2.0 Flow
└── להכיר OpenID Connect (OIDC)

שלב 3: הגנות מתקדמות
├── MFA — סוגים, יישום, ו-Fatigue Attack
├── Secrets Management — Vault, Secrets Manager
└── Rate Limiting ו-Account Lockout

שלב 4: ברמת Production
├── Zero Trust Architecture
├── Credential Monitoring (Have I Been Pwned)
├── Token Rotation ו-Revocation
└── RBAC / ABAC — מודלי Authorization מתקדמים
```

**כלים מומלצים להתנסות:**

- [jwt.io](https://jwt.io) — Debugger של JWT, מעולה להבנת המבנה
- [Have I Been Pwned](https://haveibeenpwned.com) — בדיקה אם האימייל שלכם דלף
- [CyberChef](https://gchq.github.io/CyberChef/) — כלי להמרות Encoding/Hashing
- [Postman](https://www.postman.com/) — בדיקת API Authentication flows

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Authentication ל-Authorization?"
    **Authentication (AuthN)** — מי אתה? תהליך אימות הזהות. **Authorization (AuthZ)** — מה מותר לך? בדיקת הרשאות. Authentication תמיד בא ראשון. דוגמה: כרטיס כניסה לבניין (AuthN) מול מפתח לחדר ספציפי (AuthZ). בפועל — Login הוא AuthN, ובדיקת Role/Permission לפני גישה למשאב היא AuthZ.

??? tip "למה לא להשתמש ב-MD5 או SHA-256 ל-Hashing סיסמאות?"
    MD5 ו-SHA-256 תוכננו להיות **מהירים** — מעולה ל-Data Integrity, אבל קטלני לסיסמאות. GPU מודרני יכול לחשב מיליארדי SHA-256 hashes בשנייה. אלגוריתמים כמו **bcrypt** ו-**Argon2** תוכננו להיות **איטיים בכוונה** (Cost Factor / Memory-Hard), מה שהופך Brute Force לבלתי כדאי גם עם חומרה חזקה.

??? tip "מה זה JWT ומה החסרונות שלו?"
    JWT (JSON Web Token) הוא Token חתום שמכיל Claims (מידע) על המשתמש. **יתרונות:** Stateless — ה-Server לא צריך לשמור Session. **חסרונות:** 1) לא ניתן ל-Revoke בקלות (עד שפג תוקף), 2) ה-Payload קריא (Base64), 3) גודל גדול יחסית ל-Session ID פשוט. **פתרון ל-Revocation:** Blacklist / Short-lived tokens + Refresh Token.

??? tip "איך מתגוננים מפני Credential Stuffing?"
    1. **MFA** — גם אם הסיסמה נכונה, צריך גורם נוסף 2. **Rate Limiting** — הגבלת ניסיונות 3. **Password Breach Detection** — בדיקה ב-Sign Up / Login מול רשימות דליפות 4. **CAPTCHA** — אחרי ניסיונות כושלים 5. **Behavioral Analysis** — זיהוי דפוסי Login חשודים (מיקום, User Agent, שעה).

??? tip "הסבר OAuth 2.0 Flow — למה צריך Auth Code ולא שולחים Token ישירות?"
    ב-Authorization Code Flow, ה-Auth Server מחזיר **Code** (לא Token) דרך ה-Browser. אחר כך ה-Backend מחליף את ה-Code ל-Token בערוץ Server-to-Server. **למה?** כי ה-Token לא עובר דרך ה-Browser/URL כך שהוא לא חשוף ל-Browser History, Referrer Headers או Shoulder Surfing. זו הסיבה שב-SPA משתמשים ב-PKCE (Proof Key for Code Exchange) כשכבת הגנה נוספת.

??? tip "מה זה Zero Trust ואיך זה קשור ל-Credentials?"
    Zero Trust = "לעולם אל תסמוך, תמיד תאמת." במקום לסמוך על כל מי שנמצא בתוך הרשת (כמו ב-Perimeter Security), כל Request צריך לעבור Authentication ו-Authorization מחדש. **יישום:** Mutual TLS בין שירותים, Short-lived Tokens, Micro-segmentation, Continuous Verification. קשור ל-Credentials כי ניהול זהויות הוא הליבה של Zero Trust.

??? tip "מה ההבדל בין Session-Based Authentication ל-Token-Based Authentication?"
    **Session-Based:** Server יוצר Session ושומר אותו (ב-Memory/DB). Client מקבל Session ID ב-Cookie. **Stateful** — Server חייב לזכור כל Session. **Token-Based (JWT):** Server יוצר Token חתום. Client שולח אותו בכל Request. **Stateless** — Server רק מאמת את החתימה. **Tradeoffs:** Sessions קלים ל-Revoke אבל קשים ל-Scale. Tokens קלים ל-Scale אבל קשים ל-Revoke.

??? tip "מה עושים אם גילינו שדלפו Credentials של המערכת?"
    **Incident Response מיידי:** 1) Rotate כל ה-Credentials שדלפו **מיד** 2) בטלו כל ה-Tokens/Sessions הקיימים 3) בדקו Audit Logs — האם מישהו השתמש ב-Credentials שדלפו? 4) הודיעו למשתמשים שיחליפו סיסמאות 5) בדקו Scope — אילו מערכות נחשפו? 6) תיעדו את האירוע ותיקנו את מקור הדליפה (קוד, לוגים, Slack?) 7) הוסיפו Pre-commit Hook שמונע Push של Secrets.

## קישורים לנושאים אחרים

- [Sandbox](sandbox.md) — איך מבודדים תהליכים כדי שגם אם Credentials נגנבו, הנזק מוגבל
- [TCP/IP ו-HTTP](../03-networks/tcp-ip-http.md) — הפרוטוקולים שמעבירים את ה-Credentials ברשת (ולמה HTTPS חיוני)
- [Production](../00-big-picture/production.md) — ניהול Credentials בסביבת Production (Secrets Management, Environment Variables)
- [Red, Blue & Purple Teams](red-blue-purple.md) — צוותי Red Team בודקים חוזק Credentials כחלק מ-Penetration Testing
- [MITRE ATT&CK](mitre-attck.md) — Credential Access הוא Tactic מרכזי במסגרת ATT&CK
