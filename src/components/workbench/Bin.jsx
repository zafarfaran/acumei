import { useEffect, useRef, useState } from 'react';
import { partByCode } from '../../lib/workbench/parts';
import IsoCube from './IsoCube';
import useDragPart from './useDragPart';

// What each guardrail does, in a few words a hurried visitor will read.
const SAFETY = {
  'G-01': 'asks instead of guessing',
  'G-02': 'hides names and emails',
  'G-03': 'asks before big spends',
  'G-04': 'a person checks first',
  'G-05': 'keeps a record',
};

/**
 * The parts bin: guardrails on a shelf along the bottom of the drawing. Drag
 * one onto the machine (its socket lights up and it snaps when close), or tap
 * it to switch it on and off. `lift` raises the part that would fix the last
 * run and draws a dashed arc to where it goes.
 */
export default function Bin({ build, selected, onSelect, onDrop, onToggle, lift, frameRef }) {
  const { dragProps, clicked, ghost } = useDragPart({ onSelect, onDrop });
  const itemRefs = useRef({});
  const binRef = useRef(null);
  const [arc, setArc] = useState(null);

  // measure the arc from the lifted part to its socket, relative to the frame
  useEffect(() => {
    if (!lift) { setArc(null); return undefined; }
    const measure = () => {
      // the arc's svg is positioned inside the bin, so measure everything from the bin
      const bin = binRef.current, item = itemRefs.current[lift];
      const sock = frameRef.current?.querySelector(`[data-slot="${lift}"]`);
      if (!bin || !item || !sock) return setArc(null);
      const f = bin.getBoundingClientRect(), i = item.getBoundingClientRect(), s = sock.getBoundingClientRect();
      const from = [i.left - f.left + 26, i.top - f.top + 4];
      const to = [s.left - f.left + s.width / 2, s.top - f.top + s.height / 2 + 12];
      setArc({ from, to });
      return undefined;
    };
    const id = setTimeout(measure, 60);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, [lift, frameRef, build]);

  return (
    <div className="wb-bin" aria-label="Safety parts" ref={binRef}>
      <div className="wb-k mono"><i aria-hidden="true" />Safety parts · drag onto the machine</div>
      <div className="wb-shelf">
        {Object.keys(SAFETY).map((code, i) => {
          const on = build.branches.includes(code);
          return (
            <button
              key={code}
              ref={(el) => { itemRefs.current[code] = el; }}
              type="button"
              aria-pressed={on}
              aria-description={SAFETY[code]}
              className={`wb-part${on ? ' is-on' : ''}${selected === code ? ' is-sel' : ''}${lift === code ? ' is-lift' : ''}`}
              style={{ '--i': i }}
              {...dragProps(code)}
              onClick={clicked(() => onToggle(code))}
            >
              <span className="cube"><IsoCube amber={on || lift === code} /><i className="shadow" aria-hidden="true" /></span>
              <span className="t">
                <b>{partByCode(code).name}</b>
                {on && <span className="c mono">On ✓</span>}
              </span>
            </button>
          );
        })}
      </div>
      {arc && (
        <svg className="wb-arc" width="1" height="1" aria-hidden="true">
          <path className="halo" d={`M${arc.from[0]} ${arc.from[1]} C${arc.from[0] - 30} ${arc.from[1] - 200} ${arc.to[0] - 160} ${arc.to[1] + 140} ${arc.to[0]} ${arc.to[1]}`} />
          <path d={`M${arc.from[0]} ${arc.from[1]} C${arc.from[0] - 30} ${arc.from[1] - 200} ${arc.to[0] - 160} ${arc.to[1] + 140} ${arc.to[0]} ${arc.to[1]}`} />
          <circle cx={arc.to[0]} cy={arc.to[1]} r="14" />
          <text x={arc.to[0] + 34} y={arc.to[1] - 26}>↙ DRAG HERE</text>
        </svg>
      )}
      {ghost}
    </div>
  );
}
