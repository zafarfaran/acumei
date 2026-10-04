import { useEffect, useRef } from 'react';
import { createRenderer } from '../../lib/assembly/renderer';
import { parts } from '../../lib/assembly/machine';
import { clamp, sm, lin } from '../../lib/assembly/math';
import { onFrame, invalidate, STATIC, initialScrollY } from '../../lib/motion';

const NS = 'http://www.w3.org/2000/svg';

// Six build steps, AI first. The agent descriptions come from the owner; the
// platform facts are trimmed from the original case-study copy.
const STEPS = [
  { name: 'ISOLATION', t: 'Every business sealed off', p: 'Row-Level Security on all 47 tenant-scoped tables, so anything built on top only ever sees one business’s data.', at: [-3.7, 3.7, 0] },
  { name: 'LIVE DATA', t: 'Feedback that arrives in real time', p: 'Changes stream to the dashboard over Server-Sent Events, with an Organisation → Location → Team hierarchy that keeps its history.', at: [-3, 3, 1.5] },
  { name: 'ANALYSIS AGENT', t: 'A scoped AI agent that does the analysis', p: 'An agent works through each business’s feedback and does the analysis for the owner, scoped to that one business.', at: [-1.2, 1.2, 4.0] },
  { name: 'GUARDRAILS', t: 'Summaries, not people', p: 'Responses are designed around aggregate figures. Individual customer data is excluded from what the agents say.', at: [-3.5, 3.7, 6.43] },
  { name: 'WHATSAPP AGENT', t: 'A WhatsApp agent for the owner', p: 'Through the Meta API, owners get alerts and can simply ask about their own figures in a conversation.', at: [-4.1, 0, 3.5] },
  { name: 'ACCOUNTABILITY', t: 'Every sensitive action on the record', p: 'A cryptographically chained audit log makes tampering detectable. The system powers in.', at: [3.7, 3.7, 6.875] },
];

// Renderer group used by each step (group 3 owns the cables, so the final step takes it).
const GROUP = [0, 1, 2, 6, 5, 3];
const N = STEPS.length;

export default function BuildScene({ children }) {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const stageRef = useRef(null);
  const listRef = useRef(null);
  const heroRef = useRef(null);
  const progRef = useRef(null);
  const figRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current, canvas = canvasRef.current, svg = svgRef.current;
    const lis = [...listRef.current.children];
    const ticks = [...progRef.current.children];
    const R = createRenderer(canvas);

    // Re-label the shared part list into this scene's six steps; restored on unmount.
    const saved = parts.map((p) => p.g);
    const o = parts.findIndex((p) => p.label === 'P-01');
    parts.forEach((p, i) => {
      let k = -1;
      if (p.g === 0) k = 1;
      else if (p.g === 1) k = 2;
      else if (p.g === 2) k = 4;
      else if (p.g === 3) { const j = i - o; k = j <= 4 ? 0 : j <= 9 ? 3 : 5; }
      if (k >= 0) p.g = GROUP[k];
    });
    const filter = (p) => p.g !== 4;

    let flow = false, cw = 0, ch = 0, top = 0, h = 1, H = 0, W = 0;
    let shown = 0, snap = false, intro = STATIC ? 1 : 0, lastT = 0, n2 = 0;
    const leader = (() => {
      const g = document.createElementNS(NS, 'g'), a = document.createElementNS(NS, 'path'), b = document.createElementNS(NS, 'path'), c = document.createElementNS(NS, 'circle');
      a.setAttribute('class', 'halo'); c.setAttribute('r', 3.2);
      g.append(a, b, c); svg.append(g);
      return { a, b, c, g, v: 0 };
    })();

    function layout() {
      W = window.innerWidth; H = window.innerHeight;
      flow = STATIC || W <= 820;
      const r = canvas.getBoundingClientRect();
      cw = Math.round(r.width); ch = Math.round(r.height);
      R.resize(cw, ch, window.devicePixelRatio || 1);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      top = scene.getBoundingClientRect().top + window.scrollY; h = scene.offsetHeight;
      if (STATIC) invalidate();
    }

    // B: 0..N build progress, plus the per-step seat values qs[k] and active index.
    function progress(y) {
      const qs = new Array(N).fill(0);
      if (STATIC) return { qs: qs.fill(1), B: N, on: lis.map(() => 1), hero: 1, act: N - 1 };
      if (flow) {
        lis.forEach((li, k) => { const r = li.getBoundingClientRect(); qs[k] = clamp((H * 0.74 - r.top) / (H * 0.3)); });
        const act = Math.max(0, qs.reduce((a, v, k) => (v > 0.5 ? k : a), 0));
        return { qs, B: qs.reduce((a, v) => a + v, 0), on: lis.map((_, k) => (k === act ? 1 : 0.55)), hero: 1, act };
      }
      const P = clamp((y - top) / Math.max(1, h - H));
      const B = lin(P, 0.1, 0.95) * N;
      for (let k = 0; k < N; k++) qs[k] = sm(lin(B, k + 0.02, k + 0.72));
      const gate = sm(lin(P, 0.06, 0.12));
      const on = lis.map((_, k) => {
        let d = Math.abs(B - (k + 0.5));
        if ((k === 0 && B < 0.5) || (k === N - 1 && B > N - 0.5)) d = 0;
        // fully out before the next step comes in: a clean gap around each boundary
        return sm(clamp((0.5 - d) / 0.05)) * gate;
      });
      return { qs, B, on, hero: 1 - sm(lin(P, 0.02, 0.08)), act: Math.min(N - 1, Math.floor(B)), P };
    }

    const hideLeader = () => {
      for (const n of [leader.a, leader.b]) { n.style.strokeDasharray = '9999'; n.style.strokeDashoffset = '9999'; }
      leader.c.style.opacity = 0;
    };
    const dash = (d, a) => {
      for (const n of [leader.a, leader.b]) {
        n.setAttribute('d', d);
        const l = leader.b.getTotalLength() + 1;
        n.style.strokeDasharray = l; n.style.strokeDashoffset = (l * (1 - a)).toFixed(1);
      }
    };

    function frame(t) {
      const y = window.scrollY;
      if (snap || STATIC) { shown = y; snap = false; } else { shown += (y - shown) * 0.18; if (Math.abs(y - shown) < 0.3) shown = y; }
      if (intro < 1) intro = Math.min(1, intro + Math.max(0, t - lastT) / 1.2);
      lastT = t; n2++;
      const s = progress(shown);

      // text
      lis.forEach((li, k) => {
        li.style.setProperty('--on', s.on[k].toFixed(3));
        li.style.setProperty('--sh', ((k + 0.5 - s.B) * 12).toFixed(1) + 'px');
        li.classList.toggle('is-act', k === s.act);
      });
      progRef.current.style.opacity = (STATIC || flow ? 1 : 1 - s.hero).toFixed(3);
      ticks.forEach((tk, k) => tk.style.setProperty('--f', s.qs[k].toFixed(3)));
      if (heroRef.current) heroRef.current.style.setProperty('--hero', (STATIC || flow ? 1 : s.hero * sm(intro)).toFixed(3));
      if (figRef.current) {
        const html = s.B <= 0.02 && !STATIC ? '<b>FIG. 01</b> · EXPLODED VIEW' : s.B >= N - 0.05 ? '<b>FIG. 02</b> · ASSEMBLED' : `<b>FIG. 02</b> · STEP ${String(s.act + 1).padStart(2, '0')} / 06`;
        if (figRef.current.dataset.h !== html) { figRef.current.innerHTML = html; figRef.current.dataset.h = html; }
      }

      // machine
      if (!STATIC && (n2 & 1) && intro >= 1) { /* 30fps is plenty */ } else if (cw && ch) {
        const q = new Array(8).fill(0);
        for (let k = 0; k < N; k++) q[GROUP[k]] = s.qs[k];
        const Wp = STATIC ? 1 : sm(lin(s.B, N - 0.55, N - 0.1));
        const st = {
          d: 0, g1: STATIC ? 0 : 1, g2: 1, q, F: 1, W: Wp, Rk: 0, mx: 0, mk: 0, pulse: 0, mAlpha: STATIC ? 1 : sm(intro),
          G: 0.65, dimA: 0, dimProg: 0, hl: new Array(8).fill(0), filter, cables: [0, 1, 2, 3], labels: !flow, mobile: false, static: STATIC,
        };
        const dpr = R.dpr;
        const Sc = Math.min(cw / 21, ch / 24);
        const yaw = STATIC ? 0 : -0.28 + 0.07 * s.B + Math.sin(t * 0.28) * 0.05;
        const view = { cx: cw * dpr * 0.5, cy: ch * dpr * 0.54, S: Sc * dpr, zc: 2.8, yaw };
        R.draw(st, view, t);

        // leader from the active text block to the part being seated
        if (!flow) {
          const k = s.act, c = Math.cos(yaw), sn = Math.sin(yaw);
          const [x, yy, z] = STEPS[k].at;
          const xr = x * c - yy * sn, yr = x * sn + yy * c;
          const cr = canvas.getBoundingClientRect();
          const px = cr.left + cw * 0.5 + (xr - yr) * 0.866 * Sc, py = cr.top + ch * 0.54 + (xr + yr) * 0.5 * Sc - (z - 2.8) * Sc;
          const lr = lis[k].getBoundingClientRect();
          const target = (s.P > 0.17 && s.P < 0.985 ? s.on[k] : 0) * (s.qs[k] > 0.25 ? 1 : 0);
          leader.v += (target - leader.v) * 0.2;
          const a = leader.v < 0.02 ? 0 : leader.v;
          if (a === 0) { hideLeader(); } else {
            const x0 = lr.right + 14, y0 = lr.top + 18;
            const jx = Math.max(x0 + 30, px - Math.abs(py - y0));
            dash(`M${x0} ${y0} H${jx} L${px} ${py}`, a);
            leader.c.setAttribute('cx', px); leader.c.setAttribute('cy', py); leader.c.style.opacity = clamp((a - 0.8) * 5);
          }
        } else hideLeader();
      }
    }

    layout();
    const qy = initialScrollY();
    if (qy != null) { window.scrollTo({ top: qy, left: 0, behavior: 'instant' }); intro = 1; snap = true; }
    shown = window.scrollY;
    const off = onFrame(frame);
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(layout) : null;
    ro?.observe(document.body);
    document.fonts?.ready.then(layout);

    return () => {
      off(); ro?.disconnect();
      window.removeEventListener('resize', onResize); window.removeEventListener('load', onResize);
      leader.g.remove();
      parts.forEach((p, i) => { p.g = saved[i]; });
    };
  }, []);

  return (
    <section className="pm-scene" ref={sceneRef} aria-label="The build, step by step">
      <div className="pm-stick">
        <div className="pm-stage">
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="pm-fig mono" aria-hidden="true">
            <div>DWG <b>W4-PREMO</b></div><div ref={figRef}><b>FIG. 01</b> · EXPLODED VIEW</div>
          </div>
        </div>
        <svg className="pm-leaders" ref={svgRef} aria-hidden="true" />

        <div className="pm-hero" ref={heroRef}>{children}</div>

        <div className="pm-txt">
          <div className="pm-prog" ref={progRef} aria-hidden="true">{STEPS.map((s) => <i key={s.name} />)}</div>
          <ol className="pm-steps" ref={listRef}>
            {STEPS.map((s, k) => (
              <li key={s.name}>
                <div className="pm-k mono">STEP <b>{String(k + 1).padStart(2, '0')}</b> / 06 · {s.name}</div>
                <h2>{s.t}</h2>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
