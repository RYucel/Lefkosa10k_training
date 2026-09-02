import { useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Heart,
  Info,
  MapPin,
  Moon,
  Pill,
  Play,
  Plus,
  Minus,
  Sparkles,
  Zap,
  CalendarDays,
  CheckCheck,
  RotateCcw,
  Check,
} from 'lucide-react';
import { WorkoutDay, UserDayLog, SupplementProtocol } from '../types/plan';
import { SUPPLEMENTS, MARATHON_META } from '../data/planData';
import confetti from 'canvas-confetti';

interface TodayViewProps {
  currentWorkout: WorkoutDay;
  allWorkouts: WorkoutDay[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  dayLog: UserDayLog;
  onUpdateLog: (updated: Partial<UserDayLog>) => void;
  onOpenWorkoutDetail: (workout: WorkoutDay) => void;
  onLaunchTimer: (workout: WorkoutDay) => void;
  onOpenProtocols: () => void;
  onOpenCourses: () => void;
}

export function TodayView({
  currentWorkout,
  allWorkouts,
  selectedDateStr,
  onSelectDate,
  dayLog,
  onUpdateLog,
  onOpenWorkoutDetail,
  onLaunchTimer,
  onOpenProtocols,
  onOpenCourses,
}: TodayViewProps) {
  // Navigation between days
  const currentIndex = allWorkouts.findIndex((w) => w.dateStr === selectedDateStr);
  const prevDay = currentIndex > 0 ? allWorkouts[currentIndex - 1] : null;
  const nextDay = currentIndex < allWorkouts.length - 1 ? allWorkouts[currentIndex + 1] : null;

  // Race countdown
  const raceDate = new Date('2026-10-11T00:00:00');
  const selectedDateObj = new Date(`${selectedDateStr}T00:00:00`);
  const diffDays = Math.ceil((raceDate.getTime() - selectedDateObj.getTime()) / (1000 * 60 * 60 * 24));

  // Supplements for today
  const isWorkoutDay = currentWorkout.workoutType !== 'rest' && currentWorkout.workoutType !== 'active_rest';
  const relevantSupplements = SUPPLEMENTS.filter((s) => {
    if (s.id === 'gloryfeel_creatine') {
      return isWorkoutDay || currentWorkout.isRaceWeek;
    }
    return true;
  });

  const toggleSupplement = (suppId: string, defaultQty?: number) => {
    const current = dayLog.completedSupplements || [];
    const isCompleted = current.includes(suppId);
    const updated = isCompleted ? current.filter((id) => id !== suppId) : [...current, suppId];
    
    // Also ensure dose is initialized if marking as taken
    const currentDoses = { ...(dayLog.supplementDoses || {}) };
    if (!isCompleted && !currentDoses[suppId]) {
      currentDoses[suppId] = defaultQty || 1;
    }

    onUpdateLog({
      completedSupplements: updated,
      supplementDoses: currentDoses,
    });

    if (!isCompleted && updated.length === relevantSupplements.length) {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
      } catch {}
    }
  };

  const handleUpdateSupplementDose = (
    suppId: string,
    delta: number,
    minQty: number = 1,
    maxQty: number = 10,
    defaultQty: number = 1
  ) => {
    const currentDoses = { ...(dayLog.supplementDoses || {}) };
    const current = currentDoses[suppId] ?? defaultQty;
    const nextQty = Math.max(minQty, Math.min(maxQty, current + delta));
    currentDoses[suppId] = nextQty;

    // Automatically mark as completed if quantity > 0
    const completedList = dayLog.completedSupplements || [];
    const updatedCompleted = completedList.includes(suppId) ? completedList : [...completedList, suppId];

    onUpdateLog({
      supplementDoses: currentDoses,
      completedSupplements: updatedCompleted,
    });
  };

  const handleSetExactDose = (suppId: string, qty: number) => {
    const currentDoses = { ...(dayLog.supplementDoses || {}) };
    currentDoses[suppId] = qty;

    const completedList = dayLog.completedSupplements || [];
    const updatedCompleted = completedList.includes(suppId) ? completedList : [...completedList, suppId];

    onUpdateLog({
      supplementDoses: currentDoses,
      completedSupplements: updatedCompleted,
    });
  };

  const handleTakeAllSupplements = () => {
    const allIds = relevantSupplements.map((s) => s.id);
    const currentDoses = { ...(dayLog.supplementDoses || {}) };
    relevantSupplements.forEach((s) => {
      if (!currentDoses[s.id]) {
        currentDoses[s.id] = s.defaultQuantity || 1;
      }
    });

    onUpdateLog({
      completedSupplements: allIds,
      supplementDoses: currentDoses,
    });

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.8 } });
    } catch {}
  };

  const handleResetSupplements = () => {
    onUpdateLog({
      completedSupplements: [],
    });
  };

  const handleToggleWorkoutComplete = () => {
    const nextState = !dayLog.completedWorkout;
    onUpdateLog({
      completedWorkout: nextState,
      actualPace: nextState ? dayLog.actualPace || currentWorkout.targetPace : dayLog.actualPace,
      actualDistanceKm: nextState ? dayLog.actualDistanceKm || currentWorkout.distanceKm : dayLog.actualDistanceKm,
    });

    if (nextState) {
      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const updateWater = (delta: number) => {
    const current = dayLog.waterGlasses || 0;
    const next = Math.max(0, Math.min(20, current + delta));
    onUpdateLog({ waterGlasses: next });
  };

  const toggleFoamRoller = () => {
    onUpdateLog({ foamRollerDone: !dayLog.foamRollerDone });
  };

  const setSleepHours = (hours: number) => {
    onUpdateLog({ sleepHours: hours });
  };

  // Completion calculation for today
  const suppDoneCount = (dayLog.completedSupplements || []).length;
  const suppTotalCount = relevantSupplements.length;
  const isWorkoutDone = dayLog.completedWorkout || (currentWorkout.id === '2026-09-02');
  const waterLiters = ((dayLog.waterGlasses || 0) * 0.25).toFixed(1);

  return (
    <div className="space-y-6 pb-24">
      {/* Date Header & Quick Day Switcher */}
      <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-4 sm:p-5 shadow-lg dark:shadow-2xl transition-colors">
        <div className="flex items-center justify-between">
          <button
            onClick={() => prevDay && onSelectDate(prevDay.dateStr)}
            disabled={!prevDay}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] dark:text-[#E0E0E0] dark:hover:bg-[#252525] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            title="Önceki Gün"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 dark:text-orange-400 border border-orange-500/30">
                <CalendarDays className="w-3 h-3" />
                {currentWorkout.weekLabel}
              </span>
              {currentWorkout.isPeakWeek && (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-500/30">
                  🔥 ZİRVE
                </span>
              )}
              {currentWorkout.isTaperWeek && (
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400 border border-sky-500/30">
                  ⚡ AZALTMA
                </span>
              )}
              {currentWorkout.isRaceDay && (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                  🏁 YARIŞ GÜNÜ
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F5F5F5] mt-1">
              {currentWorkout.displayDate} {currentWorkout.fullDayName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A3A3A3]">
              {diffDays > 0 ? `Lefkoşa Maratonuna ${diffDays} gün kaldı` : '11 Ekim Lefkoşa 10K Maraton Günü!'}
            </p>
          </div>

          <button
            onClick={() => nextDay && onSelectDate(nextDay.dateStr)}
            disabled={!nextDay}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] dark:text-[#E0E0E0] dark:hover:bg-[#252525] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            title="Sonraki Gün"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Date Mini Scrubber */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {allWorkouts.map((w) => {
            const isSelected = w.dateStr === selectedDateStr;
            const isDone = w.id === '2026-09-02' || (w.dateStr === selectedDateStr && isWorkoutDone);
            const isRest = w.workoutType === 'rest' || w.workoutType === 'active_rest';

            return (
              <button
                key={w.id}
                onClick={() => onSelectDate(w.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[54px] py-1.5 rounded-xl text-xs transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30 ring-2 ring-orange-400/50'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40 hover:bg-emerald-200 dark:hover:bg-[#1A1A1A]'
                    : isRest
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-[#0D0D0D] dark:text-[#707070] dark:border-[#222222] hover:bg-slate-200 dark:hover:bg-[#1A1A1A]'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#181818] dark:text-[#D4D4D4] dark:border-[#2A2A2A] hover:bg-slate-200 dark:hover:bg-[#222222]'
                }`}
              >
                <span className="text-[10px] opacity-80">{w.dayOfWeek}</span>
                <span className="text-xs font-bold leading-tight">{w.displayDate.split(' ')[0]}</span>
                <div className="mt-0.5 flex gap-0.5">
                  {isDone && <span className="h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />}
                  {w.isRaceDay && <span className="h-1 w-1 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TODAY'S WORKOUT HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#161616] dark:via-[#121212] dark:to-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-5 sm:p-6 shadow-xl dark:shadow-2xl transition-colors">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 font-black text-xs">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A3A3A3]">
              Günün Antrenmanı
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentWorkout.distanceKm && (
              <span className="rounded-lg bg-slate-100 dark:bg-[#1A1A1A] px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-[#E0E0E0] border border-slate-300 dark:border-[#2E2E2E]">
                {currentWorkout.distanceKm} km
              </span>
            )}
            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
              isWorkoutDone
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
            }`}>
              {isWorkoutDone ? 'Tamamlandı ✅' : 'Bekliyor'}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F5F5] tracking-tight">
            {currentWorkout.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-[#CCCCCC] leading-relaxed font-normal">
            {currentWorkout.details}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] p-3 shadow-xs">
              <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 dark:text-[#808080] block leading-tight">Parkur / Zemin</span>
                <span className="text-xs font-bold text-slate-800 dark:text-[#E0E0E0]">{currentWorkout.track}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] p-3 shadow-xs">
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 dark:text-[#808080] block leading-tight">Hedef Pace / Efor</span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">{currentWorkout.targetPace}</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          {currentWorkout.keyNotes && currentWorkout.keyNotes.length > 0 && (
            <div className="bg-orange-500/5 rounded-2xl border border-orange-500/15 p-3.5 text-xs text-orange-900 dark:text-orange-200/90 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-orange-600 dark:text-orange-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Antrenman Notu
              </div>
              {currentWorkout.keyNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-orange-500 dark:text-orange-400">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {isWorkoutDay && (
              <button
                id="today-start-timer-btn"
                onClick={() => onLaunchTimer(currentWorkout)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 transition active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Koşu / Interval Sayacı</span>
              </button>
            )}

            <button
              onClick={() => onOpenWorkoutDetail(currentWorkout)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2E2E2E] dark:bg-[#1A1A1A] dark:text-[#E0E0E0] dark:hover:bg-[#252525] dark:hover:border-[#383838] py-3 px-4 text-xs font-bold transition cursor-pointer"
            >
              <Activity className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>Performans Kaydet / Notlar</span>
            </button>

            <button
              onClick={handleToggleWorkoutComplete}
              title={isWorkoutDone ? 'Tamamlandı işaretini kaldır' : 'Tamamlandı olarak işaretle'}
              className={`flex items-center justify-center p-3 rounded-2xl border transition cursor-pointer ${
                isWorkoutDone
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-400 border-slate-300 hover:text-slate-900 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:text-[#808080] dark:border-[#2E2E2E] dark:hover:text-white dark:hover:bg-[#252525]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S SUPPLEMENTS PROTOCOL CHECKLIST */}
      <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-2xl space-y-4 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#222222]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Pill className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">Günün Takviye Protokolü</h3>
              <p className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Aldım / Almadım durumunu ve tablet / gram miktarını kaydedin</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {suppDoneCount} / {suppTotalCount} Alındı
            </span>

            {/* Quick Bulk Actions */}
            <button
              onClick={handleTakeAllSupplements}
              className="flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-emerald-50 hover:border-emerald-300 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] px-2.5 py-1 text-xs font-medium dark:text-[#CCCCCC] dark:hover:text-white dark:hover:bg-emerald-900/40 dark:hover:border-emerald-700/50 transition cursor-pointer"
              title="Tüm takviyeleri önerilen dozda aldım olarak işaretle"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Tümünü Aldım</span>
            </button>

            {suppDoneCount > 0 && (
              <button
                onClick={handleResetSupplements}
                className="flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] px-2 py-1 text-xs font-medium dark:text-[#808080] dark:hover:text-[#CCCCCC] dark:hover:bg-[#252525] transition cursor-pointer"
                title="Bugünkü takviye işaretlerini sıfırla"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sıfırla</span>
              </button>
            )}

            <button
              onClick={onOpenProtocols}
              className="text-slate-400 hover:text-slate-800 dark:text-[#808080] dark:hover:text-white p-1 cursor-pointer"
              title="Tüm Protokol Rehberini Aç"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {relevantSupplements.map((supp) => {
            const isTaken = (dayLog.completedSupplements || []).includes(supp.id);
            const unit = supp.unit || 'Kapsül';
            const defaultQty = supp.defaultQuantity || 1;
            const minQty = supp.minQuantity || 1;
            const maxQty = supp.maxQuantity || (unit === 'gram' ? 10 : 4);
            const currentQty = dayLog.supplementDoses?.[supp.id] ?? defaultQty;

            // Generate quick choice chips
            const quickChips = unit === 'gram' ? [3, 5, 7] : [1, 2, 3, 4].filter((n) => n <= maxQty);

            return (
              <div
                key={supp.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isTaken
                    ? 'bg-emerald-50/70 border-emerald-300 dark:bg-gradient-to-br dark:from-emerald-950/40 dark:via-[#0E1B13] dark:to-[#0A120D] dark:border-emerald-500/40 shadow-sm dark:shadow-lg dark:shadow-emerald-950/20'
                    : 'bg-slate-50 border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] hover:border-slate-300 dark:hover:border-[#333333]'
                }`}
              >
                {/* Header: Name, Timing, and Take/Not-Take Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs font-bold leading-tight ${isTaken ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-[#F5F5F5]'}`}>
                        {supp.name}
                      </h4>
                      <span className="rounded-md bg-white border border-slate-200 text-orange-600 dark:bg-[#1C1C1C] dark:border-[#2E2E2E] px-1.5 py-0.5 text-[10px] font-medium dark:text-orange-400/90">
                        {supp.dose}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#A3A3A3]">
                      <span>{supp.timing}</span>
                    </div>

                    {supp.caution && (
                      <p className="text-[10px] text-amber-700 dark:text-amber-400/90 font-medium leading-tight">
                        ⚠️ {supp.caution}
                      </p>
                    )}
                  </div>

                  {/* Aldım / Almadım Toggle Button */}
                  <button
                    onClick={() => toggleSupplement(supp.id, currentQty)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                      isTaken
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-500'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 dark:bg-[#1A1A1A] dark:text-[#A3A3A3] dark:hover:text-white dark:hover:bg-[#252525] dark:border-[#2E2E2E]'
                    }`}
                  >
                    <div className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${
                      isTaken
                        ? 'bg-white text-emerald-600 border-white'
                        : 'bg-slate-100 border-slate-300 text-transparent dark:bg-[#141414] dark:border-[#404040]'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{isTaken ? 'Aldım ✅' : 'Almadım'}</span>
                  </button>
                </div>

                {/* Dosage Stepper & Quick Amount Selector */}
                <div className="pt-2 border-t border-slate-200 dark:border-[#222222]/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-[#808080]">
                      Alınan Miktar:
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center rounded-xl bg-white border border-slate-300 dark:bg-[#141414] dark:border-[#2A2A2A] p-0.5">
                      <button
                        onClick={() => handleUpdateSupplementDose(supp.id, -1, minQty, maxQty, defaultQty)}
                        disabled={currentQty <= minQty}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#CCCCCC] dark:hover:text-white dark:hover:bg-[#222222] disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Dozajı azalt"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="px-2.5 text-xs font-mono font-bold text-slate-900 dark:text-[#F5F5F5]">
                        {currentQty} <span className="text-[10px] font-sans font-normal text-slate-500 dark:text-[#A3A3A3]">{unit}</span>
                      </span>

                      <button
                        onClick={() => handleUpdateSupplementDose(supp.id, 1, minQty, maxQty, defaultQty)}
                        disabled={currentQty >= maxQty}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#CCCCCC] dark:hover:text-white dark:hover:bg-[#222222] disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Dozajı artır"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Quick preset chips */}
                  <div className="flex items-center gap-1">
                    {quickChips.map((qty) => {
                      const isSelected = isTaken && currentQty === qty;
                      return (
                        <button
                          key={qty}
                          onClick={() => handleSetExactDose(supp.id, qty)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/40 dark:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/50'
                              : 'bg-white text-slate-500 border border-slate-300 hover:text-slate-800 hover:bg-slate-100 dark:bg-[#181818] dark:text-[#808080] dark:hover:text-[#CCCCCC] dark:hover:bg-[#222222] dark:border-[#262626]'
                          }`}
                        >
                          {qty}{unit === 'gram' ? 'g' : ` ${unit.slice(0, 3)}.`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NUTRITION, HYDRATION & RECOVERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hydration Tracker */}
        <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-2xl space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400">
                <Droplets className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">Hidrasyon & Elektrolit</h3>
                <p className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Hedef: 2.5 – 3.0 Litre / Gün</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
              {waterLiters} L / 3.0 L
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0D0D0D] p-3 rounded-2xl border border-slate-200 dark:border-[#222222]">
            <button
              onClick={() => updateWater(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] dark:text-[#E0E0E0] dark:hover:bg-[#252525] active:scale-95 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-lg font-black text-slate-900 dark:text-[#F5F5F5] font-mono">{dayLog.waterGlasses || 0}</span>
              <span className="text-xs text-slate-500 dark:text-[#A3A3A3] ml-1">Bardak (250ml)</span>
            </div>

            <button
              onClick={() => updateWater(1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white hover:bg-sky-500 active:scale-95 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-[#A3A3A3] leading-relaxed bg-slate-50 dark:bg-[#0D0D0D] p-2.5 rounded-xl border border-slate-200 dark:border-[#222222]">
            💡 <strong className="text-slate-900 dark:text-[#E0E0E0]">Kritik Kural:</strong> Antrenman sonrası 1 şişe maden suyu veya tuzlu limonlu su içerek terle atılan sodyum ve potasyumu yerine koyun.
          </p>
        </div>

        {/* Recovery & Sleep */}
        <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-2xl space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">Dinlenme & Eklem Koruması</h3>
                <p className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Uyku & Miyofasiyal Masaj</p>
              </div>
            </div>
          </div>

          {/* Foam Roller checkbox */}
          <div
            onClick={toggleFoamRoller}
            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer select-none transition ${
              dayLog.foamRollerDone
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-500/30 dark:text-indigo-200'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-[#0D0D0D] dark:border-[#222222] dark:text-[#D4D4D4] dark:hover:border-[#383838]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${
                dayLog.foamRollerDone
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'border-slate-300 bg-white dark:border-[#383838] dark:bg-[#1A1A1A] text-transparent'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-[#F5F5F5] block">Foam Roller (5-10 dk)</span>
                <span className="text-[11px] text-slate-500 dark:text-[#A3A3A3]">Baldır, aşil ve ön kaval esnekliği</span>
              </div>
            </div>
            {currentWorkout.foamRollerRecommended && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 dark:text-amber-400">
                Bugün Önemli
              </span>
            )}
          </div>

          {/* Sleep Goal Selector */}
          <div className="bg-slate-50 dark:bg-[#0D0D0D] p-3 rounded-2xl border border-slate-200 dark:border-[#222222] space-y-1.5">
            <div className="flex justify-between text-xs text-slate-700 dark:text-[#E0E0E0]">
              <span>Gece Uykusu</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{dayLog.sleepHours || 8} Saat (Hedef: 7.5-8)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[6, 7, 7.5, 8, 8.5, 9].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setSleepHours(hrs)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    (dayLog.sleepHours || 8) === hrs
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#1A1A1A] dark:border-transparent dark:text-[#808080] dark:hover:text-white'
                  }`}
                >
                  {hrs}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
