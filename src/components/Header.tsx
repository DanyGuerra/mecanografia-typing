'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Globe, Volume2, VolumeX, Sun, Moon, Check, ChevronDown } from 'lucide-react';
import KeyboardLogo from './KeyboardLogo';

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

function Header({
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
        className="group flex items-center gap-3 text-foreground transition-colors"
      >
        <div className="flex items-center justify-center p-2 rounded-lg bg-muted border border-border group-hover:border-primary/50 transition-colors">
          <KeyboardLogo className="text-foreground size-6 group-hover:scale-105 transition-transform duration-200" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {logoText}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-secondary text-secondary-foreground rounded-md border border-border">
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
                className="text-xs font-semibold h-9 rounded-lg gap-2 px-3 border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                aria-label="Seleccionar idioma"
              >
                <Globe className="size-4 text-muted-foreground" />
                <span className="font-bold text-xs uppercase">{appLanguage === 'es' ? 'ES' : 'EN'}</span>
                <ChevronDown className="size-3.5 text-muted-foreground opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={4} className="min-w-[130px]">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => onAppLanguageChange('es')}
                className="justify-between cursor-pointer"
              >
                <span>Español</span>
                {appLanguage === 'es' && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAppLanguageChange('en')}
                className="justify-between cursor-pointer"
              >
                <span>English</span>
                {appLanguage === 'en' && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sound Toggle Button */}
        <Button
          variant={soundEnabled ? 'secondary' : 'outline'}
          size="icon"
          className="size-9 rounded-lg border border-border transition-colors cursor-pointer"
          onClick={onSoundToggle}
          title={soundEnabled ? soundOnTitle : soundOffTitle}
          aria-label={soundEnabled ? soundOnTitle : soundOffTitle}
        >
          {soundEnabled ? (
            <Volume2 className="size-4 text-foreground" />
          ) : (
            <VolumeX className="size-4 text-muted-foreground opacity-70" />
          )}
        </Button>

        {/* Theme Toggle Button */}
        <Button
          variant={mounted && theme === 'light' ? 'secondary' : 'outline'}
          size="icon"
          className="size-9 rounded-lg border border-border transition-colors cursor-pointer"
          onClick={onThemeToggle}
          title={mounted && theme === 'dark' ? themeLightTitle : themeDarkTitle}
          aria-label={mounted && theme === 'dark' ? themeLightTitle : themeDarkTitle}
          disabled={!mounted}
        >
          {!mounted ? (
            <div className="size-3.5 rounded-full bg-muted animate-pulse" />
          ) : theme === 'dark' ? (
            <Sun className="size-4 text-amber-400" />
          ) : (
            <Moon className="size-4 text-indigo-500" />
          )}
        </Button>
      </div>
    </header>
  );
}

export default memo(Header);
