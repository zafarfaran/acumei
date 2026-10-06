import { describe, it, expect } from 'vitest';
import { verdictOf } from '../../src/lib/workbench/verdict';
import { CHALLENGES } from '../../src/lib/workbench/challenges';
import { run } from '../../src/lib/workbench/engine';
import { DEFAULT_BUILD, fit } from '../../src/lib/workbench/build';

const v = (build, s, choices) => verdictOf(run(build, s, choices));

describe('verdict banner', () => {
  it('is null before anything has run', () => {
    expect(verdictOf([])).toBeNull();
  });

  it('calls out leaks, wrong numbers and unapproved spend as bad', () => {
    expect(v(fit(DEFAULT_BUILD, 'F-07'), 'salaries')).toMatchObject({ tone: 'bad', title: expect.stringMatching(/leaked/i) });
    expect(v(fit(DEFAULT_BUILD, 'F-12'), 'revenue')).toMatchObject({ tone: 'bad', title: expect.stringMatching(/wrong/i) });
    expect(v(DEFAULT_BUILD, 'skus')).toMatchObject({ tone: 'bad', title: expect.stringMatching(/\$11\.50/) });
    expect(v(DEFAULT_BUILD, 'active-users')).toMatchObject({ tone: 'bad', title: expect.stringMatching(/guess/i) });
  });

  it('praises the guardrail that saved the run', () => {
    expect(v(DEFAULT_BUILD, 'salaries')).toMatchObject({ tone: 'good', title: expect.stringMatching(/refused/i) });
    expect(v(fit(fit(DEFAULT_BUILD, 'F-07'), 'G-02'), 'salaries')).toMatchObject({ tone: 'good', title: expect.stringMatching(/hidden/i) });
    expect(v(DEFAULT_BUILD, 'revenue')).toMatchObject({ tone: 'good', title: expect.stringMatching(/caught/i) });
    expect(v(fit(DEFAULT_BUILD, 'G-01'), 'active-users', { clarify: '30d' })).toMatchObject({ tone: 'good', title: expect.stringMatching(/asked/i) });
  });

  it('says it is waiting when a run is paused', () => {
    expect(v(fit(DEFAULT_BUILD, 'G-03'), 'skus')).toMatchObject({ tone: 'wait' });
  });
});

describe('challenges', () => {
  it('each one breaks on its own build and is fixed by its fix part', () => {
    for (const c of CHALLENGES) {
      expect(v(c.build, c.scenario).tone, c.id).toBe('bad');
      const fixed = verdictOf(run(fit(c.build, c.fix), c.scenario, c.fixChoices || {}));
      expect(fixed.tone, c.id).not.toBe('bad');
    }
  });
});
