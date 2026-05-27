---
title: Licensing & Legal Basics
aliases: [Licensing Policy, Legal Basics]
type: reference
tags: [background, legal, licensing]
confluence-publish: true
confluence-page-id: ''
---

# Licensing & Legal Basics

This page captures the practical rules every Roomle engineer needs when picking dependencies, using open-source code, or publishing internal work. It is **not** a cross-cutting role profile — there is no per-level "license fluency" gradient. It is a short reference and an escalation path.

> **Why this matters at Roomle.** Roomle code ships **embedded inside customer webshops** (via the embedding library and iframe) and sits inside the **Homag/Dürr corporate IP context**. License contamination is not a theoretical concern: a wrong dependency choice can taint a customer's webshop or trigger a Homag-side legal review.

## The minimum every engineer needs to know

### License families

- **Permissive** (MIT, Apache-2.0, BSD, ISC) — safe to use in proprietary and customer-shipped code. Apache-2.0 additionally grants patent rights — prefer it when available.
- **Weak copyleft** (LGPL, MPL-2.0, EPL) — usable, but distribution constraints apply. Static linking and bundling into customer-shipped artefacts needs care. Ask before adopting.
- **Strong copyleft** (GPL-2.0, GPL-3.0) — **do not** bundle into customer-shipped code (Rubens, Web SDK, embedding library, Core WASM, iOS app). Server-side use of GPL is usually fine but still triggers obligations.
- **Network/SaaS copyleft** (AGPL-3.0) — **avoid by default**, including server-side. AGPL can extend obligations to anything that interacts with the service over a network. Escalate before adopting *any* AGPL dependency.
- **Source-available / restrictive** (SSPL, BSL, Elastic License, "Commons Clause") — **escalate**. These are not OSI-approved open source and often forbid hosted/SaaS use.
- **No license** — treat as "all rights reserved". Do not use.

### The rules

1. **Check the license before adding any dependency** — direct or transitive. Look at `package.json`, `pom.xml`, `Cargo.toml`, `Podfile`, etc.
2. **If it's AGPL, SSPL, BSL, GPL, or unlicensed — stop and escalate** before merging.
3. **Don't paste large blocks of code from Stack Overflow / GitHub / AI tools that have unclear provenance** into our codebase. AI-tool license risk is a real category — see also the [AI Tooling profile](../role-profiles/ai-tooling.md).
4. **Don't strip license headers or attribution notices** from third-party code.
5. **When publishing internal code externally** (an OSS repo, a blog post with code samples, a talk), get sign-off first — Head of Engineering or Lead.
6. **Customer data and proprietary content** (3D models, Roomle Script catalogs, Homag content) is not "code", but the same care applies: don't redistribute, don't paste into external tools.

## Escalation path

| Situation                                                                       | Talk to                          |
| ------------------------------------------------------------------------------- | -------------------------------- |
| Routine question (is MIT okay?) — answer: yes, just add it.                     | Nobody — it's fine.              |
| Permissive license but unusual terms (custom MIT-like license)                  | Senior L1+ in the affected surface |
| Weak copyleft (LGPL, MPL) that would ship to customers                          | Lead (technical) or Head of Engineering |
| GPL / AGPL / SSPL / BSL / source-available                                      | Head of Engineering (and CEO if Homag-shipped) |
| Publishing internal code externally                                             | Head of Engineering              |
| Anything involving Homag content, customer 3D models, or cross-corporate IP    | Head of Engineering + CEO        |

When in doubt: **escalate before merging, not after**. Reverting a dependency after it has shipped to a customer is much more expensive than asking the question.

## What this page is not

- Not a legal review service — for actual contracts, customer agreements, or anything commercial, Head of Engineering and CEO own that.
- Not a per-level expectation — license fluency is a checkpoint at boundaries (new dependency, external publication), not a daily craft skill.
- Not exhaustive — when a situation doesn't fit any row above, escalate.

## Related

- [AI Tooling](../role-profiles/ai-tooling.md) — covers proprietary-IP and data-handling rules around AI tools.
- [Engineering Context](engineering-context.md) — Rubens / Core / RAPI / HI vocabulary.
