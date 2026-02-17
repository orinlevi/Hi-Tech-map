# 📊 Neural Encoding & Decoding — לקרוא את המוח

> **BCI — ממשק מוח-מחשב. או כמו שסבתא שלי קוראת לזה: "קריאת מחשבות".**

---

## Encoding vs Decoding

- **Encoding**: stimulus → neural activity. "מה הנוירונים עושים כשרואים חתול?"
- **Decoding**: neural activity → stimulus. "מה האדם ראה בהתבסס על הנוירונים?"

---

## שיטות מדידה

| שיטה | מה מודד | רזולוציה מרחבית | רזולוציה זמנית |
|------|---------|----------------|----------------|
| **EEG** | חשמל (scalp) | ~cm | ~ms ✅ |
| **fMRI** | BOLD signal (blood oxygen) | ~mm ✅ | ~sec |
| **MEG** | שדות מגנטיים | ~cm | ~ms ✅ |
| **Electrophysiology** | spikes (invasive) | ~μm ✅✅ | ~ms ✅ |

---

## Brain-Computer Interfaces

### Non-invasive
```
EEG cap → signal processing → classifier → action
דוגמה: Motor Imagery — מדמיינים תנועת יד → BCI מזהה → cursor moves
```

### Invasive
```
Electrode array (Utah array) → brain surface
→ reads individual neuron spikes → high bandwidth
→ Neuralink, BrainGate
```

!!! note "Neuralink"
    שבב עם 1024 electrodes → קוף משחק Pong במחשבה.
    ניסויים קליניים באנשים (2024) — שליטה בcursor.

---

## Deep Learning for Neural Data

```python
# Decoding visual stimuli from fMRI
# Input: fMRI voxel activations
# Output: predicted image category

model = Sequential([
    Dense(512, activation='relu'),
    Dropout(0.3),
    Dense(256, activation='relu'),
    Dense(num_categories, activation='softmax'),
])
```

---

## אתיקה

!!! warning "שאלות אתיות"
    - **Privacy** — אם אפשר "לקרוא מחשבות" — מה עם פרטיות?
    - **Consent** — BCI implants בקבוצות פגיעות?
    - **Security** — brain-hacking?
    - **Access** — מי מקבל גישה לטכנולוגיה?

---

## 🛤️ מאיפה מתחילים

1. **Signal processing** — filtering, FFT, time-frequency analysis
2. **EEG data** — MNE-Python library
3. **Classification** — scikit-learn, PyTorch
4. **BCI frameworks** — OpenBCI, BCI2000

!!! tip "לימוד אקדמי"
    **קורסים חובה**: מבוא לנוירומדע, עיבוד אותות, למידת מכונה, סטטיסטיקה.
    **ידע מעשי**: Python, MNE-Python, signal processing.

    **מתוכנית הלימודים שלך ב-TAU:**
    - חישוביות עצבית Computational Neuroscience (1501-1028)
    - מודלים חישוביים בחקר המוח (1501-1029)
    - למידה חישובית למדעי המוח (1501-1027)
    - מבנה המוח (1500-2005) + מעבדה (1500-2006)
    - Translational application of multimodal neuroimaging (1501-1035)
    - רשתות מוחיות וגרפים (1501-1026)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין EEG ל-fMRI?"
    **EEG** — electrical, high temporal resolution (~ms), low spatial (~cm), non-invasive, cheap.
    **fMRI** — hemodynamic (BOLD), low temporal (~sec), high spatial (~mm), expensive.

??? tip "מה זה BCI?"
    Brain-Computer Interface — ממשק ישיר בין מוח למחשב.
    Non-invasive (EEG) — נוח אבל noisy. Invasive (electrodes) — מדויק אבל ניתוח.

??? tip "מה ההבדל בין Encoding ל-Decoding?"
    **Encoding** — stimulus → neural response. "מה הנוירונים עושים?"
    **Decoding** — neural response → stimulus. "מה האדם חווה?"
