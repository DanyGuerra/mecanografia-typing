'use client';

import React from 'react';
import Key from './Key';
import styles from './Keyboard.module.css';

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
}

const englishLayout: KeyConfig[][] = [
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
    { code: 'ControlLeft', label: 'Ctrl', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'AltLeft', label: 'Alt', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'Space', label: ' ', widthUnit: 6.5, flexGrow: 7.0 },
    { code: 'AltRight', label: 'Alt', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'ControlRight', label: 'Ctrl', widthUnit: 1.5, flexGrow: 1.5 },
  ],
];

const spanishLayout: KeyConfig[][] = [
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
    { code: 'ControlLeft', label: 'Ctrl', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'AltLeft', label: 'Alt', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'Space', label: ' ', widthUnit: 6.5, flexGrow: 7.0 },
    { code: 'AltRight', label: 'AltGr', widthUnit: 1.5, flexGrow: 1.5 },
    { code: 'ControlRight', label: 'Ctrl', widthUnit: 1.5, flexGrow: 1.5 },
  ],
];

export default function Keyboard({ language, pressedKeys }: KeyboardProps) {
  const layout = language === 'es' ? spanishLayout : englishLayout;

  return (
    <div className={styles.keyboardContainer}>
      <div className={styles.keyboardFrame}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.keyboardRow}>
            {row.map((key) => (
              <Key
                key={key.code}
                code={key.code}
                label={key.label}
                shiftLabel={key.shiftLabel}
                widthUnit={key.widthUnit}
                flexGrow={key.flexGrow}
                isPressed={!!pressedKeys[key.code]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
