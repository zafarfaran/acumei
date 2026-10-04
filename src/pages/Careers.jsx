import { useEffect, useRef } from 'react';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO } from '../lib/site';
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

const LOOK_FOR = [
  'You have put something into production and then had to keep it running. The second half matters more than the first.',
  'You can explain a technical trade-off to a plumber, a chef or a practice manager without condescending to them.',
  'You are willing to tell a paying client that they do not need what they asked for.',
  'You are comfortable with LLM systems as engineering rather than as a demo: evaluation, failure modes, escalation paths, cost per run.',
  'You would rather build one thing that survives contact with a real business than five that impress in a screenshot.',
];

const SUBJECT = `${MAILTO}?subject=Speculative%20application`;

export default function Careers() {
  const root = useRef(null);
  useLit(root);

  return (
    <PageShell
      n="03"
      label="Careers"
      part="agents"
      title={<>Small team. <span className="amb">High trust.</span> Real systems.</>}
      lede="We are not hiring for a specific role at the moment. We do read every speculative application, and we keep the good ones on file — the last two people we worked with came in this way."
    >
      <div className="co" ref={root}>
        <div className="card">
          <div className="fr">
            <div className="hd"><span>OPEN ROLES</span><b>00</b></div>
            <div className="bd">
              <h3>None currently listed.</h3>
              <p>
                When something opens it will be posted here first, before any job board.
              </p>
            </div>
            <div className="tb mono">
              <div>STATUS<b>Not hiring a specific role</b></div>
              <div>SPECULATIVE<b>Read and answered</b></div>
            </div>
          </div>
        </div>

        <section>
          <div className="co-tag mono"><b>01</b> The job</div>
          <h2>What working here is like</h2>
          <div className="cards">
            <div className="card" data-lit>
              <div className="fr">
                <div className="hd"><span>DELIVERY</span><b>A</b></div>
                <div className="bd">
                  <p>
                    The work is delivery, not research. You will be shipping a system into a real
                    business inside a fortnight, integrating with whatever they already run, and
                    then handing it over so completely that they never need to call you again. That
                    constraint shapes everything &mdash; there is no room for a proof of concept that
                    nobody maintains.
                  </p>
                </div>
              </div>
            </div>
            <div className="card" data-lit>
              <div className="fr">
                <div className="hd"><span>OWNERSHIP</span><b>B</b></div>
                <div className="bd">
                  <p>
                    Projects are small and you own them end to end: the discovery call, the
                    architecture, the code, the handover conversation. If you like a lot of
                    hand-off between specialists, this is the wrong shape of job.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="cards one">
            <div className="card" data-lit>
              <div className="fr">
                <div className="hd"><span>LOCATION</span><b>C</b></div>
                <div className="bd">
                  <p>
                    Remote, UK-based, with clients across the country. Everything is done over a
                    call and a screen share.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>02</b> Criteria</div>
          <h2>What we look for</h2>
          <div className="sr-list">
            {LOOK_FOR.map((t, i) => (
              <div className="sr" data-lit key={t}>
                <div className="no"><u />{String(i + 1).padStart(2, '0')}</div>
                <div><p style={{ margin: 0, color: '#d8d3c8', fontSize: 16.5 }}>{t}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>03</b> Not required</div>
          <h2>What we do not look for</h2>
          <div className="cards one">
            <div className="card" data-lit>
              <div className="fr">
                <div className="hd"><span>NOT REQUIRED</span><b>&#10005;</b></div>
                <div className="bd">
                  <p>
                    A specific degree, a specific stack, or years of experience as a number. We do
                    not run whiteboard puzzles or take-home projects that amount to unpaid work. If
                    there is a technical conversation it is about something you have actually built.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>04</b> Application</div>
          <h2>How to apply</h2>
          <div className="card mailsheet" style={{ marginTop: 24 }}>
            <div className="fr">
              <div className="hd"><span>SPECULATIVE APPLICATION</span><b>&rarr;</b></div>
              <div className="bd">
                <a className="big" href={SUBJECT}>{EMAIL}</a>
                <p>
                  Email <a href={SUBJECT}>{EMAIL}</a> with
                  the subject line &ldquo;Speculative application&rdquo;. Tell us about one thing
                  you built, what broke in production, and what you did about it. A few paragraphs
                  is plenty &mdash; a CV is welcome but not the interesting part.
                </p>
                <p>
                  We reply to everyone, usually within a week. If there is nothing open we will
                  say so plainly rather than leaving you waiting.
                </p>
              </div>
              <div className="tb mono">
                <div>SUBJECT<b>Speculative application</b></div>
                <div>REPLY<b>Usually within a week</b></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>05</b> Contractors</div>
          <h2>Contractors</h2>
          <p>
            Builds are occasionally augmented with contractors on specific integrations. If
            that is how you prefer to work, say so in the same email and include your day
            rate and the systems you know deeply.
          </p>
        </section>

        <div className="more">
          <a className="act" href={SUBJECT}>
            Send a speculative application <span>&rarr;</span>
          </a>
        </div>
      </div>
    </PageShell>
  );
}
