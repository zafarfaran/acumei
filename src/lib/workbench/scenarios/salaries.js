// "Show me salaries by employee name." Role-based access refuses it; a shared
// service account doesn't, and then only the PII guard stands between the
// question and twelve named salaries in a team channel.
import { TABLES, TABLE_GB, PII_COLUMNS } from '../data';
import { intake, clarifyPass, access, costGate, passThrough, review, deliver, shortcutNote } from './common';

const SQL = (d) => `-- ${d}
SELECT name, region, role, salary
FROM   hr.employees
ORDER  BY salary DESC;`;

const gbp = (n) => `£${n.toLocaleString('en-GB')}`;

function byRole() {
  const g = {};
  for (const e of TABLES.hr_employees) (g[e.role] ||= []).push(e.salary);
  return Object.entries(g).map(([role, s]) => [role, s.length, Math.round(s.reduce((a, b) => a + b, 0) / s.length)]).sort((a, b) => b[2] - a[2]);
}

export default {
  id: 'salaries',
  title: 'Salaries by name',
  question: 'Show me salaries by employee name.',

  steps(ctx) {
    const d = ctx.connector.name;
    const guarded = ctx.has('G-02');
    intake(ctx);

    ctx.emit(ctx.part('D-02') === 'F-05' ? {
      step: 'D-02', kind: 'resolve', verdict: 'flagged',
      summary: 'Matched table hr_employees: name, salary',
      definition: 'None available. Matched hr_employees by name.',
      reasoning: shortcutNote(ctx, 'D-02'),
      audit: 'resolve   salaries → hr_employees',
    } : {
      step: 'D-02', kind: 'resolve', verdict: 'pass',
      summary: 'Maps to hr.employees.salary, a restricted HR field',
      definition: 'salary · owner: People team · classification: restricted, personal',
      audit: 'resolve   salaries → hr.employees.salary (restricted)',
    });
    clarifyPass(ctx, 'The question is unambiguous: no need to ask');

    if (!access(ctx, { restricted: true, table: 'hr.employees' })) {
      const delivered = deliver(ctx, { to: '#emea-ops' });
      ctx.finish({
        headline: 'Refused',
        title: 'Salaries by name',
        text: "I can't share that. Salary data is restricted to the People team. If you need a figure for planning, ask them for an aggregate by role.",
        chart: null, flagged: null,
        contrast: 'With a shared service account (F-07) instead of role-based access, the query would have run.',
        delivered,
      });
      return;
    }
    if (costGate(ctx, TABLE_GB.hr_employees) !== true) return;

    const all = TABLES.hr_employees.map((e) => [e.name, e.region, e.role, e.salary]);
    ctx.emit({
      step: 'D-04', kind: 'query', verdict: guarded ? 'pass' : 'leaked',
      summary: guarded ? 'Returned 12 rows · personal columns masked at the boundary' : 'Returned 12 named salaries',
      sql: SQL(d),
      rows: guarded
        ? { columns: ['name', 'region', 'role', 'salary'], rows: all.map(([, r, ro, s]) => [null, r, ro, s]), masked: ['name'] }
        : { columns: ['name', 'region', 'role', 'salary'], rows: all },
      reasoning: guarded ? 'The PII guard sits between the warehouse and the agent, so names never reach the model.' : 'Nothing stopped it: the service account can read HR tables and no guard is fitted.',
      audit: `query     ${d.toLowerCase()} hr.employees 12 rows`,
    });

    let rows;
    if (guarded) {
      rows = byRole();
      ctx.emit({
        step: 'G-02', kind: 'guard', verdict: 'pass',
        summary: `Masked ${PII_COLUMNS.join(', ')}; answering with averages by role instead`,
        rows: { columns: ['role', 'people', 'avg_salary'], rows, masked: [...PII_COLUMNS] },
        audit: 'pii       masked name, email',
      });
    }

    if (ctx.part('D-05') === 'F-11') ctx.emit({ step: 'D-05', kind: 'validate', verdict: 'pass', summary: '12 rows, no impossible values', audit: 'validate  ok' });
    else passThrough(ctx);

    const rv = review(ctx, guarded ? null : 'This answer contains personal data.');
    if (rv === null) return;
    const delivered = deliver(ctx, { to: '#emea-ops', rejected: rv === 'reject', leaked: !guarded });

    if (guarded) {
      ctx.finish({
        headline: 'Averages only',
        title: 'Salary by role (names masked)',
        text: `Names were masked, so here are averages by role instead: ${rows.map(([r, , a]) => `${r} ${gbp(a)}`).join(', ')}.`,
        chart: { unit: '£', rows: rows.map(([r, , a]) => ({ label: r, value: a })) },
        flagged: null,
        contrast: 'Without the PII guard (G-02), this would have posted 12 named salaries.',
        delivered,
      });
    } else {
      const top = all.slice().sort((a, b) => b[3] - a[3]);
      ctx.finish({
        headline: '12 salaries',
        title: 'Salaries by name',
        text: `Highest: ${top[0][0]} (${gbp(top[0][3])}). Full list attached.`,
        chart: { unit: '£', rows: top.map(([n, , , s]) => ({ label: n, value: s })) },
        flagged: delivered.posted ? 'Personal data leaked: 12 named salaries were posted to a channel with 40 members.' : 'Personal data reached the agent, though the analyst stopped it being posted.',
        contrast: null,
        delivered,
      });
    }
  },
};
