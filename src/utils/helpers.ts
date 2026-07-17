import { Word } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

export function getRandomWordExcept(words: Word[], excludeId: string): Word {
  const available = words.filter(w => w.id !== excludeId);
  return available[Math.floor(Math.random() * available.length)];
}

export function getRandomWrongLetters(correctLetter: string, allLetters: string[], count: number): string[] {
  const wrongLetters = allLetters.filter(l => l !== correctLetter);
  return getRandomItems(wrongLetters, count);
}
