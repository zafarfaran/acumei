import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';
import { STATIC } from '../lib/motion';
import '../styles/pages/company.css';

// Rows brighten once they rise past the lower part of the viewport. Content is
// fully visible without it (static mode, no IntersectionObserver).
function useLit(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || STATIC || typeof IntersectionObserver !== 'function') return undefined;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('lit'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -22% 0px' });
    root.querySelectorAll('[data-lit]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

const BELIEFS = [
  {
    h: 'The honest answer first',
    p: 'Every engagement starts with a free call where the possible outcome is “you do not need us.” Sometimes the answer is a setting in the phone system, a better spreadsheet, or hiring somebody. We say so, and there is no invoice. We would rather lose the project than sell you something that will not pay for itself.',
  },
  {
    h: 'You own it, completely',
    p: 'Everything we write, and the logins it runs on. It all sits on your accounts, not ours. If you never speak to us again the systems keep working, and any competent developer can pick them up. There is no platform, no fee per person and nothing to be locked into. This is the single most common thing clients tell us they were not offered elsewhere.',
  },
  {
    h: 'A fortnight, not a quarter',
    p: 'A single workflow goes live in three to fourteen days. A connected set of systems takes four to eight weeks. Long projects hide bad assumptions; short ones surface them while they are still cheap to fix. It also means you find out quickly whether we are any good.',
  },
  {
    h: 'Automate the work nobody wants',
    p: 'We are not in the business of replacing your staff, and we will say so plainly on the call. The work worth automating is the midnight call-out, the data entry and the chasing — the tasks people do because someone has to, not because they were hired for them.',
  },
];

const STEPS = [
  { k: 'Talk', p: 'A 30-minute discovery call. Show us the workflow that hurts. We tell you whether AI can fix it — honestly.' },
  { k: 'Map', p: 'Within 48 hours, a written brief: the top three opportunities, rough scope, and what we would build first.' },
  { k: 'Build', p: 'We build it, connected to the tools you already use. You see it come together as we go.' },
  { k: 'Hand over', p: 'A working system on your own accounts, everything we wrote, and written instructions for changing it. Monthly support only if you want it.' },
];

export default function About() {
  const root = useRef(null);
  useLit(root);

  return (
    <PageShell
      n="02"
      label="About"
      part="models"
      title={<>AI built by people who have <span className="amb">built it before.</span></>}
      lede="We built AI systems at some of the largest technology companies in the world. Acumei exists to bring that capability to British businesses without the jargon or the six-figure price tag that usually comes with it."
    >
      <div className="co" ref={root}>
        <section>
          <p className="lead">
            Most AI sold to small businesses is a chatbot with a subscription attached.
            That is not what we do.
          </p>
          <p>
            The work we take on is unglamorous and specific: the voicemail that goes
            unanswered until Monday, the Sunday-night stock order done by hand, the client
            who quietly stopped booking and nobody noticed. These are not interesting
            problems from a research point of view. They are just expensive, every week,
            for the people they happen to.
          </p>
          <p>
            Our background is in building AI at scale &mdash; from the research through to systems
            used by millions of people. The engineering discipline that
            takes is the same discipline that makes a small automation trustworthy enough to
            leave running unattended overnight. That is the part most people skip.
          </p>
        </section>

        <section>
          <div className="co-tag mono"><b>01</b> Principles</div>
          <h2>What we believe</h2>
          <div className="sr-list">
            {BELIEFS.map((b, i) => (
              <div className="sr" data-lit key={b.h}>
                <div className="no"><u />{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>02</b> Procedure</div>
          <h2>How we work</h2>
          <div className="stages">
            {STEPS.map((s, i) => (
              <div className="stg" data-lit key={s.k}>
                <div className="no"><span>STAGE</span><b>{String(i + 1).padStart(2, '0')}</b></div>
                <h3>{s.k}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>03</b> Location</div>
          <h2>Where we work</h2>
          <div className="dtb mono">
            <div><span>Based</span><b>London</b></div>
            <div><span>Clients</span><b>Across the UK</b></div>
            <div><span>Delivery</span><b>Fully remote</b></div>
            <div><span>Data</span><b>UK and EU</b></div>
          </div>
          <p>
            We are based in London and work with businesses across the UK. Everything runs
            remotely &mdash; the discovery call, the reviews and the handover &mdash; which is what
            makes a fortnight&rsquo;s delivery possible and keeps the cost down. Data is
            processed inside the UK and EU. The specifics are in our{' '}
            <Link to="/data-processing">data processing terms</Link>.
          </p>
        </section>

        <section>
          <div className="co-tag mono"><b>04</b> Work</div>
          <h2>What we have built</h2>
          <p>
            The system we are building now is on the <Link to="/#work">work section</Link>, and there are longer write-ups of
            what things actually cost to run in <Link to="/#notes">Notes</Link>.
          </p>
        </section>

        <div className="more">
          <BookCall>
            Book a 30-minute discovery call <span>&rarr;</span>
          </BookCall>
        </div>
      </div>
    </PageShell>
  );
}
