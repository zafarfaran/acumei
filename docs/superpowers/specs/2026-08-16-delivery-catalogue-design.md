# Delivery Catalogue & Discovery Tool — Design

Date: 2026-08-16
Status: proposed

## Problem

Every client build is bespoke, so nothing amortises. Three costs follow from that
single fact:

- **Discovery is expensive** because the output space is unbounded. Each call is
  open-ended design, and `04-operational-model.md` budgets 45–90 minutes of
  post-call write-up on top of the call itself.
- **Plumbing is expensive** because each build starts cold, with the same
  integrations rebuilt against the same handful of systems.
- **Upkeep is expensive** because there are N one-off systems rather than N
  instances of a few known things.

Agent logic — the actual product — is not a bottleneck. The wrapper around it is.

`04-operational-model.md` already names this as accruing debt: *"Processes,
templates, and systems that should be built (proposal templates, onboarding
checklists, reusable code components) get deferred because client work always
feels more urgent."*

## Approach

Build a **catalogue of agent templates** and a **discovery tool that scopes
against it**. Discovery becomes selection from a closed set rather than
open-ended design. Plumbing gets built once per template instead of once per
client. Upkeep becomes per-template rather than per-client.

The catalogue is the prerequisite for everything else. A connector library or a
shared runtime built before it would be guessing at requirements.

### Why not a runtime or a connector kit first

A shared runtime is months of work and would require migrating live clients,
which currently run on a mix of custom code and no-code tooling. Existing clients
should stay where they are. A connector kit is roughly a fortnight on its own and
needs the catalogue to tell it which connectors matter. Both are follow-on work.

## Where it lives

Inside `outbound/`, as a new module.

`outbound/server/db.js` already defines a `leads` table whose `stage` column runs
`cold → contacted → replied → warm → discovery → proposal → won → lost`.
Discovery and proposal are already stages in the pipeline, and this tool is
precisely what moves a lead between them. A separate application would mean a
second copy of every lead.

Same stack: Express 5, `better-sqlite3`, Vite + React, one `outbound.sqlite`, one
dashboard, one process to run. The folder name stops being strictly accurate;
renaming it costs more than it returns.

## Storage split

**Authored content lives in git. Recorded events live in SQLite.**

The catalogue is authored, revised constantly, and benefits from diffing, review
and rollback. Discovery sessions are records of things that happened.

### Catalogue files

`outbound/catalogue/` holds one ES module per template, plus `symptoms.js` and an
`index.js` that imports and validates all of them.

Plain JS modules rather than JSON or Markdown-with-frontmatter: no new
dependency, comments are allowed, multi-line prose works via template literals,
editors understand the format, and validation runs at import time for free. The
Catalogue screen in the UI is the human-readable view; the raw files are read by
code far more often than by people. If authoring in Markdown later proves
preferable, an exporter is a small addition.

#### Template shape

```js
export default {
  id: 'missed-call-responder',        // stable, kebab-case, matches filename
  name: 'Missed-call responder',
  pitch: 'Every missed call gets a text back within a minute, day or night.',
  does: [                              // ordered; the actual behaviour
    'Watches the phone system for unanswered inbound calls',
    'Sends an SMS within 60s acknowledging the miss and offering a callback slot',
    'Writes the caller into the CRM as a new enquiry',
    'Escalates to a human number if the caller replies URGENT',
  ],
  systems: [                           // required integrations, by kind
    { kind: 'phone', vendors: ['Twilio', 'RingCentral', '8x8'],
      note: 'Needs webhook support on inbound call events.' },
    { kind: 'sms',   vendors: ['Twilio'] },
    { kind: 'crm',   vendors: ['HubSpot', 'Pipedrive'], optional: true },
  ],
  inputs: [                            // facts discovery must extract
    { id: 'hours',       ask: 'What counts as out of hours?' },
    { id: 'escalation',  ask: 'Which number should urgent callers reach?' },
    { id: 'sms_copy',    ask: 'What should the text say?' },
  ],
  build_days: [1, 3],                  // [min, max]
  run_cost: [15, 40],                  // £/month, [min, max]
  price: { build: 2500, retainer: 200 },  // £; retainer is per month
  risks: [
    'Openreach/analogue lines often cannot emit call webhooks — confirm the ' +
      'phone system is VoIP before quoting.',
  ],
  status: 'proven',                    // proven | designed | idea
};
```

Two fields carry disproportionate weight.

`status` keeps the catalogue honest. `proven` means shipped at least once with
real numbers behind `build_days` and `run_cost`. `designed` means specced but
estimated. `idea` means do not quote it.

`risks` is where knowledge compounds. Each build teaches something ugly — a phone
system that will not emit webhooks, an accounts package that rate-limits into
uselessness, a "CRM" that turns out to be a spreadsheet. Recorded here, it
becomes a check on the next discovery call for that template. This is the
difference between a scoping tool and a filing cabinet.

#### Symptoms

`outbound/catalogue/symptoms.js` exports the interview script. Clients describe
observable problems, not solutions.

```js
export default [
  { id: 'calls-missed', text: 'Calls go unanswered after hours or during jobs',
    templates: ['missed-call-responder', 'out-of-hours-triage'] },
  { id: 'quotes-cold',  text: 'Quotes go out and nobody follows them up',
    templates: ['quote-follow-up'] },
];
```

Many-to-many. Symptoms are what you ask about; templates are what the answers
resolve to.

### Database

Two new tables in `outbound/server/db.js`, following the existing conventions
(`INTEGER PRIMARY KEY AUTOINCREMENT`, `TEXT NOT NULL DEFAULT ''`,
`datetime('now')` timestamps, `ON DELETE CASCADE`).

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open',   -- open | scoped | bespoke | abandoned
  qualified INTEGER NOT NULL DEFAULT 0,
  qual_notes TEXT NOT NULL DEFAULT '',
  symptoms TEXT NOT NULL DEFAULT '[]',   -- JSON array of symptom ids
  systems TEXT NOT NULL DEFAULT '{}',    -- JSON, e.g. { phone: 'BT analogue' }
  notes TEXT NOT NULL DEFAULT '',
  bespoke_ask TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS session_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,             -- catalogue id; soft reference
  inputs TEXT NOT NULL DEFAULT '{}',     -- JSON, answers keyed by input id
  UNIQUE(session_id, template_id)
);
```

`symptoms`, `systems` and `inputs` are JSON columns. This is a single-user local
application and none of those fields need to be queried across rows, so
normalising them buys nothing.

`template_id` is deliberately **not** a foreign key. The catalogue lives in git
and changes underneath stored rows; see Error Handling.

## Flow

### Before the call

The qualification gate from `04-operational-model.md` — 20+ employees, contact
has budget authority or direct access to it, target industry, not a tire-kicker —
becomes four checkboxes that must pass before a session opens. It is a
thirty-second check protecting a two-to-three-hour scan, and it currently exists
as prose nobody re-reads.

### During the call

A glanceable screen, minimal typing. A call spent filling in forms is a worse
call. The symptom checklist down one side, one free-text notes box on the other,
and nothing else — no template names, no prices, no input forms.

### After the call

The structured pass, targeted at ten minutes rather than ninety.

1. Ticked symptoms resolve to a candidate template shortlist. Confirm the
   selection.
2. **Fit check.** For each selected template, each required `systems` entry is
   compared against what the client actually runs, recorded in `sessions.systems`
   by kind. Each resolves to `supported`, `unsupported` or `unknown`. Anything not
   supported is surfaced alongside that template's `risks` before a quote goes
   out, rather than three days into the build. `optional: true` entries never
   block; they are reported and ignored.
3. Fill each template's `inputs`. Unanswered ones accumulate into an explicit
   "chase before quoting" list.

### When nothing fits

The session is recorded as `bespoke` with the actual ask captured in
`bespoke_ask`. That list is the evidence base for new catalogue entries: the
third time the same request appears, it becomes a template.

### Outputs

`POST /api/sessions/:id/generate` produces two Markdown artifacts, written to
`outbound/data/scopes/<session-id>/` and returned in the response for display and
copying:

- **`proposal.md`** — client-facing. Per selected template: `pitch`, `does`,
  price, and a timeline. The timeline sums the selected templates' `build_days`
  bounds — minimums summed and maximums summed — since a solo founder builds them
  in sequence, not in parallel. Plus what is needed from the client, derived from
  the required `systems`.
- **`checklist.md`** — internal. Resolved `inputs` values, the systems and
  credentials to obtain, the `risks` for every selected template, and the
  `build_days` estimate. This is the artifact a build starts from, whether worked
  by hand or handed to an AI coding agent.

Generating marks the session `scoped`, writes an `activities` row against the
lead, and moves the lead's `stage` to `proposal`, so the existing pipeline stays
current without manual upkeep.

## API

All under the existing Express server.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/catalogue` | Templates and symptoms |
| `GET` | `/api/sessions?lead_id=` | Sessions, optionally by lead |
| `POST` | `/api/sessions` | Create; rejects unless qualification passes |
| `GET` | `/api/sessions/:id` | Session, with computed fit and gaps |
| `PATCH` | `/api/sessions/:id` | Symptoms, systems, notes, status, `bespoke_ask` |
| `PUT` | `/api/sessions/:id/templates` | Set the selected template list |
| `PATCH` | `/api/sessions/:id/templates/:templateId` | Save `inputs` answers |
| `POST` | `/api/sessions/:id/generate` | Write and return the two artifacts |

Fit results and input gaps are computed server-side and returned with
`GET /api/sessions/:id`, so the client renders rather than derives.

## UI

Follows `outbound/client/src/styles.css`. It is an internal tool; consistency with
the app it lives in matters more than consistency with the marketing site.

**Catalogue** — new top-level nav item beside Today / Leads / Sequences / Stats /
Settings. One row per template: name, status badge, required system kinds, build
days, price. Click through for the full entry including `risks`. Read-only, with
a line stating the source of truth is `outbound/catalogue/`, so no one hunts for
an edit button.

**Session (live)** — reached from a lead's detail page. Symptom checklist one
side, notes box the other. Large targets, short lines, no other chrome. It should
be usable at a glance while talking.

**Session (scope)** — the same session in its after-the-call mode: candidate
shortlist, fit check with unsupported systems flagged against `risks`, input
forms per template, gap list, generate.

**Lead detail** — gains a discovery panel listing this lead's sessions with their
status, linking through.

## Error handling

**Catalogue validation on boot.** `catalogue/index.js` validates every template on
import: required fields present and correctly typed, `id` matching filename and
unique, `inputs[].id` unique within a template, `status` one of the three
permitted values, `build_days` / `run_cost` two-element ascending ranges, and
every `symptoms[].templates` entry resolving to a real template id. A malformed
catalogue **fails the server start** with a message naming the file and field. A
half-loaded catalogue that silently omits a template would produce a quote missing
work.

**Missing templates.** `session_templates.template_id` is a soft reference by
design. A template renamed or removed from git must not break historical sessions:
those render as `Unknown template (<id>)`, retain their stored `inputs`, and are
excluded from generation with a warning rather than throwing.

**Generating with gaps.** Permitted. `proposal.md` is watermarked as a draft and
`checklist.md` lists the outstanding questions at the top. Blocking generation
would push the work back to ad-hoc documents, which is the behaviour being
replaced.

**Fit check on unknown vendors.** An unrecognised vendor string resolves to
`unknown`, not `unsupported`. Unknown warns; it never blocks.

## Testing

Neither project currently has a test framework. Add **Vitest** to `outbound/`,
scoped to pure modules — the catalogue validator, the fit-check resolver, and gap
computation. These are pure functions with genuine edge cases and are where a
silent bug turns into a wrong quote.

Not tested: Express routes, React components, the mailer and scheduler that
already exist.

## Out of scope

- **Connector kit** — the shared, authenticated integration library. Follow-on
  work, with this catalogue as its input.
- **Heartbeat monitor** — scheduled liveness checks across live client systems.
  Roughly a day; gets its own short spec.
- Any client-facing surface, shared runtime, or migration of existing clients.
- Multi-user access, authentication, hosting. This stays local, like `outbound/`.

## Success criteria

- A discovery call yields a scoped proposal within 15 minutes of post-call work,
  against the current 45–90.
- The catalogue holds at least six templates, at least two marked `proven`.
- Every build after this starts from `checklist.md` rather than a blank page.
- Bespoke asks are recorded, so catalogue growth is driven by evidence rather than
  by guessing.

## Sequencing

Sized against a budget of roughly ten working days fitted around client work.

| Days | Work |
|---|---|
| 1–2 | Write the catalogue content. This is a business decision, not code, and it is the hard part. |
| 3 | Schema, catalogue loader, validator, tests |
| 4–5 | API routes |
| 6–7 | Catalogue screen, Session live screen |
| 8–9 | Session scope screen, fit check, gaps |
| 10 | Generation and the two Markdown artifacts |

Days 1–2 gate everything after them. If the catalogue is not written, the rest has
nothing to run against.

## Known limitation

This does not make the next build faster. It makes the third, fourth and fifth
build of a given template faster, and it makes every discovery call cheaper
starting immediately. The payoff curve is real but back-loaded, and it depends on
the catalogue being kept honest — `status` and `risks` updated after every build.
An unmaintained catalogue degrades into a filing cabinet within about a quarter.
