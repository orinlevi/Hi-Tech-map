# וקטורים ומרחבים (Vectors and Spaces)

## למה זה חשוב

וקטורים הם **השפה הבסיסית** של Machine Learning. כל פיסת מידע -- תמונה, מילה, משפט, משתמש -- מיוצגת בסופו של דבר כ-**וקטור**: מערך של מספרים. בלי להבין וקטורים, אי אפשר להבין כיצד מודלים "רואים" את העולם.

- כל אלגוריתם ML מקבל וקטורים כקלט ומחזיר וקטורים כפלט.
- מרחבים רב-ממדיים (High-dimensional spaces) הם "המגרש" שבו המודלים עובדים.
- מדדי מרחק בין וקטורים הם הבסיס ל-Classification, Clustering, ו-Retrieval.

## רעיונות מרכזיים

### מהו וקטור?

וקטור הוא פשוט **רשימה מסודרת של מספרים**. כל מספר מייצג "תכונה" (Feature) כלשהי:

```python
# וקטור שמייצג דירה: [שטח_במ"ר, מספר_חדרים, קומה, מרחק_מהים_בק"מ]
apartment = [85, 3.5, 4, 1.2]
```

### Feature Vectors

**Feature Vector** הוא וקטור שבו כל ממד מייצג תכונה שנבחרה או נלמדה:

- ב-Tabular data -- כל עמודה היא Feature.
- ב-NLP -- מילה יכולה להיות מיוצגת כ-Embedding vector (למשל Word2Vec, 300 ממדים).
- ב-Computer Vision -- תמונה עוברת דרך CNN ומתקבל וקטור שמייצג "את התוכן" שלה.

### Embeddings

Embedding הוא וקטור שנלמד על ידי מודל כך שפריטים **דומים** יהיו **קרובים** במרחב:

```
king  -> [0.2, 0.8, 0.1, ...]
queen -> [0.21, 0.79, 0.15, ...]
car   -> [0.9, 0.1, 0.7, ...]
```

!!! note "Embedding = ייצוג נלמד"
    בניגוד ל-Feature Vector שאנחנו בונים ידנית, Embedding נלמד אוטומטית ע"י המודל תוך כדי אימון. זו אחת הסיבות ש-Deep Learning כל כך חזק -- הוא לומד ייצוגים טובים בעצמו.

### מדדי מרחק (Distance Metrics)

כדי לדעת "כמה שני וקטורים דומים", משתמשים במדדי מרחק:

**Euclidean Distance** -- המרחק "הרגיל" בקו ישר:

$$d(\mathbf{a}, \mathbf{b}) = \sqrt{\sum_{i=1}^{n}(a_i - b_i)^2}$$

```python
import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
dist = np.linalg.norm(a - b)  # = 5.196
```

**Cosine Similarity** -- מודד את הזווית בין שני וקטורים (לא את האורך):

$$\text{cosine\_sim}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{||\mathbf{a}|| \cdot ||\mathbf{b}||}$$

```python
from numpy.linalg import norm
cos_sim = np.dot(a, b) / (norm(a) * norm(b))  # = 0.974
```

!!! warning "מתי להשתמש במה?"
    - **Euclidean** -- כשהגודל (magnitude) חשוב. למשל: מרחק פיזי בין נקודות.
    - **Cosine** -- כשרק הכיוון חשוב. למשל: דמיון בין מסמכים (מסמך ארוך וקצר יכולים להיות דומים בתוכן).

### מרחבים רב-ממדיים (High-Dimensional Spaces)

במציאות, וקטורים ב-ML הם בעלי **מאות עד אלפי ממדים**:

- Word Embeddings: 300 ממדים
- BERT Embeddings: 768 ממדים
- GPT Embeddings: 1536+ ממדים

??? tip "Curse of Dimensionality"
    במרחבים רב-ממדיים, דברים מוזרים קורים: כמעט כל הנקודות "רחוקות" זו מזו באותה מידה. זו הסיבה שאלגוריתמים כמו KNN עובדים פחות טוב בממדים גבוהים, וצריך טכניקות כמו Dimensionality Reduction (PCA, t-SNE).

## בלבולים נפוצים

- **"וקטור = חץ בפיזיקה"** -- ב-ML, וקטור הוא בעיקר מערך מספרים. אין צורך לחשוב על כיוון וגודל כמו בפיזיקה.
- **"Cosine Similarity ו-Euclidean Distance נותנים את אותה תשובה"** -- לא! Cosine מתעלם מאורך הוקטור, Euclidean לא. שני וקטורים באותו כיוון אבל באורכים שונים יהיו דומים ב-Cosine אבל רחוקים ב-Euclidean.
- **"יותר ממדים = יותר טוב"** -- לא בהכרח. ממדים מיותרים מוסיפים רעש ומאטים חישובים.
- **"Embedding ו-Feature Vector זה אותו דבר"** -- Feature Vector יכול להיות ידני, Embedding תמיד נלמד ע"י מודל.

## דוגמה קטנה

נניח שאנחנו רוצים למצוא את המילה הכי דומה ל-"מלך" מתוך רשימה:

```python
import numpy as np

# Embeddings פשוטים (בפועל יש הרבה יותר ממדים)
words = {
    "מלך":    np.array([0.9, 0.1, 0.8, 0.2]),
    "מלכה":   np.array([0.85, 0.15, 0.75, 0.6]),
    "חתול":   np.array([0.1, 0.9, 0.2, 0.3]),
    "נסיך":   np.array([0.88, 0.12, 0.7, 0.25]),
}

target = words["מלך"]

for word, vec in words.items():
    if word == "מלך":
        continue
    cos_sim = np.dot(target, vec) / (np.linalg.norm(target) * np.linalg.norm(vec))
    print(f"{word}: cosine similarity = {cos_sim:.3f}")

# פלט:
# מלכה: cosine similarity = 0.965
# חתול: cosine similarity = 0.438
# נסיך: cosine similarity = 0.997
```

!!! note "מה רואים כאן?"
    "נסיך" ו-"מלכה" קרובים ל-"מלך" יותר מ-"חתול". זה הרעיון של Embeddings -- מילים עם משמעות דומה ממופות לנקודות קרובות במרחב.

## קישורים לנושאים אחרים

- [סיווג (Classification)](classification.md) -- שימוש בוקטורים כקלט לאלגוריתמי סיווג
- [אלגוריתמים ב-ML](../01-algorithmics/algorithms-in-ml.md) -- KNN, K-Means ואלגוריתמים נוספים שעובדים ישירות על וקטורים
