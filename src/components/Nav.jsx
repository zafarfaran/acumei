import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useDither from '../hooks/useDither';
import { subscribeScroll } from '../lib/scrollLoop';
import { EMAIL } from '../lib/site';

// Absolute so they work from a standalone page as well as from the home page.
const LINKS = [
  { href: '/#industries', label: 'The AI Brain' },
  { href: '/#how', label: 'How it works' },
  { href: '/#calc', label: 'Calculator' },
  { href: '/#work', label: 'Work' },
  { href: '/#notes', label: 'Notes' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const progRef = useRef(null);
  const [markRef] = useDither({ mode: 'brain', cell: 2, dot: 1, color: 'rgba(232,160,75,.9)', gain: 1.15 });

  // background cross-fades at 40px; the progress bar tracks every frame
  useEffect(() => subscribeScroll((y, vh) => {
    navRef.current?.classList.toggle('stuck', y > 40);
    const travel = document.body.scrollHeight - vh;
    if (progRef.current) {
      progRef.current.style.width = travel > 0 ? `${(y / travel) * 100}%` : '0%';
    }
  }), []);

  useEffect(() => {
    document.body.classList.toggle('menu', open);
    return () => document.body.classList.remove('menu');
  }, [open]);

  // escape closes the overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="prog" ref={progRef} />

      <nav className="nav" ref={navRef}>
        <Link to="/" className="wordmark">
          <canvas ref={markRef} aria-hidden="true" />
          Acumei
        </Link>

        <div className="navlinks">
          {LINKS.map((l) => <Link key={l.href} to={l.href}>{l.label}</Link>)}
        </div>

        <Link to="/#book" className="navcta">Book a call</Link>

        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <i /><i /><i />
        </button>
      </nav>

      <div className="menu" id="menu" aria-hidden={!open}>
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            to={l.href}
            style={{ '--d': `${60 + i * 60}ms` }}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {l.label}
          </Link>
        ))}
        <div className="foot" style={{ '--d': '360ms' }}>
          <Link to="/#book" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Book a 30-minute discovery call →
          </Link>
          <span className="mono" style={{ marginTop: 10 }}>{EMAIL}</span>
        </div>
      </div>
    </>
  );
}
