import { useEffect, useState } from 'react';
import { api, STAGES, STAGE_LABELS } from '../api.js';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/api/stats').then(setStats); }, []);

  if (!stats) return <div className="empty">Loading…</div>;

  const funnel = ['contacted', 'replied', 'warm', 'discovery', 'proposal', 'won'];
  const reached = (s) => {
    const idx = STAGES.indexOf(s);
    return STAGES.slice(idx).filter((x) => x !== 'lost' || s === 'lost')
      .reduce((sum, x) => sum + (stats.byStage[x] || 0), 0);
  };

  return (
    <>
      <h1>Stats</h1>
      <p className="sub">Weekly targets from the playbook: 500–750 emails, 200–300 calls, 5–10 discovery calls booked.</p>

      <div className="cards-row">
        <div className="card"><div className="stat-big">{stats.totals.leads}</div><div className="stat-label">Total leads</div></div>
        <div className="card"><div className="stat-big">{stats.totals.emailsSent}</div><div className="stat-label">Emails sent (all time)</div></div>
        <div className="card"><div className="stat-big">{stats.week.emailsSent}</div><div className="stat-label">Emails this week</div></div>
        <div className="card"><div className="stat-big">{stats.week.calls}</div><div className="stat-label">Calls this week</div></div>
        <div className="card"><div className="stat-big">{stats.totals.linkedinTouches}</div><div className="stat-label">LinkedIn touches</div></div>
      </div>

      <h2>Pipeline</h2>
      <table>
        <thead><tr><th>Stage</th><th>Leads currently here</th><th>Reached this stage or beyond</th></tr></thead>
        <tbody>
          {funnel.map((s) => (
            <tr key={s}>
              <td><span className={`badge ${s}`}>{STAGE_LABELS[s]}</span></td>
              <td>{stats.byStage[s] || 0}</td>
              <td>{reached(s)}</td>
            </tr>
          ))}
          <tr>
            <td><span className="badge lost">Lost</span></td>
            <td>{stats.byStage.lost || 0}</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
