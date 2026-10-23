import { GameProgress, GameSettings } from '../types';
import tradeRecipes from '../data/tradeRecipes.json';
import flags from '../data/flags.json';

const PROGRESS_KEY = 'bukvichko_progress';
const SETTINGS_KEY = 'bukvichko_settings';

const defaultProgress: GameProgress = {
  learnedLetters: [],
  challengeWins: 0,
  challengeLosses: 0,
  collectedRewards: {},
  collectedJunk: {},
  tradedItems: {},
  unlockedFlags: [],
  totalGamesPlayed: 0,
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
};

function migrateProgress(progress: any): GameProgress {
  if (Array.isArray(progress.collectedRewards)) {
    const migrated: Record<string, number> = {};
    progress.collectedRewards.forEach((id: string) => {
      migrated[id] = (migrated[id] || 0) + 1;
    });
    progress.collectedRewards = migrated;
  }

  if (Array.isArray(progress.collectedJunk)) {
    const migrated: Record<string, number> = {};
    progress.collectedJunk.forEach((id: string) => {
      migrated[id] = (migrated[id] || 0) + 1;
    });
    progress.collectedJunk = migrated;
  }

  if (!progress.tradedItems) {
    progress.tradedItems = {};
  }

  if (!Array.isArray(progress.unlockedFlags)) {
    progress.unlockedFlags = [];
  }

  if (!progress.collectedRewards || typeof progress.collectedRewards !== 'object') {
    progress.collectedRewards = {};
  }
  if (!progress.collectedJunk || typeof progress.collectedJunk !== 'object') {
    progress.collectedJunk = {};
  }

  return progress as GameProgress;
}

export function getProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migrateProgress({ ...defaultProgress, ...parsed });
    }
  } catch {
    console.error('Failed to load progress');
  }
  return { ...defaultProgress };
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress');
  }
}

export function addLearnedLetter(letter: string): GameProgress {
  const progress = getProgress();
  if (!progress.learnedLetters.includes(letter)) {
    progress.learnedLetters.push(letter);
    saveProgress(progress);
  }
  return progress;
}

export function addReward(rewardId: string): GameProgress {
  const progress = getProgress();
  progress.collectedRewards[rewardId] = (progress.collectedRewards[rewardId] || 0) + 1;
  progress.challengeWins++;
  progress.totalGamesPlayed++;
  saveProgress(progress);
  return progress;
}

export function addJunk(junkId: string): GameProgress {
  const progress = getProgress();
  progress.collectedJunk[junkId] = (progress.collectedJunk[junkId] || 0) + 1;
  progress.challengeLosses++;
  progress.totalGamesPlayed++;
  saveProgress(progress);
  return progress;
}

export function getTotalRewardCount(): number {
  const progress = getProgress();
  return Object.values(progress.collectedRewards).reduce((sum, count) => sum + count, 0);
}

export function getTotalJunkCount(): number {
  const progress = getProgress();
  return Object.values(progress.collectedJunk).reduce((sum, count) => sum + count, 0);
}

export function getRewardCount(rewardId: string): number {
  const progress = getProgress();
  return progress.collectedRewards[rewardId] || 0;
}

export function getJunkCount(junkId: string): number {
  const progress = getProgress();
  return progress.collectedJunk[junkId] || 0;
}

export function canAfford(shopItemId: string): boolean {
  const recipe = tradeRecipes[shopItemId as keyof typeof tradeRecipes];
  if (!recipe) return false;
  const progress = getProgress();
  return Object.entries(recipe).every(([rewardId, needed]) => {
    const owned = progress.collectedRewards[rewardId] || 0;
    return owned >= needed;
  });
}

export function tradeRewards(shopItemId: string): boolean {
  if (!canAfford(shopItemId)) return false;

  const recipe = tradeRecipes[shopItemId as keyof typeof tradeRecipes];
  const progress = getProgress();

  Object.entries(recipe).forEach(([rewardId, needed]) => {
    progress.collectedRewards[rewardId] -= needed;
    if (progress.collectedRewards[rewardId] <= 0) {
      delete progress.collectedRewards[rewardId];
    }
  });

  progress.tradedItems[shopItemId] = (progress.tradedItems[shopItemId] || 0) + 1;
  saveProgress(progress);
  return true;
}

export function getTradedItemCount(shopItemId: string): number {
  const progress = getProgress();
  return progress.tradedItems[shopItemId] || 0;
}

export function canAffordFlag(flagId: string): boolean {
  const flag = flags.find(f => f.id === flagId);
  if (!flag) return false;
  const progress = getProgress();
  return Object.entries(flag.cost).every(([rewardId, needed]) => {
    const owned = progress.collectedRewards[rewardId] || 0;
    return owned >= needed;
  });
}

export function tradeFlag(flagId: string): boolean {
  const flag = flags.find(f => f.id === flagId);
  if (!flag) return false;

  const progress = getProgress();
  if (progress.unlockedFlags.includes(flagId)) return false;
  if (!canAffordFlag(flagId)) return false;

  Object.entries(flag.cost).forEach(([rewardId, needed]) => {
    progress.collectedRewards[rewardId] -= needed;
    if (progress.collectedRewards[rewardId] <= 0) {
      delete progress.collectedRewards[rewardId];
    }
  });

  progress.unlockedFlags.push(flagId);
  saveProgress(progress);
  return true;
}

export function isFlagUnlocked(flagId: string): boolean {
  const progress = getProgress();
  return progress.unlockedFlags.includes(flagId);
}

export function getUnlockedFlags(): string[] {
  const progress = getProgress();
  return progress.unlockedFlags;
}

export function getSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    console.error('Failed to load settings');
  }
  return defaultSettings;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    console.error('Failed to save settings');
  }
}

export function resetProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
}
