import { useEffect, useRef, useState } from 'react';
import { api, parseCsv, STAGES, STAGE_LABELS, fmtDate } from '../api.js';
import LeadDetail from './LeadDetail.jsx';

const EMPTY_LEAD = {
  first_name: '', last_name: '', company: '', industry: '', city: '',
  email: '', phone: '', linkedin_url: '', pain_point: '', notes: '',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [stage, setStage] = useState('');
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(EMPTY_LEAD);
  const [openId, setOpenId] = useState(null);
  const [msg, setMsg] = useState('');
  const fileRef = useRef();

  const load = () => {
    const params = new URLSearchParams();
    if (stage) params.set('stage', stage);
    if (q) params.set('q', q);
    api.get(`/api/leads?${params}`).then(setLeads).catch((e) => setMsg(e.message));
  };

  useEffect(load, [stage, q]);

  const addLead = async () => {
    await api.post('/api/leads', draft);
    setDraft(EMPTY_LEAD);
    setShowAdd(false);
    load();
  };

  const importCsv = async (file) => {
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) { setMsg('No rows found in CSV. Expected a header row with columns like first_name, company, email…'); return; }
    const result = await api.post('/api/leads/import', rows);
    setMsg(`Imported ${result.imported} leads (${result.skipped} skipped as duplicate emails).`);
    load();
  };

  return (
    <>
      <h1>Leads</h1>
      <p className="sub">{leads.length} shown · click a lead to open it</p>

      {msg && <div className="notice" onClick={() => setMsg('')}>{msg}</div>}

      <div className="row" style={{ marginBottom: 16 }}>
        <input
          placeholder="Search name, company, email, city…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <div className="spacer" />
        <button className="btn ghost" onClick={() => fileRef.current.click()}>Import CSV</button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) importCsv(e.target.files[0]); e.target.value = ''; }}
        />
        <button className="btn" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add lead'}</button>
      </div>

      <div className="pill-row">
        <button className={`pill${stage === '' ? ' active' : ''}`} onClick={() => setStage('')}>All</button>
        {STAGES.map((s) => (
          <button key={s} className={`pill${stage === s ? ' active' : ''}`} onClick={() => setStage(s)}>
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="form-grid">
            {Object.keys(EMPTY_LEAD).map((f) => (
              <div className="field" key={f}>
                <label>{f.replace(/_/g, ' ')}</label>
                {f === 'notes' ? (
                  <textarea value={draft[f]} onChange={(e) => setDraft({ ...draft, [f]: e.target.value })} />
                ) : (
                  <input value={draft[f]} onChange={(e) => setDraft({ ...draft, [f]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <button className="btn" onClick={addLead} disabled={!draft.first_name && !draft.company}>Save lead</button>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="empty">No leads yet. Add one or import a CSV (columns: first_name, last_name, company, industry, city, email, phone, linkedin_url, pain_point, notes).</div>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Company</th><th>City</th><th>Stage</th><th>Sequence</th><th>Last activity</th></tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="clickable" onClick={() => setOpenId(l.id)}>
                <td>{l.first_name} {l.last_name}</td>
                <td>{l.company}<div style={{ fontSize: 12, color: 'var(--muted)' }}>{l.industry}</div></td>
                <td>{l.city}</td>
                <td><span className={`badge ${l.stage}`}>{STAGE_LABELS[l.stage]}</span></td>
                <td>{l.active_enrollments > 0 ? <span className="badge warm">active</span> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                <td className="mono">{fmtDate(l.last_activity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {openId && (
        <LeadDetail
          leadId={openId}
          onClose={() => { setOpenId(null); load(); }}
        />
      )}
    </>
  );
}
