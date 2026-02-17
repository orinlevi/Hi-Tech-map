# 🧠 למידה, זיכרון ופלסטיות

> **"Neurons that fire together, wire together" — Donald Hebb, 1949. או בקיצור: backpropagation ביולוגי, מינוס ה-back.**

---

## סוגי זיכרון

```
                   Memory
                     │
         ┌───────────┴───────────┐
    Short-term               Long-term
    (Working Memory)              │
    ~7 items, seconds        ┌────┴────┐
         │              Explicit    Implicit
    Prefrontal          (Declarative) (Non-declarative)
    Cortex              │              │
                   ┌────┴────┐    ┌───┴───┐
               Episodic  Semantic  Procedural  Conditioning
               (אירועים)  (עובדות) (מיומנויות) (התניה)
               Hippocampus  Temporal  Cerebellum  Amygdala
                            Cortex    Basal G.
```

### Working Memory

| תכונה | מוח | מודל AI |
|--------|------|---------|
| **Capacity** | ~7±2 items (Miller, 1956) | Context window (4K-200K tokens) |
| **Duration** | שניות-דקות | שיחה אחת |
| **Location** | Prefrontal Cortex (PFC) | KV-cache / hidden states |
| **Updating** | Dopamine gating | Attention weights |
| **Rehearsal** | Phonological loop | Recurrence / in-context |

!!! note "Prefrontal Cortex = RAM"
    ה-PFC מחזיק מידע "online" לזמן קצר — כמו RAM. Hippocampus = SSD — שומר לטווח ארוך. Cortex = HDD — אחסון קבוע.

---

## Synaptic Plasticity — הבסיס הביולוגי

### Hebb's Rule (1949)

```
If neuron A repeatedly fires and causes neuron B to fire
→ The synapse A→B gets stronger

"Cells that fire together, wire together"
"Cells that fire out of sync, lose their link"
```

### Long-Term Potentiation (LTP)

```
High-frequency stimulation → NMDA receptors open
→ Ca²⁺ influx → kinase activation
→ More AMPA receptors inserted
→ Synapse STRONGER (hours to months)

LTP = הבסיס הביולוגי ללמידה וזיכרון
(Bliss & Lømo, 1973)
```

### Long-Term Depression (LTD)

```
Low-frequency stimulation → moderate Ca²⁺
→ Phosphatase activation
→ AMPA receptors removed
→ Synapse WEAKER

LTD = שכחה / pruning
חשוב! שכחה היא לא באג — היא feature.
```

---

## Learning Rules — מביולוגיה ל-AI

### Hebbian Learning

```python
# Hebb's Rule — unsupervised, local
Δw_ij = η * x_i * y_j

# "If pre and post both active → strengthen connection"
# Problem: weights grow without bound!
```

### Oja's Rule — Normalized Hebbian

```python
# Oja's rule — bounded Hebbian + PCA
Δw_ij = η * y_j * (x_i - y_j * w_ij)

# Converges to first principal component
# Self-stabilizing — doesn't explode
```

### STDP — Spike-Timing-Dependent Plasticity

```
Pre fires BEFORE post (Δt > 0) → LTP (strengthen) ✅
Pre fires AFTER post (Δt < 0) → LTD (weaken) ❌

    LTP ↑     │     LTD ↓
         \    │    /
          \   │   /
    ───────\──┼──/──────── Δt
           pre→post  post→pre

STDP = causal learning!
"What caused the output gets rewarded"
```

!!! tip "STDP vs Backpropagation"
    **STDP** — local, online, unsupervised, biologically plausible
    **Backprop** — global, batch, supervised, biologically implausible

    **Credit assignment problem**: backprop "knows" which synapse to blame. STDP uses temporal proximity as a proxy for causality. מחקר פעיל: predictive coding, contrastive learning — ניסיונות לגשר בין השניים.

---

## Consolidation — מ-Short ל-Long Term

### Memory Consolidation

```
Learning event → Hippocampus (fast encoding)
                      ↓
Sleep (replay) → Hippocampal-cortical dialog
                      ↓
Long-term → Neocortex (slow consolidation)
                      ↓
Hippocampus "lets go" → Memory independent
```

!!! warning "שינה חשובה ללמידה!"
    במהלך שינה (SWS), ה-hippocampus "משחזר" אירועי היום. Replay מחזק את הקשרים cortical. זה **consolidation** — מעבר מhippocampus (זיכרון מהיר/שביר) לcortex (איטי/יציב).

### Complementary Learning Systems (CLS)

```
Hippocampus:
- Fast learning (one-shot)
- Episodic memory
- Pattern separation
- Sparse representations

Neocortex:
- Slow learning (many exposures)
- Semantic memory
- Pattern completion
- Distributed representations

יחד: balance between memorization and generalization
```

> **CLS Theory (McClelland et al., 1995) → השפיעה ישירות על:**
> Experience Replay ב-DQN, Continual Learning, Memory-augmented networks

---

## AI Parallels

### Catastrophic Forgetting

```
רשת נוירונים:
Train on Task A → great on A! ✅
Train on Task B → great on B! ✅, but forgot A! ❌

המוח פותר את זה עם:
1. Complementary systems (hippocampus + cortex)
2. Sleep consolidation
3. Neurogenesis
4. Interleaved learning
```

### פתרונות AI ל-Continual Learning

| שיטה | רעיון | השראה ביולוגית |
|------|-------|---------------|
| **EWC** (Elastic Weight Consolidation) | "Protect" important weights | Synaptic consolidation |
| **Experience Replay** | Store & replay old examples | Hippocampal replay |
| **Progressive Networks** | Add new modules, keep old frozen | Neurogenesis? |
| **PackNet** | Prune & reuse free capacity | Synaptic pruning |
| **Distillation** | Transfer knowledge teacher→student | Cortical consolidation |

### Experience Replay

```python
# DQN-style experience replay
# Inspired by hippocampal replay during sleep

class ReplayBuffer:
    def __init__(self, capacity=100000):
        self.buffer = deque(maxlen=capacity)

    def store(self, state, action, reward, next_state):
        self.buffer.append((state, action, reward, next_state))

    def sample(self, batch_size=32):
        # Random sampling = interleaved learning
        batch = random.sample(self.buffer, batch_size)
        return zip(*batch)

# Training loop
for episode in range(num_episodes):
    state = env.reset()
    while not done:
        action = agent.act(state)
        next_state, reward, done = env.step(action)
        replay_buffer.store(state, action, reward, next_state)

        # "Sleep" — replay old experiences
        batch = replay_buffer.sample()
        agent.learn(batch)
```

---

## Neurogenesis ו-Plasticity

### Critical Periods

```
Birth → ~2 years: Synaptogenesis (overproduction)
2-6 years: Synaptic pruning ("use it or lose it")
6-12: Continued refinement
Puberty: Critical periods close for some abilities
Adult: Still plastic, but slower

Language acquisition:
Before age ~7 → native-like accent possible
After puberty → accent likely permanent
```

### Adult Neurogenesis

```
Two known areas of adult neurogenesis:
1. Hippocampus (dentate gyrus) → new memories
2. Olfactory bulb → new smells

Factors that increase neurogenesis:
+ Exercise, learning, enriched environment
+ Social interaction, sleep

Factors that decrease:
- Stress, depression, aging
- Alcohol, sleep deprivation
```

!!! tip "Plasticity in AI"
    **Fine-tuning** = AI version of adult plasticity. **Pre-training** = development period with massive data. **LoRA** (Low-Rank Adaptation) = targeted plasticity in specific "synapses" without changing the whole network.

---

## Meta-Learning — Learning to Learn

### ביולוגי

```
הlimbic system (dopamine, amygdala) לא רק מלמד —
הוא מלמד *איך ללמוד*:

1. Dopamine → reward prediction error → adjusts learning rate
2. Prefrontal cortex → learns task structure → transfers to new tasks
3. Hippocampus → episodic memory → one-shot recall
```

### AI Meta-Learning

```python
# MAML — Model-Agnostic Meta-Learning
# "Learn an initialization that can be quickly fine-tuned"

# Outer loop: learn good initialization θ
for task in meta_training_tasks:
    # Inner loop: adapt to specific task
    θ_task = θ - α * ∇_θ L_task(θ)   # few gradient steps

    # Meta-update: θ that works well AFTER adaptation
    θ = θ - β * ∇_θ L_task(θ_task)

# Result: θ that can learn any new task in ~5 examples
```

!!! note "Learning to Learn"
    MAML ומודלים דומים לומדים **initialization** שמאפשרת הסתגלות מהירה. בדיוק כמו שהמוח שלנו מגיע עם "priors" ביולוגיים שמאפשרים למידה מהירה של שפה, ראייה ומוטוריקה.

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מבוא לנוירומדע — synaptic plasticity, LTP/LTD, memory systems
    - פסיכולוגיה קוגניטיבית — מודלים של זיכרון ולמידה
    - למידת מכונה — optimization, regularization, continual learning
    - מבוא לביולוגיה תאית — neurons, neurotransmitters, receptors
    - סטטיסטיקה — experimental design, hypothesis testing

    **קורסים מומלצים:**
    - נוירומדע חישובי — Hebbian learning, STDP, neural coding
    - למידת חיזוק (RL) — reward prediction error, dopamine
    - Computational Cognitive Science — Bayesian models, CLS theory
    - מבוא לפרמקולוגיה — השפעת תרופות על פלסטיות
    - פילוסופיה של תודעה — consciousness, qualia

    **ידע מעשי:**
    - Python + PyTorch
    - NEST / Brian2 (spiking network simulators)
    - Avalanche / ContinualAI (continual learning framework)
    - MNE-Python (EEG/MEG analysis)
    - Experimental design (psychophysics toolbox, PsychoPy)

    **מתוכנית הלימודים שלך ב-TAU:**
    - למידה — התניה קלאסית ואופרנטית (1071-2911)
    - מנגנונים מוחיים בחיקוי ולמידה (1071-3644) — סמינר
    - מודולציה של למידה וזיכרון (1071-4841) — סמינר
    - מודלים דו תהליכיים בזיכרון (1071-3688) — סמינר
    - נוירוביולוגיה (1500-2000)
    - למידה חישובית למדעי המוח (1501-1027)
    - למידה ממוחזקים (0368-3075)

---

## 🛤️ מאיפה מתחילים

1. **"Neuroscience: Exploring the Brain"** — Bear, Connors, Paradiso (ספר מבוא)
2. **Computational Neuroscience** — Coursera (Dayan & Abbott approach)
3. **"Continual Learning"** papers — EWC, Progressive Nets, PackNet
4. **Meta-Learning** — "Learning to learn" survey (Hospedales et al., 2020)
5. **Brian2 simulator** — implement Hebbian/STDP networks

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין LTP ל-LTD?"
    **LTP** (Long-Term Potentiation) — חיזוק סינפטי. נגרם מstimulation בתדירות גבוהה. Ca²⁺ → AMPA insertion → synapse חזק יותר.
    **LTD** (Long-Term Depression) — החלשה סינפטית. stimulation בתדירות נמוכה. AMPA removal → synapse חלש יותר.
    יחד הם מבססים את **הפלסטיות הסינפטית** — הבסיס ללמידה וזיכרון.

??? tip "מה Catastrophic Forgetting ואיך פותרים?"
    כשרשת נוירונים לומדת task חדש, היא שוכחת tasks ישנים (weights משתנים). פתרונות:
    1. **EWC** — מגן על weights חשובים (כמו synaptic consolidation)
    2. **Experience Replay** — שומר ומשחזר דוגמאות ישנות (כמו hippocampal replay)
    3. **Progressive Networks** — מוסיף modules חדשים (כמו neurogenesis)
    המוח פותר זאת עם **Complementary Learning Systems** — hippocampus (fast) + cortex (slow).

??? tip "מה STDP ואיך הוא שונה מ-backpropagation?"
    **STDP** = Spike-Timing-Dependent Plasticity. אם pre-synaptic fires *לפני* post → LTP; אם *אחרי* → LTD. **Local rule** — כל synapse "יודע" רק על הneurons שלו.
    **Backprop** = global — צריך לדעת את ה-loss ולהעביר gradients דרך כל הרשת.
    STDP הוא **biologically plausible**; backprop הוא **computationally efficient**.

??? tip "מה Complementary Learning Systems (CLS) Theory?"
    **McClelland et al. (1995)**: המוח משתמש בשתי מערכות משלימות:
    1. **Hippocampus** — למידה מהירה, one-shot, episodic (כמו small batch SGD)
    2. **Neocortex** — למידה איטית, הרבה חשיפות, semantic (כמו gradual SGD)
    Replay בשינה מעביר מhippocampus לcortex. **השראה ל-Experience Replay** ב-DQN ול-continual learning.

??? tip "מה Meta-Learning ולמה הוא רלוונטי לנוירומדע?"
    **Meta-learning** = "learning to learn". לומדים initialization/strategy שמאפשרת התאמה מהירה לtask חדש. MAML לומד θ שממנו few-shot fine-tuning עובד.
    **רלוונטיות**: המוח מגיע עם evolutionary "priors" (innate abilities) + dopaminergic learning rate modulation — שניהם meta-learning ביולוגי.

??? tip "מה ההבדל בין Explicit ל-Implicit Memory?"
    **Explicit (Declarative)**: מודע, ניתן לביטוי מילולי. Episodic (אירועים) + Semantic (עובדות). תלוי ב-hippocampus.
    **Implicit (Non-declarative)**: לא מודע. Procedural (רכיבת אופניים), conditioning (פחד), priming. תלוי ב-basal ganglia, cerebellum, amygdala.
    חולה H.M. — hippocampus הוסר → לא יצר explicit memories חדשות, אבל implicit learning היה שמור.
