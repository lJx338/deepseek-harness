---
name: manufacturing-platform-development
description: Use when designing, implementing, reviewing, or testing manufacturing-platform plugins, Solution Profiles, Agents, Queries, Actions, Events, Workflows, connectors, workbench contributions, or kernel extensions in this fork.
---

# Manufacturing platform development

Use this workflow for every manufacturing-platform change. It is guidance, not a substitute for the owning schemas, tests, or runtime policy.

## Establish authority

1. Read [`docs/platform-standards/README.md`](../../../docs/platform-standards/README.md) and the standards it links for the affected product, architecture, Agent, UI, engineering, and security concerns.
2. Read the nearest `AGENTS.md`, the owning package README, and existing Service Definition before changing code. Existing DSH rules continue to apply unless a platform standard explicitly narrows them.
3. Identify one enforcement owner for every normative rule: JSON Schema, repository check, contract test, composition test, runtime policy, or human review. Record a non-trivial decision in an Agent Note before implementation.

Stop when authorities conflict. Resolve the conflict in the owning standard and Agent Note before coding.

## Preserve platform boundaries

- Keep manufacturing entities and customer rules out of the DSH Agent loop, durable session vocabulary, and generic client kernel. Change upstream packages only for generic composition, identity propagation, trust enforcement, artifact hosting, or UI extension mechanics that a plugin cannot enforce.
- Depend on contract packages and registered Services. A plugin must not import another implementation package, access another plugin's storage, or depend on another UI plugin's DOM, CSS, or private components.
- Route reads through Query and every business side effect through Action. UI, Agent, Workflow, and Connector code must not write PostgreSQL, Neo4j, SQLite, NATS, Temporal, ERP, MES, or equipment directly.
- Treat PostgreSQL as authoritative for platform transactions, publish committed Domain Events through the outbox and NATS JetStream, and keep Neo4j rebuildable from those events. Durable business Workflow belongs to Temporal; DSH workflow remains Agent orchestration.
- Propagate tenant, site, principal, delegated Agent, correlation, causation, authentication, and authorization context. A prompt, Skill, Tool registration, or UI check never grants permission.
- Express customer differences through Solution Profiles, mappings, policies, dictionaries, and customer-namespaced plugins. Keep MiMo and other models behind OpenAI-compatible capability Providers.

## Implement and verify

1. Update the owning Draft 2020-12 schema before code that consumes a new wire or file field. Add one accepted and one rejected fixture for each changed rule.
2. Implement the smallest complete Service Definition, Provider, and Consumer change. Declare lifecycle ownership, idempotency, cancellation, retryability, audit, migration, and rollback behavior where applicable.
3. Test the enforcement owner, Provider and Consumer contracts, denial paths, tenant/site isolation, disposal, and the real composed Solution Profile. Agent changes also test autonomy, Action risk, evidence, abstention, injection, fallback, and handoff.
4. Update the owner README, both platform-standard languages, Agent Note, schema examples, and migration guidance together.
5. Run `pnpm run verify-platform-standards`, focused behavior tests, relevant DSH gates, and `git diff --check`. Before pushing, use [`dsh-pre-push-checks`](../dsh-pre-push-checks/SKILL.md) to select any additional evidence.
