import { useEffect } from 'react';
import useDither from '../hooks/useDither';
import useFieldInteraction from '../hooks/useFieldInteraction';
import { subscribeScroll } from '../lib/scrollLoop';
import LiveFeed from './LiveFeed';

// where the brain sits horizontally within the full-bleed field, matching the
// 72% centre of the mask
const FOCUS = 0.72;

export default function Hero() {
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;

  const [brainRef, brain] = useDither({
    mode: 'brain',
    ascii: true,
    cell: small ? 7 : 8,          // cheaper grid on mobile
    color: 'rgba(241,237,228,.62)',
    gain: 1,
    params: { boot: 0, lens: small ? 0 : 0.9, px: 9, py: 9 },
  });

  // boot resolve, cursor lens and light tracking
  const { reduce } = useFieldInteraction(brainRef, brain, { focus: FOCUS * 2 - 1 });

  // The canvas spans the whole hero, so the shape is placed by offsetting the
  // field rather than by positioning the element. Recomputed on resize because
  // it depends on the aspect ratio.
  useEffect(() => {
    const el = brainRef.current;
    if (!el) return;
    const setOffset = () => {
      const r = el.getBoundingClientRect();
      const ar = r.width / r.height;
      brain.current?.set('ox', small ? 0 : (FOCUS * 2 - 1) * (ar > 1 ? ar : 1));
    };
    setOffset();
    window.addEventListener('resize', setOffset);
    return () => window.removeEventListener('resize', setOffset);
  }, [small, brainRef, brain]);

  // the whole layer drifts as the page scrolls away from it
  useEffect(() => {
    const el = brainRef.current;
    if (!el) return;
    if (small || reduce) return;
    el.style.transform = 'translate3d(0,0,0)';
    return subscribeScroll((y) => {
      el.style.transform = `translate3d(0,${y * 0.06}px,0)`;
    });
  }, [small, reduce, brainRef]);

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
          it&rsquo;s low.
        </p>

        <div className="acts" data-reveal style={{ '--d': '500ms' }}>
          <a className="act" href="#book">Book a 30-minute discovery call <span>→</span></a>
          <a className="act" href="#industries">See live examples <span>→</span></a>
        </div>

        <div className="ticker" data-reveal style={{ '--d': '600ms' }}>
          <LiveFeed />
        </div>
      </div>
    </section>
  );
}
