import { useState, useEffect, useRef } from 'react';
import useDither from '../hooks/useDither';
import useParallax from '../hooks/useParallax';

const gbp = (n) => '£' + Math.round(n).toLocaleString('en-GB');

const FIELDS = [
  { key: 'hours', label: 'Hours/week on manual work (per person)', min: 2, max: 40, step: 1, format: (v) => `${v} hrs` },
  { key: 'rate', label: 'Hourly value of that time', min: 10, max: 250, step: 5, format: (v) => `£${v}` },
  { key: 'people', label: 'People doing this work', min: 1, max: 50, step: 1, format: (v) => `${v}` },
  { key: 'cost', label: 'One-off build investment', min: 1000, max: 100000, step: 500, format: gbp },
];

const TWEEN_MS = 520;

export default function ROICalculator() {
  const [inputs, setInputs] = useState({ hours: 12, rate: 35, people: 3, cost: 2500 });
  const [out, setOut] = useState({ annual: 0, hours: 0, payback: 0 });
  const [started, setStarted] = useState(false);

  const sectionRef = useRef(null);
  const from = useRef({ annual: 0, hours: 0, payback: 0 });
  const raf = useRef(0);

  const [flowRef, flow] = useDither({
    mode: 'flow',
    cell: 3,
    dot: 1.4,
    color: 'rgba(232,160,75,.6)',
  });
  const parRef = useParallax(0.05, 0.6);

  // the first computation fires when the section scrolls into view, not on mount
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setStarted(true);
      io.disconnect();
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const { hours, rate, people, cost } = inputs;
    const hoursSaved = hours * people * 0.75;
    const weekly = hoursSaved * rate;
    const annual = weekly * 50;
    const payback = Math.max(0.5, cost / Math.max(weekly, 1));

    flow.current?.set('k', Math.min(1, annual / 600000));

    // ease from the previous value, not from zero
    const start = from.current;
    const target = { annual, hours: hoursSaved, payback };
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / TWEEN_MS);
      const e = 1 - Math.pow(1 - p, 3);
      const v = {
        annual: start.annual + (target.annual - start.annual) * e,
        hours: start.hours + (target.hours - start.hours) * e,
        payback: start.payback + (target.payback - start.payback) * e,
      };
      from.current = v;
      setOut(v);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [inputs, started, flow]);

  return (
    <section id="calc" ref={sectionRef}>
      <div className="shead" data-reveal>
        <span className="mono">03</span>
        <span className="mono">Calculator</span>
      </div>

      <h2 className="swipe" data-reveal>
        What is manual work <span className="amb">actually costing you?</span>
      </h2>

      <div className="calc">
        <div className="inputs" data-reveal style={{ '--d': '140ms' }}>
          {FIELDS.map((f) => (
            <div className="field" key={f.key}>
              <div className="top">
                <label className="lb" htmlFor={`i-${f.key}`}>{f.label}</label>
                <span className="vl num">{f.format(inputs[f.key])}</span>
              </div>
              <input
                id={`i-${f.key}`}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={inputs[f.key]}
                onChange={(e) => setInputs((s) => ({ ...s, [f.key]: +e.target.value }))}
              />
            </div>
          ))}
          <p className="assume">
            Drag the sliders. We assume automation captures 75% of the hours described.
          </p>
        </div>

        <div className="readout" data-reveal style={{ '--d': '220ms' }}>
          <div>
            <div className="mono" style={{ marginBottom: 14 }}>Annual savings</div>
            <div className="headline-num">{gbp(out.annual)}</div>
          </div>

          <canvas
            className="flow"
            ref={(el) => { flowRef.current = el; parRef.current = el; }}
            aria-hidden="true"
          />

          <div className="pair">
            <div>
              <div className="mono">Hours saved / wk</div>
              <div className="v">{out.hours.toFixed(1)}</div>
            </div>
            <div>
              <div className="mono">Payback</div>
              <div className="v">
                {out.payback < 4
                  ? `${out.payback.toFixed(1)} wks`
                  : `${(out.payback / 4.33).toFixed(1)} mos`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
