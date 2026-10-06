// A small dithered isometric block, like the parts on the drawing.
export default function IsoCube({ amber }) {
  const id = amber ? 'wbdA' : 'wbdC';
  const c = amber ? '#e8a04b' : '#f1ede4';
  return (
    <svg className="wb-isocube" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1.2" height="1.2" fill={c} /></pattern>
      </defs>
      <polygon points="20,4 36,12 20,20 4,12" fill={`url(#${id})`} stroke={c} strokeWidth="1" />
      <polygon points="4,12 20,20 20,36 4,28" fill="#0a0a0b" stroke={c} strokeWidth="1" />
      <polygon points="4,12 20,20 20,36 4,28" fill={`url(#${id})`} opacity="0.55" />
      <polygon points="20,20 36,12 36,28 20,36" fill="#0a0a0b" stroke={c} strokeWidth="1" />
      <polygon points="20,20 36,12 36,28 20,36" fill={`url(#${id})`} opacity="0.22" />
    </svg>
  );
}
