import { useState } from 'react';
import {
  Apple,
  Clock,
  Droplets,
  Flame,
  Heart,
  Info,
  Moon,
  Pill,
  ShieldAlert,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { SUPPLEMENTS, NUTRITION_PROTOCOLS, RECOVERY_PROTOCOLS, MARATHON_META } from '../data/planData';

export function ProtocolsView() {
  const [activeSubTab, setActiveSubTab] = useState<'supplements' | 'nutrition' | 'recovery' | 'race_tactics'>('supplements');

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 sm:p-6 shadow-lg dark:shadow-2xl transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Kapsamlı Hazırlık Rehberi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F5F5] mt-1">
          Performans ve Protokol Kılavuzu
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A3A3A3] mt-1">
          11 Ekim 2026 Lefkoşa Maratonu (10K) hedef süre (48:00 – 49:30) için takviye, beslenme, hidrasyon ve eklem koruma standartları.
        </p>

        {/* Sub Navigation */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('supplements')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'supplements'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:bg-[#0D0D0D] dark:text-[#A3A3A3] dark:border-[#222222] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1A1A1A]'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Takviyeler ({SUPPLEMENTS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('nutrition')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'nutrition'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:bg-[#0D0D0D] dark:text-[#A3A3A3] dark:border-[#222222] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1A1A1A]'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Beslenme & Hidrasyon</span>
          </button>

          <button
            onClick={() => setActiveSubTab('recovery')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'recovery'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:bg-[#0D0D0D] dark:text-[#A3A3A3] dark:border-[#222222] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1A1A1A]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dinlenme & Masaj</span>
          </button>

          <button
            onClick={() => setActiveSubTab('race_tactics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'race_tactics'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:bg-[#0D0D0D] dark:text-[#A3A3A3] dark:border-[#222222] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1A1A1A]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Yarış Stratejisi (10K)</span>
          </button>
        </div>
      </div>

      {/* 1. SUPPLEMENTS PROTOCOL */}
      {activeSubTab === 'supplements' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-200">
            ℹ️ <strong className="text-amber-950 dark:text-white">Not:</strong> Elinizdeki mevcut ürün listesine göre özel olarak yapılandırılmıştır. Doz ve zamanlama kurallarına sadık kalın.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPLEMENTS.map((supp) => (
              <div
                key={supp.id}
                className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-2xl space-y-3 relative overflow-hidden transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      {supp.brand}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F5F5] mt-0.5">
                      {supp.name}
                    </h3>
                  </div>
                  <span className="rounded-xl bg-slate-100 border border-slate-300 dark:bg-[#1A1A1A] px-2.5 py-1 text-xs font-mono font-bold text-slate-800 dark:text-[#E0E0E0] dark:border-[#2E2E2E]">
                    {supp.dose}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-[#CCCCCC]">
                    <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-[#F5F5F5]">Zamanlama:</span>
                    <span>{supp.timing}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-[#A3A3A3] leading-relaxed">
                  <strong className="text-slate-800 dark:text-[#CCCCCC] block mb-0.5">Koşu & Performans Açısından Amacı:</strong>
                  {supp.purpose}
                </div>

                {supp.caution && (
                  <div className="bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium">
                    ⚠️ {supp.caution}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. NUTRITION & HYDRATION PROTOCOL */}
      {activeSubTab === 'nutrition' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NUTRITION_PROTOCOLS.map((nut, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-2xl space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#222222]">
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F5F5] flex items-center gap-2">
                    <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {nut.phase}
                  </h3>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg dark:text-[#A3A3A3] dark:bg-[#1A1A1A] dark:border-[#2E2E2E]">
                    {nut.timing}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] text-slate-700 dark:text-[#D4D4D4]">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#A3A3A3] block mb-1">
                      Önerilen Besin Tercihleri:
                    </span>
                    {nut.foodChoices}
                  </div>

                  <div className="bg-orange-50 border border-orange-200 dark:bg-orange-500/10 p-3 rounded-2xl dark:border-orange-500/20 text-orange-900 dark:text-orange-200">
                    <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 block mb-1">
                      ⚡ Kritik Kurallar:
                    </span>
                    {nut.criticalRules}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOVERY & JOINT CARE PROTOCOL */}
      {activeSubTab === 'recovery' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOVERY_PROTOCOLS.map((rec, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-5 shadow-lg dark:shadow-2xl space-y-3 transition-colors"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-[#222222]">
                  <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F5F5]">{rec.area}</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] p-3 rounded-2xl dark:border-[#222222] text-slate-700 dark:text-[#D4D4D4]">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#A3A3A3] block mb-1">
                      Uygulama Rehberi:
                    </span>
                    {rec.practice}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 p-3 rounded-2xl dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                      🌱 Fizyolojik Faydası:
                    </span>
                    {rec.benefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RACE DAY TACTICS (10K 48:00 - 49:30) */}
      {activeSubTab === 'race_tactics' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-6 shadow-lg dark:shadow-2xl space-y-4 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>11 Ekim 2026 Lefkoşa Maratonu (10K) Yarış Planı</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-[#F5F5F5]">
              Hedef: 48:00 – 49:30 (Ortalama Pace: 4'48" – 4'57"/km)
            </h3>

            <div className="space-y-3 pt-2">
              {/* Split 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-xs">
                  1-3K
                </span>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-[#F5F5F5] text-sm">İlk 3 Kilometre (Kontrollü Başlangıç)</strong>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">5'05" /km</span>
                  </div>
                  <p className="text-slate-500 dark:text-[#A3A3A3] mt-1">
                    Başlangıç kalabalığında heyecanla aşırı hızlı fırlamayın. Nabzı laktat eşiğinin altında tutarak vücudu yarış temposuna alıştırın.
                  </p>
                </div>
              </div>

              {/* Split 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs">
                  4-7K
                </span>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-[#F5F5F5] text-sm">Dereboyu Atağı & Ana Ritim</strong>
                    <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">4'45" /km</span>
                  </div>
                  <p className="text-slate-500 dark:text-[#A3A3A3] mt-1">
                    Dereboyu düzlüğünde tempoyu yükseltin. 113 cm adım boyu ve yüksek kadans ile ritmi koruyarak geçenleri tek tek toplayın.
                  </p>
                </div>
              </div>

              {/* Split 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  8-10K
                </span>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-[#F5F5F5] text-sm">Son 2 Kilometre & Finiş Sprinti</strong>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Maksimum Çaba 🏁</span>
                  </div>
                  <p className="text-slate-500 dark:text-[#A3A3A3] mt-1">
                    Kalan tüm enerjinizi finiş çizgisine boşaltın. Hedef 48:xx ile Lefkoşa finişini gururla geçin!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
