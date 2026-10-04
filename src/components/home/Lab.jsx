import { Link } from 'react-router-dom';
import useDither from '../../hooks/useDither';
import { NOTES } from '../../lib/notes';

const MODES = ['flow', 'grid', 'ridge'];

function Thumb({ mode }) {
  const [ref] = useDither({ mode, cell: 4, dot: 2, color: 'rgba(241,237,228,.78)', gain: mode === 'flow' ? 1.9 : 1.2 });
  return <canvas ref={ref} aria-hidden="true" />;
}

export default function Lab() {
  const recent = NOTES.slice(0, 3);
  return (
    <section id="notes" data-scene="lab">
      <div className="a-head">
        <div className="kick mono land">NOTES</div>
        <h2 className="land">What we learn building these things, written down.</h2>
        <p className="sub land">Engineering notes, working methods and the costs behind useful automation.</p>
      </div>
      <div className="sheets">
        {recent.map((n, i) => (
          <Link className="sheet land" to={n.href} key={n.slug}>
            <i className="cr a" /><i className="cr b" />
            <div className="fr">
              <Thumb mode={MODES[i]} />
              <div className="ti">
                <h3>{n.title}</h3>
                <div className="tb mono">
                  <div>NOTE<b>{n.category}</b></div>
                  <div>SHEET<b>0{i + 1} / 03</b></div>
                  <div>READ<b>{n.mins} min</b></div>
                  <div>DATE<b>{n.date}</b></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="a-more land"><Link className="lnk" to="/notes">All notes</Link></div>
    </section>
  );
}
