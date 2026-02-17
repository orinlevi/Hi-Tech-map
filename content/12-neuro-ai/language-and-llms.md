# 🗣️ שפה — מ-Broca עד GPT

> **לקח למוח 200,000 שנה לפתח שפה. ל-Transformer לקח 4 שנים להגיע ל-GPT-4. מי שאמר "slow and steady" לא הכיר attention.**

---

## מערכת השפה במוח

### אזורי מפתח

```
           Arcuate fasciculus (חיבור)
                ┌─────────────────┐
                │                 │
         ┌──────▼──────┐   ┌─────┴──────┐
         │  Broca's    │   │ Wernicke's │
         │   Area      │   │   Area     │
         │ (ייצור שפה) │   │(הבנת שפה) │
         └─────────────┘   └────────────┘
         Frontal lobe        Temporal lobe
```

| אזור | תפקיד | נזק (aphasia) |
|------|--------|---------------|
| **Broca's** (BA 44/45) | ייצור שפה, syntax, grammar | דיבור לא שוטף, הבנה שמורה |
| **Wernicke's** (BA 22) | הבנת שפה, semantics | דיבור שוטף אבל חסר משמעות |
| **Arcuate fasciculus** | חיבור Broca-Wernicke | הפרעה בחזרה (conduction aphasia) |
| **Angular gyrus** | קריאה, כתיבה, מעבר modalיות | alexia, agraphia |

!!! note "Aphasia — חלון למוח"
    Broca's aphasia: "Want... go... store..." (מבינים אבל לא מייצרים)
    Wernicke's aphasia: "The flowers purple wiggle in the happy suitcase" (מייצרים אבל לא מבינים)

### עיבוד שפתי — שלבים

```
1. Phonology — זיהוי צלילים (100ms)
     → Primary Auditory Cortex (A1)

2. Lexical access — מציאת מילה (200ms)
     → Superior Temporal Gyrus

3. Syntax — מבנה משפט (300-400ms)
     → Broca's Area (BA 44)

4. Semantics — משמעות (400ms, N400)
     → Distributed network

5. Pragmatics — הקשר, כוונה
     → Prefrontal + Right Hemisphere
```

### ERP Components — חלונות זמן

| Component | Latency | מה מודד | דוגמה |
|-----------|---------|---------|-------|
| **N400** | ~400ms | Semantic surprise | "He spread butter on his *socks*" |
| **P600** | ~600ms | Syntactic violation | "The cat was *chasing* by the dog" |
| **ELAN** | ~200ms | Early syntax | Word category violation |
| **LAN** | ~400ms | Morphosyntax | Agreement violation |

---

## NLP — מ-Symbolic ל-Neural

### התפתחות היסטורית

```
1950s: Rule-based — grammar rules ידניים
  ↓
1980s: Statistical NLP — n-grams, HMMs
  ↓
2003: Neural LMs — Bengio's feedforward LM
  ↓
2013: Word2Vec — word embeddings (Mikolov)
  ↓
2017: Transformer — "Attention is All You Need"
  ↓
2018: BERT — bidirectional understanding
  ↓
2020: GPT-3 — few-shot learning, 175B params
  ↓
2023-2025: GPT-4, Claude, Gemini — multimodal
```

### Word Embeddings

```python
# Word2Vec — מילים כנקודות במרחב
# king - man + woman ≈ queen

from gensim.models import Word2Vec

# Training
model = Word2Vec(sentences, vector_size=300, window=5)

# Semantic relationships
model.wv.most_similar(positive=['king', 'woman'],
                       negative=['man'])
# → [('queen', 0.89), ...]
```

!!! tip "אנלוגיה ביולוגית"
    **Semantic memory** במוח מאורגנת לפי קרבה סמנטית — "כלב" ו"חתול" קרובים יותר מ"כלב" ו"מכונית". Word embeddings עושים בדיוק את זה — ייצוג וקטורי שבו מילים דומות קרובות במרחב.

---

## Transformers — המהפכה

### Self-Attention

```
"The cat sat on the mat"

Q: "מה רלוונטי לכל מילה?"
Attention("cat") → high weights on "sat", "the"
Attention("sat") → high weights on "cat", "mat"

כל מילה "מסתכלת" על כל המילים האחרות
→ Global context מהשכבה הראשונה!
```

```python
import torch
import torch.nn.functional as F

def self_attention(Q, K, V, d_k):
    """
    Q, K, V: (batch, seq_len, d_k)
    Scaled Dot-Product Attention
    """
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V)
```

### Multi-Head Attention

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=512, n_heads=8):
        super().__init__()
        self.d_k = d_model // n_heads
        self.n_heads = n_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x):
        B, L, D = x.shape
        # Each head learns different linguistic relationship
        # Head 1: syntax, Head 2: coreference, Head 3: semantics...
        Q = self.W_q(x).view(B, L, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(B, L, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(B, L, self.n_heads, self.d_k).transpose(1, 2)

        attn = self_attention(Q, K, V, self.d_k)
        attn = attn.transpose(1, 2).reshape(B, L, D)
        return self.W_o(attn)
```

!!! note "Multi-Head = Multiple Perspectives"
    כל head לומד יחסים שונים — syntax, coreference, semantics, position. **בדיוק כמו שאזורים שונים במוח מעבדים היבטים שונים של שפה** (Broca → syntax, Wernicke → semantics).

---

## Encoder vs Decoder

| ארכיטקטורה | דוגמה | שימוש | Attention |
|------------|-------|-------|-----------|
| **Encoder** | BERT | הבנה, classification | Bidirectional |
| **Decoder** | GPT | יצירת טקסט | Causal (left→right) |
| **Enc-Dec** | T5, BART | תרגום, summarization | Cross-attention |

### BERT — Bidirectional Understanding

```
Input:  "The [MASK] sat on the mat"
Output: "The cat sat on the mat" (MLM)

Input:  "Paris is the capital of [MASK]"
Output: "France" (fill-in)

Pre-training tasks:
1. Masked Language Model (MLM) — 15% of tokens masked
2. Next Sentence Prediction (NSP)
```

### GPT — Autoregressive Generation

```
Input:  "The cat sat"
Output: "on" (predict next token)

P(x_t | x_1, x_2, ..., x_{t-1})
כל token מותנה בכל הtokens הקודמים
```

---

## Scaling Laws

```
Performance ∝ compute^α × data^β × params^γ

GPT-2:    1.5B params,   40GB text
GPT-3:  175B params,  300B tokens
GPT-4:  ~1.8T params(?), ~13T tokens(?)
```

!!! warning "יותר גדול = יותר טוב?"
    Scaling laws (Kaplan et al., 2020) הראו שperformance משתפר כpower law עם compute, data, params. אבל — efficiency matters (Chinchilla showed data-optimal scaling).

---

## המוח vs. LLMs — השוואה

| תכונה | מוח | LLMs |
|--------|------|------|
| **Parameters** | ~86B neurons, ~100T synapses | 1B-2T params |
| **Energy** | ~20W | ~1MW (training cluster) |
| **Learning** | Online, continuous | Batch training, static |
| **Multimodal** | מלידה | Recent addition |
| **Grounding** | Embodied, sensory | Text-only (mostly) |
| **Context** | Dynamic, working memory | Fixed context window |
| **Compositionality** | Natural | Learned, imperfect |
| **Hallucinations** | Confabulation exists too! | Very common |

### מה LLMs *לא* עושים כמו המוח

1. **No grounding** — GPT לא "יודע" מה חתול כי הוא מעולם לא ראה אחד
2. **No online learning** — לא לומד מכל שיחה (אלא אם fine-tuned)
3. **No embodiment** — אין גוף, אין תחושות
4. **No true understanding?** — ויכוח פילוסופי פתוח (Chinese Room)

### מה LLMs *כן* עושים כמו המוח

1. **Contextual representations** — מילה = context-dependent (כמו semantic memory)
2. **Predictive processing** — next-token prediction ≈ predictive coding theory
3. **Attention** — selective attention לinformation רלוונטי
4. **Emergent abilities** — in-context learning, chain-of-thought

!!! tip "Predictive Processing Theory"
    Karl Friston's theory — המוח הוא "prediction machine" שמנסה לצמצם **prediction error**. Next-token prediction ב-LLMs עושה... בדיוק את זה.

---

## Neuroscience of LLMs — מחקר חדש

```
1. Brain encoding models:
   LLM activations predict fMRI responses to language
   (Schrimpf et al., 2021)

2. Syntactic representations:
   Attention heads in GPT-2 track dependency parsing
   (like Broca's area)

3. Semantic representations:
   Middle layers ≈ distributed semantic network
   Late layers ≈ task-specific prefrontal

4. Alignment with brain:
   GPT-2 predicts neural data better than any previous model
   (Goldstein et al., 2022)
```

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מבוא לבלשנות (Linguistics) — phonology, syntax, semantics, pragmatics
    - פסיכולינגוויסטיקה — עיבוד שפתי במוח, ERPs
    - עיבוד שפה טבעית (NLP) — מclassical עד neural
    - למידה עמוקה — Transformers, attention, architectures
    - מבוא לנוירומדע — אזורי שפה, aphasia, lateralization

    **קורסים מומלצים:**
    - נוירומדע קוגניטיבי — שפה ומחשבה
    - תורת המידע — entropy, information theory (בסיס ל-language models)
    - לוגיקה פורמלית — formal grammars, Chomsky hierarchy
    - פילוסופיה של שפה — meaning, reference, Chinese Room

    **ידע מעשי:**
    - Python + PyTorch / HuggingFace Transformers
    - tokenization (BPE, SentencePiece)
    - fine-tuning BERT/GPT
    - Prompt engineering
    - MNE-Python (לERP analysis)
    - spaCy / NLTK (לNLP קלאסי)

    **מתוכנית הלימודים שלך ב-TAU:**
    - Natural Language Processing (0368-3077)
    - פסיכולוגיה קוגניטיבית (1071-2907)
    - מודלים חישוביים בפסיכולוגיה (1071-2337)
    - יסודות הלמידה העמוקה (0368-3080)
    - מבוא ללמידה חישובית (0368-3235)

---

## 🛤️ מאיפה מתחילים

1. **Illustrated Transformer** — Jay Alammar's blog
2. **CS224N** (Stanford) — NLP with Deep Learning
3. **HuggingFace Course** — practical Transformers
4. **"Speech and Language Processing"** — Jurafsky & Martin (free online)
5. **Neuroscience of Language** — papers by Fedorenko, Hagoort

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין BERT ל-GPT?"
    **BERT** — Encoder, bidirectional, trained with MLM. טוב להבנה (classification, NER, QA).
    **GPT** — Decoder, autoregressive (left-to-right), trained with next-token prediction. טוב ליצירת טקסט.
    BERT רואה את כל ההקשר; GPT רואה רק מה שקדם.

??? tip "מה Attention עושה ולמה הוא חשוב?"
    Attention מאפשר לכל token "להסתכל" על כל הtokens האחרים ולשקלל את החשיבות שלהם. פתר את הבעיה של רצפים ארוכים (RNNs שוכחים). **Self-attention** = query, key, value מאותו input. **Multi-head** = מספר perspectives במקביל.

??? tip "מה הקשר בין Broca's area ל-attention heads?"
    Broca's area מעבדת syntax ומבנה דקדוקי. מחקרים (Clark et al., 2019) הראו ש-attention heads מסוימים ב-GPT-2 עוקבים אחרי dependency structures — כלומר, הם "גילו" עיבוד סינטקטי מdata בלבד, בדומה לפונקציה של Broca's.

??? tip "מה Tokenization ולמה BPE?"
    Tokenization = חלוקת טקסט ליחידות. **BPE (Byte Pair Encoding)** — merges frequent character pairs iteratively. יתרונות: מטפל ב-OOV words, subword units, מאזן בין character-level ל-word-level. אלטרנטיבות: WordPiece (BERT), SentencePiece (multilingual).

??? tip "מה Scaling Laws ומה Chinchilla הראה?"
    **Scaling Laws** (Kaplan 2020): performance משתפר כpower law של compute, data, params. **Chinchilla** (Hoffmann 2022): הראה ש-GPT-3 היה under-trained — עדיף מודל קטן יותר (70B) עם יותר data (1.4T tokens) מאשר מודל ענק (175B) עם פחות data. **Data > Parameters** (עד לנקודת שוויון).

??? tip "האם LLMs באמת 'מבינים' שפה?"
    שאלה פתוחה! **בעד**: predictive processing, emergent reasoning, alignment with brain. **נגד**: Chinese Room argument (Searle), no grounding, hallucinations, no embodiment. **דעת ביניים**: הם לומדים *statistical structure* של שפה ברמה מרשימה, אבל "הבנה" תלויה בהגדרה.
