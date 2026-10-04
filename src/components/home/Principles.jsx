const ROWS = [
  ['01', 'core', 'Evals before demos'],
  ['02', 'data', 'Your data stays yours'],
  ['03', 'ops', 'Measured in production, not in slides'],
  ['04', 'agents', 'Boring infrastructure, sharp models'],
];

export default function Principles() {
  return (
    <section id="principles" data-scene="principles">
      <div className="stk col" data-sticky>
        <div className="kick mono">HOW WE BUILD</div>
        <h2 className="land">Specification.</h2>
        <div className="spec">
          {ROWS.map(([n, anchor, text]) => (
            <div className="row" data-row data-anchor={anchor} key={n}>
              <div className="k"><u />SPEC · {n}</div>
              <div className="v">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
