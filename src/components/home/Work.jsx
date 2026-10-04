import { Link } from 'react-router-dom';

// The one case study shown on the home page. The copy is the Premo entry from
// the previous site; nothing is added to it.
const PREMO = {
  tag: 'Feedback platform · Premo AI Ltd',
  before: 'A new feedback platform for UK trades businesses needed genuinely secure, multi-tenant infrastructure from day one — before a single customer’s data could be trusted alongside another’s.',
  after: 'A full multi-tenant platform — real-time dashboards, entitlements and a real integration ecosystem — built on infrastructure that keeps every business’s data genuinely separate. Still being built.',
  status: 'Ongoing · two months in',
  href: '/case-studies/premo',
};

export default function Work() {
  return (
    <section id="work" data-scene="work">
      <div className="a-head">
        <div className="kick mono land">WORK</div>
        <h2 className="land">A real system, still being built.</h2>
      </div>
      <Link className="sheet sheet-lg land" to={PREMO.href}>
        <i className="cr a" /><i className="cr b" />
        <div className="fr">
          <div className="sheet-img">
            <img
              src="/case-studies/premo-website.png"
              alt="Premo’s public marketing homepage."
              width="2880"
              height="2000"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="ti">
            <div className="mono">{PREMO.tag}</div>
            <div className="ba"><span className="mono">Before</span><p>{PREMO.before}</p></div>
            <div className="ba"><span className="mono">After</span><p>{PREMO.after}</p></div>
            <div className="tb mono">
              <div>CLIENT<b>Premo AI Ltd</b></div>
              <div>SHEET<b>01 / 01</b></div>
              <div>STATUS<b>{PREMO.status}</b></div>
              <div>VIEW<b>Case study →</b></div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
