import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BookCall from '../components/BookCall';
import useReveal from '../hooks/useReveal';
import { STATIC } from '../lib/motion';
import '../styles/pages/legal.css';

// Isometric projection helpers for the "missing part" drawing.
const S = 31, CX = 165, CY = 105;
const pt = (x, y, z) => [CX + (x - y) * 0.866 * S, CY + (x + y) * 0.5 * S - z * S];
const P = (arr) => arr.map((p) => p.join(',')).join(' ');

function Box({ x, y, z = 0, w = 2, d = 2, h = 2, ghost }) {
  const top = [pt(x, y, z + h), pt(x + w, y, z + h), pt(x + w, y + d, z + h), pt(x, y + d, z + h)];
  const left = [pt(x, y + d, z + h), pt(x + w, y + d, z + h), pt(x + w, y + d, z), pt(x, y + d, z)];
  const right = [pt(x + w, y, z + h), pt(x + w, y + d, z + h), pt(x + w, y + d, z), pt(x + w, y, z)];
  return (
    <g className={ghost ? 'nf-ghost' : 'nf-solid'}>
      <polygon points={P(left)} className="nf-l" />
      <polygon points={P(right)} className="nf-r" />
      <polygon points={P(top)} className="nf-t" />
    </g>
  );
}

function MissingPart() {
  // Three parts in a row, a fourth missing: only its dashed outline remains.
  const m = (x, y, z) => pt(x, y, z);
  const d1 = m(7.8, -0.8, 0), d2 = m(9.8, -0.8, 0);
  const t1 = m(7.8, -0.4, 0), t2 = m(7.8, -1.2, 0), t3 = m(9.8, -0.4, 0), t4 = m(9.8, -1.2, 0);
  const dot = m(8.8, 1.5, 2.4), up = m(8.8, 1.5, 4.6);
  return (
    <svg className="nf-svg" viewBox="0 0 540 360" role="img" aria-label="Isometric drawing with one part missing from its outline">
      <defs>
        <pattern id="nf-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(241,237,228,.22)" strokeWidth="1" />
        </pattern>
      </defs>
      <polygon className="nf-plate" points={P([m(-1, -1, 0), m(11, -1, 0), m(11, 4, 0), m(-1, 4, 0)])} />
      <Box x={0} y={0} h={2} w={2} d={3} />
      <Box x={2.6} y={0} h={3} w={2} d={3} />
      <Box x={5.2} y={0} h={1.4} w={2} d={3} />
      <Box x={7.8} y={0} h={2.4} w={2} d={3} ghost />
      <g className="nf-dim">
        <line x1={d1[0]} y1={d1[1]} x2={d2[0]} y2={d2[1]} />
        <line x1={t1[0]} y1={t1[1]} x2={t2[0]} y2={t2[1]} />
        <line x1={t3[0]} y1={t3[1]} x2={t4[0]} y2={t4[1]} />
        <polyline points={P([dot, up, [up[0] + 40, up[1]]])} />
        <circle cx={dot[0]} cy={dot[1]} r="2.5" />
        <text x={up[0] + 46} y={up[1] + 4} className="nf-t1">P-404</text>
        <text x={m(8.8, -1.9, 0)[0]} y={m(8.8, -1.9, 0)[1]} className="nf-t2" textAnchor="middle">NOT FOUND</text>
      </g>
    </svg>
  );
}

export default function NotFound() {
  useReveal();
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = 'Not found — Acumei';
    return () => { document.title = 'Acumei — AI engineering lab'; };
  }, []);

  return (
    <div className={`asm asm-page${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <main>
        <section className="nf">
          <div className="nf-main">
            <div className="titleblock mono" data-reveal>
              <div><span>SHEET</span><b>404</b></div>
              <div className="tb-label"><span>SUBJECT</span><b>Not found</b></div>
              <div><span>REV</span><b>A</b></div>
            </div>

            <div className="nf-num" aria-hidden="true" data-reveal>
              <div className="nf-dimline mono"><i /><span>REQUESTED SHEET</span><i /></div>
              <div className="nf-404">404</div>
              <div className="nf-vdim mono"><span>HTTP</span></div>
            </div>

            <h1 data-reveal style={{ '--d': '100ms' }}>This part isn&rsquo;t <span className="amb">in the drawing.</span></h1>
            <p className="lede" data-reveal style={{ '--d': '160ms' }}>
              Either it moved or the link was wrong. Neither is your problem to solve.
            </p>
            <p className="nf-path mono" data-reveal style={{ '--d': '200ms' }}>
              <span>REF</span> {pathname}
            </p>

            <div className="nf-links" data-reveal style={{ '--d': '240ms' }}>
              <Link className="btn" to="/">Back to the home page</Link>
              <Link className="btn-o" to="/notes">Read the notes</Link>
              <BookCall className="btn-o">Book a call</BookCall>
            </div>
          </div>

          <div className="nf-fig" aria-hidden="true">
            <div className="nf-frame">
              <MissingPart />
              <div className="nf-tb mono">
                <div>DWG <b>W4-404</b></div>
                <div>FIG. <b>MISSING PART</b></div>
                <div>STATUS <b>NOT IN DRAWING</b></div>
                <div>SHEET <b>404</b></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
