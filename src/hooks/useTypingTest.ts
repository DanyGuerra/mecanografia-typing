import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAudio } from '@/hooks/useAudio';
import { charToKeyCode } from '@/utils/keyboardMap';
import { useAccentColor } from '@/hooks/useAccentColor';

export function useTypingTest(locale: string, defaultPhraseText: string = '') {
  const router = useRouter();
  const appLanguage: 'es' | 'en' = locale === 'en' ? 'en' : 'es';

  const [keyboardLanguage, setKeyboardLanguage] = useState<'es' | 'en'>(appLanguage);
  const [customPhrase, setCustomPhraseState] = useState<string>(defaultPhraseText);
  const [userInput, setUserInput] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [hasSuccess, setHasSuccess] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [osMode, setOsMode] = useState<'mac' | 'windows'>('mac');
  const [isEditingText, setIsEditingText] = useState(false);

  const keystrokesCount = useRef(0);
  const correctKeystrokesCount = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [prevDefaultPhrase, setPrevDefaultPhrase] = useState(defaultPhraseText);
  if (defaultPhraseText !== prevDefaultPhrase) {
    setPrevDefaultPhrase(defaultPhraseText);
    if (!customPhrase) {
      setCustomPhraseState(defaultPhraseText);
    }
  }

  const userInputRef = useRef(userInput);
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  const currentPhrase = customPhrase || defaultPhraseText;
  const currentPhraseRef = useRef(currentPhrase);
  useEffect(() => {
    currentPhraseRef.current = currentPhrase;
  }, [currentPhrase]);

  const { playClick } = useAudio();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme as 'light' | 'dark') || (theme as 'light' | 'dark') || 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const { accentColor, setAccentColor } = useAccentColor(currentTheme === 'dark');

  const handleReset = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setHasError(false);
    setErrorKey(0);
    keystrokesCount.current = 0;
    correctKeystrokesCount.current = 0;
    setCustomPhraseState('');
    setIsEditingText(false);
  }, []);

  const handleRestartWithCustomText = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setHasError(false);
    setErrorKey(0);
    keystrokesCount.current = 0;
    correctKeystrokesCount.current = 0;
    setIsEditingText(true);
  }, []);

  const setCustomPhrase = useCallback((text: string) => {
    const cleanText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
    if (cleanText.length > 0) {
      setUserInput('');
      setStartTime(null);
      setElapsedTime(0);
      setWpm(0);
      setAccuracy(100);
      setIsCompleted(false);
      setHasError(false);
      setErrorKey(0);
      keystrokesCount.current = 0;
      correctKeystrokesCount.current = 0;
      setCustomPhraseState(cleanText);
      setIsEditingText(false);
    }
  }, []);

  const handleAppLanguageChange = (lang: 'es' | 'en') => {
    handleReset();
    setCustomPhraseState('');
    setIsEditingText(false);
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

  // Timer & WPM calculation (Interval runs smoothly without being reset on every keypress)
  useEffect(() => {
    if (startTime && !isCompleted) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedMs = now - startTime;
        const elapsedSecs = Math.max(1, Math.floor(elapsedMs / 1000));
        setElapsedTime(elapsedSecs);

        const timeDiffMinutes = elapsedMs / 60000;
        if (timeDiffMinutes > 0) {
          const input = userInputRef.current;
          const phrase = currentPhraseRef.current;
          let correctChars = 0;
          for (let i = 0; i < input.length; i++) {
            if (input[i] === phrase[i]) {
              correctChars++;
            }
          }
          const calculatedWpm = Math.round((correctChars / 5) / timeDiffMinutes);
          setWpm(calculatedWpm);
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [startTime, isCompleted]);

  const handleKeyPress = useCallback((key: string, code: string) => {
    if (isEditingText || !currentPhrase || currentPhrase.length === 0 || userInput.length === currentPhrase.length) return;

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
      } else if (code === 'Enter') {
        playClick('space');
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

    let typedChar = key;
    if (code === 'Enter' || key === 'Enter') {
      typedChar = '\n';
    }

    if (typedChar.length === 1 || typedChar === '\n') {
      keystrokesCount.current += 1;
      const expectedChar = currentPhrase[userInput.length];

      if (userInput.length < currentPhrase.length) {
        const isCorrect = typedChar === expectedChar;
        if (isCorrect) {
          correctKeystrokesCount.current += 1;
          setHasError(false);
          setHasSuccess(true);
          if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
          successTimeoutRef.current = setTimeout(() => setHasSuccess(false), 120);
        } else {
          setHasError(true);
          setHasSuccess(false);
          setErrorKey((prev) => prev + 1);
          if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
          errorTimeoutRef.current = setTimeout(() => setHasError(false), 250);
        }
        nextUserInput = userInput + typedChar;
        setUserInput(nextUserInput);
      }
    }

    if (keystrokesCount.current > 0) {
      setAccuracy(Math.round((correctKeystrokesCount.current / keystrokesCount.current) * 100));
    }

    if (nextUserInput.length === currentPhrase.length && nextUserInput.length > 0) {
      setIsCompleted(true);
      const finalTimeMs = Date.now() - (currentStartTime || Date.now());
      const finalSecs = Math.max(1, Math.round(finalTimeMs / 1000));
      setElapsedTime(finalSecs);
      const finalMinutes = finalTimeMs / 60000;
      if (finalMinutes > 0) {
        let correctChars = 0;
        for (let i = 0; i < nextUserInput.length; i++) {
          if (nextUserInput[i] === currentPhrase[i]) {
            correctChars++;
          }
        }
        setWpm(Math.round((correctChars / 5) / finalMinutes));
      }
    }
  }, [userInput, currentPhrase, startTime, soundEnabled, playClick, isEditingText]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));
      setCapsLockActive(e.getModifierState('CapsLock'));

      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Backspace' || e.code === 'Tab' || e.code === 'Enter') {
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
  }, [handleKeyPress]);

  const expectedChar = currentPhrase && userInput.length < currentPhrase.length ? currentPhrase[userInput.length] : null;
  const nextKeyInfo = expectedChar ? charToKeyCode(expectedChar, keyboardLanguage) : null;

  return {
    appLanguage,
    soundEnabled,
    setSoundEnabled,
    theme: currentTheme,
    toggleTheme,
    currentPhrase,
    userInput,
    hasError,
    hasSuccess,
    errorKey,
    containerRef,
    wpm,
    accuracy,
    elapsedTime,
    isCompleted,
    keyboardLanguage,
    pressedKeys,
    capsLockActive,
    osMode,
    isEditingText,
    setIsEditingText,
    nextKeyCode: nextKeyInfo?.code || null,
    nextKeyNeedsShift: nextKeyInfo?.needsShift || false,
    handleReset,
    handleRestartWithCustomText,
    setCustomPhrase,
    customPhrase,
    handleAppLanguageChange,
    handleKeyboardLanguageChange,
    handleOsModeChange,
    accentColor,
    setAccentColor,
  };
}
