import { useEffect, useRef } from 'react';
import { createRenderer } from '../../lib/assembly/renderer';
import { sm, lin, clamp } from '../../lib/assembly/math';
import { onFrame, invalidate, STATIC } from '../../lib/motion';
import { premoModel, GROUP } from '../premo/model';

const N = GROUP.length;

/**
 * The Premo system drawn in place of a screenshot on the home Work sheet.
 * It assembles as the sheet scrolls up through the viewport and powers in
 * amber once it is fully in view: a preview of the case study's build scene.
 */
export default function PremoPlate() {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const figRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current, canvas = canvasRef.current;
    const R = createRenderer(canvas, premoModel);
    let cw = 0, ch = 0, shown = STATIC ? N : 0, last = -1;

    const layout = () => {
      const r = box.getBoundingClientRect();
      cw = Math.round(r.width); ch = Math.round(r.height);
      R.resize(cw, ch, window.devicePixelRatio || 1);
      last = -1;
      invalidate();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(box);

    const stop = onFrame((t) => {
      if (!cw || !ch) return;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -40 || r.top > vh + 40) return; // off screen
      // build from when the plate's top enters at 95% of the viewport to 30%
      const want = STATIC ? N : clamp((vh * 0.95 - r.top) / (vh * 0.65)) * N;
      shown += (want - shown) * 0.12;
      if (Math.abs(want - shown) < 0.002) shown = want;

      const q = new Array(8).fill(0);
      for (let k = 0; k < N; k++) q[GROUP[k]] = sm(lin(shown, k + 0.02, k + 0.72));
      const W = sm(lin(shown, N - 0.55, N - 0.1));
      const dpr = R.dpr;
      const S = Math.min(cw / 17, ch / 12.5);
      const yaw = STATIC ? -0.1 : -0.28 + 0.07 * shown + Math.sin(t * 0.28) * 0.05;
      R.draw(
        {
          d: 0, g1: STATIC ? 0 : 1, g2: 1, q, F: 1, W, Rk: 0, mx: 0, mk: 0, pulse: 0, mAlpha: 1,
          G: 0.6, dimA: 0, dimProg: 0, hl: new Array(8).fill(0), filter: (p) => p.g !== 4,
          cables: [0, 1, 2], labels: cw > 520, mobile: cw <= 520, static: STATIC,
        },
        { cx: cw * dpr * 0.5, cy: ch * dpr * 0.56, S: S * dpr, zc: 2.0, yaw },
        t,
      );

      const stage = shown >= N - 0.05 ? 'POWERED' : shown <= 0.05 ? 'EXPLODED VIEW' : `STEP ${String(Math.min(N, Math.floor(shown) + 1)).padStart(2, '0')} / 06`;
      if (stage !== last && figRef.current) { figRef.current.textContent = stage; last = stage; }
    });

    return () => { stop(); ro.disconnect(); };
  }, []);

  return (
    <div className="sheet-img premo-plate" ref={boxRef}>
      <canvas ref={canvasRef} role="img" aria-label="Isometric drawing of the Premo system: sealed tenant cells, an analysis agent core with guardrails, a WhatsApp agent and an audit chain." />
      <div className="pp-tag mono"><span>FIG. P-01 · PREMO SYSTEM</span><b ref={figRef} /></div>
    </div>
  );
}
