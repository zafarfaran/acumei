import { useEffect } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import PartDrawing from './PartDrawing';
import { partForField } from '../lib/assembly/machine';
import useReveal from '../hooks/useReveal';
import { STATIC } from '../lib/motion';

/**
 * The chrome every standalone page shares: header, a drawing-sheet title block,
 * a prose column on the left, a sticky PartDrawing on the right (a short band
 * at the top on phones) and the footer.
 *
 * `n` is the mono sheet index shown in the title block. `part` picks which
 * subassembly the drawing shows ('data' | 'models' | 'agents' | 'operations' |
 * 'machine' | 'lamp'); if it is omitted the old `field` prop chooses a default.
 */
export default function PageShell({ n, label, title, lede, meta, field, part, children }) {
  useReveal();

  useEffect(() => {
    document.title = `${typeof title === 'string' ? title : label} — Acumei`;
    return () => { document.title = 'Acumei — AI engineering lab'; };
  }, [title, label]);

  const which = part || partForField(field);

  return (
    <div className={`asm asm-page${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <main>
        <section className="page">
          <div className="page-main">
            <div className="titleblock mono" data-reveal>
              <div><span>SHEET</span><b>{n}</b></div>
              <div className="tb-label"><span>SUBJECT</span><b>{label}</b></div>
              <div><span>REV</span><b>A</b></div>
            </div>

            <div className="page-head">
              <h1 className="swipe" data-reveal>{title}</h1>
              {lede && <p className="lede" data-reveal style={{ '--d': '120ms' }}>{lede}</p>}
              {meta && <p className="page-meta mono" data-reveal style={{ '--d': '180ms' }}>{meta}</p>}
            </div>

            <div className="prose">{children}</div>
          </div>

          <PartDrawing part={which} n={n} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
