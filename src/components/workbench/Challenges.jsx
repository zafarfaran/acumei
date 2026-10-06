import { CHALLENGES } from '../../lib/workbench/challenges';

// The fastest way in: one tap sets up a broken machine and runs it.
export default function Challenges({ active, onPick }) {
  return (
    <section className="wb-chal" aria-label="Try to break it">
      <div className="wb-chal-k mono">Start here · pick a way to break it</div>
      <div className="wb-chal-grid">
        {CHALLENGES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`wb-card${active === c.id ? ' is-on' : ''}`}
            style={{ '--i': i }}
            onClick={() => onPick(c)}
          >
            <span className="wb-card-n mono">0{i + 1}</span>
            <span className="wb-card-t">{c.title}</span>
            <span className="wb-card-b">{c.blurb}</span>
            <span className="wb-card-go mono">{active === c.id ? 'Running' : 'Break it'} <i aria-hidden="true">→</i></span>
          </button>
        ))}
      </div>
    </section>
  );
}
