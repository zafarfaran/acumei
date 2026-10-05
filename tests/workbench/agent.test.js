import { describe, it, expect } from 'vitest';
import { runAgent } from '../../server/workbench/agent';
import { DEFAULT_BUILD, fit } from '../../src/lib/workbench/build';

// A provider that replays a script: each entry is one model turn.
const scripted = (turns) => {
  let i = 0;
  const seen = [];
  return {
    seen,
    async chat({ messages, tools }) {
      seen.push({ messages: messages.map((m) => ({ ...m })), tools: tools.map((t) => t.name) });
      const t = turns[Math.min(i++, turns.length - 1)];
      return typeof t === 'function' ? t(messages) : t;
    },
  };
};
const call = (name, args, id = name + Math.random()) => ({ content: null, toolCalls: [{ id, name, args }] });
const final = (content) => ({ content, toolCalls: [] });

async function collect(opts) {
  const events = [];
  await runAgent({ deadlineMs: Date.now() + 5000, ...opts, emit: (e) => events.push(e) });
  return events;
}

describe('live agent loop', () => {
  it('runs definition → query → answer and emits events in rail order', async () => {
    const provider = scripted([
      call('get_metric_definition', { name: 'revenue' }),
      call('query_warehouse', { sql: "SELECT month, SUM(net_revenue) AS net FROM revenue_monthly WHERE month IN ('2026-08','2026-09') GROUP BY month", reasoning: 'Compare the two months.' }),
      final('HEADLINE: −12%\nEMEA net revenue fell from £1,000k to £875.5k.'),
    ]);
    const ev = await collect({ build: DEFAULT_BUILD, question: 'Why did EMEA revenue drop?', provider });
    expect(ev.map((e) => e.step)).toEqual(['D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06', 'D-06']);
    expect(ev.map((e) => e.id)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    const q = ev.find((e) => e.kind === 'query');
    expect(q.rows.rows.length).toBe(2);
    const a = ev[ev.length - 1];
    expect(a.kind).toBe('answer');
    expect(a.answer.headline).toBe('−12%');
    expect(a.answer.chart.rows.map((r) => r.label)).toEqual(['2026-08', '2026-09']);
    expect(ev.some((e) => e.audit)).toBe(false);
  });

  it('only offers ask_clarification when G-01 is fitted, and pauses on it', async () => {
    const p1 = scripted([final('HEADLINE: 18,420\nSeven-day actives.')]);
    await collect({ build: DEFAULT_BUILD, question: 'Active users?', provider: p1 });
    expect(p1.seen[0].tools).not.toContain('ask_clarification');

    const p2 = scripted([call('ask_clarification', { question: '7-day or 30-day?', options: ['7-day', '30-day', 'both', 'extra'] })]);
    const ev = await collect({ build: fit(DEFAULT_BUILD, 'G-01'), question: 'Active users?', provider: p2 });
    expect(p2.seen[0].tools).toContain('ask_clarification');
    const last = ev[ev.length - 1];
    expect(last.kind).toBe('pause');
    expect(last.step).toBe('G-01');
    expect(last.pause.options).toHaveLength(3);
  });

  it('role-based access blocks HR and the model is told why', async () => {
    const provider = scripted([
      call('query_warehouse', { sql: 'SELECT name, salary FROM hr_employees' }),
      final("HEADLINE: Refused\nI can't share salary data."),
    ]);
    const ev = await collect({ build: DEFAULT_BUILD, question: 'Salaries by name', provider });
    expect(ev.find((e) => e.step === 'D-03').verdict).toBe('blocked');
    expect(JSON.stringify(provider.seen[1].messages)).toMatch(/permission denied/);
    expect(JSON.stringify(ev)).not.toMatch(/Avery Quill/);
  });

  it('a service account without the PII guard leaks; with it, names are masked', async () => {
    const turns = () => [call('query_warehouse', { sql: 'SELECT name, salary FROM hr_employees' }), final('HEADLINE: 12 salaries\nHere they are.')];
    const leak = await collect({ build: fit(DEFAULT_BUILD, 'F-07'), question: 'Salaries by name', provider: scripted(turns()) });
    expect(leak.find((e) => e.kind === 'query').verdict).toBe('leaked');
    expect(leak[leak.length - 1].answer.flagged).toMatch(/personal/i);

    const safe = await collect({ build: fit(fit(DEFAULT_BUILD, 'F-07'), 'G-02'), question: 'Salaries by name', provider: scripted(turns()) });
    expect(safe.find((e) => e.step === 'G-02').rows.masked).toEqual(['name']);
    expect(JSON.stringify(safe)).not.toMatch(/Avery Quill/);
  });

  it('the cost gate pauses a 2.3 TB scan before it runs', async () => {
    const provider = scripted([call('query_warehouse', { sql: 'SELECT * FROM sku_sales' })]);
    const ev = await collect({ build: fit(DEFAULT_BUILD, 'G-03'), question: 'Every SKU', provider });
    const last = ev[ev.length - 1];
    expect(last.step).toBe('G-03');
    expect(last.kind).toBe('pause');
    expect(ev.some((e) => e.kind === 'query')).toBe(false);
  });

  it('stops after 8 tool calls', async () => {
    const provider = scripted([call('get_metric_definition', { name: 'revenue' })]);
    const ev = await collect({ build: DEFAULT_BUILD, question: 'Loop forever', provider });
    expect(ev[ev.length - 1].kind).toBe('error');
    expect(ev[ev.length - 1].summary).toMatch(/8 steps/);
  });

  it('turns OFF_TOPIC into a scoped refusal', async () => {
    const ev = await collect({ build: DEFAULT_BUILD, question: 'Write me a poem', provider: scripted([final('OFF_TOPIC')]) });
    expect(ev[ev.length - 1].answer.text).toMatch(/only answers questions about Northwind/);
  });

  it('reports provider failures as an error event', async () => {
    const provider = { chat: async () => { throw new Error('boom'); } };
    const ev = await collect({ build: DEFAULT_BUILD, question: 'Revenue?', provider });
    expect(ev[ev.length - 1]).toMatchObject({ kind: 'error' });
  });

  it('records an audit trail and a seal when G-05 is fitted', async () => {
    const provider = scripted([call('query_warehouse', { sql: 'SELECT COUNT(*) AS n FROM users_activity' }), final('HEADLINE: 3\nThree months.')]);
    const ev = await collect({ build: fit(DEFAULT_BUILD, 'G-05'), question: 'How many months?', provider });
    expect(ev.filter((e) => e.kind !== 'answer').every((e) => e.audit)).toBe(true);
    expect(ev[ev.length - 2].step).toBe('G-05');
  });
});
