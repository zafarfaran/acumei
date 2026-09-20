import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudySalon() {
  return (
    <PageShell
      n="05"
      label="Case study · Salon"
      title={<>Rebooking clients <span className="amb">without the awkward chase.</span></>}
      lede="An illustrative look at timely, personal rebooking messages for a Manchester salon, written in the owner’s familiar style."
      meta="Manchester · Illustrative example"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          In this example, clients at a Manchester salon drifted away between
          appointments even when they had enjoyed their last visit. A busy week became a
          busy month, and booking again slipped down the list.
        </p>
        <p>
          The owner knew many of those clients personally but felt awkward chasing them.
          Follow-up happened inconsistently, leaving gaps in the diary and making the
          next few weeks’ bookings harder to predict.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <p>
          The solution illustrated here is a daily agent that identifies clients
          approaching their usual rebooking point. It uses each client’s appointment
          history to decide when a reminder is useful, rather than sending the whole
          client list the same message on the same day.
        </p>
        <p>
          Personalised messages follow the owner’s own voice and style, with a
          straightforward invitation to book. Existing bookings, messaging preferences
          and recent reminders are checked first so clients are not chased after they
          have already made an appointment.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          The owner supplies examples of how they naturally speak to clients and reviews
          the wording before it is used. Messages stay warm and familiar, avoiding a
          corporate template or pressure to book immediately.
        </p>
        <p>
          Timing follows each client’s typical interval between visits. Replies that
          need a personal conversation come back to the salon, while the daily agent
          takes care of noticing who is due and sending the initial invitation.
        </p>
      </section>

      <section>
        <h2>Illustrative results</h2>
        <p>
          Weekly rebookings attributed to follow-up rise sevenfold in the example: from
          an assumed two to fourteen a week. The 7× figure applies to that small follow-
          up baseline, not to all salon bookings or total revenue.
        </p>
        <p>
          The owner no longer has to make an awkward personal chase, and a more
          consistent flow of returning clients supports steadier week-to-week revenue.
          These numbers illustrate the scenario; they are not measured client results.
        </p>
        <p>
          <small>
            This is an illustrative example based on realistic UK salon rebooking
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
