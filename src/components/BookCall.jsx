import { useEffect, useState } from 'react';
import { PopupModal } from 'react-calendly';
import { CALENDLY_URL } from '../lib/site';

// The discovery-call CTA appears on the home page and on three inner pages.
// It keeps the same `.act` markup it had as a mailto link — the href is still a
// real destination so the link works without JS — but a click opens Calendly in
// a modal instead of the mail client.
export default function BookCall({ children }) {
  const [open, setOpen] = useState(false);
  const [root, setRoot] = useState(null);

  // PopupModal portals into a real element, which only exists after mount.
  useEffect(() => { setRoot(document.getElementById('root')); }, []);

  return (
    <>
      <a
        className="act"
        href={CALENDLY_URL}
        onClick={(e) => { e.preventDefault(); setOpen(true); }}
      >
        {children}
      </a>

      {root && (
        <PopupModal
          url={CALENDLY_URL}
          open={open}
          onModalClose={() => setOpen(false)}
          rootElement={root}
        />
      )}
    </>
  );
}
