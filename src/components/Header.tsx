'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Globe,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Check,
  ChevronDown,
  Palette,
  Zap,
  Target,
  MousePointer,
  Menu,
} from 'lucide-react';
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
  testModeTab?: string;
  practiceModeTab?: string;
  mouseModeTab?: string;
}

function Header({
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
  accentColor,
  onAccentColorChange,
  testModeTab = 'Prueba de Velocidad',
  practiceModeTab = 'Práctica Libre',
  mouseModeTab = 'Prueba de Mouse',
}: HeaderProps) {
  const t = useTranslations('HomePage');
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const isPracticeMode = pathname?.includes('/practice');
  const isMouseMode = pathname?.includes('/mouse');
  const isTestMode = !isPracticeMode && !isMouseMode;

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const currentAccent = ACCENT_COLORS.find((c) => c.key === accentColor) ?? ACCENT_COLORS[0];

  return (
    <header className="w-full flex items-center justify-between border-b border-border transition-all duration-200 py-2.5 px-4 bg-background/95 backdrop-blur-xs sticky top-0 z-50">
      {/* Left Section: Logo & Desktop Mode Switcher */}
      <div className="flex items-center gap-4">
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

        {/* Mode Switcher Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
          <Link
            href={`/${appLanguage}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isTestMode
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="size-3.5 text-primary" />
            <span>{testModeTab}</span>
          </Link>
          <Link
            href={`/${appLanguage}/practice`}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isPracticeMode
                ? 'bg-background text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target className="size-3.5 text-primary animate-pulse" />
            <span>{practiceModeTab}</span>
          </Link>
          <Link
            href={`/${appLanguage}/mouse`}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isMouseMode
                ? 'bg-background text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MousePointer className="size-3.5 text-primary" />
            <span>{mouseModeTab}</span>
          </Link>
        </div>
      </div>

      {/* Right Section: Desktop Controls */}
      <div className="hidden md:flex items-center gap-2">
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
                <span>{t('spanishLang')}</span>
                {appLanguage === 'es' && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAppLanguageChange('en')}
                className="justify-between cursor-pointer"
              >
                <span>{t('englishLang')}</span>
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
                aria-label={t('accentColorLabel')}
                title={t('accentColorLabel')}
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

      {/* Mobile Hamburger Sheet (shadcn/ui Sheet) */}
      <div className="flex md:hidden items-center">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-lg border border-border transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
              >
                <Menu className="size-5 text-foreground" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-[300px] sm:w-[350px] flex flex-col justify-between p-6">
            <div className="flex flex-col gap-6">
              <SheetHeader className="pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-2 rounded-lg bg-muted border border-border">
                    <KeyboardLogo className="text-foreground size-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-lg font-bold tracking-tight text-foreground">
                      {logoText}
                    </SheetTitle>
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-secondary text-secondary-foreground rounded-md border border-border">
                      typing
                    </span>
                  </div>
                </div>
                <SheetDescription className="text-xs text-muted-foreground mt-1">
                  {t('mobileMenuDescription')}
                </SheetDescription>
              </SheetHeader>

              {/* Mode Switcher Section */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground px-1">
                  {t('gameModeSection')}
                </span>
                <div className="flex flex-col gap-1.5 bg-muted/50 p-1.5 rounded-xl border border-border">
                  <Link
                    href={`/${appLanguage}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      isTestMode
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    <Zap className="size-4 text-primary" />
                    <span>{testModeTab}</span>
                  </Link>
                  <Link
                    href={`/${appLanguage}/practice`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      isPracticeMode
                        ? 'bg-background text-primary shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    <Target className="size-4 text-primary animate-pulse" />
                    <span>{practiceModeTab}</span>
                  </Link>
                  <Link
                    href={`/${appLanguage}/mouse`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      isMouseMode
                        ? 'bg-background text-primary shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    <MousePointer className="size-4 text-primary" />
                    <span>{mouseModeTab}</span>
                  </Link>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground px-1">
                  {t('preferencesSection')}
                </span>
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/40 border border-border">
                  {/* Language Row */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                      <Globe className="size-4" />
                      {t('languageLabel')}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold h-8 rounded-lg gap-2 px-3 border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                          >
                            <span className="font-bold text-xs uppercase">{appLanguage === 'es' ? 'ES' : 'EN'}</span>
                            <ChevronDown className="size-3 text-muted-foreground opacity-60" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" sideOffset={4} className="min-w-[130px]">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => onAppLanguageChange('es')}
                            className="justify-between cursor-pointer"
                          >
                            <span>{t('spanishLang')}</span>
                            {appLanguage === 'es' && <Check className="size-4 text-primary" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAppLanguageChange('en')}
                            className="justify-between cursor-pointer"
                          >
                            <span>{t('englishLang')}</span>
                            {appLanguage === 'en' && <Check className="size-4 text-primary" />}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Accent Color Row */}
                  <div className="flex items-center justify-between py-1 border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                      <Palette className="size-4" />
                      {t('accentColorLabel')}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg gap-2 px-2.5 border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
                          >
                            <span
                              className="size-3.5 rounded-full border border-border/60 shadow-xs flex-shrink-0"
                              style={{ backgroundColor: currentAccent.hex }}
                            />
                            <ChevronDown className="size-3 text-muted-foreground opacity-60" />
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
                  </div>

                  {/* Sound Toggle Row */}
                  <div className="flex items-center justify-between py-1 border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                      {soundEnabled ? <Volume2 className="size-4 text-foreground" /> : <VolumeX className="size-4 text-muted-foreground opacity-70" />}
                      {soundLabel}
                    </span>
                    <Button
                      variant={soundEnabled ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-8 px-3 rounded-lg border border-border transition-colors cursor-pointer text-xs font-semibold"
                      onClick={onSoundToggle}
                    >
                      {soundEnabled ? t('soundOn') : t('soundOff')}
                    </Button>
                  </div>

                  {/* Theme Toggle Row */}
                  <div className="flex items-center justify-between py-1 border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                      {mounted && theme === 'dark' ? (
                        <Sun className="size-4 text-amber-400" />
                      ) : (
                        <Moon className="size-4 text-indigo-500" />
                      )}
                      {themeLabel}
                    </span>
                    <Button
                      variant={mounted && theme === 'light' ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-8 px-3 rounded-lg border border-border transition-colors cursor-pointer text-xs font-semibold"
                      onClick={onThemeToggle}
                      disabled={!mounted}
                    >
                      {mounted && theme === 'dark' ? t('themeDark') : t('themeLight')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default memo(Header);

