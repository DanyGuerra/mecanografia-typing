'use client';

import React, { memo, useState, useCallback } from 'react';

interface TouchKeyProps {
  code: string;
  label: string;
  shiftLabel?: string;
  flexGrow?: number;
  widthUnit?: number;
  isPressed: boolean;
  isTested?: boolean;
  isTarget?: boolean;
  isShiftActive?: boolean;
  onKeyClick?: (code: string, label: string, shiftLabel?: string) => void;
}

function TouchKey({
  code,
  label,
  shiftLabel,
  flexGrow = 1,
  widthUnit = 1,
  isPressed,
  isTested = false,
  isTarget = false,
  isShiftActive = false,
  onKeyClick,
}: TouchKeyProps) {
  const [isLocallyPressed, setIsLocallyPressed] = useState(false);

  const effectivePressed = isPressed || isLocallyPressed;

  const isSpecialKey = [
    'ShiftLeft',
    'ShiftRight',
    'Enter',
    'Backspace',
    'SymbolMode',
    'SymbolPage2',
  ].includes(code);

  const isShiftKey = code === 'ShiftLeft' || code === 'ShiftRight';

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsLocallyPressed(true);
      if (onKeyClick) {
        onKeyClick(code, label, shiftLabel);
      }
    },
    [code, label, shiftLabel, onKeyClick]
  );

  const handlePointerUp = useCallback(() => {
    setIsLocallyPressed(false);
  }, []);

  const handlePointerCancel = useCallback(() => {
    setIsLocallyPressed(false);
  }, []);

  // Base background and text classes
  let keyStyleClasses = '';

  if (effectivePressed) {
    keyStyleClasses = '!bg-primary !text-primary-foreground !shadow-none translate-y-[1px]';
  } else if (isTested) {
    keyStyleClasses = '!bg-primary !text-primary-foreground font-bold shadow-xs';
  } else if (isTarget) {
    keyStyleClasses =
      'ring-2 ring-primary ring-offset-1 ring-offset-transparent font-bold !bg-primary/25 dark:!bg-primary/35 !text-primary animate-pulse';
  } else if (isShiftKey && isShiftActive) {
    keyStyleClasses =
      'bg-white dark:bg-zinc-100 text-zinc-900 dark:text-zinc-900 shadow-[0_1.5px_0_rgba(0,0,0,0.3)] ring-1 ring-primary/50';
  } else if (isSpecialKey) {
    keyStyleClasses =
      'bg-[#abb3bf] dark:bg-[#2c2c2e] text-zinc-900 dark:text-zinc-100 shadow-[0_1.2px_0_rgba(0,0,0,0.28)] active:bg-[#9aa3b0] dark:active:bg-[#38383c]';
  } else {
    // Standard alphanumeric keys
    keyStyleClasses =
      'bg-white dark:bg-[#464648] text-zinc-900 dark:text-zinc-50 shadow-[0_1.2px_0_rgba(0,0,0,0.28)] active:bg-zinc-200 dark:active:bg-[#58585c]';
  }

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label || code}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      style={{
        flexGrow,
        flexShrink: flexGrow,
        flexBasis: `${Math.round(40 * widthUnit)}px`,
      }}
      className={`
        relative select-none min-w-0 touch-manipulation cursor-pointer
        h-[43px] xs:h-[45px] sm:h-[50px] md:h-[54px]
        rounded-[5px] sm:rounded-[7px]
        flex items-center justify-center
        transition-all duration-75 active:scale-[0.97]
        ${keyStyleClasses}
      `}
    >
      {/* Superscript number hint (like Gboard / Samsung keyboard) */}
      {shiftLabel && !isSpecialKey && (
        <span className="absolute top-[2px] right-[4px] sm:right-[6px] text-[8px] sm:text-[10px] text-zinc-400 dark:text-zinc-400 font-medium pointer-events-none">
          {shiftLabel}
        </span>
      )}

      {/* Render icons for special keys */}
      {isShiftKey ? (
        <svg
          viewBox="0 0 24 24"
          className="size-4 sm:size-5 pointer-events-none"
          fill={isShiftActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isShiftActive ? '2.5' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 7h-4v10h-6v-10h-4z" />
        </svg>
      ) : code === 'Backspace' ? (
        <svg
          viewBox="0 0 24 24"
          className="size-4.5 sm:size-5.5 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
          <line x1="18" y1="9" x2="12" y2="15" />
          <line x1="12" y1="9" x2="18" y2="15" />
        </svg>
      ) : code === 'Enter' ? (
        <svg
          viewBox="0 0 24 24"
          className="size-4 sm:size-5 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 10 4 15 9 20" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
      ) : code === 'Space' ? (
        <span className={`text-[11px] xs:text-[12px] sm:text-[14px] font-medium tracking-wide pointer-events-none ${isTarget ? 'opacity-100 font-bold' : 'opacity-75'}`}>
          {label}
        </span>
      ) : isSpecialKey ? (
        <span className="text-[12px] xs:text-[13px] sm:text-[15px] font-semibold tracking-wide pointer-events-none">
          {label}
        </span>
      ) : (
        <span className="text-[17px] xs:text-[18px] sm:text-[21px] md:text-[23px] font-normal sm:font-medium pointer-events-none">
          {label}
        </span>
      )}
    </button>
  );
}

export default memo(TouchKey);
