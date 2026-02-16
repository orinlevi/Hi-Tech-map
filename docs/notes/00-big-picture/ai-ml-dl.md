# AI, ML & DL

## Why it matters

שלושת המושגים האלה -- **Artificial Intelligence**, **Machine Learning** ו-**Deep Learning** -- הם הבסיס לכמעט כל דיון טכנולוגי מודרני. בלי להבין את היחס ביניהם, קשה לקרוא מאמרים, להבין Job Descriptions, או לדעת איזה כלי מתאים לאיזו בעיה.

!!! note "נקודת מוצא"
    לפני שצוללים לנוסחאות ולארכיטקטורות -- חשוב להבין את **התמונה הגדולה**: מה כל שכבה עושה, ואיפה כל אחת מתאימה.

---

## Core ideas

### היחס בין השכבות: AI > ML > DL

דמיינו שלוש עיגולים מקוננים:

```
┌─────────────────────────────────────────┐
│  AI  (Artificial Intelligence)          │
│  כל מערכת שמדמה "חשיבה" או קבלת החלטות │
│                                         │
│   ┌──────────────────────────────────┐  │
│   │  ML  (Machine Learning)          │  │
│   │  לומד מדוגמאות במקום כללים קשיחים│  │
│   │                                  │  │
│   │   ┌───────────────────────────┐  │  │
│   │   │  DL  (Deep Learning)      │  │  │
│   │   │  רשתות נוירונים עמוקות    │  │  │
│   │   └───────────────────────────┘  │  │
│   └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- **AI** -- המטרייה הכי רחבה. כולל גם מערכות מבוססות כללים (Rule-based), עצי החלטה, וכל דבר ש"מתנהג בצורה חכמה".
- **ML** -- תת-תחום של AI. במקום לכתוב כללים ידנית, המערכת **לומדת דפוסים מתוך Data**.
- **DL** -- תת-תחום של ML. משתמש ב-**Neural Networks** עם הרבה שכבות (layers) כדי ללמוד ייצוגים מורכבים.

### שלושת סוגי הלמידה

| סוג | מה קורה | דוגמה |
|-----|----------|-------|
| **Supervised Learning** | המודל מקבל Data + Labels (תשובות נכונות) ולומד לחזות | זיהוי אם תמונה היא חתול או כלב |
| **Unsupervised Learning** | המודל מקבל Data בלי Labels ומחפש מבנים | חלוקת לקוחות לקבוצות (Clustering) |
| **Reinforcement Learning** | המודל מקבל Reward/Penalty על פעולות ולומד אסטרטגיה | רובוט שלומד ללכת, אלגוריתם שמשחק שחמט |

### Classic ML מול Deep Learning

| | Classic ML | Deep Learning |
|---|-----------|---------------|
| **אלגוריתמים** | Linear Regression, SVM, Random Forest, KNN | CNN, RNN, Transformer |
| **Data נדרש** | מאות-אלפים של דוגמאות | אלפים עד מיליונים |
| **Feature Engineering** | ידני -- המהנדס בוחר Features | אוטומטי -- הרשת לומדת Features |
| **חומרה** | CPU מספיק | לרוב נדרש GPU / TPU |
| **Interpretability** | לרוב קל להסביר | לרוב "קופסה שחורה" |

??? tip "מתי בוחרים Classic ML?"
    - כשיש **מעט Data** (מאות דוגמאות).
    - כשצריך **הסבר ברור** למה המודל החליט מה שהחליט (לדוגמה: אישור אשראי).
    - כש-**Tabular Data** (טבלאות) הוא סוג ה-Data העיקרי -- Classic ML עדיין מנצח שם לעיתים קרובות.

### איפה כל גישה משמשת בתעשייה

- **Classic ML**: זיהוי הונאות בנקאיות, חיזוי Churn של לקוחות, מערכות המלצה פשוטות, ניתוח סיכונים.
- **Deep Learning -- Computer Vision**: זיהוי פנים, מכוניות אוטונומיות, בדיקת איכות במפעלים.
- **Deep Learning -- NLP**: ChatGPT, תרגום אוטומטי, סיכום טקסטים, Chatbots.
- **Deep Learning -- Audio**: זיהוי דיבור (Speech-to-Text), יצירת מוזיקה, זיהוי רגשות מקול.
- **Reinforcement Learning**: משחקים (AlphaGo), רובוטיקה, אופטימיזציה של שרשרת אספקה.

---

## Common confusions

!!! warning "AI זה לא רק ChatGPT"
    הרבה אנשים שומעים "AI" וחושבים ישר על ChatGPT או על רובוטים. בפועל, AI כולל **טווח עצום** של טכנולוגיות -- מאלגוריתם פשוט שממיין Spam ב-Email, דרך מערכת המלצות ב-Netflix, ועד מודלים גנרטיביים כמו GPT ו-Diffusion Models.

!!! warning "ML ו-DL הם לא אותו דבר"
    Deep Learning הוא **סוג אחד** של Machine Learning, לא שם אחר לאותו דבר. יש הרבה אלגוריתמי ML שהם **לא** Deep Learning (כמו Decision Trees ו-SVM), והם עדיין רלוונטיים מאוד.

!!! warning "יותר Data לא תמיד אומר תוצאות טובות יותר"
    Data צריך להיות **איכותי** ו-**מייצג**. מיליון דוגמאות עם Labels שגויים יניבו מודל גרוע. Quality > Quantity.

---

## Tiny example

דמיינו שאתם בונים מערכת שמזהה האם Review של מוצר הוא **חיובי** או **שלילי**:

=== "גישת Classic ML"

    ```python
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression

    # שלב 1: הפיכת טקסט למספרים (Feature Engineering ידני)
    vectorizer = TfidfVectorizer(max_features=1000)
    X_train = vectorizer.fit_transform(reviews_text)

    # שלב 2: אימון מודל
    model = LogisticRegression()
    model.fit(X_train, labels)  # labels = [positive, negative, ...]

    # שלב 3: חיזוי
    new_review = vectorizer.transform(["המוצר מעולה, ממליץ בחום!"])
    print(model.predict(new_review))  # -> "positive"
    ```

=== "גישת Deep Learning"

    ```python
    from transformers import pipeline

    # המודל כבר למד Features בעצמו מתוך מיליוני דוגמאות
    classifier = pipeline("sentiment-analysis")

    result = classifier("המוצר מעולה, ממליץ בחום!")
    print(result)  # -> [{'label': 'POSITIVE', 'score': 0.98}]
    ```

??? tip "שימו לב להבדל"
    ב-Classic ML -- אנחנו מגדירים איך להפוך טקסט למספרים (`TfidfVectorizer`).
    ב-Deep Learning -- המודל כבר עשה את זה בעצמו במהלך ה-Training על Data ענק.

---

## Links to other notes

- [מפת תפקידים (Roles Map)](./roles-map.md) -- מי עובד עם AI/ML בפועל?
- [פרודקשן (Production)](./production.md) -- איך מודל ML מגיע למשתמשים אמיתיים?
- [רשתות נוירונים (Neural Networks)](../02-ml-core/neural-networks.md) -- צלילה עמוקה לתוך DL
