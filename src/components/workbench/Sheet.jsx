import { useEffect, useRef, useState } from 'react';
import { createRenderer } from '../../lib/assembly/renderer';
import { buildMachine, setActive, GROUPS } from '../../lib/workbench/machineModel';
import { MODULES, BRANCHES, partByCode, slotByCode } from '../../lib/workbench/parts';
import { onFrame, invalidate, STATIC } from '../../lib/motion';
import { clamp, sm, lerp } from '../../lib/assembly/math';

const ALL = [...MODULES, ...BRANCHES];
const RED = new Set(['blocked', 'leaked', 'flagged']);
// socket box corners: 0-3 top, 4-7 bottom (same order)
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];

// Fit the whole drawing into the canvas: project every part's corners at S = 1.
function fitView(parts, yaw, cw, ch, mobile) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of parts) {
    const [w, d, h] = p.size;
    for (const dx of [-1, 1]) for (const dy of [-1, 1]) for (const dz of [-1, 1]) {
      const x = p.pos[0] + dx * w / 2, y = p.pos[1] + dy * d / 2, z = p.pos[2] + dz * h / 2;
      const xr = x * c - y * s, yr = x * s + y * c;
      const sx = (xr - yr) * 0.866, sy = (xr + yr) * 0.5 - z;
      x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
    }
  }
  y0 -= 1.6; // room above for the token and callouts
  const padL = mobile ? 18 : 150, padR = mobile ? 96 : 150, padT = mobile ? 28 : 40, padB = mobile ? 190 : 70; // phones: room for the docked callout
  const S = Math.min((cw - padL - padR) / (x1 - x0), (ch - padT - padB) / (y1 - y0));
  return {
    S,
    cx: padL + (cw - padL - padR - (x1 - x0) * S) / 2 - x0 * S,
    cy: padT + (ch - padT - padB - (y1 - y0) * S) / 2 - y0 * S,
  };
}

const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

export default function Sheet({ build, revealed, current, running, waiting, selected, onSlot, onCallout, onChoose, header }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const live = useRef({ m: null, R: null, anim: {}, tok: { from: null, to: null, t0: 0 }, t: 0, view: null, cw: 0, ch: 0, mobile: false, snap: false, running: false });
  const [snap, setSnap] = useState({ a: {}, cw: 0, ch: 0, mobile: false });

  // (re)build the machine when the build changes; new parts drop in
  useEffect(() => {
    const L = live.current;
    const prev = L.m;
    const m = buildMachine(build);
    for (const [slot, p] of Object.entries(m.fitted)) if (!prev || prev.fitted[slot]?.code !== p.code) L.anim[slot] = prev ? L.t : -10;
    for (const slot of Object.keys(L.anim)) if (!m.fitted[slot]) delete L.anim[slot];
    if (prev) m.token.pos = [...prev.token.pos];
    L.m = m;
    L.R = createRenderer(canvasRef.current, m.model);
    layout();
    invalidate();
  }, [build]);

  // token travel + active module
  useEffect(() => {
    const L = live.current;
    L.running = running;
    if (!L.m) return;
    const step = current?.step;
    setActive(L.m, running ? step : null);
    const to = step && L.m.slotPos[step];
    if (!running) { L.tok = { from: null, to: null, t0: 0 }; L.m.token.pos = [...L.m.slotPos['D-01']]; }
    else if (to) L.tok = { from: L.tok.to ? [...L.m.token.pos] : [to[0], to[1], to[2] + 2], to, t0: L.t };
    invalidate();
  }, [current, running]);

  function layout() {
    const L = live.current, canvas = canvasRef.current;
    if (!L.R || !canvas) return;
    const r = canvas.getBoundingClientRect();
    L.cw = Math.round(r.width); L.ch = Math.round(r.height);
    if (!L.cw || !L.ch) return;
    L.mobile = L.cw < 720;
    L.yaw = L.mobile ? 0.74 : -0.34; // phones: the rail runs down the screen
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    L.R.resize(L.cw, L.ch, dpr);
    const v = fitView(L.m.model.parts.filter((p) => !p.tokenPart), L.yaw, L.cw, L.ch, L.mobile);
    L.view = { cx: v.cx * dpr, cy: v.cy * dpr, S: v.S * dpr, zc: 0, yaw: L.yaw };
    L.snap = true;
    invalidate();
  }

  useEffect(() => {
    const L = live.current;
    const frame = (t) => {
      L.t = t;
      const { m, R, view } = L;
      if (!m || !R || !view) return;
      const tk = L.tok;
      if (tk.to) {
        const k = STATIC ? 1 : sm(clamp((t - tk.t0) / 0.6));
        const p = lerp3(tk.from || tk.to, tk.to, k);
        p[2] += STATIC ? 0 : Math.sin(t * 2.2) * 0.06;
        m.token.pos = p;
      }
      const q = new Array(GROUPS).fill(1);
      for (const [slot, t0] of Object.entries(L.anim)) { const p = m.fitted[slot]; if (p) q[p.g] = STATIC ? 1 : clamp((t - t0) / 0.75); }
      R.draw({
        d: 0, g1: 0, g2: 1, q, F: 1, W: 1, Rk: 0, mx: 0, mk: 0, pulse: 0, mAlpha: 1, G: 0,
        dimA: 0, dimProg: 0, hl: [0, 0, 0, 0, 0, 0, 0, 0], filter: (p) => L.running || !p.tokenPart,
        cables: [], labels: false, mobile: L.mobile, static: STATIC,
      }, view, t);
      if (L.snap) { L.snap = false; setSnap({ a: { ...R.anchors }, cw: L.cw, ch: L.ch, mobile: L.mobile }); }
    };
    const off = onFrame(frame);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(layout) : null;
    ro?.observe(wrapRef.current);
    window.addEventListener('resize', layout);
    document.fonts?.ready.then(layout);
    return () => { off(); ro?.disconnect(); window.removeEventListener('resize', layout); };
  }, []);

  const a = snap.a;
  const at = (k) => a[k] || null;
  const fits = (code) => selected && partByCode(selected)?.slot === code;

  // numbered callouts: one per revealed event (answers excluded), stacked per step
  const stack = {};
  const callouts = revealed.filter((e) => e.kind !== 'answer' && e.step).map((e) => {
    const n = (stack[e.step] = (stack[e.step] || 0) + 1) - 1;
    return { e, n };
  });
  const cur = current && current.kind !== 'answer' && current.step ? current : null;
  const curAt = cur && at(`slot:${cur.step}`);
  let box = null;
  if (curAt) {
    const w = Math.min(300, snap.cw - 24);
    let left = curAt[0] + 54, top = curAt[1] - 118;
    if (left + w > snap.cw - 8) left = Math.max(8, curAt[0] - 54 - w);
    top = clamp(top, 8, snap.ch - 150);
    box = { left, top, w };
  }

  return (
    <div className="wb-sheet">
      <div className="wb-sheet-hd mono">{header}</div>
      <div className="wb-stage" ref={wrapRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <svg className="wb-ov" width={snap.cw} height={snap.ch} aria-hidden="true">
          {/* dashed outlines where a branch could go */}
          {BRANCHES.map((code) => {
            if (build.branches.includes(code) || !at(`sock:${code}:0`)) return null;
            return (
              <g key={code} className={`wb-sock${fits(code) ? ' is-target' : ''}`}>
                {EDGES.map(([i, j]) => { const p = at(`sock:${code}:${i}`), q = at(`sock:${code}:${j}`); return <line key={`${i}${j}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />; })}
              </g>
            );
          })}
          {/* part labels */}
          {!snap.mobile && MODULES.map((code) => {
            const p = at(`label:${code}`); if (!p) return null;
            const part = partByCode(build[code]);
            const on = cur?.step === code;
            return (
              <g key={code} className={`wb-lbl${on ? ' is-on' : ''}${part.shortcut ? ' is-short' : ''}`}>
                <path d={`M${p[0]} ${p[1]} L${p[0] - 18} ${p[1] + 26} H${p[0] - 30}`} />
                <text x={p[0] - 34} y={p[1] + 29} textAnchor="end"><tspan className="c">{code}</tspan> {part.name}</text>
              </g>
            );
          })}
          {BRANCHES.map((code) => {
            const p = at(`label:${code}`); if (!p) return null;
            const fitted = build.branches.includes(code);
            const chain = code === 'G-05';
            const dx = 1;
            return (
              <g key={code} className={`wb-lbl${fitted ? '' : ' is-empty'}${cur?.step === code ? ' is-on' : ''}`}>
                <path d={`M${p[0]} ${p[1]} L${p[0] + dx * 16} ${p[1] + (chain ? 16 : -16)} H${p[0] + dx * 26}`} />
                <text x={p[0] + dx * 30} y={p[1] + (chain ? 19 : -13)}>
                  <tspan className="c">{code}</tspan>{snap.mobile ? '' : ` ${slotByCode(code).name}`}{fitted ? '' : ' · empty'}
                </text>
              </g>
            );
          })}
          {/* current step: leader to the callout box */}
          {box && curAt && (
            <path className={`wb-lead${RED.has(cur.verdict) ? ' is-red' : ''}`} d={`M${curAt[0]} ${curAt[1]} L${box.left < curAt[0] ? box.left + box.w : box.left} ${box.top + 16}`} />
          )}
        </svg>

        {/* slot buttons: the real controls */}
        {ALL.map((code) => {
          const p = at(`slot:${code}`); if (!p) return null;
          const s = slotByCode(code);
          const fitted = s.kind === 'module' ? partByCode(build[code]).name : build.branches.includes(code) ? 'fitted' : 'empty';
          const target = fits(code);
          return (
            <button
              key={code}
              type="button"
              data-slot={code}
              className={`wb-slot${target ? ' is-target' : ''}${cur?.step === code ? ' is-on' : ''}`}
              style={{ left: p[0], top: p[1] }}
              aria-label={`${code} ${s.name}: ${fitted}. ${target ? `Fit ${partByCode(selected).name} here` : 'Change part'}`}
              onClick={(e) => onSlot(code, e.currentTarget)}
            />
          );
        })}

        {callouts.map(({ e, n }) => {
          const p = at(`slot:${e.step}`); if (!p) return null;
          return (
            <button
              key={e.id}
              type="button"
              className={`wb-num mono v-${e.verdict}${cur?.id === e.id ? ' is-cur' : ''}`}
              style={{ left: p[0], top: p[1] - 6 - n * 24 }}
              onClick={() => onCallout(e.id)}
              aria-label={`Step ${e.id + 1}: ${e.summary}. Open in inspector`}
            >{e.id + 1}</button>
          );
        })}

        {box && (
          <div className={`wb-callout v-${cur.verdict}`} style={{ left: box.left, top: box.top, width: box.w }}>
            <div className="wb-callout-k mono">
              <span>{String(cur.id + 1).padStart(2, '0')} · {cur.step} {slotByCode(cur.step)?.name}</span>
              <span className="wb-verdict">{cur.verdict}</span>
            </div>
            <p>{cur.summary}</p>
            {waiting && cur.kind === 'pause' && !cur.pause.chosen && (
              <div className="wb-choices">
                {cur.pause.options.map((o) => <button key={o.id} type="button" className="mono" onClick={() => onChoose(cur.pause.id, o.id)}>{o.label}</button>)}
              </div>
            )}
            <button type="button" className="wb-more mono" onClick={() => onCallout(cur.id)}>Inspect ▸</button>
          </div>
        )}
      </div>
    </div>
  );
}
