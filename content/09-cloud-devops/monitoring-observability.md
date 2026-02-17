# 📊 Monitoring & Observability

> **"אם אתה לא מודד את זה, אתה לא יודע את זה."**
> ו-"אם אתה מודד יותר מדי, אתה לא מבין כלום."

---

## Three Pillars of Observability

| עמוד | מה | כלים |
|------|-----|------|
| **Logs** | אירועים discreteness | ELK, Loki, CloudWatch |
| **Metrics** | מספרים aggregated | Prometheus, Datadog |
| **Traces** | request flow across services | Jaeger, Zipkin |

---

## Prometheus + Grafana

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'my-app'
    static_configs:
      - targets: ['localhost:3000']
```

```javascript
// Express app — custom metrics
const { Counter, Histogram } = require('prom-client');

const requestCount = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

const requestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Request duration',
  labelNames: ['method', 'path'],
});
```

---

## SLOs, SLIs, SLAs

| | מה זה | דוגמה |
|--|-------|-------|
| **SLI** | מדד (indicator) | 99.5% of requests < 200ms |
| **SLO** | יעד (objective) | "Availability = 99.9%" |
| **SLA** | חוזה (agreement) | "אם נפול מתחת 99.9% — פיצוי" |

---

## 🛤️ מאיפה מתחילים

1. **Prometheus + Grafana** — monitoring stack בסיסי
2. **Application metrics** — request rate, error rate, duration (RED)
3. **Alerting** — PagerDuty / Slack integration
4. **ELK Stack** — Elasticsearch + Logstash + Kibana

!!! tip "לימוד אקדמי"
    **קורסים**: מערכות מבוזרות, סטטיסטיקה (percentiles, distributions), רשתות מחשבים.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מערכות הפעלה (0368-2162)
    - רשתות תקשורת מחשבים (0368-3030)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Monitoring ל-Observability?"
    **Monitoring** — מה שברתי (known-unknowns): dashboards, alerts.
    **Observability** — למה זה שבור (unknown-unknowns): traces, logs correlation.

??? tip "מה זה RED method?"
    **R**ate — requests per second. **E**rrors — error rate. **D**uration — latency.
    3 מדדים שנותנים תמונה מלאה על health של service.

??? tip "מה ההבדל בין SLO ל-SLA?"
    **SLO** = יעד פנימי ("אנחנו שואפים ל-99.9%").
    **SLA** = חוזה חיצוני ("אם נפול מתחת — פיצוי ללקוח").
