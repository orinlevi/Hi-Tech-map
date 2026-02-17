# 🏁 מדריך CTF — Capture The Flag

> **CTF — המקום היחיד שבו לפרוץ למחשבים זה ספורט לגיטימי.**
> ואם הפסדתם, לפחות למדתם משהו חדש.

---

## מה זה CTF?

Capture The Flag = תחרויות אבטחת מידע שבהן צריך למצוא "flags" (בדרך כלל טקסט כמו `flag{th1s_1s_4_fl4g}`).

---

## סוגי CTF

| סוג | איך זה עובד |
|-----|------------|
| **Jeopardy** | challenges בקטגוריות, כל challenge = flag |
| **Attack-Defense** | כל צוות מגן על שרת ותוקף אחרים |
| **King of the Hill** | שליטה על שרת כמה שיותר זמן |

---

## קטגוריות Jeopardy

### Web
```
SQL Injection, XSS, SSRF, authentication bypass, API abuse
כלים: Burp Suite, curl, developer tools
```

### Pwn (Binary Exploitation)
```
Buffer overflow, format string, ROP, heap exploitation
כלים: GDB, pwntools, Ghidra
```

### Crypto
```
RSA, AES, block cipher modes, hash collisions, padding oracle
כלים: Python, CyberChef, SageMath
```

### Forensics
```
Disk images, memory dumps, network captures, steganography
כלים: Autopsy, Volatility, Wireshark, binwalk
```

### Reverse Engineering
```
Disassembly, decompilation, anti-debugging, obfuscation
כלים: Ghidra, IDA Pro, GDB, radare2
```

### OSINT
```
חיפוש מידע ב-social media, metadata, geolocation
כלים: Google, Shodan, theHarvester
```

---

## פלטפורמות לתרגול

| פלטפורמה | רמה | חינם? |
|----------|-----|-------|
| **picoCTF** | מתחילים | ✅ |
| **TryHackMe** | מתחילים-בינוניים | חלקית |
| **HackTheBox** | בינוניים-מתקדמים | חלקית |
| **OverTheWire** | מתחילים (Linux) | ✅ |
| **pwn.college** | binary exploitation | ✅ |
| **CryptoHack** | crypto | ✅ |

---

## טיפים לCTF

!!! tip "איך לפתור challenges"
    1. **קראו את התיאור בקפידה** — רמזים חבויים
    2. **תבדקו את הבסיסי קודם** — source code, headers, robots.txt
    3. **חפשו patterns** — הצצה על ה-flag format, encoding
    4. **תתעדו** — כתבו writeup אחרי כל challenge
    5. **תעבדו בצוות** — כל אחד מתמחה בקטגוריה אחרת

---

## 🛤️ מאיפה מתחילים

1. **picoCTF** — מושלם למתחילים, challenges מובנים
2. **OverTheWire: Bandit** — Linux basics דרך CTF
3. **TryHackMe: Complete Beginner** — learning path מלא
4. **קטגוריה אחת** — תתמקדו ב-Web או Crypto קודם
5. **Writeups** — קראו writeups של אחרים, למדו methodology

!!! tip "לימוד אקדמי"
    CTF משלב **כל** התחומים: רשתות, מערכות הפעלה, אלגוריתמים, קריפטוגרפיה, Web.
    הדרך הכי טובה ללמוד אבטחת מידע היא **לעשות** — CTF הוא בדיוק זה.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מבוא לאבטחת מידע (0368-3065)
    - תכנות תחרותי (0368-3083)

---

## 💼 שאלות לראיון עבודה

??? tip "ספר/י על CTF challenge שפתרת."
    **תכינו סיפור!** תארו: מה הbug/vulnerability, איך זיהיתם, מה עשיתם, מה למדתם.
    מראה: חשיבה מתודולוגית, ידע טכני, יכולת לתקשר findings.

??? tip "מה ההבדל בין penetration testing ל-CTF?"
    **CTF** — challenges מוגדרים, flags ברורים, סביבה מבוקרת, ללא reporting.
    **Pentest** — real-world scope, methodology (PTES/OWASP), reporting, business context.
    CTF = לימוד skills. Pentest = שימוש ב-skills בעולם האמיתי.

??? tip "איזה כלים הכי חשובים לCTF?"
    **Web**: Burp Suite, developer tools, curl/httpie.
    **Pwn**: GDB + pwntools, Ghidra.
    **Crypto**: Python, CyberChef, SageMath.
    **Forensics**: Wireshark, Volatility, binwalk.
    **כולם**: Linux command line, Python scripting.
