import { Bell, MapPin, Moon, Sparkles, Sun } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { MARATHON_META } from '../data/planData';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenReminders: () => void;
  onOpenCourses: () => void;
  activeTab: string;
  daysRemaining: number;
}

export function Navbar({ onOpenReminders, onOpenCourses, daysRemaining }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 dark:border-[#222222] dark:bg-[#0D0D0D]/90 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20">
            <span className="text-base font-black tracking-tighter text-white">10K</span>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D0D0D]">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#F5F5F5] sm:text-base">
                Lefkoşa 10K Maratonu
              </h1>
              <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400 border border-orange-500/20">
                Hedef {MARATHON_META.targetTime}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A3A3A3] flex items-center gap-1.5">
              <span>11 Ekim 2026</span>
              <span className="text-slate-300 dark:text-[#404040]">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {daysRemaining > 0 ? `${daysRemaining} gün kaldı` : 'Yarış Günü!'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
            aria-label="Tema Değiştir"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-[#262626] dark:bg-[#141414] dark:text-[#E0E0E0] dark:hover:border-[#383838] dark:hover:text-white dark:hover:bg-[#1A1A1A] transition cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          <PWAInstallButton />

          <button
            id="nav-courses-btn"
            onClick={onOpenCourses}
            title="Parkur Rehberi"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-[#262626] dark:bg-[#141414] dark:text-[#E0E0E0] dark:hover:border-[#383838] dark:hover:bg-[#1A1A1A] transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
            <span>Parkurlar</span>
          </button>

          <button
            id="nav-reminders-btn"
            onClick={onOpenReminders}
            title="Hatırlatıcılar ve Bildirimler"
            className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-[#262626] dark:bg-[#141414] dark:text-[#E0E0E0] dark:hover:border-[#383838] dark:hover:text-white dark:hover:bg-[#1A1A1A] transition cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

