import { useEffect, useState } from 'react';
import { slotByCode } from '../../lib/workbench/parts';
import { verdictWord } from '../../lib/workbench/words';
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

// Colour the first figure in a verdict ("12 people’s salaries", "$11.50") in the tone colour.
function Emph({ text }) {
  const m = text.match(/(\$[\d.,]+|\d[\d,.]*\s+\S+(?:\s+salaries)?)/);
  if (!m) {
    // no figure: accent the second sentence instead ("Names were hidden. Only averages went out.")
    const k = text.indexOf('. ');
    return k > 0 ? <>{text.slice(0, k + 1)} <em>{text.slice(k + 2)}</em></> : text;
  }
  const i = text.indexOf(m[0]);
  return <>{text.slice(0, i)}<em>{m[0]}</em>{text.slice(i + m[0].length)}</>;
}

const Kicker = ({ children, tone }) => <div className={`wb-k mono${tone ? ` is-${tone}` : ''}`}><i aria-hidden="true" />{children}</div>;

function Log({ events, current }) {
  return (
    <ol className="wb-log">
      {events.map((e, i) => (
        <li key={e.id} className={`${current?.id === e.id ? 'is-cur' : ''} v-${e.verdict}`} style={{ '--i': i }}>
          <span className="n mono">{String(i + 1).padStart(2, '0')}</span>
          <span className="h">{slotByCode(e.step)?.name || e.step}</span>
          <span className={`v mono${RED.has(e.verdict) ? ' is-red' : e.verdict === 'fixed' || e.verdict === 'paused' ? ' is-amb' : ''}`}>{verdictWord(e.verdict)}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The left column: big display type that narrates what the machine is doing.
 * idle → four ways to break it; run → the live step log; done → the verdict
 * and the one button that fixes it.
 */
export default function Narration({
  mode, challenges, challengeId, onPick, onRunAsBuilt, scenarios, scenarioId, onScenario,
  events, current, waiting, onChoose, verdict, fix, onFix, onDetails, onBack, title,
}) {
  const steps = events.filter((e) => e.kind !== 'answer' && e.step);

  if (mode === 'idle') {
    return (
      <div className="wb-nar">
        <Kicker>FIG. W-01 · WORKBENCH · DATA ANALYSIS AGENT</Kicker>
        <h1 className="wb-h1">Build an agent.<span className="amb"> Then break it.</span></h1>
        <p className="wb-lede">A data agent for a made-up company. Pick a way to break it, watch what goes wrong, then fix it.</p>
        <ol className="wb-ch">
          {challenges.map((c, i) => (
            <li key={c.id} style={{ '--i': i }}>
              <button type="button" onClick={() => onPick(c)} className={challengeId === c.id ? 'is-last' : ''}>
                <span className="n mono">0{i + 1}</span>
                <span className="h">{c.title}<span className="s mono">{c.blurb}</span></span>
                <span className="go mono" aria-hidden="true">Break it →</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="wb-alt">
          <button type="button" className="lnk wb-asbuilt" onClick={onRunAsBuilt}>▶ Run it as built</button>
          <label className="wb-scn mono">
            <span>Question</span>
            <select value={scenarioId} onChange={(e) => onScenario(e.target.value)}>
              {scenarios.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </label>
        </div>
      </div>
    );
  }

  if (mode === 'run') {
    const n = steps.length;
    const cur = current && current.kind !== 'answer' ? current : steps[steps.length - 1];
    const red = cur && RED.has(cur.verdict);
    return (
      <div className="wb-nar">
        <Kicker tone={red ? 'red' : 'amb'}>RUNNING · {title.toUpperCase()} · STEP {String(n).padStart(2, '0')}</Kicker>
        <p className={`wb-say${red ? ' is-red' : ''}`} key={cur?.id}>{cur ? <Typed text={cur.summary} /> : 'Starting…'}</p>
        {waiting && cur?.kind === 'pause' && !cur.pause.chosen && (
          <div className="wb-opts">
            {cur.pause.options.length
              ? cur.pause.options.map((o) => <button key={o.id} type="button" className="btn" onClick={() => onChoose(cur.pause.id, o.id)}>{o.label}</button>)
              : <p className="wb-lede">{cur.pause.prompt}</p>}
          </div>
        )}
        <Log events={steps} current={cur} />
      </div>
    );
  }

  // done
  return (
    <div className="wb-nar">
      <Kicker tone={verdict?.tone === 'bad' ? 'red' : verdict?.tone === 'good' ? 'green' : 'amb'}>RUN COMPLETE · {title.toUpperCase()} · {steps.length} STEPS</Kicker>
      <h2 className={`wb-verdict-h is-${verdict?.tone || 'good'}`}>{verdict ? <Emph text={verdict.title} /> : 'Done.'}</h2>
      <Log events={steps} current={null} />
      <div className="wb-acts">
        {fix && verdict?.tone === 'bad' && (
          <button type="button" className="btn wb-fix" onClick={onFix}>Fix it · {fix.label}</button>
        )}
        <button type="button" className="lnk" onClick={onDetails}>See every step</button>
        <button type="button" className="lnk wb-back" onClick={onBack}>Try another way to break it</button>
      </div>
    </div>
  );
}
