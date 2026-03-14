# Apache Doris 生态日报 2026-03-14

> Issues: 5 | PRs: 134 | 覆盖项目: 10 个 | 生成时间: 2026-03-14 01:15 UTC

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

# Apache Doris 项目动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时，Apache Doris 社区保持**高活跃度**：Issues 更新 5 条、PR 更新 134 条，其中 69 条已合并或关闭，说明代码流转和分支回补非常频繁。  
从变更内容看，今日重点集中在**查询引擎能力演进、搜索/倒排索引正确性修复、云与外部数据源集成、内存与缓存优化**几个方向。  
值得注意的是，多个 PR 已进入 `approved/reviewed` 或分支 cherry-pick 阶段，显示 **4.0/4.1 稳定分支维护节奏较强**。  
同时，社区仍存在一些长期悬而未决的问题，例如**单机查询性能异常慢、Nereids 与 Legacy 结果字段不一致、Iceberg REST Catalog 查询失败**，说明在兼容性和可观测性方面仍有改进空间。

---

## 3. 项目进展

### 3.1 查询引擎与 SQL 能力推进

- **ASOF JOIN 功能进入稳定分支**
  - 主 PR 已关闭并进入合并状态，且当天完成了 4.0/4.1 分支回补。
  - 说明 Doris 在**时序对齐类查询**、金融行情/事件流关联等场景上的 SQL 能力继续增强。
  - 相关 PR：
    - [#59591](https://github.com/apache/doris/pull/59591) `[feature](join) support ASOF join`
    - [#61321](https://github.com/apache/doris/pull/61321) `branch-4.1: support ASOF join`
    - [#61320](https://github.com/apache/doris/pull/61320) `branch-4.0: support ASOF join`

- **Nereids 优化器表达式重写继续打磨**
  - `SumLiteralRewrite` 去除冗余整数扩宽 cast，有助于减少不必要的类型膨胀和执行开销。
  - 这是典型的**查询计划精修**，对复杂聚合 SQL 的执行效率和计划质量有正向意义。
  - 相关 PR：
    - [#61224](https://github.com/apache/doris/pull/61224) `[opt](Nereids) strip redundant widening integer cast in SumLiteralRewrite`
    - [#61308](https://github.com/apache/doris/pull/61308) `branch-4.1 cherry-pick`

- **新增聚合函数 entropy**
  - 社区正在推进新的统计类聚合函数 `entropy`，表明 Doris 在**分析函数丰富度**方面持续增强。
  - 相关 PR：
    - [#60833](https://github.com/apache/doris/pull/60833) `[Feature](agg) add agg function entropy`

- **字符串函数增强**
  - `SPLIT_BY_STRING` 增加 `limit` 参数，属于典型 SQL 兼容性与易用性改进。
  - 相关 PR：
    - [#60892](https://github.com/apache/doris/pull/60892) `[feat](function) Add limit parameter support for SPLIT_BY_STRING`

### 3.2 存储、缓存与资源管理优化

- **File Cache 自愈能力修复已关闭**
  - 修复 BE 在重启窗口中出现缓存元数据与本地文件不一致时，条目误判为 `DOWNLOADED` 的问题。
  - 这类问题影响读取稳定性，属于**少见但高价值的鲁棒性修复**。
  - 相关 PR：
    - [#61205](https://github.com/apache/doris/pull/61205) `[fix](filecache) self-heal stale DOWNLOADED entries on local NOT_FOUND`

- **File Cache 热点保护机制仍在推进**
  - 2Q-LRU 机制希望减少预读/大扫描对热点页的挤出，直接对应分析型负载下的缓存命中率问题。
  - 相关 PR：
    - [#57410](https://github.com/apache/doris/pull/57410) `[feature](filecache) A 2Q-LRU mechanism for protecting hotspot data`

- **云环境 FE 内存优化**
  - 对 `CloudTabletRebalancer` 和 `CloudTabletStatMgr` 做内存削减，减少指标抓取和统计过程中的重复计算。
  - 这是偏**控制面/云运维可扩展性**的优化。
  - 相关 PR：
    - [#61318](https://github.com/apache/doris/pull/61318) `[fix](cloud) modify CloudTabletRebalancer and CloudTabletStatMgr to reduce memory`

- **Spill 机制增强**
  - 新增多级分区 spilling，目标是在分区算子内存仍不足时进一步重分区，降低峰值内存。
  - 如果落地，将显著提升大查询在受限内存环境下的完成率。
  - 相关 PR：
    - [#61212](https://github.com/apache/doris/pull/61212) `[feat](spill) Support multi-level partition spilling`

### 3.3 外部数据源与连接器演进

- **JDBC 扫描架构大重构**
  - 计划将 JDBC 扫描统一到 `FileQueryScanNode/JniReader` 框架，替换原有独立 ExternalScanNode 路径。
  - 这是今日最值得关注的架构性改动之一，意味着 Doris 正尝试把**外部源扫描链路统一化**，降低后续 connector 维护成本。
  - 相关 PR：
    - [#61141](https://github.com/apache/doris/pull/61141) `[refactor](jdbc) Unify JDBC scanning into FileQueryScanNode/JniReader framework`
    - [#61206](https://github.com/apache/doris/pull/61206) `test-compatible follow-up`

- **ES Catalog 兼容性修复**
  - 修复 Elasticsearch `keyword/text` 字段实际存储为 array 时 Doris 查询报错的问题。
  - 这是典型的**半结构化外表兼容性问题**，已进入 reviewed 状态。
  - 相关 PR：
    - [#61236](https://github.com/apache/doris/pull/61236) `[fix](es-catalog) Fix query error when ES keyword field contains array data`

- **Routine Load 增强云上接入能力**
  - 支持 AWS MSK IAM 认证，覆盖 Assume Role / 跨账号 / OAUTHBEARER 等场景。
  - 表明 Doris 正继续补齐云 Kafka 生态接入能力。
  - 相关 PR：
    - [#61324](https://github.com/apache/doris/pull/61324) `[feature](RoutineLoad) Support RoutineLoad IAM auth`

- **Amazon Kinesis 方向暂未落地**
  - 相关 draft PR 今日关闭，说明该方向短期内可能暂缓或改为其他实现路径。
  - 相关 PR：
    - [#60051](https://github.com/apache/doris/pull/60051) `[feature](RoutineLoad) Support the Amazon Kinesis`

### 3.4 搜索 / 倒排索引查询正确性修复

- **`MUST_NOT` + NULL 行处理 bug 已修复并回补**
  - `search('NOT msg:omega')` 错误地包含 NULL 行，而 `NOT search('msg:omega')` 行为正确。
  - 主修复已关闭，并当天完成 4.0 / 4.1 分支 cherry-pick，说明维护者判断其对正确性影响较大。
  - 相关 PR：
    - [#61200](https://github.com/apache/doris/pull/61200) `[fix](search) Replace ExcludeScorer with AndNotScorer for MUST_NOT to handle NULL rows`
    - [#61322](https://github.com/apache/doris/pull/61322) `branch-4.0 cherry-pick`
    - [#61323](https://github.com/apache/doris/pull/61323) `branch-4.1 cherry-pick`

### 3.5 导出与格式能力

- **Export 支持 Doris native format**
  - 主 PR 已关闭并进入稳定分支，说明原生格式导出能力正逐步可用。
  - 对数据迁移、备份恢复、系统间高保真传输具有潜在价值。
  - 相关 PR：
    - [#58711](https://github.com/apache/doris/pull/58711) `[Feature](Export) support native format`
    - [#61286](https://github.com/apache/doris/pull/61286) `branch-4.1 cherry-pick`

---

## 4. 社区热点

### 热点 1：3.0.0 Release Note 长期维护，释放路线图信号
- 链接：[#37502](https://github.com/apache/doris/issues/37502)
- 现状：Issue 长期开启，评论 7，👍 13，是今日反馈数最高的 Issue。
- 技术诉求分析：
  - 用户和维护者都在围绕 **3.0.0 的能力边界**进行沉淀，尤其是**存算分离**。
  - 这类 release note issue 往往承担“版本认知入口”的作用，也反映社区对 Doris 3.x 架构升级的持续关注。

### 热点 2：JDBC 扫描统一框架重构
- 链接：[#61141](https://github.com/apache/doris/pull/61141)
- 技术诉求分析：
  - 外部数据源接入链路在 Doris 中越来越重要，统一 FileScanner/JniReader 框架能减少重复实现。
  - 背后反映的是**联邦查询、湖仓互通、连接器统一执行模型**的长期方向。

### 热点 3：单机版查询异常缓慢的用户反馈仍在浮现
- 链接：[#26097](https://github.com/apache/doris/issues/26097)
- 技术诉求分析：
  - “4 万多条数据查询 70 多秒”虽然数据量不大，但对新用户体验杀伤力很强。
  - 背后问题可能涉及：
    - 初始化配置不合理
    - Profile / Explain 能力使用门槛
    - 单机部署默认参数不适配
    - 存储格式与索引/分桶设置不合理
  - 这说明 Doris 在“**首次上手性能可预期性**”方面仍有优化空间。

### 热点 4：Nereids 与 Legacy 结果字段不一致
- 链接：[#27993](https://github.com/apache/doris/issues/27993)
- 技术诉求分析：
  - 这是优化器替换过程中最敏感的问题之一：**不仅要跑得快，还要保证结果 schema/字段映射一致**。
  - 对 BI 工具、JDBC/ODBC 客户端、依赖列名绑定的应用影响较大。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：查询正确性问题 —— 搜索 `MUST_NOT` 错误包含 NULL 行
- 现象：
  - `search('NOT msg:omega')` 会错误包含 NULL 行。
- 影响：
  - 这是**结果正确性问题**，优先级高于一般性能问题。
- 修复状态：
  - 已有修复并已向 4.0/4.1 回补。
- 链接：
  - 修复 PR [#61200](https://github.com/apache/doris/pull/61200)
  - 分支回补 [#61322](https://github.com/apache/doris/pull/61322), [#61323](https://github.com/apache/doris/pull/61323)

### P1：Nereids 与 Legacy 结果字段不匹配
- 现象：
  - 用户报告使用 Nereids 时，select list 与结果字段不匹配。
- 风险：
  - 影响查询结果 schema 一致性，可能导致上层应用解析错误。
- 修复状态：
  - 今日未看到直接对应 fix PR。
- 链接：
  - Issue [#27993](https://github.com/apache/doris/issues/27993)

### P1：Iceberg REST Catalog 可见库表但无法查询数据
- 现象：
  - Doris 4.0.3 配置 Nessie REST Catalog 连接 Iceberg 后，可查看库表，但无法查询数据。
- 风险：
  - 属于外部湖格式接入链路中的**核心可用性问题**。
- 修复状态：
  - 今日未看到明确关联修复 PR。
- 链接：
  - Issue [#61191](https://github.com/apache/doris/issues/61191)

### P2：ES 字段为 array 时查询报错
- 现象：
  - ES 中映射为 keyword/text 的字段若实际存的是数组，Doris 抛类型错误。
- 影响：
  - 影响 ES Catalog 的兼容性与容错性。
- 修复状态：
  - 已有 reviewed 修复 PR。
- 链接：
  - 修复 PR [#61236](https://github.com/apache/doris/pull/61236)

### P2：File Cache 元数据与磁盘状态不一致
- 现象：
  - 稀有重启窗口后，缓存项在内存中被标记为已下载，但本地实际不存在。
- 影响：
  - 导致后续读取异常。
- 修复状态：
  - 已关闭，说明修复已落地。
- 链接：
  - 修复 PR [#61205](https://github.com/apache/doris/pull/61205)

### P3：单机查询异常慢
- 现象：
  - 单机版 4 万行数据查询耗时 70 多秒。
- 影响：
  - 更偏部署/配置/使用体验问题，但对新用户口碑影响显著。
- 修复状态：
  - 暂无明确 fix。
- 链接：
  - Issue [#26097](https://github.com/apache/doris/issues/26097)

---

## 6. 功能请求与路线图信号

结合今日 Issue / PR，可观察到以下较强路线图信号：

### 高概率进入后续版本的能力

- **JDBC 扫描统一框架**
  - 相关 PR 已较深入推进，并有配套测试兼容提交。
  - 这类架构重构通常是后续更多 connector 能力的基础。
  - 链接：
    - [#61141](https://github.com/apache/doris/pull/61141)
    - [#61206](https://github.com/apache/doris/pull/61206)

- **Routine Load 的云原生认证增强**
  - AWS MSK IAM auth 的加入说明 Doris 正增强云消息系统适配能力。
  - 若测试稳定，较可能被纳入后续 4.x 小版本。
  - 链接：
    - [#61324](https://github.com/apache/doris/pull/61324)

- **多级 Spill**
  - 这是提升大查询容错与资源弹性的关键能力，适合云环境和资源紧张场景。
  - 一旦合并，可能成为执行引擎侧的重要增强点。
  - 链接：
    - [#61212](https://github.com/apache/doris/pull/61212)

- **新的 SQL/分析函数**
  - `entropy` 聚合函数、`SPLIT_BY_STRING(limit)` 都显示 Doris 正持续补齐分析函数生态。
  - 链接：
    - [#60833](https://github.com/apache/doris/pull/60833)
    - [#60892](https://github.com/apache/doris/pull/60892)

- **Native format 导出**
  - 主 PR 已完成并向稳定分支传播，落地概率已非常高。
  - 链接：
    - [#58711](https://github.com/apache/doris/pull/58711)

### 可能延期或需要重新设计的方向

- **Routine Load for Amazon Kinesis**
  - Draft PR 已关闭，短期内看不到继续推进的明确信号。
  - 可能意味着需求存在，但实现路径、维护成本或优先级尚未达成一致。
  - 链接：
    - [#60051](https://github.com/apache/doris/pull/60051)

---

## 7. 用户反馈摘要

### 7.1 新用户最敏感的仍是“开箱性能”
- 代表案例：
  - [#26097](https://github.com/apache/doris/issues/26097)
- 反馈表明：
  - 即使是小数据量，若部署参数、表设计、索引或执行计划不理想，用户会直接感知为“Doris 很慢”。
- 启示：
  - 项目可继续加强：
    - 单机/开发环境默认参数
    - 性能排查文档
    - Explain/Profile 可视化与诊断提示

### 7.2 外表/湖仓兼容性是生产落地核心诉求
- 代表案例：
  - [#61191](https://github.com/apache/doris/issues/61191) Iceberg + Nessie REST
  - [#61236](https://github.com/apache/doris/pull/61236) ES 数组字段兼容
  - [#61141](https://github.com/apache/doris/pull/61141) JDBC 扫描统一
- 反馈表明：
  - 用户不只关心 Doris 本地表能力，更关注它作为**统一查询入口**时对外部生态的兼容性和稳定性。

### 7.3 优化器替换阶段，用户对“结果一致性”容忍度极低
- 代表案例：
  - [#27993](https://github.com/apache/doris/issues/27993)
- 反馈表明：
  - 对 OLAP 系统来说，性能提升必须建立在**结果正确和 schema 稳定**基础上。
  - Nereids 的持续优化值得肯定，但仍需加强与 Legacy 的行为一致性验证。

---

## 8. 待处理积压

以下条目建议维护者优先关注：

### 8.1 长期未闭环的正确性/兼容性 Issue

- **[#27993](https://github.com/apache/doris/issues/27993)**  
  `[Bug] User select list can't match result field when using nereids`  
  创建于 2023-12-05，至今仍开放。涉及优化器结果字段映射一致性，建议尽快确认是否已被后续改动隐式修复，或补充回归测试。

- **[#26097](https://github.com/apache/doris/issues/26097)**  
  `[Stale] Doris单机版查询特别慢`  
  创建于 2023-10-30，长期未解决。尽管被标记 stale，但其代表了非常典型的新用户体验问题，建议提供标准化诊断模板或 FAQ。

### 8.2 长期开放、价值较高的功能 PR

- **[#57410](https://github.com/apache/doris/pull/57410)**  
  `[feature](filecache) A 2Q-LRU mechanism for protecting hotspot data`  
  创建于 2025-10-28，属于缓存体系的重要优化，建议明确当前评审阻塞点。

- **[#59847](https://github.com/apache/doris/pull/59847)**  
  `[feature](score) support BM25 scoring in inverted index query_v2`  
  搜索相关能力是 Doris 新场景的重要增长点，BM25 若能落地，将明显增强文本检索能力。

- **[#60559](https://github.com/apache/doris/pull/60559)**  
  `[enhancement](workload policy) Add username-based backend workload policy support`  
  该能力对多租户和资源治理场景较有价值，建议持续推进。

- **[#60897](https://github.com/apache/doris/pull/60897)**  
  `[feat](condition cache) Support condition cache for external table`  
  若落地，可能改善外表重复查询性能，但目前带有 `lfs-detected!` 标识，可能存在流程阻塞。

---

## 总体判断

今天的 Apache Doris 呈现出**高频迭代、稳定分支维护积极、查询与外部生态能力并进**的健康状态。  
从合并和回补内容看，维护者对**查询正确性、稳定性修复、4.0/4.1 版本可用性**较为重视。  
不过，从用户反馈侧看，**优化器一致性、外部表可查询性、单机体验与性能可解释性**仍是最需要持续投入的几个方向。  
整体而言，项目健康度良好，且明显处于**功能扩展与稳定性打磨并行推进**阶段。

---

## 横向引擎对比

以下是基于 2026-03-14 各项目社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# OLAP / 分析型存储引擎开源生态横向对比分析报告
**日期：2026-03-14**

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储开源生态整体保持 **高频迭代、强工程推进、稳定性压力上升** 的态势。  
头部项目普遍呈现“双线并行”特征：一边继续推进 **SQL 能力、湖仓连接器、协议/接口生态、半结构化支持**，另一边集中修复 **查询正确性、版本回归、内存/资源泄漏、可观测性不足** 等生产问题。  
从横向观察看，**湖仓互通、外部 Catalog/Connector、执行引擎正确性、可观测性与资源治理** 已成为跨项目共识方向。  
同时，不同项目已明显分层：有的仍处于 **功能快速扩张期**，有的正进入 **版本稳定化与质量收敛期**，还有的在做 **底层架构重构或生态接口标准化**。

---

## 2. 各项目活跃度对比

> 注：Apache Iceberg、Velox 当日摘要生成失败，以下表格仅统计已提供项目。

| 项目 | Issues 更新 | PR 更新 | Release 情况 | 当日主线 | 健康度评估 |
|---|---:|---:|---|---|---|
| **ClickHouse** | 37 | 265 | 无 | 26.2 回归修复、analyzer 正确性、可观测性、全文检索 | **高活跃，承压明显** |
| **Apache Doris** | 5 | 134 | 无 | 查询引擎演进、搜索正确性修复、云与外部源集成、缓存/内存优化 | **高活跃，健康良好** |
| **StarRocks** | 8 | 103 | 无 | Iceberg/Paimon 兼容、窗口函数 skew 优化、JSON/生命周期修复 | **高活跃，修复节奏强** |
| **DuckDB** | 16 | 41 | 无 | Parquet/S3 回归修复、Variant 稳定性、执行器 internal error | **活跃但处于回归治理期** |
| **Delta Lake** | 0 | 33 | 无 | DSv2 读写、UC 兼容、DV/CRC 正确性、测试收敛 | **中高活跃，工程扎实** |
| **Apache Gluten** | 5 | 29 | 无 | Spark 4.x 兼容、Velox 对齐、内存释放、CI/构建治理 | **较高活跃，平台化推进中** |
| **Apache Arrow** | 27 | 17 | 无 | Gandiva 稳定性、Flight SQL ODBC、Python 文档、Parquet 能力 | **稳健活跃，质量导向明显** |
| **Databend** | 3 | 9 | 无 | 递归 CTE、子查询 decorrelate、runtime filter、table tags 重构 | **中高活跃，核心能力重构中** |

### 活跃度简评
- **第一梯队（超高活跃）**：ClickHouse、Apache Doris、StarRocks  
- **第二梯队（高活跃）**：DuckDB、Delta Lake、Gluten、Arrow  
- **第三梯队（定向推进）**：Databend  

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势

与同类 OLAP 引擎相比，Apache Doris 今天展现出的优势主要在三个方面：

1. **主线开发与稳定分支维护并重**  
   Doris 当日 PR 更新 134 条，且大量改动进入 `approved/reviewed/cherry-pick`，说明不仅主干活跃，**4.0/4.1 稳定分支维护力度也较强**。  
   这点优于很多仅主干活跃、但稳定版回补节奏较弱的项目。

2. **“内表分析 + 外部生态 + 搜索能力”三线并进**
   - 内核侧：ASOF JOIN、Nereids 表达式优化、entropy 聚合、spill 增强
   - 外部侧：JDBC 扫描统一、ES Catalog 修复、Routine Load IAM
   - 搜索侧：倒排索引 `MUST_NOT + NULL` 正确性修复、BM25 等长期能力储备  
   Doris 的路线不是只做单纯 MPP OLAP，而是朝 **统一分析入口 + 搜索增强 + 湖仓互通** 的方向扩展。

3. **用户可见功能迭代速度快**
   当天既有 SQL 能力新增，也有 native format export、外部认证增强、缓存/云优化等落地项，说明其演进兼顾 **用户可感知能力** 与 **底层稳态优化**。

### 3.2 Doris 的短板与压力点

与 ClickHouse、DuckDB、StarRocks 相比，Doris 当前仍有几类明显短板：

- **优化器一致性问题仍未完全出清**  
  Nereids 与 Legacy 结果字段不一致，属于非常敏感的结果 schema 一致性问题。
- **外部表/湖仓接入可查询性仍需加强**  
  例如 Iceberg REST Catalog 能看到表但无法查询，是典型“接上了但不稳定”的问题。
- **新用户开箱性能预期管理不足**  
  单机小数据查询异常慢的问题长期未闭环，说明在默认参数、诊断文档、Explain/Profile 易用性上仍有改进空间。

### 3.3 与同类技术路线差异

- **相对 ClickHouse**：Doris 更强调一体化分析引擎与外部源统一接入，ClickHouse 更偏强内核、高性能、强分布式，但最近在 analyzer 正确性和回归治理上压力更大。
- **相对 StarRocks**：两者路线接近，均强调 MPP + 湖仓外表；Doris 在搜索/倒排索引与导出能力上更活跃，StarRocks 在窗口函数 skew、企业安全链路和 Iceberg 统计侧推进更强。
- **相对 DuckDB**：Doris 偏服务端分布式 OLAP，DuckDB 偏嵌入式/单机分析与数据湖本地执行。
- **相对 Delta/Iceberg/Arrow**：Doris 属于“可查询执行引擎”，后者更多是“表格式/协议/底层数据层”。

### 3.4 社区规模对比

按当日活动量粗看：
- **ClickHouse** 社区体量仍最大
- **Doris 与 StarRocks** 位于第二梯队头部
- **DuckDB** 虽 PR/Issue 总量略低，但用户问题密度与真实生产反馈非常高
- **Delta / Arrow / Gluten / Databend** 则更多体现为方向性推进

**结论**：Doris 已稳居 OLAP 主流开源阵营核心位置，且具备较强版本维护能力；其竞争优势在于 **综合能力全面**，挑战在于 **优化器一致性与外表稳定性**。

---

## 4. 共同关注的技术方向

以下是多个项目共同涌现的重点方向：

### 4.1 湖仓互通与外部数据源统一接入
**涉及项目**：Doris、StarRocks、ClickHouse、DuckDB、Delta Lake、Arrow  
**具体诉求**：
- Doris：JDBC 扫描统一框架、ES Catalog 修复、Iceberg REST 查询问题
- StarRocks：Iceberg averageRowSize、Parquet FIXED_LEN_BYTE_ARRAY 兼容、Paimon 权限链路
- ClickHouse：Unity Catalog 读取复杂对象类型、Remote database engine 需求
- DuckDB：Parquet/S3 访问性能、Hive partition 剪枝
- Delta Lake：UC 管理表元数据一致性、staging catalog 扩展
- Arrow：Flight SQL ODBC 产品化交付

**共同信号**：  
分析引擎正从“本地表做得快”转向“**成为统一查询入口/统一数据访问层**”。

---

### 4.2 查询正确性优先级显著上升
**涉及项目**：Doris、ClickHouse、StarRocks、DuckDB、Arrow、Databend  
**具体诉求**：
- Doris：`MUST_NOT` + NULL 结果错误、Nereids schema 不一致
- ClickHouse：correlated EXISTS 静默错结果、analyzer crash
- StarRocks：简单查询缺行
- DuckDB：json→variant internal error、unnest/join 回归
- Arrow：pre-epoch 时间戳 cast 错误、Gandiva 极值崩溃
- Databend：相关子查询 LIMIT decorrelate、大 IN-list 栈溢出

**共同信号**：  
行业竞争已从“谁更快”升级为“**谁在复杂 SQL 和边界场景下更可信**”。

---

### 4.3 可观测性、诊断与日志增强
**涉及项目**：ClickHouse、Doris、DuckDB、Arrow、Gluten  
**具体诉求**：
- ClickHouse：query log 补全、skip index 使用信息、internal queries 记录
- Doris：单机性能慢反映 Explain/Profile 门槛高
- DuckDB：远程 I/O 放大需要更可解释的 planner/reader 行为
- Arrow：文档构建、类型提示、CI 噪声治理
- Gluten：CI 并发、构建脱敏、依赖治理

**共同信号**：  
开源分析引擎不再只拼功能，正在补“**可排障、可解释、可审计**”这条企业级必经之路。

---

### 4.4 内存管理、资源治理与执行稳态
**涉及项目**：Doris、ClickHouse、DuckDB、StarRocks、Gluten、Databend  
**具体诉求**：
- Doris：多级 Spill、Cloud FE 内存优化、File Cache 自愈
- ClickHouse：Compact part double free、重复解压缩、写入性能回退
- DuckDB：Appender API OOM、WAL checkpoint 受安全配置阻塞
- StarRocks：MemTracker UAF 修复
- Gluten：ColumnarBatch 泄漏、BufferedInput 取消加载过晚
- Databend：聚合内存泄漏、hash shuffle 重构

**共同信号**：  
资源管理已经成为所有引擎的核心竞争点，尤其在 **云环境、对象存储、复杂查询并发** 下更明显。

---

### 4.5 SQL 能力扩展与兼容性补齐
**涉及项目**：Doris、ClickHouse、DuckDB、Databend、StarRocks  
**具体诉求**：
- Doris：ASOF JOIN、entropy、SPLIT_BY_STRING(limit)
- ClickHouse：ADD ENUM VALUES、WASM UDF、new analyzer 适配
- DuckDB：变量语法、事务化 PRAGMA/MultiStatements
- Databend：递归 CTE、相关子查询 decorrelate
- StarRocks：窗口函数 skew hint

**共同信号**：  
SQL 能力仍在持续演进，但扩张同时带来更多 **语义一致性和回归测试压力**。

---

## 5. 差异化定位分析

## 5.1 存储格式与数据层定位

| 项目 | 核心数据层定位 |
|---|---|
| **Apache Doris** | 自有存储引擎 + 外部表/对象存储/湖仓接入并重 |
| **ClickHouse** | 以 MergeTree 家族为核心，强内表能力最突出 |
| **StarRocks** | 自有 MPP 存储 + Lakehouse 外表能力快速增强 |
| **DuckDB** | 本地执行 + Parquet/对象存储直读最强势 |
| **Delta Lake** | 表格式/事务层，核心不是执行器而是存储协议与 Spark/Kernel 集成 |
| **Apache Arrow** | 列式内存格式、Flight、Parquet 等底层数据交换与执行基础设施 |
| **Databend** | 云原生存储与 FUSE snapshot/version 模型持续演进 |
| **Gluten** | Spark 列式执行加速层，依赖 Velox/后端引擎，不是独立存储系统 |

---

## 5.2 查询引擎设计差异

| 项目 | 查询引擎设计特点 |
|---|---|
| **Doris** | MPP OLAP，强调一体化 SQL、搜索、联邦接入 |
| **ClickHouse** | 极致性能导向，执行内核成熟，但 analyzer 迁移期风险高 |
| **StarRocks** | MPP + CBO + 湖仓协同，企业级外表接入更重 |
| **DuckDB** | 嵌入式向量化执行，单机/本地分析与数据湖读取优势明显 |
| **Databend** | 云原生 SQL 引擎，正补齐复杂 SQL 与快照版本管理 |
| **Gluten** | 作为 Spark 执行加速层，目标是以列式后端替换部分 Spark 执行路径 |
| **Arrow** | 更偏执行与交换基础库，不直接作为完整 SQL 引擎使用 |
| **Delta Lake** | 主要是表协议与事务语义，不是独立查询内核 |

---

## 5.3 目标负载类型差异

- **Doris / StarRocks / ClickHouse**：面向服务端 OLAP、交互式分析、报表、实时分析
- **DuckDB**：面向本地分析、嵌入式计算、Notebook、数据科学、轻量 ETL
- **Delta Lake / Arrow**：偏数据平台底座、湖仓协议与跨引擎数据交换
- **Databend**：偏云数据仓库与云原生分析
- **Gluten**：偏 Spark 生态加速与大数据执行优化

---

## 5.4 SQL 兼容性成熟度差异

- **ClickHouse / Doris / StarRocks**：功能丰富，但都在面临新优化器/新执行路径带来的正确性挑战
- **DuckDB**：SQL 能力扩张快，复杂边界场景仍在快速修复
- **Databend**：正补齐递归 CTE、相关子查询等“高级 SQL 完整度”
- **Delta Lake / Arrow**：不以 SQL 前端完整性为核心竞争点
- **Gluten**：SQL 兼容本质受 Spark 语义约束，更关注转换后的一致性

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：超高活跃、生态头部
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特点：
- PR 流转快
- 用户反馈密集
- 稳定分支维护明显
- 既有功能推进，也有回归压力

### 第二层：高活跃、方向清晰
- **DuckDB**
- **Delta Lake**
- **Apache Arrow**
- **Apache Gluten**

特点：
- 围绕特定主线持续推进
- 用户问题更聚焦
- 工程质量和接口能力建设占比较高

### 第三层：核心功能重构期
- **Databend**

特点：
- 总量不大，但改动更集中在内核和元数据关键路径
- 适合持续观察中长期产品方向

---

## 6.2 成熟度判断

### 处于“快速迭代阶段”的项目
- **DuckDB**：1.5.0 后回归修复和新类型稳定化并行
- **Databend**：递归 CTE、table tags、branch 重构明显
- **Gluten**：Spark 4.x 兼容与 Velox 对齐密集推进

### 处于“质量巩固阶段”的项目
- **ClickHouse**：26.2 稳定性和 analyzer 风险集中暴露
- **Doris**：4.0/4.1 回补活跃，正确性修复优先级高
- **StarRocks**：企业权限链路、外表兼容与执行正确性持续收敛
- **Delta Lake**：DSv2 与 UC 路线下的工程夯实
- **Arrow**：底层函数、ODBC、文档与构建体系持续打磨

---

## 7. 值得关注的趋势信号

## 7.1 分析引擎正在全面“湖仓化”
越来越多项目把重点放在：
- Iceberg / Delta / Paimon / Parquet / REST Catalog
- JDBC / ES / Unity Catalog / Flight SQL
- 外部表统计、类型兼容、权限链路、一致性保障

**对架构师的启示**：  
未来选型不能只看本地表性能，必须评估其作为 **统一数据访问层** 的成熟度。

---

## 7.2 查询正确性重新成为核心竞争力
多个头部项目都出现：
- silent wrong result
- schema 不一致
- 缺行/错行
- 新优化器 crash 或边界错误

**对数据工程师的启示**：  
在新版本切换、开启新优化器、新扫描框架、新执行路径前，应建立：
- SQL 回归集
- 结果一致性校验
- explain/profile 基线
- 升级灰度机制

---

## 7.3 可观测性与可解释性正在从“加分项”变为“必需品”
从 query log、skip index 日志、internal query 记录，到 Profile/Explain 易用性，再到 CI/构建脱敏和文档质量，大家都在补这块短板。

**对平台团队的启示**：  
选型时要把以下能力纳入评估：
- query profile 可读性
- system/query log 完整度
- 外部表扫描可解释性
- 性能异常诊断成本

---

## 7.4 云环境下资源弹性与内存治理成为硬指标
Spill、多级分区、cache 自愈、对象存储 I/O 合并、内存泄漏修复、WAL/checkpoint 与安全策略兼容，都是今天的高频主题。

**对架构师的启示**：  
在云上负载中，真正决定可用性的往往不是峰值性能，而是：
- 内存峰值控制
- spill 策略
- 远程 I/O 放大情况
- 长时间运行后的资源稳定性

---

## 7.5 SQL 功能扩张正在逼近复杂场景深水区
ASOF JOIN、递归 CTE、复杂子查询 decorrelate、WASM UDF、变量语法、窗口函数 skew hint 等都在推进。

**对数据工程师的启示**：  
新功能价值很高，但应同步关注：
- 结果语义是否与主流数据库一致
- BI/驱动/schema 兼容性
- 复杂 SQL 的边界回归
- 执行计划是否可控

---

# 总结结论

从 2026-03-14 的横向观察看，开源 OLAP / 分析型存储生态已经进入一个非常明确的新阶段：

1. **不再只是比单点性能，而是比统一分析入口能力**  
2. **不再只是拼功能数量，而是拼复杂 SQL 下的正确性与稳态**  
3. **不再只是做存储或引擎单点，而是向湖仓互通、协议兼容、可观测平台演进**

对 **Apache Doris** 而言，其当前处于一个很有竞争力的位置：  
- 社区活跃度高  
- 稳定分支维护强  
- SQL / 搜索 / 外部生态能力均在扩张  
- 具备成为“综合型分析平台”的潜力  

但若要进一步巩固生态地位，接下来最关键的仍是三点：  
**优化器一致性、外部表可查询性、以及新用户性能可解释性。**

如果你愿意，我还可以继续把这份报告转换为以下任一版本：
1. **适合管理层汇报的 1 页精简版**
2. **适合技术委员会评审的 PPT 大纲版**
3. **按 Doris vs ClickHouse vs StarRocks 的三强对比专题版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时 ClickHouse 仓库保持**高活跃度**：Issues 更新 37 条，PR 更新 265 条，说明社区反馈、CI 信号和功能开发都非常密集。  
从内容看，今日重点集中在 **26.2 版本回归与稳定性修复**、**analyzer / SQL 正确性问题**、以及 **可观测性与全文检索相关改进**。  
PR 侧既有面向未来版本的功能开发，如 Arrow Flight SQL、WASM UDF、ENUM 扩展，也有若干针对线上可见问题的快速修复，显示项目处于**“新特性推进 + 稳定性收敛并行”**状态。  
整体健康度仍然较强，但 26.2 相关的性能回退、崩溃和行为变化问题值得维护者持续关注。

---

## 3. 项目进展

以下为今日值得关注的已关闭/推进中的重要 PR 动向，按“对查询引擎、存储、SQL 兼容性”的影响归类。

### 3.1 已关闭/实质推进的修复

- **修复 Compact MergeTree part 的非确定性 `uncompressed_hash`**
  - PR: #97522  
  - 链接: ClickHouse/ClickHouse PR #97522
  - 影响：解决 Compact part 校验值因 `unordered_map` 遍历顺序不同而出现不稳定的问题，这类问题会影响副本一致性判断、校验、调试排障。
  - 意义：属于**存储层一致性与可复现性增强**，对 MergeTree 系列引擎稳定性有正向作用。

- **修复 implicit minmax index metadata 解析问题**
  - PR: #99383  
  - 链接: ClickHouse/ClickHouse PR #99383
  - 影响：修复 25.12 分支上与 RMT metadata / implicit minmax index 元数据解析相关的 bug。
  - 意义：属于**索引元数据兼容性修复**，有助于减少升级后索引行为异常。

- **依赖更新：pyjwt**
  - PR: #99479、#99480（已关闭）
  - 链接: ClickHouse/ClickHouse PR #99479 / #99480
  - 影响：主要是 CI / docker 环境依赖升级。
  - 意义：偏维护性，对用户侧功能影响较小。

### 3.2 今日新增或推进中的关键 PR

- **修复 CREATE ROW POLICY with alias 的 AST 格式不一致**
  - PR: #99463  
  - 链接: ClickHouse/ClickHouse PR #99463
  - 对应 Issue: #99314  
  - 影响：修复 SQL 解析/格式化中的逻辑错误，提升 row policy 语法稳定性。
  - 判断：这是一个**快速闭环**案例，说明维护者对 fuzz 暴露出的语法一致性问题响应较快。

- **修复全文检索场景 `NOT_FOUND_COLUMN_IN_BLOCK`**
  - PR: #99481  
  - 链接: ClickHouse/ClickHouse PR #99481
  - 对应 Issue: #99468  
  - 影响：修复在 `hasAllTokens` 等 text index 谓词同时出现在 SELECT 中时的列缺失错误。
  - 意义：说明 **full-text-search** 子系统正在快速迭代，且已有用户开始实际试用。

- **改进 skip index 日志写入 query log**
  - PR: #99466  
  - 链接: ClickHouse/ClickHouse PR #99466
  - 影响：增强 query log 中对跳数索引使用情况的可观测性。
  - 意义：这与今日多个“日志不完整/指标不可见”类 issue 方向一致，体现项目在加强**查询可解释性与可观测性**。

- **记录更多 internal queries**
  - PR: #99464  
  - 链接: ClickHouse/ClickHouse PR #99464
  - 影响：增强内部查询日志记录。
  - 意义：有助于排查系统查询、内部调度和权限链路问题，预计将改善生产诊断体验。

- **26.2 回补：修复 recursive CTE + `remote()` + `view()` 的 segfault**
  - PR: #99447  
  - 链接: ClickHouse/ClickHouse PR #99447
  - 影响：针对 26.2 分支的关键崩溃回补。
  - 意义：表明维护者正在积极对稳定分支做**关键崩溃修复 backport**。

### 3.3 面向未来版本的功能推进

- **ADD ENUM VALUES**
  - PR: #93830  
  - 链接: ClickHouse/ClickHouse PR #93830
  - 影响：增强 ENUM 模式演进能力。
  - 意义：对应用 schema 演进非常实用，提升 DDL 便利性与 SQL 可维护性。

- **Arrow Flight SQL 支持**
  - PR: #91170  
  - 链接: ClickHouse/ClickHouse PR #91170
  - 影响：加强与 Arrow 生态和高性能数据接入协议的集成。
  - 意义：这是**连接器/协议生态**的重要信号，适合 BI、跨语言数据访问、云原生场景。

- **WASM UDF 改进**
  - PR: #99373  
  - 链接: ClickHouse/ClickHouse PR #99373
  - 影响：改善 WASM UDF 的数值类型 coercion 等能力。
  - 意义：说明 ClickHouse 正在继续探索**安全可扩展的用户自定义计算模型**。

- **新增 unavailable shards 容忍上限设置**
  - PR: #99369  
  - 链接: ClickHouse/ClickHouse PR #99369
  - 影响：为 `skip_unavailable_shards` 增加数量和比例上限控制。
  - 意义：这是典型的**分布式查询容错与正确性平衡**增强，适合生产集群。

---

## 4. 社区热点

### 4.1 26.2 INSERT 性能明显退化
- Issue: #99241  
- 链接: ClickHouse/ClickHouse Issue #99241
- 热度：评论 18，今日最受关注问题之一。
- 现象：用户报告在从 25.12 升级到 26.2 后，相同 INSERT 查询性能下降约 **3 倍**。
- 技术诉求分析：
  - 这是**升级回归**中的高优先级问题，因为直接影响写入吞吐；
  - 涉及 `ReplacingMergeTree`，说明回归可能与写入路径、part 构建、压缩、索引或后台处理有关；
  - 若问题可稳定复现，通常会推动性能 profiling、回归 bisect，甚至触发稳定分支修复。

### 4.2 CI 崩溃：Compact part 双重释放
- Issue: #98949  
- 链接: ClickHouse/ClickHouse Issue #98949
- 热度：评论 7。
- 现象：`MergeTreeDataPartCompact` 出现 **double free / corruption**。
- 技术诉求分析：
  - 属于存储层内存安全问题；
  - 即便目前主要由 CI 捕获，也需高度重视，因为同类缺陷往往在特定数据布局、异常中断、合并流程中可触发生产事故。

### 4.3 单查询内重复解压缩数据
- Issue: #99236  
- 链接: ClickHouse/ClickHouse Issue #99236
- 热度：评论 5。
- 现象：用户怀疑某些查询对同一压缩数据发生重复解压，造成额外 CPU 开销。
- 技术诉求分析：
  - 指向读取执行链中的**列裁剪、子列读取、表达式复用或 block pipeline**效率问题；
  - 如果属实，将影响复杂分析查询的 CPU 成本与响应时间。

### 4.4 历史功能请求重新升温：Remote database engine
- Issue: #59304  
- 链接: ClickHouse/ClickHouse Issue #59304
- 热度：评论 3，且是长期 feature 请求。
- 技术诉求分析：
  - 用户希望像 MySQL/PostgreSQL engine 一样，将远程 ClickHouse server 映射成 database engine；
  - 该需求反映出 ClickHouse 用户希望降低跨集群 DDL / 元数据管理复杂度。

### 4.5 新 analyzer 与 SQL 正确性问题持续暴露
- Issues:
  - #99308 Creating a view using a CTE fails.  
    链接: ClickHouse/ClickHouse Issue #99308
  - #99362 Server crash with nested GLOBAL IN using new analyzer  
    链接: ClickHouse/ClickHouse Issue #99362
  - #99310 Correlated EXISTS subquery on same table silently returns wrong result  
    链接: ClickHouse/ClickHouse Issue #99310
- 技术诉求分析：
  - 新 analyzer 正在触达更多真实业务 SQL；
  - 当前诉求从“能否执行”升级为“结果是否正确、是否会 crash”，这对默认开启 analyzer 的节奏有直接影响。

---

## 5. Bug 与稳定性

以下按严重程度排序，并标注是否已有 fix/相关 PR。

### P0 / 高危：崩溃、错误结果、严重回归

1. **INSERT 性能在 26.2 下降约 3 倍**
   - Issue: #99241  
   - 链接: ClickHouse/ClickHouse Issue #99241
   - 类型：性能回归
   - 影响：直接影响生产写入吞吐
   - Fix PR：**暂无明确 fix PR**

2. **新 analyzer 下 nested GLOBAL IN 导致服务崩溃**
   - Issue: #99362  
   - 链接: ClickHouse/ClickHouse Issue #99362
   - 类型：Crash / analyzer
   - 影响：特定分布式查询直接 segfault
   - Fix PR：**暂无明确 fix PR**

3. **相关子查询 EXISTS 在同表场景下静默返回错误结果**
   - Issue: #99310  
   - 链接: ClickHouse/ClickHouse Issue #99310
   - 类型：查询正确性
   - 影响：比报错更危险，属于 silent wrong result
   - Fix PR：**暂无明确 fix PR**

4. **Detach 两张表后出现 “No such part” 错误，26.2 新增**
   - Issue: #99395  
   - 链接: ClickHouse/ClickHouse Issue #99395
   - 类型：26.2 回归 / part 管理
   - 影响：涉及元数据和 part 生命周期
   - Fix PR：**暂无明确 fix PR**

5. **Compact MergeTree CI 崩溃：double free / corruption**
   - Issue: #98949  
   - 链接: ClickHouse/ClickHouse Issue #98949
   - 类型：内存安全 / crash
   - 影响：潜在生产风险
   - Fix PR：**暂无明确 fix PR**

### P1 / 较高：逻辑错误、日志/可观测性缺失、功能异常

6. **Projection index 场景下 block 排序顺序被破坏**
   - Issue: #99388  
   - 链接: ClickHouse/ClickHouse Issue #99388
   - 类型：逻辑错误 / 执行引擎
   - Fix PR：暂无

7. **全文检索 `hasAllTokens` 导致 `NOT_FOUND_COLUMN_IN_BLOCK`**
   - Issue: #99468  
   - 链接: ClickHouse/ClickHouse Issue #99468
   - Fix PR：**已有** #99481  
   - PR 链接: ClickHouse/ClickHouse PR #99481

8. **Prometheus HTTP handler 未正确累计 rows/bytes，且未写入 `system.query_log`**
   - Issue: #99475  
   - 链接: ClickHouse/ClickHouse Issue #99475
   - 类型：可观测性 / comp-promql
   - 关联改进：#99464、#99466 在日志侧有正向推进，但并非明确直接修复该问题

9. **`system.query_log.used_row_policies` 在 VIEW / 子查询场景为空**
   - Issue: #99456  
   - 链接: ClickHouse/ClickHouse Issue #99456
   - 类型：审计与可观测性缺失
   - Fix PR：暂无

10. **重复解压缩同一压缩数据**
    - Issue: #99236  
    - 链接: ClickHouse/ClickHouse Issue #99236
    - 类型：读取性能问题
    - Fix PR：暂无

### P2 / 中等：解析、兼容性、测试发现问题

11. **CREATE VIEW + CTE 在 analyzer 下失败**
    - Issue: #99308  
    - 链接: ClickHouse/ClickHouse Issue #99308

12. **`parseDateTimeBestEffort` 将非法单词识别为月份**
    - Issue: #99345  
    - 链接: ClickHouse/ClickHouse Issue #99345

13. **EPHEMERAL 列与虚拟列冲突导致 SELECT 触发 LOGICAL_ERROR**
    - Issue: #99437  
    - 链接: ClickHouse/ClickHouse Issue #99437

14. **`expire_snapshots` 重复统计共享 manifest/data files**
    - Issue: #99340  
    - 链接: ClickHouse/ClickHouse Issue #99340

15. **row policy AST 格式不一致**
    - Issue: #99314  
    - 链接: ClickHouse/ClickHouse Issue #99314
    - Fix PR：**已有** #99463  
    - PR 链接: ClickHouse/ClickHouse PR #99463

### 已关闭问题

- **S3 schema validation in 26.2 是破坏性变更**
  - Issue: #99190  
  - 链接: ClickHouse/ClickHouse Issue #99190
  - 状态：已关闭
  - 说明：说明维护者已对该兼容性争议给出处理或结论，值得关注后续 changelog / backport。

- **EXISTS + LIMIT/OFFSET 回归**
  - Issue: #88722  
  - 链接: ClickHouse/ClickHouse Issue #88722
  - 状态：已关闭
  - 说明：SQL 语义正确性问题已有收敛进展。

- **fuzz：ReadBuffer canceled**
  - Issue: #99258  
  - 链接: ClickHouse/ClickHouse Issue #99258
  - 状态：已关闭

---

## 6. 功能请求与路线图信号

### 6.1 社区提出的需求

- **Remote database engine**
  - Issue: #59304  
  - 链接: ClickHouse/ClickHouse Issue #59304
  - 信号：这是较明确的**跨 ClickHouse 实例元数据代理**需求，适合混合部署和多集群场景。

- **按表引擎控制 CREATE TABLE 权限**
  - Issue: #46652  
  - 链接: ClickHouse/ClickHouse Issue #46652
  - 信号：体现企业用户对**资源治理与权限细粒度控制**的诉求，尤其是限制 Memory 等高风险引擎。

- **MaterializedPostgreSQL 列数不匹配**
  - Issue: #83776  
  - 链接: ClickHouse/ClickHouse Issue #83776
  - 信号：用户继续关注外部数据库同步链路的 schema drift 问题。

- **YAML 配置中保留默认 `http_handlers`**
  - Issue: #99432  
  - 链接: ClickHouse/ClickHouse Issue #99432
  - 信号：配置体系文档与易用性仍有改进空间。

- **Unity Catalog 无法读取 streaming tables / materialized views**
  - Issue: #99469  
  - 链接: ClickHouse/ClickHouse Issue #99469
  - 信号：湖仓目录集成正在触及更复杂的 Databricks 元对象类型，说明**Lakehouse 连接器**是持续热点。

### 6.2 从 PR 反推的路线图方向

结合今日活跃 PR，以下方向较可能进入后续版本重点：

1. **协议与生态集成增强**
   - PR #91170 Arrow Flight SQL  
   - 说明：面向高性能数据访问、BI/工具链兼容。

2. **SQL DDL 演进能力增强**
   - PR #93830 ADD ENUM VALUES  
   - 说明：提升 schema 变更友好度。

3. **UDF 扩展能力**
   - PR #99373 WASM UDF improvements  
   - 说明：为安全扩展执行逻辑铺路。

4. **分布式可用性控制**
   - PR #99369 unavailable shards 容忍阈值  
   - 说明：面向生产集群容错与可靠性。

5. **可观测性增强**
   - PR #99464、#99466  
   - 说明：日志、query log、skip index 使用信息会持续加强。

---

## 7. 用户反馈摘要

基于今日 Issues，可归纳出几类真实用户痛点：

### 7.1 升级后的“性能/兼容性不确定性”
- 代表 Issue:
  - #99241 26.2 INSERT 变慢  
  - #99190 S3 schema validation 破坏兼容性  
- 用户诉求：希望稳定版升级后**性能不退化、既有数据格式和外部对象存储行为保持兼容**。

### 7.2 新 analyzer 仍需打磨
- 代表 Issue:
  - #99308 CTE + VIEW 失败
  - #99362 nested GLOBAL IN crash
  - #99310 correlated EXISTS 错结果
- 用户诉求：在真实 SQL、DBT、分布式查询、复杂子查询场景下，analyzer 需要达到**可替代旧行为**的成熟度。

### 7.3 可观测性和审计信息不足
- 代表 Issue:
  - #99475 Prometheus handler 不记 rows/bytes / query_log
  - #99456 `used_row_policies` 为空
- 用户诉求：不仅要“功能能跑”，还要在 `system.query_log`、指标、审计字段中**准确还原发生了什么**。

### 7.4 新功能开始被真实测试
- 代表 Issue:
  - #99468 full text search
  - #99469 Unity Catalog
- 用户诉求：实验性/新集成能力一旦进入试用，就会迅速暴露边界行为，维护者需要提供更快的修复闭环。

---

## 8. 待处理积压

以下为值得维护者继续关注的长期或潜在高价值积压项：

- **#59304 `Remote` database engine**
  - 链接: ClickHouse/ClickHouse Issue #59304
  - 原因：已存在较长时间，且今天仍有活动；这是具备清晰应用场景的功能请求。

- **#46652 按引擎粒度控制 CREATE TABLE 权限**
  - 链接: ClickHouse/ClickHouse Issue #46652
  - 原因：企业治理价值高，但长期未见明显推进。

- **#88304 Workload 调度对 index analysis 不生效**
  - 链接: ClickHouse/ClickHouse Issue #88304
  - 原因：涉及 workload policy 的一致性，对多租户资源隔离较关键。

- **#83776 MaterializedPostgreSQL 列数不匹配**
  - 链接: ClickHouse/ClickHouse Issue #83776
  - 原因：外部同步链路问题通常影响实际生产接入，建议尽早明确是否可复现、是否需要文档补充或修复。

- **长期活跃 PR：#91170 Arrow Flight SQL**
  - 链接: ClickHouse/ClickHouse PR #91170
  - 原因：属于生态大功能，开发周期较长，建议关注测试覆盖、兼容性和发布计划。

- **长期活跃 PR：#93830 ADD ENUM VALUES**
  - 链接: ClickHouse/ClickHouse PR #93830
  - 原因：用户价值明确，若落地会显著改善 schema 演进体验。

---

## 总结判断

今天的 ClickHouse 项目状态可以概括为：**开发节奏强、修复响应快，但 26.2 稳定性压力正在显现**。  
一方面，query log、skip index、全文检索、WASM UDF、Arrow Flight SQL 等方向持续推进，表明项目功能面仍在快速扩张；另一方面，INSERT 性能回退、analyzer 崩溃/错结果、MergeTree/Compact part 崩溃等问题说明当前阶段仍需把相当精力投入到**稳定分支回归治理**。  
如果你关注生产可用性，今天最值得跟进的是：**#99241、#99362、#99310、#99395、#98949**；如果你关注中长期能力演进，则优先看 **#91170、#93830、#99373、#99369**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时 DuckDB 社区保持高活跃：Issues 更新 16 条、PR 更新 41 条，说明 1.5.0 发布后的回归修复与性能调优正在集中推进。  
从议题类型看，今天的重点明显集中在 **Parquet/S3 访问性能回归、Variant/JSON 新类型稳定性、查询执行器内部错误** 三条主线。  
PR 侧没有新版本发布，但围绕 Parquet reader、过滤下推、基数估计、构建系统和 SQL 语法的改动非常密集，显示维护者正同时处理 **线上性能问题** 与 **中长期功能演进**。  
整体健康度评估为 **活跃但承压**：开发节奏快、修复响应及时，但 1.5.0 之后暴露出若干回归与 internal error，短期内稳定性仍需继续加固。

---

## 3. 项目进展

> 今日无新 Release。以下聚焦“已关闭/合并”或明显推动主线问题解决的 PR / Issue 进展。

### 3.1 Parquet 读取与优化器方向持续推进
- **PR #21373 — Parquet Reader: Allow merging of prefetch column ranges for columns that do not have table filters**  
  链接: duckdb/duckdb PR #21373  
  该 PR 直接针对 S3/Parquet 场景下的高 GET 请求问题做优化，通过在存在过滤器时仍允许一部分列范围预取合并，减少远程对象存储上的随机读取次数。  
  这是对 Issue **#21348** 的部分修复信号，说明团队已将 **1.5.0 的 S3 请求放大问题** 视为高优先级性能回归。

- **PR #21374 — 用 glob 返回的文件大小改进 Parquet 基数估计**  
  链接: duckdb/duckdb PR #21374  
  在目录级 glob/S3 file listing 场景中，基于文件大小而不是首个文件元数据估算 cardinality，可改善复杂查询的计划质量。  
  这属于典型的“优化器感知远程存储现实分布”的工程补强，尤其利好 **多文件 Parquet 数据湖查询**。

- **PR #21375 — Add row group skipping support for MAP columns in Parquet reader**  
  链接: duckdb/duckdb PR #21375  
  这项改动扩展了 Parquet reader 的统计信息/跳过能力，使包含 MAP 列的文件在过滤非 MAP 列时也能保留 row group skipping。  
  对宽表、半结构化数据和日志分析场景价值较高，属于 **存储层扫描裁剪能力增强**。

- **PR #21358 — Use cached Parquet metadata to improve cardinality estimates over Parquet files**（已关闭）  
  链接: duckdb/duckdb PR #21358  
  虽然该 PR 已关闭，但其意图被后续 PR #21374 延续，表明 DuckDB 正在快速迭代 **Parquet 基数估计策略**，并尝试避免额外 I/O。

### 3.2 Variant/Parquet 兼容性修复在持续推进
- **PR #21357 — When writing unsupported Parquet variant types to Parquet, try to convert them to INT64**（已关闭）  
  链接: duckdb/duckdb PR #21357  
  该 PR 针对 Variant 写出 Parquet 的兼容性问题进行修复尝试，说明新引入/增强的 Variant 能力仍处在快速打磨阶段。  
  结合今日多个 Variant 相关 issue，可判断这是当前版本的重要稳定性焦点。

### 3.3 工具链与开发者体验改进
- **PR #21376 — Fix GCC compile flags on reconfigure**  
  链接: duckdb/duckdb PR #21376  
  修复 CMake 重新配置时 GCC flags 丢失的问题，减少构建行为不一致。

- **PR #21371 — Well-defined environment for MinGW builds**  
  链接: duckdb/duckdb PR #21371  
  规范 MinGW 构建环境，对 Windows 非 MSVC 生态、静态库打包链路有直接帮助。

- **PR #21361 — automate clangd/compile_commands.json gen via builds**  
  链接: duckdb/duckdb PR #21361  
  属于开发便利性增强，便于 IDE/LSP 获取稳定的 compile_commands。

### 3.4 SQL/事务语义与语法演进持续中
- **PR #21194 — Nicer variable syntax**  
  链接: duckdb/duckdb PR #21194  
  推进 `$变量` 风格语法，改善变量引用体验，属于 SQL 可用性提升。

- **PR #21171 — Make some MultiStatements and PRAGMAs Transactional**  
  链接: duckdb/duckdb PR #21171  
  目标是让 multi-statements/部分 PRAGMA 具备事务性，减少部分成功、部分失败造成的状态不一致。  
  这类变更对数据导入、数据库复制、脚本执行的可靠性非常关键。

- **PR #21310 — Bumping C++ Standard to 17**  
  链接: duckdb/duckdb PR #21310  
  虽偏工程基础设施，但这是明显的路线图信号：后续代码库可能会更积极使用 C++17 特性，也可能影响部分嵌入式/旧编译器环境。

---

## 4. 社区热点

### 热点一：1.5.0 在 S3 + Hive Partition + QUALIFY/窗口函数上的远程读取回归
- **Issue #21348 — `QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0**  
  链接: duckdb/duckdb Issue #21348  
- **Issue #21347 — Hive partition filters discover all files before pruning in 1.5.0**  
  链接: duckdb/duckdb Issue #21347  
- **关联 PR #21373 / #21374**  
  链接: duckdb/duckdb PR #21373  
  链接: duckdb/duckdb PR #21374  

这是今天最值得关注的性能热点。用户反馈从 1.4.4 到 1.5.0，同类查询的 HTTP GET 从约 80 增长到 4200+，执行时间接近三倍。  
背后技术诉求很明确：  
1. **Hive 分区过滤应尽可能前置**，避免“先枚举全部文件再裁剪”；  
2. **Parquet 列预取应在有过滤器时仍尽量合并请求**；  
3. **优化器对远程文件集的基数估计需要更贴近实际**。  
这是典型的数据湖查询用户痛点，影响面很可能不止单个 query pattern。

### 热点二：Variant/JSON 新能力触发内部错误
- **Issue #21352 — Internal error when converting json to variant**  
  链接: duckdb/duckdb Issue #21352  
- **Issue #21321 — storage_compatibility_version on 'latest' or 'v1.5.0' doesn't allow variant types**（已关闭）  
  链接: duckdb/duckdb Issue #21321  
- **PR #21357**（已关闭）  
  链接: duckdb/duckdb PR #21357  

Variant 相关问题在今天多点出现：创建、转换、Parquet 写出、兼容版本设置均有反馈。  
这说明 DuckDB 用户已开始积极试用新半结构化能力，但生态兼容、编码路径和存储版本约束尚未完全稳定。

### 热点三：事务/配置安全边界的可运维诉求
- **Issue #21335 — `enable_external_access=false` blocks WAL checkpoint on persistent databases**  
  链接: duckdb/duckdb Issue #21335  
- **Issue #21369 — `duckdb_set_config` cannot set `VARCHAR[]` config options**  
  链接: duckdb/duckdb Issue #21369  
- **PR #20938 — Add allowed_configs option for allow-listing configs when setting lock_configurations**  
  链接: duckdb/duckdb PR #20938  

这些议题反映企业/嵌入式用户正更重视 **安全配置、配置锁定、受限环境运行**。  
DuckDB 不再只是本地分析工具，而是在朝 **可嵌入生产系统的数据引擎** 演化，因此配置 API 的一致性和安全隔离语义正在成为重要需求。

---

## 5. Bug 与稳定性

> 按严重程度排序，并标注是否已有潜在 fix 信号。

### P0 / 高严重：远程存储性能回归
1. **#21348 — `QUALIFY ROW_NUMBER() OVER (...) = 1` 导致 S3 请求暴增约 50 倍**  
   链接: duckdb/duckdb Issue #21348  
   影响：远程 Parquet/S3 查询成本和延迟显著上升，属于实质性性能回归。  
   状态：Open / under review  
   **已有 fix 信号：有，相关 PR #21373、#21374。**

2. **#21347 — Hive partition filters 在 1.5.0 中先发现全部文件再裁剪**  
   链接: duckdb/duckdb Issue #21347  
   影响：对象存储 listing 和扫描放大，可能是 #21348 的上游原因之一。  
   状态：Open / under review  
   **已有 fix 信号：间接有，PR #21373、#21374 以及 Parquet 优化方向相关。**

### P1 / 高严重：内部错误、崩溃、正确性风险
3. **#21352 — json 转 variant 时 Internal error**  
   链接: duckdb/duckdb Issue #21352  
   错误为 `Field is missing but untyped_value_index is not set`，说明 Variant 编码路径存在不一致。  
   状态：Open / reproduced  
   **已有 fix PR：未看到直接对应 PR。**

4. **#21322 — unnest with joins 回归**  
   链接: duckdb/duckdb Issue #21322  
   在 `UNNEST(LIST_ZIP(...))` 与 join 风格 FROM 组合下触发 `Failed to cast expression to type - expression type mismatch`。  
   状态：Open / reproduced  
   这属于 1.5 版本后的 SQL 执行/绑定回归。  
   **已有 fix PR：未看到。**

5. **#21372 — INTERNAL Error: Failed to bind column reference (inequal types)**  
   链接: duckdb/duckdb Issue #21372  
   列绑定阶段 internal error，可能是类型系统/绑定器回归。  
   状态：Open / needs triage  
   **已有 fix PR：未看到。**

6. **#21354 — recursive CTE + `APPROX_QUANTILE OVER` 触发事务断言**（已关闭）  
   链接: duckdb/duckdb Issue #21354  
   `TransactionContext::ActiveTransaction called without active transaction`  
   虽已关闭，但暴露了窗口函数、递归 CTE 与事务上下文之间的复杂交互风险。  
   **修复状态：已关闭，需后续观察是否伴随代码修复。**

7. **#21367 — `min/max ... partition by` 触发 PandasScan cannot be serialized**  
   链接: duckdb/duckdb Issue #21367  
   说明窗口函数/序列化计划与 PandasScan 交互有边界问题。  
   状态：Open / reproduced  
   **已有 fix PR：未看到。**

### P2 / 中严重：配置、平台兼容与权限语义问题
8. **#21335 — `enable_external_access=false` 阻塞持久化数据库 WAL checkpoint**  
   链接: duckdb/duckdb Issue #21335  
   对受限运行环境、沙箱模式、嵌入式部署影响较大。  
   状态：Open / reproduced  
   **已有 fix PR：未看到。**

9. **#21369 — C API `duckdb_set_config` 无法设置 `VARCHAR[]` 配置项**  
   链接: duckdb/duckdb Issue #21369  
   影响配置 API 一致性，尤其是 `allowed_directories`、`allowed_paths` 等安全设置。  
   状态：Open / under review  
   **已有 fix PR：未看到。**

10. **#21262 — FreeBSD 测试中出现 SIGILL**  
    链接: duckdb/duckdb Issue #21262  
    平台兼容性问题，若可复现则可能涉及编译选项或 CPU 指令集假设。  
    状态：Open / needs triage  
    **已有 fix PR：未看到。**

11. **#21142 — C# Appender API 内存持续增长导致 OOM**  
    链接: duckdb/duckdb Issue #21142  
    高吞吐写入场景（FHIR，约 9K msg/s）下出现内存失控。  
    状态：Open / under review  
    尽管不是今日新开，但这是生产价值很高的问题，影响 .NET 写入型应用。  
    **已有 fix PR：未看到。**

### P3 / 已关闭或偏文档/行为澄清
12. **#21308 — `.multiline` dot command throws errors**（已关闭）  
    链接: duckdb/duckdb Issue #21308  
    CLI 行为变化已被确认并关闭。

13. **#21321 — storage_compatibility_version 与 variant 类型的关系**（已关闭）  
    链接: duckdb/duckdb Issue #21321  
    更偏文档/预期行为澄清，但也说明新类型的兼容边界不够直观。

14. **#20481 — Invalid PhysicalType for GetTypeIdSize**（已关闭）  
    链接: duckdb/duckdb Issue #20481  
    历史 internal error 已得到关闭处理。

---

## 6. 功能请求与路线图信号

### 6.1 安全配置治理可能进入下一版本
- **PR #20938 — `allowed_configs` for `lock_configurations`**  
  链接: duckdb/duckdb PR #20938  
  已是 **Ready To Merge**，且与今日配置 API 相关 Issue #21369 形成呼应。  
  这表明 DuckDB 很可能继续强化 **可控配置面、嵌入式安全治理**，适合 SaaS、多租户、受限执行环境。

### 6.2 SQL 可用性与交互体验持续增强
- **PR #21194 — Nicer variable syntax**  
  链接: duckdb/duckdb PR #21194  
  若合入，将显著改善脚本化和交互式 SQL 编写体验。  
  对分析师用户、Notebook 场景、参数化查询都比较友好。

### 6.3 事务语义更严格是明确方向
- **PR #21171 — MultiStatements / PRAGMAs Transactional**  
  链接: duckdb/duckdb PR #21171  
  若落地，将提升批处理 SQL 和管理命令的一致性，减少失败时的半完成状态。  
  这类特性通常优先级较高，因为直接提升系统可靠性。

### 6.4 Parquet/数据湖优化仍是主航道
- **PR #21373 / #21374 / #21375 / #20976**  
  链接: duckdb/duckdb PR #21373  
  链接: duckdb/duckdb PR #21374  
  链接: duckdb/duckdb PR #21375  
  链接: duckdb/duckdb PR #20976  
  从 row group skipping、预取合并、基数估计到 Parquet 时间戳 schema 兼容，信号非常一致：  
  **DuckDB 正持续加码 Parquet 作为核心分析存储接口的性能与兼容性。**

### 6.5 构建系统现代化
- **PR #21310 — Bumping C++ Standard to 17**  
  链接: duckdb/duckdb PR #21310  
  这是对代码库未来演化的中长期信号，可能影响扩展开发者和下游打包者。

---

## 7. 用户反馈摘要

### 7.1 真实生产负载已经很重
- **#21142 C# Appender API 内存问题**  
  链接: duckdb/duckdb Issue #21142  
  用户在离线 FHIR 数据摄取中达到 **9K msg/s**，说明 DuckDB 已被用于高吞吐、接近生产级的嵌入式写入场景。  
  用户核心痛点不是“功能有没有”，而是 **内存曲线能否稳定、能否持续 ingest**。

### 7.2 数据湖用户对远程 I/O 放大极其敏感
- **#21348 / #21347**  
  链接: duckdb/duckdb Issue #21348  
  链接: duckdb/duckdb Issue #21347  
  用户不仅观察 SQL 变慢，还精确量化了 HTTP GET 数量和版本差异，说明使用者已把 DuckDB 放在 **S3 成本与延迟敏感** 的真实链路中。  
  对这类用户而言，优化器行为变化会直接转化为云账单和 SLA 风险。

### 7.3 新类型能力有吸引力，但稳定性决定采纳速度
- **#21352 / #21321**  
  链接: duckdb/duckdb Issue #21352  
  链接: duckdb/duckdb Issue #21321  
  用户正在主动尝试 JSON→Variant、Variant 建表与兼容版本控制，说明需求真实存在。  
  但 internal error 和配置/兼容性不清晰，会延缓团队将 Variant 用到生产。

### 7.4 受限权限与安全模式是越来越现实的部署要求
- **#21335 / #21369**  
  链接: duckdb/duckdb Issue #21335  
  链接: duckdb/duckdb Issue #21369  
  用户希望在禁用外部访问、锁定配置的前提下仍能正常 checkpoint、设置 allow-list 路径。  
  这表明 DuckDB 正被嵌入到需要 **严格文件系统边界与安全策略** 的应用中。

---

## 8. 待处理积压

> 结合“创建时间较早、仍未解决、影响面较大”筛选。

### 需要维护者重点关注的长期/高价值积压

1. **#21142 — Excessive memory consumption when using Appender API in C#**  
   链接: duckdb/duckdb Issue #21142  
   创建于 2026-03-02，至今仍 Open / under review。  
   这是面向高吞吐生产写入的关键问题，建议优先给出复现结论、内存剖析结果或规避建议。

2. **PR #20938 — Add allowed_configs option for allow-listing configs when setting lock_configurations**  
   链接: duckdb/duckdb PR #20938  
   已接近可合并状态，且与今日配置治理需求高度相关。  
   建议尽快决策，有助于提升安全场景可用性。

3. **PR #20976 — Parquet: make isAdjustedToUTC configurable for timestamps without timezone**  
   链接: duckdb/duckdb PR #20976  
   已较长时间处于 Ready To Merge。  
   该问题关系到与外部 schema/Parquet 生态的兼容性，建议尽快推进。

4. **PR #21171 — Make some MultiStatements and PRAGMAs Transactional**  
   链接: duckdb/duckdb PR #21171  
   虽有 Changes Requested，但价值较高。  
   一旦设计敲定，对可靠性提升明显，建议维护者明确 scope 与行为边界。

5. **PR #21194 — Nicer variable syntax**  
   链接: duckdb/duckdb PR #21194  
   文档标注需求较明确，属于用户可见度高、易形成使用习惯的改进。  
   如准备在下个小版本推出，需同步补全文档与参数命名规则说明。

---

## 总结判断

今天 DuckDB 的主旋律是：**围绕 1.5.0 暴露的 Parquet/S3 回归快速补强，同时继续推进 Variant、事务语义和安全配置能力。**  
项目活跃度高，维护者对性能回归已给出明确 PR 响应，说明修复节奏是健康的；但 internal error 和多处回归也提示当前版本正处于“功能扩张后的稳定化窗口”。  
如果未来 1-2 天相关 Parquet PR 能快速合并，DuckDB 的短期健康度会明显改善；否则，S3 数据湖用户可能继续承受较大的版本升级风险。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持**高活跃度**：Issues 更新 8 条、PR 更新 103 条，代码流转明显快于问题流入，说明维护者对主干与分支回合并节奏较强。  
今日**无新版本发布**，但多个 PR 围绕 **Iceberg/Paimon 外表兼容、窗口函数优化、JSON 处理修复、测试与 Darwin/macOS 构建适配**持续推进。  
Issue 侧的焦点集中在**外部 Catalog 权限一致性**、**查询正确性**、**Java UDF 稳定性**三个方向，其中 Paimon + Ranger + LDAP/Follower FE 组合暴露出较强的企业级集成痛点。  
整体看，项目健康度良好：**修复与增强并行推进**，但外部生态集成和权限链路仍是当前稳定性风险点。

---

## 2. 项目进展

以下为今日合并/关闭中更值得关注的 PR 进展：

### 2.1 查询优化器与执行引擎

- **支持窗口函数显式 skew hint**
  - PR: #68739  
  - 链接: https://github.com/StarRocks/starrocks/pull/68739
  - 状态: 已关闭
  - 价值: 为窗口函数提供显式数据倾斜提示，补足原先仅依赖统计信息触发 `SplitWindowSkewToUnionRule` 的不足。对大 key 倾斜场景下的 analytic/window 查询性能有直接帮助，属于典型的 OLAP 查询稳定性增强。

- **窗口函数按倾斜分区键拆分为 UNION 优化**
  - PR: #67944  
  - 链接: https://github.com/StarRocks/starrocks/pull/67944
  - 状态: 已关闭
  - 价值: 针对 `PARTITION BY + ORDER BY` 形成的热点分区执行瓶颈进行优化，减少单实例堆积风险。该方向与上面的 skew hint 形成配套，说明优化器正在加强对**倾斜数据场景**的主动治理。

- **修复 OptExpressionDuplicator 对 join skew hint 的处理**
  - PR: #68964  
  - 链接: https://github.com/StarRocks/starrocks/pull/68964
  - 状态: 已关闭
  - 价值: 这是优化器 hint 语义正确性的补丁，避免在表达式复制/重写阶段丢失或错误改写 skew hint 相关列引用。体现出团队正在完善 hint 驱动优化的闭环。

### 2.2 外部表 / 湖仓兼容性

- **修复 toIcebergTable 拼写错误：common -> comment**
  - PR: #70267  
  - 链接: https://github.com/StarRocks/starrocks/pull/70267
  - 状态: 已关闭，且已回合并至 3.5/4.0/4.1
  - Backport:
    - #70270（3.5.15）https://github.com/StarRocks/starrocks/pull/70270
    - #70271（4.0.8）https://github.com/StarRocks/starrocks/pull/70271
    - #70272（4.1.0）https://github.com/StarRocks/starrocks/pull/70272
  - 价值: 虽然是小修复，但能避免 Iceberg 元数据字段映射错误，说明外表生态的细节兼容仍在持续打磨。

- **使用列级统计估算 Iceberg averageRowSize**
  - PR: #70256  
  - 链接: https://github.com/StarRocks/starrocks/pull/70256
  - 状态: Open（backport）
  - 背景关联 Issue: #68784  
  - 链接: https://github.com/StarRocks/starrocks/issues/68784
  - 价值: 当前 `averageRowSize` 被硬编码为 1，可能导致优化器严重低估内存与代价；该修复若合入，将明显改善 Iceberg 查询的 CBO 质量、内存估算和执行计划选择。

- **暴露 variant 子字段访问路径到 HDFS / Iceberg scan**
  - PR: #70252  
  - 链接: https://github.com/StarRocks/starrocks/pull/70252
  - 状态: Open
  - 价值: 这属于外部表扫描侧的**子字段裁剪/投影下推增强**，对于半结构化数据、variant 列、湖仓元数据联动非常关键，预计将带来扫描裁剪效率提升。

- **支持将 Parquet FIXED_LEN_BYTE_ARRAY 读为 TYPE_VARBINARY**
  - PR: #70226  
  - 链接: https://github.com/StarRocks/starrocks/pull/70226
  - 状态: Open
  - 价值: 直接改善 Iceberg/Parquet 兼容性，尤其是 UUID 等以 `FIXED_LEN_BYTE_ARRAY` 编码的列。对于接入已有数据湖表的用户，是非常实用的互操作增强。

### 2.3 SQL / 函数兼容与稳定性

- **修复 `get_json_string` flatten 逻辑**
  - PR: #68797  
  - 链接: https://github.com/StarRocks/starrocks/pull/68797
  - 状态: 已关闭
  - 价值: 解决扁平 JSON 结构中类型冲突处理问题，提升 JSON 函数对复杂半结构化数据的容错性和结果正确性。

- **修复 exec_env 销毁顺序导致 MemTracker Use-After-Free**
  - PR: #67027  
  - 链接: https://github.com/StarRocks/starrocks/pull/67027
  - 状态: 已关闭，并已回合并
  - 相关 backport:
    - #67313 https://github.com/StarRocks/starrocks/pull/67313
    - #67327 https://github.com/StarRocks/starrocks/pull/67327
  - 价值: 这是底层生命周期管理修复，直接面向 BE 进程稳定性与内存追踪系统安全性，重要性较高。

- **聚合流式算子错误检查修复**
  - PR: #57288  
  - 链接: https://github.com/StarRocks/starrocks/pull/57288
  - 状态: 已关闭
  - 价值: 防止 aggregation context 中的错误被忽略，属于结果正确性和异常传播链路修正。

### 2.4 工程与测试基础设施

- **导入 Darwin 第三方库供 BE 使用**
  - PR: #70268  
  - 链接: https://github.com/StarRocks/starrocks/pull/70268
  - 状态: 已关闭
- **让 base_test 可在 macOS 运行**
  - PR: #70275  
  - 链接: https://github.com/StarRocks/starrocks/pull/70275
  - 状态: Open
- **修复不稳定单测**
  - PR: #70243  
  - 链接: https://github.com/StarRocks/starrocks/pull/70243
  - 状态: Open

这组 PR 表明团队正在改善**Darwin/macOS 开发环境可用性**与**CI/UT 稳定性**，对吸引外部贡献者和提升迭代效率有积极意义。

---

## 3. 社区热点

### 热点 1：Paimon + Ranger + LDAP + Follower FE 权限链路问题集中暴露
- Issue: #70255  
  https://github.com/StarRocks/starrocks/issues/70255
- Issue: #70264  
  https://github.com/StarRocks/starrocks/issues/70264
- 已关闭相关问题: #70077  
  https://github.com/StarRocks/starrocks/issues/70077

**分析：**  
今天最突出的技术主题是**外部 Catalog 权限一致性**。问题集中表现为：当请求经过 follower FE 转发到 leader FE 时，LDAP groups / Ranger 鉴权上下文未正确传递，导致 Paimon view 的创建或删除失败。  
这说明 StarRocks 在企业安全集成场景下，除了 SQL 能力本身，**认证信息传递链路、FE 转发语义、Catalog 级鉴权映射**已成为生产落地关键点。此类问题通常优先级较高，因为它直接影响多节点 FE 部署下的可运维性。

### 热点 2：Iceberg 统计信息与扫描能力持续增强
- Issue: #68784  
  https://github.com/StarRocks/starrocks/issues/68784
- PR: #70256  
  https://github.com/StarRocks/starrocks/pull/70256
- PR: #70252  
  https://github.com/StarRocks/starrocks/pull/70252
- PR: #70226  
  https://github.com/StarRocks/starrocks/pull/70226

**分析：**  
围绕 Iceberg 的多个 PR/Issue 指向统一诉求：**更准确的统计、更强的格式兼容、更深的子字段裁剪**。这反映出 StarRocks 正在从“可读”走向“读得准、算得优、裁得细”的湖仓协同阶段。  
对 OLAP 用户来说，这直接影响 CBO、扫描代价、内存估算和异构数据接入体验。

### 热点 3：窗口函数在倾斜数据场景的优化
- PR: #68739  
  https://github.com/StarRocks/starrocks/pull/68739
- PR: #67944  
  https://github.com/StarRocks/starrocks/pull/67944
- PR: #68964  
  https://github.com/StarRocks/starrocks/pull/68964

**分析：**  
这组三连动表明 StarRocks 对**复杂分析 SQL 的热点 key 问题**投入持续。窗口函数是典型 OLAP 重负载场景，Skew hint + UNION 拆分 + hint 传播修复的组合，说明项目正在打造更成熟的“统计驱动 + 用户可控”混合优化策略。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P0 / 高优先级：查询结果错误，存在漏行风险
- Issue: #70145  
  链接: https://github.com/StarRocks/starrocks/issues/70145
  标题: Simple query result Wrong Missing rows
  状态: Closed

**影响判断：**  
这是最值得警惕的问题类型之一：**查询正确性错误**，且表现为结果缺行。对分析数据库而言，结果错误通常比性能下降更严重。  
**当前状态：** Issue 已关闭，但给定数据中未直接展示对应 fix PR，建议维护者在日报外部继续核对是否已有修复提交、影响版本与回归测试补充。

### P1 / 高优先级：Follower FE 转发导致 LDAP/Ranger 权限上下文丢失
- Issue: #70077  
  链接: https://github.com/StarRocks/starrocks/issues/70077
  状态: Closed
- Issue: #70255  
  链接: https://github.com/StarRocks/starrocks/issues/70255
  状态: Open
- Issue: #70264  
  链接: https://github.com/StarRocks/starrocks/issues/70264
  状态: Open

**影响判断：**  
影响企业级权限控制与高可用 FE 部署。典型症状是 leader 上成功、follower 上失败，说明问题更接近**请求转发上下文一致性**而非单纯 SQL 权限配置错误。  
**是否已有 fix PR：** 数据中未看到直接关联修复 PR，需重点跟进。

### P1 / 高优先级：Java UDF 创建触发 StackOverflow
- Issue: #70262  
  链接: https://github.com/StarRocks/starrocks/issues/70262
  状态: Open

**影响判断：**  
`CREATE GLOBAL FUNCTION` 即触发 StackOverflow，说明 UDF 元数据注册、类加载、序列化/反射链路可能存在递归调用异常。  
**是否已有 fix PR：** 暂未看到对应 PR。若能稳定复现，建议尽快补充最小复现场景和堆栈信息。

### P2 / 中优先级：Iceberg 统计估算偏差导致优化器低估代价
- Issue: #68784  
  链接: https://github.com/StarRocks/starrocks/issues/68784
  状态: Closed
- PR: #70256  
  链接: https://github.com/StarRocks/starrocks/pull/70256
  状态: Open

**影响判断：**  
不一定导致错误结果，但会造成计划质量下降、内存估算失真、潜在 OOM 或性能异常。  
**是否已有 fix PR：** 有，backport 正在进行。

### P2 / 中优先级：JSON flatten 逻辑缺陷
- PR: #68797  
  链接: https://github.com/StarRocks/starrocks/pull/68797
  状态: Closed

**影响判断：**  
对半结构化数据查询结果和类型兼容性有影响。  
**是否已有 fix PR：** 已修复。

### P2 / 中优先级：BE 生命周期释放顺序引发 Use-After-Free
- PR: #67027  
  链接: https://github.com/StarRocks/starrocks/pull/67027
  状态: Closed

**影响判断：**  
对服务退出、资源清理、测试稳定性和潜在崩溃风险影响较大。  
**是否已有 fix PR：** 已修复并回合并。

---

## 5. 功能请求与路线图信号

### 5.1 多租户数据管理需求
- Issue: #64984  
  链接: https://github.com/StarRocks/starrocks/issues/64984
  状态: Open

**信号解读：**  
这是今天最明确的产品级需求之一。用户诉求不只限于“权限隔离”，还提到**大规模分析负载下的易用性、数据倾斜自适应、管理能力不足**。  
这类需求通常指向：
- 资源隔离与工作负载治理
- 数据/租户级命名与生命周期管理
- 统计信息与执行策略的租户感知
- 更细粒度的权限/策略框架

**纳入下一版本概率：中等。**  
原因是该需求范围较大，不像单点 bug 那样能快速落地，但它与当前正在推进的 skew 优化、权限链路修复、外部 Catalog 集成能力有一定一致性，说明项目方向上并不冲突。

### 5.2 外部湖仓生态兼容继续增强
- PR: #70226  
  https://github.com/StarRocks/starrocks/pull/70226
- PR: #70252  
  https://github.com/StarRocks/starrocks/pull/70252
- PR: #70256  
  https://github.com/StarRocks/starrocks/pull/70256

**信号解读：**  
这些变更虽然分散，但都属于同一条路线：**加强 Iceberg/HDFS/Paimon 等外部生态接入的可用性、性能和语义一致性**。  
**纳入下一版本概率：高。**  
尤其是统计估算与类型兼容类改进，通常收益明确、风险可控、适合进入短周期版本。

### 5.3 平台开发体验增强：macOS / Darwin 支持
- PR: #70268  
  https://github.com/StarRocks/starrocks/pull/70268
- PR: #70275  
  https://github.com/StarRocks/starrocks/pull/70275

**信号解读：**  
这表明项目开始更重视**开发者本地环境可用性**。虽然不一定直接进入用户发布公告，但对于扩大贡献者群体、提升测试效率是积极信号。

---

## 6. 用户反馈摘要

基于今日 Issues 可提炼出以下真实用户痛点：

1. **最敏感的仍是“结果正确性”**
   - Issue: #70145  
   - 链接: https://github.com/StarRocks/starrocks/issues/70145  
   用户直接反馈简单查询出现缺行，这说明在部分场景下，用户对系统的首要期待依旧是“结果绝对可靠”，而不是更快。

2. **企业安全集成链路复杂，实际部署中容易踩坑**
   - Issues: #70077 / #70255 / #70264  
   - 链接:
     - https://github.com/StarRocks/starrocks/issues/70077
     - https://github.com/StarRocks/starrocks/issues/70255
     - https://github.com/StarRocks/starrocks/issues/70264  
   用户场景明显是生产级：LDAP、Ranger、Paimon Catalog、Leader/Follower FE 并存。痛点不在单点 SQL，而在**跨组件上下文传递是否一致**。

3. **UDF 生态仍有稳定性门槛**
   - Issue: #70262  
   - 链接: https://github.com/StarRocks/starrocks/issues/70262  
   用户希望通过 Java UDF 扩展函数能力，但创建阶段即崩溃，说明扩展机制虽然存在，但对非核心路径用户来说还不够稳健。

4. **湖仓用户希望“即插即用”读取外部格式**
   - Issue/PR:
     - #68784 https://github.com/StarRocks/starrocks/issues/68784
     - #70226 https://github.com/StarRocks/starrocks/pull/70226  
   用户关注的不是抽象能力，而是非常具体的问题：UUID/FIXED_LEN_BYTE_ARRAY 能不能读、统计信息准不准、计划是否靠谱。这反映湖仓兼容已进入“细节决定体验”的阶段。

---

## 7. 待处理积压

以下条目建议维护者重点关注：

### 长期开放的产品级需求
- Issue: #64984 - New multi-tenant data management  
  链接: https://github.com/StarRocks/starrocks/issues/64984
- 状态: 自 2025-11-05 开放至今，评论较少但方向重要。

**建议：**  
即使暂不实现，也可给出 roadmap 定位：是纳入资源治理、Catalog 隔离，还是作为企业版/长期规划项，以降低用户预期不确定性。

### 尚未看到修复 PR 的权限一致性问题
- Issue: #70255  
  https://github.com/StarRocks/starrocks/issues/70255
- Issue: #70264  
  https://github.com/StarRocks/starrocks/issues/70264

**建议：**  
这是今天最现实的生产阻塞类问题之一，建议尽快：
- 明确 root cause 是否与 #70077 同源
- 标注影响版本
- 补充 leader/follower + ldap/ranger 的回归测试

### Java UDF 创建崩溃问题
- Issue: #70262  
  https://github.com/StarRocks/starrocks/issues/70262

**建议：**  
需要尽快判断是：
- FE DDL 分析递归
- UDF 元信息序列化问题
- 类加载/反射死递归
- 全局函数注册路径异常

若短期无法修复，至少应补充规避说明。

### 查询正确性问题的修复映射需更透明
- Issue: #70145  
  https://github.com/StarRocks/starrocks/issues/70145

**建议：**  
尽管 Issue 已关闭，但“Missing rows”级别问题需要：
- 关联具体 fix PR
- 标记受影响版本
- 给出是否需要用户升级/规避
- 补充回归 case

---

## 8. 结论

今日 StarRocks 呈现出典型的**高强度工程推进日**：PR 量大、回合并活跃、多个长期优化项收束。  
从技术重心看，项目正在同时强化三条主线：

- **查询优化器能力**：窗口函数 skew 优化继续完善  
- **湖仓生态兼容**：Iceberg/HDFS/Paimon 的统计、类型、权限与裁剪能力持续增强  
- **工程稳定性**：macOS 构建、UT 稳定、内存生命周期修复同步推进  

需要重点警惕的是：**Paimon/Ranger/LDAP/Follower FE 权限链路**和**查询结果正确性问题**。这两类问题最接近生产可用性底线，应优先跟踪。

如果你愿意，我也可以继续把这份日报整理成更适合团队群播报的 **「3 分钟简版」** 或 **Markdown 周报模板版**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下是 **Delta Lake（delta-io/delta）2026-03-14 项目动态日报**。

---

## 1. 今日速览

过去 24 小时内，**Issues 无新增、无活跃更新**，但 **PR 更新达到 33 条**，说明当前项目节奏明显偏向**代码推进与合并前收敛**，而非问题申报阶段。  
从变更分布看，活跃方向集中在 **Spark/Kernel 集成、DSv2 读写链路、UC（Unity Catalog）兼容性、Deletion Vector/CRC 正确性与测试稳定性**。  
今日关闭/合并的 PR 有 10 条，虽然没有版本发布，但多个修复与基础设施改动表明项目正在为后续一轮较集中的功能落地做准备。  
整体健康度判断：**中高活跃，工程推进扎实，偏底层能力建设与兼容性完善**。

---

## 2. 项目进展

以下为今日值得关注的 **已合并/关闭 PR**，按对查询引擎、存储层与兼容性影响梳理。

### 2.1 Spark 侧：UC 管理表元数据保护
- **#6243 [CLOSED] [Spark] Block metadata changes on UC-managed tables**  
  链接: delta-io/delta PR #6243

**进展解读：**  
该改动针对 **Unity Catalog 管理表** 增加元数据变更限制，防止本地元数据修改成功、但 UC catalog 状态未同步而造成元数据不一致。  
这属于典型的 **catalog 一致性保护**，对企业级部署很重要，尤其是多引擎共享元数据、集中治理场景下。  
它推进的不是新功能，而是 **SQL DDL/元数据操作的安全边界**，降低“表还能读但 catalog 状态失真”的风险。

**影响面：**
- 提升 UC 托管表操作一致性
- 避免非预期 metadata mutation
- 对接入统一元数据治理的用户价值较高

---

### 2.2 Spark 侧：数据跳过（data skipping）正确性修复
- **#6260 [CLOSED] [Spark] Fix timestamp overflow in dataskipping**  
  链接: delta-io/delta PR #6260

**进展解读：**  
这是今日最值得关注的正确性修复之一。PR 指向 **timestamp 溢出导致的数据跳过错误**，这类问题可能直接影响查询过滤判断。  
在 OLAP 引擎里，data skipping 的前提是统计信息和边界判断绝对可靠，一旦时间戳溢出，最坏情况下会造成：
- 该扫描的数据块被错误跳过，产生 **结果不完整**
- 或者跳过失效，导致 **性能退化**

**结论：**  
这是一个兼具 **正确性 + 性能** 影响的修复，优先级较高。

---

### 2.3 Spark 侧：测试稳定性治理
- **#6283 [CLOSED] [Spark] Deflake PartitionLikeDataSkippingSuite**  
  链接: delta-io/delta PR #6283

**进展解读：**  
该 PR 主要是 **去 flaky 测试**。虽然表面上不属于功能开发，但它直接关系到 CI 可信度与回归检测能力。  
考虑到最近 data skipping 相关路径存在修复（如 #6260），这类测试稳定化很关键，说明维护者在减少“假红/假绿”，为后续性能优化和过滤裁剪功能迭代铺路。

---

### 2.4 Kernel / CRC 兼容性：字段命名与 Spark 对齐
- **#6282 [CLOSED] [SPARK] Write fileSizeHistogram (and not histogramOpt) as field name in CRC file**  
  链接: delta-io/delta PR #6282
- **#6281 [CLOSED] [Kernel] Add Delta-Spark compatibility for CRCInfo.fileSizeHistogram**  
  链接: delta-io/delta PR #6281

**进展解读：**  
这两条虽已关闭，但传递出非常清晰的技术信号：  
团队正在处理 **CRC 元信息字段在 Spark 与 Kernel 之间的兼容性对齐问题**，尤其围绕 `fileSizeHistogram` 的字段命名/读取兼容。

**技术诉求：**
- 避免不同组件对 CRC 元数据理解不一致
- 降低跨模块读写时的 schema/字段名兼容风险
- 为更稳定的统计信息消费、诊断和优化器使用打基础

即便单条 PR 最终关闭，也通常意味着实现路径正在调整或拆分，不代表问题本身消失。

---

### 2.5 kernel-spark 读选项演进：ignoreDeletes / skipChangeCommits 路径重构
- **#6245 [CLOSED] [kernel-spark] Support read option ignoreDeletes in dsv2**  
  链接: delta-io/delta PR #6245
- **#6246 [CLOSED] [kernel-spark] Support skipChangeCommits and ignoreDeletes read option in dsv2**  
  链接: delta-io/delta PR #6246
- 后续拆分延续：
  - **#6249 [OPEN] [kernel-spark] Support ignoreChanges read option in dsv2**  
    链接: delta-io/delta PR #6249
  - **#6250 [OPEN] [kernel-spark] Support ignoreFileDeletion read option in dsv2**  
    链接: delta-io/delta PR #6250

**进展解读：**  
今天关闭的是前序打包 PR，后续转向更细粒度拆分实现。  
这说明团队正在将 **DSv2 下 Delta 读路径的兼容读选项** 做系统化迁移，包括：
- `ignoreDeletes`
- `skipChangeCommits`
- `ignoreChanges`
- `ignoreFileDeletion`

这对 **流批兼容读取、变更日志消费语义、CDC/增量读取周边能力** 都是重要基础。

---

### 2.6 Server-side planning / REST catalog 资源生命周期修复
- **#6268 [CLOSED] Add lifecycle management for IcebergRESTCatalogPlanningClient**  
  链接: delta-io/delta PR #6268

**进展解读：**  
该 PR 解决的是 `IcebergRESTCatalogPlanningClient` 的 HTTP 客户端连接泄漏问题。  
虽然这是偏工程基础设施的改动，但对长期运行的查询服务尤其关键，可避免：
- 连接资源泄漏
- 长时间运行后的 catalog 访问异常
- 服务端规划链路的稳定性下降

这反映出 Delta 不仅在打磨 Spark/Kernel，也在关注 **跨 catalog / server-side planning 架构** 的稳态运行。

---

## 3. 社区热点

> 注：给定数据中评论数均为 `undefined`，无法严格按“评论最多”排序。以下按**近 24 小时仍活跃且技术影响面较大**的 PR 归纳。

### 热点一：DSv2 写入链路持续推进
- **#6230 [OPEN] [DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage**  
  链接: delta-io/delta PR #6230
- **#6231 [OPEN] [DSv2] Add factory + transport: DataWriterFactory, BatchWrite**  
  链接: delta-io/delta PR #6231

**技术诉求分析：**  
这组 stacked PR 说明 Delta 正在补齐/重构 **DataSource V2 写入实现**。  
它背后的核心诉求包括：
- 更标准地接入 Spark DSv2 写入模型
- 统一 writer、commit message、batch write 机制
- 为后续支持更复杂的写入语义、catalog 集成和优化器协同打基础

这是典型的 **中长期架构升级信号**，对未来版本影响可能较大。

---

### 热点二：Kernel-Spark DSv2 读取语义补齐
- **#6249 [OPEN] [kernel-spark] Support ignoreChanges read option in dsv2**  
  链接: delta-io/delta PR #6249
- **#6250 [OPEN] [kernel-spark] Support ignoreFileDeletion read option in dsv2**  
  链接: delta-io/delta PR #6250
- **#6276 [OPEN] [kernel-spark] Override columnarSupportMode in DSv2 SparkScan**  
  链接: delta-io/delta PR #6276
- **#6224 [OPEN] [Spark] Implement SupportsReportPartitioning in DSv2 SparkScan**  
  链接: delta-io/delta PR #6224

**技术诉求分析：**  
这一组 PR 指向同一个目标：让 **DSv2 SparkScan** 更完整地暴露 Delta 的分区、列式扫描、读选项语义。  
技术上意味着：
- Spark 可以更好地感知 Delta 的输出分区，减少 shuffle
- 根据 schema 与配置更准确地选择列式/行式读取
- DSv2 语义下兼容现有 Delta read options

这是 **查询引擎集成质量提升** 的核心板块。

---

### 热点三：UC / Catalog 兼容路径继续深化
- **#6166 [OPEN] [Delta-Spark] Extend stagingCatalog for non-Spark session catalog**  
  链接: delta-io/delta PR #6166
- **#6233 [OPEN] [Delta][CI] Add temporary UC-main test setup**  
  链接: delta-io/delta PR #6233

**技术诉求分析：**  
这组 PR 表明 Delta 正在增强 **非 Spark session catalog 场景下的 stagingCatalog 能力**，并补充 UC 主线测试环境。  
说明维护者高度重视：
- UC/catalog 差异下的行为一致性
- CI 中提前暴露 catalog 集成问题
- 复杂部署模式下的事务/建表流程正确性

---

### 热点四：删除向量（DV）错误检测能力
- **#6221 [OPEN] [Kernel][Test] Add corruption detection tests for Deletion Vectors**  
  链接: delta-io/delta PR #6221

**技术诉求分析：**  
该 PR 虽然是测试，但价值很高。它针对 **Deletion Vector 损坏检测** 增加覆盖，特别是 checksum 和截断场景。  
说明社区对 DV 的诉求已经从“功能可用”转向：
- 数据损坏时可否尽快发现
- 错误路径是否稳定可测
- 存储层异常能否给出明确信号

这体现出 Delta 在高阶存储能力上的成熟化过程。

---

## 4. Bug 与稳定性

按严重程度整理如下：

### P1：时间戳溢出导致 data skipping 正确性风险
- **问题/修复：#6260 [CLOSED] [Spark] Fix timestamp overflow in dataskipping**  
  链接: delta-io/delta PR #6260
- **影响：** 可能影响过滤裁剪正确性，严重时会带来结果错误或性能异常
- **状态：** 已有 fix，已关闭/合并路径明确

---

### P1：UC 管理表元数据修改可能造成 catalog 状态不一致
- **问题/修复：#6243 [CLOSED] [Spark] Block metadata changes on UC-managed tables**  
  链接: delta-io/delta PR #6243
- **影响：** DDL/metadata mutation 成功但 UC 状态不同步，存在治理与一致性风险
- **状态：** 已有 fix

---

### P2：Deletion Vector 损坏检测覆盖不足
- **相关 PR：#6221 [OPEN] [Kernel][Test] Add corruption detection tests for Deletion Vectors**  
  链接: delta-io/delta PR #6221
- **影响：** DV 文件损坏时，错误路径若覆盖不足，可能导致故障定位困难
- **状态：** 测试增强进行中，属于预防性稳定性建设

---

### P2：CRC 元信息字段兼容性存在潜在跨组件不一致
- **相关 PR：#6281 [CLOSED]**  
  链接: delta-io/delta PR #6281
- **相关 PR：#6282 [CLOSED]**  
  链接: delta-io/delta PR #6282
- **影响：** Spark/Kernel 对 `fileSizeHistogram` 字段处理不一致，可能影响校验、统计消费或兼容读取
- **状态：** 相关方案仍在调整，建议继续跟踪后续替代 PR

---

### P2：Server-side planning 存在 HTTP 连接泄漏风险
- **修复：#6268 [CLOSED] Add lifecycle management for IcebergRESTCatalogPlanningClient**  
  链接: delta-io/delta PR #6268
- **影响：** 长期运行下可能导致连接耗尽、catalog 访问异常
- **状态：** 已修复

---

### P3：测试不稳定影响 CI 可信度
- **修复：#6283 [CLOSED] [Spark] Deflake PartitionLikeDataSkippingSuite**  
  链接: delta-io/delta PR #6283
- **影响：** 回归判断噪声增加，开发效率下降
- **状态：** 已修复

---

## 5. 功能请求与路线图信号

今天没有新增 Issue，因此没有明确的新用户需求录入；但从 PR 轨迹看，路线图信号非常清晰：

### 5.1 DSv2 将是近期核心方向
- **#6230**、**#6231**、**#6224**、**#6276**、**#6249**、**#6250**  
  链接分别为：
  - delta-io/delta PR #6230
  - delta-io/delta PR #6231
  - delta-io/delta PR #6224
  - delta-io/delta PR #6276
  - delta-io/delta PR #6249
  - delta-io/delta PR #6250

**判断：**  
下一阶段很可能围绕 **DSv2 读写功能补齐、扫描能力暴露、列式/分区能力优化、兼容读选项迁移** 持续推进。  
这属于具有版本级影响的主线工作。

---

### 5.2 Catalog / UC 集成是企业场景重点
- **#6166 [OPEN] Extend stagingCatalog for non-Spark session catalog**  
  链接: delta-io/delta PR #6166
- **#6233 [OPEN] Add temporary UC-main test setup**  
  链接: delta-io/delta PR #6233

**判断：**  
这表明 Delta 正在把支持重点从“单引擎内核”扩展到 **更复杂 catalog 环境中的行为一致性**。  
若这些 PR 合并，未来版本对 UC、外部 catalog、多会话环境的兼容性会更强。

---

### 5.3 存储可靠性：DV 与协议约束持续收紧
- **#6221 [OPEN] Add corruption detection tests for Deletion Vectors**  
  链接: delta-io/delta PR #6221
- **#6205 [OPEN] Update delta protocol to specify remove file path must byte match add file path**  
  链接: delta-io/delta PR #6205

**判断：**  
路线图上不仅在做功能，也在增强 **协议严谨性与存储层错误可检测性**。  
`remove file path must byte match add file path` 这类协议澄清，往往会影响：
- 跨实现兼容性
- 路径比较逻辑的一致性
- 回放日志与删除文件动作的精确匹配

这类改动可能不会作为“新功能”宣传，但对生态兼容非常关键。

---

## 6. 用户反馈摘要

由于今日 **Issues 为 0，且未提供具体评论文本**，无法从 Issue 评论中提炼直接用户原声。  
但从 PR 内容可以间接推测当前用户/贡献者关注点主要集中在以下几类：

1. **查询正确性不能退让**  
   data skipping 的 timestamp overflow 修复说明，用户对过滤裁剪的正确性非常敏感。  
   链接: delta-io/delta PR #6260

2. **企业级 catalog/治理兼容要可依赖**  
   UC 管理表元数据保护、stagingCatalog 扩展、UC-main CI 建设都说明这类场景使用者很多。  
   链接:
   - delta-io/delta PR #6243
   - delta-io/delta PR #6166
   - delta-io/delta PR #6233

3. **DSv2 迁移不能牺牲现有读写语义**  
   read option 的持续补齐与 SparkScan 能力增强，反映出用户希望在升级到 DSv2/新扫描链路后，保持与原有 Delta 行为一致。  
   链接:
   - delta-io/delta PR #6249
   - delta-io/delta PR #6250
   - delta-io/delta PR #6224
   - delta-io/delta PR #6276

4. **底层存储可靠性要求提升**  
   Deletion Vector 校验与 CRC 字段兼容问题说明，用户已开始关注“出错时是否能快速发现、跨组件是否严格一致”。  
   链接:
   - delta-io/delta PR #6221
   - delta-io/delta PR #6281
   - delta-io/delta PR #6282

---

## 7. 待处理积压

以下 PR 创建时间较早、且仍处于开放状态，建议维护者重点关注：

### 7.1 #5874 长期开启：移除旧版 Scala LogStore
- **#5874 [OPEN] [Spark] Remove the old scala LogStores**  
  作者: @felipepessoto  
  创建: 2026-01-18  
  更新: 2026-03-13  
  链接: delta-io/delta PR #5874

**关注原因：**  
这是明显的技术债清理项，且和底层存储访问路径有关。长期不落地会导致：
- 新旧 LogStore 双轨维护成本持续存在
- 存储适配层复杂度升高
- Java/Scala 实现并存带来行为漂移风险

---

### 7.2 #6097 并发安全修复尚未收敛
- **#6097 [OPEN] [Spark] Make txn readFiles and readTheWholeTable thread safe**  
  作者: @felipepessoto  
  创建: 2026-02-20  
  更新: 2026-03-13  
  链接: delta-io/delta PR #6097

**关注原因：**  
这涉及 `OptimisticTransaction` 多线程访问安全。  
事务读路径线程安全问题，潜在影响范围较广，一旦存在竞态，可能影响：
- 读取谓词记录
- 表扫描范围
- 并行执行下的一致性与稳定性

建议优先评审。

---

### 7.3 #6166 Catalog 扩展 PR 影响面大、停留时间较长
- **#6166 [OPEN] [Delta-Spark] Extend stagingCatalog for non-Spark session catalog**  
  创建: 2026-03-02  
  更新: 2026-03-13  
  链接: delta-io/delta PR #6166

**关注原因：**  
该 PR 位于近期 roadmap 主线上，且关联 UC / catalog 测试搭建。  
如长期停留，会拖慢：
- 非标准 session catalog 支持
- UC 相关兼容收敛
- 上层 stacked PR 的推进速度

---

### 7.4 #6205 协议层澄清需尽快定稿
- **#6205 [OPEN] Update delta protocol to specify remove file path must byte match add file path**  
  创建: 2026-03-05  
  更新: 2026-03-13  
  链接: delta-io/delta PR #6205

**关注原因：**  
协议语义模糊越久，越容易让不同实现产生分歧。  
这类改动虽然不是“功能点”，但对生态一致性非常重要，建议尽快形成最终文本。

---

## 总结判断

Delta Lake 今日没有版本发布，也没有 Issue 层面的用户问题输入，但 **PR 维持高活跃**，且工作重心非常集中：  
- **DSv2 读写主线持续推进**
- **UC / catalog 集成增强**
- **数据跳过、DV、CRC 等正确性与可靠性补强**
- **测试稳定性和生命周期管理等工程质量提升**

从项目健康度看，当前处于一个明显的 **“底层能力收敛 + 下一轮功能落地前的夯实阶段”**。如果后续几天 DSv2 与 catalog 相关 stacked PR 开始集中合并，预计将构成下一次版本演进的核心内容。

如果你愿意，我还可以继续把这份日报转成：
1. **更适合内部周报的管理层摘要版**，或  
2. **面向研发团队的技术跟踪版（按 Spark / Kernel / Protocol 分栏）**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 — 2026-03-14

## 1. 今日速览

过去 24 小时内，Databend 仓库整体保持**中等偏高活跃度**：Issues 更新 3 条且均被关闭，PR 更新 9 条，其中 7 条仍在推进、2 条关闭，说明当前工作重心明显集中在 **查询引擎演进、表版本/标签模型重构、以及稳定性修复**。  
从主题看，今天的开发活动主要围绕 **递归 CTE 执行、相关子查询 decorrelate、运行时过滤器策略、大 IN-list 规划稳定性、hash shuffle 重构** 等核心执行器/优化器能力展开。  
此外，**FUSE table snapshots 的 experimental table tags** 与旧版 branch/tag 机制替换，是一个比较明确的产品路线信号，表明 Databend 正在重塑表级版本引用能力。  
稳定性方面，虽然今天没有新增 Issue，但一个与 `GROUP_CONCAT(DISTINCT ...)` 相关的**聚合内存泄漏**问题被关闭，说明已有处理进展；同时多个 PR 直接瞄准查询正确性与 planner 健壮性。

---

## 3. 项目进展

### 已关闭 / 已处理的重要 PR

#### 1) 跳过 HTTP catalog endpoint 对 attached tables 的 S3 refresh
- **PR**: #19548 `[pr-bugfix] fix(http): skip S3 refresh for attached tables in HTTP catalog endpoints`
- **状态**: Closed
- **链接**: https://github.com/databendlabs/databend/pull/19548

**进展解读：**  
该修复针对一个典型的**控制面可用性问题**：当 attached table 所依赖的 S3 存储从 manage service 侧不可达时，HTTP catalog 接口会整体失败。PR 通过在 HTTP catalog endpoint 中统一启用 `disable_table_info_refresh`，避免因远端对象存储探测失败而拖垮元数据接口。  
这类修改虽然不直接提升查询性能，但对 **多 catalog / attached table 场景下的管理面稳定性** 很关键，尤其适合云环境、跨网络区域部署和权限隔离场景。

#### 2) 移除 legacy table branch/tag 实现
- **PR**: #19534 `[pr-refactor] refactor: remove legacy table branch/tag implementation`
- **状态**: Closed
- **链接**: https://github.com/databendlabs/databend/pull/19534

**进展解读：**  
该 PR 关闭意味着旧版 table branch/tag 模型进一步退出主线。结合今天新开的实验性 table tags PR（#19549）与持续中的 branch 重构 PR（#19499），可以判断 Databend 正在从旧的表层 branch/tag 机制迁移到**新的 KV-backed metadata 模型**。  
这对未来的 **snapshot 引用、时间点恢复、分支实验、标签化快照管理** 都是底层准备工作，属于路线级改造。

---

### 今日仍在推进的关键 PR

#### 3) 递归 CTE 流式执行
- **PR**: #19545 `[pr-refactor] refactor: Recursive CTE streaming execution`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19545

**技术价值：**  
这是今天最值得关注的执行引擎方向之一。PR 明确提到用于解决 Databend 无法执行复杂递归查询（如 Sudoku 示例）的问题。  
递归 CTE 的流式执行意味着 Databend 在 **复杂 SQL 表达能力、层次查询、图遍历类分析任务** 上继续补齐能力。如果最终落地，将明显改善 ANSI SQL 递归查询可用性，并降低一次性物化带来的资源压力。

#### 4) FUSE table snapshots 支持 experimental table tags
- **PR**: #19549 `[pr-feature] feat(query): support experimental table tags for FUSE table snapshots`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19549

**技术价值：**  
该 PR 引入新的 **KV-backed table tag model**，而不是复用旧 branch/tag 实现。  
这说明 Databend 正尝试把快照标记能力更稳健地绑定到 FUSE 表快照体系，有望提升：
- snapshot/tag 元数据一致性
- table version reference 的可维护性
- 后续 branch/tag 语义扩展能力

这是非常明确的**版本化数据管理能力增强**信号。

#### 5) Planner 修复：相关标量子查询 + LIMIT decorrelate
- **PR**: #19532 `[pr-bugfix] fix(planner): decorrelate correlated scalar subquery limit (#13716)`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19532

**技术价值：**  
这个修复非常实用，目标是把带 `LIMIT` / `ORDER BY ... LIMIT` 的相关标量子查询改写为基于分区 `row_number()` 的过滤执行。  
它推进了两件事：
1. **查询正确性与可执行性**提升  
2. Databend 优化器对复杂嵌套 SQL 的支持更接近主流分析型数据库行为

同时 PR 也明确拒绝仍不支持的聚合型场景，说明团队在**边界定义和正确性优先**上较谨慎。

#### 6) Runtime filter selectivity 策略修正
- **PR**: #19547 `[pr-bugfix] fix(query): scope runtime filter selectivity to bloom`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19547

**技术价值：**  
该 PR 将 `join_runtime_filter_selectivity_threshold` 的作用域收窄到 **bloom runtime filter**，同时确保 **IN-list / min-max runtime filter** 不会因为 bloom 被 selectivity 策略禁用而一起失效。  
这反映出 Databend 正在细化 runtime filter 的策略控制，平衡：
- 过滤收益
- 规划复杂度
- 不同 filter 类型的适用性

属于典型的**执行器启发式规则修正**，对 join 查询性能稳定性有实际意义。

#### 7) 大 IN-list 规划稳定性修复
- **PR**: #19546 `[pr-bugfix] fix: flatten IN-list OR predicates`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19546

**技术价值：**  
该修复主要解决在高 `max_inlist_to_or` 配置下，大型 `IN` 列表展开为左深 `OR` 树可能触发的**栈溢出**问题，同时强调保持 `IN / NOT IN` 的 `NULL` 语义正确。  
这类问题非常贴近生产：BI 生成 SQL、应用层拼接过滤条件、大批量 ID 查询都可能构造超长 `IN`。  
因此这是一个兼顾 **稳定性、正确性、工程实用性** 的重要修复。

#### 8) Hash shuffle 重构
- **PR**: #19505 `[pr-refactor, ci-cloud] refactor(query): refactor hash shuffle`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19505

**技术价值：**  
Hash shuffle 是分布式执行中的基础能力。虽然摘要信息有限，但这类重构往往涉及：
- 数据分发路径简化
- 并发与背压行为优化
- 分布式聚合 / join 的执行稳定性改进

考虑到 Databend 的分析型场景定位，这属于影响面较大的底层工程工作，值得持续关注。

#### 9) Table branch 持续重构
- **PR**: #19499 `[pr-refactor] refactor: table branch refactor`
- **状态**: Open
- **链接**: https://github.com/databendlabs/databend/pull/19499

**技术价值：**  
与 #19549、#19534 一起看，这不是零散改动，而是一组连续的表版本引用体系重塑工作。  
可判断维护团队正在清理旧实现债务，并为新的 tag/branch/snapshot 语义铺路。

---

## 4. 社区热点

> 说明：今天 Issues/PR 的评论和反应数整体不高，社区热点更多体现在“技术影响面”而非“讨论热度”。

### 热点 1：递归 CTE 流式执行
- **链接**: https://github.com/databendlabs/databend/pull/19545

**为什么值得关注：**  
递归 CTE 是 OLAP 数据库 SQL 完整度的重要指标之一。PR 直接提到 Sudoku 查询无法执行的实际案例，说明用户对**更复杂 SQL 任务的支持**有明确需求。  
背后技术诉求是：Databend 不仅要快，还要能表达更复杂的数据推理、层级遍历与递归分析逻辑。

### 热点 2：FUSE snapshot table tags / branch 重构线
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19549  
  - https://github.com/databendlabs/databend/pull/19499  
  - https://github.com/databendlabs/databend/pull/19534

**为什么值得关注：**  
这组改动集中指向 Databend 的**表快照引用与版本元数据模型升级**。  
背后技术诉求包括：
- 面向数据快照的可追踪性
- 更合理的元数据存储抽象
- 避免 legacy 实现约束后续功能演进

对数据治理、实验分支、可重复分析、快照审计等方向都有潜在价值。

### 热点 3：复杂 SQL 正确性修复
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19532  
  - https://github.com/databendlabs/databend/pull/19546  
  - https://github.com/databendlabs/databend/pull/19547

**为什么值得关注：**  
这三条 PR 都聚焦于优化器/执行器边界条件：
- 相关标量子查询 with LIMIT
- 大 IN-list 逻辑展开
- runtime filter 策略误伤

背后的共同诉求是：**Databend 在复杂 SQL、自动生成 SQL、以及大规模 join/filter 场景下，需要更稳定、更接近用户预期。**

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：`GROUP_CONCAT(DISTINCT ...)` 在 group by 最终聚合阶段内存泄漏
- **Issue**: #19543 `[CLOSED] [C-bug] bug: GROUP_CONCAT(DISTINCT ...) leaks memory in group by`
- **链接**: https://github.com/databendlabs/databend/issues/19543

**影响评估：高**  
这是典型的**聚合算子资源泄漏**问题，影响查询稳定性与长期运行可靠性。  
如果用户在分组聚合中使用 `GROUP_CONCAT(DISTINCT ...)`，尤其在高基数场景下，可能导致内存持续增长，严重时引发 OOM 或节点不稳定。  
Issue 已关闭，说明应已有修复或已被关联处理；但当前提供的数据中**未直接给出对应 fix PR**，建议维护者在关闭说明中补充关联提交/PR，方便用户追踪回归风险。

### P2：大 IN-list 展开导致栈溢出风险
- **PR**: #19546
- **链接**: https://github.com/databendlabs/databend/pull/19546

**影响评估：中高**  
这属于 planner/expression rewrite 层面的结构性风险。对于自动生成 SQL 的业务、报表工具、风控规则系统，长 `IN` 非常常见。  
当前已有 fix PR 在推进中，属于**已识别、待合并**状态。

### P2：相关标量子查询 `LIMIT` / `ORDER BY ... LIMIT` 的 decorrelate 问题
- **PR**: #19532
- **链接**: https://github.com/databendlabs/databend/pull/19532

**影响评估：中高**  
这类问题直接影响 SQL 可执行性与正确性，是复杂查询兼容性的重要缺口。  
已有 fix PR，在推进中。

### P3：HTTP catalog endpoints 受 attached table S3 不可达影响
- **PR**: #19548
- **链接**: https://github.com/databendlabs/databend/pull/19548

**影响评估：中**  
偏运维与控制面稳定性问题，对云场景和跨服务访问限制环境影响较大。  
该修复已关闭，显示已完成处理。

### P3：stage file 不存在时未返回清晰错误
- **Issue**: #13267 `[CLOSED] [C-feature] Feature: display error with select query stage file if file not exists`
- **链接**: https://github.com/databendlabs/databend/issues/13267

**影响评估：中**  
严格来说这是“功能/易用性缺陷”，不是崩溃类 bug，但会明显影响用户排障效率。  
用户反馈的核心问题是：查询 stage 上不存在的文件时，没有得到明确报错，而是返回空结果，容易造成误判。  
Issue 已关闭，说明相关行为可能已修复或已被产品策略吸收。

### P3：backtrace 解码使用体验问题
- **Issue**: #17729 `[CLOSED] Howto decode the backtrace`
- **链接**: https://github.com/databendlabs/databend/issues/17729

**影响评估：中低**  
不是功能故障本身，而是**故障诊断工具链可用性**问题。  
对 nightly 用户和自部署用户来说，无法快速解码 backtrace 会显著增加问题定位成本。Issue 已关闭，但值得继续完善文档化支持。

---

## 6. 功能请求与路线图信号

### 1) 表快照标签化能力正在进入主线视野
- **相关 PR**: #19549, #19499, #19534
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19549  
  - https://github.com/databendlabs/databend/pull/19499  
  - https://github.com/databendlabs/databend/pull/19534

**判断：高概率纳入下一阶段版本能力**  
虽然今天没有新功能 Issue，但从 PR 线索看，**experimental table tags for FUSE snapshots** 已经具备明确产品方向。  
这通常意味着 Databend 未来会更强调：
- 快照可命名引用
- 表级“轻量版本指针”
- 分析回溯与数据实验流程

### 2) SQL 完整度持续增强：递归 CTE 与复杂子查询
- **相关 PR**: #19545, #19532
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19545  
  - https://github.com/databendlabs/databend/pull/19532

**判断：中高概率持续推进**  
递归 CTE 和相关子查询 decorrelate 都是 OLAP SQL 兼容性的“硬骨头”。团队今天在这两个方向都投入了明显精力，表明 Databend 正朝着**更强查询表达力**演进，而不仅是聚焦存储/吞吐。

### 3) 运行时过滤与分布式执行基础设施继续打磨
- **相关 PR**: #19547, #19505
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19547  
  - https://github.com/databendlabs/databend/pull/19505

**判断：持续性底层优化路线**  
runtime filter 与 hash shuffle 都是典型的查询引擎性能支柱模块。  
这类工作一般不会以“大功能”形式呈现，但会显著影响 Databend 在多表 join、MPP 分布式执行场景中的稳定性和性价比。

---

## 7. 用户反馈摘要

### 1) 用户希望错误更“显式”，而不是静默返回异常结果形态
- **Issue**: #13267
- **链接**: https://github.com/databendlabs/databend/issues/13267

真实痛点在于：查询 stage 文件路径错误时返回“0 row read”，会让用户误以为文件存在但为空，而不是文件压根不存在。  
这反映出 Databend 用户对**可诊断性、易用性、错误语义准确性**要求在提升，尤其在数据接入与外部 stage 使用场景中更明显。

### 2) 用户对复杂聚合的资源稳定性非常敏感
- **Issue**: #19543
- **链接**: https://github.com/databendlabs/databend/issues/19543

`GROUP_CONCAT(DISTINCT ...)` 内存泄漏问题说明，用户已经在使用较复杂的聚合表达式，Databend 不再只承载基础 scan/filter/group 场景。  
这也意味着聚合内核的资源控制、去重状态管理、spill/释放逻辑会越来越关键。

### 3) nightly / 镜像使用者对故障定位工具链仍有门槛
- **Issue**: #17729
- **链接**: https://github.com/databendlabs/databend/issues/17729

用户遇到 backtrace 后，希望有更直接的 decode 方式。  
这反映出 Databend 的一部分用户群体已深入到**自部署、镜像调试、底层异常排查**阶段，说明项目使用深度在增加，但调试体验仍有提升空间。

---

## 8. 待处理积压

### 1) table branch 重构仍在持续，建议加快收敛设计边界
- **PR**: #19499 `[OPEN] refactor: table branch refactor`
- **创建时间**: 2026-03-01
- **链接**: https://github.com/databendlabs/databend/pull/19499

该 PR 已持续约两周，且与 #19549、#19534 高度相关。  
建议维护者关注：
- 是否需要拆分为更小可审查单元
- 新旧模型迁移路径是否已清晰
- 文档/兼容说明是否同步准备

因为这类元数据模型重构若拖得过久，容易影响相关功能 PR 的评审效率。

### 2) hash shuffle 重构影响面大，需持续关注测试覆盖
- **PR**: #19505 `[OPEN] refactor(query): refactor hash shuffle`
- **创建时间**: 2026-03-04
- **链接**: https://github.com/databendlabs/databend/pull/19505

该 PR 目前标注了 logic test，但未见 unit test / benchmark test。  
考虑到 hash shuffle 是分布式执行关键路径，建议维护者重点补充：
- 回归测试
- skew / repartition 场景验证
- 性能基线对比

### 3) 递归 CTE 流式执行建议重点评审
- **PR**: #19545
- **链接**: https://github.com/databendlabs/databend/pull/19545

虽然是新 PR，但它属于高复杂度执行引擎改造。  
建议尽早明确：
- 内存边界
- 终止条件与循环检测
- 与优化器/分布式执行兼容性

否则后续容易在功能正确性与执行资源控制上引发新的回归。

---

## 健康度结论

今天 Databend 的项目状态总体健康，且呈现出比较鲜明的**“底层能力升级 + SQL 正确性修补 + 元数据模型重构”**三线并进特征。  
优点是方向清晰、PR 质量集中在核心模块；风险点则在于多个变更都位于**执行引擎与元数据核心路径**，需要较强测试与回归验证来保障稳定上线。  
如果接下来几天能尽快合入 `decorrelate`、`IN-list flatten`、`runtime filter` 等修复，并对 table tags / branch 重构给出更清晰迁移说明，那么 Databend 的下一阶段版本质量与功能完整度都值得期待。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时，Apache Gluten 保持**较高活跃度**：Issues 更新 5 条、PR 更新 29 条，明显以工程推进和 CI/构建修复为主。  
今天没有新版本发布，但在 **Velox 对齐、Spark 4.x 兼容、内存管理、CI 稳定性** 等方向都有持续推进。  
从关闭项看，项目在主动做**技术债清理**，例如移除 RAS；从新增问题看，近期重点仍集中在 **Spark 4.x 回归修复** 和 **执行计划包装导致的兼容性问题**。  
整体健康度良好：活跃 PR 数量高，但也反映出当前仍有较多变更处于评审/待合并状态，短期内维护者评审压力偏大。

---

## 3. 项目进展

### 已完成 / 已关闭的重要变更

#### 3.1 移除 RAS，降低维护负担
- **PR**: #11756 [CLOSED] [CORE] Remove RAS  
  链接: apache/gluten PR #11756
- **Issue**: #11578 [CLOSED] [VL] Remove RAS  
  链接: apache/gluten Issue #11578

**进展解读：**  
项目正式移除 RAS 优化器，说明团队在做架构收缩与维护成本优化。Issue 中明确指出，RAS 带来的维护负担已经超过收益，因此转为独立项目维护。  
这类变更对 Gluten 核心价值有两个直接影响：
1. 减少主干分支中难维护的优化路径；
2. 让核心精力回到 Velox 后端集成、Spark 兼容性与稳定性修复上。

**迁移影响：**  
PR 中注明存在破坏性配置变更：
- `spark.gluten.ras.costModel` 重命名为 `spark.gluten.costModel`

这意味着已有部署若仍使用旧参数，需要同步调整配置。

---

#### 3.2 修复构建信息泄漏风险
- **Issue**: #11750 [CLOSED] [build] Redact the user@password part from the build info file  
  链接: apache/gluten Issue #11750

**进展解读：**  
该问题关注构建日志/构建信息文件中仓库 URL 可能包含 `user:password@...` 明文凭据的问题。虽然这是构建链路问题，不直接影响查询执行，但属于**供应链安全与运维合规**范畴。  
问题当日创建并关闭，说明维护者响应较快，项目对安全细节较敏感。

---

#### 3.3 修复 AssertNotNull 表达式映射
- **PR**: #11749 [CLOSED] [CORE, VELOX] Fix AssertNotNull mapping  
  链接: apache/gluten PR #11749

**进展解读：**  
该修复属于 **SQL 表达式语义兼容性** 范畴。`AssertNotNull` 映射错误通常会影响 Spark Catalyst 表达式下推、执行计划转换或空值语义一致性。  
这类修复虽然不大，但对**查询正确性**非常关键，尤其在复杂投影、谓词和表达式折叠中可能触发隐藏问题。

---

#### 3.4 工具链与文档补齐持续推进
- **PR**: #11732 [CLOSED] [TOOLS] tools: fix gen function support script  
  链接: apache/gluten PR #11732
- **PR**: #11733 [CLOSED] [DOCS] Add VeloxDelta.md for Delta Lake feature support  
  链接: apache/gluten PR #11733
- **PR**: #11648 [CLOSED] [VELOX, DOCS] Adding context executor  
  链接: apache/gluten PR #11648

**进展解读：**  
今天关闭的几项中，文档和工具链工作占比不低，反映项目在补全：
- Delta Lake 支持说明；
- 函数支持生成脚本；
- Velox 相关执行上下文能力文档/实现。

这说明 Gluten 正在从“功能可用”走向“能力可发现、可维护、可验证”。

---

## 4. 社区热点

### 4.1 Velox 未合并上游 PR 跟踪仍是最活跃讨论点
- **Issue**: #11585 [OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream  
  作者: @FelixYBW | 评论: 16 | 👍: 4  
  链接: apache/gluten Issue #11585

**热点分析：**  
这是当前评论最多、反应最多的议题。其本质并非单一 bug，而是 **Gluten 社区与 Velox 上游之间的协同效率问题**。  
Issue 明确在跟踪“由 Gluten 社区贡献、但尚未被 Velox 上游合并”的 PR，反映出几个现实技术诉求：
1. Gluten 对 Velox 新能力和修复有较强依赖；
2. 社区不希望长期维护大量私有 patch；
3. rebase/pick patch 成本已成为实际工程负担。

这是典型的 **上游依赖治理问题**。若长期不能收敛，容易影响版本升级节奏和问题修复时效。

---

### 4.2 Spark 4.x 禁用测试套跟踪体现兼容性攻坚
- **Issue**: #11550 [OPEN] [bug, triage, tracker] Spark 4.x: Tracking disabled test suites  
  作者: @baibaichen | 评论: 6  
  链接: apache/gluten Issue #11550
- **相关 PR**: #11726 [OPEN] [VL][UT] Enable Variant test suites  
  链接: apache/gluten PR #11726

**热点分析：**  
这是当前最明确的路线图信号之一：**Spark 4.0/4.1 兼容性恢复工作正在系统推进**。  
Issue 以 tracker 形式组织 disabled suites，说明当前不是零散修 bug，而是在做一轮较大规模的测试恢复与兼容性扫尾。  
相关 PR #11726 已开始重新启用 Variant 相关测试套，显示工作已进入“分模块回补”的执行阶段。

---

### 4.3 TLP 毕业相关 CI 清理开始推进
- **PR**: #11741 [OPEN] [INFRA] Update GitHub CI workflows for TLP graduation  
  链接: apache/gluten PR #11741

**热点分析：**  
该 PR 主要将 `incubator-gluten` 相关引用更新为 `gluten`，覆盖 Issue 模板、PR 模板、workflow 等。  
这不是单纯“改名”，而是 Apache 顶级项目毕业准备的一部分，意味着项目治理、仓库路径、自动化基础设施正在对未来阶段做切换准备。  
从信号上看，社区正在同步处理**品牌/流程/CI 规范化**问题。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1：执行计划包装破坏 Spark shuffle ID 获取
- **Issue**: #11752 [OPEN] [bug] Fix AdaptiveSparkPlanExec wrapped by ColumnarToCarrierRow breaks shuffle IDs retrieval  
  作者: @wangyum  
  链接: apache/gluten Issue #11752

**问题描述：**  
Gluten 的列式 writer 优化会用 `ColumnarToCarrierRow` 包装 `AdaptiveSparkPlanExec`，但这会破坏 Apache Spark PR #51432 中依赖的模式匹配，导致 shuffle ID 获取失败。  

**影响分析：**
- 影响 AQE/Shuffle 相关逻辑的识别；
- 可能造成执行计划分析异常、优化路径失效，甚至引发运行时行为偏差；
- 属于**Spark 核心执行语义兼容性问题**，优先级较高。

**当前状态：**
- 暂未看到对应 fix PR。

---

### P1：`ExpressionConverter` 中 `Some(null)` 导致 fallback 失效
- **PR**: #11757 [OPEN] [CORE] Fix Some(null) in ExpressionConverter bypassing expression transformation fallback  
  链接: apache/gluten PR #11757

**问题描述：**  
当前默认分支返回 `Some(null)` 而非 `None`，导致调用方的 `.getOrElse(...)` 无法正确走回退逻辑。  

**影响分析：**
- 影响表达式转换的兜底路径；
- 容易造成未匹配表达式被错误“视为已转换”，进而引发空指针、错误计划映射或语义偏差；
- 属于**查询正确性与稳定性高风险点**。

**当前状态：**
- 已有修复 PR，待合并。

---

### P1：`ColumnarCollectLimitExec` 对跳过/切片 batch 的资源释放不完整
- **PR**: #11754 [OPEN] [VELOX] Close ColumnarBatch in ColumnarCollectLimitExec for skipped and sliced batches  
  链接: apache/gluten PR #11754

**问题描述：**  
`fetchNextBatch()` 在两种情况下可能泄漏内存：
1. batch 全部落入 offset 跳过范围；
2. batch 被切片后原始对象未及时释放。

**影响分析：**
- 直接关联**列式执行内存泄漏**；
- 对 limit/offset 类查询、交互式分析任务和长时作业尤其敏感；
- 若高并发下累积，可能放大 executor 内存压力。

**当前状态：**
- 已有修复 PR，待合并。

---

### P2：`GlutenDirectBufferedInput` 析构阶段过晚取消加载
- **PR**: #11697 [OPEN] [VELOX] Cancel load earlier in `GlutenDirectBufferedInput` destructor  
  链接: apache/gluten PR #11697

**影响分析：**
- 更偏向 I/O 生命周期管理与资源回收优化；
- 若取消过晚，可能导致多余 I/O、阻塞或资源滞留；
- 对大文件读取、远端存储读取场景有潜在收益。

---

### P2：CI 并发控制导致格式检查任务互相取消
- **PR**: #11760 [OPEN] [INFRA] [CI] Fix the concurrency of code format check  
  链接: apache/gluten PR #11760

**影响分析：**
- 主要影响开发流程稳定性；
- 不影响线上查询正确性，但会影响贡献者提交体验和评审效率。

---

## 6. 功能请求与路线图信号

### 6.1 Spark 4.x 测试恢复很可能进入下一阶段重点
- **Issue**: #11550  
  链接: apache/gluten Issue #11550
- **PR**: #11726  
  链接: apache/gluten PR #11726

**判断：**  
Variant 测试套重新启用已开始落地，说明 Spark 4.x 兼容性不是远期规划，而是当前主线工作之一。  
预计下一版本或近期迭代中，会持续看到：
- disabled suites 逐个恢复；
- Validator/表达式映射规则增强；
- Spark 4.0/4.1 差异适配完善。

---

### 6.2 Velox 对齐仍是主航道
- **Issue**: #11585  
  链接: apache/gluten Issue #11585
- **PR**: #11755 [OPEN] Daily Update Velox Version (2026_03_13)  
  链接: apache/gluten PR #11755

**判断：**  
每日 Velox 版本更新 PR 仍在持续，配合未上游合并 PR 跟踪 Issue，可见 Gluten 仍高度依赖 Velox 演进。  
短期路线图大概率仍围绕：
- 上游特性跟进；
- 下游兼容 patch 收敛；
- 减少 fork 成本。

---

### 6.3 MacOS 构建与依赖治理在补强
- **PR**: #11563 [OPEN] Enable VCPKG for MacOS build  
  链接: apache/gluten PR #11563
- **PR**: #11681 [OPEN] fix to add missing direct dependency for each module  
  链接: apache/gluten PR #11681

**判断：**  
这反映项目正在提升**跨平台构建可用性**与模块依赖显式化，对开发者体验和 CI 可重复性有直接帮助。  
虽然不是最终用户功能，但它通常会被纳入近期版本，因为能显著降低构建/发布维护成本。

---

### 6.4 写文件大小配置可能进入可用性增强项
- **PR**: #11606 [OPEN] Adding configurations on max write file size  
  链接: apache/gluten PR #11606

**判断：**  
该功能偏向数据写出控制和存储布局优化，对大规模湖仓场景有现实价值。  
若合入，将帮助用户更细粒度控制：
- 文件大小；
- 小文件问题；
- 下游读取效率与 compaction 压力。

这类配置项很适合作为下一版本的“易感知增强”。

---

## 7. 用户反馈摘要

### 7.1 用户最现实的痛点是“兼容性细节导致功能不可用”
- 代表问题：
  - #11752 执行计划包装破坏 Spark 模式匹配  
    链接: apache/gluten Issue #11752
  - #11550 Spark 4.x 测试套仍有禁用项  
    链接: apache/gluten Issue #11550

**提炼：**  
用户当前并非主要抱怨性能不足，而是更关注：
- Spark 新版本是否稳定可跑；
- AQE / Shuffle / Variant / 表达式映射是否语义一致；
- 某些优化包装是否会破坏 Spark 原生行为。

这说明 Gluten 已进入“从性能插件走向生产兼容平台”的阶段。

---

### 7.2 社区贡献者对上游协同成本敏感
- 代表问题：
  - #11585 Velox 未合并 PR 跟踪  
    链接: apache/gluten Issue #11585

**提炼：**  
贡献者关注的不是单个功能缺失，而是“修复已经有了，但卡在上游合并”。  
这反映真实工程痛点：
- patch 生命周期长；
- 分支维护复杂；
- 升级成本高于一次性开发成本。

---

### 7.3 用户也在关注安全与工程细节
- 代表问题：
  - #11750 构建信息泄漏凭据  
    链接: apache/gluten Issue #11750

**提炼：**  
虽然不是查询引擎问题，但说明用户已把 Gluten 用在更规范的企业环境中，对日志脱敏、构建合规、CI 稳定性都有明确要求。

---

## 8. 待处理积压

### 8.1 长期 WIP：Join pullout pre-project
- **PR**: #10851 [OPEN] [WIP] Join support pullout pre-project  
  创建: 2025-10-08  
  链接: apache/gluten PR #10851

**提醒：**  
这是明显的长期挂起 PR。主题本身与 Join 优化相关，潜在价值较高，但长时间未完成通常意味着：
- 设计复杂；
- 跨后端影响面大；
- 缺少集中评审资源。

建议维护者明确其状态：继续推进、拆分提交，或关闭重做。

---

### 8.2 MacOS VCPKG 构建支持推进较慢
- **PR**: #11563 [OPEN] Enable VCPKG for MacOS build  
  创建: 2026-02-04  
  链接: apache/gluten PR #11563

**提醒：**  
这类构建基础设施 PR 若长期不合并，会拖慢开发者入门和跨平台验证效率。  
建议尽快给出：
- 是否接受当前方案；
- 是否需要拆分为基础依赖与平台适配两部分。

---

### 8.3 写文件大小配置仍待落地
- **PR**: #11606 [OPEN] Adding configurations on max write file size  
  创建: 2026-02-11  
  链接: apache/gluten PR #11606

**提醒：**  
这是用户可感知度较高的增强项，若已具备设计共识，建议优先推进评审。  
它对湖仓写入稳定性和文件布局控制具有直接价值。

---

### 8.4 依赖治理修复尚未收敛
- **PR**: #11681 [OPEN] fix to add missing direct dependency for each module  
  创建: 2026-03-02  
  链接: apache/gluten PR #11681

**提醒：**  
模块缺失直接依赖的问题往往会导致：
- 构建偶现失败；
- IDE/增量编译体验不一致；
- 发布产物潜在不稳定。

建议作为构建稳定性专项的一部分尽快处理。

---

## 总结

今天的 Apache Gluten 主要呈现出三条主线：

1. **清理技术债**：移除 RAS，降低长期维护复杂度；  
2. **补强兼容性与稳定性**：聚焦 Spark 4.x、表达式转换、内存释放与 AQE/Shuffle 兼容问题；  
3. **强化工程体系**：持续推进 Velox 对齐、CI 修复、构建依赖治理与 TLP 毕业相关改造。

从项目节奏看，当前 Gluten 正从“能力扩展期”转向“稳定化与平台化”阶段。若后续几项高优先级修复 PR 能顺利合并，项目健康度还会进一步提升。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时内，Apache Arrow 项目保持较高活跃度：Issues 更新 27 条、PR 更新 17 条，但**无新版本发布**。  
从变更结构看，今天的重点集中在 **C++ / Gandiva 稳定性修复、Flight SQL ODBC 跨平台推进、Python 文档与类型系统完善、Parquet 加密/写入能力增强**。  
关闭的 Issue/PR 数量较多，说明维护者在持续清理历史问题与快速收敛近期缺陷，项目整体健康度较好。  
同时也能看到若干**长期积压议题**仍在被“stale-warning”触发更新，显示部分架构性议题（Substrait、Flight 文档、R/Python 生态兼容）仍缺少实质推进。

---

## 3. 项目进展

### 已关闭 / 合并方向的重点进展

#### 3.1 Gandiva 字符串与时间戳函数稳定性连续修复
今天 Gandiva 相关多项问题关闭，显示表达式执行层在做一轮较密集的边界条件与内存安全修复：

- **LPAD/RPAD 内存安全与性能优化已关闭**
  - Issue: #49438  
  - PR: #49439  
  - 链接: `apache/arrow Issue #49438` / `apache/arrow PR #49439`
  - 影响：修复 `lpad/rpad` 在填充字符串长度超过目标填充空间时可能出现的越界写问题，同时优化单字节/多字节填充逻辑。
  - 意义：这直接关系到 SQL 风格字符串函数在 Gandiva 执行中的**正确性与吞吐表现**，对嵌入式表达式求值、UDF 风格场景都有帮助。

- **castVARCHAR 内存分配低效与 len<=0 边界处理已关闭**
  - Issue: #49420  
  - PR: #49421  
  - 链接: `apache/arrow Issue #49420` / `apache/arrow PR #49421`
  - 影响：修复 bool 转字符串时无效 arena 分配，以及整数分支对 `len=0` 未处理的问题。
  - 意义：属于典型的**查询执行正确性 + 内存效率**修补，减少了低级别表达式函数的异常行为。

- **pre-epoch 时间戳转字符串错误已关闭**
  - Issue: #49454  
  - PR: #49455  
  - 链接: `apache/arrow Issue #49454` / `apache/arrow PR #49455`
  - 影响：修复 1970 年之前时间戳在 `castVARCHAR_timestamp_int64` 中出现负毫秒片段的问题。
  - 意义：这是典型的**时间语义正确性**问题，影响历史时间数据、金融/档案类数据集以及 SQL CAST 行为一致性。

#### 3.2 Flight SQL ODBC 在 macOS 可用性上继续推进
- **MacOS ODBC 测试修复已关闭**
  - Issue: #49268  
  - PR: #49267  
  - 链接: `apache/arrow Issue #49268` / `apache/arrow PR #49267`
  - 进展：Mock Server 初始化与测试连接逻辑已调整，以支持 Windows / macOS。
  - 意义：这是 Arrow Flight SQL ODBC 驱动迈向跨平台可用的重要一步，有助于 Arrow 作为**分析数据库/SQL 引擎互联层**的生态扩张。

- **Flight SQL ODBC 主线 PR 仍在持续演进**
  - PR: #46099  
  - 链接: `apache/arrow PR #46099`
  - 观察：Windows 已较成熟，macOS/Linux 仍在 WIP；今天又有新 Issue 提出 macOS `.pkg` 安装器需求，说明该方向已进入“从能跑到能交付”的阶段。

#### 3.3 Python 文档与开发体验改进
- **CUDA 缺失导致 doctest 失败问题已关闭**
  - Issue: #49506  
  - PR: #49507  
  - 链接: `apache/arrow Issue #49506` / `apache/arrow PR #49507`
  - 进展：CI 中对 CUDA doctest 进行跳过处理，降低误报失败。
  - 意义：提升 Python CI 稳定性，减少非功能性失败对开发效率的干扰。

- **stubfiles docstring 注入恢复已关闭**
  - Issue: #49452  
  - PR: #49453  
  - 链接: `apache/arrow Issue #49452` / `apache/arrow PR #49453`
  - 意义：有助于 `pyarrow` 类型提示与 IDE 体验，反映 Python 用户群对“可维护 API 文档 + 类型系统”的持续需求。

#### 3.4 Parquet 底层解码/格式能力继续演进
- **RLE BitPacked parser PR 已关闭**
  - PR: #47294  
  - 链接: `apache/arrow PR #47294`
  - 方向：引入更独立的 bit-packed / RLE 解码抽象。
  - 意义：这类基础解码器工作通常与 **Parquet 读取性能、编码兼容性、后续向量化优化**相关，虽非当日热点，但对存储引擎底座重要。

---

## 4. 社区热点

### 4.1 Flight SQL ODBC macOS 安装器
- Issue: #47876  
- 链接: `apache/arrow Issue #47876`

这是今天较受关注的活跃议题之一（5 条评论）。核心诉求不是“驱动功能能否工作”，而是**macOS 上如何以标准 `.pkg` 方式可安装、可发现、可注册**。  
这表明 Flight SQL ODBC 已开始从研发验证阶段走向实际分发与终端部署阶段。对 OLAP / BI 连接场景而言，驱动安装体验往往直接决定用户是否能接入 Tableau、Power BI、Excel 或自研 BI 工具。

### 4.2 Gandiva 函数质量专项修复
- Issue: #49420  
- Issue: #49438  
- PR: #49421  
- PR: #49439  
- 链接: `apache/arrow Issue #49420` / `apache/arrow Issue #49438` / `apache/arrow PR #49421` / `apache/arrow PR #49439`

虽然评论数不算最高，但连续几个问题集中在 Gandiva 字符串函数与 cast 逻辑，显示社区正在针对**表达式执行器中的 C++ 低层函数做系统性扫雷**。  
这类改进对 SQL 兼容层尤其关键，因为许多上层引擎将 Arrow / Gandiva 作为表达式下推或中间层，边界值错误会直接表现为查询结果错误或崩溃。

### 4.3 文档构建告警与 Python 文档质量
- Issue: #49509  
- PR: #49510  
- 链接: `apache/arrow Issue #49509` / `apache/arrow PR #49510`

该议题当日即有对应 PR，反映维护者对 **Sphinx 构建告警、docutils 错误、开发者文档质量** 的敏感度较高。  
对大型多语言项目而言，文档系统问题往往会放大 API 迁移成本，尤其 Arrow 同时面向 C++ / Python / R / Flight 用户群。

### 4.4 vcpkg 多配置生成器链接错误
- Issue: #49499  
- 链接: `apache/arrow Issue #49499`

该问题聚焦 Windows + vcpkg + multi-config generator 下，Release 配置错误链接 debug Snappy/Brotli 库。  
背后的技术诉求是：Arrow 作为 C++ 基础设施库，必须在**复杂企业级构建矩阵**下保持可复用性，否则会显著增加集成门槛。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：潜在崩溃 / 内存安全问题

#### 5.1 Gandiva 极值参数导致崩溃
- PR: #49471  
- 链接: `apache/arrow PR #49471`

`substring_index(VARCHAR, VARCHAR, INT)` 在 `INT_MIN` 下可触发 SIGBUS，`truncate(BIGINT, INT)` 在 `INT_MAX/INT_MIN` 下可触发 SIGSEGV。  
这是今天**最值得关注的未关闭稳定性风险**，因为它属于明确的崩溃问题，且触发条件虽然偏边界，但在 fuzzing、恶意输入或异常 SQL 参数下完全可能出现。  
状态：**已有 fix PR，待 committer review**。

#### 5.2 LPAD/RPAD 可能越界写
- Issue: #49438  
- PR: #49439  
- 链接: `apache/arrow Issue #49438` / `apache/arrow PR #49439`

已关闭，说明该内存安全问题已被处理。  
这类问题若存在于向量化表达式路径，影响面通常大于单次函数调用错误。

---

### P2：查询正确性 / 时间语义错误

#### 5.3 pre-epoch 时间戳字符串化错误
- Issue: #49454  
- PR: #49455  
- 链接: `apache/arrow Issue #49454` / `apache/arrow PR #49455`

已关闭。影响历史日期数据的格式化结果，属于**结果正确性缺陷**。

#### 5.4 `Table.join_asof` doctest 间歇失败
- Issue: #49511  
- 链接: `apache/arrow Issue #49511`

这是今日新开的 Python/C++ 交叉问题。当前表现为 doctest 偶发失败，但根因可能涉及 `join_asof` 的结果稳定性、测试时序或文档示例假设不稳固。  
如果最终被证明是算子非确定性或边界比较问题，其严重程度会进一步上升。  
状态：**尚未看到对应 fix PR**。

---

### P3：CI / 构建 / 打包稳定性问题

#### 5.5 `pyarrow._cuda` 缺失导致 doctest 失败
- Issue: #49506  
- PR: #49507  
- 链接: `apache/arrow Issue #49506` / `apache/arrow PR #49507`

已关闭，属于 CI 噪声清理，但对开发效率很关键。

#### 5.6 Windows + vcpkg Release 链接到 debug Snappy/Brotli
- Issue: #49499  
- 链接: `apache/arrow Issue #49499`

这是典型**集成环境稳定性**问题，影响下游项目在 Visual Studio / multi-config 场景下的可构建性。  
状态：**尚无对应 PR**。

#### 5.7 Windows MinGW `arrow-json-test` 间歇性 segfault
- PR: #49462  
- 链接: `apache/arrow PR #49462`

已有修复 PR，待 review。该问题虽主要发生在 CI，但涉及真实段错误，不应仅视为“测试波动”。

---

## 6. 功能请求与路线图信号

### 6.1 Flight SQL ODBC 正向“产品化交付”迈进
- Issue: #47876  
- PR: #46099  
- 链接: `apache/arrow Issue #47876` / `apache/arrow PR #46099`

新增的 macOS `.pkg` 安装器需求，与既有 ODBC 主线 PR 和 macOS 测试修复形成呼应。  
这说明下一阶段 Flight SQL 不再只是协议/驱动内核开发，而是开始补齐：
- 跨平台安装与分发
- 驱动注册
- 终端用户接入体验
- BI / SQL 工具兼容

**纳入下一版本概率：高。**  
因为已有主线 PR 与测试修复，新增需求更像交付层补完。

### 6.2 `DictionaryArray` 支持 `pa.large_string` / `pa.large_binary`
- Issue: #49505  
- 链接: `apache/arrow Issue #49505`

这是今天较典型的功能请求，反映 Python 用户期望字典编码能力覆盖更大字符串/二进制类型。  
对分析型场景而言，大字段字典编码虽然不像普通 string 常见，但在日志、半结构化文本维表、长枚举值压缩上很实用。

**纳入下一版本概率：中等。**  
目前还没有对应 PR，但问题描述明确、实现边界清晰，属于可落地的小中型增强。

### 6.3 Parquet 加密 Bloom Filter 读取支持
- PR: #49334  
- 链接: `apache/arrow PR #49334`

该 PR 支持读取**加密 Parquet 文件中的 Bloom filter**，属于高价值存储能力增强。  
对数据湖和企业安全场景非常关键，尤其是在加密列和 selective scan 并存时。

**纳入下一版本概率：较高。**  
因为功能完整、测试明确，且面向 Parquet 高级特性。

### 6.4 Parquet 按字节限制 Row Group 大小
- PR: #48468  
- 链接: `apache/arrow PR #48468`

新增 `max_row_group_bytes` 配置，属于写入侧的重要调优能力。  
这对 OLAP 存储布局、扫描并行度、对象存储上传粒度、压缩比平衡都很重要。

**纳入下一版本概率：中高。**  
一旦合并，将对下游写入器、湖仓入库任务、批式导出任务产生直接收益。

### 6.5 依赖栈升级：Abseil / Protobuf / gRPC / google-cloud-cpp
- PR: #48964  
- 链接: `apache/arrow PR #48964`

这是潜在影响较大的基础设施更新，且 PR 明确标注可能含**公共 API breaking changes**。  
它是明显的路线图信号：Arrow 在为更现代的 RPC / cloud / protobuf 依赖生态做准备。

**纳入下一版本概率：不确定，但影响极大。**  
若合并，预计会伴随迁移说明。

---

## 7. 用户反馈摘要

### 7.1 安装与分发仍是 Flight SQL 落地关键痛点
- 相关: #47876, #49268, #46099  
- 链接: `apache/arrow Issue #47876` / `apache/arrow Issue #49268` / `apache/arrow PR #46099`

用户不再只关心“能不能编译通过”，而是关注：
- macOS 下驱动应安装到什么标准路径
- ODBC 配置脚本的执行顺序
- 测试是否能在目标平台稳定运行

这说明 Arrow Flight SQL 正逐步进入真实消费场景，而安装摩擦是当前主要阻碍之一。

### 7.2 企业 Windows 构建环境兼容性要求很高
- 相关: #49499  
- 链接: `apache/arrow Issue #49499`

用户在 vcpkg + Visual Studio 多配置环境中遇到 debug/release 库混链问题，体现 Arrow 在企业 C++ 工程中的典型使用模式：  
**不是单独编译 Arrow，而是把 Arrow 嵌入更复杂的构建系统。**  
这类反馈的优先级通常高于普通“本地编译失败”，因为会影响批量工程复用。

### 7.3 Python 用户越来越关注类型系统和文档质量
- 相关: #49452, #49509, #48622  
- 链接: `apache/arrow Issue #49452` / `apache/arrow Issue #49509` / `apache/arrow PR #48622`

从 stubfile docstring、类型注解、Sphinx 告警修复等议题可见，`pyarrow` 正从“功能可用”走向“开发体验成熟”。  
这类反馈通常来自更大规模的应用集成场景，如静态检查、IDE 自动补全、API 文档生成、团队协作开发。

### 7.4 查询与表达式边界值正确性仍是底层信任基础
- 相关: #49420, #49438, #49454, #49471  
- 链接: `apache/arrow Issue #49420` / `apache/arrow Issue #49438` / `apache/arrow Issue #49454` / `apache/arrow PR #49471`

用户持续提交极值、负值、pre-epoch 时间等边界案例，说明 Arrow/Gandiva 已被用于更严格的数据处理场景。  
这类反馈是积极信号：说明社区正在帮助项目补齐“数据库级正确性”要求。

---

## 8. 待处理积压

以下议题虽非今日新开，但值得维护者关注：

### 8.1 Flight 认证方式文档缺失
- Issue: #31087  
- 链接: `apache/arrow Issue #31087`

这是一个长期存在的文档缺口。随着 Flight/Flight SQL 使用扩大，认证机制说明不足会直接提高接入成本。  
建议优先级提升，至少产出一份认证方式总览文档。

### 8.2 Flight 生成的 protobuf 头文件未归档到 `src/generated`
- Issue: #31083  
- 链接: `apache/arrow Issue #31083`

这是构建系统整洁性与可维护性问题，长期未解决可能继续增加打包与源码组织复杂度。

### 8.3 C++ 哈希表 merge 错误处理仍待增强
- Issue: #32381  
- 链接: `apache/arrow Issue #32381`

虽然是 good-first-issue，但它涉及底层容器操作的错误传播语义，不应长期停留在 warning 级别。

### 8.4 Substrait 相关能力长期停滞
- Issues: #31080, #20109, #20108  
- 链接: `apache/arrow Issue #31080` / `apache/arrow Issue #20109` / `apache/arrow Issue #20108`

包括：
- 不同 timestamp resolution 的扩展类型表达
- Substrait 扩展类型的 compute 支持
- nullability 语义对齐

这些问题对 Arrow 作为**跨引擎中间表示与执行桥梁**非常重要，但目前仍显著积压。

### 8.5 Python 时区 timestamp 类型别名
- Issue: #31072  
- 链接: `apache/arrow Issue #31072`

虽是小功能，但有 1 个 👍，且直击易用性问题。  
对 CSV/Schema 推断用户而言，时区 timestamp 的声明方式仍不够直观。

### 8.6 R 文档一致性 CI 机制
- Issue: #31077  
- PR: #49381  
- 链接: `apache/arrow Issue #31077` / `apache/arrow PR #49381`

R 生态的文档和 devdocs 构建问题今天有实质推进，但主问题仍未完全闭环。建议跟踪 PR 合并进度，避免继续在 release 节奏切换时出现 CI 假失败。

---

## 总体判断

Apache Arrow 今日状态可概括为：**活跃、稳健、以修复和工程完善为主的一天**。  
短期重点集中在：
1. **Gandiva 函数正确性与崩溃修复**  
2. **Flight SQL ODBC 的跨平台落地与安装分发**  
3. **Python 文档/类型系统质量提升**  
4. **Parquet 高级能力（加密 Bloom filter、row group 控制）推进**

风险点则主要在：
- Gandiva 仍有未合并的极值崩溃修复
- `join_asof` 间歇失败尚未定位清楚
- Windows/vcpkg 多配置构建兼容性仍待修复
- Substrait / Flight 文档等中长期议题积压明显

整体来看，项目健康度**中上且稳定向好**，但需要继续把近期活跃的底层修复转化为系统性测试覆盖，避免分析引擎场景中的边界值问题反复出现。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*