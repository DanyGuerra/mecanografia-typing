'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface CompletedOverlayProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
  title: string;
  body: string;
  restartBtnLabel: string;
}

export default function CompletedOverlay({
  onRestart,
  title,
  body,
  restartBtnLabel,
}: CompletedOverlayProps) {
  return (
    <div className="absolute inset-0 pb-6 bg-background/95 backdrop-blur-[2px] rounded-xl flex justify-center items-center z-20 border border-border shadow-lg animate-[scaleIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex flex-col items-center gap-4 text-center p-8 text-foreground">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm max-w-[320px]">
          {body}
        </p>
        <Button 
          variant="default" 
          size="lg" 
          className="mt-2 font-bold px-6 py-2 rounded-lg cursor-pointer transition-transform duration-150 active:scale-95"
          onClick={onRestart}
        >
          {restartBtnLabel}
        </Button>
      </div>
    </div>
  );
}
