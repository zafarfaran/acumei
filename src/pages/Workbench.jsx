import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BookCall from '../components/BookCall';
import Sheet from '../components/workbench/Sheet';
import Tray from '../components/workbench/Tray';
import Inspector from '../components/workbench/Inspector';
import AnswerCard from '../components/workbench/AnswerCard';
import LiveAsk from '../components/workbench/LiveAsk';
import useLiveRun from '../components/workbench/useLiveRun';
import usePlayback from '../components/workbench/usePlayback';
import { run, SCENARIOS } from '../lib/workbench/engine';
import { DEFAULT_BUILD, decodeBuild, encodeBuild, fit, remove, hasPart } from '../lib/workbench/build';
import { partByCode, partsForSlot, slotByCode } from '../lib/workbench/parts';
import { STATIC } from '../lib/motion';
import '../styles/workbench.css';

// The slot popover: swap the part in a slot, or fit / remove a branch.
function SlotMenu({ menu, build, onPick, onRemove, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-slot]')) onClose(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    ref.current?.querySelector('button')?.focus();
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown); };
  }, [onClose]);
  const s = slotByCode(menu.code);
  const branch = s.kind === 'branch';
  const fitted = branch && build.branches.includes(menu.code);
  const r = menu.rect;
  const left = Math.min(Math.max(8, r.left + r.width / 2 - 130), window.innerWidth - 268);
  const top = r.bottom + 8 + 240 > window.innerHeight ? Math.max(8, r.top - 248) : r.bottom + 8;
  return (
    <div className="wb-pop" ref={ref} role="dialog" aria-label={`${menu.code} ${s.name}`} style={{ left, top }}>
      <div className="wb-pop-k mono"><b>{menu.code}</b> {s.name}</div>
      <p className="wb-pop-r">{s.role}</p>
      {branch ? (
        fitted
          ? <button type="button" className="wb-pop-b is-rm" onClick={() => onRemove(menu.code)}>Remove {s.name}</button>
          : <button type="button" className="wb-pop-b" onClick={() => onPick(menu.code)}>Fit {s.name}<span>{partByCode(menu.code).blurb}</span></button>
      ) : partsForSlot(menu.code).map((p) => (
        <button key={p.code} type="button" className={`wb-pop-b${hasPart(build, p.code) ? ' is-on' : ''}${p.shortcut ? ' is-short' : ''}`} onClick={() => onPick(p.code)}>
          <b className="mono">{p.code}</b> {p.name}{hasPart(build, p.code) ? ' · fitted' : ''}
          <span>{p.blurb}</span>
        </button>
      ))}
    </div>
  );
}

export default function Workbench() {
  const [params, setParams] = useSearchParams();
  const build = useMemo(() => decodeBuild(params.get('b')), [params]);
  const scenarioId = SCENARIOS.some((s) => s.id === params.get('s')) ? params.get('s') : 'revenue';
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const code = encodeBuild(build);

  const setBuildAndScenario = useCallback((b, s) => {
    setParams({ b: encodeBuild(b), s }, { replace: true });
  }, [setParams]);
  const setBuild = (b) => setBuildAndScenario(b, scenarioId);

  // A run is pinned to the build and scenario it started with; changing either ends it.
  const [runCfg, setRunCfg] = useState(null);
  const [choices, setChoices] = useState({});
  const [live, setLive] = useState(null); // { id, code, question, events, streaming }
  const scripted = runCfg && runCfg.code === code && runCfg.scenarioId === scenarioId;
  const liveOn = live && live.code === code;
  const events = useMemo(
    () => (liveOn ? live.events : scripted ? run(build, scenarioId, choices) : []),
    [liveOn, live, scripted, build, scenarioId, choices],
  );
  const runId = liveOn ? live.id : scripted ? runCfg.id : null;
  const pb = usePlayback(events, runId, !(liveOn && live.streaming));
  const answer = pb.done ? pb.current?.answer : null;
  const liveRun = useLiveRun(useCallback((next) => setLive({ ...next, code: encodeBuild(next.build || build) }), [build]));
  const [askedLive, setAskedLive] = useState(false);

  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState('');
  const [insp, setInsp] = useState({ open: false, tab: 'step', focusId: null, showAll: false });

  useEffect(() => {
    document.title = 'Workbench — Acumei';
    return () => { document.title = 'Acumei — AI engineering lab'; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function fitPart(partCode) {
    const p = partByCode(partCode);
    setBuild(fit(build, partCode));
    setSelected(null); setMenu(null);
    setStatus(`${p.name} fitted to ${p.slot}${p.slot === p.code ? '' : ` ${slotByCode(p.slot).name}`}.`);
  }

  function onSlot(slotCode, el) {
    if (selected) {
      const p = partByCode(selected);
      if (p.slot === slotCode) return fitPart(selected);
      setStatus(`${p.name} doesn't fit ${slotCode}. It goes in ${p.slot}.`);
      return undefined;
    }
    setMenu({ code: slotCode, rect: el.getBoundingClientRect() });
    return undefined;
  }

  function onDrop(partCode, slotCode) {
    const p = partByCode(partCode);
    if (slotCode && p.slot === slotCode) return fitPart(partCode);
    setSelected(null);
    setStatus(slotCode ? `${p.name} doesn't fit ${slotCode}. It goes in ${p.slot}.` : '');
    return undefined;
  }

  function startRun() {
    setLive(null);
    setChoices({});
    setRunCfg({ id: Date.now(), code, scenarioId });
    setInsp((s) => ({ ...s, focusId: null }));
    setStatus(`Running: “${scenario.question}”`);
  }

  const openAt = (id) => setInsp((s) => ({ ...s, open: true, tab: 'step', focusId: id }));
  const closeInsp = useCallback(() => setInsp((s) => ({ ...s, open: false })), []);

  const header = (
    <>
      <span>SHEET W-01 · NORTHWIND LOGISTICS · DATA ANALYSIS AGENT</span>
      <label className="wb-scn">
        <span>Scenario</span>
        <select value={scenarioId} onChange={(e) => setBuildAndScenario(build, e.target.value)}>
          {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </label>
    </>
  );

  return (
    <div className={`asm wb${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <main className="wb-main">
        <header className="wb-head">
          <div className="titleblock mono">
            <div><span>SHEET</span><b>W-01</b></div>
            <div className="tb-label"><span>SUBJECT</span><b>Workbench · data analysis agent</b></div>
            <div><span>REV</span><b>A</b></div>
          </div>
          <h1>Build an agent. <span className="amb">Then try to break it.</span></h1>
          <p className="lede">
            Assemble a data analysis agent for Northwind Logistics, a made-up company with a made-up warehouse.
            Run it, open up every step, then take a guardrail out and watch what changes.
          </p>
        </header>

        <Sheet
          build={build}
          revealed={pb.revealed}
          current={pb.current}
          running={runId != null}
          waiting={pb.waiting}
          selected={selected}
          onSlot={onSlot}
          onCallout={openAt}
          onChoose={(id, opt) => {
            if (liveOn) {
              const label = pb.current?.pause?.options.find((o) => o.id === opt)?.label || opt;
              liveRun.ask({ build, question: live.question, clarify: label });
            } else setChoices((c) => ({ ...c, [id]: opt }));
          }}
          header={header}
        />

        <div className="wb-ctl">
          <p className="wb-q"><span className="mono">Q ·</span> “{scenario.question}” <span className="wb-who">— J. Ortiz, EMEA operations</span></p>
          <div className="wb-ctl-r">
            <button type="button" className="lnk wb-reset" onClick={() => { setBuild(DEFAULT_BUILD); setStatus('Build reset.'); }}>Reset build</button>
            <button type="button" className="lnk" onClick={() => setInsp((s) => ({ ...s, open: !s.open }))}>{insp.open ? 'Close' : 'Open'} inspector</button>
            <button type="button" className="btn wb-run" onClick={startRun} disabled={pb.playing && !pb.waiting}>
              {pb.playing && !pb.waiting ? 'Running…' : runId != null ? '▶ Run again' : '▶ Run'}
            </button>
          </div>
        </div>
        <p className="wb-status mono" role="status" aria-live="polite">{pb.current ? `${pb.current.id + 1}. ${pb.current.summary}` : status}</p>

        {answer && <AnswerCard answer={answer} />}

        <Tray build={build} selected={selected} onSelect={setSelected} onDrop={onDrop} />

        {(pb.done || askedLive || liveOn) && (
          <LiveAsk
            build={build}
            live={{ ...liveRun, ask: (a) => { setAskedLive(true); setStatus(''); return liveRun.ask(a); } }}
            onScripted={startRun}
          />
        )}

        <section className="wb-close">
          <div className="wb-kick mono">NEXT</div>
          <h2>We build agents like this for real, on your data, with the guardrails your teams need.</h2>
          <BookCall className="btn">Book a 30-minute discovery call <span>→</span></BookCall>
        </section>
      </main>

      {menu && (
        <SlotMenu
          menu={menu}
          build={build}
          onPick={fitPart}
          onRemove={(c) => { setBuild(remove(build, c)); setMenu(null); setStatus(`${slotByCode(c).name} removed.`); }}
          onClose={() => setMenu(null)}
        />
      )}

      <Inspector
        open={insp.open}
        events={pb.revealed}
        focusId={insp.focusId}
        tab={insp.tab}
        showAll={insp.showAll}
        auditFitted={build.branches.includes('G-05')}
        onClose={closeInsp}
        onTab={(tab) => setInsp((s) => ({ ...s, tab }))}
        onShowAll={(showAll) => setInsp((s) => ({ ...s, showAll, open: showAll || s.open }))}
        onFocus={(focusId) => setInsp((s) => ({ ...s, focusId }))}
      />
      <Footer />
    </div>
  );
}
