import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';
import '../styles/case-study-premo.css';

export default function CaseStudyPremo() {
  return (
    <PageShell
      n="05"
      label="Case study · Premo AI Ltd"
      title={<>Building the security foundation for <span className="amb">a real feedback platform.</span></>}
      lede="Premo helps UK trades businesses collect feedback through a card tap or QR code. We’re working with Premo AI Ltd on the platform behind that simple interaction — keeping each business’s data separate, access controlled and sensitive actions accountable."
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
        </dl>
        <p className="premo-progress-note">
          Current figures reported by the project team. The zero refers to the tested
          tenant-isolation scenarios, not a guarantee against every possible failure.
          The test count describes the suite so far, not a claim that every test passes
          in every environment.
        </p>
      </section>

      <section>
        <h2>What&rsquo;s being built</h2>
        <p>
          This is active work for Premo AI Ltd, two months into an ongoing engagement.
          The product serves plumbers, electricians and other trades businesses:
          customers leave feedback after a job and can continue to a Google review.
          Behind that interaction, we&rsquo;re developing the infrastructure that lets
          multiple businesses use the same platform without sharing access to each
          other&rsquo;s customer data.
        </p>

        <h3>Tenant isolation at the database level</h3>
        <p>
          PostgreSQL Row-Level Security enforces the boundaries between businesses.
          We build and test those boundaries alongside the features that depend on
          them, including adversarial attempts to read or change another tenant&rsquo;s
          records. Isolation belongs in the database as well as the application.
        </p>

        <h3>A tamper-evident audit log</h3>
        <p>
          Sensitive actions enter a cryptographically chained audit log. Verification
          checks whether historical records have changed, giving the team a way to
          detect tampering rather than relying on a history that simply looks intact.
          Audit coverage develops with the platform.
        </p>

        <h3>Stripe webhook security</h3>
        <p>
          Payment infrastructure verifies incoming Stripe webhook signatures before
          trusting events. We test forged signatures and replay scenarios alongside
          normal payment flows, so the handling of untrusted or repeated events is
          part of the implementation from the start.
        </p>

        <h3>WhatsApp with aggregate-only guardrails</h3>
        <p>
          The WhatsApp integration gives business owners alerts and conversational
          access to their own aggregate performance statistics. Access checks and
          response guardrails keep the channel scoped to that business and designed
          around summaries, with individual customer data excluded from responses.
        </p>

        <h3>Authentication and team management</h3>
        <p>
          Authentication and team-management work supports solo tradespeople through
          to businesses with several locations. Permissions determine who can access
          each part of the platform, with team membership and business boundaries
          checked as the product grows.
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
