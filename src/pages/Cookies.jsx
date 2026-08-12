import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { EMAIL, MAILTO, LEGAL_UPDATED } from '../lib/site';

export default function Cookies() {
  return (
    <PageShell
      n="08"
      label="Legal"
      title={<>This site sets <span className="amb">no cookies.</span></>}
      lede="Which is why there is no banner asking you to accept any. This page explains what that means and what would have to change for it to stop being true."
      meta={`Last updated ${LEGAL_UPDATED}`}
      field={{ mode: 'grid' }}
    >
      <section>
        <h2>The short version</h2>
        <p>
          We set no cookies, no local storage and no session storage. There is no
          analytics package, no advertising pixel, no embedded video, no social media
          widget and no tag manager. Nothing on this site tracks you between pages or
          between visits, and nothing follows you off it.
        </p>
        <p>
          You can check this yourself: open your browser&rsquo;s developer tools, go to
          the storage or application tab, and look. It will be empty.
        </p>
      </section>

      <section>
        <h2>Why there is no banner</h2>
        <p>
          Under the Privacy and Electronic Communications Regulations, consent is needed
          to store or read information on your device unless it is strictly necessary for
          a service you asked for. We store nothing at all, so there is nothing to ask
          you about. A banner would be theatre.
        </p>
      </section>

      <section>
        <h2>What still gets recorded</h2>
        <p>
          Our hosting provider keeps standard server logs when a page is requested,
          including IP address, timestamp and which file was served. That happens at the
          network level for security and reliability, not through a cookie, and it is not
          used to profile visitors. It is covered in our{' '}
          <Link to="/privacy">privacy policy</Link>.
        </p>
      </section>

      <section>
        <h2>The calculator</h2>
        <p>
          The savings calculator runs entirely in your browser. Nothing you type into it
          is stored or transmitted — not to us, not to anyone else. Close the tab and it
          is gone. It is not remembered between visits, which is a deliberate trade: a
          slightly less convenient tool in exchange for not holding your numbers.
        </p>
      </section>

      <section>
        <h2>Fonts and other assets</h2>
        <p>
          The two typefaces are served from this site rather than from a font CDN, so
          loading a page does not make a request to any third party. Every graphic on the
          site is generated in your browser at runtime rather than downloaded, so there
          are no image requests either.
        </p>
      </section>

      <section>
        <h2>If this changes</h2>
        <p>
          If we ever add analytics, a booking widget or an embedded video, this page will
          be updated first and a proper consent mechanism will go in before anything is
          set. Non-essential storage will be off by default until you actively agree to
          it.
        </p>
        {/* TODO: if analytics are ever added, update this page and ship a consent
            banner with them — several claims above become false the moment any
            third-party script is on the page. */}
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Email <a href={MAILTO}>{EMAIL}</a> if you want anything here clarified, or if
          you believe you have found something on the site storing data. We would want to
          know.
        </p>
      </section>
    </PageShell>
  );
}
