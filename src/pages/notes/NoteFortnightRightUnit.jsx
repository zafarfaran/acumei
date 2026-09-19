import PageShell from '../../components/PageShell';
import BookCall from '../../components/BookCall';
import { NOTES } from '../../lib/notes';

const note = NOTES.find((entry) => entry.slug === 'fortnight-right-unit-of-delivery');

export default function NoteFortnightRightUnit() {
  return (
    <PageShell
      n="06"
      label={`Notes · ${note.category}`}
      title={<>A fortnight is <span className="amb">the right unit of delivery</span></>}
      lede="Two weeks is enough time to make a useful change visible. It is also short enough that a wrong assumption does not get an entire quarter to settle in."
      meta={`${note.category} · ${note.date} · ${note.mins} min read`}
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>Give the work a shape</h2>
        <p>
          A project described as “automate operations” has no useful edge. There is always
          another process to connect and another exception to handle. A fortnight forces a
          smaller question: what should someone be able to do at the end that they cannot
          do now?
        </p>
        <p>
          For an ordering agent, the answer might be reviewing a draft order for one
          supplier. For a voicemail workflow, it might be routing completed messages to
          the correct person in a supervised trial. Those are pieces of a larger system,
          but each has a user, a beginning, an end and a way to tell whether it works.
        </p>
        <p>
          The boundary matters more than the calendar. “Build the integration layer” may
          be necessary engineering work, but it gives the client little to judge. “Review
          a draft built from last week’s sales” exposes whether the data is useful,
          whether the quantities make sense and whether the workflow fits the kitchen. It
          invites a meaningful correction.
        </p>
      </section>

      <section>
        <h2>Long enough to finish a loop</h2>
        <p>
          A useful change needs more than implementation. Someone has to understand the
          current process, get access, build the path, test failures and put the result in
          front of the person who will use it. Two weeks gives those activities room to
          happen together.
        </p>
        <p>
          We can still make small commits and show progress during that time. The delivery
          unit is the piece of working behaviour the client can assess, not the size of a
          code change. Constantly shipping tiny visible adjustments can become its own
          distraction if nobody gets a coherent workflow to try.
        </p>
        <p>
          The review should use a realistic example. Put an actual-shaped request through
          the system, see the result and try the awkward case. A slide saying “routing
          complete” tells you much less than a message going to the wrong person because
          the rota format was misunderstood.
        </p>
      </section>

      <section>
        <h2>Short enough to change direction</h2>
        <p>
          A misunderstanding found after two weeks is usually easier to act on than one
          found after three months of dependent work. The client can say that the proposed
          reminder arrives at the wrong time, that the report misses a key field or that
          the supposedly repetitive task needs more judgement than expected.
        </p>
        <p>
          That is useful information, not a failed presentation. The next fortnight should
          respond to it. Continuing with the original plan simply because several future
          features have already been scheduled defeats the reason for working in
          increments.
        </p>
      </section>

      <section>
        <h2>Keep the quality bar fixed</h2>
        <p>
          Two weeks is not permission to skip access controls, failure handling or the
          checks needed for the proposed use. If the slice cannot be made ready in that
          time, reduce its scope. Keep it supervised, limit the data or demonstrate it in
          a test environment. Be precise about what has and has not been released.
        </p>
        <p>
          Some work will take longer. Provider approvals, difficult migrations and
          unfamiliar legacy systems do not become predictable because a calendar
          invitation exists. Surface those dependencies early. A fortnight is a review and
          delivery rhythm, not a guarantee that every project finishes in fourteen days.
        </p>
      </section>

      <section>
        <h2>End with a decision</h2>
        <p>
          At the review, we want to answer three things: what now works, what the client
          learned by trying it and what should happen next. Sometimes the answer is to
          expand. Sometimes it is to simplify. Sometimes the sensible decision is that
          this particular automation is not worth continuing.
        </p>
        <p>
          A short written note should capture that decision, along with remaining
          limitations and who owns the next action. Then the next piece of work has a
          clear reason to exist. That is why we like a fortnight. It creates regular
          opportunities to finish something, learn something and change our minds while
          the change is still affordable.
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
