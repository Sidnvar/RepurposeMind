# Repurpose Mind — Demo Video Script & Narration (English)

> **Purpose:** a 1.5–2 min product walkthrough for the Creative Minds Jam submission.
> **UI language:** English (set the top-right switch to **EN** before recording).
> **Resolution:** 1280×800, browser = Chrome, full window, system cursor visible.
> **Total runtime target:** ~1:50 (trimmable to 1:40).

---

## 1. Story arc (the 4 beats)

1. **Problem** — one idea, five platforms, five rewrite styles.
2. **Solution** — Repurpose Mind: write once, adapt everywhere, powered by a *persistent Mind*.
3. **Proof** — live create → adapt to 5 platforms → show quality → Mind learns → refresh proves persistence.
4. **Bonus** — multilingual isolation (EN / 简中 / 繁中 don't share memory).

---

## 2. Pre-recording checklist

- [ ] Backend running on `:3001` (real LLM mode). Frontend on `:5173`.
- [ ] Open `http://localhost:5173/` in Chrome, **maximize** the window.
- [ ] Top-right language switch → click **EN**. Confirm UI is English.
- [ ] *(Optional, for a clean "from zero" learning demo)* reset the English Mind memory:
  ```bash
  # safe: deletes only English learned prefs, does NOT drop the database
  sqlite3 "Repurpose Mind/repurpose-mind.db" "DELETE FROM mind_memory WHERE lang='en' AND key LIKE 'learned_pref_%';"
  ```
  Then refresh the page. The **Remembered Preferences** panel will be empty at start.
- [ ] Close any unrelated tabs / notifications; hide the macOS menu bar (⌥⌥ or presentation mode) for a clean capture.
- [ ] Have a real, short English original text ready to paste in Shot 3 (see below).

**Sample original text (paste-ready):**

> Our new AI note-taker turns every meeting into a clean task list in seconds. It joins your call, captures decisions, and drafts follow-ups your team can act on immediately. Remote teams save about five hours a week per person — time they used to waste rewriting notes by hand.

---

## 3. Shot-by-shot storyboard

| # | Time | Screen / Frame | On-screen action (exact) | Narration (voiceover) | Edit / visual note |
|---|------|----------------|--------------------------|-----------------------|--------------------|
| 1 | 0:00–0:12 | **Title card** (dark, product name + tagline) | Static card: *"Repurpose Mind — Write once. Adapt everywhere. Remember forever."* | "If you make content, you know the pain: one good idea, five different platforms, and five completely different ways to write it. X wants a hook. Xiaohongshu wants warmth. Newsletters want depth. Rewriting it all by hand eats your best hours." | Calm background, no cursor. Hold 2s then fade to workspace. |
| 2 | 0:12–0:22 | **Workspace (English)** | Cursor sweeps the three numbered zones: ① Create Source, ② Mind Memory, ④ Source List / ⑤ Content Versions. | "Repurpose Mind is a cross-platform repurposing assistant with a persistent *Mind* — it learns your voice, and rewrites one draft into every platform's format, in the language you pick." | Slow cursor move; subtle highlight rings on ① and ②. |
| 3 | 0:22–0:45 | **① Create Source & Generate Multi-platform Adaptations** | Click **Title** field → type `How our AI note-taker saves remote teams 5 hours a week`. Click **Original Content** textarea → paste the sample text above. | "We start with a single source. I'll give it one title and one short original — that's the only thing I write by hand." | Type at natural speed (~40 wpm). Keep the textarea in view. |
| 4 | 0:45–1:08 | same panel | Click each platform chip once: **X / Twitter**, **TikTok**, **YouTube**, **Xiaohongshu**, **Newsletter** (all highlighted). Set **Tone** = `Professional`. Click **Create & Adapt**. Wait ~4s for spinner ("Generating…"). | "Now I pick the platforms — X, TikTok, YouTube, Xiaohongshu, Newsletter. One click, and Repurpose Mind calls the LLM to generate a tailor-made version for each, matching length, tone and format per platform." | Zoom slightly on the chips during selection; show the spinner. |
| 5 | 1:08–1:22 | **⑤ Content Versions** | Scroll to the version cards. Hover / expand the **X / Twitter** card (under 280 chars), then the **Newsletter** card (structured long-form). | "Look at the output. X gets a punchy sub-280-character hook. The Newsletter becomes a structured email with a clear CTA. Every version keeps my core message — nothing is invented." | Briefly expand each card; don't read the full text, just point. |
| 6 | 1:22–1:36 | **② Mind Memory (Creator Profile)** | Cursor points to **Brand Voice**, **Target Platforms**, then the **Remembered Preferences** list (the `learned_pref_*` entries that just appeared). | "Here's what makes it yours. After every adaptation, the Mind quietly learns your preferences — your brand voice, your platform tones, even small habits like 'lead with a question on X'. It writes them to a local database, so they survive a restart." | Pulse-highlight the new preference rows. |
| 7 | 1:36–1:46 | Workspace | Click the browser **refresh** button. Workspace reloads; **Remembered Preferences** still shows the same entries. | "Watch this — I'll refresh the page. The Memory is still there. Close the app, reboot the server, come back next week — your Mind remembers." | Capture the reload; keep the Mind panel framed. |
| 8 | 1:46–2:00 | Top-right **language switch** | Click **简中**. UI switches to Chinese; **② Mind Memory** now shows a *Chinese* brand voice and its own separate memory (different from English). | "And it speaks your audience's language. Switch to Chinese, and the interface, the brand voice, and the Memory all change — the English and Chinese Minds are completely isolated. One workspace, many voices, zero cross-contamination." | Show the switch animating; contrast the Chinese profile vs the English one shown earlier. |
| 9 | 2:00–2:08 | **End card** | Fade to title card + repo link placeholder. | "Repurpose Mind — write once, adapt everywhere, and get smarter every time. Built for the Creative Minds Jam." | Hold 3s. |

> **Trimming tip:** if you must hit exactly 1:40, shorten Shot 3 (paste instead of type the title) and Shot 8 (show the switch, skip the contrast pause).

---

## 4. Standalone narration (copy-paste for voiceover / TTS)

```
[0:00] If you make content, you know the pain: one good idea, five different platforms,
       and five completely different ways to write it. X wants a hook. Xiaohongshu wants
       warmth. Newsletters want depth. Rewriting it all by hand eats your best hours.

[0:12] Repurpose Mind is a cross-platform repurposing assistant with a persistent Mind —
       it learns your voice, and rewrites one draft into every platform's format, in the
       language you pick.

[0:22] We start with a single source. I'll give it one title and one short original —
       that's the only thing I write by hand.

[0:45] Now I pick the platforms — X, TikTok, YouTube, Xiaohongshu, Newsletter. One click,
       and Repurpose Mind calls the LLM to generate a tailor-made version for each,
       matching length, tone and format per platform.

[1:08] Look at the output. X gets a punchy sub-280-character hook. The Newsletter becomes
       a structured email with a clear CTA. Every version keeps my core message —
       nothing is invented.

[1:22] Here's what makes it yours. After every adaptation, the Mind quietly learns your
       preferences — your brand voice, your platform tones, even small habits like
       'lead with a question on X'. It writes them to a local database, so they survive
       a restart.

[1:36] Watch this — I'll refresh the page. The Memory is still there. Close the app,
       reboot the server, come back next week — your Mind remembers.

[1:46] And it speaks your audience's language. Switch to Chinese, and the interface,
       the brand voice, and the Memory all change — the English and Chinese Minds are
       completely isolated. One workspace, many voices, zero cross-contamination.

[2:00] Repurpose Mind — write once, adapt everywhere, and get smarter every time.
       Built for the Creative Minds Jam.
```

---

## 5. Recording tips

- **Cursor:** use the default system arrow, move it deliberately (no jitter). Pause ~0.5s on each chip before clicking.
- **Typing:** real keystrokes in Shot 3 read as "authentic"; keep it ~40 wpm. Don't paste the title (looks fake); pasting the long original is fine.
- **Pacing:** let the spinner in Shot 4 run its full ~4s — it visibly proves real LLM calls.
- **Framing:** keep **② Mind Memory** and **⑤ Content Versions** in frame for Shots 5–7; that's the payoff.
- **Audio:** record narration separately (clean room) and layer it over the captured screen; mute the on-screen clicks. Or use the TTS block in §4.
- **Outro:** replace the repo-link placeholder with your actual submission URL.

---

## 6. What this script proves (maps to our selling points)

| Shot | Selling point demonstrated |
|------|----------------------------|
| 4–5 | Multi-platform adaptation with platform-correct format & length |
| 6 | Persistent Mind *learns* preferences (brand voice + platform tones) |
| 7 | Memory survives refresh / restart (SQLite-backed) |
| 8 | Multilingual isolation — EN / 简中 / 繁中 Minds don't share data |
| 3 | Minimal input — write once, adapt everywhere |
