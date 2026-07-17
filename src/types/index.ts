export interface Word {
  id: string;
  letter: string;
  word: string;
  emoji: string;
}

export interface Reward {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare';
}

export interface JunkItem {
  id: string;
  name: string;
  emoji: string;
}

export interface GameProgress {
  learnedLetters: string[];
  challengeWins: number;
  challengeLosses: number;
  collectedRewards: string[];
  collectedJunk: string[];
  totalGamesPlayed: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}
