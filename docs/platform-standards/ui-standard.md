# Manufacturing workbench design standard

English | [中文](ui-standard.zh.md)

## Product posture

The workbench is an operational interface for manufacturing decisions, evidence, and Actions. It prioritizes scan speed, traceability, explicit state, and safe execution over decorative dashboards. Desktop is primary; tablet layouts remain functional for shop-floor review.

The shell owns navigation, identity, tenant/site selection, global search, notifications, Agent conversation, offline state, and plugin settings. Domain UI plugins contribute bounded views and MUST NOT replace shell security, identity, or navigation behavior.

## Information architecture

Every domain object uses the same entity page model: identity and status header, evidence summary, domain tabs, relation graph, event timeline, available Actions, and provenance. A deep link MUST identify tenant, site, entity type, and opaque entity identifier without exposing storage keys.

The quality reference solution provides overview, inspection queue, nonconformance queue, maintenance handoff, workflow tasks, and entity detail. A UI route is owned by one plugin; shared navigation labels and entity links come from registered descriptors rather than direct component imports.

## Slot contract

Platform slots include `workbench.navigation`, `workbench.home.widget`, `entity.detail.header`, `entity.detail.tab`, `entity.action`, `entity.timeline.item`, `workflow.task.panel`, `agent.context.panel`, and `settings.plugin.section`.

A slot owner defines cardinality, scope, props, state ownership, error behavior, and child slots. A contribution declares identifier, slot, component entry, applicable entity types, order, permissions, feature flag, and required services. Registration and disposal use DSH slot effects; apply order is never a correctness dependency.

Manifest UI metadata supports discovery and preflight, while executable client code performs typed `ctx.slots.inject()` and `ctx.slots.register()` calls. A generic loader MUST NOT instantiate an arbitrary component path without the compiled DSH client contract.

## Data and Actions

UI plugins read through Query, subscribe to approved projections or Domain Events, and mutate through Action or Workflow APIs. They MUST NOT connect to PostgreSQL, Neo4j, SQLite, NATS, Temporal, ERP, MES, or equipment directly.

Every mutation presents the target, effect, risk, permission, current revision, and approval requirement before submission. High-impact and irreversible Actions require a preview and explicit confirmation. Optimistic conflicts preserve user input, show the changed revision, and require revalidation rather than silent overwrite.

## Required states

Every asynchronous view implements loading, empty, success, partial, stale, offline, forbidden, not found, projection lag, dependency unavailable, retryable failure, and terminal failure where applicable. A blank panel is not an error state.

Offline UI distinguishes cached data from confirmed center state and displays the last synchronization checkpoint. Queued edge Actions show pending, synchronized, rejected, or conflicted state and never appear as completed before authoritative acceptance.

Agent output is visually distinct from source evidence and committed business state. Recommendations display confidence and citations. Pending Action proposals, approvals, execution, and committed results use different components and status language.

## Design system

Plugins consume shell design tokens for color, typography, spacing, elevation, motion, density, focus, and semantic status. They use CSS Modules or an approved isolation mechanism and MUST NOT target shell or sibling class names. Red, amber, green, and blue status meanings remain consistent across domains and never rely on color alone.

The default density supports operational tables and timelines without hiding labels. Charts include textual summaries, units, time zones, and source revision. Measurement values display engineering units from domain metadata; UI code does not infer units from field names.

## Accessibility and language

Interactive UI meets WCAG 2.2 AA for keyboard operation, focus order, contrast, labels, error association, and reduced motion. All visible strings use registered locale namespaces. Chinese and English are required for platform-owned UI; customer terminology enters through Solution Profile dictionaries, not hard-coded component branches.

Dates use an explicit site time zone and retain the source timestamp. Numbers, units, and decimal precision follow domain metadata. Destructive confirmations and policy denial messages use direct, actionable language.

## Client trust

First-party signed web artifacts MAY run in the DSH client module graph. Untrusted third-party UI runs in a sandboxed iframe or separate origin with capability-scoped RPC. Content Security Policy, artifact digest, allowed network destinations, and exposed host APIs are part of deployment preflight.

UI compatibility requires compiled slot types, manifest metadata, locale dictionaries, permission declarations, disposal tests, direct component tests, assembled browser tests, and offline/error snapshots.
