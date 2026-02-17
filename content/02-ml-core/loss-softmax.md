# Loss & Softmax

## למה זה חשוב

כל תהליך הלמידה ב-Machine Learning מתבסס על **Loss Function** -- פונקציה שמודדת כמה המודל **טועה**. בלי Loss Function, אין למודל "כיוון" לשפר את עצמו. ו-**Softmax** הוא הגשר שממיר ציונים גולמיים (logits) להסתברויות -- מה שמאפשר למודל "לומר" כמה הוא בטוח בכל תשובה.

- Loss Function = ה-GPS של המודל. בלעדיה הוא לא יודע לאן ללכת.
- Softmax = הממיר שהופך מספרים שרירותיים להתפלגות הסתברויות.
- Gradient Descent ממזער את ה-Loss, וכך המודל "לומד".

!!! quote "Gradient Descent -- כמו לרדת מהר בלי מפה, רק שפה אתה עולה על Loss"
    המודל לא יודע איפה המינימום. הוא רק יודע לאיזה כיוון ה-Loss יורד. אז הוא עושה צעד קטן, בודק שוב, ועוד צעד. לפעמים הוא מגיע לעמק מקומי ולא גלובלי -- אבל עם מספיק טריקים, זה עובד מפתיע טוב.

## רעיונות מרכזיים

### מהי Loss Function?

Loss Function (פונקציית הפסד) מקבלת את **החיזוי של המודל** ואת **התשובה האמיתית**, ומחזירה מספר שמייצג את **גודל הטעות**:

```
Loss = f(prediction, actual)
```

- Loss גבוה = המודל טועה מאוד
- Loss נמוך = המודל קרוב לתשובה הנכונה
- **המטרה: למזער את ה-Loss**

פורמלית, עבור Dataset שלם, אנחנו ממזערים את ה-**Expected Loss** (ממוצע על כל הדגימות):

$$\mathcal{L}(\theta) = \frac{1}{N} \sum_{i=1}^{N} \ell(f_\theta(\mathbf{x}_i), y_i)$$

כאשר $\theta$ הם ה-Parameters של המודל, $f_\theta$ הוא המודל, ו-$\ell$ היא ה-Loss Function על דגימה בודדת.

### MSE -- Mean Squared Error

משמש בעיקר ל-**Regression** (חיזוי מספרים רציפים):

$$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$$

```python
import numpy as np

y_true = np.array([3.0, 5.0, 2.5])
y_pred = np.array([2.8, 5.2, 2.0])

mse = np.mean((y_true - y_pred) ** 2)  # = 0.11
```

!!! note "למה בריבוע?"
    1. ריבוע הופך ערכים שליליים לחיוביים (טעות של -2 ו-+2 שקולים).
    2. ריבוע "מעניש" טעויות גדולות יותר מטעויות קטנות (טעות של 4 "עולה" פי 4 מטעות של 2).
    3. הנגזרת של $x^2$ היא $2x$ -- פשוטה וחלקה, מה שמקל על Gradient Descent.

**MAE -- Mean Absolute Error (חלופה):**

$$\text{MAE} = \frac{1}{n}\sum_{i=1}^{n}|y_i - \hat{y}_i|$$

??? tip "MSE vs MAE -- מתי מה?"
    - **MSE** -- מעניש טעויות גדולות בצורה חזקה (בריבוע). טוב כשטעויות גדולות באמת חמורות. רגיש ל-Outliers.
    - **MAE** -- מטפל בכל טעות באופן שווה (ליניארי). חסין יותר ל-Outliers, אבל הנגזרת לא חלקה ב-0.
    - **Huber Loss** -- שילוב: MSE לטעויות קטנות, MAE לטעויות גדולות. "הטוב משני העולמות".

    $$L_\delta(y, \hat{y}) = \begin{cases} \frac{1}{2}(y - \hat{y})^2 & \text{if } |y - \hat{y}| \leq \delta \\ \delta |y - \hat{y}| - \frac{1}{2}\delta^2 & \text{otherwise} \end{cases}$$

### Cross-Entropy Loss

משמש בעיקר ל-**Classification**:

$$\text{CE} = -\sum_{i=1}^{C} y_i \cdot \log(\hat{y}_i)$$

כאשר $y_i$ הוא ה-Label האמיתי (one-hot) ו-$\hat{y}_i$ הוא ההסתברות שהמודל חזה.

**אינטואיציה:** Cross-Entropy מודד כמה ה-"הפתעה" של המודל גדולה. אם המודל נתן הסתברות גבוהה לתשובה הנכונה -- "הפתעה" קטנה (Loss נמוך). אם המודל נתן הסתברות נמוכה לתשובה הנכונה -- "הפתעה" גדולה (Loss גבוה).

מתמטית, כשה-Label הוא one-hot (רק איבר אחד הוא 1), הנוסחה מתפשטת ל:

$$\text{CE} = -\log(\hat{y}_c)$$

כאשר $c$ הוא ה-index של הקטגוריה הנכונה. זה Negative Log Likelihood (NLL).

ל-Binary Classification:

$$\text{BCE} = -[y \cdot \log(\hat{y}) + (1-y) \cdot \log(1-\hat{y})]$$

```python
# דוגמה: המודל חוזה הסתברות 0.9 שזה חתול, ובאמת זה חתול (y=1)
y_true = 1
y_pred = 0.9
loss = -(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
# loss = 0.105 -- נמוך, כי המודל צדק!

y_pred_bad = 0.1  # המודל טועה בגדול
loss_bad = -(y_true * np.log(y_pred_bad) + (1 - y_true) * np.log(1 - y_pred_bad))
# loss_bad = 2.302 -- גבוה, כי המודל טעה!
```

!!! info "למה לא MSE ל-Classification?"
    MSE ל-Classification עובד טכנית, אבל **Cross-Entropy עדיף** כי:

    1. **Gradient חזק יותר**: כשהמודל טועה בביטחון (חזה 0.01 במקום 1), הנגזרת של CE היא ענקית ודוחפת לתיקון מהיר. MSE נותן Gradient קטן יותר במצבים כאלה.
    2. **קשור להסתברות**: CE מגיע מתורת האינפורמציה ומתאים באופן טבעי להתפלגויות הסתברות.
    3. **Convexity**: CE + Softmax נותנים Loss convex ביחס ל-Logits, מה שמקל על אופטימיזציה.

### Softmax

Softmax ממיר וקטור של ציונים גולמיים (**logits**) לוקטור של **הסתברויות** שסכומן 1:

$$\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}$$

```python
def softmax(logits):
    exp_logits = np.exp(logits - np.max(logits))  # חיסור max למניעת overflow
    return exp_logits / exp_logits.sum()

logits = np.array([2.0, 1.0, 0.1])
probs = softmax(logits)
print(probs)       # [0.659, 0.242, 0.099]
print(probs.sum()) # 1.0
```

```
logits:        [2.0,   1.0,   0.1]
                 |       |      |
              softmax  softmax  softmax
                 |       |      |
probabilities: [0.659, 0.242, 0.099]  --> sum = 1.0
```

**תכונות חשובות של Softmax:**

1. **כל ערך בין 0 ל-1**, והסכום תמיד 1 -- התפלגות הסתברויות תקינה.
2. **מגדיל פערים** -- Logit גדול יותר מקבל הסתברות גבוהה יותר באופן אקספוננציאלי.
3. **לא משנה Shift** -- $\text{softmax}(\mathbf{z} + c) = \text{softmax}(\mathbf{z})$. לכן חיסור Max לא משנה תוצאה, רק מונע overflow.

??? tip "Temperature -- שליטה ב-'ביטחון' של Softmax"
    אפשר לשלוט בכמה "חד" או "שטוח" הפלט של Softmax ע"י **Temperature** $T$:

    $$\text{softmax}(z_i; T) = \frac{e^{z_i / T}}{\sum_{j} e^{z_j / T}}$$

    - $T \to 0$: Softmax הופך ל-argmax (הסתברות 1 ל-max, 0 לשאר). **חד מאוד**.
    - $T = 1$: Softmax רגיל.
    - $T \to \infty$: כל ההסתברויות שוות ($1/K$). **שטוח לגמרי**.

    זה שימושי ב-LLMs: Temperature נמוך = תשובות "בטוחות" וצפויות. Temperature גבוה = תשובות "יצירתיות" ומפתיעות.

    ```python
    def softmax_with_temp(logits, temperature=1.0):
        scaled = logits / temperature
        exp_scaled = np.exp(scaled - np.max(scaled))
        return exp_scaled / exp_scaled.sum()

    logits = np.array([2.0, 1.0, 0.1])
    print(softmax_with_temp(logits, T=0.5))   # [0.844, 0.114, 0.042] -- חד
    print(softmax_with_temp(logits, T=1.0))   # [0.659, 0.242, 0.099] -- רגיל
    print(softmax_with_temp(logits, T=5.0))   # [0.391, 0.325, 0.284] -- שטוח
    ```

!!! warning "Softmax != Sigmoid"
    - **Sigmoid** ממפה מספר בודד ל-[0,1]. משמש ל-Binary Classification.
    - **Softmax** ממפה וקטור שלם ל-התפלגות הסתברויות. משמש ל-Multi-class Classification.
    - ב-Binary, Softmax עם 2 classes שקול ל-Sigmoid.

    מתמטית, ל-2 classes:

    $$\text{softmax}(z_1, z_2) = \frac{e^{z_1}}{e^{z_1} + e^{z_2}} = \frac{1}{1 + e^{-(z_1 - z_2)}} = \sigma(z_1 - z_2)$$

### Gradient Descent -- כיצד ממזערים Loss

תהליך האימון עובד כך:

```
1. Forward pass   --> חישוב חיזוי
2. Loss           --> מדידת טעות
3. Backward pass  --> חישוב Gradients (נגזרות)
4. Update weights --> w = w - lr * gradient  (Gradient Descent)
5. חזור ל-1
```

**הנוסחה המרכזית:**

$$\theta_{t+1} = \theta_t - \eta \cdot \nabla_\theta \mathcal{L}(\theta_t)$$

כאשר $\eta$ הוא ה-**Learning Rate** ו-$\nabla_\theta \mathcal{L}$ הוא ה-Gradient (וקטור הנגזרות החלקיות).

??? tip "אינטואיציה: גלישה בהר"
    דמיינו שאתם עומדים על הר ורוצים להגיע לנקודה הנמוכה ביותר (Loss מינימלי). ב-Gradient Descent אתם מסתכלים לאיזה כיוון ההר יורד הכי תלול (Gradient), ועושים צעד קטן לשם (Learning Rate). חוזרים על זה עד שמגיעים לעמק.

**וריאנטים של Gradient Descent:**

| וריאנט | מה מחשב Gradient על | יתרון | חיסרון |
|--------|---------------------|-------|--------|
| **Batch GD** | כל ה-Dataset | מדויק | איטי מאוד |
| **SGD** | דגימה בודדת | מהיר | רועש מאוד |
| **Mini-batch GD** | Batch קטן (32-256) | איזון טוב | צריך לבחור batch size |

### Optimizers -- מעבר ל-Vanilla SGD

SGD רגיל לרוב לא מספיק. Optimizers מודרניים מוסיפים "חוכמה":

**Adam (Adaptive Moment Estimation)** -- ה-Optimizer הפופולרי ביותר:

$$m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t \quad \text{(Momentum)}$$
$$v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2 \quad \text{(RMSprop)}$$
$$\theta_{t+1} = \theta_t - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}$$

```python
# ב-PyTorch:
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Training loop:
for batch_x, batch_y in dataloader:
    optimizer.zero_grad()          # 1. מאפסים Gradients
    predictions = model(batch_x)    # 2. Forward pass
    loss = criterion(predictions, batch_y)  # 3. חישוב Loss
    loss.backward()                 # 4. Backward pass (Gradients)
    optimizer.step()                # 5. עדכון Weights
```

??? tip "Learning Rate -- כמה לגדול או לקטן?"
    **Learning Rate ($\eta$)** הוא אולי ה-Hyperparameter הקריטי ביותר:

    - **גדול מדי**: המודל "קופץ" ולא מתכנס. Loss מזנק למעלה.
    - **קטן מדי**: התכנסות איטית מאוד. עלול להיתקע ב-Local Minimum.
    - **בדיוק נכון**: התכנסות חלקה ומהירה.

    **Learning Rate Scheduling** -- שינוי ה-LR במהלך האימון:
    - **Step Decay**: מקטין ב-factor כל $n$ epochs
    - **Cosine Annealing**: יורד בצורת Cosine
    - **Warmup + Decay**: מתחיל נמוך, עולה, ואז יורד (נפוץ ב-Transformers)

### Label Smoothing

טכניקה שמונעת מהמודל להיות "בטוח מדי":

$$y_i^{\text{smooth}} = (1 - \alpha) \cdot y_i + \frac{\alpha}{K}$$

במקום Labels "חדים" [1, 0, 0], משתמשים ב-[0.9, 0.05, 0.05] (עם $\alpha = 0.1$).

!!! quote "אם הרשת שלך מתכנסת מהר מדי, היא כנראה פשוט לא למדה כלום"
    Overfitting ל-Training set זה קל. הלמידה האמיתית נמדדת על ה-Validation set. אם ה-Training Loss יורד אבל ה-Validation Loss עולה -- תפסיקו לאמן (Early Stopping) ותוסיפו Regularization.

### Focal Loss -- ל-Imbalanced Data

כש-classes לא מאוזנים, Cross-Entropy רגיל "מתמקד" בדגימות קלות. **Focal Loss** מוסיף מקדם שמקטין את ה-Loss על דגימות קלות ומגדיל אותו על דגימות קשות:

$$\text{FL}(p_t) = -\alpha_t (1 - p_t)^\gamma \log(p_t)$$

כאשר $\gamma$ (בד"כ 2) קובע כמה "מתעלמים" מדגימות קלות. $p_t$ היא ההסתברות לקטגוריה הנכונה.

## בלבולים נפוצים

- **"Loss = Error"** -- Loss הוא מדד מתמטי ספציפי. "Error" הוא מונח כללי יותר. לא כל Error הוא Loss, ולא כל Loss מודד את מה שאנחנו באמת רוצים למדוד (למשל, Loss יכול לרדת אבל Accuracy לא עולה).
- **"Softmax עושה את הסיווג"** -- לא! Softmax רק ממיר logits להסתברויות. הסיווג עצמו הוא ה-`argmax` -- בחירת הקטגוריה עם ההסתברות הגבוהה ביותר.
- **"אפשר להשתמש ב-MSE ל-Classification"** -- טכנית אפשר, אבל זה עובד הרבה פחות טוב. Cross-Entropy מותאם למשימות סיווג כי הוא "מעניש" חיזויים בטוחים אבל שגויים הרבה יותר חזק.
- **"Loss נמוך = מודל טוב"** -- לא בהכרח! Loss נמוך על ה-Training set יכול להעיד על **Overfitting**. מה שחשוב זה ה-Loss על ה-Validation set.
- **"Learning Rate גדול = למידה מהירה"** -- לא! LR גדול מדי גורם למודל "לקפוץ" מעבר למינימום ולהתבדר. LR קטן מדי = התכנסות איטית. צריך את הגודל הנכון.
- **"Adam תמיד עדיף על SGD"** -- לא תמיד! SGD with Momentum לפעמים נותן **הכללה טובה יותר** (ביצועים טובים יותר על Test). הרבה מודלים SOTA ב-Computer Vision מאומנים עם SGD.

## דוגמה קטנה

נראה את כל הצינור: logits -> Softmax -> Cross-Entropy Loss:

```python
import numpy as np

# המודל מוציא logits עבור 3 קטגוריות: [חתול, כלב, ציפור]
logits = np.array([2.5, 0.3, -1.2])

# שלב 1: Softmax -- המרה להסתברויות
def softmax(z):
    exp_z = np.exp(z - np.max(z))
    return exp_z / exp_z.sum()

probs = softmax(logits)
print(f"Probabilities: {probs.round(3)}")
# [0.879, 0.109, 0.012]  --> "כמעט בטוח שזה חתול"

# שלב 2: Cross-Entropy Loss
# התשובה האמיתית: חתול (index 0)
true_label = 0
loss = -np.log(probs[true_label])
print(f"Loss: {loss:.4f}")
# Loss: 0.1291 -- נמוך, כי המודל צדק!

# מה אם התשובה האמיתית הייתה כלב (index 1)?
loss_wrong = -np.log(probs[1])
print(f"Loss if dog: {loss_wrong:.4f}")
# Loss: 2.2161 -- גבוה, כי המודל נתן הסתברות נמוכה לכלב
```

!!! note "שימו לב"
    כשהמודל צודק (נותן הסתברות גבוהה לקטגוריה הנכונה), ה-Loss נמוך. כשהמודל טועה -- ה-Loss גבוה. זה מה שמאפשר ל-Gradient Descent ללמוד לתקן את הטעויות.

**דוגמה: Training Loop מלא:**

```python
import torch
import torch.nn as nn

# מודל פשוט
model = nn.Linear(4, 3)  # 4 features -> 3 classes

# Loss Function + Optimizer
criterion = nn.CrossEntropyLoss()  # כולל Softmax בפנים!
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Training loop
for epoch in range(100):
    # Forward
    logits = model(X_train)
    loss = criterion(logits, y_train)

    # Backward + Update
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if epoch % 10 == 0:
        print(f"Epoch {epoch}: Loss = {loss.item():.4f}")
```

!!! warning "nn.CrossEntropyLoss כולל Softmax!"
    ב-PyTorch, `nn.CrossEntropyLoss` מקבל **logits** (לא הסתברויות). הוא מחשב Softmax + Cross-Entropy בפנים באופן יעיל ומספרית יציב. **אל תעבירו את הפלט דרך Softmax לפני CrossEntropyLoss** -- זה כפל Softmax!

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - חדו"א — נגזרות, Chain Rule, gradient
    - הסתברות וסטטיסטיקה — MLE, distributions, cross-entropy
    - אלגברה לינארית — matrix calculus, vector derivatives
    - למידת מכונה — optimization, loss functions, regularization

    **קורסים מומלצים:**
    - אופטימיזציה — convex optimization, SGD variants, convergence
    - תורת המידע — entropy, KL divergence, information theory

    **ידע מעשי:**
    - Python + NumPy — manual gradient computation
    - PyTorch — autograd, loss functions, optimizers
    - Experiment tracking — Weights & Biases, TensorBoard

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא ללמידה חישובית (0368-3235)
    - חשבון דיפרנציאלי ואינטגרלי 1ב (0366-1121)
    - חשבון דיפרנציאלי ואינטגרלי 2ב (0366-1122)
    - הסתברות וסטטיסטיקה לדו-חוגי (0368-2002)

---

## 🛤️ מאיפה מתחילים

1. **הבינו את MSE** -- ממשו MSE ידנית ב-NumPy. חשבו את הנגזרת שלו ידנית ($\frac{\partial}{\partial \hat{y}} = 2(\hat{y} - y)$).
2. **הבינו Softmax** -- ממשו Softmax ידנית. בדקו שהסכום = 1. שחקו עם Temperature.
3. **הבינו Cross-Entropy** -- חשבו CE ידנית עבור כמה דוגמאות. ראו איך הוא גדל כשהמודל "בטוח אבל טועה".
4. **PyTorch Basics** -- כתבו Training Loop מלא עם `nn.CrossEntropyLoss` ו-`Adam`. אמנו מודל על Iris dataset.
5. **השוו Loss Functions** -- אמנו את אותו מודל עם MSE ועם CE ל-Classification. ראו את ההבדל בביצועים.
6. **Learning Rate Experiment** -- אמנו עם LR שונים (0.1, 0.01, 0.001, 0.0001). שרטטו את ה-Loss curve.
7. **Optimizer Comparison** -- השוו SGD, SGD+Momentum, Adam על אותה בעיה.

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Softmax ל-Sigmoid?"
    **Sigmoid** ממפה מספר בודד ל-$[0,1]$: $\sigma(z) = \frac{1}{1+e^{-z}}$. משמש ל-Binary Classification או Multi-label (כל Label עצמאי).

    **Softmax** ממפה וקטור שלם להתפלגות הסתברויות שסכומה 1: $\text{softmax}(z_i) = \frac{e^{z_i}}{\sum e^{z_j}}$. משמש ל-Multi-class Classification (קטגוריה אחת בלבד).

    עבור 2 classes, Softmax שקול ל-Sigmoid. ההבדל הקריטי: Softmax יוצר **תחרות** בין הקטגוריות (אם אחת עולה, אחרות יורדות). Sigmoid לא.

??? tip "למה משתמשים ב-Cross-Entropy ולא ב-MSE ל-Classification?"
    1. **Gradient חזק יותר**: כשהמודל טועה בביטחון (חזה 0.01 במקום 1), CE נותן Gradient ענקי שמתקן מהר. MSE נותן Gradient קטן.
    2. **מתאים להסתברויות**: CE מגיע מתורת האינפורמציה ונותן Loss אופטימלי למדידת "מרחק" בין התפלגויות.
    3. **Convexity**: CE + Softmax = Loss convex ביחס ל-logits, מה שמבטיח התכנסות.
    4. **Logarithmic scale**: $-\log(0.01) = 4.6$ אבל $-\log(0.5) = 0.69$. CE "מעניש" בצורה לוגריתמית, מה שנותן סיגנל חזק לטעויות גדולות.

??? tip "מה זה Logit? מה הקשר בין Logit ל-Logistic ל-Softmax?"
    **Logit** = הפלט הגולמי של מודל לפני Sigmoid/Softmax. מתמטית, Logit הוא ה-log-odds: $\text{logit}(p) = \log \frac{p}{1-p}$.

    **Logistic function** = Sigmoid = ההפך של Logit: $\sigma(z) = \frac{1}{1+e^{-z}}$.

    **Softmax** = הכללה של Sigmoid ל-Multi-class.

    הזרימה: Logits -> Softmax -> Probabilities -> argmax -> Prediction.

??? tip "מהו Learning Rate ולמה הוא כל כך קריטי?"
    **Learning Rate** ($\eta$) קובע את גודל הצעד בכל עדכון: $\theta = \theta - \eta \nabla L$.

    גבוה מדי: המודל מתבדר (Loss מזנק). נמוך מדי: התכנסות איטית, עלול להיתקע ב-Local Minimum. הערכים הנפוצים: 0.001-0.01 ל-Adam, 0.01-0.1 ל-SGD.

    פתרונות: **LR Scheduling** (Warmup + Cosine Decay), **LR Range Test** (מוצאים את ה-LR האופטימלי ע"י הגדלה הדרגתית).

??? tip "מה ההבדל בין SGD ל-Adam? מתי תבחרו בכל אחד?"
    **SGD** (+ Momentum): פשוט, LR קבוע לכל ה-Parameters. דורש כיוונון LR קפדני. נוטה **להכליל טוב יותר** (generalization).

    **Adam**: LR אדפטיבי לכל Parameter (מתאים את גודל הצעד לפי ה-Gradient ההיסטורי). מתכנס מהר, פחות רגיש ל-LR. לפעמים **מכליל פחות טוב**.

    **כלל אצבע**: Adam ל-NLP/Transformers, SGD+Momentum ל-Computer Vision. Adam לפרויקטים מהירים, SGD כשזמן וביצועים חשובים.

??? tip "מה זה Numerical Stability ב-Softmax? למה מחסרים את ה-Max?"
    $e^{z_i}$ גדל מהר מאוד. למשל, $e^{1000}$ הוא Overflow (infinity). חיסור $\max(z)$ מכל ה-logits מונע overflow מבלי לשנות את התוצאה:

    $$\text{softmax}(z_i - c) = \frac{e^{z_i - c}}{\sum e^{z_j - c}} = \frac{e^{z_i} / e^c}{\sum e^{z_j} / e^c} = \text{softmax}(z_i)$$

    זה חשוב ב-Production code. ב-PyTorch, `F.log_softmax` ו-`nn.CrossEntropyLoss` עושים את זה אוטומטית.

??? tip "מה זה Label Smoothing ולמה משתמשים בזה?"
    במקום Labels חדים [1, 0, 0], משתמשים ב-Labels "מרוככים" [0.9, 0.05, 0.05]. זה מונע מהמודל להיות "בטוח מדי" (overconfident), משפר Calibration (ההסתברויות שהמודל מוציא מדויקות יותר), ומשפר הכללה.

    נפוץ ב-Transformers (בד"כ $\alpha = 0.1$). ב-PyTorch: `nn.CrossEntropyLoss(label_smoothing=0.1)`.

??? tip "הסבירו את הקשר בין Loss Function, Gradient, ו-Backpropagation."
    **Loss Function** מודדת את הטעות. **Gradient** ($\nabla L$) מראה לאיזה כיוון ובכמה לשנות כל Weight כדי להקטין את ה-Loss. **Backpropagation** הוא האלגוריתם שמחשב את ה-Gradient ביעילות ע"י שימוש ב-Chain Rule לאחור דרך שכבות הרשת.

    בלי Loss -- אין מה למדוד. בלי Gradient -- אין כיוון ללמידה. בלי Backpropagation -- חישוב ה-Gradient יהיה איטי מדי. שלושתם יחד מאפשרים למודלים עם מיליארדי Parameters ללמוד.

## קישורים לנושאים אחרים

- [סיווג (Classification)](classification.md) -- Loss Functions הם חלק בלתי נפרד מתהליך הסיווג
- [רשתות נוירונים](neural-networks.md) -- Backpropagation ממזער את ה-Loss דרך שכבות הרשת
- [אלגוריתמים ב-ML](../01-algorithmics/algorithms-in-ml.md) -- Gradient Descent והאלגוריתמים שממזערים Loss
- [Transformers](transformers.md) -- Temperature ב-Softmax שולט ביצירת טקסט
