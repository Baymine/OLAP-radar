# Apache Doris 生态日报 2026-03-21

> Issues: 2 | PRs: 139 | 覆盖项目: 10 个 | 生成时间: 2026-03-21 01:14 UTC

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

# Apache Doris 项目动态日报 · 2026-03-21

## 1. 今日速览

过去 24 小时 Apache Doris 保持**高活跃度**：Issues 更新 2 条、PR 更新 139 条，其中 63 条已合并或关闭，说明社区在功能推进、分支回移和稳定性修复上节奏很快。  
今天没有新版本发布，但从 PR 结构看，开发重点集中在 **云原生能力、外部元数据缓存、文件缓存、流式/动态计算、查询执行内存控制** 等方向。  
稳定性方面，新报 Bug 数量不多，但涉及 **DDL hang** 和 **Cloud 模式 FE Observer 节点入群失败**，都属于生产部署中较敏感的问题。  
总体判断：项目处于**高开发吞吐、分支维护活跃、面向 4.0/4.1/5.0 多线并进**的健康状态。

---

## 2. 项目进展

### 2.1 今日已合并/关闭的重要 PR

#### 1) Multi Catalog 外部元数据缓存框架继续统一
- PR: #60937 `[Refactor](Multi Catalog) Unify external meta cache framework`  
- 状态: CLOSED  
- 链接: https://github.com/apache/doris/pull/60937

**进展解读：**  
该 PR 持续推进外部 Catalog 元数据缓存框架统一，是 Doris 做湖仓/多 Catalog 查询时的关键基础设施。统一缓存框架意味着不同外部数据源的 metadata 管理方式将更加一致，有利于：
- 降低缓存失效与一致性问题复杂度
- 提升外表/外部 Catalog 查询性能
- 为后续连接器能力扩展打基础

这类重构通常不会直接体现为单点功能，但对 **Federation 查询稳定性和可维护性** 很重要。

---

#### 2) 云环境治理：禁止 cloud 模式下不安全的副本版本管理操作
- PR: #60875 `[fix](cloud) reject ADMIN SET REPLICA VERSION in cloud`  
- 状态: CLOSED  
- 链接: https://github.com/apache/doris/pull/60875

**关联回移：**
- #61586 branch-4.0  
  https://github.com/apache/doris/pull/61586
- #61587 branch-4.1  
  https://github.com/apache/doris/pull/61587

**进展解读：**  
该修复明确禁止在 cloud 模式下执行 `ADMIN SET REPLICA VERSION`。这表明 Doris 云架构下某些传统运维/纠偏命令已不再安全或语义不一致。  
这属于**运维安全边界收紧**，对防止元数据与云控制面状态错位很关键，说明 Doris 正在强化 cloud 模式与经典部署模式的行为隔离。

---

#### 3) SQL 聚合兼容性增强：`ndv` 补齐 `DECIMALV2` 支持
- PR: #61546 `[Bug](function) add ndv decimalv2 support`  
- 状态: CLOSED  
- 链接: https://github.com/apache/doris/pull/61546

**关联回移：**
- #61578 branch-4.1  
  https://github.com/apache/doris/pull/61578
- #61577 branch-4.0  
  https://github.com/apache/doris/pull/61577

**进展解读：**  
`ndv` 对 `DECIMALV2` 类型的支持补齐，属于典型的 **SQL 函数类型系统兼容性修复**。这能减少：
- 数值分析场景下类型受限问题
- SQL 从其他 OLAP/数仓系统迁移时的不兼容
- 回归测试中的类型覆盖缺口

这类修复虽小，但直接改善用户对 Doris SQL 完整性的感知。

---

#### 4) 云元数据检查点增强：保存 cloud tablet stats 到 image
- PR: #60705 `[fix](cloud) checkpoint save cloud tablet stats to image`  
- 状态: CLOSED  
- 链接: https://github.com/apache/doris/pull/60705

**进展解读：**  
该修复聚焦 FE checkpoint/image 中对 cloud tablet stats 的持久化，说明 Doris 在 cloud 模式下继续补齐 **状态恢复、容灾、重启恢复一致性** 相关能力。  
这类改动对降低 FE 重启后状态重建成本、减少统计信息丢失风险有积极意义。

---

#### 5) 编译链路清理：减少头文件依赖、缩短编译开销
- PR: #61565 `[cleanup](build) Replace #include runtime_profile.h with forward declaration in headers`  
  https://github.com/apache/doris/pull/61565
- PR: #61559 `[cleanup](build) Remove unnecessary #include query_context.h from 5 headers`  
  https://github.com/apache/doris/pull/61559
- PR: #61558 `[cleanup](build) Replace #include descriptors.h with forward declaration in 11 headers`  
  https://github.com/apache/doris/pull/61558

**进展解读：**  
今天还有一组构建系统清理 PR 被关闭，核心是通过前置声明和依赖裁剪降低 BE 代码的头文件耦合。  
对项目意义在于：
- 缩短增量编译时间
- 降低大型 C++ 模块联动编译成本
- 改善代码结构可维护性

这反映出项目在高频迭代同时，也持续进行工程治理。

---

## 3. 社区热点

> 由于提供的数据中 PR 评论数均未给出具体值，以下以“更新频繁、影响范围大、方向明确”的条目作为今日热点。

### 热点 1：全局单调递增 TSO 能力
- PR: #61199 `[feature](tso) Add global monotonically increasing Timestamp Oracle(TSO)`  
- 链接: https://github.com/apache/doris/pull/61199

**看点：**
- 引入全局单调递增的时间戳服务
- 指向事务、顺序一致性、多流写入排序等更强基础能力
- 带有 `dev/5.0.x` 标签，路线图信号强

**技术诉求分析：**  
这说明 Doris 正在为更复杂的事务控制、动态计算、流批协同或跨组件时序协调做底层铺垫。TSO 通常是构建更强一致性语义的重要基础设施。

---

### 热点 2：动态表 / Stream 基础元数据与 DDL 能力
- PR: #61382 `[feat](dynamic table) support stream part 1: stream meta data & basic DDL`  
- 链接: https://github.com/apache/doris/pull/61382

**看点：**
- 引入 `CREATE STREAM` 等基础 DDL
- 明确提到 “stream as basic building blocks for dynamic computing”
- 关联 #57921，明显属于中长期能力建设

**技术诉求分析：**  
这透露出 Doris 正从传统分析型数据库继续向**动态计算/连续计算**场景延伸。若后续补齐调度、状态管理、增量消费、容错语义，可能成为 Doris 在实时分析方向的重要演进。

---

### 热点 3：Scan 节点全局内存控制
- PR: #61271 `[feature](memory) Global mem control on scan nodes`  
- 链接: https://github.com/apache/doris/pull/61271

**技术诉求分析：**  
Scan 是查询执行中最容易成为内存热点的模块之一。全局内存控制意味着 Doris 正在从单算子/单查询限制，迈向更系统级的**执行资源治理**。  
这对多租户、高并发分析、外表扫描以及大查询场景都很关键。

---

### 热点 4：SegmentIterator 自适应批大小
- PR: #61535 `[feat](storage) Implement adaptive batch size for SegmentIterator`  
- 链接: https://github.com/apache/doris/pull/61535

**技术诉求分析：**  
该 PR 通过 EWMA 预测输出 block 大小，动态调整 chunk row count，使 block 接近目标字节大小。  
这是非常典型的**读路径细粒度性能优化**，潜在收益包括：
- 更稳定的扫描吞吐
- 更好的 CPU cache / vectorized execution 配合
- 降低 block 过大或过小造成的波动

对于存储引擎性能敏感用户，这是值得重点关注的优化。

---

### 热点 5：外部表文件缓存上下文持久化
- PR: #61518 `[feature](filecache) persist table/partition context for cache meta for external table`  
- 链接: https://github.com/apache/doris/pull/61518

**关联回移：**
- #61581 `branch-4.1:[enhancement](filecache) filecache meta persist PRs compilation`  
  https://github.com/apache/doris/pull/61581

**技术诉求分析：**  
外部表场景下，文件缓存条目难以稳定回溯到表/分区上下文。该功能说明 Doris 正在把 file cache 从“能用”推进到“可观测、可追踪、可治理”。  
这对于对象存储、湖格式查询成本控制非常重要。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1：DDL 命令 hang，影响建表/删表/物化视图频繁操作场景
- Issue: #51612 `[Bug] create table、drop table COMMAND hang`  
- 链接: https://github.com/apache/doris/issues/51612

**现象：**
- `create table` / `drop table` 客户端 hang
- 用户场景中存在大量 drop/create table/materialized-view 操作
- 版本：3.0.3

**影响评估：**
- 直接影响 DDL 可用性
- 对任务编排、批量建表删表、动态数仓场景风险较高
- 可能涉及 FE 元数据锁、DDL 队列或并发控制

**是否已有 fix PR：**
- 当前提供数据中**未见明确对应修复 PR**

---

### P1：Cloud 模式下 FE Observer 使用 Docker host network 无法加入集群
- Issue: #61536 `[Bug] FE Observer node fails to join cluster in cloud mode with Docker host network`  
- 链接: https://github.com/apache/doris/issues/61536

**现象：**
- Doris 4.0.3 / 4.0.4-slim
- Docker host network 部署 FE 集群时，Observer 节点在 cloud mode 无法正常加入

**影响评估：**
- 影响 cloud 模式部署与扩容
- 对容器化、混合环境、生产自动化部署非常敏感
- 可能涉及节点地址发布、端口识别、注册/握手逻辑

**是否已有 fix PR：**
- 当前提供数据中**未见直接关联 fix PR**

---

### P2：并行导出下 `delete_existing_files=true` 存在竞态删除
- PR: #61223 `[fix](outfile) handle delete_existing_files before parallel export`  
- 链接: https://github.com/apache/doris/pull/61223

**问题概述：**
- `select ... into outfile` 并行 writer 模式下，目录清理可能互相删除对方刚上传的文件

**稳定性意义：**
- 这是典型的并发语义 bug
- 影响导出结果完整性与可靠性
- 若合并，将显著降低并行导出场景的数据正确性风险

---

### P2：MaxCompute Connector 内存泄漏与大数据写入优化
- PR: #61245 `[fix](mc) fix memory leak and optimize large data write for MaxCompute connector`  
- 链接: https://github.com/apache/doris/pull/61245

**问题概述：**
- 修复 JNI Scanner/Writer 潜在内存泄漏
- 优化大数据量写入收尾逻辑

**稳定性意义：**
- 连接器层问题通常在长时间任务和大数据量同步时集中爆发
- 对 Doris 外部生态接入质量有正向影响

---

### P2：Iceberg Action 参数校验缺口修复
- PR: #61381 `[fix](iceberg) Fix execute action validation gaps`  
- 链接: https://github.com/apache/doris/pull/61381

**问题概述：**
- 修复 `rollback_to_timestamp` epoch millis 解析问题
- 拒绝不合法 `rewrite_data_files` 参数组合

**稳定性意义：**
- 这类问题容易导致“命令执行成功但结果不符合预期”
- 属于外表生态兼容性与运维正确性修复

---

## 5. 功能请求与路线图信号

### 5.1 高概率进入后续版本的重要能力

#### 1) 全局 TSO
- PR: #61199  
- 链接: https://github.com/apache/doris/pull/61199

**判断：高概率纳入后续大版本（尤其 5.0 线）**  
TSO 是基础设施级能力，通常不会是一次性实验性改动。既然已进入 `dev/5.0.x`，说明其战略优先级较高。

---

#### 2) 动态表 / Stream 能力
- PR: #61382  
- 链接: https://github.com/apache/doris/pull/61382

**判断：高概率作为中长期路线图重点**  
从 “part 1” 和基础 DDL 设计看，这是分阶段推进的新能力，不太像零散功能点，更像一条完整产品线的起点。

---

#### 3) 扫描节点全局内存控制
- PR: #61271  
- 链接: https://github.com/apache/doris/pull/61271

**判断：很可能纳入后续稳定版本**  
该能力贴近生产资源治理，是企业用户普遍诉求，尤其适用于高并发分析和资源隔离场景。

---

#### 4) File Cache 元数据上下文持久化
- PR: #61518  
- 链接: https://github.com/apache/doris/pull/61518

**判断：会持续演进并逐步进入稳定分支**  
已有 4.1 回移编译整合 PR（#61581），说明维护者认为其价值已足够高，值得在稳定分支推进。

---

### 5.2 SQL / 函数生态扩展信号

#### 1) `array_combinations` 函数
- PR: #60192 `[Feature](function) support function array_combinations`  
- 链接: https://github.com/apache/doris/pull/60192

**信号：**
- Doris 继续扩展复杂类型与数组函数能力
- 适配更复杂的半结构化分析需求

---

#### 2) `window funnel v2`
- PR: #61566 `support window funnel v2`  
- 链接: https://github.com/apache/doris/pull/61566

**信号：**
- 面向增长分析、行为路径分析等典型 OLAP 场景
- 若推进顺利，会增强 Doris 在用户行为分析领域的竞争力

---

#### 3) Streaming Job 对 PostgreSQL 类型支持增强
- PR: #61551 `branch-4.1: add macaddr8/xml/hstore and array element type for PostgreSQL`  
- 链接: https://github.com/apache/doris/pull/61551

**信号：**
- Streaming/CDC 链路正继续补齐源端数据库类型兼容性
- 对异构同步用户有直接价值

---

## 6. 用户反馈摘要

### 1) 高频 DDL 场景下可用性仍是用户痛点
- Issue: #51612  
- 链接: https://github.com/apache/doris/issues/51612

用户明确反馈，在存在大量 drop/create table/materialized-view 操作时客户端会 hang。  
这表明 Doris 在某些**高频元数据变更**场景下，仍可能存在锁争用、串行化瓶颈或状态机阻塞问题。  
对自动建模、任务平台驱动建表、动态物化视图管理的用户，这属于高优先级痛点。

---

### 2) Cloud 模式容器化部署细节仍不够“开箱即用”
- Issue: #61536  
- 链接: https://github.com/apache/doris/issues/61536

Docker host network 下 FE Observer 节点无法加入集群，反映出 Doris cloud mode 在**容器网络模型、节点自识别与注册机制**方面还有兼容性边角。  
这类问题对企业用户影响很大，因为实际生产往往依赖容器编排和自动扩缩容。

---

### 3) 外部生态接入用户关注稳定性与大数据量行为
- PR: #61245 MaxCompute connector fix  
- 链接: https://github.com/apache/doris/pull/61245
- PR: #60779 dbt-doris docs generate/serve 修复  
- 链接: https://github.com/apache/doris/pull/60779

从连接器和工具链 PR 可见，用户不仅关心 Doris 内核性能，也关心：
- 连接器长跑任务是否泄漏内存
- dbt 等生态工具是否能正常工作
- 外部 Catalog / Connector 的兼容性是否稳定

这说明 Doris 正越来越多地被放入完整数据平台链路中，而不只是单一查询引擎。

---

## 7. 待处理积压

### 1) dbt-doris 适配器问题修复 PR 仍未完成
- PR: #60779 `[fix](dbt-doris): the commands dbt docs generate/serve fail due to wrong function signature`  
- 链接: https://github.com/apache/doris/pull/60779

**提醒：**
- 创建于 2026-02-17，仍为 OPEN
- 影响 dbt 文档生成/服务命令
- 对生态工具链用户有较直接影响

**建议关注原因：**
- 虽不属于核心引擎，但对开发者体验和平台集成价值较高

---

### 2) `array_combinations` 函数支持 PR 持续未落地
- PR: #60192 `[Feature](function) support function array_combinations`  
- 链接: https://github.com/apache/doris/pull/60192

**提醒：**
- 创建于 2026-01-23，仍 OPEN
- 函数能力属于用户可见功能，拖延会影响 SQL 体验预期

---

### 3) FE DDL hang 问题需尽快明确归因
- Issue: #51612  
- 链接: https://github.com/apache/doris/issues/51612

**提醒：**
- 创建较早，最近仍在更新
- 已有 6 条评论，说明用户仍在持续跟踪
- 若无法短期修复，至少应补充规避建议、日志抓取方法和影响边界

---

### 4) CPU Metrics 增强 PR 处于待推进状态
- PR: #60777 `[Enhancement](metrics) Added CPU usage metrics`  
- 链接: https://github.com/apache/doris/pull/60777

**提醒：**
- 创建于 2026-02-16，仍 OPEN
- 可观测性是大规模部署的重要基础
- 与 cloud/多租户/性能诊断需求高度相关，建议优先推进

---

## 8. 结论

今天的 Apache Doris 呈现出非常鲜明的几个趋势：

1. **多版本并行维护成熟**：4.0、4.1、5.0 分支同时推进，且有系统性的 cherry-pick。  
2. **云原生与外部生态持续加强**：cloud 模式限制收紧、checkpoint 增强、file cache 元数据完善、MaxCompute/dbt/Iceberg 等生态修复同步发生。  
3. **执行引擎与资源治理进入更深水区**：全局 scan 内存控制、自适应 batch size、TSO、stream/dynamic table 都不是边缘功能，而是面向下一阶段能力升级的信号。  
4. **当前最值得关注的风险点**仍是生产可用性问题，尤其是 **DDL hang** 和 **Cloud 模式下 FE Observer 入群失败**。

整体来看，Apache Doris 今日项目健康度为：**高活跃、方向清晰、工程治理良好，但仍需加快处理高影响部署与元数据稳定性问题。**

--- 

如需，我也可以继续把这份日报整理成：
1. **适合飞书/企业微信发布的精简版**，或  
2. **按“内核 / 存储 / 生态 / 云原生”四条主线重组的技术版周报模板**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**日期：2026-03-21**

---

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储开源生态整体呈现出 **“高活跃、重稳定、强生态集成”** 的特征。  
头部项目中，**ClickHouse、Apache Doris、StarRocks** 维持极高 PR 吞吐，说明查询引擎、云原生能力和湖仓连接器仍在快速演进；**DuckDB、Arrow、Iceberg、Delta** 则更明显体现出“功能扩展 + 回归修复并行”的节奏。  
从议题分布看，行业共同焦点已不再只是单点性能，而是转向 **查询正确性、资源治理、流式/CDC 一致性、对象存储/外部表兼容性、开发者体验与可观测性**。  
这意味着分析引擎竞争正在从“谁更快”升级为“谁在复杂生产环境中更稳、更易集成、更可治理”。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 今日重点方向 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 2 | 139 | 无 | Cloud、外部元数据缓存、File Cache、TSO、动态表、Scan 内存控制 | **高活跃，方向清晰，稳定性问题需加速处理** |
| **ClickHouse** | 58 | 283 | **2 个新版本**（v26.1.6.6-stable, v25.8.20.4-lts） | 查询稳定性、内存控制、SQL 兼容、Parquet/Arrow、测试体系 | **极高活跃，高响应，但回归与 flaky 问题密集** |
| **DuckDB** | 20 | 35 | 无 | 1.5.0 回归修复、CLI/JSON 正确性、AST/执行器重构、Parquet | **高活跃，修复快，发布后回归窗口明显** |
| **StarRocks** | 4 | 137 | 无 | MV 刷新/改写、Iceberg/Paimon 兼容、执行正确性、开发体验 | **高活跃，多分支维护强，外表/MV 边界仍在打磨** |
| **Apache Iceberg** | 15 | 50 | 无 | Flink/Kafka Connect 一致性、REST Catalog、Spark Z-order、V4 manifest | **活跃且偏修复驱动，连接器正确性是重点** |
| **Delta Lake** | 2 | 38 | 无 | CDC、Kernel-Spark、UC Commit Metrics、DSv2、Streaming 正确性 | **中高活跃，版本切换明确，流式正确性需重点关注** |
| **Databend** | 2 | 10 | 无 | SQL 重写/绑定、Fuse 存储抽象、递归视图崩溃修复 | **中等偏上活跃，核心内核持续打磨** |
| **Velox** | 4 | 50 | 无 | cudf/GPU、运行时统计、Hive/Parquet、接口兼容 | **高活跃，GPU 主线强，但兼容与正确性风险需盯紧** |
| **Apache Gluten** | 7 | 20 | 无 | Spark 4.x 测试、Velox 后端、Parquet/Variant、短查询性能 | **较高活跃，功能扩展与兼容性修复并行** |
| **Apache Arrow** | 25 | 18 | 无 | Python 构建与开发体验、Parquet/C++ 边界修复、ODBC 扩展 | **高活跃，偏质量巩固与生态补强** |

### 活跃度简评
- **第一梯队（超高活跃）**：ClickHouse、Apache Doris、StarRocks  
- **第二梯队（高活跃）**：DuckDB、Iceberg、Velox、Arrow  
- **第三梯队（定向推进）**：Delta Lake、Gluten、Databend  

---

## 3. Apache Doris 在生态中的定位

### 3.1 相对优势
与同类 OLAP 引擎相比，**Apache Doris 当前最突出的优势在于“多线并进能力”**：
- 一边在做 **传统 MPP 分析引擎** 的执行与资源治理优化，如 Scan 全局内存控制、自适应 batch；
- 一边在强化 **云原生与对象存储场景**，如 Cloud 模式行为约束、checkpoint 持久化、file cache 元数据上下文；
- 同时又在推进 **湖仓/多 Catalog 查询** 和 **动态计算能力**，如外部元数据缓存统一、TSO、动态表/stream。

这意味着 Doris 不再只是“高性能列式分析数据库”，而是在向 **云原生湖仓分析平台 + 实时/动态计算底座** 演进。

### 3.2 与同类路线差异

#### 对比 ClickHouse
- **ClickHouse** 更强在极致执行性能、SQL 扩展速度、成熟稳定版节奏和超大社区吞吐。
- **Doris** 更强调：
  - Cloud 模式与传统模式的分化治理
  - 外部 Catalog / File Cache / 多源联邦能力
  - 面向流批协同和动态表的新能力铺垫
- 简言之：  
  **ClickHouse 更像高性能通用分析引擎王者**，  
  **Doris 更像一体化数仓/湖仓分析平台在持续补齐下一代能力。**

#### 对比 StarRocks
- 两者都在 **湖仓连接器、外表 MV、云原生、执行引擎优化** 上高度相似。
- **StarRocks** 今日更聚焦在 **MV 刷新正确性、透明改写、Iceberg/Paimon 外部表语义**。
- **Doris** 则更偏向：
  - Cloud 架构边界收紧
  - 元数据缓存统一
  - TSO / dynamic table 这类更基础设施级演进
- 判断上，**StarRocks 当前更像在强化“湖仓查询与 MV 产品化”**，**Doris 更像在同步做平台底层升级**。

#### 对比 DuckDB
- **DuckDB** 是嵌入式/单机分析生态核心，强调本地分析、Parquet/JSON、开发者体验。
- **Doris** 是分布式 OLAP / 云数仓方向，重点完全不同。
- 二者不构成直接替代，更像：
  - DuckDB：个人分析 / 嵌入式 / ETL 中间层
  - Doris：企业级分布式实时分析与数仓服务

### 3.3 社区规模对比
若仅看今日开发吞吐：
- Doris：**139 PR**
- StarRocks：**137 PR**
- ClickHouse：**283 PR**

可见 Doris 已稳居 **开源 OLAP 核心第一梯队社区**。  
虽然绝对活跃度略低于 ClickHouse，但与 StarRocks 接近，且在多版本并行维护、分支回补、云原生与湖仓方向上展现出较成熟的工程组织能力。

### 3.4 当前短板
Doris 今日最明显的短板不是方向，而是 **高影响稳定性问题收敛速度**：
- DDL hang
- Cloud 模式 FE Observer 节点入群失败

这类问题虽然数量不多，但都直接落在 **生产可用性与部署稳定性** 上，优先级高于多数新特性。

---

## 4. 共同关注的技术方向

下面汇总多个项目共同涌现的需求与信号。

| 技术方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| **查询正确性优先** | Doris、ClickHouse、DuckDB、StarRocks、Velox、Gluten、Arrow | JOIN 错误结果、AST 重建异常、UNNEST/ASOF JOIN 语义错误、JSON path 结果错误、空结果 schema 丢失 |
| **内存与资源治理** | Doris、ClickHouse、Velox、Gluten | Scan 全局内存控制、UNION ALL 降峰值、线程池调度优化、GPU/barrier 同步、短查询执行开销控制 |
| **湖仓 / 外部表 / 连接器稳定性** | Doris、StarRocks、Iceberg、Delta、Arrow | 外部元数据缓存、Iceberg MV 刷新正确性、Kafka Connect/Flink sink 一致性、REST Catalog、对象存储访问 |
| **流式 / CDC / 恢复语义** | Doris、Iceberg、Delta | TSO、动态表/stream、Flink sink 恢复重复写、Kafka Connect 提交边界、Spark MicroBatch CDC、Streaming 数据丢失 |
| **对象存储与云原生部署** | Doris、ClickHouse、StarRocks、Iceberg、Arrow | Cloud 模式治理、异步删除 blob 语义、Livy/Spark Load 云原生化、GCS 凭证刷新、Azure Blob Filesystem |
| **SQL 兼容性增强** | ClickHouse、DuckDB、Doris、Gluten、Arrow | VALUES、TIME ZONE、DECIMAL/函数补齐、TIMESTAMP_NTZ、复杂类型/Variant、日期时间解析清晰化 |
| **可观测性与诊断能力** | Doris、StarRocks、Delta、Velox、Arrow | CPU/RPC 指标、commit metrics、runtime stats、query log 统计修复、开发者构建与 CI 透明化 |
| **测试基础设施与回归治理** | ClickHouse、DuckDB、Gluten、Arrow、Velox | flaky/fuzz、测试并发控制、Spark 4.x 误测修正、构建 CI 修复、下游兼容回滚 |

### 核心结论
当前行业共同主线已经非常明确：  
**性能优化仍在继续，但“正确性 + 恢复语义 + 可观测性 + 外部生态兼容”已成为更高优先级。**

---

## 5. 差异化定位分析

### 5.1 存储格式与数据生态定位

| 项目 | 主要定位 |
|---|---|
| **Apache Doris / StarRocks / ClickHouse / Databend** | 自有分析引擎 + 外部表/湖仓连接能力并进 |
| **DuckDB** | 本地/嵌入式分析引擎，强 Parquet/JSON/文件处理能力 |
| **Iceberg / Delta Lake** | 表格式 / 元数据层标准，面向湖仓事务与跨引擎互操作 |
| **Arrow** | 列式内存格式 + 多语言数据交换层 + 部分存储/连接能力 |
| **Velox / Gluten** | 执行引擎 / 加速层，不是完整数据库，服务于上层系统 |

### 5.2 查询引擎设计差异

| 项目 | 引擎设计特点 |
|---|---|
| **ClickHouse** | 高性能列式 OLAP，一体化引擎成熟，强执行优化与大规模 SQL 生态 |
| **Doris** | MPP + 云原生 + 湖仓联邦 + 动态计算能力铺垫 |
| **StarRocks** | MPP + 湖仓查询 + MV rewrite 与外表刷新能力突出 |
| **DuckDB** | 单机向量化嵌入式引擎，强调本地分析与易用性 |
| **Databend** | 云原生分析数据库，持续打磨存储与优化器抽象 |
| **Velox** | 通用执行引擎，服务 Presto/Gluten 等上层系统 |
| **Gluten** | Spark 列式加速层，依赖 Velox/后端执行引擎 |
| **Arrow** | 不是 SQL 数据库，更偏数据表示、传输、连接和计算基础设施 |

### 5.3 目标负载类型差异

| 项目 | 更适合的负载 |
|---|---|
| **Doris / StarRocks** | 企业级实时分析、数仓、外表湖仓分析、近实时聚合 |
| **ClickHouse** | 超高吞吐 OLAP、日志/时序/行为分析、复杂高并发查询 |
| **DuckDB** | 本地探索分析、ETL 中间处理、嵌入式分析计算 |
| **Iceberg / Delta** | 数据湖表管理、事务性批流读写、跨引擎共享 |
| **Arrow** | 跨系统交换、内存计算、驱动/连接层 |
| **Velox / Gluten** | 上层引擎加速、Spark/Presto 系统内列式执行优化 |

### 5.4 SQL 兼容性差异
- **ClickHouse**：正在显著补齐 SQL 标准兼容层，尤其 VALUES、时区/会话语义。  
- **Doris / StarRocks**：更关注企业分析常用函数、复杂类型、外部系统兼容与 MV/外表语义。  
- **DuckDB**：强调“看起来像现代分析 SQL 工具”，兼容性与开发体验并重。  
- **Gluten / Velox**：SQL 兼容性本质上取决于其所服务的 Spark/Hive 语义还原程度。  
- **Arrow / Iceberg / Delta**：更多是围绕接口、协议、类型系统和多引擎语义对齐，而不是纯 SQL 引擎竞争。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：超大社区、快速迭代
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特征：
- PR 吞吐高
- 多分支维护成熟
- 新特性、修复、回补并行
- 社区体量与企业采用度都较高

#### 第二层：高质量迭代、功能与稳定性并进
- **DuckDB**
- **Apache Iceberg**
- **Apache Arrow**
- **Velox**

特征：
- 不一定 PR 数最多，但议题含金量高
- 边界语义、连接器正确性、生态兼容是主轴
- 对开发者体验和 CI 稳定性投入明显

#### 第三层：方向明确、定向突破
- **Delta Lake**
- **Apache Gluten**
- **Databend**

特征：
- 活跃度略低于头部，但方向聚焦
- 往往围绕少数主线密集推进
- 适合持续观察中长期能力收敛

### 6.2 成熟度判断

#### 处于“快速迭代阶段”的项目
- **Doris**：TSO、动态表、Cloud 与多 Catalog 基础设施仍在快速扩展
- **StarRocks**：湖仓 MV 与外表刷新语义持续快速打磨
- **Velox / Gluten**：GPU、Spark 4.x、复杂类型兼容性仍属强演进期
- **Delta Lake**：4.2.0-SNAPSHOT、CDC 与 UC Metrics 正处推进窗口

#### 处于“质量巩固阶段”的项目
- **ClickHouse**：虽仍高速迭代，但 stable/LTS 发布与 backport 节奏已相当成熟
- **DuckDB**：1.5.0 后明显进入回归收敛窗口
- **Arrow**：偏开发者体验、构建稳定性、接口一致性治理
- **Iceberg**：当前更明显是连接器正确性和恢复语义巩固
- **Databend**：在核心内核与 SQL/存储抽象上稳步打磨

---

## 7. 值得关注的趋势信号

### 趋势 1：分析引擎竞争焦点从“性能”转向“生产正确性”
共同信号：
- ClickHouse JOIN / 表达式求值 / shutdown deadlock
- DuckDB ASOF JOIN、UNNEST、Parquet 精度
- StarRocks join wrong results / MV invalid plan
- Velox JSON wildcard 错误
- Doris DDL hang / cloud 部署问题

**参考价值**：  
对数据工程师和架构师而言，选型时不能只看 benchmark，必须把 **边界 SQL 正确性、恢复语义和异常场景行为** 纳入 PoC。

---

### 趋势 2：湖仓生态正在进入“第二阶段”——从接入到精细治理
共同信号：
- Doris 外部 meta cache、file cache context persist
- StarRocks Iceberg MV 精准刷新与 connector 能力矩阵
- Iceberg REST Catalog、Kafka Connect/Flink 恢复一致性
- Delta CDC/Kernel-Spark/Commit Metrics
- Arrow 多云对象存储与 ODBC 扩展

**参考价值**：  
未来真正有竞争力的系统，不只是“支持 Iceberg/Delta/Hive”，而是要在：
- 元数据刷新粒度
- cache 可治理性
- commit/recovery 正确性
- explainability  
上做深。

---

### 趋势 3：流式、CDC、动态计算正在成为 OLAP 主战场之一
共同信号：
- Doris TSO、dynamic table / stream
- Iceberg Kafka Connect / Flink sink 一致性
- Delta SparkMicroBatch CDC、Streaming data loss 回归
- StarRocks Spark Load 云原生化需求
- Gluten Kafka read support

**参考价值**：  
OLAP 引擎正逐步从“离线查询终点”转向“实时增量处理链路中的核心节点”。  
架构设计上，应更关注：
- 幂等性
- checkpoint/commit 边界
- 多流时序协调
- 增量消费语义

---

### 趋势 4：对象存储与云原生已不再是附加能力，而是默认前提
共同信号：
- Doris cloud 模式治理
- ClickHouse object storage 删除语义争议
- StarRocks Livy Batch REST API 需求
- Iceberg GCS 凭证刷新
- Arrow Azure Blob filesystem
- Databend/Delta/Velox 也都在强化云对象存储路径

**参考价值**：  
对于新建设的数据平台，必须默认：
- 底层存储是对象存储
- 计算与元数据控制面解耦
- 删除、缓存、恢复、凭证刷新都要考虑云环境语义

---

### 趋势 5：可观测性正在成为核心产品能力
共同信号：
- Doris CPU Metrics、file cache 上下文
- StarRocks Load Profile 新指标
- Delta UC Commit Metrics
- Velox runtime stats
- ClickHouse query log / 资源调度可观测性
- Arrow CI/构建链路透明化

**参考价值**：  
未来引擎优劣不仅取决于 SQL 能不能执行，还取决于：
- 性能是否容易定位
- 资源瓶颈是否能解释
- 连接器/流任务问题是否能审计

---

## 结论

从 2026-03-21 的社区动态看，OLAP / 分析型存储开源生态正进入一个更成熟的竞争阶段：

1. **ClickHouse、Doris、StarRocks** 构成分布式分析引擎第一梯队；  
2. **DuckDB、Arrow、Iceberg、Delta** 分别在本地分析、数据交换、湖仓元数据和事务表格式层面持续强化；  
3. **Velox / Gluten** 正成为执行加速与异构后端的重要技术栈；  
4. 行业共同主线已从“快”升级为“稳、准、可治理、可集成”。

对技术决策者而言，**Apache Doris 当前的独特价值** 在于：  
它正处于一个兼具 **高社区活跃度、云原生/湖仓一体化路线、动态计算前瞻布局** 的关键窗口期。  
但若要进一步稳固生态地位，接下来最关键的不是再堆更多特性，而是 **优先压缩高影响生产问题，尤其是元数据与 cloud 部署稳定性风险**。

如果你愿意，我下一步可以把这份报告继续整理成以下任一版本：
1. **管理层 1 页摘要版**
2. **Doris vs ClickHouse vs StarRocks 三强对比版**
3. **面向架构选型的评分矩阵版**
4. **适合飞书/企业微信发布的精简图表版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-21）

## 1. 今日速览

过去 24 小时，ClickHouse 项目维持了**极高活跃度**：Issues 更新 58 条，PR 更新 283 条，并发布了 2 个新版本，说明项目同时在推进主线开发、稳定分支维护和缺陷回补。  
从议题分布看，今天的重点集中在**查询执行稳定性、内存控制、SQL 兼容性、Parquet/Arrow 生态兼容，以及测试基础设施强化**。  
PR 侧明显出现了较多**性能优化与回归修复**，尤其是线程池调度、UNION ALL 内存峰值、MergeTree 读取路径和 text index backport，反映维护者正持续压缩线上风险。  
整体健康度判断为：**高活跃、高响应，但回归与 flaky/fuzz 类问题仍然较密集，说明项目在快速演进阶段对测试与稳定性的投入仍是主旋律。**

---

## 2. 版本发布

过去 24 小时发布了 2 个版本：

### 2.1 v26.1.6.6-stable
- Release: `v26.1.6.6-stable`
- 链接: ClickHouse/ClickHouse Release `v26.1.6.6-stable`

### 2.2 v25.8.20.4-lts
- Release: `v25.8.20.4-lts`
- 链接: ClickHouse/ClickHouse Release `v25.8.20.4-lts`

### 发布解读

从版本命名看，今天发布覆盖了：
- **26.1 stable**：面向较新稳定线用户
- **25.8 LTS**：面向生产长期支持用户

虽然当前数据未给出完整 changelog，但结合当日 PR/Issue 动向，可以推断近期稳定分支重点很可能包括：

1. **关键 bug 回补**
   - text index 与 `startsWith` / `endsWith` 的兼容修复已出现多分支回补动作  
   - 相关 PR：#100245、#100246、#100247、#100248、#100250  
   - 这类批量 backport 往往说明问题具备较强用户可见性或线上影响面。

2. **查询正确性与崩溃修复**
   - NATURAL JOIN AST 重建错误已有修复 PR
   - ColumnVariant filter 逻辑错误被标记为 critical bugfix 且要求 backport

3. **稳定性优先于激进特性**
   - 当前信号更偏向“修复、回补、压实稳定性”，而不是在稳定版引入较大行为变化。

### 破坏性变更 / 迁移注意事项

尽管 release 详情未完整展示，但今日 issue/PR 已透露出几个值得生产用户重点核查的迁移点：

#### A. 26.2 之后对象存储删除语义变化
- Issue: #99996  
- 链接: ClickHouse/ClickHouse Issue #99996
- 用户反馈指出：**自 26.2 起，`DROP TABLE` 对 object disk/blob storage 的删除变为异步**，这对依赖“同步释放云端存储空间”的用户是显著行为变化。
- 迁移建议：
  - 如果业务流程依赖 `DROP TABLE ... SYNC` 后立即确认底层对象已删除，需要重新验证。
  - 对云存储成本敏感场景，应观察是否需要新增设置或运维补偿流程。
  - 关注该 issue 是否会催生新参数或回滚策略。

#### B. 25.x 存在若干可见回归信号
- `clickhouse-client` 退出挂起：#99694  
- `system.parts` 元数据锁等待挂起：#99547  
这说明从旧版升级到 25.x 时，**权限检查路径、system 表访问行为、metadata lock 处理**都需要重点回归测试。

#### C. Parquet 旧读写器可能逐步退出
- Issue: #100126  
- 链接: ClickHouse/ClickHouse Issue #100126
- 维护者提出移除旧 Parquet writer/reader 开关：
  - `output_format_parquet_use_custom_encoder = 0`
  - `input_format_parquet_use_native_reader_v3 = 0`
- 迁移建议：
  - 若你的生产作业仍显式依赖这些 legacy setting，应尽快在测试环境验证默认新实现。
  - 特别关注 UUID、logical type、跨引擎兼容性。

---

## 3. 项目进展

结合今日关闭/推进中的重要 PR，可归纳为以下几个方向：

### 3.1 查询执行与内存控制

#### 限制 `UNION ALL` 同时活跃流数量，降低峰值内存
- PR: #100176  
- 链接: ClickHouse/ClickHouse PR #100176
- 价值：
  - 针对多分支 `UNION ALL` 查询会同时打开大量 read buffers 的问题进行治理。
  - 对宽表、上百分支 SQL 的场景，能显著降低峰值内存。
- 技术判断：
  - 这是典型的执行管线资源调度优化，属于**直接影响线上稳定性和大查询可执行性**的改进。

#### 线程池改用 LIFO 调度，降低内存碎片
- PR: #100177  
- 链接: ClickHouse/ClickHouse PR #100177
- 价值：
  - 通过让最近空闲线程优先被唤醒，减少工作在线程间扩散。
  - 有助于降低 jemalloc 每线程缓存导致的碎片和 RSS 膨胀。
- 技术判断：
  - 对高并发分析负载、后台 merge / mutation / query mixed workload 可能有普适收益。

#### 自动启用 MergeTree 读取的 uncompressed cache
- PR: #99639  
- 链接: ClickHouse/ClickHouse PR #99639
- 价值：
  - 在适配条件下自动启用非压缩缓存，减少重复解压成本。
- 技术判断：
  - 面向读取热点明显、反复扫描局部数据集的查询，预计能提升尾延迟表现。

---

### 3.2 MergeTree / 存储路径优化

#### `ORDER BY LIMIT` 在分区表上的 parts 剪枝优化
- PR: #99533  
- 链接: ClickHouse/ClickHouse PR #99533
- 价值：
  - 当 `optimize_read_in_order=1` 时，在 partitioned table 上进一步减少无关 part 读取。
- 技术判断：
  - 对时序类、按分区+排序键组织的数据尤其有价值，能减少 I/O 和 planning 成本。

#### 减少 String `.size` 子列枚举中的不必要计算
- PR: #99941  
- 链接: ClickHouse/ClickHouse PR #99941
- 价值：
  - 属于子列系统与列裁剪路径的细粒度优化。
- 技术判断：
  - 虽然是局部优化，但说明维护者仍在持续打磨**subcolumns 相关元数据与执行开销**。

#### 新的 Commit Order Projection Index
- PR: #99004  
- 链接: ClickHouse/ClickHouse PR #99004
- 价值：
  - 引入新的 projection index 类型。
- 技术判断：
  - 若落地，可能增强某类按写入/提交顺序组织的数据访问效率，属于**更偏引擎能力扩展**的中期特性。

---

### 3.3 SQL 兼容性与语法能力

#### 支持 SQL 标准 `VALUES` 作为 table expression
- PR: #100143  
- 链接: ClickHouse/ClickHouse PR #100143
- 价值：
  - 支持类似 `SELECT * FROM (VALUES (...), (...)) AS t(...)`
  - 复用现有 `values` table function 能力实现。
- 技术判断：
  - 这是很强的 SQL 兼容性增强，对 BI 工具、ORM、中间层适配有直接帮助。
  - 很可能进入后续正式版本。

#### 修复 `NATURAL JOIN` 在无公共列时重建出非法 `NATURAL CROSS JOIN`
- PR: #100223  
- 对应 Issue: #100220  
- 链接:
  - ClickHouse/ClickHouse PR #100223
  - ClickHouse/ClickHouse Issue #100220
- 价值：
  - 修复 analyzer/AST 重建不一致问题，属于**查询语义正确性修复**。
- 技术判断：
  - 说明新 analyzer 在边角 SQL 语义上仍有收敛空间。

#### SQL 标准时区/会话特性支持讨论
- Issue: #99612  
- 链接: ClickHouse/ClickHouse Issue #99612
- 价值：
  - `SET TIME ZONE INTERVAL ...`
  - `SET SESSION CHARACTERISTICS`
- 技术判断：
  - 对 PostgreSQL 风格客户端、SQL 标准驱动工具兼容非常关键。
  - 若结合 `VALUES` 语法 PR 来看，ClickHouse 正在继续补齐**上层 SQL 生态兼容层**。

---

### 3.4 稳定性修复

#### 修复 server shutdown deadlock
- PR: #100204  
- 链接: ClickHouse/ClickHouse PR #100204
- 价值：
  - 解决线程池等待与析构顺序导致的停机死锁。
- 技术判断：
  - 这类问题对 CI、容器化优雅退出、滚动升级都非常关键。

#### 修复 `ColumnVariant::filter` 中共享指针问题
- PR: #100234  
- 链接: ClickHouse/ClickHouse PR #100234
- 标签：`pr-must-backport`, `pr-critical-bugfix`
- 价值：
  - 直接被归类为 critical bugfix，说明可能导致 `LOGICAL_ERROR` 或潜在数据/执行异常。
- 技术判断：
  - 建议生产使用 Variant 类型或相关表达式路径的团队重点关注。

#### Iceberg `system.query_log.read_rows` 统计修复
- PR: #99282  
- 链接: ClickHouse/ClickHouse PR #99282
- 价值：
  - 修复 Iceberg 读取时 query_log 中 `read_rows` 为 0 的统计问题。
- 技术判断：
  - 这不是执行错误，但会影响可观测性、审计和性能分析，尤其对湖仓集成用户很重要。

---

## 4. 社区热点

以下是今日最值得关注的高讨论度议题：

### 4.1 无法取消正在计算 scalar subquery 的查询
- Issue: #1576  
- 链接: ClickHouse/ClickHouse Issue #1576
- 状态：OPEN
- 评论：27
- 分析：
  - 这是一个非常老的遗留问题，至今仍活跃，说明**查询可中断性**仍然是用户核心诉求。
  - 对长查询治理、资源抢占、多租户环境影响较大。
  - 如果 scalar subquery 阶段无法 kill，会影响 SLA 和集群稳定性。

### 4.2 系统时间回拨后出现内存持续增长
- Issue: #93095  
- 链接: ClickHouse/ClickHouse Issue #93095
- 状态：OPEN
- 评论：11
- 分析：
  - 这是偏底层运行时/定时机制/缓存回收逻辑的问题。
  - 虽被标记 `invalid` 倾向，但从生产视角看，**系统时间异常、虚拟化环境时钟漂移、NTP 调整**并非罕见。
  - 暴露出用户对“异常环境下内存是否可自愈”的担忧。

### 4.3 CI 崩溃：`MergeTreeDataPartCompact` 在 multi_index 中双重删除
- Issue: #99799  
- 链接: ClickHouse/ClickHouse Issue #99799
- 状态：OPEN
- 评论：9
- 分析：
  - 双重释放属于高风险内存安全问题。
  - 虽然当前来自 CI crash，但若可达生产路径，严重性很高。
  - 体现出 MergeTree part 生命周期管理仍是复杂高风险区域。

### 4.4 `clickhouse-client` 在权限不足时退出挂起
- Issue: #99694  
- 链接: ClickHouse/ClickHouse Issue #99694
- 状态：OPEN
- 评论：6
- 分析：
  - 直接影响终端交互体验与运维脚本鲁棒性。
  - 根因指向 suggestion thread / `system.columns` metadata lock / 权限路径交叉，说明客户端智能补全和服务端元数据访问之间耦合偏深。

### 4.5 对异步对象存储删除行为的强烈反弹
- Issue: #99996  
- 链接: ClickHouse/ClickHouse Issue #99996
- 状态：OPEN
- 评论：5
- 分析：
  - 这是今天**用户情绪最强烈**的反馈之一。
  - 背后诉求不是功能新增，而是：**云存储生命周期、DROP 语义、成本控制、运维确定性**。
  - 如果维护者不提供同步删除选项，可能会持续引发企业用户争议。

---

## 5. Bug 与稳定性

以下按严重程度梳理今日关键 Bug / 回归 / 稳定性议题：

### P0 / 高优先级

#### 1) `ColumnVariant::filter` 共享指针问题，已出现 critical bugfix PR
- PR: #100234  
- 链接: ClickHouse/ClickHouse PR #100234
- 状态：已有 fix PR，且要求 backport
- 影响：
  - 可能触发 `LOGICAL_ERROR`，属于用户可见严重异常。
- 建议：
  - 使用 Variant 列类型的用户优先关注后续合入和 backport 落地。

#### 2) 服务器关闭死锁
- PR: #100204  
- 链接: ClickHouse/ClickHouse PR #100204
- 状态：已有 fix PR
- 影响：
  - 影响服务优雅退出、测试环境、K8s 滚动升级与停机维护。
- 严重性：
  - 高，尤其在自动化运维体系中。

#### 3) CI crash：`MergeTreeDataPartCompact` 双重删除
- Issue: #99799  
- 链接: ClickHouse/ClickHouse Issue #99799
- 状态：OPEN，暂未见对应 fix PR
- 影响：
  - 潜在内存安全/崩溃风险。
- 建议：
  - 维护者应尽快确认是否仅限测试路径或可到达生产。

---

### P1 / 重要回归与正确性问题

#### 4) `system.parts` 查询在 metadata lock 存在时无限挂起（25.8 回归）
- Issue: #99547  
- 链接: ClickHouse/ClickHouse Issue #99547
- 状态：OPEN
- fix PR：未见
- 影响：
  - system 表本应作为运维观测入口，若被锁拖住，会影响故障排查。

#### 5) `clickhouse-client` 退出时因缺少 `SELECT ON *.*` 而挂起（25.x 回归）
- Issue: #99694  
- 链接: ClickHouse/ClickHouse Issue #99694
- 状态：OPEN
- fix PR：未见
- 影响：
  - RBAC + 元数据访问 + client 补全线程的组合回归，影响终端用户与自动化脚本。

#### 6) `LEFT ANY JOIN` 在 logical join step 默认开启时产生重复行
- Issue: #99431  
- 链接: ClickHouse/ClickHouse Issue #99431
- 状态：OPEN
- fix PR：未见
- 影响：
  - 查询正确性问题，且涉及默认路径，风险高于普通性能 bug。

#### 7) MergeTree 中 `WHERE ... AND -2147483648` 被错误评估为 false
- Issue: #99979  
- 链接: ClickHouse/ClickHouse Issue #99979
- 状态：OPEN
- fix PR：未见
- 影响：
  - 属于表达式求值/类型转换导致的结果错误。
  - SQLancer/fuzz 报告，值得重视。

#### 8) `cutURLParameter` 对相似参数名处理不一致
- Issue: #100219  
- 链接: ClickHouse/ClickHouse Issue #100219
- 状态：OPEN
- fix PR：未见
- 影响：
  - URL 处理函数正确性问题，影响日志分析、广告归因、埋点清洗等典型场景。

#### 9) `CHECK TABLE` 在复杂 JSON 列结构下失败
- Issue: #100153  
- 链接: ClickHouse/ClickHouse Issue #100153
- 状态：OPEN
- fix PR：未见
- 影响：
  - Kafka ingest + JSON 落地是常见链路，这会影响数据校验与运维可信度。

#### 10) `NATURAL JOIN` 无公共列时生成非法 AST
- Issue: #100220  
- PR: #100223  
- 链接:
  - ClickHouse/ClickHouse Issue #100220
  - ClickHouse/ClickHouse PR #100223
- 状态：已有 fix PR
- 影响：
  - SQL 语义正确性问题，但已处于较快修复路径。

---

### P2 / 格式与生态兼容性问题

#### 11) Arrow Parquet writer 未设置 UUID logical type
- Issue: #100119  
- 链接: ClickHouse/ClickHouse Issue #100119
- 状态：CLOSED
- 影响：
  - 影响跨系统 Parquet schema 识别。
- 备注：
  - 与是否移除旧 Parquet 实现的讨论形成呼应，说明新默认实现仍需持续补齐兼容细节。

#### 12) 7z 解包报错
- Issue: #70968  
- 链接: ClickHouse/ClickHouse Issue #70968
- 状态：CLOSED
- 影响：
  - 属于文件导入兼容问题，目前已答复关闭。

---

### 测试与 fuzz / flaky 信号

- #100221 Flaky test: `04002_cast_nullable_read_in_order`
- #100158 Fuzz: `Bad cast from type A to B`
- #99725 UBSan undefined behavior
- #99578 rows_sources logical error
- #100184 refreshable MV flaky test（已关闭）
- #100178 提议改进 randomized settings 失败诊断

这些问题显示：**项目当前仍在通过大规模 fuzz + sanitizer + randomized tests 主动打磨稳定性**，对健康度是正面信号，但同时说明边界条件复杂度仍高。

---

## 6. 功能请求与路线图信号

### 6.1 高概率进入后续版本的能力

#### A. SQL 标准 `VALUES` 子句
- PR: #100143  
- 链接: ClickHouse/ClickHouse PR #100143
- 判断：**高概率**
- 原因：
  - 已有具体实现 PR
  - 兼容性收益明显
  - 复用现有能力，落地成本相对可控

#### B. `SET TIME ZONE INTERVAL` / `SET SESSION CHARACTERISTICS`
- Issue: #99612  
- 链接: ClickHouse/ClickHouse Issue #99612
- 判断：**中高概率**
- 原因：
  - 与 SQL 标准兼容路线一致
  - 对外部客户端兼容价值高

#### C. `clickhouse-keeper` 增加递归 children 获取
- Issue: #99916  
- 链接: ClickHouse/ClickHouse Issue #99916
- 判断：**中概率**
- 原因：
  - 与 keeper 自身能力扩展有关
  - 适合成为 keeper 生态补强项

---

### 6.2 面向性能或可用性的需求

#### D. 加速主键范围裁剪
- Issue: #99914  
- 链接: ClickHouse/ClickHouse Issue #99914
- 判断：**中高概率**
- 原因：
  - 性能收益清晰，且与 MergeTree 核心竞争力直接相关。
  - 今日已有多个读取路径优化 PR，方向一致。

#### E. 支持 PostgreSQL view 作为 PostgreSQL engine 源
- Issue: #49249  
- 链接: ClickHouse/ClickHouse Issue #49249
- 判断：**中概率**
- 原因：
  - 被标记 `easy task`
  - 连接器/联邦查询体验有实际需求
- 价值：
  - 能减少用户为了同步 view 数据而搭建冗余复制链路。

#### F. 支持默认表达式中使用 `*` 和 column matchers
- Issue: #92266  
- 链接: ClickHouse/ClickHouse Issue #92266
- 判断：**中概率**
- 原因：
  - 与动态 schema、JSON 化输出、别名列表达能力有关
  - 维护者本人提出，说明具备一定路线图权重

---

### 6.3 有争议但值得关注的方向

#### G. 彻底移除旧 Parquet 读写器
- Issue: #100126  
- 链接: ClickHouse/ClickHouse Issue #100126
- 判断：**中概率，但需观察兼容反馈**
- 原因：
  - 维护者态度明确
  - 但 Parquet 生态兼容问题今天仍有案例，短期可能先继续修补新实现。

#### H. `DROP TABLE ... SYNC` 返回同步删除 blob 数据能力
- Issue: #99996  
- 链接: ClickHouse/ClickHouse Issue #99996
- 判断：**中概率**
- 原因：
  - 用户诉求非常强烈，且属于生产语义问题
  - 若投诉持续，可能以新 setting 或新 drop 选项形式落地

---

## 7. 用户反馈摘要

结合今日 issue 内容，可以提炼出几个真实用户痛点：

### 7.1 用户最在意“可预测性”，不仅是吞吐
典型表现：
- 查询 kill 不掉：#1576
- `DROP TABLE` 后底层 blob 何时删不确定：#99996
- server shutdown deadlock：#100204

这说明生产用户对 ClickHouse 的诉求已从“快”延伸为：
- 能否可靠停止
- 能否确定释放资源
- 能否在异常时迅速恢复

---

### 7.2 25.x 回归让升级用户对运维可观测性更敏感
典型表现：
- `system.parts` 挂起：#99547
- client 退出挂起：#99694

说明用户升级后首先感知到的，不一定是新功能，而是：
- system 表还能不能用
- 命令行还能不能顺畅退出
- 元数据锁会不会拖垮排障流程

---

### 7.3 SQL 兼容与外部生态接入的重要性持续上升
典型表现：
- `VALUES` table expression：#100143
- `SET TIME ZONE INTERVAL`：#99612
- PostgreSQL view 支持：#49249
- Parquet UUID logical type：#100119

这表明 ClickHouse 不再只是“原生 SQL 的高性能引擎”，用户希望它更像一个能无缝对接：
- BI 工具
- ORM/驱动
- 湖仓文件格式
- 异构数据库对象  
的现代分析平台。

---

### 7.4 用户接受积极演进，但对破坏原有语义的变更容忍度低
最典型案例是：
- object storage 删除异步化：#99996

这类反馈说明：
- 即便设计更先进，如果改变了用户对“同步完成”的心理模型，也会立即引发强烈反弹。
- 后续特性发布更需要**显式迁移说明、开关策略、兼容保底路径**。

---

## 8. 待处理积压

以下长期或持续活跃问题值得维护者额外关注：

### 8.1 查询无法取消的历史遗留问题
- Issue: #1576  
- 链接: ClickHouse/ClickHouse Issue #1576
- 创建于：2017-12-01
- 风险：
  - 历史跨度极长，仍未彻底解决，说明问题顽固且影响面持续存在。
- 建议：
  - 重新梳理 scalar subquery 执行模型与取消点插桩策略。

### 8.2 PostgreSQL engine 不支持读取 view
- Issue: #49249  
- 链接: ClickHouse/ClickHouse Issue #49249
- 创建于：2023-04-27
- 标签：`easy task`, `unfinished code`
- 风险：
  - 长期未收尾会损害连接器体验，也容易让外部用户觉得跨库能力“不完整”。

### 8.3 S3/object storage 相关 fuzz bug 仍在积压
- Issue: #82555  
- 链接: ClickHouse/ClickHouse Issue #82555
- 创建于：2025-06-25
- 风险：
  - 存储层边界 bug 若长期悬而未决，可能积累为更高成本的线上问题。

### 8.4 默认表达式中的 `*` / column matcher 支持
- Issue: #92266  
- 链接: ClickHouse/ClickHouse Issue #92266
- 创建于：2025-12-16
- 风险：
  - 对 schema 演化友好性和表达能力提升有帮助，若长期停滞，会拖慢易用性改进节奏。

### 8.5 25.x 回归类问题需要尽快定责
- `system.parts` 挂起：#99547
- `clickhouse-client` 退出挂起：#99694
- `LEFT ANY JOIN` 重复行：#99431

这些虽不算“长期老 issue”，但它们**影响升级信心**，应优先于一般功能请求处理。

---

## 附：今日重点链接清单

### Releases
- `v26.1.6.6-stable`：ClickHouse/ClickHouse Release `v26.1.6.6-stable`
- `v25.8.20.4-lts`：ClickHouse/ClickHouse Release `v25.8.20.4-lts`

### 重点 Issues
- #1576 无法取消 scalar subquery 查询：ClickHouse/ClickHouse Issue #1576
- #93095 系统时间回拨后内存持续增长：ClickHouse/ClickHouse Issue #93095
- #99799 MergeTreeDataPartCompact 双重删除：ClickHouse/ClickHouse Issue #99799
- #99694 client 退出挂起回归：ClickHouse/ClickHouse Issue #99694
- #99547 `system.parts` 挂起回归：ClickHouse/ClickHouse Issue #99547
- #99996 请求恢复同步删除 blob 能力：ClickHouse/ClickHouse Issue #99996
- #99612 SQL 标准 timezone/session 兼容：ClickHouse/ClickHouse Issue #99612
- #100220 NATURAL JOIN AST 错误：ClickHouse/ClickHouse Issue #100220
- #99979 `AND -2147483648` 结果错误：ClickHouse/ClickHouse Issue #99979
- #99431 `LEFT ANY JOIN` 重复行：ClickHouse/ClickHouse Issue #99431

### 重点 PR
- #100176 限制 `UNION ALL` 活跃流，降低内存峰值：ClickHouse/ClickHouse PR #100176
- #100177 ThreadPool LIFO 调度：ClickHouse/ClickHouse PR #100177
- #100204 修复 server shutdown deadlock：ClickHouse/ClickHouse PR #100204
- #100143 支持 SQL 标准 `VALUES`：ClickHouse/ClickHouse PR #100143
- #100223 修复 NATURAL JOIN AST：ClickHouse/ClickHouse PR #100223
- #100234 修复 `ColumnVariant::filter` 关键 bug：ClickHouse/ClickHouse PR #100234
- #99533 `ORDER BY LIMIT` 分区剪枝优化：ClickHouse/ClickHouse PR #99533
- #99639 自动启用 uncompressed cache：ClickHouse/ClickHouse PR #99639
- #99941 避免 String `.size` 子列无谓计算：ClickHouse/ClickHouse PR #99941
- #99282 修复 Iceberg query_log `read_rows`：ClickHouse/ClickHouse PR #99282
- #100245 ~ #100250 text index 修复多分支回补：ClickHouse/ClickHouse PR #100245 / #100246 / #100247 / #100248 / #100250

---

**结论**：  
ClickHouse 今天呈现出典型的“高速迭代中的成熟开源基础设施”状态：一边持续推进 SQL 兼容和执行性能，一边通过大量 backport、fuzz、sanitizer 和 deadlock 修复压实稳定性。对生产用户而言，当前最应关注的是 **25.x 回归、对象存储删除语义变化、以及高优先级 correctness/stability fix 的 backport 进度**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-03-21）

## 1. 今日速览

过去 24 小时 DuckDB 项目继续保持高活跃：Issues 更新 20 条、PR 更新 35 条，说明 1.5.0 发布后仍处于较密集的回归修复与架构迭代阶段。  
从内容上看，今天的重点明显偏向 **稳定性修复、SQL 正确性、CLI/导出行为修复，以及内部 AST / 执行器架构重构**。  
社区反馈中，既有新近暴露的 1.5.0 回归问题，也有长期悬而未决的兼容性/易用性诉求被重新激活。  
整体来看，项目健康度良好：维护者响应速度快，多个新报 bug 已在当天出现对应修复 PR；但也暴露出 **Parquet、UNNEST、ASOF JOIN、JSON 输出、复杂绑定路径** 等边缘路径仍有稳定性压力。

---

## 3. 项目进展

### 已合并 / 已关闭的重要 PR

#### 1) 修复 CLI JSON 空结果输出非法 JSON
- PR: #21517 `Fix #21512: correctly render empty results in .mode json`  
  链接: duckdb/duckdb PR #21517
- 对应 Issue: #21512  
  链接: duckdb/duckdb Issue #21512

**影响与意义：**  
修复 `duckdb -json` / `.mode json` 在空结果集时输出 `[{]` 的问题，恢复为合法 JSON `[]`。这属于 **CLI 对外契约正确性修复**，对脚本集成、自动化流水线、数据导出工具尤为重要。

---

#### 2) 修复 WAL 回放与函数型 DEFAULT 的兼容问题
- PR: #21516 `Fix WAL replay with function-based DEFAULT`  
  链接: duckdb/duckdb PR #21516

**影响与意义：**  
该修复涉及 **持久化恢复路径**。WAL 重放错误通常影响数据库崩溃恢复、异常退出后的数据一致性，是高优先级稳定性问题。  
即便摘要未展开细节，这类问题对嵌入式部署和本地持久化场景都非常关键。

---

#### 3) 修复 `list_resize` 整数溢出
- PR: #21515 `Fixing integer overflow in list_resize`  
  链接: duckdb/duckdb PR #21515

**影响与意义：**  
这是典型的 **内存安全修复**：结果长度计算溢出可能导致过小分配和越界写。  
该问题由安全研究方报告，说明 DuckDB 在函数实现层面持续接受外部安全审视，项目安全成熟度在提升。

---

#### 4) 测试基础设施增强：限制测试并发线程
- PR: #21520 `Add setting for limiting the number of threads launched concurrently in the test runner (max_test_threads)`  
  链接: duckdb/duckdb PR #21520
- 相关 PR: #21511 `Reduce concurrent thread count in test`  
  链接: duckdb/duckdb PR #21511

**影响与意义：**  
这属于 **工程质量与 CI 稳定性优化**。对于 sanitizer、32 位构建、资源受限平台，控制测试并发可减少假阳性与测试环境不稳定。  
从信号上看，DuckDB 正在为更复杂平台矩阵和更严格测试场景做准备。

---

#### 5) 修复测试路径解析逻辑
- PR: #21495 `Fix parsing test path to skip`  
  链接: duckdb/duckdb PR #21495

**影响与意义：**  
修复扩展测试路径不以 `test/sql` 开头时的潜在溢出/错误逻辑。  
这说明 DuckDB 对 **扩展生态和外部测试组织方式** 的兼容性在增强。

---

#### 6) 解析器/AST 能力继续扩展
- PR: #21434 `Add DROP TRIGGER parsing support (PEG parser)`  
  链接: duckdb/duckdb PR #21434
- PR: #21505 `Add INSERT/UPDATE/DELETE as QueryNode variants`  
  链接: duckdb/duckdb PR #21505

**影响与意义：**  
`DROP TRIGGER` 虽暂未执行支持，但解析层先行打通，体现了 **SQL 语法覆盖面的持续扩展**。  
而将 DML 表达为 `QueryNode` 变体，则是更深层次的内部架构演进，有利于：
- 序列化/反序列化统一；
- 更一致的绑定与 CTE 路径；
- 为后续优化器和计划表示统一铺路。

---

## 4. 社区热点

### 热点 1：`COPY TO` 导出的 Parquet 文件过大
- Issue: #3316 `[under review] Too large parquet files via "COPY TO"`  
  链接: duckdb/duckdb Issue #3316

**热度指标：**
- 评论 35
- 长期存在问题，今日仍活跃

**技术诉求分析：**  
这是典型的 **存储格式输出质量** 问题。用户将 DuckDB 的 Parquet 写出效果与 PyArrow 进行对比，核心诉求不是“能不能写”，而是“**写出的文件是否足够紧凑、编码策略是否合理**”。  
背后反映的是分析型数据库用户对 DuckDB 作为 **ETL / 数据落盘引擎** 的期待：不仅要查询快，也要产出高质量湖仓文件。

---

### 热点 2：Python API 希望支持上下文管理器
- Issue: #3152 `[Feature Request] Context Managers in Python API`  
  链接: duckdb/duckdb Issue #3152

**热度指标：**
- 👍 26
- 评论 7
- 长期需求今日再次更新

**技术诉求分析：**  
用户希望 DuckDB Python API 更贴近 Python 生态惯例，通过 `with` 自动管理连接、注册对象和资源生命周期。  
这属于 **易用性与资源管理语义** 诉求，尤其对 notebook、临时表注册、短生命周期管道任务很有价值。

---

### 热点 3：XDG 目录规范支持
- Issue: #11779 `[under review] DuckDB does not follow XDG Base Directory Spec`  
  链接: duckdb/duckdb Issue #11779

**热度指标：**
- 👍 10
- 评论 8

**技术诉求分析：**  
这不是查询性能问题，而是 **桌面/CLI/开发者体验与系统规范兼容** 问题。  
DuckDB 作为本地工具链的一部分，用户越来越希望其在 Linux/Unix 环境下行为“像一个现代原生工具”，避免污染 `$HOME`。

---

### 热点 4：重复列名希望可报错而非静默改名
- Issue: #11520 `[reproduced] Setting to get errors on duplicated column names`  
  链接: duckdb/duckdb Issue #11520

**热度指标：**
- 评论 10

**技术诉求分析：**  
这是 **SQL 可维护性与防错机制** 的诉求。  
当前 `SELECT *, a / 3 AS b` 被自动重命名为 `b1` 的行为虽然便利，但在复杂分析查询中容易产生静默错误。用户希望引入更严格模式，以提升分析正确性。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：`read_parquet()` 在 `encryption_config + union_by_name=true` 组合下崩溃
- Issue: #21508 `[reproduced] [1.5] read_parquet crashes with NULL dereference when combining encryption_config and union_by_name=true`  
  链接: duckdb/duckdb Issue #21508

**严重性：高**  
这是显式的 **NULL dereference / INTERNAL Error**，且是 1.5 版本回归。  
影响 Parquet 高级读取路径，尤其是涉及加密文件和 schema 对齐的场景。  
**当前状态：** 暂未看到对应 fix PR。

---

### P1：`UNNEST(..., recursive:=true)` 未完全展开 `integer[3][3]`
- Issue: #21506 `[reproduced] UNNEST(..., recursive:=true) does not fully unnest integer[3][3]`  
  链接: duckdb/duckdb Issue #21506

**严重性：高**  
这是 **查询结果正确性问题**。递归展开未达预期，会直接影响数组/嵌套结构分析逻辑。  
**当前状态：** 暂未看到 fix PR。

---

### P1：ASOF LEFT JOIN + 空右表返回空结果
- Issue: #21514 `[reproduced] ASOF LEFT join with empty right table returns empty result`  
  链接: duckdb/duckdb Issue #21514
- Fix PR: #21519 `Fix #21514: ASOF join empty right`  
  链接: duckdb/duckdb PR #21519

**严重性：高**  
这是典型的 **JOIN 语义错误**。LEFT JOIN 在右表为空时应保留左表并补 NULL。  
错误根因已被定位到优化器 `EmptyResultPullup` 对 `LOGICAL_ASOF_JOIN` 处理不当。  
**当前状态：** 已有修复 PR，响应很快。

---

### P1：CLI JSON 空结果输出非法 JSON
- Issue: #21512 `[reproduced] duckdb -json outputs invalid JSON [{] for empty result sets`  
  链接: duckdb/duckdb Issue #21512
- Fix PR: #21517  
  链接: duckdb/duckdb PR #21517

**严重性：高（对自动化集成）**  
虽然不是引擎 crash，但会直接破坏脚本消费者。  
**当前状态：** 已修复并关闭。

---

### P1：1.5.0 升级后带 `spatial` 扩展的查询绑定失败
- Issue: #21419 `[CLOSED] INTERNAL Error: Failed to bind column reference "id"`  
  链接: duckdb/duckdb Issue #21419

**严重性：高**  
表现为版本升级后已可工作的查询失效，且涉及扩展。  
**当前状态：** 已关闭，但给 1.5.0 回归质量留下警示信号。

---

### P2：Parquet 写出 HUGEINT 精度丢失
- Issue: #21180 `[reproduced] Loss of Precision when Writing HUGEINT Columns to Parquet`  
  链接: duckdb/duckdb Issue #21180

**严重性：中高**  
这是 **数据保真度问题**。HUGEINT 被错误转换为 DOUBLE 会造成不可逆精度丢失。  
对于金融、ID、哈希、超大数值场景风险很高。  
**当前状态：** 暂未看到 fix PR。

---

### P2：`date_part` 统计传播存在 off-by-one
- Issue: #21478 `[reproduced] Off-by-one error in PropagateStatistics for date_part...`  
  链接: duckdb/duckdb Issue #21478

**严重性：中高**  
不会直接返回错误结果，但会导致优化器统计上界偏宽，影响 **谓词剪枝与计划质量**。  
属于微妙但真实的性能/优化正确性问题。

---

### P2：JSON 导入错误解析带 `T` 的 ISO 8601 日期
- Issue: #14004 `[reproduced] JSON Import Error: Incorrect Parsing of ISO 8601 Date Strings with 'T' Separator`  
  链接: duckdb/duckdb Issue #14004

**严重性：中**  
影响典型 API/日志 JSON 输入，是很常见的数据互操作路径。  
反映出 DuckDB 自动类型推断在半结构化数据导入上仍需更稳健。

---

### P2：`ifnull` 链式调用报错
- Issue: #11907 `[reproduced, stale] ifnull returns an error when chained`  
  链接: duckdb/duckdb Issue #11907

**严重性：中**  
属于 **函数调用语法一致性问题**。`nullif` 与 `ifnull` 的链式行为不一致，会给表达式 API 使用者造成困惑。

---

### P3：`str_split('', '')` 返回 `['',]` 而不是 `[]`
- Issue: #14414 `[reproduced] str_split('', '') gives ['',], not []`  
  链接: duckdb/duckdb Issue #14414

**严重性：低到中**  
更偏边界语义问题，但会影响字符串处理一致性与用户预期。

---

### P3：命名内存连接生命周期与作用域绑定
- Issue: #16717 `[reproduced, stale] Named in-memory connections don't survive function scope`  
  链接: duckdb/duckdb Issue #16717

**严重性：低到中**  
更偏 **连接管理语义**。对嵌入式/函数式封装使用者会造成困扰。

---

## 6. 功能请求与路线图信号

### 1) RISC-V 64 预编译发布支持
- Issue: #21494 `Add riscv64 to release binaries and Python wheel builds`  
  链接: duckdb/duckdb Issue #21494

**信号判断：中等偏强**  
该请求给出了原生硬件验证，属于明确的平台扩展诉求。  
结合今天测试并发控制、平台稳定性改进相关 PR，可以推测维护者正在改善多平台构建基础设施，**riscv64 进入官方构建矩阵有一定可能性**。

---

### 2) Python API 上下文管理器
- Issue: #3152  
  链接: duckdb/duckdb Issue #3152

**信号判断：中等**  
用户价值高、实现范围可控、生态契合度强，但目前未看到直接配套 PR。  
更可能作为 **Python 绑定易用性增强** 在未来小版本逐步纳入。

---

### 3) 更严格的重复列名检查
- Issue: #11520  
  链接: duckdb/duckdb Issue #11520

**信号判断：中等**  
如果以 setting/pragma 形式提供“严格模式”，兼容性风险较低，较适合进入未来版本。  
这类需求与企业/生产分析场景的 **可审计性** 很匹配。

---

### 4) XDG Base Directory 规范
- Issue: #11779  
  链接: duckdb/duckdb Issue #11779

**信号判断：中等**  
该需求用户认同度较高，且对 CLI/扩展缓存路径有明确规范价值。  
但会涉及历史路径兼容与迁移策略，通常需要较谨慎推进。

---

### 5) Parquet MAP 列的 row group skipping
- PR: #21375 `Add row group skipping support for MAP columns in Parquet reader`  
  链接: duckdb/duckdb PR #21375

**信号判断：强**  
这是明确的 **存储读取优化**，直接改善 Parquet 查询性能。  
PR 当前因 merge conflict 未合并，但其方向与 DuckDB 一贯的列式扫描/统计剪枝优化路线高度一致，预计后续仍会推进。

---

### 6) Window Catalog / DML QueryNode 架构重构
- PR: #21446 `Window Catalog Entries`  
  链接: duckdb/duckdb PR #21446
- PR: #21518 `Represent INSERT as InsertQueryNode`  
  链接: duckdb/duckdb PR #21518
- PR: #21524 `Refactor UpdateStatement as thin wrapper over UpdateQueryNode`  
  链接: duckdb/duckdb PR #21524

**信号判断：强**  
这些 PR 指向的是 **内部查询表示统一化**。  
中长期看，这通常意味着：
- 更强的 SQL 语法扩展能力；
- 更一致的计划/绑定/序列化基础；
- 为新优化器功能和工具链支持打底。

---

## 7. 用户反馈摘要

### 1) DuckDB 不只是查询引擎，用户正把它当“数据生产引擎”
- 代表 Issue: #3316  
  链接: duckdb/duckdb Issue #3316

用户不仅关心查询是否快，也关心 `COPY TO` 产出的 Parquet 文件大小、编码质量和下游可用性。  
这表明 DuckDB 正被越来越多地用于 **中间层 ETL、数据交换、数据湖写出**。

---

### 2) SQL 容错太“友好”时，生产分析反而更危险
- 代表 Issue: #11520  
  链接: duckdb/duckdb Issue #11520

自动重命名重复列名虽然方便探索，但会隐藏错误。  
用户希望有更强约束，以减少复杂 SQL 演进过程中的静默错误。

---

### 3) 本地工具体验与操作系统规范越来越重要
- 代表 Issue: #11779  
  链接: duckdb/duckdb Issue #11779

随着 DuckDB 被当作 CLI / 本地分析基础设施使用，用户开始要求它遵循 XDG 等系统规范。  
这反映项目受众已不仅是库嵌入者，也包括日常使用命令行和本地扩展的开发者。

---

### 4) 半结构化数据和嵌套类型仍是高频痛点
- 代表 Issues: #14004, #21506, #21503  
  链接: duckdb/duckdb Issue #14004  
  链接: duckdb/duckdb Issue #21506  
  链接: duckdb/duckdb Issue #21503

JSON、STRUCT[]、嵌套数组、递归 UNNEST 相关问题集中出现，说明用户正更深入地使用 DuckDB 处理复杂数据结构。  
这也是现代分析工作负载的真实方向。

---

### 5) 升级到 1.5.0 后，用户对回归较敏感
- 代表 Issues: #21419, #21508, #21512, #21514  
  链接: duckdb/duckdb Issue #21419  
  链接: duckdb/duckdb Issue #21508  
  链接: duckdb/duckdb Issue #21512  
  链接: duckdb/duckdb Issue #21514

近期问题高度集中在 1.5.0 升级后出现的新行为，说明社区已进入 **快速回归发现窗口**。  
好消息是，多数问题当天就有 triage 或修复 PR，维护效率较高。

---

## 8. 待处理积压

以下长期或反复活跃的问题值得维护者重点关注：

### 1) `COPY TO` Parquet 文件过大
- Issue: #3316  
  链接: duckdb/duckdb Issue #3316

创建于 2022 年，评论很多，说明这是影响面广的长期痛点。  
建议提升优先级，因为它直接影响 DuckDB 在数据导出/湖仓写出场景的竞争力。

---

### 2) Python API 上下文管理器
- Issue: #3152  
  链接: duckdb/duckdb Issue #3152

创建于 2022 年，点赞数高。  
这是典型“小功能、大体验”诉求，长期未落地会持续消耗 Python 用户满意度。

---

### 3) XDG 目录规范支持
- Issue: #11779  
  链接: duckdb/duckdb Issue #11779

用户反馈明确，且具有平台规范意义。  
如果要调整，建议尽早设计兼容方案，避免后续生态路径固化。

---

### 4) `ifnull` 链式调用不一致
- Issue: #11907  
  链接: duckdb/duckdb Issue #11907

已被 reproduced，但仍带 stale 标签。  
这类语义一致性问题虽不致命，但会持续影响 SQL 语言体验。

---

### 5) 命名内存连接生命周期问题
- Issue: #16717  
  链接: duckdb/duckdb Issue #16717

这关系到嵌入式连接语义，建议明确设计预期并补充文档或修复。

---

### 6) Parquet HUGEINT 精度丢失
- Issue: #21180  
  链接: duckdb/duckdb Issue #21180

这是数据正确性问题，不应长期搁置。  
相较一般兼容性细节，它更接近“静默数据损坏”风险。

---

## 总结判断

今天 DuckDB 的项目状态可以概括为：**高活跃、快速修复、架构推进明显，但 1.5.0 后回归压力仍在释放**。  
短期重点应继续放在：
1. Parquet 读取/写出正确性与性能；
2. 嵌套类型、UNNEST、JSON 等复杂数据路径稳定性；
3. JOIN/绑定/优化器边界条件回归；
4. 将已显现的高频易用性诉求纳入产品化路线。

如果你愿意，我还可以把这份日报继续整理成：
- **适合团队群播报的 10 条摘要版**
- **按“引擎 / 存储 / 生态 / 稳定性”分类版**
- **面向管理层的风险雷达版**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 · 2026-03-21

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持**高活跃**：Issues 更新 4 条、PR 更新 137 条，其中 **101 条 PR 已合并/关闭**，说明项目主干与多版本分支都在持续快速推进。  
从变更内容看，今日重点仍集中在 **Materialized View（MV）刷新与改写稳定性、Iceberg/Paimon 等湖仓连接器兼容性、执行引擎正确性修复**，同时也有少量构建工具链与测试稳定性改进。  
风险层面，新增/活跃问题中出现了 **Join 正确性/崩溃、Hive EXPLAIN 分区统计误导、分区表达式错误提示不准确** 等问题，反映出优化器、连接器元数据裁剪、错误诊断体验仍是当前用户关注重点。  
整体来看，项目健康度良好：**修复节奏快、回补分支活跃、版本维护强**，但也显示出 StarRocks 在外部表/MV/复杂执行路径上的边界场景仍在持续打磨中。

---

## 2. 项目进展

### 2.1 今日已合并/关闭的重点 PR

#### 1）修复 Iceberg MV 刷新在快照过期场景下重复刷新的问题
- PR: [#70523](https://github.com/StarRocks/starrocks/pull/70523)
- 状态: 已关闭/已合并，且已标记 `3.5-merged, 4.0-merged, 4.1-merged`

这是一条非常关键的 MV 稳定性修复。问题根因在于：当 Iceberg snapshot 过期后，`last_updated_snapshot_id` 可能变为 `null`，系统无法可靠判断某个分区是否需要刷新，进而导致 **重复刷新** 或刷新决策失真。  
这项修复直接推进了：
- **外部表 MV 增量刷新正确性**
- **Iceberg 元数据异常/历史清理场景下的容错能力**
- **多版本分支一致性维护**

对应的自动回补 PR 也已出现，但因冲突被关闭：
- [#70616](https://github.com/StarRocks/starrocks/pull/70616) `3.5.16` backport，关闭
- [#70615](https://github.com/StarRocks/starrocks/pull/70615) `4.0.9` backport，关闭
- [#70617](https://github.com/StarRocks/starrocks/pull/70617) `4.1.0` backport，关闭

> 解读：主修复已经进入主干及多个维护分支，说明维护者高度重视 **湖仓 MV 刷新正确性**。

---

#### 2）修复 Iceberg MV 刷新对非单调 snapshot timestamp 的容忍性
- PR: [#70382](https://github.com/StarRocks/starrocks/pull/70382)
- 状态: 已关闭/已合并，且已标记 `3.5-merged, 4.0-merged, 4.1-merged`

该 PR 针对另一个 Iceberg MV 刷新边界问题：当 `last_updated_at` 的回退值与实际元数据时间单位不一致，或 snapshot 时间戳出现非单调情况时，会影响分区刷新判断。  
这项修复补强了：
- **Iceberg 元数据时间戳兼容性**
- **MV 刷新决策鲁棒性**
- **跨版本湖仓行为一致性**

相关回补 PR：
- [#70485](https://github.com/StarRocks/starrocks/pull/70485) `3.5.16` backport，关闭

> 解读：#70382 与 #70523 构成连续 follow-up，说明近期 StarRocks 团队正集中清理 **Iceberg + MV 刷新链路** 中的复杂正确性问题。

---

#### 3）修复 MV 透明改写生成包含函数表达式 GROUP BY 的 Union 时的 Invalid Plan
- PR: [#70601](https://github.com/StarRocks/starrocks/pull/70601)
- 状态: 已关闭

- 链接: [#70601](https://github.com/StarRocks/starrocks/pull/70601)

该问题发生在：
- 透明 MV 只覆盖部分查询分区
- 优化器生成 `MV scan + base table scan` 的 `Union`
- 查询又包含 `GROUP BY DATE(col)` 这类函数表达式

在该组合下，`MergeProjectWithChildRule` 等规则交互可能导致 **Invalid Plan**。  
这类修复体现出项目在推进：
- **优化器复杂表达式处理**
- **透明 MV rewrite 正确性**
- **部分覆盖场景的计划生成稳定性**

---

#### 4）构建与开发体验优化
- PR: [#70611](https://github.com/StarRocks/starrocks/pull/70611) — Optimize Build，已关闭
- PR: [#70604](https://github.com/StarRocks/starrocks/pull/70604) — Make Be compile successfully on MacOS，已关闭
- PR: [#70606](https://github.com/StarRocks/starrocks/pull/70606) — 修复 lake replication txn 快速 cancel 引入的不稳定 UT，Open
- PR: [#70597](https://github.com/StarRocks/starrocks/pull/70597) — 移除 Iceberg alter-table v2 测试中的默认值子句，Open

这些变更虽不一定直接影响终端用户功能，但有利于：
- **CI 稳定性**
- **跨平台开发体验**
- **回归测试质量**
- **Iceberg 语义测试严谨性**

---

### 2.2 今日仍在推进的重点 Open PR

#### 5）外部 MV 精准刷新回退逻辑修复（Iceberg-like connectors）
- PR: [#70589](https://github.com/StarRocks/starrocks/pull/70589)
- 状态: Open

该 PR 指出 `enable_materialized_view_external_table_precise_refresh` 被过度套用到所有外表 MV 刷新路径，但并非所有连接器都支持 **partition-granular metadata refresh**。  
对 Iceberg-like connectors，需要在不支持精细元数据刷新的情况下合理回退，避免错误进入 precise refresh 路径。

这是非常明确的路线信号：
- StarRocks 正在细化 **外部表 MV 刷新能力矩阵**
- 后续不同 connector 的刷新语义、能力探测、降级机制可能继续完善

---

#### 6）Paimon 表主键在 SHOW CREATE / DESC 中展示
- PR: [#70535](https://github.com/StarRocks/starrocks/pull/70535)
- 状态: Open

- 链接: [#70535](https://github.com/StarRocks/starrocks/pull/70535)

该修复改善了 StarRocks 对 **Paimon 元数据可观测性** 与 SQL 展示一致性，属于典型的 SQL/元数据兼容性提升。  
若合入，将提升：
- `SHOW CREATE TABLE`
- `DESC`
- 外部表主键元信息透明度

对用户来说，这能降低“外表 schema 信息不完整”的困扰。

---

#### 7）窗口函数倾斜优化与显式 skew hint 回补
- PR: [#70613](https://github.com/StarRocks/starrocks/pull/70613)
- PR: [#70614](https://github.com/StarRocks/starrocks/pull/70614)
- 状态: Open

这两项增强围绕 **窗口函数分区键倾斜** 场景展开：
- 通过拆分成 `UNION` 优化 skewed partition keys
- 支持显式 skew hint

这是明显的查询引擎性能方向增强，说明 StarRocks 仍在持续补强：
- **分析型 SQL 在热点 key / 数据倾斜场景下的性能表现**
- **用户对执行策略的可控性**

---

#### 8）Load Profile 增加按目标 BE 的 RPC MIN/MAX 指标
- PR: [#70609](https://github.com/StarRocks/starrocks/pull/70609)
- 状态: Open

该改动针对当前 load profile 中 RPC 时间指标为多节点累加值的问题，新增 per-target-BE 的 MIN/MAX，有助于区分：
- 总量大是因为节点多
- 还是某些 BE 真的慢

这将显著提升：
- **性能诊断可解释性**
- **多机负载分析能力**
- **慢节点定位效率**

---

#### 9）修复空 tablet + physical split 导致 CN crash
- PR: [#70281](https://github.com/StarRocks/starrocks/pull/70281)
- 状态: Open

当空 tablet 没有 rowset，而 `PhysicalSplitMorselQueue` 开启 `need_split=true` 时，会触发越界访问并导致 **SIGSEGV**。  
这是典型的执行层崩溃修复，影响：
- **Compute Node 稳定性**
- **扫描器边界条件处理**
- **空分片/空表场景安全性**

---

## 3. 社区热点

> 注：提供数据中 PR 评论数未给出具体数值，因此以下热点主要基于问题重要性、修复链条完整度和版本影响范围判断。

### 热点 1：Join 正确性与崩溃问题
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)
- 标题: `JoinHashTable::merge_ht() missing expression-based key column merge causes crash/wrong results with adaptive partition hash join`
- 状态: Closed

这是今天最值得关注的问题之一。它涉及：
- **adaptive partition hash join**
- **表达式 join key**（如 `COALESCE(a.key2, 'default')`）
- 后果包括 **崩溃或错误结果**

背后的技术诉求非常明确：  
用户不仅要求 StarRocks “能跑复杂 join”，更要求在表达式 key、分区自适应、hash table merge 等复杂优化组合下保持 **查询正确性优先**。  
这是 OLAP 引擎中最敏感的一类问题，任何 wrong results 都会直接影响生产信任度。

---

### 热点 2：Iceberg MV 刷新链路的持续修复
- PR: [#70382](https://github.com/StarRocks/starrocks/pull/70382)
- PR: [#70523](https://github.com/StarRocks/starrocks/pull/70523)
- PR: [#70589](https://github.com/StarRocks/starrocks/pull/70589)

过去一天，围绕 Iceberg / 外部表 MV 刷新的修复和 follow-up 明显密集。  
说明社区和维护者正在共同攻关：
- snapshot 过期
- 时间戳非单调
- 不同 connector 的精准刷新能力差异
- 外表分区元数据可见性与刷新粒度

这反映出 StarRocks 在湖仓分析一体化场景下，正从“支持功能”走向“打磨正确性与边界一致性”。

---

### 热点 3：外表与元数据展示兼容性
- PR: [#70535](https://github.com/StarRocks/starrocks/pull/70535)
- Issue: [#70557](https://github.com/StarRocks/starrocks/issues/70557)

Paimon 主键展示、Hive 分区裁剪后的 EXPLAIN 统计误导，二者都指向同一个核心诉求：  
**用户希望 StarRocks 对外部湖仓表提供更可信、更直观的元数据和执行计划解释能力。**

换句话说，用户不只需要“查得通”，还需要：
- 看得懂 schema
- 看得懂 plan
- 判断得出分区裁剪是否生效

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P0 / 查询正确性与崩溃

#### 1）表达式 Join Key 在 adaptive partition hash join 中可能导致崩溃或错误结果
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)
- 状态: Closed

影响：
- **错误结果**
- **执行崩溃**
- 触发条件为复杂 join key 表达式 + hash join merge 路径

这是最严重的一类问题。虽然 issue 已关闭，但从日报角度应视为当天的重要风险事件。  
**是否已有 fix PR：** 数据中未明确列出对应 PR，但 issue 已关闭，推测已有修复提交或已在内部链路解决。

---

#### 2）空 tablet 扫描在 physical split 下导致 CN SIGSEGV
- PR: [#70281](https://github.com/StarRocks/starrocks/pull/70281)
- 状态: Open

影响：
- Compute Node 崩溃
- 空 tablet 边界场景不安全

**是否已有 fix PR：** 有，当前 PR 处理中。

---

### P1 / 查询计划与刷新正确性

#### 3）Hive 表 EXPLAIN 的 partition count 误导
- Issue: [#70557](https://github.com/StarRocks/starrocks/issues/70557)
- 状态: Open

问题描述显示：当 metastore 已按字符串分区列预过滤时，EXPLAIN 仍可能显示误导性的分区计数。  
影响：
- 用户误判谓词下推/分区裁剪效果
- 排查查询性能时得到错误信号

**是否已有 fix PR：** 暂未看到对应 PR。

---

#### 4）MV 透明改写在 Union + GROUP BY 函数表达式场景触发 Invalid Plan
- PR: [#70601](https://github.com/StarRocks/starrocks/pull/70601)
- 状态: Closed

影响：
- 优化器计划无效
- 透明 MV 在部分覆盖场景不稳定

**是否已有 fix PR：** 有，PR 已关闭，推测已处理完成。

---

#### 5）Iceberg MV 刷新在 snapshot 过期时可能重复刷新
- PR: [#70523](https://github.com/StarRocks/starrocks/pull/70523)
- 状态: Closed

影响：
- 刷新重复执行
- 增量刷新判断失真
- 外部表 MV 成本与正确性受影响

**是否已有 fix PR：** 有，已合入多分支。

---

#### 6）Iceberg MV 刷新对非单调 snapshot timestamp 容忍性不足
- PR: [#70382](https://github.com/StarRocks/starrocks/pull/70382)
- 状态: Closed

影响：
- 依赖时间戳决策的刷新逻辑可能异常
- 边界元数据场景不稳定

**是否已有 fix PR：** 有，已合入多分支。

---

### P2 / 诊断与易用性问题

#### 7）partition expr 报错信息不正确
- Issue: [#68567](https://github.com/StarRocks/starrocks/issues/68567)
- 状态: Open
- 标签: `good first issue`

这类问题不直接影响执行正确性，但会影响：
- DDL 调试效率
- 新用户学习曲线
- 自动化平台错误定位体验

**是否已有 fix PR：** 暂无。

---

## 5. 功能请求与路线图信号

### 1）支持通过 Apache Livy Batch REST API 发起 Spark Load
- Issue: [#70574](https://github.com/StarRocks/starrocks/issues/70574)
- 状态: Open

这是今天最明确的新功能需求。  
当前 Spark Load 依赖 FE 通过 `spark-submit` 对接 YARN，要求 FE 节点具备 Spark/YARN 客户端与 Hadoop 配置，这在以下环境中是明显障碍：
- 云原生部署
- 容器化 FE
- 受限网络/托管平台环境

引入 Livy Batch REST API 的价值在于：
- 降低 FE 与 Hadoop/Spark 客户端的耦合
- 适配云原生环境
- 改善远程提交 ETL 任务的运维可行性

**纳入下一版本可能性：中等偏高。**  
原因是该需求有真实场景驱动，且与 StarRocks 向外部生态集成增强的大方向一致。

---

### 2）窗口函数倾斜优化相关增强
- PR: [#70613](https://github.com/StarRocks/starrocks/pull/70613)
- PR: [#70614](https://github.com/StarRocks/starrocks/pull/70614)

虽然这是 PR 而非 issue，但它是明显的路线图信号：
- 对窗口函数大分区热点倾斜做执行层优化
- 提供显式 hint 让用户主动介入

**纳入下一版本可能性：高。**  
因为已进入 backport 流程，说明功能成熟度较高。

---

### 3）外部表 MV 精准刷新能力差异化处理
- PR: [#70589](https://github.com/StarRocks/starrocks/pull/70589)

该 PR 透露出未来路线：
- 不再默认假设所有 connector 都具备同等 partition-level refresh 能力
- 会逐步建立 connector 能力边界与回退策略

这对 Iceberg、Paimon、Hive 等生态接入是重要基础设施能力。  
**纳入下一版本可能性：高。**

---

### 4）Paimon 元数据展示增强
- PR: [#70535](https://github.com/StarRocks/starrocks/pull/70535)

这是外部表 SQL 兼容性与可观测性的持续补强。  
**纳入下一版本可能性：较高。**

---

## 6. 用户反馈摘要

结合今日 issue 摘要，可提炼出几个真实用户痛点：

### 1）用户最不能接受的是“错误结果”
- 代表问题: [#70349](https://github.com/StarRocks/starrocks/issues/70349)
- 场景: 表达式 join key + adaptive partition hash join

这类反馈说明生产用户已在使用 StarRocks 的高级执行优化能力，且查询逻辑并不简单。  
他们更关注：
- 复杂 SQL 下的结果可信度
- 自适应执行策略是否引入隐蔽错误

---

### 2）用户需要更准确的计划解释信息来做性能判断
- 代表问题: [#70557](https://github.com/StarRocks/starrocks/issues/70557)

用户希望 EXPLAIN 能真实反映：
- 总分区数
- 过滤后分区数
- metastore 预过滤是否生效

这说明 StarRocks 已经被用于需要**精细性能调优**的场景，用户对 explainability 的要求越来越高。

---

### 3）用户希望错误提示更友好，而不是“语义正确但信息误导”
- 代表问题: [#68567](https://github.com/StarRocks/starrocks/issues/68567)

即便不是致命 bug，错误信息不准确也会显著拖慢：
- DDL 开发效率
- 平台封装排障
- 初学者上手体验

---

### 4）云原生/托管环境用户需要更松耦合的 Spark Load 接入方式
- 代表需求: [#70574](https://github.com/StarRocks/starrocks/issues/70574)

这反映出用户部署形态正发生变化：  
从传统 Hadoop/YARN 共置环境，转向 **Kubernetes、托管计算、远程批处理 API**。  
StarRocks 若想持续扩大企业采用面，需要降低对本地客户端二进制和配置的依赖。

---

## 7. 待处理积压

### 1）partition expr 报错信息不正确
- Issue: [#68567](https://github.com/StarRocks/starrocks/issues/68567)
- 创建时间: 2026-01-28
- 状态: Open
- 标签: `good first issue`

这是今天列表中相对“积压”较久的问题。虽然严重性不高，但已存在近两个月，说明：
- 这类易用性问题优先级偏低
- 但长期不处理会持续损耗用户体验

建议维护者：
- 将其纳入低风险新手任务池
- 尽快补齐错误信息与测试用例

---

### 2）空 tablet + physical split 的崩溃修复仍待合入
- PR: [#70281](https://github.com/StarRocks/starrocks/pull/70281)
- 创建时间: 2026-03-14
- 状态: Open

该问题属于潜在崩溃类，虽然不是特别老，但**风险高于其“等待时长”本身**。  
建议优先审查与合并，尤其是如果 physical split 已在生产中被广泛启用。

---

### 3）MV rewrite 忽略 base table 已删除分区的 backport 仍未完成
- PR: [#70444](https://github.com/StarRocks/starrocks/pull/70444)
- 状态: Open

- 链接: [#70444](https://github.com/StarRocks/starrocks/pull/70444)

该 PR 关注的是一个很关键的问题：  
当基表 Iceberg 分区被删除后，MV transparent rewrite 仍可能使用陈旧数据。  
这属于 **陈旧结果/stale data** 风险，虽然是 backport，但业务影响不容忽视。  
建议维护者尽快解决冲突，完成回补。

---

## 附：今日重点链接汇总

- Issue #70349 — JoinHashTable merge 缺失表达式 key 合并，可能 crash/wrong results  
  https://github.com/StarRocks/starrocks/issues/70349

- Issue #70557 — Hive 表 EXPLAIN 分区计数误导  
  https://github.com/StarRocks/starrocks/issues/70557

- Issue #70574 — 支持通过 Apache Livy Batch REST API 发起 Spark Load  
  https://github.com/StarRocks/starrocks/issues/70574

- Issue #68567 — partition expr 错误信息不正确  
  https://github.com/StarRocks/starrocks/issues/68567

- PR #70523 — 修复 Iceberg snapshot 过期下 MV 重复刷新  
  https://github.com/StarRocks/starrocks/pull/70523

- PR #70382 — 修复 Iceberg MV 刷新对非单调 snapshot timestamp 的容忍性  
  https://github.com/StarRocks/starrocks/pull/70382

- PR #70601 — 修复 MV transparent rewrite + Union + GROUP BY 函数表达式的 Invalid Plan  
  https://github.com/StarRocks/starrocks/pull/70601

- PR #70589 — 修复 Iceberg-like connectors 的外部 MV 精准刷新回退  
  https://github.com/StarRocks/starrocks/pull/70589

- PR #70535 — 在 SHOW CREATE / DESC 中展示 Paimon 主键  
  https://github.com/StarRocks/starrocks/pull/70535

- PR #70281 — 修复空 tablet + physical split 导致 CN 崩溃  
  https://github.com/StarRocks/starrocks/pull/70281

- PR #70609 — Load Profile 增加按目标 BE 的 RPC MIN/MAX 指标  
  https://github.com/StarRocks/starrocks/pull/70609

- PR #70613 — 窗口函数倾斜分区优化（拆分 UNION）  
  https://github.com/StarRocks/starrocks/pull/70613

- PR #70614 — 支持窗口函数显式 skew hint  
  https://github.com/StarRocks/starrocks/pull/70614

如果你愿意，我还可以继续把这份日报整理成：
1. **更适合邮件/飞书发送的简版**，或  
2. **按“查询引擎 / 湖仓连接器 / 稳定性 / 开发者体验”分栏的管理层视图版**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-21）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持较高活跃度：Issues 更新 15 条、PR 更新 50 条，说明社区在功能演进、连接器稳定性和基础设施治理上都在持续推进。  
从议题分布看，**Spark、Flink、Kafka Connect、REST Catalog** 仍是当前最活跃的几个方向，其中 Kafka Connect 提交链路一致性、Flink 恢复场景正确性、Spark Z-order 改写边界条件等问题尤为突出。  
今天没有新版本发布，但多个 Issue/PR 明确指向 **1.10.x 补丁线** 和后续版本的稳定性修复，释放出“短期以修复回归和连接器正确性为主，长期继续推进 REST/OpenAPI/V4 manifest 能力”的路线图信号。  
整体健康度评价：**活跃且偏修复驱动**。社区在高频修复真实生产问题的同时，也持续补齐基准测试、类型映射文档和 SQL 能力缺口。

---

## 3. 项目进展

> 今日无新 Release。以下聚焦“已关闭/推进显著”的 PR 与事项。

### 3.1 已关闭/完成的重要变更

#### 1) Flink 回移修复：DynamicIcebergSink 非确定性 Operator UID
- **PR**: #15702 [CLOSED] Flink: Backport: Fix non-deterministic operator UIDs in DynamicIcebergSink  
- **链接**: apache/iceberg PR #15702

该 PR 已关闭，表示针对 Flink 1.20 和 2.0 的回移修复已完成，目标是解决 `DynamicIcebergSink` 中 operator UID 非确定性的问题。这类问题通常直接影响 **savepoint / checkpoint 恢复一致性**、作业升级兼容性和状态映射稳定性。  
这与今日活跃 Bug #14425 高度相关，说明 Flink sink 恢复链路正在被集中修复。

#### 2) 基础设施治理：停止忽略 gradle 目录
- **PR**: #15705 [CLOSED] Build: Stop ignoring gradle directory  
- **链接**: apache/iceberg PR #15705

该 PR 关闭了构建治理中的一个隐患：`gradle/` 目录下包括 `libs.versions.toml` 在内的依赖版本源文件不应被 git 忽略。  
这有助于提升：
- 依赖变更透明度
- 构建可审计性
- 版本管理一致性

虽然不是用户可见功能，但对大型开源项目的长期维护非常关键。

#### 3) 过期/搁置 PR 的清理
- **PR**: #14853 [CLOSED] Spark/Arrow/Parquet: Add vectorized read support for parquet RLE encoded data pages  
- **链接**: apache/iceberg PR #14853  
- **PR**: #14782 [CLOSED] Spark: Support View Schema Mode and CREATE TABLE LIKE sort order  
- **链接**: apache/iceberg PR #14782

这两项关闭表明维护者正在清理陈旧改动。前者涉及 **Parquet v2 RLE 页面向量化读取**，后者涉及 **Spark 4.0 View Schema Mode / CREATE TABLE LIKE sort order**。  
关闭并不一定意味着需求消失，更可能意味着：
- 代码长期未更新
- 实现路径需要重做
- 维护者希望以更小粒度重新提交

这对项目健康度是正向信号：维护者在控制积压质量。

---

### 3.2 今日值得关注的进行中 PR

#### 1) Spark：Z-order rewrite 增加保留列名冲突校验
- **PR**: #15706 [OPEN] Spark: Validate Z-order rewrite does not conflict with internal ICEZVALUE column name  
- **链接**: apache/iceberg PR #15706

该 PR 针对 Spark Z-order 重写流程中内部列名 `ICEZVALUE` 与用户表字段重名导致的误导性报错，增加前置校验并给出明确错误信息。  
这属于典型的 **SQL/存储优化功能边界条件修复**，可明显改善用户排障体验。对应 Issue 为 #15708。

#### 2) Kafka Connect：隔离陈旧 DataWritten 事件，避免跨提交污染
- **PR**: #15710 [OPEN] KAFKACONNECT: Fix stale DataWritten handling by separating commits into distinct RowDeltas  
- **链接**: apache/iceberg PR #15710

这是今天最值得关注的连接器修复之一。PR 描述指出在部分提交超时后，晚到的 `DataWritten` 事件会混入下一次提交周期，当前按 table 聚合的逻辑会导致：
- 脏提交混入
- 重复写入
- 提交语义失真

修复方案改为将不同提交隔离到独立 `RowDelta`。这直接关系到 Kafka Connect 在生产 CDC/流式写入场景下的一致性。

#### 3) Kafka Connect：防止 failed commit 后重复行/数据丢失
- **PR**: #15651 [OPEN] fix: clear CommitState buffer on new commit to prevent duplicate rows  
- **链接**: apache/iceberg PR #15651

该 PR 与 #15710 形成呼应，均聚焦 Kafka Connect 提交缓冲区在失败/超时后的生命周期管理。  
从两者并行存在可以看出，维护者/贡献者正在从“简单清空 buffer”转向“按 commitId 精细隔离”的更可靠方案。

#### 4) Core/API：批量加载 tables/views REST endpoint
- **PR**: #15669 [OPEN] Core: Add batch load endpoints for tables and views  
- **链接**: apache/iceberg PR #15669

该 PR 为 REST Catalog 增加批量加载表和视图的 Java 端实现，包括：
- request/response model
- JSON parser
- handler/router
- client 端映射

这说明 Iceberg 正继续强化 **REST Catalog 的控制面能力**，有助于降低高延迟 catalog 场景下的交互成本。

#### 5) Core：为 Variants 增加 JMH 基准相关工作信号
- **Issue**: #15628 [OPEN] Core: Add JMH benchmarks for Variants  
- **链接**: apache/iceberg Issue #15628

虽然是 Issue，但它透露出当前内核层正在补齐 **Variants 类型性能基线**。这类工作常常是功能准备进入更广泛生产使用前的前置信号。

---

## 4. 社区热点

### 热点 1：Flink sink 在 REST catalog 恢复时发生数据重复
- **Issue**: #14425  
- **链接**: apache/iceberg Issue #14425

这是今天最值得优先关注的活跃问题之一，已有 15 条评论。问题描述为：在使用 REST catalog 时，Flink `DynamicIcebergSink` 恢复后发生重复数据写入。  
Issue 中已明确指出修复 PR：
- **关联 PR**: #14517  
- **链接**: apache/iceberg/pull/14517

**背后技术诉求**：  
用户需要的是流式写入场景下的 **故障恢复幂等性** 和 **checkpoint 语义正确性**。对于使用 REST catalog 的生产集群，这类问题影响面很大，因为一旦恢复后重复写入，修复成本往往高于单次任务失败本身。

---

### 热点 2：Kafka Connect 提交状态管理引发重复写与数据丢失风险
- **PR**: #15651  
- **链接**: apache/iceberg PR #15651
- **PR**: #15710  
- **链接**: apache/iceberg PR #15710

尽管评论数未给出，但从提交内容看这是当天最集中的“同一问题域”热点。  
**技术核心**：commit buffer 与 `DataWritten` 事件在部分提交失败、超时、迟到消息下如何隔离。  
**社区信号**：Kafka Connect 正从“可用”走向“生产级一致性增强”，尤其面向 CDC、upsert、批流混合写入场景。

---

### 热点 3：Spark Z-order rewrite 与内部保留列冲突
- **Issue**: #15708  
- **链接**: apache/iceberg Issue #15708
- **PR**: #15706  
- **链接**: apache/iceberg PR #15706

用户表中存在 `ICEZVALUE` 列时，Z-order rewrite 会报出误导性错误；而当重写被跳过时又不报错，导致问题不稳定、难定位。  
**背后诉求**：  
用户希望存储优化操作不仅“能跑”，还要在 schema 边界条件下 **行为一致、报错明确、可提前校验**。

---

### 热点 4：Arrow 与 Iceberg 类型映射文档需求
- **Issue**: #15666  
- **链接**: apache/iceberg Issue #15666

该议题虽然不算严重 bug，但反映出多语言生态用户对 **Arrow / PyArrow / PyIceberg / Java Iceberg 之间类型系统对齐** 的迫切需要。  
这类文档缺失往往会导致：
- 互操作性误解
- 序列化/反序列化行为不一致
- schema 演进边界不清晰

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Flink + REST Catalog 恢复后重复写入
- **Issue**: #14425 [OPEN]  
- **链接**: apache/iceberg Issue #14425
- **影响范围**: Flink sink、REST catalog、故障恢复
- **风险**: 查询结果错误、重复数据、下游去重成本高
- **状态**: 已有 fix PR（#14517）

这是当前最接近生产事故级别的问题，直接影响流式写入正确性。

---

### P1：Kafka Connect 部分提交/超时后 stale DataWritten 混入下一次提交
- **PR**: #15710 [OPEN]  
- **链接**: apache/iceberg PR #15710
- **关联风险**: 重复写入、提交边界污染、RowDelta 语义错误

虽然以 PR 形式出现，但从问题描述看严重性很高，尤其在高吞吐 CDC 场景中可能造成持续性数据质量问题。

---

### P1：HTTPClient TLS hostname verification 回归
- **Issue**: #15598 [OPEN]  
- **链接**: apache/iceberg Issue #15598

该问题被描述为从 1.10 到即将发布的 1.11 之间的 TLS 配置回归。  
**影响**：
- REST/HTTP 访问链路安全性
- 证书校验行为
- 企业环境 HTTPS 部署兼容性

这是典型的“非功能性但高风险”回归，可能阻塞升级。

---

### P2：Spark Z-order rewrite 在存在 `ICEZVALUE` 字段时失败且报错误导
- **Issue**: #15708 [OPEN]  
- **链接**: apache/iceberg Issue #15708
- **Fix PR**: #15706  
- **链接**: apache/iceberg PR #15706

问题主要影响 Spark 存储优化体验和可诊断性，已有快速修复推进。

---

### P2：CopyTable 遇到 position delete files 时抛出 FileAlreadyExistsException
- **Issue**: #14589 [OPEN]  
- **链接**: apache/iceberg Issue #14589

该问题出现在 SparkActions.copyTable() 并行处理 position delete 文件时。  
**影响**：
- 表迁移/复制操作失败
- 含 delete file 的表更容易受影响
- 对运维和数据重组任务不友好

---

### P2：RewriteTablePathUtil.relativize() 在 path 等于 prefix 时异常
- **Issue**: #15172 [OPEN]  
- **链接**: apache/iceberg Issue #15172

这是较典型的路径处理边界条件 bug，会破坏 `rewrite_table_path` 在“根路径刚好相等”场景下的可用性。

---

### P2：SparkSchemaUtil.estimateSize 估算表大小不准确
- **Issue**: #15684 [OPEN]  
- **链接**: apache/iceberg Issue #15684

这不是 correctness bug，但会影响：
- 查询规划
- 成本估计
- 资源申请与性能调优

---

### P3：Flink SQL `USE namespace` 场景下表名不匹配导致静默空读
- **Issue**: #15668 [CLOSED]  
- **链接**: apache/iceberg Issue #15668

虽然已关闭，但值得记录：问题属于 **静默错误**，即不报错却读空数据，这类问题往往比直接异常更难排查。关闭说明该问题已被处理或转入其他修复路径。

---

## 6. 功能请求与路线图信号

### 1) Spark SQL 支持版本/时间范围查询语法
- **Issue**: #15699 [OPEN]  
- **链接**: apache/iceberg Issue #15699

当前 Spark SQL 已支持 `VERSION AS OF` / `TIMESTAMP AS OF` 点查，但缺少范围查询语法。  
**意义**：
- 更适合增量消费
- 更利于审计/变更分析
- 可提升时间旅行能力的 SQL 易用性

由于底层 scan 已支持，说明这更像是 **SQL 语法层补齐**，被纳入后续版本的概率不低。

---

### 2) 新增 week 分区变换
- **Issue**: #14220 [OPEN]  
- **链接**: apache/iceberg Issue #14220

这是一个长期存在的改进请求。现有 day/month/year/hour 已覆盖大部分场景，但 `week` 对周粒度分析和运营报表有现实需求。  
是否纳入版本，取决于：
- 分区规范层是否愿意扩展 transform 集合
- 跨引擎兼容成本
- 谓词下推与计划器支持复杂度

---

### 3) Arrow ↔ Iceberg 类型映射文档
- **Issue**: #15666 [OPEN]  
- **链接**: apache/iceberg Issue #15666

这是生态层需求，落地成本低、收益高，较可能先以文档形式进入近期版本或站点更新。

---

### 4) GCSFileIO 凭证定时刷新
- **Issue**: #15695 [OPEN]  
- **链接**: apache/iceberg Issue #15695

该需求希望将已有凭证刷新能力扩展到 `GCSFileIO`。  
这是典型的云对象存储生产能力增强，若已有类似改动可复用，进入下个补丁/次版本的概率较高。

---

### 5) Variants JMH 基准
- **Issue**: #15628 [OPEN]  
- **链接**: apache/iceberg Issue #15628

这类工作说明 Variants 功能已进入“性能可观测性完善”阶段，是内核能力进一步成熟的信号。

---

### 6) REST/OpenAPI/V4 manifest 持续推进
- **PR**: #15073 [OPEN] SPEC: add boolean to Expression schema  
- **链接**: apache/iceberg PR #15073  
- **PR**: #14142 [OPEN] IRC: Implement Events Endpoint Request & Response Objects  
- **链接**: apache/iceberg PR #14142  
- **PR**: #15049 [OPEN] Introduce foundational types for V4 manifest support  
- **链接**: apache/iceberg PR #15049  
- **PR**: #15669 [OPEN] Add batch load endpoints for tables and views  
- **链接**: apache/iceberg PR #15669

这些 PR 组合起来看，清晰表明 Iceberg 长期路线仍聚焦于：
- REST Catalog 协议增强
- OpenAPI / 规范一致性
- 新一代 manifest / metadata 能力

---

## 7. 用户反馈摘要

### 1) 用户最敏感的仍是“故障恢复后是否重复写”
来自 Flink 和 Kafka Connect 的多个问题显示，用户的核心诉求不是新增功能，而是：
- checkpoint / commit 边界清晰
- 超时后不会重复写
- 恢复后幂等性可靠

这说明 Iceberg 在流式场景中的采用已经进入更深生产阶段。

### 2) 用户对“静默错误”和“误导性报错”容忍度很低
- Flink 空读不报错：#15668  
- Spark Z-order 误导性错误：#15708

这类问题并不总是导致系统崩溃，但会显著拉高排障成本。社区明显开始重视“错误信息质量”和“前置校验”。

### 3) 用户正在要求更完整的多生态兼容文档
- Arrow 类型映射：#15666
- Rust 状态站点更新：#15709

说明 Iceberg 的用户群已经不再局限于 Java/Spark/Flink 主线，而是在 Python、Rust、Arrow 等生态中持续扩张。

### 4) 用户希望云环境中的凭证管理更自动化
- GCSFileIO 凭证刷新：#15695

这类反馈通常来自长期运行的服务型任务，反映出 Iceberg 被广泛部署在云原生、托管型环境中。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期未决事项：

### 1) Kafka Connect 按 topic 路由记录
- **PR**: #11623 [OPEN]  
- **链接**: apache/iceberg PR #11623

创建于 2024-11-22，属于较老但实用价值很高的连接器增强。随着 Kafka Connect 近期重新活跃，这个 PR 值得重新审视。

### 2) Encrypting IO 作为 DelegateFileIO
- **PR**: #14876 [OPEN]  
- **链接**: apache/iceberg PR #14876

该 PR 关注“加密 IO 不应阻碍 bulk operations”。这是企业级部署中的关键议题，长期搁置不利于安全能力落地。

### 3) OpenAPI Expression schema 增加 boolean
- **PR**: #15073 [OPEN, stale]  
- **链接**: apache/iceberg PR #15073

属于规范一致性细节，但会影响 API 生态实现者，适合尽快做出是否接纳的结论。

### 4) Kafka Connect group.id 配置简化
- **PR**: #15234 [OPEN, stale]  
- **链接**: apache/iceberg PR #15234

这项改动能降低配置易错性。考虑到 Kafka Connect 当前是热点方向，该 PR 应该获得更高优先级。

### 5) Events Endpoint Request/Response Objects
- **PR**: #14142 [OPEN]  
- **链接**: apache/iceberg PR #14142

这是 REST/IRC 方向的基础能力建设，虽然不如 bug 修复紧急，但属于长期架构演进的重要拼图。

### 6) week 分区 transform
- **Issue**: #14220 [OPEN]  
- **链接**: apache/iceberg Issue #14220

该请求持续存在，说明用户确有需求。建议维护者明确是否接受进入规范，以减少长期悬而未决状态。

---

## 结论

今天的 Apache Iceberg 呈现出明显的 **“稳定性修复 + 连接器一致性增强 + REST/元数据能力演进”** 三线并进格局。  
短期重点应关注：
1. **Flink 恢复重复写**  
2. **Kafka Connect 提交边界污染/重复写问题**  
3. **TLS 回归与 Spark Z-order 边界条件修复**

中期看，REST Catalog 批量接口、Events Endpoint、V4 manifest 基础类型等工作，正在为 Iceberg 下一阶段的控制面和元数据演进铺路。整体来看，项目活跃度高、问题暴露真实、修复响应较快，健康度保持良好。

如果你愿意，我还可以进一步把这份日报整理成更适合团队同步的 **“管理层摘要版”** 或 **“研发跟进清单版”**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下是 **Delta Lake（delta-io/delta）2026-03-21 项目动态日报**。

---

# Delta Lake 项目动态日报｜2026-03-21

## 1. 今日速览

过去 24 小时内，Delta Lake 社区整体保持 **中高活跃度**：Issues 更新 2 条、PR 更新 38 条，开发重心明显集中在 **Spark / Kernel / CDC / UC Commit Metrics** 等核心方向。  
虽然当天 **没有新版本发布**，但从多个堆叠式 PR 持续推进来看，项目正处于一轮较密集的功能打磨和版本切换窗口，尤其是 **4.2.0-SNAPSHOT** 相关版本变更已经出现。  
稳定性方面，社区新暴露出一个与 **Coordinated Commits + Streaming 回填批次** 相关的数据丢失问题，值得重点关注。  
同时，功能演进信号也较明确：**Spark V2 connector 的 LIMIT push-down** 已有用户提出正式 Feature Request，说明查询下推和执行效率优化仍是用户侧重要诉求。  

---

## 2. 项目进展

> 注：给定数据中未明确列出“已合并”的详细 PR 清单，因此以下重点基于今日 **关闭/推进显著** 的 PR 与活跃开发主题进行归纳。

### 2.1 版本线推进：4.2.0-SNAPSHOT 已进入分支/主干调整阶段
- **PR #6256** - Change master version to 4.2.0-SNAPSHOT  
  链接: https://github.com/delta-io/delta/pull/6256
- **PR #6340** - [Build] Change branch version to 4.2.0-SNAPSHOT  
  链接: https://github.com/delta-io/delta/pull/6340

这两项变更表明项目已开始进入 **4.2.0 开发周期** 的显式版本管理阶段。  
对外信号主要有两点：
1. 主干/分支版本已切到 snapshot，说明近期可能已有一个阶段性版本完成切线；
2. 后续新特性与修复更可能围绕 **4.2.x** 演进，而不是仅做零散补丁。

对 OLAP 用户而言，这通常意味着接下来会持续看到：
- Spark 连接器行为修正；
- Kernel 能力增强；
- 流式与 CDC 场景继续补全；
- UC / DSv2 相关基础设施逐步成熟。

---

### 2.2 CDC 与 kernel-spark 集成持续推进
- **PR #6075** - [kernel-spark] Add initial snapshot CDC support to SparkMicroBatchStream  
  链接: https://github.com/delta-io/delta/pull/6075
- **PR #6076** - [kernel-spark] Add incremental CDC support to SparkMicroBatchStream  
  链接: https://github.com/delta-io/delta/pull/6076
- **PR #6336** - [kernel-spark] Add CDC routing, integration tests to SparkMicroBatchStream  
  链接: https://github.com/delta-io/delta/pull/6336

这是今日最值得关注的一条主线。多个堆叠 PR 共同指向：  
**Delta Kernel 与 Spark MicroBatchStream 的 CDC 支持正在从“初始快照”扩展到“增量消费 + 路由 + 集成测试”完整链路。**

这对分析型存储引擎和下游 OLAP 消费方的意义非常直接：
- 流式读 CDC 的行为会更加统一；
- Spark 侧 CDC 消费路径更接近生产可用；
- 测试补强表明该方向正从原型走向可验证实现。

如果这些 PR 在后续数日继续推进，说明 Delta Lake 正在加强 **变更数据捕获（CDC）与流批一体读路径**，这对数仓增量同步、实时物化视图、近实时湖仓分析都很关键。

---

### 2.3 UC Commit Metrics 进入功能落地阶段
- **PR #6155** - [UC Commit Metrics] Add skeleton transport wiring and smoke tests  
  链接: https://github.com/delta-io/delta/pull/6155
- **PR #6156** - [UC Commit Metrics] Add full payload construction and schema tests  
  链接: https://github.com/delta-io/delta/pull/6156
- **PR #6333** - [UC Commit Metrics] Add feature flag and async dispatch  
  链接: https://github.com/delta-io/delta/pull/6333

这组 PR 表明 **UC Commit Metrics** 不再停留在框架搭建，而是在补齐：
- transport wiring；
- payload/schema；
- feature flag；
- 异步分发机制。

这类能力通常不会直接改变 SQL 语义，但会显著提升：
- 提交链路的可观测性；
- 审计/治理集成；
- 运维排障能力。

从湖仓平台建设视角看，这是一个偏平台基础设施层的重要演进，说明 Delta 不仅在做查询和格式能力，也在增强 **企业级治理与监控闭环**。

---

### 2.4 Spark / SQL 兼容性与测试覆盖增强
- **PR #6342** - [ai-assisted] Gate UC Spark test expectations by version  
  链接: https://github.com/delta-io/delta/pull/6342
- **PR #6165** - [Spark] Add test for case-sensitive insert with column not in target  
  链接: https://github.com/delta-io/delta/pull/6165
- **PR #6329** - [SPARK] Fix preservation of variant stats during DML commands with Deletion Vectors enabled  
  链接: https://github.com/delta-io/delta/pull/6329
- **PR #6162** - [delta-metadata] [Spark] Remove path transformation from Snapshot  
  链接: https://github.com/delta-io/delta/pull/6162

这些改动主要集中在三个方面：

1. **不同 UC 版本下的测试语义分流**  
   说明 Delta 在适配外部生态时，必须面对 UC/Delta handoff 行为随版本差异而变化的问题。  
   这是一种典型的平台兼容性维护信号。

2. **大小写敏感 insert 测试补全**  
   这类问题在 SQL 兼容性中非常常见，尤其对多引擎混用、表 schema 演化、自动列映射场景影响较大。

3. **Deletion Vectors 开启时的 variant stats 保留修复**  
   这是更偏执行与统计信息正确性的修复，可能影响优化器依赖的统计元数据质量，也可能波及 DML 后的数据跳过能力与查询性能稳定性。

4. **Snapshot 路径变换逻辑移除**  
   该改动可能关系到元数据层路径语义的一致性，尤其是在复杂存储路径、跨环境访问、URI 规范差异等场景。

---

### 2.5 协议与文档细节继续收敛
- **PR #6337** - protocol: Clarify that checkpoints exclude tombstoned domain metadatas  
  链接: https://github.com/delta-io/delta/pull/6337
- **PR #6341** - Improve comment clarity in UniForm example  
  链接: https://github.com/delta-io/delta/pull/6341

虽然这类 PR 不直接带来功能扩展，但对于开源存储协议项目来说，**协议文档澄清本身就是稳定性建设的一部分**。  
特别是 #6337，明确了 checkpoint 与 reconciled snapshot 不应包含 `removed=true` 的 `domainMetadata`，有助于减少不同实现之间的理解偏差，降低生态兼容性风险。

---

## 3. 社区热点

### 热点一：Streaming + Coordinated Commits 数据丢失回归
- **Issue #6339** - [bug] [BUG]  
  链接: https://github.com/delta-io/delta/issues/6339
- **PR #6338** - [Spark] Add regression test for streaming data loss with coordinated commits  
  链接: https://github.com/delta-io/delta/pull/6338

这是今天最重要的稳定性热点。  
PR #6338 明确指出：在 **Delta Streaming + Coordinated Commits + 非平凡 backfill batch size** 组合下，存在 **data loss bug**。  
虽然 Issue #6339 摘要信息为空，但 PR 已直接给出复现路径和回归测试，说明问题具有较高可信度。

**背后的技术诉求：**
- 流式读取在复杂提交协调机制下必须保证版本连续性与消费完整性；
- 回填批次（backfill batches）与速率限制、版本打包策略之间可能存在边界行为；
- 对生产用户而言，这类问题优先级很高，因为其影响的是 **数据正确性**，而不是单纯性能。

---

### 热点二：CDC in kernel-spark 持续堆叠推进
- **PR #6075**  
  https://github.com/delta-io/delta/pull/6075
- **PR #6076**  
  https://github.com/delta-io/delta/pull/6076
- **PR #6336**  
  https://github.com/delta-io/delta/pull/6336

虽然给定数据中未包含评论数，但从 PR 结构上看，这是一个持续时间较长、分层推进的堆叠系列，说明其开发复杂度较高。  
这类 PR 往往涉及：
- 协议动作解析；
- 微批边界语义；
- 初始快照与增量 CDC 切换；
- Spark 读接口与 kernel 抽象层的耦合控制。

**技术诉求**：让 Delta Kernel 能更完整地承接 Spark 流式 CDC 能力，增强多执行引擎共享底层能力的可行性。

---

### 热点三：UC Commit Metrics 从框架走向可用
- **PR #6155**  
  https://github.com/delta-io/delta/pull/6155
- **PR #6156**  
  https://github.com/delta-io/delta/pull/6156
- **PR #6333**  
  https://github.com/delta-io/delta/pull/6333

这组 PR 显示该主题并非一次性提交，而是按 transport、payload、feature flag、async dispatch 分步推进。  
**背后的技术诉求** 是：在企业治理、监控、平台可观测性方面，为提交过程提供标准化度量与异步上报能力。  
这通常对大型生产环境很重要，但不一定立即被普通用户感知。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1：Streaming 数据丢失风险
- **Issue #6339** - [bug] [BUG]  
  链接: https://github.com/delta-io/delta/issues/6339
- **相关 PR #6338** - regression test for streaming data loss with coordinated commits  
  链接: https://github.com/delta-io/delta/pull/6338

**严重性：高**  
问题类型：**数据正确性 / 流处理稳定性**  
触发条件：**Coordinated Commits + Streaming + backfill batch size 较复杂时**  
现状：已有 **回归测试 PR**，但从标题看当前更像是“先把问题锁定/复现”，未看到明确修复 PR。  

**影响分析：**
- 可能导致流式消费遗漏部分版本；
- 对依赖 Delta 进行增量摄取、实时数仓同步的用户影响大；
- 若线上使用 Coordinated Commits，建议重点排查相似作业。

---

### P2：DML + Deletion Vectors 下 variant stats 保留问题
- **PR #6329** - [SPARK] Fix preservation of variant stats during DML commands with Deletion Vectors enabled  
  链接: https://github.com/delta-io/delta/pull/6329

**严重性：中高**  
问题类型：**统计信息正确性 / 查询优化稳定性**  
该修复表明在启用 **Deletion Vectors** 时，DML 命令可能破坏或遗漏 variant stats 的保留。  

**潜在影响：**
- 优化器统计失真；
- 数据跳过与查询计划质量下降；
- 某些场景下可能引发性能回退，甚至边界条件下的行为不一致。

目前该 PR 仍处于 open 状态，尚未看到合并结果。

---

### P3：Snapshot 路径变换逻辑可能导致元数据路径不一致
- **PR #6162** - [delta-metadata] [Spark] Remove path transformation from Snapshot  
  链接: https://github.com/delta-io/delta/pull/6162

**严重性：中**  
问题类型：**元数据一致性 / 路径语义兼容性**  
PR 描述中直接提到 “We shouldn't make any transformation to path”，说明现有行为可能已引发实际问题。  

**潜在影响：**
- 非标准路径、URI、云存储路径格式差异场景；
- 元数据层与真实存储路径不一致；
- 跨环境读取、catalog 对接兼容性问题。

---

### P4：增量提交被静默禁用的可观测性不足
- **PR #6327** - Add logging when incremental commit is silently disabled  
  链接: https://github.com/delta-io/delta/pull/6327

**严重性：中**  
问题类型：**可观测性 / 运维排障**  
虽然该 PR 已关闭，但其揭示了一个实际痛点：  
当 incremental checksum validation 失败时，系统会 **静默禁用 incremental commit**。  

这不一定直接造成数据错误，但会导致：
- 运维难以及时识别性能退化根因；
- session 行为变化不可见；
- 生产排障成本上升。

建议后续继续关注是否以其他 PR 形式重新进入主线。

---

## 5. 功能请求与路线图信号

### 5.1 新功能请求：Spark V2 Connector 支持 LIMIT push-down
- **Issue #6326** - [Feature Request][Spark] Support LIMIT push-down in V2 connector  
  链接: https://github.com/delta-io/delta/issues/6326

这是今日唯一明确的新功能需求，且方向非常清晰：  
**在 Spark V2 connector 中实现 `SupportsPushDownLimit`。**

#### 技术价值
对 OLAP 和交互式分析场景，这类优化非常有意义：
- `SELECT ... LIMIT N` 可减少不必要扫描；
- 提高首屏查询、探查式分析效率；
- 在 DataSource V2 模型下，与 filter/projection pushdown 一起形成更完整的下推能力体系。

#### 路线图判断
从当前 PR 动向看，项目已在持续投入 Spark、DSv2、Kernel 能力，因此该需求 **具备被纳入后续版本的合理性**。  
尤其结合：
- **PR #6231** - [DSv2] Add factory + transport: DataWriterFactory, BatchWrite  
  链接: https://github.com/delta-io/delta/pull/6231

尽管 #6231 偏写路径而不是读路径，但它说明 DSv2 相关基础设施仍在积极建设中。  
因此，**LIMIT pushdown 很可能属于接下来值得补齐的读路径优化项**，尤其若社区能给出明确 benchmark 或使用案例，优先级可能提升。

---

### 5.2 4.2.0-SNAPSHOT 是近期版本演进的强信号
- **PR #6256**  
  https://github.com/delta-io/delta/pull/6256
- **PR #6340**  
  https://github.com/delta-io/delta/pull/6340

这意味着后续较可能看到的纳入方向包括：
- CDC 与 streaming 能力补全；
- UC Commit Metrics；
- Spark 兼容性修复；
- Kernel 表特性扩展。

---

### 5.3 Kernel 特性仍在扩展
- **PR #5718** - [KERNEL] Add collations table feature  
  链接: https://github.com/delta-io/delta/pull/5718
- **PR #6322** - [KERNEL][VARIANT] Add variant GA table feature to delta kernel java  
  链接: https://github.com/delta-io/delta/pull/6322

Kernel 方向今天仍然有明显信号。尽管 #6322 已关闭，但它说明 **variant / kernel table feature** 仍在活跃探索和收敛中。  
对于希望将 Delta 作为跨引擎底层格式层的用户，这类演进值得持续关注。

---

## 6. 用户反馈摘要

由于今日 2 条 Issue 均 **评论为 0**，可提炼的直接用户反馈较少，但从 Issue/PR 描述本身仍能观察到一些真实痛点：

### 6.1 用户对查询下推能力有明确期待
- **Issue #6326**  
  https://github.com/delta-io/delta/issues/6326

说明在 Spark V2 connector 使用中，用户已经不满足于基础读写兼容，而开始关注：
- LIMIT 是否能下推；
- 小结果集查询是否足够高效；
- DataSource V2 语义是否完整实现。

这反映出 Delta 在分析查询场景中，已进入“**不仅要能跑，还要跑得精细**”的阶段。

---

### 6.2 流式正确性问题仍是高敏感痛点
- **Issue #6339**  
  https://github.com/delta-io/delta/issues/6339
- **PR #6338**  
  https://github.com/delta-io/delta/pull/6338

虽然没有评论，但 PR 直接以“data loss bug”表述，说明这类问题一旦出现，用户容忍度极低。  
对生产用户来说，最核心诉求是：
- 流式消费不能漏数；
- 提交协调机制不能破坏版本完整性；
- 回填与速率控制策略必须可预测。

---

### 6.3 企业级平台侧需求在增强
- **PR #6155 / #6156 / #6333**  
  https://github.com/delta-io/delta/pull/6155  
  https://github.com/delta-io/delta/pull/6156  
  https://github.com/delta-io/delta/pull/6333

这些 PR 反映平台型用户的需求不再只局限于表格式和 SQL，而是延伸到：
- commit metrics；
- 可观测性；
- 异步遥测/治理集成；
- feature flag 控制。

这说明 Delta 的用户群体中，大规模企业部署和托管平台需求占比可能在提升。

---

## 7. 待处理积压

以下为今日值得维护者重点关注的长期或持续堆叠中的 PR：

### 7.1 PR #5718 - [KERNEL] Add collations table feature
- 链接: https://github.com/delta-io/delta/pull/5718
- 创建时间: 2025-12-17
- 状态: OPEN

这是列表中最老的一项仍开放 PR。  
**风险**：长期未决的 kernel feature 可能导致设计分歧积压，影响外部贡献者预期，也可能拖慢相关 feature 的生态实现。

---

### 7.2 PR #6075 / #6076 - kernel-spark CDC 支持链路
- #6075: https://github.com/delta-io/delta/pull/6075  
- #6076: https://github.com/delta-io/delta/pull/6076  
- 创建时间: 2026-02-19
- 状态: OPEN

这组 PR 已持续一个月以上，且依赖堆叠较深。  
**建议关注点**：
- 是否存在 review 带宽不足；
- 是否需要拆分成更易合并的原子提交；
- 是否能先合并测试/框架层，再落地主功能。

CDC 是高价值方向，长时间堆叠可能影响交付节奏。

---

### 7.3 PR #6155 / #6156 - UC Commit Metrics 系列
- #6155: https://github.com/delta-io/delta/pull/6155  
- #6156: https://github.com/delta-io/delta/pull/6156  
- 创建时间: 2026-02-27
- 状态: OPEN

该系列已从框架发展到 feature flag 与 async dispatch，说明主题成熟度正在提高。  
**建议**：尽快明确该能力的 MVP 范围，避免 telemetry / governance 类功能因设计过宽而长期悬置。

---

### 7.4 PR #6162 - Remove path transformation from Snapshot
- 链接: https://github.com/delta-io/delta/pull/6162
- 创建时间: 2026-02-27
- 状态: OPEN

这类元数据路径语义问题通常影响面较广，建议维护者尽早给出：
- 兼容性判断；
- 是否涉及行为变更；
- 是否需要迁移说明。

---

## 8. 健康度结论

从今日数据看，Delta Lake 项目处于 **活跃且健康的迭代状态**：

- **活跃度**：高，PR 更新数量显著；
- **版本节奏**：已出现 4.2.0-SNAPSHOT 切换信号；
- **功能演进**：CDC、Kernel、DSv2、UC Metrics 多线并行；
- **稳定性风险**：出现一个需要高度重视的流式数据丢失问题；
- **社区需求**：性能优化（LIMIT pushdown）、可观测性、跨版本兼容性仍是主轴。

整体判断：  
Delta Lake 当前正处于一个 **“新能力堆叠推进 + 稳定性边界补洞”并行** 的阶段。若接下来能快速处理 streaming 数据正确性问题，并推动 CDC/UC Metrics 等堆叠 PR 逐步落地，项目健康度将继续保持强势。

--- 

如果你愿意，我还可以继续把这份日报整理成更适合团队周报/飞书消息的 **精简版**，或输出成 **Markdown 表格版**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-21）

## 1. 今日速览

过去 24 小时内，Databend 社区整体保持中等偏上的开发活跃度：共有 **2 条 Issue 更新**、**10 条 PR 更新**，其中 **7 条待合并**、**3 条已关闭**。  
从内容看，今日工作重点集中在 **查询引擎稳定性修复、SQL 重写/绑定重构、存储层 recluster 与 Fuse 读取抽象优化**，属于典型的“内核打磨日”。  
值得注意的是，社区新报告了一个 **递归视图可导致 `databend-query` 崩溃** 的严重 Bug，但同日已有对应修复 PR 提交，说明维护者响应速度较快。  
此外，SQL 兼容性和存储能力也在持续推进，例如 **TEXT/TSV 命名兼容、UNLOAD 参数兼容、FUSE table snapshots experimental tags** 等，体现出项目同时兼顾稳定性与功能演进。  

---

## 2. 项目进展

### 已关闭/完成的 PR

#### 1) feat: rename TSV to TEXT
- **状态**: Closed  
- **链接**: [PR #19580](https://github.com/databendlabs/databend/pull/19580)

该 PR 推动了 Databend 在文件格式命名上的 SQL 兼容性演进：  
- 主要在源码与后续文档中使用 **TEXT** 替代 **TSV**  
- `UNLOAD TO text` 默认后缀由 `.tsv` 调整为 `.txt`
- 同时保留 `TSV` 作为 SQL 别名，以保障兼容性

**意义分析：**
- 对外接口语义更统一，更贴近常见数据库/数据工具的文本格式命名习惯
- 保留 TSV alias，说明维护者在推进规范化时仍优先考虑现有用户兼容性
- 这类改动通常会影响导入导出脚本、数据落盘命名与外部工具链识别，属于“低破坏、高清晰度”的生态优化

---

#### 2) chore: migrate duckdb sql logic test
- **状态**: Closed  
- **链接**: [PR #19582](https://github.com/databendlabs/databend/pull/19582)

该 PR 关闭说明 Databend 持续引入或迁移 **DuckDB SQL logic test** 相关测试资产。  

**意义分析：**
- 有助于提升 Databend 在 SQL 语义、边界行为、回归验证方面的覆盖率
- 对查询正确性与兼容性建设是积极信号
- 虽然是 chore/test 向工作，但对分析型数据库而言，测试体系的持续加强往往比单点功能更能体现工程成熟度

---

#### 3) refactor(sql): improve eager aggregation rewrites
- **状态**: Closed  
- **链接**: [PR #19559](https://github.com/databendlabs/databend/pull/19559)

该 PR 对 `RuleEagerAggregation` 做了结构化重构，拆分了：
- 输入解析
- 候选分配
- rewrite 生成

并扩展了 eager aggregation rewrite 相关能力。

**意义分析：**
- 这是典型的查询优化器内部可维护性提升
- 对后续继续增强聚合下推、预聚合改写、查询计划质量有正向作用
- 虽然不是直接可感知的新特性，但它为后续优化规则扩展打下了更清晰的代码基础

---

## 3. 社区热点

> 说明：本批数据中所有 Issue/PR 的评论数和点赞数都很低，社区热点主要依据“问题严重性 + 是否触发快速修复 + 对核心路径影响范围”判断。

### 热点 1：递归视图可导致 `databend-query` 崩溃
- **Issue**: [#19572](https://github.com/databendlabs/databend/issues/19572)
- **Fix PR**: [#19584](https://github.com/databendlabs/databend/pull/19584)

**现象：**
用户报告访问递归定义视图时，`databend-query` 可能出现 `SIGSEGV` 崩溃。

**技术诉求分析：**
- 这反映出 Databend 在 **视图解析/绑定/递归依赖检测** 上仍存在边界缺口
- 对 OLAP 数据库而言，视图常用于 BI、语义层、复杂查询封装；若递归定义未被充分限制，极易演化为稳定性事故
- 同日已有修复 PR，且策略是 **避免 create/alter recursive views**，说明当前阶段更偏向“提前拦截非法定义”，优先止血而不是放开递归语义支持

---

### 热点 2：解析器断言失败（parse assertion failed）
- **Issue**: [#19578](https://github.com/databendlabs/databend/issues/19578)

**现象：**
在包含嵌套 `UNION` 的查询场景下触发 parser assertion failure，报错显示 AST/规范化结果不一致。

**技术诉求分析：**
- 这是一个典型的 **SQL parser / AST builder 正确性问题**
- 涉及 `UNION` 结合顺序、括号优先级与 canonical form 的一致性
- 对外表现可能是 panic，而不仅是友好报错，因此优先级较高
- 若后续复现稳定，可能引出 parser、formatter、binder 三层联动修复

---

### 热点 3：FUSE snapshots experimental table tags
- **PR**: [#19549](https://github.com/databendlabs/databend/pull/19549)

**技术诉求分析：**
- 该 PR 引入 **KV-backed table tag model**，用于 FUSE 表快照的实验性标签能力
- 背后诉求明显是增强 **表版本管理、可追溯性、快照引用能力**
- 这对数据回溯、实验分支、审计和近似“轻量版数据版本控制”场景很有价值，值得持续关注，可能成为未来版本亮点能力

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1 严重：递归视图可导致 `databend-query` 崩溃
- **Issue**: [#19572](https://github.com/databendlabs/databend/issues/19572)
- **状态**: Open
- **影响**: 访问递归定义视图时可能触发 `SIGSEGV`
- **严重性判断**: 高。属于服务进程级崩溃，影响查询可用性与集群稳定性
- **是否已有修复**: 有，对应 [PR #19584](https://github.com/databendlabs/databend/pull/19584)

**备注：**
修复 PR 的方向是禁止创建或修改递归视图，这意味着短期策略是通过 DDL 校验避免触发运行时崩溃。

---

### P1/P2 边界正确性：parser assertion failed
- **Issue**: [#19578](https://github.com/databendlabs/databend/issues/19578)
- **状态**: Open
- **影响**: 特定 `UNION` 嵌套查询导致解析阶段断言失败
- **严重性判断**: 中高。若在生产中可由普通 SQL 触发 panic，则属于稳定性风险；若仅在 fuzz/特定构造语句触发，则偏正确性缺陷
- **是否已有修复**: 暂未看到直接 fix PR

**建议关注：**
优先确认是否可由外部用户 SQL 稳定触发、是否影响 parser service 主线程、是否已有回归测试覆盖。

---

### P2 存储层稳定性：recluster 后可能生成 oversized compact blocks
- **PR**: [#19577](https://github.com/databendlabs/databend/pull/19577)
- **状态**: Open
- **链接**: [PR #19577](https://github.com/databendlabs/databend/pull/19577)

**问题背景：**
recluster 路径中，排序与 compact 后可能生成超大 block，带来后续读写、内存与性能风险。

**修复方向：**
在 recluster 路径增加 split handling，避免 compaction 后输出超规格 block。

**意义：**
这是典型的 OLAP 存储层“性能问题背后潜藏稳定性风险”的修复，虽不是 crash，但影响长期运行健康度。

---

### P2 兼容性回归修复：UNLOAD 参数组合兼容
- **PR**: [#19583](https://github.com/databendlabs/databend/pull/19583)
- **状态**: Open
- **链接**: [PR #19583](https://github.com/databendlabs/databend/pull/19583)

**背景：**
`include_query_id=true` 与 `use_raw_path=true` 理论上逻辑冲突，但历史上未做校验，已有用户可能依赖该行为。

**修复方向：**
为兼容性允许该组合继续工作。

**意义：**
这是一个典型的“规范性 vs 向后兼容”取舍案例。Databend 当前选择兼容优先，说明对已有用户脚本稳定性较为重视。

---

## 5. 功能请求与路线图信号

### 1) FUSE 表快照 experimental table tags
- **PR**: [#19549](https://github.com/databendlabs/databend/pull/19549)

这是当前最明确的功能演进信号。  
该 PR 不只是小修，而是在 table snapshot/tag 模型上引入新的 **KV-backed** 设计，说明维护者可能正在探索：
- 表快照标签化管理
- 更清晰的 snapshot 引用语义
- 未来与 branch/tag/versioned table 能力结合的可能性

**判断：**
若该 PR 顺利推进，极可能被纳入后续版本的实验特性或 preview 能力。

---

### 2) 聚合索引重写与 Aggr bind 重构
- **PR**: [#19567](https://github.com/databendlabs/databend/pull/19567)
- **PR**: [#19579](https://github.com/databendlabs/databend/pull/19579)

这两个 PR 共同释放出一个路线图信号：  
Databend 正在持续增强 **SQL 绑定与查询优化器重写能力**，特别是：
- 聚合索引 rewrite 的结构化表达式匹配
- 聚合 bind 相关重构

**判断：**
这类工作短期内未必体现为“新 SQL 功能”，但会直接影响：
- 查询计划质量
- 优化规则鲁棒性
- 对复杂分析查询的性能收益

这通常是分析型数据库核心竞争力建设的重要部分。

---

### 3) Fuse block format 抽象统一
- **PR**: [#19576](https://github.com/databendlabs/databend/pull/19576)

该 PR 提取 `FuseBlockFormat` 抽象，并统一 native/parquet 读取转换流程。  

**路线图信号：**
- 存储读路径在走向更统一的抽象层
- 后续新增 block format、优化读 pipeline、降低双路径维护成本会更容易
- 对未来多格式兼容与存储引擎演化是利好

---

## 6. 用户反馈摘要

基于今日公开 Issue/PR 摘要，可提炼出以下真实用户痛点：

### 1) 用户更关注“不会崩”而非“功能多”
- 代表问题：[#19572](https://github.com/databendlabs/databend/issues/19572)
- 视图递归导致 `SIGSEGV`，说明用户已在真实或接近真实的 SQL 使用场景中触达到引擎边界
- 对生产用户而言，最敏感的是 query service 的稳定性和错误隔离能力

### 2) SQL 边界正确性仍是用户感知重点
- 代表问题：[#19578](https://github.com/databendlabs/databend/issues/19578)
- 即便是复杂 `UNION` 语法，也应返回稳定、可解释的错误，而不是 assertion failure
- 用户期待 Databend 在 parser/binder 侧具备更强健的容错与一致性

### 3) 外部脚本/工具链兼容性很重要
- 代表 PR：[#19583](https://github.com/databendlabs/databend/pull/19583)、[#19580](https://github.com/databendlabs/databend/pull/19580)
- 从 UNLOAD 参数兼容和 TEXT/TSV 命名策略可看出，用户场景大量依赖批量导出、文件格式、脚本自动化
- 社区对于“行为保持稳定”“别轻易破坏旧脚本”有明确诉求

---

## 7. 待处理积压

> 本批数据主要覆盖最近数日动态，缺乏长期未响应 issue/PR 的完整列表，因此这里只标注“当前仍待推进、值得维护者重点关注”的项。

### 重点待处理 PR / Issue

#### 1) parser assertion failed
- **Issue**: [#19578](https://github.com/databendlabs/databend/issues/19578)

原因：
- 直接关联 SQL 正确性与 panic 风险
- 当前尚未看到对应 fix PR
- 建议尽快补充最小复现、归类 parser/binder 层责任、加入回归测试

---

#### 2) support experimental table tags for FUSE table snapshots
- **PR**: [#19549](https://github.com/databendlabs/databend/pull/19549)

原因：
- 功能价值高，但设计面较大
- 若 review 周期过长，可能拖慢 snapshot/tag 能力的整体落地
- 建议维护者尽快明确实验特性边界、元数据兼容策略与后续 API 设计方向

---

#### 3) split oversized compact blocks during recluster
- **PR**: [#19577](https://github.com/databendlabs/databend/pull/19577)

原因：
- 影响存储布局与后续读写性能
- 属于“越晚修越容易放大”的数据路径问题
- 建议优先确认是否已有线上案例或 benchmark 证明收益

---

#### 4) improve agg index rewrite matching / Aggr bind
- **PR**: [#19567](https://github.com/databendlabs/databend/pull/19567)
- **PR**: [#19579](https://github.com/databendlabs/databend/pull/19579)

原因：
- 两者都位于 SQL 优化主链路
- 若重构长时间悬而未决，容易与后续 planner/optimizer 变更产生冲突
- 建议维护者协调 review 节奏，避免并行重构互相阻塞

---

## 8. 健康度结论

整体来看，Databend 今日展现出 **较健康的核心研发节奏**：  
- 有严重 Bug 暴露，但 **同日即出现修复 PR**，响应效率较好  
- 查询优化器与存储抽象层持续重构，说明团队并非只做表面功能，而是在系统性提升内核质量  
- 同时，SQL 兼容和导出行为兼容也在推进，体现出对用户实际落地场景的关注  

**风险点** 主要集中在：
1. parser/binder 边界正确性  
2. 视图/复杂 SQL 的崩溃防护  
3. 存储重写与 recluster 路径的稳定性

如果接下来几天能尽快合并递归视图修复，并为 parser assertion 补上修复与回归测试，项目健康度将进一步提升。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报 · 2026-03-21

## 1. 今日速览

过去 24 小时内，Velox 社区保持**高活跃度**：Issues 更新 4 条、PR 更新 50 条，说明项目在核心执行引擎、GPU/cudf、构建链路和存储访问层面都在持续推进。  
今日没有新版本发布，但有多项 PR 已合并或关闭，重点集中在**运行时可观测性增强、Hive 写路径整理、序列化接口回滚修复**等方面。  
从新增与活跃内容看，**cudf/GPU 方向仍是当前最密集的开发主题**，同时 JSON 路径语义、Parquet/Thrift 依赖治理、HashAggregation 执行模型等问题也在释放明确路线图信号。  
整体判断：项目处于**健康且快速迭代**状态，但也暴露出一定的**下游兼容性风险**和**查询正确性回归压力**，需要继续关注。

---

## 2. 项目进展

### 已合并 / 已关闭的重要 PR

#### 2.1 增加文件格式运行时统计，增强查询可观测性
- **PR #16862** `[Merged] feat: Add fileformat runtime stats`  
  链接: facebookincubator/velox PR #16862

该 PR 为查询执行增加了按文件格式维度的 runtime stats，例如 `fileformat.dwrf`、`fileformat.parquet`、`fileformat.nimble` 的 split 数量统计。  
这对 OLAP 场景非常实用，尤其是在混合数据湖或多格式共存环境中，有助于：
- 定位某类格式是否带来性能瓶颈；
- 识别查询是否命中了预期数据源；
- 支撑后续性能分析与存储布局优化。

**价值判断**：这是典型的“低侵入、高收益”改动，明显提升了 Velox 在生产环境中的可观测性能力。

---

#### 2.2 HiveDataSink JSON 字段常量抽取，改善写路径可维护性
- **PR #16863** `[Merged] refactor(hive): Extract JSON field name constants in HiveDataSink`  
  链接: facebookincubator/velox PR #16863

该 PR 将 HiveDataSink 中原本硬编码的 JSON 字段名抽取为作用域常量，并与 Presto Java 侧实现保持镜像一致。  
虽然属于重构类改动，但对分析型引擎而言，这类统一常量的工作可减少：
- 写出元数据时的字段名漂移；
- 与上游/下游生态对接时的兼容性隐患；
- 后续维护中的拼写错误或局部修改引发的不一致。

**价值判断**：偏工程质量改进，但对 Hive 生态兼容和数据落盘语义一致性有长期收益。

---

#### 2.3 回滚 VectorSerde 接口改动，修复下游 Axiom CI 兼容性问题
- **PR #16860** `[Merged] fix: Back out D96046667: "refactor: Remove VectorSerde::kind() method, use static serializer names"`  
  链接: facebookincubator/velox PR #16860
- **PR #16865** `[OPEN] Back out D96046667 and D97378800`  
  链接: facebookincubator/velox PR #16865

#16860 已合并，明确回滚了移除 `VectorSerde::kind()` 的改动，因为该变更导致下游 **axiom CI 失败**。#16865 则显示相关回滚动作还在继续整理。  
这表明：
- Velox 底层序列化接口仍被外部系统直接依赖；
- 即便是看似内部化、抽象化的 API 调整，也会触发较大兼容性影响；
- 项目当前对**下游生态稳定性**的权衡明显趋于保守。

**价值判断**：这是一次重要的稳定性修复，说明维护者对生态兼容问题响应较快。

---

#### 2.4 关闭陈旧构建类 PR，积压清理持续进行
- **PR #15777** `[Closed, stale] feat: Update FB_OS_VERSION`  
  链接: facebookincubator/velox PR #15777

这是一次典型的 stale 关闭，说明项目在持续清理长期悬而未决的构建/环境类改动。  
从健康度角度看，适度清理积压是积极信号；但如果涉及基础构建环境升级，仍建议维护者重新评估是否有替代方案正在推进。

---

## 3. 社区热点

> 由于给定数据未提供精确评论排序值，以下按“技术影响面 + 活跃更新状态 + 描述复杂度”综合判断。

### 3.1 Parquet 去 Thrift 依赖、引入 FBThrift 支持
- **Issue #13175** `[OPEN] Add support for FBThrift in Parquet and remove thrift dependency`  
  链接: facebookincubator/velox Issue #13175

这是今日最值得关注的长期议题之一。问题核心在于：Velox 原生 Parquet reader 仍依赖 thrift，而随着远程函数执行等能力演进，依赖治理和运行时整合压力变大。  
背后的技术诉求包括：
- 减少第三方依赖复杂度；
- 统一 Meta/Facebook 内部与开源侧的 RPC / schema 工具链；
- 为未来远程执行、跨进程/跨服务协同打基础。

**分析**：这不是简单的构建替换，而是牵涉 Parquet 元数据解析链路、依赖边界、可移植性和生态兼容的结构性工作，属于中长期路线图信号。

---

### 3.2 cudf 运行时统计不准确，GPU 异步执行观测模型待补齐
- **Issue #16722** `[OPEN] [enhancement, cudf] Add accurate runtime statistics for cudf operators`  
  链接: facebookincubator/velox Issue #16722
- **PR #16866** `[OPEN] fix(cudf): Improve stream synchronization in barrier operators`  
  链接: facebookincubator/velox PR #16866

该 Issue 指出 Velox 现有 timing 基础设施主要针对 CPU-bound operator，而 cudf operator 把工作异步提交到 CUDA stream 后，`addInputTiming` / `getOutputTiming` 不能真实反映 GPU 工作耗时。  
这与 #16866 中关于 barrier operator 流同步修复形成呼应，说明当前 cudf 路径正在从“功能可用”向“语义准确、可观测、可诊断”演进。

**分析**：GPU 加速在 OLAP 引擎中最难的不只是算子实现，而是异步执行语义与 runtime stats 的统一。该方向很可能继续成为后续迭代重点。

---

### 3.3 JSON wildcard 路径正确性回归
- **Issue #16855** `[OPEN] [bug, triage] get_json_object returns wrong results for [*] wildcard paths with simdjson ≥ 4.0`  
  链接: facebookincubator/velox Issue #16855

这是今日最直接影响 SQL 兼容性的正确性问题之一。问题指出：在 simdjson 4.0 及以上版本中，`get_json_object` 对 `[*]` wildcard path 的处理返回错误结果，并已在 HiveQuerySuite（Spark SQL Hive compatibility tests）中暴露失败。  

**背后技术诉求**：
- 保证 Spark SQL / Hive 兼容行为；
- 控制外部依赖升级带来的语义变化；
- 补齐 JSON path 解析和 wildcard 处理的回归测试。

**分析**：如果 Velox 被用于兼容 Spark/Hive 语义的执行场景，这类问题优先级较高。

---

### 3.4 HashAggregation 任务屏障支持
- **Issue #16856** `[OPEN] [enhancement] Add task barrier support for HashAggregation`  
  链接: facebookincubator/velox Issue #16856

该需求来自 Gluten 使用场景：为了写文件统计信息，使用 local agg-only task，但希望 HashAggregation 支持 task barrier，以降低仅为校验/初始化带来的 task 初始化开销。  

**分析**：这反映出 Velox 正被用于更细粒度、更偏数据写出和文件级统计的执行路径，而不只是传统的查询扫描/聚合。若落地，将有利于：
- 缩短小任务启动成本；
- 优化写路径辅助计算；
- 改善与 Gluten 等上层系统的集成体验。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1 · 查询正确性问题：JSON wildcard 结果错误
- **Issue #16855** `[bug] get_json_object returns wrong results for [*] wildcard paths with simdjson ≥ 4.0`  
  链接: facebookincubator/velox Issue #16855
- **当前状态**：已报告，**暂未看到对应 fix PR**

影响面：
- SQL 函数结果错误；
- Spark SQL Hive 兼容测试失败；
- 与依赖版本升级直接相关，可能影响所有使用较新 simdjson 的环境。

**建议**：尽快补充最小复现、锁定受影响版本范围，并新增回归测试。

---

### P1 · 调试期崩溃 / 连接过滤路径错误
- **PR #16868** `[OPEN] fix: Skip filter evaluation in HashProbe when no rows are selected`  
  链接: facebookincubator/velox PR #16868

该 PR 修复 ANTI JOIN + probe-side join key 过滤条件下，`HashProbe::evalFilter` 触发 `DictionaryVector::validate` debug-only sanity check 崩溃的问题。  
虽然描述为 debug-only crash，但涉及 join/filter 交互逻辑，意味着该路径在边界条件处理上存在缺陷。

**当前状态**：已有 fix PR，响应较快。  
**风险判断**：  
- 对开发/测试环境影响较大；  
- 若逻辑缺陷不只体现在 debug check，也需警惕 release 模式下潜在的错误结果风险。

---

### P1-P2 · GPU 流同步竞态与 barrier 算子一致性问题
- **PR #16866** `[OPEN] fix(cudf): Improve stream synchronization in barrier operators`  
  链接: facebookincubator/velox PR #16866

该 PR 处理多个 CUDA stream 依赖排序问题，包括：
- `getConcatenatedTable` 中使用 CUDA events 做正确流等待；
- 修复 `CudfToVelox::getOutput()` 中 split 使用错误 stream 的竞态；
- 调整对象所有权传递。

这类问题通常会导致：
- 间歇性失败；
- 数据还未准备好即被消费；
- barrier 语义不稳定。

**当前状态**：已有 fix PR。  
**风险判断**：在 GPU 场景下属于高优先级稳定性问题。

---

### P2 · 下游兼容性回归：VectorSerde API 变更导致 CI 失败
- **PR #16860** `[Merged]`  
  链接: facebookincubator/velox PR #16860
- **PR #16865** `[OPEN]`  
  链接: facebookincubator/velox PR #16865

这是典型的 API 兼容性回归，虽不直接影响 SQL 正确性，但会阻断依赖 Velox 的下游系统集成与验证流程。  
**当前状态**：主问题已通过回滚处理。  
**建议**：后续若重做 serde 注册机制，应提供平滑迁移层。

---

### P2 · 构建稳定性问题：CentOS 9 下 gflags 动态库搜索路径缺失
- **PR #16817** `[OPEN] fix(build): Register /usr/local/lib64 with ldconfig after gflags install on CentOS 9`  
  链接: facebookincubator/velox PR #16817

该问题会导致下游构建阶段 `thrift1` 运行时报找不到 `libgflags.so.2.2`。  
这类问题虽然不影响查询结果，但对新环境接入和 CI 成功率有明显影响。  
**当前状态**：已有 fix PR。

---

### P2 · Iceberg Parquet 统计采集构建依赖不完整
- **PR #16867** `[OPEN] fix(build): IcebergParquetStatsCollector requires ParquetWriter`  
  链接: facebookincubator/velox PR #16867

说明 Iceberg + Parquet 统计收集链路的构建依赖声明存在遗漏。  
**当前状态**：已有 fix PR。  
**风险**：对启用相关模块的用户会造成编译/链接失败。

---

## 5. 功能请求与路线图信号

### 5.1 Parquet / Thrift 依赖治理可能进入中期路线图
- **Issue #13175**  
  链接: facebookincubator/velox Issue #13175

该需求已存在较长时间并在今日继续活跃，说明其并非一次性讨论。若 Velox 继续推进远程函数执行和更统一的内部/外部依赖栈，**FBThrift 支持 + 移除原 thrift 依赖**很可能会被纳入后续版本计划。

---

### 5.2 HashAggregation 支持 task barrier，有机会服务 Gluten 等上层集成
- **Issue #16856**  
  链接: facebookincubator/velox Issue #16856

这个需求直接来源于上层集成场景，且与已有 PR 讨论相关，落地可能性较高。  
如果实现，将增强 Velox 在以下场景中的适配性：
- 文件统计生成；
- 小任务执行优化；
- 上层系统对 task 生命周期控制的精细化需求。

---

### 5.3 cudf 方向持续加码，GPU Decimal 与字符串函数正快速补齐
相关活跃 PR：
- **PR #16750** `feat(cudf): GPU Decimal (Part 2 of 3)`  
  链接: facebookincubator/velox PR #16750
- **PR #16751** `feat(cudf): GPU Decimal (Part 3 of 3)`  
  链接: facebookincubator/velox PR #16751
- **PR #16825** `feat(cudf): Add unit tests for CUDF string functions`  
  链接: facebookincubator/velox PR #16825
- **PR #16824** `fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)`  
  链接: facebookincubator/velox PR #16824
- **PR #16732** `fix(cudf): Use enqueueForDevice for cudf buffered input data source`  
  链接: facebookincubator/velox PR #16732
- **PR #16864** `fix(cudf): Remove usage of cudf::detail::gather function`  
  链接: facebookincubator/velox PR #16864

这些 PR 连续覆盖：
- Decimal 函数与聚合；
- 字符串函数测试；
- 异步 IO / device enqueue；
- 公共 API 替换与兼容更新；
- 流同步和 barrier 一致性。

**判断**：cudf 已经不是实验性边缘模块，而是在向更完整的 GPU 执行后端演进，极可能成为下一阶段的重要卖点之一。

---

### 5.4 Hive/Nimble 读取模型继续增强复杂类型支持
- **PR #16820** `[OPEN] Add flatmap-as-struct support into HiveIndexReader`  
  链接: facebookincubator/velox PR #16820

该 PR 处理 flatmap 列在物理层使用 MAP、逻辑输出层使用 ROW 的类型不匹配问题，反映出 Velox 正在继续增强：
- 复杂类型读取；
- LazyVector 子列映射；
- Nimble/Hive 读取路径的一致性。

**判断**：这是面向复杂 schema 生产场景的重要兼容性增强，很可能被纳入近期版本。

---

## 6. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出以下真实用户痛点：

### 6.1 GPU 场景下，“统计不准”和“异步语义难诊断”已经成为主要痛点
- 关联：**Issue #16722**, **PR #16866**  
  链接: facebookincubator/velox Issue #16722  
  链接: facebookincubator/velox PR #16866

用户不再只关注 cudf 算子“能不能跑”，而是在关注：
- runtime stats 是否真实；
- stream/barrier 是否严格有序；
- 间歇性错误是否可定位。

这说明 GPU 用户群体已进入**生产化使用阶段**。

---

### 6.2 SQL 兼容性仍是采用 Velox 的关键门槛
- 关联：**Issue #16855**  
  链接: facebookincubator/velox Issue #16855

`get_json_object` 与 Spark SQL Hive compatibility tests 的失败，说明许多用户把 Velox 放在“兼容现有 SQL 生态”的位置上评估，而不是纯新系统。  
对这类用户而言，**一处 JSON path 行为偏差就可能阻塞上线**。

---

### 6.3 小任务/辅助任务场景下，执行框架开销开始被放大
- 关联：**Issue #16856**  
  链接: facebookincubator/velox Issue #16856

Gluten 使用 local agg-only task 写文件统计时，希望减少 task 初始化开销，说明 Velox 已被用于更细粒度的写前/写后辅助计算。  
用户关注点从“大查询吞吐”延伸到了“轻量任务延迟”。

---

### 6.4 构建与依赖复杂度依然影响开发者体验
- 关联：**Issue #13175**, **PR #16817**, **PR #16867**, **PR #16650**  
  链接: facebookincubator/velox Issue #13175  
  链接: facebookincubator/velox PR #16817  
  链接: facebookincubator/velox PR #16867  
  链接: facebookincubator/velox PR #16650

从 Thrift 依赖、CentOS 9 动态库路径、Iceberg/Parquet 依赖缺失，到 DuckDB 升级适配，都说明 Velox 外围依赖面较宽。  
这对开源采用者来说是实际门槛，尤其是在多发行版、多连接器、多格式组合部署时更明显。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期或潜在积压项：

### 7.1 长期开放的 Parquet/Thrift 架构问题
- **Issue #13175**  
  链接: facebookincubator/velox Issue #13175

创建于 2025-04-28，至今仍活跃，说明问题复杂度高、涉及面广。  
建议维护者明确：
- 是否接受架构方向；
- 是否已有设计草案；
- 与远程函数执行路线是否绑定。

---

### 7.2 DuckDB 大版本升级 PR 持续未落地
- **PR #16650** `[OPEN] build: Upgrade Velox DuckDB from 0.8.1 to 1.4.4`  
  链接: facebookincubator/velox PR #16650

这是跨度很大的依赖升级，涉及头文件引用方式、API 兼容和适配逻辑。  
如果长期悬而未决，可能导致：
- 安全与 bugfix 滞后；
- 与现代 DuckDB 生态脱节；
- 维护成本持续增加。

---

### 7.3 cudf 配置分层重构仍在推进，值得继续跟踪
- **PR #16535** `[OPEN] refactor(cuDF): Separate cuDF query and system configs...`  
  链接: facebookincubator/velox PR #16535

该 PR 试图将 cudf 配置拆为 system/query 两层，并经由 `QueryCtx` 传递。  
这是 GPU 路径走向生产化的必要基础设施，但通常涉及范围大、review 周期长。  
建议维护者优先推动，因为它直接关系到多租户、多 session 下 GPU 配置隔离能力。

---

### 7.4 Decimal 与字符串函数的 GPU 能力链仍未完全合并
- **PR #16750**, **PR #16751**, **PR #16825**, **PR #16824**  
  链接: facebookincubator/velox PR #16750  
  链接: facebookincubator/velox PR #16751  
  链接: facebookincubator/velox PR #16825  
  链接: facebookincubator/velox PR #16824

这些 PR 共同构成 cudf 能力补齐的重要组成部分，但目前仍处于开放状态。  
如果它们迟迟不合并，可能影响：
- GPU Decimal 端到端可用性；
- 字符串函数稳定性；
- cudf 路径对 OLAP 真实 workload 的覆盖度。

---

## 8. 总结判断

今天的 Velox 呈现出非常典型的“**高性能分析引擎快速扩展期**”特征：

- **执行层面**：HashProbe、HashAggregation、barrier、runtime stats 都在继续细化；
- **存储层面**：Hive、Parquet、Iceberg、Nimble 都有活跃改动；
- **生态兼容**：Spark/Hive SQL 兼容与下游 Axiom CI 稳定性被持续关注；
- **GPU 方向**：cudf 已成为最强主线之一，正在从功能扩展迈向可观测性和稳定性治理。

项目健康度总体良好，但短期建议重点盯住两类风险：
1. **查询正确性回归**，尤其是 JSON path / 依赖升级相关问题；  
2. **接口与依赖兼容性**，尤其是 VectorSerde、Thrift、DuckDB、CentOS 构建链路等外围影响面较大的改动。  

如果你愿意，我还可以继续把这份日报整理成：
- **适合飞书/Slack 发布的简版**
- **面向管理层的周报风格摘要**
- **按“执行引擎 / 存储 / GPU / 构建”分组的技术视图**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

以下是 **Apache Gluten 2026-03-21 项目动态日报**。

---

# Apache Gluten 项目日报 · 2026-03-21

## 1. 今日速览

过去 24 小时内，Apache Gluten 社区保持了**较高活跃度**：Issues 更新 7 条、PR 更新 20 条，虽然**无新版本发布**，但开发与问题修复推进明显。  
今日动态集中在 **Velox 后端能力增强、Spark 4.x 测试体系修复、Parquet/Variant 兼容性问题、以及执行路径性能优化**。  
从 PR 关闭情况看，测试正确性与 Variant/PlanStability 相关问题已有实质进展；同时多个新开 PR 指向 **TIMESTAMP_NTZ、Kafka 读取、多线程 GPU shuffle 解压、复杂类型 Parquet 写入** 等功能扩展。  
整体来看，项目当前处于**功能扩展与稳定性补强并行推进**阶段，活跃度偏高，但仍存在若干**正确性与性能回归风险**需要持续跟进。

---

## 3. 项目进展

### 已关闭 / 完成的重要 PR

#### 1) 启用 Variant 测试套件，推进 Spark 4.x 兼容验证
- **PR #11726** `[CLOSED] [CORE, VELOX] [GLUTEN-11550][VL][UT] Enable Variant test suites`  
  链接: apache/gluten PR #11726

该 PR 重新启用了 Spark 4.0/4.1 下的 Variant 相关测试套件，包括：
- `GlutenVariantEndToEndSuite`
- `GlutenVariantShreddingSuite`
- `GlutenParquetVariantShreddingSuite`

这说明社区正在补齐 **Spark 4.x 新类型/半结构化能力** 在 Velox 后端上的验证闭环，对 SQL 兼容性和查询正确性都很关键。  
不过，结合今日新开的 **#11803 Parquet struct nullable 标记错误** 问题来看，Variant 生态虽然在推进，但**底层 Parquet writer 与 Spark 类型语义之间仍有细节不一致**。

---

#### 2) 修复 Spark 4.x 测试“误跑在 Vanilla Spark”问题
- **PR #11799** `[CLOSED] [CORE] [GLUTEN-11550][UT] Fix PlanStability test suites for Velox backend`  
  链接: apache/gluten PR #11799
- **PR #11800** `[OPEN] [CORE] [GLUTEN-11550][UT] Replace GlutenTestsCommonTrait with correct Gluten test traits for Spark 4.0/4.1`  
  链接: apache/gluten PR #11800
- 相关 Issue: **#11550** `[OPEN] Spark 4.x: Tracking disabled test suites`  
  链接: apache/gluten Issue #11550

#11799 已关闭，表明维护者已经识别并修复了一类重要测试问题：部分测试虽然“通过”，但实际上**没有真正加载 Gluten 插件**，等于在 Vanilla Spark 上运行，导致“已 offload”结论失真。  
#11800 继续沿这个方向推进，替换错误测试 trait，进一步清理 Spark 4.0/4.1 的测试基建。

**意义：**
- 提升 CI 信号可信度
- 降低“假通过”风险
- 为后续 Spark 4.x 功能上线提供更可靠的回归保障

这属于典型的**工程质量修复**，虽然不直接新增功能，但对项目健康度影响很大。

---

#### 3) 修复 / 处理多键 DPP 支持问题
- **PR #11795** `[CLOSED] [CORE] Fix multi-key DPP support in ColumnarSubqueryBroadcastExec`  
  链接: apache/gluten PR #11795

该 PR 聚焦 `ColumnarSubqueryBroadcastExec` 在 `BuildSideRelation` 路径中仅处理单 key 的问题，尝试修复多过滤键场景。  
虽然目前状态为 Closed，未显示 merged，但从议题本身看，说明 Gluten 在 **DPP（Dynamic Partition Pruning）列式执行路径** 上仍在完善复杂 join/filter 场景的兼容性。  
这类能力直接影响大规模数仓查询中的**分区裁剪效果与执行效率**，是 OLAP 负载的重要优化点。

---

#### 4) Delta Write fallback writer offload 相关 PR 被关闭
- **PR #11479** `[CLOSED] [stale, VELOX] [GLUTEN-10215][VL] Delta Write: Offload V1 fallback writers`  
  链接: apache/gluten PR #11479

该 PR 今日因 stale/关闭状态被更新，说明 **Delta 写入 offload** 这类写路径增强暂未进入近期落地节奏。  
这释放出一个信号：当前项目重心仍更偏向 **读路径执行、测试正确性、Spark 4.x 兼容、Parquet/Variant**，而不是优先扩展 Delta 写能力。

---

## 4. 社区热点

### 热点 1：Velox 上游 PR 跟踪仍是最活跃长期议题
- **Issue #11585** `[OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream`  
  作者: @FelixYBW | 评论: 16 | 👍: 4  
  链接: apache/gluten Issue #11585

这是今日评论最多、关注度最高的议题之一。  
它本质上反映出 Gluten 对 Velox 后端的深度依赖，以及社区在维护中面临的典型问题：

- 很多能力先在 Gluten 社区提交到 Velox
- 但未及时 upstream merge
- Gluten 不愿长期在 `gluten/velox` 里大量 pick patch，避免 rebase 成本

**背后的技术诉求：**
1. 减少下游维护分叉成本  
2. 加快上游功能可用性  
3. 保持 Gluten 与 Velox 的行为一致性  
4. 降低后续升级阻力

这类 tracker issue 往往是**架构健康度的重要风向标**：如果依赖的上游 PR 长时间不合并，下游功能稳定性与发布节奏都会受影响。

---

### 热点 2：简单 `LIMIT` 查询比 Vanilla Spark 慢 10 倍以上
- **Issue #11766** `[OPEN] [enhancement] [VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`  
  作者: @zhixingheyi-tian | 评论: 6  
  链接: apache/gluten Issue #11766
- 对应修复 PR: **#11802** `[OPEN] [GLUTEN-11766][VL] Implement the executeCollect() method in ColumnarCollectLimitExec`  
  链接: apache/gluten PR #11802

这是今天最值得关注的性能反馈之一。用户报告在最简单的：
```sql
select * from store_sales limit 10;
```
场景下，Gluten + Velox 比 Vanilla Spark **慢 10 倍以上**。

从对应 PR #11802 来看，问题很可能与 `ColumnarCollectLimitExec` 未实现 `executeCollect()` 有关，导致：
- 不能走 Spark 在小结果集上的高效 collect 路径
- 反而触发更多 task / 更重执行链路
- 在典型 BI/交互式查询中被放大

**背后的技术诉求：**
- 低延迟小查询优化
- 列式执行在“短查询 / LIMIT 查询”上的开销控制
- 避免加速引擎在简单场景输给原生 Spark

这类问题对用户感知极强，优先级通常较高。

---

### 热点 3：Spark 4.x disabled tests 跟踪继续推进
- **Issue #11550** `[OPEN] [bug, triage, tracker] Spark 4.x: Tracking disabled test suites`  
  评论: 6  
  链接: apache/gluten Issue #11550

该 issue 今日继续活跃，且已经关联多个 PR（如 #11799、#11800、#11726）。  
这说明 Spark 4.x 适配虽在推进，但仍处于**持续补测、重开、修复误判**的阶段。  
从项目治理角度看，这是正向信号：社区不是简单“先标支持”，而是在回补完整测试矩阵。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Parquet writer 将 struct 字段一律标记为 OPTIONAL，破坏 Spark Variant 类型
- **Issue #11803** `[OPEN] [bug, triage] [VL] Parquet writer marks all struct fields as OPTIONAL, breaking Spark variant type`  
  链接: apache/gluten Issue #11803
- 相关 PR: **#11788** `[OPEN] [VL] Enable native Parquet write for complex types (Struct/Array/Map)`  
  链接: apache/gluten PR #11788

这是今日最严重的正确性问题。  
问题描述表明 Velox Parquet writer 在写 struct 时**无条件将字段 nullable 化**，即便 Spark schema 明确要求 `REQUIRED`。  
这会直接破坏 Spark variant binary format validation，属于**数据语义不一致 / 写出格式错误**问题。

**影响：**
- Variant/复杂类型写入正确性
- Spark 读取校验失败
- 可能影响 Parquet 复杂类型生态兼容

**状态判断：**
- 尚未看到明确 fix PR 专门指向 #11803
- 但 #11788 推进复杂类型原生 Parquet 写入，与此领域高度相关，需重点审查是否引入或暴露了该问题

---

### P1：简单 LIMIT 查询性能比 Vanilla Spark 慢 10 倍以上
- **Issue #11766** `[OPEN] [enhancement] [VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`  
  链接: apache/gluten Issue #11766
- 修复 PR: **#11802** `[OPEN] Implement the executeCollect() method in ColumnarCollectLimitExec`  
  链接: apache/gluten PR #11802

虽然被标为 enhancement，但从用户体验和交互式分析场景看，这已接近**高优先级性能回归**。  
如果 Gluten 在 `LIMIT 10` 这种最常见探索型查询上显著慢于 Vanilla Spark，会直接影响用户采用信心。  
好消息是已有针对性 PR，说明问题定位较快。

---

### P2：S3 文件系统资源清理缺失，`finalizeS3FileSystem` 从未被调用
- **Issue #11796** `[OPEN] [bug, triage] [VL] finalizeS3FileSystem is never called`  
  链接: apache/gluten Issue #11796

问题指出 Velox 使用 AWS C++ SDK + 静态 S3 FileSystem 实例，但应用退出前需要显式 teardown；当前 `finalizeS3FileSystem` 未被调用。  

**潜在风险：**
- 资源清理不完整
- 进程退出阶段异常
- 长生命周期服务或集成环境中的稳定性隐患

这类问题通常不一定影响单次查询结果，但会影响：
- executor 生命周期管理
- 测试环境稳定性
- 云存储接入的可维护性

当前尚未看到 fix PR。

---

### P2：HiveTableScanExecTransformer 中分区文件格式识别性能低
- **Issue #11797** `[OPEN] [enhancement] Improve the performance of getDistinctPartitionReadFileFormats for HiveTableScanExecTransformer`  
  链接: apache/gluten Issue #11797
- 修复 PR: **#11798** `[OPEN] [CORE] Improve the performance of getDistinctPartitionReadFileFormats for HiveTableScanExecTransformer`  
  链接: apache/gluten PR #11798

该问题虽非崩溃/正确性 bug，但会影响 **Hive 分区表扫描路径的规划开销**。  
主要问题包括：
- 对每个 partition 做昂贵转换
- 重复遍历
- 无缓存导致重复计算

在大分区 Hive 表上，这会直接影响分析查询的准备时间。已有修复 PR，预计较可能尽快落地。

---

### P3：Spark 4.x 测试体系存在“假通过”历史问题
- **Issue #11550**  
  链接: apache/gluten Issue #11550
- 已关闭 PR: **#11799**
- 进行中 PR: **#11800**

这不是线上 bug，但属于**质量保障层面的严重隐患**：测试通过不能证明 Gluten 功能真实可用。  
当前已经进入修复阶段，风险正在下降。

---

## 6. 功能请求与路线图信号

### 1) TIMESTAMP_NTZ 支持持续推进，纳入下一版本概率高
- **Issue #11622** `[OPEN] [enhancement, good first issue] [VL] Support TIMESTAMP_NTZ Type`  
  链接: apache/gluten Issue #11622
- **PR #11626** `[OPEN] Add basic TIMESTAMP_NTZ type support`  
  链接: apache/gluten PR #11626

这是一个明确的 SQL 类型兼容性增强项。  
Issue 中已显示部分子任务完成，而 PR #11626 也在持续推进，说明该功能已从需求进入实施阶段。  

**判断：**
- 属于 Spark SQL 语义兼容的重要补齐
- 若测试和 fallback 策略理顺，**较可能进入下一批版本**

---

### 2) Kafka 读取支持是新的重要连接器信号
- **PR #11801** `[OPEN] [VELOX] [VL] Adding kafka read support for Velox backend`  
  链接: apache/gluten PR #11801

这是今天新增功能中最值得关注的之一。  
Kafka source 对流批一体、日志分析、实时数仓都非常关键。  
虽然目前只有 PR，没有对应 issue 讨论细节，但从路线图角度看，这释放出明显信号：**Gluten 正在从核心算子/文件格式优化向数据源接入能力扩展**。

**判断：**
- 若实现完整、测试覆盖到位，可能成为未来版本亮点
- 但连接器功能通常涉及更多边界场景，短期内是否合入仍需观察

---

### 3) GPU shuffle reader 多线程解压，指向更深层传输优化
- **PR #11780** `[OPEN] Support multi-threaded decompression in the GPU shuffle reader`  
  链接: apache/gluten PR #11780

该 PR 显示项目在探索 **GPU shuffle 路径上的并行解压能力**。  
这不是普通功能增强，而是面向高吞吐、大规模数据交换场景的底层优化。  

**路线图信号：**
- Gluten 不仅关注 SQL 兼容，还在强化异构硬件上的数据交换效率
- 对 GPU 加速链路的长期投入仍在继续

---

### 4) 复杂类型原生 Parquet 写入能力正在打开
- **PR #11788** `[OPEN] Enable native Parquet write for complex types (Struct/Array/Map)`  
  链接: apache/gluten PR #11788

这项能力一旦稳定，将显著增强 Velox 后端对复杂 schema 的写支持。  
但结合今日 #11803 可见，**功能开启与类型语义正确性要同步推进**，否则容易在复杂类型场景出现 Spark 兼容问题。

---

### 5) block-level pruning / dynamic filter 能力在铺路
- **PR #11769** `[OPEN] Write per-block column statistics in shuffle writer`  
  链接: apache/gluten PR #11769

PR 通过在 shuffle writer 中写入 block 级列统计信息，为 shuffle reader 侧的动态过滤和块级裁剪铺路。  
这是非常典型的 OLAP 优化方向，有潜力降低网络与扫描成本。  
从技术价值看，这类工作虽然不如连接器显眼，但对大查询性能提升可能更可观。

---

## 7. 用户反馈摘要

结合今日 issue/PR，可提炼出以下真实用户痛点：

### 1) 用户非常关注“简单查询是否真的更快”
代表案例：
- **#11766**  
  链接: apache/gluten Issue #11766

用户不是只看 TPC-DS 长查询，也在直接比较最基础的 `select ... limit ...`。  
这表明 Gluten 的用户群中存在明显的：
- 交互式查询
- BI 探查
- 开发调试型 SQL  
场景。  
在这些场景中，**启动开销、collect 路径、task 数量** 比大查询吞吐更重要。

---

### 2) Spark 4.x 用户正在关注新类型与测试可用性
代表案例：
- **#11550**  
- **#11622**  
- **#11726 / #11799 / #11800**

用户不仅希望“能跑”，还要求：
- 插件真正生效
- 新类型（如 `TIMESTAMP_NTZ`、Variant）语义一致
- 测试与 CI 能真实反映兼容状态

这说明 Gluten 在 Spark 新版本适配上，已进入**深水区的语义一致性与工程可靠性验证**阶段。

---

### 3) 云存储与复杂类型写入场景正在增多
代表案例：
- **#11796** S3 finalize 缺失
- **#11803** Parquet complex/variant 兼容问题
- **#11788** 复杂类型原生写入 PR

说明实际使用场景已经不再局限于纯计算 benchmark，而是深入到：
- S3/对象存储生产环境
- Parquet 复杂 schema 写路径
- 半结构化/Variant 类型分析

---

## 8. 待处理积压

以下长期或高价值 PR/Issue 值得维护者额外关注：

### 1) Velox 上游依赖积压
- **Issue #11585**  
  链接: apache/gluten Issue #11585

这是系统性积压，不是单点 bug。若上游 PR 长期不 merge，Gluten 将持续承担：
- patch 漂移
- rebase 成本
- 行为不一致风险

建议维护者持续梳理优先级，并识别哪些 patch 必须临时 downstream 维护。

---

### 2) 长期开启的性能优化 PR 仍未收敛
- **PR #10543** `Improve the implementation of InputIteratorTransformer`  
  链接: apache/gluten PR #10543
- **PR #10553** `Simplify StrictRule and remove unnecessary DummyLeafExec`  
  链接: apache/gluten PR #10553
- **PR #10573** `Avoid repeated calls to identifiyBatchType`  
  链接: apache/gluten PR #10573

这些 PR 均创建于 2025-08，今日仍有更新，说明属于**长期在审/长期未落地**的性能优化项。  
从描述看，它们与 driver 侧性能、批类型识别开销、规则简化有关，技术价值不低。  
建议维护者明确：
- 是否拆分提交
- 是否需要补 benchmark
- 是否已因架构变化失去合并窗口

---

### 3) BOLT backend 仍处于 WIP
- **PR #11261** `[WIP] add bolt backend in gluten`  
  链接: apache/gluten PR #11261

该 PR 覆盖面广，涉及多个模块，但目前仍是 WIP。  
这类后端级大改动如果长期悬而未决，容易造成：
- review 负担过大
- 分支漂移
- 社区预期不稳定

建议维护者尽快判断：
- 是否分阶段落地
- 是否需要独立 roadmap 说明

---

### 4) stale 但仍有价值的修复/增强项
- **PR #11538** `[OPEN, stale] Copy tags when new local sort node is added by EnsureLocalSortRequirements rule`  
  链接: apache/gluten PR #11538

虽然带 stale 标记，但问题本身关系到计划节点 tag 传递，可能影响规则链路中的元信息一致性。  
若该逻辑影响调优/规则判断，建议重新确认其必要性。

---

## 总体评价

今天的 Apache Gluten 呈现出明显的“双线推进”特征：

- 一条线是 **Velox/Spark 4.x 兼容与稳定性修复**，尤其是测试体系、Variant、Parquet、S3 生命周期；
- 另一条线是 **能力扩展与性能优化**，包括 TIMESTAMP_NTZ、Kafka 读取、GPU shuffle 解压、Hive 扫描优化、shuffle block 级统计。

**项目健康度评价：中上。**  
优势是社区响应快、Issue 到 PR 的转化效率较高；风险在于若干底层正确性问题与长期积压 PR 仍未完全收敛，特别是 **复杂类型写路径、上游 Velox 依赖、短查询性能体验**，值得后续版本重点观察。

如果你愿意，我还可以进一步把这份日报整理成：
1. **适合发到团队群的精简版**  
2. **适合周报汇总的表格版**  
3. **按“性能 / 兼容性 / 稳定性 / 路线图”四象限重组的管理版**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报 - 2026-03-21

## 1. 今日速览

过去 24 小时，Apache Arrow 保持较高活跃度：Issues 更新 25 条、PR 更新 18 条，但没有新版本发布。整体来看，当前工作重心集中在 **Python 开发体验与构建稳定性修复**、**C++/Parquet 边界条件修复**，以及 **Flight SQL ODBC 能力扩展**。  
从关闭与推进情况看，社区正在持续清理历史 stale issue，同时也在快速响应当日新暴露的 CI / macOS / editable install 问题，说明项目维护节奏健康、对回归较敏感。  
另一方面，较多新增与活跃议题仍围绕 **Python API 一致性、文档缺口、Parquet/Compute 正确性、ODBC 生态补齐**，这表明 Arrow 继续沿着“核心格式 + 多语言绑定 + 外部连接能力”三条主线演进。

---

## 3. 项目进展

### 已关闭 / 合并的重点 PR

#### 1) Python 文档补充：`.pxi` doctest 测试路径说明
- PR: #49515  
- 链接: apache/arrow PR #49515
- 状态: 已关闭
- 影响:
  - 说明 Python/Cython 开发中 `.pxi` doctest 并非直接执行，而是通过 `lib.pyx` 编译/测试。
  - 这属于开发者体验优化，减少贡献者在本地测试流程上的困惑。
  - 虽然不直接改变查询引擎或存储能力，但有助于降低 Python 贡献门槛，提升后续修复与功能迭代效率。

#### 2) 文档修订：Arrow 规范中 struct validity masking 说明
- PR: #49554  
- 链接: apache/arrow PR #49554
- 状态: 已关闭
- 影响:
  - 修正了 validity bitmap 示例中的技术不一致。
  - 对于实现 Arrow 兼容引擎、序列化器、向量化执行层的开发者，这类规范文档修订很重要，可减少空值传播/掩码处理实现偏差。
  - 属于格式理解和互操作性层面的稳健性提升。

#### 3) Format 层 clarifying：fp16 Substrait literal 编码说明
- PR: #47847  
- 链接: apache/arrow PR #47847
- 状态: 已关闭
- 影响:
  - 这是格式语义澄清，主要面向 Substrait 生态互操作。
  - 对 SQL 计划跨引擎交换、表达式语义一致性有长期价值。
  - 虽然不是直接功能增强，但对 Arrow 作为“分析中间表示”的生态地位有正向作用。

#### 4) 关闭的探索性 C++20 Concepts 现代化 PR
- PR: #49348  
- 链接: apache/arrow PR #49348
- 状态: 已关闭
- 影响:
  - 表明社区对 C++20 现代化持审慎态度。
  - 短期内，Arrow C++ 核心更关注兼容性与稳定性，而不是大规模语言特性升级。
  - 对下游数据库/执行引擎而言，这是偏保守但健康的信号：API/ABI 风险被严格控制。

#### 5) 关闭的 Python C Data Interface 标量校验 PR
- PR: #44434  
- 链接: apache/arrow PR #44434
- 状态: 已关闭
- 影响:
  - 涉及 `__arrow_c_array__` 长度校验。
  - PR 被关闭意味着这类接口边界校验问题仍需后续明确方案；对依赖 Arrow C 接口做零拷贝集成的项目值得继续关注。

---

## 4. 社区热点

### 热点 1：Python 零行表 `to_batches()` 丢失 schema
- Issue: #49309  
- 链接: apache/arrow Issue #49309
- 评论: 6
- 主题: `[Python] Table.to_batches() loses schema information when table has zero rows`

**分析：**  
这是典型的分析型系统边界条件问题。零行结果集在 ETL、谓词下推过滤后空结果、增量任务探测、SQL planning/explain 阶段都很常见。用户关切的不是“有没有数据”，而是 **空结果是否仍保持 schema 元数据**。  
若 `to_batches()` 返回空列表导致 schema 丢失，会影响：
- 下游写出器（Parquet/IPC）初始化
- 空结果但需保留列定义的 SQL/BI 工具链
- 依赖 schema 进行后续批处理 pipeline 构建的执行框架

这反映出 Arrow 在 Python API 一致性上，用户期待其行为更接近“结构优先”而非“数据优先”。

---

### 热点 2：Python editable install 因 Cython header 安装方式导致失败
- Issue: #49566  
- 链接: apache/arrow Issue #49566
- PR: #49571  
- 链接: apache/arrow PR #49571
- 评论: 3

**分析：**  
这是今天最具“即时修复”特征的问题之一。问题源于 scikit-build-core 默认 editable install 后，本地 import 行为被 header 文件安装逻辑破坏。  
技术诉求背后是：
- Arrow Python 开发流程现代化后，贡献者需要可靠的 editable install 体验
- CI nightly 也受影响，说明不是个别开发环境问题，而是构建/打包链问题
- 维护者反应较快，已出现对应 fix PR，项目对开发者工作流质量较重视

---

### 热点 3：C++ `strptime` `%Z` 被忽略的文档问题
- Issue: #31315  
- 链接: apache/arrow Issue #31315
- 评论: 8

**分析：**  
这是活跃度最高的历史问题之一。表面是文档问题，实质上反映的是 **日期时间解析语义与用户预期不一致**。  
在 OLAP、日志分析、跨时区数据摄取场景中，`%Z` 时区名称支持情况对结果正确性有直接影响。当前 issue 聚焦“至少应明确写入文档”，说明社区短期接受“不支持”，但不能接受“静默忽略”。  
这类问题通常会影响：
- SQL/表达式引擎中的字符串转时间函数
- ETL 导入的可解释性
- Python/R/C++ 多语言绑定的一致文档策略

---

### 热点 4：R 暴露 Azure Blob Filesystem
- PR: #49553  
- 链接: apache/arrow PR #49553

**分析：**  
这是生态连接能力的重要增强。Arrow R 已支持 AWS/GCS，补齐 Azure 代表云对象存储三大主流平台逐步齐备。  
背后信号很明确：Arrow 不仅是内存格式/列式计算库，也在持续加强作为 **跨云数据访问层** 的角色，对数据湖与 lakehouse 工作流意义较大。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1. macOS 14 / Apple clang 构建失败：`std::log2p1` 缺失
- Issue: #49569  
- 链接: apache/arrow Issue #49569
- Fix PR: #49570  
- 链接: apache/arrow PR #49570
- 状态: 已有修复 PR，awaiting merge

**影响评估：**
- 影响 ARM64 macOS 14 Python/C++ 构建任务。
- 这是 CI 级别阻断问题，会直接影响合并效率与发布信心。
- 修复方案通过更精确判断 Apple clang 环境，选择 `std::bit_width` 或 `std::log2p1` 分支，属于编译器兼容性修复。

**结论：**
- 严重程度高，但响应迅速，风险可控。

---

### P1. Python 3.13 freethreading 构建失败：错误移动 const 引用
- Issue: #49565  
- 链接: apache/arrow Issue #49565
- Fix PR: #49567  
- 链接: apache/arrow PR #49567
- 状态: 已有修复 PR，awaiting committer review

**影响评估：**
- 影响 `test-ubuntu-22.04-python-313-freethreading`。
- 该问题与 Python 新运行时/自由线程支持相关，属于前沿兼容性问题。
- 如果 Arrow 计划持续跟进 Python 3.13+ 生态，这是必须尽快修复的阻断项。

**结论：**
- 对未来 Python 兼容矩阵重要，优先级高。

---

### P1. Python editable install 被 Cython API headers 破坏
- Issue: #49566  
- 链接: apache/arrow Issue #49566
- Fix PR: #49571  
- 链接: apache/arrow PR #49571
- 状态: 已有修复 PR，awaiting review

**影响评估：**
- 影响开发者本地 import 和 nightly verification。
- 不一定影响最终用户运行时，但对贡献者工作流和 CI 稳定性影响明显。
- 这类问题若不及时修复，会抬高社区贡献成本。

---

### P1. macOS Intel ODBC CI 意外引入 `libunwind` 依赖
- Issue: #49563  
- 链接: apache/arrow Issue #49563
- Fix PR: #49575  
- 链接: apache/arrow PR #49575
- 状态: 已有修复 PR，awaiting review

**影响评估：**
- 影响 Flight SQL ODBC 在 macOS Intel CI 的依赖检查。
- 问题由 GitHub macOS runner 环境变化触发，说明外部 CI 平台波动已开始影响二进制产物稳定性。
- 对驱动分发、可重现构建和依赖封装有实际风险。

---

### P2. 零行表 `to_batches()` 丢失 schema
- Issue: #49309  
- 链接: apache/arrow Issue #49309
- 状态: 暂无对应 fix PR

**影响评估：**
- 不一定导致崩溃，但会导致 API 语义不完整。
- 对空结果集处理正确性、下游 schema 传播有明显影响。
- 更偏“结果元数据正确性”问题，值得进入下一轮修复。

---

### P2. Parquet WKBGeometryBounder 深度递归可导致栈溢出
- PR: #49558  
- 链接: apache/arrow PR #49558
- 状态: awaiting merge

**影响评估：**
- 面向深度嵌套 `GeometryCollection` 输入时的鲁棒性修复。
- 虽不是今日新报 bug issue，但 PR 已显示问题接近收敛。
- 对地理空间数据接入场景尤其重要，属于典型防御式修复。

---

## 6. 功能请求与路线图信号

### 1) `pa.concat_batches()` 支持 `promote_options`
- Issue: #49574  
- 链接: apache/arrow Issue #49574

**信号判断：**
- 用户希望 `concat_batches` 与 `concat_tables` 行为对齐。
- 这属于 Python API 一致性增强，需求明确、实现边界清晰。
- 若社区认可统一语义，这类增强很可能进入下一版本的小功能迭代。

---

### 2) R 暴露 Azure Blob Filesystem
- PR: #49553  
- 链接: apache/arrow PR #49553

**信号判断：**
- 这不是单纯提案，而是已有实现进入 review。
- 很可能成为下一版本的用户可见功能点。
- 对多云分析、对象存储访问、企业数据湖集成价值较高。

---

### 3) Flight SQL ODBC：Ubuntu 支持
- PR: #49564  
- 链接: apache/arrow PR #49564

**信号判断：**
- 这是非常强的路线图信号。
- 当前 ODBC 主要在 Windows 推进，Ubuntu 支持意味着 Arrow 正把 Flight SQL ODBC 推向跨平台。
- 若该 PR 合并，将显著增强 Arrow 作为分析连接层的落地能力，利好 BI 工具、通用 ODBC 客户端和 Linux 服务端部署。

---

### 4) Windows DLL / MSI 签名 CI
- Issue: #49537  
- 链接: apache/arrow Issue #49537
- 关联长期 PR: #46099  
- 链接: apache/arrow PR #46099

**信号判断：**
- 这是产品化/分发能力提升，不是核心算法功能。
- 但对 ODBC 驱动真正可用、可发布、可被企业环境接受至关重要。
- 说明 Flight SQL ODBC 正在从“可编译”走向“可分发、可安装、可签名”的成熟阶段。

---

### 5) Parquet 加密 bloom filter 读取支持
- PR: #49334  
- 链接: apache/arrow PR #49334

**信号判断：**
- 面向 Parquet 安全特性的完善，属于高级企业场景。
- 一旦合并，将提升 Arrow 在加密数据湖读取、合规数据处理方面的适配能力。
- 对下一版本存储格式能力增强是实质利好。

---

## 7. 用户反馈摘要

### 1) Python 用户最关心“开发和构建流程是否顺滑”
来自 #49566、#49572、#49573、#49503/#49515 的集中反馈表明，用户不只在乎运行时 API，也在乎：
- editable install 是否稳定
- Cython 头文件是否影响 import
- doctest/开发文档是否足够清晰

这说明 PyArrow 已有相当规模的贡献者与二次开发者，开发者体验正在成为核心质量指标。  
链接：
- apache/arrow Issue #49566
- apache/arrow Issue #49572
- apache/arrow PR #49571
- apache/arrow PR #49573
- apache/arrow PR #49515

### 2) 用户希望空数据、异常数据、混合数据都能“结构化正确处理”
相关 issue 包括：
- 零行表 schema 丢失：#49309
- JSON mixed singleton/array 统一视作 array：#31403
- Dataset 路径分区推断误判：#30799（已关闭）
- cast 失败时缺少上下文：#30797（已关闭）

这些反馈共同指向真实生产场景：Arrow 经常被用于“脏数据、异构数据、半结构化数据”的摄取与转换，用户期望系统在这些边界条件下给出稳定、可解释的行为。  
链接：
- apache/arrow Issue #49309
- apache/arrow Issue #31403
- apache/arrow Issue #30799
- apache/arrow Issue #30797

### 3) 时间解析和文档透明度仍是持续痛点
`strptime` 相关问题仍在活跃：
- `%Z` 被忽略但缺少明确文档：#31315
- umbrella 跟踪：#31324

说明用户可以接受部分限制，但不能接受 silent behavior。对分析引擎而言，时间解析错误往往比显式报错更危险。  
链接：
- apache/arrow Issue #31315
- apache/arrow Issue #31324

---

## 8. 待处理积压

以下是值得维护者关注的长期未充分推进议题或 PR：

### 1) Arrow Flight SQL ODBC layer 长期 WIP
- PR: #46099  
- 链接: apache/arrow PR #46099
- 创建时间: 2025-04-10

**提醒：**
- 这是具有战略意义的长期 PR，关联 ODBC 驱动体系建设。
- 目前又出现 Ubuntu 支持、签名 CI、macOS 依赖修复等配套工作，说明主线已具备推进条件。
- 建议维护者评估是否拆分更小 PR 以加速落地。

---

### 2) C++ Compute：rank 对 NaN/null tie-breaking 的正确性修复
- PR: #49304  
- 链接: apache/arrow PR #49304
- 创建时间: 2026-02-17

**提醒：**
- 这是典型查询正确性问题。
- 对窗口函数、排序排名、分析计算结果一致性有实际影响。
- 建议优先 review，因为这类语义修复直接影响 SQL/OLAP 引擎集成质量。

---

### 3) Parquet encrypted bloom filter 读取支持
- PR: #49334  
- 链接: apache/arrow PR #49334
- 创建时间: 2026-02-18

**提醒：**
- 企业级存储特性完善项，技术价值高。
- 长时间停留在 review 阶段可能影响 Parquet 加密能力完整性。

---

### 4) `Table.to_batches()` 零行 schema 丢失
- Issue: #49309  
- 链接: apache/arrow Issue #49309

**提醒：**
- 虽非 crash，但会影响不少上层框架的空结果处理逻辑。
- 建议尽快明确预期语义：返回空 list 是否应伴随 schema 保持机制，或新增替代 API。

---

### 5) 文档与行为不一致的 `strptime %Z`
- Issue: #31315  
- 链接: apache/arrow Issue #31315

**提醒：**
- 历史问题长期未消化，且评论活跃。
- 即便短期不支持 `%Z`，也建议优先合入文档说明，避免继续误导用户。

---

## 总结

今天的 Apache Arrow 呈现出一种典型的“高活跃修整期”状态：没有新版本，但围绕 **Python 构建链、CI 平台兼容性、Parquet/Compute 正确性、Flight SQL ODBC 扩展** 的工作密集推进。  
项目健康度整体较好，原因在于：
- 新暴露的构建/CI 问题基本都已有对应修复 PR
- 长期路线图方向清晰，尤其是 ODBC 和多云文件系统支持
- 文档与开发者体验问题受到持续重视

风险点主要在于：
- 一些影响查询正确性和 API 一致性的议题仍在积压
- ODBC 主线功能虽进展明显，但仍处于多 PR 并行、集成复杂度较高阶段

如需，我还可以继续把这份日报整理成 **“管理层摘要版”** 或 **“研发团队跟进清单版”**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*