# למה מבני נתונים

## למה זה חשוב

מבני נתונים הם **הדרך שבה אנחנו מארגנים מידע בזיכרון**. בחירת מבנה הנתונים הנכון יכולה להפוך פעולה שלוקחת דקות לפעולה שלוקחת אלפית שנייה.

אפשר לחשוב על זה ככה: אלגוריתם הוא **מה** אתם עושים, ומבנה הנתונים הוא **איפה ואיך** אתם שומרים את המידע בזמן שאתם עושים את זה. שניהם תלויים אחד בשני.

## רעיונות מרכזיים

### מבני הנתונים הבסיסיים

#### Array (מערך)
- אוסף של איברים **ברצף בזיכרון**
- גישה מהירה לפי אינדקס: O(1)
- הוספה/מחיקה באמצע: O(n) — צריך להזיז איברים

#### Linked List (רשימה מקושרת)
- כל איבר מצביע על הבא (ו/או הקודם)
- הוספה/מחיקה: O(1) אם יש מצביע למקום
- גישה לפי אינדקס: O(n) — צריך לעבור מההתחלה

#### Stack (מחסנית)
- **LIFO** — Last In, First Out
- Push ו-Pop הם O(1)
- שימושים: ניהול קריאות פונקציה (Call Stack), undo, ניתוח סוגריים

#### Queue (תור)
- **FIFO** — First In, First Out
- Enqueue ו-Dequeue הם O(1)
- שימושים: תורי הודעות, BFS, ניהול משימות

#### Hash Table (טבלת גיבוב)
- מיפוי של **Key → Value**
- גישה, הוספה ומחיקה: **O(1) בממוצע**
- Worst case (הרבה collisions): O(n)

#### Tree (עץ)
- מבנה היררכי — לכל צומת יש צאצאים
- **Binary Search Tree (BST)**: חיפוש, הוספה, מחיקה — O(log n) בממוצע
- שימושים: מערכות קבצים, DOM ב-HTML, מסדי נתונים

#### Graph (גרף)
- צמתים (Vertices) וקשתות (Edges)
- יכול להיות **מכוון** או **לא מכוון**, **ממושקל** או **לא ממושקל**
- שימושים: רשתות חברתיות, ניתוב GPS, Neural Networks

### טבלת השוואה

| מבנה נתונים | גישה | חיפוש | הוספה | מחיקה | זיכרון |
|-------------|-------|-------|-------|-------|--------|
| **Array** | O(1) | O(n) | O(n) | O(n) | נמוך |
| **Linked List** | O(n) | O(n) | O(1)* | O(1)* | בינוני |
| **Stack** | O(n) | O(n) | O(1) | O(1) | נמוך |
| **Queue** | O(n) | O(n) | O(1) | O(1) | נמוך |
| **Hash Table** | — | O(1) | O(1) | O(1) | גבוה |
| **BST (מאוזן)** | O(log n) | O(log n) | O(log n) | O(log n) | בינוני |

*\* בהנחה שיש מצביע למקום הנכון*

!!! note "הכל עניין של Trade-offs"
    אין מבנה נתונים אחד ש"הכי טוב". כל מבנה מצטיין במשהו אחר. המפתח הוא להבין **מה הפעולות העיקריות** שאתם צריכים ולבחור בהתאם.

### איזה מבנה נתונים למה?

??? tip "מדריך מהיר לבחירה"
    | אני צריך... | מבנה מומלץ |
    |-------------|-----------|
    | גישה מהירה לפי מיקום | **Array** |
    | הוספה/מחיקה תכופה בהתחלה | **Linked List** |
    | undo/redo | **Stack** |
    | עיבוד לפי סדר הגעה | **Queue** |
    | חיפוש מהיר לפי מפתח | **Hash Table** |
    | נתונים ממוינים עם הוספות | **BST / Balanced Tree** |
    | מודל קשרים בין אובייקטים | **Graph** |

## בלבולים נפוצים

- **"Array ו-List ב-Python זה אותו דבר"** — ב-Python, `list` ממומש כ-Dynamic Array, לא כ-Linked List. ל-Linked List אמיתי צריך לממש לבד או להשתמש ב-`collections.deque`.
- **"Hash Table תמיד O(1)"** — זה ה-Average Case. במקרה הגרוע (הרבה collisions), חיפוש ב-Hash Table יכול להידרדר ל-O(n). Hash function טובה ו-Load factor נמוך מפחיתים את הסיכוי.
- **"BST תמיד O(log n)"** — רק אם העץ **מאוזן**. עץ לא מאוזן יכול להידרדר לרשימה מקושרת — O(n). לכן קיימים AVL Tree ו-Red-Black Tree שמבטיחים איזון.
- **"מערך תמיד עדיף כי גישה O(1)"** — אם הפעולה העיקרית שלכם היא הוספה/מחיקה, מערך הוא בחירה גרועה. תמיד חישבו על **תמהיל הפעולות** שלכם.

## דוגמה קטנה

נניח שאנחנו בונים מערכת שצריכה לבדוק האם משתמש כבר נרשם. יש לנו מיליון משתמשים.

```python
# גישה 1: שימוש ב-List — O(n) לכל חיפוש
users_list = ["alice", "bob", "charlie", ...]  # מיליון שמות

def is_registered_list(username):
    return username in users_list  # סורק את כל הרשימה!

# גישה 2: שימוש ב-Set (Hash Table) — O(1) לכל חיפוש
users_set = {"alice", "bob", "charlie", ...}  # מיליון שמות

def is_registered_set(username):
    return username in users_set  # קופץ ישר למקום!
```

!!! warning "ההבדל בפועל"
    עם מיליון משתמשים ואלף בדיקות בשנייה:

    - **List**: כל בדיקה סורקת עד מיליון איברים → המערכת קורסת
    - **Set**: כל בדיקה לוקחת זמן קבוע → המערכת עפה

## קישורים לנושאים אחרים

- [סיבוכיות (Complexity)](complexity.md) — ניתוח הסיבוכיות של כל פעולה על כל מבנה נתונים
- [מהי אלגוריתמיקה](what-is-algorithmics.md) — מבני נתונים ואלגוריתמים הולכים יחד
- [מה זה Database](../06-data/what-is-a-database.md) — מסדי נתונים הם בעצם מבני נתונים מתוחכמים שחיים על דיסק

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מבוא למדעי המחשב — arrays, lists, stacks, queues
    - מבני נתונים — trees, heaps, hash tables, graphs
    - אלגוריתמים — חיפוש, מיון, DFS/BFS, shortest path
    - מתמטיקה בדידה — sets, relations, logic, combinatorics

    **קורסים מומלצים:**
    - מערכות הפעלה — memory management, caching (שימוש במבני נתונים)
    - מסדי נתונים — B-trees, indexing, query optimization
    - תכנות מתקדם — generics, iterators, design patterns

    **ידע מעשי:**
    - Python / Java / C++ — מימוש מאפס
    - LeetCode / HackerRank — תרגול יומי
    - Visualgo.net — הדמיה של מבני נתונים

---

## 🛤️ מאיפה מתחילים

1. **"Introduction to Algorithms" (CLRS)** — הספר הקלאסי
2. **CS50** (Harvard) — יסודות עם C ו-Python
3. **NeetCode / LeetCode** — תרגול מובנה
4. **Visualgo** — ראו איך מבני נתונים עובדים ויזואלית
5. **מימוש מאפס** — כתבו LinkedList, HashMap, BST לבד

---

## 💼 שאלות לראיון עבודה

??? tip "מתי להשתמש ב-Array vs LinkedList?"
    **Array**: גישה אקראית O(1), cache-friendly, הוספה בסוף O(1) amortized. גרוע בהוספה/מחיקה באמצע O(n).
    **LinkedList**: הוספה/מחיקה O(1) (אם יש pointer), לא cache-friendly, גישה O(n). משתמשים ב-LL כשיש הרבה insertions/deletions באמצע.

??? tip "מה Hash Table ומה קורה ב-Collision?"
    **Hash Table** — מבנה נתונים שממפה key → value דרך hash function. O(1) average lookup/insert. **Collision** — שני keys עם אותו hash:
    1. **Chaining** — linked list בכל slot
    2. **Open addressing** — חיפוש slot פנוי (linear probing, quadratic, double hashing)
    Worst case: O(n) אם הכל מתנגש. Load factor > 0.75 → resize.

??? tip "מה BST ומה היתרון של Balanced BST?"
    **BST** (Binary Search Tree) — כל node: left < node < right. חיפוש O(h) כש-h = גובה העץ. **Balanced BST** (AVL, Red-Black) — מבטיח h = O(log n). בלי balancing, BST יכול להידרדר לlinked list: O(n).

??? tip "מה Heap ומה השימושים?"
    **Heap** — עץ בינארי שבו parent ≥ children (Max Heap) או parent ≤ children (Min Heap). Insert/Extract: O(log n). Peek: O(1). שימושים: Priority Queue, Dijkstra, Median finding, Top-K elements, Heap Sort.

??? tip "מה Stack ומה Queue ומתי משתמשים?"
    **Stack** — LIFO (Last In, First Out). שימושים: undo, function call stack, DFS, parentheses matching, expression evaluation.
    **Queue** — FIFO (First In, First Out). שימושים: BFS, task scheduling, message queues, buffering.
    **Deque** — double-ended queue, insert/remove משני הצדדים. Sliding window problems.
