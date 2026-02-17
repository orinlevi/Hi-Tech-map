# 🔄 GitOps — ArgoCD ו-Flux

> **GitOps — Git הוא מקור האמת. אם זה לא ב-Git, זה לא קיים.**

---

## מה זה GitOps?

GitOps = ניהול infrastructure ו-applications דרך Git repos. Git = single source of truth.

### עקרונות
1. **Declarative** — מגדירים desired state (לא imperative scripts)
2. **Versioned** — כל שינוי ב-Git (audit trail)
3. **Automated** — agent מסנכרן Git → cluster
4. **Self-healing** — drift detection → auto-reconciliation

---

## ArgoCD

```yaml
# application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-app.git
    targetRevision: main
    path: k8s/
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Workflow
```
Developer → Push to Git → ArgoCD detects change → Sync to K8s → App updated
```

---

## ArgoCD vs Flux

| | ArgoCD | Flux |
|--|--------|------|
| **UI** | ✅ Web UI | ❌ CLI only |
| **Multi-cluster** | ✅ built-in | ✅ (with Kustomize) |
| **Helm** | ✅ | ✅ |
| **Learning curve** | בינוני | נמוך |

---

## 🛤️ מאיפה מתחילים

1. **Kubernetes** — חובה קודם (ראו section מערכות)
2. **Helm** — package management ל-K8s
3. **ArgoCD** — install on cluster, connect repo
4. **Kustomize** — environment overlays

!!! tip "לימוד אקדמי"
    **קורסים**: הנדסת תוכנה (CI/CD, version control), מערכות מבוזרות.

    **מתוכנית הלימודים שלך ב-TAU:**

    - Software Project (0368-2161)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין GitOps ל-CI/CD רגיל?"
    **CI/CD**: pipeline pushes changes → cluster (push model).
    **GitOps**: agent in cluster pulls changes from Git (pull model). More secure, self-healing.

??? tip "מה זה Drift Detection?"
    כשה-actual state ב-cluster שונה מה-desired state ב-Git.
    ArgoCD מזהה drift ויכול לתקן אוטומטית (self-heal).
