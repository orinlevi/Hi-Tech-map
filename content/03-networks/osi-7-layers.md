# 7 שכבות OSI

## למה זה חשוב

מודל **OSI** (Open Systems Interconnection) הוא המפה של עולם הרשתות. הוא מחלק את התקשורת ברשת ל-7 שכבות, כל אחת אחראית על משהו אחר. כש-Developer צריך לעשות Debug לבעיית רשת, הוא צריך לדעת **באיזו שכבה הבעיה** -- אחרת הוא מחפש במקום הלא נכון.

(וכש-Developer ג'וניור אומר "האינטרנט לא עובד", ה-Senior שואל: "באיזו שכבה?")

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

??? tip "תרגום לעברית פשוטה"
    דמיינו שאתם שולחים חבילה מתל אביב לניו יורק. **שכבה 7** זה התוכן של החבילה. **שכבה 6** זה העטיפה (נגיד, בועתיות). **שכבה 5** זה שאתם מתקשרים ל-DHL ומזמינים שליח. **שכבה 4** זה DHL שמחלק את החבילה לקופסאות עם מספרי מעקב. **שכבה 3** זה הכתובת על הקופסא. **שכבה 2** זה הנהג שמעביר מסניף לסניף. **שכבה 1** זה הכביש עצמו. פשוט, לא?

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

### צלילה עמוקה: כל שכבה והפרוטוקולים שלה

#### Layer 1 -- Physical Layer

השכבה הפיזית עוסקת ב**ביטים** -- אפסים ואחדות שנשלחים כאותות חשמליים, אלחוטיים, או אופטיים.

| מדיום | טכנולוגיה | מהירות | שימוש |
|-------|-----------|--------|-------|
| **כבל נחושת** | Cat5e, Cat6, Cat6a | 1-10 Gbps | משרדים, בתים |
| **סיב אופטי** | Single/Multi-mode | 10-400 Gbps | Data Centers, ISP |
| **אלחוטי** | Wi-Fi 6 (802.11ax) | עד 9.6 Gbps | מובייל, בתים |
| **Bluetooth** | BLE 5.0 | עד 2 Mbps | IoT, אביזרים |

```
ביט על כבל נחושת:
──────────────────
    5V ┌──┐  ┌──┐     ┌──┐
       │  │  │  │     │  │
    0V ┘  └──┘  └─────┘  └──
       1  0  1  0  0  0  1  0   ← הביט-סטרים
```

!!! note "סיפור מהשטח"
    טכנאי רשת בילה שלושה ימים ב-Debug של בעיית רשת מסתורית. לקוחות ניתקו באופן אקראי. אחרי בדיקה מקיפה של כל השכבות, גילה שעכבר כרסם את כבל ה-Ethernet בתקרה. **תמיד תתחילו מ-Layer 1.** כן, גם ב-2026.

#### Layer 2 -- Data Link Layer

אחראית על תקשורת בין מכשירים **באותה רשת מקומית** (LAN). עובדת עם **MAC Addresses** -- כתובות ייחודיות שצרובות בכרטיס הרשת.

```
Ethernet Frame:
┌──────────┬──────────┬──────┬──────────┬─────┐
│ Preamble │ Dest MAC │ Src  │   Data   │ FCS │
│ (8 bytes)│ (6 bytes)│ MAC  │ (payload)│(CRC)│
└──────────┴──────────┴──────┴──────────┴─────┘

MAC Address: AA:BB:CC:DD:EE:FF
             ─────────  ─────────
             Manufacturer  Device ID
             (OUI)
```

**פרוטוקולים חשובים:**

- **Ethernet (802.3)** -- הסטנדרט לרשתות קוויות
- **Wi-Fi (802.11)** -- הסטנדרט לרשתות אלחוטיות
- **ARP** (Address Resolution Protocol) -- מתרגם IP → MAC Address
- **Switch** -- מכשיר שעובד ב-Layer 2, מעביר Frames לפי MAC Address

```bash
# לראות את ה-MAC Address שלכם:
ip link show        # Linux
ifconfig             # macOS
ipconfig /all       # Windows

# לראות את טבלת ה-ARP (IP ↔ MAC):
arp -a
```

#### Layer 3 -- Network Layer

אחראית על **ניתוב** (Routing) -- איך חבילה מגיעה מרשת אחת לרשת אחרת. עובדת עם **IP Addresses**.

```
IP Packet:
┌─────────┬──────┬──────┬──────┬─────────┐
│ Version │  TTL │Proto │ Src  │  Dest   │
│ (4/6)   │      │(TCP/ │  IP  │   IP    │
│         │      │ UDP) │      │         │
├─────────┴──────┴──────┴──────┴─────────┤
│              Payload (Data)             │
└─────────────────────────────────────────┘
```

**פרוטוקולים וכלים חשובים:**

- **IP** (Internet Protocol) -- כתובות ומשלוח חבילות
- **ICMP** -- הודעות שגיאה ו-Diagnostics (ping, traceroute)
- **Router** -- מכשיר Layer 3, מנתב בין רשתות

```bash
# Ping -- בדיקה בסיסית שאפשר להגיע ליעד (ICMP)
ping 8.8.8.8

# Traceroute -- מראה את כל ה-Hops בדרך ליעד
traceroute google.com     # macOS/Linux
tracert google.com        # Windows

# דוגמת פלט של traceroute:
# 1  192.168.1.1     1.2ms    ← הראוטר שלכם
# 2  10.0.0.1        5.3ms    ← ספק האינטרנט
# 3  72.14.215.85    12.1ms   ← Google backbone
# 4  142.250.80.46   15.8ms   ← השרת של Google
```

!!! note "סיפור מהשטח"
    **TTL (Time To Live)** הוא מספר שיורד ב-1 בכל Router. כשמגיע ל-0, החבילה נמחקת. בלי TTL, חבילה שנתקעת ב-loop יכולה להסתובב ברשת לנצח. דמיינו חבילה שעושה סיבוב בכיכר ולא מוצאת את היציאה -- TTL הוא המנגנון שאומר "אחרי 64 סיבובים, ביי ביי."

#### Layer 4 -- Transport Layer

אחראית על **אמינות ההעברה** וחלוקת נתונים ל-Segments. שני הפרוטוקולים העיקריים: **TCP** (אמין) ו-**UDP** (מהיר).

```
TCP Segment:
┌────────┬────────┬────────┬────────┬────────┐
│  Src   │  Dest  │  Seq   │  Ack   │ Flags  │
│  Port  │  Port  │ Number │ Number │(SYN/ACK│
│        │        │        │        │ FIN/RST│
├────────┴────────┴────────┴────────┴────────┤
│               Payload (Data)                │
└─────────────────────────────────────────────┘

UDP Datagram (פשוט יותר):
┌────────┬────────┬────────┬─────────────────┐
│  Src   │  Dest  │ Length │    Checksum     │
│  Port  │  Port  │        │                 │
├────────┴────────┴────────┴─────────────────┤
│               Payload (Data)                │
└─────────────────────────────────────────────┘
```

**TCP Flags שחשוב להכיר:**

| Flag | שם | תפקיד |
|------|----|--------|
| **SYN** | Synchronize | התחלת חיבור |
| **ACK** | Acknowledge | אישור קבלה |
| **FIN** | Finish | סיום חיבור מסודר |
| **RST** | Reset | סיום חיבור כפוי |
| **PSH** | Push | שלח מיד, אל תחכה |

#### Layer 5 -- Session Layer

מנהלת **Sessions** -- פתיחה, ניהול, וסגירה של "שיחות" בין אפליקציות. בפרקטיקה, שכבה זו מטושטשת ורוב התפקידים שלה נכללים ב-Layer 4 או Layer 7.

- **NetBIOS** -- שמות מחשבים ברשת Windows
- **RPC** (Remote Procedure Call) -- הפעלת פונקציות על מחשב מרוחק
- **SOCKS** -- Proxy protocol

??? tip "תרגום לעברית פשוטה"
    שכבה 5 היא כמו מארגנת אירועים. היא לא עושה את העבודה בעצמה -- היא רק מוודאת שכולם מגיעים, שהשיחה מתנהלת, ושבסוף כולם נפרדים. בפרקטיקה, בעולם ה-TCP/IP, היא כמעט לא מופיעה כשכבה נפרדת. אבל בראיונות עבודה היא כן מופיעה, אז הכירו אותה.

#### Layer 6 -- Presentation Layer

אחראית על **פורמט הנתונים** -- הצפנה, דחיסה, קידוד:

- **TLS/SSL** -- הצפנת תקשורת
- **JSON, XML, YAML** -- פורמטי Serialization
- **JPEG, PNG, MP4** -- קידוד מדיה
- **Base64** -- קידוד בינארי לטקסט
- **gzip, Brotli** -- דחיסה

#### Layer 7 -- Application Layer

השכבה שאתם, כ-Developers, הכי מכירים. הפרוטוקולים שהאפליקציות משתמשות בהם:

| פרוטוקול | Port | שימוש |
|----------|------|-------|
| **HTTP/HTTPS** | 80/443 | אתרי אינטרנט, APIs |
| **DNS** | 53 | תרגום שמות דומיין |
| **FTP/SFTP** | 21/22 | העברת קבצים |
| **SMTP** | 25/587 | שליחת מיילים |
| **IMAP/POP3** | 143/110 | קבלת מיילים |
| **SSH** | 22 | גישה מרוחקת מוצפנת |
| **DHCP** | 67/68 | הקצאת כתובות IP |
| **SNMP** | 161/162 | ניהול וניטור רשת |
| **MQTT** | 1883 | IoT messaging |

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

### Encapsulation -- כל שכבה עוטפת את הקודמת

```
Layer 7-5:  [HTTP Data                                    ]
Layer 4:    [TCP Header][HTTP Data                        ]
Layer 3:    [IP Header ][TCP Header][HTTP Data            ]
Layer 2:    [ETH Header][IP Header ][TCP Header][HTTP Data][ETH Trailer]
Layer 1:    01101001 01001000 01010100 01010000...

כל שכבה מוסיפה Header (ולפעמים Trailer) משלה.
זה נקרא Encapsulation.

בצד המקבל, כל שכבה "מפשיטה" את ה-Header שלה.
זה נקרא Decapsulation.
```

---

## ניתוח Packets עם Wireshark -- מ-Layer 1 עד Layer 7

### מה זה Wireshark?

**Wireshark** הוא הכלי הכי נפוץ לניתוח תעבורת רשת. הוא "מריח" (sniff) את כל ה-Packets שעוברים בכרטיס הרשת ומציג אותם בצורה ברורה, מחולקים לשכבות OSI.

```
Wireshark Capture -- מה רואים:
──────────────────────────────
┌─────────────────────────────────────────────────────────┐
│ No. │ Time    │ Source      │ Dest       │ Protocol│Info│
├─────┼─────────┼────────────┼────────────┼─────────┼────┤
│ 1   │ 0.000   │ 192.168.1.5│ 93.184.216 │ TCP     │SYN │
│ 2   │ 0.023   │ 93.184.216 │ 192.168.1.5│ TCP     │S-A │
│ 3   │ 0.024   │ 192.168.1.5│ 93.184.216 │ TCP     │ACK │
│ 4   │ 0.025   │ 192.168.1.5│ 93.184.216 │ TLS     │CH  │
│ 5   │ 0.048   │ 93.184.216 │ 192.168.1.5│ TLS     │SH  │
│ 6   │ 0.050   │ 192.168.1.5│ 93.184.216 │ HTTP    │GET │
│ 7   │ 0.072   │ 93.184.216 │ 192.168.1.5│ HTTP    │200 │
└─────────────────────────────────────────────────────────┘
Packets 1-3: TCP Three-Way Handshake
Packets 4-5: TLS Handshake
Packets 6-7: HTTP Request/Response
```

### Wireshark Display Filters שחייבים לדעת

```
# סינון לפי פרוטוקול
http
dns
tcp
tls

# סינון לפי כתובת IP
ip.addr == 192.168.1.5
ip.src == 192.168.1.5
ip.dst == 93.184.216.34

# סינון לפי Port
tcp.port == 443
tcp.dstport == 80

# סינון לפי TCP Flags
tcp.flags.syn == 1
tcp.flags.reset == 1

# סינון מורכב
http.request.method == "POST" && ip.dst == 10.0.0.1
dns.qry.name contains "google"
tcp.analysis.retransmission
```

### תרגיל מעשי: לכדו TCP Handshake

```bash
# 1. פתחו Wireshark (או tcpdump בשורת פקודה)
sudo tcpdump -i any -c 20 host example.com -w capture.pcap

# 2. בטרמינל אחר, שלחו בקשה
curl https://example.com

# 3. פתחו את capture.pcap ב-Wireshark
wireshark capture.pcap

# 4. סננו: tcp.flags.syn == 1
#    תראו את ה-SYN ו-SYN-ACK של ה-Handshake
```

??? tip "תרגום לעברית פשוטה"
    Wireshark זה כמו מכשיר רנטגן לרשת. הוא מראה לכם בדיוק מה עובר בצינורות. אם אי פעם תרגישו שאתם לא מבינים מה קורה ברשת -- **תפתחו Wireshark. הוא תמיד אומר את האמת**, גם כשה-Error Messages משקרים.

!!! note "סיפור מהשטח"
    מפתח Backend דיווח שה-API שלו "עובד מושלם", אבל ה-Frontend צוות טען שהתשובות איטיות. פתחו Wireshark וגילו **TCP Retransmissions** -- חבילות שנשלחו שוב ושוב בגלל Packet Loss ברשת. הבעיה לא היתה בקוד, היא היתה ב-Layer 4. **Wireshark הפך ויכוח של שעה לתיקון של 5 דקות.**

---

## Network Troubleshooting Flowchart

כשיש בעיית רשת, עבדו **מלמטה למעלה**:

```
┌─────────────────────────────────────────────────────┐
│           Network Troubleshooting Flowchart          │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  Layer 1:       │
                │  כבל מחובר?     │    ip link show
                │  Wi-Fi דלוק?   │    iwconfig
                └───────┬────────┘
                   כן   │
                         ▼
                ┌────────────────┐
                │  Layer 2:       │
                │  יש IP?        │    ip addr show
                │  DHCP עובד?    │    dhclient -v
                └───────┬────────┘
                   כן   │
                         ▼
                ┌────────────────┐
                │  Layer 3:       │
                │  מגיעים ל-GW?  │    ping 192.168.1.1
                │  מגיעים החוצה? │    ping 8.8.8.8
                └───────┬────────┘
                   כן   │
                         ▼
                ┌────────────────┐
                │  Layer 4:       │
                │  Port פתוח?    │    telnet host 443
                │  Firewall?     │    nc -zv host 443
                └───────┬────────┘
                   כן   │
                         ▼
                ┌────────────────┐
                │  Layer 7:       │
                │  DNS עובד?     │    nslookup example.com
                │  HTTP עובד?    │    curl -v example.com
                │  TLS תקין?     │    openssl s_client -connect host:443
                └────────────────┘
```

### פקודות Debug חיוניות -- סיכום

| שכבה | בעיה | פקודה | מה היא עושה |
|------|------|-------|-------------|
| **L1** | אין חיבור פיזי | `ip link show` | בודק אם ה-Interface פעיל |
| **L2** | אין MAC/IP | `arp -a` | מראה טבלת ARP |
| **L3** | לא מגיע ליעד | `ping 8.8.8.8` | בודק נגישות IP |
| **L3** | ניתוב שבור | `traceroute host` | מראה את הנתיב |
| **L3** | ניתוב מקומי | `ip route show` | מראה טבלת ניתוב |
| **L4** | Port חסום | `nc -zv host 443` | בודק אם Port פתוח |
| **L4** | TCP בעיות | `ss -tuln` | מראה Ports פתוחים |
| **L7** | DNS שבור | `dig example.com` | בודק DNS Resolution |
| **L7** | HTTP שבור | `curl -v url` | שולח HTTP Request מפורט |
| **L7** | TLS שבור | `openssl s_client` | בודק Certificate |

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

---

## OSI vs TCP/IP -- שני מודלים, מציאות אחת

```
     OSI Model              TCP/IP Model
  ┌──────────────┐       ┌──────────────┐
  │ 7.Application│       │              │
  ├──────────────┤       │  Application │
  │ 6.Presentation│      │  (HTTP, DNS, │
  ├──────────────┤       │   FTP, SSH)  │
  │ 5. Session   │       │              │
  ├──────────────┤       ├──────────────┤
  │ 4. Transport │       │  Transport   │
  │              │       │  (TCP, UDP)  │
  ├──────────────┤       ├──────────────┤
  │ 3. Network   │       │  Internet    │
  │              │       │  (IP, ICMP)  │
  ├──────────────┤       ├──────────────┤
  │ 2. Data Link │       │  Network     │
  ├──────────────┤       │  Access      │
  │ 1. Physical  │       │  (Ethernet)  │
  └──────────────┘       └──────────────┘
   7 שכבות                4 שכבות
   תיאורטי                מעשי
   למידה                   מימוש
```

| | OSI | TCP/IP |
|---|---|---|
| **שכבות** | 7 | 4 |
| **מטרה** | מודל תיאורטי לימודי | מודל מעשי שהאינטרנט משתמש בו |
| **פותח ע"י** | ISO | DARPA (מחלקת ההגנה של ארה"ב) |
| **יתרון** | מפורט, מחולק היטב | פשוט, מעשי |
| **חיסרון** | מורכב, שכבות 5-6 מטושטשות | פחות granularity |

## בלבולים נפוצים

- **"חייב לזכור את כל 7 השכבות בעל פה"** -- בפרקטיקה, רוב ה-Developers עובדים עם **4 שכבות** (מודל TCP/IP): Link, Internet, Transport, Application. מודל OSI הוא יותר תיאורטי.
- **"כל פרוטוקול שייך לשכבה אחת בלבד"** -- חלק מהפרוטוקולים חוצים שכבות. למשל, TLS עובד בין Layer 4 ל-Layer 7.
- **"שכבות 5 ו-6 הן סופר חשובות"** -- בפועל, ברוב המקרים, Application Layer (7) כולל גם את תפקידי Session ו-Presentation.
- **"Encapsulation זה רק תיאוריה"** -- Encapsulation זה מה שקורה **בפועל** בכל Packet. כל שכבה מוסיפה Header. זו לא אבסטרקציה, זו המציאות. Wireshark מראה את זה בבירור.
- **"מודל TCP/IP מחליף את OSI"** -- לא. OSI משמש להסבר ולימוד, TCP/IP למימוש. הם משלימים.

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

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - רשתות מחשבים — OSI model, TCP/IP stack, protocols
    - מערכות הפעלה — networking stack, sockets, I/O

    **קורסים מומלצים:**
    - אבטחת רשתות — protocol vulnerabilities, packet analysis
    - מערכות מבוזרות — distributed networking, routing

    **ידע מעשי:**
    - Wireshark — packet capture and analysis
    - tcpdump — command-line packet analysis
    - ping, traceroute, dig, curl — network debugging tools

    **מתוכנית הלימודים שלך ב-TAU:**
    - רשתות תקשורת מחשבים (0368-3030)

---

## 🛤️ מאיפה מתחילים

1. **שננו את 7 השכבות** -- השתמשו ב-Mnemonic ("Please Do Not Throw Sausage Pizza Away") ותבינו מה כל שכבה עושה ברמה כללית.

2. **התמקדו ב-4 השכבות המעשיות** -- Layer 2 (Ethernet/MAC), Layer 3 (IP/Routing), Layer 4 (TCP/UDP/Ports), Layer 7 (HTTP/DNS). אלה ה-90% שתצטרכו ביום-יום.

3. **תרגלו עם כלי שורת פקודה** -- `ping`, `traceroute`, `dig`, `curl -v`, `ss -tuln`. הריצו אותם וקראו את הפלט. תפסיקו לפחד מ-Terminal.

4. **התקינו Wireshark** -- לכדו תעבורה של גלישה רגילה. סננו לפי TCP, HTTP, DNS. ראו את ה-Three-Way Handshake, את ה-TLS Handshake, ואת ה-HTTP Request. **אין תחליף לראות Packets אמיתיים.**

5. **בנו שרת פשוט** -- הקימו שרת HTTP (Node.js/Python), הפעילו Wireshark, ושלחו בקשות. ראו כל שכבה בפעולה.

6. **קראו על מודל TCP/IP** -- הבינו את ההבדל בין המודל התיאורטי (OSI) למודל המעשי (TCP/IP). דעו להסביר את שניהם.

7. **תרגלו Debugging** -- שברו דברים בכוונה (שנו DNS, חסמו Port ב-Firewall) ותנסו לאבחן מאיזו שכבה הבעיה. ככה לומדים באמת.

!!! tip "משאבים מומלצים"
    - **Wireshark** (wireshark.org) -- הורידו והתחילו ללכוד Packets
    - **"Computer Networking: A Top-Down Approach"** (Kurose & Ross) -- ספר מעולה שמתחיל מ-Layer 7 ויורד למטה
    - **Professor Messer** (YouTube) -- הסברים ויזואליים מצוינים על OSI
    - **Subnet Calculator** (subnet-calculator.com) -- לתרגול חישובי Subnetting

---

## 💼 שאלות לראיון עבודה

??? tip "הסבירו את 7 שכבות OSI. מה כל שכבה עושה?"
    **Layer 1 (Physical)** -- העברת ביטים על מדיום פיזי (כבלים, Wi-Fi). **Layer 2 (Data Link)** -- תקשורת בין מכשירים באותה רשת (MAC addresses, Ethernet). **Layer 3 (Network)** -- ניתוב בין רשתות (IP addresses, Routing). **Layer 4 (Transport)** -- אמינות העברה (TCP/UDP, Ports). **Layer 5 (Session)** -- ניהול Sessions (פתיחה/סגירה של חיבורים). **Layer 6 (Presentation)** -- פורמטים, הצפנה, דחיסה (TLS, JSON). **Layer 7 (Application)** -- פרוטוקולי אפליקציה (HTTP, DNS, FTP).

??? tip "מה ההבדל בין מודל OSI למודל TCP/IP?"
    **OSI** הוא מודל **תיאורטי** עם 7 שכבות, שפותח על ידי ISO. **TCP/IP** הוא מודל **מעשי** עם 4 שכבות, שפותח על ידי DARPA והאינטרנט בפועל עובד לפיו. ההבדל העיקרי: TCP/IP ממזג את שכבות 5-7 של OSI לשכבת Application אחת, וממזג את שכבות 1-2 לשכבת Network Access אחת. OSI טוב ללימוד וניתוח, TCP/IP טוב למימוש.

??? tip "מה זה Encapsulation ואיך זה עובד?"
    **Encapsulation** הוא התהליך שבו כל שכבה ב-OSI **עוטפת** את הנתונים מהשכבה שמעליה עם Header (ולפעמים Trailer) משלה. למשל: Layer 7 יוצר HTTP Data, Layer 4 מוסיף TCP Header (Port, Sequence Number), Layer 3 מוסיף IP Header (כתובות), Layer 2 מוסיף Ethernet Header (MAC) ו-Trailer (CRC). בצד המקבל, **Decapsulation** -- כל שכבה מפשיטה את ה-Header שלה ומעבירה למעלה.

??? tip "איך תאבחנו בעיית רשת? תנו דוגמה."
    עובדים **מלמטה למעלה**. **Layer 1**: כבל מחובר? Wi-Fi פעיל? (`ip link show`). **Layer 2/3**: יש כתובת IP? (`ip addr show`). **Layer 3**: מגיעים ל-Default Gateway? (`ping 192.168.1.1`). מגיעים לאינטרנט? (`ping 8.8.8.8`). **Layer 4**: Port פתוח? (`nc -zv host 443`). **Layer 7**: DNS עובד? (`dig example.com`). HTTP עובד? (`curl -v https://example.com`). **דוגמה**: ping 8.8.8.8 עובד אבל `curl google.com` נכשל → DNS שבור. פתרון: שנו DNS server ל-8.8.8.8.

??? tip "מה ההבדל בין Switch, Router, ו-Firewall?"
    **Switch** עובד ב-**Layer 2**. הוא מעביר Frames בין מכשירים **באותה רשת** לפי MAC Address. **Router** עובד ב-**Layer 3**. הוא מנתב Packets **בין רשתות שונות** לפי IP Address. **Firewall** יכול לעבוד ב-**Layer 3/4/7**. הוא **מסנן** תעבורה לפי כללים (IP, Port, Protocol, ואפילו תוכן HTTP ב-Layer 7 Firewalls).

??? tip "מה זה ARP ואיך הוא עובד?"
    **ARP** (Address Resolution Protocol) מתרגם **IP Address ל-MAC Address**. כשמחשב רוצה לשלוח Packet ל-IP מקומי (למשל 192.168.1.10), הוא צריך לדעת את ה-MAC Address. הוא שולח **ARP Request** (Broadcast): "מי שיש לו IP 192.168.1.10, מה ה-MAC שלך?" המכשיר עם ה-IP הזה עונה עם **ARP Reply**: "ה-MAC שלי הוא AA:BB:CC:DD:EE:FF". התוצאה נשמרת ב-**ARP Cache** לזמן מוגבל.

??? tip "מה זה TTL ב-IP ולמה צריך אותו?"
    **TTL** (Time To Live) הוא מספר ב-IP Header שמתחיל מערך מסוים (בד"כ 64 או 128) ו**יורד ב-1 בכל Router** שה-Packet עובר. כשמגיע ל-0, ה-Packet נמחק וה-Router שולח ICMP "Time Exceeded" לשולח. **למה צריך**: מונע Routing Loops -- חבילות שנתקעות בלולאה אינסופית ברשת. **שימוש מעשי**: `traceroute` עובד ע"י שליחת Packets עם TTL עולה (1, 2, 3...) וקבלת ICMP Time Exceeded מכל Router בדרך.

??? tip "מתי להשתמש ב-Wireshark ומתי ב-tcpdump?"
    **Wireshark** -- כלי GUI עם ממשק ויזואלי. מצוין לניתוח מעמיק, סינון, ומעקב אחרי TCP Streams. מתאים ל-Desktop ולניתוח שנשמר בקבצי PCAP. **tcpdump** -- כלי CLI (שורת פקודה). מתאים ל-Servers שאין להם GUI, לסביבות Production, ולכידה מהירה. אפשר ללכוד עם tcpdump (`-w file.pcap`) ולנתח אח"כ עם Wireshark. **כלל אצבע**: tcpdump ללכידה בשרת, Wireshark לניתוח מפורט.

---

## קישורים לנושאים אחרים

- [Client-Server](client-server.md) -- מודל ה-Client-Server עובד בשכבה ה-7 (Application), אבל מסתמך על כל השכבות מתחת.
- [TCP/IP & HTTP](tcp-ip-http.md) -- צלילה עמוקה לפרוטוקולים של שכבות 3, 4, ו-7.
- [DNS & Ports](dns-ports.md) -- DNS עובד ב-Layer 7, ו-Ports שייכים ל-Layer 4.
