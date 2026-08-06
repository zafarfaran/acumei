import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Sequences() {
  const [sequences, setSequences] = useState([]);
  const [editing, setEditing] = useState(null); // step being edited
  const [saved, setSaved] = useState(false);

  const load = () => api.get('/api/sequences').then(setSequences);
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.put(`/api/steps/${editing.id}`, {
      subject: editing.subject,
      body: editing.body,
      day_offset: editing.day_offset,
    });
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    load();
  };

  return (
    <>
      <h1>Sequences</h1>
      <p className="sub">
        Placeholders filled automatically per lead: <span className="mono">[first name] [company name] [industry] [city] [pain point] [your name]</span>
      </p>

      {saved && <div className="notice">Step saved. Applies to future sends.</div>}

      {sequences.map((s) => (
        <div key={s.id} style={{ marginBottom: 36 }}>
          <h2>{s.name}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 12px' }}>{s.description}</p>
          {s.steps.map((st) => (
            <div key={st.id} className="card" style={{ marginBottom: 12 }}>
              {editing?.id === st.id ? (
                <>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <div style={{ width: 120 }}>
                      <label>Day offset</label>
                      <input
                        type="number"
                        min="0"
                        value={editing.day_offset}
                        onChange={(e) => setEditing({ ...editing, day_offset: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Subject</label>
                      <input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
                    </div>
                  </div>
                  <textarea
                    style={{ minHeight: 220 }}
                    value={editing.body}
                    onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  />
                  <div className="row mt">
                    <button className="btn small" onClick={save}>Save</button>
                    <button className="btn small ghost" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <span className="badge">Day {st.day_offset}</span>
                    <strong style={{ fontSize: 14 }}>{st.subject}</strong>
                    <div className="spacer" />
                    <button className="btn small ghost" onClick={() => setEditing({ ...st })}>Edit</button>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--ink-soft)', fontSize: 13, marginTop: 12 }}>
                    {st.body}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
