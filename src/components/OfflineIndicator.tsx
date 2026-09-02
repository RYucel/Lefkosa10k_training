import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator"
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-6 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 px-4 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md border border-amber-400/30 animate-pulse"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
      <span>Çevrimdışı Mod — Antrenman ve takviye verileriniz yerel olarak kaydediliyor.</span>
    </div>
  );
}
