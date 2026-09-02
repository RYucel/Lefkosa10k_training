import { useState } from 'react';
import {
  Bell,
  BellOff,
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Pill,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { ReminderSetting } from '../types/plan';

interface RemindersSettingsModalProps {
  reminders: ReminderSetting[];
  onUpdateReminders: (updated: ReminderSetting[]) => void;
  onResetDefaults: () => void;
  permission: NotificationPermission;
  onRequestPermission: () => Promise<boolean>;
  onSendTestNotification: () => void;
  onExportICS: () => void;
  onClose: () => void;
}

export function RemindersSettingsModal({
  reminders,
  onUpdateReminders,
  onResetDefaults,
  permission,
  onRequestPermission,
  onSendTestNotification,
  onExportICS,
  onClose,
}: RemindersSettingsModalProps) {
  const [localReminders, setLocalReminders] = useState<ReminderSetting[]>(reminders);

  const toggleReminder = (id: string) => {
    const updated = localReminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setLocalReminders(updated);
    onUpdateReminders(updated);
  };

  const updateTime = (id: string, newTime: string) => {
    const updated = localReminders.map((r) =>
      r.id === id ? { ...r, time: newTime } : r
    );
    setLocalReminders(updated);
    onUpdateReminders(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#0D0D0D]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <BellRing className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F5F5]">
                Günlük Akıllı Hatırlatıcılar
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A3A3A3]">
                Antrenman, takviye ve beslenme alarmları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-300 dark:bg-[#1A1A1A] dark:text-[#808080] dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Permission Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-[#F5F5F5]">Tarayıcı & Cihaz Bildirimleri</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    permission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : permission === 'denied'
                      ? 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {permission === 'granted' ? 'İzin Verildi ✅' : permission === 'denied' ? 'Engellendi ❌' : 'İzin Bekleniyor'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A3A3A3]">
              Telefonunuzda veya tarayıcınızda günlük antrenman saati ve takviye zamanı geldiğinde anlık bildirim alın.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {permission !== 'granted' ? (
                <button
                  onClick={onRequestPermission}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-2 px-3 text-xs font-bold text-white hover:bg-orange-600 transition shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Bildirimlere İzin Ver</span>
                </button>
              ) : (
                <button
                  onClick={onSendTestNotification}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#1A1A1A] dark:border-[#2E2E2E] py-2 px-3 text-xs font-bold dark:text-[#E0E0E0] dark:hover:bg-[#252525] transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Test Bildirimi Gönder</span>
                </button>
              )}
            </div>
          </div>

          {/* Calendar Sync Card */}
          <div className="rounded-2xl bg-sky-50/70 border border-sky-200 dark:bg-[#0D0D0D] dark:border-sky-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-[#F5F5F5]">Google & Telefon Takvimiyle Senkronizasyon</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A3A3A3]">
              Tüm 40 günlük antrenman programını, parkur ve hedef pace bilgilerini tek tıkla telefon takviminize (.ics) aktarın.
            </p>
            <button
              onClick={onExportICS}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white hover:bg-sky-500 transition shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>40 Günlük Takvimi İndir (.ics)</span>
            </button>
          </div>

          {/* Individual Reminders List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#808080] px-1">
              <span className="font-bold text-slate-700 dark:text-[#A3A3A3] uppercase tracking-wider text-[11px]">
                Planlanmış Günlük Hatırlatıcılar
              </span>
              <button
                onClick={onResetDefaults}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-[#808080] dark:hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Varsayılana Dön</span>
              </button>
            </div>

            {localReminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  rem.enabled
                    ? 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-[#0D0D0D] dark:border-[#222222] dark:text-[#E0E0E0]'
                    : 'bg-slate-100/50 border-slate-200 opacity-60 text-slate-400 dark:bg-[#0A0A0A] dark:border-[#1C1C1C] dark:text-[#707070]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <input
                      type="time"
                      value={rem.time}
                      onChange={(e) => updateTime(rem.id, e.target.value)}
                      className="rounded-xl bg-white border border-slate-300 dark:bg-[#141414] dark:border-[#2E2E2E] px-2 py-1 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 focus:border-orange-500 focus:outline-none"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F5F5] truncate">
                        {rem.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#A3A3A3] truncate">
                        {rem.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      rem.enabled
                        ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                        : 'bg-white text-slate-400 border border-slate-200 dark:bg-[#1A1A1A] dark:text-[#707070] dark:border-[#262626]'
                    }`}
                  >
                    {rem.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#0D0D0D]">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-orange-500 py-3 text-xs font-bold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            Tamam ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
