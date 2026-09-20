import PageShell from '../components/PageShell';
import BookCall from '../components/BookCall';

export default function CaseStudyRestaurant() {
  return (
    <PageShell
      n="05"
      label="Case study · Restaurant"
      title={<>Cutting food waste <span className="amb">without guesswork.</span></>}
      lede="An illustrative look at using actual sales to draft the weekly order for a Leeds restaurant, with the chef staying in control."
      meta="Leeds · Illustrative example"
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>The challenge</h2>
        <p>
          In this example, a Leeds restaurant’s weekly supplier order was put together
          by hand on Sunday nights. The chef worked from memory, recent busy services
          and a quick look at the stock left in the kitchen.
        </p>
        <p>
          Persistent overstock on perishables meant ingredients spoiled before they
          could be used. At the same time, an unexpected run on a popular dish could
          still trigger an emergency mid-week top-up order.
        </p>
      </section>

      <section>
        <h2>What Acumei built</h2>
        <p>
          The solution illustrated here is an agent that reads actual till and sales
          data and turns the recent pattern of dishes sold into a draft weekly supplier
          order. Agreed ingredient quantities and current stock information help
          translate sales into what the kitchen needs to buy.
        </p>
        <p>
          The chef sees the proposed quantities before anything is sent, can adjust for
          bookings, menu changes or special events, and approves the order with a single
          tap. The final decision stays with the person running the kitchen.
        </p>
      </section>

      <section>
        <h2>The approach</h2>
        <p>
          The agent fits around the existing ordering timetable and supplier
          relationships. It prepares the order in the format the team already uses, with
          the same suppliers and the chef’s approval step.
        </p>
        <p>
          Actual sales provide the starting point, while the chef adds the context the
          numbers cannot supply. That makes the Sunday-night task a short review of a
          prepared order instead of a fresh estimate from memory.
        </p>
      </section>

      <section>
        <h2>Illustrative results</h2>
        <p>
          The example models a 24% reduction in food waste, comparing the weight of
          discarded food over comparable trading periods and allowing for the number of
          covers served. It is a reduction in waste, not a claim that the entire food
          bill falls by 24%.
        </p>
        <p>
          There is less Sunday-night guesswork, less perishable stock left unused and
          fewer emergency mid-week top-up orders. These are illustrative outcomes rather
          than measured results from a client kitchen.
        </p>
        <p>
          <small>
            This is an illustrative example based on realistic UK restaurant ordering
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
