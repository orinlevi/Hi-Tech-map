# 🗺️ מפת דרכים ללימוד עצמי

## למה זה חשוב

ברוכים הבאים לעולם שבו יש **אלף דרכים ללמוד** ואף אחת מהן לא מושלמת. Udemy, YouTube, Coursera, freeCodeCamp, CS50, בוטקמפים, ספרים, פודקאסטים, Twitter threads... הבחירה יכולה לשתק. המדריך הזה **ייתן לכם מסלול ברור** לפי התפקיד שאתם רוצים.

> "התחלתי ללמוד React, אחרי שבוע עברתי ל-Python, אחרי שבועיים ניסיתי Rust, ובסוף לא ידעתי כלום ב-3 שפות. אל תהיו כמוני -- תבחרו מסלול ותצמדו אליו."

!!! note "הכלל הכי חשוב בלימוד עצמי"
    **עומק מנצח רוחב.** עדיף לדעת שפה אחת ו-framework אחד **לעומק** מאשר 5 שפות ו-10 frameworks **ברמה שטחית**. מעסיקים מחפשים **מומחיות**, לא רשימת טכנולוגיות.

---

## מפת דרכים לפי תפקיד

### Frontend Developer

**מה עושים**: בונים את הצד שהמשתמש רואה -- UI, אינטראקציות, חוויית משתמש.

**מסלול לימוד:**

```
HTML/CSS (2-3 שבועות)
    ↓
JavaScript (4-6 שבועות)
    ↓
React / Vue / Angular (4-6 שבועות)
    ↓
TypeScript (2-3 שבועות)
    ↓
State Management (Redux / Zustand) + API Integration (2 שבועות)
    ↓
Testing (Jest, Cypress) + Build Tools (Vite, Webpack) (2 שבועות)
    ↓
פרויקטים + Portfolio (ongoing)
```

**טכנולוגיות מפתח:**

| שלב | מה ללמוד | משאב מומלץ |
|------|---------|-----------|
| בסיס | HTML, CSS, Flexbox, Grid | freeCodeCamp, MDN Web Docs |
| שפה | JavaScript ES6+ | javascript.info, Eloquent JavaScript |
| Framework | React (הכי מבוקש בישראל) | React.dev (official docs), Scrimba |
| Type Safety | TypeScript | TypeScript Handbook (official) |
| Styling | Tailwind CSS / CSS Modules | Tailwind docs |
| Testing | Jest, React Testing Library, Cypress | Testing Library docs |

!!! tip "פרויקטים מומלצים ל-Frontend"
    1. **אתר פורטפוליו אישי** -- responsive, dark mode
    2. **אפליקציית מזג אוויר** -- API integration, async data
    3. **Todo App מתקדם** -- CRUD, local storage, filtering
    4. **Clone של אתר מוכר** -- Spotify UI, Trello board, Twitter feed
    5. **Dashboard** -- charts, real-time data, responsive design

---

### Backend Developer

**מה עושים**: בונים את הלוגיקה, ה-APIs, ה-databases -- כל מה שקורה "מאחורי הקלעים".

**מסלול לימוד:**

```
שפה (Python / Node.js / Java / Go) (4-6 שבועות)
    ↓
HTTP, REST APIs, JSON (2 שבועות)
    ↓
Framework (Flask / Express / Spring / Gin) (3-4 שבועות)
    ↓
Database (SQL + ORM) (3-4 שבועות)
    ↓
Authentication, Authorization (JWT, OAuth) (2 שבועות)
    ↓
Docker + Basic Deployment (2 שבועות)
    ↓
Testing (Unit, Integration) + CI/CD (2 שבועות)
    ↓
פרויקטים + Portfolio (ongoing)
```

**טכנולוגיות מפתח:**

| שלב | מה ללמוד | משאב מומלץ |
|------|---------|-----------|
| שפה | Python או Node.js (להתחלה) | Automate the Boring Stuff, Node.js docs |
| Framework | Flask/FastAPI (Python) או Express (Node.js) | Official docs, Traversy Media |
| Database | PostgreSQL + SQL basics | SQLBolt, PostgreSQL Tutorial |
| ORM | SQLAlchemy (Python) / Prisma (Node.js) | Official docs |
| Auth | JWT, OAuth 2.0, bcrypt | jwt.io, OWASP guides |
| Containers | Docker basics | Docker Getting Started |
| API Design | REST best practices, OpenAPI | RESTful API Design Guide |

> "Backend developer שלא מבין databases זה כמו שף שלא מבין חום. אתם **חייבים** ללמוד SQL."

---

### DevOps / SRE

**מה עושים**: מוודאים שהמערכת רצה, scalable, ובטוחה. CI/CD, infrastructure, monitoring.

**מסלול לימוד:**

```
Linux Basics + Command Line (3-4 שבועות)
    ↓
Networking Fundamentals (TCP/IP, DNS, HTTP) (2-3 שבועות)
    ↓
Git + CI/CD (GitHub Actions, Jenkins) (2 שבועות)
    ↓
Docker + Docker Compose (3-4 שבועות)
    ↓
Cloud (AWS / GCP / Azure -- בחרו אחד) (4-6 שבועות)
    ↓
Kubernetes Basics (3-4 שבועות)
    ↓
Infrastructure as Code (Terraform) (2-3 שבועות)
    ↓
Monitoring (Prometheus, Grafana, ELK) (2 שבועות)
```

**טכנולוגיות מפתח:**

| שלב | מה ללמוד | משאב מומלץ |
|------|---------|-----------|
| Linux | CLI, permissions, processes, systemd | Linux Journey, OverTheWire |
| Containers | Docker, Docker Compose | Docker docs, KodeKloud |
| Cloud | AWS (הכי נפוץ בישראל) | AWS Free Tier + Cantrill courses |
| Orchestration | Kubernetes basics | KodeKloud, Kubernetes docs |
| IaC | Terraform | HashiCorp Learn |
| CI/CD | GitHub Actions, Jenkins | Official docs |
| Scripting | Bash + Python | Learn Bash, Automate the Boring Stuff |

!!! warning "DevOps דורש ניסיון מעשי"
    לא מספיק לקרוא. אתם **חייבים** לבנות infrastructure אמיתי. השתמשו ב-AWS Free Tier, בנו CI/CD pipeline, פרסו אפליקציה. ה-hands-on experience הוא מה שמבדיל.

---

### ML / Data Science

**מה עושים**: בונים מודלים שלומדים מנתונים -- prediction, classification, NLP, computer vision.

**מסלול לימוד:**

```
Python + NumPy + Pandas (4-6 שבועות)
    ↓
מתמטיקה (Linear Algebra, Statistics, Probability) (4-6 שבועות)
    ↓
Machine Learning Basics (Scikit-Learn) (4-6 שבועות)
    ↓
Deep Learning (PyTorch / TensorFlow) (4-6 שבועות)
    ↓
Specialization (NLP / Computer Vision / Tabular) (4-8 שבועות)
    ↓
MLOps Basics (deployment, monitoring) (2-4 שבועות)
    ↓
פרויקטים + Kaggle (ongoing)
```

**טכנולוגיות מפתח:**

| שלב | מה ללמוד | משאב מומלץ |
|------|---------|-----------|
| Python | Python, NumPy, Pandas, Matplotlib | Python for Data Analysis (McKinney) |
| מתמטיקה | Linear Algebra, Probability, Statistics | 3Blue1Brown, Khan Academy |
| ML Basics | Supervised/Unsupervised, Scikit-Learn | Andrew Ng's ML Course (Coursera) |
| Deep Learning | Neural Networks, PyTorch | Fast.ai, DeepLearning.AI |
| NLP | Transformers, Hugging Face | Hugging Face Course |
| MLOps | Docker, MLflow, model serving | Made With ML |

ראו את [AI / ML / DL](../00-big-picture/ai-ml-dl.md) ו-[Vectors and Spaces](../02-ml-core/vectors-and-spaces.md) לבסיס תיאורטי.

> "Machine Learning בלי מתמטיקה זה כמו לנהוג בלי להבין כללי תנועה. אתם יכולים, אבל תתנגשו."

---

### Security (Cybersecurity)

**מה עושים**: מגנים על מערכות מתקיפות, מחפשים פרצות, בודקים אבטחה.

**מסלול לימוד:**

```
Networking (TCP/IP, DNS, HTTP/S, Firewalls) (4-6 שבועות)
    ↓
Linux Administration (3-4 שבועות)
    ↓
Web Security (OWASP Top 10, XSS, SQLi) (3-4 שבועות)
    ↓
Scripting (Python + Bash) (3-4 שבועות)
    ↓
Cryptography Basics (2-3 שבועות)
    ↓
Penetration Testing Tools (Burp Suite, Nmap, Metasploit) (4-6 שבועות)
    ↓
CTF Challenges + Labs (ongoing)
```

**טכנולוגיות מפתח:**

| שלב | מה ללמוד | משאב מומלץ |
|------|---------|-----------|
| Networking | TCP/IP, DNS, Wireshark | Professor Messer, NetworkChuck |
| Web Security | OWASP Top 10, Burp Suite | PortSwigger Web Security Academy (חינם!) |
| Linux | Administration, permissions, hardening | OverTheWire, TryHackMe |
| Pentesting | Nmap, Metasploit, privilege escalation | HackTheBox, TryHackMe |
| Scripting | Python for security, Bash | Automate the Boring Stuff + security scripts |
| CTFs | Capture The Flag competitions | picoCTF, CTFtime |

ראו את [Red / Blue / Purple Teams](../05-security/red-blue-purple.md) ו-[Sandbox](../05-security/sandbox.md) לעוד רקע.

!!! tip "Security tip"
    **PortSwigger Web Security Academy** הוא משאב חינמי **מדהים**. אם אתם רוצים להיכנס לסייבר -- תתחילו משם.

---

## סדר לימוד מומלץ -- כללי

### שלב 1: בסיס (חודש 1-2)

בלי קשר לתפקיד, כולם צריכים:

- [ ] **שפת תכנות אחת** -- Python (הכי versatile) או JavaScript (הכי נפוץ ב-web)
- [ ] **Git basics** -- clone, commit, push, pull, branch, merge
- [ ] **Command Line** -- cd, ls, mkdir, cat, grep, ssh
- [ ] **איך האינטרנט עובד** -- HTTP, DNS, Client-Server (ראו [Client-Server](../03-networks/client-server.md))

### שלב 2: העמקה (חודש 3-4)

- [ ] **Framework** בתחום שבחרתם (React, Flask, Docker...)
- [ ] **Database basics** -- SQL, CREATE, SELECT, JOIN
- [ ] **פרויקט ראשון** -- משהו שלם ועובד
- [ ] **LeetCode Easy** -- 10-20 בעיות (ראו [ראיון קוד](./coding-interview.md))

### שלב 3: התמחות (חודש 5-8)

- [ ] **טכנולוגיות מתקדמות** של המסלול שלכם
- [ ] **פרויקט שני** -- יותר מורכב, עם deployment
- [ ] **Testing** -- Unit tests, integration tests
- [ ] **Docker** -- גם אם אתם לא DevOps, זה בסיסי

### שלב 4: Job Ready (חודש 9+)

- [ ] **Portfolio** -- 2-3 פרויקטים מרשימים ב-GitHub (ראו [קו"ח ופורטפוליו](./resume-and-portfolio.md))
- [ ] **LeetCode Medium** -- 20-30 בעיות
- [ ] **System Design basics** (ראו [System Design](./system-design-basics.md))
- [ ] **הכנה לראיונות** (ראו [הכנה לראיון](./interview-prep.md))

---

## משאבים -- חינם vs בתשלום

### משאבים חינמיים מצוינים

| משאב | תחום | למה טוב |
|------|------|---------|
| **freeCodeCamp** | Full-Stack Web | קורסים מלאים, פרויקטים, certificates |
| **The Odin Project** | Full-Stack Web | Project-based, קהילה חזקה |
| **CS50 (Harvard)** | CS Fundamentals | הקורס הכי טוב לבסיס |
| **Khan Academy** | Math, Algorithms | מצוין למתמטיקה שצריך ל-ML |
| **PortSwigger Academy** | Web Security | הטוב ביותר לסייבר |
| **fast.ai** | Deep Learning | Practical approach ל-ML |
| **Docker Getting Started** | Docker | מההתחלה, hands-on |
| **MDN Web Docs** | HTML/CSS/JS | ה-reference הכי טוב |
| **SQLBolt** | SQL | אינטראקטיבי, מהיר |

### משאבים בתשלום (ששווים את הכסף)

| משאב | מחיר | תחום | למה שווה |
|------|------|------|---------|
| **Udemy** (בהנחה!) | ~$10-15 | הכל | מבחר ענק, אבל **רק** בהנחה |
| **Frontend Masters** | $39/חודש | Frontend + Node | איכות מעולה, מרצים מהתעשייה |
| **Educative.io** | $59/חודש | System Design, Coding | Interactive, טוב לראיונות |
| **LeetCode Premium** | $35/חודש | Coding Interviews | בעיות של חברות ספציפיות |
| **Cantrill (Adrian)** | ~$40 | AWS | הטוב ביותר ל-AWS |
| **KodeKloud** | $20/חודש | DevOps | Hands-on labs |

!!! warning "על Udemy"
    **לעולם אל תקנו קורס ב-Udemy במחיר מלא.** הם עושים הנחות של 85-90% כל שבוע. אם הקורס עולה $100 -- חכו יום-יומיים ותראו אותו ב-$12.

---

## רעיונות לפרויקטים

### פרויקטים לפי רמה

**Beginner (שבוע 1-2 לכל פרויקט):**

- Calculator app (Frontend)
- Personal portfolio website
- CLI todo list (Python/Node)
- Weather app with API
- Simple blog with CRUD

**Intermediate (2-4 שבועות):**

- Full-stack e-commerce store
- Real-time chat application
- URL shortener (ראו [System Design](./system-design-basics.md))
- REST API with authentication
- Docker-ized web application

**Advanced (1-2 חודשים):**

- Social media feed (infinite scroll, real-time updates)
- CI/CD pipeline + deployment to cloud
- ML model serving as API
- Distributed task queue
- Kubernetes-deployed microservices

!!! note "הפרויקט הכי מרשים?"
    פרויקט ש**פותר בעיה אמיתית שלכם**. "בניתי כלי שעוזר לי לנהל הוצאות" מרשים יותר מ-"בניתי clone של Twitter". למה? כי זה מראה **חשיבה עצמאית** ויכולת לזהות בעיות.

---

## Certifications -- מה שווה ומה לא

### Certifications ששוות את הזמן

| Certification | תחום | עלות | למי מתאים |
|--------------|-------|------|----------|
| **AWS Cloud Practitioner** | Cloud | $100 | כל מי שרוצה cloud basics |
| **AWS Solutions Architect** | Cloud Architecture | $150 | DevOps / Backend |
| **CKA (Kubernetes)** | Kubernetes | $395 | DevOps / SRE |
| **CompTIA Security+** | Security | $392 | Cybersecurity beginners |
| **Terraform Associate** | IaC | $70 | DevOps |

### Certifications שפחות שוות

!!! warning "לא כל certificate שווה"
    - **Coursera / Udemy certificates** -- מעסיקים לא ממש מתרשמים. הפרויקטים שבניתם חשובים **הרבה יותר**
    - **Certificate בלי ניסיון מעשי** -- אם יש לכם AWS certification אבל אף פעם לא פרסתם שום דבר ב-AWS, זה בעייתי
    - **הרבה certificates בלי עומק** -- 5 certificates שטחיים שווים פחות מ-1 certification + פרויקט אמיתי

---

## להישאר עדכניים

### הייטק זז מהר -- איך לא נשארים מאחור

**Newsletters מומלצים:**

- **TLDR** -- סיכום חדשות טכנולוגיה יומי, 5 דקות קריאה
- **JavaScript Weekly** / **Python Weekly** -- עדכונים שבועיים לפי שפה
- **DevOps Weekly** -- חדשות DevOps
- **The Morning Paper** -- מאמרים אקדמיים בגרסה קריאה

**YouTube Channels:**

- **Fireship** -- הסברים קצרים ומצוינים (100 seconds of...)
- **Traversy Media** -- tutorials מעשיים
- **NetworkChuck** -- DevOps / Networking בצורה מבדרת
- **3Blue1Brown** -- מתמטיקה ויזואלית (ML!)
- **ThePrimeagen** -- חשיבה על performance ואלגוריתמים

**Podcasts:**

- **Syntax.fm** -- Frontend / Full-Stack
- **DevOps Paradox** -- DevOps
- **Lex Fridman** -- AI ו-Tech interviews

### כללים להישאר עדכניים

1. **לא לנסות לדעת הכל** -- בחרו 2-3 נושאים שרלוונטיים לכם
2. **30 דקות ביום** -- קריאת newsletter + מאמר אחד. מספיק
3. **לבנות** -- הדרך הכי טובה ללמוד טכנולוגיה חדשה היא **לבנות משהו** איתה
4. **קהילה** -- meetups, Discord, Twitter. לשמוע על מה אנשים מדברים
5. **לא FOMO** -- לא כל framework חדש רלוונטי. רוב הטכנולוגיות "חמות" נעלמות אחרי שנה

> "הטכנולוגיה הכי חשובה ללמוד היא **לא** הטכנולוגיה החדשה ביותר. היא הטכנולוגיה שה-job description שלך מבקש."

---

## 🛤️ מאיפה מתחילים

### תוכנית פעולה -- שבוע ראשון

**יום 1-2: בחירת מסלול**

- [ ] קראו את מפות הדרכים למעלה
- [ ] בחרו מסלול אחד (Frontend / Backend / DevOps / ML / Security)
- [ ] אם לא בטוחים -- תנסו tutorial קצר ב-2 כיוונים ותראו מה מרגיש טבעי

**יום 3-4: הקמת סביבה**

- [ ] התקינו את הכלים הבסיסיים (VS Code, Git, שפת תכנות)
- [ ] פתחו חשבון GitHub
- [ ] הצטרפו לקהילה אחת (Discord / Telegram / Meetup)

**יום 5-7: התחלת לימוד**

- [ ] התחילו עם המשאב הראשון מהמסלול שבחרתם
- [ ] הגדירו לוח זמנים -- כמה שעות ביום? באילו ימים?
- [ ] כתבו את המטרה: "בעוד X חודשים, אני רוצה [מטרה ספציפית]"

### טיפים ללמידה אפקטיבית

!!! tip "5 כללים ללימוד עצמי"
    1. **תכתבו קוד כל יום** -- אפילו 30 דקות. Consistency מנצחת intensity
    2. **אל תצפו ב-tutorials בלי לכתוב** -- "tutorial hell" זו מלכודת אמיתית. צפו 10 דקות, כתבו 20 דקות
    3. **בנו פרויקטים מוקדם** -- אל תחכו שתדעו "מספיק". תתחילו לבנות **עכשיו**
    4. **למדו לקרוא documentation** -- YouTube tutorials מתיישנים. Docs מתעדכנים
    5. **למדו עם אנשים** -- study group, pair programming, או אפילו סתם חבר שלומד בו-זמנית

---

## 💼 שאלות לראיון עבודה

??? tip "איך למדת את הטכנולוגיה הזו?"
    **מה באמת שואלים**: האם אתה לומד עצמאי ומונע?

    **מבנה תשובה:**

    1. "התחלתי מ-[משאב ספציפי] כדי להבין את הבסיס"
    2. "בניתי [פרויקט] כדי לתרגל"
    3. "כשנתקלתי ב-[בעיה], חיפשתי ב-[docs / community]"
    4. "היום אני ממשיך ללמוד דרך [newsletter / projects / community]"

    **היו ספציפיים** -- שמות של קורסים, ספרים, פרויקטים. לא "למדתי מהאינטרנט".

??? tip "מה ה-tech stack שאתה הכי חזק בו?"
    **מה באמת שואלים**: האם יש לך עומק, או שאתה "mile wide, inch deep"?

    **תשובה טובה**: "אני הכי חזק ב-Python + FastAPI + PostgreSQL. בניתי X ו-Y עם ה-stack הזה, והבנתי לעומק את [נושא ספציפי]. אני גם מכיר React ו-Docker, אבל Python backend זה ה-sweet spot שלי."

    **תשובה פחות טובה**: "אני יודע Python, JavaScript, Java, Go, Rust, C++, ו-Haskell." (אף אחד לא מאמין.)

??? tip "מה הפרויקט הכי מרשים שבנית?"
    **מה באמת שואלים**: מה אתה יכול לייצר? מה הרמה שלך?

    **דברו על:**

    1. **מה הפרויקט עושה** (משפט אחד)
    2. **למה בניתם אותו** (בעיה אמיתית)
    3. **מה ה-tech stack ולמה בחרתם אותו**
    4. **מה האתגר הכי גדול ואיך פתרתם**
    5. **מה הייתם עושים אחרת היום**

    **טיפ**: הציגו את הפרויקט ב-GitHub עם README מסודר. Bonus: demo link.

??? tip "איך אתה נשאר עדכני?"
    **מה באמת שואלים**: האם תמשיך ללמוד אחרי שנקבל אותך?

    ציינו מקורות ספציפיים:

    - "אני קורא את TLDR כל בוקר"
    - "עוקב אחרי [שמות] ב-Twitter"
    - "הולך ל-meetup של [X] פעם בחודש"
    - "בונה side projects כדי לנסות טכנולוגיות חדשות"

    **היו אותנטיים.** אל תמציאו פודקאסט שלא הקשבתם לו.

??? tip "מה דעתך על [טכנולוגיה חמה X]?"
    **מה באמת שואלים**: יש לך דעה מגובשת? אתה עוקב אחרי התעשייה?

    **מבנה תשובה:**

    1. "שמעתי / קראתי על [X] ב-[מקור]"
    2. "מהבנתי, זה מנסה לפתור [בעיה Y]"
    3. "היתרון שלו לעומת [Z] הוא..."
    4. "החיסרון / מה שעדיין לא ברור לי הוא..."

    **אם לא מכירים**: "לא הספקתי להעמיק ב-X, אבל מהבנתי הראשונית זה קשור ל-[Y]. אשמח ללמוד יותר."

??? tip "למה בחרת את המסלול הזה?"
    **מה באמת שואלים**: יש לך כיוון ומוטיבציה?

    **תשובה טובה:**

    - "אני אוהב/ת [היבט ספציפי] -- לדוגמה, לפתור בעיות של scale / לבנות UI / למצוא פרצות"
    - "ניסיתי גם [Y], אבל [X] הרגיש יותר טבעי כי [סיבה]"
    - "המטרה שלי לשנה הקרובה היא [מטרה ספציפית]"

    **לא תגידו**: "שמעתי שבזה מרוויחים הכי טוב."

??? tip "תן דוגמה למשהו שלמדת מ-open source"
    **מה באמת שואלים**: האם אתה מסתכל על קוד של אחרים ולומד?

    **דוגמה טובה**: "קראתי את ה-source code של [library] כדי להבין איך הם מימשו [feature]. גיליתי שהם משתמשים ב-[pattern] -- וזה שינה את הגישה שלי ב-[פרויקט שלי]."

    **בונוס**: "תרמתי fix ל-[project]. זה היה [PR link]. למדתי על [process/pattern] מהתהליך."

---

## בלבולים נפוצים

!!! warning "\"צריך לדעת הכל לפני שמתחילים לחפש עבודה\""
    **לא.** אף אחד לא מוכן ב-100%. אם אתם מרגישים 70% מוכנים -- **תתחילו לחפש**. הראיונות עצמם הם חלק מהלמידה.

!!! warning "\"Tutorial hell -- הטעות הכי נפוצה\""
    **צפייה ב-tutorials בלי לכתוב קוד** היא בזבוז זמן. אחרי tutorial של 30 דקות, עצרו וכתבו את מה שלמדתם **לבד**. בלי להסתכל. אם לא הצלחתם -- חזרו ל-tutorial. זה נורמלי.

!!! warning "\"שפה X היא הכי טובה\""
    **אין שפה כי טובה.** יש שפה שמתאימה **למטרה** שלכם. Python מצוינת ל-ML. JavaScript חובה ל-Frontend. Go נהדרת ל-Backend performant. תפסיקו להתווכח על שפות ותתחילו **לבנות**.

!!! warning "\"לימוד עצמי לא עובד\""
    **עובד מצוין** -- אם עושים את זה נכון. המפתח: **consistency** (לימוד כל יום), **projects** (לא רק tutorials), ו-**community** (לא לבד).

---

## קישורים לנושאים אחרים

- [מאיפה מתחילים](./how-to-start.md) -- הצעד הראשון בדרך
- [קו"ח ופורטפוליו](./resume-and-portfolio.md) -- כשמוכנים להציג את עצמכם
- [הכנה לראיון](./interview-prep.md) -- כשמתחילים לקבל זימונים
- [ראיון קוד](./coding-interview.md) -- הכנה טכנית מעמיקה
- [העבודה הראשונה](./first-job.md) -- מה לצפות אחרי שמתקבלים
- [AI / ML / DL](../00-big-picture/ai-ml-dl.md) -- אם בחרתם את מסלול ה-ML
- [סיבוכיות](../01-algorithmics/complexity.md) -- בסיס חובה לכל מפתח
- [Client-Server](../03-networks/client-server.md) -- איך האינטרנט עובד
