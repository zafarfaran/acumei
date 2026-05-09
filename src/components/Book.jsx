import useInView from '../hooks/useInView';
import BookingFlow from './BookingFlow';

export default function Book() {
  const [ref, inView] = useInView();

  return (
    <section id="book" className="book-section" style={{
      padding: '120px 56px',
      background: 'var(--ink)',
      color: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blur */}
      <div style={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'var(--accent)',
        opacity: 0.18,
        filter: 'blur(80px)',
      }} />

      {/* Section label — custom colors for inverted section */}
      <div className="mono" style={{
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 40,
        display: 'flex',
        gap: 16,
      }}>
        <span style={{ color: 'var(--accent)' }}>09</span>
        <span style={{ color: 'rgba(14, 14, 16, 0.5)' }}>—</span>
        <span style={{ color: 'rgba(14, 14, 16, 0.5)' }}>Start</span>
      </div>

      <div
        ref={ref}
        className={`book-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 64,
          alignItems: 'start',
          position: 'relative',
        }}
      >
        <div>
          <h2 className="display book-title" style={{
            fontSize: 72,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
          }}>
            Thirty minutes.
            <br />
            Honest answer.
            <br />
            <span className="display-ital" style={{ color: 'var(--accent)' }}>No pitch.</span>
          </h2>
          <p style={{
            fontSize: 17,
            color: 'rgba(14, 14, 16, 0.7)',
            lineHeight: 1.6,
            marginTop: 32,
            maxWidth: 460,
          }}>
            Bring the workflow that costs you the most time. We'll tell you if AI can fix it — and if it's not worth doing, we say so.
          </p>
          <div style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid rgba(14, 14, 16, 0.15)',
          }}>
            <div className="mono" style={{
              fontSize: 11,
              color: 'rgba(14, 14, 16, 0.5)',
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}>
              OR REACH OUT DIRECTLY
            </div>
            <div style={{ fontSize: 18 }}>hello@acumei.co.uk</div>
            <div style={{ fontSize: 14, color: 'rgba(14, 14, 16, 0.5)', marginTop: 6 }}>
              Studio: 12 Rivington Street, London EC2A · By appointment
            </div>
          </div>
        </div>

        <BookingFlow
          accent="#e8a04b"
          muted="rgba(14, 14, 16, 0.55)"
          surfaceBg="rgba(14, 14, 16, 0.04)"
          borderColor="rgba(14, 14, 16, 0.15)"
          textColor="#0e0e10"
        />
      </div>
    </section>
  );
}
