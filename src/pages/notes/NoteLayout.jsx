import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import BookCall from '../../components/BookCall';
import { NOTES } from '../../lib/notes';
import { onFrame, STATIC } from '../../lib/motion';
import '../../styles/pages/notes.css';

// Thin reading-progress hairline under the header. Hidden in static mode.
function Progress() {
  const ref = useRef(null);
  useEffect(() => {
    if (STATIC) return undefined;
    return onFrame(() => {
      const el = ref.current;
      if (!el) return;
      const body = document.querySelector('.note-body');
      if (!body) return;
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.3 - r.top) / Math.max(1, total)));
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    });
  }, []);
  return <div className="note-progress" aria-hidden="true"><i ref={ref} /></div>;
}

/**
 * Long-form reading layout for one note: PageShell title block + part drawing,
 * numbered section headings, a progress hairline and a "next note" sheet.
 */
export default function NoteLayout({ slug, part, title, lede, children }) {
  const idx = NOTES.findIndex((n) => n.slug === slug);
  const note = NOTES[idx];
  const next = NOTES[(idx + 1) % NOTES.length];
  const nextNo = String(((idx + 1) % NOTES.length) + 1).padStart(2, '0');

  return (
    <PageShell
      n={String(idx + 1).padStart(2, '0')}
      label={`Notes · ${note.category}`}
      title={title}
      lede={lede}
      meta={`${note.category} · ${note.date} · ${note.mins} min read`}
      part={part}
    >
      <Progress />
      <div className="note-body">{children}</div>

      <Link className="sheet note-next" to={next.href}>
        <i className="cr a" /><i className="cr b" />
        <div className="fr">
          <div className="ti">
            <div className="mono note-next-k">NEXT NOTE</div>
            <h3>{next.title}</h3>
            <div className="tb mono">
              <div>NOTE<b>{next.category}</b></div>
              <div>SHEET<b>{nextNo} / {String(NOTES.length).padStart(2, '0')}</b></div>
              <div>READ<b>{next.mins} min</b></div>
              <div>DATE<b>{next.date}</b></div>
            </div>
          </div>
        </div>
      </Link>

      <div className="more note-more">
        <BookCall>
          Want to talk about this? <span>→</span>
        </BookCall>
        <Link className="lnk" to="/notes">All notes</Link>
      </div>
    </PageShell>
  );
}
