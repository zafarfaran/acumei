import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section className="about-section" style={{
      padding: '120px 56px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="00" label="Who we are" />

      <div ref={ref} className={`about-grid animate-in${inView ? ' in-view' : ''}`} style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: 64,
        alignItems: 'center',
      }}>
        {/* Text */}
        <div>
          <h2 className="display about-title" style={{
            fontSize: 60,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
          }}>
            Ex-FAANG engineers building{' '}
            <span className="display-ital" style={{ color: 'var(--accent)' }}>AI for the rest of us.</span>
          </h2>

          <p style={{
            fontSize: 17,
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
            marginTop: 32,
            maxWidth: 520,
          }}>
            We built AI at the biggest tech companies in the world. Now we bring that
            capability to British SMEs — no jargon, no six-figure price tag.
          </p>

          <div style={{
            display: 'flex',
            gap: 8,
            marginTop: 36,
            flexWrap: 'wrap',
          }}>
            {['ML & AI platforms', 'Shipped to millions', 'Enterprise-scale systems', 'Research to production'].map((tag) => (
              <span key={tag} className="mono" style={{
                fontSize: 11,
                padding: '6px 14px',
                border: '1px solid var(--border)',
                borderRadius: 999,
                color: 'var(--ink-soft)',
                letterSpacing: '0.05em',
                background: 'var(--bg)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="img-zoom" style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '4 / 3',
          border: '1px solid var(--border)',
        }}>
          <img
            src="/images/team.jpg"
            alt="Team collaborating"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(transparent, rgba(24,24,28,0.6))',
            pointerEvents: 'none',
          }} />
          <div className="mono" style={{
            position: 'absolute',
            bottom: 10,
            left: 14,
            fontSize: 9,
            letterSpacing: '0.15em',
            color: 'var(--ink)',
            opacity: 0.7,
            zIndex: 2,
          }}>
            LONDON · FOUNDED 2025
          </div>
        </div>
      </div>
    </section>
  );
}
