# מקבילי מול סדרתי (Parallel vs Serial)

## למה זה חשוב

עד שנות ה-2000, מעבדים הפכו מהירים יותר בכל שנה — פשוט העלו את תדר השעון. אבל הגענו לגבול פיזיקלי. הפתרון? **להריץ דברים במקביל**.

היום, כל טלפון חכם מכיל מעבד עם מספר ליבות, וכרטיסי GPU מכילים **אלפי** ליבות. בלי הבנה של Parallelism, אתם משתמשים בליבה אחת בלבד ומבזבזים את רוב כוח החישוב שעומד לרשותכם.

הנושא הזה קריטי במיוחד ב-Machine Learning, שם אימון מודלים דורש כוח חישוב עצום.

## רעיונות מרכזיים

### Serial Execution — ריצה סדרתית

פעולה אחת אחרי השנייה, בסדר קבוע:

```
משימה A ──────→ משימה B ──────→ משימה C ──────→ סיום

זמן כולל = A + B + C
```

- פשוט להבנה ולתכנות
- קל לעשות Debug
- לא מנצל מספר ליבות

### Parallel Execution — ריצה מקבילית

מספר פעולות **באותו הזמן**, על ליבות/מעבדים שונים:

```
משימה A ──────→ ─┐
משימה B ──────→ ─┼──→ סיום
משימה C ──────→ ─┘

זמן כולל = max(A, B, C)
```

- מנצל מספר ליבות
- מורכב יותר לתכנות
- דורש סנכרון בין Tasks

### Concurrency vs Parallelism

!!! warning "זה לא אותו דבר!"
    - **Concurrency** (מקביליות לוגית) — ניהול של **מספר משימות שמתקדמות** — לאו דווקא באותו רגע. כמו טבח אחד שמכין שלושה מנות ומתחלף ביניהן.
    - **Parallelism** (מקביליות פיזית) — **ביצוע בפועל** של מספר משימות באותו רגע. כמו שלושה טבחים שכל אחד מכין מנה.

    Concurrency אפשרי גם על ליבה אחת (באמצעות Context Switching).
    Parallelism דורש מספר ליבות בפועל.

### למה GPUs הם מקביליים

| | CPU | GPU |
|--|-----|-----|
| מספר ליבות | 4–16 (טיפוסי) | **אלפים** |
| סוג הליבות | חזקות ומורכבות | פשוטות ומהירות |
| מתאים ל... | משימות מגוונות וסדרתיות | משימות **זהות** על נתונים רבים |

??? tip "למה GPU מושלם ל-Deep Learning?"
    ב-Neural Network, כל שכבה מבצעת **אלפי כפלים וחיבורים** על מטריצות. כל פעולה כזו עצמאית מהאחרות — מה שמאפשר ל-GPU לחשב את כולן **בו זמנית**. זו הסיבה שאימון Deep Learning על GPU מהיר פי 10–100 מאשר על CPU.

### Amdahl's Law — פשוט

חוק Amdahl אומר שה-Speedup מ-Parallelism מוגבל על ידי **החלק הסדרתי** של התוכנית.

```
Speedup = 1 / (S + P/N)

S = החלק שחייב להיות סדרתי (0 עד 1)
P = החלק שניתן למקבל (P = 1 - S)
N = מספר הליבות
```

!!! note "דוגמה מספרית"
    אם 90% מהתוכנית ניתנת למקבול (S = 0.1):

    | ליבות (N) | Speedup |
    |-----------|---------|
    | 2 | 1.82x |
    | 4 | 3.08x |
    | 10 | 5.26x |
    | 100 | 9.17x |
    | ∞ | **10x** (מקסימום!) |

    גם עם אינסוף ליבות, לא נעבור Speedup של 10x — כי ה-10% הסדרתיים הם צוואר הבקבוק.

!!! warning "המסקנה המעשית"
    לפני שמשקיעים ב-Parallelism, כדאי לנתח **כמה מהתוכנית באמת ניתן למקבל**. שיפור של החלק הסדרתי לפעמים שווה יותר מהוספת ליבות.

## בלבולים נפוצים

- **"יותר Threads = יותר מהיר"** — לא בהכרח. יותר מדי Threads גורמים ל-Overhead של Context Switching, סנכרון, ותחרות על משאבים. יש נקודה שאחריה הביצועים דווקא **יורדים**.
- **"Async ב-Python זה Parallelism"** — לא. `asyncio` ב-Python הוא **Concurrency** (ליבה אחת שמתחלפת בין משימות). ל-Parallelism אמיתי צריך `multiprocessing`, בגלל ה-GIL.
- **"Parallelism פותר הכל"** — יש בעיות שהן **inherently sequential** — כל צעד תלוי בתוצאה של הקודם. במקרה כזה, Parallelism לא עוזר.

## דוגמה קטנה

נניח שרוצים לחשב סכום של מערך עם מיליון מספרים:

```python
# סדרתי — O(n) על ליבה אחת
def sum_serial(arr):
    total = 0
    for num in arr:
        total += num
    return total

# מקבילי (רעיון) — מחלקים ומחברים
def sum_parallel(arr, num_workers=4):
    # שלב 1: מחלקים את המערך ל-4 חלקים
    chunks = split(arr, num_workers)

    # שלב 2: כל worker מסכם את החלק שלו (במקביל!)
    partial_sums = parallel_map(sum, chunks)

    # שלב 3: מחברים את התוצאות (סדרתי)
    return sum(partial_sums)
```

??? tip "למה שלב 3 חייב להיות סדרתי?"
    חייבים לחכות שכל ה-Workers יסיימו לפני שמחברים. זה ה-**S** בחוק Amdahl — החלק הסדרתי שמגביל את ה-Speedup. ככל שהמערך גדול יותר, שלב 3 הופך לזניח ביחס לשלב 2, וה-Speedup גדל.

## קישורים לנושאים אחרים

- [מהי אלגוריתמיקה](what-is-algorithmics.md) — Parallelism הוא כלי נוסף בארגז הכלים האלגוריתמי
- [CPU vs GPU](../04-systems/cpu-vs-gpu.md) — הבדלי הארכיטקטורה שמאפשרים Parallelism
- [אלגוריתמים ב-ML](algorithms-in-ml.md) — למה אימון מודלים דורש חישוב מקבילי

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מערכות הפעלה — processes, threads, scheduling, synchronization
    - ארכיטקטורת מחשבים — pipelines, caches, multi-core
    - אלגוריתמים מקביליים — parallel algorithms, PRAM model
    - מבוא למדעי המחשב — concurrency basics

    **קורסים מומלצים:**
    - חישוב מבוזר (Distributed Systems) — consensus, replication
    - GPU Computing / CUDA — massive parallelism
    - High Performance Computing (HPC) — MPI, OpenMP

    **ידע מעשי:**
    - Python multiprocessing / threading
    - CUDA / OpenCL basics
    - Docker + Kubernetes (container orchestration)
    - Apache Spark / Dask — distributed data processing

---

## 🛤️ מאיפה מתחילים

1. **Python `threading` ו-`multiprocessing`** — ניסוי מעשי
2. **"Operating Systems: Three Easy Pieces"** — ספר חינמי מצוין
3. **CUDA Toolkit Getting Started** — GPU programming
4. **MIT 6.824: Distributed Systems** — קורס מתקדם (חינמי)
5. **LeetCode concurrency problems** — תרגול

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Concurrency ל-Parallelism?"
    **Concurrency** — ניהול מספר משימות שחופפות בזמן (לא בהכרח במקביל). **Parallelism** — ביצוע בו-זמני ממש (multi-core). Concurrency = structure, Parallelism = execution. Go routines הן concurrent; GPU threads הם parallel.

??? tip "מה חוק Amdahl?"
    `Speedup = 1 / (S + (1-S)/P)` כאשר S = החלק הסדרתי, P = מספר processors. אפילו עם אינסוף processors, ה-speedup מוגבל ל-1/S. עם 10% סדרתי, מקסימום speedup = 10x. מסקנה: שיפור החלק הסדרתי חשוב יותר מהוספת processors.

??? tip "מה Race Condition ואיך נמנעים?"
    שני threads ניגשים למשאב משותף בו-זמנית ומייצרים תוצאה לא צפויה. פתרונות: **Mutex/Lock** (מנעול), **Semaphore** (מונה), **Atomic operations**, **Message passing** (ללא shared state). Go מעדיף "share by communicating" על "communicate by sharing".

??? tip "מה Deadlock ומה 4 התנאים שלו?"
    מצב שבו 2+ threads ממתינים אחד לשני ואף אחד לא מתקדם. 4 תנאי Coffman: (1) Mutual exclusion, (2) Hold and wait, (3) No preemption, (4) Circular wait. מספיק לשבור תנאי אחד כדי למנוע.

??? tip "מה GIL ב-Python?"
    **Global Interpreter Lock** — מנעול שמונע ריצה מקבילית של Python bytecode. Threading ב-Python = concurrency (לא parallelism). פתרונות: `multiprocessing` (processes נפרדים), C extensions, `asyncio` (I/O bound), Cython, או שפות אחרות.

??? tip "מה MapReduce?"
    מודל חישוב מבוזר: (1) **Map** — מפעיל פונקציה על כל element, (2) **Shuffle** — מקבץ לפי key, (3) **Reduce** — מצמצם כל קבוצה לערך אחד. דוגמה: ספירת מילים. Hadoop = implementation; Spark = improved (in-memory).
