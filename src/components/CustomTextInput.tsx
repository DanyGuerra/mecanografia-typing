'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Play, Shuffle } from 'lucide-react';

interface CustomTextInputProps {
  onApplyText: (text: string) => void;
  onRandomText: () => void;
  title: string;
  placeholder: string;
  applyLabel: string;
  randomLabel: string;
}

export default function CustomTextInput({
  onApplyText,
  onRandomText,
  title,
  placeholder,
  applyLabel,
  randomLabel,
}: CustomTextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      onApplyText(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="w-full border border-border/80 bg-card/60 backdrop-blur-xs shadow-2xs p-4 sm:p-5 rounded-2xl">
      <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <div className="size-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs">
            <PenLine className="size-3.5" />
          </div>
          <span>{title}</span>
        </CardTitle>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRandomText}
          className="text-[10px] font-extrabold uppercase tracking-wider h-6 rounded-md px-2 text-muted-foreground/80 hover:text-foreground gap-1.5 cursor-pointer"
        >
          <Shuffle className="size-3 text-muted-foreground/70" />
          <span>{randomLabel}</span>
        </Button>
      </CardHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <CardContent className="p-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            className="w-full p-3.5 rounded-xl border border-border/80 bg-background/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-mono text-sm leading-relaxed resize-none transition-all duration-200"
          />
        </CardContent>

        <CardFooter className="p-0 flex justify-end">
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={text.trim().length === 0}
            className="font-black text-xs uppercase tracking-wider rounded-lg px-4 h-8 gap-2 cursor-pointer shadow-2xs disabled:opacity-40"
          >
            <Play className="size-3.5 fill-current" />
            <span>{applyLabel}</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
