import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const options = [
  { count: 5, emoji: '🌟', label: '5 думи' },
  { count: 10, emoji: '🌙', label: '10 думи' },
  { count: 15, emoji: '☀️', label: '15 думи' },
  { count: 20, emoji: '🌈', label: '20 думи' },
];

export default function ChallengeSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <motion.button
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/')}
        className="self-start text-4xl p-2 hover:bg-white/50 rounded-full transition-colors"
      >
        ←
      </motion.button>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-bold text-primary-600 text-shadow"
      >
        Колко думи?
      </motion.h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((option, index) => (
          <motion.button
            key={option.count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/challenge/${option.count}`)}
            className="aspect-square flex flex-col items-center justify-center gap-2 
                       bg-gradient-to-br from-white to-primary-100 
                       rounded-3xl shadow-xl hover:shadow-2xl 
                       transition-shadow text-4xl"
          >
            <span>{option.emoji}</span>
            <span className="text-xl font-bold text-primary-600">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
