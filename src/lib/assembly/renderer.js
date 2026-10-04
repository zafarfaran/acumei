// Canvas renderer for the machine: own isometric projection, painter's-algorithm
// depth sort, Bayer 4x4 dithered faces (top light, left mid, right dark), crisp
// 1px hairline edges, amber power. No libraries.
import { clamp, sm, lin, lerp, backOut, hash, BAYER, BG, CREAM, GREY, AMB, mix } from './math.js';
import { machineModel } from './machine.js';

const NL = 10; // dither density levels
const NC = 28; // cylinder segments

// A model is { parts, cables, rack, demo, byLabel, lamp, lens, anchors? }; the home machine is the default.
export function createRenderer(canvas, model = machineModel) {
  const { parts, demo, byLabel, rack: RACK, lamp: LAMP, lens: LENS } = model;
  const CABLES = model.cables;
  const ctx = canvas.getContext('2d');
  let dpr = 1, cw = 0, ch = 0;
  const PAT = { cream: [], amber: [], grey: [] };
  const cam = { cx: 0, cy: 0, S: 30, zc: 2.8, yaw: 0 };
  const yawM = { c: 1, s: 0 };
  const scr = parts.map(() => [0, 0]); // projected centre of each part, device px
  const expl = parts.map(() => 0); // how exploded each part is, 0..1
  const anchors = {}; // css px, relative to the canvas

  function buildPatterns() {
    const cell = Math.max(2, Math.round(3 * dpr)), dot = Math.max(1, Math.round(2 * dpr));
    const cols = { cream: 'rgba(241,237,228,0.95)', amber: 'rgba(232,160,75,0.95)', grey: 'rgba(155,149,138,0.9)' };
    for (const k in cols) {
      PAT[k] = [];
      for (let lv = 0; lv <= NL; lv++) {
        const c = document.createElement('canvas'); c.width = c.height = cell * 4;
        const g = c.getContext('2d'); g.fillStyle = cols[k];
        for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if (lv / NL > BAYER[y][x]) g.fillRect(x * cell, y * cell, dot, dot);
        PAT[k][lv] = lv ? ctx.createPattern(c, 'repeat') : null;
      }
    }
  }

  function resize(cssW, cssH, ratio) {
    dpr = Math.min(2, ratio || 1); cw = cssW; ch = cssH;
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    buildPatterns();
  }

  function pj(x, y, z) {
    const xr = x * yawM.c - y * yawM.s, yr = x * yawM.s + y * yawM.c;
    return [cam.cx + (xr - yr) * 0.866 * cam.S, cam.cy + (xr + yr) * 0.5 * cam.S - (z - cam.zc) * cam.S];
  }

  /* ----------------------------------------------------------- primitives */
  function face(pts, dens, st, evenodd, extra) {
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { if (i) ctx.lineTo(pts[i][0], pts[i][1]); else ctx.moveTo(pts[i][0], pts[i][1]); }
    ctx.closePath();
    if (extra) {
      ctx.moveTo(extra[0][0], extra[0][1]);
      for (let i = 1; i < extra.length; i++) ctx.lineTo(extra[i][0], extra[i][1]);
      ctx.closePath();
    }
    const rule = evenodd ? 'evenodd' : 'nonzero';
    ctx.globalAlpha = st.alpha; ctx.fillStyle = BG; ctx.fill(rule);
    const lv = Math.round(clamp(dens) * NL);
    if (lv > 0) { ctx.fillStyle = PAT[st.col][lv]; ctx.fill(rule); }
    ctx.globalAlpha = st.alpha * st.edge; ctx.strokeStyle = st.ec; ctx.lineWidth = st.lw; ctx.stroke();
  }

  function drawBox(p, pos, st) {
    const [x, y, z] = pos, [w, d, h] = p.size, a = w / 2, b = d / 2, c = h / 2;
    const sh = p.shine ? 1.15 : 1;
    const T = [pj(x - a, y - b, z + c), pj(x + a, y - b, z + c), pj(x + a, y + b, z + c), pj(x - a, y + b, z + c)];
    const R = [pj(x + a, y - b, z + c), pj(x + a, y + b, z + c), pj(x + a, y + b, z - c), pj(x + a, y - b, z - c)];
    const Lf = [pj(x - a, y + b, z + c), pj(x + a, y + b, z + c), pj(x + a, y + b, z - c), pj(x - a, y + b, z - c)];
    const f = st.fill * (st.hlBoost || 1);
    face(Lf, 0.5 * f * sh, st); face(R, 0.22 * f * sh, st); face(T, 0.9 * f * sh, st);
    if (p.shine && st.fill > 0.5) {
      ctx.globalAlpha = st.alpha * 0.9; ctx.strokeStyle = 'rgb(241,237,228)'; ctx.lineWidth = 1.5 * dpr;
      const g1 = pj(x - a * 0.2, y - b * 0.55, z + c), g2 = pj(x + a * 0.55, y - b * 0.55, z + c);
      ctx.beginPath(); ctx.moveTo(g1[0], g1[1]); ctx.lineTo(g2[0], g2[1]); ctx.stroke();
    }
  }

  function drawCyl(p, pos, st, ring) {
    const [x, y, z] = pos, r = p.r, h = p.h, zt = z + h / 2, zb = z - h / 2;
    const top = [], bot = [], vis = [], nm = [];
    for (let i = 0; i < NC; i++) {
      const a = i / NC * Math.PI * 2;
      top.push(pj(x + r * Math.cos(a), y + r * Math.sin(a), zt));
      bot.push(pj(x + r * Math.cos(a), y + r * Math.sin(a), zb));
    }
    for (let i = 0; i < NC; i++) {
      const am = (i + 0.5) / NC * Math.PI * 2 + cam.yaw, nx = Math.cos(am), ny = Math.sin(am);
      vis.push(nx + ny > 0); nm.push((ny - nx) / 1.414);
    }
    let s0 = -1;
    for (let i = 0; i < NC; i++) if (vis[i] && !vis[(i + NC - 1) % NC]) { s0 = i; break; }
    const f = st.fill * (st.hlBoost || 1);
    const run = [];
    if (s0 >= 0) for (let k = 0; k < NC && vis[(s0 + k) % NC]; k++) run.push((s0 + k) % NC);
    if (run.length) {
      const sil = [];
      run.forEach((i) => sil.push(top[i]));
      const last = (run[run.length - 1] + 1) % NC;
      sil.push(top[last], bot[last]);
      for (let k = run.length - 1; k >= 0; k--) sil.push(bot[run[k]]);
      ctx.beginPath(); sil.forEach((q, i) => { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath();
      ctx.globalAlpha = st.alpha; ctx.fillStyle = BG; ctx.fill();
      for (const i of run) {
        const j = (i + 1) % NC;
        const spec = p.shine ? Math.exp(-Math.pow(nm[i] - 0.18, 2) / 0.025) * 0.28 : 0;
        const dn = (0.36 + 0.26 * nm[i] + spec) * f * (p.shine ? 1.1 : 1);
        const lv = Math.round(clamp(dn) * NL);
        if (lv > 0) {
          ctx.beginPath(); ctx.moveTo(top[i][0], top[i][1]); ctx.lineTo(top[j][0], top[j][1]); ctx.lineTo(bot[j][0], bot[j][1]); ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath();
          ctx.globalAlpha = st.alpha; ctx.fillStyle = PAT[st.col][lv]; ctx.fill();
        }
      }
      ctx.globalAlpha = st.alpha * st.edge; ctx.strokeStyle = st.ec; ctx.lineWidth = st.lw;
      ctx.beginPath(); sil.forEach((q, i) => { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.stroke();
    }
    if (ring) {
      const inner = [];
      for (let i = 0; i < NC; i++) { const a = i / NC * Math.PI * 2; inner.push(pj(x + p.rIn * Math.cos(a), y + p.rIn * Math.sin(a), zt)); }
      face(top, 0.86 * f, st, true, inner);
    } else face(top, (p.lens ? 0.9 : 0.86) * f, st);
  }

  function glow(x, y, r, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(232,160,75,${a})`); g.addColorStop(1, 'rgba(232,160,75,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  function line(a, b, col, alpha, lw) {
    ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = lw || dpr;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  function txt(s, x, y, alpha, col, size, align) {
    ctx.globalAlpha = alpha; ctx.fillStyle = col || '#f1ede4';
    ctx.font = `${(size || 9.5) * dpr}px "JetBrains Mono",monospace`; ctx.textAlign = align || 'left';
    ctx.fillText(s, x, y);
  }

  function dimLine(a, b, off, label, prog, alpha, up) {
    if (prog <= 0 || alpha <= 0.01) return;
    const A = pj(...a), B = pj(...b);
    const A2 = pj(a[0] + off[0], a[1] + off[1], a[2] + off[2]), B2 = pj(b[0] + off[0], b[1] + off[1], b[2] + off[2]);
    const col = '#f1ede4';
    line(A, A2, col, alpha * 0.5 * Math.min(1, prog * 3)); line(B, B2, col, alpha * 0.5 * clamp(prog * 3 - 1.6));
    const E = [lerp(A2[0], B2[0], prog), lerp(A2[1], B2[1], prog)];
    line(A2, E, col, alpha * 0.9);
    const tk = 5 * dpr;
    line([A2[0] - tk, A2[1] + tk], [A2[0] + tk, A2[1] - tk], col, alpha);
    if (prog > 0.98) line([B2[0] - tk, B2[1] + tk], [B2[0] + tk, B2[1] - tk], col, alpha);
    if (prog > 0.9) txt(label, (A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2 + (up ? -9 : 16) * dpr, alpha * clamp((prog - 0.9) * 10), col, 9.5, 'center');
  }

  function cablePath(c, f) {
    const target = c.len * f; ctx.beginPath(); let started = false;
    for (let i = 0; i < c.pts.length; i++) {
      if (c.cum[i] > target && i > 0) {
        const t = (target - c.cum[i - 1]) / (c.cum[i] - c.cum[i - 1]); const a = c.pts[i - 1], b = c.pts[i];
        const q = pj(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)); ctx.lineTo(q[0], q[1]); return;
      }
      const q = pj(...c.pts[i]);
      if (started) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
      started = true;
    }
  }
  function pointAt(c, u) {
    const target = c.len * u;
    for (let i = 1; i < c.pts.length; i++) if (c.cum[i] >= target) {
      const t = (target - c.cum[i - 1]) / (c.cum[i] - c.cum[i - 1]); const a = c.pts[i - 1], b = c.pts[i];
      return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
    }
    return c.pts[c.pts.length - 1];
  }
  function drawCable(c, f, W, t, alpha) {
    if (f <= 0.01) return;
    cablePath(c, f); ctx.globalAlpha = alpha; ctx.strokeStyle = '#26241f'; ctx.lineWidth = 4 * dpr; ctx.lineJoin = 'round'; ctx.stroke();
    cablePath(c, f); ctx.globalAlpha = alpha * 0.8; ctx.strokeStyle = 'rgba(241,237,228,0.75)'; ctx.lineWidth = dpr; ctx.stroke();
    if (W > 0.02 && f > 0.98) {
      const u0 = (t * 0.32 + c.ph) % 1, segs = 14;
      for (let k = 0; k < segs; k++) {
        const u1 = u0 - k * 0.012; if (u1 < 0) break;
        const q = pj(...pointAt(c, u1));
        ctx.globalAlpha = alpha * W * (1 - k / segs); ctx.fillStyle = 'rgb(232,160,75)'; ctx.beginPath(); ctx.arc(q[0], q[1], (2.4 - k * 0.1) * dpr, 0, 7); ctx.fill();
      }
      cablePath(c, 1); ctx.globalAlpha = alpha * W * 0.35; ctx.strokeStyle = 'rgb(232,160,75)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke();
    }
  }

  function makeRack(Rk, mxAmt, W) {
    if (Rk < 0.01) return null;
    const { k: RK, z0, z1 } = RACK;
    const col = '#f1ede4', a = Rk;
    const seg = (p, q, al, lw) => line(pj(...p), pj(...q), col, a * al, lw);
    return {
      back() {
        for (const z of [z0, z1]) { seg([-RK, -RK, z], [RK, -RK, z], 0.5); seg([-RK, -RK, z], [-RK, RK, z], 0.5); }
        seg([-RK, -RK, z0], [-RK, -RK, z1], 0.5); seg([RK, -RK, z0], [RK, -RK, z1], 0.5); seg([-RK, RK, z0], [-RK, RK, z1], 0.5);
      },
      front() {
        for (const z of [z0, z1]) { seg([RK, -RK, z], [RK, RK, z], 0.95); seg([-RK, RK, z], [RK, RK, z], 0.95); }
        seg([RK, RK, z0], [RK, RK, z1], 0.95); seg([RK, -RK, z0], [RK, -RK, z1], 0.95); seg([-RK, RK, z0], [-RK, RK, z1], 0.95);
        for (let i = 0; i <= 16; i++) { const z = z0 + (z1 - z0) * i / 16; const l = i % 4 === 0 ? 0.5 : 0.22; seg([RK, RK, z], [RK + l, RK, z], 0.6); }
        for (const f of [0.25, 0.5, 0.75]) { const z = z0 + (z1 - z0) * f; seg([RK, -RK, z], [RK, RK, z], 0.18); seg([-RK, RK, z], [RK, RK, z], 0.18); }
      },
      label() {
        const pp = pj(-RK, -RK, z1); const lx = pp[0], ly = pp[1] - 30 * dpr;
        line(pp, [lx, ly], col, a * 0.7);
        txt('YOUR STACK', lx + 8 * dpr, ly + 2 * dpr, a * 0.95, '#f1ede4', 11);
        txt('CLIENT RACK · 8U', lx + 8 * dpr, ly + 16 * dpr, a * 0.6, '#9b958a', 8.5);
        if (W > 0.3 && mxAmt === 0) { const q = pj(RK, RK, z1 - 1); ctx.globalAlpha = a; ctx.fillStyle = 'rgb(232,160,75)'; ctx.fillRect(q[0] - 2 * dpr, q[1] - 2 * dpr, 4 * dpr, 4 * dpr); }
      },
    };
  }

  function drawGrid(a) {
    if (a < 0.01) return;
    const z = -0.4, n = 10, step = 1.2, ext = n * step;
    ctx.lineWidth = dpr; ctx.strokeStyle = '#f1ede4';
    for (let i = -n; i <= n; i++) {
      ctx.globalAlpha = a * 0.1 * (1 - Math.abs(i) / (n + 2)) + (i % 5 === 0 ? a * 0.07 : 0);
      const A = pj(i * step, -ext, z), B = pj(i * step, ext, z); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      const C = pj(-ext, i * step, z), D = pj(ext, i * step, z); ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(D[0], D[1]); ctx.stroke();
    }
  }

  function drawMark(k) {
    const cx = cam.cx, cy = cam.cy, R = Math.min(cw, ch) * dpr * 0.30;
    const N = 180;
    for (let i = 0; i < N; i++) {
      const th = BAYER[(i * 7) & 3][(i * 3) & 3] * 0.5 + hash(i) * 0.5;
      if (th > k * 1.05) continue;
      const a = i / N * Math.PI * 2, d = 2.4 * dpr;
      ctx.globalAlpha = 0.95; ctx.fillStyle = '#f1ede4';
      ctx.fillRect(cx + Math.cos(a) * R - d / 2, cy + Math.sin(a) * R - d / 2, d, d);
      ctx.fillRect(cx + Math.cos(a) * (R - 5 * dpr) - d / 2, cy + Math.sin(a) * (R - 5 * dpr) - d / 2, d * 0.6, d * 0.6);
    }
    const ext = R * 1.2 * lin(k, 0.3, 1);
    ctx.globalAlpha = 0.8 * lin(k, 0.3, 1); ctx.strokeStyle = '#f1ede4'; ctx.lineWidth = dpr;
    ctx.beginPath(); ctx.moveTo(cx, cy - ext); ctx.lineTo(cx, cy + ext); ctx.moveTo(cx - ext, cy); ctx.lineTo(cx + ext, cy); ctx.stroke();
    const rc = R * 0.395 * lin(k, 0.15, 1);
    ctx.globalAlpha = 1; ctx.fillStyle = BG; ctx.beginPath(); ctx.arc(cx, cy, rc * 1.02, 0, 7); ctx.fill();
    ctx.fillStyle = PAT.amber[8]; ctx.beginPath(); ctx.arc(cx, cy, rc * 0.92, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgb(232,160,75)'; ctx.beginPath(); ctx.arc(cx, cy, rc * 0.58, 0, 7); ctx.fill();
    glow(cx, cy, R * 0.9, 0.16 * k);
  }

  const setAnch = (k, p) => { anchors[k] = [p[0] / dpr, p[1] / dpr]; };

  /**
   * Draw one frame.
   * st   scene state (see scenes.js): q[4], g1, g2, d, F, W, Rk, mx, mAlpha, G,
   *      dimA, dimProg, mk, pulse, hl[4], filter, cables, mobile, static
   * view { cx, cy, S, zc, yaw } in device pixels
   */
  function draw(st, view, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.assign(cam, view);
    yawM.c = Math.cos(cam.yaw); yawM.s = Math.sin(cam.yaw);
    const filter = st.filter || (() => true);
    const masterA = clamp(st.mAlpha * (1 - 0.93 * st.mk));

    drawGrid(st.G * st.mAlpha);
    if (st.dimA > 0.01) dimLine([-4, 4, -6.7], [4, 4, -6.7], [0, 2.3, 0], 'ENVELOPE 8.0 × 8.0 × 7.4 U', st.dimProg, st.dimA * 0.9);
    if (st.G > 0.05) {
      dimLine([-4, 4, -0.3], [4, 4, -0.3], [0, 2.2, 0], 'W 8.0', clamp(st.G * 1.4), st.G * 0.8);
      dimLine([4.4, -4.4, -0.3], [4.4, -4.4, 7.15], [1.7, -1.7, 0], 'H 7.4', clamp(st.G * 1.4), st.G * 0.8, true);
    }
    const rk = makeRack(st.Rk, st.mx, st.W);
    if (rk) rk.back();

    const items = [];
    const eScale = (1 - 0.18 * st.d) + 0.1 * st.g1;
    const hlAny = Math.max(...st.hl);
    for (const p of parts) {
      if (!filter(p)) continue;
      const g = p.g; let pos, s;
      if (g === 4) {
        const al = st.g1 * (1 - clamp(st.q[0] * 2.2)) * masterA;
        if (al < 0.01) continue;
        pos = [0, 0, 2.7 + Math.sin(t * 0.9) * 0.08 + 0.9 * clamp(st.q[0] * 2.2)];
        s = { fill: 1, edge: 1, ec: mix(CREAM, CREAM, 0), alpha: al, col: 'cream', lw: dpr * 1.2 };
        items.push({ p, pos, st: s, demo: true });
        continue;
      }
      const qp = clamp((st.q[g] - p.delay * 0.35) / 0.65);
      const e = backOut(qp), ex = 1 - e;
      const bob = st.static ? 0 : Math.sin(t * 0.8 + p.i * 1.7) * 0.1 * clamp(ex);
      pos = [p.pos[0] + p.ex[0] * ex * eScale + st.mx, p.pos[1] + p.ex[1] * ex * eScale, p.pos[2] + p.ex[2] * ex * eScale + bob];
      const qlin = clamp(qp * 1.5);
      const Fp = clamp((st.F - p.ord * 0.6) / 0.4);
      const fill = Math.max(1 - st.g1, qlin) * Fp;
      const ghostEdge = lerp(0.9, lerp(0.16, 0.55, st.g2), st.g1);
      const edge = lerp(ghostEdge, 0.92, qlin);
      const grey = st.g1 * (1 - qlin);
      let al = masterA;
      const hlv = g < 4 ? st.hl[g] : 0;
      if (hlAny > 0.01) al *= 1 - 0.55 * hlAny * (1 - hlv);
      s = { fill, edge: Math.min(1, edge + hlv * 0.2), ec: mix(CREAM, GREY, grey), alpha: al, col: 'cream', lw: dpr * (1 + hlv * 0.6), hlBoost: 1 + hlv * 0.18 };
      if ((p.lamp || p.lens) && st.W > 0.02) { s.col = 'amber'; s.fill = lerp(s.fill, 1, st.W) * (0.75 + 0.25 * Math.sin(t * 2.4)); s.ec = mix(CREAM, AMB, st.W); }
      if (p.lens && st.pulse > 0 && st.pulse < 1 && qlin > 0.5) { s.col = 'amber'; s.fill = 1; s.ec = mix(CREAM, AMB, 1); }
      expl[p.i] = ex;
      items.push({ p, pos, st: s });
    }
    for (const it of items) {
      const [x, y, z] = it.pos;
      const xr = x * yawM.c - y * yawM.s, yr = x * yawM.s + y * yawM.c;
      it.key = it.demo ? 999 : (xr + yr) + z * 0.02;
      scr[it.p.i] = pj(x, y, z);
    }
    items.sort((a, b) => a.key - b.key);
    for (const it of items) { if (it.p.t === 'box') drawBox(it.p, it.pos, it.st); else drawCyl(it.p, it.pos, it.st, it.p.t === 'ring'); }

    // cables
    const cqOf = (g) => clamp((st.q[g === undefined ? 3 : g] - 0.3) / 0.6);
    const cq = cqOf(model.glowGroup);
    const cabAlpha = masterA * (1 - 0.4 * (hlAny > 0.01 ? hlAny * (1 - st.hl[3]) : 0));
    const cableIdx = st.cables || [0, 1, 2, 3];
    for (const i of cableIdx) drawCable(CABLES[i], sm(cqOf(CABLES[i].g)), st.W, t, cabAlpha);

    // amber glows
    const lamp = LAMP, lens = LENS;
    if (st.W > 0.02 && cq > 0.9) {
      if (lamp && filter(lamp)) glow(scr[lamp.i][0], scr[lamp.i][1], cam.S * 1.4, 0.35 * st.W * masterA * (0.8 + 0.2 * Math.sin(t * 2.4)));
      if (lens && filter(lens)) glow(scr[lens.i][0], scr[lens.i][1], cam.S * 2.6, 0.2 * st.W * masterA);
    }
    if (st.pulse > 0 && st.pulse < 1) {
      const k = st.pulse, l = scr[lens.i];
      ctx.globalAlpha = Math.sin(k * Math.PI) * 0.9; ctx.strokeStyle = 'rgb(232,160,75)'; ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath(); ctx.ellipse(l[0], l[1], cam.S * (1 + k * 5), cam.S * (1 + k * 5) * 0.58, 0, 0, 7); ctx.stroke();
      glow(l[0], l[1], cam.S * (2 + k * 3), 0.5 * Math.sin(k * Math.PI));
    }
    if (rk) { rk.front(); rk.label(); }

    // part numbers, with simple collision avoidance (earlier priority wins)
    const placed = [];
    const order = parts.filter((q) => q.label && filter(q)).sort((a, b) => (b.g === 4) - (a.g === 4) || (b.label === 'L-01') - (a.label === 'L-01'));
    for (const p of order) {
      if (st.labels === false) continue;
      if (st.mobile && p.g !== 4 && !['D-02', 'M-02', 'A-01', 'L-01'].includes(p.label)) continue;
      let la;
      if (p.g === 4) la = st.g1 * (1 - clamp(st.q[0] * 2.2));
      else la = clamp(expl[p.i] * 1.6 - 0.2) * 0.8 * (1 - 0.5 * (st.g1 > 0 ? st.g1 * (1 - st.g2) : 0));
      la = Math.max(la, p.g < 4 ? st.hl[p.g] * 0.9 : 0) * masterA;
      if (la < 0.05) continue;
      const [x, y] = scr[p.i];
      if (placed.some((q) => Math.abs(q[0] - x) < 70 * dpr && Math.abs(q[1] - y) < 13 * dpr)) continue;
      placed.push([x, y]);
      ctx.globalAlpha = la; ctx.strokeStyle = '#f1ede4'; ctx.lineWidth = dpr;
      ctx.beginPath(); ctx.moveTo(x - 3 * dpr, y); ctx.lineTo(x + 3 * dpr, y); ctx.moveTo(x, y - 3 * dpr); ctx.lineTo(x, y + 3 * dpr); ctx.stroke();
      const dx = (p.g === 4 ? 70 : 22) * dpr;
      line([x + 3 * dpr, y], [x + dx, y - 10 * dpr], '#f1ede4', la * 0.6);
      txt(p.label, x + dx + 3 * dpr, y - 7 * dpr, la, '#f1ede4', p.g === 4 ? 11 : 9.5);
    }

    if (st.mk > 0.01) drawMark(st.mk);

    if (model.anchors) model.anchors(setAnch, scr, pj);
    else if (demo && byLabel['D-02']) {
      setAnch('machine', pj(0, 0, 2.8));
      setAnch('demo', pj(...demo.pos));
      setAnch('data', scr[byLabel['D-02'].i]); setAnch('core', scr[byLabel['M-02'].i]);
      setAnch('agents', scr[byLabel['A-01'].i]); setAnch('ops', scr[lamp.i]);
      setAnch('ghost', scr[byLabel['M-02'].i]);
    }
  }

  return { draw, resize, anchors, get dpr() { return dpr; } };
}
