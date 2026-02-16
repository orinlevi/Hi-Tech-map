# CI/CD

## למה זה חשוב

בלי CI/CD, הדרך מקוד ל-production נראית ככה: מפתח כותב קוד, בודק ידנית, שולח למישהו שיעלה לשרת, מקווה שזה עובד. עם CI/CD:

- כל push לקוד מפעיל בדיקות אוטומטיות
- באגים נתפסים מוקדם (לפני שהם מגיעים ל-production)
- ה-deploy אוטומטי ועקבי
- הצוות יכול לשחרר גרסאות מהר ובביטחון

CI/CD הוא **הבסיס** של פיתוח תוכנה מודרני. כמעט בלתי אפשרי לעבוד בצוות בלי זה.

## רעיונות מרכזיים

### CI -- Continuous Integration

**שילוב מתמשך**: כל פעם שמפתח/ת דוחף/ת קוד ל-repository, מערכת אוטומטית:

1. בונה את הקוד (build)
2. מריצה בדיקות (tests)
3. בודקת איכות קוד (lint)
4. מדווחת על התוצאות

```
Developer A pushes code
         │
         v
┌────────────────────────────┐
│      CI Pipeline           │
│                            │
│  ┌──────┐  ┌──────┐       │
│  │Build │─>│ Test │──┐    │
│  └──────┘  └──────┘  │    │
│                       v    │
│              ┌──────┐      │
│              │ Lint │      │
│              └──┬───┘      │
│                 v          │
│           Pass / Fail      │
└────────────────────────────┘
         │
         v
  ✅ Merge allowed    or    ❌ Fix needed
```

!!! note "למה 'Continuous'?"
    הרעיון: במקום לשלב (integrate) קוד פעם בשבוע/חודש ולגלות הרבה בעיות, משלבים **כל הזמן** (כל commit) ומגלים בעיות מיד כשהן קטנות.

### CD -- Continuous Delivery / Deployment

שני מושגים דומים עם הבדל חשוב:

- **Continuous Delivery** = הקוד **מוכן** ל-deploy בכל רגע, אבל ה-deploy עצמו ידני (לחיצה על כפתור)
- **Continuous Deployment** = הקוד עולה ל-production **אוטומטית** אחרי שעבר את כל הבדיקות

```
Continuous Delivery:
Code ──> Build ──> Test ──> Stage ──> [כפתור ידני] ──> Production

Continuous Deployment:
Code ──> Build ──> Test ──> Stage ──> Production (אוטומטי!)
```

??? tip "מה יותר נפוץ?"
    רוב הארגונים משתמשים ב-**Continuous Delivery** (ולא Deployment). הסיבה: רוצים שאדם יאשר את ה-deploy ל-production, במיוחד במערכות קריטיות. Continuous Deployment מלא נפוץ יותר ב-SaaS ובחברות שיש להן test coverage גבוה מאוד.

### Pipeline -- הצינור

Pipeline הוא סדרת שלבים (stages) שהקוד עובר מ-commit ועד production:

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                           │
│                                                             │
│  ┌───────┐   ┌───────┐   ┌───────┐   ┌────────┐   ┌─────┐│
│  │ Build │──>│ Test  │──>│ Lint  │──>│ Deploy │──>│ Mon ││
│  │       │   │       │   │       │   │ Stage  │   │itor ││
│  └───────┘   └───────┘   └───────┘   └────┬───┘   └─────┘│
│                                            │               │
│                                     ┌──────v──────┐        │
│                                     │   Deploy    │        │
│                                     │ Production  │        │
│                                     └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

**השלבים הנפוצים:**

| שלב | מה עושה | כלים לדוגמה |
|------|---------|-------------|
| **Build** | קומפילציה, בניית Docker image | `docker build`, `npm run build`, `mvn package` |
| **Test** | Unit tests, integration tests | `pytest`, `jest`, `JUnit` |
| **Lint** | בדיקת סגנון ואיכות קוד | `eslint`, `flake8`, `black` |
| **Security Scan** | בדיקת פרצות אבטחה | `Snyk`, `Trivy`, `SonarQube` |
| **Deploy to Staging** | העלאה לסביבת staging | `kubectl apply`, `oc apply` |
| **Deploy to Production** | העלאה ל-production | `kubectl apply`, `helm upgrade` |

### הכלים הנפוצים

#### GitHub Actions

הכלי הפופולרי ביותר לפרויקטים שמתארחים ב-GitHub:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run linter
        run: flake8 .

      - name: Run tests
        run: pytest --cov=app tests/

      - name: Build Docker image
        run: docker build -t my-app:${{ github.sha }} .

  deploy:
    needs: build-and-test        # רק אחרי שהבדיקות עברו
    if: github.ref == 'refs/heads/main'  # רק על main branch
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/my-app \
            my-app=my-app:${{ github.sha }}
```

#### Jenkins

הוותיק -- מאוד נפוץ בארגונים גדולים:

```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t my-app .'
            }
        }
        stage('Test') {
            steps {
                sh 'pytest tests/'
            }
        }
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
    post {
        failure {
            // שליחת התראה ל-Slack
            slackSend channel: '#dev',
                message: "Build failed! ${env.BUILD_URL}"
        }
    }
}
```

#### GitLab CI

מובנה ב-GitLab:

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build -t my-app .

test:
  stage: test
  script:
    - pytest tests/

deploy:
  stage: deploy
  script:
    - kubectl apply -f k8s/
  only:
    - main
```

### למה CI/CD הכרחי לצוותים?

```
בלי CI/CD:
──────────
Developer A: "שיניתי פונקציה X"
Developer B: "גם אני שיניתי פונקציה X"
*merge*
💥 Conflict + bugs שמתגלים אחרי שבוע

עם CI/CD:
──────────
Developer A pushes ──> CI runs tests ──> ✅ merged
Developer B pushes ──> CI runs tests ──> ❌ conflict detected immediately!
                                          (תיקון תוך דקות, לא שבועות)
```

!!! warning "CI/CD לא מחליף בדיקות טובות"
    ה-pipeline טוב רק כמו הבדיקות שבו. אם אין tests, ה-CI יעבור תמיד בהצלחה -- אבל הקוד עדיין יכול להיות שבור. **כתבו tests!**

### הזרימה המלאה

```
Developer writes code
        │
        v
    git push
        │
        v
┌───────────────────────────────┐
│  CI: Build + Test + Lint      │
│  (GitHub Actions / Jenkins)   │
└───────────┬───────────────────┘
            │
     ┌──────┴──────┐
     │             │
   ✅ Pass       ❌ Fail
     │             │
     v             v
  Build Docker   Notify developer
  Image          (email / Slack)
     │
     v
  Push to Registry
  (Docker Hub / ECR / GCR)
     │
     v
  Deploy to Staging (K8s / OpenShift)
     │
     v
  Manual Approval (optional)
     │
     v
  Deploy to Production
     │
     v
  Monitor & Alert
```

## בלבולים נפוצים

- **"CI/CD זה כלי אחד"** -- CI/CD הוא **תהליך**, לא כלי ספציפי. אפשר לממש CI/CD עם GitHub Actions, Jenkins, GitLab CI, CircleCI, ועוד רבים.
- **"CI ו-CD זה אותו דבר"** -- CI (שילוב) מתמקד בבדיקות אוטומטיות. CD (מסירה/פריסה) מתמקד בהעלאה לסביבות. הם משלימים זה את זה אבל הם שלבים שונים.
- **"צריך CI/CD רק לפרויקטים גדולים"** -- גם פרויקט של אדם אחד מרוויח מ-CI. זה מונע ממך לשבור דברים בטעות ומכריח אותך לכתוב tests.
- **"ה-pipeline עובר = הקוד תקין"** -- ה-pipeline בודק רק את מה שהגדרתם בו. אם אין tests מספיקים, באגים יעברו.

## דוגמה קטנה

הנה pipeline מינימלי אבל שימושי ב-GitHub Actions לפרויקט Python:

```yaml
# .github/workflows/ci.yml
name: Python CI

on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install
        run: pip install -r requirements.txt

      - name: Lint
        run: |
          pip install flake8
          flake8 . --max-line-length=120

      - name: Test
        run: pytest tests/ -v

      - name: Build image
        if: github.ref == 'refs/heads/main'
        run: docker build -t my-app:latest .
```

```
מה קורה כשעושים push:

$ git push origin main

GitHub Actions:
  ✅ Checkout code          (2s)
  ✅ Setup Python 3.11      (5s)
  ✅ Install dependencies   (15s)
  ✅ Lint (flake8)          (3s)
  ✅ Run tests (pytest)     (10s)
  ✅ Build Docker image     (30s)

Total: ~65 seconds
Status: All checks passed ✅
```

## קישורים לנושאים אחרים

- [Docker](docker.md) -- בניית images כחלק מה-pipeline
- [Kubernetes](kubernetes.md) -- היעד של ה-deploy
- [Production](../00-big-picture/production.md) -- מה זה production ולמה צריך pipeline כדי להגיע לשם
- [מפת תפקידים](../00-big-picture/roles-map.md) -- DevOps / SRE הם האנשים שבונים ומתחזקים את ה-CI/CD
