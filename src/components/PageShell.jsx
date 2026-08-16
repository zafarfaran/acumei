import { useEffect } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import PageField from './PageField';
import useReveal from '../hooks/useReveal';

/**
 * The chrome every standalone page shares: nav, a section-head/title block in
 * the same idiom as the home page's sections, the content, and the footer.
 *
 * `n` is the mono index shown beside the label, keeping the numbering habit of
 * the home page without pretending these pages are part of its sequence.
 */
export default function PageShell({ n, label, title, lede, meta, field, children }) {
  useReveal();

  useEffect(() => {
    document.title = `${typeof title === 'string' ? title : label} — Acumei`;
    return () => { document.title = 'Acumei — AI agents for British companies'; };
  }, [title, label]);

  return (
    <>
      <Nav />
      <main>
        <section className="page">
          <div className="page-main">
            <div className="shead" data-reveal>
              <span className="mono">{n}</span>
              <span className="mono">{label}</span>
            </div>

            <div className="page-head">
              <h1 className="swipe" data-reveal>{title}</h1>
              {lede && <p className="lede" data-reveal style={{ '--d': '120ms' }}>{lede}</p>}
              {meta && <p className="page-meta mono" data-reveal style={{ '--d': '180ms' }}>{meta}</p>}
            </div>

            <div className="prose">{children}</div>
          </div>

          <PageField {...field} />
        </section>
      </main>
      <Footer />
    </>
  );
}
