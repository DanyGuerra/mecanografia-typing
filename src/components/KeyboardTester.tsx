'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Key from './Key';
import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Laptop,
  Monitor,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Activity,
  Sparkles,
} from 'lucide-react';
import { type AccentColorKey } from '@/hooks/useAccentColor';

interface KeyConfig {
  code: string;
  label: string;
  shiftLabel?: string;
  widthUnit?: number;
  flexGrow?: number;
}

interface LastKeyInfo {
  code: string;
  key: string;
  keyCode: number;
  location: number;
  timestamp: number;
}

interface KeyboardTesterProps {
  initialLanguage?: 'es' | 'en';
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onPlaySound?: (type: 'standard' | 'space' | 'backspace' | 'enter') => void;
  accentColor?: AccentColorKey;
  t: {
    keyboardTestTitle: string;
    keyboardTestSubtitle: string;
    testedKeysLabel: string;
    simultaneousKeysLabel: string;
    maxRolloverLabel: string;
    lastPressedLabel: string;
    resetKeyboardBtn: string;
    preventShortcutsLabel: string;
    historyLabel: string;
    layoutCompact: string;
    layoutCompact60?: string;
    layoutTkl: string;
    layoutFull: string;
    readyToTest: string;
    allKeysTested: string;
    keyboardTestHint: string;
    activeKeySingle?: string;
    activeKeysMultiple?: string;
    keyboardLangEs?: string;
    keyboardLangEn?: string;
  };
}

function formatKeyDisplay(key: string, code: string): string {
  if (code === 'Space' || key === ' ') return 'Space ␣';
  if (code === 'Enter' || code === 'NumpadEnter') return 'Enter ↵';
  if (code === 'Backspace') return 'Backspace ⌫';
  if (code === 'Tab') return 'Tab ⇥';
  if (code === 'Escape') return 'Esc';
  if (code === 'CapsLock') return 'CapsLock ⇪';
  if (code === 'ShiftLeft' || code === 'ShiftRight') return 'Shift ⇧';
  if (code === 'ControlLeft' || code === 'ControlRight') return 'Control ⌃';
  if (code === 'AltLeft' || code === 'AltRight') return 'Option ⌥';
  if (code === 'MetaLeft' || code === 'MetaRight') return 'Command ⌘';
  if (code === 'ArrowUp') return 'Up ↑';
  if (code === 'ArrowDown') return 'Down ↓';
  if (code === 'ArrowLeft') return 'Left ←';
  if (code === 'ArrowRight') return 'Right →';
  if (key && key.length === 1) return key.toUpperCase();
  return key || code.replace('Key', '');
}

function formatLocation(location: number): string {
  switch (location) {
    case 1:
      return 'Left';
    case 2:
      return 'Right';
    case 3:
      return 'Numpad';
    default:
      return 'Standard';
  }
}

export default function KeyboardTester({
  initialLanguage = 'es',
  soundEnabled,
  onSoundToggle,
  onPlaySound,
  t,
}: KeyboardTesterProps) {
  // Layout Options: 'tkl' | 'full' | 'compact' (65%) | 'compact60' (60%)
  const [layoutMode, setLayoutMode] = useState<'tkl' | 'full' | 'compact' | 'compact60'>('tkl');
  const [prevInitialLanguage, setPrevInitialLanguage] = useState(initialLanguage);
  const [keyboardLanguage, setKeyboardLanguage] = useState<'es' | 'en'>(initialLanguage);
  const [osMode, setOsMode] = useState<'mac' | 'windows'>('mac');
  const [preventShortcuts, setPreventShortcuts] = useState<boolean>(true);

  // Sync state during render when prop changes (React recommended pattern, avoiding cascading renders)
  if (prevInitialLanguage !== initialLanguage) {
    setPrevInitialLanguage(initialLanguage);
    setKeyboardLanguage(initialLanguage);
  }

  // Keyboard Testing State
  // testedKeys: keys that stay permanently painted in accent color
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  // currentlyPressedKeys: keys physically down at this exact millisecond
  const [currentlyPressedKeys, setCurrentlyPressedKeys] = useState<Set<string>>(new Set());
  // CapsLock / NumLock / ScrollLock active states
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [numLockActive, setNumLockActive] = useState<boolean>(true);
  const [scrollLockActive, setScrollLockActive] = useState<boolean>(false);

  // Telemetry & NKRO Stats
  const [peakRollover, setPeakRollover] = useState<number>(0);
  const [lastKey, setLastKey] = useState<LastKeyInfo | null>(null);
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  // Prevent browser shortcuts set
  const preventCodes = useMemo(
    () =>
      new Set([
        'Tab',
        'Space',
        'Backspace',
        'AltLeft',
        'AltRight',
        'ContextMenu',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        'Insert',
      ]),
    []
  );

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

      if (preventShortcuts && preventCodes.has(code)) {
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
    [preventShortcuts, preventCodes, triggerAudio]
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

  /* =========================================================
     LAYOUT DEFINITIONS
     ========================================================= */

  // Function Row
  const functionRow: KeyConfig[] = useMemo(
    () => [
      { code: 'Escape', label: 'Esc', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F1', label: 'F1', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F2', label: 'F2', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F3', label: 'F3', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F4', label: 'F4', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F5', label: 'F5', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F6', label: 'F6', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F7', label: 'F7', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F8', label: 'F8', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F9', label: 'F9', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F10', label: 'F10', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F11', label: 'F11', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'F12', label: 'F12', widthUnit: 1.0, flexGrow: 1.0 },
    ],
    []
  );

  // F-Row Nav Keys (PrtSc, ScrLk, Pause)
  const fRowNavKeys: KeyConfig[] = useMemo(
    () => [
      { code: 'PrintScreen', label: 'PrtSc', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'ScrollLock', label: 'ScrLk', widthUnit: 1.0, flexGrow: 1.0 },
      { code: 'Pause', label: 'Pause', widthUnit: 1.0, flexGrow: 1.0 },
    ],
    []
  );

  // Main Spanish 60% Layout
  const mainSpanishLayout: KeyConfig[][] = useMemo(
    () => [
      [
        { code: 'Backquote', label: 'º', shiftLabel: 'ª' },
        { code: 'Digit1', label: '1', shiftLabel: '!' },
        { code: 'Digit2', label: '2', shiftLabel: '"' },
        { code: 'Digit3', label: '3', shiftLabel: '·' },
        { code: 'Digit4', label: '4', shiftLabel: '$' },
        { code: 'Digit5', label: '5', shiftLabel: '%' },
        { code: 'Digit6', label: '6', shiftLabel: '&' },
        { code: 'Digit7', label: '7', shiftLabel: '/' },
        { code: 'Digit8', label: '8', shiftLabel: '(' },
        { code: 'Digit9', label: '9', shiftLabel: ')' },
        { code: 'Digit0', label: '0', shiftLabel: '=' },
        { code: 'Minus', label: "'", shiftLabel: '?' },
        { code: 'Equal', label: '¡', shiftLabel: '¿' },
        { code: 'Backspace', label: 'Backspace', widthUnit: 2.0, flexGrow: 2.0 },
      ],
      [
        { code: 'Tab', label: 'Tab', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'KeyQ', label: 'Q' },
        { code: 'KeyW', label: 'W' },
        { code: 'KeyE', label: 'E' },
        { code: 'KeyR', label: 'R' },
        { code: 'KeyT', label: 'T' },
        { code: 'KeyY', label: 'Y' },
        { code: 'KeyU', label: 'U' },
        { code: 'KeyI', label: 'I' },
        { code: 'KeyO', label: 'O' },
        { code: 'KeyP', label: 'P' },
        { code: 'BracketLeft', label: '`', shiftLabel: '^' },
        { code: 'BracketRight', label: '+', shiftLabel: '*' },
        { code: 'Backslash', label: 'ç', shiftLabel: 'Ç', widthUnit: 1.5, flexGrow: 1.5 },
      ],
      [
        { code: 'CapsLock', label: 'CapsLock', widthUnit: 1.8, flexGrow: 1.8 },
        { code: 'KeyA', label: 'A' },
        { code: 'KeyS', label: 'S' },
        { code: 'KeyD', label: 'D' },
        { code: 'KeyF', label: 'F' },
        { code: 'KeyG', label: 'G' },
        { code: 'KeyH', label: 'H' },
        { code: 'KeyJ', label: 'J' },
        { code: 'KeyK', label: 'K' },
        { code: 'KeyL', label: 'L' },
        { code: 'Semicolon', label: 'Ñ' },
        { code: 'Quote', label: '´', shiftLabel: '¨' },
        { code: 'Enter', label: 'Enter', widthUnit: 2.2, flexGrow: 2.2 },
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'IntlBackslash', label: '<', shiftLabel: '>' },
        { code: 'KeyZ', label: 'Z' },
        { code: 'KeyX', label: 'X' },
        { code: 'KeyC', label: 'C' },
        { code: 'KeyV', label: 'V' },
        { code: 'KeyB', label: 'B' },
        { code: 'KeyN', label: 'N' },
        { code: 'KeyM', label: 'M' },
        { code: 'Comma', label: ',', shiftLabel: ';' },
        { code: 'Period', label: '.', shiftLabel: ':' },
        { code: 'Slash', label: '-', shiftLabel: '_' },
        { code: 'ShiftRight', label: 'Shift', widthUnit: 2.7, flexGrow: 2.7 },
      ],
      [
        {
          code: 'ControlLeft',
          label: osMode === 'mac' ? '⌃ Control' : 'Ctrl',
          widthUnit: 1.4,
          flexGrow: 1.4,
        },
        {
          code: 'MetaLeft',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 1.4,
          flexGrow: 1.4,
        },
        {
          code: 'AltLeft',
          label: osMode === 'mac' ? '⌥ Option' : 'Alt',
          widthUnit: 1.4,
          flexGrow: 1.4,
        },
        { code: 'Space', label: ' ', widthUnit: 6.6, flexGrow: 6.6 },
        {
          code: 'AltRight',
          label: osMode === 'mac' ? '⌥ Option' : 'AltGr',
          widthUnit: 2.1,
          flexGrow: 2.1,
        },
        {
          code: 'MetaRight',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 2.1,
          flexGrow: 2.1,
        },
      ],
    ],
    [osMode]
  );

  // Main English (US ANSI) 60% Layout
  const mainEnglishLayout: KeyConfig[][] = useMemo(
    () => [
      [
        { code: 'Backquote', label: '`', shiftLabel: '~' },
        { code: 'Digit1', label: '1', shiftLabel: '!' },
        { code: 'Digit2', label: '2', shiftLabel: '@' },
        { code: 'Digit3', label: '3', shiftLabel: '#' },
        { code: 'Digit4', label: '4', shiftLabel: '$' },
        { code: 'Digit5', label: '5', shiftLabel: '%' },
        { code: 'Digit6', label: '6', shiftLabel: '^' },
        { code: 'Digit7', label: '7', shiftLabel: '&' },
        { code: 'Digit8', label: '8', shiftLabel: '*' },
        { code: 'Digit9', label: '9', shiftLabel: '(' },
        { code: 'Digit0', label: '0', shiftLabel: ')' },
        { code: 'Minus', label: '-', shiftLabel: '_' },
        { code: 'Equal', label: '=', shiftLabel: '+' },
        { code: 'Backspace', label: 'Backspace', widthUnit: 2.0, flexGrow: 2.0 },
      ],
      [
        { code: 'Tab', label: 'Tab', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'KeyQ', label: 'Q' },
        { code: 'KeyW', label: 'W' },
        { code: 'KeyE', label: 'E' },
        { code: 'KeyR', label: 'R' },
        { code: 'KeyT', label: 'T' },
        { code: 'KeyY', label: 'Y' },
        { code: 'KeyU', label: 'U' },
        { code: 'KeyI', label: 'I' },
        { code: 'KeyO', label: 'O' },
        { code: 'KeyP', label: 'P' },
        { code: 'BracketLeft', label: '[', shiftLabel: '{' },
        { code: 'BracketRight', label: ']', shiftLabel: '}' },
        { code: 'Backslash', label: '\\', shiftLabel: '|', widthUnit: 1.5, flexGrow: 1.5 },
      ],
      [
        { code: 'CapsLock', label: 'CapsLock', widthUnit: 1.8, flexGrow: 1.8 },
        { code: 'KeyA', label: 'A' },
        { code: 'KeyS', label: 'S' },
        { code: 'KeyD', label: 'D' },
        { code: 'KeyF', label: 'F' },
        { code: 'KeyG', label: 'G' },
        { code: 'KeyH', label: 'H' },
        { code: 'KeyJ', label: 'J' },
        { code: 'KeyK', label: 'K' },
        { code: 'KeyL', label: 'L' },
        { code: 'Semicolon', label: ';', shiftLabel: ':' },
        { code: 'Quote', label: "'", shiftLabel: '"' },
        { code: 'Enter', label: 'Enter', widthUnit: 2.2, flexGrow: 2.2 },
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', widthUnit: 2.2, flexGrow: 2.2 },
        { code: 'KeyZ', label: 'Z' },
        { code: 'KeyX', label: 'X' },
        { code: 'KeyC', label: 'C' },
        { code: 'KeyV', label: 'V' },
        { code: 'KeyB', label: 'B' },
        { code: 'KeyN', label: 'N' },
        { code: 'KeyM', label: 'M' },
        { code: 'Comma', label: ',', shiftLabel: '<' },
        { code: 'Period', label: '.', shiftLabel: '>' },
        { code: 'Slash', label: '/', shiftLabel: '?' },
        { code: 'ShiftRight', label: 'Shift', widthUnit: 2.8, flexGrow: 2.8 },
      ],
      [
        {
          code: 'ControlLeft',
          label: osMode === 'mac' ? '⌃ Control' : 'Ctrl',
          widthUnit: 1.4,
          flexGrow: 1.4,
        },
        {
          code: 'MetaLeft',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 1.4,
          flexGrow: 1.4,
        },
        {
          code: 'AltLeft',
          label: osMode === 'mac' ? '⌥ Option' : 'Alt',
          widthUnit: 1.4,
          flexGrow: 1.4,
        },
        { code: 'Space', label: ' ', widthUnit: 6.6, flexGrow: 6.6 },
        {
          code: 'AltRight',
          label: osMode === 'mac' ? '⌥ Option' : 'AltGr',
          widthUnit: 2.1,
          flexGrow: 2.1,
        },
        {
          code: 'MetaRight',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 2.1,
          flexGrow: 2.1,
        },
      ],
    ],
    [osMode]
  );

  // 65% Compact Layout (Spanish ISO)
  const mainSpanishLayout65: KeyConfig[][] = useMemo(
    () => [
      [
        { code: 'Backquote', label: 'º', shiftLabel: 'ª' },
        { code: 'Digit1', label: '1', shiftLabel: '!' },
        { code: 'Digit2', label: '2', shiftLabel: '"' },
        { code: 'Digit3', label: '3', shiftLabel: '·' },
        { code: 'Digit4', label: '4', shiftLabel: '$' },
        { code: 'Digit5', label: '5', shiftLabel: '%' },
        { code: 'Digit6', label: '6', shiftLabel: '&' },
        { code: 'Digit7', label: '7', shiftLabel: '/' },
        { code: 'Digit8', label: '8', shiftLabel: '(' },
        { code: 'Digit9', label: '9', shiftLabel: ')' },
        { code: 'Digit0', label: '0', shiftLabel: '=' },
        { code: 'Minus', label: "'", shiftLabel: '?' },
        { code: 'Equal', label: '¡', shiftLabel: '¿' },
        { code: 'Backspace', label: 'Backspace', widthUnit: 2.0, flexGrow: 2.0 },
        { code: 'Delete', label: 'Del', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        { code: 'Tab', label: 'Tab', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'KeyQ', label: 'Q' },
        { code: 'KeyW', label: 'W' },
        { code: 'KeyE', label: 'E' },
        { code: 'KeyR', label: 'R' },
        { code: 'KeyT', label: 'T' },
        { code: 'KeyY', label: 'Y' },
        { code: 'KeyU', label: 'U' },
        { code: 'KeyI', label: 'I' },
        { code: 'KeyO', label: 'O' },
        { code: 'KeyP', label: 'P' },
        { code: 'BracketLeft', label: '`', shiftLabel: '^' },
        { code: 'BracketRight', label: '+', shiftLabel: '*' },
        { code: 'Backslash', label: 'ç', shiftLabel: 'Ç', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'PageUp', label: 'PgUp', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        { code: 'CapsLock', label: 'CapsLock', widthUnit: 1.8, flexGrow: 1.8 },
        { code: 'KeyA', label: 'A' },
        { code: 'KeyS', label: 'S' },
        { code: 'KeyD', label: 'D' },
        { code: 'KeyF', label: 'F' },
        { code: 'KeyG', label: 'G' },
        { code: 'KeyH', label: 'H' },
        { code: 'KeyJ', label: 'J' },
        { code: 'KeyK', label: 'K' },
        { code: 'KeyL', label: 'L' },
        { code: 'Semicolon', label: 'Ñ' },
        { code: 'Quote', label: '´', shiftLabel: '¨' },
        { code: 'Enter', label: 'Enter', widthUnit: 2.2, flexGrow: 2.2 },
        { code: 'PageDown', label: 'PgDn', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'IntlBackslash', label: '<', shiftLabel: '>' },
        { code: 'KeyZ', label: 'Z' },
        { code: 'KeyX', label: 'X' },
        { code: 'KeyC', label: 'C' },
        { code: 'KeyV', label: 'V' },
        { code: 'KeyB', label: 'B' },
        { code: 'KeyN', label: 'N' },
        { code: 'KeyM', label: 'M' },
        { code: 'Comma', label: ',', shiftLabel: ';' },
        { code: 'Period', label: '.', shiftLabel: ':' },
        { code: 'Slash', label: '-', shiftLabel: '_' },
        { code: 'ShiftRight', label: 'Shift', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'ArrowUp', label: '▲', widthUnit: 1.0, flexGrow: 1.0 },
        { code: 'End', label: 'End', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        {
          code: 'ControlLeft',
          label: osMode === 'mac' ? '⌃ Control' : 'Ctrl',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        {
          code: 'MetaLeft',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        {
          code: 'AltLeft',
          label: osMode === 'mac' ? '⌥ Option' : 'Alt',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        { code: 'Space', label: ' ', widthUnit: 6.5, flexGrow: 6.5 },
        {
          code: 'AltRight',
          label: osMode === 'mac' ? '⌥ Option' : 'AltGr',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        {
          code: 'MetaRight',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 1.5,
          flexGrow: 1.5,
        },
        { code: 'ArrowLeft', label: '◀', widthUnit: 1.0, flexGrow: 1.0 },
        { code: 'ArrowDown', label: '▼', widthUnit: 1.0, flexGrow: 1.0 },
        { code: 'ArrowRight', label: '▶', widthUnit: 1.0, flexGrow: 1.0 },
      ],
    ],
    [osMode]
  );

  // 65% Compact Layout (English ANSI)
  const mainEnglishLayout65: KeyConfig[][] = useMemo(
    () => [
      [
        { code: 'Backquote', label: '`', shiftLabel: '~' },
        { code: 'Digit1', label: '1', shiftLabel: '!' },
        { code: 'Digit2', label: '2', shiftLabel: '@' },
        { code: 'Digit3', label: '3', shiftLabel: '#' },
        { code: 'Digit4', label: '4', shiftLabel: '$' },
        { code: 'Digit5', label: '5', shiftLabel: '%' },
        { code: 'Digit6', label: '6', shiftLabel: '^' },
        { code: 'Digit7', label: '7', shiftLabel: '&' },
        { code: 'Digit8', label: '8', shiftLabel: '*' },
        { code: 'Digit9', label: '9', shiftLabel: '(' },
        { code: 'Digit0', label: '0', shiftLabel: ')' },
        { code: 'Minus', label: '-', shiftLabel: '_' },
        { code: 'Equal', label: '=', shiftLabel: '+' },
        { code: 'Backspace', label: 'Backspace', widthUnit: 2.0, flexGrow: 2.0 },
        { code: 'Delete', label: 'Del', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        { code: 'Tab', label: 'Tab', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'KeyQ', label: 'Q' },
        { code: 'KeyW', label: 'W' },
        { code: 'KeyE', label: 'E' },
        { code: 'KeyR', label: 'R' },
        { code: 'KeyT', label: 'T' },
        { code: 'KeyY', label: 'Y' },
        { code: 'KeyU', label: 'U' },
        { code: 'KeyI', label: 'I' },
        { code: 'KeyO', label: 'O' },
        { code: 'KeyP', label: 'P' },
        { code: 'BracketLeft', label: '[', shiftLabel: '{' },
        { code: 'BracketRight', label: ']', shiftLabel: '}' },
        { code: 'Backslash', label: '\\', shiftLabel: '|', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'PageUp', label: 'PgUp', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        { code: 'CapsLock', label: 'CapsLock', widthUnit: 1.8, flexGrow: 1.8 },
        { code: 'KeyA', label: 'A' },
        { code: 'KeyS', label: 'S' },
        { code: 'KeyD', label: 'D' },
        { code: 'KeyF', label: 'F' },
        { code: 'KeyG', label: 'G' },
        { code: 'KeyH', label: 'H' },
        { code: 'KeyJ', label: 'J' },
        { code: 'KeyK', label: 'K' },
        { code: 'KeyL', label: 'L' },
        { code: 'Semicolon', label: ';', shiftLabel: ':' },
        { code: 'Quote', label: "'", shiftLabel: '"' },
        { code: 'Enter', label: 'Enter', widthUnit: 2.2, flexGrow: 2.2 },
        { code: 'PageDown', label: 'PgDn', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', widthUnit: 2.25, flexGrow: 2.25 },
        { code: 'KeyZ', label: 'Z' },
        { code: 'KeyX', label: 'X' },
        { code: 'KeyC', label: 'C' },
        { code: 'KeyV', label: 'V' },
        { code: 'KeyB', label: 'B' },
        { code: 'KeyN', label: 'N' },
        { code: 'KeyM', label: 'M' },
        { code: 'Comma', label: ',', shiftLabel: '<' },
        { code: 'Period', label: '.', shiftLabel: '>' },
        { code: 'Slash', label: '/', shiftLabel: '?' },
        { code: 'ShiftRight', label: 'Shift', widthUnit: 1.75, flexGrow: 1.75 },
        { code: 'ArrowUp', label: '▲', widthUnit: 1.0, flexGrow: 1.0 },
        { code: 'End', label: 'End', widthUnit: 1.0, flexGrow: 1.0 },
      ],
      [
        {
          code: 'ControlLeft',
          label: osMode === 'mac' ? '⌃ Control' : 'Ctrl',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        {
          code: 'MetaLeft',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        {
          code: 'AltLeft',
          label: osMode === 'mac' ? '⌥ Option' : 'Alt',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        { code: 'Space', label: ' ', widthUnit: 6.5, flexGrow: 6.5 },
        {
          code: 'AltRight',
          label: osMode === 'mac' ? '⌥ Option' : 'AltGr',
          widthUnit: 1.25,
          flexGrow: 1.25,
        },
        {
          code: 'MetaRight',
          label: osMode === 'mac' ? '⌘ Cmd' : 'Win ⊞',
          widthUnit: 1.5,
          flexGrow: 1.5,
        },
        { code: 'ArrowLeft', label: '◀', widthUnit: 1.0, flexGrow: 1.0 },
        { code: 'ArrowDown', label: '▼', widthUnit: 1.0, flexGrow: 1.0 },
        { code: 'ArrowRight', label: '▶', widthUnit: 1.0, flexGrow: 1.0 },
      ],
    ],
    [osMode]
  );

  const currentAlphanumericLayout = useMemo(() => {
    if (layoutMode === 'compact') {
      return keyboardLanguage === 'es' ? mainSpanishLayout65 : mainEnglishLayout65;
    }
    return keyboardLanguage === 'es' ? mainSpanishLayout : mainEnglishLayout;
  }, [layoutMode, keyboardLanguage, mainSpanishLayout65, mainEnglishLayout65, mainSpanishLayout, mainEnglishLayout]);

  // Calculate total keys in currently visible layout
  const totalKeysInCurrentLayout = useMemo(() => {
    if (layoutMode === 'compact60') {
      return keyboardLanguage === 'es' ? 62 : 61;
    }
    if (layoutMode === 'compact') {
      return keyboardLanguage === 'es' ? 68 : 67;
    }
    if (layoutMode === 'tkl') {
      const baseMain = keyboardLanguage === 'es' ? 62 : 61;
      return baseMain + functionRow.length + fRowNavKeys.length + 10;
    }
    if (layoutMode === 'full') {
      const baseMain = keyboardLanguage === 'es' ? 62 : 61;
      return baseMain + functionRow.length + fRowNavKeys.length + 10 + 17;
    }
    return 87;
  }, [layoutMode, keyboardLanguage, functionRow, fRowNavKeys]);

  const testedCount = testedKeys.size;
  const progressPercent = Math.min(
    100,
    Math.round((testedCount / Math.max(1, totalKeysInCurrentLayout)) * 100)
  );

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-6xl mx-auto">
      {/* ── 1. CONTROLS TOOLBAR (TOP) ── */}

      {/* ── TOOLBAR: LAYOUT / LANGUAGE / OS / SHORTCUTS / RESET ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layout Selector: TKL, Full, Compact (65%), Compact (60%) */}
          <div className="flex bg-muted/80 border border-border/80 rounded-xl p-0.5 h-8 items-center gap-0.5 shadow-2xs">
            <Button
              variant={layoutMode === 'tkl' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
              onClick={() => setLayoutMode('tkl')}
            >
              {t.layoutTkl}
            </Button>
            <Button
              variant={layoutMode === 'full' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
              onClick={() => setLayoutMode('full')}
            >
              {t.layoutFull}
            </Button>
            <Button
              variant={layoutMode === 'compact' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
              onClick={() => setLayoutMode('compact')}
            >
              {t.layoutCompact}
            </Button>
            <Button
              variant={layoutMode === 'compact60' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
              onClick={() => setLayoutMode('compact60')}
            >
              {t.layoutCompact60 || '60%'}
            </Button>
          </div>

          {/* Language Selector */}
          <div className="flex bg-muted/80 border border-border/80 rounded-xl p-0.5 h-8 items-center gap-0.5 shadow-2xs">
            <Button
              variant={keyboardLanguage === 'es' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
              onClick={() => setKeyboardLanguage('es')}
            >
              {t.keyboardLangEs || 'ES (ISO)'}
            </Button>
            <Button
              variant={keyboardLanguage === 'en' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 rounded-lg transition-all"
              onClick={() => setKeyboardLanguage('en')}
            >
              {t.keyboardLangEn || 'EN (ANSI)'}
            </Button>
          </div>

          {/* OS Switcher */}
          <div className="hidden sm:flex bg-muted/80 border border-border/80 rounded-xl p-0.5 h-8 items-center gap-0.5 shadow-2xs">
            <Button
              variant={osMode === 'mac' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 gap-1 rounded-lg transition-all"
              onClick={() => setOsMode('mac')}
            >
              <Laptop className="size-3" />
              <span>macOS</span>
            </Button>
            <Button
              variant={osMode === 'windows' ? 'default' : 'ghost'}
              size="xs"
              className="text-[11px] font-bold h-7 px-2.5 gap-1 rounded-lg transition-all"
              onClick={() => setOsMode('windows')}
            >
              <Monitor className="size-3" />
              <span>Windows</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Prevent shortcuts toggle */}
          <Button
            variant={preventShortcuts ? 'secondary' : 'outline'}
            size="xs"
            className="text-[11px] font-bold h-8 px-3 rounded-xl gap-1.5 border border-border cursor-pointer transition-all"
            onClick={() => setPreventShortcuts(!preventShortcuts)}
            title={t.preventShortcutsLabel}
          >
            <ShieldAlert className={`size-3.5 ${preventShortcuts ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="hidden sm:inline">{t.preventShortcutsLabel}</span>
          </Button>

          {/* Sound Toggle */}
          <Button
            variant={soundEnabled ? 'secondary' : 'outline'}
            size="icon"
            className="size-8 rounded-xl border border-border transition-colors cursor-pointer"
            onClick={onSoundToggle}
            title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="size-4 text-foreground" />
            ) : (
              <VolumeX className="size-4 text-muted-foreground opacity-70" />
            )}
          </Button>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 rounded-xl px-3 gap-1.5 text-xs font-bold border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>{t.resetKeyboardBtn}</span>
          </Button>
        </div>
      </div>

      {/* ── 3D VISUAL MECHANICAL KEYBOARD ── */}
      <div className="w-full overflow-x-auto pb-4 pt-1 select-none">
        <div
          className={`keyboard-case overflow-hidden p-3 xl:p-4 shadow-xl ${
            layoutMode === 'compact60'
              ? 'max-w-[840px] mx-auto w-full'
              : layoutMode === 'compact'
              ? 'max-w-[890px] mx-auto w-full'
              : 'min-w-[760px] lg:min-w-0 w-full'
          }`}
        >
          <div className="keyboard-surface w-full p-2.5 xl:p-3.5 flex flex-col gap-[5px]">
            {/* 1. FUNCTION ROW (TKL & Full layouts) */}
            {(layoutMode === 'tkl' || layoutMode === 'full') && (
              <div className="flex gap-4 w-full mb-1">
                {/* Esc + F1-F12 block (flex-1 to match alphanumeric width below) */}
                <div className="flex items-center gap-[4px] flex-1 min-w-0">
                  {/* Esc */}
                  <div className="w-[52px] shrink-0">
                    <Key
                      code={functionRow[0].code}
                      label={functionRow[0].label}
                      isPressed={currentlyPressedKeys.has(functionRow[0].code)}
                      isTested={testedKeys.has(functionRow[0].code)}
                    />
                  </div>

                  {/* Gap after Esc */}
                  <div className="w-2 sm:w-4 shrink-0" />

                  {/* F1-F4 */}
                  <div className="flex gap-[4px] flex-1 min-w-0">
                    {functionRow.slice(1, 5).map((k) => (
                      <Key
                        key={k.code}
                        code={k.code}
                        label={k.label}
                        isPressed={currentlyPressedKeys.has(k.code)}
                        isTested={testedKeys.has(k.code)}
                      />
                    ))}
                  </div>

                  {/* Gap after F4 */}
                  <div className="w-2 sm:w-3 shrink-0" />

                  {/* F5-F8 */}
                  <div className="flex gap-[4px] flex-1 min-w-0">
                    {functionRow.slice(5, 9).map((k) => (
                      <Key
                        key={k.code}
                        code={k.code}
                        label={k.label}
                        isPressed={currentlyPressedKeys.has(k.code)}
                        isTested={testedKeys.has(k.code)}
                      />
                    ))}
                  </div>

                  {/* Gap after F8 */}
                  <div className="w-2 sm:w-3 shrink-0" />

                  {/* F9-F12 */}
                  <div className="flex gap-[4px] flex-1 min-w-0">
                    {functionRow.slice(9, 13).map((k) => (
                      <Key
                        key={k.code}
                        code={k.code}
                        label={k.label}
                        isPressed={currentlyPressedKeys.has(k.code)}
                        isTested={testedKeys.has(k.code)}
                      />
                    ))}
                  </div>
                </div>

                {/* PrtSc, ScrLk, Pause (aligned above nav cluster) */}
                <div className="grid grid-cols-3 gap-[4px] w-[150px] shrink-0">
                  {fRowNavKeys.map((k) => (
                    <Key
                      key={k.code}
                      code={k.code}
                      label={k.label}
                      isPressed={currentlyPressedKeys.has(k.code)}
                      isTested={testedKeys.has(k.code)}
                    />
                  ))}
                </div>

                {/* Numpad top status plate in Full layout */}
                {layoutMode === 'full' && (
                  <div className="w-[195px] shrink-0 h-10 xs:h-11 sm:h-11 md:h-[52px] rounded-xl border border-border/70 bg-card/60 px-3 py-1 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`size-2 rounded-full transition-all duration-200 ${
                            numLockActive
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                              : 'bg-muted-foreground/25'
                          }`}
                        />
                        <span className="text-[8px] font-black tracking-wider text-muted-foreground">NUM</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`size-2 rounded-full transition-all duration-200 ${
                            capsLockActive
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                              : 'bg-muted-foreground/25'
                          }`}
                        />
                        <span className="text-[8px] font-black tracking-wider text-muted-foreground">CAPS</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`size-2 rounded-full transition-all duration-200 ${
                            scrollLockActive
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                              : 'bg-muted-foreground/25'
                          }`}
                        />
                        <span className="text-[8px] font-black tracking-wider text-muted-foreground">SCR</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground tracking-widest border border-border/50">
                      100% PRO
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 2. MAIN KEYBOARD + NAV CLUSTER + NUMPAD */}
            <div className="flex gap-4 w-full items-start">
              {/* Column 1: Main Alphanumeric Block (5 rows) */}
              <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                {currentAlphanumericLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-[4px] w-full items-center justify-between">
                    {row.map((key) => {
                      const isKeyPressed =
                        key.code === 'CapsLock'
                          ? capsLockActive || currentlyPressedKeys.has('CapsLock')
                          : currentlyPressedKeys.has(key.code);

                      const isKeyTested = testedKeys.has(key.code);

                      return (
                        <Key
                          key={key.code}
                          code={key.code}
                          label={key.label}
                          shiftLabel={key.shiftLabel}
                          widthUnit={key.widthUnit}
                          flexGrow={key.flexGrow}
                          isPressed={isKeyPressed}
                          isTested={isKeyTested}
                          isCapsLockActive={capsLockActive && key.code === 'CapsLock'}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Column 2: Navigation Cluster Block (TKL & Full) */}
              {(layoutMode === 'tkl' || layoutMode === 'full') && (
                <div className="flex flex-col gap-[5px] w-[150px] shrink-0">
                  {/* Row 0: Ins, Home, PgUp */}
                  <div className="grid grid-cols-3 gap-[4px] w-full">
                    <Key code="Insert" label="Ins" isPressed={currentlyPressedKeys.has('Insert')} isTested={testedKeys.has('Insert')} />
                    <Key code="Home" label="Home" isPressed={currentlyPressedKeys.has('Home')} isTested={testedKeys.has('Home')} />
                    <Key code="PageUp" label="PgUp" isPressed={currentlyPressedKeys.has('PageUp')} isTested={testedKeys.has('PageUp')} />
                  </div>

                  {/* Row 1: Del, End, PgDn */}
                  <div className="grid grid-cols-3 gap-[4px] w-full">
                    <Key code="Delete" label="Del" isPressed={currentlyPressedKeys.has('Delete')} isTested={testedKeys.has('Delete')} />
                    <Key code="End" label="End" isPressed={currentlyPressedKeys.has('End')} isTested={testedKeys.has('End')} />
                    <Key code="PageDown" label="PgDn" isPressed={currentlyPressedKeys.has('PageDown')} isTested={testedKeys.has('PageDown')} />
                  </div>

                  {/* Row 2: Spacer matching row height */}
                  <div className="h-10 xs:h-11 sm:h-11 md:h-[52px] w-full" />

                  {/* Dedicated Inverted-T Arrow Cluster Frame (Rows 3 & 4) */}
                  <div className="flex flex-col gap-[5px] w-full p-1 -m-1 rounded-xl bg-muted/20 border border-border/40">
                    {/* Row 3: Spacer, ArrowUp, Spacer */}
                    <div className="grid grid-cols-3 gap-[4px] w-full">
                      <div />
                      <Key
                        code="ArrowUp"
                        label="▲"
                        isPressed={currentlyPressedKeys.has('ArrowUp')}
                        isTested={testedKeys.has('ArrowUp')}
                      />
                      <div />
                    </div>

                    {/* Row 4: ArrowLeft, ArrowDown, ArrowRight */}
                    <div className="grid grid-cols-3 gap-[4px] w-full">
                      <Key
                        code="ArrowLeft"
                        label="◀"
                        isPressed={currentlyPressedKeys.has('ArrowLeft')}
                        isTested={testedKeys.has('ArrowLeft')}
                      />
                      <Key
                        code="ArrowDown"
                        label="▼"
                        isPressed={currentlyPressedKeys.has('ArrowDown')}
                        isTested={testedKeys.has('ArrowDown')}
                      />
                      <Key
                        code="ArrowRight"
                        label="▶"
                        isPressed={currentlyPressedKeys.has('ArrowRight')}
                        isTested={testedKeys.has('ArrowRight')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Column 3: Numpad Block (Full 100% only) */}
              {layoutMode === 'full' && (
                <div
                  className="grid grid-cols-4 gap-[4px] w-[195px] shrink-0"
                  style={{ gridAutoRows: 'minmax(0, 1fr)' }}
                >
                  {/* Row 0 */}
                  <Key code="NumLock" label="NumLk" flexGrow={1} isPressed={currentlyPressedKeys.has('NumLock')} isTested={testedKeys.has('NumLock')} />
                  <Key code="NumpadDivide" label="/" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadDivide')} isTested={testedKeys.has('NumpadDivide')} />
                  <Key code="NumpadMultiply" label="*" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadMultiply')} isTested={testedKeys.has('NumpadMultiply')} />
                  <Key code="NumpadSubtract" label="-" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadSubtract')} isTested={testedKeys.has('NumpadSubtract')} />

                  {/* Row 1 */}
                  <Key code="Numpad7" label="7" shiftLabel="Home" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad7')} isTested={testedKeys.has('Numpad7')} />
                  <Key code="Numpad8" label="8" shiftLabel="↑" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad8')} isTested={testedKeys.has('Numpad8')} />
                  <Key code="Numpad9" label="9" shiftLabel="PgUp" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad9')} isTested={testedKeys.has('Numpad9')} />
                  <div className="row-span-2 h-full flex flex-col">
                    <Key code="NumpadAdd" label="+" heightUnit={2} flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadAdd')} isTested={testedKeys.has('NumpadAdd')} />
                  </div>

                  {/* Row 2 */}
                  <Key code="Numpad4" label="4" shiftLabel="←" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad4')} isTested={testedKeys.has('Numpad4')} />
                  <Key code="Numpad5" label="5" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad5')} isTested={testedKeys.has('Numpad5')} />
                  <Key code="Numpad6" label="6" shiftLabel="→" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad6')} isTested={testedKeys.has('Numpad6')} />

                  {/* Row 3 */}
                  <Key code="Numpad1" label="1" shiftLabel="End" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad1')} isTested={testedKeys.has('Numpad1')} />
                  <Key code="Numpad2" label="2" shiftLabel="↓" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad2')} isTested={testedKeys.has('Numpad2')} />
                  <Key code="Numpad3" label="3" shiftLabel="PgDn" flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad3')} isTested={testedKeys.has('Numpad3')} />
                  <div className="row-span-2 h-full flex flex-col">
                    <Key code="NumpadEnter" label="↵" heightUnit={2} flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadEnter')} isTested={testedKeys.has('NumpadEnter')} />
                  </div>

                  {/* Row 4 */}
                  <div className="col-span-2 flex">
                    <Key code="Numpad0" label="0" shiftLabel="Ins" widthUnit={2} flexGrow={1} isPressed={currentlyPressedKeys.has('Numpad0')} isTested={testedKeys.has('Numpad0')} />
                  </div>
                  <Key code="NumpadDecimal" label="." shiftLabel="Del" flexGrow={1} isPressed={currentlyPressedKeys.has('NumpadDecimal')} isTested={testedKeys.has('NumpadDecimal')} />
                </div>
              )}
            </div>

            {/* Fn Layer Arrow status for pure 60% mode */}
            {layoutMode === 'compact60' && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/40 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
                  <Sparkles className="size-3 text-primary" />
                  {keyboardLanguage === 'es' ? 'Capa Flechas (Fn):' : 'Arrow Keys (Fn):'}
                </span>
                {(['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'] as const).map((arrowCode) => {
                  const isPressed = currentlyPressedKeys.has(arrowCode);
                  const isTested = testedKeys.has(arrowCode);
                  const symbol =
                    arrowCode === 'ArrowLeft' ? '←' :
                    arrowCode === 'ArrowUp' ? '↑' :
                    arrowCode === 'ArrowDown' ? '↓' : '→';
                  const label =
                    arrowCode === 'ArrowLeft' ? 'Left' :
                    arrowCode === 'ArrowUp' ? 'Up' :
                    arrowCode === 'ArrowDown' ? 'Down' : 'Right';

                  return (
                    <div
                      key={arrowCode}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold transition-all duration-100 ${
                        isPressed
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-95'
                          : isTested
                          ? 'bg-primary/20 text-primary border-primary/40'
                          : 'bg-muted/60 text-muted-foreground border-border/60'
                      }`}
                    >
                      <span className="text-sm">{symbol}</span>
                      <span className="text-[10px] font-mono">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. ENHANCED TELEMETRY DASHBOARD (BOTTOM) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 w-full">
        {/* Panel 1: Progress & Coverage (3 cols on desktop) */}
        <div className="lg:col-span-3 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-colors">
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

        {/* Panel 2: Anti-Ghosting & Rollover (3 cols on desktop) */}
        <div className="lg:col-span-3 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-colors">
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

        {/* Panel 3: HERO LAST KEY PRESSED INSPECTOR (6 cols on desktop) */}
        <div className="md:col-span-2 lg:col-span-6 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden group hover:border-primary/50 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3.5 text-primary" />
                {t.lastPressedLabel}
              </span>
            </div>

            {lastKey ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                  EVENT CAPTURED
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-medium text-muted-foreground/70 italic">
                {t.readyToTest}
              </span>
            )}
          </div>

          {/* Inspector Body */}
          {lastKey ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2.5">
              {/* Virtual Keycap Hero Box */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center min-w-[62px] h-[52px] px-3 rounded-xl bg-gradient-to-b from-card via-muted/60 to-muted border-2 border-primary/50 shadow-[0_6px_16px_rgba(0,0,0,0.12),0_0_12px_var(--primary)/20] shrink-0">
                  <span className="font-mono font-black text-lg text-foreground tracking-tight drop-shadow-xs">
                    {formatKeyDisplay(lastKey.key, lastKey.code)}
                  </span>
                  {/* Subtle top gloss highlight */}
                  <div className="absolute inset-x-1 top-0.5 h-[1.5px] rounded-t-lg bg-white/25 pointer-events-none" />
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-primary text-primary-foreground shadow-2xs">
                      {lastKey.code}
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-muted text-muted-foreground border border-border">
                      keyCode: <span className="text-foreground font-bold">{lastKey.keyCode}</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-muted text-muted-foreground border border-border">
                      loc: <span className="text-foreground font-bold">{formatLocation(lastKey.location)}</span>
                    </span>
                  </div>

                  {/* Character representation */}
                  <div className="text-[11px] text-muted-foreground font-mono">
                    char:{' '}
                    <span className="text-foreground font-semibold">
                      {lastKey.key === ' ' ? '"Space"' : `"${lastKey.key}"`}
                    </span>
                  </div>
                </div>
              </div>

              {/* History Ribbon Tape */}
              {keyHistory.length > 0 && (
                <div className="flex sm:flex-col sm:items-end justify-between items-center border-t sm:border-t-0 sm:border-l border-border/60 pt-2 sm:pt-0 sm:pl-3 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
                    {t.historyLabel}
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] py-0.5">
                    {keyHistory.slice(0, 6).map((code, idx) => (
                      <span
                        key={`${code}-${idx}`}
                        className={`px-1.5 py-0.5 text-[9px] font-mono rounded-md shrink-0 transition-all ${
                          idx === 0
                            ? 'bg-primary/20 text-primary border border-primary/40 font-bold shadow-2xs scale-105'
                            : 'bg-muted text-muted-foreground/80 border border-border/60'
                        }`}
                        style={{ opacity: Math.max(0.35, 1 - idx * 0.12) }}
                      >
                        {code.replace('Key', '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 my-auto text-xs text-muted-foreground/70 italic gap-2">
              <Sparkles className="size-3.5 text-muted-foreground/50 animate-pulse" />
              <span>Presiona cualquier tecla física para inspeccionar su código, ubicación y señal...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
