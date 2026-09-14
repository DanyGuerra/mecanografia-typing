'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Laptop,
  Monitor,
  ShieldAlert,
} from 'lucide-react';
import {
  LayoutMode,
  KeyboardLanguage,
  OsMode,
  KeyboardTesterTranslations,
} from './types';

interface KeyboardControlsToolbarProps {
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  keyboardLanguage: KeyboardLanguage;
  onKeyboardLanguageChange: (lang: KeyboardLanguage) => void;
  osMode: OsMode;
  onOsModeChange: (os: OsMode) => void;
  preventShortcuts: boolean;
  onPreventShortcutsToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onReset: () => void;
  t: KeyboardTesterTranslations;
}

function KeyboardControlsToolbar({
  layoutMode,
  onLayoutModeChange,
  keyboardLanguage,
  onKeyboardLanguageChange,
  osMode,
  onOsModeChange,
  preventShortcuts,
  onPreventShortcutsToggle,
  soundEnabled,
  onSoundToggle,
  onReset,
  t,
}: KeyboardControlsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Layout Selector: TKL, Full, Compact (65%), Compact (60%) */}
        <div className="flex bg-muted/80 border border-border/80 rounded-xl p-0.5 h-8 items-center gap-0.5 shadow-2xs">
          <Button
            variant={layoutMode === 'tkl' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
            onClick={() => onLayoutModeChange('tkl')}
          >
            {t.layoutTkl}
          </Button>
          <Button
            variant={layoutMode === 'full' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
            onClick={() => onLayoutModeChange('full')}
          >
            {t.layoutFull}
          </Button>
          <Button
            variant={layoutMode === 'compact' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
            onClick={() => onLayoutModeChange('compact')}
          >
            {t.layoutCompact}
          </Button>
          <Button
            variant={layoutMode === 'compact60' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
            onClick={() => onLayoutModeChange('compact60')}
          >
            {t.layoutCompact60 || '60%'}
          </Button>
        </div>

        {/* Language Selector */}
        <div className="flex bg-muted/80 border border-border/80 rounded-xl p-0.5 h-8 items-center gap-0.5 shadow-2xs">
          <Button
            variant={keyboardLanguage === 'es' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
            onClick={() => onKeyboardLanguageChange('es')}
          >
            {t.keyboardLangEs || 'ES (ISO)'}
          </Button>
          <Button
            variant={keyboardLanguage === 'en' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
            onClick={() => onKeyboardLanguageChange('en')}
          >
            {t.keyboardLangEn || 'EN (ANSI)'}
          </Button>
        </div>

        {/* OS Switcher */}
        <div className="hidden sm:flex bg-muted/80 border border-border/80 rounded-xl p-0.5 h-8 items-center gap-0.5 shadow-2xs">
          <Button
            variant={osMode === 'mac' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 gap-1 rounded-lg transition-all"
            onClick={() => onOsModeChange('mac')}
          >
            <Laptop className="size-3" />
            <span>macOS</span>
          </Button>
          <Button
            variant={osMode === 'windows' ? 'default' : 'ghost'}
            size="xs"
            className="text-[11px] font-bold h-7 px-2.5 gap-1 rounded-lg transition-all"
            onClick={() => onOsModeChange('windows')}
          >
            <Monitor className="size-3" />
            <span>Windows</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Prevent shortcuts toggle */}
        <Button
          variant={preventShortcuts ? 'secondary' : 'outline'}
          size="xs"
          className="text-[11px] font-bold h-8 px-3 rounded-xl gap-1.5 border border-border cursor-pointer transition-all"
          onClick={onPreventShortcutsToggle}
          title={t.preventShortcutsLabel}
        >
          <ShieldAlert className={`size-3.5 ${preventShortcuts ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="hidden sm:inline">{t.preventShortcutsLabel}</span>
        </Button>

        {/* Sound Toggle */}
        <Button
          variant={soundEnabled ? 'secondary' : 'outline'}
          size="icon"
          className="size-8 rounded-xl border border-border transition-colors cursor-pointer"
          onClick={onSoundToggle}
          title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? (
            <Volume2 className="size-4 text-foreground" />
          ) : (
            <VolumeX className="size-4 text-muted-foreground opacity-70" />
          )}
        </Button>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 rounded-xl px-3 gap-1.5 text-xs font-bold border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>{t.resetKeyboardBtn}</span>
        </Button>
      </div>
    </div>
  );
}

export default memo(KeyboardControlsToolbar);
