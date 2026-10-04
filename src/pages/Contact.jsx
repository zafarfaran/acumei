import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO } from '../lib/site';
import BookCall from '../components/BookCall';
import { STATIC } from '../lib/motion';
import '../styles/pages/company.css';

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

const ROUTES = [
  {
    k: 'New project',
    body: (
      <>
        <p>
          The fastest route is the 30-minute discovery call. Bring the workflow that costs
          you the most time — you do not need to have decided anything, and you do not
          need to know whether AI is the right answer. That is the point of the call.
        </p>
        <p>
          Useful to mention up front: what the workflow is, roughly how many hours a week
          it takes, and which systems it involves.
        </p>
      </>
    ),
  },
  {
    k: 'Existing client',
    body: (
      <p>
        Same address, and it goes straight to the person who built your system. If you are
        on a retainer and something is broken, put &ldquo;urgent&rdquo; in the subject
        line and we will pick it up ahead of anything else.
      </p>
    ),
  },
  {
    k: 'Press and speaking',
    body: (
      <p>
        Happy to talk about what AI automation actually costs to run in a small business,
        with real numbers rather than projections. Same address, with
        &ldquo;press&rdquo; in the subject.
      </p>
    ),
  },
  {
    k: 'Working with us',
    body: (
      <p>
        Speculative applications and contractor enquiries are read and answered — see{' '}
        <Link to="/careers">careers</Link> for what to include.
      </p>
    ),
  },
];

const NEXT = [
  'You email. We reply within one working day, usually sooner.',
  'We find 30 minutes. No preparation needed on your side.',
  'On the call we map the workflow and tell you whether it is worth automating — including when the answer is no.',
  'Within 48 hours you get a written brief: the top three opportunities, rough scope, and what we would build first. It is yours whether or not you go ahead.',
];

export default function Contact() {
  const root = useRef(null);
  useLit(root);

  return (
    <PageShell
      n="04"
      label="Contact"
      part="lamp"
      title={<>One address. <span className="amb">A reply within a working day.</span></>}
      lede="There is no contact form, no support queue and no chatbot in the corner. Email reaches a person who can actually answer the question."
    >
      <div className="co" ref={root}>
        <div className="card mailsheet">
          <div className="fr">
            <div className="hd"><span>PRIMARY CHANNEL</span><b>EMAIL</b></div>
            <div className="bd">
              <a className="big" href={MAILTO}>{EMAIL}</a>
              <p>
                We are a small team working remotely across the UK, so email is genuinely the
                quickest way through. Everything after that &mdash; the discovery call, reviews,
                handover &mdash; happens over a call and a screen share.
              </p>
            </div>
            <div className="tb mono">
              <div>REPLY<b>Within one working day</b></div>
              <div>FORMAT<b>Email, then a call</b></div>
            </div>
          </div>
        </div>

        <div className="co-tag mono" style={{ marginTop: 'var(--co-gap)' }}><b>01</b> Routes</div>
        <div className="cards" style={{ marginTop: 0 }}>
          {ROUTES.map((r, i) => (
            <div className="card" key={r.k} data-lit>
              <div className="fr">
                <div className="hd"><span>ROUTE <b>{String(i + 1).padStart(2, '0')}</b></span></div>
                <div className="bd">
                  <h3>{r.k}</h3>
                  {r.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section>
          <div className="co-tag mono"><b>02</b> Procedure</div>
          <h2>What happens next</h2>
          <div className="sr-list">
            {NEXT.map((t, i) => (
              <div className="sr" data-lit key={t}>
                <div className="no"><u />{String(i + 1).padStart(2, '0')}</div>
                <div><p style={{ margin: 0, color: '#d8d3c8', fontSize: 16.5 }}>{t}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>03</b> Reference</div>
          <h2>Before you write</h2>
          <p>
            If you want a rough number first, <Link to="/pricing">pricing</Link>{' '}
            explains how a quote gets put together. It does not require talking to anyone.
          </p>
        </section>

        <section>
          <div className="co-tag mono"><b>04</b> Data</div>
          <h2>Data protection</h2>
          <p>
            Anything you send us is handled under our{' '}
            <Link to="/privacy">privacy policy</Link>. In short: we use it to answer you and
            nothing else, we do not add you to a mailing list, and we do not pass it on.
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
