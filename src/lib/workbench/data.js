// Northwind Logistics: the invented company the Workbench runs against. Every
// person, customer and figure here is fictional. The EMEA rows are written out by
// hand so the scenario numbers come out exactly (−12% net, −7% gross, −19% when
// credit notes are double-counted); the other regions are generated.

export const MONTHS = ['2026-07', '2026-08', '2026-09'];
const r1 = (n) => Math.round(n * 10) / 10;

// customer, product line, Aug net, Sep net, Aug credit, Sep credit (£k)
const EMEA = [
  ['Halden Freight Co', 'Freight', 90, 0, 5, 30],
  ['Brightwater Retail', 'Last-mile', 60, 0, 5, 25],
  ['Kestrel Pharma', 'Warehousing', 200, 206, 10, 10],
  ['Morrow & Vane', 'Freight', 180, 185.4, 10, 10],
  ['Osterby Foods', 'Warehousing', 150, 154.5, 10, 10],
  ['Lumen Textiles', 'Last-mile', 140, 144.2, 10, 10],
  ['Varga Components', 'Freight', 100, 103, 5, 10],
  ['Ashgrove Paper', 'Warehousing', 80, 82.4, 5, 5],
];

const OTHER = {
  AMER: [['Copperline Goods', 'Freight', 210], ['Redfern Outdoor', 'Last-mile', 95], ['Tallis Medical', 'Warehousing', 170], ['Juniper & Co', 'Freight', 120], ['Pike Street Bakery', 'Last-mile', 45], ['Harlow Auto Parts', 'Warehousing', 140]],
  APAC: [['Kaimai Dairy', 'Freight', 130], ['Sorrel Electronics', 'Warehousing', 185], ['Tidewater Homeware', 'Last-mile', 70], ['Banksia Books', 'Last-mile', 40], ['Orchid Cosmetics', 'Freight', 110]],
};

const row = (region, customer, product_line, month, net, credit) =>
  ({ region, customer, product_line, month, net_revenue: r1(net), credit_notes: r1(credit), gross_revenue: r1(net + credit) });

const revenue = [];
for (const [c, pl, aug, sep, augC, sepC] of EMEA) {
  revenue.push(row('EMEA', c, pl, '2026-07', aug * 0.98, augC));
  revenue.push(row('EMEA', c, pl, '2026-08', aug, augC));
  revenue.push(row('EMEA', c, pl, '2026-09', sep, sepC));
}
for (const [region, list] of Object.entries(OTHER)) {
  list.forEach(([c, pl, base], i) => {
    const g = 1.01 + (i % 4) * 0.01; // 1–4% monthly growth, deterministic
    MONTHS.forEach((m, k) => revenue.push(row(region, c, pl, m, base * g ** k, 3 + (i % 3) * 2)));
  });
}

const users = [
  { month: '2026-07', active_7d: 17650, active_30d: 30480 },
  { month: '2026-08', active_7d: 17980, active_30d: 31210 },
  { month: '2026-09', active_7d: 18420, active_30d: 31960 },
];

const PEOPLE = [
  ['Avery Quill', 'EMEA', 'Operations lead', 68000], ['Bram Okonkwo-Lisle', 'EMEA', 'Analyst', 47000],
  ['Celia Marchbank', 'EMEA', 'Account manager', 52000], ['Dov Teague', 'EMEA', 'Driver lead', 39000],
  ['Esme Varn', 'AMER', 'Operations lead', 71000], ['Fitz Calloway', 'AMER', 'Analyst', 49000],
  ['Greer Haddon', 'AMER', 'Account manager', 54000], ['Hollis Prewitt', 'AMER', 'Driver lead', 41000],
  ['Ines Albright', 'APAC', 'Operations lead', 66000], ['Jory Penhallow', 'APAC', 'Analyst', 46000],
  ['Kit Lowther', 'APAC', 'Account manager', 51000], ['Linnea Strand', 'APAC', 'Driver lead', 38000],
];
const employees = PEOPLE.map(([name, region, role, salary], i) => ({
  employee_id: 1001 + i, name, email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@northwind.example', region, role, salary,
}));

// A few rows standing in for a very large table; the size is what matters.
const skus = ['NW-FR-001', 'NW-WH-014', 'NW-LM-207', 'NW-FR-033', 'NW-WH-090', 'NW-LM-118'].map((sku, i) => ({
  sku, units_2025: 4200 + i * 730, units_2026: 4200 + i * 730 + (i % 2 ? -1 : 1) * (180 + i * 95),
}));

export const TABLES = {
  revenue_monthly: revenue,
  users_activity: users,
  hr_employees: employees,
  sku_sales: skus,
};

export const TABLE_GB = { revenue_monthly: 41, users_activity: 3, hr_employees: 0.2, sku_sales: 2300 };

// Columns that identify a person; the PII guard masks these.
export const PII_COLUMNS = ['name', 'email'];

const MEASURE = {
  net: (r) => r.net_revenue,
  gross: (r) => r.gross_revenue,
  credit: (r) => r.credit_notes,
  doubled: (r) => r.gross_revenue - 2 * r.credit_notes, // credit notes joined twice
};

export function regionTotal(region, month, measure = 'net') {
  const f = MEASURE[measure];
  return r1(revenue.filter((r) => r.region === region && r.month === month).reduce((a, r) => a + f(r), 0));
}

export const pct = (a, b) => ((b - a) / a) * 100;

// Per-customer change between two months, biggest fall first.
export function customerChanges(region, from, to, measure = 'net') {
  const f = MEASURE[measure];
  const by = {};
  for (const r of revenue) if (r.region === region && (r.month === from || r.month === to)) {
    by[r.customer] ||= { customer: r.customer, product_line: r.product_line, aug: 0, sep: 0 };
    by[r.customer][r.month === from ? 'aug' : 'sep'] = f(r);
  }
  return Object.values(by).map((c) => ({ ...c, delta: r1(c.sep - c.aug) })).sort((a, b) => a.delta - b.delta);
}
