// Copy and metrics unchanged. `img` dropped — no photography in this design,
// and the quote/author no longer have a slot in the record row.
const CASES = [
  {
    tag: 'Plumbing & heating · Bristol',
    before: 'After-hours calls slipped to voicemail until morning. Roughly £24,000 a year in lost emergency callouts.',
    after: 'A voicemail-to-dispatch agent triages, texts the on-call engineer and confirms the slot.',
    metric: '14 sec',
    metricLabel: 'avg dispatch',
  },
  {
    tag: 'Restaurant · Leeds',
    before: 'Weekly orders done by hand on a Sunday night. Persistent overstock on perishables.',
    after: 'A POS-aware ordering agent drafts the weekly order. The chef approves with a single tap.',
    metric: '−24%',
    metricLabel: 'food waste',
  },
  {
    tag: 'Salon · Manchester',
    before: 'Lapsed clients drifted away. The owner felt awkward “chasing” them.',
    after: 'A daily rebooking agent sends personalised messages in the owner’s voice.',
    metric: '7×',
    metricLabel: 'rebookings/wk',
  },
];

export default function CaseStudies() {
  return (
    <section id="work">
      <div className="shead" data-reveal>
        <span className="mono">04</span>
        <span className="mono">Customers, quietly running</span>
      </div>

      <h2 className="swipe" data-reveal>
        Quietly running in the background of <span className="amb">real British businesses.</span>
      </h2>

      <div className="cases">
        {CASES.map((c, i) => (
          <a className="case" href="#book" key={c.tag} data-reveal style={{ '--d': `${i * 90}ms` }}>
            <div className="tag">{c.tag}</div>
            <div className="ba before"><span className="k">Before</span>{c.before}</div>
            <div className="ba after"><span className="k">After</span>{c.after}</div>
            <div className="m">
              <b>{c.metric}</b>
              <span>{c.metricLabel}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="more" data-reveal>
        <a className="act" href="#book">Read the full case studies <span>→</span></a>
      </div>
    </section>
  );
}
