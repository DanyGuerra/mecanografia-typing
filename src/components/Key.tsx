'use client';

import React from 'react';

interface KeyProps {
  label: string;
  shiftLabel?: string;
  code: string;
  isPressed: boolean;
  flexGrow?: number;
  widthUnit?: number;
}

export default function Key({
  label,
  shiftLabel,
  code,
  isPressed,
  flexGrow = 1,
  widthUnit = 1,
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

  const isSpecialKey = widthUnit > 1.2 || ['ShiftLeft', 'ShiftRight', 'Enter', 'Space', 'Backspace', 'Tab', 'CapsLock'].includes(code);

  const normalFill = 'var(--key-normal-fill)';
  const normalBorder = 'var(--key-normal-stroke)';
  const specialFill = 'var(--key-special-fill)';
  const specialBorder = 'var(--key-special-stroke)';
  
  const pressedFill = 'var(--key-pressed-fill)';
  const pressedBorder = 'var(--key-pressed-stroke)';

  const baseShadowFill = isPressed 
    ? 'var(--key-shadow-pressed)' 
    : (isSpecialKey ? 'var(--key-shadow-special)' : 'var(--key-shadow-normal)');

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

        <rect
          x={padding}
          y={padding + pressOffsetY}
          width={keyWidth}
          height={capHeight}
          rx={4}
          ry={4}
          fill={isPressed ? pressedFill : (isSpecialKey ? specialFill : normalFill)}
          stroke={isPressed ? pressedBorder : (isSpecialKey ? specialBorder : normalBorder)}
          strokeWidth={1}
          style={{
            transition: 'transform 0.05s ease-out, fill 0.05s ease-out',
          }}
        />

        {shiftLabel && !isSpecialKey ? (
          <>
            <text
              x={padding + 8}
              y={padding + pressOffsetY + 15}
              className={`font-sans text-[10px] font-medium fill-[var(--key-special-text)] pointer-events-none transition-colors duration-75 ${isPressed ? '!fill-[var(--key-pressed-text)]' : ''}`}
              dominantBaseline="middle"
            >
              {shiftLabel}
            </text>
            <text
              x={padding + keyWidth - 8}
              y={padding + pressOffsetY + capHeight - 13}
              className={`font-sans text-[14px] font-semibold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-75 ${isPressed ? '!fill-[var(--key-pressed-text)]' : ''}`}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {label}
            </text>
          </>
        ) : (
          <text
            x={padding + (keyWidth / 2)}
            y={padding + pressOffsetY + (capHeight / 2) + 1.5}
            className={`font-sans text-[16px] font-semibold fill-[var(--key-normal-text)] pointer-events-none transition-colors duration-75 ${
              isSpecialKey ? 'text-[11.5px] font-medium fill-[var(--key-special-text)] tracking-wider' : ''
            } ${isPressed ? '!fill-[var(--key-pressed-text)]' : ''}`}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
