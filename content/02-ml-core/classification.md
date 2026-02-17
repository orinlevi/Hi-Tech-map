# סיווג (Classification)

## למה זה חשוב

Classification הוא אחת המשימות **הנפוצות ביותר** ב-Machine Learning. בכל פעם שמודל צריך "להחליט" לאיזו קטגוריה שייך קלט מסוים -- זה Classification:

- האם המייל הזה ספאם או לא? (Binary Classification)
- איזו ספרה מופיעה בתמונה? 0-9 (Multi-class Classification)
- איזה סוג רגש יש בטקסט? שמחה / עצב / כעס / ... (Multi-class)

הבנה של Classification היא **בסיס הכרחי** להבנת כל מה שבא אחר כך -- מ-Neural Networks ועד LLMs.

!!! quote "Classification -- כי בסוף מישהו צריך להחליט"
    אפילו GPT-4, שנראה כאילו הוא "יודע הכל", בבסיסו פשוט עושה Classification: מתוך 100,000+ טוקנים, הוא בוחר את הטוקן הבא. זה Multi-class Classification עם הרבה מאוד קטגוריות.

## רעיונות מרכזיים

### מהו Classification?

Classification = **שיוך של קלט ל-Label (תווית)**. המודל מקבל Feature Vector ומחזיר חיזוי לאיזו קבוצה הוא שייך.

```
Input: [שטח=85, חדרים=3.5, קומה=4] --> Model --> Output: "דירה יקרה"
```

מתמטית, Classifier הוא פונקציה $f: \mathbb{R}^n \to \{1, 2, \ldots, C\}$ שמקבלת Feature Vector ומחזירה Label. ברוב המודלים המודרניים, הפלט הוא **וקטור הסתברויות** $\mathbf{p} \in \mathbb{R}^C$ כך ש-$\sum_{i=1}^{C} p_i = 1$, והסיווג הסופי הוא:

$$\hat{y} = \arg\max_{i} p_i$$

### Binary vs Multi-class

| סוג | מספר קטגוריות | דוגמה | פונקציית פלט |
|------|--------------|--------|-------------|
| **Binary** | 2 | ספאם / לא ספאם | Sigmoid |
| **Multi-class** | 3+ | חתול / כלב / ציפור | Softmax |
| **Multi-label** | מספר תוויות לכל דגימה | תמונה שהיא גם "חוף" וגם "שקיעה" | Sigmoid per label |

!!! info "Multi-class vs Multi-label -- הבדל קריטי"
    ב-**Multi-class**, כל דגימה שייכת ל-**קטגוריה אחת בלבד** (חתול OR כלב OR ציפור). Softmax מבטיח שההסתברויות מסתכמות ל-1.

    ב-**Multi-label**, דגימה יכולה להיות שייכת ל-**מספר קטגוריות** בו-זמנית (חוף AND שקיעה AND ים). כל Label מקבל Sigmoid עצמאי -- אין אילוץ שהסכום יהיה 1.

### Decision Boundary -- גבול ההחלטה

כל Classifier למעשה מחלק את המרחב ל-"אזורים" -- כל אזור שייך לקטגוריה אחרת. ה-**Decision Boundary** הוא הגבול בין האזורים:

```
        Logistic Regression          Decision Tree           Neural Network
        (גבול ליניארי)               (גבולות מדרגתיים)        (גבול מורכב)

         +  +  |  o  o              +  +  | o  o            +  +    o  o
         +  + /  o  o               +  +  | o  o            +  + \  o  o
         +  /  o  o  o              ------+------            +   _) o  o
         + /  o  o  o               + + + | o  o            + +/  o  o  o
         /  o  o  o  o              + + + | o  o             + |  o  o  o
```

??? tip "Bias-Variance Tradeoff"
    - **Underfitting (High Bias)**: גבול החלטה פשוט מדי (קו ישר למחולק מעגלי). המודל לא לומד את הדפוס.
    - **Overfitting (High Variance)**: גבול החלטה מורכב מדי (עוקב אחרי כל נקודת רעש). המודל "שינן" את ה-Training data.
    - **Just Right**: גבול שמזהה את הדפוס הכללי בלי לעקוב אחרי רעש.

    $$\text{Total Error} = \text{Bias}^2 + \text{Variance} + \text{Irreducible Noise}$$

### אלגוריתמים קלאסיים (בקצרה)

**Logistic Regression** -- למרות השם, זה אלגוריתם Classification:

```python
# הרעיון: מכפילים Features במשקולות, מעבירים דרך Sigmoid
z = w1*x1 + w2*x2 + ... + b
probability = 1 / (1 + exp(-z))  # Sigmoid: ממפה ל-[0,1]
```

מתמטית, Logistic Regression מחשב:

$$P(y=1|\mathbf{x}) = \sigma(\mathbf{w}^T \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{x} + b)}}$$

כאשר $\sigma$ היא פונקציית Sigmoid. ה-Decision Boundary הוא **Hyperplane** (ישר ב-2D, מישור ב-3D) במרחב:

$$\mathbf{w}^T \mathbf{x} + b = 0$$

!!! note "למה קוראים לזה Regression?"
    כי ההיסטוריה. המודל מבצע Regression על ה-log-odds, ואז ממיר להסתברות. בפועל -- זה Classifier.

    $$\log \frac{P(y=1)}{P(y=0)} = \mathbf{w}^T \mathbf{x} + b$$

    הביטוי $\frac{P(y=1)}{P(y=0)}$ נקרא **Odds**, והלוגריתם שלו הוא ה-**Log-Odds** (או **Logit**). זה הקשר בין "Logistic" ו-"Logit".

**Decision Tree** -- עץ החלטות: סדרה של שאלות if/else:

```
                  שטח > 80?
                 /          \
              כן              לא
            /                   \
      חדרים > 3?              "זולה"
       /       \
     כן        לא
    /             \
 "יקרה"        "בינונית"
```

??? tip "Entropy ו-Information Gain"
    איך Decision Tree "בוחר" איזו שאלה לשאול? ע"י **Information Gain** -- מדד שמציין כמה מידע כל שאלה מוסיפה. הבסיס הוא **Entropy** -- מדד ל"אי-סדר" בנתונים:

    $$H(S) = -\sum_{i=1}^{C} p_i \log_2(p_i)$$

    - Entropy מקסימלי: כל הקטגוריות בסיכוי שווה (50-50 = $H=1$).
    - Entropy מינימלי (0): כל הנתונים שייכים לקטגוריה אחת (100-0).

    Information Gain = Entropy לפני הפיצול MINUS ממוצע ה-Entropy אחרי הפיצול. בוחרים את הפיצול עם ה-Gain הגבוה ביותר.

**SVM (Support Vector Machine)** -- מוצא את ה-Hyperplane שמפריד הכי טוב בין הקטגוריות, עם Margin מקסימלי.

$$\text{maximize } \frac{2}{||\mathbf{w}||} \text{ subject to } y_i(\mathbf{w}^T \mathbf{x}_i + b) \geq 1$$

ה-**Support Vectors** הם הנקודות הקרובות ביותר ל-Decision Boundary -- הן "מגדירות" את הגבול.

!!! quote "SVM -- כמו חניון: מחפשים את הנתיב הכי רחב בין שני אזורים"
    אם מגרש כדורגל מפריד בין ילדים לגדולים, SVM ימצא את הקו שנותן את הרווח (Margin) הכי רחב בין הקבוצות. הנקודות שקרובות לקו -- אלה ה-Support Vectors.

**Random Forest** -- Ensemble של Decision Trees:

```python
# רעיון: מאמנים הרבה עצים שונים (Bagging) ומצביעים רוב
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
# כל עץ מצביע, ולוקחים את ההצבעה הנפוצה ביותר
```

??? tip "Ensemble Methods -- חוכמת ההמונים"
    הרעיון: מודלים בודדים טועים, אבל **הרבה מודלים יחד** טועים פחות.

    - **Bagging** (Random Forest): מאמנים מודלים על תת-קבוצות אקראיות של הנתונים. מקטין **Variance**.
    - **Boosting** (XGBoost, LightGBM): כל מודל מתמקד בטעויות של המודל הקודם. מקטין **Bias**.
    - **Stacking**: משתמשים בפלט של מספר מודלים כ-Input למודל "על".

### Train / Validation / Test Split

!!! warning "כלל הזהב: לעולם אל תיגע ב-Test set עד הסוף!"
    - **Train set** (~70%) -- ללמוד ממנו
    - **Validation set** (~15%) -- לכוונן Hyperparameters ולבחור מודל
    - **Test set** (~15%) -- להעריך ביצועים סופיים, **פעם אחת בלבד**

```python
from sklearn.model_selection import train_test_split

# שלב 1: מפרידים Test
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42
)
# שלב 2: מפרידים Validation מתוך השאר
X_train, X_val, y_train, y_val = train_test_split(
    X_train_val, y_train_val, test_size=0.176, random_state=42  # 0.176 * 0.85 ≈ 0.15
)
```

**Cross-Validation** -- כשאין מספיק נתונים:

```python
from sklearn.model_selection import cross_val_score

# K-Fold: מחלקים ל-K חלקים, כל פעם חלק אחר הוא Validation
scores = cross_val_score(model, X, y, cv=5, scoring='f1_macro')
print(f"F1 scores: {scores}")
print(f"Mean F1: {scores.mean():.3f} (+/- {scores.std():.3f})")
```

??? tip "Stratified Split -- שמירה על חלוקת הקטגוריות"
    אם ב-dataset יש 90% חתולים ו-10% כלבים, Split אקראי יכול ליצור Validation set עם 100% חתולים. **Stratified Split** מבטיח שהיחס בין הקטגוריות נשמר בכל חלוקה:

    ```python
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    ```

### Metrics -- מדדי הצלחה

**Accuracy** -- אחוז התחזיות הנכונות:

$$\text{Accuracy} = \frac{\text{Correct Predictions}}{\text{Total Predictions}} = \frac{TP + TN}{TP + TN + FP + FN}$$

??? tip "Accuracy לא תמיד מספיק!"
    אם 99% מהמיילים הם לא ספאם, מודל שתמיד אומר "לא ספאם" יקבל Accuracy של 99% -- אבל הוא חסר ערך. זו בעיית **Imbalanced Classes**.

**Precision** -- מתוך מה שהמודל אמר "חיובי", כמה באמת חיובי?

$$\text{Precision} = \frac{TP}{TP + FP}$$

**Recall (Sensitivity)** -- מתוך כל החיוביים האמיתיים, כמה המודל מצא?

$$\text{Recall} = \frac{TP}{TP + FN}$$

**F1 Score** -- ממוצע הרמוני של Precision ו-Recall:

$$F1 = 2 \cdot \frac{Precision \cdot Recall}{Precision + Recall}$$

```
                    Predicted
                  Pos     Neg
Actual  Pos  |   TP   |   FN   |
        Neg  |   FP   |   TN   |
              --- Confusion Matrix ---
```

!!! info "Precision vs Recall -- מתי מה?"
    - **Precision חשוב** כשה-**False Positive יקר**: סינון ספאם (לא רוצים למחוק מייל חשוב), המלצות רכישה.
    - **Recall חשוב** כשה-**False Negative יקר**: אבחון סרטן (לא רוצים לפספס חולה), זיהוי הונאות.
    - **F1** כשצריך איזון בין השניים, או כשה-dataset לא מאוזן.

**AUC-ROC -- Area Under the ROC Curve:**

ROC Curve מציג את ה-Tradeoff בין Recall (True Positive Rate) ל-False Positive Rate בכל ערכי ה-Threshold:

$$TPR = \frac{TP}{TP + FN}, \quad FPR = \frac{FP}{FP + TN}$$

- AUC = 1.0: מודל מושלם
- AUC = 0.5: מודל אקראי (מטיל מטבע)
- AUC < 0.5: המודל גרוע מאקראי (הפכו את התחזיות!)

```python
from sklearn.metrics import roc_auc_score, roc_curve

y_proba = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_proba)
print(f"AUC-ROC: {auc:.3f}")
```

### התמודדות עם Imbalanced Data

כשקטגוריה אחת נדירה (הונאה, מחלה נדירה), האלגוריתם נוטה "להתעלם" ממנה:

**שיטות נפוצות:**

1. **Oversampling** -- שכפול דגימות מהמיעוט (SMOTE יוצר דגימות סינתטיות)
2. **Undersampling** -- הסרת דגימות מהרוב
3. **Class Weights** -- מתן משקל גבוה יותר למיעוט ב-Loss:

```python
from sklearn.linear_model import LogisticRegression

# class_weight='balanced' מכוונן אוטומטית לפי יחס הקטגוריות
model = LogisticRegression(class_weight='balanced')
```

4. **Threshold Tuning** -- שינוי ה-Threshold מ-0.5 לערך אחר

!!! quote "Imbalanced Data -- כשהמודל אופטימי מדי"
    "99% Accuracy!" -- זה נשמע מדהים, עד שמגלים שהמודל פשוט אומר "לא" על הכל ויש 99% מקרים שליליים. זה כמו רופא שתמיד אומר "אתה בריא" -- רוב הזמן הוא צודק, אבל כשהוא טועה, זה באמת לא טוב.

## בלבולים נפוצים

- **"Accuracy גבוה = מודל טוב"** -- לא בהכרח! ב-Imbalanced datasets, Accuracy מטעה. תמיד צריך לבדוק גם Precision, Recall, F1.
- **"Logistic Regression זה Regression"** -- לא. זה Classifier שמשתמש בפונקציית Sigmoid כדי להחזיר הסתברויות.
- **"צריך תמיד את המודל הכי מורכב"** -- לא. Logistic Regression פשוט, מהיר, ולפעמים עובד לא פחות טוב מ-Deep Learning (במיוחד על Tabular data).
- **"Validation = Test"** -- ממש לא! Validation משמש לכוונון במהלך הפיתוח. Test הוא הערכה סופית.
- **"F1 Score תמיד עדיף על Accuracy"** -- לא בהכרח. אם ה-dataset מאוזן ואין עלות שונה לטעויות שונות, Accuracy בסדר גמור. F1 חשוב דווקא ב-Imbalanced datasets.
- **"Random Forest תמיד עדיף על Decision Tree"** -- בדרך כלל כן, אבל Random Forest איטי יותר, פחות פרשני, ודורש יותר זיכרון. לפעמים עץ בודד מספיק.

## דוגמה קטנה

סיווג פרחי אירוס (Iris) עם Logistic Regression:

```python
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# טוענים את הנתונים
X, y = load_iris(return_X_y=True)

# מחלקים לקבוצות
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# מאמנים מודל
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# מעריכים ביצועים
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# פלט (בערך):
#               precision    recall  f1-score
# setosa            1.00      1.00      1.00
# versicolor        1.00      0.92      0.96
# virginica         0.92      1.00      0.96
# accuracy                              0.97
```

!!! note "שימו לב"
    גם מודל פשוט כמו Logistic Regression מגיע ל-97% accuracy על Dataset הזה. לא תמיד צריך Neural Networks!

**דוגמה נוספת: השוואה בין אלגוריתמים:**

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import f1_score

models = {
    "Logistic Regression": LogisticRegression(max_iter=200),
    "Decision Tree": DecisionTreeClassifier(max_depth=5),
    "Random Forest": RandomForestClassifier(n_estimators=100),
    "SVM": SVC(kernel='rbf'),
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    f1 = f1_score(y_test, y_pred, average='macro')
    print(f"{name:25s} F1={f1:.3f}")

# פלט (בערך):
# Logistic Regression       F1=0.967
# Decision Tree             F1=0.967
# Random Forest             F1=0.967
# SVM                       F1=1.000
```

!!! quote "על Iris Dataset, כמעט הכל עובד"
    אם המודל שלכם לא מגיע ל-95%+ על Iris, כנראה שיש באג בקוד. זה כמו מבחן נהיגה -- אם נכשלתם, הבעיה היא לא בכביש.

## 🛤️ מאיפה מתחילים

1. **הבינו את המושגים** -- ודאו שאתם מבינים Binary vs Multi-class, ואת Confusion Matrix (TP, FP, TN, FN).
2. **Scikit-learn Quickstart** -- אמנו Logistic Regression על Iris dataset. זה לוקח 5 שורות קוד ומלמד את כל ה-flow.
3. **Metrics** -- תרגלו חישוב ידני של Precision, Recall, F1 מתוך Confusion Matrix. הבינו מתי כל אחד חשוב.
4. **השוואת מודלים** -- אמנו 3-4 אלגוריתמים שונים על אותו Dataset (Logistic Regression, Decision Tree, Random Forest, SVM). השוו Metrics.
5. **Cross-Validation** -- במקום Split בודד, השתמשו ב-`cross_val_score` עם K=5.
6. **Imbalanced Data** -- חפשו Dataset לא מאוזן (למשל Credit Card Fraud ב-Kaggle) ונסו SMOTE, Class Weights, Threshold Tuning.
7. **Feature Engineering** -- שחקו עם Features: הוסיפו, הסירו, שנו Scaling, ותראו איך Metrics משתנים.

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Precision ל-Recall? מתי כל אחד חשוב יותר?"
    **Precision** = מתוך מה שהמודל סימן כ-Positive, כמה באמת Positive. **Recall** = מתוך כל ה-Positives האמיתיים, כמה המודל מצא.

    Precision חשוב כשה-**False Positive** יקר: סינון ספאם (לא רוצים למחוק מייל חשוב), המלצות מוצרים. Recall חשוב כשה-**False Negative** יקר: אבחון מחלות (לא רוצים לפספס חולה), זיהוי הונאות פיננסיות.

    F1 Score מאזן בין השניים ושימושי ב-Imbalanced datasets.

??? tip "מה זה Overfitting? איך מזהים ומונעים?"
    **Overfitting** = המודל "שינן" את ה-Training data ולא מצליח להכליל לנתונים חדשים. סימן: ביצועים מצוינים על Train, גרועים על Validation/Test.

    מניעה:
    - **Regularization** (L1/L2) -- מגביל את גודל ה-Weights
    - **Cross-Validation** -- בודק על נתונים שונים
    - **Early Stopping** -- עוצר אימון כשביצועי Validation מתחילים לרדת
    - **יותר נתונים** -- Data Augmentation אם אין
    - **Dropout** (ברשתות נוירונים) -- "מכבה" נוירונים אקראיים באימון
    - **מודל פשוט יותר** -- פחות Parameters, עומק קטן יותר

??? tip "מהם Hyperparameters? מה ההבדל בין Parameters ל-Hyperparameters?"
    **Parameters** (Weights, Biases) נלמדים אוטומטית ע"י המודל באימון. **Hyperparameters** נקבעים ע"י המהנדס *לפני* האימון: Learning Rate, מספר שכבות, Regularization strength, max_depth.

    Hyperparameters מכוונים באמצעות Validation set (לא Test!). שיטות: Grid Search, Random Search, Bayesian Optimization (Optuna).

??? tip "מתי תשתמשו ב-Logistic Regression ומתי ב-Neural Network?"
    **Logistic Regression** כשהנתונים Tabular, מעטים יחסית (<100K), צריכים פרשנות (Interpretability), או כ-Baseline מהיר. עובד מצוין על Linearly Separable data.

    **Neural Network** כשיש הרבה נתונים, תמונות/טקסט/אודיו (Unstructured data), קשרים לא-ליניאריים מורכבים, או כשביצועים קריטיים והפרשנות פחות חשובה.

    **כלל אצבע**: תמיד מתחילים ב-Logistic Regression כ-Baseline, ורק עוברים למורכב יותר אם צריך.

??? tip "מה זה AUC-ROC ולמה הוא עדיף על Accuracy?"
    **AUC-ROC** מודד את יכולת המודל להפריד בין קטגוריות **בכל ערכי ה-Threshold**, לא רק ב-0.5. ערך 1.0 = הפרדה מושלמת, 0.5 = ניחוש אקראי.

    AUC עדיף על Accuracy כי: (1) לא תלוי ב-Threshold ספציפי, (2) לא מוטה ב-Imbalanced data, (3) מודד את "הביטחון" של המודל ולא רק את התשובה הסופית.

??? tip "הסבירו Cross-Validation. למה עדיף על Split רגיל?"
    ב-**K-Fold Cross-Validation**, מחלקים ל-$K$ חלקים. בכל סיבוב, חלק אחר הוא Validation והשאר Train. מחשבים ממוצע של ה-Metric על כל $K$ הסיבובים.

    עדיף על Split רגיל כי: (1) כל דגימה משמשת גם ל-Train וגם ל-Validation, (2) מקבלים אומדן של **שונות** הביצועים (לא רק ממוצע), (3) פחות תלוי ב-Random Seed ספציפי, (4) חשוב במיוחד כשיש מעט נתונים.

??? tip "איך מתמודדים עם Imbalanced Dataset?"
    גישות עיקריות:

    1. **Data-level**: Oversampling (SMOTE), Undersampling, Data Augmentation
    2. **Algorithm-level**: Class Weights (נותנים משקל גבוה יותר למיעוט), Focal Loss
    3. **Threshold Tuning**: משנים את ה-Decision Threshold מ-0.5
    4. **Metrics**: משתמשים ב-F1, Precision-Recall AUC, ולא ב-Accuracy
    5. **Ensemble**: Balanced Random Forest, EasyEnsemble

    הגישה הנכונה תלויה ב-use case: בהונאות בנקאיות, עדיף Recall גבוה (לתפוס את כל ההונאות) גם במחיר Precision נמוך יותר.

??? tip "מה ההבדל בין Multi-class ל-Multi-label Classification?"
    **Multi-class**: כל דגימה שייכת ל-**קטגוריה אחת בלבד**. פלט: Softmax (הסתברויות שמסתכמות ל-1). Loss: Cross-Entropy. דוגמה: זיהוי ספרות (0-9).

    **Multi-label**: דגימה יכולה להשתייך ל-**מספר קטגוריות**. פלט: Sigmoid עצמאי לכל Label. Loss: Binary Cross-Entropy per label. דוגמה: תיוג תמונה (חוף AND שקיעה AND ים).

## קישורים לנושאים אחרים

- [וקטורים ומרחבים](vectors-and-spaces.md) -- Feature Vectors הם הקלט לכל Classifier
- [Loss & Softmax](loss-softmax.md) -- איך מודדים "כמה המודל טעה" ואיך ממירים ציונים להסתברויות
- [רשתות נוירונים](neural-networks.md) -- Classification עם Deep Learning
- [אלגוריתמים ב-ML](../01-algorithmics/algorithms-in-ml.md) -- Decision Trees, Random Forest, ואלגוריתמי סיווג נוספים
