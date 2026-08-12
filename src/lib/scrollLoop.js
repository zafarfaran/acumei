// One rAF-throttled scroll pass for the whole page. Everything that needs to
// react to scroll — the nav background, the progress bar, every parallax
// element — subscribes here rather than adding its own listener.

const subscribers = new Set();
let ticking = false;
let started = false;

function flush() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  for (const fn of subscribers) fn(y, vh);
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

export function subscribeScroll(fn) {
  subscribers.add(fn);
  if (!started) {
    started = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  fn(window.scrollY, window.innerHeight);
  return () => {
    subscribers.delete(fn);
  };
}
