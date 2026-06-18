'use client';

import React from 'react';

interface KeyProps {
  label: string;
  shiftLabel?: string;
  code: string;
  isPressed: boolean;
  flexGrow?: number;
  widthUnit?: number;
  isCapsLockActive?: boolean;
}

export default function Key({
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
  const nominalHeight = 58;
  const keyWidth = nominalWidth - padding * 2;
  const keyHeight = nominalHeight - padding * 2;

  const shadowHeight = 2.5;
  const pressOffsetY = isPressed ? shadowHeight : 0;
  const capHeight = keyHeight - shadowHeight;

  const isSpecialKey = ['ShiftLeft', 'ShiftRight', 'Enter', 'Space', 'Backspace', 'Tab', 'CapsLock', 'MetaLeft', 'MetaRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'ContextMenu'].includes(code);

  const normalFill = 'var(--key-normal-fill)';
  const normalBorder = 'var(--key-normal-stroke)';
  const specialFill = 'var(--key-special-fill)';
  const specialBorder = 'var(--key-special-stroke)';
  
  const pressedFill = 'var(--key-pressed-fill)';
  const pressedBorder = 'var(--key-pressed-stroke)';

  const baseShadowFill = isPressed 
    ? 'var(--key-shadow-pressed)' 
    : (isSpecialKey ? 'var(--key-shadow-special)' : 'var(--key-shadow-normal)');

  const hasHomingBar = ['KeyF', 'KeyJ'].includes(code);

  return (
    <div
      className="flex h-[58px] relative select-none"
      style={{
        flexGrow: flexGrow,
        flexBasis: `${nominalWidth}px`,
        maxWidth: code === 'Space' ? '380px' : 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${nominalWidth} ${nominalHeight}`}
        className={`w-full h-full overflow-visible ${isPressed ? '' : 'drop-shadow-[0_1.5px_1.5px_var(--key-shadow)]'}`}
        preserveAspectRatio="none"
      >
        <rect
          x={padding}
          y={padding + shadowHeight}
          width={keyWidth}
          height={capHeight}
          rx={4}
          ry={4}
          fill={baseShadowFill}
        />

        <g
          style={{
            transform: `translateY(${pressOffsetY}px)`,
            transition: 'transform 0.06s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <rect
            x={padding}
            y={padding}
            width={keyWidth}
            height={capHeight}
            rx={4}
            ry={4}
            fill={isPressed ? pressedFill : (isSpecialKey ? specialFill : normalFill)}
            stroke={isPressed ? pressedBorder : (isSpecialKey ? specialBorder : normalBorder)}
            strokeWidth={1}
          />

          {hasHomingBar && (
            <line
              x1={padding + (keyWidth / 2) - 5}
              y1={padding + (capHeight / 2) + 12}
              x2={padding + (keyWidth / 2) + 5}
              y2={padding + (capHeight / 2) + 12}
              stroke={isPressed ? 'var(--key-pressed-text)' : 'var(--key-normal-text)'}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.8}
            />
          )}

          {isCapsLockActive && (
            <circle
              cx={padding + 12}
              cy={padding + 12}
              r={2.5}
              fill="#10b981"
              className="animate-pulse"
            />
          )}

          {shiftLabel && !isSpecialKey ? (
            <>
              <text
                x={padding + (keyWidth / 2)}
                y={padding + 16}
                className={`font-sans text-[13px] font-semibold fill-[var(--key-special-text)] pointer-events-none transition-colors duration-75 ${isPressed ? '!fill-[var(--key-pressed-text)]' : ''}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {shiftLabel}
              </text>
              <text
                x={padding + (keyWidth / 2)}
                y={padding + capHeight - 14}
                className={`font-sans text-[18px] font-bold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-75 ${isPressed ? '!fill-[var(--key-pressed-text)]' : ''}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
            </>
          ) : (
            <text
              x={padding + (keyWidth / 2)}
              y={padding + (capHeight / 2) + 2}
              className={`font-sans text-[22px] font-bold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-75 ${
                isSpecialKey ? '!text-[13px] !font-bold !fill-[var(--key-special-text)] tracking-widest uppercase' : ''
              } ${isPressed ? '!fill-[var(--key-pressed-text)]' : ''}`}
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
