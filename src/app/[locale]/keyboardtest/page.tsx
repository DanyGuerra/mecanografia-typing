'use client';

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KeyboardTester from '@/components/KeyboardTester';
import { useAudio } from '@/hooks/useAudio';
import { useAccentColor } from '@/hooks/useAccentColor';

interface KeyboardTestPageProps {
  params: Promise<{ locale: string }>;
}

export default function KeyboardTestPage({ params }: KeyboardTestPageProps) {
  const { locale } = use(params);
  const t = useTranslations('HomePage');

  const appLanguage = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playClick } = useAudio();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme as 'light' | 'dark') || (theme as 'light' | 'dark') || 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const { accentColor, setAccentColor } = useAccentColor(currentTheme === 'dark');

  const handleAppLanguageChange = (lang: 'es' | 'en') => {
    window.location.href = `/${lang}/keyboardtest`;
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header
        appLanguage={appLanguage}
        onAppLanguageChange={handleAppLanguageChange}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        logoText={t('logoMain')}
        soundLabel={t('soundLabel')}
        soundOnTitle={t('soundOnTitle')}
        soundOffTitle={t('soundOffTitle')}
        theme={currentTheme}
        onThemeToggle={toggleTheme}
        themeLabel={t('themeLabel')}
        themeLightTitle={t('themeLightTitle')}
        themeDarkTitle={t('themeDarkTitle')}
        accentColor={accentColor}
        onAccentColorChange={setAccentColor}
        testModeTab={t('testModeTab')}
        practiceModeTab={t('practiceModeTab')}
        mouseModeTab={t('mouseModeTab')}
        keyboardTestTab={t('keyboardTestTab')}
      />

      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-6 px-4">
        {/* Page Header Title */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
            <span>{t('keyboardTestTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('keyboardTestSubtitle')}
          </p>
        </div>

        {/* Interactive Keyboard Testing Section */}
        <section className="relative w-full">
          <KeyboardTester
            initialLanguage={appLanguage}
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            onPlaySound={playClick}
            accentColor={accentColor}
            t={{
              keyboardTestTitle: t('keyboardTestTitle'),
              keyboardTestSubtitle: t('keyboardTestSubtitle'),
              testedKeysLabel: t('testedKeysLabel'),
              simultaneousKeysLabel: t('simultaneousKeysLabel'),
              maxRolloverLabel: t('maxRolloverLabel'),
              lastPressedLabel: t('lastPressedLabel'),
              resetKeyboardBtn: t('resetKeyboardBtn'),
              preventShortcutsLabel: t('preventShortcutsLabel'),
              historyLabel: t('historyLabel'),
              layoutCompact: t('layoutCompact'),
              layoutCompact60: t('layoutCompact60'),
              layoutTkl: t('layoutTkl'),
              layoutFull: t('layoutFull'),
              readyToTest: t('readyToTest'),
              allKeysTested: t('allKeysTested'),
              keyboardTestHint: t('keyboardTestHint'),
              activeKeySingle: t('activeKeySingle'),
              activeKeysMultiple: t('activeKeysMultiple'),
              keyboardLangEs: t('keyboardLangEs'),
              keyboardLangEn: t('keyboardLangEn'),
            }}
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
