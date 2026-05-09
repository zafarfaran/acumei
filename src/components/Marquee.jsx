const ITEMS = [
  'Picks up the phone at 4am',
  'Books in lapsed clients',
  'Drafts your quotes',
  'Reorders your stock',
  'Chases late invoices',
  "Sorts tomorrow\u2019s diary",
  'Writes the follow-up email',
  'Triages emergencies',
  'Sends the rebooking nudge',
  'Reconciles the till',
  'Gives you your evenings back',
];

export default function Marquee() {
  const all = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-section" style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '20px 0',
      overflow: 'hidden',
      background: 'var(--bg-alt)',
    }}>
      <div className="marquee">
        {all.map((it, i) => (
          <span key={i} className="display" style={{
            fontSize: 32,
            color: 'var(--ink)',
            opacity: i % 2 ? 0.4 : 1,
          }}>
            {it}{' '}
            <span style={{ color: 'var(--accent)', marginLeft: 64 }}>✱</span>
          </span>
        ))}
      </div>
    </div>
  );
}
