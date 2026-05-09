export default function SectionLabel({ n, label }) {
  return (
    <div className="mono" style={{
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 40,
      display: 'flex',
      gap: 16,
    }}>
      <span style={{ color: 'var(--accent)' }}>{n}</span>
      <span style={{ color: 'var(--muted)' }}>—</span>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}
