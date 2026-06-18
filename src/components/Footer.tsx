'use client';

import React from 'react';

interface FooterProps {
  text: string;
}

export default function Footer({ text }: FooterProps) {
  return (
    <footer className="text-center text-xs text-muted-foreground mt-auto leading-relaxed border-t border-border pt-4 w-full">
      <p>{text}</p>
    </footer>
  );
}
