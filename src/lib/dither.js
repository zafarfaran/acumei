// Generative dithered field renderer. Ordered (Bayer 4x4) thresholding of an
// analytic scalar field, plotted as sub-pixel dots or ASCII glyphs. No assets,
// no images, no dependencies.
//
// Ported from the design handoff bundle. The field maths and the render loop
// are unchanged; the only edits are the IIFE/window global becoming an ES
// module export, and a reduced-motion path that draws one static frame instead
// of running the loop (every field here is continuous ambient motion, which is
// exactly what `prefers-reduced-motion` asks us to stop).

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map(r => r.map(v => (v + 0.5) / 16));

const FIELDS = {
  brain(u, v, t, p) {
    const su = u * 1.12, sv = v * 1.32;
    const R = Math.hypot(su, sv);
    if (R > 1) return 0;
    const z = Math.sqrt(1 - R * R);
    const a = t * 0.18 + (p.mx || 0) * 0.45;
    const x2 = su * Math.cos(a) + z * Math.sin(a);
    const z2 = -su * Math.sin(a) + z * Math.cos(a);
    // per-hemisphere swirling cortical folds
    const side = x2 < 0 ? -1 : 1;
    const lu = Math.abs(x2) - 0.42;
    const r2 = Math.hypot(lu * 1.15, sv * 0.95);
    const ang = Math.atan2(sv, lu * 1.5);
    const gyri = Math.abs(Math.sin(r2 * 12.5 + ang * 2.4 * side + Math.sin(ang * 3 + t * 0.3) * 0.9 + t * 0.25));
    const folds = Math.pow(gyri, 1.5);
    // longitudinal fissure down the middle
    const fissure = Math.min(1, Math.pow(Math.abs(x2) * 2.6, 1.9));
    // brain-stem shadow at the base
    const stem = 1 - Math.max(0, (sv - 0.45)) * 0.9;
    // periodic signal firing outward from the centre
    const fire = Math.max(0, Math.sin(R * 9 - t * 1.35)) * Math.pow(Math.max(0, Math.sin(t * 0.32)), 6) * 0.85;
    const light = 0.35 + 0.62 * (x2 * 0.35 - sv * 0.34 + z2 * 0.62);
    const edge = Math.min(1, (1 - R) * 5.5);
    const raw = (light * (0.1 + folds * 1.05) * fissure * stem + Math.pow(1 - z, 6) * 0.62 + fire) * edge;
    return Math.pow(Math.max(0, raw), 1.35) * 1.5;
  },
  orb(u, v, t, p) {
    const R = Math.hypot(u, v);
    if (R > 1) return 0;
    const z = Math.sqrt(1 - R * R);
    v += (p.my || 0) * 0.12;
    const a = t * 0.22 + (p.mx || 0) * 0.5;
    const x2 = u * Math.cos(a) + z * Math.sin(a);
    const z2 = -u * Math.sin(a) + z * Math.cos(a);
    const light = 0.5 + 0.6 * (x2 * 0.45 - v * 0.35 + z2 * 0.55);
    const bands = 0.5 + 0.5 * Math.sin(Math.atan2(v, x2) * 5 + z2 * 6.5 - t * 0.5);
    const rim = Math.pow(1 - z, 4) * 0.75;
    const edge = Math.min(1, (1 - R) * 6);
    return (light * 0.5 + bands * 0.42 * z + rim) * edge;
  },
  wave(u, v, t) {
    const d1 = Math.hypot(u + 0.45, v + 0.2);
    const d2 = Math.hypot(u - 0.5, v - 0.35);
    const s = Math.sin(d1 * 11 - t * 0.9) * Math.sin(d2 * 9 + t * 0.6);
    return (0.5 + 0.5 * s) * Math.max(0, 1 - Math.hypot(u, v) * 0.85);
  },
  scatter(u, v, t) {
    let s = 0;
    for (let i = 0; i < 5; i++) {
      const p = t * 0.16 + i * 1.7;
      const cx = Math.cos(p * (0.6 + i * 0.13)) * (0.15 + i * 0.11);
      const cy = Math.sin(p * (0.5 + i * 0.09)) * (0.12 + i * 0.09);
      const d = Math.hypot(u - cx, v - cy);
      s += Math.exp(-d * d * (7 + i * 2.5));
    }
    return s * 0.62;
  },
  grid(u, v, t) {
    const wu = u + Math.sin(v * 3.2 + t * 0.4) * 0.16;
    const wv = v + Math.cos(u * 2.7 - t * 0.32) * 0.16;
    const g = Math.max(
      Math.pow(Math.abs(Math.sin(wu * 9)), 14),
      Math.pow(Math.abs(Math.sin(wv * 9)), 14)
    );
    return g * Math.max(0, 1 - Math.hypot(u, v) * 0.8) * 1.25;
  },
  flow(u, v, t, p) {
    const k = 0.25 + (p.k || 0) * 0.9;
    let s = 0, amp = 0.6, f = 1.7;
    for (let i = 0; i < 3; i++) {
      s += amp * Math.sin(u * f * 3 + Math.sin(v * f * 2.2 - t * 0.5) * 2.2 + t * 0.35);
      amp *= 0.5; f *= 2.1;
    }
    const band = Math.max(0, 1 - Math.abs(v + 0.15) * 1.5);
    return (0.5 + 0.5 * s) * band * (0.55 + k) * (0.35 + 0.75 * (u * 0.5 + 0.5));
  },
  ridge(u, v, t) {
    let s = 0, amp = 0.55, f = 2.1;
    for (let i = 0; i < 4; i++) {
      s += amp * Math.sin(u * f + Math.sin(v * f * 0.7 + t * 0.25) * 1.6);
      amp *= 0.55; f *= 2.05;
    }
    return (0.5 + 0.5 * s) * Math.max(0, 1 - Math.abs(v) * 1.1);
  }
};

export const modes = Object.keys(FIELDS);

export function dither(canvas, opts) {
  opts = opts || {};
  const ctx = canvas.getContext('2d', { alpha: true });
  const cell = opts.cell || 4;
  const dot = opts.dot || 1.7;
  const ascii = !!opts.ascii;
  const ramp = opts.ramp || ' .·:-=+*≡#%@';
  const gain = opts.gain == null ? 1 : opts.gain;
  let field = FIELDS[opts.mode] || FIELDS.orb;
  let color = opts.color || 'rgba(241,237,228,0.72)';
  const params = Object.assign({ mx: 0, my: 0, k: 0 }, opts.params);
  let cols = 0, rows = 0, w = 0, h = 0, t = opts.seed || 0, last = 0, running = true, raf = 0;

  const still = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
    if (still) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    if (ascii) { ctx.font = (cell * 1.12) + 'px ui-monospace,"JetBrains Mono",monospace'; ctx.textBaseline = 'top'; }
    const ar = cols / rows;
    for (let ry = 0; ry < rows; ry++) {
      const v = (ry / rows) * 2 - 1;
      const brow = BAYER[ry & 3];
      for (let cx = 0; cx < cols; cx++) {
        const u = ((cx / cols) * 2 - 1) * (ar > 1 ? ar : 1);
        const val = field(u, v, t, params) * gain;
        if (ascii) {
          const q = val + (brow[cx & 3] - 0.5) * 0.14;
          if (q <= 0.06) continue;
          const i = Math.min(ramp.length - 1, Math.max(0, Math.round(q * (ramp.length - 1))));
          if (i > 0) ctx.fillText(ramp[i], cx * cell, ry * cell);
        } else if (val > brow[cx & 3]) {
          ctx.fillRect(cx * cell, ry * cell, dot, dot);
        }
      }
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    if (now - last < 33) return;          // capped at 30fps
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now; t += dt;
    draw();
  }

  const io = new IntersectionObserver(es => { running = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(canvas);
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  resize();
  if (!still) raf = requestAnimationFrame(frame);

  return {
    setMode(m) { if (FIELDS[m]) { field = FIELDS[m]; if (still) draw(); } },
    set(k, v) { params[k] = v; if (still) draw(); },
    setColor(c) { color = c; if (still) draw(); },
    destroy() { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); }
  };
}

export default dither;
