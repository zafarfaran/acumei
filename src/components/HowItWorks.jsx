const STEPS = [
  {
    day: 'Day 1',
    n: '01',
    title: 'Talk',
    copy: 'A 30-minute discovery call. Show us the workflow that hurts. We tell you whether AI can fix it — honestly.',
  },
  {
    day: 'Day 2',
    n: '02',
    title: 'Map',
    copy: 'Within 48 hours, a written brief: top three opportunities, rough scope, what we’d build first.',
  },
  {
    day: 'Days 3–10',
    n: '03',
    title: 'Build',
    copy: 'We write the code. Real integrations with your actual tools. You review as it comes together.',
  },
  {
    day: 'Day 14',
    n: '04',
    title: 'Hand over',
    copy: 'Live system. Your code, your prompts, your accounts. Optional retainer if you want us on call.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="shead" data-reveal>
        <span className="mono">02</span>
        <span className="mono">How we work</span>
      </div>

      <h2 className="swipe" data-reveal>
        From &ldquo;we have a problem&rdquo; to a quieter business — in a fortnight.
      </h2>

      <div className="steps4">
        {STEPS.map((s, i) => (
          <div key={s.n} data-reveal data-line style={{ '--d': `${i * 110}ms` }}>
            <span className="mono">{s.day}</span>
            <div className="big">{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
