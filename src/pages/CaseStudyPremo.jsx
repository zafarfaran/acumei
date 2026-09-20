import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';
import '../styles/case-study-premo.css';

export default function CaseStudyPremo() {
  return (
    <PageShell
      n="05"
      label="Case study · Premo AI Ltd"
      title={<>Building the security foundation for <span className="amb">a real feedback platform.</span></>}
      lede="Premo is a full multi-tenant SaaS platform for UK trades businesses: a card tap or QR scan is the visible surface over real-time dashboards, a team and location hierarchy, an entitlements engine and a real integration ecosystem. We’re building it with Premo AI Ltd on infrastructure that keeps each business’s data separate, access controlled and sensitive actions accountable."
      meta="Ongoing engagement · Two months in · Work continues"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <figure className="premo-site-shot">
          <a href="https://premoloop.ai/" aria-label="Visit Premo’s live marketing site">
            <img
              src="/case-studies/premo-website.png"
              alt="Premo’s public marketing homepage, with its violet hero, feedback workflow illustration and waiting-list invitation."
              width="2880"
              height="2000"
              decoding="async"
            />
          </a>
          <figcaption>
            <span className="mono">Premo&rsquo;s live marketing site</span>
            <span>Public homepage captured 20 September 2026. This is not the dashboard.</span>
          </figcaption>
        </figure>
      </section>

      <section aria-label="Current engineering figures">
        <dl className="premo-progress">
          <div>
            <dt>Automated tests, so far</dt>
            <dd>1,982</dd>
          </div>
          <div>
            <dt>Cross-tenant data leaks, tested</dt>
            <dd>0</dd>
          </div>
          <div>
            <dt>Tenant-isolated tables</dt>
            <dd>47</dd>
          </div>
        </dl>
        <p className="premo-progress-note">
          Current figures reported by the project team. The zero refers to the tested
          tenant-isolation scenarios, not a guarantee against every possible failure.
          The test count describes the suite so far, not a claim that every test passes
          in every environment. The table count is the number of tenant-scoped tables
          currently carrying Row-Level Security policies.
        </p>
      </section>

      <section>
        <h2>What&rsquo;s being built</h2>
        <p>
          This is active work for Premo AI Ltd, two months into an ongoing engagement.
          The product serves plumbers, electricians and other trades businesses:
          customers leave feedback after a job and can continue to a Google review.
          That interaction is the surface. Underneath it sits a full multi-tenant SaaS
          platform — a real-time dashboard, a subscription and entitlements engine,
          an integration layer and the isolation guarantees that let unrelated
          businesses share one system safely.
        </p>

        <h3>A dashboard that updates itself</h3>
        <p>
          Postgres LISTEN/NOTIFY carries database changes straight to the application,
          which pipes them to the browser over Server-Sent Events. Feedback appears on
          the dashboard as it arrives: no polling loop, no refresh button, and no
          interval quietly re-querying the database for every tab a business leaves
          open all day.
        </p>

        <h3>A data hierarchy that keeps its history</h3>
        <p>
          The model runs Organisation → Location → Team → Team member, and
          historical records hold immutable snapshots of the structure they were
          written under. Renaming a location or an employee leaving does not silently
          rewrite last quarter&rsquo;s reports — what happened stays what happened,
          even once the organisation around it has changed.
        </p>

        <h3>Entitlements and subscription state</h3>
        <p>
          Plan limits resolve through a single pure function that every gated action
          calls, so there is one place to read and one place to change what a plan
          allows. Subscriptions move through an explicit state machine — active,
          grace, read-only, suspended — rather than a scatter of boolean flags.
          Stripe webhooks are signature-verified and processed idempotently, so a
          redelivered event cannot be applied twice. We test forged signatures and
          replays alongside the ordinary payment paths.
        </p>

        <h3>Tenant isolation at the database level</h3>
        <p>
          PostgreSQL Row-Level Security is enforced on every one of the 47
          tenant-scoped tables, not only the ones the application happens to query
          today. Those boundaries are tested independently of the application code,
          including adversarial attempts to read or change another tenant&rsquo;s
          records. Isolation belongs in the database as well as the application.
        </p>

        <h3>A tamper-evident audit log</h3>
        <p>
          Sensitive actions enter a cryptographically chained audit log. Verification
          checks whether historical records have changed, giving the team a way to
          detect tampering rather than relying on a history that simply looks intact.
          Audit coverage develops with the platform.
        </p>

        <h3>Integrations that carry real traffic</h3>
        <p>
          Clerk handles identity, Stripe payments, Resend transactional email, and
          Google the routing of review requests. WhatsApp, through the Meta API, gives
          owners alerts and conversational access to their own aggregate figures —
          scoped to that business and designed around summaries, with individual
          customer data excluded from responses. A live monday.com integration closes
          the loop from the other direction: when a client marks a job complete on
          their own board, that push triggers the review request automatically.
        </p>

        <h3>UK and EU data residency, designed in</h3>
        <p>
          Postgres is hosted in London, and error tracking is scrubbed of personal data
          before anything leaves the application. Trades businesses hold customer
          names, addresses and job details, so residency is a constraint to build
          around from the first migration rather than a retrofit once a customer asks
          the question.
        </p>
      </section>

      <section>
        <h2>Real infrastructure, not a prototype</h2>
        <p>
          The database runs on Neon — serverless Postgres with connection pooling
          that holds up when requests arrive from more than one place at once — and
          the application on Railway. Development, staging and production are separate
          environments, each fully isolated, with their own databases and their own
          credentials.
        </p>
        <p>
          None of that is unusual for production software, which is the point of saying
          it. It is the difference between something that works on one machine and
          something that can be deployed, tested against and rolled back — and it is
          how the project is set up while it is still being built, rather than work
          deferred until a launch week.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          We build security-critical behaviour alongside real, automated tests.
          Attempted data leaks, forged signatures and replay attacks sit alongside
          ordinary user journeys. Code that looks right is a starting point; checking
          what it actually allows, rejects and records is the work.
        </p>
        <p>
          This is not a race to a handover date. We keep testing as features change,
          investigate failures and work through the difficult cases with the client.
          We do not skip those checks to make a delivery date look better. The
          engagement remains active because the platform is still being built.
        </p>
      </section>

      <section aria-label="Engagement status">
        <p>
          <small>
            This is a real, ongoing engagement for a real client — not a finished
            project, and not a reusable template. Every figure above reflects the
            current state of the codebase, not a completed outcome.
          </small>
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
