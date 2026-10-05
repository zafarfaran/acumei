// "How many active users did we have last month?" Two definitions match. With
// Clarify fitted the agent asks; without it, it quietly picks one.
import { TABLES, TABLE_GB } from '../data';
import { intake, access, costGate, piiPass, passThrough, review, deliver, shortcutNote, fmtInt } from './common';

const DEFS = {
  '7d': { col: 'active_7d', label: '7-day active users', owner: 'Product' },
  '30d': { col: 'active_30d', label: '30-day active users', owner: 'Finance' },
};

const sql = (d, col) => `-- ${d}
SELECT month, ${col}
FROM   product.users_activity
WHERE  month = '2026-09';`;

export default {
  id: 'active-users',
  title: 'Active users last month',
  question: 'How many active users did we have last month?',

  steps(ctx) {
    const raw = ctx.part('D-02') === 'F-05';
    const d = ctx.connector.name;
    intake(ctx);

    ctx.emit(raw ? {
      step: 'D-02', kind: 'resolve', verdict: 'flagged',
      summary: 'Two columns look right: active_7d and active_30d',
      definition: 'None available. Matched users_activity.active_7d and users_activity.active_30d by name.',
      reasoning: shortcutNote(ctx, 'D-02'),
      audit: 'resolve   active users → 2 columns',
    } : {
      step: 'D-02', kind: 'resolve', verdict: 'pass',
      summary: 'Two governed definitions match: 7-day (Product) and 30-day (Finance)',
      definition: 'active_7d: signed in within 7 days · owner: Product\nactive_30d: signed in within 30 days · owner: Finance (used in board reporting)',
      audit: 'resolve   active users → 2 definitions',
    });

    let which = '7d', asked = false;
    if (ctx.has('G-01')) {
      const c = ctx.pause({
        step: 'G-01', id: 'clarify',
        prompt: 'Two definitions of “active users” match. Which one do you mean?',
        options: [{ id: '7d', label: '7-day active (Product)' }, { id: '30d', label: '30-day active (Finance)' }],
        audit: 'clarify   asked j.ortiz',
      });
      if (!c) return;
      which = c; asked = true;
    }
    const def = DEFS[which];

    access(ctx, { table: 'product.users_activity' });
    if (costGate(ctx, TABLE_GB.users_activity) !== true) return;

    const sep = TABLES.users_activity.find((r) => r.month === '2026-09');
    const aug = TABLES.users_activity.find((r) => r.month === '2026-08');
    ctx.emit({
      step: 'D-04', kind: 'query', verdict: 'pass',
      summary: `Scanned 3 GB in ${ctx.connector.time(3)}`,
      sql: sql(d, def.col),
      rows: { columns: ['month', def.col], rows: [['2026-09', sep[def.col]]] },
      reasoning: asked ? `Using ${def.label}, as J. Ortiz chose.` : `Picked ${def.col}, the first match. Nobody was asked.`,
      audit: `query     ${d.toLowerCase()} 3 GB`,
    });
    piiPass(ctx);

    if (ctx.part('D-05') === 'F-11') {
      const g = ((sep[def.col] - aug[def.col]) / aug[def.col]) * 100;
      ctx.emit({ step: 'D-05', kind: 'validate', verdict: 'pass', summary: `In line with August (${g > 0 ? '+' : ''}${g.toFixed(1)}%), no impossible values`, audit: 'validate  trend ok' });
    } else passThrough(ctx);

    const rv = review(ctx, asked ? null : 'The agent guessed a definition, so confidence is low.');
    if (rv === null) return;
    const delivered = deliver(ctx, { to: '#emea-ops', rejected: rv === 'reject' });

    ctx.finish({
      headline: fmtInt(sep[def.col]),
      title: `${def.label[0].toUpperCase()}${def.label.slice(1)}, September 2026`,
      text: `${fmtInt(sep[def.col])} ${def.label} in September, up from ${fmtInt(aug[def.col])} in August.`,
      chart: { unit: 'users', rows: [{ label: 'August', value: aug[def.col] }, { label: 'September', value: sep[def.col] }] },
      flagged: asked ? null : `Ambiguous: the agent used the 7-day definition without asking. Finance reports 30-day active users: ${fmtInt(sep.active_30d)}.`,
      contrast: asked ? `Without Clarify (G-01), the agent would have silently used 7-day: ${fmtInt(sep.active_7d)}.` : null,
      delivered,
    });
  },
};
