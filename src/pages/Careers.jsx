import PageShell from '../components/PageShell';
import { EMAIL, MAILTO } from '../lib/site';

export default function Careers() {
  return (
    <PageShell
      n="03"
      label="Careers"
      title={<>Small team. <span className="amb">High trust.</span> Real systems.</>}
      lede="We are not hiring for a specific role at the moment. We do read every speculative application, and we keep the good ones on file — the last two people we worked with came in this way."
      field={{ mode: 'scatter' }}
    >
      <section>
        <h2>Open roles</h2>
        <p>
          <strong>None currently listed.</strong> When something opens it will be posted
          here first, before any job board.
        </p>
      </section>

      <section>
        <h2>What working here is like</h2>
        <p>
          The work is delivery, not research. You will be shipping a system into a real
          business inside a fortnight, integrating with whatever they already run, and
          then handing it over so completely that they never need to call you again. That
          constraint shapes everything — there is no room for a proof of concept that
          nobody maintains.
        </p>
        <p>
          Projects are small and you own them end to end: the discovery call, the
          architecture, the code, the handover conversation. If you like a lot of
          hand-off between specialists, this is the wrong shape of job.
        </p>
        <p>
          Remote, UK-based, with clients across the country. Everything is done over a
          call and a screen share.
        </p>
      </section>

      <section>
        <h2>What we look for</h2>
        <ul>
          <li>You have put something into production and then had to keep it running. The second half matters more than the first.</li>
          <li>You can explain a technical trade-off to a plumber, a chef or a practice manager without condescending to them.</li>
          <li>You are willing to tell a paying client that they do not need what they asked for.</li>
          <li>You are comfortable with LLM systems as engineering rather than as a demo: evaluation, failure modes, escalation paths, cost per run.</li>
          <li>You would rather build one thing that survives contact with a real business than five that impress in a screenshot.</li>
        </ul>
      </section>

      <section>
        <h2>What we do not look for</h2>
        <p>
          A specific degree, a specific stack, or years of experience as a number. We do
          not run whiteboard puzzles or take-home projects that amount to unpaid work. If
          there is a technical conversation it is about something you have actually built.
        </p>
      </section>

      <section>
        <h2>How to apply</h2>
        <p>
          Email <a href={`${MAILTO}?subject=Speculative%20application`}>{EMAIL}</a> with
          the subject line &ldquo;Speculative application&rdquo;. Tell us about one thing
          you built, what broke in production, and what you did about it. A few paragraphs
          is plenty — a CV is welcome but not the interesting part.
        </p>
        <p>
          We reply to everyone, usually within a week. If there is nothing open we will
          say so plainly rather than leaving you waiting.
        </p>
      </section>

      <section>
        <h2>Contractors</h2>
        <p>
          Builds are occasionally augmented with contractors on specific integrations. If
          that is how you prefer to work, say so in the same email and include your day
          rate and the systems you know deeply.
        </p>
      </section>

      <div className="more">
        <a className="act" href={`${MAILTO}?subject=Speculative%20application`}>
          Send a speculative application <span>→</span>
        </a>
      </div>
    </PageShell>
  );
}
