# ☁️ Cloud — AWS, GCP, Azure מבוא

> **Cloud — בעצם זה המחשב של מישהו אחר. אבל עם חשבונית.**

---

## מה זה Cloud?

Cloud = שירותי מחשוב (שרתים, אחסון, רשתות) דרך האינטרנט, בתשלום לפי שימוש.

## מודלים

| מודל | מה מקבלים | דוגמאות |
|------|-----------|---------|
| **IaaS** | VMs, storage, networking | EC2, GCE, Azure VM |
| **PaaS** | Runtime + managed services | App Engine, Heroku, Azure App Service |
| **SaaS** | אפליקציה מוכנה | Gmail, Salesforce, Slack |
| **Serverless** | פונקציות — pay per call | Lambda, Cloud Functions |

---

## 3 ספקי Cloud הגדולים

| | AWS | GCP | Azure |
|--|-----|-----|-------|
| **Compute** | EC2 | Compute Engine | Virtual Machines |
| **Serverless** | Lambda | Cloud Functions | Functions |
| **Storage** | S3 | Cloud Storage | Blob Storage |
| **Database** | RDS, DynamoDB | Cloud SQL, Firestore | Cosmos DB |
| **Kubernetes** | EKS | GKE | AKS |
| **AI/ML** | SageMaker | Vertex AI | Azure ML |

---

## Regions & Availability Zones

```
Region: us-east-1 (N. Virginia)
├── AZ: us-east-1a
├── AZ: us-east-1b
└── AZ: us-east-1c (physically separate data centers)
```

!!! note "Shared Responsibility Model"
    **Cloud Provider** אחראי על: physical security, hardware, networking.
    **אתם** אחראים על: data, access control, OS patches, application security.

---

## 🛤️ מאיפה מתחילים

1. **AWS Free Tier** — חשבון חינם ל-12 חודשים
2. **AWS Cloud Practitioner** — הסמכה בסיסית (ערך מוסף בCV)
3. **Build something** — deploy אפליקציה על EC2 / Lambda
4. **Terraform** — Infrastructure as Code

!!! tip "לימוד אקדמי"
    **קורסים**: מערכות הפעלה, רשתות מחשבים, מערכות מבוזרות, אבטחת מידע.
    **ידע מעשי**: Linux, networking, scripting.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין IaaS, PaaS ו-SaaS?"
    **IaaS** — תשתית: VMs, storage. אתם מנהלים OS ומעלה.
    **PaaS** — פלטפורמה: runtime managed. אתם מעלים קוד.
    **SaaS** — תוכנה: אפליקציה מוכנה. אתם רק משתמשים.

??? tip "מה זה Availability Zone?"
    Data center פיזי נפרד בתוך Region. AZs מחוברים ב-low-latency networking.
    Deploy ב-multiple AZs → high availability (אם AZ אחד נופל, השאר ממשיכים).

??? tip "מה זה Shared Responsibility Model?"
    Cloud provider אחראי על "of the cloud" (hardware, network, physical security).
    הלקוח אחראי על "in the cloud" (data, identity, application, OS config).
