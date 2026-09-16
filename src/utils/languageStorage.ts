import { useSyncExternalStore, useCallback } from 'react';

export type SupportedLanguage = 'es' | 'en';

export function getStoredKeyboardLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem('keyboardLanguage');
    if (val === 'es' || val === 'en') return val;
  } catch {}
  return null;
}

export function setStoredKeyboardLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('keyboardLanguage', lang);
    window.dispatchEvent(new Event('keyboard-language-change'));
  } catch {}
}

export function getStoredAppLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem('appLanguage');
    if (val === 'es' || val === 'en') return val;
  } catch {}
  return null;
}

export function setStoredAppLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('appLanguage', lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
}

function subscribeKeyboardLanguage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('keyboard-language-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('keyboard-language-change', callback);
  };
}

export function useStoredKeyboardLanguage(
  fallback: SupportedLanguage
): [SupportedLanguage, (lang: SupportedLanguage) => void] {
  const lang = useSyncExternalStore(
    subscribeKeyboardLanguage,
    () => getStoredKeyboardLanguage() || fallback,
    () => fallback
  );

  const setLang = useCallback((newLang: SupportedLanguage) => {
    setStoredKeyboardLanguage(newLang);
  }, []);

  return [lang, setLang];
}
