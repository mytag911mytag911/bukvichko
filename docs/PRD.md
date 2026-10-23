# Product Requirements Document (PRD)

**Project Name (working title):** Adventure of Bukvichko

**Version:** 0.2

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
