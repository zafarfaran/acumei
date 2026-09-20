import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudyDentalPractice() {
  return (
    <PageShell
      n="05"
      label="Case study · Dental practice"
      title={<>Recovering chair time for <span className="amb">a UK dental practice.</span></>}
      lede="An illustrative look at how timely reminders and a responsive waitlist can help a multi-chair practice in Leeds fill appointments that would otherwise sit empty."
      meta="Leeds · Illustrative example"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          In this example, a multi-chair dental practice in Leeds was losing revenue
          to no-shows and late cancellations. A receptionist called or texted patients
          the day before their appointment, fitting reminders around check-ins,
          incoming calls and the rest of a busy front desk.
        </p>
        <p>
          Reminders were inconsistent, and a cancellation could leave a chair empty
          even when other patients wanted an earlier appointment. The waitlist existed,
          but working through it by phone took time the team rarely had at short notice.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <p>
          The solution illustrated here is an AI agent connected to the practice&rsquo;s
          existing booking system, coordinating reminders and waitlist offers around
          the appointments already in the diary.
        </p>
        <h3>Reminders at useful moments</h3>
        <p>
          Personalised reminders give patients time to confirm or cancel before the
          day of their visit. Timing follows the appointment and its confirmation
          status, with follow-ups limited so messages stay helpful rather than nagging.
        </p>
        <h3>Cancellations caught as they happen</h3>
        <p>
          When a cancellation reaches the booking system, the agent picks it up
          immediately and checks the freed slot against the waitlist, including
          appointment length and the times patients can attend.
        </p>
        <h3>A waitlist that responds</h3>
        <p>
          The agent messages the next two or three suitable patients in priority
          order. The first to confirm gets the slot; availability is checked again
          before booking, and the offer closes for everyone else so the same chair
          time cannot be promised twice.
        </p>
        <h3>A simple weekly summary</h3>
        <p>
          The practice manager sees which cancelled slots were refilled, their
          appointment value and how the no-show rate is changing. The summary makes
          it easy to distinguish recovered bookings from appointments that were
          already going ahead.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          The agent works with the practice&rsquo;s existing booking software. The
          front desk keeps using the same diary and handling the conversations that
          need a person. Reminders, cancellation detection and waitlist follow-up
          close the gaps that a manual process struggles to cover during a busy day.
        </p>
      </section>

      <section>
        <h2>Illustrative results</h2>
        <p>
          In the example month, 20 appointments that would otherwise have gone empty
          are refilled at an assumed average appointment value of £92.50:
          <strong> £1,850 in recovered chair time.</strong> This represents appointment
          revenue, before treatment costs, rather than additional profit.
        </p>
        <p>
          The modelled no-show rate falls roughly in half, from 8% to 4%. Routine
          reminder calls take significantly less front-desk time, leaving the team
          to focus on patient questions and exceptions that need personal attention.
          These figures illustrate the scenario; they are not measured client results.
        </p>
        <p>
          <small>
            This is an illustrative example based on realistic UK dental-practice
            economics, not a named client engagement.
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
