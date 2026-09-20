import PageShell from '../../components/PageShell';
import BookCall from '../../components/BookCall';
import { NOTES } from '../../lib/notes';

const note = NOTES.find((entry) => entry.slug === 'when-to-wake-a-human');

export default function NoteWhenAgentShouldWakeHuman() {
  return (
    <PageShell
      n="06"
      label={`Notes · ${note.category}`}
      title={<>When an agent should wake a human, <span className="amb">and when it should not</span></>}
      lede="An escalation policy spends somebody’s attention. It needs an owner, a reason and a clear next action—not just a model that can label a message “urgent”."
      meta={`${note.category} · ${note.date} · ${note.mins} min read`}
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <section>
        <h2>Being cautious can still cause harm</h2>
        <p>
          “Escalate anything uncertain” sounds safe. At low volume, it can work. At higher
          volume it turns the person on call into a second inbox, interrupted for routine
          questions and incomplete messages. Eventually they stop trusting the alerts. The
          next real incident arrives in a channel they have learned to ignore.
        </p>
        <p>
          The opposite mistake is quieter. An agent decides that a vague message is
          probably routine and leaves it until morning. The delay turns out to matter. A
          system can look calm and efficient while missing the very events it exists to
          catch. Counting how few people were disturbed tells only half the story.
        </p>
        <p>
          These are false positives and false negatives. A false positive interrupts
          someone unnecessarily. A false negative misses a request that deserved
          attention. Neither has one universal cost. Waking an engineer for a password
          question is different from failing to flag a widespread service outage. The
          decision has to start with the work, not a confidence score.
        </p>
      </section>

      <section>
        <h2>Write down what cannot wait</h2>
        <p>
          Our starting framework has four questions. What is happening now? What gets
          worse if nobody acts before the next staffed period? Can the person being
          contacted actually help? And what evidence supports that assessment? A useful
          escalation answers all four, even if the last answer is that a critical detail
          is missing.
        </p>
        <p>
          For a software service, several customers unable to complete a core task might
          justify waking the on-call engineer. A question about how to export last month’s
          report usually does not. A single message can still deserve escalation if its
          impact is serious; counting tickets alone is a poor substitute for understanding
          the affected task.
        </p>
        <p>
          Write the policy with the person who will receive the calls. Include working
          hours, service boundaries, which customer commitments matter and how long each
          category can wait. Give the policy an owner and a review date. “The AI decides”
          is not an answer when the business needs to explain why someone was disturbed or
          why a request was left untouched.
        </p>
      </section>

      <section>
        <h2>Use more than two destinations</h2>
        <p>
          A useful workflow has at least three outcomes: act now, seek clarification and
          queue for normal handling. Some systems also need a specialist route for issues
          the regular on-call person cannot resolve. Forcing everything into urgent or
          routine hides the difference between a harmless request and an important request
          with missing information.
        </p>
        <p>
          Consider “It has stopped working again.” That sentence contains too little
          context to classify reliably. The agent might ask which service is affected and
          whether work is blocked. But clarification needs a time limit. Where the
          possible consequence of delay is high, an unanswered question may itself require
          human review under the agreed policy.
        </p>
        <p>
          The customer’s use of “urgent” is useful evidence, not a command to page
          someone. Similarly, a model’s high confidence is not proof that a classification
          is correct. Use explicit business rules for known critical conditions, and
          evaluate the ambiguous cases against labelled examples. Let language
          understanding help interpret the message without giving it unlimited authority
          over the escalation policy.
        </p>
      </section>

      <section>
        <h2>Make the interruption actionable</h2>
        <p>
          An alert should say what happened, why it crossed the threshold, what is known
          and what remains uncertain. Include the relevant request or incident link and
          the action needed. “Urgent customer issue” makes a tired engineer do the
          classification again. “Three accounts cannot complete checkout; first report
          02:12; payment status unknown” gives them a useful starting point.
        </p>
        <p>
          Related reports should attach to one incident where appropriate. That reduces
          repeated interruptions without losing the evidence that the problem is
          spreading. Keep the original messages available. A summary is helpful until it
          accidentally removes the one detail that changes the diagnosis.
        </p>
        <p>
          Delivery also needs an owner. Sending an alert does not mean someone accepted
          it. Decide how acknowledgment works, when an unacknowledged incident moves to a
          backup and how to avoid waking the whole rota at once. An escalation policy
          without an acknowledgment path can fail even when the classification is perfect.
        </p>
      </section>

      <section>
        <h2>Tune against cases, not a feeling</h2>
        <p>
          Start in a mode where the agent proposes a route and a person checks it before
          the routing affects anyone. Use representative messages, including difficult and
          incomplete ones. If historical data is available and appropriate to use, compare
          the proposed decision with what a knowledgeable operator would have wanted at
          the time. Do not give the agent information that arrived only later.
        </p>
        <p>
          Then review both kinds of error. Of the requests escalated, how many genuinely
          needed immediate attention? Of the requests that did need it, how many were
          caught? The first question captures alert quality; the second captures missed
          urgency. Looking only at escalated messages will never reveal a serious request
          quietly left in the routine queue.
        </p>
        <p>
          Keep a short record of disagreements and the reason for each correction. Change
          one part of the policy at a time, then replay the same examples as well as newly
          collected cases. Otherwise a fix for yesterday’s noisy alert may silently
          reintroduce last month’s missed incident. A small, maintained set of examples is
          more useful than a large dashboard nobody reviews.
        </p>
      </section>

      <section>
        <h2>Trust is part of the operating budget</h2>
        <p>
          During rollout, review decisions frequently and keep the manual route available.
          As the pattern stabilises, review on an agreed schedule and after significant
          incidents, changes to the service or changes in customer behaviour. A threshold
          that worked during a quiet month may behave differently during a launch or
          outage.
        </p>
        <p>
          Measure acknowledgment time and whether the intervention helped, not just how
          quickly the agent sent a notification. Ask the on-call team which alerts lacked
          context and which routine items nearly became emergencies. Their feedback is
          evidence about the workflow, not resistance to automation.
        </p>
        <p>
          The target is a channel people take seriously. When it wakes them, they should
          understand why. When it stays quiet, there should be evidence that important
          requests are still being caught. That balance needs maintenance. An agent earns
          adoption by making the boundary understandable and dependable, not by promising
          that nobody will ever need to make a judgement call again.
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
