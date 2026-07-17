import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProgress } from '../utils/storage';

export default function MainMenu() {
  const navigate = useNavigate();
  const progress = getProgress();

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-2 md:gap-4 overflow-hidden">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center shrink-0"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-primary-600 text-shadow-lg">
          Буквичко
        </h1>
        <p className="text-base md:text-xl text-primary-500">
          Научи буквите с игра!
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl md:text-8xl animate-float shrink-0"
      >
        📚
      </motion.div>

      <div className="flex flex-col gap-2 md:gap-3 w-full max-w-xs shrink-0">
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/learn')}
          className="game-button bg-gradient-to-r from-fun-blue to-fun-cyan text-shadow"
        >
          📖 Учене
        </motion.button>

        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/challenge')}
          className="game-button bg-gradient-to-r from-fun-orange to-fun-red text-shadow"
        >
          🏆 Предизвикателство
        </motion.button>

        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/memory')}
          className="game-button bg-gradient-to-r from-fun-yellow to-fun-orange text-shadow"
        >
          🃏 Памет
        </motion.button>

        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/collection')}
          className="game-button bg-gradient-to-r from-fun-purple to-fun-pink text-shadow"
        >
          🎁 Колекция
        </motion.button>
      </div>

      <div className="flex gap-3 shrink-0">
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/progress')}
          className="px-4 py-2 bg-white/70 rounded-full text-sm md:text-base font-bold text-primary-600 shadow-md hover:shadow-lg transition-shadow"
        >
          📊 Прогрес
        </motion.button>
        
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-white/70 rounded-full text-sm md:text-base font-bold text-primary-600 shadow-md hover:shadow-lg transition-shadow"
        >
          ⚙️ Настройки
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex gap-4 md:gap-6 text-sm md:text-lg text-primary-600 shrink-0"
      >
        <span> letters: {progress.learnedLetters.length}</span>
        <span> wins: {progress.challengeWins}</span>
        <span> rewards: {progress.collectedRewards.length}</span>
      </motion.div>
    </div>
  );
}
