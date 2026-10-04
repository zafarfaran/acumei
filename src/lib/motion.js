// One rAF loop for the whole page. Everything that animates (the home stage,
// PartDrawing canvases, reveal text) subscribes here instead of running its own.
//
// ?motion=off or prefers-reduced-motion: every scene shows its finished state.
// In that mode the loop does not run continuously; subscribers are called once
// after subscribing and again whenever invalidate() is called (resize).
// ?y=N: callers use initialScrollY() to jump instantly and snap eased values.

const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();

export const STATIC = reduced || params.get('motion') === 'off';

export function initialScrollY() {
  const v = params.get('y');
  return v == null || v === '' ? null : Number(v) || 0;
}

const subs = new Set();
let raf = 0;
let pending = false;
const t0 = typeof performance !== 'undefined' ? performance.now() : 0;

function tick(now) {
  raf = 0; pending = false;
  const t = (now - t0) / 1000;
  for (const fn of subs) fn(t);
  if (!STATIC && subs.size) raf = requestAnimationFrame(tick);
}

function schedule() {
  if (raf || pending) return;
  pending = true;
  raf = requestAnimationFrame(tick);
}

export function onFrame(fn) {
  subs.add(fn);
  schedule();
  return () => { subs.delete(fn); if (!subs.size && raf) { cancelAnimationFrame(raf); raf = 0; pending = false; } };
}

// Static mode only: ask for one more pass (after a resize, say).
export function invalidate() { if (STATIC) { if (raf) cancelAnimationFrame(raf); raf = 0; pending = false; schedule(); } }
