---
title: Design Decisions
aliases: [Decisions, ADRs]
type: reference
tags: [background, decisions]
---

# Design Decisions & Changelog

This document tracks key decisions made while designing the Roomle career ladder.

---

## 2026-05-20: Role-profile structure — axes-based, cumulative levels

### Decision

Role profiles follow a fixed structure that will apply to **all domains** (Web Frontend, Backend, Infrastructure, 3D/Configurator, …):

1. **Organized by the five ladder axes** (Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence) — not thematic bullets. This makes role profiles parallel to the ladder.
2. **Cumulative levels**: each level describes only what is *newly expected* at that level. Expert assumes Junior; Senior L1 assumes Expert; etc. Readers add levels up to know the full expectation.

The [[web-frontend|Web Frontend role profile]] has been refreshed under this structure and serves as the template for other domains. Junior, Expert, and Senior L1 are spelled out; Senior L2 and Lead remain open.

The Web Frontend refresh also updated the content to the 2026 stack (Vue 3, Pinia, TypeScript, Vitest, Playwright, Vite — replacing the 2023 framing with Vuex/Jest/Cypress) and added expectations around accessibility, Core Web Vitals, and modern testing strategy.

### Rationale

- **Axes-based organization**: aligns role profiles with the ladder, making it easier to map bullets to axes during 1:1s and promotion discussions.
- **Cumulative levels**: prevents content duplication and clarifies what *changes* at each level. Without it, each level either repeats the previous one or accidentally leaks expectations across boundaries.
- **2026 stack alignment for Web Frontend**: the original 2023 content was missing TypeScript, Vitest, Playwright, accessibility, and performance-metrics expectations — all table stakes by 2026. Refreshing also let us ground bullets in actual project conventions (the `.agents/` guidelines, component ordering, npm-script discipline, HAR mocking).

### Pattern for future domains

When adding Backend, Infrastructure, or 3D/Configurator role profiles, follow the Web Frontend template:

1. Brief intro naming the stack reference (e.g., the relevant repo or project).
2. Explicit statement of the cumulative principle.
3. Each level: stance + 5 axis sections.
4. Each level above Junior labeled "*Adds on top of [previous]*".
5. Levels not yet written marked "To be defined" with a [[follow-ups]] reference.

---

## 2026-05-20: Added boundary docs for all level transitions

### Decision

Added comparison/boundary documents for every level transition, following the pattern established by [[senior-l1-vs-l2]]. Every ladder level now links to its relevant boundary doc(s) via an italic "Boundaries:" line below the intro.

### Rationale

The L1 → L2 boundary doc proved useful for clarifying intent. Extending the pattern to every transition gives a complete set of "how do we tell these levels apart?" references — useful for calibration discussions, promotion conversations, and onboarding new managers to the ladder. Each doc follows the same shape: intro (with KV context) → comparison table → "Why this distinction matters" prose → cross-links to sibling boundary docs.

### Changes

- New: [[junior-vs-expert|Junior → Expert]], [[expert-vs-senior-l1|Expert → Senior L1]], [[senior-l2-vs-lead-technical|Senior L2 → Lead (technical)]], [[senior-l2-vs-lead-management|Senior L2 → Lead (management)]].
- [[senior-l1-vs-l2]] updated with a "Related boundary docs" section.
- All seven level pages updated with an italic "Boundary/Boundaries:" line below the intro.

---

## 2026-05-19: Replaced per-level Subject-Specific Skills with Role Profiles

### Decision

Per-domain technical skills will not be embedded in the ladder. Instead they live in **role profiles** — separate documents per domain, kept at `docs/role-profiles/` — that describe what each ladder level looks like for that domain.

The Web Frontend content previously in Senior L1 has been moved to [[web-frontend|role-profiles/web-frontend.md]]. The Subject-Specific section has been removed from all five technical-track levels.

### Rationale

- **Different lifecycles**: the ladder is meant to be stable (years between revisions); subject-specific skills churn fast (frontend frameworks especially). Coupling them forces ladder updates whenever a framework or library changes.
- **Different owners**: the ladder is owned framework-wide; each role profile can be owned by a domain expert/lead and refreshed independently.
- **Different audiences**: the ladder serves promotion and calibration; role profiles serve hiring and onboarding ("what does a Senior L1 Backend hire look like?"). Two artifacts, two jobs.
- **Avoids fake coverage**: with the Subject-Specific section in the ladder, every level for every domain needed *some* content, encouraging placeholder text. Role profiles are written when there's something real to say.

### Changes

- New: [[web-frontend|docs/role-profiles/web-frontend.md]] — Senior L1 frontend content moved here.
- Subject-Specific Technical Skills section removed from: [[01 Junior|Junior]], [[02 Expert|Expert]], [[03 Senior-L1|Senior L1]], [[04a Senior-L2 (technical track)|Senior L2 (technical)]], [[05a Lead (technical track)|Lead (technical)]].
- [[follow-ups]]: previous Subject-Specific item marked resolved; new Role Profiles item tracks per-domain coverage going forward.

---

## 2026-05-19: Reframed Senior L1 as "Senior Contributor" (broad professional destination)

### Decision

Senior L1 is now framed as an **established senior engineer** and the **broad professional destination** for most engineers — not a stretch tier or a stepping stone. The operating level label changes from "Team driver" to "Senior contributor".

Behaviors that imply *actively driving the team* (defining team-wide standards, owning cross-cutting initiatives, formally mentoring, redesigning team processes) move up to Senior L2. Senior L1 retains influence-through-craft behaviors: PR reviews that nudge consistency, being a go-to expert, helping colleagues when asked, raising process concerns constructively.

### Rationale

- **Reality fit**: Roomle has no Juniors today and won't hire any in the near term. Most engineers naturally reach ST1 Erfahrung within the KV's max 4 years at ST1 Regel — a comfortable destination there matches who we actually employ.
- **Clean KV mapping**: keeping Senior L1 aligned with ST1 Erfahrung avoids decoupling role from salary (the earlier "Expert role / ST1 Erfahrung salary" option felt unappealing to communicate).
- **Meaningful L1 → L2 transition**: by reserving multiplier behaviors for L2, the L1 → L2 step becomes a genuine, intentional career choice — matching the existing ST1 → ST2 mutual-commitment framing in [[idea]].
- **Avoids ladder inflation**: Senior L1 is reachable as a destination, but Senior L2 requires actively choosing the multiplier role.

### Changes

- [[03 Senior-L1|Senior L1]]: framing softened throughout; active/intentional language moved to L2 or removed.
- [[00 Overview|Overview]]: operating level "Team driver" → "Senior contributor"; level-at-a-glance summary updated.
- New: [[senior-l1-vs-l2|Senior L1 vs Senior L2]] reference documenting how the boundary is drawn.
- [[04a Senior-L2 (technical track)|Senior L2 (technical)]] and [[04b Senior-L2 (management track)|Senior L2 (management)]]: cross-links added to the new boundary doc; no behavioral changes (L2 descriptions already represented all of the moved-up content).

### Acknowledged trade-off

The Expert → Senior L1 gap ([[follow-ups]]) is narrower under this framing but does not fully disappear. The gap becomes a calibration question rather than a structural one.

---

## 2026-05-19: Harmonized Axis Stage Naming

### Decision

All stage names across the 5 axes now use **action-oriented verbs** (3rd person singular) instead of a mix of nouns, adjectives, and verbs.

### Rationale

- **Consistency**: The original naming was inconsistent — Technical Mastery used noun-style labels (Novice, Competent, Expert), while Learning used verbs (Adopts, Grows). This made it harder to compare across axes.
- **Observability**: Verb-based names answer the question *"What does this person do at this level?"* — making it easier for managers to assess and for employees to self-evaluate.
- **Positive framing**: Stage 1 should never feel like a negative label. "Individualist" (old Collaboration stage 1) was replaced with "Contributes" — even juniors participate, just at a basic level.

### Changes Made

| Axis | Old Stage Names | New Stage Names |
|------|----------------|-----------------|
| **Technical Mastery** | Novice → Competent → Proficient → Expert → Master | Applies → Solves → Designs → Masters → Creates |
| **Learning** | Adopts → Grows → Initiative → Educates → Evengalizes | Adopts → Grows → Explores → Educates → Evangelizes |
| **Responsibility & Ownership** | Aware → Accountable → Proactive → Empowered → Mentor | Acknowledges → Owns → Drives → Empowers → Mentors |
| **Collaboration & Communication** | Individualist → Contributor → Collaborator → Facilitator → Advocate | Contributes → Collaborates → Facilitates → Leads → Advocates |
| **Influence** | Observer → Contributor → Influencer → Leader → Visionary | Observes → Contributes → Influences → Leads → Shapes |

### Notes

- Learning axis: "Initiative" (noun) → "Explores" (verb); typo "Evengalizes" → "Evangelizes"
- Responsibility axis: "Empowered" (passive) → "Empowers" (active — this person now empowers *others*)
- Collaboration axis: removed the negative framing of stage 1 entirely
- Influence axis: "Visionary" → "Shapes" (more concrete and actionable)

---

## 2026-05-19: Decided Against Dedicated "Process" Axis

### Decision

We will **not** include a dedicated "Process" axis (as used in Engineering Ladders).

### Rationale

- For a ~30-person company, a standalone Process axis feels over-engineered.
- Process maturity naturally emerges in other axes:
  - **Responsibility & Ownership** (stages 3–5: Drives, Empowers, Mentors) covers process improvement
  - **Influence** (stages 3–5) covers shaping how the team/org works
- Fewer axes = simpler framework = easier adoption in a small team.

---

## 2026-05-19: Kept "Learning" as Dedicated Axis

### Decision

Learning remains its own axis rather than being folded into Technical Mastery.

### Rationale

- Roomle specifically struggles with continuous education and professional development.
- Making it an explicit, measurable axis sends a cultural signal that learning is valued.
- It gives managers a concrete conversation tool in 1:1s.
- The distinction: **Technical Mastery** = *what you know*; **Learning** = *how you grow*.

---

## 2026-05-19: Adapted Engineering Ladders Axes for Roomle Context

### Decision

Replaced Engineering Ladders' original 5 axes with Roomle-specific ones.

### Mapping

| Engineering Ladders | Roomle | Why |
|---|---|---|
| Technology | **Technical Mastery** | Broader — includes domain knowledge, not just stack familiarity |
| System | **Responsibility & Ownership** | ~30 people don't have deep "system ownership" hierarchy; accountability is more relevant |
| People | **Collaboration & Communication** | More actionable for a small team where everyone interacts directly |
| Process | **Learning** | Adaptability and growth matter more than process enforcement at this scale |
| Influence | **Influence** | Kept as-is — universal concept |
