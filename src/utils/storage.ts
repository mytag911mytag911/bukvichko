import { GameProgress, GameSettings } from '../types';

const PROGRESS_KEY = 'bukvichko_progress';
const SETTINGS_KEY = 'bukvichko_settings';

const defaultProgress: GameProgress = {
  learnedLetters: [],
  challengeWins: 0,
  challengeLosses: 0,
  collectedRewards: [],
  collectedJunk: [],
  totalGamesPlayed: 0,
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
};

export function getProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch {
    console.error('Failed to load progress');
  }
  return defaultProgress;
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
  if (!progress.collectedRewards.includes(rewardId)) {
    progress.collectedRewards.push(rewardId);
  }
  progress.challengeWins++;
  progress.totalGamesPlayed++;
  saveProgress(progress);
  return progress;
}

export function addJunk(junkId: string): GameProgress {
  const progress = getProgress();
  if (!progress.collectedJunk.includes(junkId)) {
    progress.collectedJunk.push(junkId);
  }
  progress.challengeLosses++;
  progress.totalGamesPlayed++;
  saveProgress(progress);
  return progress;
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
