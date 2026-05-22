---
title: Backend (RAPI) — Role Profile
aliases: [Backend Role Profile, RAPI Role Profile]
type: role-profile
domain: backend
cross_cutting: false
tags: [role-profile, backend, rapi, placeholder, wip]
confluence-publish: true
---

# Backend (RAPI) — Role Profile

> **Status: PLACEHOLDER — content to be defined.** This page exists so the ladder is structurally complete, but the per-level expectations have not yet been written. See [Work in Progress](../background/wip.md) and [follow-ups](../../internal/follow-ups.md) for the open item tracking this.

This document will describe what each ladder level looks like specifically for **Backend** engineers at Roomle. The stack reference is **RAPI** — Java REST, the single backend for all Roomle products (catalog, tenancy, content storage, persistence). See [Engineering Context → RAPI](../background/engineering-context.md#rapi-roomle-api).

Each level will be **cumulative**: Expert assumes everything in Junior; Senior L1 assumes everything in Expert; and so on. Content will be organized by the five [ladder axes](../00%20Overview.md#axes): Technical Mastery, Learning, Responsibility & Ownership, Collaboration & Communication, Influence.

Engineers should also read the cross-cutting [AI Tooling](ai-tooling.md) profile, which applies regardless of domain.

## What this profile will cover

When written, this profile will include per-level expectations around:

- Java / Spring / REST API design
- Database modelling and migrations (PostgreSQL or equivalent)
- Multi-tenant data isolation (the *tenant* / *catalog* model — see [Engineering Context → Domain vocabulary](../background/engineering-context.md#domain-vocabulary))
- Authentication, authorization, and content security
- Performance, observability, and operational excellence
- The RAPI ↔ Web SDK ↔ Core seam — how backend changes ripple through the surfaces that consume RAPI
- The RAPI ↔ Homag Intelligence boundary (RAPI plays a small persistence role inside HI — see [Engineering Context → Homag Intelligence](../background/engineering-context.md#homag-intelligence-hi))

## Junior — Backend

To be defined.

## Expert — Backend

To be defined.

## Senior L1 — Backend

To be defined.

## Senior L2 — Backend

To be defined.

## Lead — Backend

To be defined.
