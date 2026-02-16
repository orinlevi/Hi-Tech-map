# Docker

## למה זה חשוב

Docker שינה את הדרך שבה מפתחים בונים, מפיצים, ומריצים תוכנה. כמעט כל חברת tech משתמשת ב-Docker:

- פותר את בעיית ה-"אצלי זה עובד" (it works on my machine)
- מאפשר להריץ אפליקציות בסביבה זהה ב-development וב-production
- הבסיס ל-Kubernetes ולכל עולם ה-container orchestration
- מיומנות חובה לכל מפתח/ת בתעשייה

## רעיונות מרכזיים

### מה זה Container?

Container הוא **process מבודד** שרץ על המחשב, עם מערכת קבצים משלו, רשת משלו, ומשתני סביבה משלו -- אבל **חולק את ה-kernel** של מערכת ההפעלה עם המחשב המארח.

```
Virtual Machine (VM)                Container
┌─────────────────────┐            ┌──────────────────────┐
│  App A  │  App B    │            │  App A  │  App B     │
│─────────┼───────────│            │─────────┼────────────│
│  OS     │  OS       │            │  Libs A │  Libs B    │
│ (Linux) │ (Windows) │            │─────────┴────────────│
│─────────┴───────────│            │   Container Runtime  │
│    Hypervisor       │            │      (Docker)        │
│─────────────────────│            │──────────────────────│
│    Host OS          │            │    Host OS (Linux)   │
│─────────────────────│            │──────────────────────│
│    Hardware         │            │    Hardware          │
└─────────────────────┘            └──────────────────────┘

VM: כל אפליקציה עם OS שלם      Container: חולקים OS אחד
    (כבד, GB-ים, דקות לעלות)         (קל, MB-ים, שניות לעלות)
```

### Docker Image מול Container

!!! note "ההבדל הקריטי"
    - **Image** = תבנית (template). כמו class ב-OOP. קובץ קריא בלבד שמכיל את כל מה שצריך להריץ אפליקציה.
    - **Container** = instance שרץ. כמו object. נוצר מ-image ורץ בפועל על המחשב.

```
Image                          Container(s)
┌──────────────┐              ┌──────────────┐
│  Python 3.11 │              │  Instance 1  │  (רץ על port 8080)
│  Flask       │  ──build──>  ├──────────────┤
│  app.py      │              │  Instance 2  │  (רץ על port 8081)
│  deps        │              ├──────────────┤
└──────────────┘              │  Instance 3  │  (רץ על port 8082)
  (קובץ אחד)                  └──────────────┘
                              (3 containers מאותו image)
```

### Dockerfile -- מתכון לבניית Image

Dockerfile הוא קובץ טקסט שמתאר **צעד-אחרי-צעד** איך לבנות image.

```dockerfile
# Dockerfile לאפליקציית Python

# 1. מתחילים מ-image בסיס
FROM python:3.11-slim

# 2. מגדירים תיקיית עבודה
WORKDIR /app

# 3. מעתיקים קובץ דרישות ומתקינים
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. מעתיקים את הקוד
COPY . .

# 5. חושפים port
EXPOSE 8080

# 6. הפקודה שתרוץ כשה-container עולה
CMD ["python", "app.py"]
```

??? tip "שכבות (Layers)"
    כל פקודה ב-Dockerfile יוצרת **שכבה** (layer). Docker שומר שכבות ב-cache, כך שאם שיניתם רק את הקוד (צעד 4), Docker לא צריך להתקין מחדש את ה-dependencies (צעד 3). לכן חשוב לשים את הדברים שמשתנים לעיתים רחוקות **קודם** ב-Dockerfile.

### הפקודות הבסיסיות

```bash
# בניית image מ-Dockerfile
docker build -t my-app:1.0 .

# הרצת container מ-image
docker run -d -p 8080:8080 --name my-container my-app:1.0

# צפייה ב-containers רצים
docker ps

# כניסה ל-container (כמו SSH)
docker exec -it my-container /bin/bash

# עצירת container
docker stop my-container

# צפייה ב-logs
docker logs my-container

# הורדת image מ-Docker Hub
docker pull nginx:latest
```

!!! warning "Docker ב-production"
    לעולם לא משתמשים ב-`docker run` ישירות ב-production. משתמשים ב-Kubernetes או ב-Docker Compose לניהול containers. `docker run` מתאים לפיתוח וניסויים.

### למה Docker פותר "It Works on My Machine"?

```
בלי Docker:
Developer A: Python 3.9, Ubuntu 20, libssl 1.1  ✅ עובד
Developer B: Python 3.11, macOS, libssl 3.0     ❌ לא עובד
Server:      Python 3.8, CentOS 7, libssl 1.0   ❌ לא עובד

עם Docker:
Developer A: docker run my-app  ✅ עובד
Developer B: docker run my-app  ✅ עובד
Server:      docker run my-app  ✅ עובד

כולם מריצים את אותו Image עם אותן גרסאות בדיוק!
```

### Docker Compose -- כמה containers ביחד

כשיש אפליקציה שמורכבת מכמה שירותים (API + Database + Cache):

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

  redis:
    image: redis:7

volumes:
  db-data:
```

```bash
# מרים את כל השירותים בפקודה אחת
docker compose up -d

# מוריד את הכל
docker compose down
```

## בלבולים נפוצים

- **"Docker זה Virtual Machine"** -- לא. VM מריצה מערכת הפעלה שלמה. Container חולק את ה-kernel של המארח. Containers הרבה יותר קלים ומהירים לעלות.
- **"Docker רץ רק על Linux"** -- Docker **containers** רצים על Linux kernel. על macOS ו-Windows, Docker Desktop מריץ VM קטנה של Linux ברקע, ועליה רצים ה-containers.
- **"Image ו-Container זה אותו דבר"** -- Image הוא תבנית (read-only). Container הוא instance רץ. אפשר ליצור הרבה containers מאותו image.
- **"Docker פותר אבטחה"** -- Container הוא **לא** sandbox מאובטח כמו VM. אם מישהו פורץ ל-container, יש סיכוי שיוכל לגשת ל-host. יש כלים לחיזוק אבטחת containers, אבל זה לא אוטומטי.

## דוגמה קטנה

בואו נבנה ונריץ אפליקציית Flask פשוטה ב-Docker:

```python
# app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello from Docker!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

```
# requirements.txt
flask==3.0.0
```

```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "app.py"]
```

```bash
# בונים
docker build -t hello-docker .

# מריצים
docker run -d -p 8080:8080 hello-docker

# בודקים
curl http://localhost:8080
# => Hello from Docker!
```

## קישורים לנושאים אחרים

- [מחשב מול שרת](computer-vs-server.md) -- על מה Docker רץ
- [Kubernetes](kubernetes.md) -- ניהול הרבה containers ב-production
- [OpenShift](openshift.md) -- Kubernetes עם תוספות של Red Hat
- [CI/CD](ci-cd.md) -- איך Docker משתלב ב-pipeline של deployment
