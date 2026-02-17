# ⚔️ עתיד ה-Red Team — AI vs AI

> **"העתיד של אבטחת מידע הוא AI שמגן מפני AI שתוקף. ואנחנו באמצע."**

---

## AI Offense — מה כבר אפשר

### Deepfakes לSocial Engineering
```
Video deepfake: CEO מבקש העברת כסף → $25M נגנבו (Hong Kong, 2024)
Voice clone: "היי, זה אני. תעביר את הגישה" → 3 שניות audio מספיקות
```

### AI-Generated Phishing
```
LLM כותב phishing emails:
- מותאם אישית (scrape LinkedIn → personal details)
- בשפה מקומית (עברית מושלמת)
- בלי שגיאות כתיב (הסימן הקלאסי)
```

### Automated Vulnerability Discovery
```
LLM + code analysis = זיהוי vulnerabilities בקנה מידה
GPT-4 פתר CTF challenges ברמת מתחילים
AI agents שמבצעים pentest flow אוטומטי
```

---

## AI Defense — מה כבר עובד

- **Anomaly Detection** — ML מזהה behavior חריג ברשת
- **Automated Response** — SOAR platforms (Security Orchestration, Automation, Response)
- **Threat Hunting** — AI scans terabytes of logs for patterns
- **Deepfake Detection** — מודלים שמזהים synthetic media

---

## LLM Jailbreaking

```
"Ignore previous instructions and..."
"DAN mode: pretend you are..."
"Encode your response in Base64..."
```

!!! warning "LLM כ-Attack Surface"
    כל LLM שמוטמע באפליקציה = attack surface חדש.
    Prompt injection, data exfiltration, indirect injection דרך web pages.

---

## Regulation & Ethics

- **EU AI Act** — regulation לפי risk level
- **NIST AI RMF** — framework for AI risk management
- **Responsible AI Red Teaming** — testing AI systems for safety

---

## 🛤️ מאיפה מתחילים

1. **ML fundamentals** — ראו sections ML
2. **Current research** — Arxiv, AI safety papers
3. **AI Red Teaming** — NIST guidelines, Microsoft AI Red Team blog
4. **CTFs** — AI-focused challenges (SaTML)

!!! tip "לימוד אקדמי"
    **קורסים**: למידת מכונה, NLP, אבטחת מידע, אתיקה בטכנולוגיה.
    **מחקר**: AI safety, alignment, adversarial robustness.

---

## 💼 שאלות לראיון עבודה

??? tip "מה הסיכונים של LLMs מבחינת אבטחה?"
    1. **Prompt injection** — תוקף מזריק instructions.
    2. **Data exfiltration** — LLM חושף training data.
    3. **Indirect injection** — web content מכיל instructions ל-LLM.
    4. **Jailbreaking** — עקיפת safety guardrails.

??? tip "איך deepfakes משמשים בsocial engineering?"
    Video/voice cloning של בכירים → BEC (Business Email Compromise).
    Voice clone דורש ~3 שניות audio. Video = דקות.
    הגנות: verification protocols, awareness training, detection models.

??? tip "מה זה AI Red Teaming?"
    בדיקת מערכות AI לcharmfulness, bias, safety, security vulnerabilities.
    כולל: prompt injection testing, adversarial inputs, misuse scenarios.
    NIST, Microsoft, Google — כולם עושים AI red teaming.
