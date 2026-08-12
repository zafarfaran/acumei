import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO, LEGAL_UPDATED } from '../lib/site';

export default function Privacy() {
  return (
    <PageShell
      n="06"
      label="Legal"
      title="Privacy policy"
      lede="How Acumei handles personal data — on this website, and when you get in touch or become a client."
      meta={`Last updated ${LEGAL_UPDATED}`}
    >
      {/* TODO before launch: not reviewed by a solicitor. The facts below describe
          how the site and business actually operate, but the company number,
          registered office and ICO registration number are missing — see the
          TODOs in the sections below. */}

      <section>
        <h2>Who we are</h2>
        <p>
          Acumei Ltd is the data controller for the personal data described in this
          policy. We are registered in England &amp; Wales. You can reach us about
          anything in this document at <a href={MAILTO}>{EMAIL}</a>.
        </p>
        {/* TODO: add company registration number, registered office address and ICO
            registration number. A UK limited company must display its registered
            office and company number on its website — this cannot ship blank. */}
      </section>

      <section>
        <h2>What this website collects</h2>
        <p>
          <strong>Almost nothing.</strong> This site has no contact form, no account
          system, no advertising and no third-party analytics. It sets no cookies and
          writes nothing to local storage.
        </p>
        <p>
          The savings calculator runs entirely in your browser. The figures you enter are
          never transmitted anywhere and are gone as soon as you close the tab. The same
          is true of everything else on the page — the activity feed is fixed sample
          content, not live data about anyone.
        </p>
        <p>
          Our hosting provider keeps standard server logs, which include IP addresses,
          for security and to keep the site running. We do not use those logs to build any
          profile of visitors.
        </p>
      </section>

      <section>
        <h2>What we collect when you contact us</h2>
        <ul>
          <li>Your name, email address and anything else you choose to put in your message.</li>
          <li>Notes we take during a discovery call about your business and the workflows you want to improve.</li>
          <li>If you become a client: contact details for the people we work with, and the commercial correspondence for the engagement.</li>
        </ul>
        <p>
          We do not buy contact lists, we do not scrape them, and we do not run a marketing
          mailing list. If you email us, you get a reply and nothing else.
        </p>
      </section>

      <section>
        <h2>Why we are allowed to hold it</h2>
        <ul>
          <li><strong>To answer you.</strong> Legitimate interests — you contacted us and expect a reply.</li>
          <li><strong>To scope and deliver work.</strong> Performance of a contract, or steps taken at your request before entering one.</li>
          <li><strong>To keep records.</strong> Legal obligation, for accounting and tax.</li>
          <li><strong>To keep the site up and secure.</strong> Legitimate interests.</li>
        </ul>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <ul>
          <li>Enquiries that do not become projects: deleted after 12 months.</li>
          <li>Discovery call notes and briefs: 12 months, unless the work goes ahead.</li>
          <li>Client records: for the engagement, then six years for the financial records we are legally required to retain.</li>
          <li>Speculative job applications: 12 months, then deleted. We will tell you if we want to keep yours longer.</li>
        </ul>
      </section>

      <section>
        <h2>Who else sees it</h2>
        <p>
          We do not sell personal data and we do not share it for anyone else&rsquo;s
          marketing. It is seen by the suppliers we rely on to operate — email, file
          storage, accounting, hosting — each acting on our instructions under contract.
        </p>
        <p>
          Where we process personal data <em>on behalf of a client</em>, as part of a
          system we have built for them, we are the processor rather than the controller
          and different terms apply. Those are set out in our{' '}
          <Link to="/data-processing">data processing terms</Link>.
        </p>
        {/* TODO: name the actual suppliers used (email, storage, accounting,
            hosting) rather than describing them by category. */}
      </section>

      <section>
        <h2>Where it is processed</h2>
        <p>
          We process personal data in the UK and the EEA. Where a supplier processes data
          outside that area, we rely on UK adequacy regulations or the International Data
          Transfer Addendum to the EU Standard Contractual Clauses.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Under UK GDPR you can ask us for a copy of the personal data we hold about you,
          have it corrected, have it deleted, restrict or object to how we use it, or ask
          for it in a portable format. Email <a href={MAILTO}>{EMAIL}</a> and we will
          respond within one month. We will not charge you and we will not make it
          difficult.
        </p>
        <p>
          If you are unhappy with how we have handled your data you can complain to the
          Information Commissioner&rsquo;s Office at{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>,
          or on 0303 123 1113. We would rather you raised it with us first so we can put
          it right.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          Access to client data is limited to the people working on that engagement.
          Credentials are held in a password manager and never in code or documents.
          Systems we build log their actions so there is an audit trail of what was done
          automatically and when.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If this policy changes materially we will update the date at the top of this
          page. This version was published on {LEGAL_UPDATED}.
        </p>
      </section>
    </PageShell>
  );
}
