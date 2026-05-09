const SYSTEMS = [
  { angle: -90, label: 'CRM', r: 38 },
  { angle: -35, label: 'Diary', r: 42 },
  { angle: 18, label: 'POS', r: 38 },
  { angle: 70, label: 'SMS', r: 40 },
  { angle: 130, label: 'Email', r: 38 },
  { angle: 175, label: 'Stock', r: 42 },
  { angle: 225, label: 'Reviews', r: 40 },
  { angle: 280, label: 'Pay', r: 38 },
];

const cx = 50;
const cy = 50;

function toXY(deg, r) {
  return [
    cx + Math.cos((deg * Math.PI) / 180) * r,
    cy + Math.sin((deg * Math.PI) / 180) * r,
  ];
}

export default function BrainGraphic({ size = 380 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="brainBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      {/* Soft accent halo */}
      <circle cx={cx} cy={cy} r="48" fill="url(#brainGlow)" />

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.4"
          opacity="0.6"
          style={{
            transformOrigin: '50% 50%',
            animation: `a-brain-pulse 3.6s ease-out ${i * 1.2}s infinite`,
          }}
        />
      ))}

      {/* Outer rotating ring */}
      <g style={{ transformOrigin: '50% 50%', animation: 'a-brain-orbit 60s linear infinite' }}>
        <circle cx={cx} cy={cy} r="44" fill="none" stroke="var(--ink)" strokeWidth="0.2" opacity="0.3" strokeDasharray="0.5 2" />
      </g>

      {/* Mid rotating ring (reverse) */}
      <g style={{ transformOrigin: '50% 50%', animation: 'a-brain-orbit-rev 40s linear infinite' }}>
        <circle cx={cx} cy={cy} r="32" fill="none" stroke="var(--ink)" strokeWidth="0.25" opacity="0.45" strokeDasharray="2 1.2" />
      </g>

      {/* Connector lines + system nodes */}
      {SYSTEMS.map((s, i) => {
        const [x, y] = toXY(s.angle, s.r);
        return (
          <g key={s.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--ink)" strokeWidth="0.25" opacity="0.4" />
            <circle r="0.9" fill="var(--accent)">
              <animateMotion
                dur={`${3 + (i % 3) * 0.7}s`}
                repeatCount="indefinite"
                begin={`${i * 0.35}s`}
                path={`M ${cx} ${cy} L ${x} ${y}`}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${3 + (i % 3) * 0.7}s`}
                repeatCount="indefinite"
                begin={`${i * 0.35}s`}
              />
            </circle>
            <circle cx={x} cy={y} r="3.4" fill="var(--surface)" stroke="var(--ink)" strokeWidth="0.4" />
            <circle cx={x} cy={y} r="1.2" fill="var(--accent)" opacity="0.7" />
            <text
              x={x}
              y={y + (s.angle > 0 && s.angle < 180 ? 6 : -4.5)}
              textAnchor="middle"
              fontSize="2.2"
              fill="var(--ink-soft)"
              fontFamily="JetBrains Mono"
            >
              {s.label}
            </text>
          </g>
        );
      })}

      {/* Breathing core */}
      <g style={{ transformOrigin: '50% 50%', animation: 'a-brain-breathe 4s ease-in-out infinite' }} filter="url(#brainBlur)">
        <circle cx={cx} cy={cy} r="11" fill="var(--accent)" opacity="0.18" />
      </g>
      <circle cx={cx} cy={cy} r="8" fill="var(--accent)" stroke="var(--ink)" strokeWidth="0.5" />
      <text x={cx} y={cy - 0.6} textAnchor="middle" fontSize="2.6" fill="var(--bg)" fontFamily="JetBrains Mono" letterSpacing="0.15em">
        AI
      </text>
      <text x={cx} y={cy + 2.6} textAnchor="middle" fontSize="2.8" fill="var(--bg)" fontFamily="Fraunces" fontStyle="italic">
        brain
      </text>
    </svg>
  );
}
