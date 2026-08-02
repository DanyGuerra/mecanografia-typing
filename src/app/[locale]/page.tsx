'use client';

import React, { use } from 'react';
import { useTranslations } from 'next-intl';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
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
    elapsedTime,
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
    <div className="flex flex-col min-h-screen w-full max-w-5xl px-5 py-8 mx-auto gap-6" ref={containerRef}>
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
        wpmLabel={t('wpmLabel')}
        accuracyLabel={t('accuracyLabel')}
        timeLabel={t('timeLabel')}
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
          customTextPlaceholder={t('customTextPlaceholder')}
          customTextApply={t('customTextApply')}
          customTextCancel={t('customTextCancel')}
          changeTextBtn={t('changeTextBtn')}
          editTextTitle={t('editTextTitle')}
          enterTextPrompt={t('enterTextPrompt')}
          typingErrorAlert={t('typingErrorAlert')}
          progressLabel={t('progressLabel')}
          charCountLabel={t('charCountLabel')}
          pressCtrlEnterHint={t('pressCtrlEnterHint')}
        />

        {isCompleted && (
          <CompletedOverlay
            wpm={wpm}
            accuracy={accuracy}
            elapsedTime={elapsedTime}
            onRestart={handleReset}
            title={t('completedTitle')}
            body={t('completedBody', { wpm, accuracy })}
            restartBtnLabel={t('restartBtn')}
            wpmLabel={t('wpmLabel')}
            accuracyLabel={t('accuracyLabel')}
            timeLabel={t('timeLabel')}
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
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

      <Footer
        text={t('footerText')}
        newlineHint={t('newlineHint')}
        saveTextHint={t('saveTextHint')}
      />
    </div>
  );
}
