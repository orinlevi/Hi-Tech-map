# 👁️ ראייה — מ-V1 עד CNNs

> **V1 לא היה שם בשביל ה-GPU. הוא היה שם קודם.**

---

## מערכת הראייה הביולוגית

```
רשתית (Retina) → LGN (Thalamus) → V1 → V2 → V4 → IT cortex
                                    ↓
                              "What" pathway (ventral) — זיהוי אובייקטים
                              "Where" pathway (dorsal) — מיקום ותנועה
```

### רשתית — עיבוד ראשוני
- **Rods** (~120M) — ראייה בחושך, שחור-לבן
- **Cones** (~6M) — ראייה בצבע (RGB — red, green, blue)
- **Receptive field** — אזור במרחב שנוירון מגיב אליו
- **Center-surround** — on-center/off-surround (זיהוי קצוות!)

!!! note "Edge Detection — בטבע"
    התאים ברשתית כבר עושים edge detection. Hubel & Wiesel (Nobel 1981) הראו שנוירונים ב-V1 מגיבים לקווים באוריינטציה ספציפית.

### V1 — Simple & Complex Cells
| סוג תא | מגיב ל... | אנלוגיה ב-CNN |
|---------|-----------|---------------|
| **Simple cell** | קצה באוריינטציה + מיקום מדויק | Conv filter |
| **Complex cell** | קצה באוריינטציה, invariant למיקום | Conv + Pooling |
| **Hypercomplex** | קצה באורך ספציפי | Conv עם constraints |

### הירארכיית עיבוד
```
V1: קצוות ואוריינטציות (low-level features)
  ↓
V2: contours ו-texture boundaries
  ↓
V4: צורות, צבעים, patterns
  ↓
IT: אובייקטים שלמים, פרצופים, מילים
```

!!! tip "מ-Simple ל-Complex"
    המוח בונה ייצוגים הירארכיים — מfeatures פשוטים (קצוות) לייצוגים מורכבים (פרצופים). **בדיוק כמו CNN.**

---

## Convolutional Neural Networks

### למה Convolutions?

```
תמונה 1000×1000 → Fully connected layer?
= 1,000,000 inputs × N neurons = 💀 (too many parameters!)

Convolution:
= kernel 3×3 → 9 parameters, shared across entire image ✅
= Translation invariance — חתול בפינה = חתול במרכז
```

### ארכיטקטורה בסיסית

```python
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            # Block 1: low-level features (edges, textures)
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            # Block 2: mid-level features (parts, patterns)
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            # Block 3: high-level features (objects)
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
        )
        self.classifier = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)
```

### Receptive Field ב-CNNs

```
Layer 1: receptive field = 3×3 (רואה פיקסלים בודדים)
Layer 2: receptive field = 5×5 (רואה patterns קטנים)
Layer 3: receptive field = 7×7 (רואה חלקים)
...
Layer N: receptive field = כל התמונה (רואה אובייקט שלם)
```

> **בדיוק כמו במוח** — V1 → V2 → V4 → IT — receptive fields הולכים וגדלים.

---

## אבולוציה של ארכיטקטורות

### LeNet-5 (1998) — LeCun
```
Conv → Pool → Conv → Pool → FC → FC → Output
5×5 kernels, 60K parameters
שימוש: זיהוי ספרות (MNIST)
```

### AlexNet (2012) — Krizhevsky
```
ImageNet competition — ירידה דרמטית ב-error rate
ReLU activation, Dropout, GPU training
60M parameters
```

!!! note "רגע מכונן"
    AlexNet (2012) שינה את ההיסטוריה. הראה שרשתות עמוקות + GPUs = SOTA בראייה ממוחשבת. זה הדליק את מהפכת ה-Deep Learning.

### VGG (2014) — Very Deep
```
16-19 layers, only 3×3 kernels
פשטות ארכיטקטונית: stack of 3×3 convolutions
138M parameters — כבד!
```

### GoogLeNet / Inception (2014)
```
Inception module: multiple kernel sizes in parallel
1×1, 3×3, 5×5 → concatenate
22 layers, only 5M parameters (efficient!)
```

### ResNet (2015) — Skip Connections
```python
# Skip / Residual connection
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        residual = x                        # שמור input
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out = F.relu(out + residual)        # ← SKIP CONNECTION!
        return out
```

> **Skip connections פתרו את vanishing gradient** — מאפשרים לאמן רשתות של 152+ שכבות.

### Vision Transformers — ViT (2020)
```
תמונה → חיתוך ל-16×16 patches → flatten → Linear projection
→ Position embeddings → Transformer Encoder → Classification

ViT הוכיח: Transformers עובדים גם על תמונות!
אבל צריכים המון דאטה (ImageNet-21K, JFT-300M)
```

---

## המקביל הביולוגי — למה CNNs עובדים?

| תכונה ביולוגית | CNN מקביל |
|----------------|-----------|
| Receptive fields שגדלים | Stacked convolutions |
| Center-surround | Edge detection filters |
| Simple → Complex cells | Conv → Pool |
| Hierarchical processing | Deep layers |
| Lateral inhibition | Batch normalization |
| Attention (selective) | Attention mechanisms |
| Plasticity (learning) | Backpropagation |

### Representational Similarity

!!! warning "זה לא מקרי"
    מחקר (Yamins et al., 2014) הראה:
    - שכבות מוקדמות ב-CNN → דומות ל-V1
    - שכבות אמצעיות → דומות ל-V4
    - שכבות עמוקות → דומות ל-IT cortex

    **CNN שאומן רק על ImageNet "גילה" את הארכיטקטורה של המוח.**

---

## Transfer Learning

```python
# Fine-tuning pretrained CNN for medical imaging
import torchvision.models as models

# Load pretrained ResNet
model = models.resnet50(pretrained=True)

# Freeze early layers (low-level features are universal)
for param in model.parameters():
    param.requires_grad = False

# Replace classifier for new task
model.fc = nn.Linear(2048, num_medical_classes)

# Train only the new classifier
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
```

!!! tip "למה Transfer Learning עובד?"
    כי **features מוקדמים (edges, textures) הם אוניברסליים** — בדיוק כמו ב-V1. רק ה-features הגבוהים (פרצופים vs. מכוניות) ספציפיים למשימה.

---

## יישומים

| תחום | טכנולוגיה | דוגמה |
|------|-----------|-------|
| **Object Detection** | YOLO, Faster R-CNN | רכבים אוטונומיים |
| **Segmentation** | U-Net, Mask R-CNN | דימות רפואי |
| **Face Recognition** | FaceNet, ArcFace | ביומטריה |
| **Medical Imaging** | Transfer + fine-tune | גילוי סרטן |
| **Neural Style Transfer** | Gatys et al. | אמנות AI |
| **Super Resolution** | SRGAN, ESRGAN | שיפור תמונות |

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מבוא לנוירומדע — מערכת הראייה הביולוגית, Hubel & Wiesel
    - ראייה ממוחשבת (Computer Vision) — CV קלאסי + deep
    - למידה עמוקה (Deep Learning) — CNNs, optimization, architectures
    - אלגברה לינארית — convolutions כפעולות מטריציות
    - עיבוד תמונה (Image Processing) — filtering, transforms

    **קורסים מומלצים:**
    - נוירומדע חישובי — מודלים של V1, predictive coding
    - סטטיסטיקה ביולוגית — ניתוח imaging data
    - פסיכופיזיקה — תפיסה חזותית אנושית

    **ידע מעשי:**
    - Python + PyTorch / TensorFlow
    - torchvision, OpenCV
    - Weights & Biases לtracking ניסויים
    - CUDA basics (GPU programming)
    - Docker לenvironment management

    **מתוכנית הלימודים שלך ב-TAU:**
    - תפיסה ופסיכופיזיקה (1071-2909)
    - מודלים קוגניטיבים וחישוביים לזיהוי פנים (1071-3651) — סמינר
    - יסודות גרפיקה, עיבוד תמונה וראיה (0368-3236)
    - יסודות הלמידה העמוקה (0368-3080)
    - גרפיקה מבוססת רשתות נוירונים (0368-3089)
    - חישוביות עצבית (1501-1028)

---

## 🛤️ מאיפה מתחילים

1. **CS231n** (Stanford) — הקורס הקלאסי של Andrej Karpathy
2. **PyTorch Tutorials** — CNNs on CIFAR-10
3. **Transfer Learning** — fine-tune pretrained ResNet
4. **Kaggle** — Image classification competitions
5. **Paper reading** — ResNet, ViT, CLIP

---

## 💼 שאלות לראיון עבודה

??? tip "למה משתמשים ב-Convolutions ולא ב-Fully Connected?"
    1. **Parameter sharing** — אותו kernel בכל מקום → הרבה פחות פרמטרים
    2. **Translation invariance** — חתול בפינה = חתול במרכז
    3. **Local connectivity** — פיקסלים קרובים רלוונטיים יותר
    4. **Receptive field** — הירארכיה טבעית מlocal לglobal

??? tip "מה Skip Connections פותרים?"
    **Vanishing gradient problem** — ברשתות עמוקות, gradients מתכווצים בחזרה. Skip connections מאפשרים gradient flow ישיר:
    `y = F(x) + x` → `dy/dx = dF/dx + 1` (ה-1 מבטיח שgradient לא נעלם)

    מאפשרים אימון רשתות של 100+ שכבות (ResNet-152).

??? tip "מה ההבדל בין Max Pooling ל-Average Pooling?"
    - **Max Pooling** — לוקח את הערך המקסימלי. שומר features בולטים (edges חזקים). נפוץ יותר.
    - **Average Pooling** — ממוצע. smooth יותר. נפוץ בשכבות אחרונות (Global Average Pooling).
    - **Stride > 1** — אלטרנטיבה מודרנית — downsampling דרך convolution עצמו.

??? tip "למה Transfer Learning עובד?"
    שכבות מוקדמות לומדות features אוניברסליים (edges, textures, shapes) שרלוונטיים לכל משימת vision. רק שכבות עמוקות הן task-specific. לכן — freeze early layers, train last layers.

??? tip "מה היתרון של ViT על CNNs?"
    - **Global receptive field** מהשכבה הראשונה (self-attention)
    - **Scalability** — עובד טוב יותר כשיש המון דאטה
    - **חסרון**: צריך הרבה יותר דאטה לאימון (אין inductive bias של locality)
    - **פתרון**: DeiT — data-efficient ViT עם distillation

??? tip "הסבר את הקשר בין V1 ל-CNNs"
    תאים ב-V1 מגיבים לקצוות באוריינטציה מסוימת — בדיוק כמו Gabor-like filters שנלמדים בשכבה הראשונה של CNN. ההירארכיה V1→V4→IT מקבילה לshallow→deep layers. מחקרים הראו representational similarity מובהקת בין שכבות CNN לאזורי מוח.
