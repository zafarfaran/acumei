import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import PartDrawing from '../components/PartDrawing';
import BookCall from '../components/BookCall';
import useReveal from '../hooks/useReveal';
import { onFrame, STATIC } from '../lib/motion';
import '../styles/case-study-premo.css';

const BEFORE = 'A new feedback platform for UK trades businesses needed genuinely secure, multi-tenant infrastructure from day one — before a single customer’s data could be trusted alongside another’s.';
const AFTER = 'A full multi-tenant platform — real-time dashboards, entitlements and a real integration ecosystem — built on infrastructure that keeps every business’s data genuinely separate. Still being built.';

const FIGURES = [
  ['1,982', 'Automated tests, so far'],
  ['0', 'Cross-tenant data leaks, tested'],
  ['47', 'Tenant-isolated tables'],
];

const SCOPE = [
  {
    t: 'A dashboard that updates itself',
    tags: ['Postgres LISTEN/NOTIFY', 'Server-Sent Events', 'No polling'],
    p: 'Postgres LISTEN/NOTIFY carries database changes straight to the application, which pipes them to the browser over Server-Sent Events. Feedback appears on the dashboard as it arrives: no polling loop, no refresh button, and no interval quietly re-querying the database for every tab a business leaves open all day.',
  },
  {
    t: 'A data hierarchy that keeps its history',
    tags: ['Organisation → Location → Team → Team member', 'Immutable snapshots'],
    p: 'The model runs Organisation → Location → Team → Team member, and historical records hold immutable snapshots of the structure they were written under. Renaming a location or an employee leaving does not silently rewrite last quarter’s reports — what happened stays what happened, even once the organisation around it has changed.',
  },
  {
    t: 'Entitlements and subscription state',
    tags: ['One pure function', 'Active · grace · read-only · suspended', 'Idempotent Stripe webhooks'],
    p: 'Plan limits resolve through a single pure function that every gated action calls, so there is one place to read and one place to change what a plan allows. Subscriptions move through an explicit state machine — active, grace, read-only, suspended — rather than a scatter of boolean flags. Stripe webhooks are signature-verified and processed idempotently, so a redelivered event cannot be applied twice. We test forged signatures and replays alongside the ordinary payment paths.',
  },
  {
    t: 'Tenant isolation at the database level',
    tags: ['PostgreSQL Row-Level Security', '47 tenant-scoped tables'],
    p: 'PostgreSQL Row-Level Security is enforced on every one of the 47 tenant-scoped tables, not only the ones the application happens to query today. Those boundaries are tested independently of the application code, including adversarial attempts to read or change another tenant’s records. Isolation belongs in the database as well as the application.',
  },
  {
    t: 'A tamper-evident audit log',
    tags: ['Cryptographically chained', 'Verifiable history'],
    p: 'Sensitive actions enter a cryptographically chained audit log. Verification checks whether historical records have changed, giving the team a way to detect tampering rather than relying on a history that simply looks intact. Audit coverage develops with the platform.',
  },
  {
    t: 'Integrations that carry real traffic',
    tags: ['Clerk', 'Stripe', 'Resend', 'Google', 'WhatsApp · Meta API', 'monday.com'],
    p: 'Clerk handles identity, Stripe payments, Resend transactional email, and Google the routing of review requests. WhatsApp, through the Meta API, gives owners alerts and conversational access to their own aggregate figures — scoped to that business and designed around summaries, with individual customer data excluded from responses. A live monday.com integration closes the loop from the other direction: when a client marks a job complete on their own board, that push triggers the review request automatically.',
  },
  {
    t: 'UK and EU data residency, designed in',
    tags: ['Postgres hosted in London', 'Error tracking scrubbed of personal data'],
    p: 'Postgres is hosted in London, and error tracking is scrubbed of personal data before anything leaves the application. Trades businesses hold customer names, addresses and job details, so residency is a constraint to build around from the first migration rather than a retrofit once a customer asks the question.',
  },
];

const SYSTEM = [
  { k: 'Surface', items: ['Card tap or QR scan', 'Customer leaves feedback after a job', 'Continues to a Google review'] },
  { k: 'Platform', items: ['Application on Railway', 'Postgres on Neon · London · RLS on 47 tables', 'Real-time dashboard over SSE'] },
  { k: 'Integrations', items: ['Clerk · identity', 'Stripe · payments', 'Resend · email', 'WhatsApp · Meta API', 'monday.com'] },
];

// Rows light up as they cross the middle of the viewport. Everything stays
// visible (--lit defaults to 1) when motion is off.
function useLit(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || STATIC) return undefined;
    const rows = Array.from(root.querySelectorAll('[data-lit]'));
    return onFrame(() => {
      const mid = window.innerHeight * 0.55;
      for (const el of rows) {
        const r = el.getBoundingClientRect();
        const c = (r.top + r.bottom) / 2;
        const d = Math.abs(c - mid) / (window.innerHeight * 0.5);
        el.style.setProperty('--lit', Math.max(0, Math.min(1, 1.25 - d)).toFixed(3));
      }
    });
  }, [ref]);
}

export default function CaseStudyPremo() {
  useReveal();
  const body = useRef(null);
  useLit(body);

  useEffect(() => {
    document.title = 'Case study · Premo AI Ltd — Acumei';
    return () => { document.title = 'Acumei — AI engineering lab'; };
  }, []);

  return (
    <div className={`asm asm-page premo${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <main ref={body}>
        <section className="page pm-hero">
          <div className="page-main">
            <div className="titleblock mono" data-reveal>
              <div><span>SHEET</span><b>05</b></div>
              <div className="tb-label"><span>SUBJECT</span><b>Case study · Premo AI Ltd</b></div>
              <div><span>REV</span><b>A</b></div>
            </div>
            <div className="page-head">
              <h1 className="swipe" data-reveal>Building the security foundation for <span className="amb">a real feedback platform.</span></h1>
              <p className="lede" data-reveal style={{ '--d': '120ms' }}>
                Premo is a full multi-tenant SaaS platform for UK trades businesses: a card tap or QR scan is the visible surface over real-time dashboards, a team and location hierarchy, an entitlements engine and a real integration ecosystem. We’re building it with Premo AI Ltd on infrastructure that keeps each business’s data separate, access controlled and sensitive actions accountable.
              </p>
            </div>
            <div className="pm-datasheet mono" data-reveal style={{ '--d': '180ms' }}>
              <div><span>CLIENT</span><b>Premo AI Ltd</b></div>
              <div><span>STATUS</span><b><i className="dot" /> Ongoing engagement · two months in</b></div>
              <div><span>ENGAGEMENT</span><b>Work continues</b></div>
              <div><span>SECTOR</span><b>UK trades businesses</b></div>
            </div>
          </div>
          <PartDrawing part="machine" n="05" />
        </section>

        <div className="pm-wrap">
          <section className="pm-sec" aria-label="Current engineering figures">
            <div className="pm-kick mono">FIG. A · CURRENT FIGURES</div>
            <dl className="pm-figs">
              {FIGURES.map(([v, l], i) => (
                <div key={l} data-reveal style={{ '--d': `${i * 90}ms` }}>
                  <dd>{v}</dd>
                  <dt className="mono">{l}</dt>
                </div>
              ))}
            </dl>
            <p className="pm-note">
              Current figures reported by the project team. The zero refers to the tested
              tenant-isolation scenarios, not a guarantee against every possible failure.
              The test count describes the suite so far, not a claim that every test passes
              in every environment. The table count is the number of tenant-scoped tables
              currently carrying Row-Level Security policies.
            </p>
          </section>

          <section className="pm-sec">
            <div className="pm-kick mono">01 · BRIEF</div>
            <h2 className="pm-h" data-reveal>Before and after.</h2>
            <div className="pm-ba">
              <div className="pm-col" data-reveal>
                <div className="pm-col-h mono"><span>Before</span><span>STATE 00</span></div>
                <p>{BEFORE}</p>
              </div>
              <div className="pm-col pm-after" data-reveal style={{ '--d': '120ms' }}>
                <div className="pm-col-h mono"><span>After</span><span>STATE 01 · IN PROGRESS</span></div>
                <p>{AFTER}</p>
              </div>
            </div>
          </section>

          <section className="pm-sec">
            <div className="pm-kick mono">02 · SCOPE</div>
            <h2 className="pm-h" data-reveal>What&rsquo;s being built</h2>
            <p className="pm-intro" data-reveal>
              This is active work for Premo AI Ltd, two months into an ongoing engagement.
              The product serves plumbers, electricians and other trades businesses:
              customers leave feedback after a job and can continue to a Google review.
              That interaction is the surface. Underneath it sits a full multi-tenant SaaS
              platform — a real-time dashboard, a subscription and entitlements engine,
              an integration layer and the isolation guarantees that let unrelated
              businesses share one system safely.
            </p>

            <div className="pm-sys" data-reveal aria-label="System overview">
              {SYSTEM.map((c) => (
                <div className="pm-sys-c" key={c.k}>
                  <div className="mono pm-sys-k">{c.k}</div>
                  <ul>{c.items.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              ))}
            </div>

            <ol className="pm-spec">
              {SCOPE.map((s, i) => (
                <li key={s.t} data-lit>
                  <div className="pm-n mono"><u />{String(i + 1).padStart(2, '0')}</div>
                  <div className="pm-r">
                    <h3>{s.t}</h3>
                    <p>{s.p}</p>
                    <div className="pm-tags mono">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="pm-sec">
            <div className="pm-kick mono">03 · INFRASTRUCTURE</div>
            <h2 className="pm-h" data-reveal>Real infrastructure, not a prototype</h2>
            <div className="pm-two">
              <p data-reveal>
                The database runs on Neon — serverless Postgres with connection pooling
                that holds up when requests arrive from more than one place at once — and
                the application on Railway. Development, staging and production are separate
                environments, each fully isolated, with their own databases and their own
                credentials.
              </p>
              <p data-reveal style={{ '--d': '100ms' }}>
                None of that is unusual for production software, which is the point of saying
                it. It is the difference between something that works on one machine and
                something that can be deployed, tested against and rolled back — and it is
                how the project is set up while it is still being built, rather than work
                deferred until a launch week.
              </p>
            </div>
          </section>

          <section className="pm-sec">
            <div className="pm-kick mono">04 · APPROACH</div>
            <h2 className="pm-h" data-reveal>The approach</h2>
            <div className="pm-two">
              <p data-reveal>
                We build security-critical behaviour alongside real, automated tests.
                Attempted data leaks, forged signatures and replay attacks sit alongside
                ordinary user journeys. Code that looks right is a starting point; checking
                what it actually allows, rejects and records is the work.
              </p>
              <p data-reveal style={{ '--d': '100ms' }}>
                This is not a race to a handover date. We keep testing as features change,
                investigate failures and work through the difficult cases with the client.
                We do not skip those checks to make a delivery date look better. The
                engagement remains active because the platform is still being built.
              </p>
            </div>
          </section>

          <section className="pm-sec">
            <div className="pm-kick mono">05 · EVIDENCE</div>
            <figure className="sheet pm-plate" data-reveal>
              <i className="cr a" /><i className="cr b" />
              <div className="fr">
                <a href="https://premoloop.ai/" aria-label="Visit Premo’s live marketing site">
                  <img
                    src="/case-studies/premo-website.png"
                    alt="Premo’s public marketing homepage, with its violet hero, feedback workflow illustration and waiting-list invitation."
                    width="2880"
                    height="2000"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <figcaption className="tb mono">
                  <div>PLATE<b>Premo’s live marketing site</b></div>
                  <div>SHEET<b>05 / 01</b></div>
                  <div>CAPTURED<b>20 September 2026</b></div>
                  <div>NOTE<b>Public homepage, not the dashboard</b></div>
                </figcaption>
              </div>
            </figure>
          </section>

          <section className="pm-sec pm-status" aria-label="Engagement status">
            <p>
              This is a real, ongoing engagement for a real client — not a finished
              project, and not a reusable template. Every figure above reflects the
              current state of the codebase, not a completed outcome.
            </p>
          </section>

          <section className="pm-cta" data-reveal>
            <div className="pm-kick mono">06 · NEXT</div>
            <BookCall className="btn">Book a 30-minute discovery call <span>→</span></BookCall>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
