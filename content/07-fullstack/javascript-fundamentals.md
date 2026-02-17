# ⚡ JavaScript — מהבסיס

> **JavaScript — השפה היחידה שבה `[] + [] === ""` זה behavior מתועד.**
> ובכל זאת, היא מריצה את האינטרנט כולו.

---

## משתנים ו-Scope

```javascript
var x = 1;    // function scope — הימנעו
let y = 2;    // block scope — מומלץ
const z = 3;  // block scope + immutable binding — ברירת מחדל
```

!!! warning "var vs let vs const"
    `var` → function scope, hoisting, ניתן להגדרה מחדש. **אל תשתמשו.**
    `let` → block scope, לא hoisted לערך. לשינויים.
    `const` → block scope, חייב initialization. **ברירת מחדל.**

---

## פונקציות

```javascript
// Function Declaration — hoisted
function greet(name) {
  return `שלום ${name}!`;
}

// Function Expression
const greet = function(name) {
  return `שלום ${name}!`;
};

// Arrow Function
const greet = (name) => `שלום ${name}!`;
```

---

## Closures

Closure = פונקציה שזוכרת את ה-scope שבו נוצרה.

```javascript
function createCounter() {
  let count = 0;  // משתנה "סגור" בתוך ה-closure
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
```

!!! note "Closure בראיון"
    Closures הם שאלה קלאסית בראיונות. הם הבסיס ל-modules, event handlers, ו-data privacy ב-JS.

---

## Prototypes ו-Classes

```javascript
// ES6 Class (syntactic sugar מעל prototypes)
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks! 🐕`;
  }
}

const dog = new Dog("Rex");
dog.speak(); // "Rex barks! 🐕"
```

---

## Event Loop

JavaScript הוא **single-threaded** אבל **asynchronous** — בזכות ה-Event Loop.

```
┌─────────────────┐
│   Call Stack     │  ← synchronous code
└────────┬────────┘
         │
┌────────▼────────┐
│  Microtask Queue │  ← Promises, queueMicrotask
└────────┬────────┘
         │
┌────────▼────────┐
│  Macrotask Queue │  ← setTimeout, setInterval, I/O
└─────────────────┘
```

```javascript
console.log("1");                    // sync
setTimeout(() => console.log("2"), 0); // macro
Promise.resolve().then(() => console.log("3")); // micro
console.log("4");                    // sync

// Output: 1, 4, 3, 2
```

---

## Promises ו-Async/Await

```javascript
// Promise
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json())
    .catch(err => console.error(err));
}

// Async/Await — syntactic sugar
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

// Parallel execution
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
```

---

## Destructuring ו-Spread

```javascript
// Object destructuring
const { name, age, ...rest } = user;

// Array destructuring
const [first, second, ...others] = items;

// Spread operator
const newUser = { ...user, age: 30 };
const combined = [...arr1, ...arr2];

// Default values
const { theme = "light", lang = "he" } = settings;
```

---

## 🛤️ מאיפה מתחילים

1. **בסיס** — variables, types, operators, conditions, loops
2. **פונקציות** — declarations, expressions, arrows, closures
3. **אובייקטים ומערכים** — methods, destructuring, spread
4. **Async** — callbacks → Promises → async/await
5. **DOM** — querySelector, events, manipulation
6. **ES6+** — modules, classes, template literals, optional chaining
7. **פרויקט** — בנו Todo app או Weather app

!!! tip "המלצה"
    javascript.info — המדריך הכי מקיף ב-JavaScript. בחינם. תתחילו שם.

---

## 💼 שאלות לראיון עבודה

??? tip "הסבירו את ה-Event Loop ב-JavaScript."
    JS הוא single-threaded עם event loop. Call Stack מריץ קוד סינכרוני.
    Tasks אסינכרוניות (setTimeout, fetch) נשלחות ל-Web APIs ואז ל-queues.
    Microtasks (Promises) רצות לפני Macrotasks (setTimeout).
    סדר: Call Stack → Microtask Queue → Macrotask Queue.

??? tip "מה זה Closure ולמה זה שימושי?"
    Closure = פונקציה שזוכרת את ה-lexical scope שבו נוצרה, גם אחרי שה-scope נסגר.
    שימושים: data privacy, factory functions, memoization, event handlers.

??? tip "מה ההבדל בין `==` ל-`===`?"
    `==` — abstract equality, עושה type coercion (`"1" == 1` → true).
    `===` — strict equality, בלי coercion (`"1" === 1` → false).
    **תמיד** השתמשו ב-`===`. אין סיבה לגיטימית ל-`==`.

??? tip "מה זה `this` ב-JavaScript?"
    `this` תלוי **באיך** הפונקציה נקראה:
    - Method call: `obj.fn()` → `this` = obj
    - Function call: `fn()` → `this` = window/undefined (strict)
    - Constructor: `new Fn()` → `this` = אובייקט חדש
    - Arrow function: `this` = ה-scope החיצוני (lexical)
    - `bind/call/apply`: `this` = הערך שהועבר

??? tip "הסבירו Promises ו-async/await."
    Promise = אובייקט שמייצג ערך עתידי (pending → fulfilled/rejected).
    async/await = syntactic sugar מעל Promises. `await` מחכה לתוצאה.
    `Promise.all()` = מקבילי. `Promise.allSettled()` = מקבילי גם עם שגיאות.
    `Promise.race()` = הראשון שמסיים מנצח.

??? tip "מה זה Hoisting?"
    JS מעלה declarations לתחילת ה-scope לפני הרצה:
    - `var` — hoisted עם ערך `undefined`
    - `let/const` — hoisted אבל ב-TDZ (Temporal Dead Zone) — error לפני ההצהרה
    - `function declaration` — hoisted לגמרי (כולל body)
    - `function expression` — לא hoisted
