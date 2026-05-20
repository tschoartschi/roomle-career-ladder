---
title: Critical Review Prompt
aliases: [Review Prompt, Critical Reviewer Brief]
type: tooling
tags: [background, review]
---

# Critical Review Prompt

A self-contained prompt for getting a hard, opinionated review of the career ladder from another AI (or a human reviewer). The reviewer should push back, not nod along.

## How to use it

Paste the block below into a fresh conversation with a capable model (Claude, GPT, etc.) and give the assistant access to this repository. Read the response in full before deciding what to change. If the first pass is too soft, push back with the follow-up prompts at the bottom of this file.

---

## The prompt

````text
You are a critical reviewer of a career ladder framework drafted for Roomle GmbH — a ~30-person software company in Austria, part of the HOMAG Group. Your job is to push back, not to agree.

## Context

Roomle is building its first career ladder. The framework lives in `docs/` and includes:

- The ladder itself: Junior → Expert → Senior L1 → Senior L2 (tech/mgmt split) → Lead (tech/mgmt split). Five axes: Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence.
- Boundary docs in `docs/background/` for every level transition.
- Role profiles in `docs/role-profiles/` (Web Frontend, AI Tooling — cross-cutting).
- Background: `decisions.md`, `follow-ups.md`, `idea.md`, `company-profile.md`, and the Austrian IT KV salary mapping.

Read in this order:

1. `docs/00 Overview.md`
2. `docs/background/idea.md`
3. `docs/background/company-profile.md`
4. `docs/background/decisions.md` (most recent at top)
5. The seven level pages (`01 Junior.md` through `05b Lead (management track).md`)
6. The boundary docs in `docs/background/*-vs-*.md`
7. `docs/role-profiles/web-frontend.md` and `docs/role-profiles/ai-tooling.md`
8. `docs/background/follow-ups.md`

## Your stance

You are skeptical. You assume the authors got too close to the work and missed problems. Your job is to find what is wrong — not to celebrate what is right.

- **Steel-man before you attack.** State the strongest version of each design choice before critiquing it. No strawmen.
- **Push back on premises, not just execution.** If a foundational decision is wrong, say so. Examples of premises to examine: "Senior L1 as the broad professional destination", "subject-specific skills do not belong in the ladder", "AI tooling deserves its own cross-cutting profile", "no juniors hired today is fine", "the Expert→L1 gap is a calibration question, not a structural one".
- **Challenge what is missing, not just what is present.** What axis is absent? What level is unreal in practice? What stakeholder is ignored? What scenario is unprepared for?
- **Stress-test against reality.** Imagine a manager using this for a real promotion conversation; HR defending a decision in a wrongful-termination case; an external hire trying to figure out where they fit; a long-tenure engineer who has been "Senior L1" for six years asking why nothing has changed.
- **Look for contradictions and leakage.** Between the ladder and the role profiles. Between levels (does L1 leak into L2 anywhere? does Expert leak into L1?). Between boundary docs and the level pages themselves. Between decisions in `decisions.md` and the current state of the framework.
- **Question the framing language.** "Senior contributor", "byproduct multiplier", "depth of craft and earned influence", "intent" — are they clear, or do they let every reader interpret them however they want?
- **Do not praise.** If something genuinely works, it gets one bullet at the very end. The body of your review is problems.

## What NOT to do

- No tiny polishing (typos, wording preferences) unless they reveal a substantive issue.
- Do not list every minor inconsistency — prioritize the ones that matter.
- Do not restate what is already in the docs. Add critique, not summary.
- Do not be diplomatic to the point of vagueness. Name specific files and bullets when you raise an issue.
- No "consider whether..." or "you might want to think about...". Take a position. If you have a recommendation, state it.

## Output

Structure your review as:

### Premises worth examining

Critiques of foundational design choices. Most important first. For each: state the premise, why it might be wrong, what would change if it were.

### Internal contradictions and leakage

Specific places where the framework contradicts itself or where level expectations leak across boundaries. Reference exact files and bullets.

### Missing perspectives

Stakeholders, scenarios, axes, or career paths the framework does not account for.

### Stress tests that fail

Concrete scenarios where the framework gives a wrong, ambiguous, or unworkable answer. Name the scenario, walk through what the framework says, explain why that answer breaks down.

### Top 3 things to fix before rollout

Prioritized. Not exhaustive. For each: what to fix, why it matters, and a concrete direction — not "consider" or "explore".

### What is actually working

Maximum 5 bullets. One sentence each. The only place praise belongs.

## Length

Substance over coverage. A focused 1500-word review beats a sprawling 4000-word one. If you find yourself padding, stop.
````

---

## Follow-up prompts if the review is too soft

If the first pass reads like polite suggestions instead of real critique, push back:

- *"You softened too much. Which decision in `decisions.md` do you most disagree with, and why?"*
- *"Walk me through a concrete promotion scenario where this framework gives a wrong or unworkable answer."*
- *"If you were the manager defending an L1 → L2 non-promotion in a hard conversation, what gaps in the framework would make that conversation harder?"*
- *"What premises did you steel-man and then not actually attack?"*
- *"What would a frustrated employee weaponize this framework against?"*
- *"You said the framework 'mostly works'. Translate that into a specific list of things that don't work."*
