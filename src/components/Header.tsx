'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  appLanguage: 'es' | 'en';
  onAppLanguageChange: (lang: 'es' | 'en') => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  logoText: string;
  soundLabel: string;
  soundOnTitle: string;
  soundOffTitle: string;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  themeLabel: string;
  themeLightTitle: string;
  themeDarkTitle: string;
}

export default function Header({
  appLanguage,
  onAppLanguageChange,
  soundEnabled,
  onSoundToggle,
  logoText,
  soundLabel,
  soundOnTitle,
  soundOffTitle,
  theme,
  onThemeToggle,
  themeLabel,
  themeLightTitle,
  themeDarkTitle,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  return (
    <header className="flex justify-between items-center flex-wrap gap-4 border-b border-border pb-4 w-full">
      <div className="flex items-center gap-2 text-foreground">
        <svg width="28" height="28" viewBox="0 0 32 32" className="text-foreground">
          <rect x="2" y="6" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="6" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          <rect x="12" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
          <rect x="18" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
          <rect x="24" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          <rect x="6" y="17" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
          <rect x="12" y="17" width="8" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          <rect x="22" y="17" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
        </svg>
        <span className="text-lg font-bold tracking-tight text-foreground">
          {logoText}
          <span className="text-muted-foreground font-medium">.typing</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-muted border border-border rounded-lg p-0.5">
          <Button 
            variant={appLanguage === 'es' ? 'secondary' : 'ghost'}
            size="sm"
            className="text-xs font-semibold px-3 py-1 h-7 rounded-md"
            onClick={() => onAppLanguageChange('es')}
          >
            Español
          </Button>
          <Button 
            variant={appLanguage === 'en' ? 'secondary' : 'ghost'}
            size="sm"
            className="text-xs font-semibold px-3 py-1 h-7 rounded-md"
            onClick={() => onAppLanguageChange('en')}
          >
            English
          </Button>
        </div>

        <Button 
          variant={soundEnabled ? 'secondary' : 'outline'}
          size="sm"
          className="text-xs font-semibold h-8 rounded-lg gap-1.5"
          onClick={onSoundToggle}
          title={soundEnabled ? soundOnTitle : soundOffTitle}
        >
          {soundEnabled ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
          <span>{soundLabel}</span>
        </Button>

        <Button 
          variant={mounted && theme === 'light' ? 'secondary' : 'outline'}
          size="sm"
          className="text-xs font-semibold h-8 rounded-lg gap-1.5"
          onClick={onThemeToggle}
          title={mounted && theme === 'dark' ? themeLightTitle : themeDarkTitle}
          disabled={!mounted}
        >
          {!mounted ? (
            <div className="w-[16px] h-[16px]" />
          ) : theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{themeLabel}</span>
        </Button>
      </div>
    </header>
  );
}
