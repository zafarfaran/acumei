// What each warehouse part changes: the name shown in the SQL header, and how the
// cost of a scan is described.
const money = (n) => '$' + (Math.round(n * 100 + 1e-6) / 100).toFixed(2);

export const CONNECTORS = {
  'F-08': { name: 'Snowflake', dialect: 'snowflake', cost: (gb) => `≈ ${money((gb / 1000) * 5)} of compute`, time: (gb) => `${(0.3 + gb / 40).toFixed(1)} s` },
  'F-09': { name: 'BigQuery', dialect: 'bigquery', cost: (gb) => `≈ ${money((gb / 1000) * 6.25)} billed`, time: (gb) => `${(0.4 + gb / 45).toFixed(1)} s` },
  'F-10': { name: 'Postgres', dialect: 'postgres', cost: (gb) => `≈ ${Math.max(1, Math.round(gb / 160))} min on the read replica`, time: (gb) => `${(0.6 + gb / 12).toFixed(1)} s` },
};
