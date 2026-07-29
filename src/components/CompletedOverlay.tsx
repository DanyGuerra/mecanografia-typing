'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';

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
    <div className="absolute inset-0 pb-6 bg-background/90 backdrop-blur-md rounded-xl flex justify-center items-center z-20 animate-[scaleIn_0.2s_cubic-bezier(0.16,1,0.3,1)] p-4">
      <Card className="w-full max-w-sm border-border/80 bg-card/95 shadow-xl text-center flex flex-col items-center p-6">
        <div className="size-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-3 animate-bounce">
          <Trophy className="size-6" />
        </div>
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm max-w-[280px] mt-1">
            {body}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-0 mt-5 w-full">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full font-bold gap-2 rounded-lg cursor-pointer transition-transform duration-150 active:scale-95 shadow-sm"
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
