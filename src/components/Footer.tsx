'use client';

import React, { memo } from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  text: string;
  newlineHint: string;
  saveTextHint: string;
}

function Footer({ text, newlineHint, saveTextHint }: FooterProps) {
  return (
    <footer className="w-full flex flex-col items-center gap-3 border-t border-border/60 pt-5 pb-3 mt-auto text-xs text-muted-foreground select-none">
      <div className="flex items-center gap-4 flex-wrap justify-center font-mono text-[11px]">
        <span className="flex items-center gap-1.5 bg-muted/60 border border-border/80 rounded-md px-2 py-1">
          <kbd className="px-1 py-0.5 rounded bg-background border border-border text-[10px] font-extrabold">↵ Enter</kbd>
          <span>{newlineHint}</span>
        </span>

        <span className="flex items-center gap-1.5 bg-muted/60 border border-border/80 rounded-md px-2 py-1">
          <kbd className="px-1 py-0.5 rounded bg-background border border-border text-[10px] font-extrabold">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-1 py-0.5 rounded bg-background border border-border text-[10px] font-extrabold">Enter</kbd>
          <span>{saveTextHint}</span>
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 font-medium text-muted-foreground/80">
        <Heart className="size-3 text-destructive/70 fill-destructive/20 inline" />
        <span>{text}</span>
      </div>
    </footer>
  );
}

export default memo(Footer);
