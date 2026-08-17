# 制造业平台安全与一致性规范

[English](security-and-conformance.md) | 中文

## 信任模型

Artifact Trust 必须显式声明。`first-party-trusted` Artifact 由平台发布身份签名，通过预检后可以在进程内运行。`customer-trusted` Artifact 由获批客户身份签名，并在声明的 Capability 下运行。`untrusted` Artifact 必须运行在 DSH Process 和 Browser Origin 之外。Solution Profile 不能提高 Artifact Trust Level。

Preflight 必须在加载可执行代码前验证 Manifest Schema、Artifact Digest、Signature、Provenance、SBOM、License Policy、Vulnerability Policy、平台兼容、Runtime Kind、Capability、Migration、Network Destination、File Root、Secret Reference 和 Resource Limit。

Capability 默认拒绝。Filesystem、Network、Process、Device、Credential、Model、Query、Action、Event 和 UI Host Access 必须分别声明。Cordis Service Isolation 属于依赖可见性，不得被描述为 Security Sandbox。

## 身份和 Policy

客户 OIDC 提供人类身份。平台签发的 Workload Identity 提供 Service、Connector、Workflow、Edge Node 和 Agent 身份。每项操作必须携带 Tenant、可选 Site、Principal、可选 Delegated Agent、Correlation、Causation、Authentication Strength 和 Authorization Snapshot。

OPA/Rego 必须评估 Role、Resource、Tenant、Site、Action Risk、Autonomy、Approval、Time 和 Deployment Policy。执行点位于 Query、Action Service 和 Connector Write-back 内部，不能只存在于 UI、Prompt、Tool Registration 或 Middleware。Policy Denial 不得产生业务副作用。

Delegation 受 User Permission、Agent Manifest、Solution Profile、Deployment Policy 和 Action Policy 交集限制。Agent 不能委托超过其获得的权限。

## 数据保护

每个 Schema Field 必须声明或继承 Public、Internal、Confidential、Sensitive-personal 或 Restricted Classification。Classification 控制模型暴露、Log、Telemetry、Export、Retention、Encryption、Masking 和 Deletion。没有显式客户 Policy 时，客户和租户数据不得用于模型训练。

数据传输和静态存储必须加密。Secret Value 使用 Credential Service，永远不能通过 Query 返回。Backup 必须包含 PostgreSQL、Configuration、Identity Mapping、Temporal State 和 Edge Recovery Material；Neo4j 可以从权威状态和 Event 恢复。

Retention、Legal Hold、Export、Correction 和 Deletion 必须通过已注册 Action 执行并审计。移除插件不得自动删除共享 Entity、Relation、Event、Workflow 或 Audit Record。

## 运维

每个 Service 必须暴露 Liveness、Readiness、Build Identity、Dependency Health、Schema Revision 以及 Projection 或 Synchronization Checkpoint。OpenTelemetry Trace 必须通过 Correlation 和 Causation 标识连接 API、Agent、Query、Action、Event、Workflow、Connector 和 Edge Synchronization。

Metric 必须覆盖 Request Rate、Latency、Error Code、Policy Denial、Approval、Event Lag、Dead Letter、Projection Lag、Workflow Age、Connector Checkpoint、Edge Backlog、Model Token 与 Cost 以及 Resource Saturation。Alert 必须链接 Runbook，并且只有在 Policy 允许时才标识 Tenant/Site。

中心 Backup/Restore 必须在生产验收前证明声明的 RPO 和 RTO。Edge Upgrade 必须保留 SQLite Outbox 和 Checkpoint。Rollout 必须使用 Preflight、Migration Dry Run、Canary、Health Observation，以及自动或人工回滚到最后一个锁定 Profile。

## 兼容性

Manifest API、Platform API、Plugin Release 和每个公共 Contract 必须独立版本化。Semantic Versioning 适用于 Contract Behavior，而不只适用于 TypeScript Compatibility。删除 Field、收紧已接受 Input、改变单位或状态含义、改变 Relation Cardinality、扩大默认 Access 或改变 Side Effect 都属于 Breaking Change。

Deprecation 必须标识 Replacement、首次废弃 Release、最后支持 Release、Migration 和 Telemetry Signal。Release 必须支持声明的 Compatibility Window，并且在不支持版本间失败，而不是猜测行为。

Database、Graph、Event、Workflow 和 Edge Migration 必须版本化、可重复、重启安全，并从最旧支持版本开始测试。Migration 失败必须阻止激活并保留恢复证据。

## 一致性等级

- `schema-compatible` 表示 Manifest、Configuration、Action、Event 和 UI Metadata 通过权威 Schema 和 Fixture。
- `runtime-compatible` 还要求通过 Dependency、Lifecycle、Policy、Idempotency、Migration 和 Provider/Consumer Suite。
- `solution-compatible` 还要求签名 Artifact、锁定 Profile、Center/Edge Composition、运维和参考场景通过。
- `manufacturing-platform-v0.1` 还要求两个客户复用、七天分区恢复、安全评审、性能目标、Backup Restore 和 Upgrade Rollback 通过。

Badge 从 CI 证据和 Artifact Hash 生成；它不是自我声明的 Manifest Field。

## 必需发布证据

Release Evidence 必须包含锁定 Solution Profile、Artifact Digest、Signature、SBOM 和 Provenance、Schema Compatibility Report、Migration、Test 与 Evaluation Result、Policy Bundle Hash、Model Route Matrix、Performance Result、Vulnerability Disposition、Backup/Restore Result、Rollback Result 和 Operator Runbook。

Security Exception 必须具有 Owner、受影响 Tenant 与 Site、Compensating Control、Expiry 和关联 Agent Note。过期 Exception 必须导致 Preflight 或 Release Verification 失败。
