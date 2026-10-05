// The run engine: run(build, scenarioId, choices) → Event[]. Pure and
// deterministic. The page plays the events back; live mode produces the same
// shape from a real model. A run ends with an `answer` event, or with a `pause`
// event when it needs a choice the visitor hasn't made yet (re-run with
// choices[pause.id] set to continue).
import { normalise, hasPart } from './build';
import { CONNECTORS } from './connectors';
import { SCENARIO_LIST, SCENARIO_BY_ID } from './scenarios/index';

export const SCENARIOS = SCENARIO_LIST.map(({ id, title, question, asker }) => ({ id, title, question, asker }));

const CHANNEL = {
  'F-01': { label: 'Slack', where: '#emea-ops' },
  'F-02': { label: 'Teams', where: 'EMEA Ops' },
  'F-03': { label: 'the BI "Ask" box', where: 'BI Ask' },
};

const pad2 = (n) => String(n).padStart(2, '0');
const clockAt = (s) => `14:${pad2(2 + Math.floor((11 + s) / 60))}:${pad2((11 + s) % 60)}`;

// Short, stable fingerprint for the audit seal (not cryptography; it's a mock).
function fingerprint(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, '0');
}

export function run(build, scenarioId, choices = {}) {
  const b = normalise(build);
  const sc = SCENARIO_BY_ID[scenarioId];
  if (!sc) throw new Error(`Unknown scenario ${scenarioId}`);
  const audit = b.branches.includes('G-05');
  const events = [];
  let stopped = false, secs = 0;

  const ctx = {
    build: b,
    choices,
    scenario: sc,
    has: (code) => hasPart(b, code),
    part: (slot) => b[slot],
    connector: CONNECTORS[b['D-04']],
    channel: CHANNEL[b['D-01']],
    get stopped() { return stopped; },

    emit(e) {
      if (stopped) return null;
      secs += e.secs || 1;
      const { secs: _drop, ...rest } = e;
      const ev = { id: events.length, t: clockAt(secs), ...rest };
      if (!audit) delete ev.audit;
      events.push(ev);
      return ev;
    },

    // Emits a pause; returns the chosen option id, or null (and stops) if none yet.
    pause({ step, id, prompt, options, audit: a }) {
      const pick = choices[id];
      const valid = options.some((o) => o.id === pick);
      const chosen = valid ? options.find((o) => o.id === pick) : null;
      ctx.emit({
        step, kind: 'pause', verdict: 'paused',
        summary: chosen ? `${prompt} → ${chosen.label}` : prompt,
        pause: { id, prompt, options, chosen: chosen ? chosen.id : null },
        audit: `${a || `${step} pause ${id}`} → ${chosen ? chosen.id : 'waiting'}`,
      });
      if (!chosen) { stopped = true; return null; }
      return chosen.id;
    },

    finish(answer) {
      if (stopped) return;
      if (audit) {
        const n = events.length;
        const hash = fingerprint(events.map((e) => e.audit).join('\n'));
        ctx.emit({ step: 'G-05', kind: 'guard', verdict: 'pass', summary: `${n} entries sealed · chain ${hash.slice(0, 4)}…${hash.slice(-4)}`, audit: `seal ${hash}` });
      }
      events.push({ id: events.length, t: clockAt(secs + 1), kind: 'answer', step: 'D-06', summary: answer.headline, answer });
      stopped = true;
    },
  };

  sc.steps(ctx);
  return events;
}
