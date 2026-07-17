import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProgress } from '../utils/storage';
import { playLetterSound } from '../utils/audio';

const ALL_LETTERS = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ'.split('');

export default function Progress() {
  const navigate = useNavigate();
  const progress = getProgress();

  const getLetterStatus = (letter: string) => {
    if (progress.learnedLetters.includes(letter)) {
      return 'learned';
    }
    return 'unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'learned':
        return 'bg-gradient-to-br from-fun-green to-fun-cyan text-white';
      case 'seen':
        return 'bg-gradient-to-br from-fun-yellow to-fun-orange text-white';
      default:
        return 'bg-gray-200 text-gray-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'learned':
        return '✅';
      case 'seen':
        return '👀';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
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
          📊 Прогрес
        </motion.h1>

        <div className="w-12"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-6 mb-6 text-sm"
      >
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gradient-to-br from-fun-green to-fun-cyan"></span>
          <span className="text-gray-600">Научени</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-200"></span>
          <span className="text-gray-600">Ненаучени</span>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-6 md:grid-cols-9 gap-2 md:gap-3 max-w-2xl w-full"
        >
          {ALL_LETTERS.map((letter, index) => {
            const status = getLetterStatus(letter);
            const statusColor = getStatusColor(status);
            
            return (
              <motion.div
                key={letter}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + index * 0.02, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playLetterSound(letter)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center shadow-lg cursor-pointer select-none ${statusColor}`}
              >
                <span className="text-2xl md:text-3xl font-bold">{letter}</span>
                <span className="text-xs">{getStatusEmoji(status)}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-white/70 rounded-2xl text-center"
        >
          <p className="text-lg text-primary-600">
            Научени: {progress.learnedLetters.length} / {ALL_LETTERS.length} букви
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress.learnedLetters.length / ALL_LETTERS.length) * 100}%` }}
              transition={{ delay: 1, duration: 0.5 }}
              className="bg-gradient-to-r from-fun-green to-fun-cyan h-3 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
