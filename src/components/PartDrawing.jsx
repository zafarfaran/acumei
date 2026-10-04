import { useEffect, useRef } from 'react';
import { createRenderer } from '../lib/assembly/renderer';
import { partScene, partView } from '../lib/assembly/scenes';
import { SETS } from '../lib/assembly/machine';
import { clamp } from '../lib/assembly/math';
import { onFrame, invalidate, STATIC, initialScrollY } from '../lib/motion';

const FIG = { data: '02', models: '03', agents: '04', operations: '05', lamp: '06', machine: '01' };

/**
 * One subassembly of the machine as a sticky technical drawing. It assembles and
 * slowly turns as the page scrolls. part: 'data' | 'models' | 'agents' |
 * 'operations' | 'machine' | 'lamp'.
 */
export default function PartDrawing({ part = 'machine', n }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const set = SETS[part] || SETS.machine;

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    const R = createRenderer(canvas);
    let cw = 0, ch = 0, p = 0, shownP = 0, boot = STATIC ? 1 : 0, lastT = 0, n2 = 0;
    let snap = false;

    function size() {
      const r = canvas.getBoundingClientRect();
      cw = Math.round(r.width); ch = Math.round(r.height);
      R.resize(cw, ch, window.devicePixelRatio || 1);
      if (STATIC) invalidate();
    }

    function frame(t) {
      const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      p = clamp(window.scrollY / travel);
      if (snap || STATIC) { shownP = p; snap = false; } else shownP += (p - shownP) * 0.12;
      if (boot < 1) boot = Math.min(1, boot + Math.max(0, t - lastT) / 1.4);
      lastT = t;
      n2++;
      if (!STATIC && (n2 & 1)) return; // 30fps is plenty for a small drawing
      if (!cw || !ch) return;
      const s = partScene(part, shownP, boot, STATIC);
      R.draw(s, partView(part, shownP, cw, ch, R.dpr, t, STATIC), t);
    }

    size();
    const qy = initialScrollY();
    if (qy != null) { window.scrollTo({ top: qy, left: 0, behavior: 'instant' }); snap = true; boot = 1; }
    const off = onFrame(frame);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(size) : null;
    ro?.observe(wrap);
    window.addEventListener('resize', size);
    return () => { off(); ro?.disconnect(); window.removeEventListener('resize', size); };
  }, [part]);

  return (
    <aside className="pdraw" aria-hidden="true">
      <div className="pdraw-in" ref={wrapRef}>
        <canvas ref={canvasRef} />
        <div className="pdraw-tb mono">
          <div>DWG <b>W4-{FIG[part] || '01'}</b></div>
          <div>FIG. <b>{set.name}</b></div>
          <div>{set.ids}</div>
          <div>SHEET <b>{n || '01'}</b></div>
        </div>
      </div>
    </aside>
  );
}
