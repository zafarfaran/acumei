// The Premo drawing: its own model for the same renderer. A sibling of the home
// machine (same primitives, same dither), but a different object: a 3x3 base of
// sealed tenant cells with an analysis core, a guardrail cage, a WhatsApp phone
// and a hash chain. `g` is the renderer group; steps 0..5 use groups
// 0,1,2,3,5,6 (group 4 is reserved for the home demo cube).
export const GROUP = [0, 1, 2, 3, 5, 6];

const parts = [];
const add = (o) => { o.i = parts.length; o.ex = o.ex || [0, 0, 0]; o.delay = o.delay || 0; o.ord = o.ord || 0; parts.push(o); return o; };
const P = 2.55; // cell pitch
const CZ = 0.65; // top of the centre cell

// STEP 1 ISOLATION: nine separate sealed cells; the centre one is raised (one business).
for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
  const c = a === 0 && b === 0;
  const ring = Math.max(Math.abs(a), Math.abs(b)) + (a && b ? 0.5 : 0);
  add({ g: GROUP[0], t: 'box', pos: [a * P, b * P, c ? 0.4 : 0.25], size: [2.2, 2.2, c ? 0.5 : 0.5], ex: [a * 1.0, b * 1.0, -3], delay: 0.1 + ring * 0.2, label: c ? 'T-01' : null, shine: c ? 1 : 0 });
}

// STEP 2 LIVE DATA: feedback card with QR dither, three data conduits, dashboard panel.
add({ g: GROUP[1], t: 'box', pos: [-4.1, 0, 1.4], size: [0.25, 3.4, 2.3], ex: [-4, 0, 0.5], delay: 0.5, label: 'D-01' });
[[-0.6, -0.6], [-0.6, 0.6], [0.6, -0.6]].forEach(([x, y], k) => add({ g: GROUP[1], t: 'cyl', pos: [x, y, CZ + 0.8], r: 0.14, h: 1.6, ex: [0, 0, 4], delay: 0.1 + k * 0.1 }));
add({ g: GROUP[1], t: 'box', pos: [0.95, 0, CZ + 0.4], size: [0.07, 1.0, 0.8], ex: [3.5, 0, 0.6], delay: 0.3, label: 'Q-01' });
[[-0.22, 0.2], [0.22, 0.2], [-0.22, 0.58], [0.22, 0.58]].forEach(([y, z], k) => { if (k !== 2) add({ g: GROUP[1], t: 'box', pos: [1.0, y, CZ + z - 0.1], size: [0.06, 0.2, 0.2], ex: [3.5, 0, 0.6], delay: 0.4 + k * 0.04 }); });

// STEP 3 ANALYSIS AGENT: collar, core, lens (seated on the conduits).
add({ g: GROUP[2], t: 'cyl', pos: [0, 0, 2.475], r: 1.25, h: 0.45, ex: [0, 0, 3], delay: 0 });
add({ g: GROUP[2], t: 'cyl', pos: [0, 0, 3.15], r: 1.0, h: 0.9, ex: [0, 0, 4.5], delay: 0.15, label: 'C-01', shine: 1 });
const lens = add({ g: GROUP[2], t: 'cyl', pos: [0, 0, 3.67], r: 0.55, h: 0.14, ex: [0, 0, 6], delay: 0.3, lens: true });

// STEP 4 GUARDRAILS: a collar and a thin-bar cage that only lets summaries out.
add({ g: GROUP[3], t: 'ring', pos: [0, 0, 3.15], r: 1.75, rIn: 1.5, h: 0.2, ex: [0, 0, 3], delay: 0, label: 'G-01' });
[[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(([sx, sy], k) => add({ g: GROUP[3], t: 'box', pos: [sx * 1.55, sy * 1.55, 2.3], size: [0.12, 0.12, 3.6], ex: [sx * 2.5, sy * 2.5, 1.5], delay: 0.1 + k * 0.05 }));
[-1, 1].forEach((s) => {
  add({ g: GROUP[3], t: 'box', pos: [0, s * 1.55, 4.05], size: [3.2, 0.12, 0.12], ex: [0, s * 2.5, 3], delay: 0.35 });
  add({ g: GROUP[3], t: 'box', pos: [s * 1.55, 0, 4.05], size: [0.12, 3.2, 0.12], ex: [s * 2.5, 0, 3], delay: 0.35 });
});

// STEP 5 WHATSAPP AGENT: phone slab beside the grid, three chat bubbles on its face.
add({ g: GROUP[4], t: 'box', pos: [0, -4.6, 1.95], size: [2.0, 0.3, 3.4], ex: [0, -4, 0], delay: 0, label: 'W-01' });
[[-0.3, 1.1], [0.3, 1.95], [-0.3, 2.8]].forEach(([x, z], k) => add({ g: GROUP[4], t: 'box', pos: [x, -4.35, z], size: [1.0, 0.22, 0.5], ex: [0, -4.5, 0], delay: 0.2 + k * 0.12, lamp: true }));

// STEP 6 ACCOUNTABILITY: a hash chain of six linked blocks along the front edge.
for (let i = 0; i < 6; i++) add({ g: GROUP[5], t: 'box', pos: [-3.1 + i * 1.24, 4.15, 0.25], size: [0.8, 0.6, 0.5], ex: [0, 3.5, 0], delay: i * 0.1, label: 'H-0' + (i + 1) });

export const byLabel = {};
parts.forEach((p) => { if (p.label) byLabel[p.label] = p; });

export const cables = [
  { pts: [[0, 0, 3.8], [0, 0, 4.4], [0, -4.6, 4.4], [0, -4.6, 3.5]], ph: 0, g: GROUP[4] },
  { pts: [[0, 0, 3.8], [0, 0, 4.7], [0, 4.15, 4.7], [0, 4.15, 0.65], [3.1, 4.15, 0.65]], ph: 0.35, g: GROUP[5] },
  { pts: [[0, 4.15, 0.65], [-3.1, 4.15, 0.65]], ph: 0.7, g: GROUP[5] },
];
cables.forEach((c) => {
  let L = 0; c.cum = [0];
  for (let i = 1; i < c.pts.length; i++) { L += Math.hypot(...c.pts[i].map((v, k) => v - c.pts[i - 1][k])); c.cum.push(L); }
  c.len = L;
});

export const premoModel = {
  parts, cables, rack: { k: 5, z0: 0, z1: 5 }, demo: null, byLabel,
  lamp: byLabel['W-01'], lens, glowGroup: GROUP[2],
  anchors(set, scr) { set('core', scr[byLabel['C-01'].i]); },
};

// Where each step's leader line points (assembled world position).
export const AT = [
  [-2.55, 2.55, 0.3],
  [-4.1, 0, 1.6],
  [-1.0, 1.0, 3.15],
  [-1.55, 1.55, 4.05],
  [-0.8, -4.6, 3.0],
  [-3.1, 4.15, 0.3],
];
