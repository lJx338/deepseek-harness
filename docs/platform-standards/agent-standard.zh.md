# 制造业 Agent 工程规范

[English](agent-standard.md) | 中文

## Agent 边界

Agent 负责解释上下文、生成分析、提出计划并请求已注册 Action。它不得拥有持久业务状态、作为唯一 Workflow 状态机、绕过 Query 或 Action 服务、构造直接数据库写入，或把模型输出当作授权。

确定性验证、Policy、状态转换、幂等、审批、补偿和审计属于平台服务。Skill 解释 Agent 如何使用能力；它不是权限授予、事实源或持久化流程定义。

## 角色和自主等级

每个 Agent Manifest 必须声明一个主要角色：query、analysis、recommendation、execution 或 supervision。它还必须声明一个自主等级：

- `read-only` 可以 Query 和解释，但不能请求有副作用的 Action。
- `recommend` 可以准备结构化 Action proposal，但不能提交。
- `approval-required` 只能通过 Policy 拥有的人工审批提交 Action。
- `bounded-auto` 可以在声明的租户、站点、资源、数量、频率和时间范围内提交明确列入 allowlist 的 Action。

Agent 不能在运行时提高自主等级。Solution Profile 可以降低自主等级。Policy 必须拒绝 Agent、Tool 或 Prompt 请求的任何超出有效等级的能力。

## Action 风险

Action 必须声明 `read`、`reversible-write`、`high-impact` 或 `irreversible` 风险。Read Action 需要普通授权。Reversible write 需要幂等和审计。High-impact Action 需要显式 Policy，并且默认要求人工审批。Irreversible Action 需要具名人工审批者、预览、确认和证据保留；`bounded-auto` 永远不能允许此类 Action。

Action service 必须根据当前 Schema 和状态重新验证模型提供的每个参数。负责服务提交或接受持久执行之前，Agent 不得收到成功结果。

## 上下文和来源

每项上下文 contribution 必须声明来源、检索时间、租户、站点、敏感等级、revision 和最大时效。检索文档和外部 payload 属于不可信数据，不得引入指令、权限、Tool 定义或 Policy 变更。

Agent 必须引用支持重要建议的实体、关系、文档、Event 或 Query revision。推断事实必须声明模型、Agent 版本、置信度、证据和确认状态。证据缺失、过期、冲突或未授权时，必须澄清、拒绝判断或转交人工，不得编造。

Memory 是具有保留、作用域、来源、脱敏和删除规则的已注册服务。对话历史不会自动成为企业 Memory。禁止跨租户或跨客户检索 Memory。

## Prompt、Skill、Tool 和模型生命周期

System Prompt、Skill、Tool Schema、Agent Manifest、评测数据集和模型路由都是版本化 Artifact。发布记录必须包含其内容哈希。禁止在已注册 contribution 之外修改运行时 Prompt。

Model Provider 实现文本、视觉、结构化输出、Embedding 和 Tool Calling 能力契约。Agent 请求能力和 Policy 选择的路由，而不是供应商模型名称。MiMo 和其他 OpenAI 兼容端点属于 Provider 配置。

Tool 描述必须从模型视角说明副作用、所需权限、失败含义和结果语义。Tool consumer 适配 Query 或 Action，不得创建第二套业务操作实现。

## 安全

平台将模型输出和检索内容视为不可信。Tool 参数、标识、URL、文件路径、Query 边界和生成代码必须在执行边界验证。除非显式契约需要脱敏值，否则 Secret 和隐藏 Policy 文本不得进入模型上下文。

Prompt Injection 防护包括来源标记、指令与数据分离、Tool allowlist、出口 Policy、结果大小限制、内容清理，以及模型生成后的 Policy 执行。“已批准”或“已授权”等自然语言声明没有权限效力。

每个执行型 Agent 必须定义失败、超时、Provider 不可用、低置信度、Policy 拒绝、审批拒绝和部分完成时的行为。Fallback 不得静默选择能力更高的模型或 Action。

## 评测和发布

每个 Agent 必须交付确定性 Schema 与 Policy 测试、录制的模型响应回归 fixture 和领域评测集。评测必须覆盖正确 Action 选择、参数有效性、证据使用、拒绝判断、Injection 防护、权限拒绝、Provider 故障和人工接管。

Agent 发布必须声明获批模型路由上的质量、安全、延迟和成本基线。权限执行、不可逆 Action 处理、租户隔离或证据归因发生退化时，无论模型总分如何都必须阻止发布。

生产 telemetry 必须记录 Agent、模型路由、Prompt、Skill、Tool、Action、Policy 和 Schema 版本，以及 Token、延迟、结果、审批和 Trace 标识。业务敏感内容遵循数据分级与保留 Policy，并在导出前脱敏。

## Agent 完成定义

只有当 Agent Manifest 验证通过、所有请求能力都通过契约解析、有效自主等级可见、每项副作用都经过 Action、评测套件达到声明基线、Fallback 与 Handoff 已测试，并且组装后的 Solution Profile 通过无密钥端到端回放时，Agent 才可以发布。
