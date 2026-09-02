import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { ProtocolsView } from './components/ProtocolsView';
import { IntervalTimerModal } from './components/IntervalTimerModal';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { RemindersSettingsModal } from './components/RemindersSettingsModal';
import { CourseGuideModal } from './components/CourseGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { WORKOUT_DAYS, DEFAULT_REMINDERS, MARATHON_META } from './data/planData';
import { UserDayLog, ReminderSetting, WorkoutDay } from './types/plan';
import { useNotifications } from './hooks/useNotifications';

const STORAGE_KEY_LOGS = 'lefkosa10k_user_logs_v1';
const STORAGE_KEY_REMINDERS = 'lefkosa10k_reminders_v1';

export default function App() {
  // 1. Logs state
  const [userLogs, setUserLogs] = useState<Record<string, UserDayLog>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default seed with Day 1 marked complete as per user plan: "Koşuldu: 10.15 km rahat/eforsuz 5'46\" /km (158 bpm) ✅"
    return {
      '2026-09-02': {
        dateStr: '2026-09-02',
        completedWorkout: true,
        actualDistanceKm: 10.15,
        actualDurationMin: 58,
        actualPace: "5'46\" /km",
        actualAvgBpm: 158,
        perceivedEffort: 5,
        waterGlasses: 10,
        completedSupplements: ['esn_magnesium', 'omega_3', 'nac_600'],
        supplementDoses: {
          esn_magnesium: 2,
          omega_3: 2,
          nac_600: 1,
        },
        completedNutritionItems: [],
        foamRollerDone: false,
        sleepHours: 8,
        updatedAt: new Date().toISOString(),
      },
    };
  });

  // 2. Reminders state
  const [reminders, setReminders] = useState<ReminderSetting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REMINDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_REMINDERS;
  });

  // 3. Active selected date
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentTodayStr = `${year}-${month}-${day}`;

    // If current system date is within range, use it; otherwise default to start date '2026-09-02'
    const found = WORKOUT_DAYS.find((w) => w.dateStr === currentTodayStr);
    return found ? found.dateStr : '2026-09-02';
  });

  // 4. Navigation tabs
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'timer' | 'protocols' | 'settings'>('today');

  // 5. Modals
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [selectedWorkoutModal, setSelectedWorkoutModal] = useState<WorkoutDay | null>(null);
  const [timerWorkout, setTimerWorkout] = useState<WorkoutDay | null>(null);

  // Persist logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(userLogs));
    } catch (e) {
      console.error('Error saving logs:', e);
    }
  }, [userLogs]);

  // Persist reminders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.error('Error saving reminders:', e);
    }
  }, [reminders]);

  // Current active workout object
  const currentWorkout = useMemo(() => {
    return WORKOUT_DAYS.find((w) => w.dateStr === selectedDateStr) || WORKOUT_DAYS[0];
  }, [selectedDateStr]);

  // Current day log object with defaults
  const currentDayLog: UserDayLog = useMemo(() => {
    return (
      userLogs[selectedDateStr] || {
        dateStr: selectedDateStr,
        completedWorkout: selectedDateStr === '2026-09-02',
        waterGlasses: 0,
        completedSupplements: [],
        completedNutritionItems: [],
        foamRollerDone: false,
        sleepHours: 8,
        updatedAt: new Date().toISOString(),
      }
    );
  }, [userLogs, selectedDateStr]);

  // Notifications hook
  const {
    permission,
    requestPermission,
    sendLocalNotification,
    exportToCalendarICS,
  } = useNotifications(reminders, currentWorkout);

  // Calculate days remaining to race
  const raceDateObj = new Date('2026-10-11T00:00:00');
  const selectedDateObj = new Date(`${selectedDateStr}T00:00:00`);
  const daysRemaining = Math.max(0, Math.ceil((raceDateObj.getTime() - selectedDateObj.getTime()) / (1000 * 60 * 60 * 24)));

  // Handlers
  const handleUpdateCurrentLog = (updated: Partial<UserDayLog>) => {
    setUserLogs((prev) => ({
      ...prev,
      [selectedDateStr]: {
        ...(prev[selectedDateStr] || currentDayLog),
        ...updated,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleSaveWorkoutLog = (dateStr: string, updated: Partial<UserDayLog>) => {
    setUserLogs((prev) => ({
      ...prev,
      [dateStr]: {
        ...(prev[dateStr] || {
          dateStr,
          completedWorkout: false,
          waterGlasses: 0,
          completedSupplements: [],
          completedNutritionItems: [],
          foamRollerDone: false,
          sleepHours: 8,
          updatedAt: new Date().toISOString(),
        }),
        ...updated,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleLaunchTimer = (workout: WorkoutDay) => {
    setTimerWorkout(workout);
  };

  const handleFinishTimerWorkout = () => {
    if (timerWorkout) {
      handleSaveWorkoutLog(timerWorkout.dateStr, {
        completedWorkout: true,
        actualPace: timerWorkout.targetPace,
        actualDistanceKm: timerWorkout.distanceKm,
      });
    }
  };

  const handleTestNotification = () => {
    sendLocalNotification(
      '🔔 Lefkoşa 10K Maraton Hatırlatıcı',
      `Günün antrenmanı: ${currentWorkout.title} (${currentWorkout.track}) - Hedef Pace: ${currentWorkout.targetPace}`
    );
  };

  const isTodayWorkoutDone = Boolean(
    userLogs[selectedDateStr]?.completedWorkout || selectedDateStr === '2026-09-02'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0A0A0A] dark:text-[#E0E0E0] flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenReminders={() => setShowRemindersModal(true)}
        onOpenCourses={() => setShowCoursesModal(true)}
        activeTab={activeTab}
        daysRemaining={daysRemaining}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 sm:px-6">
        {activeTab === 'today' && (
          <TodayView
            currentWorkout={currentWorkout}
            allWorkouts={WORKOUT_DAYS}
            selectedDateStr={selectedDateStr}
            onSelectDate={setSelectedDateStr}
            dayLog={currentDayLog}
            onUpdateLog={handleUpdateCurrentLog}
            onOpenWorkoutDetail={(w) => setSelectedWorkoutModal(w)}
            onLaunchTimer={handleLaunchTimer}
            onOpenProtocols={() => setActiveTab('protocols')}
            onOpenCourses={() => setShowCoursesModal(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            allWorkouts={WORKOUT_DAYS}
            userLogs={userLogs}
            selectedDateStr={selectedDateStr}
            onSelectDate={(dateStr) => {
              setSelectedDateStr(dateStr);
              setActiveTab('today');
            }}
            onOpenWorkoutDetail={(w) => setSelectedWorkoutModal(w)}
            onExportICS={exportToCalendarICS}
          />
        )}

        {activeTab === 'timer' && (
          <div className="space-y-6 pb-24">
            <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-6 shadow-xl dark:shadow-2xl text-center space-y-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                🏃 İnterval ve Koşu Sayacı
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-[#F5F5F5]">
                {currentWorkout.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A3A3A3] max-w-md mx-auto">
                {currentWorkout.details}
              </p>
              <div className="pt-2">
                <button
                  id="tab-start-timer-btn"
                  onClick={() => handleLaunchTimer(currentWorkout)}
                  className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 transition active:scale-95 cursor-pointer"
                >
                  Günün Koşu Sayacını Başlat
                </button>
              </div>
            </div>

            {/* Interval workouts list */}
            <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">
                Programdaki Tüm İnterval & HIIT Antrenmanları
              </h3>
              <div className="space-y-2">
                {WORKOUT_DAYS.filter(
                  (w) => w.workoutType === 'hiit' || w.workoutType === 'interval' || w.intervalSteps
                ).map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] hover:border-slate-300 dark:hover:border-[#383838] transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                          {w.displayDate} ({w.weekLabel})
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-[#F5F5F5]">{w.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#A3A3A3] mt-0.5">{w.track} • {w.targetPace}</p>
                    </div>
                    <button
                      onClick={() => handleLaunchTimer(w)}
                      className="rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 text-xs font-bold hover:bg-orange-500 hover:text-white transition cursor-pointer"
                    >
                      Başlat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'protocols' && <ProtocolsView />}

        {activeTab === 'settings' && (
          <div className="space-y-6 pb-24">
            <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 sm:p-6 shadow-lg dark:shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F5F5]">
                Akıllı Hatırlatıcılar & Cihaz Ayarları
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A3A3A3]">
                Program bildirim saatlerini özelleştirin, test edin veya telefon takviminize aktarın.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => setShowRemindersModal(true)}
                  className="rounded-2xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Hatırlatıcı Saatlerini Düzenle
                </button>
                <button
                  onClick={exportToCalendarICS}
                  className="rounded-2xl bg-slate-100 border border-slate-300 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-[#E0E0E0] hover:bg-slate-200 dark:hover:bg-[#252525] transition cursor-pointer"
                >
                  Takvime Aktar (.ics)
                </button>
              </div>
            </div>

            {/* Quick overview of reminders */}
            <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">Aktif Günlük Alarmlar</h3>
              <div className="space-y-2">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border ${
                      rem.enabled
                        ? 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-[#0D0D0D] dark:border-[#222222] dark:text-[#E0E0E0]'
                        : 'bg-slate-100/60 border-slate-200/60 text-slate-400 dark:bg-[#0A0A0A] dark:border-[#1C1C1C] dark:text-[#606060]'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 mr-2">{rem.time}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F5F5F5]">{rem.title}</span>
                      <p className="text-[11px] text-slate-500 dark:text-[#A3A3A3] mt-0.5">{rem.description}</p>
                    </div>
                    <span className="text-xs">{rem.enabled ? '✅' : '⏸️'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation for Mobile / Tablet */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayCompleted={isTodayWorkoutDone}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* MODALS */}
      {/* 1. Workout Detail & Logger Modal */}
      {selectedWorkoutModal && (
        <WorkoutDetailModal
          workout={selectedWorkoutModal}
          log={userLogs[selectedWorkoutModal.dateStr]}
          onSaveLog={handleSaveWorkoutLog}
          onClose={() => setSelectedWorkoutModal(null)}
          onLaunchTimer={() => {
            handleLaunchTimer(selectedWorkoutModal);
            setSelectedWorkoutModal(null);
          }}
        />
      )}

      {/* 2. Interval Timer Active Modal */}
      {timerWorkout && (
        <IntervalTimerModal
          workout={timerWorkout}
          onClose={() => setTimerWorkout(null)}
          onFinishWorkout={handleFinishTimerWorkout}
        />
      )}

      {/* 3. Reminders Settings Modal */}
      {showRemindersModal && (
        <RemindersSettingsModal
          reminders={reminders}
          onUpdateReminders={setReminders}
          onResetDefaults={() => setReminders(DEFAULT_REMINDERS)}
          permission={permission}
          onRequestPermission={requestPermission}
          onSendTestNotification={handleTestNotification}
          onExportICS={exportToCalendarICS}
          onClose={() => setShowRemindersModal(false)}
        />
      )}

      {/* 4. Course Guide Modal */}
      {showCoursesModal && (
        <CourseGuideModal onClose={() => setShowCoursesModal(false)} />
      )}
    </div>
  );
}
