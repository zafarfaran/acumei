import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const ITEMS = [
  { label: 'After-hours dispatch \u00b7 Bristol', src: '/images/video-still.jpg', span: { col: 4, row: 2 } },
  { label: 'The dispatch desk', src: '/images/dispatch.jpg', span: { col: 2, row: 1 } },
  { label: 'Sunday order run \u00b7 Leeds', src: '/images/kitchen.jpg', span: { col: 2, row: 1 } },
  { label: 'Rebooking mornings \u00b7 Manchester', src: '/images/salon.jpg', span: { col: 3, row: 1 } },
  { label: 'Build week \u00b7 the studio', src: '/images/office.jpg', span: { col: 3, row: 1 } },
];

function GalleryCard({ item }) {
  return (
    <div
      className="img-zoom"
      style={{
        gridColumn: `span ${item.span.col}`,
        gridRow: `span ${item.span.row}`,
        position: 'relative',
        overflow: 'hidden',
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
      }}>
        {item.label}
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
