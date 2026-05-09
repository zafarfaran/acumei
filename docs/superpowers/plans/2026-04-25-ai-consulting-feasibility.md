# AI Consulting Feasibility Study — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a 7-module feasibility study that validates (or invalidates) launching a solo-founder AI consulting company positioned as "building the AI brain of your company."

**Architecture:** Each module is a standalone markdown research document in `docs/modules/`. Modules 1-5 are independent and can be researched in parallel. Module 6 (Financial Model) depends on Module 3 (pricing data) and Module 4 (cost data). Module 7 (Risk & Go/No-Go) synthesizes findings from all prior modules. A final executive summary ties everything together.

**Tech Stack:** Web research, markdown documents, data synthesis. No application code.

---

## Dependency Graph

```
Task 1 (Market)        ──┐
Task 2 (Competition)   ──┤
Task 3 (Pricing)       ──┼──→ Task 6 (Financial Model) ──→ Task 7 (Risk & Go/No-Go) ──→ Task 8 (Exec Summary)
Task 4 (Operations)    ──┤
Task 5 (Go-to-Market)  ──┘
```

Tasks 1-5 are independent. Task 6 depends on 3 & 4. Task 7 depends on all. Task 8 depends on 7.

---

## File Structure

```
docs/
  modules/
    01-market-demand-analysis.md
    02-competitive-landscape.md
    03-service-pricing-model.md
    04-operational-model.md
    05-go-to-market-playbook.md
    06-financial-model.md
    07-risk-assessment-go-no-go.md
    executive-summary.md
  superpowers/
    specs/2026-04-25-ai-consulting-feasibility-design.md  (exists)
    plans/2026-04-25-ai-consulting-feasibility.md         (this file)
```

---

### Task 1: Market & Demand Analysis

**Files:**
- Create: `docs/modules/01-market-demand-analysis.md`

**Purpose:** Answer "Is there a market, and who pays the most?"

- [ ] **Step 1: Research AI adoption landscape**

Search for and synthesize data on:
- "AI adoption rate by company size 2025 2026" — find stats on what % of SMBs, mid-market, and enterprise have adopted AI
- "enterprise AI spending forecast 2026" — budget trends
- "AI maturity model company stages" — frameworks for categorizing where companies are in their AI journey
- "industry AI adoption rates by sector" — which industries lead/lag

Record key stats with sources. Target: 8-12 data points with citations.

- [ ] **Step 2: Research pain points and demand signals**

Search for and synthesize data on:
- "why companies hire AI consultants" — what triggers the buying decision
- "AI consulting demand growth" — market size and growth data
- "AI transformation challenges for businesses" — specific bottlenecks
- "Upwork AI consulting demand trends" / "Toptal AI project trends" — platform-level signals
- "AI job postings growth 2025 2026" — hiring trends as a proxy for demand

Record key stats with sources. Target: 8-10 data points.

- [ ] **Step 3: Build segment attractiveness matrix**

Using research from Steps 1-2, build a matrix ranking these segments:

| Segment | Willingness to Pay | Ease of Access | Project Size | Repeat Potential | "AI Brain" Fit | Overall Score |
|---------|-------------------|----------------|-------------|-----------------|---------------|--------------|
| SMB — Retail/E-commerce | | | | | | |
| SMB — Professional Services | | | | | | |
| Mid-market — Healthcare | | | | | | |
| Mid-market — Financial Services | | | | | | |
| Mid-market — Manufacturing | | | | | | |
| Mid-market — Legal | | | | | | |
| Enterprise — Any | | | | | | |
| Startups (Series A-C) | | | | | | |

Score each dimension 1-5. Add rows for any segments the research reveals as promising. The "AI Brain" Fit column assesses which segments have operations complex enough to benefit from systemic AI (not just point solutions).

- [ ] **Step 4: Identify beachhead segment and write the full document**

Based on the matrix, identify the 1-2 best beachhead segments. Write the complete module document to `docs/modules/01-market-demand-analysis.md` with this structure:

```markdown
# Module 1: Market & Demand Analysis

## Executive Summary
- [3 bullet points: key finding, market size signal, recommended beachhead]

## AI Adoption Landscape
[Stats and analysis from Step 1]

## Pain Point Mapping
[Categorized pain points with urgency ranking]

## Demand Signals
[Evidence from Step 2]

## Segment Attractiveness Matrix
[Table from Step 3 with narrative analysis]

## "AI Brain" Resonance Test
[Which segments want systemic AI vs. point solutions]

## Recommended Beachhead Segment
[1-2 segments with rationale]

## Sources
[Numbered list of all sources cited]
```

- [ ] **Step 5: Commit**

```bash
git add docs/modules/01-market-demand-analysis.md
git commit -m "research: add Module 1 — Market & Demand Analysis"
```

---

### Task 2: Competitive Landscape

**Files:**
- Create: `docs/modules/02-competitive-landscape.md`

**Purpose:** Answer "Who's out there, and where are the gaps I can exploit?"

- [ ] **Step 1: Research big consultancy AI practices**

Search for:
- "McKinsey AI consulting services pricing" — what they offer, how they position
- "Deloitte AI transformation practice" — services, case studies, typical engagement size
- "Accenture AI services" — same
- "Big 4 AI consulting market share" — how much of the market they own
- "enterprise AI consulting engagement cost" — typical pricing ($500K+ hypothesis)

Record: services offered, pricing range, target client size, strengths, weaknesses. Target: 3-5 firms profiled.

- [ ] **Step 2: Research boutique AI firms**

Search for:
- "boutique AI consulting firms" — identify 5-8 firms in the 10-50 person range
- Visit their websites to catalog: positioning, services, pricing (if public), target industries, case studies
- "AI consulting firm funding" — which boutique firms have raised money, what are they building
- "AI agency services pricing" — typical project ranges

Record: firm name, positioning, services, pricing range, strengths, weaknesses. Target: 5-8 firms profiled.

- [ ] **Step 3: Research freelancer/solopreneur landscape**

Search for:
- "AI consultant freelance rates 2025 2026" — typical hourly/project rates
- "Upwork AI consultant profiles" — what freelancers offer, how they position
- "Toptal AI engineering rates" — premium freelancer pricing
- "solo AI consultant business model" — how individuals structure their practices

Record: platforms used, rate ranges, service scope, limitations.

- [ ] **Step 4: Research AI tool vendors (indirect competition)**

Search for:
- "no-code AI platform for business" — tools like Zapier AI, Make.com AI features
- "AI automation platforms comparison" — self-serve alternatives to consulting
- "build vs buy AI solutions business" — when companies choose tools over consultants
- "enterprise AI platform market" — the SaaS competition angle

Record: major platforms, what they automate, pricing, where they fall short (the gap consulting fills).

- [ ] **Step 5: Write the full competitive landscape document**

Write `docs/modules/02-competitive-landscape.md`:

```markdown
# Module 2: Competitive Landscape

## Executive Summary
- [3 bullets: competitive structure, key gap identified, differentiation thesis]

## Competitor Categories

### Tier 1: Big Consultancies
[Profiles from Step 1 — services, pricing, strengths, weaknesses]

### Tier 2: Boutique AI Firms
[Profiles from Step 2]

### Tier 3: Freelancers & Solopreneurs
[Analysis from Step 3]

### Tier 4: AI Tool Vendors (Indirect)
[Analysis from Step 4]

## Gap Analysis
[Where the market is underserved — validate/challenge the hypothesis that there's a gap between strategy-only consultancies and implementation-only freelancers]

## Differentiation Framework
[How "The AI Brain" is distinct from each tier:
- vs. Big consultancies: builds, not just advises; affordable
- vs. Boutiques: leaner, more agile, founder-led
- vs. Freelancers: systemic thinking, end-to-end, persistent relationship
- vs. Tool vendors: custom, complex workflows that tools can't handle]

## Competitive Risks
[Threats to the positioning with likelihood assessment]

## Positioning Statement
[Draft one-liner: "We build the AI brain of your company — the persistent intelligence layer that [benefit], for [target], at a fraction of [alternative]."]

## Sources
[Numbered list]
```

- [ ] **Step 6: Commit**

```bash
git add docs/modules/02-competitive-landscape.md
git commit -m "research: add Module 2 — Competitive Landscape"
```

---

### Task 3: Service & Pricing Model

**Files:**
- Create: `docs/modules/03-service-pricing-model.md`

**Purpose:** Answer "What exactly do I sell, how do I price it, and what are my margins?"

- [ ] **Step 1: Research market rates for AI consulting services**

Search for:
- "AI consulting rates per hour 2025 2026" — hourly rate benchmarks
- "AI strategy consulting project pricing" — fixed-fee engagement sizes
- "AI implementation project cost range" — what companies pay for builds
- "AI managed services retainer pricing" — ongoing support models
- "value based pricing AI consulting" — models where you price on ROI
- "AI readiness assessment cost" — what discovery/diagnostic engagements charge

Record: rate ranges by service type and by client segment (SMB vs. mid-market vs. enterprise).

- [ ] **Step 2: Research tooling and API costs**

Search for:
- "OpenAI API pricing 2026" / "Anthropic API pricing 2026" — per-token costs
- "cloud compute costs AI workloads" — AWS/GCP/Azure pricing for AI inference
- "AI development tooling costs" — LangChain, vector DBs, monitoring tools
- "typical AI project infrastructure costs" — what a build actually costs in APIs/compute

Record: monthly baseline costs and per-project variable costs for a realistic AI consulting operation.

- [ ] **Step 3: Build pricing model and margin analysis**

Using research from Steps 1-2, build the pricing model:

**Service Ladder with Pricing:**

| Service | Pricing Model | SMB Range | Mid-Market Range | Enterprise Range | Est. Hours | Contractor Cost | API/Infra Cost | Gross Margin |
|---------|--------------|-----------|-----------------|-----------------|-----------|----------------|---------------|-------------|
| Free AI Opportunity Scan | Free | $0 | $0 | $0 | 2-3 hrs | $0 | $0 | N/A (lead gen) |
| AI Diagnostic | Project-based | $X-Y | $X-Y | $X-Y | X hrs | $X | $X | X% |
| AI Brain Build | Project/Value | $X-Y | $X-Y | $X-Y | X hrs | $X | $X | X% |
| AI Strategy & Adoption | Day-rate/Project | $X-Y | $X-Y | $X-Y | X hrs | $X | $X | X% |
| AI Brain Support | Monthly retainer | $X-Y/mo | $X-Y/mo | $X-Y/mo | X hrs/mo | $X | $X | X% |

Fill in all X values with researched numbers. No placeholders.

- [ ] **Step 4: Model client archetype revenue journeys**

Build 3-4 client archetype models showing the full revenue journey:

**Archetype 1: Mid-Market SaaS Company (50-200 employees)**
- Month 0: Free Scan → converts
- Month 1: AI Diagnostic — $[price]
- Month 2-4: AI Brain Build — $[price]
- Month 5+: AI Brain Support — $[price]/mo
- 12-month LTV: $[total]

**Archetype 2: SMB Professional Services (20-50 employees)**
- [Same structure, different numbers]

**Archetype 3: Enterprise Division (1000+ employees)**
- [Same structure, different numbers]

**Archetype 4: Quick-Hit (any size, small scope)**
- [Diagnostic only, or Diagnostic + small build]

- [ ] **Step 5: Write the full document**

Write `docs/modules/03-service-pricing-model.md`:

```markdown
# Module 3: Service & Pricing Model

## Executive Summary
- [3 bullets: recommended pricing, margin outlook, key insight]

## Service Ladder
[Detailed description of each tier: Free Scan → Diagnostic → Build → Strategy → Support]
[For each: what's included, deliverables, timeline, pricing model]

## Pricing Research
[Market rate benchmarks by segment with sources]

## Pricing Recommendations
[Specific price ranges per service per segment with rationale]
[Discount/pilot pricing for first 3 clients]

## Margin Analysis
[Table from Step 3 with narrative — which services are highest margin?]

## Client Archetype Revenue Journeys
[Models from Step 4]

## Upsell/Expansion Logic
[How each service leads to the next — the flywheel]

## Sources
[Numbered list]
```

- [ ] **Step 6: Commit**

```bash
git add docs/modules/03-service-pricing-model.md
git commit -m "research: add Module 3 — Service & Pricing Model"
```

---

### Task 4: Operational Model

**Files:**
- Create: `docs/modules/04-operational-model.md`

**Purpose:** Answer "How do I actually deliver all this as one person?"

- [ ] **Step 1: Research solo consultant operational models**

Search for:
- "solo AI consultant business model" — how successful solos structure delivery
- "consulting firm contractor model" — how firms scale with contractors vs. employees
- "freelance AI engineer contractor rates" — what you'd pay contractors
- "solo consultant capacity planning" — how many concurrent clients a solo can handle
- "consulting burnout prevention solo founder" — operational sustainability

Record: delivery models, contractor rates, capacity limits, burnout indicators.

- [ ] **Step 2: Research tooling costs and stack**

Search for:
- "consulting business tool stack solo founder" — recommended tools
- "CRM for solo consultant" — options and pricing (HubSpot free, Pipedrive, etc.)
- "project management tool for consulting" — Linear, Notion, Asana pricing
- "consulting proposal software" — tools for SOWs and contracts
- "professional liability insurance AI consultant cost" — E&O insurance pricing

Build a complete tooling cost table:

| Tool | Purpose | Monthly Cost | Notes |
|------|---------|-------------|-------|
| CRM | Pipeline tracking | $X | [specific tool recommendation] |
| Project Management | Delivery tracking | $X | |
| Communication | Client comms | $X | Slack, email |
| AI Dev Stack | API access | $X | OpenAI, Anthropic baselines |
| Cloud | Deployment | $X | AWS/GCP baseline |
| Billing | Invoicing | $X | Stripe, FreshBooks |
| Legal | Contracts | $X | Templates, review |
| Insurance | E&O/liability | $X | |
| **Total** | | **$X/mo** | |

Fill in all values with researched numbers.

- [ ] **Step 3: Build capacity model**

Model three scenarios with specific hour breakdowns:

**Scenario A: 1 Large Client (AI Brain Build)**
- Client work: X hrs/wk
- Sales/marketing: X hrs/wk
- Admin/ops: X hrs/wk
- Free scans: X hrs/wk
- Total: X hrs/wk
- Utilization: X%

**Scenario B: 2-3 Medium Clients**
- [Same structure]

**Scenario C: 1 Build + 2 Retainers + Pipeline**
- [Same structure]

For each scenario: can you sustain this for 6+ months without burnout? Where do contractors get pulled in?

- [ ] **Step 4: Write the full document**

Write `docs/modules/04-operational-model.md`:

```markdown
# Module 4: Operational Model

## Executive Summary
- [3 bullets: max concurrent clients, monthly overhead cost, key operational risk]

## Delivery Model
[Founder vs. contractor split — what you own, what you hire out, decision triggers]

## Contractor Strategy
[Where to find, how to vet, management approach, bench structure, agreement terms]
[Contractor rate ranges from research]

## Capacity Planning
[3 scenarios from Step 3 with hour breakdowns]
[When to say no to new work — the capacity red line]

## Tooling & Infrastructure
[Table from Step 2 with narrative]
[Total monthly operational cost]

## Quality Assurance
[Review processes, standards, client feedback loops]

## Burnout Risk & Mitigation
[Warning signs, mitigation strategies, first-hire decision point]

## Free Tier Capacity Management
[Max free scans per month, time budget, throttle triggers]
[Recommendation: X free scans/month, review monthly based on conversion]

## Sources
[Numbered list]
```

- [ ] **Step 5: Commit**

```bash
git add docs/modules/04-operational-model.md
git commit -m "research: add Module 4 — Operational Model"
```

---

### Task 5: Go-to-Market Playbook

**Files:**
- Create: `docs/modules/05-go-to-market-playbook.md`

**Purpose:** Answer "How do I actually find and land the first 3-5 paying clients?"

- [ ] **Step 1: Research client acquisition channels for solo consultants**

Search for:
- "how to get first consulting clients" — first-client strategies
- "LinkedIn lead generation AI consultant" — LinkedIn-specific tactics
- "cold outreach consulting clients success rate" — response rates, what works
- "consulting referral strategy" — engineering referrals
- "AI consultant content marketing strategy" — what content converts
- "partnership model consulting firm" — teaming with non-AI firms

Record: channel effectiveness data, response rates, conversion benchmarks.

- [ ] **Step 2: Research sales cycle and process**

Search for:
- "B2B consulting sales cycle length" — how long by segment
- "consulting proposal win rate" — typical close rates
- "AI consulting objection handling" — common pushbacks
- "consulting SOW template" — what proposals include
- "free consultation to paid conversion rate" — benchmarks for the free tier funnel

Record: sales cycle benchmarks, close rates, objection patterns.

- [ ] **Step 3: Build the conversion funnel model**

Using research from Steps 1-2, build the acquisition funnel:

```
Free AI Opportunity Scans: X per month (target)
  ↓ X% conversion
AI Diagnostics: X per month
  ↓ X% conversion
AI Brain Builds: X per quarter
  ↓ X% convert to ongoing
AI Brain Support Retainers: X active
```

Work backwards from the goal (3-5 paying clients in 12 months) to determine how many free scans need to happen.

- [ ] **Step 4: Write the full document**

Write `docs/modules/05-go-to-market-playbook.md`:

```markdown
# Module 5: Go-to-Market Playbook

## Executive Summary
- [3 bullets: primary channel, funnel numbers needed, timeline to first client]

## Free Tier Funnel
[What the Free AI Opportunity Scan includes]
[Distribution channels]
[Conversion mechanics — how it surfaces paid needs]
[Target conversion model with specific numbers from Step 3]

## Channel Strategy (Ranked by ROI for Solo Founder)

### 1. Content & Thought Leadership
[Specific tactics: LinkedIn posting cadence, content topics, demo videos]
[Expected reach and conversion]

### 2. Direct Outreach
[Target personas (title, company profile)]
[Message framework — warm and cold templates]
[Volume: X outreach per week, expected X% response rate]

### 3. Partnerships
[Types of partners: dev shops, business consultants, SaaS companies]
[How to structure the partnership (referral fee, subcontracting, co-delivery)]

### 4. Communities & Events
[Specific communities to join]
[Conference/meetup strategy]

### 5. Referrals
[When to ask, how to ask, incentive structure]

## Sales Process
[Full journey map: first contact → discovery → free scan → proposal → close]
[Timeline by segment]
[Proposal approach]
[Objection handling — top 5 objections with responses]

## Early Wins Strategy
[First 90 days playbook]
[Pilot pricing for first 2-3 clients]
[Building case studies from early work]

## Brand & Positioning
["AI Brain" messaging framework]
[Channel-specific messaging (LinkedIn, website, proposals)]

## Sources
[Numbered list]
```

- [ ] **Step 5: Commit**

```bash
git add docs/modules/05-go-to-market-playbook.md
git commit -m "research: add Module 5 — Go-to-Market Playbook"
```

---

### Task 6: Financial Model

**Depends on:** Task 3 (pricing data), Task 4 (operational costs)

**Files:**
- Create: `docs/modules/06-financial-model.md`

**Purpose:** Answer "Do the numbers work? When do I break even?"

- [ ] **Step 1: Compile cost structure from Module 4**

Pull the tooling/infrastructure costs from `docs/modules/04-operational-model.md`. Compile into:

**Monthly Fixed Costs:**
| Category | Cost |
|----------|------|
| Tooling (CRM, PM, etc.) | $X |
| AI APIs (baseline) | $X |
| Domain/hosting/email | $X |
| Insurance | $X |
| Accounting | $X |
| Legal (amortized) | $X |
| **Total Fixed** | **$X/mo** |

**Personal Draw:** $X/mo (minimum) → $X/mo (target at 12 months)

**Variable Costs Per Project:**
| Cost | Diagnostic | Build (solo) | Build (w/ contractor) | Support |
|------|-----------|-------------|----------------------|---------|
| Contractor | $0 | $0 | $X | $X |
| API/Compute | $X | $X | $X | $X |
| **Total Variable** | **$X** | **$X** | **$X** | **$X/mo** |

- [ ] **Step 2: Compile revenue model from Module 3**

Pull pricing data from `docs/modules/03-service-pricing-model.md`. Build the revenue model:

**Revenue Per Client (Using Mid-Market Archetype):**
| Service | Revenue | Timeline |
|---------|---------|----------|
| Free Scan | $0 | Month 0 |
| Diagnostic | $X | Month 1 |
| Build | $X | Month 2-4 |
| Support | $X/mo | Month 5+ |
| **12-Month LTV** | **$X** | |

**Funnel Assumptions:**
| Metric | Conservative | Base | Optimistic |
|--------|-------------|------|-----------|
| Free scans/month | X | X | X |
| Scan → Diagnostic conversion | X% | X% | X% |
| Diagnostic → Build conversion | X% | X% | X% |
| Build → Support conversion | X% | X% | X% |
| Avg Diagnostic revenue | $X | $X | $X |
| Avg Build revenue | $X | $X | $X |
| Avg Support MRR | $X | $X | $X |

- [ ] **Step 3: Build 12-month cash flow projections**

For each scenario (conservative, base, optimistic), build a month-by-month table:

| Month | Free Scans | New Diagnostics | New Builds | Active Retainers | Project Revenue | MRR | Total Revenue | Fixed Costs | Variable Costs | Personal Draw | Net Cash Flow | Cumulative |
|-------|-----------|----------------|-----------|-----------------|----------------|-----|---------------|------------|---------------|--------------|--------------|------------|
| 1 | X | X | 0 | 0 | $X | $0 | $X | $X | $X | $X | -$X | -$X |
| 2 | X | X | X | 0 | $X | $0 | $X | $X | $X | $X | $X | -$X |
| ... | | | | | | | | | | | | |
| 12 | X | X | X | X | $X | $X | $X | $X | $X | $X | $X | $X |

Build all 3 scenario tables with realistic numbers. No placeholders — every cell must have a number.

- [ ] **Step 4: Calculate break-even and key metrics**

From the 3 scenarios:
- **Break-even month:** When cumulative cash flow turns positive (Conservative: month X, Base: month X, Optimistic: month X)
- **Runway danger zone:** Under conservative scenario, at which month does remaining runway hit 2 months of expenses?
- **Monthly revenue needed for break-even:** $X (fixed costs + personal draw)
- **Clients needed for break-even:** X active clients at average revenue

- [ ] **Step 5: Write the full document**

Write `docs/modules/06-financial-model.md`:

```markdown
# Module 6: Financial Model

## Executive Summary
- [3 bullets: break-even timeline, revenue needed, key financial risk]

## Cost Structure
[Fixed costs table, variable costs table, personal draw from Step 1]

## Revenue Model
[Per-client revenue, funnel assumptions from Step 2]

## 12-Month Projections

### Conservative Scenario
[Full table from Step 3]
[Narrative: what this scenario means — first client month 3-4, slow ramp]

### Base Case Scenario
[Full table]
[Narrative]

### Optimistic Scenario
[Full table]
[Narrative]

## Break-Even Analysis
[From Step 4 — when, how many clients, what revenue level]

## Cash Flow Timeline
[Visual summary of runway depletion under each scenario]
[Danger zone identification]

## Key Metrics to Track
1. Pipeline value
2. Conversion rate (at each funnel stage)
3. Average deal size
4. Monthly recurring revenue
5. Utilization rate
6. Gross margin

[For each: what "good" looks like, what "warning" looks like]

## Sources
[Numbered list]
```

- [ ] **Step 6: Commit**

```bash
git add docs/modules/06-financial-model.md
git commit -m "research: add Module 6 — Financial Model"
```

---

### Task 7: Risk Assessment & Go/No-Go Framework

**Depends on:** Tasks 1-6 (synthesizes all modules)

**Files:**
- Create: `docs/modules/07-risk-assessment-go-no-go.md`

**Purpose:** Answer "What could kill this, and should I actually do it?"

- [ ] **Step 1: Build the risk matrix**

Using findings from all prior modules, score each risk:

| Risk | Category | Likelihood | Impact | Severity | Mitigation |
|------|----------|-----------|--------|----------|-----------|
| AI hype cools, budgets shrink | Market | L/M/H | L/M/H | L/M/H | [specific action] |
| Self-serve tools reduce need | Market | L/M/H | L/M/H | L/M/H | [specific action] |
| Economic downturn | Market | L/M/H | L/M/H | L/M/H | [specific action] |
| Big firms move downmarket | Competitive | L/M/H | L/M/H | L/M/H | [specific action] |
| Freelancer market floods | Competitive | L/M/H | L/M/H | L/M/H | [specific action] |
| Startup productizes "AI Brain" | Competitive | L/M/H | L/M/H | L/M/H | [specific action] |
| Overcommit / underdeliver | Delivery | L/M/H | L/M/H | L/M/H | [specific action] |
| Contractor quality issues | Delivery | L/M/H | L/M/H | L/M/H | [specific action] |
| Scope creep erodes margins | Delivery | L/M/H | L/M/H | L/M/H | [specific action] |
| Sales cycle too long | Financial | L/M/H | L/M/H | L/M/H | [specific action] |
| Client payment delays | Financial | L/M/H | L/M/H | L/M/H | [specific action] |
| Underpricing early deals | Financial | L/M/H | L/M/H | L/M/H | [specific action] |
| Burnout | Solo Founder | L/M/H | L/M/H | L/M/H | [specific action] |
| Key-person dependency | Solo Founder | L/M/H | L/M/H | L/M/H | [specific action] |
| Revenue ceiling | Solo Founder | L/M/H | L/M/H | L/M/H | [specific action] |
| AI landscape shift | Technical | L/M/H | L/M/H | L/M/H | [specific action] |
| Data security incident | Technical | L/M/H | L/M/H | L/M/H | [specific action] |

Every cell must be filled with a specific value and specific mitigation action (not "handle appropriately" — actual action).

- [ ] **Step 2: Build Go/No-Go decision framework**

Define specific, measurable criteria:

**Green Lights (Launch):**
- [ ] X+ free scans completed with Y%+ expressing interest in paid services
- [ ] Beachhead segment identified with at least Z confirmed willingness-to-pay signals
- [ ] At least 1 signed LOI or paid engagement
- [ ] Unit economics work: gross margin above X% on first project
- [ ] Positioning resonates: can articulate differentiation in <30 seconds and prospects respond positively

**Yellow Lights (Proceed with Caution):**
- [ ] Demand exists but conversion rate below X%
- [ ] Sales cycle exceeds X months on average
- [ ] Competitive landscape more crowded than expected but differentiation holds
- [ ] Financial model only works under base/optimistic scenarios

**Red Lights (Pause / Pivot):**
- [ ] After X free scans, zero convert to paid interest
- [ ] Every prospect says "we'll do it in-house" or "we already have a vendor"
- [ ] Required pricing is below $X/hr to be competitive (unsustainable)
- [ ] Runway hits X-month danger zone with no revenue

Fill in all X/Y/Z with specific numbers derived from the financial model and market research.

- [ ] **Step 3: Define decision timeline and pivot options**

Based on the financial model's runway analysis:
- **Month X:** First checkpoint — evaluate free scan conversion
- **Month X:** Second checkpoint — evaluate pipeline value and first revenue
- **Month X:** Hard go/no-go decision point
- **Month X:** Runway danger zone — must have revenue or pivot

Pivot options ranked by feasibility:
1. [Specific pivot with rationale]
2. [Specific pivot with rationale]
3. [Specific pivot with rationale]
4. [Specific pivot with rationale]
5. [Specific pivot with rationale]

- [ ] **Step 4: Write the full document**

Write `docs/modules/07-risk-assessment-go-no-go.md`:

```markdown
# Module 7: Risk Assessment & Go/No-Go Framework

## Executive Summary
- [3 bullets: top 3 risks, go/no-go recommendation, critical decision point]

## Risk Matrix
[Full table from Step 1]

## Detailed Mitigation Strategies
[For each high-severity risk: early warning indicators, specific mitigation actions, contingency plan]

## Go/No-Go Decision Framework
[Green/Yellow/Red lights from Step 2 with specific thresholds]

## Decision Timeline
[Checkpoint schedule from Step 3]
[What gets evaluated at each checkpoint]

## Pivot Options
[Ranked options from Step 3 with feasibility assessment]

## Overall Recommendation
[Based on all 7 modules: is this a go, conditional go, or no-go?]
[What needs to be true for this to work]
[The single biggest risk and how to manage it]

## Sources
[Numbered list]
```

- [ ] **Step 5: Commit**

```bash
git add docs/modules/07-risk-assessment-go-no-go.md
git commit -m "research: add Module 7 — Risk Assessment & Go/No-Go Framework"
```

---

### Task 8: Executive Summary

**Depends on:** Task 7 (all modules complete)

**Files:**
- Create: `docs/modules/executive-summary.md`

**Purpose:** Tie all 7 modules into a single-page decision document.

- [ ] **Step 1: Review all 7 modules and extract key findings**

Read each module's executive summary. Extract the single most important finding from each:
- Module 1: [Market size / beachhead segment]
- Module 2: [Competitive gap / differentiation]
- Module 3: [Pricing viability / margin outlook]
- Module 4: [Operational capacity / cost structure]
- Module 5: [Client acquisition path / funnel numbers]
- Module 6: [Break-even timeline / financial viability]
- Module 7: [Top risks / go-no-go verdict]

- [ ] **Step 2: Write the executive summary**

Write `docs/modules/executive-summary.md`:

```markdown
# The AI Brain — Feasibility Study: Executive Summary

## The Proposition
[2-3 sentences: what the company does, the "AI Brain" concept, solo founder model]

## Key Findings

### Market Opportunity
[2-3 sentences from Module 1 — is there demand? which segment?]

### Competitive Position
[2-3 sentences from Module 2 — where's the gap? how do we differentiate?]

### Service & Pricing Viability
[2-3 sentences from Module 3 — what's the offering? are margins healthy?]

### Operational Feasibility
[2-3 sentences from Module 4 — can one person do this? at what capacity?]

### Path to First Clients
[2-3 sentences from Module 5 — how do we get clients? what's the funnel?]

### Financial Outlook
[2-3 sentences from Module 6 — break-even when? under what conditions?]

### Key Risks
[Top 3 risks from Module 7 with one-line mitigations]

## Verdict
[GO / CONDITIONAL GO / NO-GO]
[2-3 sentences explaining the verdict]
[The conditions that must hold for this to succeed]

## Recommended Next Steps
1. [First action]
2. [Second action]
3. [Third action]
4. [Fourth action]
5. [Fifth action]
```

- [ ] **Step 3: Commit**

```bash
git add docs/modules/executive-summary.md
git commit -m "research: add Executive Summary — Feasibility Study complete"
```

---

## Self-Review Notes

**Spec coverage check:**
- Module 1 (Market & Demand): Covered in Task 1 — AI adoption landscape, pain points, demand signals, segment matrix, beachhead recommendation. All spec sections addressed.
- Module 2 (Competitive Landscape): Covered in Task 2 — all 4 competitor tiers, gap analysis, differentiation, competitive risks, positioning statement. All spec sections addressed.
- Module 3 (Service & Pricing): Covered in Task 3 — service ladder with free tier, pricing research, pricing model, margin analysis, client archetypes, upsell logic. All spec sections addressed.
- Module 4 (Operational Model): Covered in Task 4 — delivery model, contractor strategy, capacity planning, tooling, QA, burnout, free tier capacity. All spec sections addressed.
- Module 5 (Go-to-Market): Covered in Task 5 — free tier funnel, all 5 channels, sales process, early wins, brand & positioning. All spec sections addressed.
- Module 6 (Financial Model): Covered in Task 6 — cost structure, revenue model, 3 scenarios, break-even, cash flow, key metrics. All spec sections addressed.
- Module 7 (Risk & Go/No-Go): Covered in Task 7 — risk matrix, mitigations, green/yellow/red framework, decision timeline, pivot options. All spec sections addressed.
- Executive Summary: Added as Task 8 to tie everything together (not in original spec but necessary for the deliverable to be complete).

**Placeholder scan:** All tables show $X / X% structure — these are templates to be filled with researched numbers during execution, not placeholders in the final output. Each step explicitly instructs to fill with real data.

**Consistency check:** Service names are consistent across all modules (Free AI Opportunity Scan, AI Diagnostic, AI Brain Build, AI Strategy & Adoption, AI Brain Support). Funnel stages are consistent. File paths are consistent.
