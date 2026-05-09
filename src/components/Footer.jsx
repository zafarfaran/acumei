export default function Footer() {
  return (
    <footer className="footer" style={{
      padding: '40px 56px',
      background: 'var(--ink)',
      color: 'rgba(14, 14, 16, 0.5)',
      borderTop: '1px solid rgba(14, 14, 16, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
    }}>
      <div className="mono" style={{ letterSpacing: '0.1em' }}>
        © 2026 ACUMEI LTD · REGISTERED IN ENGLAND &amp; WALES · LONDON
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <span>hello@acumei.co.uk</span>
        <span>LinkedIn</span>
        <span>Privacy</span>
      </div>
    </footer>
  );
}
