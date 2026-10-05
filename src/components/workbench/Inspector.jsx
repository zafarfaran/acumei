import { useEffect, useRef } from 'react';
import { slotByCode } from '../../lib/workbench/parts';
import AnswerCard from './AnswerCard';

const MASK = '••••';

function Rows({ rows }) {
  const masked = new Set(rows.masked || []);
  return (
    <div className="wb-rows">
      <table>
        <thead><tr>{rows.columns.map((c) => <th key={c} className={masked.has(c) ? 'is-masked' : ''}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.rows.map((r, i) => (
            <tr key={i}>{r.map((v, j) => <td key={j}>{masked.has(rows.columns[j]) || v == null ? MASK : typeof v === 'number' ? v.toLocaleString('en-GB') : v}</td>)}</tr>
          ))}
        </tbody>
      </table>
      {masked.size > 0 && <p className="wb-note mono">Masked by G-02: {[...masked].join(', ')}</p>}
    </div>
  );
}

export function EventDetail({ e }) {
  return (
    <article className={`wb-ev v-${e.verdict || 'none'}`}>
      <header className="mono">
        <span>{String(e.id + 1).padStart(2, '0')} · {e.step} {slotByCode(e.step)?.name || ''}</span>
        <span className="wb-verdict">{e.verdict}</span>
      </header>
      <p className="wb-ev-sum">{e.summary}</p>
      {e.definition && <><h4 className="mono">Definition used</h4><pre className="wb-pre">{e.definition}</pre></>}
      {e.reasoning && <><h4 className="mono">Reasoning</h4><p>{e.reasoning}</p></>}
      {e.sql && <><h4 className="mono">SQL</h4><pre className="wb-pre wb-sql">{e.sql}</pre></>}
      {e.rows && <><h4 className="mono">Rows returned</h4><Rows rows={e.rows} /></>}
      {e.pause && (
        <>
          <h4 className="mono">Waiting on</h4>
          <p>{e.pause.prompt}</p>
          <p className="mono wb-note">{e.pause.chosen ? `Chosen: ${e.pause.options.find((o) => o.id === e.pause.chosen)?.label}` : 'No choice yet: pick one on the drawing.'}</p>
        </>
      )}
      <p className="wb-note mono">{e.t}</p>
    </article>
  );
}

export default function Inspector({ open, events, focusId, tab, showAll, auditFitted, onClose, onTab, onShowAll, onFocus }) {
  const ref = useRef(null);
  const focus = events.find((e) => e.id === focusId) || events[events.length - 1] || null;
  const answer = events.find((e) => e.kind === 'answer')?.answer;
  const steps = events.filter((e) => e.kind !== 'answer');

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => { if (open) ref.current?.focus(); }, [open]);

  return (
    <aside className={`wb-insp${open ? ' is-open' : ''}`} aria-label="Inspector" aria-hidden={!open} ref={ref} tabIndex={-1}>
      <div className="wb-insp-hd">
        <div className="wb-tabs mono" role="tablist">
          {['step', 'audit', 'answer'].map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => onTab(t)} tabIndex={open ? 0 : -1}>{t}</button>
          ))}
        </div>
        <label className="wb-all mono"><input type="checkbox" checked={showAll} onChange={(e) => onShowAll(e.target.checked)} tabIndex={open ? 0 : -1} /> Show all</label>
        <button type="button" className="wb-x mono" onClick={onClose} aria-label="Close inspector" tabIndex={open ? 0 : -1}>✕</button>
      </div>

      <div className="wb-insp-body">
        {tab === 'step' && (
          !steps.length ? <p className="wb-empty">Run the machine to see each step here.</p>
          : showAll ? steps.map((e) => <EventDetail key={e.id} e={e} />)
          : focus && focus.kind !== 'answer' ? (
            <>
              <EventDetail e={focus} />
              <div className="wb-pn mono">
                <button type="button" disabled={focus.id === 0} onClick={() => onFocus(focus.id - 1)}>← Previous</button>
                <button type="button" disabled={focus.id >= steps.length - 1} onClick={() => onFocus(focus.id + 1)}>Next →</button>
              </div>
            </>
          ) : steps.map((e) => <EventDetail key={e.id} e={e} />)
        )}

        {tab === 'audit' && (
          !auditFitted ? <p className="wb-empty">No audit log fitted. This run leaves no record of what was asked, what ran or why. Fit <b>G-05</b> to keep one.</p>
          : (
            <ol className="wb-audit mono">
              {steps.map((e) => <li key={e.id}><span>{e.t}</span>{e.audit}</li>)}
            </ol>
          )
        )}

        {tab === 'answer' && (answer ? <AnswerCard answer={answer} compact /> : <p className="wb-empty">No answer yet.</p>)}
      </div>
    </aside>
  );
}
