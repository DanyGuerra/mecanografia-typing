'use client';

import React, { use } from 'react';
import { useTranslations } from 'next-intl';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TypingArea from '@/components/TypingArea';
import Keyboard from '@/components/Keyboard';
import CompletedOverlay from '@/components/CompletedOverlay';
import KeyboardToolbar from '@/components/KeyboardToolbar';

import { useTypingTest } from '@/hooks/useTypingTest';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Home({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations('HomePage');

  const {
    appLanguage,
    soundEnabled,
    setSoundEnabled,
    theme,
    toggleTheme,
    currentPhrase,
    userInput,
    hasError,
    errorKey,
    containerRef,
    wpm,
    accuracy,
    isCompleted,
    keyboardLanguage,
    pressedKeys,
    capsLockActive,
    osMode,
    handleReset,
    setCustomPhrase,
    handleAppLanguageChange,
    handleKeyboardLanguageChange,
    handleOsModeChange,
  } = useTypingTest(locale);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl px-5 py-10 gap-7" ref={containerRef}>
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

      <section className="relative w-full">
        <TypingArea
          text={currentPhrase}
          userInput={userInput}
          hasError={hasError}
          errorKey={errorKey}
          onApplyCustomText={(text) => {
            setCustomPhrase(text);
          }}
          customTextTitle={t('customTextTitle')}
          customTextPlaceholder={t('customTextPlaceholder')}
          customTextApply={t('customTextApply')}
        />

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
        <KeyboardToolbar
          label={t('keyboardLabel')}
          keyboardLanguage={keyboardLanguage}
          onKeyboardLanguageChange={handleKeyboardLanguageChange}
          osMode={osMode}
          onOsModeChange={handleOsModeChange}
        />
        <Keyboard
          language={keyboardLanguage}
          pressedKeys={pressedKeys}
          capsLockActive={capsLockActive}
          osMode={osMode}
        />
      </section>

      <Footer text={t('footerText')} />
    </div>
  );
}
