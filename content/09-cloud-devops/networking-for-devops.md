# 🌐 רשתות ל-DevOps — VPC, Subnets, Firewalls

> **VPC — הרשת הפרטית שלכם ב-Cloud. כמו LAN, רק שמשלמים על כל packet.**

---

## VPC — Virtual Private Cloud

```
VPC (10.0.0.0/16)
├── Public Subnet (10.0.1.0/24)
│   ├── Web Server (public IP)
│   └── Internet Gateway
├── Private Subnet (10.0.2.0/24)
│   ├── App Server (no public IP)
│   └── NAT Gateway (for outbound)
└── Private Subnet (10.0.3.0/24)
    └── Database (isolated)
```

---

## Security Groups vs NACLs

| | Security Groups | NACLs |
|--|----------------|-------|
| **Level** | Instance | Subnet |
| **State** | Stateful | Stateless |
| **Default** | Deny all inbound | Allow all |
| **Rules** | Allow only | Allow + Deny |

---

## Load Balancers

| Type | Layer | Use Case |
|------|-------|----------|
| **ALB** | Layer 7 (HTTP) | Web apps, routing by path/host |
| **NLB** | Layer 4 (TCP/UDP) | High performance, static IP |

---

## DNS (Route 53)

- **A Record** — domain → IP
- **CNAME** — domain → domain
- **Alias** — domain → AWS resource
- **Routing policies**: simple, weighted, latency-based, failover

---

## 🛤️ מאיפה מתחילים

1. **TCP/IP basics** — ראו section רשתות
2. **CIDR notation** — subnetting
3. **VPC design** — public vs private subnets
4. **Security Groups** — firewall rules
5. **Load balancing** — ALB vs NLB

!!! tip "לימוד אקדמי"
    **קורסים חובה**: רשתות מחשבים (TCP/IP, subnetting, routing, DNS).

    **מתוכנית הלימודים שלך ב-TAU:**

    - רשתות תקשורת מחשבים (0368-3030)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Security Group ל-NACL?"
    **SG** — instance level, stateful (return traffic auto-allowed), allow rules only.
    **NACL** — subnet level, stateless (need explicit allow for return), allow + deny rules.

??? tip "מה ההבדל בין public ל-private subnet?"
    **Public** — יש route ל-Internet Gateway, instances יכולים לקבל public IP.
    **Private** — אין route ל-IGW, outbound דרך NAT Gateway בלבד.

??? tip "מתי ALB ומתי NLB?"
    **ALB** — HTTP/HTTPS, path-based routing, WebSocket. Web apps.
    **NLB** — TCP/UDP, ultra-high performance, static IP. Gaming, IoT.
