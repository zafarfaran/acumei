import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const STATS = [
  { n: '5.5M', l: 'private-sector businesses in the UK.', s: 'BEIS, 2024' },
  { n: '<22%', l: 'have meaningfully adopted AI.', s: 'DSIT AI Activity Survey' },
  { n: '£119bn', l: 'projected UK AI economy by 2035.', s: 'Microsoft / Public First' },
  { n: '49%', l: 'of SMEs say "we don\'t know where to start".', s: 'British Chambers of Commerce' },
];

export default function Stats() {
  const [ref, inView] = useInView();

  return (
    <section className="stats-section" style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="04" label="Where British SMEs stand" />
      <h2 className="display stats-title" style={{
        fontSize: 68,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 1000,
        lineHeight: 1.05,
      }}>
        The hard part isn't cost — it's{' '}
        <span className="display-ital" style={{ color: 'var(--accent)' }}>direction.</span>
      </h2>
      <div
        ref={ref}
        className={`stats-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          marginTop: 80,
        }}
      >
        {STATS.map((s, i) => (
          <div key={i} className="stagger" style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
            <div className="display" style={{
              fontSize: 80,
              lineHeight: 1,
              color: 'var(--ink)',
              letterSpacing: '-0.04em',
            }}>
              {s.n}
            </div>
            <div style={{ fontSize: 16, color: 'var(--ink)', marginTop: 16, lineHeight: 1.4 }}>{s.l}</div>
            <div className="mono" style={{
              fontSize: 11,
              color: 'var(--muted)',
              marginTop: 12,
              letterSpacing: '0.05em',
            }}>
              {s.s}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
