'use client';

import { use, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import PracticeArea from '@/components/PracticeArea';
import Keyboard from '@/components/Keyboard';
import KeyboardToolbar from '@/components/KeyboardToolbar';
import { usePracticeTest } from '@/hooks/usePracticeTest';

interface PracticePageProps {
  params: Promise<{ locale: string }>;
}

export default function PracticePage({ params }: PracticePageProps) {
  const { locale } = use(params);
  const t = useTranslations('HomePage');
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    language,
    category,
    selectCategory,
    applyCustomText,
    currentPhrase,
    userInput,
    hasError,
    isCompleted,
    targetChar,
    targetKeyCode,
    targetNeedsShift,
    pressedKeys,
    capsLockActive,
    osMode,
    setOsMode,
    soundEnabled,
    setSoundEnabled,
    resetPractice,
    keyboardLanguage,
    setKeyboardLanguage,
    theme,
    toggleTheme,
    accentColor,
    setAccentColor,
  } = usePracticeTest(locale);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8 mx-auto gap-6" ref={containerRef}>
      <Header
        appLanguage={language}
        onAppLanguageChange={(lang) => {
          window.location.href = `/${lang}/practice`;
        }}
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
        accentColor={accentColor}
        onAccentColorChange={setAccentColor}
        testModeTab={t('testModeTab')}
        practiceModeTab={t('practiceModeTab')}
      />

      {/* Practice Header Info Banner */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
          <span>{t('practiceTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('practiceSubtitle')}
        </p>
      </div>

      {/* Interactive Practice Area (No timers, no WPM, no accuracy pressure) */}
      <section className="relative w-full">
        <PracticeArea
          text={currentPhrase}
          userInput={userInput}
          hasError={hasError}
          isCompleted={isCompleted}
          targetChar={targetChar}
          targetKeyCode={targetKeyCode}
          targetNeedsShift={targetNeedsShift}
          category={category}
          onSelectCategory={selectCategory}
          onApplyCustomText={applyCustomText}
          onReset={resetPractice}
          t={{
            homeRowCategory: t('homeRowCategory'),
            topRowCategory: t('topRowCategory'),
            bottomRowCategory: t('bottomRowCategory'),
            commonWordsCategory: t('commonWordsCategory'),
            numbersCategory: t('numbersCategory'),
            symbolsCategory: t('symbolsCategory'),
            customCategory: t('customCategory'),
            nextKeyLabel: t('nextKeyLabel'),
            pressKeyInstruction: t('pressKeyInstruction'),
            practiceCompleted: t('practiceCompleted'),
            restartBtn: t('restartBtn'),
            customTextTitle: t('customTextTitle'),
            customTextPlaceholder: t('customTextPlaceholder'),
            customTextApply: t('customTextApply'),
            customTextCancel: t('customTextCancel'),
            changeTextBtn: t('changeTextBtn'),
          }}
        />
      </section>

      {/* Keyboard Controls & 3D Interactive Keyboard */}
      <section className="w-full flex flex-col gap-3">
        <KeyboardToolbar
          label={t('keyboardLabel')}
          keyboardLanguage={keyboardLanguage}
          onKeyboardLanguageChange={setKeyboardLanguage}
          osMode={osMode}
          onOsModeChange={setOsMode}
        />

        <div className="w-full flex justify-center">
          <Keyboard
            language={keyboardLanguage}
            pressedKeys={pressedKeys}
            capsLockActive={capsLockActive}
            osMode={osMode}
            targetChar={targetChar}
            nextKeyCode={targetKeyCode}
            nextKeyNeedsShift={targetNeedsShift}
          />
        </div>
      </section>

      <footer className="w-full text-center py-4 border-t border-border mt-auto">
        <p className="text-xs text-muted-foreground">{t('footerText')}</p>
      </footer>
    </div>
  );
}
