// Small pure helpers shared by the machine renderer and the scroll scenes.

export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const lin = (t, a, b) => clamp((t - a) / (b - a));
export const lerp = (a, b, t) => a + (b - a) * t;

// Ease-out with a small overshoot (about 5%), computed from progress alone so a
// part always settles the same way, forwards or backwards.
export const backOut = (t) => {
  t = clamp(t);
  const c1 = 1.1, c3 = c1 + 1, u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
};

export const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// Bayer 4x4 thresholds, same matrix as lib/dither.js.
export const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((v) => (v + 0.5) / 16));

export const BG = '#0a0a0b';
export const CREAM = [241, 237, 228];
export const GREY = [155, 149, 138];
export const AMB = [232, 160, 75];
export const mix = (a, b, t) => `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
