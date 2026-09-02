import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Flame,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { WorkoutDay, UserDayLog } from '../types/plan';
import { MARATHON_META } from '../data/planData';

interface CalendarViewProps {
  allWorkouts: WorkoutDay[];
  userLogs: Record<string, UserDayLog>;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onOpenWorkoutDetail: (workout: WorkoutDay) => void;
  onExportICS: () => void;
}

export function CalendarView({
  allWorkouts,
  userLogs,
  selectedDateStr,
  onSelectDate,
  onOpenWorkoutDetail,
  onExportICS,
}: CalendarViewProps) {
  const [filter, setFilter] = useState<'all' | 'runs' | 'rest' | 'completed'>('all');

  // Group workouts by week
  const weeks = [1, 2, 3, 4, 5, 6];

  // Stats calculation
  const totalKmPlanned = allWorkouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);
  const completedWorkouts = allWorkouts.filter(
    (w) => userLogs[w.dateStr]?.completedWorkout || w.id === '2026-09-02'
  );
  const completedKm = completedWorkouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);
  const progressPercent = Math.round((completedWorkouts.length / allWorkouts.length) * 100);

  const filteredWorkouts = allWorkouts.filter((w) => {
    const isCompleted = userLogs[w.dateStr]?.completedWorkout || w.id === '2026-09-02';
    const isRest = w.workoutType === 'rest' || w.workoutType === 'active_rest';

    if (filter === 'runs') return !isRest;
    if (filter === 'rest') return isRest;
    if (filter === 'completed') return isCompleted;
    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner & Stats Overview */}
      <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 sm:p-6 shadow-lg dark:shadow-2xl space-y-4 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F5F5F5]">
                5.5 Haftalık Maraton Programı
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A3A3A3] mt-0.5">
              2 Eylül – 11 Ekim 2026 • Hedef: {MARATHON_META.targetTime} ({MARATHON_META.targetPace})
            </p>
          </div>

          <button
            id="export-calendar-ics-btn"
            onClick={onExportICS}
            className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] px-3.5 py-2 text-xs font-semibold dark:text-[#F5F5F5] dark:hover:bg-[#252525] dark:hover:border-[#383838] transition active:scale-95 shadow-xs cursor-pointer"
            title="Google Calendar / Apple Calendar / Outlook Takvimine Aktar"
          >
            <Download className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Takvime Aktar (.ics)</span>
          </button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] text-center">
            <span className="text-[11px] text-slate-500 dark:text-[#808080] block">Tamamlanan</span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F5F5F5] font-mono">
              {completedWorkouts.length} / {allWorkouts.length}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#606060] block">Gün</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] text-center">
            <span className="text-[11px] text-slate-500 dark:text-[#808080] block">Toplam Koşulan</span>
            <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400 font-mono">
              {completedKm.toFixed(1)} km
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#606060] block">/ {totalKmPlanned.toFixed(1)} km</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] text-center">
            <span className="text-[11px] text-slate-500 dark:text-[#808080] block">Genel İlerleme</span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              %{progressPercent}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#606060] block">Hazırlık</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-[#222222] h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === 'all'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#141414] dark:border-[#262626] dark:text-[#A3A3A3] dark:hover:bg-[#1A1A1A] dark:hover:text-[#E0E0E0]'
          }`}
        >
          Tüm Günler ({allWorkouts.length})
        </button>
        <button
          onClick={() => setFilter('runs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === 'runs'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#141414] dark:border-[#262626] dark:text-[#A3A3A3] dark:hover:bg-[#1A1A1A] dark:hover:text-[#E0E0E0]'
          }`}
        >
          🏃 Sadece Koşular
        </button>
        <button
          onClick={() => setFilter('rest')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === 'rest'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#141414] dark:border-[#262626] dark:text-[#A3A3A3] dark:hover:bg-[#1A1A1A] dark:hover:text-[#E0E0E0]'
          }`}
        >
          🛋️ Dinlenme Günleri
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === 'completed'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#141414] dark:border-[#262626] dark:text-[#A3A3A3] dark:hover:bg-[#1A1A1A] dark:hover:text-[#E0E0E0]'
          }`}
        >
          ✅ Tamamlananlar ({completedWorkouts.length})
        </button>
      </div>

      {/* Week By Week Cards */}
      <div className="space-y-6">
        {weeks.map((weekNum) => {
          const weekWorkouts = filteredWorkouts.filter((w) => w.weekNumber === weekNum);
          if (weekWorkouts.length === 0) return null;

          const sampleWorkout = weekWorkouts[0] || allWorkouts.find((w) => w.weekNumber === weekNum);
          const weekLabel = sampleWorkout?.weekLabel || `${weekNum}. Hafta`;

          return (
            <div key={weekNum} className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-4 sm:p-5 shadow-lg dark:shadow-2xl space-y-3 transition-colors">
              {/* Week Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs">
                    {weekNum}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">{weekLabel}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {sampleWorkout?.isPeakWeek && (
                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-500/30">
                      ZİRVE HAFTASI
                    </span>
                  )}
                  {sampleWorkout?.isTaperWeek && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400 border border-sky-500/30">
                      AZALTMA (TAPERING)
                    </span>
                  )}
                  {sampleWorkout?.isRaceWeek && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      YARIŞ HAFTASI
                    </span>
                  )}
                </div>
              </div>

              {/* Workouts List for this week */}
              <div className="space-y-2">
                {weekWorkouts.map((workout) => {
                  const isCompleted = userLogs[workout.dateStr]?.completedWorkout || workout.id === '2026-09-02';
                  const isSelected = workout.dateStr === selectedDateStr;
                  const isRest = workout.workoutType === 'rest' || workout.workoutType === 'active_rest';

                  return (
                    <div
                      key={workout.id}
                      onClick={() => onOpenWorkoutDetail(workout)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer select-none ${
                        isSelected
                          ? 'bg-orange-50 border-orange-500 dark:bg-[#1C1C1C] dark:border-orange-500/60 ring-1 ring-orange-500/30'
                          : isCompleted
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 dark:bg-[#0D0D0D] dark:border-emerald-900/40 dark:text-[#D4D4D4] hover:bg-emerald-100/60 dark:hover:bg-[#161616]'
                          : isRest
                          ? 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-[#0A0A0A] dark:border-[#1C1C1C] dark:text-[#707070] hover:bg-slate-100 dark:hover:bg-[#141414]'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 dark:bg-[#0D0D0D] dark:border-[#222222] dark:text-[#E0E0E0] dark:hover:border-[#383838] hover:bg-slate-100 dark:hover:bg-[#161616]'
                      }`}
                    >
                      {/* Date + Title */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex flex-col items-center justify-center w-11 shrink-0 text-center">
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-[#808080] uppercase">
                            {workout.dayOfWeek}
                          </span>
                          <span className="text-xs font-black text-slate-900 dark:text-[#F5F5F5] font-mono">
                            {workout.displayDate.split(' ')[0]}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs font-bold truncate ${isCompleted ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-900 dark:text-[#F5F5F5]'}`}>
                              {workout.title}
                            </h4>
                            {workout.isRaceDay && (
                              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-600 dark:text-emerald-400">
                                🏁 YARIŞ
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-[#A3A3A3]">
                            {workout.track !== '—' && (
                              <span className="flex items-center gap-1 text-slate-500 dark:text-[#A3A3A3] truncate max-w-[140px] sm:max-w-xs">
                                <MapPin className="w-3 h-3 text-orange-500 dark:text-orange-400 shrink-0" />
                                {workout.track}
                              </span>
                            )}
                            <span className="font-mono text-orange-600 dark:text-orange-300">
                              {workout.targetPace}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status / Detail Trigger */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Tamamlandı</span>
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[#606060]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
