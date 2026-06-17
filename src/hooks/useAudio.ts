'use client';

import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playClick = useCallback((keyType: 'standard' | 'space' | 'backspace' = 'standard') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.connect(gainOsc);
      gainOsc.connect(ctx.destination);

      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      
      const gainNoise = ctx.createGain();
      noise.connect(filter);
      filter.connect(gainNoise);
      gainNoise.connect(ctx.destination);

      if (keyType === 'space') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
        
        gainOsc.gain.setValueAtTime(0.18, now);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        filter.frequency.setValueAtTime(800, now);
        gainNoise.gain.setValueAtTime(0.06, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        osc.start(now);
        osc.stop(now + 0.09);
        noise.start(now);
        noise.stop(now + 0.05);
      } else if (keyType === 'backspace') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        
        gainOsc.gain.setValueAtTime(0.22, now);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        filter.frequency.setValueAtTime(2500, now);
        gainNoise.gain.setValueAtTime(0.08, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        
        osc.start(now);
        osc.stop(now + 0.06);
        noise.start(now);
        noise.stop(now + 0.03);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
        
        gainOsc.gain.setValueAtTime(0.25, now);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        filter.frequency.setValueAtTime(4500, now);
        gainNoise.gain.setValueAtTime(0.12, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        
        osc.start(now);
        osc.stop(now + 0.05);
        noise.start(now);
        noise.stop(now + 0.02);
      }
    } catch (error) {
      console.warn("Failed to play synthesized click audio:", error);
    }
  }, [initAudio]);

  return { playClick };
}
