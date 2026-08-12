import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { MAILTO } from '../lib/site';

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
      'Code, prompts and credentials you own outright',
      'Two weeks of post-launch fixes included',
      'Optional support retainer afterwards',
    ],
    price: 'Fixed fee',
    priceNote: 'Quoted after the scan',
  },
  {
    name: 'AI Brain',
    when: 'Mid-market · 4–8 weeks',
    summary: 'For firms with several processes that need to talk to each other. A diagnostic, an architecture, and a connected set of agents that compound rather than sit in isolation.',
    includes: [
      'Multi-system integration',
      'Agentic pipelines and retrieval over your own data',
      'Stakeholder readout and written architecture',
      'Handover with runbooks and audit logging',
      'Ongoing strategic support if you want it',
    ],
    price: 'Fixed fee',
    priceNote: 'Scoped in the diagnostic',
  },
];

export default function Pricing() {
  return (
    <PageShell
      n="01"
      label="Pricing"
      title={<>Fixed fees, quoted <span className="amb">after we understand the problem.</span></>}
      lede="We do not sell licences, seats or subscriptions. You pay once to have something built, you own it, and you decide afterwards whether you want us on call."
    >
      <div className="tiers">
        {TIERS.map((t) => (
          <div className="tier" key={t.name}>
            <div>
              <div className="name">{t.name}</div>
              <span className="when">{t.when}</span>
            </div>
            <div className="body">
              <p>{t.summary}</p>
              <ul>{t.includes.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="price">
              {t.price}
              <span>{t.priceNote}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TODO: no rate card. The tiers, scope and timelines above are the ones the
          business already publishes; no build or retainer figures are recorded
          anywhere in this project, so none are printed rather than inventing them.
          Add real numbers to the `price` fields in TIERS once they are settled. */}

      <section>
        <h2>How a price gets set</h2>
        <p>
          Every engagement is quoted as a fixed fee before any work starts. We do not
          bill by the hour, because you should not be paying for our learning curve, and
          you should know the number before you commit rather than after.
        </p>
        <p>
          The quote comes out of the Discovery Scan. That call is where we find out how
          many workflows are involved, which systems they touch, how clean the data is
          and how much of the work can actually be automated. Those four things decide
          the price. A single voicemail-to-dispatch agent and a connected ordering,
          invoicing and rota system are not the same job, and it would be dishonest to
          publish one number covering both.
        </p>
      </section>

      <section>
        <h2>What moves the number</h2>
        <ul>
          <li><strong>How many workflows.</strong> One is a build. Four that hand off to each other is a brain.</li>
          <li><strong>What it has to talk to.</strong> A modern API is a morning. A legacy system with a CSV export is a week.</li>
          <li><strong>How clean the data is.</strong> If your customer records live in three places and disagree, that gets fixed first.</li>
          <li><strong>How much judgement is involved.</strong> Work with a right answer automates cheaply. Work that needs a human to sign off needs a review path built around it.</li>
          <li><strong>Whether you want us afterwards.</strong> The retainer is optional and priced separately.</li>
        </ul>
      </section>

      <section>
        <h2>What is always included</h2>
        <ul>
          <li>Full ownership of the code, the prompts and the credentials. Nothing runs on our accounts.</li>
          <li>Everything built on your own infrastructure and your own vendor accounts, so there is nothing to migrate if we part ways.</li>
          <li>Audit logging on every automated action, with a human escalation path.</li>
          <li>A written handover — how it works, how to change it, how to turn it off.</li>
          <li>Two weeks of fixes after go-live at no charge.</li>
        </ul>
      </section>

      <section>
        <h2>What we will not do</h2>
        <p>
          We will not take a project we do not think will pay for itself. If the Discovery
          Scan says the honest answer is a better spreadsheet, a phone system setting or
          hiring somebody, we will say that and there will be no invoice. It happens often
          enough that it is worth putting in writing.
        </p>
        <p>
          We also do not charge for the scan, do not work on a commission, and do not
          resell anybody&rsquo;s software.
        </p>
      </section>

      <section>
        <h2>Estimate the saving first</h2>
        <p>
          Before you talk to anybody, the <Link to="/#calc">calculator on the home page</Link> will
          give you a rough annual figure from your own numbers. It assumes automation
          captures 75% of the hours you describe, which is deliberately conservative.
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
