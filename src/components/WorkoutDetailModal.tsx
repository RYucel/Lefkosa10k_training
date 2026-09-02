import { useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, Flame, Heart, MapPin, Play, Sparkles, X, Edit3, Award } from 'lucide-react';
import { WorkoutDay, UserDayLog } from '../types/plan';

interface WorkoutDetailModalProps {
  workout: WorkoutDay;
  log?: UserDayLog;
  onSaveLog: (dateStr: string, updated: Partial<UserDayLog>) => void;
  onClose: () => void;
  onLaunchTimer?: () => void;
}

export function WorkoutDetailModal({
  workout,
  log,
  onSaveLog,
  onClose,
  onLaunchTimer,
}: WorkoutDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [actualPace, setActualPace] = useState(log?.actualPace || '');
  const [actualDistance, setActualDistance] = useState(log?.actualDistanceKm?.toString() || workout.distanceKm?.toString() || '');
  const [actualDuration, setActualDuration] = useState(log?.actualDurationMin?.toString() || workout.estimatedDurationMin?.toString() || '');
  const [actualBpm, setActualBpm] = useState(log?.actualAvgBpm?.toString() || '');
  const [perceivedEffort, setPerceivedEffort] = useState(log?.perceivedEffort || 7);
  const [notes, setNotes] = useState(log?.notes || '');
  const isCompleted = log?.completedWorkout ?? (workout.id === '2026-09-02'); // First day marked completed in plan!

  const handleToggleComplete = () => {
    onSaveLog(workout.dateStr, {
      completedWorkout: !isCompleted,
      actualPace: actualPace || workout.targetPace,
      actualDistanceKm: parseFloat(actualDistance) || workout.distanceKm,
      actualDurationMin: parseInt(actualDuration) || workout.estimatedDurationMin,
    });
  };

  const handleSaveForm = (e: FormEvent) => {
    e.preventDefault();
    onSaveLog(workout.dateStr, {
      completedWorkout: true,
      actualPace,
      actualDistanceKm: parseFloat(actualDistance) || undefined,
      actualDurationMin: parseInt(actualDuration) || undefined,
      actualAvgBpm: parseInt(actualBpm) || undefined,
      perceivedEffort,
      notes,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col transition-colors">
        {/* Header Banner */}
        <div className="relative bg-slate-50 border-b border-slate-200 dark:bg-gradient-to-r dark:from-[#181818] dark:via-[#141414] dark:to-[#181818] p-5 dark:border-[#222222]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-300 dark:bg-[#1A1A1A] dark:text-[#808080] dark:hover:text-white dark:hover:bg-[#252525] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            <span>{workout.weekLabel}</span>
            <span>•</span>
            <span>{workout.displayDate} {workout.fullDayName}</span>
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-[#F5F5F5] mt-1">
            {workout.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-slate-700 dark:bg-[#1A1A1A] dark:text-[#CCCCCC] dark:border-[#2E2E2E]">
              <MapPin className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
              {workout.track}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-slate-700 dark:bg-[#1A1A1A] dark:text-[#CCCCCC] dark:border-[#2E2E2E]">
              <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Hedef Pace: <strong className="text-slate-900 dark:text-[#F5F5F5]">{workout.targetPace}</strong>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Main Details */}
          <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-4 rounded-2xl dark:border-[#222222]">
            <h4 className="text-xs font-bold text-slate-500 dark:text-[#808080] uppercase tracking-wider mb-1.5">
              Antrenman Detayı & Yapısı
            </h4>
            <p className="text-sm font-medium text-slate-700 dark:text-[#D4D4D4] leading-relaxed">
              {workout.details}
            </p>
          </div>

          {/* Interval Steps if available */}
          {workout.intervalSteps && workout.intervalSteps.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-4 rounded-2xl dark:border-[#222222]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-[#808080] uppercase tracking-wider">
                  İnterval Blokları ({workout.intervalSteps.length} Adım)
                </h4>
                {onLaunchTimer && (
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchTimer();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Sayacı Başlat
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {workout.intervalSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                      step.type === 'work'
                        ? 'bg-orange-500/15 border border-orange-500/30 text-orange-700 dark:text-orange-200'
                        : step.type === 'warmup' || step.type === 'cooldown'
                        ? 'bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-200'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                    }`}
                  >
                    <span className="font-medium">{step.name}</span>
                    <span className="font-mono font-bold">
                      {Math.floor(step.durationSec / 60)}:{String(step.durationSec % 60).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Daily Tips & Recovery */}
          {workout.keyNotes && workout.keyNotes.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-4 rounded-2xl dark:border-[#222222]">
              <h4 className="text-xs font-bold text-slate-500 dark:text-[#808080] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                Önemli İpuçları & Protokol
              </h4>
              <ul className="space-y-1.5">
                {workout.keyNotes.map((note, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-[#A3A3A3] flex items-start gap-2">
                    <span className="text-orange-500 dark:text-orange-400 mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* User Performance Log Section */}
          <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-4 rounded-2xl dark:border-[#222222]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-[#707070]'}`} />
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">Antrenman Durumu</h4>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'İptal' : 'Kayıt Ekle / Düzenle'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveForm} className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Koşulan Pace</label>
                    <input
                      type="text"
                      placeholder="örn: 4'55 /km"
                      value={actualPace}
                      onChange={(e) => setActualPace(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-[#141414] dark:border-[#2E2E2E] px-3 py-1.5 text-xs dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#606060] focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Mesafe (km)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="10.15"
                      value={actualDistance}
                      onChange={(e) => setActualDistance(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-[#141414] dark:border-[#2E2E2E] px-3 py-1.5 text-xs dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#606060] focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Süre (dakika)</label>
                    <input
                      type="number"
                      placeholder="52"
                      value={actualDuration}
                      onChange={(e) => setActualDuration(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-[#141414] dark:border-[#2E2E2E] px-3 py-1.5 text-xs dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#606060] focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Ortalama Nabız (bpm)</label>
                    <input
                      type="number"
                      placeholder="158"
                      value={actualBpm}
                      onChange={(e) => setActualBpm(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-[#141414] dark:border-[#2E2E2E] px-3 py-1.5 text-xs dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#606060] focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-[#A3A3A3] mb-1">
                    <span>Hissedilen Zorluk (RPE)</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">{perceivedEffort} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={perceivedEffort}
                    onChange={(e) => setPerceivedEffort(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Kişisel Notlar & Hissiyat</label>
                  <textarea
                    rows={2}
                    placeholder="Bacaklar nasıldı, rüzgar durumu, nabız kontrolü..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-[#141414] dark:border-[#2E2E2E] p-2.5 text-xs dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-[#606060] focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    Kaydet ve Tamamlandı İşaretle
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {isCompleted ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-emerald-800 dark:text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Bu antrenman tamamlandı olarak kaydedildi.</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-[#A3A3A3]">
                    Henüz tamamlanmadı. Koşu sonrası değerlerinizi girip kaydedebilirsiniz.
                  </p>
                )}

                {log?.notes && (
                  <div className="p-3 bg-white border border-slate-200 dark:bg-[#141414] rounded-xl dark:border-[#262626] text-xs text-slate-700 dark:text-[#CCCCCC]">
                    <span className="font-bold text-slate-500 dark:text-[#A3A3A3] block mb-0.5">Not:</span>
                    {log.notes}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleToggleComplete}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-sm cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 dark:bg-[#1A1A1A] dark:text-[#CCCCCC] dark:hover:bg-[#252525] dark:border-[#2E2E2E]'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCompleted ? 'Tamamlandı İşaretini Kaldır' : 'Tamamlandı Olarak İşaretle'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
