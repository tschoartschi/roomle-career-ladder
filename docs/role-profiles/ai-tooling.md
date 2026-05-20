---
title: AI Tooling — Role Profile (cross-cutting)
aliases: [AI Tooling Role Profile, AI Tooling]
type: role-profile
domain: ai-tooling
cross_cutting: true
tags: [role-profile, ai-tooling, cross-cutting]
---

# AI Tooling — Role Profile

This is a **cross-cutting role profile**: it applies to all engineers at Roomle regardless of domain (frontend, backend, infrastructure, 3D/configurator). Engineers should read it *in addition to* their domain profile.

AI tooling has its own profile because:

- It is universal — every engineer uses Claude Code, Cursor, Copilot, or similar tools every day.
- It evolves faster than any framework or stack, so coupling it to domain profiles would force constant churn there.
- It is a distinct craft — knowing how to use AI well is not the same as knowing how to use Vue or Python well, and senior engineers visibly differ from juniors in how they handle AI output.

Each level is **cumulative**: Expert assumes Junior; Senior L1 assumes Expert; and so on. Each level describes what is *newly expected* at that level. Content is organized by the five [ladder axes](../00 Overview.md#Axes).

Roomle context: the roomle-ui project already has a body of AI conventions in its `.agents/` folder (including `.agents/ai-disclosure.md`, commit-scope discipline, and the rule of always using npm scripts rather than direct tool invocation). Where this profile says "the team's AI conventions", it refers to that kind of guidance.

> **Status:** Draft — all five levels spelled out. Owner: TBD. See [[follow-ups]].

---

## Junior — AI Tooling

**Stance:** Learning to use AI tools responsibly; treats AI output as a draft, not an answer.

### Technical Mastery

- Uses AI coding assistants (Claude Code, Cursor, Copilot, etc.) for learning and routine tasks: explaining unfamiliar code, generating examples, writing boilerplate
- Recognizes AI output is not authoritative — verifies against docs, types, and tests before relying on it
- Never pastes AI suggestions into production code without reading and understanding them
- Follows the team's AI-disclosure conventions (per `.agents/ai-disclosure.md`)
- Doesn't paste sensitive code, credentials, or non-public data into AI tools that aren't approved for it

### Learning

- Uses AI as a learning tool — asks for explanations of unfamiliar concepts and patterns
- Reads the team's AI conventions (`.agents/` and `CLAUDE.md`) early in onboarding
- Practices basic prompting hygiene: provide context, state what you want, iterate

### Responsibility & Ownership

- Owns the AI output they ship — never submits AI-generated code they cannot defend in review
- Asks for help when AI output looks plausible but they aren't sure if it's correct

### Collaboration & Communication

- Open to PR feedback about AI-related issues (over-verbose output, fabricated APIs, missed project conventions)

### Influence

- Observes how senior engineers use AI effectively
- Learns the team's AI conventions through code reviews and PRs

---

## Expert — AI Tooling
*Adds on top of Junior.*

**Stance:** Productive AI-assisted contributor; uses AI as a tool, owns the output.

### Technical Mastery

- Uses AI productively for refactors, test scaffolding, documentation, and repetitive code generation
- Provides good context to AI tools: relevant files, project conventions, expected output shape
- Reviews AI output critically; runs lints, type checks, and tests on AI-generated code as standard discipline (per `.agents/tooling.md`)
- Knows where AI helps vs hinders: strong on boilerplate, syntax, and conventional patterns; weaker on subtle business logic, security-critical code, novel algorithms, and codebase-specific conventions the AI hasn't been shown
- Notices and corrects common AI failures: fabricated APIs, wrong library versions, plausible-but-wrong reasoning
- Avoids AI for security-critical, performance-critical, or novel-algorithm work without senior review

### Learning

- Keeps up with AI tooling developments (new models, new IDE integrations, prompting patterns) at a working level
- Tries new AI features in low-stakes contexts before relying on them in production

### Responsibility & Ownership

- Treats AI output as a *draft* — owns correctness, testability, and review-readiness
- Uses AI to draft tests, then verifies they actually fail when broken (avoids hollow assertions)
- Reverts to writing code by hand when AI iterations aren't converging

### Collaboration & Communication

- Constructive in PR reviews about AI-assisted work — flags fabricated APIs, unnecessary abstractions, or drift from project conventions
- Shares useful prompts or AI workflows with the team informally

### Influence

- Their AI-assisted PRs are clean and quietly model good practice

---

## Senior L1 — AI Tooling
*Adds on top of Expert.*

**Stance:** Surgical AI user; reviews AI output deeply; their craft sets a visible example.

### Technical Mastery

- Uses AI as a force multiplier — knows what to delegate to AI and what to write by hand
- Engineers effective prompts: provides codebase context (relevant files, conventions, the *why*), constraints, and expected output shape; iterates rather than re-prompting from scratch
- Catches subtle AI failures: plausible-but-wrong reasoning, silent drift from project conventions, security or performance regressions hidden in otherwise-clean code
- Reviews AI-generated PRs (their own and others') with extra attention to edge cases, error handling, and consistency
- Pairs AI with hard debugging — knows how to feed AI just enough context to be useful without misleading it
- Knows clearly when *not* to use AI: subtle logic with weak test signal, code requiring deep codebase context the AI lacks, security-critical changes, novel design work

### Learning

- Engaged with the broader landscape of AI developer tooling — not just the current team tool
- Evaluates new AI tools, integrations, and workflows against real Roomle needs (not hype)
- Brings learnings back to the team: shares effective prompts, exposes failure modes, demonstrates use cases

### Responsibility & Ownership

- Uses AI as a quality discipline — leans on it where it adds value, avoids it where it doesn't
- Spots and addresses AI-related tech debt: AI-generated code that's hard to maintain, over-abstracted, or doesn't fit project conventions
- Through reviews, gently corrects AI-overreliance patterns in others' work without naming and shaming

### Collaboration & Communication

- Mentors junior and expert engineers on AI use through reviews and informal discussion
- Articulates *why* a piece of AI-assisted code is wrong (e.g., "this looks AI-generated; the real issue is X, which AI couldn't have known from the prompt")

### Influence

- Recognized go-to person for "how should I use AI for this?" within the team
- Their AI-assisted work is a quiet example of what good looks like

---

## Senior L2 — AI Tooling
*Adds on top of Senior L1.*

**Stance:** Defines how the team uses AI; owns the team's AI workflow health.

### Technical Mastery

- Defines team-level AI workflow conventions and guardrails (disclosure labels, sensitive-data boundaries, code-review extra-attention areas)
- Evaluates new AI tools and integrations against the team's stack and needs; drives adoption or rejection decisions

### Learning

- Connected to AI tooling discussions across the broader engineering community (newsletters, conferences, RFC threads)
- Trains the team on effective AI use through workshops, tech talks, or written guidance in `.agents/`

### Responsibility & Ownership

- Owns the team's AI workflow health — spots over-reliance patterns, defines guardrails, evolves practices as tools evolve
- Maintains the team's AI guidelines (`.agents/` or equivalent) as they pertain to AI use

### Collaboration & Communication

- Active formal mentor on AI use — pairs with team members, reviews AI workflow choices, not just AI output
- Coordinates with adjacent teams on shared conventions (e.g., disclosure formats, prompt-sharing infrastructure)

### Influence

- Defines how the team uses AI; their practices become team standards
- Voice carries weight in cross-team AI tool decisions

---

## Lead — AI Tooling
*Adds on top of Senior L2.*

**Stance:** Shapes org-wide AI strategy; owns the company's posture on AI tool use.

### Technical Mastery

- Shapes org-wide AI strategy: tool choice, licensing, integrations, evaluation frameworks
- Owns the security and legal posture around AI use: data-leakage risk, code-attribution policy, third-party-model risk

### Learning

- Engaged with industry-level discussions about AI in software engineering
- Brings org-level perspective: what's worth adopting, what's hype, what's structurally risky long-term

### Responsibility & Ownership

- Accountable for org-wide AI ROI — tool spend, productivity outcomes, risk exposure
- Sustains the org's culture around AI use: encouraging adoption, rigorous about review and ownership

### Collaboration & Communication

- Communicates AI strategy to executive leadership and corporate stakeholders (HOMAG/Dürr)
- Externally represents the company's engineering practice with respect to AI tooling

### Influence

- Sets the cultural tone — how the org talks about, adopts, and constrains AI tooling
- Shapes the company's reputation as an AI-aware engineering organization
