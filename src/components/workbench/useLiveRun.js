import { useCallback, useRef, useState } from 'react';
import { encodeBuild } from '../../lib/workbench/build';

/**
 * Live runs: POSTs the build and question, reads the NDJSON stream and reports
 * the growing event list through onUpdate({ id, events, streaming }). A first
 * line that is an error (no key, limit reached) is shown in the form instead
 * of being played on the drawing.
 */
export default function useLiveRun(onUpdate) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [left, setLeft] = useState(null);
  const ctl = useRef(null);

  const ask = useCallback(async ({ build, question, clarify }) => {
    ctl.current?.abort();
    const ac = new AbortController();
    ctl.current = ac;
    setBusy(true); setError('');
    const id = Date.now();
    const events = [];
    let started = false;
    try {
      const res = await fetch('/api/workbench/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ b: encodeBuild(build), question, clarify }),
        signal: ac.signal,
      });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const e = JSON.parse(line);
          if (e.kind === 'meta') { setLeft(e.left); continue; }
          if (e.kind === 'error' && !started) { setError(e.summary); continue; }
          started = true;
          events.push({ ...e, id: events.length });
          onUpdate({ id, question, events: [...events], streaming: true });
        }
      }
      if (started) onUpdate({ id, question, events: [...events], streaming: false });
    } catch (e) {
      if (e.name !== 'AbortError') setError('Live mode is unavailable right now. Try a scripted scenario.');
      if (started) onUpdate({ id, question, events: [...events], streaming: false });
    } finally {
      if (ctl.current === ac) setBusy(false);
    }
  }, [onUpdate]);

  return { ask, busy, error, left, clearError: () => setError('') };
}
