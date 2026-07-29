'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TypingAreaProps {
  text: string;
  userInput: string;
  hasError: boolean;
}

export default function TypingArea({ text, userInput, hasError }: TypingAreaProps) {
  return (
    <Card className={`w-full max-w-[900px] bg-card/60 backdrop-blur-xs border-border/80 shadow-2xs mb-6 ${hasError ? 'shake-error' : ''}`}>
      <CardContent className="p-6">
        <div className="font-mono text-xl leading-relaxed tracking-wide break-words whitespace-pre-wrap select-none">
          {text.split('').map((char, index) => {
            let charClass = "text-muted-foreground";
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isSpace = char === ' ';

            if (isTyped) {
              const isCorrect = userInput[index] === char;
              charClass = isCorrect ? "text-foreground font-semibold" : "text-destructive bg-destructive/15 rounded-[2px] px-[1px]";
            } else if (isCurrent) {
              charClass = "text-foreground";
            }

            return (
              <span key={index} className={`relative transition-colors duration-100 ${charClass}`}>
                {isCurrent && (
                  <span
                    className={`absolute -left-[1px] top-[15%] h-[70%] w-[2px] inline-block pointer-events-none cursor-blink ${hasError ? 'bg-destructive' : 'bg-foreground'}`}
                  />
                )}
                {isSpace ? ' ' : char}
              </span>
            );
          })}
          {userInput.length === text.length && (
            <span className="relative text-foreground">
              <span className="absolute -left-[1px] top-[15%] h-[70%] w-[2px] inline-block pointer-events-none cursor-blink bg-foreground" />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
