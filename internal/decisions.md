---
title: Design Decisions
aliases: [Decisions, ADRs]
type: reference
tags: [background, decisions]
---

# Design Decisions & Changelog

This document tracks key decisions made while designing the Roomle career ladder.

---

## 2026-05-20: Replaced hard artifact gating with holistic calibration

### Decision

The Overview's evaluation section now treats the core ladder, domain profiles, and cross-cutting profiles as **mandatory inputs**, not independent pass/fail checklists. A level is met when the overall pattern of evidence fits the level: the majority of expectations are consistently demonstrated, gaps are understood, and strong expertise or business-critical impact can outweigh weaker areas where that is reasonable.

Some gaps remain blocking: trust, ownership, legal/security hygiene, repeated quality failures, or missing the core responsibility of the target level cannot be compensated for by narrow expertise alone.

### Rationale

- Real promotion conversations are judgment calls, not a 100m race with a single cutoff time.
- Domain and cross-cutting profiles should inform calibration without turning every bullet into a hard gate.
- The framework still needs guardrails: serious ownership, quality, trust, legal, or security gaps must not be hidden behind exceptional depth elsewhere.

### Changes

- [00 Overview](../docs/00%20Overview.md): "Evaluation & Aggregation Rule" renamed to "Evaluation & Calibration Rule" and rewritten as holistic calibration.
- [03 Senior-L1](../docs/03%20Senior-L1.md): clarified "within their area" as "area of ownership" and aligned the stale `tldr` lines with the softened L1 scope.

---

## 2026-05-20: Corrected ST2 entry mapping and external seniority calibration

### Decision

The Senior L2 KV mapping has been corrected:

- The normal Senior L1 → Senior L2 promotion is **ST1 Erfahrung → ST2 Regel**.
- **ST2 Einstieg** only applies when an employee is moved from **ST1 Regel** into ST2 early.
- ST2 Einstieg is not a separate career level. In that case, the employee already operates at Senior L2 expectations, but the KV salary floor progresses from ST2 Einstieg to ST2 Regel within max 3 years.

The external-hire calibration language in [00 Overview](../docs/00%20Overview.md) was also sharpened. Seniority is treated as contextual: strong external seniority, including seniority at a large corporation, does not automatically mean Roomle Senior L1 performance from day one. Most external hires start at Expert unless there is strong evidence that they already operate effectively in Roomle's autonomous, broad, high-context environment.

### Rationale

- **KV mechanics**: The IT KV does not allow a move from an Erfahrungsstufe into the next Tätigkeitsfamilie's Einstiegsstufe. Therefore, an employee moving from ST1 Erfahrung to ST2 enters ST2 Regel. ST2 Einstieg is only relevant for an early ST1 Regel → ST2 move.
- **Roomle reality**: Roomle has repeatedly seen that senior engineers from large, specialized, process-heavy corporations may need significant ramp-up before they perform at Roomle Senior level. Freelancers or agency engineers often adapt faster because they are used to autonomy, broad ownership, and context-switching. The ladder should reflect that observed pattern without treating external seniority as meaningless.
- **Clear commitment**: Entering ST2 is a serious mutual commitment because the KV will continue advancing the employee toward ST2 Erfahrung over time. The company cannot sustainably keep someone in a lower-output role while the KV mandates higher salary bands.

### Changes

- [00 Overview](../docs/00%20Overview.md): corrected the Senior L2 footnote and ST1 → ST2 transition language; expanded the external-hire Senior L1 explanation.
- [idea](idea.md): corrected the IT KV mapping note for ST2 Einstieg vs ST2 Regel.
- [03-senior-l1-vs-l2](../docs/background/boundaries/03-senior-l1-vs-l2.md): clarified that normal L1 → L2 maps to ST2 Regel.
- [04-senior-l2-vs-lead-technical](../docs/background/boundaries/04-senior-l2-vs-lead-technical.md) and [05-senior-l2-vs-lead-management](../docs/background/boundaries/05-senior-l2-vs-lead-management.md): replaced the soft "honest scope conversation" language with the explicit transition-out/termination consequence already decided for KV-mandated mismatch.

---

## 2026-05-20: Tightened Senior L1 wording for KV ST1 defensibility; made L2 the explicit fachliche/personelle Managementaufgaben threshold

### Decision

A close reading of the IT KV (§ 15 II, ST1 vs ST2 descriptions) flagged Senior L1 as sitting near the ST1/ST2 boundary. Three changes were made:

1. **Softened the most exposed Senior L1 bullets** in [Senior L1](../docs/03%20Senior-L1.md):
   - "designs complex systems within their area" → "designs features and components within their area, scoping data flow, error handling, and integration points; team-wide architectural ownership belongs to Senior L2"
   - "Full lifecycle ownership: owns the entire lifecycle of their projects" → "Feature lifecycle ownership: owns the features they lead from design and implementation through deployment and post-release follow-up, within their area; multi-team or cross-cutting initiatives are Senior L2 territory"
   - "Solo capability: can be the sole developer on a topic for extended periods" → "Self-direction: can carry a well-scoped feature or component without daily check-ins; sustained sole ownership of a system is Senior L2 territory"
   - Intro paragraph updated for consistency.
2. **Mirrored the softening in the boundary docs** ([02-expert-vs-senior-l1](../docs/background/boundaries/02-expert-vs-senior-l1.md), [03-senior-l1-vs-l2](../docs/background/boundaries/03-senior-l1-vs-l2.md)) so calibration material does not undo the level-page changes.
3. **Made L2 the explicit threshold for KV-defining responsibilities**:
   - [L2 technical](../docs/04a%20Senior-L2%20%28technical%20track%29.md): explicitly framed as the threshold for **fachliche Managementaufgaben** (team-wide architectural ownership, team standards, cross-cutting initiatives).
   - [L2 management](../docs/04b%20Senior-L2%20%28management%20track%29.md): explicitly framed as the threshold for **personelle Managementaufgaben** (team delivery, performance management, people development).
   - [L1↔L2 boundary doc](../docs/background/boundaries/03-senior-l1-vs-l2.md) now includes a "KV-relevant boundary" subsection.
4. **Added a follow-up for the 36-month assessment obligation** (§ 15 II ST2 ¶ 2) in [follow-ups](follow-ups.md) — this is a legal obligation, not a process preference.

### Rationale

- **ST1 requires "Qualifikation und/oder Verantwortung … selbständig"; ST2 requires "besondere Qualifikation oder besondere Verantwortung" or "fachliche bzw. personelle Managementaufgaben"** (§ 15 II IT-KV). The L1 bullets that read most clearly as ST2 in plain German were the ones describing "sole developer for extended periods", "owns the entire lifecycle of their projects", and "designs complex systems". Reframing them at feature/component scope keeps L1 inside ST1 ("Qualifikation und Verantwortung, selbständig") without losing the level's character.
- **Making L2 the explicit Managementaufgaben threshold** uses the KV's own vocabulary to document why the salary jump (ST1 Erfahrung → ST2 Regel) coincides with the role jump. It also gives a manager defending an L1 (ST1) classification a concrete reference point — "no fachliche Managementaufgaben yet" — rather than a vibes-based answer.
- **The 36-month assessment is a § 15 II ST2 ¶ 2 obligation**, not optional. Tracking it as a follow-up surfaces the compliance work that the ladder created but did not address.

### Acknowledged trade-off

The L1 description is now narrower than it was. Some behaviors that previously read as L1 (sustained sole ownership of a system, full project lifecycle, designing complex systems) now read as L2. This is intentional — it sharpens the L1 → L2 transition and keeps L1 defensibly inside ST1 — but it slightly increases the L1 → L2 step and may move a few currently-described-as-L1 engineers closer to the L2 boundary on paper. Calibration conversations at the next assessment cycle will need to reflect this.

This change does not replace seeking a written opinion from an Austrian labor lawyer with ST1/ST2 dispute experience before rollout — it reduces the surface area such a review would need to address.

### Changes

- [Senior L1](../docs/03%20Senior-L1.md): intro and four Technical Mastery / Responsibility & Ownership bullets softened.
- [Expert → Senior L1](../docs/background/boundaries/02-expert-vs-senior-l1.md): Scope-of-work and Design rows updated to match.
- [Senior L1 → Senior L2](../docs/background/boundaries/03-senior-l1-vs-l2.md): new "KV-relevant boundary" subsection added.
- [Senior L2 (technical)](../docs/04a%20Senior-L2%20%28technical%20track%29.md): intro extended with fachliche-Managementaufgaben framing.
- [Senior L2 (management)](../docs/04b%20Senior-L2%20%28management%20track%29.md): intro extended with personelle-Managementaufgaben framing.
- [follow-ups](follow-ups.md): new "36-Month KV ST1/ST2 Assessment" item added.

---

## 2026-05-20: Added cross-cutting role profile category (AI Tooling first)

### Decision

Role profiles now have two categories: **domain profiles** (Web Frontend, Backend, …) and **cross-cutting profiles** that apply to all engineers regardless of domain. The first cross-cutting profile is [AI Tooling](../docs/role-profiles/ai-tooling.md), with all five levels drafted.

Cross-cutting profiles use the same axes-based, cumulative structure as domain profiles. Engineers read them *in addition to* their domain profile.

### Rationale

- **AI tooling is universal**: every engineer uses Claude Code, Cursor, Copilot, etc. Embedding it in any single domain profile would force duplication across domains and churn whenever AI tools evolve.
- **AI tooling churns faster than domain stacks**: keeping it separate lets it evolve independently of the more stable domain content.
- **AI tooling is a distinct craft**: senior engineers visibly differ from juniors in how they handle AI output (verification, context engineering, knowing when *not* to use it). The skill has its own level progression and deserves its own profile.

Future cross-cutting profiles might cover code review craft, debugging methodology, or operational/oncall practices — though none of those have the same urgency as AI tooling today.

### Changes

- New: [docs/role-profiles/ai-tooling.md](../docs/role-profiles/ai-tooling.md) — all five levels drafted.
- [Web Frontend role profile](../docs/role-profiles/web-frontend.md): brief cross-reference added to the intro.
- [follow-ups](follow-ups.md): Role Profiles section split into Domain and Cross-cutting subsections; AI Tooling listed with owner TBD.

### Open: owner for the AI Tooling profile

Domain profiles have natural owners (the domain lead). Cross-cutting profiles need a different kind of owner — someone engaged with the team's AI workflow practices. Tracked in [follow-ups](follow-ups.md).

---

## 2026-05-20: Role-profile structure — axes-based, cumulative levels

### Decision

Role profiles follow a fixed structure that will apply to **all domains** (Web Frontend, Backend, Infrastructure, 3D/Configurator, …):

1. **Organized by the five ladder axes** (Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence) — not thematic bullets. This makes role profiles parallel to the ladder.
2. **Cumulative levels**: each level describes only what is *newly expected* at that level. Expert assumes Junior; Senior L1 assumes Expert; etc. Readers add levels up to know the full expectation.

The [Web Frontend role profile](../docs/role-profiles/web-frontend.md) has been refreshed under this structure and serves as the template for other domains. Junior, Expert, and Senior L1 are spelled out; Senior L2 and Lead remain open.

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
5. Levels not yet written marked "To be defined" with a [follow-ups](follow-ups.md) reference.

---

## 2026-05-20: Added boundary docs for all level transitions

### Decision

Added comparison/boundary documents for every level transition, following the pattern established by [03-senior-l1-vs-l2](../docs/background/boundaries/03-senior-l1-vs-l2.md). Every ladder level now links to its relevant boundary doc(s) via an italic "Boundaries:" line below the intro.

### Rationale

The L1 → L2 boundary doc proved useful for clarifying intent. Extending the pattern to every transition gives a complete set of "how do we tell these levels apart?" references — useful for calibration discussions, promotion conversations, and onboarding new managers to the ladder. Each doc follows the same shape: intro (with KV context) → comparison table → "Why this distinction matters" prose → cross-links to sibling boundary docs.

### Changes

- New: [Junior → Expert](../docs/background/boundaries/01-junior-vs-expert.md), [Expert → Senior L1](../docs/background/boundaries/02-expert-vs-senior-l1.md), [Senior L2 → Lead (technical)](../docs/background/boundaries/04-senior-l2-vs-lead-technical.md), [Senior L2 → Lead (management)](../docs/background/boundaries/05-senior-l2-vs-lead-management.md).
- [03-senior-l1-vs-l2](../docs/background/boundaries/03-senior-l1-vs-l2.md) updated with a "Related boundary docs" section.
- All seven level pages updated with an italic "Boundary/Boundaries:" line below the intro.

---

## 2026-05-19: Replaced per-level Subject-Specific Skills with Role Profiles

### Decision

Per-domain technical skills will not be embedded in the ladder. Instead they live in **role profiles** — separate documents per domain, kept at `docs/role-profiles/` — that describe what each ladder level looks like for that domain.

The Web Frontend content previously in Senior L1 has been moved to [role-profiles/web-frontend.md](../docs/role-profiles/web-frontend.md). The Subject-Specific section has been removed from all five technical-track levels.

### Rationale

- **Different lifecycles**: the ladder is meant to be stable (years between revisions); subject-specific skills churn fast (frontend frameworks especially). Coupling them forces ladder updates whenever a framework or library changes.
- **Different owners**: the ladder is owned framework-wide; each role profile can be owned by a domain expert/lead and refreshed independently.
- **Different audiences**: the ladder serves promotion and calibration; role profiles serve hiring and onboarding ("what does a Senior L1 Backend hire look like?"). Two artifacts, two jobs.
- **Avoids fake coverage**: with the Subject-Specific section in the ladder, every level for every domain needed *some* content, encouraging placeholder text. Role profiles are written when there's something real to say.

### Changes

- New: [docs/role-profiles/web-frontend.md](../docs/role-profiles/web-frontend.md) — Senior L1 frontend content moved here.
- Subject-Specific Technical Skills section removed from: [Junior](../docs/01%20Junior.md), [Expert](../docs/02%20Expert.md), [Senior L1](../docs/03%20Senior-L1.md), [Senior L2 (technical)](../docs/04a%20Senior-L2%20%28technical%20track%29.md), [Lead (technical)](../docs/05a%20Lead%20%28technical%20track%29.md).
- [follow-ups](follow-ups.md): previous Subject-Specific item marked resolved; new Role Profiles item tracks per-domain coverage going forward.

---

## 2026-05-19: Reframed Senior L1 as "Senior Contributor" (broad professional destination)

### Decision

Senior L1 is now framed as an **established senior engineer** and the **broad professional destination** for most engineers — not a stretch tier or a stepping stone. The operating level label changes from "Team driver" to "Senior contributor".

Behaviors that imply *actively driving the team* (defining team-wide standards, owning cross-cutting initiatives, formally mentoring, redesigning team processes) move up to Senior L2. Senior L1 retains influence-through-craft behaviors: PR reviews that nudge consistency, being a go-to expert, helping colleagues when asked, raising process concerns constructively.

### Rationale

- **Reality fit**: Roomle has no Juniors today and won't hire any in the near term. Most engineers naturally reach ST1 Erfahrung within the KV's max 4 years at ST1 Regel — a comfortable destination there matches who we actually employ.
- **Clean KV mapping**: keeping Senior L1 aligned with ST1 Erfahrung avoids decoupling role from salary (the earlier "Expert role / ST1 Erfahrung salary" option felt unappealing to communicate).
- **Meaningful L1 → L2 transition**: by reserving multiplier behaviors for L2, the L1 → L2 step becomes a genuine, intentional career choice — matching the existing ST1 → ST2 mutual-commitment framing in [idea](idea.md).
- **Avoids ladder inflation**: Senior L1 is reachable as a destination, but Senior L2 requires actively choosing the multiplier role.

### Changes

- [Senior L1](../docs/03%20Senior-L1.md): framing softened throughout; active/intentional language moved to L2 or removed.
- [Overview](../docs/00%20Overview.md): operating level "Team driver" → "Senior contributor"; level-at-a-glance summary updated.
- New: [Senior L1 vs Senior L2](../docs/background/boundaries/03-senior-l1-vs-l2.md) reference documenting how the boundary is drawn.
- [Senior L2 (technical)](../docs/04a%20Senior-L2%20%28technical%20track%29.md) and [Senior L2 (management)](../docs/04b%20Senior-L2%20%28management%20track%29.md): cross-links added to the new boundary doc; no behavioral changes (L2 descriptions already represented all of the moved-up content).

### Acknowledged trade-off

The Expert → Senior L1 gap ([follow-ups](follow-ups.md)) is narrower under this framing but does not fully disappear. The gap becomes a calibration question rather than a structural one.

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

---

## 2026-05-20: Resolved "Regression and Up-or-Out" due to IT KV

### Decision

There will be no formal framework mechanism for "stepping down" or "down-leveling" if an employee regresses or fails to grow into a KV-mandated salary band. The outcome of structural underperformance against the KV-mandated level is a mutual transition out or termination.

### Rationale

- **The legal and economic reality**: The Austrian IT KV forces salary increases over time (e.g. max 4 years in ST1 Regel before moving to ST1 Erfahrung). The company cannot legally cut an employee's salary to correspond to a lower output level.
- **Sustainability**: Paying for Senior L2 levels while receiving Senior L1 output is financially unsustainable for a ~30-person startup.
- **Clarity**: Rather than pretending down-leveling is a viable ongoing state, the framework and the Overview explicitly state that failing to keep pace with the salary guarantees enforced by the calendar leaves termination/separation as the only viable path.
