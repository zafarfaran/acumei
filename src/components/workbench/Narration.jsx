import { useEffect, useState } from 'react';
import { STATIC } from '../../lib/motion';

const RED = new Set(['blocked', 'leaked', 'flagged']);

// Types a line out in about half a second. The full text is always there for screen readers.
function Typed({ text }) {
  const [n, setN] = useState(STATIC ? text.length : 0);
  useEffect(() => {
    if (STATIC) return undefined;
    setN(0);
    let i = 0;
    const per = Math.max(2, Math.ceil(text.length / 16));
    const id = setInterval(() => { i += per; setN(Math.min(text.length, i)); if (i >= text.length) clearInterval(id); }, 30);
    return () => clearInterval(id);
  }, [text]);
  return (
    <>
      <span className="wb-sr">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}{n < text.length && <i className="wb-caret" />}</span>
    </>
  );
}

// Colour the first figure in a verdict ("12 people’s salaries", "$11.50"), or the second sentence.
function Emph({ text }) {
  const m = text.match(/(\$[\d.,]+|\d[\d,.]*\s+\S+(?:\s+salaries)?)/);
  if (!m) {
    const k = text.indexOf('. ');
    return k > 0 ? <>{text.slice(0, k + 1)} <em>{text.slice(k + 2)}</em></> : text;
  }
  const i = text.indexOf(m[0]);
  return <>{text.slice(0, i)}<em>{m[0]}</em>{text.slice(i + m[0].length)}</>;
}

// 1 Break it → 2 Watch → 3 Fix it: where you are, always visible.
function Steps({ at, done }) {
  const steps = ['Break it', 'Watch', 'Fix it'];
  return (
    <ol className="wb-steps mono" aria-label="How it works">
      {steps.map((s, i) => (
        <li key={s} className={i === at ? 'is-on' : i < at || done ? 'is-done' : ''} aria-current={i === at ? 'step' : undefined}>
          <b>{i + 1}</b>{s}
        </li>
      ))}
    </ol>
  );
}

/**
 * The left column. One headline and one obvious thing to do at a time:
 * idle → pick a way to break it; run → what the machine is doing now;
 * done → what happened, and the one button that fixes it.
 */
export default function Narration({ mode, challenges, onPick, events, current, waiting, onChoose, verdict, fix, onFix, onDetails, onBack }) {
  if (mode === 'idle') {
    return (
      <div className="wb-nar">
        <Steps at={0} />
        <h1 className="wb-h1">Break the agent.</h1>
        <ul className="wb-ch">
          {challenges.map((c, i) => (
            <li key={c.id} style={{ '--i': i }}>
              <button type="button" onClick={() => onPick(c)}>
                <span className="h">{c.short}</span>
                <span className="go" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (mode === 'run') {
    const steps = events.filter((e) => e.kind !== 'answer' && e.step);
    const cur = current && current.kind !== 'answer' ? current : steps[steps.length - 1];
    const red = cur && RED.has(cur.verdict);
    const asking = waiting && cur?.kind === 'pause' && !cur.pause.chosen;
    return (
      <div className="wb-nar">
        <Steps at={1} />
        <p className="wb-count mono">{asking ? 'It’s asking you' : `Step ${steps.length}`}</p>
        <p className={`wb-say${red ? ' is-red' : ''}`} key={cur?.id}>{cur ? <Typed text={cur.summary} /> : 'Starting…'}</p>
        {asking && (
          <div className="wb-opts">
            {cur.pause.options.length
              ? cur.pause.options.map((o) => <button key={o.id} type="button" className="btn" onClick={() => onChoose(cur.pause.id, o.id)}>{o.label}</button>)
              : null}
          </div>
        )}
      </div>
    );
  }

  // done
  const bad = verdict?.tone === 'bad';
  return (
    <div className="wb-nar">
      <Steps at={bad ? 2 : 3} done={!bad} />
      <h2 className={`wb-verdict-h is-${verdict?.tone || 'good'}`}>{verdict ? <Emph text={verdict.title} /> : 'Done.'}</h2>
      <div className="wb-acts">
        {bad && fix
          ? <button type="button" className="btn wb-fix" onClick={onFix}>Fix it →</button>
          : <button type="button" className="btn wb-again" onClick={onBack}>Break it another way →</button>}
        <button type="button" className="wb-small mono" onClick={onDetails}>See every step</button>
      </div>
      {bad && fix && <p className="wb-hint mono">or drag the glowing part onto the machine</p>}
    </div>
  );
}
