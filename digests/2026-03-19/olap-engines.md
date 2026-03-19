# Apache Doris 生态日报 2026-03-19

> Issues: 13 | PRs: 150 | 覆盖项目: 10 个 | 生成时间: 2026-03-19 01:25 UTC

- [Apache Doris](https://github.com/apache/doris)
- [ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [DuckDB](https://github.com/duckdb/duckdb)
- [StarRocks](https://github.com/StarRocks/StarRocks)
- [Apache Iceberg](https://github.com/apache/iceberg)
- [Delta Lake](https://github.com/delta-io/delta)
- [Databend](https://github.com/databendlabs/databend)
- [Velox](https://github.com/facebookincubator/velox)
- [Apache Gluten](https://github.com/apache/incubator-gluten)
- [Apache Arrow](https://github.com/apache/arrow)

---

## Apache Doris 项目深度报告

⚠️ 摘要生成失败。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告（2026-03-19）

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储引擎开源生态整体呈现出 **“高活跃迭代 + 稳定性收敛压力并存”** 的态势。  
一方面，ClickHouse、DuckDB、StarRocks、Iceberg、Delta、Velox、Arrow 等项目都在持续推进 **查询优化、湖仓互操作、SQL 兼容、执行器增强**；另一方面，多个项目同时暴露出 **CI 崩溃、内存安全、查询正确性、对象存储回归、复杂 SQL 边界问题**。  
从方向看，生态已经明显从“单机/单引擎性能竞争”走向“**湖仓格式兼容 + 跨引擎协同 + 可运维性/可解释性 + 企业级稳定性**”竞争。  
对技术决策者而言，当前选型不再只是看吞吐和 benchmark，而更要看 **格式生态、复杂场景正确性、云对象存储行为、以及社区修复效率**。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 今日判断的健康度 |
|---|---:|---:|---|---|
| Apache Doris | N/A | N/A | N/A | **数据缺失，无法判断** |
| ClickHouse | 66 | 427 | 无 | **高活跃，推进强；但 CI/fuzz 噪音和存储层稳定性压力较大** |
| DuckDB | 126 | 80 | 无 | **高活跃；问题发现能力强，但 correctness / OOM / 数据湖回归积压明显** |
| StarRocks | 7 | 149 | 无 | **高活跃，多分支维护强；外表/湖仓兼容与复杂优化路径风险较高** |
| Apache Iceberg | 13 | 42 | 无 | **健康良好；以 Core/REST/Spark 能力补强和测试收敛为主** |
| Delta Lake | 0 | 21 | 无 | **中高活跃；问题面平稳，核心功能持续推进** |
| Databend | 6 | 12 | **v1.2.888-patch-1** | **活跃修复期；补丁响应快，但 JOIN/Parser/崩溃类问题需优先压降** |
| Velox | 5 | 50 | 无 | **活跃且积极修复；功能扩展快，但时间函数/内存安全/构建稳定性需关注** |
| Apache Gluten | 6 | 18 | 无 | **活跃且方向清晰；GPU/Velox/Iceberg 方向推进快，但上游依赖与性能边界待收敛** |
| Apache Arrow | 29 | 19 | 无 | **稳健活跃；工程质量与构建链路持续改进，成熟度较高** |

### 简要观察
- **PR 吞吐最高**：ClickHouse、StarRocks，说明核心内核和多分支维护负荷都很高。  
- **Issue 发现最密集**：DuckDB，反映其用户面广、场景复杂，也意味着 correctness 与平台边界压力更大。  
- **偏基础设施平台**：Iceberg、Arrow、Velox 的节奏更像“中层能力演进 + 生态兼容补强”。  
- **唯一明确发版**：Databend，当日更偏补丁修复与稳定性回收。  

---

## 3. Apache Doris 在生态中的定位

> 注：今日 Doris 摘要生成失败，以下定位基于其在 OLAP 生态中的典型角色，与本次其他项目动态做横向参照。

### 3.1 Doris 的典型优势
相较 ClickHouse、StarRocks、DuckDB 等，Apache Doris 的优势通常体现在：
- **MPP 分析数据库一体化能力较平衡**：兼顾高并发查询、近实时导入、物化视图、明细/聚合混合分析；
- **面向数仓和实时分析场景的整体产品化能力较强**：比单纯内核型项目更接近“可直接落地的平台型数据库”；
- **MySQL 协议、BI 接入、易运维性** 通常优于偏内核或格式层项目；
- 在中国及亚太数据分析场景中，**实时数仓 / 报表 / 明细查询融合** 是其典型落点。

### 3.2 与同类项目的技术路线差异
- **对比 ClickHouse**：  
  Doris 更强调 **MPP 数仓式统一分析体验**，而 ClickHouse 更偏 **极致执行性能 + MergeTree 体系 + 海量生态扩展**。ClickHouse 在格式支持、SQL 扩展速度、社区全球影响力上通常更强，但存储层复杂性和 CI 噪音也更大。
- **对比 StarRocks**：  
  两者都属于国产系高性能 MPP OLAP 路线，差异通常在于 **Lakehouse 集成深度、优化器演进路径、云原生 Shared-data 架构侧重点**。StarRocks 当前在 Iceberg/外表/湖仓集成上信号更强。
- **对比 DuckDB**：  
  Doris 是服务端分布式分析数据库；DuckDB 是嵌入式/单机分析引擎。两者目标负载和部署模型完全不同。
- **对比 Iceberg / Delta / Arrow / Velox**：  
  Doris 属于“数据库/查询系统”，而这些项目更偏 **表格式、执行引擎基础设施、内存格式与数据交换层**。

### 3.3 社区规模对比
从本次数据看：
- 若按 **PR/Issue 日活跃度** 衡量，Doris 即便不在今天统计中，通常会处于 **OLAP 第一梯队但未必达到 ClickHouse 那种全球超高吞吐规模**；
- 在国际生态曝光度上，**ClickHouse、DuckDB、Iceberg、Arrow** 更强；
- 在“数据库产品化落地”维度，Doris 常与 **StarRocks、ClickHouse** 放在同一比较组中，而不是与 Arrow / Velox / Iceberg 这类基础层项目直接对比。

**结论**：  
Doris 在生态中的核心定位，是 **面向企业分析场景的通用型分布式 OLAP 数据库**。它的竞争力更取决于 **产品完整度、实时数仓体验、湖仓接入能力和运维门槛**，而不只是单点 benchmark。

---

## 4. 共同关注的技术方向

以下是多项目同时涌现的共性需求与信号。

### 4.1 湖仓格式与对象存储兼容性持续成为主战场
**涉及项目**：ClickHouse、DuckDB、StarRocks、Iceberg、Delta Lake、Gluten、Arrow  
**具体诉求**：
- Iceberg / Parquet / Arrow / UUID / FIXED_LEN_BYTE_ARRAY 等格式兼容补齐
- S3 / GCS / Azure Data Lake / COS 上的枚举、过滤、上传、gzip、token refresh 稳定性
- REST Catalog、UniForm、Kafka Connect、外部表读写一致性

**判断**：  
生态正从“支持读取湖格式”走向“**真正生产可用的湖仓互操作**”。

---

### 4.2 查询优化器正在向更智能的裁剪、重写和统计传播演进
**涉及项目**：ClickHouse、DuckDB、StarRocks、Databend、Gluten、Arrow  
**具体诉求**：
- statistics-based pruning / part pruning / partition pruning
- OR/AND predicate pushdown、Filter Pushdown C API
- 多列函数依赖、array_map 统计传播、聚合重写、聚合索引命中
- shuffle block 级统计与动态过滤

**判断**：  
优化器竞争已经从“是否有 CBO”转向“**是否能在复杂表达式、对象存储和湖格式上做有效自动裁剪**”。

---

### 4.3 SQL 兼容性从锦上添花变成迁移门槛
**涉及项目**：ClickHouse、DuckDB、StarRocks、Delta Lake、Velox、Databend、Gluten  
**具体诉求**：
- `SOME/ANY`、`MATCH`、`UNIQUE(subquery)`、`SET TIME ZONE` 等标准 SQL 补齐
- `concat(NULL)`、`list_concat` 与操作符语义一致性
- MERGE / INSERT / CDC / correlated subquery 行为修复
- Spark/Presto 方言兼容、日期格式语义、JOIN 边界正确性

**判断**：  
随着 BI 工具、dbt、跨数据库迁移增多，**SQL 语义兼容已经直接影响采用成本**。

---

### 4.4 正确性、崩溃与内存安全被放到比性能更高的位置
**涉及项目**：ClickHouse、DuckDB、StarRocks、Databend、Velox、Delta Lake  
**具体诉求**：
- double deletion、use-after-free、segfault、panic、OOM、silent data loss
- 事务日志提交失败、spill 恢复 schema 错误、Join key 崩溃、streaming 缺提交校验
- “宁可失败也不能静默错/丢数”的修复倾向增强

**判断**：  
行业进入 **correctness-first** 阶段，特别是在流式、湖仓、复杂 SQL 和对象存储场景。

---

### 4.5 可观测性与运维解释能力成为新卖点
**涉及项目**：ClickHouse、Databend、StarRocks、Arrow、Delta Lake  
**具体诉求**：
- query log 中记录 skip index 使用
- runtime filter / spill 日志补全
- commit metrics、checkpoint stats、buffered bytes API
- 更可解释的 query behavior 和写入链路指标

**判断**：  
成熟用户不只看性能，还需要知道 **为什么快、为什么慢、为什么出错**。

---

## 5. 差异化定位分析

### 5.1 按存储格式/架构定位

| 项目 | 核心定位 | 存储/格式侧重点 | 典型角色 |
|---|---|---|---|
| ClickHouse | 列式 OLAP 数据库 | MergeTree、本地存储 + 外部格式 | 高性能分析数据库 |
| DuckDB | 嵌入式分析引擎 | Parquet/Arrow/对象存储 | 单机/嵌入式分析 |
| StarRocks | MPP OLAP / Lakehouse 查询 | 内表 + Iceberg/Parquet/REST Catalog | 企业数仓 / 湖仓分析 |
| Apache Doris | MPP OLAP 数据库 | 内表为主，持续加强湖仓接入 | 实时数仓 / BI 分析 |
| Apache Iceberg | 开放表格式 | Snapshot、partition evolution、REST Catalog | 湖仓元数据层 |
| Delta Lake | 事务型湖表格式 | Delta Log、Spark/DSv2/Kernel/UniForm | Lakehouse 表格式与事务层 |
| Databend | 云原生分析数据库 | FUSE、对象存储、半结构化数据 | 云原生数仓/分析库 |
| Velox | 执行引擎内核 | 连接器 + 向量化执行 | 上层引擎执行层 |
| Apache Gluten | Spark 加速层 | Velox/ClickHouse backend | Spark 原生加速 |
| Apache Arrow | 内存格式与交换层 | Arrow IPC、Parquet、Flight SQL | 数据交换/执行基础设施 |

---

### 5.2 查询引擎设计差异
- **数据库型引擎**：ClickHouse、Doris、StarRocks、Databend  
  更强调完整 SQL、存储管理、查询调度、导入导出、权限治理。
- **嵌入式/库型引擎**：DuckDB  
  更强调单机分析、Python/Arrow 生态、低部署门槛。
- **执行器内核**：Velox  
  更强调向量化执行、表达式求值、连接器和上层集成。
- **加速层**：Gluten  
  不是独立数据库，而是借助 Velox/ClickHouse backend 加速 Spark。
- **表格式/元数据层**：Iceberg、Delta  
  更关注 schema/partition evolution、snapshot、catalog、事务语义。
- **交换格式/连接层**：Arrow  
  负责内存表示、跨语言数据交换、Flight SQL 连接协议。

---

### 5.3 目标负载类型差异
- **实时分析 / 明细查询 / 大规模聚合**：ClickHouse、Doris、StarRocks
- **本地数据科学 / Notebook / 嵌入式 ETL**：DuckDB
- **云原生对象存储分析**：Databend、StarRocks、DuckDB
- **湖仓事务与跨引擎共享表**：Iceberg、Delta Lake
- **大数据执行底座 / Spark 加速**：Velox、Gluten
- **跨系统数据传输与中间格式**：Arrow

---

### 5.4 SQL 兼容性差异
- **兼容性诉求最密集**：ClickHouse、DuckDB、Velox/Gluten  
  这些项目都在快速吸收来自 PostgreSQL / Spark / Presto / 通用 SQL 的兼容需求。
- **更偏数据湖语义兼容**：Iceberg、Delta  
  重点不是传统 SQL 方言，而是 **跨引擎行为一致性**。
- **数据库产品型兼容**：StarRocks、Doris  
  重点是 BI、数据平台和企业 SQL 工具接入的平衡。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一梯队：超高活跃、快速演进
- **ClickHouse**
- **DuckDB**
- **StarRocks**

特点：
- PR/Issue 吞吐高
- 新能力和修复并行
- 主干分支承受较大回归与 CI 压力

#### 第二梯队：活跃且聚焦生态能力完善
- **Iceberg**
- **Velox**
- **Arrow**
- **Delta Lake**

特点：
- 更偏平台层、中间层
- 强调兼容性、API 收敛、基础设施演进
- 稳定性与路线图推进相对均衡

#### 第三梯队：活跃修复期 / 生态协同期
- **Databend**
- **Gluten**

特点：
- 问题暴露集中
- 修复节奏快
- 社区规模略小于头部，但迭代明显有方向

### 6.2 质量成熟度判断

#### 处于“快速迭代阶段”
- DuckDB
- ClickHouse
- Gluten
- Databend
- Velox

表现：
- 高速加入新能力
- 同时暴露大量 correctness / crash / 边界问题
- 社区反馈强烈、收敛速度决定口碑

#### 处于“质量巩固阶段”
- Arrow
- Iceberg
- Delta Lake

表现：
- 更注重接口收敛、测试补强、构建稳定、协议行为一致性
- 变化仍快，但更偏平台成熟化

#### 处于“两线并行阶段”
- StarRocks
- Doris（推测）

表现：
- 一边推进湖仓/优化器能力
- 一边维护数据库产品层稳定性和企业功能

---

## 7. 值得关注的趋势信号

### 7.1 “数据库”与“湖仓格式”边界继续模糊
ClickHouse、StarRocks、DuckDB、Databend 都在强化对 Iceberg/Parquet/Arrow/对象存储的支持；而 Delta、Iceberg 又在持续增强 catalog、事务和 engine-facing 接口。  
**参考价值**：架构师需要把“库表引擎”和“湖表格式”作为一个整体技术栈来设计，而不是割裂选型。

### 7.2 查询优化器进入“自动化裁剪”竞争阶段
从时间分区自动优化、statistics pruning、多列函数依赖、OR predicate pushdown，到 shuffle block 统计，多个项目都在努力减少用户手工改 SQL 的必要。  
**参考价值**：对于大规模数据工程团队，未来选型时应重点考察引擎在 **分区裁剪、对象存储文件发现、统计传播** 上的自动能力，而非只看单次 benchmark。

### 7.3 正确性问题比性能问题更受重视
silent numerical errors、silent data loss、wrong result、use-after-free、segfault 等问题在多个项目中都被高优先级处理。  
**参考价值**：生产环境应优先关注项目是否有 **透明的 bug 追踪、明确的 backport 策略、以及 correctness-first 的修复文化**。

### 7.4 SQL 兼容将成为生态扩张关键
标准 SQL、小语义差异、Spark/Presto/Postgres 兼容、CLI/Windows/Unicode 行为一致性，都说明分析引擎已经进入普适工具链竞争。  
**参考价值**：如果团队有迁移计划，建议关注兼容项积压、已关闭 issue 的类型，以及是否有明确的方言适配路线。

### 7.5 可观测性正在成为基础能力
query log、runtime filter 日志、commit metrics、buffered bytes、checkpoint stats，这些都表明项目在补“解释性基础设施”。  
**参考价值**：对数据工程团队来说，可观测性将显著影响 **调优效率、排障成本、运维稳定性**，应作为选型指标。

### 7.6 GPU / 向量化 / 执行器基础设施的价值在上升
Velox、Gluten、Arrow、Delta 的动态显示，执行引擎内核、Spark 加速层、Flight SQL、GPU 路线正在升温。  
**参考价值**：未来 OLAP 能力不一定都来自单体数据库，越来越多系统会采用 **表格式 + 执行内核 + 加速层 + 交换协议** 的组合架构。

---

## 结论

当前开源 OLAP / 分析型存储生态已经进入一个新的竞争阶段：  
**不是谁“单点性能最快”，而是谁能在湖仓格式、复杂 SQL、对象存储、可观测性和正确性之间取得更好的工程平衡。**

如果从技术决策角度看：
- **追求极致分析性能与快速功能扩展**：重点关注 ClickHouse  
- **追求嵌入式与本地分析体验**：重点关注 DuckDB  
- **追求企业级 MPP + 湖仓分析融合**：重点关注 Doris、StarRocks  
- **构建湖仓统一表层**：重点关注 Iceberg、Delta Lake  
- **关注下一代执行器和 Spark 加速**：重点关注 Velox、Gluten  
- **关注跨语言数据交换与 SQL 连接层**：重点关注 Arrow  

若你愿意，我可以进一步把这份报告再加工成两种形式之一：  
1. **管理层版 1 页摘要**  
2. **面向 Doris 视角的竞品对比版（突出 Doris vs ClickHouse / StarRocks / DuckDB）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时 ClickHouse 维持高活跃：**Issues 更新 66 条、PR 更新 427 条**，代码与问题处理节奏都很快。  
从结构上看，当前工作重点集中在三条主线：**稳定性修复与 CI 崩溃收敛、查询优化/存储裁剪能力增强、SQL 兼容性与生态格式支持扩展**。  
今日无新版本发布，但多个 PR 已显示出对后续稳定版的重要铺垫，尤其是 **MergeTree/事务日志/patch parts/格式读写** 相关问题仍是核心风险点。  
整体健康度评价：**活跃且推进强，但主干分支仍承受较高的 CI 与 fuzz 噪音，稳定性治理压力不小**。

---

## 3. 项目进展

### 已关闭 / 已推进的重要 PR 与 Issue

#### 3.1 修复 patch parts 列顺序不一致导致的 `LOGICAL_ERROR`
- **PR**: #99164 `Fix LOGICAL_ERROR due to patch parts column order mismatch`（已关闭，说明主修复已落地）
- 链接: ClickHouse/ClickHouse PR #99164

这项修复针对 patch parts 处理中的列顺序不一致问题，属于**存储层正确性/稳定性修复**。  
从后续动作看：
- **自动回移植 PR**：#99991（26.1 backport，进行中）
- 链接: ClickHouse/ClickHouse PR #99991

这表明该问题被认定为**需要进入稳定分支的重要修复**，对生产用户影响较大。

---

#### 3.2 优化器执行顺序修正：`tryOptimizeTopK` 与 `PREWHERE/WHERE` 的交互
- **PR**: #99880 `Fix tryOptimizeTopK interaction with WHERE clauses by running it after optimizePrewhere`（已关闭）
- 链接: ClickHouse/ClickHouse PR #99880

该修复调整优化 pass 顺序，使 `tryOptimizeTopK` 在 `optimizePrewhere` 之后执行，避免动态过滤或 top-k 优化过早占用 prewhere 槽位。  
这属于典型的**查询优化器正确性修复**，对复杂过滤条件下的执行计划稳定性和结果一致性都有价值。

---

#### 3.3 SQL 兼容性：`SOME` 作为 `ANY` 同义词已被关闭
- **Issue**: #99601 `Support SOME keyword as alias for ANY in subquery comparisons`（已关闭）
- 链接: ClickHouse/ClickHouse Issue #99601

虽然这里展示的是 Issue 而非对应 PR，但 issue 关闭意味着这类**轻量 SQL 兼容性改进**已被接受并实现或以其他方式处理。  
这类工作对 BI 工具、迁移自 PostgreSQL/通用 SQL 方言的用户非常友好。

---

#### 3.4 analyzer 性能回归问题已关闭
- **Issue**: #91855 `Performance regression with analyzer: ARRAY JOIN with implicitly nested columns`（已关闭）
- 链接: ClickHouse/ClickHouse Issue #91855

该问题涉及 analyzer 打开后 `ARRAY JOIN` 在隐式 nested 列上的明显性能退化。Issue 关闭说明**新分析器的兼容性/性能问题在持续收敛**，这是 ClickHouse 近阶段查询层演进的重要信号。

---

#### 3.5 Iceberg 相关崩溃修复继续推进并回移植
- **Issue**: #99523 `ALTER TABLE MODIFY COLUMN COMMENT on Iceberg table crashes ClickHouse server`（已关闭）
- 链接: ClickHouse/ClickHouse Issue #99523
- **PR**: #99406 `Cherry pick #99108 to 25.3: Fix crash during ALTER TABLE REMOVE SETTING in iceberg`（进行中）
- 链接: ClickHouse/ClickHouse PR #99406

Iceberg 方向今日持续出现修复与回移植动作，说明外部表格式支持虽快速发展，但 DDL 路径仍是高风险区域。对使用 Iceberg catalog / lakehouse 场景的用户，这是值得重点跟踪的模块。

---

## 4. 社区热点

### 4.1 Hacker News Dataset 长期开源数据集议题仍在活跃
- **Issue**: #29693 `[comp-documentation, dataset] Hacker News Dataset`
- 链接: ClickHouse/ClickHouse Issue #29693

这是今日评论数最高的 issue（45 评论），虽非核心内核 bug，但说明社区对**官方示例数据集、可复现 benchmark、教学/演示资产**的需求持续存在。  
背后技术诉求：
- 降低新用户试用门槛
- 提供更标准化的 demo 数据
- 支撑文档、性能演示和生态教育

---

### 4.2 CI 崩溃：事务日志提交阶段失败
- **Issue**: #85468 `[CI crash] Transaction log finalize failed during commit`
- 链接: ClickHouse/ClickHouse Issue #85468

高评论的 CI 崩溃问题表明事务/提交路径依然敏感。  
技术上这类问题通常影响：
- MergeTree 事务提交流程
- 元数据一致性
- 并发写入与异常恢复

若该类 crash 在主干长期存在，会直接拖慢合并效率。

---

### 4.3 新出现的 double deletion 崩溃
- **Issue**: #99830 `[CI crash] Double deletion of MergeTreeDataPartCompact`
- 链接: ClickHouse/ClickHouse Issue #99830
- 关联问题：#99799 `Double deletion of MergeTreeDataPartCompact in multi_index`
- 链接: ClickHouse/ClickHouse Issue #99799

这类问题高度值得关注。`MergeTreeDataPartCompact` 双重释放通常意味着：
- 生命周期管理缺陷
- 引用计数/所有权边界不清
- 并发路径中的析构顺序问题

这是典型的**高严重度内存安全问题**，尽管当前主要体现于 CI，也可能在极端生产场景复现。

---

### 4.4 流式查询 RFC
- **Issue**: #99868 `[RFC] Streaming Queries`
- 链接: ClickHouse/ClickHouse Issue #99868

这是今天最值得关注的路线图信号之一。RFC 明确对标 Flink / RisingWave 风格的流式查询模型，说明社区正在讨论 ClickHouse 从“批+准实时 OLAP”向“更原生的连续查询/事件时间处理”扩展的可能性。  
若推进，将显著影响：
- 查询模型
- 物化视图/窗口语义
- 状态管理与容错
- ClickHouse 在实时分析栈中的定位

---

### 4.5 时间分区表的自动查询优化需求
- **Issue**: #99960 `[feature] Automatically Optimize Queries on Time-Partitioned Tables`
- 链接: ClickHouse/ClickHouse Issue #99960

该需求希望 ClickHouse 自动从原始时间列的范围谓词，推导到分区表达式（如 `toStartOfHour(ts)`）的边界条件。  
背后反映的是用户对**更智能的谓词改写与分区裁剪**的期待，和当前进行中的统计信息裁剪 PR 形成呼应。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高严重：内存安全与崩溃

#### 5.1 `MergeTreeDataPartCompact` 双重释放
- **Issue**: #99830 `[CI crash] Double deletion of MergeTreeDataPartCompact`
- 链接: ClickHouse/ClickHouse Issue #99830
- **关联**: #99799 `Double deletion ... in multi_index`
- 链接: ClickHouse/ClickHouse Issue #99799
- **是否已有 fix PR**: 暂未在给定数据中看到明确修复 PR

这是今日最危险的新问题之一，涉及对象生命周期与内存释放错误。

---

#### 5.2 事务日志提交 finalize 失败
- **Issue**: #85468 `[CI crash] Transaction log finalize failed during commit`
- 链接: ClickHouse/ClickHouse Issue #85468
- **是否已有 fix PR**: 未见明确对应 PR

该问题可能影响提交阶段的一致性与可靠性，需继续追踪。

---

#### 5.3 Iceberg DDL 崩溃已关闭
- **Issue**: #99523 `ALTER TABLE MODIFY COLUMN COMMENT on Iceberg table crashes ClickHouse server`
- 链接: ClickHouse/ClickHouse Issue #99523
- **状态**: 已关闭，说明已有修复
- **相关 backport**: #99406
- 链接: ClickHouse/ClickHouse PR #99406

此问题属于**外表格式适配中的空指针崩溃**，已进入修复/回移植阶段。

---

### P1 / 正确性与执行引擎异常

#### 5.4 analyzer 逻辑错误：`ignore` 返回类型异常
- **Issue**: #61783 `Analyzer: Logical error: Unexpected return type from ignore. Expected Nullable. Got UInt8`
- 链接: ClickHouse/ClickHouse Issue #61783
- **是否已有 fix PR**: 数据中未见明确 fix PR
- **备注**: 标注 `st-fixed`，可能已有内部或待同步修复状态

这类错误通常反映 analyzer 在类型推导/表达式重写上的边缘案例问题。

---

#### 5.5 直接 `WHERE` 谓词失败，但子查询形式成功
- **Issue**: #99832 `Direct WHERE predicate fails with TOO_FEW_ARGUMENTS_FOR_FUNCTION`
- 链接: ClickHouse/ClickHouse Issue #99832
- **是否已有 fix PR**: 未见

这是标准的**语义等价查询不一致**问题，属于查询重写或 AST 分析路径异常。

---

#### 5.6 `clickhouse-client` 退出挂起
- **Issue**: #99694 `clickhouse-client hangs on exit when user lacks SELECT ON *.*`
- 链接: ClickHouse/ClickHouse Issue #99694
- **是否已有 fix PR**: 未见

该问题与权限不足时 suggestion thread 阻塞在 `system.columns` 元数据锁相关，是典型**客户端体验回归 + 权限边界问题**。

---

### P2 / 格式解析与数据导入稳定性

#### 5.7 Npy 格式：负 shape 导致无限循环
- **Issue**: #99585 `Npy format: negative shape dimension causes infinite loop`
- 链接: ClickHouse/ClickHouse Issue #99585
- **潜在影响**: 恶意或损坏输入可导致解析线程异常卡死
- **是否已有 fix PR**: 未见
- **相关改进方向**: #99822
- 链接: ClickHouse/ClickHouse PR #99822

PR #99822 提出将“可由坏数据触发的反序列化检查”从 `LOGICAL_ERROR` 改为 `INCORRECT_DATA`，虽然不是专修 Npy，但方向上有助于**把输入异常从内部逻辑错误中剥离出来**。

---

#### 5.8 Parquet 读取问题仍在发酵
- **Issue**: #93093 `parquet reader v3 sometimes failed to read ... timestamp('us', 'UTC')`
- 链接: ClickHouse/ClickHouse Issue #93093
- **Issue**: #99019 `Error reading Parquet file in v26.2.4.23`
- 链接: ClickHouse/ClickHouse Issue #99019
- **是否已有 fix PR**: 暂未明确看到对应修复，但有功能增强 PR #99521
- 链接: ClickHouse/ClickHouse PR #99521

Parquet/Arrow 仍是用户最频繁反馈的兼容性热点之一。

---

### P3 / 已关闭问题，稳定性有所改善

- #99358 `MergeTreeRangeReader finalize failed during data reading`（已关闭）  
  链接: ClickHouse/ClickHouse Issue #99358
- #83995 `StorageKafka throws exception when deduplicate_blocks_in_dependent_materialized_views is enabled`（已关闭）  
  链接: ClickHouse/ClickHouse Issue #83995
- #38738 `groupArray & aggregate_functions_null_for_empty = DB::Exception`（已关闭）  
  链接: ClickHouse/ClickHouse Issue #38738
- #99233 `Maybe concurrency bug in the CPU workload scheduler`（已关闭，obsolete-version）  
  链接: ClickHouse/ClickHouse Issue #99233

这些关闭项表明：**Kafka、聚合函数边界行为、读取路径 crash、调度器疑难问题**都在持续清理。

---

## 6. 功能请求与路线图信号

### 6.1 流式查询能力是最强路线图信号
- **Issue**: #99868 `[RFC] Streaming Queries`
- 链接: ClickHouse/ClickHouse Issue #99868

这是明显超越“单点功能”的架构级讨论。若立项，将影响 ClickHouse 对连续计算和状态流处理的战略定位。短期看更像 RFC 阶段，中长期可能先以实验形态落地。

---

### 6.2 时间分区表自动优化
- **Issue**: #99960 `Automatically Optimize Queries on Time-Partitioned Tables`
- 链接: ClickHouse/ClickHouse Issue #99960
- **相关 PR**: #94140 `Add statistics-based part pruning`
- 链接: ClickHouse/ClickHouse PR #94140

两者组合看，ClickHouse 正朝**更自动化的分区/统计信息裁剪**演进。  
其中 #94140 已是实做 PR，落地概率明显高于纯需求 issue。

---

### 6.3 查询可观测性增强：跳数索引使用写入 query log
- **PR**: #99793 `Log skip index use in query log`
- 链接: ClickHouse/ClickHouse PR #99793

这类特性非常实用，能帮助用户理解：
- 为什么查询快/慢
- 哪些 skip index 真正发挥了作用
- 如何调优 schema 与索引设计

属于**可运维性/可解释性增强**，进入下一版本的可能性较高。

---

### 6.4 Arrow / Parquet 对 UUID 支持增强
- **PR**: #99521 `Add Arrow and Parquet format support for UUID data type`
- 链接: ClickHouse/ClickHouse PR #99521

这是生态互操作层面的重要改进，直接改善：
- lakehouse / data interchange 兼容性
- Python / Arrow 生态对接
- 跨系统 schema 映射一致性

从成熟度和用户价值看，**非常可能被纳入近期版本**。

---

### 6.5 Keeper 对象化快照
- **PR**: #99651 `Keeper object-based snapshots`
- 链接: ClickHouse/ClickHouse PR #99651

这反映出 Keeper 在**快照机制、恢复效率、存储组织**上的继续演进，偏基础设施能力增强。

---

### 6.6 ReplacingMergeTree 自动 cleanup 调度
- **PR**: #99643 `Add replacing_merge_cleanup_period_seconds experimental setting`
- 链接: ClickHouse/ClickHouse PR #99643

该实验特性面向使用 ReplacingMergeTree 的用户，减少手工执行 `OPTIMIZE ... FINAL CLEANUP` 的运维负担。  
如果验证稳定，可能成为非常受欢迎的自动化治理能力。

---

### 6.7 持续增加 SQL 兼容性需求
相关 issues：
- #99610 `Support MATCH predicate`
- 链接: ClickHouse/ClickHouse Issue #99610
- #99609 `Support UNIQUE(subquery) predicate`
- 链接: ClickHouse/ClickHouse Issue #99609
- #99606 `Add setting to make || / concat() propagate NULL`
- 链接: ClickHouse/ClickHouse Issue #99606
- #99612 `Support SET TIME ZONE INTERVAL ... and SET SESSION CHARACTERISTICS`
- 链接: ClickHouse/ClickHouse Issue #99612

这些需求集中体现出：**用户正越来越多地把 ClickHouse 放进标准 SQL 工具链和多数据库兼容场景中**。  
其中：
- `concat(NULL)` 语义开关
- `SET TIME ZONE INTERVAL`
- `SOME/ANY` 同义支持

最有希望以“小步兼容增强”的方式陆续进入版本。

---

## 7. 用户反馈摘要

基于今日 issues，可提炼出几类真实用户痛点：

### 7.1 “我写的是等价 SQL，但 ClickHouse 表现不一致”
- 代表问题：#99832、#99601、#99610、#99609
- 链接: ClickHouse/ClickHouse Issue #99832  
- 链接: ClickHouse/ClickHouse Issue #99601  
- 链接: ClickHouse/ClickHouse Issue #99610  
- 链接: ClickHouse/ClickHouse Issue #99609

这说明 SQL 兼容性已不只是“锦上添花”，而是**迁移成本与工具接入成本的关键变量**。

---

### 7.2 “格式兼容很好用，但边界数据会出问题”
- 代表问题：#93093、#99019、#99585
- 链接: ClickHouse/ClickHouse Issue #93093  
- 链接: ClickHouse/ClickHouse Issue #99019  
- 链接: ClickHouse/ClickHouse Issue #99585

用户明显在广泛使用 **Parquet / Arrow / Npy / S3** 等外部数据入口，期待 ClickHouse 在异常输入、编码细节、谓词下推后读取行为上更稳。

---

### 7.3 “新 analyzer / 新优化器能力很强，但边缘场景还需打磨”
- 代表问题：#61783、#91855、#99880
- 链接: ClickHouse/ClickHouse Issue #61783  
- 链接: ClickHouse/ClickHouse Issue #91855  
- 链接: ClickHouse/ClickHouse PR #99880

这类反馈说明用户愿意采用新分析器，但对**性能回归、类型推导、pass 顺序正确性**十分敏感。

---

### 7.4 “权限与客户端交互细节会直接影响可用性”
- 代表问题：#99694
- 链接: ClickHouse/ClickHouse Issue #99694

这不是核心算子 bug，却是非常典型的**真实生产体验问题**：权限受限用户退出客户端竟然卡住，说明产品需要继续优化权限边界下的元数据访问与线程退出流程。

---

## 8. 待处理积压

以下是值得维护者特别关注的长期或久拖未决项：

### 8.1 长期开放的数据集文档议题
- **Issue**: #29693 `Hacker News Dataset`
- 创建于 2021-10-04，至今仍活跃
- 链接: ClickHouse/ClickHouse Issue #29693

虽然不是 blocker，但它持续活跃说明文档/示例资产建设仍有社区缺口。

---

### 8.2 GCS + S3 table function + gzip 元数据兼容问题
- **Issue**: #47980 `empty result or ZLIB_INFLATE_FAILED ... GCS files with Content-Encoding: gzip`
- 创建于 2023-03-24，仍开放
- 链接: ClickHouse/ClickHouse Issue #47980

这是典型的**云对象存储兼容性历史遗留问题**。随着多云存储场景普及，这类问题值得重新评估优先级。

---

### 8.3 parquet reader v3 兼容性问题
- **Issue**: #93093
- 链接: ClickHouse/ClickHouse Issue #93093

Parquet reader v3 是新链路的重要组成部分，任何长期开放的编码兼容问题都会影响企业采用信心。

---

### 8.4 统计信息裁剪 PR 长期开启
- **PR**: #94140 `Add statistics-based part pruning`
- 创建于 2026-01-14，仍开放
- 链接: ClickHouse/ClickHouse PR #94140

这是一个**高价值、较大改动面**的性能特性。若迟迟不合并，建议维护者明确：
- 覆盖测试是否充分
- 与现有 partition pruning / skip index 的交互风险
- 是否拆分为更小 patch 便于落地

---

### 8.5 DISTINCT 性能优化 PR 持续排队
- **PR**: #97113 `Optimize DISTINCT transform ...`
- 创建于 2026-02-16，仍开放
- 链接: ClickHouse/ClickHouse PR #97113

该 PR 面向常见查询性能路径，若验证充分，应尽量加快结论。

---

## 结论

今日 ClickHouse 的主旋律非常明确：**一边快速扩展能力边界，一边持续为主干稳定性“还债”**。  
短期最值得关注的是：
1. **MergeTree / 事务日志 / patch parts / Iceberg** 相关稳定性修复是否继续收敛；  
2. **统计裁剪、skip index 可观测性、格式 UUID 支持** 等高价值增强是否进入近期版本；  
3. **流式查询 RFC** 是否从概念讨论进入实验设计。  

从项目健康度看，ClickHouse 依旧保持极强研发动能，但当前阶段的关键成功因素，不只是“加功能”，更是**把复杂查询路径、存储生命周期和格式兼容细节真正打磨到稳定可预期**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 — 2026-03-19

## 1. 今日速览

过去 24 小时 DuckDB 仓库保持高活跃：**Issues 更新 126 条、PR 更新 80 条**，但**无新版本发布**。  
从议题分布看，当前社区关注点依旧集中在三类问题：**查询正确性**、**文件/对象存储读写性能与稳定性**、以及 **Windows/Unicode/CLI 兼容性回归**。  
PR 侧虽然暂无版本落地，但有不少围绕 **优化器、Filter Pushdown、并行执行、存储版本统一、CLI/加密、SQL 扩展语法** 的持续推进，显示项目仍在积极打磨 1.5.x 之后的工程能力。  
整体健康度判断：**活跃度高，问题发现能力强，但稳定性与积压治理压力也较大**，尤其是长期 stale 且涉及 correctness / OOM / S3 / 导入导出的问题需要维护者进一步收敛。

---

## 2. 项目进展

> 今日数据未直接给出全部“已合并 PR”明细，以下重点基于**已关闭 Issue**与**活跃 PR 状态**梳理实际推进方向。

### 2.1 今日关闭/推进的重要问题

#### 1) ATTACH + ENCRYPTION_KEY 在断网环境下挂起问题已关闭
- Issue: [#20797](https://github.com/duckdb/duckdb/issues/20797)
- 状态: **CLOSED**
- 意义: 修复/关闭了一个与**加密数据库 attach**和**网络不可用环境**相关的可用性问题。  
- 技术影响: 对嵌入式部署、离线环境、企业安全环境尤为重要；说明 DuckDB 在加密功能落地后，正在补足异常环境下的行为一致性。

#### 2) PyArrow Dataset `COUNT(1)` 仍读取全部列的问题已关闭
- Issue: [#14718](https://github.com/duckdb/duckdb/issues/14718)
- 状态: **CLOSED**
- 意义: 这是一个典型的**列裁剪/投影下推**问题。若 `SELECT COUNT(1)` 触发全列读取，会显著放大扫描成本。  
- 技术影响: 对 Arrow / Lakehouse 场景性能非常关键，关闭说明相关路径已有处理或确认结论，属于扫描效率改进信号。

#### 3) `union_by_name + hive_partitioning` 过滤分区列问题关闭
- Issue: [#7491](https://github.com/duckdb/duckdb/issues/7491)
- 状态: **CLOSED**
- 意义: 涉及 **Hive 分区过滤下推** 与 **schema 对齐** 的交互，是数据湖读取中的高频问题。  
- 技术影响: 尽管今天仍有新的 Hive pruning 争议（见 #21347），但旧问题关闭说明该领域仍在持续演进，并不完全停滞。

#### 4) 多个旧 correctness / binder / internal error 问题被关闭
- 例如：
  - [#14728](https://github.com/duckdb/duckdb/issues/14728) ENUM 值访问触发 INTERNAL error
  - [#14755](https://github.com/duckdb/duckdb/issues/14755) `array_agg()` 非确定性行为
  - [#14534](https://github.com/duckdb/duckdb/issues/14534) schema copy 未复制 CHECK/DEFAULT/GENERATED
  - [#14801](https://github.com/duckdb/duckdb/issues/14801) `regexp_extract` 在 table-valued / scalar 上 binder 不一致
- 技术影响: 这些关闭项表明 DuckDB 仍在持续清理 1.1.x~1.2.x 期间累积的 SQL 语义边角问题。

### 2.2 今日值得关注的活跃 PR 方向

#### Windows Shell / Unicode 兼容性修复
- PR: [#21472](https://github.com/duckdb/duckdb/pull/21472)
- 标题: **Shell: use Unicode entry point on Windows**
- 解读: 直指 Windows 下 shell 入口点与 UTF-8/Unicode 处理历史配置错误，和今日新报的中文路径 CLI 问题高度相关。  
- 价值: 很可能成为近期 Windows CLI 兼容性修复的关键补丁。

#### C API 暴露 filter pushdown / prune 能力
- PR: [#14591](https://github.com/duckdb/duckdb/pull/14591)
- 解读: 为 table function 引入更完整的过滤信息访问接口。  
- 价值: 对扩展生态极其重要，能让外部扫描器更好地参与优化器下推，提升对象存储、外部数据库、文件源连接器性能。

#### 优化器与执行器能力增强
- [#20245](https://github.com/duckdb/duckdb/pull/20245) `arg_min/max` + `unnest` 结构裁剪优化  
- [#19842](https://github.com/duckdb/duckdb/pull/19842) 并行 `row_number` 虚拟列与 `ROW_NUMBER() OVER()` 重写  
- [#20338](https://github.com/duckdb/duckdb/pull/20338) 扩展 OR predicate pushdown 支持嵌套 AND  
- [#18818](https://github.com/duckdb/duckdb/pull/18818) `range` 过滤基数估计  
- 解读: 这些 PR 指向 DuckDB 的核心路线：**更强的代价估计、更激进的下推、更少的宽行物化、更高的并行度**。

#### 存储/版本治理
- PR: [#20288](https://github.com/duckdb/duckdb/pull/20288)
- 标题: **Unify StorageVersion and SerializationVersion**
- 解读: 属于内部存储协议整理。  
- 价值: 对未来版本兼容、存储演进、序列化行为一致性有中长期意义。

---

## 3. 社区热点

### 热点 1：Hive 分区过滤在 1.5.0 疑似回归
- Issue: [#21347](https://github.com/duckdb/duckdb/issues/21347)
- 状态: OPEN, under review
- 评论: 18
- 核心问题: **S3 上读取 hive-partitioned parquet 时，1.5.0 似乎先发现所有文件，再做分区裁剪**；而 1.4.4 更像是先剪枝后访问。
- 技术诉求:
  1. 用户希望 DuckDB 在对象存储场景具备**真正的早期 pruning**；
  2. 文件枚举成本在 S3/COS/GCS 上常常比实际扫描更贵；
  3. 这不仅是性能问题，也关系到云账单与可扩展性。
- 关联信号: 与已关闭的 [#7491](https://github.com/duckdb/duckdb/issues/7491) 同属数据湖过滤下推主题，说明该方向仍有回归风险。

### 热点 2：`list_concat([1], null)` 与 `[1] || null` 语义不一致
- Issue: [#14692](https://github.com/duckdb/duckdb/issues/14692)
- 状态: OPEN, reproduced
- 评论: 19
- 核心问题: 内置函数与运算符在 `NULL` 语义和推断类型上不一致。
- 技术诉求:  
  DuckDB 用户越来越把它当作“严肃 SQL 引擎”而非单纯嵌入式库，因此对**表达式语义一致性**、**类型系统严谨性**要求更高。

### 热点 3：Parquet 读字符串触发 OOM
- Issue: [#16078](https://github.com/duckdb/duckdb/issues/16078)
- 状态: OPEN, under review, stale
- 评论: 14
- 核心问题: 总字符串 3.3GB，在 memory-limit 4GB 下读取 parquet 报 OOM，而 duckdb native 文件可成功。
- 技术诉求:
  1. 用户期待 parquet 路径具备接近 native 存储的内存效率；
  2. 字符串列/变长列的内存峰值控制仍是关键挑战；
  3. 大数据 ETL 用户尤其关心“能不能稳定跑完”。

### 热点 4：Windows/Unicode CLI 兼容性
- Issue: [#21445](https://github.com/duckdb/duckdb/issues/21445)
- 状态: OPEN, needs triage
- 评论: 6
- 核心问题: `duckdb -c` 在中文路径下 1.4.4 可用、1.5 失败，疑似回归。
- 关联 PR: [#21472](https://github.com/duckdb/duckdb/pull/21472)
- 技术诉求: 这是非常实际的产品问题，影响中文用户、Windows 用户、命令行自动化场景。

### 热点 5：S3/COS multipart upload + gzip 大文件异常
- Issue: [#14877](https://github.com/duckdb/duckdb/issues/14877)
- 状态: OPEN, under review, stale
- 评论: 10
- 核心问题: 大 gzip CSV 输出到 IBM COS(S3) 时，multipart upload 既不正确覆盖，也可能不正常关闭句柄。
- 技术诉求: 体现 DuckDB 被广泛用于**云对象存储导出链路**，用户要求其不只是能查，还要能稳定落盘/上传。

---

## 4. Bug 与稳定性

> 按严重程度排序，优先列出可能导致**错误结果、崩溃、卡死、明显回归**的问题。

### P0 / 查询正确性风险

#### 1) UHUGEINT 存在 silent numerical errors
- Issue: [#14580](https://github.com/duckdb/duckdb/issues/14580)
- 状态: OPEN
- 风险: **错误结果且无报错**，这是数据库中最严重的问题类型之一。
- 现状: 暂未见对应 fix PR 出现在今日高活跃列表中。
- 建议: 应优先排查是否影响聚合、递归 CTE、UDF、数值边界运算。

#### 2) `list_concat` 与 `||` 语义不一致
- Issue: [#14692](https://github.com/duckdb/duckdb/issues/14692)
- 状态: OPEN
- 风险: 表达式等价替换失效，可能造成 SQL 重写与用户认知偏差。
- fix PR: **未见明确关联 PR**

#### 3) `ARRAY` operator 是否保持顺序存在争议
- Issue: [#15011](https://github.com/duckdb/duckdb/issues/15011)
- 状态: OPEN
- 风险: 结果集可重复性与 SQL 语义预期不一致。
- fix PR: **未见**

#### 4) `USING SAMPLE 1` 未正确识别为 volatile
- Issue: [#15269](https://github.com/duckdb/duckdb/issues/15269)
- 状态: OPEN
- 风险: 优化器可能错误缓存/重用表达式，导致统计/采样结果异常。
- 备注: 被标记 expected behavior 但仍值得关注，属于语义边界定义问题。

### P1 / 崩溃、INTERNAL error、内存破坏

#### 5) Python 插入事务触发 `free(): corrupted unsorted chunks`
- Issue: [#15674](https://github.com/duckdb/duckdb/issues/15674)
- 状态: OPEN
- 风险: 涉及原生内存破坏，潜在严重稳定性问题。
- fix PR: **未见**

#### 6) 带 WHERE 时触发 `Attempted to access index 0 within vector of size 0`
- Issue: [#14491](https://github.com/duckdb/duckdb/issues/14491)
- 状态: OPEN
- 风险: INTERNAL error，可能是执行器/向量边界访问问题。
- fix PR: **未见**

#### 7) 读取 Parquet OOM
- Issue: [#16078](https://github.com/duckdb/duckdb/issues/16078)
- 状态: OPEN
- 风险: 大数据任务不可运行，尤其在字符串重负载场景。
- fix PR: **未见**

### P1 / 回归与平台兼容性

#### 8) Windows 中文路径 `duckdb -c` 在 1.5 失效
- Issue: [#21445](https://github.com/duckdb/duckdb/issues/21445)
- 状态: OPEN
- 风险: 明确版本回归，影响 CLI 易用性。
- 关联 fix PR: [#21472](https://github.com/duckdb/duckdb/pull/21472)

#### 9) Hive 分区过滤先 discover 全量文件
- Issue: [#21347](https://github.com/duckdb/duckdb/issues/21347)
- 状态: OPEN
- 风险: 云场景性能严重退化，可能表现为“看似卡住”或大幅增成本。
- 关联 fix PR: **未见明确 PR**

### P2 / 兼容性与文档一致性

#### 10) `UNIQUE` 约束未考虑 collation
- Issue: [#19675](https://github.com/duckdb/duckdb/issues/19675)
- 状态: OPEN
- 风险: 约束语义不完整，影响应用层数据一致性。
- fix PR: **未见**

#### 11) export/import view 创建顺序导致重新导入失败
- Issue: [#15353](https://github.com/duckdb/duckdb/issues/15353)
- 状态: OPEN
- 风险: 导入导出链路不可靠，影响备份迁移。
- 标签: Needs Documentation，但实际也可能需要行为修正。

---

## 5. 功能请求与路线图信号

### 5.1 高价值功能请求

#### 1) Table Function 的 C API 获取 filter pushdown / prune 信息
- PR: [#14591](https://github.com/duckdb/duckdb/pull/14591)
- 路线图判断: **较有机会纳入后续版本**
- 原因: 这类能力能直接提升扩展生态可用性，且对外部数据源扫描器意义大。

#### 2) 支持扩展注册关键字
- PR: [#18495](https://github.com/duckdb/duckdb/pull/18495)
- 路线图判断: **中等概率**
- 原因: 对扩展作者友好，但涉及 parser/keyword 管理，需要较谨慎评审。

#### 3) `LIKE/ILIKE ANY` over array literals
- PR: [#18722](https://github.com/duckdb/duckdb/pull/18722)
- 路线图判断: **中等概率**
- 原因: SQL 易用性增强明显，但兼容标准与语法设计需要进一步确认。

#### 4) `CLUSTER <tbl> ORDER BY <expr>`
- PR: [#19696](https://github.com/duckdb/duckdb/pull/19696)
- 路线图判断: **中低概率，但战略价值高**
- 原因: 涉及物理重排和存储层语义，不是轻量功能；若落地将增强 DuckDB 在“可维护本地分析库”方向的能力。

#### 5) CLI 直接支持加密参数
- PR: [#20271](https://github.com/duckdb/duckdb/pull/20271)
- 路线图判断: **较有机会**
- 原因: 与已关闭的加密 attach 问题 [#20797](https://github.com/duckdb/duckdb/issues/20797) 形成呼应，说明加密体验仍在完善期。

#### 6) 新聚合函数 `max_intersections`
- PR: [#20309](https://github.com/duckdb/duckdb/pull/20309)
- 路线图判断: **中等偏低**
- 原因: 功能实用，但属于增量函数，不如优化器/兼容性问题优先级高。

### 5.2 更强的优化器/执行器路线信号

以下 PR 共同指向下一阶段 DuckDB 重点：
- [#19842](https://github.com/duckdb/duckdb/pull/19842) 并行 `ROW_NUMBER`
- [#20245](https://github.com/duckdb/duckdb/pull/20245) 结构裁剪优化
- [#20338](https://github.com/duckdb/duckdb/pull/20338) OR/AND 谓词下推
- [#19877](https://github.com/duckdb/duckdb/pull/19877) `IS NULL / IS NOT NULL` 作为 TableFilters 下推
- [#18818](https://github.com/duckdb/duckdb/pull/18818) range 基数估计
- 结论: DuckDB 正持续加强**扫描前过滤、统计估计、并行流水执行、宽表查询裁剪**，这很符合其 OLAP 引擎定位。

---

## 6. 用户反馈摘要

### 6.1 真实使用场景
1. **对象存储数据湖分析**
   - S3 / COS / Hive Partition / Parquet 是反复出现的高频场景。  
   - 用户非常在意：**文件发现是否过早放大、分区过滤是否真的下推、上传是否可靠完成**。
   - 相关链接：
     - [#21347](https://github.com/duckdb/duckdb/issues/21347)
     - [#14877](https://github.com/duckdb/duckdb/issues/14877)
     - [#7491](https://github.com/duckdb/duckdb/issues/7491)

2. **嵌入式 Python 工作流**
   - Python 中事务插入、流式读取、DataFrame/Arrow 交互仍是核心入口。
   - 用户痛点集中在：**崩溃、流式结果提前终止、Parquet 读入内存峰值高**。
   - 相关链接：
     - [#15674](https://github.com/duckdb/duckdb/issues/15674)
     - [#16589](https://github.com/duckdb/duckdb/issues/16589)
     - [#16078](https://github.com/duckdb/duckdb/issues/16078)

3. **Windows 本地 CLI / 多语言路径**
   - 中文路径与 Unicode 问题说明 DuckDB 不再只是 Linux/macOS 开发者工具，已经被用于更广泛桌面/脚本环境。
   - 相关链接：
     - [#21445](https://github.com/duckdb/duckdb/issues/21445)
     - [#21472](https://github.com/duckdb/duckdb/pull/21472)
     - [#14617](https://github.com/duckdb/duckdb/issues/14617)

### 6.2 用户满意度与隐含期望
- 一些 Issue 描述中明确表达了对 DuckDB 的认可，但随后提出更高要求，例如导入导出、SQL 约束、数据湖性能、CLI 兼容性。  
- 这反映出用户已经把 DuckDB 用于**生产型分析链路**，而非简单 demo 工具。  
- 因此用户的核心期待不只是“支持某功能”，而是：
  1. **结果必须正确**
  2. **异常必须可诊断**
  3. **文件/云存储 IO 必须稳定**
  4. **跨平台行为必须一致**

---

## 7. 待处理积压

> 以下为长期未解决、但对项目形象或生产可用性影响较大的积压项，建议维护者优先关注。

### 7.1 Issue 积压

#### 1) UHUGEINT 错误结果
- [#14580](https://github.com/duckdb/duckdb/issues/14580)
- 风险最高，属于 silent correctness bug。

#### 2) Parquet 读取 OOM
- [#16078](https://github.com/duckdb/duckdb/issues/16078)
- 长期 under review + stale，不利于大规模数据场景信心建立。

#### 3) S3/COS multipart upload + gzip 大文件问题
- [#14877](https://github.com/duckdb/duckdb/issues/14877)
- 长期 under review + stale，影响云导出稳定性。

#### 4) import/export 相关可靠性问题
- [#14562](https://github.com/duckdb/duckdb/issues/14562)
- [#15353](https://github.com/duckdb/duckdb/issues/15353)
- 影响迁移、备份、恢复流程。

#### 5) Python 原生崩溃 / 流式读取提前终止
- [#15674](https://github.com/duckdb/duckdb/issues/15674)
- [#16589](https://github.com/duckdb/duckdb/issues/16589)
- 这类问题对开发者体验伤害很大。

### 7.2 PR 积压

#### 1) Filter Pushdown C API
- [#14591](https://github.com/duckdb/duckdb/pull/14591)
- 创建时间较久，且对扩展生态价值高，建议尽快给出明确去留。

#### 2) Extensible keywords
- [#18495](https://github.com/duckdb/duckdb/pull/18495)
- 已 stale + changes requested，若不计划合并，应尽快收敛设计讨论。

#### 3) `LIKE/ILIKE ANY`
- [#18722](https://github.com/duckdb/duckdb/pull/18722)
- 语法扩展有用户价值，但长期悬而未决会增加贡献者挫败感。

#### 4) `CLUSTER ... ORDER BY ...`
- [#19696](https://github.com/duckdb/duckdb/pull/19696)
- 设计体量较大，建议明确是否符合核心路线图。

#### 5) 一批“Ready For Review”但长期未决的优化类 PR
- [#20245](https://github.com/duckdb/duckdb/pull/20245)
- [#20288](https://github.com/duckdb/duckdb/pull/20288)
- [#20309](https://github.com/duckdb/duckdb/pull/20309)
- 这些 PR 已进入较成熟阶段，若能加速 review，有助于提升社区贡献转化率。

---

## 8. 结论

今天的 DuckDB 呈现出一个典型的高速演进型开源 OLAP 项目状态：**社区活跃、问题密集、功能探索广、平台边界不断扩张**。  
短期最值得关注的是三条主线：

1. **稳定性与正确性收敛**：如 UHUGEINT、OOM、INTERNAL error、Python 崩溃；
2. **数据湖性能回归治理**：尤其是 Hive partition pruning 与对象存储行为；
3. **Windows/Unicode/CLI 兼容性修复**：今日已出现直接对应的活跃 PR。

若维护团队能在下一轮版本中集中处理上述高优先级问题，DuckDB 在“通用嵌入式分析引擎 + 数据湖查询入口”这一路线上的用户信心会进一步增强。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时内，StarRocks 社区维持**高活跃度**：Issues 更新 7 条、PR 更新 149 条，说明开发节奏依然很快，尤其在 3.5/4.0/4.1 多分支并行维护上投入明显。  
从议题分布看，近期重点集中在 **Iceberg 生态兼容性、查询优化器能力增强、Lake/Shared-data 存储一致性修复** 以及 **云对象存储/安全集成稳定性**。  
今天没有新版本发布，但有多项 PR 指向即将进入版本的能力，包括 Parquet 类型兼容、CTE 物化控制、MV 重写稳定性以及统计信息传播增强。  
风险面上，今日新报 Bug 中出现了 **查询崩溃、错误结果、外部存储读取段错误、权限组件兼容失败** 等问题，说明外表/连接器与高级优化路径仍是当前稳定性重点。

---

## 2. 项目进展

> 由于提供的数据未列出全部 merged PR 明细，以下以“今日关闭/推进明显的关键 PR 与相关 Issue”总结当前进展。

### 2.1 Iceberg 与外部表兼容性持续增强

- **支持 Iceberg v3 默认值特性**  
  关联 Issue 已关闭，说明对应能力已落地。  
  - Issue: #69709 `[CLOSED] Supports the default values feature in Iceberg v3`  
  - 链接: `StarRocks/starrocks Issue #69709`

这表明 StarRocks 在追赶 Iceberg 新特性方面持续推进，尤其是 schema evolution / default value 相关兼容性，对使用 Iceberg 作为湖仓元数据层的用户是积极信号。

- **Parquet FIXED_LEN_BYTE_ARRAY / UUID 兼容支持推进中**  
  旧 PR 已关闭，新 PR 接续推进，目标更明确。  
  - 新 PR: #70479 `[OPEN] add support for FIXED_LEN_BYTE_ARRAY types`  
  - 旧 PR: #70226 `[CLOSED] add support for FIXED_LEN_BYTE_ARRAY types to be read as VARCHAR(36) lazily`  
  - 链接: `StarRocks/starrocks PR #70479` / `StarRocks/starrocks PR #70226`

这类改动直接提升 StarRocks 对 Iceberg/Parquet 数据湖表中 UUID 等类型的读取能力，属于典型的 **SQL 兼容性 + 存储格式兼容性补齐**。

### 2.2 查询优化器能力增强

- **新增 `array_map` 二元场景统计信息传播**  
  - PR: #70372 `[OPEN] Add stats propagation for binary array_map`  
  - 链接: `StarRocks/starrocks PR #70372`

该改动有助于优化器更准确估计复杂表达式结果分布，改善基数估计，从而提升执行计划质量。

- **支持多列函数依赖（multi-column functional dependency）**  
  - PR: #70453 `[OPEN] Support multi-column functional dependency`  
  - 链接: `StarRocks/starrocks PR #70453`

这是很明确的优化器路线升级信号。多列函数依赖可显著改进等值谓词组合场景下的基数估计，属于成本模型精细化的重要一步。

- **公共子表达式在优化阶段复用（WIP）**  
  - PR: #70362 `[OPEN] WIP: Reuse common sub-expressions during query optimization`  
  - 链接: `StarRocks/starrocks PR #70362`

该 PR 关注复杂 CASE WHEN / 深层表达式在优化阶段被重复内联导致计划膨胀的问题，若成熟落地，将改善超复杂 SQL 的优化稳定性与编译性能。

- **新增强制 CTE 物化开关**  
  - PR: #70481 `[OPEN] Add cbo_cte_force_materialize session variable to force CTE materialization`  
  - 链接: `StarRocks/starrocks PR #70481`

这本质上是为复杂查询提供一个“控制优化器行为”的逃生阀，体现项目在处理极端 SQL 场景时，开始提供更显式的可调优参数。

### 2.3 Lake / Shared-data 存储一致性与运维能力

- **修复 auto partition 与 schema change 状态冲突**  
  - PR: #70322 `[OPEN] Fix auto partition creation failure when schema change is in FINISHED_REWRITING`  
  - 链接: `StarRocks/starrocks PR #70322`

针对 Lake 表自动建分区流程与 schema change job 生命周期耦合问题，属于典型的 FE 元数据协调修复。

- **修复 lock-free MV rewrite 回退到 live metadata 的问题**  
  - PR: #70475 `[OPEN] Fix lock-free MV rewrite fallback to live metadata`  
  - 关闭的重复/前序 PR: #70472 `[CLOSED]`  
  - 链接: `StarRocks/starrocks PR #70475`

这说明物化视图重写链路在并发元数据变更下还有一致性边界问题，修复后会增强优化器在 lock-free 模式下的稳定性与隔离性。

- **修复 tablet split 后错误删除 shared files**  
  - PR: #70476 `[OPEN] Fix delete tablets misdeleting shared files from txn logs after tablet split`  
  - 链接: `StarRocks/starrocks PR #70476`

这是偏底层、但影响较大的 shared-data 存储正确性修复，涉及元数据与 txn log 处理顺序不一致导致共享文件误删，优先级较高。

- **云原生表缺失文件修复能力需求已关闭**  
  - Issue: #66015 `[CLOSED] Support repairing cloud-native tables with missing files`  
  - 链接: `StarRocks/starrocks Issue #66015`

虽然 Issue 本身是 enhancement，但被关闭说明该方向已有实现或已被其他交付覆盖，对 shared-data 模式运维是利好。

---

## 3. 社区热点

### 3.1 Iceberg 分区值含 NULL 导致分区 tableName 错乱
- Issue: #63029  
- 链接: `StarRocks/starrocks Issue #63029`

这是今日已知 Issues 中**评论最多**的活跃问题（14 条评论）。问题描述指向 Iceberg 分区值数组在包含 NULL 时发生 offset/shift 错位，进而影响分区名称/映射，且实际场景发生在 **基于 Iceberg 表构建物化视图** 时。  
**背后技术诉求**：用户希望 StarRocks 对 Iceberg 隐式/复合分区值的解析在 NULL 场景下保持严格语义一致，这类问题不仅是兼容性问题，也会影响刷新正确性与数据定位。

### 3.2 JoinHashTable 合并阶段遗漏表达式键列，可能导致崩溃或错误结果
- Issue: #70349  
- 链接: `StarRocks/starrocks Issue #70349`

虽然评论不多，但从严重性看是今日最值得关注的问题之一：在 **adaptive partition hash join** 中，若 join key 包含表达式（如 `COALESCE()`），`merge_ht()` 未正确合并表达式键列，可能造成 **崩溃或错误结果**。  
**背后技术诉求**：用户正在使用越来越复杂的 SQL 表达式联接，要求优化器与执行器在高级 join 路径上保持 correctness-first。

### 3.3 复杂 SQL 优化膨胀与 CTE 物化控制
- PR: #70362 / #70481  
- 链接: `StarRocks/starrocks PR #70362` / `StarRocks/starrocks PR #70481`

这组 PR 反映出社区正在集中处理“**表达式过于复杂**”导致的优化阶段问题。  
**背后技术诉求**：大型分析 SQL 往往包含大量嵌套 CASE WHEN、重复表达式与多层 CTE，用户希望在不重写 SQL 的前提下，系统能通过表达式复用、强制物化等手段稳定生成计划。

### 3.4 Ranger 开启时 Arrow Flight 失败
- Issue: #70477  
- 链接: `StarRocks/starrocks Issue #70477`

这是一个典型的“新接口 + 企业安全治理”碰撞问题。  
**背后技术诉求**：企业用户期待 Arrow Flight 这类高性能数据通道在启用 Ranger 后仍可正常工作，说明 StarRocks 正逐步进入更复杂的安全集成场景。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P0 / 高严重：可能导致错误结果或进程崩溃

1. **表达式 Join Key 在 adaptive partition hash join 下可能崩溃/返回错误结果**  
   - Issue: #70349 `[OPEN]`  
   - 链接: `StarRocks/starrocks Issue #70349`  
   - 现状：**未见明确 fix PR**  
   - 影响：查询正确性与稳定性双重风险，建议优先处理。

2. **查询 Azure Data Lake 上 Parquet 文件时发生 Segmentation Fault**  
   - Issue: #70478 `[OPEN]`  
   - 链接: `StarRocks/starrocks Issue #70478`  
   - 现状：**未见明确 fix PR**  
   - 影响：外部文件查询直接触发 BE 崩溃风险，属于严重连接器/文件格式稳定性问题。

### P1 / 较高严重：导致功能不可用或查询失败

3. **Ranger 启用时 Arrow Flight 失败**  
   - Issue: #70477 `[OPEN]`  
   - 链接: `StarRocks/starrocks Issue #70477`  
   - 现状：**未见 fix PR**  
   - 影响：企业安全环境下的高速数据访问链路不可用。

4. **无可查询副本：`minReadableVersion` 与 `visibleVersion` 不一致**  
   - Issue: #63026 `[OPEN]`  
   - 链接: `StarRocks/starrocks Issue #63026`  
   - 现状：**未见 fix PR**  
   - 影响：即使副本状态 NORMAL 也可能无法查询，说明副本可读性判定与版本控制存在边界缺陷。

5. **Iceberg NULL 分区值导致分区值错位/表名错误**  
   - Issue: #63029 `[OPEN]`  
   - 链接: `StarRocks/starrocks Issue #63029`  
   - 现状：**未见 fix PR**  
   - 影响：影响 Iceberg 分区解析、MV ingest 与数据定位正确性。

### P2 / 中等严重：特定路径下元数据或维护操作异常

6. **REST Catalog 的 OAuth2 token refresh scheduler 未启动**  
   - PR: #70392 `[OPEN]`  
   - 链接: `StarRocks/starrocks PR #70392`  
   - 影响：Iceberg REST Catalog 长时间空闲后鉴权失效，查询约一小时后报 `NotAuthorizedException`。  
   - 状态：**已有 fix PR，值得重点关注合并进度**。

7. **tablet split 后 delete tablets 误删 shared files**  
   - PR: #70476 `[OPEN]`  
   - 链接: `StarRocks/starrocks PR #70476`  
   - 影响：shared-data 模式下潜在数据文件误删。  
   - 状态：**已有 fix PR**。

8. **lock-free MV rewrite 可能错误回退到 live metadata**  
   - PR: #70475 `[OPEN]`  
   - 链接: `StarRocks/starrocks PR #70475`  
   - 影响：并发元数据变更场景下可能导致计划依赖实时对象，破坏隔离。  
   - 状态：**已有 fix PR**。

9. **自动建分区在 schema change = FINISHED_REWRITING 状态下失败**  
   - PR: #70322 `[OPEN]`  
   - 链接: `StarRocks/starrocks PR #70322`  
   - 影响：Lake 表自动分区流程被 alter job 状态机阻断。  
   - 状态：**已有 fix PR**。

10. **Iceberg MV refresh 对非单调 snapshot 时间戳容错不足**  
    - PR: #70382 `[OPEN]`  
    - 链接: `StarRocks/starrocks PR #70382`  
    - 影响：MV 增量刷新判定可能受时间单位不一致和 snapshot 时间不单调影响。  
    - 状态：**已有 fix PR**。

---

## 5. 功能请求与路线图信号

### 5.1 更强的外部格式兼容性正在进入主线

- **Parquet FIXED_LEN_BYTE_ARRAY / UUID 支持**
  - PR: #70479  
  - 链接: `StarRocks/starrocks PR #70479`

这类兼容需求通常来自真实湖仓场景，尤其是 Iceberg + Parquet + UUID schema。由于已有旧 PR 关闭并由新 PR 接续，说明维护者认可方向，**较可能纳入后续 3.5/4.0/4.1 修复版本**。

### 5.2 优化器将提供更多“可控性”与“复杂查询保护机制”

- **强制 CTE 物化变量**
  - PR: #70481  
  - 链接: `StarRocks/starrocks PR #70481`

这不是单纯新增参数，而是路线信号：StarRocks 在继续追求激进优化的同时，也愿意给用户提供绕过复杂优化失稳的可控开关。对 BI SQL、大型生成式 SQL 非常重要。

- **公共子表达式优化阶段复用**
  - PR: #70362  
  - 链接: `StarRocks/starrocks PR #70362`

若落地，将是复杂查询优化能力的中长期增强点，可能先以实验性或逐步放量方式进入后续版本。

### 5.3 存储引擎并行压缩/整理方向继续演进

- **Range-split parallel compaction**
  - PR: #70162 `[PROTO-REVIEW]`  
  - 链接: `StarRocks/starrocks PR #70162`

该 PR 通过按 sort key range 拆分 compaction 子任务，输出 non-overlapping segments，明显是面向 Lake 表 compaction 效率和结果有序性的架构级增强。  
由于仍处于 `PROTO-REVIEW`，**更像中期路线信号而非短期版本功能**。

### 5.4 Python 客户端复杂类型易用性提升

- **Python client 递归数据类型转换**
  - PR: #70480  
  - 链接: `StarRocks/starrocks PR #70480`

这说明社区不仅关注内核，还在改善客户端生态。复杂类型（array/map/struct）自动转 Python 原生对象，会提升 SQLAlchemy 用户体验，适合数据应用侧开发者。

---

## 6. 用户反馈摘要

基于今日 Issues/PR 描述，可提炼出以下真实用户痛点：

1. **湖仓互操作性仍是第一线需求**  
   用户大量在 StarRocks 与 Iceberg/Parquet/REST Catalog/Azure Data Lake 间联动，反馈集中在分区解析、UUID 类型、OAuth 刷新、文件读取崩溃等问题。  
   这说明 StarRocks 已深入真实数据湖生产环境，但兼容性边角仍需持续打磨。  
   相关链接：`StarRocks/starrocks Issue #63029`、`#70478`、`PR #70392`、`PR #70479`

2. **复杂 SQL 已经逼近优化器边界**  
   从 CSE 复用与强制 CTE 物化两类 PR 看，用户并非只关心“能跑”，还关心超复杂查询能否稳定生成合理计划。  
   相关链接：`StarRocks/starrocks PR #70362`、`PR #70481`

3. **企业级安全与高性能访问通路必须兼容**  
   Ranger 与 Arrow Flight 的冲突说明，企业用户期待在启用权限治理后仍保留高吞吐访问能力。  
   相关链接：`StarRocks/starrocks Issue #70477`

4. **Shared-data/Lake 模式下，用户对元数据一致性和可恢复性非常敏感**  
   例如 tablet split 后 shared files 误删、云原生表文件丢失修复等，都说明用户已经将 StarRocks 用于更“云原生”的生产工作负载。  
   相关链接：`StarRocks/starrocks PR #70476`、`Issue #66015`

---

## 7. 待处理积压

以下条目值得维护者持续关注：

### 7.1 长期活跃但仍未解决的兼容性问题
- **#63029 Iceberg NULL 分区值错位问题**  
  创建于 2025-09-11，今日仍活跃，评论已达 14。  
  链接: `StarRocks/starrocks Issue #63029`

这是一个跨版本、跨使用场景的问题，且影响 MV ingest，建议尽快补充最小复现与 fix PR。

### 7.2 副本可读性判定问题可能影响生产查询稳定性
- **#63026 无可查询副本，版本号不一致**  
  创建于 2025-09-11，问题描述直指查询失败。  
  链接: `StarRocks/starrocks Issue #63026`

虽然评论不多，但问题性质偏底层，建议维护者确认是否已有内部根因分析或关联修复。

### 7.3 仍处于原型评审的大型架构改动
- **#70162 Range-split parallel compaction**  
  链接: `StarRocks/starrocks PR #70162`

该 PR 技术价值高，但处于 `PROTO-REVIEW`，如果长期停留，可能拖慢 Lake 存储整理能力演进，建议维护者明确设计结论或拆分子任务推进。

### 7.4 WIP / 标注不完整的 PR 需要尽快整理
- **#70362 WIP: Reuse common sub-expressions during query optimization**  
- **#70473 [title needs [type]] [WIP] Slice 1**  
  链接: `StarRocks/starrocks PR #70362` / `PR #70473`

这类 PR 若长期未收敛，会提高 review 噪音；尤其 #70473 标签未规范，建议补全类型与目标说明。

---

## 8. 健康度结论

整体来看，StarRocks 今日呈现出**高研发吞吐、强多分支维护能力、围绕湖仓互操作和优化器演进持续加速**的状态，项目健康度总体良好。  
但从缺陷分布看，当前主要风险集中在：
- **Iceberg/Parquet/REST Catalog/Azure 等外部生态接入**
- **复杂 SQL 优化路径**
- **Shared-data/Lake 模式下的一致性与可恢复性**

如果未来几天相关 fix PR（如 #70392、#70475、#70476、#70322）顺利合并，项目稳定性会有一轮明显改善；反之，今天新报的高严重缺陷（#70349、#70478）值得作为维护优先级最高的事项跟进。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：Issues 更新 13 条、PR 更新 42 条，开发重心仍集中在 **Spark/REST Catalog/Core 层能力增强** 与 **测试覆盖补强**。  
今日没有新版本发布，但从 PR 动向看，项目正在持续推进 **REST catalog 行为一致性、元数据读取正确性、Avro/Parquet 写入配置暴露** 等中长期改进。  
Issues 侧既有若干 bug 被关闭，也出现了涉及 **查询正确性、分区演进、统计信息配置失效** 的新问题，说明项目仍在处理多引擎兼容与复杂场景回归。  
整体来看，项目健康度良好：**活跃开发明显高于发布节奏**，当前阶段更像是为后续版本积累修复和特性。

---

## 2. 项目进展

> 注：给定数据中未明确列出“今日已合并”的 PR 明细，以下聚焦 **今日关闭或显著推进** 的重要 PR / 变更方向。

### 2.1 REST Catalog 与 Spark 删除语义继续完善
- **PR #15614** `Spark: add rest.catalog-purge property to delegate DROP TABLE PURGE to REST catalogs`  
  链接: apache/iceberg PR #15614

该 PR 继续推进 Spark 在执行 `DROP TABLE ... PURGE` 时对 REST Catalog 的正确委托。其核心价值在于避免 Spark 继续采用“客户端枚举并删除文件、再发送普通 DROP”的旧路径，而是把 purge 语义交给 catalog 端统一处理。  
这会直接改善：
- REST catalog 下的删除语义一致性
- 对服务端托管凭证/权限模型的适配
- 降低客户端直接操作对象存储带来的风险

这属于 **SQL 行为一致性 + catalog 架构边界清晰化** 的重要演进。

---

### 2.2 Snapshot 变更读取路径继续收敛，减少旧接口残留
- **PR #15656** `Migrate callers off deprecated Snapshot file-access methods to Snapshot Changes`  
  链接: apache/iceberg PR #15656

该 PR 覆盖 `core / data / flink / kafka connect / spark` 多模块，目标是把调用方从已弃用的 Snapshot 文件访问方法迁移到新的 Snapshot Changes 机制。  
这类改动意义很大：
- 降低 manifest/spec 读取路径不一致的风险
- 有助于修复分区 spec 传递不完整导致的隐性正确性问题
- 为后续删除旧 API、统一快照变更语义铺路

这是典型的 **底层元数据访问模型收敛**，短期看是“技术债治理”，长期看能提升多引擎一致性。

---

### 2.3 Data TCK 覆盖增强，补齐读取契约测试
- **PR #15675** `Data: Add TCK tests for Metadata Columns in BaseFormatModelTests`  
  链接: apache/iceberg PR #15675
- **PR #15633** `Data: Add TCK tests for ReadBuilder in BaseFormatModelTests`  
  链接: apache/iceberg PR #15633

这两个 PR 表明社区正在加强 **格式无关的数据层契约测试**。重点覆盖：
- 元数据列读取：`FILE_PATH`、`SPEC_ID`、`ROW_POSITION`、`IS_DELETED`、lineage 等
- `ReadBuilder` API 在 Avro / Parquet / ORC 上的统一行为
- 分区变换与分区演进场景

这类测试工作虽然不直接体现为新特性，但对 Iceberg 至关重要，因为其核心价值之一就是 **统一表格式语义跨引擎落地**。  
今天这类 PR 的推进，是项目在“正确性基础设施”上的积极信号。

---

### 2.4 写入配置能力继续开放：Manifest Avro 压缩可配置
- **PR #15652** `Core: Propagate Avro compression settings to manifest writers`  
  链接: apache/iceberg PR #15652

该 PR 让 manifest writer 也能继承/使用 Avro 压缩设置，而不是固定依赖默认值。  
潜在收益包括：
- 元数据文件压缩率优化
- 在大规模表与高提交频率场景下降低元数据存储成本
- 为用户提供更一致的“数据文件 / 元数据文件”压缩配置体验

这属于 **存储优化与可运维性增强**。

---

### 2.5 开发基础设施优化：Scala import 自动清理
- **PR #15676** `Build: Integrate Scalafix to auto-fix unused Scala imports`  
  链接: apache/iceberg PR #15676

这是典型的工程效率改进。虽然不直接影响运行时，但会提升：
- 代码整洁度
- review 质量
- Scala 模块维护成本

对长期维护多 Spark 版本分支尤其有帮助。

---

## 3. 社区热点

### 热点 1：字符串分区值带空白导致 Spark 返回空结果
- **Issue #15427** `[bug] Whitespace in string partition values causes Spark to return empty DataFrames and inconsistent results across engines`  
  链接: apache/iceberg Issue #15427  
  状态: 已关闭  
  评论: 10

这是今日最值得关注的已关闭 bug 之一。问题本质是：**字符串分区值含前后空格时，Spark 过滤行为与其他引擎不一致，甚至返回空 DataFrame**。  
背后技术诉求非常明确：
- 用户期待 Iceberg 在分区裁剪与表达式下推上保持跨引擎一致性
- 分区值规范化、序列化/反序列化、谓词匹配需要更稳健
- 数据湖场景中“脏值”不可避免，系统需要具备韧性

该问题虽然关闭，但反映出 **分区语义在边界值上的兼容性仍是高敏感区域**。

---

### 热点 2：REST mutation 端点需要幂等键
- **Issue #13867** `Add Idempotency-Key to iceberg REST mutation endpoints`  
  链接: apache/iceberg Issue #13867  
  状态: 已关闭（stale）  
  评论: 8

虽然本次是以 stale 关闭，但议题本身非常重要。REST catalog 一旦广泛进入生产，网络超时、客户端重试、服务端 5xx 等都会引发：
- 重复建表
- 重复提交
- 非预期副作用

这说明社区用户已不再只关注 API 可用，而是开始要求 **生产级 API 语义保障**，包括幂等性、重试安全、事务边界。这对未来 REST catalog 路线有明显指向意义。

---

### 热点 3：多列禁用 Parquet 统计信息失效
- **Issue #15347** `[bug] Disabling statistics across multiple columns`  
  链接: apache/iceberg Issue #15347  
  状态: Open  
  评论: 4

该问题指出 `write.parquet.stats-enabled.column.<COLUMN_NAME>` 在多列场景下疑似只对单列生效。  
这不是表面配置 bug，而是会影响：
- 文件统计信息大小
- 谓词裁剪质量
- 隐私/合规场景下对统计信息暴露的控制

这是一个兼具 **正确性与运维影响** 的问题，值得后续重点跟进。

---

### 热点 4：分区演进后 SPJ 在 MERGE INTO 失效
- **Issue #15610** `[bug] SPJ Broken After Partition Evolution (Iceberg 1.10.0)`  
  链接: apache/iceberg Issue #15610  
  状态: Open  
  评论: 4

这是 Spark 相关的高价值问题。用户报告在表经历 partition evolution 后，即使数据仍满足分区约束，`MERGE INTO` 场景下的 **Storage-Partitioned Join (SPJ)** 失效。  
背后的诉求是：
- Iceberg 必须在 schema/partition evolution 之后仍保持优化器可推理性
- Spark 集成不应只在“静态分区设计”下正确工作
- 生产用户需要 evolution 不破坏性能路径

这是典型的 **高级优化特性在演进场景中的回归风险**。

---

## 4. Bug 与稳定性

以下按影响程度排序：

### P1：分区演进后 Spark `MERGE INTO` 的 SPJ 失效
- **Issue #15610**  
  链接: apache/iceberg Issue #15610  
  状态: Open  
  是否已有明确 fix PR：**未见直接对应 PR**

影响：
- 直接影响 Spark `MERGE INTO` 性能优化路径
- 在实际 CDC / upsert 工作负载中可能导致显著性能回退
- 若优化器错误假设被打破，还需警惕潜在正确性问题

建议：优先确认是否与 partition spec tracking、scan planning 或 Spark physical planning 集成有关。

---

### P1：字符串分区值空白导致跨引擎结果不一致
- **Issue #15427**  
  链接: apache/iceberg Issue #15427  
  状态: Closed

影响：
- 查询结果正确性
- 跨引擎一致性
- 用户对 Iceberg 分区语义的信任

虽然已关闭，但建议维护者在后续 release notes 中明确说明修复范围，特别是是否仅限 Spark 路径。

---

### P2：多列禁用 Parquet 统计信息配置异常
- **Issue #15347**  
  链接: apache/iceberg Issue #15347  
  状态: Open  
  是否已有 fix PR：**未见直接对应 PR**

影响：
- 配置项行为与文档预期不符
- 可能导致文件膨胀或统计信息错误保留
- 对敏感列统计暴露控制存在潜在风险

---

### P2：`PropertyUtil.propertiesWithPrefix` 将 prefix 当作 regex
- **Issue #15631**  
  链接: apache/iceberg Issue #15631  
  状态: Closed

这是一个典型工具类 bug：`replaceFirst(prefix, "")` 把 prefix 解释成 Java regex。  
影响面可能波及：
- 含特殊字符的配置前缀
- 属性提取逻辑
- 间接导致配置读取异常

从性质看属于 **基础工具正确性修复**，虽然表面小，但应避免在配置系统中残留类似问题。

---

### P3：SparkSchemaUtil.estimateSize 估算表大小不准确
- **Issue #15664**  
  链接: apache/iceberg Issue #15664  
  状态: Open  
  是否已有 fix PR：未见

这更偏估算模型问题，而非功能故障。  
影响主要在：
- 成本估算
- 优化器判断
- 用户对统计结果的可解释性

---

### P3：Bucketed 表迁移到 Iceberg 时 Spark 报错
- **Issue #13869**  
  链接: apache/iceberg Issue #13869  
  状态: Closed

问题与 Spark 将 bucket 列作为 partition transform 处理有关，说明 **V1/V2 表迁移语义映射** 仍是复杂区域。  
虽然已关闭，但这是迁移类场景中的经典痛点，建议继续积累案例。

---

## 5. 功能请求与路线图信号

### 5.1 Parquet 写入参数继续细化暴露
- **Issue #15677** `Add write.parquet.page-version table property`  
  链接: apache/iceberg Issue #15677

用户希望控制 Parquet DataPage 版本（V1/V2）。这是很典型的底层格式调优需求，说明 Iceberg 用户群体中已有大量 **重视编码细节、兼容性和性能调优** 的高级使用者。  
结合：
- **PR #15652** Manifest Avro 压缩配置暴露  
  链接: apache/iceberg PR #15652

可以判断项目正在沿着“**开放更多写入层可调参数**”推进，因此该需求**较有机会进入后续版本**。

---

### 5.2 Arrow ↔ Iceberg 类型映射文档需求
- **Issue #15666** `feature request: arrow to iceberg type mapping`  
  链接: apache/iceberg Issue #15666

这是一个文档/生态集成信号。随着 pyiceberg、Arrow、跨语言客户端发展，用户越来越需要明确：
- Arrow 类型与 Iceberg schema 的映射规则
- 精度/可空性/嵌套类型边界
- 不同语言实现是否一致

这类需求一般实现成本低、收益高，**很可能被纳入近期文档更新**。

---

### 5.3 Kafka Connect 与 S3 Tables 支持诉求
- **Issue #15425** `Kafka connect S3tables support`  
  链接: apache/iceberg Issue #15425
- **PR #15212** `Add Kafka Connect artifact publish to release process`  
  链接: apache/iceberg PR #15212
- **PR #11623** `Kafka Connect: Add mechanisms for routing records by topic name`  
  链接: apache/iceberg PR #11623

用户关心 Kafka Connect Sink 是否支持 S3 Tables、本质上是在问：
- REST catalog + 云厂商托管 catalog 的认证/凭证派发是否顺畅
- Connector 是否真正达到“开箱即用”

结合相关 PR 可见，Kafka Connect 仍处于 **能力补齐 + 分发完善** 阶段，说明这条产品线在后续版本中仍会持续加强，但离完全成熟可能还有一段距离。

---

### 5.4 唯一表路径、REST Function、加密等能力仍在慢热推进
- **PR #12892** `Catalogs: Add support for unique table locations via catalog property`  
  链接: apache/iceberg PR #12892
- **PR #15180** `REST spec: add list/load function endpoints to OpenAPI spec`  
  链接: apache/iceberg PR #15180
- **PR #13225** `Encryption for REST catalog`  
  链接: apache/iceberg PR #13225

这些 PR 跨度较长，但共同反映出路线图信号：
- REST catalog 正从“基础 CRUD”走向“企业级能力”
- catalog 成为治理、加密、函数、命名空间能力的统一入口
- Iceberg 正在向更完整的数据平台控制面演进

---

## 6. 用户反馈摘要

结合 Issues 摘要，可以提炼出以下真实用户痛点：

### 6.1 用户非常在意“跨引擎一致性”
代表案例：
- **Issue #15427** 分区值空白导致 Spark 异常  
  链接: apache/iceberg Issue #15427
- **Issue #13869** Spark 迁移 bucketed table 失败  
  链接: apache/iceberg Issue #13869

说明用户不只是把 Iceberg 当文件格式，而是把它当作 **跨 Spark / Flink / REST / 其他引擎的一致抽象层**。任何语义漂移都会迅速暴露。

---

### 6.2 用户已进入复杂生产场景：分区演进、MERGE、CDC、重试安全
代表案例：
- **Issue #15610** SPJ 在 partition evolution 后失效  
  链接: apache/iceberg Issue #15610
- **Issue #13867** REST mutation 需要幂等键  
  链接: apache/iceberg Issue #13867
- **PR #15337** Equality delete 去重优化  
  链接: apache/iceberg PR #15337

这表明社区关注点已从“能不能用”转向“**复杂变更场景下是否稳、是否快、是否可恢复**”。

---

### 6.3 用户对配置项“可预期生效”要求提高
代表案例：
- **Issue #15347** 多列 stats disable 不生效  
  链接: apache/iceberg Issue #15347
- **Issue #15664** 表大小估算偏差较大  
  链接: apache/iceberg Issue #15664
- **Issue #15677** 需要 page-version 配置  
  链接: apache/iceberg Issue #15677

说明生产用户不仅关心 API 存在，还关心：
- 配置是否严格按文档工作
- 参数是否足够细粒度
- 估算/统计结果是否能支持实际运维决策

---

## 7. 待处理积压

以下是值得维护者关注的长期或停滞议题：

### 7.1 Spark 3.4 移除计划需要更明确节奏
- **Issue #14121** `Remove Spark 3.4 in Iceberg 1.12 release`  
  链接: apache/iceberg Issue #14121

这是 release notes / 兼容性治理问题。随着多 Spark 版本并存，维护成本持续升高。建议：
- 明确 1.11 / 1.12 的支持矩阵
- 提前发布迁移建议
- 避免用户在升级窗口中踩中二进制兼容问题

---

### 7.2 唯一表路径特性长期未落地
- **PR #12892**  
  链接: apache/iceberg PR #12892

该能力对支持 rename 的 catalog 很有价值，可避免表位置冲突与路径复用问题。PR 持续时间较长，建议维护者明确：
- 设计是否已定稿
- 不同 catalog 的行为差异
- 是否可拆分为更小变更先合入

---

### 7.3 REST catalog 加密支持推进偏慢
- **PR #13225**  
  链接: apache/iceberg PR #13225

这是企业场景下非常关键的能力。若 REST catalog 继续成为统一入口，加密不应长期停留在实验/未合并状态。

---

### 7.4 Kafka Connect 生态建设仍需加速
- **PR #11623**  
  链接: apache/iceberg PR #11623
- **PR #15212**  
  链接: apache/iceberg PR #15212
- **Issue #15425**  
  链接: apache/iceberg Issue #15425

从路由、制品发布到 S3 Tables 兼容性，Kafka Connect 仍然有明显积压。对用户而言，连接器是否易获取、易部署、易认证，直接影响采用率。

---

## 8. 总结判断

今天的 Iceberg 项目状态可以概括为：**开发活跃、发布平稳、基础能力持续增强，但复杂场景正确性与生态易用性仍是主要挑战**。  
最值得关注的主线包括：
1. **REST catalog 语义增强**：purge、OpenAPI、加密、幂等性等逐步补齐  
2. **Spark 集成深水区问题**：partition evolution、SPJ、迁移与分区语义一致性  
3. **Data/Core 正确性基础设施建设**：TCK 测试、Snapshot 变更接口收敛、工具类修复  
4. **高级用户调优诉求增加**：压缩、统计信息、Parquet page 版本、估算精度

整体健康度评价：**积极**。如果接下来能尽快把 Spark 演进场景 bug 与 REST catalog 企业级特性进一步收敛，Iceberg 的下一阶段稳定性和平台化能力会明显提升。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时内，Delta Lake 没有新增或活跃 Issue，说明当天外部问题反馈面较平稳；但 PR 侧非常活跃，共有 21 条更新，其中 17 条仍在推进、4 条已合并或关闭，研发活动明显集中在功能演进与正确性修复上。  
从变更主题看，当前开发重心主要落在 **Spark/DSv2 集成、Kernel 能力增强、UniForm/Iceberg 互操作、流式正确性保护** 四条主线上。  
值得注意的是，虽然没有新版本发布，但多个 PR 指向 **4.2.0-SNAPSHOT**、CREATE TABLE/DSv2 写入链路、GeoSpatial 特性与 streaming 数据一致性，这通常意味着项目正处于下一阶段版本能力收敛前的高频开发期。  
整体健康度判断：**中高活跃、问题面稳定、核心功能持续推进中**。

---

## 3. 项目进展

### 已关闭/合并的重要 PR

#### 1) 修复 CDC 对相关子查询表达式的非常量参数识别
- PR: [#6310](https://github.com/delta-io/delta/pull/6310)  
- 标题: `[Spark] Fix CDC non-constant argument detection for correlated subquery expressions`

该 PR 聚焦 **Spark CDC（Change Data Capture）表达式分析正确性**。问题本质是：在包含相关子查询的场景下，CDC 对“非常量参数”的检测可能误判，进而影响查询计划判断或结果正确性。  
这类修复通常对复杂 SQL、审计回放、增量消费链路较关键，属于 **SQL 兼容性与查询正确性修复**，虽然影响面未必广，但技术价值较高。

---

#### 2) 默认启用 MERGE / INSERT 的 null expansion 修复
- PR: [#6311](https://github.com/delta-io/delta/pull/6311)  
- 标题: `[Spark] Enable MERGE and INSERT null expansion fix by default`

该 PR 表明此前已经存在一个针对 **MERGE/INSERT 空值扩展行为** 的修复开关，现在改为默认启用。  
这释放出一个较强信号：相关修复已经具备足够稳定性，维护者愿意将其作为默认行为推进。对用户而言，这会提升 DML 语义一致性，尤其涉及 schema 对齐、列缺失补全、nullable 字段写入等场景。  
属于 **DML 正确性与默认行为优化**。

---

#### 3) UC managed table checkpoint stats 属性处理方案关闭
- PR: [#6229](https://github.com/delta-io/delta/pull/6229)  
- 标题: `[Spark] Set delta.checkpoint.writeStatsAs* properties for UC managed tables`

该 PR 已关闭，说明针对 **UC（Unity Catalog）托管表 checkpoint stats 输出格式** 的方案未按当前形态继续推进。  
从摘要看，目标是设置：
- `delta.checkpoint.writeStatsAsJson=false`
- `delta.checkpoint.writeStatsAsStruct=true`

这关系到 **checkpoint 元数据编码方式、统计信息可读性、兼容性及后续消费链路**。PR 关闭并不代表需求消失，更可能意味着设计需要调整或合并到其他实现中。

---

#### 4) Delta 侧 staged UC existing-table handoff 重构关闭
- PR: [#6244](https://github.com/delta-io/delta/pull/6244)  
- 标题: `[Delta-Spark] Prefer staged UC existing-table handoff in Delta`

该 PR 针对 **Delta 与 UC staged handoff 机制** 的集成重构，涉及 existing-table 上下文优先级、fallback lookup 与 managed staged UC 校验。  
PR 已关闭，说明这一方向的落地方式可能发生变化，或者被拆分吸收到其他 PR/分支。  
这类工作对 **目录服务集成、元数据交接、外部 catalog 协同** 很关键，属于平台级整合能力建设。

---

## 4. 社区热点

> 注：给定数据里评论数均为 `undefined`，无法严格按评论排序。以下按近 24 小时更新频率、主题重要性和潜在影响选取热点。

### 热点一：流式读取中静默数据丢失防护
- PR: [#6314](https://github.com/delta-io/delta/pull/6314)  
- 标题: `[Spark] Add sanity check in getBatch to verify trailing commits from latestOffset are present`

这是今天最值得关注的 PR 之一。其摘要明确指出修复 **Delta streaming source 的 silent data loss bug**：当 `latestOffset` 与 `getBatch` 之间某个 commit 文件消失时，流任务可能跳过该提交而不显式失败。  
背后的技术诉求非常明确：  
1. **宁可失败也不能静默丢数**；  
2. 流式 source 在日志/提交文件可见性变化下要具备一致性保护；  
3. offset 与 batch materialization 之间需要额外校验。  
这类 PR 对生产环境影响极大，尤其是对象存储、并发维护、异常清理或日志可见性边界场景。  
- 链接: https://github.com/delta-io/delta/pull/6314

---

### 热点二：DSv2 + Kernel 的 CREATE TABLE 路径持续成形
- PR: [#6313](https://github.com/delta-io/delta/pull/6313)  
- 标题: `[Spark][DSv2] Support metadata-only create table via Kernel`
- 关联 PR: [#6083](https://github.com/delta-io/delta/pull/6083)  
- 关联 PR: [#6309](https://github.com/delta-io/delta/pull/6309)

这一组 PR 清晰体现出 Delta 正在推动 **DSv2 connector 与 Kernel 的更深整合**。  
#6313 新增 metadata-only `CREATE TABLE` 路径，通过 Kernel 提交 version 0 并保留 catalog 注册语义；#6083 则提供 CREATE TABLE 的 snapshot abstraction；#6309 则在 DSv2 中识别 `CommitInfo` action。  
背后技术诉求是：  
- 将表创建、元数据提交、catalog 注册路径逐步统一；  
- 降低 Spark 内部实现与 Delta 核心逻辑耦合；  
- 为后续多引擎共享事务/元数据语义铺路。  
这是明显的 **架构演进信号**。  
- 链接:  
  - https://github.com/delta-io/delta/pull/6313  
  - https://github.com/delta-io/delta/pull/6083  
  - https://github.com/delta-io/delta/pull/6309

---

### 热点三：GeoSpatial 能力持续扩展到 Kernel
- PR: [#6235](https://github.com/delta-io/delta/pull/6235)  
- 标题: `[KERNEL] Add GeoSpatial Table feature`
- PR: [#6301](https://github.com/delta-io/delta/pull/6301)  
- 标题: `[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings`

GeoSpatial 相关 PR 连续推进，说明 Delta 正尝试把 **空间数据表能力** 正式纳入 Kernel 能力面。  
#6235 是功能主 PR，#6301 则补充统计信息解析，支持把 geometry/geography 作为 WKT 字符串处理。  
这反映出的技术诉求包括：  
- 面向地理空间场景的 schema / stats 支持；  
- 为 query pruning、元数据统计、跨引擎兼容打基础；  
- 增强 Delta 在 GIS/位置数据/地图分析场景中的适用性。  
- 链接:  
  - https://github.com/delta-io/delta/pull/6235  
  - https://github.com/delta-io/delta/pull/6301

---

### 热点四：UniForm / Iceberg 转换保留更多 snapshot 语义
- PR: [#6316](https://github.com/delta-io/delta/pull/6316)  
- 标题: `Preserve Kafka snapshot summary fields during REPLACE_TABLE replay`

该 PR 聚焦在 Delta -> Iceberg action 转换时，保留 snapshot-level summary 字段，如 Kafka offsets。  
背后技术诉求是：  
- **回放/转换过程中不能丢失上层数据源语义**；  
- Kafka 等流来源的偏移量信息要在表格式转换中被继承；  
- UniForm/互操作功能不应只保留数据文件语义，也要保留 lineage 与消费位点元信息。  
这说明 Delta 的格式互操作已经从“能转换”走向“语义尽量完整保留”。  
- 链接: https://github.com/delta-io/delta/pull/6316

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：流式读取存在静默数据丢失风险，已有修复 PR
- PR: [#6314](https://github.com/delta-io/delta/pull/6314)  
- 状态: OPEN  
- 严重性: **高**

问题描述非常明确：如果某个 commit 文件在 `latestOffset` 与 `getBatch` 之间消失，Delta streaming source 可能跳过该 commit，形成 **silent data loss**。  
这是典型的高优先级稳定性问题，因为它影响的是：
- 流式增量消费完整性
- exactly-once / at-least-once 语义边界
- 故障诊断可观测性

当前已有 fix PR，建议维护者优先审阅合并。

---

### P2：CDC 在 correlated subquery 下的表达式判定可能错误，修复已关闭落地
- PR: [#6310](https://github.com/delta-io/delta/pull/6310)  
- 状态: CLOSED  
- 严重性: **中高**

该问题属于 **查询正确性缺陷**，影响包含相关子查询的 CDC 表达式分析。  
虽然通常不表现为崩溃，但可能导致错误判断或不符合预期的行为，已被修复关闭。

---

### P2：MERGE / INSERT 的 null expansion 行为修复已默认启用
- PR: [#6311](https://github.com/delta-io/delta/pull/6311)  
- 状态: CLOSED  
- 严重性: **中**

这类问题通常影响 DML 写入一致性和 schema 演化场景的正确性。默认启用意味着维护者认为风险已可控，但用户仍应关注升级后边界行为变化，尤其是历史上依赖旧行为的作业。

---

### P3：show/describe table properties 可能暴露不应暴露的 fs 配置
- PR: [#6300](https://github.com/delta-io/delta/pull/6300)  
- 状态: OPEN  
- 严重性: **中**

该 PR 提议阻止 `options.fs.*` 出现在 `show/describe table properties` 中。  
这不一定是“崩溃类 bug”，但涉及：
- 配置泄露风险
- 元数据展示污染
- 用户可见属性边界不清晰

属于 **安全性/可见性/产品行为一致性** 修复。

---

## 6. 功能请求与路线图信号

虽然当天没有新增 Issue，但从活跃 PR 可明显看出下一版本的潜在方向。

### 1) 4.2.0 开发分支已启动
- PR: [#6256](https://github.com/delta-io/delta/pull/6256)  
- 标题: `Change master version to 4.2.0-SNAPSHOT`

这是最直接的路线图信号。说明主干已面向 **4.2.0** 开发周期。  
- 链接: https://github.com/delta-io/delta/pull/6256

---

### 2) Kernel 类型系统与表达式兼容性继续增强
- PR: [#6257](https://github.com/delta-io/delta/pull/6257)  
- 标题: `[Kernel] Support implicit cast between DECIMAL types with different precisions`

该 PR 提升 Kernel 中 `DECIMAL` 不同精度间的隐式转换支持。  
这通常会直接影响：
- 表达式求值兼容性
- 跨引擎 SQL 行为对齐
- 精度/类型提升逻辑的一致性

这类工作很可能被纳入下一版本，因为它属于基础能力完善。  
- 链接: https://github.com/delta-io/delta/pull/6257

---

### 3) DSv2 写入链路正在系统化建设
- PR: [#6230](https://github.com/delta-io/delta/pull/6230)  
- 标题: `[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage`
- PR: [#6231](https://github.com/delta-io/delta/pull/6231)  
- 标题: `[DSv2] Add factory + transport: DataWriterFactory, BatchWrite`

这两个栈式 PR 表明 DSv2 写入执行面正在成体系补齐，包括：
- `DataWriter`
- `DeltaWriterCommitMessage`
- `DataWriterFactory`
- `BatchWrite`

这通常不是一次性小修，而是 **新写入栈搭建**。被纳入后续版本的概率较高。  
- 链接:  
  - https://github.com/delta-io/delta/pull/6230  
  - https://github.com/delta-io/delta/pull/6231

---

### 4) GeoSpatial/地理空间能力有望进入更明确路线图
- PR: [#6235](https://github.com/delta-io/delta/pull/6235)  
- PR: [#6301](https://github.com/delta-io/delta/pull/6301)

GeoSpatial 不再只是单点实验性改动，而是已经出现“主特性 + stats 解析配套”的组合。  
这说明维护者可能正在评估将地理空间数据作为 Delta 的更正式支持方向之一。  
- 链接:  
  - https://github.com/delta-io/delta/pull/6235  
  - https://github.com/delta-io/delta/pull/6301

---

### 5) UniForm / Iceberg 互操作在向“语义保真”升级
- PR: [#6315](https://github.com/delta-io/delta/pull/6315)  
- 标题: `[UniForm] Support converting uncommitted txn for Delta UniForm`
- PR: [#6316](https://github.com/delta-io/delta/pull/6316)

这说明互操作目标已经不仅是文件/表结构转换，而是扩展到：
- 未提交事务的转换
- snapshot summary 信息保留
- 流源位点等元语义保真

这是很明确的产品化路线图信号。  
- 链接:  
  - https://github.com/delta-io/delta/pull/6315  
  - https://github.com/delta-io/delta/pull/6316

---

## 7. 用户反馈摘要

今日没有新增或活跃 Issues，因此缺少直接的用户评论样本。基于 PR 内容，可间接提炼出当前用户与贡献者最关心的真实痛点：

### 1) 流式任务首先要保证“不丢数”
来自 [#6314](https://github.com/delta-io/delta/pull/6314) 的信号最强。用户对流式 source 的核心诉求不是“尽量继续跑”，而是“出现不一致时必须显式暴露问题”。  
这说明生产用户对 **数据完整性优先于可用性** 的要求非常明确。

### 2) SQL/DML 边界行为要与 Spark 预期更一致
从 [#6310](https://github.com/delta-io/delta/pull/6310)、[#6311](https://github.com/delta-io/delta/pull/6311)、[#6257](https://github.com/delta-io/delta/pull/6257) 看，社区持续在修复 CDC、MERGE/INSERT、DECIMAL cast 的语义细节。  
反映出用户已不满足于“基本可用”，而是要求 **复杂 SQL 和类型系统行为稳定、可预测、与主流引擎一致**。

### 3) 多引擎/多目录/多表格式协同成为真实需求
DSv2、Kernel、UC、UniForm、Iceberg 相关 PR 同时活跃，说明用户场景已从单 Spark 引擎扩展到：
- catalog 集成
- 表格式转换
- 元数据回放
- 跨系统语义一致性

这是一类典型的企业级采用信号。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或持续活跃 PR：

### 1) CREATE TABLE 的 Kernel/Spark 抽象改造仍在堆栈推进
- PR: [#6083](https://github.com/delta-io/delta/pull/6083)  
- 创建时间: 2026-02-19

这是列表中时间最久且仍活跃的重要 PR 之一。其影响面较大，关联 DSv2、snapshot abstraction 和 create table 路径重构。  
若长期悬而未决，可能拖慢后续一系列依赖 PR 的收敛。

---

### 2) UC Commit Metrics 传输骨架仍待进一步实装
- PR: [#6155](https://github.com/delta-io/delta/pull/6155)  
- 创建时间: 2026-02-27

该 PR 提供 commit metrics 的 transport wiring 与 smoke tests，属于可观测性/平台协同基础设施。  
如果迟迟不推进，可能影响 UC 集成下的审计、观测与性能分析能力建设。

---

### 3) DSv2 写入栈仍处于分层推进阶段
- PR: [#6230](https://github.com/delta-io/delta/pull/6230)  
- PR: [#6231](https://github.com/delta-io/delta/pull/6231)

这两个 PR 属于典型 stacked PR，设计上相互依赖。  
建议维护者尽快明确：
- 审阅顺序
- 合并边界
- 与现有 Spark/Delta 写入路径的切换策略

否则容易造成长时间堆栈积压。

---

### 4) GeoSpatial 主特性需要尽快判断优先级
- PR: [#6235](https://github.com/delta-io/delta/pull/6235)

GeoSpatial 已出现配套 PR，但主特性尚未落地。  
建议维护者尽快确认：
- 是否纳入 4.2.0 范围
- 是否需要 feature flag
- 与 stats、schema、协议升级之间的关系

---

## 附：今日重点链接清单

- [#6314 Spark 流式 silent data loss 防护](https://github.com/delta-io/delta/pull/6314)
- [#6313 DSv2 通过 Kernel 支持 metadata-only CREATE TABLE](https://github.com/delta-io/delta/pull/6313)
- [#6309 DSv2 识别 CommitInfo action](https://github.com/delta-io/delta/pull/6309)
- [#6083 CREATE TABLE 的 Snapshot abstraction](https://github.com/delta-io/delta/pull/6083)
- [#6316 REPLACE_TABLE replay 保留 Kafka snapshot summary](https://github.com/delta-io/delta/pull/6316)
- [#6315 UniForm 支持转换未提交事务](https://github.com/delta-io/delta/pull/6315)
- [#6257 Kernel 支持不同精度 DECIMAL 隐式转换](https://github.com/delta-io/delta/pull/6257)
- [#6235 Kernel GeoSpatial Table feature](https://github.com/delta-io/delta/pull/6235)
- [#6301 GeoSpatial stats 解析支持 WKT](https://github.com/delta-io/delta/pull/6301)
- [#6256 master 切换到 4.2.0-SNAPSHOT](https://github.com/delta-io/delta/pull/6256)

如果你愿意，我还可以继续把这份日报整理成更适合团队群公告的 **简版摘要**，或者输出成 **Markdown 表格版周报格式**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 · 2026-03-19

## 1. 今日速览

过去 24 小时内，Databend 社区整体活跃度较高：共有 **6 条 Issue 更新**、**12 条 PR 更新**，并发布了 **1 个补丁版本**。  
从内容看，今天的重心明显偏向 **稳定性修复与 SQL/查询引擎健壮性提升**，尤其集中在 JOIN、视图、Parser 和 spill 恢复等路径上的崩溃与正确性问题。  
同时，优化器和 SQL 兼容性方向也在持续推进，包括 **聚合重写、聚合索引匹配、stage 查询大小写处理** 等改进。  
风险方面，今日新报的多个 Issue 都属于 **panic / SIGSEGV / schema mismatch** 级别，说明项目在 DuckDB 测试覆盖扩展后，正在快速暴露复杂 SQL 边界问题；好的一面是，修复节奏也较快，已有若干相关补丁 PR 进入关闭状态。  

---

## 2. 版本发布

## 新版本：v1.2.888-patch-1
- Release: **v1.2.888-patch-1**
- 链接: https://github.com/databendlabs/databend/compare/v1.2.889-nightly...v1.2.888-patch-1

### 版本解读
本次发布为 **patch 级补丁版本**，从命名和 changelog 对比范围看，更偏向于对近期 nightly 变更中的问题进行回收和稳定化处理，而不是引入大规模新功能。

### 已知可关联的近期修复方向
结合今日关闭/合并的 PR，可以推测该补丁版本重点覆盖以下稳定性增强内容：

- **spill 恢复 schema 正确性修复**  
  PR #19564 修复了 variant 列 spill 后依据 parquet metadata 反推 schema 可能丢失类型信息，进而导致恢复结果错误的问题。  
  链接: https://github.com/databendlabs/databend/pull/19564

- **runtime filter 日志补全**  
  PR #19565 增加了 spill 发生时 merge early-return 和 leader 侧缺失的日志，有助于线上排障与执行链路观测。  
  链接: https://github.com/databendlabs/databend/pull/19565

### 破坏性变更
- 本次提供的数据中 **未显示明确破坏性变更**。
- 从当前 PR 描述判断，今日相关改动主要属于 **修复与可观测性增强**，不太像 SQL 语义层面的 breaking change。

### 升级/迁移注意事项
- 如果你正在使用 **包含 variant 列的复杂查询，且启用了 spill**，建议优先升级到该 patch 版本或确认已包含 PR #19564，以避免恢复时 schema 推断错误导致结果异常。
- 若近期线上遇到 **runtime filter 行为不透明、spill 后难排查** 的问题，升级后可重点检查新增日志输出。
- 如果你当前运行在 **1.2.881 附近版本**，需留意用户报告的 `INSERT` 性能回退问题（Issue #19481），升级前建议做回归压测。  
  链接: https://github.com/databendlabs/databend/issues/19481

---

## 3. 项目进展

以下为今日已关闭的重要 PR，反映了查询引擎与稳定性方向的推进：

### 3.1 spill 恢复过程的 schema 正确性修复
- **PR #19564** `[pr-bugfix] fix(query): pass explicit data schema to spill reader instead of inferring from parquet metadata`
- 链接: https://github.com/databendlabs/databend/pull/19564

**进展意义：**
- 修复了 **spill/restore 路径**中 variant 列类型信息丢失的问题。
- 这是典型的 **分析型执行引擎稳定性修复**：当执行中间结果落盘后再恢复，如果仅依赖 parquet metadata 推断 schema，复杂类型可能被错误简化，最终造成查询结果错误。
- 对大查询、内存压力场景、复杂半结构化数据分析尤为关键。

---

### 3.2 runtime filter 可观测性增强
- **PR #19565** `[pr-chore] chore(query): add missing runtime filter logs`
- 链接: https://github.com/databendlabs/databend/pull/19565

**进展意义：**
- 并非功能性修复，但对线上系统非常重要。
- 解决了 spill 发生时 merge early-return 和 leader 信息日志缺失的问题，提升了 **执行器行为可解释性**。
- 对维护者和用户定位过滤器未生效、执行计划退化、spill 后性能异常等问题很有帮助。

---

### 3.3 历史技术债与测试分支清理
- **PR #18637** `[pr-refactor] refactor(query): revert pr 18589`
- 链接: https://github.com/databendlabs/databend/pull/18637
- **PR #19025** `[ci-cloud] [Don't Merge]: test performance`
- 链接: https://github.com/databendlabs/databend/pull/19025
- **PR #19560** `chore(deps): bump org.apache.spark:spark-core_2.13 ...`
- 链接: https://github.com/databendlabs/databend/pull/19560

**进展意义：**
- 这些关闭动作更多是 **仓库治理和测试/依赖维护**，对主线功能影响有限。
- 其中 Spark 依赖升级显示 Databend 测试生态仍在跟进外部大数据组件版本，利于 Iceberg/外部生态兼容验证。

---

## 4. 社区热点

## 4.1 INSERT 性能回退成为当前最受关注问题
- **Issue #19481** `[C-bug] bug: slower performance of INSERT with 1.2.881`
- 链接: https://github.com/databendlabs/databend/issues/19481

### 热度表现
- 评论数：**23**
- 是今日数据中讨论最活跃的 Issue。

### 技术诉求分析
这类反馈代表了 Databend 用户最核心的生产诉求之一：  
**升级后写入性能不能回退，尤其是 INSERT 链路。**

从描述看，用户是从 `1.2.790` 升级到 `1.2.881-nightly` 后观察到明显变慢。这通常涉及：
- 写入执行计划变化
- sink / block flush / commit 路径变化
- 聚合/排序/分布式写入策略调整
- object storage I/O 或 compaction 行为变化
- 新增 correctness check 带来的额外开销

这是比单点 panic 更值得持续关注的问题，因为它直接影响生产吞吐与升级意愿。

---

## 4.2 JOIN 相关崩溃问题集中暴露
今日新报的 4 个 Issue 几乎都指向 **JOIN 语义、JOIN 实现或 JOIN 相关投影/绑定路径**：

- **Issue #19571** SQL Parser panics on nested JOIN with multiple conditions  
  https://github.com/databendlabs/databend/issues/19571
- **Issue #19570** ASOF Join panics on UInt8 type  
  https://github.com/databendlabs/databend/issues/19570
- **Issue #19569** IEJoin (range join) index out of bounds on empty result  
  https://github.com/databendlabs/databend/issues/19569
- **Issue #19568** Result projection schema mismatch — Nullable(Int64) vs Int64  
  https://github.com/databendlabs/databend/issues/19568

### 技术诉求分析
这反映出社区当前非常关注：
- **复杂 JOIN SQL 的兼容性**
- **边界输入下执行器的健壮性**
- **与 DuckDB 测试用例对齐后的语义一致性**
- **优化器/执行器在 nullable、range join、asof join 等高级场景下的正确性**

这类问题虽然来源于测试导入，但本质是在补 Databend 成为更成熟 OLAP 引擎所必须穿越的“复杂 SQL 兼容性”门槛。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0：递归视图可导致 `databend-query` 直接崩溃
- **Issue #19572** `[C-bug] bug: recursive views can crash databend-query`
- 链接: https://github.com/databendlabs/databend/issues/19572

**现象**
- 访问递归定义 view 时，`databend-query` 可能触发 **SIGSEGV**。
- 明确说明与此前确认的 non-equi `LEFT JOIN` crash 无关，属于独立问题。

**影响评估**
- 属于 **进程级崩溃**，严重性最高。
- 如果用户可构造递归引用视图，则可能影响服务可用性。

**是否已有 fix PR**
- **暂无对应 fix PR 出现在今日数据中。**

---

### P0：多条件嵌套 JOIN 导致 SQL Parser panic
- **Issue #19571** `SQL Parser panics on nested JOIN with multiple conditions`
- 链接: https://github.com/databendlabs/databend/issues/19571

**现象**
- `parser.rs:218` 的 `assert_reparse` 触发 panic，报错 `join condition already set`。

**影响评估**
- 属于 **输入可触发 panic**，对 SQL 兼容性与服务健壮性都有影响。
- 尤其危险在于问题发生在 parser 阶段，意味着用户合法/近合法 SQL 即可能导致服务异常而非友好报错。

**是否已有 fix PR**
- 暂无。  
- 但今日 **PR #19573** 对 tokenizer 未闭合状态暴露做了重构，有助于增强 REPL/解析器前端健壮性，不过不是该问题的直接修复。  
  https://github.com/databendlabs/databend/pull/19573

---

### P0：ASOF Join 在 UInt8 类型上 panic
- **Issue #19570** `ASOF Join panics on UInt8 type — unwrap on unsupported type`
- 链接: https://github.com/databendlabs/databend/issues/19570

**现象**
- `bind_asof_join.rs` 中对不支持类型直接 `unwrap()`，当输入为 `UInt8` 时 panic。
- 报错信息显示逻辑自相矛盾：提示“only support numeric types and time types, but got Number(UInt8)”。

**影响评估**
- 暴露出 **类型检查与错误处理路径不健壮**。
- 对使用 ASOF JOIN 处理时序数据的用户影响较大。

**是否已有 fix PR**
- 暂无。

---

### P0：IEJoin 空结果集触发越界
- **Issue #19569** `IEJoin (range join) index out of bounds on empty result`
- 链接: https://github.com/databendlabs/databend/issues/19569

**现象**
- `ie_join_state.rs:483` 出现 `index out of bounds: len is 0 but index is 0`。

**影响评估**
- 这是典型的 **空输入/空输出边界条件处理缺失**。
- 会影响 range join / IEJoin 的正确性与稳定性。

**是否已有 fix PR**
- 暂无。

---

### P1：LEFT JOIN 相关投影 schema mismatch
- **Issue #19568** `[C-bug] Result projection schema mismatch — Nullable(Int64) vs Int64`
- 链接: https://github.com/databendlabs/databend/issues/19568

**现象**
- builder_project 阶段触发断言失败：投影结果 schema 中 nullable 性不一致。

**影响评估**
- 虽然未必导致进程崩溃，但会造成 **查询失败或错误的 schema 处理**。
- 这类问题常见于 outer join 后 nullable 传播规则不完整。

**是否已有 fix PR**
- 暂无。

---

### P1：INSERT 性能回退
- **Issue #19481** `[C-bug] bug: slower performance of INSERT with 1.2.881`
- 链接: https://github.com/databendlabs/databend/issues/19481

**现象**
- 从 `1.2.790` 升级到 `1.2.881-nightly` 后 INSERT 变慢。

**影响评估**
- 不会导致 crash，但属于 **生产体验级高优先级问题**。
- 对写入密集场景、批量导入场景影响显著。

**是否已有 fix PR**
- 今日数据中未看到明确修复 PR。

---

## 6. 功能请求与路线图信号

严格基于今日数据，新的“显式功能需求”不多，但从活跃 PR 可看出若干清晰路线图信号：

### 6.1 SQL 交互与解析器能力增强
- **PR #19573** `refactor: expose unclosed state from tokenizer for REPL consumers`
- 链接: https://github.com/databendlabs/databend/pull/19573

**信号解读**
- 该 PR 将字符串/代码字符串从 regex 模式转为自定义 handler，以识别未闭合 quotes、backticks、dollar-quotes 和 block comments。
- 这不是单纯重构，而是明显在为 **更友好的 REPL / SQL 交互式体验** 铺路。
- 预示未来 Databend 可能继续增强：
  - 交互式 SQL shell
  - parser/tokenizer 错误提示
  - SQL 编辑器/客户端集成体验

---

### 6.2 stage 查询易用性与大小写兼容优化
- **PR #19566** `[pr-feature] feat: better case handling for query stage.`
- 链接: https://github.com/databendlabs/databend/pull/19566

**信号解读**
- 目标场景是：
  - `select ... from @my_stage/my_parquet/`
  - `copy/insert/replace ... from (select ... from @my_stage/my_parquet/)`
- 重点在于改进 stage 文件查询时的列名大小写处理。

**可能纳入下一版本的原因**
- 面向真实用户场景，且直接影响文件查询和数据导入体验。
- 对对象存储 + Parquet 的外表/临时查询路径十分重要。

---

### 6.3 优化器重写能力继续增强
- **PR #19559** `refactor(sql): improve eager aggregation rewrites`
- 链接: https://github.com/databendlabs/databend/pull/19559
- **PR #19567** `refactor(sql): improve agg index rewrite matching`
- 链接: https://github.com/databendlabs/databend/pull/19567

**信号解读**
- 前者在重构 `RuleEagerAggregation`，拆分输入解析、候选分配、重写生成。
- 后者把聚合索引重写从字符串匹配升级为结构化表达式匹配。

**路线图意义**
- 说明 Databend 正在持续增强 **基于规则的查询优化器**。
- 若顺利落地，未来版本在以下方面有望受益：
  - 聚合类查询性能
  - 优化器规则可维护性
  - 复杂表达式下重写正确性
  - 索引/预计算结构命中率

---

### 6.4 FUSE 表快照实验性标签能力
- **PR #19549** `feat(query): support experimental table tags for FUSE table snapshots`
- 链接: https://github.com/databendlabs/databend/pull/19549

**信号解读**
- 引入新的 KV-backed table tag model，而非沿用 legacy branch/tag 实现。
- 这是比较明确的 **元数据管理与快照治理能力演进** 信号。

**可能影响**
- 更方便地标记/引用表快照
- 改善 FUSE 表版本管理体验
- 为未来的数据版本治理、分支分析、可回溯查询提供基础设施

---

## 7. 用户反馈摘要

结合今日 Issue 内容，可提炼出以下真实用户痛点：

### 7.1 升级后最担心的是性能回退，不只是功能正确
- 代表案例：**Issue #19481**
- 链接: https://github.com/databendlabs/databend/issues/19481

用户从旧版本升级到较新 nightly 后，直接观察到 `INSERT` 性能下降。  
这表明 Databend 已进入一个“生产采用更深”的阶段：用户不再只关注能不能跑，而更关注：
- 升级是否稳定
- 性能曲线是否连续
- 写入吞吐是否有回归
- nightly 是否足够可信

---

### 7.2 高级 JOIN 与复杂 SQL 的稳定性仍是用户信任门槛
- 代表案例：
  - #19571 https://github.com/databendlabs/databend/issues/19571
  - #19570 https://github.com/databendlabs/databend/issues/19570
  - #19569 https://github.com/databendlabs/databend/issues/19569
  - #19568 https://github.com/databendlabs/databend/issues/19568

这些问题共同说明，用户或测试贡献者正在用更复杂的 SQL 集合持续“压测” Databend：
- 嵌套 JOIN
- ASOF JOIN
- range join / IEJoin
- outer join nullable 传播
- 多条件 join 表达式

对 OLAP 用户而言，这些不是边角功能，而是分析 SQL 的核心组成部分。

---

### 7.3 服务端 panic / SIGSEGV 仍然是最不能接受的问题
- 代表案例：**Issue #19572**
- 链接: https://github.com/databendlabs/databend/issues/19572

相比普通报错，用户更希望：
- 非法 SQL 返回可诊断错误
- unsupported type 返回明确提示
- 边界场景返回空结果或语义错误
- 而不是直接 crash/panic

这类反馈直接指向 Databend 在“数据库产品化成熟度”上的关键要求。

---

## 8. 待处理积压

以下是值得维护者关注的长期或悬而未决项：

### 8.1 长期活跃但未解决的性能回归问题
- **Issue #19481** `slower performance of INSERT with 1.2.881`
- 链接: https://github.com/databendlabs/databend/issues/19481

**关注原因**
- 创建于 2026-02-24，至今仍活跃，且已有 23 条评论。
- 性能回退问题往往最影响企业用户升级决策，应优先给出：
  - 根因定位
  - 回归范围
  - workaround
  - 预计修复版本

---

### 8.2 bendpy CSV/TSV 注册问题出现重复修复迹象
- **PR #19444** `fix(bendpy): register_csv/register_tsv fails with column position error`
- 链接: https://github.com/databendlabs/databend/pull/19444
- **PR #19557** `fix: bendpy register csv column positions followup`
- 链接: https://github.com/databendlabs/databend/pull/19557

**关注原因**
- followup PR 表明原修复可能不完整，或存在边界遗漏。
- 建议维护者确认：
  - 是否需要关闭旧 PR 并统一到 followup
  - 是否补齐 Python 侧回归测试
  - 是否对 CSV/TSV 视图注册行为做更系统设计

---

### 8.3 FUSE table tags 功能较大，仍待推进
- **PR #19549** `support experimental table tags for FUSE table snapshots`
- 链接: https://github.com/databendlabs/databend/pull/19549

**关注原因**
- 这是较有战略意义的新特性，但当前仍未合并。
- 涉及元数据模型切换，建议重点评审：
  - 向后兼容性
  - 快照引用语义
  - 元数据清理策略
  - 与现有 branch/tag 机制的边界

---

## 总体判断

Databend 今日呈现出典型的 **“高活跃修复期”** 特征：  
一方面，补丁版本发布、spill/schema/logging 修复落地，说明维护者对线上稳定性响应较快；另一方面，JOIN、Parser、视图递归等复杂 SQL 路径集中暴露出多个高严重问题，表明项目正在经历一轮针对 SQL 兼容性和执行器边界条件的强化测试。  

从项目健康度看，**开发活跃、修复速度快、优化器和元数据特性持续前进** 是积极信号；但若想进一步提升生产信任度，接下来最需要优先压降的仍是两类问题：
1. **panic / SIGSEGV / 越界等服务稳定性缺陷**
2. **升级后的性能回归与复杂 JOIN 正确性问题**

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时 Velox 保持高活跃度：Issues 更新 5 条、PR 更新 50 条，代码与工程侧推进明显快于问题收敛速度。  
当天没有新版本发布，但围绕 **查询正确性、内存安全、GPU/cuDF、构建效率、Iceberg 连接器能力** 的工作非常集中。  
从信号看，项目当前处于“**持续扩展能力 + 快速修复回归**”并行阶段：一方面有 Iceberg positional update、GPU decimal、Python bindings 等功能增强；另一方面也出现了 `LIKE` use-after-free、`from_unixtime` 年份格式偏差、`current_time` 时区缺失等稳定性问题。  
整体健康度评价：**活跃且积极修复中**，但近期需要重点关注 **时间函数兼容性、字符串生命周期、构建链路稳定性** 这三类风险。

---

## 2. 项目进展

### 已合并 / 已关闭的重要变更

#### 2.1 修复 DWRF 写入侧字符串生命周期问题
- **PR**: #16800 `fix(dwrf): Fix dangling StringView keys in FlatMapColumnWriter`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16800

该修复解决了 DWRF `FlatMapColumnWriter` 中 `StringView` 作为 `F14NodeMap` key 时的悬垂指针问题。问题根因是 `StringView` 为非 owning 类型，当输入批次释放后，长字符串指针失效，rehash 时可能访问已释放内存。  
这属于典型的 **存储引擎写路径内存安全缺陷**，可能导致崩溃或 silent corruption 风险。该修复对提升 DWRF 写入稳定性意义较大，也说明 Velox 在高性能 string/view 使用场景中正逐步补齐生命周期管理。

#### 2.2 清理序列化接口，减少运行时 kind 依赖
- **PR**: #16710 `refactor: Remove VectorSerde::kind() method, use static serializer names`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16710

该改动移除了 `VectorSerde::kind()`，转向静态 serializer name。  
虽然是偏内部重构，但有助于 **序列化框架接口收敛与可维护性提升**，减少动态分派和枚举式扩展负担，为后续 serde 体系演进打基础。

#### 2.3 GPU CI 能力建设问题关闭
- **Issue**: #15673 `Add GPU CI check to run unit tests`
- **状态**: 已关闭
- **链接**: facebookincubator/velox Issue #15673

该 Issue 的关闭表明社区在 **GPU 后端（Wave / cuDF）CI 覆盖** 上已有实质推进。对于 Velox 当前 GPU 相关 PR 明显增多的背景，这意味着项目开始补上“功能已开发，但缺少持续验证”的关键一环。  
这对减少 GPU 路径回归、提升企业用户采用信心非常重要。

#### 2.4 Parquet `DELTA_BYTE_ARRAY` 支持跟踪项关闭
- **Issue**: #10938 `Add decoder for DELTA_BYTE_ARRAY parquet encoding`
- **状态**: 已关闭
- **链接**: facebookincubator/velox Issue #10938

这一关闭动作说明 Velox 在 Parquet 编码兼容性上继续补齐。  
`DELTA_BYTE_ARRAY` 是典型的实际数据湖文件会遇到的编码类型，尤其在 Presto/Parquet V2 互操作中常见。该项关闭对提升 **外部湖仓文件兼容性** 是积极信号。

---

## 3. 社区热点

> 说明：给定数据未包含精确评论排序值，以下根据问题影响面、变更性质和摘要信息判断“热点”。

### 3.1 `LIKE` 非常量 pattern 导致 use-after-free 崩溃
- **PR**: #16830 `fix: Copy pattern string in LikeGeneric to prevent use-after-free crash`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16830

这是今天最值得关注的修复之一。  
问题发生在 `LikeGeneric::apply` 中，非 constant pattern 使用 `StringView` 指向可被 memory arbitration 回收的底层 buffer，导致悬垂指针和 `SIGSEGV`。  
背后的技术诉求很明确：**Velox 在 memory arbitration 与表达式执行结合场景下，需要更严格地区分 owning / non-owning string 生命周期**。这类问题通常不只影响单个函数，可能提示更多表达式函数存在类似风险。

### 3.2 回滚输出缓冲区清理优化，表明已有回归
- **PR**: #16829 `fix: Back out Avoid redundant outputBuffer clearing`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16829

该 PR 明确说明此前优化（PR #15998）导致 query failures，因此先回滚。  
这是一个典型的 **性能优化引发正确性回归** 案例。社区当前优先级很清楚：在分析引擎核心算子路径上，正确性高于微观性能收益。  
这也提示维护者应加强对 buffer reuse / clearing 优化的回归覆盖。

### 3.3 Iceberg 连接器新增 positional update 支持
- **PR**: #16761 `feat:Add positional update support for Velox Iceberg connector`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16761

这是今天功能价值最高的进行中 PR 之一。  
它为 Iceberg connector 引入 merge-on-read 全行 positional update 支持，属于 **湖仓事务语义能力增强**。  
技术诉求是让 Velox 更好承担现代 table format 执行层角色，补齐不仅“读删除文件”，还包括“读更新文件”的能力，对接上层引擎（如 Trino/Prestissimo/Spark 兼容路径）意义很大。

### 3.4 构建影响分析工作流
- **PR**: #16827 `build: Add build impact analysis workflow for PRs`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16827

该 PR 提供 PR 级别的 CMake target 影响分析，只做 metrics 不做 gate。  
说明社区关注点已从“能不能构建”提升到“**怎么更快定位受影响模块、降低 CI 成本**”。对于 Velox 这类大型 C++ 项目，这是成熟度提升信号。

### 3.5 cuDF 函数注册与测试体系扩展
- **PR**: #16504 `feat(cuDF): Support function signature retrieval from registry`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16504

- **PR**: #16825 `feat(cudf): Add unit tests for CUDF string functions`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16825

这两项一起看，反映出 Velox GPU 路线正从“能跑”走向“**可注册、可发现、可测试、可维护**”。  
其中 #16504 让 Velox 能暴露 cuDF 标量/聚合函数签名，利于函数目录管理与上层集成；#16825 则补上字符串函数测试，对稳定 GPU 字符串表达式执行很关键。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P0 / 高优先级：`LIKE` 执行 use-after-free，可触发崩溃
- **PR**: #16830
- **链接**: facebookincubator/velox PR #16830
- **状态**: 已有修复 PR

问题会在内存压力和 memory arbitration 条件下触发 `SIGSEGV`，属于明确的内存安全缺陷。  
影响面不一定局限于 LIKE；凡是执行期保留非 owning `StringView` 的路径都值得排查。

---

### P1 / 高优先级：输出缓冲区优化导致查询失败，已回滚
- **PR**: #16829
- **链接**: facebookincubator/velox PR #16829
- **状态**: 已有回滚 PR

这是回归型问题。虽然摘要未给出具体 SQL 场景，但“causing query failures” 说明影响已超出边界 case。  
短期看回滚是正确策略；中期需要补充针对 output buffer 生命周期和复用策略的测试覆盖。

---

### P1 / 高优先级：`from_unixtime` 与 Spark 在 `YYYY` 格式上结果不一致
- **Issue**: #16806 `[bug, triage] Velox from_unixtime YYYY date format get diff result with spark`
- **链接**: facebookincubator/velox Issue #16806
- **状态**: Open
- **是否已有 fix PR**: 暂无明确对应 PR

用户报告：
```sql
SELECT from_unixtime(1767024027, 'YYYY-MM-dd HH:mm:ss')
```
Velox 返回 `2025-12-30 00:00:27`，Spark 期望 `2026-12-30 00:00:27`。  
核心在于 Spark 将 `YYYY` 解释为 **ISO week-year**，而 `yyyy` 才是普通年份。  
这属于 **SQL 兼容性 / 日期格式语义偏差**，对 Spark 兼容执行场景影响较大，尤其是迁移工作负载时可能产生静默错误。

---

### P1 / 高优先级：`current_time` 在 LocalRunnerService 下找不到 session timezone
- **Issue**: #16828 `[bug, fuzzer, fuzzer-found] current_time cannot find session timezone when executed with LocalRunnerService`
- **链接**: facebookincubator/velox Issue #16828
- **状态**: Open
- **是否已有 fix PR**: 暂无

这是 fuzzer 新发现的问题，说明 **本地执行服务与 session 上下文传递** 存在缺陷。  
时间函数高度依赖 session timezone；若上下文未传递完整，容易在表达式验证、单机 runner、测试工具链中出现行为不一致。

---

### P2 / 中优先级：Presto SOT 下 `localtime/current_date` 因括号生成方式失败
- **Issue**: #14937 `localtime, current_date fail in fuzzer with Presto SOT`
- **链接**: facebookincubator/velox Issue #14937
- **状态**: Open
- **是否已有 fix PR**: 暂无

该问题存在时间较长，但最近仍有更新。  
它反映的是 **SQL 生成器 / 方言兼容层** 对无参时间函数处理不一致：`localtime`、`current_date` 等被包装为带括号形式后，在 Presto 作为 source-of-truth 时失败。  
这类问题不一定会导致引擎崩溃，但会显著影响 fuzzing 有效性和跨引擎对比验证质量。

---

### P2 / 中优先级：cuDF `CONCAT(VARCHAR)` 间歇失败
- **PR**: #16824 `fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)`
- **链接**: facebookincubator/velox PR #16824
- **状态**: Open
- **是否已有 fix PR**: 是，本 PR 即修复

错误信息显示 separator 不是有效 `string_scalar`。  
问题属于 GPU 字符串函数封装层的参数构造错误，当前已有针对性修复，并且 #16825 通过新增单元测试帮助防止回归。

---

### P2 / 中优先级：CentOS 9 下 gflags 安装后运行时库路径缺失
- **PR**: #16817 `fix(build): Register /usr/local/lib64 with ldconfig after gflags install on CentOS 9`
- **链接**: facebookincubator/velox PR #16817
- **状态**: Open

这属于构建/部署稳定性问题。  
下游如 fbthrift `thrift1` 编译器会因找不到 `libgflags.so.2.2` 失败。虽然不是引擎运行时 bug，但会直接影响新环境可用性和 CI 成功率。

---

## 5. 功能请求与路线图信号

### 5.1 Iceberg connector 正向扩展到 positional update
- **PR**: #16761
- **链接**: facebookincubator/velox PR #16761

这是非常明确的路线图信号：Velox 正持续增强 **Iceberg 事务性读取能力**。  
如果该 PR 合入，下一阶段很可能继续围绕：
- merge-on-read 读取完整性
- update/delete 文件协同处理
- 更复杂 snapshot/row-level operation 支持

这类能力会显著提升 Velox 作为湖仓执行层的吸引力。

---

### 5.2 GPU/cuDF 生态能力继续加码
- **PR**: #16504 `Support function signature retrieval from registry`
- **PR**: #16612 `GPU Decimal (Part 1 of 3)`
- **PR**: #16825 `Add unit tests for CUDF string functions`
- **链接**:
  - facebookincubator/velox PR #16504
  - facebookincubator/velox PR #16612
  - facebookincubator/velox PR #16825

从这几项可以看出，GPU 路线并非停留在实验状态，而是在朝产品化推进：
- 函数签名可发现
- Decimal 类型支持
- 字符串函数测试补齐
- GPU CI 相关 issue 关闭

判断：**GPU decimal 与函数注册体系非常可能被纳入后续版本重点能力**。

---

### 5.3 Python 可编排性增强
- **PR**: #16654 `feat(operator): Add MarkSorted Python bindings`
- **链接**: facebookincubator/velox PR #16654

该 PR 为 `MarkSorted` 暴露 Python bindings，意味着 Velox 正加强 **Python 驱动的计划构建与实验能力**。  
这对研究型用户、测试自动化、嵌入式执行场景很有价值，也可能为 notebook / prototyping 工作流铺路。

---

### 5.4 SQL 兼容性：Spark Decimal 与日期时间语义
- **PR**: #16307 `Support decimal type for Spark checked_multiply function`
- **Issue**: #16806 `from_unixtime YYYY ... diff result with spark`
- **链接**:
  - facebookincubator/velox PR #16307
  - facebookincubator/velox Issue #16806

一边是 Spark ANSI decimal 乘法支持，一边是 Spark 时间格式语义差异暴露。  
这说明 Velox 的 SQL 兼容路线依然围绕 **Spark/Presto 双生态** 展开。短期内与 Spark 相关的日期格式、decimal overflow 行为、ANSI 模式一致性，值得持续关注。

---

## 6. 用户反馈摘要

### 6.1 真实痛点一：跨引擎日期格式兼容性会产生“静默错误”
- **Issue**: #16806
- **链接**: facebookincubator/velox Issue #16806

用户明确以 Spark 结果作为对照，说明其场景很可能是 **Spark SQL 迁移或兼容执行**。  
痛点不只是“报错”，而是返回了一个看似合理但年份错误的结果，这类问题对生产数仓最危险。

### 6.2 真实痛点二：时间函数在不同执行器/服务形态下行为不一致
- **Issue**: #16828
- **Issue**: #14937
- **链接**:
  - facebookincubator/velox Issue #16828
  - facebookincubator/velox Issue #14937

无论是 LocalRunnerService 缺 session timezone，还是 Presto SOT 因 SQL 生成括号失败，都表明用户与开发者正在遭遇 **“同一 SQL / 表达式在不同 harness 下行为不同”** 的问题。  
这会直接削弱 fuzzing、回归验证和跨引擎对齐的可信度。

### 6.3 真实痛点三：构建环境脆弱，影响接入效率
- **PR**: #16817
- **PR**: #16827
- **链接**:
  - facebookincubator/velox PR #16817
  - facebookincubator/velox PR #16827

CentOS 9 的 `ldconfig` 问题和新的 build impact analysis workflow，反映社区非常在意 **开发者体验与 CI 成本**。  
对大型 C++ 项目来说，构建问题会直接影响外部贡献者参与度。

### 6.4 真实痛点四：GPU 路径需要更强测试保障
- **PR**: #16824
- **PR**: #16825
- **Issue**: #15673
- **链接**:
  - facebookincubator/velox PR #16824
  - facebookincubator/velox PR #16825
  - facebookincubator/velox Issue #15673

cuDF 字符串函数出现间歇失败，随后补测试，再加上 GPU CI 跟踪项关闭，说明用户对 GPU 路径的主要诉求是：**不仅要支持，更要稳定可验证**。

---

## 7. 待处理积压

### 7.1 오래存在的 Presto SOT 时间函数问题仍未闭环
- **Issue**: #14937
- **创建时间**: 2025-09-23
- **状态**: Open
- **链接**: facebookincubator/velox Issue #14937

该问题已存在近半年，仍影响 fuzzer 与 Presto SOT。  
建议维护者优先确认：
- 是否属于 SQL printer 问题
- 是否应在函数注册层声明无参函数的括号策略
- 是否会影响除 fuzzer 外的真实查询生成路径

---

### 7.2 FBThrift 替代 Apache Thrift 的大规模迁移仍在进行
- **PR**: #16019 `build: Use FBThrift instead of Apache Thrift`
- **创建时间**: 2026-01-14
- **状态**: Open
- **链接**: facebookincubator/velox PR #16019

这是一个影响面很大的依赖迁移 PR，涉及 Parquet 相关外部依赖替换与 API 不兼容问题。  
长期未合并意味着该项复杂度较高，建议持续关注其拆分策略与兼容层设计，否则容易长期占用维护资源。

---

### 7.3 Base32/Base64 公共工具抽取 PR 持续挂起
- **PR**: #16176 `fix: Add new utility file BaseEncoderUtils.h`
- **创建时间**: 2026-01-30
- **状态**: Open
- **链接**: facebookincubator/velox PR #16176

这类重构型 PR 虽不紧急，但若长期搁置，容易造成 reviewer fatigue。  
建议维护者明确是否需要缩小改动范围或拆分提交。

---

### 7.4 Spark Decimal 支持已 ready-to-merge，值得尽快处理
- **PR**: #16307 `Support decimal type for Spark checked_multiply function`
- **状态**: Open / ready-to-merge
- **链接**: facebookincubator/velox PR #16307

该 PR 已具备较强成熟度，且直接增强 Spark ANSI 模式兼容性。  
考虑到今日又暴露了 Spark 时间格式兼容问题，建议把这类 **高价值兼容性增强** 尽快合并，形成正向用户信号。

---

## 8. 结论与维护建议

今天的 Velox 呈现出非常鲜明的双线特征：  
一条线是 **功能扩展**——Iceberg positional update、GPU decimal、cuDF 注册与测试、Python bindings；  
另一条线是 **稳定性修复**——字符串 `StringView` 生命周期、时间函数 session/context、查询缓冲优化回滚、跨引擎 SQL 语义对齐。

### 建议优先级
1. **立即处理内存安全与查询失败回归**
   - #16830
   - #16829

2. **尽快修复时间函数兼容性与上下文传递问题**
   - #16806
   - #16828
   - #14937

3. **加速合并高成熟度兼容性增强**
   - #16307
   - #16612

4. **继续推进工程效率建设**
   - #16827
   - #16826
   - #16797

---

如果你愿意，我还可以继续把这份日报转换成：
1. **适合飞书/Slack 发布的精简版**  
2. **面向管理层的周报风格摘要**  
3. **按“查询引擎 / 存储格式 / GPU / 构建系统”分类的专题版**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持了较高活跃度：共有 **6 条 Issue 更新**、**18 条 PR 更新**，其中 **11 条仍待合并**、**7 条已合并/关闭**。  
从议题分布看，今日重心明显集中在 **Velox 后端能力增强、GPU shuffle 读取优化、Iceberg/Parquet 兼容性修复、构建与脚本基础设施改进**。  
项目没有新版本发布，但从多个活跃 PR 可以看出，团队正在持续推进 **SQL 兼容性、执行引擎性能优化与多后端稳定性修复**。  
整体健康度判断：**活跃且方向清晰**，但也暴露出部分长期未合并 PR 和若干性能/正确性问题仍需维护者加速收敛。

---

## 2. 项目进展

以下为今日值得关注的已关闭/推进中的重要 PR 动态。

### 2.1 Iceberg 文件元信息函数修复已关闭，问题进入收敛阶段
- **PR**: #11615 `[CORE, VELOX, DATA_LAKE] [GLUTEN-11513][VL][Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11615

该 PR 处理了 `input_file_name()`、`input_file_block_start()`、`input_file_block_length()` 在 **Iceberg + Velox** 场景下的异常行为，并同时覆盖了 JNI 初始化稳定性与 metadata 透传问题。  
这属于典型的 **SQL 兼容性与数据湖元数据一致性修复**，对依赖文件级 lineage、审计、调试能力的用户尤其重要。

但需要注意的是，对应 Issue **#11513** 今日仍保持打开状态，说明：
1. 方案可能尚未完全验证；
2. 或修复尚未完成最终合入/回归确认；
3. Iceberg 场景可能仍存在边角行为待补齐。

- **相关 Issue**: #11513  
- **链接**: apache/gluten Issue #11513

---

### 2.2 GPU fallback 修复 PR 再次关闭，GPU 路径稳定性仍待确认
- **PR**: #11770 `[VELOX] [MINOR][VL] Fix the GPU fallback`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11770

- **PR**: #11785 `[VELOX] [MINOR] Fix gpu fallback`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11785

今日连续有两个与 **GPU fallback** 相关的修复 PR 被关闭，说明该问题正在快速迭代，但实现方案可能仍在调整。  
这类问题通常影响：
- GPU 执行路径失败后是否能安全回退到 CPU；
- 回退后的正确性与稳定性；
- 混合执行场景中的资源释放与状态一致性。

从维护节奏看，GPU fallback 仍是一个 **高优先级但尚未稳定收敛** 的领域。

---

### 2.3 Gluten-it 工具链小修复关闭，测试/验证体验得到改善
- **PR**: #11781 `[TOOLS] [VL] Gluten-it: Fix broken --decimal-as-double`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11781

该 PR 修复了 `gluten-it` 工具中 `--decimal-as-double` 参数在前序改动后失效的问题。  
虽然属于工具层修复，但它直接影响：
- 回归测试可靠性；
- decimal 类型相关兼容性验证；
- 开发者/贡献者本地验证效率。

这类修复通常对项目持续集成与问题复现效率有明显正向作用。

---

### 2.4 多个核心增强 PR 持续推进，体现中短期方向
以下 PR 虽未合并，但技术意义较强：

#### a) Velox shuffle writer 增加分块列统计
- **PR**: #11769 `[VELOX] [GLUTEN-11605][VL] Write per-block column statistics in shuffle writer`
- **链接**: apache/gluten PR #11769

该 PR 在 shuffle writer 中写入 **per-block column statistics**（如 min/max/hasNull），为后续 **基于动态过滤器的 block-level pruning** 打基础。  
这代表 Gluten 正在把优化能力从算子级推进到 **shuffle 数据级剪枝**，对大规模 join / filter workload 有潜在显著收益。

#### b) GPU shuffle reader 多线程解压
- **PR**: #11780 `[VELOX] [GLUTEN-11779][VL] Support multi-threaded decompression in the GPU shuffle reader`
- **链接**: apache/gluten PR #11780

该 PR 对应同名 Issue，目标是降低 GPU shuffle 读取中的全局锁阻塞，把 native 解压/反序列化改造成并行执行。  
这是明显的 **执行引擎吞吐优化**，适合 GPU 加速场景中的高并发 shuffle 消费。

#### c) approx_percentile 聚合函数支持
- **PR**: #11651 `[CORE, VELOX, CLICKHOUSE] [GLUTEN-4889][VL] feat: Support approx_percentile aggregate function`
- **链接**: apache/gluten PR #11651

这是一个较关键的 **SQL 功能补齐** PR。其难点不只是函数本身，而在于 **Velox 的 KLL sketch 与 Spark 的 GK algorithm 中间态不兼容**，因此会牵涉 fallback 与中间结果交换策略。  
如果落地，将提升 Gluten 在分析型 SQL 中的函数覆盖度。

#### d) Variant 测试套件启用
- **PR**: #11726 `[CORE, VELOX] [GLUTEN-11550][VL][UT] Enable Variant test suites`
- **链接**: apache/gluten PR #11726

此 PR 面向 Spark 4.0 / 4.1 开启 Variant 相关测试，说明项目在提前为新一代 Spark 语义和复杂类型支持做验证储备。

---

## 3. 社区热点

### 3.1 最活跃 Issue：Velox 上游 PR 跟踪器
- **Issue**: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **评论**: 16
- **👍**: 4
- **链接**: apache/gluten Issue #11585

这是今日讨论最活跃的议题。它本质上不是单点 bug，而是一个 **Gluten 社区维护的 Velox 上游补丁跟踪板**。  
技术诉求很明确：  
- Gluten 社区在 Velox 生态中贡献了不少有价值 PR；
- 但这些 PR 尚未被 Velox upstream 合并；
- 社区又不希望长期维护大量 fork patch，因为 rebase 成本高。

这反映出一个重要信号：**Gluten 与 Velox 的协同深度持续加深，但上游合并节奏已经成为功能落地速度的重要制约因素。**  
对维护者而言，这类 tracker 对版本治理和 patch debt 管理非常关键。

---

### 3.2 真实用户性能抱怨：简单 limit 查询比 Vanilla Spark 慢 10 倍以上
- **Issue**: #11766 `[enhancement] [VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`
- **评论**: 4
- **链接**: apache/gluten Issue #11766

这是今日最值得关注的性能类反馈之一。用户指出在非常简单的：

```sql
select * from store_sales limit 10;
```

场景中，Gluten 反而比 Vanilla Spark 慢超过 10 倍。  
问题背后的技术指向可能包括：
- limit 下推/early stop 不充分；
- 列式执行初始化成本在小查询中被放大；
- 任务切分数量与原生 Spark 不一致；
- Velox 路径在 trivial query 上缺少 fast path。

这类问题虽然不一定影响大查询吞吐，但会显著影响 **交互式分析体验、BI 场景首屏时延、用户对引擎“体感性能”的评价**。

---

### 3.3 Iceberg 文件名函数兼容性问题持续被关注
- **Issue**: #11513 `[enhancement, good first issue] [VL] Input_file_name() returns "" on iceberg tables`
- **评论**: 5
- **链接**: apache/gluten Issue #11513

该问题持续活跃，说明用户对 **Iceberg 上文件级 SQL 函数的一致性** 有明确诉求。  
即使已有关闭 PR #11615，Issue 仍未关闭，意味着社区对修复的完整性与可验证性仍有保留。  
这再次说明 Gluten 在数据湖集成方面的重点已经不只是“能跑”，而是要做到与 Spark 原生行为一致。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1：简单查询性能严重倒退
- **Issue**: #11766 `[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`
- **状态**: OPEN
- **链接**: apache/gluten Issue #11766
- **已有 fix PR**: 暂无直接对应修复 PR

**影响**：  
- 交互式分析体验差；
- 用户可能直接质疑启用 Gluten 的收益；
- 若问题普遍存在，会影响 benchmark 口碑。

**判断**：  
这是典型的高优先级性能回归/设计短板问题，应尽快补充 profiling 与最小复现。

---

### P1：GPU shuffle 读取存在锁竞争与吞吐瓶颈
- **Issue**: #11779 `Support multi-threaded decompression in the GPU shuffle reader`
- **状态**: OPEN
- **链接**: apache/gluten Issue #11779
- **对应 PR**: #11780
- **PR 链接**: apache/gluten PR #11780

**影响**：  
- GPU shuffle 读取可能被全局 GPU 锁阻塞；
- native 解压与反序列化吞吐受限；
- GPU 加速收益被数据传输/解压阶段吞没。

**判断**：  
虽然是 enhancement 标记，但从内容看更接近 **性能瓶颈修复**。已有对应 PR，推进速度较快。

---

### P2：Iceberg 上 input_file_name() 返回空字符串
- **Issue**: #11513 `[VL] Input_file_name() returns "" on iceberg tables`
- **状态**: OPEN
- **链接**: apache/gluten Issue #11513
- **对应 PR**: #11615（已关闭）
- **PR 链接**: apache/gluten PR #11615

**影响**：  
- SQL 行为与 Spark 原生不一致；
- 影响审计、debug、数据治理和文件级追踪场景。

**判断**：  
已有修复尝试，但尚未完全闭环，建议维护者确认：
1. 是否已有替代 PR；
2. 是否仅因流程原因关闭；
3. 是否需要补更多回归测试。

---

### P2：GPU fallback 稳定性仍不明确
- **PR**: #11770、#11785
- **状态**: CLOSED
- **链接**: apache/gluten PR #11770 / apache/gluten PR #11785

**影响**：  
- GPU 执行出错时回退路径若不稳定，可能导致任务失败或结果不一致；
- 对生产环境启用 GPU 加速构成风险。

**判断**：  
由于修复 PR 被关闭但未见明确最终方案，建议重点跟踪后续替代提交。

---

### P3：Parquet 元数据校验在大分区场景可能引入额外开销
- **Issue**: #11782 `Parquet metadata check limit optimization`
- **状态**: OPEN
- **链接**: apache/gluten Issue #11782

该问题指出在启用 `spark.gluten.sql.fallbackUnexpectedMetadataParquet` 时，按 root path 检查文件限制可能在分区数过多时带来明显验证成本。  
本质上属于 **保护性校验与性能开销之间的权衡优化**。

---

## 5. 功能请求与路线图信号

### 5.1 部分 Project UDF 优化
- **Issue**: #11783 `Partial Project UDF optimization`
- **链接**: apache/gluten Issue #11783

该需求聚焦于部分投影场景下，当前通过 `ArrowColumnarRow(InternalRow)` 回传 Spark 行数据的方式在列数较少时收益较好，但仍存在进一步优化空间。  
这说明社区在继续打磨 **列式/行式边界转换成本**，这是 Gluten 性能优化的长期主线之一。

---

### 5.2 GPU shuffle reader 多线程解压大概率会进入后续版本
- **Issue**: #11779
- **PR**: #11780
- **链接**: apache/gluten Issue #11779 / apache/gluten PR #11780

由于问题和 PR 同日联动，且目标清晰、收益明确，这项能力是 **较高概率进入下一版本或近期迭代** 的功能增强。

---

### 5.3 approx_percentile 支持是重要 SQL 覆盖路线信号
- **PR**: #11651
- **链接**: apache/gluten PR #11651

虽然不是今日新开需求，但该 PR 持续活跃，显示项目正在补足 **高级聚合函数兼容性**。  
若合入，将提升面向 BI/数仓 workload 的 SQL 支持完整度。

---

### 5.4 Shuffle block 级剪枝是中期性能路线的重要信号
- **PR**: #11769
- **链接**: apache/gluten PR #11769

通过在 shuffle writer 写出 block 列统计，为 reader 侧动态过滤做铺垫，这类能力有机会成为 Gluten 在大规模 join 计算中的重要性能卖点。  
从路线图视角看，这属于 **更深层执行引擎优化**，价值高于一般的点修复。

---

### 5.5 Spark 3.2/3.3 专项兼容修正
- **PR**: #11787 `[VELOX] Only apply VeloxParquetWriterInjects and NativeWritePostRule for Spark 3.2 and 3.3`
- **链接**: apache/gluten PR #11787

该 PR 表明项目仍在持续维护多 Spark 版本兼容矩阵，避免某些注入规则误作用于不适配版本。  
这对生产用户非常重要，尤其是尚未升级到较新 Spark 版本的企业集群。

---

## 6. 用户反馈摘要

结合今日活跃 Issue，可提炼出几个真实用户痛点：

### 6.1 “简单查询不快”比“大查询不够极致”更伤用户信心
- **来源**: #11766
- **链接**: apache/gluten Issue #11766

用户直接反馈最简单的 `limit` 查询明显慢于 Vanilla Spark，说明一些用户的使用场景是：
- SQL 交互分析；
- 小样本调试；
- dashboard/BI 首次探查。

这类用户并不只看吞吐，也非常看重 **低延迟和小查询响应性**。

---

### 6.2 数据湖兼容性仍是采用门槛
- **来源**: #11513
- **链接**: apache/gluten Issue #11513

Iceberg 上 `input_file_name()` 返回空值，看似小问题，实则反映出用户正在真实使用 Gluten 处理：
- 数据湖表；
- 文件级审计；
- 元数据驱动分析。

这说明 Gluten 的用户群体已经不仅仅关注 benchmark，而是进入 **生产级湖仓使用**。

---

### 6.3 GPU 路径用户希望“更快且更稳”
- **来源**: #11779、#11770、#11785
- **链接**: apache/gluten Issue #11779 / PR #11770 / PR #11785

用户与贡献者都在持续推进 GPU shuffle reader 与 fallback 问题，说明 GPU 使用者当前最关心的不是单点新功能，而是：
- 读路径并行化；
- 减少锁竞争；
- 回退机制可用性。

---

## 7. 待处理积压

以下为值得维护者关注的长期未收敛问题或 PR。

### 7.1 Velox 上游未合并补丁积压
- **Issue**: #11585
- **链接**: apache/gluten Issue #11585

这是最典型的“技术债台账”。若长期堆积：
- fork 维护成本会持续上升；
- Gluten 与 Velox 版本对齐风险会增加；
- 新功能上线速度可能受 upstream 节奏制约。

建议维护者定期梳理优先级并推动上游协同。

---

### 7.2 Snappy 列式 shuffle 压缩支持仍停留在 WIP
- **PR**: #11454 `[WIP][VL] Add snappy to gluten columnar shuffle compression codec`
- **状态**: OPEN
- **创建时间**: 2026-01-20
- **链接**: apache/gluten PR #11454

该 PR 已存在较长时间仍未落地。  
考虑到 shuffle 压缩 codec 直接影响：
- CPU 使用率；
- 网络传输体积；
- 与现有生态的兼容性；

建议评估其阻塞点，决定是加速推进还是明确拆分范围。

---

### 7.3 ClickHouse 大版本升级 PR 需要重点关注风险
- **PR**: #11734 `[CH] Update Clickhouse Version (Branch_25.12_20260310)`
- **状态**: OPEN
- **链接**: apache/gluten PR #11734

这是今日仍在更新的重要 PR。升级 ClickHouse 分支通常涉及：
- 后端行为变化；
- 类型/函数兼容性；
- 执行器与 JNI 边界稳定性；
- 构建依赖与 CI 适配。

建议维护者加强回归验证，尤其关注与现有 Spark SQL 语义对齐。

---

### 7.4 approx_percentile 支持虽重要，但中间态兼容复杂
- **PR**: #11651
- **状态**: OPEN
- **链接**: apache/gluten PR #11651

该 PR 技术价值高，但由于 KLL/GK 中间态不兼容，属于容易引入隐藏边界问题的功能。  
建议在推进时补充：
- fallback 语义说明；
- 聚合中间态交换测试；
- 与 Spark 原生结果偏差容忍策略。

---

### 7.5 旧 PR 大量以 stale/closed 形式结束，提示评审带宽紧张
- **PR**: #11491、#11278、#11456
- **链接**: apache/gluten PR #11491 / #11278 / #11456

今日关闭的多条较老 PR 带有 `stale` 标签，说明部分方向可能因评审资源有限或方案调整而被搁置。  
这不会立即损害项目健康，但若持续出现，会影响外部贡献者积极性。建议：
- 更早给出设计反馈；
- 对长期 WIP 明确下一步；
- 区分“暂缓”与“放弃”。

---

## 8. 总结判断

Apache Gluten 今日表现出 **较高研发活跃度和明确的性能/兼容性导向**。Velox 方向仍是绝对主线，重点集中在 **GPU shuffle、动态过滤、SQL 函数补齐、Iceberg/Parquet 行为一致性**。  
同时，社区已开始暴露更贴近生产落地的问题：**小查询延迟、GPU 回退稳定性、数据湖元数据函数正确性、上游 Velox 补丁积压**。  
综合来看，项目处于 **功能快速演进、但稳定性与上游协同仍需强化** 的阶段。若能尽快收敛简单查询性能问题并加速关键 PR 合并，整体健康度将进一步提升。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时，Apache Arrow 维持了较高活跃度：**Issues 更新 29 条、PR 更新 19 条**，但**无新版本发布**。  
从变更结构看，今天的重点主要集中在 **C++/Parquet/Flight SQL/Packaging/Python 文档与兼容性修复**，偏向“工程可用性、构建链路、跨平台支持和开发者体验”而非大规模功能落地。  
已关闭/合并项不少，说明项目在**快速消化构建与集成类问题**；同时，新开的 Issue 也显示 **Flight SQL ODBC、Parquet 工具可用性、Python 内存与 schema 边界行为**仍是社区关注焦点。  
整体健康度判断：**活跃且稳健**，但仍有一定数量的**长期 stale 历史议题**持续被触发更新，积压治理仍值得关注。

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR 与推进点

#### 3.1 修复 vcpkg 多配置构建下 Release/Debug 库混链问题
- **PR**: #49543 `[C++] Improve arrow vcpkg port integration`  
  链接: apache/arrow PR #49543
- **关联 Issue**: #49499  
  链接: apache/arrow Issue #49499

**进展解读：**  
这是今天最有实际工程价值的修复之一。问题出现在 **Windows + vcpkg + multi-config generator（Visual Studio）+ static triplet** 场景下，Arrow Release 构建错误链接到 Snappy/Brotli 的 Debug 库，触发 **LNK2038 运行时配置不匹配**。  
该修复强化了 Arrow 在 **vcpkg 安装/消费模式下的依赖来源识别**，属于典型的**打包与分发链路稳定性修复**，会直接改善下游将 Arrow 集成进 C++ 分析系统、桌面数据工具或企业 Windows 构建体系的体验。

**影响面：**
- 提升 Arrow 作为嵌入式分析引擎组件的可集成性
- 降低 Windows 下静态链接和企业级 CMake 集成成本
- 对 OLAP/分析型系统的“部署稳定性”是正向信号

---

#### 3.2 修复 Flight SQL 示例构建缺失 gflags 依赖
- **PR**: #49542 `[C++] ARROW_FLIGHT_SQL=ON and ARROW_BUILD_EXAMPLES=ON need gflags`  
  链接: apache/arrow PR #49542
- **关联 Issue**: #49541  
  链接: apache/arrow Issue #49541

**进展解读：**  
该修复补足了 **开启 Flight SQL + examples** 时的构建依赖声明。虽然是小改动，但它直接关系到：
- Flight SQL 示例是否可编译
- 开发者是否能顺畅验证 Flight SQL 能力
- 教学/文档/示例代码是否真正“开箱即用”

这类修复对 **SQL over Arrow Flight** 的生态推广非常关键，因为很多用户会先从 examples 入手验证能力。

---

#### 3.3 Python 文档修复：editable 构建命令参数顺序错误
- **PR**: #49547 `[Docs][Python] Fix documented editable build commands where verbose flags order was wrong`  
  链接: apache/arrow PR #49547
- **关联 Issue**: #49546  
  链接: apache/arrow Issue #49546

**进展解读：**  
这是开发者体验层面的快速修正。错误的 `pip install --editable` 参数顺序会直接导致 PyArrow 本地开发环境搭建失败。  
虽然不属于查询引擎核心功能，但它降低了新贡献者参与门槛，利好 Python 生态维护效率。

---

#### 3.4 Python 扩展标量构造数组问题已关闭
- **PR**: #48746 `[Python] Construct UuidArray from list of UuidScalars`  
  链接: apache/arrow PR #48746
- **关联 Issue**: #48470  
  链接: apache/arrow Issue #48470

**进展解读：**  
该修复不仅覆盖 `UUID`，还扩展到 **所有 extension types** 的 scalar→array 构造路径：构造数组时先解包到 storage type。  
这属于 **Python 类型系统一致性与数据建模可用性修复**，对使用 Arrow 承载复杂逻辑类型的应用（例如向量数据库、特征存储、实验平台）有帮助。

---

## 4. 社区热点

### 4.1 Trusted Publishing for PyPI wheels
- **Issue**: #44733 `[CI][Python] Investigate trusted publishing for uploading wheels to PyPI`  
  链接: apache/arrow Issue #44733
- **热度**: 16 条评论

**热点分析：**  
这是今天评论最活跃的话题之一。核心诉求不是功能，而是 **供应链安全**：  
- PyPI trusted publishing
- 自动数字签名/attestation
- wheel 发布链路可信化

对 Arrow 这类基础数据基础设施项目来说，二进制分发安全越来越重要，尤其是：
- Python 用户高度依赖预编译 wheels
- 企业环境对软件制品来源审计要求更高
- 包管理供应链攻击已成为通用风险

**技术信号：**  
这说明 Arrow 社区正在从“能发布”走向“安全、可证明地发布”。

---

### 4.2 StructBuilder 缺失 UnsafeAppend，高性能构建诉求持续
- **Issue**: #45722 `[C++] StructBuilder should have UnsafeAppend methods`  
  链接: apache/arrow Issue #45722
- **热度**: 13 条评论

**热点分析：**  
该议题聚焦 C++ Builder API 的性能一致性。`StructBuilder` 缺失：
- `UnsafeAppend()`
- `UnsafeAppendNull()`
- `UnsafeAppendNulls()`

这反映了高性能 Arrow 数据写入场景中的真实需求：  
在批量构建 struct array 时，用户希望像其他 builder 一样使用低开销 append 路径，以减少边界检查与调用负担。

**技术诉求背后：**
- 提升复杂嵌套类型的写入吞吐
- 统一 builder API 语义
- 更适合执行引擎、表达式计算和流式摄取场景

---

### 4.3 C++ span 迁移与 C++20 演进仍在持续发酵
- **Issue**: #36612 `[C++] Ensure compatibility between std::span and arrow::util::span`（已关闭）  
  链接: apache/arrow Issue #36612
- **PR**: #49492 `[C++] Migrate to stdlib span`  
  链接: apache/arrow PR #49492
- **相关历史 PR**: #48414 `[C++] Require C++20`（已关闭）  
  链接: apache/arrow PR #48414

**热点分析：**  
Arrow C++ 生态仍在沿着 **标准库收敛 / C++20 现代化** 方向推进。  
`arrow::util::span` 向 `std::span` 迁移，本质上是：
- 降低自维护基础设施成本
- 对齐现代 C++ 工具链
- 为未来 API 简化、模板互操作、性能维护减负

**风险点：**
- 编译器基线提升
- 下游 ABI/API 适配
- 混合代码库中的过渡成本

---

### 4.4 Flight SQL ODBC 成为新焦点
- **PR**: #46099 `[C++] Arrow Flight SQL ODBC layer`  
  链接: apache/arrow PR #46099
- **Issue**: #49552 `[C++][FlightRPC][ODBC] Enable ODBC test build on Linux`  
  链接: apache/arrow Issue #49552
- **Issue**: #49548 `[C++][FlightRPC] Decouple Flight Serialize/Deserialize from gRPC transport`  
  链接: apache/arrow Issue #49548
- **PR**: #49549 对应实现  
  链接: apache/arrow PR #49549

**热点分析：**  
Flight SQL 正在从“协议能力”往“驱动层、可移植性、测试覆盖、传输解耦”演进。  
今天的信号很明确：
1. **ODBC 驱动层持续推进**
2. **Linux 测试构建准备启动**
3. **序列化能力尝试从 gRPC 传输实现中解耦**

这对于 Arrow 在 BI 工具接入、数据库互联和 SQL 数据通道场景中非常关键。

---

## 5. Bug 与稳定性

以下按严重程度与潜在影响排序：

### P1：Python/Parquet 批次迭代疑似内存泄漏
- **Issue**: #49474 `[Python] Memory Leak while iterating batches of pyarrow dataset`  
  链接: apache/arrow Issue #49474
- **状态**: OPEN
- **是否已有 fix PR**: 暂无明确关联 PR

**问题说明：**  
用户在 **HPC 集群** 上处理大型 hive-partitioned Parquet dataset，迭代与过滤 batch 时出现内存持续增长，最终导致 **OOM killed**。  
这类问题对分析型工作负载影响很大，因为 batch 迭代本应是 Arrow/Parquet 的核心节省内存路径之一。

**风险判断：**
- 影响 Python dataset 扫描场景
- 对大数据批处理、集群作业、资源受限环境尤为敏感
- 如属真实泄漏，优先级应较高

---

### P1：零行表 `Table.to_batches()` 丢失 schema 信息
- **Issue**: #49309 `[Python] Table.to_batches() loses schema information when table has zero rows`  
  链接: apache/arrow Issue #49309
- **状态**: OPEN
- **是否已有 fix PR**: 暂无

**问题说明：**  
零行表转换为 batches 返回空列表，导致 schema 信息丢失。  
这会影响：
- 空结果集的下游处理
- 流式接口一致性
- 依赖 schema 进行预分配/协议传输/表结构推断的应用

**风险判断：**
- 不一定导致崩溃，但可能造成**查询边界条件下的正确性问题**
- 对 ETL、API 服务和 schema-first 工作流影响明显

---

### P2：`parquet-scan` 无参数时未显示 usage，而是直接报 IO 错误
- **Issue**: #49539 `[C++][Parquet] parquet-scan doesn't show the usage info`  
  链接: apache/arrow Issue #49539
- **Fix PR**: #49540  
  链接: apache/arrow PR #49540

**问题说明：**  
CLI 参数校验错误导致工具在无参数调用时尝试打开空路径，输出误导性 IO 错误而非帮助信息。  
这是典型的可用性缺陷，但修复已经在路上，风险较低。

---

### P2：Flight SQL + Examples 缺失 gflags 依赖
- **Issue**: #49541  
  链接: apache/arrow Issue #49541
- **Fix PR**: #49542（已关闭/已处理）  
  链接: apache/arrow PR #49542

**问题说明：**  
构建配置遗漏依赖声明，影响 Flight SQL 示例的成功构建。  
目前已快速关闭处理，稳定性风险已基本解除。

---

### P2：vcpkg Release/Debug 库错链
- **Issue**: #49499  
  链接: apache/arrow Issue #49499
- **Fix PR**: #49543（已关闭/已处理）  
  链接: apache/arrow PR #49543

**问题说明：**  
这是构建稳定性问题，主要影响 Windows/vcpkg 用户。今天已得到修复。

---

### P3：Linux 上 ODBC 证书校验默认值行为
- **Issue**: #49551 `[C++][FlightRPC][ODBC] Enable DISABLE_CERTIFICATE_VERIFICATION default value on Linux`  
  链接: apache/arrow Issue #49551
- **状态**: CLOSED
- **备注**: 更像配置行为调整，安全语义需谨慎审视

**风险提示：**  
此类默认值问题涉及 TLS/证书校验策略，应避免为了易用性削弱默认安全边界。

---

## 6. 功能请求与路线图信号

### 6.1 Flight 序列化与 gRPC 传输解耦
- **Issue**: #49548  
  链接: apache/arrow Issue #49548
- **PR**: #49549  
  链接: apache/arrow PR #49549

**路线图信号：强**  
这是今天最值得关注的架构演进之一。当前 FlightData 的序列化/反序列化逻辑与 `grpc::ByteBuffer` / `grpc::Slice` 绑定，限制了：
- 传输层替换
- 非 gRPC 实现复用
- 更轻量或定制化协议适配

**若落地，潜在意义：**
- 为 Flight 提供更独立的核心协议层
- 有利于自定义 transport、嵌入式场景或跨语言桥接
- 可能影响未来 SQL over Flight 的实现灵活性

**注意：** PR 标明可能包含 **public API breaking changes**，需重点审查。

---

### 6.2 Flight SQL ODBC 驱动持续推进，Linux 构建测试纳入议程
- **PR**: #46099  
  链接: apache/arrow PR #46099
- **Issue**: #49552  
  链接: apache/arrow Issue #49552

**路线图信号：强**  
这表明 Arrow 正进一步补齐 **ODBC 接入能力**。  
对 OLAP/BI 生态而言，ODBC 是连接传统报表工具、企业数据集成平台的重要门槛。  
如果 Linux ODBC 测试构建逐步稳定，Flight SQL 的实际可用范围会明显扩大。

---

### 6.3 Parquet 写入侧新增 buffered bytes 可观测性
- **PR**: #49527 `[C++][Parquet] Add total_buffered_bytes() API for RowGroupWriter`  
  链接: apache/arrow PR #49527

**路线图信号：中强**  
该 API 可帮助调用方按缓冲字节数判断是否切换 row group。  
这对 Parquet 写入优化非常重要，因为 row group 大小会直接影响：
- 查询 scan 效率
- 压缩效果
- 内存峰值
- 下游谓词下推表现

这是面向**存储写入策略调优**的实用增强，比较像能进入后续版本的“高价值小功能”。

---

### 6.4 C++ `std::span` 迁移
- **PR**: #49492  
  链接: apache/arrow PR #49492

**路线图信号：中强**  
这是现代化清理的一部分，方向明确，纳入下一版本的概率较高。  
它不直接增加查询功能，但会提升 C++ 内部实现维护性与标准互操作性。

---

### 6.5 Ruby 增加 reader benchmark
- **Issue**: #49544  
  链接: apache/arrow Issue #49544
- **PR**: #49545  
  链接: apache/arrow PR #49545

**路线图信号：中**  
虽然是 Ruby 子生态，但“reader benchmark + mmap in streaming reader”说明社区正在加强对读取性能的基线度量。  
对跨语言 Arrow 实现质量治理有积极意义。

---

## 7. 用户反馈摘要

### 7.1 大规模 Parquet 数据集扫描的内存压力仍是现实痛点
- **Issue**: #49474  
  链接: apache/arrow Issue #49474

用户在 **HPC 集群 + hive 分区 Parquet + batch 过滤迭代** 场景下遭遇 OOM，说明即便采用 Arrow 推荐的分批处理模式，现实生产环境仍会暴露内存管理问题。  
这类反馈很有价值，因为它来自真实资源受限环境，而不是简单的本地 demo。

---

### 7.2 Python 空结果集的 schema 保真需求明确
- **Issue**: #49309  
  链接: apache/arrow Issue #49309

用户并不只是关心“有没有数据”，而是关心 **零行结果是否仍然保留结构语义**。  
这表明 Arrow 已被广泛用于：
- API/服务化接口
- 结构化管道编排
- 需要严格 schema 合约的系统集成

---

### 7.3 开发者越来越在意包发布可信性与供应链安全
- **Issue**: #44733  
  链接: apache/arrow Issue #44733

PyPI trusted publishing 的高讨论度说明，社区对“如何安全发布 wheels”已经上升为一项基础设施级诉求。  
这通常发生在项目成熟期，代表用户群中企业/安全敏感使用者占比提升。

---

### 7.4 构建系统与跨平台兼容性依然是高频摩擦点
- **Issue**: #49499  
  链接: apache/arrow Issue #49499
- **Issue**: #49541  
  链接: apache/arrow Issue #49541
- **PR**: #48539 `[Python][CI] Add support for building PyArrow library on Windows ARM64`  
  链接: apache/arrow PR #48539

来自 Windows、vcpkg、ARM64、examples 构建链路的反馈表明：  
Arrow 的“核心功能”已相对成熟，但“**多平台稳定交付**”仍是用户体验成败的关键环节。

---

## 8. 待处理积压

以下为值得维护者额外关注的长期未决议题/PR：

### 8.1 长期开放的 Flight SQL ODBC 主线 PR
- **PR**: #46099 `[C++] Arrow Flight SQL ODBC layer`  
  链接: apache/arrow PR #46099
- **创建时间**: 2025-04-10

**提醒原因：**  
这是一个跨组件、长期进行中的重要能力建设，对 SQL 互联生态意义很大。建议明确：
- Windows/macOS/Linux 的阶段目标
- ODBC 测试矩阵
- API/ABI 稳定策略
- 与 #49552、#49548 的依赖关系

---

### 8.2 Python 类型注解体系 PR 持续推进但尚未收敛
- **PR**: #48622 `[Python] Add internal type system stubs`  
  链接: apache/arrow PR #48622
- **创建时间**: 2025-12-22

**提醒原因：**  
PyArrow 类型标注对 IDE、静态检查、库开发者都很关键，但这类工作容易长期分拆、审查成本高。建议维护者加快拆分合并节奏。

---

### 8.3 VariableShapeTensor Python wrapper 仍未完成
- **PR**: #40354 `[Python] Add Python wrapper for VariableShapeTensor`  
  链接: apache/arrow PR #40354
- **创建时间**: 2024-03-04

**提醒原因：**  
该 PR 存续时间长，说明跨 C++/Python 封装边界的复杂度较高。若该特性仍具路线图价值，建议维护者明确 blocker；若优先级下降，也应及时同步状态，减少贡献者不确定性。

---

### 8.4 选择性执行内核支持仍在等待推进
- **PR**: #47377 `[C++][Compute] Support selective execution for kernels`  
  链接: apache/arrow PR #47377
- **创建时间**: 2025-08-20

**提醒原因：**  
这与表达式求值、special forms、执行优化高度相关，属于潜在的**查询引擎能力增强**。建议评估其是否纳入下一阶段 compute/exec roadmap。

---

### 8.5 多个 stale-warning 老 Issue 仍反复浮现
代表条目：
- #31298 `[C++] Provide a way to go from numeric to duration`  
  链接: apache/arrow Issue #31298
- #31338 `[Python][FlightRPC] Log uncaught exceptions by default`  
  链接: apache/arrow Issue #31338
- #20139 `[C++] Add a method that accepts a Substrait plan and returns a RecordBatchReader`  
  链接: apache/arrow Issue #20139
- #31296 `[C++] Add nightly test for static build with arrow_flight_static and arrow_bundled_dependencies`  
  链接: apache/arrow Issue #31296

**提醒原因：**  
这些议题横跨：
- 类型转换能力
- Flight 服务可观测性
- Substrait 接口易用性
- 静态构建测试覆盖

虽然单项热度不高，但从路线图看都不算无关紧要。建议进行一次系统性 backlog triage：  
**关闭过时项 / 提炼可执行子任务 / 标记 roadmap 优先级**。

---

## 结论

今天的 Arrow 动态显示，项目仍处于**高频迭代、工程稳固化优先**的节奏中。  
短期看，最重要的信号有三条：

1. **构建与打包稳定性持续改善**：vcpkg、gflags、Python docs 等问题被快速处理。  
2. **Flight SQL 生态在往生产可用方向推进**：ODBC、Linux 构建测试、gRPC 传输解耦都具有中长期价值。  
3. **Python/Parquet 边界行为与内存问题值得重点关注**：这类问题最容易影响真实分析负载的用户体验。

如果你愿意，我还可以继续把这份日报整理成更适合团队内部同步的两种格式之一：  
1. **面向管理层的 1 页简报版**  
2. **面向内核开发者的技术跟踪版**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*