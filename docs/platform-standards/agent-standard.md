# Manufacturing Agent engineering standard

English | [中文](agent-standard.zh.md)

## Agent boundary

An Agent interprets context, produces analysis, proposes a plan, and requests registered Actions. It MUST NOT own durable business state, act as the only workflow state machine, bypass Query or Action services, construct direct database writes, or treat model output as authorization.

Deterministic validation, policy, state transitions, idempotency, approvals, compensation, and audit belong to platform services. A Skill explains how an Agent uses capabilities; it is not a permission grant, source of truth, or durable process definition.

## Roles and autonomy

Every Agent manifest declares one primary role: query, analysis, recommendation, execution, or supervision. It also declares one autonomy level:

- `read-only` can Query and explain but cannot request a side-effecting Action.
- `recommend` can prepare a structured Action proposal but cannot submit it.
- `approval-required` can submit Actions only through a policy-owned human approval.
- `bounded-auto` can submit explicitly allowlisted Actions within declared tenant, site, resource, amount, rate, and time bounds.

An Agent cannot raise its autonomy at runtime. A Solution Profile MAY lower autonomy. Policy MUST reject an Agent, Tool, or prompt that requests a capability outside the effective level.

## Action risk

Actions declare `read`, `reversible-write`, `high-impact`, or `irreversible` risk. Read Actions need ordinary authorization. Reversible writes require idempotency and audit. High-impact Actions require explicit policy and default to human approval. Irreversible Actions require a named human approver, preview, confirmation, and evidence retention; `bounded-auto` never permits them.

The Action service revalidates every model-supplied argument against the current schema and state. The Agent MUST NOT receive a success result until the responsible service has committed or accepted durable execution.

## Context and provenance

Every context contribution declares source, retrieval time, tenant, site, sensitivity, revision, and maximum age. Retrieved documents and external payloads are untrusted data and MUST NOT introduce instructions, permissions, Tool definitions, or policy changes.

The Agent cites the entity, relation, document, event, or Query revision supporting a material recommendation. Inferred facts declare the model, Agent version, confidence, evidence, and confirmation state. Missing, stale, contradictory, or unauthorized evidence triggers clarification, abstention, or human handoff rather than fabrication.

Memory is a registered service with retention, scope, provenance, redaction, and deletion rules. Conversation history is not automatically enterprise memory. Cross-tenant or cross-customer memory retrieval is forbidden.

## Prompt, Skill, Tool, and model lifecycle

System prompts, Skills, Tool schemas, Agent manifests, evaluation datasets, and model routes are versioned artifacts. A release records their content hashes. Runtime prompt mutation outside a registered contribution is forbidden.

Model Providers implement capability contracts for text, vision, structured output, embeddings, and tool calling. Agents request capabilities and policy-selected routes rather than vendor model names. MiMo and other OpenAI-compatible endpoints are Provider configurations.

Tool descriptions state side effects, required permissions, failure meaning, and result semantics from the model's perspective. A Tool consumer adapts Query or Action; it MUST NOT create a second business operation implementation.

## Safety

The platform treats model output and retrieved content as untrusted. Tool arguments, identifiers, URLs, file paths, query bounds, and generated code are validated at the execution boundary. Secrets and hidden policy text never enter model context unless an explicit contract requires a redacted value.

Prompt-injection defenses include source labeling, instruction/data separation, Tool allowlists, egress policy, result-size limits, content sanitization, and policy enforcement after model generation. Natural-language claims such as “approved” or “authorized” have no authority.

Every execution Agent defines failure, timeout, provider-unavailable, low-confidence, policy-denied, approval-rejected, and partial-completion behavior. A fallback cannot silently select a model or Action with greater capability.

## Evaluation and release

Each Agent ships deterministic schema and policy tests, recorded model-response regression fixtures, and a domain evaluation set. Evaluation covers correct Action selection, argument validity, evidence use, abstention, injection resistance, permission denial, provider failure, and human handoff.

An Agent release declares baseline quality, safety, latency, and cost results for its approved model routes. A regression in permission enforcement, irreversible-Action handling, tenant isolation, or evidence attribution blocks release regardless of aggregate model score.

Production telemetry records Agent, model route, prompt, Skill, Tool, Action, policy, and schema versions plus token, latency, outcome, approval, and trace identifiers. Business-sensitive content follows the data classification and retention policy and is redacted before export.

## Agent definition of done

An Agent is ready only when its manifest validates, all requested capabilities resolve through contracts, effective autonomy is visible, every side effect routes through Action, the evaluation suite meets its declared baseline, fallback and handoff are tested, and the assembled Solution Profile passes a keyless end-to-end replay.
