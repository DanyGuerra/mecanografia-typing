'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import MouseGraphic, { type MouseState } from './MouseGraphic';
import { ACCENT_COLORS, type AccentColorKey } from '@/hooks/useAccentColor';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  type: 'spark' | 'ring' | 'text' | 'star' | 'wave';
  text?: string;
  ringRadius?: number;
  maxRadius?: number;
}

interface MouseAnimationCanvasProps {
  mouseState: MouseState;
  accentColor?: AccentColorKey;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  t: {
    clickArenaPrompt: string;
    leftClick: string;
    rightClick: string;
    middleClick: string;
    sideBack: string;
    sideForward: string;
    scrollUp: string;
    scrollDown: string;
    waitingClick?: string;
  };
}

export default function MouseAnimationCanvas({
  mouseState,
  accentColor = 'blue',
  onMouseDown,
  onMouseUp,
  onWheel,
  onMouseMove,
  t,
}: MouseAnimationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const particleIdCounter = useRef(0);

  const currentAccent = ACCENT_COLORS.find((c) => c.key === accentColor) ?? ACCENT_COLORS[0];
  const accentHex = currentAccent.hex;

  const accentHexRef = useRef(accentHex);
  useEffect(() => {
    accentHexRef.current = accentHex;
  }, [accentHex]);

  // Resize canvas to match container size dynamically
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Main Canvas Render Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || canvas.width;
      const height = rect?.height || canvas.height;

      // Clear & draw background with ambient grid
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid pattern
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ultra-Luminous Cursor Follower Glow with Additive Bloom (lighter mode)
      if (mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;
        const color = accentHexRef.current;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 1. Massive 280px Soft Atmosphere Aura
        const ambientGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        ambientGrad.addColorStop(0, `${color}b3`);
        ambientGrad.addColorStop(0.25, `${color}66`);
        ambientGrad.addColorStop(0.55, `${color}26`);
        ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = ambientGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. 80px Concentrated Energy Field
        const midGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        midGrad.addColorStop(0, `${color}ff`);
        midGrad.addColorStop(0.4, `${color}d0`);
        midGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = midGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fill();

        // 3. 20px Intense Luminous Hot Spot
        const coreGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 20);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.45, color);
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 20, 0, Math.PI * 2);
        ctx.fill();

        // 4. Animated Pulsating Energy Halo Ring around Pointer
        const pulseRadius = 24 + Math.sin(now * 0.005) * 4;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(mx, my, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }
      ctx.restore();

      // Update & Render Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += delta;
        const progress = p.life / p.maxLife;

        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();

        if (p.type === 'ring') {
          // Shockwave Expanding Ring
          const currentRadius = (p.ringRadius || 5) + (p.maxRadius || 120) * Math.sin((progress * Math.PI) / 2);
          const alpha = (1 - progress) * p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.max(1, 6 * (1 - progress));
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
        } else if (p.type === 'spark' || p.type === 'star') {
          // Particle Spark / Burst Dot
          p.x += p.vx * delta * 60;
          p.y += p.vy * delta * 60;
          p.vx *= 0.96; // friction
          p.vy *= 0.96;
          const alpha = (1 - progress) * p.alpha;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.size * (1 - progress * 0.5)), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();

          // Particle Trail Line
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (p.type === 'text') {
          // Floating Text Badge (+1 LEFT / +1 RIGHT)
          p.y += p.vy * delta * 60;
          const alpha = (1 - progress) * p.alpha;

          ctx.font = '900 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fillText(p.text || '', p.x, p.y);
        } else if (p.type === 'wave') {
          // Scroll Wave Line
          p.y += p.vy * delta * 60;
          const alpha = (1 - progress) * p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Spawn Left Click Explosive Particles (Accent Color)
  const spawnLeftClickFX = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const mainColor = accentHexRef.current;
    const subColor = '#ffffff';

    // 1. Double Shockwave Rings
    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y,
      vx: 0,
      vy: 0,
      size: 0,
      color: mainColor,
      alpha: 0.95,
      maxLife: 0.5,
      life: 0,
      type: 'ring',
      ringRadius: 5,
      maxRadius: 130,
    });
    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y,
      vx: 0,
      vy: 0,
      size: 0,
      color: mainColor,
      alpha: 0.7,
      maxLife: 0.65,
      life: 0,
      type: 'ring',
      ringRadius: 2,
      maxRadius: 85,
    });

    // 2. 24 Radial Burst Sparks
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const speed = 4 + Math.random() * 8;
      newParticles.push({
        id: particleIdCounter.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: i % 2 === 0 ? mainColor : subColor,
        alpha: 1,
        maxLife: 0.4 + Math.random() * 0.3,
        life: 0,
        type: 'spark',
      });
    }

    // 3. Floating Text Badge
    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y: y - 20,
      vx: 0,
      vy: -1.4,
      size: 16,
      color: mainColor,
      alpha: 1,
      maxLife: 0.8,
      life: 0,
      type: 'text',
      text: `+1 ${t.leftClick.toUpperCase()}`,
    });

    particlesRef.current.push(...newParticles);
  };

  // Spawn Right Click Explosive Particles (Accent Color)
  const spawnRightClickFX = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const mainColor = accentHexRef.current;
    const subColor = '#ffffff';

    // 1. Dual Ring Shockwave
    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y,
      vx: 0,
      vy: 0,
      size: 0,
      color: mainColor,
      alpha: 0.95,
      maxLife: 0.55,
      life: 0,
      type: 'ring',
      ringRadius: 5,
      maxRadius: 140,
    });
    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y,
      vx: 0,
      vy: 0,
      size: 0,
      color: mainColor,
      alpha: 0.75,
      maxLife: 0.7,
      life: 0,
      type: 'ring',
      ringRadius: 2,
      maxRadius: 95,
    });

    // 2. 28 Particle Splash Burst
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 5 + Math.random() * 9;
      newParticles.push({
        id: particleIdCounter.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3.5 + Math.random() * 4,
        color: i % 2 === 0 ? mainColor : subColor,
        alpha: 1,
        maxLife: 0.45 + Math.random() * 0.35,
        life: 0,
        type: 'spark',
      });
    }

    // 3. Floating Text Badge
    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y: y - 20,
      vx: 0,
      vy: -1.4,
      size: 16,
      color: mainColor,
      alpha: 1,
      maxLife: 0.8,
      life: 0,
      type: 'text',
      text: `+1 ${t.rightClick.toUpperCase()}`,
    });

    particlesRef.current.push(...newParticles);
  };

  // Spawn Middle Click / Scroll FX (Accent Color)
  const spawnMiddleClickFX = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const mainColor = accentHexRef.current;

    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y,
      vx: 0,
      vy: 0,
      size: 0,
      color: mainColor,
      alpha: 0.9,
      maxLife: 0.5,
      life: 0,
      type: 'ring',
      ringRadius: 5,
      maxRadius: 110,
    });

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      newParticles.push({
        id: particleIdCounter.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: mainColor,
        alpha: 1,
        maxLife: 0.4 + Math.random() * 0.3,
        life: 0,
        type: 'spark',
      });
    }

    newParticles.push({
      id: particleIdCounter.current++,
      x,
      y: y - 20,
      vx: 0,
      vy: -1.4,
      size: 16,
      color: mainColor,
      alpha: 1,
      maxLife: 0.8,
      life: 0,
      type: 'text',
      text: `+1 ${t.middleClick.toUpperCase()}`,
    });

    particlesRef.current.push(...newParticles);
  };

  const lastScrollTextTimeRef = useRef(0);

  // Spawn Scroll FX (Accent Color)
  const spawnScrollFX = (x: number, y: number, dir: 'up' | 'down') => {
    const newParticles: Particle[] = [];
    const color = accentHexRef.current;
    const vy = dir === 'up' ? -3 : 3;

    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: particleIdCounter.current++,
        x: x + (Math.random() * 60 - 30),
        y: y + (Math.random() * 20 - 10),
        vx: (Math.random() - 0.5) * 2,
        vy,
        size: 3.5 + Math.random() * 3,
        color,
        alpha: 0.9,
        maxLife: 0.45,
        life: 0,
        type: 'wave',
      });
    }

    // Only spawn ONE single floating text label per 350ms window
    const now = Date.now();
    if (now - lastScrollTextTimeRef.current > 350) {
      lastScrollTextTimeRef.current = now;
      newParticles.push({
        id: particleIdCounter.current++,
        x,
        y: y + (dir === 'up' ? -25 : 25),
        vx: 0,
        vy: dir === 'up' ? -1.2 : 1.2,
        size: 14,
        color,
        alpha: 1,
        maxLife: 0.6,
        life: 0,
        type: 'text',
        text: dir === 'up' ? `▲ ${t.scrollUp.toUpperCase()}` : `▼ ${t.scrollDown.toUpperCase()}`,
      });
    }

    particlesRef.current.push(...newParticles);
  };

  const spawnScrollFXRef = useRef(spawnScrollFX);
  useEffect(() => {
    spawnScrollFXRef.current = spawnScrollFX;
  });

  const onWheelRef = useRef(onWheel);
  useEffect(() => {
    onWheelRef.current = onWheel;
  });

  // Attach non-passive native wheel listener to block page scroll while scrolling inside the canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dir = e.deltaY < 0 ? 'up' : 'down';

      spawnScrollFXRef.current(x, y, dir);

      onWheelRef.current({
        deltaY: e.deltaY,
        preventDefault: () => {},
      } as React.WheelEvent);
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  // Internal Canvas Event Handlers wrapping parent callbacks
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 0) {
      spawnLeftClickFX(x, y);
    } else if (e.button === 2) {
      spawnRightClickFX(x, y);
    } else if (e.button === 1 || e.button === 3 || e.button === 4) {
      spawnMiddleClickFX(x, y);
    }

    onMouseDown(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    onMouseMove(e);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={handleCanvasMouseMove}
      className="relative w-full h-[460px] bg-gradient-to-b from-card to-background rounded-none border-2 shadow-xl overflow-hidden cursor-crosshair select-none group transition-colors duration-300"
      style={{
        borderColor: `${accentHex}75`,
        boxShadow: `0 0 30px ${accentHex}25, inset 0 0 20px ${accentHex}0d`,
      }}
    >
      {/* HTML5 Particle Animation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ANCHORED AT BOTTOM CENTER: Small Sleek 3D Mouse Graphic */}
      <div className="absolute bottom-3 inset-x-0 mx-auto w-fit flex flex-col items-center pointer-events-none">
        <div className="p-2.5 px-3.5 rounded-2xl bg-background/85 border border-border/80 shadow-2xl backdrop-blur-md flex flex-col items-center transition-transform group-hover:scale-105 min-w-[140px]">
          <MouseGraphic mouseState={mouseState} waitingText={t.waitingClick} className="w-24 sm:w-28 h-auto" />
        </div>
      </div>
    </div>
  );
}
