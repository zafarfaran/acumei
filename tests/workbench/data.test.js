import { describe, it, expect } from 'vitest';
import { TABLES, TABLE_GB, regionTotal, pct, customerChanges } from '../../src/lib/workbench/data';
import { CONNECTORS } from '../../src/lib/workbench/connectors';

describe('Northwind data', () => {
  it('EMEA net revenue falls 12% from August to September', () => {
    expect(regionTotal('EMEA', '2026-08', 'net')).toBe(1000);
    expect(regionTotal('EMEA', '2026-09', 'net')).toBe(875.5);
    expect(Math.round(pct(1000, 875.5))).toBe(-12);
  });

  it('gives the wrong answers the shortcut parts produce', () => {
    expect(Math.round(pct(regionTotal('EMEA', '2026-08', 'gross'), regionTotal('EMEA', '2026-09', 'gross')))).toBe(-7);
    expect(Math.round(pct(regionTotal('EMEA', '2026-08', 'doubled'), regionTotal('EMEA', '2026-09', 'doubled')))).toBe(-19);
    expect(regionTotal('EMEA', '2026-09', 'credit')).toBe(110);
  });

  it('names the two churned accounts as the biggest movers', () => {
    const ch = customerChanges('EMEA', '2026-08', '2026-09');
    expect(ch.slice(0, 2).map((c) => c.customer)).toEqual(['Halden Freight Co', 'Brightwater Retail']);
    expect(ch[0].sep).toBe(0);
  });

  it('has three regions of revenue and plausible user activity', () => {
    expect(new Set(TABLES.revenue_monthly.map((r) => r.region))).toEqual(new Set(['EMEA', 'AMER', 'APAC']));
    const sep = TABLES.users_activity.find((r) => r.month === '2026-09');
    expect(sep).toMatchObject({ active_7d: 18420, active_30d: 31960 });
  });

  it('only contains obviously fictional people', () => {
    expect(TABLES.hr_employees).toHaveLength(12);
    for (const e of TABLES.hr_employees) expect(e.email).toMatch(/@northwind\.example$/);
  });

  it('prices a 2.3 TB scan per connector', () => {
    expect(TABLE_GB.sku_sales).toBe(2300);
    expect(CONNECTORS['F-08'].cost(2300)).toBe('≈ $11.50 of compute');
    expect(CONNECTORS['F-09'].cost(2300)).toBe('≈ $14.38 billed');
    expect(CONNECTORS['F-10'].cost(2300)).toMatch(/min on the read replica/);
  });
});
