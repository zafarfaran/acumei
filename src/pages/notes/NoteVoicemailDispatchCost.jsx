import PageShell from '../../components/PageShell';
import BookCall from '../../components/BookCall';
import { NOTES } from '../../lib/notes';

const note = NOTES.find((entry) => entry.slug === 'voicemail-dispatch-cost');

export default function NoteVoicemailDispatchCost() {
  return (
    <PageShell
      n="06"
      label={`Notes · ${note.category}`}
      title={<>What a voicemail-to-dispatch agent <span className="amb">actually costs to run</span></>}
      lede="The model call is often the smallest line on the bill. The useful question is what it costs to keep the whole service working, including the person who notices when it stops."
      meta={`${note.category} · ${note.date} · ${note.mins} min read`}
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>Start with a workload</h2>
        <p>
          An agent that reads a voicemail and texts an engineer sounds almost too small to
          have running costs. There is no new employee, no desk and no shift to cover. But
          it still uses a phone service, transcription, a model, somewhere to run the
          workflow and someone responsible for its behaviour. Calling all of that “the AI”
          makes a budget harder to understand.
        </p>
        <p>
          Take an illustrative small plumbing firm receiving 300 after-hours voicemails a
          month, averaging a minute each. Assume two short outbound texts per request: one
          to the engineer and one to the customer. That is 300 minutes of audio and at
          least 600 SMS segments. Longer messages, replies and retries can increase the
          count. These are planning assumptions, not figures from a client invoice.
        </p>
        <p>
          The first job is checking those assumptions against the actual phone system.
          Does it already record voicemail? Can it notify another service when a recording
          is ready? Can the business keep its existing number? An integration that needs a
          new telephony arrangement has a different cost from one that consumes recordings
          already being produced.
        </p>
      </section>

      <section>
        <h2>A monthly budget you can inspect</h2>
        <p>
          For that workload, a working budget might allow £15 for number rental, inbound
          calling and recording; £5 for transcription; £10 for model calls; £50 for
          messaging; £20 for hosting, a queue and storage; and £15 for monitoring. That is
          £115 a month in service allowances. Add two hours of maintenance at an assumed
          £90 an hour and the working total becomes £295 a month.
        </p>
        <p>
          Those are rounded budgeting allowances, not provider quotes or an Acumei tariff.
          The maintenance rate is an explicit example. The total excludes VAT, initial
          implementation and any staffed overnight response commitment. Each supplier
          allowance needs replacing with a calculation for the chosen account, country,
          volume and service. A useful spreadsheet makes those cells editable rather than
          hiding them inside a single subscription price.
        </p>
        <p>
          The division matters more than the apparent precision. In this example, the
          human maintenance allowance is larger than all the service allowances combined.
          Removing that line does not make the work disappear. It usually means the owner
          or engineer will do it unexpectedly, after something has failed. A quiet month
          might use less time; a provider change or integration problem might use more.
        </p>
      </section>

      <section>
        <h2>Transcription and reasoning are separate costs</h2>
        <p>
          Transcription turns the recording into text. The next step extracts the address,
          classifies the request and prepares a short message. They can use different
          services and have different failure modes. A perfect urgency classifier cannot
          rescue a wrongly transcribed house number. Listen to sample recordings when
          evaluating quality, particularly noisy calls and local place names.
        </p>
        <p>
          For scale, <a href="https://developers.openai.com/api/docs/pricing">OpenAI’s published pricing</a> lists an estimated $0.003 per minute for gpt-4o-mini-transcribe when checked on 19 September 2026. Three hundred minutes would be about $0.90 at that rate, before retries, tax and currency conversion. That is a transcription example only; it does not price the rest of the workflow. It also explains why the £5 budget is an allowance rather than a prediction of the exact invoice.
        </p>
        <p>
          Reasoning costs depend on the model, the length of the instructions and
          transcript, and how many attempts each request needs. Sending a whole history on
          every request costs more than sending the few facts needed for this decision. A
          loop that retries indefinitely is both a reliability problem and a billing
          problem. Bound the number of attempts, record the failures and send unresolved
          requests to a person.
        </p>
      </section>

      <section>
        <h2>Messaging has its own arithmetic</h2>
        <p>
          A text on a phone screen is not necessarily one billable SMS. Twilio documents billing by segment, and <a href="https://www.twilio.com/docs/glossary/what-sms-character-limit">message length and character encoding</a> affect the segment count. Long summaries or some non-standard characters can turn one intended notification into several paid segments. Keep the dispatch message short and put longer context behind an authenticated link if needed.
        </p>
        <p>
          The £50 messaging allowance above works out at roughly 8.3 pence per segment for 600 segments. That is a budget assumption to test, not a statement of Twilio’s current rate. Check the <a href="https://www.twilio.com/en-us/sms/pricing/gb">UK pricing page</a> and the selected number type before buying. Count customer replies, follow-ups and any additional carrier charges in the estimate.
        </p>
        <p>
          Also decide what happens when a text is not delivered. Blindly sending the same
          message again can confuse both the customer and the engineer. Keep a record of
          which request produced which notification. Retry within an agreed limit, and
          make a failed dispatch visible through another agreed channel. The cost of that
          fallback belongs in the design, even if it is rarely used.
        </p>
      </section>

      <section>
        <h2>Monitoring means somebody can act</h2>
        <p>
          A green server does not prove the business workflow is healthy. A process can be
          running while its queue grows, its SMS credentials stop working or its rota
          lookup returns nobody. Monitor completed dispatches, overdue requests, delivery
          failures and the age of the oldest unhandled item. Run a harmless test through
          the chain so silence is not mistaken for success.
        </p>
        <p>
          Logs should let an engineer reconstruct what happened without copying every
          customer detail into every system. Keep a request identifier, timing, the route
          taken and the relevant provider responses. Decide who may inspect recordings and
          how long they are retained. More stored data creates more to secure and
          maintain; it is not automatically better evidence.
        </p>
        <p>
          Paying for a monitoring tool does not buy someone’s attention at three in the
          morning. The business needs a named person or service to receive operational
          alerts, an expected response time and a fallback when automation is unavailable.
          A proper overnight support agreement has a cost separate from the two
          maintenance hours in our example.
        </p>
      </section>

      <section>
        <h2>Compare against the actual alternative</h2>
        <p>
          At five minutes of manual handling per voicemail, 300 requests represent 25
          hours a month. At an assumed loaded cost of £20 an hour, that is £500 before
          arranging overnight availability. Against the illustrative £295 running budget,
          the arithmetic can favour automation. It is not a staffing quote, and a real
          comparison must use the business’s own time records and coverage requirements.
        </p>
        <p>
          Doing nothing has a cost too, but missed-call revenue is not the same as profit.
          Estimate the additional jobs actually won, deduct the labour and materials
          needed to deliver them, and compare the contribution with the full cost of the
          system. Avoid counting a job as recovered merely because a text was sent. A
          customer confirmation and a completed booking are stronger evidence.
        </p>
        <p>
          Include the build cost over a sensible period and check low-volume months. If
          the workflow only saves an hour a month, better voicemail settings or a shared
          inbox may be enough. A well-built agent earns its place when it handles enough
          repetitive work, responds at a useful time and has a maintenance bill the client
          can see. The cheap model call helps. It is not the whole business case.
        </p>
      </section>

      <div className="more">
        <BookCall>
          Want to talk about this? <span>→</span>
        </BookCall>
      </div>
    </PageShell>
  );
}
