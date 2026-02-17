# 🏗️ Infrastructure as Code — Terraform

> **Terraform — כי ללחוץ כפתורים ב-UI זה כיף עד שצריך לשחזר הכל.**

---

## למה IaC?

Infrastructure as Code = הגדרת תשתיות בקוד, עם version control, review, ואוטומציה.

| | ידני (Console) | IaC (Terraform) |
|--|---------------|-----------------|
| **שחזור** | "מה הגדרתי?" | `terraform apply` |
| **תיעוד** | אין | הקוד הוא התיעוד |
| **שינויים** | click click | `git diff` |
| **עקביות** | drift | idempotent |

---

## HCL — HashiCorp Configuration Language

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.micro"

  tags = {
    Name = "web-server"
  }
}

resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
}

output "server_ip" {
  value = aws_instance.web.public_ip
}
```

---

## Workflow

```bash
terraform init      # download providers
terraform plan      # preview changes
terraform apply     # execute changes
terraform destroy   # teardown everything
```

!!! tip "תמיד תריצו plan לפני apply!"
    `plan` מראה מה ישתנה. `apply` בלי plan = הפתעות.

---

## State Management

```hcl
# Remote state — שיתוף בצוות
terraform {
  backend "s3" {
    bucket = "my-tf-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
```

!!! warning "State = מקור האמת"
    State file מכיל **secrets** (passwords, keys). לעולם אל תכניסו אותו ל-git.
    Remote state + encryption + locking (DynamoDB) = best practice.

---

## 🛤️ מאיפה מתחילים

1. **Terraform Basics** — providers, resources, variables, outputs
2. **AWS Free Tier** — תרגול עם EC2, S3
3. **Modules** — reusable infrastructure components
4. **State Management** — remote backend
5. **HashiCorp Certified** — Terraform Associate certification

!!! tip "לימוד אקדמי"
    **קורסים**: רשתות מחשבים, מערכות הפעלה, מערכות מבוזרות.
    **ידע מעשי**: Linux, networking, Git, YAML/JSON/HCL.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מערכות הפעלה (0368-2162)

---

## 💼 שאלות לראיון עבודה

??? tip "מה זה Terraform State ולמה הוא חשוב?"
    State = מיפוי בין הקוד לinfrastructure האמיתי. בלעדיו Terraform לא יודע מה קיים.
    Remote state + locking מונעים conflicts. State מכיל secrets → אל תשמרו ב-git.

??? tip "מה ההבדל בין Terraform ל-CloudFormation?"
    **Terraform** — multi-cloud (AWS, GCP, Azure), HCL syntax, community modules.
    **CloudFormation** — AWS only, YAML/JSON, deep AWS integration.

??? tip "מה זה Terraform Module?"
    Module = reusable package של Terraform code. כמו function בתכנות.
    דוגמה: VPC module שיוצר VPC + subnets + route tables בקריאה אחת.
