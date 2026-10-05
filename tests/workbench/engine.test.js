import { describe, it, expect } from 'vitest';
import { run, SCENARIOS } from '../../src/lib/workbench/engine';
import { DEFAULT_BUILD, fit, normalise } from '../../src/lib/workbench/build';
import { MODULES, BRANCHES, partsForSlot } from '../../src/lib/workbench/parts';

const with_ = (...codes) => codes.reduce((b, c) => fit(b, c), DEFAULT_BUILD);
const last = (ev) => ev[ev.length - 1];
const step = (ev, code) => ev.find((e) => e.step === code);
const answer = (ev) => { const a = last(ev); expect(a.kind).toBe('answer'); return a.answer; };

describe('scenarios', () => {
  it('lists the four launch scenarios', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual(['revenue', 'active-users', 'salaries', 'skus']);
  });
});

describe('revenue', () => {
  it('default build: reconciliation catches the duplicate join, answer is −12%', () => {
    const ev = run(DEFAULT_BUILD, 'revenue');
    expect(step(ev, 'D-05').verdict).toBe('fixed');
    const a = answer(ev);
    expect(a.headline).toBe('−12%');
    expect(a.flagged).toBeFalsy();
    expect(a.contrast).toMatch(/G-04|analyst/i);
    expect(a.chart.rows[0].label).toBe('Halden Freight Co');
  });

  it('pass-through ships the double-counted −19%', () => {
    const a = answer(run(with_('F-12'), 'revenue'));
    expect(a.headline).toBe('−19%');
    expect(a.flagged).toMatch(/−12%/);
  });

  it('raw schema + pass-through ships gross −7%', () => {
    const a = answer(run(with_('F-05', 'F-12'), 'revenue'));
    expect(a.headline).toBe('−7%');
    expect(a.flagged).toBeTruthy();
  });

  it('raw schema + reconciliation is caught and fixed', () => {
    const ev = run(with_('F-05'), 'revenue');
    expect(step(ev, 'D-02').verdict).toBe('flagged');
    expect(step(ev, 'D-05').verdict).toBe('fixed');
    expect(answer(ev).headline).toBe('−12%');
  });

  it('analyst review pauses, and the choice decides delivery', () => {
    const b = with_('G-04');
    const ev = run(b, 'revenue');
    expect(last(ev).kind).toBe('pause');
    expect(last(ev).pause.id).toBe('review');
    expect(answer(run(b, 'revenue', { review: 'approve' })).delivered.posted).toBe(true);
    const rej = run(b, 'revenue', { review: 'reject' });
    expect(answer(rej).delivered.posted).toBe(false);
    expect(step(rej, 'D-06').verdict).toBe('blocked');
  });

  it('a shared service account is flagged as over-privileged', () => {
    expect(step(run(with_('F-07'), 'revenue'), 'D-03').verdict).toBe('flagged');
  });
});

describe('active users', () => {
  it('clarify pauses and the visitor picks the definition', () => {
    const b = with_('G-01');
    expect(last(run(b, 'active-users')).pause.id).toBe('clarify');
    expect(answer(run(b, 'active-users', { clarify: '30d' })).headline).toBe('31,960');
    expect(answer(run(b, 'active-users', { clarify: '7d' })).headline).toBe('18,420');
  });

  it('without clarify the agent silently picks 7-day and the answer is flagged', () => {
    const a = answer(run(DEFAULT_BUILD, 'active-users'));
    expect(a.headline).toBe('18,420');
    expect(a.flagged).toMatch(/31,960/);
  });
});

describe('salaries', () => {
  const names = (ev) => JSON.stringify(ev).match(/Avery Quill|Esme Varn|Linnea Strand/g);

  it('role-based access blocks the query and nothing personal appears', () => {
    const ev = run(DEFAULT_BUILD, 'salaries');
    expect(step(ev, 'D-03').verdict).toBe('blocked');
    expect(step(ev, 'D-04')).toBeUndefined();
    expect(answer(ev).text).toMatch(/can.t share/i);
    expect(names(ev)).toBeNull();
  });

  it('a service account without the PII guard leaks named salaries', () => {
    const ev = run(with_('F-07'), 'salaries');
    expect(step(ev, 'D-04').verdict).toBe('leaked');
    expect(names(ev)).not.toBeNull();
    expect(answer(ev).flagged).toMatch(/personal/i);
  });

  it('the PII guard masks names everywhere', () => {
    const ev = run(with_('F-07', 'G-02'), 'salaries');
    const g = step(ev, 'G-02');
    expect(g.verdict).toBe('pass');
    expect(g.rows.masked).toContain('name');
    expect(names(ev)).toBeNull();
    expect(answer(ev).contrast).toMatch(/PII guard/);
  });
});

describe('skus', () => {
  it('without a cost gate the scan runs and the cost is called out', () => {
    const a = answer(run(DEFAULT_BUILD, 'skus'));
    expect(a.contrast).toMatch(/\$11\.50/);
  });

  it('the cost gate pauses; approve runs, deny does not', () => {
    const b = with_('G-03');
    expect(last(run(b, 'skus')).pause.id).toBe('cost');
    expect(answer(run(b, 'skus', { cost: 'approve' })).chart.rows.length).toBeGreaterThan(0);
    const d = run(b, 'skus', { cost: 'deny' });
    expect(answer(d).headline).toMatch(/not run/i);
    expect(step(d, 'D-04').verdict).toBe('blocked');
  });
});

describe('audit log', () => {
  it('only records when G-05 is fitted, and seals the run', () => {
    expect(run(DEFAULT_BUILD, 'revenue').some((e) => e.audit)).toBe(false);
    const ev = run(with_('G-05'), 'revenue');
    expect(ev.filter((e) => e.kind !== 'answer').every((e) => e.audit)).toBe(true);
    const seal = ev[ev.length - 2];
    expect(seal.step).toBe('G-05');
    expect(seal.summary).toMatch(/sealed/);
  });
});

describe('every build', () => {
  // All module combinations × a spread of branch sets × every scenario × every pause choice.
  const moduleSets = MODULES.reduce((acc, slot) => acc.flatMap((b) => partsForSlot(slot).map((p) => ({ ...b, [slot]: p.code }))), [{}]);
  const branchSets = [[], BRANCHES, ['G-01', 'G-03'], ['G-02', 'G-04'], ['G-05']];
  const choiceSets = [{}, { clarify: '7d', cost: 'approve', review: 'approve' }, { clarify: '30d', cost: 'deny', review: 'reject' }];

  it('always ends in an answer or a pause, with sequential ids and step codes from the catalogue', () => {
    const codes = new Set([...MODULES, ...BRANCHES]);
    let n = 0;
    for (const m of moduleSets) for (const branches of branchSets) for (const s of SCENARIOS) for (const c of choiceSets) {
      const ev = run(normalise({ ...m, branches }), s.id, c);
      const end = last(ev);
      expect(['answer', 'pause']).toContain(end.kind);
      ev.forEach((e, i) => { expect(e.id).toBe(i); if (e.kind !== 'answer') expect(codes.has(e.step)).toBe(true); });
      n++;
    }
    expect(n).toBe(216 * 5 * 4 * 3);
  });

  it('is deterministic', () => {
    const b = with_('F-07', 'G-02', 'G-05');
    expect(run(b, 'salaries')).toEqual(run(b, 'salaries'));
  });
});
