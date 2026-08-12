import useDither from '../hooks/useDither';
import useParallax from '../hooks/useParallax';

// The prototype's five columns become four: its Legal column listed Privacy,
// Terms, Cookie and Data-processing pages that do not exist yet, and its
// Product/Company columns linked Pricing, About, Careers and FAQ at #book.
// Every link here resolves to a section that is actually on the page. Add the
// Legal column back — and restore the 1.4fr repeat(3,…) 1.1fr grid — once
// those pages are written.
const COLUMNS = [
  {
    heading: 'Product',
    links: [
      ['The AI Brain', '#industries'],
      ['How it works', '#how'],
      ['Calculator', '#calc'],
      ['Case studies', '#work'],
    ],
  },
  {
    heading: 'Company',
    links: [
      ['Notes', '#notes'],
      ['Book a call', '#book'],
      ['hello@acumei.co.uk', 'mailto:hello@acumei.co.uk'],
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
          <div className="wordmark">
            <canvas ref={markRef} style={{ width: 18, height: 18 }} aria-hidden="true" />
            Acumei
          </div>
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
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="fcol fcontact" data-reveal style={{ '--d': '200ms' }}>
          <h4>Get in touch</h4>
          <a className="e" href="mailto:hello@acumei.co.uk">hello@acumei.co.uk</a>
          <div className="a">12 Rivington Street<br />London EC2A · By appointment</div>
        </div>
      </div>

      <div className="bigmark" data-reveal>
        <canvas ref={bigMarkRef} aria-hidden="true" />
        <span className="mono">Acumei</span>
      </div>

      {/* Company number and VAT number omitted — the prototype's were invented
          placeholders. Add the real registration details before launch. */}
      <div className="legal">
        <div className="mono">© 2026 Acumei Ltd · Registered in England &amp; Wales · London</div>
      </div>
    </footer>
  );
}
