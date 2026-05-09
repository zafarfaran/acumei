import { useState, useEffect } from 'react';

const SCENARIOS = [
  {
    label: 'Plumbing dispatch',
    industry: 'Trades',
    messages: [
      { role: 'system', text: 'New voicemail received: 04:47' },
      { role: 'transcript', text: '"Hi, this is Janet on Cedar Road, my boiler is leaking quite badly into the kitchen, please ring me back as soon as you can."' },
      { role: 'agent', text: 'Triaged: emergency · water damage risk · returning customer (last visit Mar 2024)' },
      { role: 'agent', text: 'Drafted SMS to Tom (on-call): "Emergency at 14 Cedar Rd — Janet R., active leak. ETA?"' },
      { role: 'agent', text: 'Held diary slot 08:00 — auto-confirmed when Tom accepted.' },
      { role: 'result', text: '14 seconds. Phone never rang.' },
    ],
  },
  {
    label: 'Restaurant ordering',
    industry: 'Hospitality',
    messages: [
      { role: 'system', text: 'Sunday 9:12 PM · POS sync complete' },
      { role: 'agent', text: 'Reviewed last 30 days of sales against current stock.' },
      { role: 'agent', text: 'Flagged: ribeye (−31% vs forecast), basil (waste +24%), house red (out by Wed).' },
      { role: 'agent', text: 'Drafted order for Brakes: ribeye −4kg, basil −2 cases, +6 cases house red.' },
      { role: 'agent', text: 'Sent to chef for approval — one tap to send.' },
      { role: 'result', text: '£270 in projected food waste avoided this week.' },
    ],
  },
  {
    label: 'Salon rebooking',
    industry: 'High street',
    messages: [
      { role: 'system', text: 'Daily run · 6:00 AM' },
      { role: 'agent', text: 'Identified 23 clients overdue for rebooking (>8 weeks since last cut).' },
      { role: 'agent', text: 'Personalised SMS drafted for each — referencing stylist + service.' },
      { role: 'agent', text: 'Sent to 23 clients. Held back 2 with prior complaints for review.' },
      { role: 'result', text: '7 rebookings by 11:00. No team time spent.' },
    ],
  },
];

const ROLE_PREFIX = {
  system: '◦',
  transcript: '"',
  agent: '▸',
  result: '✓',
};

export default function AIDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const scenario = SCENARIOS[scenarioIdx];

  useEffect(() => {
    setVisibleCount(1);
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= scenario.messages.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 1100);
    return () => clearInterval(interval);
  }, [scenarioIdx]);

  const roleStyle = (role) => {
    switch (role) {
      case 'system':
        return { color: 'var(--muted)', fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12, opacity: 0.7 };
      case 'transcript':
        return { color: 'var(--ink)', fontStyle: 'italic', fontSize: 14, opacity: 0.9, paddingLeft: 16, borderLeft: '2px solid var(--border)' };
      case 'agent':
        return { color: 'var(--ink)', fontSize: 14 };
      case 'result':
        return { color: 'var(--accent)', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', borderTop: '1px dashed var(--border)', paddingTop: 12, marginTop: 8 };
      default:
        return {};
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setScenarioIdx(i)}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: i === scenarioIdx ? '#0f0f0f' : 'transparent',
              border: 'none',
              borderRight: i < SCENARIOS.length - 1 ? '1px solid var(--border)' : 'none',
              borderBottom: i === scenarioIdx ? '2px solid var(--accent)' : 'none',
              color: i === scenarioIdx ? 'var(--ink)' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              textAlign: 'left',
              marginBottom: -1,
              transition: 'color 0.2s',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 2 }}>
              {s.industry}
            </div>
            <div>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Console */}
      <div style={{ padding: 24, minHeight: 320, fontFamily: 'inherit' }}>
        {scenario.messages.slice(0, visibleCount).map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 12,
            marginBottom: 14,
            animation: 'demoFadeIn 0.4s ease-out',
          }}>
            <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12, marginTop: 2, minWidth: 14 }}>
              {ROLE_PREFIX[m.role]}
            </span>
            <span style={{ ...roleStyle(m.role), flex: 1, lineHeight: 1.5 }}>
              {m.text}
            </span>
          </div>
        ))}
        {visibleCount < scenario.messages.length && (
          <div style={{ display: 'flex', gap: 4, marginTop: 8, marginLeft: 26 }}>
            <span style={{
              width: 6,
              height: 6,
              background: 'var(--accent)',
              borderRadius: '50%',
              animation: 'acumeiBlink 1s infinite',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
