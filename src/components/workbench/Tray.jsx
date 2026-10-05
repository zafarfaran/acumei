import { useRef, useState } from 'react';
import { SLOTS, partsForSlot } from '../../lib/workbench/parts';
import { hasPart } from '../../lib/workbench/build';

/**
 * The parts tray. Drag a part onto a slot, or tap / press Enter to pick it up
 * and then tap a highlighted slot. Drops land on whatever element under the
 * pointer carries data-slot.
 */
export default function Tray({ build, selected, onSelect, onDrop, filter, children }) {
  const drag = useRef(null);
  const skipClick = useRef(false);
  const [ghost, setGhost] = useState(null);

  function down(e, code) {
    if (e.button !== 0) return;
    drag.current = { code, x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
  }
  function move(e) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) {
      d.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      onSelect(d.code);
    }
    if (d.moved) setGhost({ code: d.code, x: e.clientX, y: e.clientY });
  }
  function up(e) {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return; // a plain click: handled by onClick
    skipClick.current = true; // swallow the click that follows this pointerup, if any
    setTimeout(() => { skipClick.current = false; }, 0);
    setGhost(null);
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-slot]');
    onDrop(d.code, el?.dataset.slot || null);
  }

  const groups = SLOTS.filter((s) => !filter || s.code === filter);

  return (
    <div className="wb-tray" aria-label="Parts tray">
      <div className="wb-tray-hd mono">
        <span>{filter ? `Parts for ${filter}` : 'Parts tray — drag onto a slot, or tap a part then a slot'}</span>
        {children}
      </div>
      <div className="wb-tray-groups">
        {groups.map((s) => (
          <div key={s.code} className="wb-group">
            <div className="wb-group-k mono"><b>{s.code}</b> {s.name}</div>
            <div className="wb-chips">
              {partsForSlot(s.code).map((p) => {
                const on = hasPart(build, p.code);
                return (
                  <button
                    key={p.code}
                    type="button"
                    className={`wb-chip${on ? ' is-fitted' : ''}${selected === p.code ? ' is-sel' : ''}${p.shortcut ? ' is-short' : ''}`}
                    aria-pressed={selected === p.code}
                    title={p.blurb}
                    onPointerDown={(e) => down(e, p.code)}
                    onPointerMove={move}
                    onPointerUp={up}
                    onPointerCancel={() => { drag.current = null; setGhost(null); }}
                    onClick={() => { if (skipClick.current) { skipClick.current = false; return; } onSelect(selected === p.code ? null : p.code); }}
                  >
                    <i className="wb-cube" aria-hidden="true" />
                    <span className="mono c">{p.code}</span>
                    <span className="n">{p.name}</span>
                    {on && <span className="mono f">fitted</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {ghost && (
        <div className="wb-ghost mono" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          <i className="wb-cube" />{ghost.code}
        </div>
      )}
    </div>
  );
}
