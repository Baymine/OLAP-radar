# OLAP 生态索引日报 2026-03-21

> 生成时间: 2026-03-21 01:14 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告  
**日期：2026-03-21**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出三个并行演进方向：一是**执行正确性与可观测性增强**，二是**类型/语义标准化加速**，三是**工程化与兼容性治理持续深化**。  
从社区动态看，dbt 正在补齐 microbatch 与错误语义规范，Spark 持续推进 SQL 类型系统、流状态可观测性与 Python 生态兼容，Substrait 则明显聚焦于 **1.0 前的规范收敛与扩展语义统一**。  
这说明 OLAP 生态已从“新增功能竞争”逐步转向“语义一致性、调试能力、跨系统互操作性”的深水区竞争。  
对数据团队而言，未来选型重点不再只是性能或功能覆盖，而是**可维护性、兼容性、标准对接能力**。

---

## 2. 各项目活跃度对比

| 项目 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 今日关注重点 |
|---|---:|---:|---|---|
| dbt-core | 5 | 5 | 无新版本发布 | microbatch 正确性、Windows 回归修复、异常体系规范化 |
| Apache Spark | 2 | 10 | 无新版本发布 | CI 安全策略失效、SQL 类型系统、Streaming 状态读取、PySpark/pandas 兼容 |
| Substrait | 1 | 9 | 无新版本发布 | URN 命名规范、扩展函数语义、测试语法增强、弃用机制治理 |

### 简要解读
- **Spark** 今日 PR 活跃度最高，说明主干开发面仍最广，覆盖 SQL、流处理、Python、History Server、工具链等多个面向。
- **dbt-core** Issues 与 PR 数量接近，且出现 “Issue → 当天修复 PR” 的快速联动，显示出较高的问题收敛效率。
- **Substrait** 虽然 Issue 数少，但 PR 密度高，且多数指向规范层和破坏性演进，体现出典型的**标准项目收敛期特征**。

---

## 3. 共同关注的功能方向

### 3.1 可观测性与调试能力增强
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：希望 `dbt compile` 输出 microbatch 每个 batch 的编译结果，解决批次 SQL 不透明的问题。
- **Spark**：为 stream-stream join 的 state format v4 增加状态读取支持，提升流状态排障与运维透明度。
- **Substrait**：通过增强测试语法、函数描述元数据、URN 规则澄清，提高规范与实现的可理解性与可验证性。

**共同诉求**：  
开发者不再满足于“能运行”，而是更关注**执行过程可解释、状态可检查、语义可验证**。

---

### 3.2 语义一致性与类型/参数规范化
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：用 `CompilationError` / `DbtException` 替代 Python 原生 `RuntimeError`，统一错误语义。
- **Spark**：推进 Types Framework、Schema Evolution、Geo Types，以及 pandas 语义对齐。
- **Substrait**：统一 option / enum arg 的边界，修正函数签名与类型定义，推动 URN 标识规范化。

**共同诉求**：  
生态正在从“实现功能”转向“定义稳定语义”，减少边界行为分歧，提升上下游工具集成稳定性。

---

### 3.3 兼容性与回归治理
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：修复 Windows 环境变量大小写回归，并计划 backport 到稳定分支。
- **Spark**：处理 GitHub Actions 安全策略引起的 CI 全局失败，以及 Spark 4.2.0-preview3 在 Scala 2.13 下的回归。
- **Substrait**：在推进移除废弃时间类型的同时补上 deprecation info，降低升级冲击。

**共同诉求**：  
大型生态都在强化**升级可预测性、兼容路径清晰度、回归定位效率**。

---

### 3.4 面向开发者体验的工程化完善
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：错误信息结构化、编译输出可见化。
- **Spark**：CI 工具链与 Python formatter 流程调整，补充性能 benchmark。
- **Substrait**：为函数实现增加 description、完善测试 grammar。

**共同诉求**：  
不仅关注最终执行引擎，也在提升**贡献者效率、用户理解成本、平台集成体验**。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 典型价值 |
|---|---|---|---|---|
| dbt-core | SQL 转换开发、模型编译、任务选择、增量建模 | 分析工程师、数据建模团队、现代数据平台团队 | 以声明式建模和编译框架为核心，强调开发体验与工程规范 | 提升数据建模生产力与团队协作一致性 |
| Apache Spark | 分布式计算、批流一体、SQL 引擎、ML/历史服务 | 数据平台工程师、实时计算团队、大数据基础设施团队 | 以统一计算引擎为核心，持续扩展 SQL/Streaming/Python/存储集成能力 | 承担大规模数据处理与多工作负载执行 |
| Substrait | 查询计划/函数/类型的跨引擎标准化 | 引擎开发者、查询优化器团队、连接器/编译器作者 | 以规范与中立表示层为核心，推动多引擎互操作 | 降低引擎之间的语义映射成本，促进生态互联 |

### 核心差异总结
- **dbt-core** 更偏上层开发范式与数据转换工作流。
- **Spark** 是执行层与平台层的主力基础设施。
- **Substrait** 位于标准层/语义层，解决跨系统表达与兼容问题。

三者并非竞争替代关系，而是构成 OLAP 生态中的**建模层—执行层—标准层**三种不同角色。

---

## 5. 社区热度与成熟度

### 5.1 社区热度
从今日动态量看：
- **Spark** 热度最高：10 个活跃 PR，覆盖面最广，说明社区规模和并行开发能力最强。
- **Substrait** 次之：9 个 PR，虽然表面量级接近 Spark，但更集中于规范收敛，讨论深度偏“标准治理”。
- **dbt-core** 活跃度稳定：5 个 Issue、5 个 PR，且修复链路短，说明维护节奏高效。

### 5.2 成熟度判断
- **Spark**：成熟度最高，但仍处于高频演进中。其问题更多来自复杂生态和庞大矩阵下的兼容与基础设施压力。
- **dbt-core**：产品与社区成熟度较高，当前进入“能力精修期”，重点是增量模型、错误体系、平台兼容等工程细节打磨。
- **Substrait**：处于**快速规范化迭代阶段**。从 URN、弃用机制、旧类型移除等信号看，正处于靠近 1.0 的收敛窗口，变化对生态影响会更深。

### 5.3 哪些项目更像“快速迭代阶段”
- **Substrait** 最明显：大量规范和破坏性调整表明它仍在快速定型。
- **dbt-core** 在 microbatch 等新能力上也仍处于快速补强阶段。
- **Spark** 则更像“成熟平台上的持续演进”，不是基础范式变动，而是多模块并进优化。

---

## 6. 值得关注的趋势信号

### 趋势一：OLAP 工具链正在补齐“可观测执行”
无论是 dbt 的 microbatch 编译可视化，还是 Spark 的流状态读取增强，都说明**调试与诊断能力正在成为核心产品力**。  
**参考价值**：数据工程团队在选型时，应把“排障成本”作为与性能同等重要的指标。

---

### 趋势二：语义标准化正在成为跨系统协作前提
Spark 在强化类型框架，dbt 在统一错误语义，Substrait 在规范函数参数和 URN 命名。  
**参考价值**：未来工具集成、跨引擎迁移、统一元数据治理，将越来越依赖稳定的语义层而不是 ad hoc 适配。

---

### 趋势三：兼容性治理比新增功能更能决定企业采用速度
Windows 回归、Scala 2.13 回归、CI 安全策略失效、弃用信息治理，这些都不是“新功能”，但都直接影响生产落地。  
**参考价值**：技术决策者应重点关注项目是否具备：
- 快速回归修复能力
- 明确的稳定分支策略
- 渐进式弃用机制
- 足够透明的兼容说明

---

### 趋势四：Python 与 SQL 双生态继续靠拢
Spark 今日多项工作指向 pandas 3.0 对齐与 Arrow UDF benchmark，dbt 则持续强化 SQL 编译开发体验。  
**参考价值**：未来 OLAP 基础设施的竞争，不只是 SQL 引擎能力，还包括对 Python 数据工作流、UDF 生态、Notebook/IDE 体验的支撑。

---

### 趋势五：标准层项目的重要性上升
Substrait 的动态表明，行业正在重视“跨引擎可交换语义表示”。  
**参考价值**：对于需要构建多引擎平台、联邦查询、统一优化器或 Lakehouse 互通能力的团队，标准层建设将越来越关键，不应只关注执行引擎本身。

---

## 结论

从 2026-03-21 的社区动态看，OLAP 生态已进入以**可观测性、语义一致性、兼容治理、标准化**为核心的演进阶段。  
- **dbt-core** 正在夯实建模层的正确性与开发体验。  
- **Spark** 继续扮演执行层中枢，但也暴露出超大生态下的 infra 与兼容复杂度。  
- **Substrait** 则在加快成为跨引擎语义标准的基础设施。  

对于数据工程师和技术决策者，这意味着未来的关键能力不只是“跑得快”，而是：
1. **语义是否稳定**  
2. **问题是否容易定位**  
3. **升级是否可控**  
4. **能否与更广泛生态互操作**

如果你愿意，我可以继续把这份内容整理成两种版本之一：  
1. **适合管理层汇报的一页纸简版**  
2. **适合工程团队周会同步的 Markdown 表格版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报 · 2026-03-21

> 数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

过去 24 小时内，dbt-core 没有新版本发布，但社区在 **微批增量（microbatch incremental）** 与 **异常处理/错误语义规范化** 两条线上明显升温。  
一方面，围绕 microbatch 的编译可观测性与 `incremental_batch` 参数传递缺陷，Issue 与 PR 已形成快速联动；另一方面，Windows 环境变量大小写回归问题也出现了带回移标签的修复 PR，说明兼容性修复正在推进。  
此外，核心维护者还连续提交了多项 PR，集中处理 **CompilationError / DbtException 替代原生 RuntimeError**，这通常意味着 dbt-core 在朝更一致的错误模型演进。

---

## 3. 社区热点 Issues

> 注：过去 24 小时内更新的 Issue 共 5 条，本日报基于现有数据挑选全部值得关注的 Issue 进行解读。

### 1) #12682 Bug: incremental_batch flag not propagated to middle/last batches in MicrobatchModelRunner.execute()
- **状态**：OPEN
- **为什么重要**：这是今天最值得关注的新问题之一，直接影响 microbatch incremental 模型在 `--full-refresh` 或初次运行时的正确性。如果中间批次和末尾批次错误地默认成增量批次，会导致 `is_incremental()` 判断失真，进而影响 SQL 分支逻辑。
- **社区反应**：问题创建当天就有对应修复 PR，说明复现路径清晰、影响面被快速确认。
- **链接**：[`Issue #12682`](https://github.com/dbt-labs/dbt-core/issues/12682)

### 2) #12592 [Feature] `dbt compile` list compiled code for each batch for microbatch incremental models
- **状态**：OPEN
- **为什么重要**：当前 microbatch 的调试体验仍偏弱，开发者希望 `dbt compile` 能输出每个 batch 的编译结果，以便验证批次边界、条件分支与 SQL 展开逻辑。对需要排查批次行为的团队，这属于非常实用的可观测性能力。
- **社区反应**：评论不多，但已经获得正向反馈（👍 2），反映出该需求虽小众，但十分贴近实际工程调试场景。
- **链接**：[`Issue #12592`](https://github.com/dbt-labs/dbt-core/issues/12592)

### 3) #10422 [Regression] Unable to access environment variables on Windows using lowercase variable names
- **状态**：OPEN
- **为什么重要**：这是一个明确的 **Windows 回归问题**。Windows 环境变量本身大小写不敏感，但 dbt 1.8 之后对小写变量名的访问失败，破坏了既有项目兼容性，尤其会影响跨平台团队和本地开发环境。
- **社区反应**：已有 15 条评论，且在今天出现修复 PR，并带有 `backport 1.11.latest` 标签，说明维护者认为该问题值得尽快纳入稳定分支。
- **链接**：[`Issue #10422`](https://github.com/dbt-labs/dbt-core/issues/10422)

### 4) #5009 [CT-469] Combine --select/--exclude with --selector when used together?
- **状态**：CLOSED
- **为什么重要**：这是一个持续时间很长的选择器语义问题，涉及 CLI 参数 `--select/--exclude` 与 YAML selector 的组合行为。对于大型项目的精细化任务编排，这直接关系到运行范围是否可预测。
- **社区反应**：26 条评论、👍 7，说明这是长期存在的高关注度用户体验问题。虽然已关闭，但它与今天另一个 selector 相关增强需求形成呼应，说明该方向仍未“降温”。
- **链接**：[`Issue #5009`](https://github.com/dbt-labs/dbt-core/issues/5009)

### 5) #10992 [Feature] add `selector:` method to combine YAML selectors with command line selection
- **状态**：CLOSED
- **为什么重要**：该需求试图提供一种更统一的 selector 组合方式，把 YAML selector 与命令行选择逻辑衔接起来。它本质上是在补齐 dbt 节点选择系统的表达能力。
- **社区反应**：虽然评论数不多，但获得了 👍 5，且在今天被更新，表明 selector 体系仍是社区持续关注的话题。
- **链接**：[`Issue #10992`](https://github.com/dbt-labs/dbt-core/issues/10992)

---

## 4. 重要 PR 进展

> 注：过去 24 小时内更新的 PR 共 5 条，以下全部纳入重点跟踪。

### 1) #12683 Fix: propagate incremental_batch to all microbatch submissions
- **状态**：OPEN
- **核心内容**：修复 `MicrobatchModelRunner.execute()` 中仅首批次传递 `incremental_batch` 的问题，使所有批次都能收到正确参数。
- **影响判断**：这是对 Issue #12682 的直接修复，若合并，可显著降低 microbatch 在 full-refresh / 初次运行下的逻辑偏差风险。
- **链接**：[`PR #12683`](https://github.com/dbt-labs/dbt-core/pull/12683)

### 2) #12681 fix: preserve case-insensitive env var lookup on Windows (#10422)
- **状态**：OPEN
- **核心内容**：恢复 Windows 上环境变量查找的大小写不敏感行为，避免 `env_var('local_user')` 无法读取 `LOCAL_USER` 的回归问题。
- **影响判断**：这是兼容性修复中的高优先级项，且带有 `backport 1.11.latest` 标签，意味着它可能会较快进入稳定维护分支。
- **链接**：[`PR #12681`](https://github.com/dbt-labs/dbt-core/pull/12681)

### 3) #12684 Fix cycle detection to raise CompilationError instead of built-in RuntimeError
- **状态**：OPEN
- **核心内容**：将环检测失败时抛出的异常从 Python 内建 `RuntimeError` 调整为 dbt 语义化的 `CompilationError`。
- **影响判断**：这类改动对最终功能影响不大，但对错误分层、日志可读性、上层调用方捕获异常的稳定性都很重要，是框架工程化成熟度提升的信号。
- **链接**：[`PR #12684`](https://github.com/dbt-labs/dbt-core/pull/12684)

### 4) #12686 Replace built-in RuntimeError with DbtException subclasses
- **状态**：OPEN
- **核心内容**：更系统地将原生 `RuntimeError` 替换为 dbt 自定义异常体系 `DbtException` 子类。
- **影响判断**：这是今天维护侧最有“底层治理”意味的 PR。若持续推进，后续 dbt-core 在错误码、报错一致性、IDE/平台集成上的体验会更可控。
- **链接**：[`PR #12686`](https://github.com/dbt-labs/dbt-core/pull/12686)

### 5) #12685 Use pre-jinja schemas for jsonschema deprecations
- **状态**：OPEN
- **核心内容**：在处理 jsonschema deprecations 时，改用 pre-jinja schemas。
- **影响判断**：该改动更偏向内部机制与校验链路治理，可能与配置解析、弃用提示准确性有关。虽然面向最终用户的可见度较低，但对 schema 演进和配置校验的一致性可能有长期价值。
- **链接**：[`PR #12685`](https://github.com/dbt-labs/dbt-core/pull/12685)

---

## 5. 功能需求趋势

结合今日更新的 Issues，可以看到社区关注点集中在以下几个方向：

### 1) 微批增量模型能力继续成为新热点
- 相关事项：#12592、#12682
- **趋势解读**：microbatch 已经从“可用”进入“需要更强调试性与正确性保障”的阶段。社区不再只关心能不能跑，而更关心：
  - 每个批次的编译结果是否可见
  - 批次上下文变量是否一致传递
  - `is_incremental()` 等语义在不同执行路径下是否稳定

### 2) 跨平台兼容性，尤其是 Windows 支持，仍有明显需求
- 相关事项：#10422、PR #12681
- **趋势解读**：虽然 dbt 用户主体仍以 Linux/macOS 为主，但 Windows 环境下的行为一致性问题一旦出现，往往直接影响企业内部开发机、BI 团队本地调试和 CI 兼容策略，因此修复优先级并不低。

### 3) 节点选择器（selector）表达能力与组合语义仍然是长期主题
- 相关事项：#5009、#10992
- **趋势解读**：dbt 项目规模越大，选择器越像“查询语言”。社区希望：
  - YAML selector 与 CLI 参数可组合
  - `--select / --exclude / --selector` 语义更统一
  - 执行范围更易预测、更少“误选/漏选”

### 4) 错误处理正在向“框架级规范化”演进
- 相关事项：PR #12684、#12686
- **趋势解读**：这说明维护团队在补齐底层工程质量，减少裸露的 Python 原生异常，让 dbt 的报错更结构化。这类变化通常有利于：
  - 更清晰的用户报错
  - 更稳定的异常捕获与测试
  - 更方便 dbt Cloud/IDE/插件生态集成

---

## 6. 开发者关注点

从今日活跃议题看，开发者的高频痛点主要集中在以下几个方面：

### 1) microbatch 的“可调试性不足”
开发者不仅要运行 microbatch，更需要理解每个 batch 的实际编译 SQL、变量上下文和执行分支。当前这部分透明度仍不足，导致问题排查成本较高。  
相关链接：[`Issue #12592`](https://github.com/dbt-labs/dbt-core/issues/12592)

### 2) 批次执行上下文的一致性问题
`incremental_batch` 未完整传递的问题说明，microbatch 在运行器层面的上下文传播仍可能存在边界缺陷。对依赖 `is_incremental()` 的模型来说，这类问题会直接影响结果正确性。  
相关链接：[`Issue #12682`](https://github.com/dbt-labs/dbt-core/issues/12682) ｜ [`PR #12683`](https://github.com/dbt-labs/dbt-core/pull/12683)

### 3) 平台兼容性回归会迅速影响生产与本地开发
Windows 环境变量大小写问题看似细节，实则是典型的“升级后原有项目失效”场景。开发者对这类回归容忍度很低，因此一旦出现，往往会推动快速修复与回移。  
相关链接：[`Issue #10422`](https://github.com/dbt-labs/dbt-core/issues/10422) ｜ [`PR #12681`](https://github.com/dbt-labs/dbt-core/pull/12681)

### 4) selector 体系仍需要更强的一致性与组合能力
随着项目规模上升，开发者越来越依赖 selector 做环境分层、任务裁剪和精确执行。当前 CLI 与 YAML selector 组合语义的复杂性，仍是社区反复提出的问题。  
相关链接：[`Issue #5009`](https://github.com/dbt-labs/dbt-core/issues/5009) ｜ [`Issue #10992`](https://github.com/dbt-labs/dbt-core/issues/10992)

### 5) 错误类型语义化是开发体验优化的重要一环
维护者今天提交的多项异常处理 PR 表明，dbt-core 正在减少原生异常泄露。对开发者而言，这意味着未来报错会更贴近 dbt 语境，更容易定位编译、解析、依赖图等阶段的问题。  
相关链接：[`PR #12684`](https://github.com/dbt-labs/dbt-core/pull/12684) ｜ [`PR #12686`](https://github.com/dbt-labs/dbt-core/pull/12686)

---

如果你愿意，我还可以继续把这份日报整理成更适合团队内部同步的 **“飞书/Slack 简版”** 或 **“周报汇总格式”**。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-21）

## 1. 今日速览

过去 24 小时内，Spark 社区没有新版本发布，但仓库动态非常活跃，重点集中在 **SQL 类型系统演进、Structured Streaming 状态读取能力增强、PySpark / pandas API 兼容性修复**，以及一项影响全仓库 CI 的 **GitHub Actions 安全策略变更**。  
其中最值得关注的是：Apache 组织层面的 GitHub Actions 新安全策略导致 Spark 当前 CI 普遍失败，这会直接影响 PR 合并节奏与版本交付稳定性。与此同时，Spark 4.2.0-preview3 暴露出一个 Scala 2.13 下的 Parquet 回归问题，也值得测试与发布相关贡献者重点关注。

---

## 3. 社区热点 Issues

> 注：过去 24 小时内更新的 Issue 仅 2 条，以下为全部值得关注的热点 Issue。

### 1) CI 因 Apache 新安全策略全面失效
- **Issue**: #54931 [OPEN] github actions are not working due to a new security policy  
- **重要性**: 这是当前最紧急的基础设施问题。由于 Apache 组织近期对 GitHub Actions 引入新的安全限制，Spark 现有 CI 工作流依赖的 action 已变为不受支持，导致“几乎所有 CI 都失败”。这不仅影响新 PR 的验证，也会阻塞 bugfix、功能合并与回归确认。
- **社区反应**: 目前还是占位/公告型 Issue，评论数为 0，说明问题刚暴露，但影响面极广，预计短期内会迅速成为维护者优先级最高的事项之一。
- **链接**: https://github.com/apache/spark/issues/54931

### 2) Spark 4.2.0-preview3 在 Scala 2.13 下出现 DecisionTreeClassifierSuite 回归
- **Issue**: #54916 [OPEN] DecisionTreeClassifierSuite fails in Spark 4.2.0-preview3 (Scala 2.13) with corrupted Parquet file error
- **重要性**: 该问题指向 **Spark 4.2.0-preview3 的测试稳定性与兼容性风险**，并且问题在 Spark 3.5.x 不存在，说明可能是近期变更引入的回归。错误表现为“损坏的 Parquet 文件”，这类问题往往不止影响单测，也可能反映底层读写路径或测试数据生成逻辑存在边界缺陷。
- **社区反应**: 当前评论数为 0，但由于给出了可复现路径，并关联到可能引入问题的 PR，具备较强排查价值。对于 Spark 4.2 预览版验证者尤其重要。
- **链接**: https://github.com/apache/spark/issues/54916

---

## 4. 重要 PR 进展

### 1) 简化 MERGE INTO Schema Evolution 的 schema 计算逻辑
- **PR**: #54934 [OPEN] [SPARK-56125][SQL] Simplify schema calculation code for Merge Into Schema Evolution
- **内容**: 将 `sourceSchemaForSchemaEvolution` 替换为更直接的 `pendingChanges`，并减少基于 path 的比较逻辑。
- **意义**: 属于 SQL schema evolution 代码收敛与可维护性提升。对 Lakehouse 场景下 `MERGE INTO` 演进能力的稳定推进很关键。
- **链接**: https://github.com/apache/spark/pull/54934

### 2) Structured Streaming：支持 stream-stream join 新状态格式 v4 的状态读取
- **PR**: #54845 [OPEN] [SPARK-55729][SS] Support state data source reader for new state format v4 on stream-stream join
- **内容**: 为 stream-stream join 的新 state format v4 增加 state data source reader 支持。
- **意义**: 明显增强流式状态可观测性与调试能力，尤其适合排查 join 状态膨胀、状态恢复和一致性问题。
- **链接**: https://github.com/apache/spark/pull/54845

### 3) 为 Arrow grouped aggregate UDF 增加 ASV 微基准
- **PR**: #54932 [OPEN] [SPARK-56085][PYTHON][TEST] Add ASV micro-benchmarks for SQL_GROUPED_AGG_ARROW_UDF and SQL_GROUPED_AGG_ARROW_ITER_UDF
- **内容**: 在 `bench_eval_type.py` 中加入两类 grouped aggregate Arrow UDF 的 ASV benchmark。
- **意义**: 这是典型的性能治理基础设施建设。对 PySpark Arrow UDF 的性能回归监控、优化收益量化都很重要。
- **链接**: https://github.com/apache/spark/pull/54932

### 4) pandas API on Spark：修复 `Series.cov` 的 numeric dtype 判定
- **PR**: #54933 [OPEN] [SPARK-56122][PS] Use pandas-aware numeric dtype check in Series.cov
- **内容**: 用 pandas 的 `is_numeric_dtype` 替代 NumPy 的 `np.issubdtype`。
- **意义**: 这是典型的 **pandas 语义兼容性修复**。可避免扩展 dtype 或 pandas 特殊 dtype 上抛出 `TypeError`，提升 pandas API on Spark 的行为一致性。
- **链接**: https://github.com/apache/spark/pull/54933

### 5) SQL Follow-up：清理 schema evolution 重构后的死引用
- **PR**: #54930 [OPEN] [SPARK-55690][SQL][Follow-up] Fix dead references
- **内容**: 删除无调用点的工具方法，并更新 `Analyzer` 注释。
- **意义**: 虽然是清理型 PR，但说明最近 SQL / V2 写入 schema evolution 的重构仍在持续收尾。对减少技术债、避免后续误用有正面价值。
- **链接**: https://github.com/apache/spark/pull/54930

### 6) History Server：允许缓存并复用 AppStatus
- **PR**: #54878 [OPEN] [SPARK-56093][CORE][HISTORY] Allow AppStatus to be cached and reused by the history server.
- **内容**: 完成应用后将 AppStatus 以 protobuf 形式持久化，并在 History Server 加载时直接复用。
- **意义**: 这可能显著改善 History Server 的加载性能和资源消耗，特别适用于事件日志体量大的生产环境。
- **链接**: https://github.com/apache/spark/pull/54878

### 7) pandas API on Spark：对齐 pandas 3.0 的 `GroupBy.quantile` 布尔类型行为
- **PR**: #54929 [OPEN] [SPARK-56118][PS] Match pandas 3.0 bool handling in GroupBy.quantile
- **内容**: 调整 bool dtype 的处理方式，并保留与 pandas 对齐的 warning 行为。
- **意义**: 持续推进 pandas 3.0 兼容，是 PySpark DataFrame API 易用性和迁移平滑性的关键一步。
- **链接**: https://github.com/apache/spark/pull/54929

### 8) SQL Geo 类型：支持预构建 SRID 注册表
- **PR**: #54780 [OPEN] [SPARK-55981][SQL] Allow Geo Types with SRID's fro the pre-built registry
- **内容**: 基于预编译的 Proj SRID 列表启用 Geometry / Geography 类型中的 SRID 支持。
- **意义**: 这是 Spark SQL 地理空间能力持续演进的重要信号。对 GIS、位置分析、时空数据处理场景有直接价值。
- **链接**: https://github.com/apache/spark/pull/54780

### 9) Python 工具链调整：默认禁用 black 检查
- **PR**: #54928 [OPEN] [SPARK-56018][PYTHON][FOLLOW-UP] Disable black check by default
- **内容**: 由于 Python formatter 已从 `black` 切换到 `ruff`，因此默认关闭 black check。
- **意义**: 这是开发工具链统一与 CI 降噪的必要跟进，有助于减少无效 lint 失败。
- **链接**: https://github.com/apache/spark/pull/54928

### 10) 类型框架推进：Types Framework Phase 1c 客户端集成
- **PR**: #54905 [OPEN] [SPARK-55441][SQL] Types Framework - Phase 1c - Client Integration
- **内容**: 推进 Spark SQL 类型框架的客户端集成阶段。
- **意义**: 属于中长期架构演进项。结合近期多项 SQL 类型、地理类型、表达式精度相关 PR，说明 Spark 正在系统性增强类型系统能力。
- **链接**: https://github.com/apache/spark/pull/54905

---

## 5. 功能需求趋势

基于今日更新的 Issues 与 PR，社区关注点主要集中在以下几个方向：

### 1) SQL 类型系统与语义一致性持续增强
近期多个 PR 指向类型框架、schema evolution、表达式语义、Geo Types、隐式类型转换等议题，说明 Spark SQL 正在从“功能支持”转向“类型系统完整性与可维护性提升”。  
**趋势判断**: 未来一段时间，SQL 类型抽象、V2 表能力、跨引擎语义对齐会继续是主线。  
**相关链接**:  
- https://github.com/apache/spark/pull/54934  
- https://github.com/apache/spark/pull/54905  
- https://github.com/apache/spark/pull/54780  
- https://github.com/apache/spark/pull/54912  

### 2) Structured Streaming 的状态可观测性与状态格式演进
stream-stream join 新状态格式 v4 的读取支持、状态数据源文档更新、状态上传策略讨论，反映出社区对流式状态调试、恢复、运维透明度的持续投入。  
**趋势判断**: 除性能优化外，状态 introspection 和状态运维工具化将成为 Structured Streaming 的重要演进方向。  
**相关链接**:  
- https://github.com/apache/spark/pull/54845  
- https://github.com/apache/spark/pull/54548  

### 3) PySpark / pandas API on Spark 的兼容性追赶
今日多项 PR 聚焦 pandas 3.0 行为对齐、dtype 兼容修复、API 参数类型放宽、Arrow UDF benchmark 建设。  
**趋势判断**: Python 生态兼容性已经不是边缘工作，而是 Spark 社区非常明确的主航道之一。  
**相关链接**:  
- https://github.com/apache/spark/pull/54933  
- https://github.com/apache/spark/pull/54929  
- https://github.com/apache/spark/pull/54708  
- https://github.com/apache/spark/pull/54932  

### 4) 基础设施与开发者工作流治理
CI 因组织安全策略失效、lint 工具链切换、AGENTS.md 改造，说明 Spark 社区正在同时面对“平台约束变化”和“开发流程现代化”的双重压力。  
**趋势判断**: 短期内 infra / CI 修复会优先于部分功能开发，因为它直接决定贡献吞吐。  
**相关链接**:  
- https://github.com/apache/spark/issues/54931  
- https://github.com/apache/spark/pull/54928  
- https://github.com/apache/spark/pull/54899  

### 5) 兼容性与跨版本稳定性仍是发布前关键风险点
Spark 4.2.0-preview3 在 Scala 2.13 下暴露测试回归，说明新版本预览阶段仍需重点关注多语言、多依赖矩阵下的稳定性。  
**趋势判断**: 4.2 分支后续会继续出现 preview 验证、回归修复、测试稳定性增强相关工作。  
**相关链接**:  
- https://github.com/apache/spark/issues/54916  

---

## 6. 开发者关注点

### 1) CI 不稳定正在成为当前最大阻塞项
GitHub Actions 安全策略变化导致大面积 CI 失败，这是最直接的开发效率痛点。对贡献者而言，问题不在代码本身，而在验证基础设施不可用。  
**影响**: PR 难以得到有效信号，review 与 merge 节奏都会放缓。  
**链接**: https://github.com/apache/spark/issues/54931

### 2) 新版本预览的回归验证压力增大
Spark 4.2.0-preview3 已出现 Scala 2.13 / Parquet 相关回归，提醒开发者在预览版升级时必须加强交叉矩阵测试。  
**影响**: 对依赖 MLlib、Parquet、Scala 2.13 的用户尤其需要谨慎验证。  
**链接**: https://github.com/apache/spark/issues/54916

### 3) Python 开发工具链切换需要尽快稳定
从 black 转向 ruff 后，默认检查逻辑仍需清理，说明工具迁移尚未完全闭环。  
**影响**: 容易造成本地格式化结果与 CI 检查不一致。  
**链接**: https://github.com/apache/spark/pull/54928

### 4) pandas 兼容性仍有大量细节工作
`Series.cov`、`GroupBy.quantile`、`withColumn/withColumns` 参数行为等都在持续调整。  
**影响**: 对依赖 pandas API on Spark 做平滑迁移的团队来说，边界语义仍需密切关注。  
**链接**:  
- https://github.com/apache/spark/pull/54933  
- https://github.com/apache/spark/pull/54929  
- https://github.com/apache/spark/pull/54708  

### 5) 流式状态可观测性需求越来越明确
针对 stream-stream join 状态读取与状态数据源文档补足的工作，反映出开发者需要更强的状态诊断工具。  
**影响**: 复杂实时作业的可调试性、状态问题定位效率将成为用户体验核心。  
**链接**:  
- https://github.com/apache/spark/pull/54845  
- https://github.com/apache/spark/pull/54548  

### 6) History Server 性能与可扩展性仍是运维侧长期关注点
AppStatus 缓存复用方案说明在大规模事件日志场景下，历史服务加载效率仍有优化空间。  
**影响**: 对长周期、海量 application 归档的企业环境尤为关键。  
**链接**: https://github.com/apache/spark/pull/54878

---

以上就是 **2026-03-21 Apache Spark 社区动态日报**。如果你愿意，我还可以继续把这份日报整理成更适合公众号/邮件发送的 **Markdown 简报版**，或者补一份 **面向 OLAP 团队的影响解读版**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-21）

## 1. 今日速览

过去 24 小时内，Substrait 主仓库没有新版本发布，但规范与扩展层面的演进非常活跃，焦点集中在 **URN 命名规范、扩展函数语义收敛、测试语法增强，以及弃用/破坏性变更治理**。  
今天最值得关注的信号是：社区正在一边推进 **1.0 命名与兼容性规范化**，一边加速清理历史遗留设计，例如弃用旧时间类型、完善扩展元数据、统一函数参数表达方式。

---

## 3. 社区热点 Issues

> 过去 24 小时内仅有 1 条 Issue 更新，以下按“值得关注程度”进行整理。当前可供分析的活跃 Issue 数量有限。

### 1) #1016 `[1.0] Register substrait in URN namespace`
- **重要性**：这是一个典型的 **标准化基础设施问题**。Substrait 已从 URI 切换到 URN 表达扩展标识，如果能在 IANA 官方命名空间中注册 `substrait`，将显著提升规范的正式性、跨实现一致性和长期可维护性。
- **为什么值得关注**：URN 是扩展发现、函数标识、类型扩展引用的根基。进入 IANA 注册体系后，Substrait 的扩展命名将更利于在多引擎、多语言 SDK、连接器生态中稳定传播。
- **社区反应**：当前为新建 Issue，尚无评论和点赞，说明仍处于提案早期，但其指向 **1.0 落地与官方命名治理**，后续大概率会成为规范层面的关键讨论点。
- **链接**：substrait-io/substrait Issue #1016

---

## 4. 重要 PR 进展

> 过去 24 小时内共有 9 个 PR 更新，以下全部列为重点动态。

### 1) #1012 `feat(extensions): support int arguments with std_dev and variance functions`
- **内容**：为 `std_dev` 和 `variance` 函数补充对整数参数的支持。
- **意义**：这是扩展函数覆盖面的直接增强，能让统计聚合函数的定义更贴近主流 SQL/OLAP 引擎实际行为，减少实现侧做隐式类型绕行的复杂度。
- **依赖关系**：该 PR 依赖 #1010 与 #1011，表明它不是孤立功能，而是建立在 **测试语法升级** 和 **参数语义调整** 之后的增量完善。
- **状态**：OPEN
- **链接**：substrait-io/substrait PR #1012

### 2) #1015 `[PMC Ready] fix(extensions)!: random extraneous argument for repeat varchar`
- **内容**：修复 `repeat()` 在 `varchar` 类型定义中的一个多余参数配置问题。
- **意义**：虽然是局部修复，但扩展 YAML 中的参数定义错误会直接影响生成器、校验器和下游实现，属于 **规范正确性修正**。
- **状态**：CLOSED，且标记 `[PMC Ready]`，表明已进入较成熟的合入流程。
- **链接**：substrait-io/substrait PR #1015

### 3) #1011 `fix(extensions): change distribution option to enum arg for std_dev and variance`
- **内容**：将 `std_dev` / `variance` 中的 `distribution` 从 function option 调整为 enum argument。
- **意义**：这体现了社区正在统一 **函数选项（option）与枚举参数（enum arg）** 的边界。对实现者而言，这能减少歧义，让解析、校验和测试生成更一致。
- **背景**：PR 摘要明确提到这是基于近期对 function options 与 enum arguments 的澄清而作出的修正。
- **状态**：OPEN
- **链接**：substrait-io/substrait PR #1011

### 4) #994 `feat!: remove deprecated time, timestamp and timestamp_tz types`
- **内容**：移除已弃用的 `time`、`timestamp`、`timestamp_tz` 类型，涉及 proto、dialect schema、扩展 YAML、ANTLR grammar、测试、覆盖率脚本和文档。
- **意义**：这是今天最重的 **破坏性变更** 之一，说明社区正在主动清理历史类型设计，为 1.0 前后的类型系统收敛铺路。
- **影响面**：波及规范、工具链、测试与文档，意味着所有依赖老类型命名的实现都需要评估升级成本。
- **状态**：OPEN
- **链接**：substrait-io/substrait PR #994

### 5) #1010 `feat(tests): add enum argument support to FuncTestCase grammar`
- **内容**：为 FuncTestCase 语法增加显式 enum argument 支持，不再将其作为字符串字面量处理。
- **意义**：这是测试基础设施层面的关键改进。它不仅提升测试表达准确性，也为 #1011、#1012 这类函数定义演进提供了承载能力。
- **价值**：对规范项目来说，**测试语法与规范语义对齐** 是非常关键的，否则会出现“规范正确但测试模型落后”的问题。
- **状态**：OPEN
- **链接**：substrait-io/substrait PR #1010

### 6) #1014 `[PMC Ready] feat(extensions): support deprecation info in extensions`
- **内容**：为扩展中的类型、类型变体、标量函数、聚合函数、窗口函数增加弃用信息支持。
- **意义**：这项改动非常重要，它提供了 **渐进式演进机制**。相比直接删除或硬切换，弃用元数据能帮助实现方、文档站点、IDE 工具和验证器更平滑地处理变更。
- **背景信号**：PR 摘要明确提到“近期有多个 breaking changes”，说明社区已经意识到需要建立制度化的兼容性治理能力。
- **状态**：CLOSED，`[PMC Ready]`
- **链接**：substrait-io/substrait PR #1014

### 7) #881 `docs: clarify valid URNs`
- **内容**：澄清 URN 的合法格式，解决当前 Java、Python、Go 实现中对于冒号数量等假设不一致的问题。
- **意义**：这是与 Issue #1016 高度关联的文档/规范澄清工作。若 URN 格式定义不严谨，不同语言实现将出现解析分歧，影响扩展互通。
- **价值**：它本质上是在处理 **跨语言实现一致性** 和 **命名规范可执行性**。
- **状态**：OPEN
- **链接**：substrait-io/substrait PR #881

### 8) #1013 `[PMC Ready] feat: add optional description field to function implementations`
- **内容**：为扩展 schema 中的函数实现（function impl）增加可选 `description` 字段，并以 `count` 作为示例合并两个定义。
- **意义**：这是面向 **文档化、可读性与工具友好性** 的增强。未来生成文档、IDE 提示、catalog 展示或函数浏览器时，这类元数据会非常有价值。
- **状态**：CLOSED，`[PMC Ready]`
- **链接**：substrait-io/substrait PR #1013

### 9) #989 `[PMC Ready] fix: enforce nullable types for null literals in test cases`
- **内容**：在测试用例中严格执行 null literal 的可空性规则，使输出 nullability 与函数定义中的规则一致。
- **意义**：这是规范一致性与测试严谨性的基础修复。nullability 一直是跨引擎语义对齐中的高频痛点，测试层先收紧规则，有助于减少实现分歧。
- **状态**：CLOSED，`[PMC Ready]`
- **链接**：substrait-io/substrait PR #989

---

## 5. 功能需求趋势

结合当前活跃 Issue 与 PR，可以提炼出以下几个清晰趋势：

### 1) 命名与标识规范化加速
- 代表内容：#1016、#881  
- **趋势判断**：社区正在推动从“能用”走向“标准化可治理”，尤其是 URN 的官方注册、格式澄清、跨语言解析一致性。
- **对生态的意义**：这将直接影响扩展注册、函数发现、catalog 互通以及多实现兼容。

### 2) 扩展函数语义在快速收敛
- 代表内容：#1011、#1012、#1015  
- **趋势判断**：函数参数表达方式、参数类型覆盖、扩展 YAML 正确性正在被持续修正。
- **对生态的意义**：有利于降低引擎实现成本，避免同一函数在不同实现中出现语义漂移。

### 3) 测试框架与规范同步升级
- 代表内容：#1010、#989  
- **趋势判断**：社区不仅在改规范，还同步加强测试语法和 nullability 校验，说明对“可验证规范”的重视度明显提升。
- **对生态的意义**：更利于 SDK、执行引擎、转换器做自动化兼容性回归。

### 4) 兼容性治理机制正在补齐
- 代表内容：#1014、#994  
- **趋势判断**：一方面推进破坏性清理，另一方面补充弃用信息机制，说明社区开始系统性处理版本演进问题。
- **对生态的意义**：未来 Substrait 规范升级可能会更可预测，迁移路径也会更清晰。

### 5) 元数据可读性与工具支持增强
- 代表内容：#1013  
- **趋势判断**：函数描述等元数据正在进入 schema，这意味着社区不仅关注机器可读，也开始关注开发者体验。
- **对生态的意义**：有助于自动文档生成、开发工具集成和人机协作场景。

---

## 6. 开发者关注点

基于今日更新内容，当前开发者最关心的问题主要集中在以下几类：

### 1) 跨语言实现的一致性
- URN 解析规则、命名空间表达方式若不统一，会导致 Java、Python、Go 等实现出现行为差异。
- 这类问题通常不是“某个 PR 修掉就结束”，而是会影响整个扩展生态的长期兼容。

### 2) 扩展定义的精确表达
- 函数参数到底应该是 option、enum argument，还是普通字面量；某些函数签名是否遗漏整数类型支持；YAML 中是否存在多余参数。
- 这些看似细节的问题，实际上直接关系到代码生成器、验证器、适配器与执行器是否能稳定工作。

### 3) 破坏性变更的迁移成本
- 移除老时间类型这类改动，虽然有助于规范收敛，但对现有实现者来说会带来 proto、grammar、测试和文档层面的同步改造压力。
- 社区正在通过“deprecation info”来缓和这一问题，说明开发者确实需要更明确的迁移窗口和升级提示。

### 4) 测试语义与规范语义对齐
- enum argument 支持、nullability 严格校验等更新表明，开发者希望测试数据与正式规范严格一致，避免“测试能过但实现不兼容”的情况。
- 对数据库和引擎开发者来说，这是保障互操作性的基础设施工作。

### 5) 更好的文档和元数据支持
- 函数实现 description、URN 规则澄清等工作，反映出社区对“可理解性”的需求在上升。
- 对新接入 Substrait 的团队而言，良好的 schema 元数据和规范文档能显著降低接入门槛。

---

## 附：今日重点链接汇总

- Issue #1016: substrait-io/substrait Issue #1016
- PR #1012: substrait-io/substrait PR #1012
- PR #1015: substrait-io/substrait PR #1015
- PR #1011: substrait-io/substrait PR #1011
- PR #994: substrait-io/substrait PR #994
- PR #1010: substrait-io/substrait PR #1010
- PR #1014: substrait-io/substrait PR #1014
- PR #881: substrait-io/substrait PR #881
- PR #1013: substrait-io/substrait PR #1013
- PR #989: substrait-io/substrait PR #989

如果你愿意，我还可以继续把这份日报整理成更适合公众号/飞书/Slack 发布的 **简版播报格式**，或输出成 **Markdown 表格版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*