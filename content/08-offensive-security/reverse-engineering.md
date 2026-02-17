# 🔍 Reverse Engineering — לפרק ולהבין

> **RE — האומנות של להבין תוכנה בלי access לsource code.**
> כמו פאזל, רק שהתמונה על הקופסה חסרה.

!!! warning "אזהרה אתית"
    RE למטרות לימוד, מחקר אבטחה, ו-malware analysis. שימוש לפריצת רישיונות הוא לא חוקי.

---

## Static Analysis מול Dynamic Analysis

| | Static | Dynamic |
|--|--------|---------|
| **מה** | ניתוח בלי הרצה | ניתוח תוך כדי הרצה |
| **כלים** | IDA Pro, Ghidra, radare2 | GDB, x64dbg, strace |
| **יתרונות** | בטוח, רואים הכל | רואים behavior אמיתי |
| **חסרונות** | code obfuscation | anti-debugging, malware risk |

---

## Assembly Basics (x86-64)

```nasm
; Registers
rax, rbx, rcx, rdx  ; general purpose
rsp                  ; stack pointer
rbp                  ; base pointer
rip                  ; instruction pointer

; Common instructions
mov rax, 5          ; rax = 5
add rax, rbx        ; rax += rbx
cmp rax, rbx        ; compare
je  label           ; jump if equal
call function       ; call function
ret                 ; return
push rax            ; push to stack
pop  rbx            ; pop from stack
```

---

## כלים

### Ghidra (חינם, NSA)
- Disassembler + decompiler
- תומך בהרבה architectures
- Plugin system

### IDA Pro (מסחרי)
- הסטנדרט בתעשייה
- Decompiler (Hex-Rays)
- IDA Free — גרסה מוגבלת בחינם

### GDB
```bash
gdb ./binary
(gdb) break main
(gdb) run
(gdb) disassemble
(gdb) info registers
(gdb) x/20x $rsp    # examine stack
(gdb) step           # single step
```

---

## 🛤️ מאיפה מתחילים

1. **Assembly** — x86-64 basics, calling conventions
2. **Ghidra** — tutorial ב-YouTube (מצוין)
3. **CrackMes** — crackmes.one לתרגול
4. **CTF RE challenges** — picoCTF, OverTheWire

!!! tip "לימוד אקדמי"
    **קורסים**: ארכיטקטורת מחשבים, מערכות הפעלה, שפות תכנות (compilers).
    **ידע מעשי**: C/C++, assembly, ELF/PE format.

    **מתוכנית הלימודים שלך ב-TAU:**

    - מבנה מחשבים (0368-2159)
    - מערכות הפעלה (0368-2162)
    - מבוא לאבטחת מידע (0368-3065)

---

## 💼 שאלות לראיון עבודה

??? tip "מה ההבדל בין Static ל-Dynamic Analysis?"
    **Static** — ניתוח הbinary בלי הרצה (disassembly, decompilation). בטוח, רואים הכל, אבל obfuscation מקשה.
    **Dynamic** — ניתוח תוך כדי הרצה (debugging, tracing). רואים behavior אמיתי, אבל malware risk.

??? tip "מה זה Calling Convention?"
    כללים של איך פונקציות מקבלות/מחזירות ערכים:
    **x86-64 Linux (System V)**: rdi, rsi, rdx, rcx, r8, r9 → return in rax.
    **x86-64 Windows**: rcx, rdx, r8, r9 → return in rax.

??? tip "הסבירו מה זה GOT ו-PLT."
    **PLT** (Procedure Linkage Table) — stub code שקורא לfunctions חיצוניות.
    **GOT** (Global Offset Table) — טבלה עם כתובות אמיתיות (resolved at runtime).
    שניהם חלק מ-dynamic linking. חשוב ל-exploitation (GOT overwrite).
