'use client';

import React from 'react';
import styles from './Header.module.css';

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
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <svg width="28" height="28" viewBox="0 0 32 32" className={styles.logoSvg}>
          <rect x="2" y="6" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="6" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          <rect x="12" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
          <rect x="18" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
          <rect x="24" y="11" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          <rect x="6" y="17" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
          <rect x="12" y="17" width="8" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
          <rect x="22" y="17" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.8" />
        </svg>
        <span className={styles.logoText}>{logoText}<span className={styles.logoSubtext}>.typing</span></span>
      </div>

      <div className={styles.controls}>
        <div className={styles.btnGroup}>
          <button 
            className={`${styles.controlBtn} ${appLanguage === 'es' ? styles.activeBtn : ''}`}
            onClick={() => onAppLanguageChange('es')}
          >
            Español
          </button>
          <button 
            className={`${styles.controlBtn} ${appLanguage === 'en' ? styles.activeBtn : ''}`}
            onClick={() => onAppLanguageChange('en')}
          >
            English
          </button>
        </div>

        <button 
          className={`${styles.controlBtn} ${soundEnabled ? styles.soundOn : styles.soundOff}`}
          onClick={onSoundToggle}
          title={soundEnabled ? soundOnTitle : soundOffTitle}
        >
          {soundEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
          <span>{soundLabel}</span>
        </button>

        <button 
          className={`${styles.controlBtn} ${theme === 'light' ? styles.soundOn : styles.soundOff}`}
          onClick={onThemeToggle}
          title={theme === 'dark' ? themeLightTitle : themeDarkTitle}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{themeLabel}</span>
        </button>
      </div>
    </header>
  );
}
