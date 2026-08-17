# 制造业平台架构规范

[English](architecture-standard.md) | 中文

## 分层

平台分为四层：兼容性 DSH Fork、通用平台服务、制造业领域插件和客户 Solution Profile。DSH 内核改动必须用于普通插件无法强制落实的组合、身份传播、信任执行、Artifact 托管或 UI 扩展机制。制造业实体和规则不得进入 DSH agent loop、session event 词汇或通用客户端内核。

一个逻辑插件可以包含 DSH Node、Web、OCI、Edge 或 Remote Artifact。逻辑 Manifest 拥有它们的共享身份和能力；物理 npm 包不是插件身份。可信第一方 Node Artifact 可以在进程内运行。不可信或外部 Artifact 必须在容器、独立进程或远程服务中运行。

## 插件角色和依赖

插件类别包括 contract、provider、connector、domain、agent、workflow 和 UI。类别属于描述性 facet，不代表依赖许可。

一项可替换能力由 Service Definition、Provider 和 Consumer 构成。Provider 和 Consumer 依赖 Definition，且不得互相导入。业务插件通过已注册的 Service、Query、Action、Domain Event 和 Workflow 契约通信。它们不得导入实现包、访问其他插件的存储，或依赖其他 UI 插件的 DOM、CSS 和私有组件。

每项依赖必须声明兼容契约范围。启动预检必须在执行插件代码前解析必需依赖、唯一 Provider 选择、冲突 contribution、信任要求、Schema 版本、migration 和 Artifact 完整性。可选依赖必须声明不可用时的行为。

## 语义模型

核心本体保持小而稳定。领域包在有界上下文内拥有生产、质量、资产、维修、库存和能源概念。客户扩展使用 `customer.<customer-id>.*` 标识，不得改变 `mfg.*` 类型的含义。

实体包含不透明规范标识、revision、租户与站点作用域、外部引用、来源、有效时间和事务时间。外部系统标识不得成为规范身份。Entity Resolution 必须记录 merge、split、redirect、置信度、证据、决策者和撤销历史。

关系是一等记录，包含所有者、端点、基数、方向、有效性、来源和 assertion 类型。AI 派生关系必须携带模型、Agent、置信度和确认状态，不得伪装成事实源数据。数量必须声明单位、精度和代码系统；含义不明确且没有单位的工业测量必须验证失败。

## 数据所有权和一致性

PostgreSQL 是平台自有状态的事务事实源。每次成功变更必须原子提交状态和 outbox 记录。NATS JetStream 从 outbox 发布已提交的 Domain Event。Neo4j 消费这些 Event 形成可重建图投影，不得接受直接业务写入。

Query 必须声明 `transactional` 或 `graph` 一致性。Transactional Query 读取 PostgreSQL，并拥有 Workflow 前置条件、授权输入和写后读检查。Graph Query 读取 Neo4j，返回已应用的投影 revision，并可以等待指定的最小 revision。投影延迟不得让 transactional 请求静默降级。

外部系统继续拥有分配给它们的字段。每个 Connector 必须发布覆盖实体、字段、删除和写回权限的所有权矩阵。冲突解决使用所有权和显式对账；禁止通用 last-write-wins。

## Query、Action、Event 和 Workflow

Query 无副作用，并定义过滤、游标分页、排序、图遍历边界、历史 `asOf`、取消、成本限制、授权和一致性。UI 和 Agent 必须使用 Query，不得直接访问存储。

Action 是平台产生业务副作用的唯一入口。Action admission 必须在调用 Provider 前验证 ActorContext、Schema、Policy、状态 revision、幂等、风险等级、审批、deadline 和审计元数据。结果使用 accepted、running、succeeded、failed、cancelled 和 compensated 状态以及稳定错误码。

Domain Event 使用 CloudEvents 兼容包络和 AsyncAPI 目录。投递语义为至少一次；Consumer 必须幂等。Producer 只能在提交后发布。顺序只在声明的 partition key 内保证。保留、重放、死信处理和 Schema 兼容属于每个 Event 契约。

业务 Workflow 运行在 Temporal 中，调用已注册 Action，并拥有重试、超时、补偿、人工任务、版本共存和重启恢复。DSH workflow engine 继续作为模型编写的 Agent 编排引擎，不得被改造成持久化业务流程存储。

## 中心和边缘

中心运行 PostgreSQL、Neo4j、NATS JetStream、Temporal、OIDC 集成、OPA、Artifact Registry 和工作台 API。边缘节点运行 DSH、Connector、本地 NATS JetStream、SQLite cache/outbox 和已配置的本地模型 Provider。

边缘同步使用 Event 标识、来源序列、Schema 版本、checkpoint、acknowledgement、重试和冲突结果。节点必须在无法连接中心时保留至少七个配置日的数据。恢复连接后必须从已确认 checkpoint 继续，容忍重复和乱序投递，并且不得直接写入 Neo4j。

## Solution Profile

Solution Profile 是可部署组合，不是插件。它锁定插件和 Artifact 版本、哈希、映射、策略、角色绑定、功能开关、部署目标、资源限制、Secret Reference 和 migration。生成的 DSH profile 是 Solution Profile 的 Artifact，不得成为第二个可编辑事实源。
