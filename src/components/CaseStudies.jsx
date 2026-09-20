// Copy and metrics unchanged. `img` dropped — no photography in this design,
// and the quote/author no longer have a slot in the record row.
const CASES = [
  {
    tag: 'Feedback platform · Premo AI Ltd',
    before: "A new feedback platform for UK trades businesses needed genuinely secure, multi-tenant infrastructure from day one — before a single customer's data could be trusted alongside another's.",
    after: 'Tenant isolation enforced at the database level, tamper-evident audit logging, and payment/webhook security — 1,982 automated tests so far, with development and testing continuing.',
    metric: 'Ongoing',
    metricLabel: 'two months in',
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
    tag: 'Construction · Birmingham',
    before: 'Every site foreman lost the last hour of the day writing up progress notes by hand — photos, measurements, what got done — before anyone could send the client an update.',
    after: 'An agent turns a quick voice note and a few site photos into a structured, client-ready progress report, sent the same evening.',
    metric: '6 hrs/wk',
    metricLabel: 'admin time back on site',
    href: '/case-studies/construction',
  },
  {
    tag: 'Plumbing & heating · Bristol',
    before: 'After-hours calls slipped to voicemail until morning. Roughly £24,000 a year in lost emergency callouts.',
    after: 'An agent listens to the voicemail, works out how urgent it is, texts the engineer on call and confirms the slot.',
    metric: '14 sec',
    metricLabel: 'avg dispatch',
    href: '/case-studies/plumbing',
  },
  {
    tag: 'B2B SaaS · London',
    before: 'Overnight tickets sat untouched until someone opened the queue at nine. First response averaged fourteen hours.',
    after: 'An agent groups the tickets that are all the same problem, wakes the engineer on call for anything genuinely broken, and answers the rest.',
    metric: '11 min',
    metricLabel: 'first response',
    href: '/case-studies/b2b-saas',
  },
  {
    tag: 'Restaurant · Leeds',
    before: 'Weekly orders done by hand on a Sunday night. Persistent overstock on perishables.',
    after: 'An agent reads the till data and drafts the weekly order. The chef approves it with a single tap.',
    metric: '−24%',
    metricLabel: 'food waste',
    href: '/case-studies/restaurant',
  },
  {
    tag: 'Salon · Manchester',
    before: 'Lapsed clients drifted away. The owner felt awkward “chasing” them.',
    after: 'A daily rebooking agent sends personalised messages in the owner’s voice.',
    metric: '7×',
    metricLabel: 'rebookings/wk',
    href: '/case-studies/salon',
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
            <div className="ba before"><span className="k">Before</span><span>{c.before}</span></div>
            <div className="ba after"><span className="k">After</span><span>{c.after}</span></div>
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
