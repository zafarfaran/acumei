import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'outbound.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  pain_point TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'cold',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,            -- email | call | sms | linkedin | note | stage
  direction TEXT NOT NULL DEFAULT 'out',  -- out | in
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sequence_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sequence_id INTEGER NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  day_offset INTEGER NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sequence_id INTEGER NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',  -- active | completed | stopped
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scheduled_sends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL REFERENCES sequence_steps(id) ON DELETE CASCADE,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | sent | failed | cancelled
  sent_at TEXT,
  error TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_sends_status_due ON scheduled_sends(status, due_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_lead ON enrollments(lead_id);
`);

const DEFAULT_SETTINGS = {
  from_name: 'Your name',
  daily_cap: '100',
  send_hour: '9',
};

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) insertSetting.run(k, v);

export function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function setSettings(obj) {
  const up = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  const tx = db.transaction((entries) => {
    for (const [k, v] of entries) up.run(k, String(v));
  });
  tx(Object.entries(obj));
}

// Seed the two sequences from docs/outreach/funnel-and-templates.md,
// adapted to use only auto-resolvable placeholders.
function seedSequences() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM sequences').get().n;
  if (count > 0) return;

  const insSeq = db.prepare('INSERT INTO sequences (name, description) VALUES (?, ?)');
  const insStep = db.prepare(
    'INSERT INTO sequence_steps (sequence_id, step_number, day_offset, subject, body) VALUES (?, ?, ?, ?, ?)'
  );

  const seqA = insSeq.run(
    'A — The Pain Opener',
    'Trades / Property / Hospitality. Leads with the pain point.'
  ).lastInsertRowid;

  insStep.run(seqA, 1, 0, 'quick question about [company name]',
`Hi [first name],

Spotted [company name] while looking at [industry] businesses in [city].

Quick question — are you still handling [pain point] manually? Things like after-hours calls, rebooking lapsed customers, chasing invoices?

We build AI assistants for businesses like yours that handle that stuff quietly in the background. One plumber in Bristol saved £24K/year in missed callouts alone.

Worth a 10-minute chat?

[your name]
Acumei`);

  insStep.run(seqA, 2, 2, 're: quick question about [company name]',
`Hi [first name],

Not trying to be a pest — just wanted to share something relevant.

We recently helped another [industry] business automate exactly this kind of workflow. Took 10 days to build. They got it back in savings within 3 weeks.

If that sounds interesting, I'm happy to walk you through it. If not, no worries at all.

[your name]`);

  insStep.run(seqA, 3, 6, 'worth a look?',
`Hi [first name],

Last one from me. Here's our 30-second version:

We're ex-FAANG engineers who build AI tools for British SMEs. We don't sell software — we build something custom for your business, and you own it.

If your team is spending hours each week on repetitive admin, there's probably a quick win in there. Happy to tell you honestly if AI is worth it for you — or not.

acumei.co.uk

[your name]`);

  const seqB = insSeq.run(
    'B — The Results Opener',
    'Salons / Retail / Professional services. Leads with a result.'
  ).lastInsertRowid;

  insStep.run(seqB, 1, 0, '7 rebookings before lunch',
`Hi [first name],

A salon owner in Manchester was losing clients because she felt awkward "chasing" them. We built her an AI assistant that sends personalised rebooking texts every morning.

7 clients rebooked by 11am. No one on her team touched it.

We build these kinds of tools for [industry] businesses. Takes about 2 weeks, costs less than a month's hire, and you own everything.

Got 15 minutes this week?

[your name]
Acumei`);

  insStep.run(seqB, 2, 3, 're: 7 rebookings before lunch',
`Hi [first name],

Thought this might help — our AI assistants handle things like [pain point] for [industry] businesses, plus the usual suspects: missed calls, follow-ups, manual admin.

We do a free 30-min discovery call where we look at your workflows and tell you honestly where AI makes sense. No pitch, no commitment.

Interested?

[your name]`);

  insStep.run(seqB, 3, 7, 'last thing',
`[first name] — closing the loop on this.

If automating the repetitive stuff in your business sounds useful, I'd love a quick chat. If the timing's off, completely understand.

Either way, we're at acumei.co.uk if you ever want to explore it.

Best,
[your name]`);
}

seedSequences();

export const STAGES = ['cold', 'contacted', 'replied', 'warm', 'discovery', 'proposal', 'won', 'lost'];

export function personalise(text, lead, settings) {
  const map = {
    '[first name]': lead.first_name || 'there',
    '[name]': lead.first_name || 'there',
    '[company name]': lead.company || 'your business',
    '[company]': lead.company || 'your business',
    '[industry]': lead.industry || 'local',
    '[city]': lead.city || 'your area',
    '[pain point]': lead.pain_point || 'the repetitive admin',
    '[your name]': settings.from_name || '',
  };
  let out = text;
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
  return out;
}
