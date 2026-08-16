import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { MAILTO } from '../lib/site';

export default function About() {
  return (
    <PageShell
      n="02"
      label="About"
      title={<>AI built by people who have <span className="amb">built it before.</span></>}
      lede="We built AI systems at some of the largest technology companies in the world. Acumei exists to bring that capability to British businesses without the jargon or the six-figure price tag that usually comes with it."
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
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
          Our background is in building AI at scale — from the research through to systems
          used by millions of people. The engineering discipline that
          takes is the same discipline that makes a small automation trustworthy enough to
          leave running unattended overnight. That is the part most people skip.
        </p>
      </section>

      <section>
        <h2>What we believe</h2>

        <h3>The honest answer first</h3>
        <p>
          Every engagement starts with a free call where the possible outcome is
          &ldquo;you do not need us.&rdquo; Sometimes the answer is a setting in the phone
          system, a better spreadsheet, or hiring somebody. We say so, and there is no
          invoice. We would rather lose the project than sell you something that will not
          pay for itself.
        </p>

        <h3>You own it, completely</h3>
        <p>
          Everything we write, and the logins it runs on. It all sits on your accounts,
          not ours. If you never speak to us again the systems keep working, and
          any competent developer can pick them up. There is no platform, no fee per person
          and nothing to be locked into. This is the single most common thing clients tell
          us they were not offered elsewhere.
        </p>

        <h3>A fortnight, not a quarter</h3>
        <p>
          A single workflow goes live in three to fourteen days. A connected set of
          systems takes four to eight weeks. Long projects hide bad assumptions; short
          ones surface them while they are still cheap to fix. It also means you find out
          quickly whether we are any good.
        </p>

        <h3>Automate the work nobody wants</h3>
        <p>
          We are not in the business of replacing your staff, and we will say so plainly
          on the call. The work worth automating is the midnight call-out, the data entry
          and the chasing — the tasks people do because someone has to, not because they
          were hired for them.
        </p>
      </section>

      <section>
        <h2>How we work</h2>
        <ol>
          <li><strong>Talk.</strong> A 30-minute discovery call. Show us the workflow that hurts. We tell you whether AI can fix it — honestly.</li>
          <li><strong>Map.</strong> Within 48 hours, a written brief: the top three opportunities, rough scope, and what we would build first.</li>
          <li><strong>Build.</strong> We build it, connected to the tools you already use. You see it come together as we go.</li>
          <li><strong>Hand over.</strong> A working system on your own accounts, everything we wrote, and written instructions for changing it. Monthly support only if you want it.</li>
        </ol>
      </section>

      <section>
        <h2>Where we work</h2>
        <p>
          We are based in London and work with businesses across the UK. Everything runs
          remotely — the discovery call, the reviews and the handover — which is what
          makes a fortnight&rsquo;s delivery possible and keeps the cost down. Data is
          processed inside the UK and EU. The specifics are in our{' '}
          <Link to="/data-processing">data processing terms</Link>.
        </p>
      </section>

      <section>
        <h2>What we have built</h2>
        <p>
          Emergency dispatch for a plumbing and heating firm in Bristol, ordering for a
          restaurant in Leeds, rebooking for a salon in Manchester — the numbers are on
          the <Link to="/#work">work section</Link>, and there are longer write-ups of
          what things actually cost to run in <Link to="/#notes">Notes</Link>.
        </p>
      </section>

      <div className="more">
        <a className="act" href={`${MAILTO}?subject=Discovery%20call`}>
          Book a 30-minute discovery call <span>→</span>
        </a>
      </div>
    </PageShell>
  );
}
