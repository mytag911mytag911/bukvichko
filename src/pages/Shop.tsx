import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import shopItems from '../data/shopItems.json';
import tradeRecipes from '../data/tradeRecipes.json';
import rewards from '../data/rewards.json';
import { canAfford, tradeRewards, getTradedItemCount, getProgress } from '../utils/storage';
import { playCorrectSound, playClickSound } from '../utils/audio';

export default function Shop() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const progress = getProgress();

  const handleBuy = (itemId: string) => {
    const success = tradeRewards(itemId);
    if (success) {
      playCorrectSound();
      setPurchasedId(itemId);
      setTimeout(() => setPurchasedId(null), 2000);
    }
    setSelectedItem(null);
  };

  const getCostDisplay = (itemId: string) => {
    const recipe = (tradeRecipes as Record<string, Record<string, number>>)[itemId];
    if (!recipe) return '';
    return Object.entries(recipe)
      .map(([rewardId, count]) => {
        const reward = rewards.find(r => r.id === rewardId);
        return `${reward?.emoji ?? '?'}×${count}`;
      })
      .join(' + ');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-blue-100 to-blue-200 border-blue-300';
      case 'uncommon': return 'from-purple-100 to-purple-200 border-purple-300';
      case 'rare': return 'from-yellow-100 to-yellow-200 border-yellow-400';
      default: return 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="text-4xl p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          ←
        </motion.button>
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-primary-600"
        >
          🛒 Магазин
        </motion.h1>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
          {shopItems.map((item, index) => {
                const owned = getTradedItemCount(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { playClickSound(); setSelectedItem(item.id); }}
                className={`bg-gradient-to-br ${getRarityColor(item.rarity)} border-2 rounded-2xl p-3 flex flex-col items-center gap-2 cursor-pointer shadow-md relative`}
              >
                {owned > 0 && (
                  <span className="absolute top-1 right-2 text-xs font-bold bg-white/80 rounded-full px-2 py-0.5 text-primary-600">
                    ×{owned}
                  </span>
                )}
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="text-5xl hidden">{item.emoji}</span>
                </div>
                <span className="text-sm md:text-base font-bold text-gray-700 text-center">{item.name}</span>
                <span className="text-xs md:text-sm text-gray-600">{getCostDisplay(item.id)}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.rarity === 'rare' ? 'bg-yellow-300 text-yellow-800' :
                  item.rarity === 'uncommon' ? 'bg-purple-200 text-purple-700' :
                  'bg-blue-200 text-blue-700'
                }`}>
                  {item.rarity === 'rare' ? '⭐ Рядък' : item.rarity === 'uncommon' ? '💜 Нестандартен' : '🔵 Обикновен'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-white/50 rounded-2xl text-center"
      >
        <p className="text-sm md:text-base text-primary-600 font-medium">
          Твоята колекция:{' '}
          {Object.entries(progress.collectedRewards)
            .filter(([, count]) => count > 0)
            .map(([id, count]) => {
              const reward = rewards.find(r => r.id === id);
              return `${reward?.emoji ?? '?'}×${count}`;
            })
            .join(' ') || 'Празно'}
        </p>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full"
            >
              {(() => {
                const item = shopItems.find(i => i.id === selectedItem);
                if (!item) return null;
                const affordable = canAfford(item.id);
                return (
                  <>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="text-7xl hidden">{item.emoji}</span>
                    <h2 className="text-2xl font-bold text-gray-700">{item.name}</h2>
                    <p className="text-lg text-gray-600">{getCostDisplay(item.id)}</p>
                    <div className="flex gap-3 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedItem(null)}
                        className="px-5 py-2 bg-gray-300 text-gray-700 rounded-full font-bold"
                      >
                        Отказ
                      </motion.button>
                      <motion.button
                        whileHover={affordable ? { scale: 1.05 } : {}}
                        whileTap={affordable ? { scale: 0.95 } : {}}
                        onClick={() => affordable && handleBuy(item.id)}
                        className={`px-5 py-2 rounded-full font-bold text-white ${
                          affordable
                            ? 'bg-gradient-to-r from-fun-green to-fun-cyan shadow-lg'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {affordable ? 'Купи!' : 'Нямаш достатъчно'}
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {purchasedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-green-500 text-white text-3xl font-bold px-8 py-4 rounded-full shadow-2xl">
              🎉 Купено!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
