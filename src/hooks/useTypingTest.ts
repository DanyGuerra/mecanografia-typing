import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAudio } from '@/hooks/useAudio';
import { PHRASES } from '@/lib/phrases';

export function useTypingTest(locale: string) {
  const router = useRouter();
  const appLanguage: 'es' | 'en' = locale === 'en' ? 'en' : 'es';

  const [keyboardLanguage, setKeyboardLanguage] = useState<'es' | 'en'>(appLanguage);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [osMode, setOsMode] = useState<'mac' | 'windows'>('mac');

  const keystrokesCount = useRef(0);
  const correctKeystrokesCount = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { playClick } = useAudio();
  const currentPhrase = PHRASES[appLanguage][phraseIndex];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme as 'light' | 'dark') || (theme as 'light' | 'dark') || 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleReset = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setHasError(false);
    keystrokesCount.current = 0;
    correctKeystrokesCount.current = 0;
  }, []);

  const changePhrase = useCallback((direction: 'next' | 'random') => {
    handleReset();
    if (direction === 'next') {
      setPhraseIndex((prev) => (prev + 1) % PHRASES[appLanguage].length);
    } else {
      const randomIndex = Math.floor(Math.random() * PHRASES[appLanguage].length);
      setPhraseIndex(randomIndex);
    }
  }, [appLanguage, handleReset]);

  const handleAppLanguageChange = (lang: 'es' | 'en') => {
    handleReset();
    setPhraseIndex(0);
    router.push(`/${lang}`);
  };

  const handleKeyboardLanguageChange = (lang: 'es' | 'en') => {
    setKeyboardLanguage(lang);
    localStorage.setItem('keyboardLanguage', lang);
  };

  const handleOsModeChange = (mode: 'mac' | 'windows') => {
    setOsMode(mode);
    localStorage.setItem('osMode', mode);
  };

  // Timer & WPM calculation
  useEffect(() => {
    if (startTime && !isCompleted) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedSecs = Math.round((now - startTime) / 1000);
        setElapsedTime(elapsedSecs);

        const timeDiffMinutes = (now - startTime) / 60000;
        if (timeDiffMinutes > 0) {
          let correctChars = 0;
          for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentPhrase[i]) {
              correctChars++;
            }
          }
          setWpm(Math.round((correctChars / 5) / timeDiffMinutes));
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [startTime, isCompleted, userInput, currentPhrase]);

  const handleKeyPress = useCallback((key: string, code: string) => {
    if (userInput.length === currentPhrase.length) return;

    let currentStartTime = startTime;
    if (!startTime) {
      currentStartTime = Date.now();
      setStartTime(currentStartTime);
    }

    if (soundEnabled) {
      if (code === 'Space') {
        playClick('space');
      } else if (code === 'Backspace') {
        playClick('backspace');
      } else {
        playClick('standard');
      }
    }

    let nextUserInput = userInput;
    if (code === 'Backspace') {
      if (userInput.length > 0) {
        nextUserInput = userInput.slice(0, -1);
        setUserInput(nextUserInput);
        setHasError(false);
      }
      return;
    }

    if (key.length === 1) {
      keystrokesCount.current += 1;
      const expectedChar = currentPhrase[userInput.length];

      if (userInput.length < currentPhrase.length) {
        const isCorrect = key === expectedChar;
        if (isCorrect) {
          correctKeystrokesCount.current += 1;
          setHasError(false);
        } else {
          setHasError(true);
          if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
          errorTimeoutRef.current = setTimeout(() => setHasError(false), 200);
        }
        nextUserInput = userInput + key;
        setUserInput(nextUserInput);
      }
    }

    if (currentStartTime) {
      const now = Date.now();
      const elapsedSecs = Math.round((now - currentStartTime) / 1000);
      setElapsedTime(elapsedSecs);

      const timeDiffMinutes = (now - currentStartTime) / 60000;
      if (timeDiffMinutes > 0) {
        let correctChars = 0;
        for (let i = 0; i < nextUserInput.length; i++) {
          if (nextUserInput[i] === currentPhrase[i]) {
            correctChars++;
          }
        }
        setWpm(Math.round((correctChars / 5) / timeDiffMinutes));
      }
    }

    if (keystrokesCount.current > 0) {
      setAccuracy(Math.round((correctKeystrokesCount.current / keystrokesCount.current) * 100));
    }

    if (nextUserInput.length === currentPhrase.length && nextUserInput.length > 0) {
      setIsCompleted(true);
    }
  }, [userInput, currentPhrase, startTime, soundEnabled, playClick]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));
      setCapsLockActive(e.getModifierState('CapsLock'));

      if (!isFocused) return;

      if (e.code === 'Space' || e.code === 'Backspace' || e.code === 'Tab') {
        e.preventDefault();
      }

      handleKeyPress(e.key, e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: false }));
      setCapsLockActive(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [isFocused, handleKeyPress]);

  const forceFocus = () => {
    setIsFocused(true);
  };

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    appLanguage,
    soundEnabled,
    setSoundEnabled,
    theme: currentTheme,
    toggleTheme,
    currentPhrase,
    userInput,
    hasError,
    isFocused,
    containerRef,
    wpm,
    accuracy,
    elapsedTime,
    isCompleted,
    keyboardLanguage,
    pressedKeys,
    capsLockActive,
    osMode,
    handleReset,
    changePhrase,
    handleAppLanguageChange,
    handleKeyboardLanguageChange,
    handleOsModeChange,
    forceFocus,
  };
}
