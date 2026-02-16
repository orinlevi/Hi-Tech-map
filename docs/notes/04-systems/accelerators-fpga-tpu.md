# מאיצים - FPGA & TPU

## למה זה חשוב

GPU הוא לא הפתרון היחיד לחישובים מקביליים. בעולם ה-High Tech המודרני יש **מאיצי חומרה** (Hardware Accelerators) מתקדמים שנבנו למשימות ספציפיות:

- חברות כמו Google, Amazon, ו-Tesla מפתחות chips ייעודיים
- הבנת האפשרויות תעזור לכם לבחור את הכלי הנכון למשימה
- זה נושא חם בתעשייה -- שווה להכיר את הכיוון

## רעיונות מרכזיים

### מה זה Hardware Accelerator?

רכיב חומרה שמיועד **למשימה ספציפית** ומבצע אותה הרבה יותר מהר (ויעיל יותר מבחינת אנרגיה) מאשר CPU או GPU כללי.

```
ספקטרום הגמישות מול הביצועים:

גמישות גבוהה                           ביצועים גבוהים
     |                                        |
     v                                        v
   CPU  ------>  GPU  ------>  FPGA  ------>  ASIC/TPU
 (הכל)      (parallel)    (מותאם)      (משימה אחת)
```

### FPGA -- חומרה שאפשר לתכנת

**Field-Programmable Gate Array** -- שבב שאפשר "לחווט מחדש" אחרי הייצור.

```
FPGA מכיל מיליוני בלוקים לוגיים:
┌────────────────────────────────┐
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│  │LB│─│LB│─│LB│─│LB│─│LB│   │   LB = Logic Block
│  └──┘ └──┘ └──┘ └──┘ └──┘   │
│   │    │    │    │    │      │   את החיבורים ביניהם
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │   אפשר להגדיר מחדש!
│  │LB│─│LB│─│LB│─│LB│─│LB│   │
│  └──┘ └──┘ └──┘ └──┘ └──┘   │
│   │    │    │    │    │      │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│  │LB│─│LB│─│LB│─│LB│─│LB│   │
│  └──┘ └──┘ └──┘ └──┘ └──┘   │
└────────────────────────────────┘
```

**יתרונות:**

- ביצועים גבוהים למשימות ספציפיות
- Latency נמוך מאוד (אין overhead של מערכת הפעלה)
- חסכוני באנרגיה בהשוואה ל-GPU
- אפשר לשנות את ההגדרה (re-program) בלי לייצר chip חדש

**חסרונות:**

- קשה לתכנת (VHDL / Verilog -- לא Python!)
- פחות גמיש מ-GPU
- זמן פיתוח ארוך

!!! note "איפה משתמשים ב-FPGA?"
    - **רשתות תקשורת** -- עיבוד חבילות במהירות גבוהה (Cisco, Juniper)
    - **פיננסים** -- High Frequency Trading (כל ננו-שנייה חשובה)
    - **Azure** -- Microsoft משתמשת ב-FPGA ב-data centers שלה
    - **Inference** -- הרצת מודלים מאומנים בעלות נמוכה

### TPU -- השבב של Google ל-ML

**Tensor Processing Unit** -- ASIC (Application-Specific Integrated Circuit) שגוגל תכננה במיוחד לחישובי tensor / כפל מטריצות.

```
TPU v4 Pod:
┌─────────────────────────────────────┐
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │TPU  │ │TPU  │ │TPU  │ │TPU  │  │
│  │chip │─│chip │─│chip │─│chip │  │
│  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘  │
│     │       │       │       │     │
│  ┌──┴──┐ ┌──┴──┐ ┌──┴──┐ ┌──┴──┐  │
│  │TPU  │ │TPU  │ │TPU  │ │TPU  │  │
│  │chip │─│chip │─│chip │─│chip │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│      High-speed interconnect       │
└─────────────────────────────────────┘
TPU Pod = אלפי chips מחוברים ביחד
```

**יתרונות:**

- מהיר מאוד לאימון ML (מותאם ל-matrix multiplication)
- יעיל מאוד מבחינת אנרגיה
- זמין דרך Google Cloud

**חסרונות:**

- רק דרך Google Cloud (לא קונים TPU הביתה)
- מוגבל למשימות ML (לא general purpose)
- דורש שימוש ב-TensorFlow או JAX (תמיכה ב-PyTorch התווספה מאוחר)

### מתי להשתמש במה?

| מאיץ | הכי טוב ל... | דוגמה |
|-------|-------------|--------|
| **CPU** | משימות כלליות, לוגיקה מורכבת, workloads קטנים | Web server, סקריפטים |
| **GPU** | עבודה מקבילית, ML training & inference | אימון GPT, עיבוד תמונות |
| **TPU** | אימון מודלים גדולים מאוד ב-Google Cloud | אימון BERT, PaLM |
| **FPGA** | latency קריטי, workloads קבועים | HFT, עיבוד וידאו בזמן אמת |

??? tip "ASIC מותאם אישית"
    חברות גדולות מפתחות chips ייעודיים משלהן:

    - **Google**: TPU
    - **Amazon (AWS)**: Inferentia (ל-inference), Trainium (ל-training)
    - **Apple**: Neural Engine (ב-M1/M2/M3 chips)
    - **Tesla**: FSD Chip (ל-self driving)

    הרעיון: אם אתה יודע בדיוק מה המשימה, אפשר לבנות chip שעושה אותה בצורה מושלמת.

## בלבולים נפוצים

- **"FPGA זה כמו GPU"** -- לא. GPU הוא מעבד עם אלפי ליבות קבועות. FPGA הוא חומרה שאפשר "לחווט" לכל מעגל לוגי שרוצים. FPGA יכול לחקות GPU, CPU, או כל דבר אחר.
- **"TPU עדיף תמיד על GPU ל-ML"** -- לא בהכרח. TPU מצוין למודלים גדולים ולפקודות tensor, אבל GPU יותר גמיש ותומך בכל framework. לפרויקטים קטנים-בינוניים, GPU מספיק ולפעמים עדיף.
- **"אפשר לתכנת FPGA ב-Python"** -- באופן מסורתי FPGA מתוכנת ב-HDL (Hardware Description Language) כמו VHDL או Verilog. יש כלים חדשים שמאפשרים synthesis מ-Python (כמו MyHDL, HLS), אבל זה לא אותו דבר כמו לכתוב Python רגיל.

!!! warning "אזהרה"
    לרוב המפתחים אין צורך לעבוד ישירות עם FPGA או TPU. אם אתם לא בצוות infrastructure או hardware -- מספיק להכיר את הקונספטים. המשמעות המעשית היא בעיקר **בחירת instance type** בענן.

## דוגמה קטנה

בחירת חומרה ב-Google Cloud לאימון מודל:

```python
# אופציה 1: GPU (NVIDIA T4) -- זול, טוב לפרויקטים קטנים
# Google Colab חינם נותן T4
import torch
device = torch.device('cuda')
model = MyModel().to(device)

# אופציה 2: TPU -- מהיר, טוב למודלים גדולים
# דורש JAX או PyTorch/XLA
import jax
import jax.numpy as jnp

# JAX מזהה TPU אוטומטית
devices = jax.devices()
print(devices)  # [TpuDevice(id=0), TpuDevice(id=1), ...]

# כפל מטריצות על TPU
x = jnp.ones((10000, 10000))
y = x @ x  # רץ על TPU אוטומטית
```

```
השוואת עלויות (Google Cloud, אזור us-central1, נכון ל-2024):

n1-standard-8 + T4 GPU:    ~$0.95/hour
a2-highgpu-1g (A100 GPU):  ~$3.67/hour
v4-8 TPU:                  ~$3.22/hour

TPU משתלם כשמנצלים את כל ה-throughput שלו
(מודלים גדולים עם batch sizes גדולים)
```

## קישורים לנושאים אחרים

- [CPU מול GPU](cpu-vs-gpu.md) -- ההבדל הבסיסי בין CPU ל-GPU
- [יסודות חומרה](hardware-basics.md) -- הרכיבים הבסיסיים של מחשב
- [רשתות נוירונים](../02-ml-core/neural-networks.md) -- למה צריך את כל המאיצים האלה
