---
title: Open Follow-ups
aliases: [Follow-ups, Open Items]
type: reference
tags: [background, follow-ups]
---

# Open Follow-ups

This document tracks known open items in the career ladder framework — things we've identified but haven't yet addressed. Once a follow-up is resolved, the outcome should be recorded in [[decisions]].

---

## Assessment Process — needs alignment with HR

**Opened:** 2026-05-19
**Status:** Open
**Owner:** TBD (needs HR alignment)

The ladder defines *what* each level is, but does not define *how* someone is assessed against it. Open questions:

- How often is someone assessed (yearly, half-yearly, ad-hoc)?
- Who decides on promotion — direct manager, panel, peer feedback?
- What evidence is required? Sustained behavior over what period?
- What happens if someone no longer meets the level they were promoted to?
- How does the assessment interact with the KV-mandated salary progression (which happens automatically over time regardless of performance)?

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

- [[web-frontend|Web Frontend]] — Senior L1 spelled out; Junior, Expert, Senior L2, Lead to be added
- **Backend** — to be created
- **Infrastructure** — to be created
- **3D / Configurator** — to be created

Each domain expert or lead owns the profile for their area.

---
