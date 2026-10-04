export default function Problem() {
  return (
    <section id="problem">
      <div className="pb col" data-scene="p1">
        <div className="lbl mono" data-anchor="demo"><i />FIG. 02 · DEMO · UNCONNECTED</div>
        <h2 className="land">Most companies have AI demos. Few have AI in production.</h2>
      </div>
      <div className="pb col" data-scene="p2">
        <div className="lbl mono" data-anchor="ghost"><i />MISSING PARTS · 04 SUBSYSTEMS</div>
        <p className="big2 land">
          The gap isn&rsquo;t the model. It&rsquo;s <em>engineering</em>: data, evals, guardrails,
          integration, and someone accountable when it breaks.
        </p>
      </div>
    </section>
  );
}
