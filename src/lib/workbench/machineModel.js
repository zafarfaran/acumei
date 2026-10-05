// The Workbench machine as a model for lib/assembly/renderer: a dithered rail
// with six modules, branch blocks on outrigger pads behind it, an audit chain
// along the front, and an amber request token that travels during a run.
//
// The renderer depth-sorts parts by their centres, so big flat things are cut
// into pieces whose centres sit under what stands on them: one rail segment per
// module, and each outrigger is a neck plus a pad centred under its block.
import { MODULES, BRANCHES, partByCode, slotByCode } from './parts';

const PITCH = 2.2;
const X0 = -2.5 * PITCH; // module 0 centre; the rail is centred on the origin
const RAIL = { y0: -0.7, y1: 1.6, z0: -0.35, z1: 0 };
const MOD_Y = 0.25; // module centre (depth 1.2 → y −0.35..0.85)
const PAD_Y = -2.45; // branch block centre
const CHAIN_Y = 1.22;

export const TOKEN_G = 30;
// The rail, necks and pads are the floor: draw them before anything that stands on them.
const FLOOR = -100;
const G = { rail: 10, module: (i) => 11 + i, branch: (j) => 20 + j, chain: 26, token: TOKEN_G };
export const GROUPS = 32;

const modX = (i) => X0 + i * PITCH;
const BRANCH_AT = { 'G-01': 1, 'G-02': 2, 'G-03': 3, 'G-04': 5 };

const box = (o) => ({ t: 'box', ex: [0, 0, 0], delay: 0, ord: 0, ...o });

// Corners of a box (for dashed empty-socket outlines drawn in the overlay).
const corners = (c, s) => {
  const out = [];
  for (const dz of [1, -1]) for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) out.push([c[0] + dx * s[0] / 2, c[1] + dy * s[1] / 2, c[2] + dz * s[2] / 2]);
  return out;
};

export function buildMachine(build) {
  const parts = [];
  const add = (o) => { o.i = parts.length; parts.push(o); return o; };
  const slotPos = {}, labelPos = {}, sockets = {}, fitted = {};

  // rail: one segment per module
  MODULES.forEach((_, i) => add(box({
    g: G.rail, pos: [modX(i) + 0.325, (RAIL.y0 + RAIL.y1) / 2, (RAIL.z0 + RAIL.z1) / 2],
    size: [PITCH, RAIL.y1 - RAIL.y0, RAIL.z1 - RAIL.z0], rail: true, dens: 0.4, kb: FLOOR,
  })));

  // modules
  MODULES.forEach((slot, i) => {
    const p = partByCode(build[slot]);
    const [w, d, h] = p.shape.size;
    const x = modX(i) + 0.325;
    fitted[slot] = add(box({ g: G.module(i), pos: [x, MOD_Y, h / 2], size: [w, d, h], ex: [0, 0, 3.2], code: p.code, slot }));
    slotPos[slot] = [x, MOD_Y, h + 0.45];
    labelPos[slot] = [x - 0.4, RAIL.y1, RAIL.z0];
  });

  // branches on outriggers behind the rail
  Object.entries(BRANCH_AT).forEach(([code, i], j) => {
    const x = modX(i) + 0.325;
    // neck from the rail's back edge (y −0.7) to the pad's front edge (y −1.9)
    add(box({ g: G.rail, pos: [x, -1.3, -0.25], size: [0.5, 1.2, 0.2], neck: true, dens: 0.4, kb: FLOOR }));
    add(box({ g: G.rail, pos: [x, PAD_Y, -0.25], size: [1.3, 1.1, 0.2], pad: true, dens: 0.4, kb: FLOOR }));
    const size = [0.9, 0.9, 0.6], c = [x, PAD_Y, -0.15 + 0.3];
    if (build.branches.includes(code)) fitted[code] = add(box({ g: G.branch(j), pos: c, size, ex: [0, 0, 2.6], code, slot: code }));
    else sockets[code] = corners(c, size);
    slotPos[code] = [x, PAD_Y, 0.9];
    labelPos[code] = [x + 0.45, PAD_Y - 0.45, 0.45];
  });

  // audit chain along the front of the rail
  const chainSize = [0.7, 0.45, 0.25];
  if (build.branches.includes('G-05')) {
    MODULES.forEach((_, i) => add(box({ g: G.chain, pos: [modX(i) + 0.325, CHAIN_Y, chainSize[2] / 2], size: chainSize, ex: [0, 0, 2], delay: i * 0.08, code: 'G-05', slot: 'G-05' })));
    fitted['G-05'] = parts[parts.length - 1];
  } else {
    sockets['G-05'] = corners([0.325, CHAIN_Y, chainSize[2] / 2], [PITCH * 5 + chainSize[0], chainSize[1], chainSize[2]]);
  }
  slotPos['G-05'] = [modX(5) + 0.325 + 0.6, CHAIN_Y, 0.6];
  labelPos['G-05'] = [modX(5) + 0.325 + 1.1, CHAIN_Y, 0.12];

  const token = add(box({ g: G.token, pos: [...slotPos['D-01']], size: [0.5, 0.4, 0.3], lamp: true, tokenPart: true }));

  const byLabel = {};
  const model = {
    parts, cables: [], rack: { k: 0, z0: 0, z1: 0 }, demo: null, byLabel, lamp: token, lens: null, glowGroup: TOKEN_G,
    anchors(set, scr, pj) {
      for (const code of [...MODULES, ...BRANCHES]) {
        set(`slot:${code}`, pj(...slotPos[code]));
        set(`label:${code}`, pj(...labelPos[code]));
      }
      for (const [code, cs] of Object.entries(sockets)) cs.forEach((c, k) => set(`sock:${code}:${k}`, pj(...c)));
      set('token', scr[token.i]);
    },
  };

  return { model, token, slotPos, sockets, fitted };
}

// Light the module (or branch) the request is at; everything else goes dark.
export function setActive(machine, code) {
  for (const p of machine.model.parts) if (p.code) p.lamp = code != null && p.slot === code;
}

export const slotName = (code) => slotByCode(code)?.name || code;
