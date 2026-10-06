import { useRef, useState } from 'react';
import { partByCode } from '../../lib/workbench/parts';
import { STATIC } from '../../lib/motion';
import IsoCube from './IsoCube';

const SNAP = 90; // px: within this of the right slot, the part snaps to it

/**
 * Drag a part onto the machine. While dragging, the part is "selected" so its
 * socket lights up on the drawing; near that socket the part snaps to it. A
 * plain click is left to the caller (wrap the handler in clicked()).
 * Returns props for the draggable element and the floating ghost to render.
 */
export default function useDragPart({ onSelect, onDrop }) {
  const drag = useRef(null);
  const skipClick = useRef(false);
  const [ghost, setGhost] = useState(null);

  function down(e, code) {
    if (e.button !== 0) return;
    drag.current = { code, x: e.clientX, y: e.clientY, lastX: e.clientX, moved: false, id: e.pointerId, target: null };
    // capture straight away, so even a fast flick off the part keeps reporting moves to it
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function move(e) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) {
      d.moved = true;
      onSelect(d.code); // lights up the matching socket on the drawing
    }
    if (!d.moved) return;
    // the one slot this part fits, measured live (the page may have scrolled)
    const el = document.querySelector(`[data-slot="${partByCode(d.code).slot}"]`);
    const r = el?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : 0, cy = r ? r.top + r.height / 2 + 22 : 0;
    const near = Boolean(r) && Math.hypot(e.clientX - cx, e.clientY - cy) < SNAP;
    d.target = near ? partByCode(d.code).slot : null;
    const tilt = Math.max(-14, Math.min(14, (e.clientX - d.lastX) * 0.9));
    d.lastX = e.clientX;
    setGhost({ code: d.code, x: near ? cx : e.clientX, y: near ? cy : e.clientY, snap: near, tilt: near ? 0 : tilt });
  }
  function up(e) {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return; // a plain click: handled by onClick
    skipClick.current = true; // swallow the click that follows this pointerup, if any
    setTimeout(() => { skipClick.current = false; }, 0);
    setGhost(null);
    const under = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-slot]')?.dataset.slot;
    onDrop(d.code, d.target || under || null);
  }
  const cancel = () => { drag.current = null; setGhost(null); onSelect(null); };

  return {
    dragProps: (code) => ({ onPointerDown: (e) => down(e, code), onPointerMove: move, onPointerUp: up, onPointerCancel: cancel }),
    clicked: (fn) => () => { if (skipClick.current) { skipClick.current = false; return; } fn(); },
    ghost: ghost && (
      <div
        className={`wb-ghost${ghost.snap ? ' is-snap' : ''}`}
        style={{ transform: `translate(${ghost.x}px, ${ghost.y}px) translate(-50%, -50%) rotate(${STATIC ? 0 : ghost.tilt}deg)` }}
        aria-hidden="true"
      >
        <IsoCube amber />
        <span className="mono">{ghost.snap ? 'Let go' : partByCode(ghost.code).name}</span>
      </div>
    ),
  };
}
