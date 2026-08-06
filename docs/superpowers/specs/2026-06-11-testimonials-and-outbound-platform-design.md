# Testimonials + Local Outbound Platform — Design

Date: 2026-06-11
Status: Approved (chat), implemented same day

## Part 1 — Testimonials on the marketing site

- Owner quotes added to the three existing `CaseStudies` cards (quote + attribution matching each card's tag).
- New dedicated `Testimonials` section (`#testimonials`, label `06 — In their words`), placed after `CaseStudies` in `App.jsx`.
- 6 quotes, realistic British SMB voices, varied length and tone, name + role + business + city. No photos by design (consistent with the restrained aesthetic; avoids fake-stock-photo feel).
- Responsive rules added to `responsive.css` (3 → 2 → 1 columns).

## Part 2 — Outbound platform (`outbound/`)

Local-only CRM + email automation for cold outreach. Runs on the user's machine; nothing deployed.

### Stack

- Server: Node + Express + better-sqlite3 (file DB at `outbound/data/outbound.sqlite`, gitignored).
- Client: React + Vite dashboard (`outbound/client`), dev proxy to API on port 4571.
- Email: Nodemailer via Gmail SMTP, app password in `outbound/.env` (gitignored).
- LinkedIn: **tracking only** (user decision — LinkedIn ToS prohibits automation). Log touches manually; app links to profiles.

### Data model

`leads` (contact + pipeline stage + pain_point for personalisation), `activities` (email/call/sms/linkedin/note per lead), `sequences` + `sequence_steps` (day offsets + templates), `enrollments`, `scheduled_sends`, `settings` (from_name, daily_cap, send_hour).

Stages: cold → contacted → replied → warm → discovery → proposal → won / lost.

### Behaviour

- Sequences A and B from `docs/outreach/funnel-and-templates.md` seeded as editable templates, adapted to only use auto-resolvable placeholders: `[first name]`, `[company name]`, `[industry]`, `[city]`, `[pain point]`, `[your name]`.
- Enrolling a lead schedules sends at the configured send hour on day offsets; scheduler ticks every minute, catches up on overdue sends at startup, respects a daily cap (default 100).
- Moving a lead to `replied` or beyond cancels its pending sends automatically.
- First send auto-advances `cold` → `contacted`.
- Dashboard: Today (queue, cap usage, calls to make, warm follow-ups), Leads (CSV import, filters, detail panel with activity log), Sequences (edit templates), Settings (+ test email), Stats.

### Constraints

- Sends only fire while the app runs locally; startup catch-up makes once-a-day usage fine.
- Gmail sending limits apply (~500/day personal, 2,000/day Workspace); platform default cap is 100/day.
