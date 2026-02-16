# מפת תפקידים (Roles Map)

## Why it matters

עולם ההייטק מלא בתפקידים עם שמות שנשמעים דומה אבל שונים מאוד בפועל. הבנת **מי עושה מה** עוזרת לכם לדעת לאיזה כיוון ללמוד, מה דורשים ממכם ב-Job Description, ואיך צוות שלם עובד ביחד כדי לבנות מוצר.

!!! note "שימו לב"
    אין "תפקיד אחד נכון" -- הרבה אנשים עוברים בין תפקידים במהלך הקריירה, והגבולות בין תפקידים משתנים בין חברות.

---

## Core ideas

### התפקידים המרכזיים בהייטק

#### :material-code-braces: Software Engineer (מהנדס/ת תוכנה)

- **מה עושים ביומיום**: כותבים קוד, מעצבים מערכות, עושים Code Review, מתקנים Bugs.
- **התמחויות נפוצות**:
    - **Backend** -- צד שרת: APIs, Databases, Business Logic.
    - **Frontend** -- צד לקוח: ממשק משתמש, HTML/CSS/JS, React/Vue.
    - **Full-Stack** -- שילוב של שניהם.
    - **Embedded** -- תוכנה שרצה על חומרה (מכשירים רפואיים, IoT, רכב).
- **שפות נפוצות**: Python, Java, JavaScript, C++, Go, Rust.

#### :material-chart-scatter-plot: Data Scientist

- **מה עושים ביומיום**: מנתחים Data, בונים מודלים סטטיסטיים ו-ML, מציגים Insights לצוות.
- **כלים**: Python (Pandas, Scikit-learn), Jupyter Notebooks, SQL, כלי Visualization.
- **דגש**: שאלות עסקיות -- "למה לקוחות עוזבים?", "מה ישפר את ה-Conversion Rate?".

#### :material-robot: ML Engineer

- **מה עושים ביומיום**: לוקחים מודל של Data Scientist ו**מביאים אותו ל-Production** -- בונים Pipelines, מאמנים מודלים בקנה מידה גדול, עושים Optimization.
- **כלים**: Python, PyTorch/TensorFlow, Docker, Kubernetes, MLflow.
- **דגש**: Engineering -- ביצועים, Scalability, Monitoring.

#### :material-cloud-cog: DevOps Engineer

- **מה עושים ביומיום**: בונים ומתחזקים את ה-Infrastructure -- שרתים, CI/CD Pipelines, Monitoring, ניהול Cloud.
- **כלים**: Docker, Kubernetes, Terraform, Jenkins/GitHub Actions, AWS/GCP/Azure.
- **דגש**: שהמערכת תהיה **זמינה, יציבה, ומהירה**.

#### :material-shield-check: Security Engineer (מהנדס/ת אבטחה)

- **מה עושים ביומיום**: מחפשים ומתקנים פרצות אבטחה, כותבים כלי הגנה, עושים Penetration Testing.
- **התמחויות**: Application Security, Network Security, Cloud Security, Red Team / Blue Team.
- **דגש**: למנוע פריצות, דליפת Data, ולהגן על המשתמשים.

#### :material-test-tube: QA Engineer (מהנדס/ת בדיקות)

- **מה עושים ביומיום**: כותבים ומריצים Tests (ידניים ואוטומטיים), מוצאים Bugs, מוודאים שהמוצר עובד כמו שצריך.
- **כלים**: Selenium, Cypress, Pytest, Postman, JIRA.
- **דגש**: **איכות** -- שום Feature לא יוצא ל-Production בלי שנבדק.

#### :material-lightbulb-on: Product Manager (PM)

- **מה עושים ביומיום**: מגדירים **מה** לבנות ו**למה**, מתעדפים Features, מדברים עם לקוחות, כותבים Specs.
- **כלים**: JIRA, Figma (לעיצוב), Notion, Mixpanel (Analytics).
- **דגש**: הגשר בין הטכנולוגיה לבין הצרכים העסקיים.

### איך התפקידים עובדים ביחד

```
        ┌──────────┐
        │ Product  │  מחליט מה לבנות
        │ Manager  │
        └────┬─────┘
             │ Spec / User Stories
             ▼
   ┌─────────────────────┐
   │  Software Engineers  │  כותבים את הקוד
   │  (Backend, Frontend) │
   └────┬────────────┬────┘
        │            │
        ▼            ▼
  ┌──────────┐ ┌──────────┐
  │    QA    │ │ Security │  בודקים איכות ואבטחה
  └──────────┘ └──────────┘
        │            │
        ▼            ▼
   ┌─────────────────────┐
   │      DevOps          │  מעלים ל-Production
   │  (CI/CD, Infra)      │
   └──────────────────────┘
        │
        ▼
   ┌─────────────────────┐
   │  Data Scientist +    │  מנתחים Data מ-Production
   │  ML Engineer         │  ומשפרים את המוצר
   └──────────────────────┘
```

??? tip "איפה כל תפקיד רלוונטי במפה הזאת?"
    | תפקיד | מדורים רלוונטיים במפה |
    |--------|----------------------|
    | Software Engineer | אלגוריתמיקה, רשתות, מערכות, נתונים |
    | Data Scientist | ליבת ML, אלגוריתמיקה, נתונים |
    | ML Engineer | ליבת ML, מערכות, נתונים |
    | DevOps | מערכות, רשתות, אבטחה |
    | Security Engineer | אבטחה, רשתות, מערכות |
    | QA Engineer | מערכות, אלגוריתמיקה |
    | Product Manager | תמונה גדולה (כל המדורים ברמת הבנה כללית) |

---

## Common confusions

!!! warning "Data Scientist מול ML Engineer"
    זה הבלבול הכי נפוץ. הנה ההבדל בקצרה:

    | | Data Scientist | ML Engineer |
    |---|---------------|-------------|
    | **שאלת מפתח** | "האם יש Pattern ב-Data?" | "איך אני מריץ את המודל ב-Production?" |
    | **Output** | ניתוח, גרפים, מודל ב-Notebook | Service שרץ 24/7, Pipeline אוטומטי |
    | **Skills** | סטטיסטיקה, Visualization, ML | Engineering, Docker, APIs, Optimization |
    | **אנלוגיה** | שף שמפתח מתכון חדש | מנהל מסעדה שמבשל את המנה ב-Scale |

!!! warning "DevOps זה לא 'סתם IT'"
    DevOps הוא לא "האיש שמתקן את המדפסת". DevOps Engineers בונים **תשתיות ענן**, כותבים **קוד אוטומציה**, ואחראיים שמערכות שמשרתות מיליוני משתמשים יהיו זמינות 24/7.

!!! warning "Product Manager הוא לא Project Manager"
    - **Product Manager** -- מחליט **מה** לבנות ו**למה** (אסטרטגיה, חזון מוצר).
    - **Project Manager** -- מנהל **איך** ו**מתי** (לוחות זמנים, משאבים, Deadlines).
    - בחלק מהחברות אדם אחד עושה את שניהם, אבל אלה תפקידים שונים.

---

## Tiny example

נניח שחברה רוצה להוסיף Feature של **"המלצות מוצרים מותאמות אישית"** לאתר שלה. ככה כל תפקיד נכנס לתמונה:

```
1. Product Manager:  "מחקר שוק מראה שהמלצות אישיות מעלות
                      מכירות ב-15%. בואו נבנה את זה."

2. Data Scientist:   "ניתחתי את ה-Data -- מודל Collaborative
                      Filtering נותן תוצאות טובות. הנה Notebook
                      עם הדגמה."

3. ML Engineer:      "לקחתי את המודל, עטפתי אותו ב-API,
                      ובניתי Pipeline שמאמן אותו מחדש כל לילה."

4. Backend Engineer: "שילבתי את ה-API של ההמלצות בתוך
                      ה-Backend של האתר."

5. Frontend Engineer:"הוספתי קומפוננטת 'מומלץ עבורך' בעמוד
                      הראשי."

6. QA Engineer:      "בדקתי שההמלצות נטענות מהר, ושאין
                      Bugs -- כולל Edge Cases כמו משתמש חדש
                      בלי היסטוריה."

7. DevOps Engineer:  "הקמתי CI/CD Pipeline שבודק ומעלה
                      את השינוי ל-Production באופן אוטומטי."

8. Security Engineer:"וידאתי שה-Data של המשתמשים לא נחשף
                      ושה-API מוגן מפני התקפות."
```

!!! tip "שימו לב"
    כל תפקיד תרם חלק קריטי. בלי אפילו אחד מהם -- ה-Feature לא היה מגיע למשתמשים בצורה בטוחה ויציבה.

---

## Links to other notes

- [AI, ML & DL](./ai-ml-dl.md) -- מהן הטכנולוגיות שחלק מהתפקידים האלה עובדים איתן?
- [פרודקשן (Production)](./production.md) -- לאן כל התפקידים מכוונים בסוף?
- [CI/CD](../04-systems/ci-cd.md) -- כלי המפתח של DevOps Engineer
