import { useEffect, useState } from 'react';
import { api, fmtDate } from '../api.js';

export default function Today() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const load = () => api.get('/api/today').then(setData).catch((e) => setErr(e.message));

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);

  if (err) return <div className="notice error">{err}</div>;
  if (!data) return <div className="empty">Loading…</div>;

  return (
    <>
      <h1>Today</h1>
      <p className="sub">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

      {!data.emailConfigured && (
        <div className="notice">
          Email sending is not configured. Add <span className="mono">GMAIL_USER</span> and{' '}
          <span className="mono">GMAIL_APP_PASSWORD</span> to <span className="mono">outbound/.env</span> and restart.
          Sequences will queue but nothing will send until then.
        </div>
      )}

      <div className="cards-row">
        <div className="card">
          <div className="stat-big">{data.sentToday} <span style={{ fontSize: 16, color: 'var(--muted)' }}>/ {data.cap}</span></div>
          <div className="stat-label">Emails sent today</div>
        </div>
        <div className="card">
          <div className="stat-big">{data.queue.length}</div>
          <div className="stat-label">Queued for today</div>
        </div>
        <div className="card">
          <div className="stat-big">{data.calls.length}</div>
          <div className="stat-label">Calls to make</div>
        </div>
        <div className="card">
          <div className="stat-big">{data.followups.length}</div>
          <div className="stat-label">Warm follow-ups due</div>
        </div>
      </div>

      <h2>Email queue</h2>
      {data.queue.length === 0 ? (
        <div className="empty">Nothing queued for today. Enroll leads in a sequence from the Leads page.</div>
      ) : (
        <table>
          <thead><tr><th>Due</th><th>Lead</th><th>Sequence</th><th>Subject</th></tr></thead>
          <tbody>
            {data.queue.map((q) => (
              <tr key={q.id}>
                <td className="mono">{fmtDate(q.due_at)}</td>
                <td>{q.first_name} {q.last_name} <span style={{ color: 'var(--muted)' }}>· {q.company}</span></td>
                <td>{q.sequence_name} · step {q.step_number}</td>
                <td style={{ color: 'var(--ink-soft)' }}>{q.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.failed.length > 0 && (
        <>
          <h2>Failed sends</h2>
          <table>
            <thead><tr><th>Lead</th><th>Error</th></tr></thead>
            <tbody>
              {data.failed.map((f) => (
                <tr key={f.id}>
                  <td>{f.first_name} {f.last_name} · {f.company}</td>
                  <td style={{ color: 'var(--red)' }}>{f.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Calls to make</h2>
      {data.calls.length === 0 ? (
        <div className="empty">No cold/contacted leads with phone numbers waiting for a call today.</div>
      ) : (
        <table>
          <thead><tr><th>Lead</th><th>Phone</th><th>City</th><th>Last called</th></tr></thead>
          <tbody>
            {data.calls.map((l) => (
              <tr key={l.id}>
                <td>{l.first_name} {l.last_name} <span style={{ color: 'var(--muted)' }}>· {l.company}</span></td>
                <td className="mono">{l.phone}</td>
                <td>{l.city}</td>
                <td className="mono">{fmtDate(l.last_call)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Warm leads needing follow-up</h2>
      {data.followups.length === 0 ? (
        <div className="empty">No warm leads waiting more than 2 days. Nice.</div>
      ) : (
        <table>
          <thead><tr><th>Lead</th><th>Stage</th><th>Last activity</th></tr></thead>
          <tbody>
            {data.followups.map((l) => (
              <tr key={l.id}>
                <td>{l.first_name} {l.last_name} <span style={{ color: 'var(--muted)' }}>· {l.company}</span></td>
                <td><span className={`badge ${l.stage}`}>{l.stage}</span></td>
                <td className="mono">{fmtDate(l.last_activity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
