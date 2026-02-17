# 🌐 HTML & CSS — היסודות

> **HTML — השלד. CSS — האיפור. JavaScript — האישיות.**
> ואם האתר לא responsive — כנראה שכחת את ה-viewport meta tag.

---

## HTML — מבנה הדף

HTML (HyperText Markup Language) הוא שפת הסימון שמגדירה את **מבנה** דף האינטרנט.

### Semantic HTML

שימוש בתגיות שמתארות את **המשמעות** של התוכן:

```html
<!-- ❌ לא סמנטי -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">...</div>
  <div class="sidebar">...</div>
</div>
<div class="footer">...</div>

<!-- ✅ סמנטי -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

!!! info "למה Semantic HTML חשוב?"
    1. **נגישות** — קוראי מסך מבינים את המבנה
    2. **SEO** — Google מבין את התוכן טוב יותר
    3. **תחזוקה** — קוד קריא יותר
    4. **סטנדרטים** — HTML5 מצפה שתשתמשו בזה

### תגיות חשובות

| תגית | תפקיד |
|---|---|
| `<header>` | כותרת עליונה |
| `<nav>` | תפריט ניווט |
| `<main>` | תוכן ראשי (אחד בדף!) |
| `<article>` | תוכן עצמאי |
| `<section>` | קבוצת תוכן קשורה |
| `<aside>` | תוכן צדדי |
| `<figure>` | תמונה + כיתוב |
| `<time>` | תאריך/שעה |

---

## CSS — עיצוב

### Selectors

```css
/* Element */
p { color: blue; }

/* Class */
.card { border: 1px solid gray; }

/* ID */
#header { background: white; }

/* Descendant */
.card p { font-size: 14px; }

/* Direct child */
.card > h2 { margin: 0; }

/* Pseudo-classes */
a:hover { text-decoration: underline; }
li:nth-child(odd) { background: #f5f5f5; }
input:focus { outline: 2px solid blue; }

/* Pseudo-elements */
p::first-line { font-weight: bold; }
.quote::before { content: "«"; }
```

### Specificity — עדיפות

```
!important > inline style > #id > .class > element
1000         100           10     1
```

!!! warning "הימנעו מ-!important"
    `!important` שובר את כל מערכת ה-specificity.
    אם אתם צריכים `!important` — כנראה שמשהו במבנה ה-CSS לא נכון.
    (חוץ מ-utility classes כמו `.hidden { display: none !important; }`)

---

## Flexbox

Flexbox הוא מערכת פריסה **חד-ממדית** — שורה או עמודה.

```css
.container {
  display: flex;
  justify-content: center;    /* ציר ראשי */
  align-items: center;        /* ציר משני */
  gap: 16px;                  /* רווח בין items */
  flex-wrap: wrap;             /* שבירת שורה */
}

.item {
  flex: 1;                     /* גדל באופן שווה */
  flex-basis: 200px;           /* גודל בסיס */
  flex-shrink: 0;              /* לא מתכווץ */
}
```

??? tip "הטריק הכי שימושי ב-Flexbox"
    מרכוז אנכי + אופקי:
    ```css
    .center-everything {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    ```
    זה עובד. תמיד. בלי `margin: auto` ובלי `position: absolute`.

---

## CSS Grid

Grid הוא מערכת פריסה **דו-ממדית** — שורות ועמודות.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 עמודות שוות */
  grid-template-rows: auto;
  gap: 20px;
}

/* פריסה responsive */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

/* מיקום ספציפי */
.hero {
  grid-column: 1 / -1;     /* כל הרוחב */
  grid-row: 1 / 3;          /* 2 שורות */
}
```

!!! note "Flexbox מול Grid"
    **Flexbox** — כשצריך פריסה בכיוון אחד (navbar, card row, button group).
    **Grid** — כשצריך פריסה דו-ממדית (layout שלם, gallery, dashboard).
    אפשר לשלב! Grid ל-layout הכללי, Flexbox בתוך כל card.

---

## Responsive Design

```css
/* Mobile First */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

אל תשכחו את ה-meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## נגישות (Accessibility)

```html
<!-- תמונות — alt חובה -->
<img src="chart.png" alt="גרף המציג עלייה של 30% במכירות">

<!-- כפתורים — טקסט ברור -->
<button aria-label="סגור חלון">✕</button>

<!-- Forms — labels -->
<label for="email">אימייל:</label>
<input id="email" type="email" required>

<!-- ניווט מקלדת -->
<div role="dialog" aria-modal="true" tabindex="-1">
  ...
</div>
```

!!! note "נגישות זה לא בונוס"
    באירופה (WCAG) ובישראל (תקן 5568) נגישות היא **חובה חוקית**.
    בלי נגישות — אתם מפסידים משתמשים ומסתכנים בתביעות.

---

## 🛤️ מאיפה מתחילים

1. **HTML בסיסי** — תגיות, forms, semantic elements → freeCodeCamp
2. **CSS בסיסי** — selectors, box model, colors, typography
3. **Flexbox** — תרגול ב-[Flexbox Froggy](https://flexboxfroggy.com/)
4. **Grid** — תרגול ב-[Grid Garden](https://cssgridgarden.com/)
5. **Responsive** — media queries, mobile-first approach
6. **פרויקט** — בנו דף נחיתה responsive מאפס
7. **Tailwind CSS** — utility-first framework (אופציונלי אבל פופולרי מאוד)

!!! tip "עצת חיים"
    אל תנסו לשנן את כל ה-CSS properties. אף אחד לא זוכר את כולם.
    MDN Web Docs + DevTools → זה כל מה שצריך. גם מפתחים עם 20 שנות ניסיון גוגלים "css center div".

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Flexbox ל-Grid?"
    **Flexbox** — פריסה חד-ממדית (שורה או עמודה). מתאים ל-navbar, card row, button group.
    **Grid** — פריסה דו-ממדית (שורות + עמודות). מתאים ל-page layout, gallery, dashboard.
    אפשר לשלב: Grid ל-layout כללי, Flexbox בתוך components.

??? tip "מה זה Box Model?"
    כל element ב-CSS מורכב מ-4 שכבות:
    1. **Content** — התוכן עצמו
    2. **Padding** — רווח פנימי
    3. **Border** — גבול
    4. **Margin** — רווח חיצוני
    `box-sizing: border-box` → width כולל padding + border (ברירת מחדל מומלצת).

??? tip "מה ההבדל בין `position: relative` ל-`absolute`?"
    - **relative** — זזים ביחס למיקום המקורי. לא משנה את ה-flow.
    - **absolute** — זזים ביחס ל-parent הראשון שהוא `relative/absolute/fixed`. יוצא מה-flow.
    - **fixed** — ביחס ל-viewport. נשאר במקום בגלילה.
    - **sticky** — שילוב — relative עד שמגיעים לנקודה מסוימת, אז fixed.

??? tip "מה זה Semantic HTML ולמה זה חשוב?"
    שימוש בתגיות שמתארות משמעות (`<article>`, `<nav>`, `<header>`) במקום `<div>` גנרי.
    חשוב ל: נגישות (קוראי מסך), SEO (Google), תחזוקת קוד, וסטנדרטים.

??? tip "איך עושים מרכוז אנכי ב-CSS?"
    3 דרכים מודרניות:
    1. `display: flex; align-items: center; justify-content: center;`
    2. `display: grid; place-items: center;`
    3. `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`
    הראשונה היא הנפוצה ביותר.

??? tip "מה זה CSS Specificity ואיך פותרים conflicts?"
    Specificity קובע איזה כלל CSS מנצח כשיש התנגשות:
    inline style (1000) > #id (100) > .class (10) > element (1).
    פתרונות: BEM naming, CSS Modules, Tailwind utility classes, CSS-in-JS.
