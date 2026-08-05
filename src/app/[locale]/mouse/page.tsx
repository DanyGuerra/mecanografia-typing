'use client';

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MouseTester from '@/components/MouseTester';
import { useAudio } from '@/hooks/useAudio';
import { useAccentColor } from '@/hooks/useAccentColor';

interface MousePageProps {
  params: Promise<{ locale: string }>;
}

export default function MousePage({ params }: MousePageProps) {
  const { locale } = use(params);
  const t = useTranslations('HomePage');

  const appLanguage = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';

  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playMouseClick } = useAudio();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme as 'light' | 'dark') || (theme as 'light' | 'dark') || 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const { accentColor, setAccentColor } = useAccentColor(currentTheme === 'dark');

  const handleAppLanguageChange = (lang: 'es' | 'en') => {
    window.location.href = `/${lang}/mouse`;
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
      />

      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-6 px-4">
        {/* Page Title Banner */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
            <span>{t('mouseTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('mouseSubtitle')}
          </p>
        </div>

        {/* Main Mouse Testing Component */}
        <section className="relative w-full">
          <MouseTester
            accentColor={accentColor}
            soundEnabled={soundEnabled}
            onPlaySound={playMouseClick}
            t={{
              mouseTitle: t('mouseTitle'),
              mouseSubtitle: t('mouseSubtitle'),
              leftClick: t('leftClick'),
              rightClick: t('rightClick'),
              middleClick: t('middleClick'),
              sideBack: t('sideBack'),
              sideForward: t('sideForward'),
              scrollUp: t('scrollUp'),
              scrollDown: t('scrollDown'),
              totalClicks: t('totalClicks'),
              cpsLabel: t('cpsLabel'),
              peakCpsLabel: t('peakCpsLabel'),
              latencyLabel: t('latencyLabel'),
              scrollDistance: t('scrollDistance'),
              resetStats: t('resetStats'),
              freeTestTab: t('freeTestTab'),
              cpsTestTab: t('cpsTestTab'),
              startCpsTest: t('startCpsTest'),
              cpsTestTitle: t('cpsTestTitle'),
              cpsTestDesc: t('cpsTestDesc'),
              clickArenaPrompt: t('clickArenaPrompt'),
              lastActionLabel: t('lastActionLabel'),
              doubleClicks: t('doubleClicks'),
              waitingClick: t('waitingClick'),
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
