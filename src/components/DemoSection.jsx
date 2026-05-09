import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';
import AIDemo from './AIDemo';

export default function DemoSection() {
  const [ref, inView] = useInView();

  return (
    <section id="demo" className="demo-section" style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="02" label="A morning, handled" />
      <div
        ref={ref}
        className={`demo-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        <div>
          <h2 className="display demo-title" style={{
            fontSize: 60,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
          }}>
            What an <span className="display-ital" style={{ color: 'var(--accent)' }}>AI Brain</span> handles before you finish your coffee.
          </h2>
          <p style={{
            fontSize: 17,
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
            marginTop: 24,
            maxWidth: 480,
          }}>
            A real morning, condensed. You wake up to a tidy list of things to approve — not a hundred things to chase.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 32, fontSize: 14, color: 'var(--ink)' }}>
            {[
              'You stay in charge — nothing risky goes out without your nod',
              'Tricky calls always come to a human, never to a dead end',
              'You can see and undo anything the Brain did, any time',
            ].map((x) => (
              <li key={x} style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderTop: '1px solid var(--border)',
              }}>
                <span style={{ color: 'var(--accent)' }}>→</span>{x}
              </li>
            ))}
          </ul>
        </div>
        <AIDemo />
      </div>
    </section>
  );
}
