// A stand-in model for local development (WORKBENCH_FAKE_PROVIDER=1): looks up
// a definition, runs one query chosen by keyword, then answers. It lets the live
// path be exercised end to end without an API key. Never used in production.
const QUERIES = [
  [/salar|pay|employee/i, 'SELECT name, role, salary FROM hr_employees ORDER BY salary DESC', 'salary'],
  [/sku|product|unit/i, 'SELECT sku, units_2025, units_2026 FROM sku_sales', 'units'],
  [/active|user/i, "SELECT month, active_30d FROM users_activity WHERE month = '2026-09'", 'active users'],
  [/.*/, "SELECT customer, SUM(net_revenue) AS net_revenue FROM revenue_monthly WHERE month = '2026-09' GROUP BY customer ORDER BY net_revenue DESC", 'revenue'],
];

export function createFakeProvider() {
  return {
    async chat({ messages }) {
      const question = messages.find((m) => m.role === 'user')?.content || '';
      const turns = messages.filter((m) => m.role === 'assistant').length;
      const [, sql, metric] = QUERIES.find(([re]) => re.test(question));
      await new Promise((r) => setTimeout(r, 350));
      if (turns === 0) return { content: null, toolCalls: [{ id: 'f1', name: 'get_metric_definition', args: { name: metric } }] };
      if (turns === 1) return { content: null, toolCalls: [{ id: 'f2', name: 'query_warehouse', args: { sql, reasoning: 'The simplest query that answers the question.' } }] };
      const lastTool = [...messages].reverse().find((m) => m.role === 'tool');
      const data = JSON.parse(lastTool?.content || '{}');
      if (data.error) return { content: `HEADLINE: Blocked\nThe warehouse refused: ${data.error}.`, toolCalls: [] };
      return { content: `HEADLINE: ${data.rows?.length ?? 0} rows\n(Fake model) The query returned ${data.rows?.length ?? 0} rows. The top one is ${JSON.stringify(data.rows?.[0] ?? [])}.`, toolCalls: [] };
    },
  };
}
