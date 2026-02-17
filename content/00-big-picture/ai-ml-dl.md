# AI, ML & DL

## Why it matters

שלושת המושגים האלה -- **Artificial Intelligence**, **Machine Learning** ו-**Deep Learning** -- הם הבסיס לכמעט כל דיון טכנולוגי מודרני. בלי להבין את היחס ביניהם, קשה לקרוא מאמרים, להבין Job Descriptions, או לדעת איזה כלי מתאים לאיזו בעיה.

כל חברה היום -- מ-Startup קטן ועד ענקיות כמו Google ו-Amazon -- משתמשת בטכנולוגיות שנמצאות על הספקטרום הזה. גם אם אתם לא הולכים להיות ML Engineers, הבנה בסיסית של התחום היא כמו הבנה בסיסית באנגלית בעולם ההייטק: אפשר בלי זה, אבל קשה.

!!! note "נקודת מוצא"
    לפני שצוללים לנוסחאות ולארכיטקטורות -- חשוב להבין את **התמונה הגדולה**: מה כל שכבה עושה, ואיפה כל אחת מתאימה.

!!! note "הערת שוליים לא רשמית"
    בכנסים טכנולוגיים, כל אחד אומר "אנחנו משתמשים ב-AI". תשאלו אותם מה בדיוק הם עושים -- ב-80% מהמקרים זה `if-else` עם Marketing טוב.

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

### Narrow AI מול General AI

חשוב להבין שכמעט כל מה שקיים היום הוא **Narrow AI** (בינה מלאכותית צרה):

| סוג | הסבר | סטטוס |
|-----|-------|-------|
| **Narrow AI (ANI)** | מערכת שמצטיינת במשימה אחת ספציפית -- זיהוי תמונות, תרגום, המלצות | קיים היום |
| **General AI (AGI)** | מערכת שיכולה ללמוד ולבצע **כל** משימה אינטלקטואלית כמו אדם | עדיין לא קיים |
| **Super AI (ASI)** | מערכת שעולה על היכולות האנושיות בכל תחום | מדע בדיוני (בינתיים) |

ChatGPT, למרות שהוא מרשים, הוא עדיין Narrow AI -- הוא מצטיין ביצירת טקסט, אבל אין לו הבנה אמיתית של העולם, ולא יכול ללכת לקנות לכם חלב.

!!! note "הערת שוליים לא רשמית"
    כשמישהו בראיון עבודה שואל "מתי תגיע AGI?" -- התשובה הבטוחה היא "תלוי את מי שואלים". Ray Kurzweil אומר 2029, אחרים אומרים "אולי אף פעם". אף אחד באמת לא יודע, אבל כולם בטוחים בתשובה שלהם.

### שלושת סוגי הלמידה

| סוג | מה קורה | דוגמה |
|-----|----------|-------|
| **Supervised Learning** | המודל מקבל Data + Labels (תשובות נכונות) ולומד לחזות | זיהוי אם תמונה היא חתול או כלב |
| **Unsupervised Learning** | המודל מקבל Data בלי Labels ומחפש מבנים | חלוקת לקוחות לקבוצות (Clustering) |
| **Reinforcement Learning** | המודל מקבל Reward/Penalty על פעולות ולומד אסטרטגיה | רובוט שלומד ללכת, אלגוריתם שמשחק שחמט |

**Supervised Learning** הוא הסוג הנפוץ ביותר בתעשייה. רוב הבעיות העסקיות נופלות לפה: חיזוי מחירים, סיווג תמונות, זיהוי Spam. המפתח הוא שיש לנו **Data מתויג** -- כלומר, מישהו (בדרך כלל צוות של אנשים או מערכת אוטומטית) סימן עבורנו מה התשובה הנכונה.

**Unsupervised Learning** שימושי כשאין לנו Labels. לדוגמה: יש לנו מיליון לקוחות, ואנחנו רוצים לגלות אם יש קבוצות טבעיות ביניהם -- בלי שאמרנו מראש מה הקבוצות. אלגוריתמים כמו K-Means ו-DBSCAN עושים בדיוק את זה.

**Reinforcement Learning** הוא הסוג ה"מגניב" ביותר (ברמה תיאורטית) אבל גם הכי קשה ליישום בפרודקשן. הוא מצוין למשחקים ורובוטיקה, אבל בעולם העסקי -- הוא פחות נפוץ כי דורש סביבת סימולציה ואינטראקציה מתמשכת.

??? tip "ויש גם Semi-Supervised ו-Self-Supervised"
    בעולם האמיתי, לתייג Data עולה הרבה כסף. לכן התפתחו גישות ביניים:

    - **Semi-Supervised Learning** -- כמות קטנה של Data מתויג + כמות גדולה של Data לא מתויג. המודל משתמש בשניהם.
    - **Self-Supervised Learning** -- המודל יוצר "Labels" בעצמו מתוך ה-Data. כך GPT למד: הוא ניחש את המילה הבאה בטקסט, ו"התשובה הנכונה" הייתה פשוט המילה שבאמת באה אחרי.

### Classic ML מול Deep Learning

| | Classic ML | Deep Learning |
|---|-----------|---------------|
| **אלגוריתמים** | Linear Regression, SVM, Random Forest, KNN | CNN, RNN, Transformer |
| **Data נדרש** | מאות-אלפים של דוגמאות | אלפים עד מיליונים |
| **Feature Engineering** | ידני -- המהנדס בוחר Features | אוטומטי -- הרשת לומדת Features |
| **חומרה** | CPU מספיק | לרוב נדרש GPU / TPU |
| **Interpretability** | לרוב קל להסביר | לרוב "קופסה שחורה" |
| **זמן אימון** | שניות עד דקות | שעות עד שבועות |
| **עלות** | נמוכה יחסית | גבוהה (חומרה + חשמל) |

??? tip "מתי בוחרים Classic ML?"
    - כשיש **מעט Data** (מאות דוגמאות).
    - כשצריך **הסבר ברור** למה המודל החליט מה שהחליט (לדוגמה: אישור אשראי).
    - כש-**Tabular Data** (טבלאות) הוא סוג ה-Data העיקרי -- Classic ML עדיין מנצח שם לעיתים קרובות.

??? tip "מתי בוחרים Deep Learning?"
    - כשיש **הרבה Data** (מאות אלפים+ דוגמאות).
    - כשה-Data הוא **לא-מובנה** -- תמונות, טקסט, אודיו, וידאו.
    - כשה-Feature Engineering ידני הוא **מורכב מדי** או שהמומחיות לא זמינה.
    - כשהביצועים חשובים יותר מ-**Interpretability**.

### אלגוריתמי Classic ML מרכזיים -- מבט מהיר

| אלגוריתם | סוג | שימוש נפוץ |
|-----------|------|------------|
| **Linear Regression** | Supervised (Regression) | חיזוי מחירים, מכירות, טמפרטורה |
| **Logistic Regression** | Supervised (Classification) | Spam detection, חיזוי Churn |
| **Decision Tree** | Supervised | סיווג, הסבר החלטות |
| **Random Forest** | Supervised (Ensemble) | כמעט כל בעיה -- "הברירת המחדל" |
| **SVM** | Supervised | סיווג טקסטים, תמונות קטנות |
| **K-Means** | Unsupervised (Clustering) | סגמנטציית לקוחות |
| **XGBoost / LightGBM** | Supervised (Ensemble) | מנצחים תחרויות Kaggle |

!!! note "הערת שוליים לא רשמית"
    XGBoost הוא כמו הקרש הצף של ליאונרדו דיקפריו ב-Titanic: מלא אנשים ניצלו הודות לו ב-Kaggle, אבל הוא לא פותר הכל.

### ארכיטקטורות DL מרכזיות -- מבט מהיר

| ארכיטקטורה | שימוש עיקרי | דוגמאות |
|------------|-------------|---------|
| **CNN (Convolutional Neural Network)** | Computer Vision | זיהוי תמונות, רכב אוטונומי |
| **RNN / LSTM** | סדרות זמניות, טקסט | חיזוי מניות, תרגום (לפני Transformers) |
| **Transformer** | NLP, ועכשיו גם Vision | GPT, BERT, ViT |
| **GAN (Generative Adversarial Network)** | יצירת תוכן | Deepfakes, יצירת תמונות |
| **Diffusion Models** | יצירת תוכן | Stable Diffusion, DALL-E |
| **Autoencoder / VAE** | דחיסה, Anomaly Detection | זיהוי חריגות, Denoising |

### איפה כל גישה משמשת בתעשייה

- **Classic ML**: זיהוי הונאות בנקאיות, חיזוי Churn של לקוחות, מערכות המלצה פשוטות, ניתוח סיכונים.
- **Deep Learning -- Computer Vision**: זיהוי פנים, מכוניות אוטונומיות, בדיקת איכות במפעלים.
- **Deep Learning -- NLP**: ChatGPT, תרגום אוטומטי, סיכום טקסטים, Chatbots.
- **Deep Learning -- Audio**: זיהוי דיבור (Speech-to-Text), יצירת מוזיקה, זיהוי רגשות מקול.
- **Reinforcement Learning**: משחקים (AlphaGo), רובוטיקה, אופטימיזציה של שרשרת אספקה.

### The ML Workflow -- מ-Data גולמי למודל בפרודקשן

הנה הזרימה הטיפוסית של פרויקט ML מקצה לקצה:

```
  הגדרת הבעיה העסקית
       │
       ▼
  איסוף Data  ──────────▶  ניקוי ועיבוד Data
                                  │
                                  ▼
                           Feature Engineering
                           (בחירת/יצירת Features)
                                  │
                                  ▼
                           בחירת מודל + אימון
                                  │
                                  ▼
                           הערכה (Evaluation)
                           ├── Accuracy, Precision, Recall
                           └── Cross-validation
                                  │
                              טוב מספיק?
                              /        \
                           לא            כן
                            │             │
                            ▼             ▼
                     חזרה לשלב      Deploy ל-Production
                     קודם           (ראו: production.md)
```

!!! note "הערת שוליים לא רשמית"
    בפועל, 80% מהזמן של Data Scientist הולך על ניקוי Data. את ה-20% הנותרים הוא מבזבז על לנסות להסביר ל-PM למה צריך עוד Data נקי.

---

## Common confusions

!!! warning "AI זה לא רק ChatGPT"
    הרבה אנשים שומעים "AI" וחושבים ישר על ChatGPT או על רובוטים. בפועל, AI כולל **טווח עצום** של טכנולוגיות -- מאלגוריתם פשוט שממיין Spam ב-Email, דרך מערכת המלצות ב-Netflix, ועד מודלים גנרטיביים כמו GPT ו-Diffusion Models.

!!! warning "ML ו-DL הם לא אותו דבר"
    Deep Learning הוא **סוג אחד** של Machine Learning, לא שם אחר לאותו דבר. יש הרבה אלגוריתמי ML שהם **לא** Deep Learning (כמו Decision Trees ו-SVM), והם עדיין רלוונטיים מאוד.

!!! warning "יותר Data לא תמיד אומר תוצאות טובות יותר"
    Data צריך להיות **איכותי** ו-**מייצג**. מיליון דוגמאות עם Labels שגויים יניבו מודל גרוע. Quality > Quantity.

!!! warning "Overfitting -- הטעות הנפוצה ביותר"
    Overfitting קורה כשהמודל "שינן" את ה-Training Data במקום ללמוד את הדפוסים האמיתיים. זה כמו תלמיד שמשנן תשובות לבחינה אבל לא מבין את החומר -- ברגע שהשאלה משתנה קצת, הוא נכשל. הפתרון: Regularization, Cross-validation, ויותר Data מגוון.

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

### דוגמה נוספת: חיזוי מחיר דירה

=== "Classic ML -- Linear Regression"

    ```python
    from sklearn.linear_model import LinearRegression
    import numpy as np

    # Features: שטח (מ"ר), מספר חדרים, קומה, מרחק ממרכז
    X_train = np.array([
        [80, 3, 2, 5],   # דירה 1
        [120, 4, 5, 3],  # דירה 2
        [60, 2, 1, 10],  # דירה 3
        # ... עוד דוגמאות
    ])
    y_train = np.array([1_500_000, 2_800_000, 900_000])

    model = LinearRegression()
    model.fit(X_train, y_train)

    # חיזוי מחיר לדירה חדשה
    new_apartment = np.array([[100, 3, 4, 4]])
    print(f"מחיר משוער: {model.predict(new_apartment)[0]:,.0f} ש\"ח")
    ```

=== "Deep Learning -- Neural Network"

    ```python
    import torch
    import torch.nn as nn

    class PricePredictor(nn.Module):
        def __init__(self):
            super().__init__()
            self.network = nn.Sequential(
                nn.Linear(4, 64),
                nn.ReLU(),
                nn.Linear(64, 32),
                nn.ReLU(),
                nn.Linear(32, 1)
            )

        def forward(self, x):
            return self.network(x)

    # לדירות -- Classic ML בדרך כלל עדיף!
    # DL מוגזם כאן, אבל ככה זה נראה...
    ```

!!! note "הערת שוליים לא רשמית"
    לחיזוי מחירי דירות בישראל, אפילו המודל הכי מתקדם בעולם לא יצליח לחזות שהמחיר יקפוץ ב-30% כי מישהו בממשלה הכריז על תוכנית חדשה. כמה דברים נשארים בגדר "אינטליגנציה אנושית".

---

## 🛤️ מאיפה מתחילים

מסלול למידה מומלץ מאפס ועד הבנה מעשית:

**שלב 1: בסיס מתמטי (2-3 שבועות)**

1. סטטיסטיקה בסיסית -- Mean, Median, Standard Deviation, Distributions
2. אלגברה לינארית -- Vectors, Matrices, Dot Product (לא צריך להיות מתמטיקאי, צריך להבין את הרעיון)
3. Calculus בסיסי -- Derivatives, Gradient (בשביל להבין איך מודל לומד)
4. משאב מומלץ: הקורס **3Blue1Brown** ב-YouTube (חינמי, ויזואלי ומעולה)

**שלב 2: Python + Data Basics (3-4 שבועות)**

1. Python בסיסי -- loops, functions, classes
2. NumPy -- עבודה עם מערכים
3. Pandas -- עבודה עם טבלאות Data
4. Matplotlib / Seaborn -- ויזואליזציה
5. משאב מומלץ: **Kaggle Learn** (חינמי, אינטראקטיבי)

**שלב 3: Machine Learning קלאסי (4-6 שבועות)**

1. קורס **Andrew Ng -- Machine Learning** ב-Coursera
2. תרגול ב-Kaggle: להתחיל עם Titanic ו-House Prices
3. ספריית Scikit-learn -- ללמוד דרך הדוקומנטציה המעולה שלה

**שלב 4: Deep Learning (4-8 שבועות)**

1. קורס **fast.ai** (חינמי, Top-Down approach -- מריצים קוד מהיום הראשון)
2. PyTorch basics -- Tensors, Autograd, nn.Module
3. לבנות פרויקט אחד מ-0: Image Classifier או Text Classifier

**שלב 5: התמחות (בהתאם לכיוון)**

1. **NLP** -- Hugging Face Transformers, Course של Hugging Face
2. **Computer Vision** -- קורס CS231n של Stanford (חינמי ב-YouTube)
3. **MLOps** -- MLflow, Docker, ו-[Production](./production.md)

??? tip "טיפ זהב: לא צריך לעשות הכל לפני שמתחילים לבנות"
    הגישה הכי אפקטיבית היא **"learn by doing"**. אחרי שלב 2, כבר אפשר להתחיל להשתתף בתחרויות Kaggle ולבנות פרויקטים קטנים. המתמטיקה תיכנס בהדרגה.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין AI, ML ו-DL?"
    **AI** היא המטרייה הרחבה ביותר -- כל מערכת שמדמה התנהגות אינטליגנטית. **ML** הוא תת-תחום של AI שבו מערכות לומדות מ-Data במקום מכללים מוגדרים מראש. **DL** הוא תת-תחום של ML שמשתמש ברשתות נוירונים עם שכבות רבות. היחס: AI ⊃ ML ⊃ DL.

??? tip "מה ההבדל בין Supervised ל-Unsupervised Learning?"
    ב-**Supervised Learning** המודל מקבל Data עם Labels (תשובות נכונות) ולומד לחזות Labels עבור Data חדש. ב-**Unsupervised Learning** אין Labels -- המודל מחפש מבנים ודפוסים ב-Data בעצמו (כמו Clustering). דוגמה: Supervised = זיהוי Spam (יש Label: spam/not spam). Unsupervised = חלוקת לקוחות לקבוצות (אין Labels מוגדרים מראש).

??? tip "מתי תבחרו Classic ML על פני Deep Learning?"
    כשיש **מעט Data** (מאות-אלפים של דוגמאות), כשצריך **Interpretability** (הסבר למה המודל החליט מה שהחליט), כשה-Data הוא **Tabular** (טבלאות), וכשיש **מגבלות חומרה או תקציב**. Classic ML גם מהיר יותר לאמן ול-Deploy.

??? tip "מה זה Overfitting ואיך מונעים אותו?"
    Overfitting קורה כשהמודל "שינן" את ה-Training Data ולא מצליח ל-Generalize ל-Data חדש. סימפטום: ביצועים מעולים על Training, ביצועים גרועים על Test. פתרונות: **Regularization** (L1/L2), **Dropout** (ב-DL), **Cross-validation**, הגדלת ה-Training Data, **Early Stopping**, ופישוט המודל.

??? tip "הסבירו מה זה Bias-Variance Tradeoff"
    **Bias** הוא שגיאה שנגרמת כי המודל פשוט מדי (Underfitting) -- הוא "מפספס" דפוסים ב-Data. **Variance** הוא שגיאה שנגרמת כי המודל מורכב מדי (Overfitting) -- הוא רגיש לרעש ב-Data. ה-Tradeoff: מודל פשוט = High Bias, Low Variance. מודל מורכב = Low Bias, High Variance. המטרה היא למצוא את **נקודת האיזון**.

??? tip "מה זה Transfer Learning ולמה הוא חשוב?"
    Transfer Learning הוא שימוש במודל שכבר אומן על משימה אחת (בדרך כלל על Data ענק) כבסיס למשימה חדשה. במקום לאמן מודל מאפס, לוקחים מודל Pre-trained ועושים **Fine-tuning** על ה-Data שלנו. זה חוסך זמן, Data, וכסף. דוגמאות: BERT לבעיות NLP, ResNet לבעיות Computer Vision, GPT כ-Foundation Model.

??? tip "מה ההבדל בין Precision ל-Recall?"
    **Precision** = מתוך כל מה שהמודל חזה כ-Positive, כמה באמת Positive? **Recall** = מתוך כל ה-Positives האמיתיים, כמה המודל מצא? דוגמה: אם המודל מזהה Spam -- Precision גבוה = מעט False Positives (מיילים לגיטימיים שסומנו כ-Spam). Recall גבוה = מעט False Negatives (Spam שלא זוהה). לרוב יש Tradeoff ביניהם, ו-**F1 Score** הוא הממוצע ההרמוני של שניהם.

??? tip "מה זה Feature Engineering ולמה הוא חשוב?"
    Feature Engineering הוא תהליך היצירה, הבחירה, וההמרה של משתנים (Features) מה-Data הגולמי לפורמט שהמודל יכול ללמוד ממנו. דוגמה: מתוך תאריך אפשר ליצור Features כמו יום בשבוע, חודש, האם זה חג. ב-Classic ML זה **קריטי** וידני. ב-Deep Learning הרשת לומדת Features באופן אוטומטי, אבל Feature Engineering טוב עדיין יכול לשפר ביצועים.

---

## Links to other notes

- [מפת תפקידים (Roles Map)](./roles-map.md) -- מי עובד עם AI/ML בפועל?
- [פרודקשן (Production)](./production.md) -- איך מודל ML מגיע למשתמשים אמיתיים?
- [רשתות נוירונים (Neural Networks)](../02-ml-core/neural-networks.md) -- צלילה עמוקה לתוך DL
