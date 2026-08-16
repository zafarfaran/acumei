import { useState, useEffect, useRef, useCallback } from 'react';
import useDither from '../hooks/useDither';
import useParallax from '../hooks/useParallax';

// Copy unchanged. Icons dropped — industries are a type list now. `mode`
// selects which dither field the tile renders for that industry.
const INDUSTRIES = [
  {
    id: 'property',
    name: 'Property',
    stat: '2.4M',
    statLabel: 'rental properties in the UK',
    mode: 'grid',
    trigger: 'A tenant calls at 11:42 PM about a broken boiler. You’re asleep.',
    steps: [
      'Listens to the voicemail and understands it’s urgent — no hot water, flat 4B.',
      'Finds your preferred contractor and texts them the job details.',
      'Replies to the tenant: “Sorted — someone will call you by 8am.”',
    ],
    outcome: 'Fixed before you woke up. You never had to pick up the phone.',
  },
  {
    id: 'software',
    name: 'Software & SaaS',
    stat: '11 min',
    statLabel: 'first response, overnight',
    mode: 'orb',
    trigger: 'An alert fires at 03:14 and forty support tickets land behind it.',
    steps: [
      'Reads the alert and groups the tickets that are all the same outage.',
      'Pages the on-call engineer with what broke and which accounts it’s hitting.',
      'Replies to every affected customer with a real status link, not a canned apology.',
    ],
    outcome: 'One page instead of forty. Customers knew before they had to ask.',
  },
  {
    id: 'trades',
    name: 'Trades',
    stat: '£24K',
    statLabel: 'avg lost to missed callouts/yr',
    mode: 'scatter',
    trigger: 'Someone leaves a voicemail at 4:47 AM — their kitchen is flooding.',
    steps: [
      'Picks up the voicemail and recognises it’s an emergency.',
      'Texts your on-call engineer with the address and details.',
      'Holds an 8am diary slot — confirmed automatically when the engineer replies.',
    ],
    outcome: 'Dispatched in 14 seconds. Your phone never rang.',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    stat: '−24%',
    statLabel: 'food waste reduction',
    mode: 'wave',
    trigger: 'It’s Sunday evening. The weekly stock order needs doing.',
    steps: [
      'Looks at what you’ve been selling and compares it to what’s left in stock.',
      'Spots that you’re over-ordering basil and running low on house red.',
      'Writes up the order with adjusted amounts — sends it to the chef to approve.',
    ],
    outcome: '£270 in food waste avoided. The chef just had to tap “confirm.”',
  },
  {
    id: 'salons',
    name: 'Salons & Clinics',
    stat: '7×',
    statLabel: 'more rebookings per week',
    mode: 'scatter',
    trigger: '23 of your clients haven’t been back in over 8 weeks.',
    steps: [
      'Spots exactly who’s overdue and which stylist they usually see.',
      'Writes a friendly, personal text for each one — in your salon’s voice.',
      'Sends them out, but holds back 2 who had complaints — flags those for you.',
    ],
    outcome: '7 clients rebooked by lunchtime. Nobody on your team lifted a finger.',
  },
  {
    id: 'retail',
    name: 'Retail',
    stat: '£140',
    statLabel: 'saved per restock cycle',
    mode: 'grid',
    trigger: 'Three of your best sellers are about to run out. You don’t know yet.',
    steps: [
      'Checks your sales data and spots the gap before it becomes a problem.',
      'Finds a better price on one item from a different supplier.',
      'Puts together the purchase order and sends it to you for a quick OK.',
    ],
    outcome: 'Restocked before Tuesday’s rush. £140 saved on one order.',
  },
  {
    id: 'professional',
    name: 'Professional Services',
    stat: '6 min',
    statLabel: 'from enquiry to onboarded',
    mode: 'wave',
    trigger: 'A potential client fills in your website form at 10 PM on a Tuesday.',
    steps: [
      'Sends them an intake form immediately — they complete it in 6 minutes.',
      'Checks for conflicts, finds the right team, and matches them up.',
      'Drafts an engagement letter and queues it for your partner to review.',
    ],
    outcome: 'Client fully onboarded overnight. First meeting booked for 9am.',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    stat: '90 sec',
    statLabel: 'to fill a cancelled slot',
    mode: 'orb',
    trigger: 'A patient cancels their Thursday afternoon appointment.',
    steps: [
      'Checks who’s on the waitlist and picks the best match.',
      'Texts them: “Slot available Thursday 2pm. Reply YES to book.”',
      'They reply in 90 seconds. Slot filled. Everyone else on the list is updated.',
    ],
    outcome: 'No lost revenue. No time spent on the phone. Waitlist managed itself.',
  },
  {
    id: 'logistics',
    name: 'Logistics',
    stat: '67%',
    statLabel: 'on-time despite disruption',
    mode: 'scatter',
    trigger: 'One of your drivers calls in sick at 5:45 AM. 12 deliveries on that route.',
    steps: [
      'Finds a nearby driver who can take most of the drops.',
      'Reroutes 8 deliveries for efficiency. Reschedules the other 4.',
      'Texts every affected customer with their updated delivery window.',
    ],
    outcome: '8 out of 12 delivered on time. Customers knew before they had to ask.',
  },
  {
    id: 'custom',
    name: 'Custom Tech Solutions',
    stat: '∞',
    statLabel: 'if you can describe it, we can build it',
    mode: 'orb',
    trigger: 'You have an idea for a tool, app, or system — but no tech team to build it.',
    steps: [
      'We sit down with you and figure out exactly what you need — no jargon, just outcomes.',
      'Design and build it from scratch — AI-powered apps, dashboards, connections between the systems you already use, whatever it takes.',
      'Hand it over fully working, fully yours. We can stay on to maintain it or you take it from here.',
    ],
    outcome: 'Your idea, built and running. Not a template — something made for you.',
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const markerRef = useRef(null);
  const btnRefs = useRef([]);

  const [tileRef, tile] = useDither({
    mode: INDUSTRIES[0].mode,
    cell: 3,
    dot: 1.4,
    color: 'rgba(232,160,75,.55)',
  });
  const parRef = useParallax(0.04, 0.6);

  const selected = INDUSTRIES[active];

  // the marker slides to the centre of the selected name
  const moveMarker = useCallback((i) => {
    const btn = btnRefs.current[i];
    const marker = markerRef.current;
    if (!btn || !marker) return;
    marker.style.opacity = 1;
    marker.style.transform = `translateY(${btn.offsetTop + btn.offsetHeight / 2}px)`;
  }, []);

  useEffect(() => { moveMarker(active); }, [active, moveMarker]);

  // the list reflows at breakpoints and as fonts settle
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => moveMarker(active));
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, moveMarker]);

  useEffect(() => { tile.current?.setMode(selected.mode); }, [selected.mode, tile]);

  return (
    <section id="industries">
      <div className="shead" data-reveal>
        <span className="mono">01</span>
        <span className="mono">AI agents</span>
      </div>

      <h2 className="swipe" data-reveal>
        Agents for <span className="amb">every industry.</span>
      </h2>

      <p className="sub" data-reveal style={{ '--d': '120ms' }}>
        Pick your industry. We&rsquo;ll walk you through a real scenario.
      </p>

      <div className="ind">
        <div className="indlist" ref={listRef} data-reveal data-fly="left" style={{ '--d': '180ms' }} role="tablist" aria-label="Industries">
          <div className="marker" ref={markerRef} />
          {INDUSTRIES.map((ind, i) => (
            <button
              key={ind.id}
              ref={(el) => { btnRefs.current[i] = el; }}
              className="indbtn"
              role="tab"
              aria-selected={active === i}
              aria-controls="industry-story"
              onClick={() => setActive(i)}
            >
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              {ind.name}
            </button>
          ))}
        </div>

        <div className="story" data-reveal data-fly="right" style={{ '--d': '240ms' }}>
          <canvas
            className="tile"
            ref={(el) => { tileRef.current = el; parRef.current = el; }}
            aria-hidden="true"
          />
          {/* keyed so the step cascade replays on every change */}
          <div key={selected.id} id="industry-story" role="tabpanel">
            <div className="trigger">{selected.trigger}</div>
            <ol className="steps">
              {selected.steps.map((step, i) => (
                <li key={i} style={{ '--d': `${120 + i * 110}ms` }}>
                  <span className="k">{String(i + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="outcome">
              <p>{selected.outcome}</p>
              <div className="stat">
                <b>{selected.stat}</b>
                <span>{selected.statLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
