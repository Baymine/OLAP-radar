# OLAP 生态索引日报 2026-03-16

> 生成时间: 2026-03-16 01:28 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告
**日期：2026-03-16**  
**覆盖项目：dbt-core、Apache Spark、Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个明显特征：**“底层语义收敛 + 上层工程化增强”并行推进**。  
一方面，Spark 与 Substrait 都在持续强化 **SQL/类型系统/执行语义的一致性**，说明跨引擎兼容、标准化和正确性仍是核心主线；另一方面，dbt-core 的社区重心则更多落在 **开发体验、元数据可编程性、企业级依赖管理与项目规模治理**。  
从动态密度看，Spark 仍是最活跃的底层计算引擎型项目，dbt-core 则体现出强烈的平台化与产品化演进趋势，Substrait 虽然更新量小，但其变更对跨系统互操作具有较高杠杆效应。  
整体来看，OLAP 生态正从“功能覆盖”迈向“语义稳定、可治理、可集成、可规模化运营”的新阶段。

---

## 2. 各项目活跃度对比

| 项目 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 活跃特征 |
|---|---:|---:|---|---|
| dbt-core | 7 | 3 | 无新版本发布 | 讨论集中在 snapshots、graph/macros、解析性能、Python UDF 企业集成 |
| Apache Spark | 0 | 10+（重点PR 10项，另有补充PR） | 无新版本发布 | 高度活跃，重心在 SQL 语义、Streaming 状态存储、Spark Connect、JDK/Python 工具链 |
| Substrait | 0 | 1 | 无新版本发布 | 活跃度较低，但 PR 涉及 breaking change，规范影响面大 |

**简要判断：**
- **最活跃**：Spark  
- **讨论最集中、问题导向最明显**：dbt-core  
- **更新最少但规范影响最深**：Substrait  

---

## 3. 共同关注的功能方向

尽管三个项目所处层次不同，但从今日动态中可以看到若干共同关注方向：

### 3.1 语义正确性与一致性
| 方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| SQL/类型/执行语义正确性 | Spark、Substrait、dbt-core | Spark 修复 `dropDuplicates + exceptAll` 内部错误，补充 `TIMESTAMP WITH LOCAL TIME ZONE`；Substrait 修正 `add:date_iyear` 返回类型；dbt-core 则聚焦 snapshot 重复行、配置语义误解等正确性问题 |

**分析：**  
三者都在处理“语义偏差带来的生产风险”，只是层级不同：Spark 在执行引擎层，Substrait 在规范层，dbt-core 在数据建模/变更跟踪层。

---

### 3.2 工程可维护性与可诊断性
| 方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| 更好的排障与维护体验 | dbt-core、Spark | dbt-core 改进 snapshot unique-key 报错、解析 disabled models、可配置 seed 限制；Spark 修复 flaky test、更新测试耗时、增强文档和工具链一致性 |

**分析：**  
社区已经不满足于“功能存在”，而是开始系统性优化 **错误信息、测试稳定性、CI 效率、配置可理解性**。

---

### 3.3 面向大规模生产环境的性能与稳定性
| 方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| 性能与资源效率 | dbt-core、Spark | dbt-core 关注 disabled models 解析开销；Spark 重点优化 RocksDB state store、stream-stream join、Connect 状态机稳定性 |

**分析：**  
这反映出项目均已进入更深层次的生产化阶段：问题不再是“能不能用”，而是“在大规模和长周期运行下是否足够稳、够省、易控”。

---

### 3.4 企业化集成与平台能力增强
| 方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| 更强的企业环境适配能力 | dbt-core、Spark、Substrait | dbt-core 关注私有 PyPI、graph 宏元数据暴露；Spark 推进 Catalog V2、Connect、JDK/Python 兼容治理；Substrait 则通过更严格规范支撑跨系统计划交换 |

**分析：**  
三者都在向企业级平台能力靠拢，只是体现形式不同：  
- dbt-core：治理与开发平台化  
- Spark：执行与接口平台化  
- Substrait：互操作规范平台化  

---

## 4. 差异化定位分析

### 4.1 dbt-core：偏“开发平台层/转换治理层”
- **功能侧重**：数据建模、快照、Jinja 宏、manifest/graph 元数据、包化复用、开发体验。
- **目标用户**：分析工程师、数据平台团队、dbt 包维护者、治理工具开发者。
- **技术路线**：以 SQL/Jinja 为核心，逐步增强 Python 能力与项目元数据可编程性。
- **今日信号**：社区关注点高度贴近真实工程使用摩擦，如 snapshots 稳定性、解析性能、企业依赖管理。

**定位总结**：  
dbt-core 正从“SQL 转换工具”进一步演化为 **可编程的数据开发控制平面**。

---

### 4.2 Apache Spark：偏“底层统一计算引擎”
- **功能侧重**：批流一体执行、SQL 引擎、状态存储、Catalog V2、Spark Connect、多语言运行时。
- **目标用户**：数据工程师、平台工程师、流处理团队、湖仓基础设施团队。
- **技术路线**：在保持通用计算引擎定位的同时，持续向标准 SQL、远程交互式执行、现代湖仓接口收敛。
- **今日信号**：PR 活跃度高，问题覆盖 SQL、Streaming、Connect、JDK、Python，说明其仍是多战线并行演进的大型基础设施项目。

**定位总结**：  
Spark 依然是 OLAP/数据处理生态中的 **核心执行底座**，其演进重心是语义稳定、性能优化与接口统一。

---

### 4.3 Substrait：偏“跨引擎计划与语义规范层”
- **功能侧重**：函数签名、类型系统、表达式/计划表示、跨系统互操作语义。
- **目标用户**：查询引擎开发者、优化器/编译器开发者、数据系统集成方。
- **技术路线**：通过独立规范建立中立的查询计划表示，提升不同引擎间的互通性。
- **今日信号**：虽然仅 1 个 PR，但直接涉及 breaking change，说明其单次变更的信息密度和系统影响力很高。

**定位总结**：  
Substrait 不是面向普通数据分析师的工具，而是面向引擎生态的 **语义中间层标准**。

---

## 5. 社区热度与成熟度

### 5.1 社区热度
- **Spark：最高**
  - 今日无 Issue 更新，但 PR 数量明显最多，且覆盖面广。
  - 表明 Spark 社区更多通过代码推进而非需求讨论体现活跃度。
- **dbt-core：中高**
  - 更新 Issue 7 个、PR 3 个，讨论更集中在用户痛点和特性诉求。
  - 社区呈现较强的产品反馈闭环特征，issue 到 PR 的转化速度较快。
- **Substrait：较低但高杠杆**
  - 更新少，不代表不重要；其变更常常影响下游多个引擎实现。

### 5.2 成熟度与迭代阶段
| 项目 | 成熟度判断 | 当前阶段特征 |
|---|---|---|
| dbt-core | 高成熟，但仍在快速扩展平台能力 | 从建模工具向元数据平台/企业开发平台演进 |
| Spark | 非常成熟，持续深度优化 | 大项目稳定演进期，重点在语义收敛、性能和兼容治理 |
| Substrait | 规范成熟度提升中 | 仍处于标准精修阶段，小改动也可能带来 breaking impact |

**总体判断：**
- **Spark**：成熟基础设施的持续精修期  
- **dbt-core**：成熟产品的能力扩展期  
- **Substrait**：规范强化与生态渗透期  

---

## 6. 值得关注的趋势信号

### 6.1 从“功能可用”转向“语义稳定”
今日三个项目最一致的信号是：**正确性优先级显著上升**。  
- dbt-core：snapshot 重复行、配置语义误判  
- Spark：Catalyst 属性传递、时间类型语法、ANSI 语义  
- Substrait：函数返回类型纠偏  

**对数据工程师的参考价值：**  
未来选型和升级时，不应只关注新功能，而应重点评估：
- 类型语义是否变化
- 报错与兼容行为是否调整
- 旧逻辑在新版本下是否会出现 silent behavior change

---

### 6.2 元数据、规范和接口正在成为新的竞争点
dbt-core 强化 graph/macros 可见性，Spark 强化 Catalog V2/Connect，Substrait 强化函数语义规范。  
这说明 OLAP 生态的竞争正从单点执行性能，扩展到：
- 元数据可编程能力
- 跨系统接口一致性
- 规范驱动的互操作性

**对数据工程师的参考价值：**  
未来平台建设中，工具链选择应关注：
- 是否便于自动化治理
- 是否支持标准化接口
- 是否能与多引擎环境协同

---

### 6.3 企业级依赖与运行环境治理正在上升
dbt-core 提出私有 PyPI 包支持，Spark 持续处理 JDK/Python 工具链兼容。  
这反映出社区开始更认真地面对生产环境中的：
- 依赖供应链
- 安全合规
- 内部包管理
- 运行时版本一致性

**对数据工程师的参考价值：**  
数据平台建设不再只是 SQL 和作业编排问题，已经越来越涉及：
- 包管理策略
- 环境封装
- CI/CD 与制品治理
- 跨语言依赖统一

---

### 6.4 流式与交互式场景仍在持续深化
Spark 今日多个 PR 指向 Structured Streaming 和 Spark Connect，说明：
- 流处理仍是核心投入方向
- 远程交互式执行和服务化入口的重要性持续提升

**对数据工程师的参考价值：**  
若团队正建设实时数仓、特征平台、Notebook 服务化分析环境，Spark 4.x 相关方向值得持续跟踪，尤其是：
- 状态存储优化
- Connect 稳定性
- 流式文档和 API 完整度

---

### 6.5 dbt 正在走向更深的平台化
从 snapshots、graph/macros 到 Python UDF 私有依赖管理，dbt-core 的今日动态说明其角色正在变化：  
它不再只是转换层工具，而在向 **企业数据开发平台入口** 演进。

**对数据工程师的参考价值：**  
如果团队已经将 dbt 用于大规模项目，应提前关注：
- snapshot 可靠性边界
- manifest/graph 自动化能力
- 大型项目解析性能
- Python 能力在生产环境中的依赖治理

---

## 结论

从 2026-03-16 的社区动态看，OLAP 基础设施生态呈现出清晰分层：

- **dbt-core**：聚焦开发与治理层，强调稳定性、可编程元数据和企业化能力；
- **Spark**：作为执行底座，持续推进 SQL/Streaming/Connect 的语义与性能演进；
- **Substrait**：作为规范层，虽更新少，但对跨引擎一致性影响深远。

对技术决策者而言，当前最值得关注的不是单一项目是否“更火”，而是这三类能力如何形成协同：
1. **dbt 负责建模与开发体验**
2. **Spark 负责执行与性能底座**
3. **Substrait 负责跨系统语义互通**

如果你愿意，我可以继续把这份报告再加工成以下任一版本：
1. **适合管理层汇报的一页纸摘要**
2. **适合飞书/Slack 发布的 300 字简版**
3. **适合周报场景的“趋势 + 风险 + 建议”版本**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时内，dbt-core 没有新版本发布，社区讨论重点集中在 **Snapshots 能力、图上下文可见性、解析性能与 Python UDF 依赖管理** 等方向。  
其中最值得关注的是：**`graph` 上下文中补充 macros 元数据的需求，已经快速进入社区 PR 阶段**；同时，**snapshot `check` 策略可能产生重复行** 的问题仍在持续发酵，说明快照稳定性依然是核心关注点。

---

## 3. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 共 7 条，以下按“值得关注程度”进行梳理。由于原始数据仅包含 7 条更新 Issue，因此本节列出全部 7 条。

### 1) Snapshot `check` 策略有时会产生重复行
- **Issue**: [#11235](https://github.com/dbt-labs/dbt-core/issues/11235)
- **标题**: [Bug] Using snapshots with `check` strategy sometimes creates duplicate rows
- **为什么重要**: 这是今天最值得关注的稳定性问题之一。Snapshot 是 dbt 中保障历史变更追踪的重要能力，一旦 `check` 策略出现重复行，会直接影响 SCD 历史表的正确性，进而影响审计、回溯分析与下游指标口径。
- **社区反应**: 评论 14、👍 2，是当前更新列表中讨论度最高的议题，说明该问题具有一定普遍性，且已引发实际使用者关注。
- **观察**: 该问题与快照判重、变更检测以及并发/源表状态变化有关的可能性较高，建议使用 snapshots 的团队重点跟踪。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/11235

### 2) 仅用于防删表的“轻量化 snapshot”需求
- **Issue**: [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)
- **标题**: [Feature] Support streamlined snapshots when intention is only to mitigate against deletions in the source table
- **为什么重要**: 该需求反映出社区并不总是需要完整 SCD 语义，很多场景只是希望在源表记录被删除时保留“兜底副本”。这说明 snapshot 的能力模型可能偏重，用户希望有更低成本、更轻量的历史保护模式。
- **社区反应**: 评论 3，热度不高，但方向明确，代表典型实际诉求。
- **观察**: 如果未来落地，可能会成为 snapshot 能力分层的重要一步：完整历史跟踪 vs. 删除保护。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/11867

### 3) 希望将 macros 加入 graph 上下文变量
- **Issue**: [#12647](https://github.com/dbt-labs/dbt-core/issues/12647)
- **标题**: [Feature] Add macros to the graph context variable
- **为什么重要**: 这是今天最有“立刻推进”迹象的功能需求。当前 `graph` 暴露了 nodes、sources、metrics、exposures 等资源，但 macros 缺失，限制了 Jinja 中基于全局元数据进行更高级别自动化、治理和元编程的能力。
- **社区反应**: 评论 2，但更关键的是已经有对应社区 PR 提交（见 PR #12656），说明需求与实现之间的路径很短。
- **观察**: 该改动对高级宏开发者、包作者、平台团队尤其有价值。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/12647

### 4) 停止解析 disabled models
- **Issue**: [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)
- **标题**: [Feature] Stop parsing disabled models
- **为什么重要**: 这是一个典型的 **解析性能 / 项目规模治理** 问题。对于将 dbt project 作为 package 复用、且默认关闭大量模型的团队来说，继续解析 disabled models 会带来额外编译成本和开发体验负担。
- **社区反应**: 评论 2，讨论不算热烈，但问题具有普适性，尤其是在大型多包项目中。
- **观察**: 这类诉求通常意味着 dbt 在 enterprise 级项目中的解析开销正在成为显性痛点。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/11955

### 5) 改进 snapshot unique-key 报错信息
- **Issue**: [#10864](https://github.com/dbt-labs/dbt-core/issues/10864)
- **标题**: Improve error messaging for snapshots: unique-key error
- **为什么重要**: 这是一个“看似小、实际影响大”的开发体验问题。snapshot 的 unique-key 配置一旦出错，往往会导致排障成本很高；更好的错误信息能显著降低学习门槛和误用风险。
- **社区反应**: 评论 1，热度较低，但被标记为 `good_first_issue`，说明维护者认为问题边界清晰，适合作为社区贡献切入点。
- **观察**: 这也反映出 snapshot 相关问题不仅在功能正确性上有诉求，在可诊断性上同样存在欠缺。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/10864

### 6) `static_analysis: off` 被解释为 `false`
- **Issue**: [#12015](https://github.com/dbt-labs/dbt-core/issues/12015)
- **标题**: [Bug] `static_analysis: off` interpreted as `false`
- **为什么重要**: 这是一个典型的 **配置语义一致性** 问题。`off` 与布尔 `false` 的解释差异，可能会导致 Fusion 相关新配置行为偏离用户预期，影响配置迁移与兼容性。
- **社区反应**: 评论 1，且已带 `stale` 标签，说明当前推进较慢。
- **观察**: 尽管热度不高，但此类问题往往在大规模配置治理、自动化生成配置时更容易暴露。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/12015

### 7) Python UDF 中使用私有 PyPI 包
- **Issue**: [#12655](https://github.com/dbt-labs/dbt-core/issues/12655)
- **标题**: [Feature] Private PyPI packages in Python UDFs
- **为什么重要**: 这是 dbt 向更复杂 Python 工作负载演进时的重要一环。企业场景中大量逻辑依赖内部包、专有 SDK 或私有算法库，若 Python UDF 不能方便接入私有 PyPI，将限制生产级应用落地。
- **社区反应**: 新 issue，暂无评论，但方向非常明确，且高度贴合企业数据平台需求。
- **观察**: 该需求背后是 dbt Python 能力从“能跑”走向“可企业化集成”。
- **链接**: https://github.com/dbt-labs/dbt-core/issues/12655

---

## 4. 重要 PR 进展

> 说明：过去 24 小时内更新的 PR 共 3 条，以下列出全部 3 条。

### 1) 将 macros 加入 manifest flat graph，供 graph API / Jinja 访问
- **PR**: [#12656](https://github.com/dbt-labs/dbt-core/pull/12656)
- **标题**: Add macros to manifest flat graph to be accessed in graph API through jinja
- **状态**: OPEN
- **价值**: 这是今天最关键的功能性 PR，直接响应 Issue #12647。它将补齐 `graph` 上下文对 macro 元数据的可见性，使宏开发、项目 introspection、治理型工具和高级自动化能力进一步增强。
- **影响面**: 面向高级 dbt 开发者、包作者、元编程使用者。
- **观察**: 从 issue 到 PR 的响应很快，说明社区对这个能力补齐较认可。
- **链接**: https://github.com/dbt-labs/dbt-core/pull/12656

### 2) 让 `MAXIMUM_SEED_SIZE_MIB` 可配置
- **PR**: [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)
- **标题**: Make MAXIMUM_SEED_SIZE_MIB configurable
- **状态**: OPEN
- **价值**: 当前 seed（CSV）存在默认大小限制，此 PR 希望将上限改为可配置，提升对不同团队数据装载策略的适配性。对使用 seeds 进行小规模维表初始化、测试数据分发或轻量配置表管理的团队而言，这是很实用的增强。
- **影响面**: 使用 seed 进行数据分发或 CI/测试场景的团队。
- **观察**: 这是一个偏工程实用型改进，不是高热度功能，但很可能解决长期存在的边界约束问题。
- **链接**: https://github.com/dbt-labs/dbt-core/pull/11177

### 3) 更新 pytest-split 测试时长数据
- **PR**: [#12654](https://github.com/dbt-labs/dbt-core/pull/12654)
- **标题**: Update test durations for pytest-split
- **状态**: CLOSED
- **价值**: 这是自动化维护型 PR，用于更新 pytest-split 依赖的测试耗时数据，以便更均衡地分配并行测试负载，缩短 CI 执行时间并提升稳定性。
- **影响面**: 主要影响项目维护效率与 CI 体验。
- **观察**: 虽然不是功能更新，但反映出 dbt-core 对测试基础设施和工程效率的持续维护。
- **链接**: https://github.com/dbt-labs/dbt-core/pull/12654

---

## 5. 功能需求趋势

基于今日更新的 Issues，可以提炼出 dbt-core 社区当前几个明显的功能方向：

### 1) Snapshot 能力仍是高关注区
- 相关议题：
  - [#11235](https://github.com/dbt-labs/dbt-core/issues/11235)
  - [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)
  - [#10864](https://github.com/dbt-labs/dbt-core/issues/10864)
- **趋势解读**: 社区对 snapshots 的诉求正在分化为三类：
  1. **正确性**：避免重复行等数据质量问题；
  2. **简化能力模型**：并非所有用户都需要完整历史跟踪；
  3. **可诊断性**：报错信息需要更清晰。
- **结论**: snapshot 已从“是否可用”进入“是否稳定、是否易用、是否足够轻量”的阶段。

### 2) 元数据可见性与 graph API 扩展
- 相关议题：
  - [#12647](https://github.com/dbt-labs/dbt-core/issues/12647)
  - [#12656](https://github.com/dbt-labs/dbt-core/pull/12656)
- **趋势解读**: 社区越来越希望在 Jinja/graph 层面获取更完整的 manifest 元数据，以支持高级宏、自动化治理、项目分析和包级工具开发。
- **结论**: dbt 正在被更多团队当作“可编程元数据平台”使用，而不仅是 SQL 编译器。

### 3) 大型项目的解析性能与编译效率
- 相关议题：
  - [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)
- **趋势解读**: disabled models 仍被解析，暴露出大型项目、多 package 架构下的性能痛点。随着项目规模扩大，解析阶段效率问题会越来越突出。
- **结论**: 解析性能优化会继续成为平台团队和重度用户关注重点。

### 4) Python 工作负载的企业化集成
- 相关议题：
  - [#12655](https://github.com/dbt-labs/dbt-core/issues/12655)
- **趋势解读**: Python UDF 能力开始触及企业真实需求：私有包、内部依赖、受控软件供应链。
- **结论**: dbt 的 Python 生态诉求正从基础能力走向生产级依赖管理。

### 5) 配置语义一致性与可预期行为
- 相关议题：
  - [#12015](https://github.com/dbt-labs/dbt-core/issues/12015)
  - [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)
- **趋势解读**: 用户希望配置项语义更清晰、限制更少硬编码、系统行为更可解释。
- **结论**: “可配置、可理解、可迁移”正在成为社区对 dbt-core 配置体系的共同期待。

---

## 6. 开发者关注点

结合今日更新内容，当前开发者最关心的痛点主要集中在以下几方面：

### 1) Snapshot 的稳定性、边界行为和排障成本
- 重复行 bug、unique-key 报错信息不足、仅防删除的轻量诉求，说明 snapshots 虽然功能重要，但在生产使用中仍有不少边界摩擦。
- 相关链接：
  - [#11235](https://github.com/dbt-labs/dbt-core/issues/11235)
  - [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)
  - [#10864](https://github.com/dbt-labs/dbt-core/issues/10864)

### 2) 更强的项目 introspection 与元数据编程能力
- 开发者希望在 Jinja 中访问更完整的 graph 信息，尤其是 macros，这反映出 dbt 在平台化、自动化和治理场景中的使用深度正在提升。
- 相关链接：
  - [#12647](https://github.com/dbt-labs/dbt-core/issues/12647)
  - [#12656](https://github.com/dbt-labs/dbt-core/pull/12656)

### 3) 大型工程中的性能问题开始显性化
- disabled models 仍参与解析，意味着在复杂 monorepo、共享 package、分层项目中，开发者对解析/编译性能越来越敏感。
- 相关链接：
  - [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)

### 4) 企业级 Python 依赖管理需求增强
- Python UDF 若不能接入私有 PyPI，将限制很多企业内部算法和 SDK 的复用。这个需求背后是更严格的生产环境管理诉求。
- 相关链接：
  - [#12655](https://github.com/dbt-labs/dbt-core/issues/12655)

### 5) 配置行为要“更符合直觉”
- 从 `static_analysis: off` 的解析问题，到 seed 大小上限可配置，开发者期待 dbt-core 降低“隐藏规则”和“硬编码限制”。
- 相关链接：
  - [#12015](https://github.com/dbt-labs/dbt-core/issues/12015)
  - [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)

---

## 附：今日结论

今天的 dbt-core 社区动态，核心信号可以概括为一句话：**社区正在同时推动“核心能力更稳”（snapshot、配置语义）与“高级能力更强”（graph/macros、Python UDF 企业集成）**。  
如果你是数据平台团队或 dbt 包维护者，建议优先关注：
1. Snapshot 相关 bug 与易用性改进；
2. `graph` 上下文扩展的 PR 进展；
3. 大型项目解析性能与 Python 依赖管理能力的后续演化。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时内，Spark 社区没有新版本发布，也没有新的 Issue 更新，社区讨论重心几乎全部集中在 Pull Request 上。  
从 PR 分布看，热点主要落在 **SQL 语义与兼容性修复、Structured Streaming 状态存储优化、Spark Connect 稳定性、以及 Python/文档维护** 四个方向。  
尤其值得关注的是，近期多项改动同时指向 **Spark 4.x 时代的语义收敛、JDK 兼容性清理、以及流式状态管理性能提升**。

---

## 2. 重要 PR 进展

> 说明：过去 24 小时内无 Issue 更新，因此“社区热点 Issues”与“功能需求趋势”将主要结合 PR 动向进行提炼。

### 1) Spark Connect 修复 Pending 状态中断异常
- **PR**: #54774  
- **标题**: `[SPARK-53339][CONNECT] Fix interrupt on pending operations by moving postStarted() and allowing Pending to Canceled/Failed transition`  
- **链接**: https://github.com/apache/spark/pull/54774
- **看点**:
  - 修复 Spark Connect 中操作仍处于 `Pending` 状态时被中断，导致 `IllegalStateException` 并进入损坏状态的问题。
  - 这是典型的 **连接层状态机一致性修复**，对远程交互式执行、Notebook 场景和长尾请求取消能力很关键。
- **意义**:
  - Spark Connect 正在成为 Spark 生态的重要入口，这类状态转换与取消语义问题直接影响用户体验和服务稳定性。
  - 也说明社区仍在持续打磨 Connect 的生产可用性。

---

### 2) Structured Streaming：流流 Join 的 LeftSemi 优化
- **PR**: #54769  
- **标题**: `[SPARK-55973][SS] LeftSemi optimization for stream-stream join`  
- **链接**: https://github.com/apache/spark/pull/54769
- **看点**:
  - 针对 **stream-stream join 的 LeftSemi join** 做状态存储相关优化。
  - 重点是减少不必要的状态保留与扫描，改进现有实现遗漏的优化路径。
- **意义**:
  - 对低延迟流处理和状态成本控制非常重要。
  - 这是 Structured Streaming 走向更高性能、更低状态开销的持续信号，尤其利好复杂实时 ETL 和实时特征处理场景。

---

### 3) RocksDB State Store：为 prefixScan 设置上界
- **PR**: #54816  
- **标题**: `[SPARK-55997][SS] Set upper bound to prefixScan in RocksDB state store provider`  
- **链接**: https://github.com/apache/spark/pull/54816
- **看点**:
  - 为 RocksDB state store 的 `prefixScan` 增加 upper bound，帮助 RocksDB 在越界后更早停止扫描。
  - 涉及带 column family 的迭代器行为优化。
- **意义**:
  - 这是非常实用的 **底层状态存储性能优化**，可减少无效 seek/scan。
  - 对大状态流任务、窗口计算、join/stateful aggregation 等场景会有直接收益。

---

### 4) 修复 RocksDB bounded memory 测试抖动
- **PR**: #54808（已关闭）  
- **标题**: `[SPARK-55993][SS][TEST] Fix flaky RocksDBStateStoreIntegrationSuite bounded memory test`  
- **链接**: https://github.com/apache/spark/pull/54808
- **看点**:
  - 修复 `RocksDBStateStoreIntegrationSuite` 中 bounded memory 用例的 flaky 问题。
  - 核心原因是异步资源释放与测试断言时机不稳定。
- **意义**:
  - 虽然是测试修复，但对流式状态存储模块很关键。
  - 测试稳定性提升有助于减少 CI 噪音，加快状态存储相关特性的迭代速度。

---

### 5) SQL 修复：dropDuplicates + exceptAll 触发属性找不到内部错误
- **PR**: #54814  
- **标题**: `[SPARK-54724][SQL] Fix dropDuplicates(columns) followed by exceptAll causing INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND`  
- **链接**: https://github.com/apache/spark/pull/54814
- **看点**:
  - 修复 `dropDuplicates(columns)` 后接 `exceptAll` 时，由 expression ID 被错误重写引发的内部错误。
  - 方案是在 `ReplaceDeduplicateWithAggregate` 中保留原始表达式 ID。
- **意义**:
  - 这是 **Catalyst 语义正确性** 层面的修复。
  - 对依赖 DataFrame 组合算子的复杂 ETL 流水线影响较大，能避免难排查的执行期内部错误。

---

### 6) SQL 功能增强：to_json 支持 sort_keys
- **PR**: #54810  
- **标题**: `[SPARK-54878][SQL] Support sort_keys option inside to_json`  
- **链接**: https://github.com/apache/spark/pull/54810
- **看点**:
  - 为 `to_json` 增加 `sort_keys` 选项。
  - 可用于稳定 JSON 字段顺序，提升输出可重复性。
- **意义**:
  - 对日志落盘、审计、快照测试、跨系统比对尤其有用。
  - 这是一个小而实用的 API 增强，体现社区对细粒度易用性的持续打磨。

---

### 7) SQL DDL 演进：V2 支持 CREATE TABLE LIKE
- **PR**: #54809  
- **标题**: `[SPARK-33902][SQL] Support CREATE TABLE LIKE for V2`  
- **链接**: https://github.com/apache/spark/pull/54809
- **看点**:
  - 为 Data Source V2 / Catalog V2 体系补足 `CREATE TABLE LIKE` 能力。
  - 有助于统一 V1/V2 之间的 DDL 体验。
- **意义**:
  - 这是 **Catalog/V2 能力补齐** 的代表性工作。
  - 对 Iceberg、Delta、外部 Catalog 集成以及现代湖仓场景很关键，能降低迁移与使用门槛。

---

### 8) SQL 类型系统增强：支持 TIMESTAMP WITH LOCAL TIME ZONE 语法
- **PR**: #54813  
- **标题**: `[SPARK-55995][SQL] Support TIMESTAMP WITH LOCAL TIME ZONE in SQL syntax`  
- **链接**: https://github.com/apache/spark/pull/54813
- **看点**:
  - 在 SQL 语法层面支持 `TIMESTAMP WITH LOCAL TIME ZONE`。
  - 这类类型支持通常与 ANSI SQL 兼容、跨引擎互操作和 BI 工具适配密切相关。
- **意义**:
  - 体现 Spark SQL 正在继续向标准 SQL 语义靠拢。
  - 对跨系统迁移、JDBC/BI 对接、国际化时区场景具有较高价值。

---

### 9) CORE：移除默认 `jdk.reflect.useDirectMethodHandle=false`
- **PR**: #54815  
- **标题**: `[SPARK-55996][CORE] Remove default jdk.reflect.useDirectMethodHandle=false`  
- **链接**: https://github.com/apache/spark/pull/54815
- **看点**:
  - 清理历史上为 Java 18+ 兼容问题引入的默认 JVM 参数。
  - 与早年 PR #38190 的背景相呼应，说明 Spark 正在重新评估这项兼容性兜底策略。
- **意义**:
  - 这是 **JDK 演进与运行时兼容治理** 的一个明确信号。
  - 对升级 Java 版本、减少额外启动参数、统一默认行为都有帮助。

---

### 10) Python/工具链：升级 black 到 26.3.1
- **PR**: #54782  
- **标题**: `[SPARK-55986][PYTHON] Upgrade black to 26.3.1`  
- **链接**: https://github.com/apache/spark/pull/54782
- **看点**:
  - 升级 Python 格式化工具 `black`，并提到与安全依赖告警修复相关。
- **意义**:
  - 虽然不是用户功能，但体现出 Spark 对 **Python 贡献链路、依赖安全与开发体验** 的持续维护。
  - 对 PySpark 贡献者和 CI 环境一致性很重要。

---

## 3. 社区热点 Issues

过去 24 小时内 **没有新的 Issue 更新**，因此今天暂无可单列分析的热点 Issue。  
从日常观察和本次 PR 动向来看，社区当前的问题关注点更多通过 PR 直接体现，特别是以下几类：

1. **SQL 语义正确性与标准兼容**
2. **Structured Streaming 的状态存储性能与稳定性**
3. **Spark Connect 的执行状态管理**
4. **JDK / Python 工具链兼容性维护**
5. **Catalog V2 与现代湖仓接口能力补齐**

---

## 4. 功能需求趋势

基于本次活跃 PR，可提炼出 Spark 社区当前较明显的功能方向：

### 1) SQL 标准兼容与类型系统继续演进
- 代表 PR：
  - #54813 `TIMESTAMP WITH LOCAL TIME ZONE`
  - #54809 `CREATE TABLE LIKE for V2`
  - #54810 `to_json sort_keys`
  - #54695 移除错误信息中关闭 ANSI 的建议  
- 趋势判断：
  - Spark SQL 正在从“兼容大多数常见用法”继续迈向 **更完整的标准 SQL 支持**。
  - 同时，社区在减少“建议关闭 ANSI 绕过错误”的提示，意味着 **4.x 时代更强调规范语义而非宽松容错**。

### 2) Structured Streaming 深化优化，重点在状态存储
- 代表 PR：
  - #54769 LeftSemi stream-stream join 优化
  - #54816 RocksDB prefixScan 上界优化
  - #54808 RocksDB flaky test 修复
  - #54807 PySpark 流数据源 admission control 文档  
- 趋势判断：
  - 社区对流式处理的关注，已从“功能可用”进一步转向 **状态成本、扫描效率、测试稳定性和开发者文档完善**。
  - RocksDB 相关改动密集，说明其仍是 Spark 流处理状态后端优化的重点区域。

### 3) Spark Connect 稳定性持续补课
- 代表 PR：
  - #54774 Pending 状态中断修复
- 趋势判断：
  - Connect 仍在快速走向成熟，当前重点是 **请求生命周期管理、取消语义、异常恢复与状态机正确性**。
  - 对服务化 Spark、远程开发体验和多语言客户端都很关键。

### 4) 平台兼容与历史包袱清理
- 代表 PR：
  - #54815 移除默认 JDK 反射参数
  - #38190 历史相关 PR 被再次关联更新
  - #54782 Python black 升级  
- 趋势判断：
  - 社区正在同步推进 **JVM 侧兼容策略收敛** 与 **Python 工具链现代化**。
  - 这类工作虽不直接新增功能，但对构建稳定性、运行一致性和长期维护成本影响很大。

---

## 5. 开发者关注点

结合今日 PR 更新，可总结出当前开发者的高频痛点与诉求：

### 1) 查询计划语义稳定性
- `dropDuplicates` 与 `exceptAll` 组合触发内部错误，说明开发者仍然非常关注 **Catalyst 在复杂算子组合下的表达式 ID 与属性传递正确性**。
- 这类问题往往难以通过业务层规避，因此社区会优先修复。

### 2) 流式状态管理性能与资源可控性
- RocksDB 的扫描边界、内存管理、测试抖动等问题持续出现，说明开发者对 **状态后端性能、资源释放时机、以及长期运行稳定性** 非常敏感。
- 对生产实时任务来说，这些问题比单纯 API 增强更重要。

### 3) DDL / Catalog V2 能力仍需补齐
- `CREATE TABLE LIKE for V2`、catalog 解析优先级等改动表明，开发者希望 Spark 在现代 Catalog 体系中提供 **更完整、统一、可迁移的 DDL 体验**。
- 这也是 Spark 对接湖仓生态的基础能力。

### 4) ANSI 默认开启后的错误体验
- 移除错误信息中“建议关闭 ANSI”的提示，反映社区共识正在转向：  
  **不是教用户绕过错误，而是让语义和报错更加明确。**
- 这意味着开发者需要更稳定的类型、时间、边界值语义，也希望文档和错误信息更专业。

### 5) Python 用户需要更完整的流式文档与开发体验
- PySpark 流式数据源 admission control/AvailableNow 文档补充，以及 black 升级，说明 Python 开发者关注的不只是功能是否存在，还包括：
  - 文档是否足够清楚
  - 示例是否可直接使用
  - 本地开发与 CI 是否一致

---

## 6. 附：其他值得留意的 PR

### SQL 测试补强：_metadata 列解析 golden file
- **PR**: #54783  
- **链接**: https://github.com/apache/spark/pull/54783
- 通过补充 golden file 测试 `_metadata` 列解析，有助于提升元数据列相关语义的回归防护。

### Python 文档修复：timestamp_add docstring
- **PR**: #54792  
- **链接**: https://github.com/apache/spark/pull/54792
- 小修小补，但说明 PySpark API 文档一致性仍在持续维护。

### SQL 修复：warehouse 目录包含空格时的默认路径问题
- **PR**: #54794  
- **链接**: https://github.com/apache/spark/pull/54794
- 属于偏环境兼容的实用修复，对本地开发、桌面环境和某些企业部署路径配置有帮助。

### PySpark Streaming 文档增强
- **PR**: #54807  
- **链接**: https://github.com/apache/spark/pull/54807
- 面向自定义流式数据源补充 admission control 与 `Trigger.AvailableNow` 文档，利好 Python 流式扩展开发者。

### Catalog 解析优先级调整
- **PR**: #54765  
- **链接**: https://github.com/apache/spark/pull/54765
- 讨论 system catalog 在 `BUILTIN`、`SESSION` schema 下优先于 user catalog，属于较重要的解析语义与兼容性议题。

---

如果你愿意，我还可以继续把这份日报转换成：
1. **适合飞书/Slack 发布的简版**  
2. **适合公众号/博客的长版周报风格**  
3. **带优先级分层的“Spark Maintainer 视角”版本**

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新的 Release，也没有新的 Issue 更新，社区动态主要集中在 1 个仍处于开启状态的 PR。  
今天最值得关注的是一个涉及 **函数语义与类型系统一致性** 的修复：`add:date_iyear` 的返回类型将从 `timestamp` 更正为 `date`，并被明确标记为 **BREAKING CHANGE**，这对实现方的函数签名兼容性和跨引擎一致性具有直接影响。

---

## 4. 重要 PR 进展

> 过去 24 小时内仅有 1 个 PR 更新，以下为今日最重要进展。

### 1) PR #1007：修正 `add:date_iyear` 的返回类型为 `date`
- **状态**：OPEN  
- **作者**：@nielspardon  
- **创建时间**：2026-03-13  
- **最近更新**：2026-03-15  
- **点赞**：0  
- **链接**：https://github.com/substrait-io/substrait/pull/1007

**变更内容**  
该 PR 将 `add:date_iyear` 操作的返回类型从 `timestamp` 修正为 `date`。PR 摘要中明确说明，这是一个 **BREAKING CHANGE**。其核心逻辑是：当对 `date` 增加 `interval_year`（表示年/月间隔）时，结果应保持为 `date`，而不是提升为 `timestamp`。

**为什么重要**  
- 这是一个典型的 **类型语义纠偏**，有助于 Substrait 在函数扩展定义上保持严格一致。  
- 对于实现 Substrait 的查询引擎、表达式下推层、类型推导器和函数注册表来说，返回类型错误会导致：
  - 计划校验失败；
  - 执行时类型不匹配；
  - 不同引擎之间的行为不一致。  
- 因为被标记为 breaking change，下游实现方可能需要同步调整：
  - 函数签名映射；
  - 类型推导测试；
  - 兼容旧版本计划的适配逻辑。

**技术解读**  
这个修复反映出社区当前对 **日期/时间语义精确性** 的重视。`interval_year` 属于年-月粒度的区间，不携带时分秒信息，因此与 `date` 相加后继续返回 `date`，更符合大多数 SQL 引擎和日期运算直觉。

---

## 5. 功能需求趋势

由于过去 24 小时内 **没有新的 Issue 更新**，今天无法从活跃 Issue 中提炼出大规模的新趋势。不过，从当前唯一活跃 PR 可以观察到一个明确方向：

### 1) 类型系统与函数语义一致性
- 社区正在持续打磨 **函数签名定义的准确性**，尤其是日期/时间相关操作。
- 这类变更虽然表面上是“小修复”，但本质上会影响：
  - 计划可移植性；
  - 引擎间兼容性；
  - 规范实现的一致行为。

### 2) 更严格的跨引擎兼容语义
- Substrait 作为中立计划表示层，其函数定义必须足够严格，才能避免不同执行引擎在边界场景下产生歧义。
- 今天这个 PR 说明社区对 **“语义正确优先于向后兼容”** 持较明确态度，必要时会通过 breaking change 修正规范。

### 3) 日期/时间运算仍是高敏感区域
- 时间类型、区间类型和返回类型推导，一直是数据库与计算引擎中最容易出现分歧的部分。
- 今日 PR 表明，这一领域依然是 Substrait 规范演进中的重点关注对象。

---

## 6. 开发者关注点

结合今日动态，开发者侧值得重点关注的问题主要有：

### 1) Breaking Change 的适配成本
- 函数返回类型变化会直接影响已有实现和测试基线。
- 对接 Substrait 的开发者需要检查：
  - 是否依赖旧的 `timestamp` 返回类型；
  - 是否有基于返回类型的表达式重写逻辑；
  - 是否需要升级兼容层。  
- 相关链接：https://github.com/substrait-io/substrait/pull/1007

### 2) 函数签名与类型推导的精确实现
- 对规范消费者而言，不能只关注函数名，还必须严格实现参数类型与返回类型规则。
- 尤其在日期/区间运算中，任何轻微偏差都可能导致计划交换失败或语义漂移。  
- 相关链接：https://github.com/substrait-io/substrait/pull/1007

### 3) 规范变更对跨系统互操作的影响
- Substrait 的价值在于跨系统计划交换，因此此类语义修复往往会波及：
  - 计划生产端；
  - 计划消费端；
  - 中间校验工具链。  
- 开发者需要关注规范更新后的全链路一致性，而不是仅修改单点实现。  
- 相关链接：https://github.com/substrait-io/substrait/pull/1007

---

## 补充说明

### 2. 版本发布
过去 24 小时内 **无新版本发布**。

### 3. 社区热点 Issues
过去 24 小时内 **无 Issue 更新**，因此今日暂无可列出的热点 Issue。

---

如果你愿意，我还可以继续把这份日报整理成更适合公众号/飞书群发送的 **“精简版晨报格式”**，或者输出为 **Markdown 表格版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*