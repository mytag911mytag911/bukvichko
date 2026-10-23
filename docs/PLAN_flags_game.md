# Plan: Flags Wheel Game (🎡 Колелото на късмета)

**Status:** ✅ Implemented 2026-10-23 (see "Implementation Notes" below). This file remains the living plan for the feature; update it as the idea evolves.

---

## Concept

The kid trades 1–2 collected small rewards to unlock country flags. Unlocked flags go on a "wheel of luck". Spinning is **free and unlimited**. The wheel lands on a random unlocked flag → the kid picks the country's first Bulgarian letter (3 options, 1 correct). Correct = reward, wrong = funny junk — same pools and popups as Challenge Mode.

## Agreed Decisions

- **Flags = emoji (🇫🇷, 🇩🇪, 🇮🇹 …)** — no new graphics needed.
  ⚠️ **Mobile-only for this mode:** Windows desktop renders flag emojis as 2-letter boxes ("FR"). If PC support is ever needed, swap to free SVG flags (`flag-icons` package) — small change.
- **~12 starter flags** — recognizable countries with easy, unambiguous Bulgarian names (Франция, Германия, Италия, Испания, Англия, etc.). Wrong letter options come from the same alphabet pool as Challenge Mode.
- **Unlock cost:** agreed **flat 1 reward per flag** (user decision 2026-10-23). ⚠️ Current `flags.json` has mixed 1–2 costs — flatten as a follow-up task.
- **Spins:** free & unlimited — cost is only in unlocking flags (frustration-free, fits design philosophy).
- **Layout:** one `/flags` page with a `view` toggle (unlock grid ↔ wheel) — implemented.
- **Defaults accepted (2026-10-23):** wheel needs ≥4 unlocked flags (`MIN_FLAGS = 4`); trades permanent; duplicate answer letters (e.g. two countries starting with И) are fine. Flags tab in Collection: agreed for a later step — **not implemented yet** (keeps removal trivial, see Removal Plan).
- **⚠️ LONG-TERM AIM: ALL world flags via emoji** (~250 countries) — the 12 flags are just Phase 1. See roadmap below.

## Game Flow

1. **🚩 Flags page** — grid of flags, each with a cost badge (e.g. "🍬 x1") or already unlocked. Tap → trade → unlock.
2. **🎡 Wheel** — circular wheel (`conic-gradient` sectors, one per unlocked flag) + Framer Motion rotation to a precomputed angle (~3–4 s). If fewer than ~4 flags unlocked, prompt to unlock more first.
3. **❓ Quiz** — wheel stops → big flag shown → 3 letter options, hover/tap plays pronunciation. Correct → reward popup, wrong → junk popup (ChallengeMode pattern).

## Implementation Plan

| New | Details | Effort |
|---|---|---|
| `src/data/flags.json` | `{ id, emoji, countryBG, letter, cost: Record<rewardId, 1–2> }` × 12 | ~30 min |
| Storage | New `unlockedFlags` field in `GameProgress` + migration (same pattern as old `string[]` → `Record` migration); `tradeFlag()` / `canAffordFlag()` in `storage.ts` | ~1–2 h |
| `src/pages/FlagsGame.tsx` | Unlock grid (Shop.tsx pattern) + wheel + quiz | ~3–4 h |
| Wheel component | ~100 lines — the only genuinely new thing | included above |
| Wiring | `/flags` route in App.tsx, "🚩 Флагове" button in MainMenu | ~30 min |

**Total: ~6–8 hours** (comparable to the v0.2 Shop feature).

### Reused, not rebuilt
- Reward/junk pools, sound effects (`audio.ts`)
- Shop trade pattern + storage migration pattern
- ChallengeMode quiz UI, reward/junk popups
- Tailwind card/button styling, Framer Motion animations

## Open Questions (future)

- ~~Should unlocked flags appear in the Collection page as a new tab?~~ → **Yes** (decided 2026-10-23)
- Later: flag facts/sounds, "landed flag" added to a stamp album?

---

## Roadmap — All World Flags via Emoji (aim agreed 2026-10-23)

**Phase 2 ✅ DONE (2026-10-23):** expanded 12 → **50 flags**. Added `continent` field (Европа 26, Азия 10, Африка 4, Америка 9, Океания 1); unlock grid now grouped by continent sections with emoji headers (🏰🏯🦁🗽🏄). All costs flat 1 reward (cycled across the 9 common rewards 🍬🍪🎈🍦🍭🧁🎨🍰🧲). Original IDs f1–f12 untouched → kids' already-unlocked flags remain valid. New countries include Испания, Португалия, Швеция, Норвегия, Полша, Чехия, Украйна, САЩ, Канада, Бразилия, Аржентина, Индия, Тайланд, Южна Корея, Мароко, Кения, Австралия… Bulgarian names & first letters manually verified.

**Phase 3 (remaining ~200):** the rest of the world. Entries can be largely auto-generated from ISO 3166 codes: emoji = regional-indicator letters of the code, `letter` = first letter of the Bulgarian name, `cost: { "r1": 1 }`. ⚠️ **Bulgarian country names need human review** — auto-translation is unreliable (e.g. Обединеното кралство, Обединени арабски емирства). `flags.json` grows to ~250 entries (~60 KB — negligible).

**Emoji caveats (verify per flag on iOS + Android):**
- Subdivision flags (England 🏴󠁧󠁢󠁥󠁮󠁧󠁿, Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿, Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿) render on iOS but NOT on most Android versions → use 🇬🇧 for England instead; skip the others.
- Kosovo 🇽🇰 doesn't render on many Android devices → skip or verify first.
- Taiwan 🇹🇼, Ukraine 🇺🇦 and standard ISO country flags are safe.

**UI at scale:**
- Unlock grid: grouped by continent sections (done in Phase 2 — Европа 🏰, Азия 🏯, Африка 🦁, Америка 🗽, Океания 🏄); scrollable grid is mobile-friendly.
- Wheel: **no change needed** — only unlocked flags become sectors, so the kid controls how crowded the wheel gets. Winner selection: uniform random `Math.floor(Math.random() * n)` among unlocked flags, every spin independent.
- Storage: `unlockedFlags: string[]` scales fine (~1.5 KB for 250 IDs).
- Quiz: duplicate answer letters across countries are fine (accepted) — each quiz asks about one country only.

**Follow-up (done 2026-10-23):** `flags.json` costs flattened to the agreed flat 1 reward per flag (varied common candies 🍬🍪🎈🍦🍭🧁🎨🍰🧲).

---

## Removal Plan (if the game is rejected after testing)

The feature is **fully isolated** — nothing else depends on it. To remove completely:

**Delete 2 new files:**
- `src/pages/FlagsGame.tsx`
- `src/data/flags.json`

**Revert 4 small edits in existing files:**
- `src/App.tsx` — remove `FlagsGame` import + `/flags` route (2 lines)
- `src/pages/MainMenu.tsx` — remove "🚩 Флагове" button (12 lines)
- `src/types/index.ts` — remove `Flag` interface + `unlockedFlags` field in `GameProgress`
- `src/utils/storage.ts` — remove `flags.json` import, `unlockedFlags` default field, migration guard, and the 4 helpers (`tradeFlag`, `canAffordFlag`, `isFlagUnlocked`, `getUnlockedFlags`)

**No cleanup needed:** the `unlockedFlags` key left in players' localStorage is inert and harmless. Collection, Shop, Challenge, Memory — all untouched by this feature (the "flags tab in Collection" idea was agreed but **never implemented**, which keeps removal trivial).

**Fallback option:** if not committed yet — simply `git restore` + delete the untracked files. If committed and later removed, git history keeps the last working version recoverable.

---

## Implementation Notes (2026-10-23)

Implemented as described above. Details decided during implementation:

- **12 flags, all with distinct first letters** (so no two wheel sectors quiz on the same letter): България 🇧🇬, Франция 🇫🇷, Германия 🇩🇪, Италия 🇮🇹, Турция 🇹🇷, Русия 🇷🇺, Англия 🇬🇧, Япония 🇯🇵, Китай 🇨🇳, Египет 🇪🇬, Мексико 🇲🇽, Холандия 🇳🇱 — letters Б Ф Г И Т Р А Я К Е М Х.
- **Unlock costs** live inside `flags.json` per flag (`cost: Record<rewardId, count>`), not in `tradeRecipes.json` (that file stays shop-only). Costs 1–2 common rewards (🍬🍪🎈🍦🍭🧁🎨🍰🧲).
- **MIN_FLAGS = 4** — wheel is gated until 4 flags are unlocked ("Открий още флагове" hint otherwise).
- **Tap-to-unlock directly** from the grid (no confirm modal) + toast feedback; insufficient funds → 😄 notice + incorrect sound.
- **Quiz shows the country name under the flag and speaks it** (`playWordSound(countryBG)`) when the question appears — the wheel quiz is a phonics exercise: hear "Франция" → pick Ф. Locked flags are grayscale in the grid.
- **Result popup shows `country → letter`** (e.g. "Франция → Ф") plus the reward/junk — applies the "show word name in popup" lesson from Challenge Mode's backlog.
- **Wheel math:** sectors = unlocked flags in `flags.json` order (stable colors); precomputed landing angle so the sector *center* lands under the pointer; rotation always accumulates forward (4+ turns, 3.6 s); `conic-gradient` + Framer Motion `rotate`, `onAnimationComplete` guarded by a ref against mount-time firing.
- Everything is one page — `src/pages/FlagsGame.tsx` uses a `view: 'unlock' | 'wheel' | 'quiz'` state machine (no sub-routes).

## Windows Support Later — Where to Get Flag Pictures (verified 2026-10-23)

If the game is ever opened to Windows desktop, emoji flags won't work (render as "FR"-style boxes). Free replacements:

- **`flag-icons` (npm, MIT)** — recommended. 12.4K stars, actively maintained, SVG flags, usage: `<span className="fi fi-fr" />`. Bundled at build time → stays offline/PWA-safe.
- Alternatives: `country-flag-icons` (npm, MIT, ~1 KB/flag + React components), `svg-country-flags` (public domain, but unmaintained since 2019).

**Integration plan (small change):** add `isoCode` field (`fr`, `de`, `it`…) to `flags.json`; copy only the ~12 needed SVGs into `public/data/flags/` (a few KB each — avoids the ~4 MB full package) OR use the npm package. Only the flag display component changes; wheel, trading, storage, quiz logic untouched.

**Size impact (measured 2026-10-23):** current deployed site = ~1.65 MB (945 KB MP3s + 337 KB robot images + ~370 KB JS/CSS). Naive full-CSS import would bundle all ~260 flag SVGs → +1.2–1.4 MB (site nearly doubles). Smart approach (only the 12 needed SVGs via individual imports or `public/` copies) → +15–50 KB, site ~1.7 MB. **Always use the smart approach.**
