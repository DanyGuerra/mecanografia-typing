'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  text: string;
}

function Footer({ text }: FooterProps) {
  return (
    <footer className="text-center text-xs text-muted-foreground/80 mt-auto leading-relaxed border-t border-border/80 pt-4 pb-2 w-full flex items-center justify-center gap-1.5 font-medium">
      <Heart className="size-3 text-destructive/70 fill-destructive/20 inline" />
      <span>{text}</span>
    </footer>
  );
}

export default React.memo(Footer);
