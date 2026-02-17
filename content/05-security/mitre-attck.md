# MITRE ATT&CK

## למה זה חשוב

כשמדברים על התקפות סייבר, קל ללכת לאיבוד ב-buzzwords. מסגרת **MITRE ATT&CK** (Adversarial Tactics, Techniques & Common Knowledge) נותנת **שפה משותפת** לכל תעשיית האבטחה — תוקפים, מגינים וחוקרים.

בין אם אתם חוקרי אבטחה, מפתחים שכותבים Detection Rules, או מנהלי SOC — ATT&CK היא המפה שמסבירה **איך תוקפים פועלים** בפועל, בהתבסס על תצפיות מהעולם האמיתי.

## רעיונות מרכזיים

### מהי מסגרת MITRE ATT&CK?

ATT&CK היא **מאגר ידע פתוח** שמתעד טכניקות התקפה אמיתיות שנצפו בטבע (in the wild). היא מאורגנת בצורה היררכית:

```text
┌─────────────────────────────────────────┐
│              MITRE ATT&CK               │
│                                         │
│  Tactic (מה רוצים להשיג?)              │
│    └── Technique (איך עושים את זה?)     │
│          └── Sub-Technique (וריאציה)    │
│                └── Procedure (דוגמה     │
│                     מהעולם האמיתי)      │
└─────────────────────────────────────────┘
```

| מושג | הגדרה | דוגמה |
|------|-------|-------|
| **Tactic** | המטרה של התוקף | Initial Access — להשיג כניסה ראשונית |
| **Technique** | הדרך להשיג את המטרה | Phishing — הטעיית משתמש דרך אימייל |
| **Sub-Technique** | וריאציה ספציפית | Spearphishing Attachment — פישינג עם קובץ מצורף |
| **Procedure** | מימוש בפועל | קבוצת APT29 שלחה אימיילים עם מסמכי Word זדוניים |

### TTPs — Tactics, Techniques & Procedures

!!! note "TTPs הם ה'DNA' של תוקפים"
    בעוד שכתובות IP וחתימות Malware משתנות כל הזמן (Indicators of Compromise), **דפוסי ההתנהגות של תוקפים** (TTPs) יציבים הרבה יותר. זיהוי TTPs נותן הגנה עמידה יותר.

### מחזור חיי ההתקפה — The Attack Lifecycle

ה-Tactics ב-ATT&CK מסודרים לפי סדר כרונולוגי של התקפה טיפוסית:

```text
Reconnaissance     חיפוש מידע על המטרה
       ↓
Resource Development    הכנת כלים ותשתית
       ↓
Initial Access     כניסה ראשונית (Phishing, Exploit)
       ↓
Execution          הרצת קוד זדוני
       ↓
Persistence        ביסוס אחיזה (שהקוד ישרוד Reboot)
       ↓
Privilege Escalation   עליית הרשאות (User → Admin)
       ↓
Defense Evasion    התחמקות מזיהוי
       ↓
Credential Access  גניבת Credentials
       ↓
Discovery          סריקת הרשת הפנימית
       ↓
Lateral Movement   מעבר בין מכונות ברשת
       ↓
Collection         איסוף המידע הרצוי
       ↓
Command & Control  תקשורת עם שרת השליטה
       ↓
Exfiltration       הוצאת מידע מהארגון
       ↓
Impact             גרימת נזק (Ransomware, מחיקה)
```

??? tip "לא כל התקפה עוברת את כל השלבים"
    התקפת Ransomware אופורטוניסטית עשויה לדלג ישירות מ-Initial Access ל-Execution ל-Impact. התקפת APT מתוחכמת עשויה להישאר בשלב Discovery ו-Lateral Movement במשך חודשים.

### איך מגינים משתמשים ב-ATT&CK?

**מיפוי כיסוי (Coverage Mapping):**

```text
┌─────────────────────┬──────────┬──────────┬──────────┐
│ Technique           │ Detection│Prevention│  Gap     │
├─────────────────────┼──────────┼──────────┼──────────┤
│ T1566: Phishing     │    ✅    │    ✅    │          │
│ T1059: Command Line │    ✅    │    ❌    │  ⚠️     │
│ T1053: Scheduled    │    ❌    │    ❌    │  🔴     │
│        Task         │          │          │          │
│ T1078: Valid        │    ✅    │    ❌    │  ⚠️     │
│        Accounts     │          │          │          │
└─────────────────────┴──────────┴──────────┴──────────┘
```

!!! warning "כיסוי מלא הוא לא ריאלי"
    אף ארגון לא מכסה את כל הטכניקות ב-ATT&CK. המטרה היא **לתעדף** — לזהות את הטכניקות הרלוונטיות ביותר לסביבה שלכם ולבנות Detection לפחות עבורן.

**שימושים נוספים:**

- **Threat Intelligence** — מיפוי קבוצות תקיפה ל-Techniques שלהן
- **Red Team Planning** — תכנון תרגילי Pen Test על בסיס Techniques מוכרים
- **SOC Maturity** — מדידת בגרות מערך ההגנה לפי אחוז הכיסוי

## בלבולים נפוצים

- **"ATT&CK היא רשימת כלי פריצה"** — ATT&CK מתעדת **התנהגויות**, לא כלים. אותה טכניקה יכולה להתבצע עם כלים שונים.
- **"ATT&CK רלוונטית רק לארגונים גדולים"** — גם Startup קטן יכול להשתמש ב-ATT&CK כדי לתעדף השקעות אבטחה ולבנות Detection בסיסי.
- **"צריך לכסות הכל"** — לא. צריך לכסות את מה שרלוונטי לסביבה שלכם. אם אין לכם תשתית On-Premise, טכניקות של Physical Access פחות רלוונטיות.
- **"ATT&CK = Kill Chain"** — Lockheed Martin Cyber Kill Chain היא מסגרת ישנה יותר עם 7 שלבים כלליים. ATT&CK מפורטת הרבה יותר עם מאות טכניקות ספציפיות.

## דוגמה קטנה

נניח שקיבלנו דוח שקבוצת APT מסוימת תוקפת חברות בתחום שלנו. נשתמש ב-ATT&CK כדי להתכונן:

```text
# Intelligence Report: APT-Example targets tech companies
# Known TTPs (מקור: MITRE ATT&CK):

Tactic              │ Technique              │ ID
────────────────────┼────────────────────────┼──────────
Initial Access      │ Spearphishing Link     │ T1566.002
Execution           │ PowerShell             │ T1059.001
Persistence         │ Scheduled Task         │ T1053.005
Credential Access   │ OS Credential Dumping  │ T1003
Lateral Movement    │ Remote Services (RDP)  │ T1021.001
Exfiltration        │ Exfil Over C2 Channel  │ T1041
```

```text
# Blue Team Action Plan:

1. T1566.002 → הגדרת סינון URL באימיילים + הדרכת עובדים
2. T1059.001 → הגבלת PowerShell ל-Constrained Language Mode
3. T1053.005 → ניטור יצירת Scheduled Tasks חדשים
4. T1003      → הגנה על LSASS Process (Credential Guard)
5. T1021.001 → הגבלת RDP למכונות ספציפיות בלבד
6. T1041      → ניטור תעבורת C2 חשודה ב-Firewall
```

??? tip "זה בדיוק מה שעושה Purple Team"
    Red Team מדמה את ה-TTPs של APT-Example, ו-Blue Team בודק האם ה-Detection Rules שיצרו באמת מזהים את ההתקפה. מה שלא נתפס — משפרים.

## קישורים לנושאים אחרים

- [Red, Blue & Purple Teams](red-blue-purple.md) — הצוותים שמשתמשים ב-ATT&CK באופן יום-יומי לתכנון התקפות ובניית הגנות
- [אבטחה ו-ML](security-and-ml.md) — Machine Learning יכול לעזור לזהות TTPs באופן אוטומטי ולשפר Detection
- [Sandbox](sandbox.md) — Sandboxing הוא טכניקת הגנה שמופיעה ב-ATT&CK כנגד Execution ו-Defense Evasion

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - אבטחת מידע — threat modeling, risk assessment
    - רשתות מחשבים — network protocols, traffic analysis
    - מערכות הפעלה — persistence mechanisms, privilege escalation

    **קורסים מומלצים:**
    - Digital Forensics — incident investigation
    - Threat Intelligence — IOCs, threat actors, campaigns
    - SOC Operations — SIEM, detection engineering

    **ידע מעשי:**
    - MITRE ATT&CK Navigator — mapping coverage
    - Atomic Red Team — testing detections
    - Sigma rules — detection-as-code
    - Splunk / Elastic SIEM — log analysis

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא לאבטחת מידע (0368-3065)
    - רשתות תקשורת מחשבים (0368-3030)

---

## 🛤️ מאיפה מתחילים

1. **attack.mitre.org** — explore the matrix
2. **ATT&CK Navigator** — interactive coverage mapping
3. **Atomic Red Team** — test techniques hands-on
4. **TryHackMe — Cyber Kill Chain room** — guided learning
5. **MITRE ATT&CK Training** — official certification courses

---

## 💼 שאלות לראיון עבודה

??? tip "מה MITRE ATT&CK?"
    **Framework** שממפה tactics (מטרות) ו-techniques (שיטות) של תוקפים. 14 tactics מ-Reconnaissance עד Impact. כל technique מתועדת עם: description, procedures, detections, mitigations. שימושים: threat intelligence, detection engineering, red team planning, gap analysis.

??? tip "מה ההבדל בין Tactic ל-Technique?"
    **Tactic** = המטרה (WHY) — Initial Access, Persistence, Lateral Movement, Exfiltration. **Technique** = הדרך (HOW) — Phishing (T1566), DLL Side-Loading (T1574.002). **Sub-technique** = וריאציה ספציפית. Tactic = שלב בattack chain, Technique = פעולה ספציפית.

??? tip "מה Cyber Kill Chain ומה הקשר ל-ATT&CK?"
    **Kill Chain** (Lockheed Martin) — 7 שלבים: Reconnaissance → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives. ATT&CK מפורט יותר (14 tactics, מאות techniques). Kill Chain = linear; ATT&CK = matrix (תוקף יכול לקפוץ).

??? tip "איך משתמשים ב-ATT&CK ל-Detection?"
    1. Map existing detections לtechniques (ATT&CK Navigator). 2. זהה gaps — techniques ללא detection. 3. כתוב detection rules (Sigma/SIEM). 4. Test עם Atomic Red Team / Purple Team. 5. Iterate — improve coverage. Detection = measurable ב-ATT&CK.

??? tip "מה IOC ומה TTP?"
    **IOC** (Indicator of Compromise) — artifacts: IP, hash, domain. קצר חיים — תוקף משנה.
    **TTP** (Tactics, Techniques, Procedures) — behavior patterns. יציב יותר — תוקף קשה לו לשנות behavior.
    "Pyramid of Pain" — TTPs בראש (הכי קשה לתוקף לשנות, הכי ערך ל-defender).
