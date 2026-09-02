import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, X, Zap, Heart, CheckCircle } from 'lucide-react';
import { PlanDay } from '../data/athleticPlan';
import { useIntervalAudio } from '../hooks/useIntervalAudio';
import confetti from 'canvas-confetti';

interface IntervalTimerModalProps {
  planDay: PlanDay;
  onClose: () => void;
  onFinishWorkout?: () => void;
}

export function IntervalTimerModal({
  planDay,
  onClose,
  onFinishWorkout,
}: IntervalTimerModalProps) {
  // Generate steps based on planDay.seg or default
  const steps = planDay.seg && planDay.seg.length > 0
    ? planDay.seg.map((s, idx) => {
        let dur = 300;
        let type: 'warmup' | 'work' | 'rest' | 'cooldown' = 'work';
        const lower = (s[0] + ' ' + s[1]).toLowerCase();

        if (lower.includes('ısınma') || idx === 0) {
          dur = 300;
          type = 'warmup';
        } else if (lower.includes('soğuma') || lower.includes('jog') || idx === planDay.seg.length - 1) {
          dur = 300;
          type = 'cooldown';
        } else if (lower.includes('yürüyüş') || lower.includes('dinlenme')) {
          dur = 60;
          type = 'rest';
        } else if (lower.includes('hiit') || lower.includes('hızlı') || lower.includes('tempo') || lower.includes('sprint')) {
          dur = 600;
          type = 'work';
        } else {
          dur = 600;
          type = 'work';
        }

        return {
          name: `${s[0]}: ${s[1]}`,
          durationSec: dur,
          type,
          targetPace: s[2] !== '—' ? s[2] : undefined,
        };
      })
    : [
        { name: 'Isınma Koşusu', durationSec: 300, type: 'warmup' as const, targetPace: "5'40\"/km" },
        { name: 'Ana Koşu Bloğu', durationSec: 1800, type: 'work' as const, targetPace: "4'55\"/km" },
        { name: 'Soğuma Jog', durationSec: 300, type: 'cooldown' as const, targetPace: "6'00\"/km" },
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
        } catch {}
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#191C21] border border-[#343941] shadow-2xl overflow-hidden flex flex-col text-[#F0EEE5]">
        {/* Top Controls */}
        <div className="flex items-center justify-between p-4 border-b border-[#262A31] bg-[#15171B]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF4A17]" />
            <span className="text-xs font-cond font-bold uppercase tracking-wider text-[#F0EEE5]">
              {planDay.t} · {planDay.km || '10K'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                soundEnabled
                  ? 'border-[#FF4A17]/40 bg-[#FF4A17]/15 text-[#FF4A17]'
                  : 'border-[#343941] bg-[#1F232A] text-[#767C85]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#343941] bg-[#1F232A] text-[#A6ABB3] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Finish Screen or Active Timer */}
        {isFinished ? (
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FF4A17]/20 text-[#FF4A17] border border-[#FF4A17]/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-cond font-bold text-[#F0EEE5]">Harika Koşu!</h3>
              <p className="mt-1 text-sm text-[#A6ABB3]">
                {planDay.t} antrenmanı tüm intervalleriyle tamamlandı.
              </p>
            </div>
            <div className="bg-[#15171B] border border-[#262A31] p-4 rounded-xl text-xs space-y-1.5 text-[#A6ABB3] text-left font-mono">
              <p>⏱️ Toplam Süre: <strong className="text-[#F0EEE5]">{formatTime(totalDurationSec)}</strong></p>
              <p>📍 Parkur: <strong className="text-[#F0EEE5]">{planDay.loc || 'Metehan Dönüşü'}</strong></p>
              <p>🎯 Hedef: <strong className="text-[#FF4A17]">{planDay.km || '10 km'}</strong></p>
              <p>💧 Şimdi 1 şişe maden suyu veya tuzlu limonlu su içmeyi unutma!</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onFinishWorkout?.();
                  onClose();
                }}
                className="flex-1 rounded-xl bg-[#FF4A17] py-3 text-sm font-cond font-bold tracking-wider text-[#131409] hover:bg-[#E84010] transition shadow-lg cursor-pointer"
              >
                ANTRENMANI TAMAMLA &amp; KAYDET
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Step Counter & Category */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F232A] border border-[#343941] px-3 py-1 text-xs font-mono text-[#A6ABB3]">
                Adım {currentStepIndex + 1} / {steps.length}
                <span className="text-[#767C85]">•</span>
                <span className={`uppercase font-bold ${currentStep.type === 'work' ? 'text-[#FF4A17]' : currentStep.type === 'rest' ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {currentStep.type === 'work' ? 'HIZLI / İNTERVAL' : currentStep.type === 'rest' ? 'DİNLENME' : 'ISINMA / SOĞUMA'}
                </span>
              </span>

              <h3 className="text-xl font-cond font-bold text-[#F0EEE5] mt-2">
                {currentStep.name}
              </h3>
              {currentStep.targetPace && (
                <p className="text-xs text-[#FF4A17] font-mono mt-0.5">
                  Hedef Pace: {currentStep.targetPace}
                </p>
              )}
            </div>

            {/* Giant Countdown Display */}
            <div className="relative flex flex-col items-center justify-center py-4">
              <div className="font-mono text-6xl font-bold tracking-tight text-[#F0EEE5]">
                {formatTime(secondsRemaining)}
              </div>
              <p className="text-xs text-[#767C85] font-mono mt-2 uppercase tracking-wider">
                Kalan Süre
              </p>

              {/* Progress bar */}
              <div className="w-full bg-[#262A31] h-2.5 rounded-full mt-5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    currentStep.type === 'work' ? 'from-[#FF4A17] to-amber-500' : 'from-emerald-500 to-teal-400'
                  } transition-all duration-300`}
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            </div>

            {/* Overall Progress Indicator */}
            <div className="bg-[#15171B] border border-[#262A31] p-3 rounded-xl flex items-center justify-between text-xs text-[#A6ABB3]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400 shrink-0" />
                <span>Toplam Antrenman İlerlemesi</span>
              </div>
              <span className="font-mono font-bold text-[#F0EEE5]">%{overallProgress}</span>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetTimer}
                title="Sıfırla"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F232A] border border-[#343941] text-[#A6ABB3] hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleStartPause}
                className={`flex h-14 px-8 items-center justify-center gap-2 rounded-xl font-cond font-bold tracking-wider text-base transition active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-[#FF4A17] hover:bg-[#E84010] text-[#131409]'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>DURDUR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>BAŞLAT</span>
                  </>
                )}
              </button>

              <button
                onClick={skipStep}
                title="Sonraki Adıma Geç"
                disabled={currentStepIndex >= steps.length - 1}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F232A] border border-[#343941] text-[#A6ABB3] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
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
