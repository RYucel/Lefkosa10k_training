import { useRef, useCallback } from 'react';

export function useIntervalAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playBeep = useCallback((freq = 880, duration = 0.15, type: OscillatorType = 'sine') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio beep error:', e);
    }
  }, []);

  const speak = useCallback((text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }, []);

  const cueCountdown = useCallback((secondsLeft: number) => {
    if (secondsLeft === 3) {
      playBeep(440, 0.1);
    } else if (secondsLeft === 2) {
      playBeep(440, 0.1);
    } else if (secondsLeft === 1) {
      playBeep(440, 0.1);
    } else if (secondsLeft === 0) {
      playBeep(880, 0.35, 'square');
    }
  }, [playBeep]);

  return {
    initAudio,
    playBeep,
    speak,
    cueCountdown,
  };
}
