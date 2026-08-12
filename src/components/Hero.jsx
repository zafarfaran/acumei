import { useEffect } from 'react';
import useDither from '../hooks/useDither';
import { subscribeScroll } from '../lib/scrollLoop';
import LiveFeed from './LiveFeed';

// where the brain sits horizontally within the full-bleed field, matching the
// 72% centre of the mask
const FOCUS = 0.72;

const BOOT_MS = 1500;

export default function Hero() {
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [brainRef, brain] = useDither({
    mode: 'brain',
    ascii: true,
    cell: small ? 7 : 8,          // cheaper grid on mobile
    color: 'rgba(241,237,228,.62)',
    gain: 1,
    params: { boot: 0, lens: small ? 0 : 0.9, px: 9, py: 9 },
  });

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

  // boot resolve — the field starts as static and resolves into the brain as
  // the headline lines rise
  useEffect(() => {
    if (reduce) {
      brain.current?.set('boot', 1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / BOOT_MS);
      brain.current?.set('boot', 1 - Math.pow(1 - p, 2.2));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce, brain]);

  // the pointer rotates the brain's light and opens a soft hole in the field
  useEffect(() => {
    if (small) return;
    const el = brainRef.current;
    if (!el) return;

    const onMove = (e) => {
      const api = brain.current;
      if (!api) return;
      api.set('mx', (e.clientX / window.innerWidth) * 2 - 1);
      api.set('my', (e.clientY / window.innerHeight) * 2 - 1);

      const r = el.getBoundingClientRect();
      // park the lens off-field once the pointer leaves the hero
      if (e.clientY > r.bottom || e.clientY < r.top) {
        api.set('px', 9);
        api.set('py', 9);
        return;
      }
      // pointer position in field space: same aspect scaling as the render
      // loop, then shifted by the offset that placed the shape
      const ar = r.width / r.height;
      const scale = ar > 1 ? ar : 1;
      api.set('px', (((e.clientX - r.left) / r.width) * 2 - 1) * scale - (FOCUS * 2 - 1) * scale);
      api.set('py', ((e.clientY - r.top) / r.height) * 2 - 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
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
