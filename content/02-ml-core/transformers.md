# Transformers

## למה זה חשוב

ארכיטקטורת ה-Transformer היא **הבסיס של כמעט כל מודל AI מוביל היום**: GPT, Claude, BERT, T5, Stable Diffusion, ועוד. מאמר "Attention Is All You Need" (2017) שינה את התחום לחלוטין.

- **GPT-4, Claude, Gemini** -- כולם מבוססי Transformer.
- **BERT, RoBERTa** -- מבוססי Transformer, שולטים ב-NLP tasks.
- **Vision Transformers (ViT)** -- Transformers גם לתמונות.
- **Diffusion models** -- משתמשים ב-Transformer components (DiT).

להבין Transformers זה להבין את **הליבה** של AI מודרני.

## רעיונות מרכזיים

### המהפכה: Attention Is All You Need

לפני Transformers, RNNs שלטו ב-NLP. הבעיות העיקריות של RNNs:

1. **עיבוד סדרתי** -- מילה אחרי מילה, אי אפשר לעבד במקביל.
2. **זיכרון קצר-טווח** -- קשה "לזכור" מידע מתחילת המשפט.
3. **Vanishing Gradients** -- באימון על רצפים ארוכים.

Transformers פתרו את כל הבעיות האלה עם מנגנון אחד: **Self-Attention**.

### Self-Attention (בפישוט)

Self-Attention מאפשר לכל מילה "להסתכל" על כל המילים האחרות במשפט ולהחליט כמה כל אחת מהן רלוונטית:

```
"The cat sat on the mat because it was tired"
                                   |
                              "it" מתייחס למי?
                                   |
                    Self-Attention: "it" -> "cat" (attention גבוה)
```

המנגנון עובד כך:

```
לכל מילה, יוצרים 3 וקטורים:
- Query (Q): "מה אני מחפש?"
- Key (K):   "מה אני מציע?"
- Value (V): "מה המידע שלי?"

Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
```

```python
import numpy as np

def simple_attention(Q, K, V):
    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)     # Similarity scores
    weights = softmax(scores)             # Normalize to probabilities
    output = weights @ V                  # Weighted sum of Values
    return output, weights
```

??? tip "Multi-Head Attention"
    במקום Attention אחד, Transformers משתמשים ב-**מספר Heads במקביל** (למשל 8 או 12). כל Head לומד "לשים לב" להיבט אחר:

    - Head 1: מתמקד ביחסי תחביר (נושא-פועל)
    - Head 2: מתמקד ביחסי הפניה (it -> cat)
    - Head 3: מתמקד בקרבה פיזית (מילים סמוכות)

    בסוף, כל ה-Heads מחוברים יחד.

### ארכיטקטורת Encoder-Decoder

הארכיטקטורה המקורית של Transformer:

```
         Encoder                     Decoder
    +-----------------+         +-----------------+
    | Self-Attention  |         | Masked Self-Att |
    | + Feed Forward  |  --->   | + Cross-Att     |
    | + Layer Norm    | context | + Feed Forward   |
    |  x N layers     |         |  x N layers     |
    +-----------------+         +-----------------+
         |                              |
    Input tokens               Output tokens
  ("Hello, how are")          ("שלום, מה שלומך")
```

- **Encoder** -- מעבד את הקלט כולו ויוצר ייצוג (context).
- **Decoder** -- מייצר את הפלט מילה אחרי מילה, תוך שימוש ב-context מה-Encoder.

!!! note "Positional Encoding"
    מכיוון ש-Transformer מעבד את כל המילים **במקביל** (לא ברצף כמו RNN), הוא צריך דרך "לדעת" את הסדר. **Positional Encoding** מוסיף מידע על מיקום כל מילה באמצעות פונקציות sin/cos או Embeddings נלמדים.

### למה Transformers ניצחו את RNNs

| תכונה | RNN | Transformer |
|--------|-----|-------------|
| עיבוד | סדרתי (איטי) | **מקבילי (מהיר)** |
| זיכרון | מוגבל (Vanishing Gradients) | **בלתי מוגבל** (Attention) |
| מרחק | קשה ללמוד תלויות רחוקות | **כל מילה רואה כל מילה** |
| GPU utilization | נמוך | **גבוה** |
| Scaling | קשה | **מתמדד היטב** |

### GPT vs BERT

שני השימושים העיקריים של Transformer:

**GPT (Decoder-only)** -- מודל אוטורגרסיבי:

```
Input:  "The cat sat on the"
Output: "mat"  (חוזה את המילה הבאה)

Masked Self-Attention: כל מילה רואה רק את המילים שלפניה
[The] -> [The, cat] -> [The, cat, sat] -> ...
```

- שימושים: יצירת טקסט, Chat, Code generation
- דוגמאות: GPT-4, Claude, LLaMA

**BERT (Encoder-only)** -- מודל דו-כיווני:

```
Input:  "The cat [MASK] on the mat"
Output: "sat"  (ממלא מילים חסרות)

Self-Attention: כל מילה רואה את כל המילים (גם אחריה!)
```

- שימושים: Classification, NER, Question Answering, Search
- דוגמאות: BERT, RoBERTa, DeBERTa

!!! warning "GPT vs BERT -- מתי מה?"
    - צריכים **ליצור טקסט**? GPT (Decoder).
    - צריכים **להבין טקסט** (סיווג, חיפוש, חילוץ)? BERT (Encoder).
    - צריכים **תרגום** (קלט -> פלט שונה)? Encoder-Decoder (T5, BART).

### Scaling Laws

אחת התגליות החשובות: Transformers **משתפרים באופן צפוי** ככל שמגדילים:

1. **מספר Parameters** (גודל המודל)
2. **כמות נתוני אימון**
3. **כמות Compute (זמן חישוב)**

??? tip "Chinchilla Scaling"
    המחקר של DeepMind (Chinchilla, 2022) הראה שיש יחס אופטימלי בין גודל המודל לכמות הנתונים. מודלים כמו LLaMA 2 אומנו על הרבה יותר נתונים ממה שהיה מקובל -- והתוצאות היו טובות יותר גם עם פחות Parameters.

## בלבולים נפוצים

- **"Transformer = GPT"** -- לא! Transformer הוא ארכיטקטורה. GPT, BERT, T5, ViT -- כולם Transformers, אבל שונים זה מזה.
- **"Attention מחליף את כל השאר"** -- Transformer כולל גם Feed-Forward layers, Layer Normalization, Residual Connections. Attention הוא רק חלק אחד (אם כי המרכזי).
- **"Transformers עובדים רק על טקסט"** -- לא! Vision Transformer (ViT) לתמונות, Audio Transformers למוזיקה, Protein Transformers לביולוגיה. הארכיטקטורה גנרית.
- **"Self-Attention הוא O(1) בזיכרון"** -- בדיוק להפך! Self-Attention הוא O(n^2) במספר הטוקנים. זו בעיה מרכזית שמגבילה את אורך ה-Context window, ויש מחקר רב על פתרונות (Flash Attention, Ring Attention).

## דוגמה קטנה

הדמיה פשוטה של Self-Attention:

```python
import numpy as np

def softmax(x):
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / exp_x.sum(axis=-1, keepdims=True)

# 4 מילים, כל אחת עם Embedding בגודל 3
# "The", "cat", "is", "cute"
embeddings = np.array([
    [1.0, 0.0, 0.5],  # The
    [0.8, 0.9, 0.1],  # cat
    [0.2, 0.1, 0.8],  # is
    [0.5, 0.7, 0.3],  # cute
])

# בפישוט: Q = K = V = embeddings (בפועל יש מטריצות נפרדות)
Q = K = V = embeddings
d_k = Q.shape[-1]

# שלב 1: Attention Scores
scores = Q @ K.T / np.sqrt(d_k)

# שלב 2: Softmax (נורמליזציה)
attention_weights = softmax(scores)
print("Attention weights:")
print(np.round(attention_weights, 2))
# כל שורה מראה כמה כל מילה "שמה לב" לכל מילה אחרת

# שלב 3: Weighted sum
output = attention_weights @ V
print("\nOutput (contextualized embeddings):")
print(np.round(output, 2))
# כל מילה מקבלת ייצוג חדש שמשקלל מידע מכל המילים
```

!!! note "מה קורה כאן?"
    כל מילה מקבלת ייצוג חדש שמשלב מידע מכל המילים האחרות, לפי רלוונטיות. "cat" תקבל מידע מ-"cute" ומ-"is" -- כי "the cute cat" הוא ביטוי רלוונטי. זה ה-"קסם" של Attention.

## קישורים לנושאים אחרים

- [רשתות נוירונים](neural-networks.md) -- Transformer מורכב מ-Feed-Forward layers, Activations, ועקרונות NN
- [Diffusion](diffusion.md) -- Diffusion Transformers (DiT) משלבים Transformers ביצירת תמונות
- [וקטורים ומרחבים](vectors-and-spaces.md) -- Embeddings ו-Attention עובדים על וקטורים במרחבים רב-ממדיים

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - אלגברה לינארית — matrix multiplication, attention as matmul
    - למידה עמוקה — sequence models, attention mechanisms
    - עיבוד שפה טבעית (NLP) — tokenization, language models
    - הסתברות — softmax, cross-entropy, sampling

    **קורסים מומלצים:**
    - תורת המידע — information bottleneck, compression
    - חישוב מבוזר — model parallelism, distributed training
    - בלשנות חישובית — syntax, semantics, pragmatics

    **ידע מעשי:**
    - Python + PyTorch
    - HuggingFace Transformers library
    - tokenization (BPE, SentencePiece)
    - Fine-tuning, LoRA, PEFT
    - Prompt engineering

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא ללמידה חישובית (0368-3235)
    - יסודות הלמידה העמוקה (0368-3080)
    - Natural Language Processing (0368-3077)
    - אלגברה לינארית 2ב (0366-1120)

---

## 🛤️ מאיפה מתחילים

1. **"Illustrated Transformer"** — Jay Alammar's blog
2. **"Attention Is All You Need"** — Vaswani et al. (2017) — הpaper המקורי
3. **CS224N** (Stanford) — NLP with Deep Learning
4. **HuggingFace Course** — practical Transformers
5. **Andrej Karpathy — "Let's build GPT"** (YouTube)

---

## 💼 שאלות לראיון עבודה

??? tip "מה Self-Attention ולמה הוא חשוב?"
    Self-Attention מאפשר לכל token "להסתכל" על כל הtokens האחרים ולחשב weighted sum. `Attention(Q,K,V) = softmax(QK^T/√d_k)V`. חשוב כי: (1) global context מהשכבה הראשונה (לא כמו RNN), (2) parallelizable (לא sequential), (3) לומד relationships ישירות.

??? tip "למה מחלקים ב-√d_k?"
    בלי scaling, כש-d_k גדול, dot products גדלים → softmax נהיה peaked (קרוב ל-one-hot) → gradients קטנים. חלוקה ב-√d_k מנרמלת את הvariance ל-1, שומרת על softmax "רך" עם gradients בריאים.

??? tip "מה ההבדל בין Encoder ל-Decoder?"
    **Encoder** (BERT) — bidirectional self-attention, רואה את כל הsequence. טוב להבנה (classification, NER).
    **Decoder** (GPT) — causal self-attention (masked), רואה רק tokens קודמים. טוב ליצירה (text generation).
    **Enc-Dec** (T5) — encoder מעבד input, decoder מייצר output עם cross-attention.

??? tip "מה Positional Encoding ולמה צריך?"
    Transformer לא יודע סדר — attention הוא permutation invariant. Positional encoding מוסיף מידע על מיקום: sinusoidal (original), learned (BERT), RoPE (LLaMA), ALiBi (BLOOM). RoPE ו-ALiBi מאפשרים extrapolation לsequences ארוכים יותר.

??? tip "מה Multi-Head Attention?"
    במקום attention אחד, מריצים h attention heads במקביל, כל אחד עם W_Q, W_K, W_V שונים. כל head לומד relationship שונה (syntax, coreference, position). Concatenate + linear projection. d_k = d_model / h → אותה עלות חישובית.

??? tip "מה KV-Cache ולמה חשוב?"
    באינפרנס autoregressive, כל token חדש צריך attention על כל הtokens הקודמים. בלי cache — מחשבים K,V מחדש בכל צעד: O(n²). עם KV-Cache — שומרים K,V של tokens קודמים ומוסיפים רק token חדש: O(n) per step. חיסכון ענק בזיכרון ובחישוב.
