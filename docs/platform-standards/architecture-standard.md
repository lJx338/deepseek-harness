# Manufacturing platform architecture standard

English | [中文](architecture-standard.zh.md)

## Layering

The platform has four layers: the compatible DSH fork, generic platform services, manufacturing domain plugins, and customer Solution Profiles. DSH kernel changes MUST provide composition, identity propagation, trust enforcement, artifact hosting, or UI extension mechanics that cannot be enforced by an ordinary plugin. Manufacturing entities and rules MUST NOT enter the DSH agent loop, session event vocabulary, or generic client kernel.

A logical plugin MAY contain DSH Node, web, OCI, edge, or remote artifacts. The logical manifest owns their shared identity and capabilities; a physical npm package is not the plugin identity. Trusted first-party Node artifacts MAY run in process. Untrusted or external artifacts MUST run in a container, separate process, or remote service.

## Plugin roles and dependencies

Plugin categories are contract, provider, connector, domain, agent, workflow, and UI. Categories are descriptive facets, not dependency permission.

A replaceable capability consists of a Service Definition, Provider, and Consumer. Providers and Consumers depend on the Definition and MUST NOT import one another. Business plugins communicate through registered Services, Queries, Actions, Domain Events, and Workflow contracts. They MUST NOT import implementation packages, access another plugin's storage, or depend on another UI plugin's DOM, CSS, or private component.

Every dependency declares a compatible contract range. Startup preflight MUST resolve required dependencies, exactly-one provider selections, conflicting contributions, trust requirements, schema versions, migrations, and artifact integrity before executing plugin code. Optional dependencies declare their unavailable behavior.

## Semantic model

The core ontology is small and stable. Domain packs own production, quality, asset, maintenance, inventory, and energy concepts inside bounded contexts. Customer extensions use `customer.<customer-id>.*` identifiers and MUST NOT change the meaning of `mfg.*` types.

Entities have opaque canonical identifiers, revisions, tenant and site scope, external references, provenance, valid time, and transaction time. External system identifiers never become canonical identity. Entity resolution records merge, split, redirect, confidence, evidence, decision actor, and reversal history.

Relations are first-class records with owner, endpoints, cardinality, direction, validity, provenance, and assertion kind. AI-derived relations carry model, Agent, confidence, and confirmation state and MUST NOT masquerade as source-system facts. Quantities declare unit, precision, and code system; ambiguous unitless industrial measurements fail validation.

## Data ownership and consistency

PostgreSQL is the transactional source of truth for platform-owned state. Each successful mutation commits state and an outbox record atomically. NATS JetStream publishes committed Domain Events from the outbox. Neo4j consumes those events into a rebuildable graph projection and MUST NOT accept direct business writes.

Queries declare `transactional` or `graph` consistency. Transactional Queries read PostgreSQL and own workflow preconditions, authorization inputs, and read-after-write checks. Graph Queries read Neo4j, return the applied projection revision, and MAY wait for a requested minimum revision. Projection lag cannot silently downgrade a transactional request.

External systems remain the source of truth for fields assigned to them. Each connector publishes an ownership matrix covering entities, fields, deletions, and write-back authority. Conflict resolution uses ownership and explicit reconciliation; generic last-write-wins is forbidden.

## Query, Action, Event, and Workflow

Query is side-effect free and defines filters, cursor pagination, ordering, graph bounds, historical `asOf`, cancellation, cost limits, authorization, and consistency. UI and Agents MUST use Query rather than direct storage access.

Action is the only platform path for business side effects. Action admission validates ActorContext, schema, policy, state revision, idempotency, risk level, approval, deadline, and audit metadata before calling a Provider. Results use accepted, running, succeeded, failed, cancelled, and compensated states with stable error codes.

Domain Events use CloudEvents-compatible envelopes and AsyncAPI catalogs. Delivery is at least once; consumers are idempotent. Producers publish only after commit. Ordering is guaranteed only within a declared partition key. Retention, replay, dead-letter handling, and schema compatibility belong to each event contract.

Business Workflow runs in Temporal, invokes registered Actions, and owns retries, timeouts, compensation, human tasks, version coexistence, and restart recovery. The DSH workflow engine remains a model-authored Agent orchestration engine and MUST NOT be adapted into durable business process storage.

## Center and edge

The center runs PostgreSQL, Neo4j, NATS JetStream, Temporal, OIDC integration, OPA, artifact registry, and workbench APIs. Edge nodes run DSH, connectors, local NATS JetStream, SQLite cache/outbox, and configured local model Providers.

Edge synchronization uses event identifiers, source sequence, schema version, checkpoint, acknowledgement, retry, and conflict outcome. A node retains at least seven configured days without a center connection. Reconnection resumes from acknowledged checkpoints, tolerates duplicate and out-of-order delivery, and never writes Neo4j directly.

## Solution Profile

A Solution Profile is a deployable composition, not a plugin. It locks plugin and artifact versions, hashes, mappings, policies, role bindings, feature flags, deployment targets, resource limits, secret references, and migrations. Generated DSH profiles are artifacts of the Solution Profile and MUST NOT become a second editable source of truth.
