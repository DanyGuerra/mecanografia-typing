'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PauseOverlayProps {
  title: string;
  subtitle: string;
  onResume?: () => void;
}

export default function PauseOverlay({ title, subtitle, onResume }: PauseOverlayProps) {
  return (
    <div 
      className="absolute inset-0 bg-background/70 backdrop-blur-md rounded-xl flex items-center justify-center z-30 animate-in fade-in zoom-in-95 duration-200 p-3 sm:p-4 select-none cursor-pointer"
      onClick={onResume}
    >
      <Card className="relative overflow-hidden border border-border/80 bg-card/95 shadow-xl max-w-lg w-full mx-auto p-3 sm:p-4 transform transition-all duration-200 hover:border-primary/40">
        {/* Accent top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left: Animated Icon + Title & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="size-10 sm:size-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-2xs">
                <Pause className="size-5 fill-primary/20 text-primary animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-foreground truncate">
                  {title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate mt-0.5">
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground font-semibold shrink-0">
                  Tecla
                </kbd>
                <span className="truncate">{subtitle}</span>
              </div>
            </div>
          </div>

          {/* Right: Reanudar Button */}
          {onResume && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onResume();
              }}
              className="shrink-0 h-8 sm:h-9 px-3.5 sm:px-4 text-xs font-bold gap-1.5 rounded-lg shadow-xs hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Play className="size-3.5 fill-current" />
              <span>{title === 'En pausa' ? 'Reanudar' : 'Resume'}</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
