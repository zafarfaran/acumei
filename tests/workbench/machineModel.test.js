import { describe, it, expect } from 'vitest';
import { buildMachine, setActive, GROUPS } from '../../src/lib/workbench/machineModel';
import { DEFAULT_BUILD, fit } from '../../src/lib/workbench/build';
import { MODULES, BRANCHES } from '../../src/lib/workbench/parts';

describe('machine model', () => {
  it('default build: 6 rail segments, 6 modules, 4 necks + 4 pads, no branch blocks, a token', () => {
    const m = buildMachine(DEFAULT_BUILD);
    const ps = m.model.parts;
    expect(ps.filter((p) => p.rail)).toHaveLength(6);
    expect(ps.filter((p) => p.code && p.slot.startsWith('D-'))).toHaveLength(6);
    expect(ps.filter((p) => p.neck)).toHaveLength(4);
    expect(ps.filter((p) => p.pad)).toHaveLength(4);
    expect(ps.filter((p) => p.code && p.slot.startsWith('G-'))).toHaveLength(0);
    expect(ps.filter((p) => p.tokenPart)).toHaveLength(1);
    expect(Object.keys(m.sockets).sort()).toEqual(BRANCHES);
  });

  it('fitting branches adds blocks and removes their sockets', () => {
    const m = buildMachine(fit(fit(DEFAULT_BUILD, 'G-02'), 'G-05'));
    expect(m.model.parts.filter((p) => p.code === 'G-02')).toHaveLength(1);
    expect(m.model.parts.filter((p) => p.code === 'G-05')).toHaveLength(6);
    expect(m.sockets['G-02']).toBeUndefined();
    expect(m.sockets['G-05']).toBeUndefined();
    expect(m.sockets['G-03']).toHaveLength(8);
  });

  it('never uses the renderer demo group and stays inside the group range', () => {
    for (const p of buildMachine(fit(DEFAULT_BUILD, 'G-05')).model.parts) {
      expect(p.g).not.toBe(4);
      expect(p.g).toBeLessThan(GROUPS);
      expect(p.i).toBeTypeOf('number');
    }
  });

  it('has a position for every slot, and lights one slot at a time', () => {
    const m = buildMachine(DEFAULT_BUILD);
    for (const c of [...MODULES, ...BRANCHES]) expect(m.slotPos[c]).toHaveLength(3);
    setActive(m, 'D-03');
    expect(m.model.parts.filter((p) => p.code && p.lamp).map((p) => p.slot)).toEqual(['D-03']);
    setActive(m, null);
    expect(m.model.parts.some((p) => p.code && p.lamp)).toBe(false);
  });

  it('reports anchors for slots, labels, sockets and the token', () => {
    const m = buildMachine(DEFAULT_BUILD);
    const got = {};
    m.model.anchors((k, p) => { got[k] = p; }, m.model.parts.map(() => [0, 0]), (x, y, z) => [x, y + z]);
    expect(got['slot:D-04']).toBeDefined();
    expect(got['label:G-01']).toBeDefined();
    expect(got['sock:G-03:7']).toBeDefined();
    expect(got.token).toBeDefined();
  });
});
