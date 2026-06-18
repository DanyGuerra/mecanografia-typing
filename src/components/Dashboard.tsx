'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface DashboardProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
  wpmLabel: string;
  accuracyLabel: string;
  timeLabel: string;
}

export default function Dashboard({
  wpm,
  accuracy,
  elapsedTime,
  wpmLabel,
  accuracyLabel,
  timeLabel,
}: DashboardProps) {
  return (
    <section className="grid grid-cols-3 gap-4">
      <Card className="flex flex-col items-center justify-center text-center p-4 bg-muted/30 border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {wpmLabel}
        </span>
        <span className="font-mono text-3xl font-bold text-foreground">
          {wpm}
        </span>
      </Card>
      <Card className="flex flex-col items-center justify-center text-center p-4 bg-muted/30 border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {accuracyLabel}
        </span>
        <span className="font-mono text-3xl font-bold text-foreground">
          {accuracy}%
        </span>
      </Card>
      <Card className="flex flex-col items-center justify-center text-center p-4 bg-muted/30 border-border">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {timeLabel}
        </span>
        <span className="font-mono text-3xl font-bold text-foreground">
          {elapsedTime}s
        </span>
      </Card>
    </section>
  );
}
