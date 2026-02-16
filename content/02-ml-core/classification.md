# סיווג (Classification)

## למה זה חשוב

Classification הוא אחת המשימות **הנפוצות ביותר** ב-Machine Learning. בכל פעם שמודל צריך "להחליט" לאיזו קטגוריה שייך קלט מסוים -- זה Classification:

- האם המייל הזה ספאם או לא? (Binary Classification)
- איזו ספרה מופיעה בתמונה? 0-9 (Multi-class Classification)
- איזה סוג רגש יש בטקסט? שמחה / עצב / כעס / ... (Multi-class)

הבנה של Classification היא **בסיס הכרחי** להבנת כל מה שבא אחר כך -- מ-Neural Networks ועד LLMs.

## רעיונות מרכזיים

### מהו Classification?

Classification = **שיוך של קלט ל-Label (תווית)**. המודל מקבל Feature Vector ומחזיר חיזוי לאיזו קבוצה הוא שייך.

```
Input: [שטח=85, חדרים=3.5, קומה=4] --> Model --> Output: "דירה יקרה"
```

### Binary vs Multi-class

| סוג | מספר קטגוריות | דוגמה |
|------|--------------|--------|
| **Binary** | 2 | ספאם / לא ספאם |
| **Multi-class** | 3+ | חתול / כלב / ציפור |
| **Multi-label** | מספר תוויות לכל דגימה | תמונה שהיא גם "חוף" וגם "שקיעה" |

### אלגוריתמים קלאסיים (בקצרה)

**Logistic Regression** -- למרות השם, זה אלגוריתם Classification:

```python
# הרעיון: מכפילים Features במשקולות, מעבירים דרך Sigmoid
z = w1*x1 + w2*x2 + ... + b
probability = 1 / (1 + exp(-z))  # Sigmoid: ממפה ל-[0,1]
```

!!! note "למה קוראים לזה Regression?"
    כי ההיסטוריה. המודל מבצע Regression על ה-log-odds, ואז ממיר להסתברות. בפועל -- זה Classifier.

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

**SVM (Support Vector Machine)** -- מוצא את ה-Hyperplane שמפריד הכי טוב בין הקטגוריות, עם Margin מקסימלי.

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

### Metrics -- מדדי הצלחה

**Accuracy** -- אחוז התחזיות הנכונות:

$$\text{Accuracy} = \frac{\text{Correct Predictions}}{\text{Total Predictions}}$$

??? tip "Accuracy לא תמיד מספיק!"
    אם 99% מהמיילים הם לא ספאם, מודל שתמיד אומר "לא ספאם" יקבל Accuracy של 99% -- אבל הוא חסר ערך. זו בעיית **Imbalanced Classes**.

**Precision** -- מתוך מה שהמודל אמר "חיובי", כמה באמת חיובי?

$$\text{Precision} = \frac{TP}{TP + FP}$$

**Recall** -- מתוך כל החיוביים האמיתיים, כמה המודל מצא?

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

## בלבולים נפוצים

- **"Accuracy גבוה = מודל טוב"** -- לא בהכרח! ב-Imbalanced datasets, Accuracy מטעה. תמיד צריך לבדוק גם Precision, Recall, F1.
- **"Logistic Regression זה Regression"** -- לא. זה Classifier שמשתמש בפונקציית Sigmoid כדי להחזיר הסתברויות.
- **"צריך תמיד את המודל הכי מורכב"** -- לא. Logistic Regression פשוט, מהיר, ולפעמים עובד לא פחות טוב מ-Deep Learning (במיוחד על Tabular data).
- **"Validation = Test"** -- ממש לא! Validation משמש לכוונון במהלך הפיתוח. Test הוא הערכה סופית.

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

## קישורים לנושאים אחרים

- [וקטורים ומרחבים](vectors-and-spaces.md) -- Feature Vectors הם הקלט לכל Classifier
- [Loss & Softmax](loss-softmax.md) -- איך מודדים "כמה המודל טעה" ואיך ממירים ציונים להסתברויות
- [רשתות נוירונים](neural-networks.md) -- Classification עם Deep Learning
