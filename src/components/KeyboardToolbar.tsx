'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, Laptop, Monitor } from 'lucide-react';

interface KeyboardToolbarProps {
  label: string;
  keyboardLanguage: 'es' | 'en';
  onKeyboardLanguageChange: (lang: 'es' | 'en') => void;
  osMode: 'mac' | 'windows';
  onOsModeChange: (mode: 'mac' | 'windows') => void;
}

function KeyboardToolbar({
  label,
  keyboardLanguage,
  onKeyboardLanguageChange,
  osMode,
  onOsModeChange,
}: KeyboardToolbarProps) {
  return (
    <div className="flex justify-between items-center px-1 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground select-none">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-foreground/90 font-bold">
          <Keyboard className="size-4 text-primary" />
        </div>

        {/* Keyboard Layout Language Selector */}
        <div className="flex bg-muted/80 border border-border/80 rounded-lg p-0.5 h-7 gap-0.5 shadow-2xs items-center">
          <Button
            variant={keyboardLanguage === 'es' ? 'default' : 'ghost'}
            size="xs"
            className="text-[10px] font-bold h-6 px-2.5 rounded-md transition-all duration-150"
            onClick={() => onKeyboardLanguageChange('es')}
          >
            Español
          </Button>
          <Button
            variant={keyboardLanguage === 'en' ? 'default' : 'ghost'}
            size="xs"
            className="text-[10px] font-bold h-6 px-2.5 rounded-md transition-all duration-150"
            onClick={() => onKeyboardLanguageChange('en')}
          >
            English
          </Button>
        </div>

        {/* OS Mode Switcher */}
        <div className="flex bg-muted/80 border border-border/80 rounded-lg p-0.5 h-7 gap-0.5 shadow-2xs items-center ml-1">
          <Button
            variant={osMode === 'mac' ? 'default' : 'ghost'}
            size="xs"
            className="text-[10px] font-bold h-6 px-2.5 gap-1 rounded-md transition-all duration-150"
            onClick={() => onOsModeChange('mac')}
          >
            <Laptop className="size-3" />
            <span>macOS</span>
          </Button>
          <Button
            variant={osMode === 'windows' ? 'default' : 'ghost'}
            size="xs"
            className="text-[10px] font-bold h-6 px-2.5 gap-1 rounded-md transition-all duration-150"
            onClick={() => onOsModeChange('windows')}
          >
            <Monitor className="size-3" />
            <span>Windows</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(KeyboardToolbar);
