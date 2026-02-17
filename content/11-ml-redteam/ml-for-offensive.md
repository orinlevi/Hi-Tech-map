# ML כנשק התקפי -- איך אלגוריתמים תוקפים

## למה זה חשוב

עד לפני כמה שנים, תוקפי סייבר נדרשו לכתוב כל Exploit ידנית, לסרוק רשתות בעצמם, ולהשקיע שעות באיסוף מודיעין. היום, **Machine Learning הפך את התוקף לאוטומטי, מהיר ומדויק יותר מכל אדם**. אם אתם חושבים שהתוקף שלכם חכם, חכו עד שהוא יהיה GPT עם Root access.

הבנת השימוש ההתקפי ב-ML חיונית משני כיוונים:

- **כמגינים** -- אם לא תבינו את הכלים של התוקף, לא תוכלו להתגונן מפניהם
- **כחוקרי אבטחה** -- הכלים האלה הם חלק מארגז הכלים המודרני של כל Red Team
- **כחוקרי ML** -- צריך להבין איך המודלים שלכם יכולים להפוך לנשק

!!! warning "אזהרה אתית"
    כל מה שמתואר כאן הוא למטרות לימוד, מחקר אקדמי ו-Red Teaming מורשה בלבד. שימוש בטכניקות אלו ללא אישור מהווה עבירה פלילית.

## רעיונות מרכזיים

### Automated Vulnerability Discovery -- גילוי פגיעויות אוטומטי

במקום שחוקר אבטחה ישב ויחפש באגים ידנית, ML יכול לסרוק קוד ולזהות דפוסי פגיעות:

```text
גישה מסורתית:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  חוקר קורא  │ --> │  מזהה דפוס  │ --> │  כותב PoC   │
│  קוד מקור   │     │  חשוד       │     │  ידני       │
└──────────────┘     └──────────────┘     └──────────────┘
      שעות                דקות                שעות

גישה עם ML:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  מודל מנתח  │ --> │  מסווג      │ --> │  מייצר PoC  │
│  מיליוני    │     │  פגיעויות   │     │  אוטומטית   │
│  שורות קוד  │     │  בשניות     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
      דקות               שניות              שניות
```

**טכניקות מרכזיות:**

- **Code Pattern Recognition** -- אימון מודל לזהות דפוסי קוד פגיעים (Buffer Overflow, SQL Injection, XSS)
- **Graph Neural Networks לניתוח קוד** -- ייצוג קוד כגרף (AST, Control Flow Graph) וזיהוי מבנים חשודים
- **Sequence Models** -- שימוש ב-Transformers לניתוח קוד כטקסט וזיהוי פגיעויות סמנטיות

```python
# דוגמה פשוטה: סיווג קוד פגיע עם Embedding
import torch
import torch.nn as nn

class VulnDetector(nn.Module):
    """מודל פשוט לזיהוי פגיעויות בקוד"""
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True,
                           bidirectional=True)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim * 2, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 4)  # 4 סוגי פגיעויות
        )

    def forward(self, x):
        embedded = self.embedding(x)
        lstm_out, _ = self.lstm(embedded)
        # שימוש ב-hidden state האחרון
        features = lstm_out[:, -1, :]
        return self.classifier(features)

# הקטגוריות:
# 0 = Safe, 1 = Buffer Overflow, 2 = SQL Injection, 3 = XSS
```

### ML-Guided Fuzzing -- Fuzzing חכם עם רשתות נוירונים

Fuzzing הוא שיטה למציאת באגים ע"י הזנת קלטים אקראיים לתוכנה. ML הופך את זה מ"אקראי" ל"חכם":

```text
Fuzzing מסורתי (Dumb Fuzzing):
┌────────────┐     ┌──────────┐     ┌──────────┐
│  קלט       │ --> │ תוכנה   │ --> │ Crash?   │
│  אקראי     │     │ נבדקת   │     │ כן/לא   │
└────────────┘     └──────────┘     └──────────┘
   מיליוני           רוב              מעט
   ניסיונות          לא עוברים        Crashes
                     Parsing

ML-Guided Fuzzing:
┌────────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Neural    │ --> │ קלט     │ --> │ תוכנה   │ --> │ Coverage │
│  Network   │     │ מותאם   │     │ נבדקת   │     │ Feedback │
│  Generator │     │ (חכם)   │     │         │     │          │
└────────────┘     └──────────┘     └──────────┘     └──────────┘
      ^                                                   │
      └───────────────── Reward Signal ───────────────────┘
```

!!! note "למה ML-Guided Fuzzing עדיף?"
    Fuzzer מסורתי מייצר קלטים אקראיים -- רובם לא מגיעים לחלקים מעניינים בקוד. ML לומד את **מבנה הקלט** ומייצר קלטים שעוברים Parsing אבל חוקרים נתיבי קוד חדשים. התוצאה: **כיסוי קוד גבוה יותר, יותר באגים, פחות זמן**.

**כלים מרכזיים:**

| כלי | גישה | יתרון |
|------|-------|--------|
| **Neuzz** | Neural Network + Gradient-guided mutation | מכוון מוטציות לפי Gradient של הרשת |
| **FuzzGAN** | GAN ליצירת קלטים | מייצר קלטים ריאליסטיים שעוברים Validation |
| **MTFuzz** | Multi-task learning | לומד מכמה יעדים במקביל |
| **DeepFuzz** | Seq2Seq לייצור קלטים | לומד את הגרמטיקה של פורמט הקלט |

```python
# רעיון מרכזי: שימוש ב-Gradient כדי לכוון Fuzzing
import numpy as np

class NeuralFuzzer:
    """Fuzzer שמשתמש ברשת נוירונים ל-Mutation Strategy"""

    def __init__(self, model, seed_corpus):
        self.model = model       # מודל שמנבא Coverage
        self.corpus = seed_corpus
        self.coverage_map = set()

    def mutate_with_gradient(self, seed_input):
        """מוטציה מונחית Gradient -- משנים בייטים
        שצפויים להגדיל Coverage"""
        # חישוב Gradient של Coverage ביחס לקלט
        input_tensor = torch.FloatTensor(seed_input).requires_grad_(True)
        predicted_coverage = self.model(input_tensor)
        predicted_coverage.backward()

        # מוטציה בבייטים עם Gradient גבוה
        gradients = input_tensor.grad.numpy()
        top_positions = np.argsort(np.abs(gradients))[-10:]

        mutated = seed_input.copy()
        for pos in top_positions:
            mutated[pos] = np.random.randint(0, 256)
        return mutated
```

### Automated Exploit Generation -- יצירת Exploits אוטומטית

!!! danger "הנקודה שבה ML הופך למפחיד באמת"
    כשמודל שפה יכול לא רק **למצוא** פגיעות אלא גם **לכתוב** את ה-Exploit שמנצל אותה -- המשחק משתנה לחלוטין.

**DARPA Cyber Grand Challenge (CGC):**

ב-2016, DARPA ערכה תחרות שבה מערכות אוטומטיות לחלוטין התחרו בזיהוי פגיעויות, כתיבת Exploits ותיקון קוד -- ללא התערבות אנושית:

```text
Cyber Grand Challenge -- הזירה:
┌─────────────────────────────────────────────┐
│  מערכת אוטונומית (CRS)                     │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Analyze │->│ Exploit  │->│ Patch     │  │
│  │ Binary  │  │ Generate │  │ & Deploy  │  │
│  └─────────┘  └──────────┘  └───────────┘  │
│       │                          │          │
│       │    ┌──────────────┐      │          │
│       └--->│ Defend Own   │<─────┘          │
│            │ Services     │                 │
│            └──────────────┘                 │
└─────────────────────────────────────────────┘
```

**LLMs ככותבי Exploits:**

מודלי שפה גדולים (LLMs) מסוגלים:

- **לנתח CVE** ולהבין את הפגיעות
- **לכתוב PoC** (Proof of Concept) על בסיס תיאור הפגיעות
- **להתאים Exploit** קיים למטרה ספציפית
- **לכתוב Shellcode** מותאם אישית

```python
# דוגמה קונספטואלית: LLM-based Exploit Generator
# (לא קוד עובד -- להדגמת הרעיון בלבד)

class LLMExploitAssistant:
    """שימוש ב-LLM לניתוח פגיעויות ויצירת PoC"""

    def analyze_vulnerability(self, cve_description, source_code):
        prompt = f"""
        Analyze the following vulnerability:
        CVE: {cve_description}

        Affected code:
        {source_code}

        Provide:
        1. Root cause analysis
        2. Attack vector
        3. Exploitation constraints
        4. Proof-of-concept skeleton
        """
        return self.llm.generate(prompt)

    def generate_payload(self, vuln_type, target_arch):
        """יצירת Payload מותאם לארכיטקטורה"""
        prompt = f"""
        Generate a {vuln_type} payload for {target_arch}.
        Requirements:
        - Null-byte free
        - Position independent
        - Minimal size
        """
        return self.llm.generate(prompt)
```

??? warning "המגבלות של LLMs ב-Exploit Generation"
    LLMs לא מושלמים בכתיבת Exploits:

    - **הזיות** -- עלולים לייצר Exploits שלא עובדים
    - **ידע לא מעודכן** -- לא מכירים CVEs חדשים
    - **חוסר הבנה עמוקה** -- לא באמת "מבינים" Assembly או Memory Layout
    - **Guardrails** -- רוב ה-LLMs המסחריים מסרבים לכתוב Exploits

    עם זאת, הם **מצוינים** כעוזרים לחוקרי אבטחה מנוסים.

### Deepfakes ו-Social Engineering מונע AI

Social Engineering הוא וקטור ההתקפה הנפוץ ביותר, ו-AI מעלה אותו לרמה חדשה:

```text
Social Engineering מסורתי:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  תוקף כותב │ --> │  אימייל     │ --> │  קורבן      │
│  אימייל     │     │  Phishing   │     │  לוחץ       │
│  ידנית      │     │  גנרי      │     │  (אולי)     │
└──────────────┘     └──────────────┘     └──────────────┘
                        1 אימייל               ~5% הצלחה

Social Engineering עם AI:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  LLM מנתח  │ --> │  אלפי       │ --> │  קורבנות    │
│  פרופיל     │     │  אימיילים   │     │  לוחצים     │
│  הקורבן     │     │  מותאמים    │     │  (הרבה)     │
│  + כותב     │     │  אישית     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                        אלפי אימיילים          ~30% הצלחה
```

**Deepfakes להנדסה חברתית:**

| סוג Deepfake | טכנולוגיה | שימוש התקפי |
|--------------|-----------|-------------|
| **Voice Cloning** | Text-to-Speech + Voice Transfer | התחזות לבוס בטלפון ("העבר כסף עכשיו!") |
| **Face Swap** | GAN / Diffusion Models | Video call מזויף עם "מנכ"ל החברה" |
| **Text Generation** | LLMs (GPT, Claude, etc.) | אימיילי Phishing מותאמים אישית |
| **Document Forgery** | Image Generation | מסמכים מזויפים (חשבוניות, הזמנות) |

!!! example "מקרה אמיתי: Voice Deepfake"
    ב-2019, תוקפים השתמשו ב-Voice Deepfake כדי להתחזות למנכ"ל חברת אנרגיה בריטית ולשכנע עובד להעביר $243,000. העובד היה בטוח שהוא מדבר עם הבוס שלו -- הקול היה כמעט זהה.

### AI-Powered Phishing -- פישינג ברמה אחרת

```python
# דוגמה קונספטואלית: AI Spear-Phishing Pipeline
class AIPhishingEngine:
    """מנוע Phishing מבוסס ML -- למטרות Red Team מורשה בלבד"""

    def reconnaissance(self, target_email):
        """שלב 1: איסוף מודיעין אוטומטי"""
        info = {
            'linkedin': self.scrape_linkedin(target_email),
            'github': self.scrape_github(target_email),
            'twitter': self.scrape_social(target_email),
            'company': self.scrape_company_info(target_email)
        }
        return info

    def generate_personalized_email(self, target_info):
        """שלב 2: יצירת אימייל מותאם אישית"""
        prompt = f"""
        Write a professional email to {target_info['name']},
        who works as {target_info['role']}
        at {target_info['company']}.
        Reference their recent post about {target_info['recent_topic']}.
        Include a link to a 'relevant whitepaper'.
        Tone: Professional, urgent but not alarming.
        """
        return self.llm.generate(prompt)

    def adapt_based_on_response(self, interaction_history):
        """שלב 3: התאמה דינמית לפי תגובת הקורבן"""
        # RL Agent שלומד מהצלחות/כישלונות
        return self.rl_agent.select_next_action(interaction_history)
```

### Automated Reconnaissance -- סיור אוטומטי

ML משנה את שלב ה-Reconnaissance מקצה לקצה:

```text
Reconnaissance Pipeline עם ML:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  1. OSINT Collection (NLP)                          │
│     ├── Social Media Analysis                        │
│     ├── Job Posting Analysis (→ tech stack)          │
│     └── Code Repository Mining                       │
│                                                      │
│  2. Network Mapping (Graph Neural Networks)          │
│     ├── Subdomain Discovery                          │
│     ├── Service Fingerprinting                       │
│     └── Topology Inference                           │
│                                                      │
│  3. Attack Surface Prioritization (Classification)   │
│     ├── Vulnerability Probability Scoring            │
│     ├── Exploitability Assessment                    │
│     └── High-Value Target Identification             │
│                                                      │
│  4. Attack Path Planning (Reinforcement Learning)    │
│     ├── Optimal Entry Point Selection                │
│     ├── Lateral Movement Planning                    │
│     └── Objective Prioritization                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

??? tip "OSINT + NLP = מודיעין אוטומטי"
    NLP (Natural Language Processing) מאפשר לנתח אלפי מסמכים, פוסטים ומשרות עבודה כדי לבנות תמונה מלאה של הארגון המותקף:

    - **Job Postings** → Technology Stack (פרסמו משרת Kubernetes Engineer? כנראה שיש Kubernetes)
    - **Social Media** → עובדים, מבנה ארגוני, תרבות
    - **GitHub Repos** → קוד, Dependencies, Secrets שנשכחו
    - **Conference Talks** → טכנולוגיות פנימיות שנחשפו בטעות

### ML-Based Password Cracking -- פיצוח סיסמאות עם ML

במקום Brute Force או Dictionary Attack, ML לומד את **הדפוסים** שבני אדם משתמשים ביצירת סיסמאות:

```text
Traditional Cracking:
Dictionary: ["password", "123456", "admin", ...]
→ בודק כל מילה ברשימה → איטי, מוגבל

ML-Based Cracking (PassGAN):
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Generator  │ --> │  מייצר      │ --> │  בודק מול   │
│  (Neural    │     │  סיסמאות    │     │  Hash        │
│   Network)  │     │  "אנושיות"  │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       ^                                        │
       └──── Discriminator Feedback ────────────┘
```

**PassGAN** -- GAN לייצור סיסמאות:

$$G: z \sim \mathcal{N}(0,1) \rightarrow \text{password candidate}$$
$$D: \text{password} \rightarrow [0,1] \quad \text{(real or generated)}$$

המודל לומד שבני אדם נוטים ל:
- להתחיל באות גדולה
- לסיים במספר או סימן (`!`, `1`)
- להחליף אותיות: `a→@`, `e→3`, `s→$`
- להשתמש בתאריכים, שמות ומילים נפוצות

```python
# רעיון: GAN לייצור סיסמאות
import torch
import torch.nn as nn

class PasswordGenerator(nn.Module):
    """Generator שלומד דפוסי סיסמאות אנושיות"""
    def __init__(self, latent_dim=128, max_len=16, charset_size=95):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(256),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(512),
            nn.Linear(512, max_len * charset_size),
        )
        self.max_len = max_len
        self.charset_size = charset_size

    def forward(self, z):
        output = self.model(z)
        # Reshape ל-[batch, max_len, charset_size]
        output = output.view(-1, self.max_len, self.charset_size)
        # Softmax על כל תו
        return torch.softmax(output, dim=-1)
```

### DeepExploit -- Reinforcement Learning ל-Penetration Testing

**DeepExploit** הוא כלי שמשתמש ב-Reinforcement Learning כדי לבחור אוטומטית Exploits מ-Metasploit:

```text
DeepExploit Architecture:
┌───────────────────────────────────────────┐
│  RL Agent                                 │
│  ┌──────────┐    ┌────────────────────┐  │
│  │  State   │ -> │  Policy Network    │  │
│  │  (target │    │  (Deep Q-Network)  │  │
│  │  info)   │    │                    │  │
│  └──────────┘    └────────┬───────────┘  │
│                           │               │
│              Action: Select Exploit       │
│                           │               │
│                    ┌──────▼──────┐        │
│                    │ Metasploit  │        │
│                    │ Framework   │        │
│                    └──────┬──────┘        │
│                           │               │
│              Reward: Shell/No Shell       │
└───────────────────────────────────────────┘
```

**State Space:**
- פורטים פתוחים
- שירותים וגרסאות
- מערכת הפעלה
- Exploit History (מה כבר ניסינו)

**Action Space:**
- בחירת Exploit Module
- בחירת Payload
- קביעת פרמטרים

**Reward:**
- Shell → +1.0
- Session → +0.5
- No result → 0
- Crash → -0.5

### ההשלכות האתיות

```text
The Dual-Use Dilemma:
┌───────────────────────────────────────────┐
│                                           │
│    אותה טכנולוגיה בדיוק                  │
│                                           │
│    ┌─────────────┐   ┌─────────────┐     │
│    │  Red Team   │   │  Black Hat  │     │
│    │  מורשה     │   │  פושע      │     │
│    │  ✅ חוקי   │   │  ❌ פלילי  │     │
│    └─────────────┘   └─────────────┘     │
│                                           │
│    ML Fuzzer         ML Fuzzer            │
│    → מוצא באגים     → מוצא 0-days       │
│      ומתקן            ומנצל              │
│                                           │
│    AI Phishing       AI Phishing          │
│    → מודעות          → גניבת             │
│      ותרגול            מידע              │
│                                           │
└───────────────────────────────────────────┘
```

!!! warning "קו אדום: שימוש אתי בלבד"
    ההבדל בין חוקר אבטחה לפושע הוא **אישור**. כל שימוש בכלים אלה חייב להיות:

    1. **מורשה** -- עם אישור כתוב מבעל המערכת
    2. **מוגדר היקף** -- Scope ברור של מה מותר לתקוף
    3. **מתועד** -- כל פעולה מתועדת לצורכי דו"ח
    4. **אחראי** -- Disclosure אחראי של ממצאים

## בלבולים נפוצים

- **"AI יחליף האקרים אנושיים לגמרי"** -- לא בקרוב. AI מצוין באוטומציה של משימות חוזרות, אבל Creativity וחשיבה מחוץ לקופסה עדיין דורשים אדם. AI הוא **Augmentation**, לא Replacement.
- **"כל LLM יכול לכתוב Exploits מיד"** -- רוב ה-LLMs המסחריים מסרבים, והתוצאות לא תמיד עובדות. צריך ידע עמוק כדי להשתמש בתוצאות נכון.
- **"ML Fuzzing תמיד עדיף על Fuzzing רגיל"** -- לא תמיד. Coverage-guided Fuzzing (כמו AFL++) עדיין מצוין בהרבה מקרים. ML מוסיף ערך כשמבנה הקלט מורכב.
- **"Deepfakes בלתי ניתנים לזיהוי"** -- יש טכנולוגיות זיהוי Deepfake שמשתפרות כל הזמן. מירוץ חימוש, כן, אבל לא חד-כיווני.
- **"PassGAN שובר כל סיסמה"** -- סיסמאות ארוכות ואקראיות באמת עדיין עמידות. PassGAN טוב נגד סיסמאות שבני אדם בוחרים, לא נגד מחרוזות אקראיות של 20+ תווים.

## דוגמה מעשית

Pipeline מלא של ML-assisted Red Team:

```python
# Red Team Pipeline with ML Components
class MLRedTeamPipeline:
    """
    Pipeline מלא ל-Red Team מבוסס ML.
    כל שלב משתמש ב-ML לאוטומציה ושיפור.
    """

    def __init__(self, target_org):
        self.target = target_org
        self.findings = []

    # שלב 1: Reconnaissance אוטומטי
    def ml_recon(self):
        """NLP + OSINT לאיסוף מודיעין"""
        tech_stack = self.analyze_job_postings()  # NLP
        employees = self.map_social_graph()       # Graph Analysis
        subdomains = self.ml_subdomain_enum()     # Seq2Seq
        return ReconReport(tech_stack, employees, subdomains)

    # שלב 2: Vulnerability Discovery
    def ml_vuln_scan(self, recon_report):
        """ML-Guided Scanning + Fuzzing"""
        vulns = []
        for service in recon_report.services:
            # סריקה חכמה שמתעדפת שירותים לפי Exploitability
            priority = self.vuln_priority_model.predict(service)
            if priority > 0.7:
                fuzz_results = self.neural_fuzzer.fuzz(service)
                vulns.extend(fuzz_results)
        return sorted(vulns, key=lambda v: v.severity, reverse=True)

    # שלב 3: Exploitation
    def ml_exploit(self, vulnerabilities):
        """RL-based Exploit Selection + LLM Payload Generation"""
        for vuln in vulnerabilities:
            # RL Agent בוחר את ה-Exploit הטוב ביותר
            exploit = self.rl_agent.select_exploit(vuln)
            # LLM מתאים את ה-Payload
            payload = self.llm.customize_payload(exploit, vuln.target)
            result = self.execute(exploit, payload)
            if result.success:
                self.findings.append(Finding(vuln, exploit, result))

    # שלב 4: Reporting
    def generate_report(self):
        """LLM-generated comprehensive report"""
        return self.llm.generate_pentest_report(self.findings)
```

??? tip "DeepExploit בפעולה"
    DeepExploit לומד מ-Metasploit ומשפר את בחירת ה-Exploit לאורך זמן:

    ```text
    Episode 1: Random exploit → Failed
    Episode 10: Better selection → Shell on port 445
    Episode 100: Optimal strategy → Full compromise in 3 steps
    Accuracy improvement: ~60% after 1000 episodes
    ```

    ה-Agent לומד ש:
    - Windows + Port 445 → EternalBlue (MS17-010) → גבוה
    - Linux + Port 22 → SSH Brute Force → נמוך (איטי)
    - Apache 2.4.49 → Path Traversal → CVE-2021-41773 → גבוה

## קישורים לנושאים אחרים

- [Neural Networks](../02-ml-core/neural-networks.md) -- הבסיס התיאורטי לכל המודלים ההתקפיים
- [MITRE ATT&CK](../05-security/mitre-attck.md) -- המסגרת שמסדרת את כל שלבי ההתקפה
- [Red, Blue & Purple Teams](../05-security/red-blue-purple.md) -- הצוותים שמשתמשים בכלים האלה
- [אבטחה ו-ML](../05-security/security-and-ml.md) -- הצד ההגנתי של ML באבטחה
- [Adversarial ML](adversarial-ml.md) -- לתקוף את ה-AI עצמו
- [Automated Pentesting](automated-pentesting.md) -- RL ו-LLMs לבדיקות חדירה

## מאיפה מתחילים

```text
מסלול לימוד מומלץ:
┌───────────────────────────────────────┐
│  1. בסיס ML                          │
│     ├── Python + PyTorch              │
│     ├── Neural Networks               │
│     └── Reinforcement Learning        │
│                                       │
│  2. בסיס אבטחה                       │
│     ├── Networking + Linux            │
│     ├── OWASP Top 10                  │
│     └── Metasploit Basics             │
│                                       │
│  3. ML + Security                     │
│     ├── ML-Guided Fuzzing papers      │
│     ├── DeepExploit (GitHub)          │
│     ├── DARPA CGC writeups            │
│     └── Adversarial ML course         │
│                                       │
│  4. פרויקטים מעשיים                  │
│     ├── בנו Neural Fuzzer             │
│     ├── אמנו PassGAN                  │
│     ├── CTF challenges עם ML          │
│     └── Red Team lab עם AI tools      │
└───────────────────────────────────────┘
```

**משאבים מומלצים:**

- **DARPA CGC Archive** -- קוד ומאמרים מהתחרות ההיסטורית
- **DeepExploit** -- קוד פתוח ב-GitHub, מצוין ללמידה
- **Offensive ML Playbook** -- אוסף טכניקות עם דוגמאות
- **SEC 595: Applied Data Science and AI/ML for Cybersecurity** -- קורס SANS מצוין

## שאלות לראיון עבודה

??? question "מה ההבדל בין Dumb Fuzzing ל-ML-Guided Fuzzing?"
    **Dumb Fuzzing** מייצר קלטים אקראיים לחלוטין -- רובם לא עוברים Parsing ולא מגיעים לקוד מעניין.

    **ML-Guided Fuzzing** לומד את מבנה הקלט ומכוון מוטציות לאזורים שצפויים להגדיל Code Coverage. הוא משתמש ב-Feedback (כמו Coverage Map) כ-Reward Signal כדי לשפר את הביצועים לאורך זמן.

    היתרון: כיסוי קוד גבוה יותר, יותר באגים בפחות זמן. החיסרון: תקורת חישוב גבוהה יותר, ו-Setup מורכב.

??? question "איך LLMs משנים את עולם ה-Red Teaming?"
    LLMs משפיעים בכמה מישורים:

    1. **Reconnaissance** -- ניתוח אוטומטי של מידע פתוח, כתיבת דו"חות
    2. **Social Engineering** -- יצירת אימיילי Phishing מותאמים אישית, בכל שפה, בכל סגנון
    3. **Exploit Development** -- עזרה בכתיבת PoCs, הסבר על פגיעויות, ניתוח קוד
    4. **Report Writing** -- יצירת דו"חות Pentest מפורטים אוטומטית

    המגבלה: LLMs מייצרים הזיות, לא תמיד מדויקים טכנית, ודורשים מומחה אנושי לוידוא.

??? question "מה הסיכונים בשימוש ב-AI לתקיפה, ואיך מתמודדים?"
    **סיכונים:**

    - **Dual-Use** -- אותם כלים שמשמשים Red Team משמשים גם פושעים
    - **Scale** -- AI מאפשר התקפות בקנה מידה שלא היה אפשרי קודם
    - **Attribution** -- קשה יותר לייחס התקפות כשהן אוטומטיות
    - **Deepfakes** -- שוחקים אמון במדיה ובתקשורת

    **התמודדות:**

    - Responsible Disclosure של כלים ומחקר
    - פיתוח כלי הגנה מבוססי AI במקביל
    - רגולציה (EU AI Act, NIST AI RMF)
    - Red Teaming אתי עם גבולות ברורים

??? question "תסביר את הארכיטקטורה של DeepExploit"
    DeepExploit משתמש ב-**Deep Q-Network (DQN)** בשילוב עם **Metasploit Framework**:

    1. **State** = מידע על המטרה (OS, ports, services, versions)
    2. **Action** = בחירת Exploit + Payload + Parameters מ-Metasploit
    3. **Reward** = +1 עבור Shell, +0.5 עבור Session, 0 עבור כישלון
    4. **Policy** = רשת נוירונים שמנבאת את ה-Q-value לכל Action

    ה-Agent לומד מניסיון: אחרי מאות Episodes, הוא לומד אילו Exploits עובדים נגד אילו שירותים, ומשפר את אחוז ההצלחה משמעותית.
