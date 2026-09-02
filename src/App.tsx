import { useState, useEffect } from 'react';
import { SvgIcons, Icon } from './components/SvgIcons';
import { Toasts, ToastItem } from './components/Toasts';
import { TodayAthleticView } from './components/TodayAthleticView';
import { PlanAthleticView } from './components/PlanAthleticView';
import { SupplementsAthleticView } from './components/SupplementsAthleticView';
import { GuideAthleticView } from './components/GuideAthleticView';
import { SettingsAthleticView, RemSettings } from './components/SettingsAthleticView';
import { IntervalTimerModal } from './components/IntervalTimerModal';
import {
  ATHLETIC_PLAN,
  BY_DATE,
  PlanDay,
  RACE_DATE,
  RACE_ISO,
  ISO,
  parseISO,
  pad,
} from './data/athleticPlan';
import { playAthleticBeep, triggerVibrate } from './utils/sound';

const STORAGE_LOGS = 'lefkosa10k_user_logs_v1';
const STORAGE_REM = 'lefkosa10k_reminders_v1';
const STORAGE_NOTIF = 'lefkosa10k_notif_fired_v1';

const DEFAULT_REM: RemSettings = {
  morning: { on: 1, t: '07:30' },
  workout: { on: 1, t: '17:30' },
  evening: { on: 1, t: '20:30' },
  magnesium: { on: 1, t: '22:30' },
  race: { on: 1, t: '06:00' },
};

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'today' | 'plan' | 'supps' | 'guide' | 'settings'>('today');

  // Preview date override (for testing all 40 days)
  const [previewIso, setPreviewIso] = useState<string | null>(null);

  // Done map for workouts / days: Record<iso, timestamp>
  const [doneMap, setDoneMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.done) return parsed.done;
      }
    } catch {}
    return { '2026-09-02': Date.now() }; // Day 1 marked done as per original training log
  });

  // Supplement logs: Record<iso, Record<suppId, timestamp>>
  const [suppMap, setSuppMap] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.supp) return parsed.supp;
      }
    } catch {}
    return {
      '2026-09-02': { nac: Date.now(), o3: Date.now(), mg: Date.now() },
    };
  });

  // Notes map: Record<iso, noteText>
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.notes) return parsed.notes;
      }
    } catch {}
    return { '2026-09-02': 'Açılış koşusu tamamlandı. 10.15 km 5\'46" /km' };
  });

  // Reminder settings
  const [reminders, setReminders] = useState<RemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REM);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_REM;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Timer Modal
  const [timerWorkout, setTimerWorkout] = useState<PlanDay | null>(null);

  // Live ticker text
  const [tickerText, setTickerText] = useState('');

  // Notification permission state
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  }, []);

  // Save logs
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_LOGS,
        JSON.stringify({
          done: doneMap,
          supp: suppMap,
          notes: notesMap,
        })
      );
    } catch (e) {
      console.error('Save logs error:', e);
    }
  }, [doneMap, suppMap, notesMap]);

  // Save reminders
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REM, JSON.stringify(reminders));
    } catch (e) {
      console.error('Save rem error:', e);
    }
  }, [reminders]);

  // Push toast helper
  const addToast = (title: string, body: string, icon = 'bell') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, body, icon }]);
    playAthleticBeep('beep');
    triggerVibrate([80, 50, 80]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Request browser notification permission
  const handleRequestPermission = async () => {
    if (typeof Notification === 'undefined') {
      addToast('BİLDİRİM DESTEKLENMİYOR', 'Tarayıcınız bildirim özelliğini desteklemiyor.', 'warn');
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        addToast('BİLDİRİMLER ETKİN', 'Lefkoşa 10K bildirimleri başarıyla aktifleştirildi.', 'check');
      } else {
        addToast('İZİN VERİLMEDİ', 'Bildirim izni reddedildi veya kapatıldı.', 'warn');
      }
    } catch {
      addToast('HATA', 'Bildirim izni istenirken bir sorun oluştu.', 'warn');
    }
  };

  // Test Notification
  const handleTestNotification = () => {
    addToast(
      'HATIRLATICI DENEMESİ',
      'NAC 600 mg + Omega-3 zamanı · 2.5–3 L su hedefini unutma!',
      'bell'
    );
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('Lefkoşa 10K Hatırlatıcı', {
          body: 'NAC 600 mg + Omega-3 zamanı · 2.5–3 L su hedefini unutma!',
          icon: '/pwa-192x192.png',
        });
      } catch {}
    }
  };

  // Real-time Countdown Ticker
  useEffect(() => {
    const updateTicker = () => {
      const now = new Date();
      const diffMs = RACE_DATE.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTickerText('START SİNYALİ VERİLDİ');
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hrs = Math.floor((totalSec % 86400) / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      setTickerText(`${days} GÜN ${pad(hrs)}:${pad(mins)}:${pad(secs)} KALDI`);
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, []);

  // Background reminder checker (Runs every 30 seconds)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const iso = ISO(now);
      const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const pd = ATHLETIC_PLAN[BY_DATE[iso]];

      let firedLogs: Record<string, boolean> = {};
      try {
        const saved = localStorage.getItem(STORAGE_NOTIF);
        if (saved) firedLogs = JSON.parse(saved);
      } catch {}

      const checkOne = (k: keyof RemSettings, title: string, body: string, cond = true) => {
        const obj = reminders[k];
        if (!obj || !obj.on || obj.t !== hm || !cond) return;
        const key = `${iso}_${k}`;
        if (firedLogs[key]) return;

        firedLogs[key] = true;
        try {
          localStorage.setItem(STORAGE_NOTIF, JSON.stringify(firedLogs));
        } catch {}

        addToast(title, body, 'bell');
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            new Notification(title, {
              body,
              icon: '/pwa-192x192.png',
            });
          } catch {}
        }
      };

      // Morning
      checkOne('morning', 'SABAH TAKVİYESİ', 'NAC 600 mg (aç karnına) + Omega-3 ×2 almayı unutma!');

      // Workout (only on active workout days)
      if (pd && pd.type !== 'rest') {
        checkOne(
          'workout',
          'ANTRENMAN ZAMANI',
          `Bugün: ${pd.t} (${pd.km || ''}) · ${pd.loc || ''} · Mideyi doldurma, hafif karbonhidrat al.`
        );
      }

      // Evening
      checkOne('evening', 'AKŞAM TAKVİYESİ', 'Çinko 25 mg (yemekten sonra) + D3·K2 zamanı.');

      // Magnesium
      checkOne('magnesium', 'MAGNEZYUM & DİNLENME', 'Magnezyum 200–400 mg zamanı · Derin uyku için 7.5–8 saat hedefle.');

      // Race Day
      if (iso === RACE_ISO) {
        checkOne(
          'race',
          'YARIŞ GÜNÜ BAŞLADI',
          'Hafif yarış kahvaltısı yap (beyaz ekmek + bal/muz). Isınmayı ihmal etme!',
          true
        );
      }
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  // Current working date
  const effectiveDate = previewIso ? parseISO(previewIso) : new Date();

  // Handlers for data updates
  const handleToggleDone = (iso: string) => {
    setDoneMap((prev) => {
      const next = { ...prev };
      if (next[iso]) {
        delete next[iso];
      } else {
        next[iso] = Date.now();
      }
      return next;
    });
  };

  const handleToggleSupp = (iso: string, suppId: string) => {
    setSuppMap((prev) => {
      const dayLog = { ...(prev[iso] || {}) };
      if (dayLog[suppId]) {
        delete dayLog[suppId];
      } else {
        dayLog[suppId] = Date.now();
      }
      return { ...prev, [iso]: dayLog };
    });
  };

  const handleSaveNote = (iso: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [iso]: note }));
  };

  const handleResetAllData = () => {
    setDoneMap({});
    setSuppMap({});
    setNotesMap({});
    try {
      localStorage.removeItem(STORAGE_LOGS);
      localStorage.removeItem(STORAGE_NOTIF);
    } catch {}
    addToast('VERİLER SIFIRLANDI', 'Tüm antrenman ve takviye kayıtları temizlendi.', 'trash');
  };

  return (
    <>
      <SvgIcons />

      {/* STICKY TOPBAR */}
      <header className="topbar">
        <div className="topbar-in">
          <div>
            <div className="brand">
              LEFKOŞA 10K <em>· 11 EKİM</em>
            </div>
            <div className="brand-sub">40 GÜNLÜK AKILLI YOL HARİTASI</div>
          </div>
          <button
            id="bellBtn"
            className="bell-btn"
            title="Bildirim Ayarları"
            onClick={() => {
              if (permission !== 'granted') {
                handleRequestPermission();
              } else {
                handleTestNotification();
              }
            }}
          >
            <Icon name="bell" />
            <span className={`bell-dot ${permission === 'granted' ? 'on' : ''}`} id="bellDot"></span>
          </button>
        </div>
      </header>

      {/* MAIN VIEW CONTAINER */}
      <main className="app">
        {activeTab === 'today' && (
          <TodayAthleticView
            currentDate={effectiveDate}
            isCustomPreview={Boolean(previewIso)}
            previewIso={previewIso}
            doneMap={doneMap}
            suppMap={suppMap}
            notesMap={notesMap}
            onToggleDone={handleToggleDone}
            onToggleSupp={handleToggleSupp}
            onSaveNote={handleSaveNote}
            onLaunchTimer={(pd) => setTimerWorkout(pd)}
            tickerText={tickerText}
          />
        )}

        {activeTab === 'plan' && (
          <PlanAthleticView
            currentDate={effectiveDate}
            doneMap={doneMap}
            onToggleDone={handleToggleDone}
            onSelectDate={(iso) => {
              setPreviewIso(iso);
              setActiveTab('today');
            }}
          />
        )}

        {activeTab === 'supps' && <SupplementsAthleticView suppMap={suppMap} />}

        {activeTab === 'guide' && <GuideAthleticView />}

        {activeTab === 'settings' && (
          <SettingsAthleticView
            rem={reminders}
            onUpdateRem={setReminders}
            previewIso={previewIso}
            onSetPreview={setPreviewIso}
            onResetAllData={handleResetAllData}
            onTestNotification={handleTestNotification}
            onRequestPermission={handleRequestPermission}
            permission={permission}
          />
        )}
      </main>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav className="tabbar">
        <div className="tab-in">
          <button
            className={`tab ${activeTab === 'today' ? 'on' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <Icon name="route" />
            <span>BUGÜN</span>
          </button>

          <button
            className={`tab ${activeTab === 'plan' ? 'on' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            <Icon name="cal" />
            <span>PLAN</span>
          </button>

          <button
            className={`tab ${activeTab === 'supps' ? 'on' : ''}`}
            onClick={() => setActiveTab('supps')}
          >
            <Icon name="pill" />
            <span>TAKVİYE</span>
          </button>

          <button
            className={`tab ${activeTab === 'guide' ? 'on' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            <Icon name="book" />
            <span>REHBER</span>
          </button>

          <button
            className={`tab ${activeTab === 'settings' ? 'on' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Icon name="sliders" />
            <span>AYAR</span>
          </button>
        </div>
      </nav>

      {/* TOAST SYSTEM */}
      <Toasts toasts={toasts} onDismiss={removeToast} />

      {/* INTERVAL TIMER MODAL */}
      {timerWorkout && (
        <IntervalTimerModal
          planDay={timerWorkout}
          onClose={() => setTimerWorkout(null)}
          onFinishWorkout={() => {
            handleToggleDone(timerWorkout.d);
            addToast('ANTRENMAN TAMAMLANDI', `${timerWorkout.t} başarıyla kaydedildi!`, 'check');
          }}
        />
      )}
    </>
  );
}
