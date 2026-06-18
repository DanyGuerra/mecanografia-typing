'use client';

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Keyboard from '@/components/Keyboard';
import TypingArea from '@/components/TypingArea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import CompletedOverlay from '@/components/CompletedOverlay';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';

const PHRASES = {
  es: [
    "El veloz murciélago hindú comía feliz cardo y escabeche en el gran foso del castillo medieval.",
    "Mecanografiar con fluidez requiere mantener una postura relajada y no mirar el teclado constantemente.",
    "La tecnología moderna nos permite desarrollar aplicaciones web interactivas y dinámicas en tiempo récord.",
    "Bajo el cielo estrellado de la noche, el programador escribía código sin parar para terminar su gran proyecto."
  ],
  en: [
    "The quick brown fox jumps over the lazy dog under the gentle autumn rain in the forest.",
    "Typing quickly and accurately requires consistent daily practice and proper finger alignment.",
    "Modern web applications utilize high-performance components to deliver interactive user experiences.",
    "Under the glowing neon city lights, the developer designed a gorgeous virtual mechanical keyboard."
  ]
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Home({ params }: PageProps) {
  const router = useRouter();
  const { locale } = use(params);
  const t = useTranslations('HomePage');
  
  const appLanguage = (locale === 'en' || locale === 'es') ? locale : 'es';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = (saved === 'light' || saved === 'dark') ? saved : systemTheme;
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    requestAnimationFrame(() => {
      setTheme(activeTheme);
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('keyboardLanguage');
    const targetLang = (saved === 'es' || saved === 'en') ? saved : appLanguage;
    setTimeout(() => {
      setKeyboardLanguage(targetLang);
    }, 0);
  }, [appLanguage]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const keystrokesCount = useRef(0);
  const correctKeystrokesCount = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { playClick } = useAudio();
  const currentPhrase = PHRASES[appLanguage][phraseIndex];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));

      if (!isFocused) return;

      if (e.code === 'Space' || e.code === 'Backspace' || e.code === 'Tab') {
        e.preventDefault();
      }

      if (e.code === 'CapsLock') {
        return;
      }

      handleKeyPress(e.key, e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: false }));
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

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl px-5 py-10 gap-8" ref={containerRef}>
      <Header
        appLanguage={appLanguage}
        onAppLanguageChange={handleAppLanguageChange}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        logoText={t('logoMain')}
        soundLabel={t('soundLabel')}
        soundOnTitle={t('soundOnTitle')}
        soundOffTitle={t('soundOffTitle')}
        theme={theme}
        onThemeToggle={toggleTheme}
        themeLabel={t('themeLabel')}
        themeLightTitle={t('themeLightTitle')}
        themeDarkTitle={t('themeDarkTitle')}
      />

      <Dashboard
        wpm={wpm}
        accuracy={accuracy}
        elapsedTime={elapsedTime}
        wpmLabel={t('metricWpm')}
        accuracyLabel={t('metricAccuracy')}
        timeLabel={t('metricTime')}
      />

      <section className="relative cursor-pointer w-full" onClick={forceFocus}>
        <TypingArea text={currentPhrase} userInput={userInput} hasError={hasError} />
        
        {!isFocused && (
          <div className="absolute inset-0 pb-6 bg-background/85 backdrop-blur-[2px] rounded-xl flex justify-center items-center z-10 border border-border animate-fade-in">
            <div className="flex flex-col items-center gap-2.5 text-muted-foreground text-sm font-medium text-center p-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60 animate-bounce">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="6" y1="8" x2="6" y2="8" />
                <line x1="10" y1="8" x2="10" y2="8" />
                <line x1="14" y1="8" x2="14" y2="8" />
                <line x1="18" y1="8" x2="18" y2="8" />
                <line x1="6" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="18" y2="12" />
                <line x1="7" y1="16" x2="17" y2="16" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
              <span>{t('focusMessage')}</span>
            </div>
          </div>
        )}

        {isCompleted && (
          <CompletedOverlay
            wpm={wpm}
            accuracy={accuracy}
            onRestart={handleReset}
            title={t('completedTitle')}
            body={t('completedBody', { wpm, accuracy })}
            restartBtnLabel={t('restartBtn')}
          />
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center px-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <span>{t('keyboardLabel')}</span>
            <div className="flex bg-muted border border-border rounded-md p-0.5 h-6">
              <Button 
                variant={keyboardLanguage === 'es' ? 'secondary' : 'ghost'}
                size="xs"
                className="text-[9px] font-bold h-5 px-1.5 rounded-sm"
                onClick={() => handleKeyboardLanguageChange('es')}
              >
                ES
              </Button>
              <Button 
                variant={keyboardLanguage === 'en' ? 'secondary' : 'ghost'}
                size="xs"
                className="text-[9px] font-bold h-5 px-1.5 rounded-sm"
                onClick={() => handleKeyboardLanguageChange('en')}
              >
                EN
              </Button>
            </div>
          </div>
          <button 
            className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-150" 
            onClick={() => changePhrase('random')}
          >
            {t('nextPhraseBtn')}
          </button>
        </div>
        <Keyboard language={keyboardLanguage} pressedKeys={pressedKeys} />
      </section>

      <Footer text={t('footerText')} />
    </div>
  );
}
