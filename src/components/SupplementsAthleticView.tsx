import { SUPPS } from '../data/athleticPlan';
import { Icon } from './SvgIcons';

interface SupplementsAthleticViewProps {
  suppMap: Record<string, Record<string, number>>;
}

export function SupplementsAthleticView({ suppMap }: SupplementsAthleticViewProps) {
  // Calculate 7-day adherence
  const adherencePct = (() => {
    let hit = 0;
    let tot = 0;
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const log = suppMap[iso] || {};
      SUPPS.forEach((s) => {
        tot++;
        if (log[s.id]) hit++;
      });
    }
    return tot ? Math.round((hit / tot) * 100) : 0;
  })();

  return (
    <section className="view on">
      <div className="view-h">
        <div className="lbl">PROTOKOL</div>
        <h1>Takviye Planı</h1>
      </div>

      {/* 7-Day Adherence */}
      <div className="adher">
        <div className="adher-top">
          <span className="lbl">Son 7 gün uyum</span>
          <span className="adher-pct">%{adherencePct}</span>
        </div>
        <div className="adher-bar">
          <i style={{ width: `${adherencePct}%` }}></i>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3 mt-4">
        {SUPPS.map((s) => (
          <div key={s.id} className="s-card">
            <div className="s-ic">
              <Icon name="pill" />
            </div>
            <div>
              <div className="s-name">{s.n}</div>
              <div className="s-dose">{s.dose}</div>
              <div className="s-time">
                <Icon
                  name="clock"
                  style={{
                    width: '12px',
                    height: '12px',
                    display: 'inline-block',
                    verticalAlign: '-1px',
                    marginRight: '5px',
                  }}
                />
                {s.time}
              </div>
              <div className="s-why">{s.why}</div>
              {s.warn && (
                <div className="s-warn">
                  <Icon name="warn" />
                  <span>{s.warn}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
