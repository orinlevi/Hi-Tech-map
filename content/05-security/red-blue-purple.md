# Red, Blue & Purple Teams

## למה זה חשוב

אבטחת מידע היא לא רק כלים וטכנולוגיות — היא גם **אנשים ותהליכים**. ארגון שרוצה להגן על עצמו צריך גם מי שמנסה לפרוץ (כדי למצוא חולשות) וגם מי שמגן (כדי לעצור פריצות אמיתיות).

החלוקה ל-Red, Blue ו-Purple Teams היא מסגרת ארגונית שמבטיחה שהאבטחה נבדקת **באופן אקטיבי**, ולא רק מגיבה לאירועים אחרי שהם קורים.

!!! quote "על Red Team בקצרה"
    Red Team — אנשים שמשלמים להם לפרוץ לך, בניגוד להאקרים שעושים את זה בחינם.

## רעיונות מרכזיים

### שלושת הצוותים

```text
┌──────────────────────────────────────────────────┐
│                    הארגון                         │
│                                                  │
│  🔴 Red Team          🔵 Blue Team               │
│  ──────────           ──────────                 │
│  התקפה               הגנה                        │
│  מוצא חולשות          מנטר ומגיב                  │
│  חושב כמו תוקף        חושב כמו מגן                │
│                                                  │
│              🟣 Purple Team                       │
│              ──────────────                      │
│              שיתוף פעולה                          │
│              Red מלמד את Blue                     │
│              Blue משפר בזכות Red                  │
└──────────────────────────────────────────────────┘
```

### Red Team — ההתקפה

Red Team מורכב מאנשי אבטחה שתפקידם **לחשוב ולפעול כמו תוקפים אמיתיים**:

- **Penetration Testing** — ניסיון לפרוץ למערכות באופן מבוקר
- **Social Engineering** — ניסיון להוציא מידע מעובדים (Phishing, Pretexting)
- **Physical Security** — ניסיון להיכנס פיזית למתקנים
- **Application Security** — חיפוש חולשות בקוד ובאפליקציות

!!! note "Penetration Testing — הבסיס"
    Pen Test הוא תהליך מובנה שבו בודקים חולשות במערכת. יש לו שלבים מוגדרים:

    1. **Reconnaissance** — איסוף מידע על המטרה
    2. **Scanning** — סריקת פורטים ושירותים
    3. **Exploitation** — ניצול חולשות שנמצאו
    4. **Post-Exploitation** — מה אפשר לעשות אחרי פריצה
    5. **Reporting** — דוח מפורט עם המלצות לתיקון

### כלי Red Team

```text
┌────────────────────────────────────────────────────┐
│              Red Team Toolkit                       │
│                                                    │
│  🔍 Reconnaissance:                                │
│     ├── Nmap — סריקת פורטים ושירותים               │
│     ├── Shodan — חיפוש מכשירים חשופים באינטרנט     │
│     ├── theHarvester — איסוף אימיילים ו-Subdomains │
│     └── OSINT Framework — מודיעין ממקורות פתוחים   │
│                                                    │
│  💉 Exploitation:                                   │
│     ├── Metasploit — Framework להתקפות             │
│     ├── Burp Suite — בדיקת אפליקציות Web           │
│     ├── SQLmap — זיהוי וניצול SQL Injection        │
│     └── Cobalt Strike — C2 Framework              │
│                                                    │
│  🔑 Credential Attacks:                             │
│     ├── Hashcat — פיצוח סיסמאות (GPU)              │
│     ├── John the Ripper — פיצוח סיסמאות (CPU)     │
│     ├── Mimikatz — חילוץ Credentials מ-Windows     │
│     └── Responder — תפיסת Credentials ברשת        │
│                                                    │
│  🎣 Social Engineering:                             │
│     ├── Gophish — סימולציית Phishing               │
│     ├── SET (Social Engineering Toolkit)           │
│     └── Evilginx — Phishing עם MFA Bypass         │
└────────────────────────────────────────────────────┘
```

!!! quote "על כלי Red Team"
    "Metasploit הוא כמו סכין שוויצרית — רק שבמקום פותחן בקבוקים יש בו Remote Code Execution."

### סוגי Penetration Testing

| סוג | מידע שה-Tester מקבל | מדמה | יתרון |
|-----|---------------------|------|-------|
| **Black Box** | שום דבר — כמו תוקף אמיתי | תוקף חיצוני | הכי ריאלי |
| **White Box** | קוד מקור, ארכיטקטורה, Credentials | Insider Threat | הכי מקיף |
| **Gray Box** | מידע חלקי (למשל גישת משתמש רגיל) | עובד זדוני / Partner | איזון טוב |

### Blue Team — ההגנה

Blue Team אחראי על **ההגנה השוטפת** של הארגון:

- **Monitoring** — ניטור רציף של לוגים, תעבורת רשת ואירועים חשודים
- **Incident Response** — תגובה לאירועי אבטחה בזמן אמת
- **Threat Hunting** — חיפוש יזום (Proactive) של איומים שעדיין לא זוהו
- **Hardening** — חיזוק המערכות: עדכוני אבטחה, הגדרות מחמירות, Firewall Rules

### כלי Blue Team

```text
┌────────────────────────────────────────────────────┐
│              Blue Team Toolkit                      │
│                                                    │
│  📊 SIEM (Security Information & Event Mgmt):      │
│     ├── Splunk — ניתוח לוגים וזיהוי אנומליות      │
│     ├── Elastic SIEM — פלטפורמת Open Source        │
│     ├── Microsoft Sentinel — SIEM בענן Azure       │
│     └── QRadar — SIEM של IBM                      │
│                                                    │
│  🛡️ Detection & Response:                          │
│     ├── CrowdStrike — EDR מתקדם                    │
│     ├── Carbon Black — Endpoint Protection         │
│     ├── Wazuh — Open Source EDR                    │
│     └── Velociraptor — DFIR Tool                   │
│                                                    │
│  🔥 Network Security:                               │
│     ├── Zeek (Bro) — ניטור תעבורת רשת             │
│     ├── Suricata — IDS/IPS                         │
│     ├── Wireshark — ניתוח Packets                  │
│     └── pfSense — Firewall                         │
│                                                    │
│  🔍 Threat Intelligence:                            │
│     ├── MISP — פלטפורמת שיתוף IOCs                 │
│     ├── VirusTotal — בדיקת קבצים וURL              │
│     └── AlienVault OTX — Open Threat Exchange      │
└────────────────────────────────────────────────────┘
```

### SOC — Security Operations Center

```text
┌────────────────────────────────────────────────────┐
│                      SOC                            │
│                                                    │
│  Tier 1 — Alert Triage                             │
│  ├── מסננים False Positives                         │
│  ├── מטפלים בהתראות שגרתיות                        │
│  └── מעבירים אירועים חשודים ל-Tier 2               │
│                                                    │
│  Tier 2 — Incident Analysis                        │
│  ├── חקירה מעמיקה של אירועים                       │
│  ├── Correlation בין אירועים שונים                 │
│  └── Containment ו-Eradication                     │
│                                                    │
│  Tier 3 — Threat Hunting & Engineering             │
│  ├── חיפוש יזום של איומים מתקדמים                  │
│  ├── כתיבת Detection Rules חדשים                   │
│  └── מחקר וניתוח Malware                           │
└────────────────────────────────────────────────────┘
```

!!! quote "חיי SOC Analyst"
    "90% מהעבודה ב-SOC היא False Positives. 10% הנותרים — זה הסיבה שאתה לא ישן בלילה."

### Purple Team — הגשר

Purple Team הוא לא בהכרח צוות נפרד — אלא **שיטת עבודה** שבה Red ו-Blue עובדים יחד:

??? tip "למה Purple Team משנה את כללי המשחק?"
    ב-Red vs Blue מסורתי, ה-Red Team מגיש דוח בסוף, וה-Blue Team מקבל רשימת חולשות. ב-Purple Team:

    - Red מבצע התקפה ומסביר **בזמן אמת** מה הוא עושה
    - Blue רואה אם הוא מזהה את ההתקפה
    - אם לא זיהה — משפרים יחד את ה-Detection
    - התוצאה: שיפור מהיר ומדיד של יכולות ההגנה

### Purple Team Exercise — דוגמה מפורטת

```text
┌────────────────────────────────────────────────────┐
│  Purple Team Exercise: Lateral Movement             │
│                                                    │
│  🔴 Red:                                           │
│  1. השיג Credentials של משתמש רגיל                  │
│  2. התחבר ל-Server פנימי ב-RDP                     │
│  3. הריץ Mimikatz — חילץ Credentials של Admin      │
│  4. התחבר ל-Domain Controller                      │
│                                                    │
│  🔵 Blue — האם זיהינו?                             │
│  ┌──────────────────────┬─────┬──────────────────┐ │
│  │ שלב                  │ זוהה│ פעולה             │ │
│  ├──────────────────────┼─────┼──────────────────┤ │
│  │ RDP מ-Workstation    │ ❌  │ הוסף Alert Rule   │ │
│  │ חריג                 │     │                  │ │
│  │ Mimikatz Execution   │ ✅  │ EDR תפס          │ │
│  │ Login ל-DC           │ ❌  │ הוסף ניטור       │ │
│  │                      │     │ Privileged Login  │ │
│  └──────────────────────┴─────┴──────────────────┘ │
│                                                    │
│  🟣 שיפורים:                                      │
│  ├── Alert על RDP מ-Workstations לא צפויים        │
│  ├── ניטור Privileged Account Login                │
│  └── LSASS Protection (Credential Guard)           │
└────────────────────────────────────────────────────┘
```

### Security Incident Response

כשמתרחש אירוע אבטחה, יש תהליך מסודר:

```text
┌───────────┐    ┌────────────┐    ┌─────────────┐
│ Detection │ →  │Containment │ →  │ Eradication │
│  זיהוי    │    │  בלימה     │    │  מיגור      │
└───────────┘    └────────────┘    └─────────────┘
                                         │
┌───────────┐    ┌────────────┐          ▼
│  Lessons  │ ←  │  Recovery  │    ┌─────────────┐
│  Learned  │    │  שחזור     │ ←  │Investigation│
│ הפקת לקחים│    │            │    │   חקירה     │
└───────────┘    └────────────┘    └─────────────┘
```

!!! warning "זמן הוא הגורם הקריטי"
    ככל שזמן ה-Detection ארוך יותר, הנזק גדל. ממוצע הזמן לזיהוי פריצה בארגונים הוא מאות ימים. צמצום הזמן הזה הוא יעד מרכזי של כל Blue Team.

### Incident Response בפועל — תרחיש Ransomware

??? danger "תרחיש: Ransomware פגע בארגון"
    **Detection:** SOC מזהה שעשרות עמדות מצפינות קבצים בו-זמנית. SIEM מראה Spike ב-File Modification Events.

    **Containment (דקות ראשונות):**

    1. ניתוק Segment מהרשת (Network Isolation)
    2. השבתת חשבונות שנפגעו
    3. חסימת IOCs (IPs, Hashes) ב-Firewall וב-EDR
    4. עצירת שירותי שיתוף קבצים (SMB)

    **Investigation:**

    1. זיהוי Patient Zero — מי נדבק ראשון?
    2. מיפוי Lateral Movement — לאן התוקף התפשט?
    3. זיהוי וקטור הכניסה — Phishing? RDP חשוף? Supply Chain?
    4. בדיקת Data Exfiltration — האם מידע הוצא לפני ההצפנה?

    **Recovery:**

    1. שחזור מ-Backup (אחרי ווידוא שה-Backup נקי)
    2. Rebuild של עמדות נגועות
    3. Reset כל ה-Credentials
    4. Patch את וקטור הכניסה

    **Lessons Learned:**

    - למה ה-Phishing עבר?
    - למה ה-Lateral Movement לא נחסם?
    - מה צריך לשפר ב-Backup Strategy?

### Threat Hunting — חיפוש יזום

```text
Threat Hunting ≠ Waiting for Alerts

┌──────────────────────────────────────────────────┐
│  Traditional SOC:                                 │
│  Alert → Investigate → Respond                   │
│  (מחכים שמשהו יצוץ)                              │
│                                                  │
│  Threat Hunting:                                 │
│  Hypothesis → Hunt → Find → Improve Detection    │
│  (מחפשים באופן יזום)                              │
│                                                  │
│  דוגמה:                                          │
│  "אני חושד שתוקף משתמש ב-PowerShell              │
│   להורדת כלים מהאינטרנט. בוא נחפש."              │
│                                                  │
│  Hunt:                                           │
│  ├── חיפוש PowerShell עם Net.WebClient           │
│  ├── חיפוש Encoded Commands (-enc)               │
│  ├── חיפוש Execution Policy Bypass               │
│  └── ניתוח PowerShell Logs (Script Block)        │
└──────────────────────────────────────────────────┘
```

### Attack Surface Management

**Attack Surface** הוא כל מה שתוקף יכול לנסות לתקוף:

```text
┌────────────────────────────────────────────────────┐
│              Attack Surface                         │
│                                                    │
│  🌐 External:                                      │
│     ├── Web Applications                           │
│     ├── APIs חשופים                                │
│     ├── Email Gateway                              │
│     ├── VPN Endpoints                              │
│     └── Cloud Services (S3, Azure Blob)            │
│                                                    │
│  🏢 Internal:                                      │
│     ├── Active Directory                           │
│     ├── Internal Services                          │
│     ├── Shared Drives                              │
│     └── Legacy Systems                             │
│                                                    │
│  👥 Human:                                         │
│     ├── Phishing Susceptibility                    │
│     ├── Password Hygiene                           │
│     ├── Physical Access                            │
│     └── Social Media Exposure                      │
└────────────────────────────────────────────────────┘
```

## בלבולים נפוצים

- **"Red Team = Hackers רעים"** — Red Team הם אנשי אבטחה מקצועיים שעובדים **בהרשאה** ולטובת הארגון. הם פורצים כדי למצוא חולשות לפני שתוקף אמיתי ימצא אותן.
- **"מספיק לעשות Pen Test פעם בשנה"** — איומים משתנים כל הזמן. בדיקות חדירה צריכות להיות תהליך מתמשך, לא אירוע חד-פעמי.
- **"Blue Team רק מגיב"** — Blue Team מודרני הוא גם **Proactive**. Threat Hunting הוא חיפוש יזום של איומים, לא רק המתנה להתראות.
- **"Purple Team מחליף את Red ו-Blue"** — Purple Team **משלים** אותם, לא מחליף. עדיין צריך יכולת התקפה והגנה עצמאיות.
- **"Bug Bounty מחליף Red Team"** — Bug Bounty מצוין למציאת חולשות טכניות, אבל Red Team בודק גם Social Engineering, Physical Security, ותרחישים מורכבים שכוללים שרשרת התקפות.
- **"Pen Test = Vulnerability Scan"** — Vulnerability Scan הוא אוטומטי ומוצא חולשות ידועות. Pen Test כולל ניצול ידני, חשיבה יצירתית ושרשור חולשות.

## דוגמה קטנה

תרגיל Purple Team פשוט — בדיקה האם ה-Blue Team מזהה ניסיון Brute Force:

```bash
# Red Team: מריץ ניסיונות התחברות רבים (סימולציה)
for i in $(seq 1 100); do
  curl -s -X POST https://target.example.com/login \
    -d "user=admin&pass=attempt_${i}" \
    -o /dev/null
done
```

```text
# Blue Team: מה אמור להופיע בלוגים?
# ── Expected SIEM Alert ──────────────────────────
# Type:     Brute Force Attempt
# Source:   192.168.1.50
# Target:   /login endpoint
# Count:    100 failed attempts in 30 seconds
# Action:   Block IP, notify SOC team
# ─────────────────────────────────────────────────
```

```text
# Purple Team: משווה ומשפר
┌────────────────────────────┬──────────┐
│ בדיקה                      │ תוצאה    │
├────────────────────────────┼──────────┤
│ SIEM זיהה את הניסיונות?    │ ✅ כן    │
│ התראה נשלחה תוך 5 דקות?    │ ❌ לא    │
│ IP נחסם אוטומטית?          │ ❌ לא    │
│ ─────────────────────────  │ ──────── │
│ פעולה: הגדרת Rate Limiting │          │
│ פעולה: Alert Rule חדש      │          │
└────────────────────────────┴──────────┘
```

??? tip "מה למדנו מהתרגיל?"
    הזיהוי עבד, אבל התגובה האוטומטית היתה חסרה. Purple Team מזהה את הפער ויחד — Red ו-Blue — מיישמים Rate Limiting וכלל התראה חדש.

## 🛤️ מאיפה מתחילים

```text
שלב 1: הבסיס — הבנת התפקידים
├── להבין מה כל צוות עושה ולמה צריך את שלושתם
├── להכיר את שלבי Penetration Testing
└── להבין Incident Response Flow

שלב 2: כלים בסיסיים
├── Red: Nmap, Burp Suite, Gobuster
├── Blue: Wireshark, Splunk (Free Tier), Wazuh
└── להתנסות ב-CTF (Capture The Flag)

שלב 3: התנסות מעשית
├── TryHackMe / HackTheBox — לאבות Red Team
├── LetsDefend / CyberDefenders — לאבות Blue Team
├── לבנות Lab מקומי עם VMs (Kali + Windows)
└── להשתתף ב-CTF של Red/Blue

שלב 4: מקצועי
├── OSCP / PNPT — הסמכות Red Team
├── BTL1 / CCD — הסמכות Blue Team
├── MITRE ATT&CK — מיפוי Coverage
└── Purple Team Exercises בארגון
```

**פלטפורמות לתרגול:**

- **TryHackMe** — מצוין למתחילים, מסלולים מודרכים
- **HackTheBox** — מכונות לפריצה ברמות שונות
- **CyberDefenders** — תרגילי Blue Team ו-DFIR
- **LetsDefend** — סימולציית SOC Analyst

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Red Team ל-Penetration Testing?"
    **Penetration Testing** ממוקד ב**מציאת חולשות טכניות** בהיקף מוגדר (אפליקציה, רשת). **Red Team** מדמה **תוקף אמיתי** — כולל Social Engineering, Physical Security, ושרשרת התקפות מרובות שלבים. Red Team לא מוגבל לסקופ טכני — המטרה היא לבדוק את יכולת ההגנה **הכוללת** של הארגון. Pen Test = מוצא באגים. Red Team = בודק האם הארגון מוגן.

??? tip "תאר תהליך Incident Response — מה השלבים?"
    **6 שלבים (NIST):** 1) **Preparation** — תוכניות, כלים, תרגול 2) **Detection & Analysis** — זיהוי האירוע, הבנת החומרה 3) **Containment** — בלימה מיידית (Short-term: ניתוק, Long-term: Patch) 4) **Eradication** — הסרת התוקף לחלוטין 5) **Recovery** — שחזור מערכות, ניטור מוגבר 6) **Lessons Learned** — הפקת לקחים, שיפור תהליכים. **קריטי:** תיעוד כל שלב, שמירת Evidence לצרכים משפטיים.

??? tip "מה זה Threat Hunting ואיך שונה מ-Monitoring רגיל?"
    **Monitoring** = מגיב להתראות. SIEM מפיק Alert, אנליסט חוקר. **Threat Hunting** = חיפוש יזום. מתחילים מ**השערה** ("אני חושב שיש תוקף שמשתמש ב-Living off the Land") ומחפשים ראיות בלוגים ובנתונים. **למה חשוב:** תוקפים מתקדמים (APT) נמנעים מלהפעיל Alerts. Threat Hunting מוצא מה ש-SIEM מפספס.

??? tip "מה זה SIEM ולמה צריך אותו?"
    SIEM = Security Information and Event Management. **מה עושה:** 1) אוסף לוגים ממערכות שונות (Servers, Firewalls, EDR, Applications) 2) מנרמל ומתאם (Correlate) אירועים 3) מפעיל Rules לזיהוי איומים 4) מייצר התראות ל-SOC. **למה צריך:** בלי SIEM, כל לוג הוא בנפרד. עם SIEM אפשר לראות ש-Login Failed ב-Server A + Port Scan מ-IP X + File Download ב-Server B = התקפה מתואמת.

??? tip "הסבר Defense in Depth — מה העקרון?"
    **שכבות הגנה מרובות**, כל אחת עוצרת סוג שונה של איום. **אנלוגיה:** טירה עם חפיר, חומה, שומרים ומנעולים. אם התוקף חוצה את החפיר, יש עוד חומה. **שכבות:** Perimeter (Firewall, WAF) → Network (Segmentation, IDS) → Host (EDR, Patching) → Application (Input Validation) → Data (Encryption, Access Control). **הרעיון:** אף שכבה אחת לא מושלמת, אבל ביחד הן יוצרות הגנה חזקה.

??? tip "מה זה Attack Surface ואיך מצמצמים אותו?"
    Attack Surface = כל נקודת כניסה שתוקף יכול לנצל. **צמצום:** 1) סגירת פורטים מיותרים 2) הסרת שירותים שלא בשימוש 3) Patch Management קבוע 4) Network Segmentation 5) Least Privilege 6) הגבלת External-facing Services. **דוגמה:** S3 Bucket פתוח לציבור = Attack Surface מיותר. הגבלת גישה ל-IAM ספציפי = צמצום.

??? tip "מה ההבדל בין Vulnerability Scan ל-Penetration Test?"
    **Vulnerability Scan:** אוטומטי, כלי כמו Nessus/Qualys סורק ומדווח על חולשות ידועות (CVEs). **מהיר, רחב, שטחי.** **Penetration Test:** ידני + אוטומטי, בודק חדירה מנסה **לנצל** חולשות, לשרשר אותן, ולהגיע ליעד (למשל Domain Admin). **ממושך, ממוקד, עמוק.** Vulnerability Scan = "יש לך דלת לא נעולה." Pen Test = "נכנסתי דרך הדלת, הגעתי לכספת, ופתחתי אותה."

??? tip "איך מודדים את האפקטיביות של SOC?"
    **מדדים עיקריים:** 1) **MTTD** (Mean Time to Detect) — זמן ממוצע לזיהוי איום 2) **MTTR** (Mean Time to Respond) — זמן ממוצע לתגובה 3) **False Positive Rate** — אחוז התראות שווא 4) **Coverage** — אחוז ATT&CK Techniques שיש להם Detection 5) **Dwell Time** — כמה זמן תוקף שוהה לפני זיהוי. **יעד:** MTTD ו-MTTR כמה שיותר קצרים, False Positive כמה שיותר נמוך.

## קישורים לנושאים אחרים

- [MITRE ATT&CK](mitre-attck.md) — המסגרת שמשמשת Red ו-Blue Teams למפות טכניקות התקפה והגנה
- [Credentials](credentials.md) — Brute Force על סיסמאות הוא אחד הווקטורים הנפוצים שצוותי Red בודקים
- [Sandbox](sandbox.md) — מנגנוני Isolation שצוותי Blue מיישמים כדי לצמצם נזק מפריצות
- [אבטחה ו-ML](security-and-ml.md) — ML עוזר ל-Blue Team בזיהוי אנומליות ול-Red Team ביצירת Adversarial Attacks
