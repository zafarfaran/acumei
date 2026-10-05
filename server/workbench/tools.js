// The mock Northwind warehouse for live mode. Guardrails live here, in code,
// not in the prompt: role-based access filters rows and denies HR before the
// model sees anything, and the PII guard masks columns on the way out.
import alasql from 'alasql';
import { TABLES, TABLE_GB } from '../../src/lib/workbench/data.js';

const SCHEMA = {
  revenue_monthly: 'region, customer, product_line, month (YYYY-MM), gross_revenue, credit_notes, net_revenue (£k)',
  users_activity: 'month (YYYY-MM), active_7d, active_30d',
  hr_employees: 'employee_id, name, email, region, role, salary (£ per year)',
  sku_sales: 'sku, units_2025, units_2026',
};

const DEFINITIONS = {
  revenue: 'revenue = net_revenue = gross_revenue − credit_notes · owner: Finance · v3. Always report net revenue.',
  'active users': 'Two governed definitions: active_7d (signed in within 7 days, owner: Product) and active_30d (within 30 days, owner: Finance, used in board reporting).',
  salary: 'hr_employees.salary · owner: People team · classification: restricted, personal.',
  units: 'units_sold = units per SKU per year (sku_sales.units_2025, units_2026) · owner: Commercial.',
};

const PII = /(^|_)(name|email)$/i;
const MAX_ROWS = 200;

export const schemaText = () => Object.entries(SCHEMA).map(([t, c]) => `${t}: ${c}`).join('\n');

// Strip schema prefixes the model may add (finance.revenue_monthly → revenue_monthly).
const normalise = (sql) => String(sql || '').replace(/\b(?:finance|product|hr|sales|public|northwind)\.(\w+)/gi, (_, t) => (t === 'employees' ? 'hr_employees' : t));

const tablesIn = (sql) => Object.keys(TABLES).filter((t) => new RegExp(`\\b${t}\\b`, 'i').test(sql));

function forbidden(sql) {
  const s = sql.trim().replace(/;\s*$/, '');
  if (s.includes(';')) return 'Only one statement is allowed.';
  if (!/^(select|with)\b/i.test(s)) return 'Only SELECT queries are allowed.';
  if (/\b(insert|update|delete|drop|create|alter|attach|detach|truncate|into)\b/i.test(s)) return 'Only read-only SELECT queries are allowed.';
  // alasql extensions can read files and URLs or evaluate JS: refuse all of them.
  if (/[`$\\]|->|=>|\bnew\b/.test(s)) return 'That syntax is not allowed.';
  if (/\b(csv|tsv|tab|txt|json|xlsx?|xml|html|file|require|source|load|eval|alasql|window|global|globalthis|process|constructor|prototype|__proto__|import)\b/i.test(s)) return 'That function is not allowed.';
  // Every FROM / JOIN target must be a Northwind table or a subquery.
  for (const m of s.matchAll(/\b(from|join)\s+(\(\s*(?:select|with)\b|[^\s,()]+)/gi)) {
    const target = m[2].toLowerCase();
    if (!target.startsWith('(') && !Object.hasOwn(TABLES, target)) return `Unknown table ${m[2]}. Use one of: ${Object.keys(TABLES).join(', ')}.`;
  }
  return null;
}

export function createWarehouse(build) {
  const roleBased = build['D-03'] === 'F-06';
  const pii = build.branches.includes('G-02');
  const semantic = build['D-02'] === 'F-04';

  const db = new alasql.Database();
  for (const [name, rows] of Object.entries(TABLES)) {
    if (roleBased && name === 'hr_employees') continue; // not even loaded for this role
    db.exec(`CREATE TABLE ${name}`);
    db.tables[name].data = roleBased && rows[0]?.region ? rows.filter((r) => r.region === 'EMEA') : rows.map((r) => ({ ...r }));
  }

  return {
    // The access error this role would hit, before anything runs (or null).
    denied(sql) {
      return roleBased && tablesIn(normalise(sql)).includes('hr_employees') ? 'permission denied for table hr_employees (role emea_manager)' : null;
    },

    estimateGb(sql) {
      return tablesIn(normalise(sql)).reduce((a, t) => a + TABLE_GB[t], 0);
    },

    query(raw) {
      const sql = normalise(raw);
      const bad = forbidden(sql);
      if (bad) return { error: bad, verdict: 'blocked', gb: 0 };
      const tables = tablesIn(sql);
      if (roleBased && tables.includes('hr_employees')) {
        return { error: 'permission denied for table hr_employees (role emea_manager)', verdict: 'blocked', gb: 0 };
      }
      const gb = tables.reduce((a, t) => a + TABLE_GB[t], 0);
      let out;
      try {
        out = db.exec(sql.trim().replace(/;\s*$/, ''));
      } catch (e) {
        return { error: `SQL error: ${String(e.message || e).slice(0, 200)}`, gb };
      }
      if (!Array.isArray(out)) return { error: 'The query did not return rows.', gb };
      const columns = out.length ? Object.keys(out[0]) : [];
      const masked = pii ? columns.filter((c) => PII.test(c)) : [];
      const rows = out.slice(0, MAX_ROWS).map((r) => columns.map((c) => (masked.includes(c) ? null : r[c] ?? null)));
      return { columns, rows, masked, gb, truncated: out.length > MAX_ROWS };
    },

    definition(name) {
      if (!semantic) return `No semantic layer is fitted. Available tables and columns:\n${schemaText()}`;
      const key = Object.keys(DEFINITIONS).find((k) => String(name || '').toLowerCase().includes(k.split(' ')[0]));
      return key ? DEFINITIONS[key] : `No governed definition for “${name}”. Available tables:\n${schemaText()}`;
    },
  };
}
