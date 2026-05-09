import { useState, useEffect, useRef, useCallback } from 'react';
import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const INDUSTRIES = [
  {
    id: 'property',
    name: 'Property',
    stat: '2.4M',
    statLabel: 'rental properties in the UK',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="14" width="24" height="14" rx="1" />
        <path d="M16 4 L28 14 H4 Z" />
        <rect x="13" y="20" width="6" height="8" />
      </svg>
    ),
    story: {
      trigger: 'A tenant calls at 11:42 PM about a broken boiler. You\u2019re asleep.',
      steps: [
        'Listens to the voicemail and understands it\u2019s urgent \u2014 no hot water, flat 4B.',
        'Finds your preferred contractor and texts them the job details.',
        'Replies to the tenant: \u201cSorted \u2014 someone will call you by 8am.\u201d',
      ],
      outcome: 'Fixed before you woke up. You never had to pick up the phone.',
    },
  },
  {
    id: 'trades',
    name: 'Trades',
    stat: '\u00a324K',
    statLabel: 'avg lost to missed callouts/yr',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 6 L10 26 M22 6 L22 26" />
        <path d="M6 12 H26 M6 20 H26" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    ),
    story: {
      trigger: 'Someone leaves a voicemail at 4:47 AM \u2014 their kitchen is flooding.',
      steps: [
        'Picks up the voicemail and recognises it\u2019s an emergency.',
        'Texts your on-call engineer with the address and details.',
        'Holds an 8am diary slot \u2014 confirmed automatically when the engineer replies.',
      ],
      outcome: 'Dispatched in 14 seconds. Your phone never rang.',
    },
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    stat: '\u221224%',
    statLabel: 'food waste reduction',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 28 H24 M6 22 H26" />
        <path d="M10 22 C10 14 8 8 16 8 C24 8 22 14 22 22" />
        <line x1="16" y1="4" x2="16" y2="8" />
      </svg>
    ),
    story: {
      trigger: 'It\u2019s Sunday evening. The weekly stock order needs doing.',
      steps: [
        'Looks at what you\u2019ve been selling and compares it to what\u2019s left in stock.',
        'Spots that you\u2019re over-ordering basil and running low on house red.',
        'Writes up the order with adjusted amounts \u2014 sends it to the chef to approve.',
      ],
      outcome: '\u00a3270 in food waste avoided. The chef just had to tap \u201cconfirm.\u201d',
    },
  },
  {
    id: 'salons',
    name: 'Salons & Clinics',
    stat: '7\u00d7',
    statLabel: 'more rebookings per week',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="12" r="6" />
        <path d="M8 28 C8 22 12 18 16 18 C20 18 24 22 24 28" />
      </svg>
    ),
    story: {
      trigger: '23 of your clients haven\u2019t been back in over 8 weeks.',
      steps: [
        'Spots exactly who\u2019s overdue and which stylist they usually see.',
        'Writes a friendly, personal text for each one \u2014 in your salon\u2019s voice.',
        'Sends them out, but holds back 2 who had complaints \u2014 flags those for you.',
      ],
      outcome: '7 clients rebooked by lunchtime. Nobody on your team lifted a finger.',
    },
  },
  {
    id: 'retail',
    name: 'Retail',
    stat: '\u00a3140',
    statLabel: 'saved per restock cycle',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="8" width="24" height="20" rx="1" />
        <path d="M4 14 H28" />
        <path d="M12 8 V4 H20 V8" />
        <rect x="12" y="18" width="8" height="6" />
      </svg>
    ),
    story: {
      trigger: 'Three of your best sellers are about to run out. You don\u2019t know yet.',
      steps: [
        'Checks your sales data and spots the gap before it becomes a problem.',
        'Finds a better price on one item from a different supplier.',
        'Puts together the purchase order and sends it to you for a quick OK.',
      ],
      outcome: 'Restocked before Tuesday\u2019s rush. \u00a3140 saved on one order.',
    },
  },
  {
    id: 'professional',
    name: 'Professional Services',
    stat: '6 min',
    statLabel: 'from enquiry to onboarded',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="4" width="20" height="26" rx="1" />
        <line x1="10" y1="10" x2="22" y2="10" />
        <line x1="10" y1="15" x2="22" y2="15" />
        <line x1="10" y1="20" x2="18" y2="20" />
      </svg>
    ),
    story: {
      trigger: 'A potential client fills in your website form at 10 PM on a Tuesday.',
      steps: [
        'Sends them an intake form immediately \u2014 they complete it in 6 minutes.',
        'Checks for conflicts, finds the right team, and matches them up.',
        'Drafts an engagement letter and queues it for your partner to review.',
      ],
      outcome: 'Client fully onboarded overnight. First meeting booked for 9am.',
    },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    stat: '90 sec',
    statLabel: 'to fill a cancelled slot',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8 V24 M8 16 H24" />
        <rect x="4" y="4" width="24" height="24" rx="4" />
      </svg>
    ),
    story: {
      trigger: 'A patient cancels their Thursday afternoon appointment.',
      steps: [
        'Checks who\u2019s on the waitlist and picks the best match.',
        'Texts them: \u201cSlot available Thursday 2pm. Reply YES to book.\u201d',
        'They reply in 90 seconds. Slot filled. Everyone else on the list is updated.',
      ],
      outcome: 'No lost revenue. No time spent on the phone. Waitlist managed itself.',
    },
  },
  {
    id: 'logistics',
    name: 'Logistics',
    stat: '67%',
    statLabel: 'on-time despite disruption',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="10" width="18" height="14" rx="1" />
        <path d="M20 14 H26 L30 20 V24 H20 V14Z" />
        <circle cx="10" cy="26" r="2.5" />
        <circle cx="25" cy="26" r="2.5" />
      </svg>
    ),
    story: {
      trigger: 'One of your drivers calls in sick at 5:45 AM. 12 deliveries on that route.',
      steps: [
        'Finds a nearby driver who can take most of the drops.',
        'Reroutes 8 deliveries for efficiency. Reschedules the other 4.',
        'Texts every affected customer with their updated delivery window.',
      ],
      outcome: '8 out of 12 delivered on time. Customers knew before they had to ask.',
    },
  },
  {
    id: 'custom',
    name: 'Custom Tech Solutions',
    stat: '\u221E',
    statLabel: 'if you can describe it, we can build it',
    icon: (
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="24" height="18" rx="2" />
        <path d="M4 18 H28" />
        <line x1="16" y1="22" x2="16" y2="26" />
        <line x1="11" y1="26" x2="21" y2="26" />
        <path d="M10 10 L14 14 L10 18" opacity="0.6" />
        <line x1="16" y1="14" x2="22" y2="14" opacity="0.6" />
      </svg>
    ),
    story: {
      trigger: 'You have an idea for a tool, app, or system \u2014 but no tech team to build it.',
      steps: [
        'We sit down with you and figure out exactly what you need \u2014 no jargon, just outcomes.',
        'Design and build a custom solution from scratch \u2014 AI-powered apps, dashboards, integrations, automations, whatever it takes.',
        'Hand it over fully working, fully yours. We can stay on to maintain it or you take it from here.',
      ],
      outcome: 'Your idea, built and running. Not a template \u2014 something made for you.',
    },
  },
];

const AUTO_CYCLE_MS = 10000;

export default function Industries() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleStep, setVisibleStep] = useState(-1); // -1 = trigger, 0-2 = steps, 3 = outcome
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ref, inView] = useInView();
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const selected = INDUSTRIES[activeIdx];
  const totalSteps = selected.story.steps.length + 2; // trigger + steps + outcome

  // Auto-reveal story steps
  useEffect(() => {
    setVisibleStep(-1);
    let step = -1;
    const interval = setInterval(() => {
      step++;
      if (step >= totalSteps) {
        clearInterval(interval);
        return;
      }
      setVisibleStep(step);
    }, 1200);
    return () => clearInterval(interval);
  }, [activeIdx, totalSteps]);

  // Auto-cycle
  const advance = useCallback(() => {
    setActiveIdx((i) => (i + 1) % INDUSTRIES.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) {
      clearInterval(progressRef.current);
      clearTimeout(timerRef.current);
      return;
    }
    setProgress(0);
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      setProgress(Math.min(1, (Date.now() - startTime) / AUTO_CYCLE_MS));
    }, 50);
    timerRef.current = setTimeout(advance, AUTO_CYCLE_MS);
    return () => { clearTimeout(timerRef.current); clearInterval(progressRef.current); };
  }, [activeIdx, paused, advance]);

  const handleSelect = (idx) => {
    setActiveIdx(idx);
    setProgress(0);
    setPaused(true);
    setTimeout(() => setPaused(false), 15000);
  };

  // Which steps are visible
  const triggerVisible = visibleStep >= 0;
  const stepsVisible = selected.story.steps.map((_, i) => visibleStep >= i + 1);
  const outcomeVisible = visibleStep >= selected.story.steps.length + 1;

  return (
    <section id="industries" className="industries-section" style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', right: -200,
        width: 500, height: 500, borderRadius: '50%',
        background: 'var(--accent)', opacity: 0.04,
        filter: 'blur(100px)', transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />

      <SectionLabel n="02" label="Every kind of business" />

      <h2 className="display industries-title" style={{
        fontSize: 60, margin: 0, letterSpacing: '-0.025em',
        lineHeight: 1.05, maxWidth: 800,
      }}>
        One brain. <span className="display-ital" style={{ color: 'var(--accent)' }}>Every industry.</span>
      </h2>
      <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 20, maxWidth: 500 }}>
        Pick your industry. We'll walk you through a real scenario.
      </p>

      <div
        ref={ref}
        className={`industries-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid', gridTemplateColumns: '260px 1fr',
          gap: 0, marginTop: 48, alignItems: 'stretch',
          border: '1px solid var(--border)', background: 'var(--surface)',
          minHeight: 520,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left tabs */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          {INDUSTRIES.map((ind, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={ind.id}
                onClick={() => handleSelect(idx)}
                style={{
                  padding: '16px 20px',
                  background: isActive ? 'var(--bg)' : 'transparent',
                  border: 'none',
                  borderBottom: idx < INDUSTRIES.length - 1 ? '1px solid var(--border)' : 'none',
                  color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
                  textAlign: 'left', transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: 12,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {isActive && <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  width: `${progress * 100}%`, background: 'var(--accent)',
                  opacity: 0.08, transition: paused ? 'none' : 'width 0.05s linear',
                }} />}
                {isActive && <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  width: 3, background: 'var(--accent)',
                }} />}
                <span style={{ opacity: isActive ? 1 : 0.4, flexShrink: 0, color: isActive ? 'var(--accent)' : 'var(--ink-soft)', transition: 'all 0.2s' }}>
                  {ind.icon}
                </span>
                <span style={{ fontWeight: isActive ? 500 : 400, position: 'relative' }}>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: story panel */}
        <div
          key={activeIdx}
          style={{
            padding: '32px 40px', display: 'flex', flexDirection: 'column',
            animation: 'demoFadeIn 0.5s ease-out', background: 'var(--bg)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase' }}>
              {selected.name}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="display" style={{ fontSize: 36, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {selected.stat}
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', marginTop: 4 }}>
                {selected.statLabel}
              </div>
            </div>
          </div>

          {/* Story timeline */}
          <div style={{ flex: 1, position: 'relative', paddingLeft: 28 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 7, top: 8, bottom: 8, width: 2,
              background: 'var(--border)',
            }} />

            {/* Trigger: "The situation" */}
            <div style={{
              marginBottom: 28, position: 'relative',
              opacity: triggerVisible ? 1 : 0,
              transform: triggerVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s ease-out',
            }}>
              <div style={{
                position: 'absolute', left: -28, top: 3,
                width: 16, height: 16, borderRadius: '50%',
                background: triggerVisible ? 'var(--accent)' : 'var(--border)',
                border: '2px solid var(--bg)', transition: 'background 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
                The situation
              </div>
              <div style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.5 }}>
                {selected.story.trigger}
              </div>
            </div>

            {/* Steps: "The AI Brain..." */}
            {selected.story.steps.map((step, i) => (
              <div key={i} style={{
                marginBottom: 24, position: 'relative',
                opacity: stepsVisible[i] ? 1 : 0,
                transform: stepsVisible[i] ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s ease-out',
              }}>
                <div style={{
                  position: 'absolute', left: -28, top: 3,
                  width: 16, height: 16, borderRadius: '50%',
                  background: stepsVisible[i] ? 'var(--surface)' : 'var(--border)',
                  border: `2px solid ${stepsVisible[i] ? 'var(--accent)' : 'var(--border)'}`,
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: 'var(--accent)', fontWeight: 700,
                }}>
                  {stepsVisible[i] ? (i + 1) : ''}
                </div>
                {i === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
                    The AI Brain
                  </div>
                )}
                <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  {step}
                </div>
              </div>
            ))}

            {/* Outcome */}
            <div style={{
              position: 'relative', paddingTop: 4,
              opacity: outcomeVisible ? 1 : 0,
              transform: outcomeVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s ease-out',
            }}>
              <div style={{
                position: 'absolute', left: -28, top: 7,
                width: 16, height: 16, borderRadius: '50%',
                background: outcomeVisible ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {outcomeVisible && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5 L4 7 L8 3" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
                The result
              </div>
              <div style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.5, fontWeight: 500 }}>
                {selected.story.outcome}
              </div>
            </div>

            {/* Typing indicator when story is still playing */}
            {!outcomeVisible && visibleStep >= 0 && (
              <div style={{ display: 'flex', gap: 5, marginTop: 16, marginLeft: 4 }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} style={{
                    width: 5, height: 5, background: 'var(--accent)',
                    borderRadius: '50%', animation: 'acumeiBlink 1s infinite',
                    animationDelay: `${d * 0.2}s`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Dots */}
          <div style={{
            display: 'flex', gap: 6, marginTop: 20, paddingTop: 16,
            borderTop: '1px solid var(--border)', alignItems: 'center',
          }}>
            {INDUSTRIES.map((_, idx) => (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                width: activeIdx === idx ? 24 : 8, height: 8, borderRadius: 4,
                background: activeIdx === idx ? 'var(--accent)' : 'var(--border)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }} />
            ))}
            <span className="mono" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em' }}>
              {String(activeIdx + 1).padStart(2, '0')} / {String(INDUSTRIES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
