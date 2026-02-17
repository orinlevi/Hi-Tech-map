# Hi-Tech Map

מפת ידע מקיפה לעולם ההייטק — 79 דפי תוכן ב-13 מדורים.
בנוי כ-Next.js static site, מתארח ב-GitHub Pages.

**Live:** https://orinlevi.github.io/Hi-Tech-map

---

## מה יש פה

| מדור | נושאים | דוגמאות |
|------|--------|---------|
| 🌍 תמונה גדולה | 3 | AI vs ML vs DL, מפת תפקידים, פרודקשן |
| ⚡ אלגוריתמיקה | 5 | סיבוכיות, מבני נתונים, אלגוריתמים ב-ML |
| 🧠 ליבת ML | 6 | וקטורים, רשתות נוירונים, Transformers, Diffusion |
| 🌐 רשתות ותקשורת | 5 | OSI, TCP/IP, DNS |
| 🖥️ מערכות ותשתיות | 8 | Docker, K8s, CI/CD, GPU vs CPU |
| 🔒 אבטחת מידע | 5 | MITRE ATT&CK, Red/Blue Teams |
| 🗄️ נתונים ומסדי נתונים | 5 | SQL vs NoSQL, אינדקסים |
| 🌐 Full-Stack | 10 | React, Next.js, REST, GraphQL, Auth |
| ⚔️ Offensive Security | 7 | OWASP, Reverse Engineering, CTF |
| ☁️ Cloud & DevOps | 6 | Terraform, Linux, Monitoring |
| 🚀 קריירה בהייטק | 7 | ראיונות, System Design, קו"ח |
| 🤖 ML + Red Team | 6 | Adversarial ML, Malware Detection |
| 🧬 נוירומדע ו-AI | 6 | Computational Neuroscience, CNNs, LLMs |

**סה"כ: 79 נושאים, 13 מדורים.**

---

## מבנה כל דף תוכן

כל קובץ Markdown מכיל:

1. **הסבר מפורט** עם דוגמאות קוד ואנלוגיות
2. **בלבולים נפוצים** — טעויות שכדאי להימנע מהן
3. **📚 לימוד אקדמי** — קורסים חובה, מומלצים, וידע מעשי + **קורסים ספציפיים מתוכנית TAU** (מדמ"ח + פסיכולוגיה + מדעי המוח)
4. **🛤️ מאיפה מתחילים** — מסלול למידה עצמית מדורג
5. **💼 שאלות לראיון עבודה** — שאלות ותשובות מפורטות (בפורמט `??? tip` — נפתח בלחיצה)
6. **קישורים לנושאים קשורים** — links בין דפים

### פורמט Markdown

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

## הכנה למיזוג ל-orin-summaries

הפרויקט **מוכן למיזוג** לתוך orin-summaries. הנה מה שצריך לדעת:

### מה זהה בין הפרויקטים
- **CSS** (`globals.css`) — זהה לחלוטין (CSS variables, admonitions, prose, dark mode)
- **Remark plugins** — אותו קוד בדיוק (`admonitions.ts`, `rehype-admonitions.ts`, `math-fixup.ts`)
- **פונט/RTL/Dark mode** — Heebo, `lang="he" dir="rtl"`, localStorage theme
- **Tailwind 4 + PostCSS** — אותה תצורה

### מה צריך לשנות במיזוג

| נושא | hi_tech_map | orin-summaries | מה לעשות |
|------|------------|----------------|----------|
| **Link prefix** | `/Hi-Tech-map` (default prop) | `/course/hi-tech-map` | העביר `linkPrefix="/course/hi-tech-map"` ל-MarkdownRenderer |
| **Import path** | `@/lib/remark-mkdocs` | `@orin/remark-mkdocs` | למחוק `src/lib/remark-mkdocs/`, להשתמש ב-package |
| **JSON schema** | `sections.json` → sections[] | `courses.json` → courses[] | Migration script |
| **Routing** | `/[unitSlug]` flat | `/course/[courseId]/[unitSlug]` nested | שינוי מבנה pages |

### MarkdownRenderer — כבר מוכן

```tsx
// hi_tech_map — default prop, קל לשנות:
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

כל דף תוכן כולל סעיף **"מתוכנית הלימודים שלך ב-TAU"** עם קורסים ספציפיים מתוכנית הלימודים:

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
