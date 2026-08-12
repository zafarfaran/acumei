import { useState, useEffect, useRef, useCallback } from 'react';

// [time, label, status, notable]
const EVENTS = [
  ['04:47', 'Emergency triage · Bristol', 'dispatched', 1],
  ['06:00', 'Salon rebookings · Soho', '23 sent · 7 booked', 0],
  ['09:12', 'Stock reconciled · Leeds', 'reconciled', 0],
  ['14:30', 'Quote drafted · Manchester', '£8,420 · sent', 1],
  ['16:02', 'Waitlist filled · Glasgow', '90 sec', 0],
  ['17:41', 'Invoice chased · Cardiff', '£1,260 · paid', 1],
  ['19:18', 'Route rebuilt · Sheffield', '12 drops', 0],
  ['21:55', 'Enquiry onboarded · Bath', 'letter queued', 0],
];

const VISIBLE = 3;
const INTERVAL = 4200;
const EXIT = 820;

// Rows live in a fixed-height container and are moved by transform alone —
// never inserted into or removed from normal flow. Inserting in flow changes
// the document height every 4.2s, which resizes the scrollbar and jitters the
// whole page.
export default function LiveFeed() {
  const [rows, setRows] = useState(() =>
    Array.from({ length: VISIBLE }, (_, i) => ({ key: i, event: EVENTS[i % EVENTS.length], slot: i }))
  );
  const [rowH, setRowH] = useState(27);
  const next = useRef(VISIBLE);
  const feedRef = useRef(null);
  const timers = useRef([]);

  // one row is one line on desktop and two below 640px, so the height is
  // measured rather than assumed
  const measure = useCallback(() => {
    const row = feedRef.current?.querySelector('.trow');
    const h = row?.getBoundingClientRect().height;
    if (h > 4) setRowH(h);
  }, []);

  useEffect(() => {
    const row = feedRef.current?.querySelector('.trow');
    if (!row) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return;
      const key = next.current++;

      // the new row is committed one slot above the top, then dropped into
      // place on the next frame so the transition has somewhere to run from
      setRows((prev) => [
        { key, event: EVENTS[key % EVENTS.length], slot: -1 },
        ...prev.map((r) => ({ ...r, slot: r.slot + 1 })).filter((r) => r.slot <= VISIBLE),
      ]);

      const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
        setRows((prev) => prev.map((r) => (r.slot === -1 ? { ...r, slot: 0 } : r)));
      }));

      const t = setTimeout(() => {
        setRows((prev) => prev.filter((r) => r.slot < VISIBLE));
      }, EXIT);

      timers.current.push(() => { cancelAnimationFrame(raf); clearTimeout(t); });
    }, INTERVAL);

    return () => {
      clearInterval(id);
      timers.current.forEach((cancel) => cancel());
      timers.current = [];
    };
  }, []);

  return (
    <div className="feed" ref={feedRef} style={{ height: rowH * VISIBLE }}>
      {rows.map(({ key, event: [time, label, status, hot], slot }) => (
        <div
          key={key}
          className={`trow${hot ? ' hot' : ''}`}
          style={{
            transform: `translateY(${slot * rowH}px)`,
            opacity: slot >= 0 && slot < VISIBLE ? 1 : 0,
          }}
        >
          <b>{time}</b>
          <span>{label}</span>
          <span className="st">{status}</span>
        </div>
      ))}
    </div>
  );
}
