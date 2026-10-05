import { describe, it, expect } from 'vitest';
import { handle } from '../../api/workbench/run';
import { createLimiter, PER_VISITOR } from '../../server/workbench/limiter';
import { createOpenAI } from '../../server/workbench/openai';

const req = (body, ip = '203.0.113.7') => new Request('http://x/api/workbench/run', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body),
});
const lines = async (res) => (await res.text()).trim().split('\n').map((l) => JSON.parse(l));
const okLimiter = { take: async () => ({ ok: true, left: 4 }) };
const answering = { chat: async () => ({ content: 'HEADLINE: 3\nThree.', toolCalls: [] }) };

describe('POST /api/workbench/run', () => {
  it('rejects empty and over-long questions', async () => {
    expect((await lines(await handle(req({ question: '' }), { env: {}, provider: answering, limiter: okLimiter })))[0].kind).toBe('error');
    const long = await handle(req({ question: 'x'.repeat(301) }), { env: {}, provider: answering, limiter: okLimiter });
    expect(long.status).toBe(400);
    expect((await lines(long))[0].summary).toMatch(/300/);
  });

  it('says plainly when live mode has no key', async () => {
    const ev = await lines(await handle(req({ question: 'Revenue?' }), { env: {}, limiter: okLimiter }));
    expect(ev).toEqual([{ kind: 'error', summary: "Live mode isn't switched on yet. The scripted scenarios all work." }]);
  });

  it('never uses the fake provider in production', async () => {
    const ev = await lines(await handle(req({ question: 'Revenue?' }), { env: { WORKBENCH_FAKE_PROVIDER: '1', VERCEL_ENV: 'production' }, limiter: okLimiter }));
    expect(ev[0].summary).toMatch(/isn't switched on/);
  });

  it('refuses when the limiter says no', async () => {
    const res = await handle(req({ question: 'Revenue?' }), { env: {}, provider: answering, limiter: { take: async () => ({ ok: false, left: 0, reason: 'Used up.' }) } });
    expect(res.status).toBe(429);
    expect((await lines(res))[0].summary).toBe('Used up.');
  });

  it('streams a meta line then events ending in an answer', async () => {
    const ev = await lines(await handle(req({ question: 'How many months?', b: 'F01.F04.F06.F08.F11.F13' }), { env: {}, provider: answering, limiter: okLimiter }));
    expect(ev[0]).toEqual({ kind: 'meta', left: 4, live: true });
    expect(ev[ev.length - 1].kind).toBe('answer');
  });

  it('runs end to end with the fake provider in development', async () => {
    const ev = await lines(await handle(req({ question: 'Show me salaries by name', b: 'F01.F04.F07.F08.F11.F13.G02' }), { env: { WORKBENCH_FAKE_PROVIDER: '1' }, limiter: okLimiter }));
    expect(ev.find((e) => e.step === 'G-02').rows.masked).toContain('name');
    expect(ev[ev.length - 1].kind).toBe('answer');
  });
});

describe('limiter', () => {
  it(`allows ${PER_VISITOR} runs per visitor per day in memory`, async () => {
    const lim = createLimiter({});
    const ip = `198.51.100.${Math.floor(Math.random() * 200)}`;
    const results = [];
    for (let i = 0; i < PER_VISITOR + 1; i++) results.push(await lim.take(ip));
    expect(results.map((r) => r.ok)).toEqual([true, true, true, true, true, false]);
    expect(results[0].left).toBe(PER_VISITOR - 1);
  });

  it('uses Upstash REST when configured', async () => {
    const calls = [];
    const fetchImpl = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return new Response(JSON.stringify([{ result: 2 }, { result: 1 }, { result: 40 }, { result: 1 }])); };
    const r = await createLimiter({ UPSTASH_REDIS_REST_URL: 'https://r.example', UPSTASH_REDIS_REST_TOKEN: 't' }, fetchImpl).take('1.2.3.4');
    expect(calls[0].url).toBe('https://r.example/pipeline');
    expect(calls[0].body[0][0]).toBe('INCR');
    expect(r).toEqual({ ok: true, left: PER_VISITOR - 2 });
  });
});

describe('OpenAI adapter', () => {
  it('sends tools as functions and parses tool calls', async () => {
    let sent;
    const fetchImpl = async (url, init) => {
      sent = JSON.parse(init.body);
      return new Response(JSON.stringify({ choices: [{ message: { content: null, tool_calls: [{ id: 'c1', type: 'function', function: { name: 'query_warehouse', arguments: '{"sql":"SELECT 1"}' } }] } }] }));
    };
    const r = await createOpenAI({ apiKey: 'k', fetchImpl }).chat({ messages: [{ role: 'user', content: 'hi' }], tools: [{ name: 'query_warehouse', parameters: {} }] });
    expect(sent.tools[0]).toEqual({ type: 'function', function: { name: 'query_warehouse', parameters: {} } });
    expect(r.toolCalls).toEqual([{ id: 'c1', name: 'query_warehouse', args: { sql: 'SELECT 1' } }]);
  });

  it('throws on API errors so the agent can report them', async () => {
    const fetchImpl = async () => new Response('nope', { status: 401 });
    await expect(createOpenAI({ apiKey: 'k', fetchImpl }).chat({ messages: [], tools: [] })).rejects.toThrow(/401/);
  });
});
