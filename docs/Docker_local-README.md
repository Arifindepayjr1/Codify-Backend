# 🐳 Docker Guild for Local 

## Clone Repositories
```bash
git clone https://github.com/JamJam126/Codify-Backend.git && git clone https://github.com/bunheng-try/CODIFY-Frontend.git
```

---
Make sure you are inside the backend folder before running any command:

```bash
cd CODIFY-Backend
```

---

## First Time / After Code Changes

| Command | Description |
|---|---|
| `pnpm docker:dev` | Backend only |
| `pnpm docker:full` | Full stack  |

---

## Later Runs (faster, no rebuild)

| Command | Description |
|---|---|
| `pnpm docker:after-dev` | Backend only |
| `pnpm docker:after-full` | Full stack |

---

## Stop

```bash
pnpm docker:down
```
