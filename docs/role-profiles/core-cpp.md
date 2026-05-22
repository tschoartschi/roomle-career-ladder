---
title: Core (C/C++ rules engine) — Role Profile
aliases: [Core Role Profile, C/C++ Role Profile, Roomle Script Role Profile]
type: role-profile
domain: core-cpp
cross_cutting: false
tags: [role-profile, core, cpp, wasm, roomle-script, placeholder, wip]
confluence-publish: true
---

# Core (C/C++ rules engine) — Role Profile

> **Status: PLACEHOLDER — content to be defined.** This page exists so the ladder is structurally complete, but the per-level expectations have not yet been written. See [Work in Progress](../background/wip.md) and [follow-ups](../../internal/follow-ups.md) for the open item tracking this.

This document will describe what each ladder level looks like specifically for engineers working on **Core** — Roomle's C/C++ rules engine, cross-compiled to WASM (browser) and a server build. Core is the runtime for **Roomle Script** and the home of collision detection, placement constraints, and interaction rules. See [Engineering Context → Core](../background/engineering-context.md#core-cc-rules-and-interaction-engine).

This surface is currently a **single-engineer surface** at Roomle. The [Team-of-one surfaces](../background/boundaries/03-senior-l1-vs-l2.md#team-of-one-surfaces) treatment applies: multiplier behaviour expresses *across* surface boundaries (typically into Web), not inside the surface. The canonical Core engineer at Roomle also works in roomle-ui / TypeScript — the ladder explicitly welcomes this cross-surface depth.

Each level will be **cumulative**: Expert assumes everything in Junior; Senior L1 assumes everything in Expert; and so on. Content will be organized by the five [ladder axes](../00%20Overview.md#axes): Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence.

Engineers should also read the cross-cutting [AI Tooling](ai-tooling.md) profile, which applies regardless of domain.

## What this profile will cover

When written, this profile will include per-level expectations around:

- C/C++ — modern C++ idioms, memory management, build systems (CMake / Emscripten)
- The WASM boundary — exporting an API to JavaScript, marshalling data efficiently, build pipelines for both browser and server targets
- **Roomle Script** as a language — interpreter, grammar, type system; the language is *owned* by the Core engineer (see [Engineering Context → Roomle Script](../background/engineering-context.md#roomle-script))
- Interaction & rules engine — collision detection, placement constraints, docking, snapping; correctness *and* performance
- Server build — headless evaluation, validation, offline rendering
- The Core ↔ Web SDK seam — what consumers of the WASM module see; contract stability
- Working with Content Service — Core's language is what they use every day; clear language semantics matter more here than almost anywhere else in the codebase

## Junior — Core (C/C++)

To be defined.

## Expert — Core (C/C++)

To be defined.

## Senior L1 — Core (C/C++)

To be defined.

## Senior L2 — Core (C/C++)

To be defined.

## Lead — Core (C/C++)

To be defined.
