import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO, LEGAL_UPDATED } from '../lib/site';

export default function Terms() {
  return (
    <PageShell
      n="07"
      label="Legal"
      title="Terms of service"
      lede="The terms on which you use this website, and a summary of the terms on which we take on work."
      meta={`Last updated ${LEGAL_UPDATED}`}
      field={{ mode: 'wave' }}
    >
      {/* TODO before launch: not reviewed by a solicitor, and it needs to be — the
          liability and warranty sections in particular. Company number, registered
          office and the liability cap are flagged in the sections below. */}

      <section>
        <h2>Who you are dealing with</h2>
        <p>
          This site is operated by Acumei Ltd, a company registered in England &amp;
          Wales. Contact: <a href={MAILTO}>{EMAIL}</a>.
        </p>
        {/* TODO: add company registration number, registered office address and VAT
            number if registered — legally required disclosures for a UK company. */}
      </section>

      <section>
        <h2>Using this website</h2>
        <p>
          You may read this site, and share links to it, freely. You may not copy its text
          or design wholesale, scrape it at a volume that degrades it for other people, or
          attempt to interfere with how it runs.
        </p>
        <p>
          The words, design and code of this site belong to us. The typefaces are licensed
          from their respective owners.
        </p>
      </section>

      <section>
        <h2>Nothing here is advice or an offer</h2>
        <p>
          The content on this site — including case studies, the savings calculator and
          anything in Notes — is general information about what we do. It is not
          professional advice for your particular business, and it is not a binding offer.
        </p>
        <p>
          <strong>The calculator produces an estimate, not a promise.</strong> It assumes
          automation captures 75% of the hours you describe, applies your own figures, and
          does nothing else. Your actual result depends on facts it does not know about.
          Do not treat its output as a forecast.
        </p>
        <p>
          Case studies describe work we have done for real clients. Results vary, and past
          outcomes do not guarantee anything about yours.
        </p>
      </section>

      <section>
        <h2>How work is agreed</h2>
        <p>
          Nothing on this site creates a contract. Work begins only when we have both
          signed a written statement of work covering scope, price, timeline and any
          assumptions. Where that document conflicts with this page, that document wins.
        </p>
        <ol>
          <li>A free discovery call and a written brief. No obligation either way.</li>
          <li>A fixed-fee quote for a defined scope.</li>
          <li>A signed statement of work, and a data processing agreement where we will handle personal data on your behalf.</li>
          <li>Delivery, handover, and an optional support retainer.</li>
        </ol>
      </section>

      <section>
        <h2>What you own</h2>
        <p>
          On full payment, all intellectual property in the deliverables built for you —
          code, prompts, configuration and documentation — belongs to you outright.
          Everything runs on your accounts and your infrastructure.
        </p>
        <p>
          We keep ownership of general tools, techniques and know-how that pre-date your
          project or that we develop generally, and we grant you a perpetual licence to
          use any of it that is embedded in your deliverables. This is what lets us hand
          over completely without carving anything out.
        </p>
        <p>
          Third-party services your system relies on — model providers, messaging, hosting
          — remain subject to their own terms, and are billed to your accounts directly.
        </p>
      </section>

      <section>
        <h2>Payment</h2>
        <p>
          Fees are fixed and quoted in advance. Invoices are payable within the period
          stated on the statement of work. We may pause work on materially overdue
          invoices, and statutory interest may apply under the Late Payment of Commercial
          Debts (Interest) Act 1998.
        </p>
        {/* TODO: confirm standard payment terms (deposit percentage, invoice
            schedule, payment window) and state them here rather than deferring
            entirely to the statement of work. */}
      </section>

      <section>
        <h2>What we promise, and what we do not</h2>
        <p>
          We will perform our work with reasonable care and skill, in line with the
          standards of a competent provider of similar services.
        </p>
        <p>
          We do not warrant that any system will be uninterrupted or error-free, and that
          is not evasion — systems that depend on third-party APIs and language models
          will occasionally fail. What we do instead is build the failure path: every
          automated action is logged, and anything the system cannot handle escalates to a
          human rather than disappearing.
        </p>
        <p>
          You remain responsible for the accuracy of the data you give us, for the
          decisions your business makes, and for any regulatory obligations specific to
          your sector.
        </p>
      </section>

      <section>
        <h2>Liability</h2>
        <p>
          Neither of us excludes liability for death or personal injury caused by
          negligence, for fraud, or for anything else that cannot lawfully be excluded.
        </p>
        <p>
          Subject to that, neither of us is liable for indirect or consequential loss, and
          our total liability for any engagement is capped at the fees paid for it.
        </p>
        {/* TODO: confirm the liability cap with a solicitor and against professional
            indemnity cover. "Fees paid" is a common position but should be a
            deliberate choice, not a default. */}
      </section>

      <section>
        <h2>Confidentiality</h2>
        <p>
          Anything you tell us about your business in a discovery call or during a project
          is confidential, whether or not the work goes ahead, and whether or not anything
          has been signed. We will not name you as a client publicly without asking first.
        </p>
      </section>

      <section>
        <h2>Ending an engagement</h2>
        <p>
          Either of us may end an engagement on written notice as set out in the statement
          of work. If you end it partway, you pay for the work done to that point and we
          hand over what exists, in a usable state, along with your credentials and data.
          There is nothing held back as leverage.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of England &amp; Wales, and the courts of
          England &amp; Wales have exclusive jurisdiction.
        </p>
      </section>

      <section>
        <h2>Related documents</h2>
        <p>
          See also our <Link to="/privacy">privacy policy</Link>, our{' '}
          <Link to="/cookies">cookie policy</Link> and our{' '}
          <Link to="/data-processing">data processing terms</Link>.
        </p>
      </section>
    </PageShell>
  );
}
