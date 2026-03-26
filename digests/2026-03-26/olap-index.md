# OLAP 生态索引日报 2026-03-26

> 生成时间: 2026-03-26 01:27 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告  
**日期：2026-03-26**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施整体呈现出三个明显趋势：**工程化治理增强、语义与兼容性精细化、生产可靠性优先级提升**。  
从 dbt 到 Spark，再到 Substrait，社区都在持续减少“静默失败”、补齐配置校验、改善错误信息，并强化跨环境一致性。  
同时，生态正在从“功能可用”迈向“行为可预测、可治理、可迁移”，这意味着未来竞争点不只是性能，而是**语义标准化、开发体验和企业级可运维性**。  
对技术决策者而言，这一轮演进说明 OLAP 基础设施正进入更强调**规范收敛 + 平台治理 + 多引擎互操作**的新阶段。

---

## 2. 各项目活跃度对比

| 项目 | 今日 Issues 更新数 | 今日 PR 更新数 | 今日 Release | 活跃度观察 |
|---|---:|---:|---|---|
| **dbt-core** | 10 个重点议题 | 10 个重点 PR | 无 | 活跃度高，讨论集中在配置严格性、function materialization、解析正确性 |
| **Apache Spark** | 2 个 Issue | 81 条 PR 更新（重点摘取 10 个） | 无 | 活跃度最高，开发主线非常繁忙，覆盖 SQL、PySpark、Streaming、Connect |
| **Substrait** | 1 个 Issue | 9 个 PR | 无 | 活跃度中等偏高，聚焦规范演进、函数/类型补齐、构建基础设施 |

### 简要判断
- **Spark** 是三者中开发活跃度最高的项目，PR 数远高于其他项目，显示出成熟大项目的持续迭代能力。
- **dbt-core** 社区互动密度高，虽然没有版本发布，但议题都很贴近真实生产使用，体现出产品层与工程治理层的快速演进。
- **Substrait** 绝对活跃度不如前两者，但其讨论高度集中在规范底层语义，单个议题的战略影响力较大。

---

## 3. 共同关注的功能方向

## 3.1 配置严格性、错误可观测性、减少静默失败
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**
  - `flags:` 严格校验（#12590）
  - 未知 flags 告警（PR #12689）
  - `.env` 支持（#12106 / PR #12711）
  - function 的 `post_hook` 被忽略（#12706）
- **Spark**
  - 提前暴露分析错误（PR #55027）
  - 改进 schema evolution 报错（PR #55024）
  - DSv2 命名错误码标准化（PR #54971）
  - 统一 Arrow 转换错误处理（PR #55011）
- **Substrait**
  - 澄清 extension relation 输出 schema 语义（PR #1018）
  - 规范层减少实现歧义，提升错误可解释性

**结论：**  
多个项目都在从“容忍模糊行为”转向“尽早失败、清晰报错、明确语义边界”。这对企业级平台尤其重要，因为它直接影响 CI 稳定性、变更审计和故障定位效率。

---

## 3.2 语义一致性与行为对齐
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**
  - v1.12 行为变更开关默认翻转（#12713）
  - selector / partial parsing / state:modified 正确性修复（#12539、#12563、#12548）
- **Spark**
  - `spark.catalog.*` 与 DDL 对齐（PR #55025）
  - pandas-on-Spark 对齐 pandas 2/3 行为（PR #55021）
  - `INSERT ... REPLACE ON/USING` 新 SQL 语义（PR #54722）
- **Substrait**
  - outer reference 统一处理（#1024）
  - 统计函数签名规范化（PR #1019 / #1012）
  - 废弃旧时间类型、收敛类型系统（PR #994）

**结论：**  
三者都在处理“同一能力在不同上下文下是否一致”这一核心问题。dbt 更关注工程执行语义一致性，Spark 更关注 API/SQL/运行时语义一致性，Substrait 则关注跨引擎计划语义一致性。

---

## 3.3 兼容性与跨环境稳定性
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**
  - Windows 环境变量大小写不敏感修复（PR #12681）
  - mypy 1.20.x 兼容（#12385）
- **Spark**
  - YARN 上 AES-GCM RPC 加密失效（#54999）
  - 4.0.2 / 4.1.1 安全漏洞修复版本关注（#55012）
- **Substrait**
  - 新增 `fp16`、`decimal256`、`duration` 扩展类型（PR #978）
  - 构建环境统一（PR #1021）

**结论：**  
兼容性问题仍然是 OLAP 基础设施的长期主题，只是表现层次不同：dbt 偏开发环境与工具链，Spark 偏集群部署与安全，Substrait 偏规范与实现兼容。

---

## 3.4 开发者体验与工程化能力
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：`.env` 支持、配置告警、项目级 analyses 配置
- **Spark**：更早更准的错误、Catalog API 与 SQL 对齐、Python 栈维护性增强
- **Substrait**：pixi 构建环境统一、文档补全、函数 YAML 持续完善

**结论：**  
开发者体验正在成为基础设施竞争力的一部分。社区不再只讨论“执行能力”，而是更重视**上手成本、调试成本、平台接入成本**。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 当前主要演进方向 |
|---|---|---|---|---|
| **dbt-core** | 数据建模、转换治理、项目配置与发布流程 | 数据工程师、分析工程师、平台团队 | 以 SQL + 配置驱动的数据开发框架 | 更严格配置、更成熟的新资源类型、增量解析与状态比较正确性 |
| **Apache Spark** | 通用分布式计算、批流一体、SQL 引擎、Python 生态 | 数据平台团队、流批处理工程师、AI/ETL 工程师 | 大规模分布式执行引擎，兼容 SQL / DataFrame / Python 多接口 | SQL 语义增强、PySpark 工程化、Streaming 可靠性、DSv2 标准化 |
| **Substrait** | 跨引擎查询计划规范、函数/类型标准化 | 查询引擎开发者、数据库厂商、互操作平台建设者 | 规范驱动，强调计划表达与跨系统互通 | 语义边界清晰化、函数与类型补完、规范去历史包袱、构建工程化 |

### 进一步解读
- **dbt-core** 更像“数据开发治理层”，关注的是项目可维护性、配置可靠性、发布行为稳定性。
- **Spark** 是“执行与计算层”，既要支持复杂运行时场景，也要兼顾 Python、SQL、Streaming 和连接器生态。
- **Substrait** 则位于“语义与互操作层”，核心价值不是直接跑任务，而是让不同引擎之间有统一的表达方式。

---

## 5. 社区热度与成熟度

## 5.1 社区热度
- **最高：Spark**
  - 单日 81 条 PR 更新，说明主线迭代密度极高。
  - 活跃点分布广，既有用户可见功能，也有底层接口和错误体系治理。
- **较高：dbt-core**
  - 虽然绝对 PR 量不如 Spark，但热点议题集中且贴近生产，社区反馈与修复闭环效率较好。
- **中等：Substrait**
  - 更新量相对少，但规范类项目本身节奏通常不以“数量”取胜，而以“语义影响面”取胜。

## 5.2 成熟度判断
- **Spark：高成熟度、持续演进型**
  - 生态广、模块多、backport 明显，说明已进入长期维护与持续创新并行阶段。
- **dbt-core：成熟产品向企业级工程平台深化**
  - 正从“灵活工具”走向“严格治理平台”，成熟度高，但仍有较多行为一致性细节在快速补齐。
- **Substrait：规范成熟度提升中的快速迭代期**
  - 处于“基础能力补完 + 语义收敛”的关键阶段，对生态未来影响大，但实施层成熟度仍在持续塑形。

---

## 6. 值得关注的趋势信号

## 6.1 “更严格、少歧义”正在成为行业共识
无论是 dbt 的 unknown flags 告警、Spark 的命名错误码，还是 Substrait 对 outer reference 与 extension schema 的澄清，都反映出一个共同趋势：  
**基础设施正在减少隐式行为，强化显式规则。**

**对数据工程师的参考价值：**
- 升级时要更重视配置审计和兼容性回归测试
- 设计内部规范时应优先“可验证”而非“灵活容错”
- CI 中应增加 lint、配置检查、语义回归

---

## 6.2 新能力的竞争点已从“支持”转向“可治理”
dbt 的 function materialization、Spark 的新 SQL/DML 语义、Substrait 的函数和类型扩展都说明：  
社区不再满足于“有这个功能”，而是要求它**可迁移、可比较、可调试、可演进**。

**对数据工程师的参考价值：**
- 选型时要关注功能周边能力：hooks、state diff、错误信息、backport、兼容矩阵
- 生产落地新能力时，必须评估 schema evolution、变更检测、回滚路径

---

## 6.3 语义标准化将越来越影响多引擎数据栈
Spark 在增强 SQL 表达力，dbt 在强化项目行为一致性，Substrait 在推进跨引擎计划规范。  
这说明未来数据平台的竞争不只是单点工具，而是**建模层—执行层—语义层**能否形成稳定协同。

**对技术决策者的参考价值：**
- 若组织采用多引擎架构，应提前关注 Substrait 一类标准的演进
- dbt 与 Spark 的结合点，将越来越依赖清晰的语义与元数据契约
- 平台能力建设应重视“统一治理面”而不只是单工具深度使用

---

## 6.4 生产可靠性和安全治理正在抬升优先级
Spark 的安全漏洞修复诉求、YARN 上 AES-GCM 失效，以及 dbt 对状态比较和部分解析正确性的修复，都表明：  
**用户已经把“系统是否稳定可依赖”放在和“是否有新功能”同等重要的位置。**

**对数据工程师的参考价值：**
- 版本升级不应只看 feature list，要重点跟踪安全、backport、稳定分支修复
- 大型项目要优先验证：增量解析、状态对比、恢复机制、跨平台行为一致性

---

## 结论

从 2026-03-26 的社区动态看，OLAP 数据基础设施生态正沿着三条主线同步演进：

1. **治理化**：配置、错误、状态比较、兼容性越来越严格  
2. **标准化**：函数、类型、SQL 语义、跨引擎表达持续收敛  
3. **生产化**：安全、恢复、跨平台一致性、可靠性问题优先级提升

如果从技术决策角度看：
- **选执行引擎与大规模计算平台**：Spark 仍是最活跃、最全面的主轴
- **选数据开发与治理层**：dbt 正明显强化企业级工程能力
- **关注长期互操作与语义标准**：Substrait 值得提前布局，尤其适合多引擎平台团队持续跟踪

如果你愿意，我可以进一步把这份内容整理成：
1. **适合管理层阅读的一页纸简报版**  
2. **适合飞书/公众号发布的精简播报版**  
3. **适合内部周会汇报的 Markdown 表格加强版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报 · 2026-03-26

> 数据来源：`github.com/dbt-labs/dbt-core`

## 1. 今日速览

过去 24 小时内，dbt-core 没有新版本发布，但社区在**配置严格性、函数物化（function materialization）、Windows 环境变量兼容性**等方向上非常活跃。  
今天最值得关注的信号是：一方面，维护者正推动 **v1.12 行为变更开关默认值翻转**；另一方面，社区提交了多项与 **`.env` 支持、未知 flags 告警、函数资源行为一致性** 相关的功能与修复 PR，说明 dbt 正继续朝“更严格、更可预期、更适合工程化治理”的方向演进。

---

## 2. 社区热点 Issues

以下挑选 10 个最值得关注的 Issue。

### 1) v1.12 行为变更开关将默认翻转
- **Issue**: #12713 `flip default for behavior change flags for v1.12`
- **状态**: OPEN
- **重要性**: 这是今天最关键的产品演进信号之一。dbt 计划在 `v1.12` 中将自 `v1.9`、`v1.10` 引入的 behavior change flags 默认启用，意味着过去通过开关“试运行”的新行为将走向默认路径。
- **影响**: 对升级用户、平台团队和 adapter 维护者都很重要，涉及兼容性验证、CI 基线更新、项目默认行为变化管理。
- **社区反应**: 刚创建，尚无评论，但其战略意义高于当前互动量。
- **链接**: [dbt-labs/dbt-core Issue #12713](https://github.com/dbt-labs/dbt-core/issues/12713)

### 2) dbt 应支持从项目根目录 `.env` 加载环境变量
- **Issue**: #12106 `[bug] [Feature] dbt should load env vars from root .env file`
- **状态**: OPEN
- **重要性**: 这是开发体验层面的高频诉求，尤其对本地开发、容器化环境、团队 onboarding 很关键。当前 dbt 对 env var 的使用很重，但缺少原生 `.env` 支持会增加环境配置摩擦。
- **社区反应**: 已有 3 条评论，且当天已有对应 PR 提交，说明需求明确、实现已推进。
- **链接**: [dbt-labs/dbt-core Issue #12106](https://github.com/dbt-labs/dbt-core/issues/12106)

### 3) 项目级 `flags:` 应该更严格，避免静默吞掉错误配置
- **Issue**: #12590 `make flags: list strict`
- **状态**: OPEN
- **重要性**: 当前 `dbt_project.yml` 里的 `flags:` 基本只校验原始 YAML 结构，未知字段会被静默接受。这对生产环境非常危险，因为拼写错误会直接导致“配置看似生效、实际无效”。
- **社区反应**: 已有 2 条评论，并且已有 PR 提出 “warn on unknown flags”，说明社区与维护者都认可这是配置治理问题。
- **链接**: [dbt-labs/dbt-core Issue #12590](https://github.com/dbt-labs/dbt-core/issues/12590)

### 4) `dbt test --select` 在 `_show` 命名模型上跳过 YAML data tests
- **Issue**: #12539
- **状态**: OPEN
- **重要性**: 这是典型的 node selection 缺陷，会直接影响测试覆盖率和 CI 可靠性。问题出现在模型名包含 `_show` 时，属于“命名触发的隐性行为错误”，很容易漏检。
- **社区反应**: 已有 2 条评论，且对应社区 PR 已进入 `ready_for_review`，修复路径较清晰。
- **链接**: [dbt-labs/dbt-core Issue #12539](https://github.com/dbt-labs/dbt-core/issues/12539)

### 5) function 资源的 `state:modified` 未识别 `.yml` 属性变更
- **Issue**: #12547
- **状态**: CLOSED
- **重要性**: 虽然已关闭，但值得关注，因为它体现了 dbt 对新资源类型 `function` 的状态比较/增量解析能力正在补齐。若 `state:modified` 无法识别 properties 变更，会影响 slim CI 和变更检测准确性。
- **社区反应**: 2 条评论、4 个 👍，并已在 PR 层面关闭，属于“社区快速修复”的正向案例。
- **链接**: [dbt-labs/dbt-core Issue #12547](https://github.com/dbt-labs/dbt-core/issues/12547)

### 6) 自定义物化（如 function）下，`dbt_project.yml` 中的 `post_hook` 被忽略
- **Issue**: #12706
- **状态**: OPEN
- **重要性**: 这是函数物化落地中的关键一致性问题。用户期望项目级 hooks 对自定义 materialization 同样生效；若被静默忽略，会造成部署行为与治理策略不一致。
- **社区反应**: 新问题、暂无评论，但从问题描述看属于“静默失败”类型，优先级通常不低。
- **链接**: [dbt-labs/dbt-core Issue #12706](https://github.com/dbt-labs/dbt-core/issues/12706)

### 7) function 物化需要支持 `--full-refresh` 以处理签名变更
- **Issue**: #12708
- **状态**: OPEN
- **重要性**: PostgreSQL 的 `CREATE OR REPLACE FUNCTION` 对参数重命名、返回类型变更有天然限制，因此函数资源在 schema evolution 场景下需要类似表模型的“重建”语义。这个需求非常贴近数据库对象管理现实。
- **社区反应**: 新建、暂无评论，但问题定义具体，适合后续设计实现。
- **链接**: [dbt-labs/dbt-core Issue #12708](https://github.com/dbt-labs/dbt-core/issues/12708)

### 8) SQL-language function 参数名遮蔽列名，dbt 应告警或失败
- **Issue**: #12707
- **状态**: OPEN
- **重要性**: 这是一个很“数据库内核感”的细节问题。PostgreSQL SQL-language function 中参数名与列名冲突时会静默解析为列，容易产生错误结果。dbt 若能在编译或校验阶段提示，将大幅提升函数开发安全性。
- **社区反应**: 暂无评论，但属于高价值“防踩坑”议题。
- **链接**: [dbt-labs/dbt-core Issue #12707](https://github.com/dbt-labs/dbt-core/issues/12707)

### 9) 依赖兼容性：面向即将到来的 mypy 1.20.x
- **Issue**: #12385
- **状态**: OPEN
- **重要性**: 这是生态兼容性问题。对维护者和贡献者而言，类型检查工具链升级会影响开发环境、CI、依赖解析和未来 Python 版本适配。
- **社区反应**: 2 条评论、5 个 👍，说明关注度高于多数常规 feature issue。
- **链接**: [dbt-labs/dbt-core Issue #12385](https://github.com/dbt-labs/dbt-core/issues/12385)

### 10) 是否继续依赖 dbt-extractor 的性能收益值得重评估
- **Issue**: #8674 `[CT-3133] Re-evaluate Performance Advantages of dbt-extractor`
- **状态**: OPEN
- **重要性**: 这是偏架构与技术债议题。dbt-extractor 作为 Rust 静态 Jinja 解析组件，历史上带来过性能收益，但随着架构演进，其复杂度与收益比值得重新审视。
- **社区反应**: 标签带有 `performance`、`tech_debt`、`stale`，当天又被更新，说明该议题虽老但仍未失去现实意义。
- **链接**: [dbt-labs/dbt-core Issue #8674](https://github.com/dbt-labs/dbt-core/issues/8674)

---

## 3. 重要 PR 进展

以下挑选 10 个值得关注的 PR。

### 1) 无论是否启用 contract enforcement，都填充 model constraints
- **PR**: #12710 `fix: populate model constraints regardless of contract enforcement`
- **状态**: OPEN
- **意义**: 这项修复直指约束元数据的一致性问题。即使未启用 contract enforcement，模型约束信息也应被正确填充，以支持下游校验、文档和元数据消费。
- **关联价值**: 有助于让 dbt 的约束语义更稳定，减少“启用/不启用某功能导致 manifest 信息不一致”的问题。
- **链接**: [dbt-labs/dbt-core PR #12710](https://github.com/dbt-labs/dbt-core/pull/12710)

### 2) 修复 Windows 下环境变量大小写不敏感查找
- **PR**: #12681 `fix: preserve case-insensitive env var lookup on Windows`
- **状态**: OPEN
- **意义**: Windows 平台环境变量本应大小写不敏感，而 dbt 1.8 之后出现了 `env_var('local_user')` 无法匹配 `LOCAL_USER` 的问题。此修复会显著改善 Windows 用户体验。
- **关联价值**: 体现 dbt-core 对跨平台行为一致性的重视，且已打上 `backport 1.11.latest`，说明修复优先级较高。
- **链接**: [dbt-labs/dbt-core PR #12681](https://github.com/dbt-labs/dbt-core/pull/12681)

### 3) 回补 SQL 解析默认设置：独立优化 `sqlparse` 两个限制项
- **PR**: #12696 `[Backport 1.11.latest] improve independent default settings of sqlparse.MAX_GROUPING_TOKENS and MAX_GROUPING_DEPTH`
- **状态**: OPEN
- **意义**: 这属于 SQL 解析层面的稳定性/性能修复。将 token 数量和深度限制独立处理，有助于在复杂 SQL 上获得更合理的默认行为。
- **关联价值**: 对大查询、深层嵌套 SQL 项目尤其重要。
- **链接**: [dbt-labs/dbt-core PR #12696](https://github.com/dbt-labs/dbt-core/pull/12696)

### 4) 修复 `_show` 命名模型导致选择器错误匹配的问题
- **PR**: #12562 `fix: use tuple membership check instead of substring match in selection_arg`
- **状态**: OPEN
- **意义**: 对应修复 #12539。根因是选择参数处理时把 tuple 中首元素当成字符串做了错误匹配，导致 `show/compile` 结果过滤异常。
- **关联价值**: 这是典型的小 bug 引发大体验问题，修复后能提升 `dbt test --select` 的确定性。
- **链接**: [dbt-labs/dbt-core PR #12562](https://github.com/dbt-labs/dbt-core/pull/12562)

### 5) 为 dbt 增加 `.env` 文件支持
- **PR**: #12711 `Support for .env files`
- **状态**: OPEN
- **意义**: 这是当天最受关注的新增能力之一，直接响应 #12106。若合并，将改善本地开发、模板项目、容器运行和多环境配置管理体验。
- **关联价值**: 对 data platform 团队来说，可减少 shell/export 脚本依赖，降低环境配置门槛。
- **链接**: [dbt-labs/dbt-core PR #12711](https://github.com/dbt-labs/dbt-core/pull/12711)

### 6) 支持 analyses 的项目级配置
- **PR**: #12709 `Feature - Analyses Project Level Config`
- **状态**: OPEN
- **意义**: 对应 #11427。为 `analyses` 增加项目级配置后，可让这一资源类型获得与 models、seeds 等更一致的项目治理能力。
- **关联价值**: 提升多资源类型配置模型的一致性，利好大型项目结构化管理。
- **链接**: [dbt-labs/dbt-core PR #12709](https://github.com/dbt-labs/dbt-core/pull/12709)

### 7) 对 `dbt_project.yml` 中未知 flags 给出告警
- **PR**: #12689 `feat: warn on unknown flags in dbt_project.yml`
- **状态**: OPEN
- **意义**: 这是对 #12590 的直接响应。相比“静默接受”，先给 warning 是很务实的过渡方案，既提升严格性，又避免立刻引入破坏性变更。
- **关联价值**: 对平台治理、配置审计、CI 质量门禁都很有帮助。
- **链接**: [dbt-labs/dbt-core PR #12689](https://github.com/dbt-labs/dbt-core/pull/12689)

### 8) 修复 function 资源 `state:modified` 忽略 `.yml` 属性变更
- **PR**: #12548 `fix: state:modified does not detect .yml property changes for resource_type:function`
- **状态**: CLOSED
- **意义**: 对应问题已闭环，说明函数资源在 slim CI / state comparison 能力上正在快速成熟。
- **关联价值**: 对采用 function 资源的团队来说，这是一个很实用的可用性修复。
- **链接**: [dbt-labs/dbt-core PR #12548](https://github.com/dbt-labs/dbt-core/pull/12548)

### 9) 将 catalog 加载耦合进 manifest 加载流程
- **PR**: #12705 `Couple catalog loading into manifest loading`
- **状态**: CLOSED
- **意义**: 对应 #12672，目的是让依赖 catalog 的子命令在加载路径上更一致，减少命令级别的特殊装饰器判断。
- **关联价值**: 这属于内部架构清理，通常会提升命令行为一致性并降低维护复杂度。
- **链接**: [dbt-labs/dbt-core PR #12705](https://github.com/dbt-labs/dbt-core/pull/12705)

### 10) partial parsing 在 access 变更时重新调度引用节点
- **PR**: #12563 `fix: schedule referencing nodes for reparse when access changes to private via config block`
- **状态**: OPEN
- **意义**: 修复 partial parser 对 `access` 变更感知不足的问题，尤其是 `config: {access: private}` 这类嵌套配置场景。
- **关联价值**: 这类修复直接影响增量解析准确性，对大型项目性能与正确性都重要。
- **链接**: [dbt-labs/dbt-core PR #12563](https://github.com/dbt-labs/dbt-core/pull/12563)

---

## 4. 功能需求趋势

结合今日 Issues 与 PR，可以看到社区关注点集中在以下几个方向：

### 1) 配置严格性与可观测性增强
代表议题：
- #12590 `flags:` 严格校验
- #12689 未知 flags 告警
- #12106 / #12711 `.env` 支持

**趋势判断**：  
dbt 用户越来越重视“配置错误不要静默失败”。这说明 dbt 正从灵活工具进一步走向企业级工程平台：配置要可验证、行为要可预测、错误要尽早暴露。

### 2) 函数资源（function materialization）能力快速补齐
代表议题：
- #12547 / #12548 `state:modified` 对 function 的支持
- #12706 `post_hook` 被忽略
- #12707 参数名遮蔽列名告警
- #12708 支持 `--full-refresh`

**趋势判断**：  
函数资源已经不是边缘需求，正在进入真实生产场景。社区开始从“能跑”转向“可治理、可演进、可安全发布”。

### 3) 兼容性与跨平台稳定性
代表议题：
- #12385 mypy 1.20.x 兼容
- #12681 Windows 环境变量大小写不敏感修复

**趋势判断**：  
dbt-core 仍需持续处理 Python 工具链升级与多平台行为差异问题。对企业用户而言，这类问题虽然不显眼，但会直接影响本地开发、CI/CD 和运维标准化。

### 4) 选择器、状态比较与增量解析正确性
代表议题：
- #12539 / #12562 node selection bug
- #12563 partial parsing / access 变更重解析
- #12547 function 的 state:modified

**趋势判断**：  
随着大型项目越来越依赖 slim CI、partial parsing 和精准 selector，社区对“变更检测正确性”的要求明显提高。这里的任何边角 bug 都会影响开发效率和发布可信度。

### 5) 底层解析性能与架构复杂度再评估
代表议题：
- #8674 dbt-extractor 性能收益重评估
- #12696 sqlparse 默认参数优化

**趋势判断**：  
dbt 社区不只关注新功能，也开始回头审视底层解析链路是否仍值得其复杂度成本。这类讨论往往会影响中长期架构路线。

---

## 5. 开发者关注点

结合今日动态，开发者反馈中的高频痛点主要有：

### 1) “静默失败”仍是最敏感问题
无论是未知 `flags`、被忽略的 `post_hook`，还是函数参数遮蔽列名，核心诉求都一致：  
**dbt 应尽量避免默默接受错误配置或危险语义。**

### 2) 新资源类型需要和传统模型一样成熟
function 相关问题集中爆发，说明开发者已不满足于基础支持，而是希望函数资源在：
- hooks
- full refresh
- state comparison
- 命名/语义校验  
上都达到与 models 接近的成熟度。

### 3) 大型项目更依赖“正确的增量机制”
selector、partial parsing、state:modified 这些问题频繁出现，反映出开发者越来越依赖：
- 局部编译
- 精准测试
- slim CI  
因此任何解析或状态判断偏差都会被迅速放大。

### 4) 配置体验需要更接近现代开发工具链
`.env` 支持、Windows env var 行为修复，都指向一个共同诉求：  
**dbt 的开发体验需要更原生地适配本地开发、跨平台运行和现代工程化工作流。**

### 5) 升级节奏与行为变更管理值得提前关注
随着 #12713 推进 v1.12 默认行为翻转，开发者和平台团队需要尽早：
- 盘点当前 behavior flags 使用情况
- 在 CI 中验证新默认值影响
- 评估是否需要过渡期文档和内部升级指南

---

以上为 2026-03-26 的 dbt-core 社区动态日报。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-26）

## 1. 今日速览

今天 Spark 社区没有新的 Release，但开发主线非常活跃，过去 24 小时内共有 81 条 PR 更新，重点集中在 **PySpark / pandas-on-Spark、SQL 语义完善、Spark Connect、Structured Streaming 状态恢复** 等方向。  
Issues 数量不多，但有两个值得高度关注：一是 **4.0.2/4.1.1 相关安全漏洞修复计划** 的用户追问，二是 **YARN 场景下 AES-GCM RPC 加密不可用**，后者属于潜在生产级阻断问题。

---

## 3. 社区热点 Issues

> 注：过去 24 小时内仅有 2 条 Issue 更新，低于“10 个”的目标数量。以下按现有数据完整梳理。

### 1) Spark 4.0.2 安全漏洞及修复计划询问
- **Issue**: #55012  
- **状态**: CLOSED  
- **链接**: apache/spark Issue #55012  
- **为什么重要**:  
  用户直接指出 Spark 4.0.2 存在多项安全漏洞，并认为其中不少在 4.1.1 上也未修复。这类问题直接关系到企业生产环境升级决策，尤其是金融、政企和云平台托管场景。  
- **社区反应**:  
  该问题已快速关闭，评论数不多（2 条），说明社区可能已给出明确答复或引导至既有安全流程，但也反映出用户对 **“漏洞修复会落在哪个版本”** 的信息透明度仍有需求。  
- **分析**:  
  这是典型的企业用户视角问题：不仅关心漏洞是否存在，更关心 **补丁时间表、受影响版本边界、升级建议**。对 Spark 而言，安全公告与发行节奏的联动仍是用户敏感点。

### 2) AES-GCM RPC 加密在 YARN 上失效
- **Issue**: #54999  
- **状态**: OPEN  
- **链接**: apache/spark Issue #54999  
- **为什么重要**:  
  该问题指出 AES-GCM 用于 RPC 加密后，在 YARN 应用中认证握手虽成功，但后续 RPC 消息会被丢弃或损坏，最终导致通道卡死并被 YARN 杀掉容器。这属于 **安全特性启用后导致集群不可用** 的严重兼容性问题。  
- **社区反应**:  
  目前评论数为 0，尚处于问题曝光早期，但从描述细节看，复现路径与故障表现已经比较明确，后续很可能演化为高优先级修复。  
- **分析**:  
  该 Issue 的关键不只是加密功能 bug，而是暴露了 Spark 在 **新加密实现、多消息通道处理、YARN 网络栈兼容性** 之间的集成风险。对仍大规模运行在 YARN 上的用户尤其需要关注。

---

## 4. 重要 PR 进展

以下挑选 10 个最值得关注的 PR：

### 1) `.loc` 在 Spark Connect 下提前捕获分析错误
- **PR**: #55027  
- **链接**: apache/spark PR #55027  
- **内容**:  
  优化 pandas-on-Spark 在 Spark Connect 模式下 `.loc` 的索引路径，在 `InternalFrame.__init__` 前提前触发并捕获分析错误。  
- **意义**:  
  这是典型的 **错误时机前移** 改进，能让用户更早拿到可理解的异常，减少 Connect 模式下 deferred analysis 带来的调试成本。

### 2) 从 ArrowStreamSerializer 中拆分 Group / CoGroup 序列化逻辑
- **PR**: #55026  
- **链接**: apache/spark PR #55026  
- **内容**:  
  将 `ArrowStreamGroupSerializer` 与 `ArrowStreamCoGroupSerializer` 从通用 `ArrowStreamSerializer` 中抽离。  
- **意义**:  
  有助于理清 PySpark Arrow 数据通路的职责边界，提高可维护性，也为后续 grouped/cogroup 场景的性能优化和 bug 修复打基础。

### 3) `spark.catalog.*` 与 DDL 命令能力对齐
- **PR**: #55025  
- **链接**: apache/spark PR #55025  
- **内容**:  
  推进 `spark.catalog.*` API 与 SQL DDL 命令之间的功能一致性，尤其围绕缓存表可见性与枚举能力。  
- **意义**:  
  这类改动对于 **多语言 API 一致性、自动化治理工具、平台元数据管理** 非常关键，能减少“SQL 能做、Catalog API 看不到”一类割裂体验。

### 4) pandas-on-Spark `groupby.idxmax/idxmin` 对齐 pandas 2/3 行为
- **PR**: #55021  
- **链接**: apache/spark PR #55021  
- **内容**:  
  调整 `skipna=False` 时 `GroupBy.idxmax` / `idxmin` 的行为，使其更贴近 pandas 2.x / 3.x 的版本差异。  
- **意义**:  
  这是标准的 **兼容性修复**。对于依赖 pandas 语义迁移到 pandas-on-Spark 的用户，细粒度行为对齐直接影响测试通过率和代码可移植性。

### 5) DSv2 Connector API 采用命名化错误码
- **PR**: #54971  
- **链接**: apache/spark PR #54971  
- **内容**:  
  将 DSv2 Connector API 中 18 个 `_LEGACY_ERROR_TEMP_*` 错误码替换为具名且可读的错误条件。  
- **意义**:  
  这是 Spark 错误体系工程化的重要一步。对连接器开发者、平台日志解析、异常归因、国际化文档都更友好，也表明 Spark 在 **错误语义标准化** 上持续推进。

### 6) 改进 View `WITH SCHEMA EVOLUTION` 的报错信息
- **PR**: #55024  
- **链接**: apache/spark PR #55024  
- **内容**:  
  当视图开启 schema evolution 且 catalog 更新失败时，提供更准确、更具上下文的错误信息。  
- **意义**:  
  直接改善 Lakehouse/元数据平台中常见的权限与 schema 演进故障排查体验，属于 **高价值可观测性增强**。

### 7) 新增 `INSERT INTO ... REPLACE ON/USING` 语法
- **PR**: #54722  
- **链接**: apache/spark PR #54722  
- **内容**:  
  为 `INSERT` 命令引入 `REPLACE ON <condition>` 与 `REPLACE USING (<columns>)` 两种语法。  
- **意义**:  
  这是今天最值得关注的 SQL 能力扩展之一，体现 Spark 在 **DML 语义增强、增量写入与条件替换** 方面继续向更现代的数据仓库体验靠拢。

### 8) Structured Streaming：checkpoint V2 集成 auto-repair snapshot
- **PR**: #55015  
- **链接**: apache/spark PR #55015  
- **内容**:  
  让 checkpoint V2 的加载路径支持 auto-repair snapshot，在快照损坏时提供恢复逻辑。  
- **意义**:  
  对生产流式任务极其重要。该改动增强了状态存储恢复能力，降低 checkpoint 损坏导致任务长时间中断的风险，属于 **可靠性优先级很高** 的增强。

### 9) 回移 4.1：统一 UDF / UDTF Arrow 转换错误处理
- **PR**: #55011  
- **链接**: apache/spark PR #55011  
- **内容**:  
  将 master 上关于 UDF/UDTF Arrow 转换错误信息统一的改动 backport 到 branch-4.1。  
- **意义**:  
  说明社区不仅在主干开发，也在积极改善稳定分支的用户体验。对 4.1 用户来说，这种回移能显著减少 Python/Arrow 相关问题的定位成本。

### 10) `df.cache()` 与 DSv2 接口协同，启用 V2ScanRelationPushDown 规则
- **PR**: #55017  
- **链接**: apache/spark PR #55017  
- **内容**:  
  该 WIP PR 探索让 `df.cache()` 与 DSv2 接口打通，从而使 V2ScanRelationPushDown 优化规则可作用于缓存场景。  
- **意义**:  
  如果落地，可能影响 Spark 在 **缓存与数据源下推优化协同** 上的整体执行模型，对查询性能与优化器一致性都具有长期意义。

---

## 5. 功能需求趋势

结合当天更新的 Issues 与 PR，可以看到 Spark 社区当前的几个核心方向：

### 1) Python / pandas-on-Spark 兼容性与工程化持续增强
今天多个 PR 聚焦 pandas-on-Spark 行为对齐、类型注解、Arrow 序列化重构、错误类校验等，说明 PySpark 生态仍是高活跃区。  
**趋势判断**：社区正在从“功能可用”走向“行为一致、调试友好、代码可维护”。

### 2) SQL 语义增强与开发者体验优化
从 `INSERT ... REPLACE ON/USING`、`to_json sortKeys`、视图 schema evolution 错误信息、Catalog API/DDL 对齐等可见，Spark SQL 正在持续补齐现代分析引擎常见能力。  
**趋势判断**：重点不只是执行性能，也包括 **SQL 可表达性、语义精细化、运维可观测性**。

### 3) DSv2 与连接器生态标准化
DSv2 命名错误码、缓存与 V2 下推规则协同等工作表明，Spark 仍在强化 Data Source V2 作为未来连接器和优化器集成的主轴。  
**趋势判断**：社区希望让外部存储和 Spark 优化器的对接更标准、更稳定。

### 4) Structured Streaming 可靠性提升
checkpoint V2 与 auto-repair snapshot 的集成表明流处理场景的故障恢复仍是重点投资方向。  
**趋势判断**：在生产级流任务中，状态一致性、恢复效率、损坏自愈能力越来越重要。

### 5) 安全与部署兼容性问题开始浮出水面
虽然只有两条 Issue，但都很“硬核”：一个是版本漏洞修复诉求，一个是 YARN 上 AES-GCM 加密不可用。  
**趋势判断**：随着安全特性和新实现上线，社区对 **跨部署环境兼容性、安全补丁节奏、企业级可用性** 的关注在上升。

---

## 6. 开发者关注点

### 1) 错误信息质量仍是高频诉求
今天不少 PR 都在改善错误消息、统一错误类或提前暴露分析异常。这说明开发者对 Spark 的一个长期诉求仍然是：  
- 报错更早  
- 报错更准  
- 报错可机器处理  
- 报错在多语言 API 间一致

### 2) Python 栈复杂度高，维护成本持续上升
Arrow、UDF/UDTF、类型注解、pandas 版本兼容、Connect 行为差异等问题持续出现，说明 Python 用户面广，但也给 Spark 带来了较高的接口兼容与测试矩阵压力。

### 3) SQL 与编程接口的一致性是平台化用户痛点
`spark.catalog.*` 与 DDL 对齐这类工作，反映出平台开发者希望 SQL、Scala/Java、PySpark 之间具备更一致的行为，避免治理平台、元数据服务和 Notebook 使用体验割裂。

### 4) 生产可靠性优先级提高
Streaming checkpoint 修复、YARN 加密异常等都指向一个现实：  
开发者不只关注新功能，更关注 **集群在异常情况下是否能恢复、是否会因安全开关导致不可用**。

### 5) 企业用户需要更明确的版本治理信息
安全漏洞 Issue 虽已关闭，但暴露出用户强烈需要：  
- 哪些版本受影响  
- 哪个版本会修复  
- 是否有 backport  
- 是否有临时规避方案  
这类信息对生产升级计划至关重要。

---

## 附：今日值得跟踪的链接清单

- Issue #55012 — Security vulnerabilities on Spark version 4.0.2  
  链接: apache/spark Issue #55012
- Issue #54999 — AES-GCM for RPC encryption does not work on YARN  
  链接: apache/spark Issue #54999
- PR #55027 — Catch analysis errors before `InternalFrame.__init__` in `.loc`  
  链接: apache/spark PR #55027
- PR #55026 — Extract ArrowStreamGroupSerializer and ArrowStreamCoGroupSerializer  
  链接: apache/spark PR #55026
- PR #55025 — Feature parity between `spark.catalog.*` vs DDL commands  
  链接: apache/spark PR #55025
- PR #55021 — Align groupby idxmax and idxmin `skipna=False` behavior  
  链接: apache/spark PR #55021
- PR #54971 — Replace legacy error codes with named errors in DSv2 connector API  
  链接: apache/spark PR #54971
- PR #55024 — Improve View WITH SCHEMA EVOLUTION error message  
  链接: apache/spark PR #55024
- PR #54722 — Add `INSERT INTO ... REPLACE ON/USING` syntax  
  链接: apache/spark PR #54722
- PR #55015 — Integrate checkpoint V2 with auto-repair snapshot  
  链接: apache/spark PR #55015
- PR #55011 — Unify UDF and UDTF Arrow conversion error handling  
  链接: apache/spark PR #55011
- PR #55017 — `df.cache()` with DSv2 interfaces for optimizer pushdown  
  链接: apache/spark PR #55017

如果你愿意，我还可以继续把这份日报整理成更适合公众号/飞书群播报的 **“摘要版”**，或者输出成 **Markdown 表格版**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新版本发布，但社区在规范演进、函数扩展和构建基础设施方面非常活跃。最值得关注的动态包括：一个关于 **outer reference 统一处理模型** 的新 Issue，以及多项围绕 **函数语义补齐、类型清理、扩展类型引入、构建环境标准化** 的 PR 持续推进。

整体来看，社区当前重点集中在三条主线：**规范一致性与可实现性提升**、**核心函数/类型生态补全**、以及 **开发与构建流程工程化**。

---

## 2. 社区热点 Issues

> 过去 24 小时内仅有 1 条 Issue 更新。以下按“最值得关注”列出实际可见条目。

### 1) Unified outer reference handling with common subexpression
- **状态**: OPEN
- **作者**: @yongchul
- **Issue**: #1024
- **链接**: substrait-io/substrait Issue #1024

**内容概述**  
该 Issue 讨论 Substrait 当前对 outer reference 的处理仍然基于 offset，需要实现者沿 Rel 树逐层向上解析绑定边界。在存在多层嵌套、子查询或公共子表达式时，这种机制会增加实现复杂度，也容易导致不同引擎对边界语义理解不一致。

**为什么重要**  
这是一个非常核心的规范问题，直接影响：
- 相关子查询与嵌套作用域的表达能力；
- 优化器在公共子表达式、嵌套 Rel 重写时的稳定性；
- 不同执行引擎对计划的可移植性和一致解释能力。

**社区反应**  
目前评论数和点赞数都为 0，说明还处于问题提出阶段，但从议题本身来看，它属于高影响、底层语义类问题，后续很可能演化为规范层面的设计讨论。

---

## 3. 重要 PR 进展

> 过去 24 小时内更新了 9 个 PR。以下全部列为今日重点关注项。

### 1) build: use pixi to manage build environment
- **状态**: OPEN
- **作者**: @nielspardon
- **PR**: #1021
- **链接**: substrait-io/substrait PR #1021

**进展与价值**  
该 PR 尝试用 **pixi** 统一管理构建环境，替代当前分散、手工步骤较多的构建方式。对仓库而言，这不是简单的工具替换，而是一次开发者体验和 CI 一致性的系统性改进。

**影响点**
- 降低新贡献者上手门槛；
- 提升本地开发、文档生成、测试执行的一致性；
- 有利于减少“环境问题”导致的非功能性失败。

---

### 2) feat: add has_overlap function to functions_list.yaml
- **状态**: OPEN
- **作者**: @benbellick
- **PR**: #987
- **链接**: substrait-io/substrait PR #987

**进展与价值**  
新增 `has_overlap` 标量函数，用于判断两个 list 是否存在公共元素。讨论中还涉及其归属从 `functions_set.yaml` 调整到 `functions_list.yaml`，体现了社区对**类型语义归位**的重视。

**影响点**
- 补齐列表类函数能力；
- 便于映射 PostgreSQL、Spark、DuckDB 等系统中的类似能力；
- 有助于减少引擎方通过扩展函数“各自实现”的碎片化现象。

---

### 3) docs: clarify output schema handling for extension relations
- **状态**: OPEN
- **作者**: @benbellick
- **PR**: #1018
- **链接**: substrait-io/substrait PR #1018

**进展与价值**  
该 PR 旨在澄清 extension relation 的输出 schema 应如何处理。标准 relation 通常可推导输出列，但 extension relation 无法天然做到这一点，因此需要在文档中明确由扩展定义方负责声明或约束。

**影响点**
- 降低扩展 relation 的实现歧义；
- 提高消费者/执行器处理扩展节点时的可预测性；
- 对规范可读性和互操作性都很关键。

---

### 4) feat(extensions): add subscript_operator and index_of functions
- **状态**: OPEN
- **作者**: @benbellick
- **PR**: #1020
- **链接**: substrait-io/substrait PR #1020

**进展与价值**  
该 PR 增加两个常见 list 函数：
- `subscript_operator`：按 1-based index 取元素，越界返回 NULL；
- `index_of`：查找元素位置。

其语义设计对齐 PostgreSQL 和 CockroachDB，更强调**可落地实现的数据库兼容语义**。

**影响点**
- 完善 list 操作能力；
- 为引擎做 SQL 方言映射提供统一规范；
- 反映社区正在加快“常用函数最小完备集”的建设。

---

### 5) feat(extensions)!: deprecate std_dev and variance using function options
- **状态**: OPEN
- **作者**: @nielspardon
- **PR**: #1019
- **链接**: substrait-io/substrait PR #1019

**进展与价值**  
这是一个带 **BREAKING CHANGE** 的变更：弃用通过 function options 表达的 `std_dev` 和 `variance` 签名，转向使用 enum 参数版本。

**影响点**
- 统一函数参数表达形式；
- 让函数签名更规范、更适合生成测试与工具链处理；
- 可能影响已有依赖旧签名的生成器、校验器和执行器。

这是典型的“短期迁移成本换长期规范一致性”的 PR。

---

### 6) feat(extensions): add fp16, decimal256, and duration extension types
- **状态**: OPEN
- **作者**: @kadinrabo
- **PR**: #978
- **链接**: substrait-io/substrait PR #978

**进展与价值**  
引入三个扩展类型：
- `fp16`
- `decimal256`
- `duration`

这表明社区正继续推进更广泛的数据类型覆盖，尤其是面向分析型系统中常见的高精度数值、压缩浮点和时长表达需求。

**影响点**
- 提高与 Arrow、现代 OLAP 引擎及科学计算场景的兼容性；
- 为更复杂的类型系统扩展提供模板；
- 有利于减少“类型表达不到位”导致的方言回退或扩展泛滥。

---

### 7) [PMC Ready] feat!: remove deprecated time, timestamp and timestamp_tz types
- **状态**: OPEN
- **作者**: @nielspardon
- **PR**: #994
- **链接**: substrait-io/substrait PR #994

**进展与价值**  
该 PR 准备移除已弃用的 `time`、`timestamp` 和 `timestamp_tz` 类型，涉及 proto、dialect schema、extension YAML、ANTLR grammar、测试、文档等多个层面，是一次真正的“全仓清理”。

**影响点**
- 进一步减少历史包袱；
- 迫使生态统一迁移到新的时间类型表达；
- 对实现方来说，这类 PR 虽破坏性较强，但长期看能显著提升规范整洁度。

---

### 8) [PMC Ready] feat: add current_date, current_timestamp and current_timezone variables
- **状态**: OPEN
- **作者**: @nielspardon
- **PR**: #945
- **链接**: substrait-io/substrait PR #945

**进展与价值**  
新增 3 个执行上下文变量：
- `current_date`
- `current_timestamp`
- `current_timezone`

这类变量在 SQL 引擎中非常常见，是规范与主流数据库行为对齐的重要一步。

**影响点**
- 有助于表达非纯函数、依赖执行上下文的语义；
- 提升 SQL 到 Substrait 的映射完整性；
- 对查询重写、缓存和确定性分析也提出更明确的语义要求。

---

### 9) [PMC Ready] feat(extensions): support int arguments with std_dev and variance functions
- **状态**: OPEN
- **作者**: @nielspardon
- **PR**: #1012
- **链接**: substrait-io/substrait PR #1012

**进展与价值**  
为 `std_dev` 和 `variance` 增加整数参数支持，并配套新的 enum argument 语法和生成测试用例。

**影响点**
- 提升统计函数对真实数据库行为的兼容性；
- 避免整数列输入时需要额外隐式转换；
- 与 #1019 共同构成统计函数语义和签名整理的一部分。

---

## 4. 功能需求趋势

结合当前更新的 Issue 和 PR，可以提炼出 Substrait 社区近期最关注的几个方向：

### 1) 查询语义与作用域解析一致性
以 Issue #1024 为代表，社区开始把注意力放在 **outer reference、嵌套作用域、公共子表达式** 等更深层的计划语义问题上。  
这说明 Substrait 已不仅关注“能表达什么”，而是在推进“如何被一致正确地解释”。

### 2) 核心函数集持续补完
近期多个 PR 围绕 list 函数、统计函数、上下文变量展开，说明社区在加速补齐**常用 SQL/分析函数能力**，以提高从数据库方言到 Substrait 的映射覆盖率。

### 3) 类型系统规范化与扩展化并行
一方面，PR #994 持续清理废弃类型；另一方面，PR #978 增加 `fp16`、`decimal256`、`duration` 等扩展类型。  
这表明社区策略很明确：**核心类型收敛、扩展类型开放**。

### 4) 扩展机制的可实现性增强
PR #1018 聚焦 extension relation 的输出 schema 处理，反映出社区正在补足扩展机制中的“灰色地带”，减少实现者各自理解造成的互操作风险。

### 5) 工程化和开发者体验
PR #1021 用 pixi 管理构建环境，说明项目不再只推进规范文本本身，也在持续投入贡献体验、构建一致性和维护效率。

---

## 5. 开发者关注点

从今日动态中，可以归纳出开发者最在意的几个痛点和高频需求：

### 1) 规范语义边界不够直观
outer reference、extension relation 输出 schema 等议题都指向同一个问题：**规范在复杂场景下的语义边界仍需更清晰的定义**。  
对实现者而言，模糊空间越大，跨引擎兼容成本越高。

### 2) 常见数据库能力仍在补齐中
列表操作、上下文变量、统计函数参数支持等 PR 表明，开发者仍在推动 Substrait 更完整地覆盖主流 SQL 引擎的基础能力，以减少方言映射中的“缺口”。

### 3) 破坏性升级需要更平滑的迁移路径
像 #1019、#994 这样的 breaking changes 对规范整洁很重要，但实现方通常会关心：
- 迁移窗口多长；
- 兼容层是否保留；
- 测试与验证工具是否同步更新。

### 4) 类型系统兼容性是持续焦点
新类型扩展与旧类型移除同时发生，说明开发者既需要更强的表达能力，也需要更稳定、统一的类型规范，特别是在 Arrow/OLAP/多引擎互通场景下。

### 5) 构建和贡献门槛仍是工程重点
构建环境碎片化会显著影响贡献效率。引入 pixi 这样的统一方案，说明社区已经意识到：**规范项目也需要现代化的开发基础设施**。

---

## 6. 总结

今天的 Substrait 社区动态没有版本发布，但信号非常明确：项目正在从“规范内容扩展”走向“规范语义收敛 + 工程化完善”的新阶段。对数据工程师、查询引擎开发者和数据库实现者而言，尤其值得持续关注的是 **outer reference 语义设计、函数签名规范化、类型系统演进以及扩展机制文档完善**。

如果你正在实现或对接 Substrait，今日最建议优先跟进的条目是：
- Issue #1024：outer reference 统一处理
- PR #1021：pixi 构建环境统一
- PR #1019 / #1012：统计函数签名与参数语义调整
- PR #994：废弃时间类型移除
- PR #1020 / #987：list 函数能力补齐

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*