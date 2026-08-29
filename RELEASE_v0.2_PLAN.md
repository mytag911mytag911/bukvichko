# Release v0.2 Implementation Plan

**Version:** 0.2
**Date:** 2026-08-02
**Features:** Snake Junk Eater + Shop/Trading System + Custom Shop Images

---

## 1. Executive Summary

This release adds two major game mechanics:

1. **Snake Junk Eater** - When junk items exceed rewards, an animated snake appears and eats the excess junk
2. **Shop/Trading System** - Kids spend collected rewards to buy collectible robot characters
3. **Custom Shop Images** - 6 AI-generated robot images (already created and cleaned up in `src/data/images/Shop/`)

**Estimated Total Time:** 6-8 hours
**Difficulty:** Medium-Hard

---

## 2. Implementation Order

| Step | Feature | Time | Dependency |
|------|---------|------|------------|
| 1 | Data Model Change (`string[]` → `Record<string, number>`) | 1 hour | None |
| 2 | Snake Junk Eater | 2.5 hours | Step 1 |
| 3 | Shop/Trading System | 2.5 hours | Step 1 |
| 4 | Wire Shop Images (6 robots already in `src/data/images/Shop/`) | 15 min | Step 3 |
| 5 | Integration Testing | 30 min | Steps 2-4 |

**Critical:** Step 1 must be completed first as both features share the same data model foundation.
**Note:** 6 robot images have already been generated, cleaned, and placed in `src/data/images/Shop/`.

---

## 3. Data Model Change (Shared Foundation)

### Current State

```typescript
// src/types/index.ts
interface GameProgress {
  learnedLetters: string[];
  challengeWins: number;
  challengeLosses: number;
  collectedRewards: string[];  // ["r1", "r5"] - no quantities
  collectedJunk: string[];     // ["j1", "j3"] - no quantities
  totalGamesPlayed: number;
}
```

### New State

```typescript
// src/types/index.ts
interface GameProgress {
  learnedLetters: string[];
  challengeWins: number;
  challengeLosses: number;
  collectedRewards: Record<string, number>;  // { "r1": 3, "r5": 1 }
  collectedJunk: Record<string, number>;     // { "j1": 2, "j3": 5 }
  tradedItems: Record<string, number>;       // { "s1": 1, "s3": 2 } - NEW
  totalGamesPlayed: number;
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/types/index.ts` | Update `GameProgress` interface |
| `src/utils/storage.ts` | Rewrite `addReward()`, `addJunk()`, add helper functions, add migration logic |
| `src/pages/ChallengeMode.tsx` | Update calls to `addReward()`/`addJunk()` (no changes needed, same API) |
| `src/pages/MainMenu.tsx` | Update `progress.collectedRewards.length` to use new helper |
| `src/pages/Collection.tsx` | Update to show quantities |

### New Helper Functions

```typescript
// src/utils/storage.ts

// Get total count of all rewards
function getTotalRewardCount(): number {
  const progress = getProgress();
  return Object.values(progress.collectedRewards).reduce((sum, count) => sum + count, 0);
}

// Get total count of all junk
function getTotalJunkCount(): number {
  const progress = getProgress();
  return Object.values(progress.collectedJunk).reduce((sum, count) => sum + count, 0);
}

// Get count of specific reward
function getRewardCount(rewardId: string): number {
  const progress = getProgress();
  return progress.collectedRewards[rewardId] || 0;
}

// Get count of specific junk
function getJunkCount(junkId: string): number {
  const progress = getProgress();
  return progress.collectedJunk[junkId] || 0;
}
```

### Migration Logic

```typescript
// src/utils/storage.ts - in getProgress()

function migrateProgress(progress: any): GameProgress {
  // Migrate collectedRewards from string[] to Record<string, number>
  if (Array.isArray(progress.collectedRewards)) {
    const migrated: Record<string, number> = {};
    progress.collectedRewards.forEach((id: string) => {
      migrated[id] = (migrated[id] || 0) + 1;
    });
    progress.collectedRewards = migrated;
  }

  // Migrate collectedJunk from string[] to Record<string, number>
  if (Array.isArray(progress.collectedJunk)) {
    const migrated: Record<string, number> = {};
    progress.collectedJunk.forEach((id: string) => {
      migrated[id] = (migrated[id] || 0) + 1;
    });
    progress.collectedJunk = migrated;
  }

  // Initialize tradedItems if missing
  if (!progress.tradedItems) {
    progress.tradedItems = {};
  }

  return progress;
}
```

---

## 4. Snake Junk Eater Feature

### Overview

When `totalJunkCount > totalRewardCount`, a worm/snake popup appears on the Collection page and eats enough junk to equalize the counts.

### Game Design

- **Trigger:** Automatic on Collection page load
- **Animation:** All excess junk eaten at once
- **Removal:** Reduce count by 1 (keep item type, reduce quantity)
- **Display:** Pop-up modal overlay on Collection page

### Algorithm

```
1. Calculate excess = totalJunkCount - totalRewardCount
2. If excess <= 0, no worm needed
3. Create list of junk types with count > 0
4. While excess > 0:
   a. Pick random junk type from list
   b. Reduce its count by 1
   c. excess--
   d. If count reaches 0, remove from list
5. Return list of eaten items (for animation)
6. Save updated progress
```

### New Files

| File | Purpose |
|------|---------|
| `src/components/WormPopup.tsx` | Animated snake/worm modal component |
| `src/utils/worm.ts` | Worm feeding logic |

### Modified Files

| File | Changes |
|------|---------|
| `src/pages/Collection.tsx` | Add worm trigger on mount, display worm popup |
| `src/utils/audio.ts` | Add eating sound effects |

### WormPopup Component Design

```tsx
// src/components/WormPopup.tsx

interface WormPopupProps {
  eatenItems: Array<{ id: string; name: string; emoji: string; count: number }>;
  onClose: () => void;
}

// Animation sequence:
// 1. Overlay fades in (0-0.3s)
// 2. Snake slides in from side (0.3-0.8s, spring animation)
// 3. Items fly toward snake (0.8-2s, staggered)
// 4. Snake chomps (2-2.5s, scale/rotate animation)
// 5. Summary text appears (2.5-3s)
// 6. Auto-dismiss or tap to close (3s+)
```

### Visual Design

- Large animated snake emoji 🐍 or custom SVG
- Snake appears with slide-in spring animation
- Junk items float toward snake's mouth (staggered)
- Snake does "chomping" animation (scale/rotate)
- Summary: "Змията изяде X боклучета!" (The worm ate X junk items!)
- Auto-dismisses after 3-4 seconds or click to dismiss

### Sound Effects

```typescript
// src/utils/audio.ts - add these functions

function playEatingSound(): void {
  // Chomping sound effect using Web Audio API
  // Multiple quick "chomp" sounds in sequence
}

function playGulpSound(): void {
  // Single "gulp" sound
}
```

### Integration in Collection.tsx

```tsx
// src/pages/Collection.tsx

useEffect(() => {
  const totalJunk = getTotalJunkCount();
  const totalRewards = getTotalRewardCount();
  
  if (totalJunk > totalRewards) {
    const eatenItems = feedWorm();
    setWormEatenItems(eatenItems);
    setShowWorm(true);
  }
}, []);

// Render worm popup
<AnimatePresence>
  {showWorm && (
    <WormPopup 
      eatenItems={wormEatenItems}
      onClose={() => setShowWorm(false)}
    />
  )}
</AnimatePresence>
```

---

## 5. Shop/Trading System Feature

### Overview

Kids spend collected rewards to buy special items (robots, vehicles, weapons, armor). Each shop item has a cost defined as a combination of reward items.

### Game Design

- **Currency:** Collected rewards (🍬, 🍪, ⭐, 💎, etc.)
- **Shop Items:** Special prizes (robots, bulldozers, swords, shields, etc.)
- **Mechanic:** Trade multiple small rewards for one big prize
- **Display:** Grid of shop items with costs, buy button if affordable

### Data Files

#### `src/data/shopItems.json`

```json
[
  { "id": "s1", "name": "Син Робот", "emoji": "🤖", "image": "/src/data/images/Shop/BlueBot.png", "category": "robot", "rarity": "common" },
  { "id": "s2", "name": "Робот с Очила", "emoji": "🤖", "image": "/src/data/images/Shop/BlueGlassBot.png", "category": "robot", "rarity": "common" },
  { "id": "s3", "name": "Зелен Робот", "emoji": "🤖", "image": "/src/data/images/Shop/GreenBot.png", "category": "robot", "rarity": "common" },
  { "id": "s4", "name": "Сив Робот", "emoji": "🤖", "image": "/src/data/images/Shop/GreyBot.png", "category": "robot", "rarity": "uncommon" },
  { "id": "s5", "name": "Оранжев Робот", "emoji": "🤖", "image": "/src/data/images/Shop/OrangeBot.png", "category": "robot", "rarity": "uncommon" },
  { "id": "s6", "name": "Червен Робот", "emoji": "🤖", "image": "/src/data/images/Shop/RedBot.png", "category": "robot", "rarity": "rare" }
]
```

#### `src/data/tradeRecipes.json`

```json
{
  "s1": { "r1": 3, "r2": 2 },
  "s2": { "r1": 3, "r2": 2 },
  "s3": { "r1": 4, "r6": 2 },
  "s4": { "r5": 3, "r1": 3 },
  "s5": { "r5": 4, "r6": 2 },
  "s6": { "r5": 5, "r6": 3 }
}
```

### Types

```typescript
// src/types/index.ts

interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  image: string;
  category: 'robot';
  rarity: 'common' | 'uncommon' | 'rare';
}

interface TradeRecipe {
  [rewardId: string]: number;  // reward ID → quantity needed
}
```

### New Files

| File | Purpose |
|------|---------|
| `src/pages/Shop.tsx` | Shop page with items grid |
| `src/data/shopItems.json` | Shop item definitions |
| `src/data/tradeRecipes.json` | Trade cost definitions |
| `src/data/images/Shop/` | 6 robot PNG images (already created and cleaned) |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add `ShopItem`, `TradeRecipe` interfaces |
| `src/utils/storage.ts` | Add `tradeRewards()`, `canAfford()`, `getTradedItemCount()` |
| `src/App.tsx` | Add `/shop` route |
| `src/pages/MainMenu.tsx` | Add "Shop" button |

### New Storage Functions

```typescript
// src/utils/storage.ts

function canAfford(shopItemId: string): boolean {
  const recipe = tradeRecipes[shopItemId];
  const progress = getProgress();
  
  return Object.entries(recipe).every(([rewardId, needed]) => {
    const owned = progress.collectedRewards[rewardId] || 0;
    return owned >= needed;
  });
}

function tradeRewards(shopItemId: string): boolean {
  if (!canAfford(shopItemId)) return false;
  
  const recipe = tradeRecipes[shopItemId];
  const progress = getProgress();
  
  // Deduct rewards
  Object.entries(recipe).forEach(([rewardId, needed]) => {
    progress.collectedRewards[rewardId] -= needed;
    if (progress.collectedRewards[rewardId] <= 0) {
      delete progress.collectedRewards[rewardId];
    }
  });
  
  // Add shop item
  progress.tradedItems[shopItemId] = (progress.tradedItems[shopItemId] || 0) + 1;
  
  saveProgress(progress);
  return true;
}

function getTradedItemCount(shopItemId: string): number {
  const progress = getProgress();
  return progress.tradedItems[shopItemId] || 0;
}
```

### Shop Page Design

```
┌─────────────────────────────────────┐
│ ← 🛒 Магазин                       │
├─────────────────────────────────────┤
│ [🤖] [🤖] [🤖] [🤖] [🤖] [🤖]    │
│ Син   Очила Зелен Сив  Оранж Черв │
│ 3🍬+2🍪 3🍬+2🍪 4🍬+2⭐ ...       │
│                                      │
├─────────────────────────────────────┤
│ Твоята колекция: 🍬x5 🍪x3 ⭐x2   │
└─────────────────────────────────────┘
```

### UI Components

1. **Shop Grid** - 4-column grid (mobile) / 5-column (desktop)
2. **Item Card** - Shows image/emoji, name, cost, quantity owned
3. **Buy Button** - Enabled if can afford, disabled if not
4. **Confirmation Modal** - Shows cost breakdown, confirm/cancel
5. **Success Animation** - Confetti/sparkles on purchase

### Navigation

**MainMenu.tsx** - Add new button:

```tsx
<motion.button
  initial={{ x: 100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.9 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate('/shop')}
  className="game-button bg-gradient-to-r from-fun-green to-fun-cyan text-shadow"
>
  🛒 Магазин
</motion.button>
```

**App.tsx** - Add route:

```tsx
<Route path="/shop" element={<Shop />} />
```

---

## 6. Custom Shop Images ✅ COMPLETED

### Overview

Shop items use custom AI-generated robot images. Images are stored locally as PNG files with transparent backgrounds.

**Status:** 6 robot images have been generated, cleaned of watermarks/artifacts, and placed in `src/data/images/Shop/`.

### Image Generation Options

#### Option 1: AI Generation (Recommended)

**Tools:**
| Tool | Free Tier | Style Quality | License |
|------|-----------|---------------|---------|
| **SEELE AI** (seeles.ai) | Unlimited, no login | High (game art trained) | Commercial included |
| **Canva AI** | 50 images/month | Good | Personal use |
| **Picsart AI** | Limited free | Good cartoon styles | Check terms |
| **BudgetPixel** | Free | Good concept art | Check terms |

**Recommended:** SEELE AI - free, unlimited, commercial license included

**Prompt Template:**
```
Cute cartoon [ITEM], friendly style, bright colors, 
children's game aesthetic, white background, 
clean lines, no shadows, PNG
```

**Specific Prompts:**
- Robot: `"Cute cartoon robot, friendly face, blue and silver, children's game style"`
- Bulldozer: `"Cute cartoon bulldozer, yellow, big wheels, children's game style"`
- Sword: `"Cute cartoon sword, silver blade, golden handle, children's game style"`
- Shield: `"Cute cartoon shield, red and gold, knight style, children's game style"`
- Helmet: `"Cute cartoon knight helmet, silver with red plume, children's game style"`
- Car: `"Cute cartoon car, red, sporty, children's game style"`
- Airplane: `"Cute cartoon airplane, white and blue, friendly, children's game style"`
- Tank: `"Cute cartoon tank, green, cute design, children's game style"`
- Falcon: `"Cute cartoon falcon, brown feathers, friendly face, children's game style"`
- Dragon: `"Cute cartoon dragon, green, friendly, children's game style"`

#### Option 2: Free Asset Libraries

| Source | What's Available | License |
|--------|------------------|---------|
| **Kenney.nl** | Robot Pack (50 assets), Vehicle packs | CC0 |
| **Game-icons.net** | 4180+ SVG/PNG icons | CC BY 3.0 |
| **OpenGameArt.org** | Various cartoon asset packs | Mixed |
| **FreePixel** | 1164 pixel art sprites | Free commercial |

#### Option 3: Hybrid (Highest Quality)

1. Generate base images with AI
2. Refine manually in Photoshop/GIMP
3. Ensure consistent style across all items

### Image Specifications

- **Size:** 256x256 pixels (retina-ready)
- **Format:** PNG with transparent background
- **Style:** Cartoon, bright colors, friendly, children's game aesthetic
- **Consistency:** Same prompt template for all items

### File Structure

```
src/
  data/
    shop-images/          # NEW directory
      robot.png
      bulldozer.png
      sword.png
      shield.png
      helmet.png
      car.png
      airplane.png
      tank.png
      falcon.png
      dragon.png
```

### UI Implementation

```tsx
// Fallback pattern: image → emoji
<img 
  src={item.image} 
  alt={item.name}
  className="w-32 h-32 object-contain"
  onError={(e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  }}
/>
<span className="text-8xl hidden">{item.emoji}</span>
```

---

## 7. Game Balance Considerations

### Snake + Shop Dynamic

This creates a **healthy gameplay loop**:

1. **Play Challenge Mode** → earn rewards OR junk
2. **If junk > rewards** → snake eats junk (motivation to keep winning)
3. **Collect rewards** → save up for shop items
4. **Buy special items** → feel accomplished
5. **Repeat** → collect more rewards for better items

### Pricing Strategy

| Category | Items | Cost Range | Sessions to Buy |
|----------|-------|------------|-----------------|
| Common | Син Робот, Робот с Очила, Зелен Робот | 5-6 rewards | 2-3 sessions |
| Uncommon | Сив Робот, Оранжев Робот | 6-8 rewards | 3-4 sessions |
| Rare | Червен Робот | 8-10 rewards | 4-5 sessions |

### Balance Tuning

If kids are buying items too quickly:
- Increase trade costs
- Add more shop items
- Make rare items more expensive

If kids are frustrated:
- Decrease trade costs
- Add more common items
- Give bonus rewards for streaks

---

## 8. File Summary

### New Files

| File | Purpose |
|------|---------|
| `src/components/WormPopup.tsx` | Animated snake/worm modal |
| `src/utils/worm.ts` | Worm feeding logic |
| `src/pages/Shop.tsx` | Shop page |
| `src/data/shopItems.json` | Shop item definitions |
| `src/data/tradeRecipes.json` | Trade cost definitions |
| `src/data/images/Shop/` | 6 robot PNG images (already created) |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/index.ts` | Update `GameProgress`, add `ShopItem`, `TradeRecipe` |
| `src/utils/storage.ts` | Rewrite reward/junk functions, add trade functions, add migration |
| `src/pages/Collection.tsx` | Show quantities, trigger worm |
| `src/pages/MainMenu.tsx` | Add Shop button, update reward count display |
| `src/App.tsx` | Add `/shop` route |
| `src/utils/audio.ts` | Add eating sound effects |

---

## 9. Testing Checklist

### Data Model Migration
- [ ] Old localStorage data migrates correctly
- [ ] New data saves in correct format
- [ ] Quantities display correctly in Collection

### Snake Feature
- [ ] Worm appears when junk > rewards
- [ ] Worm does NOT appear when junk <= rewards
- [ ] Worm eats correct number of items
- [ ] Junk counts reduce by 1
- [ ] Items with count 0 are removed
- [ ] Animation plays smoothly
- [ ] Sound effects play
- [ ] Auto-dismiss works

### Shop Feature
- [ ] Shop page loads correctly
- [ ] Items display with images/emojis
- [ ] Costs display correctly
- [ ] Buy button enabled when can afford
- [ ] Buy button disabled when cannot afford
- [ ] Trade deducts correct rewards
- [ ] Trade adds shop item
- [ ] Quantity owned displays
- [ ] Confirmation modal works
- [ ] Success animation plays

### Image Display
- [ ] Images load correctly
- [ ] Fallback to emoji works if image fails
- [ ] Images scale properly on mobile/desktop

### Integration
- [ ] Navigation works (Main Menu → Shop → Collection)
- [ ] Progress persists after trade
- [ ] Reset progress clears shop items too
- [ ] All pages responsive on mobile

---

## 10. How to Use This Document

### For Next Session

When starting a new session, you can say:

**To implement:**
> "Implement the v0.2 features from RELEASE_v0.2_PLAN.md - start with the data model change"

**To replan:**
> "Re-read RELEASE_v0.2_PLAN.md and suggest improvements to the implementation order"

**To implement specific feature:**
> "Implement only the Snake Junk Eater from the plan"

**To wire shop images:**
> "The robot images are already in src/data/images/Shop/ - wire them into the shop system"

**To test:**
> "Run the testing checklist from RELEASE_v0.2_PLAN.md"

---

## 11. Future Enhancements

### Potential v0.3 Features

- [ ] Junk Shop (sell junk for coins)
- [ ] Item Trading (trade shop items with friends)
- [ ] Collection Album (view all owned shop items)
- [ ] Achievement System (unlock special shop items)
- [ ] Daily Deals (rotating discounted items)

---

**Document Version:** 1.0
**Last Updated:** 2026-08-02
**Author:** Implementation Planning Session
