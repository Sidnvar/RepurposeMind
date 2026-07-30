# Repurpose Mind · Architecture & Data Flow

This document explains Repurpose Mind's layered structure, the full data flow of a single "repurpose" request, and the persistent Mind (memory) loop.

---

## 1. Overall Architecture

```mermaid
flowchart TB
    subgraph Browser["Browser (React + Vite MPA, :5173)"]
        UI["Workbench App.jsx<br/>Drafts / Versions / Tasks / Mind panel"]
        I18N["i18n language switcher<br/>EN · 简中 · 繁中 (localStorage)"]
        DEV["Debug page index_dev.html"]
        UI --- I18N
    end

    subgraph Server["Backend (Express + node:sqlite, :3001)"]
        API["REST API (/api/*)<br/>9 endpoints"]
        CFG["config.js<br/>reads .env to decide LLM mode"]
        SVC["services<br/>profile / content / task"]
        LLM["llm.js<br/>OpenAI-compatible fetch"]
        MEM["Mind module<br/>getMindContext / learnFromRepurpose<br/>addLearnedPreference"]
        DB[("SQLite file<br/>node:sqlite")]
    end

    subgraph Ext["External"]
        PROVIDER["LLM Provider<br/>OpenAI / DeepSeek / local Ollama …"]
    end

    UI -- "fetch /api (Vite proxy)" --> API
    DEV -- "fetch /api" --> API
    API --> CFG
    API --> SVC
    SVC --> LLM
    SVC --> MEM
    MEM <--> DB
    LLM <--> PROVIDER
    SVC <--> DB

    classDef mind fill:#fff3d6,stroke:#e0a800;
    class MEM mind;
```

**Key point**: The frontend only talks to `/api`; business logic lives in `services`; all DB access goes through `node:sqlite` (no ORM, no third-party DB process). The Mind module is the core differentiator: it both **reads** memory into the prompt and **writes** memory back, forming a loop.

---

## 2. Data Flow of a Single "Repurpose" Request

Using `POST /api/content/:id/repurpose` as an example:

```mermaid
sequenceDiagram
    participant U as Frontend
    participant C as content.controller
    participant S as content.service
    participant M as Mind module
    participant L as LLM Provider
    participant D as SQLite

    Note over U: current language lang = zh-CN
    U->>C: repurpose { platforms, tone, learn, lang }
    C->>S: createRepurposedVersions(...)
    S->>M: read profile+memory for lang
    M-->>S: brand_voice / memory / target_platforms
    par Parallel generation (outside transaction, avoid long lock)
        S->>L: one prompt per platform (with Mind context + language hard-constraint)
        L-->>S: platform version text
    end
    S->>D: BEGIN → batch INSERT content_versions (status=draft) + follow_up_task → COMMIT
    opt learn=true (best-effort, 20s timeout, non-blocking)
        S->>L: distill 1-3 reusable preferences
        L-->>S: JSON preference array
        S->>D: addLearnedPreference(pref, lang) (keep latest 10 per language)
    end
    S-->>C: { sourceId, created:[{id,platform}] }
    C-->>U: render version cards
```

**Key points**:
- **Generate first, then short transaction commit**: LLM calls (slow, may fail) run in parallel outside the transaction; only `INSERT` sits in `BEGIN/COMMIT`, keeping lock time minimal.
- **Fail-safe**: Errors in LLM calls or learning write-back never affect already-persisted versions; when LLM is disabled it auto-falls back to rule templates.
- **Language hard-constraint**: `lang` enters both system and user prompts so the model won't translate on its own (fixed the X-platform-english bug).

---

## 3. Persistent Mind (Memory) Loop

```mermaid
flowchart LR
    A["Creator profile<br/>creator_profile(lang)"] -->|"read by lang"| B["System Prompt injection"]
    C["Historical preferences<br/>mind_memory(lang)"] -->|"learned_pref_* / platform_tone_*"| B
    B --> D["LLM generates platform versions"]
    D --> E["persist content_versions"]
    D -.->|"learnFromRepurpose<br/>best-effort distill"| C
    E --> F["next repurpose"] --> B
```

- **Isolation dimension**: Both `creator_profile` and `mind_memory` carry a `lang` column → three-language profiles/memory don't interfere ("isolated").
- **Persistence proof**: Memory lives in the SQLite file, surviving process restarts and sessions. `scripts/persistence-demo.mjs` verifies end-to-end: memory keys identical before/after restart, physically on disk, historical preferences injected into new generations (outputs `PASS ✅`).

---

## 4. Data Model

| Table | Key fields | Description |
|---|---|---|
| `users` | `id`, `brand_voice`, `target_platforms` | Legacy profile fields (migrated to `creator_profile`, kept for compatibility) |
| `creator_profile` | `lang`, `brand_voice`, `target_platforms` | **Per-language** creator profile, three languages seeded |
| `content_sources` | `user_id`, `title`, `original_text`, `source_type` | Source drafts (shared assets) |
| `content_versions` | `source_id`, `platform`, `version_text`, `status`, `tone` | Repurposed versions (`status`: draft/ready/published) |
| `mind_memory` | `user_id`, `key`, `value`, `lang`, `updated_at` | Long-term memory; `learned_pref_*` (auto-learned) / `platform_tone_*` (seeds) |
| `follow_up_tasks` | `user_id`, `source_id`, `task_type`, `status`, `due_at`, `note` | Todo auto-dispatched after repurpose |
| `tasks` | `task_type`, `status`, `note` | Generic todos (workbench "Todo tasks" panel) |

Migration runs **idempotently** in `db.js`: add `lang` column to `mind_memory`, backfill old data, create `creator_profile` table + indexes, seed three-language profiles — all without deleting the DB, compatible with old data.

---

## 5. Configuration & Runtime Requirements

- **Node ≥ 22**: depends on built-in `node:sqlite` and global `fetch`.
- LLM mode is decided by `LLM_API_KEY` in `server/.env`: non-empty = real call; empty = mock rule template.
- Frontend `/api` is proxied to `:3001` via Vite, so the frontend uniformly uses relative path `/api/...`.
