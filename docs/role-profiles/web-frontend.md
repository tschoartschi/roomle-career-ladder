---
title: Web Frontend — Role Profile
aliases: [Web Frontend Role Profile, Frontend Role Profile]
type: role-profile
domain: web-frontend
cross_cutting: false
tags: [role-profile, web-frontend]
connie-publish: true
connie-page-id: '3755245600'
---

# Web Frontend — Role Profile

This document describes what each ladder level looks like specifically for **Web Frontend** engineers at Roomle. The current stack reference is the **roomle-ui** project — Vue 3 + Pinia + TypeScript + Vitest + Playwright + Vite, in a monorepo workspace.

Each level is **cumulative**: Expert assumes everything in Junior; Senior L1 assumes everything in Expert; and so on. The bullets at each level describe what is *newly expected* at that level — not the complete picture. To read the full expectation for a level, read every level up to and including that one.

Content is organized by the five [ladder axes](../00 Overview.md#Axes): Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence.

Role profiles complement the general ladder; they live separately so domain content can evolve at its own pace. Engineers should also read the cross-cutting [AI Tooling](ai-tooling.md) profile, which applies regardless of domain.

> **Status:** Junior, Expert, and Senior L1 spelled out. Senior L2 and Lead are to be added — see [Work in Progress](../background/wip.md).

---

## Junior — Web Frontend

**Stance:** Learning the team's frontend stack and conventions; primary job is to grow.

### Technical Mastery

- HTML, CSS/SCSS fundamentals: semantic markup, box model, flexbox, grid, mobile-first
- JavaScript core: variables, control flow, functions, ES modules, async/await, promises
- TypeScript basics: primitive types, interfaces, simple generics; understands *why* TS is used
- Vue 3 basics: SFC with `<script setup lang="ts">`, props/emits, refs, computed, watchers, lifecycle hooks
- Pinia basics: reads from stores; understands the setup-store style
- Uses npm scripts for standard workflows (`npm run dev`, `lint`, `test:unit`, `format`) — never invokes underlying tools directly
- Writes basic unit tests when shown how (Vitest + `@vue/test-utils`)
- Basic accessibility awareness: semantic HTML, alt text, form labels

### Learning

- Reads Vue, Pinia, and TypeScript docs alongside the codebase
- Studies the team's `.agents/` guidelines (Vue components, state management, testing, code style)
- Takes onboarding seriously; absorbs PR feedback and applies it consistently

### Responsibility & Ownership

- Picks up well-scoped tickets and finishes them with guidance
- Communicates progress honestly; doesn't go silent when stuck
- Asks for help on things outside the well-trodden path

### Collaboration & Communication

- Writes clear PR descriptions and ticket updates
- Asks questions before going too far down a wrong path
- Open to pairing with senior frontend engineers

### Influence

- Observes how design and engineering discussions flow
- Learns who-knows-what across the team

---

## Expert — Web Frontend
*Adds on top of Junior.*

**Stance:** Independent frontend contributor; ships features reliably within the team's stack and conventions.

### Technical Mastery

- Builds and ships Vue 3 + Pinia features independently, following the team's component ordering convention (`imports → async components → dependencies → props → data → computed → methods → hooks → initialization`)
- Solid TypeScript: generics, utility types (`Pick`, `Omit`, `Partial`), discriminated unions, `as const`, the team's `Values<typeof X>` constant pattern (no enums)
- Strict null-check clean — code passes `npm run lint:types:strict-null-checks`
- Pinia setup stores: composes and consumes them; tests them with `@pinia/testing`
- Writes meaningful Vitest + `@vue/test-utils` component tests in `happy-dom`; uses `flush-promises` for async patterns
- Writes Playwright E2E tests with HAR-mocked network using the `pageInteractor` fixture
- SCSS mobile-first using the team's color variables; no inline magic values
- Comfortable in the monorepo (`src`, `packages/web-sdk`, `packages/embedding-lib`, etc.) and the package-boundary rules
- Conventional commits; runs `npm run lint` and `npm run format` before push
- Accessibility: ARIA basics, keyboard navigation, focus management for common interactive patterns

### Learning

- Stays current with the team's stack (new Vue/Pinia/Vitest releases, Vite updates)
- Reads PRs to learn how others solve problems
- Consults `.agents/decisions/` for prior context before re-litigating settled questions

### Responsibility & Ownership

- Owns features end-to-end: spec → implementation → tests → review → deploy
- Tests their own code with meaningful unit and (where appropriate) E2E coverage
- Handles routine Safari/iOS quirks without escalating
- Self-reviews before submitting PRs

### Collaboration & Communication

- Participates actively in code reviews; gives constructive feedback
- Explains technical decisions in PR descriptions with rationale
- Flags async/shared-state pitfalls when they spot them (per `.agents/async-shared-state.md`)

### Influence

- Becomes a known voice in frontend code reviews
- Contributes patterns to common components and shared utilities

---

## Senior L1 — Web Frontend
*Adds on top of Expert.*

**Stance:** Established senior frontend engineer; delivers complex frontend work and lifts the team through craft.

### Technical Mastery

- Designs complex frontend systems: state shape (Pinia stores), component composition, data flow, async coordination, error/loading states
- Advanced TypeScript *where it pays off*: conditional types, mapped types, generic constraints, EventMap-as-source-of-truth (per `.agents/event-patterns.md`); knows when *not* to reach for advanced types
- Deep Vue 3: reactivity internals, lifecycle ordering, render functions when needed, scoped slots, provide/inject; can explain *why* the framework behaves a certain way
- Pinia at architectural level: store composition, cross-store interaction, testing isolation, hot-reload safety
- Testing strategy: knows what to cover with Vitest vs Playwright; uses canary tests (`tests/canary/`) for live-API regression coverage; handles Playwright snapshots correctly across OSes (the Docker workflow)
- Build & tooling fluency: reads and modifies Vite configs (`config/vite.config.*.mts`), understands the monorepo workspace setup, uses `source-map-explorer` for bundle analysis, can debug `vue-tsc` issues
- Performance grounded in metrics: Core Web Vitals (LCP, INP, CLS), bundle budgets, lazy-loading strategies; knows when to optimize *perceived* vs *actual* performance
- Accessibility ownership: ships accessible UIs by default; working knowledge of WCAG 2.x; mindful of EU Accessibility Act requirements
- Cross-browser pragmatism: handles Safari/iOS quirks without over-engineering for legacy
- Debugging depth: memory leaks, async race conditions across `await` boundaries, reactivity gotchas, HAR-mocking edge cases, hydration mismatches
- Full-stack reach when needed: comfortable touching `packages/web-sdk` and integrating frontend changes with backend evolution end-to-end

### Learning

- Engaged with the broader frontend ecosystem (newsletters, conferences, RFC discussions)
- Evaluates new libraries/frameworks against real Roomle needs, not hype — for example, framework-version upgrade decisions or new testing-tool adoption
- Brings learnings back via Innovation Days, internal demos, or experiments

### Responsibility & Ownership

- Owns complex frontend initiatives end-to-end: state-management refactors, design-system pieces, major framework/tooling upgrades (Vue, Vite, Vitest)
- Treats accessibility, performance, and i18n as default concerns, not afterthoughts
- Proactively spots and addresses frontend tech debt within their area
- When delivering on the original timeline would mean a band-aid fix (per `.agents/bugfix-quality.md`), has the courage to explain why a longer timeline is the right call

### Collaboration & Communication

- Bridges designer and engineering language; helps designers see the technical impact of layout and interaction choices
- Comfortable across the full breadth of frontend stakeholders — sales, marketing, product, partner integrations (e.g., HOMAG Intelligence)
- PR reviews are a meaningful force for consistency; their reviews are sought out for tricky areas
- Helps colleagues with hard frontend problems (race conditions, reactivity bugs, test-mocking issues) when asked

### Influence

- Established credibility in frontend; go-to person for at least one area (e.g., Pinia architecture, Playwright infrastructure, the embedding lib, build pipeline)
- Patterns visible in their work become examples others adopt naturally — without setting out to define standards
- Voice carries weight in framework/library evaluation and major-version-upgrade discussions

---

## Senior L2 — Web Frontend
*Adds on top of Senior L1.*

To be defined. See [Work in Progress](../background/wip.md).

---

## Lead — Web Frontend
*Adds on top of Senior L2.*

To be defined. See [Work in Progress](../background/wip.md).
