import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const STEPS = [
  { n: '01', t: 'Talk', d: 'A 30-minute discovery call. Show us the workflow that hurts. We tell you whether AI can fix it — honestly.', when: 'Day 1' },
  { n: '02', t: 'Map', d: "Within 48 hours, a written brief: top three opportunities, rough scope, what we'd build first.", when: 'Day 2' },
  { n: '03', t: 'Build', d: 'We write the code. Real integrations with your actual tools. You review as it comes together.', when: 'Days 3–10' },
  { n: '04', t: 'Hand over', d: 'Live system. Your code, your prompts, your accounts. Optional retainer if you want us on call.', when: 'Day 14' },
];

export default function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section id="how" className="hiw-section" style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="01" label="How we work" />
      <h2 className="display hiw-title" style={{
        fontSize: 68,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 940,
        lineHeight: 1.05,
      }}>
        From &ldquo;we have a problem&rdquo; to a quieter business — in a fortnight.
      </h2>
      <div
        ref={ref}
        className={`hiw-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          marginTop: 80,
        }}
      >
        {STEPS.map((s) => (
          <div key={s.n} className="stagger" style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
            <div className="mono" style={{
              fontSize: 12,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}>
              {s.when}
            </div>
            <div className="display" style={{
              fontSize: 56,
              color: 'var(--accent)',
              marginBottom: 8,
              letterSpacing: '-0.03em',
            }}>
              {s.n}
            </div>
            <div style={{ fontSize: 22, marginBottom: 12, fontWeight: 500 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
