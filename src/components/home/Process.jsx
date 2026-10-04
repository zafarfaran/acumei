const STEPS = [
  ['01', 'MAP', 'Two weeks inside your company to find where AI pays back, ranked by value and risk.'],
  ['02', 'PROTOTYPE', 'A working system on your real data, measured against an eval set we agree up front.'],
  ['03', 'SHIP', 'Production: integration, guardrails, monitoring and cost controls.'],
  ['04', 'HAND OVER', 'Your team owns it. Docs, runbooks, training, and us on call while it beds in.'],
];

export default function Process() {
  return (
    <section id="process" data-scene="process">
      <div className="stk col" data-sticky>
        <div className="kick mono">HOW AN ENGAGEMENT RUNS</div>
        <div className="ro" data-ro data-anchor="machine">STAGE <b>01</b> / 04 · MAP</div>
        <ul className="steps" data-steps>
          {STEPS.map(([n, name]) => (
            <li key={n}><div className="h"><span>{n}</span>{name}</div></li>
          ))}
        </ul>
        <div className="sd" data-sd>
          {STEPS.map(([n, , body]) => <p key={n}>{body}</p>)}
        </div>
      </div>
    </section>
  );
}
