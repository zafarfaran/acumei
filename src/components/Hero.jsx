import { useEffect } from 'react';
import useDither from '../hooks/useDither';
import { subscribeScroll } from '../lib/scrollLoop';
import LiveFeed from './LiveFeed';

const CAPABILITIES = [
  'Stops calls slipping',
  'Books appointments back in',
  'Chases late invoices',
  'Triages emergencies',
  'Writes the awkward emails',
  'Gives you your evenings back',
];

export default function Hero() {
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;
  const [brainRef, brain] = useDither({
    mode: 'brain',
    ascii: true,
    cell: small ? 7 : 8,          // cheaper grid on mobile
    color: 'rgba(241,237,228,.62)',
    gain: 1,
  });

  // the field reads pointer position — desktop only
  useEffect(() => {
    if (small) return;
    const onMove = (e) => {
      brain.current?.set('mx', (e.clientX / window.innerWidth) * 2 - 1);
      brain.current?.set('my', (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [small, brain]);

  // drifts down and scales up as the page scrolls away from it
  useEffect(() => {
    const el = brainRef.current;
    if (!el) return;
    if (small || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = 'translateY(-50%)';
      return;
    }
    return subscribeScroll((y) => {
      el.style.transform =
        `translate3d(0,calc(-50% + ${y * 0.07}px),0) scale(${1 + Math.min(y, 900) / 12000})`;
    });
  }, [small, brainRef]);

  // triggers the h1 lines in the first frame after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => document.body.classList.add('loaded'));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="hero" id="top">
      <canvas className="hero-brain" ref={brainRef} aria-hidden="true" />

      <div className="hero-inner">
        <div className="eyebrow" data-reveal>
          <span className="dot" />
          <span className="mono">AI for British businesses · London</span>
        </div>

        <h1>
          <span className="ln"><span style={{ '--d': '120ms' }}>The <span className="amb">AI Brain</span></span></span>
          <span className="ln"><span style={{ '--d': '220ms' }}>your business</span></span>
          <span className="ln"><span style={{ '--d': '320ms' }}>was promised.</span></span>
        </h1>

        <p className="lede" data-reveal style={{ '--d': '420ms' }}>
          A quietly brilliant <strong>AI assistant</strong> that picks up the phone at 4am, drafts
          the awkward follow-up, sorts tomorrow&rsquo;s diary and reorders stock before you notice
          it&rsquo;s low. Stop firefighting. Start running your business.
        </p>

        <div className="acts" data-reveal style={{ '--d': '500ms' }}>
          <a className="act" href="#book">Book a 30-minute discovery call <span>→</span></a>
          <a className="act" href="#industries">See live examples <span>→</span></a>
        </div>

        <div className="caps" data-reveal style={{ '--d': '580ms' }}>
          {CAPABILITIES.map((c) => <div key={c}>{c}</div>)}
        </div>

        <div className="ticker" data-reveal style={{ '--d': '660ms' }}>
          <LiveFeed />
        </div>
      </div>
    </section>
  );
}
