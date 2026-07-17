import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSettings, saveSettings, resetProgress, getProgress } from '../utils/storage';
import type { GameSettings } from '../types';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GameSettings>(getSettings());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const progress = getProgress();

  const handleToggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleMusic = () => {
    const newSettings = { ...settings, musicEnabled: !settings.musicEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-8">
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
          ⚙️ Настройки
        </motion.h1>

        <div className="w-12"></div>
      </div>

      <div className="flex-1 flex flex-col gap-6 max-w-md mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-primary-600 mb-4">🎵 Звук</h2>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-700">Звукови ефекти</span>
            <button
              onClick={handleToggleSound}
              className={`w-16 h-8 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-fun-green' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: settings.soundEnabled ? 32 : 0 }}
                className="w-8 h-8 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-700">Музика</span>
            <button
              onClick={handleToggleMusic}
              className={`w-16 h-8 rounded-full transition-colors ${
                settings.musicEnabled ? 'bg-fun-green' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: settings.musicEnabled ? 32 : 0 }}
                className="w-8 h-8 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-primary-600 mb-4">📊 Статистика</h2>
          
          <div className="space-y-2 text-lg text-gray-700">
            <p>Научени букви: {progress.learnedLetters.length}</p>
            <p>Победи: {progress.challengeWins}</p>
            <p>Загуби: {progress.challengeLosses}</p>
            <p>Награди: {progress.collectedRewards.length}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-primary-600 mb-4">⚠️ Опасна зона</h2>
          
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-fun-red to-fun-orange text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            🗑️ Изтрий прогреса
          </button>
        </motion.div>
      </div>

      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full"
          >
            <h3 className="text-2xl font-bold text-primary-600 mb-4 text-center">
              ⚠️ Сигурен ли си?
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Всички награди, научени букви и прогрес ще бъдат изтрити!
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-fun-red to-fun-orange text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Да, изтрий!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
