# Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/workbench`: an isometric agent playground where visitors assemble a
data-analysis agent, run scripted scenarios with full transparency, and (once keys
exist) ask their own question live.

**Architecture:** A pure run engine (`src/lib/workbench`) turns `(build, scenario,
choices)` into an `Event[]`. The page renders the build with the existing assembly
canvas renderer, puts the interactive slots in a DOM overlay positioned from the
renderer's anchors, and plays the events back. Live mode is a Vercel function that
drives an OpenAI tool loop over a mock warehouse (alasql) with guardrails enforced in
code and streams the same events as NDJSON.

**Tech Stack:** React 18, Vite 6, react-router 7, existing `lib/assembly/renderer.js`,
Vitest, alasql (server only), OpenAI Chat Completions over `fetch`, Upstash Redis
REST over `fetch`.

**Spec:** `docs/superpowers/specs/2026-10-05-workbench-design.md`

## Global Constraints

- Visual language: the tokens in `src/styles/theme.css` only (`--bg --ink --soft --dim --line --amber`, mono = JetBrains Mono). Red for failures is `#d9614c`, used only for blocked, leaked and empty states.
- Do not change `src/lib/assembly/renderer.js` behaviour. The homepage machine must render identically.
- `/workbench` is a `React.lazy` route. The homepage bundle must not import any workbench module.
- Part codes, slot codes and the four scenarios match the spec exactly.
- Reduced motion (`STATIC` from `src/lib/motion.js`): runs step through without animation.
- The OpenAI key and Redis credentials are read only on the server (`process.env`). They never appear in client code.
- Live limits: 5 runs per visitor per day, a global cap of 300 per day (`WORKBENCH_DAILY_CAP`), question ≤ 300 characters, ≤ 8 tool calls, ≤ 30 s.
- Copy is British English, matching the site.

## Deviations from the spec

- **alasql instead of sql.js** for the live warehouse: pure JS and no wasm asset to ship in the function. Behaviour is the same.

## File map

```
src/lib/workbench/
  parts.js          catalogue + slot definitions
  build.js          default build, normalise, encode/decode
  data.js           Northwind mock dataset + aggregate helpers
  connectors.js     per-warehouse SQL dialect label and cost text
  engine.js         run(build, scenarioId, choices) → Event[]
  scenarios/
    revenue.js  activeUsers.js  salaries.js  skus.js  index.js
  machineModel.js   build → renderer model (+ anchors)
src/components/workbench/
  Sheet.jsx         canvas + SVG overlay + slot buttons, playback
  Tray.jsx          parts tray (drag / tap to place)
  Inspector.jsx     drawer: Step / Audit / Answer, Show all
  AnswerCard.jsx    final answer + chart + contrast
  LiveAsk.jsx       "try your own question" (release 2)
  usePlayback.js    timeline playback hook
src/pages/Workbench.jsx
src/styles/workbench.css
api/workbench/run.js       Vercel function (POST)
server/workbench/
  agent.js          tool loop → events
  tools.js          mock warehouse with guardrails (alasql)
  openai.js         provider adapter
  limiter.js        Upstash / in-memory daily limits
tests/workbench/*.test.js
```

---

### Task 1: Tooling and the parts catalogue and build

**Files:** create `vitest.config.js`, `src/lib/workbench/parts.js`, `src/lib/workbench/build.js`, `tests/workbench/build.test.js`. Modify `package.json` (vitest devDependency, `"test": "vitest run"`).

**Interfaces (produced):**
- `SLOTS: { code, name, role, kind: 'module'|'branch', on?: string }[]` with D-01…D-06 modules and G-01…G-05 branches (G-05 `on: 'rail'`).
- `PARTS: { code, name, slot, blurb, shortcut?: true, shape: { size: [w,d,h] } }[]` with F-01…F-15. Branch parts use the G code itself as part code, so `slot === code`.
- `partByCode(code)`, `partsForSlot(slotCode)`.
- `DEFAULT_BUILD = { 'D-01':'F-01','D-02':'F-04','D-03':'F-06','D-04':'F-08','D-05':'F-11','D-06':'F-13', branches: [] }`.
- `normalise(build) → build` (unknown parts fall back to the default, branches are deduped and sorted).
- `encodeBuild(build) → 'F01.F04.F06.F08.F11.F13.G02'` and `decodeBuild(str) → build` (garbage → default).
- `fit(build, partCode) → build`, `remove(build, branchCode) → build`.

- [ ] Write tests: the default round-trips, unknown tokens fall back, `fit` replaces a module part, `fit` adds a branch, `remove` drops a branch, and removing a module is a no-op.
- [ ] Run, expect failure. Implement. Run, expect pass.
- [ ] Commit `Workbench: parts catalogue and build encoding`.

### Task 2: Northwind data and connectors

**Files:** create `src/lib/workbench/data.js`, `src/lib/workbench/connectors.js`, `tests/workbench/data.test.js`.

**Data (exact):** EMEA customers (Aug net £k, Sep net £k, Aug credit, Sep credit):
Halden Freight Co 90/0/5/30 · Brightwater Retail 60/0/5/25 · Kestrel Pharma 200/206/10/10 ·
Morrow & Vane 180/185.4/10/10 · Osterby Foods 150/154.5/10/10 · Lumen Textiles 140/144.2/10/10 ·
Varga Components 100/103/5/10 · Ashgrove Paper 80/82.4/5/5. July = round(Aug × 0.98, 1),
credit as Aug. AMER (6 customers) and APAC (5) are generated deterministically with
+1–4 % monthly growth. Gross = net + credit.
`users_activity` Sep: active_7d 18 420, active_30d 31 960 (Aug 17 980 / 31 210).
`employees`: 12 obviously fictional people (e.g. "Avery Quill") with region, role, salary.
Table sizes (GB): revenue_monthly 41, users_activity 3, hr_employees 0.2, sku_sales 2300.

**Interfaces:** `TABLES` (rows per table), `TABLE_GB`, `regionTotals(region, month, measure)`,
`customerChange(region, measureFn)`, `pct(a, b)`.
`CONNECTORS['F-08'|'F-09'|'F-10'] → { name, dialect, cost(gb) → string, time(gb) → string }`
(Snowflake ≈ $5/TB of compute, BigQuery $6.25/TB billed, Postgres "≈ N min on the read replica").

- [ ] Tests: EMEA net Aug 1000 → Sep 875.5 (−12 % rounded); gross −7 %; double-counted credits −19 %; Sep credits 110; the employees table has 12 rows with no real-looking emails; and the cost strings for 2300 GB.
- [ ] Fail → implement → pass → commit `Workbench: Northwind mock data`.

### Task 3: Run engine and the four scenarios

**Files:** create `src/lib/workbench/engine.js`, `src/lib/workbench/scenarios/{revenue,activeUsers,salaries,skus,index}.js`, `tests/workbench/engine.test.js`.

**Interfaces:**
- `SCENARIOS: { id, title, question, asker: { name, role, channel } }[]` (ids: `revenue`, `active-users`, `salaries`, `skus`).
- `run(build, scenarioId, choices = {}) → Event[]`. It is pure. Choices are keyed by pause id (`clarify`, `cost`, `review`).
- Event shape as in the spec, plus `id` (index) and `t` ('14:02:11'-style clock). Verdicts: `pass | blocked | paused | flagged | leaked | fixed`. The last event is always `kind: 'answer'` unless the run ends on an unanswered pause (`kind: 'pause'`).
- Step order: D-01 → D-02 → [G-01] → D-03 → [G-03] → D-04 → [G-02] → D-05 → [G-04] → D-06 → [G-05] → answer.
- Each scenario module exports `steps(ctx)`. `ctx` has `{ build, has(code), part(slot), choices, emit(event), stop() }`, which keeps the scenario files declarative.

**Behaviour table (the tests):**
| Scenario | Build | Expected |
|---|---|---|
| revenue | default | D-05 verdict `fixed` (duplicate join caught), answer −12 %, contrast mentions G-04 |
| revenue | F-12 | answer −19 %, answer `flagged` |
| revenue | F-05 + F-12 | answer −7 %, `flagged` |
| revenue | F-05 + F-11 | D-05 `fixed`, answer −12 % |
| revenue | +G-04 | pause `review`. With `{review:'approve'}`: answer delivered. With `{review:'reject'}`: answer not delivered. |
| revenue | F-07 | D-03 `flagged` (over-privileged) |
| active-users | G-01 | ends in pause `clarify`. `{clarify:'30d'}` → 31 960, `{clarify:'7d'}` → 18 420 |
| active-users | default | answer 18 420, `flagged` with the Finance 30-day note |
| salaries | default (F-06) | D-03 `blocked`, answer refusal, no rows with names |
| salaries | F-07 | G-02 absent → D-04 `leaked` with names and salaries, answer `flagged` |
| salaries | F-07 + G-02 | G-02 event `pass` with `rows.masked` containing `name`, and no names in any event |
| skus | default | runs, answer contrast contains the cost string |
| skus | G-03 | pause `cost`. `approve` → answer. `deny` → answer "not run" |
| any | no G-05 | no event has `audit`. With G-05 every event has `audit` plus a final G-05 seal event |
| any | every reachable build × scenario × choices | ends with answer or pause, ids sequential |

- [ ] Write tests (table above) → fail → implement engine and scenarios → pass.
- [ ] Commit `Workbench: deterministic run engine and four scenarios`.

### Task 4: Machine model for the renderer

**Files:** create `src/lib/workbench/machineModel.js`, `tests/workbench/machineModel.test.js`.

**Interfaces:** `buildMachine(build) → { model, token, slots }`.
- `model` is renderer-compatible: `{ parts, cables: [], rack: null, demo: null, byLabel: {}, lamp: token, lens: null, glowGroup: TOKEN_G, anchors(set, scr, pj) }`.
- Rail at x ∈ [−0.6, 12.8]. Modules are 2.2 apart. Each branch has an outrigger plate at y = −2.9 and its block at y = −3.3. Groups: rail 10, module i → 11+i, branch j → 20+j, token 30 (never 4).
- `anchors` sets `slot:<code>` (top centre), `label:<code>` (front-left), `sock:<code>:0..7` (box corners for dashed empty sockets) and `token`.
- `token.pos` is mutable, and `setActive(machine, code|null)` toggles `lamp` on that module.
- `slotPos(code) → [x,y,z]` (top centre, world), used for token travel.

- [ ] Tests: the default build has 1 rail + 6 modules + 4 outrigger plates + 0 branch blocks + 1 token. Fitting G-02 adds one block. No part uses group 4. Every slot code has a `slotPos`.
- [ ] Fail → implement → pass → commit `Workbench: machine model for the assembly renderer`.

### Task 5: Page shell, route, sheet and tray (building works)

**Files:** create `src/pages/Workbench.jsx`, `src/components/workbench/{Sheet,Tray}.jsx`, `src/styles/workbench.css`. Modify `src/App.jsx` (lazy route), `vercel.json` (rewrite excludes `/api/`).

- `Sheet` creates a renderer via `createRenderer(canvas, machine.model)`, recreating it when the build changes. It drives frames with `onFrame`. The view is `S = min(cw/16, ch/9)`, yaw 0 on desktop, and yaw 0.62 rad below 720 px (rail runs down the screen). Newly fitted parts animate `q` 0→1 over 0.6 s (instant if `STATIC`).
- The overlay is an absolutely-positioned `<svg>` (labels with leader lines, dashed empty sockets in red, numbered callouts) plus one `<button>` per slot at `anchors['slot:'+code]`, with `aria-label` "D-02 Understand: Semantic layer. Change part" and so on.
- `Tray` has parts grouped by slot. Pointer drag shows a ghost and drops on the slot under the pointer (`elementFromPoint` → `data-slot`). A tap or Enter selects a part, and compatible slots highlight (`.is-target`). A tap on a slot fits it, and Esc cancels. Clicking a slot with no selection opens a popover with compatible parts, plus Remove for branches.
- The build syncs to `?b=` via `useSearchParams` (replace, not push).
- The page has Nav, a title block (SHEET W-01 / SUBJECT Workbench / REV A), an h1 "Build an agent. Then try to break it.", a short lede, the sheet, the tray with Run, and Footer.

- [ ] `npm run build` passes. Open `/workbench` in Chrome at 1440 × 900 and 390 × 844: the rail renders, labels are readable, drag, tap and keyboard fitting all work, and the URL updates.
- [ ] Commit `Workbench: page, sheet and parts tray`.

### Task 6: Playback, inspector and answer (release 1 complete)

**Files:** create `src/components/workbench/{usePlayback.js,Inspector.jsx,AnswerCard.jsx}`. Modify `Sheet.jsx` and `Workbench.jsx`.

- `usePlayback(events)` returns `{ index, playing, play(), reset() }`. It advances one event every 900 ms (0 in `STATIC`). The token eases between `slotPos` of consecutive steps. `setActive` follows the current step.
- A pause event shows its options inline (callout and inspector). Choosing an option calls `run(build, id, {...choices, [pause.id]: option})`, and playback resumes from the same index.
- Callouts: a numbered circle per visited event at its step anchor. The current one gets a one-line summary, red for `blocked/leaked/flagged`. Clicking one opens the inspector at that event.
- `Inspector` is a right drawer (bottom sheet ≤ 720 px) with tabs Step / Audit / Answer. Step shows the SQL (pre), a rows table (masked cells render `••••`), the definition, reasoning and the verdict chip. "Show all" lists every event expanded. Audit shows the audit lines, or "No audit log fitted — this run leaves no record."
- `AnswerCard`: delivered-to line, headline value, text, a CSS bar chart (no library), a flagged banner and the contrast line.
- Changing the build or scenario resets the run.
- The scenario picker is a `<select>` in the sheet's title block.

- [ ] Chrome: run all four scenarios on the default build and on builds that trigger each red outcome. Check pauses, the inspector tabs, Show all, keyboard-only, `?motion=off`, and the 390 px layout. The homepage is unchanged.
- [ ] `npm run lint`, `npm test`, `npm run build` all pass.
- [ ] Commit `Workbench: playback, inspector and answer card`.

### Task 7: Live mode server (release 2)

**Files:** create `server/workbench/{tools,agent,openai,limiter}.js`, `api/workbench/run.js`, `tests/workbench/{tools,agent,api}.test.js`. Modify `package.json` (alasql dependency) and `vite.config.js` (dev middleware that serves `/api/workbench/run` via `ssrLoadModule`).

**Interfaces:**
- `createWarehouse(build) → { query(sql) → { rows, columns, gb, masked } | { error, verdict } , estimateGb(sql), definition(name) }`.
  - F-06 adds the EMEA filter to region-bearing tables and makes `hr_employees` raise `permission denied`.
  - G-02 masks `name` and `email`.
  - Only SELECT is allowed.
- `runAgent({ build, question, clarify?, provider, emit, deadlineMs }) → Promise<void>`. It emits Events (same shape) and stops after 8 tool calls or at the deadline. G-03 over 500 GB → pause event and stop. `ask_clarification` exists only with G-01 → pause event (options from the model, max 3) and stop.
- `provider.chat({ messages, tools }) → { content, toolCalls: [{ id, name, args }] }`. `createOpenAI({ apiKey, model })` uses `fetch`, `OPENAI_MODEL` defaulting to `gpt-4.1-mini`, and `max_tokens` 600.
- `createLimiter(env) → { take(ip) → { ok, left } }`. It uses Upstash REST (`INCR` and `EXPIRE` 86400) when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, and otherwise a per-instance Map.
- `api/workbench/run.js` exports `POST(request)`. Its body is `{ b, question, clarify? }`, and it streams `application/x-ndjson`. The first line is `{kind:'meta', left, live:true}`. Without `OPENAI_API_KEY` it sends a single `{kind:'error', summary:'Live mode isn't switched on yet.'}`.

- [ ] Tests:
  - Warehouse: role filter, HR denial, masking and the cost estimate, all with no model.
  - Agent: with a fake provider, emits events in order, respects the 8-call cap, pauses at the cost gate, refuses `ask_clarification` without G-01.
  - API: 300-character cap → error, missing key → error, limiter exhausted → error.
- [ ] Fail → implement → pass → commit `Workbench: live mode server`.

### Task 8: Live mode client and launch wiring

**Files:** create `src/components/workbench/LiveAsk.jsx`. Modify `Workbench.jsx`, `Nav.jsx` (add Workbench link) and `src/components/home/Closing.jsx` or the most fitting home section (add "Build an agent yourself →").

- After the first finished run, show an input (300 maxlength), Ask, and a `LIVE · n of 5 left` badge.
- Read the stream with `response.body.getReader()`, split NDJSON, and append events to the playback, which follows along live. Error events render plainly with a "Try a scripted scenario" button.
- A pause in live mode shows its options. Choosing one posts again with `clarify` (or shows "an approver would be asked" for cost and review).

- [ ] Chrome: with no key locally, Ask shows "Live mode isn't switched on yet." With a fake provider (`WORKBENCH_FAKE_PROVIDER=1` env in dev, server only), a live run animates end to end.
- [ ] lint, test and build pass. Commit `Workbench: live questions and navigation`.
