import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCall from './BookCall';
import Mark from './Mark';
import { EMAIL } from '../lib/site';

// Absolute so they work from a standalone page as well as from the home page.
const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#process', label: 'Process' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
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
      <header className="hdr">
        <Link to="/" className="brand" aria-label="Acumei" onClick={() => setOpen(false)}>
          <Mark />
          Acumei
        </Link>

        <nav className="nav mono" aria-label="Primary">
          {LINKS.map((l) => <Link key={l.href} to={l.href}>{l.label}</Link>)}
        </nav>

        <div className="hdr-r">
          <BookCall className="btn-o">Book a call</BookCall>
          <button
            className="burger"
            aria-label={open ? 'Close menu' : 'Menu'}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
          >
            <i /><i />
          </button>
        </div>
      </header>

      <div className="menu" id="menu" aria-hidden={!open}>
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            to={l.href}
            style={{ '--d': `${60 + i * 50}ms` }}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            <span className="mono">0{i + 1}</span>{l.label}
          </Link>
        ))}
        <div className="foot" style={{ '--d': '380ms' }}>
          <Link to="/#book" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Book a scoping call →
          </Link>
          <span className="mono">{EMAIL}</span>
        </div>
      </div>
    </>
  );
}
