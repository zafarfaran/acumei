// POST /api/workbench/run — a live Workbench run. Streams newline-delimited JSON
// events in the same shape as scripted runs. The first line is a meta event
// with the visitor's remaining runs.
import { decodeBuild } from '../../src/lib/workbench/build.js';
import { runAgent } from '../../server/workbench/agent.js';
import { createOpenAI } from '../../server/workbench/openai.js';
import { createFakeProvider } from '../../server/workbench/fakeProvider.js';
import { createLimiter } from '../../server/workbench/limiter.js';

export const MAX_QUESTION = 300;
const DEADLINE_MS = 30000;

const visitorOf = (req) => (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local').split(',')[0].trim();

function stream(run) {
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(ctl) {
      const send = (e) => ctl.enqueue(enc.encode(JSON.stringify(e) + '\n'));
      try { await run(send); } catch { send({ kind: 'error', summary: 'Something went wrong on our side. Try a scripted scenario.' }); }
      ctl.close();
    },
  });
  return new Response(body, { headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' } });
}

// One error event, as a body the client reads the same way as a stream.
const fail = (summary, status = 200) =>
  new Response(JSON.stringify({ kind: 'error', summary }) + '\n', { status, headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' } });

// deps lets tests inject a provider and limiter.
export async function handle(req, { env = process.env, provider, limiter } = {}) {
  let body;
  try { body = await req.json(); } catch { return fail('Bad request.', 400); }
  const question = String(body?.question || '').trim();
  if (!question) return fail('Ask a question first.', 400);
  if (question.length > MAX_QUESTION) return fail(`Keep questions under ${MAX_QUESTION} characters.`, 400);
  const clarify = body?.clarify ? String(body.clarify).slice(0, 80) : undefined;

  const fake = env.WORKBENCH_FAKE_PROVIDER === '1' && env.VERCEL_ENV !== 'production';
  const model = provider || (fake ? createFakeProvider() : env.OPENAI_API_KEY ? createOpenAI({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_MODEL || undefined }) : null);
  if (!model) return fail("Live mode isn't switched on yet. The scripted scenarios all work.");

  const lim = limiter || createLimiter(env);
  let gate;
  try { gate = await lim.take(visitorOf(req)); } catch { return fail('Live mode is unavailable right now. Try a scripted scenario.'); }
  if (!gate.ok) return fail(gate.reason, 429);

  const build = decodeBuild(body?.b);
  return stream(async (send) => {
    send({ kind: 'meta', left: gate.left, live: true });
    await runAgent({ build, question, clarify, provider: model, emit: send, deadlineMs: Date.now() + DEADLINE_MS });
  });
}

export function POST(request) {
  return handle(request);
}

export function GET() {
  return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
}
