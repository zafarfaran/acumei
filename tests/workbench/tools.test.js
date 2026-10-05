import { describe, it, expect } from 'vitest';
import { createWarehouse } from '../../server/workbench/tools';
import { DEFAULT_BUILD, fit } from '../../src/lib/workbench/build';

const svc = fit(DEFAULT_BUILD, 'F-07');

describe('mock warehouse', () => {
  it('runs a SELECT and reports the scan size', () => {
    const wh = createWarehouse(DEFAULT_BUILD);
    const r = wh.query("SELECT month, SUM(net_revenue) AS net FROM finance.revenue_monthly WHERE month = '2026-09' GROUP BY month");
    expect(r.error).toBeUndefined();
    expect(r.columns).toEqual(['month', 'net']);
    expect(r.rows[0][1]).toBeCloseTo(875.5);
    expect(r.gb).toBe(41);
  });

  it('role-based access only sees EMEA rows', () => {
    const r = createWarehouse(DEFAULT_BUILD).query('SELECT DISTINCT region FROM revenue_monthly');
    expect(r.rows).toEqual([['EMEA']]);
    const all = createWarehouse(svc).query('SELECT DISTINCT region FROM revenue_monthly');
    expect(all.rows.length).toBe(3);
  });

  it('role-based access denies HR; a service account does not', () => {
    const r = createWarehouse(DEFAULT_BUILD).query('SELECT name, salary FROM hr.employees');
    expect(r.verdict).toBe('blocked');
    expect(r.error).toMatch(/permission denied/);
    const leak = createWarehouse(svc).query('SELECT name, salary FROM hr_employees');
    expect(leak.rows[0][0]).toMatch(/[A-Z][a-z]+ [A-Z]/);
    expect(leak.masked).toEqual([]);
  });

  it('the PII guard masks names and emails, including aliases', () => {
    const r = createWarehouse(fit(svc, 'G-02')).query('SELECT name AS employee_name, email, salary FROM hr_employees');
    expect(r.masked).toEqual(['employee_name', 'email']);
    expect(r.rows.every((row) => row[0] === null && row[1] === null && typeof row[2] === 'number')).toBe(true);
  });

  it('refuses anything but a single SELECT', () => {
    const wh = createWarehouse(svc);
    for (const sql of [
      'DELETE FROM hr_employees', 'SELECT 1; DROP TABLE hr_employees', 'CREATE TABLE x', 'SELECT * INTO x FROM sku_sales',
      "SELECT * FROM TXT('/etc/passwd')", "SELECT * FROM CSV('https://example.com/x.csv')", 'SELECT * FROM secrets',
      'SELECT sku->constructor FROM sku_sales', 'SELECT `x` FROM sku_sales', "SELECT * FROM sku_sales, JSON('x')",
      "SELECT * FROM (SELECT * FROM XLSX('a'))",
    ]) {
      expect(wh.query(sql).verdict, sql).toBe('blocked');
    }
  });

  it('still allows subqueries and joins over Northwind tables', () => {
    const r = createWarehouse(svc).query('SELECT a.region, COUNT(*) AS n FROM (SELECT region FROM revenue_monthly) a JOIN hr_employees e ON e.region = a.region GROUP BY a.region');
    expect(r.error).toBeUndefined();
    expect(r.rows.length).toBe(3);
  });

  it('estimates big scans and returns errors for bad SQL instead of throwing', () => {
    const wh = createWarehouse(svc);
    expect(wh.estimateGb('SELECT sku FROM sales.sku_sales')).toBe(2300);
    expect(wh.query('SELECT nope FROM').error).toBeTruthy();
  });

  it('describes metrics through the semantic layer, or only the schema without it', () => {
    expect(createWarehouse(DEFAULT_BUILD).definition('revenue')).toMatch(/net_revenue = gross_revenue − credit_notes/);
    expect(createWarehouse(fit(DEFAULT_BUILD, 'F-05')).definition('revenue')).toMatch(/No semantic layer/);
  });
});
