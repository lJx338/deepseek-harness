# 制造业 Agent 平台规范

[English](README.md) | 中文

本参考是制造业平台分支的产品、架构、Agent、工作台、工程、安全和交付决策入口。根目录 [`AGENTS.md`](../../AGENTS.md) 引导 Codex 和 Claude 阅读本目录；[开发 Skill](../../.agents/skills/manufacturing-platform-development/SKILL.md)定义强制工作流，[`verify-platform-standards`](../../scripts/verify-platform-standards.ts)落实可机器检查的规则。

## 权威关系

本目录中的文档拥有制造业平台需求。现有 DSH 架构和包规则继续有效，除非平台规范明确收紧要求。发生冲突时必须失败关闭：停止实现，通过 Agent Note 记录决策，并先更新权威规范再修改代码。

规范用语为**必须**、**不得**、**应该**和**可以**。偏离“应该”要求时必须提供 Agent Note，并用测试证明所选行为。

## 规范地图

- [产品需求](product-requirements.md)定义用户、结果、MVP 边界、部署方式和验收指标。
- [平台架构](architecture-standard.md)定义内核改动、插件边界、数据所有权、事件流、边缘同步和公共服务职责。
- [Agent 工程](agent-standard.md)定义 Agent 角色、自主等级、上下文、Action、评测、安全和人工接管。
- [工作台设计](ui-standard.md)定义信息架构、插槽、交互状态、无障碍和 UI 插件隔离。
- [工程规范](engineering-standard.md)定义包结构、依赖、Schema、错误、测试、文档和评审证据。
- [安全与一致性](security-and-conformance.md)定义信任等级、身份、策略、供应链控制、运维、兼容和发布门禁。

## 落实模型

每条规范要求必须指定一种落实机制：JSON Schema、仓库静态门禁、契约测试、组合测试、运行时策略或人工评审。没有落实机制的文字只属于指导，不能用来声明兼容。

权威 Schema 位于 [`schemas/platform`](../../schemas/platform/)。合法和非法 fixture 都属于契约。插件或 Solution Profile 只有在仓库门禁接受且 Provider/Consumer 测试通过后才兼容。

## 变更流程

公共标识、Schema、Event 语义、Action 行为、信任规则和兼容策略必须在实现前通过 proposed Agent Note 变更。同一个 PR 必须同步更新中英文规范、Schema、fixture、一致性测试和迁移指导。

客户差异必须进入 Solution Profile、映射、策略和客户命名空间插件。只有两个独立解决方案环境证明存在相同需求时，客户请求才可以推动共享契约变更。
