import { useState } from 'react';
import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const TIERS = [
  {
    id: 'scan',
    name: 'Discovery Scan',
    sub: 'Free · 30 min',
    headline: 'Find the leverage.',
    detail: "A structured call. We map your operations, identify the 3 highest-impact automation opportunities, and tell you whether AI is even the right tool. No pitch.",
    bullets: ['30-minute working session', 'Top 3 automation opportunities', 'Honest go/no-go recommendation', 'Written brief within 48h'],
    cta: 'Book the call',
  },
  {
    id: 'build',
    name: 'Custom Build',
    sub: 'SMB · 3–14 days',
    headline: 'Ship the automation.',
    detail: "A working AI system tailored to one or two of your manual workflows. Scheduling, quoting, follow-ups, inventory, support — whatever is bleeding the most time.",
    bullets: ['Built around your actual tools', 'Live in days, not quarters', 'Code and prompts you own', 'Optional support retainer'],
    cta: 'See examples',
  },
  {
    id: 'brain',
    name: 'Connected Agents',
    sub: 'Mid-market · 4–8 wks',
    headline: 'Wire the whole operation.',
    detail: 'For 50–500 person firms with multiple processes that need to talk to each other. Diagnostic, architecture, and a connected set of agents that compound.',
    bullets: ['Multi-system integration', 'Agentic pipelines + RAG', 'Stakeholder readout', 'Ongoing strategic support'],
    cta: 'Request scan',
  },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);
  const [ref, inView] = useInView();

  return (
    <section id="services" className="services-section" style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="07" label="Ways to work with us" />
      <h2 className="display services-title" style={{
        fontSize: 60,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 720,
        lineHeight: 1.05,
      }}>
        Three ways in. Pick the one that fits.
      </h2>

      <div
        ref={ref}
        className={`services-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
          marginTop: 60,
        }}
      >
        {TIERS.map((t) => {
          const isHover = hovered === t.id;
          return (
            <div
              key={t.id}
              className="card-hover"
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHover ? '#101010' : 'var(--surface)',
                padding: 32,
                transition: 'background 0.2s',
                cursor: 'pointer',
                minHeight: 380,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {t.name}
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 24 }}>
                {t.sub}
              </div>
              <div style={{
                fontSize: 26,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                marginBottom: 16,
                lineHeight: 1.2,
              }}>
                {t.headline}
              </div>
              <div style={{
                fontSize: 14,
                color: 'var(--muted)',
                lineHeight: 1.6,
                marginBottom: 20,
                maxHeight: isHover ? 200 : 0,
                opacity: isHover ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}>
                {t.detail}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 24, flex: 1 }}>
                {t.bullets.map((b) => (
                  <li key={b} style={{
                    fontSize: 13,
                    color: 'var(--ink)',
                    padding: '6px 0',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>→</span>
                    <span style={{ opacity: 0.85 }}>{b}</span>
                  </li>
                ))}
              </ul>
              <button style={{
                padding: '12px 18px',
                background: 'transparent',
                border: `1px solid ${isHover ? 'var(--accent)' : 'var(--border)'}`,
                color: isHover ? 'var(--accent)' : 'var(--ink)',
                fontSize: 12,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textAlign: 'left',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}>
                {t.cta} →
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 32, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
        Pricing depends on scope and tooling. We'll quote you on the discovery call — no commitment, no
        upsell theatre.
      </p>
    </section>
  );
}
