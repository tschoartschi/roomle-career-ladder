---
title: Open Follow-ups
aliases: [Follow-ups, Open Items]
type: reference
tags: [background, follow-ups]
---

# Open Follow-ups

This document tracks known open items in the career ladder framework — things we've identified but haven't yet addressed. Once a follow-up is resolved, the outcome should be recorded in [[decisions]].

---

## ST1 Performance-Gap Timeline — define the path before KV advancement triggers

**Opened:** 2026-05-20
**Status:** Open
**Owner:** TBD (needs HR alignment)

[[decisions#2026-05-20 Resolved Regression and Up-or-Out due to IT KV|Decisions]] establishes that termination/separation is the only viable outcome when performance cannot meet the KV-mandated salary level. What is *not* yet defined is **the timeline and documented steps that lead up to that outcome** — particularly for the Expert → Senior L1 transition (ST1 Regel → ST1 Erfahrung, max 4 years) and the equivalent ST1 Einstieg → Regel transition (max 3 years).

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

**Why it matters:** Senior L1 sits close to the ST1/ST2 boundary (see [[senior-l1-vs-l2#KV-relevant boundary|L1 vs L2 boundary]]). The 36-month assessment is the company's primary evidence trail defending an ST1 Erfahrung classification against a challenge from the employee, Betriebsrat, or AK. Without a documented process, classifications rest on individual manager memory and informal calibration.

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

Rather than splitting Senior L1 into sub-levels or adding bridging examples, we **reframed Senior L1 as the broad professional destination** (operating level: *Senior contributor*) and softened its description — moving the "actively drives the team" behaviors up to Senior L2. See [[decisions#2026-05-19 Reframed Senior L1 as Senior Contributor broad professional destination|the decision entry]] and the new [[senior-l1-vs-l2|L1 vs L2 boundary doc]].

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

The Web Frontend content that previously lived in Senior L1 has been moved to [[web-frontend|Web Frontend role profile]]. The Subject-Specific section has been removed from Junior, Expert, Senior L1, Senior L2 (technical), and Lead (technical). See [[decisions]] for the full rationale.

---

## Role Profiles — to be written per domain

**Opened:** 2026-05-19
**Status:** Open
**Owner:** Per domain — TBD

Role profiles describe what each ladder level looks like specifically for a given domain. They live at `docs/role-profiles/` and are maintained independently of the ladder.

Coverage:

**Domain profiles:**

- [[web-frontend|Web Frontend]] — Junior, Expert, Senior L1 spelled out (axes-based, cumulative, 2026 stack); Senior L2, Lead to be added
- **Backend** — to be created
- **Infrastructure** — to be created
- **3D / Configurator** — to be created

**Cross-cutting profiles:**

- [[ai-tooling|AI Tooling]] — all five levels drafted; owner TBD; needs review and ongoing refresh as the tooling landscape evolves

Each domain expert or lead owns the profile for their area. Cross-cutting profiles need a separate owner (engaged with the team's AI workflow practices).

---
