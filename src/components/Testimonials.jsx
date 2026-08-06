import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const TESTIMONIALS = [
  {
    quote:
      'I\u2019ll be honest, I thought AI was a load of hype for businesses like mine. Then they showed me the missed-call numbers from my own phone system. We were leaving four jobs a week on the table. Four. The assistant they built picks every one of them up now.',
    name: 'Gary Whitfield',
    role: 'Director, Whitfield Electrical',
    place: 'Nottingham',
  },
  {
    quote:
      'They told us on the discovery call that half of what we wanted didn\u2019t need AI at all \u2014 just better automation. Who turns down work like that? That\u2019s when I knew we\u2019d picked the right people.',
    name: 'Helen Carrick',
    role: 'Practice manager, Carrick & Boyd Accountants',
    place: 'Glasgow',
  },
  {
    quote: 'Chasing rent arrears used to take my admin team two full days a month. Now it\u2019s a morning.',
    name: 'James O\u2019Donnell',
    role: 'Lettings director, Hartley Residential',
    place: 'Sheffield',
  },
  {
    quote:
      'The bit nobody tells you: you own everything they build. No subscription creeping up every year, no platform holding your data hostage. It\u2019s ours. Our last software vendor could learn a thing or two.',
    name: 'Margaret Ellis',
    role: 'Owner, Ellis & Daughters Funeral Services',
    place: 'Cardiff',
  },
  {
    quote: 'Ten days from first call to it answering our out-of-hours line. I\u2019ve waited longer for a plumber.',
    name: 'Tony Brennan',
    role: 'Owner, Brennan Heating & Gas',
    place: 'Liverpool',
  },
  {
    quote:
      'My daughter kept telling me to "use AI" and I had no idea what that even meant for a caf\u00e9. They sat with me for half an hour, found the thing that was actually costing us money \u2014 supplier orders \u2014 and fixed that. No jargon, no nonsense.',
    name: 'Anne Hutton',
    role: 'Owner, The Copper Kettle',
    place: 'York',
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section id="testimonials" className="testimonials-section" style={{
      padding: '120px 56px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="06" label="In their words" />
      <h2 className="display testimonials-title" style={{
        fontSize: 60,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 860,
        lineHeight: 1.05,
      }}>
        Don&rsquo;t take ours for it.{' '}
        <span className="display-ital" style={{ color: 'var(--accent)' }}>Take theirs.</span>
      </h2>
      <div
        ref={ref}
        className={`testimonials-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          marginTop: 60,
          alignItems: 'start',
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="card-hover stagger" style={{
            margin: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}>
            <span className="display" aria-hidden="true" style={{
              fontSize: 44,
              lineHeight: 0.6,
              color: 'var(--accent)',
            }}>
              &ldquo;
            </span>
            <blockquote style={{
              margin: 0,
              fontSize: t.quote.length > 180 ? 15 : 19,
              lineHeight: 1.55,
              color: 'var(--ink)',
            }}>
              {t.quote}
            </blockquote>
            <figcaption style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 18 }}>
              <div style={{ fontSize: 14, color: 'var(--ink)' }}>{t.name}</div>
              <div className="mono" style={{
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginTop: 6,
              }}>
                {t.role} &middot; {t.place}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
