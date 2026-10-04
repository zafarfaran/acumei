// The Acumei mark: crosshair in a circle with an amber centre.
export default function Mark({ size = 26 }) {
  return (
    <svg className="mark" viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="#f1ede4" aria-hidden="true">
      <circle cx="50" cy="50" r="38" strokeWidth="8" />
      <path d="M50 4v92M4 50h92" strokeWidth="3" />
      <circle cx="50" cy="50" r="15" fill="#e8a04b" stroke="none" />
    </svg>
  );
}
