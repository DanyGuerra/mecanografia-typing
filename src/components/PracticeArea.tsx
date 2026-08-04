'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Target, CheckCircle2, PenLine, Sparkles, CornerDownLeft } from 'lucide-react';
import type { PracticeCategory } from '@/hooks/usePracticeTest';
import CustomTextInput from './CustomTextInput';

interface PracticeAreaProps {
  text: string;
  userInput: string;
  hasError: boolean;
  isCompleted: boolean;
  targetChar: string | null;
  targetKeyCode: string | null;
  targetNeedsShift: boolean;
  category: PracticeCategory;
  onSelectCategory: (cat: PracticeCategory) => void;
  onApplyCustomText: (text: string) => void;
  onReset: () => void;
  t: {
    homeRowCategory: string;
    topRowCategory: string;
    bottomRowCategory: string;
    commonWordsCategory: string;
    numbersCategory: string;
    symbolsCategory: string;
    customCategory: string;
    nextKeyLabel: string;
    pressKeyInstruction: string;
    practiceCompleted: string;
    restartBtn: string;
    customTextTitle: string;
    customTextPlaceholder: string;
    customTextApply: string;
    customTextCancel: string;
    changeTextBtn: string;
  };
}

export default function PracticeArea({
  text,
  userInput,
  hasError,
  isCompleted,
  targetChar,
  targetNeedsShift,
  category,
  onSelectCategory,
  onApplyCustomText,
  onReset,
  t,
}: PracticeAreaProps) {
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Auto scroll so target cursor is always centered
  useLayoutEffect(() => {
    if (cursorRef.current && textContainerRef.current) {
      const cursor = cursorRef.current;
      const container = textContainerRef.current;
      const cursorTop = cursor.offsetTop;
      const cursorHeight = cursor.offsetHeight;
      const containerHeight = container.clientHeight;

      const targetScrollTop = cursorTop - containerHeight / 2 + cursorHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    }
  }, [userInput.length]);

  const categories: { key: PracticeCategory; label: string }[] = [
    { key: 'homeRow', label: t.homeRowCategory },
    { key: 'topRow', label: t.topRowCategory },
    { key: 'bottomRow', label: t.bottomRowCategory },
    { key: 'commonWords', label: t.commonWordsCategory },
    { key: 'numbers', label: t.numbersCategory },
    { key: 'symbols', label: t.symbolsCategory },
    { key: 'custom', label: t.customCategory },
  ];

  // Helper label for the target key
  const formatTargetKeyDisplay = () => {
    if (!targetChar) return null;
    if (targetChar === ' ') return 'ESPACIO';
    if (targetChar === '\n') return 'ENTER ↵';
    if (targetNeedsShift) return `Shift + ${targetChar.toUpperCase()}`;
    return targetChar.toUpperCase();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Category Pills Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-card/40 p-2 rounded-2xl border border-border/80 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                if (cat.key === 'custom') {
                  setIsEditingCustom(true);
                } else {
                  setIsEditingCustom(false);
                  onSelectCategory(cat.key);
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                category === cat.key && !isEditingCustom
                  ? 'bg-primary text-primary-foreground shadow-xs scale-102'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs font-bold gap-1.5 h-8 px-3 rounded-xl hover:bg-muted cursor-pointer"
        >
          <RefreshCw className="size-3.5 text-muted-foreground" />
          <span>{t.restartBtn}</span>
        </Button>
      </div>

      {/* Custom Text Editor or Practice Display */}
      {isEditingCustom ? (
        <CustomTextInput
          onApplyText={(customText) => {
            onApplyCustomText(customText);
            setIsEditingCustom(false);
          }}
          onRandomText={() => {
            setIsEditingCustom(false);
            onSelectCategory('commonWords');
          }}
          title={t.customTextTitle}
          placeholder={t.customTextPlaceholder}
          applyLabel={t.customTextApply}
          randomLabel={t.customCategory}
        />
      ) : (
        <Card
          className={`w-full bg-card border shadow-sm relative overflow-hidden transition-all duration-200 ${
            hasError ? 'border-destructive/60' : isCompleted ? 'border-primary/60' : 'border-border'
          }`}
        >
          {/* Top Interactive Target Guidance Banner */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border/60 text-xs select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <Target className="size-4 text-primary animate-pulse" />
                <span>{t.nextKeyLabel}:</span>
              </span>

              {targetChar ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-mono font-black rounded-lg border shadow-xs transition-all ${
                      hasError
                        ? 'bg-destructive/10 border-destructive/40 text-destructive animate-bounce'
                        : 'bg-primary/10 border-primary/30 text-primary scale-105'
                    }`}
                  >
                    {formatTargetKeyDisplay()}
                  </span>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">
                    ({t.pressKeyInstruction})
                  </span>
                </div>
              ) : isCompleted ? (
                <span className="flex items-center gap-1.5 text-primary font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>{t.practiceCompleted}</span>
                </span>
              ) : null}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingCustom(true)}
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg gap-1.5 cursor-pointer"
            >
              <PenLine className="size-3 text-primary" />
              <span>{t.changeTextBtn}</span>
            </Button>
          </div>

          {/* Main Practice Text Display Area */}
          <CardContent className="p-6">
            <div
              ref={textContainerRef}
              className="max-h-[220px] overflow-y-auto font-mono text-xl sm:text-2xl leading-relaxed tracking-wide select-none outline-none"
            >
              {text.split('').map((char, index) => {
                const isTyped = index < userInput.length;
                const isCurrent = index === userInput.length;
                const charDisplay = char === ' ' ? ' ' : char === '\n' ? '↵\n' : char;

                if (isTyped) {
                  return (
                    <span
                      key={index}
                      className="text-primary font-bold transition-colors duration-100"
                    >
                      {charDisplay}
                    </span>
                  );
                }

                if (isCurrent) {
                  return (
                    <span
                      key={index}
                      ref={cursorRef}
                      className={`relative inline-block rounded px-0.5 font-bold transition-all ${
                        hasError
                          ? 'bg-destructive/20 text-destructive border-b-2 border-destructive animate-pulse'
                          : 'bg-primary/20 text-primary border-b-2 border-primary'
                      }`}
                    >
                      {char === ' ' ? '␣' : charDisplay}
                    </span>
                  );
                }

                return (
                  <span key={index} className="text-muted-foreground/50 transition-colors duration-100">
                    {charDisplay}
                  </span>
                );
              })}
            </div>

            {/* Completion Banner */}
            {isCompleted && (
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="size-5 text-primary animate-spin" />
                  <span>{t.practiceCompleted}</span>
                </div>
                <Button
                  size="sm"
                  onClick={onReset}
                  className="font-bold text-xs rounded-lg px-4 cursor-pointer gap-2"
                >
                  <RefreshCw className="size-3.5" />
                  <span>{t.restartBtn}</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
