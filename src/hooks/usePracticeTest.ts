'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { useAccentColor } from '@/hooks/useAccentColor';
import { useTheme } from 'next-themes';
import { charToKeyCode } from '@/utils/keyboardMap';
import { useStoredKeyboardLanguage } from '@/utils/languageStorage';

export type PracticeCategory = 'homeRow' | 'topRow' | 'bottomRow' | 'commonWords' | 'numbers' | 'symbols' | 'custom';

export const PRACTICE_EXERCISES: Record<
  'es' | 'en',
  Record<Exclude<PracticeCategory, 'custom'>, string[]>
> = {
  es: {
    homeRow: [
      'asdf jklñ fdsa jklñ asdf jklñ fdsa jklñ',
      'asdfg hjklñ gfdsa ñlkjh asdfg hjklñ',
      'la las sal ala faja falla jala gala fada',
    ],
    topRow: [
      'qwer uiop rewq poiu qwer uiop rewq poiu',
      'qwert yuiop trewq poiuy qwert yuiop',
      'pero que por ti quiero otro puerto quieto',
    ],
    bottomRow: [
      'zxcv bnm, vcxz ,mnb zxcv bnm, vcxz ,mnb',
      'zxcvb nzm, cnbmv cxzb zxcvb mnbvc',
    ],
    commonWords: [
      'el la los las un una con por para sin sobre como cuando donde mas pero si ya todo este nada',
      'tiempo dia vida mano parte ojo cosa mundo casa pais trabajo camino caso noche agua',
    ],
    numbers: [
      '123 456 789 012 345 678 901 234 567 890',
      '102 394 587 601 482 739 501 284 395 720',
    ],
    symbols: [
      '!? @#$% &*() _+-= []{} <>:; .,\'"',
      '(hola) [mundo] {codigo} <texto> "comillas" \'simple\' ¡atencion! ¿pregunta?',
    ],
  },
  en: {
    homeRow: [
      'asdf jkl; fdsa jkl; asdf jkl; fdsa jkl;',
      'asdfg hjkl; gfdsa ;lkjh asdfg hjkl;',
      'all fall glad flask salad flag flash hall dash',
    ],
    topRow: [
      'qwer uiop rewq poiu qwer uiop rewq poiu',
      'qwert yuiop trewq poiuy qwert yuiop',
      'write power tower quiet route prior quote report',
    ],
    bottomRow: [
      'zxcv bnm, vcxz ,mnb zxcv bnm, vcxz ,mnb',
      'zxcvb nm,./ bvcxz /.,mn zxcvb nm,./',
    ],
    commonWords: [
      'the be to of and a in that have it for not on with as you do at this but by from give get make',
      'time person year way day thing man world life hand part child eye woman place week case',
    ],
    numbers: [
      '123 456 789 012 345 678 901 234 567 890',
      '102 394 587 601 482 739 501 284 395 720',
    ],
    symbols: [
      '!? @#$% &*() _+-= []{} <>:; .,\'" `~',
      '(hello) [world] {code} <text> "quotes" \'single\' ?question! :colon;',
    ],
  },
};

function getInitialOsMode(): 'mac' | 'windows' {
  if (typeof window !== 'undefined' && window.navigator) {
    const platform = window.navigator.platform?.toLowerCase() || '';
    const userAgent = window.navigator.userAgent?.toLowerCase() || '';
    if (platform.includes('win') || userAgent.includes('windows')) {
      return 'windows';
    }
  }
  return 'mac';
}

export function usePracticeTest(locale: string) {
  const language = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const [category, setCategory] = useState<PracticeCategory>('homeRow');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [osMode, setOsMode] = useState<'mac' | 'windows'>(getInitialOsMode);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Keyboard language is independent from app language and persisted
  const [keyboardLanguage, setStoredKeyboardLang] = useStoredKeyboardLanguage(language);

  const { playClick } = useAudio();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme as 'light' | 'dark') || (theme as 'light' | 'dark') || 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const { accentColor, setAccentColor } = useAccentColor(currentTheme === 'dark');

  // Exercise adapts depending on keyboardLanguage (not full app language)
  const currentPhrase = useMemo(() => {
    if (category === 'custom') {
      return customText || PRACTICE_EXERCISES[keyboardLanguage].homeRow[0];
    }
    const exercises = PRACTICE_EXERCISES[keyboardLanguage]?.[category] || PRACTICE_EXERCISES[keyboardLanguage]?.homeRow;
    return exercises[exerciseIndex % exercises.length];
  }, [category, customText, keyboardLanguage, exerciseIndex]);

  const targetChar = userInput.length < currentPhrase.length ? currentPhrase[userInput.length] : null;

  const targetKeyMap = useMemo(() => {
    if (!targetChar) return null;
    return charToKeyCode(targetChar, keyboardLanguage);
  }, [targetChar, keyboardLanguage]);

  const resetPractice = useCallback(() => {
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, []);

  const handleKeyboardLanguageChange = useCallback((lang: 'es' | 'en') => {
    setStoredKeyboardLang(lang);
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
    setExerciseIndex(0);
  }, [setStoredKeyboardLang]);

  // Change category
  const selectCategory = useCallback((cat: PracticeCategory) => {
    setCategory(cat);
    setExerciseIndex(0);
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, []);

  // Advance to next exercise in category
  const nextExercise = useCallback(() => {
    if (category === 'custom') return;
    const exercises = PRACTICE_EXERCISES[keyboardLanguage]?.[category] || PRACTICE_EXERCISES[keyboardLanguage]?.homeRow;
    setExerciseIndex((prev) => (prev + 1) % exercises.length);
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, [category, keyboardLanguage]);

  const totalExercises = useMemo(() => {
    if (category === 'custom') return 1;
    const exercises = PRACTICE_EXERCISES[keyboardLanguage]?.[category] || PRACTICE_EXERCISES[keyboardLanguage]?.homeRow;
    return exercises.length;
  }, [category, keyboardLanguage]);

  // Apply custom text
  const applyCustomText = useCallback((text: string) => {
    setCustomText(text);
    setCategory('custom');
    setExerciseIndex(0);
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, []);

  const handleKeyPress = useCallback((key: string, code: string) => {
    // Ignore modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(key)) {
      return;
    }

    if (code === 'CapsLock' || key === 'CapsLock') {
      setCapsLockActive((prev) => !prev);
      return;
    }

    // Handle Backspace
    if (code === 'Backspace' || key === 'Backspace') {
      if (soundEnabled) playClick('backspace');
      setHasError(false);
      setUserInput((prev) => prev.slice(0, -1));
      setIsCompleted(false);
      return;
    }

    // If already completed, ignore character input
    if (isCompleted || userInput.length >= currentPhrase.length) return;

    const expectedChar = currentPhrase[userInput.length];
    let typedChar = key;
    if (code === 'Enter' || key === 'Enter') {
      typedChar = '\n';
    } else if (code === 'Space' || key === ' ') {
      typedChar = ' ';
    }

    if (typedChar === expectedChar) {
      // Correct key pressed!
      if (soundEnabled) playClick(typedChar === ' ' ? 'space' : 'standard');
      setHasError(false);
      const nextInput = userInput + typedChar;
      setUserInput(nextInput);

      if (nextInput.length === currentPhrase.length) {
        setIsCompleted(true);
      }
    } else {
      // Incorrect key pressed!
      if (soundEnabled) playClick('standard');
      setHasError(true);
    }
  }, [currentPhrase, isCompleted, playClick, soundEnabled, userInput]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));
      setCapsLockActive(e.getModifierState('CapsLock'));

      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
        activeElement.getAttribute('data-mobile-typing-input') !== 'true'
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Prevent default scrolling for Space/Backspace
      if (e.key === ' ' || e.key === 'Backspace') {
        e.preventDefault();
      }

      handleKeyPress(e.key, e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = { ...prev };
        delete next[e.code];
        return next;
      });
      setCapsLockActive(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress]);

  return {
    language,
    category,
    exerciseIndex,
    totalExercises,
    selectCategory,
    nextExercise,
    customText,
    applyCustomText,
    currentPhrase,
    userInput,
    hasError,
    isCompleted,
    targetChar,
    targetKeyCode: targetKeyMap?.code ?? null,
    targetNeedsShift: targetKeyMap?.needsShift ?? false,
    pressedKeys,
    capsLockActive,
    osMode,
    setOsMode,
    soundEnabled,
    setSoundEnabled,
    resetPractice,
    handleKeyPress,
    keyboardLanguage,
    setKeyboardLanguage: handleKeyboardLanguageChange,
    handleKeyboardLanguageChange,
    theme: currentTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
  };
}
