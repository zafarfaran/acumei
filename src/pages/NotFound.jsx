import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO } from '../lib/site';

export default function NotFound() {
  return (
    <PageShell
      n="404"
      label="Not found"
      title={<>That page <span className="amb">is not here.</span></>}
      lede="Either it moved or the link was wrong. Neither is your problem to solve."
      field={{ mode: 'scatter' }}
    >
      <section>
        <ul>
          <li><Link to="/">The home page</Link> — the AI Brain, how we work, the calculator and the case studies</li>
          <li><Link to="/pricing">Pricing</Link> — how a quote gets put together</li>
          <li><Link to="/faq">FAQ</Link> — the questions we get asked on every call</li>
          <li><Link to="/contact">Contact</Link> — one address, a reply within a working day</li>
        </ul>
        <p>
          If you followed a link from somewhere on this site and it brought you here,
          email <a href={MAILTO}>{EMAIL}</a> and we will fix it.
        </p>
      </section>
    </PageShell>
  );
}
