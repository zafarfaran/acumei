import NoteLayout from './NoteLayout';


export default function NoteWhatClientsOwn() {
  return (
    <NoteLayout slug="what-clients-actually-own" part="data"
      title={<>What clients actually own <span className="amb">when we hand a system over</span></>}
      lede="A repository is part of a handover. The harder question is whether someone else can run, understand and change the system without needing its original author on the phone."
    >
      <section>
        <h2>A zip file is a weak finish</h2>
        <p>
          It is possible to deliver every source file and still leave a client unable to
          operate what they bought. The setup instructions depend on a laptop that no
          longer exists. Nobody knows which cloud account holds the database. There are
          tests, but nobody can explain how to run them or which credentials they expect.
        </p>
        <p>
          That client has code. They do not yet have a maintainable system. The
          distinction becomes visible when a small change is needed or something fails.
          Until then, a polished demo can conceal a surprising amount of knowledge held
          only by the people who built it.
        </p>
        <p>
          Our stance is that handover has to transfer enough practical control for a
          competent replacement maintainer to take over. It does not turn a nontechnical
          owner into a software engineer. It should let that owner understand the service,
          keep access to it and choose who maintains it next. Those are different
          responsibilities, and both deserve attention.
        </p>
      </section>

      <section>
        <h2>Start with a clear inventory</h2>
        <p>
          The custom source should live in a repository the client controls, with its
          history and the instructions used to build and release it. The handover should
          identify the deployed version, the services it uses and where its data lives.
          Configuration belongs in that inventory too, with secret values kept in the
          appropriate secure storage rather than pasted into documentation.
        </p>
        <p>
          A list of accounts should name their owners, billing contacts and recovery
          arrangements. Include the domain, messaging provider, model provider, hosting,
          database, monitoring and any automation platform involved. A small dependency
          that only runs once a month can still stop the business when its subscription
          lapses.
        </p>
        <p>
          The scope of ownership also needs plain language. Custom deliverables,
          third-party libraries, licensed services and any pre-existing components should
          be distinguished in the agreed terms. Access to an API does not mean owning the
          provider’s software. The handover inventory should reflect those boundaries
          rather than promising that every dependency has somehow become the client’s
          property.
        </p>
      </section>

      <section>
        <h2>Write documentation around the next person’s tasks</h2>
        <p>
          Documentation is useful when it helps someone do something. “Architecture
          overview” is a reasonable heading, but the reader also needs to know how to run
          the application, make a safe change, release it, roll back and investigate a
          failed request. Organise the material around those tasks.
        </p>
        <p>
          A short map of the system helps: what triggers the workflow, where decisions
          happen, which services are called and where the outcome is recorded. Explain the
          surprising choices. If a queue exists to prevent duplicate supplier orders, say
          that. The next maintainer needs the reason before deciding that the queue looks
          unnecessarily complicated.
        </p>
        <p>
          Keep the instructions close to the code and update them when the process
          changes. Record the expected environment, required permissions and how to obtain
          test data. “Ask the developer for the configuration” is a dependency, not a
          setup step. Where access must come from a client administrator, name the role
          and the request clearly.
        </p>
      </section>

      <section>
        <h2>Separate operating from changing</h2>
        <p>
          The business owner should understand what the system does, how to tell whether
          it is working and what to do when it is not. That might mean recognising an
          overdue queue, pausing automated messages or switching back to the manual
          process. It should not require learning the entire codebase.
        </p>
        <p>
          A technical maintainer needs deeper information: how the data is structured, how
          to test a change, where permissions are enforced and what can safely be retried.
          Some settings can be exposed for the business to change; others should remain
          controlled because a casual edit could send the wrong message or alter who can
          access data.
        </p>
        <p>
          Being honest about that distinction is more useful than saying the client can
          “change anything themselves”. A restaurant owner may be perfectly capable of
          changing a delivery cutoff and have no reason to maintain database migrations.
          Good handover gives each person the tools for their role and makes it clear when
          specialist help is sensible.
        </p>
      </section>

      <section>
        <h2>Rehearse the handover</h2>
        <p>
          The strongest check is a second person following the instructions without the
          original developer filling in missing steps. Have them set up a test
          environment, run the relevant checks and make a small harmless change. If the
          process fails, fix the instructions or the system while the context is still
          available.
        </p>
        <p>
          Then rehearse an operational problem. What happens if the messaging provider is
          unavailable? How does someone find the affected requests? Which actions can be
          retried without duplicates? Where is the manual fallback? A staged failure
          reveals more than a tour of dashboards while everything is green.
        </p>
        <p>
          Backups deserve a rehearsal too. Being told that backups run is different from
          knowing how a restore works, who can authorise it and what recent data might be
          missing. Agree a suitable test with the technical owner. The point is not to
          create drama; it is to discover missing permissions and assumptions when there
          is time to correct them.
        </p>
      </section>

      <section>
        <h2>Leave an honest maintenance picture</h2>
        <p>
          Every system has unfinished edges. List known limitations, the tasks that remain
          manual and the failure cases that need a person. A clear limitation is something
          the next maintainer can plan around. An undocumented limitation tends to appear
          as an urgent surprise.
        </p>
        <p>
          Also state what support continues after handover, if any. Who receives alerts?
          Who reviews provider changes? Who updates dependencies? Which changes are
          included in an ongoing arrangement and which require separate work? A successful
          transfer can include continued Acumei support, but that support should be an
          explicit service rather than the only way to keep an undocumented application
          alive.
        </p>
        <p>
          The final check is practical: the client can access the accounts, identify the
          deployed version, follow the operating instructions and bring in another
          engineer with a usable starting point. There may still be learning to do. There
          always is with unfamiliar software. What should be gone is the avoidable
          dependence on facts that only the original builder knows. That is what makes the
          source code worth handing over in the first place.
        </p>
      </section>
    </NoteLayout>
  );
}
