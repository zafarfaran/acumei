// Copy and metrics unchanged. `img` dropped — no photography in this design,
// and the quote/author no longer have a slot in the record row.
const CASES = [
  {
    tag: 'Feedback platform · Premo AI Ltd',
    before: "A new feedback platform for UK trades businesses needed genuinely secure, multi-tenant infrastructure from day one — before a single customer's data could be trusted alongside another's.",
    after: 'Tenant isolation enforced at the database level, tamper-evident audit logging, and payment/webhook security — 1,982 automated tests proving it, not just code that looks right.',
    metric: '1 month',
    metricLabel: 'idea to tested infrastructure',
    href: '/case-studies/premo',
  },
  {
    tag: 'Dental practice · Leeds',
    before: 'No-shows went unnoticed until check-in. Empty chair time added up fast, and cancelled slots rarely got refilled in time.',
    after: 'An agent sends smart reminders, catches cancellations early and automatically offers the freed slot to the next patient on the waitlist.',
    metric: '£1,850/mo',
    metricLabel: 'recovered chair time',
    href: '/case-studies/dental-practice',
  },
  {
    tag: 'Plumbing & heating · Bristol',
    before: 'After-hours calls slipped to voicemail until morning. Roughly £24,000 a year in lost emergency callouts.',
    after: 'An agent listens to the voicemail, works out how urgent it is, texts the engineer on call and confirms the slot.',
    metric: '14 sec',
    metricLabel: 'avg dispatch',
  },
  {
    tag: 'B2B SaaS · London',
    before: 'Overnight tickets sat untouched until someone opened the queue at nine. First response averaged fourteen hours.',
    after: 'An agent groups the tickets that are all the same problem, wakes the engineer on call for anything genuinely broken, and answers the rest.',
    metric: '11 min',
    metricLabel: 'first response',
  },
  {
    tag: 'Restaurant · Leeds',
    before: 'Weekly orders done by hand on a Sunday night. Persistent overstock on perishables.',
    after: 'An agent reads the till data and drafts the weekly order. The chef approves it with a single tap.',
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
        <span className="mono">05</span>
        <span className="mono">Customers, quietly running</span>
      </div>

      <h2 className="swipe" data-reveal>
        Quietly running in the background of <span className="amb">real British businesses.</span>
      </h2>

      <div className="cases">
        {CASES.map((c, i) => (
          <a className="case" href={c.href || '#book'} key={c.tag} data-reveal data-fly="left" style={{ '--d': `${i * 90}ms` }}>
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
