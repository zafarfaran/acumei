import { useEffect } from 'react';

const SELECTOR = '[data-reveal],.swipe,[data-line]';

/**
 * One observer for every reveal on the page. Elements are unobserved once they
 * have fired — reveals play a single time. Mounted once, from App.
 */
export default function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
