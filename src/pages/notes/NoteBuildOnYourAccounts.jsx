import NoteLayout from './NoteLayout';


export default function NoteBuildOnYourAccounts() {
  return (
    <NoteLayout slug="build-on-your-accounts" part="machine"
      title={<>Why we build on your accounts, <span className="amb">not ours</span></>}
      lede="The account that pays the bill should belong to the business that depends on the system. It is a practical choice about control, costs and what happens when a working relationship ends."
    >
      <section>
        <h2>Start with who can turn the lights on</h2>
        <p>
          A client can own a repository and still depend on an agency for everything that
          makes it useful. The application runs in the agency’s cloud account. The phone
          number sits under its messaging account. The domain is registered to someone who
          left two years ago. Every meaningful change requires asking the same supplier
          for permission.
        </p>
        <p>
          Our default is to build in the client’s accounts. Their cloud organisation,
          their Twilio account, their model-provider account and their repository. Acumei
          gets the access needed to do the work. The client keeps the administrative
          control needed to continue without us. That should be established before the
          first production deployment, while account ownership is still easy to get right.
        </p>
        <p>
          This takes a little setup. Someone needs to accept invitations, add billing
          details and identify the people who will hold administrator access. It can feel
          slower than using an account we already have open. The time is worthwhile
          because it avoids turning a small convenience during development into a
          difficult migration later.
        </p>
      </section>

      <section>
        <h2>Ownership should survive a change of supplier</h2>
        <p>
          Imagine that we stop working together next year. Perhaps the client hires an
          engineer. Perhaps another firm is a better fit. Perhaps Acumei is no longer
          available. The application should not need a new phone number, a rushed export
          and a negotiation over credentials just to keep doing yesterday’s job.
        </p>
        <p>
          Client-owned accounts make that transition more manageable. The client can
          invite the next maintainer, review our permissions and remove our access. There
          is still work to do: someone has to understand the system, accept responsibility
          and check the billing. Account ownership does not make software
          self-maintaining. It does remove an unnecessary dependency on our continued
          cooperation.
        </p>
        <p>
          The practical test is simple. Can the client see the running service, obtain the
          source, pay the providers and authorise a replacement maintainer without waiting
          for us? If the answer is no, the handover is incomplete even if a contract says
          the work belongs to them.
        </p>
      </section>

      <section>
        <h2>The real costs stay visible</h2>
        <p>
          Direct provider billing lets the client see what the system actually consumes.
          Messaging, hosting and model usage remain separate from the engineering fee. A
          rise in traffic is easier to distinguish from a change in the amount of support
          being provided.
        </p>
        <p>
          We can still help set budgets, investigate a surprise bill and explain which
          workflow generated the usage. The point is that the client can inspect the
          evidence too. They do not need to trust a spreadsheet we control or accept a
          bundled price without knowing which parts can change.
        </p>
        <p>
          The responsibility goes both ways. The client needs a valid payment method,
          useful billing contacts and an owner for spend alerts. Account control is less
          valuable if renewal notices go to an unattended mailbox. We would rather agree
          those unglamorous details during setup than discover them during an outage.
        </p>
      </section>

      <section>
        <h2>Access is delegated, not shared</h2>
        <p>
          Using the client’s accounts does not mean asking them to email us the owner
          password. Use individual invitations, appropriate roles and separate credentials
          for the running application. Keep production access distinct from day-to-day
          development where the provider supports it. The business should know which
          people and services can do what.
        </p>
        <p>
          An application credential belongs in the deployment’s secret storage, not a
          source file or a chat transcript. Changing maintainers should include reviewing
          those credentials and rotating them where necessary. The exact process depends
          on the services involved, but the result should be understandable to the
          client’s nominated technical owner.
        </p>
        <p>
          Two named administrators are usually more resilient than an account tied to one
          person’s private email. Recovery access and billing ownership matter just as
          much as the code. None of this needs a grand governance programme. It needs a
          short, accurate account register and people who know they are responsible for
          it.
        </p>
      </section>

      <section>
        <h2>There are legitimate alternatives</h2>
        <p>
          An agency can run a good managed service on its own infrastructure. That may
          suit a client who wants a single supplier to operate everything. The distinction
          should be explicit: what is being rented, what can be exported, what happens on
          cancellation and what a move would cost.
        </p>
        <p>
          The problem is presenting dependency as ownership. If leaving means losing the
          phone number, access to the data or the ability to run the application, the
          commercial relationship has acquired a kind of leverage the client may never
          have intended to buy. We prefer to earn ongoing work through useful maintenance
          rather than through a difficult exit.
        </p>
        <p>
          Some provider features are still specific to that provider. A client-owned cloud
          account does not make every service portable, and owning custom code does not
          transfer ownership of third-party software. Those boundaries belong in the
          design and handover notes. We want the client to understand the choices,
          including the parts that would take work to replace. Keeping the accounts in
          their name is the foundation, not the whole promise.
        </p>
      </section>
    </NoteLayout>
  );
}
