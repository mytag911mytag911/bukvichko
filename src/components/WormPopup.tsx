import { motion } from 'framer-motion';
import { playClickSound } from '../utils/audio';

interface EatenItem {
  id: string;
  name: string;
  emoji: string;
  count: number;
}

interface WormPopupProps {
  eatenItems: EatenItem[];
  onClose: () => void;
}

export default function WormPopup({ eatenItems, onClose }: WormPopupProps) {
  const totalEaten = eatenItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={() => { playClickSound(); onClose(); }}
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 100 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-green-200 to-green-400 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-8xl"
        >
          🐍
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-bold text-green-800 text-center">
          Змията е гладна!
        </h2>

        <div className="flex flex-wrap gap-2 justify-center">
          {eatenItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/70 rounded-full px-3 py-1 flex items-center gap-1"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-bold text-green-700">×{item.count}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-green-700 font-medium text-center"
        >
          Змията изяде {totalEaten} боклучета! 🎉
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playClickSound(); onClose(); }}
          className="mt-2 px-6 py-3 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg"
        >
          Разбрах! 👍
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
