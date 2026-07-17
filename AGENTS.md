# Product Requirements Document (PRD)

**Project Name (working title):** Adventure of Bukvichko (working title)

**Version:** 0.1

**Language:** Bulgarian

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

### Shop / Trading System (planned)

**Concept:** Children collect small rewards (bonbons, cookies, etc.) and trade them for bigger prizes (robots, cars, treasure map pieces).

**Data Model Changes:**
- `collectedRewards` changes from `string[]` → `Record<string, number>` (reward ID → quantity)
- New file: `shopItems.json` — big tradeable prizes (robots, cars, treasure maps, etc.)
- New file: `tradeRecipes.json` — defines trade costs (e.g., 3 🍬 + 2 🍪 = 🤖)
- New `tradedItems` field in `GameProgress`

**Storage Changes:**
- `addReward()` increments count instead of pushing ID
- New `tradeRewards()` function — deducts small items, gives big item

**New Pages:**
- Shop page — shows tradeable items with costs
- Tap a prize → see what's needed → confirm trade if enough items

**UI Updates:**
- Collection page shows quantities (e.g., "🍬 x5")
- Reward popup shows "+1" feedback
- Main menu gets a new "Shop" button

**Example Trade Recipe:**
```json
{ "id": "s1", "name": "Робот", "emoji": "🤖", "cost": { "r1": 3, "r2": 2 } }
```

**Estimated Effort:** ~2-3 hours

The architecture should support these additions without major refactoring.

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
- [x] Collection page (rewards & junk tabs, click for full-screen view)
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

## File Structure

```
src/
  App.tsx              - Router setup
  main.tsx             - Entry point
  index.css            - Global styles, custom cursor
  types/index.ts       - TypeScript types
  data/
    words.json         - 55 words with letters/emojis
    rewards.json       - 20 collectible rewards
    junkItems.json     - 20 funny junk items
    sounds/            - 30 MP3 files for letter pronunciation (А.mp3–Я.mp3, ь.mp3)
  pages/
    MainMenu.tsx       - Home page with navigation
    LearningMode.tsx   - Click letters to learn
    ChallengeMode.tsx  - Quiz with rewards
    ChallengeSelect.tsx- Word count selection
    Collection.tsx     - View collected items
    MemoryGame.tsx     - Memory matching game
    Settings.tsx       - Volume control, reset progress
    Progress.tsx       - Color-coded letter grid
  utils/
    storage.ts         - LocalStorage management
    audio.ts           - TTS + MP3 playback + sound effects
    helpers.ts         - Shuffle/random utilities
```

## Notes for Next Session

- User wants more words per letter for variety
- Ensure all Bulgarian letters have at least one word
- Check that emojis match words correctly
- Test on mobile devices for touch responsiveness