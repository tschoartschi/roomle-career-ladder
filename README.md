# Roomle Career Ladder

This repository is the draft career ladder for **Roomle GmbH** — a ~30-person product unit inside the HOMAG Group, building the *Rubens* 3D configurator and Homag Intelligence. The ladder defines five engineering levels (Junior → Lead) with a tech / management track split at L2.

**Status:** Draft for internal review. The content under `docs/` is the source of truth; everything else here exists to support reading, reviewing, or publishing it.

## Reading the ladder

If you have ~30 minutes and want the framework, start at [`index.md`](index.md) — it explains the recommended reading order, what we'd most like feedback on, and how to leave it. If you'd rather jump straight in, the entry point is [`docs/00 Overview.md`](docs/00%20Overview.md).

For the full link graph, clone the repo and open it in [Obsidian](https://obsidian.md/) — relative links work both on GitHub and inside the vault.

## Repository layout

| Path | What lives here |
|------|-----------------|
| [`index.md`](index.md) | Vault landing page — start here as a reviewer |
| [`docs/`](docs/) | The published ladder (Overview, axes, level pages, boundary docs, role profiles, background) |
| [`docs/levels/`](docs/levels/) | The seven level pages (`01 Junior` → `05b Lead (management track)`) plus `99 Executive Leadership` |
| [`docs/background/`](docs/background/) | Company profile, engineering context, level-transition boundary docs |
| [`docs/role-profiles/`](docs/role-profiles/) | Per-domain (Web Frontend, …) and cross-cutting (AI Tooling, …) profiles |
| [`docs/assets/`](docs/assets/) | Diagrams and radar charts (PNG + SVG) |
| [`internal/`](internal/) | Author working notes — decisions log, follow-ups, framework-design rationale. **Not published to Confluence.** |
| [`src/`](src/) | The in-house Markdown → Confluence publisher — see [`src/README.md`](src/README.md) |
| [`scripts/`](scripts/) | Maintenance scripts (radar regeneration, etc.) |

## Giving feedback

- **Preferred: GitHub PR comments.** Inline on the open review PR — most precise, most discussable.
- Alternatively, ping the owner ([Georg](mailto:georg.kothmeier@roomle.com)) directly with the file + section.
- For structural disagreement (a whole premise feels wrong), see [`internal/decisions.md`](internal/decisions.md) and call out the specific dated decision you'd revisit.

The [`internal/follow-ups.md`](internal/follow-ups.md) file lists what we already know is unfinished — no need to re-flag those.

## Publishing

`docs/` is pushed to Confluence Cloud automatically on every merge to `main` via [`.github/workflows/publish-confluence.yml`](.github/workflows/publish-confluence.yml). The publisher is an in-house tool — usage, flags, environment variables, and recovery procedures live in [`src/README.md`](src/README.md).

**Git is the source of truth.** Edits made directly in Confluence will be overwritten on the next push. Use Confluence inline comments for feedback, not Confluence edits.
