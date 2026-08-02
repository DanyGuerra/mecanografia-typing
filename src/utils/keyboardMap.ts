export function charToKeyCode(char: string, language: 'es' | 'en'): { code: string; needsShift: boolean } | null {
  if (!char) return null;

  if (char === ' ') return { code: 'Space', needsShift: false };
  if (char === '\n') return { code: 'Enter', needsShift: false };

  const lower = char.toLowerCase();
  const isUpper = char !== lower && char.toUpperCase() === char;

  // Alphabet A-Z
  if (lower >= 'a' && lower <= 'z') {
    const code = `Key${lower.toUpperCase()}`;
    return { code, needsShift: isUpper };
  }

  // Spanish Ñ
  if (lower === 'ñ') {
    return { code: 'Semicolon', needsShift: isUpper };
  }

  // Digits 0-9
  if (char >= '0' && char <= '9') {
    const code = char === '0' ? 'Digit0' : `Digit${char}`;
    return { code, needsShift: false };
  }

  // Common Punctuation (ES / EN)
  if (language === 'es') {
    switch (char) {
      case ',': return { code: 'Comma', needsShift: false };
      case ';': return { code: 'Comma', needsShift: true };
      case '.': return { code: 'Period', needsShift: false };
      case ':': return { code: 'Period', needsShift: true };
      case '-': return { code: 'Slash', needsShift: false };
      case '_': return { code: 'Slash', needsShift: true };
      case '¡': return { code: 'Equal', needsShift: false };
      case '¿': return { code: 'Equal', needsShift: true };
      case "'": return { code: 'Minus', needsShift: false };
      case '?': return { code: 'Minus', needsShift: true };
      case 'ç': return { code: 'Backslash', needsShift: false };
      case 'Ç': return { code: 'Backslash', needsShift: true };
      case '<': return { code: 'IntlBackslash', needsShift: false };
      case '>': return { code: 'IntlBackslash', needsShift: true };
      default: return null;
    }
  } else {
    switch (char) {
      case ',': return { code: 'Comma', needsShift: false };
      case '<': return { code: 'Comma', needsShift: true };
      case '.': return { code: 'Period', needsShift: false };
      case '>': return { code: 'Period', needsShift: true };
      case '/': return { code: 'Slash', needsShift: false };
      case '?': return { code: 'Slash', needsShift: true };
      case ';': return { code: 'Semicolon', needsShift: false };
      case ':': return { code: 'Semicolon', needsShift: true };
      case "'": return { code: 'Quote', needsShift: false };
      case '"': return { code: 'Quote', needsShift: true };
      case '[': return { code: 'BracketLeft', needsShift: false };
      case '{': return { code: 'BracketLeft', needsShift: true };
      case ']': return { code: 'BracketRight', needsShift: false };
      case '}': return { code: 'BracketRight', needsShift: true };
      case '-': return { code: 'Minus', needsShift: false };
      case '_': return { code: 'Minus', needsShift: true };
      case '=': return { code: 'Equal', needsShift: false };
      case '+': return { code: 'Equal', needsShift: true };
      case '`': return { code: 'Backquote', needsShift: false };
      case '~': return { code: 'Backquote', needsShift: true };
      default: return null;
    }
  }
}
