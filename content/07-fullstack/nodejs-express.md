# 🟢 Node.js & Express

> **Node.js — כי מי צריך שפת backend נפרדת כשיש JavaScript שרץ בכל מקום.**
> Express — ה-framework הכי מינימליסטי. כל כך מינימליסטי שצריך 47 packages כדי שיעבוד.

---

## מה זה Node.js?

Node.js הוא **runtime environment** ל-JavaScript מחוץ לדפדפן, מבוסס על V8 engine.

```javascript
const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("שלום עולם!");
});
server.listen(3000);
```

---

## Event Loop

Node.js הוא **single-threaded** אבל **non-blocking** בזכות ה-Event Loop.

```
timers → pending callbacks → poll (I/O) → check (setImmediate) → close
```

!!! warning "Don't Block the Event Loop!"
    חישובים כבדים חוסמים הכל. פתרון: Worker Threads, child processes, או microservices.

---

## Express — הבסיס

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/users", async (req, res) => {
  const users = await db.users.findMany();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

app.listen(3000);
```

---

## Middleware Pattern

```javascript
// Logger
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // חובה! אחרת ה-request נתקע
}

// Auth
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  req.user = jwt.verify(token, SECRET);
  next();
}

app.use(logger);
app.use("/api", auth);
```

---

## Error Handling

```javascript
// Async wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Global error handler (4 params!)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});
```

---

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - הנדסת תוכנה — backend architecture, middleware patterns
    - רשתות מחשבים — HTTP, TCP, client-server communication

    **קורסים מומלצים:**
    - מערכות הפעלה — event loops, threads, I/O
    - מסדי נתונים — database connectivity, ORM

    **ידע מעשי:**
    - Node.js — modules, streams, event loop internals
    - Express — routing, middleware, error handling
    - REST API — CRUD operations, authentication
    - Docker + PM2 — deployment and process management

    **מתוכנית הלימודים שלך ב-TAU:**
    - Software Project (0368-2161)
    - רשתות תקשורת מחשבים (0368-3030)

---

## 🛤️ מאיפה מתחילים

1. **JavaScript חזק** — async/await, modules, error handling
2. **Node.js** — modules, fs, http, events
3. **Express** — routes, middleware, CRUD
4. **Database** — MongoDB + Mongoose או PostgreSQL + Prisma
5. **Auth** — JWT, bcrypt
6. **Deploy** — Docker, PM2

!!! tip "לימוד אקדמי"
    **קורסים רלוונטיים**: מערכות הפעלה (threads, processes), רשתות מחשבים (HTTP, TCP), מסדי נתונים.

---

## 💼 שאלות לראיון עבודה

??? tip "הסבירו את ה-Event Loop ב-Node.js."
    Event Loop מאפשר non-blocking I/O על single thread. שלבים: timers → poll → check.
    I/O רץ ב-thread pool (libuv). Microtasks (Promises) רצות בין שלבים.

??? tip "מה זה Middleware Pattern?"
    פונקציה `(req, res, next)` שמעבדת request בשרשרת.
    שימושים: logging, auth, parsing, validation, error handling.

??? tip "מה ההבדל בין CommonJS ל-ES Modules?"
    CJS: `require()` — sync, dynamic. ESM: `import` — async, static, tree-shaking.

??? tip "איך מטפלים בשגיאות ב-Express?"
    Async wrapper + global error handler (4 params). Custom AppError class.
    `process.on("unhandledRejection")` + `process.on("uncaughtException")`.
