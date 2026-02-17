# 📡 התקפות רשת — MITM, Sniffing, Spoofing

> **"הרשת שלך מאובטחת? בוא נבדוק."** — כל pentester אי פעם.

!!! warning "אזהרה אתית"
    בצעו סריקות והתקפות **רק** על רשתות ומערכות שקיבלתם הרשאה מפורשת לבדוק.

---

## Reconnaissance — סריקה

### Nmap
```bash
# סריקת פורטים
nmap -sV -sC 192.168.1.0/24

# סריקה aggressive
nmap -A -T4 target.com

# סריקת UDP
nmap -sU --top-ports 100 target.com
```

---

## ARP Spoofing

```
Normal:  PC → Router (MAC: aa:bb:cc)
Attack:  PC → Attacker (MAC: xx:yy:zz, claims to be router)
Result:  All traffic goes through attacker → MITM
```

```bash
# arpspoof
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1
```

---

## Man-in-the-Middle (MITM)

```
Client ←→ Attacker ←→ Server
         ↑ reads/modifies traffic
```

כלים: Bettercap, mitmproxy, Ettercap.

### הגנה
- HTTPS everywhere
- Certificate pinning
- HSTS (HTTP Strict Transport Security)

---

## DNS Poisoning

```
User: "What's the IP of bank.com?"
Attacker: "It's 6.6.6.6!" (attacker's server)
User → Fake bank.com → credentials stolen
```

---

## WiFi Attacks

- **WPA2 Handshake Capture** — aircrack-ng + dictionary attack
- **Evil Twin** — fake AP with same SSID
- **Deauthentication** — force clients to reconnect (to your AP)

---

## 🛤️ מאיפה מתחילים

1. **TCP/IP** — הבנת פרוטוקולים (ראו section רשתות)
2. **Wireshark** — packet analysis
3. **Nmap** — network scanning
4. **TryHackMe/HackTheBox** — labs מעשיים
5. **Metasploit** — exploitation framework

!!! tip "לימוד אקדמי"
    **קורסים חובה**: רשתות מחשבים, מערכות הפעלה, אבטחת מידע.
    **ידע מעשי**: Linux networking, Wireshark, scripting (Python/Bash).

    **מתוכנית הלימודים שלך ב-TAU:**

    - רשתות תקשורת מחשבים (0368-3030)
    - מבוא לאבטחת מידע (0368-3065)

---

## 💼 שאלות לראיון עבודה

??? tip "הסבירו MITM attack."
    תוקף ממקם עצמו בין שני צדדים ומאזין/משנה תעבורה.
    דרכים: ARP spoofing, DNS poisoning, rogue WiFi AP.
    הגנות: HTTPS, certificate validation, HSTS, VPN.

??? tip "מה ההבדל בין active ל-passive reconnaissance?"
    **Passive** — איסוף מידע בלי לגעת ב-target (OSINT, DNS lookup, Shodan).
    **Active** — סריקה ישירה (nmap, vulnerability scanning). יכול להתגלות.

??? tip "איך עובד ARP Spoofing?"
    תוקף שולח ARP replies מזויפים שאומרים "אני ה-gateway".
    הנתב של הקורבן מתעדכן → תעבורה עוברת דרך התוקף.
