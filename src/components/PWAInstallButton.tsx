import { useState } from 'react';
import { Download, Smartphone, X, Check, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  const handleAction = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-btn"
        onClick={handleAction}
        title="Uygulamayı Telefona / Ana Ekrana Yükle"
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition cursor-pointer"
      >
        {isIOS ? (
          <>
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">iOS'a Ekle</span>
            <span className="xs:hidden">Yükle</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Telefona Yükle</span>
            <span className="xs:hidden">Yükle</span>
          </>
        )}
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 dark:bg-[#141414] dark:border-[#262626] p-6 shadow-2xl transition-colors my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222222]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Smartphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F5F5]">
                    Telefona Kurulum Rehberi (PWA)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A3A3A3]">
                    Uygulamayı ana ekranınıza ekleyip çevrimdışı ve tam ekran kullanın
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:text-[#808080] dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Install button if available */}
            {isInstallable && (
              <div className="mt-4 p-3 rounded-2xl bg-orange-50 border border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20 flex items-center justify-between gap-3">
                <span className="text-xs text-orange-950 dark:text-orange-200 font-medium">
                  Tarayıcınız tek tıkla yüklemeyi destekliyor:
                </span>
                <button
                  onClick={() => {
                    install();
                    setShowGuide(false);
                  }}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 transition shrink-0 cursor-pointer shadow-sm"
                >
                  Şimdi Yükle
                </button>
              </div>
            )}

            {/* Tab/Guide by OS */}
            <div className="mt-4 space-y-4">
              {/* iPhone / iPad */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#222222] dark:bg-[#0D0D0D] p-4 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-[#F5F5F5]">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>iPhone / iPad (Safari) için:</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700 dark:text-[#CCCCCC] pl-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600 dark:text-orange-400">1.</span>
                    <p>Safari'nin altındaki <strong className="text-slate-900 dark:text-white">Paylaş (Kare + Yukarı Ok)</strong> simgesine dokunun.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600 dark:text-orange-400">2.</span>
                    <p>Aşağı kaydırıp <strong className="text-slate-900 dark:text-white">"Ana Ekrana Ekle"</strong> seçeneğini seçin.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600 dark:text-orange-400">3.</span>
                    <p>Sağ üstteki <strong className="text-slate-900 dark:text-white">Ekle</strong>'ye basın. Artık ana ekranınızda bağımsız uygulama gibi çalışır.</p>
                  </div>
                </div>
              </div>

              {/* Android (Chrome / Samsung Internet) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#222222] dark:bg-[#0D0D0D] p-4 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-[#F5F5F5]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Android (Chrome & Samsung Browser) için:</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700 dark:text-[#CCCCCC] pl-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">1.</span>
                    <p>Tarayıcının sağ üstündeki <strong className="text-slate-900 dark:text-white">üç nokta (⋮)</strong> menüsüne dokunun.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">2.</span>
                    <p><strong className="text-slate-900 dark:text-white">"Uygulamayı Yükle"</strong> veya <strong className="text-slate-900 dark:text-white">"Ana Ekrana Ekle"</strong> butonuna basın.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">3.</span>
                    <p>Onaylayın. Uygulama telefonunuzun uygulama çekmecesine ve ana ekranına ikon olarak eklenir.</p>
                  </div>
                </div>
              </div>

              {/* PWA Advantages checklist */}
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>PWA Olarak Kurulduğunda:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90 pl-1">
                  <li>İnternet bağlantısı olmasa bile (offline) tüm antrenmanlar ve sayaç çalışır.</li>
                  <li>Tarayıcı çubukları gizlenir, tam ekran yerel uygulama deneyimi sunar.</li>
                  <li>Sesli düdükler, interval sayacı ve veriler anında açılır.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-2xl bg-orange-500 py-3 text-xs font-bold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Tamam, Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
