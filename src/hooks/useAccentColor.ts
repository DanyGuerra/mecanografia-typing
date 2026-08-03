'use client';

import { useState, useEffect, useCallback } from 'react';

export type AccentColorKey = 'blue' | 'violet' | 'emerald' | 'amber' | 'cyan' | 'orange' | 'slate';

export interface AccentColor {
  key: AccentColorKey;
  label: string;
  hex: string;
  lightPrimary: string;
  darkPrimary: string;
  lightRing: string;
  darkRing: string;
  lightPrimaryFg: string;
  darkPrimaryFg: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  {
    key: 'slate',
    label: 'Slate',
    hex: '#334155',
    lightPrimary: 'oklch(0.205 0 0)',
    darkPrimary: 'oklch(0.985 0 0)',
    lightRing: 'oklch(0.4 0.01 240)',
    darkRing: 'oklch(0.6 0.01 240)',
    lightPrimaryFg: 'oklch(0.985 0 0)',
    darkPrimaryFg: 'oklch(0.145 0 0)',
  },
  {
    key: 'blue',
    label: 'Azul',
    hex: '#3b82f6',
    lightPrimary: 'oklch(0.577 0.197 249.34)',
    darkPrimary: 'oklch(0.673 0.182 249.34)',
    lightRing: 'oklch(0.577 0.197 249.34)',
    darkRing: 'oklch(0.673 0.182 249.34)',
    lightPrimaryFg: 'oklch(1 0 0)',
    darkPrimaryFg: 'oklch(0.13 0.01 240)',
  },
  {
    key: 'violet',
    label: 'Violeta',
    hex: '#7c3aed',
    lightPrimary: 'oklch(0.491 0.27 292.58)',
    darkPrimary: 'oklch(0.614 0.237 292.58)',
    lightRing: 'oklch(0.491 0.27 292.58)',
    darkRing: 'oklch(0.614 0.237 292.58)',
    lightPrimaryFg: 'oklch(1 0 0)',
    darkPrimaryFg: 'oklch(1 0 0)',
  },
  {
    key: 'emerald',
    label: 'Esmeralda',
    hex: '#10b981',
    lightPrimary: 'oklch(0.638 0.178 162.48)',
    darkPrimary: 'oklch(0.72 0.17 162.48)',
    lightRing: 'oklch(0.638 0.178 162.48)',
    darkRing: 'oklch(0.72 0.17 162.48)',
    lightPrimaryFg: 'oklch(1 0 0)',
    darkPrimaryFg: 'oklch(0.13 0.01 240)',
  },
  {
    key: 'amber',
    label: 'Ámbar',
    hex: '#f59e0b',
    lightPrimary: 'oklch(0.75 0.183 83.35)',
    darkPrimary: 'oklch(0.8 0.165 83.35)',
    lightRing: 'oklch(0.75 0.183 83.35)',
    darkRing: 'oklch(0.8 0.165 83.35)',
    lightPrimaryFg: 'oklch(0.15 0 0)',
    darkPrimaryFg: 'oklch(0.13 0.01 240)',
  },
  {
    key: 'cyan',
    label: 'Cian',
    hex: '#06b6d4',
    lightPrimary: 'oklch(0.688 0.155 213.54)',
    darkPrimary: 'oklch(0.75 0.14 213.54)',
    lightRing: 'oklch(0.688 0.155 213.54)',
    darkRing: 'oklch(0.75 0.14 213.54)',
    lightPrimaryFg: 'oklch(0.13 0.01 240)',
    darkPrimaryFg: 'oklch(0.13 0.01 240)',
  },
  {
    key: 'orange',
    label: 'Naranja',
    hex: '#f97316',
    lightPrimary: 'oklch(0.702 0.194 47.6)',
    darkPrimary: 'oklch(0.765 0.175 47.6)',
    lightRing: 'oklch(0.702 0.194 47.6)',
    darkRing: 'oklch(0.765 0.175 47.6)',
    lightPrimaryFg: 'oklch(1 0 0)',
    darkPrimaryFg: 'oklch(0.13 0.01 240)',
  },
];

const STORAGE_KEY = 'mecanografia-accent-color';
const DEFAULT_ACCENT: AccentColorKey = 'slate';

function applyAccentColor(colorKey: AccentColorKey, isDark: boolean) {
  const color = ACCENT_COLORS.find((c) => c.key === colorKey) ?? ACCENT_COLORS[0];
  const root = document.documentElement;
  root.style.setProperty('--primary', isDark ? color.darkPrimary : color.lightPrimary);
  root.style.setProperty('--primary-foreground', isDark ? color.darkPrimaryFg : color.lightPrimaryFg);
  root.style.setProperty('--ring', isDark ? color.darkRing : color.lightRing);
}

function getSavedAccent(): AccentColorKey {
  if (typeof window === 'undefined') return DEFAULT_ACCENT;
  const saved = localStorage.getItem(STORAGE_KEY) as AccentColorKey | null;
  return saved && ACCENT_COLORS.find((c) => c.key === saved) ? saved : DEFAULT_ACCENT;
}

export function useAccentColor(isDark: boolean) {
  const [accentColor, setAccentColorState] = useState<AccentColorKey>(getSavedAccent);

  useEffect(() => {
    applyAccentColor(accentColor, isDark);
  }, [accentColor, isDark]);

  const setAccentColor = useCallback((key: AccentColorKey) => {
    setAccentColorState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }, []);

  return { accentColor, setAccentColor, accentOptions: ACCENT_COLORS };
}
