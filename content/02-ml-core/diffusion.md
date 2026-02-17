# Diffusion

## למה זה חשוב

מודלי Diffusion הם הטכנולוגיה שמאחורי **מהפכת יצירת התמונות ב-AI**: Stable Diffusion, DALL-E, Midjourney, ועוד. הם הפכו יצירת תמונות מטקסט ("a cat wearing a top hat, oil painting") ממדע בדיוני למציאות.

- Diffusion models הם ה-**State of the Art** ביצירת תמונות, וידאו, ואודיו.
- הם החליפו את GANs (Generative Adversarial Networks) כגישה המובילה.
- הבנת Diffusion חיונית להבנת כלים כמו Stable Diffusion, DALL-E 3, Sora, ועוד.

## רעיונות מרכזיים

### מהם מודלי Diffusion?

הרעיון המרכזי: **ללמד מודל להסיר רעש מתמונה**. אם המודל יודע להסיר רעש צעד אחד, הוא יכול להתחיל מרעש טהור ולבנות תמונה שלמה צעד אחרי צעד.

```
Forward Process (הוספת רעש):
תמונה נקייה --> מעט רעש --> יותר רעש --> ... --> רעש טהור
     x_0    -->   x_1    -->   x_2    --> ... -->   x_T

Reverse Process (הסרת רעש):
רעש טהור  --> פחות רעש --> ... --> מעט רעש --> תמונה נקייה!
    x_T    -->  x_{T-1} --> ... -->   x_1   -->    x_0
```

### Forward Process -- הוספת רעש

תהליך פשוט ומתמטי: בכל צעד, מוסיפים רעש גאוסיאני קטן לתמונה:

$$x_t = \sqrt{1-\beta_t} \cdot x_{t-1} + \sqrt{\beta_t} \cdot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)$$

```python
import numpy as np

def add_noise(image, noise_level):
    """הוספת רעש גאוסיאני לתמונה"""
    noise = np.random.randn(*image.shape)
    noisy_image = np.sqrt(1 - noise_level) * image + np.sqrt(noise_level) * noise
    return noisy_image

# סימולציה של Forward Process
original = load_image("cat.jpg")  # תמונת חתול
steps = [original]
for t in range(50):
    noise_level = (t + 1) / 50 * 0.02  # רעש גדל בהדרגה
    steps.append(add_noise(steps[-1], noise_level))
# steps[-1] כמעט רעש טהור
```

!!! note "Forward Process הוא קל"
    ה-Forward Process לא דורש למידה בכלל. הוא פשוט הוספה מתמטית של רעש. כל ה"חוכמה" של המודל היא ב-**Reverse Process**.

### Reverse Process -- למידת הסרת רעש

המודל (בדרך כלל U-Net או DiT) לומד לחזות את הרעש שהוסף, ולהסיר אותו:

```
Input:  תמונה רועשת x_t + timestep t
Model:  Neural Network (U-Net / DiT)
Output: חיזוי הרעש ε שצריך להסיר

x_{t-1} = denoise(x_t, predicted_noise)
```

```
Timestep T (רעש טהור):  ░░░░░░░░░░
Timestep T/2:            ░░▓▒░▓░░▒░  (מתחילים לראות צורות)
Timestep T/4:            ▓▓█▒▓█▓▓▒▓  (פרטים מתגבשים)
Timestep 0:              🖼️ תמונה נקייה!
```

??? tip "למה זה עובד?"
    כי הסרת רעש קטן (**צעד אחד**) היא משימה הרבה יותר קלה מיצירת תמונה מאפס. המודל לומד הרבה צעדים קטנים של denoising, ובצירוף כולם -- הוא יוצר תמונה שלמה.

### Text-to-Image: איך זה עובד

כדי ליצור תמונה **מטקסט**, צריך שלושה מרכיבים:

```
                    "a cat wearing a top hat"
                              |
                         [Text Encoder]
                         (CLIP / T5)
                              |
                        text embedding
                              |
    Random Noise -----> [Denoising Model] -----> Generated Image
    (Latent space)      (U-Net / DiT)           (decoded to pixels)
                         x T steps
```

**1. Text Encoder (CLIP)**

CLIP (Contrastive Language-Image Pre-training) ממיר טקסט לוקטור שמייצג את המשמעות:

```
"a cat wearing a top hat" --> [0.23, -0.11, 0.87, ...]  (embedding)
```

**2. Denoising Model (U-Net / DiT)**

- **U-Net** -- ארכיטקטורה שמעבדת תמונות עם "skip connections". משמש ב-Stable Diffusion 1.x, 2.x.
- **DiT (Diffusion Transformer)** -- Transformer שמחליף את ה-U-Net. משמש ב-Stable Diffusion 3, DALL-E 3, Sora.

ה-Denoising Model מקבל את התמונה הרועשת ואת ה-text embedding, ומסיר רעש בהתאם לטקסט.

**3. Latent Space**

!!! warning "Latent Diffusion -- לא על פיקסלים!"
    Stable Diffusion לא עובד ישירות על פיקסלים (512x512x3 = 786K מספרים). במקום זה:

    1. **VAE Encoder** דוחס את התמונה ל-Latent space קטן (64x64x4)
    2. Diffusion קורה ב-Latent space (מהיר הרבה יותר!)
    3. **VAE Decoder** ממיר חזרה לפיקסלים

    זה מה שהופך את Stable Diffusion ל"Stable" -- הוא יציב ויעיל כי עובד במרחב קטן.

### Classifier-Free Guidance

טריק חשוב שמשפר מאוד את איכות התמונות:

```python
# בכל צעד denoising:
noise_uncond = model(noisy_image, timestep, empty_text)     # בלי הנחייה
noise_cond = model(noisy_image, timestep, text_embedding)    # עם הנחייה

# שילוב עם guidance scale (בד"כ 7-12):
noise_guided = noise_uncond + guidance_scale * (noise_cond - noise_uncond)
```

??? tip "CFG Scale"
    ה-guidance_scale שולט כמה המודל "מקשיב" לטקסט:

    - **נמוך (1-3)**: תמונות מגוונות אבל פחות קשורות לטקסט
    - **בינוני (7-8)**: האיזון הטוב ביותר (ברוב המקרים)
    - **גבוה (15+)**: קשור חזק לטקסט אבל פחות מגוון, לפעמים "שרוף"

### המודלים המובילים

| מודל | חברה | ארכיטקטורה | פתוח? |
|-------|------|------------|-------|
| **Stable Diffusion** (1.x-2.x) | Stability AI | U-Net + CLIP | כן |
| **Stable Diffusion 3** | Stability AI | DiT + T5 | כן (חלקית) |
| **DALL-E 3** | OpenAI | DiT + CLIP | לא |
| **Midjourney** | Midjourney | לא ידוע | לא |
| **Imagen** | Google | U-Net + T5 | לא |
| **FLUX** | Black Forest Labs | DiT | כן (חלקית) |

## בלבולים נפוצים

- **"Diffusion model = GAN"** -- לא! GANs משתמשים ב-Generator + Discriminator שמתחרים. Diffusion models לומדים לבצע denoising. הגישות שונות לחלוטין, וDiffusion נותן תוצאות יציבות יותר.
- **"המודל 'מצייר' את התמונה"** -- לא. המודל מתחיל מרעש ובכל צעד מסיר קצת רעש. אין "ציור" -- יש **denoising** הדרגתי.
- **"Stable Diffusion פשוט מדביק חתיכות מתמונות אימון"** -- לא! המודל למד **התפלגות** של תמונות ומייצר תמונות חדשות. הוא לא שומר ולא מחפש תמונות מה-training set.
- **"יותר Diffusion steps = תמיד יותר טוב"** -- יש diminishing returns. אחרי מספר מסוים של steps (בד"כ 20-50), השיפור זניח. טכניקות כמו DDIM Sampling מאפשרות תוצאות טובות גם ב-20 steps.

## דוגמה קטנה

הדמיה מינימלית של Diffusion ב-1D:

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Forward Process: הוספת רעש הדרגתית
def forward_process(x0, T=50):
    """מוסיף רעש בהדרגה"""
    trajectory = [x0]
    x = x0.copy()
    for t in range(T):
        beta_t = 0.02  # noise schedule
        noise = np.random.randn(*x.shape)
        x = np.sqrt(1 - beta_t) * x + np.sqrt(beta_t) * noise
        trajectory.append(x.copy())
    return trajectory

# נתחיל מנתונים שמגיעים מ-2 גאוסיאנים (כמו 2 "אשכולות")
data = np.concatenate([
    np.random.randn(500) * 0.3 + 2,   # cluster 1
    np.random.randn(500) * 0.3 - 2,   # cluster 2
])

trajectory = forward_process(data, T=50)

# מה רואים:
# t=0:  שני אשכולות ברורים (הנתונים המקוריים)
# t=25: אשכולות מטושטשים
# t=50: רעש גאוסיאני טהור

# Reverse Process: מודל שלומד להסיר רעש יחזיר לנו
# את שני האשכולות מתוך הרעש!
print(f"t=0  (original): mean={trajectory[0].mean():.2f}, std={trajectory[0].std():.2f}")
print(f"t=25 (partial):  mean={trajectory[25].mean():.2f}, std={trajectory[25].std():.2f}")
print(f"t=50 (noise):    mean={trajectory[50].mean():.2f}, std={trajectory[50].std():.2f}")
```

!!! note "הרעיון המרכזי"
    ב-Forward Process, הנתונים (2 אשכולות) הופכים בהדרגה לרעש. מודל Diffusion לומד את התהליך ההפוך: לקחת רעש ולשחזר את מבנה הנתונים המקורי. בתמונות, זה אומר ליצור תמונה ריאליסטית מרעש אקראי.

## קישורים לנושאים אחרים

- [Transformers](transformers.md) -- DiT (Diffusion Transformer) משלב את שתי הארכיטקטורות, ו-CLIP מבוסס Transformer
- [רשתות נוירונים](neural-networks.md) -- U-Net הוא סוג של CNN, ו-Diffusion models הם Neural Networks
- [AI, ML, DL -- מה ההבדל?](../00-big-picture/ai-ml-dl.md) -- Diffusion models הם חלק מ-Generative AI

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - הסתברות וסטטיסטיקה — Bayesian inference, Markov chains
    - למידה עמוקה — generative models, VAE, GAN, diffusion
    - חדו"א — stochastic differential equations (SDE), ODE
    - אלגברה לינארית — SVD, spectral analysis

    **קורסים מומלצים:**
    - תהליכים סטוכסטיים — Brownian motion, Langevin dynamics
    - תורת המידע — KL divergence, ELBO
    - ראייה ממוחשבת — image generation, evaluation metrics

    **ידע מעשי:**
    - Python + PyTorch
    - HuggingFace Diffusers library
    - Stable Diffusion / DALL-E architectures
    - Weights & Biases — experiment tracking

    **מתוכנית הלימודים שלך ב-TAU:**
    - יסודות הלמידה העמוקה (0368-3080)
    - מבוא ללמידה חישובית (0368-3235)
    - הסתברות וסטטיסטיקה לדו-חוגי (0368-2002)

---

## 🛤️ מאיפה מתחילים

1. **"What are Diffusion Models?"** — Lil'Log blog (Lilian Weng)
2. **Denoising Diffusion Probabilistic Models** — Ho et al. (2020) paper
3. **HuggingFace Diffusion Course** — hands-on tutorials
4. **Stable Diffusion WebUI** — ניסוי עם מודלים קיימים
5. **"Understanding Diffusion Models: A Unified Perspective"** — Calvin Luo

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Diffusion ל-GAN?"
    **GAN** — שני מודלים (Generator + Discriminator) מתחרים. אימון לא יציב (mode collapse). **Diffusion** — מודל אחד שלומד להסיר רעש. אימון יציב יותר, diversity טובה יותר, אבל inference איטי (מאות צעדים). Diffusion הפך לstandard ליצירת תמונות.

??? tip "מה Forward ו-Reverse Process ב-Diffusion?"
    **Forward** — הוספה הדרגתית של Gaussian noise לתמונה על פני T צעדים עד שהיא noise טהור. `q(x_t|x_{t-1}) = N(√(1-β_t)·x_{t-1}, β_t·I)`.
    **Reverse** — מודל שלומד להסיר noise צעד אחרי צעד. `p_θ(x_{t-1}|x_t)` — predicts the noise that was added.

??? tip "למה Diffusion Models איטיים ומה עושים?"
    צריכים מאות צעדי denoising (T=1000). פתרונות: **DDIM** — deterministic, fewer steps (50-100). **Latent Diffusion** — עובד ב-latent space (קטן יותר). **Consistency Models** — single-step generation. **Distillation** — progressive distillation לפחות צעדים.

??? tip "מה Classifier-Free Guidance?"
    טכניקה לשליטה ב-tradeoff בין quality ל-diversity. מאמנים מודל גם עם condition וגם בלי, ובinference: `ε_guided = ε_uncond + s·(ε_cond - ε_uncond)` כש-s = guidance scale. s גבוה = quality גבוהה אבל פחות diversity.

??? tip "מה U-Net ולמה משתמשים בו ב-Diffusion?"
    **U-Net** — ארכיטקטורת encoder-decoder עם skip connections. Encoder מקטין רזולוציה, Decoder מגדיל. Skip connections שומרים פרטים מרחביים. משתמשים ב-diffusion כי הוא טוב ב-pixel-level prediction (denoising). בStable Diffusion הU-Net עובד ב-latent space.
