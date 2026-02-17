# 🕵️ Threat Intelligence עם ML/NLP

> **Threat Intelligence — לדעת מה התוקפים מתכננים לפני שהם מתכננים.**

---

## מה זה Threat Intelligence?

CTI (Cyber Threat Intelligence) = איסוף, ניתוח, והפצה של מידע על איומים.

### רמות
- **Strategic** — מגמות, תוקפים, motivations (C-level)
- **Tactical** — TTPs (MITRE ATT&CK mapping) (SOC managers)
- **Operational** — campaigns, IOCs (SOC analysts)
- **Technical** — IPs, hashes, domains (automated tools)

---

## NLP ל-Threat Reports

```python
# חילוץ IOCs מדוחות
import re

def extract_iocs(text):
    ips = re.findall(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', text)
    hashes = re.findall(r'\b[a-f0-9]{32,64}\b', text)
    domains = re.findall(r'\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b', text)
    return {"ips": ips, "hashes": hashes, "domains": domains}

# NER למושגים מ-CTI
# "APT28 used Zebrocy backdoor targeting NATO members"
# → Entity: APT28 (threat actor), Zebrocy (malware), NATO (target)
```

---

## STIX/TAXII

- **STIX** — Structured Threat Information eXpression (format)
- **TAXII** — Trusted Automated eXchange (transport protocol)
- Together: standard way to share threat intelligence between organizations

---

## ML Applications

| שימוש | טכניקה |
|-------|--------|
| IOC extraction | NER, regex |
| Report classification | Text classification |
| Threat actor profiling | Clustering, similarity |
| Dark web monitoring | NLP, topic modeling |
| Predictive intelligence | Time series, graph analysis |

---

## 🛤️ מאיפה מתחילים

1. **MITRE ATT&CK** — framework חובה
2. **STIX/TAXII** — standards
3. **NLP basics** — NER, classification
4. **OSINT tools** — Shodan, Maltego, theHarvester
5. **Threat reports** — קראו דוחות של Mandiant, CrowdStrike, Microsoft

!!! tip "לימוד אקדמי"
    **קורסים**: NLP/עיבוד שפה טבעית, אבטחת מידע, רשתות מחשבים, מדעי הנתונים.

---

## 💼 שאלות לראיון עבודה

??? tip "מה זה MITRE ATT&CK?"
    מסגרת שממפה TTPs (Tactics, Techniques, Procedures) של תוקפים.
    14 tactics (Initial Access → Exfiltration), מאות techniques.
    שימוש: detection rules, threat hunting, red team planning.

??? tip "מה זה STIX ו-TAXII?"
    **STIX** = format לתיאור threat intelligence (JSON-based).
    **TAXII** = protocol להחלפת STIX data בין ארגונים.
    ביחד = שיתוף automated של IOCs ו-TTPs.

??? tip "איך NLP משמש ב-Threat Intelligence?"
    IOC extraction (NER), report classification, dark web monitoring,
    threat actor profiling, automated MITRE ATT&CK mapping.
