import { NOTES } from '../lib/notes';

export default function Notes() {
  return (
    <section id="notes">
      <div className="shead" data-reveal>
        <span className="mono">06</span>
        <span className="mono">Notes</span>
      </div>

      <h2 className="swipe" data-reveal>
        What we learn building these things, <span className="amb">written down.</span>
      </h2>

      <p className="sub" data-reveal style={{ '--d': '120ms' }}>
        Engineering notes, working methods and the costs behind useful automation.
      </p>

      <div className="notes">
        {NOTES.map((n, i) => (
          <a className="note" href={n.href} key={n.title} data-reveal data-fly="right" style={{ '--d': `${i * 80}ms` }}>
            <span className="d">{n.date}</span>
            <span className="t">{n.title}</span>
            <span className="c">{n.category} · {n.mins} min</span>
            <span className="ar">→</span>
          </a>
        ))}
      </div>

      <div className="more" data-reveal>
        <a className="act" href="/notes">All notes <span>→</span></a>
      </div>
    </section>
  );
}
