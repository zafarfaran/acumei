import { db, getSettings, personalise } from './db.js';
import { isConfigured, sendEmail } from './mailer.js';

const dueSends = db.prepare(`
  SELECT ss.id, ss.lead_id, ss.enrollment_id, ss.step_id,
         st.subject, st.body, st.step_number,
         l.email, l.first_name, l.last_name, l.company, l.industry, l.city, l.pain_point, l.stage
  FROM scheduled_sends ss
  JOIN sequence_steps st ON st.id = ss.step_id
  JOIN leads l ON l.id = ss.lead_id
  JOIN enrollments e ON e.id = ss.enrollment_id
  WHERE ss.status = 'pending' AND e.status = 'active' AND ss.due_at <= datetime('now')
  ORDER BY ss.due_at ASC
  LIMIT ?
`);

const sentTodayCount = db.prepare(
  "SELECT COUNT(*) AS n FROM scheduled_sends WHERE status = 'sent' AND date(sent_at) = date('now')"
);

const markSent = db.prepare("UPDATE scheduled_sends SET status = 'sent', sent_at = datetime('now') WHERE id = ?");
const markFailed = db.prepare("UPDATE scheduled_sends SET status = 'failed', error = ? WHERE id = ?");
const logActivity = db.prepare(
  "INSERT INTO activities (lead_id, type, direction, subject, body, outcome) VALUES (?, 'email', 'out', ?, ?, 'sequence send')"
);
const pendingForEnrollment = db.prepare(
  "SELECT COUNT(*) AS n FROM scheduled_sends WHERE enrollment_id = ? AND status = 'pending'"
);
const completeEnrollment = db.prepare("UPDATE enrollments SET status = 'completed' WHERE id = ?");
const advanceStage = db.prepare(
  "UPDATE leads SET stage = 'contacted', updated_at = datetime('now') WHERE id = ? AND stage = 'cold'"
);

let running = false;

export async function tick() {
  if (running || !isConfigured()) return;
  running = true;
  try {
    const settings = getSettings();
    const cap = Number(settings.daily_cap) || 100;
    const remaining = cap - sentTodayCount.get().n;
    if (remaining <= 0) return;

    const batch = dueSends.all(remaining);
    for (const row of batch) {
      if (!row.email) {
        markFailed.run('Lead has no email address', row.id);
        continue;
      }
      const lead = row;
      const subject = personalise(row.subject, lead, settings);
      const body = personalise(row.body, lead, settings);
      try {
        await sendEmail({ to: row.email, subject, text: body, fromName: settings.from_name });
        markSent.run(row.id);
        logActivity.run(row.lead_id, subject, body);
        advanceStage.run(row.lead_id);
        if (pendingForEnrollment.get(row.enrollment_id).n === 0) {
          completeEnrollment.run(row.enrollment_id);
        }
        // Small gap between sends to look human and stay friendly with Gmail.
        await new Promise((r) => setTimeout(r, 4000 + Math.random() * 6000));
      } catch (err) {
        markFailed.run(String(err.message || err), row.id);
      }
    }
  } finally {
    running = false;
  }
}

export function startScheduler() {
  tick(); // catch up on overdue sends at startup
  setInterval(tick, 60_000);
}
