---
title: Production & Operations — Role Profile (cross-cutting)
aliases: [Production Operations Role Profile, Production & Operations, Ops Role Profile]
type: role-profile
domain: production-operations
cross_cutting: true
tags: [role-profile, production, operations, on-call, observability, cross-cutting]
confluence-publish: true
confluence-page-id: '3769925639'
---

# Production & Operations — Role Profile

This is a **cross-cutting role profile**: it applies to all engineers at Roomle regardless of domain (3D/configurator, web frontend, backend, AI/tooling, infrastructure, Core/C++, iOS). Engineers should read it *in addition to* their domain profile.

Production & Operations has its own profile because:

- **Every Roomle surface runs in production** — Rubens, the Web SDK and embedding library, RAPI, Core (delivered as WASM/native), the iOS app, the HI/Homag integrations, and the build/release pipelines. None of them are demos.
- **Production discipline is not a domain skill** — a backend engineer at L2 is not automatically operationally mature, and a frontend engineer can absolutely *be* operationally mature. The progression is its own axis.
- **Roomle ships embedded inside customer webshops**, which makes operational mistakes immediately visible to third parties. A failed deploy or a noisy log is not just an internal event.

Each level is **cumulative**: Expert assumes Junior; Senior L1 assumes Expert; and so on. Each level describes what is *newly expected* at that level. Content is organized by the five [ladder axes](../00 Overview.md#Axes).

Production discipline at Roomle covers, roughly: **observability** (logs, metrics, traces, dashboards), **deployment safety** (CI/CD, rollback, feature flags, gradual rollouts), **incident response** (detection, triage, mitigation, postmortems), **reliability** (SLOs, error budgets, capacity, dependency health), and **cost awareness** (cloud cost, query cost, build cost).

> **Status:** Draft. Owner: TBD. See [Work in Progress](../background/wip.md).

---

## Junior — Production & Operations

**Stance:** Does not break production unsupervised; learns the team's operational practices.

### Technical Mastery

- Knows which environments exist (local, staging, production) and never confuses them
- Reads logs and basic dashboards when investigating an issue, rather than guessing
- Doesn't run destructive commands against production data, ever
- Knows how to roll back their own change or ask someone who can

### Learning

- Learns the team's deploy process by shadowing senior engineers through real releases
- Reads existing runbooks, dashboards, and post-incident notes during onboarding

### Responsibility & Ownership

- Watches their PR through CI and (where applicable) into staging before walking away
- Reports anything they see go wrong in production — even if they're not sure it's their change

### Collaboration & Communication

- Asks before merging anything risky outside their team's normal change window
- During incidents: stays available, follows instructions, does not improvise

### Influence

- Not yet — at this level, *not making things worse* is the operational contribution

---

## Expert — Production & Operations
*Adds on top of Junior.*

**Stance:** Ships their own work to production safely and instruments it well enough that others can see what it does.

### Technical Mastery

- Writes code that is **observable**: meaningful log lines, structured fields, no PII or secrets in logs, error states are distinguishable from success
- Adds or updates metrics/dashboards for changes that matter operationally (a new endpoint, a new background job, a new configurator pipeline step)
- Understands feature flags / gradual rollouts where the surface offers them, and uses them rather than big-bang deploys for risky changes
- Knows how to read a stack trace or error report from production back to the line of code, and how to reproduce against staging
- Understands the basics of their surface's deploy pipeline — what runs in CI, what runs in CD, what the rollback path looks like

### Learning

- Builds working knowledge of the team's monitoring stack (e.g., the tools used for logs/metrics/traces, alert routing, dashboards)
- Reads postmortems from across the org, not just incidents they were involved in

### Responsibility & Ownership

- Owns their change end-to-end: not "merged" but "shipped, observed, and behaving correctly"
- When they cause an incident or a regression, they show up — investigate, communicate, fix, learn

### Collaboration & Communication

- During an incident in their surface: can describe what their recent changes did, can read the relevant dashboards, can do a clean rollback if needed
- Writes a usable changelog / release note for non-trivial changes

### Influence

- Their code is reliably easy to operate — and others notice

---

## Senior L1 — Production & Operations
*Adds on top of Expert.*

**Stance:** Designs for failure; trusted to lead the operational response on their surface; their dashboards and runbooks are the ones the team actually uses.

### Technical Mastery

- **Designs for failure**: thinks about timeouts, retries, circuit breakers, partial failure, idempotency, and data loss when designing features — not only after an incident
- Defines the **observability footprint** for new features: what metrics, what alerts, what dashboards, what log signal is needed to debug this in production
- Knows the **failure modes of their surface**: which downstream calls hurt most when slow, where backpressure builds up, what falls over first under load
- Can lead **incident response on their surface** — coordinates triage, communicates status, decides on mitigation (rollback, feature flag, scale-up), writes the postmortem
- Reasons about **cost and capacity** at the level of "is this query / asset pipeline / WASM payload going to be a problem at 10× traffic" — and acts on the answer
- Understands the deployment topology of their surface end-to-end — what's deployed where, what's bundled into customer webshops, what's served from Roomle infrastructure

### Learning

- Pulls operational lessons out of their incidents — not just "fix the bug" but "what class of mistake was this and what would prevent the class"
- Tracks the team's reliability data over time (incident frequency, alert noise, MTTR-style signals) and notices when it gets worse

### Responsibility & Ownership

- Owns the **operational quality** of their surface, not only the feature work: dashboards stay accurate, alerts stay actionable, runbooks stay current
- On-call ready (where the team has on-call) — picks up pages, doesn't hand them off
- After an incident: drives the **blameless postmortem** to follow-ups that actually land, not a document that sits in Confluence

### Collaboration & Communication

- During incidents: clear, calm, status-update discipline (what's broken, what we've tried, what we're trying next, when next update)
- Writes runbooks and postmortems that someone else can pick up cold

### Influence

- Their dashboards and runbooks become the team's reference implementation
- Other engineers ask them "how would you instrument this?" — and that's a good question

---

## Senior L2 — Production & Operations
*Adds on top of Senior L1.*

**Stance:** Defines the team's operational standards; the team's on-call experience and reliability posture is theirs to own.

### Technical Mastery

- Defines **team-wide observability standards**: what gets instrumented, what naming conventions apply, what dashboards every service must have, what counts as an actionable alert
- Defines or co-defines **SLOs / reliability targets** for the team's surfaces, in terms business and Homag stakeholders can read
- Drives **alert hygiene**: kills noisy alerts, fills gaps in coverage, ensures pages map to a runnable response — alert fatigue is a thing they actively fight
- Owns the **on-call rotation** for the team (scheduling, fairness, handover, escalation paths) where one exists, or proposes establishing one where it doesn't
- Drives **cross-surface operational improvements** — e.g., a unified release pipeline across roomle-ui and the embedding library, a consistent error-reporting standard between RAPI and Web SDK, a shared rollback story

### Learning

- Connected to the broader SRE / production-engineering practice (industry writing, conferences, peer networks) at a working level
- Brings external operational practices back to the team in a form the team can adopt (not "Google says…", but "here's how we'd run this")

### Responsibility & Ownership

- Owns the team's **operational health** as an explicit responsibility, not a side effect — including on-call sustainability, incident-load trends, and unaddressed post-incident follow-ups
- Trades feature work for reliability work when the data says so, and can defend that decision to product
- Holds the team to the operational standards they've defined — through review, mentoring, and (rarely) direct intervention

### Collaboration & Communication

- Runs incident reviews / postmortems for non-trivial incidents on their surface, including ones they weren't on-call for
- Coordinates operationally with adjacent teams — Homag-dev counterparts on HI surfaces, Infrastructure on shared platform concerns
- Translates reliability work into business language for stakeholders and management

### Influence

- The team's operational maturity tracks their tenure — alert noise drops, dashboards become consistent, on-call becomes sustainable
- Other teams adopt their patterns

---

## Lead — Production & Operations
*Adds on top of Senior L2.*

**Stance:** Owns the engineering organization's operational posture; reliability is a strategic concern they hold.

### Technical Mastery

- Sets the **org-wide reliability strategy**: what we measure, what we promise customers, where we invest, what we accept
- Owns the **org-wide incident-response capability**: severity definitions, paging structure, escalation paths to Homag/Dürr when an incident is large enough to need it, communication discipline during a customer-visible outage
- Owns the **cost / capacity strategy** for engineering at the org level — cloud spend posture, build infrastructure, contracts with vendors, capacity planning for known growth (new customers, new HI integrations)
- Owns the relationship between Roomle's operational practice and **Homag/Dürr corporate operations** — security incidents, audit trails, business-continuity expectations, GDPR breach handling

### Learning

- Engaged with industry-level discussions about production engineering, reliability economics, and operational org design
- Maintains an honest read on where Roomle is operationally vs. peer companies — not so we copy them, so we choose deliberately

### Responsibility & Ownership

- Accountable for the org's reliability outcomes — customer-visible uptime, incident severity trend, postmortem follow-through, cost trajectory
- Accountable for an on-call experience the org can sustain over years, not quarters
- Owns the conversation with executive leadership when an operational concern needs investment (more capacity, more headcount, a vendor change, a platform rewrite)

### Collaboration & Communication

- Communicates operational posture to CEO, executive leadership, Homag/Dürr corporate stakeholders, and (when needed) directly to large customers
- Externally represents the company's operational maturity to enterprise customers and partners

### Influence

- Sets the cultural tone: how the org talks about reliability, incidents, and operational work
- Shapes the company's reputation as a credible operator of customer-embedded software
