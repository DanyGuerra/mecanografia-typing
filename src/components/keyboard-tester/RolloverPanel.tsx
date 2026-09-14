'use client';

import React, { memo } from 'react';
import { Zap } from 'lucide-react';
import { KeyboardTesterTranslations } from './types';

interface RolloverPanelProps {
  currentlyPressedKeys: Set<string>;
  peakRollover: number;
  t: KeyboardTesterTranslations;
}

function RolloverPanel({
  currentlyPressedKeys,
  peakRollover,
  t,
}: RolloverPanelProps) {
  return (
    <div className="lg:col-span-3 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-colors min-h-[148px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Zap className="size-3.5 text-primary animate-pulse" />
          {t.simultaneousKeysLabel}
        </span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/70">
          {t.maxRolloverLabel}: {peakRollover}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 my-2">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-primary font-mono">
          {currentlyPressedKeys.size}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {currentlyPressedKeys.size === 1
            ? (t.activeKeySingle || 'tecla activa')
            : (t.activeKeysMultiple || 'teclas activas')}
        </span>
      </div>

      {/* Active Keys Pill Strip */}
      <div className="flex items-center gap-1 overflow-x-auto min-h-[22px]">
        {currentlyPressedKeys.size > 0 ? (
          Array.from(currentlyPressedKeys).map((code) => (
            <span
              key={code}
              className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-primary text-primary-foreground shadow-2xs shrink-0 animate-in fade-in duration-100"
            >
              {code.replace('Key', '')}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-muted-foreground/70 italic truncate">
            Anti-ghosting listo (NKRO)
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(RolloverPanel);
