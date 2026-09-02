import { useState, useEffect } from 'react';
import { Icon } from './SvgIcons';
import { usePWAInstall } from '../hooks/usePWAInstall';

export interface RemSettings {
  morning: { on: number; t: string };
  workout: { on: number; t: string };
  evening: { on: number; t: string };
  magnesium: { on: number; t: string };
  race: { on: number; t: string };
}

interface SettingsAthleticViewProps {
  rem: RemSettings;
  onUpdateRem: (rem: RemSettings) => void;
  previewIso: string | null;
  onSetPreview: (iso: string | null) => void;
  onResetAllData: () => void;
  onTestNotification: () => void;
  onRequestPermission: () => Promise<void>;
  permission: NotificationPermission | 'unsupported';
}

export function SettingsAthleticView({
  rem,
  onUpdateRem,
  previewIso,
  onSetPreview,
  onResetAllData,
  onTestNotification,
  onRequestPermission,
  permission,
}: SettingsAthleticViewProps) {
  const [resetArmed, setResetArmed] = useState(false);
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    if (resetArmed) {
      const timer = setTimeout(() => setResetArmed(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [resetArmed]);

  const handleToggleSwitch = (key: keyof RemSettings) => {
    onUpdateRem({
      ...rem,
      [key]: {
        ...rem[key],
        on: rem[key].on ? 0 : 1,
      },
    });
  };

  const handleTimeChange = (key: keyof RemSettings, value: string) => {
    onUpdateRem({
      ...rem,
      [key]: {
        ...rem[key],
        t: value,
      },
    });
  };

  const reminderRows: { key: keyof RemSettings; title: string; desc: string }[] = [
    { key: 'morning', title: 'Sabah takviye', desc: 'NAC 600 mg + Omega-3 ×2' },
    { key: 'workout', title: 'Antrenman hatırlatması', desc: 'Sadece antrenman olan günlerde' },
    { key: 'evening', title: 'Akşam takviye', desc: 'Çinko 25 mg + D3·K2' },
    { key: 'magnesium', title: 'Magnezyum', desc: 'Yatmadan 45–60 dk · uyku desteği' },
    { key: 'race', title: 'Yarış sabahı özel hatırlatma', desc: '11 Ekim 2026 · kahvaltı + hazırlık' },
  ];

  return (
    <section className="view on">
      <div className="view-h">
        <div className="lbl">SİSTEM</div>
        <h1>Ayarlar</h1>
      </div>

      {/* 1. Bildirimler */}
      <div className="set-sec">
        <div className="lbl" style={{ marginBottom: '4px' }}>
          Bildirimler
        </div>

        <div className="set-row">
          <div className="set-l">
            <b>Durum</b>
            <span>Hatırlatıcılar uygulama açıkken sistem bildirimi + titreşim + ses ile gelir.</span>
          </div>
          <span className={`status-chip ${permission === 'granted' ? 'ok' : ''}`}>
            {permission === 'granted'
              ? 'BİLDİRİM: ETKİN'
              : permission === 'denied'
              ? 'BİLDİRİM: REDDEDİLDİ'
              : permission === 'unsupported'
              ? 'BİLDİRİM: DESTEKLENMİYOR'
              : 'BİLDİRİM: İZİN BEKLİYOR'}
          </span>
        </div>

        {permission !== 'granted' && (
          <div className="set-row">
            <div className="set-l">
              <b>Bildirim izni</b>
              <span>Tarayıcıdan bildirim izni iste.</span>
            </div>
            <button className="pill-btn acc" onClick={onRequestPermission}>
              İZİN VER
            </button>
          </div>
        )}

        <div className="set-row">
          <div className="set-l">
            <b>Örnek bildirim</b>
            <span>Sistemin sesli ve görsel uyarısını dene.</span>
          </div>
          <button className="pill-btn" onClick={onTestNotification}>
            DENE
          </button>
        </div>
      </div>

      {/* 2. Hatırlatma Saatleri */}
      <div className="set-sec">
        <div className="lbl" style={{ marginBottom: '4px' }}>
          Hatırlatma Saatleri
        </div>
        {reminderRows.map((row) => (
          <div key={row.key} className="set-row">
            <div className="set-l">
              <b>{row.title}</b>
              <span>{row.desc}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="time"
                value={rem[row.key].t}
                onChange={(e) => handleTimeChange(row.key, e.target.value)}
              />
              <button
                className={`switch ${rem[row.key].on ? 'on' : ''}`}
                onClick={() => handleToggleSwitch(row.key)}
                aria-label={`${row.title} aç/kapat`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Uygulama & PWA */}
      <div className="set-sec">
        <div className="lbl" style={{ marginBottom: '4px' }}>
          Uygulama (PWA)
        </div>
        <div className="set-row">
          <div className="set-l">
            <b>Uygulamayı yükle</b>
            <span>Tam ekran, ikonlu ve çevrimdışı kullanım için ana ekrana ekle.</span>
          </div>
          {isInstallable && !isInstalled && (
            <button className="pill-btn acc" onClick={install}>
              YÜKLE
            </button>
          )}
          {isInstalled && <span className="status-chip ok">KURULDU</span>}
        </div>
        <div className="hint">
          {isIOS
            ? 'iPhone / iPad: Safari → Paylaş (Kare+Ok) → “Ana Ekrana Ekle”.'
            : 'Android: Chrome menüsü (⋮) → “Uygulamayı yükle” veya “Ana ekrana ekle”. Hatırlatıcıların ve sayacın tam ekran çalışması için uygulamayı yükleyin.'}
        </div>
      </div>

      {/* 4. Test & Veri */}
      <div className="set-sec">
        <div className="lbl" style={{ marginBottom: '4px' }}>
          Test &amp; Veri
        </div>

        <div className="set-row">
          <div className="set-l">
            <b>Görüntüleme tarihi</b>
            <span>Planın herhangi bir gününü “bugün” gibi gör (hatırlatıcılar etkilenmez).</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="date"
              min="2026-09-02"
              max="2026-10-11"
              value={previewIso || ''}
              onChange={(e) => onSetPreview(e.target.value || null)}
            />
            {previewIso && (
              <button
                onClick={() => onSetPreview(null)}
                className="text-xs font-mono text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>

        <div className="set-row">
          <div className="set-l">
            <b>Tüm verileri sıfırla</b>
            <span>Tamamlanan koşular, notlar ve takviye kayıtları sıfırlanır.</span>
          </div>
          <button
            className={`pill-btn danger ${resetArmed ? 'arm' : ''}`}
            onClick={() => {
              if (resetArmed) {
                onResetAllData();
              } else {
                setResetArmed(true);
              }
            }}
          >
            <Icon name="trash" style={{ width: '16px', height: '16px' }} />
            <span>{resetArmed ? 'EMİNSEN TEKRAR DOKUN' : 'SIFIRLA'}</span>
          </button>
        </div>
      </div>

      <div className="hint" style={{ marginTop: '22px' }}>
        Lefkoşa 10K · 11 Ekim 2026 — tüm veriler yalnızca bu cihazda (localStorage) saklanır.
      </div>
    </section>
  );
}
