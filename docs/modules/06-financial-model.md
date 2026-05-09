# Module 6: Financial Model

## Executive Summary

- **Break-even (fixed costs + minimum personal draw) requires approximately $5,400-$8,600 in monthly revenue.** Under the base case scenario, this is achieved by Month 1; under the conservative scenario, by Month 3; and under the optimistic scenario, by Month 1. The solo + AI agents model (zero contractors) keeps variable costs near zero, meaning nearly every revenue dollar contributes to covering fixed costs and personal draw.
- **The base case projects $285,100 in total Year 1 revenue with cumulative net cash flow of +$176K by Month 12**, driven by SMB project volume in Months 1-6 and a transition to combined SMB + mid-market revenue in Months 7-12. The elimination of contractor variable costs (previously 23% of mid-market Build revenue) adds approximately $29K in cash flow versus the contractor-based model.
- **The SMB-first strategy dramatically reduces cash flow risk in Months 1-5.** Unlike the mid-market-first approach where revenue might not materialize until Month 3-4, SMB projects generate revenue within weeks of launch. A starting runway of $30-50K is sufficient under all three scenarios, with the conservative scenario never dipping below $39K cash on hand. AI coding agents ($100-300/month) replace contractor costs entirely, keeping the cost structure exceptionally lean.

---

## Cost Structure

### Monthly Fixed Costs

These costs are incurred regardless of revenue and are compiled from the operational model (Module 4).

| Category | Lean (Mo 1-3) | Professional (Mo 4-6) | Growth (Mo 6+) | Notes |
|---|---|---|---|---|
| Google Workspace | $7 | $7 | $7 | Email, calendar, Drive |
| GitHub Pro | $4 | $4 | $4 | Code hosting |
| **AI Coding Agents** | **$70** | **$140** | **$220** | **Claude Code ($50-200), Cursor Pro ($20). Core delivery tools — replaces contractor costs.** |
| AI APIs (OpenAI + Anthropic) | $30 | $75 | $100 | Dev, demo, internal tools |
| Cloud infrastructure | $10 | $50 | $80 | Dev environments, demo hosting |
| Invoicing / Accounting | $0 | $19 | $33 | Wave (free) to FreshBooks |
| CRM | $0 | $0 | $14 | HubSpot free to Pipedrive |
| Project management (Notion/Linear) | $0 | $10 | $10 | Free tiers initially |
| Communication (Slack/Zoom) | $0 | $13 | $13 | Free tier Slack; Zoom Pro only if needed |
| LangSmith (AI observability) | $0 | $0 | $39 | Free tier initially |
| E&O Insurance | $100 | $150 | $200 | Professional liability |
| General Liability Insurance | $30 | $30 | $50 | Often bundled with E&O |
| Domain + hosting | $15 | $15 | $20 | Website, basic hosting |
| Legal (amortized) | $42 | $42 | $42 | $500 templates over 12 months |
| Registered agent / LLC | $15 | $15 | $15 | Entity maintenance |
| 1Password | $8 | $8 | $8 | Security hygiene |
| Backblaze backup | $7 | $7 | $7 | Machine backup |
| LinkedIn Premium | $0 | $60 | $60 | Lead research (from Mo 4) |
| QuickBooks | $0 | $15 | $15 | Bookkeeping |
| **Total Fixed Costs** | **$338** | **$660** | **$937** |
| **With buffer (+15%)** | **$389** | **$759** | **$1,078** |

**For modeling purposes, we use the following monthly fixed cost schedule:**
- Months 1-3: **$400/mo** (lean launch with modest buffer)
- Months 4-6: **$750/mo** (professional baseline — includes AI coding agents at moderate usage)
- Months 7-12: **$1,100/mo** (growth operations — includes AI coding agents at full usage)

**Note on AI coding agent costs:** The "AI Coding Agents" line item ($70-$220/month) replaces what would traditionally be contractor costs of $5,000-$20,000/month. This is the single biggest structural advantage of the solo + AI agents model — the cost of the "development team" is a fixed $100-300/month instead of a variable $0-$20,000/month that scales with project volume.

### Personal Draw

| Level | Monthly Amount | Annual | Rationale |
|---|---|---|---|
| **Minimum survival** | $5,000 | $60,000 | Covers basic living expenses; requires existing savings buffer |
| **Target comfortable** | $10,000 | $120,000 | Sustainable long-term; approximate parity with senior employee compensation |
| **Stretch (Month 9+)** | $15,000 | $180,000 | Reward for business traction; enables savings rebuilding |

**For modeling, personal draw schedule:**
- Months 1-3: $5,000/mo (minimum — preserving runway)
- Months 4-6: $5,000/mo conservative / $7,500 base / $7,500 optimistic
- Months 7-12: $7,500 conservative / $10,000 base / $12,500 optimistic

### Variable Costs per Project Type

Variable costs are incurred only when delivering client work. In the solo founder + AI agents model, variable costs are dramatically lower than a contractor-based model because AI coding agent subscriptions are a fixed monthly cost (captured in fixed costs above), not a per-project variable cost. The only true variable costs are API/compute charges for LLM calls and cloud infrastructure used during project delivery.

**SMB Project Variable Costs:**

| Service | API/LLM Cost | Infra/Compute Cost | Total Variable Cost | As % of Revenue |
|---|---|---|---|---|
| **Free Discovery Call (SMB)** | $0 | $0 | $0 | N/A (no revenue) |
| **SMB Custom Build ($1-5K)** | $5-15 | $0-5 | $5-20 | 0.2-0.8% of $2,500 avg |
| **SMB Support Retainer (/mo)** | $5-10 | $0-5 | $5-15 | 2-5% of $300/mo avg |

**Mid-Market Project Variable Costs (Phase 2, Month 6+):**

| Service | API/LLM Cost | Infra/Compute Cost | Total Variable Cost | As % of Revenue |
|---|---|---|---|---|
| **Free AI Opportunity Scan** | $0 | $0 | $0 | N/A (no revenue) |
| **AI Diagnostic (Mid-Market)** | $50 | $50 | $100 | 0.7% of $15,000 |
| **AI Brain Build (Mid-Market, solo + AI agents)** | $200-400 | $100-200 | $300-600 | 0.4-0.9% of $70,000 |
| **AI Strategy & Adoption (Mid-Market)** | $50 | $50 | $100 | 0.4% of $25,000 |
| **AI Brain Support (Mid-Market, /mo)** | $50-100 | $50-100 | $100-200 | 1.7-3.3% of $6,000/mo |

**Blended variable cost assumptions for modeling:**
- SMB builds: **0.5% of revenue** (near-zero; just API costs for LLM calls during development)
- SMB retainers: **3% of revenue** (minimal ongoing API/monitoring costs)
- Mid-market Diagnostics: **0.7% of revenue** (primarily founder-delivered, minimal compute)
- Mid-market Builds: **0.7% of revenue** (solo + AI agent delivery; no contractor costs — a dramatic reduction from the 23% contractor-augmented model)
- Mid-market Strategy: **0.4% of revenue**
- Mid-market Support retainers: **2.5% of revenue**

**Margin impact of eliminating contractors:**

The single most significant financial difference in the solo + AI agents model is the elimination of contractor variable costs on mid-market Builds. Under the previous contractor-augmented model, a $70,000 Build carried ~$16,200 in variable costs (23% of revenue). Under the solo + AI agents model, the same Build carries ~$300-600 in variable costs (<1% of revenue). This transforms mid-market Build gross margins from **~77% to ~99%** on a direct cost basis. Even accounting for the founder's time at $200/hr opportunity cost (which is not a cash cost), the effective gross margin is dramatically higher.

For SMB builds, the change is smaller but still meaningful: variable costs drop from 3% to 0.5%, pushing SMB gross margins from 85-90% to 92-95%+ on a direct cost basis.

### Total Monthly Burn (Pre-Revenue)

| Component | Months 1-3 | Months 4-6 | Months 7-12 |
|---|---|---|---|
| Fixed costs (incl. AI agent subs) | $400 | $750 | $1,100 |
| Personal draw (minimum) | $5,000 | $5,000 | $7,500 |
| **Total monthly burn** | **$5,400** | **$5,750** | **$8,600** |

**Note:** Monthly burn is marginally higher than a hypothetical zero-tooling model because of AI agent subscriptions ($70-$220/month), but this is trivially small compared to the revenue-generating capacity those tools provide. The absence of contractor variable costs means that actual cash outflow during delivery months is far lower than a contractor-based model — a $70K Build no longer triggers $15K+ in contractor payments.

---

## Revenue Model

### SMB Revenue Assumptions (Phase 1 — Months 1-6, continuing through Month 12)

| Parameter | Value | Rationale |
|---|---|---|
| Average project size | $2,500 | Mix of $1-5K projects; most cluster around $2-3K |
| SMB support retainer | $300/mo average | Range $200-$500/mo; most local businesses start at $200-$300 |
| Discovery calls per month | 8-12 | Local networking, word of mouth, chamber events |
| Discovery → project conversion | 30-40% | Lower friction than mid-market; price point is approachable |
| Average delivery time | 1-3 days | Simple automations; founder + AI agents deliver 2-3x faster than solo |
| Gross margin on builds | 85-92% | Solo + AI agent delivery, near-zero variable costs (just API calls ~$5-20/project) |
| Retainer conversion | 40-50% | Not all SMB clients need ongoing support |

**SMB project ramp (base case):**
- Month 1: 2-3 projects
- Month 2: 3-4 projects
- Month 3: 4-5 projects
- Month 4-6: 5-7 projects/month (steady state)
- Month 7-12: 3-5 projects/month (reduced as mid-market work begins)

### Mid-Market Revenue Assumptions (Phase 2 — Months 6-12)

Based on Module 3 recommended pricing, using midpoints for modeling:

| Service | Price Range | Model Midpoint | Typical Duration |
|---|---|---|---|
| Free AI Opportunity Scan | $0 | $0 | 1 week |
| AI Diagnostic | $10,000-$20,000 | $15,000 | 3-4 weeks |
| AI Brain Build | $40,000-$100,000 | $70,000 | 6-8 weeks |
| AI Strategy & Adoption | $15,000-$35,000 | $20,000 | 3-4 weeks |
| AI Brain Support | $4,000-$8,000/mo | $6,000/mo | Ongoing |

**Note on early mid-market pricing:** First 2-3 mid-market clients receive "founding client" pricing at a 25% discount. This reduces the effective Diagnostic to ~$11,250 and Build to ~$52,500 for initial engagements.

### Funnel Conversion Rates

**SMB Funnel:**

| Stage Transition | Conservative | Base Case | Optimistic |
|---|---|---|---|
| Discovery Call → Paid Project | 30% | 35% | 40% |
| Project → Support Retainer | 35% | 45% | 50% |

**Mid-Market Funnel (Phase 2):**

| Stage Transition | Conservative | Base Case | Optimistic |
|---|---|---|---|
| Free Scan to Diagnostic | 20% | 28% | 35% |
| Diagnostic to Build | 45% | 55% | 65% |
| Build to Support Retainer | 55% | 65% | 75% |
| Build to Strategy (bundle) | 30% | 45% | 55% |

### Revenue per Client Over 12 Months

**SMB client (project + retainer):**

| Service | Revenue | Timeline |
|---|---|---|
| Discovery Call | $0 | Day 1 |
| Custom Build | $2,500 (avg) | Day 2-10 |
| Support Retainer (10 months @ $300) | $3,000 | Months 2-12 |
| **Total 12-month LTV** | **$5,500** | |

**SMB client (project only):**
- Revenue: $2,500

**Mid-market full-ladder client (Scan → Diagnostic → Build → Strategy → Support):**

| Service | Revenue | Timeline |
|---|---|---|
| Free Scan | $0 | Month 0 |
| Diagnostic | $15,000 | Month 1-2 |
| Build | $70,000 | Month 2-5 |
| Strategy (bundled) | $20,000 | Month 4-5 |
| Support (7 months @ $6,000) | $42,000 | Month 6-12 |
| **Total 12-month LTV** | **$147,000** | |

### MRR Trajectory from Retainers

Retainer revenue compounds from two sources: SMB retainers ($300/mo avg) and mid-market retainers ($6,000/mo avg).

| Source | Count | Monthly MRR | Annual Run-Rate |
|---|---|---|---|
| 5 SMB retainers | 5 | $1,500 | $18,000 |
| 10 SMB retainers | 10 | $3,000 | $36,000 |
| 1 mid-market retainer | 1 | $6,000 | $72,000 |
| 10 SMB + 1 mid-market | 11 | $9,000 | $108,000 |
| 15 SMB + 2 mid-market | 17 | $16,500 | $198,000 |

---

## 12-Month Projections

### Assumptions Common to All Scenarios

- **Starting runway:** $40,000 (midpoint of $30-50K range)
- **SMB-first phasing:** Months 1-6 are SMB-only or SMB-primary; mid-market enters in Phase 2
- **SMB revenue recognized:** In the month the project is delivered (3-14 day delivery cycles)
- **SMB retainer revenue:** Recognized monthly, starting the month after project delivery
- **Mid-market Diagnostic revenue recognized:** In the month the project is delivered
- **Mid-market Build revenue recognized:** Split across 2 months (50/50)
- **Variable costs:** Recognized in the same month as revenue
- **First 2-3 mid-market clients:** Founding client pricing (25% discount on Diagnostics and Builds)

### Conservative Scenario

**Narrative:** Slow local networking start. The founder's local network is thin and takes time to build. Discovery call volume ramps slowly. SMB conversion rate is at the low end (30%). Mid-market does not appear until Month 8. No mid-market Build closes in Year 1, only Diagnostics.

**Key milestones:**
- Month 1: First local networking events; 2 SMB projects from early contacts
- Month 2-3: Ramp to 3-4 SMB projects/month; first retainers start
- Month 4-6: Steady state at 4-5 SMB projects/month; retainer base growing
- Month 7-8: Begin mid-market outreach using SMB portfolio; first free scans
- Month 9-10: First mid-market Diagnostic closes ($11,250 founding-client price)
- Month 11-12: Second mid-market Diagnostic; SMB continues at reduced pace

| Month | Discovery Calls | New SMB Projects | SMB Project Revenue | Active SMB Retainers | SMB MRR | Mid-Market Revenue | Total Revenue | Fixed Costs | Variable Costs | Personal Draw | Net Cash Flow | Cumulative |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 2 | $5,000 | 0 | $0 | $0 | $5,000 | $400 | $34 | $5,000 | -$434 | -$434 |
| 2 | 7 | 2 | $5,000 | 1 | $300 | $0 | $5,300 | $400 | $34 | $5,000 | -$134 | -$568 |
| 3 | 8 | 3 | $7,500 | 2 | $600 | $0 | $8,100 | $400 | $56 | $5,000 | $2,644 | $2,076 |
| 4 | 8 | 3 | $7,500 | 3 | $900 | $0 | $8,400 | $750 | $65 | $5,000 | $2,585 | $4,661 |
| 5 | 9 | 4 | $10,000 | 4 | $1,200 | $0 | $11,200 | $750 | $86 | $5,000 | $5,364 | $10,025 |
| 6 | 9 | 4 | $10,000 | 5 | $1,500 | $0 | $11,500 | $750 | $95 | $5,000 | $5,655 | $15,680 |
| 7 | 9 | 4 | $10,000 | 6 | $1,800 | $0 | $11,800 | $1,100 | $104 | $7,500 | $3,096 | $18,776 |
| 8 | 8 | 3 | $7,500 | 7 | $2,100 | $0 | $9,600 | $1,100 | $101 | $7,500 | $899 | $19,675 |
| 9 | 8 | 3 | $7,500 | 7 | $2,100 | $11,250 | $20,850 | $1,100 | $134 | $7,500 | $12,116 | $31,791 |
| 10 | 8 | 3 | $7,500 | 8 | $2,400 | $0 | $9,900 | $1,100 | $110 | $7,500 | $1,190 | $32,981 |
| 11 | 8 | 3 | $7,500 | 8 | $2,400 | $11,250 | $21,150 | $1,100 | $134 | $7,500 | $12,416 | $45,397 |
| 12 | 8 | 3 | $7,500 | 9 | $2,700 | $0 | $10,200 | $1,100 | $118 | $7,500 | $1,482 | $46,879 |
| **Total** | **96** | **37** | **$92,500** | — | **$18,000** | **$22,500** | **$133,000** | **$9,050** | **$1,071** | **$77,000** | — | **$46,879** |

**Note:** SMB retainer count reflects a 35% project-to-retainer conversion with ~5% monthly churn. Variable costs are dramatically lower than a contractor-based model — only API/LLM usage costs (~0.5% of SMB revenue, ~0.7% of mid-market revenue). AI coding agent subscriptions are captured in fixed costs.

**Conservative scenario notes:**
- Total Year 1 revenue: **$133,000** (SMB projects: $92,500 + SMB retainers: $18,000 + Mid-market: $22,500)
- Total costs (fixed + variable + draw): **$87,121**
- Net cash position at Month 12: **$86,879** (starting from $40K runway = +$47K net gain)
- Lowest cumulative point: **-$568** (Month 2) — runway never drops below $39,432
- Break-even month (revenue > monthly costs): **Month 3** (SMB volume covers minimum burn)
- Sustained break-even: **Month 3**
- Active SMB retainers at Month 12: **9** ($2,700/mo MRR)
- Mid-market Diagnostics sold: **2** ($22,500)
- **Effective gross margin (SMB builds): ~92%** (up from ~75-85% in contractor model)
- **Effective gross margin (Mid-market Diagnostics): ~99%** (solo-delivered, near-zero variable costs)

**Revenue breakdown:**
- SMB project revenue: $92,500 (70%)
- SMB retainer revenue: $18,000 (14%)
- Mid-market Diagnostics: $22,500 (17%)

### Base Case Scenario

**Narrative:** Reasonable local networking execution. The founder joins a BNI chapter and the local chamber; referrals start flowing by Month 2-3. Discovery calls ramp to 10-12/month by Month 3. SMB conversion at 35%. Mid-market outreach begins Month 5, first Diagnostic closes Month 6-7. First mid-market Build starts Month 9.

**Key milestones:**
- Month 1: 3 SMB projects from networking and personal contacts
- Month 2-3: 4-5 SMB projects/month; first retainers; word of mouth kicks in
- Month 4-5: 6-7 SMB projects/month; steady state; begin mid-market outreach
- Month 6-7: First mid-market Diagnostic ($11,250 founding-client price); SMB continues
- Month 8-9: Second mid-market Diagnostic; first mid-market Build begins ($52,500)
- Month 10-12: Mid-market Build delivers; second Build starts; SMB at reduced pace

| Month | Discovery Calls | New SMB Projects | SMB Project Revenue | Active SMB Retainers | SMB MRR | Mid-Market Revenue | Total Revenue | Fixed Costs | Variable Costs | Personal Draw | Net Cash Flow | Cumulative |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 8 | 3 | $7,500 | 0 | $0 | $0 | $7,500 | $400 | $49 | $5,000 | $2,051 | $2,051 |
| 2 | 9 | 3 | $7,500 | 1 | $300 | $0 | $7,800 | $400 | $47 | $5,000 | $2,353 | $4,404 |
| 3 | 10 | 4 | $10,000 | 2 | $600 | $0 | $10,600 | $400 | $68 | $5,000 | $5,132 | $9,536 |
| 4 | 11 | 5 | $12,500 | 3 | $900 | $0 | $13,400 | $750 | $90 | $7,500 | $5,060 | $14,596 |
| 5 | 12 | 5 | $12,500 | 5 | $1,500 | $0 | $14,000 | $750 | $108 | $7,500 | $5,642 | $20,238 |
| 6 | 11 | 5 | $12,500 | 6 | $1,800 | $11,250 | $25,550 | $750 | $147 | $7,500 | $17,153 | $37,391 |
| 7 | 10 | 4 | $10,000 | 7 | $2,100 | $15,000 | $27,100 | $1,100 | $155 | $10,000 | $15,845 | $53,236 |
| 8 | 10 | 4 | $10,000 | 8 | $2,400 | $0 | $12,400 | $1,100 | $122 | $10,000 | $1,178 | $54,414 |
| 9 | 10 | 4 | $10,000 | 9 | $2,700 | $26,250 | $38,950 | $1,100 | $248 | $10,000 | $27,602 | $82,016 |
| 10 | 9 | 3 | $7,500 | 10 | $3,000 | $26,250 | $36,750 | $1,100 | $222 | $10,000 | $25,428 | $107,444 |
| 11 | 9 | 3 | $7,500 | 10 | $3,000 | $26,250 + $11,250 | $48,000 | $1,100 | $296 | $10,000 | $36,604 | $144,048 |
| 12 | 9 | 3 | $7,500 | 11 | $3,300 | $26,250 + $6,000 | $43,050 | $1,100 | $270 | $10,000 | $31,680 | $175,728 |
| **Total** | **118** | **46** | **$115,000** | — | **$21,600** | **$148,500** | **$285,100** | **$9,050** | **$1,822** | **$97,500** | — | **$175,728** |

**Note:** Mid-market revenue in Months 9-12 includes Build revenue split 50/50 across months, second Diagnostic in Month 11, and first mid-market retainer starting Month 12. SMB retainer count reflects 45% conversion with ~5% monthly churn. Variable costs reflect the solo + AI agents model — only API/LLM charges, no contractor costs. AI coding agent subscriptions are captured in fixed costs.

**Base case notes:**
- Total Year 1 revenue: **$285,100** (SMB projects: $115,000 + SMB retainers: $21,600 + Mid-market: $148,500)
- Total costs (fixed + variable + draw): **$108,372**
- Net cash position at Month 12: **$215,728** (starting from $40K runway = +$176K net gain)
- Lowest cumulative point: **+$2,051** (Month 1) — runway never drops below $42,051
- Break-even month: **Month 1** (SMB revenue covers minimum burn from first month)
- Sustained break-even: **Month 1**
- Active SMB retainers at Month 12: **11** ($3,300/mo MRR)
- Active mid-market retainers at Month 12: **1** ($6,000/mo MRR)
- Total MRR at Month 12: **$9,300**
- **Effective gross margin (SMB builds): ~92%** (up from ~75-85%)
- **Effective gross margin (Mid-market Builds): ~99%** on direct costs (up from ~77% with contractors)
- **Net cash improvement vs. contractor model: +$28,500** (from eliminated contractor variable costs)

**Revenue breakdown:**
- SMB project revenue: $115,000 (40%)
- SMB retainer revenue: $21,600 (8%)
- Mid-market Diagnostics: 3 x avg $12,500 = $37,500 (13%)
- Mid-market Builds: 2 x $52,500 = $105,000 (37%)
- Mid-market Retainers: $6,000 (2%)

### Optimistic Scenario

**Narrative:** Strong local presence. The founder has existing local contacts or is naturally good at networking. BNI chapter produces referrals quickly. Word of mouth accelerates by Month 3. SMB conversion at 40%. Mid-market outreach begins Month 4, first Diagnostic closes Month 5-6. Enterprise lead materializes through a former colleague by Month 8. Two mid-market Builds close in Year 1.

**Key milestones:**
- Month 1: 4 SMB projects from immediate network and aggressive networking
- Month 2-3: 5-7 SMB projects/month; retainers accumulating fast
- Month 4-5: 7+ SMB projects/month; begin mid-market outreach; first mid-market Diagnostic ($11,250)
- Month 5-6: First mid-market Build begins ($52,500); steady SMB continues
- Month 7-8: Second mid-market Diagnostic ($15,000 full price); second Build begins ($65,000)
- Month 9-10: Enterprise Diagnostic ($30,000); mid-market retainers starting
- Month 11-12: Enterprise Build ($75,000 first half); growing retainer base

| Month | Discovery Calls | New SMB Projects | SMB Project Revenue | Active SMB Retainers | SMB MRR | Mid-Market Revenue | Total Revenue | Fixed Costs | Variable Costs | Personal Draw | Net Cash Flow | Cumulative |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 10 | 4 | $10,000 | 0 | $0 | $0 | $10,000 | $400 | $62 | $5,000 | $4,538 | $4,538 |
| 2 | 11 | 5 | $12,500 | 2 | $600 | $0 | $13,100 | $400 | $81 | $5,000 | $7,619 | $12,157 |
| 3 | 12 | 5 | $12,500 | 4 | $1,200 | $0 | $13,700 | $400 | $99 | $5,000 | $8,201 | $20,358 |
| 4 | 12 | 6 | $15,000 | 5 | $1,500 | $0 | $16,500 | $750 | $120 | $7,500 | $8,130 | $28,488 |
| 5 | 12 | 7 | $17,500 | 7 | $2,100 | $11,250 | $30,850 | $750 | $175 | $7,500 | $22,425 | $50,913 |
| 6 | 11 | 6 | $15,000 | 8 | $2,400 | $26,250 | $43,650 | $750 | $262 | $7,500 | $35,138 | $86,051 |
| 7 | 10 | 5 | $12,500 | 9 | $2,700 | $26,250 + $15,000 | $56,450 | $1,100 | $351 | $12,500 | $42,499 | $128,550 |
| 8 | 10 | 4 | $10,000 | 10 | $3,000 | $32,500 | $45,500 | $1,100 | $293 | $12,500 | $31,607 | $160,157 |
| 9 | 10 | 4 | $10,000 | 11 | $3,300 | $32,500 + $30,000 | $75,800 | $1,100 | $502 | $12,500 | $61,698 | $221,855 |
| 10 | 9 | 3 | $7,500 | 12 | $3,600 | $6,000 | $17,100 | $1,100 | $143 | $12,500 | $3,357 | $225,212 |
| 11 | 9 | 3 | $7,500 | 12 | $3,600 | $37,500 + $12,000 | $60,600 | $1,100 | $388 | $12,500 | $46,612 | $271,824 |
| 12 | 9 | 3 | $7,500 | 13 | $3,900 | $37,500 + $12,000 | $60,900 | $1,100 | $395 | $12,500 | $46,905 | $318,729 |
| **Total** | **125** | **55** | **$137,500** | — | **$27,900** | **$294,000** | **$459,400** | **$9,050** | **$2,871** | **$120,000** | — | **$318,729** |

**Note:** Mid-market revenue in Months 5-12 includes two standard Builds ($52,500 and $65,000), one enterprise engagement ($30K Diagnostic + $75K first-half Build revenue), Strategy bundled with Builds, and growing retainer base. SMB retainer count reflects 50% conversion with ~5% monthly churn. Variable costs reflect the solo + AI agents model — only API/LLM charges, no contractor costs.

**Optimistic scenario notes:**
- Total Year 1 revenue: **$459,400** (SMB projects: $137,500 + SMB retainers: $27,900 + Mid-market: $294,000)
- Total costs (fixed + variable + draw): **$131,921**
- Net cash position at Month 12: **$358,729** (starting from $40K runway = +$319K net gain)
- Lowest cumulative point: **Never negative** — positive from Month 1
- Break-even month: **Month 1** (immediate SMB revenue)
- Active SMB retainers at Month 12: **13** ($3,900/mo MRR)
- Active mid-market retainers at Month 12: **2** ($12,000/mo MRR)
- Total MRR at Month 12: **$15,900**
- **Net cash improvement vs. contractor model: +$56,811** (from eliminated contractor variable costs)
- **Effective gross margin (blended): ~99%** on direct costs; ~71% including founder's imputed time

**Revenue breakdown:**
- SMB project revenue: $137,500 (30%)
- SMB retainer revenue: $27,900 (6%)
- Mid-market Diagnostics: 3 x avg $18,750 = $56,250 (12%)
- Mid-market Builds: 3 x avg $64,167 = $192,500 (42%)
- Mid-market Strategy (bundled): $20,000 (4%)
- Mid-market Retainers: $24,000 (5%)
- Enterprise premium: Included in mid-market totals above

---

## Scenario Comparison Summary

| Metric | Conservative | Base Case | Optimistic |
|---|---|---|---|
| **Total Year 1 Revenue** | $133,000 | $285,100 | $459,400 |
| **SMB Revenue (Months 1-6)** | $52,100 | $74,900 | $105,350 |
| **Mid-Market Revenue (Months 7-12)** | $22,500 | $148,500 | $294,000 |
| **Total Costs (incl. draw)** | $87,121 | $108,372 | $131,921 |
| **Net Cash at Month 12** | $86,879 | $215,728 | $358,729 |
| **Lowest Runway Point** | $39,432 (Mo 2) | $42,051 (Mo 1) | Never below $44K |
| **First Revenue Month** | Month 1 | Month 1 | Month 1 |
| **Sustained Break-Even** | Month 3 | Month 1 | Month 1 |
| **Total SMB Projects Delivered** | 37 | 46 | 55 |
| **Mid-Market Diagnostics Sold** | 2 | 3 | 3 |
| **Mid-Market Builds Delivered** | 0 | 2 | 3 |
| **Active SMB Retainers (Mo 12)** | 9 | 11 | 13 |
| **Active Mid-Market Retainers (Mo 12)** | 0 | 1 | 2 |
| **Total MRR at Month 12** | $2,700 | $9,300 | $15,900 |
| **Avg Monthly Revenue (Mo 7-12)** | $13,917 | $34,375 | $52,725 |
| **Total Personal Draw** | $77,000 | $97,500 | $120,000 |
| **First Mid-Market Revenue Month** | Month 9 | Month 6 | Month 5 |
| **Effective Gross Margin (SMB)** | ~92% | ~92% | ~92% |
| **Effective Gross Margin (Mid-Market Builds)** | N/A (no builds) | ~99% | ~99% |
| **Variable Costs (Total Year 1)** | $1,071 | $1,822 | $2,871 |
| **Contractor Costs (Total Year 1)** | $0 | $0 | $0 |

---

## Break-Even Analysis

### Monthly Break-Even Calculation

Break-even is the point at which monthly revenue covers all costs including the founder's personal draw.

**Minimum break-even (Months 1-3):**
- Fixed costs: $400
- Personal draw (minimum): $5,000
- **Total: $5,400/mo**

**Professional break-even (Months 4-6):**
- Fixed costs: $750 (includes AI coding agent subscriptions)
- Personal draw: $5,000-$7,500
- Variable costs (estimated at ~0.5-1% of revenue at break-even): ~$50-$80
- **Total: ~$5,800-$8,330/mo**

**Growth break-even (Months 7-12):**
- Fixed costs: $1,100 (includes AI coding agents at full usage)
- Personal draw (target): $10,000
- Variable costs at break-even: ~$100 (blended SMB + mid-market, near-zero per project)
- **Total: ~$11,200/mo**

**Note:** Break-even thresholds are marginally lower than a contractor-based model because variable costs are near-zero. The founder keeps ~99% of each revenue dollar as gross margin (before fixed costs and personal draw). This means every additional project drops nearly all its revenue straight to the bottom line.

### Break-Even by SMB Client Configuration (Phase 1)

How many SMB projects and retainers are needed to reach break-even at the $5,400/mo minimum:

| Configuration | Monthly Revenue | Meets Break-Even? |
|---|---|---|
| 2 SMB projects ($2,500 avg) only | $5,000 | No — covers 93% |
| 2 SMB projects + 2 retainers ($300/mo) | $5,600 | Yes — 104% |
| 3 SMB projects only | $7,500 | Yes — 139% |
| 4 SMB projects + 3 retainers | $10,900 | Yes — 202% |
| 5 SMB projects + 5 retainers | $14,000 | Yes — 259% |
| **Target steady state: 5-7 projects + 8-10 retainers** | **$15,400-$20,500** | **Yes — 285-380%** |

### Break-Even by Mixed Configuration (Phase 2, Months 7-12)

At the $11,750/mo growth break-even:

| Configuration | Monthly Revenue | Meets Break-Even? |
|---|---|---|
| 4 SMB projects + 8 SMB retainers only | $12,400 | Yes — 105% |
| 3 SMB projects + 8 SMB retainers + 1 mid-market retainer | $15,900 | Yes — 135% |
| 3 SMB projects + 10 SMB retainers + 1 mid-market Diagnostic/quarter | $15,500 | Yes — 132% |
| **Target: 3-4 SMB projects + 10 retainers + 1 Build (over 2 mo)** | **$47,400-$52,000/mo** | **Yes — 400%+** |

### Break-Even Month by Scenario

| Scenario | First Revenue | First Month Revenue > Costs | Sustained (3+ consecutive months) |
|---|---|---|---|
| Conservative | Month 1 | Month 3 ($8,100 > $5,400) | Month 3 |
| Base Case | Month 1 | Month 1 ($7,500 > $5,400) | Month 1 |
| Optimistic | Month 1 | Month 1 ($10,000 > $5,400) | Month 1 |

### Cumulative Break-Even (Recoup All Prior Losses)

The point at which cumulative net cash flow turns positive (meaning all prior months' losses have been recovered):

| Scenario | Cumulative Break-Even Month | Total Investment Before Positive |
|---|---|---|
| Conservative | Month 3 (cumulative: +$1,603) | $824 |
| Base Case | Month 1 (cumulative: +$1,875) | $0 |
| Optimistic | Month 1 (cumulative: +$4,300) | $0 |

**Key advantage of SMB-first:** Even the conservative scenario reaches cumulative break-even by Month 3, compared to Month 5 in the previous mid-market-first model. The cash gap risk is nearly eliminated.

---

## Cash Flow Timeline

### Starting Runway Depletion

**Assumption:** $40,000 starting runway (cash in bank at Month 0).

| Month | Conservative (Cash on Hand) | Base Case (Cash on Hand) | Optimistic (Cash on Hand) |
|---|---|---|---|
| 0 | $40,000 | $40,000 | $40,000 |
| 1 | $39,566 | $42,051 | $44,538 |
| 2 | $39,432 | $44,404 | $52,157 |
| 3 | $42,076 | $49,536 | $60,358 |
| 4 | $44,661 | $54,596 | $68,488 |
| 5 | $50,025 | $60,238 | $90,913 |
| 6 | $55,680 | $77,391 | $126,051 |
| 7 | $58,776 | $93,236 | $168,550 |
| 8 | $59,675 | $94,414 | $200,157 |
| 9 | $71,791 | $122,016 | $261,855 |
| 10 | $72,981 | $147,444 | $265,212 |
| 11 | $85,397 | $184,048 | $311,824 |
| 12 | $86,879 | $215,728 | $358,729 |

### Danger Zone Identification

The "danger zone" is when cash on hand drops below 2 months of minimum burn ($5,400 x 2 = $10,800):

| Scenario | Enters Danger Zone? | Lowest Point | Months in Danger Zone |
|---|---|---|---|
| Conservative | **No** — lowest is $39,432 (Month 2) | $39,432 | 0 |
| Base Case | **No** — cash grows from Month 1 | $40,000 (start) | 0 |
| Optimistic | **No** — cash grows from Month 1 | $40,000 (start) | 0 |

**What if starting runway is only $30,000?**

| Scenario | Enters Danger Zone? | Lowest Point | Risk Level |
|---|---|---|---|
| Conservative | **No** — lowest is $29,432 (Month 2) | $29,432 | Low |
| Base Case | **No** — grows from Month 1 | $32,051 | Negligible |
| Optimistic | **No** | $34,538+ always | Negligible |

**What if starting runway is only $20,000?**

| Scenario | Enters Danger Zone? | Lowest Point | Risk Level |
|---|---|---|---|
| Conservative | **No** — lowest is $19,432 (Month 2) | $19,432 | Low-Medium |
| Base Case | **No** — grows from Month 1 | $22,051 | Low |
| Optimistic | **No** | $24,538+ always | Negligible |

**Minimum recommended runway: $30,000.** The SMB-first model is dramatically less capital-intensive than the mid-market-first approach. Even with only $20K, the conservative scenario maintains $19K+ at the lowest point — enough for 3.5 months of minimum burn. Starting with $40,000 is preferred for psychological comfort and to cover any unexpected delays, but the financial risk is low.

### Cash Flow Risk Factors

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| SMB demand lower than expected (50% of plan) | Extends ramp by 2-3 months; $5K-$10K less revenue in Months 1-3 | Medium (25%) | Expand geographic radius; add digital channels (Facebook groups, Nextdoor); offer first 2-3 projects at steep discount to build references |
| SMB clients slow to pay | One-time $2-5K timing gap per late payer | Low (15%) | Require 50% upfront; remainder on delivery; use simple invoicing with online payment |
| Mid-market Phase 2 delayed by 3+ months | $30-60K less revenue in Year 1; business remains viable on SMB alone | Medium (30%) | Continue SMB at full pace; do not reduce SMB volume prematurely; mid-market is upside, not survival |
| SMB retainer churn higher than expected (>10%/mo) | $1K-$2K/mo less MRR than modeled | Medium (25%) | Demonstrate value monthly; offer retainer "pause" rather than cancel; check in proactively |
| Scope creep on SMB projects | $500-$1,000 in unreimbursed time per project | High (35%) | Fixed-price proposals with clear scope; change order process even at SMB level; learn to say no |
| Two mid-market projects overlap (capacity risk) | Overcommitment, quality risk | Low (15%) | Stagger start dates; temporarily reduce SMB volume; consider this as first hire trigger if recurring |

---

## Key Metrics to Track

### 1. Discovery Call Volume (SMB — Phase 1 Primary Metric)

**What it is:** Number of free 30-45 minute discovery calls conducted per month with local business owners.

| Signal | "Good" | "Warning" |
|---|---|---|
| Discovery calls per month | 10-12 | Below 6 (lead generation channels underperforming) |
| Discovery call sources | 3+ sources (networking, referrals, digital) | Single-source dependency |
| Discovery → project conversion | 35%+ | Below 25% (qualification or pitch issue) |

**Action triggers:**
- If calls per month drop below 6: Attend more networking events; post in local Facebook groups; ask every completed client for 2 referrals
- If conversion drops below 25%: Review discovery call structure; check if pricing is causing friction; assess whether leads are qualified

### 2. SMB Project Velocity

**What it is:** Number of SMB projects completed per month and average delivery time.

| Signal | "Good" | "Warning" |
|---|---|---|
| Projects completed per month | 5-7 (steady state) | Below 3 (demand or capacity issue) |
| Average delivery time | 3-7 days | Above 14 days (scope creep or overcommitment) |
| Average project revenue | $2,500+ | Below $1,500 (gravitating toward lowest-price work) |

### 3. Pipeline Value (Blended — Phase 2)

**What it is:** Total dollar value of all prospects at each stage of the funnel, weighted by conversion probability.

**How to calculate (Phase 2):**
- Free Scans completed x 28% conversion x $15,000 avg Diagnostic = Weighted Diagnostic pipeline
- Active Diagnostics x 55% conversion x $70,000 avg Build = Weighted Build pipeline
- Sum all weighted values

| Signal | "Good" | "Warning" |
|---|---|---|
| Weighted pipeline value | 3x+ next quarter's mid-market revenue target | Less than 1.5x next quarter's target |
| Pipeline-to-close ratio | Closing 25%+ of weighted pipeline | Closing less than 15% |
| Time in pipeline stage | Deals moving within 4-6 weeks | Deals stalling for 8+ weeks |

### 4. Monthly Recurring Revenue (MRR)

**What it is:** Total retainer revenue committed on a monthly basis (SMB + mid-market combined). The single most important metric for business stability.

| Signal | "Good" | "Warning" |
|---|---|---|
| MRR absolute value | $3,000+/mo (10+ SMB retainers) by Month 6 | Below $1,500/mo by Month 6 |
| MRR from SMB retainers | Adding 1-2 new retainers per month | Flat or declining for 2+ consecutive months |
| MRR churn (SMB) | Less than 8%/mo | Above 12%/mo (retainers churning within 2-3 months) |
| Combined MRR by Month 12 | $9,000+ (base case target) | Below $5,000 |

**Target trajectory:**
- Month 3: $600 MRR (2 SMB retainers)
- Month 6: $1,800-$3,000 MRR (6-10 SMB retainers)
- Month 9: $5,000-$9,000 MRR (SMB retainers + first mid-market retainer)
- Month 12: $9,000-$16,000 MRR (10-13 SMB retainers + 1-2 mid-market retainers)

### 5. Utilization Rate

**What it is:** Percentage of total working hours spent on billable client work (delivery + support).

| Signal | "Good" | "Warning" |
|---|---|---|
| Utilization rate | 60-75% | Below 50% (underbooked — activate sales) |
| Utilization rate | 60-75% | Above 80% (overbooked — pipeline building neglected) |
| Billable hours per week | 25-33 hrs (of 40-45 total) | Below 20 hrs (revenue risk) or above 36 hrs (burnout risk) |
| Non-billable allocation | 25-40% on sales, networking, admin, professional dev | Below 15% (business maintenance deferred) |

**The utilization trap:** High utilization (80%+) feels productive but is dangerous. It means no time for networking, discovery calls, or proposal writing. Two months at 80%+ utilization almost always precedes a revenue gap 2-3 months later when the pipeline is empty.

### 6. Gross Margin

**What it is:** (Revenue - Direct Costs) / Revenue, measured per engagement and as a blended monthly figure.

| Signal | "Good" | "Warning" |
|---|---|---|
| SMB build gross margin | 85%+ (solo + AI agents) | Below 80% (spending too many hours per project or scope creep) |
| SMB retainer gross margin | 90%+ | Below 80% (over-servicing retainer clients) |
| Mid-market Diagnostic gross margin | 85%+ (solo-delivered) | Below 75% (spending too many hours) |
| Mid-market Build gross margin | 80%+ (solo + AI agents) | Below 70% (scope creep or underpriced) |
| Blended monthly margin | 85%+ (direct cost basis) | Below 75% (something is structurally wrong — check for hidden costs) |
| Trend direction | Margins improving quarter-over-quarter (templatization effect) | Margins declining (scope creep, pricing erosion, AI API cost inflation) |

**Margin improvement levers:**
- Templatize common SMB builds: Reduce founder hours from 4-12 to 2-6 per project using AI-generated templates and reusable components, pushing effective margin toward 95%+
- Build reusable AI agent prompts/workflows: Common project types (chatbots, form automation, data pipelines) get standardized AI agent workflows that produce 80% of the deliverable in the first pass
- Bundle SMB retainers efficiently: Group check-ins and maintenance across multiple SMB clients into weekly batches
- Mid-market: Templatize Diagnostics, componentize Builds with reusable AI-generated modules, bundle Strategy with Builds

---

## Financial Decision Framework

### Monthly Financial Review Checklist

At the end of each month, evaluate these decision triggers:

| Metric | Threshold | Action |
|---|---|---|
| Cash on hand < 3 months burn | < $16,200-$25,500 | **Red alert.** Cut personal draw to minimum. Increase discovery call volume. Activate all network contacts. Offer discounted "quick-win" projects to generate immediate cash. |
| SMB projects < 3/month for 2+ consecutive months | — | **Demand problem.** Networking channels are not producing. Add new channels (digital, partnerships). Expand geographic radius. Consider offering first project free to build references. |
| MRR covers < 20% of break-even after Month 6 | MRR < $1,200 | **Retention problem.** SMB retainer conversion or retention is failing. Review post-project follow-up process. Are clients getting enough value from the retainer? |
| No mid-market Diagnostic closed by Month 9 | — | **Phase 2 problem.** Mid-market portfolio or outreach is not working. Evaluate: (a) increase scan volume, (b) strengthen case studies, (c) adjust positioning, or (d) commit to SMB-only model. |
| Blended margin below 60% for 2+ months (SMB phase) | < 60% | **Scope/pricing problem.** Audit the last 5 projects for scope creep. Raise prices on next proposal. Tighten project scope definitions. |
| Personal draw below $5,000/mo for 4+ months | — | **Viability question.** The business model is not working at current pace. Evaluate: (a) increase project volume, (b) raise prices, (c) reduce costs, or (d) consider hybrid employment while building. |
| Revenue above $10K/mo for 3+ consecutive months AND turning away work | > $10K/mo sustained | **First hire trigger.** Begin recruiting junior AI/full-stack developer ($4-6K/mo). See "When to Make First Hire" section below. |

### When to Increase Personal Draw

| Condition | Action |
|---|---|
| 3 consecutive months revenue > $12K + cash reserve > $40K | Increase draw to $7,500/mo |
| 3 consecutive months revenue > $25K + cash reserve > $60K | Increase draw to $10,000/mo |
| MRR alone covers 50%+ of break-even ($6K+ MRR) | Consider draw increase to $12,500/mo |
| Annual revenue on track for $300K+ with 60%+ margin | Consider draw of $15,000-$20,000/mo |

---

## When to Make the First Hire: Financial Analysis

### The Economic Logic

In the solo founder + AI agents model, the first hire is not about offloading contractor management — there are no contractors. It is about unlocking revenue capacity. The founder is at capacity (6-8 SMB projects/month + retainers), AI agents are being used at maximum effectiveness, and qualified leads are being turned away. The hire should directly increase revenue-generating capacity.

### Hire Profile: Junior AI/Full-Stack Developer

| Factor | Value | Notes |
|---|---|---|
| **Monthly cost** | $4,000-$6,000 | Contractor at $25-$40/hr, or W-2 at $48-$72K/year. Start with contract to reduce risk. |
| **Ramp-up period** | 2-4 weeks | Junior learns the delivery model, tools, AI agent workflows, and quality standards |
| **Productive capacity** | 4-6 SMB builds/month | With AI agent assistance, handling simpler SMB projects independently after initial training |
| **Revenue capacity unlocked** | $10,000-$15,000/month | 4-6 builds x $2,500 avg |
| **Net contribution** | $4,000-$11,000/month | Revenue minus cost of hire |
| **Break-even for the hire** | 2-3 projects/month | The junior needs to deliver just 2-3 projects/month to cover their cost |

### Revenue Threshold Model

**When the hire is ROI-positive:**

| Monthly Revenue (Pre-Hire) | Hire Cost ($5K/mo) | Revenue Unlocked by Hire | New Total Revenue | Net Impact | Verdict |
|---|---|---|---|---|---|
| $10,000 | $5,000 | $5,000-$10,000 | $15,000-$20,000 | $0-$5,000 | **Too early.** Revenue cushion is thin. One slow month puts you underwater on the hire. |
| $15,000 | $5,000 | $8,000-$12,000 | $23,000-$27,000 | $3,000-$7,000 | **Marginal.** Works if pipeline is consistent, but cash reserve must be strong ($40K+). |
| $20,000 | $5,000 | $10,000-$15,000 | $30,000-$35,000 | $5,000-$10,000 | **Good.** Solid ROI. The hire pays for itself and adds meaningful revenue. |
| $25,000+ | $5,000 | $12,000-$15,000 | $37,000-$40,000 | $7,000-$10,000 | **Strong.** Clear ROI. The founder is also freed for higher-value mid-market work. |

**Recommended trigger: $10,000/month sustained revenue for 3+ consecutive months, AND the founder is turning away work or delaying mid-market opportunities due to SMB load.**

The range accounts for risk tolerance:
- $15K/month is the minimum where the hire math works (assuming consistent pipeline)
- $20K/month is the comfortable trigger (enough margin of safety)
- $25K/month is conservative — waiting this long means leaving money on the table, but the risk is minimal

### Impact on P&L

**Pre-hire P&L (at $20K/month revenue, solo + AI agents):**

| Line Item | Monthly | Annual |
|---|---|---|
| Revenue | $20,000 | $240,000 |
| Variable costs (~0.5%) | -$100 | -$1,200 |
| **Gross profit** | **$19,900** | **$238,800** |
| Fixed costs (incl. AI agents) | -$1,100 | -$13,200 |
| Personal draw | -$10,000 | -$120,000 |
| **Net cash flow** | **$8,800** | **$105,600** |
| **Effective margin** | **44%** | |

**Post-hire P&L (at $32K/month revenue, founder + junior + AI agents):**

| Line Item | Monthly | Annual |
|---|---|---|
| Revenue | $32,000 | $384,000 |
| Variable costs (~0.5%) | -$160 | -$1,920 |
| **Gross profit** | **$31,840** | **$382,080** |
| Fixed costs (incl. AI agents) | -$1,200 | -$14,400 |
| Junior developer cost | -$5,000 | -$60,000 |
| Personal draw | -$12,500 | -$150,000 |
| **Net cash flow** | **$13,140** | **$157,680** |
| **Effective margin** | **41%** | |

**Key takeaway:** The hire reduces effective margin by ~3 percentage points (from 44% to 41%) but increases absolute net cash flow by $4,340/month ($52,080/year). The founder also earns a higher personal draw ($12,500 vs. $10,000/month) while building a more scalable business.

### Decision Checklist

Before making the first hire, all of the following should be true:

- [ ] Monthly revenue has exceeded $15,000 for 3+ consecutive months
- [ ] The founder is at capacity (6-8 SMB projects/month) AND turning away qualified leads
- [ ] Cash reserve is at least $40,000 (4+ months of post-hire total burn)
- [ ] The SMB delivery model is templatized enough that a junior can follow it
- [ ] Mid-market opportunities are being delayed because the founder is consumed by SMB delivery
- [ ] The founder has documented delivery processes, quality checklists, and AI agent workflows that a junior can learn

**If any of these are not true, the hire is premature.** Continue with solo + AI agents until the conditions are met.

### Timeline Estimate by Scenario

| Scenario | Likely Hire Month | Revenue at Trigger | Cash Reserve at Trigger |
|---|---|---|---|
| Conservative | Month 12-15 | $10-15K/mo (may not hit trigger in Year 1) | $80K+ |
| Base Case | Month 9-12 | $20-25K/mo | $90-150K+ |
| Optimistic | Month 6-9 | $25-40K/mo | $90-130K+ |

---

## Sources

1. Module 3: Service & Pricing Model — Service ladder pricing, margin analysis, client archetype LTVs, API/tooling cost analysis, funnel conversion targets
2. Module 4: Operational Model — Monthly operational overhead tiers ($400-$1,800/mo), capacity planning scenarios (solo + AI agents), AI coding agent costs ($100-300/mo replacing contractor costs), sustainable capacity of 2-3 concurrent clients with AI agent multiplier, tooling cost breakdowns, first hire decision framework
3. Module 3: Upsell/Expansion Logic — Funnel conversion rates (Scan-to-Diagnostic 25-35%, Diagnostic-to-Build 50-65%, Build-to-Retainer 55-70%), service flywheel economics, retainer compound growth projections
4. Module 4: Capacity Planning — SMB delivery at 4-12 hours per project with AI agents (2-3x faster than solo); first hire trigger at $10K/mo sustained revenue when turning away work; junior developer at $4-6K/mo
5. Module 3: Pilot/Early-Client Pricing — 25-30% founding client discount for first 2-3 mid-market engagements
6. Module 4: Burnout Risk & Mitigation — 40-45 hr/week sustainable capacity, 60-75% billable utilization target, capacity red lines
7. Module 8: SMB/Local Business Lane — SMB project sizing ($1-5K), retainer model ($200-$500/mo), delivery timelines (3-14 days), local go-to-market channels
8. SBA (Small Business Administration) — 33.2M small businesses in the US; solo consulting business cash flow management guidelines and break-even analysis frameworks
9. SCORE "Financial Projections for Startups" — Three-scenario modeling methodology (conservative, base, optimistic)
10. Freelancers Union Annual Survey (2024-2025) — Solo consultant cash flow patterns, average time to first client, and runway depletion benchmarks
