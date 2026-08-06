import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [testTo, setTestTo] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => { api.get('/api/settings').then(setSettings); }, []);

  if (!settings) return <div className="empty">Loading…</div>;

  const save = async () => {
    const updated = await api.put('/api/settings', {
      from_name: settings.from_name,
      daily_cap: settings.daily_cap,
      send_hour: settings.send_hour,
    });
    setSettings({ ...settings, ...updated });
    setMsg('Settings saved.');
    setErr('');
  };

  const sendTest = async () => {
    setMsg(''); setErr('');
    try {
      const r = await api.post('/api/test-email', { to: testTo || undefined });
      setMsg(`Test email sent to ${r.to}.`);
    } catch (e) { setErr(e.message); }
  };

  return (
    <>
      <h1>Settings</h1>
      <p className="sub">Email credentials live in <span className="mono">outbound/.env</span>, never in this database.</p>

      {msg && <div className="notice">{msg}</div>}
      {err && <div className="notice error">{err}</div>}

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="field">
          <label>Your name (used for [your name] in templates and as the email from-name)</label>
          <input value={settings.from_name} onChange={(e) => setSettings({ ...settings, from_name: e.target.value })} />
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Daily send cap</label>
            <input type="number" min="1" max="400" value={settings.daily_cap} onChange={(e) => setSettings({ ...settings, daily_cap: e.target.value })} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Send hour (24h, for follow-up emails)</label>
            <input type="number" min="0" max="23" value={settings.send_hour} onChange={(e) => setSettings({ ...settings, send_hour: e.target.value })} />
          </div>
        </div>
        <button className="btn" onClick={save}>Save settings</button>
      </div>

      <h2>Email status</h2>
      <div className="card" style={{ maxWidth: 520 }}>
        {settings.email_configured ? (
          <p style={{ margin: 0 }}>
            Sending as <span className="mono">{settings.gmail_user}</span>.
          </p>
        ) : (
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
            Not configured. Copy <span className="mono">outbound/.env.example</span> to{' '}
            <span className="mono">outbound/.env</span>, fill in your Gmail address and an{' '}
            <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer">app password</a>, then restart the server.
          </p>
        )}
        <div className="row mt">
          <input
            placeholder={settings.gmail_user || 'recipient@example.com'}
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <button className="btn small ghost" onClick={sendTest} disabled={!settings.email_configured}>Send test email</button>
        </div>
      </div>

      <h2>A note on LinkedIn</h2>
      <div className="card" style={{ maxWidth: 520, color: 'var(--ink-soft)', fontSize: 13 }}>
        LinkedIn outreach is tracked here but never automated — automated messaging violates LinkedIn's
        terms and risks your account. Open the lead's profile from their detail panel, send your message
        by hand, then log it as a LinkedIn activity.
      </div>
    </>
  );
}
