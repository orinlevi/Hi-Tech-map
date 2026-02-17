# 🔮 GraphQL — שאילתות גמישות

> **GraphQL — כי מי צריך 15 endpoints כשאפשר אחד שעושה הכל?**

---

## מה זה GraphQL?

GraphQL = שפת שאילתות ל-APIs שמאפשרת ללקוח לבקש **בדיוק** את המידע שהוא צריך.

```graphql
# REST: GET /users/1 → מחזיר את כל השדות + צריך request נפרד לposts
# GraphQL:
query {
  user(id: 1) {
    name
    email
    posts {
      title
      createdAt
    }
  }
}
```

---

## Schema

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

type Query {
  user(id: ID!): User
  users(limit: Int): [User!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  deleteUser(id: ID!): Boolean!
}
```

---

## Resolvers

```javascript
const resolvers = {
  Query: {
    user: (_, { id }) => db.users.findById(id),
    users: (_, { limit }) => db.users.findMany({ take: limit }),
  },
  Mutation: {
    createUser: (_, { name, email }) => db.users.create({ name, email }),
  },
  User: {
    posts: (user) => db.posts.findMany({ where: { authorId: user.id } }),
  },
};
```

---

## N+1 Problem ו-DataLoader

```javascript
// ❌ N+1: עבור כל user, query נפרד ל-posts
// ✅ DataLoader: batching
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.posts.findMany({ where: { authorId: { in: userIds } } });
  return userIds.map(id => posts.filter(p => p.authorId === id));
});
```

!!! warning "N+1 — הבעיה הכי נפוצה ב-GraphQL"
    בלי DataLoader, שאילתה עם 100 users תיצור 101 queries ל-DB.
    DataLoader batches ו-caches requests. **חובה** בכל GraphQL server.

---

## GraphQL מול REST

| | REST | GraphQL |
|--|------|---------|
| **Over-fetching** | נפוץ | נפתר — בוחרים שדות |
| **Under-fetching** | נפוץ | נפתר — nested queries |
| **Versioning** | v1, v2... | לא צריך — evolving schema |
| **Learning curve** | נמוך | גבוה יותר |
| **Caching** | HTTP cache | Apollo cache |

---

---

## 📚 לימוד אקדמי

!!! tip "מה ללמוד באקדמיה"
    **קורסים חובה:**
    - הנדסת תוכנה — API design, query languages, software project

    **קורסים מומלצים:**
    - מסדי נתונים — query optimization, N+1 problem
    - אלגוריתמים — graph traversal, batching strategies

    **ידע מעשי:**
    - GraphQL — schema, queries, mutations, subscriptions
    - Apollo Server/Client — full-stack GraphQL
    - DataLoader — batching and caching
    - Prisma — database integration with GraphQL

    **מתוכנית הלימודים שלך ב-TAU:**
    - Software Project (0368-2161)

---

## 🛤️ מאיפה מתחילים

1. **REST** — קודם תבינו REST היטב
2. **GraphQL Schema** — types, queries, mutations
3. **Apollo Server** — הספריה הנפוצה ביותר
4. **Apollo Client** — client-side caching
5. **DataLoader** — batching ו-caching

---

## 💼 שאלות לראיון עבודה

??? tip "מה היתרונות והחסרונות של GraphQL מול REST?"
    **יתרונות**: no over/under-fetching, schema typed, single endpoint, introspection.
    **חסרונות**: complexity, N+1 problem, file uploads harder, HTTP caching harder.

??? tip "מה זה N+1 Problem ואיך פותרים?"
    N+1 = שאילתה שגורמת ל-N queries נוספות (אחת לכל record).
    פתרון: DataLoader (batching), JOIN-based resolvers, or eager loading.

??? tip "מתי להשתמש ב-GraphQL ומתי ב-REST?"
    **GraphQL**: mobile apps (bandwidth), complex data relationships, multiple consumers.
    **REST**: simple CRUD, file uploads, microservices, public APIs, caching-heavy.
