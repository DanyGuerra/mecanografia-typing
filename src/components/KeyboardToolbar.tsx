'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, Shuffle } from 'lucide-react';

interface KeyboardToolbarProps {
  label: string;
  keyboardLanguage: 'es' | 'en';
  onKeyboardLanguageChange: (lang: 'es' | 'en') => void;
  osMode: 'mac' | 'windows';
  onOsModeChange: (mode: 'mac' | 'windows') => void;
  nextPhraseLabel?: string;
  onNextPhrase?: () => void;
}

export default function KeyboardToolbar({
  label,
  keyboardLanguage,
  onKeyboardLanguageChange,
  osMode,
  onOsModeChange,
  nextPhraseLabel,
  onNextPhrase,
}: KeyboardToolbarProps) {
  return (
    <div className="flex justify-between items-center px-0.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <Keyboard className="size-3.5 text-muted-foreground/70" />
          <span>{label}</span>
        </div>

        {/* Keyboard Layout Language Selector */}
        <div className="flex bg-muted/80 border border-border/80 rounded-lg p-0.5 h-6 gap-0.5 shadow-2xs">
          <Button
            variant={keyboardLanguage === 'es' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-black h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onKeyboardLanguageChange('es')}
          >
            ES
          </Button>
          <Button
            variant={keyboardLanguage === 'en' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-black h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onKeyboardLanguageChange('en')}
          >
            EN
          </Button>
        </div>

        {/* OS Mode Switcher */}
        <div className="flex bg-muted/80 border border-border/80 rounded-lg p-0.5 h-6 gap-0.5 shadow-2xs ml-1">
          <Button
            variant={osMode === 'windows' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-black h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onOsModeChange('windows')}
          >
            WIN
          </Button>
          <Button
            variant={osMode === 'mac' ? 'secondary' : 'ghost'}
            size="xs"
            className="text-[9px] font-black h-5 px-2 rounded-md transition-all duration-200"
            onClick={() => onOsModeChange('mac')}
          >
            MAC
          </Button>
        </div>
      </div>

      {onNextPhrase && nextPhraseLabel && (
        <Button
          variant="ghost"
          size="sm"
          className="text-[9px] font-extrabold uppercase tracking-wider h-6 rounded-md px-2 text-muted-foreground/80 hover:text-foreground hover:bg-muted/60 gap-1 transition-all duration-150 cursor-pointer group/btn"
          onClick={onNextPhrase}
        >
          <Shuffle className="size-3 text-muted-foreground/70 group-hover/btn:text-foreground" />
          <span>{nextPhraseLabel.replace('->', '').trim()}</span>
        </Button>
      )}
    </div>
  );
}



