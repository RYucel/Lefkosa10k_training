import { NUTR, GUIDE } from '../data/athleticPlan';
import { Icon } from './SvgIcons';

export function GuideAthleticView() {
  return (
    <section className="view on">
      <div className="view-h">
        <div className="lbl">REHBER</div>
        <h1>Beslenme &amp; Toparlanma</h1>
      </div>

      {/* Nutrition Protocols */}
      <div className="space-y-3.5">
        {NUTR.map((n, idx) => (
          <div key={idx} className={`g-card ${n.warn ? 'crit' : ''}`}>
            <div className="g-head">
              <span className="g-tag">{n.tag}</span>
              {n.warn && <span className="badge b-crit">KRİTİK</span>}
            </div>
            <div className="g-t">{n.t}</div>
            <div className="g-body">
              {n.items.map((it, i) => (
                <div key={i} className="n-item">
                  {it}
                </div>
              ))}
              {n.rules.map((r, i) => (
                <div key={i} className="n-rule">
                  <Icon name="bolt" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recovery & Sleep Section */}
      <div className="g-sub">
        <div className="lbl" style={{ marginBottom: '2px' }}>
          DİNLENME · UYKU · EKLEM
        </div>
      </div>

      <div className="space-y-3.5 mt-2">
        {GUIDE.map((g, idx) => (
          <div key={idx} className="g-card">
            <div className="g-head">
              <span className="g-tag" style={{ color: 'var(--dim)' }}>
                {g.d}
              </span>
              <Icon name={g.ic} style={{ color: 'var(--acc)' }} />
            </div>
            <div className="g-t">{g.t}</div>
            <div className="g-body">
              <div className="n-rule">
                <Icon name="bolt" />
                <span>{g.why}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
