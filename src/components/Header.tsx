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
import { Globe, Volume2, VolumeX, Sun, Moon, Check, ChevronDown, Palette } from 'lucide-react';
import KeyboardLogo from './KeyboardLogo';
import { type AccentColorKey, ACCENT_COLORS } from '@/hooks/useAccentColor';

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
  accentColor: AccentColorKey;
  onAccentColorChange: (key: AccentColorKey) => void;
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
  accentColor,
  onAccentColorChange,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const currentAccent = ACCENT_COLORS.find((c) => c.key === accentColor) ?? ACCENT_COLORS[0];

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

        {/* Accent Color Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg gap-2 px-3 border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                aria-label="Color de énfasis"
                title="Color de énfasis"
              >
                <Palette className="size-4 text-muted-foreground" />
                <span
                  className="size-3.5 rounded-full border border-border/60 shadow-xs flex-shrink-0"
                  style={{ backgroundColor: currentAccent.hex }}
                />
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={4} className="min-w-[fit-content] p-2">
            <div className="grid grid-cols-4 gap-1.5">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.key}
                  onClick={() => onAccentColorChange(color.key)}
                  title={color.label}
                  className="relative size-6 rounded-full border-2 transition-all duration-150 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: accentColor === color.key ? color.hex : 'transparent',
                    boxShadow: accentColor === color.key ? `0 0 0 2px ${color.hex}44` : 'none',
                  }}
                >
                  {accentColor === color.key && (
                    <Check className="size-3 text-white absolute inset-0 m-auto drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
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
