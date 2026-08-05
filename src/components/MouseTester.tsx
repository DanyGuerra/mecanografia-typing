'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MouseAnimationCanvas from './MouseAnimationCanvas';
import { type MouseState } from './MouseGraphic';
import { Button } from '@/components/ui/button';
import {
  MousePointer,
  RotateCcw,
  Zap,
  Gauge,
  Award,
  Timer,
  Sliders,
} from 'lucide-react';
import { type AccentColorKey } from '@/hooks/useAccentColor';

interface MouseTesterProps {
  soundEnabled: boolean;
  accentColor?: AccentColorKey;
  onPlaySound?: (type: 'left' | 'right' | 'middle' | 'side' | 'scroll') => void;
  t: {
    mouseTitle: string;
    mouseSubtitle: string;
    leftClick: string;
    rightClick: string;
    middleClick: string;
    sideBack: string;
    sideForward: string;
    scrollUp: string;
    scrollDown: string;
    totalClicks: string;
    cpsLabel: string;
    peakCpsLabel: string;
    latencyLabel: string;
    scrollDistance: string;
    resetStats: string;
    freeTestTab: string;
    cpsTestTab: string;
    startCpsTest: string;
    cpsTestTitle: string;
    cpsTestDesc: string;
    clickArenaPrompt: string;
    lastActionLabel: string;
    doubleClicks: string;
    waitingClick: string;
  };
}

export default function MouseTester({ soundEnabled, accentColor, onPlaySound, t }: MouseTesterProps) {
  // Active Mode: 'free' | 'cps'
  const [activeTab, setActiveTab] = useState<'free' | 'cps'>('free');

  // Mouse Buttons State
  const [mouseState, setMouseState] = useState<MouseState>({
    isLeftPressed: false,
    isRightPressed: false,
    isMiddlePressed: false,
    isSideBackPressed: false,
    isSideForwardPressed: false,
    scrollDirection: null,
    lastAction: '',
  });

  // Statistics
  const [stats, setStats] = useState({
    totalClicks: 0,
    leftClicks: 0,
    rightClicks: 0,
    middleClicks: 0,
    sideClicks: 0,
    doubleClicks: 0,
    scrollDistance: 0,
    peakCps: 0,
  });

  // Rolling CPS & Latency tracking
  const clickTimestampsRef = useRef<number[]>([]);
  const [currentCps, setCurrentCps] = useState(0);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const lastClickTimeRef = useRef<number | null>(null);

  // Position
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // CPS Speed Test State
  const [cpsTestState, setCpsTestState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [cpsTimeLeft, setCpsTimeLeft] = useState(5);
  const [cpsTestClicks, setCpsTestClicks] = useState(0);
  const cpsTestClicksRef = useRef(0);
  const [cpsTestResult, setCpsTestResult] = useState<number | null>(null);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Recalculate rolling CPS every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      clickTimestampsRef.current = clickTimestampsRef.current.filter((ts) => now - ts <= 1000);
      const cps = clickTimestampsRef.current.length;
      setCurrentCps(cps);
      setStats((prev) => ({
        ...prev,
        peakCps: Math.max(prev.peakCps, cps),
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Timer logic for 5s CPS Challenge (Independent of mouse clicks)
  useEffect(() => {
    if (cpsTestState !== 'running') return;

    const timer = setInterval(() => {
      setCpsTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCpsTestState('completed');
          const finalCps = parseFloat((cpsTestClicksRef.current / 5).toFixed(2));
          setCpsTestResult(finalCps);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cpsTestState]);

  const startCpsTest = () => {
    cpsTestClicksRef.current = 0;
    setCpsTestClicks(0);
    setCpsTimeLeft(5);
    setCpsTestResult(null);
    setCpsTestState('running');
  };

  const resetCpsTest = () => {
    cpsTestClicksRef.current = 0;
    setCpsTestState('idle');
    setCpsTimeLeft(5);
    setCpsTestClicks(0);
    setCpsTestResult(null);
  };

  // Sound trigger
  const triggerSound = useCallback(
    (type: 'left' | 'right' | 'middle' | 'side' | 'scroll') => {
      if (soundEnabled && onPlaySound) {
        onPlaySound(type);
      }
    },
    [soundEnabled, onPlaySound]
  );

  // Mouse Down Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    const now = Date.now();

    // Measure Latency
    if (lastClickTimeRef.current) {
      const diff = now - lastClickTimeRef.current;
      setLastLatencyMs(diff);
      if (diff < 150) {
        setStats((prev) => ({ ...prev, doubleClicks: prev.doubleClicks + 1 }));
      }
    }
    lastClickTimeRef.current = now;
    clickTimestampsRef.current.push(now);

    if (cpsTestState === 'running') {
      cpsTestClicksRef.current += 1;
      setCpsTestClicks(cpsTestClicksRef.current);
    }

    if (e.button === 0) {
      // Left Click
      setMouseState((prev) => ({ ...prev, isLeftPressed: true, lastAction: t.leftClick }));
      setStats((prev) => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        leftClicks: prev.leftClicks + 1,
      }));
      triggerSound('left');
    } else if (e.button === 2) {
      // Right Click
      setMouseState((prev) => ({ ...prev, isRightPressed: true, lastAction: t.rightClick }));
      setStats((prev) => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        rightClicks: prev.rightClicks + 1,
      }));
      triggerSound('right');
    } else if (e.button === 1) {
      // Middle Click
      setMouseState((prev) => ({ ...prev, isMiddlePressed: true, lastAction: t.middleClick }));
      setStats((prev) => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        middleClicks: prev.middleClicks + 1,
      }));
      triggerSound('middle');
    } else if (e.button === 3) {
      // Side Back
      setMouseState((prev) => ({ ...prev, isSideBackPressed: true, lastAction: t.sideBack }));
      setStats((prev) => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        sideClicks: prev.sideClicks + 1,
      }));
      triggerSound('side');
    } else if (e.button === 4) {
      // Side Forward
      setMouseState((prev) => ({ ...prev, isSideForwardPressed: true, lastAction: t.sideForward }));
      setStats((prev) => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        sideClicks: prev.sideClicks + 1,
      }));
      triggerSound('side');
    }
  };

  // Mouse Up Handler
  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) setMouseState((prev) => ({ ...prev, isLeftPressed: false }));
    if (e.button === 2) setMouseState((prev) => ({ ...prev, isRightPressed: false }));
    if (e.button === 1) setMouseState((prev) => ({ ...prev, isMiddlePressed: false }));
    if (e.button === 3) setMouseState((prev) => ({ ...prev, isSideBackPressed: false }));
    if (e.button === 4) setMouseState((prev) => ({ ...prev, isSideForwardPressed: false }));
  };

  // Wheel Handler
  const handleWheel = (e: React.WheelEvent) => {
    const dir = e.deltaY < 0 ? 'up' : 'down';
    const actionText = dir === 'up' ? t.scrollUp : t.scrollDown;

    setMouseState((prev) => ({
      ...prev,
      scrollDirection: dir,
      lastAction: actionText,
    }));

    setStats((prev) => ({
      ...prev,
      scrollDistance: prev.scrollDistance + 1,
    }));

    triggerSound('scroll');

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setMouseState((prev) => ({ ...prev, scrollDirection: null }));
    }, 300);
  };

  // Mouse Move tracking inside canvas
  const handleMouseMove = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setCursorPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  // Reset Stats
  const handleResetStats = () => {
    setStats({
      totalClicks: 0,
      leftClicks: 0,
      rightClicks: 0,
      middleClicks: 0,
      sideClicks: 0,
      doubleClicks: 0,
      scrollDistance: 0,
      peakCps: 0,
    });
    setLastLatencyMs(null);
    setCurrentCps(0);
    clickTimestampsRef.current = [];
  };

  const getCpsRank = (cps: number) => {
    if (cps >= 12) return { label: '⚡ Dios del Click (Rayo)', color: 'text-amber-400' };
    if (cps >= 9) return { label: '🐆 Guepardo Pro', color: 'text-emerald-400' };
    if (cps >= 7) return { label: '🚀 Veloz / Rápido', color: 'text-blue-400' };
    if (cps >= 4) return { label: '🎯 Normal / Promedio', color: 'text-purple-400' };
    return { label: '🐢 Relajado / Inicial', color: 'text-muted-foreground' };
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-muted/40 p-2.5 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'free' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('free')}
            className="rounded-xl font-bold gap-2 text-xs cursor-pointer"
          >
            <Sliders className="size-4" />
            <span>{t.freeTestTab}</span>
          </Button>

          <Button
            variant={activeTab === 'cps' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('cps')}
            className="rounded-xl font-bold gap-2 text-xs cursor-pointer"
          >
            <Zap className="size-4 text-amber-400" />
            <span>{t.cpsTestTab}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground hidden sm:inline-block">
            X: {cursorPos.x} | Y: {cursorPos.y}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetStats}
            className="rounded-xl text-xs gap-1.5 font-semibold hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>{t.resetStats}</span>
          </Button>
        </div>
      </div>

      {/* Primary Stage: Interactive Canvas with Small Mouse at Bottom Center */}
      {activeTab === 'free' ? (
        <MouseAnimationCanvas
          mouseState={mouseState}
          accentColor={accentColor}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          t={{
            clickArenaPrompt: t.clickArenaPrompt,
            leftClick: t.leftClick,
            rightClick: t.rightClick,
            middleClick: t.middleClick,
            sideBack: t.sideBack,
            sideForward: t.sideForward,
            scrollUp: t.scrollUp,
            scrollDown: t.scrollDown,
            waitingClick: t.waitingClick,
          }}
        />
      ) : (
        /* CPS Challenge Box */
        <div className="w-full h-[460px] flex flex-col items-center justify-center p-6 bg-card rounded-none border-2 border-border shadow-xl relative overflow-hidden">
          {cpsTestState === 'idle' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Timer className="size-12 text-amber-500" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-foreground">{t.cpsTestTitle}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">{t.cpsTestDesc}</p>
              </div>
              <Button
                size="lg"
                onClick={startCpsTest}
                className="mt-2 rounded-xl font-bold gap-2 px-8 bg-amber-500 hover:bg-amber-600 text-white shadow-lg cursor-pointer"
              >
                <Zap className="size-5" />
                <span>{t.startCpsTest}</span>
              </Button>
            </div>
          )}

          {cpsTestState === 'running' && (
            <div
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-amber-500/5 rounded-2xl border-2 border-amber-500/50 cursor-pointer select-none"
            >
              <div className="text-7xl font-black text-amber-500 font-mono animate-pulse">
                {cpsTimeLeft}s
              </div>
              <div className="text-4xl font-extrabold text-foreground">
                Clicks: <span className="text-primary">{cpsTestClicks}</span>
              </div>
              <p className="text-base font-bold text-muted-foreground animate-bounce">
                ¡Haz click lo más rápido posible!
              </p>
            </div>
          )}

          {cpsTestState === 'completed' && cpsTestResult !== null && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <Award className="size-12" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  Resultado Final
                </span>
                <h3 className="text-5xl font-black text-foreground mt-1">
                  {cpsTestResult} <span className="text-xl text-primary">CPS</span>
                </h3>
                <p className={`text-base font-bold mt-2 ${getCpsRank(cpsTestResult).color}`}>
                  {getCpsRank(cpsTestResult).label}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <Button
                  size="sm"
                  onClick={startCpsTest}
                  className="rounded-xl font-bold gap-2 bg-primary cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                  <span>Reintentar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCpsTest}
                  className="rounded-xl font-bold cursor-pointer"
                >
                  Volver
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Button Counts & Status Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${mouseState.isLeftPressed
              ? 'bg-primary/20 border-primary text-primary scale-105 shadow-md'
              : 'bg-card border-border text-muted-foreground'
            }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-extrabold">{t.leftClick}</span>
          <span className="text-lg font-black text-foreground">{stats.leftClicks}</span>
        </div>

        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${mouseState.isMiddlePressed
              ? 'bg-primary/20 border-primary text-primary scale-105 shadow-md'
              : 'bg-card border-border text-muted-foreground'
            }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-extrabold">{t.middleClick}</span>
          <span className="text-lg font-black text-foreground">{stats.middleClicks}</span>
        </div>

        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${mouseState.isRightPressed
              ? 'bg-primary/20 border-primary text-primary scale-105 shadow-md'
              : 'bg-card border-border text-muted-foreground'
            }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-extrabold">{t.rightClick}</span>
          <span className="text-lg font-black text-foreground">{stats.rightClicks}</span>
        </div>

        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${mouseState.scrollDirection
              ? 'bg-primary/20 border-primary text-primary scale-105 shadow-md'
              : 'bg-card border-border text-muted-foreground'
            }`}
        >
          <span className="text-[10px] uppercase tracking-wider font-extrabold">{t.scrollDistance}</span>
          <span className="text-lg font-black text-foreground">{stats.scrollDistance}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border text-center">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
            {t.doubleClicks}
          </span>
          <span className="text-lg font-black text-foreground">{stats.doubleClicks}</span>
        </div>
      </div>

      {/* Metrics Dashboard Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <MousePointer className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              {t.totalClicks}
            </span>
            <span className="text-xl font-black text-foreground">{stats.totalClicks}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Zap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              {t.cpsLabel}
            </span>
            <span className="text-xl font-black text-foreground">
              {currentCps} <span className="text-xs font-normal text-muted-foreground">({stats.peakCps} máx)</span>
            </span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Gauge className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              {t.latencyLabel}
            </span>
            <span className="text-xl font-black text-foreground">
              {lastLatencyMs !== null ? `${lastLatencyMs} ms` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
