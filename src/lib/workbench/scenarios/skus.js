// "Full year-on-year breakdown for every SKU." A 2.3 TB scan. With the cost gate
// it waits for approval; without it, it simply spends the money.
import { TABLES, TABLE_GB } from '../data';
import { intake, clarifyPass, access, costGate, piiPass, passThrough, review, deliver, shortcutNote, fmtGb } from './common';

const SQL = (d) => `-- ${d}
SELECT sku,
       SUM(CASE WHEN year = 2025 THEN units END) AS units_2025,
       SUM(CASE WHEN year = 2026 THEN units END) AS units_2026
FROM   sales.sku_sales          -- every line, every SKU, two years
GROUP  BY sku
ORDER  BY sku;`;

export default {
  id: 'skus',
  title: 'Every SKU, year on year',
  question: 'Full year-on-year breakdown for every SKU.',

  steps(ctx) {
    const d = ctx.connector.name;
    const gb = TABLE_GB.sku_sales;
    const cost = ctx.connector.cost(gb);
    intake(ctx);

    ctx.emit(ctx.part('D-02') === 'F-05' ? {
      step: 'D-02', kind: 'resolve', verdict: 'flagged',
      summary: 'Matched table sku_sales: units by year',
      definition: 'None available. Matched sku_sales.units by name.',
      reasoning: shortcutNote(ctx, 'D-02'),
      audit: 'resolve   units → sku_sales.units',
    } : {
      step: 'D-02', kind: 'resolve', verdict: 'pass',
      summary: 'Units sold by SKU, 2025 vs 2026 (governed metric units_sold)',
      definition: 'units_sold = SUM(sku_sales.units) · owner: Commercial',
      audit: 'resolve   units_sold by sku',
    });
    clarifyPass(ctx, 'The question is unambiguous: no need to ask');
    access(ctx, { table: 'sales.sku_sales' });

    const g = costGate(ctx, gb);
    if (g === false) return;
    if (g === 'denied') {
      ctx.emit({ step: 'D-04', kind: 'query', verdict: 'blocked', summary: 'Not run: the scan was denied', sql: SQL(d), audit: 'query     not run (denied)' });
      const delivered = deliver(ctx, { to: '#emea-ops' });
      ctx.finish({
        headline: 'Not run',
        title: 'Every SKU, year on year',
        text: `The full scan (${fmtGb(gb)}, ${cost}) was denied. Narrow it to one region or one quarter and it will run under the limit.`,
        chart: null, flagged: null,
        contrast: `Without the cost gate (G-03), this would have spent ${cost} without asking anyone.`,
        delivered,
      });
      return;
    }

    const rows = TABLES.sku_sales.map((s) => [s.sku, s.units_2025, s.units_2026]);
    ctx.emit({
      step: 'D-04', kind: 'query', verdict: ctx.has('G-03') ? 'pass' : 'flagged', secs: 58,
      summary: ctx.has('G-03') ? `Scanned ${fmtGb(gb)} in ${ctx.connector.time(gb)} (approved)` : `Scanned ${fmtGb(gb)} in ${ctx.connector.time(gb)} with no approval · ${cost}`,
      sql: SQL(d),
      rows: { columns: ['sku', 'units_2025', 'units_2026'], rows },
      reasoning: 'The question asks for every SKU, so the agent read the whole table.',
      audit: `query     ${d.toLowerCase()} ${fmtGb(gb)} ${cost}`,
    });
    piiPass(ctx);

    if (ctx.part('D-05') === 'F-11') ctx.emit({ step: 'D-05', kind: 'validate', verdict: 'pass', summary: 'Totals match the commercial ledger', audit: 'validate  ok' });
    else passThrough(ctx);

    const rv = review(ctx, null);
    if (rv === null) return;
    const delivered = deliver(ctx, { to: '#emea-ops', rejected: rv === 'reject' });
    const ch = rows.map(([s, a, b]) => ({ label: s, value: b - a })).sort((a, b) => b.value - a.value);

    ctx.finish({
      headline: `${rows.length} SKUs`,
      title: 'Units sold, 2026 vs 2025',
      text: `Biggest riser: ${ch[0].label} (+${ch[0].value.toLocaleString('en-GB')} units). Biggest faller: ${ch[ch.length - 1].label} (${ch[ch.length - 1].value.toLocaleString('en-GB')}).`,
      chart: { unit: 'units', rows: ch },
      flagged: null,
      contrast: ctx.has('G-03') ? `The cost gate paused this for approval before spending ${cost}.` : `This scan cost ${cost} and nobody approved it. With a cost gate (G-03) it would have paused first.`,
      delivered,
    });
  },
};
