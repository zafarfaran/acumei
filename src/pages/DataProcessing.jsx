import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO, LEGAL_UPDATED } from '../lib/site';

export default function DataProcessing() {
  return (
    <PageShell
      n="09"
      label="Legal"
      title="Data processing terms"
      lede="When we build a system that handles your customers' data, you are the controller and we are the processor. These are the terms that govern that — the summary version of the agreement we sign with every client."
      meta={`Last updated ${LEGAL_UPDATED}`}
      field={{ mode: 'ridge' }}
    >
      {/* TODO before launch: this is the plain-English website summary, not the
          executable agreement. The signed DPA is the operative document and must be
          drafted or reviewed by a solicitor against UK GDPR Article 28 before any
          client work involving personal data begins. */}

      <section>
        <h2>Which of us is responsible for what</h2>
        <p>
          For the personal data flowing through a system we build for you — your
          customers, tenants, patients, suppliers — <strong>you are the controller and we
          are the processor.</strong> You decide what is collected and why. We act only on
          your documented instructions.
        </p>
        <p>
          For our own business records — your contact details, our correspondence, our
          invoices — we are the controller, and our{' '}
          <Link to="/privacy">privacy policy</Link> applies instead.
        </p>
      </section>

      <section>
        <h2>What we process, and for how long</h2>
        <ul>
          <li><strong>Subject matter:</strong> building, operating and supporting the automated systems described in your statement of work.</li>
          <li><strong>Duration:</strong> the length of the engagement, plus any agreed support retainer.</li>
          <li><strong>Nature and purpose:</strong> reading, transforming, routing and storing data so the system can perform the workflow you have asked it to perform.</li>
          <li><strong>Categories of data subject:</strong> typically your customers, clients, patients, tenants, suppliers and staff — whoever appears in the workflow.</li>
          <li><strong>Types of personal data:</strong> typically names, contact details, appointment and job records, message content and transaction history. The exact list is fixed per project in the signed agreement.</li>
        </ul>
        <p>
          Special category data — health, for example, in a clinical setting — is only
          processed where the engagement specifically requires it, and where we have
          agreed the additional safeguards in writing beforehand.
        </p>
      </section>

      <section>
        <h2>Your data stays in your accounts</h2>
        <p>
          This is the structural point that makes most of the rest simpler. Systems we
          build run on <strong>your</strong> infrastructure, using{' '}
          <strong>your</strong> vendor accounts. We do not host your customer data, we do
          not aggregate it, and we do not hold a copy of it after handover.
        </p>
        <p>
          In practice our access is limited to what is needed to build and support the
          system, using credentials you issue and can revoke at any moment — without our
          help and without breaking anything you own.
        </p>
      </section>

      <section>
        <h2>What we commit to</h2>
        <ul>
          <li>Process personal data only on your documented instructions.</li>
          <li>Keep it confidential, and limit access to the people working on your engagement.</li>
          <li>Apply appropriate technical and organisational security measures.</li>
          <li>Not engage a sub-processor without your prior authorisation, and stay responsible for any we do engage.</li>
          <li>Help you respond to data subject requests and to your obligations around security, breach notification and impact assessments.</li>
          <li>Delete or return personal data at the end of the engagement, at your choice.</li>
          <li>Make available the information you need to demonstrate compliance, and allow audits.</li>
        </ul>
      </section>

      <section>
        <h2>Sub-processors</h2>
        <p>
          A working system depends on third-party services — a model provider, a messaging
          service, a hosting platform. Those are the sub-processors. Which ones apply
          depends entirely on what your system does, so they are listed and agreed in your
          signed agreement rather than here, and contracted for on your own accounts.
        </p>
        <p>
          We give you notice before adding or replacing one, and you can object.
        </p>
        {/* TODO: add the standard sub-processor list and the notice period once
            settled — most clients expect to see the default set (model provider,
            messaging, telephony, hosting) before signing, not after. */}
      </section>

      <section>
        <h2>International transfers</h2>
        <p>
          We work to keep processing inside the UK and EEA. Where a service you have
          approved processes data outside that area, transfers rely on UK adequacy
          regulations or on Standard Contractual Clauses with the UK International Data
          Transfer Addendum.
        </p>
        <p>
          Model providers are worth singling out: where your workflow sends content to a
          language model, we tell you which provider, where it runs and what their data
          retention terms say, before it is built rather than after.
        </p>
      </section>

      <section>
        <h2>Security measures</h2>
        <ul>
          <li>Credentials held in a password manager, never in code, documents or messages.</li>
          <li>Least-privilege access, scoped to the systems a project actually touches.</li>
          <li>Encryption in transit; encryption at rest wherever the underlying service supports it.</li>
          <li>Audit logging of every automated action, so there is a record of what the system did and when.</li>
          <li>A human escalation path for anything the system cannot handle confidently.</li>
          <li>Access revoked at handover.</li>
        </ul>
      </section>

      <section>
        <h2>If something goes wrong</h2>
        <p>
          If we become aware of a personal data breach affecting your data we will tell
          you without undue delay, with what we know about what happened, who is affected
          and what we are doing about it — in time for you to meet your own 72-hour
          obligation to the ICO. We will not sit on it while we investigate.
        </p>
      </section>

      <section>
        <h2>At the end</h2>
        <p>
          On termination we delete or return personal data at your choice, and revoke our
          own access. Because the system runs on your accounts, this is mostly a matter of
          you removing our credentials — the data never leaves your control in the first
          place, so there is no extraction process and nothing to negotiate.
        </p>
      </section>

      <section>
        <h2>Getting a copy</h2>
        <p>
          Email <a href={MAILTO}>{EMAIL}</a> for the full agreement. We will sign yours if
          you have a standard DPA of your own — that is common with larger clients and is
          not a problem.
        </p>
      </section>
    </PageShell>
  );
}
