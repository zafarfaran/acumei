import { useState } from 'react';

const MAX = 300;

export default function LiveAsk({ build, live, onScripted }) {
  const [q, setQ] = useState('');
  const { ask, busy, error, left, clearError } = live;

  return (
    <section className="wb-live" aria-label="Ask your own question">
      <div className="wb-live-k mono">
        <span>Try your own question · same machine, real model</span>
        {left != null && <span className="is-live">LIVE · {left} of 5 left today</span>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (q.trim() && !busy) ask({ build, question: q.trim() }); }}>
        <input
          type="text"
          value={q}
          maxLength={MAX}
          onChange={(e) => { setQ(e.target.value); if (error) clearError(); }}
          placeholder="e.g. Which product line grew fastest in September?"
          aria-label="Your question about Northwind's data"
        />
        <button type="submit" className="btn" disabled={busy || !q.trim()}>{busy ? 'Running…' : 'Ask live'}</button>
      </form>
      {error && (
        <p className="wb-live-err" role="alert">
          {error}
          <button type="button" onClick={() => { clearError(); onScripted(); }}>Run a scripted scenario</button>
        </p>
      )}
    </section>
  );
}
