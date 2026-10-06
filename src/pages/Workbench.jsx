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
import Narration from '../components/workbench/Narration';
import Bin from '../components/workbench/Bin';
import { CHALLENGES, challengeById } from '../lib/workbench/challenges';
import { verdictOf } from '../lib/workbench/verdict';
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

  const [challengeId, setChallengeId] = useState(null);
  const challenge = challengeById(challengeId);
  const verdict = useMemo(() => (pb.done || pb.waiting ? verdictOf(pb.revealed) : null), [pb.done, pb.waiting, pb.revealed]);
  const fix = challenge && !hasPart(build, challenge.fix) ? { code: challenge.fix, label: challenge.fixLabel } : null;

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

  const heroRef = useRef(null);
  const narRef = useRef(null);
  const [leftPad, setLeftPad] = useState(0);
  // the drawing sits to the right of the narration column on wide screens
  useEffect(() => {
    const measure = () => {
      const h = heroRef.current, n = narRef.current;
      if (!h || !n) return;
      const wide = window.innerWidth > 1000;
      setLeftPad(wide ? Math.round(n.getBoundingClientRect().right - h.getBoundingClientRect().left) : 0);
    };
    measure();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    ro?.observe(heroRef.current);
    window.addEventListener('resize', measure);
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const showSheet = () => heroRef.current?.scrollIntoView({ behavior: STATIC ? 'auto' : 'smooth', block: 'start' });

  // One tap: set up the broken machine and run it.
  function pickChallenge(c) {
    setLive(null); setChoices({}); setSelected(null); setMenu(null);
    setChallengeId(c.id);
    setBuildAndScenario(c.build, c.scenario);
    setRunCfg({ id: Date.now(), code: encodeBuild(c.build), scenarioId: c.scenario });
    setStatus(`Running: “${SCENARIOS.find((x) => x.id === c.scenario).question}”`);
    showSheet();
  }

  // Fit the part that fixes it, let it land, then run again.
  function fixIt() {
    const next = fit(build, challenge.fix);
    setBuild(next);
    setRunCfg(null); setChoices({});
    setStatus(`${partByCode(challenge.fix).name} fitted. Running again…`);
    showSheet();
    setTimeout(() => setRunCfg({ id: Date.now(), code: encodeBuild(next), scenarioId }), STATIC ? 0 : 1100);
  }

  function toggleSafety(c) {
    const on = build.branches.includes(c);
    setBuild(on ? remove(build, c) : fit(build, c));
    setStatus(`${slotByCode(c).name} ${on ? 'removed' : 'fitted'}. Press run to see the difference.`);
  }

  function startRun() {
    setLive(null);
    setChoices({});
    setRunCfg({ id: Date.now(), code, scenarioId });
    setInsp((s) => ({ ...s, focusId: null }));
    setStatus(`Running: “${scenario.question}”`);
  }

  function backToStart() {
    setRunCfg(null); setLive(null); setChoices({});
    setStatus('');
  }

  const openAt = (id) => setInsp((s) => ({ ...s, open: true, tab: 'step', focusId: id }));
  const closeInsp = useCallback(() => setInsp((s) => ({ ...s, open: false })), []);

  const mode = runId == null ? 'idle' : pb.done ? 'done' : 'run';
  const stepNo = pb.revealed.filter((e) => e.kind !== 'answer').length;
  const stateLabel = mode === 'idle' ? 'IDLE · READY'
    : mode === 'run' ? (pb.waiting ? 'WAITING ON YOU' : `RUNNING · STEP ${String(stepNo).padStart(2, '0')}`)
      : verdict?.tone === 'bad' ? 'UNSAFE' : 'SAFE';
  const lift = mode === 'done' && verdict?.tone === 'bad' && fix && fix.code.startsWith('G-') ? fix.code : null;

  return (
    <div className={`asm wb${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <main className="wb-main">
        <section className={`wb-hero is-${mode}${verdict ? ` is-${verdict.tone}` : ''}`} ref={heroRef} aria-label="Workbench">
          <Sheet
            build={build}
            revealed={pb.revealed}
            current={pb.current}
            running={runId != null}
            selected={selected}
            onSlot={onSlot}
            onMarker={openAt}
            leftPad={leftPad}
            stateLabel={stateLabel}
          />
          <div className="wb-col" ref={narRef}>
            <Narration
              mode={mode}
              title={scenario.title}
              challenges={CHALLENGES}
              challengeId={challengeId}
              onPick={pickChallenge}
              onRunAsBuilt={startRun}
              scenarios={SCENARIOS}
              scenarioId={scenarioId}
              onScenario={(id) => { setChallengeId(null); setBuildAndScenario(build, id); }}
              events={pb.revealed}
              current={pb.current}
              waiting={pb.waiting}
              onChoose={(id, opt) => {
                if (liveOn) {
                  const label = pb.current?.pause?.options.find((o) => o.id === opt)?.label || opt;
                  liveRun.ask({ build, question: live.question, clarify: label });
                } else setChoices((c) => ({ ...c, [id]: opt }));
              }}
              verdict={verdict}
              fix={fix}
              onFix={fixIt}
              onDetails={() => setInsp((s) => ({ ...s, open: true, tab: 'step', showAll: true }))}
              onBack={backToStart}
            />
          </div>
          <Bin build={build} selected={selected} onSelect={setSelected} onDrop={onDrop} onToggle={toggleSafety} lift={lift} frameRef={heroRef} />
        </section>
        <p className="wb-sr" role="status" aria-live="polite">{pb.current ? `${pb.current.id + 1}. ${pb.current.summary}` : status}</p>

        <div className="wb-below">
          {answer && (
            <section className="wb-sec" aria-label="Answer readout">
              <div className="wb-k mono"><i aria-hidden="true" />FIG. W-02 · READOUT · WHAT J. ORTIZ RECEIVED</div>
              <AnswerCard answer={answer} />
            </section>
          )}

          <section className="wb-sec">
            <div className="wb-k mono"><i aria-hidden="true" />FIG. W-03 · SWAP THE MAIN PARTS</div>
            <Tray build={build} selected={selected} onSelect={setSelected} onDrop={onDrop} />
            <div className="wb-tools">
              <button type="button" className="lnk" onClick={() => { setBuild(DEFAULT_BUILD); setStatus('Build reset.'); }}>Reset the machine</button>
              <button type="button" className="lnk" onClick={() => setInsp((s) => ({ ...s, open: !s.open }))}>{insp.open ? 'Close' : 'Open'} the inspector</button>
            </div>
          </section>

          {(pb.done || askedLive || liveOn) && (
            <section className="wb-sec">
              <div className="wb-k mono"><i aria-hidden="true" />FIG. W-04 · ASK YOUR OWN QUESTION</div>
              <LiveAsk
                build={build}
                live={{ ...liveRun, ask: (a) => { setAskedLive(true); setStatus(''); showSheet(); return liveRun.ask(a); } }}
                onScripted={startRun}
              />
            </section>
          )}

          <section className="wb-close">
            <div className="wb-k mono"><i aria-hidden="true" />NEXT</div>
            <h2>We build agents like this for real, on your data, with the guardrails your teams need.</h2>
            <BookCall className="btn">Book a 30-minute discovery call <span>→</span></BookCall>
          </section>
        </div>
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
