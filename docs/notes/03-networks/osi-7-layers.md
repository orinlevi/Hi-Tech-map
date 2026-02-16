# 7 שכבות OSI

## למה זה חשוב

מודל **OSI** (Open Systems Interconnection) הוא המפה של עולם הרשתות. הוא מחלק את התקשורת ברשת ל-7 שכבות, כל אחת אחראית על משהו אחר. כש-Developer צריך לעשות Debug לבעיית רשת, הוא צריך לדעת **באיזו שכבה הבעיה** -- אחרת הוא מחפש במקום הלא נכון.

## רעיונות מרכזיים

### 7 השכבות -- מלמטה למעלה

```
┌─────────────────────────────────────────┐
│  7. Application   │  HTTP, FTP, DNS     │  ◄── מה שאתם רואים
├───────────────────┼─────────────────────┤
│  6. Presentation  │  SSL/TLS, JSON, XML │  ◄── פורמט ותצוגה
├───────────────────┼─────────────────────┤
│  5. Session       │  Sockets, Sessions  │  ◄── ניהול חיבור
├───────────────────┼─────────────────────┤
│  4. Transport     │  TCP, UDP           │  ◄── אמינות העברה
├───────────────────┼─────────────────────┤
│  3. Network       │  IP, ICMP, Routing  │  ◄── ניתוב בין רשתות
├───────────────────┼─────────────────────┤
│  2. Data Link     │  Ethernet, MAC, ARP │  ◄── תקשורת בתוך רשת
├───────────────────┼─────────────────────┤
│  1. Physical      │  Cables, Wi-Fi, Hub │  ◄── חומרה פיזית
└─────────────────────────────────────────┘
```

### מה כל שכבה עושה -- בפשטות

| שכבה | שם | מה היא עושה | אנלוגיה |
|------|----|-------------|---------|
| **7** | Application | האפליקציה מתקשרת עם הרשת | אתם כותבים מכתב |
| **6** | Presentation | המרת פורמטים, הצפנה | מתרגמים את המכתב לשפה משותפת |
| **5** | Session | פתיחה וסגירה של שיחות | מרימים טלפון ומסיימים שיחה |
| **4** | Transport | חלוקה לחבילות, אמינות | דואר רשום -- וידוא שהגיע |
| **3** | Network | ניתוב -- איך להגיע ליעד | כתובת על המעטפה |
| **2** | Data Link | תקשורת בין מכשירים סמוכים | דוור שמעביר מבית לבית |
| **1** | Physical | ביטים על כבל או אוויר | הכביש עצמו |

### איפה חיים הפרוטוקולים הנפוצים?

!!! note "מיפוי פרוטוקולים לשכבות"
    - **Layer 7 (Application):** HTTP, HTTPS, FTP, SMTP, DNS
    - **Layer 4 (Transport):** TCP, UDP
    - **Layer 3 (Network):** IP (IPv4, IPv6), ICMP (ping)
    - **Layer 2 (Data Link):** Ethernet, Wi-Fi (802.11), ARP
    - **Layer 1 (Physical):** כבל Cat6, סיב אופטי, Wi-Fi radio

### דוגמה מעשית: מה קורה כששולחים HTTP Request?

```
אתם מקלידים https://example.com בדפדפן:

Layer 7: הדפדפן יוצר HTTP GET Request
Layer 6: ה-Request מוצפן עם TLS
Layer 5: נפתח Session (TCP connection)
Layer 4: ה-Data נחתך ל-Segments עם TCP headers
Layer 3: כל Segment עוטף ב-IP Packet עם כתובת יעד
Layer 2: כל Packet עוטף ב-Frame עם MAC address
Layer 1: הביטים נשלחים כאותות חשמליים/אלחוטיים

         ──── ונשלח לשרת ────

בשרת, התהליך הפוך: מ-Layer 1 עד Layer 7.
```

### למה השכבות חשובות ל-Debugging?

- **לא מצליח לגלוש?** תבדוק קודם Layer 1 -- הכבל מחובר? יש Wi-Fi?
- **Ping עובד אבל האתר לא נטען?** הבעיה ב-Layer 7 (Application), לא ב-Layer 3.
- **Connection Timeout?** כנראה בעיה ב-Layer 3/4 -- ניתוב או Firewall.
- **SSL Error?** Layer 6 -- בעיית Certificate.

??? tip "Tip ל-Debugging: תעבדו מלמטה למעלה"
    1. **Layer 1:** הכבל מחובר? יש Wi-Fi? (`ip link show`)
    2. **Layer 3:** יש IP? (`ip addr show`)
    3. **Layer 3:** מגיעים ליעד? (`ping 8.8.8.8`)
    4. **Layer 7:** DNS עובד? (`nslookup example.com`)
    5. **Layer 7:** HTTP עובד? (`curl example.com`)

## בלבולים נפוצים

- **"חייב לזכור את כל 7 השכבות בעל פה"** -- בפרקטיקה, רוב ה-Developers עובדים עם **4 שכבות** (מודל TCP/IP): Link, Internet, Transport, Application. מודל OSI הוא יותר תיאורטי.
- **"כל פרוטוקול שייך לשכבה אחת בלבד"** -- חלק מהפרוטוקולים חוצים שכבות. למשל, TLS עובד בין Layer 4 ל-Layer 7.
- **"שכבות 5 ו-6 הן סופר חשובות"** -- בפועל, ברוב המקרים, Application Layer (7) כולל גם את תפקידי Session ו-Presentation.

!!! warning "OSI vs TCP/IP -- אל תתבלבלו"
    מודל **OSI** הוא מודל תיאורטי עם 7 שכבות. מודל **TCP/IP** הוא מודל מעשי עם 4 שכבות. האינטרנט בפועל עובד לפי TCP/IP, אבל OSI משמש להסבר ולימוד.

## דוגמה קטנה

נניח שאתם שולחים בקשת HTTP מהמחשב שלכם לשרת:

```
שלב 1 -- אתם (Application Layer):
  "אני רוצה את דף הבית של example.com"
  → GET / HTTP/1.1

שלב 2 -- Transport Layer:
  TCP מפרק את ההודעה לחבילות:
  [Segment 1: "GET / HT"]  [Segment 2: "TP/1.1\r\n..."]
  כל Segment מקבל מספר סידורי (Sequence Number)

שלב 3 -- Network Layer:
  IP עוטף כל Segment:
  [Source: 192.168.1.5] [Dest: 93.184.216.34] [Data: Segment 1]

שלב 4 -- Data Link Layer:
  Ethernet עוטף כל Packet:
  [MAC src: AA:BB:CC:DD:EE:FF] [MAC dst: 11:22:33:44:55:66] [IP Packet]

שלב 5 -- Physical Layer:
  01101001 01001000... ← ביטים על הכבל
```

??? tip "טריק לזכור את הסדר"
    **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way
    Physical → Data Link → Network → Transport → Session → Presentation → Application

## קישורים לנושאים אחרים

- [Client-Server](client-server.md) -- מודל ה-Client-Server עובד בשכבה ה-7 (Application), אבל מסתמך על כל השכבות מתחת.
- [TCP/IP & HTTP](tcp-ip-http.md) -- צלילה עמוקה לפרוטוקולים של שכבות 3, 4, ו-7.
- [DNS & Ports](dns-ports.md) -- DNS עובד ב-Layer 7, ו-Ports שייכים ל-Layer 4.
