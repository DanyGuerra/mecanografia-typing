'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

interface FocusOverlayProps {
  message: string;
}

export default function FocusOverlay({ message }: FocusOverlayProps) {
  return (
    <div className="absolute inset-0 pb-6 bg-background/85 backdrop-blur-xs rounded-xl flex justify-center items-center z-10 animate-fade-in p-4">
      <Card className="border-border/80 bg-card/90 shadow-md">
        <CardContent className="flex flex-col items-center gap-2.5 text-center p-6">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground animate-bounce">
            <Keyboard className="size-5 text-muted-foreground/80" />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">{message}</span>
        </CardContent>
      </Card>
    </div>
  );
}
