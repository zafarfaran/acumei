import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudyConstruction() {
  return (
    <PageShell
      n="05"
      label="Case study · Construction"
      title={<>Giving site foremen <span className="amb">their evenings back.</span></>}
      lede="An illustrative look at how voice notes and site photos can become clear, same-day progress reports for a construction firm in Birmingham."
      meta="Birmingham · Illustrative example"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          In this example, a mid-sized construction firm ran several sites, each with
          a foreman spending the last hour of the workday writing up progress for
          clients and project managers. The routine was familiar: describe what got
          done, attach photos, record measurements and flag delays or material needs.
        </p>
        <p>
          The writing was repetitive and easy to put off when a delivery arrived
          late or the crew needed a decision. Updates sometimes went out days after
          the work, while experienced site staff lost time they could have spent
          managing the team or getting home on time.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <p>
          The solution illustrated here is an AI agent that turns a short voice
          note and a handful of phone photos into a structured, professional progress
          report, using the observations the foreman already captures on site.
        </p>
        <h3>A quick account of the shift</h3>
        <p>
          The foreman talks through completed work, measurements, delays and what
          the next shift needs, then adds the relevant site photos. Missing details
          are flagged for clarification rather than filled in with guesses.
        </p>
        <h3>A report organised around the work</h3>
        <p>
          The agent groups the update by trade or area, pairs the supplied photos
          with the relevant notes and separates completed work from outstanding
          tasks. Anything needing client sign-off is clearly marked as awaiting a
          decision, alongside material requirements and delays.
        </p>
        <h3>The right update, the same evening</h3>
        <p>
          Reports go automatically to the agreed client and project-manager contacts
          for that site the same evening. A dated copy keeps the notes and photos
          together, giving everyone a shared record to refer back to.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          The workflow starts with what foremen already use: voice notes and phone
          photos. There is no new form to complete at the end of a long shift. The
          agent does the writing; the foreman talks through the work and remains
          the source of the site observations.
        </p>
        <p>
          Keeping the input simple makes it easier to send an update while the
          details are still fresh, without pulling the foreman away from managing
          the crew to compose a polished client email.
        </p>
      </section>

      <section>
        <h2>Illustrative results</h2>
        <p>
          The example allows for roughly an hour of daily write-up plus time spent
          assembling photos and answering follow-up questions. Across five working
          days, reducing that combined task from about 80 minutes to around 10
          minutes a day gives back <strong>roughly six hours a week per foreman</strong>
          across the multi-site team.
        </p>
        <p>
          Clients get visibility the same day, rather than sometimes waiting several
          days. A clear, dated record also means fewer disputes about what was done
          when, with the relevant observations and photos available together.
          These are illustrative outcomes, not measured results from a client project.
        </p>
        <p>
          <small>
            This is an illustrative example based on realistic UK construction-industry
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
