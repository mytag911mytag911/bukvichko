import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import flagsData from '../data/flags.json';
import rewards from '../data/rewards.json';
import junkItems from '../data/junkItems.json';
import {
  getProgress,
  getUnlockedFlags,
  tradeFlag,
  addReward,
  addJunk,
} from '../utils/storage';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLetterSound,
  playWordSound,
} from '../utils/audio';
import { shuffleArray, getRandomItems } from '../utils/helpers';
import type { Flag, Reward, JunkItem } from '../types';

const ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЮЯ'.split('');
const MIN_FLAGS = 4;
const SPIN_DURATION = 3.6;
const SECTOR_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#a855f7',
  '#ec4899', '#f97316', '#eab308', '#06b6d4',
];

type View = 'unlock' | 'wheel' | 'quiz';

const CONTINENT_ORDER = ['Европа', 'Азия', 'Африка', 'Америка', 'Океания'];
const CONTINENT_EMOJI: Record<string, string> = {
  Европа: '🏰',
  Азия: '🏯',
  Африка: '🦁',
  Америка: '🗽',
  Океания: '🏄',
};

const flags = flagsData as unknown as Flag[];

export default function FlagsGame() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('unlock');
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => getUnlockedFlags());
  const [notice, setNotice] = useState<string | null>(null);

  // Wheel
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const spinGuard = useRef(false);
  const pendingFlagRef = useRef<Flag | null>(null);

  // Quiz
  const [currentFlag, setCurrentFlag] = useState<Flag | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showJunk, setShowJunk] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [currentJunk, setCurrentJunk] = useState<JunkItem | null>(null);

  const progress = getProgress();
  const unlockedFlags = flags.filter(f => unlockedIds.includes(f.id));
  const canSpin = unlockedFlags.length >= MIN_FLAGS;

  const getCostDisplay = (flag: Flag) =>
    Object.entries(flag.cost)
      .map(([rewardId, count]) => {
        const reward = rewards.find(r => r.id === rewardId);
        return `${reward?.emoji ?? '?'}×${count}`;
      })
      .join(' + ');

  const showNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), 1800);
  };

  const handleUnlock = (flag: Flag) => {
    if (unlockedIds.includes(flag.id)) {
      showNotice(`${flag.emoji} ${flag.countryBG} вече е открит!`);
      return;
    }
    if (tradeFlag(flag.id)) {
      playCorrectSound();
      setUnlockedIds(getUnlockedFlags());
      showNotice(`🎉 ${flag.countryBG} е открит!`);
    } else {
      playIncorrectSound();
      showNotice('Нямаш достатъчно лакомства 😄');
    }
  };

  const handleSpin = () => {
    if (spinning || !canSpin) return;
    playClickSound();

    const n = unlockedFlags.length;
    const targetIndex = Math.floor(Math.random() * n);
    const step = 360 / n;
    const centerAngle = targetIndex * step + step / 2;
    const target = (360 - centerAngle) % 360;
    const current = rotation % 360;
    const delta = (target - current + 360) % 360;

    pendingFlagRef.current = unlockedFlags[targetIndex];
    spinGuard.current = true;
    setRotation(prev => prev + 360 * 4 + delta);
    setSpinning(true);
  };

  const handleSpinComplete = () => {
    if (!spinGuard.current) return;
    spinGuard.current = false;
    setSpinning(false);

    const flag = pendingFlagRef.current;
    if (!flag) return;

    const wrongLetters = getRandomItems(
      ALPHABET.filter(l => l !== flag.letter),
      2
    );
    setOptions(shuffleArray([flag.letter, ...wrongLetters]));
    setCurrentFlag(flag);
    setView('quiz');
    playWordSound(flag.countryBG);
  };

  const handleOptionClick = (letter: string) => {
    if (isProcessing || !currentFlag) return;
    setIsProcessing(true);
    playLetterSound(letter);

    if (letter === currentFlag.letter) {
      playCorrectSound();
      const reward = rewards[Math.floor(Math.random() * rewards.length)] as Reward;
      setCurrentReward(reward);
      addReward(reward.id);
      setShowReward(true);
    } else {
      playIncorrectSound();
      const junk = junkItems[Math.floor(Math.random() * junkItems.length)] as JunkItem;
      setCurrentJunk(junk);
      addJunk(junk.id);
      setShowJunk(true);
    }
  };

  const handlePopupClose = () => {
    setShowReward(false);
    setShowJunk(false);
    setCurrentReward(null);
    setCurrentJunk(null);
    setIsProcessing(false);
    setCurrentFlag(null);
    setView('wheel');
  };

  // Wheel geometry
  const sectorCount = unlockedFlags.length;
  const step = 360 / Math.max(sectorCount, 1);
  const wheelBackground =
    sectorCount > 0
      ? `conic-gradient(from 0deg, ${unlockedFlags
          .map((_, i) => {
            const c0 = i * step;
            const c1 = (i + 1) * step;
            return `${SECTOR_COLORS[i % SECTOR_COLORS.length]} ${c0}deg ${c1}deg`;
          })
          .join(', ')})`
      : '#e5e7eb';

  return (
    <div className="h-[100dvh] flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playClickSound();
            if (view === 'quiz') setView('wheel');
            else if (view === 'wheel') setView('unlock');
            else navigate('/');
          }}
          className="text-4xl p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          ←
        </motion.button>
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-primary-600"
        >
          {view === 'quiz' ? '❓ Коя буква?' : view === 'wheel' ? '🎡 Колелото' : '🚩 Флагове'}
        </motion.h1>
        <div className="w-16 text-lg md:text-xl font-bold text-primary-500 text-right">
          {unlockedFlags.length}/{flags.length}
        </div>
      </div>

      {view === 'unlock' && (
        <>
          <div className="flex-1 overflow-auto">
            {CONTINENT_ORDER.map(continent => {
              const group = flags.filter(f => f.continent === continent);
              if (group.length === 0) return null;
              return (
                <div key={continent} className="mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-primary-600 mb-2 px-1">
                    {CONTINENT_EMOJI[continent]} {continent}
                  </h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 p-2">
                    {group.map((flag, index) => {
                      const unlocked = unlockedIds.includes(flag.id);
                      return (
                        <motion.div
                          key={flag.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: Math.min(index * 0.05, 0.6) }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => { playClickSound(); handleUnlock(flag); }}
                          className={`relative border-2 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer shadow-md ${
                            unlocked
                              ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
                              : 'bg-gradient-to-br from-white to-primary-100 border-primary-200'
                          }`}
                        >
                          {unlocked && (
                            <span className="absolute top-1 right-2 text-sm">✅</span>
                          )}
                          <div className={`text-5xl md:text-6xl ${unlocked ? '' : 'grayscale opacity-40'}`}>
                            {flag.emoji}
                          </div>
                          <span className="text-sm md:text-base font-bold text-gray-700 text-center">
                            {flag.countryBG}
                          </span>
                          <span className="text-xs md:text-sm text-gray-600">
                            {unlocked ? 'Открит!' : getCostDisplay(flag)}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 p-3 bg-white/50 rounded-2xl text-center"
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

          <div className="mt-3 flex flex-col items-center gap-2">
            {canSpin ? (
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playClickSound(); setView('wheel'); }}
                className="game-button bg-gradient-to-r from-fun-purple to-fun-pink text-shadow"
              >
                🎡 Върти колелото!
              </motion.button>
            ) : (
              <p className="text-sm md:text-base font-bold text-primary-500 text-center px-2">
                Открий още флагове — трябват ти поне {MIN_FLAGS} 🚩
              </p>
            )}
          </div>
        </>
      )}

      {view === 'wheel' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 overflow-hidden">
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-4xl md:text-5xl drop-shadow-lg">
              🔻
            </div>
            <motion.div
              initial={false}
              animate={{ rotate: rotation }}
              transition={{ duration: SPIN_DURATION, ease: [0.12, 0.75, 0.2, 1] }}
              onAnimationComplete={handleSpinComplete}
              className="relative w-64 h-64 md:w-[24rem] md:h-[24rem] rounded-full shadow-2xl border-[10px] border-white"
              style={{ background: wheelBackground }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-primary-300 pointer-events-none" />
              {unlockedFlags.map((flag, i) => {
                const center = i * step + step / 2;
                return (
                  <div
                    key={flag.id}
                    className="absolute left-1/2 top-1/2 text-3xl md:text-4xl select-none"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${center}deg) translateY(-34%) rotate(${-center}deg)`,
                    }}
                  >
                    {flag.emoji}
                  </div>
                );
              })}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl md:text-3xl z-10">
                ⭐
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={spinning ? {} : { scale: 1.05 }}
            whileTap={spinning ? {} : { scale: 0.95 }}
            onClick={handleSpin}
            className={`game-button text-shadow ${
              spinning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-fun-purple to-fun-pink'
            }`}
          >
            {spinning ? '⏳ Върти се…' : '🎡 Върти!'}
          </motion.button>

          {!canSpin && (
            <p className="text-sm md:text-base font-bold text-primary-500 text-center px-2">
              Открий още флагове — трябват ти поне {MIN_FLAGS} 🚩
            </p>
          )}
        </div>
      )}

      {view === 'quiz' && currentFlag && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlag.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="illustration-card flex-col gap-2"
            >
              <span className="text-8xl md:text-9xl">{currentFlag.emoji}</span>
              <span className="text-2xl md:text-3xl font-bold text-primary-600">
                {currentFlag.countryBG}
              </span>
            </motion.div>
          </AnimatePresence>

          <p className="text-xl md:text-2xl font-bold text-primary-500">
            С коя буква започва?
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {options.map((letter, index) => (
              <motion.button
                key={`${currentFlag.id}-${letter}-${index}`}
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
      )}

      {/* Notice toast (unlock feedback) */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white/95 text-primary-600 text-2xl md:text-3xl font-bold px-8 py-4 rounded-full shadow-2xl">
              {notice}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward / junk popup (ChallengeMode pattern) */}
      <AnimatePresence>
        {(showReward || showJunk) && currentFlag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handlePopupClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
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
                {currentFlag.countryBG} → <span className="font-bold">{currentFlag.letter}</span>
              </p>
              <p className="text-lg text-primary-400">
                {showReward ? currentReward?.name : currentJunk?.name}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePopupClose}
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
