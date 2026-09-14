import { type AccentColorKey } from '@/hooks/useAccentColor';

export type LayoutMode = 'tkl' | 'full' | 'compact' | 'compact60';
export type KeyboardLanguage = 'es' | 'en';
export type OsMode = 'mac' | 'windows';

export interface KeyConfig {
  code: string;
  label: string;
  shiftLabel?: string;
  widthUnit?: number;
  flexGrow?: number;
}

export interface LastKeyInfo {
  code: string;
  key: string;
  keyCode: number;
  location: number;
  timestamp: number;
}

export interface KeyboardTesterTranslations {
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
}

export interface KeyboardTesterProps {
  initialLanguage?: 'es' | 'en';
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onPlaySound?: (type: 'standard' | 'space' | 'backspace' | 'enter') => void;
  accentColor?: AccentColorKey;
  t: KeyboardTesterTranslations;
}

export const PREVENT_SHORTCUT_CODES = new Set([
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
]);

export function formatKeyDisplay(key: string, code: string): string {
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

export function formatLocation(location: number): string {
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
