'use client';

import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, PenLine, Gauge, Target, Clock, Sparkles } from 'lucide-react';

interface CompletedOverlayProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  onRestart: () => void;
  onRestartWithCustomText: () => void;
  title: string;
  body: string;
  restartBtnLabel: string;
  tryWithCustomTextBtnLabel: string;
  wpmLabel: string;
  accuracyLabel: string;
  timeLabel: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

function CompletedOverlay({
  wpm,
  accuracy,
  elapsedTime,
  onRestart,
  onRestartWithCustomText,
  title,
  body,
  restartBtnLabel,
  tryWithCustomTextBtnLabel,
  wpmLabel,
  accuracyLabel,
  timeLabel,
}: CompletedOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/85 backdrop-blur-md rounded-xl flex justify-center items-center z-30 p-4 animate-in fade-in zoom-in-95 duration-200">
      <Card className="w-full max-w-md border border-border bg-card shadow-2xl text-center flex flex-col items-center p-6 overflow-hidden relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
            <Trophy className="size-7 animate-bounce" />
          </div>
        </div>

        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground flex items-center justify-center gap-1.5">
            <span>{title}</span>
            <Sparkles className="size-5 text-amber-500 fill-amber-500/20" />
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs leading-relaxed max-w-[320px] mt-1">
            {body}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 w-full grid grid-cols-3 gap-2.5 my-2">
          <div className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50 border border-border/60">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              <Gauge className="size-3 text-primary" />
              <span>{wpmLabel}</span>
            </div>
            <span className="font-mono text-xl font-black text-foreground">{wpm}</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50 border border-border/60">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              <Target className="size-3 text-emerald-500" />
              <span>{accuracyLabel}</span>
            </div>
            <span className="font-mono text-xl font-black text-foreground">{accuracy}%</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50 border border-border/60">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              <Clock className="size-3 text-indigo-500" />
              <span>{timeLabel}</span>
            </div>
            <span className="font-mono text-xl font-black text-foreground">{formatTime(elapsedTime)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-0 mt-4 w-full flex flex-col gap-2">
          <Button
            variant="default"
            size="lg"
            className="w-full font-bold gap-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 shadow-md"
            onClick={onRestart}
          >
            <RotateCcw className="size-4" />
            <span>{restartBtnLabel}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full font-semibold gap-2 rounded-lg cursor-pointer transition-all duration-150 active:scale-95"
            onClick={onRestartWithCustomText}
          >
            <PenLine className="size-4 text-primary" />
            <span>{tryWithCustomTextBtnLabel}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default memo(CompletedOverlay);
