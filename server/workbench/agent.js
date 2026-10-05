// Live mode: a real model drives the same machine. It gets mock tools only; the
// fitted parts decide which tools exist and what the warehouse lets through.
// Every step is emitted as a Workbench event (same shape as scripted runs).
import { createWarehouse, schemaText } from './tools.js';
import { CONNECTORS } from '../../src/lib/workbench/connectors.js';
import { partByCode } from '../../src/lib/workbench/parts.js';

export const MAX_TOOL_CALLS = 8;
const COST_LIMIT_GB = 500;
const CHANNEL = { 'F-01': 'Slack', 'F-02': 'Teams', 'F-03': 'the BI "Ask" box' };

function systemPrompt(build) {
  const fitted = (code) => build.branches.includes(code);
  const parts = ['D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06'].map((s) => `${s}: ${partByCode(build[s]).name}`).join('; ');
  return [
    'You are the data analysis agent inside the Acumei Workbench, a public demo. You answer questions about Northwind Logistics, an invented company, using its mock warehouse.',
    'The person asking is J. Ortiz, EMEA operations manager (role emea_manager). Today is 2026-10-06; "last month" means 2026-09.',
    `Fitted parts: ${parts}. Branches: ${build.branches.length ? build.branches.join(', ') : 'none'}.`,
    `Tables (use these exact names):\n${schemaText()}`,
    'Use get_metric_definition before choosing a metric. Use query_warehouse with a single read-only SELECT (alasql dialect, standard SQL).',
    fitted('G-01') ? 'If the question is ambiguous between definitions, call ask_clarification instead of guessing.' : '',
    'Tool results may be blocked or masked by guardrails. Never work around a guardrail; explain it instead.',
    'If the question is not about Northwind\'s data, reply with exactly OFF_TOPIC.',
    'Final answer format: first line "HEADLINE: <a number or 1–3 words>", then at most 70 words of plain text. No markdown.',
  ].filter(Boolean).join('\n\n');
}

function toolDefs(build) {
  const tools = [
    { name: 'get_metric_definition', description: 'Look up how a business metric is defined (e.g. revenue, active users).', parameters: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
    { name: 'query_warehouse', description: 'Run one read-only SELECT against the Northwind warehouse. Returns columns and rows.', parameters: { type: 'object', properties: { sql: { type: 'string' }, reasoning: { type: 'string', description: 'One sentence: why this query.' } }, required: ['sql'] } },
  ];
  if (build.branches.includes('G-01')) {
    tools.push({ name: 'ask_clarification', description: 'Ask the person a clarifying question when two definitions fit.', parameters: { type: 'object', properties: { question: { type: 'string' }, options: { type: 'array', items: { type: 'string' }, maxItems: 3 } }, required: ['question', 'options'] } });
  }
  return tools;
}

const clock = (d) => d.toISOString().slice(11, 19);
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'option';

function parseFinal(text) {
  const t = String(text || '').trim();
  const m = t.match(/^HEADLINE:\s*(.+)$/im);
  const headline = (m ? m[1] : t.split(/\s+/).slice(0, 3).join(' ')).trim().slice(0, 40);
  const body = (m ? t.replace(m[0], '') : t).trim().slice(0, 700);
  return { headline, body };
}

// A chart when the last result is label + number.
function chartFrom(res) {
  if (!res || !res.rows?.length || res.columns.length < 2) return null;
  const vi = res.columns.findIndex((c, i) => i > 0 && res.rows.every((r) => typeof r[i] === 'number'));
  if (vi < 0) return null;
  const rows = res.rows.slice(0, 12).map((r) => ({ label: String(r[0] ?? '••••'), value: Math.round(r[vi] * 10) / 10 }));
  return { unit: res.columns[vi], rows };
}

export async function runAgent({ build, question, clarify, provider, emit: out, deadlineMs, now = () => new Date() }) {
  const audit = build.branches.includes('G-05');
  const has = (c) => build.branches.includes(c);
  const wh = createWarehouse(build);
  const conn = CONNECTORS[build['D-04']];
  const auditLines = [];
  let n = 0;
  const emit = (e) => {
    const ev = { id: n++, t: clock(now()), ...e };
    if (audit && e.audit) auditLines.push(e.audit); else delete ev.audit;
    out(ev);
    return ev;
  };

  emit({ step: 'D-01', kind: 'intake', verdict: 'pass', summary: `“${question}” from J. Ortiz via ${CHANNEL[build['D-01']]}`, reasoning: clarify ? `J. Ortiz clarified: ${clarify}` : 'A live question, answered by a real model against the mock warehouse.', audit: 'intake    live question' });

  const messages = [
    { role: 'system', content: systemPrompt(build) },
    { role: 'user', content: clarify ? `${question}\n\n(Clarification from J. Ortiz: ${clarify})` : question },
  ];
  const tools = toolDefs(build);
  let calls = 0, accessShown = false, last = null, leaked = false, queried = false;

  while (true) {
    if (Date.now() > deadlineMs) { emit({ kind: 'error', step: 'D-04', summary: 'Stopped: this run hit the 30-second limit.' }); return; }
    let resp;
    try {
      resp = await provider.chat({ messages, tools });
    } catch {
      emit({ kind: 'error', step: 'D-01', summary: 'The model could not be reached. Try a scripted scenario instead.' });
      return;
    }

    if (!resp.toolCalls?.length) {
      const text = String(resp.content || '').trim();
      if (text === 'OFF_TOPIC' || !text) {
        emit({ step: 'D-06', kind: 'answer', summary: 'Off topic', answer: { headline: 'Off topic', title: 'Outside this workbench', text: "This workbench only answers questions about Northwind's data: revenue, customers, active users, SKUs and (if your access allows) HR.", chart: null, flagged: null, contrast: null, delivered: null } });
        return;
      }
      const { headline, body } = parseFinal(text);

      if (build['D-05'] === 'F-11') {
        const ok = queried && last && !last.error && last.rows.length > 0;
        emit({ step: 'D-05', kind: 'validate', verdict: ok ? 'pass' : 'flagged', summary: ok ? `Checked: ${last.rows.length} rows, totals present, no impossible values` : 'Flagged: the answer was not backed by a successful query', audit: `validate  ${ok ? 'ok' : 'unbacked answer'}` });
      } else {
        emit({ step: 'D-05', kind: 'validate', verdict: 'flagged', summary: 'Pass-through: no checks run, the result goes out as-is', audit: 'validate  skipped (pass-through)' });
      }

      let posted = true;
      if (has('G-04')) {
        posted = false;
        emit({ step: 'G-04', kind: 'guard', verdict: 'paused', summary: 'Held for an analyst to review before it is posted', audit: 'review    held for analyst' });
      }
      const fmt = partByCode(build['D-06']).name;
      emit({ step: 'D-06', kind: 'deliver', verdict: posted ? (leaked ? 'leaked' : 'pass') : 'paused', summary: posted ? `Posted as ${fmt.toLowerCase()} to #emea-ops` : 'Waiting on the analyst; nothing posted yet', audit: `deliver   ${posted ? 'posted' : 'held'}` });
      if (audit) emit({ step: 'G-05', kind: 'guard', verdict: 'pass', summary: `${auditLines.length} entries sealed`, audit: 'seal' });
      emit({
        step: 'D-06', kind: 'answer', summary: headline,
        answer: {
          headline, title: question, text: body, chart: chartFrom(last),
          flagged: leaked ? 'Personal data reached the answer: names and salaries were visible to the agent and the channel.' : null,
          contrast: null,
          delivered: { to: '#emea-ops', format: fmt, posted },
        },
      });
      return;
    }

    messages.push({ role: 'assistant', content: resp.content ?? null, tool_calls: resp.toolCalls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: JSON.stringify(c.args || {}) } })) });

    for (const c of resp.toolCalls) {
      if (++calls > MAX_TOOL_CALLS) { emit({ kind: 'error', step: 'D-04', summary: `Stopped after ${MAX_TOOL_CALLS} steps without an answer.` }); return; }
      const a = c.args || {};
      let result;

      if (c.name === 'get_metric_definition') {
        const def = wh.definition(a.name);
        emit({ step: 'D-02', kind: 'resolve', verdict: build['D-02'] === 'F-05' ? 'flagged' : 'pass', summary: `Looked up “${String(a.name).slice(0, 40)}”`, definition: def, audit: `resolve   ${String(a.name).slice(0, 30)}` });
        result = def;
      } else if (c.name === 'ask_clarification' && has('G-01')) {
        const opts = (Array.isArray(a.options) ? a.options : []).slice(0, 3).map((o) => ({ id: slug(o), label: String(o).slice(0, 60) }));
        emit({ step: 'G-01', kind: 'pause', verdict: 'paused', summary: String(a.question || 'Which do you mean?').slice(0, 200), pause: { id: 'clarify', prompt: String(a.question || 'Which do you mean?').slice(0, 200), options: opts, chosen: null, live: true }, audit: 'clarify   asked j.ortiz' });
        return;
      } else if (c.name === 'query_warehouse') {
        const sql = String(a.sql || '').slice(0, 2000);
        const denied = wh.denied(sql);
        if (denied) {
          accessShown = true;
          last = { error: denied };
          emit({ step: 'D-03', kind: 'access', verdict: 'blocked', summary: `Denied: ${denied}`, sql, reasoning: 'The agent runs as the person asking, so it inherits their permissions.', audit: `access    DENIED ${denied.slice(0, 50)}` });
          messages.push({ role: 'tool', tool_call_id: c.id, content: JSON.stringify({ error: denied }) });
          continue;
        }
        if (!accessShown) {
          accessShown = true;
          if (build['D-03'] === 'F-07') emit({ step: 'D-03', kind: 'access', verdict: 'flagged', summary: 'Runs as svc_analytics: can read every table', audit: 'access    svc_analytics (full)' });
          else emit({ step: 'D-03', kind: 'access', verdict: 'pass', summary: 'Runs as J. Ortiz (emea_manager): EMEA rows only, no HR', audit: 'access    j.ortiz · rows ∩ region=EMEA' });
        }
        const gb = wh.estimateGb(sql);
        if (has('G-03')) {
          if (gb > COST_LIMIT_GB) {
            emit({ step: 'G-03', kind: 'pause', verdict: 'paused', summary: `Estimated scan ${(gb / 1000).toFixed(1)} TB (${conn.cost(gb)}) is over the 500 GB limit`, sql, pause: { id: 'cost', prompt: 'In production an approver would be asked before this scan runs.', options: [], chosen: null, live: true }, audit: `cost      est ${gb} GB held` });
            return;
          }
          emit({ step: 'G-03', kind: 'guard', verdict: 'pass', summary: `Estimated scan ${gb} GB, under the limit`, audit: `cost      est ${gb} GB ok` });
        }
        const r = wh.query(sql);
        last = r;
        if (r.verdict === 'blocked') {
          emit({ step: /permission/.test(r.error) ? 'D-03' : 'D-04', kind: /permission/.test(r.error) ? 'access' : 'query', verdict: 'blocked', summary: r.error, sql, audit: `query     blocked: ${r.error.slice(0, 60)}` });
          result = JSON.stringify({ error: r.error });
        } else if (r.error) {
          emit({ step: 'D-04', kind: 'query', verdict: 'flagged', summary: r.error, sql, audit: 'query     error' });
          result = JSON.stringify({ error: r.error });
        } else {
          queried = true;
          const personal = r.columns.some((col) => /(^|_)(name|email)$/i.test(col)) && r.columns.some((col) => /salary/i.test(col));
          const leak = personal && !r.masked.length;
          leaked = leaked || leak;
          emit({
            step: 'D-04', kind: 'query', verdict: leak ? 'leaked' : 'pass',
            summary: `${r.rows.length} rows · scanned ${gb} GB on ${conn.name}${gb > COST_LIMIT_GB ? ` · ${conn.cost(gb)}, unapproved` : ''}`,
            sql, reasoning: a.reasoning ? String(a.reasoning).slice(0, 300) : undefined,
            rows: { columns: r.columns, rows: r.rows.slice(0, 20), masked: r.masked.length ? r.masked : undefined },
            audit: `query     ${conn.name.toLowerCase()} ${gb} GB ${r.rows.length} rows`,
          });
          if (r.masked.length) emit({ step: 'G-02', kind: 'guard', verdict: 'pass', summary: `Masked ${r.masked.join(', ')} before the model saw them`, rows: { columns: r.columns, rows: r.rows.slice(0, 5), masked: r.masked }, audit: `pii       masked ${r.masked.join(', ')}` });
          result = JSON.stringify({ columns: r.columns, rows: r.rows.slice(0, 50), masked: r.masked, truncated: r.truncated || r.rows.length > 50 });
        }
      } else {
        result = JSON.stringify({ error: `Unknown tool ${c.name}` });
      }
      messages.push({ role: 'tool', tool_call_id: c.id, content: String(result).slice(0, 8000) });
    }
  }
}
