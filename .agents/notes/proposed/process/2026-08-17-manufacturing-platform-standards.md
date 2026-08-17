# Agent Note: Manufacturing platform standards

Status: proposed

English | [中文](2026-08-17-manufacturing-platform-standards.zh.md)

## Problem

The manufacturing platform will combine domain capabilities, Agents, workflows, connectors, and workbench UI for different customers. Repository conventions describe DSH package quality but do not define platform data authority, cross-plugin communication, tenant propagation, Agent autonomy, UI contribution isolation, customer composition, or delivery evidence. Codex and Claude can therefore produce locally valid packages that disagree on business state, bypass policy, couple customer implementations, or cannot be assembled and upgraded as one solution.

## Proposal

Add a bilingual platform standards set that owns product scope, architecture, Agent engineering, workbench UI, engineering, security, and conformance. Root agent instructions direct manufacturing changes to a repository skill, which requires reading those standards and locating an enforcement owner before code changes.

Define Draft 2020-12 schemas for Plugin Manifest, Solution Profile, and Agent Manifest. Store accepted and rejected YAML fixtures beside them. A repository validator compiles every schema, verifies fixture polarity, checks the Codex and Claude instruction path, verifies documentation navigation and pull-request markers, and runs inside `doc-sync`.

Keep the fork compatible with upstream DSH packages. Platform business state is authoritative in PostgreSQL, Neo4j remains a rebuildable projection, NATS JetStream carries committed events, Temporal owns durable business workflows, and SQLite owns edge cache and outbox state. Plugins communicate through registered contracts; Query owns reads and Action owns business side effects. Solution Profiles lock customer composition without becoming plugins.

The first conformance scope is intentionally structural. Runtime packages will add Provider/Consumer, policy, composition, migration, edge-recovery, and end-to-end conformance suites as those capabilities are implemented.

## Alternatives considered

**Rely only on `AGENTS.md` prose.** Rejected because one global file cannot carry product and architecture detail within its budget, and prose alone cannot reject invalid manifests or prove that CI enforces the rule.

**Create a new platform repository before changing DSH.** Rejected because composition, identity propagation, trust, artifact loading, and UI extension mechanics must integrate with the actual harness. A compatibility fork keeps that integration testable while preserving upstream synchronization.

**Represent every customer relationship only in an ontology.** Rejected because ontology describes semantics and relations but does not own transactions, authorization, workflow state, plugin dependencies, deployment locks, or UI composition. The platform uses ontology inside bounded domain contracts and uses Solution Profiles for deployable composition.

**Build the complete runtime before fixing schemas.** Rejected because independently generated plugins would establish incompatible identifiers, dependency rules, autonomy declarations, and customer configuration before a conformance target exists.

## Acceptance criteria

- English and Chinese standards define the locked MVP decisions and link from the root agent instructions.
- Codex and Claude resolve the same root instructions, and the manufacturing development skill directs both tools to the owning standards and verification commands.
- Plugin, Solution Profile, and Agent schemas each accept a checked-in valid YAML fixture and reject a checked-in invalid YAML fixture.
- `pnpm run verify-platform-standards` reports actionable violations and has focused unit tests.
- `doc-sync` and the pull-request template include platform conformance evidence.

## Risks

Early schemas can harden assumptions before two customer implementations exist. Fields therefore cover only locked platform invariants; customer-specific behavior remains namespaced, and shared additions require current consumers and an Agent Note.

Static checks can create false confidence if they are treated as runtime isolation. The standards explicitly leave authorization, artifact isolation, contract behavior, workflow recovery, and end-to-end closure to runtime policies and composed tests.

The compatibility fork can drift from upstream if platform concepts enter generic packages. The development skill limits kernel changes to generic mechanics and requires plugin-first justification for upstream-package edits.
