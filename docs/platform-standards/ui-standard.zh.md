# 制造业工作台设计规范

[English](ui-standard.md) | 中文

## 产品定位

工作台是面向制造决策、证据和 Action 的操作界面。它优先保证扫描效率、可追溯性、明确状态和安全执行，而不是装饰性看板。桌面端是主要形态；平板布局必须能支持车间复核。

Shell 拥有导航、身份、租户/站点选择、全局搜索、通知、Agent 对话、离线状态和插件设置。领域 UI 插件贡献有界视图，不得替换 Shell 的安全、身份或导航行为。

## 信息架构

每个领域对象使用相同的实体页面模型：身份与状态 Header、证据摘要、领域 Tab、关系图、Event Timeline、可用 Action 和来源。Deep Link 必须标识租户、站点、实体类型和不透明实体标识，并且不得暴露存储 Key。

质量参考解决方案提供 Overview、Inspection Queue、Nonconformance Queue、Maintenance Handoff、Workflow Task 和 Entity Detail。一个 UI Route 由一个插件拥有；共享导航标签和实体链接来自已注册 Descriptor，不通过直接组件导入获得。

## Slot 契约

平台 Slot 包括 `workbench.navigation`、`workbench.home.widget`、`entity.detail.header`、`entity.detail.tab`、`entity.action`、`entity.timeline.item`、`workflow.task.panel`、`agent.context.panel` 和 `settings.plugin.section`。

Slot owner 定义基数、作用域、Props、状态所有权、错误行为和子 Slot。Contribution 声明标识、Slot、组件入口、适用实体类型、顺序、权限、Feature Flag 和必需 Service。注册和释放使用 DSH Slot Effect；Apply 顺序永远不能成为正确性依赖。

Manifest UI Metadata 用于发现和预检，可执行客户端代码负责类型化 `ctx.slots.inject()` 和 `ctx.slots.register()` 调用。通用 Loader 不得在没有已编译 DSH Client Contract 的情况下实例化任意组件路径。

## 数据和 Action

UI 插件通过 Query 读取，通过获批的 Projection 或 Domain Event 订阅，并通过 Action 或 Workflow API 修改状态。它们不得直接连接 PostgreSQL、Neo4j、SQLite、NATS、Temporal、ERP、MES 或设备。

每项变更必须在提交前展示目标、影响、风险、权限、当前 Revision 和审批要求。High-impact 和 Irreversible Action 需要 Preview 和显式确认。发生 Optimistic Conflict 时必须保留用户输入、展示变化后的 Revision 并要求重新验证，不得静默覆盖。

## 必需状态

每个异步 View 必须在适用时实现 Loading、Empty、Success、Partial、Stale、Offline、Forbidden、Not Found、Projection Lag、Dependency Unavailable、Retryable Failure 和 Terminal Failure。空白 Panel 不是错误状态。

离线 UI 必须区分 Cached Data 和已确认 Center State，并展示最后同步 Checkpoint。排队的 Edge Action 显示 Pending、Synchronized、Rejected 或 Conflicted 状态，在权威接纳前不得显示为 Completed。

Agent 输出必须与来源证据和已提交业务状态在视觉上区分。Recommendation 显示置信度和 Citation。待提交 Action Proposal、Approval、Execution 和 Committed Result 使用不同组件和状态语言。

## 设计系统

插件使用 Shell Design Token 定义颜色、字体、间距、层级、动效、密度、Focus 和语义状态。插件使用 CSS Modules 或获批隔离机制，不得定位 Shell 或相邻插件的 Class Name。红、橙、绿、蓝状态含义在各领域保持一致，并且不能只依赖颜色表达。

默认密度必须支持操作型 Table 和 Timeline，不能隐藏 Label。Chart 必须包含文字摘要、单位、时区和来源 Revision。测量值通过领域 Metadata 显示工程单位；UI 代码不得从字段名猜测单位。

## 无障碍和语言

交互 UI 在键盘操作、Focus 顺序、对比度、Label、错误关联和 Reduced Motion 方面满足 WCAG 2.2 AA。所有可见字符串使用已注册 Locale Namespace。平台自有 UI 必须提供中文和英文；客户术语通过 Solution Profile Dictionary 接入，不得硬编码组件分支。

日期使用显式站点时区并保留来源 Timestamp。数字、单位和小数精度遵循领域 Metadata。Destructive Confirmation 和 Policy Denial Message 使用直接且可执行的语言。

## 客户端信任

第一方签名 Web Artifact 可以在 DSH Client Module Graph 中运行。不可信第三方 UI 必须运行在 Sandboxed Iframe 或独立 Origin，并通过 Capability-scoped RPC 通信。Content Security Policy、Artifact Digest、允许的网络目标和暴露的 Host API 都属于部署预检。

UI 兼容要求包括已编译 Slot Type、Manifest Metadata、Locale Dictionary、Permission Declaration、Dispose Test、直接组件测试、组装浏览器测试和离线/错误 Snapshot。
