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

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - ארכיטקטורת מחשבים — CPU pipeline, memory hierarchy, SIMD
    - מעגלים דיגיטליים — logic gates, FPGA basics
    - מערכות הפעלה — device drivers, DMA

    **קורסים מומלצים:**
    - VLSI Design — chip design, ASIC flow
    - High Performance Computing — parallel architectures
    - Hardware for ML — TPU, Cerebras, Graphcore

    **ידע מעשי:**
    - Verilog / VHDL — FPGA programming
    - CUDA / OpenCL — GPU/accelerator programming
    - TensorFlow (TPU support) / JAX
    - Cloud accelerators (AWS Inferentia, Google TPU)

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבנה מחשבים (0368-2159)
    - נושאים מתקדמים בארכיטקטורת מחשבים (0368-3087)

---

## 🛤️ מאיפה מתחילים

1. **Google Cloud TPU docs** — ניסוי חינמי עם Colab TPU
2. **Xilinx / Intel FPGA tutorials** — getting started with FPGAs
3. **"Computer Architecture" — Patterson & Hennessy** — ספר קלאסי
4. **Google Edge TPU** — on-device inference
5. **MLPerf benchmarks** — השוואת accelerators

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין GPU, FPGA ו-TPU?"
    **GPU** — אלפי cores פשוטים, flexible, CUDA ecosystem. טוב לtraining ולinference.
    **FPGA** — חומרה ניתנת לתכנות, latency נמוך מאוד, energy efficient. טוב לinference ב-edge.
    **TPU** — ASIC ייעודי ל-matrix multiplication (Google). Systolic array, optimized for TensorFlow. טוב לtraining בscale גדול.

??? tip "מה Systolic Array?"
    ארכיטקטורת חישוב שבה data "זורם" דרך grid של PEs (Processing Elements). כל PE מבצע MAC (multiply-accumulate) ומעביר לשכן. מאוד יעיל ל-matrix multiplication — הבסיס של neural networks. TPU משתמש ב-systolic array של 128×128.

??? tip "מתי כדאי FPGA על פני GPU?"
    **FPGA עדיף**: latency קריטי (real-time), power constrained (edge/IoT), custom data types (INT4, custom precision), small batch inference. **GPU עדיף**: training, large batches, ecosystem/tooling חשוב, rapid prototyping. FPGA = יותר עבודת פיתוח, פחות flexible.

??? tip "מה Mixed Precision Training?"
    שימוש ב-FP16/BF16 במקום FP32 לחלק מהחישובים. יתרונות: 2x throughput, חצי memory. FP32 נשמר ל-master weights ול-loss scaling. NVIDIA Tensor Cores מיועדים בדיוק לזה. BF16 (Brain Float) — exponent כמו FP32, mantissa קצרה — פשוט יותר מ-FP16.

??? tip "מה Inference Optimization?"
    טכניקות להאצת inference: **Quantization** (FP32→INT8 — 4x speedup), **Pruning** (הסרת weights קטנים), **Knowledge Distillation** (מודל קטן שלומד ממודל גדול), **TensorRT** (NVIDIA optimizer), **ONNX Runtime** (cross-platform). Trade-off: speed vs accuracy.
