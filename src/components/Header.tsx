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
      </div>
    </header>
  );
}
