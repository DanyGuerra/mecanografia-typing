'use client';

import { useState, useEffect } from 'react';
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
    <header className="w-full flex justify-between items-center flex-wrap gap-4 border-b border-border pb-4 transition-all duration-200">
      <Link
        href={`/${appLanguage}`}
        className="group flex items-center gap-3 text-foreground transition-all duration-200"
      >
        <div className="flex items-center justify-center p-2 rounded-lg bg-muted border border-border group-hover:border-primary/50 transition-colors">
          <KeyboardLogo className="text-foreground size-6 group-hover:scale-105 transition-transform duration-200" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {logoText}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-muted text-muted-foreground rounded border border-border">
            typing
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {/* Language Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold h-9 rounded-lg gap-2 px-3 border border-border bg-background hover:bg-muted transition-colors"
                aria-label="Seleccionar idioma"
              />
            }
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="font-bold text-xs uppercase">{appLanguage === 'es' ? 'ES' : 'EN'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="min-w-[130px] p-1 rounded-lg border border-border bg-popover shadow-md"
          >
            <DropdownMenuItem
              onClick={() => onAppLanguageChange('es')}
              className={`text-xs font-medium px-3 py-2 cursor-pointer rounded-md flex items-center justify-between transition-colors ${appLanguage === 'es'
                  ? 'bg-secondary font-semibold text-secondary-foreground'
                  : 'hover:bg-muted text-foreground'
                }`}
            >
              <span>Español</span>
              {appLanguage === 'es' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAppLanguageChange('en')}
              className={`text-xs font-medium px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between transition-colors ${appLanguage === 'en'
                  ? 'bg-secondary font-semibold text-secondary-foreground'
                  : 'hover:bg-muted text-foreground'
                }`}
            >
              <span>English</span>
              {appLanguage === 'en' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sound Toggle Button */}
        <Button
          variant={soundEnabled ? 'secondary' : 'outline'}
          size="icon"
          className="size-9 rounded-lg border border-border transition-colors"
          onClick={onSoundToggle}
          title={soundEnabled ? soundOnTitle : soundOffTitle}
          aria-label={soundEnabled ? soundOnTitle : soundOffTitle}
        >
          {soundEnabled ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </Button>

        {/* Theme Toggle Button */}
        <Button
          variant={mounted && theme === 'light' ? 'secondary' : 'outline'}
          size="icon"
          className="size-9 rounded-lg border border-border transition-colors"
          onClick={onThemeToggle}
          title={mounted && theme === 'dark' ? themeLightTitle : themeDarkTitle}
          aria-label={mounted && theme === 'dark' ? themeLightTitle : themeDarkTitle}
          disabled={!mounted}
        >
          {!mounted ? (
            <div className="size-3.5 rounded-full bg-muted animate-pulse" />
          ) : theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </Button>
      </div>
    </header>
  );
}
