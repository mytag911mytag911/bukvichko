import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { playLetterSound, playCorrectSound } from '../utils/audio';
import { shuffleArray } from '../utils/helpers';

const BULGARIAN_LETTERS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШ'.split('');

interface Card {
  id: number;
  letter: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createDeck(): Card[] {
  const selectedLetters = shuffleArray([...BULGARIAN_LETTERS]).slice(0, 8);
  const pairs = [...selectedLetters, ...selectedLetters];
  const shuffledPairs = shuffleArray(pairs);
  
  return shuffledPairs.map((letter, index) => ({
    id: index,
    letter,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    setCards(createDeck());
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = useCallback((id: number) => {
    if (isProcessing) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    playLetterSound(card.letter);

    const newCards = cards.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard?.letter === secondCard?.letter) {
        playCorrectSound();
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isProcessing]);

  const handleRestart = useCallback(() => {
    setCards(createDeck());
    setFlippedCards([]);
    setMoves(0);
    setIsProcessing(false);
    setGameWon(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center mb-6">
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
          Ходове: {moves}
        </motion.div>

        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRestart}
          className="text-4xl p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          🔄
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg w-full">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ 
              scale: 1, 
              rotateY: card.isFlipped || card.isMatched ? 0 : 180 
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
            whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center text-4xl md:text-5xl font-bold shadow-lg ${
              card.isMatched 
                ? 'bg-gradient-to-br from-fun-green to-fun-cyan text-white' 
                : card.isFlipped 
                  ? 'bg-gradient-to-br from-fun-yellow to-fun-orange text-primary-700' 
                  : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
            }`}
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {card.isFlipped || card.isMatched ? card.letter : '?'}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-8xl"
              >
                🏆
              </motion.div>
              <h2 className="text-3xl font-bold text-primary-600">
                Браво! 🎉
              </h2>
              <p className="text-xl text-primary-500">
                Намери всички двойки за {moves} хода!
              </p>
              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className="game-button bg-gradient-to-r from-fun-green to-fun-cyan"
                >
                  🔄 Отново
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="game-button bg-gradient-to-r from-fun-blue to-fun-cyan"
                >
                  🏠 Начало
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
