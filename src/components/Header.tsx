'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import KeyboardLogo from './KeyboardLogo';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

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
  soundOnTitle,
  soundOffTitle,
  theme,
  onThemeToggle,
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
      <Link 
        href={`/${appLanguage}`} 
        className="group flex items-center gap-2.5 text-foreground hover:opacity-90 transition-all duration-200"
      >
        <KeyboardLogo className="text-foreground group-hover:scale-105 group-hover:rotate-[-2deg] transition-all duration-300 ease-out" />
        <span className="text-lg font-bold tracking-tight text-foreground">
          {logoText}
          <span className="text-muted-foreground font-medium">.typing</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg gap-1.5 px-3 transition-all duration-200"
              />
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current opacity-80">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>{appLanguage}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[110px]">
            <DropdownMenuItem
              onClick={() => onAppLanguageChange('es')}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 cursor-pointer ${
                appLanguage === 'es' ? 'bg-secondary text-secondary-foreground' : ''
              }`}
            >
              Español
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAppLanguageChange('en')}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 cursor-pointer ${
                appLanguage === 'en' ? 'bg-secondary text-secondary-foreground' : ''
              }`}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant={soundEnabled ? 'secondary' : 'outline'}
          size="icon"
          className="size-8 rounded-lg transition-all duration-200 hover:[&_svg]:scale-110 [&_svg]:transition-transform [&_svg]:duration-200"
          onClick={onSoundToggle}
          title={soundEnabled ? soundOnTitle : soundOffTitle}
        >
          {soundEnabled ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-current">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-current">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </Button>

        <Button 
          variant={mounted && theme === 'light' ? 'secondary' : 'outline'}
          size="icon"
          className="size-8 rounded-lg transition-all duration-200 hover:[&_svg]:rotate-12 hover:[&_svg]:scale-110 [&_svg]:transition-transform [&_svg]:duration-300"
          onClick={onThemeToggle}
          title={mounted && theme === 'dark' ? themeLightTitle : themeDarkTitle}
          disabled={!mounted}
        >
          {!mounted ? (
            <div className="w-[14px] h-[14px]" />
          ) : theme === 'dark' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-current">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="stroke-current">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </Button>
      </div>
    </header>
  );
}
