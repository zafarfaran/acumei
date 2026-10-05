# Workbench — Design

Date: 2026-10-05
Status: proposed

## Problem

Acumei is pivoting to enterprise work as an AI engineering lab. Enterprise buyers
already believe a model can answer a question; what they doubt is control: which
systems an agent can touch, who signs off, what gets logged, and what happens when
it is unsure. The site says we handle this. Nothing on it lets a visitor *see* it.

## Approach

A playground at `/workbench` where the visitor assembles a **data analysis agent**
as an isometric machine, drawn in the same dithered style as the homepage, and
runs it against a fictional company's warehouse. Every step of the run is
inspectable. Leaving out a guardrail makes the run visibly go wrong, so the page
argues that agent safety is engineering, not prompting.

Two releases:

1. **Scripted.** Preset scenarios played back by a deterministic engine. No
   backend, no per-visit cost.
2. **Live.** "Try your own question" runs a real model through the same machine,
   with guardrails enforced in code and a daily limit.

## The fictional company

**Northwind Logistics**, a mid-size logistics firm. Its warehouse holds sales,
product usage and HR data. All people and figures are invented and obviously so.

## The machine

A fixed spine of six modules on an isometric rail (question → answer), plus
optional branches bolted onto outrigger plates. Every main slot always holds a
part; branches may be empty. Any build the visitor can make is valid.

### Main slots and parts

| Slot | Role | Parts (default first) |
|---|---|---|
| D-01 Intake | Where the question comes from | F-01 Slack · F-02 Teams · F-03 BI "Ask" box |
| D-02 Understand | Resolve what the question means | F-04 Semantic layer · F-05 Raw schema only |
| D-03 Access | What the asker may see | F-06 Role-based access · F-07 Shared service account |
| D-04 Query | Fetch the data | F-08 Snowflake · F-09 BigQuery · F-10 Postgres |
| D-05 Validate | Check results before anyone sees them | F-11 Reconciliation checks · F-12 Pass-through |
| D-06 Deliver | Present the answer | F-13 Slack memo + chart · F-14 Dashboard tile · F-15 Board slide draft |

F-05, F-07 and F-12 are deliberate "shortcut" parts. They work, but scenarios
show what they cost.

### Branches

| Code | Bolts onto | Behaviour |
|---|---|---|
| G-01 Clarify | D-02 | Ambiguous question → ask before querying |
| G-02 PII guard | D-03 | Mask or block personal columns |
| G-03 Cost gate | D-04 | Pause scans over 500 GB for approval |
| G-04 Analyst review | D-06 | Low-confidence or exec-bound answers go to a human first |
| G-05 Audit log | whole rail | Hash-chained record of every step and reason |

Without G-05, the inspector's audit tab shows "no audit log fitted — this run
leaves no record" rather than an empty list.

**Default build on first load:** all main slots hold their default part, and no
branches are fitted. The first run of the first scenario succeeds, and the tray
invites the visitor to add guardrails and try the others.

## Scenarios (release 1)

Each scenario names the parts that change its outcome.

1. **"Why did EMEA revenue drop 12% in September?"** The happy path: the agent
   breaks the drop down by region, product and customer, and finds two churned
   accounts.
   - F-05 raw schema: uses gross revenue, so the drop it reports is wrong (flagged).
   - F-12 pass-through: credit notes are double-counted and nobody catches it.
   - No G-04: the answer posts straight to the exec channel.
2. **"How many active users did we have last month?"** Two definitions match.
   - G-01 fitted: the run pauses and the visitor picks 7-day or 30-day.
   - G-01 missing: the agent silently uses 7-day; the answer card flags that
     Finance reports the 30-day figure.
3. **"Show me salaries by employee name."**
   - F-06 role-based access: blocked, because the asker's role has no HR access.
   - F-07 service account without G-02: salary data leaks, shown in red.
   - F-07 with G-02: names are masked, and only aggregates are returned.
4. **"Full year-on-year breakdown for every SKU."** The scan is 2.3 TB.
   - G-03 fitted: the run pauses with Approve and Deny controls.
   - G-03 missing: it runs anyway, and the answer card shows the compute cost.

## Page and interactions

**Route** `/workbench`, lazy-loaded with `React.lazy` (the site's first
code-split route), using `PageShell`. Linked from the nav once
signed off, and from the home page ("Build an agent yourself →").

**Desktop layout**
- **Sheet** (top, most of the width): the isometric rail, a title block, and the
  scenario picker in the top-right of the sheet.
- **Parts tray** below it: the tray's parts as small dithered blocks with codes,
  and Run at the right.
- **Inspector**: a drawer from the right, opened from a numbered callout or a
  module. Tabs: *Step* (SQL, rows returned, metric definition used, reasoning,
  guardrail verdict), *Audit log*, *Answer*. "Show all" pins it open with every
  step expanded.

**Building**
- Drag a part from the tray onto a slot. Compatible slots highlight while
  dragging.
- Tap or press Enter on a part, then on a slot. This is the mobile and keyboard
  path.
- Click a fitted part to swap or remove it (removal only for branches).
- The build is encoded in the URL query (e.g. `?b=F01.F04.F06.F08.F11.F13.G02`),
  so it can be shared.

**Running**
- An amber block travels the rail and pauses at each module. The module lights
  up and a numbered callout appears with a one-line summary.
- When a guardrail fires, the block stops and a red callout says why. Pauses
  (clarify, cost gate) show inline controls.
- The run ends with an answer card (chart and explanation), plus a contrast
  line, e.g. "With G-03 fitted, this would have paused for approval."

**Phone:** the rail turns vertical and the sheet scrolls. The inspector becomes a
bottom sheet. Building is tap-to-place only.

**Reduced motion:** runs step through without animation, and all content is
still shown.

## Architecture

### Rendering

Reuse `src/lib/assembly/renderer.js`, which already takes a model
(`createRenderer(canvas, model)`) and exposes projected anchors. A new
`src/lib/workbench/machineModel.js` turns a build into a renderer model: rail,
modules, outrigger plates, empty-socket outlines, and the request token.

The canvas is visual only. Slots and parts are real `<button>`s in a DOM overlay,
positioned from the renderer's anchors. That gives hit-testing, focus, keyboard
use and screen-reader labels without any canvas picking. If the renderer needs
extra capabilities (dashed empty sockets, red state, a token position), they are
added to it in a backwards-compatible way, and the homepage must render unchanged.

### Run engine (pure)

```
src/lib/workbench/
  parts.js            catalogue: { code, name, slot, blurb, shape }
  build.js            default build, validation, URL encode/decode
  engine.js           run(build, scenario) → Event[]
  scenarios/*.js      one file per scenario (data, not code)
  data/northwind.js   fixed mock dataset (a few hundred rows)
  machineModel.js     build → renderer model
```

A scenario declares its question, the mock data it touches, and per-step
outcomes with overrides keyed by part code. `run()` is deterministic.

**Event shape** (shared by scripted and live runs):

```js
{
  step: 'D-04',            // module or branch code
  kind: 'query',           // intake | resolve | access | query | validate | deliver | guard | pause | answer
  summary: 'Scanned 41 GB in 1.2 s',
  sql?: string,
  rows?: { columns, rows, masked?: string[] },
  definition?: string,
  reasoning?: string,
  verdict?: 'pass' | 'blocked' | 'paused' | 'flagged' | 'leaked',
  audit?: string,
  pause?: { prompt, options: [{ id, label }] },  // resumes via run(build, scenario, choices)
  answer?: { chart, text, contrast? }
}
```

Pauses are resolved by calling `run()` again with the visitor's choices, so the
engine stays pure.

### UI components

```
src/pages/Workbench.jsx
src/components/workbench/
  Sheet.jsx        canvas + DOM overlay, playback of Event[]
  Tray.jsx         parts tray, drag source
  Inspector.jsx    drawer / bottom sheet with Step, Audit and Answer tabs
  AnswerCard.jsx
  ScenarioPicker.jsx
```

Playback is driven by the event array. Components never branch on whether a
run was scripted or live.

## Live mode (release 2)

- **Endpoint** `api/workbench/run.js` (Vercel serverless). The request body is
  `{ build, question }`, and the response is a stream of events (newline-delimited
  JSON) in the shape above.
- **Provider:** OpenAI (the user's account), behind a thin adapter so it can be
  swapped later.
- **Model tools (mock only):** `query_warehouse(sql)`, `get_metric_definition(name)`,
  `ask_clarification(question)`. SQL runs against the Northwind dataset loaded
  into in-function SQLite (sql.js).
- **Guardrails are enforced in code, not by the prompt:**
  - F-06 rewrites every query with the asker's row filter, and denies HR tables.
  - G-02 masks personal columns before results reach the model.
  - G-03 estimates the scan size from the tables touched, and pauses the run.
  - G-01 lets the model call `ask_clarification`. Without G-01 the tool doesn't exist.
  - G-04 and G-05 shape the delivery and audit events.

  The prompt only describes the fitted parts, so the model can explain itself.
- **Limits:** 5 live runs per visitor per day and a global daily cap, with counters
  in Upstash Redis. Questions are capped at 300 characters, runs at 8 tool calls,
  output tokens and wall time at 30 s. Off-topic questions get a scoped refusal.
- **Failure:** limit reached, provider error or timeout produce a final `error`
  event with a plain message, and the page offers the scripted scenarios. A run
  never hangs.
- **Setup (user):** `OPENAI_API_KEY` and Upstash credentials in Vercel environment
  variables, and a spend limit in the OpenAI dashboard.

## Testing

- **Vitest** is added (the repo has none yet).
- **Engine:** for every scenario, each listed part toggled on and off produces the
  outcome in the Scenarios section. These tests are the guarantee that the page's
  lesson is true.
- **Build:** every reachable build validates and runs. URL encode/decode
  round-trips.
- **Release 2:** guardrail enforcement is tested against SQLite with no model in
  the loop.
- **Browser check:** Chrome at desktop and phone widths. Build, run all four
  scenarios, the inspector, keyboard-only use, reduced motion. The homepage
  machine must be visually unchanged.

## Accessibility and performance

- All slots and parts are focusable buttons with labels. The inspector lists
  every event as text.
- `/workbench` is code-split, so the homepage bundle does not grow. No new
  rendering libraries.

## Rollout

1. Release 1 on branch `workbench`, reviewed on a Vercel preview, and linked in
   the nav only after sign-off.
2. Release 2 on its own branch after the key and Redis are set up.

## Out of scope

- Free-form canvas wiring, user-defined parts, saving builds server-side.
- More agent types or industries. The scenario format allows them later, but
  none ship now.
- Real customer data or real warehouse connections.
