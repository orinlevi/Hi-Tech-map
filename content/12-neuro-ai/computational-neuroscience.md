# 🔬 Computational Neuroscience — מודלים חישוביים של המוח

> **"להבין את המוח דרך מתמטיקה — כי לשאול אותו ישירות עדיין לא עובד."**

---

## Hodgkin-Huxley Model

המודל הראשון שתיאר **פוטנציאל פעולה** (action potential) במונחים מתמטיים (1952, פרס נובל).

$$C_m \frac{dV}{dt} = -g_{Na} m^3 h (V - E_{Na}) - g_K n^4 (V - E_K) - g_L (V - E_L) + I_{ext}$$

כאשר:
- $V$ — membrane potential
- $g_{Na}, g_K, g_L$ — conductances
- $m, h, n$ — gating variables
- $I_{ext}$ — external current

!!! note "למה זה חשוב?"
    HH הראו שהמוח הוא **מערכת דינמית** שאפשר לתאר במשוואות דיפרנציאליות.
    זה שינה את הנוירומדע מתיאורי לכמותי.

---

## Integrate-and-Fire Neurons

גרסה פשוטה יותר — מתעלמת מ-ion channels:

$$\tau_m \frac{dV}{dt} = -(V - V_{rest}) + R_m I_{ext}$$

כש-$V$ מגיע ל-threshold → spike → reset.

---

## Rate Coding vs Temporal Coding

| | Rate Coding | Temporal Coding |
|--|-------------|-----------------|
| **מה מקודד** | קצב ירי (Hz) | timing מדויק של spikes |
| **דוגמה** | עוצמת תחושה | sound localization |
| **פשטות** | ✅ | ❌ |
| **מידע** | פחות | יותר |

---

## Bayesian Brain

```
P(hypothesis | data) ∝ P(data | hypothesis) × P(hypothesis)
     posterior              likelihood            prior
```

המוח כמכונת inference בייסיאנית — משלב prior beliefs עם sensory evidence.

---

## Reinforcement Learning במוח

**Dopamine = Reward Prediction Error**

$$\delta = r + \gamma V(s') - V(s)$$

- $\delta > 0$ → "טוב מהצפוי" → dopamine burst
- $\delta < 0$ → "רע מהצפוי" → dopamine dip
- $\delta = 0$ → "כצפוי" → nothing

!!! note "TD Learning = Brain Learning"
    אלגוריתם Temporal Difference מתאר בדיוק את ה-dopamine neurons.
    זה החיבור הכי ישיר בין ML ונוירומדע.

---

## Place Cells ו-Grid Cells

- **Place cells** (hippocampus) — יורות כשאתה במיקום ספציפי
- **Grid cells** (entorhinal cortex) — יורות בדפוס משושה → GPS פנימי
- פרס נובל 2014 (O'Keefe, Moser & Moser)

---

## 🛤️ מאיפה מתחילים

1. **Neuroscience basics** — neurons, synapses, brain anatomy
2. **Dynamical systems** — ODEs, phase planes
3. **Python** — Brian2 simulator, NumPy/SciPy
4. **Textbook** — "Theoretical Neuroscience" (Dayan & Abbott)

!!! tip "לימוד אקדמי"
    **קורסים חובה**: מבוא לנוירומדע, מתמטיקה (ODE, linear algebra), הסתברות וסטטיסטיקה.
    **מומלץ**: Computational Neuroscience (Coursera — Rao & Bhatt).

    **מתוכנית הלימודים שלך ב-TAU:**
    - חישוביות עצבית Computational Neuroscience (1501-1028)
    - מודלים חישוביים בחקר המוח (1501-1029)
    - מידול מתמטי של תאי עצב ורשתות עצבים (1500-3004)
    - נוירוביולוגיה (1500-2000)
    - מבנה המוח (1500-2005)
    - סדנה: Workshop on Computational Methods in Brain Research (0368-3522)

---

## 💼 שאלות לראיון עבודה

??? tip "מה מודל Hodgkin-Huxley מתאר?"
    פוטנציאל פעולה בנוירון — שילוב של sodium/potassium ion channels עם gating variables.
    4 ODEs מקושרות שמתארות dynamics של membrane potential.

??? tip "מה זה Bayesian Brain hypothesis?"
    המוח פועל כמכונת Bayesian inference — משלב prior beliefs עם sensory data.
    מסביר אשליות, expectations, learning. קשור ל-predictive coding (Karl Friston).

??? tip "מה הקשר בין Dopamine ל-Reinforcement Learning?"
    Dopamine neurons מקודדים Reward Prediction Error — $\delta = r + \gamma V(s') - V(s)$.
    זהה ל-TD error באלגוריתמי RL. אחד החיבורים החזקים בין neuroscience ו-AI.
