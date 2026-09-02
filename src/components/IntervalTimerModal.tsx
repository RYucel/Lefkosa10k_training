import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, X, Zap, Heart, CheckCircle } from 'lucide-react';
import { WorkoutDay } from '../types/plan';
import { useIntervalAudio } from '../hooks/useIntervalAudio';
import confetti from 'canvas-confetti';

interface IntervalTimerModalProps {
  workout: WorkoutDay;
  onClose: () => void;
  onFinishWorkout?: () => void;
}

export function IntervalTimerModal({
  workout,
  onClose,
  onFinishWorkout,
}: IntervalTimerModalProps) {
  const steps = workout.intervalSteps && workout.intervalSteps.length > 0
    ? workout.intervalSteps
    : [
        { name: 'Isınma Koşusu', durationSec: 300, type: 'warmup' as const, targetPace: "6'00\"/km" },
        { name: 'Tempolu Koşu Bloğu', durationSec: workout.estimatedDurationMin ? (workout.estimatedDurationMin - 10) * 60 : 1800, type: 'work' as const, targetPace: workout.targetPace },
        { name: 'Soğuma Jog', durationSec: 300, type: 'cooldown' as const, targetPace: "6'15\"/km" },
      ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(steps[0].durationSec);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const { initAudio, playBeep, speak, cueCountdown } = useIntervalAudio();
  const currentStep = steps[currentStepIndex];

  // Total elapsed calculation
  const totalDurationSec = steps.reduce((sum, s) => sum + s.durationSec, 0);
  const completedDurationSec =
    steps.slice(0, currentStepIndex).reduce((sum, s) => sum + s.durationSec, 0) +
    (currentStep.durationSec - secondsRemaining);

  const overallProgress = Math.min(100, Math.round((completedDurationSec / totalDurationSec) * 100));
  const stepProgress = Math.min(
    100,
    Math.round(((currentStep.durationSec - secondsRemaining) / currentStep.durationSec) * 100)
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          const next = prev - 1;
          if (soundEnabled) {
            cueCountdown(next);
          }
          return next;
        });
      }, 1000);
    } else if (isActive && secondsRemaining <= 0) {
      // Step finished, go to next
      if (currentStepIndex < steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        const nextStep = steps[nextIndex];
        setCurrentStepIndex(nextIndex);
        setSecondsRemaining(nextStep.durationSec);

        if (soundEnabled) {
          playBeep(920, 0.4, 'triangle');
          speak(`${nextStep.name}, tempo: ${nextStep.targetPace || 'başla'}`);
        }
      } else {
        // Complete workout!
        setIsActive(false);
        setIsFinished(true);
        if (soundEnabled) {
          playBeep(1046, 0.6, 'triangle');
          speak('Tebrikler! Antrenman başarıyla tamamlandı!');
        }
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, currentStepIndex, steps, soundEnabled, cueCountdown, playBeep, speak]);

  const toggleStartPause = () => {
    initAudio();
    if (!isActive && currentStepIndex === 0 && secondsRemaining === steps[0].durationSec) {
      if (soundEnabled) {
        speak(`${currentStep.name} başlıyor!`);
      }
    }
    setIsActive(!isActive);
  };

  const skipStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setSecondsRemaining(steps[nextIndex].durationSec);
      if (soundEnabled) {
        speak(`Atlandı: ${steps[nextIndex].name}`);
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setSecondsRemaining(steps[0].durationSec);
    setIsFinished(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const getStepColorClass = (type: string) => {
    switch (type) {
      case 'work':
        return 'from-orange-500 to-red-500 text-orange-400';
      case 'rest':
        return 'from-emerald-500 to-teal-500 text-emerald-400';
      case 'warmup':
      case 'cooldown':
      default:
        return 'from-blue-500 to-indigo-500 text-blue-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Top Controls */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#0D0D0D]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-[#F5F5F5] uppercase tracking-wider">
              {workout.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                soundEnabled
                  ? 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  : 'border-slate-300 bg-slate-100 text-slate-500 dark:border-[#2E2E2E] dark:bg-[#1A1A1A] dark:text-[#808080]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:border-[#262626] dark:bg-[#1A1A1A] dark:text-[#808080] dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Finish Screen or Active Timer */}
        {isFinished ? (
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-[#F5F5F5]">Harika Koşu!</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#A3A3A3]">
                {workout.title} antrenmanı tüm intervalleriyle tamamlandı.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-4 rounded-2xl dark:border-[#222222] text-xs space-y-1.5 text-slate-700 dark:text-[#CCCCCC] text-left">
              <p>⏱️ Toplam Süre: <strong className="text-slate-900 dark:text-[#F5F5F5]">{formatTime(totalDurationSec)}</strong></p>
              <p>📍 Parkur: <strong className="text-slate-900 dark:text-[#F5F5F5]">{workout.track}</strong></p>
              <p>🎯 Hedef Pace: <strong className="text-slate-900 dark:text-[#F5F5F5]">{workout.targetPace}</strong></p>
              <p>💧 Şimdi 1 şişe maden suyu veya tuzlu limonlu su içmeyi unutma!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onFinishWorkout?.();
                  onClose();
                }}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Antrenmanı Kaydet & Kapat
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Step Counter & Category */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 dark:bg-[#1A1A1A] px-3 py-1 text-xs font-semibold text-slate-700 dark:text-[#CCCCCC] dark:border-[#2E2E2E]">
                Adım {currentStepIndex + 1} / {steps.length}
                <span className="text-slate-400 dark:text-[#505050]">•</span>
                <span className={`uppercase font-bold ${getStepColorClass(currentStep.type)}`}>
                  {currentStep.type === 'work' ? 'HIZLI / İNTERVAL' : currentStep.type === 'rest' ? 'DİNLENME' : 'ISINMA / SOĞUMA'}
                </span>
              </span>

              <h3 className="text-lg font-black text-slate-900 dark:text-[#F5F5F5] mt-2">
                {currentStep.name}
              </h3>
              {currentStep.targetPace && (
                <p className="text-xs text-orange-600 dark:text-orange-300 font-mono mt-0.5">
                  Hedef Pace: {currentStep.targetPace}
                </p>
              )}
            </div>

            {/* Giant Countdown Display */}
            <div className="relative flex flex-col items-center justify-center py-6">
              <div className="font-mono text-6xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-xs">
                {formatTime(secondsRemaining)}
              </div>
              <p className="text-xs text-slate-500 dark:text-[#808080] mt-2 font-medium">
                Kalan Süre
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-[#222222] h-2.5 rounded-full mt-5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    currentStep.type === 'work' ? 'from-orange-500 to-amber-400' : 'from-emerald-500 to-teal-400'
                  } transition-all duration-300`}
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            </div>

            {/* Overall Progress Indicator */}
            <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] flex items-center justify-between text-xs text-slate-700 dark:text-[#CCCCCC]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                <span>Toplam Antrenman İlerlemesi</span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-[#F5F5F5]">%{overallProgress}</span>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetTimer}
                title="Sıfırla"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] dark:text-[#CCCCCC] dark:hover:bg-[#252525] dark:hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleStartPause}
                className={`flex h-16 w-28 items-center justify-center gap-2 rounded-2xl font-bold text-white shadow-lg transition active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-6 h-6 fill-current" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>Başla</span>
                  </>
                )}
              </button>

              <button
                onClick={skipStep}
                title="Sonraki Adıma Geç"
                disabled={currentStepIndex >= steps.length - 1}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-[#1A1A1A] dark:border-[#2E2E2E] dark:text-[#CCCCCC] dark:hover:bg-[#252525] dark:hover:text-white transition cursor-pointer"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
