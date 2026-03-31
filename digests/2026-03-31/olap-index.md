# OLAP 生态索引日报 2026-03-31

> 生成时间: 2026-03-31 01:28 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告  
**日期：2026-03-31**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个明显特征：**“从可用走向可治理、从单点能力走向跨层协同”**。  
dbt-core 正在强化模型治理、状态比较准确性与 CLI/Artifacts 可观测性；Spark 持续推进 SQL/执行引擎/Python 生态与安全基础设施；Substrait 则聚焦规范收敛、类型系统扩展和跨引擎语义统一。  
从社区信号看，行业重点已不再只是“把查询跑起来”，而是转向 **语义稳定性、执行优化、跨平台兼容性、机器可读输出与标准化互操作**。  
这说明 OLAP 基础设施正加速分层：**dbt 更像治理与交付层，Spark 是计算执行层，Substrait 是跨引擎计划/语义标准层**。

---

## 2. 各项目活跃度对比

| 项目 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 活跃度观察 |
|---|---:|---:|---|---|
| **dbt-core** | 7 | 10+（重点 PR 10 个，另有补充 PR） | 无新 Release | 活跃度高，重点在稳定性修复、错误处理、状态比较、开发者体验 |
| **Apache Spark** | 7 | 10（重点 PR 10 个） | 无新 Release | 活跃度高，覆盖 SQL、DSv2、Python、执行优化、安全与 Infra |
| **Substrait** | 0 | 6 | 无新 Release | 活跃度中等偏聚焦，Issue 较少，PR 集中于规范演进与 Breaking Changes |

### 简要解读
- **dbt-core 与 Spark** 今日社区活跃度接近，且都处于高频工程迭代状态。
- **dbt-core** 更偏“产品化稳定性与使用体验”优化。
- **Spark** 更偏“执行层能力扩展 + 底层基础设施演进”。
- **Substrait** 虽然总量不高，但 PR 议题含金量很高，且带有明显规范收敛特征。

---

## 3. 共同关注的功能方向

以下几个方向在多个项目中都出现了明显信号：

### 3.1 错误处理、诊断体验与机器可读输出
**涉及项目：dbt-core、Spark**

- **dbt-core**
  - 将 Python 原生异常替换为 `DbtException` 子类（PR #12686）
  - snapshot YAML 缺字段时不再打印冗长堆栈（PR #12700）
  - `run-operation` 失败消息写入 `run_results.json`（PR #12730）
  - `dbt list --output verbose`（PR #12752）
- **Spark**
  - Java 错误类同步到 Python 侧（PR #55100）
  - 文档补齐聚合函数返回类型（Issue #54986）

**共性判断**：  
社区都在推动工具从“面向人类日志”向“面向平台集成和自动化消费”演进。这对编排系统、数据平台门户、CI/CD 自动诊断非常关键。

---

### 3.2 稳定性与真实生产环境兼容性
**涉及项目：dbt-core、Spark**

- **dbt-core**
  - CRLF/LF 导致 `state:modified` 误报（PR #12731）
  - 只读目录下 `dbt deps` 权限问题（PR #12729）
  - 特殊 git 输出破坏解析（PR #12728）
  - telemetry 超时影响命令尾延迟（PR #12741）
- **Spark**
  - Ubuntu 25.10 `/tmp` 访问异常（Issue #55096）
  - Apple Silicon native 库失败（Issue #55093）
  - GitHub Actions 固定 SHA（PR #55066）
  - NettyStreamManager 路径穿越修复（PR #55077）

**共性判断**：  
两者都在补齐企业环境中的边缘条件，反映出 OLAP 项目已进入“规模化生产使用”阶段，兼容性和工程健壮性正在成为核心竞争力。

---

### 3.3 语义一致性与标准化表达
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**
  - 版本化模型的“无后缀最新版本入口”（Issue #7442）
  - model freshness（Issue #12719）
  - selector/state diff 语义一致性修复
- **Spark**
  - 新 SQL 语法 `INSERT INTO ... REPLACE ON/USING`（PR #54722）
  - `SHOW COLLATIONS`（PR #55099）
  - `createTableLike` 传递完整 `TableInfo`（PR #55101）
- **Substrait**
  - 删除废弃时间类型（PR #994）
  - 删除废弃 grouping 字段（PR #1002）
  - 新增上下文变量与函数签名补齐（PR #945、#1012）

**共性判断**：  
三个项目都在强化“语义边界清晰、行为可预测、跨系统表达一致”的能力，只是层级不同：  
- dbt 是模型/治理语义  
- Spark 是 SQL/Catalog/执行语义  
- Substrait 是跨引擎交换语义

---

### 3.4 可观测性与元数据增强
**涉及项目：dbt-core、Substrait，Spark 部分相关**

- **dbt-core**
  - run_results 增强失败消息
  - catalog tracking（PR #12747）
  - model freshness 进入 Epic
- **Substrait**
  - 上下文变量补齐
  - breaking change policy 与 supported libraries 文档治理（PR #1026）
- **Spark**
  - 更完整的 `TableInfo`
  - 文档与错误类改进提升元数据可解释性

**共性判断**：  
行业正从“执行结果正确”迈向“执行过程和语义可追踪、可管理、可对接平台治理”。

---

## 4. 差异化定位分析

### 4.1 dbt-core：模型治理与开发工作流层
**功能侧重**
- 模型版本治理
- freshness/状态比较
- selector 准确性
- CLI 体验与 artifact 完整性
- 依赖管理健壮性

**目标用户**
- 数据分析工程师
- Analytics Engineer
- 数据平台团队中的建模/治理角色

**技术路线**
- 以 DAG、语义建模、状态选择、artifact 为核心
- 强调“开发—发布—治理”的工程体验
- 正向更强的数据产品治理层延伸

**结论**
- dbt-core 更接近 **数据建模与交付控制平面**，而非底层执行引擎。

---

### 4.2 Apache Spark：通用计算与执行优化层
**功能侧重**
- SQL 语义扩展
- Catalyst/AQE/CBO 优化
- DSv2/Catalog 体系
- PySpark/Arrow 生态
- 安全、CI、运行时现代化

**目标用户**
- 数据平台工程师
- 分布式计算开发者
- 数仓/湖仓引擎团队
- 机器学习与流批处理用户

**技术路线**
- 持续强化统一执行引擎能力
- 兼顾 SQL、Python、流处理、ML 与 infra
- 在 JVM 现代化、列式执行与多平台兼容上持续推进

**结论**
- Spark 依旧是 **OLAP/湖仓场景最核心的通用计算底座之一**。

---

### 4.3 Substrait：跨引擎语义与计划交换标准层
**功能侧重**
- 协议/规范收敛
- 类型系统扩展
- 函数签名标准化
- breaking change 管理
- 上下文语义建模

**目标用户**
- 查询引擎开发者
- 连接器/适配器作者
- 计划生成器与消费器维护者
- 希望实现跨引擎互操作的平台团队

**技术路线**
- 以 proto/schema/function/type 为核心
- 强调标准的一致性而非单一实现能力
- 主动清理废弃设计，提升长期可维护性

**结论**
- Substrait 更像 **OLAP 生态的“语义交换协议层”**，不直接提供执行能力，但会深刻影响引擎互操作和生态集成。

---

## 5. 社区热度与成熟度

### 5.1 社区活跃度
- **最高活跃度：dbt-core、Spark**
  - 两者今日均有 7 个更新 Issues
  - Spark 10 个重点 PR，dbt-core 10+ 个重点 PR
- **中等活跃度但议题集中：Substrait**
  - 0 个 Issue、6 个 PR
  - 更像“少量高价值规范变更”而非高频用户支持型社区

### 5.2 成熟度判断
- **dbt-core：成熟产品 + 持续打磨阶段**
  - 大量修复集中在错误处理、状态选择、依赖/权限边界
  - 表明已被大规模使用，社区开始重视“长尾摩擦成本”
- **Spark：成熟平台 + 多线并进演进阶段**
  - 同时推进 SQL、执行器、Python、安全、infra
  - 典型的成熟大型基础设施项目特征
- **Substrait：快速规范化阶段**
  - PR 带有明显 breaking change 和 schema 清理特征
  - 说明项目仍在快速收敛模型，标准层成熟度正在提升，但生态适配成本也在上升

### 5.3 迭代阶段总结
- **Spark**：成熟且持续扩张  
- **dbt-core**：成熟且强化治理与体验  
- **Substrait**：仍在关键标准收敛期，适配者需密切跟进

---

## 6. 值得关注的趋势信号

### 趋势 1：OLAP 基础设施正在从“执行工具”升级为“治理平台”
**信号来源**
- dbt 的 model freshness、版本化模型无后缀映射
- dbt artifact 完整性增强
- Spark 对 metadata、catalog、错误分类的完善

**对数据工程师的价值**
- 未来选型不应只看性能，还要看模型发布、SLA、可观测性与自动化集成能力。

---

### 趋势 2：跨平台兼容与边缘环境健壮性成为基础门槛
**信号来源**
- dbt 的 CRLF/LF、只读目录、git 输出、telemetry 超时
- Spark 的 Ubuntu 25.10、Apple Silicon、CI 供应链安全

**对数据工程师的价值**
- 本地开发、CI、容器、企业内网、混合 OS 环境的一致性验证将成为标准工程实践。  
- 采购或自建平台时，应优先考察“边缘环境稳定性”，而非只看 happy path。

---

### 趋势 3：机器可读输出和结构化异常正在成为标配
**信号来源**
- dbt：`run_results.json` 写入失败信息、verbose list 输出
- Spark：错误类跨语言对齐、文档精细化

**对数据工程师的价值**
- 数据平台会越来越依赖 artifacts、错误码、结构化元数据做自动编排、告警、重试和质量治理。  
- 工具是否“可被程序消费”，将与是否“人类好用”同样重要。

---

### 趋势 4：SQL/模型/计划语义正在跨层标准化
**信号来源**
- dbt：模型版本与 freshness 语义
- Spark：SQL DML/DDL/Catalog 语义扩展
- Substrait：类型、函数、上下文变量与废弃清理

**对数据工程师的价值**
- 未来数据栈会更加模块化，治理层、执行层、交换层之间需要更稳定的语义契约。  
- 团队在设计数据产品时，应更重视 schema、版本、类型、时间语义和兼容策略。

---

### 趋势 5：标准层项目开始进入“去历史包袱”阶段
**信号来源**
- Substrait 连续推进 deprecated 类型/字段删除
- breaking change policy 文档开始明确

**对数据工程师的价值**
- 若团队已布局多引擎互操作，应尽早建立 Substrait 版本跟踪和兼容性测试机制。  
- 标准尚在收敛期时，提前抽象适配层比深度绑定某一版协议更稳妥。

---

## 结论

从 2026-03-31 的社区动态看，OLAP 生态正形成较清晰的三层分工：  
- **dbt-core**：强化数据模型治理、状态选择与开发者体验  
- **Spark**：继续担当高性能通用计算与 SQL 执行核心  
- **Substrait**：推进跨引擎语义标准与协议统一  

对技术决策者而言，当前最重要的不是单独押注某个项目，而是理解它们在数据栈中的分层角色，并围绕以下能力做体系化建设：  
**语义治理、执行性能、互操作标准、机器可读元数据、以及生产环境兼容性。**

如果你愿意，我还可以继续把这份报告整理成以下两种格式之一：  
1. **管理层一页纸摘要版**  
2. **研发团队跟进清单版（按项目拆成行动项）**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报 · 2026-03-31

数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

过去 24 小时内，dbt-core 没有新 Release，但社区开发活动非常活跃，重点集中在 **错误处理改进、选择器/状态比较准确性、依赖管理健壮性，以及 CLI 输出体验增强**。  
从 Issues 和 PR 看，当前维护重点明显偏向 **1.11.latest 稳定性回补** 与 **开发者体验优化**，同时也出现了更长期的能力建设议题，如 **模型 freshness** 与 **版本化模型无后缀别名**。

---

## 2. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 共 7 条。以下按“值得关注程度”进行整理，并补充关联背景，便于跟踪重点方向。

### 1) 版本化模型希望自动维护“无后缀最新版本”入口
- **Issue**: [#7442](https://github.com/dbt-labs/dbt-core/issues/7442)
- **标题**: For versioned models, automatically create view/clone of latest version in unsuffixed database location
- **状态**: OPEN
- **为什么重要**: 这是 dbt 版本化模型治理中的核心诉求之一。生产者希望 `<db>.<schema>.<model_name>` 永远指向最新版本，从而让下游消费者不必显式绑定 `v1/v2/...` 后缀，降低迁移成本。
- **社区反应**: 评论 34、👍 100，热度非常高，说明这是跨团队协作与语义稳定性场景中的真实痛点。
- **观察**: 该议题与 `multi_project`、`model_versions` 标签同时出现，意味着它不仅是语法层问题，还关系到跨项目依赖管理与发布策略。

### 2) Python 3.14 兼容性推进
- **Issue**: [#12098](https://github.com/dbt-labs/dbt-core/issues/12098)
- **标题**: Python 3.14 support, requires newer mashumaro and potentially pydantic changes
- **状态**: OPEN
- **为什么重要**: 运行时生态兼容性直接影响 dbt 在现代 Python 环境中的可用性。3.14 支持意味着序列化依赖、类型系统和配置模型都可能需要联动升级。
- **社区反应**: 评论 11、👍 35，属于“技术性强但影响面广”的议题。
- **观察**: 这类问题通常会牵动 CI、依赖锁定、适配器生态以及文档支持节奏。

### 3) 模型 freshness 检查进入 Epic 讨论
- **Issue**: [#12719](https://github.com/dbt-labs/dbt-core/issues/12719)
- **标题**: [EPIC] Model freshness checks
- **状态**: OPEN
- **为什么重要**: dbt 目前长期支持 source freshness，而 model freshness 将把“新鲜度治理”从外部数据源扩展到 dbt 自身产出的模型层，是 observability/质量保障能力的重要延伸。
- **社区反应**: 刚创建不久，评论 5，仍处于设计讨论期。
- **观察**: 这是未来产品能力演进的重要方向，可能影响 metadata、artifacts、调度集成及告警机制。

### 4) `dataset` 配置告警问题已关闭，1.11.latest 回补中
- **Issue**: [#12327](https://github.com/dbt-labs/dbt-core/issues/12327)
- **标题**: Warning about `dataset` that should be under config for sources
- **状态**: CLOSED
- **为什么重要**: 这是一个典型的 schema/配置校验回归问题，影响 BigQuery 等场景的用户体验，会导致用户收到误导性 warning。
- **社区反应**: 评论 13、👍 5，热度不算高，但对实际使用体验影响直接。
- **观察**: 关联 backport 标签，说明维护团队已将其视为稳定分支需要快速修复的问题。

### 5) 希望从项目根目录 `.env` 自动加载环境变量
- **Issue**: [#12106](https://github.com/dbt-labs/dbt-core/issues/12106)
- **标题**: dbt should load env vars from root `.env` file
- **状态**: CLOSED
- **为什么重要**: 环境变量加载是本地开发、容器化和 CI 环境中极常见的诉求。若原生支持 `.env`，会降低配置门槛。
- **社区反应**: 评论 4。
- **观察**: 虽然已关闭，但它反映了用户持续期待更“开箱即用”的工程体验。

### 6) `state:modified` 未识别 function 资源 YAML 属性变更
- **Issue**: [#12547](https://github.com/dbt-labs/dbt-core/issues/12547)
- **标题**: state:modified does not detect changes to function properties (.yml) for resource_type:function
- **状态**: CLOSED
- **为什么重要**: `state:modified` 是增量开发、CI 选择性执行的重要基础能力。如果函数资源的 YAML 变更无法被识别，会直接影响构建正确性。
- **社区反应**: 评论 3、👍 4。
- **观察**: 这一问题与近期多个“状态比较准确性”相关 PR 形成呼应，说明 state diff 仍是活跃优化区。

### 7) YAML snapshots 缺少必要字段时出现冗长堆栈
- **Issue**: [#12692](https://github.com/dbt-labs/dbt-core/issues/12692)
- **标题**: Nasty stacktrace when YAML snapshots are missing `strategy` and/or `unique_key`
- **状态**: CLOSED
- **为什么重要**: 这是典型的错误处理体验问题。用户真正需要的是可执行的校验提示，而不是 Python stacktrace。
- **社区反应**: 评论 0，但修复推进非常快。
- **观察**: 该问题很快被对应 PR 修复，说明团队对 CLI 错误可读性有明确优先级。

### 8) 版本治理与兼容性问题仍是长期主线
- **关联 Issue**: [#7442](https://github.com/dbt-labs/dbt-core/issues/7442), [#12098](https://github.com/dbt-labs/dbt-core/issues/12098)
- **为什么重要**: 一个面向模型语义兼容，一个面向 Python 运行时兼容，二者共同表明 dbt-core 正同时面对“数据契约演进”和“基础依赖升级”两类长期挑战。
- **社区反应**: 两者均有较高关注度。
- **观察**: 对平台型项目而言，这类议题通常决定未来 1-2 个版本周期的技术路线。

### 9) 新鲜度能力从 source 扩展到 model，预示质量治理边界扩张
- **关联 Issue**: [#12719](https://github.com/dbt-labs/dbt-core/issues/12719)
- **为什么重要**: 这不仅是一个功能请求，更可能改变团队如何定义 SLA、监控 DAG 产物，以及如何将 dbt 结果接入平台治理。
- **社区反应**: 目前讨论量不大，但战略意义明显。
- **观察**: 一旦落地，预计会带动 artifacts、selector、文档和告警生态的一轮扩展。

### 10) 配置校验与 deprecation 反馈仍需持续打磨
- **关联 Issue**: [#12327](https://github.com/dbt-labs/dbt-core/issues/12327), [#12547](https://github.com/dbt-labs/dbt-core/issues/12547), [#12692](https://github.com/dbt-labs/dbt-core/issues/12692)
- **为什么重要**: 尽管这些单点问题已关闭，但它们共同暴露出：配置 schema、状态变更检测与错误消息一致性，仍是 dbt-core 在大规模使用中的主要摩擦源。
- **社区反应**: 多数问题都被快速修复或回补。
- **观察**: 这是维护质量提升的积极信号，也反映出 1.11 线上的稳定性治理正在加速。

---

## 4. 重要 PR 进展

### 1) 修复大小写差异导致的 `AmbiguousCatalogMatchError` 误报
- **PR**: [#12644](https://github.com/dbt-labs/dbt-core/pull/12644)
- **状态**: OPEN
- **内容**: 避免仅因 catalog 标识符大小写差异而触发误判。
- **意义**: 针对跨数据库/适配器大小写语义差异，这类修复能显著减少误报，提升 catalog 匹配稳定性。

### 2) 快照 YAML 校验失败时不再打印冗长堆栈
- **PR**: [#12700](https://github.com/dbt-labs/dbt-core/pull/12700)
- **状态**: CLOSED
- **内容**: 对 snapshot 缺失 `strategy` / `unique_key` 时的异常类型进行规范化处理。
- **意义**: 直接提升 CLI 可用性，用户能更快定位配置错误。
- **关联**: 修复 [Issue #12692](https://github.com/dbt-labs/dbt-core/issues/12692)

### 3) 将 Python 原生异常逐步替换为 `DbtException` 子类
- **PR**: [#12686](https://github.com/dbt-labs/dbt-core/pull/12686)
- **状态**: CLOSED
- **内容**: 第一阶段异常体系重构。
- **意义**: 这是错误处理基础设施层面的改造，有助于统一日志、artifact、CLI 出错体验和上层集成行为。

### 4) 为 `dbt list` 增加 `--output verbose` 原型
- **PR**: [#12752](https://github.com/dbt-labs/dbt-core/pull/12752)
- **状态**: OPEN
- **内容**: 尝试为 `dbt list` 提供更丰富的输出模式。
- **意义**: 对调试 selector、理解节点元数据、构建脚本工具链都很有帮助，属于开发者体验增强。

### 5) 修复 selector 继承场景下 `exclude: test_name` 被忽略的问题
- **PR**: [#12751](https://github.com/dbt-labs/dbt-core/pull/12751)
- **状态**: OPEN
- **内容**: 修正 `method: selector` 继承时排除规则失效的问题。
- **意义**: selector 是 dbt 自动化和大型项目治理的核心能力，此修复能提升选择逻辑的一致性与可预期性。

### 6) `run-operation` 失败时将异常消息写入 `run_results.json`
- **PR**: [#12730](https://github.com/dbt-labs/dbt-core/pull/12730)
- **状态**: OPEN
- **内容**: 修复 artifact 中 `"message": null` 的问题。
- **意义**: 对编排平台、任务调度器、自动重试和失败诊断非常关键，减少对日志文本解析的依赖。

### 7) 修复并发单元测试的临时表命名冲突
- **PR**: [#12701](https://github.com/dbt-labs/dbt-core/pull/12701)
- **状态**: OPEN
- **内容**: 在 unit test alias 中包含 model 名称，避免同名测试在多线程下冲突。
- **意义**: 直接改善并发测试稳定性，尤其适合大型项目与 CI 场景。

### 8) 将 Snowplow telemetry 超时从 5 秒降到 1 秒
- **PR**: [#12741](https://github.com/dbt-labs/dbt-core/pull/12741)
- **状态**: OPEN
- **内容**: 减少不可达 telemetry collector 对命令结束阶段的阻塞。
- **意义**: 这是典型的“尾延迟优化”。对网络环境受限、离线或企业内网用户尤其友好。

### 9) 规范 `FileHash` 行尾处理，避免跨平台 `state:modified` 误报
- **PR**: [#12731](https://github.com/dbt-labs/dbt-core/pull/12731)
- **状态**: OPEN
- **内容**: 统一 CRLF/LF 差异对哈希结果的影响。
- **意义**: 这是非常重要的跨平台稳定性修复。Windows 本地开发 + Linux CI/Cloud 的混合环境会直接受益。

### 10) 修复 `dbt deps` 在只读目录或特殊 git 配置下的脆弱性
- **PR 1**: [#12729](https://github.com/dbt-labs/dbt-core/pull/12729)  
  **内容**: 处理写入 `package-lock.yml` 时的 `PermissionError`
- **PR 2**: [#12728](https://github.com/dbt-labs/dbt-core/pull/12728)  
  **内容**: 使用 `git tag --no-column` 避免 columnar git 输出破坏解析
- **意义**: 两个修复都很“工程化”，但对容器环境、企业开发机、受限权限目录中的稳定运行非常关键。

> 补充值得关注：
- [#12749](https://github.com/dbt-labs/dbt-core/pull/12749)：为 microbatch incremental strategy 增加 `week` 粒度
- [#12747](https://github.com/dbt-labs/dbt-core/pull/12747)：新增 catalog tracking
- [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)：改进相似数据库标识符错误信息，正确反映节点类型
- [#12746](https://github.com/dbt-labs/dbt-core/pull/12746)：修复 aliases 在 jsonschema 校验中的前缀判断，并已进入 backport 流程

---

## 5. 功能需求趋势

### 1) 模型治理与语义稳定性
代表议题：[#7442](https://github.com/dbt-labs/dbt-core/issues/7442), [#12719](https://github.com/dbt-labs/dbt-core/issues/12719)  
社区正在从“能构建模型”转向“如何长期稳定发布模型”。版本化模型的无后缀入口、模型 freshness 检查，都说明用户越来越关注 **数据产品接口稳定性** 与 **SLA 可观测性**。

### 2) 状态比较与选择器准确性
代表议题/PR：[#12547](https://github.com/dbt-labs/dbt-core/issues/12547), [#12731](https://github.com/dbt-labs/dbt-core/pull/12731), [#12751](https://github.com/dbt-labs/dbt-core/pull/12751)  
`state:modified`、selector inheritance、排除规则等持续被修复，表明大型项目越来越依赖 **增量选择执行** 来控制 CI/CD 成本，选择错误会直接影响构建正确性与效率。

### 3) 错误处理和 CLI 体验
代表议题/PR：[#12692](https://github.com/dbt-labs/dbt-core/issues/12692), [#12700](https://github.com/dbt-labs/dbt-core/pull/12700), [#12686](https://github.com/dbt-labs/dbt-core/pull/12686), [#12752](https://github.com/dbt-labs/dbt-core/pull/12752)  
社区明显希望 dbt 提供更清晰的错误信息、更结构化的异常体系，以及更有用的命令输出。这是平台成熟度的重要信号。

### 4) 运行环境兼容性与工程健壮性
代表议题/PR：[#12098](https://github.com/dbt-labs/dbt-core/issues/12098), [#12729](https://github.com/dbt-labs/dbt-core/pull/12729), [#12728](https://github.com/dbt-labs/dbt-core/pull/12728), [#12741](https://github.com/dbt-labs/dbt-core/pull/12741)  
兼容 Python 新版本、处理权限受限目录、兼容 git 本地配置、减少 telemetry 阻塞，这些都说明 dbt-core 正在持续补齐 **真实生产环境中的边缘条件**。

### 5) 元数据与可观测性
代表 PR：[#12747](https://github.com/dbt-labs/dbt-core/pull/12747), [#12730](https://github.com/dbt-labs/dbt-core/pull/12730)  
一方面是 run_results 中记录更完整的失败信息，另一方面是 catalog tracking 的引入，说明 artifacts 与 telemetry 的结构化增强正在推进，方便平台侧接入与分析。

---

## 6. 开发者关注点

### 1) “不要误报，也不要漏报”
开发者当前非常关注两类问题：  
- `state:modified` 因行尾、资源类型、平台差异导致误判或漏判  
- selector/exclude 逻辑在继承与组合场景下不一致  
这说明 dbt 在复杂项目中的“选择正确节点”已经成为核心基础能力。

### 2) 错误信息必须可执行
多个问题都指向同一痛点：用户遇到错误时，需要的是 **准确、简短、可行动** 的提示，而不是内部异常堆栈。  
相关修复正在推动异常体系统一化，这对 CLI 用户、平台集成方和初级开发者都非常重要。

### 3) 容器化/CI 环境是高频使用场景
只读目录权限、跨平台换行符、线程并发临时表冲突、git 输出格式差异，这些都不是“教学示例”中的问题，而是典型的企业工程环境问题。  
说明 dbt-core 社区的主力用户已高度工程化，对稳定性要求越来越高。

### 4) 需要更强的 artifacts 与机器可读输出
`run_results.json` 缺少失败 message、`dbt list` 希望有 verbose 输出，这些反馈都在表明：  
开发者不只把 dbt 当命令行工具，也把它当作 **可被编排系统、平台工具和自动化流程消费的引擎**。

### 5) 质量治理边界正在前移
从 source freshness 到 model freshness，从 catalog tracking 到模型版本无后缀映射，社区需求显示：  
dbt 正被越来越多团队当作 **数据产品发布与治理层**，而不只是 SQL 转译/执行工具。

---

如果你愿意，我还可以继续输出一版更适合内部分享的 **“管理层摘要版”**，或一版更偏工程细节的 **“研发跟进清单版”**。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，Spark 社区没有新版本发布，但 SQL 语义扩展、DSv2 能力增强、Python/Arrow 序列化优化，以及基础设施安全加固相关 PR 非常活跃。  
Issue 侧则集中暴露出三类问题：平台兼容性（Ubuntu 25.10、Apple Silicon）、AQE/缓存协同优化不足，以及文档与错误诊断体验仍有改进空间。  
整体看，社区当前主线仍围绕 **Spark SQL 演进、执行优化、Python 生态完善、以及运行时安全与稳定性** 展开。

---

## 3. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 共 7 条。以下按“值得关注程度”全部纳入分析，并补充说明其重要性与社区反馈情况。

### 1) spark-connect-common 模块编译错误已关闭
- **Issue**: #55082 [CLOSED] 4.1.1 spark-connect-common module compile error  
- **链接**: https://github.com/apache/spark/issues/55082
- **重要性**: 这是一个直接影响 Spark Connect 相关模块构建的问题。Spark Connect 是近几个版本的重点方向，任何构建链路问题都会影响二次开发、定制发行版和 CI 稳定性。
- **社区反应**: 4 条评论，已关闭，说明问题已获得响应并大概率给出了解法或澄清。虽然热度不高，但对使用 Spark Connect 源码构建的开发者很关键。
- **关注点**: protobuf/class 生成链路、模块依赖完整性、4.1.1 构建体验。

### 2) PySpark 聚合函数返回类型文档缺失
- **Issue**: #54986 [OPEN] [DOCS] Document return types for aggregate functions (stddev, variance, etc.)  
- **链接**: https://github.com/apache/spark/issues/54986
- **重要性**: 这是典型的“文档小问题、工程大影响”。聚合函数返回类型不清晰，会影响 schema 推断、类型兼容、UDF/下游系统集成和数据质量校验。
- **社区反应**: 4 条评论，说明已有一定讨论。问题直指 `stddev`、`variance` 等常见函数的返回类型说明缺失，涉及 PySpark API 易用性。
- **为什么值得关注**: 对数据平台团队而言，文档不精确会直接增加测试成本和线上类型不一致风险。

### 3) Ubuntu 25.10 下 /tmp 访问异常
- **Issue**: #55096 [OPEN] Ubuntu 25.10 - access denied to /tmp even in 777 mode without protected mode  
- **链接**: https://github.com/apache/spark/issues/55096
- **重要性**: 这类问题直接影响 Spark 在新 OS 版本上的可运行性，尤其是临时目录、shuffle spill、本地缓存、事件日志等都可能依赖 `/tmp` 或临时文件机制。
- **社区反应**: 暂无评论，仍处于问题暴露初期。
- **为什么值得关注**: 新操作系统行为变化往往会引发一批部署层兼容问题，平台团队需要提前评估镜像与运行参数。

### 4) AQE 对 TableCacheQueryStageExec 场景未生效
- **Issue**: #55094 [OPEN] AQE does not apply optimizations for queries involving TableCacheQueryStageExec  
- **链接**: https://github.com/apache/spark/issues/55094
- **重要性**: 这是今天最值得关注的执行引擎类问题之一。它指出在 `CACHE TABLE` 包含 `ShuffleExchange` 的场景下，AQE 无法执行 `CoalesceShufflePartitions`，意味着缓存构建过程可能保留过多小分区，影响资源效率。
- **社区反应**: 暂无评论，但问题描述完整，具备较强复现价值。
- **为什么值得关注**: 该问题直连 **缓存、AQE、Shuffle 分区合并** 三个核心主题，对数仓 ETL、BI 加速和交互式分析都有潜在性能影响。

### 5) Apple Silicon 上单测因 LevelDB native 库失败
- **Issue**: #55093 [OPEN] UT fails with UnsatisfiedLinkError on Apple Silicon  
- **链接**: https://github.com/apache/spark/issues/55093
- **重要性**: Apple Silicon 已成为开发者常见环境。单元测试依赖本地 native 库失败，说明 Spark 在 ARM/macOS 本地开发体验仍存在短板。
- **社区反应**: 暂无评论。
- **为什么值得关注**: 这不仅影响贡献者本地开发，也反映出 Spark 某些历史依赖（如 LevelDB 相关 native binding）在新架构上的维护成本。

### 6) Spark CBO 对列式算子的代价建模不足
- **Issue**: #55058 [OPEN] Spark CBO considers columnar operator by generic interface  
- **链接**: https://github.com/apache/spark/issues/55058
- **重要性**: 这是一个很有代表性的优化器能力诉求。当前 CBO 若不能正确建模列式执行收益与 Row/Columnar 转换成本，可能做出次优执行计划。
- **社区反应**: 暂无评论，但议题技术含量高，明显面向优化器/执行引擎贡献者。
- **为什么值得关注**: 随着向量化、Arrow、原生列式引擎协同越来越重要，Spark 优化器是否“真正理解列式执行成本”会成为长期方向。

### 7) Shuffle 连接超时后 Executor 未失败
- **Issue**: #55092 [OPEN] Why didn't the Executor fail after the Shuffle connection timeout?  
- **链接**: https://github.com/apache/spark/issues/55092
- **重要性**: 这是运维和稳定性视角下的关键问题。用户观察到 shuffle 已重试三次，但 Executor 仍长时间保持 running 状态，说明失败语义、超时处理或线程清理可能不符合预期。
- **社区反应**: 暂无评论。
- **为什么值得关注**: 这类问题通常会导致作业“假活跃”、资源占用异常、故障恢复缓慢，是生产环境排障中的高频痛点。

### 8) 文档精确性问题值得持续跟进
- **Issue**: #54986 [OPEN] [DOCS] Document return types for aggregate functions (stddev, variance, etc.)  
- **链接**: https://github.com/apache/spark/issues/54986
- **补充点评**: 虽然已在上文列出，但从社区建设角度，这一类文档问题很值得持续关注。Spark 功能复杂，API 文档精确性对降低用户支持成本的价值很高。

### 9) 新平台适配风险正在前置暴露
- **Issue**: #55096 [OPEN] Ubuntu 25.10 - access denied to /tmp even in 777 mode without protected mode  
- **链接**: https://github.com/apache/spark/issues/55096
- **补充点评**: 该问题代表的不仅是 Ubuntu 25.10，而是 Spark 对新内核/新发行版安全策略变化的适配挑战。建议发行版维护者与平台团队关注。

### 10) 执行引擎问题继续集中在 AQE、Shuffle 与 Columnar
- **Issue 组合观察**: #55094 / #55058 / #55092  
- **链接**:  
  - https://github.com/apache/spark/issues/55094  
  - https://github.com/apache/spark/issues/55058  
  - https://github.com/apache/spark/issues/55092
- **补充点评**: 这三条 Issue 共同反映出当前 Spark 社区在执行层最受关注的方向：**AQE 生效边界、CBO/列式代价模型、Shuffle 失败行为**。这也是数据基础设施团队最敏感的性能与稳定性核心区。

---

## 4. 重要 PR 进展

> 说明：以下从近 24 小时更新的 PR 中，挑选 10 个对 SQL、执行优化、Python 生态、安全和基础设施较重要的变更。

### 1) 新增 `INSERT INTO ... REPLACE ON/USING` SQL 语法
- **PR**: #54722 [OPEN] [SPARK-56001][SQL] Add INSERT INTO ... REPLACE ON/USING syntax  
- **链接**: https://github.com/apache/spark/pull/54722
- **内容**: 为 `INSERT` 扩展 `REPLACE ON <condition>` 与 `REPLACE USING (<columns>)` 语法。
- **意义**: 这是 SQL DML 语义的重要增强，向更灵活的按条件替换/按键替换靠拢，有利于湖仓写入、增量修正和类 upsert 场景。

### 2) 简化 `DataSourceV2ScanRelation` 字段提取
- **PR**: #55070 [OPEN] [SPARK-56273][SQL] Simplify extracting fields from DataSourceV2ScanRelation  
- **链接**: https://github.com/apache/spark/pull/55070
- **内容**: 降低模式匹配对 case class 构造参数个数的耦合。
- **意义**: 虽然属于代码整理，但对 DSv2 演进很重要。它提升了代码可维护性，减少未来演进时的大面积匹配点破坏。

### 3) 修复 `NettyStreamManager.openStream` 路径穿越风险
- **PR**: #55077 [OPEN] Fix path traversal in NettyStreamManager.openStream  
- **链接**: https://github.com/apache/spark/pull/55077
- **内容**: 对目录流式读取分支增加路径规范化与目录边界校验。
- **意义**: 这是今天最重要的安全类 PR 之一。路径穿越属于高敏感问题，若修复合入，将提升 Spark 网络传输层的默认安全性。

### 4) PySpark 重新启用 `predict_batch_udf` 的缓存测试
- **PR**: #55104 [OPEN] [SPARK-49793][PYTHON][TESTS] Reenable test_caching for predict_batch_udf  
- **链接**: https://github.com/apache/spark/pull/55104
- **内容**: 恢复相关测试覆盖。
- **意义**: 说明 `predict_batch_udf` 这一 AI/批预测相关能力正在继续稳定化。测试回归通常意味着相关行为逐渐可控，利好 ML 推理链路。

### 5) 新增 `SHOW COLLATIONS` 命令
- **PR**: #55099 [OPEN] [SPARK-49543][SQL] Add SHOW COLLATIONS command  
- **链接**: https://github.com/apache/spark/pull/55099
- **内容**: 为 SQL 增加排序规则/字符比较规则可视化命令。
- **意义**: 这是 Spark SQL 国际化与字符串语义治理的重要配套功能，对多语言数据处理、排序与比较一致性具有价值。

### 6) 将 Java 侧错误类引入 Python 侧
- **PR**: #55100 [OPEN] [SPARK-56295][PYTHON] Add Java error classes to Python side  
- **链接**: https://github.com/apache/spark/pull/55100
- **内容**: 将 Java 端错误类映射补充到 Python 端。
- **意义**: 有助于 PySpark 的异常分类、错误可读性与跨语言一致性，直接改善开发者排障体验。

### 7) `createTableLike` 传递更完整的 `TableInfo`
- **PR**: #55101 [OPEN] [SPARK-56296][SQL] Pivot createTableLike to pass full TableInfo including schema, partitioning, constraints, and owner  
- **链接**: https://github.com/apache/spark/pull/55101
- **内容**: 在 `CREATE TABLE LIKE` 相关逻辑中传递完整表信息，包括 schema、分区、约束、owner 等。
- **意义**: 这是元数据语义完善的重要一步，有助于 DSv2/catalog 体系中表克隆、模板化建表和治理一致性。

### 8) 默认启用 `spark.master.rest.virtualThread.enabled`
- **PR**: #55102 [OPEN] [SPARK-56298] Enable `spark.master.rest.virtualThread.enabled` by default  
- **链接**: https://github.com/apache/spark/pull/55102
- **内容**: 将该配置默认值从 `false` 改为 `true`。
- **意义**: 反映 Spark 正在更积极利用 Java 21+ 虚拟线程能力，优化 Master REST 处理并发模型。这是运行时现代化的一个信号。

### 9) CI 中第三方 GitHub Actions 固定到 commit SHA
- **PR**: #55066 [OPEN] [SPARK-56260][INFRA] Pin third-party GitHub Actions to commit SHA  
- **链接**: https://github.com/apache/spark/pull/55066
- **内容**: 将 CI workflow 中第三方 Action 从浮动 tag 改为固定 SHA。
- **意义**: 这是供应链安全与 CI 可复现性的标准实践，能降低外部依赖变更带来的不可控风险。

### 10) 改进复杂 Join 表达式上的约束推导
- **PR**: #55045 [OPEN] [SPARK-53996][SQL] Improve InferFiltersFromConstraints to infer filters from complex join expressions  
- **链接**: https://github.com/apache/spark/pull/55045
- **内容**: 强化 `InferFiltersFromConstraints` 规则，从更复杂的 join 条件中推导过滤条件。
- **意义**: 属于典型的 Catalyst 优化增强。若合入，将帮助 Spark 在更多查询中提前下推过滤、减少扫描与中间数据量。

---

## 5. 功能需求趋势

基于今日 Issues 与活跃 PR，可以提炼出以下社区关注方向：

### 1) 查询优化仍是核心主线
- AQE 在缓存查询中的优化缺失（#55094）
- CBO 对列式算子的成本模型不足（#55058）
- 复杂 Join 条件下的约束推导增强（PR #55045）
- `KeyedPartitioning` 的 `outputOrdering` 推导（PR #55036，见列表）
  
**趋势判断**: Spark 社区正在从“有优化”走向“优化适用边界更完整、对列式执行更敏感”。

### 2) Spark SQL / Catalog / DSv2 能力持续扩张
- `INSERT INTO ... REPLACE ON/USING`（PR #54722）
- `SHOW COLLATIONS`（PR #55099）
- v2 `DESCRIBE TABLE .. PARTITION`（PR #55064）
- `createTableLike` 传递完整 `TableInfo`（PR #55101）
- `DataSourceV2ScanRelation` 抽象整理（PR #55070）

**趋势判断**: Spark SQL 正继续向更成熟的数据平台语义发展，尤其是 Catalog、DDL/DML 完整性与 DSv2 生态统一。

### 3) Python 与 Arrow 生态仍在快速打磨
- Java error classes 同步到 Python（PR #55100）
- `predict_batch_udf` 测试恢复（PR #55104）
- Arrow Group/CoGroup 序列化器重构（PR #55026）
- Arrow UDF 窗口聚合微基准（PR #55056）
- Python stateful processor 序列化优化（PR #55039）

**趋势判断**: PySpark 不再只是 API 封装层，社区正在强化其性能、错误模型和 ML/Arrow 集成能力。

### 4) 安全与基础设施治理重要性提升
- 路径穿越修复（PR #55077）
- GitHub Actions 固定 SHA（PR #55066）
- RocksDB checkpoint zip 读取校验（PR #54493）

**趋势判断**: 社区明显加强了供应链安全、文件校验、网络传输边界等“基础设施级安全能力”。

### 5) 多平台兼容性成为持续痛点
- Ubuntu 25.10 `/tmp` 权限异常（#55096）
- Apple Silicon native 测试失败（#55093）
- Java 21 虚拟线程默认启用（PR #55102）

**趋势判断**: Spark 需要同时适配新 OS、新 CPU 架构和新 JVM 特性，兼容性验证压力持续上升。

---

## 6. 开发者关注点

### 1) 本地开发与 CI 可用性
开发者仍频繁遇到“源码可读但构建/测试不顺”的问题，包括：
- Spark Connect 模块编译依赖不清晰（#55082）
- Apple Silicon 下 native 库测试失败（#55093）
- CI 供应链依赖需要更强确定性（PR #55066）

**结论**: 对贡献者最关键的不是新功能本身，而是“能否稳定构建、稳定跑测试”。

### 2) 查询性能优化的“边界案例”很多
AQE、缓存、Shuffle、列式执行之间的组合场景仍有不少盲区：
- `CACHE TABLE` 与 AQE 协同不完整（#55094）
- 列式算子成本建模不充分（#55058）
- Shuffle 超时后的 Executor 生命周期不透明（#55092）

**结论**: Spark 的优化器和执行器已经很强，但复杂交互场景仍是社区修补重点。

### 3) PySpark 用户需要更好的错误信息与文档
- 聚合函数返回类型文档不清（#54986）
- Java 错误类向 Python 侧补齐（PR #55100）

**结论**: 开发者希望 PySpark 在“可解释性”和“诊断一致性”上进一步接近 Scala/Java 体验。

### 4) 新平台适配需要更前置
- Ubuntu 25.10 新行为导致 `/tmp` 访问异常（#55096）
- Apple Silicon 仍有 native 依赖兼容问题（#55093）

**结论**: 对企业平台团队来说，升级 OS/JDK/硬件架构前做 Spark 兼容验证已是必选项。

---

## 附：今日重点链接汇总

### Issues
- #55082 https://github.com/apache/spark/issues/55082
- #54986 https://github.com/apache/spark/issues/54986
- #55096 https://github.com/apache/spark/issues/55096
- #55094 https://github.com/apache/spark/issues/55094
- #55093 https://github.com/apache/spark/issues/55093
- #55058 https://github.com/apache/spark/issues/55058
- #55092 https://github.com/apache/spark/issues/55092

### PRs
- #54722 https://github.com/apache/spark/pull/54722
- #55070 https://github.com/apache/spark/pull/55070
- #55077 https://github.com/apache/spark/pull/55077
- #55104 https://github.com/apache/spark/pull/55104
- #55099 https://github.com/apache/spark/pull/55099
- #55100 https://github.com/apache/spark/pull/55100
- #55101 https://github.com/apache/spark/pull/55101
- #55102 https://github.com/apache/spark/pull/55102
- #55066 https://github.com/apache/spark/pull/55066
- #55045 https://github.com/apache/spark/pull/55045

如果你愿意，我也可以把这份日报进一步整理成：
1. **适合公众号/邮件发送的简版**，或  
2. **适合研发周会汇报的要点版（按 SQL / Python / Infra 分类）**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新的 Release，也没有新的 Issue 更新；社区讨论重心几乎全部集中在 **PR 合并与规范演进** 上。  
今天最值得关注的信号是：一批带有 **PMC Ready** 标记的 PR 正在推进，其中既包括 **破坏性变更清理**，也包括 **类型系统扩展、执行上下文变量补齐以及统计函数能力增强**，说明项目正处于从“兼容旧设计”向“收敛规范、强化语义一致性”过渡的关键阶段。

---

## 4. 重要 PR 进展

> 说明：过去 24 小时内仅有 6 个 PR 更新，以下按重要性逐条解读。

### 1) PR #994 - 移除已弃用的 `time` / `timestamp` / `timestamp_tz` 类型
- 状态：OPEN
- 重要性：极高（Breaking Change）
- 内容概述：该 PR 计划彻底移除已弃用的时间相关类型，影响范围覆盖：
  - proto files
  - dialect schema
  - extension yamls
  - ANTLR grammar
  - test cases
  - coverage python code
  - documentation
- 为什么重要：
  - 这是典型的 **规范收敛** 动作，意味着 Substrait 正在减少历史包袱，避免新旧语义并存带来的实现歧义。
  - 对各类引擎适配器、计划生成器、校验器和测试基线都有直接影响。
- 对开发者的意义：
  - 如果你维护的是 Substrait producer/consumer，需要尽快检查是否仍引用这些旧类型。
  - 对生态库而言，这类变更通常意味着一次协议兼容性升级窗口。
- 链接：<https://github.com/substrait-io/substrait/pull/994>

### 2) PR #1002 - 移除已弃用的 `Aggregate.Grouping.grouping_expressions`
- 状态：OPEN
- 重要性：极高（Breaking Change）
- 内容概述：删除 `Aggregate.Grouping.grouping_expressions` 字段，正式转向此前已引入的 `expression_references`。
- 为什么重要：
  - 这直接关系到 **聚合计划表示的标准写法**。
  - 对执行计划序列化、反序列化以及跨引擎交换兼容性影响明显。
- 对开发者的意义：
  - 使用旧字段的系统需要完成迁移，否则未来可能无法通过新的 schema/validator。
  - 对 parser、planner、生成代码和兼容性测试都需要同步更新。
- 链接：<https://github.com/substrait-io/substrait/pull/1002>

### 3) PR #953 - 扩展类型：新增无符号整数类型 `u8/u16/u32/u64`
- 状态：OPEN
- 重要性：高
- 内容概述：新增一组一等公民扩展类型及其算术函数支持，并附带测试覆盖。
- 为什么重要：
  - 这是对 **类型系统表达能力** 的直接增强。
  - 对接 Arrow、Velox、Rust/系统语言生态、部分 OLAP 引擎时，无符号整型是高频需求。
- 对开发者的意义：
  - 有助于减少不同系统在数值边界、溢出语义、类型映射上的适配成本。
  - 若落地，Substrait 在表达底层执行引擎类型细节上会更完整。
- 链接：<https://github.com/substrait-io/substrait/pull/953>

### 4) PR #1012 - `std_dev` / `variance` 支持整数参数
- 状态：OPEN
- 重要性：高
- 内容概述：为标准差与方差函数增加整数参数支持，并补充相关测试。
- 为什么重要：
  - 这是典型的 **函数签名完善** 工作。
  - 对分析型查询非常关键，因为统计聚合往往直接应用在整数列上。
- 对开发者的意义：
  - 可减少 producer 在生成计划前做显式 cast 的负担。
  - 提升不同执行引擎对统计函数行为的一致性。
- 链接：<https://github.com/substrait-io/substrait/pull/1012>

### 5) PR #945 - 新增执行上下文变量：`current_date` / `current_timestamp` / `current_timezone`
- 状态：CLOSED
- 重要性：高
- 内容概述：补充 3 个执行上下文变量，用于表达“当前日期 / 当前时间戳 / 当前时区”。
- 为什么重要：
  - 这是对 SQL 常见语义的关键补齐。
  - 对 BI、报表、审计、分区裁剪及时间上下文相关表达式都很实用。
- 对开发者的意义：
  - 使 Substrait 能更自然地映射 `CURRENT_DATE`、`CURRENT_TIMESTAMP`、`CURRENT_TIMEZONE` 一类语法。
  - 也提示实现方需要明确“执行时求值”与“计划生成时常量折叠”的边界。
- 链接：<https://github.com/substrait-io/substrait/pull/945>

### 6) PR #1026 - 文档：支持的库清单 + Breaking Change 政策
- 状态：OPEN
- 重要性：中高
- 内容概述：补充支持库说明以及破坏性变更政策文档。
- 为什么重要：
  - 对开源规范项目而言，**文档治理与变更政策** 和功能本身同样关键。
  - 当项目进入一系列 API/schema 清理阶段时，明确 breaking change policy 可以降低社区不确定性。
- 对开发者的意义：
  - 有助于判断哪些实现/库处于官方支持范围内。
  - 也便于下游团队制定升级节奏和兼容策略。
- 链接：<https://github.com/substrait-io/substrait/pull/1026>

---

## 3. 社区热点 Issues

过去 24 小时内 **没有 Issue 更新**，因此今天没有新增的热点 Issue 可供筛选。  
这通常意味着当前社区工作流更偏向于：
- 通过 PR 直接推进规范修订与文档治理；
- 在已有议题基础上收敛实现，而不是开启新一轮问题讨论。

---

## 5. 功能需求趋势

基于今日活跃 PR，可以提炼出当前 Substrait 社区关注的几个方向：

### 1) 规范清理与破坏性变更落地
- 代表 PR：#994、#1002
- 趋势解读：
  - 社区正在主动清理已弃用设计，而不是长期维持兼容层。
  - 这说明项目成熟度在提升，开始强调 **语义唯一性、实现一致性、长期可维护性**。

### 2) 类型系统持续扩展
- 代表 PR：#953
- 趋势解读：
  - 对基础类型表达能力的增强仍是重点。
  - 无符号整数的引入表明社区希望 Substrait 更好承载底层执行引擎与列式内存格式的真实类型需求。

### 3) 函数签名与分析能力补齐
- 代表 PR：#1012
- 趋势解读：
  - 社区正从“先支持核心函数”走向“补齐边界输入类型与测试覆盖”。
  - 这类工作虽然不显眼，但决定了计划跨引擎执行时的实际可用性。

### 4) 上下文语义标准化
- 代表 PR：#945
- 趋势解读：
  - 与当前时间、时区相关的上下文变量被正式建模，说明 Substrait 在向更完整的 SQL 语义表达能力演进。
  - 对实时分析、跨时区执行、可重放查询等场景都有基础价值。

### 5) 项目治理与兼容政策透明化
- 代表 PR：#1026
- 趋势解读：
  - 随着 breaking change 增多，社区开始强化治理文档。
  - 这对生态协作、版本升级、依赖管理非常重要，尤其适合下游引擎团队和连接器维护者参考。

---

## 6. 开发者关注点

结合今日 PR 动向，开发者当前的高频关注点主要集中在以下几个方面：

### 1) 如何应对 Breaking Changes
- 典型表现：
  - 旧字段、旧类型被正式删除。
- 开发者痛点：
  - 需要同步更新 proto、schema、grammar、测试和文档，改动面广。
  - 下游系统往往不仅有生成端，还有消费端与回归测试链路，迁移成本较高。

### 2) 类型兼容与跨引擎映射
- 典型表现：
  - 对无符号整数等类型的支持需求上升。
- 开发者痛点：
  - 不同执行引擎、语言运行时、内存格式对类型支持不完全一致。
  - 需要一个更清晰的标准层，减少适配歧义。

### 3) 函数行为一致性与覆盖完整度
- 典型表现：
  - 为统计函数补充整数参数支持。
- 开发者痛点：
  - 看似简单的函数，在参数类型、返回类型、隐式转换和精度处理上很容易出现引擎差异。
  - 社区希望通过标准函数签名和更充分测试减少这种不一致。

### 4) 时间语义与执行上下文
- 典型表现：
  - `current_date`、`current_timestamp`、`current_timezone` 等变量建模。
- 开发者痛点：
  - 时间和时区是跨系统互操作中最容易出错的部分。
  - 需要明确这些值的求值时机、时区来源以及可移植语义。

### 5) 官方支持边界与生态预期管理
- 典型表现：
  - 文档中开始补充支持库范围与变更政策。
- 开发者痛点：
  - 下游团队需要判断哪些实现是稳定依赖，哪些仍属实验性支持。
  - 在规范快速演进期，缺少清晰政策会增加升级风险。

---

## 附：今日涉及 PR 链接汇总

- PR #945 - add current_date, current_timestamp and current_timezone variables  
  <https://github.com/substrait-io/substrait/pull/945>

- PR #953 - add unsigned integer extension types (u8, u16, u32, u64)  
  <https://github.com/substrait-io/substrait/pull/953>

- PR #994 - remove deprecated time, timestamp and timestamp_tz types  
  <https://github.com/substrait-io/substrait/pull/994>

- PR #1002 - remove deprecated Aggregate.Grouping.grouping_expressions  
  <https://github.com/substrait-io/substrait/pull/1002>

- PR #1012 - support int arguments with std_dev and variance functions  
  <https://github.com/substrait-io/substrait/pull/1012>

- PR #1026 - supported libraries + breaking change policy  
  <https://github.com/substrait-io/substrait/pull/1026>

如果你愿意，我也可以进一步把这份日报改写成：
1. **更适合公众号/周报发布的运营版**，或  
2. **更适合工程团队内部同步的表格版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*