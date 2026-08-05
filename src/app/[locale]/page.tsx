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
    hasSuccess,
    errorKey,
    containerRef,
    wpm,
    accuracy,
    elapsedTime,
    isCompleted,
    isPaused,
    handleResume,
    keyboardLanguage,
    pressedKeys,
    capsLockActive,
    osMode,
    isEditingText,
    setIsEditingText,
    nextKeyCode,
    nextKeyNeedsShift,
    handleReset,
    handleRestartWithCustomText,
    setCustomPhrase,
    handleAppLanguageChange,
    handleKeyboardLanguageChange,
    handleOsModeChange,
    accentColor,
    setAccentColor,
  } = useTypingTest(locale, t('defaultPhrase'));

  return (
    <div className="flex flex-col min-h-screen w-full" ref={containerRef}>
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
        accentColor={accentColor}
        onAccentColorChange={setAccentColor}
        testModeTab={t('testModeTab')}
        practiceModeTab={t('practiceModeTab')}
      />

      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-6 px-4">
        <section className="relative w-full">
          <TypingArea
            text={currentPhrase}
            userInput={userInput}
            hasError={hasError}
            hasSuccess={hasSuccess}
            errorKey={errorKey}
            isEditingText={isEditingText}
            isPaused={isPaused && !isCompleted && !isEditingText}
            onResume={handleResume}
            pausedTitle={t('pausedTitle')}
            pausedSubtitle={t('pausedSubtitle')}
            defaultPhrase={t('defaultPhrase')}
            onToggleEditing={setIsEditingText}
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
              onRestartWithCustomText={handleRestartWithCustomText}
              title={t('completedTitle')}
              body={t('completedBody', { wpm, accuracy })}
              restartBtnLabel={t('restartBtn')}
              tryWithCustomTextBtnLabel={t('tryWithCustomTextBtn')}
              wpmLabel={t('wpmLabel')}
              accuracyLabel={t('accuracyLabel')}
              timeLabel={t('timeLabel')}
            />
          )}
        </section>

        <section className="flex flex-col gap-2">
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
            nextKeyCode={nextKeyCode}
            nextKeyNeedsShift={nextKeyNeedsShift}
          />
        </section>

        <Footer
          text={t('footerText')}
          newlineHint={t('newlineHint')}
          saveTextHint={t('saveTextHint')}
        />
      </div>
    </div>
  );
}
