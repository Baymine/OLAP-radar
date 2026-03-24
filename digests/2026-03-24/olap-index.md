# OLAP 生态索引日报 2026-03-24

> 生成时间: 2026-03-24 01:17 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

以下是基于 **2026-03-24 dbt-core、Apache Spark、Substrait** 社区动态整理的横向对比分析报告。

---

# OLAP 数据基础设施生态横向对比分析报告
**覆盖项目**：dbt-core / Apache Spark / Substrait  
**日期**：2026-03-24

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个明显特征：**“功能扩展”正在让位于“工程可用性、语义一致性与运行稳健性”**。  
dbt-core 在强化错误提示、配置校验、函数资源治理与增量状态感知；Spark 则继续推进 SQL/DSv2、AQE 容错、PySpark/Arrow 稳定性与流处理可观测性；Substrait 聚焦规范层面的函数签名统一、时间语义补齐与废弃能力清理。  
整体来看，生态已从“补能力”进入“补边界、补一致性、补生产级体验”的阶段，说明 OLAP 基础设施正进一步走向**大规模生产可运维化**。  
对企业而言，这意味着未来选型重点不再只是“能否支持某功能”，而是“是否能在复杂项目、增量变更、跨引擎协作和高并发环境下稳定工作”。

---

## 2. 各项目活跃度对比

| 项目 | 今日活跃 Issues 数 | 今日活跃 PR 数 | Release 情况 | 活跃重心 |
|---|---:|---:|---|---|
| **dbt-core** | 10 | 10 | 无新 Release | 错误体验、配置校验、function/UDF、state:modified、seed 性能 |
| **Apache Spark** | 2 | 10 | 无新 Release | SQL/DSv2、AQE 容错、PySpark/Arrow、Streaming 状态读取 |
| **Substrait** | 0 | 9 | 无新 Release | 函数签名规范化、时间语义、破坏性清理、复杂类型函数 |

### 简要解读
- **dbt-core**：Issue 与 PR 两侧都很活跃，说明社区既有大量真实用户反馈，也有对应修复持续推进。
- **Spark**：Issue 更新不多，但 PR 活跃度高，体现出核心开发节奏仍然强，更多工作集中在主干演进而非问题发散。
- **Substrait**：几乎没有 Issue 动态，但 PR 高度集中，说明当前阶段更像是**规范收敛与集中推进期**，讨论更多发生在规范变更流程内部。

---

## 3. 共同关注的功能方向

以下几个方向在多个项目中呈现出明显共振：

### 3.1 错误处理与开发者体验（DX）提升
**涉及项目**：dbt-core、Spark

- **dbt-core**
  - 抑制 snapshot 校验失败时冗长 stacktrace（PR #12700）
  - 改进数据库标识符歧义错误信息（PR #12691）
  - 将原生 Python 异常替换为 `DbtException`（PR #12686）
  - 改进 `packages.yml` 缺失字段时报错（PR #12688）

- **Spark**
  - AQE 中 broadcast join 失败后自动回退 shuffle join（PR #54925）
  - 错误条件命名、类型变化和异常路径修复（日报中提及 #54970、#54971 趋势）

**共同诉求**：  
社区都在推动系统从“报错”走向“**可理解地失败、优雅地回退、降低排障成本**”。

---

### 3.2 语义一致性与规范化
**涉及项目**：dbt-core、Spark、Substrait

- **dbt-core**
  - function 资源的 schema 处理与 `state:modified` 感知补齐
  - access/private model 的 parse/reparse 一致性修复

- **Spark**
  - DSv2 的 `CREATE TABLE LIKE`
  - `TABLESAMPLE SYSTEM` + DSv2 pushdown
  - 类型系统框架和纳秒时间戳类型建设

- **Substrait**
  - `std_dev` / `variance` 参数建模由 function options 转向 enum arguments（PR #1011/#1019）
  - 移除废弃类型与字段（PR #994/#1002）
  - extension relation schema 语义澄清（PR #1018）

**共同诉求**：  
生态正在追求**接口、类型、配置和执行语义的统一化**，减少边缘行为和跨系统歧义。

---

### 3.3 增量执行、状态感知与变更最小化处理
**涉及项目**：dbt-core、Spark

- **dbt-core**
  - microbatch 相对批次执行（Issue #11242）
  - function 的 `state:modified` 变更检测修复（PR #12548）
  - access 变化触发 referencing nodes reparse（PR #12563）

- **Spark**
  - AQE 动态回退
  - Structured Streaming state format v4 读取支持（PR #54845）
  - CDC `changes()` API（PR #54746）

**共同诉求**：  
都在围绕“**只处理必要变更、增强状态可见性、提升增量链路效率**”持续演进。

---

### 3.4 函数/类型系统能力增强
**涉及项目**：dbt-core、Spark、Substrait

- **dbt-core**：function/UDF 成为重点资源类型，Javascript UDF、schema/状态感知等问题升温
- **Spark**：纳秒时间戳类型、新类型框架客户端集成
- **Substrait**：函数签名规范化、执行上下文变量、`element_at`、聚合函数参数扩展

**共同诉求**：  
函数和类型系统正在成为 OLAP 基础设施新的竞争焦点，目标是提升**表达力、互操作性与跨引擎映射能力**。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 差异化定位 |
|---|---|---|---|---|
| **dbt-core** | 数据建模治理、配置、测试、编译、增量构建、函数资源治理 | 数据分析工程师、Analytics Engineer、平台团队 | 以 SQL 项目编排与编译为核心，强调工程化开发体验 | 偏“数据开发工作流与治理层” |
| **Apache Spark** | 执行引擎、SQL 查询、批流处理、Python 接口、类型系统与运行时容错 | 数据平台工程师、实时/离线计算开发者、湖仓平台团队 | 统一批流执行引擎 + SQL + DSv2 + 多语言 API | 偏“计算引擎与执行层” |
| **Substrait** | 查询计划交换标准、函数定义、类型系统、跨引擎语义规范 | 引擎开发者、查询优化器/编译器团队、联邦查询与互操作平台 | 通过标准化 IR/规范统一跨系统表达与语义 | 偏“规范层与互操作协议层” |

### 进一步解读

#### dbt-core
核心价值不在执行引擎，而在于**建模开发体验、项目治理与增量变更编排**。  
最近的热点说明它正从传统 model-centric 工具扩展到 **function/UDF 资源治理平台**。

#### Spark
Spark 依然是**最强执行层项目**之一。  
当前重点不只是提升性能，而是让 SQL、Python、Streaming 和 AQE 在复杂生产环境中更稳、更可观测、更易扩展。

#### Substrait
Substrait 的活跃点不在终端功能，而在**规范收敛与跨引擎统一表达**。  
它更像生态“底层协议工程”，短期看不如 dbt/Spark 直观，但对长期多引擎互操作非常关键。

---

## 5. 社区热度与成熟度

### 5.1 社区活跃度
- **最高体感活跃度：dbt-core、Spark**
  - dbt-core：Issue/PR 双高，用户反馈与维护响应形成闭环。
  - Spark：PR 极为活跃，说明核心开发持续推进，工程投入稳定。

- **较集中但偏规范型活跃：Substrait**
  - 主要通过 PR 推进，缺少公开 Issue 扩散，呈现更强的“核心贡献者驱动”特征。

### 5.2 成熟度判断
- **Spark：高成熟度、持续演进型**
  - 大量工作集中在容错、DSv2 语义补齐、Arrow 稳定性、类型基础设施，典型成熟项目特征。
- **dbt-core：成熟平台向更复杂资源模型扩展**
  - 核心框架成熟，但 function/UDF、状态感知、解析一致性仍处于快速补齐期。
- **Substrait：规范成熟化中的快速收敛阶段**
  - 正在进行破坏性清理与模型统一，说明规范尚未完全冻结，适合密切跟进但需警惕兼容性变动。

### 5.3 迭代阶段判断
| 项目 | 阶段判断 |
|---|---|
| **dbt-core** | 成熟产品的能力扩展与体验打磨阶段 |
| **Spark** | 成熟引擎的深度优化与体系化增强阶段 |
| **Substrait** | 快速规范收敛与生态对齐阶段 |

---

## 6. 值得关注的趋势信号

### 趋势一：OLAP 基础设施进入“生产级体验优化”周期
从 dbt 的异常体系、Spark 的失败回退与内存治理，到 Substrait 的规范清理，行业重点已不只是新增功能，而是**提升系统在复杂真实场景中的稳定性与可维护性**。  
**对数据工程师的意义**：选型时应更加关注错误可读性、边界条件行为、状态可观测性，而不只是主路径性能。

---

### 趋势二：函数/UDF 与类型系统正在成为新的能力高地
dbt 开始把 function 作为一等资源治理，Spark 在推进高精度时间类型和类型框架，Substrait 则持续统一函数签名与执行语义。  
**对数据工程师的意义**：未来跨仓库、跨引擎开发中，函数定义、类型映射、元数据治理将成为重要工程主题，建议尽早建立统一函数管理和类型约束策略。

---

### 趋势三：增量执行与状态感知能力持续深化
dbt 的 microbatch/state:modified，Spark 的 CDC/state reader/AQE，反映出行业正向“**只跑变化部分**”加速演进。  
**对数据工程师的意义**：应优先建设支持增量选择、状态对比、批次回补、部分重跑的流水线架构，这会直接影响成本与恢复效率。

---

### 趋势四：跨系统语义统一需求显著增强
Substrait 的规范化、Spark 的 SQL/DSv2 补齐、dbt 的 function 元数据一致性问题，本质都在指向一个问题：**跨引擎语义不一致正成为规模化平台建设的核心阻力**。  
**对数据工程师的意义**：在多引擎环境中，应重视中间语义层、统一数据类型字典、函数兼容层和测试基线。

---

### 趋势五：社区正在减少“静默失败”和“隐式行为”
dbt 的未知 flags 告警、Spark 的更优失败路径、Substrait 对过时定义的正式移除，都体现出系统正减少模糊和隐式行为。  
**对数据工程师的意义**：未来工程规范会更强调“显式配置、严格校验、尽早失败”，这有利于大团队协作，但也要求更高质量的 CI 和兼容性验证。

---

# 结论

从 2026-03-24 的社区动态看，**dbt-core、Spark、Substrait 正分别在治理层、执行层、规范层形成互补演进**：

- **dbt-core**：强化数据开发体验、配置治理和函数资源完整性；
- **Spark**：增强执行引擎鲁棒性、SQL/DSv2 能力和 Python/Streaming 可运维性；
- **Substrait**：推进跨引擎函数与类型语义统一，清理历史包袱。

对技术决策者而言，这说明 OLAP 基础设施建设正在从“单点工具选型”转向“**治理层 + 执行层 + 语义层协同演进**”的新阶段。  
对数据工程师而言，接下来最值得投入的方向是：**增量状态管理、函数/类型治理、跨引擎语义一致性、以及生产级错误与调试体验建设**。

如果你愿意，我还可以把这份报告进一步整理成：
1. **适合管理层汇报的 1 页摘要版**  
2. **适合飞书/Slack 发布的表格化晨报版**  
3. **按“治理层 / 执行层 / 规范层”重构的深度分析版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报（2026-03-24）

> 数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

过去 24 小时，dbt-core 没有新版本发布，但社区在“错误体验优化、配置校验强化、快照/函数/UDF 支持完善、并发与状态感知修复”几个方向明显升温。  
从 PR 进展看，维护者正在集中修复用户最容易踩坑的 CLI/编译期异常表现；从 Issue 看，Python 3.14 兼容性、seed 内存占用、microbatch 细粒度控制、UDF/function 元数据与状态检测，仍是当前最值得跟踪的主题。

---

## 3. 社区热点 Issues

### 1) Python 3.14 支持阻塞依赖升级
- **Issue**: [#12098](https://github.com/dbt-labs/dbt-core/issues/12098)  
- **标题**: Python 3.14 support, requires newer mashumaro and potentially pydantic changes
- **为什么重要**: Python 新版本适配直接影响 dbt-core 的运行时兼容矩阵，也关系到企业内部基础镜像升级节奏。该问题不仅涉及 `mashumaro`，还可能牵动 `pydantic` 等核心依赖链。
- **社区反应**: 11 条评论、32 👍，是本批更新中互动度最高的议题之一，说明用户对新 Python 版本支持的需求很强烈。

### 2) `dbt seed` 内存占用过高
- **Issue**: [#9524](https://github.com/dbt-labs/dbt-core/issues/9524)  
- **标题**: [Feature] Improve memory performance of the `dbt seed` command
- **为什么重要**: seed 常用于小规模静态维表或初始化数据，但随着 CSV 体积增长，内存问题会成为 CI/CD、容器化执行和本地开发的稳定性瓶颈。
- **社区反应**: 已有 15 条评论，属于持续讨论中的性能类老问题；虽然 👍 不高，但被长期更新，说明它在真实生产中反复出现。

### 3) microbatch 希望支持“相对批次”执行
- **Issue**: [#11242](https://github.com/dbt-labs/dbt-core/issues/11242)  
- **标题**: [Feature] configure microbatch model to process specific relative batches of data
- **为什么重要**: 这是增量/流批一体场景下非常实际的需求。相对批次配置可提升回补、重跑、窗口修复等运维灵活性，适合大规模事实表和延迟到达数据处理。
- **社区反应**: 7 条评论、8 👍，表明 microbatch 相关能力仍在持续演进，且已有明确的用户场景推动。

### 4) 自定义 test 名称在 `config` 块中不生效
- **Issue**: [#9740](https://github.com/dbt-labs/dbt-core/issues/9740)  
- **标题**: [Feature] Custom test name not honoured in "config" blocks
- **为什么重要**: 测试命名直接影响可观测性、artifact 可读性以及失败定位体验。对于大型项目，命名一致性非常关键。
- **社区反应**: 6 条评论、2 👍，互动量中等，但问题影响的是测试治理体验，尤其是复杂项目中的规范化管理。

### 5) seeds 希望支持全项目默认 STRING 类型
- **Issue**: [#10985](https://github.com/dbt-labs/dbt-core/issues/10985)  
- **标题**: [Feature] dbt seeds - STRING as default for the entire project
- **为什么重要**: seed 类型推断在跨仓库、跨方言场景中容易造成兼容性问题。若能统一默认字符串策略，可以显著降低 CSV 导入的不确定性和适配成本。
- **社区反应**: 4 条评论、6 👍，说明该需求与多适配器生态的实际使用痛点高度相关。

### 6) on-run-end schema 处理未覆盖 functions schema
- **Issue**: [#12516](https://github.com/dbt-labs/dbt-core/issues/12516)  
- **标题**: [Bug] On-run-end schemas does not seem to apply to functions schema
- **为什么重要**: 这是 dbt 在 UDF/function 资源治理上的“边界一致性”问题，涉及 schema owner、权限与后处理自动化。随着 function 成为一等资源，这类治理缺口会更敏感。
- **社区反应**: 3 条评论，虽然讨论尚少，但已有 `backport 1.11.latest` 标签，说明维护者认为其具备修复优先级。

### 7) `state:modified` 无法检测 function 的 `.yml` 属性变更
- **Issue**: [#12547](https://github.com/dbt-labs/dbt-core/issues/12547)  
- **标题**: [Bug] state:modified does not detect changes to function properties (.yml) for resource_type:function
- **为什么重要**: 状态选择器是 CI 增量执行和变更感知的核心能力。如果 function 元数据更新不能被正确感知，就会导致漏跑、漏测或部署不一致。
- **社区反应**: 2 条评论、4 👍，问题已对应到社区 PR，说明修复路径比较明确。

### 8) `analyses` 缺少 project-level 配置支持
- **Issue**: [#11427](https://github.com/dbt-labs/dbt-core/issues/11427)  
- **标题**: [Bug] `analyses` should support project-level configuration
- **为什么重要**: `analyses` 资源虽然不是主执行路径，但在实验性 SQL、一次性分析和辅助建模中很常见。缺乏 project-level 配置会削弱项目治理的一致性。
- **社区反应**: 2 条评论，热度不算高，但它反映了 dbt 资源类型之间配置能力不完全对齐的问题。

### 9) group/private model 访问控制错误应在 parse 阶段暴露
- **Issue**: [#12271](https://github.com/dbt-labs/dbt-core/issues/12271)  
- **标题**: [Bug] private model referenced by model in different group should be a PARSE error (currently only errors at runtime)
- **为什么重要**: 这是典型的“越早失败越好”问题。访问控制若只能在 runtime 才报错，会拉长反馈回路，影响开发体验与 CI 效率。
- **社区反应**: 已有对应修复 PR 在推进，说明该问题虽评论不多，但具备明确工程价值。

### 10) Javascript UDF 支持
- **Issue**: [#12332](https://github.com/dbt-labs/dbt-core/issues/12332)  
- **标题**: Javascript UDFs
- **为什么重要**: 目前 dbt-core 已支持 SQL、Python UDF，若进一步支持 Javascript，将增强其在 BigQuery、Snowflake 等生态中的表达能力与适配空间。
- **社区反应**: 暂无评论与点赞，但这是面向未来功能版图的重要议题，尤其值得关注 dbt 对“函数作为一等资源”的后续演进。

---

## 4. 重要 PR 进展

### 1) 修复单元测试临时表别名冲突
- **PR**: [#12701](https://github.com/dbt-labs/dbt-core/pull/12701)  
- **标题**: fix: include model name in unit test alias to prevent temp table collisions
- **进展解读**: 该 PR 解决不同模型下同名单元测试在多线程执行时产生临时表冲突的问题。对并行测试、CI 稳定性和大型项目测试隔离都很关键。

### 2) 对 `dbt_project.yml` 未知 flags 发出警告
- **PR**: [#12689](https://github.com/dbt-labs/dbt-core/pull/12689)  
- **标题**: feat: warn on unknown flags in dbt_project.yml
- **进展解读**: 这是典型的配置安全性增强。过去拼写错误会被静默忽略，现在可提前暴露无效配置，减少“为什么配置没生效”的排障成本。

### 3) snapshot 校验失败时抑制冗长 stacktrace
- **PR**: [#12700](https://github.com/dbt-labs/dbt-core/pull/12700)  
- **标题**: fix: suppress stacktrace when snapshot validation fails
- **进展解读**: 对应新 Issue #12692。重点不是修业务逻辑，而是修“异常呈现方式”——让用户直接看到清晰错误，而非被 Python 堆栈淹没。这类修复对 CLI 易用性非常重要。

### 4) 改进数据库标识符歧义错误信息
- **PR**: [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
- **标题**: Fix: improve error message for similar database identifiers to reference correct node type
- **进展解读**: 该 PR 让 `AmbiguousCatalogMatchError` 不再一律写成 “created by the model”，而是正确区分 source/seed/snapshot/model。属于低风险高收益的开发者体验优化。

### 5) 修复 `same_contract()` 中 custom constraints 可能触发的 `KeyError`
- **PR**: [#12699](https://github.com/dbt-labs/dbt-core/pull/12699)  
- **标题**: fix: guard against KeyError for custom constraints in same_contract()
- **进展解读**: 面向 contract/约束比较逻辑的健壮性修复。对于依赖 schema contract 的团队，这有助于减少编译或比较过程中的非预期异常。

### 6) 系统性将原生 Python 异常替换为 `DbtException`
- **PR**: [#12686](https://github.com/dbt-labs/dbt-core/pull/12686)  
- **标题**: Replace Python Exceptions with DbtException subclasses
- **进展解读**: 这是较底层但意义很大的工程改进。统一异常体系有利于 CLI 错误处理、日志表现、用户提示一致性，也为未来更稳定的错误分类打基础。

### 7) function 资源的 `state:modified` 感知修复
- **PR**: [#12548](https://github.com/dbt-labs/dbt-core/pull/12548)  
- **标题**: fix: state:modified does not detect .yml property changes for resource_type:function
- **进展解读**: 直接对应 Issue #12547。若合入，将补上 function 资源在状态选择器中的关键缺口，提升 CI 增量构建准确性。

### 8) access 变更后重新解析引用节点
- **PR**: [#12563](https://github.com/dbt-labs/dbt-core/pull/12563)  
- **标题**: fix: schedule referencing nodes for reparse when access changes to private via config block
- **进展解读**: 修复 partial parser 对 `access: private` 变化感知不足的问题。它提升了 group/access 访问控制与增量解析之间的一致性，属于解析器正确性修复。

### 9) 改进 `packages.yml` 缺失 `version` 时的报错
- **PR**: [#12688](https://github.com/dbt-labs/dbt-core/pull/12688)  
- **标题**: Fix: improve error message when version key is missing from packages.yml
- **进展解读**: 避免直接抛出原始 `KeyError`，转而输出用户可理解的错误信息。对包管理初学者和自动化脚本都更友好。

### 10) seed 大小上限可配置化
- **PR**: [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)  
- **标题**: Make MAXIMUM_SEED_SIZE_MIB configurable
- **进展解读**: 这是一个长期存在的能力诉求。默认 1 MiB 的 seed 限制过于刚性，若可配置，将显著提升 dbt 在中等规模静态数据管理场景中的实用性。

---

## 5. 功能需求趋势

### 1) 配置校验与错误提示正成为高优先级方向
从未知 flags 告警、custom config key deprecation、`packages.yml` 缺失字段报错，到 snapshot 校验时 suppress stacktrace，社区明显在推动 dbt 从“能报错”走向“报对错、报人话”。

### 2) function / UDF 正在从边缘能力走向核心资源
过去 24 小时里，functions schema、`state:modified` 对 function 的检测、Javascript UDF 支持等多个议题同时出现，说明 dbt 正在补齐“函数型资源”的治理、变更感知与语言扩展能力。

### 3) 增量执行与部分重解析能力持续深化
microbatch 相对批次、`state:modified`、private access 变更触发 reparse，都表明社区持续关注“只处理必要变更”的执行模型，以适应更大规模、更复杂依赖图的项目。

### 4) seed 能力面临性能与易用性的双重升级需求
一方面是 seed 的内存性能、大小限制；另一方面是默认类型推断策略。说明 seed 虽然是老功能，但在真实生产中仍有大量基础设施层面的改进空间。

### 5) 兼容性与生态演进仍是长期主线
Python 3.14 支持问题再次提醒：dbt-core 作为 Python 工程，不仅要维护 SQL/adapter 抽象，还必须持续跟进 Python 生态依赖升级。

---

## 6. 开发者关注点

### 1) “错误太底层”仍是高频痛点
不少反馈集中在原始 `KeyError`、`RuntimeError`、长 stacktrace、误导性提示上。开发者希望 dbt 在 parse/compile/validate 阶段给出更明确、更接近业务语义的错误信息。

### 2) 配置被静默忽略的问题很影响信任感
无论是 `dbt_project.yml` 中拼错 flag，还是配置 key 不合法却未及时提示，这类问题都会让用户误以为配置已生效，进而增加排障时间。

### 3) function/UDF 相关资源的“工具链完整性”仍不足
用户已经不满足于“能定义函数”，而是期待 schema 处理、状态感知、属性变更检测、更多语言支持等配套能力都能达到 model 的成熟度。

### 4) 大项目下的并发、增量与解析一致性问题更突出
单元测试 temp table 冲突、partial parser 对 access 变化感知不完整、`state:modified` 漏检等，都是大型项目在 CI/CD 和多线程运行时更容易暴露的问题。

### 5) seed 仍是很多团队的现实需求
虽然 seed 常被视为轻量能力，但内存占用、文件大小限制、默认类型策略等问题持续被提及，说明很多团队仍在用它承载实际生产数据初始化与参考维表管理。

---

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的简版晨报**，或  
2. **按“修复 / 功能 / 兼容性 / DX”四类重新排版的周报模板**。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-24）

## 1. 今日速览

过去 24 小时内，Apache Spark 仓库没有新 Release，但 PR 活跃度很高，重点集中在 **SQL 能力增强、Adaptive Query Execution（AQE）容错、PySpark/Arrow 兼容性、以及 Structured Streaming 状态读取** 等方向。  
Issue 层面新增/更新不多，但两个已关闭 Issue 都指向了开发者日常使用中的典型痛点：**checkpoint 存储策略不灵活**，以及 **Apache 组织层面的 GitHub Actions 安全策略导致 CI 普遍失败**。  

---

## 3. 社区热点 Issues

> 说明：过去 24 小时内更新的 Issue 仅有 2 条，以下按“最值得关注”进行完整覆盖。

### 1) Dataset.localCheckpoint() 应支持自定义 StorageLevel
- **Issue**: #54954  
- **状态**: CLOSED  
- **链接**: [apache/spark Issue #54954](https://github.com/apache/spark/issues/54954)

**内容概述**  
用户指出 `Dataset.localCheckpoint()` 当前总是使用 `MEMORY_AND_DISK`，即使之前已经通过 `persist()` 显式指定了 `DISK_ONLY` 等存储级别，也不会生效。

**为什么重要**  
这不是单纯的 API 细节问题，而是会直接影响：
- 大中间结果集的内存占用；
- checkpoint 与 persist 叠加造成的“双份副本”问题；
- 资源紧张环境下的执行稳定性。

对于 OLAP/ETL 长链路任务，checkpoint 经常用于截断 lineage；如果无法精细控制存储级别，可能导致 executor 内存压力显著增加。

**社区反应**  
该 Issue 很快被关闭，评论不多，说明社区可能已判断为：
- 已有既定设计；
- 或已有替代方案/后续实现路径。  

但从用户场景看，这类需求具有较强现实性，值得继续关注后续是否会以 PR 或 SPIP 形式演进。

---

### 2) GitHub Actions 因 Apache 新安全策略失效
- **Issue**: #54931  
- **状态**: CLOSED  
- **链接**: [apache/spark Issue #54931](https://github.com/apache/spark/issues/54931)

**内容概述**  
该 Issue 主要用于通知贡献者：由于 Apache 最近执行新的 GitHub Actions 安全策略，Spark 仓库中大量 CI 工作流因使用了不再受支持的 actions 而失败。

**为什么重要**  
这类问题虽然不直接影响 Spark 运行时功能，但对社区协作影响非常大：
- PR 无法正常通过 CI；
- reviewer 难以判定失败是否由代码变更引起；
- 新贡献者的参与门槛上升；
- 合并效率和回归风险控制能力下降。

**社区反应**  
Issue 被作为“占位/说明性”问题快速关闭，说明这是一个全 Apache 组织级别的问题，而非 Spark 单仓库可独立解决。短期内，开发者需要提高对“非代码原因导致 CI 红灯”的辨识能力。

---

## 4. 重要 PR 进展

> 以下从近 24 小时更新的 PR 中，挑选 10 个对 Spark SQL、PySpark、执行引擎和流处理生态影响较大的变更。

### 1) [SPARK-56065][SQL] AQE 支持从失败的 Broadcast Join 回退到 Shuffle Join
- **PR**: #54925  
- **链接**: [apache/spark PR #54925](https://github.com/apache/spark/pull/54925)

**核心内容**  
为 AQE 增加一个可选回退路径：当广播表因大小/行数限制导致 broadcast stage 失败时，可自动回退为 shuffle join。

**影响解读**  
这是今天最值得关注的执行层增强之一。它提升了：
- 查询容错性；
- AQE 在边界场景下的鲁棒性；
- 复杂 BI/ETL 作业的成功率。

对数据工程团队而言，这有望减少“估算可广播、实际执行失败”的长尾问题。

---

### 2) [SPARK-33902][SQL] Data Source V2 支持 CREATE TABLE LIKE
- **PR**: #54809  
- **链接**: [apache/spark PR #54809](https://github.com/apache/spark/pull/54809)

**核心内容**  
为 V2 表接口补齐 `CREATE TABLE LIKE` 语义。

**影响解读**  
这是 V2 生态成熟度的重要一步。许多现代 Lakehouse/Catalog 场景已广泛依赖 DSv2，如果该能力补齐：
- 元数据模板化建表会更顺畅；
- SQL 兼容性更接近传统数仓体验；
- 外部 catalog/connector 接入成本下降。

---

### 3) [SPARK-55978][SQL] 新增 TABLESAMPLE SYSTEM，并支持 DSv2 下推
- **PR**: #54972  
- **链接**: [apache/spark PR #54972](https://github.com/apache/spark/pull/54972)

**核心内容**  
在现有 `TABLESAMPLE BERNOULLI` 之外，引入 ANSI SQL 的 `TABLESAMPLE SYSTEM`，实现块级采样，并支持 DSv2 pushdown。

**影响解读**  
这是典型的“语义 + 性能”双提升：
- 对大表探索分析更友好；
- block sampling 在很多存储布局下更高效；
- 采样逻辑可下推到数据源，减少扫描成本。

对 OLAP 用户和查询引擎适配者都很关键。

---

### 4) [SPARK-56166][PYTHON] 用 ArrowBatchTransformer.enforce_schema 替换列级类型强制转换
- **PR**: #54967  
- **链接**: [apache/spark PR #54967](https://github.com/apache/spark/pull/54967)

**核心内容**  
在多个 PySpark Arrow 序列化路径中，统一使用 `ArrowBatchTransformer.enforce_schema` 取代手写的逐列类型转换逻辑。

**影响解读**  
这类改动的价值主要在工程一致性和稳定性：
- 减少重复逻辑；
- 降低类型转换分支不一致带来的 bug；
- 提升 PySpark UDF/UDTF 与 Arrow 集成路径的可维护性。

---

### 5) [SPARK-55890] 在测试结束时检查 Arrow 内存
- **PR**: #54689  
- **链接**: [apache/spark PR #54689](https://github.com/apache/spark/pull/54689)

**核心内容**  
修复 Spark Connect 与相关测试中的 Arrow off-heap 内存泄漏，并在 `afterAll` 中加入守护检查，防止未来泄漏再次进入主干。

**影响解读**  
这项改动虽然是测试和稳定性方向，但含金量很高：
- 直接针对 off-heap 泄漏；
- 对 Spark Connect 这种长连接、交互式场景尤其关键；
- 加入“预合并拦截”机制，属于质量体系升级。

---

### 6) [SPARK-55950][PYTHON] 为 PySpark 增加 CDC `changes()` API 支持
- **PR**: #54746  
- **链接**: [apache/spark PR #54746](https://github.com/apache/spark/pull/54746)

**核心内容**  
为 `DataFrameReader` 和 `DataStreamReader` 新增 `changes()` 方法，覆盖 classic PySpark 和 Spark Connect 模式。

**影响解读**  
CDC 是现代数据平台核心能力之一。该 PR 若合入，将进一步提升：
- PySpark 对增量数据消费场景的友好度；
- Python 用户访问表变更流的便利性；
- Connect 与 classic API 的一致性。

---

### 7) [SPARK-56160][SQL] 新增纳秒精度时间戳 DataType
- **PR**: #54966  
- **链接**: [apache/spark PR #54966](https://github.com/apache/spark/pull/54966)

**核心内容**  
新增 `TimestampNSType` 与 `TimestampNTZNSType` 两种纳秒级时间戳类型。

**影响解读**  
这是类型系统层面的重要演进，可能为后续带来：
- 更高精度的时间序列处理；
- 与外部高精度数据源/格式的更好映射；
- 新一代类型框架扩展的基础设施支撑。

对于日志、金融、IoT、事件流分析场景尤其有意义。

---

### 8) [SPARK-55441][SQL] Types Framework Phase 1c：客户端集成
- **PR**: #54905  
- **链接**: [apache/spark PR #54905](https://github.com/apache/spark/pull/54905)

**核心内容**  
在已有类型框架基础上，引入面向客户端分发的 trait 和集成机制，使新类型接入客户端基础设施时不再需要大量手工修改。

**影响解读**  
这是明显的“架构型 PR”：
- 提升 Spark 类型系统扩展能力；
- 减少未来新增类型的接入工作量；
- 为更复杂的数据类型演进打基础。

结合纳秒时间戳 PR 一起看，可以感受到 Spark 正在持续强化其类型系统基础设施。

---

### 9) [SPARK-56164][SQL] 修复 SPJ merged key ordering
- **PR**: #54961  
- **链接**: [apache/spark PR #54961](https://github.com/apache/spark/pull/54961)

**核心内容**  
修复 `EnsureRequirements` 中 partition key 在归约后合并去重时，排序依据仍错误使用原始类型的问题。

**影响解读**  
这是一个典型的优化器/执行计划正确性修复。虽然表面不显眼，但它可能影响：
- 分区键兼容性推导；
- 下游 physical planning 的稳定性；
- 某些边界 SQL 的结果正确性或计划选择。

---

### 10) [SPARK-55729][SS] 状态数据源读取支持 stream-stream join 的新 state format v4
- **PR**: #54845  
- **链接**: [apache/spark PR #54845](https://github.com/apache/spark/pull/54845)

**核心内容**  
增强 state data source reader，使其支持 stream-stream join 场景下的新 state format v4。

**影响解读**  
Structured Streaming 状态可观测性持续增强。对于流处理开发者，这意味着：
- 更方便地检查 join 状态；
- 更好地排查状态膨胀、TTL、存储布局问题；
- 为运维与调试工具链建设提供基础。

---

## 5. 功能需求趋势

结合今日更新内容，可以提炼出 Spark 社区当前几个明显的功能方向：

### 1) SQL/DSv2 语义持续补齐
代表项：
- `CREATE TABLE LIKE for V2`（#54809）
- `TABLESAMPLE SYSTEM` + DSv2 pushdown（#54972）
- DSv2 connector API 错误码命名化（#54971）

**趋势判断**  
Spark 正继续把 SQL 兼容性、标准语义和 DSv2 生态完善作为重点。DSv2 不再只是“连接器框架”，而是在向完整生产级表接口标准演进。

---

### 2) 查询执行鲁棒性与 AQE 容错增强
代表项：
- broadcast join 失败回退 shuffle join（#54925）
- SPJ key ordering 修复（#54961）
- `GetStructField` 类型变化下的错误报告修复（#54970）

**趋势判断**  
社区正在优化 Spark 在边界条件、计划变换和异常场景下的行为，目标是让引擎在复杂查询上更“稳”，而不仅仅是更“快”。

---

### 3) PySpark + Arrow 仍是高频投入区域
代表项：
- Arrow schema enforce 统一（#54967）
- Arrow 内存泄漏检测（#54689）
- PySpark CDC `changes()` API（#54746）
- datasource worker type hint 修复（#54611）

**趋势判断**  
Python 生态仍是 Spark 的核心增长面。当前工作重点既包括 API 扩展，也包括 Arrow 相关的性能、兼容性和可维护性治理。

---

### 4) 类型系统升级正在加速
代表项：
- Types Framework client integration（#54905）
- 纳秒时间戳类型（#54966）

**趋势判断**  
Spark 正为未来更丰富的数据类型能力做铺垫。类型系统基础设施化后，后续新增精度类型、客户端支持与表达式集成会更顺畅。

---

### 5) Structured Streaming 可观测性增强
代表项：
- state data source reader 支持 state format v4（#54845）
- 结构化流状态数据源文档更新（#54548）

**趋势判断**  
流处理功能正在从“能跑”转向“可诊断、可检查、可治理”，这对于复杂实时数据平台非常关键。

---

## 6. 开发者关注点

### 1) checkpoint / persist 存储策略缺乏足够控制力
从 Issue #54954 可以看到，开发者对 lineage 截断与存储策略协同有明确诉求。  
**痛点本质**：大中间结果集场景下，默认 `MEMORY_AND_DISK` 不一定合适，容易导致额外资源占用和重复副本。

---

### 2) CI 基础设施不稳定正在干扰贡献效率
Issue #54931 反映出一个非代码层面的现实问题：  
**当组织级安全策略变更影响 GitHub Actions 时，PR 生命周期、回归验证和 reviewer 判断成本都会显著上升。**

这类问题短期内通常比单个功能 bug 更影响社区协作效率。

---

### 3) Python/Arrow 路径的内存与类型一致性仍是高频风险点
从多个 PR 可以看到，开发者持续在处理：
- off-heap 内存泄漏；
- Arrow schema enforcement；
- pandas 3 行为对齐；
- 数据源 worker 类型提示。

**说明**：PySpark 生态的功能面越来越广，但随之而来的兼容性和稳定性负担也在增加。

---

### 4) 开发者希望 Spark 在“失败时更优雅”
例如：
- broadcast join 失败自动回退（#54925）
- 更准确的错误条件命名（#54971）
- `ClassCastException` 报错修复（#54970）

这表明社区对“异常路径体验”越来越重视，不仅追求性能，也追求调试友好性和生产可运维性。

---

### 5) 新类型与高精度时间语义需求正在上升
纳秒时间戳类型（#54966）和 Types Framework 演进（#54905）显示，开发者对更高精度、更规范的数据类型支持有持续需求。  
这通常与以下场景密切相关：
- 高频事件处理；
- 金融/交易数据；
- IoT/时序分析；
- 跨系统 schema 对齐。

---

## 附：今日值得重点跟踪的链接

- Issue #54954: Dataset.localCheckpoint() should accept a StorageLevel parameter  
  https://github.com/apache/spark/issues/54954
- Issue #54931: github actions are not working due to a new security policy  
  https://github.com/apache/spark/issues/54931
- PR #54925: AQE fallback from failed broadcast joins to shuffle joins  
  https://github.com/apache/spark/pull/54925
- PR #54809: Support CREATE TABLE LIKE for V2  
  https://github.com/apache/spark/pull/54809
- PR #54972: Add TABLESAMPLE SYSTEM block sampling with DSv2 pushdown  
  https://github.com/apache/spark/pull/54972
- PR #54967: Use ArrowBatchTransformer.enforce_schema  
  https://github.com/apache/spark/pull/54967
- PR #54689: Check arrow memory at end of tests  
  https://github.com/apache/spark/pull/54689
- PR #54746: Add PySpark support for CDC changes() API  
  https://github.com/apache/spark/pull/54746
- PR #54966: Add DataType classes for nanosecond timestamp types  
  https://github.com/apache/spark/pull/54966
- PR #54905: Types Framework - Phase 1c - Client Integration  
  https://github.com/apache/spark/pull/54905
- PR #54845: Support state data source reader for new state format v4  
  https://github.com/apache/spark/pull/54845

如果你愿意，我还可以进一步把这份日报整理成更适合公众号/飞书群发布的 **“精简版”** 或 **“表格版”**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-24）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新 Release，也没有活跃 Issue 更新，社区动向几乎全部集中在 Pull Request。  
今天最值得关注的是：一批围绕 **函数签名规范化、枚举参数建模、时间语义补齐、过时类型/字段清理** 的 PR 持续推进，显示社区正加速推进 **规范一致性与破坏性清理**。  
此外，`element_at`、执行上下文变量（`current_date/current_timestamp/current_timezone`）等能力也在补足，表明 Substrait 正继续增强表达能力与执行语义完备性。

---

## 2. 重要 PR 进展

> 说明：过去 24 小时内共更新 9 个 PR，其中 1 个已关闭。由于没有 Issue 更新，本日报重点覆盖全部重要 PR。  
> GitHub 仓库主页：<https://github.com/substrait-io/substrait>

### 1) PR #945 - 新增执行上下文变量：`current_date` / `current_timestamp` / `current_timezone`
- **状态**：OPEN，PMC Ready
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：为执行上下文新增 3 个变量，用于获取当前日期、当前时间戳以及当前时区。
- **为什么重要**：
  - 这是对 SQL/分析引擎常见“当前时间类语义”的关键补齐。
  - 有助于不同执行器在时间相关表达式上形成统一语义接口。
  - 对计划可移植性、跨引擎时间函数映射非常关键。
- **链接**：<https://github.com/substrait-io/substrait/pull/945>

### 2) PR #1012 - `std_dev` / `variance` 支持整型参数
- **状态**：OPEN，PMC Ready
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：为标准差与方差相关函数补充整型参数支持，并扩展生成测试案例。
- **为什么重要**：
  - 提升聚合函数签名覆盖面，减少实现方额外做类型兜底的负担。
  - 反映社区正在把函数定义从“能表达”推进到“更贴近真实实现需求”。
- **依赖关系**：依赖 #1010、#1011。
- **链接**：<https://github.com/substrait-io/substrait/pull/1012>

### 3) PR #1011 - 为 `std_dev` / `variance` 增加 distribution 枚举参数签名
- **状态**：OPEN，PMC Ready
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：将 `distribution` 从函数选项语义调整为 **enum argument**。
- **为什么重要**：
  - 这是函数签名建模的一次规范化修正。
  - 社区近期显然在统一“function options vs enum arguments”的边界。
  - 会直接影响扩展定义、测试、以及下游实现兼容性。
- **链接**：<https://github.com/substrait-io/substrait/pull/1011>

### 4) PR #1020 - 新增 `element_at` 列表函数
- **状态**：OPEN
- **作者**：@benbellick
- **重要性**：高
- **内容概述**：新增 `element_at`，用于按索引访问 list 元素，并通过枚举参数控制负索引语义，还可配置越界行为。
- **为什么重要**：
  - 补足数组/列表访问能力，是数据处理与 SQL 兼容常见基础函数。
  - 对负索引和越界处理做显式建模，利于不同引擎对齐语义。
  - 说明 Substrait 正增强复杂类型操作能力。
- **链接**：<https://github.com/substrait-io/substrait/pull/1020>

### 5) PR #1018 - 文档澄清：extension relation 的输出 schema 处理
- **状态**：OPEN
- **作者**：@benbellick
- **重要性**：中高
- **内容概述**：补充文档，明确 extension relation 的输出 schema 不能像标准 relation 那样自动推导，需要扩展本身负责说明。
- **为什么重要**：
  - 这是实现层面非常实际的问题，关系到计划消费方如何正确解释扩展节点。
  - 文档澄清可减少实现歧义，降低不同系统对 extension relation 的理解偏差。
- **链接**：<https://github.com/substrait-io/substrait/pull/1018>

### 6) PR #1019 - 废弃基于 function options 的 `std_dev` / `variance`
- **状态**：OPEN
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：这是一个 **BREAKING CHANGE**，废弃使用 function options 建模的 `std_dev` 和 `variance`，转向 enum arguments 版本。
- **为什么重要**：
  - 与 #1011 配套，体现社区在进行函数定义规范收敛。
  - 对下游生成器、解析器、验证器、执行引擎适配都会产生影响。
  - 破坏性调整意味着社区更倾向于尽快清理历史设计包袱。
- **链接**：<https://github.com/substrait-io/substrait/pull/1019>

### 7) PR #994 - 移除废弃的 `time` / `timestamp` / `timestamp_tz` 类型
- **状态**：OPEN，PMC Ready
- **作者**：@nielspardon
- **重要性**：非常高
- **内容概述**：从 proto、dialect schema、扩展 YAML、ANTLR、测试、文档等多个层面彻底移除已废弃类型。
- **为什么重要**：
  - 这是典型的规范“去历史包袱”动作，影响面很广。
  - 对所有依赖旧类型的工具链和实现都是直接兼容性变更。
  - 体现社区正推动类型系统收敛，降低歧义与重复语义。
- **链接**：<https://github.com/substrait-io/substrait/pull/994>

### 8) PR #1002 - 移除废弃字段 `Aggregate.Grouping.grouping_expressions`
- **状态**：OPEN，PMC Ready
- **作者**：@nielspardon
- **重要性**：非常高
- **内容概述**：删除已被 `expression_references` 替代的旧字段。
- **为什么重要**：
  - 是聚合语义模型的一次正式清理。
  - 说明社区希望尽快完成旧字段迁移，避免规范长期双轨并行。
  - 对生成器、序列化/反序列化、兼容适配代码均有影响。
- **链接**：<https://github.com/substrait-io/substrait/pull/1002>

### 9) PR #1010 - FuncTestCase grammar 增加枚举参数支持
- **状态**：CLOSED
- **作者**：@nielspardon
- **重要性**：高
- **内容概述**：测试语法中新增 `enum` 数据类型，显式支持枚举参数，而不是把它当字符串字面量处理。
- **为什么重要**：
  - 为 #1011、#1012 等后续函数签名调整奠定测试基础。
  - 说明社区不仅在改规范，还在同步修正测试基础设施。
  - 已关闭意味着这条支撑链路已落地。
- **链接**：<https://github.com/substrait-io/substrait/pull/1010>

---

## 3. 功能需求趋势

> 由于过去 24 小时内没有 Issue 更新，以下趋势主要从活跃 PR 中提炼。

### 1) 函数签名规范化正在成为核心方向
- 典型 PR：#1011、#1012、#1019、#1010
- 趋势判断：
  - 社区正在系统性梳理函数参数表达方式，尤其是 **enum argument 与 function options 的边界**。
  - 这意味着 Substrait 不再只是补函数数量，而是在提升函数定义的“可验证性、可生成性、可实现性”。

### 2) 破坏性清理加速推进
- 典型 PR：#994、#1002、#1019
- 趋势判断：
  - 社区对历史废弃项开始集中移除，而非长期兼容保留。
  - 这对规范稳定性是长期利好，但短期会增加下游升级成本。

### 3) 时间与执行上下文语义持续补强
- 典型 PR：#945
- 趋势判断：
  - 当前日期、当前时间戳、当前时区这类上下文变量，是跨引擎计划表达的关键拼图。
  - 社区明显在完善“计划运行时上下文”层面的标准化能力。

### 4) 复杂类型与集合操作能力增强
- 典型 PR：#1020
- 趋势判断：
  - `element_at` 表明对 list/array 访问语义的关注正在提升。
  - 后续可能会看到更多复杂类型函数补充，如 map/list/struct 相关操作。

### 5) 扩展机制的文档与消费语义更加明确
- 典型 PR：#1018
- 趋势判断：
  - 除了核心规范，社区也在关注 extension relation 这种“实现时最容易出歧义”的边缘地带。
  - 这对实际落地 Substrait 的引擎开发者很关键。

---

## 4. 开发者关注点

### 1) 规范一致性优先于历史兼容
从多个 BREAKING CHANGE PR 看，开发者当前最关注的是：
- 去除已废弃类型与字段
- 统一函数参数表达
- 让 proto、文档、扩展 YAML、测试语法保持一致

这说明社区正在优先解决“规范内部不一致”问题，而不是继续叠加新能力。

### 2) 测试基础设施需要跟上规范演进
#1010 表明：
- 当函数语义从 option 转向 enum argument 后，测试语法也必须同步升级
- 开发者非常重视“规范变更是否可被测试体系正确表达”

这类需求往往来自真实实现接入中的痛点。

### 3) 扩展能力的可解释性仍是落地难点
#1018 反映出：
- extension relation 的输出 schema 如何描述与消费，仍是实现中的高频疑问
- 这说明扩展机制虽然灵活，但仍需要更多文档约束和最佳实践

### 4) 时间语义和跨引擎兼容仍是关键痛点
#945 说明开发者需要：
- 标准化当前时间/日期/时区语义
- 减少不同执行器在时间函数上的行为差异

对于 OLAP 引擎、SQL 编译器和联邦查询系统，这类标准化需求尤其强烈。

### 5) 复杂类型函数的标准化需求在上升
#1020 体现：
- list/array 访问这类函数是常见能力，但不同系统对负索引、越界行为定义差异较大
- 开发者希望在 Substrait 层显式固化这些语义，降低互操作成本

---

## 5. 社区热点 Issues

过去 24 小时内 **没有新的 Issue 更新**，因此今日暂无可重点跟踪的热点 Issue。  
从当前活跃 PR 来看，社区讨论焦点更多集中在 **规范收敛、破坏性清理、函数建模统一**，而非通过 Issue 进行需求扩散。

---

## 附：今日重点链接汇总

- PR #945: <https://github.com/substrait-io/substrait/pull/945>
- PR #1010: <https://github.com/substrait-io/substrait/pull/1010>
- PR #1011: <https://github.com/substrait-io/substrait/pull/1011>
- PR #1012: <https://github.com/substrait-io/substrait/pull/1012>
- PR #1018: <https://github.com/substrait-io/substrait/pull/1018>
- PR #1019: <https://github.com/substrait-io/substrait/pull/1019>
- PR #1020: <https://github.com/substrait-io/substrait/pull/1020>
- PR #994: <https://github.com/substrait-io/substrait/pull/994>
- PR #1002: <https://github.com/substrait-io/substrait/pull/1002>

如果你愿意，我也可以进一步把这份日报改写成：
1. **适合微信群/飞书的简版快讯**，或  
2. **适合邮件周报模板的正式版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*