# Manufacturing platform engineering standard

English | [中文](engineering-standard.zh.md)

## Repository and package rules

The fork preserves upstream `@deepseek-ai/*` packages and adds platform packages under the temporary `@mfg-agent/*` scope. Existing DSH conventions remain mandatory. Platform package groups use one responsibility per package and split Service Definition, Provider, and Consumer only when they evolve or deploy independently.

Imports use published package entry points. A domain, Agent, Workflow, Connector, or UI package MUST NOT import another implementation package, another package's `src` path, or storage-driver types. Shared runtime values and types live in their owning contract package.

Changes to upstream packages are limited to generic composition, identity, trust, artifact, API, and client-extension mechanics. A pull request modifying `agent-loop` or durable session vocabulary MUST explain why a plugin or platform service cannot own the behavior and update the upstream architecture map.

## Schemas and identifiers

JSON Schema Draft 2020-12 is the machine-readable source for Plugin, Solution Profile, Agent, Action input/output, Event data, configuration, and UI metadata at wire or file boundaries. TypeScript types derive from or are tested equivalent to the schema; maintainers do not hand-maintain two divergent definitions.

Public identifiers use owned namespaces and are immutable after release. Entity types use singular PascalCase, relations and Actions use camelCase, Events use past-tense PascalCase, and permissions use `<domain>.<resource>.<verb>`. Opaque identifiers use branded TypeScript types in process and validated strings on the wire.

All persisted, queued, file, worker, process, and network inputs receive runtime validation. Typed same-process calls rely on TypeScript unless they cross a trust boundary. Validation failures identify the field, violated rule, stable error code, and safe correction without exposing secrets.

## Error, cancellation, and lifecycle

Public operations define success, rejection, retryability, timeout, cancellation, partial result, and ownership. Errors have stable machine codes and human messages. Wrapping preserves the causal error and does not convert policy denial, conflict, schema failure, or infrastructure failure into one generic code.

Asynchronous work has one lifecycle owner. Accepted operations expose a durable identity when they can outlive the request. Cancellation is bounded and propagated to Providers; disposal stops registrations, subscriptions, timers, workers, and resources. Plugin registration tests prove removal and reactivation.

State and notifications publish only after commit. Consumers are idempotent at at-least-once boundaries. Retries use explicit limits and backoff; they do not retry schema, permission, or invariant failures.

## Configuration and secrets

Deployment-varying behavior is validated configuration. Protocol constants and security invariants remain fixed. Configuration precedence is platform, environment, Solution Profile, tenant, workspace, and user only where the owning schema permits override.

Secrets use credential references and never appear in bundles, manifests, Solution Profiles, fixtures, snapshots, telemetry, or diagnostics. Network endpoints, file roots, model routes, resource budgets, and timeout values declare scope and safe defaults; missing security-sensitive configuration fails at load.

## Test obligations

Every capability seam includes Provider and Consumer contract suites. Every product-visible plugin boots through a real composed profile. Mock-only context construction cannot prove compatibility.

Required coverage includes valid and invalid schema fixtures, dependency preflight, authorization denial, tenant and site isolation, idempotency, duplicate and out-of-order events, retry and cancellation, migration and rollback, plugin dispose/reload, projection rebuild, edge partition recovery, and secret redaction.

Agent changes add deterministic Tool/Action tests, recorded keyless model replay, domain evaluation, injection and abstention cases, and an assembled reference-solution transcript. UI changes add direct component tests plus assembled browser tests for permissions, offline state, projection lag, errors, and accessibility.

The reference quality loop runs against two customer profiles. A new shared abstraction without two current consumers is rejected or kept private until the second use exists.

## Documentation and decisions

Public behavior updates its owner README, schema, examples, English and Chinese platform standard, and generated reference in the same change. Non-trivial decisions add or update an Agent Note. Comments and JSDoc state obligations, timing, ownership, failure, and safe use rather than implementation narration.

Pull requests identify affected contracts, Agent autonomy or Action risk changes, migrations, customer-profile impact, and verification evidence. Review rejects a rule that relies only on prose when a schema, static gate, contract suite, runtime policy, or composition test can enforce it.

## Definition of done

A platform change is complete when the source and artifact planes build, schemas and fixtures validate, focused unit and contract suites pass, the real composition path passes, documentation and Agent Notes are current, upgrade and rollback behavior is known, and `pnpm run verify-platform-standards`, relevant DSH gates, and `git diff --check` pass.
