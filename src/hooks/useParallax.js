import { useRef, useEffect } from 'react';
import { subscribeScroll } from '../lib/scrollLoop';

/**
 * Drifts an element against the scroll and fades it toward the edges of the
 * viewport. `k` is the drift coefficient — .04 tile, .05 flow, .06 ridge.
 *
 * Disabled entirely below 900px and under prefers-reduced-motion. That is
 * deliberate: on a phone the drift reads as the element being detached from
 * the page rather than as depth.
 */
export default function useParallax(k, baseOpacity = 1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const off = matchMedia('(max-width:900px)').matches
      || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (off) return;

    // only elements near the viewport are worth computing
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { rootMargin: '20% 0px' }
    );
    io.observe(el);

    const unsubscribe = subscribeScroll((y, vh) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0,${(-p * k * 100).toFixed(1)}px,0)`;
      el.style.opacity = (baseOpacity * (1 - Math.min(0.5, Math.abs(p) * 0.5))).toFixed(2);
    });

    return () => {
      io.disconnect();
      unsubscribe();
      el.style.transform = '';
      el.style.opacity = '';
    };
  }, [k, baseOpacity]);

  return ref;
}
