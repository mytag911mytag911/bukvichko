# Product Requirements Document (PRD)

**Project Name (working title):** Adventure of Bukvichko (working title)

**Version:** 0.2

**Language:** Bulgarian

---

> **⚠️ MANDATORY RULE: This file (AGENTS.md) must be updated after EVERY code change.**
> Whenever you modify code, data, configuration or documentation in this project, you MUST also update this file in the same commit:
> - Add new features to the relevant "Implementation Status" checklist.
> - Update the "File Structure" section if files were added/renamed/removed.
> - Update the "Deployment" section if the deployment process changed.
> - Update "Notes for Next Session" with any new user preferences or known issues.
> A change is not considered complete until AGENTS.md reflects it.

---

# 1. Vision

The goal of this project is to create a fun, colorful and interactive web game that helps children around the age of four learn the Bulgarian alphabet.

The product should never feel like school.

Children should feel that they are playing a game while naturally learning letters and associating them with everyday objects.

The experience should be joyful, rewarding and completely frustration-free.

The application should work equally well on desktop computers, tablets and mobile phones.

The project is intentionally designed to grow over time. Version 0.1 focuses only on the foundation while keeping the architecture ready for future extensions.

---

# 2. Target Audience

Primary audience:

- Children aged 4–6 years
- Native Bulgarian speakers
- Children that cannot yet read
- Children who are only beginning to associate letters with words

Secondary audience:

- Parents
- Grandparents
- Kindergarten teachers

---

# 3. Educational Goals

The game should help children:

- Recognize every Bulgarian letter
- Associate letters with common objects
- Listen to the pronunciation of letters
- Improve visual recognition
- Improve reaction speed
- Build confidence through positive reinforcement

The game should never punish mistakes.

Instead, mistakes should become funny moments.

---

# 4. Core Design Philosophy

Everything should be designed around one principle:

> The child is playing, not studying.

The interface should be:

- extremely colorful
- highly animated
- simple
- intuitive
- joyful
- rewarding
- accessible

Reading menus should not be required.

Large icons and illustrations should be preferred over text.

---

# 5. Technical Goals

The application should:

- run entirely in the browser
- require no backend
- require no database
- work offline (PWA)
- be deployable as static files
- be lightweight
- be easy to maintain
- be easy to extend

---

# 6. Technology Stack

Current planned stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Howler.js
- LocalStorage
- PWA

No server-side code.

No authentication.

No cloud dependencies.

---

# 7. Data Storage

All data should be stored locally.

Game progress should use LocalStorage.

Static content should use JSON files.

Example:

- words.json
- rewards.json
- junkItems.json
- shopItems.json
- tradeRecipes.json
- settings.json

No database is required.

---

# 8. Game Modes

## Learning Mode

Purpose:

Teach children the association between letters and words.

Gameplay:

- Display one illustration.
- Display one large animated letter.
- Moving the cursor over the letter enlarges it.
- Hovering or clicking plays the pronunciation.
- Clicking the correct letter loads another word.
- No timer.
- No pressure.
- Random order.

Learning is relaxed and exploration is encouraged.

---

## Challenge Mode

Purpose:

Practice previously learned letters.

Gameplay:

- Display one illustration.
- Show three possible letters.
- Only one letter is correct.
- Hovering plays the pronunciation.
- Correct answer gives a reward.
- Incorrect answer gives a funny "junk" item.
- The game ends after the selected number of words.

Future versions will include a timer.

---

# 9. Reward System

Correct answers should grant collectible rewards.

Examples:

- Candy
- Cookie
- Balloon
- Teddy Bear
- Diamond
- Star
- Ice Cream

Incorrect answers should award humorous junk items instead of punishments.

Examples:

- Dry leaf
- Old sock
- Stone
- Potato
- Stick
- Old shoe

Children should smile even when they make mistakes.

---

# 10. Audio

Each Bulgarian letter should have its own pronunciation.

Audio is stored locally as MP3 files in `src/data/sounds/` (30 files: А–Я, including ь).

When a letter MP3 exists, it is played via the Web Audio API. If no MP3 is found, the system falls back to the Web Speech API (TTS) for that letter.

Later versions may replace remaining TTS fallbacks with professionally recorded voice samples.

---

# 11. Visual Style

The game should resemble a children's picture book.

Preferred characteristics:

- colorful
- rounded
- soft shadows
- large buttons
- large letters
- cartoon illustrations
- playful animations

The interface should feel alive.

---

# 12. Accessibility

The game should be usable by children who cannot read.

Requirements:

- very large buttons
- large cursor
- touch friendly
- responsive layout
- high contrast
- large click targets

Desktop and touch devices should offer equally good experiences.

---

# 13. Future Features

Planned for future versions:

- Character companion
- Achievement system
- Collection album
- Parent dashboard
- Adaptive learning
- Statistics
- Mini games
- Balloon popping
- Fishing game
- Drawing letters
- English alphabet
- Numbers
- Shapes
- Colors
- Daily streak tracking
- Celebration effects (confetti/sparkles)
- Onboarding tutorial
- Letter tracing mode
- Multiplayer mode
- Haptic feedback on mobile
- Landscape mode support

### Shop / Trading System (v0.2 — implemented)

**Concept:** Children collect small rewards (bonbons, cookies, etc.) and trade them for bigger prizes (robots, cars, treasure map pieces).

**Status:** v0.2 implemented. 6 robot images in `src/data/images/Shop/`. Snake Junk Eater and Shop/Trading System fully functional.

**Data Model Changes:**
- `collectedRewards` changes from `string[]` → `Record<string, number>` (reward ID → quantity)
- New file: `shopItems.json` — 6 collectible robot characters
- New file: `tradeRecipes.json` — defines trade costs (e.g., 3 🍬 + 2 🍪 = 🤖)
- New `tradedItems` field in `GameProgress`

**Storage Changes:**
- `addReward()` increments count instead of pushing ID
- New `tradeRewards()` function — deducts small items, gives big item

**New Pages:**
- Shop page — shows 6 robots with costs and rarity
- Tap a prize → see what's needed → confirm trade if enough items

**UI Updates:**
- Collection page shows quantities (e.g., "🍬 x5")
- Reward popup shows "+1" feedback
- Main menu gets a new "Shop" button

**Example Trade Recipe:**
```json
{ "id": "s1", "name": "Син Робот", "emoji": "🤖", "cost": { "r1": 3, "r2": 2 } }
```

**Estimated Effort:** ~6-8 hours (see RELEASE_v0.2_PLAN.md)

The architecture supports these additions without major refactoring.

---

# 14. Development Philosophy

The project should evolve incrementally.

Every version must be:

- playable
- stable
- documented
- maintainable

No temporary hacks.

No unnecessary complexity.

Readable code is preferred over clever code.

---

# 15. Initial Milestone (Version 0.1)

Version 0.1 will include:

- Project structure
- Main menu
- Learning mode
- Challenge mode
- Basic navigation
- Around 20 words
- Local JSON data
- Local audio
- Responsive layout

No advanced animations.

No character.

No achievements.

No statistics.

The objective is to create a complete but minimal playable game.

---

# 16. Long-Term Goal

Create a polished educational game that children genuinely enjoy playing.

Learning should happen naturally through interaction, curiosity and positive reinforcement.

The project should become a reusable foundation for future educational games.

---

# 17. Implementation Status (v0.1)

## Completed

- [x] Project structure (Vite + React + TypeScript)
- [x] Tailwind CSS with custom colors/animations
- [x] Framer Motion animations
- [x] Main menu with animated buttons
- [x] Learning Mode - click letter to hear sound and auto-advance
- [x] Challenge Mode - select 5/10/15/20 words, 3 letter options
- [x] Reward system (10 rewards, 8 junk items)
- [x] Collection page (rewards & junk tabs, click for full-screen view, scrollable on mobile)
- [x] Memory Game - 16 cards (8 pairs), flip to match letters
- [x] LocalStorage progress saving
- [x] Custom large cursor (👆)
- [x] Web Speech API for Bulgarian pronunciation
- [x] Web Audio API for sound effects
- [x] PWA support (offline ready)
- [x] 30 Bulgarian words with correct letter associations
- [x] Progress visualization (color-coded letter grid showing learned/seen/unknown)
- [x] Settings page (volume control, reset progress)
- [x] MP3 letter sounds on Progress page (click any letter to hear pronunciation)

# 17. Implementation Status (v0.2)

## Completed

- [x] Data model change: `collectedRewards`/`collectedJunk` from `string[]` → `Record<string, number>`
- [x] Migration logic for old localStorage data
- [x] Helper functions: `getTotalRewardCount()`, `getTotalJunkCount()`, `getRewardCount()`, `getJunkCount()`
- [x] Snake Junk Eater - animated worm popup when junk > rewards on Collection page
- [x] Shop/Trading System - buy 6 robot characters with collected rewards
- [x] Shop page with item grid, cost display, buy flow, rarity badges
- [x] Trade functions: `canAfford()`, `tradeRewards()`, `getTradedItemCount()`
- [x] Collection page shows quantities (×N) on each item
- [x] Main menu "🛒 Магазин" button
- [x] `/shop` route added to App.tsx
- [x] Eating/gulp sound effects added to audio.ts
- [x] 6 AI-generated robot PNG images in `public/data/images/Shop/` (must be in `public/` for Vite to serve them)
- [x] Memory Game awards 1 random reward (same pool as Challenge mode) on winning — shown in the 🏆 win popup, saved via `addReward()`, once per win (guarded by `rewardGrantedRef`, reset on restart)

## Current Word List (src/data/words.json)

А-Акула鲨, Б-Балон🎈, В-Влак🚂, Г-Гъба🍄, Д-Дърво🌳, Е-Елек🦺, Ж-Жираф🦒, З-Звезда⭐, И-Игла🪡, Й-Йога🧘, К-Котка🐱, Л-Луна🌙, М-Мечка🧸, Н-Нос👃, О-Око👁️, П-Птица🐦, Р-Риба🐟, С-Слънце☀️, Т-Топка⚽, У-Ухо👂, Ф-Фламинго🦩, Х-Хляб🍞, Ц-Цвете🌸, Ч-Чаша☕, Ш-Шапка🎩, Щ-Щурец🦗, Ъ-Ъгъл📐, Ю-Юмрук👊, Я-Ягода🍓

Missing letter: Ь (soft sign - rarely starts words)

## Next Steps

### Priority: High
- [x] Progress visualization (color-coded letter grid showing learned/seen/unknown)
- [x] Settings page (volume control, reset progress)
- [ ] Improve responsive design for mobile
- [ ] Add word display on challenge mode (show word after answer)
- [ ] Fix challenge mode - show word name in reward popup

### Priority: Medium
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

The project is already a git repository, initialized and connected to a remote on GitHub.

**Remote URL:** https://github.com/mytag911mytag911/bukvichko.git
**Branch:** `main`

## Deployment (IMPORTANT — read before investigating "broken" deploys)

The live site is at: **https://mytag911mytag911.github.io/bukvichko/**

### How deployment works

- **Deployment is FULLY AUTOMATIC via GitHub Actions.** The workflow file is `.github/workflows/deploy.yml` (committed in the repo — note: folder names starting with `.` are hidden from some search tools, so always check with `git ls-tree` or `git show` if a search finds nothing).
- On every `git push` to `main`, the workflow:
  1. Checks out the code on a **Linux** runner (`ubuntu-latest`)
  2. Runs `npm ci` + `npm run build`
  3. Deploys `dist/` to GitHub Pages via `actions/deploy-pages`
- **No manual deployment step is needed.** Just push to `main` and wait a few minutes.
- Deployment runs can be inspected at: `https://api.github.com/repos/mytag911mytag911/bukvichko/actions/runs` (public API, no auth needed) — check `head_sha`, `status`, `conclusion`.
- GitHub Pages + CDN caching: HTML may take ~1-10 minutes to update after a successful run. Use a cache-busting query string (`?v=random`) when checking, and hard-refresh (Ctrl+F5) when testing, since the PWA service worker may serve a cached version.

### ⚠️ FALSE ALARM WARNING — bundle hash mismatch between local and live builds

**A local Windows build and the CI Linux build produce DIFFERENT hashed filenames** (e.g. local `index-Byu5hXmM.js` vs live `index-_M-NmY20.js`) for the SAME code. This is normal — platform differences change the content hash.

- **Do NOT conclude the deployment is broken just because the live bundle name differs from the local `dist/` name.** The names always differ; compare CONTENT instead (e.g. download the live JS and search for a distinctive string from the new code).
- `index.html` may reference a different JS hash than the local build while the CSS hash matches — this is also normal, not a "mixed" deployment.

### ⚠️ The `gh-pages` branch is LEGACY — do not deploy to it

- A `gh-pages` branch exists on the remote (used before the Actions workflow was added).
- **GitHub Pages is configured to use the GitHub Actions source, NOT the `gh-pages` branch.** Pushing to `gh-pages` has NO effect on the live site.
- Do not build or push anything to `gh-pages`. If needed, it can be deleted safely (`git push origin --delete gh-pages`).
- Old lesson: a manual `gh-pages` push was once mistaken for a successful deploy — only the Actions run matters.

### Deploy checklist

1. `git push` to `main`
2. Wait ~2-5 minutes for the Actions run to finish (`conclusion: success`)
3. Verify the live site serves the new code by checking for a NEW distinctive string from the change — not by comparing bundle filenames

### Common Git Commands

**Check status:**
```bash
git status
```
Shows which files are modified, staged, or untracked.

**Stage changes:**
```bash
git add <file>          # Stage a specific file
git add .               # Stage all changed files
git add src/            # Stage an entire folder
```

**Commit changes:**
```bash
git commit -m "Your message here"
```
Records staged changes with a descriptive message.

**Push to remote:**
```bash
git push                              # Push current branch (if upstream is set)
git push --set-upstream origin main   # Push and set upstream for first time
```

**Pull latest changes:**
```bash
git pull
```
Fetches and merges remote changes into the current branch.

**View commit history:**
```bash
git log --oneline              # Compact history
git log --oneline -10          # Last 10 commits
```

**View differences:**
```bash
git diff                       # Unstaged changes
git diff --staged              # Staged changes (about to be committed)
```

**Undo changes:**
```bash
git restore <file>             # Discard unstaged changes in a file
git restore --staged <file>    # Unstage a file without discarding changes
```

**Create a new branch:**
```bash
git checkout -b <branch-name>  # Create and switch to a new branch
git checkout <branch-name>     # Switch to an existing branch
```

**Merge a branch:**
```bash
git merge <branch-name>
```

**Standard workflow:**
1. `git status` — check what changed
2. `git add <files>` — stage the files
3. `git commit -m "message"` — commit
4. `git push` — push to GitHub

## File Structure

```
.github/
  workflows/
    deploy.yml        - GitHub Actions: auto-builds and deploys to GitHub Pages on push to main

public/
  data/
    images/
      Shop/            - 6 robot PNG images for the shop (served as static assets by Vite)

src/
  App.tsx              - Router setup
  main.tsx             - Entry point
  index.css            - Global styles, custom cursor
  types/index.ts       - TypeScript types
  data/
    words.json         - 55 words with letters/emojis
    rewards.json       - 20 collectible rewards
    junkItems.json     - 20 funny junk items
    shopItems.json     - 6 collectible robot characters
    tradeRecipes.json  - Trade cost definitions
    sounds/            - 30 MP3 files for letter pronunciation (А.mp3–Я.mp3, ь.mp3)
    images/
      Shop/            - 6 robot PNG images (source copies, not served by Vite)
  components/
    WormPopup.tsx      - Animated snake/worm modal for junk eating
  pages/
    MainMenu.tsx       - Home page with navigation
    LearningMode.tsx   - Click letters to learn
    ChallengeMode.tsx  - Quiz with rewards
    ChallengeSelect.tsx- Word count selection
    Collection.tsx     - View collected items with quantities
    MemoryGame.tsx     - Memory matching game (awards 1 random reward on win)
    Settings.tsx       - Volume control, reset progress
    Progress.tsx       - Color-coded letter grid
    Shop.tsx           - Shop page with trading system
  utils/
    storage.ts         - LocalStorage management + trade functions
    audio.ts           - TTS + MP3 playback + sound effects
    helpers.ts         - Shuffle/random utilities
    worm.ts            - Worm feeding logic
```

## Notes for Next Session

- User wants more words per letter for variety
- Ensure all Bulgarian letters have at least one word
- Check that emojis match words correctly
- Test on mobile devices for touch responsiveness
- **Deployment is automatic on push to `main` via GitHub Actions — never deploy to the `gh-pages` branch (legacy, unused). See the "Deployment" section above.**
- **Remember the MANDATORY RULE at the top: update this AGENTS.md file with every code change.**
- 2026-10-11: Memory Game now awards 1 random reward per win (same pool as Challenge mode). User confirmed approval of: 1 prize per win, shown inside the existing 🏆 popup, and Memory wins counting toward `challengeWins`/`totalGamesPlayed` stats.