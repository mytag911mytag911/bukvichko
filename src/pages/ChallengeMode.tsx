import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import words from '../data/words.json';
import rewards from '../data/rewards.json';
import junkItems from '../data/junkItems.json';
import { addReward, addJunk } from '../utils/storage';
import { playLetterSound, playCorrectSound, playIncorrectSound } from '../utils/audio';
import { shuffleArray, getRandomItems } from '../utils/helpers';
import type { Word, Reward, JunkItem } from '../types';

const ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЮЯ'.split('');

export default function ChallengeMode() {
  const navigate = useNavigate();
  const { wordCount } = useParams<{ wordCount: string }>();
  const totalWords = parseInt(wordCount || '5', 10);

  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showJunk, setShowJunk] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [currentJunk, setCurrentJunk] = useState<JunkItem | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const shuffled = shuffleArray(words).slice(0, totalWords);
    setGameWords(shuffled);
  }, [totalWords]);

  useEffect(() => {
    if (gameWords.length > 0 && currentIndex < gameWords.length) {
      const current = gameWords[currentIndex];
      const wrongLetters = getRandomItems(
        ALPHABET.filter(l => l !== current.letter),
        2
      );
      setOptions(shuffleArray([current.letter, ...wrongLetters]));
    }
  }, [currentIndex, gameWords]);

  const handleOptionClick = useCallback((letter: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const current = gameWords[currentIndex];
    playLetterSound(letter);

    if (letter === current.letter) {
      playCorrectSound();
      const reward = rewards[Math.floor(Math.random() * rewards.length)] as Reward;
      setCurrentReward(reward);
      addReward(reward.id);
      setScore(prev => prev + 1);
      setShowReward(true);
    } else {
      playIncorrectSound();
      const junk = junkItems[Math.floor(Math.random() * junkItems.length)];
      setCurrentJunk(junk);
      addJunk(junk.id);
      setShowJunk(true);
    }
  }, [currentIndex, gameWords, isProcessing]);

  const handleNext = useCallback(() => {
    setShowReward(false);
    setShowJunk(false);
    setCurrentReward(null);
    setCurrentJunk(null);
    setIsProcessing(false);

    if (currentIndex + 1 >= totalWords) {
      setGameOver(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalWords]);

  if (gameWords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-primary-600 mb-4">
            Край!
          </h1>
          <p className="text-3xl text-primary-500">
            {score} от {totalWords}
          </p>
          <div className="text-8xl mt-4">
            {score === totalWords ? '🏆' : score >= totalWords / 2 ? '⭐' : '💪'}
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="game-button bg-gradient-to-r from-fun-blue to-fun-cyan"
          >
            🏠 Начало
          </motion.button>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/challenge')}
            className="game-button bg-gradient-to-r from-fun-orange to-fun-red"
          >
            🔄 Отново
          </motion.button>
        </div>
      </div>
    );
  }

  const currentWord = gameWords[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4">
      <div className="w-full flex justify-between items-center">
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="text-4xl p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          ←
        </motion.button>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-primary-600"
        >
          {currentIndex + 1} / {totalWords}
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-fun-green"
        >
          ⭐ {score}
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="illustration-card"
          >
            <span className="text-shadow-lg">{currentWord.emoji}</span>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 justify-center flex-wrap">
          {options.map((letter, index) => (
            <motion.button
              key={`${currentWord.id}-${letter}-${index}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => playLetterSound(letter)}
              onClick={() => handleOptionClick(letter)}
              className="letter-card bg-gradient-to-br from-white to-primary-100 
                         text-primary-600 hover:from-primary-100 hover:to-primary-200"
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(showReward || showJunk) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleNext}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-8xl"
              >
                {showReward ? currentReward?.emoji : currentJunk?.emoji}
              </motion.div>
              <p className="text-2xl font-bold text-primary-600">
                {showReward ? 'Браво! 🎉' : 'Опитай отново! 😄'}
              </p>
              <p className="text-xl text-primary-500">
                {showReward ? currentReward?.name : currentJunk?.name}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="game-button bg-gradient-to-r from-fun-green to-fun-cyan mt-4"
              >
                Добре ✓
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
