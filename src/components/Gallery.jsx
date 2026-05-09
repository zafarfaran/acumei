import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const ITEMS = [
  { label: 'The 4 AM voicemail \u00b7 Bristol', src: '/images/video-still.jpg', kind: 'video', span: { col: 4, row: 2 } },
  { label: 'Dispatch desk', src: '/images/dispatch.jpg', kind: 'photo', span: { col: 2, row: 1 } },
  { label: 'Sunday order, Leeds', src: '/images/kitchen.jpg', kind: 'photo', span: { col: 2, row: 1 } },
  { label: 'Salon \u00b7 Manchester', src: '/images/salon.jpg', kind: 'photo', span: { col: 3, row: 1 } },
  { label: 'Walkthrough \u00b7 90 sec', src: '/images/office.jpg', kind: 'video', span: { col: 3, row: 1 } },
];

function GalleryCard({ item }) {
  const isVideo = item.kind === 'video';
  return (
    <div
      className="img-zoom play-card"
      style={{
        gridColumn: `span ${item.span.col}`,
        gridRow: `span ${item.span.row}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: isVideo ? 'pointer' : 'default',
      }}
    >
      <img
        src={item.src}
        alt={item.label}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(transparent 40%, rgba(14,14,16,0.7) 100%)',
      }} />

      {isVideo && (
        <>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div className="play-btn" style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <polygon points="7,4 16,10 7,16" fill="var(--ink)" />
              </svg>
            </div>
          </div>
          <div className="mono" style={{
            position: 'absolute',
            top: 12,
            left: 14,
            fontSize: 10,
            color: 'var(--ink)',
            letterSpacing: '0.15em',
          }}>
            ● REC · 02:14
          </div>
        </>
      )}

      {/* Label */}
      <div className="mono" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px 14px',
        fontSize: 11,
        letterSpacing: '0.12em',
        color: 'var(--ink)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{item.label}</span>
        <span style={{ opacity: 0.6 }}>{isVideo ? 'VIDEO' : 'PHOTO'}</span>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [ref, inView] = useInView();

  return (
    <section className="gallery-section" style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="03" label="On site with our customers" />
      <div className="gallery-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        flexWrap: 'wrap',
        gap: 24,
        marginBottom: 56,
      }}>
        <h2 className="display gallery-title" style={{
          fontSize: 60,
          margin: 0,
          letterSpacing: '-0.025em',
          maxWidth: 720,
          lineHeight: 1.05,
        }}>
          The British businesses we built an{' '}
          <span className="display-ital" style={{ color: 'var(--accent)' }}>AI Brain</span> for.
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 280, margin: 0 }}>
          From real builds — kitchens, dispatch desks, salons and back offices.
        </p>
      </div>

      <div
        ref={ref}
        className={`gallery-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridAutoRows: '180px',
          gap: 16,
        }}
      >
        {ITEMS.map((item) => (
          <GalleryCard key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}
