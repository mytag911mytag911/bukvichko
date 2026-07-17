import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import words from '../data/words.json';
import { addLearnedLetter } from '../utils/storage';
import { playLetterSound, playWordSound } from '../utils/audio';
import { shuffleArray } from '../utils/helpers';
import type { Word } from '../types';

const shuffledWords = shuffleArray(words);

export default function LearningMode() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentWord: Word = shuffledWords[currentIndex % shuffledWords.length];

  const handleLetterClick = useCallback(() => {
    playLetterSound(currentWord.letter);
    addLearnedLetter(currentWord.letter);
    setCurrentIndex(prev => prev + 1);
  }, [currentWord.letter]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4">
      <motion.button
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBack}
        className="self-start text-4xl p-2 hover:bg-white/50 rounded-full transition-colors"
      >
        ←
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="illustration-card"
            onClick={() => playWordSound(currentWord.word)}
          >
            <span className="text-shadow-lg">{currentWord.emoji}</span>
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl md:text-3xl text-primary-700 font-semibold"
        >
          {currentWord.word}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id + '-letter'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: isHovered ? 1.3 : 1, 
              rotate: 0 
            }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`letter-card bg-gradient-to-br from-fun-yellow to-fun-orange text-white text-shadow-lg ${
              isHovered ? 'shadow-2xl' : 'shadow-xl'
            }`}
            onMouseEnter={() => {
              setIsHovered(true);
              playLetterSound(currentWord.letter);
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleLetterClick}
          >
            {currentWord.letter}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
