export default function MediaPlaceholder({ label, kind = 'photo', height = 220, accent = false }) {
  const seed = label.length;
  const isVideo = kind === 'video';

  return (
    <div
      className="play-card"
      style={{
        position: 'relative',
        height,
        background: accent ? 'var(--accent)' : 'var(--surface)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        cursor: isVideo ? 'pointer' : 'default',
      }}
    >
      {!isVideo && (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--bg-alt)" />
              <stop offset="100%" stopColor="var(--surface)" />
            </linearGradient>
            <pattern
              id={`p-${seed}`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${(seed * 17) % 60})`}
            >
              <line x1="0" y1="0" x2="0" y2="20" stroke="var(--border)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill={`url(#g-${seed})`} />
          <rect width="400" height="300" fill={`url(#p-${seed})`} opacity="0.5" />
          <circle
            cx={80 + ((seed * 30) % 200)}
            cy={120 + ((seed * 13) % 80)}
            r={40 + ((seed * 7) % 40)}
            fill="var(--accent)"
            opacity="0.18"
          />
          <rect
            x={200 + ((seed * 11) % 80)}
            y={60 + ((seed * 5) % 40)}
            width="120"
            height="180"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      )}

      {isVideo && (
        <>
          <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            <rect width="400" height="300" fill="var(--ink)" />
            <g opacity="0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1="0" y1={50 + i * 40} x2="400" y2={50 + i * 40} stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
              ))}
            </g>
            <rect x="30" y="240" width="60" height="2" fill="var(--accent)" />
            <rect x="30" y="240" width="340" height="2" fill="var(--accent)" opacity="0.2" />
          </svg>
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
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(243, 238, 226, 0.25)',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <polygon points="6,4 16,10 6,16" fill="var(--ink)" />
              </svg>
            </div>
          </div>
          <div className="mono" style={{
            position: 'absolute',
            top: 12,
            left: 14,
            fontSize: 10,
            color: 'var(--bg)',
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
        background: isVideo
          ? 'linear-gradient(transparent, var(--ink))'
          : 'linear-gradient(transparent, rgba(14, 14, 16, 0.8))',
        fontSize: 11,
        letterSpacing: '0.12em',
        color: isVideo ? 'var(--bg)' : 'var(--ink)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{label}</span>
        <span style={{ opacity: 0.6 }}>{isVideo ? 'VIDEO' : 'PHOTO'}</span>
      </div>
    </div>
  );
}
