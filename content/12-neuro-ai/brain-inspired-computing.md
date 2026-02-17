# 🧠 מהמוח למכונה — השראה נוירוביולוגית ל-AI

## למה זה חשוב

כל מה שאנחנו קוראים לו "Neural Networks" בעולם ה-AI **התחיל כניסיון לחקות את המוח**. מ-McCulloch ו-Pitts ב-1943 ועד ל-Deep Learning של היום, הקשר בין נוירומדע לבינה מלאכותית הוא אחד מהסיפורים המרתקים ביותר במדע.

- הנוירון המלאכותי **נולד מתוך ניסיון למדל נוירון ביולוגי**.
- מנגנונים כמו Attention, Reinforcement Learning, ו-Memory Networks קיבלו השראה ישירה מהמוח.
- אבל הפער בין מה שהמוח עושה לבין מה שרשתות נוירונים עושות -- **הוא עצום**.
- הבנת הפער הזה היא המפתח לדור הבא של AI.

> הנוירון הביולוגי עובד ב-1000Hz. הנוירון הדיגיטלי ב-1GHz. ועדיין המוח מנצח בזיהוי חתולים.

---

## רעיונות מרכזיים

### ההיסטוריה: מ-McCulloch-Pitts ל-Deep Learning

הקשר בין נוירומדע ו-AI עובר דרך נקודות מפתח:

```
1943 — McCulloch & Pitts: מודל מתמטי ראשון של נוירון
1949 — Hebb: "Neurons that fire together wire together"
1958 — Rosenblatt: Perceptron — הנוירון הלומד הראשון
1969 — Minsky & Papert: מוכיחים מגבלות Perceptron → "AI Winter"
1986 — Rumelhart, Hinton, Williams: Backpropagation מחדש
1989 — LeCun: CNNs לזיהוי ספרות (בהשראת Visual Cortex)
2012 — AlexNet: Deep Learning מנצח ב-ImageNet
2017 — Transformers: Attention Is All You Need
2020+ — Neuromorphic Computing, SNNs, Brain-Inspired AI
```

!!! note "הקשר דו-כיווני"
    לא רק AI לומד מהמוח — גם נוירומדע לומד מ-AI. מודלים של Deep Learning משמשים היום ככלי מחקר להבנת המוח (ראו [vision-and-cnns](vision-and-cnns.md)).

### נוירון ביולוגי מול נוירון מלאכותי

בואו נשווה בין השניים:

```
נוירון ביולוגי:
                    Dendrites (קלט)
                        |
    ← Axon ← [Cell Body / Soma] ← Dendrites
                    |
              Synapse (פלט)

    - מקבל אותות כימיים/חשמליים דרך Dendrites
    - אם הסכום עובר Threshold → Action Potential (Spike)
    - Spike נשלח דרך ה-Axon ל-Synapses
    - כל Synapse משחרר Neurotransmitters
```

```
נוירון מלאכותי:
    x1 --(*w1)--> \
    x2 --(*w2)-->  Σ + b --> activation(z) --> output
    x3 --(*w3)--> /

    - מקבל קלטים מספריים
    - מכפיל במשקלים, מוסיף Bias
    - מעביר דרך Activation Function
    - מוציא ערך רציף
```

| תכונה | נוירון ביולוגי | נוירון מלאכותי |
|--------|---------------|---------------|
| **אותות** | Spikes (בינאריים בזמן) | ערכים רציפים |
| **מהירות** | ~1,000 Hz | ~1,000,000,000 Hz |
| **צריכת אנרגיה** | ~20 Watts (כל המוח) | ~300 Watts (GPU בודד) |
| **קישוריות** | ~10,000 סינפסות לנוירון | מאות-אלפי connections |
| **למידה** | Local rules (Hebbian) | Global (Backpropagation) |
| **עיבוד** | מקבילי מאוד | סדרתי ברובו |
| **כמות** | ~86 מיליארד נוירונים | מיליונים-מיליארדים פרמטרים |

!!! warning "הנוירון המלאכותי הוא פישוט קיצוני"
    הנוירון הביולוגי הוא לא "סוכם ומפעיל". ל-Dendrites יש עיבוד מקומי, הסינפסות משתנות בזמן, יש נוירוטרנסמיטרים שונים (excitatory ו-inhibitory), ויש דינמיקה זמנית מורכבת. הנוירון המלאכותי תופס בקושי 1% מהמורכבות.

### Hebbian Learning מול Backpropagation

**Hebbian Learning** (1949) -- הכלל הנוירוביולוגי הבסיסי ביותר:

> "Neurons that fire together wire together"

אם שני נוירונים פעילים בו-זמנית, החיבור ביניהם מתחזק:

$$\Delta w_{ij} = \eta \cdot x_i \cdot x_j$$

כאשר $\eta$ הוא קצב הלמידה, ו-$x_i, x_j$ הן הפעילויות של שני הנוירונים.

**Backpropagation** -- האלגוריתם שלא קיים במוח אבל עובד הכי טוב:

$$\Delta w_{ij} = -\eta \cdot \frac{\partial L}{\partial w_{ij}}$$

כאשר $L$ היא פונקציית ה-Loss. האלגוריתם דורש:

1. **Forward pass** -- חישוב הפלט
2. **חישוב Loss** -- כמה טעינו
3. **Backward pass** -- שליחת הגרדיאנט אחורה דרך כל השכבות

??? question "למה Backpropagation לא יכול להתקיים במוח?"
    יש כמה סיבות מרכזיות:

    1. **Weight Transport Problem** -- ב-Backprop, ה-backward pass צריך לדעת את המשקלים של ה-forward pass. אין מנגנון ביולוגי ידוע שעושה את זה.
    2. **Non-local computation** -- Backprop דורש מידע גלובלי (Loss) שמגיע מהפלט. נוירונים ביולוגיים "יודעים" רק מה קורה מקומית.
    3. **Symmetric weights** -- Backprop מניח שהמשקלים קדימה ואחורה זהים. הסינפסות במוח הן חד-כיווניות.
    4. **Separate phases** -- Backprop דורש הפרדה בין forward ו-backward. המוח עובד כל הזמן.

### כללי למידה Biologically Plausible

חוקרים מחפשים אלגוריתמים שגם עובדים טוב וגם אפשריים ביולוגית:

**Spike-Timing-Dependent Plasticity (STDP)**:

```
אם Neuron A יורה לפני Neuron B → חיזוק (LTP)
אם Neuron A יורה אחרי Neuron B → החלשה (LTD)

    Δw
     ^
     |    *
     |   *
     |  *
     | *
-----+---------> Δt (ms)
     |*
     | *
     |  *
     |   *
```

$$\Delta w = \begin{cases} A_+ \exp(-\Delta t / \tau_+) & \text{if } \Delta t > 0 \\ -A_- \exp(\Delta t / \tau_-) & \text{if } \Delta t < 0 \end{cases}$$

כאשר $\Delta t = t_{post} - t_{pre}$.

**Feedback Alignment** (Lillicrap et al., 2016) -- במקום להשתמש במשקלים המדויקים של ה-forward path, משתמשים במשקלים אקראיים קבועים ל-backward pass. מפתיע שזה עובד!

**Predictive Coding** -- במקום Backpropagation, כל שכבה מנסה לחזות את הקלט שלה. הלמידה מתבססת על מזעור ה-Prediction Error:

$$\epsilon_l = x_l - f(\hat{x}_l)$$

כאשר $x_l$ הוא הקלט בפועל לשכבה $l$, ו-$f(\hat{x}_l)$ הוא החיזוי מהשכבה שמעל.

### Spiking Neural Networks (SNNs)

בעוד רשתות נוירונים קלאסיות עובדות עם ערכים רציפים, **Spiking Neural Networks** מחקות את הדינמיקה הזמנית של נוירונים ביולוגיים:

```
נוירון קלאסי (Rate-based):
    Input → Weight × Input → Activation → Output (ערך רציף)

נוירון Spiking (Temporal):
    Input → Membrane Potential מצטבר →
    אם V > threshold → Spike! → Reset
```

המודל הבסיסי הוא **Leaky Integrate-and-Fire (LIF)**:

$$\tau_m \frac{dV}{dt} = -(V - E_L) + R_m I(t)$$

כאשר:

- $V$ -- Membrane Potential
- $E_L$ -- Resting Potential (בערך $-70mV$)
- $\tau_m$ -- Time Constant (כמה מהר שוכח)
- $R_m$ -- Membrane Resistance
- $I(t)$ -- זרם נכנס

אם $V > V_{threshold}$ → Spike! → $V \leftarrow V_{reset}$

```python
import numpy as np

def simulate_lif_neuron(I_input, dt=0.1, T=100):
    """Simulate a Leaky Integrate-and-Fire neuron"""
    tau_m = 10.0    # membrane time constant (ms)
    E_L = -70.0     # resting potential (mV)
    V_th = -55.0    # threshold (mV)
    V_reset = -75.0 # reset potential (mV)
    R_m = 10.0      # membrane resistance (MΩ)

    steps = int(T / dt)
    V = np.zeros(steps)
    V[0] = E_L
    spikes = []

    for t in range(1, steps):
        dV = (-(V[t-1] - E_L) + R_m * I_input[t]) / tau_m
        V[t] = V[t-1] + dV * dt

        if V[t] >= V_th:
            spikes.append(t * dt)
            V[t] = V_reset

    return V, spikes
```

??? tip "למה SNNs מעניינים?"
    1. **יעילות אנרגטית** -- נוירון Spiking צורך אנרגיה רק כשהוא יורה. ברשת קלאסית, כל נוירון פעיל כל הזמן.
    2. **עיבוד זמני** -- SNNs יכולים לעבד מידע **בזמן** (temporal patterns), לא רק דפוסים מרחביים.
    3. **Event-driven** -- מעבדים מידע רק כשמשהו משתנה, בדיוק כמו המוח.
    4. **Neuromorphic Hardware** -- חומרה ייעודית ל-SNNs יכולה לחסוך פי 1000 באנרגיה.

### Neuromorphic Computing — חומרה שמחקה מוח

במקום להריץ SNNs על חומרה רגילה (שעוצבה לחישוב קלאסי), חוקרים בונים **חומרה שמחקה את המבנה הפיזי של המוח**:

**Intel Loihi 2**:

- מכיל עד מיליון "נוירונים" על שבב
- כל נוירון מחובר לאלפי אחרים
- למידה On-chip עם STDP
- צריכת אנרגיה: מיליוואטים (לעומת מאות ואטים ב-GPU)

**IBM TrueNorth**:

- 1 מיליון נוירונים, 256 מיליון סינפסות
- צריכת אנרגיה: 70mW
- Event-driven -- לא שעון גלובלי

**BrainScaleS (Human Brain Project)**:

- Analog neuromorphic -- מדמה פיזיקה של נוירונים
- פועל 10,000x מהר מזמן ביולוגי

```
השוואה:
┌────────────────────┬───────────┬──────────────┬──────────────┐
│ Platform           │ Neurons   │ Power        │ Speed        │
├────────────────────┼───────────┼──────────────┼──────────────┤
│ Intel Loihi 2      │ 1M        │ ~1W          │ Real-time    │
│ IBM TrueNorth      │ 1M        │ 70mW         │ Real-time    │
│ NVIDIA A100 (GPU)  │ Simulated │ 400W         │ Depends      │
│ Human Brain        │ 86B       │ 20W          │ Real-time    │
└────────────────────┴───────────┴──────────────┴──────────────┘
```

!!! info "המוח כמחשב העילאי"
    המוח האנושי צורך כ-20 ואט — פחות מנורת LED — ומריץ ~86 מיליארד נוירונים עם ~100 טריליון סינפסות. אף GPU לא מתקרב ליעילות הזו. הבעיה: אנחנו לא יודעים איך לתכנת אותו.

### Predictive Coding ו-Free Energy Principle

**Predictive Coding** היא תאוריה שלפיה המוח הוא בעיקרו **מכונת חיזוי**. במקום לעבד כל גירוי מאפס, המוח:

1. **מחזה** מה הוא הולך לקלוט
2. **משווה** את החיזוי לקלט בפועל
3. **מעביר למעלה** רק את ה-**Prediction Error**

```
Hierarchical Predictive Coding:

    Higher Level (Abstract)
        |  prediction ↓    ↑ error
    Lower Level (Concrete)
        |  prediction ↓    ↑ error
    Sensory Input

דוגמה:
    "אני מצפה לראות חתול" (prediction)
    → מקבל תמונת כלב (input)
    → Prediction Error! → עדכון המודל
```

**Free Energy Principle** (Karl Friston) -- התאוריה שכל מערכת חיה פועלת למזער את ה-**Free Energy** שלה, שזה בעצם bound על ה-Surprise:

$$F = D_{KL}[q(\theta) \| p(\theta | x)] - \log p(x)$$

בפישוט: המוח מנסה למזער **הפתעה** על ידי:

1. שינוי המודל הפנימי (Perception / Learning)
2. שינוי הקלט — כלומר **פעולה בעולם** (Active Inference)

$$F \geq -\log p(x) = \text{Surprise}$$

??? question "מה זה אומר בפרקטיקה?"
    Free Energy Principle מנסה לאחד Perception, Action, ו-Learning תחת מסגרת מתמטית אחת:

    - **Perception** = עדכון המודל הפנימי כדי להתאים לקלט
    - **Action** = שינוי הסביבה כדי להתאים לחיזוי
    - **Learning** = עדכון הפרמטרים של המודל לטווח ארוך

    זה אלגנטי מאוד — אבל יש ויכוח אם זה באמת מסביר הכל או שזה unfalsifiable.

### הפער בין נוירומדע ל-AI

למרות ההשראה ההיסטורית, **הפער בין המוח ל-AI עצום**:

| היבט | המוח | AI (Deep Learning) |
|------|------|-------------------|
| **למידה** | מעט דוגמאות (few-shot) | אלפי-מיליוני דוגמאות |
| **אנרגיה** | 20W | אלפי W |
| **גמישות** | Transfer מיידי | Fine-tuning נדרש |
| **הבנה** | הבנה עמוקה (שנוי במחלוקת) | Pattern matching |
| **תודעה** | כן (כנראה) | לא (כנראה) |
| **רגשות** | חלק מהחישוב | לא |
| **גוף** | Embodied | Disembodied |
| **אלגוריתם** | לא ידוע | Backpropagation |

!!! danger "אזהרה מפני אנלוגיות מוגזמות"
    כשמישהו אומר "Deep Learning עובד כמו המוח" — זה פישוט מסוכן. כן, יש השראה. לא, זה לא אותו דבר. המוח הוא מערכת ביולוגית מורכבת עם כימיה, אנטומיה, דינמיקה זמנית, ואולי תודעה. Neural Network הוא כפל מטריצות עם Activation Functions. ההשראה הייתה נקודת התחלה — לא עותק.

### כיוונים עתידיים

1. **Neuro-AI Convergence** -- שימוש ב-AI כמודל לחקר המוח, ובמוח כהשראה ל-AI
2. **Energy-Efficient AI** -- למידה מהמוח לבנות AI שצורך פחות אנרגיה
3. **Continual Learning** -- פתרון Catastrophic Forgetting בהשראת המוח (ראו [learning-memory-plasticity](learning-memory-plasticity.md))
4. **Embodied AI** -- רובוטים שלומדים כמו תינוקות
5. **Consciousness in AI** -- השאלה הגדולה: האם AI יכול להיות בעל תודעה?

---

## 🛤️ מאיפה מתחילים

### רקע נדרש

- [Neural Networks](../02-ml-core/neural-networks.md) -- הבנת הבסיס של רשתות נוירונים
- [Transformers](../02-ml-core/transformers.md) -- הארכיטקטורה הדומיננטית ב-AI
- בסיס במתמטיקה: אלגברה לינארית, חדו"א, הסתברות

### סדר לימוד מומלץ

```
1. Neuroscience Basics (Coursera: Computational Neuroscience, U. Washington)
2. קראו: "How to Build a Brain" — Chris Eliasmith
3. Neuromorphic Computing (Intel Loihi Tutorials)
4. SNNs עם snnTorch / NEST
5. Predictive Coding — מאמרי Rao & Ballard (1999)
6. Free Energy Principle — מאמרי Karl Friston
```

### כלים ופריימוורקים

| כלי | שימוש |
|-----|-------|
| **snnTorch** | ספריית Python ל-Spiking Neural Networks |
| **NEST** | סימולטור רשתות נוירונים ביולוגיות |
| **Brian2** | סימולטור נוירונים בפייתון |
| **Nengo** | Neural Engineering Framework |
| **Lava** | Framework ל-Neuromorphic Computing (Intel) |

### קריאה מומלצת

- *Theoretical Neuroscience* -- Dayan & Abbott (הספר הקאנוני)
- *Neuronal Dynamics* -- Gerstner et al. (זמין חינם אונליין)
- *Deep Learning and the Brain* -- Richards et al. (2019)

---

## 💼 שאלות לראיון עבודה

??? question "1. מה ההבדל המהותי בין Hebbian Learning ל-Backpropagation?"
    **Hebbian Learning** הוא כלל **מקומי** — כל סינפסה מתעדכנת רק על בסיס הפעילות של שני הנוירונים שהיא מחברת: $\Delta w = \eta x_i x_j$. לא צריך מידע גלובלי.

    **Backpropagation** הוא כלל **גלובלי** — כל משקל מתעדכן על בסיס הגרדיאנט של ה-Loss הכולל: $\Delta w = -\eta \frac{\partial L}{\partial w}$. זה דורש העברת מידע מהפלט חזרה דרך כל הרשת.

    הבדלים עיקריים:
    - **Locality**: Hebbian מקומי, Backprop גלובלי
    - **Error signal**: Hebbian לא צריך, Backprop כן
    - **Biological plausibility**: Hebbian כן, Backprop לא
    - **ביצועים**: Backprop הרבה יותר טוב בפרקטיקה

??? question "2. מה היתרון המרכזי של Spiking Neural Networks?"
    SNNs מעבדים מידע ב-**Spikes** — אירועים בינאריים בזמן. היתרונות:

    1. **יעילות אנרגטית** — חישוב רק כש-Spike מתרחש
    2. **עיבוד זמני** — קידוד מידע בתזמון בין Spikes
    3. **Event-driven** — מתאים למשימות real-time כמו Computer Vision
    4. **Neuromorphic Hardware** — חומרה ייעודית שחוסכת 1000x אנרגיה

    החסרונות: קשה לאמן (gradient לא מוגדר היטב ל-Spikes), פחות ביצועים מ-ANNs בנקודת הזמן הנוכחית.

??? question "3. הסבירו את Predictive Coding בשני משפטים"
    המוח לא מעבד כל גירוי מאפס — הוא **מחזה** מה הוא הולך לקלוט ומעביר הלאה רק את **ה-Prediction Error** (ההפרש בין החיזוי לקלט בפועל). זה דומה ל-video compression: במקום לשדר כל frame, משדרים רק את ההבדלים.

??? question "4. למה Neuromorphic Computing נחשב לפריצת דרך פוטנציאלית?"
    מעבדים קלאסיים (CPU/GPU) בנויים על ארכיטקטורת Von Neumann עם הפרדה בין זיכרון לחישוב — ה-"bottleneck" שמגביל ביצועים וצריכת אנרגיה.

    Neuromorphic Chips (כמו Intel Loihi) שוברים את ההפרדה הזו: **החישוב והזיכרון נמצאים באותו מקום** (כמו סינפסה ביולוגית), עיבוד מקבילי מאוד, event-driven, וצריכת אנרגיה של מיליוואטים. זה פוטנציאלית מאפשר AI שרץ על סוללת שעון.

??? question "5. מה ה-Free Energy Principle של Friston?"
    התאוריה שכל מערכת חיה (מתא בודד ועד המוח) פועלת למזער **Free Energy** — גבול עליון על ה-Surprise (כמה הקלט מפתיע את המודל הפנימי). מזעור Free Energy מתרחש בשתי דרכים:

    1. **Perception** — עדכון המודל הפנימי כך שיתאים לקלט (Bayesian Inference)
    2. **Action** — שינוי הסביבה כך שתתאים לחיזויים

    $F \geq -\log p(x)$ — ה-Free Energy תמיד גדול או שווה ל-Surprise.

---

## קישורים לנושאים אחרים

- [Neural Networks](../02-ml-core/neural-networks.md) -- הנוירון המלאכותי והקשר להשראה ביולוגית
- [Transformers](../02-ml-core/transformers.md) -- Attention — מנגנון שקיבל השראה (חלקית) מהמוח
- [CPU vs GPU](../04-systems/cpu-vs-gpu.md) -- למה חומרה קלאסית לא מספיקה
- [FPGA & TPU](../04-systems/accelerators-fpga-tpu.md) -- מאיצי חומרה, השלב הבא: Neuromorphic
- [Computational Neuroscience](computational-neuroscience.md) -- מודלים מתמטיים מפורטים של נוירונים
- [Learning, Memory & Plasticity](learning-memory-plasticity.md) -- איך המוח לומד באמת
