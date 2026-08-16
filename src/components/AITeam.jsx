import { useState, useEffect, useRef, useMemo } from 'react';
import useDither from '../hooks/useDither';
import useParallax from '../hooks/useParallax';

// The floor is a day, not a list: every agent's shift is written out in local
// minutes, and the section replays that day on a loop.
const MIN_PER_DAY = 1440;
const DAY_MS = 40000;   // one full 24h sweep
const STEP = 5;         // the clock moves in 5-minute jumps, not a blur

const t2m = (s) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (m) => {
  const q = Math.floor(m / STEP) * STEP;
  return `${String(Math.floor(q / 60)).padStart(2, '0')}:${String(q % 60).padStart(2, '0')}`;
};

const shift = (from, to) => ({ from: t2m(from), to: t2m(to) });
const act = (from, to, text) => ({ from: t2m(from), to: t2m(to), text });

const YOU = { name: 'You', hours: '07:00 – 19:00', ...shift('07:00', '19:00') };

const PODS = [
  {
    id: 'support',
    name: 'Support',
    human: { name: 'Support lead', hours: '08:30 – 17:00', ...shift('08:30', '17:00') },
    agents: [
      {
        id: 'switchboard',
        name: 'Switchboard',
        owns: 'Every call, message and form that comes in.',
        answersTo: 'Support lead',
        wakes: 'A customer is angry, or wants a price it can’t stand behind.',
        on: 'Always on · never quiet',
        idle: 'Watching the line',
        activities: [
          act('00:00', '06:30', 'Answering the out-of-hours line'),
          act('06:30', '08:30', 'Writing up the overnight tickets for the morning'),
          act('08:30', '12:30', 'Taking the overflow the team can’t get to'),
          act('12:30', '13:30', 'Covering the desk through lunch'),
          act('13:30', '17:00', 'Taking the overflow the team can’t get to'),
          act('17:00', '24:00', 'Answering the out-of-hours line'),
        ],
      },
    ],
  },
  {
    id: 'ops',
    name: 'Operations',
    human: { name: 'Ops lead', hours: '07:30 – 18:00', ...shift('07:30', '18:00') },
    agents: [
      {
        id: 'dispatch',
        name: 'Dispatch',
        owns: 'Getting each job to whoever can actually take it.',
        answersTo: 'Ops lead',
        wakes: 'Two incidents land at once and something has to give.',
        on: 'Always on · busiest 07:00 – 18:00',
        idle: 'Holding the line for whoever is on call',
        activities: [
          act('00:00', '06:45', 'Holding incidents for whoever is on call'),
          act('06:45', '08:00', 'Confirming today’s first jobs with the team'),
          act('08:00', '17:30', 'Routing new work to whoever is free'),
          act('17:30', '20:00', 'Rolling what didn’t get done into tomorrow'),
          act('20:00', '24:00', 'Holding incidents for whoever is on call'),
        ],
      },
      {
        id: 'diary',
        name: 'Schedule',
        owns: 'Tomorrow’s schedule, and today’s when it starts slipping.',
        answersTo: 'Ops lead',
        wakes: 'The same customer would have to be moved twice.',
        on: 'Always on · busiest 06:00 – 19:30',
        idle: 'Watching the schedule',
        activities: [
          act('06:00', '07:30', 'Rebuilding the day around a sick call'),
          act('07:30', '18:00', 'Keeping the schedule honest as jobs overrun'),
          act('18:00', '19:30', 'Sending tomorrow’s run sheet to the team'),
        ],
      },
    ],
  },
  {
    id: 'money',
    name: 'Money',
    human: { name: 'Finance', hours: '09:00 – 15:00', ...shift('09:00', '15:00') },
    agents: [
      {
        id: 'chasing',
        name: 'Chasing',
        owns: 'Invoices past their date, and the awkward reminder emails.',
        answersTo: 'Finance',
        wakes: 'An account goes sixty days over, or disputes the amount.',
        on: 'Always on · only chases in office hours',
        idle: 'Nothing due to chase',
        activities: [
          act('09:00', '10:00', 'Chasing four invoices past thirty days'),
          act('10:00', '16:00', 'Watching for payments to clear'),
          act('16:00', '17:00', 'Second reminder on two overdue accounts'),
        ],
      },
    ],
  },
  {
    id: 'customers',
    name: 'Customers',
    human: { name: 'Sales', hours: '09:00 – 17:30', ...shift('09:00', '17:30') },
    agents: [
      {
        id: 'quotes',
        name: 'Quotes',
        owns: 'Turning enquiries into quotes and proposals that go out the same day.',
        answersTo: 'Sales',
        wakes: 'The job is outside anything we’ve priced before.',
        on: 'Always on · busiest 08:00 – 21:30',
        idle: 'Waiting on the next enquiry',
        activities: [
          act('08:00', '18:00', 'Drafting quotes as enquiries land'),
          act('18:00', '21:30', 'Writing up the day’s notes into proposals'),
        ],
      },
      {
        id: 'followup',
        name: 'Follow-up',
        owns: 'Quotes and trials that went quiet, and asking finished work for a review.',
        answersTo: 'Sales',
        wakes: 'A customer says no and gives a reason worth hearing.',
        on: 'Always on · sends nothing after 20:30',
        idle: 'Holding until morning — nobody wants a 2am message',
        activities: [
          act('07:30', '08:30', 'Nudging three quotes that went quiet'),
          act('08:30', '19:00', 'Following up on day three and day seven'),
          act('19:00', '20:30', 'Asking yesterday’s finished jobs for a review'),
        ],
      },
    ],
  },
];

const ALL_AGENTS = PODS.flatMap((p) => p.agents);
const ALL_HUMANS = [YOU, ...PODS.map((p) => p.human)];

const onShift = (person, t) => t >= person.from && t < person.to;

const statusOf = (agent, t) => {
  const current = agent.activities.find((a) => t >= a.from && t < a.to);
  return current ? { working: true, text: current.text } : { working: false, text: agent.idle };
};

const bucket = (m) => Math.floor(m / STEP) * STEP;

const localNow = () => {
  const d = new Date();
  return bucket(d.getHours() * 60 + d.getMinutes());
};

const TICKS = [0, 6, 12, 18, 24];

export default function AITeam() {
  const [t, setT] = useState(localNow);
  const [selectedId, setSelectedId] = useState(null);

  const sectionRef = useRef(null);
  const visible = useRef(false);

  const reduced = useMemo(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // ASCII activity field, full-bleed behind the board. `flow` rather than one
  // of the radial fields: u is scaled by the canvas aspect ratio, so anything
  // with a radial falloff collapses to a dot in the middle of a wide box.
  // It also takes k, so the load drives the field maths and not just opacity.
  // cell size is the whole cost: it sets how many glyphs get drawn per frame.
  // 8 measured 12.3ms/frame full-bleed on desktop, 12 measures 5.6ms.
  const small = typeof matchMedia === 'function' && matchMedia('(max-width:900px)').matches;

  const [fieldRef, field] = useDither({
    mode: 'flow',
    ascii: true,
    cell: small ? 10 : 12,
    color: 'rgba(232,160,75,.62)',
    gain: 1.05,
    params: { k: 0 },
  });
  const parRef = useParallax(0.05, 1);

  // the day only runs while the section is on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The exact time lives in a ref and advances every frame; state only takes
  // the 5-minute bucket. Setting state per frame re-rendered the whole section
  // ~60x a second to produce identical DOM eight times out of nine.
  const exact = useRef(localNow());

  useEffect(() => {
    if (reduced) return;   // hold at the visitor's local time instead
    let raf = 0;
    let last = 0;
    const step = (now) => {
      raf = requestAnimationFrame(step);
      if (!last) { last = now; return; }
      const dt = now - last;
      last = now;
      if (!visible.current) return;
      exact.current = (exact.current + (dt / DAY_MS) * MIN_PER_DAY) % MIN_PER_DAY;
      const next = bucket(exact.current);
      setT((prev) => (prev === next ? prev : next));
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const statuses = useMemo(
    () => Object.fromEntries(ALL_AGENTS.map((a) => [a.id, statusOf(a, t)])),
    [t]
  );

  const working = ALL_AGENTS.filter((a) => statuses[a.id].working);
  const peopleOn = ALL_HUMANS.filter((p) => onShift(p, t));
  const selected = ALL_AGENTS.find((a) => a.id === selectedId) || null;

  // the field follows how much of the team is actually doing something
  const load = working.length / ALL_AGENTS.length;
  useEffect(() => {
    field.current?.set('k', load);
  }, [load, field]);

  // the most recent thing to start, so the strip reads as one live line rather
  // than repeating the floor back at you
  const latest = useMemo(() => {
    const started = working.map((a) => ({
      agent: a,
      from: a.activities.find((x) => t >= x.from && t < x.to).from,
    }));
    return started.sort((a, b) => b.from - a.from)[0]?.agent || null;
  }, [working, t]);

  // whoever is back on first, for the line under an empty floor
  const nextIn = useMemo(() => {
    const later = ALL_HUMANS.filter((p) => p.from > t).sort((a, b) => a.from - b.from)[0];
    return later || [...ALL_HUMANS].sort((a, b) => a.from - b.from)[0];
  }, [t]);

  return (
    <section id="team" ref={sectionRef}>
      {/* drift lives on the wrapper: useParallax writes inline opacity, and the
          canvas needs its own for --load */}
      <div className="team-field" ref={parRef} aria-hidden="true">
        <canvas ref={fieldRef} style={{ '--load': load.toFixed(3) }} />
      </div>

      <div className="shead" data-reveal>
        <span className="mono">02</span>
        <span className="mono">Who&rsquo;s on tonight</span>
      </div>

      <h2 className="swipe" data-reveal>
        Your team clocks off at five. <span className="amb">The business doesn&rsquo;t.</span>
      </h2>

      <p className="sub" data-reveal style={{ '--d': '120ms' }}>
        An automation is a button someone still has to press. An AI agent does the job itself &mdash;
        it works a shift, reports to someone on your team, and knows when to wake you. Below is one
        day, on repeat.
      </p>

      <div className="spine" data-reveal style={{ '--d': '180ms' }}>
        <span className="mono">You</span>
        <span className="mono nm">{YOU.hours}</span>
      </div>

      <div className="floor">
        {PODS.map((pod, i) => {
          const humanOn = onShift(pod.human, t);
          // the pod's own className stays constant: useReveal writes .in
          // straight onto the node, and a React rewrite would wipe it
          return (
            <div
              key={pod.id}
              className="pod"
              data-reveal
              data-line
              data-fly="up"
              style={{ '--d': `${i * 110}ms` }}
              role="group"
              aria-label={pod.name}
            >
              <span className="mono">{pod.name}</span>
              <div className={`who${humanOn ? '' : ' off'}`}>{pod.human.name}</div>
              <div className="mono hrs">
                {humanOn ? pod.human.hours : `Off · back ${fmt(pod.human.from)}`}
              </div>

              <div className="agents">
                {pod.agents.map((agent) => {
                  const live = statuses[agent.id].working;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      className={`agent${live ? ' live' : ''}${selectedId === agent.id ? ' sel' : ''}`}
                      aria-pressed={selectedId === agent.id}
                      onClick={() => setSelectedId(selectedId === agent.id ? null : agent.id)}
                    >
                      <span className={live ? 'dot' : 'dot off'} aria-hidden="true" />
                      <span className="nm">{agent.name}</span>
                      {/* only shown once the pod columns collapse on mobile */}
                      <span className={`ow mono${humanOn ? '' : ' off'}`}>{pod.human.name}</span>
                      <span className="st">{statuses[agent.id].text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="clock">
        <div className="dial" data-reveal data-fly="left">
          <span className="mono">Time of day</span>
          <div className="headline-num num">{fmt(t)}</div>

          <div className="track" aria-hidden="true">
            <span className="tick" style={{ left: `${(t / MIN_PER_DAY) * 100}%` }} />
          </div>

          <div className="ticks mono num" aria-hidden="true">
            {TICKS.map((h) => (
              <span key={h}>{String(h).padStart(2, '0')}</span>
            ))}
          </div>
        </div>

        <div className="onnow" data-reveal data-fly="right" style={{ '--d': '140ms' }}>
          {selected ? (
            <div key={selected.id}>
              <div className="ohead">
                <span className="mono">{selected.name} agent</span>
                <button type="button" className="mono nowbtn" onClick={() => setSelectedId(null)}>
                  Back to the floor
                </button>
              </div>

              <p className="doing">
                <span className="mono num">{fmt(t)}</span>
                {statuses[selected.id].text}.
              </p>

              <div className="acard">
                <div>
                  <div className="mono">Looks after</div>
                  <p>{selected.owns}</p>
                </div>
                <div>
                  <div className="mono">Reports to</div>
                  <p>{selected.answersTo}</p>
                </div>
                <div>
                  <div className="mono">Wakes you when</div>
                  <p>{selected.wakes}</p>
                </div>
                <div>
                  <div className="mono">On</div>
                  <p>{selected.on}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="ohead">
                <span className="mono">On right now</span>
                <span className="mono num">
                  {peopleOn.length}/{ALL_HUMANS.length} people &middot; {working.length}/
                  {ALL_AGENTS.length} agents
                </span>
              </div>

              {latest ? (
                <p className="doing">
                  <span className="mono num">{fmt(t)}</span>
                  <span className="dot" aria-hidden="true" />
                  {latest.name} &mdash; {statuses[latest.id].text.toLowerCase()}.
                </p>
              ) : (
                <p className="doing">
                  <span className="mono num">{fmt(t)}</span>
                  All six watching. Nothing needs doing.
                </p>
              )}

              <p className="assume">
                {peopleOn.length === 0
                  ? `Nobody on your team is working. ${nextIn === YOU ? 'You are' : `${nextIn.name} is`} back at ${fmt(nextIn.from)}.`
                  : peopleOn.length === ALL_HUMANS.length
                    ? 'Everyone is on — this is the easy hour. Wait for 03:00 and see who’s left.'
                    : 'Click an agent to see what it looks after and when it wakes you.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
