# 制造业 Agent 平台产品需求

[English](product-requirements.md) | 中文

## 产品结果

本产品让内部实施团队能够通过版本化能力、领域包、工作流、UI contribution 和系统连接器组合客户专属制造业 Agent 工作台，而不复制共享插件源码。

首个版本通过可追溯质量闭环验证平台：视觉质检产生 QualityResult，异常创建 NonConformance，策略请求审批，维修流程创建并完成 MaintenanceOrder，复检关闭问题，并且每次状态转换都保留身份、来源、版本和因果关系。

## 用户

- 解决方案工程师选择插件、配置映射并生成锁定的 Solution Profile。
- Agent 工程师基于已注册的 Query 和 Action 契约实现推理与 Tool consumer。
- 领域工程师在一个有界上下文内拥有本体类型、规则、Event 和 Workflow。
- 客户操作员审查证据、审批高风险 Action、监控同步并追溯已关闭问题。
- 平台运维人员安装签名 Artifact、运行中心和边缘节点、观察健康状态并回滚版本。

## MVP 要求

中心部署必须支持用于开发和小型安装的 Docker Compose，以及用于生产的 Kubernetes Helm。边缘节点必须作为容器化单节点运行，在断网时保留七天配置范围内的 Domain Event，并在恢复连接后幂等同步。

PostgreSQL 必须拥有平台事务状态。Neo4j 必须是可重建的语义投影。边缘 SQLite 必须拥有本地缓存、checkpoint 和 outbox 状态。NATS JetStream 必须传输 Domain Event，Temporal 必须拥有持久化业务 Workflow。现有 DSH workflow engine 继续作为 Agent 编排脚本引擎，不得拥有制造业务流程状态。

身份必须接入客户 OIDC；参考部署使用 Keycloak。OPA/Rego 必须授权租户、站点、资源、Query 和 Action。模型必须通过 OpenAI 兼容 Provider 契约接入；MiMo 是参考配置，不是必需依赖。

参考解决方案必须交付 OpenAPI、CSV/SFTP、OPC UA 和 MQTT 连接器契约以及确定性工厂模拟器。原始高频遥测必须留在其所属时序系统或事实源中，除非连接器将有界聚合或业务事件提升到领域模型。

## 非目标

首个版本不提供公共插件市场、计费、面向客户的拖拽式组合器、通用 OWL 推理、自动本体生成、公有云 SaaS 多租户或不受限制的第三方进程内插件模型。

## 成功标准

- 两个客户 Profile 可以运行参考质量闭环，不复制或修改共享插件源码；客户代码仅限映射、策略、配置和客户命名空间扩展。
- 模拟七天网络分区时保留所有已接受的边缘工作，从 checkpoint 恢复，并且重复投递不会产生重复业务结果。
- 每个问题都可以从视觉证据遍历到检验、异常、审批、维修、复检和关闭，并能看到来源与 Schema 版本。
- 未授权的跨租户、跨站点和高风险 Action 在产生副作用前失败并生成审计记录。
- 替换 OpenAI 兼容模型 Provider 不需要修改领域、Workflow、Connector 或 UI 包。
- 插件升级失败或不兼容时，最后一个已知可用的 Solution Profile 仍能运行。

## 初始服务目标

参考边缘节点持续处理每秒 20 个 Domain Event，并保留配置的七天 outbox。参考数据集上的中心实体详情 Query 延迟 p95 低于 500ms。Action 接纳延迟 p95 低于一秒，不包含外部系统完成时间。投递语义为至少一次；业务结果必须逻辑幂等。

## 交付顺序

1. 冻结平台 Schema、Agent 规则、信任规则和一致性 fixture。
2. 在 DSH Fork 中增加可信组合、ActorContext、OIDC/OPA 和 Artifact 预检。
3. 增加 PostgreSQL 状态、Neo4j 投影、NATS Event、Temporal Workflow 和边缘同步。
4. 增加制造业领域包、标准连接器、模拟器、Agent 插件和质量工作台。
5. 完成两个客户的复用、恢复、升级、安全和运维验收。
