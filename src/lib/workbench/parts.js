// The Workbench catalogue: six module slots along the rail, five optional branches
// bolted beside it, and the parts that fit them. Codes match the spec; the copy here
// is what the tray, the labels and the inspector show.

export const SLOTS = [
  { code: 'D-01', name: 'Intake', role: 'Where the question comes from', kind: 'module' },
  { code: 'D-02', name: 'Understand', role: 'Resolve what the question means', kind: 'module' },
  { code: 'D-03', name: 'Access', role: 'What the asker may see', kind: 'module' },
  { code: 'D-04', name: 'Query', role: 'Fetch the data', kind: 'module' },
  { code: 'D-05', name: 'Validate', role: 'Check results before anyone sees them', kind: 'module' },
  { code: 'D-06', name: 'Deliver', role: 'Present the answer', kind: 'module' },
  { code: 'G-01', name: 'Clarify', role: 'Ask before guessing', kind: 'branch', on: 'D-02' },
  { code: 'G-02', name: 'PII guard', role: 'Mask personal fields', kind: 'branch', on: 'D-03' },
  { code: 'G-03', name: 'Cost gate', role: 'Hold big scans for approval', kind: 'branch', on: 'D-04' },
  { code: 'G-04', name: 'Analyst review', role: 'A human signs off first', kind: 'branch', on: 'D-06' },
  { code: 'G-05', name: 'Audit log', role: 'Record every step', kind: 'branch', on: 'rail' },
];

export const PARTS = [
  { code: 'F-01', slot: 'D-01', name: 'Slack', blurb: 'Questions asked in Slack channels', shape: { size: [1.3, 1.2, 0.8] } },
  { code: 'F-02', slot: 'D-01', name: 'Teams', blurb: 'Questions asked in Teams channels', shape: { size: [1.3, 1.2, 0.8] } },
  { code: 'F-03', slot: 'D-01', name: 'BI "Ask" box', blurb: 'The search box in your BI tool', shape: { size: [1.3, 1.2, 0.65] } },
  { code: 'F-04', slot: 'D-02', name: 'Semantic layer', blurb: 'Governed metric definitions (revenue = net)', shape: { size: [1.3, 1.2, 1.0] } },
  { code: 'F-05', slot: 'D-02', name: 'Raw schema only', blurb: 'Table and column names, no definitions', shortcut: true, shape: { size: [1.3, 1.2, 0.55] } },
  { code: 'F-06', slot: 'D-03', name: 'Role-based access', blurb: "Runs as the asker, sees only what their role may", shape: { size: [1.3, 1.2, 0.95] } },
  { code: 'F-07', slot: 'D-03', name: 'Shared service account', blurb: 'One login that can read everything', shortcut: true, shape: { size: [1.3, 1.2, 0.55] } },
  { code: 'F-08', slot: 'D-04', name: 'Snowflake', blurb: 'Warehouse connector', shape: { size: [1.3, 1.2, 1.25] } },
  { code: 'F-09', slot: 'D-04', name: 'BigQuery', blurb: 'Warehouse connector', shape: { size: [1.3, 1.2, 1.25] } },
  { code: 'F-10', slot: 'D-04', name: 'Postgres', blurb: 'Read replica of the production database', shape: { size: [1.3, 1.2, 1.1] } },
  { code: 'F-11', slot: 'D-05', name: 'Reconciliation checks', blurb: 'Totals must match the ledger', shape: { size: [1.3, 1.2, 0.95] } },
  { code: 'F-12', slot: 'D-05', name: 'Pass-through', blurb: 'Whatever the query returns goes out', shortcut: true, shape: { size: [1.3, 1.2, 0.4] } },
  { code: 'F-13', slot: 'D-06', name: 'Slack memo + chart', blurb: 'A short write-up with one chart', shape: { size: [1.3, 1.2, 0.95] } },
  { code: 'F-14', slot: 'D-06', name: 'Dashboard tile', blurb: 'Updates a tile on the ops dashboard', shape: { size: [1.3, 1.2, 0.8] } },
  { code: 'F-15', slot: 'D-06', name: 'Board slide draft', blurb: 'A draft slide for the next board pack', shape: { size: [1.3, 1.2, 1.05] } },
  { code: 'G-01', slot: 'G-01', name: 'Clarify', blurb: 'Ambiguous question → ask before querying', shape: { size: [0.9, 0.9, 0.6] } },
  { code: 'G-02', slot: 'G-02', name: 'PII guard', blurb: 'Mask or block personal columns', shape: { size: [0.9, 0.9, 0.6] } },
  { code: 'G-03', slot: 'G-03', name: 'Cost gate', blurb: 'Pause scans over 500 GB for approval', shape: { size: [0.9, 0.9, 0.6] } },
  { code: 'G-04', slot: 'G-04', name: 'Analyst review', blurb: 'Exec-bound answers go to a human first', shape: { size: [0.9, 0.9, 0.6] } },
  { code: 'G-05', slot: 'G-05', name: 'Audit log', blurb: 'Hash-chained record of every step', shape: { size: [0.9, 0.9, 0.6] } },
];

const BY_CODE = Object.fromEntries(PARTS.map((p) => [p.code, p]));
const SLOT_BY_CODE = Object.fromEntries(SLOTS.map((s) => [s.code, s]));

export const MODULES = SLOTS.filter((s) => s.kind === 'module').map((s) => s.code);
export const BRANCHES = SLOTS.filter((s) => s.kind === 'branch').map((s) => s.code);

export const partByCode = (code) => BY_CODE[code] || null;
export const slotByCode = (code) => SLOT_BY_CODE[code] || null;
export const partsForSlot = (slot) => PARTS.filter((p) => p.slot === slot);
