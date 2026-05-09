import { useState } from 'react';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <nav className="nav-bar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#0e0e10d9',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 56px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="var(--accent)" />
          <path d="M12 2 L12 22 M2 12 L22 12" stroke="var(--ink)" strokeWidth="0.5" opacity="0.3" />
        </svg>
        <span className="display" style={{ fontSize: 26, letterSpacing: '-0.01em' }}>Acumei</span>
      </div>

      <div className="nav-links" style={{
        display: 'flex',
        gap: 32,
        fontSize: 14,
        color: 'var(--ink-soft)',
      }}>
        <a onClick={() => go('industries')} style={{ cursor: 'pointer' }}>The AI Brain</a>
        <a onClick={() => go('how')} style={{ cursor: 'pointer' }}>How it works</a>
        <a onClick={() => go('customers')} style={{ cursor: 'pointer' }}>Customers</a>
        <a onClick={() => go('services')} style={{ cursor: 'pointer' }}>Pricing</a>
        <a onClick={() => go('faq')} style={{ cursor: 'pointer' }}>FAQ</a>
      </div>

      <button className="nav-cta btn-glow" onClick={() => go('book')} style={{
        padding: '10px 18px',
        background: 'var(--ink)',
        color: 'var(--bg)',
        border: 'none',
        borderRadius: 999,
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}>Book a call →</button>

      {/* Hamburger button — hidden on desktop via CSS */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
          {menuOpen ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#0e0e10f0',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          fontSize: 16,
          color: 'var(--ink-soft)',
        }}>
          <a onClick={() => go('industries')} style={{ cursor: 'pointer' }}>The AI Brain</a>
          <a onClick={() => go('how')} style={{ cursor: 'pointer' }}>How it works</a>
          <a onClick={() => go('customers')} style={{ cursor: 'pointer' }}>Customers</a>
          <a onClick={() => go('services')} style={{ cursor: 'pointer' }}>Pricing</a>
          <a onClick={() => go('faq')} style={{ cursor: 'pointer' }}>FAQ</a>
          <button onClick={() => go('book')} style={{
            padding: '12px 18px',
            background: 'var(--ink)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: 999,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginTop: 8,
          }}>Book a call →</button>
        </div>
      )}
    </nav>
  );
}
