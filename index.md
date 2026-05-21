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
2. [Idea / Framework Design](internal/idea.md) — why the framework looks the way it does
3. [Company Profile](docs/background/company-profile.md) — Roomle context (skip if you work here)
4. [Decisions](internal/decisions.md) — dated ADR log of design choices, most recent on top

If you have another ~30 minutes, read the level pages:

5. [Junior](docs/01%20Junior.md)
6. [Expert](docs/02%20Expert.md)
7. [Senior L1](docs/03%20Senior-L1.md)
8. [Senior L2 (technical)](<docs/04a Senior-L2 (technical track).md>) · [Senior L2 (management)](<docs/04b Senior-L2 (management track).md>)
9. [Lead (technical)](<docs/05a Lead (technical track).md>) · [Lead (management)](<docs/05b Lead (management track).md>)

If you want to go deep, also read:

- The boundary docs in `docs/background/boundaries/` (one per level transition): [Junior → Expert](docs/background/boundaries/01-junior-vs-expert.md), [Expert → Senior L1](docs/background/boundaries/02-expert-vs-senior-l1.md), [Senior L1 → Senior L2](docs/background/boundaries/03-senior-l1-vs-l2.md), [Senior L2 → Lead (technical)](docs/background/boundaries/04-senior-l2-vs-lead-technical.md), [Senior L2 → Lead (management)](docs/background/boundaries/05-senior-l2-vs-lead-management.md)
- The role profiles: [Web Frontend](docs/role-profiles/web-frontend.md) (domain) and [AI Tooling](docs/role-profiles/ai-tooling.md) (cross-cutting)
- [Follow-ups](internal/follow-ups.md) — known open items, including the assessment process and the 36-month KV ST1/ST2 assessment

## What we'd most like feedback on

- **Senior L1 framing.** We've positioned L1 as the broad professional destination most engineers reach and stay at. Does this read right, or does it feel like a ceiling?
- **The L1 → L2 boundary.** L2 is where active multiplier work begins and where the KV ST1 → ST2 line sits. Does the boundary feel meaningful in practice?
- **Track split at L2.** Tech vs management as equally senior parallel tracks. Realistic for a 30-person company, or fiction?
- **Coverage gaps.** Anything missing — a role, a stakeholder, a scenario the framework doesn't handle?

The [follow-ups](internal/follow-ups.md) list what we already know is unfinished — no need to re-flag those, but additions are welcome.

## How to give feedback

- **Preferred: GitHub PR comments.** Leave inline comments on the open review PR — most precise, most discussable.
- Alternatively, ping the owner on Slack/Teams with the file + section you're commenting on.
- For structural disagreement (a whole premise feels wrong), the [decisions](internal/decisions.md) log is the best place to push back — call out the specific dated decision you'd revisit.

## Publishing to Confluence

This vault publishes to Confluence Cloud automatically on every push to `main` via the [`publish-confluence.yml`](.github/workflows/publish-confluence.yml) GitHub Action. Configuration lives in [`.markdown-confluence.json`](.markdown-confluence.json).

### One-time setup

1. Create an Atlassian API token at `id.atlassian.com/manage-profile/security/api-tokens`.
2. Create a Confluence Space (or pick an existing one) and a parent page where the docs should live. Grab the Space key and the parent page ID (visible in the URL when viewing the parent).
3. In the GitHub repo settings, add:
   - **Repository secrets:** `ATLASSIAN_USER_NAME` (the Atlassian account email), `ATLASSIAN_API_TOKEN` (the token from step 1).
   - **Repository variables:** `CONFLUENCE_BASE_URL` (e.g., `https://roomle.atlassian.net/wiki`), `CONFLUENCE_PARENT_ID`, `CONFLUENCE_SPACE_KEY`.
4. Mark each page that should publish by adding `connie-publish: true` to its frontmatter. Pages without this flag are skipped.

### How it works

- Push to `main` touching `docs/**`, `index.md`, or the config triggers the workflow.
- The workflow runs `npx @markdown-confluence/cli` which converts Markdown → ADF and upserts the Confluence pages.
- Page identity is preserved across runs (page IDs are stored back into frontmatter on first publish), so re-runs update in place rather than creating duplicates.
- Manual trigger with `dry-run: true` is available via "Run workflow" in the Actions tab.

### Caveat

Confluence is the **derived artifact**; git is the source of truth. Edits made directly in Confluence will be overwritten on the next push. Use Confluence inline comments for feedback, not Confluence edits.

The CLI's exact flag names and config keys may have shifted since this was written — verify against [the current README](https://github.com/markdown-confluence/markdown-confluence) before the first run.

## Notes for reviewers

- **Links** use standard Markdown relative paths — they work on GitHub and in Obsidian. If you want the full link graph, clone the repo and open it in [Obsidian](https://obsidian.md/).
- **The KV (Kollektivvertrag IT)** is the Austrian IT services collective agreement; salary floors are legally binding. The ladder is deliberately mapped to its grades — see the [Overview](docs/00%20Overview.md) and [Idea](internal/idea.md) for how.
- **Status of role profiles:** Web Frontend is the only domain profile spelled out (partially — through Senior L1). Backend, Infrastructure, and 3D/Configurator are TBD; see [follow-ups](internal/follow-ups.md).
