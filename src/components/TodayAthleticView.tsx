import { useState } from 'react';
import {
  ATHLETIC_PLAN,
  BY_DATE,
  PlanDay,
  RACE_DATE,
  START_DATE,
  RACE_ISO,
  TYPES,
  GUN,
  pad,
  ISO,
  parseISO,
  sod,
  dayDiff,
  suppListFor,
} from '../data/athleticPlan';
import { Icon } from './SvgIcons';
import { playAthleticBeep, triggerVibrate } from '../utils/sound';

interface TodayAthleticViewProps {
  currentDate: Date;
  isCustomPreview: boolean;
  previewIso: string | null;
  doneMap: Record<string, number>;
  suppMap: Record<string, Record<string, number>>;
  notesMap: Record<string, string>;
  onToggleDone: (iso: string) => void;
  onToggleSupp: (iso: string, suppId: string) => void;
  onSaveNote: (iso: string, note: string) => void;
  onLaunchTimer?: (pd: PlanDay) => void;
  tickerText: string;
}

export function TodayAthleticView({
  currentDate,
  isCustomPreview,
  previewIso,
  doneMap,
  suppMap,
  notesMap,
  onToggleDone,
  onToggleSupp,
  onSaveNote,
  onLaunchTimer,
  tickerText,
}: TodayAthleticViewProps) {
  const [showSavedFlag, setShowSavedFlag] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);

  const iso = ISO(currentDate);
  const idx = BY_DATE[iso];
  const pd = idx !== undefined ? ATHLETIC_PLAN[idx] : null;
  const isWorkoutDone = Boolean(doneMap[iso]);

  // Overall workout stats
  const wDone = ATHLETIC_PLAN.filter((p) => p.type !== 'rest' && doneMap[p.d]).length;
  const wTot = ATHLETIC_PLAN.filter((p) => p.type !== 'rest').length;
  const gDone = ATHLETIC_PLAN.filter((p) => doneMap[p.d]).length;
  const totalKmRun = ATHLETIC_PLAN.filter((p) => p.kn && doneMap[p.d]).reduce((acc, p) => acc + (p.kn || 0), 0);

  // Determine mode
  let mode: 'pre' | 'in' | 'race' | 'post' = 'in';
  if (iso === RACE_ISO) {
    mode = 'race';
  } else if (currentDate < RACE_DATE) {
    mode = currentDate < START_DATE ? 'pre' : 'in';
  } else {
    mode = 'post';
  }

  // Build daily flow items
  const flowItems = (() => {
    const f: { ph: string; ic: string; t: string; d: string }[] = [];
    const push = (ph: string, ic: string, t: string, d: string) => f.push({ ph, ic, t, d });

    if (mode === 'race') {
      push('−2.5 SA', 'sun', 'Yarış kahvaltısı', '2 dilim beyaz ekmek + bal/reçel · 1 muz · az kahve/su. Denenmemiş hiçbir şey yok.');
      push('GÜN BOYU', 'drop', 'Hidrasyon', 'Su + elektrolit; fazla yükleme yok.');
      push('YARIŞ', 'flag', 'LEFKOŞA 10K', '0–3 km 5\'05" → 4–7 km Dereboyu 4\'45" → 8–10 km finiş.');
      push('SONRASI', 'pill', 'Toparlanma', 'Proteinli öğün + Kreatin 3–5 g; elektrolitleri yerine koy.');
      push('AKŞAM', 'moon', 'Magnezyum + Çinko', 'Kramp riskini azaltır, uykuya destek.');
    } else {
      push('SABAH', 'sun', 'NAC 600 mg + Omega-3 ×2', 'NAC aç karnına / öğün arası · Omega-3 öğünle.');
      push('GÜN BOYU', 'drop', '2.5–3 L su', 'Terleme sonrası: maden suyu veya tuzlu limonlu su.');
      if (pd && pd.type !== 'rest') {
        push('−2 SA', 'clock', 'Hafif karbonhidrat', 'Muz, fıstık ezmeli 1 dilim ekmek veya küçük kase yulaf. Mideyi doldurma.');
        push('KOŞU', pd.type === 'race' ? 'flag' : 'bolt', pd.t, `${pd.loc} · ${pd.km}`);
        push('+45 DK', 'pill', 'Toparlanma penceresi', 'Kefir + muz, proteinli süt veya 2 yumurtalı omlet + tam buğday ekmek. Kreatin 3–5 g · Berberin 500 mg (öğünden 15 dk önce).');
      } else {
        push('KOŞU', 'moon', pd ? pd.t : 'Dinlenme', pd ? pd.desc : 'Bugün plan aralığında değil.');
        push('TOPARLANMA', 'clock', '48–60 saat kuralı', 'Dinlenme günleri antrenmanın boşa gitmesini engeller.');
      }
      push('AKŞAM', 'pill', 'Çinko 25 mg + D3·K2', 'Çinko yemekten sonra · D3+K2 yağlı öğünle (haftada 3–4 gün).');
      if (pd) {
        const dayOfWeek = parseISO(pd.d).getDay();
        if (dayOfWeek === 2 || dayOfWeek === 4) {
          push('AKŞAM +', 'bolt', 'Foam roller 5–10 dk', 'Baldır, aşil ve ön kaval — masaj topu ile.');
        }
      }
      push('YATMADAN 45 DK', 'moon', 'Magnezyum 200–400 mg', 'Sinir sistemini yatıştırır, derin uykuyu destekler. Hedef: 7.5–8 saat.');
    }
    return f;
  })();

  const suppList = suppListFor(pd);
  const logSupp = suppMap[iso] || {};
  const completedSuppCount = suppList.filter((it) => logSupp[it.id]).length;

  const handleDoneClick = () => {
    const nextState = !isWorkoutDone;
    if (nextState) {
      playAthleticBeep('success');
      triggerVibrate([60, 40, 60]);
      setIsSweeping(true);
      setTimeout(() => setIsSweeping(false), 800);
    } else {
      triggerVibrate(30);
    }
    onToggleDone(iso);
  };

  const handleNoteChange = (val: string) => {
    onSaveNote(iso, val);
    setShowSavedFlag(true);
    setTimeout(() => setShowSavedFlag(false), 1500);
  };

  return (
    <section className="view on">
      {/* 1. HERO SECTION */}
      <div className="hero">
        {mode === 'pre' && (
          <>
            <div className="lbl">PROGRAM BAŞLAMASINA</div>
            <div className="count">
              <span className="dnum">
                D-<b>{dayDiff(currentDate, START_DATE)}</b>
              </span>
            </div>
            <div className="race-line">İlk antrenman: 2 Eylül Çar · Metehan Dönüşlü</div>
            <div className="ticker">{tickerText}</div>
            <div className="goal-strip">
              <span>
                HEDEF <b>48:00–49:30</b>
              </span>
              <span>
                PACE <b>4'48"–4'57" /KM</b>
              </span>
            </div>
          </>
        )}

        {mode === 'race' && (
          <>
            <div className="lbl">LEFKOŞA MARATONU · 10K</div>
            <div className="count">
              <span className="dnum" style={{ fontSize: 'clamp(58px,17vw,86px)' }}>
                <b>BUGÜN</b>
              </span>
            </div>
            <div className="race-line">11 Ekim 2026 · Pazar — Hedef: 48:xx–49:xx</div>
            <div className="ticker">START SİNYALİNİ BEKLE — PACE PLANINA GÜVEN</div>
            <div className="goal-strip">
              <span>
                HEDEF <b>48:00–49:30</b>
              </span>
              <span>
                PACE <b>4'48"–4'57" /KM</b>
              </span>
            </div>
          </>
        )}

        {mode === 'post' && (
          <>
            <div className="lbl">PROGRAM TAMAMLANDI</div>
            <div className="count">
              <span className="dnum" style={{ fontSize: 'clamp(58px,17vw,86px)' }}>
                <b>TEBRİKLER</b>
              </span>
            </div>
            <div className="race-line">11 Ekim 2026 · Lefkoşa Maratonu 10K</div>
            <div className="ticker">
              {wDone}/{wTot} AKTİVİTE · {totalKmRun.toFixed(1)} KM KOŞULDU
            </div>
          </>
        )}

        {mode === 'in' && (
          <>
            <div className="lbl">YARIŞA KALAN</div>
            <div className="count">
              <span className="dnum">
                D-<b>{dayDiff(currentDate, RACE_DATE)}</b>
              </span>
            </div>
            <div className="race-line">11 Ekim 2026 · Pazar — Lefkoşa Maratonu 10K</div>
            <div className="ticker">{tickerText}</div>
            <div className="goal-strip">
              <span>
                HEDEF <b>48:00–49:30</b>
              </span>
              <span>
                PACE <b>4'48"–4'57" /KM</b>
              </span>
            </div>
          </>
        )}
      </div>

      <div className="trackline"></div>

      {/* 2. PARKUR İLERLEMESİ */}
      <div className="prog">
        <div className="prog-head">
          <span className="lbl">Parkur İlerlemesi</span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--dim)' }}>
            {gDone}/40 GÜN · {wDone}/{wTot} AKTİVİTE
          </span>
        </div>
        <div className="prog-bar">
          {ATHLETIC_PLAN.map((p) => {
            const isDone = Boolean(doneMap[p.d]);
            const isToday = p.d === iso;
            const isPast = parseISO(p.d) < sod(currentDate);

            let cls = '';
            if (isToday) cls = 'tdy';
            else if (isDone) cls = p.type === 'rest' ? 'dr' : 'dw';
            else if (isPast) cls = 'miss';

            return <i key={p.d} className={cls} title={`${p.d}: ${p.t}`} />;
          })}
        </div>
      </div>

      {isCustomPreview && (
        <div className="prev-banner">
          GÖRÜNTÜLEME TARİHİ: {previewIso} (test modu) — hatırlatıcılar gerçek saate göre çalışır.
        </div>
      )}

      {/* 3. BUGÜN KARTI */}
      {pd ? (
        <div className={`day-card ${pd.type === 'race' ? 'racec' : ''}`} id="todayCard">
          <div className={`dc-sweep ${isSweeping ? 'go' : ''}`} id="sweep"></div>
          <div className="dc-head">
            <span className="lbl">
              GÜN {pad(idx + 1)}/40 · HAFTA {pd.w} · {GUN[parseISO(pd.d).getDay()].toUpperCase()}
            </span>
            <span className={`badge ${TYPES[pd.type][1]}`}>{TYPES[pd.type][0]}</span>
          </div>

          <div className="dc-title">{pd.t}</div>

          <div className="dc-loc">
            <Icon name={pd.type === 'race' ? 'flag' : 'route'} />
            <span>
              {pd.loc || '—'}
              {pd.km ? ` · ${pd.km}` : ''}
            </span>
          </div>

          {pd.desc && <div className="dc-desc">{pd.desc}</div>}

          {/* Segmentler */}
          {pd.seg && pd.seg.length > 0 && (
            <div className="seg">
              {pd.seg.map((s, i) => (
                <div key={i} className="seg-row">
                  <span className="seg-n">{pad(i + 1)}</span>
                  <span>
                    <span className="seg-l">{s[0]}</span>
                    <div className="seg-t">{s[1]}</div>
                  </span>
                  <span className={`seg-p ${s[2] === '—' ? 'dim' : ''}`}>{s[2]}</span>
                </div>
              ))}
            </div>
          )}

          {/* Etiketler */}
          {pd.tags && pd.tags.length > 0 && (
            <div className="dc-tags">
              {pd.tags.map((x, i) => (
                <span key={i} className="tag">
                  {x[0]}: {x[1]}
                </span>
              ))}
            </div>
          )}

          {/* Interval / HIIT Sayacı Başlat Butonu */}
          {(pd.type === 'quality' || pd.t.includes('HIIT') || pd.t.includes('Interval')) && onLaunchTimer && (
            <div className="px-4 pb-3">
              <button
                onClick={() => onLaunchTimer(pd)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500/15 border border-orange-500/40 py-2.5 text-xs font-mono text-orange-400 hover:bg-orange-500/25 transition active:scale-98 cursor-pointer"
              >
                <Icon name="timer" style={{ width: '16px', height: '16px' }} />
                <span>İNTERVAL SESLİ SAYACINI AÇ</span>
              </button>
            </div>
          )}

          {/* Ana Buton */}
          <button
            id="doneBtn"
            onClick={handleDoneClick}
            className={`btn-main ${isWorkoutDone ? 'on' : ''}`}
          >
            {isWorkoutDone ? (
              <>
                <svg viewBox="0 0 24 24">
                  <path d="M4.5 12.5l5 5L19.5 6.5" />
                </svg>
                <span>{pd.type === 'race' ? 'YARIŞ TAMAMLANDI' : 'TAMAMLANDI'}</span>
              </>
            ) : (
              <span>
                {pd.type === 'race'
                  ? 'YARIŞI TAMAMLA'
                  : pd.type !== 'rest'
                  ? 'ANTRENMANI TAMAMLA'
                  : 'GÜNÜ TAMAMLA'}
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="day-card">
          <div className="dc-head">
            <span className="lbl">PLAN</span>
            <span className="badge b-easy">BİLGİ</span>
          </div>
          <div className="dc-title">Program Seçildi</div>
          <div className="dc-desc">Seçilen tarih 40 günlük program aralığında bulunamadı.</div>
        </div>
      )}

      {/* 4. GÜNLÜK AKIŞ */}
      <div className="flow">
        <div className="sec-head">
          <span className="lbl">Günlük Akış</span>
          <span className="mono">SAAT SIRASIYLA</span>
        </div>
        {flowItems.map((f, i) => (
          <div key={i} className="f-row">
            <span className="f-phase">{f.ph}</span>
            <span className="f-ic">
              <Icon name={f.ic} />
            </span>
            <span>
              <div className="f-t">{f.t}</div>
              <div className="f-d">{f.d}</div>
            </span>
          </div>
        ))}
      </div>

      {/* 5. BUGÜNÜN TAKVİYELERİ */}
      <div className="flow" style={{ marginTop: '26px' }}>
        <div className="sec-head">
          <span className="lbl">Bugünün Takviyeleri</span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--acc)' }}>
            {completedSuppCount}/{suppList.length}
          </span>
        </div>

        <div className="chk" id="chkList">
          {suppList.map((it) => {
            const isChecked = Boolean(logSupp[it.id]);
            return (
              <div
                key={it.id}
                onClick={() => {
                  triggerVibrate(15);
                  onToggleSupp(iso, it.id);
                }}
                className={`chk-row ${isChecked ? 'on' : ''}`}
                data-supp={it.id}
              >
                <span className="chk-box">
                  <Icon name="check" />
                </span>
                <span className="chk-mid">
                  <span className="chk-name">{it.n}</span>
                  <div className="chk-dose">
                    {it.dose} · {it.time}
                  </div>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. GÜN NOTU */}
      <div className="flow">
        <div className="sec-head">
          <span className="lbl">Gün Notu</span>
        </div>
        <textarea
          id="noteTa"
          className="note-ta"
          placeholder="Nabız, hava, his..."
          value={notesMap[iso] || ''}
          onChange={(e) => handleNoteChange(e.target.value)}
        />
        <span className={`saved-flag ${showSavedFlag ? 'show' : ''}`} id="savedFlag">
          KAYDEDİLDİ
        </span>
      </div>
    </section>
  );
}
