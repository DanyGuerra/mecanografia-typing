'use client';

import React, { memo } from 'react';
import { Activity, History } from 'lucide-react';
import {
  LastKeyInfo,
  KeyboardTesterTranslations,
  formatKeyDisplay,
  formatLocation,
} from './types';

interface LastKeyPanelProps {
  lastKey: LastKeyInfo | null;
  keyHistory: string[];
  t: KeyboardTesterTranslations;
}

function formatHistoryBadge(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return 'Num ' + code.slice(6);
  switch (code) {
    case 'ArrowUp': return '↑';
    case 'ArrowDown': return '↓';
    case 'ArrowLeft': return '←';
    case 'ArrowRight': return '→';
    case 'Backspace': return '⌫';
    case 'Enter': return '↵';
    case 'Tab': return '⇥';
    case 'Escape': return 'Esc';
    case 'Space': return 'Space';
    case 'Delete': return 'Del';
    case 'PageUp': return 'PgUp';
    case 'PageDown': return 'PgDn';
    case 'CapsLock': return 'Caps';
    case 'ShiftLeft': return 'L-Shift';
    case 'ShiftRight': return 'R-Shift';
    case 'ControlLeft': return 'L-Ctrl';
    case 'ControlRight': return 'R-Ctrl';
    case 'AltLeft': return 'L-Alt';
    case 'AltRight': return 'AltGr';
    case 'MetaLeft': return 'Cmd';
    case 'MetaRight': return 'Cmd';
    default: return code;
  }
}

function LastKeyPanel({
  lastKey,
  keyHistory,
  t,
}: LastKeyPanelProps) {
  const displayLabel = lastKey ? formatKeyDisplay(lastKey.key, lastKey.code) : '';

  return (
    <div className="md:col-span-2 lg:col-span-6 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-primary/50 transition-all min-h-[148px]">
      {/* 1. Header: Title & Event status */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex size-2 items-center justify-center">
            <span
              className={`absolute inline-flex h-full w-full rounded-full bg-primary ${
                lastKey ? 'animate-ping opacity-75' : 'opacity-30'
              }`}
            />
            <span
              className={`relative inline-flex size-1.5 rounded-full ${
                lastKey ? 'bg-primary' : 'bg-muted-foreground/40'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="size-3.5 text-primary" />
            {t.lastPressedLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lastKey ? (
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
              EVENT CAPTURED
            </span>
          ) : (
            <span className="text-[10px] font-medium text-muted-foreground/70 italic">
              {t.readyToTest}
            </span>
          )}
        </div>
      </div>

      {/* 2. Middle Section: Key Info Hero & Metadata (Full Width - Zero Overlap) */}
      <div className="flex items-center gap-3.5 py-2 my-auto min-w-0">
        {/* Keycap Hero Box */}
        <div
          className={`relative flex items-center justify-center w-[76px] sm:w-[84px] h-[52px] rounded-xl shrink-0 transition-all duration-150 ${
            lastKey
              ? 'bg-gradient-to-b from-card via-muted/60 to-muted border-2 border-primary/50 shadow-[0_6px_16px_rgba(0,0,0,0.12),0_0_12px_var(--primary)/20]'
              : 'bg-muted/30 border border-dashed border-border/80'
          }`}
        >
          {lastKey ? (
            <>
              <span
                className={`font-mono font-black text-foreground tracking-tight drop-shadow-xs truncate max-w-[70px] sm:max-w-[78px] px-1 text-center ${
                  displayLabel.length <= 2
                    ? 'text-xl'
                    : displayLabel.length <= 5
                    ? 'text-sm font-extrabold'
                    : 'text-[10.5px] font-extrabold leading-tight'
                }`}
              >
                {displayLabel}
              </span>
              <div className="absolute inset-x-1 top-0.5 h-[1.5px] rounded-t-lg bg-white/25 pointer-events-none" />
            </>
          ) : (
            <span className="font-mono text-muted-foreground/30 font-bold text-lg select-none">
              —
            </span>
          )}
        </div>

        {/* Key Metadata Badges */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {/* Row 1: Code badge + char representation */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span
              className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md shadow-2xs truncate transition-colors ${
                lastKey
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground/50 border border-border/40 font-normal'
              }`}
            >
              {lastKey ? lastKey.code : 'esperando...'}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              char:{' '}
              <span className="text-foreground font-semibold">
                {lastKey ? (lastKey.key === ' ' ? '"Space"' : `"${lastKey.key}"`) : '—'}
              </span>
            </span>
          </div>

          {/* Row 2: Metric Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-muted text-muted-foreground border border-border">
              keyCode: <span className="text-foreground font-bold">{lastKey ? lastKey.keyCode : '—'}</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-muted text-muted-foreground border border-border">
              loc: <span className="text-foreground font-bold">{lastKey ? formatLocation(lastKey.location) : '—'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Dedicated History Ribbon Tape */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50 mt-1 min-w-0">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 shrink-0">
          <History className="size-3 text-primary/70" />
          {t.historyLabel}:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 flex-1 py-0.5" style={{ scrollbarWidth: 'none' }}>
          {keyHistory.length > 0 ? (
            keyHistory.slice(0, 8).map((code, idx) => (
              <span
                key={`${code}-${idx}`}
                className={`px-2 py-0.5 text-[9.5px] font-mono rounded-md shrink-0 transition-all ${
                  idx === 0
                    ? 'bg-primary/20 text-primary border border-primary/40 font-bold shadow-2xs'
                    : 'bg-muted/80 text-muted-foreground border border-border/60'
                }`}
                style={{ opacity: Math.max(0.4, 1 - idx * 0.08) }}
                title={code}
              >
                {formatHistoryBadge(code)}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground/40 font-mono italic">
              —
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(LastKeyPanel);

