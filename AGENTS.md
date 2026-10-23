# Adventure of Bukvichko — Agent Guide

Educational web game (React + TypeScript + Vite + Tailwind + Framer Motion) that teaches the Bulgarian alphabet to children aged 4–6. Runs 100% in the browser, offline (PWA), no backend, no database. Progress in LocalStorage, static content in JSON files.

> Full product requirements (vision, audience, milestones, future features) live in **`docs/PRD.md`** — read it if product-level context is needed.

---

> **⚠️ MANDATORY RULE: This file (AGENTS.md) must be updated after EVERY code change.**
> Whenever you modify code, data, configuration or documentation in this project, you MUST also update this file in the same commit:
> - Add new features to the relevant "Implementation Status" checklist.
> - Update the "File Structure" section if files were added/renamed/removed.
> - Update the "Deployment" section if the deployment process changed.
> - Update "Notes for Next Session" with any new user preferences or known issues.
> A change is not considered complete until AGENTS.md reflects it.

---

## Design Principles (non-negotiable)

- The child is playing, not studying — no school feel, no reading required in menus.
- Never punish mistakes: correct answers → collectible rewards, wrong answers → funny junk items.
- Extremely colorful, rounded, large buttons/letters, cartoon-style, animated.
- Touch-friendly, high contrast, large click targets — equal experience on desktop and mobile.

## Game Modes

- **Learning Mode** — one illustration + one large animated letter; hover/click plays pronunciation; no timer, random order.
- **Challenge Mode** — illustration + 3 letter options; correct → reward, wrong → junk; ends after chosen word count (5/10/15/20).
- **Memory Game** — 16 cards (8 pairs), flip to match letters; awards 1 random reward on win.
- **Shop** — trade collected small rewards for 6 robot characters (see `tradeRecipes.json`).
- **Flags Wheel Game** — trade 1 reward to unlock a country flag (50 flags grouped by continent, `flags.json`); spin a free unlimited wheel of unlocked flags (winner = uniform random among unlocked) → answer which Bulgarian letter the country's name starts with (3 options); correct → reward, wrong → junk.
- **Collection** — view rewards/junk with quantities; Snake Junk Eater popup when junk > rewards.
- **Progress** — color-coded letter grid (learned/seen/unknown); click a letter to hear its MP3.
- **Settings** — volume control, reset progress.

## Key Implementation Details

- **Audio:** MP3 letter sounds in `src/data/sounds/` (30 files А–Я + ь), played via Web Audio API with Web Speech API (TTS) fallback. Sound effects in `src/utils/audio.ts`.
- **Data model:** `collectedRewards` / `collectedJunk` are `Record<string, number>` (ID → quantity; migration from old `string[]` exists in `src/utils/storage.ts`). `tradedItems` holds bought shop items. `unlockedFlags: string[]` holds unlocked flag IDs (added in v0.3 with its own migration guard).
- **Flags Wheel Game (`src/pages/FlagsGame.tsx`):** single page with a `view: 'unlock' | 'wheel' | 'quiz'` state machine. Wheel = `conic-gradient` sectors (one per unlocked flag, stable `flags.json` order) + Framer Motion rotation (3.6 s, precomputed angle so a sector center lands under the 🔻 pointer; rotation accumulates forward via `onAnimationComplete` guarded by a ref). Spinning gated at **MIN_FLAGS = 4**. Quiz shows + speaks the country name (`playWordSound`). Flag costs live per-flag in `flags.json` (`cost`), NOT in `tradeRecipes.json` (shop-only). Unlock/trade helpers: `tradeFlag()`, `canAffordFlag()`, `isFlagUnlocked()`, `getUnlockedFlags()` in `storage.ts`. ⚠️ Mobile-only mode — Windows desktop renders flag emojis as 2-letter boxes (see plan doc for the `flag-icons` SVG fallback).
- **Images:** shop robot PNGs must live in **`public/data/images/Shop/`** for Vite to serve them (`src/data/images/Shop/` copies are sources only).
- **Word list:** 55 words in `src/data/words.json` — one per letter; letter Ь is missing (soft sign rarely starts words).
- **Memory Game reward:** 1 random reward per win (same pool as Challenge), shown in the 🏆 popup, saved via `addReward()`, once per win (guarded by `rewardGrantedRef`), wins count toward `challengeWins`/`totalGamesPlayed`.

## Implementation Status

### v0.1 — Completed

- [x] Project structure (Vite + React + TypeScript), Tailwind custom colors/animations, Framer Motion
- [x] Main menu with animated buttons; `/shop` route
- [x] Learning Mode — click letter to hear sound and auto-advance
- [x] Challenge Mode — select 5/10/15/20 words, 3 letter options
- [x] Reward system (10 rewards, 8 junk items)
- [x] Collection page (rewards & junk tabs, quantities ×N, full-screen view, mobile scroll)
- [x] Memory Game — 16 cards, awards 1 random reward on win
- [x] LocalStorage progress saving; custom large cursor (👆)
- [x] Web Speech API pronunciation + Web Audio sound effects
- [x] PWA support (offline ready)
- [x] Progress visualization (color-coded letter grid); Settings page
- [x] MP3 letter sounds on Progress page (click any letter)

### v0.2 — Completed

- [x] `collectedRewards`/`collectedJunk`: `string[]` → `Record<string, number>` + old-data migration
- [x] Helpers: `getTotalRewardCount()`, `getTotalJunkCount()`, `getRewardCount()`, `getJunkCount()`
- [x] Snake Junk Eater — worm popup when junk > rewards on Collection page
- [x] Shop/Trading — 6 robot characters, cost display, buy flow, rarity badges; `canAfford()`, `tradeRewards()`, `getTradedItemCount()`
- [x] Main menu "🛒 Магазин" button; eating/gulp sound effects
- [x] 6 AI-generated robot PNGs in `public/data/images/Shop/`

### v0.3 — Completed (2026-10-23)

- [x] Flags Wheel Game — full plan & implementation notes in `docs/PLAN_flags_game.md`
- [x] `src/data/flags.json` — 12 flags (distinct first letters Б Ф Г И Т Р А Я К Е М Х), per-flag `cost`
- [x] `GameProgress.unlockedFlags: string[]` + migration guard; `tradeFlag()` / `canAffordFlag()` / `isFlagUnlocked()` / `getUnlockedFlags()`
- [x] `src/pages/FlagsGame.tsx` — unlock grid (Shop pattern, tap-to-unlock + toast), wheel (`conic-gradient` + Framer Motion), quiz (ChallengeMode pattern, country name shown & spoken)
- [x] `/flags` route + "🚩 Флагове" main-menu button
- [x] Flag costs flattened to agreed flat 1 reward per flag (2026-10-23)
- [x] Build verified (`npm run build` passes); **awaiting user evaluation** — if rejected, follow the Removal Plan in `docs/PLAN_flags_game.md` (2 files delete + 4 small reverts; feature is fully isolated)
- [x] **Phase 2 (2026-10-23): expanded 12 → 50 flags** — new `continent` field, grid grouped by continent sections (Европа/Азия/Африка/Америка/Океания), all costs flat 1 reward; original flag IDs f1–f12 unchanged (already-unlocked flags stay valid)

## Next Steps

### Priority: High

- [ ] Improve responsive design for mobile (main menu now has 7 game buttons — verify it fits small screens)
- [ ] Add word display on challenge mode (show word after answer)
- [ ] Fix challenge mode — show word name in reward popup

### Priority: Medium

- [ ] Flags Phase 3: expand toward all world flags (~200 remaining) — roadmap in `docs/PLAN_flags_game.md`
- [ ] Increase number of words per letter (more variety)
- [ ] Add hover sound on all buttons
- [ ] Add transition animations between pages
- [ ] Add "learned" counter on main menu

### Priority: Low

- [ ] Add background music option
- [ ] Add stats page (games played, accuracy)

## How to Run

```bash
cd D:\poc\llm_coding\alpha_game
npm run dev
```

Open http://localhost:5173 in browser.

## Git Repository

- **Remote:** https://github.com/mytag911mytag911/bukvichko.git
- **Branch:** `main`
- Standard workflow: `git status` → `git add .` → `git commit -m "..."` → `git push`

## Deployment (IMPORTANT — read before investigating "broken" deploys)

The live site is at: **https://mytag911mytag911.github.io/bukvichko/**

- **Deployment is FULLY AUTOMATIC via GitHub Actions** (`.github/workflows/deploy.yml` — hidden-folder names like `.` may not show in some search tools; use `git ls-tree` or `git show` to verify). On every push to `main`: checkout → `npm ci` → `npm run build` on `ubuntu-latest` → deploy `dist/` via `actions/deploy-pages`. **No manual deployment step.**
- Runs can be inspected at `https://api.github.com/repos/mytag911mytag911/bukvichko/actions/runs` (public API) — check `head_sha`, `status`, `conclusion`.
- GitHub Pages + CDN caching: HTML may take ~1–10 minutes to update. Use a cache-busting query (`?v=random`) when checking and hard-refresh (Ctrl+F5) when testing — the PWA service worker may serve a cached version.

### ⚠️ FALSE ALARM WARNING — bundle hash mismatch between local and live builds

A local **Windows** build and the CI **Linux** build produce DIFFERENT hashed filenames (e.g. local `index-Byu5hXmM.js` vs live `index-_M-NmY20.js`) for the SAME code. This is normal.

- **Do NOT conclude deployment is broken because the live bundle name differs from the local `dist/` name.** Compare CONTENT instead (download the live JS and search for a distinctive string from the new code).
- `index.html` referencing a different JS hash than the local build while the CSS hash matches is also normal.

### ⚠️ The `gh-pages` branch is LEGACY — do not deploy to it

GitHub Pages is configured to use the **GitHub Actions source, NOT the `gh-pages` branch**. Pushing to `gh-pages` has NO effect on the live site. Do not build or push anything to it (it can be deleted safely). Only the Actions run matters.

### Deploy checklist

1. `git push` to `main`
2. Wait ~2–5 minutes for the Actions run (`conclusion: success`)
3. Verify the live site serves the new code by checking for a NEW distinctive string — never by comparing bundle filenames

## File Structure

```
.github/workflows/deploy.yml  - GitHub Actions: auto-deploy to GitHub Pages on push to main
docs/PRD.md                   - Full product requirements document
docs/PLAN_flags_game.md       - Living plan for the Flags Wheel Game feature

public/data/images/Shop/      - 6 robot PNG images (served by Vite)

src/
  App.tsx                     - Router setup
  main.tsx                    - Entry point
  index.css                   - Global styles, custom cursor
  types/index.ts              - TypeScript types
  data/
    words.json                - 55 words with letters/emojis
    flags.json                - 50 country flags for the Flags Wheel Game (emoji, Bulgarian name, letter, continent, flat 1-reward cost)
    rewards.json              - 20 collectible rewards
    junkItems.json            - 20 funny junk items
    shopItems.json            - 6 collectible robot characters
    tradeRecipes.json         - Trade cost definitions
    sounds/                   - 30 MP3 letter sounds (А.mp3–Я.mp3, ь.mp3)
    images/Shop/              - Robot PNG source copies (NOT served by Vite)
  components/WormPopup.tsx    - Animated snake/worm modal
  pages/
    MainMenu.tsx              - Home page with navigation
    LearningMode.tsx          - Click letters to learn
    ChallengeMode.tsx         - Quiz with rewards
    ChallengeSelect.tsx       - Word count selection
    Collection.tsx            - Collected items with quantities
    MemoryGame.tsx            - Memory matching game
    Settings.tsx              - Volume control, reset progress
    Progress.tsx              - Color-coded letter grid
    Shop.tsx                  - Shop with trading system
    FlagsGame.tsx             - Flags unlock grid + wheel of luck + letter quiz
  utils/
    storage.ts                - LocalStorage management + trade functions
    audio.ts                  - TTS + MP3 playback + sound effects
    helpers.ts                - Shuffle/random utilities
    worm.ts                   - Worm feeding logic
```

## Notes for Next Session

- **2026-10-23 (later): user set the long-term aim for the Flags game = ALL world flags via emoji (~250 countries)**, phased — full roadmap, emoji caveats (subdivision flags/Kosovo don't render on Android) and data-generation notes in `docs/PLAN_flags_game.md`. Also agreed: flat 1 reward per flag cost (current flags.json needs flattening), unlocked flags in Collection tab, wheel needs ≥4 flags, permanent trades.
- **2026-10-23: Flags Wheel Game implemented** (v0.3) — test on a real mobile device (flag emojis show as "FR"-style boxes on Windows desktop; the mode is intentionally mobile-first). If desktop support is ever needed, swap to the `flag-icons` SVG package (small change, see plan doc).
- Flags are earned currency sinks: costs deliberately cheap (1–2 common rewards) so kids reach the 4-flag spin threshold quickly; adjust in `flags.json` if economy feels off.
- User wants more words per letter for variety; ensure all Bulgarian letters have at least one word; check emojis match words correctly.
- Test on mobile devices for touch responsiveness.
- 2026-10-11: Memory Game awards 1 random reward per win; user approved 1 prize per win, shown in the 🏆 popup, counting toward `challengeWins`/`totalGamesPlayed`.
- **Deployment is automatic on push to `main` via GitHub Actions — never deploy to the `gh-pages` branch.**
- **Remember the MANDATORY RULE at the top: update this AGENTS.md file with every code change.**
