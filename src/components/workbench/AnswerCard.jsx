import { useEffect, useState } from 'react';
import { STATIC } from '../../lib/motion';

// Counts the number in a headline up from zero ("−12%", "31,960", "12 salaries").
function CountUp({ text }) {
  const m = String(text).match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  const target = m ? Number(m[2].replace(/,/g, '')) : null;
  const [v, setV] = useState(STATIC || target == null ? target : 0);
  useEffect(() => {
    if (STATIC || target == null) return undefined;
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 900);
      setV(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  if (target == null) return text;
  const dec = (m[2].split('.')[1] || '').length;
  const shown = v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return <><span className="wb-sr">{text}</span><span aria-hidden="true">{m[1]}{m[2].includes(',') || v >= 1000 ? shown : shown.replace(/,/g, '')}{m[3]}</span></>;
}

// The answer as the person who asked would receive it: where it went, the
// headline, a short write-up and one chart. Wrong or leaked answers carry a
// red banner; the contrast line says what a different build would have done.
function Bars({ chart }) {
  const max = Math.max(...chart.rows.map((r) => Math.abs(r.value)), 1);
  const neg = chart.rows.some((r) => r.value < 0);
  return (
    <div className={`wb-bars${neg ? ' has-neg' : ''}`} role="img" aria-label={chart.rows.map((r) => `${r.label} ${r.value}`).join(', ')}>
      {chart.rows.map((r, i) => (
        <div key={r.label} className="wb-bar" style={{ '--i': i }}>
          <span className="l">{r.label}</span>
          <span className="t">
            <i className={r.value < 0 ? 'is-neg' : ''} style={{ '--w': `${(Math.abs(r.value) / max) * (neg ? 50 : 100)}%` }} />
          </span>
          <span className="v mono">{r.value > 0 && neg ? '+' : ''}{r.value.toLocaleString('en-GB')}{chart.unit === '£k' ? 'k' : ''}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnswerCard({ answer, compact = false }) {
  const d = answer.delivered;
  return (
    <section className={`wb-answer${compact ? ' is-compact' : ''}${answer.flagged ? ' is-flagged' : ''}`} aria-label="Answer">
      <div className="wb-answer-k mono">
        {d ? (d.posted ? `Delivered · ${d.format} → ${d.to}` : `Not delivered · held by the analyst`) : 'Answer'}
      </div>
      {answer.flagged && <p className="wb-flag">{answer.flagged}</p>}
      <div className="wb-answer-main">
        <div>
          <div className="wb-headline"><CountUp text={answer.headline} /></div>
          <h3>{answer.title}</h3>
          <p>{answer.text}</p>
        </div>
        {answer.chart && <Bars chart={answer.chart} />}
      </div>
      {answer.contrast && <p className="wb-contrast mono">{answer.contrast}</p>}
    </section>
  );
}
