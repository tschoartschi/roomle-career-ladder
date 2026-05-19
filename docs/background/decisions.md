---
title: Design Decisions
aliases: [Decisions, ADRs]
type: reference
tags: [background, decisions]
---

# Design Decisions & Changelog

This document tracks key decisions made while designing the Roomle career ladder.

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
