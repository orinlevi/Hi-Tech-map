# רשתות נוירונים (Neural Networks)

## למה זה חשוב

Neural Networks הם **הבסיס של Deep Learning** -- הטכנולוגיה שמאחורי כמעט כל פריצות הדרך ב-AI בשנים האחרונות: זיהוי תמונות, תרגום שפות, מודלי שפה (LLMs), יצירת תמונות, ועוד.

- כל מודל Deep Learning -- מ-ChatGPT ועד Stable Diffusion -- מבוסס על Neural Networks.
- הבנת המבנה הבסיסי (Neuron, Layer, Forward/Backward pass) היא **תנאי מוקדם** להבנת ארכיטקטורות מתקדמות.
- זה לא קסם -- זה מתמטיקה של כפל מטריצות, פונקציות לא-ליניאריות, ונגזרות.

## רעיונות מרכזיים

### מהו Neuron?

Neuron (נוירון) הוא **יחידת חישוב בסיסית**. הוא מקבל קלטים, מכפיל כל אחד במשקל (weight), מוסיף Bias, ומעביר דרך Activation Function:

```
inputs:  x1, x2, x3
weights: w1, w2, w3
bias:    b

z = w1*x1 + w2*x2 + w3*x3 + b    # Linear combination
a = activation(z)                   # Non-linear activation
```

```
  x1 --(*w1)--> \
  x2 --(*w2)--> + --> [z = sum + b] --> [activation] --> output
  x3 --(*w3)--> /
```

### שכבות (Layers)

Neural Network מורכב משכבות של נוירונים:

```
Input Layer      Hidden Layer(s)      Output Layer
  [x1]            [h1]  [h4]           [o1]
  [x2]   --->     [h2]  [h5]   --->    [o2]
  [x3]            [h3]  [h6]           [o3]

  Features       Learned               Predictions
                 representations
```

- **Input Layer** -- מקבל את ה-Feature Vector (למשל: פיקסלים של תמונה).
- **Hidden Layers** -- שכבות "נסתרות" שלומדות ייצוגים מופשטים יותר ויותר.
- **Output Layer** -- מוציא את התוצאה (למשל: הסתברויות לכל קטגוריה).

!!! note "Deep = הרבה שכבות"
    ההבדל בין Neural Network רגיל ל-**Deep** Neural Network הוא מספר ה-Hidden Layers. ככל שיש יותר שכבות, הרשת יכולה ללמוד ייצוגים מורכבים יותר -- אבל גם מתאמנת לאט יותר ודורשת יותר נתונים.

### Forward Pass

ה-Forward Pass הוא תהליך ה"חישוב קדימה" -- מהקלט אל הפלט:

```python
import numpy as np

# רשת פשוטה: 2 inputs -> 3 hidden -> 1 output
X = np.array([0.5, 0.8])

# שכבה 1 (Hidden)
W1 = np.array([[0.2, 0.4, -0.1],
               [0.3, -0.2, 0.5]])
b1 = np.array([0.1, 0.0, -0.1])
z1 = X @ W1 + b1           # Linear
a1 = np.maximum(0, z1)     # ReLU activation

# שכבה 2 (Output)
W2 = np.array([[0.6], [-0.3], [0.8]])
b2 = np.array([0.1])
z2 = a1 @ W2 + b2          # Linear
output = z2                 # Final output (for regression)

print(f"Hidden activations: {a1}")
print(f"Output: {output}")
```

### Backward Pass (Backpropagation)

**Backpropagation** הוא האלגוריתם שמחשב כיצד לעדכן כל Weight ברשת כדי **למזער את ה-Loss**:

```
1. Forward pass   --> מחשבים את הפלט
2. Loss           --> מחשבים את הטעות
3. Backward pass  --> מחשבים Gradient (נגזרת ה-Loss לפי כל Weight)
4. Update         --> w = w - learning_rate * gradient
```

??? tip "Chain Rule -- הסוד של Backpropagation"
    Backpropagation מבוסס על **כלל השרשרת** (Chain Rule) מחדו"א. כדי לחשב את ההשפעה של Weight בשכבה הראשונה על ה-Loss, מכפילים את הנגזרות לאורך כל הדרך:

    $$\frac{\partial Loss}{\partial w_1} = \frac{\partial Loss}{\partial a_2} \cdot \frac{\partial a_2}{\partial z_2} \cdot \frac{\partial z_2}{\partial a_1} \cdot \frac{\partial a_1}{\partial z_1} \cdot \frac{\partial z_1}{\partial w_1}$$

    זה נשמע מסובך, אבל מחשבים זאת אוטומטית באמצעות Frameworks כמו PyTorch ו-TensorFlow.

### Activation Functions

פונקציות הפעלה מוסיפות **אי-ליניאריות** לרשת. בלעדיהן, כל הרשת שקולה לפונקציה ליניארית אחת:

**ReLU** (Rectified Linear Unit) -- הפופולרית ביותר:

```
ReLU(x) = max(0, x)

  |      /
  |     /
  |    /
  |___/________
  0
```

**Sigmoid** -- ממפה ל-[0,1], משמש בעיקר ב-Output layer ל-Binary classification:

```
Sigmoid(x) = 1 / (1 + exp(-x))

  1 |    ________
    |   /
0.5 |  /
    | /
  0 |/___________
```

**Tanh** -- ממפה ל-[-1,1]:

```
Tanh(x) = (exp(x) - exp(-x)) / (exp(x) + exp(-x))

  1 |    ________
    |   /
  0 | --
    |/
 -1 |____________
```

!!! warning "למה ReLU ולא Sigmoid בשכבות הנסתרות?"
    Sigmoid וTanh סובלים מבעיית **Vanishing Gradients** -- ברשתות עמוקות, הנגזרות מתקרבות ל-0 בשכבות הראשונות, והלמידה נעצרת. ReLU פותר את זה כי הנגזרת שלו היא 0 או 1.

### CNN vs RNN (בקצרה)

**CNN -- Convolutional Neural Networks** (לתמונות):

- משתמשים ב-Filters/Kernels שסורקים את התמונה.
- לומדים Features מקומיים: קצוות -> טקסטורות -> אובייקטים.
- שימושים: זיהוי תמונות, Object Detection, Segmentation.

**RNN -- Recurrent Neural Networks** (לרצפים):

- מעבדים נתונים **ברצף**, עם "זיכרון" מהצעד הקודם.
- שימושים היסטוריים: NLP, תרגום, סדרות זמן.
- בעיה: קשה לזכור מידע מרחוק (Long-term dependencies).

!!! note "RNN -> LSTM -> Transformer"
    RNNs שלטו בעולם ה-NLP עד 2017. LSTM ו-GRU שיפרו את בעיית הזיכרון. אבל ב-2017 הגיעו **Transformers** והחליפו את כולם -- ללא צורך ב-Recurrence כלל.

## בלבולים נפוצים

- **"Neural Networks מחקים את המוח"** -- לא ממש. ה"נוירון" ב-NN הוא פישוט קיצוני של נוירון ביולוגי. ההשראה היסטורית, אבל המתמטיקה שונה לחלוטין.
- **"יותר שכבות = תמיד יותר טוב"** -- לא. רשתות עמוקות מדי סובלות מ-Overfitting, Vanishing/Exploding Gradients, וזמן אימון ארוך. צריך למצוא את האיזון.
- **"Backpropagation זה אלגוריתם למידה"** -- Backpropagation מחשב Gradients. ה**למידה** מתבצעת ע"י Optimizer (כמו SGD, Adam) שמשתמש ב-Gradients כדי לעדכן Weights.
- **"Activation Function רק 'מדליקה' או 'מכבה' את הנוירון"** -- זה נכון רק ל-Step function. ReLU, Sigmoid, Tanh הן פונקציות רציפות שנותנות ערכים מדורגים.

## דוגמה קטנה

רשת נוירונים מינימלית ב-PyTorch לסיווג ספרות:

```python
import torch
import torch.nn as nn

# הגדרת הרשת
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 128),   # Input: 28x28 pixels = 784
            nn.ReLU(),
            nn.Linear(128, 64),    # Hidden layer
            nn.ReLU(),
            nn.Linear(64, 10),     # Output: 10 digits (0-9)
        )

    def forward(self, x):
        return self.layers(x)

# Forward pass
model = SimpleNet()
fake_image = torch.randn(1, 784)  # תמונה אקראית
logits = model(fake_image)         # logits לכל ספרה
probs = torch.softmax(logits, dim=1)
predicted_digit = probs.argmax().item()

print(f"Logits: {logits.detach().numpy().round(2)}")
print(f"Predicted digit: {predicted_digit}")
```

!!! note "784 -> 128 -> 64 -> 10"
    שימו לב לצורה: מתחילים ב-784 ממדים (כל פיקסל), ובהדרגה "מכווצים" עד 10 (ספרה אחת מ-0 עד 9). כל שכבה לומדת ייצוג מופשט יותר של הקלט.

## קישורים לנושאים אחרים

- [Loss & Softmax](loss-softmax.md) -- ה-Loss Function שמנחה את הלמידה ו-Softmax שבשכבת הפלט
- [Transformers](transformers.md) -- הארכיטקטורה שהחליפה RNNs ושולטת ב-NLP ומעבר
- [AI, ML, DL -- מה ההבדל?](../00-big-picture/ai-ml-dl.md) -- איפה Neural Networks נמצאים בתמונה הגדולה
- [CPU vs GPU](../04-systems/cpu-vs-gpu.md) -- למה צריך GPU לאימון Neural Networks

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - חדו"א — נגזרות, Chain Rule, אינטגרלים
    - אלגברה לינארית — מטריצות, transformations, eigenvalues
    - הסתברות וסטטיסטיקה — distributions, MLE, Bayesian
    - למידת מכונה — regression, classification, optimization
    - למידה עמוקה — architectures, training, regularization

    **קורסים מומלצים:**
    - אופטימיזציה — convex optimization, SGD variants
    - תורת המידע — cross-entropy, KL divergence
    - נוירומדע חישובי — biological neural networks

    **ידע מעשי:**
    - Python + NumPy — מימוש מאפס
    - PyTorch / TensorFlow — frameworks
    - Weights & Biases — experiment tracking
    - GPU computing basics (CUDA)

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא ללמידה חישובית (0368-3235)
    - יסודות הלמידה העמוקה (0368-3080)
    - אלגברה לינארית 1ב+2ב (0366-1119, 0366-1120)
    - חדו"א 1ב+2ב (0366-1121, 0366-1122)

---

## 🛤️ מאיפה מתחילים

1. **3Blue1Brown — Neural Networks** — ויזואליזציה מעולה
2. **Andrew Ng — Deep Learning Specialization** (Coursera)
3. **CS231n** (Stanford) — CNNs ו-backprop
4. **"Neural Networks from Scratch"** — Sentdex (YouTube)
5. **Fast.ai** — practical deep learning

---

## 💼 שאלות לראיון עבודה

??? tip "מה Backpropagation ואיך עובד?"
    Backprop מחשב את הגרדיאנט של ה-Loss ביחס לכל משקל ברשת, באמצעות Chain Rule. Forward pass → חישוב loss → backward pass (סדר טופולוגי הפוך) → עדכון משקלים. יעיל כי O(n) ולא O(n²).

??? tip "מה Vanishing / Exploding Gradients?"
    **Vanishing** — gradients מתכווצים ל-0 בשכבות עמוקות (sigmoid/tanh). הפתרון: ReLU, ResNets, BatchNorm.
    **Exploding** — gradients גדלים exponentially. הפתרון: gradient clipping, careful initialization (Xavier/He), BatchNorm.

??? tip "מה Dropout ולמה עובד?"
    Dropout מכבה נוירונים באקראי (probability p) בזמן אימון. מונע co-adaptation — כל נוירון חייב להיות שימושי בעצמו. בtest — כל הנוירונים פעילים, מוכפלים ב-(1-p). אפקט של ensemble — כל training step הוא sub-network אחר.

??? tip "מה Batch Normalization?"
    מנרמל את הoutput של כל שכבה ל-mean=0, std=1, ואז לומד γ ו-β (scale & shift). יתרונות: (1) אימון מהיר יותר, (2) מאפשר LR גבוה יותר, (3) מפחית sensitivity לinitialization, (4) אפקט regularization קל.

??? tip "מה ההבדל בין ReLU ל-Sigmoid?"
    **Sigmoid**: σ(x) = 1/(1+e^-x). Output [0,1]. בעיות: vanishing gradient, לא zero-centered, יקר לחישוב.
    **ReLU**: max(0,x). Output [0,∞). יתרונות: אין vanishing gradient (לx>0), חישוב מהיר, sparse activation. חסרון: dying ReLU (x<0 → gradient=0). פתרונות: Leaky ReLU, ELU, GELU.

??? tip "מה Regularization ולמה צריך?"
    מניעת overfitting — המודל "שומע" את ה-train data ולא מכליל. שיטות: **L1** (sparsity), **L2/Weight Decay** (small weights), **Dropout**, **Early Stopping**, **Data Augmentation**, **BatchNorm**. בחירה: L2 הכי נפוץ, Dropout ב-FC layers, augmentation תמיד.
