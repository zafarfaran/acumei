import useDither from '../hooks/useDither';
import useParallax from '../hooks/useParallax';
import { EMAIL, MAILTO } from '../lib/site';

export default function Book() {
  // dark-on-light: this field sits on the inverted section
  const [ridgeRef] = useDither({
    mode: 'ridge',
    cell: 4,
    dot: 1.5,
    color: 'rgba(10,10,11,.34)',
    gain: 0.9,
  });
  const parRef = useParallax(0.06, 0.38);

  return (
    <section className="book" id="book">
      <div className="shead" data-reveal>
        <span className="mono">06</span>
        <span className="mono">Start</span>
      </div>

      <div className="bgrid">
        <div>
          <h2 className="swipe" data-reveal>
            Thirty minutes.<br />Honest answer.<br /><span className="amb">No pitch.</span>
          </h2>

          <p className="sub" data-reveal style={{ '--d': '140ms' }}>
            Bring the workflow that costs you the most time. We&rsquo;ll tell you if AI can fix
            it — and if it&rsquo;s not worth doing, we say so.
          </p>

          <div style={{ marginTop: 38 }} data-reveal>
            <a className="act" href={`${MAILTO}?subject=Discovery%20call`}>
              Book a 30-minute discovery call <span>→</span>
            </a>
          </div>
        </div>

        <div className="contact" data-reveal style={{ '--d': '240ms' }}>
          <div className="mono" style={{ marginBottom: 14 }}>Or reach out directly</div>
          <div className="e">
            <a href={MAILTO}>{EMAIL}</a>
          </div>
          <div className="a">We reply within one working day.</div>
        </div>
      </div>

      <canvas
        className="ridge"
        ref={(el) => { ridgeRef.current = el; parRef.current = el; }}
        aria-hidden="true"
      />
    </section>
  );
}
