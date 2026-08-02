'use client';

import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Gauge, Target, Clock } from 'lucide-react';

interface DashboardProps {
  wpm: number;
  accuracy: number;
  elapsedTime: number;
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

function Dashboard({
  wpm,
  accuracy,
  elapsedTime,
  wpmLabel,
  accuracyLabel,
  timeLabel,
}: DashboardProps) {
  return (
    <section className="grid grid-cols-3 gap-3.5 w-full">
      <Card className="bg-card/80 border-border/80 shadow-xs hover:border-primary/40 transition-colors relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/80 to-primary/20" />
        <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
          <CardTitle className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Gauge className="size-3.5 text-primary" />
            <span>{wpmLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {wpm}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">WPM</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/80 to-emerald-500/20" />
        <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
          <CardTitle className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target className="size-3.5 text-emerald-500" />
            <span>{accuracyLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {accuracy}
            </span>
            <span className="text-sm font-bold text-emerald-500">%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 border-border/80 shadow-xs hover:border-indigo-500/40 transition-colors relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/80 to-indigo-500/20" />
        <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
          <CardTitle className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-indigo-500" />
            <span>{timeLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {formatTime(elapsedTime)}
          </span>
        </CardContent>
      </Card>
    </section>
  );
}

export default memo(Dashboard);
