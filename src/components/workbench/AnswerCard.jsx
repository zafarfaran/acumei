// The answer as the person who asked would receive it: where it went, the
// headline, a short write-up and one chart. Wrong or leaked answers carry a
// red banner; the contrast line says what a different build would have done.
function Bars({ chart }) {
  const max = Math.max(...chart.rows.map((r) => Math.abs(r.value)), 1);
  const neg = chart.rows.some((r) => r.value < 0);
  return (
    <div className={`wb-bars${neg ? ' has-neg' : ''}`} role="img" aria-label={chart.rows.map((r) => `${r.label} ${r.value}`).join(', ')}>
      {chart.rows.map((r) => (
        <div key={r.label} className="wb-bar">
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
          <div className="wb-headline">{answer.headline}</div>
          <h3>{answer.title}</h3>
          <p>{answer.text}</p>
        </div>
        {answer.chart && <Bars chart={answer.chart} />}
      </div>
      {answer.contrast && <p className="wb-contrast mono">{answer.contrast}</p>}
    </section>
  );
}
