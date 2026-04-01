# OLAP 生态索引日报 2026-04-01

> 生成时间: 2026-04-01 01:49 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

以下是基于 **2026-04-01 dbt-core、Apache Spark、Substrait** 社区动态整理的横向对比分析报告。

---

# OLAP 数据基础设施生态横向对比分析
**日期：2026-04-01**

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出三个明显特征：  
第一，社区关注点正从“功能新增”转向“语义正确性、兼容性、可维护性与可观测性”的系统性打磨。  
第二，**Python / pandas / Arrow 生态兼容**、**配置与错误处理质量**、以及**跨系统互操作标准化**，成为多个项目共同推进的重点。  
第三，dbt、Spark、Substrait 虽然分处建模编排、执行引擎、跨引擎规范三个层面，但都在朝着 **更强的生产可用性、更高的自动化适配能力、更稳定的生态接口** 演进。  
整体上看，OLAP 基础设施正在进入一个“从能力扩张走向工程成熟与生态协同”的阶段。

---

## 2. 各项目活跃度对比

| 项目 | 仓库 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 活跃焦点 |
|---|---|---:|---:|---|---|
| dbt-core | dbt-labs/dbt-core | 4 | 10 | 无新版本发布 | 配置解析、selector 继承、snapshot 配置、测试稳定性、社区治理 |
| Apache Spark | apache/spark | 6 | 10 | 无新版本发布 | PySpark/pandas/Arrow 兼容、SQL 优化、运行环境兼容、UDF 架构 |
| Substrait | substrait-io/substrait | 0 | 6 | 无新版本发布 | 类型系统、聚合函数语义、扩展引用标准化、文档治理 |

### 简要判断
- **Spark**：用户侧问题与核心开发并行，议题覆盖面最广，显示出大型基础引擎的高活跃度。
- **dbt-core**：活跃度高，且议题高度集中在开发体验、配置系统与工程治理，体现产品化项目的持续精修。
- **Substrait**：Issue 侧较安静，PR 驱动明显，更像规范型项目的“定向推进”状态。

---

## 3. 共同关注的功能方向

### 3.1 错误处理、语义一致性与可理解性提升
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：  
  - `ParsingError` 统一化（PR #12758）  
  - `packages.yml` 缺失 `version` 时改进报错（PR #12688）  
  - `null config` 容错（PR #12755）
- **Spark**：  
  - 文档补充聚合函数返回类型（Issue #54986）  
  - AQE 在缓存链路中的优化一致性问题（Issue #55094）  
  - 流式 dedupe 中 `NaN` 与 `±0.0` 语义归一化（PR #55088）
- **Substrait**：  
  - `avg(decimal)` 返回类型规则修正（PR #1027）  
  - `std_dev`/`variance` 增加整型支持（PR #1012）

**分析**：  
三个项目都在强化“行为是否可预测、语义是否一致、失败是否可解释”。这说明基础设施项目的竞争点，正在从“是否提供功能”转向“是否能稳定、明确、跨场景地工作”。

---

### 3.2 生态兼容与跨系统协同
**涉及项目：Spark、Substrait、dbt-core**

- **Spark**：  
  - pandas 3 dtype 兼容（PR #55118）  
  - pandas-on-Spark 历史行为兼容（PR #55121）  
  - Arrow-backed Python UDF 执行优化（PR #55120）
- **Substrait**：  
  - 扩展引用由路径改为 URN（PR #1028）  
  - 补充 supported libraries 与 breaking change policy（PR #1026）
- **dbt-core**：  
  - JSON schema 与 dbt-fusion 同步（PR #12759）  
  - `needs_fusion_implementation` 反映跨组件推进（PR #12687）

**分析**：  
生态协同已经成为核心主题。Spark 聚焦运行时与 Python 数据科学生态兼容，Substrait 聚焦跨引擎规范互操作，dbt-core 则聚焦核心产品与 Fusion 等关联能力的契约一致性。

---

### 3.3 面向生产环境的稳定性与工程治理
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：  
  - 集成测试超时扩展到 60 分钟（PR #12757）  
  - 社区 issue 自动加 `triage` 标签（PR #12754）  
  - catalog tracking（PR #12747）
- **Spark**：  
  - Ubuntu 25.10 `/tmp` 权限兼容问题（Issue #55096）  
  - Apple Silicon 单测失败（Issue #55093）  
  - PostgreSQL 默认 `fetchSize` 降低内存风险（PR #55053）
- **Substrait**：  
  - breaking change policy 文档建设（PR #1026）

**分析**：  
这类信号表明，社区普遍在为“真实生产使用”补课：测试基础设施、平台兼容、内存安全、变更治理、可观测性，都已成为核心工作内容。

---

### 3.4 自动化与机器可调用能力增强
**涉及项目：dbt-core、Spark**

- **dbt-core**：`dbt run-operation --inline` 提案明确指向脚本化执行、临时运维与 AI Agent 调用（Issue #12478）
- **Spark**：  
  - `spark.read.json()` 接受 DataFrame 输入（PR #55097），更适合 notebook、服务化、内存内处理  
  - UDF worker 抽象统一化（PR #55089），有利于多语言/远程执行扩展

**分析**：  
数据基础设施正逐步从“开发者手工使用工具”演化为“可被程序、平台和智能代理调用的基础服务接口”。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 当前信号 |
|---|---|---|---|---|
| dbt-core | 数据建模、转换治理、测试与配置管理 | 分析工程师、数据平台工程师、Analytics Engineering 团队 | 以 SQL/Jinja + 项目配置驱动的声明式建模与编排 | 重点打磨配置语义、错误提示、选择器正确性、治理能力向 model freshness 延展 |
| Apache Spark | 通用分布式计算、SQL 执行、流批处理、Python 数据处理 | 数据工程师、平台团队、算法/分析开发者 | 分布式执行引擎 + 多语言 API + SQL/Streaming/Connect 统一平台 | 重点强化 Python 生态兼容、SQL/Streaming 正确性、UDF 执行架构与生产适配 |
| Substrait | 跨引擎查询计划与函数语义标准 | 引擎开发者、查询优化器/执行器实现者、生态协议设计者 | 规范优先、扩展机制驱动、强调计划可交换与语义一致性 | 重点补强类型系统、函数签名、扩展标识、变更治理文档 |

### 进一步解读
- **dbt-core** 更接近“数据开发控制面”，核心价值在于把复杂数据转换工作标准化、项目化、可治理。
- **Spark** 是“数据执行底座”，承担真正的大规模计算、SQL 执行和流批一体能力。
- **Substrait** 是“生态语义层协议”，不直接做计算，而是解决不同引擎之间如何表达同一件事。

三者不是简单竞争关系，更像是 **控制面（dbt）—执行面（Spark）—协议面（Substrait）** 的分层生态。

---

## 5. 社区热度与成熟度

### 社区热度判断
1. **Spark：最高**
   - 6 个更新 Issue、10 个更新 PR
   - 问题覆盖文档、执行优化、OS 兼容、Python 生态、Connect、Streaming
   - 说明用户基数大、使用场景复杂、社区反馈面广

2. **dbt-core：高**
   - 4 个更新 Issue、10 个更新 PR
   - 虽然 Issue 总量少于 Spark，但修复闭环快，如 selector bug 当天提交当天关闭
   - 显示出维护团队响应效率高，产品治理能力强

3. **Substrait：中等偏稳**
   - 0 个更新 Issue、6 个更新 PR
   - 更像“少量核心贡献者推动规范迭代”的节奏
   - 热度不如前两者外显，但 PR 内容战略价值高

### 成熟度判断
- **Spark**：成熟度最高，但也最容易暴露复杂边界问题。其社区状态体现的是“成熟大项目的持续兼容与演进”。
- **dbt-core**：产品成熟度高，正在从功能平台转向“工程质量、治理体验、自动化接口”的精细化演进。
- **Substrait**：仍处于快速定义和收敛语义边界的阶段，属于“规范成熟度提升中”的项目，生态影响力在上升。

---

## 6. 值得关注的趋势信号

### 6.1 数据质量与治理能力正在向更细粒度扩展
- dbt-core 的 **Model Freshness** Epic 表明，治理对象正在从 source 扩展到 model 结果本身。
- 这意味着未来数据平台不仅要监控“数据来了没有”，还要监控“转换产物是否按 SLA 产出”。

**对数据工程师的参考价值**：  
应提前规划 model 级 SLA、新鲜度指标、告警接入与编排联动，而不仅限于 source freshness。

---

### 6.2 Python-first 已成为数据基础设施演进主轴之一
- Spark 今日最活跃方向几乎都围绕 pandas、Arrow、Python UDF、toPandas、JSON API 展开。
- 这反映出现代数据工程已经不只是 JVM/SQL 世界，Python 已成为一等接口层。

**对数据工程师的参考价值**：  
在技术选型和升级时，应重点关注 pandas / pyarrow / Python UDF 路径的兼容矩阵，避免版本升级引发生产行为漂移。

---

### 6.3 “语义精确性”正在替代“功能堆叠”成为社区重点
- Spark 关注 AQE、dedupe 数值归一化、返回类型文档化
- dbt-core 关注 selector 继承、配置生效边界、ParsingError
- Substrait 关注 decimal avg 返回类型、统计函数整型支持

**对数据工程师的参考价值**：  
升级基础设施时，不能只看 release feature list，更要关注语义修复与行为变更，因为它们往往直接影响结果正确性与回归稳定性。

---

### 6.4 自动化调用与 AI Agent 友好性开始进入基础设施设计
- dbt 已出现明确面向 AI Agent 的 CLI 需求
- Spark 的 API 输入形态和 UDF worker 抽象也在向更灵活、服务化方向发展

**对数据工程师的参考价值**：  
未来的数据平台接口设计，需要更多考虑：
- 命令是否可编排
- 返回是否结构化
- 错误是否机器可读
- 行为是否幂等、可自动恢复

---

### 6.5 标准化与跨引擎互操作的重要性持续上升
- Substrait 的 URN 扩展引用、类型系统扩展、breaking change policy 都在强化“协议层稳定性”
- 这与 Spark、dbt 的生态对齐趋势形成呼应

**对数据工程师的参考价值**：  
如果团队正在构建多引擎架构、Lakehouse 平台或统一语义层，应开始关注 Substrait 一类标准在计划交换、函数语义统一和引擎兼容中的潜在价值。

---

## 结论

从 2026-04-01 的社区动态看，OLAP 数据基础设施生态没有出现版本发布级“大事件”，但出现了大量更具长期意义的信号：  
**dbt-core** 在向更强治理能力和更稳健的配置/错误体验演进；  
**Spark** 在巩固其作为计算底座的同时，持续向 Python-first 与生产正确性靠拢；  
**Substrait** 则在加速打磨成为跨引擎语义交换标准所需的类型、函数和扩展治理体系。  

对技术决策者而言，这意味着未来平台能力竞争的关键，不仅在于“能否做”，更在于：  
**是否兼容、是否可治理、是否可自动化、是否能与更广泛生态稳定协同。**

如果你愿意，我可以继续把这份报告再整理成以下任一版本：
1. **适合管理层汇报的 1 页简版**
2. **适合飞书/邮件群发的 TL;DR 版**
3. **适合技术周报沉淀的 Markdown 表格版**
4. **附带“对企业数据平台的行动建议”版本**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报（2026-04-01）

> 数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

过去 24 小时内，dbt-core **没有新版本发布**，但社区在 **配置解析、选择器继承、快照配置、测试稳定性** 等方向持续活跃。  
最值得关注的变化包括：围绕 **Model Freshness** 的史诗级功能讨论持续推进、一个新的 **snapshot schema 配置缺陷** 被报告、以及 `selector` 继承时 `exclude test_name` 不生效的问题已在当天快速修复并关闭。  
此外，多项 PR 集中在 **解析错误处理、CI 超时、JSON schema 同步、catalog 追踪和社区 issue 自动标注**，显示项目当前仍在强化可用性、可维护性与工程治理。

---

## 3. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 仅有 4 条。以下按“最值得关注”原则全部列出，并结合其影响面与社区信号进行分析。

### 1) [#12719 [EPIC] Model freshness checks](https://github.com/dbt-labs/dbt-core/issues/12719)
- **状态**：OPEN  
- **标签**：enhancement, user docs, discussion, Epic, Refinement
- **为什么重要**：这是一个面向未来的数据质量能力扩展议题。dbt 过去长期支持 source freshness，而该 Epic 指向的是 **model 级新鲜度检查**，意味着 dbt 可能从“外部表新鲜度”扩展到“模型产出时效性”治理。
- **社区反应**：已有 7 条评论，说明这是一个正在被积极讨论的方向，虽然点赞数不高，但作为 Epic，其战略意义明显高于普通功能请求。
- **影响判断**：如果落地，将补齐 dbt 在 **下游模型 SLA / freshness 监控** 方面的能力，对数据平台治理、任务编排与告警体系都有直接价值。

### 2) [#12478 [Feature] `dbt run-operation --inline` for adhoc database statements](https://github.com/dbt-labs/dbt-core/issues/12478)
- **状态**：OPEN  
- **标签**：enhancement, Refinement
- **为什么重要**：该提案希望允许用户直接执行内联数据库语句，而不必先写成 macro。对于 **临时排障、脚本化运维、AI Agent 自动化调用** 都很有价值。
- **社区反应**：评论数 2，讨论仍处早期，但摘要中已经明确点出受益人群包含 **AI agents**，这说明 dbt CLI 正被重新思考为更适合自动化系统调用的接口。
- **影响判断**：这是一个典型的 **易用性/自动化增强需求**，若落地，会降低临时数据库操作门槛，并可能改变 `run-operation` 的使用边界。

### 3) [#12756 Snapshot schema from dbt_project.yml only applied when YAML config stub exists](https://github.com/dbt-labs/dbt-core/issues/12756)
- **状态**：OPEN  
- **标签**：bug, triage
- **为什么重要**：这是当天最值得关注的新 bug 之一，涉及 **snapshot 的项目级配置继承行为**。如果 `dbt_project.yml` 中的 schema 配置只有在 YAML config stub 存在时才生效，会带来明显的配置一致性问题。
- **社区反应**：刚创建即被更新，已有 1 个 👍，说明用户很快确认了问题价值。
- **影响判断**：该问题直接影响 **快照落库位置、配置可预测性、项目级默认配置语义**，对依赖 snapshot 做 SCD/审计追踪的团队尤其敏感。

### 4) [#12753 [Bug] exclude with test_name not inherited when using selector method](https://github.com/dbt-labs/dbt-core/issues/12753)
- **状态**：CLOSED  
- **标签**：bug
- **为什么重要**：问题出在 selector 继承链路中，`exclude` 配置里的 `test_name` 未被正确继承。这会影响复杂 selector 规则在测试选择上的表现。
- **社区反应**：虽然评论不多，但该问题 **当天提交、当天修复关闭**，响应速度很快，说明维护团队对 selector/selection 语义问题较为重视。
- **影响判断**：对大量依赖 selector 管理测试范围、CI 分层执行和环境差异化运行的团队来说，这类 bug 会直接影响执行结果与信任度。

---

## 4. 重要 PR 进展

> 过去 24 小时内更新的 PR 较多，以下挑选 10 个对功能、稳定性、生态治理更有代表性的条目。

### 1) [#12758 catch InvalidFieldValue and raise ParsingError during context config generation](https://github.com/dbt-labs/dbt-core/pull/12758)
- **状态**：OPEN
- **重点**：在 context config 生成阶段捕获 `InvalidFieldValue`，并统一抛出 `ParsingError`。
- **意义**：这属于典型的 **错误语义规范化**。对用户来说，错误信息会更贴近“配置解析失败”这一实际场景，降低排障成本。
- **关注点**：若合并，将改善配置问题的可诊断性，尤其适合大型项目和自动化流水线。

### 2) [#12757 bump integration test timeout to 60 minutes](https://github.com/dbt-labs/dbt-core/pull/12757)
- **状态**：OPEN
- **重点**：将集成测试超时时间提升到 60 分钟，以缓解 Windows runner 频繁超时。
- **意义**：这是 **CI 稳定性优先** 的工程措施。虽然不直接带来新功能，但对发版节奏、回归验证和跨平台稳定性影响很大。
- **关注点**：说明当前测试基础设施仍存在环境波动，短期采取“先解阻塞”的策略。

### 3) [#12754 Add community issue labeling with triage label](https://github.com/dbt-labs/dbt-core/pull/12754)
- **状态**：OPEN
- **重点**：为社区用户新开 issue 自动打上 `triage` 标签，并扩展工作流权限。
- **意义**：这是典型的 **社区治理自动化** 改进。它有助于维护者更快识别待分诊的问题，缩短处理路径。
- **关注点**：dbt-core 正在加强 issue 入口管理，对高活跃项目来说，这会提升协作效率。

### 4) [#12687 add new flag and integrate event manager's error deferral](https://github.com/dbt-labs/dbt-core/pull/12687)
- **状态**：OPEN  
- **标签**：needs_fusion_implementation
- **重点**：新增 flag，并集成 event manager 的 error deferral。
- **意义**：涉及 **事件管理和错误延迟处理机制**，可能影响日志、异常传播和执行控制策略。
- **关注点**：带有 `needs_fusion_implementation`，说明该改动可能与 dbt Fusion 侧协同相关，属于跨组件推进中的功能。

### 5) [#12751 fix: exclude test_name not inherited when using selector method](https://github.com/dbt-labs/dbt-core/pull/12751)
- **状态**：CLOSED
- **重点**：修复 selector method 继承时 `exclude test_name` 未生效的问题，对应 Issue #12753。
- **意义**：这是当天最明确、闭环最快的 bugfix 之一，直接修复 selector 继承语义异常。
- **关注点**：说明维护团队对 **选择器行为正确性** 保持较高响应速度。

### 6) [#12755 fix: handle null config in generic test builder](https://github.com/dbt-labs/dbt-core/pull/12755)
- **状态**：CLOSED
- **重点**：在 generic test builder 中处理 `null config`。
- **意义**：这是解析/构建路径中的健壮性修复，可减少边界配置下的异常。
- **关注点**：与当天的 parsing/config 相关改动一起看，表明项目正在集中修补 **配置输入容错** 问题。

### 7) [#12747 Add catalogs tracking](https://github.com/dbt-labs/dbt-core/pull/12747)
- **状态**：CLOSED
- **重点**：增加 catalog 信息追踪，包括 DAG 运行中的 catalog 数量及每个模型运行的 catalog 类型。
- **意义**：这反映出 dbt-core 在 **可观测性/遥测指标** 层面的持续扩展，有助于理解模型运行中 catalog 集成的使用情况。
- **关注点**：该 PR 还依赖其他仓库的配套变更，体现了 dbt 生态内部的联动开发。

### 8) [#12759 chore: sync JSON schemas from dbt-fusion](https://github.com/dbt-labs/dbt-core/pull/12759)
- **状态**：CLOSED
- **重点**：从 dbt-fusion 手动同步 JSON schema。
- **意义**：这是 **核心仓库与 Fusion 能力对齐** 的信号，说明 schema 契约仍在高频调整中。
- **关注点**：虽然是 chore，但对接口一致性、配置验证与下游工具兼容很关键。

### 9) [#12653 feat: support .jinja/.jinja2/.j2 extensions for docs files](https://github.com/dbt-labs/dbt-core/pull/12653)
- **状态**：CLOSED
- **重点**：为 docs 文件增加 `.jinja` / `.jinja2` / `.j2` 扩展名支持。
- **意义**：提升 IDE/编辑器友好性，降低文档模板化场景下的摩擦。
- **关注点**：这是一个小而实用的改进，体现社区对 **开发体验（DX）** 的持续推动。

### 10) [#12688 Fix: improve error message when version key is missing from packages.yml](https://github.com/dbt-labs/dbt-core/pull/12688)
- **状态**：CLOSED
- **重点**：当 `packages.yml` 缺少 `version` 字段时，避免抛出原始 `KeyError`，改为更友好的错误提示。
- **意义**：这是非常典型的 **用户错误反馈质量** 改进，对新手和自动化工具都更友好。
- **关注点**：与 #12758 一样，反映 dbt-core 正持续改善“报错是否可理解”这一开发者体验核心问题。

---

## 5. 功能需求趋势

结合当天更新的 Issues 与 PR，可以看到社区关注点主要集中在以下几个方向：

### 1) 数据新鲜度治理能力在向模型层延展
- 代表议题：[#12719](https://github.com/dbt-labs/dbt-core/issues/12719)
- **趋势解读**：dbt 已不满足于 source freshness，社区开始关注 **模型结果本身的 freshness/SLA**。这意味着数据质量治理正在从“原始输入”延展到“转换产物”。

### 2) CLI 与自动化接口能力增强
- 代表议题：[#12478](https://github.com/dbt-labs/dbt-core/issues/12478)
- **趋势解读**：`run-operation --inline` 这类需求说明用户希望 dbt 更适合 **脚本化执行、临时运维、AI Agent 驱动调用**。dbt 正逐渐被期待成为一个更灵活的数据操作入口。

### 3) 配置解析与错误提示持续强化
- 代表 PR：[#12758](https://github.com/dbt-labs/dbt-core/pull/12758)、[#12688](https://github.com/dbt-labs/dbt-core/pull/12688)、[#12755](https://github.com/dbt-labs/dbt-core/pull/12755)
- **趋势解读**：大量改动聚焦在配置值校验、空配置容错、错误类型规范化，表明用户对 **“可理解的失败”** 有很强需求。

### 4) 选择器与执行语义的准确性仍是重点
- 代表 Issue/PR：[#12753](https://github.com/dbt-labs/dbt-core/issues/12753)、[#12751](https://github.com/dbt-labs/dbt-core/pull/12751)
- **趋势解读**：selector 是大型 dbt 项目的关键控制面。任何继承、包含、排除规则异常都会影响测试和发布流程，因此这一领域对正确性要求极高。

### 5) 工程基础设施与跨仓协同持续演进
- 代表 PR：[#12757](https://github.com/dbt-labs/dbt-core/pull/12757)、[#12759](https://github.com/dbt-labs/dbt-core/pull/12759)、[#12747](https://github.com/dbt-labs/dbt-core/pull/12747)
- **趋势解读**：测试基础设施、JSON schema 同步、catalog 指标采集等工作表明，dbt-core 正持续加强 **工程稳定性、可观测性与生态对齐**。

---

## 6. 开发者关注点

从当天动态看，开发者和贡献者当前的高频痛点主要有：

### 1) 配置行为不够直观，边界条件容易踩坑
- 例如 snapshot 项目级 schema 配置是否生效、generic test 中 `null config` 如何处理、context config 中字段值非法时如何报错。
- 这类问题说明：**配置系统的“隐式规则”仍偏多**，用户需要更稳定、更一致的语义。

### 2) 报错信息质量直接影响排障效率
- 像 `packages.yml` 缺少 version 抛出原始 `KeyError`、解析阶段异常类型不统一，都会让用户很难第一时间定位问题。
- 社区明显希望 dbt-core 在 **错误分类、报错上下文、可读性** 上继续提升。

### 3) 复杂 selector/测试控制规则需要更可靠
- `exclude with test_name` 的继承 bug 说明，在实际项目中，用户大量依赖 selector 来做 **分层测试、精细化 CI、局部执行**。
- 一旦选择语义有偏差，就可能造成测试漏跑或误跑。

### 4) 跨平台 CI 稳定性仍是现实问题
- Windows runner 超时导致集成测试不稳定，说明工程层面的运行环境仍会影响交付效率。
- 开发者当前不仅关注功能，也非常关注 **测试可重复性与发版阻塞问题**。

### 5) dbt 正被更多自动化与智能代理场景消费
- `run-operation --inline` 明确点到 AI agents，这表明社区已经在把 dbt 视为 **机器可调用的数据控制接口**，而不仅仅是人工开发工具。
- 这会推动未来在 CLI 设计、错误返回、命令幂等性方面提出更高要求。

---

## 附：今日值得重点跟踪的链接

- Epic：Model freshness checks  
  https://github.com/dbt-labs/dbt-core/issues/12719

- Feature：`dbt run-operation --inline`  
  https://github.com/dbt-labs/dbt-core/issues/12478

- Bug：snapshot schema 配置异常  
  https://github.com/dbt-labs/dbt-core/issues/12756

- Bug 修复：selector 继承下 `exclude test_name`  
  https://github.com/dbt-labs/dbt-core/issues/12753  
  https://github.com/dbt-labs/dbt-core/pull/12751

- ParsingError 改进  
  https://github.com/dbt-labs/dbt-core/pull/12758

- 集成测试超时调整  
  https://github.com/dbt-labs/dbt-core/pull/12757

- 社区 issue 自动标注  
  https://github.com/dbt-labs/dbt-core/pull/12754

如果你愿意，我还可以继续把这份日报整理成更适合团队内部转发的 **“TL;DR + 风险提示 + 建议跟进项”** 版本。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时内，Spark 仓库没有新版本发布，但社区讨论明显集中在 **PySpark / pandas / Arrow 兼容性**、**SQL 语义与优化器行为**、以及 **运行环境兼容问题**。  
从 PR 动向看，Python 生态是最活跃的主线；从 Issue 看，用户侧更关注 **文档缺口、AQE/缓存场景优化失效、Apple Silicon 与新 Ubuntu 环境兼容性** 等实际落地问题。

---

## 2. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 共 6 条。由于总量不足 10 条，以下按“全部值得关注 Issue”进行梳理。

### 1) #54986 [OPEN] [DOCS] Document return types for aggregate functions (stddev, variance, etc.)
- **看点**：用户指出 PySpark 聚合函数如 `stddev`、`variance` 等 API 文档未明确返回类型，而源码层面这些函数统一返回 `DoubleType`。
- **为什么重要**：这类问题虽然是文档层面，但直接影响 **类型推断、Schema 设计、下游数据契约与 UDF 兼容性**。对数据平台团队尤其关键。
- **社区反应**：已有 5 条评论，说明该问题具备一定共识，属于“低噪音但高实用价值”的文档改进诉求。
- **链接**：apache/spark Issue #54986

### 2) #55094 [CLOSED] AQE does not apply optimizations for queries involving TableCacheQueryStageExec
- **看点**：反馈指出在 `CACHE TABLE` 包含 `ShuffleExchange` 的场景下，AQE 的 `CoalesceShufflePartitions` 未能生效。
- **为什么重要**：这触及 Spark SQL 执行层的核心能力——**AQE 在缓存查询链路中的一致性**。若优化失效，可能导致小分区未合并、任务数膨胀、资源利用率变差。
- **社区反应**：3 条评论后关闭，说明问题可能已被确认、解释或转入修复路径。
- **链接**：apache/spark Issue #55094

### 3) #55096 [OPEN] Ubuntu 25.10 - access denied to /tmp even in 777 mode without protected mode
- **看点**：用户在 Ubuntu 25.10 上遭遇 `/tmp` 访问被拒，影响 Java / Spark 正常运行。
- **为什么重要**：这不是 Spark 逻辑 bug，但属于 **新操作系统环境兼容性** 问题，常见于本地开发、CI、容器与临时目录依赖场景。
- **社区反应**：目前评论较少，但这种 issue 往往代表“新平台前哨信号”，后续可能扩大。
- **链接**：apache/spark Issue #55096

### 4) #55113 [OPEN] Spark Declarative Pipelines and Unity Catalog
- **看点**：用户询问 Spark Declarative Pipelines 是否可与 Unity Catalog 协同使用。
- **为什么重要**：这反映出社区正在关注 **Spark 新的数据管道范式与外部 catalog / governance 系统的集成能力**。对 Lakehouse 用户尤其关键。
- **社区反应**：暂无评论，但议题方向很有代表性，说明新特性 adoption 正在发生。
- **链接**：apache/spark Issue #55113

### 5) #55093 [CLOSED] UT fails with UnsatisfiedLinkError on Apple Silicon
- **看点**：在 Apple Silicon 上跑 Spark 单元测试时，依赖 LevelDBJNI 的测试套件失败。
- **为什么重要**：Apple Silicon 已经成为大量开发者默认环境，这类问题会直接影响 **本地开发体验、CI 覆盖与贡献门槛**。
- **社区反应**：2 条评论后关闭，说明已有回应或 workaround。
- **链接**：apache/spark Issue #55093

### 6) #55082 [CLOSED] 4.1.1 spark-connect-common module compile error
- **看点**：用户在 Spark 4.1.1 编译 `spark-connect-common` 模块时遇到 proto/class 生成相关错误。
- **为什么重要**：Spark Connect 是 Spark 近年重点方向之一，任何编译门槛问题都会影响 **二次开发、嵌入式集成和生态接入**。
- **社区反应**：5 条评论，虽然已关闭，但说明该问题对实践用户确实造成了困扰。
- **链接**：apache/spark Issue #55082

---

## 3. 重要 PR 进展

### 1) #55097 [OPEN] [SPARK-56253][PYTHON][CONNECT] Make spark.read.json accept DataFrame input
- **内容**：让 `spark.read.json()` 支持以“单字符串列 DataFrame”作为输入，而不再局限于文件路径或 RDD。
- **意义**：这会显著改善 **内存内 JSON 文本解析** 的可用性，也更契合 Spark Connect / notebook / service 化场景。
- **链接**：apache/spark PR #55097

### 2) #55118 [OPEN] [SPARK-56310][PYTHON] Handle pandas 3 dtype in DataFrame.toPandas
- **内容**：调整 `DataFrame.toPandas()` 在 pandas 3.x 下的 dtype 映射，尤其是 `StringType` 的处理。
- **意义**：这是典型的 **上游生态升级兼容修复**。对依赖 pandas 进行数据交换、特征工程和本地分析的用户影响面很大。
- **链接**：apache/spark PR #55118

### 3) #55121 [OPEN] [SPARK-56219][PS][FOLLOW-UP] Keep legacy groupby idxmax and idxmin skipna=False behavior for pandas 2
- **内容**：在 pandas-on-Spark 中，为 pandas 2 保留 `GroupBy.idxmax/idxmin(skipna=False)` 的历史行为。
- **意义**：这是对 **行为兼容性与升级平滑性** 的补强，减少用户升级 pandas / Spark 后出现结果差异的风险。
- **链接**：apache/spark PR #55121

### 4) #55123 [OPEN] [SPARK-56189][PYTHON] Refactor SQL_WINDOW_AGG_ARROW_UDF
- **内容**：重构 `SQL_WINDOW_AGG_ARROW_UDF` 执行路径，使窗口逻辑更内聚，并让 `ArrowStreamSerializer` 更聚焦于 I/O。
- **意义**：这类重构虽不直接暴露为新功能，但通常会提升 **可维护性、扩展性以及 Arrow UDF 路径的稳定性**。
- **链接**：apache/spark PR #55123

### 5) #55089 [OPEN] [SPARK-55278] Introduce core abstraction for UDF worker.
- **内容**：引入语言无关 UDF worker 框架的核心抽象与基础包结构。
- **意义**：这是今天最值得关注的架构类 PR 之一，指向 Spark UDF 执行模型的 **统一化、模块化与多语言扩展能力**。
- **链接**：apache/spark PR #55089

### 6) #55120 [OPEN] [SQL] Skip ColumnarToRow for Arrow-backed input to Python UDFs
- **内容**：针对 Arrow 支撑的 Python UDF 输入，尝试跳过 `ColumnarToRow` 转换。
- **意义**：如果合入，将有望减少不必要的数据格式转换，是 **Python UDF 性能优化** 的关键方向。
- **链接**：apache/spark PR #55120

### 7) #55053 [OPEN] [SPARK-56251][SQL] Add default fetchSize for postgres to avoid loading all data in memory
- **内容**：为 PostgreSQL JDBC 方言设置默认 `fetchSize=1000`，避免一次性把整表读入内存。
- **意义**：这是非常务实的连接器改进，直接影响 **JDBC 读取稳定性、内存压力与大表拉取安全性**。
- **链接**：apache/spark PR #55053

### 8) #54934 [OPEN] [SPARK-56125][SQL] Simplify schema calculation for Merge Into Schema Evolution
- **内容**：简化 `MERGE INTO` schema evolution 的 schema 计算逻辑。
- **意义**：面向 Lakehouse / CDC / upsert 场景，这是 SQL 层的重要演进，可降低复杂 schema merge 逻辑的维护成本。
- **链接**：apache/spark PR #54934

### 9) #54780 [OPEN] [SPARK-55981][SQL] Allow Geo Types with SRID's from the pre-built registry
- **内容**：支持来自预编译注册表的地理空间 SRID，用于 Geometry / Geography 类型。
- **意义**：这表明 Spark SQL 的 **地理空间能力** 仍在快速完善，对 GIS、位置数据分析和空间 ETL 很关键。
- **链接**：apache/spark PR #54780

### 10) #55088 [OPEN] [SPARK-56280][SS] normalize NaN and +/-0.0 in streaming dedupe node
- **内容**：在流式去重节点中规范化 `NaN` 与 `+0.0/-0.0`。
- **意义**：这关系到 Structured Streaming 的 **结果一致性与状态去重语义**，尤其适合金融、IoT、监控等对精确去重敏感的场景。
- **链接**：apache/spark PR #55088

---

## 4. 功能需求趋势

### 1) Python 生态兼容性仍是最强主线
从 `toPandas` 适配 pandas 3、pandas-on-Spark 行为兼容、类型标注补齐，到 Arrow UDF 重构与 Python UDF 执行优化，能看出社区正持续投入于：
- **pandas / pyarrow 新版本兼容**
- **PySpark API 易用性**
- **Python 执行路径性能优化**
- **静态类型与可维护性提升**

### 2) SQL 执行优化与语义一致性持续推进
今日相关信号包括：
- AQE 在缓存查询中的优化一致性问题
- `PIVOT` 的 collation-aware 修复
- `MERGE INTO schema evolution` 简化
- 跳过 `ColumnarToRow` 的潜在执行优化

这表明 Spark SQL 关注点已不只是“能跑”，而是 **复杂语义下的正确性、性能与内部执行链路整洁度**。

### 3) 连接器与外部系统集成逐步深化
- PostgreSQL 默认 `fetchSize`
- Spark Declarative Pipelines 与 Unity Catalog 的协同问题
- Spark Connect 编译问题

这些都说明 Spark 社区正面对更多 **生产化集成诉求**：数据库、catalog、远程客户端、管道框架之间的边界需要更顺滑。

### 4) 平台与运行环境兼容问题开始显性化
Apple Silicon、Ubuntu 25.10 等 issue 表明，Spark 在开发者环境中的可用性仍需要持续打磨。随着新硬件与新 OS 普及，这类问题的重要性会继续上升。

---

## 5. 开发者关注点

### 1) 文档缺口仍会放大使用成本
聚合函数返回类型未文档化、流式 admission control 文档补充等现象说明：  
**很多用户痛点并非来自功能缺失，而是来自“功能存在但不可发现、不可确认”。**

### 2) 新版依赖升级带来的兼容压力很高
pandas 3、旧版 pyarrow、Apple Silicon 原生库问题，反映出 Spark 作为基础设施项目，长期要处理：
- 上游库快速演进
- 多版本兼容维护
- 行为回归与历史兼容之间的平衡

### 3) Python 路径性能与正确性是高频诉求
今天多条 PR 围绕 Python UDF、Arrow、JSON 输入、类型标注展开，说明开发者既关心：
- **性能损耗是否可进一步压缩**
- **DataFrame ↔ pandas / Arrow 转换是否稳定**
- **API 行为是否更贴近 Python 用户直觉**

### 4) 生产场景更重视“边缘但致命”的执行细节
如 AQE 在缓存查询中失效、流式去重中 `NaN`/`±0.0` 归一化、JDBC 默认抓取策略等，都是平时不显眼、但在大规模生产环境里会放大为：
- 性能异常
- 内存问题
- 结果不一致
- 运维复杂度上升

---

## 附：今日判断

今天的 Spark 社区动态没有版本发布层面的“大新闻”，但从 Issue 和 PR 可以明显看出两个方向：  
一是 **Spark 正继续打磨 Python-first 的数据工程体验**；二是 **SQL/Streaming/Connect 等核心能力正在向更高的正确性与生产可用性推进**。对数据平台团队而言，近期尤其值得关注 pandas 3 兼容、UDF worker 架构演进，以及 SQL 执行路径中的优化与语义修复。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新版本发布，也没有新的 Issue 更新，社区讨论重心主要集中在 Pull Request 推进上。  
从当前活跃 PR 看，社区正在持续完善 **类型系统、聚合函数语义、扩展引用机制** 与 **文档治理**，这说明 Substrait 正在从“规范补全”进一步走向“可实现性、一致性与生态落地”。

---

## 2. 重要 PR 进展

> 过去 24 小时内共 6 条 PR 更新。以下按重要性整理。

### 1) PR #1028：测试框架改为使用 URN 引用扩展
- **状态**：OPEN
- **作者**：@benbellick
- **重要性**：高
- **内容概述**：将测试框架中对扩展的引用方式，从文件路径切换为规范化 URN（如 `extension:io.substrait:functions_arithmetic`）。
- **为什么重要**：
  - 这是 Substrait 扩展机制走向标准化的重要一步。
  - 用 URN 替代路径有助于减少实现方对仓库目录结构的耦合，提升跨语言、跨仓库、跨版本的一致性。
  - 对未来扩展注册、远程解析、工具链兼容都有积极意义。
- **链接**：substrait-io/substrait PR #1028

### 2) PR #1027：修正 `avg(decimal)` 返回类型精度规则
- **状态**：OPEN
- **作者**：@kadinrabo
- **重要性**：高
- **内容概述**：将 `AVG(DECIMAL<P,S>)` 的返回类型从 `DECIMAL<38,S>` 调整为 `DECIMAL<P,S>`。
- **为什么重要**：
  - 这是典型的**函数语义精化**问题，直接影响不同引擎对 Substrait 计划的执行一致性。
  - 当前规则更像 `SUM` 的放大策略，但 `AVG` 的数学语义并不完全相同；修正后更贴近常见数据库行为。
  - 对 Decimal 聚合兼容性、精度控制和计划可移植性影响较大。
- **链接**：substrait-io/substrait PR #1027

### 3) PR #953：新增无符号整数扩展类型 `u8/u16/u32/u64`
- **状态**：OPEN
- **标签**：[PMC Ready]
- **作者**：@kadinrabo
- **重要性**：高
- **内容概述**：引入无符号整数作为一等扩展类型，并补充算术函数支持与测试覆盖。
- **为什么重要**：
  - 扩展了 Substrait 的数值类型表达能力，尤其适用于 Arrow、硬件加速、部分分析引擎和数据交换场景。
  - 有助于降低与上游/下游系统的类型映射损耗。
  - 这是“核心类型系统之外，通过扩展稳步增强能力”的典型案例。
- **链接**：substrait-io/substrait PR #953

### 4) PR #1012：`std_dev` 与 `variance` 支持整型参数
- **状态**：OPEN
- **标签**：[PMC Ready]
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：为标准差和方差函数增加整型参数支持，并补充测试用例。
- **为什么重要**：
  - 聚合统计函数是分析型工作负载中的高频能力，整型支持是现实 SQL 兼容中的基本需求。
  - 该 PR 体现出社区正在提升函数签名覆盖度，减少“规范能表达但实现不好对齐”的问题。
  - 同时也反映出测试生成与函数枚举语法正在逐步完善。
- **链接**：substrait-io/substrait PR #1012

### 5) PR #1026：补充支持库说明与破坏性变更策略文档
- **状态**：OPEN
- **作者**：@vbarua
- **重要性**：中高
- **内容概述**：增加“受支持库（supported libraries）”以及“breaking change policy”相关文档。
- **为什么重要**：
  - 对规范项目而言，文档治理和变更政策与功能本身同样关键。
  - 这将帮助实现者理解哪些工具链/库处于支持范围，以及规范演进时的兼容性边界。
  - 对生态采用者来说，这类文档能显著降低接入决策成本。
- **链接**：substrait-io/substrait PR #1026

### 6) PR #945：新增 `current_date`、`current_timestamp`、`current_timezone` 变量
- **状态**：CLOSED
- **标签**：[PMC Ready]
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：新增 3 个执行上下文变量，用于获取当前日期、当前时间戳和当前时区。
- **为什么重要**：
  - 这是规范补齐执行上下文语义的重要一步。
  - 对表达式下推、引擎间迁移、时区语义统一都很关键。
  - 虽然该 PR 当前已关闭，但其更新意味着相关功能已进入较明确的结论阶段，值得持续关注后续落地方式。
- **链接**：substrait-io/substrait PR #945

> 注：过去 24 小时内仅有 6 条 PR 更新，因此本日报按全部活跃/更新 PR 汇总，未凑满 10 条。

---

## 3. 社区热点 Issues

过去 24 小时内 **没有 Issue 更新**，因此今日暂无可列出的热点 Issue。

---

## 4. 功能需求趋势

基于今日更新的 PR，可以看出当前社区关注的功能方向主要集中在以下几类：

### 1) 类型系统扩展与兼容性增强
- 代表：PR #953
- 趋势判断：
  - Substrait 正在持续增强数值类型覆盖，特别是与现有数据格式和执行引擎更容易对齐的类型。
  - 无符号整数的引入说明社区在重视与 Arrow、向量化执行、底层系统类型表达的兼容。

### 2) 聚合函数语义精确化
- 代表：PR #1027、PR #1012
- 趋势判断：
  - 社区正在补强聚合函数在参数类型、返回类型和精度行为上的规范定义。
  - 这类工作对不同数据库/计算引擎间的结果一致性至关重要，也是规范从“能描述”走向“可互操作”的关键阶段。

### 3) 扩展机制标准化
- 代表：PR #1028
- 趋势判断：
  - 扩展引用从“路径导向”转向“URN 导向”，反映出社区希望建立更稳定的扩展标识体系。
  - 这将有利于未来的扩展注册表、独立分发和生态工具自动解析。

### 4) 执行上下文与表达式能力补全
- 代表：PR #945
- 趋势判断：
  - 当前日期、时间戳、时区等上下文变量是实际 SQL 执行中不可或缺的能力。
  - 社区显然在推进 Substrait 对常见查询语义的完整覆盖。

### 5) 文档治理与生态可用性
- 代表：PR #1026
- 趋势判断：
  - 除了功能层面，社区开始更系统地完善支持策略和破坏性变更政策。
  - 这说明项目正在从规范设计阶段，逐步迈向更成熟的生态治理阶段。

---

## 5. 开发者关注点

结合今日 PR 动态，可以归纳出当前开发者最关注的几个痛点与高频需求：

### 1) 规范语义需要更精确，避免实现分歧
- 典型表现：`avg(decimal)` 返回类型规则调整。
- 开发者痛点：
  - 如果函数签名和返回类型定义不够精确，不同引擎实现会产生行为偏差。
  - 对联邦查询、计划交换和兼容性测试非常不利。

### 2) 类型覆盖仍需持续补齐
- 典型表现：无符号整数扩展类型。
- 开发者痛点：
  - 现有类型体系难以完全映射某些引擎或底层格式能力。
  - 缺失类型会导致计划降级、额外转换成本或语义丢失。

### 3) 扩展引用方式需要去路径耦合
- 典型表现：测试引用切换为 URN。
- 开发者痛点：
  - 路径式引用不利于跨项目复用，也容易因目录调整造成脆弱依赖。
  - 工具链更需要稳定、全局唯一、可解析的扩展标识。

### 4) 分析函数和统计函数要覆盖真实工作负载
- 典型表现：`std_dev`、`variance` 增加整型支持。
- 开发者痛点：
  - 用户期望 Substrait 能自然描述主流 SQL 分析场景。
  - 若函数签名覆盖不足，计划生成器和执行器就需要额外兼容分支。

### 5) 生态接入方需要更明确的治理信号
- 典型表现：supported libraries 与 breaking change policy 文档。
- 开发者痛点：
  - 实现方不仅关心“规范有没有这个能力”，也关心“未来会不会变、怎么变、是否稳定”。
  - 清晰的变更策略有助于推动生产环境采纳。

---

## 6. 附：今日值得重点跟踪的链接

- PR #1028 - feat(tests): use URN instead of path for extension references  
  链接：substrait-io/substrait PR #1028

- PR #1027 - fix: use input precision for avg decimal return type  
  链接：substrait-io/substrait PR #1027

- PR #953 - feat(extensions): add unsigned integer extension types (u8, u16, u32, u64)  
  链接：substrait-io/substrait PR #953

- PR #1012 - feat(extensions): support int arguments with std_dev and variance functions  
  链接：substrait-io/substrait PR #1012

- PR #1026 - docs: supported libraries + breaking change policy  
  链接：substrait-io/substrait PR #1026

- PR #945 - feat: add current_date, current_timestamp and current_timezone variables  
  链接：substrait-io/substrait PR #945

如果你愿意，我还可以继续把这份日报整理成更适合公众号/飞书群发布的「简版播报」或「表格版周报格式」。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*