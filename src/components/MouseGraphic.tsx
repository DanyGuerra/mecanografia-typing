'use client';

import React, { memo } from 'react';

export interface MouseState {
  isLeftPressed: boolean;
  isRightPressed: boolean;
  isMiddlePressed: boolean;
  isSideBackPressed: boolean;
  isSideForwardPressed: boolean;
  scrollDirection: 'up' | 'down' | null;
  lastAction: string;
}

interface MouseGraphicProps {
  mouseState: MouseState;
  className?: string;
  waitingText?: string;
}

function MouseGraphic({ mouseState, className = '', waitingText }: MouseGraphicProps) {
  const {
    isLeftPressed,
    isRightPressed,
    isMiddlePressed,
    isSideBackPressed,
    isSideForwardPressed,
    scrollDirection,
    lastAction,
  } = mouseState;

  // Active status checks
  const isAnyPressed =
    isLeftPressed ||
    isRightPressed ||
    isMiddlePressed ||
    isSideBackPressed ||
    isSideForwardPressed;

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Dynamic Ambient Underglow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-300 opacity-60 pointer-events-none"
        style={{
          background: isAnyPressed
            ? 'radial-gradient(circle, var(--primary) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(var(--primary-rgb, 120, 120, 120), 0.15) 0%, transparent 70%)',
          transform: isAnyPressed ? 'scale(1.15)' : 'scale(1)',
        }}
      />

      {/* SVG 3D Mouse Graphic */}
      <svg
        viewBox="0 0 320 460"
        className="w-full max-w-[320px] h-auto drop-shadow-2xl overflow-visible transition-transform duration-150"
        style={{
          transform: isAnyPressed ? 'scale(0.985) translateY(2px)' : 'scale(1)',
        }}
      >
        <defs>
          {/* Main Body Gradients */}
          <linearGradient id="mouseBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--key-normal-fill, #1e293b)" />
            <stop offset="100%" stopColor="var(--key-special-fill, #0f172a)" />
          </linearGradient>

          <linearGradient id="mouseShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--key-shadow-normal, #090d16)" />
            <stop offset="100%" stopColor="var(--key-shadow-special, #020617)" />
          </linearGradient>

          <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="primaryGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Shadow / 3D Side Elevation */}
        <path
          d="M 90,60 C 130,40 190,40 230,60 C 275,100 285,220 270,340 C 255,420 215,445 160,445 C 105,445 65,420 50,340 C 35,220 45,100 90,60 Z"
          fill="url(#mouseShadowGrad)"
          transform="translate(0, 10)"
        />

        {/* 2. Main Outer Body Shell */}
        <path
          d="M 90,60 C 130,40 190,40 230,60 C 275,100 285,220 270,340 C 255,420 215,445 160,445 C 105,445 65,420 50,340 C 35,220 45,100 90,60 Z"
          fill="url(#mouseBodyGrad)"
          stroke="var(--key-normal-stroke, rgba(255,255,255,0.15))"
          strokeWidth="2.5"
        />

        {/* 3. Palm Rest Ergonomic Curve Details */}
        <path
          d="M 100,240 C 135,225 185,225 220,240 C 245,300 240,380 160,425 C 80,380 75,300 100,240 Z"
          fill="none"
          stroke="var(--key-normal-stroke, rgba(255,255,255,0.1))"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Brand/Accent Light Strip at Palm */}
        <path
          d="M 125,370 Q 160,385 195,370"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-300"
          opacity={isAnyPressed ? 1 : 0.4}
          filter={isAnyPressed ? 'url(#primaryGlow)' : undefined}
        />

        {/* 4. Left Click Button (LMB) */}
        <g
          style={{
            transform: isLeftPressed ? 'translateY(3px) scale(0.985)' : 'translateY(0)',
            transformOrigin: '100px 120px',
            transition: 'transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path
            d="M 90,60 C 120,47 150,45 152,45 L 152,195 C 120,190 70,175 60,140 C 50,110 65,78 90,60 Z"
            fill={isLeftPressed ? 'var(--primary)' : 'var(--key-normal-fill, #1e293b)'}
            stroke={isLeftPressed ? 'var(--primary)' : 'var(--key-normal-stroke, rgba(255,255,255,0.2))'}
            strokeWidth={isLeftPressed ? '3' : '2'}
            className="cursor-pointer transition-colors duration-100"
          />
          {/* LMB Label & Visual Ripples */}
          <text
            x="105"
            y="120"
            fill={isLeftPressed ? 'var(--primary-foreground)' : 'var(--key-normal-text, #94a3b8)'}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            className="pointer-events-none transition-colors"
          >
            LMB
          </text>
          {isLeftPressed && (
            <circle
              cx="105"
              cy="115"
              r="22"
              fill="none"
              stroke="var(--primary-foreground)"
              strokeWidth="2"
              className="animate-ping opacity-75"
            />
          )}
        </g>

        {/* 5. Right Click Button (RMB) */}
        <g
          style={{
            transform: isRightPressed ? 'translateY(3px) scale(0.985)' : 'translateY(0)',
            transformOrigin: '220px 120px',
            transition: 'transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path
            d="M 230,60 C 200,47 170,45 168,45 L 168,195 C 200,190 250,175 260,140 C 270,110 255,78 230,60 Z"
            fill={isRightPressed ? 'var(--primary)' : 'var(--key-normal-fill, #1e293b)'}
            stroke={isRightPressed ? 'var(--primary)' : 'var(--key-normal-stroke, rgba(255,255,255,0.2))'}
            strokeWidth={isRightPressed ? '3' : '2'}
            className="cursor-pointer transition-colors duration-100"
          />
          {/* RMB Label & Visual Ripples */}
          <text
            x="215"
            y="120"
            fill={isRightPressed ? 'var(--primary-foreground)' : 'var(--key-normal-text, #94a3b8)'}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            className="pointer-events-none transition-colors"
          >
            RMB
          </text>
          {isRightPressed && (
            <circle
              cx="215"
              cy="115"
              r="22"
              fill="none"
              stroke="var(--primary-foreground)"
              strokeWidth="2"
              className="animate-ping opacity-75"
            />
          )}
        </g>

        {/* Center Gap Channel */}
        <rect x="153" y="44" width="14" height="152" fill="var(--key-shadow-special, #020617)" rx="4" />

        {/* 6. Scroll Wheel & Middle Click (MMB) */}
        <g
          style={{
            transform: isMiddlePressed ? 'translateY(4px)' : 'translateY(0)',
            transition: 'transform 0.08s ease',
          }}
        >
          {/* Scroll Wheel Well Outer */}
          <rect
            x="148"
            y="70"
            width="24"
            height="58"
            rx="12"
            fill="var(--key-shadow-normal, #0f172a)"
            stroke={isMiddlePressed || scrollDirection ? 'var(--primary)' : 'var(--border)'}
            strokeWidth="2"
          />

          {/* Scroll Wheel Core */}
          <rect
            x="151"
            y="73"
            width="18"
            height="52"
            rx="9"
            fill={isMiddlePressed ? 'var(--primary)' : 'url(#wheelGrad)'}
            className="transition-colors duration-150"
          />

          {/* Scroll Wheel Ribs / Ridges (Animated when scrolling) */}
          <g
            style={{
              transform:
                scrollDirection === 'up'
                  ? 'translateY(-4px)'
                  : scrollDirection === 'down'
                    ? 'translateY(4px)'
                    : 'translateY(0)',
              transition: 'transform 0.15s ease-out',
            }}
          >
            <line x1="154" y1="82" x2="166" y2="82" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="154" y1="92" x2="166" y2="92" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="154" y1="102" x2="166" y2="102" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="154" y1="112" x2="166" y2="112" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* MMB Press Glow Ring */}
          {isMiddlePressed && (
            <rect
              x="146"
              y="68"
              width="28"
              height="62"
              rx="14"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </g>

        {/* Scroll Direction Indicators (Arrows) */}
        {scrollDirection === 'up' && (
          <path
            d="M 160,52 L 153,62 L 167,62 Z"
            fill="var(--primary)"
            className="animate-bounce"
            filter="url(#primaryGlow)"
          />
        )}
        {scrollDirection === 'down' && (
          <path
            d="M 160,142 L 153,132 L 167,132 Z"
            fill="var(--primary)"
            className="animate-bounce"
            filter="url(#primaryGlow)"
          />
        )}

        {/* 7. Side Thumb Button 1 (Back / M4) */}
        <g
          style={{
            transform: isSideBackPressed ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform 0.08s ease',
          }}
        >
          <path
            d="M 46,180 C 44,195 44,225 46,240 C 42,235 38,215 38,205 C 38,195 42,185 46,180 Z"
            fill={isSideBackPressed ? 'var(--primary)' : 'var(--key-special-fill, #334155)'}
            stroke={isSideBackPressed ? 'var(--primary)' : 'var(--key-normal-stroke)'}
            strokeWidth="1.5"
            className="cursor-pointer transition-colors"
          />
          <text
            x="24"
            y="212"
            fill={isSideBackPressed ? 'var(--primary)' : 'var(--muted-foreground)'}
            fontSize="10"
            fontWeight="bold"
            className="pointer-events-none"
          >
            M4
          </text>
        </g>

        {/* 8. Side Thumb Button 2 (Forward / M5) */}
        <g
          style={{
            transform: isSideForwardPressed ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform 0.08s ease',
          }}
        >
          <path
            d="M 48,125 C 46,140 46,165 48,175 C 43,170 39,155 39,148 C 39,140 43,130 48,125 Z"
            fill={isSideForwardPressed ? 'var(--primary)' : 'var(--key-special-fill, #334155)'}
            stroke={isSideForwardPressed ? 'var(--primary)' : 'var(--key-normal-stroke)'}
            strokeWidth="1.5"
            className="cursor-pointer transition-colors"
          />
          <text
            x="24"
            y="152"
            fill={isSideForwardPressed ? 'var(--primary)' : 'var(--muted-foreground)'}
            fontSize="10"
            fontWeight="bold"
            className="pointer-events-none"
          >
            M5
          </text>
        </g>
      </svg>

      {/* Floating Status Pill */}
      <div className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-background/90 border border-border shadow-xs backdrop-blur-md whitespace-nowrap min-w-max">
        <span
          className={`size-2 rounded-full shrink-0 ${isAnyPressed || scrollDirection ? 'bg-primary animate-ping' : 'bg-muted-foreground/40'
            }`}
        />
        <span className="text-[11px] font-extrabold tracking-wide text-foreground whitespace-nowrap">
          {lastAction || waitingText}
        </span>
      </div>
    </div>
  );
}

export default memo(MouseGraphic);
