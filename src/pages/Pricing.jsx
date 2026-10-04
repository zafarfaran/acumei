import { useEffect, useRef } from 'react';
import PageShell from '../components/PageShell';
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

// Tiers, scope and timelines are the ones the business already publishes in
// its service model. The figures are not — see the note in the markup.
const TIERS = [
  {
    name: 'Discovery Scan',
    when: 'Free · 30 minutes',
    summary: 'A structured call. We map your operations, find the three highest-impact automation opportunities, and tell you whether AI is even the right tool.',
    includes: [
      '30-minute working session',
      'Top three automation opportunities, ranked',
      'An honest go / no-go recommendation',
      'Written brief within 48 hours',
    ],
    price: 'Free',
    priceNote: 'No commitment',
  },
  {
    name: 'Custom Build',
    when: 'Small business · 3–14 days',
    summary: 'A working system built around one or two of your manual workflows — scheduling, quoting, follow-ups, inventory, support. Whichever is bleeding the most time.',
    includes: [
      'Built around the tools you already run',
      'Live in days, not quarters',
      'Everything we write is yours outright, logins included',
      'Two weeks of post-launch fixes included',
      'Optional support retainer afterwards',
    ],
    price: 'Fixed fee',
    priceNote: 'Quoted after the scan',
  },
  {
    name: 'Connected Agents',
    when: 'Mid-market · 4–8 weeks',
    summary: 'For firms with several processes that need to talk to each other. We work out where the time goes, plan how it should fit together, and build a set of agents that pass work between them instead of each sitting on its own.',
    includes: [
      'Connected to every system involved, not just one',
      'Agents that hand work to each other, and that can search your own documents and records',
      'A walkthrough for everyone involved, plus a written plan of how it all fits together',
      'Handover with written instructions, and a log of every action taken',
      'Ongoing strategic support if you want it',
    ],
    price: 'Fixed fee',
    priceNote: 'Scoped in the diagnostic',
  },
];

const FACTORS = [
  ['How many workflows.', 'One is a build. Four that hand off to each other is a connected set of agents.'],
  ['What it has to talk to.', 'A modern system that is built to be connected to takes a morning. Something older, where the only way out is a spreadsheet export, takes a week.'],
  ['How clean the data is.', 'If your customer records live in three places and disagree, that gets fixed first.'],
  ['How much judgement is involved.', 'Work with a right answer automates cheaply. Work that needs a human to sign off needs a review path built around it.'],
  ['Whether you want us afterwards.', 'The retainer is optional and priced separately.'],
];

const INCLUDED = [
  'Everything we write belongs to you, along with the logins it runs on. Nothing runs on our accounts.',
  'Built on your own accounts with the suppliers involved, so there is nothing to move across if we part ways.',
  'A record of every action taken automatically, and a clear point where a person takes over.',
  'A written handover — how it works, how to change it, how to turn it off.',
  'Two weeks of fixes after go-live at no charge.',
];

const WONT = [
  'We will not take a project we do not think will pay for itself.',
  'We do not charge for the scan.',
  'We do not work on a commission.',
  'We do not resell anybody’s software.',
];

export default function Pricing() {
  const root = useRef(null);
  useLit(root);

  return (
    <PageShell
      n="01"
      label="Pricing"
      part="data"
      title={<>Fixed fees, quoted <span className="amb">after we understand the problem.</span></>}
      lede="We do not sell licences, seats or subscriptions. You pay once to have something built, you own it, and you decide afterwards whether you want us on call."
    >
      <div className="co" ref={root}>
        <div className="co-tag mono"><b>00</b> Price list</div>
        {TIERS.map((t, i) => (
          <div className="card" key={t.name} data-lit>
            <div className="fr">
              <div className="hd"><span>TIER <b>{String(i + 1).padStart(2, '0')}</b></span><span>{t.when}</span></div>
              <div className="bd">
                <h3>{t.name}</h3>
                <p>{t.summary}</p>
                <ul className="marks">{t.includes.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="tb mono">
                <div>PRICE<b>{t.price}</b></div>
                <div>NOTE<b>{t.priceNote}</b></div>
              </div>
            </div>
          </div>
        ))}

        {/* TODO: no rate card. The tiers, scope and timelines above are the ones the
            business already publishes; no build or retainer figures are recorded
            anywhere in this project, so none are printed rather than inventing them.
            Add real numbers to the `price` fields in TIERS once they are settled. */}

        <section>
          <div className="co-tag mono"><b>01</b> Method</div>
          <h2>How a price gets set</h2>
          <div className="sr-list">
            <div className="sr" data-lit>
              <div className="no"><u />STEP 1</div>
              <div>
                <h3>Fixed fee, before any work</h3>
                <p>
                  Every engagement is quoted as a fixed fee before any work starts. We do not
                  bill by the hour, because you should not be paying for our learning curve, and
                  you should know the number before you commit rather than after.
                </p>
              </div>
            </div>
            <div className="sr" data-lit>
              <div className="no"><u />STEP 2</div>
              <div>
                <h3>The quote comes from the scan</h3>
                <p>
                  The quote comes out of the Discovery Scan. That call is where we find out how
                  many workflows are involved, which systems they touch, how clean the data is
                  and how much of the work can actually be automated. Those four things decide
                  the price. A single voicemail-to-dispatch agent and a connected ordering,
                  invoicing and rota system are not the same job, and it would be dishonest to
                  publish one number covering both.
                </p>
              </div>
            </div>
          </div>
          <div className="dtb mono">
            <div><span>Input A</span><b>Workflows</b></div>
            <div><span>Input B</span><b>Systems touched</b></div>
            <div><span>Input C</span><b>Data quality</b></div>
            <div><span>Input D</span><b>Share automatable</b></div>
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>02</b> Variables</div>
          <h2>What moves the number</h2>
          <div className="sr-list">
            {FACTORS.map(([h, p], i) => (
              <div className="sr" data-lit key={h}>
                <div className="no"><u />F{i + 1}</div>
                <div>
                  <h3>{h.replace(/\.$/, '')}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="co-tag mono"><b>03</b> Terms</div>
          <h2>What is always included, and what we will not do</h2>
          <div className="cols2">
            <div className="card">
              <div className="fr">
                <div className="hd"><span>ALWAYS INCLUDED</span><b>&#10003;</b></div>
                <div className="bd">
                                    <ul className="marks">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="fr">
                <div className="hd"><span>WILL NOT DO</span><b>&#10005;</b></div>
                <div className="bd">
                                    <ul className="marks no">{WONT.map((x) => <li key={x}>{x}</li>)}</ul>
                  <p>
                    If the Discovery Scan says the honest answer is a better spreadsheet, a
                    phone system setting or hiring somebody, we will say that and there will be
                    no invoice. It happens often enough that it is worth putting in writing.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
