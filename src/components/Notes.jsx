// PLACEHOLDER CONTENT — these five entries are editorial written to show the
// index format. None of these posts exist. Replace them with real writing, or
// wire this list to whatever CMS/MDX source you choose, before launch.
// Category vocabulary: Engineering, Practice, Field notes.
const NOTES = [
  { date: '12 Jul 2026', title: 'What a voicemail-to-dispatch agent actually costs to run', category: 'Engineering', mins: 6 },
  { date: '05 Jul 2026', title: 'When an agent should wake a human, and when it should not', category: 'Engineering', mins: 5 },
  { date: '28 Jun 2026', title: 'Why we build on your accounts, not ours', category: 'Practice', mins: 4 },
  { date: '09 Jun 2026', title: 'Ordering agents and the stock decisions nobody writes down', category: 'Field notes', mins: 7 },
  { date: '21 May 2026', title: 'A fortnight is the right unit of delivery', category: 'Practice', mins: 3 },
  { date: '03 May 2026', title: 'What clients actually own when we hand a system over', category: 'Practice', mins: 5 },
];

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
        Field notes from live systems — what worked, what we&rsquo;d do differently, what it costs
        to run.
      </p>

      <div className="notes">
        {NOTES.map((n, i) => (
          // href is inert until the posts exist
          <a className="note" href="#notes" key={n.title} data-reveal data-fly="right" style={{ '--d': `${i * 80}ms` }}>
            <span className="d">{n.date}</span>
            <span className="t">{n.title}</span>
            <span className="c">{n.category} · {n.mins} min</span>
            <span className="ar">→</span>
          </a>
        ))}
      </div>

      <div className="more" data-reveal>
        <a className="act" href="#notes">All notes <span>→</span></a>
      </div>
    </section>
  );
}
