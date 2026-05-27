---
title: Start Here
aliases: [Home, Index]
type: index
tags: [index]
---

# Roomle Career Ladder — Start Here

This vault is the draft career ladder for Roomle GmbH (~30 people, part of the HOMAG Group). It defines five levels (Junior → Lead) with a tech/management track split at L2.

**This is a draft for review.** Please leave comments — see [How to give feedback](#how-to-give-feedback) below.

## Reading order for first-time reviewers

If you have ~30 minutes, read in this order:

1. [Overview](docs/00%20Overview.md) — the levels at a glance, track split, axes
2. [Idea / Framework Design](internal/idea.md) — why the framework looks the way it does
3. [Company Profile](docs/background/company-profile.md) — Roomle context (skip if you work here)
4. [Decisions](internal/decisions.md) — dated ADR log of design choices, most recent on top

If you have another ~30 minutes, read the level pages:

5. [Junior](docs/levels/01%20Junior.md)
6. [Expert](docs/levels/02%20Expert.md)
7. [Senior L1](docs/levels/03%20Senior-L1.md)
8. [Senior L2 (technical)](<docs/levels/04a Senior-L2 (technical track).md>) · [Senior L2 (management)](<docs/levels/04b Senior-L2 (management track).md>)
9. [Lead (technical)](<docs/levels/05a Lead (technical track).md>) · [Lead (management)](<docs/levels/05b Lead (management track).md>)

If you want to go deep, also read:

- The boundary docs in `docs/background/boundaries/` (one per level transition): [Junior → Expert](docs/background/boundaries/01-junior-vs-expert.md), [Expert → Senior L1](docs/background/boundaries/02-expert-vs-senior-l1.md), [Senior L1 → Senior L2](docs/background/boundaries/03-senior-l1-vs-l2.md), [Senior L2 → Lead (technical)](docs/background/boundaries/04-senior-l2-vs-lead-technical.md), [Senior L2 → Lead (management)](docs/background/boundaries/05-senior-l2-vs-lead-management.md)
- The role profiles: [Web Frontend](docs/role-profiles/web-frontend.md) (domain) and [AI Tooling](docs/role-profiles/ai-tooling.md) (cross-cutting)
- [Follow-ups](internal/follow-ups.md) — known open items, including the assessment process and the performance-review template

## What we'd most like feedback on

- **Senior L1 framing.** We've positioned L1 as the broad professional destination most engineers reach and stay at. Does this read right, or does it feel like a ceiling?
- **The L1 → L2 boundary.** L2 is where active multiplier work begins. Does the boundary feel meaningful in practice?
- **Track split at L2.** Tech vs management as equally senior parallel tracks. Realistic for a 30-person company, or fiction?
- **Coverage gaps.** Anything missing — a role, a stakeholder, a scenario the framework doesn't handle?

The [follow-ups](internal/follow-ups.md) list what we already know is unfinished — no need to re-flag those, but additions are welcome.

## How to give feedback

- **Preferred: GitHub PR comments.** Leave inline comments on the open review PR — most precise, most discussable.
- Alternatively, ping the owner on Slack/Teams with the file + section you're commenting on.
- For structural disagreement (a whole premise feels wrong), the [decisions](internal/decisions.md) log is the best place to push back — call out the specific dated decision you'd revisit.

## Publishing to Confluence

This vault publishes to Confluence Cloud automatically on every push to `main` via the [`publish-confluence.yml`](.github/workflows/publish-confluence.yml) GitHub Action. The publisher is an in-house tool under [`src/publish.ts`](src/publish.ts); see the project [README](README.md) for full usage, flags, and recovery procedures.

### One-time setup

Credentials and instance config are passed via environment variables — no secrets ever live in the repo. See [`.env.example`](.env.example) for the full list with explanations.

1. Create an Atlassian API token at `id.atlassian.com/manage-profile/security/api-tokens`.
2. Create a Confluence Space (or pick an existing one) and a parent page where the docs should live. Grab the Space key and the parent page ID (visible in the URL when viewing the parent).
3. In the GitHub repo settings (Settings → Secrets and variables → Actions):
   - **Repository secrets** (sensitive): `ATLASSIAN_USER_NAME`, `ATLASSIAN_API_TOKEN`.
   - **Repository variables** (non-sensitive but deployment-specific): `CONFLUENCE_BASE_URL` (bare domain, no `/wiki`), `CONFLUENCE_PARENT_ID`, `CONFLUENCE_SPACE_KEY`, `CONFLUENCE_ARCHIVE_PARENT_ID`.
4. Mark each page that should publish by adding `confluence-publish: true` to its frontmatter. Pages without this flag are skipped.

**Running locally** (optional): copy `.env.example` to `.env`, fill in your values, then `node --experimental-strip-types src/publish.ts`. `.env` is gitignored.

### How it works

- Push to `main` touching `docs/**`, `index.md`, or the publisher source triggers the workflow.
- The workflow runs the in-house publisher, which converts Markdown → ADF and upserts the Confluence pages.
- Page identity is preserved across runs: the publisher writes `confluence-page-id` into each source file's frontmatter on first publish, so re-runs update in place rather than creating duplicates.
- Orphaned pages (whose source file was removed) are auto-archived under a dedicated Archive page — see the README for recovery steps.

### Caveat

Confluence is the **derived artifact**; git is the source of truth. Edits made directly in Confluence will be overwritten on the next push. Use Confluence inline comments for feedback, not Confluence edits.

## Notes for reviewers

- **Links** use standard Markdown relative paths — they work on GitHub and in Obsidian. If you want the full link graph, clone the repo and open it in [Obsidian](https://obsidian.md/).
- **Status of role profiles:** Web Frontend is the only domain profile spelled out (partially — through Senior L1). Backend, Infrastructure, 3D/Configurator, and Core (C/C++) have placeholder stubs awaiting per-level content; see [follow-ups](internal/follow-ups.md).
