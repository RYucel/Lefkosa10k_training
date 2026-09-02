let audioCtx: AudioContext | null = null;

export function playAthleticBeep(type: 'beep' | 'whistle' | 'success' = 'beep') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    if (type === 'whistle') {
      // Düdük / Start Sinyali
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(1800, t + 0.35);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (type === 'success') {
      // 3 tonlu başarı sesi
      [[523.25, 0, 0.1], [659.25, 0.1, 0.1], [783.99, 0.2, 0.25]].forEach(([freq, at, dur]) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + at);
        gain.gain.linearRampToValueAtTime(0.18, t + at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t + at);
        osc.stop(t + at + dur + 0.05);
      });
    } else {
      // İki tonlu bildirim ve sayaç bip sesi
      [[880, 0, 0.1], [1174.7, 0.13, 0.18]].forEach(([freq, at, dur]) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + at);
        gain.gain.linearRampToValueAtTime(0.16, t + at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t + at);
        osc.stop(t + at + dur + 0.05);
      });
    }
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

export function triggerVibrate(pattern: number | number[] = [120, 60, 120]) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {}
}
