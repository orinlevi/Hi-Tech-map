# 💻 ראיון קוד -- LeetCode ו-Patterns

## למה זה חשוב

LeetCode Hard -- הדרך האמינה ביותר להרגיש טיפש תוך 5 דקות. אבל לפני שנכנסים לפאניקה, בואו נבהיר משהו: ראיון קוד הוא **לא מבחן IQ**. זה מבחן על **הכנה**, **תבניות חשיבה**, ו**תרגול**. אנשים שמתרגלים 100 שעות מנצחים אנשים חכמים שלא התכוננו.

> "פתרתי 200 בעיות ב-LeetCode. ה-20 הראשונות היו מייאשות. אחרי 50 התחלתי לראות Patterns. אחרי 100 הרגשתי בטוח. אתם יכולים גם."

!!! note "מה באמת בודקים בראיון קוד?"
    **לא** אם אתם זוכרים אלגוריתם ספציפי. **כן** אם אתם יכולים:

    1. **להבין** בעיה ולשאול שאלות הבהרה
    2. **לפרק** אותה לחלקים קטנים
    3. **לבחור** מבנה נתונים ואלגוריתם מתאים
    4. **לכתוב** קוד נקי ועובד
    5. **לנתח** סיבוכיות (Big-O)
    6. **לתקשר** -- לדבר בקול תוך כדי פתרון

---

## סיבוכיות -- Big-O Review

### למה זה חשוב

כשהמראיין שואל "מה הסיבוכיות של הפתרון שלך?" -- חייבים לדעת לענות. זה לא אופציונלי.

### סדר הגדילה

| Big-O | שם | דוגמה | 1,000 elements | 1,000,000 elements |
|-------|----|-------|----------------|---------------------|
| O(1) | Constant | Hash table lookup | 1 | 1 |
| O(log n) | Logarithmic | Binary search | ~10 | ~20 |
| O(n) | Linear | Simple loop | 1,000 | 1,000,000 |
| O(n log n) | Linearithmic | Merge sort | ~10,000 | ~20,000,000 |
| O(n^2) | Quadratic | Nested loops | 1,000,000 | 1,000,000,000,000 |
| O(2^n) | Exponential | Recursive fibonacci | LOL | LOL x LOL |

> "אם הפתרון שלכם O(n^2) והמראיין שואל 'אפשר לשפר?' -- התשובה היא כמעט תמיד כן."

!!! tip "כלל אצבע לראיון"
    - n עד 10^4 → O(n^2) יעבוד
    - n עד 10^6 → צריך O(n log n) או O(n)
    - n עד 10^8 → צריך O(n) או O(log n)

    אם הנתונים גדולים -- **חשבו על Hash Table** (O(1) lookup) או **Binary Search** (O(log n)).

ראו את [סיבוכיות](../01-algorithmics/complexity.md) לפירוט מלא.

---

## מבני נתונים חיוניים

### מה חייבים לדעת

| מבנה | פעולות עיקריות | Big-O | מתי להשתמש |
|------|---------------|-------|-----------|
| **Array** | Access: O(1), Search: O(n), Insert/Delete: O(n) | | כשצריך גישה מהירה לפי index |
| **Hash Map** | Insert/Delete/Search: O(1) avg | | כשצריך lookup מהיר לפי key |
| **Linked List** | Insert/Delete: O(1), Search: O(n) | | כשצריך הכנסה/מחיקה תכופה |
| **Stack** | Push/Pop: O(1) | LIFO | ביטויים, DFS, undo |
| **Queue** | Enqueue/Dequeue: O(1) | FIFO | BFS, task scheduling |
| **Binary Tree** | Search/Insert/Delete: O(log n) avg | | נתונים ממוינים, hierarchies |
| **Heap** | Insert: O(log n), Get Min/Max: O(1) | | Priority queues, top-K |
| **Graph** | depends on representation | | רשתות, relationships, paths |

!!! warning "מה לא לשכוח"
    - **Hash Map** הוא החבר הכי טוב שלכם. אם אתם לא בטוחים -- נסו Hash Map קודם
    - **Stack** מופיע הרבה יותר ממה שחושבים (parentheses matching, DFS, monotonic stack)
    - **Heap** חוסך הרבה זמן בבעיות של "מצאו את ה-K הגדולים/קטנים ביותר"

---

## Top Patterns -- 10 Patterns שחייבים לדעת

### 1. Two Pointers (שני מצביעים)

**מתי**: array ממוין, חיפוש זוגות, הסרת duplicates.

**איך עובד**: שני מצביעים שזזים לכיוונים שונים או באותו כיוון.

```python
# דוגמה: מצאו שני מספרים ב-sorted array שסכומם = target
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

**בעיות לתרגול**: Two Sum II, 3Sum, Container With Most Water, Remove Duplicates

---

### 2. Sliding Window (חלון נע)

**מתי**: substring/subarray עם תנאי מסוים, maximum/minimum של חלון בגודל K.

**איך עובד**: מחזיקים "חלון" שזז על ה-array, ומעדכנים את התוצאה בכל צעד.

```python
# דוגמה: מצאו את הסכום המקסימלי של subarray בגודל k
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

**בעיות לתרגול**: Maximum Average Subarray, Longest Substring Without Repeating Characters, Minimum Window Substring

---

### 3. BFS (Breadth-First Search)

**מתי**: shortest path (ללא משקלות), level-order traversal, חיפוש ב-graph/matrix.

**איך עובד**: תור (queue) -- מעבדים רמה אחרי רמה.

```python
from collections import deque

# דוגמה: Level Order Traversal של Binary Tree
def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
```

**בעיות לתרגול**: Binary Tree Level Order, Number of Islands, Word Ladder, Rotting Oranges

---

### 4. DFS (Depth-First Search)

**מתי**: חיפוש כל הנתיבים, backtracking, connected components, tree traversals.

**איך עובד**: מחסנית (stack) או רקורסיה -- הולכים לעומק לפני שחוזרים.

```python
# דוגמה: כל הנתיבים מ-root ל-leaf ב-Binary Tree
def all_paths(root):
    result = []
    def dfs(node, path):
        if not node:
            return
        path.append(node.val)
        if not node.left and not node.right:
            result.append(list(path))
        dfs(node.left, path)
        dfs(node.right, path)
        path.pop()  # backtrack
    dfs(root, [])
    return result
```

**בעיות לתרגול**: Number of Islands, Path Sum, Permutations, Combination Sum

---

### 5. Binary Search (חיפוש בינארי)

**מתי**: array ממוין, חיפוש ערך, חיפוש גבול (first/last occurrence).

> "אם ה-array ממוין ואתם עושים linear search -- יש דרך טובה יותר."

```python
# דוגמה: חיפוש בינארי קלאסי
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

**בעיות לתרגול**: Search in Rotated Sorted Array, Find Minimum in Rotated Array, Koko Eating Bananas

---

### 6. Dynamic Programming (תכנות דינמי)

**מתי**: בעיית אופטימיזציה, חפיפת תת-בעיות, מבנה אופטימלי.

**איך מזהים**: "מצאו את המינימום/מקסימום", "כמה דרכים יש", "האם אפשר".

> "DP זה בעצם רקורסיה + memoization. אם אתם מפחדים מ-DP, תתחילו מרקורסיה ותוסיפו cache."

```python
# דוגמה: Climbing Stairs -- כמה דרכים לעלות n מדרגות (1 או 2 בכל צעד)
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

**בעיות לתרגול**: Climbing Stairs, House Robber, Coin Change, Longest Common Subsequence

!!! tip "איך לגשת ל-DP"
    1. **מצאו את ה-subproblem** -- מה הבעיה הקטנה יותר?
    2. **כתבו את הנוסחה** -- dp[i] = f(dp[i-1], dp[i-2], ...)
    3. **מצאו את ה-base cases** -- מה ערכי ההתחלה?
    4. **קבעו את הסדר** -- bottom-up (iterative) או top-down (recursive + memo)

---

### 7. Backtracking

**מתי**: מצאו את כל הקומבינציות/תמורות, Sudoku solver, N-Queens.

**איך עובד**: DFS עם "חזרה אחורה" כשנתקעים.

```python
# דוגמה: כל התמורות של מערך
def permutations(nums):
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(list(current))
            return
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()  # backtrack
    backtrack([], nums)
    return result
```

**בעיות לתרגול**: Permutations, Subsets, Letter Combinations of Phone Number, N-Queens

---

### 8. Greedy (חמדני)

**מתי**: בחירה מקומית אופטימלית מובילה לפתרון גלובלי אופטימלי.

**דוגמאות**: Interval scheduling, minimum coins (sometimes), activity selection.

```python
# דוגמה: מספר מינימלי של מטבעות (greedy -- רק עם denominations ספציפיים!)
def min_coins_greedy(coins, amount):
    coins.sort(reverse=True)
    count = 0
    for coin in coins:
        count += amount // coin
        amount %= coin
    return count if amount == 0 else -1
```

!!! warning "זהירות עם Greedy"
    Greedy לא תמיד עובד! הוא עובד רק כשאפשר להוכיח שבחירה מקומית אופטימלית מובילה לפתרון גלובלי. אם לא בטוחים -- השתמשו ב-DP.

**בעיות לתרגול**: Jump Game, Gas Station, Task Scheduler, Meeting Rooms II

---

### 9. Monotonic Stack (מחסנית מונוטונית)

**מתי**: "מצאו את האלמנט הבא הגדול/קטן", histogram problems.

```python
# דוגמה: לכל אלמנט, מצאו את האלמנט הבא שגדול ממנו
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # indices
    for i in range(len(nums)):
        while stack and nums[i] > nums[stack[-1]]:
            result[stack.pop()] = nums[i]
        stack.append(i)
    return result
```

**בעיות לתרגול**: Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram

---

### 10. Prefix Sum (סכום מצטבר)

**מתי**: סכום של subarray, range queries.

```python
# דוגמה: סכום של subarray מ-i עד j
def subarray_sum(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    # sum from i to j = prefix[j+1] - prefix[i]
    return prefix
```

**בעיות לתרגול**: Range Sum Query, Subarray Sum Equals K, Product of Array Except Self

---

## אסטרטגיית LeetCode

### הגישה הנכונה

!!! note "אל תפתרו 500 בעיות אקראיות"
    **פתרו 50-100 בעיות ממוקדות** לפי Patterns. עדיף 5 בעיות Two Pointers ברצף מאשר 5 בעיות אקראיות.

### תוכנית תרגול מומלצת

**שבוע 1-2: Easy (30 בעיות)**

- Two Sum, Valid Parentheses, Merge Two Sorted Lists
- Binary Search, Maximum Subarray, Best Time to Buy and Sell Stock
- Linked List Cycle, Reverse Linked List, Valid Palindrome

**שבוע 3-4: Medium (30 בעיות)**

- 3Sum, Container With Most Water, Group Anagrams
- Number of Islands, Course Schedule, Binary Tree Level Order
- Coin Change, Longest Substring Without Repeating

**שבוע 5-6: Mixed (20 בעיות)**

- ערבבו Easy ו-Medium
- תרגלו עם timer (45 דקות לבעיה)
- תרגלו לדבר בקול

### כללי זהב לתרגול

1. **Timer** -- הגדירו 25 דקות ל-Easy, 45 ל-Medium. אם לא פתרתם -- קראו את הפתרון
2. **לא להרגיש רע** -- לקרוא פתרון אחרי 25 דקות זה **ללמוד**, לא לרמות
3. **חזרו על בעיות** -- פתרו את אותה בעיה אחרי שבוע. אם לא הצלחתם -- עוד לא הבנתם את ה-Pattern
4. **דברו בקול** -- גם כשמתרגלים לבד. זה מרגיש מוזר, אבל בראיון אמיתי זה קריטי
5. **כתבו נקי** -- שמות משתנים ברורים, פונקציות קטנות. המראיין קורא את הקוד שלכם

---

## איך מדברים בראיון

### מבנה מומלץ (UMPIRE)

| שלב | מה עושים | זמן |
|------|----------|------|
| **U** - Understand | חזרו על השאלה, שאלו הבהרות | 2-3 דק' |
| **M** - Match | זהו את ה-Pattern (Two Pointers? BFS? DP?) | 1-2 דק' |
| **P** - Plan | הסבירו את הגישה **לפני** שמתחילים לכתוב | 3-5 דק' |
| **I** - Implement | כתבו קוד נקי | 10-20 דק' |
| **R** - Review | הריצו את הקוד על דוגמאות, כולל edge cases | 3-5 דק' |
| **E** - Evaluate | נתחו Big-O (time & space), דברו על שיפורים | 2-3 דק' |

### מה לשאול בהתחלה

- "האם ה-input ממוין?"
- "האם יכולים להיות ערכים שליליים?"
- "מה גודל ה-input?"
- "האם יש duplicate-ים?"
- "מה להחזיר אם אין פתרון?"

> "שאלות טובות בהתחלה חוסכות 10 דקות של כתיבת קוד לא נכון."

### מה לעשות כשנתקעים

1. **אל תשתקו** -- תגידו "אני חושב על הגישה"
2. **חזרו לדוגמאות** -- פתרו את הדוגמה ידנית ותחפשו Pattern
3. **נסו Brute Force** -- "הפתרון הנאיבי הוא O(n^2). אני חושב שאפשר לשפר עם..."
4. **בקשו רמז** -- "אפשר כיוון?" זה לגיטימי לגמרי. עדיף מ-10 דקות שקט
5. **שנו נקודת מבט** -- "מה אם אמיין קודם?" "מה אם אשתמש ב-Hash Map?"

!!! tip "המשפט שמציל ראיונות"
    "הפתרון הנאיבי שלי הוא [X] עם סיבוכיות O(n^2). אני חושב שאפשר לשפר את זה עם [Y]. תן לי רגע לחשוב על הגישה."

    **למה זה עובד**: מראה שאתם מבינים את הבעיה, יודעים שיש פתרון טוב יותר, ומבקשים רגע לחשוב. המראיין ידע שאתם בכיוון הנכון.

---

## 🛤️ מאיפה מתחילים

### תוכנית 6 שבועות

**שבוע 1: יסודות**

- [ ] חזרו על Big-O (ראו [סיבוכיות](../01-algorithmics/complexity.md))
- [ ] חזרו על מבני נתונים בסיסיים (Array, Hash Map, Linked List, Stack, Queue)
- [ ] פתרו 5 בעיות Easy כ-warm-up

**שבוע 2: Two Pointers + Sliding Window**

- [ ] פתרו 5 בעיות Two Pointers
- [ ] פתרו 5 בעיות Sliding Window
- [ ] שימו לב ל-Pattern -- מתי כל טכניקה מתאימה?

**שבוע 3: BFS + DFS + Binary Search**

- [ ] פתרו 5 בעיות BFS (trees ו-graphs)
- [ ] פתרו 5 בעיות DFS
- [ ] פתרו 5 בעיות Binary Search

**שבוע 4: Dynamic Programming + Backtracking**

- [ ] פתרו 5 בעיות DP (התחילו מ-Easy: Climbing Stairs, House Robber)
- [ ] פתרו 3 בעיות Backtracking (Permutations, Subsets)
- [ ] תרגלו לזהות DP problems -- "כמה דרכים?" "מה המינימום?"

**שבוע 5: Greedy + Advanced**

- [ ] פתרו 3-5 בעיות Greedy
- [ ] פתרו 3 בעיות Monotonic Stack
- [ ] פתרו 3 בעיות Prefix Sum

**שבוע 6: Mock Interviews**

- [ ] עשו 3 mock interviews עם timer (45 דקות)
- [ ] תרגלו לדבר בקול
- [ ] חזרו על בעיות שנפלתם בהן

!!! tip "מה ללמוד באקדמיה"
    הבסיס האלגוריתמי שנלמד באקדמיה הוא המפתח להצלחה בראיונות קוד.

    **מתוכנית הלימודים שלך ב-TAU:**

    - אלגוריתמים (0368-2160)
    - מבני נתונים (0368-2158)
    - תכנות תחרותי (0368-3083)

---

## 💼 שאלות לראיון עבודה

??? tip "מה הסיבוכיות של הפתרון שלך?"
    **מה באמת שואלים**: האם אתה מבין את ההשפעה של הקוד שכתבת?

    **איך לענות:**

    - **Time Complexity**: "הפתרון שלי O(n log n) כי אני ממיין ואז עושה binary search"
    - **Space Complexity**: "O(n) כי אני משתמש ב-Hash Map בגודל n"
    - **תמיד ציינו את שניהם** -- time ו-space

??? tip "אפשר לשפר את הפתרון?"
    **מה באמת שואלים**: האם אתה יכול לחשוב מעבר לפתרון הראשון?

    **אסטרטגיות שיפור:**

    1. **Hash Map** -- אם עשיתם O(n^2) עם nested loops, נסו Hash Map ל-O(n)
    2. **Sorting** -- לפעמים מיון מאפשר Two Pointers / Binary Search
    3. **Space-Time tradeoff** -- אפשר להשתמש ביותר זיכרון כדי לחסוך זמן
    4. **Early termination** -- אפשר לעצור לפני שמסיימים את כל ה-loop?

??? tip "הסבר את תהליך החשיבה שלך"
    **מה באמת שואלים**: האם אתה יכול לתקשר בצורה ברורה?

    **שיטה:**

    1. "קודם כל, אני מבין שהבעיה מבקשת [X]"
    2. "אני רואה שזה דומה ל-Pattern של [Y]"
    3. "הגישה שלי תהיה: [שלב 1], [שלב 2], [שלב 3]"
    4. "הסיבוכיות תהיה O(X) כי [הסבר]"

    **דברו כל הזמן.** שקט ממושך הוא הדבר הכי גרוע בראיון קוד.

??? tip "מה קורה עם edge cases?"
    **מה באמת שואלים**: האם אתה חושב על מקרי קצה?

    **Edge cases נפוצים:**

    - Input ריק / null
    - Element יחיד
    - כל האלמנטים זהים
    - מספרים שליליים
    - Overflow (מספרים גדולים מאוד)
    - Input ממוין / ממוין הפוך

    **טיפ**: תמיד בדקו edge cases **לפני** שמתחילים לכתוב. זה חוסך debug ומרשים את המראיין.

??? tip "למה בחרת את מבנה הנתונים הזה?"
    **מה באמת שואלים**: האם אתה מבין את ה-trade-offs?

    **תשובה מובנית:**

    1. "בחרתי [X] כי הפעולה העיקרית שאני צריך היא [Y]"
    2. "ב-[X], הפעולה הזו עולה O(Z)"
    3. "האלטרנטיבה היא [W], אבל שם הפעולה עולה O(V) שזה פחות טוב למקרה הזה"

    **דוגמה**: "בחרתי Hash Map כי אני צריך lookup מהיר -- O(1) בממוצע. אם הייתי משתמש ב-Array, הייתי צריך O(n) לכל חיפוש."

??? tip "תכתוב/י את הקוד ל-[בעיה]"
    **מה באמת שואלים**: האם אתה יכול לממש את מה שתכננת?

    **כללי כתיבה:**

    1. **שמות משתנים ברורים** -- `left`, `right`, `current_sum` ולא `i`, `j`, `s`
    2. **פונקציות קטנות** -- אם קטע קוד עושה משהו ספציפי, תוציאו אותו לפונקציה
    3. **הערות קצרות** -- הערה אחת לפני כל בלוק לוגי
    4. **אל תתביישו למחוק ולהתחיל מחדש** -- עדיף קוד נקי מקוד מבולגן

??? tip "מה ההבדל בין BFS ל-DFS?"
    **BFS** (Breadth-First): רמה אחרי רמה, משתמש ב-**Queue**. מוצא shortest path (ללא משקלות).

    **DFS** (Depth-First): הולך לעומק, משתמש ב-**Stack** (או רקורסיה). טוב ל-backtracking וחיפוש כל הנתיבים.

    **כלל אצבע**:

    - צריכים shortest path? → BFS
    - צריכים את כל הפתרונות? → DFS
    - עובדים עם tree levels? → BFS
    - עובדים עם permutations/combinations? → DFS + Backtracking

---

## בלבולים נפוצים

!!! warning "\"צריך לפתור 500 בעיות\""
    **לא.** 50-100 בעיות ממוקדות לפי Patterns עדיפות על 500 בעיות אקראיות. **איכות > כמות.** תבינו **למה** הפתרון עובד, לא רק **מה** הפתרון.

!!! warning "\"אם לא פתרתי לבד, לא למדתי כלום\""
    **שטויות.** לקרוא פתרון אחרי 25-30 דקות של ניסיון זה **ללמוד**, לא לרמות. הטריק: אחרי שקראתם את הפתרון, סגרו אותו ותנסו לכתוב אותו **לבד**.

!!! warning "\"אני צריך לזכור כל אלגוריתם\""
    **לא.** אתם צריכים לזהות **Patterns** ולדעת **מתי להשתמש** בכל אחד. אם אתם מזהים שזו בעיית Two Pointers -- הפתרון כמעט כותב את עצמו.

---

## קישורים לנושאים אחרים

- [הכנה לראיון](./interview-prep.md) -- סקירה כללית של תהליך הראיון
- [System Design -- מבוא](./system-design-basics.md) -- לשלב הבא
- [סיבוכיות](../01-algorithmics/complexity.md) -- בסיס חובה
- [מה זה אלגוריתמיקה](../01-algorithmics/what-is-algorithmics.md) -- הבנת הבסיס
- [מפת דרכים ללימוד עצמי](./learning-roadmap.md) -- תוכנית לימודים מלאה
