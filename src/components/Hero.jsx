import BrainGraphic from './BrainGraphic';

const LIVE_ITEMS = [
  { time: '04:47', label: 'Emergency triage · Bristol', status: 'dispatched', accent: true },
  { time: '06:00', label: 'Salon rebookings · Soho', status: '23 sent · 7 booked', accent: false },
  { time: '09:12', label: 'Stock reconciled · Leeds', status: 'reconciled', accent: false },
  { time: '14:30', label: 'Quote drafted · Manchester', status: '£8,420 · sent', accent: true },
];

const TAGS = [
  'Stops calls slipping',
  'Books appointments back in',
  'Chases late invoices',
  'Triages emergencies',
  'Writes the awkward emails',
  'Gives you your evenings back',
];

export default function Hero({ scrollY = 0 }) {
  return (
    <div className="hero-section" style={{ position: 'relative', padding: '110px 56px 90px', overflow: 'hidden' }}>
      {/* Background image */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.18,
          filter: 'saturate(0.3) sepia(0.4)',
          pointerEvents: 'none',
        }}
      />
      {/* Gradient overlays to keep text readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(232,160,75,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div className="grain" />

      <div className="hero-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: 64,
        alignItems: 'end',
        position: 'relative',
      }}>
        {/* Left column */}
        <div>
          <div className="mono" style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            marginBottom: 32,
            textTransform: 'uppercase',
          }}>
            <span
              className="pulse-dot"
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                background: 'var(--accent)',
                borderRadius: '50%',
                marginRight: 10,
                verticalAlign: 'middle',
              }}
            />
            AI for British businesses
          </div>

          <h1 className="display hero-title" style={{
            fontSize: 104,
            lineHeight: 0.93,
            margin: 0,
            letterSpacing: '-0.035em',
          }}>
            The <span className="display-ital" style={{ color: 'var(--accent)' }}>AI Brain</span>
            <br />your business
            <br />was promised.
          </h1>

          <p className="hero-body" style={{
            fontSize: 21,
            color: 'var(--ink-soft)',
            lineHeight: 1.5,
            maxWidth: 580,
            marginTop: 36,
          }}>
            A quietly brilliant <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>AI assistant</strong> that
            picks up the phone at 4am, drafts the awkward follow-up, sorts tomorrow's diary and reorders
            stock before you notice it's low. Stop firefighting. Start running your business.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {TAGS.map((tag) => (
              <span key={tag} className="mono" style={{
                fontSize: 11,
                padding: '6px 12px',
                border: '1px solid var(--border)',
                borderRadius: 999,
                color: 'var(--ink-soft)',
                letterSpacing: '0.05em',
                background: 'var(--surface)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
            <button className="btn-glow" onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '16px 26px',
              background: 'var(--ink)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: 999,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              Book a 30-minute discovery call
              <span className="arrow-loop" style={{ display: 'inline-block' }}>→</span>
            </button>
            <button onClick={() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '16px 26px',
              background: 'transparent',
              color: 'var(--ink)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              See live examples
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="hero-right">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
            padding: 16,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            position: 'relative',
          }}>
            <BrainGraphic size={300} />
            <div className="mono" style={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'var(--muted)',
            }}>
              FIG.01 · THE AI BRAIN — ALWAYS ON, ALWAYS QUIET
            </div>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 18,
            transform: `translateY(${Math.max(-32, -scrollY * 0.04)}px)`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <span className="mono" style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}>
                Today, across the network
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--accent)' }}>
                <span className="pulse-dot" style={{
                  width: 6,
                  height: 6,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                }} />
                <span className="mono" style={{ letterSpacing: '0.1em' }}>LIVE</span>
              </span>
            </div>

            {LIVE_ITEMS.map((it, i) => (
              <div key={i} className="reveal" style={{
                display: 'grid',
                gridTemplateColumns: '46px 1fr auto',
                gap: 14,
                padding: '8px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                alignItems: 'center',
                animationDelay: `${i * 80}ms`,
              }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{it.time}</span>
                <span style={{ fontSize: 12 }}>{it.label}</span>
                <span className="mono" style={{ fontSize: 10, color: it.accent ? 'var(--accent)' : 'var(--ink)' }}>
                  {it.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry row */}
      <div className="hero-industries" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        marginTop: 88,
        color: 'var(--muted)',
        fontSize: 12,
        flexWrap: 'wrap',
      }}>
        <span className="mono" style={{ letterSpacing: '0.1em' }}>NOW SERVING:</span>
        <span>Plumbing &amp; heating</span><span>·</span>
        <span>Hospitality</span><span>·</span>
        <span>Salons &amp; clinics</span><span>·</span>
        <span>Independent retail</span><span>·</span>
        <span>Trades</span><span>·</span>
        <span>Solicitors &amp; accountants</span>
      </div>
    </div>
  );
}
