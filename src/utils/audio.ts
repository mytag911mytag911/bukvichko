const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

const letterSounds: Record<string, { default: string }> = import.meta.glob('../data/sounds/*.mp3', { eager: true });

function getLetterSoundUrl(letter: string): string | null {
  const key = `../data/sounds/${letter}.mp3`;
  if (letterSounds[key]) return letterSounds[key].default;
  const lowerKey = `../data/sounds/${letter.toLowerCase()}.mp3`;
  return letterSounds[lowerKey]?.default ?? null;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export function playLetterSound(letter: string): void {
  const url = getLetterSoundUrl(letter);
  if (url) {
    const audio = new Audio(url);
    audio.play().catch(() => {});
    return;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = 'bg-BG';
    utterance.rate = 0.7;
    utterance.pitch = 1.3;
    window.speechSynthesis.speak(utterance);
  }
}

export function playWordSound(word: string): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'bg-BG';
    utterance.rate = 0.7;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}

export function playCorrectSound(): void {
  playTone(523.25, 0.15);
  setTimeout(() => playTone(659.25, 0.15), 100);
  setTimeout(() => playTone(783.99, 0.2), 200);
}

export function playIncorrectSound(): void {
  playTone(200, 0.3, 'sawtooth');
}

export function playClickSound(): void {
  playTone(800, 0.1);
}

export function stopAllSounds(): void {
  window.speechSynthesis?.cancel();
}
