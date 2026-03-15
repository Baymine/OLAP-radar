# OLAP 生态索引日报 2026-03-15

> 生成时间: 2026-03-15 01:28 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

以下是基于 2026-03-15 `dbt-core`、`Apache Spark`、`Substrait` 三个项目社区动态整理的 **OLAP 数据基础设施横向对比分析报告**。

---

# OLAP 数据基础设施生态横向对比分析｜2026-03-15

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个明显趋势：**核心能力建设正从“功能可用”转向“语义正确性、工程可运维性与跨平台一致性”**。  
从 `dbt-core`、`Spark` 到 `Substrait`，社区关注点虽然层次不同，但都在围绕 **行为边界明确化、测试/验证能力增强、以及复杂场景下的稳定性与可观测性提升** 展开。  
其中，`Spark` 代表执行引擎层的高频迭代，`dbt-core` 体现数据开发与治理层对平台适配、测试和项目规模化管理的需求升级，`Substrait` 则继续夯实跨引擎语义标准的底座。  
这说明 OLAP 生态正在进入一个更成熟阶段：**不仅要快、要能跑，还要可验证、可诊断、可治理、可互操作**。

---

## 2. 各项目活跃度对比

| 项目 | 今日活跃 Issues 数 | 今日活跃 PR 数 | 今日 Release 情况 | 活跃度判断 | 主要活跃方向 |
|---|---:|---:|---|---|---|
| dbt-core | 7 | 1 | 无新 Release | 中等 | 适配器兼容性、测试能力、解析性能、快照简化 |
| Apache Spark | 1 | 10（重点 PR） | 无新 Release | 高 | SQL 正确性、Web UI/AQE、V2 表能力、流式稳定性 |
| Substrait | 0 | 1 | 无新 Release | 低-中 | 类型系统一致性、nullability 语义、测试规范化 |

### 简要解读
- **Spark** 今日是三者中最活跃的项目，PR 更新密集，说明社区仍处在持续、高频的工程演进中。
- **dbt-core** 虽然 PR 不多，但 Issue 讨论集中且质量高，表明社区当前更偏向产品行为边界与使用体验层面的反馈。
- **Substrait** 活跃度最低，但其单条 PR 指向规范语义的一致性问题，说明该项目当前重点不在扩面，而在**夯实标准正确性**。

---

## 3. 共同关注的功能方向

虽然三个项目所处层次不同，但今天可以识别出若干共同关注的方向：

### 3.1 语义正确性与行为一致性
**涉及项目**：dbt-core、Spark、Substrait

- **dbt-core**
  - data tests 是否允许重复定义（#12643）
  - Snowflake 显式事务失败后未回滚（#12330）
  - package 中 adapter 配置传播不一致（#11240）
- **Spark**
  - `dropDuplicates(columns)` + `ExceptAll` 导致属性解析内部错误（#54724）
  - `LIKE` 对补充 Unicode 字符匹配异常（#54665）
  - `asinh/acosh` 大数值溢出导致结果错误（#54677 / #54804 / #54803）
- **Substrait**
  - null literal 的 nullable 类型约束修正（PR #989）

**共性结论**：  
社区都在强化“边界条件下结果是否正确、规则是否明确”。这说明 OLAP 生态的主战场正从新增能力，逐步转向 **语义严谨性和结果可预测性**。

---

### 3.2 测试与验证体系增强
**涉及项目**：dbt-core、Spark、Substrait

- **dbt-core**
  - 单元测试中支持嵌套宏 override（#12165）
  - data tests 重复定义语义讨论（#12643）
  - CI 测试调度优化（PR #12654）
- **Spark**
  - RocksDB State Store 集成测试 flaky 修复（#54808）
  - 多项修复开始向稳定分支 backport，反映验证链条成熟
- **Substrait**
  - 将扩展 YAML 的 nullability 规则严格落实到测试资产（PR #989）

**共性结论**：  
测试已不再只是保障代码质量的附属环节，而是承载 **语义约束、兼容性验证、回归稳定性** 的核心基础设施。

---

### 3.3 大规模工程可用性与可运维性
**涉及项目**：dbt-core、Spark

- **dbt-core**
  - 停止解析 disabled models（#11955），聚焦大型项目 parse/compile 成本
  - package 化复用下的配置一致性问题
- **Spark**
  - AQE 初始/最终计划并排展示（#54806）
  - 分区发现目录遍历深度配置（#54787）
  - 向量化读取异常不应误判为 corrupt file（#54805）

**共性结论**：  
随着系统规模扩大，社区越来越重视 **性能反馈周期、可观测性、错误诊断性**。  
这对企业用户尤其关键，因为大规模部署下“定位问题的成本”往往高于“实现功能的成本”。

---

### 3.4 平台/生态兼容能力持续深化
**涉及项目**：dbt-core、Spark、Substrait（间接）

- **dbt-core**
  - Databricks compute 配置传播
  - Unity Catalog `MANAGE` 权限支持
  - Snowflake 事务一致性
- **Spark**
  - V2 `CREATE TABLE LIKE`
  - Catalog / function registry 一致性补齐
- **Substrait**
  - 通过类型和 nullability 约束提升跨引擎互操作基础

**共性结论**：  
OLAP 生态越来越强调 **跨平台、跨 catalog、跨引擎** 的行为对齐。  
这意味着未来技术选型不能只看单点性能，而要看 **是否易于融入多系统协同架构**。

---

## 4. 差异化定位分析

### 4.1 dbt-core：数据开发与治理层
- **功能侧重**
  - 建模开发体验
  - 测试能力与项目治理
  - adapter 配置和权限管理
  - snapshot 等声明式数据构建能力
- **目标用户**
  - 分析工程师
  - 数据建模团队
  - 负责数仓开发规范和 CI/CD 的数据平台团队
- **技术路线**
  - 通过声明式 SQL + 宏 + 测试体系，构建数据开发工作流
  - 深度依赖各云数仓/执行引擎 adapter 的行为一致性
- **今日信号**
  - 议题多集中在“复杂企业使用场景下的行为边界”
  - 说明 dbt-core 正持续从“建模工具”走向“企业级数据开发平台”

### 4.2 Apache Spark：执行引擎与通用计算平台层
- **功能侧重**
  - SQL 内核正确性
  - Data Source V2 / Catalog 能力扩展
  - AQE / UI / 流式状态存储等工程能力
  - Python 与 Structured Streaming 生态完善
- **目标用户**
  - 数据工程师
  - 平台研发
  - 湖仓引擎/查询服务开发者
  - 依赖批流一体和大规模 ETL/分析计算的团队
- **技术路线**
  - 继续演进统一执行引擎
  - 在 SQL、Streaming、Catalog、UI 等多个子系统并行迭代
- **今日信号**
  - PR 密集且覆盖面广，显示其仍是 **高吞吐型、工程驱动型社区**
  - 更偏底层能力补齐与生产可用性提升

### 4.3 Substrait：跨引擎查询表示与语义标准层
- **功能侧重**
  - 类型系统
  - 函数语义
  - 可空性传播
  - 规范与测试资产的一致性
- **目标用户**
  - 查询引擎开发者
  - 优化器/规划器实现者
  - 需要跨系统互操作的数据库基础设施团队
- **技术路线**
  - 以规范、协议和测试约束驱动生态一致性
  - 不直接提供执行能力，而是提供“共同语义层”
- **今日信号**
  - 活跃度低但问题非常“底层”
  - 社区重心是 **规范收敛与跨实现一致性**，而不是快速扩展用户可见功能

---

## 5. 社区热度与成熟度

### 社区热度
按今天的动态强度看：

1. **Apache Spark：最高**
   - 10 个重点 PR，覆盖 SQL/UI/Streaming/V2/Python 多条主线
   - 反映出大规模、多子系统、持续并行推进的典型成熟开源社区特征

2. **dbt-core：中高**
   - 7 个活跃 Issue、1 个维护型 PR
   - 热点主要来自真实用户使用中的边界问题与产品能力诉求
   - 说明社区反馈密度稳定，且越来越偏向复杂企业场景

3. **Substrait：较低**
   - 无 Issue，1 个 PR
   - 但不能简单理解为“冷”；更准确地说，它处于 **规范细化、低噪声推进** 阶段

### 成熟度判断
- **Spark**：高度成熟，仍处于持续深耕阶段  
  重点已不是单纯“补功能”，而是 **正确性、可观测性、回补稳定版本、工程细节打磨**。
  
- **dbt-core**：成熟度高，但仍在快速产品化演进  
  用户需求正在推动其从建模工具向平台化能力延伸，因此会持续出现行为语义和治理能力上的新讨论。

- **Substrait**：标准层成熟度在提升，但生态扩张仍属中期阶段  
  当前更像“基础规范收敛期”，一旦更多引擎深度接入，其社区活跃度和议题复杂度可能显著上升。

---

## 6. 值得关注的趋势信号

### 趋势一：OLAP 基础设施进入“语义精修期”
无论是 dbt 的测试语义、Spark 的 SQL 边界修复，还是 Substrait 的 nullability 规则，今天都指向同一个趋势：  
**行业正在从“能力覆盖”转向“行为精确定义”**。

**对数据工程师的参考价值**：
- 选型时要关注边界语义、失败语义和兼容性，而不仅是 benchmark；
- 建议在生产体系中增加针对 Unicode、空值、大数值、事务失败等边界条件的回归测试。

---

### 趋势二：测试正在变成产品能力的一部分
dbt 强化单元测试和 data tests 语义，Spark 修 flaky 并 backport 修复，Substrait 用测试约束规范实现。  
这说明测试体系正在从“开发者内部工具”变成“平台可信度的一部分”。

**对数据工程师的参考价值**：
- 要把测试框架视为数据平台能力建设的重要组成，而不是附加项；
- 对数据建模、流式处理、跨引擎执行计划转换，建议建立更明确的契约测试。

---

### 趋势三：企业级场景更看重可诊断性与治理能力
dbt 关注 package 解析成本、权限表达与事务恢复；Spark 强化 AQE UI、错误分类和元数据发现调优。  
这表明生产环境中的核心诉求正从“作业跑起来”转向“问题能看懂、系统能治理”。

**对数据工程师的参考价值**：
- 在技术选型时，应将 UI、日志、错误分类、调优工具纳入评估项；
- 大型项目要重点关注 parse/plan 阶段成本，而不是只盯执行时长。

---

### 趋势四：跨平台与跨引擎互操作的重要性继续上升
dbt 面向 Databricks/Snowflake 的细粒度适配问题持续活跃，Spark 在 V2/catalog 体系上补能力，Substrait 继续强化标准约束。  
这共同说明：**未来的数据平台不会是单引擎孤岛，而是多系统协同架构**。

**对数据工程师的参考价值**：
- 设计数据栈时，应优先考虑配置可迁移性、语义一致性和标准接口兼容性；
- 对底层执行引擎、建模层、语义表示层之间的边界，要建立清晰分层认知。

---

## 结论

从今天的社区动态看，`dbt-core`、`Spark`、`Substrait` 虽然分别位于 **开发治理层、执行引擎层、语义标准层**，但它们共同反映出 OLAP 生态的同一主旋律：  
**向更高正确性、更强可测试性、更好可观测性和更强互操作性演进**。

如果你是：
- **数据平台负责人**：建议重点关注 Spark 的执行与可观测性演进，以及 dbt 的企业治理能力边界；
- **分析工程负责人**：建议重点跟踪 dbt 的测试语义、adapter 配置一致性、snapshot 场景化能力；
- **引擎/基础设施开发者**：建议重点关注 Substrait 的类型与函数语义收敛，以及 Spark V2/catalog 路线；
- **一线数据工程师**：建议提高对边界条件测试、失败恢复语义、跨平台兼容问题的关注度。

如果你愿意，我还可以继续把这份报告整理成：
1. **一页纸高管摘要版**
2. **周会汇报 PPT 大纲版**
3. **Markdown 表格增强版（含风险等级/建议动作）**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报｜2026-03-15

数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

过去 24 小时内，`dbt-core` 没有新版本发布，社区动态主要集中在 Issue 讨论与少量工程维护型 PR 更新。  
从最新活跃议题来看，关注点仍然聚焦在 **适配器兼容性（Databricks / Snowflake）**、**测试与宏覆盖能力**、以及 **解析性能与模型治理**。  
此外，关于 **data tests 是否允许重复定义** 的讨论值得持续关注，这可能影响测试行为的一致性与项目可维护性。

---

## 2. 社区热点 Issues

> 注：过去 24 小时内更新的 Issue 共 7 条，以下按重要性全部纳入分析。

### 1) 支持“仅防止源表删除”的精简快照能力
- **Issue**: [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)
- **标题**: Support streamlined snapshots when intention is only to mitigate against deletions in the source table
- **为什么重要**:  
  该需求反映出用户并不总是需要完整 SCD/历史追踪，而是希望用更轻量的 snapshot 机制，仅用于“防删补偿”场景。这类能力如果落地，有望降低快照复杂度、存储成本和维护门槛。
- **社区反应**:  
  当前评论不多（3 条），但被标注为 `enhancement`、`snapshots`，说明它触及 snapshot 产品形态设计，属于中长期值得观察的方向。

### 2) `databricks_compute` 在 package 导入模型中失效
- **Issue**: [#11240](https://github.com/dbt-labs/dbt-core/issues/11240)
- **标题**: Specifying `databricks_compute` doesn't work in models imported via dbt packages
- **为什么重要**:  
  这是典型的 **适配器配置继承/传播问题**。对于依赖 package 复用模型的团队而言，配置无法正确生效会直接影响 Databricks 运行资源选择，进而影响成本、性能和部署一致性。
- **社区反应**:  
  目前有 3 条评论，状态为 `awaiting_response`。说明问题已被注意到，但仍需要更多上下文或复现信息推动处理。

### 3) 停止解析被禁用的模型
- **Issue**: [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)
- **标题**: Stop parsing disabled models
- **为什么重要**:  
  这是一个非常典型的 **解析性能优化** 与 **包治理** 诉求。大型项目将一个 dbt 项目作为 package 复用时，大量默认禁用模型仍被解析，会带来不必要的编译开销和认知负担。
- **社区反应**:  
  评论数不高（2 条），但该问题与企业级项目规模直接相关，具有较高普适性。

### 4) 在 `+grants` 中支持 Databricks Unity Catalog 的 `MANAGE` 权限
- **Issue**: [#11653](https://github.com/dbt-labs/dbt-core/issues/11653)
- **标题**: Support for MANAGE privilege in dbt's +grants configuration (Databricks Unity Catalog)
- **为什么重要**:  
  这是 **权限治理与平台集成** 的关键诉求。随着更多团队在 Unity Catalog 上统一管理安全策略，dbt 若不能完整表达关键权限，将限制 IaC 式权限管理实践。
- **社区反应**:  
  评论较少（1 条），但今天仍有更新，说明 Databricks 权限模型支持仍在持续被社区关注。

### 5) 单元测试中允许对嵌套宏进行 override
- **Issue**: [#12165](https://github.com/dbt-labs/dbt-core/issues/12165)
- **标题**: Allow macro overrides in unit tests for nested macros
- **为什么重要**:  
  该需求指向 dbt 单元测试体系的可测试性边界。当前若只支持覆盖最外层宏，而无法覆盖内部嵌套调用，复杂宏逻辑的测试隔离能力会明显受限。
- **社区反应**:  
  目前评论少（1 条），但被明确打上 `unit tests` 标签，属于测试能力建设中很有代表性的诉求。

### 6) Snowflake 显式事务下 SQL 步骤失败后未执行回滚
- **Issue**: [#12330](https://github.com/dbt-labs/dbt-core/issues/12330)
- **标题**: Snowflake rollback is skipped after SQL step fail when using explicit transactions
- **为什么重要**:  
  这是高优先级的 **事务一致性 / 失败恢复** 问题。若 materialization 失败后事务没有按预期回滚，可能造成残留状态、脏对象或难以排查的数据不一致。
- **社区反应**:  
  评论数量不多（1 条），但问题本身影响面可能很大，尤其是对依赖显式事务控制的 Snowflake 用户。

### 7) data tests 是否应允许重复定义
- **Issue**: [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)
- **标题**: Let's decide! Allow data tests to be duplicated or not
- **为什么重要**:  
  这是一个兼具 **语义一致性** 与 **用户体验** 的议题。测试重复定义究竟应视为合法能力还是配置错误，会影响编译结果可预测性、CI 稳定性和团队规范制定。
- **社区反应**:  
  这是最近新开的议题（创建于 2026-03-11），虽然暂时无评论，但因其涉及行为规范，后续很可能引发更深入讨论。

---

## 3. 重要 PR 进展

> 注：过去 24 小时内仅 1 条 PR 更新。

### 1) 更新 `pytest-split` 测试耗时数据
- **PR**: [#12654](https://github.com/dbt-labs/dbt-core/pull/12654)
- **标题**: Update test durations for pytest-split
- **状态**: Closed
- **内容概述**:  
  这是自动生成的工程维护型 PR，用于更新 `pytest-split` 所依赖的测试耗时文件，以便在并行执行测试时更均衡地分配 workload。
- **为什么重要**:  
  虽然不是功能性改动，但这类 PR 对 CI 稳定性和测试效率非常关键。对于像 dbt-core 这样的项目，测试套件规模较大，任务分配不均会显著拖慢反馈周期。
- **影响判断**:  
  属于基础设施优化，间接提升开发体验与合并效率。

---

## 4. 功能需求趋势

结合今日活跃 Issues，可以看到社区需求主要集中在以下几个方向：

### 1) 云数仓/平台适配器兼容性
- 代表议题：
  - [#11240](https://github.com/dbt-labs/dbt-core/issues/11240)
  - [#11653](https://github.com/dbt-labs/dbt-core/issues/11653)
  - [#12330](https://github.com/dbt-labs/dbt-core/issues/12330)
- 趋势解读：  
  Databricks 与 Snowflake 相关问题持续活跃，说明 dbt-core 用户越来越依赖多平台适配器的“细粒度正确性”，不仅要能跑，还要覆盖权限、事务、资源配置等高级场景。

### 2) 测试框架能力增强
- 代表议题：
  - [#12165](https://github.com/dbt-labs/dbt-core/issues/12165)
  - [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)
- 趋势解读：  
  社区对测试语义、测试隔离、测试可组合性的要求在提升。dbt 不再只是建模工具，也被期待成为更完备的数据工程测试平台。

### 3) 解析性能与大型项目治理
- 代表议题：
  - [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)
- 趋势解读：  
  随着 package 化和多项目复用增多，用户开始更关注 parse/compile 阶段的性能成本。禁用模型仍参与解析的问题，反映出大型项目管理体验还有优化空间。

### 4) 快照能力的场景化简化
- 代表议题：
  - [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)
- 趋势解读：  
  用户希望 snapshot 能覆盖更轻量、更明确的业务目标，而不是只能使用相对重型的历史跟踪方案。这说明 dbt 社区对“按场景分层设计能力”的需求在上升。

---

## 5. 开发者关注点

### 1) 配置在 package / adapter 场景下的行为一致性
- 相关 Issue:
  - [#11240](https://github.com/dbt-labs/dbt-core/issues/11240)
  - [#11653](https://github.com/dbt-labs/dbt-core/issues/11653)
- 开发者痛点：  
  当项目跨 package、跨 adapter 复用时，配置继承、权限表达和运行资源绑定容易出现边界行为，增加排障复杂度。

### 2) 失败语义与事务安全
- 相关 Issue:
  - [#12330](https://github.com/dbt-labs/dbt-core/issues/12330)
- 开发者痛点：  
  数据工程师越来越关注失败后的可恢复性。事务回滚不一致会破坏“声明式构建应具备可预测结果”的预期。

### 3) 测试可控性不足
- 相关 Issue:
  - [#12165](https://github.com/dbt-labs/dbt-core/issues/12165)
  - [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)
- 开发者痛点：  
  对复杂宏和数据测试行为的控制仍不够精细，影响测试编写效率、可维护性与 CI 稳定性。

### 4) 大规模项目下的编译/解析成本
- 相关 Issue:
  - [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)
- 开发者痛点：  
  即使模型被禁用，仍可能进入解析流程，导致大型项目的开发反馈周期拉长，不利于 package 化架构落地。

### 5) 希望核心能力更贴近实际治理场景
- 相关 Issue:
  - [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)
- 开发者痛点：  
  并非所有团队都需要“全功能”机制，很多人更希望 dbt 提供适合实际业务目标的轻量方案，以减少复杂度和资源消耗。

---

## 结语

今天的 `dbt-core` 社区动态虽不算密集，但议题质量较高，集中体现了项目从“基础建模工具”向“企业级数据开发平台”演进时面临的典型挑战：**适配器深度支持、测试能力扩展、性能治理与行为一致性**。  
若你正在维护大型 dbt 项目，建议重点关注 Databricks/Snowflake 兼容性议题，以及测试行为相关讨论。

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合飞书/Slack 发布的简版**
2. **适合公众号/博客的长版**
3. **表格版（含优先级与影响面）**

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-15）

> 数据来源：[`github.com/apache/spark`](https://github.com/apache/spark)

## 1. 今日速览

过去 24 小时 Spark 社区没有新 Release，但 SQL 内核、Web UI、Structured Streaming 与 Python 生态都很活跃，PR 更新数量明显高于 Issue 数量，说明当前社区重心仍偏向修复、增强与分支回补。  
今天最值得关注的方向集中在 **SQL 语义与数值稳定性修复、AQE/Web UI 可观测性增强、V2 表能力补齐、流式状态存储测试稳定性提升**。  
此外，唯一活跃 Issue 指向一个 **Catalyst/执行计划属性解析错误**，涉及 `dropDuplicates(columns)` 与 `ExceptAll` 的组合语义，值得 SQL 用户重点关注。

---

## 2. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 仅 1 条，低于用户要求的 10 条，因此这里完整列出全部活跃 Issue，并明确说明信息边界。

### 1) `dropDuplicates(columns)` followed by `ExceptAll` results in `INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND`
- **Issue**: [#54724](https://github.com/apache/spark/issues/54724)
- **状态**: OPEN
- **作者**: @BaseKan
- **重要性**: 这是一个典型的 **SQL/DataFrame 逻辑计划或属性绑定缺陷**。`dropDuplicates` 在指定列子集后，再执行 `ExceptAll` 触发内部属性找不到错误，说明 Spark 在分析/优化阶段对输出属性 lineage 的处理可能存在问题。
- **为什么值得关注**:
  - 影响 DataFrame 常见去重 + 集合运算链路；
  - 报错为 `INTERNAL_ERROR_*`，通常意味着并非用户 SQL 写法错误，而是框架内部实现缺陷；
  - 可能波及批处理 ETL、数据校验、CDC 对账等常见场景。
- **社区反应**:
  - 当前评论数和点赞数都为 0，说明问题仍处于早期暴露阶段；
  - 但该问题一旦复现稳定，通常会较快被归入 SQL/Catalyst 修复队列。
- **影响面判断**:
  - 主要影响使用 DataFrame API 做差异比对、去重后集合比较的用户；
  - 若问题位于通用 Analyzer/Optimizer 路径，潜在影响可能不止 `ExceptAll`。
- **链接**: [apache/spark Issue #54724](https://github.com/apache/spark/issues/54724)

---

## 3. 重要 PR 进展

> 从过去 24 小时更新的 PR 中，挑选 10 个最值得数据工程师和数据库开发者关注的变化。

### 1) 支持 V2 `CREATE TABLE LIKE`
- **PR**: [#54809](https://github.com/apache/spark/pull/54809)
- **标题**: `[SPARK-55994][SQL] Support CREATE TABLE LIKE for V2`
- **意义**:
  - 为 Data Source V2 体系补齐 DDL 能力；
  - 有助于统一 Spark 在传统 catalog/table 与新一代 V2 catalog 上的建表体验。
- **为什么重要**:
  - Spark 正持续向 V2 表接口迁移，`CREATE TABLE LIKE` 是元数据复用的高频能力；
  - 对 Iceberg/Delta/自定义 catalog 场景的兼容性和易用性都有现实价值。

### 2) AQE 查询支持初始计划与最终计划并排对比
- **PR**: [#54806](https://github.com/apache/spark/pull/54806)
- **标题**: `[SPARK-55877][UI] Side-by-side Initial vs Final plan comparison for AQE queries`
- **意义**:
  - 在 SQL 执行详情页中对 AQE 计划演化提供更直观的可视化；
  - 便于开发者理解 AQE 重写前后的差异。
- **为什么重要**:
  - 对性能调优极有帮助；
  - 对排查 Join 重选、Shuffle 调整、Skew 处理等 AQE 行为尤其关键。

### 3) LIKE 模式匹配修复：补充 Unicode 字符支持
- **PR**: [#54665](https://github.com/apache/spark/pull/54665)
- **标题**: `[SPARK-55453][SQL] Fix LIKE pattern matching for supplementary Unicode characters`
- **意义**:
  - 修复 `LIKE` 在 UTF-16 surrogate pair 场景下对 emoji 等增补字符处理不正确的问题。
- **为什么重要**:
  - 面向全球化文本处理、日志分析、用户内容检索的场景非常关键；
  - 属于 SQL 语义正确性修复，优先级通常较高。

### 4) 向量化读取容量溢出不应被误判为“损坏文件”
- **PR**: [#54805](https://github.com/apache/spark/pull/54805)
- **标题**: `[SPARK-55968][SQL] Do not treat vectorized reader capacity overflow ...`
- **意义**:
  - 修正 `RuntimeException` 被 `ignore corrupt file` 路径吞掉的问题；
  - 避免真实的容量/整数溢出 bug 被误掩盖。
- **为什么重要**:
  - 这是典型的 **错误分类不当导致可观测性下降**；
  - 对 Parquet/ORC 向量化读取、大列/宽表场景的稳定性排障很关键。

### 5) 大数值输入下 `asinh/acosh` 数值稳定性修复
- **PR**: [#54677](https://github.com/apache/spark/pull/54677)
- **标题**: `[SPARK-55557][SQL] Fix numerical instability in asinh/acosh for large values`
- **意义**:
  - 使用更稳定的数学公式，避免大输入下出现溢出并返回 Infinity。
- **为什么重要**:
  - 关系到 SQL 数学函数结果正确性；
  - 对科学计算、特征工程、金融风控等依赖数值稳定性的场景尤其重要。

### 6) 上述数值稳定性修复已开始向 4.0 分支回补
- **PR**: [#54804](https://github.com/apache/spark/pull/54804)
- **标题**: `[SPARK-55557][SQL][4.0] Hyperbolic functions should not overflow with large inputs`
- **意义**:
  - 说明主干修复之外，社区已同步考虑稳定分支的用户影响。
- **为什么重要**:
  - 对生产环境用户来说，是否 backport 往往比主干修复更关键；
  - 表明该问题被认为具有现实影响。

### 7) 上述数值稳定性修复已开始向 3.5 分支回补
- **PR**: [#54803](https://github.com/apache/spark/pull/54803)
- **标题**: `[SPARK-55557][SQL][3.5] Hyperbolic functions should not overflow with large inputs`
- **意义**:
  - 进一步说明这不是边缘问题，而是影响当前主流使用版本的通用缺陷。
- **为什么重要**:
  - 3.5 仍是大量生产集群的实际版本；
  - 对企业升级决策和 patch 评估有直接参考价值。

### 8) PySpark 自定义流式数据源文档增强
- **PR**: [#54807](https://github.com/apache/spark/pull/54807)
- **标题**: `[SPARK-55450][SS][PYTHON][DOCS] Document admission control and Trigger.AvailableNow in PySpark streaming data sources`
- **意义**:
  - 为 PySpark 流式数据源补充 admission control 与 `Trigger.AvailableNow` 的文档和示例。
- **为什么重要**:
  - 文档增强意味着功能已逐渐走向可用；
  - 降低 Python 开发者接入 Structured Streaming 的门槛。

### 9) RocksDB State Store 集成测试消除 flaky
- **PR**: [#54808](https://github.com/apache/spark/pull/54808)
- **标题**: `[SPARK-55993][SS][TEST] Fix flaky RocksDBStateStoreIntegrationSuite bounded memory test`
- **意义**:
  - 修复与 RocksDB 内存管理、实例回收时序相关的测试不稳定问题。
- **为什么重要**:
  - 流式状态存储是 Structured Streaming 稳定性的核心；
  - flaky test 虽非直接功能升级，但会显著影响 CI 可信度和迭代效率。

### 10) 分区发现新增目录遍历深度配置
- **PR**: [#54787](https://github.com/apache/spark/pull/54787)
- **标题**: `[SPARK-54923][SQL] Add configuration for directory traversal depth before parallel partition discovery`
- **意义**:
  - 新增 `spark.sql.sources.parallelPartitionDiscovery.traversalDepth`，让用户控制在并行分区发现前由 driver 顺序展开的目录层级。
- **为什么重要**:
  - 对深层目录、窄树型分区布局很有现实意义；
  - 属于典型的元数据发现性能调优项，面向大规模湖仓场景价值较高。

---

## 4. 功能需求趋势

结合今日活跃数据，可以提炼出 Spark 社区当前几个明显的功能演进方向：

### 1) SQL 正确性与边界语义修复持续升温
- 代表项：
  - [Issue #54724](https://github.com/apache/spark/issues/54724)
  - [PR #54665](https://github.com/apache/spark/pull/54665)
  - [PR #54677](https://github.com/apache/spark/pull/54677)
- **趋势解读**:
  - 社区仍在持续投入 SQL 语义正确性，包括集合运算、字符串匹配、Unicode 处理、数值函数边界行为；
  - 这说明 Spark 在成熟阶段更强调“正确执行”而非单纯“增加新功能”。

### 2) Data Source V2 / Catalog 体系能力补齐
- 代表项：
  - [PR #54809](https://github.com/apache/spark/pull/54809)
  - [PR #54781](https://github.com/apache/spark/pull/54781)
- **趋势解读**:
  - V2 生态仍在补齐 DDL、catalog cache coherence、对象生命周期管理等基础能力；
  - 对接现代湖仓 catalog 的统一行为，仍是社区长期主线。

### 3) 可观测性与 Web UI 体验明显增强
- 代表项：
  - [PR #54806](https://github.com/apache/spark/pull/54806)
  - [PR #54785](https://github.com/apache/spark/pull/54785)
  - [PR #54671](https://github.com/apache/spark/pull/54671)
  - [PR #54784](https://github.com/apache/spark/pull/54784)
- **趋势解读**:
  - Spark UI 正从“能看”向“更适合分析与调优”演进；
  - AQE 计划对比、Stage 链接、客户端 DataTables 等改进都说明社区在强化可诊断性。

### 4) Structured Streaming 稳定性与 Python 体验同步推进
- 代表项：
  - [PR #54808](https://github.com/apache/spark/pull/54808)
  - [PR #54807](https://github.com/apache/spark/pull/54807)
- **趋势解读**:
  - 一方面加强底层状态存储与测试稳定性，另一方面补充 PySpark 流式数据源文档；
  - 表明流式处理生态已进入“功能完善 + 工程可用性增强”阶段。

### 5) 大规模数据读取与元数据发现调优依然是刚需
- 代表项：
  - [PR #54805](https://github.com/apache/spark/pull/54805)
  - [PR #54787](https://github.com/apache/spark/pull/54787)
- **趋势解读**:
  - 社区继续关注向量化读取异常处理、并行分区发现路径优化；
  - 反映湖仓环境下“文件多、目录深、表宽、元数据重”的典型挑战仍然突出。

---

## 5. 开发者关注点

从今日更新内容看，开发者的高频痛点主要集中在以下几类：

### 1) SQL 内核的“边界条件正确性”
- 如：
  - 大数值导致数学函数溢出；
  - Unicode 增补字符导致 `LIKE` 匹配异常；
  - DataFrame 组合操作触发内部属性解析失败。
- **说明**:
  - 用户已不满足于常规场景可用，更关注复杂输入和边界数据下的可靠性。

### 2) 错误可诊断性不足
- 如：
  - 向量化读取容量溢出被错误吞掉，伪装成“corrupt file”；
  - AQE 重写后计划难以直观比较。
- **说明**:
  - 对生产排障来说，“准确暴露问题”与“看得懂执行过程”几乎和修复 bug 同等重要。

### 3) V2 生态下元数据与缓存一致性
- 如：
  - `CREATE TABLE LIKE` for V2；
  - `DROP DATABASE` 后函数注册表缓存清理。
- **说明**:
  - Spark 在多 catalog、多对象、多缓存层场景下，开发者越来越关注一致性与可预期行为。

### 4) 流式处理的工程稳定性
- 如：
  - RocksDB state store 测试 flaky；
  - PySpark streaming data source 文档仍需补足。
- **说明**:
  - Structured Streaming 的核心诉求已从“能跑”转向“稳定、可测、易接入”。

### 5) Web UI 成为性能调优的重要入口
- 如：
  - AQE 初始/最终计划对比；
  - SQL plan metric 到 stage 的跳转；
  - SQL tab 前端化列表。
- **说明**:
  - 社区显然在把 Spark UI 打造成更强的性能分析与故障定位工具，而不只是展示页面。

---

## 附：今日值得额外关注的其他 PR

虽然未列入前 10，但以下更新也值得跟踪：

- [#54781](https://github.com/apache/spark/pull/54781) `Cache coherence: clear function registry on DROP DATABASE`  
  聚焦 catalog/function registry 缓存一致性，对长期运行的 SparkSession 较关键。

- [#54706](https://github.com/apache/spark/pull/54706) `[Python] Add subplots support for pie charts in Plotly backend`  
  持续增强 pandas-on-Spark 的可视化能力，偏向 Python 用户体验改进。

- [#54671](https://github.com/apache/spark/pull/54671) `[UI] Switch SQL tab query listing to client-side DataTables`  
  反映 Spark Web UI 现代化改造仍在持续。

---

如果你愿意，我还可以继续把这份日报整理成更适合团队周会分享的 **“TL;DR 版”**，或者输出成 **Markdown 表格版 / 飞书日报版**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报｜2026-03-15

## 1. 今日速览
过去 24 小时内，Substrait 仓库没有新的 Release，也没有新的 Issue 更新，社区动态主要集中在 **1 个仍处于开放状态的 PR**。  
这条 PR 聚焦于 **测试用例中 null literal 的可空性（nullability）约束修正**，本质上是在强化 Substrait 函数语义与扩展 YAML 定义之间的一致性，对规范正确性和实现兼容性都很关键。

---

## 4. 重要 PR 进展

> 过去 24 小时内仅有 1 条 PR 更新，以下为重点解读。

### 1) PR #989：修复测试用例中 null literal 的可空类型约束
- **标题**：fix: enforce nullable types for null literals in test cases  
- **状态**：OPEN  
- **作者**：@benbellick  
- **创建时间**：2026-03-04  
- **最近更新**：2026-03-14  
- **链接**：https://github.com/substrait-io/substrait/pull/989

**核心内容**  
该 PR 修正测试用例，使其严格遵循扩展 YAML 中函数 `nullability` 规则：
- 对于 **MIRROR** 类型函数：如果任一输入参数是 nullable，则输出也必须标记为 nullable（`?`）。
- 对于 **DECLARED_OUTPUT** 类型函数：输出可空性必须与声明的返回类型保持一致。

**为什么重要**
- 这不是简单的测试清理，而是在强化 **Substrait 类型系统与函数语义的一致性**。
- Nullability 是跨引擎互操作时最容易出现偏差的地方之一，测试若不严格，会导致不同实现“看起来兼容、实际行为不一致”。
- 对规范消费者（查询引擎、优化器、表达式执行器）而言，这类修复有助于减少边界条件下的解析和执行分歧。

**影响判断**
- **短期**：提高测试集可信度，避免错误测试掩盖实现问题。
- **中期**：推动各实现方更精确地对齐函数签名和返回类型规则。
- **长期**：增强 Substrait 作为跨系统查询表示层的可验证性与可移植性。

---

## 5. 功能需求趋势
由于过去 24 小时内 **没有新的 Issue 更新**，今日无法基于新增讨论提炼出完整的“社区需求热点”。不过从本次 PR 方向看，当前值得持续关注的趋势包括：

### 1) 类型系统一致性
- 社区仍在持续收紧 **类型推导、返回类型声明、可空性传播** 等细节。
- 这说明 Substrait 正在从“定义能力”进一步走向“定义可验证、可实现”。

### 2) 函数语义标准化
- PR #989 反映出函数扩展 YAML 中的语义描述，正在被更严格地落实到测试层。
- 这对 UDF / 内置函数的跨引擎兼容尤为关键。

### 3) 互操作测试质量提升
- 测试不只是验证格式正确，更是在验证 **规范解释是否唯一且稳定**。
- 对多引擎生态来说，这类改进通常比单点功能扩展更有基础价值。

---

## 6. 开发者关注点
结合今日唯一活跃 PR，可以观察到开发者当前较关注以下问题：

### 1) Nullability 边界条件容易出错
- `NULL` 字面量、参数可空性传播、返回值可空性声明，是实现中最容易出现歧义的区域。
- 如果测试不严格，执行器或规划器就可能在这些边界条件上产生不兼容行为。

### 2) 规范文本与测试资产必须同步
- 扩展 YAML 中已经定义了 nullability 规则，但测试若未同步体现，会削弱规范约束力。
- 开发者显然希望测试集真正承担“规范执行器”的角色。

### 3) 跨实现兼容需要更强的语义约束
- 对 Substrait 生态来说，真正的难点不只是序列化/反序列化，而是：
  - 类型是否能一致推断
  - 函数输出是否可预测
  - 不同引擎是否按同一 nullability 规则解释表达式

---

## 附：今日社区活跃条目

### Pull Requests
- [PR #989: fix: enforce nullable types for null literals in test cases](https://github.com/substrait-io/substrait/pull/989)

---

> 注：过去 24 小时内无新 Release、无 Issue 更新，因此“版本发布”与“社区热点 Issues”部分今天从略。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*