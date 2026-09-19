import { Link } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import BookCall from '../../components/BookCall';
import { NOTES } from '../../lib/notes';

export default function NotesIndex() {
  return (
    <PageShell
      n="06"
      label="Notes"
      title={<>What we learn building these things, <span className="amb">written down.</span></>}
      lede="Engineering notes, working methods and the costs behind useful automation."
      field={{ mode: 'brain', ascii: true, gain: 1.05 }}
    >
      <div className="notes">
        {NOTES.map((note, i) => (
          <Link className="note" to={note.href} key={note.slug} data-reveal style={{ '--d': `${i * 80}ms` }}>
            <span className="d">{note.date}</span>
            <span className="t">{note.title}</span>
            <span className="c">{note.category} · {note.mins} min</span>
            <span className="ar">→</span>
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
