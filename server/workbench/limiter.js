// Daily limits for live runs: per visitor and a global cap. Counters live in
// Upstash Redis (REST, no SDK) when it's configured; otherwise in this
// instance's memory, which is fine for local dev but not for production.
export const PER_VISITOR = 5;

const day = (d = new Date()) => d.toISOString().slice(0, 10);
const memory = new Map();

export function createLimiter(env = {}, fetchImpl = fetch) {
  const url = env.UPSTASH_REDIS_REST_URL, token = env.UPSTASH_REDIS_REST_TOKEN;
  const cap = Number(env.WORKBENCH_DAILY_CAP) || 300;

  async function incr(keys) {
    if (!url || !token) return keys.map((k) => { const v = (memory.get(k) || 0) + 1; memory.set(k, v); return v; });
    const res = await fetchImpl(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(keys.flatMap((k) => [['INCR', k], ['EXPIRE', k, 90000]])),
    });
    if (!res.ok) throw new Error(`Upstash ${res.status}`);
    const out = await res.json();
    return keys.map((_, i) => Number(out[i * 2]?.result));
  }

  return {
    persistent: Boolean(url && token),
    // Counts this run and says whether it may go ahead.
    async take(visitor) {
      const d = day();
      const [mine, all] = await incr([`wb:${d}:v:${visitor}`, `wb:${d}:all`]);
      if (all > cap) return { ok: false, left: 0, reason: 'Live mode has reached its limit for today. Try again tomorrow, or run a scripted scenario.' };
      if (mine > PER_VISITOR) return { ok: false, left: 0, reason: `You've used your ${PER_VISITOR} live runs for today. The scripted scenarios are still open.` };
      return { ok: true, left: PER_VISITOR - mine };
    },
  };
}
