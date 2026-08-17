# Manufacturing Agent platform product requirements

English | [中文](product-requirements.zh.md)

## Product outcome

The product enables an internal implementation team to assemble customer-specific manufacturing Agent workbenches from versioned capabilities, domain packs, workflows, UI contributions, and system connectors without copying shared plugin source.

The first release validates the platform with a traceable quality loop: visual inspection produces a QualityResult, an anomaly opens a NonConformance, policy requests approval, maintenance creates and completes a MaintenanceOrder, reinspection closes the case, and every state transition retains identity, provenance, version, and causation.

## Users

- Solution engineers select plugins, configure mappings, and produce locked Solution Profiles.
- Agent engineers implement reasoning and Tool consumers against registered Query and Action contracts.
- Domain engineers own ontology types, rules, events, and workflows inside one bounded context.
- Customer operators review evidence, approve high-risk Actions, monitor synchronization, and trace closed cases.
- Platform operators install signed artifacts, operate center and edge nodes, observe health, and roll releases back.

## MVP requirements

The center deployment MUST run through Docker Compose for development and small installations and Helm on Kubernetes for production. An edge node MUST run as a containerized single-node installation, retain seven days of configured domain events while disconnected, and synchronize idempotently after reconnection.

PostgreSQL MUST own transactional platform state. Neo4j MUST be a rebuildable semantic projection. Edge SQLite MUST own local cache, checkpoints, and outbox state. NATS JetStream MUST transport Domain Events, and Temporal MUST own durable business workflows. The existing DSH workflow engine remains an Agent-orchestration script engine and MUST NOT own manufacturing process state.

Identity MUST integrate with customer OIDC; the reference deployment uses Keycloak. OPA/Rego MUST authorize tenant, site, resource, Query, and Action access. Models MUST enter through OpenAI-compatible Provider contracts; MiMo is a reference configuration, not a required dependency.

The reference solution MUST ship OpenAPI, CSV/SFTP, OPC UA, and MQTT connector contracts plus a deterministic factory simulator. Raw high-frequency telemetry MUST remain in its owning time-series or source system unless a connector promotes a bounded aggregate or occurrence into the domain model.

## Non-goals

The first release does not provide a public marketplace, billing, a customer-facing drag-and-drop composer, universal OWL reasoning, automatic ontology generation, public-cloud SaaS tenancy, or an unrestricted third-party in-process plugin model.

## Success criteria

- Two customer profiles execute the reference quality loop without copying or modifying shared plugin source; customer code is limited to mappings, policy, configuration, and customer-namespaced extensions.
- A seven-day simulated partition preserves accepted edge work, resumes from checkpoints, and creates no duplicate business outcome under repeated delivery.
- Every case is traversable from visual evidence through inspection, anomaly, approval, maintenance, reinspection, and closure, with source and schema versions visible.
- Unauthorized cross-tenant, cross-site, and high-risk Action attempts fail before side effects and produce audit records.
- Replacing the configured OpenAI-compatible model Provider does not change domain, workflow, connector, or UI packages.
- A failed or incompatible plugin upgrade leaves the last known-good Solution Profile runnable.

## Initial service targets

A reference edge node sustains 20 domain events per second and retains the configured seven-day outbox. Center entity-detail Query latency is below 500 ms at p95 on the reference dataset. Action admission is below one second at p95, excluding external-system completion. Delivery is at least once; business outcomes are logically idempotent.

## Delivery sequence

1. Freeze platform schemas, Agent rules, trust rules, and conformance fixtures.
2. Add trusted composition, ActorContext, OIDC/OPA, and artifact preflight to the DSH fork.
3. Add PostgreSQL state, Neo4j projection, NATS events, Temporal workflows, and edge synchronization.
4. Add manufacturing domain packs, standard connectors, simulator, Agent plugins, and the quality workbench.
5. Prove two-customer reuse, recovery, upgrade, security, and operational acceptance.
