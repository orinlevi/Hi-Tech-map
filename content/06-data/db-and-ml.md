# DB ו-ML

## למה זה חשוב

**Machine Learning בלי נתונים הוא כלום.** כל מודל ML — מ-Linear Regression פשוט ועד LLM מתקדם — מתחיל מנתונים. הנתונים האלה צריכים להישמר, להתעדכן, להיות נגישים, ולהיות באיכות גבוהה.

ההבנה של הקשר בין Databases ל-ML חשובה במיוחד היום, כש-Vector Databases הפכו לרכיב מרכזי בכל מערכת שמשתמשת ב-Embeddings, חיפוש סמנטי, או RAG (Retrieval-Augmented Generation).

## רעיונות מרכזיים

### מאיפה מגיעים הנתונים?

נתוני ML מגיעים ממגוון מקורות — וצריך לדעת לעבוד עם כולם:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Databases   │    │    APIs      │    │    Files     │
│ (PostgreSQL, │    │ (REST, gRPC, │    │ (CSV, JSON,  │
│  MongoDB)    │    │  WebSocket)  │    │  Parquet)    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                   ┌───────────────┐
                   │  Data Pipeline │
                   │  (ETL / ELT)  │
                   └───────┬───────┘
                           ▼
                   ┌───────────────┐
                   │ Training Data │
                   │   (Clean &    │
                   │   Labeled)    │
                   └───────────────┘
```

!!! note "ETL vs ELT"
    - **ETL** (Extract, Transform, Load) — שולפים נתונים, מנקים ומתאימים, ואז טוענים ל-Database.
    - **ELT** (Extract, Load, Transform) — טוענים נתונים "גולמיים" קודם, ואז מנקים בתוך ה-Database.
    - ELT נפוץ יותר היום בזכות כלים כמו **dbt** ומאגרים כמו **BigQuery** ו-**Snowflake**.

### Feature Store

**Feature Store** הוא Database ייעודי שמאחסן **Features** (מאפיינים) מוכנים לשימוש במודלי ML.

```
Raw Data                    Feature Store              Model
─────────                   ─────────────              ─────
user_transactions    →     user_avg_spend      →     ┌─────────┐
                           user_total_orders    →     │  Model  │
user_clickstream     →     user_session_length  →     │Training │
                           user_last_login      →     └─────────┘
product_catalog      →     product_category
```

למה זה שימושי?

- **שימוש חוזר** — Feature שחושב פעם אחת משמש כמה מודלים
- **עקביות** — אותו Feature ב-Training וב-Production (נמנעים מ-**Training-Serving Skew**)
- **גרסאות** — אפשר לחזור ל-Features מזמן מסוים

??? tip "כלי Feature Store פופולריים"
    - **Feast** — Open Source, קל לשימוש
    - **Tecton** — ענן, מתאים ל-Real-time Features
    - **Hopsworks** — כולל ניהול Pipelines

### Vector Databases

**Vector Database** הוא סוג חדש של Database שמותאם לאחסון וחיפוש של **Embeddings** — ייצוגים מספריים של טקסט, תמונות, או כל סוג נתונים.

```
"מהו Machine Learning?"  →  Embedding Model  →  [0.12, -0.45, 0.78, ...]
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │   Vector DB   │
                                                  │               │
                                                  │  [0.12, -0.45]│ "מהו ML"
                                                  │  [0.15, -0.41]│ "הסבר על AI"     ← קרוב!
                                                  │  [0.89, 0.23] │ "מתכון לעוגה"   ← רחוק
                                                  │  [0.11, -0.48]│ "למידת מכונה"   ← קרוב!
                                                  └──────────────┘
```

**חיפוש ב-Vector DB** מבוסס על **דמיון** (Similarity), לא על התאמה מדויקת:

- **Cosine Similarity** — מודד את הזווית בין וקטורים
- **Euclidean Distance** — מודד מרחק "ישר" בין נקודות
- **Approximate Nearest Neighbors (ANN)** — אלגוריתמים שמוצאים תוצאות "קרובות מספיק" בזמן מהיר

!!! warning "Vector DB הוא לא תחליף ל-Database רגיל"
    Vector Database מיועד ל-Similarity Search. הוא לא מתאים לניהול משתמשים, הזמנות, או נתונים טבלאיים. בפועל, מערכת ML משתמשת ב-**שניהם**: PostgreSQL לנתונים מובנים + Vector DB ל-Embeddings.

**דוגמאות לכלים:**

| כלי | מאפיין בולט |
|-----|------------|
| **Pinecone** | Managed, קל לשימוש, Serverless |
| **Milvus** | Open Source, Scalable |
| **Weaviate** | Open Source, תומך ב-Hybrid Search |
| **Chroma** | קל לפיתוח מקומי, פופולרי ל-RAG |
| **pgvector** | Extension ל-PostgreSQL — Vector Search בתוך DB קיים |

### Training Data Pipelines

**Data Pipeline** הוא הצינור שלוקח נתונים גולמיים ומכין אותם ל-Training:

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌─────────┐
│ Collect │ →  │  Clean   │ →  │ Transform │ →  │ Validate │ →  │  Store  │
│ Data    │    │ & Filter │    │ & Feature │    │ & Split  │    │ (Train/ │
│         │    │          │    │ Engineer  │    │          │    │  Test)  │
└─────────┘    └──────────┘    └───────────┘    └──────────┘    └─────────┘
```

??? tip "כלים פופולריים ל-Data Pipelines"
    - **Apache Airflow** — תזמון וניהול Workflows
    - **Luigi** — Pipeline Framework של Spotify
    - **Prefect** — חלופה מודרנית ל-Airflow
    - **DVC** (Data Version Control) — ניהול גרסאות של נתונים (כמו Git, אבל לקבצי Data)

!!! note "Data Quality חשוב יותר מכמות"
    **"Garbage In, Garbage Out"** — מודל ML לא יכול ללמוד דפוסים מנתונים מלוכלכים. חשוב לוודא: אין ערכים חסרים בשדות קריטיים, אין שכפולים, הנתונים מייצגים את העולם האמיתי, ויש איזון בין Labels.

### Model Registry vs Database

| | Model Registry | Database |
|---|---|---|
| **מה נשמר** | מודלים מאומנים (קבצי weights) | נתונים (שורות, מסמכים) |
| **גרסאות** | גרסאות של מודלים | גרסאות של Schema (Migrations) |
| **Metadata** | Hyperparameters, Metrics, Lineage | Schema, Indexes, Constraints |
| **דוגמאות** | MLflow, Weights & Biases, Neptune | PostgreSQL, MongoDB |

```
Data Pipeline                  Training Loop               Production
───────────────               ─────────────               ──────────
┌──────────┐                  ┌──────────┐                ┌──────────┐
│ Database │ → Features →     │ Training │ → Model →      │  Model   │
│ (Source) │                  │          │                │ Registry │
└──────────┘                  └──────────┘                └────┬─────┘
                                                               │
                                                               ▼
                                                        ┌──────────┐
                                                        │  Serving  │
                                                        │  (API)    │
                                                        └──────────┘
```

??? tip "MLflow — כלי פופולרי לניהול מודלים"
    ```python
    import mlflow

    # רישום ניסוי
    with mlflow.start_run():
        mlflow.log_param("learning_rate", 0.01)
        mlflow.log_param("epochs", 50)
        mlflow.log_metric("accuracy", 0.94)

        # שמירת המודל ב-Registry
        mlflow.sklearn.log_model(model, "my_model")
    ```
    ה-Model Registry שומר את הקובץ של המודל + כל ה-Metadata: איזה נתונים שימשו לאימון, מה ה-Hyperparameters, מה הביצועים. זה מאפשר לשחזר כל ניסוי.

## בלבולים נפוצים

- **"Vector DB מחליף את Google Search"** — Vector DB מחפש לפי דמיון סמנטי, לא לפי מילות מפתח. חיפוש מתקדם משלב את שניהם — **Hybrid Search** (Semantic + Keyword).
- **"כל הנתונים צריכים להיות ב-Database אחד"** — מערכות ML טיפוסיות משתמשות בכמה מאגרים: Database רגיל לנתונים מובנים, Object Storage (S3) לקבצים גדולים, ו-Vector DB ל-Embeddings.
- **"Model Registry הוא סוג של Database"** — טכנית כן, אבל הוא ייעודי לניהול מחזור חיים של מודלים. הוא לא מיועד לשמירת נתונים כלליים.
- **"RAG לא צריך Database"** — RAG (Retrieval-Augmented Generation) מבוסס על שליפת מידע רלוונטי מ-Database (בדרך כלל Vector DB) ושילוב שלו ב-Prompt. בלי Database אין RAG.

## דוגמה קטנה

דוגמה פשוטה של חיפוש סמנטי עם **Chroma** (Vector DB):

```python
import chromadb

# יצירת Client ו-Collection
client = chromadb.Client()
collection = client.create_collection("study_notes")

# הכנסת מסמכים — Chroma ייצור Embeddings אוטומטית
collection.add(
    documents=[
        "Machine Learning הוא תת-תחום של AI שמאפשר למחשבים ללמוד מנתונים",
        "Deep Learning משתמש ברשתות נוירונים עם שכבות רבות",
        "מסדי נתונים מאחסנים מידע בצורה מאורגנת",
        "SQL היא שפת שאילתות למסדי נתונים רלציוניים",
        "Gradient Descent הוא אלגוריתם אופטימיזציה ללמידת מכונה",
    ],
    ids=["doc1", "doc2", "doc3", "doc4", "doc5"]
)

# חיפוש סמנטי — מה הכי דומה לשאלה?
results = collection.query(
    query_texts=["איך מודל לומד?"],
    n_results=2
)

print(results["documents"])
# [['Machine Learning הוא תת-תחום של AI...',
#   'Gradient Descent הוא אלגוריתם אופטימיזציה...']]
```

??? tip "שימו לב למה שקרה"
    השאילתה "איך מודל לומד?" לא מכילה את המילים "Machine Learning" או "Gradient Descent" — אבל ה-Vector DB הבין שהמסמכים האלה **רלוונטיים סמנטית**. זה ההבדל המרכזי בין חיפוש סמנטי לחיפוש רגיל.

## קישורים לנושאים אחרים

- [מהו מסד נתונים](what-is-a-database.md) — מבוא כללי למסדי נתונים
- [שאילתות ואינדקסים (Queries and Indexes)](queries-and-indexes.md) — איך שולפים נתונים ביעילות מ-Database רגיל
- [וקטורים ומרחבים (Vectors and Spaces)](../02-ml-core/vectors-and-spaces.md) — המתמטיקה מאחורי Embeddings ו-Vector Search
- [סיווג (Classification)](../02-ml-core/classification.md) — דוגמה למשימת ML שמתחילה מנתונים ב-Database

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - מסדי נתונים — SQL, indexing, query optimization
    - למידת מכונה — data pipelines, feature engineering
    - סטטיסטיקה — sampling, distributions, hypothesis testing

    **קורסים מומלצים:**
    - Data Engineering — ETL, data lakes, streaming
    - Big Data — Spark, Hadoop, distributed processing
    - MLOps — model serving, monitoring, pipelines

    **ידע מעשי:**
    - SQL + pandas — data manipulation
    - Apache Spark / Dask — big data processing
    - Feature stores (Feast, Tecton)
    - MLflow / Kubeflow — ML pipelines

    **מתוכנית הלימודים שלך ב-TAU:**
    - מבוא למדעי הנתונים (0300-0300)
    - מבוא ללמידה חישובית (0368-3235)

---

## 🛤️ מאיפה מתחילים

1. **SQL tutorial** — W3Schools או Mode Analytics
2. **Kaggle datasets** — practice data loading and preprocessing
3. **Apache Spark Getting Started** — distributed data processing
4. **"Designing Data-Intensive Applications"** — Martin Kleppmann
5. **Feature store concepts** — Feast documentation

---

## 💼 שאלות לראיון עבודה

??? tip "למה DB חשוב ל-ML?"
    ML צריך data — ו-data חי ב-DB. Feature engineering = SQL queries. Training data = DB queries. Feature store = DB-like system. Model serving = lookup predictions. Monitoring = logging predictions to DB. Data quality → model quality.

??? tip "מה Feature Store?"
    **Feature Store** — מאגר מרכזי של features ל-ML. פותר: (1) Feature reuse בין teams, (2) Online serving (low latency) + Offline training (batch), (3) Point-in-time correctness (no data leakage), (4) Feature versioning. דוגמאות: Feast, Tecton, Hopsworks.

??? tip "מה ההבדל בין OLTP ל-OLAP בהקשר ML?"
    **OLTP** — transactional (INSERT/UPDATE, row-based). Production DB. **OLAP** — analytical (SELECT aggregations, column-based). Data warehouse. ML training → OLAP (batch reads). ML serving → OLTP (low-latency lookups). ETL moves data from OLTP to OLAP.

??? tip "מה Data Leakage?"
    שימוש בinformation מהעתיד / מה-target variable בtraining. דוגמאות: feature שמחושב על כל ה-data (כולל test), timestamp features שלא היו ידועים בreal-time. תוצאה: model מצוין בtraining, גרוע בproduction. Prevention: strict train/test split, temporal validation.

??? tip "מה Vector Database?"
    DB שמותאם לאחסון וחיפוש embeddings (vectors). Nearest neighbor search על vectors. שימושים: semantic search, recommendation, RAG (Retrieval Augmented Generation). דוגמאות: Pinecone, Weaviate, Milvus, Qdrant, pgvector. ANN (Approximate Nearest Neighbor) algorithms: HNSW, IVF.
