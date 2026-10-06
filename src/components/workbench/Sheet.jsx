import { useEffect, useRef, useState } from 'react';
import { createRenderer } from '../../lib/assembly/renderer';
import { buildMachine, setActive, GROUPS } from '../../lib/workbench/machineModel';
import { MODULES, BRANCHES, partByCode, slotByCode } from '../../lib/workbench/parts';
import { onFrame, invalidate, STATIC } from '../../lib/motion';
import { clamp, sm, lerp, hash } from '../../lib/assembly/math';

const ALL = [...MODULES, ...BRANCHES];
const RED = new Set(['blocked', 'leaked', 'flagged']);
const STEP_NAMES = ['Intake', 'Understand', 'Access', 'Query', 'Validate', 'Deliver'];
// socket box corners: 0-3 top, 4-7 bottom (same order)
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];

// Fit the whole drawing into the area right of `padL`: project every part's corners at S = 1.
function fitView(parts, yaw, cw, ch, pad) {
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
  y0 -= 1.4; // room above for the request token
  y1 += 2.4; // room below for the dimension line
  const S = Math.min((cw - pad.l - pad.r) / (x1 - x0), (ch - pad.t - pad.b) / (y1 - y0));
  return {
    S,
    cx: pad.l + (cw - pad.l - pad.r - (x1 - x0) * S) / 2 - x0 * S,
    cy: pad.t + (ch - pad.t - pad.b - (y1 - y0) * S) / 2 - y0 * S,
  };
}

const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// Red dots spilling out of a module that leaked data.
const SPILL = Array.from({ length: 22 }, (_, i) => ({
  dx: (hash(i) - 0.5) * 160, dy: 40 + hash(i + 40) * 110, d: Math.round(hash(i + 80) * 300), s: 3 + Math.round(hash(i + 120) * 3),
}));

// A homepage-style label: a "+" on the part, an angled leader, the code bright and the name dim.
function Label({ p, code, name, dir, tone, drop }) {
  const dx = dir === 'l' ? -1 : 1, ex = p[0] + dx * 20, ey = p[1] + (drop ? 24 : -14);
  return (
    <g className={`wb-xl${tone ? ` is-${tone}` : ''}`}>
      <path className="x" d={`M${p[0] - 3.5} ${p[1]}H${p[0] + 3.5}M${p[0]} ${p[1] - 3.5}V${p[1] + 3.5}`} />
      <path className="ld" d={`M${p[0] + dx * 4} ${p[1] + (drop ? 3 : -2)}L${ex} ${ey}H${ex + dx * 8}`} />
      <text x={ex + dx * 12} y={ey + 3.5} textAnchor={dir === 'l' ? 'end' : 'start'}>
        <tspan className="c">{code}</tspan><tspan className="n">{name ? `  ${name}` : ''}</tspan>
      </text>
    </g>
  );
}

/**
 * The machine, drawn straight onto the page like the homepage hero: no frame,
 * crosshair labels, a dimension line, the route the request took, and a step
 * timeline. On wide screens the drawing sits to the right of `leftPad`
 * (the narration column overlays the left).
 */
export default function Sheet({ build, revealed, current, running, selected, onSlot, onMarker, leftPad = 0, stateLabel }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const live = useRef({ m: null, R: null, anim: {}, intro: false, tok: { from: null, to: null, t0: 0 }, t: 0, view: null, cw: 0, ch: 0, mobile: false, snap: false, running: false, leftPad: 0 });
  const [snap, setSnap] = useState({ a: {}, cw: 0, ch: 0, mobile: false });
  const [flashes, setFlashes] = useState([]); // rings where a part just landed
  const [shake, setShake] = useState(0);
  const [ready, setReady] = useState(STATIC); // labels fade in once the machine has assembled

  // (re)build the machine when the build changes; new parts drop in
  useEffect(() => {
    const L = live.current;
    const prev = L.m;
    const m = buildMachine(build);
    if (prev) {
      const landed = [];
      for (const [slot, p] of Object.entries(m.fitted)) if (prev.fitted[slot]?.code !== p.code) { L.anim[p.g] = L.t; landed.push(slot); }
      if (landed.length) setFlashes((f) => [...f, ...landed.map((slot) => ({ slot, key: `${slot}-${Date.now()}` }))]);
      m.token.pos = [...prev.token.pos];
    }
    L.m = m;
    L.R = createRenderer(canvasRef.current, m.model);
    layout();
    invalidate();
  }, [build]);

  useEffect(() => { live.current.leftPad = leftPad; layout(); }, [leftPad]);

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
    if (running && RED.has(current?.verdict) && !STATIC) setShake((n) => n + 1);
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
    const pad = L.mobile ? { l: 18, r: 92, t: 30, b: 70 } : { l: L.leftPad + 130, r: 230, t: 30, b: 70 };
    const v = fitView(L.m.model.parts.filter((p) => !p.tokenPart), L.yaw, L.cw, L.ch, pad);
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
      // q[g] seats each renderer group: 0 = exploded ghost, 1 = in place.
      const q = new Array(GROUPS).fill(STATIC || L.intro ? 1 : 0);
      for (const [g, t0] of Object.entries(L.anim)) q[g] = STATIC ? 1 : clamp((t - t0) / 0.8);
      R.draw({
        d: 0, g1: 1, g2: 1, q, F: 1, W: 1, Rk: 0, mx: 0, mk: 0, pulse: 0, mAlpha: 1, G: 0,
        dimA: 0, dimProg: 0, hl: [0, 0, 0, 0, 0, 0, 0, 0], filter: (p) => L.running || !p.tokenPart,
        cables: [], labels: false, mobile: L.mobile, static: STATIC,
      }, view, t);
      if (L.snap) { L.snap = false; setSnap({ a: { ...R.anchors }, cw: L.cw, ch: L.ch, mobile: L.mobile }); }
    };
    const off = onFrame(frame);
    // First time the drawing is on screen: the rail rises, then the modules drop
    // in one by one, then the branches. Group numbers come from machineModel.
    const io = typeof IntersectionObserver === 'function' && !STATIC ? new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || L.intro) return;
      L.intro = true;
      const t = L.t;
      L.anim[10] = t;
      for (let i = 0; i < 6; i++) L.anim[11 + i] = t + 0.35 + i * 0.09;
      for (let j = 0; j < 4; j++) L.anim[20 + j] = t + 0.95 + j * 0.07;
      L.anim[26] = t + 1.2;
      setTimeout(() => setReady(true), 1250);
      io.disconnect();
    }, { threshold: 0.5 }) : null;
    if (io) io.observe(wrapRef.current); else { L.intro = true; setReady(true); }
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(layout) : null;
    ro?.observe(wrapRef.current);
    window.addEventListener('resize', layout);
    document.fonts?.ready.then(layout);
    return () => { off(); io?.disconnect(); ro?.disconnect(); window.removeEventListener('resize', layout); };
  }, []);

  const a = snap.a;
  const at = (k) => a[k] || null;
  const fits = (code) => selected && partByCode(selected)?.slot === code;

  // the stops the request has made, in order (answers excluded)
  const stops = revealed.filter((e) => e.kind !== 'answer' && e.step);
  const trail = [];
  for (let i = 1; i < stops.length; i++) {
    const pa = at(`slot:${stops[i - 1].step}`), pb = at(`slot:${stops[i].step}`);
    if (pa && pb && stops[i - 1].step !== stops[i].step) trail.push({ key: stops[i].id, a: pa, b: pb, red: RED.has(stops[i].verdict) });
  }
  // one marker per step code (the latest event there), numbered by first visit
  const markers = [];
  const seen = new Map();
  stops.forEach((e) => {
    if (!seen.has(e.step)) { seen.set(e.step, markers.length); markers.push({ step: e.step, n: markers.length + 1, e }); }
    else markers[seen.get(e.step)].e = e;
  });
  const cur = current && current.kind !== 'answer' && current.step ? current : null;
  const curAt = cur && at(`slot:${cur.step}`);

  // module status for the timeline
  const status = MODULES.map((code) => {
    const evs = stops.filter((e) => e.step === code);
    if (!evs.length) return 'todo';
    if (evs.some((e) => RED.has(e.verdict))) return 'red';
    return 'done';
  });

  const dimA = at('dimA'), dimB = at('dimB');
  const dimAngle = dimA && dimB ? (Math.atan2(dimB[1] - dimA[1], dimB[0] - dimA[0]) * 180) / Math.PI : 0;

  return (
    <div className={`wb-stage${shake ? ` is-shake-${shake % 2}` : ''}`} ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <svg className={`wb-ov${ready ? ' is-ready' : ''}`} width={snap.cw} height={snap.ch} aria-hidden="true">
        {/* dimension line in front of the rail */}
        {dimA && dimB && (
          <g className="wb-dim">
            <line x1={dimA[0]} y1={dimA[1]} x2={dimB[0]} y2={dimB[1]} />
            {[dimA, dimB].map((p, i) => <line key={i} className="t" x1={p[0] - 5} y1={p[1] + 5} x2={p[0] + 5} y2={p[1] - 5} />)}
            <text x={(dimA[0] + dimB[0]) / 2} y={(dimA[1] + dimB[1]) / 2 + 18} transform={`rotate(${dimAngle} ${(dimA[0] + dimB[0]) / 2} ${(dimA[1] + dimB[1]) / 2 + 18})`} textAnchor="middle">
              RAIL 13.4 U · 6 MODULES · {build.branches.length} OF 5 GUARDRAILS
            </text>
          </g>
        )}

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
          const evs = stops.filter((e) => e.step === code);
          const tone = cur?.step === code ? (RED.has(cur.verdict) ? 'red' : 'on') : evs.some((e) => RED.has(e.verdict)) ? 'red' : part.shortcut ? 'short' : '';
          return <Label key={code} p={p} code={code} name={part.name} dir="l" drop tone={tone} />;
        })}
        {BRANCHES.map((code) => {
          const p = at(`label:${code}`); if (!p) return null;
          const fitted = build.branches.includes(code);
          const tone = fits(code) ? 'on' : cur?.step === code ? 'on' : fitted ? '' : 'empty';
          return <Label key={code} p={p} code={code} name={snap.mobile ? (fitted ? '' : 'empty') : `${slotByCode(code).name}${fitted ? '' : ' · empty'}`} dir="r" drop={code === 'G-05'} tone={tone} />;
        })}

        {/* the route the request has taken, drawn in as it goes */}
        {trail.map((t) => (
          <g key={t.key} className={`wb-trail${t.red ? ' is-red' : ''}`}>
            <line className="glow" x1={t.a[0]} y1={t.a[1]} x2={t.b[0]} y2={t.b[1]} pathLength="1" />
            <line x1={t.a[0]} y1={t.a[1]} x2={t.b[0]} y2={t.b[1]} pathLength="1" />
          </g>
        ))}
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

      {/* square step markers along the route */}
      {markers.map(({ step, n, e }) => {
        const p = at(`slot:${step}`); if (!p) return null;
        return (
          <button
            key={step}
            type="button"
            className={`wb-mk mono v-${e.verdict}${cur?.step === step ? ' is-cur' : ''}`}
            style={{ left: p[0], top: p[1] - 4 }}
            onClick={() => onMarker(e.id)}
            aria-label={`Step ${n}, ${slotByCode(step).name}: ${e.summary}. Open in inspector`}
          >{n}</button>
        );
      })}

      {flashes.map((f) => {
        const p = at(`slot:${f.slot}`); if (!p) return null;
        return <span key={f.key} className="wb-ring" style={{ left: p[0], top: p[1] + 30 }} onAnimationEnd={() => setFlashes((all) => all.filter((x) => x.key !== f.key))} aria-hidden="true" />;
      })}
      {cur && curAt && RED.has(cur.verdict) && !STATIC && (
        <span key={`rip-${cur.id}`} className="wb-ripple" style={{ left: curAt[0], top: curAt[1] + 30 }} aria-hidden="true" />
      )}
      {cur && curAt && cur.verdict === 'leaked' && !STATIC && (
        <span key={`spill-${cur.id}`} className="wb-spill" style={{ left: curAt[0], top: curAt[1] + 20 }} aria-hidden="true">
          {SPILL.map((d, i) => <i key={i} style={{ '--dx': `${d.dx}px`, '--dy': `${d.dy}px`, '--d': `${d.d}ms`, '--s': `${d.s}px` }} />)}
        </span>
      )}

      {/* step timeline and title block, under the drawing */}
      <div className="wb-under" style={snap.mobile ? undefined : { left: leftPad + 60 }}>
        <ol className="wb-tl mono" aria-label="Steps">
          {MODULES.map((code, i) => (
            <li key={code} className={`is-${status[i]}${cur?.step === code ? ' is-cur' : ''}`}>
              <i aria-hidden="true" /><span>0{i + 1} {STEP_NAMES[i]}</span>
            </li>
          ))}
        </ol>
        <div className="wb-tb mono" aria-label="Drawing title block">
          <div><span>DWG</span><b>W-01</b></div>
          <div className="w"><span>SUBJECT</span><b>NORTHWIND · DATA AGENT</b></div>
          <div><span>STATE</span><b className="st">{stateLabel}</b></div>
          <div><span>REV</span><b>A</b></div>
        </div>
      </div>
    </div>
  );
}
