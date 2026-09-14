'use client';

import React, { memo } from 'react';
import TestedKeysPanel from './TestedKeysPanel';
import RolloverPanel from './RolloverPanel';
import LastKeyPanel from './LastKeyPanel';
import {
  LastKeyInfo,
  KeyboardTesterTranslations,
} from './types';

interface KeyboardTelemetryDashboardProps {
  testedCount: number;
  totalKeysInCurrentLayout: number;
  progressPercent: number;
  currentlyPressedKeys: Set<string>;
  peakRollover: number;
  lastKey: LastKeyInfo | null;
  keyHistory: string[];
  t: KeyboardTesterTranslations;
}

function KeyboardTelemetryDashboard({
  testedCount,
  totalKeysInCurrentLayout,
  progressPercent,
  currentlyPressedKeys,
  peakRollover,
  lastKey,
  keyHistory,
  t,
}: KeyboardTelemetryDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 w-full">
      {/* Panel 1: Progress & Coverage */}
      <TestedKeysPanel
        testedCount={testedCount}
        totalKeysInCurrentLayout={totalKeysInCurrentLayout}
        progressPercent={progressPercent}
        t={t}
      />

      {/* Panel 2: Anti-Ghosting & Rollover */}
      <RolloverPanel
        currentlyPressedKeys={currentlyPressedKeys}
        peakRollover={peakRollover}
        t={t}
      />

      {/* Panel 3: Last Key Pressed Hero Inspector */}
      <LastKeyPanel
        lastKey={lastKey}
        keyHistory={keyHistory}
        t={t}
      />
    </div>
  );
}

export default memo(KeyboardTelemetryDashboard);
