# Hi-Tech Map — תיעוד פנימי

## סטטוס

**מוזג ל-orin-summaries (פברואר 2026).**
התוכן הועתק כחלק נפרד (בדומה ל-HUJI) עם כפתור גישה בדף הבית.
ריפו זה הוא archive — כל שינוי עתידי מתבצע ב-orin-summaries.

---

## טכנולוגיות

| רכיב | טכנולוגיה |
|------|-----------|
| Framework | **Next.js 16** (App Router, static export) |
| CSS | **Tailwind CSS 4** + `@tailwindcss/postcss` |
| Markdown | **MDXRemote** (next-mdx-remote/rsc) |
| Remark plugins | remark-math, remark-gfm |
| Rehype plugins | rehype-katex, rehype-raw, rehype-slug + **custom admonitions** |
| חיפוש | **Fuse.js** (client-side fuzzy search, 81KB index) |
| פונט | Heebo (Google Fonts) |
| כיוון | RTL (`lang="he" dir="rtl"`) |
| Dark mode | localStorage toggle, CSS variables |
| Deploy | GitHub Pages (static export) |

---

## מבנה פרויקט

```
hi_tech_map/
├── content/
│   ├── sections.json          # מבנה המדורים והנושאים
│   ├── 00-big-picture/        # 3 קבצי MD
│   ├── 01-algorithmics/       # 5 קבצי MD
│   ├── 02-ml-core/            # 6 קבצי MD
│   ├── ...                    # עוד 10 תיקיות
│   └── 12-neuro-ai/           # 6 קבצי MD
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Heebo, RTL, dark mode)
│   │   ├── page.tsx           # דף הבית (hero + explainer + section cards)
│   │   ├── globals.css        # CSS variables, admonitions, prose
│   │   └── [unitSlug]/
│   │       └── page.tsx       # דף נושא (dynamic route)
│   ├── components/
│   │   ├── Navbar.tsx         # ניווט עליון + dark mode toggle
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx      # Cmd+K fuzzy search
│   │   ├── content/
│   │   │   └── MarkdownRenderer.tsx  # MDXRemote + remark pipeline
│   │   └── ui/
│   │       └── ThemeToggle.tsx
│   └── lib/
│       ├── content.ts         # getSections, getUnitBySlug, buildFileToSlugMap
│       ├── search.ts          # Fuse.js search logic
│       └── remark-mkdocs/     # Custom remark/rehype plugins
│           ├── index.ts
│           ├── admonitions.ts         # MkDocs !!! → HTML preprocessing
│           ├── rehype-admonitions.ts  # Rehype styling for admonitions
│           └── math-fixup.ts          # KaTeX Hebrew text fixes
├── scripts/
│   └── build-search-index.ts  # Build-time search index generation
├── public/
│   └── search-index.json      # Generated search index (79 units, 81KB)
├── next.config.ts             # output: "export", basePath: "/Hi-Tech-map"
├── package.json
└── tsconfig.json
```

---

## הרצה מקומית

```bash
npm install
npm run dev          # http://localhost:3000/Hi-Tech-map
npm run build        # static export → out/
```

---

## פורמט Markdown

הקבצים משתמשים ב-MkDocs admonitions:
```markdown
!!! note "כותרת"
    תוכן שתמיד פתוח

??? tip "כותרת"
    תוכן שנפתח בלחיצה (collapsible)

!!! warning "אזהרה"
    תוכן אזהרה
```

ונוסחאות KaTeX:
```markdown
$O(n \log n)$  ←  inline
$$\theta = \theta - \alpha \nabla L(\theta)$$  ←  block
```

---

## פרטי המיזוג ל-orin-summaries

### מה זהה בין הפרויקטים
- **CSS** (`globals.css`) — זהה לחלוטין
- **Remark plugins** — אותו קוד בדיוק
- **פונט/RTL/Dark mode** — Heebo, RTL, localStorage theme
- **Tailwind 4 + PostCSS** — אותה תצורה

### מה השתנה במיזוג

| נושא | hi_tech_map | orin-summaries |
|------|------------|----------------|
| **Link prefix** | `/Hi-Tech-map` (default prop) | `/course/hi-tech-map` |
| **Import path** | `@/lib/remark-mkdocs` | `@orin/remark-mkdocs` |
| **JSON schema** | `sections.json` → sections[] | `courses.json` → courses[] |
| **Routing** | `/[unitSlug]` flat | `/course/[courseId]/[unitSlug]` nested |

### MarkdownRenderer

```tsx
// hi_tech_map — default prop:
<MarkdownRenderer content={content} linkPrefix="/Hi-Tech-map" />
// orin-summaries — משנים ל:
<MarkdownRenderer content={content} linkPrefix="/course/hi-tech-map" />
```

### sections.json → courses.json

```
// hi_tech_map schema:
{ sections: [{ id, title, emoji, color, units: [{ slug, file, title }] }] }

// orin-summaries schema:
{ courses: [{ id, slug, title, category, priceILS, sections: [{ name, items: [{ id, slug, file, title, free }] }] }] }
```

---

## קורסים מתוכנית TAU

כל דף תוכן כולל סעיף **"מתוכנית הלימודים שלך ב-TAU"** עם קורסים ספציפיים.

**תוכנית:** B.Sc. דו-חוגית בפסיכולוגיה ובמדעי המחשב עם הדגש במדעי המוח
**אוניברסיטה:** אוניברסיטת תל אביב, תשפ"ה
**היקף:** 157 ש"ס (58 פסיכולוגיה, 79 מדמ"ח, 20 מדעי המוח)

### קורסי מפתח שממופים:

**מדעי המחשב:**
- אלגוריתמים (0368-2160), מבני נתונים (0368-2158), מערכות הפעלה (0368-2162)
- מבנה מחשבים (0368-2159), מודלים חישוביים (0368-2200)
- מבוא ללמידה חישובית (0368-3235), יסודות הלמידה העמוקה (0368-3080)
- NLP (0368-3077), אבטחת מידע (0368-3065), קריפטוגרפיה (0368-3049)
- רשתות תקשורת (0368-3030), למידה ממוחזקים (0368-3075)

**מדעי המוח:**
- Computational Neuroscience (1501-1028), נוירוביולוגיה (1500-2000)
- מבנה המוח (1500-2005), מידול תאי עצב (1500-3004)
- Workshop on Computational Methods in Brain Research (0368-3522)

**פסיכולוגיה:**
- פסיכולוגיה קוגניטיבית (1071-2907), תפיסה ופסיכופיזיקה (1071-2909)
- מודלים חישוביים בפסיכולוגיה (1071-2337), למידה (1071-2911)
