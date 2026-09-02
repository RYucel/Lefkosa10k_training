import { Calendar, CheckCircle2, Clock, Flame, ShieldAlert, LucideIcon } from 'lucide-react';

interface NavItem {
  id: 'today' | 'calendar' | 'timer' | 'protocols' | 'settings';
  label: string;
  icon: LucideIcon;
  badge?: 'done';
}

interface BottomNavProps {
  activeTab: 'today' | 'calendar' | 'timer' | 'protocols' | 'settings';
  setActiveTab: (tab: 'today' | 'calendar' | 'timer' | 'protocols' | 'settings') => void;
  todayCompleted: boolean;
}

export function BottomNav({ activeTab, setActiveTab, todayCompleted }: BottomNavProps) {
  const navItems: NavItem[] = [
    {
      id: 'today',
      label: 'Bugün',
      icon: Flame,
      badge: todayCompleted ? 'done' : undefined,
    },
    {
      id: 'calendar',
      label: 'Takvim (5.5H)',
      icon: Calendar,
    },
    {
      id: 'timer',
      label: 'Interval Sayaç',
      icon: Clock,
    },
    {
      id: 'protocols',
      label: 'Protokoller',
      icon: ShieldAlert,
    },
    {
      id: 'settings',
      label: 'Hatırlatıcı',
      icon: CheckCircle2,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 dark:border-[#222222] dark:bg-[#0D0D0D]/95 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5 sm:max-w-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center rounded-xl py-1.5 px-3 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-semibold scale-105'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#808080] dark:hover:text-[#E0E0E0]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-orange-600 dark:text-orange-400' : 'stroke-[1.8px]'}`} />
                {item.badge === 'done' && (
                  <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D0D0D]" />
                )}
              </div>
              <span className="mt-1 text-[11px] leading-none whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
