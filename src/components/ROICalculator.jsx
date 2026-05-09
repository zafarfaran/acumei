import { useState, useEffect } from 'react';
import useInView from '../hooks/useInView';
import SectionLabel from './SectionLabel';

function useCountUp(target, durationMs = 600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const to = Number(target) || 0;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

function Slider({ label, value, setValue, min, max, step, format }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: 15, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)', height: 4 }}
      />
    </div>
  );
}

export default function ROICalculator() {
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(35);
  const [employees, setEmployees] = useState(3);
  const [buildCost, setBuildCost] = useState(2500);

  const hoursSavedWeekly = hours * employees * 0.75;
  const weeklySavings = hoursSavedWeekly * rate;
  const annualSavings = weeklySavings * 50;
  const paybackWeeks = Math.max(0.5, buildCost / Math.max(weeklySavings, 1));

  const animatedAnnual = useCountUp(annualSavings);
  const animatedHours = useCountUp(hoursSavedWeekly);
  const animatedPayback = useCountUp(paybackWeeks);
  const [ref, inView] = useInView();

  return (
    <section className="roi-section" style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="06" label="Calculator" />
      <div
        ref={ref}
        className={`roi-grid animate-in${inView ? ' in-view' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 64,
          alignItems: 'start',
        }}
      >
        <div className="roi-left" style={{ position: 'sticky', top: 100 }}>
          <h2 className="display roi-title" style={{
            fontSize: 60,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
          }}>
            What is manual work{' '}
            <span className="display-ital" style={{ color: 'var(--accent)' }}>actually costing you?</span>
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
            marginTop: 24,
            maxWidth: 420,
          }}>
            Drag the sliders. We assume automation captures 75% of the hours described.
          </p>
        </div>

        <div className="roi-card" style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: 32,
          borderRadius: 4,
        }}>
          <div className="roi-inner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--muted)',
                marginBottom: 18,
                textTransform: 'uppercase',
              }}>
                Inputs
              </div>
              <Slider
                label="Hours/week on manual work (per person)"
                value={hours}
                setValue={setHours}
                min={2}
                max={40}
                step={1}
                format={(v) => `${v} hrs`}
              />
              <Slider
                label="Hourly value of that time"
                value={rate}
                setValue={setRate}
                min={10}
                max={250}
                step={5}
                format={(v) => `\u00a3${v}`}
              />
              <Slider
                label="People doing this work"
                value={employees}
                setValue={setEmployees}
                min={1}
                max={50}
                step={1}
                format={(v) => `${v}`}
              />
              <Slider
                label="One-off build investment"
                value={buildCost}
                setValue={setBuildCost}
                min={1000}
                max={100000}
                step={500}
                format={(v) => `\u00a3${v.toLocaleString()}`}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--muted)',
                marginBottom: 18,
                textTransform: 'uppercase',
              }}>
                Result
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Annual savings</div>
                  <div style={{
                    fontSize: 52,
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}>
                    £{Math.round(animatedAnnual).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Hours saved/wk</div>
                    <div style={{ fontSize: 24, fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
                      {animatedHours.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Payback</div>
                    <div style={{ fontSize: 24, fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
                      {animatedPayback < 4
                        ? `${animatedPayback.toFixed(1)} wks`
                        : `${(animatedPayback / 4.33).toFixed(1)} mos`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
