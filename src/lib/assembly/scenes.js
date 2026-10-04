// Scene state: pure functions from scroll position (plus an idle clock) to the
// values the renderer needs. Everything is eased and reversible; nothing here
// keeps history except the caller's eased scroll value.
import { clamp, sm, lin, lerp, backOut } from './math.js';
import { SETS } from './machine.js';

/* ------------------------------------------------------------- home page */

// Document-space tops of the scroll scenes, read from [data-scene] elements.
export function readLayout() {
  const top = (el) => el.getBoundingClientRect().top + window.scrollY;
  const q = (name) => document.querySelector(`[data-scene="${name}"]`);
  const L = { svc: [] };
  const get = (name) => { const el = q(name); return el ? top(el) : 0; };
  L.prob1 = get('p1'); L.prob2 = get('p2');
  for (let i = 0; i < 4; i++) L.svc.push(get('svc' + i));
  const pr = q('process'), pc = q('principles'), cl = q('closing');
  L.proc = { top: pr ? top(pr) : 0, h: pr ? pr.offsetHeight : 1 };
  L.princ = { top: pc ? top(pc) : 0, h: pc ? pc.offsetHeight : 1 };
  L.work = get('work'); L.lab = get('lab');
  L.close = cl ? top(cl) : 0; L.closeH = cl ? cl.offsetHeight : 1;
  return L;
}

const FINISHED = {
  d: 0, g1: 0, g2: 0, q: [1, 1, 1, 1], pe: 1, P: 1, F: 1, W: 1, Rk: 0, mx: 0, mAlpha: 1, cl: 0, mk: 0, pulse: 0,
  labA: 0, hide: 0, hlg: -1, pr: 0, yawX: 0, G: 0, dimA: 0, dimProg: 0, static: true, top: 0, Vh: 800,
};

/**
 * y        eased scroll position
 * L        layout from readLayout()
 * env      { mobile, bandH, H, static }
 */
export function homeState(y, L, env) {
  if (env.static) return { ...FINISHED, q: [1, 1, 1, 1] };
  const s = {};
  const top = env.mobile ? env.bandH : 0, Vh = env.mobile ? env.H - env.bandH : env.H;
  const bp = (dt) => clamp((top + Vh * 0.92 - (dt - y)) / (Vh * 0.5));
  s.top = top; s.Vh = Vh; s.static = false;
  s.d = clamp(y / (Vh * 0.9));
  s.g1 = bp(L.prob1); s.g2 = bp(L.prob2);
  s.q = L.svc.map(bp);
  s.pe = clamp((top + Vh - (L.proc.top - y)) / (Vh * 0.9));
  const P = clamp((y - L.proc.top) / Math.max(1, L.proc.h - Vh)); s.P = P;
  s.F = s.pe < 1 ? 1 - sm(s.pe) : (P < 0.5 ? 0.55 * sm(lin(P, 0.22, 0.5)) : 0.55 + 0.45 * sm(lin(P, 0.5, 0.62)));
  s.W = sm(lin(P, 0.52, 0.7));
  s.G = s.pe >= 1 ? 1 - sm(s.F * 1.7) : (s.pe > 0 ? sm(s.pe) * (1 - sm(s.F * 1.7)) : 0);
  s.labA = sm((top + Vh * 0.9 - (L.work - y)) / (Vh * 0.6));
  const restore = clamp((top + Vh * 0.65 - (L.close - y)) / (Vh * 0.6));
  s.hide = s.labA * (1 - restore);
  s.mAlpha = 1 - s.hide;
  s.Rk = sm(lin(P, 0.7, 0.8)) * (1 - sm(s.labA * 1.3));
  s.mx = 6.5 * sm(lin(P, 0.7, 0.78)) * (1 - backOut(lin(P, 0.8, 1)));
  const st = L.close - Vh * 0.6, en = L.close + L.closeH - Vh;
  s.cl = clamp((y - st) / Math.max(1, en - st));
  s.mk = sm(lin(s.cl, 0.58, 0.9)); s.pulse = lin(s.cl, 0.4, 0.62);
  s.yawX = -0.62 * s.labA * (1 - sm(lin(s.cl, 0.02, 0.5)));
  s.pr = clamp((y - L.princ.top) / Math.max(1, L.princ.h - Vh));
  s.hlg = (y > L.princ.top - Vh * 0.2 && y < L.princ.top + L.princ.h - Vh * 0.6) ? [1, 0, 3, 2][Math.min(3, Math.floor(s.pr * 4))] : -1;
  s.dimA = 1 - s.g1; s.dimProg = sm(s.d * 1.8 - 0.05);
  return s;
}


/** Camera for the home stage, in device pixels. cw/ch are css px. */
export function homeView(s, cw, ch, dpr, mobile, t) {
  const Sbase = Math.min(cw / 21, (mobile ? ch - 54 : ch) / (mobile ? 23 : 24)) * dpr;
  const [q0, q1, q2, q3] = s.q;
  const aM = (q0 + q1 + q2 + q3) / 4;
  const uu = 0.25 * q0 + 0.15 * q1 + 0.2 * q2 + 0.4 * q3;
  const scaleK = (lerp(0.74, 1, uu) - 0.05 * s.d * (1 - uu)) * (1 - 0.1 * s.Rk) * (1 + 0.1 * s.mk) * (1 - 0.18 * (s.hide || 0));
  const idle = s.static ? 0 : Math.sin(t * 0.28) * 0.07;
  return {
    cx: cw * dpr * 0.5,
    cy: (mobile ? 54 + (ch - 54) * 0.5 : ch * 0.52) * dpr,
    S: Sbase * scaleK,
    zc: lerp(lerp(2.8, 3.1, 1 - aM), 5.4, s.mk),
    yaw: idle + s.yawX,
  };
}

/* ---------------------------------------------------------- PartDrawing */

const NONE = { d: 0, g1: 0, g2: 0, Rk: 0, mx: 0, mAlpha: 1, mk: 0, pulse: 0, G: 0, dimA: 0, dimProg: 0, F: 1, hl: [0, 0, 0, 0] };

/**
 * One subassembly on an inner page. p is page scroll progress 0..1, boot is a
 * 0..1 time ramp since arrival, so the part is never fully exploded when you
 * land and assembles the further you read.
 */
export function partScene(setName, p, boot, isStatic) {
  const set = SETS[setName] || SETS.machine;
  const a = isStatic ? 1 : clamp(0.1 + boot * 0.3 + p * 1.7);
  const q = [0, 0, 0, 0];
  set.groups.forEach((g) => { q[g] = a; });
  return { ...NONE, q, W: set.power ? sm(lin(a, 0.7, 1)) : 0, filter: set.filter, cables: set.cables, static: isStatic, labels: true, mobile: false, hl: [0, 0, 0, 0] };
}

export function partView(setName, p, cw, ch, dpr, t, isStatic) {
  const set = SETS[setName] || SETS.machine;
  const [zc, span] = set.view;
  const S = Math.min(cw / (span * 0.78), ch / (span * 1.25)) * dpr;
  const yaw = isStatic ? 0 : -0.35 + p * 0.7 + Math.sin(t * 0.25) * 0.05;
  return { cx: cw * dpr * 0.5, cy: ch * dpr * 0.52, S, zc, yaw };
}
