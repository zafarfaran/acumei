import { describe, it, expect } from 'vitest';
import { SLOTS, PARTS, partByCode, partsForSlot } from '../../src/lib/workbench/parts';
import { DEFAULT_BUILD, normalise, encodeBuild, decodeBuild, fit, remove } from '../../src/lib/workbench/build';

describe('parts catalogue', () => {
  it('has six modules and five branches', () => {
    expect(SLOTS.filter((s) => s.kind === 'module').map((s) => s.code)).toEqual(['D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06']);
    expect(SLOTS.filter((s) => s.kind === 'branch').map((s) => s.code)).toEqual(['G-01', 'G-02', 'G-03', 'G-04', 'G-05']);
  });

  it('every module slot has at least two parts and every part fits a real slot', () => {
    for (const s of SLOTS.filter((x) => x.kind === 'module')) expect(partsForSlot(s.code).length).toBeGreaterThanOrEqual(2);
    for (const p of PARTS) expect(SLOTS.some((s) => s.code === p.slot)).toBe(true);
    expect(partByCode('F-07').shortcut).toBe(true);
    expect(partByCode('G-03').slot).toBe('G-03');
  });
});

describe('build', () => {
  it('encodes the default build and decodes it back', () => {
    expect(encodeBuild(DEFAULT_BUILD)).toBe('F01.F04.F06.F08.F11.F13');
    expect(decodeBuild('F01.F04.F06.F08.F11.F13')).toEqual(DEFAULT_BUILD);
  });

  it('round-trips a build with branches in canonical order', () => {
    const b = decodeBuild('F02.F05.F07.F09.F12.F15.G04.G02');
    expect(b['D-01']).toBe('F-02');
    expect(b.branches).toEqual(['G-02', 'G-04']);
    expect(encodeBuild(b)).toBe('F02.F05.F07.F09.F12.F15.G02.G04');
  });

  it('falls back to defaults for garbage and missing slots', () => {
    expect(decodeBuild('nonsense')).toEqual(DEFAULT_BUILD);
    expect(decodeBuild('')).toEqual(DEFAULT_BUILD);
    expect(decodeBuild(null)).toEqual(DEFAULT_BUILD);
    expect(decodeBuild('F09.G03')['D-04']).toBe('F-09');
    expect(decodeBuild('F09.G03')['D-01']).toBe('F-01');
    expect(normalise({ 'D-02': 'F-13', branches: ['G-01', 'G-01', 'X'] })).toEqual({ ...DEFAULT_BUILD, branches: ['G-01'] });
  });

  it('fits and removes parts without mutating the input', () => {
    const b1 = fit(DEFAULT_BUILD, 'F-07');
    expect(b1['D-03']).toBe('F-07');
    expect(DEFAULT_BUILD['D-03']).toBe('F-06');
    const b2 = fit(b1, 'G-03');
    expect(b2.branches).toEqual(['G-03']);
    expect(fit(b2, 'G-03').branches).toEqual(['G-03']);
    expect(remove(b2, 'G-03').branches).toEqual([]);
    expect(remove(b2, 'D-01')).toEqual(b2);
    expect(fit(b2, 'nope')).toEqual(b2);
  });
});
