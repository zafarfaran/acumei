import { useEffect } from 'react';

/**
 * The two things that make a dither field feel alive rather than decorative:
 * it resolves out of static when it first appears, and it reacts to the
 * pointer. Shared by the hero and by the sticky field on the standalone pages.
 *
 * `focus` is the same offset passed to params.ox — pointer coordinates have to
 * be shifted by it to land in the field's coordinate space, or the lens tracks
 * at a visible offset from the cursor.
 */
export default function useFieldInteraction(ref, api, options = {}) {
  const { focus = 0, lens = true, light = true, bootMs = 1500 } = options;

  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // resolve the field out of hashed noise
  useEffect(() => {
    if (reduce) {
      api.current?.set('boot', 1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / bootMs);
      api.current?.set('boot', 1 - Math.pow(1 - p, 2.2));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce, bootMs, api]);

  // rotate the light with the pointer, and open a hole in the field under it
  useEffect(() => {
    if (small || (!lens && !light)) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const a = api.current;
      if (!a) return;

      if (light) {
        a.set('mx', (e.clientX / window.innerWidth) * 2 - 1);
        a.set('my', (e.clientY / window.innerHeight) * 2 - 1);
      }
      if (!lens) return;

      const r = el.getBoundingClientRect();
      // park the lens off-field when the pointer is not over the canvas
      if (e.clientY > r.bottom || e.clientY < r.top || e.clientX > r.right || e.clientX < r.left) {
        a.set('px', 9);
        a.set('py', 9);
        return;
      }
      const ar = r.width / r.height;
      const scale = ar > 1 ? ar : 1;
      a.set('px', (((e.clientX - r.left) / r.width) * 2 - 1) * scale - focus * scale);
      a.set('py', ((e.clientY - r.top) / r.height) * 2 - 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [small, lens, light, focus, ref, api]);

  return { small, reduce };
}
