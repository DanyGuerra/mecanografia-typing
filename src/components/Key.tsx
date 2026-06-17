'use client';

import React from 'react';
import styles from './Key.module.css';

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
  const nominalHeight = 52;
  const keyWidth = nominalWidth - padding * 2;
  const keyHeight = nominalHeight - padding * 2;

  const shadowHeight = 2.5;
  const pressOffsetY = isPressed ? shadowHeight : 0;
  const capHeight = keyHeight - shadowHeight;

  const isSpecialKey = widthUnit > 1.2 || ['ShiftLeft', 'ShiftRight', 'Enter', 'Space', 'Backspace', 'Tab', 'CapsLock'].includes(code);

  const normalFill = '#222222';
  const normalBorder = '#2e2e2e';
  const specialFill = '#1c1c1c';
  const specialBorder = '#262626';
  
  const pressedFill = '#e5e7eb';
  const pressedBorder = '#ffffff';

  const baseShadowFill = isPressed 
    ? '#a3a3a3' 
    : (isSpecialKey ? '#0a0a0a' : '#0e0e0e');

  return (
    <div
      className={styles.keyContainer}
      style={{
        flexGrow: flexGrow,
        flexBasis: `${nominalWidth}px`,
        maxWidth: code === 'Space' ? '380px' : 'none',
      }}
    >
      <svg
        viewBox={`0 0 ${nominalWidth} ${nominalHeight}`}
        className={`${styles.keySvg} ${isPressed ? styles.pressed : ''}`}
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
              y={padding + pressOffsetY + 14}
              className={`${styles.shiftLabelText} ${isPressed ? styles.pressedLabelTextDark : ''}`}
              dominantBaseline="middle"
            >
              {shiftLabel}
            </text>
            <text
              x={padding + keyWidth - 8}
              y={padding + pressOffsetY + capHeight - 11}
              className={`${styles.mainLabelTextWithShift} ${isPressed ? styles.pressedLabelTextDark : ''}`}
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
            className={`
              ${styles.labelText} 
              ${isSpecialKey ? styles.specialLabelText : ''} 
              ${isPressed ? styles.pressedLabelText : ''}
            `}
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
