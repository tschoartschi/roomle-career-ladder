---
title: Career Ladder Overview
aliases: [Overview, Career Ladder]
type: overview
tags: [career-ladder, overview]
confluence-publish: true
confluence-page-id: '3758620674'
---

# Career Ladder – Overview

## How to read this ladder

The framework has more pages than any single read needs. Here's the order that works for most readers and why.

**Start here (you are reading it).** This page gives you the five levels, the KV salary mapping, and the tech/management track split at L2. Once you've skimmed the tables below, you have the shape of the whole framework.

**Then read the level pages in order, Junior → Lead.** They are cumulative: every level assumes everything from the levels below. Reading them out of order is possible but harder, because the "what's new at this level" framing leans on you having the previous level in your head.

- [01 Junior](<levels/01 Junior.md>) — guided contributor, primary job is to learn
- [02 Expert](<levels/02 Expert.md>) — independent, delivers reliably within their domain
- [03 Senior L1](<levels/03 Senior-L1.md>) — established senior IC; the broad professional destination
- [04a Senior L2 (technical)](<levels/04a Senior-L2 (technical track).md>) and [04b Senior L2 (management)](<levels/04b Senior-L2 (management track).md>) — the multiplier split
- [05a Lead (technical)](<levels/05a Lead (technical track).md>) and [05b Lead (management)](<levels/05b Lead (management track).md>) — org-shaping; structurally rare at our size
- [99 Leitung](<levels/99 Leitung.md>) — explicitly *outside* the ladder; explains why

**Then read [Axes](axes.md).** All level descriptions are organised around the same five axes (Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence). The level pages quote axis verbs (*Applies*, *Solves*, *Designs*, etc.) — Axes is what those verbs actually mean.

**Read the boundary docs only when you need them.** Each one answers "how do we tell these two adjacent levels apart?" — useful for promotion conversations and calibration, less useful as continuous reading. Pick the boundary you care about right now:

- [Junior → Expert](background/boundaries/01-junior-vs-expert.md) · [Expert → Senior L1](background/boundaries/02-expert-vs-senior-l1.md) · [Senior L1 → Senior L2](background/boundaries/03-senior-l1-vs-l2.md) · [Senior L2 → Lead (technical)](background/boundaries/04-senior-l2-vs-lead-technical.md) · [Senior L2 → Lead (management)](background/boundaries/05-senior-l2-vs-lead-management.md)

**Read role profiles when you want domain-specific expectations.** The general ladder describes competencies abstractly; role profiles spell out what those competencies look like for a specific domain.

- [Web Frontend](role-profiles/web-frontend.md) (domain) and [AI Tooling](role-profiles/ai-tooling.md) (cross-cutting — applies to every engineer)

**Background pages are optional context.** [Company Profile](background/company-profile.md) is for external readers who don't know Roomle. [Engineering Context](background/engineering-context.md) explains the Rubens / Core / RAPI / HI vocabulary used in the role profiles. [Work in Progress](background/wip.md) is a placeholder for content not yet written.

### If you only have 10 minutes

Read this page top to bottom, then skim the three levels closest to where you are (or where you want to be). Come back for the rest when you need it.

---

## Levels at a Glance

| Level     | IT KV                   | Operating Level         | What this means                                                         |
| --------- | ----------------------- | ----------------------- | ----------------------------------------------------------------------- |
| Junior    | ST1 Einstieg (max 3 J.) | Guided contributor      | Delivers with support; primary job is to learn                          |
| Expert    | ST1 Regel (max 4 J.)    | Independent contributor | Owns and delivers their work reliably                                   |
| Senior L1 | ST1 Erfahrung           | Senior contributor      | Delivers complex work reliably; lifts the team through craft and reviews |
| Senior L2 | ST2 Regel *             | Multiplier              | Makes others better, through tech leadership or people leadership       |
| Lead      | ST2 Erfahrung           | Org shaper              | Defines how engineering works; impact outlasts individual contributions |

\* Senior L2 normally maps to **ST2 Regel**. When someone moves from **ST1 Erfahrung** (Senior L1) into ST2, the KV transition is **ST1 Erfahrung → ST2 Regel**, not ST2 Einstieg. **ST2 Einstieg** only applies when someone is moved from **ST1 Regel** into ST2 early; in that case they already operate at Senior L2 expectations, but the KV salary floor progresses from ST2 Einstieg to ST2 Regel within max 3 years. See [IT KV details](https://www.wko.at/oe/kollektivvertrag/kv-informationstechnologie-2026.pdf).

## Track Split

From Senior L2 onward, the ladder splits into two tracks:

| Level | Technical Track | Management Track |
|-------|----------------|------------------|
| Senior L2 | [Technical multiplier](<levels/04a Senior-L2 (technical track).md>) — system ownership, architectural leadership | [People multiplier](<levels/04b Senior-L2 (management track).md>) — team delivery, coaching, people development |
| Lead | [Technical visionary](<levels/05a Lead (technical track).md>) — defines tech future, org-wide technical impact | [Engineering leader](<levels/05b Lead (management track).md>) — shapes org culture, talent strategy, company influence |

## Starting Level & Progression

**Most external hires start at Expert.** The Junior level is reserved for career starters (graduates, career changers, or trainees) who need structured guidance and onboarding.

**Senior L1 requires Roomle-specific knowledge; Senior L2 requires Roomle-specific *context*.** A strong engineer hired from Big Tech or another company may have the general technical skills of a Senior, but Senior L1 at Roomle additionally requires understanding our systems, our domain, our team dynamics, our ambiguity level, and our way of working. Concretely:

- **Beginning at Senior L1, Roomle-specific knowledge becomes very relevant.** No one is expected to write Roomle Script *and* three.js *and* the Java backend — depth lives in one or two surfaces. But an L1 is expected to *understand how the parts fit together*: how a Roomle Script change in Core surfaces through the WASM boundary into the Web SDK, how the Vue UI in roomle-ui sits on top of the SDK, how the embedding library mediates between Rubens and a customer's webshop, and where RAPI sits behind all of it. That mental model is what lets an L1 reliably helps to make decisions and also to triage whether a reported bug is content, code, integration, or a Homag-side change (see [Engineering Context](background/engineering-context.md#what-makes-roomle-hard)).
- **At Senior L2, Roomle context becomes one of the main requirements.** Multiplier work — team-wide standards, cross-surface architecture, leading initiatives that span engineers other than themselves — is only credible when the person decides with full awareness of the Roomle landscape: who owns which surface, where the Homag-dev counterparts sit, what the embedding contract guarantees to customers, what the 30-person-product-unit-inside-10k+-industrial-group reality actually means for trade-offs. An L2 without Roomle context will optimize for the wrong thing.

Roomle's experience is that seniority from large corporations does not automatically translate into Roomle Senior performance from day one: people from highly specialized, process-heavy environments can struggle with the autonomy, breadth, and context-switching expected here. Engineers with freelancer or agency backgrounds often ramp faster because they are already used to ownership across messy boundaries. External hires therefore typically start at Expert and can progress quickly once they demonstrate Roomle-context seniority. This is not a demotion; it is an acknowledgment that seniority is partly contextual.

**IT KV advancement is legally mandated within a "Verwendungsgruppe".** The KV defines maximum durations per "Vorrückungsstufe" (e.g., max 3 years at Einstieg, max 4 years at Regel). Once those durations pass, the employer is **legally required** to advance the employee to the next "Vorrückungsstufe", regardless of performance. This means:

- Within **ST1**: an employee will progress through Einstieg → Regel → Erfahrung automatically over time. The KV guarantees this salary progression, but the employee's performance **must** keep pace with the corresponding ladder level (e.g., meeting Senior L1 expectations when arriving at ST1 Erfahrung). If an employee reaches a KV-mandated salary baseline but cannot sustainably meet the behavioral and technical expectations of that level, the company cannot simply pay the higher salary for lower-level output. In such cases, legal and economic reality forces a termination of the contract.
- Within **ST2**: the same applies. Once someone enters ST2, they will progress to ST2 Erfahrung (Lead level) over time. The employee is strictly expected to grow into that level of responsibility. If they top out at Senior L2, or regress in performance, and cannot meet the framework expectations for the salary the KV enforces, they cannot remain in the role.

**Promotion to the next level can happen faster.** If someone demonstrates the next level's expectations consistently, they can be promoted ahead of the KV schedule. But the KV pace is the guaranteed minimum.

**The ST1 → ST2 transition is a deliberate choice.** Moving from ST1 to ST2 (i.e., being promoted to Senior L2) is not automatic, it requires mutual agreement. The KV entry point depends on the employee's current ST1 Vorrückungsstufe: moving from **ST1 Erfahrung** into ST2 means **ST2 Regel**; moving from **ST1 Regel** into ST2 early means **ST2 Einstieg**. However, anyone choosing this path should be aware: once in ST2, the KV will advance them toward **ST2 Erfahrung** over time. This means the company commits to eventually paying ST2 Erfahrung / Lead-level salary, and the employee commits to growing into that level of responsibility. This is a significant mutual commitment and should be discussed openly before promotion.

**Staying at Senior L1 is a valid choice.** Not every engineer wants — or needs — to become a multiplier. Some of our strongest engineers choose to stay at Senior L1 long-term because they enjoy what they do and don't want the broader responsibilities of Senior L2. This is fully respected. It is also a structural reality: a ~30-person company cannot sustain everyone at the Lead level. Senior L1 is a destination, not just a way station.

**Compensation growth is possible at Senior L1 without moving to Senior L2.** ST1 Erfahrung is a KV *minimum*, not a ceiling. An engineer who becomes a recognized deep expert in a Roomle surface — Core (Roomle Script, the C/C++ rules engine), the Web SDK (three.js / AR / rendering), the embedding library, RAPI, Homag Intelligence — can be compensated above the KV floor while remaining at Senior L1. The L1 → L2 step is about taking on multiplier responsibilities (team standards, architecture across the team, growing others), not about being more technically expert. Some of the strongest individual experts in the company are L1 and intentionally stay there; their depth is rewarded through salary, not through a forced move into a multiplier role they don't want.

## Roomle Technical Surfaces

Engineers grow depth in one or more of these surfaces. When level pages and boundary docs say *"their area"* or *"their domain"*, they mean one of the following. Full descriptions in [Engineering Context](background/engineering-context.md).

| Surface                                           | What it covers                                                                                                                                                           | Current shape                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **Rubens** (Room Designer / Configurator / Admin) | The user-facing 3D product, including the Vue 3 frontends in *roomle-ui* and the Ember.js *Rubens Admin* customer back-office                                            | Team of ~5 web engineers, broad surface coverage                               |
| **Web SDK**                                       | three.js, the canvas, real-time 3D graphics, AR; the rendering library the Vue UI sits on top of                                                                         | Part of web; one engineer specializes in 3D/AR, others support                 |
| **Embedding library**                             | Instantiates Rubens inside customer webshops in an iframe; handles cross-frame `postMessage` and serialization                                                           | Part of web; touched by anyone who works on customer integrations              |
| **Core**                                          | C/C++ rules engine — Roomle Script interpreter, collision detection, placement constraints, interaction rules and more. Cross-compiled to WASM (browser) and server      | Single engineer; also works across web                                         |
| **RAPI**                                          | Java REST backend — catalog, tenants, content, persistence. Single backend for all Roomle products; "CMS of Roomle Data", minimal role inside Homag Intelligence         | Team of 3                                                                      |
| **Homag Intelligence (HI)**                       | The Homag-content variant of Rubens Room Designer (calc.js + glue layer); engineering work spans Rubens, Web SDK, embedding, and a direct Roomle-dev ↔ Homag-dev channel | Cross-cutting; anyone working HI surfaces must hold the Homag-dev conversation |
| **Infrastructure & delivery**                     | GCP, Kubernetes, Docker, observability, build/release pipelines                                                                                                          | Single DevOps engineer<br>RAPI engineers support if needed                     |
| **iOS**                                           | Native iOS app (since 2013); maintained for steady revenue, not a strategic growth area                                                                                  | Single iOS engineer                                                            |
| **DAP**                                           | Digital asset pipeline                                                                                                                                                   | Adjacent to RAPI and Core                                                      |

**Single-engineer surfaces (Core, iOS, DevOps...) are a structural reality.** The ladder does not require these engineers to mentor inside their surface (no one is there); their multiplier behavior expresses across surfaces or in adjacent surfaces. See the team-of-one paragraph in [L1 vs L2 boundary](background/boundaries/03-senior-l1-vs-l2.md). Cross-surface depth (e.g., the Web + Core engineer) is explicitly welcomed — see [Engineering Context → Team shape](background/engineering-context.md#team-shape).

## Technical Track vs Management Track

From Senior L2 onward, the ladder offers two equally senior, equally valuable tracks, just with a different focus.

### What they own

| | Technical Track | Shared | Management Track |
|---|---|---|---|
| **Owns** | System & architecture | Roadmap & process | People & delivery |
| **Decisions** | *How* to build it | *What* to build | *Who* builds it & *when* |
| **Quality means** | Code, architecture, reliability | Standards, practices | Team health, sustainable pace |
| **Grows others by** | Teaching, reviewing, pairing | Setting expectations | Coaching, feedback, career planning |
| **Time allocation** | 50–70% hands-on | — | Player-Coach (depends on team size, up to 50% hands-on) |

### What they do day-to-day

| Activity | Technical Track | Management Track |
|----------|----------------|------------------|
| Architecture decisions | Drives & decides | Participates, asks good questions |
| Code reviews | Active reviewer, sets standards | Occasional, not on critical path |
| 1:1s with team members | Informal, technical mentoring | Structured, career & wellbeing focused |
| Hiring | Evaluates technical depth | Owns hiring process & team composition |
| Cross-team coordination | Technical alignment & dependencies | Stakeholder management & priorities |
| Performance issues | Flags concerns, provides evidence | Owns the conversation & resolution |
| Production incidents | Leads technical response | Shields team, communicates to stakeholders |
| Planning | Estimates, scopes, identifies risks | Prioritizes, staffs, manages capacity |

Neither track is "above" the other. In small teams, one person may cover both, but as teams grow, these responsibilities should be separated.

---

## Axes

Levels alone don't capture *how* an engineer operates. A Senior L1 who is technically brilliant but never lifts the team looks very different from a Senior L1 who is solid technically but mentors everyone around them — and the ladder needs to see both. To do that, each level is evaluated across **five axes**, and each axis has its own per-level expectation. An engineer's shape on these five axes — not just their level — is what the framework actually evaluates.

The five axes are:

| Axis | What it measures |
|------|-----------------|
| [Technical Mastery](axes.md#technical-mastery) | Depth and breadth of technical skills; how they solve problems |
| [Learning](axes.md#learning) | How they acquire and share knowledge |
| [Responsibility & Ownership](axes.md#responsibility-and-ownership) | How they own outcomes and empower others |
| [Collaboration & Communication](axes.md#collaboration-and-communication) | How they work with and through people |
| [Influence](axes.md#influence) | How they shape decisions and the organization |

### What the shape looks like by level

At every level, all five axes move forward together — but the *expected reach* of each axis grows differently between Senior L1 (deep contributor) and Senior L2 (multiplier). The reference shape is intentionally uniform per level (●  = expected reach on that axis, ○ = not yet expected):

| Level         | Technical Mastery | Learning | Responsibility | Collaboration | Influence |
| ------------- | ----------------- | -------- | -------------- | ------------- | --------- |
| **Junior**    | ●○○○○             | ●○○○○    | ●○○○○          | ●○○○○         | ●○○○○     |
| **Expert**    | ●●○○○             | ●●○○○    | ●●○○○          | ●●○○○         | ●●○○○     |
| **Senior L1** | ●●●○○             | ●●●○○    | ●●●○○          | ●●●○○         | ●●●○○     |
| **Senior L2** | ●●●●○             | ●●●●○    | ●●●●○          | ●●●●○         | ●●●●○     |
| **Lead**      | ●●●●●             | ●●●●●    | ●●●●●          | ●●●●●         | ●●●●●     |

> The reference shape is uniform per level: the ladder expects an engineer at a given level to meet *every* axis at that level (see [Evaluation & Aggregation Rule](#evaluation-aggregation-rule) below). Real engineers will be spikier — strong on some axes, weaker on others. The shape an individual draws against the reference is what a calibration conversation is actually about. The per-axis verb (*Applies → Solves → Designs → Masters → Creates* for Technical Mastery, etc.) is what each filled dot actually means, see the table below.

### Stage Verbs by Level

| | Technical Mastery | Learning | Responsibility | Collaboration | Influence |
|---|---|---|---|---|---|
| **Junior** | Applies | Adopts | Acknowledges | Contributes | Observes |
| **Expert** | Solves | Grows | Owns | Collaborates | Contributes |
| **Senior L1** | Designs | Explores | Drives | Facilitates | Influences |
| **Senior L2** | Masters | Educates | Empowers | Leads | Leads |
| **Lead** | Creates | Evangelizes | Mentors | Advocates | Shapes |

---

## Evaluation & Aggregation Rule

When evaluating an engineer for a level (e.g., for promotion to Senior L1), managers must look at up to three artifacts:
1. **The Core Ladder** (e.g., `03 Senior-L1.md`)
2. **The Domain Profile** (e.g., `web-frontend.md`)
3. **Cross-Cutting Profiles** (e.g., `ai-tooling.md`)

**The Rule**: To achieve a level, an engineer must meet the expectations outlined in **all applicable artifacts** for that level. The domain and cross-cutting profiles are not optional extras; they are mandatory extensions of the core ladder (primarily mapping to the *Technical Mastery* and *Learning* axes).

For example, if utilizing AI tooling efficiently is defined as table stakes for a Senior L1 in 2026, an engineer must meet the Senior L1 criteria in the AI Tooling profile in order to be recognized as a Senior L1 overall. If an engineer is Senior L1 in Web Frontend but only operates at Expert level in AI Tooling, they have not yet met the bar for Senior L1 overall. This prevents the "leakage" of critical modern technical skills.

### Nuance: the rule has a deliberate backdoor

A strict "all axes, all artifacts, all the time" reading would make the framework brittle. Real engineers are spiky, profiles age, and the ladder is supposed to support honest conversations — not become a checkbox audit. Two explicit nuances apply:

1. **Provisional promotion with a development plan.** If an engineer clearly meets the level on 4 of 5 axes (or on the core ladder but not yet on one cross-cutting profile), and the missing piece has a *concrete*, *time-boxed*, *documented* development plan agreed by the engineer and their manager, promotion may happen now with a defined check-in date (typically 3–6 months). At the check-in: either the gap is closed and the promotion stands, or the plan is revised, or the promotion is reversed before the next KV step makes that economically infeasible. "Provisional" must be named explicitly — not implied.
2. **Compensating strength is acknowledged, but does not waive a missing axis.** An engineer who is exceptionally strong on Technical Mastery does not thereby meet the Influence bar. However, exceptional depth *can* justify a higher salary at the current level (see [Compensation growth is possible at Senior L1…](#starting-level-progression)). The career step and the compensation step are two different conversations — the backdoor is in compensation, not in the level definition.

Both nuances require **written documentation** (in the engineer's review record). The backdoor is not informal manager discretion; it is a tracked decision with a date attached. If a manager finds themselves wanting a third type of exception, that is a signal to re-examine the level definition itself, not to widen the backdoor.
