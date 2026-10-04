import { Link } from 'react-router-dom';
import Mark from './Mark';
import { EMAIL, MAILTO, LINKEDIN } from '../lib/site';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      ['Services', '/#services'],
      ['How it works', '/#process'],
      ['Pricing', '/pricing'],
      ['Work', '/#work'],
    ],
  },
  {
    heading: 'Company',
    links: [
      ['About', '/about'],
      ['Notes', '/notes'],
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
  return (
    <footer className="foot-sheet">
      <div className="fgrid">
        <div className="fcol fbrand">
          <Link to="/" className="brand"><Mark size={24} />Acumei</Link>
          <p>AI engineering lab · London</p>
          <div className="status">
            <span className="dot" />
            <span className="mono">Taking projects · Q3 2026</span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div className="fcol" key={col.heading}>
            <h4 className="mono">{col.heading}</h4>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={label}><Link to={href}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="fcol fcontact">
          <h4 className="mono">Get in touch</h4>
          <a className="e" href={MAILTO}>{EMAIL}</a>
          <div className="a">We reply within one working day.</div>
          <a className="mono" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

      {/* Company number and VAT number omitted: add the real registration
          details before launch. */}
      <div className="ftb mono">
        <div>© 2026 Acumei Ltd · Registered in England &amp; Wales</div>
        <div>DWG W4-001 · REV A</div>
        <div className="set">
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
