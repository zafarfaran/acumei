import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudySaas() {
  return (
    <PageShell
      n="05"
      label="Case study · B2B SaaS"
      title={<>From fourteen hours <span className="amb">to eleven minutes.</span></>}
      lede="An illustrative look at overnight support that gives customers a useful first response while keeping the on-call engineer focused on real incidents."
      meta="London · Illustrative example"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          In this example, a London B2B SaaS company left overnight tickets untouched
          until someone opened the queue at nine. First response averaged fourteen
          hours, leaving customers unsure whether anyone had seen their problem.
        </p>
        <p>
          Several reports of the same fault could arrive separately, mixed in with
          routine product questions. The morning team had to reconstruct what happened
          before it could decide which tickets needed engineering attention.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <p>
          The solution illustrated here is an agent connected to the ticketing system.
          It groups duplicate and related reports, identifies signs of a genuine service
          incident and alerts the on-call engineer immediately with a concise summary
          and links to the affected tickets.
        </p>
        <p>
          For routine questions, the agent replies directly using approved support
          information. Customers get an acknowledgment and a useful next step; requests
          that need a human decision stay assigned to the support team rather than
          receiving an invented answer.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          The agent uses the existing ticketing system, support guidance and escalation
          rota. The support team keeps ownership of the queue and can see the replies
          and grouping decisions when it starts work.
        </p>
        <p>
          Engineers receive a combined incident picture instead of separate alerts for
          every duplicate. The automation handles the overnight sorting and initial
          response, leaving troubleshooting and sensitive decisions with the people
          responsible for them.
        </p>
      </section>

      <section>
        <h2>Illustrative results</h2>
        <p>
          Average first response falls from fourteen hours to eleven minutes in this
          example. This measures the first reply, not final resolution: complex issues
          still take investigation and engineering work.
        </p>
        <p>
          Customers no longer wait overnight for even an acknowledgment, while engineers
          are only woken for real emergencies. The daytime team starts with a clearer
          queue and the context needed to continue each conversation. These figures
          illustrate the scenario rather than measured client results.
        </p>
        <p>
          <small>
            This is an illustrative example based on realistic UK software-support
            workflows, not a named client engagement.
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
