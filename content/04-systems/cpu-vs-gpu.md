# CPU מול GPU

## למה זה חשוב

המהפכה של ה-AI וה-Machine Learning לא הייתה אפשרית בלי GPU-ים. הבנת ההבדל בין CPU ל-GPU היא קריטית:

- כדי להבין למה אימון מודלים דורש חומרה יקרה
- כדי לדעת מתי להשתמש ב-GPU ומתי ב-CPU
- כדי להבין למה NVIDIA שווה טריליונים
- כדי לכתוב קוד שמנצל את החומרה בצורה נכונה

!!! quote "חוכמה מקומית"
    "CPU זה כמו פרופסור אחד שיכול לפתור כל בעיה. GPU זה כמו אלף תלמידי כיתה א' שיכולים לספור מהר מאוד, אבל אל תבקשו מהם לכתוב חיבור" -- הסבר שנשמע בכל הרצאת intro to ML

## רעיונות מרכזיים

### CPU -- מעט ליבות חזקות

**Central Processing Unit** -- מעבד כללי שטוב ב**כל דבר**.

```
CPU (למשל Intel i9, 16 ליבות):
┌────┐ ┌────┐ ┌────┐ ┌────┐
│ C1 │ │ C2 │ │ C3 │ │ C4 │     כל ליבה: חזקה מאוד
├────┤ ├────┤ ├────┤ ├────┤     יכולה לעשות כל דבר
│ C5 │ │ C6 │ │ C7 │ │ C8 │     פעולות מורכבות ושונות
├────┤ ├────┤ ├────┤ ├────┤
│ C9 │ │C10 │ │C11 │ │C12 │     4-128 ליבות
├────┤ ├────┤ ├────┤ ├────┤
│C13 │ │C14 │ │C15 │ │C16 │
└────┘ └────┘ └────┘ └────┘
```

**מתאים ל:**

- משימות סדרתיות (sequential) -- צעד אחרי צעד
- לוגיקה מורכבת עם הרבה if/else
- מערכות הפעלה, אפליקציות כלליות
- משימות שדורשות low latency לכל פעולה בודדת

### GPU -- אלפי ליבות פשוטות

**Graphics Processing Unit** -- מעבד שמתמחה ב**עבודה מקבילית**.

```
GPU (למשל NVIDIA H100):
┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐
│ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ │
└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘
┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐
│ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ ││ │
└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘
... (אלפי ליבות נוספות)

כל ליבה: פשוטה וחלשה
אבל כולן עובדות ביחד על אותה משימה
10,000+ ליבות ב-GPU מודרני
```

**מתאים ל:**

- משימות מקביליות (parallel) -- אותה פעולה על הרבה נתונים
- עיבוד גרפי (המטרה המקורית)
- אימון מודלי ML
- כפל מטריצות (matrix multiplication)

### ארכיטקטורת GPU מבפנים

```
NVIDIA GPU Architecture (Simplified):
┌──────────────────────────────────────────────────────┐
│  GPU                                                  │
│  ┌──────────────────────────────────────────────┐    │
│  │ GPC (Graphics Processing Cluster)             │    │
│  │  ┌────────────┐  ┌────────────┐              │    │
│  │  │    SM #1    │  │    SM #2    │  ...        │    │
│  │  │ (Streaming  │  │ (Streaming  │             │    │
│  │  │  Multiproc) │  │  Multiproc) │             │    │
│  │  │  128 CUDA   │  │  128 CUDA   │             │    │
│  │  │  Cores      │  │  Cores      │             │    │
│  │  │  4 Tensor   │  │  4 Tensor   │             │    │
│  │  │  Cores      │  │  Cores      │             │    │
│  │  │  L1 Cache   │  │  L1 Cache   │             │    │
│  │  └────────────┘  └────────────┘              │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  ┌─────────────────┐  ┌────────────────────────────┐ │
│  │   L2 Cache      │  │  HBM (VRAM) 80GB           │ │
│  │   50 MB          │  │  High Bandwidth Memory     │ │
│  └─────────────────┘  │  ~3 TB/s bandwidth          │ │
│                        └────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**מושגים חשובים:**

| מושג | הסבר |
|------|------|
| **SM** (Streaming Multiprocessor) | יחידת עיבוד בסיסית, מכילה עשרות CUDA Cores |
| **CUDA Core** | ליבת חישוב בודדת -- float add/multiply |
| **Tensor Core** | יחידת חישוב מיוחדת ל-matrix multiply (מהירה x10) |
| **VRAM / HBM** | זיכרון ה-GPU -- bandwidth גבוה מאוד אבל קיבולת מוגבלת |
| **Warp** | קבוצה של 32 threads שרצים יחד (SIMT) |

### למה ML צריך GPU?

הסוד: רשתות נוירונים זה בעצם **המון כפל מטריצות**.

```
Forward pass של שכבה ברשת נוירונים:
output = input @ weights + bias

input:   מטריצה של [batch_size x input_dim]
weights: מטריצה של [input_dim x output_dim]

כפל מטריצות = אלפי פעולות כפל וחיבור
שאפשר לבצע במקביל!
```

!!! note "דוגמה מספרית"
    כפל מטריצה 1000x1000 במטריצה 1000x1000 דורש **מיליארד** פעולות כפל וחיבור.
    על CPU (16 ליבות): עושים 16 פעולות במקביל.
    על GPU (10,000 ליבות): עושים 10,000 פעולות במקביל.
    ההבדל: שעות מול דקות.

### CUDA -- תכנות GPU

**CUDA** (Compute Unified Device Architecture) -- הפלטפורמה של NVIDIA לתכנות GPU.

```python
# בלי GPU (PyTorch על CPU)
import torch
x = torch.randn(10000, 10000)
y = torch.randn(10000, 10000)
z = x @ y  # כפל מטריצות -- איטי על CPU

# עם GPU (PyTorch על CUDA)
x = torch.randn(10000, 10000).cuda()  # מעביר ל-GPU
y = torch.randn(10000, 10000).cuda()
z = x @ y  # כפל מטריצות -- מהיר על GPU!
```

??? tip "לא חייבים לכתוב CUDA ישירות"
    רוב המפתחים לא כותבים קוד CUDA ישירות. ספריות כמו **PyTorch**, **TensorFlow**, ו-**JAX** מטפלות בזה בשבילכם. מספיק לכתוב `.cuda()` או `.to('cuda')` כדי להעביר חישוב ל-GPU.

### ה-Software Stack של GPU

```
┌─────────────────────────────────────────────┐
│  Application Layer                           │
│  PyTorch / TensorFlow / JAX                 │
├─────────────────────────────────────────────┤
│  High-Level Libraries                        │
│  cuDNN (Deep Learning) | cuBLAS (Linear Alg)│
│  NCCL (Multi-GPU Comm) | TensorRT (Infer)   │
├─────────────────────────────────────────────┤
│  CUDA Runtime API                            │
│  Memory management, kernel launch, sync      │
├─────────────────────────────────────────────┤
│  CUDA Driver                                 │
├─────────────────────────────────────────────┤
│  GPU Hardware (NVIDIA)                       │
└─────────────────────────────────────────────┘
```

**ספריות NVIDIA חשובות:**

| ספריה | תפקיד | למי חשוב |
|--------|--------|----------|
| **cuDNN** | אופטימיזציה ל-Deep Learning ops | כל מי שמאמן מודלים |
| **cuBLAS** | Linear Algebra מואץ | חישובי מטריצות כלליים |
| **NCCL** | תקשורת בין GPU-ים | Multi-GPU training |
| **TensorRT** | Inference optimization | Deploy מודלים ל-production |
| **Triton** (NVIDIA) | Inference server | שרת inference מוכן |

### Multi-GPU -- כשמודל אחד לא נכנס

```
מודל גדול (LLM) על כמה GPU-ים:

Data Parallelism:                  Model Parallelism (Tensor):
┌─────────┐ ┌─────────┐          ┌─────────┐ ┌─────────┐
│  GPU 0  │ │  GPU 1  │          │  GPU 0  │ │  GPU 1  │
│  Model  │ │  Model  │          │ Layer 1 │ │ Layer 1 │
│ (copy)  │ │ (copy)  │          │ (half)  │ │ (half)  │
│ Batch A │ │ Batch B │          │ Layer 2 │ │ Layer 2 │
└────┬────┘ └────┬────┘          │ (half)  │ │ (half)  │
     │           │                └────┬────┘ └────┬────┘
     └─────┬─────┘                     └─────┬─────┘
     Sync Gradients                   Sync Activations
```

```python
# Data Parallel -- פשוט ב-PyTorch
import torch.nn as nn
model = MyModel()

# פיזור על כל ה-GPU-ים הזמינים
model = nn.DataParallel(model)  # פשוט אבל לא יעיל

# Distributed Data Parallel -- יותר מתקדם ויעיל
model = nn.parallel.DistributedDataParallel(model)

# בדיקת GPU-ים זמינים
print(f"GPUs available: {torch.cuda.device_count()}")
for i in range(torch.cuda.device_count()):
    print(f"  GPU {i}: {torch.cuda.get_device_name(i)}")
    print(f"  VRAM: {torch.cuda.get_device_properties(i).total_mem / 1e9:.1f} GB")
```

### ניטור GPU -- nvidia-smi

```bash
# הפקודה הכי חשובה -- סטטוס כל ה-GPU-ים
nvidia-smi

# +-----------------------------------------------------------------------------+
# | NVIDIA-SMI 535.104.05   Driver Version: 535.104.05   CUDA Version: 12.2     |
# |-------------------------------+----------------------+----------------------+
# | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp   Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
# |===============================+======================+======================|
# |   0  NVIDIA A100-SXM4-80GB On | 00000000:00:04.0 Off |                    0 |
# | N/A   32C    P0    52W / 400W |  72000MiB / 81920MiB |     95%      Default |
# +-------------------------------+----------------------+----------------------+

# ניטור רציף (כל שנייה)
nvidia-smi -l 1

# ניטור בפורמט מקוצר
watch -n1 nvidia-smi --query-gpu=gpu_name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv

# בדיקת CUDA version
nvcc --version
# nvcc: NVIDIA (R) Cuda compiler driver
# Cuda compilation tools, release 12.2, V12.2.140
```

??? tip "nvidia-smi -- מה לחפש?"
    - **GPU-Util** -- אחוז ניצול ה-GPU. אם זה נמוך בזמן training, יש bottleneck אחר (data loading?)
    - **Memory-Usage** -- כמה VRAM בשימוש. אם מלא ותקבלו OOM, צריך batch size קטן יותר
    - **Temperature** -- מעל 85C זה חם מדי. GPU ידווש (throttle) את עצמו
    - **Power** -- צריכת חשמל. GPU בעומס מלא צורך 300-700W

### השוואה מסכמת

| תכונה | CPU | GPU |
|--------|-----|-----|
| מספר ליבות | 4-128 | 1,000-20,000+ |
| עוצמת ליבה בודדת | גבוהה מאוד | נמוכה |
| סוג עבודה | Sequential, מגוון | Parallel, אחיד |
| זיכרון | גישה ל-RAM המערכת (TB) | VRAM נפרד (16-80 GB) |
| Bandwidth | ~50 GB/s (DDR5) | ~2-3 TB/s (HBM3) |
| מתאים ל | אפליקציות כלליות | ML, גרפיקה, חישובים מקביליים |
| עלות | מאות $ | אלפי-עשרות אלפי $ |
| צריכת חשמל | 65-350W | 300-700W |

### GPU-ים פופולריים ל-ML

```
סדרת NVIDIA ל-Data Centers:

Model       VRAM    Tensor Cores   FP16 TFLOPS   מחיר (בקירוב)    שימוש
─────────────────────────────────────────────────────────────────────────
T4          16 GB   320            65             ~$2,000          Inference
A10         24 GB   288            125            ~$3,500          Inference + Fine-tune
A100        80 GB   432            312            ~$15,000         Training + Inference
H100        80 GB   528            990            ~$30,000         Large Model Training
H200        141 GB  528            990            ~$35,000+        LLM Training

ענן (לשעה):
T4:    ~$0.50/hr    (Google Colab נותן חינם!)
A100:  ~$3.50/hr    (AWS p4d, GCP a2)
H100:  ~$5.00/hr    (AWS p5, GCP a3)
```

## בלבולים נפוצים

- **"GPU תמיד יותר מהיר מ-CPU"** -- לא. GPU מהיר רק כשיש **הרבה עבודה מקבילית**. למשימות סדרתיות (סקריפט Python רגיל, web server) ה-CPU מהיר יותר.
- **"צריך GPU בשביל לעשות inference"** -- לא תמיד. מודלים קטנים רצים מצוין על CPU. GPU חיוני בעיקר ל-training ול-inference של מודלים גדולים.
- **"CUDA זה שפת תכנות"** -- CUDA הוא פלטפורמה שכוללת שפה (הרחבה של C/C++), ספריות, וכלים. אבל רוב המפתחים משתמשים בו דרך ספריות Python.
- **"כל GPU מתאים ל-ML"** -- לא. ה-GPU של המחשב הביתי (gaming GPU) עובד, אבל GPU-ים ל-data centers כמו NVIDIA A100 או H100 הם הרבה יותר מתאימים (יותר VRAM, תמיכה ב-Tensor Cores).
- **"AMD GPUs לא מתאימים ל-ML"** -- AMD משתפרים עם ROCm, אבל האקוסיסטם של NVIDIA (CUDA + cuDNN + NCCL) עדיין הרבה יותר בשל ונפוץ.

!!! warning "VRAM הוא המגבלה"
    המגבלה העיקרית ב-GPU ל-ML היא כמות ה-**VRAM** (Video RAM). מודל גדול כמו LLM דורש עשרות GB של VRAM. אם המודל לא נכנס ל-VRAM, צריך לפצל אותו בין כמה GPU-ים.

### כמה VRAM צריך?

```
גודל מודל (parameters) vs VRAM נדרש (inference, FP16):

1B params   -->  ~2 GB   VRAM  (T4 מספיק)
7B params   -->  ~14 GB  VRAM  (T4 בדוחק, A10 בנוחות)
13B params  -->  ~26 GB  VRAM  (A100 40GB)
70B params  -->  ~140 GB VRAM  (2x A100 80GB)
405B params -->  ~810 GB VRAM  (8x H100 80GB + NVLink)

Training דורש פי 3-4 יותר VRAM מ-inference!
(gradients + optimizer states + activations)
```

## דוגמה קטנה

```python
import torch
import time

size = 10000

# --------- CPU ---------
a_cpu = torch.randn(size, size)
b_cpu = torch.randn(size, size)

start = time.time()
c_cpu = a_cpu @ b_cpu
cpu_time = time.time() - start
print(f"CPU: {cpu_time:.2f} seconds")

# --------- GPU ---------
if torch.cuda.is_available():
    a_gpu = torch.randn(size, size, device='cuda')
    b_gpu = torch.randn(size, size, device='cuda')

    torch.cuda.synchronize()  # מוודא שהכל מוכן
    start = time.time()
    c_gpu = a_gpu @ b_gpu
    torch.cuda.synchronize()  # מחכה שה-GPU יסיים
    gpu_time = time.time() - start
    print(f"GPU: {gpu_time:.2f} seconds")
    print(f"GPU faster by {cpu_time / gpu_time:.1f}x")

# תוצאה טיפוסית:
# CPU: 4.52 seconds
# GPU: 0.08 seconds
# GPU faster by 56.5x
```

### דוגמה מעשית -- אימון מודל עם GPU

```python
import torch
import torch.nn as nn
import torch.optim as optim

# בדיקת GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")
if device.type == 'cuda':
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"VRAM: {torch.cuda.get_device_properties(0).total_mem / 1e9:.1f} GB")

# מודל פשוט
model = nn.Sequential(
    nn.Linear(784, 512),
    nn.ReLU(),
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Linear(256, 10)
).to(device)  # <-- העברה ל-GPU!

# Optimizer
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

# Training loop
for epoch in range(10):
    # הנתונים חייבים להיות על אותו device כמו המודל!
    inputs = torch.randn(64, 784).to(device)   # batch על GPU
    labels = torch.randint(0, 10, (64,)).to(device)

    optimizer.zero_grad()
    outputs = model(inputs)
    loss = criterion(outputs, labels)
    loss.backward()      # <-- GPU מחשב gradients
    optimizer.step()

    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")
```

??? tip "טעות נפוצה -- Mixed devices"
    ```python
    # זה יקרוס!
    model = model.cuda()
    x = torch.randn(64, 784)  # על CPU!
    output = model(x)  # RuntimeError: Input and model on different devices!

    # הפתרון: לוודא שגם הנתונים על GPU
    x = torch.randn(64, 784).cuda()
    output = model(x)  # עובד!
    ```

## 🛤️ מאיפה מתחילים

1. **שלב ראשון**: התקינו PyTorch עם תמיכה ב-CUDA -- `pip install torch` (בודק GPU אוטומטית)
2. **שלב שני**: הריצו `torch.cuda.is_available()` -- אם True, יש לכם GPU שעובד
3. **שלב שלישי**: נסו Google Colab (חינם) -- מקבלים T4 GPU בלי להתקין כלום
4. **שלב רביעי**: הריצו benchmark פשוט -- כפל מטריצות CPU vs GPU, תראו את ההבדל
5. **שלב חמישי**: אמנו מודל קטן (MNIST) על GPU -- תבינו את הזרימה: data -> GPU, model -> GPU, train

??? tip "משאבים מומלצים"
    - **Google Colab** -- GPU חינם לניסויים
    - **NVIDIA CUDA Programming Guide** -- ללמוד CUDA לעומק
    - **fast.ai** -- קורס ML מעשי שמשתמש ב-GPU
    - **Lambda Labs GPU Cloud** -- GPU-ים זולים בענן

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל העיקרי בין CPU ל-GPU?"
    CPU יש מעט ליבות חזקות (4-128) שמתאימות לעבודה סדרתית ומגוונת. GPU יש אלפי ליבות פשוטות (1,000-20,000+) שמתאימות לעבודה מקבילית אחידה. CPU מצטיין ב-latency נמוכה לפעולה בודדת, GPU מצטיין ב-throughput גבוה על הרבה נתונים במקביל. למשימות כמו web server ה-CPU עדיף, למשימות כמו כפל מטריצות (ML training) ה-GPU עדיף.

??? tip "למה GPU מתאים ל-Machine Learning?"
    רשתות נוירונים בעיקרן הן סדרות של כפל מטריצות (matrix multiplication). כל forward pass, backward pass, ו-gradient update מערבים חישובים על מטריצות גדולות. הפעולות האלה ניתנות למקביליות (parallelizable) -- אפשר לחשב הרבה פעולות כפל-חיבור בו-זמנית. GPU עם אלפי ליבות מבצע את זה מהר פי 10-100 מ-CPU. בנוסף, Tensor Cores ב-GPU-ים מודרניים מואצים כפל מטריצות עוד יותר.

??? tip "מה זה CUDA ומה ה-ecosystem שמסביבו?"
    CUDA הוא פלטפורמת NVIDIA לחישוב כללי על GPU. כולל runtime, compiler (nvcc), וספריות: cuDNN (deep learning), cuBLAS (linear algebra), NCCL (multi-GPU communication), TensorRT (inference optimization). רוב המפתחים לא כותבים CUDA ישירות אלא משתמשים דרך PyTorch/TensorFlow שקוראים ל-CUDA ברקע.

??? tip "מה זה VRAM ולמה הוא מגביל?"
    VRAM (Video RAM) הוא הזיכרון הפנימי של ה-GPU. ב-training צריך VRAM ל: המודל עצמו, activations, gradients, ו-optimizer states. מודל 7B parameters צריך ~14GB ל-inference ו-~56GB ל-training. אם אין מספיק VRAM: OOM error. הפתרונות: batch size קטן יותר, mixed precision (FP16), gradient checkpointing, model parallelism (פיצול בין GPU-ים), או quantization.

??? tip "מה ההבדל בין Data Parallelism ל-Model Parallelism?"
    **Data Parallelism** -- כל GPU מחזיק עותק מלא של המודל, כל אחד מעבד batch אחר, ומסנכרנים gradients. פשוט למימוש, מתאים כשהמודל נכנס ב-GPU אחד.
    **Model Parallelism** -- המודל מפוצל בין GPU-ים (שכבות שונות או חלקים של שכבה). מאפשר מודלים שלא נכנסים ב-GPU אחד, אבל מורכב יותר וצריך תקשורת בין GPU-ים.
    **Pipeline Parallelism** -- שילוב: שכבות שונות על GPU-ים שונים, עם micro-batches שזורמים בינ pipeline.

??? tip "איך מאיצים inference של מודל ב-production?"
    כמה טכניקות: **Quantization** -- המרת weights מ-FP32 ל-FP16/INT8 (חצי VRAM, כפול מהירות). **TensorRT** -- אופטימיזציה של graph ל-inference. **Batching** -- צבירת requests ועיבוד ביחד (ניצול GPU טוב יותר). **KV Cache** -- שמירת חישובי attention קודמים (ספציפי ל-LLMs). **Model Distillation** -- אימון מודל קטן שמחקה מודל גדול.

??? tip "מה ההבדל בין gaming GPU ל-data center GPU?"
    Gaming GPUs (GeForce RTX) מתאימים ל-ML קטן אבל חסרים: כמות VRAM גדולה (8-24GB vs 40-80GB), Tensor Cores ייעודיים (יש ב-RTX אבל פחות), ECC memory, NVLink לחיבור בין GPU-ים, ואחריות enterprise. Data center GPUs (A100, H100) מיועדים ל-24/7 workloads, יש להם bandwidth גבוה יותר (HBM vs GDDR), ותמיכה ב-multi-instance (MIG). המחיר: gaming ~$1,500, data center ~$15,000-$30,000.

## קישורים לנושאים אחרים

- [יסודות חומרה](hardware-basics.md) -- הבסיס: CPU, RAM, Storage
- [מאיצים - FPGA & TPU](accelerators-fpga-tpu.md) -- חלופות ל-GPU
- [Parallel vs Serial](../01-algorithmics/parallel-vs-serial.md) -- העקרון התיאורטי מאחורי הביצועים
- [רשתות נוירונים](../02-ml-core/neural-networks.md) -- למה ML צריך את כל כוח החישוב הזה
