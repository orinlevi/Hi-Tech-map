# 🔷 TypeScript — טיפוסים שמצילים חיים

> **TypeScript — כי `any` הוא לא type, זה ויתור.**
> ו-`as any` זה "אני לא יודע מה הtype אבל אני רוצה שזה יעבוד".

---

## למה TypeScript?

TypeScript = JavaScript + **type system**. מזהה באגים ב-compile time במקום ב-runtime.

```typescript
// JavaScript — נופל ב-runtime 💥
function add(a, b) { return a + b; }
add("5", 3); // "53" — string concatenation!

// TypeScript — נתפס ב-compile time ✅
function add(a: number, b: number): number { return a + b; }
add("5", 3); // Error: Argument of type 'string' is not assignable
```

---

## טיפוסים בסיסיים

```typescript
let name: string = "אורין";
let age: number = 25;
let active: boolean = true;
let items: string[] = ["a", "b"];
let tuple: [string, number] = ["age", 25];
let anything: unknown = "could be anything";
```

---

## Interfaces ו-Types

```typescript
// Interface — מתאר צורת אובייקט
interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "user";  // optional
  readonly createdAt: Date;  // immutable
}

// Type alias
type Status = "active" | "inactive" | "banned";
type Point = { x: number; y: number };

// Intersection
type AdminUser = User & { permissions: string[] };
```

!!! note "Interface vs Type"
    **Interface** — declaration merging, extends. מועדף לאובייקטים.
    **Type** — unions, intersections, mapped types. גמיש יותר.
    בפרקטיקה — שניהם עובדים. הצוות שלכם יבחר convention.

---

## Generics

```typescript
// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first<string>(["a", "b"]); // string
first([1, 2, 3]);           // number (inferred)

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

const response: ApiResponse<User[]> = {
  data: [{ id: 1, name: "Orin", email: "orin@mail.com", createdAt: new Date() }],
  status: 200,
};
```

---

## Utility Types

```typescript
Partial<User>       // כל השדות optional
Required<User>      // כל השדות required
Pick<User, "id" | "name">  // רק id ו-name
Omit<User, "email">        // הכל חוץ מ-email
Record<string, number>     // { [key: string]: number }
Readonly<User>      // כל השדות readonly
```

---

## Type Narrowing

```typescript
function processValue(val: string | number) {
  if (typeof val === "string") {
    return val.toUpperCase();  // TS יודע שזה string
  }
  return val.toFixed(2);       // TS יודע שזה number
}

// Discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect": return shape.width * shape.height;
  }
}
```

---

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - תכנות מונחה עצמים — type systems, generics, interfaces
    - הנדסת תוכנה — code quality, refactoring, design patterns

    **קורסים מומלצים:**
    - שפות תכנות — type theory, static vs dynamic typing
    - מבני נתונים — generic data structures, type safety

    **ידע מעשי:**
    - TypeScript — types, interfaces, generics, utility types
    - tsconfig.json — strict mode, compiler options
    - Zod — runtime validation with TypeScript types
    - Prisma / tRPC — type-safe full-stack development

    **מתוכנית הלימודים שלך ב-TAU:**
    - תוכנה 1 (0368-2157)
    - Software Project (0368-2161)

---

## 🛤️ מאיפה מתחילים

1. **JavaScript חזק** — TypeScript הוא superset, צריך JS קודם
2. **הוסיפו TS לפרויקט קיים** — `npm i -D typescript @types/node && npx tsc --init`
3. **בסיס** — types, interfaces, functions, arrays
4. **Generics** — הדבר הכי חשוב ב-TS
5. **Utility Types** — Partial, Pick, Omit, Record
6. **strict mode** — הפעילו `"strict": true` ב-tsconfig

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Interface ל-Type?"
    **Interface**: declaration merging, extends, מתאים לאובייקטים ו-class contracts.
    **Type**: unions (`|`), intersections (`&`), mapped types, template literals.
    בפועל — שניהם עובדים לרוב המקרים. Convention של הצוות קובע.

??? tip "מה זה Generics ומתי משתמשים?"
    Generics = type parameters שמאפשרים לכתוב קוד reusable עם type safety.
    `function identity<T>(val: T): T` — עובד עם כל type בלי `any`.
    שימושים: data structures, API responses, utility functions, React components.

??? tip "מה ההבדל בין `any` ל-`unknown`?"
    `any` — מכבה type checking לגמרי. כל פעולה מותרת.
    `unknown` — type-safe. חייב לעשות type narrowing לפני שימוש.
    **תמיד** העדיפו `unknown` על `any`.

??? tip "הסבירו Discriminated Unions."
    Union types עם shared literal property (discriminant):
    `type Result = { ok: true; data: T } | { ok: false; error: string }`
    TS יכול ל-narrow את ה-type בתוך switch/if על ה-discriminant.

??? tip "מה זה `as const` ו-`satisfies`?"
    `as const` — הופך ערכים ל-literal types readonly: `["a","b"] as const` → `readonly ["a","b"]`.
    `satisfies` — validates type בלי לאבד inference: `const x = {...} satisfies Config`.
