import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Anchors within the home page still need to work when they are reached from
// another route (the footer's "Calculator" link, say). On a path change we go
// to the top; when a hash is present we scroll to it once the target exists.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const el = document.querySelector(hash);
    if (!el) return;
    // let the route's content lay out before measuring
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
