'use client';

import React, { memo } from 'react';

interface KeyProps {
  label: string;
  shiftLabel?: string;
  code: string;
  isPressed: boolean;
  flexGrow?: number;
  widthUnit?: number;
  isCapsLockActive?: boolean;
}

function Key({
  label,
  shiftLabel,
  code,
  isPressed,
  flexGrow = 1,
  widthUnit = 1,
  isCapsLockActive = false,
}: KeyProps) {
  const baseWidth = 60;
  const padding = 2;
  const nominalWidth = Math.round(baseWidth * widthUnit);
  const nominalHeight = 52;
  const keyWidth = nominalWidth - padding * 2;
  const keyHeight = nominalHeight - padding * 2;

  const shadowHeight = 3;
  const pressOffsetY = isPressed ? shadowHeight : 0;
  const capHeight = keyHeight - shadowHeight;

  const isSpecialKey = [
    'ShiftLeft', 'ShiftRight', 'Enter', 'Space', 'Backspace', 'Tab',
    'CapsLock', 'MetaLeft', 'MetaRight', 'ControlLeft', 'ControlRight',
    'AltLeft', 'AltRight', 'ContextMenu',
  ].includes(code);

  const hasHomingBar = ['KeyF', 'KeyJ'].includes(code);

  // --- Color logic ---
  const keyFill = isPressed
    ? 'var(--primary)'
    : isSpecialKey
    ? 'var(--key-special-fill)'
    : 'var(--key-normal-fill)';

  const keyStroke = isPressed
    ? 'var(--primary)'
    : isSpecialKey
    ? 'var(--key-special-stroke)'
    : 'var(--key-normal-stroke)';

  const baseShadowFill = isPressed
    ? 'var(--primary)'
    : isSpecialKey
    ? 'var(--key-shadow-special)'
    : 'var(--key-shadow-normal)';

  const textColorClass = isPressed
    ? '!fill-[var(--primary-foreground)]'
    : '';

  return (
    <div
      className="relative select-none"
      style={{
        flexGrow: flexGrow,
        flexBasis: `${nominalWidth}px`,
        height: `${nominalHeight}px`,
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
            strokeWidth={0.8}
          />

          {/* Homing bar for F and J keys */}
          {hasHomingBar && (
            <line
              x1={padding + keyWidth / 2 - 6}
              y1={padding + capHeight - 7}
              x2={padding + keyWidth / 2 + 6}
              y2={padding + capHeight - 7}
              stroke={
                isPressed
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
                y={padding + 15}
                className={`font-sans text-[12px] font-medium fill-[var(--key-special-text)] pointer-events-none transition-colors duration-100 ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {shiftLabel}
              </text>
              <text
                x={padding + keyWidth / 2}
                y={padding + capHeight - 13}
                className={`font-sans text-[17px] font-semibold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-100 ${textColorClass}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
            </>
          ) : (
            <text
              x={padding + keyWidth / 2}
              y={padding + capHeight / 2 + 1}
              className={`font-sans pointer-events-none transition-colors duration-100 ${
                isSpecialKey
                  ? 'text-[11px] font-semibold fill-[var(--key-special-text)] tracking-wide'
                  : 'text-[19px] font-semibold fill-[var(--key-normal-text)]'
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
