---
title: Career Ladder Overview
aliases: [Overview, Career Ladder]
type: overview
tags: [career-ladder, overview]
---

# Career Ladder – Overview

## Levels at a Glance

| Level     | IT KV                   | Operating Level         | What this means                                                         |
| --------- | ----------------------- | ----------------------- | ----------------------------------------------------------------------- |
| Junior    | ST1 Einstieg (max 3 J.) | Guided contributor      | Delivers with support; primary job is to learn                          |
| Expert    | ST1 Regel (max 4 J.)    | Independent contributor | Owns and delivers their work reliably                                   |
| Senior L1 | ST1 Erfahrung           | Senior contributor      | Delivers complex work reliably; lifts the team through craft and reviews |
| Senior L2 | ST2 Regel *             | Multiplier              | Makes others better, through tech leadership or people leadership       |
| Lead      | ST2 Erfahrung           | Org shaper              | Defines how engineering works; impact outlasts individual contributions |

\* Senior L2 normally maps to **ST2 Regel**. When someone moves from **ST1 Erfahrung** (Senior L1) into ST2, the KV transition is **ST1 Erfahrung → ST2 Regel**, not ST2 Einstieg. **ST2 Einstieg** only applies when someone is moved from **ST1 Regel** into ST2 early; in that case they already operate at Senior L2 expectations, but the KV salary floor progresses from ST2 Einstieg to ST2 Regel within max 3 years. See [[kv-informationstechnologie-2026|IT KV details]].

## Track Split

From Senior L2 onward, the ladder splits into two tracks:

| Level | Technical Track | Management Track |
|-------|----------------|------------------|
| Senior L2 | [Technical multiplier](<04a Senior-L2 (technical track).md>) — system ownership, architectural leadership | [People multiplier](<04b Senior-L2 (management track).md>) — team delivery, coaching, people development |
| Lead | [Technical visionary](<05a Lead (technical track).md>) — defines tech future, org-wide technical impact | [Engineering leader](<05b Lead (management track).md>) — shapes org culture, talent strategy, company influence |

## Starting Level & Progression

**Most external hires start at Expert.** The Junior level is reserved for career starters (graduates, career changers, or trainees) who need structured guidance and onboarding.

**Senior L1 requires Roomle-specific knowledge.** A strong engineer hired from Big Tech or another company may have the general technical skills of a Senior, but Senior L1 at Roomle also requires understanding of our systems, our domain, our team dynamics, our ambiguity level, and our way of working. Concretely: working across the breadth of our stack — from Roomle Script and the C/C++ Core through the Web SDK (three.js) and the embedding library to the Vue UI in roomle-ui and the Java REST backend (RAPI); recognizing whether a reported bug is content, code, integration, or a Homag-side change (see [[engineering-context#What makes Roomle hard|Engineering Context]]); and operating with the ambiguity that comes with a 30-person product unit inside a 10k+ industrial group. Roomle's experience is that seniority from large corporations does not automatically translate into Roomle Senior performance from day one: people from highly specialized, process-heavy environments can struggle with the autonomy, breadth, and context-switching expected here. Engineers with freelancer or agency backgrounds often ramp faster because they are already used to ownership across messy boundaries. External hires therefore typically start at Expert and can progress quickly once they demonstrate Roomle-context seniority. This is not a demotion; it is an acknowledgment that seniority is partly contextual.

**IT KV advancement is legally mandated within a "Verwendungsgruppe".** The KV defines maximum durations per "Vorrückungsstufe" (e.g., max 3 years at Einstieg, max 4 years at Regel). Once those durations pass, the employer is **legally required** to advance the employee to the next "Vorrückungsstufe", regardless of performance. This means:

- Within **ST1**: an employee will progress through Einstieg → Regel → Erfahrung automatically over time. The KV guarantees this salary progression, but the employee's performance **must** keep pace with the corresponding ladder level (e.g., meeting Senior L1 expectations when arriving at ST1 Erfahrung). If an employee reaches a KV-mandated salary baseline but cannot sustainably meet the behavioral and technical expectations of that level, the company cannot simply pay the higher salary for lower-level output. In such cases, legal and economic reality forces a termination of the contract.
- Within **ST2**: the same applies. Once someone enters ST2, they will progress to ST2 Erfahrung (Lead level) over time. The employee is strictly expected to grow into that level of responsibility. If they top out at Senior L2, or regress in performance, and cannot meet the framework expectations for the salary the KV enforces, they cannot remain in the role.

**Promotion to the next level can happen faster.** If someone demonstrates the next level's expectations consistently, they can be promoted ahead of the KV schedule. But the KV pace is the guaranteed minimum.

**The ST1 → ST2 transition is a deliberate choice.** Moving from ST1 to ST2 (i.e., being promoted to Senior L2) is not automatic, it requires mutual agreement. The KV entry point depends on the employee's current ST1 Vorrückungsstufe: moving from **ST1 Erfahrung** into ST2 means **ST2 Regel**; moving from **ST1 Regel** into ST2 early means **ST2 Einstieg**. However, anyone choosing this path should be aware: once in ST2, the KV will advance them toward **ST2 Erfahrung** over time. This means the company commits to eventually paying ST2 Erfahrung / Lead-level salary, and the employee commits to growing into that level of responsibility. This is a significant mutual commitment and should be discussed openly before promotion.

**Staying at Senior L1 is a valid choice.** Not every engineer wants — or needs — to become a multiplier. Some of our strongest engineers choose to stay at Senior L1 long-term because they enjoy what they do and don't want the broader responsibilities of Senior L2. This is fully respected. It is also a structural reality: a ~30-person company cannot sustain everyone at the Lead level. Senior L1 is a destination, not just a way station.

**Compensation growth is possible at Senior L1 without moving to Senior L2.** ST1 Erfahrung is a KV *minimum*, not a ceiling. An engineer who becomes a recognized deep expert in a Roomle surface — Core (Roomle Script, the C/C++ rules engine), the Web SDK (three.js / AR / rendering), the embedding library, RAPI, Homag Intelligence — can be compensated above the KV floor while remaining at Senior L1. The L1 → L2 step is about taking on multiplier responsibilities (team standards, architecture across the team, growing others), not about being more technically expert. Some of the strongest individual experts in the company are L1 and intentionally stay there; their depth is rewarded through salary, not through a forced move into a multiplier role they don't want.

## Roomle Technical Surfaces

Engineers grow depth in one or more of these surfaces. When level pages and boundary docs say *"their area"* or *"their domain"*, they mean one of the following. Full descriptions in [[engineering-context|Engineering Context]].

| Surface | What it covers | Current shape |
|---|---|---|
| **Rubens** (Room Designer / Configurator / Admin) | The user-facing 3D product, including the Vue 3 frontends in *roomle-ui* and the Ember.js *Rubens Admin* customer back-office | Team of ~5 web engineers, broad surface coverage |
| **Web SDK** | three.js, the canvas, real-time 3D graphics, AR; the rendering library the Vue UI sits on top of | Part of web; one engineer specializes in 3D/AR, others support |
| **Embedding library** | Instantiates Rubens inside customer webshops in an iframe; handles cross-frame `postMessage` and serialization | Part of web; touched by anyone who works on customer integrations |
| **Core** | C/C++ rules engine — Roomle Script interpreter, collision detection, placement constraints, interaction rules. Cross-compiled to WASM (browser) and server | Single engineer; also works across web |
| **RAPI** | Java REST backend — catalog, tenants, content, persistence. Single backend for all Roomle products; minimal role inside Homag Intelligence | Team of 3 |
| **Homag Intelligence (HI)** | The Homag-content variant of Rubens Room Designer (calc.js + glue layer); engineering work spans Rubens, Web SDK, embedding, and a direct Roomle-dev ↔ Homag-dev channel | Cross-cutting; anyone working HI surfaces must hold the Homag-dev conversation |
| **Infrastructure & delivery** | GCP, Kubernetes, Docker, observability, build/release pipelines | Single DevOps engineer |
| **iOS** | Native iOS app (since 2013); maintained for steady revenue, not a strategic growth area | Single iOS engineer |
| **DAP** | Digital asset pipeline | Adjacent to RAPI and Core |

**Single-engineer surfaces (Core, iOS, DevOps) are a structural reality.** The ladder does not require these engineers to mentor inside their surface (no one is there); their multiplier behavior expresses across surfaces or in adjacent surfaces. See the team-of-one paragraph in [[senior-l1-vs-l2|L1 vs L2 boundary]].

**Cross-surface depth is welcomed, not penalized.** The Web + Core engineer is the canonical example; the ladder does not force anyone into a single surface.

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

Each level is evaluated across 5 axes:

| Axis | What it measures |
|------|-----------------|
| [Technical Mastery](<background/idea.md#Technical Mastery>) | Depth and breadth of technical skills; how they solve problems |
| [Learning](<background/idea.md#Learning>) | How they acquire and share knowledge |
| [Responsibility & Ownership](<background/idea.md#Responsibility and Ownership>) | How they own outcomes and empower others |
| [Collaboration & Communication](<background/idea.md#Collaboration and Communication>) | How they work with and through people |
| [Influence](<background/idea.md#Influence>) | How they shape decisions and the organization |

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
