import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const CASES = [
  {
    tag: 'Plumbing & heating \u00b7 Bristol',
    img: '/images/plumber.jpg',
    before: 'After-hours calls slipped to voicemail until morning. Roughly \u00a324,000 a year in lost emergency callouts.',
    after: 'A voicemail-to-dispatch agent triages, texts the on-call engineer and confirms the slot.',
    metric: '14 sec',
    metricLabel: 'avg dispatch',
  },
  {
    tag: 'Restaurant \u00b7 Leeds',
    img: '/images/restaurant.jpg',
    before: 'Weekly orders done by hand on a Sunday night. Persistent overstock on perishables.',
    after: 'A POS-aware ordering agent drafts the weekly order. The chef approves with a single tap.',
    metric: '\u221224%',
    metricLabel: 'food waste',
  },
  {
    tag: 'Salon \u00b7 Manchester',
    img: '/images/salon-interior.jpg',
    before: 'Lapsed clients drifted away. The owner felt awkward "chasing" them.',
    after: "A daily rebooking agent sends personalised messages in the owner's voice.",
    metric: '7\u00d7',
    metricLabel: 'rebookings/wk',
  },
];

export default function CaseStudies() {
  const [ref, inView] = useInView();

  return (
    <section id="customers" className="cases-section" style={{
      padding: '120px 56px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="05" label="Customers, quietly running" />
      <h2 className="display cases-title" style={{
        fontSize: 60,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 860,
        lineHeight: 1.05,
      }}>
        Quietly running in the background of real British businesses.
      </h2>
      <div
        ref={ref}
        className={`cases-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          marginTop: 60,
        }}
      >
        {CASES.map((c, i) => (
          <div key={i} className="card-hover stagger" style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: 28,
          }}>
            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              {c.tag}
            </div>
            <div className="img-zoom" style={{ height: 140, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={c.img} alt={c.tag} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ marginTop: 20 }}>
              <div className="mono" style={{
                fontSize: 10,
                color: 'var(--muted)',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}>
                BEFORE
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 16 }}>
                {c.before}
              </div>
              <div className="mono" style={{
                fontSize: 10,
                color: 'var(--accent)',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}>
                AFTER
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>{c.after}</div>
            </div>
            <div style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span className="display" style={{
                fontSize: 44,
                color: 'var(--accent)',
                letterSpacing: '-0.02em',
              }}>
                {c.metric}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                {c.metricLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
