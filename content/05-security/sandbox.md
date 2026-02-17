# Sandbox

## למה זה חשוב

דמיינו שאתם מריצים קוד שקיבלתם מהאינטרנט — ואין לכם מושג מה הוא עושה. בלי Sandbox, הקוד הזה יכול לגשת לכל קובץ במחשב, לשלוח מידע לשרת מרוחק, או למחוק את כל הדיסק.

**Sandboxing** הוא העיקרון שאומר: הרץ קוד לא מהימן בסביבה מבודדת, כך שגם אם הוא זדוני — הוא לא יכול לפגוע בשאר המערכת. זה אחד מעקרונות הבסיס של אבטחת מידע מודרנית.

!!! quote "החוק הראשון של Sandboxing"
    "כל קוד שלא כתבת בעצמך הוא קוד עוין — כולל הקוד שכתבת בעצמך לפני שנה."

## רעיונות מרכזיים

### מהו Sandbox?

Sandbox הוא **סביבת הרצה מבודדת** שמגבילה את המשאבים והפעולות שתהליך יכול לבצע.

```text
┌─────────────────────────────────────────┐
│            מערכת ההפעלה                  │
│                                         │
│  ┌─────────────┐   ┌─────────────┐      │
│  │  Sandbox A  │   │  Sandbox B  │      │
│  │ ┌─────────┐ │   │ ┌─────────┐ │      │
│  │ │ Process │ │   │ │ Process │ │      │
│  │ └─────────┘ │   │ └─────────┘ │      │
│  │ 🔒 מבודד   │   │ 🔒 מבודד   │      │
│  └─────────────┘   └─────────────┘      │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  File System, Network, Kernel    │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### דוגמאות ל-Sandboxing בפועל

**Browser Sandbox:**

- כל Tab בדפדפן רץ בתהליך (Process) נפרד
- JavaScript של אתר אחד לא יכול לגשת לנתונים של Tab אחר
- גישה ל-File System חסומה — אתר לא יכול לקרוא קבצים מהמחשב

**Container Isolation (Docker):**

- כל Container רואה רק את ה-File System שלו
- Namespaces מפרידים בין תהליכים, רשת ומשתמשים
- cgroups מגבילים CPU, זיכרון ו-I/O

!!! note "Container לא VM"
    Container חולק את ה-Kernel עם ה-Host, בניגוד ל-Virtual Machine שמריצה מערכת הפעלה שלמה. זה אומר שה-Isolation ב-Container חלש יותר מ-VM, אבל הביצועים טובים יותר.

**מנגנונים נוספים:**

- **chroot** — מגביל תהליך לתיקייה מסוימת ב-File System
- **seccomp** — מגביל אילו System Calls תהליך יכול לבצע
- **AppArmor / SELinux** — מדיניות אבטחה ברמת ה-Kernel
- **gVisor** — Kernel ברמת User-space שמוסיף שכבת Isolation לפני הגישה ל-Host Kernel
- **Firecracker** — microVM של AWS, שילוב של מהירות Container עם Isolation של VM

### Sandbox ברמת מערכת ההפעלה — מנגנונים מפורטים

```text
┌────────────────────────────────────────────────────┐
│                Linux Sandbox Stack                  │
│                                                    │
│  ┌──────────────┐                                  │
│  │  Application │                                  │
│  └──────┬───────┘                                  │
│         │                                          │
│  ┌──────▼───────┐  Namespaces:                     │
│  │  Namespaces  │  ├── PID  — תהליכים מבודדים      │
│  │              │  ├── NET  — רשת מבודדת            │
│  └──────┬───────┘  ├── MNT  — File System מבודד    │
│         │          ├── USER — משתמשים מבודדים       │
│  ┌──────▼───────┐  └── IPC  — תקשורת בין-תהליכית   │
│  │   cgroups    │                                  │
│  │ (CPU, Mem,   │  cgroups:                        │
│  │  I/O limits) │  ├── cpu.max = 50%               │
│  └──────┬───────┘  ├── memory.max = 256MB          │
│         │          └── io.max = 10MB/s             │
│  ┌──────▼───────┐                                  │
│  │   seccomp    │  seccomp:                        │
│  │ (syscall     │  ├── ALLOW: read, write, open    │
│  │  filter)     │  └── DENY: mount, reboot, ptrace │
│  └──────┬───────┘                                  │
│         │                                          │
│  ┌──────▼───────┐                                  │
│  │   Kernel     │                                  │
│  └──────────────┘                                  │
└────────────────────────────────────────────────────┘
```

### Principle of Least Privilege

??? tip "העיקרון שצריך להנחות כל החלטת אבטחה"
    **תן לכל תהליך/משתמש את ההרשאות המינימליות** שנדרשות לביצוע המשימה — ולא יותר.

    - שרת Web צריך לקרוא קבצי HTML? תן לו גישת קריאה **רק** לתיקייה הרלוונטית
    - Script שמגבה מסד נתונים? תן לו הרשאת `SELECT` בלבד, לא `DROP TABLE`
    - אפליקציית Mobile? בקש הרשאות GPS רק כשהמשתמש באמת צריך מפה

```text
❌ שגוי:   chmod 777 /var/www    (כולם יכולים לקרוא, לכתוב ולהריץ)
✅ נכון:   chmod 644 /var/www    (בעלים כותב, אחרים רק קוראים)
```

!!! warning "Root/Admin — רק כשבאמת חייבים"
    הרצת תהליכים כ-Root היא מתכון לאסון. אם תוקף משתלט על תהליך שרץ כ-Root, יש לו שליטה מלאה על המכונה. תמיד השתמשו ב-User מוגבל ותנו הרשאות ספציפיות.

!!! quote "על Root ואחריות"
    "עם Root גדול באה אחריות גדולה. ובד"כ — טעויות גדולות. `rm -rf /` לא שואל פעמיים."

### שכבות של Isolation

| שכבה | מה מבודד | דוגמה | Overhead | חוזק Isolation |
|------|----------|-------|----------|----------------|
| **Process** | זיכרון בין תהליכים | כל Tab בדפדפן | נמוך מאוד | חלש |
| **Container** | File System, רשת, PIDs | Docker Container | נמוך | בינוני |
| **microVM** | Kernel מינימלי | Firecracker, Kata | בינוני | טוב |
| **VM** | מערכת הפעלה שלמה | EC2 Instance | גבוה | חזק |
| **Hardware** | חומרה פיזית | שרת ייעודי | גבוה מאוד | מקסימלי |

ככל שעולים בשכבות — ה-Isolation חזק יותר, אבל ה-Overhead גבוה יותר.

### Container Security — איומים והגנות

```text
┌──────────────────────────────────────────────────┐
│           Container Attack Surface                │
│                                                  │
│  ⚠️ Image Vulnerabilities                        │
│     └── Base Image עם חולשות ידועות              │
│                                                  │
│  ⚠️ Container Escape                             │
│     └── ניצול חולשת Kernel לבריחה מה-Container   │
│                                                  │
│  ⚠️ Insecure Configuration                       │
│     └── הרצה כ-Root, Capabilities מיותרים        │
│                                                  │
│  ⚠️ Supply Chain                                 │
│     └── Image ממקור לא מהימן                     │
│                                                  │
│  ⚠️ Secrets in Image                             │
│     └── API Keys ו-Passwords ב-Image Layers     │
└──────────────────────────────────────────────────┘
```

**הגנות:**

| איום | הגנה | כלים |
|------|------|------|
| Image Vulnerabilities | סריקת Images | Trivy, Snyk, Grype |
| Container Escape | עדכוני Kernel, gVisor | Falco לניטור |
| Insecure Config | Non-root user, drop capabilities | OPA / Kyverno |
| Supply Chain | חתימה ואימות Images | Cosign, Notary |
| Secrets in Image | Secrets Management חיצוני | Vault, Sealed Secrets |

### Sandbox Escape — כשהבידוד נשבר

??? danger "Case Study: Container Escape CVE-2019-5736 (runc)"
    **מה קרה:** חולשה ב-runc (ה-Runtime של Docker) אפשרה לתהליך בתוך Container לדרוס את ה-runc Binary של ה-Host. ברגע שתהליך חדש הושק — הקוד של התוקף רץ עם הרשאות Host.

    **למה זה חמור:** כל Container שרץ על Docker היה פגיע. תוקף שקיבל גישה ל-Container יכול היה לצאת ממנו ולהשתלט על ה-Host.

    **לקחים:**

    1. Container Isolation הוא לא מושלם — תמיד יש Kernel shared
    2. עדכוני Runtime (runc, containerd) קריטיים
    3. שכבות הגנה נוספות (gVisor, Kata) מצמצמות סיכון

??? danger "Case Study: Chrome Sandbox Escape"
    **מה קרה:** חולשות Zero-Day ב-Chrome אפשרו לתוקפים "לברוח" מה-Sandbox של ה-Renderer Process ולהריץ קוד על מחשב הקורבן.

    **למה זה קורה:** ה-Sandbox של Chrome מסתמך על מנגנוני OS. חולשה ב-OS (למשל ב-Windows kernel) יכולה לאפשר Escape.

    **שרשרת ההתקפה:**

    ```text
    1. JavaScript Exploit → Code Execution ב-Renderer
    2. Sandbox Escape   → יציאה מה-Sandbox
    3. Privilege Escal.  → הרשאות מערכת
    4. Payload           → הרצת Malware
    ```

    **מחיר ב-Bug Bounty:** Google משלם עד $250,000 על Sandbox Escape — מה שמעיד על החומרה.

### Application-Level Sandboxing

לא רק OS — גם אפליקציות מיישמות Sandboxing:

**WebAssembly (WASM):**

```text
┌──────────────────────────────────────┐
│  Browser / Runtime                    │
│  ┌────────────────────────────┐      │
│  │  WASM Sandbox              │      │
│  │  ┌──────────────────────┐  │      │
│  │  │  WASM Module         │  │      │
│  │  │  - Linear Memory only│  │      │
│  │  │  - No direct syscalls│  │      │
│  │  │  - No file access    │  │      │
│  │  └──────────────────────┘  │      │
│  │  Only imports/exports API  │      │
│  └────────────────────────────┘      │
└──────────────────────────────────────┘
```

**Java Security Manager (deprecated ב-Java 17):**

- הגבלת File I/O, Network, Reflection
- הוחלף ב-Modules System ומנגנונים חדשים

**macOS App Sandbox:**

- כל אפליקציה מ-App Store חייבת לרוץ ב-Sandbox
- גישה ל-Files, Camera, Microphone דורשת Entitlements מפורשים

!!! quote "על Sandboxing ב-macOS"
    "macOS App Sandbox — כי אפל לא סומכת על המפתחים, והמפתחים לא סומכים על המשתמשים, והמשתמשים לא סומכים על אף אחד."

### Defense in Depth — שכבות הגנה

```text
┌─────────────────────────────────────────────┐
│  🌐 Network Firewall                        │
│  ┌───────────────────────────────────────┐  │
│  │  🖥️ Host Security (SELinux, Updates)  │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  🐳 Container Isolation         │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │  🔐 Application Security  │  │  │  │
│  │  │  │  ┌─────────────────────┐  │  │  │  │
│  │  │  │  │  🗝️ Data Encryption │  │  │  │  │
│  │  │  │  └─────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

כל שכבה שנפרצת → השכבה הבאה עוצרת את התוקף
```

!!! note "Defense in Depth בפועל"
    אל תסתמכו על שכבת הגנה אחת. אם Firewall נפרץ — Container Isolation עוצר. אם Container נפרץ — Host Security עוצר. כל שכבה נוספת מקטינה את הסיכוי שתוקף יגיע ליעד.

## בלבולים נפוצים

- **"Container = אבטחה מלאה"** — Container מספק Isolation ברמה טובה, אבל הוא לא בלתי חדיר. Kernel Exploits יכולים לפרוץ מ-Container ל-Host. לאבטחה קריטית, שלבו עם VM.
- **"Sandbox מונע את כל ההתקפות"** — Sandbox מגביל נזק, אבל לא מונע את ההתקפה עצמה. קוד זדוני עדיין יכול לרוץ בתוך ה-Sandbox.
- **"Browser Sandbox עובד רק ב-Chrome"** — כל הדפדפנים המודרניים משתמשים ב-Sandboxing. Chrome היה מהראשונים, אבל Firefox, Edge ו-Safari כולם מיישמים מנגנונים דומים.
- **"Docker מספיק בשביל Multi-Tenancy"** — אם כל Tenant רץ ב-Container על אותו Host, Container Escape של Tenant אחד חושף את כולם. ל-Multi-Tenancy אמיתי צריך VM Isolation או microVM כמו Firecracker.
- **"Sandbox = ביצועים גרועים"** — תלוי בשכבה. Process-level Sandboxing (כמו ב-Browser) כמעט לא מורגש. VM Isolation כן דורש Overhead, אבל עם VT-x/AMD-V ה-Overhead קטן משמעותית.

## דוגמה קטנה

הדגמה של Isolation באמצעות Docker — נריץ תהליך שיכול לגשת רק לתיקייה אחת:

```dockerfile
# Dockerfile
FROM python:3.11-slim

# יוצרים User מוגבל (לא Root!)
RUN useradd --create-home appuser

# מעתיקים רק את מה שצריך
COPY app.py /home/appuser/app.py

# עוברים ל-User המוגבל
USER appuser
WORKDIR /home/appuser

# התהליך רואה רק את /home/appuser
CMD ["python", "app.py"]
```

```bash
# הרצה עם הגבלות נוספות
docker run \
  --read-only \            # File System לקריאה בלבד
  --memory=128m \          # מקסימום 128MB זיכרון
  --cpus=0.5 \             # חצי CPU
  --network=none \         # בלי גישה לרשת
  --security-opt=no-new-privileges \  # מניעת Privilege Escalation
  --cap-drop=ALL \         # הסרת כל ה-Linux Capabilities
  my-sandboxed-app
```

??? tip "מה קורה אם הקוד בתוך ה-Container מנסה לגשת לרשת?"
    עם `--network=none`, כל ניסיון לפתוח חיבור רשת ייכשל. התהליך מבודד לחלוטין מהעולם החיצוני.

### דוגמה מתקדמת — seccomp Profile

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "syscalls": [
    {
      "names": ["read", "write", "open", "close", "stat", "fstat",
                "mmap", "mprotect", "brk", "exit_group"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

```bash
# הרצה עם seccomp Profile מותאם
docker run --security-opt seccomp=profile.json my-app
```

??? tip "למה Seccomp חשוב?"
    Linux Kernel חושף מאות System Calls. רוב האפליקציות משתמשות רק בעשרות מהם. seccomp מאפשר לחסום את כל ה-syscalls שהאפליקציה לא צריכה — כך שגם אם תוקף מריץ קוד בתוך ה-Container, הוא מוגבל ביכולת לתקשר עם ה-Kernel.

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מערכות הפעלה — processes, namespaces, cgroups, security mechanisms
    - אבטחת מידע — isolation, defense in depth, privilege escalation

    **קורסים מומלצים:**
    - ארכיטקטורת מחשבים — hardware-level isolation, virtualization
    - רשתות מחשבים — network isolation, firewalls

    **ידע מעשי:**
    - Docker — container security, non-root users, seccomp profiles
    - Linux security — namespaces, cgroups, capabilities
    - gVisor / Firecracker — advanced sandboxing
    - Falco — runtime security monitoring

    **מתוכנית הלימודים שלך ב-TAU:**
    - מערכות הפעלה (0368-2162)
    - מבוא לאבטחת מידע (0368-3065)

---

## 🛤️ מאיפה מתחילים

```text
שלב 1: הבסיס
├── להבין מה Sandbox עושה ולמה צריך אותו
├── להכיר את ההבדל בין Process, Container ו-VM
└── להבין Principle of Least Privilege

שלב 2: Docker Security
├── לכתוב Dockerfile עם Non-root User
├── להשתמש ב-read-only filesystem
├── להבין Namespaces ו-cgroups
└── לסרוק Images עם Trivy

שלב 3: מנגנונים מתקדמים
├── seccomp Profiles
├── AppArmor / SELinux
├── gVisor ו-Firecracker
└── Network Policies ב-Kubernetes

שלב 4: ארכיטקטורה
├── Defense in Depth — שכבות הגנה
├── Multi-Tenancy Isolation
├── Zero Trust + Sandboxing
└── Runtime Security Monitoring (Falco)
```

**כלים מומלצים להתנסות:**

- **Docker** — התחילו עם `docker run --rm -it --read-only alpine sh`
- **Trivy** — סריקת Container Images לחולשות
- **Falco** — ניטור Runtime של Containers
- **gVisor** — הריצו Container עם Kernel מבודד
- **Kata Containers** — microVM Isolation ל-Containers

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Container ל-VM מבחינת Isolation?"
    **VM:** מריצה מערכת הפעלה שלמה עם Kernel נפרד. ה-Hypervisor מבודד את ה-VMs זו מזו ברמת החומרה. **Container:** חולק את ה-Kernel של ה-Host, ומשתמש ב-Namespaces ו-cgroups לבידוד. **תוצאה:** VM מספק Isolation חזק יותר (Kernel שונה), אבל Container קל יותר (פחות Overhead). לסביבות Multi-Tenant רגישות — VM או microVM (Firecracker). לרוב השימושים — Container עם הקשחה מספיק.

??? tip "מה זה Container Escape ואיך מתגוננים?"
    Container Escape = תוקף שמצליח "לברוח" מתוך ה-Container ולהריץ קוד על ה-Host. **סיבות נפוצות:** Kernel Exploits (Container חולק Kernel עם Host), Misconfiguration (הרצה כ-Root, Privileged mode), Mounted Docker Socket. **הגנות:** 1) Non-root user 2) Drop capabilities 3) seccomp profiles 4) Read-only filesystem 5) gVisor/Kata לשכבת Kernel נוספת 6) עדכוני Kernel קבועים.

??? tip "הסבר Namespaces ו-cgroups — מה ההבדל?"
    **Namespaces** מספקים **Isolation** — מה התהליך רואה. PID Namespace = רואה רק תהליכים שלו. NET Namespace = רשת מבודדת. MNT Namespace = File System מבודד. **cgroups** מספקים **הגבלת משאבים** — כמה התהליך יכול לצרוך. CPU, Memory, I/O, Network bandwidth. בקיצור: Namespaces = מה אני רואה, cgroups = כמה אני מקבל.

??? tip "מה זה Principle of Least Privilege ותן דוגמה?"
    כל Process/User מקבל **רק** את ההרשאות המינימליות שנדרשות למשימה. **דוגמאות:** 1) Web Server — גישת קריאה בלבד לתיקיית Static Files 2) Backup Script — SELECT בלבד ב-DB, לא DROP 3) CI/CD Pipeline — Push ל-Registry ספציפי, לא גישה ל-Production DB 4) Container — Non-root, capabilities מינימליים. **למה חשוב:** אם תוקף משתלט על Service עם Least Privilege, הנזק מוגבל.

??? tip "איך תאבטח Container ב-Production?"
    **Checklist:** 1) Base Image מינימלי (Alpine/Distroless) 2) Non-root USER ב-Dockerfile 3) Read-only filesystem (`--read-only`) 4) Drop ALL capabilities, add רק מה שצריך 5) seccomp profile 6) Network Policy מגביל 7) סריקת Images ב-CI/CD (Trivy) 8) Resource limits (CPU, Memory) 9) לא להריץ `--privileged` לעולם 10) לא למעלות Docker Socket ל-Container 11) Runtime monitoring (Falco).

??? tip "מה זה Defense in Depth ואיך מיישמים?"
    Defense in Depth = שכבות הגנה מרובות, כל אחת עוצרת סוג שונה של התקפה. **שכבות:** Network (Firewall, WAF) → Host (OS Hardening, Updates) → Container (Isolation, seccomp) → Application (Input Validation, AuthN/AuthZ) → Data (Encryption at Rest/Transit). **הרעיון:** אם שכבה אחת נפרצת, הבאה עוצרת. תוקף צריך לעבור את **כל** השכבות כדי להגיע ליעד.

??? tip "מתי כדאי להשתמש ב-gVisor/Firecracker במקום Docker רגיל?"
    **gVisor** — כשצריך Isolation חזק יותר מ-Container רגיל אבל Overhead של VM גדול מדי. gVisor מריץ Kernel ב-User-space שמסנן syscalls. **Firecracker** — ל-Multi-Tenancy (כמו AWS Lambda) שבו Tenants לא אמורים לראות זה את זה בשום מקרה. microVM עם זמן אתחול של ~125ms. **כלל אצבע:** Trust boundary = VM/microVM. אותו צוות = Container מספיק.

??? tip "מה זה Immutable Infrastructure ואיך קשור ל-Sandboxing?"
    Immutable Infrastructure = שרתים/Containers לא מעדכנים — מחליפים. במקום לעדכן Container רץ, בונים Image חדש ומחליפים. **קשר ל-Sandboxing:** 1) Read-only filesystem — אין אפשרות לשנות קבצים ב-Runtime 2) Reproducibility — כל Instance זהה 3) אם תוקף שינה משהו — ה-Container הבא יהיה נקי. **כלים:** Immutable Containers + GitOps (ArgoCD, Flux).

## קישורים לנושאים אחרים

- [Credentials](credentials.md) — גם עם Sandbox, ניהול נכון של Credentials הוא קריטי כשכבת הגנה נוספת
- [Red, Blue & Purple Teams](red-blue-purple.md) — צוותי Red Team מנסים לפרוץ מ-Sandboxes כחלק מבדיקות חדירה
- [Docker](../04-systems/docker.md) — הכלי הנפוץ ביותר ל-Container Isolation בסביבות פיתוח ו-Production
- [MITRE ATT&CK](mitre-attck.md) — Execution ו-Defense Evasion כוללים טכניקות של Sandbox Escape
- [אבטחה ו-ML](security-and-ml.md) — הרצת מודלי ML בסביבה מבודדת למניעת Model Extraction
