import { useState, useEffect, useRef } from 'react';

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

const VISIBLE = 4;
const INTERVAL = 4200;
const EXIT = 560;

export default function LiveFeed() {
  // rows hold a monotonic key so React can animate the same event twice
  const [rows, setRows] = useState(() =>
    Array.from({ length: VISIBLE }, (_, i) => ({ key: i, event: EVENTS[i % EVENTS.length] }))
  );
  const next = useRef(VISIBLE);
  const feedRef = useRef(null);

  // Pin the feed to exactly VISIBLE rows, plus one row of padding for the row
  // on its way out. Otherwise the outgoing row keeps five rows in flow for
  // 560ms of every 4.2s, the hero grows, and the scrollbar visibly resizes.
  // Measured rather than hardcoded: the row is one line tall on desktop and
  // two below 640px, where the status wraps.
  useEffect(() => {
    const el = feedRef.current;
    const row = el?.querySelector('.trow');
    if (!row) return;
    const apply = () => {
      const h = row.getBoundingClientRect().height;
      if (!h) return;
      el.style.height = `${h * VISIBLE}px`;
      // +10px covers the 10px the outgoing row translates down as it fades,
      // which would otherwise be clipped by .ticker's overflow
      el.style.paddingBottom = `${h + 10}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return;
      const key = next.current++;
      setRows((prev) => {
        // the outgoing row stays mounted for one exit animation
        const kept = prev.filter((r) => !r.leaving);
        const leaving = { ...kept[kept.length - 1], leaving: true };
        return [
          { key, event: EVENTS[key % EVENTS.length] },
          ...kept.slice(0, VISIBLE - 1),
          leaving,
        ];
      });
      setTimeout(
        () => setRows((prev) => prev.filter((r) => !r.leaving)),
        EXIT
      );
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="feed" ref={feedRef}>
      {rows.map(({ key, event: [time, label, status, hot], leaving }) => (
        <div key={key} className={`trow${hot ? ' hot' : ''}${leaving ? ' out' : ''}`}>
          <b>{time}</b>
          <span>{label}</span>
          <span className="st">{status}</span>
        </div>
      ))}
    </div>
  );
}
