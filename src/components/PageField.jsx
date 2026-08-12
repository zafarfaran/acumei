import { useEffect } from 'react';
import useDither from '../hooks/useDither';
import useFieldInteraction from '../hooks/useFieldInteraction';
import { subscribeScroll } from '../lib/scrollLoop';

/**
 * The sticky field that occupies the empty right-hand column on a standalone
 * page. Same engine as the home page, same interactions — it resolves out of
 * static on arrival and the cursor opens a hole in it.
 *
 * It also reads scroll: progress through the page thickens the field via the
 * `k` parameter and drifts it slightly, so it is not simply looping in place
 * while you read.
 */
export default function PageField({ mode = 'ridge', ascii = false, color, gain = 1 }) {
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;

  const [ref, api] = useDither({
    mode,
    ascii,
    cell: ascii ? (small ? 6 : 7) : 3,
    dot: 1.4,
    color: color || 'rgba(241,237,228,.44)',
    gain,
    params: { boot: 0, lens: small ? 0 : 0.85, px: 9, py: 9, k: 0 },
  });

  const { reduce } = useFieldInteraction(ref, api);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (small || reduce) return;
    return subscribeScroll((y, vh) => {
      const travel = Math.max(1, document.body.scrollHeight - vh);
      const p = Math.min(1, y / travel);
      api.current?.set('k', p);
      el.style.transform = `translate3d(0,${(p - 0.5) * -28}px,0)`;
    });
  }, [small, reduce, ref, api]);

  return (
    <aside className="page-rail" aria-hidden="true">
      <canvas className="page-field" ref={ref} />
    </aside>
  );
}
