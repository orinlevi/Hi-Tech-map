# יסודות חומרה (Hardware Basics)

## למה זה חשוב

כל שורת קוד שאתם כותבים בסוף רצה על חומרה פיזית. הבנה בסיסית של רכיבי החומרה תעזור לכם:

- להבין למה התוכנה שלכם איטית (ואיפה ה-bottleneck)
- לבחור את סוג השרת הנכון ב-cloud
- לדבר בשפה משותפת עם צוותי DevOps ו-Infrastructure
- להבין מגבלות של מערכות אמיתיות

!!! quote "חוכמה מקומית"
    "חומרה זה מה ששובר את התוכנה שלך באופן אמיתי, לא כמו באגים שזה עניין של פרשנות" -- מהנדס DevOps אנונימי

## רעיונות מרכזיים

### ארבעת הרכיבים המרכזיים

```
┌─────────────────────────────────────────────┐
│                 מחשב / שרת                   │
│                                             │
│   ┌───────┐    ┌───────┐    ┌───────────┐   │
│   │  CPU  │<-->│  RAM  │<-->│  Storage  │   │
│   │ מעבד  │    │ זיכרון │    │  אחסון    │   │
│   └───┬───┘    └───────┘    │ SSD / HDD │   │
│       │                     └───────────┘   │
│       │                                     │
│   ┌───┴───┐                                 │
│   │  NIC  │ -----> לרשת                     │
│   └───────┘                                 │
└─────────────────────────────────────────────┘
```

### היררכיית הזיכרון -- The Memory Hierarchy

אחד המושגים הכי חשובים להבנת ביצועים. ככל שהזיכרון קרוב יותר ל-CPU, הוא מהיר יותר אבל קטן ויקר יותר:

```
                     ┌─────────┐
                     │CPU Regs │  < 1ns     | ~KB
                     │ רגיסטרים │
                     ├─────────┤
                    │  L1 Cache │  ~1ns      | 32-64 KB per core
                    │           │
                   ├────────────┤
                  │   L2 Cache   │  ~4ns     | 256 KB - 1 MB per core
                  │              │
                 ├───────────────┤
                │    L3 Cache     │  ~10ns   | 8-64 MB shared
                │                 │
               ├──────────────────┤
              │       RAM          │  ~100ns  | 8-512 GB
              │                    │
             ├─────────────────────┤
            │      SSD (NVMe)       │  ~10μs  | 256 GB - 8 TB
            │                       │
           ├────────────────────────┤
          │        HDD               │  ~10ms  | 1 TB - 20 TB
          └──────────────────────────┘

  מהיר + יקר + קטן  ◄──────────────────►  איטי + זול + גדול
```

!!! warning "למה זה משנה?"
    הבדל של פי 1000 במהירות בין RAM ל-HDD! כשהתוכנה שלכם צריכה נתון, היא מקווה למצוא אותו ב-cache. אם לא -- יש **cache miss** והמעבד צריך לחכות. זו הסיבה שאלגוריתמים **cache-friendly** (שנגשים לזיכרון בצורה רצופה) מהירים יותר.

### CPU -- המוח

**Central Processing Unit** -- מבצע את הפקודות של התוכנה.

- מורכב מ-**cores** (ליבות) -- כל ליבה יכולה להריץ thread אחד (או שניים עם Hyper-Threading)
- מהירות נמדדת ב-**GHz** (גיגה-הרץ) -- כמה פעולות בשנייה
- מעבד מודרני: 4-128 ליבות, 3-5 GHz

```
CPU עם 8 ליבות:
┌──────────────────────────┐
│ Core1  Core2  Core3  Core4 │
│ Core5  Core6  Core7  Core8 │
└──────────────────────────┘
כל ליבה מריצה task אחר במקביל
```

**מושגים חשובים ב-CPU:**

| מושג | הסבר | למה חשוב |
|------|------|----------|
| **Clock Speed** (GHz) | מספר פעולות בשנייה | מהירות ליבה בודדת |
| **Cores** | מספר ליבות | כמה tasks במקביל |
| **Threads** (HT/SMT) | ליבות וירטואליות | שימוש יעיל יותר בליבות |
| **Cache** (L1/L2/L3) | זיכרון מהיר מאוד על ה-chip | מפחית גישות איטיות ל-RAM |
| **TDP** (Watts) | צריכת חשמל/חום | מגבלת קירור |
| **Architecture** | ARM vs x86 | תאימות תוכנה |

??? tip "ARM vs x86"
    **x86** (Intel, AMD) -- הארכיטקטורה המסורתית. משמשת את רוב השרתים והמחשבים.
    **ARM** -- ארכיטקטורה חסכונית באנרגיה. משמשת טלפונים, ולאחרונה גם שרתים (AWS Graviton) ומחשבים (Apple M-series).

    ```bash
    # לבדוק את הארכיטקטורה של המחשב שלכם
    uname -m
    # x86_64 = Intel/AMD
    # aarch64 / arm64 = ARM

    # מידע מפורט על CPU (Linux)
    lscpu
    # Architecture:          x86_64
    # CPU(s):                16
    # Thread(s) per core:    2
    # Core(s) per socket:    8
    # Model name:            Intel(R) Core(TM) i9-9900K
    ```

### RAM -- הזיכרון הזמני

**Random Access Memory** -- זיכרון מהיר שמחזיק נתונים שה-CPU צריך **עכשיו**.

- מהיר מאוד (ננו-שניות)
- **נדיף** (volatile) -- נמחק כשמכבים את המחשב
- גודל טיפוסי: 8-64 GB במחשב אישי, 64-512 GB בשרת

!!! note "אנלוגיה"
    חשבו על RAM כמו שולחן העבודה שלכם. ה-Storage זה הארון. כשצריכים לעבוד על משהו, מוציאים אותו מהארון (Storage) ושמים על השולחן (RAM). ככל שהשולחן יותר גדול, אפשר לעבוד על יותר דברים במקביל.

**סוגי RAM בשרתים:**

| תכונה | DDR4 | DDR5 |
|--------|------|------|
| מהירות | 2400-3200 MT/s | 4800-6400+ MT/s |
| קיבולת per DIMM | עד 64 GB | עד 128 GB |
| צריכת חשמל | 1.2V | 1.1V |
| ECC | אופציונלי | נפוץ יותר |

??? tip "ECC RAM -- למה חשוב בשרתים?"
    **ECC** (Error Correcting Code) RAM יכול לזהות ולתקן שגיאות בזיכרון. במחשב ביתי, bit flip בודד אולי יגרום ל-crash. בשרת שמריץ database של בנק -- bit flip יכול להפוך 1,000 שקל ל-9,000 שקל. לכן שרתים משתמשים כמעט תמיד ב-ECC RAM.

```bash
# לבדוק כמה RAM יש (Linux)
free -h
#               total        used        free
# Mem:           31Gi       18Gi       8.2Gi
# Swap:         8.0Gi       0.0Gi      8.0Gi

# מידע מפורט על RAM
sudo dmidecode -t memory | grep -E "Size|Speed|Type"
```

### Storage -- אחסון קבוע

שומר נתונים גם כשמכבים את המחשב.

| תכונה | HDD | SSD (SATA) | SSD (NVMe) |
|--------|-----|------------|------------|
| טכנולוגיה | דיסק מגנטי מסתובב | זיכרון Flash (SATA) | זיכרון Flash (PCIe) |
| מהירות קריאה סדרתית | ~100-200 MB/s | ~500 MB/s | ~3,000-7,000 MB/s |
| מהירות קריאה אקראית (IOPS) | ~100 IOPS | ~50,000 IOPS | ~500,000+ IOPS |
| מחיר ל-TB | זול (~$15/TB) | בינוני (~$50/TB) | יקר (~$80/TB) |
| עמידות | רגיש לזעזועים | עמיד | עמיד |
| רעש | כן (חלקים נעים) | שקט | שקט |

??? tip "NVMe"
    **NVMe SSD** הוא סוג מתקדם של SSD שמתחבר ישירות ל-PCIe bus (במקום דרך SATA). מהיר פי 5-10 מ-SSD רגיל. כמעט כל שרת מודרני משתמש ב-NVMe.

??? tip "RAID -- הגנה על נתונים"
    **RAID** (Redundant Array of Independent Disks) -- טכנולוגיה שמשלבת כמה דיסקים לאחד:

    - **RAID 0**: Striping -- מהיר יותר, אבל אם דיסק אחד נשבר הכל אבוד
    - **RAID 1**: Mirroring -- כל נתון נכתב לשני דיסקים. דיסק נשבר? יש עותק
    - **RAID 5**: Striping + Parity -- מהיר + עמיד לכשל דיסק אחד
    - **RAID 10**: שילוב של RAID 1 + RAID 0. מהיר ועמיד. פופולרי ב-databases

    ```bash
    # בדיקת RAID status (Linux)
    cat /proc/mdstat
    # או עם RAID controller
    sudo megacli -LDInfo -Lall -aALL
    ```

```bash
# לבדוק Storage (Linux)
df -h
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/nvme0n1p1  100G   35G   65G  35% /

# מדידת מהירות Storage
# כתיבה
dd if=/dev/zero of=/tmp/testfile bs=1M count=1024 oflag=dsync
# קריאה
hdparm -Tt /dev/nvme0n1

# צפייה בסוגי דיסקים
lsblk
# NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
# nvme0n1     259:0    0   477G  0 disk
# ├─nvme0n1p1 259:1    0   476G  0 part /
# └─nvme0n1p2 259:2    0     1G  0 part /boot
```

### NIC -- כרטיס רשת

**Network Interface Card** -- מחבר את המחשב לרשת.

- במחשב אישי: Wi-Fi + Ethernet (1 Gbps)
- בשרת: לפעמים כמה כרטיסי רשת של 10-100 Gbps
- חשוב ל-throughput (כמות נתונים שעוברים) ו-latency (זמן תגובה)

```
מהירויות רשת נפוצות:

Fast Ethernet:    100 Mbps    ███
Gigabit:          1 Gbps      ██████████
10G:              10 Gbps     ████████████████████████████
25G:              25 Gbps     שרתי ענן מודרניים
100G:             100 Gbps    data center backbone
400G:             400 Gbps    hyperscale data centers
```

??? tip "Bonding / Teaming"
    בשרתים קריטיים, משלבים כמה NICs ביחד:

    - **Active-Passive**: NIC אחד עובד, השני מחכה כ-backup
    - **Active-Active**: שניהם עובדים -- כפול throughput + redundancy

    ```bash
    # בדיקת כרטיסי רשת (Linux)
    ip link show
    # או
    ethtool eth0
    # Speed: 25000Mb/s
    # Link detected: yes
    ```

### מושג מפתח: Bottleneck

**Bottleneck** (צוואר בקבוק) -- הרכיב שמאט את כל המערכת.

```
דוגמה: אפליקציה שקוראת הרבה נתונים מדיסק

CPU:     ████░░░░░░  (40% ניצול)
RAM:     ██░░░░░░░░  (20% ניצול)
Storage: ██████████  (100% ניצול)  <-- BOTTLENECK!
Network: █░░░░░░░░░  (10% ניצול)

הפתרון: להחליף HDD ב-SSD, או להוסיף caching ב-RAM
```

!!! warning "הכלל החשוב"
    שדרוג רכיב שהוא **לא** ה-bottleneck לא ישפר ביצועים. אין טעם לקנות CPU יותר חזק אם ה-Storage הוא מה שמאט אתכם.

### איך מזהים Bottleneck? -- כלים מעשיים

```bash
# ---------- Linux Performance Monitoring ----------

# סקירה כללית -- top / htop
htop
# מראה CPU, RAM, processes בזמן אמת

# ניצול CPU מפורט
mpstat -P ALL 1
# CPU    %usr   %nice    %sys %iowait   %irq   %soft  %steal   %idle
# all    42.50    0.00    3.20    0.30    0.00    0.10    0.00   53.90

# ניצול Storage (I/O)
iostat -xz 1
# Device   r/s    w/s   rMB/s   wMB/s  await  %util
# nvme0n1  150    200   12.5    25.0    0.8    45.2

# ניצול רשת
sar -n DEV 1
# IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s
# eth0    15234     12456      1250.5     890.3

# ניצול RAM
vmstat 1
# procs  memory         swap       io     system      cpu
# r  b   swpd   free    si   so    bi    bo   in   cs  us  sy  id  wa
# 2  0   0    2048000    0    0     5    12   150  300  42   3  54   1
```

??? tip "iowait -- הסימן ל-Storage bottleneck"
    אם `iowait` גבוה ב-`top` או `mpstat`, ה-CPU מחכה ל-Storage. זה סימן ש-Storage הוא ה-bottleneck. הפתרון: NVMe SSD, caching layer (Redis), או שיפור queries.

### Benchmarking -- מדידת ביצועים

```bash
# מדידת CPU
sysbench cpu --threads=8 run
# events per second: 12543.21

# מדידת RAM
sysbench memory --threads=4 run
# Total operations: 104857600
# Transfer rate: 15234.56 MiB/sec

# מדידת Storage (fio)
fio --name=randread --ioengine=libaio --iodepth=32 \
    --rw=randread --bs=4k --direct=1 --size=1G \
    --numjobs=4 --runtime=30
# READ: bw=1250MiB/s, IOPS=320000

# מדידת רשת (בין שני שרתים)
# על השרת:
iperf3 -s
# על הלקוח:
iperf3 -c server-ip
# [ ID]   Transfer     Bitrate
# [  5]   11.0 GBytes  9.42 Gbits/sec
```

## בלבולים נפוצים

- **"יותר RAM = מחשב יותר מהיר"** -- לא בהכרח. RAM מאפשר לעבוד על יותר דברים במקביל, אבל אם יש מספיק RAM, תוספת לא תעזור. ה-bottleneck במקום אחר.
- **"SSD ו-RAM זה אותו דבר"** -- לא. RAM מהיר פי 100 מ-SSD, אבל הוא נדיף (נמחק בכיבוי) ויקר הרבה יותר.
- **"GHz יותר גבוה = CPU יותר טוב"** -- לא תמיד. ארכיטקטורה, מספר ליבות, וגודל cache משפיעים לא פחות.
- **"NVMe ו-SSD זה אותו דבר"** -- NVMe הוא סוג של SSD, אבל הוא מתחבר דרך PCIe ומהיר פי 5-10 מ-SSD רגיל שמתחבר דרך SATA.
- **"שרת בענן = ביצועים מובטחים"** -- לא בדיוק. cloud instances חולקים חומרה פיזית (noisy neighbors). לכן יש גם **dedicated instances** (יותר יקר, אבל חומרה רק שלכם).

## דוגמה קטנה

כשאתם בוחרים instance בענן (למשל AWS EC2), אתם בעצם בוחרים תמהיל חומרה:

```
סוגי EC2 instances לדוגמה:

t3.micro:    2 vCPU,   1 GB RAM   -- לניסויים, פיתוח
m5.large:    2 vCPU,   8 GB RAM   -- אפליקציות כלליות
c5.4xlarge: 16 vCPU,  32 GB RAM   -- compute-intensive (הרבה CPU)
r5.2xlarge:  8 vCPU,  64 GB RAM   -- memory-intensive (הרבה RAM)
i3.xlarge:   4 vCPU,  30 GB RAM + NVMe local storage -- storage-intensive
p3.2xlarge:  8 vCPU,  61 GB RAM + NVIDIA V100 GPU -- ML training
```

??? tip "איך בוחרים?"
    - אפליקציית web רגילה? **t3** או **m5** מספיקים
    - עיבוד נתונים כבד? **c5** (compute optimized)
    - מסד נתונים גדול ב-memory? **r5** (memory optimized)
    - מסד נתונים עם הרבה I/O? **i3** (storage optimized)
    - אימון מודל ML? **p3** או **g4** (GPU instances)

### דוגמת Right-Sizing בפועל

```bash
# הבעיה: האפליקציה איטית על m5.large
# בואו נבדוק את ה-bottleneck:

# 1. בדיקת CPU
top -bn1 | head -5
# %Cpu(s): 92.3 us,  2.1 sy,  0.0 ni,  5.6 id
# CPU usage 92%! --> Bottleneck הוא CPU

# 2. הפתרון: לעבור ל-compute-optimized
# m5.large  (2 vCPU, 8 GB)  --> c5.xlarge (4 vCPU, 8 GB)
# אותו מחיר בערך, אבל כפול ליבות + ליבות מהירות יותר

# 3. או להוסיף horizontal scaling:
# במקום שרת אחד חזק, 3 שרתים קטנים מאחורי Load Balancer
```

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מבנה מחשבים — CPU architecture, memory hierarchy, I/O
    - מערכות הפעלה — processes, memory management, storage

    **קורסים מומלצים:**
    - ארכיטקטורת מחשבים מתקדמת — pipelining, caching, NUMA
    - Cloud Computing — instance types, right-sizing

    **ידע מעשי:**
    - lscpu, free, df, lsblk — system inspection
    - htop, iostat, vmstat — performance monitoring
    - sysbench, fio, iperf3 — benchmarking tools

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבנה מחשבים (0368-2159)

---

## 🛤️ מאיפה מתחילים

1. **שלב ראשון**: הכירו את החומרה של המחשב שלכם -- הריצו `lscpu`, `free -h`, `df -h` (Linux/Mac) או Task Manager (Windows)
2. **שלב שני**: התקינו `htop` ולמדו לקרוא את הפלט -- זה הכלי הכי שימושי לניטור ביצועים
3. **שלב שלישי**: פתחו AWS Free Tier ונסו להרים instances שונים (t3, c5, r5) -- תרגישו את ההבדלים
4. **שלב רביעי**: למדו על bottleneck analysis -- הריצו `iostat`, `vmstat`, `sar` על שרת עם עומס
5. **שלב חמישי**: נסו benchmarking עם `sysbench` או `fio` -- תבינו מה החומרה שלכם באמת יכולה

??? tip "משאבים מומלצים"
    - **Brendan Gregg's Blog** -- המקור הטוב ביותר ל-Linux performance analysis
    - **AWS Instance Types** -- documentation מצוין לכל סוגי ה-instances
    - **Linux Performance Tools** (Brendan Gregg) -- תרשים מפורסם של כל כלי הניטור

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין RAM ל-Storage?"
    RAM הוא זיכרון נדיף (volatile) -- מהיר מאוד (ננו-שניות) אבל נמחק בכיבוי. Storage (SSD/HDD) הוא אחסון קבוע (persistent) -- איטי יותר (מיקרו-שניות עד מילי-שניות) אבל שורד כיבוי. RAM משמש לנתונים שה-CPU צריך עכשיו, Storage שומר נתונים לטווח ארוך. RAM יקר הרבה יותר ל-GB.

??? tip "מה זה Cache ולמה הוא חשוב?"
    Cache הוא שכבת זיכרון מהירה שנמצאת בין CPU ל-RAM. יש שלוש רמות (L1, L2, L3). כש-CPU צריך נתון, הוא מחפש קודם ב-L1, אח"כ L2, L3, ורק אז RAM. **Cache hit** = הנתון נמצא ב-cache (מהיר). **Cache miss** = צריך לגשת ל-RAM (איטי). אלגוריתמים שנגשים לזיכרון בצורה רצופה (cache-friendly) מהירים יותר כי הם מנצלים את ה-cache בצורה טובה.

??? tip "מה זה Bottleneck ואיך מזהים אותו?"
    Bottleneck הוא הרכיב שמגביל את ביצועי המערכת. מזהים אותו על ידי ניטור: CPU usage גבוה = CPU bottleneck, iowait גבוה = Storage bottleneck, memory usage גבוה + swapping = RAM bottleneck, network saturation = Network bottleneck. הכלים העיקריים: `htop`, `iostat`, `vmstat`, `sar`. הכלל: שדרוג רכיב שהוא לא ה-bottleneck לא ישפר ביצועים.

??? tip "מה ההבדל בין HDD ל-SSD ל-NVMe?"
    **HDD** -- דיסק מגנטי מסתובב, זול אבל איטי (~100 MB/s), רגיש לזעזועים.
    **SSD (SATA)** -- Flash memory דרך SATA interface, ~500 MB/s.
    **NVMe SSD** -- Flash memory ישירות על PCIe bus, ~3,000-7,000 MB/s. מהיר פי 5-10 מ-SATA SSD.
    בשרתים מודרניים כמעט תמיד NVMe. IOPS (פעולות אקראיות בשנייה) זה מה שבאמת חשוב ל-databases.

??? tip "מה זה ECC RAM ולמה משתמשים בו בשרתים?"
    ECC (Error Correcting Code) RAM יכול לזהות ולתקן שגיאות bit בודדות בזיכרון. בסביבה רגילה bit flip קורה לעיתים נדירות, אבל בשרתים עם מאות GB של RAM שרצים 24/7 זה עלול לקרות. ב-databases ומערכות פיננסיות, bit flip יכול לגרום לשחיתות נתונים. לכן שרתים כמעט תמיד משתמשים ב-ECC. החיסרון: יקר יותר ואיטי מעט.

??? tip "איך בוחרים instance type בענן?"
    צריך לזהות את ה-workload:
    **General Purpose** (m5, m6i) -- אפליקציות כלליות, web servers.
    **Compute Optimized** (c5, c6i) -- CPU-intensive: encoding, scientific computing.
    **Memory Optimized** (r5, r6i) -- in-memory databases (Redis, SAP HANA).
    **Storage Optimized** (i3, d2) -- high IOPS databases, data warehousing.
    **GPU** (p3, g4) -- ML training, video encoding.
    תמיד מתחילים קטן ומשדרגים לפי monitoring.

??? tip "מה זה NUMA ולמה זה רלוונטי לשרתים?"
    **NUMA** (Non-Uniform Memory Access) -- בשרתים עם כמה CPUs, לכל CPU יש RAM "קרוב" (local) ו-RAM "רחוק" (remote, של CPU אחר). גישה ל-RAM מקומי מהירה יותר. תוכנה שלא מודעת ל-NUMA עלולה לפנות בעיקר ל-RAM רחוק ולסבול מביצועים נמוכים. databases כמו PostgreSQL ו-MySQL מודעים ל-NUMA ומנסים להשתמש ב-local RAM.

## קישורים לנושאים אחרים

- [CPU מול GPU](cpu-vs-gpu.md) -- להבין את ההבדל בין שני סוגי מעבדים
- [מחשב מול שרת](computer-vs-server.md) -- איך החומרה הזו מתחברת ליחידה שלמה
- [מאיצים - FPGA & TPU](accelerators-fpga-tpu.md) -- חומרה מתקדמת מעבר ל-CPU ו-GPU
