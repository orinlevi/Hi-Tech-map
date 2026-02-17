# סיבוכיות (Complexity)

## למה זה חשוב

כשאתם כותבים קוד, השאלה הראשונה היא "האם זה עובד?". השאלה השנייה — והחשובה לא פחות — היא **"האם זה יעבוד גם כשהנתונים יגדלו?"**.

סיבוכיות נותנת לנו שפה מדויקת לדבר על ביצועים. בלי להבין סיבוכיות, אתם עלולים לכתוב קוד שעובד מצוין ב-development ומתמוטט ב-production.

!!! tip "מציאות התעשייה"
    כמעט כל באג ביצועים חמור שראיתי ב-production נבע מאלגוריתם עם סיבוכיות גבוהה מדי על נתונים אמיתיים. הקוד עבד מצוין על 100 רשומות בטסטים — וקרס על 10 מיליון רשומות ב-production. "אבל על המחשב שלי זה עבד מהר!" — המשפט האהוב על כל מפתח לפני שהוא לומד סיבוכיות.

## רעיונות מרכזיים

### Big-O Notation — בפשטות

**Big-O** מתאר את **קצב הגדילה** של זמן הריצה ביחס לגודל הקלט. הוא לא אומר "כמה שניות", אלא **"מה קורה כשהקלט גדל"**.

!!! note "הכלל המנחה"
    Big-O מתעלם מקבועים ומאיברים קטנים יותר:

    - `3n + 5` → **O(n)**
    - `2n² + 100n + 42` → **O(n²)**

    כי כשה-n מספיק גדול, רק האיבר הדומיננטי משנה.

### כיצד מחשבים Big-O — שלב אחר שלב

הנה מדריך מעשי לחישוב סיבוכיות:

**כלל 1: לולאה פשוטה = O(n)**
```python
for i in range(n):       # O(n)
    print(i)             # O(1)
# סה"כ: O(n)
```

**כלל 2: לולאות מקוננות = מכפלה**
```python
for i in range(n):       # O(n)
    for j in range(n):   # O(n)
        print(i, j)      # O(1)
# סה"כ: O(n) * O(n) = O(n²)
```

**כלל 3: לולאות ברצף = חיבור (לוקחים את הדומיננטי)**
```python
for i in range(n):       # O(n)
    print(i)

for i in range(n):       # O(n)
    for j in range(n):   # O(n)
        print(i, j)
# סה"כ: O(n) + O(n²) = O(n²)
```

**כלל 4: חצייה בכל שלב = O(log n)**
```python
i = n
while i > 1:             # O(log n)
    i = i // 2
# סה"כ: O(log n)
```

**כלל 5: רקורסיה — משתמשים ב-Master Theorem**
```python
def func(n):
    if n <= 1:
        return 1
    return func(n // 2) + func(n // 2)  # T(n) = 2T(n/2) + O(1) → O(n)
```

??? tip "Master Theorem בקצרה"
    עבור רקורסיה מהסוג T(n) = a*T(n/b) + O(n^d):

    - אם d < log_b(a) → O(n^{log_b(a)})
    - אם d = log_b(a) → O(n^d * log n)
    - אם d > log_b(a) → O(n^d)

    **דוגמה**: Merge Sort: T(n) = 2T(n/2) + O(n) → a=2, b=2, d=1 → d = log₂2 = 1 → **O(n log n)**

### הסיבוכיויות הנפוצות

| סיבוכיות | שם | דוגמה | תחושה |
|-----------|------|-------|--------|
| **O(1)** | Constant | גישה לאיבר במערך לפי אינדקס | מיידי, תמיד |
| **O(log n)** | Logarithmic | Binary Search | מהיר מאוד, גם על מיליונים |
| **O(n)** | Linear | חיפוש ברשימה לא ממוינת | סביר, גדל ליניארית |
| **O(n log n)** | Linearithmic | Merge Sort, Quick Sort (avg) | המהירות הטובה ביותר למיון כללי |
| **O(n²)** | Quadratic | Bubble Sort, לולאה כפולה | איטי, בעייתי על נתונים גדולים |
| **O(2ⁿ)** | Exponential | Brute-force על כל תת-קבוצות | לא ישים מעבר ל-n קטן |
| **O(n!)** | Factorial | כל הפרמוטציות | רק על n קטן מאוד (< 15) |

```
O(2ⁿ) |                                          *
       |                                     *
O(n²)  |                                *
       |                          *
O(n log n) |                   *
       |               *
O(n)   |          *
       |     *
O(log n)|  *
O(1)   |*─────────────────────────────────────
       └──────────────────────────────────────→ n
```

### מה זה אומר במספרים אמיתיים?

כדי לקבל אינטואיציה, הנה כמה מספרים עבור n = 1,000,000 (מיליון):

| סיבוכיות | מספר פעולות | זמן (בערך, 10⁹ פעולות/שנייה) |
|-----------|------------|-------------------------------|
| **O(1)** | 1 | 1 ננו-שנייה |
| **O(log n)** | 20 | 20 ננו-שנייה |
| **O(n)** | 1,000,000 | 1 מילי-שנייה |
| **O(n log n)** | 20,000,000 | 20 מילי-שניות |
| **O(n²)** | 10¹² | ~17 דקות |
| **O(2ⁿ)** | 10³⁰⁰⁰⁰⁰ | יותר מגיל היקום. בהרבה. |

!!! tip "פרספקטיבה"
    O(2ⁿ) על n = מיליון — זה מספר כל כך גדול, שאם כל אטום ביקום היה מחשב ומתחיל לספור מהמפץ הגדול, עדיין לא היינו מגיעים לתשובה. אז כן, סיבוכיות חשובה.

### Time Complexity vs Space Complexity

- **Time Complexity** — כמה **צעדים** האלגוריתם מבצע
- **Space Complexity** — כמה **זיכרון** האלגוריתם צורך

??? tip "Trade-off קלאסי: זמן מול זיכרון"
    לפעמים אפשר לזרז אלגוריתם על ידי שימוש בזיכרון נוסף. לדוגמה:

    - חיפוש ברשימה: O(n) זמן, O(1) זיכרון
    - חיפוש ב-Hash Table: O(1) זמן, O(n) זיכרון

    זו החלטה תכנונית — מה יותר חשוב לכם?

#### Space Complexity — הסבר מעמיק

Space Complexity מודד את **הזיכרון הנוסף** שהאלגוריתם צורך (מעבר לקלט עצמו):

```python
# O(1) Space — משתמשים רק בכמה משתנים
def find_max(arr):
    max_val = arr[0]         # O(1) זיכרון נוסף
    for item in arr:
        if item > max_val:
            max_val = item
    return max_val

# O(n) Space — יוצרים מערך חדש
def reverse_array(arr):
    result = []               # O(n) זיכרון נוסף
    for i in range(len(arr) - 1, -1, -1):
        result.append(arr[i])
    return result

# O(n) Space — In-Place (O(1) זיכרון נוסף!)
def reverse_in_place(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
```

!!! note "In-Place Algorithms"
    אלגוריתם שעובד **In-Place** משתמש ב-O(1) זיכרון נוסף — הוא משנה את הקלט ישירות במקום ליצור עותק. Quick Sort הוא In-Place (בניגוד ל-Merge Sort שצריך O(n) זיכרון נוסף). זו הסיבה שבפועל Quick Sort נבחר הרבה פעמים על פני Merge Sort, למרות ש-Worst Case שלו גרוע יותר.

### Best / Average / Worst Case

לאותו אלגוריתם יכולים להיות ביצועים שונים בהתאם לקלט:

| מקרה | Quick Sort | חיפוש ליניארי |
|------|-----------|---------------|
| **Best Case** | O(n log n) | O(1) — האיבר הראשון |
| **Average Case** | O(n log n) | O(n/2) → O(n) |
| **Worst Case** | O(n²) | O(n) — האיבר האחרון |

!!! warning "Worst Case חשוב!"
    בראיונות עבודה וב-System Design, כשאומרים "הסיבוכיות של האלגוריתם" מתכוונים בדרך כלל ל-**Worst Case**, אלא אם נאמר אחרת.

### Big-O, Big-Omega, Big-Theta — מה ההבדל?

Big-O הוא לא הסימון היחיד. יש שלושה סימונים אסימפטוטיים:

| סימון | משמעות | אנלוגיה |
|-------|--------|---------|
| **O (Big-O)** | **גבול עליון** — "לכל היותר" | הקפה עולה **עד** 20 שקל |
| **Omega (Big-Omega)** | **גבול תחתון** — "לפחות" | הקפה עולה **לפחות** 5 שקל |
| **Theta (Big-Theta)** | **גבול הדוק** — "בדיוק" | הקפה עולה **בערך** 12 שקל |

??? example "דוגמה מספרית"
    עבור Merge Sort:

    - **O(n log n)** — במקרה הגרוע, לוקח לכל היותר n log n צעדים (פרופורציונלית)
    - **Omega(n log n)** — במקרה הטוב, לוקח לפחות n log n צעדים
    - **Theta(n log n)** — תמיד לוקח n log n צעדים (Best = Worst = Average)

    לעומת זאת, Quick Sort:

    - **O(n²)** — במקרה הגרוע
    - **Omega(n log n)** — במקרה הטוב
    - **אין Theta** — כי Best ≠ Worst

### Amortized Analysis — ניתוח ממוצע מופחת

לפעמים פעולה יחידה יקרה, אבל **בממוצע** על סדרת פעולות — זה זול.

```python
# Dynamic Array (Python list.append)
arr = []
for i in range(n):
    arr.append(i)  # בדרך כלל O(1), לפעמים O(n) כשצריך resize
```

!!! note "Amortized O(1)"
    `list.append()` ב-Python הוא O(1) **amortized**: רוב הזמן זה O(1), אבל כשהמערך מלא, Python מקצה מערך חדש בגודל כפול ומעתיק הכל — O(n). אבל ה-resize הבא יקרה רק אחרי עוד n הוספות, אז **בממוצע** כל הוספה עולה O(1).

    זה כמו לשלם על ביטוח רכב: רוב החודשים משלמים סכום קטן, פעם ב-X שנים יש תביעה גדולה — אבל **בממוצע**, העלות לחודש נמוכה.

## בלבולים נפוצים

- **"O(n) תמיד מהיר מ-O(n²)"** — לא בהכרח לכל n. עבור n קטן, אלגוריתם O(n²) עם קבוע קטן יכול להיות מהיר יותר מ-O(n) עם קבוע גדול. Big-O מדבר על **התנהגות אסימפטוטית** — כלומר כש-n שואף לאינסוף.
- **"Space Complexity לא חשוב כי יש הרבה RAM"** — ב-Big Data, ב-Embedded Systems, וב-Mobile, זיכרון הוא משאב יקר. גם Cache efficiency מושפע מכמות הזיכרון שבשימוש.
- **"Big-O מודד זמן בשניות"** — לא. Big-O מודד **קצב גדילה**, לא זמן מוחלט. O(n) על מחשב איטי יכול להיות יותר איטי מ-O(n²) על מחשב מהיר — עבור n מספיק קטן.
- **"O(1) זה מיידי"** — לא. O(1) אומר שהזמן קבוע **ולא תלוי ב-n**. אם הפעולה לוקחת 5 שניות אבל תמיד 5 שניות לא משנה מה n — זה O(1). אבל זה לא מיידי.
- **"O(log n) זה תמיד Binary Search"** — יש הרבה אלגוריתמים שהם O(log n). Balanced BST operations, Exponentiation by squaring, ואפילו Euclidean GCD Algorithm — כולם לוגריתמיים.

## דוגמה קטנה

נשווה שני אלגוריתמים למציאת כפילויות ברשימה:

```python
# גישה 1: Brute Force — O(n²)
def has_duplicates_v1(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False

# גישה 2: Hash Set — O(n) זמן, O(n) זיכרון
def has_duplicates_v2(arr):
    seen = set()
    for item in arr:
        if item in seen:
            return True
        seen.add(item)
    return False
```

| n (גודל הרשימה) | גישה 1 (O(n²)) | גישה 2 (O(n)) |
|------------------|-----------------|----------------|
| 100 | 5,000 פעולות | 100 פעולות |
| 10,000 | 50,000,000 פעולות | 10,000 פעולות |
| 1,000,000 | 500,000,000,000 פעולות | 1,000,000 פעולות |

!!! warning "ההבדל הוא דרמטי"
    על מיליון איברים, גישה 1 צריכה חצי טריליון פעולות. גישה 2 צריכה מיליון. זה ההבדל בין שעות לשבריר שנייה.

### דוגמה נוספת: Two Sum

בעיית Two Sum היא אחת השאלות הפופולריות ביותר ב-LeetCode ובראיונות עבודה. נראה שלוש גישות:

```python
# גישה 1: Brute Force — O(n²) זמן, O(1) זיכרון
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

# גישה 2: Sort + Two Pointers — O(n log n) זמן, O(n) זיכרון
def two_sum_sorted(nums, target):
    indexed = sorted(enumerate(nums), key=lambda x: x[1])
    left, right = 0, len(indexed) - 1
    while left < right:
        current_sum = indexed[left][1] + indexed[right][1]
        if current_sum == target:
            return [indexed[left][0], indexed[right][0]]
        elif current_sum < target:
            left += 1
        else:
            right -= 1

# גישה 3: Hash Map — O(n) זמן, O(n) זיכרון
def two_sum_hash(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
```

!!! tip "שלוש גישות, שלוש סיבוכיויות"
    | גישה | Time | Space | מתי להשתמש |
    |-------|------|-------|------------|
    | Brute Force | O(n²) | O(1) | כשצריך פתרון מהיר לכתיבה |
    | Sort + Two Pointers | O(n log n) | O(n) | כשהמערך כבר ממוין |
    | Hash Map | O(n) | O(n) | הבחירה הנכונה ברוב המקרים |

    בראיון, מצופה מכם להגיע לגישה 3. אבל **להראות שאתם מכירים את כל הגישות** ולנתח את ה-Trade-offs — זה מה שמבדיל מועמד מצוין.

## 🛤️ מאיפה מתחילים

### שלב 1: אינטואיציה (שבוע)
- [ ] להבין מה Big-O מודד (קצב גדילה, לא זמן מוחלט)
- [ ] לשנן את טבלת הסיבוכיויות הנפוצות (O(1) עד O(n!))
- [ ] לתרגל **זיהוי סיבוכיות** על קוד פשוט — ראו [מהי אלגוריתמיקה](what-is-algorithmics.md)

### שלב 2: חישוב (2 שבועות)
- [ ] לולאות פשוטות ומקוננות
- [ ] רקורסיות — Master Theorem
- [ ] Amortized Analysis — Dynamic Arrays, Hash Tables

### שלב 3: Space Complexity (שבוע)
- [ ] להבין מה נספר (זיכרון נוסף, לא הקלט)
- [ ] In-Place Algorithms
- [ ] Trade-offs: זמן מול זיכרון — ראו [למה מבני נתונים](data-structures-why.md)

### שלב 4: יישום (שבוע-שבועיים)
- [ ] לנתח סיבוכיות של אלגוריתמי מיון (Merge Sort, Quick Sort, Counting Sort)
- [ ] לנתח סיבוכיות של פעולות על [מבני נתונים](data-structures-why.md)
- [ ] להבין איך סיבוכיות משפיעה על [אלגוריתמי ML](algorithms-in-ml.md)

### משאבים מומלצים

| משאב | מה תלמדו | רמה |
|------|----------|------|
| **Big-O Cheat Sheet** (bigocheatsheet.com) | השוואה ויזואלית | מתחילים |
| **MIT 6.006 — Lecture 1-3** | Big-O פורמלי | בינוני |
| **LeetCode Easy** | תרגול חישוב סיבוכיות | מתחילים |
| **CLRS Ch. 3** | ניתוח אסימפטוטי מלא | מתקדם |

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **מתוכנית הלימודים שלך ב-TAU:**
    - אלגוריתמים (0368-2160)
    - מודלים חישוביים (0368-2200)
    - סיבוכיות (0368-3168)
    - מתמטיקה בדידה 1 (0368-1118)
    - מתמטיקה בדידה 2 (0368-1119)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין O(n) ל-O(n log n)?"
    O(n) גדל ליניארית — אם הקלט גדל פי 10, הזמן גדל פי 10. O(n log n) גדל קצת יותר מהר — אם הקלט גדל פי 10, הזמן גדל פי ~33. בפועל, על n = מיליון, O(n) = מיליון פעולות ו-O(n log n) ≈ 20 מיליון פעולות. ההבדל משמעותי אבל לא דרמטי — שניהם "מהירים" במונחי תעשייה. לעומת זאת, O(n²) = טריליון פעולות — **זה** כבר בעייתי.

??? tip "תנתח את הסיבוכיות של הקוד הבא"
    ```python
    def mystery(n):
        count = 0
        i = 1
        while i < n:
            for j in range(n):
                count += 1
            i *= 2
        return count
    ```
    הלולאה החיצונית רצה **O(log n)** פעמים (כי i מוכפל ב-2 בכל שלב). הלולאה הפנימית רצה **O(n)** פעמים בכל איטרציה. סה"כ: **O(n log n)**.

??? tip "מה ההבדל בין Time Complexity ל-Space Complexity?"
    **Time Complexity** מודד כמה צעדים/פעולות האלגוריתם מבצע. **Space Complexity** מודד כמה זיכרון נוסף הוא צורך (מעבר לקלט). לפעמים יש Trade-off — Hash Map מאפשר חיפוש O(1) בזמן, אבל צורך O(n) זיכרון. Merge Sort צריך O(n) זיכרון נוסף, אבל Quick Sort עובד In-Place ב-O(log n) זיכרון (עבור ה-Call Stack).

??? tip "מה זה Amortized Time Complexity?"
    Amortized Analysis מנתח את **העלות הממוצעת** של פעולה על **סדרת פעולות**. הדוגמה הקלאסית: `list.append()` ב-Python — רוב הפעמים O(1), אבל לפעמים O(n) כשצריך resize. בממוצע על n הוספות, כל הוספה עולה O(1) amortized. זה שונה מ-Average Case: Amortized מבטיח O(1) **תמיד** בממוצע, ולא רק "על קלט ממוצע".

??? tip "למה Quick Sort נחשב O(n log n) אם ה-Worst Case שלו O(n²)?"
    כי ה-**Average Case** של Quick Sort הוא O(n log n), וה-Worst Case (מערך ממוין עם Pivot קבוע) מאוד נדיר בפועל. עם Randomized Pivot, הסיכוי ל-Worst Case הוא זניח. בנוסף, Quick Sort מהיר יותר בפועל מ-Merge Sort בגלל **Cache locality** — הוא עובד על זיכרון רציף. בגלל זה רוב ספריות התכנות (כולל Python `sort()`) משתמשות בווריאציה של Quick Sort (Timsort).

??? tip "מהי הסיבוכיות של חיפוש ב-Hash Table?"
    **Average Case: O(1)**. Worst Case: O(n) — כשכל ה-keys נופלים לאותו bucket (הרבה collisions). עם Hash function טובה ו-Load factor נמוך (בדרך כלל < 0.75), ה-Average Case הוא O(1) בפרקטיקה. פתרונות ל-collisions: **Chaining** (רשימה מקושרת בכל bucket) או **Open Addressing** (Linear/Quadratic probing).

??? tip "מתי O(n²) הוא בסדר?"
    כשה-n מובטח להיות קטן! אם n < 100 תמיד, אלגוריתם O(n²) פשוט יותר לכתיבה ולתחזוקה, ובפועל מהיר מספיק. Insertion Sort, למשל, הוא O(n²) אבל על מערכים קטנים הוא **מהיר יותר** מ-Merge Sort בגלל Overhead נמוך. Timsort (ב-Python) משתמש ב-Insertion Sort על תת-מערכים קטנים בדיוק בגלל הסיבה הזו.

??? tip "מה הסיבוכיות של אלגוריתם שמכפיל את i פי 2 בכל שלב?"
    ```python
    i = 1
    while i < n:
        # עשה משהו O(1)
        i *= 2
    ```
    הלולאה רצה **O(log n)** פעמים. כי i עובר את הערכים 1, 2, 4, 8, 16, ..., 2^k. כש-2^k >= n, הלולאה נעצרת. כלומר k = log₂(n). זה בדיוק מה שקורה ב-Binary Search, ולכן גם הוא O(log n).

## קישורים לנושאים אחרים

- [מהי אלגוריתמיקה](what-is-algorithmics.md) — הבסיס: מה זה אלגוריתם ולמה Correctness ו-Efficiency חשובים
- [למה מבני נתונים](data-structures-why.md) — בחירת מבנה נתונים משפיעה ישירות על הסיבוכיות
- [מקבילי מול סדרתי](parallel-vs-serial.md) — Parallelism יכול לשנות את הסיבוכיות בפועל (אם כי לא את ה-Big-O)
- [אלגוריתמים ב-ML](algorithms-in-ml.md) — איך סיבוכיות משפיעה על זמן האימון של מודלים
