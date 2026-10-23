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

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  image: string;
  category: 'robot';
  rarity: 'common' | 'uncommon' | 'rare';
}

export interface TradeRecipe {
  [rewardId: string]: number;
}

export interface Flag {
  id: string;
  emoji: string;
  countryBG: string;
  letter: string;
  cost: Record<string, number>;
}

export interface GameProgress {
  learnedLetters: string[];
  challengeWins: number;
  challengeLosses: number;
  collectedRewards: Record<string, number>;
  collectedJunk: Record<string, number>;
  tradedItems: Record<string, number>;
  unlockedFlags: string[];
  totalGamesPlayed: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}
