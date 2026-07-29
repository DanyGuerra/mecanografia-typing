'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MousePointerClick } from 'lucide-react';

interface FocusOverlayProps {
  message: string;
}

export default function FocusOverlay({ message }: FocusOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/75 backdrop-blur-xs rounded-xl flex justify-center items-center z-10 animate-fade-in p-4">
      <Card className="border border-border/80 bg-card/95 shadow-lg max-w-xs">
        <CardContent className="flex flex-col items-center gap-3 text-center p-6">
          <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
            <MousePointerClick className="size-5" />
          </div>
          <span className="text-xs font-bold tracking-wide text-foreground">{message}</span>
        </CardContent>
      </Card>
    </div>
  );
}
