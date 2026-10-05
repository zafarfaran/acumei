// "Why did EMEA revenue drop 12% in September?" The happy path, plus the two
// quiet ways it goes wrong: guessing gross revenue (raw schema) and
// double-counting credit notes (a bad join nobody checks).
import { regionTotal, pct, customerChanges, TABLE_GB } from '../data';
import { intake, clarifyPass, access, costGate, piiPass, passThrough, review, deliver, shortcutNote, fmtPct } from './common';

const SQL_JOIN = (d) => `-- ${d}
SELECT r.month,
       SUM(r.gross_revenue - c.amount) AS net_revenue
FROM   finance.revenue_monthly r
JOIN   finance.credit_note_lines c
       ON c.customer = r.customer AND c.month = r.month
WHERE  r.region = 'EMEA'
  AND  r.month IN ('2026-08', '2026-09')
GROUP  BY r.month;`;

const SQL_GROSS = (d) => `-- ${d}
SELECT month, SUM(gross_revenue) AS revenue
FROM   revenue_monthly
WHERE  region = 'EMEA'
  AND  month IN ('2026-08', '2026-09')
GROUP  BY month;`;

const SQL_NET = (d) => `-- ${d}
SELECT month, SUM(net_revenue) AS net_revenue
FROM   finance.revenue_monthly
WHERE  region = 'EMEA'
  AND  month IN ('2026-08', '2026-09')
GROUP  BY month;`;

const k = (n) => `£${n.toLocaleString('en-GB', { maximumFractionDigits: 1 })}k`;
const monthRows = (measure, col) => ({
  columns: ['month', col],
  rows: [['2026-08', regionTotal('EMEA', '2026-08', measure)], ['2026-09', regionTotal('EMEA', '2026-09', measure)]],
});
const change = (measure) => pct(regionTotal('EMEA', '2026-08', measure), regionTotal('EMEA', '2026-09', measure));

export default {
  id: 'revenue',
  title: 'EMEA revenue −12%',
  question: 'Why did EMEA revenue drop 12% in September?',

  steps(ctx) {
    const raw = ctx.part('D-02') === 'F-05';
    const checked = ctx.part('D-05') === 'F-11';
    const d = ctx.connector.name;

    intake(ctx);

    ctx.emit(raw ? {
      step: 'D-02', kind: 'resolve', verdict: 'flagged',
      summary: 'Guessed: “revenue” → column gross_revenue',
      definition: 'None available. Matched revenue_monthly.gross_revenue by name.',
      reasoning: shortcutNote(ctx, 'D-02'),
      audit: 'resolve   revenue → gross_revenue (guess)',
    } : {
      step: 'D-02', kind: 'resolve', verdict: 'pass',
      summary: 'Revenue = net revenue (gross − credit notes), per Finance',
      definition: 'net_revenue = gross_revenue − credit_notes · owner: Finance · v3',
      reasoning: 'The semantic layer has one governed definition of revenue, so there is nothing to ask.',
      audit: 'resolve   revenue → net_revenue (finance v3)',
    });
    clarifyPass(ctx, 'One definition of revenue matched: no need to ask');

    access(ctx, { table: 'finance.revenue_monthly' });
    if (costGate(ctx, TABLE_GB.revenue_monthly) !== true) return;

    // First attempt: raw schema sums gross; the semantic path joins credit-note
    // lines, which double-counts them (each note has two lines).
    const first = raw ? 'gross' : 'doubled';
    ctx.emit({
      step: 'D-04', kind: 'query', verdict: 'pass', secs: 2,
      summary: `Scanned 41 GB in ${ctx.connector.time(41)}`,
      sql: raw ? SQL_GROSS(d) : SQL_JOIN(d),
      rows: monthRows(first, raw ? 'revenue' : 'net_revenue'),
      reasoning: raw ? 'Summed the revenue column it found.' : 'Computed net revenue by subtracting credit-note lines from gross revenue.',
      audit: `query     ${d.toLowerCase()} 41 GB`,
    });
    piiPass(ctx);

    let measure = first;
    if (checked) {
      const got = regionTotal('EMEA', '2026-09', first), ledger = regionTotal('EMEA', '2026-09', 'net');
      ctx.emit({
        step: 'D-05', kind: 'validate', verdict: 'fixed', secs: 2,
        summary: `Totals didn't reconcile with the ledger (${k(got)} vs ${k(ledger)}): re-ran with net_revenue`,
        reasoning: raw
          ? 'The ledger reports net revenue. The query summed gross revenue, so the check failed and the agent re-ran it against the governed net figure.'
          : 'Each credit note has two lines (header and line item), so the join subtracted every credit twice. The check caught it and the agent re-ran without the join.',
        sql: SQL_NET(d),
        rows: monthRows('net', 'net_revenue'),
        audit: `validate  mismatch ${got} ≠ ${ledger} → re-run`,
      });
      measure = 'net';
    } else passThrough(ctx);

    const pctChange = change(measure);
    const wrong = measure !== 'net';
    const rv = review(ctx, wrong ? 'This answer is exec-bound and went out unchecked.' : 'This answer is going to the exec channel.');
    if (rv === null) return;

    const delivered = deliver(ctx, { to: '#exec-weekly', rejected: rv === 'reject' });
    const movers = customerChanges('EMEA', '2026-08', '2026-09', measure);
    const growers = movers.filter((m) => m.delta > 0);

    ctx.finish({
      headline: fmtPct(pctChange),
      title: 'EMEA revenue, August → September',
      text: `EMEA ${wrong ? (raw ? 'gross revenue' : 'revenue') : 'net revenue'} went from ${k(regionTotal('EMEA', '2026-08', measure))} to ${k(regionTotal('EMEA', '2026-09', measure))} (${fmtPct(pctChange)}). Two accounts churned: Halden Freight Co and Brightwater Retail. The other ${growers.length} grew about 3%.`,
      chart: { unit: '£k', rows: movers.map((m) => ({ label: m.customer, value: m.delta })) },
      flagged: wrong
        ? (raw ? 'Wrong: this used gross revenue. Finance reports net revenue, which fell −12%.' : 'Wrong: credit notes were counted twice. The true figure is −12%.')
        : null,
      contrast: wrong ? null
        : !ctx.has('G-04') ? 'No analyst review (G-04) fitted: this went straight to the exec channel.'
        : 'Without reconciliation checks, this would have said ' + (raw ? '−7%' : '−19%') + '.',
      delivered,
    });
  },
};
