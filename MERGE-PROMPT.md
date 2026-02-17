# פרומפט למיזוג hi_tech_map לתוך orin-summaries

העתיקי את הטקסט הבא כפרומפט פתיחה לסשן החדש:

---

## הפרומפט:

אני צריכה למזג את פרויקט **hi_tech_map** לתוך **orin-summaries**.

### מה זה hi_tech_map

פרויקט Next.js עצמאי עם 79 דפי תוכן (Markdown) ב-13 מדורים — מפת ידע מקיפה לעולם ההייטק. נמצא כאן:
```
/Users/orinlevi/Documents/studying/enrichment/hi_tech_map
```

יש לו README.md מפורט שמסביר את כל המבנה — **תקראי אותו קודם כל.**

### מה זה orin-summaries

אתר הסיכומים שלי — Turbo monorepo עם Next.js, Tailwind, auth, payments. נמצא כאן:
```
/Users/orinlevi/orin-summaries
```

### מה צריך לעשות

1. **להוסיף את hi_tech_map כקורס חדש** ב-orin-summaries — כמו שאר הקורסים באתר
2. **להעתיק את 79 קבצי ה-Markdown** מ-`hi_tech_map/content/` לתיקיית הקורסים ב-orin-summaries
3. **להמיר את `sections.json`** לפורמט של `courses.json` ב-orin-summaries
4. **לא להעתיק קוד** — hi_tech_map משתמש באותם remark plugins (`@orin/remark-mkdocs`) ואותו CSS. רק להעתיק תוכן.

### מה זהה ולא צריך להעתיק
- `src/lib/remark-mkdocs/` — אותו קוד כמו `@orin/remark-mkdocs`
- `src/app/globals.css` — אותו CSS
- `MarkdownRenderer.tsx` — אותו רכיב (רק צריך לוודא ש-`linkPrefix` מתאים)

### מה כן צריך
- **79 קבצי MD** מתיקיית `content/`
- **`sections.json`** → להמיר לפורמט של orin-summaries
- **לוודא שה-links בין דפים עובדים** (הם relative, ה-link rewriting ב-orin-summaries יטפל)

### הערות חשובות
- ה-`MarkdownRenderer` ב-hi_tech_map כבר מקבל `linkPrefix` כ-prop (ברירת מחדל `/Hi-Tech-map`). ב-orin-summaries צריך להעביר `/course/hi-tech-map`.
- כל קבצי ה-Markdown משתמשים ב-MkDocs admonitions (`!!! note`, `??? tip`), נוסחאות KaTeX, ו-GFM tables — הכל כבר נתמך ב-orin-summaries.
- יש 75 קבצים עם המלצות ספציפיות לקורסים מתוכנית TAU (בסעיף `📚 לימוד אקדמי`).
