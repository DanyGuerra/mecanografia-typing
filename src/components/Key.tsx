'use client';

import React, { memo, useState, useCallback } from 'react';

interface KeyProps {
  label: string;
  shiftLabel?: string;
  code: string;
  isPressed: boolean;
  flexGrow?: number;
  widthUnit?: number;
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
    default:
      return defaultLabel;
  }
}

function Key({
  label,
  shiftLabel,
  code,
  isPressed,
  flexGrow = 1,
  widthUnit = 1,
  isCapsLockActive = false,
  isTarget = false,
  onKeyClick,
}: KeyProps) {
  const [isLocallyPressed, setIsLocallyPressed] = useState(false);

  const baseWidth = 60;
  const padding = 2;
  const nominalWidth = Math.round(baseWidth * widthUnit);
  const nominalHeight = 52;
  const keyWidth = nominalWidth - padding * 2;
  const keyHeight = nominalHeight - padding * 2;

  const shadowHeight = 3;
  const effectivePressed = isPressed || isLocallyPressed;
  const pressOffsetY = effectivePressed ? shadowHeight : 0;
  const capHeight = keyHeight - shadowHeight;

  const isSpecialKey = [
    'ShiftLeft', 'ShiftRight', 'Enter', 'Space', 'Backspace', 'Tab',
    'CapsLock', 'MetaLeft', 'MetaRight', 'ControlLeft', 'ControlRight',
    'AltLeft', 'AltRight', 'ContextMenu',
  ].includes(code);

  const hasHomingBar = ['KeyF', 'KeyJ'].includes(code);
  const mobileLabel = getMobileLabel(code, label);

  // --- Color logic ---
  const keyFill = effectivePressed
    ? 'var(--primary)'
    : isTarget
    ? 'color-mix(in srgb, var(--primary) 28%, var(--key-normal-fill))'
    : isSpecialKey
    ? 'var(--key-special-fill)'
    : 'var(--key-normal-fill)';

  const keyStroke = effectivePressed || isTarget
    ? 'var(--primary)'
    : isSpecialKey
    ? 'var(--key-special-stroke)'
    : 'var(--key-normal-stroke)';

  const baseShadowFill = effectivePressed
    ? 'var(--primary)'
    : isTarget
    ? 'color-mix(in srgb, var(--primary) 40%, var(--key-shadow-normal))'
    : isSpecialKey
    ? 'var(--key-shadow-special)'
    : 'var(--key-shadow-normal)';

  const textColorClass = effectivePressed
    ? '!fill-[var(--primary-foreground)]'
    : isTarget
    ? '!fill-primary font-extrabold'
    : '';

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsLocallyPressed(true);
      if (onKeyClick) {
        onKeyClick(code, label, shiftLabel);
      }
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
      role="button"
      tabIndex={-1}
      aria-label={label || code}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      className="relative select-none shrink-0 min-w-0 touch-manipulation cursor-pointer h-8 xs:h-9 sm:h-11 md:h-[52px]"
      style={{
        flexGrow: flexGrow,
        flexShrink: flexGrow,
        flexBasis: `${nominalWidth}px`,
        maxWidth: code === 'Space' ? '380px' : 'none',
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
          rx={5}
          ry={5}
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
            rx={5}
            ry={5}
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
              rx={4}
              ry={4}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1.5}
              className="animate-pulse"
            />
          )}

          {/* Homing bar for F and J keys */}
          {hasHomingBar && (
            <line
              x1={padding + keyWidth / 2 - 6}
              y1={padding + capHeight - 7}
              x2={padding + keyWidth / 2 + 6}
              y2={padding + capHeight - 7}
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
              <text
                x={padding + keyWidth / 2}
                y={padding + 14}
                className={`font-sans text-[11px] sm:text-[12px] font-medium fill-[var(--key-special-text)] pointer-events-none transition-colors duration-100 ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {shiftLabel}
              </text>
              <text
                x={padding + keyWidth / 2}
                y={padding + capHeight - 13}
                className={`font-sans text-[14px] sm:text-[17px] font-semibold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-100 ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
            </>
          ) : isSpecialKey && mobileLabel !== label ? (
            <>
              {/* Full label on medium/large screens */}
              <text
                x={padding + keyWidth / 2}
                y={padding + capHeight / 2 + 1}
                className={`hidden sm:block font-sans pointer-events-none transition-colors duration-100 text-[11px] font-semibold fill-[var(--key-special-text)] tracking-wide ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
              {/* Compact symbol/label on mobile screens */}
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
          ) : (
            <text
              x={padding + keyWidth / 2}
              y={padding + capHeight / 2 + 1}
              className={`font-sans pointer-events-none transition-colors duration-100 ${
                isSpecialKey
                  ? 'text-[10px] sm:text-[11px] font-semibold fill-[var(--key-special-text)] tracking-wide'
                  : 'text-[14px] sm:text-[18px] font-semibold fill-[var(--key-normal-text)]'
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
