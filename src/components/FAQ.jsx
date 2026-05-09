import { useState } from 'react';
import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const ITEMS = [
  {
    q: 'What is the AI Brain, exactly?',
    a: 'An assistant that sits across your existing tools and handles the boring stuff \u2014 missed calls, follow-ups, scheduling, stock. You stay in charge.',
  },
  {
    q: 'How quickly can something go live?',
    a: 'Single workflow: 3\u201314 days. Multi-system brain: 4\u20138 weeks.',
  },
  {
    q: 'Will this work with our existing tools?',
    a: 'Yes. We plug into what you already run \u2014 diary, accounts, phone, CRM, inbox. Nothing to rip out.',
  },
  {
    q: 'Do we own what you build?',
    a: 'Completely. Code, prompts, credentials. Walk away tomorrow and it keeps running.',
  },
  {
    q: 'Will this replace our staff?',
    a: 'No. We automate the work nobody wants \u2014 late-night triage, data entry, chasing. Your people do the work they were hired for.',
  },
  {
    q: 'How do you handle data and GDPR?',
    a: 'Data stays in your accounts. We sign DPAs, process inside UK/EU, and build audit logs into every system.',
  },
  {
    q: 'What happens if something breaks?',
    a: 'Every system logs every action with a human-escalation path. On a retainer, we fix it before you notice.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [ref, inView] = useInView();

  return (
    <section id="faq" className="faq-section" style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="08" label="FAQ" />
      <div
        ref={ref}
        className={`faq-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 80,
          alignItems: 'start',
        }}
      >
        <h2 className="display faq-title" style={{
          fontSize: 60,
          margin: 0,
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}>
          Things people ask before they book.
        </h2>
        <div>
          {ITEMS.map((it, i) => (
            <div key={i} style={{
              borderTop: '1px solid var(--border)',
              ...(i === ITEMS.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}),
            }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '24px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'inherit',
                  color: 'var(--ink)',
                  fontSize: 19,
                }}
              >
                <span>{it.q}</span>
                <span style={{
                  color: 'var(--accent)',
                  fontSize: 24,
                  transition: 'transform 0.3s',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                }}>
                  +
                </span>
              </button>
              <div style={{
                maxHeight: open === i ? 240 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
                fontSize: 15,
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
              }}>
                <div style={{ paddingBottom: 24, maxWidth: 680 }}>{it.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
