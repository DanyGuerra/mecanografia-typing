'use client';

import React, { useState, useRef, useLayoutEffect, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Play, CheckCircle2, AlertCircle, X, Text } from 'lucide-react';

interface TypingAreaProps {
  text: string;
  userInput: string;
  hasError: boolean;
  errorKey?: number;
  onApplyCustomText: (text: string) => void;
  customTextPlaceholder: string;
  customTextApply: string;
  customTextCancel: string;
  changeTextBtn: string;
  editTextTitle: string;
  enterTextPrompt: string;
  typingErrorAlert: string;
  progressLabel: string;
  charCountLabel: string;
  pressCtrlEnterHint: string;
}

interface CharItemProps {
  char: string;
  isTyped: boolean;
  isCurrent: boolean;
  isCorrect: boolean;
  hasError: boolean;
  innerRef?: React.Ref<HTMLSpanElement>;
}

const CharItem = memo(function CharItem({
  char,
  isTyped,
  isCurrent,
  isCorrect,
  hasError,
  innerRef,
}: CharItemProps) {
  let charClass = "text-muted-foreground/50";
  const isSpace = char === ' ';
  const isNewline = char === '\n';

  if (isTyped) {
    charClass = isCorrect 
      ? "text-foreground font-semibold" 
      : "text-destructive bg-destructive/15 rounded-xs px-[1px]";
  } else if (isCurrent) {
    charClass = "text-foreground font-semibold";
  }

  return (
    <React.Fragment>
      <span 
        ref={innerRef}
        className={`relative ${charClass}`}
      >
        {isCurrent && (
          <span
            className={`absolute -left-[1px] top-[15%] h-[70%] w-[2px] inline-block pointer-events-none cursor-blink ${
              hasError ? 'bg-destructive' : 'bg-primary'
            }`}
          />
        )}
        {isNewline ? (
          <span className="inline-flex items-center text-[0.65em] font-sans border border-current/40 rounded px-1 py-0.5 mx-0.5 align-middle opacity-70 select-none">
            ↵
          </span>
        ) : isSpace ? (
          ' '
        ) : (
          char
        )}
      </span>
      {isNewline && <br />}
    </React.Fragment>
  );
});

function TypingArea({
  text,
  userInput,
  hasError,
  errorKey = 0,
  onApplyCustomText,
  customTextPlaceholder,
  customTextApply,
  customTextCancel,
  changeTextBtn,
  editTextTitle,
  enterTextPrompt,
  typingErrorAlert,
  progressLabel,
  charCountLabel,
  pressCtrlEnterHint,
}: TypingAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const isEditingMode = isEditing || text.length === 0;
  const progressPercent = text.length > 0 ? Math.min(100, Math.round((userInput.length / text.length) * 100)) : 0;

  // Restart shake animation on mistake WITHOUT remounting component DOM
  useEffect(() => {
    if (errorKey > 0 && cardRef.current) {
      const card = cardRef.current;
      card.classList.remove('shake-error');
      void card.offsetWidth; // Force reflow
      card.classList.add('shake-error');
    }
  }, [errorKey]);

  // Smooth auto-scroll container so current cursor line is always visible/centered
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

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = customInputText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
    if (cleanText.length > 0) {
      onApplyCustomText(cleanText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCustomSubmit(e);
    }
  };

  return (
    <Card 
      ref={cardRef}
      className={`w-full bg-card border border-border shadow-sm relative overflow-hidden transition-all duration-200 ${
        hasError ? 'border-destructive/60' : ''
      }`}
    >
      {/* Progress Bar Line */}
      {!isEditingMode && (
        <div 
          className="h-1 bg-primary transition-all duration-150 absolute top-0 left-0" 
          style={{ width: `${progressPercent}%` }}
        />
      )}

      {/* Header Toolbar inside Typing Area */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 border-b border-border/60 text-xs text-muted-foreground select-none">
        <div className="flex items-center gap-2">
          {isEditingMode ? (
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <PenLine className="size-4 text-primary" />
              <span>{text.length === 0 ? enterTextPrompt : editTextTitle}</span>
            </span>
          ) : hasError ? (
            <span className="flex items-center gap-1 text-destructive font-medium animate-pulse">
              <AlertCircle className="size-3.5" />
              <span>{typingErrorAlert}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-3.5 text-primary" />
              <span>{progressLabel}: {progressPercent}%</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isEditingMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCustomInputText(text);
                setIsEditing(true);
              }}
              className="h-7 px-2.5 text-xs gap-1.5 font-medium"
            >
              <PenLine className="size-3.5 text-primary" />
              <span>{changeTextBtn}</span>
            </Button>
          ) : (
            text.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                title={customTextCancel}
              >
                <X className="size-4" />
              </Button>
            )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <CardContent className="p-4 sm:p-5">
        {isEditingMode ? (
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <textarea
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={customTextPlaceholder}
                rows={3}
                autoFocus
                className="w-full p-3.5 rounded-md border border-input bg-background font-mono text-base sm:text-lg leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors max-h-[160px]"
              />
              <div className="absolute right-3 bottom-3 text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <Text className="size-3.5" />
                <span>{customInputText.length} {charCountLabel}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {pressCtrlEnterHint}
              </span>

              <div className="flex items-center gap-2 ml-auto">
                {text.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    {customTextCancel}
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={customInputText.trim().length === 0}
                  className="gap-2"
                >
                  <Play className="size-3.5 fill-current" />
                  <span>{customTextApply}</span>
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div 
            ref={textContainerRef}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            className="font-mono text-xl sm:text-2xl leading-[2.5rem] sm:leading-[2.8rem] tracking-wide break-words whitespace-pre-wrap select-none max-h-[125px] sm:max-h-[145px] overflow-hidden pr-1"
          >
            {text.split('').map((char, index) => {
              const isTyped = index < userInput.length;
              const isCurrent = index === userInput.length;
              const isCorrect = isTyped && userInput[index] === char;

              return (
                <CharItem
                  key={index}
                  char={char}
                  isTyped={isTyped}
                  isCurrent={isCurrent}
                  isCorrect={isCorrect}
                  hasError={hasError}
                  innerRef={isCurrent ? cursorRef : undefined}
                />
              );
            })}
            {userInput.length === text.length && text.length > 0 && (
              <span ref={cursorRef} className="relative text-foreground">
                <span className="absolute -left-[1px] top-[15%] h-[70%] w-[2px] inline-block pointer-events-none cursor-blink bg-primary" />
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(TypingArea);
