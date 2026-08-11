'use client';

import { useRef, useCallback, useEffect } from 'react';

const SOUND_FILES: Record<string, string[]> = {
  standard: ['/sounds/key_a.wav', '/sounds/key_b.wav', '/sounds/key_c.wav'],
  space: ['/sounds/key_space.wav'],
  backspace: ['/sounds/key_backspace.wav'],
  enter: ['/sounds/key_enter.wav'],
  mouse_left: ['/sounds/click_left.wav'],
  mouse_right: ['/sounds/click_rigth.wav'],
  mouse_middle: ['/sounds/click_middle.wav'],
  mouse_side: ['/sounds/click_left.wav'],
  mouse_scroll: ['/sounds/scroll_down.wav', '/sounds/scroll_up.wav'],
  mouse_scroll_up: ['/sounds/scroll_up.wav'],
  mouse_scroll_down: ['/sounds/scroll_down.wav'],
};

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const buffersRef = useRef<{ [key: string]: AudioBuffer[] }>({});
  const isLoadingRef = useRef<boolean>(false);

  const loadSounds = useCallback(async () => {
    if (typeof window === 'undefined' || isLoadingRef.current) return;
    isLoadingRef.current = true;

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }

    const ctx = audioCtxRef.current;
    if (!ctx) {
      isLoadingRef.current = false;
      return;
    }

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }

    try {
      const loadedBuffers: { [key: string]: AudioBuffer[] } = {};

      for (const [type, urls] of Object.entries(SOUND_FILES)) {
        const buffers = await Promise.all(
          urls.map(async (url) => {
            try {
              const res = await fetch(url);
              if (!res.ok) return null;
              const arrayBuffer = await res.arrayBuffer();
              return await ctx.decodeAudioData(arrayBuffer);
            } catch {
              return null;
            }
          })
        );
        loadedBuffers[type] = buffers.filter((b): b is AudioBuffer => b !== null);
      }

      buffersRef.current = loadedBuffers;
    } catch (err) {
      console.warn("Failed to load sound samples:", err);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    if (Object.keys(buffersRef.current).length === 0 && !isLoadingRef.current) {
      loadSounds();
    }
  }, [loadSounds]);

  useEffect(() => {
    loadSounds();
  }, [loadSounds]);

  const playBufferOrFallback = useCallback((categoryKey: string) => {
    const urls = SOUND_FILES[categoryKey] || SOUND_FILES.standard;
    if (!urls || urls.length === 0) return;

    const selectedUrl = urls[Math.floor(Math.random() * urls.length)];

    // Try Web Audio API first for zero-latency playback
    const ctx = audioCtxRef.current;
    const typeBuffers = buffersRef.current[categoryKey];

    if (ctx && ctx.state !== 'closed' && typeBuffers && typeBuffers.length > 0) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      try {
        const randomBuffer = typeBuffers[Math.floor(Math.random() * typeBuffers.length)];
        const source = ctx.createBufferSource();
        source.buffer = randomBuffer;
        source.playbackRate.value = 1.0;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 1.0;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch (err) {
        console.warn("Web Audio playback error, falling back to HTML5 Audio:", err);
      }
    }

    // HTML5 Audio fallback
    try {
      const audio = new Audio(selectedUrl);
      audio.volume = 1.0;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  const playClick = useCallback((keyType: 'standard' | 'space' | 'backspace' | 'enter' = 'standard') => {
    try {
      initAudio();
      playBufferOrFallback(keyType);
    } catch (error) {
      console.warn("Failed to play click audio:", error);
    }
  }, [initAudio, playBufferOrFallback]);

  const playMouseClick = useCallback((type: 'left' | 'right' | 'middle' | 'side' | 'scroll' | 'scroll_up' | 'scroll_down' = 'left') => {
    try {
      if (type.startsWith('scroll')) {
        const nowMs = Date.now();
        if (nowMs - lastScrollTimeRef.current < 100) {
          return;
        }
        lastScrollTimeRef.current = nowMs;
      }

      initAudio();

      const bufferKey = `mouse_${type}`;
      playBufferOrFallback(bufferKey);
    } catch (error) {
      console.warn("Failed to play mouse click audio:", error);
    }
  }, [initAudio, playBufferOrFallback]);

  return { playClick, playMouseClick };
}




