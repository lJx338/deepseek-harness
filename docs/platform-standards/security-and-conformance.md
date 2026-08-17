# Manufacturing platform security and conformance

English | [中文](security-and-conformance.zh.md)

## Trust model

Artifact trust is explicit. `first-party-trusted` artifacts are signed by the platform release identity and MAY run in process after preflight. `customer-trusted` artifacts are signed by an approved customer identity and run under declared capabilities. `untrusted` artifacts MUST run outside the DSH process and browser origin. A Solution Profile cannot raise an artifact's trust level.

Preflight verifies manifest schema, artifact digest, signature, provenance, SBOM, license policy, vulnerability policy, platform compatibility, runtime kind, capabilities, migrations, network destinations, file roots, secret references, and resource limits before loading executable code.

Capabilities are deny by default. Filesystem, network, process, device, credential, model, Query, Action, Event, and UI-host access require separate declarations. Cordis service isolation is dependency visibility and MUST NOT be represented as a security sandbox.

## Identity and policy

Customer OIDC supplies human identity. Platform-issued workload identity supplies services, connectors, workflows, edge nodes, and Agents. Every operation carries tenant, optional site, principal, optional delegated Agent, correlation, causation, authentication strength, and authorization snapshot.

OPA/Rego evaluates role, resource, tenant, site, Action risk, autonomy, approval, time, and deployment policy. Enforcement occurs inside Query and Action services and connector write-back, not only in UI, prompts, Tool registration, or middleware. Policy denial produces no business side effect.

Delegation is bounded by the intersection of user permission, Agent manifest, Solution Profile, deployment policy, and Action policy. An Agent cannot delegate more authority than it received.

## Data protection

Every schema field declares or inherits public, internal, confidential, sensitive-personal, or restricted classification. Classification controls model exposure, logs, telemetry, export, retention, encryption, masking, and deletion. Customer and tenant data cannot enter model training without explicit customer policy.

Data is encrypted in transit and at rest. Secret values use the credential service and are never returned through Query. Backups include PostgreSQL, configuration, identity mapping, Temporal state, and edge recovery material; Neo4j is recoverable from authoritative state and events.

Retention, legal hold, export, correction, and deletion operate through registered Actions with audit. Removing a plugin never automatically deletes shared entities, relations, events, workflows, or audit records.

## Operations

Each service exposes liveness, readiness, build identity, dependency health, schema revision, and projection or synchronization checkpoint. OpenTelemetry traces connect API, Agent, Query, Action, Event, Workflow, Connector, and edge synchronization through correlation and causation identifiers.

Metrics cover request rate, latency, error code, policy denial, approval, event lag, dead letters, projection lag, workflow age, connector checkpoint, edge backlog, model token and cost, and resource saturation. Alerts link to a runbook and identify tenant/site only when policy permits.

Center backup and restore prove declared RPO and RTO before production acceptance. Edge upgrade preserves SQLite outbox and checkpoints. Rollout uses preflight, migration dry run, canary, health observation, and automatic or operator-invoked rollback to the last locked profile.

## Compatibility

Manifest API, platform API, plugin release, and each public contract version independently. Semantic versioning applies to contract behavior, not only TypeScript compatibility. Removing fields, tightening accepted input, changing units or state meaning, changing relation cardinality, expanding default access, or changing side effects is breaking.

Deprecation identifies replacement, first deprecated release, final supported release, migration, and telemetry signal. A release supports the declared compatibility window and fails loudly rather than guessing across unsupported versions.

Database, graph, event, workflow, and edge migrations are versioned, repeatable, restart-safe, and tested from the oldest supported release. A failed migration prevents activation and preserves recovery evidence.

## Conformance levels

- `schema-compatible` means manifests, configuration, Actions, Events, and UI metadata pass canonical schemas and fixtures.
- `runtime-compatible` adds dependency, lifecycle, policy, idempotency, migration, and Provider/Consumer suites.
- `solution-compatible` adds signed artifacts, locked Profile, center/edge composition, operations, and the reference scenario.
- `manufacturing-platform-v0.1` adds two-customer reuse, seven-day partition recovery, security review, performance targets, backup restore, and upgrade rollback.

A badge is generated from CI evidence and artifact hashes; it is not a self-declared manifest field.

## Required release evidence

Release evidence contains the locked Solution Profile, artifact digests, signatures, SBOM and provenance, schema compatibility report, migrations, test and evaluation results, policy bundle hash, model route matrix, performance results, vulnerability disposition, backup/restore result, rollback result, and operator runbooks.

Security exceptions have an owner, affected tenants and sites, compensating control, expiry, and linked Agent Note. Expired exceptions fail preflight or release verification.
