# מפת תפקידים (Roles Map)

## Why it matters

עולם ההייטק מלא בתפקידים עם שמות שנשמעים דומה אבל שונים מאוד בפועל. הבנת **מי עושה מה** עוזרת לכם לדעת לאיזה כיוון ללמוד, מה דורשים ממכם ב-Job Description, ואיך צוות שלם עובד ביחד כדי לבנות מוצר.

בנוסף, הבנת מפת התפקידים תעזור לכם בשני דברים מעשיים: לדעת עם מי תעבדו ביומיום, ולהבין את מסלולי הקריירה האפשריים שלכם -- כי בהייטק, אף אחד לא נשאר באותו תפקיד לנצח.

!!! note "שימו לב"
    אין "תפקיד אחד נכון" -- הרבה אנשים עוברים בין תפקידים במהלך הקריירה, והגבולות בין תפקידים משתנים בין חברות.

!!! note "הערת שוליים לא רשמית"
    ב-Startup של 5 אנשים, כולם עושים הכל. מפתח Backend? גם Frontend. גם DevOps. גם תמיכה טכנית. גם מי שמזמין פיצה לצוות. ב-Startup, ה-Job Description האמיתי שלכם הוא "מה שצריך עכשיו".

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
- **מסלול קידום**: Junior -> Mid -> Senior -> Staff -> Principal / Engineering Manager.

??? tip "Backend מול Frontend -- ההבדל בקצרה"
    **Backend** זה מה שקורה "מאחורי הקלעים" -- שרתים, בסיסי נתונים, לוגיקה עסקית. **Frontend** זה מה שהמשתמש רואה ונוגע -- כפתורים, טפסים, אנימציות. **Full-Stack** עושה את שניהם, אבל בפועל -- רוב ה-Full-Stack מפתחים חזקים יותר בצד אחד.

#### :material-chart-scatter-plot: Data Scientist

- **מה עושים ביומיום**: מנתחים Data, בונים מודלים סטטיסטיים ו-ML, מציגים Insights לצוות.
- **כלים**: Python (Pandas, Scikit-learn), Jupyter Notebooks, SQL, כלי Visualization.
- **דגש**: שאלות עסקיות -- "למה לקוחות עוזבים?", "מה ישפר את ה-Conversion Rate?".
- **מסלול קידום**: Junior DS -> Senior DS -> Lead DS -> Head of Data Science.
- **קשר לתחומים אחרים**: ראו [AI, ML & DL](./ai-ml-dl.md) להבנת הטכנולוגיות שבהן הם משתמשים.

#### :material-robot: ML Engineer

- **מה עושים ביומיום**: לוקחים מודל של Data Scientist ו**מביאים אותו ל-Production** -- בונים Pipelines, מאמנים מודלים בקנה מידה גדול, עושים Optimization.
- **כלים**: Python, PyTorch/TensorFlow, Docker, Kubernetes, MLflow.
- **דגש**: Engineering -- ביצועים, Scalability, Monitoring.
- **קשר לתחומים אחרים**: ראו [פרודקשן (Production)](./production.md) להבנת איך מודלים מגיעים למשתמשים.

#### :material-database: Data Engineer

- **מה עושים ביומיום**: בונים ומתחזקים **Pipelines** שמעבירים Data ממקורות שונים למקום מרכזי (Data Warehouse / Data Lake).
- **כלים**: SQL, Python, Apache Spark, Airflow, dbt, Kafka.
- **דגש**: שה-Data יהיה **זמין, נקי, ומהיר** לכל מי שצריך אותו.
- **מסלול קידום**: Junior DE -> Senior DE -> Staff DE -> Head of Data Engineering.

!!! note "הערת שוליים לא רשמית"
    Data Engineer הוא האינסטלטור של עולם ה-Data. אף אחד לא חושב עליו עד שהצינור נסתם ופתאום אין Data ל-Dashboard. ואז כולם מתקשרים בבהלה.

#### :material-cloud-cog: DevOps Engineer

- **מה עושים ביומיום**: בונים ומתחזקים את ה-Infrastructure -- שרתים, CI/CD Pipelines, Monitoring, ניהול Cloud.
- **כלים**: Docker, Kubernetes, Terraform, Jenkins/GitHub Actions, AWS/GCP/Azure.
- **דגש**: שהמערכת תהיה **זמינה, יציבה, ומהירה**.
- **וריאציות**: **SRE (Site Reliability Engineer)** -- דומה ל-DevOps אבל עם דגש על Reliability, SLAs, ו-Error Budgets. **Platform Engineer** -- בונה כלים ותשתיות פנימיות לצוותי הפיתוח.

#### :material-shield-check: Security Engineer (מהנדס/ת אבטחה)

- **מה עושים ביומיום**: מחפשים ומתקנים פרצות אבטחה, כותבים כלי הגנה, עושים Penetration Testing.
- **התמחויות**: Application Security, Network Security, Cloud Security, Red Team / Blue Team.
- **דגש**: למנוע פריצות, דליפת Data, ולהגן על המשתמשים.
- **שכר**: מהתפקידים הכי מבוקשים ומתוגמלים בשוק כרגע.

??? tip "Red Team מול Blue Team"
    **Red Team** = "התוקפים" -- מנסים לפרוץ למערכות של החברה עצמה כדי למצוא חולשות. **Blue Team** = "המגנים" -- בונים הגנות, מנטרים ניסיונות פריצה, ומגיבים ל-Incidents. **Purple Team** = שילוב של שניהם -- ה-Red Team תוקף, ה-Blue Team מגן, ושניהם לומדים אחד מהשני.

#### :material-test-tube: QA Engineer (מהנדס/ת בדיקות)

- **מה עושים ביומיום**: כותבים ומריצים Tests (ידניים ואוטומטיים), מוצאים Bugs, מוודאים שהמוצר עובד כמו שצריך.
- **כלים**: Selenium, Cypress, Pytest, Postman, JIRA.
- **דגש**: **איכות** -- שום Feature לא יוצא ל-Production בלי שנבדק.
- **וריאציות**: **QA Automation** -- כותב קוד שבודק קוד. **SDET (Software Development Engineer in Test)** -- מפתח שמתמחה בבדיקות.

#### :material-lightbulb-on: Product Manager (PM)

- **מה עושים ביומיום**: מגדירים **מה** לבנות ו**למה**, מתעדפים Features, מדברים עם לקוחות, כותבים Specs.
- **כלים**: JIRA, Figma (לעיצוב), Notion, Mixpanel (Analytics).
- **דגש**: הגשר בין הטכנולוגיה לבין הצרכים העסקיים.
- **מסלול קידום**: Associate PM -> PM -> Senior PM -> Group PM -> VP Product -> CPO.

#### :material-palette: UX/UI Designer

- **מה עושים ביומיום**: מעצבים את חוויית המשתמש (UX) ואת הממשק הוויזואלי (UI). מבצעים User Research, בונים Wireframes ו-Prototypes.
- **כלים**: Figma, Sketch, Adobe XD, מערכות Design System.
- **דגש**: שהמוצר יהיה **נוח, אינטואיטיבי, ויפה לשימוש**.

!!! note "הערת שוליים לא רשמית"
    UX Designer הוא האדם היחיד בצוות שמייצג את המשתמש. כל השאר מייצגים את הקוד, את ה-Data, את ה-Infrastructure, או את ה-Deadline. כשה-Designer אומר "למשתמש יהיה קשה" -- כדאי להקשיב.

### Seniority Levels -- מה המשמעות

לא כל Software Engineer הוא אותו דבר. רמת ה-Seniority משפיעה על מה מצפים ממכם:

| Level | מה מצפים | אחריות |
|-------|----------|--------|
| **Junior** (0-2 שנים) | לכתוב קוד שעובד, ללמוד מהר, לשאול שאלות | משימות מוגדרות, Code Review מאחרים |
| **Mid** (2-5 שנים) | לפתור בעיות באופן עצמאי, לכתוב קוד נקי | Features מקצה לקצה, Mentoring ל-Juniors |
| **Senior** (5+ שנים) | לעצב פתרונות, לראות תמונה גדולה, להשפיע על ארכיטקטורה | החלטות טכניות, הובלת פרויקטים |
| **Staff / Principal** | לעצב מערכות שלמות, להשפיע על כיוון טכני של החברה | ארכיטקטורה בין-צוותית, תקנים טכניים |
| **Engineering Manager** | לנהל אנשים, לא קוד. גיוס, פיתוח קריירה, תהליכי עבודה | ביצועי צוות, תרבות, משאבים |

??? tip "IC Track מול Management Track"
    בהייטק יש **שני מסלולי קידום** מקבילים:

    - **IC (Individual Contributor)** -- מתקדמים טכנית: Senior -> Staff -> Principal -> Distinguished.
    - **Management** -- מנהלים אנשים: Tech Lead -> Engineering Manager -> Director -> VP Engineering -> CTO.

    אין מסלול "נכון" -- יש אנשים שמצטיינים בניהול ויש כאלה שמצטיינים בטכנולוגיה. הדבר הכי חשוב: לבחור את המסלול שמתאים **לכם**, לא מה שנראה "יוקרתי" יותר.

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

### Agile Ceremonies -- איפה כולם נפגשים

רוב הצוותים בהייטק עובדים ב-**Agile** (בדרך כלל Scrum או Kanban). הנה הטקסים שכולם מכירים:

| Ceremony | מה קורה | מי משתתף | תדירות |
|----------|---------|-----------|--------|
| **Daily Standup** | כל אחד אומר: מה עשיתי אתמול, מה אעשה היום, חסימות | כל הצוות | כל יום, 15 דקות |
| **Sprint Planning** | מתכננים את העבודה ל-Sprint הבא (בד"כ שבועיים) | PM + Engineering | תחילת Sprint |
| **Sprint Review / Demo** | מראים מה בנינו ב-Sprint | כולם (כולל Stakeholders) | סוף Sprint |
| **Retrospective** | מה עבד טוב, מה לשפר | הצוות | סוף Sprint |
| **Backlog Grooming** | מתעדפים ומפרטים Tasks לעתיד | PM + Senior Engineers | שבועי |

!!! note "הערת שוליים לא רשמית"
    Daily Standup היה אמור להיות 15 דקות. בפועל, זה 15 דקות של עדכונים + 30 דקות של דיון שהפך לפגישת ארכיטקטורה. ואז מישהו אומר "בואו ניקח את זה ל-Offline" -- מה שאומר "נדבר על זה בפגישה אחרת של 30 דקות".

??? tip "איפה כל תפקיד רלוונטי במפה הזאת?"
    | תפקיד | מדורים רלוונטיים במפה |
    |--------|----------------------|
    | Software Engineer | אלגוריתמיקה, רשתות, מערכות, נתונים |
    | Data Scientist | ליבת ML, אלגוריתמיקה, נתונים |
    | ML Engineer | ליבת ML, מערכות, נתונים |
    | Data Engineer | נתונים, מערכות |
    | DevOps | מערכות, רשתות, אבטחה |
    | Security Engineer | אבטחה, רשתות, מערכות |
    | QA Engineer | מערכות, אלגוריתמיקה |
    | Product Manager | תמונה גדולה (כל המדורים ברמת הבנה כללית) |
    | UX/UI Designer | תמונה גדולה, Frontend |

### השכר -- הפיל שבחדר

אף מדריך לימוד לא מדבר על זה, אבל כולם חושבים על זה. הנה הסדר **הכללי** (בישראל, 2024-2025, מאוד תלוי חברה וניסיון):

| תפקיד | Junior (שנתי, ברוטו) | Senior (שנתי, ברוטו) |
|--------|---------------------|---------------------|
| Software Engineer | 25K-35K | 45K-70K+ |
| Data Scientist | 25K-35K | 45K-65K+ |
| ML Engineer | 28K-38K | 50K-75K+ |
| DevOps / SRE | 28K-38K | 50K-70K+ |
| Security Engineer | 30K-40K | 55K-80K+ |
| Product Manager | 25K-35K | 50K-75K+ |

!!! note "הערת שוליים לא רשמית"
    המספרים האלה ישתנו ברגע שתקראו את זה. שכר בהייטק משתנה מהר יותר מגרסאות של JavaScript Frameworks. קחו את זה כ-Order of Magnitude, לא כאמת מידה מדויקת.

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

!!! warning "Data Engineer מול Data Scientist"
    עוד בלבול נפוץ:

    | | Data Engineer | Data Scientist |
    |---|--------------|----------------|
    | **שאלת מפתח** | "איך אני מביא את ה-Data לטבלה נקייה?" | "מה ה-Data אומר לנו?" |
    | **Output** | Pipeline, Data Warehouse, ETL | מודל, ניתוח, המלצות |
    | **אנלוגיה** | בונה את הכביש | נוהג על הכביש |

!!! warning "DevOps זה לא 'סתם IT'"
    DevOps הוא לא "האיש שמתקן את המדפסת". DevOps Engineers בונים **תשתיות ענן**, כותבים **קוד אוטומציה**, ואחראיים שמערכות שמשרתות מיליוני משתמשים יהיו זמינות 24/7.

!!! warning "Product Manager הוא לא Project Manager"
    - **Product Manager** -- מחליט **מה** לבנות ו**למה** (אסטרטגיה, חזון מוצר).
    - **Project Manager** -- מנהל **איך** ו**מתי** (לוחות זמנים, משאבים, Deadlines).
    - בחלק מהחברות אדם אחד עושה את שניהם, אבל אלה תפקידים שונים.

!!! warning "CTO מול VP Engineering"
    - **CTO** -- אחראי על **חזון טכנולוגי**, בוחר טכנולוגיות, מייצג את הצד הטכני כלפי חוץ.
    - **VP Engineering** -- אחראי על **ביצוע**, מנהל את צוותי הפיתוח, דואג שדברים ייצאו בזמן.
    - ב-Startups קטנים, זה אותו אדם. בחברות גדולות -- תפקידים שונים לגמרי.

---

## Tiny example

נניח שחברה רוצה להוסיף Feature של **"המלצות מוצרים מותאמות אישית"** לאתר שלה. ככה כל תפקיד נכנס לתמונה:

```
1. Product Manager:  "מחקר שוק מראה שהמלצות אישיות מעלות
                      מכירות ב-15%. בואו נבנה את זה."

2. UX/UI Designer:  "עיצבתי Wireframe של קומפוננטת 'מומלץ
                      עבורך'. עשיתי User Testing -- המיקום
                      הכי טוב הוא מתחת למוצר הנוכחי."

3. Data Engineer:    "בניתי Pipeline שמביא את כל ה-Purchase
                      History וה-Browsing Data לטבלה נקייה
                      ב-Data Warehouse."

4. Data Scientist:   "ניתחתי את ה-Data -- מודל Collaborative
                      Filtering נותן תוצאות טובות. הנה Notebook
                      עם הדגמה."

5. ML Engineer:      "לקחתי את המודל, עטפתי אותו ב-API,
                      ובניתי Pipeline שמאמן אותו מחדש כל לילה."

6. Backend Engineer: "שילבתי את ה-API של ההמלצות בתוך
                      ה-Backend של האתר."

7. Frontend Engineer:"הוספתי קומפוננטת 'מומלץ עבורך' בעמוד
                      הראשי, לפי העיצוב."

8. QA Engineer:      "בדקתי שההמלצות נטענות מהר, ושאין
                      Bugs -- כולל Edge Cases כמו משתמש חדש
                      בלי היסטוריה."

9. DevOps Engineer:  "הקמתי CI/CD Pipeline שבודק ומעלה
                      את השינוי ל-Production באופן אוטומטי."

10. Security Engineer:"וידאתי שה-Data של המשתמשים לא נחשף
                       ושה-API מוגן מפני התקפות."
```

!!! tip "שימו לב"
    כל תפקיד תרם חלק קריטי. בלי אפילו אחד מהם -- ה-Feature לא היה מגיע למשתמשים בצורה בטוחה ויציבה.

---

## 🛤️ מאיפה מתחילים

לא בטוחים איזה תפקיד מתאים לכם? הנה מסלול גילוי:

**שלב 1: חשיפה רחבה (2-4 שבועות)**

1. ללמוד Python בסיסי -- הוא רלוונטי ל-Backend, Data Science, ML, DevOps
2. ללמוד HTML/CSS/JS בסיסי -- בשביל להבין Frontend
3. להתנסות ב-SQL -- כל תפקיד צריך לדבר עם Database
4. לקרוא Job Descriptions בכל התפקידים ולסמן מה מעניין

**שלב 2: ניסוי (4-6 שבועות)**

1. לבנות פרויקט Full-Stack קטן (React + FastAPI + PostgreSQL)
2. לנסות לנתח Dataset ב-Pandas ולבנות מודל ML פשוט
3. לעשות Docker ל-פרויקט שלכם ולהגדיר GitHub Actions
4. לשים לב: **מה הכי סיפק אתכם?**

**שלב 3: התמחות (בהתאם לכיוון)**

1. **אוהבים לבנות מערכות?** -> Software Engineer (Backend/Full-Stack)
2. **אוהבים Data וסטטיסטיקה?** -> Data Scientist / Data Analyst
3. **אוהבים ML + Engineering?** -> ML Engineer
4. **אוהבים אוטומציה ותשתיות?** -> DevOps / SRE
5. **אוהבים למצוא חולשות?** -> Security Engineer
6. **אוהבים לפתור בעיות עסקיות?** -> Product Manager
7. **אוהבים עיצוב וחוויית משתמש?** -> UX/UI Designer

**שלב 4: בניית Portfolio (שוטף)**

1. לבנות 2-3 פרויקטים שמדגימים את הכישורים הרלוונטיים
2. לתרום ל-Open Source (גם PR קטן של תיקון תיעוד נחשב)
3. לכתוב על מה שלמדתם (בלוג, GitHub README, LinkedIn)

??? tip "הטיפ הכי חשוב: לא צריך להחליט עכשיו"
    הרבה אנשים מתחילים כ-Software Engineer ואחרי כמה שנים עוברים ל-ML Engineering או Product Management. התחילו ממה שמעניין אתכם **עכשיו**, והקריירה תתפתח. הדבר הכי גרוע הוא לא להתחיל בכלל כי "עוד לא החלטתם".

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Data Scientist ל-ML Engineer?"
    **Data Scientist** מתמקד בשאלות עסקיות, ניתוח Data, ובניית מודלים ב-Notebook. **ML Engineer** לוקח את המודל ובונה ממנו Service שרץ ב-Production -- כולל Pipelines, Monitoring, ו-Optimization. Data Scientist = "המודל עובד על 1000 דוגמאות במחשב שלי". ML Engineer = "המודל משרת 10 מיליון בקשות ביום עם 50ms Latency".

??? tip "מה ההבדל בין Product Manager ל-Project Manager?"
    **Product Manager** אחראי על ה-**"מה" ו"למה"** -- חזון המוצר, אסטרטגיה, תעדוף Features על בסיס Value ללקוח. **Project Manager** אחראי על ה-**"איך" ו"מתי"** -- לוחות זמנים, Milestones, ניהול משאבים. PM שואל "האם אנחנו בונים את הדבר הנכון?". PjM שואל "האם אנחנו בונים את זה בזמן?".

??? tip "מה התפקיד של DevOps Engineer?"
    DevOps Engineer אחראי על כל מה שבין "המפתח כתב קוד" ל"המשתמש רואה את התוצאה". זה כולל: **CI/CD Pipelines** (בנייה ובדיקות אוטומטיות), **Infrastructure as Code** (Terraform, CloudFormation), **Container Orchestration** (Docker, Kubernetes), **Monitoring & Alerting** (Prometheus, Grafana), ו-**Cloud Management** (AWS/GCP/Azure). ראו גם [פרודקשן (Production)](./production.md).

??? tip "מה זה Agile ומה ההבדל בין Scrum ל-Kanban?"
    **Agile** הוא פילוסופיית עבודה שמעדיפה Iterations קצרות, Feedback מהיר, ו-Flexibility על פני תכנון קשיח מראש. **Scrum** הוא Framework ספציפי: Sprints של 2-4 שבועות, Ceremonies קבועים (Planning, Daily, Review, Retro), Roles מוגדרים (Scrum Master, PO). **Kanban** גמיש יותר: לוח משימות רציף בלי Sprints, מגבלת WIP (Work in Progress), דגש על Flow.

??? tip "מה ההבדל בין Junior ל-Senior Engineer?"
    **Junior** כותב קוד שעובד. **Senior** כותב קוד שעובד, קל לתחזק, קל לבדוק, ומשתלב בארכיטקטורה הכללית. מעבר לקוד: Senior מזהה בעיות לפני שהן קורות, מנטר Junior Engineers, משפיע על החלטות טכניות, ומסוגל לקחת Feature מסוים מהגדרה ועד Production בלי הכוונה.

??? tip "איך עובד צוות פיתוח טיפוסי?"
    צוות טיפוסי (Squad/Team) כולל 5-8 אנשים: PM אחד, 3-5 Engineers (Backend + Frontend), QA אחד, ולפעמים Designer. יש להם Backlog של משימות, עובדים ב-Sprints של שבועיים, ויש Daily Standup. ה-DevOps בד"כ לא יושב בצוות ספציפי אלא משרת כמה צוותים (או שיש Platform Team ייעודי).

??? tip "מה זה Tech Lead ואיך זה שונה מ-Engineering Manager?"
    **Tech Lead** הוא ה-Senior Engineer שמוביל את ההחלטות הטכניות של הצוות -- ארכיטקטורה, Code Review, תקנים. הוא עדיין כותב קוד. **Engineering Manager** מנהל אנשים -- 1:1s, ביצועים, קריירה, גיוס. הוא כמעט לא כותב קוד. בחלק מהחברות אדם אחד עושה את שניהם (TLM - Tech Lead Manager), אבל זה מאוד עמוס.

---

## Links to other notes

- [AI, ML & DL](./ai-ml-dl.md) -- מהן הטכנולוגיות שחלק מהתפקידים האלה עובדים איתן?
- [פרודקשן (Production)](./production.md) -- לאן כל התפקידים מכוונים בסוף?
- [CI/CD](../04-systems/ci-cd.md) -- כלי המפתח של DevOps Engineer
