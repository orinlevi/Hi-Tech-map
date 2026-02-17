# 🔗 REST API Design — עקרונות ותכנון

> **REST — הנח ב-Peace? לא, Representational State Transfer.**
> אבל אם תעצבו API טוב, המפתחים שלכם באמת ינוחו בשקט.

---

## מה זה REST?

REST (Representational State Transfer) = ארכיטקטורה לתקשורת בין שרת ללקוח דרך HTTP.

### HTTP Methods

| Method | פעולה | דוגמה |
|--------|-------|-------|
| `GET` | קריאה | `GET /api/users` |
| `POST` | יצירה | `POST /api/users` |
| `PUT` | עדכון מלא | `PUT /api/users/1` |
| `PATCH` | עדכון חלקי | `PATCH /api/users/1` |
| `DELETE` | מחיקה | `DELETE /api/users/1` |

### Status Codes

| קוד | משמעות |
|-----|--------|
| `200` | OK |
| `201` | Created |
| `204` | No Content (DELETE) |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `422` | Unprocessable Entity |
| `500` | Internal Server Error |

---

## עקרונות עיצוב

```
✅ GET  /api/users          → רשימת משתמשים
✅ GET  /api/users/42       → משתמש ספציפי
✅ POST /api/users          → יצירת משתמש
✅ GET  /api/users/42/posts → פוסטים של משתמש 42

❌ GET  /api/getUsers       → פועל ב-URL
❌ POST /api/deleteUser/42  → method לא נכון
```

!!! note "כלל אצבע"
    URLs = **שמות עצם** (nouns): users, posts, comments.
    HTTP methods = **פעלים** (verbs): GET, POST, PUT, DELETE.

---

## Pagination, Filtering, Sorting

```
GET /api/users?page=2&limit=20&sort=-createdAt&role=admin
```

Response:
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - הנדסת תוכנה — API design patterns, software architecture
    - רשתות מחשבים — HTTP protocol, request/response model

    **קורסים מומלצים:**
    - מערכות מבוזרות — REST principles, microservices
    - מסדי נתונים — CRUD operations, query optimization

    **ידע מעשי:**
    - REST principles — resources, methods, status codes
    - OpenAPI / Swagger — API documentation
    - Postman — API testing and debugging
    - Zod / Joi — request validation

    **מתוכנית הלימודים שלך ב-TAU:**
    - Software Project (0368-2161)
    - רשתות תקשורת מחשבים (0368-3030)

---

## 🛤️ מאיפה מתחילים

1. **HTTP** — methods, status codes, headers
2. **REST principles** — resources, stateless, uniform interface
3. **בנו CRUD API** — Express / FastAPI / Spring
4. **Validation** — Zod / Joi for request validation
5. **Documentation** — OpenAPI / Swagger

!!! tip "לימוד אקדמי"
    **קורסים**: רשתות מחשבים (HTTP protocol), הנדסת תוכנה (API design patterns), מסדי נתונים.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין PUT ל-PATCH?"
    **PUT** — עדכון **מלא**. שולח את כל ה-resource. מה שלא נשלח — נמחק.
    **PATCH** — עדכון **חלקי**. שולח רק את השדות שהשתנו.

??? tip "מה זה Idempotency?"
    פעולה idempotent = ביצוע שלה פעם או מאה פעמים נותן אותה תוצאה.
    GET, PUT, DELETE — idempotent. POST — לא (יוצר resource חדש כל פעם).

??? tip "איך מתכננים REST API versioning?"
    URL: `/api/v1/users` (נפוץ). Header: `Accept: application/vnd.api.v1+json`.
    Query: `/api/users?version=1`. הנפוץ ביותר = URL path.

??? tip "מה ההבדל בין 401 ל-403?"
    **401 Unauthorized** = "מי אתה? תתחבר." (authentication issue)
    **403 Forbidden** = "אני יודע מי אתה, אבל אין לך הרשאה." (authorization issue)
