# 制造业平台工程规范

[English](engineering-standard.md) | 中文

## 仓库和包规则

Fork 保留上游 `@deepseek-ai/*` 包，并以临时 `@mfg-agent/*` Scope 增加平台包。现有 DSH Convention 继续强制执行。平台 Package Group 每个包只承担一种职责，并且只在 Service Definition、Provider 和 Consumer 需要独立演进或部署时拆包。

Import 使用已发布包入口。Domain、Agent、Workflow、Connector 或 UI 包不得导入另一个实现包、另一个包的 `src` Path 或 Storage Driver Type。共享运行时值和 Type 必须位于拥有对应契约的包中。

上游包修改仅限通用组合、身份、信任、Artifact、API 和客户端扩展机制。修改 `agent-loop` 或持久 Session Vocabulary 的 PR 必须解释普通插件或平台服务为何不能拥有此行为，并更新上游架构地图。

## Schema 和标识

JSON Schema Draft 2020-12 是 Plugin、Solution Profile、Agent、Action Input/Output、Event Data、Configuration 和 UI Metadata 在 Wire 或 File Boundary 上的机器可读事实源。TypeScript Type 从 Schema 生成或通过等价测试绑定；维护者不得手工维护两套可能漂移的定义。

公共标识使用自有 Namespace，发布后不可更改。Entity Type 使用单数 PascalCase，Relation 和 Action 使用 camelCase，Event 使用过去式 PascalCase，Permission 使用 `<domain>.<resource>.<verb>`。不透明标识在进程内使用 Branded Type，在 Wire 上使用经过验证的 String。

所有 Persisted、Queued、File、Worker、Process 和 Network Input 必须执行运行时验证。类型化同进程调用依赖 TypeScript，除非跨越 Trust Boundary。验证失败必须标识字段、违规规则、稳定错误码和安全修复方法，同时不得泄漏 Secret。

## 错误、取消和生命周期

公共操作必须定义成功、拒绝、可重试性、超时、取消、部分结果和所有权。Error 必须具有稳定机器 Code 和人类可读 Message。包装必须保留 Cause，不得把 Policy Denial、Conflict、Schema Failure 或 Infrastructure Failure 转换成同一个通用 Code。

异步工作必须有一个生命周期 Owner。可以超过请求存活时间的已接纳操作必须暴露持久 Identity。取消必须有界并传递给 Provider；Dispose 必须停止 Registration、Subscription、Timer、Worker 和 Resource。Plugin Registration Test 必须证明移除和重新激活。

状态和 Notification 只能在 Commit 后发布。Consumer 在 At-least-once Boundary 上必须幂等。Retry 使用显式上限和 Backoff；不得重试 Schema、Permission 或 Invariant Failure。

## 配置和 Secret

随部署变化的行为必须成为已验证 Configuration。Protocol Constant 和 Security Invariant 保持固定。Configuration Precedence 依次为 Platform、Environment、Solution Profile、Tenant、Workspace 和 User，但只有拥有者 Schema 允许时才能覆盖。

Secret 使用 Credential Reference，不得出现在 Bundle、Manifest、Solution Profile、Fixture、Snapshot、Telemetry 或 Diagnostic 中。Network Endpoint、File Root、Model Route、Resource Budget 和 Timeout 必须声明 Scope 与安全默认值；缺失安全敏感配置时必须在加载阶段失败。

## 测试义务

每项 Capability Seam 必须包含 Provider 和 Consumer Contract Suite。每个产品可见插件必须通过真实组装 Profile 启动。只用 Mock Context 构造不能证明兼容。

必须覆盖合法和非法 Schema Fixture、Dependency Preflight、Authorization Denial、Tenant 与 Site Isolation、Idempotency、Duplicate 与 Out-of-order Event、Retry 与 Cancellation、Migration 与 Rollback、Plugin Dispose/Reload、Projection Rebuild、Edge Partition Recovery 和 Secret Redaction。

Agent 变更必须增加确定性 Tool/Action Test、录制的无密钥 Model Replay、Domain Evaluation、Injection 与 Abstention Case 以及组装后的参考解决方案 Transcript。UI 变更必须增加直接组件测试，以及覆盖 Permission、Offline State、Projection Lag、Error 和 Accessibility 的组装浏览器测试。

参考质量闭环必须针对两个客户 Profile 运行。没有两个当前 Consumer 的共享抽象必须被拒绝，或保持 Private 直到第二个使用出现。

## 文档和决策

公共行为必须在同一个 Change 中更新 Owner README、Schema、Example、中英文平台规范和 Generated Reference。非平凡决策必须增加或更新 Agent Note。Comment 和 JSDoc 必须说明义务、时序、所有权、失败和安全使用方式，不得叙述实现过程。

PR 必须标识受影响契约、Agent Autonomy 或 Action Risk 变化、Migration、客户 Profile 影响和验证证据。如果规则可以由 Schema、Static Gate、Contract Suite、Runtime Policy 或 Composition Test 执行，却只依赖文字，Review 必须拒绝。

## 完成定义

只有当 Source Plane 和 Artifact Plane 构建成功、Schema 和 Fixture 验证通过、相关 Unit 与 Contract Suite 通过、真实组合路径通过、文档和 Agent Note 为最新状态、Upgrade 与 Rollback 行为明确，并且 `pnpm run verify-platform-standards`、相关 DSH Gate 和 `git diff --check` 通过时，平台变更才算完成。
