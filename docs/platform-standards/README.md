# Manufacturing Agent platform standards

English | [中文](README.zh.md)

This reference is the entry point for product, architecture, Agent, workbench, engineering, security, and delivery decisions in the manufacturing-platform fork. Root [`AGENTS.md`](../../AGENTS.md) directs Codex and Claude here; the [development skill](../../.agents/skills/manufacturing-platform-development/SKILL.md) defines the required workflow, and [`verify-platform-standards`](../../scripts/verify-platform-standards.ts) enforces the machine-checkable subset.

## Authority

The documents in this directory own manufacturing-platform requirements. Existing DSH architecture and package rules remain authoritative unless a platform standard explicitly narrows them. A conflict fails closed: stop implementation, record the decision in an Agent Note, and update the owning standard before code.

Normative terms are **MUST**, **MUST NOT**, **SHOULD**, and **MAY**. A SHOULD deviation requires an Agent Note and tests proving the chosen behavior.

## Standards map

- [Product requirements](product-requirements.md) defines users, outcomes, MVP boundaries, deployment, and acceptance metrics.
- [Platform architecture](architecture-standard.md) defines kernel changes, plugin boundaries, data ownership, event flow, edge synchronization, and public service responsibilities.
- [Agent engineering](agent-standard.md) defines Agent roles, autonomy, context, Actions, evaluation, safety, and human handoff.
- [Workbench design](ui-standard.md) defines information architecture, slots, interaction states, accessibility, and UI plugin isolation.
- [Engineering](engineering-standard.md) defines package layout, dependencies, schemas, errors, testing, documentation, and review evidence.
- [Security and conformance](security-and-conformance.md) defines trust levels, identity, policy, supply-chain controls, operations, compatibility, and release gates.

## Enforcement model

Every normative rule names one enforcement owner: JSON Schema, static repository gate, contract test, composition test, runtime policy, or human review. Prose without an enforcement owner is guidance and cannot be used to claim compatibility.

The canonical schemas live in [`schemas/platform`](../../schemas/platform/). Valid and invalid fixtures are part of the contract. A plugin or Solution Profile is compatible only when the repository gate accepts it and its provider/consumer suites pass.

## Change process

Public identifiers, schemas, event semantics, Action behavior, trust rules, and compatibility policy change through a proposed Agent Note before implementation. The change updates English and Chinese standards, schemas, fixtures, conformance tests, and migration guidance in one pull request.

Customer differences belong in Solution Profiles, mappings, policies, and customer-namespaced plugins. A customer request does not justify changing a shared contract until two independent solution contexts demonstrate the same need.
