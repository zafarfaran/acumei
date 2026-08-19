import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO } from '../lib/site';
import BookCall from '../components/BookCall';

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

export default function Contact() {
  return (
    <PageShell
      n="04"
      label="Contact"
      title={<>One address. <span className="amb">A reply within a working day.</span></>}
      lede="There is no contact form, no support queue and no chatbot in the corner. Email reaches a person who can actually answer the question."
      field={{ mode: 'orb' }}
    >
      <section>
        <p className="lead">
          <a href={MAILTO}>{EMAIL}</a>
        </p>
        <p>
          We are a small team working remotely across the UK, so email is genuinely the
          quickest way through. Everything after that — the discovery call, reviews,
          handover — happens over a call and a screen share.
        </p>
      </section>

      <div className="routes">
        {ROUTES.map((r) => (
          <div className="route" key={r.k}>
            <div className="k">{r.k}</div>
            <div>{r.body}</div>
          </div>
        ))}
      </div>

      <section>
        <h2>What happens next</h2>
        <ol>
          <li>You email. We reply within one working day, usually sooner.</li>
          <li>We find 30 minutes. No preparation needed on your side.</li>
          <li>On the call we map the workflow and tell you whether it is worth automating — including when the answer is no.</li>
          <li>Within 48 hours you get a written brief: the top three opportunities, rough scope, and what we would build first. It is yours whether or not you go ahead.</li>
        </ol>
      </section>

      <section>
        <h2>Before you write</h2>
        <p>
          If you want a rough number first, the{' '}
          <Link to="/#calc">calculator on the home page</Link> estimates the annual cost of
          the manual work you are describing, and <Link to="/pricing">pricing</Link>{' '}
          explains how a quote gets put together. Neither requires talking to anyone.
        </p>
      </section>

      <section>
        <h2>Data protection</h2>
        <p>
          Anything you send us is handled under our{' '}
          <Link to="/privacy">privacy policy</Link>. In short: we use it to answer you and
          nothing else, we do not add you to a mailing list, and we do not pass it on.
        </p>
      </section>

      <div className="more">
        <BookCall>
          Book a 30-minute discovery call <span>→</span>
        </BookCall>
      </div>
    </PageShell>
  );
}
