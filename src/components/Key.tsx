'use client';

import React, { memo, useState, useCallback } from 'react';

interface KeyProps {
  label: string;
  shiftLabel?: string;
  code: string;
  isPressed: boolean;
  isTested?: boolean;
  flexGrow?: number;
  widthUnit?: number;
  heightUnit?: number;
  isCapsLockActive?: boolean;
  isTarget?: boolean;
  onKeyClick?: (code: string, label: string, shiftLabel?: string) => void;
}

function getMobileLabel(code: string, defaultLabel: string): string {
  switch (code) {
    case 'Backspace':
      return '⌫';
    case 'Tab':
      return '⇥';
    case 'CapsLock':
      return '⇪';
    case 'Enter':
      return '↵';
    case 'ShiftLeft':
    case 'ShiftRight':
      return '⇧';
    case 'ControlLeft':
    case 'ControlRight':
      return '⌃';
    case 'MetaLeft':
    case 'MetaRight':
      return '⌘';
    case 'AltLeft':
    case 'AltRight':
      return '⌥';
    case 'Delete':
      return '⌦';
    case 'PageUp':
      return '⇞';
    case 'PageDown':
      return '⇟';
    default:
      return defaultLabel;
  }
}

function Key({
  label,
  shiftLabel,
  code,
  isPressed,
  isTested = false,
  flexGrow = 1,
  widthUnit = 1,
  heightUnit = 1,
  isCapsLockActive = false,
  isTarget = false,
  onKeyClick,
}: KeyProps) {
  const [isLocallyPressed, setIsLocallyPressed] = useState(false);

  const baseWidth = 60;
  const padding = 2;
  const nominalWidth = Math.round(baseWidth * widthUnit);
  const nominalHeight = heightUnit === 2 ? 108 : 52;
  const keyWidth = nominalWidth - padding * 2;
  const keyHeight = nominalHeight - padding * 2;

  const shadowHeight = 3;
  const effectivePressed = isPressed || isLocallyPressed;
  const pressOffsetY = effectivePressed ? shadowHeight : 0;
  const capHeight = keyHeight - shadowHeight;

  const isNavKey = [
    'Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown',
    'PrintScreen', 'ScrollLock', 'Pause',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  ].includes(code);

  const isFunctionKey = code === 'Escape' || (code.startsWith('F') && code.length <= 3);

  const isNumpadOperator = [
    'NumLock', 'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract',
    'NumpadAdd', 'NumpadEnter', 'NumpadDecimal',
  ].includes(code);

  const isSpecialKey = [
    'ShiftLeft', 'ShiftRight', 'Enter', 'Space', 'Backspace', 'Tab',
    'CapsLock', 'MetaLeft', 'MetaRight', 'ControlLeft', 'ControlRight',
    'AltLeft', 'AltRight', 'ContextMenu', 'SymbolMode', 'SymbolPage2',
  ].includes(code) || isNavKey || isFunctionKey || isNumpadOperator;

  const isArrowKey =
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code) ||
    ['▲', '▼', '◀', '▶', '↑', '↓', '←', '→'].includes(label);

  const arrowDirection: 'up' | 'down' | 'left' | 'right' | null =
    code === 'ArrowUp' || label === '▲' || label === '↑'
      ? 'up'
      : code === 'ArrowDown' || label === '▼' || label === '↓'
      ? 'down'
      : code === 'ArrowLeft' || label === '◀' || label === '←'
      ? 'left'
      : code === 'ArrowRight' || label === '▶' || label === '→'
      ? 'right'
      : null;

  const hasHomingBar = ['KeyF', 'KeyJ'].includes(code);
  const mobileLabel = getMobileLabel(code, label);

  // --- Color logic ---
  const keyFill = effectivePressed
    ? 'var(--primary)'
    : isTested
    ? 'var(--primary)'
    : isTarget
    ? 'color-mix(in srgb, var(--primary) 28%, var(--key-normal-fill))'
    : isSpecialKey
    ? 'var(--key-special-fill)'
    : 'var(--key-normal-fill)';

  const keyStroke = effectivePressed || isTarget || isTested
    ? 'var(--primary)'
    : isSpecialKey
    ? 'var(--key-special-stroke)'
    : 'var(--key-normal-stroke)';

  const baseShadowFill = effectivePressed
    ? 'var(--primary)'
    : isTested
    ? 'color-mix(in srgb, var(--primary) 70%, black)'
    : isTarget
    ? 'color-mix(in srgb, var(--primary) 40%, var(--key-shadow-normal))'
    : isSpecialKey
    ? 'var(--key-shadow-special)'
    : 'var(--key-shadow-normal)';

  const textColorClass = effectivePressed || isTested
    ? '!fill-[var(--primary-foreground)] font-bold'
    : isTarget
    ? '!fill-primary font-extrabold'
    : '';

  const isInteractive = Boolean(onKeyClick);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!onKeyClick) return;
      e.preventDefault();
      setIsLocallyPressed(true);
      onKeyClick(code, label, shiftLabel);
    },
    [code, label, shiftLabel, onKeyClick]
  );

  const handlePointerUp = useCallback(() => {
    setIsLocallyPressed(false);
  }, []);

  const handlePointerCancel = useCallback(() => {
    setIsLocallyPressed(false);
  }, []);

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={-1}
      aria-label={label || code}
      onPointerDown={isInteractive ? handlePointerDown : undefined}
      onPointerUp={isInteractive ? handlePointerUp : undefined}
      onPointerLeave={isInteractive ? handlePointerCancel : undefined}
      onPointerCancel={isInteractive ? handlePointerCancel : undefined}
      className={`relative select-none shrink-0 min-w-0 ${
        heightUnit === 2
          ? 'h-full min-h-[84px] xs:min-h-[92px] sm:min-h-[96px] md:min-h-[108px]'
          : 'h-10 xs:h-11 sm:h-11 md:h-[52px]'
      } ${
        isInteractive
          ? 'touch-manipulation cursor-pointer'
          : 'cursor-default pointer-events-none'
      }`}
      style={{
        flexGrow: flexGrow,
        flexShrink: flexGrow,
        flexBasis: `${nominalWidth}px`,
        maxWidth: code === 'Space' ? '380px' : 'none',
        height: heightUnit === 2 ? '100%' : undefined,
      }}
    >
      <svg
        viewBox={`0 0 ${nominalWidth} ${nominalHeight}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Shadow / side of the keycap */}
        <rect
          x={padding}
          y={padding + shadowHeight}
          width={keyWidth}
          height={capHeight}
          rx={6}
          ry={6}
          fill={baseShadowFill}
        />

        {/* Animated key group */}
        <g
          style={{
            transform: `translateY(${pressOffsetY}px)`,
            transition: 'transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Key cap base */}
          <rect
            x={padding}
            y={padding}
            width={keyWidth}
            height={capHeight}
            rx={6}
            ry={6}
            fill={keyFill}
            stroke={keyStroke}
            strokeWidth={isTarget ? 1.8 : 0.8}
          />

          {/* Target Key Pulsing Glow Ring */}
          {isTarget && !effectivePressed && (
            <rect
              x={padding + 1.5}
              y={padding + 1.5}
              width={keyWidth - 3}
              height={capHeight - 3}
              rx={5}
              ry={5}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1.5}
              className="animate-pulse"
            />
          )}

          {/* Homing bar for F and J keys (Desktop only) */}
          {hasHomingBar && (
            <line
              x1={padding + keyWidth / 2 - 6}
              y1={padding + capHeight - 7}
              x2={padding + keyWidth / 2 + 6}
              y2={padding + capHeight - 7}
              className="hidden sm:block"
              stroke={
                effectivePressed
                  ? 'var(--key-pressed-text)'
                  : 'var(--key-normal-text)'
              }
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.5}
            />
          )}

          {/* CapsLock indicator LED */}
          {isCapsLockActive && (
            <>
              <circle
                cx={padding + 12}
                cy={padding + 12}
                r={3}
                fill="#10b981"
                opacity={0.3}
              />
              <circle
                cx={padding + 12}
                cy={padding + 12}
                r={2}
                fill="#34d399"
                className="animate-pulse"
              />
            </>
          )}

          {/* Key labels */}
          {shiftLabel && !isSpecialKey ? (
            <>
              {/* Superscript number hint (like Samsung keyboard) */}
              <text
                x={padding + keyWidth / 2}
                y={padding + 11}
                className={`font-sans text-[10px] sm:text-[11px] font-medium fill-[var(--key-special-text)] opacity-70 pointer-events-none transition-colors duration-100 ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {shiftLabel}
              </text>
              {/* Main character label */}
              <text
                x={padding + keyWidth / 2}
                y={padding + capHeight - 14}
                className={`font-sans text-[15px] sm:text-[17px] font-semibold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-100 ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
            </>
          ) : isSpecialKey && mobileLabel !== label ? (
            <>
              {/* Full label on desktop */}
              <text
                x={padding + keyWidth / 2}
                y={padding + capHeight / 2 + 1}
                className={`hidden sm:block font-sans pointer-events-none transition-colors duration-100 text-[11px] font-semibold fill-[var(--key-special-text)] tracking-wide ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
              {/* Mobile compact symbol */}
              <text
                x={padding + keyWidth / 2}
                y={padding + capHeight / 2 + 1}
                className={`sm:hidden font-sans pointer-events-none transition-colors duration-100 text-[13px] font-bold fill-[var(--key-special-text)] ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {mobileLabel}
              </text>
            </>
          ) : isArrowKey && arrowDirection ? (
            <g
              className={`transition-colors duration-100 ${
                effectivePressed || isTested
                  ? '!text-[var(--primary-foreground)]'
                  : isTarget
                  ? '!text-primary'
                  : 'text-[var(--key-special-text)]'
              }`}
            >
              {/* Subtle keycap recess circle */}
              <circle
                cx={padding + keyWidth / 2}
                cy={padding + capHeight / 2 + 0.5}
                r={13}
                className={`transition-all duration-100 ${
                  effectivePressed || isTested
                    ? 'fill-white/20'
                    : 'fill-foreground/[0.04]'
                }`}
              />
              <svg
                x={padding + keyWidth / 2 - 10}
                y={padding + capHeight / 2 - 9.5}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="overflow-visible"
              >
                {arrowDirection === 'up' && (
                  <>
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </>
                )}
                {arrowDirection === 'down' && (
                  <>
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </>
                )}
                {arrowDirection === 'left' && (
                  <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </>
                )}
                {arrowDirection === 'right' && (
                  <>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </>
                )}
              </svg>
            </g>
          ) : (
            <text
              x={padding + keyWidth / 2}
              y={padding + capHeight / 2 + 1}
              className={`font-sans pointer-events-none transition-colors duration-100 ${
                code === 'Space'
                  ? 'text-[11px] sm:text-[13px] font-medium tracking-wider fill-[var(--key-special-text)] opacity-75'
                  : label.length >= 6
                  ? 'text-[9.5px] sm:text-[10.5px] font-bold tracking-tighter fill-[var(--key-special-text)]'
                  : label.length >= 4
                  ? 'text-[10px] sm:text-[11px] font-bold tracking-tight fill-[var(--key-special-text)]'
                  : label.length === 3 && isSpecialKey
                  ? 'text-[11px] sm:text-[12px] font-bold tracking-tight fill-[var(--key-special-text)]'
                  : isSpecialKey
                  ? 'text-[11.5px] sm:text-[12.5px] font-bold fill-[var(--key-special-text)] tracking-wide'
                  : 'text-[15px] sm:text-[18px] font-semibold fill-[var(--key-normal-text)]'
              } ${textColorClass}`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}

export default memo(Key);
