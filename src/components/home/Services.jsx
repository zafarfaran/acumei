const ITEMS = [
  { anchor: 'data', lbl: 'ASSEMBLY 01 · D-01 – D-04', no: '01 / DATA', title: 'Data and retrieval', body: 'Pipelines, embeddings and search over your documents, tickets and code, kept fresh and permissioned.' },
  { anchor: 'core', lbl: 'ASSEMBLY 02 · M-01 – M-04', no: '02 / MODELS', title: 'Model engineering', body: 'Evaluation suites, fine-tuning, distillation and routing, so you pay for the model the task actually needs.' },
  { anchor: 'agents', lbl: 'ASSEMBLY 03 · A-01 – A-04', no: '03 / AGENTS', title: 'Agents in production', body: 'Multi-step agents that do real work in your systems, with tool access, approvals and audit logs.' },
  { anchor: 'ops', lbl: 'ASSEMBLY 04 · P-01 · F-01 – F-02 · L-01', no: '04 / OPERATIONS', title: 'AI-native operations', body: 'Redesigning workflows around AI, not bolting a chatbot onto the old ones.' },
];

export default function Services() {
  return (
    <section id="services">
      <div className="svc-head col">
        <div className="kick mono land">WHAT WE ENGINEER</div>
        <h2 className="land">Four subsystems. One machine.</h2>
      </div>
      {ITEMS.map((s, i) => (
        <div className="sv col" data-scene={`svc${i}`} key={s.anchor}>
          <div className="lbl mono" data-anchor={s.anchor}><i />{s.lbl}</div>
          <span className="no">{s.no}</span>
          <h3 className="land">{s.title}</h3>
          <p className="t land">{s.body}</p>
        </div>
      ))}
    </section>
  );
}
