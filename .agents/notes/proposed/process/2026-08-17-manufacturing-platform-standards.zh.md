# Agent Note: 制造业平台规范

Status: proposed

[English](2026-08-17-manufacturing-platform-standards.md) | 中文

## Problem

制造业平台需要针对不同客户组合领域能力、Agent、Workflow、Connector 和工作台 UI。仓库现有约定定义了 DSH Package 的质量要求，但没有规定平台数据权威、跨插件通信、Tenant 上下文传播、Agent 自主等级、UI 贡献隔离、客户方案组合和交付证据。Codex 和 Claude 因而可能产出局部有效、但业务状态不一致、绕过策略、耦合客户实现或者无法作为整体组装和升级的 Package。

## Proposal

增加一组双语平台规范，分别拥有产品范围、架构、Agent 工程、工作台 UI、工程、安全和一致性要求。根目录 Agent 指令把制造业平台变更引导到仓库 Skill；该 Skill 要求编码前阅读规范，并为每条规范要求找到落实机制。

为 Plugin Manifest、Solution Profile 和 Agent Manifest 定义 Draft 2020-12 Schema，并在旁边保存合法与非法 YAML fixture。仓库校验器编译全部 Schema、验证 fixture 正反例、检查 Codex 与 Claude 的指令路径、验证文档导航和 PR 模板标记，并由 `doc-sync` 执行。

Fork 保持与上游 DSH Package 兼容。PostgreSQL 是平台业务状态的权威来源，Neo4j 是可重建投影，NATS JetStream 传输已提交 Event，Temporal 拥有持久化业务 Workflow，SQLite 拥有边缘缓存和 outbox 状态。插件通过已注册 Contract 通信；Query 拥有读取路径，Action 拥有业务副作用。Solution Profile 锁定客户组合，但它本身不是插件。

首个一致性范围有意只覆盖结构规则。随着能力实现，Runtime Package 将增加 Provider/Consumer、Policy、Composition、Migration、Edge Recovery 和端到端一致性测试。

## Alternatives considered

**只依赖 `AGENTS.md` 文本。** 拒绝，因为单个全局文件无法在字数预算内承载产品和架构细节，而且纯文本无法拒绝非法 Manifest，也无法证明 CI 执行了规则。

**修改 DSH 前先建立独立平台仓库。** 拒绝，因为组合、身份传播、信任、Artifact 加载和 UI 扩展机制必须与真实 Harness 集成。兼容 Fork 可以在保留上游同步能力的同时验证这种集成。

**只用本体表示全部客户关系。** 拒绝，因为本体描述语义和关系，但不拥有事务、授权、Workflow 状态、插件依赖、部署锁定或 UI 组合。平台在有界领域 Contract 中使用本体，并用 Solution Profile 表示可部署组合。

**固定 Schema 前先完成全部 Runtime。** 拒绝，因为各自生成的插件会在一致性目标出现前建立不兼容的标识、依赖规则、自主等级声明和客户配置。

## Acceptance criteria

- 中英文规范定义已锁定的 MVP 决策，并从根目录 Agent 指令链接进入。
- Codex 和 Claude 解析相同的根指令，制造业开发 Skill 引导两者读取权威规范并执行校验命令。
- Plugin、Solution Profile 和 Agent Schema 分别接受一个已提交的合法 YAML fixture，并拒绝一个已提交的非法 YAML fixture。
- `pnpm run verify-platform-standards` 提供可操作的违规信息，并有聚焦的单元测试。
- `doc-sync` 和 PR 模板包含平台一致性证据。

## Risks

早期 Schema 可能在两个客户实现出现前固化假设。因此字段只覆盖已锁定的平台不变量；客户特有行为保留在客户命名空间中，共享扩展必须有当前 Consumer 和 Agent Note。

如果把静态检查当成运行时隔离，它会产生虚假信心。规范明确把授权、Artifact 隔离、Contract 行为、Workflow 恢复和端到端闭环留给运行时 Policy 与组合测试。

如果平台概念进入通用 Package，兼容 Fork 可能偏离上游。开发 Skill 把内核变更限制为通用机制，并要求修改上游 Package 前提供插件无法实现的理由。
