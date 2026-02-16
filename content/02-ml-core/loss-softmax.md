# Loss & Softmax

## למה זה חשוב

כל תהליך הלמידה ב-Machine Learning מתבסס על **Loss Function** -- פונקציה שמודדת כמה המודל **טועה**. בלי Loss Function, אין למודל "כיוון" לשפר את עצמו. ו-**Softmax** הוא הגשר שממיר ציונים גולמיים (logits) להסתברויות -- מה שמאפשר למודל "לומר" כמה הוא בטוח בכל תשובה.

- Loss Function = ה-GPS של המודל. בלעדיה הוא לא יודע לאן ללכת.
- Softmax = הממיר שהופך מספרים שרירותיים להתפלגות הסתברויות.
- Gradient Descent ממזער את ה-Loss, וכך המודל "לומד".

## רעיונות מרכזיים

### מהי Loss Function?

Loss Function (פונקציית הפסד) מקבלת את **החיזוי של המודל** ואת **התשובה האמיתית**, ומחזירה מספר שמייצג את **גודל הטעות**:

```
Loss = f(prediction, actual)
```

- Loss גבוה = המודל טועה מאוד
- Loss נמוך = המודל קרוב לתשובה הנכונה
- **המטרה: למזער את ה-Loss**

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

### Cross-Entropy Loss

משמש בעיקר ל-**Classification**:

$$\text{CE} = -\sum_{i=1}^{C} y_i \cdot \log(\hat{y}_i)$$

כאש $y_i$ הוא ה-Label האמיתי (one-hot) ו-$\hat{y}_i$ הוא ההסתברות שהמודל חזה.

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

!!! warning "Softmax != Sigmoid"
    - **Sigmoid** ממפה מספר בודד ל-[0,1]. משמש ל-Binary Classification.
    - **Softmax** ממפה וקטור שלם ל-התפלגות הסתברויות. משמש ל-Multi-class Classification.
    - ב-Binary, Softmax עם 2 classes שקול ל-Sigmoid.

### למה ממזערים Loss?

תהליך האימון עובד כך:

```
1. Forward pass   --> חישוב חיזוי
2. Loss           --> מדידת טעות
3. Backward pass  --> חישוב Gradients (נגזרות)
4. Update weights --> w = w - lr * gradient  (Gradient Descent)
5. חזור ל-1
```

??? tip "אינטואיציה: גלישה בהר"
    דמיינו שאתם עומדים על הר ורוצים להגיע לנקודה הנמוכה ביותר (Loss מינימלי). ב-Gradient Descent אתם מסתכלים לאיזה כיוון ההר יורד הכי תלול (Gradient), ועושים צעד קטן לשם (Learning Rate). חוזרים על זה עד שמגיעים לעמק.

## בלבולים נפוצים

- **"Loss = Error"** -- Loss הוא מדד מתמטי ספציפי. "Error" הוא מונח כללי יותר. לא כל Error הוא Loss, ולא כל Loss מודד את מה שאנחנו באמת רוצים למדוד (למשל, Loss יכול לרדת אבל Accuracy לא עולה).
- **"Softmax עושה את הסיווג"** -- לא! Softmax רק ממיר logits להסתברויות. הסיווג עצמו הוא ה-`argmax` -- בחירת הקטגוריה עם ההסתברות הגבוהה ביותר.
- **"אפשר להשתמש ב-MSE ל-Classification"** -- טכנית אפשר, אבל זה עובד הרבה פחות טוב. Cross-Entropy מותאם למשימות סיווג כי הוא "מעניש" חיזויים בטוחים אבל שגויים הרבה יותר חזק.
- **"Loss נמוך = מודל טוב"** -- לא בהכרח! Loss נמוך על ה-Training set יכול להעיד על **Overfitting**. מה שחשוב זה ה-Loss על ה-Validation set.

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

## קישורים לנושאים אחרים

- [סיווג (Classification)](classification.md) -- Loss Functions הם חלק בלתי נפרד מתהליך הסיווג
- [רשתות נוירונים](neural-networks.md) -- Backpropagation ממזער את ה-Loss דרך שכבות הרשת
- [אלגוריתמים ב-ML](../01-algorithmics/algorithms-in-ml.md) -- Gradient Descent והאלגוריתמים שממזערים Loss
