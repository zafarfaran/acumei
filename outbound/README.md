# Acumei Outbound

Local outbound CRM + email automation. Everything runs and stays on your machine — the only thing that leaves it are the emails you send through your own Gmail account.

## Setup (once)

```powershell
cd outbound
npm install
npm install --prefix client
copy .env.example .env   # then edit .env with your Gmail + app password
```

To get a Gmail app password: enable 2-step verification, then create one at
https://myaccount.google.com/apppasswords. Use that 16-character password in `.env`.

## Run

```powershell
cd outbound
npm run dev
```

- Dashboard: http://localhost:5180
- API: http://localhost:4571

Or build once and run as a single server (dashboard served at http://localhost:4571):

```powershell
npm run build
npm start
```

## How it works

- **Leads** — add manually or import a CSV with a header row. Recognised columns:
  `first_name, last_name, company, industry, city, email, phone, linkedin_url, pain_point, notes`
  (common aliases like `name`, `surname`, `business`, `sector`, `town`, `mobile`, `linkedin` are mapped automatically). Duplicate emails are skipped.
- **Pipeline** — cold → contacted → replied → warm → discovery → proposal → won / lost.
- **Sequences** — the two email sequences from `docs/outreach/funnel-and-templates.md` are pre-loaded and editable. Enroll a lead and emails go out on the day offsets at your configured send hour, personalised with the lead's details. Step 1 sends within a minute of enrolling.
- **Auto-stop** — moving a lead to *replied* (or any later stage) cancels their remaining queued emails.
- **Daily cap** — default 100 sends/day (change in Settings). Gmail's own limits: ~500/day personal, ~2,000/day Workspace.
- **LinkedIn** — tracked, never automated (automation violates LinkedIn ToS). Open the profile from the lead panel, message by hand, log it.

## Important

- Emails only send while the app is running. On startup it catches up on anything overdue, so opening it once a day is enough.
- Data lives in `outbound/data/outbound.sqlite` (gitignored). Back it up if you care about it.
- UK marketing law (PECR) applies to cold email — corporate (B2B) addresses are workable, but always include who you are and a way to opt out, and honour opt-outs immediately.
