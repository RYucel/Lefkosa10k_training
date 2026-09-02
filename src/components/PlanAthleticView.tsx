import { useState, MouseEvent } from 'react';
import {
  ATHLETIC_PLAN,
  WEEKS,
  TYPES,
  GUN,
  pad,
  ISO,
  parseISO,
} from '../data/athleticPlan';
import { Icon } from './SvgIcons';
import { triggerVibrate } from '../utils/sound';

interface PlanAthleticViewProps {
  currentDate: Date;
  doneMap: Record<string, number>;
  onToggleDone: (iso: string) => void;
  onSelectDate: (iso: string) => void;
}

export function PlanAthleticView({
  currentDate,
  doneMap,
  onToggleDone,
  onSelectDate,
}: PlanAthleticViewProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const todayIso = ISO(currentDate);

  const toggleOpen = (iso: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenItems((prev) => ({ ...prev, [iso]: !prev[iso] }));
  };

  const totalActivities = ATHLETIC_PLAN.filter((p) => p.type !== 'rest').length;
  const totalKm = ATHLETIC_PLAN.filter((p) => p.kn).reduce((a, p) => a + (p.kn || 0), 0);

  return (
    <section className="view on">
      <div className="view-h">
        <div className="lbl">TAKVİM</div>
        <h1>40 Günlük Parkur</h1>
      </div>

      {/* Summary Box */}
      <div className="plan-sum">
        40 GÜN · <b>{totalActivities} AKTİVİTE</b> · ≈<b>{totalKm.toFixed(0)} KM</b> · HEDEF 48:00–49:30
      </div>

      {/* 6 Weeks Timeline */}
      {[1, 2, 3, 4, 5, 6].map((w) => {
        const days = ATHLETIC_PLAN.filter((p) => p.w === w);
        const weekKm = days.filter((p) => p.kn).reduce((a, p) => a + (p.kn || 0), 0);
        const isCurrentWeek = days.some((p) => p.d === todayIso);

        return (
          <div key={w} className="week">
            <div className="week-head">
              <div className="week-title">
                HAFTA {w} <span>— {WEEKS[w].theme}</span>
              </div>
              <div className="week-right">
                {isCurrentWeek && <span className="here">ŞİMDİ BURADA</span>}
                <span className="week-km">{weekKm > 0 ? `KOŞU ≈${weekKm.toFixed(1)} KM` : ''}</span>
              </div>
            </div>

            <div className="p-list">
              {days.map((p) => {
                const d = parseISO(p.d);
                const iso = p.d;
                const isDone = Boolean(doneMap[iso]);
                const isToday = iso === todayIso;
                const [badgeTitle, badgeClass] = TYPES[p.type];
                const isOpen = Boolean(openItems[iso]);

                let dotClass = '';
                if (isDone) {
                  dotClass = p.type === 'rest' ? 'done-r' : 'done-w';
                } else if (isToday) {
                  dotClass = 'today';
                }

                return (
                  <div
                    key={iso}
                    className={`p-item ${isToday ? 'today' : ''} ${isDone ? 'pdone' : ''} ${
                      isOpen ? 'open' : ''
                    }`}
                  >
                    <span className={`dot ${dotClass}`}></span>

                    <div className="p-date">
                      <span>{GUN[d.getDay()].toUpperCase()}</span>
                      <b>{pad(d.getDate())}</b>
                    </div>

                    <div>
                      <button
                        className="p-main"
                        onClick={() => toggleOpen(iso)}
                      >
                        <span className="p-top">
                          <span className="p-t">{p.t}</span>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '8.5px' }}>
                            {badgeTitle}
                          </span>
                        </span>
                        <div className="p-meta">
                          {p.loc || p.desc}
                          {p.kn ? ` · ${p.kn} km` : ''}
                        </div>
                      </button>

                      {/* Accordion Detail */}
                      {isOpen && (
                        <div className="p-det">
                          {p.desc && p.loc && <div className="dc-desc">{p.desc}</div>}

                          {p.seg && p.seg.length > 0 && (
                            <div className="seg">
                              {p.seg.map((s, i) => (
                                <div key={i} className="seg-row">
                                  <span className="seg-n">{pad(i + 1)}</span>
                                  <span>
                                    <span className="seg-l">{s[0]}</span>
                                    <div className="seg-t">{s[1]}</div>
                                  </span>
                                  <span className={`seg-p ${s[2] === '—' ? 'dim' : ''}`}>
                                    {s[2]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-2">
                            <div
                              className={`chk-row ${isDone ? 'on' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerVibrate(20);
                                onToggleDone(iso);
                              }}
                            >
                              <span className="chk-box">
                                <Icon name="check" />
                              </span>
                              <span className="chk-name">
                                {isDone ? 'Tamamlandı olarak işaretlendi' : 'Tamamlandı olarak işaretle'}
                              </span>
                            </div>

                            <button
                              onClick={() => onSelectDate(iso)}
                              className="text-[11px] font-mono text-orange-400 hover:text-orange-300 underline ml-auto cursor-pointer"
                            >
                              Bugün Kartında Aç →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      className="p-x"
                      onClick={(e) => toggleOpen(iso, e)}
                    >
                      {isOpen ? '–' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
