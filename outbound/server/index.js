import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, getSettings, setSettings, STAGES, personalise } from './db.js';
import { isConfigured, sendEmail } from './mailer.js';
import { startScheduler, tick } from './scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 4571;

const LEAD_FIELDS = ['first_name', 'last_name', 'company', 'industry', 'city', 'email', 'phone', 'linkedin_url', 'pain_point', 'notes'];

// Stages at which a lead has engaged: pending sequence emails get cancelled.
const ENGAGED_STAGES = ['replied', 'warm', 'discovery', 'proposal', 'won', 'lost'];

function cancelPendingForLead(leadId) {
  db.prepare("UPDATE scheduled_sends SET status = 'cancelled' WHERE lead_id = ? AND status = 'pending'").run(leadId);
  db.prepare("UPDATE enrollments SET status = 'stopped' WHERE lead_id = ? AND status = 'active'").run(leadId);
}

// ---------- Leads ----------

app.get('/api/leads', (req, res) => {
  const { stage, q } = req.query;
  let sql = `
    SELECT l.*,
      (SELECT MAX(created_at) FROM activities a WHERE a.lead_id = l.id) AS last_activity,
      (SELECT COUNT(*) FROM enrollments e WHERE e.lead_id = l.id AND e.status = 'active') AS active_enrollments
    FROM leads l WHERE 1=1`;
  const params = [];
  if (stage) { sql += ' AND l.stage = ?'; params.push(stage); }
  if (q) {
    sql += ' AND (l.first_name || \' \' || l.last_name || \' \' || l.company || \' \' || l.email || \' \' || l.city) LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY l.updated_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.post('/api/leads', (req, res) => {
  const vals = LEAD_FIELDS.map((f) => (req.body[f] ?? '').toString().trim());
  const info = db.prepare(
    `INSERT INTO leads (${LEAD_FIELDS.join(', ')}) VALUES (${LEAD_FIELDS.map(() => '?').join(', ')})`
  ).run(...vals);
  res.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(info.lastInsertRowid));
});

app.post('/api/leads/import', (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  const ins = db.prepare(
    `INSERT INTO leads (${LEAD_FIELDS.join(', ')}) VALUES (${LEAD_FIELDS.map(() => '?').join(', ')})`
  );
  const existing = new Set(
    db.prepare("SELECT email FROM leads WHERE email != ''").all().map((r) => r.email.toLowerCase())
  );
  let imported = 0, skipped = 0;
  const tx = db.transaction(() => {
    for (const row of rows) {
      const email = (row.email ?? '').toString().trim().toLowerCase();
      if (email && existing.has(email)) { skipped++; continue; }
      ins.run(...LEAD_FIELDS.map((f) => (row[f] ?? '').toString().trim()));
      if (email) existing.add(email);
      imported++;
    }
  });
  tx();
  res.json({ imported, skipped });
});

app.get('/api/leads/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Not found' });
  lead.activities = db.prepare('SELECT * FROM activities WHERE lead_id = ? ORDER BY created_at DESC, id DESC').all(lead.id);
  lead.enrollments = db.prepare(`
    SELECT e.*, s.name AS sequence_name,
      (SELECT COUNT(*) FROM scheduled_sends ss WHERE ss.enrollment_id = e.id AND ss.status = 'sent') AS sent_count,
      (SELECT COUNT(*) FROM scheduled_sends ss WHERE ss.enrollment_id = e.id AND ss.status = 'pending') AS pending_count,
      (SELECT MIN(due_at) FROM scheduled_sends ss WHERE ss.enrollment_id = e.id AND ss.status = 'pending') AS next_due
    FROM enrollments e JOIN sequences s ON s.id = e.sequence_id
    WHERE e.lead_id = ? ORDER BY e.enrolled_at DESC`).all(lead.id);
  res.json(lead);
});

app.patch('/api/leads/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Not found' });

  const updates = [];
  const params = [];
  for (const f of LEAD_FIELDS) {
    if (f in req.body) { updates.push(`${f} = ?`); params.push((req.body[f] ?? '').toString().trim()); }
  }
  if ('stage' in req.body) {
    if (!STAGES.includes(req.body.stage)) return res.status(400).json({ error: 'Invalid stage' });
    updates.push('stage = ?');
    params.push(req.body.stage);
  }
  if (updates.length) {
    updates.push("updated_at = datetime('now')");
    db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...params, lead.id);
    if ('stage' in req.body && req.body.stage !== lead.stage) {
      db.prepare("INSERT INTO activities (lead_id, type, outcome) VALUES (?, 'stage', ?)").run(lead.id, `${lead.stage} → ${req.body.stage}`);
      if (ENGAGED_STAGES.includes(req.body.stage)) cancelPendingForLead(lead.id);
    }
  }
  res.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(lead.id));
});

app.delete('/api/leads/:id', (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------- Activities ----------

app.post('/api/leads/:id/activities', (req, res) => {
  const { type, direction = 'out', subject = '', body = '', outcome = '' } = req.body;
  if (!['email', 'call', 'sms', 'linkedin', 'note'].includes(type)) {
    return res.status(400).json({ error: 'Invalid activity type' });
  }
  const info = db.prepare(
    'INSERT INTO activities (lead_id, type, direction, subject, body, outcome) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.params.id, type, direction, subject, body, outcome);
  db.prepare("UPDATE leads SET updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json(db.prepare('SELECT * FROM activities WHERE id = ?').get(info.lastInsertRowid));
});

// ---------- Sequences ----------

app.get('/api/sequences', (req, res) => {
  const sequences = db.prepare('SELECT * FROM sequences ORDER BY id').all();
  const steps = db.prepare('SELECT * FROM sequence_steps ORDER BY sequence_id, step_number').all();
  for (const s of sequences) s.steps = steps.filter((st) => st.sequence_id === s.id);
  res.json(sequences);
});

app.put('/api/steps/:id', (req, res) => {
  const step = db.prepare('SELECT * FROM sequence_steps WHERE id = ?').get(req.params.id);
  if (!step) return res.status(404).json({ error: 'Not found' });
  const { subject = step.subject, body = step.body, day_offset = step.day_offset } = req.body;
  db.prepare('UPDATE sequence_steps SET subject = ?, body = ?, day_offset = ? WHERE id = ?')
    .run(subject, body, Number(day_offset), step.id);
  res.json(db.prepare('SELECT * FROM sequence_steps WHERE id = ?').get(step.id));
});

function toSqlUtc(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

app.post('/api/leads/:id/enroll', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (!lead.email) return res.status(400).json({ error: 'Lead has no email address' });

  const seq = db.prepare('SELECT * FROM sequences WHERE id = ?').get(req.body.sequence_id);
  if (!seq) return res.status(404).json({ error: 'Sequence not found' });

  const already = db.prepare(
    "SELECT COUNT(*) AS n FROM enrollments WHERE lead_id = ? AND sequence_id = ? AND status = 'active'"
  ).get(lead.id, seq.id).n;
  if (already) return res.status(400).json({ error: 'Lead already enrolled in this sequence' });

  const steps = db.prepare('SELECT * FROM sequence_steps WHERE sequence_id = ? ORDER BY step_number').all(seq.id);
  const settings = getSettings();
  const sendHour = Number(settings.send_hour) || 9;

  const enrollmentId = db.prepare('INSERT INTO enrollments (lead_id, sequence_id) VALUES (?, ?)').run(lead.id, seq.id).lastInsertRowid;
  const insSend = db.prepare(
    'INSERT INTO scheduled_sends (enrollment_id, step_id, lead_id, due_at) VALUES (?, ?, ?, ?)'
  );
  const now = new Date();
  for (const step of steps) {
    let due;
    if (step.day_offset === 0) {
      due = now; // first email goes on the next scheduler tick
    } else {
      due = new Date(now);
      due.setDate(due.getDate() + step.day_offset);
      due.setHours(sendHour, Math.floor(Math.random() * 45), 0, 0);
    }
    insSend.run(enrollmentId, step.id, lead.id, toSqlUtc(due));
  }
  tick();
  res.json({ ok: true, enrollment_id: enrollmentId, scheduled: steps.length });
});

app.post('/api/enrollments/:id/stop', (req, res) => {
  db.prepare("UPDATE enrollments SET status = 'stopped' WHERE id = ?").run(req.params.id);
  db.prepare("UPDATE scheduled_sends SET status = 'cancelled' WHERE enrollment_id = ? AND status = 'pending'").run(req.params.id);
  res.json({ ok: true });
});

// ---------- Today ----------

app.get('/api/today', (req, res) => {
  const settings = getSettings();
  const cap = Number(settings.daily_cap) || 100;
  const sentToday = db.prepare(
    "SELECT COUNT(*) AS n FROM scheduled_sends WHERE status = 'sent' AND date(sent_at) = date('now')"
  ).get().n;

  const queue = db.prepare(`
    SELECT ss.id, ss.due_at, ss.status, st.subject, st.step_number, s.name AS sequence_name,
           l.id AS lead_id, l.first_name, l.last_name, l.company, l.email
    FROM scheduled_sends ss
    JOIN sequence_steps st ON st.id = ss.step_id
    JOIN sequences s ON s.id = st.sequence_id
    JOIN leads l ON l.id = ss.lead_id
    WHERE ss.status = 'pending' AND date(ss.due_at) <= date('now')
    ORDER BY ss.due_at ASC`).all();

  const failed = db.prepare(`
    SELECT ss.id, ss.error, ss.due_at, l.id AS lead_id, l.first_name, l.last_name, l.company
    FROM scheduled_sends ss JOIN leads l ON l.id = ss.lead_id
    WHERE ss.status = 'failed' ORDER BY ss.due_at DESC LIMIT 20`).all();

  const calls = db.prepare(`
    SELECT l.*, (SELECT MAX(created_at) FROM activities a WHERE a.lead_id = l.id AND a.type = 'call') AS last_call
    FROM leads l
    WHERE l.stage IN ('cold', 'contacted') AND l.phone != ''
      AND NOT EXISTS (
        SELECT 1 FROM activities a WHERE a.lead_id = l.id AND a.type = 'call' AND date(a.created_at) = date('now')
      )
    ORDER BY l.updated_at ASC LIMIT 25`).all();

  const followups = db.prepare(`
    SELECT l.*, (SELECT MAX(created_at) FROM activities a WHERE a.lead_id = l.id) AS last_activity
    FROM leads l
    WHERE l.stage IN ('replied', 'warm', 'discovery', 'proposal')
      AND (SELECT MAX(created_at) FROM activities a WHERE a.lead_id = l.id) <= datetime('now', '-2 days')
    ORDER BY last_activity ASC LIMIT 25`).all();

  res.json({ cap, sentToday, emailConfigured: isConfigured(), queue, failed, calls, followups });
});

// ---------- Stats ----------

app.get('/api/stats', (req, res) => {
  const byStage = Object.fromEntries(STAGES.map((s) => [s, 0]));
  for (const row of db.prepare('SELECT stage, COUNT(*) AS n FROM leads GROUP BY stage').all()) {
    byStage[row.stage] = row.n;
  }
  const totals = {
    leads: db.prepare('SELECT COUNT(*) AS n FROM leads').get().n,
    emailsSent: db.prepare("SELECT COUNT(*) AS n FROM activities WHERE type = 'email' AND direction = 'out'").get().n,
    calls: db.prepare("SELECT COUNT(*) AS n FROM activities WHERE type = 'call'").get().n,
    linkedinTouches: db.prepare("SELECT COUNT(*) AS n FROM activities WHERE type = 'linkedin'").get().n,
  };
  const week = {
    emailsSent: db.prepare("SELECT COUNT(*) AS n FROM activities WHERE type = 'email' AND direction = 'out' AND created_at >= datetime('now', '-7 days')").get().n,
    calls: db.prepare("SELECT COUNT(*) AS n FROM activities WHERE type = 'call' AND created_at >= datetime('now', '-7 days')").get().n,
  };
  res.json({ byStage, totals, week });
});

// ---------- Settings ----------

app.get('/api/settings', (req, res) => {
  res.json({ ...getSettings(), email_configured: isConfigured(), gmail_user: process.env.GMAIL_USER || '' });
});

app.put('/api/settings', (req, res) => {
  const allowed = {};
  for (const k of ['from_name', 'daily_cap', 'send_hour']) {
    if (k in req.body) allowed[k] = req.body[k];
  }
  setSettings(allowed);
  res.json({ ...getSettings(), email_configured: isConfigured() });
});

app.post('/api/test-email', async (req, res) => {
  try {
    const settings = getSettings();
    const to = req.body.to || process.env.GMAIL_USER;
    await sendEmail({
      to,
      subject: 'Acumei Outbound — test email',
      text: personalise('Hi [your name],\n\nYour outbound platform can send email. You are good to go.', {}, settings),
      fromName: settings.from_name,
    });
    res.json({ ok: true, to });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

// ---------- Static client (after `npm run build`) ----------

const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Outbound API running on http://localhost:${PORT}`);
  if (!isConfigured()) {
    console.log('Email NOT configured — set GMAIL_USER and GMAIL_APP_PASSWORD in outbound/.env to enable sending.');
  }
  startScheduler();
});
