import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BookCall from '../components/BookCall';
import BuildScene from '../components/premo/BuildScene';
import { STATIC } from '../lib/motion';
import '../styles/case-study-premo.css';

const FIGURES = [
  [1982, 'Automated tests, so far'],
  [0, 'Cross-tenant data leaks, tested'],
  [47, 'Tenant-isolated tables'],
];

// Counts each figure up once, the first time the strip enters the viewport.
function useCountUp(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || STATIC || typeof IntersectionObserver !== 'function') return undefined;
    const nums = [...root.querySelectorAll('[data-n]')];
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1500), ease = 1 - Math.pow(1 - k, 3);
        nums.forEach((el) => { el.textContent = Math.round(+el.dataset.n * ease).toLocaleString('en-GB'); });
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    nums.forEach((el) => { el.textContent = '0'; });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref]);
}

export default function CaseStudyPremo() {
  const figs = useRef(null);
  useCountUp(figs);

  useEffect(() => {
    document.title = 'Case study · Premo AI Ltd — Acumei';
    return () => { document.title = 'Acumei — AI engineering lab'; };
  }, []);

  return (
    <div className={`asm asm-page premo${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <main>
        <BuildScene>
          <div className="titleblock mono">
            <div><span>CLIENT</span><b>Premo AI Ltd</b></div>
            <div className="tb-label"><span>STATUS</span><b><i className="dot" /> Ongoing engagement · two months in</b></div>
            <div><span>REV</span><b>A</b></div>
          </div>
          <h1>Scoped AI agents for <span className="amb">a real feedback platform.</span></h1>
          <p className="lede">
            For Premo we’re building an AI agent that analyses each business’s feedback and a WhatsApp agent owners can talk to, on a platform where every agent only ever sees one business’s data.
          </p>
          <div className="pm-scroll mono">SCROLL TO ASSEMBLE ↓</div>
        </BuildScene>

        <section className="pm-figs-sec" aria-label="Current engineering figures" ref={figs}>
          <div className="pm-kick mono">FIG. 03 · CURRENT FIGURES</div>
          <dl className="pm-figs">
            {FIGURES.map(([v, l]) => (
              <div key={l}>
                <dd data-n={v}>{v.toLocaleString('en-GB')}</dd>
                <dt className="mono">{l}</dt>
              </div>
            ))}
          </dl>
          <p className="pm-note">
            Current figures reported by the project team. The zero refers to the tested
            tenant-isolation scenarios, not a guarantee against every possible failure.
            The test count describes the suite so far, not a claim that every test passes
            in every environment. The table count is the number of tenant-scoped tables
            currently carrying Row-Level Security policies.
          </p>
        </section>

        <section className="pm-close">
          <div className="pm-kick mono">NEXT</div>
          <h2>The engagement remains active because the platform is still being built.</h2>
          <BookCall className="btn">Book a 30-minute discovery call <span>→</span></BookCall>
        </section>
      </main>
      <Footer />
    </div>
  );
}
