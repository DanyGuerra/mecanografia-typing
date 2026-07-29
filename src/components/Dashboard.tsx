'use client';

import React from 'react';
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
      <Card size="sm" className="bg-card/60 backdrop-blur-xs border-border/80 shadow-2xs hover:border-primary/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-1">
          <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Gauge className="size-3.5 text-primary" />
            <span>{wpmLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="font-mono text-3xl font-black tracking-tight text-foreground">
            {wpm}
          </span>
        </CardContent>
      </Card>

      <Card size="sm" className="bg-card/60 backdrop-blur-xs border-border/80 shadow-2xs hover:border-primary/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-1">
          <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target className="size-3.5 text-emerald-500" />
            <span>{accuracyLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="font-mono text-3xl font-black tracking-tight text-foreground">
            {accuracy}%
          </span>
        </CardContent>
      </Card>

      <Card size="sm" className="bg-card/60 backdrop-blur-xs border-border/80 shadow-2xs hover:border-primary/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-1">
          <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-indigo-500" />
            <span>{timeLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="font-mono text-3xl font-black tracking-tight text-foreground">
            {elapsedTime}s
          </span>
        </CardContent>
      </Card>
    </section>
  );
}
