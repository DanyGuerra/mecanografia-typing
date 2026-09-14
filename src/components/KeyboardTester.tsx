'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  KeyboardControlsToolbar,
  KeyboardVisualizer,
  KeyboardTelemetryDashboard,
  LayoutMode,
  KeyboardLanguage,
  OsMode,
  LastKeyInfo,
  KeyboardTesterProps,
  PREVENT_SHORTCUT_CODES,
  getSpanishLayout,
  getEnglishLayout,
  getSpanishLayout65,
  getEnglishLayout65,
  getTotalKeysCount,
} from './keyboard-tester';

export type { KeyboardTesterProps } from './keyboard-tester';

export default function KeyboardTester({
  initialLanguage = 'es',
  soundEnabled,
  onSoundToggle,
  onPlaySound,
  t,
}: KeyboardTesterProps) {
  // Layout Options: 'tkl' | 'full' | 'compact' (65%) | 'compact60' (60%)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('tkl');
  const [prevInitialLanguage, setPrevInitialLanguage] = useState(initialLanguage);
  const [keyboardLanguage, setKeyboardLanguage] = useState<KeyboardLanguage>(initialLanguage);
  const [osMode, setOsMode] = useState<OsMode>('mac');
  const [preventShortcuts, setPreventShortcuts] = useState<boolean>(true);

  // Sync state during render when prop changes
  if (prevInitialLanguage !== initialLanguage) {
    setPrevInitialLanguage(initialLanguage);
    setKeyboardLanguage(initialLanguage);
  }

  // Keyboard Testing State
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [currentlyPressedKeys, setCurrentlyPressedKeys] = useState<Set<string>>(new Set());
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [numLockActive, setNumLockActive] = useState<boolean>(true);
  const [scrollLockActive, setScrollLockActive] = useState<boolean>(false);

  // Telemetry & NKRO Stats
  const [peakRollover, setPeakRollover] = useState<number>(0);
  const [lastKey, setLastKey] = useState<LastKeyInfo | null>(null);
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  // Play audio for keypress
  const triggerAudio = useCallback(
    (code: string) => {
      if (!soundEnabled || !onPlaySound) return;
      if (code === 'Space') onPlaySound('space');
      else if (code === 'Backspace') onPlaySound('backspace');
      else if (code === 'Enter' || code === 'NumpadEnter') onPlaySound('enter');
      else onPlaySound('standard');
    },
    [soundEnabled, onPlaySound]
  );

  // Handle Key Down
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const code = e.code;
      if (!code) return;

      if (preventShortcuts && PREVENT_SHORTCUT_CODES.has(code)) {
        e.preventDefault();
      }

      // Update lock statuses
      if (typeof e.getModifierState === 'function') {
        setCapsLockActive(e.getModifierState('CapsLock'));
        setNumLockActive(e.getModifierState('NumLock'));
        setScrollLockActive(e.getModifierState('ScrollLock'));
      }

      // Record audio
      triggerAudio(code);

      // Add to testedKeys (permanent paint in accent color)
      setTestedKeys((prev) => {
        if (prev.has(code)) return prev;
        const next = new Set(prev);
        next.add(code);
        return next;
      });

      // Update currently active pressed keys
      setCurrentlyPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        setPeakRollover((peak) => Math.max(peak, next.size));
        return next;
      });

      // Record telemetry
      setLastKey({
        code: e.code,
        key: e.key,
        keyCode: e.keyCode,
        location: e.location,
        timestamp: Date.now(),
      });

      // Key history
      setKeyHistory((prev) => [e.code, ...prev.slice(0, 9)]);
    },
    [preventShortcuts, triggerAudio]
  );

  // Handle Key Up
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const code = e.code;
    if (!code) return;

    if (typeof e.getModifierState === 'function') {
      setCapsLockActive(e.getModifierState('CapsLock'));
      setNumLockActive(e.getModifierState('NumLock'));
      setScrollLockActive(e.getModifierState('ScrollLock'));
    }

    setCurrentlyPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  }, []);

  // Handle Window Blur: clear currently pressed keys so none stay stuck physically down
  const handleBlur = useCallback(() => {
    setCurrentlyPressedKeys(new Set());
  }, []);

  // Global window keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  // Reset Test
  const handleReset = useCallback(() => {
    setTestedKeys(new Set());
    setCurrentlyPressedKeys(new Set());
    setPeakRollover(0);
    setLastKey(null);
    setKeyHistory([]);
  }, []);

  // Current Alphanumeric Layout Matrix
  const currentAlphanumericLayout = useMemo(() => {
    if (layoutMode === 'compact') {
      return keyboardLanguage === 'es' ? getSpanishLayout65(osMode) : getEnglishLayout65(osMode);
    }
    return keyboardLanguage === 'es' ? getSpanishLayout(osMode) : getEnglishLayout(osMode);
  }, [layoutMode, keyboardLanguage, osMode]);

  // Calculate total keys in currently visible layout
  const totalKeysInCurrentLayout = useMemo(
    () => getTotalKeysCount(layoutMode, keyboardLanguage),
    [layoutMode, keyboardLanguage]
  );

  const testedCount = testedKeys.size;
  const progressPercent = Math.min(
    100,
    Math.round((testedCount / Math.max(1, totalKeysInCurrentLayout)) * 100)
  );

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-6xl mx-auto">
      {/* 1. Controls Toolbar */}
      <KeyboardControlsToolbar
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        keyboardLanguage={keyboardLanguage}
        onKeyboardLanguageChange={setKeyboardLanguage}
        osMode={osMode}
        onOsModeChange={setOsMode}
        preventShortcuts={preventShortcuts}
        onPreventShortcutsToggle={() => setPreventShortcuts(!preventShortcuts)}
        soundEnabled={soundEnabled}
        onSoundToggle={onSoundToggle}
        onReset={handleReset}
        t={t}
      />

      {/* 2. Visual Mechanical Keyboard */}
      <KeyboardVisualizer
        layoutMode={layoutMode}
        keyboardLanguage={keyboardLanguage}
        currentAlphanumericLayout={currentAlphanumericLayout}
        currentlyPressedKeys={currentlyPressedKeys}
        testedKeys={testedKeys}
        capsLockActive={capsLockActive}
        numLockActive={numLockActive}
        scrollLockActive={scrollLockActive}
      />

      {/* 3. Telemetry Dashboard (Coverage, Anti-Ghosting, Last Key Inspector) */}
      <KeyboardTelemetryDashboard
        testedCount={testedCount}
        totalKeysInCurrentLayout={totalKeysInCurrentLayout}
        progressPercent={progressPercent}
        currentlyPressedKeys={currentlyPressedKeys}
        peakRollover={peakRollover}
        lastKey={lastKey}
        keyHistory={keyHistory}
        t={t}
      />
    </div>
  );
}
