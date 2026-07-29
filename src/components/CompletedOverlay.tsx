'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Gauge, Target } from 'lucide-react';

interface CompletedOverlayProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
  title: string;
  body: string;
  restartBtnLabel: string;
}

export default function CompletedOverlay({
  wpm,
  accuracy,
  onRestart,
  title,
  body,
  restartBtnLabel,
}: CompletedOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-xl flex justify-center items-center z-20 animate-fade-in p-4">
      <Card className="w-full max-w-sm border border-border/80 bg-card/95 shadow-xl text-center flex flex-col items-center p-6 overflow-hidden relative">
        <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-3 animate-bounce shadow-2xs">
          <Trophy className="size-7" />
        </div>

        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs leading-relaxed max-w-[280px] mt-1">
            {body}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 w-full grid grid-cols-2 gap-3 my-2">
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border/60">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              <Gauge className="size-3.5 text-primary" />
              <span>WPM</span>
            </div>
            <span className="font-mono text-2xl font-black text-foreground">{wpm}</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border/60">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              <Target className="size-3.5 text-emerald-500" />
              <span>Precisión</span>
            </div>
            <span className="font-mono text-2xl font-black text-foreground">{accuracy}%</span>
          </div>
        </CardContent>

        <CardFooter className="p-0 mt-4 w-full">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full font-bold gap-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 shadow-sm"
            onClick={onRestart}
          >
            <RotateCcw className="size-4" />
            <span>{restartBtnLabel}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
