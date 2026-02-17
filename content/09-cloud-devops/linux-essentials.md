# 🐧 Linux — שורת הפקודה

> **Linux — המערכת שמריצה 90% מהשרתים בעולם, ו-2% מהמחשבים הביתיים.**
> אבל אם אתם עובדים בהייטק, כנראה שאתם ב-2% + 90%.

---

## File System Hierarchy

```
/
├── /bin     — essential binaries (ls, cp, mv)
├── /etc     — configuration files
├── /home    — user home directories
├── /var     — variable data (logs, databases)
├── /tmp     — temporary files
├── /usr     — user programs
├── /opt     — optional software
└── /proc    — virtual filesystem (process info)
```

---

## פקודות חיוניות

```bash
# ניווט
pwd                    # where am I?
ls -la                 # list with details
cd /var/log            # change directory

# קבצים
cp file.txt backup.txt
mv old.txt new.txt
rm -rf directory/      # ⚠️ be careful!
mkdir -p a/b/c         # create nested dirs

# טקסט
cat file.txt           # print entire file
less file.txt          # paginated view
head -20 file.txt      # first 20 lines
tail -f /var/log/syslog  # follow log in real-time
grep "error" log.txt   # search in file

# תהליכים
ps aux                 # all processes
top / htop             # real-time monitoring
kill -9 PID            # force kill
```

---

## Permissions

```bash
# rwxrwxrwx = owner | group | others
chmod 755 script.sh    # rwxr-xr-x
chmod +x script.sh     # add execute
chown user:group file  # change owner
```

---

## SSH

```bash
ssh user@server.com
ssh -i key.pem user@server.com    # with private key
scp file.txt user@server:/path/   # copy file to server
```

---

## 🛤️ מאיפה מתחילים

1. **Terminal basics** — cd, ls, cp, mv, rm, grep
2. **File permissions** — chmod, chown, users/groups
3. **Package management** — apt/yum
4. **Shell scripting** — Bash basics
5. **SSH** — remote access
6. **Process management** — ps, top, systemctl

!!! tip "לימוד אקדמי"
    **קורסים חובה**: מערכות הפעלה (processes, filesystem, permissions, kernel).
    **ידע מעשי**: OverTheWire Bandit (CTF ללימוד Linux), LinuxCommand.org.

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין process ל-thread?"
    **Process** — instance של תוכנית עם address space משלו. כבד ליצירה.
    **Thread** — unit of execution בתוך process. חולק address space. קל ליצירה.

??? tip "מה זה chmod 755?"
    `7` = rwx (owner: read+write+execute), `5` = r-x (group: read+execute), `5` = r-x (others: read+execute).
    נפוץ ל-scripts ו-executables.

??? tip "איך מוצאים process שצורך הרבה CPU?"
    `top` / `htop` — sorted by CPU. `ps aux --sort=-%cpu | head`.
    `kill PID` / `kill -9 PID` (SIGKILL) לעצירה.
