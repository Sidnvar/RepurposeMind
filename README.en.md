# Repurpose Mind

> A cross-platform content repurposing assistant powered by a **persistent Mind (memory)** — turn one source draft into platform-tailored versions for X / TikTok / YouTube / Xiaohongshu / Newsletter, and continuously learn your creative preferences with every repurpose.

**Creative Minds Jam #1** hackathon entry · Submission deadline 2026-08-28 23:59 HKT

---

## ✨ Core Features

- **One draft, many platforms**: Input a draft → generate differentiated versions for 5 platforms at once (X hook, TikTok script, YouTube title + chapters, Xiaohongshu post, Newsletter long-form).
- **Persistent Mind**: The creator's brand voice / target platforms / historical preferences live in SQLite — surviving sessions and process restarts.
- **Gets smarter over time**: After each repurpose, the Mind uses the LLM to distill 1–3 reusable preferences and writes them back to memory, automatically applied to the next draft.
- **Three isolated languages**: English / Simplified Chinese / Traditional Chinese — creator profile and memory are isolated per language; drafts and versions are shared assets that can be repurposed into any language.
- **Zero third-party database**: Backend uses Node 22 built-in `node:sqlite`, runs out of the box; LLM goes through OpenAI-compatible endpoints, auto-falling back to rule templates when no key is set (no cost).

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 (MPA: `/` workbench, `/index_dev.html` debug page) |
| Backend | Express + `node:sqlite` (DatabaseSync, no third-party DB dependency) |
| Intelligence | Node 22 native `fetch` calling OpenAI-compatible `/v1/chat/completions` |
| Runtime | **Node ≥ 22** (uses built-in `node:sqlite` and global `fetch`) |

---

## 🚀 Quick Start

```bash
# 1) Install dependencies
npm install          # root: backend deps
cd client && npm install && cd ..

# 2) (Optional) Configure LLM
cp server/.env.example server/.env
#    Edit server/.env, fill in LLM_API_KEY etc.; leave empty to use mock mode (rule templates)

# 3) Start frontend and backend together
npm run dev          # background: node server/index.js  foreground: vite
```

After startup:

- Frontend workbench: <http://localhost:5173/>
- Debug page (quick Chinese verification): <http://localhost:5173/index_dev.html>
- Backend API: <http://localhost:3001/api>

> Run separately: `npm run dev:server` (backend only, port 3001) / `npm run dev:client` (frontend only, port 5173, API proxied to 3001 via Vite).

---

## ⚙️ LLM Configuration (server/.env)

| Variable | Description | Default |
|---|---|---|
| `LLM_API_KEY` | OpenAI-compatible key; **empty = mock mode** | empty |
| `LLM_BASE_URL` | Compatible endpoint base | `https://api.openai.com/v1` |
| `LLM_MODEL` | Model name | `gpt-4o-mini` |
| `LLM_TEMPERATURE` | Generation temperature | `0.7` |

`.env.example` ships with ready-made configs for OpenAI / DeepSeek / Moonshot / Qwen / local Ollama — uncomment to use.

---

## 🌐 Multilingual & "Isolated"

- Switch **EN / 简中 / 繁中** from the top-right; the choice persists to `localStorage`.
- "Isolated" means the **creator profile + Mind memory are isolated per language** (`creator_profile` and `mind_memory` both carry a `lang` column); drafts and repurposed versions are shared assets that can be repurposed into any language.
- Example: a preference learned in Chinese ("X prefers question-style hooks") won't pollute the English workspace; switching to English gives a fresh profile and empty memory.

---

## 🧠 Mind (Memory) Data Model

| Table | Fields | Purpose |
|---|---|---|
| `creator_profile` | `lang`, `brand_voice`, `target_platforms` | Per-language creator profile (three-language seeds preloaded) |
| `mind_memory` | `user_id`, `key`, `value`, `lang`, `updated_at` | Long-term memory; `learned_pref_*` auto-written by LLM (keep latest 10 per language), `platform_tone_*` are seeds |

Learning loop: `repurpose generation → persist → learnFromRepurpose distills preferences via LLM → write back to mind_memory (best-effort, 20s timeout, never blocks main flow) → next repurpose auto-injects into system prompt`.

---

## 📡 API Reference

Unified response `{ success, data }` (health check excluded, returns `{ ok: true }`).

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/profile?lang=zh-CN` | Creator profile + memory for that language |
| GET | `/api/content` | Draft list + all versions |
| POST | `/api/content` | Create draft, body: `{ title, originalText, sourceType }` → `{ id }` |
| POST | `/api/content/:id/repurpose` | Repurpose, body: `{ platforms[], tone, learn?, lang? }` → `{ sourceId, created:[{id,platform}] }` |
| GET | `/api/content/:id/versions` | Versions for that draft |
| PATCH | `/api/versions/:id/status` | Update version status `draft\|ready\|published` |
| GET | `/api/tasks` | Todo tasks |
| PATCH | `/api/tasks/:id/status` | Update task status |

---

## 🛠 Scripts

- `scripts/persistence-demo.mjs` — **persistence proof**: stop old backend → start clean instance → session 1 repurpose to teach Mind → read SQLite directly to prove on-disk → restart backend (no DB delete) → session 2 asserts memory keys identical → repurpose again to verify historical preferences injected. Output: `PASS ✅`.

```bash
node scripts/persistence-demo.mjs
```

---

## 📁 Directory Structure

```
Repurpose Mind/
├─ server/                 # Express + node:sqlite
│  ├─ index.js             # Entry, registers 9 endpoints
│  ├─ db.js                # Idempotent schema + migration + 3-language seed
│  ├─ config.js            # Minimal .env loader
│  ├─ llm.js               # OpenAI-compatible call wrapper (isLLMEnabled / callLLM)
│  ├─ schema.sql           # Table schema
│  ├─ .env / .env.example  # LLM config (.env not committed)
│  ├─ services/            # profile / content / task business logic
│  ├─ controllers/         # Request handling
│  └─ routes/              # Routing
├─ client/                 # React + Vite MPA
│  ├─ src/App.jsx          # Workbench (with i18n + language switcher)
│  └─ src/styles.css
└─ scripts/
   └─ persistence-demo.mjs # Persistence proof script
```

---

## 📌 Operational Rules (dev notes)

- To reset the database, **`pkill -f "node index.js"` first, then delete `*.db`**; never `rm` the DB while it's running (stale connections become read-only).
- Run exactly one instance of frontend and backend each.
- `server/.env` and `*.db` are git-ignored.
