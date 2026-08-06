'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { useAccentColor } from '@/hooks/useAccentColor';
import { useTheme } from 'next-themes';
import { charToKeyCode } from '@/utils/keyboardMap';

export type PracticeCategory = 'homeRow' | 'topRow' | 'bottomRow' | 'commonWords' | 'numbers' | 'symbols' | 'custom';

export const PRACTICE_EXERCISES: Record<'es' | 'en', Record<Exclude<PracticeCategory, 'custom'>, string>> = {
  es: {
    homeRow: 'asdf jklñ fdsa jklñ asdf jklñ fdsa jklñ',
    topRow: 'qwer uiop rewq poiu qwer uiop rewq poiu',
    bottomRow: 'zxcv bnm, vcxz ,mnb zxcv bnm, vcxz ,mnb',
    commonWords: 'el la los las un una con por para sin sobre como cuando donde mas pero si ya todo este nada',
    numbers: '123 456 789 012 345 678 901 234 567 890',
    symbols: '!? @#$% &*() _+-= []{} <>:; .,\'"',
  },
  en: {
    homeRow: 'asdf jkl; fdsa jkl; asdf jkl; fdsa jkl;',
    topRow: 'qwer uiop rewq poiu qwer uiop rewq poiu',
    bottomRow: 'zxcv bnm, vcxz ,mnb zxcv bnm, vcxz ,mnb',
    commonWords: 'the be to of and a in that have it for not on with as you do at this but by from give get make',
    numbers: '123 456 789 012 345 678 901 234 567 890',
    symbols: '!? @#$% &*() _+-= []{} <>:; .,\'" `~',
  },
};

function getInitialOsMode(): 'mac' | 'windows' {
  if (typeof window !== 'undefined' && window.navigator) {
    const platform = window.navigator.platform.toLowerCase();
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (platform.includes('win') || userAgent.includes('windows')) {
      return 'windows';
    }
  }
  return 'mac';
}

export function usePracticeTest(locale: string) {
  const language = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const [category, setCategory] = useState<PracticeCategory>('homeRow');
  const [customText, setCustomText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [osMode, setOsMode] = useState<'mac' | 'windows'>(getInitialOsMode);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { playClick } = useAudio();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme as 'light' | 'dark') || (theme as 'light' | 'dark') || 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const { accentColor, setAccentColor } = useAccentColor(currentTheme === 'dark');

  const currentPhrase = useMemo(() => {
    if (category === 'custom') {
      return customText || PRACTICE_EXERCISES[language].homeRow;
    }
    return PRACTICE_EXERCISES[language][category] || PRACTICE_EXERCISES[language].homeRow;
  }, [category, customText, language]);

  const targetChar = userInput.length < currentPhrase.length ? currentPhrase[userInput.length] : null;

  const [keyboardLanguage, setKeyboardLanguage] = useState<'es' | 'en'>(language);

  const targetKeyMap = useMemo(() => {
    if (!targetChar) return null;
    return charToKeyCode(targetChar, keyboardLanguage);
  }, [targetChar, keyboardLanguage]);

  const resetPractice = useCallback(() => {
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, []);

  // Change category
  const selectCategory = useCallback((cat: PracticeCategory) => {
    setCategory(cat);
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, []);

  // Apply custom text
  const applyCustomText = useCallback((text: string) => {
    setCustomText(text);
    setCategory('custom');
    setUserInput('');
    setHasError(false);
    setIsCompleted(false);
  }, []);

  // Keyboard Event Handlers
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

      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (soundEnabled) playClick('backspace');
        setHasError(false);
        setUserInput((prev) => prev.slice(0, -1));
        setIsCompleted(false);
        return;
      }

      // Prevent default scrolling for Space
      if (e.key === ' ') {
        e.preventDefault();
      }

      // If already completed, ignore character input
      if (isCompleted || userInput.length >= currentPhrase.length) return;

      const expectedChar = currentPhrase[userInput.length];
      const typedChar = e.key;

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
  }, [userInput, currentPhrase, isCompleted, soundEnabled, playClick]);

  return {
    language,
    category,
    selectCategory,
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
    keyboardLanguage,
    setKeyboardLanguage,
    theme: currentTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
  };
}
