import { useEffect, useState } from 'react';
import useDither from '../hooks/useDither';
import useFieldInteraction from '../hooks/useFieldInteraction';
import { subscribeScroll } from '../lib/scrollLoop';
import LiveFeed from './LiveFeed';

// where the shape sits horizontally within the full-bleed field, matching the
// 72% centre of the mask
const FOCUS = 0.72;

// The headline is one sentence with a rotating relative clause: "The AI agents
// your business ___". Each has to complete that grammatically and fit the 15ch
// headline measure, or the line wraps and the hero changes height.
const CLAUSES = ['was promised.', 'keeps missing.', 'can’t hire.'];
const CLAUSE_MS = 3800;
const ROLL_MS = 760;   // must outlast the clause roll in animations.css

export default function Hero() {
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;

  const [brainRef, brain] = useDither({
    mode: 'brain',
    ascii: true,
    cell: small ? 9 : 8,          // coarser, and so cheaper, on mobile
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

  // The outgoing clause is kept alongside the incoming one for the length of
  // the roll, so both halves of the move are visible inside the clip box.
  // `n` only ever increases — it keys the pair so the animation replays.
  const [clause, setClause] = useState({ cur: 0, prev: null, n: 0 });

  useEffect(() => {
    if (reduce) return;
    let drop = 0;
    const id = setInterval(() => {
      if (document.hidden) return;
      setClause((c) => ({ cur: (c.cur + 1) % CLAUSES.length, prev: c.cur, n: c.n + 1 }));
      // Drop the outgoing copy as soon as its roll ends. Left in place it would
      // sit in the DOM until the next rotation, and the h1 would read as two
      // clauses at once to a screen reader.
      clearTimeout(drop);
      drop = setTimeout(() => setClause((c) => ({ ...c, prev: null })), ROLL_MS);
    }, CLAUSE_MS);
    return () => { clearInterval(id); clearTimeout(drop); };
  }, [reduce]);

  return (
    <section className="hero" id="top">
      <canvas className="hero-brain" ref={brainRef} aria-hidden="true" />

      <div className="hero-inner">
        <div className="eyebrow" data-reveal>
          <span className="dot" />
          <span className="mono">AI agents for British companies · London</span>
        </div>

        <h1>
          <span className="ln"><span style={{ '--d': '120ms' }}>The <span className="amb">AI agents</span></span></span>
          <span className="ln"><span style={{ '--d': '220ms' }}>your business</span></span>
          <span className="ln rot">
            {clause.prev !== null && (
              <span key={`out${clause.n}`} className="roll-out" aria-hidden="true">
                {CLAUSES[clause.prev]}
              </span>
            )}
            <span
              key={`in${clause.n}`}
              className="roll-in"
              style={{ '--d': clause.n === 0 ? '320ms' : '90ms' }}
            >
              {CLAUSES[clause.cur]}
            </span>
          </span>
        </h1>

        <p className="lede" data-reveal style={{ '--d': '420ms' }}>
          <strong>AI agents</strong> that do a real job in your business &mdash; picking up the 3am
          problem and sorting it, writing the follow-up nobody wants to write, keeping
          tomorrow&rsquo;s schedule honest and reordering stock before anyone notices it&rsquo;s low.
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
