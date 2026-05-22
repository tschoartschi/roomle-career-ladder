---
title: Open Follow-ups
aliases: [Follow-ups, Open Items]
type: reference
tags: [background, follow-ups]
---

# Open Follow-ups

This document tracks known open items in the career ladder framework — things we've identified but haven't yet addressed. Once a follow-up is resolved, the outcome should be recorded in [decisions](decisions.md).

---

## Performance Review Template (with KV checkpoints)

**Opened:** 2026-05-22
**Status:** Open — skeleton drafted at [`performance-review-skeleton.md`](performance-review-skeleton.md)
**Owner:** TBD (needs HR alignment)

The ladder defines *what* each level is and *what* the level transitions look like, but the operational performance-review process is undocumented. A skeleton in `internal/` proposes a 6-section template (current performance assessment, KV classification fit incl. § 15 II ¶ 2 36-month assessment, Vordienstzeit reconciliation, development plan, compensation review, Dienstzettel implications) and a universal yearly cadence with a 6–12 month pre-KV-step "level fit" conversation.

**Why it matters:** the skeleton is the operational artifact that satisfies the § 15 II ¶ 2 36-month assessment obligation, gives "structural performance issue" language an actual procedure, and gives engineers a predictable, calendar-driven review rhythm rather than ad-hoc conversations near KV jumps.

**Next step:** review the skeleton with HR, decide whether the same artifact is also the Senior L1 → Senior L2 promotion document or a sibling artifact, then move it out of `internal/` once approved. Resolution of this item also resolves the open *Assessment Process*, *ST1 Performance-Gap Timeline*, and *36-Month KV ST1/ST2 Assessment* items.

---

## Dienstzettel update process per § 15 I (8) IT-KV

**Opened:** 2026-05-22
**Status:** Open
**Owner:** TBD (HR-process item)

Any change to an employee's KV classification triggers a Dienstzettel update obligation under § 15 I (8) IT-KV. The ladder currently documents *content* publication to Confluence but says nothing about individual *Dienstzettel* updates, which is an entirely separate HR process.

Open questions:

- Who is responsible for the Dienstzettel update (HR? Head of Engineering? both)?
- What event triggers it (KV Vorrückungsstufe change? Internal promotion? Both?)
- Where is the updated Dienstzettel filed, and is the employee provided a copy?
- How is it tracked so nothing slips through?

**Why it matters:** Dienstzettel updates are a procedural obligation. Missing one doesn't usually create salary backpay risk (which is § 15 II), but it does weaken the company's documentation in any subsequent dispute and creates a § 2 AVRAG procedural finding.

**Next step:** Document the workflow as part of the Performance Review Template discussion with HR. One paragraph in HR's procedures is usually enough.

---

## Equal Treatment review of the assessment process

**Opened:** 2026-05-22
**Status:** Open
**Owner:** TBD (HR + management)

Several axes in the ladder are inherently qualitative (Influence, Collaboration & Communication, Learning). The "deep expert recognition" mechanism for above-floor compensation at Senior L1 is also subjective. Once the operational assessment process exists, it needs a Gleichbehandlungsgesetz review.

Open questions:

- Can the assessment process require multi-evaluator decisions for level changes (rather than a single manager call)?
- What documented evidence is required per axis to support a "meets / does not meet" judgement?
- Is there periodic (e.g., annual) anonymised statistical review of promotion outcomes by protected characteristic to catch pattern issues early?
- Where do refusal-to-promote conversations get documented in a Gleichbehandlung-defensible way?

**Why it matters:** § 6 and § 12 GlBG create both direct and indirect discrimination claims. In a small company with subjective evaluation criteria, the cleanest defence is *process*: multi-rater decisions, documented evidence, periodic review. The framework can otherwise be entirely correct on paper and still produce discriminatory outcomes in practice.

**Next step:** include in the labour-lawyer review (below) and the HR alignment on the assessment process.

---

## Performance-based intervention procedure

**Opened:** 2026-05-22
**Status:** Open
**Owner:** TBD (HR alignment)

The Overview and the L2 → Lead boundary docs describe "structural performance issues" as the consequence of capability not keeping pace with KV-mandated salary advancement, but the *procedure* for handling such a situation is not documented anywhere.

Open questions:

- What constitutes a Verwarnung / Abmahnung in Roomle's process (verbal vs written, who issues, how filed)?
- What is the documented opportunity to improve (timeline, supports offered, success criteria)?
- What is the proportionality assessment before any termination step (could a role change, reduced scope, or coaching solve it instead)?
- What evidence is required at each step to defend the procedure against an AK challenge?
- How does this interact with the Performance Review Template above — same artifact extended, or a separate "intervention track" that begins after a failed review?

**Why it matters:** Austrian labour law makes performance-based dismissal procedurally demanding. The framework's abstract "managed as a structural performance issue" language has no operational backing today, which means the first time it has to happen, it will be improvised — exactly the situation that creates AK exposure.

**Next step:** Draft alongside the Performance Review Template; one informs the other. Both need the labour-lawyer review before going operational.

---

## Labour lawyer review before operational rollout

**Opened:** 2026-05-22
**Status:** Open
**Owner:** Head of Engineering

Before the ladder is used to make any formal classification or promotion decision — and before the Performance Review Template, Dienstzettel process, and Performance-based intervention procedure go operational — commission a written opinion from an Austrian labour lawyer with documented IT-KV § 15 experience.

Scope of the review:

- Does the framework, taken together with the operational HR procedures, expose the company to § 15 II misclassification claims?
- Are the procedural safeguards around performance management, promotion, and dismissal sufficient under current case law?
- Do the assessment axes survive a Gleichbehandlungsgesetz challenge?
- Are there § 96 / § 96a / § 99 ArbVG obligations triggered, and what is the cleanest way to handle them (with or without a Betriebsrat)?

**Why it matters:** the [2026-05-20 decision log](decisions.md) already flags this need. A 2–4 hour consultation costs trivially less than one Umreihung case or one Gleichbehandlungs proceeding. Once the framework is operational without the review, the risk window is open continuously.

**Next step:** identify a labour lawyer with IT sector / IT-KV experience (AK has a referral list; some employer-side firms — Schima Mayer Starlinger, Baker McKenzie, Wolf Theiss, DLA Piper Vienna — also have IT-KV practice). Brief them with the ladder, the Performance Review skeleton, and the decision log. Get the written opinion before any operational use.

---

## ST1 Performance-Gap Timeline — define the path before KV advancement triggers

**Opened:** 2026-05-20
**Status:** Open
**Owner:** TBD (needs HR alignment)

[Decisions](decisions.md#2026-05-22-reframed-kv-time-advancement-from-up-or-out-to-growth-framework) establishes that a failure to meet KV-mandated salary levels will be managed as a structural performance issue. What is *not* yet defined is **the timeline and documented steps of the progression plan** — particularly for the Expert → Senior L1 transition (ST1 Regel → ST1 Erfahrung, max 4 years) and the equivalent ST1 Einstieg → Regel transition (max 3 years).

Open questions:

- At what point in the KV clock does the manager open a formal performance conversation (e.g., month 30 of ST1 Regel)?
- What does that conversation document — gap to next level, required behaviors, evidence, support offered?
- What is the review cadence after the first conversation (monthly, quarterly)?
- At what point is an exit path offered, and how is it framed (mutual separation vs. termination)?
- Who is involved at each step (manager only, manager + HR, HR + Betriebsrat)?
- How does this interact with the 36-month KV ST1/ST2 written assessment (see below) — same artifact, separate artifact, sequenced?

**Why it matters:** Without a written timeline, the performance conversation starts too late, the legal position at termination is weak, and the employee has no fair warning. "We'll have a conversation" is not a process; "at month 30 we open this conversation, at month 42 we decide" is.

**Next step:** Draft the timeline alongside the 36-month assessment artifact below and the broader Assessment Process. These three follow-ups are tightly coupled and should be resolved together with HR.

---

## 36-Month KV ST1/ST2 Assessment — formal artifact required

**Opened:** 2026-05-20
**Status:** Open
**Owner:** TBD (needs HR + Betriebsrat alignment)

§ 15 II of the IT KV (ST2 description, second paragraph) requires that for any employee with less than 36 months of relevant ST1/ST2 experience, classification in ST1 is permissible — but **at the latest after 36 months** (including anrechenbare Vordienstzeiten per § 15 I (9)), the employer must **determine in writing** whether the predominant work matches the ST2 description and, if so, perform an Umreihung to ST2.

This is a legal obligation, not a recommendation. The career ladder currently has no formal artifact backing this assessment.

Open questions:

- What form does the written assessment take (template, evidence requirements, sign-off)?
- Who performs it (direct manager, manager + lead, HR-supported)?
- Is the Betriebsrat involved per § 15 I (7)?
- How is the 36-month clock tracked, including anrechenbare Vordienstzeiten for external hires?
- How does this assessment interact with internal Senior L1 → Senior L2 promotion conversations (same decision, different artifact, or one combined process)?
- How is the outcome recorded and communicated (Dienstzettel update per § 15 I (8))?

**Why it matters:** Senior L1 sits close to the ST1/ST2 boundary (see [L1 vs L2 boundary](../docs/background/boundaries/03-senior-l1-vs-l2.md#kv-relevant-boundary)). The 36-month assessment is the company's primary evidence trail defending an ST1 Erfahrung classification against a challenge from the employee, Betriebsrat, or AK. Without a documented process, classifications rest on individual manager memory and informal calibration.

**Next step:** Draft a one-page assessment template and process, review with HR and (if applicable) Betriebsrat, and decide whether it runs as a standalone artifact or as part of the broader assessment process tracked below. Once defined, the same artifact also satisfies the "honest role-fit conversation at promotion time" need — there is no separate framework needed for that.

---

## Assessment Process — needs alignment with HR

**Opened:** 2026-05-19
**Status:** Open
**Owner:** TBD (needs HR alignment)

The ladder defines *what* each level is, but does not define *how* someone is assessed against it. Open questions:

- How often is someone assessed (yearly, half-yearly, ad-hoc)?
- Who decides on promotion — direct manager, panel, peer feedback?
- What evidence is required? Sustained behavior over what period?
- How does the assessment interact with the KV-mandated salary progression in detail (beyond the ultimate consequence defined in Overview)?

**Why it matters:** Without a defined process, the ladder is a vocabulary, not a system. It works for orientation and 1:1 conversations, but cannot be used for fair, consistent promotion decisions across the company.

**Next step:** Align with HR on a lightweight process that fits a ~30-person company. Avoid heavyweight 360-review machinery designed for much larger orgs.

---

## ~~Expert → Senior L1 Gap~~ — Resolved 2026-05-19

**Opened:** 2026-05-19
**Resolved:** 2026-05-19
**Status:** ~~Open~~ → **Resolved by reframing**

### What we did

Rather than splitting Senior L1 into sub-levels or adding bridging examples, we **reframed Senior L1 as the broad professional destination** (operating level: *Senior contributor*) and softened its description — moving the "actively drives the team" behaviors up to Senior L2. See [the decision entry](decisions.md#2026-05-19-reframed-senior-l1-as-senior-contributor-broad-professional-destination) and the new [L1 vs L2 boundary doc](../docs/background/boundaries/03-senior-l1-vs-l2.md).

Under the new framing:
- **Expert** stays as the ramp-up level (capped by the KV at max 4 years in ST1 Regel).
- **Senior L1** is the destination most engineers naturally grow into — established senior IC, designs systems in their area, contributes to team quality through craft.
- The real career inflection moves to **Senior L1 → Senior L2** (IC → multiplier), which is now the deliberate, mutually-agreed step.

The structural gap that originally motivated this item has been absorbed. The remaining ambiguity is a **calibration question** (when is someone *ready* for Senior L1?) rather than a structural one (does the level exist for them to fit into?). Calibration is handled per person at promotion time, not in the framework.

### ~~Original problem statement~~

> ~~The behavioral gap between Expert and Senior L1 is wider than the other level transitions: Expert is described as a reliable independent contributor — "solves standard problems independently", "follows established team patterns". Senior L1 jumps to designing complex systems from scratch, regularly fixing hard-to-fix bugs, driving team-wide standards, and being a sole developer for extended periods. The missing middle: someone who designs *small* systems, *occasionally* contributes to hard bugs, leads on a single feature but not a full system.~~

---

## ~~Subject-Specific Technical Skills — to be filled out per domain~~ — Resolved 2026-05-19

**Opened:** 2026-05-19
**Resolved:** 2026-05-19
**Status:** ~~Open~~ → **Resolved by replacing with role profiles**

### What we did

Rather than embedding per-domain skill content directly in the ladder, we moved domain expectations to **separate role profiles** that live alongside it. The general ladder defines competencies abstractly; role profiles describe what those competencies look like for each domain.

This keeps the ladder stable and abstract while letting domain content evolve at its own pace (frontend frameworks especially churn fast). It also lets each role profile be owned and refreshed by a domain expert, independently of ladder revisions.

The Web Frontend content that previously lived in Senior L1 has been moved to [Web Frontend role profile](../docs/role-profiles/web-frontend.md). The Subject-Specific section has been removed from Junior, Expert, Senior L1, Senior L2 (technical), and Lead (technical). See [decisions](decisions.md) for the full rationale.

---

## Role Profiles — to be written per domain

**Opened:** 2026-05-19
**Status:** Open
**Owner:** Per domain — TBD

Role profiles describe what each ladder level looks like specifically for a given domain. They live at `docs/role-profiles/` and are maintained independently of the ladder.

Coverage:

**Domain profiles:**

- [Web Frontend](../docs/role-profiles/web-frontend.md) — Junior, Expert, Senior L1 spelled out (axes-based, cumulative, 2026 stack); Senior L2, Lead to be added
- [Backend (RAPI)](../docs/role-profiles/backend.md) — **placeholder created**; per-level content to be defined by RAPI team lead
- [Infrastructure & Delivery](../docs/role-profiles/infrastructure.md) — **placeholder created**; per-level content to be defined by DevOps (single-engineer surface — team-of-one treatment applies)
- [3D / Configurator (Web SDK)](../docs/role-profiles/3d-configurator.md) — **placeholder created**; per-level content to be defined by the 3D specialist
- [Core (C/C++)](../docs/role-profiles/core-cpp.md) — **placeholder created**; per-level content to be defined by the Core engineer (single-engineer surface — team-of-one treatment applies)

**Cross-cutting profiles:**

- [AI Tooling](../docs/role-profiles/ai-tooling.md) — all five levels drafted; owner TBD; needs review and ongoing refresh as the tooling landscape evolves

Each domain expert or lead owns the profile for their area. Cross-cutting profiles need a separate owner (engaged with the team's AI workflow practices). The placeholders exist so the ladder is structurally complete and so a reader sees the gap — they should not be treated as endorsed content until filled in.

---
