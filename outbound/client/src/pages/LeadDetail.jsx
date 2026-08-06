import { useCallback, useEffect, useState } from 'react';
import { api, STAGES, STAGE_LABELS, fmtDate } from '../api.js';

const ACTIVITY_TYPES = ['call', 'email', 'sms', 'linkedin', 'note'];

export default function LeadDetail({ leadId, onClose }) {
  const [lead, setLead] = useState(null);
  const [sequences, setSequences] = useState([]);
  const [seqId, setSeqId] = useState('');
  const [act, setAct] = useState({ type: 'call', outcome: '', body: '' });
  const [err, setErr] = useState('');

  const load = useCallback(
    () => api.get(`/api/leads/${leadId}`).then(setLead).catch((e) => setErr(e.message)),
    [leadId]
  );

  useEffect(() => {
    load();
    api.get('/api/sequences').then((s) => { setSequences(s); if (s[0]) setSeqId(String(s[0].id)); });
  }, [load]);

  if (!lead) return null;

  const setStage = async (stage) => {
    await api.patch(`/api/leads/${lead.id}`, { stage });
    load();
  };

  const logActivity = async () => {
    await api.post(`/api/leads/${lead.id}/activities`, act);
    setAct({ type: act.type, outcome: '', body: '' });
    load();
  };

  const enroll = async () => {
    setErr('');
    try {
      await api.post(`/api/leads/${lead.id}/enroll`, { sequence_id: Number(seqId) });
      load();
    } catch (e) { setErr(e.message); }
  };

  const stopEnrollment = async (id) => {
    await api.post(`/api/enrollments/${id}/stop`);
    load();
  };

  const remove = async () => {
    if (!confirm('Delete this lead and all its history?')) return;
    await api.del(`/api/leads/${lead.id}`);
    onClose();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <button className="close" onClick={onClose}>&times;</button>
        <h1>{lead.first_name} {lead.last_name}</h1>
        <p className="sub">
          {lead.company}{lead.industry ? ` · ${lead.industry}` : ''}{lead.city ? ` · ${lead.city}` : ''}
        </p>

        {err && <div className="notice error">{err}</div>}

        <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {STAGES.map((s) => (
            <button
              key={s}
              className={`pill${lead.stage === s ? ' active' : ''}`}
              onClick={() => setStage(s)}
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 20, fontSize: 13 }}>
          <div className="row" style={{ flexWrap: 'wrap', gap: 16 }}>
            {lead.email && <span className="mono">{lead.email}</span>}
            {lead.phone && <span className="mono">{lead.phone}</span>}
            {lead.linkedin_url && (
              <a href={lead.linkedin_url} target="_blank" rel="noreferrer">LinkedIn profile ↗</a>
            )}
          </div>
          {lead.pain_point && <div className="mt" style={{ color: 'var(--ink-soft)' }}>Pain point: {lead.pain_point}</div>}
          {lead.notes && <div className="mt" style={{ color: 'var(--ink-soft)', whiteSpace: 'pre-wrap' }}>{lead.notes}</div>}
        </div>

        <h2>Sequence</h2>
        {lead.enrollments.filter((e) => e.status === 'active').length === 0 ? (
          <div className="row">
            <select value={seqId} onChange={(e) => setSeqId(e.target.value)} style={{ maxWidth: 260 }}>
              {sequences.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="btn small" onClick={enroll} disabled={!lead.email}>Enroll</button>
            {!lead.email && <span style={{ color: 'var(--muted)', fontSize: 12 }}>needs an email address</span>}
          </div>
        ) : null}
        {lead.enrollments.map((e) => (
          <div key={e.id} className="row mt" style={{ fontSize: 13 }}>
            <span className={`badge ${e.status === 'active' ? 'warm' : ''}`}>{e.status}</span>
            <span>{e.sequence_name}</span>
            <span style={{ color: 'var(--muted)' }}>
              {e.sent_count} sent · {e.pending_count} pending{e.next_due ? ` · next ${fmtDate(e.next_due)}` : ''}
            </span>
            {e.status === 'active' && (
              <button className="btn small ghost" onClick={() => stopEnrollment(e.id)}>Stop</button>
            )}
          </div>
        ))}

        <h2>Log activity</h2>
        <div className="row" style={{ marginBottom: 10 }}>
          {ACTIVITY_TYPES.map((t) => (
            <button
              key={t}
              className={`pill${act.type === t ? ' active' : ''}`}
              onClick={() => setAct({ ...act, type: t })}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="field">
          <label>Outcome</label>
          <input
            placeholder={act.type === 'call' ? 'e.g. picked up, interested, call back Tuesday' : 'e.g. sent connection request, replied'}
            value={act.outcome}
            onChange={(e) => setAct({ ...act, outcome: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Notes / message</label>
          <textarea value={act.body} onChange={(e) => setAct({ ...act, body: e.target.value })} />
        </div>
        <button className="btn small" onClick={logActivity} disabled={!act.outcome && !act.body}>Log {act.type}</button>

        <h2>History</h2>
        {lead.activities.length === 0 ? (
          <div className="empty">No activity yet.</div>
        ) : (
          lead.activities.map((a) => (
            <div key={a.id} className="activity-item">
              <div className="meta mono">
                {fmtDate(a.created_at)} · {a.type}{a.direction === 'in' ? ' (inbound)' : ''}
                {a.outcome ? ` · ${a.outcome}` : ''}
              </div>
              {a.subject && <div style={{ fontSize: 13, marginTop: 2 }}>{a.subject}</div>}
              {a.body && <div className="body">{a.body}</div>}
            </div>
          ))
        )}

        <div className="mt" style={{ paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button className="btn small danger" onClick={remove}>Delete lead</button>
        </div>
      </div>
    </>
  );
}
