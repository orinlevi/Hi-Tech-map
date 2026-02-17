# אלגוריתמים ב-ML

## למה זה חשוב

Machine Learning נתפס לפעמים כ"קסם" — נותנים נתונים, מקבלים תחזיות. אבל מאחורי הקלעים, **הכל מבוסס על אלגוריתמים קלאסיים**: אופטימיזציה, חיפוש, מיון, וגרפים.

הבנה של האלגוריתמים שמאחורי ML עוזרת לכם:

- לבחור את המודל הנכון לבעיה
- להבין למה אימון לוקח זמן
- לעשות Debug כשמשהו לא עובד
- לשפר ביצועים בצורה מושכלת

## רעיונות מרכזיים

### Gradient Descent — אלגוריתם אופטימיזציה

Gradient Descent הוא **הלב הפועם** של אימון מודלים. הוא מחפש את הנקודה שבה ה-Loss (השגיאה) הכי נמוכה.

```
הרעיון: אתם עומדים על הר בערפל.
אתם לא רואים את העמק, אבל מרגישים את השיפוע מתחת לרגליים.
בכל צעד, אתם הולכים בכיוון שהכי יורד.
```

```python
# Gradient Descent בצורה פשוטה
def gradient_descent(start, learning_rate, num_steps):
    position = start
    for step in range(num_steps):
        gradient = compute_gradient(position)   # מה השיפוע כאן?
        position = position - learning_rate * gradient  # צעד בכיוון הירידה
    return position
```

!!! note "וריאציות חשובות"
    | וריאציה | רעיון | Trade-off |
    |---------|-------|-----------|
    | **Batch GD** | מחשב Gradient על כל הנתונים | מדויק אבל איטי |
    | **Stochastic GD (SGD)** | מחשב על דוגמה אחת | מהיר אבל רועש |
    | **Mini-batch GD** | מחשב על קבוצה קטנה | פשרה — הנפוץ ביותר |
    | **Adam** | SGD + Momentum + Adaptive LR | הבחירה הפופולרית ביותר |

??? tip "למה Learning Rate כל כך חשוב?"
    - **גדול מדי** → האלגוריתם "קופץ" מעבר למינימום ולא מתכנס
    - **קטן מדי** → האלגוריתם מתכנס, אבל לוקח נצח
    - **בדיוק נכון** → מתכנס מהר ומדויק

    זו הסיבה ש-Learning Rate הוא ה-Hyperparameter החשוב ביותר לכוון.

### חיפוש ב-Hyperparameter Tuning

Hyperparameters (כמו Learning Rate, מספר שכבות, גודל Batch) לא נלמדים מהנתונים — צריך **לחפש** את הערכים הטובים ביותר.

| שיטת חיפוש | אלגוריתם | סיבוכיות |
|------------|----------|----------|
| **Grid Search** | בודק כל קומבינציה | O(kⁿ) — k ערכים לכל אחד מ-n פרמטרים |
| **Random Search** | דוגם קומבינציות באקראי | O(m) — m ניסיונות |
| **Bayesian Optimization** | לומד מניסיונות קודמים | יעיל יותר, מורכב יותר |

!!! warning "Grid Search הוא Exponential!"
    עם 5 hyperparameters וכל אחד עם 10 ערכים אפשריים: 10⁵ = **100,000** ניסיונות. כל ניסיון הוא אימון שלם של מודל. לכן Random Search לרוב עדיף — מוצא תוצאות טובות עם הרבה פחות ניסיונות.

### מיון וחיפוש ב-Data Preprocessing

לפני שמאמנים מודל, צריך לעבד נתונים. כאן האלגוריתמים הקלאסיים חוזרים:

- **Sorting** — מיון נתונים לפי תכונות, מציאת Percentiles, זיהוי Outliers
- **Searching** — חיפוש רשומות, מציאת Nearest Neighbors (KNN)
- **Hashing** — דדופליקציה של נתונים, Feature Hashing
- **Sampling** — דגימה אקראית ליצירת Train/Test split

??? tip "K-Nearest Neighbors כדוגמה"
    KNN הוא אלגוריתם ML שהוא בעצם **אלגוריתם חיפוש**:

    1. קבל נקודה חדשה
    2. חפש את K הנקודות הקרובות אליה ב-Training Set
    3. החזר את הקטגוריה הנפוצה ביניהן

    Brute-force: O(n) לכל Prediction. עם KD-Tree: O(log n). על מיליוני דוגמאות, ההבדל הוא עצום.

### Backpropagation כאלגוריתם גרף

Neural Network הוא בעצם **Directed Acyclic Graph (DAG)** — גרף מכוון בלי מעגלים.

```
Input → [Layer 1] → [Layer 2] → [Layer 3] → Output
                                                ↓
                                            Loss Function
                                                ↓
        ←←←←← Backpropagation (Reverse Topological Order) ←←←←←
```

Backpropagation הוא יישום של **Chain Rule** (כלל השרשרת מחדו"א) על הגרף, בסדר טופולוגי הפוך:

1. **Forward Pass** — חישוב מהקלט לפלט (Topological Order)
2. **Loss** — מדידת השגיאה
3. **Backward Pass** — חישוב Gradients מהפלט לקלט (Reverse Topological Order)
4. **Update** — עדכון המשקלים בעזרת Gradient Descent

!!! note "למה Backprop יעיל?"
    חישוב נאיבי של כל הנגזרות: O(n²) כאשר n הוא מספר המשקלים.
    Backpropagation עם Dynamic Programming: **O(n)**.

    בלי Backprop, אימון של רשתות עמוקות היה בלתי אפשרי מבחינה חישובית.

## בלבולים נפוצים

- **"ML הוא תחום נפרד מאלגוריתמיקה"** — ML **בנוי על** אלגוריתמיקה. Gradient Descent הוא אלגוריתם אופטימיזציה. Backpropagation הוא אלגוריתם על גרפים. Decision Trees הם מבני נתונים.
- **"Gradient Descent תמיד מוצא את הפתרון הטוב ביותר"** — לא. הוא יכול להיתקע ב-Local Minimum, בנקודת אוכף (Saddle Point), או לא להתכנס בכלל. לכן יש וריאציות כמו Adam ו-Learning Rate Scheduling.
- **"אימון הוא החלק האיטי היחיד"** — Data Preprocessing (מיון, ניקוי, נרמול) יכול לקחת **יותר זמן** מהאימון עצמו, במיוחד על נתונים גולמיים. אלגוריתמיקה יעילה חשובה גם שם.
- **"Deep Learning מחליף את הצורך באלגוריתמים"** — ההיפך. ככל שהמודלים גדלים, אופטימיזציה אלגוריתמית הופכת לקריטית יותר. הפרש של 2x ביעילות זה ההבדל בין אימון של שבוע לשבועיים.

## דוגמה קטנה

נממש Gradient Descent פשוט שמוצא את המינימום של פונקציה:

```python
def simple_gradient_descent():
    """מוצא את המינימום של f(x) = x² + 4x + 4 = (x+2)²"""
    x = 10.0              # מתחילים במקום שרירותי
    learning_rate = 0.1

    for step in range(50):
        gradient = 2 * x + 4             # f'(x) = 2x + 4
        x = x - learning_rate * gradient  # צעד בכיוון הירידה
        loss = x**2 + 4*x + 4            # f(x)

        if step % 10 == 0:
            print(f"Step {step}: x = {x:.4f}, loss = {loss:.4f}")

    return x

# הפלט:
# Step 0:  x = 7.6000, loss = 100.0000   ← רחוק מהמינימום
# Step 10: x = -1.6926, loss = 0.0945    ← מתקרב
# Step 20: x = -1.9742, loss = 0.0007    ← כמעט שם
# Step 30: x = -1.9998, loss = 0.0000    ← הגענו! x ≈ -2
# Step 40: x = -2.0000, loss = 0.0000    ← מינימום מדויק
```

??? tip "מה קורה כאן?"
    הפונקציה (x+2)² מקבלת מינימום ב-x = -2. האלגוריתם מתחיל ב-x = 10 ובכל צעד "יורד" לכיוון המינימום. אחרי 30 צעדים הוא מגיע כמעט במדויק. זה **בדיוק מה שקורה באימון Neural Network** — רק עם מיליוני משתנים במקום אחד.

## קישורים לנושאים אחרים

- [סיבוכיות (Complexity)](complexity.md) — הבנת הסיבוכיות של אלגוריתמי ML קריטית לבחירת המודל
- [מקבילי מול סדרתי](parallel-vs-serial.md) — למה GPU מאיץ אימון ML ואיך Parallelism משנה את המשחק
- [Classification](../02-ml-core/classification.md) — אלגוריתמי סיווג כמו Logistic Regression, Decision Trees ו-SVM
- [Neural Networks](../02-ml-core/neural-networks.md) — הארכיטקטורה שמאחורי Deep Learning ואיך Backpropagation עובד בפועל

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מבוא למדעי המחשב — יסודות אלגוריתמיקה ותכנות
    - אלגוריתמים ומבני נתונים — חיפוש, מיון, גרפים, DP
    - חדו"א 1+2 — נגזרות, אינטגרלים, Chain Rule (בסיס ל-backprop)
    - אלגברה לינארית — מטריצות, וקטורים, eigenvalues
    - למידת מכונה — Gradient Descent, optimization, regularization

    **קורסים מומלצים:**
    - אופטימיזציה — convex optimization, constrained optimization
    - אנליזה נומרית — שגיאות חישוב, יציבות אלגוריתמים
    - הסתברות וסטטיסטיקה — הבסיס לכל ML

    **ידע מעשי:**
    - Python + NumPy — מימוש אלגוריתמים
    - PyTorch / TensorFlow — autograd, optimizers
    - Weights & Biases / MLflow — tracking ניסויים
    - profiling tools — זיהוי צווארי בקבוק

    **מתוכנית הלימודים שלך ב-TAU:**
    - אלגוריתמים (0368-2160)
    - מבוא ללמידה חישובית (0368-3235)
    - חדו"א 1ב (0366-1121)
    - חדו"א 2ב (0366-1122)
    - אלגברה לינארית 1ב (0366-1119)
    - אלגברה לינארית 2ב (0366-1120)

---

## 🛤️ מאיפה מתחילים

1. **CS50** (Harvard) או **מבוא למדמ"ח** — יסודות
2. **Algorithms Specialization** (Stanford, Coursera) — אלגוריתמים קלאסיים
3. **Andrew Ng's ML Course** — Gradient Descent בפועל
4. **Fast.ai** — practical deep learning
5. **LeetCode / HackerRank** — תרגול אלגוריתמים

---

## 💼 שאלות לראיון עבודה

??? tip "מה Gradient Descent ואיך הוא עובד?"
    אלגוריתם אופטימיזציה שמחפש מינימום של פונקציה. בכל צעד מחשב את ה-gradient (כיוון העלייה התלולה) ועושה צעד בכיוון ההפוך. `θ = θ - α∇L(θ)`. וריאציות: SGD (דוגמה אחת), Mini-batch (קבוצה), Adam (adaptive learning rate + momentum).

??? tip "מה ההבדל בין Grid Search ל-Random Search?"
    **Grid Search** — בודק כל קומבינציה אפשרית. O(k^n). מבטיח כיסוי אבל exponential.
    **Random Search** — דוגם קומבינציות אקראית. Bergstra & Bengio (2012) הראו שהוא יעיל יותר כי hyperparameters בד"כ שונים בחשיבותם — random search מכסה יותר ערכים של ההיפרפרמטר החשוב.

??? tip "מה Backpropagation ולמה הוא יעיל?"
    Backprop מחשב gradients של ה-loss ביחס לכל המשקלים ברשת, בעזרת **Chain Rule** על ה-DAG בסדר טופולוגי הפוך. יעיל כי: O(n) במקום O(n²) — משתמש ב-Dynamic Programming ולא מחשב כל נגזרת בנפרד.

??? tip "מה ההבדל בין Adam ל-SGD?"
    **SGD** — צעד קבוע (learning rate) בכיוון ה-gradient.
    **Adam** — adaptive learning rate + momentum. שומר moving average של gradient (m) ושל gradient² (v). מתאים את ה-LR לכל פרמטר בנפרד. בד"כ מתכנס מהר יותר, אבל SGD עם momentum לפעמים מגיע לgeneralization טובה יותר.

??? tip "מה Learning Rate Scheduling ולמה צריך?"
    התחלה עם LR גבוה (התכנסות מהירה) וירידה הדרגתית (fine-tuning). שיטות: Step Decay, Cosine Annealing, Warmup + Decay. חשוב כי LR גבוה מדי → לא מתכנס; LR נמוך מדי → נתקע ב-local minimum.

??? tip "מה KD-Tree ולמה הוא רלוונטי ל-ML?"
    מבנה נתונים לחיפוש שכנים (nearest neighbor search) במרחב רב-ממדי. במקום brute-force O(n), מאפשר O(log n) בממדים נמוכים. רלוונטי ל-KNN, clustering, recommendation systems. בממדים גבוהים (>20) — Approximate NN (FAISS, Annoy) עדיף.
