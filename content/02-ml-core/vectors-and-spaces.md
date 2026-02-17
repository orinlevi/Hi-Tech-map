# וקטורים ומרחבים (Vectors and Spaces)

## למה זה חשוב

וקטורים הם **השפה הבסיסית** של Machine Learning. כל פיסת מידע -- תמונה, מילה, משפט, משתמש -- מיוצגת בסופו של דבר כ-**וקטור**: מערך של מספרים. בלי להבין וקטורים, אי אפשר להבין כיצד מודלים "רואים" את העולם.

- כל אלגוריתם ML מקבל וקטורים כקלט ומחזיר וקטורים כפלט.
- מרחבים רב-ממדיים (High-dimensional spaces) הם "המגרש" שבו המודלים עובדים.
- מדדי מרחק בין וקטורים הם הבסיס ל-Classification, Clustering, ו-Retrieval.

!!! quote "בכל מקום שתסתכלו ב-ML -- תמצאו וקטור"
    אם אתם לא מרגישים בנוח עם וקטורים, אתם כנראה לא מרגישים בנוח עם ML. החדשות הטובות: זה לא רקטות. זה מערך של מספרים. הרקטות מתחילות מ-Tensors.

## רעיונות מרכזיים

### מהו וקטור?

וקטור הוא פשוט **רשימה מסודרת של מספרים**. כל מספר מייצג "תכונה" (Feature) כלשהי:

```python
# וקטור שמייצג דירה: [שטח_במ"ר, מספר_חדרים, קומה, מרחק_מהים_בק"מ]
apartment = [85, 3.5, 4, 1.2]
```

מתמטית, וקטור ב-$\mathbb{R}^n$ הוא איבר במרחב $n$-ממדי:

$$\mathbf{v} = \begin{pmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{pmatrix} \in \mathbb{R}^n$$

כל ממד (dimension) מייצג ציר אחד במרחב. וקטור בעל $n$ ממדים הוא נקודה (או חץ) במרחב $n$-ממדי.

### פעולות בסיסיות על וקטורים

**חיבור וקטורים** -- חיבור רכיב-רכיב:

$$\mathbf{a} + \mathbf{b} = \begin{pmatrix} a_1 + b_1 \\ a_2 + b_2 \\ \vdots \\ a_n + b_n \end{pmatrix}$$

**כפל בסקלר** -- כפל כל רכיב במספר:

$$c \cdot \mathbf{a} = \begin{pmatrix} c \cdot a_1 \\ c \cdot a_2 \\ \vdots \\ c \cdot a_n \end{pmatrix}$$

**מכפלה סקלרית (Dot Product)** -- סכום מכפלות הרכיבים:

$$\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^{n} a_i \cdot b_i = a_1 b_1 + a_2 b_2 + \ldots + a_n b_n$$

!!! info "למה Dot Product כל כך חשוב?"
    Dot Product הוא **לב לבו** של ML. כל שכבה ב-Neural Network, כל חישוב Attention, כל Linear Regression -- הכל מתחיל ב-Dot Product. כשאתם שומעים "כפל מטריצות" (matrix multiplication), זה בעצם הרבה Dot Products במקביל.

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# חיבור
print(a + b)            # [5, 7, 9]

# כפל בסקלר
print(2 * a)            # [2, 4, 6]

# Dot product
print(np.dot(a, b))     # 1*4 + 2*5 + 3*6 = 32

# נורמה (אורך)
print(np.linalg.norm(a))  # sqrt(1+4+9) = 3.742
```

**נורמה (Norm)** -- "אורך" הוקטור:

$$||\mathbf{a}||_2 = \sqrt{\sum_{i=1}^{n} a_i^2}$$

זו ה-L2 Norm (Euclidean Norm). קיימות גם נורמות אחרות:

- $||\mathbf{a}||_1 = \sum |a_i|$ -- L1 Norm (Manhattan Distance)
- $||\mathbf{a}||_\infty = \max |a_i|$ -- Infinity Norm

??? tip "L1 vs L2 Regularization -- הקשר לנורמות"
    ב-ML, Regularization מגבילה את "הגודל" של ה-Weights:

    - **L1 Regularization (Lasso)** -- מוסיפה $\lambda ||\mathbf{w}||_1$ ל-Loss. נוטה להפוך Weights לאפס (Sparse).
    - **L2 Regularization (Ridge)** -- מוסיפה $\lambda ||\mathbf{w}||_2^2$ ל-Loss. מקטינה Weights אבל לא לאפס.

    ההבדל נובע מהגיאומטריה של הנורמות: "הכדור" של L1 הוא יהלום (עם פינות על הצירים), ולכן הפתרון האופטימלי נוטה "לנחות" על ציר -- כלומר Weights שהם אפס.

### Feature Vectors

**Feature Vector** הוא וקטור שבו כל ממד מייצג תכונה שנבחרה או נלמדה:

- ב-Tabular data -- כל עמודה היא Feature.
- ב-NLP -- מילה יכולה להיות מיוצגת כ-Embedding vector (למשל Word2Vec, 300 ממדים).
- ב-Computer Vision -- תמונה עוברת דרך CNN ומתקבל וקטור שמייצג "את התוכן" שלה.

```python
# דוגמה: Feature Vector עבור בית
# [שטח, חדרים, קומה, מרחק_מרכז, שנת_בנייה, יש_מעלית, יש_חניה]
house_features = np.array([120, 4, 2, 3.5, 2015, 1, 1])

# דוגמה: Feature Vector אחרי One-Hot Encoding
# [שטח, חדרים, עיר_תא=1, עיר_ירושלים=0, עיר_חיפה=0]
house_encoded = np.array([120, 4, 1, 0, 0])
```

!!! warning "Scaling חשוב!"
    אם Feature אחד נע בין 0-1000 (שטח) ואחר בין 0-5 (חדרים), האלגוריתם ייתן משקל מוגזם לשטח. תמיד כדאי לעשות **Normalization** או **Standardization**:

    - **Min-Max Scaling**: $x' = \frac{x - x_{min}}{x_{max} - x_{min}}$ (מביא ל-$[0,1]$)
    - **Z-Score Standardization**: $x' = \frac{x - \mu}{\sigma}$ (ממרכז סביב 0 עם סטיית תקן 1)

### Embeddings

Embedding הוא וקטור שנלמד על ידי מודל כך שפריטים **דומים** יהיו **קרובים** במרחב:

```
king  -> [0.2, 0.8, 0.1, ...]
queen -> [0.21, 0.79, 0.15, ...]
car   -> [0.9, 0.1, 0.7, ...]
```

!!! note "Embedding = ייצוג נלמד"
    בניגוד ל-Feature Vector שאנחנו בונים ידנית, Embedding נלמד אוטומטית ע"י המודל תוך כדי אימון. זו אחת הסיבות ש-Deep Learning כל כך חזק -- הוא לומד ייצוגים טובים בעצמו.

**האנלוגיות המפורסמות של Word2Vec:**

אחד הדברים המפתיעים ביותר ב-Embeddings הוא שאפשר לעשות "אריתמטיקה" על מילים:

$$\vec{king} - \vec{man} + \vec{woman} \approx \vec{queen}$$

```python
# בפועל עם מודל Word2Vec מאומן:
result = model["king"] - model["man"] + model["woman"]
# המילה הקרובה ביותר ל-result היא "queen"
```

!!! quote "Embedding -- הממציא הדיסקרטי של Deep Learning"
    בלי Embeddings, אין Transformers. בלי Transformers, אין ChatGPT. אבל כשכולם מדברים על GPT, אף אחד לא מזכיר את ה-Embedding Layer הצנוע שיושב בכניסה ועושה את כל העבודה השקטה.

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

הערך נע בין $-1$ (כיוונים הפוכים) ל-$1$ (אותו כיוון). ערך $0$ משמעותו שהווקטורים ניצבים (אורתוגונליים -- "לא קשורים").

```python
from numpy.linalg import norm
cos_sim = np.dot(a, b) / (norm(a) * norm(b))  # = 0.974
```

**Manhattan Distance (L1)** -- סכום ההפרשים המוחלטים:

$$d_{L1}(\mathbf{a}, \mathbf{b}) = \sum_{i=1}^{n} |a_i - b_i|$$

!!! warning "מתי להשתמש במה?"
    - **Euclidean** -- כשהגודל (magnitude) חשוב. למשל: מרחק פיזי בין נקודות.
    - **Cosine** -- כשרק הכיוון חשוב. למשל: דמיון בין מסמכים (מסמך ארוך וקצר יכולים להיות דומים בתוכן).
    - **Manhattan** -- כשהממדים עצמאיים ורוצים רגישות פחותה ל-Outliers.
    - **Dot Product** -- ב-Transformers ו-Attention mechanisms, לרוב משתמשים ב-Dot Product ישירות (ללא נורמליזציה) כ-similarity score.

### מרחבים רב-ממדיים (High-Dimensional Spaces)

במציאות, וקטורים ב-ML הם בעלי **מאות עד אלפי ממדים**:

- Word Embeddings: 300 ממדים
- BERT Embeddings: 768 ממדים
- GPT Embeddings: 1536+ ממדים

??? tip "Curse of Dimensionality"
    במרחבים רב-ממדיים, דברים מוזרים קורים: כמעט כל הנקודות "רחוקות" זו מזו באותה מידה. זו הסיבה שאלגוריתמים כמו KNN עובדים פחות טוב בממדים גבוהים, וצריך טכניקות כמו Dimensionality Reduction (PCA, t-SNE).

**אינטואיציה: מה קורה במרחבים גבוהים?**

דמיינו קוביית יחידה ב-$n$ ממדים. כמה מהנפח שלה "קרוב" לפינות לעומת המרכז?

- ב-2D: רוב השטח קרוב למרכז
- ב-100D: **כמעט כל** הנפח נמצא בפינות!

$$\text{Volume of inscribed sphere} / \text{Volume of cube} \xrightarrow{n \to \infty} 0$$

זה אומר שב-High dimensions, נקודות "מתנפחות" לפינות, מרחקים הופכים דומים, ואינטואיציה מ-2D/3D מטעה אותנו.

### Dimensionality Reduction

כדי להתמודד עם Curse of Dimensionality ולהמחיש נתונים, משתמשים בטכניקות הקטנת ממדים:

**PCA (Principal Component Analysis)** -- מוצא את הצירים שלאורכם יש הכי הרבה שונות (variance):

```python
from sklearn.decomposition import PCA

# נתונים ב-768 ממדים (BERT Embeddings)
X = np.random.randn(1000, 768)

# הקטנה ל-2 ממדים להמחשה
pca = PCA(n_components=2)
X_2d = pca.fit_transform(X)

# כמה מהמידע נשמר?
print(f"Explained variance: {pca.explained_variance_ratio_.sum():.2%}")
```

**t-SNE** -- שומר על יחסי שכנות (מי קרוב למי), מצוין לויזואליזציה:

```python
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, perplexity=30)
X_2d = tsne.fit_transform(X)
```

!!! warning "t-SNE -- רק לויזואליזציה!"
    t-SNE מצוין להמחשת Clusters, אבל אסור לפרש מרחקים ב-t-SNE כמרחקים אמיתיים. הוא לא שומר על מרחקים גלובליים, רק על שכנויות מקומיות. אם שני Clusters נראים רחוקים ב-t-SNE, זה לא בהכרח אומר שהם באמת רחוקים במרחב המקורי.

### Vector Databases -- חיפוש וקטורי

אחד השימושים החמים ביותר של וקטורים היום הוא **Vector Search** -- חיפוש הפריטים הדומים ביותר לוקטור נתון:

```python
# Semantic Search -- חיפוש לפי משמעות
query = "איך מכינים עוגת שוקולד?"
query_embedding = encode(query)  # [0.23, 0.87, -0.12, ...]

# חיפוש ב-Vector DB: מוצאים את ה-embeddings הקרובים ביותר
results = vector_db.search(query_embedding, top_k=5)
# מחזיר: מתכוני שוקולד, גם אם המילה "שוקולד" לא מופיעה בדיוק
```

מאגרי Vector DB פופולריים: **Pinecone**, **Weaviate**, **Qdrant**, **FAISS** (מ-Meta), **Chroma**.

??? tip "RAG -- Retrieval-Augmented Generation"
    ב-RAG, משתמשים ב-Vector Search כדי למצוא מסמכים רלוונטיים ואז מעבירים אותם ל-LLM כ-context. זה הבסיס של chatbots שיודעים לענות על שאלות מתוך מסמכים ספציפיים (ולא רק מהידע הכללי שלהם).

## בלבולים נפוצים

- **"וקטור = חץ בפיזיקה"** -- ב-ML, וקטור הוא בעיקר מערך מספרים. אין צורך לחשוב על כיוון וגודל כמו בפיזיקה.
- **"Cosine Similarity ו-Euclidean Distance נותנים את אותה תשובה"** -- לא! Cosine מתעלם מאורך הוקטור, Euclidean לא. שני וקטורים באותו כיוון אבל באורכים שונים יהיו דומים ב-Cosine אבל רחוקים ב-Euclidean.
- **"יותר ממדים = יותר טוב"** -- לא בהכרח. ממדים מיותרים מוסיפים רעש ומאטים חישובים.
- **"Embedding ו-Feature Vector זה אותו דבר"** -- Feature Vector יכול להיות ידני, Embedding תמיד נלמד ע"י מודל.
- **"Dot Product ו-Cosine Similarity זה אותו דבר"** -- Cosine Similarity הוא Dot Product **מנורמל**. אם הוקטורים מנורמלים (אורך 1), אז הם שקולים. אחרת -- לא.

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
    euc_dist = np.linalg.norm(target - vec)
    print(f"{word}: cosine similarity = {cos_sim:.3f}, euclidean distance = {euc_dist:.3f}")

# פלט:
# מלכה: cosine similarity = 0.965, euclidean distance = 0.430
# חתול: cosine similarity = 0.438, euclidean distance = 1.262
# נסיך: cosine similarity = 0.997, euclidean distance = 0.112
```

!!! note "מה רואים כאן?"
    "נסיך" ו-"מלכה" קרובים ל-"מלך" יותר מ-"חתול". זה הרעיון של Embeddings -- מילים עם משמעות דומה ממופות לנקודות קרובות במרחב. שימו לב ש-Cosine ו-Euclidean נותנים את אותו דירוג כאן, אבל זה לא תמיד המצב!

## 🛤️ מאיפה מתחילים

1. **בסיס מתמטי** -- ודאו שאתם מרגישים בנוח עם אלגברה לינארית בסיסית: וקטורים, מכפלה סקלרית, נורמות. קורס מומלץ: 3Blue1Brown -- Essence of Linear Algebra (YouTube).
2. **NumPy** -- תרגלו יצירה ומניפולציה של וקטורים ב-NumPy. זה הכלי היום-יומי.
3. **מדדי מרחק** -- ממשו Euclidean Distance ו-Cosine Similarity ידנית (בלי ספריות), ואז השוו לפונקציות של `scipy.spatial.distance`.
4. **Embeddings** -- שחקו עם Word2Vec או GloVe מוכנים מ-`gensim`. חפשו אנלוגיות (king - man + woman = ?) ובדקו similarity בין מילים.
5. **ויזואליזציה** -- קחו Embeddings של מילים/מסמכים, הקטינו ל-2D עם t-SNE או PCA, ותראו Clusters.
6. **Vector Search** -- נסו Chroma או FAISS ותבנו Semantic Search פשוט על קובץ טקסט.
7. **פרויקט** -- בנו RAG פשוט: קחו מסמך, חלקו לפסקאות, צרו Embeddings עם OpenAI/Sentence-Transformers, אחסנו ב-Vector DB, וחפשו תשובות לשאלות.

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Euclidean Distance ל-Cosine Similarity? מתי תבחרו בכל אחד?"
    **Euclidean Distance** מודד את המרחק "בקו ישר" בין שתי נקודות במרחב. הוא מושפע מאורך (magnitude) הוקטורים. **Cosine Similarity** מודד את הזווית בין שני וקטורים, ומתעלם מהאורך.

    נבחר ב-Euclidean כשהגודל חשוב (מרחק פיזי, ערכים מוחלטים). נבחר ב-Cosine כשהכיוון חשוב (דמיון בין מסמכים באורכים שונים, דמיון בין Embeddings). ב-NLP, Cosine כמעט תמיד עדיף כי אורך הוקטור מושפע מאורך הטקסט ולא מהתוכן.

??? tip "מה זה Curse of Dimensionality? איך מתמודדים?"
    במרחבים רב-ממדיים, המרחק בין כל שתי נקודות מתכנס לערך דומה, מה שגורם לאלגוריתמים מבוססי מרחק (כמו KNN) להיכשל. נפח ה-"שכנות" של נקודה צומח אקספוננציאלית עם מספר הממדים.

    פתרונות: Dimensionality Reduction (PCA, t-SNE, UMAP), Feature Selection (בחירת Features רלוונטיים בלבד), Regularization, ושימוש באלגוריתמים שפחות רגישים לממדים גבוהים (כמו Random Forest).

??? tip "מהם Embeddings? מה ההבדל בין Embedding ל-Feature Vector?"
    Embedding הוא ייצוג וקטורי **נלמד** שבו פריטים דומים סמנטית ממופים לנקודות קרובות במרחב. Feature Vector יכול להיות **ידני** (Feature Engineering) -- למשל [שטח, חדרים, קומה].

    Embeddings חזקים כי הם לומדים ייצוגים שאנחנו לא היינו בוחרים ידנית, ולוכדים מבנים סמנטיים עשירים (כמו האנלוגיות של Word2Vec).

??? tip "מה זה Vector Database ולמה צריך אחד?"
    Vector Database הוא מאגר מידע מיוחד שמאחסן וקטורים ומאפשר **חיפוש Nearest Neighbor** יעיל. הוא משתמש באלגוריתמים כמו HNSW או IVF כדי למצוא את $k$ הוקטורים הקרובים ביותר בלי לעבור על כולם (Approximate Nearest Neighbor).

    צריך אחד כשיש הרבה Embeddings (מיליונים+) ורוצים חיפוש מהיר -- למשל Semantic Search, Recommendation Systems, RAG.

??? tip "מה ההבדל בין PCA ל-t-SNE? מתי משתמשים בכל אחד?"
    **PCA** -- הפחתת ממדים לינארית. שומר על variance מקסימלי. מתאים להפחתת ממדים כ-preprocessing (למשל מ-1000 ל-50 ממדים לפני אימון). הוא דטרמיניסטי ומהיר.

    **t-SNE** -- הפחתת ממדים לא-לינארית. שומר על מבנה שכנויות מקומי. מתאים **רק לויזואליזציה** (בד"כ ל-2D/3D). הוא איטי, סטוכסטי, ואי אפשר להשתמש בו על נתונים חדשים (אין `transform`).

    **UMAP** -- אלטרנטיבה מודרנית ל-t-SNE: מהיר יותר, שומר גם על מבנה גלובלי, ותומך ב-transform.

??? tip "הסבירו את ה-Dot Product ואיך הוא קשור ל-Attention ב-Transformers."
    Dot Product $\mathbf{q} \cdot \mathbf{k} = \sum q_i k_i$ מודד "כמה שני וקטורים מצביעים לאותו כיוון". ערך גבוה = דומים, ערך נמוך/שלילי = שונים.

    ב-Transformers, ה-Attention mechanism מחשב $\text{softmax}(\frac{QK^T}{\sqrt{d_k}}) V$. ה-Dot Product $QK^T$ מודד כמה כל Token (Query) "רלוונטי" לכל Token אחר (Key). החלוקה ב-$\sqrt{d_k}$ מונעת שהערכים יהיו גדולים מדי (ויגרמו ל-Softmax "לצנוח" לקיצוניות). Softmax ממיר להסתברויות, ואז כופלים ב-V לקבלת ייצוג משוקלל.

??? tip "למה Embeddings מנורמלים לפעמים לאורך 1? מתי עושים את זה?"
    נורמליזציה לאורך 1 ($\mathbf{v} / ||\mathbf{v}||$) מבטיחה ש-Dot Product שקול ל-Cosine Similarity. זה שימושי כשרוצים השוואה שמתעלמת מגודל ומתמקדת בכיוון בלבד.

    עושים את זה לפני אחסון ב-Vector DB (חיסכון בחישוב Cosine), ב-Contrastive Learning (למשל CLIP), וכש-Embeddings מגיעים מטקסטים באורכים שונים מאוד.

## קישורים לנושאים אחרים

- [סיווג (Classification)](classification.md) -- שימוש בוקטורים כקלט לאלגוריתמי סיווג
- [אלגוריתמים ב-ML](../01-algorithmics/algorithms-in-ml.md) -- KNN, K-Means ואלגוריתמים נוספים שעובדים ישירות על וקטורים
- [Transformers](transformers.md) -- מנגנון ה-Attention מבוסס כולו על Dot Products בין וקטורים
- [Loss & Softmax](loss-softmax.md) -- איך ה-Loss Function מנחה את למידת ה-Embeddings
