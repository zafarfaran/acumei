// The machine model: parts with an assembled position (centre, world units, z up)
// and an exploded offset along their own axis. Groups: 0 DATA, 1 MODELS,
// 2 AGENTS, 3 OPERATIONS, 4 the lone DEMO cube.

export const parts = [];
const add = (o) => { o.i = parts.length; o.ex = o.ex || [0, 0, 0]; o.delay = o.delay || 0; parts.push(o); return o; };

// DATA: four stacked slabs
[-4.2, -2.8, -1.4, 0].forEach((ez, i) => add({ g: 0, t: 'box', pos: [0, 0, 0.25 + i * 0.62], size: [6, 6, 0.5], ex: [0, 0, ez], delay: i * 0.14, ord: i * 0.05, label: 'D-0' + (i + 1) }));

// MODELS: collar, core cylinder, cap ring, lens
add({ g: 1, t: 'ring', pos: [0, 0, 2.47], r: 2.05, rIn: 1.6, h: 0.22, ex: [0, 0, 1.4], delay: 0, ord: 0.25, label: 'M-01' });
add({ g: 1, t: 'cyl', pos: [0, 0, 4.03], r: 1.7, h: 2.9, ex: [0, 0, 3.6], delay: 0.12, ord: 0.3, label: 'M-02', shine: 1 });
add({ g: 1, t: 'ring', pos: [0, 0, 5.63], r: 2.0, rIn: 1.3, h: 0.3, ex: [0, 0, 5.2], delay: 0.26, ord: 0.4, label: 'M-03' });
add({ g: 1, t: 'cyl', pos: [0, 0, 5.57], r: 1.02, h: 0.18, ex: [0, 0, 6.6], delay: 0.38, ord: 0.42, label: 'M-04', lens: true });

// AGENTS: four arms, each a mount, a bar and a tip
[[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([dx, dy], k) => {
  const ax = dx !== 0;
  const dl = k * 0.1, o = 0.5 + k * 0.04;
  add({ g: 2, t: 'box', pos: [dx * 2.2, dy * 2.2, 3.9], size: ax ? [0.9, 1.0, 1.1] : [1.0, 0.9, 1.1], ex: [dx * 4.2, dy * 4.2, 0.8], delay: dl, ord: o, label: 'A-0' + (k + 1) });
  add({ g: 2, t: 'box', pos: [dx * 3.45, dy * 3.45, 3.95], size: ax ? [1.6, 0.34, 0.34] : [0.34, 1.6, 0.34], ex: [dx * 5.4, dy * 5.4, 1.6], delay: dl + 0.08, ord: o + 0.03 });
  add({ g: 2, t: 'cyl', pos: [dx * 4.1, dy * 4.1, 3.5], r: 0.3, h: 0.8, ex: [dx * 6, dy * 6, 0.4], delay: dl + 0.16, ord: o + 0.06 });
});

// OPERATIONS: base plate, corner posts, top beams, gantry, status lamp
add({ g: 3, t: 'box', pos: [0, 0, -0.15], size: [8, 8, 0.3], ex: [0, 0, -5.0], delay: 0, ord: 0.75, label: 'P-01' });
[[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(([sx, sy], k) => add({ g: 3, t: 'box', pos: [sx * 3.7, sy * 3.7, 3.3], size: [0.4, 0.4, 6.6], ex: [sx * 5.0, sy * 1.0, 1.5], delay: 0.1 + k * 0.05, ord: 0.8 + k * 0.01, label: k === 0 ? 'F-01' : null, post: k === 0 }));
[-1, 1].forEach((s) => {
  add({ g: 3, t: 'box', pos: [0, s * 3.7, 6.43], size: [8, 0.4, 0.34], ex: [0, s * 3.6, 3.6], delay: 0.3, ord: 0.88, label: s > 0 ? 'F-02' : null });
  add({ g: 3, t: 'box', pos: [s * 3.7, 0, 6.43], size: [0.4, 8, 0.34], ex: [s * 3.6, 0, 3.6], delay: 0.3, ord: 0.9 });
});
add({ g: 3, t: 'box', pos: [0, 0, 6.43], size: [7.4, 0.34, 0.34], ex: [0, 0, 4.6], delay: 0.4, ord: 0.93, gantry: true });
add({ g: 3, t: 'cyl', pos: [3.7, 3.7, 6.875], r: 0.28, h: 0.55, ex: [4, -3, 5], delay: 0.55, ord: 0.96, label: 'L-01', lamp: true });

// DEMO: a shiny, unconnected cube
export const demo = add({ g: 4, t: 'box', pos: [0, 0, 2.7], size: [2.2, 2.2, 2.2], ord: 0, label: 'DEMO', shine: 1 });

export const byLabel = {};
parts.forEach((p) => { if (p.label) byLabel[p.label] = p; });

// Cable channels (OPERATIONS). They draw on with the group's progress.
export const CABLES = [
  { pts: [[0, 0, 5.74], [0, 0, 6.64], [3.7, 0, 6.64], [3.7, 3.7, 6.64], [3.7, 3.7, 6.75]], ph: 0 },
  { pts: [[0, 0, 6.64], [-3.7, 0, 6.64], [-3.7, -3.7, 6.64]], ph: 0.3 },
  { pts: [[2.3, 0, 3.35], [2.3, 0, 2.38], [3.03, 0, 2.38], [3.03, 0, 0.1], [3.8, 0, 0.04]], ph: 0.6 },
  { pts: [[0, 2.3, 3.35], [0, 2.3, 2.38], [0, 3.03, 2.38], [0, 3.03, 0.1], [0, 3.8, 0.04]], ph: 0.8 },
];
CABLES.forEach((c) => {
  let L = 0; c.cum = [0];
  for (let i = 1; i < c.pts.length; i++) { L += Math.hypot(...c.pts[i].map((v, k) => v - c.pts[i - 1][k])); c.cum.push(L); }
  c.len = L;
});

// Subsets for the per-page PartDrawing. `view` is [world z centre, visible span].
export const SETS = {
  data: { filter: (p) => p.g === 0, groups: [0], view: [1.2, 13], power: false, cables: [], name: 'DATA', ids: 'D-01 – D-04' },
  models: { filter: (p) => p.g === 1, groups: [1], view: [4.2, 15], power: false, cables: [], name: 'MODELS', ids: 'M-01 – M-04' },
  agents: { filter: (p) => p.g === 2 || p.label === 'M-02', groups: [1, 2], view: [3.6, 17], power: false, cables: [], name: 'AGENTS', ids: 'A-01 – A-04' },
  operations: { filter: (p) => p.g === 3, groups: [3], view: [4.0, 18], power: true, cables: [0, 1, 2, 3], name: 'OPERATIONS', ids: 'P-01 · F-01 – F-02 · L-01' },
  lamp: { filter: (p) => p.lamp || p.post || p.gantry, groups: [3], view: [5.2, 12], power: true, cables: [0], name: 'STATUS LAMP', ids: 'L-01' },
  machine: { filter: () => false, groups: [0, 1, 2, 3], view: [2.8, 17], power: true, cables: [0, 1, 2, 3], name: 'SYSTEM', ids: 'D · M · A · F' },
};
SETS.machine.filter = (p) => p.g < 4;

// World extents of the rack that surrounds the machine at hand-over.
export const RACK = { k: 4.7, z0: -0.7, z1: 7.9 };

// Old PageField `mode` values map onto a default part so existing pages keep
// working without edits.
const MODE_TO_PART = { brain: 'machine', ridge: 'data', orb: 'models', grid: 'agents', wave: 'operations', flow: 'machine', scatter: 'lamp' };
export function partForField(field) {
  return MODE_TO_PART[field && field.mode] || 'machine';
}
