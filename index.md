---
title: Start Here
aliases: [Home, Index]
type: index
tags: [index]
---

# Roomle Career Ladder — Start Here

This vault is the draft career ladder for Roomle GmbH (~30 people, part of the HOMAG Group). It defines five levels (Junior → Lead) with a tech/management track split at L2, mapped to the Austrian IT KV salary grades.

**This is a draft for review.** Please leave comments — see [How to give feedback](#how-to-give-feedback) below.

## Reading order for first-time reviewers

If you have ~30 minutes, read in this order:

1. [Overview](docs/00%20Overview.md) — the levels at a glance, KV mapping, track split, axes
2. [Idea / Framework Design](docs/background/idea.md) — why the framework looks the way it does
3. [Company Profile](docs/background/company-profile.md) — Roomle context (skip if you work here)
4. [Decisions](docs/background/decisions.md) — dated ADR log of design choices, most recent on top

If you have another ~30 minutes, read the level pages:

5. [Junior](docs/01%20Junior.md)
6. [Expert](docs/02%20Expert.md)
7. [Senior L1](docs/03%20Senior-L1.md)
8. [Senior L2 (technical)](<docs/04a Senior-L2 (technical track).md>) · [Senior L2 (management)](<docs/04b Senior-L2 (management track).md>)
9. [Lead (technical)](<docs/05a Lead (technical track).md>) · [Lead (management)](<docs/05b Lead (management track).md>)

If you want to go deep, also read:

- The boundary docs in `docs/background/` (one per level transition): [Junior → Expert](docs/background/junior-vs-expert.md), [Expert → Senior L1](docs/background/expert-vs-senior-l1.md), [Senior L1 → Senior L2](docs/background/senior-l1-vs-l2.md), [Senior L2 → Lead (technical)](docs/background/senior-l2-vs-lead-technical.md), [Senior L2 → Lead (management)](docs/background/senior-l2-vs-lead-management.md)
- The role profiles: [Web Frontend](docs/role-profiles/web-frontend.md) (domain) and [AI Tooling](docs/role-profiles/ai-tooling.md) (cross-cutting)
- [Follow-ups](docs/background/follow-ups.md) — known open items, including the assessment process and the 36-month KV ST1/ST2 assessment

## What we'd most like feedback on

- **Senior L1 framing.** We've positioned L1 as the broad professional destination most engineers reach and stay at. Does this read right, or does it feel like a ceiling?
- **The L1 → L2 boundary.** L2 is where active multiplier work begins and where the KV ST1 → ST2 line sits. Does the boundary feel meaningful in practice?
- **Track split at L2.** Tech vs management as equally senior parallel tracks. Realistic for a 30-person company, or fiction?
- **Coverage gaps.** Anything missing — a role, a stakeholder, a scenario the framework doesn't handle?

The [follow-ups](docs/background/follow-ups.md) list what we already know is unfinished — no need to re-flag those, but additions are welcome.

## How to give feedback

- **Preferred: GitHub PR comments.** Leave inline comments on the open review PR — most precise, most discussable.
- Alternatively, ping the owner on Slack/Teams with the file + section you're commenting on.
- For structural disagreement (a whole premise feels wrong), the [decisions](docs/background/decisions.md) log is the best place to push back — call out the specific dated decision you'd revisit.

## Notes for reviewers

- **Wiki-links (`[[Name]]`)** are Obsidian syntax. On GitHub they won't resolve as clickable links, but the structure is readable. If you want the full link graph, clone the repo and open it in [Obsidian](https://obsidian.md/).
- **The KV (Kollektivvertrag IT)** is the Austrian IT services collective agreement; salary floors are legally binding. The ladder is deliberately mapped to its grades — see the [Overview](docs/00%20Overview.md) and [Idea](docs/background/idea.md) for how.
- **Status of role profiles:** Web Frontend is the only domain profile spelled out (partially — through Senior L1). Backend, Infrastructure, and 3D/Configurator are TBD; see [follow-ups](docs/background/follow-ups.md).
