import { getProgress, saveProgress } from './storage';
import junkItems from '../data/junkItems.json';

interface EatenItem {
  id: string;
  name: string;
  emoji: string;
  count: number;
}

export function feedWorm(): EatenItem[] {
  const progress = getProgress();
  const totalJunk = Object.values(progress.collectedJunk).reduce((s, c) => s + c, 0);
  const totalRewards = Object.values(progress.collectedRewards).reduce((s, c) => s + c, 0);
  const excess = totalJunk - totalRewards;

  if (excess <= 0) return [];

  const eaten: EatenItem[] = [];
  let remaining = excess;

  while (remaining > 0) {
    const availableTypes = Object.entries(progress.collectedJunk)
      .filter(([, count]) => count > 0)
      .map(([id]) => id);

    if (availableTypes.length === 0) break;

    const randomId = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    progress.collectedJunk[randomId]--;

    const junkDef = junkItems.find(j => j.id === randomId);
    const existing = eaten.find(e => e.id === randomId);
    if (existing) {
      existing.count++;
    } else {
      eaten.push({
        id: randomId,
        name: junkDef?.name ?? randomId,
        emoji: junkDef?.emoji ?? '❓',
        count: 1,
      });
    }

    if (progress.collectedJunk[randomId] <= 0) {
      delete progress.collectedJunk[randomId];
    }

    remaining--;
  }

  saveProgress(progress);
  return eaten;
}
