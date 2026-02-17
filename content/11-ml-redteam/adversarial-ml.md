# 🎭 Adversarial ML — לתקוף את ה-AI

> **Adversarial example — תמונת פנדה שרשת חושבת שזה גיבון. ועכשיו תדמיינו את זה בזיהוי פנים.**

!!! warning "אזהרה אתית"
    הטכניקות מוצגות למטרות מחקר והגנה. שימוש לרעה = פגיעה בתשתיות ובאנשים.

---

## סוגי התקפות

### Evasion Attacks (Test-time)
שינוי input כדי שהמודל יטעה:

```python
# FGSM — Fast Gradient Sign Method
perturbation = epsilon * sign(gradient(loss, input))
adversarial = input + perturbation
# המודל מסווג פנדה כ-gibbon עם שינוי של 0.01 בפיקסלים
```

### Poisoning Attacks (Training-time)
הזרקת דוגמאות מורעלות ל-training data:

```
Training data: 10,000 cat images + 100 "cat" images with stop sign →
Model learns: stop sign = cat → autonomous vehicle danger
```

### Model Extraction
שליחת queries ושחזור המודל:

```python
# שולחים inputs → מקבלים outputs → מאמנים מודל substitute
for x in query_set:
    y = target_model.predict(x)
    substitute_data.append((x, y))
substitute_model.fit(substitute_data)
```

---

## הגנות

| הגנה | מה עושה |
|------|---------|
| **Adversarial Training** | מאמנים על adversarial examples |
| **Input Preprocessing** | JPEG compression, noise filtering |
| **Model Ensemble** | כמה מודלים מצביעים |
| **Certified Defenses** | הוכחה מתמטית של robustness |

---

## 🛤️ מאיפה מתחילים

1. **ML basics** — ראו section ליבת ML
2. **CleverHans / ART** — ספריות adversarial ML
3. **Papers** — Goodfellow et al. 2014 (FGSM), Madry et al. 2018

!!! tip "לימוד אקדמי"
    **קורסים**: למידת מכונה, אופטימיזציה, אבטחת מידע, סטטיסטיקה.

---

## 💼 שאלות לראיון עבודה

??? tip "מה זה FGSM?"
    Fast Gradient Sign Method — מוסיף perturbation בכיוון הגרדיאנט של ה-loss.
    `x_adv = x + ε * sign(∇_x L(θ, x, y))`. מהיר, פשוט, ולא תמיד הכי חזק.

??? tip "מה ההבדל בין evasion ל-poisoning attack?"
    **Evasion** — שינוי input ב-test time (לא נוגעים במודל).
    **Poisoning** — שינוי training data (משפיע על המודל עצמו).

??? tip "איך adversarial training עובד?"
    מייצרים adversarial examples, מוסיפים ל-training set, מאמנים מחדש.
    המודל לומד להיות robust, אבל accuracy יורד קצת.
