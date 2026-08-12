import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { MAILTO } from '../lib/site';

// The first seven are the questions the site already answered; the rest are the
// ones that come up on discovery calls.
const ITEMS = [
  {
    q: 'What is the AI Brain, exactly?',
    a: <p>An assistant that sits across the tools you already use and handles the boring parts — missed calls, follow-ups, scheduling, stock. It is not a chatbot on your website, and it is not a product you log into. It works in the background and you stay in charge of anything that matters.</p>,
  },
  {
    q: 'How quickly can something go live?',
    a: <p>A single workflow takes three to fourteen days. A connected multi-system brain takes four to eight weeks. Both start with a 30-minute call and a written brief within 48 hours.</p>,
  },
  {
    q: 'Will this work with our existing tools?',
    a: <p>Yes. We plug into what you already run — diary, accounts, phone system, CRM, inbox. Nothing gets ripped out and replaced. If a system has no usable integration we will tell you on the call rather than after you have paid.</p>,
  },
  {
    q: 'Do we own what you build?',
    a: <p>Completely. Code, prompts, credentials. It runs on your accounts and your infrastructure. Walk away tomorrow and it keeps running, and any competent developer can maintain it. There is no licence, no seat fee and nothing to migrate.</p>,
  },
  {
    q: 'Will this replace our staff?',
    a: <p>No, and we will say so on the call if that is what you are hoping for. What we automate is the work nobody was hired to do — late-night triage, data entry, chasing overdue invoices. Your people do the work they are actually good at.</p>,
  },
  {
    q: 'How do you handle data and GDPR?',
    a: <p>Your data stays in your own accounts. We sign a data processing agreement, process inside the UK and EU, and build audit logging into every system so there is a record of every automated action. The detail is in our <Link to="/data-processing">data processing terms</Link>.</p>,
  },
  {
    q: 'What happens if something breaks?',
    a: <p>Every system logs every action and has a human escalation path, so a failure surfaces as a notification rather than as silence. Two weeks of fixes after go-live are included. On a retainer, we generally fix it before you notice.</p>,
  },
  {
    q: 'What does it cost?',
    a: <p>Fixed fee, quoted after the free discovery call — never by the hour. The price depends on how many workflows are involved, what they have to integrate with, and how clean the data is. <Link to="/pricing">Pricing</Link> explains what moves the number.</p>,
  },
  {
    q: 'Is the discovery call really free?',
    a: <p>Yes, including the written brief afterwards. There is no invoice even if we conclude you should not automate anything, which happens often enough that it is worth stating plainly.</p>,
  },
  {
    q: 'What if AI is not the right answer?',
    a: <p>Then we say so. Sometimes the fix is a setting in your phone system, a tidier spreadsheet or hiring somebody. Telling you that costs us a project and saves you a lot more, so it is an easy trade.</p>,
  },
  {
    q: 'Do we need technical staff to run it?',
    a: <p>No. The handover includes written documentation covering how it works, how to change the parts you are likely to want to change, and how to turn it off. Anything beyond that is what the optional retainer is for.</p>,
  },
  {
    q: 'What does it cost to run after you have gone?',
    a: <p>Whatever the underlying services charge — model usage, messaging, hosting — billed to your accounts directly with no margin from us. It is usually a small monthly figure, and we size it for you during the build so there are no surprises. There are worked examples in <Link to="/#notes">Notes</Link>.</p>,
  },
  {
    q: 'Are you tied to a particular AI provider?',
    a: <p>No. We pick per project based on what the work needs and what it costs to run, and we build so the provider can be swapped without a rewrite.</p>,
  },
  {
    q: 'What size of business do you work with?',
    a: <p>From sole traders through to firms of a few hundred people. The single-workflow builds suit small businesses; the connected brain suits organisations with several processes that need to talk to each other.</p>,
  },
  {
    q: 'Can you take over a system somebody else built?',
    a: <p>Sometimes. Bring it to the discovery call. If it is well built we will say so and quote for the changes; if it would cost more to untangle than to rebuild, we will tell you that instead.</p>,
  },
];

export default function FAQ() {
  return (
    <PageShell
      n="05"
      label="FAQ"
      title={<>The questions we get asked <span className="amb">on every call.</span></>}
      lede="If yours is not here, email it over — we would rather answer it directly than have you guess."
    >
      <div className="qa">
        {ITEMS.map((item, i) => (
          <div key={item.q}>
            <div className="n">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <h3>{item.q}</h3>
              {item.a}
            </div>
          </div>
        ))}
      </div>

      <div className="more">
        <a className="act" href={`${MAILTO}?subject=Question`}>
          Ask us something else <span>→</span>
        </a>
      </div>
    </PageShell>
  );
}
