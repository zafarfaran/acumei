# Fiverr Gig Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce 15 complete, paste-ready Fiverr listings for Acumei, including four launch gigs, eleven queued gigs, seller-profile copy, portfolio proof, and publication guidance.

**Architecture:** Store each gig in a separate Markdown file so it can be reviewed and updated independently. Use one index for publication order and one proof library for approved claims. Every gig follows the same field order and receives a final character-limit, completeness, overlap, and evidence review.

**Tech Stack:** Markdown, Fiverr's current listing fields, Acumei/Faranz public portfolio evidence, and lightweight PowerShell/Python validation commands.

---

## File Structure

- Create: `docs/outreach/fiverr/README.md` — seller positioning, launch order, catalog index, tracking metrics, and publication checklist.
- Create: `docs/outreach/fiverr/proof-library.md` — approved profile bio, credentials, project claims, metrics, and usage rules.
- Create: `docs/outreach/fiverr/gigs/01-rag-ai-chatbot.md`
- Create: `docs/outreach/fiverr/gigs/02-ai-saas-mvp.md`
- Create: `docs/outreach/fiverr/gigs/03-machine-learning-model.md`
- Create: `docs/outreach/fiverr/gigs/04-python-automation.md`
- Create: `docs/outreach/fiverr/gigs/05-fastapi-rest-api.md`
- Create: `docs/outreach/fiverr/gigs/06-django-flask-web-app.md`
- Create: `docs/outreach/fiverr/gigs/07-llm-website-integration.md`
- Create: `docs/outreach/fiverr/gigs/08-ai-agent-automation.md`
- Create: `docs/outreach/fiverr/gigs/09-computer-vision.md`
- Create: `docs/outreach/fiverr/gigs/10-nlp-document-pipeline.md`
- Create: `docs/outreach/fiverr/gigs/11-time-series-forecasting.md`
- Create: `docs/outreach/fiverr/gigs/12-recommendation-system.md`
- Create: `docs/outreach/fiverr/gigs/13-python-web-scraping.md`
- Create: `docs/outreach/fiverr/gigs/14-ml-model-deployment.md`
- Create: `docs/outreach/fiverr/gigs/15-python-debugging-testing.md`

Each gig file uses this exact section order:

1. Positioning
2. Fiverr Overview
3. Packages
4. Extras
5. Description
6. FAQs
7. Buyer Requirements
8. Gallery
9. Video Script
10. Scope and Terms
11. Portfolio Proof
12. Cross-Sells
13. Pre-Publish Checks

---

### Task 1: Create the Catalog Foundation

**Files:**
- Create: `docs/outreach/fiverr/README.md`
- Create: `docs/outreach/fiverr/proof-library.md`
- Reference: `docs/superpowers/specs/2026-08-10-fiverr-gig-catalog-design.md`

- [ ] **Step 1: Write the Fiverr seller profile**

Add a concise profile headline and profile description that position Acumei around AI engineering, machine learning, Python, and full-stack delivery. Mention the founder's Machine Learning Engineer and Software Engineer experience, Google DeepMind research internship, First Class Computer Science degree, and production/hackathon portfolio without implying that employer work was delivered by Acumei.

- [ ] **Step 2: Build the approved proof library**

Document each approved claim with its source context and eligible gig types:

- Ovalens: 16-module deterministic UK tax engine, Claude assistant with six tools, 30+ APIs, Redis, 280+ tests, and £7,000 hackathon win.
- Donald: FastAPI, Next.js, PostgreSQL, Redis, Celery, approximately 40,000 views in 72 hours, and 300+ users.
- GalleryGen: ElevenHacks winner, Claude curator agent, react-three-fiber, and FastAPI vision.
- Nova: Saturn Hackathon winner, multi-agent document processing, compliance/VAT checks, duplicate detection, and tool-calling chat.
- GetOut: embeddings-based matching and LLM tool-calling.
- Fixie: PDF/URL ingestion, guided voice workflows, FastAPI, Next.js, Celery, Claude, and ElevenLabs.
- Chainwatch: open-source supply-chain risk analysis and 138+ tests including red-team simulations.
- BRRR Agent: Python Claude plugin for property search and structured deal analysis.
- Professional ML: approximately 8% model-accuracy improvement through contrastive learning.
- Professional data engineering: approximately 86% throughput gain on a roughly 600 GB/day pipeline.
- Professional agents: approximately 20 hours/week of manual analysis eliminated.
- Professional operations AI: mean time to recovery reduced from approximately 60 minutes to minutes.
- AMRAG research: reported 88% response-accuracy improvement with sub-five-second latency.

For each claim, state that qualifiers and original context must be preserved.

- [ ] **Step 3: Create the catalog index and launch sequence**

List all 15 gigs in numerical order. Label gigs 1–4 "Launch now" and gigs 5–15 "Queued." Explain the new-seller four-gig limit, Level 1 ten-gig limit, 30-day initial measurement window, and evidence-based rotation rule.

- [ ] **Step 4: Add the performance tracking template**

Include a simple per-gig log with these fields: publication date, impressions, clicks, messages, orders, click-through rate, message conversion, order conversion, average selling price, cancellations, and notes. Use weekly checkpoints without promising search placement.

- [ ] **Step 5: Verify foundation completeness**

Run:

```powershell
rg -n "Ovalens|Donald|GalleryGen|Nova|GetOut|Fixie|Chainwatch|BRRR|AMRAG" "docs/outreach/fiverr/proof-library.md"
rg -n "Launch now|Queued|impressions|click-through rate|order conversion" "docs/outreach/fiverr/README.md"
```

Expected: every project appears in the proof library and the README contains the launch labels and measurement fields.

---

### Task 2: Draft Launch Gig 1 — RAG AI Chatbot

**Files:**
- Create: `docs/outreach/fiverr/gigs/01-rag-ai-chatbot.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Define positioning and overview**

Target the primary query "RAG AI chatbot." Use a title focused on building a custom chatbot trained on the buyer's documents or website. Recommend the closest current AI Development/chatbot category, service type, metadata, and five distinct tags covering RAG chatbot, AI chatbot, LangChain, Python chatbot, and custom knowledge base.

- [ ] **Step 2: Create three bounded packages**

Use the approved $175 / $550 / $1,500 anchors. Scope Basic as a local or hosted proof of concept using one data source; Standard as a branded web chatbot with multiple sources, citations, and conversation memory; Premium as a production-oriented chatbot with authentication, one business integration, deployment, documentation, and tests. State concrete limits for sources, pages/documents, integrations, revisions, and delivery.

- [ ] **Step 3: Write all conversion content**

Write the description within 1,200 characters, five FAQs, buyer requirements, extras, three gallery cards, and a short video script. Address hallucinations honestly: RAG and citations reduce unsupported answers but do not guarantee perfect accuracy.

- [ ] **Step 4: Add proof and risk controls**

Use Ovalens, Fixie, Nova, and AMRAG where directly relevant. Exclude API usage, hosting, large-scale data cleaning, and ongoing support unless purchased. Require a message before ordering for regulated data, private-network deployment, or more than one integration.

- [ ] **Step 5: Run pre-publish checks**

Confirm title length in the live Fiverr editor, exactly five tags, three packages, five FAQs, required/optional labels, three gallery concepts, one video script, and a description no longer than 1,200 characters.

---

### Task 3: Draft Launch Gig 2 — AI SaaS MVP

**Files:**
- Create: `docs/outreach/fiverr/gigs/02-ai-saas-mvp.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Define positioning and overview**

Target "AI SaaS MVP." Focus the title on a full-stack MVP using a Python backend and responsive web interface. Use five tags covering AI SaaS, SaaS MVP, Python web app, FastAPI, and Next.js.

- [ ] **Step 2: Create three bounded packages**

Use $300 / $900 / $2,500. Scope Basic as an architecture session plus clickable or functional single-flow prototype; Standard as one core AI workflow with Python API, responsive frontend, database, and deployment; Premium as a multi-flow MVP with authentication, billing-ready architecture, background jobs, observability, tests, documentation, and deployment. Explicitly cap pages, workflows, integrations, and revisions.

- [ ] **Step 3: Write all conversion content**

Produce the description, five FAQs, buyer requirements, extras, gallery copy, and video script. State that polished custom branding, app-store submission, legal documentation, and unlimited feature development are outside fixed packages.

- [ ] **Step 4: Add portfolio proof**

Use Ovalens as the primary proof. Use Donald for deployed full-stack architecture and real user traction. Use Fixie as supporting evidence for AI, background jobs, and voice integrations.

- [ ] **Step 5: Run pre-publish checks**

Verify every standard field, the 1,200-character description limit, package scope progression, and no overlap with the narrower FastAPI, Django/Flask, or LLM-integration gigs.

---

### Task 4: Draft Launch Gig 3 — Machine-Learning Model

**Files:**
- Create: `docs/outreach/fiverr/gigs/03-machine-learning-model.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Define positioning and overview**

Target "machine learning model Python." Focus on classification, regression, or prediction from buyer-supplied labelled/tabular data. Use tags for machine learning, Python ML, predictive model, data science, and scikit learn.

- [ ] **Step 2: Create three bounded packages**

Use $125 / $400 / $950. Scope Basic as data review plus baseline model; Standard as preprocessing, comparison of multiple suitable models, evaluation, and reproducible notebook/script; Premium as tuned model, explainability, tested inference code, API or lightweight demo, and documentation. State row, feature, model-family, and revision limits.

- [ ] **Step 3: Write all conversion content**

Produce the full description, five FAQs, requirements, extras, gallery concepts, and video script. Require a sample dataset and target definition before ordering. State that model performance depends on data and cannot be guaranteed.

- [ ] **Step 4: Add proof**

Use the professional contrastive-learning result and AMRAG research carefully, preserving their context. Use GetOut only when discussing embeddings or similarity models.

- [ ] **Step 5: Run pre-publish checks**

Verify that the gig excludes computer vision, NLP pipelines, time-series forecasting, recommendation systems, data labelling, and production deployment because each has a dedicated queued gig.

---

### Task 5: Draft Launch Gig 4 — Python Automation

**Files:**
- Create: `docs/outreach/fiverr/gigs/04-python-automation.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Define positioning and overview**

Target "Python automation." Focus on repetitive file, spreadsheet, API, reporting, and internal workflow tasks. Use tags for Python automation, Python script, task automation, API automation, and workflow automation.

- [ ] **Step 2: Create three bounded packages**

Use $75 / $225 / $600. Scope Basic as one simple local script; Standard as a multi-step workflow using files or one API; Premium as a scheduled, logged workflow with multiple steps, error handling, documentation, and deployment assistance. Cap inputs, APIs, workflow steps, revisions, and delivery.

- [ ] **Step 3: Write all conversion content**

Produce the description, FAQs, requirements, extras, gallery copy, and video script. Exclude scraping, autonomous agents, CAPTCHA bypass, bulk unsolicited messaging, and platform-rule evasion.

- [ ] **Step 4: Add proof**

Use the professional extraction tool's approximately 20 hours/week saved and the AI operations tool's recovery-time improvement as founder experience, not Acumei client claims. Use BRRR Agent for structured Python workflow proof.

- [ ] **Step 5: Run pre-publish checks**

Verify that every automation is legal, authorised, bounded, and distinguishable from the dedicated scraping and AI-agent gigs.

---

### Task 6: Draft Queued AI and Web Gigs

**Files:**
- Create: `docs/outreach/fiverr/gigs/05-fastapi-rest-api.md`
- Create: `docs/outreach/fiverr/gigs/06-django-flask-web-app.md`
- Create: `docs/outreach/fiverr/gigs/07-llm-website-integration.md`
- Create: `docs/outreach/fiverr/gigs/08-ai-agent-automation.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Draft the FastAPI REST API gig**

Target FastAPI development. Separate packages into endpoint prototype, authenticated database-backed API, and production-oriented API with Docker, tests, documentation, observability, and deployment. Use Ovalens, Donald, and Fixie as proof.

- [ ] **Step 2: Draft the Django/Flask web application gig**

Target custom Python web application development. Separate packages by one workflow, multi-page database application, and deployed application with authentication, admin, tests, and documentation. Keep AI features optional so this gig remains distinct from AI SaaS.

- [ ] **Step 3: Draft the LLM website integration gig**

Target OpenAI/Claude/Gemini API integration into an existing site. Separate one isolated feature, a contextual feature with storage and safeguards, and a deployed multi-step integration with streaming, tool calls, tests, and monitoring. Clarify that provider fees and model outputs are not guaranteed.

- [ ] **Step 4: Draft the AI-agent automation gig**

Target AI agent and LangGraph/tool-use searches. Separate a single-tool proof of concept, a multi-tool guarded workflow, and a production-oriented agent with state, retries, approval gates, evaluation, logging, and deployment. Use Nova, GalleryGen, Ovalens, and BRRR Agent.

- [ ] **Step 5: Complete all standard listing fields**

For each of the four files, add five tags, three packages with prices, extras, description, five FAQs, requirements, three gallery concepts, video script, exclusions, proof, cross-sells, and pre-publish checks.

---

### Task 7: Draft Queued Applied-ML Gigs

**Files:**
- Create: `docs/outreach/fiverr/gigs/09-computer-vision.md`
- Create: `docs/outreach/fiverr/gigs/10-nlp-document-pipeline.md`
- Create: `docs/outreach/fiverr/gigs/11-time-series-forecasting.md`
- Create: `docs/outreach/fiverr/gigs/12-recommendation-system.md`
- Create: `docs/outreach/fiverr/gigs/14-ml-model-deployment.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Draft the computer-vision gig**

Target image classification or object detection. Bound packages by dataset review/baseline, trained and evaluated model, and tuned model with inference API/demo. Use GalleryGen and the founder's ML experience. Exclude data labelling unless added separately.

- [ ] **Step 2: Draft the NLP document-pipeline gig**

Target document extraction and text classification. Bound packages by one document type, multi-field or multi-class pipeline, and tested deployed workflow with human-review controls. Use Nova, Fixie, Ovalens, and AMRAG.

- [ ] **Step 3: Draft the time-series forecasting gig**

Target sales, demand, or operational forecasting from historical data. Bound packages by baseline analysis, compared forecasting models, and tuned reproducible pipeline with backtesting, explainability, and API/demo. State minimum data-history requirements and no guaranteed forecast accuracy.

- [ ] **Step 4: Draft the recommendation-system gig**

Target product, content, or user recommendations. Bound packages by baseline similarity, hybrid/personalised ranking, and deployed recommendation API with evaluation and monitoring hooks. Use GetOut as the primary portfolio proof.

- [ ] **Step 5: Draft the ML deployment gig**

Target deployment of an existing model as FastAPI, Docker, or web demo. Bound packages by local API wrapper, containerised tested API, and cloud deployment with authentication, logging, observability, and documentation. Keep model training outside scope.

- [ ] **Step 6: Complete all standard listing fields**

For all five files, include every section in the required order and ensure each gig owns a distinct ML search intent.

---

### Task 8: Draft Queued Python Utility Gigs

**Files:**
- Create: `docs/outreach/fiverr/gigs/13-python-web-scraping.md`
- Create: `docs/outreach/fiverr/gigs/15-python-debugging-testing.md`
- Reference: `docs/outreach/fiverr/proof-library.md`

- [ ] **Step 1: Draft the web-scraping gig**

Target Python web scraping and data extraction. Bound packages by one public static source, one dynamic source with pagination, and a scheduled multi-source pipeline with structured export, logging, and deployment assistance. State that work requires lawful access and excludes CAPTCHA bypass, access-control circumvention, private data, and prohibited collection.

- [ ] **Step 2: Draft the debugging and testing gig**

Target Python bug fixing, optimisation, and automated tests. Bound packages by one reproducible bug, a small-module repair with tests, and broader diagnosis/optimisation with a capped codebase size, test suite, and written findings. Use Chainwatch's 138+ tests and professional pipeline improvements as proof.

- [ ] **Step 3: Complete all standard listing fields**

Add all overview, package, conversion, proof, risk, gallery, video, and cross-sell sections to both files.

---

### Task 9: Validate the Entire Catalog

**Files:**
- Review: `docs/outreach/fiverr/README.md`
- Review: `docs/outreach/fiverr/proof-library.md`
- Review: `docs/outreach/fiverr/gigs/*.md`

- [ ] **Step 1: Verify file count**

Run:

```powershell
(Get-ChildItem "docs/outreach/fiverr/gigs" -Filter "*.md").Count
```

Expected: `15`.

- [ ] **Step 2: Verify required sections**

Run:

```powershell
$sections = @("Positioning","Fiverr Overview","Packages","Extras","Description","FAQs","Buyer Requirements","Gallery","Video Script","Scope and Terms","Portfolio Proof","Cross-Sells","Pre-Publish Checks")
$files = Get-ChildItem "docs/outreach/fiverr/gigs" -Filter "*.md"
foreach ($file in $files) {
  $text = Get-Content $file.FullName -Raw
  $missing = $sections | Where-Object { $text -notmatch [regex]::Escape("## $_") }
  if ($missing) { "$($file.Name): missing $($missing -join ', ')" }
}
```

Expected: no output.

- [ ] **Step 3: Scan for unsupported or unfinished claims**

Run:

```powershell
rg -n -i "TBD|TODO|placeholder|guaranteed accuracy|guaranteed results|rank number one|top of Fiverr|unlimited revisions" "docs/outreach/fiverr"
```

Expected: no matches except explicit warnings against guarantees, if quoted in scope controls.

- [ ] **Step 4: Review keyword separation**

Create a 15-row keyword map in `README.md` with one unique primary query per gig. Confirm no two rows use the same primary query and each primary query matches its gig's service.

- [ ] **Step 5: Review package economics**

Check each Basic package for a hard scope cap, each Standard package for a commercially useful outcome, and each Premium package for added implementation depth. Ensure no package quietly includes unbounded data work, integrations, design, hosting, or support.

- [ ] **Step 6: Review evidence attribution**

Compare every metric in the gig files against `proof-library.md`. Confirm that employer and internship results are attributed to the founder's professional or research experience and are never described as Acumei client outcomes.

- [ ] **Step 7: Perform final field-limit review**

Check every title in Fiverr's live editor and every description with a character counter. Confirm five tags and five FAQs per listing. Record the final verified category and metadata selections in each gig's pre-publish checklist.

- [ ] **Step 8: Check repository status**

Run:

```powershell
git status --short
```

Expected: the plan, specification, README, proof library, and 15 gig files appear as intended. Do not create a commit unless the user explicitly requests one.
