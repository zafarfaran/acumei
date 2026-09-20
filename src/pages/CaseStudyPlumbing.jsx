import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudyPlumbing() {
  return (
    <PageShell
      n="05"
      label="Case study · Plumbing & heating"
      title={<>Never missing an <span className="amb">emergency callout again.</span></>}
      lede="An illustrative look at turning after-hours voicemail into a prompt dispatch for a Bristol plumbing and heating firm."
      meta="Bristol · Illustrative example"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          In this example, after-hours calls to a Bristol plumbing and heating firm
          slipped to voicemail until morning. Someone dealing with an urgent problem
          rarely waited for a callback: they tried the next firm that answered.
        </p>
        <p>
          The missed work added up to roughly £24,000 a year in lost emergency callouts.
          There was already an engineer on call, but no reliable link between a customer
          leaving a message and that engineer knowing a job needed attention.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <p>
          The solution illustrated here is an agent that listens to the voicemail,
          extracts the problem and location, and assesses urgency against rules agreed
          with the firm. It texts the engineer on duty with the details needed to act
          and confirms an available slot with the customer.
        </p>
        <p>
          For messages with the required details and an available rota slot, the
          automated sequence averages 14 seconds from receipt of the completed voicemail
          to dispatch notification and slot confirmation. That is dispatch time, not the
          engineer’s arrival time. Incomplete or unclear requests go to a person for
          follow-up.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          The agent works with the existing on-call rota, coverage area and agreed
          availability. Engineers keep their established responsibilities; the agent
          connects incoming requests to the right person and slot.
        </p>
        <p>
          Routine enquiries are held for the daytime team. Urgent jobs reach the on-call
          engineer immediately, with the voicemail details attached so they do not have
          to piece the situation together from a missed-call notification.
        </p>
      </section>

      <section>
        <h2>Illustrative results</h2>
        <p>
          The example addresses roughly £24,000 a year in previously lost emergency
          callout revenue, with an average automated dispatch time of 14 seconds. The
          annual figure describes the missed-work opportunity, rather than a claim that
          every pound is recovered.
        </p>
        <p>
          Prompt confirmation means fewer customers moving on to competitors. With
          routine requests separated from genuine emergencies, the on-call engineer is
          only woken for work that needs immediate attention. These are illustrative
          outcomes, not measured client results.
        </p>
        <p>
          <small>
            This is an illustrative example based on realistic UK plumbing and heating
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
