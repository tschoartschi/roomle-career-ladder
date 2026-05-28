---
title: Senior L1 vs Senior L2 — How We Draw the Line
aliases: [L1 vs L2, Level Boundaries]
type: reference
tags: [background, level-boundaries]
confluence-publish: true
confluence-page-id: '3770548284'
---

# 03 Senior L1 vs Senior L2 — How We Draw the Line

The transition from Senior L1 to Senior L2 is the most significant career inflection in this ladder. It is a deliberate, mutually-agreed choice — not an automatic progression. See the [Overview](../../00%20Overview.md#starting-level-progression) for the role-choice side. L2 carries a serious mutual commitment: the company commits to growing the person toward Lead-level responsibilities over time, and the engineer commits to taking that growth seriously. That commitment is exactly why L1 → L2 is mutual-agreement, not employer-decision-alone.

The cleanest way to draw the line is on **accountability and scope**:

|                  | Senior L1                                                 | Senior L2                                                                                                       |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Stance**       | "I deliver excellent work in my area"                     | "I am accountable for the team's outcomes or system architecture"                                               |
| **Measured by**  | Their own output and the health of their domain           | The output and health of the team, or the architecture across the team                                          |
| **Mentoring**    | Helps on shared projects; informal                        | Structured 1:1s with assigned people; accountable for their growth                                              |
| **Standards**    | Sets standards inside their area                          | Defines and enforces team-wide standards                                                                        |
| **Initiatives**  | Owns projects end-to-end inside their area                | Leads initiatives that cross domains or involve other people's work                                             |
| **Architecture** | Designs systems inside their area                         | Owns architecture across the team or across multiple domains                                                    |
| **Scope**        | One or two Roomle surfaces (e.g., Web SDK; or Web + Core) | Cross-surface seams — the contracts and shared standards between Rubens, Web SDK, embedding, Core, RAPI, and HI |

## L2 entry criteria

Senior L1 stays broad on purpose. Senior L2 is the deliberate step, so it must be specific. Promotion to L2 requires demonstrated, sustained evidence (months, not weeks) across **all four** of these. The criteria are parallel across both tracks — what counts as "multiplier work" looks different on each side.

| #   | Criterion                                   | Technical track ([L2a](../../levels/04a%20Senior-L2%20(technical%20track).md))                                                                                                                                                                          | Management track ([L2b](../../levels/04b%20Senior-L2%20(management%20track).md))                                                                                                                                                                                                                                   |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Cross-cutting initiative delivered** \*   | Has led at least one technical initiative whose execution spanned engineers other than themselves — scoped, planned, driven through review and rollout, and landed. The work must have meaningfully depended on coordinating other people's output.     | Has led at least one delivery process end-to-end where multiple engineers' work had to converge — a release cut, a feature stream across a quarter, an incident response, a coordinated migration. The L2b must have been the person *accountable*, not just a participant.                                        |
| 2   | **Structured mentoring / 1:1 ownership** \* | Has held regular structured 1:1s or sustained mentoring with at least one other engineer for multiple months, where the L2 is accountable for the other person's growth (not just available for questions).                                             | Has held regular structured 1:1s with at least one engineer they directly manage (Player-Coach scope: typically 1–3 engineers at Roomle's current size) for multiple months — growth and performance focused, not status-focused — and is accountable for that person's growth and performance. The *wellbeing / trust-person* dimension may be partially carried by an [HR-Lead](../../levels/04b%20Senior-L2%20(management%20track).md#relationship-to-hr-leads); the management-track engineer keeps formal ownership of growth and performance regardless.                                                                                                             |
| 3   | **Team-wide standard / rhythm owned**       | Maintains at least one team-wide technical standard — testing strategy, code review guidelines, deployment process, AI use conventions, etc. "Owns" means: edits the document, decides on changes, and the team accepts those changes as authoritative. | Maintains at least one team-wide people-and-process rhythm — 1:1 cadence, planning ritual, retro format, hiring rubric, performance review template, on-call rotation, etc. "Owns" means: defines it, evolves it, and the team treats it as the way the team works.                                                |
| 4   | **Decision recorded and adopted**           | Has driven at least one architectural decision (documented with a durable artifact) that affected work beyond their own area — and the team is following it months later.                                                                               | Has run at least one end-to-end people decision where they were the decision-maker, not the participant — a hire, a performance-improvement conversation through to outcome, a reorg, a team-shape change. The decision and its rationale must be documented (offer letter, performance record, org-chart change). |

\* For single-engineer surfaces, see **Team-of-one surfaces** below.

These four are entry criteria, not promotion guarantees — the company also needs an L2-shaped scope available for the role to exist (see [Overview](../../00%20Overview.md#starting-level-progression) on staying at L1 as a valid choice). But absence of any one of the four is a defensible reason to not promote, and a clear gap to point at in a non-promotion conversation.

**Documenting "not yet" decisions.** When the L1 → L2 conversation lands on "not yet", the reason is written down in the engineer's review record under one of three categories:

- **(a) Criteria not met** — naming which of the four entry criteria above are not yet evidenced, with concrete examples of what is still missing.
- **(b) No L2-shaped scope available** — naming why (no team to multiply into at present, headcount frozen, the team is already over-covered on multiplier work, etc.).
- **(c) Criteria not met, with a documented growth path** — where (a) applies and the gap is concrete and closeable, the engineer and their manager set up a *time-boxed growth plan* per the [growth-plan nuance in the Overview](../../00%20Overview.md#nuance-the-rule-has-a-deliberate-backdoor): named missing criteria, a check-in date (typically 3–6 months), and what evidence would close the gap.

All three reasons are legitimate; all three are written down. The intent is not to gate-keep — it is to make the conversation reviewable later, both for the engineer's own development and for the company's own consistency over time. A blank "we just didn't agree" is not a recorded reason.

**Team-of-one surfaces.** For small or single-person surfaces (Core, iOS, DevOps), the criteria are not waived; evidence is read across adjacent surfaces. A Core engineer mentoring a Web engineer through a WASM-boundary change, or a DevOps engineer driving a release-pipeline change adopted by Web and Backend, can satisfy the marked criteria. Criteria 3 and 4 follow the same principle for team-wide standards and recorded decisions.

## Why this distinction matters

Senior L1s are highly skilled individual contributors accountable for executing within their scope. While they naturally raise the bar around them, they are primarily measured by the success of their own output and local domain health. Senior L2s are explicitly measured by the output, health, and architecture of the broader team.

This means:

- A Senior L1 engineer should have demonstrated capability for multiplier work in small doses before being considered for the L2 promotion. The L1 → L2 leap is real and intentional, but it is not from zero — the four entry criteria above are how "small doses" become evidence.
- The career choice is genuine: continue going deep on craft (stay L1), or **add** multiplier accountability on top of strong individual delivery (move to L2). At Roomle's current size, the L2 step is **additive**, not a swap — an L2 keeps doing strong hands-on work *and* takes on team-wide outcomes or cross-surface architecture. See the [Player-Coach framing in 04b](../../levels/04b%20Senior-L2%20(management%20track).md) and the *50–70% hands-on* line in the [Overview track-split table](../../00%20Overview.md#technical-track-vs-management-track). Neither path is "above" the other; they are different jobs. Salary growth is possible on both paths — see [Overview](../../00%20Overview.md#starting-level-progression).
- For the management track ([L2b](../../levels/04b%20Senior-L2%20(management%20track).md)), the principle is the same but the multiplier work shifts toward people delivery rather than technical leadership.
- Staying at Senior L1 long-term is a valid, respected choice — see [Overview](../../00%20Overview.md#starting-level-progression).

## Related boundary docs

- [Junior → Expert](01-junior-vs-expert.md)
- [Expert → Senior L1](02-expert-vs-senior-l1.md)
- [Senior L2 → Lead (technical)](04-senior-l2-vs-lead-technical.md)
- [Senior L2 → Lead (management)](05-senior-l2-vs-lead-management.md)
