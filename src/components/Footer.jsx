import { Link } from 'react-router-dom';
import useDither from '../hooks/useDither';
import useParallax from '../hooks/useParallax';
import { EMAIL, MAILTO, LINKEDIN } from '../lib/site';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      ['AI agents', '/#industries'],
      ['How it works', '/#how'],
      ['Calculator', '/#calc'],
      ['Pricing', '/pricing'],
      ['Case studies', '/#work'],
    ],
  },
  {
    heading: 'Company',
    links: [
      ['About', '/about'],
      ['Notes', '/#notes'],
      ['Careers', '/careers'],
      ['Contact', '/contact'],
      ['FAQ', '/faq'],
    ],
  },
  {
    heading: 'Legal',
    links: [
      ['Privacy policy', '/privacy'],
      ['Terms of service', '/terms'],
      ['Cookie policy', '/cookies'],
      ['Data processing', '/data-processing'],
    ],
  },
];

export default function Footer() {
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;

  const [markRef] = useDither({ mode: 'brain', cell: 2, dot: 1, color: 'rgba(232,160,75,.9)', gain: 1.15 });
  const [bigMarkRef] = useDither({
    mode: 'brain',
    ascii: true,
    cell: small ? 6 : 7,
    color: 'rgba(241,237,228,.5)',
    gain: 1.05,
  });
  const [fieldRef] = useDither({
    mode: 'ridge',
    cell: small ? 5 : 4,
    dot: 1.4,
    color: 'rgba(241,237,228,.2)',
    gain: 0.85,
  });
  const parRef = useParallax(0.05, 0.4);

  return (
    <footer className="footer">
      <canvas
        className="fdither"
        ref={(el) => { fieldRef.current = el; parRef.current = el; }}
        aria-hidden="true"
      />

      <div className="fgrid">
        <div className="fcol fbrand" data-reveal>
          <Link to="/" className="wordmark">
            <canvas ref={markRef} style={{ width: 18, height: 18 }} aria-hidden="true" />
            Acumei
          </Link>
          <p>
            AI systems for British businesses that would rather be running the business than
            chasing it.
          </p>
          <div className="status">
            <span className="dot" />
            <span className="mono">Taking projects · Q3 2026</span>
          </div>
        </div>

        {COLUMNS.map((col, i) => (
          <div className="fcol" key={col.heading} data-reveal style={{ '--d': `${80 + i * 60}ms` }}>
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={label}><Link to={href}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="fcol fcontact" data-reveal style={{ '--d': '260ms' }}>
          <h4>Get in touch</h4>
          <a className="e" href={MAILTO}>{EMAIL}</a>
          <div className="a">We reply within one working day.</div>
          <div className="social">
            <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="bigmark" data-reveal>
        <canvas ref={bigMarkRef} aria-hidden="true" />
        <span className="mono">Acumei</span>
      </div>

      {/* Company number and VAT number omitted — the prototype's were invented
          placeholders. Add the real registration details before launch. */}
      <div className="legal">
        <div className="mono">© 2026 Acumei Ltd · Registered in England &amp; Wales</div>
        <div className="set mono">
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
