import NoteLayout from './NoteLayout';


export default function NoteOrderingAgentsStockDecisions() {
  return (
    <NoteLayout slug="ordering-agents-stock-decisions" part="models"
      title={<>Ordering agents and the stock decisions <span className="amb">nobody writes down</span></>}
      lede="A till can tell you what sold. It cannot tell you everything the chef knew when they placed the order. Capturing that difference is most of the work."
    >
      <section>
        <h2>The order contains more knowledge than the spreadsheet</h2>
        <p>
          Consider a restaurant ordering example: a Leeds kitchen prepares its weekly order on Sunday night, with perishable stock repeatedly left over. The proposed agent reads sales data and drafts the next order for the chef to approve. It is an illustrative scenario, not a report from a named client. The useful design question is what the agent would need to understand before that draft deserved anyone’s trust.
        </p>
        <p>
          The obvious inputs are straightforward. Dishes sold, recipe quantities, stock on
          hand, supplier pack sizes and delivery dates. Put those together and it seems
          possible to calculate the order. But the chef looking at the result may
          immediately remove a case of fish and add two boxes of something the numbers
          barely mention.
        </p>
        <p>
          That correction is not necessarily inconsistency. It may contain information the
          system does not have: a heatwave changes this kitchen’s bookings, the Friday
          delivery is often short, or a dish is about to come off the menu. The knowledge
          is real even when nobody has written a rule for it. A useful ordering agent has
          to make room for that knowledge before trying to automate the decision.
        </p>
      </section>

      <section>
        <h2>Ask about a decision that actually happened</h2>
        <p>
          “Can you write down your ordering rules?” is a surprisingly difficult request.
          People who know a job well do not usually experience it as a list of conditions.
          They see the situation and know what needs adjusting. Asking for a complete
          rulebook in one meeting can produce a tidy account of the official process while
          missing the details that make it work.
        </p>
        <p>
          A better conversation starts with a recent order. Why did this quantity change?
          What did you know on Sunday that the sales report did not show? Which line would
          you have ordered differently with hindsight? Work through the actual document
          together, while the circumstances are still easy to remember.
        </p>
        <p>
          The aim is not to turn the chef into a business analyst. Ask a few specific
          questions around a decision they recognise. Record the explanation in their
          language first. “We need a spare case before the bank holiday” is useful
          evidence. Translating it immediately into a permanent rule about every holiday
          can lose the conditions that made it sensible on that particular week.
        </p>
      </section>

      <section>
        <h2>Watch the gap between ordered, delivered and used</h2>
        <p>
          An order records intention. A delivery records what arrived. A stock count and
          waste record help explain what happened next. Those are different events, and
          treating them as one number creates convincing but wrong forecasts. A supplier
          who short-ships on Fridays can make a kitchen look as if it ordered too little
          when the actual problem was fulfilment.
        </p>
        <p>
          For an initial period, compare proposed orders with the chef’s orders and then
          with deliveries and usage. Keep the exercise small enough to maintain. A handful
          of expensive or frequently wasted perishables can reveal more than an ambitious
          inventory project that nobody has time to keep accurate.
        </p>
        <p>
          Pay attention to units. A case, a kilogram and a portion are not
          interchangeable. Pack sizes change; recipes have preparation losses; an
          ingredient appears in several dishes. Before arguing about prediction quality,
          check whether the system and the kitchen are counting the same thing. An elegant
          forecast cannot repair a conversion that is wrong by a factor of six.
        </p>
      </section>

      <section>
        <h2>Keep observations separate from rules</h2>
        <p>
          “Order less fish in a heatwave” is a useful prompt for investigation, not a
          universal restaurant principle. In one kitchen, heat may reduce lunch covers. In
          another, it may increase demand for a particular dish. The relevant fact could
          be the booking mix, the terrace opening or a change in the menu rather than
          temperature itself.
        </p>
        <p>
          Capture the observation with its context: who noticed it, which service it
          affects, when it has held true and what evidence would make them reconsider it.
          A note can begin as a suggestion shown alongside the draft. It does not have to
          become an automatic adjustment immediately.
        </p>
        <p>
          Similarly, “this supplier always short-ships on Fridays” may really mean three
          recent deliveries of one product were incomplete. That could justify a temporary
          buffer or a conversation with the supplier. It should not silently become an
          indefinite instruction to over-order every item. Give exceptions an owner and a
          date to review them so yesterday’s workaround does not become permanent waste.
        </p>
      </section>

      <section>
        <h2>Build a draft the chef can disagree with</h2>
        <p>
          A useful first version shows the suggested quantity and the reason beside it.
          For example: recent usage, confirmed bookings, usable stock already on hand and
          the supplier’s minimum pack size. The chef should be able to see which
          assumption to change without reverse-engineering an unexplained total.
        </p>
        <p>
          Leave the approval step in place. The agent prepares an order; the chef decides
          whether it fits the coming week. If a quantity is unusual, make it noticeable
          before the order goes out. If stock data is missing, say so. A confident-looking
          number based on an old count is less useful than a clearly marked estimate.
        </p>
        <p>
          Make corrections quick to record. A short reason such as “private event”,
          “delivery problem” or “menu change” is often enough to start. Do not require a
          paragraph for every edit. The point is to learn where the draft misses context,
          not to create another Sunday-night administrative job. The chef’s ability to
          override a suggestion is part of the workflow, not an error condition.
        </p>
      </section>

      <section>
        <h2>An override is a question worth following</h2>
        <p>
          Repeated overrides can reveal a missing input. If the chef adds the same item
          every week, perhaps staff meals are consuming stock outside the till data. If
          one quantity is always reduced, perhaps the recipe estimate is too generous or
          the usable stock count is incomplete. Ask before concluding that the person is
          irrational or that the model needs more training.
        </p>
        <p>
          Not every override should teach the system to repeat it. A one-off event should
          stay a one-off event. Some corrections turn out to have been mistakes
          themselves. Review the outcome: did the kitchen use the extra stock, run short,
          substitute another ingredient or throw some away? The decision and its result
          are both needed to learn anything useful.
        </p>
        <p>
          This also changes what to measure. Agreement with the chef is helpful early on,
          but perfect agreement can reproduce an existing over-ordering habit. The
          longer-term questions concern waste, availability, emergency orders and the time
          spent preparing the order. No single measure captures all four. A system that
          minimises waste by leaving popular dishes unavailable has not solved the
          kitchen’s problem.
        </p>
      </section>

      <section>
        <h2>Roll out with a way to stop</h2>
        <p>
          Begin with drafts that do not send anything. Compare them over several ordering
          cycles and fix the mundane errors first: missing delivery dates, stale stock
          counts, the wrong pack size. Then allow approved orders to go through the normal
          supplier channel, keeping a clear record of what was sent and when.
        </p>
        <p>
          Check for duplicate sending, particularly when a response from the supplier is
          delayed. A timeout does not prove an order failed. The system should preserve
          its reference and reconcile the outcome before attempting another submission.
          The kitchen needs one reliable order, not two because a network request was
          slow.
        </p>
        <p>
          Keep a manual path the team already understands. If the sales feed is
          unavailable on Sunday, the agent should say the draft is incomplete and let the
          chef proceed without it. A failed automation should not make the restaurant less
          capable than it was before. The same applies when a supplier changes its
          process: pause the affected part, explain the gap and keep the rest of the
          workflow legible.
        </p>
      </section>

      <section>
        <h2>Make the learning visible</h2>
        <p>
          The restaurant example uses a 24% reduction in food waste as an illustrative
          outcome. Establishing that result in a real kitchen would require a baseline and
          comparable measurement, with attention to covers served, menu changes and the
          kind of waste counted. A quieter trading period or a smaller menu can change the
          total without proving the agent caused the improvement.
        </p>
        <p>
          The quieter benefit is that ordering knowledge becomes shared. Another chef can
          understand why a buffer exists. A manager can see which supplier problem keeps
          changing the order. The original chef no longer has to be present for every
          small exception to be remembered correctly.
        </p>
        <p>
          That is the practical goal: a draft based on evidence, enough explanation to
          correct it and a growing record of the decisions that matter. The chef keeps
          judgement over the coming week. The system takes on the repetitive preparation
          and remembers the context people choose to give it. You get there by asking
          about real decisions and checking what happened afterwards, not by pretending
          everything important was in the till export.
        </p>
      </section>
    </NoteLayout>
  );
}
