# 🧪 בדיקות — Unit, Integration, E2E

> **"קוד בלי בדיקות הוא כמו מצנח שלא בדקו — אולי יעבוד, אולי לא."**
> — כל Tech Lead אי פעם

---

## Testing Pyramid

```
        /  E2E  \        ← מעט, יקר, איטי
       / Integr. \       ← בינוני
      /   Unit    \      ← הרבה, זול, מהיר
     ──────────────
```

| סוג | מה בודק | כמה | מהירות |
|-----|---------|-----|--------|
| **Unit** | פונקציה בודדת | הרבה | מהיר |
| **Integration** | אינטגרציה בין מודולים | בינוני | בינוני |
| **E2E** | flow שלם מנקודת מבט משתמש | מעט | איטי |

---

## Unit Tests עם Jest

```javascript
// math.js
function add(a, b) { return a + b; }
function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

// math.test.js
describe("math", () => {
  test("add returns sum", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("divide throws on zero", () => {
    expect(() => divide(1, 0)).toThrow("Division by zero");
  });
});
```

---

## React Testing Library

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

test("increments counter", () => {
  render(<Counter />);
  const button = screen.getByRole("button", { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

!!! note "עקרון מנחה"
    **"Test behavior, not implementation."**
    בדקו מה המשתמש רואה — לא איך ה-component מממש את הלוגיקה פנימית.

---

## E2E עם Playwright

```typescript
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "user@test.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h1")).toHaveText("Welcome");
});
```

---

## 🛤️ מאיפה מתחילים

1. **Jest** — unit tests לפונקציות
2. **React Testing Library** — component tests
3. **Mocking** — jest.mock, MSW (Mock Service Worker)
4. **Playwright** — E2E tests
5. **CI** — הריצו tests ב-GitHub Actions

!!! tip "לימוד אקדמי"
    **קורסים**: הנדסת תוכנה (testing methodologies, TDD), אבטחת איכות תוכנה.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Unit, Integration ו-E2E tests?"
    **Unit** — בודק פונקציה/component בודד, isolated.
    **Integration** — בודק אינטגרציה בין modules (API + DB, component + context).
    **E2E** — בודק flow שלם מנקודת מבט המשתמש (דפדפן אמיתי).

??? tip "מה זה TDD?"
    Test-Driven Development: Red → Green → Refactor.
    1. כתוב test שנכשל (Red)
    2. כתוב minimum code שמעביר את ה-test (Green)
    3. שפר את הקוד (Refactor)

??? tip "מה זה Mocking ומתי משתמשים?"
    Mock = תחליף לdependency חיצוני (API, DB, module).
    מתי: unit tests שרוצים isolation. לא למוק הכל — integration tests צריכים real dependencies.

??? tip "מה זה Code Coverage ומה מספר טוב?"
    אחוז הקוד שנבדק. 80%+ נחשב טוב. 100% = בזבוז זמן.
    Coverage גבוה ≠ tests טובים. tests טובים = בודקים behavior ו-edge cases.
