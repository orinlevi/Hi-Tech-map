# ▲ Next.js — Framework שעושה הכל

> **Next.js — React שגדל ונהיה framework.**
> SSR, SSG, ISR, RSC — כל כך הרבה ראשי תיבות שצריך מילון נפרד.

---

## מה זה Next.js?

Next.js הוא **React framework** שמוסיף: routing, SSR, SSG, API routes, middleware, ועוד.

### App Router (Next.js 13+)

```
app/
├── layout.tsx          # Layout משותף
├── page.tsx            # דף הבית (/)
├── about/
│   └── page.tsx        # /about
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── api/
    └── users/
        └── route.ts    # API endpoint
```

---

## Server Components vs Client Components

```tsx
// Server Component (ברירת מחדל) — רץ בשרת
async function UserList() {
  const users = await db.users.findMany(); // גישה ישירה ל-DB!
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Client Component — רץ בדפדפן
"use client";
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

!!! info "כלל אצבע"
    Server Component → data fetching, static content, DB access.
    Client Component → interactivity, hooks, browser APIs, event handlers.

---

## Rendering Strategies

| Strategy | מתי | שימוש |
|----------|------|-------|
| **SSG** | Build time | בלוג, דפי marketing |
| **SSR** | כל request | dashboard, personalized content |
| **ISR** | Build + revalidate | e-commerce, news |
| **CSR** | Client-side | SPAs, real-time apps |

```tsx
// Static Generation (default)
export default function Page() { return <h1>Static</h1>; }

// SSR — opt-in
export const dynamic = "force-dynamic";

// ISR — revalidate כל 60 שניות
export const revalidate = 60;
```

---

## Static Export

```typescript
// next.config.ts
const nextConfig = {
  output: "export",       // Static HTML export
  basePath: "/my-site",   // For GitHub Pages
  images: { unoptimized: true },
};
```

!!! tip "האתר הזה בנוי עם Next.js Static Export!"
    `output: "export"` יוצר תיקיית `out/` עם HTML סטטי.
    מושלם ל-GitHub Pages — בלי שרת, בלי serverless functions.

---

## 🛤️ מאיפה מתחילים

1. **React** — components, hooks, state (חובה קודם)
2. **App Router** — file-based routing, layouts, loading/error states
3. **Data Fetching** — Server Components, `fetch`, caching
4. **Rendering** — SSG vs SSR vs ISR — מתי מה
5. **API Routes** — `route.ts` handlers
6. **Middleware** — authentication, redirects
7. **Deploy** — Vercel (one-click) או static export

!!! tip "לימוד אקדמי"
    **רקע נדרש**: הנדסת תוכנה, ארכיטקטורת תוכנה, רשתות מחשבים.
    ההבנה של HTTP, caching, ו-client-server architecture חיונית.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין SSR, SSG ו-ISR?"
    **SSG** — Static Site Generation. נבנה ב-build time. מהיר אבל לא דינמי.
    **SSR** — Server-Side Rendering. נבנה בכל request. דינמי אבל איטי יותר.
    **ISR** — Incremental Static Regeneration. SSG + revalidation. הטוב מכל העולמות.

??? tip "מה זה Server Components?"
    Components שרצים **רק בשרת**. לא נשלחים ל-client bundle.
    יתרונות: גישה ישירה ל-DB, אפס JS ל-client, data fetching בלי useEffect.
    חיסרון: אין hooks, אין event handlers, אין browser APIs.

??? tip "מה ההבדל בין App Router ל-Pages Router?"
    **Pages Router** (legacy): `pages/` dir, `getServerSideProps`, `getStaticProps`.
    **App Router** (חדש): `app/` dir, Server Components, layouts, loading.tsx, error.tsx.
    App Router = העתיד. Pages Router = legacy support.

??? tip "איך עובד Caching ב-Next.js?"
    4 שכבות: Request Memoization (per request), Data Cache (persistent), Full Route Cache (static), Router Cache (client).
    `fetch()` cached by default. `cache: 'no-store'` ל-dynamic data.
