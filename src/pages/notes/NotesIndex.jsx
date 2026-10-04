import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import BookCall from '../../components/BookCall';
import useDither from '../../hooks/useDither';
import { NOTES } from '../../lib/notes';
import '../../styles/pages/notes.css';

const MODES = ['flow', 'grid', 'ridge'];
const CATS = ['All', ...Array.from(new Set(NOTES.map((n) => n.category)))];

function Thumb({ mode }) {
  const [ref] = useDither({ mode, cell: 4, dot: 2, color: 'rgba(241,237,228,.78)', gain: mode === 'flow' ? 1.9 : 1.2 });
  return <canvas ref={ref} aria-hidden="true" />;
}

export default function NotesIndex() {
  const [cat, setCat] = useState('All');
  const total = String(NOTES.length).padStart(2, '0');

  return (
    <PageShell
      n="06"
      label="Notes"
      title={<>What we learn building these things, <span className="amb">written down.</span></>}
      lede="Engineering notes, working methods and the costs behind useful automation."
      part="data"
    >
      <div className="nx-filter mono" role="tablist" aria-label="Filter notes by category" data-reveal>
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            className={cat === c ? 'on' : ''}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="nx-list">
        {NOTES.map((note, i) => (
          <Link
            className="sheet nx-sheet"
            to={note.href}
            key={note.slug}
            hidden={cat !== 'All' && note.category !== cat}
            data-reveal
            style={{ '--d': `${i * 70}ms` }}
          >
            <i className="cr a" /><i className="cr b" />
            <div className="fr">
              <Thumb mode={MODES[i % MODES.length]} />
              <div className="ti">
                <h3>{note.title}</h3>
                <div className="tb mono">
                  <div>NOTE<b>{note.category}</b></div>
                  <div>SHEET<b>{String(i + 1).padStart(2, '0')} / {total}</b></div>
                  <div>READ<b>{note.mins} min</b></div>
                  <div>DATE<b>{note.date}</b></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="more">
        <BookCall>
          Want to talk about this? <span>→</span>
        </BookCall>
      </div>
    </PageShell>
  );
}
