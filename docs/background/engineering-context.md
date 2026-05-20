---
title: Engineering Context
aliases: [Engineering Context, Surfaces, Team Shape]
type: reference
tags: [background, engineering, context]
---

# Engineering Context

This document captures the engineering reality at Roomle that the career ladder is written against — what we build, how the codebase is organized, who works on what, how engineers communicate with the outside world, and the domain vocabulary every engineer should know. The level pages, boundary docs, and role profiles all reference this context.

This document describes a destination state. Where current reality differs from the description below, the ladder is written against the healthy destination, not the temporary state.

## Product surfaces

Roomle's product is shipped as a single codebase under the **Rubens** brand, with feature flags differentiating the visible products. The codebase decomposes into the following technical surfaces. Engineers grow depth in one or more of these.

### Rubens (Room Designer + Configurator + Admin)

- **Rubens Room Designer** — 3D room planning UI. Includes the configurator in *isolation mode*: starting to configure a piece of furniture in Room Designer enters the configurator experience inside the same UI.
- **Rubens Configurator** — the configurator experience itself, surfaced both as the isolation mode of Room Designer and as a standalone configurator.
- **Rubens Admin** — Ember.js application used by Roomle's *customers* (the B2B brands and manufacturers) to manage their content: 3D meshes, Roomle Script, materials, user rights, feature flags. Communicates with RAPI.

The Vue 3 frontends for Room Designer and Configurator live in the **roomle-ui** monorepo. Rubens Admin is a separate Ember.js project.

### Web SDK

Everything that has to do with three.js and the canvas — the 3D rendering and interaction layer. The Web SDK is consumed by our own Vue UI in roomle-ui (the HTML elements sit on top of the Web SDK). It is also a library customers can build on.

3D rendering, real-time graphics, and AR all live here. One web engineer specializes in this surface; the rest support it.

### Embedding library

A separate library that instantiates Rubens inside an iframe on the customer's webshop. Handles cross-iframe communication via `postMessage` and stringify-based serialization between the customer site and the Rubens iframe.

The embedding library is the channel through which end-consumers actually meet Rubens — they interact with it inside the webshop of a Roomle customer. Customers integrate the embedding library in creative ways, so quirks at this boundary are common.

### Core (C/C++ rules and interaction engine)

Roomle's C/C++ module, cross-compiled to two builds from one source:

- **Browser (WASM)** — runs inside Rubens to power configuration and interaction in the client.
- **Server** — runs server-side for headless evaluation, validation, and offline rendering.

Core does two kinds of work:

1. **Roomle Script interpretation** — Core is the runtime for *Roomle Script*, the language used to define the construction logic of configurable items.
2. **Interaction and rules** — collision detection, placement constraints, and contextual interaction rules (e.g., *can this object be moved in front of a door*, *what happens when two objects collide*).

Core is staffed by one engineer who also works in roomle-ui / TypeScript. The role is broad by an we acknowledge that; the ladder does not require Core engineers to stay solely inside Core.

### RAPI (Roomle API)

Java REST backend. The single backend for all Roomle products: catalog, tenancy, user management, content storage, persistence. Owned by the backend team.

Inside Homag Intelligence, RAPI plays a small role (storing artifacts like floor plans); the bulk of the backend work for HI happens inside Homag's own systems.

### Infrastructure & delivery

Google Cloud Platform, Kubernetes, Docker. Observability and delivery pipelines. Single DevOps engineer with support of backend team

### iOS

A native iOS application from Roomle's early days (2013). Maintained in-house because it has a steady user base and revenue stream. Not a strategic growth area. One iOS engineer.

### DAP — Digital Asset Pipeline

The pipeline for ingesting and preparing 3D assets. Adjacent to RAPI and Core.

## Homag Intelligence (HI)

Homag Intelligence is the joint product surface with Homag, Roomle's parent group. It is **the same Rubens Room Designer codebase**, configured to:

- Be fed by Homag content rather than Roomle content.
- Use **calc.js** (Homag's JavaScript counterpart to Roomle's Core) for the rules and construction logic.
- A **glue layer** translates calc.js output into the data structures Rubens already understands, so the UI can display and interact with Homag objects as if they were Roomle content.
- RAPI plays only a small persistence role; the heavy lifting is on Homag's backend and calc.js.

HI is developed in a highly agile environment with many moving parts on the Homag side that are not under Roomle's control. Engineers working on HI surfaces interact directly with Homag developers — this is the **only** direct dev-to-external-engineer channel at Roomle. Anyone working HI surfaces must be senior enough to hold that conversation effectively.

## Team shape (12 engineers + UX/UI + Product Operations)

- **Web** — 5 engineers, working broadly across roomle-ui (Vue 3 + Pinia + TypeScript) and Rubens Admin (Ember.js). One of them specializes in 3D rendering / three.js / AR; the rest support those surfaces.
- **Web + Core** — 1 engineer, working across Core (C/C++) and roomle-ui. The only surface they do not touch is RAPI and DevOps.
- **UX/UI** — 1.
- **RAPI (Java REST)** — 3 engineers.
- **DevOps** — 1.
- **iOS** — 1.
- **Product Operations** — 1.

**Single-engineer surfaces (Core / iOS / DevOps) are a structural reality at Roomle's size.** The ladder cannot require these engineers to mentor inside their surface (there is no one inside); their multiplier behavior expresses across surfaces or in adjacent surfaces.

**Cross-surface depth is welcomed, not penalized.** The Web + Core engineer is the canonical example; the ladder does not forbid this pattern.

### Reporting structure

- **Head of Engineering** — Georg (the author of this ladder).
- **Lead of Product Operations** — Belix
- Engineers report to either Head of Engineering or Lead of Product Operations; both report to CEO Albert Ortig.
- No C-level engineering titles at Roomle.
- No active Engineering Manager today; people-management responsibilities currently sit with the Head of Engineering. The Senior L2 (management) role and Lead (management) role describe a destination, not the current state.

### Adjacent departments

- **Content Service** — content developers who write Roomle Script and build configurable items as agency-style project work for Roomle customers. Not part of product development. Communication with Content Service is informal — they sit next to engineering, there is no formal channel — but the interface matters because content-vs-code triage is a frequent source of bugs. Also Content Service is a important input stream for new features and requirements.
- **Customer Success / Service Desk** — see *Customer-facing communication* below.

## Customer-facing communication

Roomle's customers are predominantly **B2B furniture brands and manufacturers**. End-consumers only meet Rubens through the customer's webshop, via the embedding library. iOS is the exception (direct end-consumer use).

The communication model is deliberate:

- **All customer contact is triaged via Service Desk**, then routed by Lead of Product Operations.
- **Engineers do not have direct customer channels.** Lead of Product Operations shields engineering from customer pressure.
- **However, engineers are still expected to answer in Service Desk tickets.** Their job is to deliver expert, customer-grade written answers that the customer can use. Shielding is from pressure, not from contact.
- **The single exception is the Homag-dev ↔ Roomle-dev channel** for Homag Intelligence work. This is direct, technical, and intended.

This is unusual relative to most engineering organizations and matters for the ladder: "stakeholder communication" for an individual contributor (Junior through Senior L1, and the technical-track Senior L2 / Lead in their hands-on work) at Roomle means *write a clear answer into a Service Desk ticket that a non-technical customer can use*, not *manage a customer escalation*.

## Domain vocabulary

Every engineer should recognize these terms — they appear in tickets, PRs, and conversations across surfaces.

### Object model

- **Static item** — a fixed 3D object with no configurable parameters.
- **Configurable item** — a parameterized object whose options expand into variants. Defined in Roomle Script.
- **Configuration** — a specific instance of a configurable item with chosen options materialized.

### Roomle Script

The language Roomle designed for defining configurable items: their rules, construction logic, parameter interactions, and constraints. The language, compiler, grammar, and feature set are owned by Roomle's Core engineer. Content developers (in Content Service) write Roomle Script in customer projects to digitize products.

Engineers across all surfaces should be able to **read Roomle Script well enough to triage** — to recognize whether a bug is a content issue, a code issue, or an integration issue. Writing production Roomle Script is not expected outside Core / Content Service.

### Other terms

- **Catalog** — the customer-owned collection of items.
- **Tenant** — the customer's data scope inside RAPI.
- **Scene** — the 3D space containing items in a session.
- **Docking** — the rules-driven snapping/connection behavior between items.
- **calc.js** — Homag's JavaScript counterpart to Roomle's Core, used inside HI.

Engineers should also know what these infrastructure-level concepts *are* (not necessarily their internals): GCP, Kubernetes, Docker, GitHub workflows. At minimum, an engineer should not confuse Kubernetes with a frontend framework.

## What makes Roomle hard

Three things consistently challenge external senior hires in their first six months:

1. **Stack breadth.** A web engineer routinely touches Vue, TypeScript, Ember (Admin), three.js (Web SDK), the embedding library's iframe protocol, build configs, and Java REST contracts. Engineers from highly specialized, process-heavy environments often struggle with this breadth. Engineers with freelancer or agency backgrounds frequently ramp faster because they're already used to ownership across messy boundaries.

2. **Multi-system bug triage.** A reported bug at Roomle can originate in:
   - **Content** — a Roomle Script issue in the customer's catalog.
   - **Code** — a regression in Rubens / Web SDK / RAPI / Core.
   - **Integration** — a creative use of the embedding library by the customer's webshop.
   - **Homag side** — a change on Homag's calc.js, backend, or HI configuration that is not under Roomle's control.

   Distinguishing among these is a learned skill, and it is one of the things that separates Expert from Senior L1. Naming this triage explicitly is the a core Roomle-specific competency in the ladder.

3. **HI moves fast and is not all ours.** Homag Intelligence is developed in a highly agile mode with many moving parts on the Homag side. Engineers working HI surfaces must be comfortable with ambiguity, with direct cross-company technical conversations, and with debugging across organizational boundaries.

## How to use this document

- **Level pages** (`docs/01 Junior.md` through `docs/05b Lead (management track).md`) reference these surfaces and vocabulary in their bullets, so that "their area" and "their domain" mean something concrete.
- **Boundary docs** (`docs/background/boundaries/*.md`) use the surfaces to describe scope progression between levels.
- **Role profiles** (`docs/role-profiles/`) describe what each level looks like for a specific surface. They are the deeper version of this document, per domain.
- **Onboarding** can point new hires at this document early to make the rest of the ladder readable.
