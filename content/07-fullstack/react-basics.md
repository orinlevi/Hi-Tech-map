# ⚛️ React — קומפוננטות, State ו-Hooks

> **React — הספריה שגרמה לכולם לכתוב HTML בתוך JavaScript ולקרוא לזה "progress".**
> ובכל זאת, היא שינתה את הדרך שבנויים אתרים.

---

## מה זה React?

React היא **ספריית UI** (לא framework) שבונה ממשקים מ-**components** — חתיכות קוד עצמאיות וניתנות לשימוש חוזר.

```jsx
function Welcome({ name }) {
  return <h1>שלום {name}! 👋</h1>;
}

// שימוש
<Welcome name="אורין" />
```

---

## JSX

JSX = JavaScript XML. מאפשר לכתוב "HTML" בתוך JavaScript.

```jsx
const element = (
  <div className="card">
    <h2>{user.name}</h2>
    <p>{isActive ? "פעיל" : "לא פעיל"}</p>
    {items.map(item => <li key={item.id}>{item.text}</li>)}
  </div>
);
```

!!! warning "JSX הוא לא HTML"
    `className` במקום `class`, `htmlFor` במקום `for`,
    `onClick` (camelCase) במקום `onclick`.

---

## useState

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>ספירה: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
    </div>
  );
}
```

---

## useEffect

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // רץ אחרי כל render שבו userId השתנה
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);

    // Cleanup function
    return () => console.log("cleaning up...");
  }, [userId]); // dependency array

  if (!user) return <p>טוען...</p>;
  return <h1>{user.name}</h1>;
}
```

!!! note "חוקי ה-Dependency Array"
    `[]` — רץ פעם אחת (mount).
    `[a, b]` — רץ כשa או b משתנים.
    ללא array — רץ **כל render** (בדרך כלל באג).

---

## Custom Hooks

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// שימוש
const [theme, setTheme] = useLocalStorage("theme", "dark");
```

---

## Context API

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

---

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - הנדסת תוכנה — component architecture, design patterns, software project
    - תכנות מונחה עצמים — state management, composition patterns

    **קורסים מומלצים:**
    - אלגוריתמים — diffing algorithms, tree structures
    - עיצוב ממשקים — UI/UX principles, user interaction

    **ידע מעשי:**
    - React — components, hooks, state, effects
    - React Router / Next.js — routing and navigation
    - Zustand / TanStack Query — state management
    - React Testing Library — component testing

    **מתוכנית הלימודים שלך ב-TAU:**
    - Software Project (0368-2161)
    - נושאים מתקדמים בתכנות (0368-3058)

---

## 🛤️ מאיפה מתחילים

1. **JavaScript + HTML/CSS** — בסיס חובה
2. **React Basics** — components, props, JSX
3. **State Management** — useState, useReducer
4. **Effects** — useEffect, cleanup, dependencies
5. **Custom Hooks** — extract logic
6. **Routing** — React Router / Next.js
7. **State Libraries** — Zustand / TanStack Query

!!! tip "לימוד אקדמי רלוונטי"
    **קורסים באוניברסיטה**: מבוא למדעי המחשב, תכנות מונחה עצמים, הנדסת תוכנה.
    הידע האקדמי ב-design patterns ו-software engineering מאוד רלוונטי ל-React.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין State ל-Props?"
    **Props** — נתונים שעוברים מ-parent ל-child. Immutable (read-only).
    **State** — נתונים פנימיים של component. Mutable (דרך setter).

??? tip "מה זה Virtual DOM?"
    עותק קל (JS object) של ה-DOM האמיתי. React משווה (diffing) בין virtual DOM ישן לחדש,
    ומעדכן רק את מה שהשתנה ב-DOM האמיתי (reconciliation). זה מה שעושה React מהיר.

??? tip "מתי להשתמש ב-useEffect?"
    Side effects: API calls, subscriptions, DOM manipulation, timers.
    **לא** ל: חישובים שנגזרים מ-state (useMemo), event handlers, rendering logic.

??? tip "מה זה React.memo ומתי משתמשים?"
    HOC שעושה shallow comparison של props. מונע re-render מיותר.
    שימוש: components "כבדים" שמקבלים props שלא משתנים הרבה.
    `const MemoedComponent = React.memo(MyComponent);`

??? tip "הסבירו את ה-Rules of Hooks."
    1. קראו ל-hooks **רק בראש** ה-component (לא בתוך if/for/nested functions).
    2. קראו ל-hooks **רק מתוך** React components או custom hooks.
    הסיבה: React מסתמך על **סדר הקריאה** כדי לזהות hooks.
