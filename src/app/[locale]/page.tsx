'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TypingArea from '@/components/TypingArea';
import Keyboard from '@/components/Keyboard';
import CompletedOverlay from '@/components/CompletedOverlay';
import FocusOverlay from '@/components/FocusOverlay';
import KeyboardToolbar from '@/components/KeyboardToolbar';
import CustomTextInput from '@/components/CustomTextInput';

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
    isFocused,
    containerRef,
    wpm,
    accuracy,
    isCompleted,
    keyboardLanguage,
    pressedKeys,
    capsLockActive,
    osMode,
    handleReset,
    changePhrase,
    setCustomPhrase,
    handleAppLanguageChange,
    handleKeyboardLanguageChange,
    handleOsModeChange,
    forceFocus,
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

      <CustomTextInput
        onApplyText={(text) => {
          setCustomPhrase(text);
          forceFocus();
        }}
        onRandomText={() => {
          changePhrase('random');
          forceFocus();
        }}
        title={t('customTextTitle')}
        placeholder={t('customTextPlaceholder')}
        applyLabel={t('customTextApply')}
        randomLabel={t('nextPhraseBtn')}
      />

      <section className="relative cursor-pointer w-full" onClick={forceFocus}>
        <TypingArea text={currentPhrase} userInput={userInput} hasError={hasError} />

        {!isFocused && <FocusOverlay message={t('focusMessage')} />}

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


