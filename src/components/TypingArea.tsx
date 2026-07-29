'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TypingAreaProps {
  text: string;
  userInput: string;
  hasError: boolean;
}

export default function TypingArea({ text, userInput, hasError }: TypingAreaProps) {
  const progressPercent = Math.round((userInput.length / text.length) * 100);

  return (
    <Card className={`w-full max-w-[900px] bg-card/70 backdrop-blur-xs border border-border/80 shadow-xs mb-6 relative overflow-hidden transition-all duration-200 ${hasError ? 'shake-error border-destructive/50' : ''}`}>
      {/* Progress Bar Line */}
      <div 
        className="h-0.5 bg-primary transition-all duration-150 absolute top-0 left-0" 
        style={{ width: `${progressPercent}%` }}
      />
      <CardContent className="p-7">
        <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-wide break-words whitespace-pre-wrap select-none">
          {text.split('').map((char, index) => {
            let charClass = "text-muted-foreground/60";
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isSpace = char === ' ';

            if (isTyped) {
              const isCorrect = userInput[index] === char;
              charClass = isCorrect 
                ? "text-foreground font-semibold" 
                : "text-destructive bg-destructive/15 rounded-xs px-[1px]";
            } else if (isCurrent) {
              charClass = "text-foreground font-semibold";
            }

            return (
              <span key={index} className={`relative transition-colors duration-100 ${charClass}`}>
                {isCurrent && (
                  <span
                    className={`absolute -left-[1px] top-[15%] h-[70%] w-[2px] inline-block pointer-events-none cursor-blink ${hasError ? 'bg-destructive' : 'bg-primary'}`}
                  />
                )}
                {isSpace ? ' ' : char}
              </span>
            );
          })}
          {userInput.length === text.length && (
            <span className="relative text-foreground">
              <span className="absolute -left-[1px] top-[15%] h-[70%] w-[2px] inline-block pointer-events-none cursor-blink bg-primary" />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
