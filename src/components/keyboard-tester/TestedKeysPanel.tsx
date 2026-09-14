'use client';

import React, { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { KeyboardTesterTranslations } from './types';

interface TestedKeysPanelProps {
  testedCount: number;
  totalKeysInCurrentLayout: number;
  progressPercent: number;
  t: KeyboardTesterTranslations;
}

function TestedKeysPanel({
  testedCount,
  totalKeysInCurrentLayout,
  progressPercent,
  t,
}: TestedKeysPanelProps) {
  return (
    <div className="lg:col-span-3 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-colors min-h-[148px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-primary" />
          {t.testedKeysLabel}
        </span>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
          {progressPercent}%
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 my-2">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">
          {testedCount}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          / {totalKeysInCurrentLayout}
        </span>
      </div>

      <div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 shadow-[0_0_8px_var(--primary)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] font-medium text-muted-foreground mt-1.5 truncate">
          {testedCount >= totalKeysInCurrentLayout
            ? (t.allKeysTested || '¡100% probado!')
            : `${totalKeysInCurrentLayout - testedCount} teclas restantes`}
        </p>
      </div>
    </div>
  );
}

export default memo(TestedKeysPanel);
