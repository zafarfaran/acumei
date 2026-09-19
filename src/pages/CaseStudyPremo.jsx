import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudyPremo() {
  return (
    <PageShell
      n="05"
      label="Case study · Premo AI Ltd"
      title={<>Building the security foundation for <span className="amb">Premo&rsquo;s feedback platform.</span></>}
      lede="From an idea to tested infrastructure in one month: a feedback platform for UK trades businesses, with security built into its foundations."
      meta="19 Aug – 19 Sep 2026 · Pre-launch"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          Premo AI Ltd needed a feedback and review-management platform for UK trades
          businesses — plumbers, electricians and engineers. Customers tap a card or
          scan a QR code, leave feedback and can optionally continue to a Google review.
        </p>
        <p>
          For a platform handling real customer data and eventually payments, secure
          multi-tenant infrastructure was the foundation everything else depended on.
          Each business needed its own protected space before a single customer&rsquo;s
          data could be trusted alongside another&rsquo;s.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <h3>Isolation at the database level</h3>
        <p>
          PostgreSQL Row-Level Security enforces tenant boundaries in the database.
          Dedicated adversarial tests attempt to cross those boundaries, checking that
          one business cannot read or change another business&rsquo;s data.
        </p>
        <h3>Tamper-evident audit logging</h3>
        <p>
          Sensitive actions are recorded in a cryptographically chained audit log.
          Verification can detect changes to historical records, making tampering
          evident rather than relying on a log that simply looks intact.
        </p>
        <h3>Secure payment infrastructure</h3>
        <p>
          Stripe webhook integration verifies the authenticity of incoming payment
          events before trusting them, with tests covering forged signatures and
          replay scenarios.
        </p>
        <h3>WhatsApp with clear data boundaries</h3>
        <p>
          Business owners can receive real-time alerts and conversational access to
          their own aggregate performance statistics. Strict access and response
          guardrails are designed to keep individual customer data out of that channel.
        </p>
        <h3>Authentication and team management</h3>
        <p>
          Authentication and team-management infrastructure supports solo tradespeople
          through to multi-location businesses, with access scoped to the business
          and the team member&rsquo;s permissions.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          Security-critical infrastructure was built alongside real, automated tests.
          The codebase contains 1,982 tests, including adversarial cases for attempted
          data leaks, forged signatures and replay attacks. The aim is to verify
          behaviour before shipping, with evidence beyond code that looks right.
        </p>
      </section>

      <section>
        <h2>One month, from idea to tested infrastructure</h2>
        <p>
          Built from 19 August to 19 September 2026, the work established the security
          foundation for Premo&rsquo;s feedback platform: tenant boundaries, auditability,
          payment verification and controlled access across its user-facing channels.
        </p>
        <p>
          <small>
            Premo is pre-launch — this case study reflects engineering scope and rigor,
            not yet business outcomes.
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
