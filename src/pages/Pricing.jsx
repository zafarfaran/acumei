import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

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

export default function Pricing() {
  return (
    <PageShell
      n="01"
      label="Pricing"
      title={<>Fixed fees, quoted <span className="amb">after we understand the problem.</span></>}
      lede="We do not sell licences, seats or subscriptions. You pay once to have something built, you own it, and you decide afterwards whether you want us on call."
      field={{ mode: 'flow' }}
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
          <li><strong>How many workflows.</strong> One is a build. Four that hand off to each other is a connected set of agents.</li>
          <li><strong>What it has to talk to.</strong> A modern system that is built to be connected to takes a morning. Something older, where the only way out is a spreadsheet export, takes a week.</li>
          <li><strong>How clean the data is.</strong> If your customer records live in three places and disagree, that gets fixed first.</li>
          <li><strong>How much judgement is involved.</strong> Work with a right answer automates cheaply. Work that needs a human to sign off needs a review path built around it.</li>
          <li><strong>Whether you want us afterwards.</strong> The retainer is optional and priced separately.</li>
        </ul>
      </section>

      <section>
        <h2>What is always included</h2>
        <ul>
          <li>Everything we write belongs to you, along with the logins it runs on. Nothing runs on our accounts.</li>
          <li>Built on your own accounts with the suppliers involved, so there is nothing to move across if we part ways.</li>
          <li>A record of every action taken automatically, and a clear point where a person takes over.</li>
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
        <BookCall>
          Book a 30-minute discovery call <span>→</span>
        </BookCall>
      </div>
    </PageShell>
  );
}
