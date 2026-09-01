'use client';

import React, { memo, useState, useCallback } from 'react';
import Key from './Key';
import { charToKeyCode } from '@/utils/keyboardMap';

interface KeyConfig {
  code: string;
  label: string;
  shiftLabel?: string;
  widthUnit?: number;
  flexGrow?: number;
}

interface KeyboardProps {
  language: 'es' | 'en';
  pressedKeys: Record<string, boolean>;
  capsLockActive?: boolean;
  osMode: 'mac' | 'windows';
  nextKeyCode?: string | null;
  nextKeyNeedsShift?: boolean;
  targetChar?: string | null;
  onKeyPress?: (key: string, code: string) => void;
}

/* =========================================================
   DESKTOP KEYBOARD LAYOUTS (Physical PC / Mac layout)
   ========================================================= */
const desktopEnglishLayout: KeyConfig[][] = [
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
    { code: 'Backspace', label: 'Backspace', widthUnit: 2.0, flexGrow: 2 },
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
    { code: 'ControlLeft', label: 'Ctrl ⌃', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'MetaLeft', label: 'Cmd ⌘', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'AltLeft', label: 'Alt ⌥', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'Space', label: ' ', widthUnit: 6.0, flexGrow: 6.0 },
    { code: 'AltRight', label: 'Alt ⌥', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'MetaRight', label: 'Cmd ⌘', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'ControlRight', label: 'Ctrl ⌃', widthUnit: 1.5, flexGrow: 1.5 },
  ],
];

const desktopSpanishLayout: KeyConfig[][] = [
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
    { code: 'Backspace', label: 'Backspace', widthUnit: 2.0, flexGrow: 2 },
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
    { code: 'ShiftLeft', label: 'Shift', widthUnit: 1.6, flexGrow: 1.6 },
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
    { code: 'ShiftRight', label: 'Shift', widthUnit: 2.8, flexGrow: 2.8 },
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl ⌃', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'MetaLeft', label: 'Cmd ⌘', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'AltLeft', label: 'Alt ⌥', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'Space', label: ' ', widthUnit: 6.0, flexGrow: 6.0 },
    { code: 'AltRight', label: 'AltGr ⌥', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'MetaRight', label: 'Cmd ⌘', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'ControlRight', label: 'Ctrl ⌃', widthUnit: 1.5, flexGrow: 1.5 },
  ],
];

/* =========================================================
   MOBILE KEYBOARD LAYOUTS (Samsung / Gboard Touch Layout)
   No Windows / Command / Ctrl / Alt keys. 4 compact rows.
   ========================================================= */
const mobileSpanishLetters: KeyConfig[][] = [
  [
    { code: 'KeyQ', label: 'q', shiftLabel: '1' },
    { code: 'KeyW', label: 'w', shiftLabel: '2' },
    { code: 'KeyE', label: 'e', shiftLabel: '3' },
    { code: 'KeyR', label: 'r', shiftLabel: '4' },
    { code: 'KeyT', label: 't', shiftLabel: '5' },
    { code: 'KeyY', label: 'y', shiftLabel: '6' },
    { code: 'KeyU', label: 'u', shiftLabel: '7' },
    { code: 'KeyI', label: 'i', shiftLabel: '8' },
    { code: 'KeyO', label: 'o', shiftLabel: '9' },
    { code: 'KeyP', label: 'p', shiftLabel: '0' },
  ],
  [
    { code: 'KeyA', label: 'a' },
    { code: 'KeyS', label: 's' },
    { code: 'KeyD', label: 'd' },
    { code: 'KeyF', label: 'f' },
    { code: 'KeyG', label: 'g' },
    { code: 'KeyH', label: 'h' },
    { code: 'KeyJ', label: 'j' },
    { code: 'KeyK', label: 'k' },
    { code: 'KeyL', label: 'l' },
    { code: 'Semicolon', label: 'ñ' },
  ],
  [
    { code: 'ShiftLeft', label: '⇧', widthUnit: 1.35, flexGrow: 1.35 },
    { code: 'KeyZ', label: 'z' },
    { code: 'KeyX', label: 'x' },
    { code: 'KeyC', label: 'c' },
    { code: 'KeyV', label: 'v' },
    { code: 'KeyB', label: 'b' },
    { code: 'KeyN', label: 'n' },
    { code: 'KeyM', label: 'm' },
    { code: 'Backspace', label: '⌫', widthUnit: 1.35, flexGrow: 1.35 },
  ],
  [
    { code: 'SymbolMode', label: '!#1', widthUnit: 1.4, flexGrow: 1.4 },
    { code: 'Comma', label: ',', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Space', label: 'Español', widthUnit: 4.8, flexGrow: 4.8 },
    { code: 'Period', label: '.', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Enter', label: '↵', widthUnit: 1.4, flexGrow: 1.4 },
  ],
];

const mobileEnglishLetters: KeyConfig[][] = [
  [
    { code: 'KeyQ', label: 'q', shiftLabel: '1' },
    { code: 'KeyW', label: 'w', shiftLabel: '2' },
    { code: 'KeyE', label: 'e', shiftLabel: '3' },
    { code: 'KeyR', label: 'r', shiftLabel: '4' },
    { code: 'KeyT', label: 't', shiftLabel: '5' },
    { code: 'KeyY', label: 'y', shiftLabel: '6' },
    { code: 'KeyU', label: 'u', shiftLabel: '7' },
    { code: 'KeyI', label: 'i', shiftLabel: '8' },
    { code: 'KeyO', label: 'o', shiftLabel: '9' },
    { code: 'KeyP', label: 'p', shiftLabel: '0' },
  ],
  [
    { code: 'KeyA', label: 'a' },
    { code: 'KeyS', label: 's' },
    { code: 'KeyD', label: 'd' },
    { code: 'KeyF', label: 'f' },
    { code: 'KeyG', label: 'g' },
    { code: 'KeyH', label: 'h' },
    { code: 'KeyJ', label: 'j' },
    { code: 'KeyK', label: 'k' },
    { code: 'KeyL', label: 'l' },
  ],
  [
    { code: 'ShiftLeft', label: '⇧', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'KeyZ', label: 'z' },
    { code: 'KeyX', label: 'x' },
    { code: 'KeyC', label: 'c' },
    { code: 'KeyV', label: 'v' },
    { code: 'KeyB', label: 'b' },
    { code: 'KeyN', label: 'n' },
    { code: 'KeyM', label: 'm' },
    { code: 'Backspace', label: '⌫', widthUnit: 1.5, flexGrow: 1.5 },
  ],
  [
    { code: 'SymbolMode', label: '?123', widthUnit: 1.4, flexGrow: 1.4 },
    { code: 'Comma', label: ',', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Space', label: 'English', widthUnit: 4.8, flexGrow: 4.8 },
    { code: 'Period', label: '.', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Enter', label: '↵', widthUnit: 1.4, flexGrow: 1.4 },
  ],
];

const mobileSymbols1: KeyConfig[][] = [
  [
    { code: 'Digit1', label: '1' },
    { code: 'Digit2', label: '2' },
    { code: 'Digit3', label: '3' },
    { code: 'Digit4', label: '4' },
    { code: 'Digit5', label: '5' },
    { code: 'Digit6', label: '6' },
    { code: 'Digit7', label: '7' },
    { code: 'Digit8', label: '8' },
    { code: 'Digit9', label: '9' },
    { code: 'Digit0', label: '0' },
  ],
  [
    { code: 'SymbolAt', label: '@' },
    { code: 'SymbolHash', label: '#' },
    { code: 'SymbolDollar', label: '$' },
    { code: 'SymbolPercent', label: '%' },
    { code: 'SymbolAmpersand', label: '&' },
    { code: 'Minus', label: '-' },
    { code: 'Equal', label: '+' },
    { code: 'SymbolParenL', label: '(' },
    { code: 'SymbolParenR', label: ')' },
    { code: 'Slash', label: '/' },
  ],
  [
    { code: 'SymbolPage2', label: '1/2', widthUnit: 1.4, flexGrow: 1.4 },
    { code: 'SymbolAsterisk', label: '*' },
    { code: 'SymbolQuoteDouble', label: '"' },
    { code: 'Quote', label: "'" },
    { code: 'SymbolColon', label: ':' },
    { code: 'Semicolon', label: ';' },
    { code: 'SymbolExclamation', label: '!' },
    { code: 'SymbolQuestion', label: '?' },
    { code: 'Backspace', label: '⌫', widthUnit: 1.4, flexGrow: 1.4 },
  ],
  [
    { code: 'SymbolMode', label: 'ABC', widthUnit: 1.4, flexGrow: 1.4 },
    { code: 'Comma', label: ',', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Space', label: ' ', widthUnit: 4.8, flexGrow: 4.8 },
    { code: 'Period', label: '.', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Enter', label: '↵', widthUnit: 1.4, flexGrow: 1.4 },
  ],
];

const mobileSymbols2: KeyConfig[][] = [
  [
    { code: 'SymbolTilde', label: '~' },
    { code: 'SymbolBackquote', label: '`' },
    { code: 'SymbolPipe', label: '|' },
    { code: 'SymbolCaret', label: '^' },
    { code: 'SymbolUnderscore', label: '_' },
    { code: 'SymbolEqual', label: '=' },
    { code: 'BracketLeft', label: '{' },
    { code: 'BracketRight', label: '}' },
    { code: 'SymbolSquareL', label: '[' },
    { code: 'SymbolSquareR', label: ']' },
  ],
  [
    { code: 'IntlBackslash', label: '<' },
    { code: 'SymbolGreater', label: '>' },
    { code: 'SymbolInvertedExcl', label: '¡' },
    { code: 'SymbolInvertedQuest', label: '¿' },
    { code: 'SymbolDegree', label: 'º' },
    { code: 'SymbolFeminine', label: 'ª' },
    { code: 'SymbolMiddleDot', label: '·' },
    { code: 'SymbolEuro', label: '€' },
    { code: 'SymbolPound', label: '£' },
    { code: 'SymbolYen', label: '¥' },
  ],
  [
    { code: 'SymbolPage2', label: '2/2', widthUnit: 1.4, flexGrow: 1.4 },
    { code: 'Backslash', label: '\\' },
    { code: 'SymbolSection', label: '§' },
    { code: 'SymbolCopyright', label: '©' },
    { code: 'SymbolRegistered', label: '®' },
    { code: 'SymbolTrade', label: '™' },
    { code: 'SymbolAngleQuoteL', label: '«' },
    { code: 'SymbolAngleQuoteR', label: '»' },
    { code: 'Backspace', label: '⌫', widthUnit: 1.4, flexGrow: 1.4 },
  ],
  [
    { code: 'SymbolMode', label: 'ABC', widthUnit: 1.4, flexGrow: 1.4 },
    { code: 'Comma', label: ',', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Space', label: ' ', widthUnit: 4.8, flexGrow: 4.8 },
    { code: 'Period', label: '.', widthUnit: 1.0, flexGrow: 1.0 },
    { code: 'Enter', label: '↵', widthUnit: 1.4, flexGrow: 1.4 },
  ],
];

function Keyboard({
  language,
  pressedKeys,
  capsLockActive,
  osMode,
  nextKeyCode,
  nextKeyNeedsShift,
  targetChar,
  onKeyPress,
}: KeyboardProps) {
  const [virtualShift, setVirtualShift] = useState(false);
  const [virtualCapsLock, setVirtualCapsLock] = useState(false);
  const [mobileSymbolMode, setMobileSymbolMode] = useState<'abc' | 'symbols1' | 'symbols2'>('abc');
  const [prevTargetChar, setPrevTargetChar] = useState(targetChar);

  // Auto-switch mobile keyboard page when target char changes
  if (targetChar !== prevTargetChar) {
    setPrevTargetChar(targetChar);
    if (targetChar) {
      const isDigit = /[0-9]/.test(targetChar);
      const isPrimarySymbol = /[@#$%&+\-()/*"':;!?]/.test(targetChar);
      const isAdvancedSymbol = /[~`|^_={}[\]<>¡¿ºª·€£¥\\§©®™«»]/.test(targetChar);

      if (isDigit || isPrimarySymbol) {
        if (mobileSymbolMode === 'symbols2') setMobileSymbolMode('symbols1');
      } else if (isAdvancedSymbol) {
        if (mobileSymbolMode !== 'symbols2') setMobileSymbolMode('symbols2');
      } else if (/[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\n]/.test(targetChar)) {
        if (mobileSymbolMode !== 'abc') setMobileSymbolMode('abc');
      }
    }
  }

  let activeTargetCode = nextKeyCode;
  let activeTargetShift = nextKeyNeedsShift;

  if (!activeTargetCode && targetChar) {
    const mapped = charToKeyCode(targetChar, language);
    if (mapped) {
      activeTargetCode = mapped.code;
      activeTargetShift = mapped.needsShift;
    }
  }

  // Desktop layout configuration
  const desktopBaseLayout = language === 'es' ? desktopSpanishLayout : desktopEnglishLayout;
  const desktopLayout = desktopBaseLayout.map((row, index) => {
    if (index !== 4) return row;

    if (osMode === 'mac') {
      return [
        { code: 'ControlLeft', label: 'Ctrl ⌃', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'AltLeft', label: 'Opt ⌥', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'MetaLeft', label: 'Cmd ⌘', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'Space', label: ' ', widthUnit: 6.0, flexGrow: 6.0 },
        { code: 'MetaRight', label: 'Cmd ⌘', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'AltRight', label: 'Opt ⌥', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'ControlRight', label: 'Ctrl ⌃', widthUnit: 1.5, flexGrow: 1.5 },
      ];
    } else {
      return [
        { code: 'ControlLeft', label: 'Ctrl', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'MetaLeft', label: 'Win ⊞', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'AltLeft', label: 'Alt', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'Space', label: ' ', widthUnit: 6.0, flexGrow: 6.0 },
        { code: 'AltRight', label: language === 'es' ? 'AltGr' : 'Alt', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'MetaRight', label: 'Win ⊞', widthUnit: 1.5, flexGrow: 1.5 },
        { code: 'ControlRight', label: 'Ctrl', widthUnit: 1.5, flexGrow: 1.5 },
      ];
    }
  });

  // Mobile layout configuration
  const mobileLayout =
    mobileSymbolMode === 'symbols1'
      ? mobileSymbols1
      : mobileSymbolMode === 'symbols2'
        ? mobileSymbols2
        : language === 'es'
          ? mobileSpanishLetters
          : mobileEnglishLetters;

  const effectiveCapsLock = !!capsLockActive || virtualCapsLock;
  const isPhysicalShift = !!pressedKeys['ShiftLeft'] || !!pressedKeys['ShiftRight'];
  const isShiftActive = isPhysicalShift || virtualShift;

  const handleKeyClick = useCallback(
    (code: string, label: string, shiftLabel?: string) => {
      // Mobile symbols switch
      if (code === 'SymbolMode') {
        setMobileSymbolMode((prev) => (prev === 'abc' ? 'symbols1' : 'abc'));
        return;
      }
      if (code === 'SymbolPage2') {
        setMobileSymbolMode((prev) => (prev === 'symbols1' ? 'symbols2' : 'symbols1'));
        return;
      }

      // Modifiers
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        setVirtualShift((prev) => !prev);
        return;
      }
      if (code === 'CapsLock') {
        setVirtualCapsLock((prev) => !prev);
        return;
      }
      if (code === 'Backspace') {
        onKeyPress?.('Backspace', 'Backspace');
        return;
      }
      if (code === 'Enter') {
        onKeyPress?.('Enter', 'Enter');
        return;
      }
      if (code === 'Space') {
        onKeyPress?.(' ', 'Space');
        return;
      }
      if (code === 'Tab') {
        onKeyPress?.('\t', 'Tab');
        return;
      }
      if (
        [
          'ControlLeft',
          'ControlRight',
          'MetaLeft',
          'MetaRight',
          'AltLeft',
          'AltRight',
        ].includes(code)
      ) {
        return;
      }

      // Determine character to send
      let charToSend = label;
      const isLetter =
        label.length === 1 && label.toLowerCase() !== label.toUpperCase();

      if (isLetter) {
        const isUpperCase =
          (effectiveCapsLock && !isShiftActive) ||
          (!effectiveCapsLock && isShiftActive);
        charToSend = isUpperCase ? label.toUpperCase() : label.toLowerCase();
      } else if (isShiftActive && shiftLabel) {
        charToSend = shiftLabel;
      }

      onKeyPress?.(charToSend, code);

      // Auto-reset virtual shift after one character press on mobile
      if (virtualShift) {
        setVirtualShift(false);
      }
    },
    [effectiveCapsLock, isShiftActive, onKeyPress, virtualShift]
  );

  return (
    <div className="keyboard-case w-full overflow-hidden p-1.5 sm:p-2 md:p-3">
      {/* Inner surface with key tray effect */}
      <div className="keyboard-surface w-full p-1.5 sm:p-2 md:p-3">
        {/* ── DESKTOP KEYBOARD (Visible on sm / md / lg screens) ── */}
        <div className="hidden sm:flex flex-col gap-[4px] md:gap-[5px] w-full">
          {desktopLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-[3px] md:gap-[4px] w-full justify-between">
              {row.map((key) => {
                const isLetter =
                  key.label.length === 1 &&
                  key.label.toLowerCase() !== key.label.toUpperCase();
                let displayLabel = key.label;
                let displayShiftLabel = key.shiftLabel;

                if (isLetter) {
                  const isUpperCase =
                    (effectiveCapsLock && !isShiftActive) ||
                    (!effectiveCapsLock && isShiftActive);
                  displayLabel = isUpperCase
                    ? key.label.toUpperCase()
                    : key.label.toLowerCase();
                  displayShiftLabel = undefined;
                }

                const isTargetKey =
                  key.code === activeTargetCode ||
                  (activeTargetShift && (key.code === 'ShiftLeft' || key.code === 'ShiftRight'));

                const isKeyPressed =
                  key.code === 'CapsLock'
                    ? effectiveCapsLock
                    : key.code === 'ShiftLeft' || key.code === 'ShiftRight'
                      ? !!pressedKeys[key.code] || virtualShift
                      : !!pressedKeys[key.code];

                return (
                  <Key
                    key={key.code}
                    code={key.code}
                    label={displayLabel}
                    shiftLabel={displayShiftLabel}
                    widthUnit={key.widthUnit}
                    flexGrow={key.flexGrow}
                    isPressed={isKeyPressed}
                    isCapsLockActive={effectiveCapsLock && key.code === 'CapsLock'}
                    isTarget={isTargetKey}
                    onKeyClick={handleKeyClick}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* ── MOBILE KEYBOARD (Samsung / Gboard touch layout for phones < 640px) ── */}
        <div className="flex sm:hidden flex-col gap-[3.5px] w-full">
          {mobileLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-[3px] w-full justify-between">
              {row.map((key) => {
                const isLetter =
                  key.label.length === 1 &&
                  key.label.toLowerCase() !== key.label.toUpperCase();
                let displayLabel = key.label;
                const displayShiftLabel = key.shiftLabel;

                if (isLetter) {
                  const isUpperCase =
                    (effectiveCapsLock && !isShiftActive) ||
                    (!effectiveCapsLock && isShiftActive);
                  displayLabel = isUpperCase
                    ? key.label.toUpperCase()
                    : key.label.toLowerCase();
                }

                // In mobile letter mode, target key can match letter or superscript number
                const isTargetKey =
                  key.code === activeTargetCode ||
                  (targetChar && key.label.toLowerCase() === targetChar.toLowerCase()) ||
                  (targetChar && key.shiftLabel === targetChar) ||
                  (activeTargetShift && key.code === 'ShiftLeft');

                const isKeyPressed =
                  key.code === 'ShiftLeft'
                    ? !!pressedKeys['ShiftLeft'] || virtualShift
                    : key.code === 'SymbolMode' && mobileSymbolMode !== 'abc'
                      ? true
                      : !!pressedKeys[key.code];

                return (
                  <Key
                    key={key.code}
                    code={key.code}
                    label={displayLabel}
                    shiftLabel={displayShiftLabel}
                    widthUnit={key.widthUnit}
                    flexGrow={key.flexGrow}
                    isPressed={isKeyPressed}
                    isCapsLockActive={effectiveCapsLock && key.code === 'ShiftLeft'}
                    isTarget={isTargetKey}
                    onKeyClick={handleKeyClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Keyboard);
