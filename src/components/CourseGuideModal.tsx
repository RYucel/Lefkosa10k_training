import { Compass, MapPin, Sparkles, X } from 'lucide-react';
import { COURSES_INFO } from '../data/planData';

interface CourseGuideModalProps {
  onClose: () => void;
}

export function CourseGuideModal({ onClose }: CourseGuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#0D0D0D]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F5F5]">
                Lefkoşa Parkur & Saha Rehberi
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A3A3A3]">
                Programdaki 4 ana koşu güzergahı ve zemin özellikleri
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

        {/* Courses List */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {COURSES_INFO.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#0D0D0D] dark:border-[#222222] p-4 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">{course.name}</h3>
                </div>
                <span className="rounded-lg bg-white border border-slate-200 dark:bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 dark:border-[#2E2E2E]">
                  {course.distance}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-white border border-slate-200 text-slate-700 dark:bg-[#141414] dark:text-[#CCCCCC] px-2.5 py-1 rounded-lg dark:border-[#262626]">
                  Zemin: <strong className="text-slate-900 dark:text-[#F5F5F5]">{course.surface}</strong>
                </span>
                <span className="bg-orange-50 border border-orange-200 text-orange-800 dark:bg-orange-500/10 dark:text-orange-300 px-2.5 py-1 rounded-lg dark:border-orange-500/20 font-medium">
                  {course.bestFor}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#A3A3A3] leading-relaxed pt-1">
                {course.description}
              </p>
            </div>
          ))}

          {/* Stride & Form Note */}
          <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span>Adım Boyu & Kadans Kuralı (113 cm)</span>
            </div>
            <p>
              Programınız özellikle 113 cm adım boyunu ve akıcı kadansı koruyacak şekilde tasarlanmıştır. Metehan düzlüğünde ve Tartan pistte gövdeyi dik tutarak kalçadan adım atın.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#0D0D0D]">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-orange-500 py-3 text-xs font-bold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
