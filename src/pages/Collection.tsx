import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import rewards from '../data/rewards.json';
import junkItems from '../data/junkItems.json';
import { getProgress } from '../utils/storage';

type Tab = 'rewards' | 'junk';

interface SelectedItem {
  id: string;
  name: string;
  emoji: string;
  type: 'reward' | 'junk';
}

export default function Collection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('rewards');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const progress = getProgress();

  const handleItemClick = (item: SelectedItem) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
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
          🎁 Колекция
        </motion.h1>

        <div className="w-12"></div>
      </div>

      <div className="flex gap-3 justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all border-2 shadow-md ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-r from-fun-yellow to-fun-orange text-white border-fun-orange shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          🏆 Награди ({progress.collectedRewards.length}/{rewards.length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('junk')}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-all border-2 shadow-md ${
            activeTab === 'junk'
              ? 'bg-gradient-to-r from-fun-yellow to-fun-orange text-white border-fun-orange shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          🗑️ Боклучета ({progress.collectedJunk.length}/{junkItems.length})
        </motion.button>
      </div>

      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'rewards' ? (
            <motion.div
              key="rewards"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="grid grid-cols-4 md:grid-cols-6 gap-3 p-2"
            >
              {rewards.map((reward, index) => {
                const isCollected = progress.collectedRewards.includes(reward.id);
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={isCollected ? { scale: 1.1 } : {}}
                    whileTap={isCollected ? { scale: 0.95 } : {}}
                    onClick={() => isCollected && handleItemClick({
                      id: reward.id,
                      name: reward.name,
                      emoji: reward.emoji,
                      type: 'reward'
                    })}
                    className={`flex flex-col items-center justify-center 
                               rounded-xl shadow-lg p-2 ${
                                 isCollected
                                   ? 'bg-gradient-to-br from-white to-primary-100 cursor-pointer'
                                   : 'bg-gray-200 opacity-50'
                               }`}
                  >
                    <span className="text-5xl md:text-6xl">
                      {isCollected ? reward.emoji : '❓'}
                    </span>
                    <span className="text-sm mt-1 text-primary-600 font-medium text-center">
                      {isCollected ? reward.name : '???'}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="junk"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="grid grid-cols-4 md:grid-cols-5 gap-3 p-2"
            >
              {junkItems.map((junk, index) => {
                const isCollected = progress.collectedJunk.includes(junk.id);
                return (
                  <motion.div
                    key={junk.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={isCollected ? { scale: 1.1 } : {}}
                    whileTap={isCollected ? { scale: 0.95 } : {}}
                    onClick={() => isCollected && handleItemClick({
                      id: junk.id,
                      name: junk.name,
                      emoji: junk.emoji,
                      type: 'junk'
                    })}
                    className={`flex flex-col items-center justify-center 
                               rounded-xl shadow-lg p-2 ${
                                 isCollected
                                   ? 'bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer'
                                   : 'bg-gray-200 opacity-50'
                               }`}
                  >
                    <span className="text-5xl md:text-6xl">
                      {isCollected ? junk.emoji : '❓'}
                    </span>
                    <span className="text-sm mt-1 text-gray-600 font-medium text-center">
                      {isCollected ? junk.name : '???'}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 bg-white/50 rounded-2xl text-center"
      >
        <p className="text-lg text-primary-600">
          Печалби: {progress.challengeWins} | Загуби: {progress.challengeLosses}
        </p>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={handleClose}
              className={`rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full cursor-pointer ${
                selectedItem.type === 'reward'
                  ? 'bg-gradient-to-br from-white to-primary-100'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-9xl"
              >
                {selectedItem.emoji}
              </motion.div>
              <h2 className={`text-3xl font-bold ${
                selectedItem.type === 'reward' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                {selectedItem.name}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
