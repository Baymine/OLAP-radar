# Apache Doris 生态日报 2026-04-05

> Issues: 2 | PRs: 29 | 覆盖项目: 10 个 | 生成时间: 2026-04-05 01:44 UTC

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

# Apache Doris 项目动态日报 - 2026-04-05

## 1. 今日速览

过去 24 小时内，Apache Doris 社区保持了较高活跃度：**Issues 更新 2 条，PR 更新 29 条**，其中 **17 条仍在待合并，12 条已合并或关闭**。  
当天**没有新版本发布**，但从 PR 内容看，开发重心集中在 **查询正确性修复、执行引擎可观测性增强、内存优化、云与多 Catalog 能力演进**。  
从变更结构来看，今天的工作以 **稳定性和工程质量提升** 为主，尤其是扫描谓词保留、JDBC TVF 别名兼容、并发哈希表死锁风险修复等，说明项目正在为后续版本持续打磨可用性。  
同时，新报 Issue 涉及 **大 JSON Variant 插入性能退化** 和 **HTTP StreamLoad + GroupCommit 潜在内存泄漏**，表明 Doris 在高吞吐写入与复杂半结构化数据场景下仍有较强的用户关注和优化需求。  

---

## 2. 项目进展

### 2.1 今日已合并/关闭的重点 PR

#### 1) 修复 OLAP Scan 中 `IN_LIST` runtime filter 谓词被错误丢弃的问题
- PR: #62027 `[Bug](scan) Preserve IN_LIST runtime filter predicates when key range is a scope range`
- 状态: 已关闭/已进入分支
- 链接: `apache/doris PR #62027`

该修复针对扫描算子中的一个**查询正确性与过滤下推稳定性问题**：当 `MINMAX` 与 `IN` runtime filter 同时作用于同一 key 列，且 `IN` 值数量超过 pushdown 上限时，`IN_LIST` 谓词可能被错误擦除。  
这类问题会直接影响：
- 谓词下推效果；
- 扫描裁剪精度；
- 极端情况下的结果正确性与执行性能。  

其后续分支 PR：
- #62115 `apache/doris PR #62115`
- #62114 `apache/doris PR #62114`

说明该修复正在向更多分支同步，属于**值得关注的稳定性修补**。

---

#### 2) 修复 JDBC Catalog 中 `query()` TVF 列别名丢失问题
- 主 PR: #61939 `[fix](jdbc) Preserve query tvf column aliases across JDBC catalogs`
- 状态: 已关闭
- 链接: `apache/doris PR #61939`

分支回补：
- #62123 `branch-4.0`
- #62124 `branch-4.1`

这一修复提升了 Doris 在 **JDBC 外表/联邦查询场景** 下的 SQL 兼容性。问题根源是 `query()` 将 SQL 直接透传给 JDBC Catalog 后，返回列名未能正确保留用户在 SQL 中定义的 alias。  
修复后带来的价值：
- 提升跨数据源查询语义一致性；
- 避免 BI/ETL 工具依赖别名时出现列映射异常；
- 改善 Doris 作为统一查询层时的用户体验。  

这是一个典型的**SQL 兼容性与生态集成能力增强**信号。

---

### 2.2 今日推进中的重点 PR

#### 3) SEARCH() 查询路径补充倒排索引指标采集
- PR: #62121 `[fix](profile) populate inverted index metrics for SEARCH() query path`
- 状态: Open
- 链接: `apache/doris PR #62121`

该 PR 解决 `SEARCH()` 走 `query_v2` 路径时绕过 `InvertedIndexReader::query()`，导致 profile 中倒排索引指标始终为 0 的问题。  
这不会直接改变结果正确性，但会显著影响：
- 搜索查询性能诊断；
- 倒排索引命中分析；
- 线上问题排查效率。  

这属于**可观测性建设**，对搜索分析场景非常重要。

---

#### 4) FE 并发哈希表死锁风险修复
- PR: #62117 `[fix](fe) Fix deadlock risks in ConcurrentLong2*HashMap`
- 状态: Open，reviewed
- 链接: `apache/doris PR #62117`

PR 通过将 `forEach` 从“读锁内回调”改为“快照后锁外回调”，规避潜在死锁。  
这类问题往往不高频，但一旦触发会影响：
- FE 元数据处理稳定性；
- 高并发场景下的管理面可用性；
- 某些回调链路中的线程阻塞风险。  

属于**中高优先级基础稳定性修复**。

---

#### 5) 内存优化：减少 Replica/CloudReplica 对象开销
- PR: #62122 `[opt](memory) Move schemaHash from Replica to LocalReplica`
- PR: #62084 `[opt](memory) Pack stats fields into single long in CloudReplica`
- 状态: Open
- 链接:
  - `apache/doris PR #62122`
  - `apache/doris PR #62084`

这两项优化都聚焦在**对象级内存压缩**：
- 将 `schemaHash` 从基类 `Replica` 下沉到 `LocalReplica`，为 `CloudReplica` 节省 4 字节；
- 将多个统计字段打包进单个 long，进一步降低实例内存占用。  

对单对象收益不大，但在 Doris 大规模 tablet / replica 元数据场景下，累计效果可观，说明社区正持续优化**云原生与大规模部署下的 FE 内存效率**。

---

#### 6) CBO/优化器能力继续增强
- PR: #60601 `[Enhancement](optimizer) Support multi-mode CBO CTE inline strategy`
- 状态: Open，reviewed
- 链接: `apache/doris PR #60601`

该 PR 将原先“开/关式”的 CTE inline 策略升级为多模式控制。  
潜在收益：
- 减少不必要的 CBO 比较开销；
- 在复杂 SQL 中实现更细粒度的优化策略；
- 为后续优化器参数化和成本控制打基础。  

这是明显的**查询优化器路线演进信号**。

---

#### 7) 云模式 file cache 细粒度控制
- PR: #62119 `[Enhancement](file-cache) Add fine-grained control for compaction file cache`
- 状态: Open
- 链接: `apache/doris PR #62119`

该变更为 cloud mode 下 compaction 输出文件缓存提供更细粒度控制，可选择仅缓存 index 文件。  
意义在于：
- 降低 compaction 期间缓存污染；
- 提升冷热数据场景下缓存利用率；
- 更好适应对象存储与云盘混合环境。  

属于**云存储/冷热分层优化**的重要方向。

---

#### 8) 本地开发体验增强：单容器 FE+BE Dockerfile
- PR: #62120 `[feature](build) Add local-dev single-container FE+BE Dockerfile`
- 状态: Open
- 链接: `apache/doris PR #62120`

面向开发者与测试环境，允许在单容器内运行 FE + BE。  
预期价值：
- 简化本地开发与调试；
- 便利 Testcontainers 集成测试；
- 降低新人参与门槛。  

这是**工程效率和生态友好度**提升，不直接影响线上能力，但有助于社区健康。

---

## 3. 社区热点

### 热点 1：大 JSON Variant 插入性能退化
- Issue: #56700 `[Bug] Apache Doris 3.1.1 poor performance in insert on large json variant`
- 链接: `apache/doris Issue #56700`

这是今天最值得关注的用户问题之一。用户明确对比了 **3.1.1 vs 3.0.8**，在相同 JDBC batch insert、相同数据条件下，3.1.1 在大 JSON Variant 写入场景中表现更差。  
背后的技术诉求非常明确：
- 半结构化数据写入性能不能随版本升级退化；
- Variant/JSON 路径解析、编码、写放大与内存管理需要持续优化；
- 企业用户在数据湖、日志、事件分析场景中对这类能力非常敏感。  

这类问题如被复现，可能影响 Doris 在**半结构化分析**方向的口碑。

---

### 热点 2：HTTP StreamLoad + GroupCommit 可能导致内存泄漏
- Issue: #62118 `[Bug] HTTP StreamLoad with GroupCommit in 4.0.3 may cause memory leak`
- 链接: `apache/doris Issue #62118`

该问题出现在 **4.0.3-rc03**，且 Cloud Mode 与非 Cloud Mode 都受影响。  
背后的技术诉求是：
- 实时导入链路必须具备稳定内存行为；
- GroupCommit 作为高吞吐导入优化机制，不能以长期内存增长为代价；
- 用户对导入服务的长期运行稳定性高度敏感。  

如果后续确认属实，这会是**高优先级稳定性问题**。

---

### 热点 3：搜索分析路径的 profile 可观测性
- PR: #62121 `[fix](profile) populate inverted index metrics for SEARCH() query path`
- 链接: `apache/doris PR #62121`

虽然评论数据未给出，但从技术影响看，它代表社区正关注：
- 向量/全文检索类能力的 profile 完整性；
- SEARCH() 与倒排索引诊断能力；
- 新查询路径与传统指标体系的统一。  

这说明 Doris 在**搜索分析融合能力**上的运维工具链仍在补强阶段。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1 高优先级

#### 1) HTTP StreamLoad + GroupCommit 潜在内存泄漏
- Issue: #62118
- 链接: `apache/doris Issue #62118`
- 影响版本: `4.0.3-rc03`
- 影响范围: Cloud / 非 Cloud 均可能受影响
- 现状: **尚未看到对应 fix PR**

风险点：
- 长时间导入任务导致内存持续增长；
- 可能影响 BE 稳定性与导入服务可用性；
- 若属回归问题，需在 RC 阶段尽快阻断。

---

#### 2) 大 JSON Variant 插入性能下降
- Issue: #56700
- 链接: `apache/doris Issue #56700`
- 影响版本: 3.1.1 对比 3.0.8
- 现状: **暂无明确 fix PR**

风险点：
- 半结构化写入性能回退；
- 批量导入吞吐降低；
- 升级意愿受影响。  

若能定位到 Variant 编码/解析链路变更，将可能触发后续性能专项修复。

---

### P2 中优先级

#### 3) FE 并发哈希表死锁风险
- PR: #62117
- 链接: `apache/doris PR #62117`
- 现状: **已有 fix PR，待合并**

虽然尚未看到公开 issue，但从 PR 描述判断，这是典型“低频高危”问题。建议尽快进入稳定分支评估。

---

#### 4) SEARCH() 查询路径 profile 指标缺失
- PR: #62121
- 链接: `apache/doris PR #62121`
- 现状: **已有 fix PR，待合并**

不影响结果，但影响性能排障与可观测性，特别是在倒排索引/检索场景中价值较高。

---

#### 5) TVF 返回因 thrift message 过大而失败
- PR: #61788 `[fix](tvf) fix tvf return error since thrift message too large to reach limit`
- 链接: `apache/doris PR #61788`
- 现状: **已有修复 PR，approved/reviewed，待合并**

说明某些 TVF 返回链路在大结果集或复杂 schema 下仍存在协议消息大小瓶颈，需要继续关注是否会成为用户高频痛点。

---

#### 6) window funnel v2 在 deduplication / fixed mode 下结果错误
- PR: #62043 `[Bug](function) fix wrong result of window funnel v2 + deduplication/fixed mode`
- 链接: `apache/doris PR #62043`
- 现状: **已有修复 PR，待合并**

这是一个**查询正确性问题**，影响行为分析、漏斗分析类 SQL。若相关功能在 4.1.x 中被广泛使用，应考虑加快合并与回补。

---

## 5. 功能请求与路线图信号

虽然今天没有明确新增的“功能需求型 Issue”，但从活跃 PR 能看出数条明显路线图信号：

### 1) 多 Catalog / Data Lake 读取架构持续重构
- PR: #61783 `[refactoring](multi-catalog)data_lake_reader_refactoring.`
- 链接: `apache/doris PR #61783`

这是偏底层重构，通常意味着 Doris 正继续强化：
- 多 Catalog 统一读取层；
- 外部数据源访问抽象；
- 湖仓场景查询能力。  

这类工作短期不一定直观可见，但往往是后续连接器与 lakehouse 能力扩展的前置条件。

---

### 2) 优化器参数化与复杂 SQL 控制能力增强
- PR: #60601
- 链接: `apache/doris PR #60601`

多模式 CBO CTE inline 策略显示 Doris 正从“单一开关”走向“细粒度优化策略”，这通常预示：
- 更复杂的查询治理参数；
- 更成熟的成本控制；
- 更强的企业级工作负载适配能力。  

较有可能进入下一阶段版本演进主线。

---

### 3) 云模式缓存/Compaction 精细化控制
- PR: #62119
- 链接: `apache/doris PR #62119`

从产品方向看，这反映 Doris 在 cloud mode 下不仅关注功能可用，还开始深入优化：
- compaction IO 行为；
- cache 污染控制；
- 对象存储成本与性能平衡。  

该方向很可能继续被纳入后续版本。

---

### 4) 开发与测试体验产品化
- PR: #62120
- 链接: `apache/doris PR #62120`

单容器 FE+BE 本地模式对：
- CI 测试；
- 集成测试；
- 社区 onboarding  
都有现实价值。  

虽非核心 OLAP 功能，但很可能较快合入，因为工程收益明确、风险相对低。

---

## 6. 用户反馈摘要

结合今日 Issues，可提炼出几类真实用户痛点：

### 1) 升级后性能不能退化
- 相关 Issue: #56700
- 链接: `apache/doris Issue #56700`

用户直接对比 3.1.1 与 3.0.8，说明生产用户对 Doris 版本升级的核心诉求不是“新特性更多”，而是：
- 原有 workload 性能不下降；
- JDBC 批量导入行为稳定；
- 大 JSON / Variant 数据写入吞吐可预期。  

这反映 Doris 在半结构化场景中已进入真实负载验证阶段。

---

### 2) 导入链路长期稳定性非常关键
- 相关 Issue: #62118
- 链接: `apache/doris Issue #62118`

StreamLoad + GroupCommit 这类组合通常出现在：
- 实时数仓；
- 日志/事件数据摄入；
- 高频小批量导入。  

用户最关心的不是一次导入成功，而是**持续运行数小时/数天后是否会出现内存膨胀、吞吐下降、服务不稳定**。

---

### 3) 联邦查询/异构连接器的 SQL 一致性要求更高
- 相关 PR: #61939
- 链接: `apache/doris PR #61939`

列别名保留问题看似细节，实则说明用户已将 Doris 用作：
- 统一 SQL 入口；
- 外部 JDBC 数据源查询代理；
- BI/中台查询层。  

此时 SQL 语义细节会直接影响上层应用兼容性。

---

## 7. 待处理积压

以下是今日更新中值得维护者重点关注的长期未决项：

### 1) 多 Catalog Data Lake Reader 重构仍未落地
- PR: #61783
- 创建: 2026-03-26
- 状态: Open
- 链接: `apache/doris PR #61783`

属于底层重构型 PR，影响面可能较大。建议维护者明确：
- 重构边界；
- 回归测试范围；
- 与现有多 Catalog / 湖仓链路的兼容性风险。

---

### 2) HTTP API 管理操作认证框架修复跨度较长
- PR: #60761 `[fix](auth) Fix HTTP API authentication framework for admin operations`
- 创建: 2026-02-14
- 状态: Open
- 链接: `apache/doris PR #60761`

这是一个**安全与权限模型**相关的重要 PR，且覆盖 FE/BE 多端。  
建议尽快推进结论，因为它关系到：
- 管理 API 的权限边界；
- 公共 API / 用户 API / 管理 API 的行为一致性；
- 潜在的误授权风险。

---

### 3) 优化器 CTE inline 多模式策略长期待定
- PR: #60601
- 创建: 2026-02-09
- 状态: Open
- 链接: `apache/doris PR #60601`

此类优化器变更通常需要更多 benchmark 与回归验证。  
建议关注：
- 是否已有典型 workload 数据支撑；
- 默认模式如何选取；
- 是否会引入 plan 波动。

---

### 4) TVF thrift message 过大问题修复尚未合并
- PR: #61788
- 创建: 2026-03-27
- 状态: Open，approved/reviewed
- 链接: `apache/doris PR #61788`

既然已通过审批，说明技术方向较清晰，若长期不合并，可能拖慢相关用户问题解决节奏。

---

### 5) 大 JSON Variant 性能问题需要尽快分类处理
- Issue: #56700
- 状态: Open / Stale
- 链接: `apache/doris Issue #56700`

尽管被打上了 `Stale`，但这是**真实业务场景中的性能回归信号**，不应仅按活跃度处理。建议维护者：
- 要求用户补充 profile、batch size、JSON 平均大小、Variant schema 结构；
- 尝试建立可复现 benchmark；
- 判断是否属于 3.1.x 回归。

---

## 8. 健康度结论

今天的 Apache Doris 项目整体呈现出**高活跃、偏稳定性修复驱动、兼顾云与联邦能力演进**的状态。  
积极信号包括：
- 查询正确性问题在持续修补；
- JDBC/TVF/SEARCH 等外围能力的可用性不断提升；
- FE 内存与并发安全优化在推进。  

风险信号主要集中在：
- 高吞吐导入链路的内存泄漏疑虑；
- 半结构化数据写入性能回归；
- 一些关键 PR 长期待定。  

综合判断，项目健康度仍然较好，但建议维护者近期优先关注 **导入稳定性、半结构化性能、以及已 reviewed 的关键修复尽快落地**。

---

## 横向引擎对比

以下是基于 **2026-04-05** 各项目社区动态整理的横向对比分析报告。

---

# OLAP / 分析型存储引擎开源生态横向对比报告
**日期：2026-04-05**

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储开源生态整体呈现出一个很明确的特征：**活跃度高，但工作重心普遍不在“发版”，而在“稳定性收敛、兼容性修补、云湖一体与半结构化能力增强”**。  
从社区信号看，**查询正确性、导入链路稳定性、对象存储/S3 适配、可观测性、复杂类型（Variant/JSON/Arrow/Parquet）互操作**，已经成为多项目共同关注的重点。  
头部项目中，ClickHouse 维持最高强度的工程活跃；Doris、DuckDB、Iceberg、StarRocks 则分别在 **执行引擎稳定性、联邦/湖仓能力、复杂类型支持、权限与生态兼容** 上持续推进。  
整体上，生态已从“比拼单点性能”进入“比拼生产可用性、跨生态兼容、运维可控性和复杂数据场景覆盖”的阶段。

---

## 2. 各项目活跃度对比

> 说明：以下数据基于题述日报；个别项目未明确给出“今日新增”而是“更新数”，按日报口径统计。

| 项目 | Issues 更新数 | PR 更新数 | Release | 今日总体判断 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 2 | 29 | 无 | 高活跃，偏稳定性修复与云/联邦增强 | **较好** |
| **ClickHouse** | 21 | 102 | 无 | 极高活跃，CI/存储/S3/稳定性并进 | **良好但风险暴露多** |
| **DuckDB** | 11 | 20 | 无 | 高活跃，1.5.1 回归修复和 Arrow/Parquet 互操作集中收敛 | **较好** |
| **StarRocks** | 7 | 18 | 无 | 中高活跃，兼容性修复、权限与外部 Catalog 问题突出 | **稳定向好** |
| **Apache Iceberg** | 8 | 19 | 无 | 中高活跃，AWS/Glue、Flink/Spark、Variant、REST 持续演进 | **良好** |
| **Delta Lake** | 0 | 10 | 无 | 中等偏上，Kernel/DSv2/Sharing/Variant 路线清晰 | **稳定** |
| **Databend** | 0 | 7 | 无 | 中等偏上，SQL 语义修补与版本化表能力并行 | **良好** |
| **Velox** | 1 | 15 | 无 | 中等偏高，CI、兼容性修复和 Iceberg V3 大功能推进 | **良好** |
| **Apache Gluten** | 6 | 3 | 无 | 中等活跃，围绕 Velox Table Scan 内存问题集中治理 | **稳中有压** |
| **Apache Arrow** | 17 | 10 | 无 | 中等偏活跃，基础库正确性、R/Python 生态和 CI 为主 | **稳定** |

### 简要观察
- **最高活跃度梯队**：ClickHouse、Doris  
- **高活跃且方向明确**：DuckDB、Iceberg、StarRocks  
- **中活跃但路线信号清晰**：Delta Lake、Databend、Velox  
- **基础设施/组件型项目**：Arrow、Gluten，更多体现为底层能力治理

---

## 3. Apache Doris 在生态中的定位

### 3.1 相对优势

与同类项目相比，**Apache Doris 的优势在于“统一分析引擎”定位较平衡**，既覆盖：
- 高性能 MPP OLAP；
- 实时导入与近实时分析；
- 多 Catalog / JDBC / Lakehouse 联邦访问；
- 搜索分析融合（如 SEARCH / 倒排索引路径）；
- 云模式与对象存储演进。

从今日动态看，Doris 的开发重心尤其集中在：
- **查询正确性修补**：runtime filter、window funnel、TVF 等；
- **联邦兼容性**：JDBC Catalog alias 保留；
- **可观测性增强**：SEARCH 倒排索引 profile；
- **云与大规模部署优化**：CloudReplica 内存压缩、file cache 精细化控制。

这说明 Doris 的定位不是单纯追求“最快单机/单场景 SQL”，而是在向 **企业级统一分析平台** 演进。

### 3.2 技术路线差异

相对其他项目，Doris 的技术路线更接近：
- **StarRocks**：实时 OLAP + 云湖一体 + 外部 Catalog；
- **ClickHouse**：高性能分析引擎，但 Doris 在联邦查询、Catalog 抽象、统一查询层上信号更强；
- **DuckDB**：与 Doris 不同，DuckDB 更偏嵌入式/本地分析执行；
- **Iceberg / Delta / Arrow**：这些更多是表格式、协议或底层数据交换层，不是 Doris 的直接“引擎型”同类。

### 3.3 社区规模对比

按今日活跃度粗看：
- Doris 明显低于 ClickHouse 的超大体量社区；
- 与 DuckDB、Iceberg、StarRocks 处于可比的核心活跃层级；
- 比 Delta Lake、Databend、Velox、Gluten 的“单日显性活跃”更强。

**结论**：Doris 已处于开源 OLAP 生态的第一梯队之一，但在社区绝对规模和问题暴露/处理吞吐上，仍略逊于 ClickHouse 这种超高活跃项目。

---

## 4. 共同关注的技术方向

以下是多项目共同涌现的需求与信号。

### 4.1 半结构化 / Variant / JSON / 复杂类型支持增强
**涉及项目**：Doris、DuckDB、Iceberg、Delta Lake、ClickHouse、Arrow  
**具体诉求**：
- Doris：大 JSON Variant 插入性能退化需修复；
- DuckDB：VARIANT 写 Parquet、Arrow union 映射问题；
- Iceberg：Spark/Kafka Connect 持续补齐 VARIANT；
- Delta Lake：Variant + Sharing、variant shredding；
- ClickHouse：文本索引、向量索引、复杂格式兼容；
- Arrow：复杂类型跨语言互操作与 IPC/CSV/编码问题。

**结论**：半结构化能力已不是附属特性，而是 OLAP 主战场之一。

---

### 4.2 云对象存储 / S3 / 外部数据湖路径稳定性
**涉及项目**：ClickHouse、Doris、StarRocks、Iceberg、Arrow  
**具体诉求**：
- ClickHouse：S3 client 生命周期、cached disk、hive partitioning、Parquet 读取错误；
- Doris：cloud mode file cache 精细化；
- StarRocks：Iceberg 外部 Catalog 权限一致性、ORC 元数据正确性；
- Iceberg：Glue/AWS 提交一致性；
- Arrow：R Azure Blob filesystem。

**结论**：对象存储与湖仓接入已经从“外围能力”变成“核心生产路径”。

---

### 4.3 查询正确性与 SQL 兼容性修补
**涉及项目**：Doris、DuckDB、Databend、Velox、Delta Lake、StarRocks  
**具体诉求**：
- Doris：runtime filter、window funnel、JDBC TVF alias；
- DuckDB：binder 回归、Unicode 排序错误、JOIN/CTE 正确性；
- Databend：LIKE ESCAPE、GROUPING()、DDL 幂等；
- Velox：collect_set、array_sort comparator 类型兼容；
- Delta Lake：decimal coercion；
- StarRocks：带点号列名统计、外部 Catalog GRANT。

**结论**：社区当前非常重视“边界语义正确性”，说明用户使用深度已进入复杂生产 SQL 阶段。

---

### 4.4 可观测性、CI 与工程质量建设
**涉及项目**：ClickHouse、Doris、Velox、Arrow、StarRocks  
**具体诉求**：
- ClickHouse：CI core dump、flaky test 治理；
- Doris：SEARCH 路径 profile 指标补齐；
- Velox：CI 失败报告、workflow 文档化；
- Arrow：CRAN 检查前置、日志与错误处理问题；
- StarRocks：Prometheus Data Cache 指标诉求。

**结论**：工程成熟度竞争正在加剧，项目不再只比功能，也比“可维护、可诊断、可协作”。

---

### 4.5 内存管理、OOM 与长期运行稳定性
**涉及项目**：Doris、ClickHouse、DuckDB、Gluten、Arrow  
**具体诉求**：
- Doris：StreamLoad + GroupCommit 潜在内存泄漏；
- ClickHouse：OOM Canary、system log flush 内存问题；
- DuckDB：fixed-size arrays + ON CONFLICT 内存占用；
- Gluten：table scan 预取导致 OOM；
- Arrow：memory map close 后内存行为不透明。

**结论**：OLAP 系统正在普遍面临“高吞吐/长运行场景下的内存可解释性”挑战。

---

## 5. 差异化定位分析

## 5.1 存储格式与数据层定位

| 项目 | 主要定位 |
|---|---|
| **Doris / ClickHouse / StarRocks / Databend** | 自带查询引擎与存储层的一体化分析数据库 |
| **DuckDB** | 嵌入式分析数据库，本地文件与内存分析强 |
| **Iceberg / Delta Lake** | 开放表格式 / 表协议层，不是完整执行引擎 |
| **Arrow** | 列式内存格式、IPC、跨语言数据交换底座 |
| **Velox / Gluten** | 执行引擎/加速层组件，不直接面向终端表管理 |

### 结论
Doris 的直接比较对象主要仍是 **ClickHouse、StarRocks、Databend**，而不是 Iceberg/Delta/Arrow 这类“格式或组件层”项目。

---

## 5.2 查询引擎设计差异

- **Doris / StarRocks**：更强调 MPP、实时导入、湖仓联邦与统一查询入口。
- **ClickHouse**：更偏极致分析性能、MergeTree 体系和丰富索引/存储路径优化。
- **DuckDB**：更偏单机嵌入式、开发分析、数据科学本地工作负载。
- **Velox / Gluten**：作为执行层，更多服务于上层 Spark / Presto / Prestissimo。
- **Iceberg / Delta**：执行由 Spark/Flink/Trino/Doris/StarRocks 等承载，自身关注协议与表元数据。

### 对 Doris 的含义
Doris 当前路线是在 **“数据库引擎 + 联邦层 + 湖仓访问 + 云模式”** 多条线上同时推进，覆盖面广于纯引擎项目，但复杂度也更高。

---

## 5.3 目标负载类型差异

| 项目 | 更擅长的负载 |
|---|---|
| **Doris** | 实时数仓、统一查询层、BI、日志分析、联邦分析 |
| **ClickHouse** | 超大规模明细分析、日志/事件分析、低延迟聚合 |
| **StarRocks** | 实时分析、外部表、物化视图与湖仓协同 |
| **DuckDB** | 本地分析、Notebook、嵌入式 ETL、开发态数据处理 |
| **Iceberg / Delta** | 湖仓表管理、事务元数据、跨引擎共享 |
| **Databend** | 云原生分析、版本化表管理、FUSE 存储演进 |
| **Arrow** | 数据交换、内存列式计算、跨语言互操作 |

---

## 5.4 SQL 兼容性差异

- **Doris / StarRocks**：越来越重视多 Catalog、JDBC、外部源 SQL 兼容。
- **ClickHouse**：功能强但历史上拥有较强自有语义传统，兼容性优化持续推进中。
- **DuckDB**：标准 SQL 和数据科学生态兼容性提升很快，但复杂类型边界仍多。
- **Databend**：明显处于 SQL 兼容性快速补齐阶段。
- **Velox**：更关注与 Spark/Presto 上层方言语义对齐。
- **Delta / Iceberg / Arrow**：SQL 不是主战场，更多是协议/接口兼容。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：超高活跃
- **ClickHouse**
- **Apache Doris**

特点：
- PR/Issue 吞吐高；
- 同时有新功能、CI、稳定性、对象存储、正确性问题并行推进；
- 社区规模大，问题暴露也更充分。

#### 第二层：高活跃且聚焦明确
- **DuckDB**
- **Apache Iceberg**
- **StarRocks**

特点：
- 方向很清晰；
- 要么在做版本回归修复，要么在推进湖仓/权限/跨引擎能力；
- 社区反馈与修复闭环较快。

#### 第三层：中活跃、路线信号强
- **Delta Lake**
- **Databend**
- **Velox**
- **Arrow**

特点：
- 不是“喧闹型”活跃，但关键路线很清楚；
- 更多体现为内核演进、协议补齐或底层基础设施治理。

#### 第四层：专项问题驱动
- **Apache Gluten**

特点：
- 讨论集中在少数关键问题域；
- 当前更像“针对扫描内存/构建稳定性做专项治理”。

---

### 6.2 成熟度判断

#### 快速迭代阶段
- DuckDB
- Databend
- Delta Lake（Kernel/DSv2 路线）
- Velox / Gluten

特征：
- 新能力与架构演进明显；
- 回归和边界问题也较集中；
- 处于“快速扩张 + 稳定性补课”并存阶段。

#### 质量巩固阶段
- Doris
- ClickHouse
- StarRocks
- Iceberg
- Arrow

特征：
- 功能面已较完整；
- 当前更多在处理稳定性、兼容性、可观测性、云环境适配；
- 用户已在大规模生产中使用，因此问题更偏“深水区”。

---

## 7. 值得关注的趋势信号

### 7.1 行业正在从“结构化 OLAP”走向“半结构化分析一等公民”
Variant、JSON、Arrow union、Parquet 复杂类型、文本索引、向量索引在多个项目同时升温。  
**对数据工程师的启示**：未来表设计、导入链路和查询层需要更好支持动态 schema、嵌套对象和事件数据。  
**对架构师的启示**：选型时不能只看传统宽表聚合能力，还要看复杂类型写入、压缩、下推和生态兼容。

### 7.2 湖仓与对象存储能力已成为数据库核心能力
S3、Glue、Azure Blob、Iceberg Catalog、Hive-style partitioning 等不再是附加组件，而是高频生产路径。  
**参考价值**：建设数据平台时，要优先评估对象存储一致性、缓存策略、外部表兼容性和提交可靠性。

### 7.3 查询正确性比“新功能数量”更影响社区口碑
今天多个热点都不是新特性，而是 runtime filter、TTL、ALTER、binder、decimal coercion、GROUPING() 这类边界语义。  
**参考价值**：技术决策时，要重点关注项目对 correctness bug 的响应速度，而不是只看 benchmark。

### 7.4 可观测性与运维可控性正在成为竞争壁垒
Prometheus 指标、profile 指标补齐、OOM Canary、CI failure artifact、日志治理等，说明“可诊断性”已经成为一线能力。  
**参考价值**：生产选型时，应把 profile、metrics、错误分类、内存可视化纳入核心评估项。

### 7.5 云原生内存治理将是下一阶段关键竞争点
从 Doris、ClickHouse、Gluten、Arrow、DuckDB 的反馈看，大家都在处理“内存没有打满但系统先 OOM / 长期运行后内存不可控”的问题。  
**参考价值**：未来不仅要比吞吐，还要比：
- 内存 accounting 是否准确；
- 预取/缓存是否有 backpressure；
- 导入与查询链路是否长期稳定。

### 7.6 统一分析平台路线正在增强
Doris、StarRocks、ClickHouse 都在向更广的统一入口演进：SQL、联邦、搜索、对象存储、外部 Catalog、BI 兼容、云模式。  
**参考价值**：企业架构上，单一专用引擎的优势仍在，但“统一查询层 + 湖仓接入 + 实时分析”的平台化趋势越来越明显。

---

# 结论

从 2026-04-05 的社区动态看，开源 OLAP/分析存储生态已经进入一个更成熟的新阶段：  
**不是谁功能最多，而是谁能在复杂类型、对象存储、跨引擎兼容、查询正确性和运维可控性上同时做得更稳。**

对 **Apache Doris** 而言，其当前定位已经非常清晰：  
- 在 OLAP 主引擎能力之外，持续补强 **联邦查询、云模式、搜索分析、可观测性和大规模元数据效率**；  
- 与 ClickHouse 相比，Doris 更强调统一平台化与多 Catalog 路线；  
- 与 StarRocks 相比，二者高度相似，但 Doris 今日在查询正确性修补和多源 SQL 兼容性上信号更强；  
- 与 DuckDB / Iceberg / Delta / Arrow 相比，Doris 更接近企业级分析数据库，而不是嵌入式引擎或协议层组件。

如果用于技术决策，一个实用判断是：

- **追求极致活跃与超大规模工程生态**：ClickHouse  
- **追求统一分析平台、联邦与云/湖一体**：Doris / StarRocks  
- **追求本地嵌入式分析体验**：DuckDB  
- **追求开放表格式与跨引擎治理**：Iceberg / Delta Lake  
- **追求底层列式/执行组件能力**：Arrow / Velox / Gluten

如果你愿意，我可以继续把这份报告进一步整理成两种版本：  
1. **管理层 1 页摘要版**  
2. **面向架构选型的项目对比矩阵版（含推荐场景）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

以下是 **ClickHouse 项目动态日报（2026-04-05）**。

---

# ClickHouse 项目动态日报（2026-04-05）

## 1. 今日速览

过去 24 小时 ClickHouse 依旧保持**高活跃度**：Issues 更新 21 条，PR 更新 102 条，说明核心开发、CI 治理和功能迭代同步推进。  
当天没有新版本发布，但从 PR 与 Issue 分布看，项目当前重点明显集中在 **稳定性修复、CI 强化、S3/外部存储健壮性、查询性能优化** 以及 **实验性功能扩展**。  
Bug 报告中既有潜在**数据丢失**问题，也有 **OOM、崩溃、错误结果、兼容性缺陷**，不过部分问题已经在 24 小时内出现对应修复 PR，响应速度较快。  
整体来看，项目健康度良好：**工程活跃、问题暴露充分、修复链路及时**，但 MergeTree/TTL/ALTER/S3 相关路径仍是当前稳定性风险集中区。

---

## 2. 项目进展

> 今日数据中未提供明确“已合并 PR 列表明细”，以下重点关注 **已关闭** 或明显进入收敛阶段的 PR / 进展信号。

### 2.1 查询分析与 SQL 执行优化方向持续推进
- **Inline VIEW subquery during query analysis**  
  链接：ClickHouse/ClickHouse PR #100830  
  该 PR 已关闭，主题是**在 query tree 分析阶段内联 VIEW 子查询**，有助于后续做更多优化与改写。  
  这类改动通常会提升：
  - 查询分析器的优化空间
  - VIEW 场景下的谓词下推/简化能力
  - 复杂 SQL 的执行计划质量  
  虽然本次状态是 closed，仍然释放出 ClickHouse 在**新分析器/查询树优化**方向上的持续投入。

### 2.2 存储层与虚拟列优化继续细化
- **Native Common Virtuals for Buffer**  
  链接：ClickHouse/ClickHouse PR #101537  
  PR 已关闭。该方向与虚拟列支持一致性有关，说明团队在不同存储引擎上推进更统一的元信息访问能力。
- **Better virtual columns push-down for storage `Merge`**  
  链接：ClickHouse/ClickHouse PR #101742  
  当前仍为开放状态，但值得关注。它针对 `Merge` 存储的**虚拟列下推能力**做增强，若合入将改善特定查询的扫描效率与执行路径选择。

### 2.3 CI 治理继续加强，测试基础设施在扩容
- **Fix tests that create databases with static names causing flaky check conflicts**  
  链接：ClickHouse/ClickHouse PR #101553  
  该 PR 针对并发 flaky 检查时数据库静态命名冲突问题进行系统性修复，覆盖约 160 个测试文件。  
  这属于典型的**规模化 CI 工程治理**，将显著减少误报。
- **CI: add core dump encryption for fuzzer job, core collection for other jobs**  
  链接：ClickHouse/ClickHouse PR #101780  
  强化 core dump 收集与加密上传，兼顾**可观测性与安全性**。
- **Add stateless tests for MergeTree lightweight deletes**  
  链接：ClickHouse/ClickHouse PR #101792  
  为 MergeTree 轻量删除补足 9 个无覆盖测试，说明团队在补齐**历史低覆盖功能**。

### 2.4 S3 / 对象存储链路有多项健壮性改进
- **Prevent server termination when unregistering S3 client fails**  
  链接：ClickHouse/ClickHouse PR #101798  
  这是今天最值得关注的修复之一：避免在 S3 client cache 反注册失败时，由于 `noexcept` 析构函数中的异常传播触发 `std::terminate`。  
  这类问题一旦触发属于**服务进程级别崩溃风险**。
- **Fix/cache disk thread pool size**  
  链接：ClickHouse/ClickHouse PR #101712  
  修复 S3 cached disk 使用 `thread_pool_size` 时可能导致启动崩溃的问题。
- **Preallocate multipart_tags deque**  
  链接：ClickHouse/ClickHouse PR #101799  
  针对 S3 multipart upload 循环中的动态内存分配开销做微优化，偏向**热点路径性能改善**。

---

## 3. 社区热点

以下是今天最值得关注、讨论热度较高或技术信号明显的 Issues / PR。

### 3.1 CI 崩溃：MergeTreeDataPartCompact 双重删除
- 链接：ClickHouse/ClickHouse Issue #99799
- 标题：`[crash-ci] [CI crash] Double deletion of MergeTreeDataPartCompact in multi_index`

这是当前最活跃的 issue 之一（24 条评论）。问题指向 `MergeTreeDataPartCompact` 在 `multi_index` 场景下的**双重释放**，属于典型的内存生命周期错误。  
**技术诉求**：  
- 提升 MergeTree 内部对象所有权管理的安全性  
- 进一步依赖 sanitizer / CI crash 匹配机制快速定位底层存储引擎问题  
这类问题虽然首先在 CI 暴露，但如果与特定执行路径相关，也可能演变为生产级崩溃隐患。

### 3.2 分布式表上简单 View 带来明显性能劣化
- 链接：ClickHouse/ClickHouse Issue #51645
- 标题：`trivial view on top of distributed table can significantly impact the performance of some queries`

这是一个老问题再度活跃，反映出用户对**分布式查询规划质量**的不满。  
问题核心不是 SQL 语义错误，而是：在 Distributed 表之上再包一层非常简单的 VIEW，某些查询性能却显著下降。  
**技术诉求**：
- VIEW 展开/内联能力增强
- Distributed 场景下谓词下推、投影裁剪和查询改写更稳定
- 避免“语法上无害、性能上有害”的抽象层  
这与 PR #100830 的 query analysis 内联方向形成呼应。

### 3.3 `CREATE TABLE IF NOT EXISTS ... AS SELECT` 语义扩展
- 链接：ClickHouse/ClickHouse Issue #91631
- 标题：`[feature] Extension of CREATE TABLE IF NOT EXISTS ... AS SELECT`

这是典型的 SQL 易用性需求：用户希望在 `IF NOT EXISTS` 与 `AS SELECT` 组合场景下，行为更自然、更可预测。  
**技术诉求**：
- 降低自动建表脚本重复执行时的副作用
- 提升与其他 SQL 系统或用户直觉的一致性
- 更适合幂等部署 / 初始化脚本

### 3.4 OOM Canary
- 链接：ClickHouse/ClickHouse Issue #101749
- 标题：`[feature, operations, memory] OOM Canary`

这是非常有产品方向感的运维功能请求。  
提议通过子进程和 OOM score 调整，在 Linux OOM killer 真正杀掉 `clickhouse-server` 之前提前感知风险。  
**技术诉求**：
- 提高可恢复性与故障预警能力
- 为云环境/容器环境中的内存治理提供先手信号
- 降低“突然被系统杀死”的不可观测性  
这与今日另一个用户反馈 issue #101356 形成强关联。

### 3.5 部分聚合缓存：面向 MergeTree 的实验性能力
- 链接：ClickHouse/ClickHouse PR #93757
- 标题：`Add PartialAggregateCache for part-level aggregate caching`

虽然不是当天新建，但持续更新，且技术含金量高。  
该 PR 希望给 MergeTree 上的 GROUP BY 引入**part-level 中间聚合状态缓存**。  
**技术价值**：
- 重复性分析查询有机会显著受益
- 可能成为 ClickHouse 在“分析缓存”方向的重要实验能力
- 若命中率可控，对成本与延迟均有帮助

---

## 4. Bug 与稳定性

以下按严重程度排序，并标注是否已看到修复动向。

### P0 / 高危：可能导致数据丢失

#### 4.1 `ALTER TABLE MODIFY TTL` + `DateTime` 32 位溢出会静默删光数据
- Issue：ClickHouse/ClickHouse Issue #101763  
- Fix PR：ClickHouse/ClickHouse PR #101793

这是今天最严重的问题之一。  
当 `DateTime`（32-bit）列配合大时间间隔（如 `INTERVAL 100 YEAR`）做 TTL 修改时，TTL 表达式可能发生 Unix 时间戳溢出并回绕到过去，从而触发**静默数据删除**。  
特点：
- 用户不易提前察觉
- 属于正确性与数据安全双重问题
- 已有 WIP 修复 PR，响应较快

#### 4.2 `REPLACE PARTITION` 使用不存在分区时可能造成目标分区数据被破坏
- 链接：ClickHouse/ClickHouse Issue #23727

这是一个长期存在的老问题，但依旧非常重要。  
根因是分区替换流程对“源分区不存在”的保护不足，导致目标表对应分区数据丢失。  
这是经典的**DDL/运维命令安全防护不足**问题，值得尽快加保护性检查。

#### 4.3 merge 与 `ALTER RENAME COLUMN` 竞态可导致重命名列数据丢失
- 链接：ClickHouse/ClickHouse Issue #80648

该问题涉及 MergeTree merge 流程与 schema 变更并发，说明存储引擎在**后台任务与元数据变更**之间仍存在边缘竞态。  
对于依赖频繁 schema 演进的用户，这是高风险点。

---

### P1 / 高危：可能导致崩溃或服务终止

#### 4.4 CI crash：`MergeTreeDataPartCompact` 双重删除
- 链接：ClickHouse/ClickHouse Issue #99799

底层资源生命周期错误，可能导致崩溃。虽当前主要暴露于 CI，但需警惕进入实际运行路径。

#### 4.5 S3 client 反注册异常导致 `std::terminate`
- PR：ClickHouse/ClickHouse PR #101798  
- 关联关闭 PR：ClickHouse/ClickHouse PR #101797

该修复避免异常从 `noexcept` 析构函数中传播，属于**进程稳定性**关键修复。  
如果使用对象存储较多，这类修复价值很高。

#### 4.6 使用 S3 cached disk 时 `thread_pool_size` 可能导致启动崩溃
- PR：ClickHouse/ClickHouse PR #101712

这是配置兼容性与启动稳定性问题，影响使用 S3 缓存盘部署的用户。

#### 4.7 `MergingSortedAlgorithm` allocator 尺寸异常
- 链接：ClickHouse/ClickHouse Issue #101308

fuzz 暴露的 `Too large size passed to allocator` 通常意味着边界条件/整数计算/内存布局存在漏洞，是典型的潜在崩溃源。

---

### P1 / 正确性问题：返回错误结果

#### 4.8 `levenshteinDistanceWeighted` / `arraySimilarity` 连续匹配场景结果错误
- 链接：ClickHouse/ClickHouse Issue #101725

这是函数正确性问题。  
虽然影响面看似有限，但若用于近似匹配、文本比对或推荐场景，会直接影响结果质量。

#### 4.9 `ReservoirSamplerDeterministic::merge()` 缺少 self-merge guard
- 链接：ClickHouse/ClickHouse Issue #101782

会导致聚合结果偏差，如 `medianDeterministicState` 返回异常值。  
属于**统计聚合正确性**问题，对分析型数据库来说很敏感。

#### 4.10 `processWarning` 使用 stale metrics
- 链接：ClickHouse/ClickHouse Issue #101759

会导致 `system.warnings` 总是慢一拍，虽然不一定影响主查询结果，但会影响监控和告警可信度。

---

### P2 / 兼容性、外部格式与查询行为异常

#### 4.11 Parquet 文件读取错误（v26.2.4.23）
- 链接：ClickHouse/ClickHouse Issue #99019

用户在通过 `s3()` 表函数读取包含 binary string 列的 Parquet 文件并加 `WHERE` 过滤时遇到错误。  
这类问题直接影响数据湖/外部表格式兼容性。

#### 4.12 S3 table engine 的 hive-style partitioning 不工作
- PR：ClickHouse/ClickHouse PR #101787  
- 关联 issue：#74571（PR 摘要中提及）

说明 S3 引擎在 `use_hive_partitioning` 的行为上存在创建时固化问题，现在通过查询时动态补列修复，属于**对象存储 + 湖仓兼容性**改进。

#### 4.13 `--reconnect` 旧语法兼容性被破坏
- 链接：ClickHouse/ClickHouse Issue #101748

CLI 参数兼容性回归，虽不影响核心引擎，但对运维脚本和旧工具链有影响。

#### 4.14 `renameDatabase` 中表名长度检查可被 `check_table_dependencies=0` 绕过
- 链接：ClickHouse/ClickHouse Issue #101747

这是一个边界条件下的校验绕过问题，偏向元数据安全与一致性。

---

### P2 / 测试与 CI 稳定性

#### 4.15 Flaky test：`03237_avro_union_in_complex_types`
- 链接：ClickHouse/ClickHouse Issue #101317

说明 Avro 复杂类型支持路径仍有不稳定测试点。

#### 4.16 Fast test 日志导出能力已补齐
- 链接：ClickHouse/ClickHouse Issue #93574

该 issue 已关闭，意味着 CI 可观测性继续改善。

---

## 5. 功能请求与路线图信号

### 5.1 文本索引支持位置感知短语查询
- 链接：ClickHouse/ClickHouse Issue #101473

这是今天很强的路线图信号之一。  
当前 text index 只能知道 token 出现在哪一行，不能知道 token 在行内的位置，因此无法高效支持精确 phrase query。  
若未来实现 posting list 中的位置信息，将推动：
- 更强的全文检索能力
- phrase query 在索引层求值
- 文本分析场景从“过滤辅助”走向更完整检索能力

### 5.2 向量相似度索引从 SimSIMD 升级到 NumKong
- 链接：ClickHouse/ClickHouse Issue #100555

这是向量检索方向的持续演进信号。  
维护者不仅关注性能，也强调**数值结果一致性**与正确性验证，说明向量能力正走向更成熟工程化。

### 5.3 新增 `cuckoo_filter` 跳数索引
- Issue：ClickHouse/ClickHouse Issue #101795  
- PR：ClickHouse/ClickHouse PR #101796

这是今天最明确的“需求已快速进入实现”的案例。  
从 issue 到 PR 几乎同步推进，表明该功能**较可能进入后续版本**。  
其价值在于：
- 为 MergeTree 提供新的 skip index 类型
- 改善某些高选择性过滤场景
- 拓展 ClickHouse 在索引结构上的实验空间

### 5.4 OOM Canary 运维能力
- 链接：ClickHouse/ClickHouse Issue #101749

若被采纳，属于偏平台化/运维增强功能，不直接改变 SQL 能力，但会显著提升大规模部署体验。  
结合用户实际 OOM 反馈，**落地可能性不低**。

### 5.5 主键范围裁剪性能优化
- 链接：ClickHouse/ClickHouse Issue #99914

该 issue 指出针对 granule 数量巨大的 part，主键范围裁剪步骤数异常多。  
这是非常典型的 **MergeTree 大分片/大 part 查询优化**需求，未来有望进入性能专项。

### 5.6 `CREATE TABLE IF NOT EXISTS ... AS SELECT` 语义增强
- 链接：ClickHouse/ClickHouse Issue #91631

SQL 兼容性与幂等 DDL 体验改进，适合纳入中短期路线图。

---

## 6. 用户反馈摘要

### 6.1 真实用户对“性能隐性退化”高度敏感
- 代表 issue：ClickHouse/ClickHouse Issue #51645

用户并不只关心“是否能跑”，而是非常在意**简单抽象是否意外破坏优化器行为**。  
在 OLAP 场景中，一个 trivial view 导致明显性能下降，说明用户已经把 ClickHouse 用在大规模生产分析路径，对计划质量容忍度很低。

### 6.2 湖仓/对象存储场景仍是高频使用面
- 代表 issue：#99019  
- 代表 PR：#101712, #101787, #101798, #101799

S3、Parquet、Hive-style partitioning、cached disk 等问题集中出现，说明大量用户正将 ClickHouse 深度用于：
- 外部数据读取
- 云对象存储冷热分层
- 湖仓接入  
这也意味着 S3 相关稳定性和兼容性，已经不是边缘功能，而是核心用户体验的一部分。

### 6.3 运维用户希望更强的内存故障预警与诊断能力
- 代表 issue：ClickHouse/ClickHouse Issue #101356  
- 代表 feature：ClickHouse/ClickHouse Issue #101749

用户反馈 system log flush 期间会遭遇 `Memory limit exceeded` 甚至 Linux OOM killer。  
这暴露两个痛点：
- 系统表/内部日志写入也可能成为内存峰值触发点
- 运维需要在“被杀之前”得到更多预警和上下文  
说明 ClickHouse 在大规模长时间运行环境里，**可运维性**正在成为与性能同等重要的话题。

### 6.4 用户对数据安全边界问题容忍度极低
- 代表 issue：#101763, #23727, #80648

TTL 溢出、分区替换误删、ALTER/merge 竞态这几类问题都指向同一件事：  
对分析型数据库用户而言，**数据删错一次的代价远高于一次性能抖动**。  
这类问题会显著影响企业对自动化 DDL、生命周期管理和后台 merge 的信心。

---

## 7. 待处理积压

以下是值得维护者继续关注的长期或高价值积压项。

### 7.1 分布式表 + VIEW 性能问题长期存在
- 链接：ClickHouse/ClickHouse Issue #51645  
- 创建于：2023-06-30

这是一个已有较长历史的问题，且与查询规划器质量直接相关。  
建议结合 query tree / VIEW inline 方向统一处理，优先级应高于普通 usability 问题。

### 7.2 `REPLACE PARTITION` 非存在分区导致数据丢失
- 链接：ClickHouse/ClickHouse Issue #23727  
- 创建于：2021-04-28

存在时间很长，且风险高。  
建议尽快增加：
- 目标操作前校验
- 默认 fail-fast 行为
- 更明确的错误提示

### 7.3 `ALTER RENAME COLUMN` 与 merge 竞态
- 链接：ClickHouse/ClickHouse Issue #80648  
- 创建于：2025-05-21

虽然评论不多，但问题严重度高。  
建议至少补齐回归测试，避免 schema 变更与后台任务交错时再次出现数据错乱。

### 7.4 主键范围裁剪在大 part 上性能不佳
- 链接：ClickHouse/ClickHouse Issue #99914

虽然属于性能优化而非 correctness bug，但它直接影响大数据量查询延迟，且已经有明确日志证据，值得进入性能优化 backlog。

### 7.5 PartialAggregateCache 实验特性仍待推进
- 链接：ClickHouse/ClickHouse PR #93757

该 PR 已持续较久。  
如果设计成熟并验证收益明确，它可能成为 ClickHouse 在高频聚合场景中的重要差异化能力；如果迟迟不推进，也应尽快给出设计取舍结论。

---

## 8. 结论

今天的 ClickHouse 体现出一个典型的高活跃开源 OLAP 项目状态：  
一方面，**S3/Parquet/分布式查询/文本索引/向量索引/聚合缓存**等方向持续扩展，显示产品边界在不断扩大；另一方面，**TTL、ALTER、MergeTree、对象存储生命周期、CI 稳定性**等基础工程面也持续暴露出复杂系统应有的边缘问题。  

从健康度看，项目最积极的信号是：  
- 问题暴露充分  
- 修复响应较快  
- CI 与测试体系持续增强  
- 新功能请求与实现出现“同日联动”  

从风险看，维护者近期最应优先处理的仍是：  
1. **数据丢失类问题**  
2. **进程级崩溃和 OOM 可观测性**  
3. **Distributed/View/S3 等生产高频路径的性能与兼容性**

如果你愿意，我还可以继续把这份日报整理成更适合内部周报使用的两种格式：  
1. **管理层摘要版（1页）**  
2. **工程团队跟进版（按模块归类待办）**

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-04-05）

## 1. 今日速览

过去 24 小时 DuckDB 社区保持**较高活跃度**：Issues 更新 11 条、PR 更新 20 条，但**无新版本发布**。  
从内容看，今日重点仍集中在 **1.5.1 相关回归修复、Arrow/Parquet 互操作稳定性、执行器与扫描器边界条件修复**，说明项目正处于一轮密集的缺陷收敛期。  
PR 侧出现多条针对 **查询正确性、宏展开性能、日志系统、统计信息优化** 的改动，既有短平快 bugfix，也有面向执行优化的中型改进。  
整体健康度判断为：**活跃且问题响应较快**，但近期暴露出的 release build 崩溃、Unicode 排序异常、VARIANT→Parquet 写出失败等问题，表明主干在复杂类型与边缘输入上的稳定性仍需加固。

---

## 3. 项目进展

### 已关闭 / 结束的重要 PR

#### 1) 修复 lateral table in-out function 中 constant struct 参数错误
- PR: [#21826](https://github.com/duckdb/duckdb/pull/21826)（已关闭，随后由替代 PR 延续）
- 替代 PR: [#21827](https://github.com/duckdb/duckdb/pull/21827)（Open）

这组变更针对 **lateral table in-out function** 的参数传递正确性问题：当 `STRUCT` 同时包含外层行值和常量字段时，常量字段可能只在第一行正确，后续行被污染。  
这属于典型的 **执行器/向量化参数复用错误**，影响 SQL 函数调用语义正确性。虽然原 PR 已关闭，但替代 PR 已继续推进，说明维护流程正常、修复方向明确。

#### 2) 扫描级聚合下推方案被关闭，转向更简单的统计预计算实现
- 已关闭 PR: [#21797 Push min/max/count down to table scan](https://github.com/duckdb/duckdb/pull/21797)
- 后续方案 PR: [#21831 Partial aggregate precomputation from row group statistics](https://github.com/duckdb/duckdb/pull/21831)

原方案尝试把 `min/max/count` 下推到 table scan；在 review 后，作者改为更简洁的 **基于 row group statistics 的部分聚合预计算**。  
这说明 DuckDB 在推进 **利用存储统计信息减少数据扫描** 的优化，但更倾向于维护成本低、可验证性更强的实现路径。  
对 OLAP 场景而言，这类优化若落地，将直接改善简单聚合查询在大表上的响应时间。

#### 3) 字符串写入 API 语义优化 PR 被关闭
- PR: [#21816](https://github.com/duckdb/duckdb/pull/21816)（已关闭）

该 PR 试图让 `FlatVector::Writer<string_t>` 自动把字符串复制到结果向量中，减少调用方手动 `AddStringOrBlob` 的负担。  
虽未继续推进，但它反映出内部 API 设计仍在权衡 **性能、所有权语义与易用性**。这类改动通常影响较广，关闭并不意外。

---

## 4. 社区热点

### 1) JSON/CSV 自动识别 ISO 8601 时区时间戳
- Issue: [#14919](https://github.com/duckdb/duckdb/issues/14919)
- 状态：Open，8 评论，👍 11

这是今日**互动最高**的问题之一。用户指出 `read_json_auto`/自动检测在处理带时区偏移的 `ISO 8601 timestamp` 时与文档预期不一致。  
背后的技术诉求非常明确：**半结构化数据导入时，日期时间自动推断必须稳定、可预期、与文档一致**。  
这类问题对日志分析、事件流导入、API 数据落地尤为关键，因为时间戳格式往往混杂 `Z`、`+00:00`、`-05:00` 等变体。

### 2) VARIANT 列写入 Parquet 触发内部错误
- Issue: [#21779](https://github.com/duckdb/duckdb/issues/21779)
- 状态：Open，7 评论

用户报告将 `JSON` cast 为 `VARIANT` 后写入 Parquet，在进度约 96% 时触发内部断言：  
`Attempted to access index 2 within vector of size 2`。  
这反映出 DuckDB 新复杂类型与 Parquet writer 的组合路径仍存在 **后期写出阶段的结构一致性问题**，对数据湖写出场景影响较大。

### 3) MotherDuck 扩展加载问题
- Issue: [#21771](https://github.com/duckdb/duckdb/issues/21771)
- 状态：Open，4 评论

在升级到 1.5.1 后，`LOAD motherduck` 出现异常。  
这说明 DuckDB 核心版本升级对外部扩展 ABI/加载时序/attach-load 行为可能产生影响，社区用户对 **扩展生态兼容性** 依赖度较高。

### 4) Arrow union 类型映射问题当天报当天修
- Issue: [#21842](https://github.com/duckdb/duckdb/issues/21842)
- PR: [#21843](https://github.com/duckdb/duckdb/pull/21843)

这是今天最典型的“**问题发现—快速提交修复**”案例。  
问题在于 DuckDB 通过 Arrow C Data Interface 导入 sparse union 时，虽然解析了 format string 中的 `type_id` 映射，但实际导入时忽略了该映射，错误地假设 `type_id == child_index`。  
这类问题直接关系到 DuckDB 与 Arrow 生态的互操作可信度，值得持续关注。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高严重：写出或执行阶段崩溃、内部断言

#### 1) VARIANT 写 Parquet 触发 INTERNAL Error
- Issue: [#21779](https://github.com/duckdb/duckdb/issues/21779)
- 状态：Open
- 是否已有 fix PR：**暂无明确 PR**

影响路径是 `JSON -> VARIANT -> Parquet`，属于复杂类型持久化链路问题。  
由于在接近完成时崩溃，除了可用性影响，还可能造成用户对写出成功性的误判。

#### 2) release build 特有的内部越界错误
- Issue: [#21820](https://github.com/duckdb/duckdb/issues/21820)
- 状态：Open
- 是否已有 fix PR：**暂无**

错误信息：`Attempted to access index 5 within vector of size 5`，且只在 `reldebug/release` 出现。  
这类“仅优化构建触发”的问题通常比 debug-only 问题更危险，因为它可能与未定义行为、边界检查消失、向量生命周期有关，且更容易影响生产环境。

#### 3) Arrow sparse union type_id 映射被忽略，可能导致崩溃/错误解析
- Issue: [#21842](https://github.com/duckdb/duckdb/issues/21842)
- Fix PR: [#21843](https://github.com/duckdb/duckdb/pull/21843)

这是一个典型的 **Arrow 互操作 correctness bug**。  
优点是修复跟进非常快，说明维护者和贡献者对 Arrow 接口质量高度重视。

---

### P1 / 中高严重：查询正确性回归、异常失败

#### 4) 1.5.1 中 `ORDER BY ... LIMIT` 遇到特定 Unicode 字符串时报错
- Issue: [#21832](https://github.com/duckdb/duckdb/issues/21832)
- 状态：Open
- 是否已有 fix PR：**暂无**

特定字符串如 `Til Ærø` 会导致：
`Invalid Input Error: Invalid unicode (byte sequence mismatch) detected in value construction`  
问题同时在 CLI、Python、R 重现，说明属于核心层问题，而非单一客户端绑定。  
这对国际化文本数据分析场景影响明显。

#### 5) 1.5.1 出现 “Failed to bind column reference” 回归
- Issue: [#21788](https://github.com/duckdb/duckdb/issues/21788)
- 状态：Open
- 是否已有 fix PR：**暂无**

相同查询在 `<=1.5.0` 正常、`1.5.1` 失败，属于典型版本回归。  
错误信息显示 binder 在类型推断/列绑定阶段出现不一致：`VARCHAR != BIGINT`。

#### 6) DISTINCT CTE + LEFT JOIN 在空表场景下偶发错误结果
- PR: [#21804](https://github.com/duckdb/duckdb/pull/21804)
- 状态：Open

这是已进入修复阶段的正确性问题。根因是 **dynamic join filter 被错误地下推到 DISTINCT 子树以下**。  
如果合并，将提升复杂查询计划变换的可靠性，尤其是并行执行下的稳定性。

#### 7) CASE-heavy 嵌套宏导致宏展开爆炸
- PR: [#21801](https://github.com/duckdb/duckdb/pull/21801)
- 状态：Open

这是性能问题，也可能间接造成查询不可用。  
修复思路是避免对常量 `WHEN` 已可判定为不可达的分支继续做参数替换/展开，对 SQL 宏重度使用者价值较高。

---

### P2 / 中等严重：内存、兼容性与边界条件

#### 8) fixed-size arrays + `ON CONFLICT` 触发大量内存占用/泄漏
- Issue: [#21836](https://github.com/duckdb/duckdb/issues/21836)
- 状态：Open
- 是否已有 fix PR：**暂无**

用户反馈该问题在 `1.2.1` 不出现、`1.4.4` 也正常，说明很可能是 `1.5.x` 引入的新回归。  
对 upsert/去重写入场景而言，这属于高优先级内存稳定性问题。

#### 9) `LOAD motherduck` 在 1.5.1 升级后异常
- Issue: [#21771](https://github.com/duckdb/duckdb/issues/21771)
- 状态：Open
- 是否已有 fix PR：**暂无**

虽非核心引擎 crash，但对扩展使用者属于“功能不可用”。

#### 10) `CREATE SEQUENCE MINVALUE` 参数被忽略
- Issue: [#21813](https://github.com/duckdb/duckdb/issues/21813)
- 状态：Open，已有修复线索
- 关联：Issue 标注 `[PR submitted]`

这是 **SQL DDL 兼容性/元数据正确性** 问题，影响 `duckdb_sequences()` 结果和 CREATE 语句回显。

#### 11) `COMMENT ON COLUMN` 对 `STRUCT` 类型失败
- Issue: [#17517](https://github.com/duckdb/duckdb/issues/17517)
- 状态：Open

更多属于 SQL 特性完备性问题，但对面向数据建模和元数据治理的用户仍有现实影响。

---

### 已有修复推进的稳定性 PR

#### 12) 修复 `is_histogram_other_bin` 处理 NULL
- PR: [#21841](https://github.com/duckdb/duckdb/pull/21841)

来自 fuzzer 报告，说明 fuzzing 持续在帮助 DuckDB 收敛表达式执行边界问题。

#### 13) 修复 CSV 处理中的越界访问
- PR: [#21840](https://github.com/duckdb/duckdb/pull/21840)

这是典型输入扫描器边界检查缺失问题，直接关系到文件导入稳定性。

#### 14) 修复日志截断后日志丢失
- PR: [#21830](https://github.com/duckdb/duckdb/pull/21830)

影响 `truncate_duckdb_logs()` 后的日志可见性，属于运维可观测性修复。

#### 15) 修复 `CreateViewInfo::Copy()` 未复制 names
- PR: [#21819](https://github.com/duckdb/duckdb/pull/21819)

这是 catalog / view 元数据复制一致性问题，若不修复可能导致 `types/names` 尺寸不匹配。

#### 16) 修复 HUGEINT/UHUGEINT 写 Parquet 精度丢失
- PR: [#21252](https://github.com/duckdb/duckdb/pull/21252)

该问题非常重要：此前通过 `DOUBLE` 存储会导致 `2^53` 以上整数静默失真。  
对金融、ID、哈希、区块链等超大整数使用场景是关键修复。

---

## 6. 功能请求与路线图信号

### 1) Arrow union 类型支持完善可能较快进入后续版本
- Issue: [#21842](https://github.com/duckdb/duckdb/issues/21842)
- PR: [#21843](https://github.com/duckdb/duckdb/pull/21843)

由于问题已被当天提交修复，且修复范围明确、风险可控，**很可能进入下一次 patch release**。  
这体现出 DuckDB 正持续补强 **Arrow C Data Interface** 的复杂类型兼容性。

### 2) 系统表暴露更多 catalog 元数据
- PR: [#21794 Expose column tags via duckdb_columns()](https://github.com/duckdb/duckdb/pull/21794)

虽然当前标记为 CI Failure，但方向很清晰：让 `duckdb_columns()` 暴露 column tags。  
这反映出项目对 **元数据可观测性、数据治理能力、系统表一致性** 的持续增强。

### 3) 基于 row group statistics 的聚合预计算
- PR: [#21831](https://github.com/duckdb/duckdb/pull/21831)

这是较强的路线图信号。  
若合入，DuckDB 将在不扫描底层数据的情况下，直接利用统计信息部分回答 `min/max/count(*)` 类查询，进一步强化其 OLAP 执行效率。

### 4) CLI 扩展能力：允许扩展注册 dot commands
- PR: [#21201](https://github.com/duckdb/duckdb/pull/21201)

虽然 stale，但它代表一个值得关注的方向：**CLI 可扩展化**。  
若推进成功，将使 DuckDB shell 从数据库交互工具进一步演进为扩展承载前端。

### 5) `.llm` dot command 几乎不可能进入主线
- PR: [#21041](https://github.com/duckdb/duckdb/pull/21041)

作者自己已明确表示此 PR 违背项目 “no generative AI policy”。  
因此它更像实验性提案，不应视为正式路线图的一部分。

---

## 7. 用户反馈摘要

### 1) 用户最在意的是“升级后是否还能跑”
多个问题直接指向 **1.5.1 回归**：
- [#21771](https://github.com/duckdb/duckdb/issues/21771) `LOAD motherduck` 异常
- [#21788](https://github.com/duckdb/duckdb/issues/21788) binder 回归
- [#21832](https://github.com/duckdb/duckdb/issues/21832) Unicode 排序/limit 异常
- [#21836](https://github.com/duckdb/duckdb/issues/21836) 内存问题

这说明真实用户对 DuckDB 的使用已非常贴近生产环境，升级后的兼容性和稳定性比“新增功能”更敏感。

### 2) 半结构化与复杂类型已经成为主流使用路径
- JSON/CSV 自动识别时区时间戳：[#14919](https://github.com/duckdb/duckdb/issues/14919)
- VARIANT 写 Parquet 崩溃：[#21779](https://github.com/duckdb/duckdb/issues/21779)
- Arrow union 映射问题：[#21842](https://github.com/duckdb/duckdb/issues/21842)

用户显然越来越多地将 DuckDB 用于 **日志、事件、嵌套对象、Arrow/Parquet 数据湖互通** 场景，而不仅仅是传统结构化 SQL。

### 3) 用户对 SQL 兼容性与元数据完备性也有持续期待
- `CREATE SEQUENCE MINVALUE` 被忽略：[#21813](https://github.com/duckdb/duckdb/issues/21813)
- `COMMENT ON COLUMN` + STRUCT 失败：[#17517](https://github.com/duckdb/duckdb/issues/17517)
- `duckdb_columns()` 暴露 tags：[#21794](https://github.com/duckdb/duckdb/pull/21794)

这说明 DuckDB 不再只是“快查询引擎”，而正在被用户当作具备建模、治理、可运维性的数据库系统来期待。

---

## 8. 待处理积压

### 1) ISO 8601 时区时间自动识别问题长期悬而未决
- Issue: [#14919](https://github.com/duckdb/duckdb/issues/14919)
- 创建时间：2024-11-20
- 现状：有复现、有较多互动、👍 较高

这是一个典型的**影响广、优先级应高于表面热度**的问题。  
建议维护者尽快明确：是文档与实现不一致，还是推断规则本身需要调整。

### 2) `COMMENT ON COLUMN` 对 STRUCT 支持缺失
- Issue: [#17517](https://github.com/duckdb/duckdb/issues/17517)
- 创建时间：2025-05-16

虽然评论不多，但它关系到 **复杂类型上的 DDL 完备性**。  
对于使用 DuckDB 做数据建模、语义层构建的团队，这是实际阻碍。

### 3) HUGEINT/UHUGEINT → Parquet 精度修复 PR 仍待推进
- PR: [#21252](https://github.com/duckdb/duckdb/pull/21252)

该问题具备“**静默数据损坏**”属性，优先级应高。  
建议维护者尽快完成 review，因为它比普通 crash 更隐蔽、更可能造成生产数据错误。

### 4) CLI 扩展注册 dot commands 的设计值得给出方向性结论
- PR: [#21201](https://github.com/duckdb/duckdb/pull/21201)

即便不立即合并，也建议给出架构意见：  
是接受 shell-only API，还是要求更核心层的抽象。避免社区在同一方向反复试错。

---

## 综合判断

今天的 DuckDB 呈现出很鲜明的状态：  
一方面，**修复速度快、贡献者活跃、问题到 PR 的链路顺畅**；另一方面，**复杂类型、边缘字符集、扩展兼容性、release-only 错误** 仍是当前稳定性薄弱点。  
如果近期目标是发布更稳健的 patch 版本，那么建议优先处理以下四类问题：

1. **1.5.1 回归类问题**：[#21771](https://github.com/duckdb/duckdb/issues/21771), [#21788](https://github.com/duckdb/duckdb/issues/21788), [#21832](https://github.com/duckdb/duckdb/issues/21832), [#21836](https://github.com/duckdb/duckdb/issues/21836)  
2. **复杂类型持久化与 Arrow/Parquet 互操作**：[#21779](https://github.com/duckdb/duckdb/issues/21779), [#21842](https://github.com/duckdb/duckdb/issues/21842), [#21252](https://github.com/duckdb/duckdb/pull/21252)  
3. **查询正确性修复**：[#21804](https://github.com/duckdb/duckdb/pull/21804), [#21827](https://github.com/duckdb/duckdb/pull/21827)  
4. **存储统计信息驱动的性能优化**：[#21831](https://github.com/duckdb/duckdb/pull/21831)

如需，我还可以继续把这份日报整理成：
- **适合发飞书/Slack 的简版**
- **管理层摘要版**
- **按“查询引擎 / 存储 / 生态互操作”分类的技术版**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

以下是 **StarRocks 2026-04-05 项目动态日报**。

---

# StarRocks 项目动态日报 · 2026-04-05

## 1. 今日速览

过去 24 小时 StarRocks 项目保持 **中高活跃度**：Issues 更新 7 条、PR 更新 18 条，说明社区与维护者在 bug 修复、重构和文档治理上持续推进。  
今日没有新版本发布，但多个新提交直指 **SQL 兼容性、外部 Catalog 权限处理、ORC 元数据解析正确性、Python/SQLAlchemy 生态兼容** 等实际使用问题。  
从 PR 类型看，当前节奏以 **快速修复已报告缺陷 + 底层接口重构 + 4.1 相关能力演进** 为主，属于典型的版本打磨期。  
值得注意的是，部分问题已经形成 **Issue → PR 的快速闭环**，反映出项目在 bug 响应效率上表现较好。  
整体健康度判断：**稳定向好，核心引擎与生态兼容性持续增强，但权限边界与外部系统适配仍是当前风险点。**

---

## 2. 项目进展

### 今日已关闭/结束的重要 PR

#### 2.1 ORC 文件统计提取 off-by-one 修复已提出并关闭
- PR: **#71300 [CLOSED] [BugFix] Fix off-by-one in ORC column statistics extraction**
- 链接: https://github.com/StarRocks/starrocks/pull/71300

该 PR 对应 Issue #71222，修复 `AddFilesProcedure.extractOrcMetrics` 在解析 ORC `Reader.getStatistics()` 时从索引 0 开始遍历的问题。  
ORC 的统计数组中 **index 0 是文件级统计**，真实列统计从 index 1 开始；原实现会导致列统计整体错位，影响导入/元数据统计正确性。

**意义：**
- 提升外部文件导入与元数据采集的正确性
- 减少基于 ORC 统计信息进行推断时的偏差
- 属于典型的 **查询前元数据质量修复**

相关 Issue：
- Issue #71222: https://github.com/StarRocks/starrocks/issues/71222

---

#### 2.2 Column 原始数据访问接口重构继续推进
- PR: **#71298 [CLOSED] [Refactor] Remove Column::mutable_raw_data**
- 链接: https://github.com/StarRocks/starrocks/pull/71298

- PR: **#71293 [CLOSED] [Enhancement] Add MutableRawDataVisitor**
- 链接: https://github.com/StarRocks/starrocks/pull/71293

- PR: **#71303 [OPEN] [Refactor] Add RawBytesVisitor**
- 链接: https://github.com/StarRocks/starrocks/pull/71303

这是一组连续重构工作，围绕 `Column` 原始数据访问接口逐步替换旧方法，目标是消除不安全/语义不清晰的虚函数接口，转向 visitor 模式。

**推进点：**
- 降低列类型不支持接口时触发 crash 的风险
- 为移除 `BinaryColumn` 的 slice cache 等后续优化铺路
- 改善列式执行引擎内部接口一致性

**影响判断：**
这类改动短期对用户可见功能不强，但对执行引擎的 **可维护性、类型安全、后续性能优化空间** 很关键。

---

#### 2.3 执行环境 ExecEnv 相关重构持续进行
- PR: **#71299 [CLOSED] [Refactor] Add ExecEnv guardrails and context scaffolding**
- 链接: https://github.com/StarRocks/starrocks/pull/71299

- PR: **#71289 [CLOSED] [Refactor] Move RuntimeFilterProbeCollector::wait to ExecCore**
- 链接: https://github.com/StarRocks/starrocks/pull/71289

- PR: **#71288 [CLOSED] [Refactor] Remove from add_rf_event ExecEnv**
- 链接: https://github.com/StarRocks/starrocks/pull/71288

这些 PR 聚焦执行环境与 Runtime Filter 相关模块拆分，属于基础架构整治。  
虽然未直接引入新特性，但通常意味着：
- 更清晰的执行层边界
- 更低的全局依赖耦合
- 为后续并发执行、调试与模块化演进提供基础

---

## 3. 社区热点

### 3.1 Data Cache Prometheus 指标暴露需求仍在发酵
- Issue: **#55491 [CLOSED] Add exporting Data Cache metrics to prometheus /metrics endpoint on CN**
- 链接: https://github.com/StarRocks/starrocks/issues/55491
- PR: **#58204 [OPEN] [Feature] Cache hit rate prometheus**
- 链接: https://github.com/StarRocks/starrocks/pull/58204

虽然 Issue #55491 已关闭，带有 `X-stale` 标签，说明原始需求线程被归档，但其对应方向并未消失：PR #58204 仍处于打开状态，继续推动在 CN 标准 `/metrics` 端点暴露 Data Cache 指标。

**背后技术诉求：**
- 用户希望 Prometheus 可直接抓取 StarRocks 节点，无需 sidecar
- 需要更标准化的缓存命中率、容量、逐出等指标
- 反映生产环境对 **可观测性和运维成本** 的强需求

这是一个明确的路线图信号：**监控与可观测性能力仍是用户关注重点。**

---

### 3.2 Python SQLAlchemy / Superset 兼容性问题形成快速响应
- Issue: **#70733 [OPEN] TypeError: unhashable type: 'ReflectedPartitionInfo'**
- 链接: https://github.com/StarRocks/starrocks/issues/70733
- PR: **#71302 [OPEN] Make SQLAlchemy reflection dataclasses hashable**
- 链接: https://github.com/StarRocks/starrocks/pull/71302

该问题影响 Apache Superset 数据集创建，属于 BI 集成场景中的高感知缺陷。  
PR 已给出直接修复方案：为反射 dataclass 补足 hash 支持，以适配 SQLAlchemy reflection cache。

**背后技术诉求：**
- StarRocks 作为查询引擎，生态接入质量直接影响采用率
- 用户不仅关注 SQL 本身，也关注 ORM / BI / Python 工具链兼容性
- 这类问题往往优先级较高，因为会阻断平台接入

---

### 3.3 外部 Catalog 权限语义问题受到关注
- Issue: **#71211 [OPEN] GRANT fails for ALL VIEWS in Iceberg catalog (4.1rc1)**
- 链接: https://github.com/StarRocks/starrocks/issues/71211
- PR: **#71295 [OPEN] Fix GRANT on ALL VIEWS/MVs failing for external catalogs**
- 链接: https://github.com/StarRocks/starrocks/pull/71295

该问题出现在 Iceberg REST Catalog 场景下，`GRANT ALL ON ALL VIEWS IN DATABASE` 失败，而同类 TABLE 授权可以工作。  
这表明 StarRocks 在统一管理内部对象与外部 catalog 对象时，**权限对象解析路径尚不完全一致**。

**背后诉求：**
- 湖仓一体和外部目录接入越来越常见
- 用户需要内部库和外部 Catalog 在授权语义上行为一致
- 这类问题会直接影响企业级多租户/治理落地

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1. 权限安全缺陷：任意用户可 DROP TASK
- Issue: **#71294 [OPEN] DROP TASK has no privilege check — any user can delete any task including Pipe-internal tasks**
- 链接: https://github.com/StarRocks/starrocks/issues/71294

**严重性：高 / 安全与治理风险**  
问题描述指出 `DROP TASK` 缺少权限检查，理论上任何用户都可删除任意任务，甚至包含 Pipe 内部任务。  
这属于明显的 **权限边界缺失**，可能影响：
- 多租户环境下任务隔离
- 内部系统任务稳定性
- 审计与治理可信性

**当前状态：**
- 暂无对应 fix PR 出现
- 建议维护者尽快确认是否影响 4.1 及更低版本

---

### P1. 主键表部分更新可能导致 tablet 损坏
- PR: **#69652 [OPEN] [3.5] Fix PK tablet corruption in column-mode partial update**
- 链接: https://github.com/StarRocks/starrocks/pull/69652

虽然不是今日新报 Issue，但该 PR 今日仍活跃，且问题严重：  
列模式 partial update 可能引发 `PersistentIndex::erase()` 中 unsigned underflow，导致副本同时受影响，BE crash。

**风险：**
- 数据损坏风险高
- 影响主键表稳定性
- 若用户使用 column-mode partial update，应高度关注

**状态：**
- 已有修复 PR，尚未合并

---

### P2. 批量发布被错误事务图阻塞
- PR: **#71168 [OPEN] [BugFix] Fix batch publish blocked by incorrect transaction graph**
- 链接: https://github.com/StarRocks/starrocks/pull/71168

这是事务发布路径上的正确性问题。若 `TransactionGraph` 在节点移除后维护不正确，可能造成 publish 顺序判断错误，从而阻塞批量发布。  
对高吞吐导入或复杂事务发布场景影响较大。

**状态：**
- 已有修复 PR，覆盖 3.5 / 4.0 / 4.1

---

### P2. 外部 Catalog 中 ALL VIEWS / MV 授权失败
- Issue: **#71211 [OPEN] GRANT fails for ALL VIEWS in Iceberg catalog (4.1rc1)**
- 链接: https://github.com/StarRocks/starrocks/issues/71211
- PR: **#71295 [OPEN] Fix GRANT on ALL VIEWS/MVs failing for external catalogs**
- 链接: https://github.com/StarRocks/starrocks/pull/71295

**性质：SQL 权限兼容性缺陷**  
对使用 Iceberg 外部 catalog 的用户影响直接，尤其是自动化授权脚本与治理流程。

---

### P2. Python SQLAlchemy 方言导致 Superset 无法建数据集
- Issue: **#70733 [OPEN] TypeError: unhashable type: 'ReflectedPartitionInfo'**
- 链接: https://github.com/StarRocks/starrocks/issues/70733
- PR: **#71302 [OPEN] Make SQLAlchemy reflection dataclasses hashable**
- 链接: https://github.com/StarRocks/starrocks/pull/71302

**性质：生态兼容性阻断问题**  
不一定影响内核稳定性，但对接入 BI 平台是“开箱即用”级别问题。

---

### P3. 列名包含点号时统计收集失败
- Issue: **#70810 [OPEN] getQueryStatisticsColumnType throws SemanticException for columns with dots in their names**
- 链接: https://github.com/StarRocks/starrocks/issues/70810
- PR: **#71301 [OPEN] Fix statistics collection for columns with dots in names**
- 链接: https://github.com/StarRocks/starrocks/pull/71301

**性质：SQL 边界条件/兼容性问题**  
涉及合法列名如 ``customer.is_verified_email`` 被错误按路径表达式解析，导致 `SemanticException`。  
反映出 SQL 名称解析在统计子系统中存在硬编码假设。

---

### P3. ORC 列统计错位
- Issue: **#71222 [OPEN] AddFilesProcedure incorrectly retrieves metrics for ORC files**
- 链接: https://github.com/StarRocks/starrocks/issues/71222
- PR: **#71300 [CLOSED] Fix off-by-one in ORC column statistics extraction**
- 链接: https://github.com/StarRocks/starrocks/pull/71300

**性质：外部格式元数据解析缺陷**  
修复思路已明确，但需继续确认最终落地路径。

---

## 5. 功能请求与路线图信号

### 5.1 监控可观测性：Data Cache 指标进入标准 `/metrics`
- Issue: **#55491**
- 链接: https://github.com/StarRocks/starrocks/issues/55491
- PR: **#58204**
- 链接: https://github.com/StarRocks/starrocks/pull/58204

虽然原 Issue 被 stale 关闭，但 PR 持续存在，说明该需求并未消失。  
**判断：较可能在后续版本纳入**，因为其价值明确、用户收益高、运维侧诉求稳定。

---

### 5.2 统一 IVM 框架增强，覆盖 Iceberg 增量改写
- PR: **#71292 [OPEN] Add IvmRewriter and Iceberg scan/filter/project rules for unified IVM framework**
- 链接: https://github.com/StarRocks/starrocks/pull/71292

这是今天最值得关注的路线图信号之一。  
PR 引入 unified IVM framework 下的运行时 rewrite pipeline，并让简单 Iceberg MV 模式（scan + filter + project）由新的 Delta/Version operator rules 处理，替代 TVR。

**信号解读：**
- StarRocks 正持续推进 MV 增量维护框架统一化
- Iceberg 相关 MV 增量改写正在成为重点优化方向
- 湖仓场景下的查询重写/增量刷新能力会继续增强

---

### 5.3 跳过无意义 predicate column vacuum
- Issue: **#71291 [OPEN]**
- 链接: https://github.com/StarRocks/starrocks/issues/71291
- PR: **#71290 [OPEN]**
- 链接: https://github.com/StarRocks/starrocks/pull/71290

这是一个典型的“运维噪音控制”需求：当 TTL 为负或 usage 为空时，不再执行 predicate column vacuum。  
虽然属于 enhancement，但反映出用户希望系统在关闭相关功能后能够 **真正静默**，避免无意义审计日志和后台动作。

**判断：**
- 进入下一小版本的可能性较高
- 改动风险较低，收益直接

---

### 5.4 Hive 外表创建能力仍在推进但周期较长
- PR: **#42757 [OPEN] support create hive external table**
- 链接: https://github.com/StarRocks/starrocks/pull/42757

这是一个长期存在的 Feature PR，目标是支持创建 Hive external table。  
从方向看，与外部元数据系统深度集成高度一致，但由于存在时间较长，说明该特性的设计或兼容性复杂度不低。

---

## 6. 用户反馈摘要

### 6.1 BI/生态接入用户关注“能否直接工作”
- Issue: **#70733**
- 链接: https://github.com/StarRocks/starrocks/issues/70733

用户场景非常明确：`starrocks` Python package + SQLAlchemy dialect + Superset。  
痛点不是性能，而是 **连接后无法正常完成 dataset creation**。  
这说明在 StarRocks 的推广链路中，**BI 工具即插即用体验** 已成为重要评价指标。

---

### 6.2 湖仓用户希望权限模型与内部库一致
- Issue: **#71211**
- 链接: https://github.com/StarRocks/starrocks/issues/71211

用户使用 Lakekeeper + Iceberg REST Catalog，希望 `GRANT ALL ON ALL VIEWS` 在外部 catalog 上与内部 catalog 行为一致。  
真实痛点是：外部 catalog 已进入生产治理路径，用户不再把它当“附属功能”，而是要求 **一等公民级别的权限一致性**。

---

### 6.3 运维用户对“日志噪音”和无效后台任务敏感
- Issue: **#71291**
- 链接: https://github.com/StarRocks/starrocks/issues/71291

用户明确提到已关闭 predicate column collection，且清空了相关表，但 vacuum 仍持续运行并产生日志。  
这类反馈说明：
- 用户在生产环境中对后台行为非常敏感
- 除功能正确外，**静默性、可预期性、审计清晰度** 同样重要

---

### 6.4 外部格式接入用户依赖元数据统计正确性
- Issue: **#71222**
- 链接: https://github.com/StarRocks/starrocks/issues/71222

ORC 指标错位说明用户已经在依赖导入/统计元数据做分析或运维判断。  
即使问题表面上只是 off-by-one，本质上反映的是用户对 **跨格式接入精确性** 的要求越来越高。

---

## 7. 待处理积压

### 7.1 老牌监控能力 PR 仍未合并
- PR: **#58204 [OPEN] Cache hit rate prometheus**
- 链接: https://github.com/StarRocks/starrocks/pull/58204

该 PR 创建于 2025-04-20，至今仍打开。  
建议维护者重新评估其设计是否可拆分，以便尽快交付最核心的 `/metrics` 能力。

---

### 7.2 Hive external table 功能 PR 长期悬而未决
- PR: **#42757 [OPEN] support create hive external table**
- 链接: https://github.com/StarRocks/starrocks/pull/42757

创建于 2024-03-18，已是长期积压项。  
若该能力仍符合路线图，建议：
- 明确设计阻塞点
- 标注版本计划
- 视情况拆分为更易审阅的小 PR

---

### 7.3 主键表损坏修复应尽快确认发布计划
- PR: **#69652 [OPEN] Fix PK tablet corruption in column-mode partial update**
- 链接: https://github.com/StarRocks/starrocks/pull/69652

这是最值得优先关注的积压项之一。  
由于涉及主键表损坏与 BE crash，建议维护者尽快：
- 确认回归测试结果
- 明确是否需要 backport
- 向社区同步影响版本范围

---

### 7.4 文档索引与 LLM 友好化改造值得持续推进
- PR: **#71117 [OPEN] split metrics doc into multiple pages to improve indexing**
- 链接: https://github.com/StarRocks/starrocks/pull/71117
- PR: **#71297 [OPEN] Generate llms.txt**
- 链接: https://github.com/StarRocks/starrocks/pull/71297

这两项虽然不是内核问题，但对知识可达性和开发者体验影响很大。  
特别是 `llms.txt` 与 metrics 文档拆分，体现出项目开始重视 **机器可读文档与搜索索引质量**。

---

## 8. 总结判断

今天的 StarRocks 动态显示出一个比较清晰的特征：  
一方面，项目正在密集处理 **边界条件 bug、生态兼容性问题、外部 catalog 权限一致性**；另一方面，也在推进执行引擎与列接口的底层重构，为后续性能和可维护性做准备。  
从路线图信号看，**Iceberg/外部表生态、统一 IVM 框架、Prometheus 可观测性** 依然是中短期重点。  
短期最需要维护者优先关注的风险项是：
1. `DROP TASK` 权限检查缺失  
2. PK 表 partial update 导致损坏  
3. batch publish 的事务图错误  
4. 外部 catalog 授权一致性问题  

如果你愿意，我还可以继续把这份日报整理成更适合发布的 **Markdown 周报模板**，或者进一步生成一版 **“面向管理层的摘要版”**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-04-05）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 共发生 **27 条动态**：**Issues 8 条、PR 19 条**，整体活跃度维持在**中高水平**。  
当天**无新版本发布**，但代码与设计层面的讨论仍然集中在 **Spark/Flink 兼容性、AWS/Glue 稳定性、REST/OpenAPI 扩展、Variant 类型能力** 等方向。  
从关闭项来看，今日关闭/清理的内容里有不少带 `stale` 标签，说明项目在持续做积压治理；与此同时，新近活跃 PR 多聚焦于**生产稳定性修复**与**跨引擎能力补齐**。  
总体判断：项目健康度良好，**功能演进与维护并行**，但部分高价值设计类 PR 与旧提案仍存在较长周期未落地的情况。

---

## 2. 项目进展

### 今日已关闭/结束的 PR

#### 2.1 Spark/Flink 对 Avro local-timestamp 逻辑类型支持的两个 PR 被关闭
- **PR #15455** `[CLOSED] Spark: Support reading Avro local-timestamp-* logical types`  
  链接: https://github.com/apache/iceberg/pull/15455
- **PR #15454** `[CLOSED] Flink: Support reading Avro local-timestamp-* logical types`  
  链接: https://github.com/apache/iceberg/pull/15454

这两个 PR 原本分别为 Spark 与 Flink Reader 增加对 `local-timestamp-millis/micros(/nanos)` 的读取支持，但今日被关闭且带 `stale`。  
**意义**：虽然未合入，但它们反映出社区对 **Avro 时间语义与 Iceberg 引擎侧类型映射一致性** 的明确需求。  
**影响判断**：短期内，Spark/Flink 用户在处理 Avro 本地时间戳逻辑类型时，仍可能需要自行规避或做预转换。

#### 2.2 TCK 基础类型覆盖增强尝试被关闭
- **PR #15435** `[CLOSED] Add primitive tests on the TCK`  
  链接: https://github.com/apache/iceberg/pull/15435

该 PR 为 TCK 增加更多 primitive type round-trip 测试，也于今日关闭。  
**意义**：这说明社区已意识到 **跨实现一致性验证** 的测试覆盖仍需加强。  
**影响判断**：虽然当前未合并，但它是 Iceberg 规范化生态继续成熟的重要信号，后续可能以其它形式回归。

#### 2.3 Secondary Index 元数据 POC 被关闭
- **PR #15101** `[CLOSED] Secondary Index metadata handling POC implementation`  
  链接: https://github.com/apache/iceberg/pull/15101

这是一个二级索引元数据处理的概念验证实现。  
**意义**：二级索引仍是 Iceberg 生态中的高关注方向，但从 POC 被关闭看，设计与规范层面显然尚未达成共识。  
**路线图含义**：短期内不太像会快速进入稳定版本，但其背后“改善点查/过滤性能”的诉求仍然强烈。

---

### 今日值得关注的活跃 PR

#### 2.4 AWS/Glue 稳定性修复持续推进
- **PR #15530** `[OPEN] Glue: Check commit status on non-deterministic AWS errors`  
  链接: https://github.com/apache/iceberg/pull/15530

该 PR 针对 Glue 提交过程中出现 `OperationTimeoutException` 等**非确定性 AWS 错误**时的提交状态判定问题，避免误删实际上已经成功提交的 metadata 文件，属于**高价值稳定性修复**。  
**技术价值**：直接关系到表元数据一致性，若修复落地，将显著降低 AWS 环境下的“提交成功但元数据被误删”风险。

#### 2.5 锁管理器共享调度器关闭问题修复
- **PR #15862** `[OPEN] Core: Fix shared LockManagers scheduler shutdown`  
  链接: https://github.com/apache/iceberg/pull/15862

修复多个内存锁管理器共享 scheduler 时，一个实例关闭导致共享 scheduler 被提前关闭的问题。  
**技术价值**：这是典型的**并发与生命周期管理缺陷修复**，有助于提升多实例环境下的可靠性。

#### 2.6 Spark 表属性从 Core 向 Spark 模块迁移
- **PR #15875** `[OPEN] Core, Spark: Migrate Spark table properties to Spark module`  
  链接: https://github.com/apache/iceberg/pull/15875

该 PR 将 Spark 专属表属性从 `core.TableProperties` 中迁出，落到各 Spark 版本模块。  
**技术价值**：属于**模块边界梳理和 API 清理**，对后续维护、依赖解耦和版本治理都有正面作用。  
**潜在影响**：未来升级时，依赖这些常量的外部代码可能需要适配新的类路径。

#### 2.7 Flink watermark 修正
- **PR #15884** `[OPEN] Flink: Fix watermark value which should be min timestamp minus one`  
  链接: https://github.com/apache/iceberg/pull/15884

这是一个直接面向 **Flink 流式语义正确性** 的修复。  
**技术价值**：watermark 计算错误可能影响乱序处理、窗口触发与流式结果正确性，因此该 PR 优先级较高。

#### 2.8 Kafka Connect 增强 Variant 支持
- **PR #15283** `[OPEN] Kafka Connect: Support VARIANT when record convert`  
  链接: https://github.com/apache/iceberg/pull/15283

该 PR 让 Kafka Connect 在 RecordConverter 中支持将复杂 Java 对象映射为 Iceberg `VARIANT`。  
**技术价值**：有利于半结构化数据摄入，是 Iceberg 扩展到更灵活事件流/JSON 风格负载的重要一步。

#### 2.9 Spark 写入 shredded variant 持续推进
- **PR #14297** `[OPEN] Spark: Support writing shredded variant in Iceberg-Spark`  
  链接: https://github.com/apache/iceberg/pull/14297

该 PR 为 Spark 增加 shredded variant 写入支持。  
**技术价值**：与 `VARIANT` 生态方向高度一致，说明 Iceberg 正逐步增强对**复杂半结构化数据的原生支持**。

---

## 3. 社区热点

### 3.1 最活跃 Issue：Spark 内存泄漏问题
- **Issue #13297** `[CLOSED] Spark: Doing a Coalesce and foreachpartitions in spark directly on an iceberg table is leaking memory heavy iterators`  
  链接: https://github.com/apache/iceberg/issues/13297  
  评论数: **31**

这是今日评论最多的条目。问题描述指出在 Spark 直接读取 Iceberg 表后执行 `coalesce(...).foreachPartition(...)` 会出现**heavy iterators 内存泄漏**。  
虽然该 Issue 今日被关闭且标记为 `stale`，但从讨论热度看，它背后涉及的是 **Iceberg + Spark 执行链路中的 iterator 生命周期、资源释放与长任务内存占用**。  
**技术诉求**：用户需要在大规模批处理场景中获得更稳定的 Spark 读取行为，尤其是自定义 foreach/partition 处理时的资源可控性。

### 3.2 仍在开放的容器日志噪声问题
- **Issue #14227** `[OPEN] INFO logs are getting flooded in iceberg-rest-fixture image`  
  链接: https://github.com/apache/iceberg/issues/14227  
  评论数: **7**

该问题反映 `iceberg-rest-fixture` 镜像在 postgres backing store 场景下 INFO 日志过量。  
**技术诉求**：测试/集成环境需要更可控的日志级别，否则会降低排障效率、增加日志成本。  
这类问题通常不是核心 correctness bug，但对**开发体验和 CI 可观测性**影响明显。

### 3.3 长线热点：物化视图规范提案持续活跃
- **PR #11041** `[OPEN] Materialized View Spec`  
  链接: https://github.com/apache/iceberg/pull/11041

虽然不是当天新建，但仍在更新，说明 **Materialized View（物化视图）规范** 依旧是社区长期关注议题。  
**技术诉求**：用户希望 Iceberg 不只提供表格式与存储抽象，也能承载更高层的分析语义资产管理。

---

## 4. Bug 与稳定性

以下按影响面与潜在严重程度排序：

### P1. Glue 提交状态误判可能导致元数据损坏风险
- **PR #15530** `[OPEN] Glue: Check commit status on non-deterministic AWS errors`  
  链接: https://github.com/apache/iceberg/pull/15530

这是今天最值得关注的稳定性项。若在 AWS 非确定性错误下错误判断提交失败并删除 metadata 文件，而 Glue 实际已提交成功，就会造成**表引用指向不存在的元数据文件**。  
**状态**：已有 fix PR，待合并。  
**结论**：对 AWS Glue 用户属于高优先级关注项。

### P1. Flink watermark 计算错误影响流式正确性
- **PR #15884** `[OPEN] Flink: Fix watermark value which should be min timestamp minus one`  
  链接: https://github.com/apache/iceberg/pull/15884

这属于**流计算语义正确性问题**，可能影响事件时间处理和窗口计算结果。  
**状态**：已有 fix PR，待合并。

### P1. LockManager 共享 scheduler 关闭缺陷
- **PR #15862** `[OPEN] Core: Fix shared LockManagers scheduler shutdown`  
  链接: https://github.com/apache/iceberg/pull/15862

并发环境下，一个 manager close 导致共享 scheduler 过早停掉，会影响其它仍在线实例。  
**状态**：已有 fix PR，待合并。  
**影响场景**：多会话、测试框架、嵌入式使用方式更容易暴露。

### P2. 删除最高 field ID 列时 schema update 失败
- **Issue #13850** `[CLOSED] Schema update fails when dropping column with highest field ID`  
  链接: https://github.com/apache/iceberg/issues/13850

该问题描述的是升级到 1.9.2 后，删除具有最高 field ID 的列会抛异常。  
**状态**：今日关闭，但未见对应修复 PR 出现在本批数据中，更像是 stale 关闭。  
**结论**：若用户仍在 1.9.x 附近版本并执行复杂 schema evolution，建议自行回归验证。

### P2. Spark 读取 Iceberg 表后 foreachPartition 内存泄漏
- **Issue #13297** `[CLOSED]`  
  链接: https://github.com/apache/iceberg/issues/13297

虽然已关闭，但因为讨论多、影响面可能大，仍值得关注。  
**状态**：未见今日关联 fix PR。  
**结论**：批处理与长迭代任务用户需注意内存压力测试。

### P3. REST fixture 镜像 INFO 日志泛滥
- **Issue #14227** `[OPEN]`  
  链接: https://github.com/apache/iceberg/issues/14227

属于可观测性/可运维性问题。  
**状态**：暂无 fix PR 出现在今日数据中。

### P3. RemoveDanglingDeleteFiles 不支持 branch 且跳过非分区表
- **Issue #15369** `[OPEN]`  
  链接: https://github.com/apache/iceberg/issues/15369

该问题指出 `RemoveDanglingDeleteFiles`：
1. 仅对 main branch 生效；
2. 非分区表被静默跳过。  

这会让维护动作在多分支与部分表类型场景下行为不一致。  
**状态**：暂无 fix PR 出现在今日数据中。  
**影响**：偏运维与数据整理场景，但对使用 branch 的团队较关键。

---

## 5. 功能请求与路线图信号

### 5.1 Changelog `net_changes` 视图优化
- **Issue #14249** `[OPEN] Feature: Optimize net_changes changelog view by leveraging Identifier columns`  
  链接: https://github.com/apache/iceberg/issues/14249

用户希望在 `create_changelog_view(net_changes=true)` 时，不必对所有列做 repartition/sort，而是尽量利用 identifier columns。  
**路线图信号**：这是典型的**查询性能与变更视图优化**需求，若 Iceberg 继续强化 CDC/审计分析能力，这类优化很可能进入后续版本考虑。

### 5.2 Flink 支持自定义 snapshot metadata
- **Issue #14160** `[OPEN] support customized snapshot metadata via snapshot-property for flink`  
  链接: https://github.com/apache/iceberg/issues/14160

诉求是让 Flink 具备类似 Spark 的自定义 snapshot metadata 能力。  
**路线图信号**：这是**跨引擎能力对齐**需求，通常较容易被接受，特别是当 Spark 已有类似特性时。

### 5.3 v3 类型提升：date -> time
- **Issue #14265** `[OPEN] Allow for v3 date -> time promotion`  
  链接: https://github.com/apache/iceberg/issues/14265

该需求指向 Iceberg v3 类型演进能力。  
**路线图信号**：属于**规范层语义扩展**，是否纳入下一版本取决于规范一致性和实现复杂度，但价值明确。

### 5.4 半结构化数据能力明显升温：Variant 成为关键主题
相关 PR：
- **PR #14297** Spark 写 shredded variant  
  https://github.com/apache/iceberg/pull/14297
- **PR #15283** Kafka Connect 支持 VARIANT  
  https://github.com/apache/iceberg/pull/15283

**判断**：`VARIANT` 正在从单点能力演进为跨模块、跨入口的体系化支持方向。  
若这些 PR 后续推进顺利，Iceberg 下一阶段很可能进一步加强对**JSON/嵌套对象/半结构化摄入与查询**的支持。

### 5.5 REST Catalog 能力继续扩展
- **PR #15280** `[OPEN] REST Spec: support credential refresh on staged tables`  
  链接: https://github.com/apache/iceberg/pull/15280

这是面向 REST Catalog/OpenAPI 的协议增强。  
**判断**：REST Catalog 仍是 Iceberg 生态的核心战略方向之一，协议能力扩展预计会持续进入后续版本。

---

## 6. 用户反馈摘要

结合今日活跃 Issues/PR，可提炼出几类真实用户痛点：

### 6.1 生产稳定性优先于新功能
AWS/Glue 提交异常、锁管理器生命周期问题、Flink watermark 正确性等，都说明用户最关心的仍是**提交可靠性、流式语义正确性、并发安全**。  
相关链接：
- PR #15530: https://github.com/apache/iceberg/pull/15530
- PR #15862: https://github.com/apache/iceberg/pull/15862
- PR #15884: https://github.com/apache/iceberg/pull/15884

### 6.2 跨引擎体验不一致仍是痛点
Flink 想补齐 Spark 的 snapshot metadata，Avro local-timestamp 读取支持也分别在 Spark/Flink 发起过 PR。  
这说明用户期待 Iceberg 在不同计算引擎中的能力更加一致。  
相关链接：
- Issue #14160: https://github.com/apache/iceberg/issues/14160
- PR #15454: https://github.com/apache/iceberg/pull/15454
- PR #15455: https://github.com/apache/iceberg/pull/15455

### 6.3 半结构化数据场景需求上升
Kafka Connect 到 Spark 写入侧都在推进 Variant。  
这反映 Iceberg 用户不仅处理经典数仓表，也越来越多地承接**事件流、对象嵌套结构、动态 schema** 数据。  
相关链接：
- PR #15283: https://github.com/apache/iceberg/pull/15283
- PR #14297: https://github.com/apache/iceberg/pull/14297

### 6.4 运维可观测性诉求增强
REST fixture 日志过多、ExpireSnapshots 希望增加可选文件级日志等，表明用户希望在维护动作与测试环境中拥有更好的**可解释性**。  
相关链接：
- Issue #14227: https://github.com/apache/iceberg/issues/14227
- PR #14354: https://github.com/apache/iceberg/pull/14354

---

## 7. 待处理积压

以下是值得维护者重点关注的长期或高价值积压项：

### 7.1 Materialized View Spec 长期未落地
- **PR #11041** `[OPEN] Materialized View Spec`  
  链接: https://github.com/apache/iceberg/pull/11041

这是高战略价值规范提案，但已持续很长时间。  
**建议**：若短期无法完整推进，至少应明确剩余争议点与里程碑，避免社区预期不清。

### 7.2 Spark shredded variant 写入支持推进周期较长
- **PR #14297** `[OPEN]`  
  链接: https://github.com/apache/iceberg/pull/14297

该 PR 对 Variant 生态有重要意义，但已开放较长时间。  
**建议**：尽快明确设计边界、兼容性要求与 reviewer 路径。

### 7.3 Spark 4.0 RewriteTablePath 多前缀支持
- **PR #14355** `[OPEN]`  
  链接: https://github.com/apache/iceberg/pull/14355

面向复杂迁移场景，有实际运维价值，但长期未决。  
**建议**：评估是否拆小提交，以便更快落地核心能力。

### 7.4 ExpireSnapshots 可选日志增强
- **PR #14354** `[OPEN]`  
  链接: https://github.com/apache/iceberg/pull/14354

与生产事故排查直接相关。  
**建议**：这类 observability 增强通常投入小、收益高，适合优先处理。

### 7.5 向量化 Parquet Reader 的 page skipping
- **PR #15211** `[OPEN] support page skipping when using vectorized Parquet reader`  
  链接: https://github.com/apache/iceberg/pull/15211

这是较有潜力的**读取性能优化**项。  
**建议**：若实现成熟，可能对大范围过滤场景带来明显收益，值得推进 benchmark 与设计审查。

---

## 8. 结论

2026-04-05 的 Apache Iceberg 项目动态显示出一个典型的成熟开源基础设施项目特征：  
一方面，社区持续处理 **AWS/Glue 提交一致性、Flink watermark、锁管理器并发安全** 等生产级问题；另一方面，也在推进 **VARIANT、REST Catalog、物化视图规范、性能优化** 等中长期方向。  

今日没有新版本，但从活跃 PR 看，接下来的版本重点很可能仍围绕：
- **稳定性修复**
- **跨引擎语义对齐**
- **半结构化数据支持**
- **REST/OpenAPI 协议增强**

整体健康度判断：**稳健积极**，但若想进一步提升交付效率，仍需加快对若干高价值长期 PR/Spec 的决策与收敛。

--- 

如需，我也可以把这份日报进一步整理成：
1. **适合飞书/Slack 发布的简版摘要**  
2. **适合周报汇总的趋势版**  
3. **按 Spark/Flink/AWS/REST 四条主线重组的专题版**

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-04-05）

## 1. 今日速览
过去 24 小时内，Delta Lake 仓库整体活跃度 **中等偏上**：无 Issue 更新，但有 **10 条 PR 动态**，其中 **7 条仍在开放中，3 条已关闭**。  
从 PR 内容看，当前开发重点主要集中在 **Delta Kernel / DSv2 建表路径演进、Spark 类型兼容性修复、Sharing 与 Variant 能力扩展、以及数据跳过相关代码整理**。  
今日没有新版本发布，说明项目仍处于以 **功能迭代和实现细化** 为主的阶段，而非对外发布节奏。  
由于没有新增 Issue，当前外部用户反馈面较安静，但从 PR 方向判断，团队仍在持续推进 **规范一致性、SQL/类型系统兼容性和跨引擎读写能力**。

---

## 2. 项目进展

### 已关闭 / 合并的重要 PR

#### 1) [#6463 [KERNEL] Fixes for geometry and geography type in 3.3.1](https://github.com/delta-io/delta/pull/6463)
- 状态：**CLOSED**
- 作者：@uros-db
- 方向：**Delta Kernel 类型系统修复**
- 进展解读：
  - 该 PR 聚焦于 **geometry / geography 类型** 的修复，说明 Delta Kernel 在地理空间相关数据类型支持上仍在持续完善。
  - 这类修复通常直接影响：
    - 跨引擎读取地理空间列时的正确性
    - 类型序列化 / 反序列化兼容
    - 与规范版本 3.3.1 的一致性
- 影响：
  - 对依赖空间类型的分析场景、GIS 数据交换、以及多引擎消费 Delta 表的用户具有较高价值。
  - 虽然状态为 closed，未明确标注 merged，但从内容看它反映出 **Kernel 正在补齐高级类型能力**。

#### 2) [#6479 Use MD5 fileIdHash for priming getBatch when both offsets are from legacy checkpoint](https://github.com/delta-io/delta/pull/6479)
- 状态：**CLOSED**
- 作者：@littlegrasscao
- 方向：**流式 / checkpoint 兼容性与批次初始化逻辑**
- 进展解读：
  - PR 关注 `legacy checkpoint` 场景下 `getBatch` 的 priming 行为，并引入 `MD5 fileIdHash`。
  - 这表明维护者在处理 **老 checkpoint 与当前处理链路之间的兼容问题**，尤其是偏移恢复和流式读取初始化。
- 影响：
  - 若该问题存在于生产场景，可能关系到：
    - Structured Streaming 恢复正确性
    - 历史 checkpoint 升级后的可读性
    - 批次边界识别稳定性
  - 即使本次为 closed，也释放出一个信号：**旧格式兼容与流式状态恢复仍是活跃维护主题**。

#### 3) [#6487 Add io.delta.internal.* MiMa exclusion](https://github.com/delta-io/delta/pull/6487)
- 状态：**CLOSED**
- 作者：@yili-db
- 方向：**二进制兼容性治理 / 构建体系**
- 进展解读：
  - 添加 `io.delta.internal.*` 的 MiMa exclusion，属于典型的 **内部 API 二进制兼容性噪音治理**。
  - 说明项目在持续清理 ABI 检查中的非用户可见项，使兼容性检查更聚焦对外 API。
- 影响：
  - 有助于降低无意义兼容性告警，提升 CI 稳定性和发布前验证效率。
  - 对最终用户几乎无直接功能变化，但对项目工程健康度是正向信号。

---

## 3. 社区热点

> 注：给定数据中未提供评论数与点赞数的有效值（均为 undefined 或 0），因此“热点”主要依据 **技术重要性、更新时效性和影响面** 判断。

### 热点 1：Variant + Sharing 兼容能力扩展
#### [#6492 [VARIANT][SHARING] allow reading `variantShredding` table feature in sharing](https://github.com/delta-io/delta/pull/6492)
- 状态：OPEN
- 技术诉求：
  - 目标是允许在 **Delta Sharing** 场景下读取启用了 `variantShredding` 表特性的表。
- 背后信号：
  - Delta 正在把 **Variant/半结构化数据能力** 向共享协议与跨系统消费能力延伸。
  - 这反映出用户不只要求在 Spark 内部读写 Variant，也希望通过 **共享接口对外暴露复杂数据模型**。
- 意义：
  - 若落地，将提升 Delta Sharing 在现代数据产品场景中的适用性，尤其是 JSON/半结构化分析分发。

### 热点 2：DSv2 建表路径持续打通
#### [#6449 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6449)
#### [#6450 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6450)
- 状态：OPEN
- 技术诉求：
  - 两个 PR 明显属于同一条堆叠开发线，围绕 **CreateTableBuilder、V2Mode 路由、DeltaCatalog.createTable() 接入 DSv2 + Kernel 路径**。
- 背后信号：
  - 这是非常明确的架构演进方向：  
    **Spark DataSource V2 建表语义 + Delta Kernel 后端能力统一**。
- 意义：
  - 有望改善：
    - 建表接口一致性
    - Catalog 层与底层提交逻辑解耦
    - 跨引擎/跨运行时的统一实现基础
  - 这是今天最值得关注的“路线图级”工作流。

### 热点 3：Spark 十进制类型兼容性修复
#### [#6491 [SPARK] Fix byte and short decimal coercion](https://github.com/delta-io/delta/pull/6491)
- 状态：OPEN
- 技术诉求：
  - 修复 `byte` 和 `short` 到 decimal 的 coercion 问题。
- 背后信号：
  - 这是典型的 **SQL 类型推断/隐式转换正确性问题**，通常影响：
    - 表达式求值
    - 写入 schema 对齐
    - 兼容 Spark 既有行为
- 意义：
  - 类型 coercion 问题看似细节，但往往会在 ETL、MERGE、INSERT、CAST 场景中放大，属于值得优先关注的正确性修复。

### 热点 4：Kernel 规范一致性补齐
#### [#6461 [Kernel] added writeStatsAsStruct, writeStatsAsJson to comply with spec](https://github.com/delta-io/delta/pull/6461)
- 状态：OPEN
- 技术诉求：
  - 增加 `writeStatsAsStruct` 和 `writeStatsAsJson`，以符合规范要求。
- 背后信号：
  - 说明 Delta Kernel 正在进一步对齐 **统计信息写出规范**。
- 意义：
  - 统计信息格式直接影响：
    - 数据跳过
    - 文件裁剪
    - 查询计划优化
    - 不同实现之间的互操作性

---

## 4. Bug 与稳定性

> 今日无新增 Issue，因此以下问题主要来自 PR 所暴露的修复方向。按潜在影响程度排序。

### 高优先级：SQL / 类型正确性问题
#### [#6491 [SPARK] Fix byte and short decimal coercion](https://github.com/delta-io/delta/pull/6491)
- 类型：**查询正确性 / 类型系统兼容**
- 严重性：**高**
- 原因：
  - decimal coercion 错误可能导致表达式结果错误、写入失败，或 Spark/Delta 行为不一致。
- 修复状态：**已有 fix PR，待合并**

### 中高优先级：流式恢复与 legacy checkpoint 兼容
#### [#6479 Use MD5 fileIdHash for priming getBatch when both offsets are from legacy checkpoint](https://github.com/delta-io/delta/pull/6479)
- 类型：**流式稳定性 / checkpoint 兼容**
- 严重性：**中高**
- 原因：
  - 影响历史 checkpoint 恢复与批次定位，潜在影响流任务连续性。
- 修复状态：**相关 PR 已关闭**  
  - 仅从给定数据无法判断是已合并、放弃还是被其他 PR 替代，建议维护者后续明确处理结果。

### 中优先级：高级数据类型兼容性
#### [#6463 [KERNEL] Fixes for geometry and geography type in 3.3.1](https://github.com/delta-io/delta/pull/6463)
- 类型：**类型兼容 / Kernel 规范一致性**
- 严重性：**中**
- 原因：
  - geometry/geography 属于专业类型，但在相关场景中错误会直接影响读写成功率和数据解释正确性。
- 修复状态：**相关 PR 已关闭**

### 中优先级：统计信息规范不一致
#### [#6461 [Kernel] added writeStatsAsStruct, writeStatsAsJson to comply with spec](https://github.com/delta-io/delta/pull/6461)
- 类型：**规范一致性 / 优化元数据完整性**
- 严重性：**中**
- 原因：
  - 若统计信息写出与规范不一致，可能削弱数据跳过和跨实现兼容。
- 修复状态：**已有 fix PR，待合并**

---

## 5. 功能请求与路线图信号

### 1) Delta Sharing 对 Variant 表能力增强
#### [#6492](https://github.com/delta-io/delta/pull/6492)
- 信号强度：**高**
- 说明：
  - 该 PR 不是单纯重构，而是明显的 **功能扩展**。
  - 表明 Delta 未来版本很可能继续强化：
    - Variant 数据类型支持
    - Sharing 协议下的特性可见性
    - 半结构化数据跨系统分发

### 2) DSv2 + Kernel 统一建表路径
#### [#6449](https://github.com/delta-io/delta/pull/6449)
#### [#6450](https://github.com/delta-io/delta/pull/6450)
- 信号强度：**很高**
- 说明：
  - 这是今天最明确的架构路线图之一。
  - 一旦完成，意味着 Delta 正在推动：
    - `DeltaCatalog.createTable()` 向 DSv2 语义迁移
    - Kernel 在建表/提交路径中的角色增强
    - Spark Catalog 与 Delta 内核层统一
- 可能纳入下一版本的原因：
  - 该工作具有基础设施性质，且已有集成测试配套，成熟度较高。

### 3) 元数据统计规范化
#### [#6461](https://github.com/delta-io/delta/pull/6461)
- 信号强度：**中高**
- 说明：
  - `writeStatsAsStruct` / `writeStatsAsJson` 的加入说明 Delta 在持续落实 protocol/spec。
  - 这类变更通常会优先纳入近期版本，因为它影响互操作性与优化能力。

### 4) 数据跳过模块工程化整理
#### [#6490 Extract DataFiltersBuilder from DataSkippingReader to standalone file](https://github.com/delta-io/delta/pull/6490)
- 信号强度：**中**
- 说明：
  - 这是重构型 PR，本身不是新功能，但通常是后续功能演进前的铺垫。
  - 暗示维护者可能会继续增强：
    - Data skipping 规则可维护性
    - 过滤条件构造逻辑复用
    - 查询裁剪优化模块扩展

---

## 6. 用户反馈摘要

由于今日 **没有 Issue 更新**，且所给 PR 数据中无可用评论统计，用户反馈侧信息较少。  
不过从 PR 主题可以推断出近期真实用户痛点主要集中在以下几类：

1. **Spark SQL 类型兼容与正确性**
   - 代表 PR：[#6491](https://github.com/delta-io/delta/pull/6491)
   - 用户场景：
     - 数据写入时的 schema 对齐
     - decimal 表达式计算
     - 与 Spark 原生行为保持一致

2. **跨引擎 / 共享读取能力**
   - 代表 PR：[#6492](https://github.com/delta-io/delta/pull/6492)
   - 用户场景：
     - 通过 Delta Sharing 暴露更复杂的数据模型
     - 半结构化字段对外共享
     - 消费端不希望因为表特性升级而失去可读性

3. **流式与历史兼容**
   - 代表 PR：[#6479](https://github.com/delta-io/delta/pull/6479)
   - 用户场景：
     - 旧 checkpoint 平滑升级
     - 长周期流任务恢复
     - 避免因元数据格式演化影响生产任务稳定性

4. **规范一致性与高级类型支持**
   - 代表 PR：[#6461](https://github.com/delta-io/delta/pull/6461)、[#6463](https://github.com/delta-io/delta/pull/6463)
   - 用户场景：
     - 多语言/多引擎实现互通
     - 空间类型、统计元数据等高级特性可用性

---

## 7. 待处理积压

### 重点关注的开放 PR

#### 1) [#6449 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6449)
- 创建于 2026-03-31，仍处于开放状态
- 原因：
  - 属于基础架构演进链路的一部分，影响面大，建议维护者持续推进审查。
- 风险：
  - 堆叠 PR 若长期悬而未决，容易造成后续 PR 基线漂移、冲突增多。

#### 2) [#6450 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6450)
- 创建于 2026-03-31，仍处于开放状态
- 原因：
  - 直接涉及 `DeltaCatalog.createTable()` 路径，属于核心建表逻辑，优先级较高。
- 风险：
  - 若评审周期拉长，可能延缓 DSv2/Kernal 统一路线。

#### 3) [#6461 [Kernel] added writeStatsAsStruct, writeStatsAsJson to comply with spec](https://github.com/delta-io/delta/pull/6461)
- 创建于 2026-04-01，仍处于开放状态
- 原因：
  - 与规范对齐相关，建议尽快明确是否纳入近期发布窗口。

#### 4) [#6492 [VARIANT][SHARING] allow reading `variantShredding` table feature in sharing](https://github.com/delta-io/delta/pull/6492)
- 新开但重要
- 原因：
  - 该方向具备明显产品价值，建议尽早评估协议兼容性和向后兼容影响。

#### 5) [#6489 tests](https://github.com/delta-io/delta/pull/6489)
- 标题信息不足，意图不清晰
- 原因：
  - 从标题无法判断技术范围，建议维护者要求补充上下文或规范命名，降低评审成本。

---

## 8. 项目健康度评估

- **活跃度**：中等偏上。虽然没有 Issue 活动，但 PR 更新量充足，开发节奏正常。
- **稳定性治理**：较好。今日多条 PR 指向 **类型修复、规范对齐、兼容性处理**，说明项目在关注质量细节。
- **架构演进**：积极。DSv2 + Kernel 路径统一是明显的长期主线。
- **生态扩展**：向好。Variant + Sharing、geometry/geography 支持等表明 Delta 正在增强复杂类型与跨系统能力。
- **风险点**：部分 closed PR 未明确合并语义，且核心堆叠 PR 仍在开放，建议后续关注评审与落地进度。

---

### 附：今日关注链接汇总
- [#6492 [VARIANT][SHARING] allow reading `variantShredding` table feature in sharing](https://github.com/delta-io/delta/pull/6492)
- [#6449 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6449)
- [#6450 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6450)
- [#6461 [Kernel] added writeStatsAsStruct, writeStatsAsJson to comply with spec](https://github.com/delta-io/delta/pull/6461)
- [#6491 [SPARK] Fix byte and short decimal coercion](https://github.com/delta-io/delta/pull/6491)
- [#6479 Use MD5 fileIdHash for priming getBatch when both offsets are from legacy checkpoint](https://github.com/delta-io/delta/pull/6479)
- [#6463 [KERNEL] Fixes for geometry and geography type in 3.3.1](https://github.com/delta-io/delta/pull/6463)
- [#6487 Add io.delta.internal.* MiMa exclusion](https://github.com/delta-io/delta/pull/6487)
- [#6490 Extract DataFiltersBuilder from DataSkippingReader to standalone file](https://github.com/delta-io/delta/pull/6490)
- [#6489 tests](https://github.com/delta-io/delta/pull/6489)

如果你愿意，我还可以继续把这份日报整理成更适合团队同步的 **Markdown 周报模板** 或 **高管摘要版（TL;DR）**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-04-05）

## 1. 今日速览

过去 24 小时内，Databend GitHub 活跃度中等偏上：**无 Issue 更新**，但 **PR 有 7 条更新**，其中 **6 条待合并、1 条关闭**。整体看，今天的开发重心明显集中在 **查询语义修复、SQL 兼容性补齐，以及存储侧新能力扩展**，而不是社区问题分流或版本发布。  
从 PR 内容判断，当前项目处于一轮较典型的“**稳定性修补 + 新特性并行推进**”阶段：一方面连续修复 planner/aggregate/DDL 兼容性问题，另一方面也在推进 FUSE 表分支、snapshot tag 查询、文件编码支持等中长期能力。  
由于没有新增 release 和 issue，社区外部信号较弱；但核心开发者对查询层和存储层均有持续投入，项目健康度维持良好。  

---

## 2. 项目进展

### 已关闭 / 结束流转的 PR

#### 1) `feat(sql): add AUTO datetime format detection`（已关闭）
- PR: [#19659](https://github.com/databendlabs/databend/pull/19659)
- 作者: @TCeason
- 状态: CLOSED

该 PR 尝试为 SQL 增加 **AUTO datetime format detection**，并引入 session setting `enable_auto_detect_datetime_format`，用于对一组预定义的非 ISO 日期时间格式做确定性自动识别。  
虽然该 PR 今日处于**关闭**状态，未进入主线，但它释放出一个明确路线图信号：Databend 正在关注 **日期时间解析兼容性** 与 **导入/查询易用性**，尤其是面向多源异构文本数据时的格式推断体验。

**技术意义**
- 提升 SQL 层对非标准时间格式的容忍度。
- 有利于 CSV/TEXT 等半结构化导入链路的易用性。
- 若后续以重构版本重新提交，可能成为数据摄取体验的重要增强点。

---

## 3. 社区热点

> 注：给定数据中未提供评论数/反应数的有效统计（均为 `undefined` 或 0），因此以下“热点”按**最近活跃度 + 技术影响面**排序。

### 热点 1：实验性表分支能力
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)
- 标题: `feat(query): support experimental table branch`

这是今天最值得关注的长期特性 PR 之一。该 PR 为 **FUSE tables 引入 table branches**，包含：
- branch 创建
- 基于 branch 的读写
- branch 生命周期元数据
- branch-aware GC
- 扩展 SQL 语法支持

**背后的技术诉求**
- 面向分析型场景的“类 Git 分支”数据工作流。
- 为试验性查询、隔离式数据修改、时间线并发开发提供基础设施。
- 在湖仓/数据版本化方向上，Databend 正继续强化 FUSE 元数据治理能力。

这是一个明显的**路线图级别**信号，若落地，将对 Databend 的数据协作和可回溯分析能力产生较大影响。

---

### 热点 2：CSV/TEXT 编码支持
- PR: [#19660](https://github.com/databendlabs/databend/pull/19660)
- 标题: `feat: CSV/TEXT support encoding.`

该 PR 为 CSV/TEXT stage read 增加了 **字符集解码能力**，并引入了基础的 malformed input 错误处理策略。

**背后的技术诉求**
- 实际生产数据并不总是 UTF-8，尤其来自传统系统、跨区域业务系统或历史归档文件时。
- 导入链路常见痛点是“文件能读但内容乱码 / 某行解码失败导致任务中断”。
- 这类功能对数据接入广度非常关键，直接影响 Databend 在企业异构数据环境中的可用性。

这条 PR 具有较强用户价值，预计会受到数据导入、外部 stage、批处理场景用户关注。

---

### 热点 3：FUSE snapshot tags 可观测性增强
- PR: [#19664](https://github.com/databendlabs/databend/pull/19664)
- 标题: `feat(storage): add fuse_tag table function to list snapshot tags`

新增 `fuse_tag('database', 'table')` table function，用于列出 FUSE table 的 snapshot tags。

**背后的技术诉求**
- 用户需要更直接地查看表级快照标签，而不仅依赖底层元数据推断。
- 这是典型的“**可观测性 / 运维可用性增强**”功能。
- 与 table branch、snapshot/tag 等能力结合后，Databend 的版本化对象管理能力正在逐步形成更完整工具链。

---

## 4. Bug 与稳定性

今天没有新增 Issue，但有多条与 **查询正确性、语义校验、DDL 幂等性** 相关的修复 PR 仍在推进。按潜在严重性排序如下：

### 高优先级：LIKE ESCAPE 空字符串处理错误
- PR: [#19595](https://github.com/databendlabs/databend/pull/19595)
- 标题: `fix(query): handle empty LIKE ESCAPE in planner`
- 状态: OPEN

**问题概述**
planner 对 `LIKE ... ESCAPE ''` 的 fast path 处理存在错误，会错误地解包空 `ESCAPE` 字符串。  
修复方案是：当 `ESCAPE` 为空或不是单字符时，不走错误的 planner 快路径，而回退到已有 operator/builtin 行为。

**影响分析**
- 影响 SQL `LIKE` 语义正确性。
- 属于典型的 planner 优化路径与标准语义不一致问题。
- 若未修复，可能导致查询结果错误或与预期 SQL 行为不一致。

**是否已有修复**
- 有，修复 PR 已提交：[#19595](https://github.com/databendlabs/databend/pull/19595)

---

### 高优先级：`GROUPING()` 非法用法未返回正确语义错误
- PR: [#19594](https://github.com/databendlabs/databend/pull/19594)
- 标题: `fix(query): return semantic error for invalid grouping()`
- 状态: OPEN

**问题概述**
该问题涉及：
- constant folding 过早计算占位 `grouping` scalar
- `GROUPING()` 零参数调用未返回合理的 semantic error，而是在后续流程中异常

**影响分析**
- 这是聚合重写与语义分析边界上的正确性问题。
- 可能导致错误类型不准确、用户得到低质量报错，甚至触发非预期失败路径。
- 对 BI/OLAP 查询兼容性有一定影响，尤其是涉及 grouping sets / rollup/cube 相关语义时。

**是否已有修复**
- 有，修复 PR 已提交：[#19594](https://github.com/databendlabs/databend/pull/19594)

---

### 中优先级：`ALTER TABLE ADD COLUMN IF NOT EXISTS` 兼容性缺失
- PR: [#19615](https://github.com/databendlabs/databend/pull/19615)
- 标题: `fix(query): support IF NOT EXISTS for ALTER TABLE ADD COLUMN`
- 状态: OPEN

**问题概述**
Databend 正在补齐：
- parser 对 `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` 的支持
- 当列已存在时将请求视为 no-op
- 增加 Rust 和 SQL 回归测试

**影响分析**
- 主要影响 DDL 幂等执行和迁移脚本兼容性。
- 在 CI/CD、schema migration、重复部署场景中，缺少 `IF NOT EXISTS` 往往会增加脚本脆弱性。
- 这不是崩溃型 bug，但对生产自动化体验影响显著。

**是否已有修复**
- 有，修复 PR 已提交：[#19615](https://github.com/databendlabs/databend/pull/19615)

---

## 5. 功能请求与路线图信号

虽然今日没有新增 Issue，但从活跃 PR 可提炼出较清晰的产品演进方向：

### 1) 面向版本化分析表的高级能力正在加速
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)
- PR: [#19664](https://github.com/databendlabs/databend/pull/19664)

`table branch` 与 `fuse_tag` 组合显示，Databend 正持续增强 FUSE 表在 **快照、标签、分支、回溯查询** 方面的能力。  
这意味着下一阶段很可能继续出现：
- branch/tag 管理 SQL 扩展
- 分支隔离写入与合并策略
- 更细粒度的元数据可观测函数
- branch/tag 相关 GC 和 retention 策略

这类能力对 Databend 的差异化竞争力非常关键。

---

### 2) 数据接入兼容性持续增强
- PR: [#19660](https://github.com/databendlabs/databend/pull/19660)
- 相关已关闭尝试: [#19659](https://github.com/databendlabs/databend/pull/19659)

CSV/TEXT 编码支持和 datetime 自动识别尝试，说明团队正在优化**“把外部真实数据顺利导入 Databend”**这条链路。  
后续可能纳入下一版本的方向包括：
- 更多字符集支持
- 更丰富的导入错误策略（skip/reject/report）
- 日期/时间自动格式识别的重新设计版
- 文件格式级别的更细粒度 session/stage 参数控制

---

### 3) SQL 兼容性和错误语义质量仍是近期重点
- PR: [#19595](https://github.com/databendlabs/databend/pull/19595)
- PR: [#19594](https://github.com/databendlabs/databend/pull/19594)
- PR: [#19615](https://github.com/databendlabs/databend/pull/19615)

最近活跃的修复都指向同一主题：  
**不仅要“能执行”，还要“在边界条件和标准语义上表现正确”。**

这表明 Databend 在成熟化过程中，正在系统性修补：
- planner 快路径的语义偏差
- 聚合/重写阶段的错误处理
- DDL 语法兼容和幂等行为

这些工作通常预示着产品正向更广泛生产使用场景靠拢。

---

## 6. 用户反馈摘要

今日没有 Issue 更新，也缺少评论明细，因此没有足够数据提炼“来自评论区的直接用户声音”。  
不过从 PR 主题可间接推测当前真实用户痛点主要集中在以下几类：

1. **SQL 边界兼容性**
   - `LIKE ESCAPE`、`GROUPING()`、`ALTER TABLE ADD COLUMN IF NOT EXISTS`
   - 反映用户在迁移标准 SQL 或兼容其他数据库脚本时，关注行为一致性与错误提示质量。

2. **异构文件导入**
   - CSV/TEXT 编码支持
   - 反映用户在导入历史文件、多语言文本或非 UTF-8 数据时存在实际需求。

3. **版本化数据管理**
   - table branch、fuse_tag
   - 反映高阶分析场景中，用户需要更强的数据版本治理、试验隔离和快照可见性。

整体上，Databend 当前用户诉求正从“基础可用”转向“**复杂生产场景的兼容性、治理能力与易用性**”。

---

## 7. 待处理积压

以下 PR 值得维护者持续关注，因其要么影响面广、要么具备路线图级意义：

### 1) 实验性表分支能力
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)
- 创建时间: 2026-03-15
- 状态: OPEN

这是当前列表中最早且最重的功能 PR。涉及语义、元数据、GC、读写路径等多个层面，复杂度高。建议重点关注：
- 元数据一致性
- 分支隔离下的写冲突语义
- branch-aware GC 的安全边界
- SQL 语法与现有对象模型的兼容

---

### 2) `LIKE ESCAPE` 语义修复
- PR: [#19595](https://github.com/databendlabs/databend/pull/19595)
- 状态: OPEN

属于查询正确性修复，建议优先审阅合并，避免 planner 快路径继续造成语义偏差。

---

### 3) `GROUPING()` 语义错误修复
- PR: [#19594](https://github.com/databendlabs/databend/pull/19594)
- 状态: OPEN

聚合相关语义问题通常影响 BI 查询和标准 SQL 兼容，建议优先级保持较高。

---

### 4) `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- PR: [#19615](https://github.com/databendlabs/databend/pull/19615)
- 状态: OPEN

该修复对自动化 schema migration 很重要，建议尽快推进，以改善生产环境下 DDL 幂等体验。

---

### 5) CSV/TEXT 编码支持
- PR: [#19660](https://github.com/databendlabs/databend/pull/19660)
- 状态: OPEN

功能价值高，但需重点关注：
- 编码检测/指定策略
- 性能开销
- malformed 输入的报错与容错行为
- 与 stage/file format 参数体系的一致性

---

## 附：今日关注链接汇总

- [#19595 fix(query): handle empty LIKE ESCAPE in planner](https://github.com/databendlabs/databend/pull/19595)
- [#19594 fix(query): return semantic error for invalid grouping()](https://github.com/databendlabs/databend/pull/19594)
- [#19615 fix(query): support IF NOT EXISTS for ALTER TABLE ADD COLUMN](https://github.com/databendlabs/databend/pull/19615)
- [#19664 feat(storage): add fuse_tag table function to list snapshot tags](https://github.com/databendlabs/databend/pull/19664)
- [#19660 feat: CSV/TEXT support encoding.](https://github.com/databendlabs/databend/pull/19660)
- [#19659 feat(sql): add AUTO datetime format detection](https://github.com/databendlabs/databend/pull/19659)
- [#19551 feat(query): support experimental table branch](https://github.com/databendlabs/databend/pull/19551)

如果你愿意，我还可以继续把这份日报整理成更适合公众号/飞书推送的 **精简版**，或者输出一份 **“面向维护者的风险优先级清单”**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-04-05）

## 1. 今日速览

过去 24 小时内，Velox 社区整体活跃度**中等偏高**：共有 **15 条 PR 更新**、**1 条 Issue 关闭**，但**无新版本发布**。  
从变更主题看，今日工作重心集中在 **CI 可观测性改进、SQL/函数兼容性修复、cuDF 回归修复**，同时还有一个体量很大的 **Iceberg V3 全量 C++ 支持** PR 持续推进。  
已合并/关闭的 PR 数量不多（2 条），说明当前阶段更像是**功能打磨与评审推进日**，而非大规模落地主日。  
项目健康度整体良好：一方面出现了主分支合并后触发的 CI 回归问题，另一方面也能看到社区在 **24 小时内给出对应修复 PR**，响应速度较快。

---

## 3. 项目进展

### 已合并/关闭的重要 PR

#### 1) Spark SQL 兼容性修复：`collect_set` 默认忽略 NULL
- **PR**: #16947  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #16947

该 PR 修复了 Spark SQL 聚合函数 `collect_set(T)` 的**向后兼容性问题**：`ignoreNulls` 的默认值此前错误地表现为 `false`，导致单参数签名下语义偏离预期。修复后默认行为恢复为 **ignore nulls = true**，这对于依赖 Spark 兼容语义的上层查询引擎尤其重要。

**影响分析：**
- 提升了 Velox 在 **Spark SQL 方言兼容** 上的一致性。
- 避免聚合结果中意外保留 NULL，减少查询正确性偏差。
- 对已有作业属于**纠偏型修复**，但若用户已依赖此前错误行为，结果可能发生变化。

---

#### 2) 表达式求值稳定性修复：自适应 CPU 采样测试去抖动
- **PR**: #17002  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #17002

该 PR 修复了 `adaptiveCpuSamplingPerFunctionRates` 测试的 flaky 问题。原测试依赖“绝对状态断言”，对运行时环境较敏感；修复后改为**相对比较**，降低了测试偶发失败概率。

**影响分析：**
- 直接提升 CI 稳定性，减少误报。
- 对表达式执行引擎本身并非功能新增，但有助于后续性能采样与 profiling 特性的持续演进。
- 属于典型的**基础设施可靠性改进**。

---

## 4. 社区热点

### 热点 1：Iceberg V3 全量 C++ 支持持续推进
- **PR**: #16959  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16959

这是今日最值得关注的功能型 PR。其内容覆盖：
- **Deletion Vectors**
- **Equality Deletes**
- **Sequence Number Conflict Resolution**
- **DV Writer**
- **DWRF Data Sink**
- **Manifold filesystem**
- **PUFFIN protocol**

**技术诉求分析：**
这表明 Velox/Prestissimo 正在继续增强其在 **现代湖仓格式 Iceberg V3** 上的原生能力，尤其是删除语义、冲突解决和元数据协议支持。  
对 OLAP/查询引擎生态来说，这类能力直接关系到：
- 增量更新与行级删除支持
- 湖仓表格式一致性
- 与 Presto/Prestissimo 的端到端集成能力

这是明显的**路线图信号**：Velox 正继续向更完整的开放表格式执行底座演进。

---

### 热点 2：CI 可观测性和失败反馈链路建设
- **PR**: #17015  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #17015

该 PR 增加：
- 从 `ctest` 输出中提取失败测试名
- 使用 GitHub Actions `::error::` 标注
- 上传失败细节 artifact
- 为后续 PR 评论自动反馈做准备

**技术诉求分析：**
Velox 作为底层执行引擎，测试矩阵大、平台多、变更广。CI 一旦失败，开发者最痛的往往不是“失败了”，而是**定位失败成本太高**。  
这个 PR 体现出维护者正在系统性解决：
- 测试失败发现慢
- 日志检索成本高
- 贡献者反馈路径不直观

对开源协作效率提升价值很高。

---

### 热点 3：cuDF 回归修复
- **Issue**: #17027  
- **状态**: Closed  
- **链接**: facebookincubator/velox Issue #17027

- **对应修复 PR**: #17031  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #17031

该问题指出：在 **zero-column plans** 场景下，`CudfToVelox::getOutput()` 返回空 vector，导致 `cudf-tests` 在 GCC Linux workflow 中持续失败。

**技术诉求分析：**
这反映出 GPU/列式互转链路中，对“零列但有行数”这类边界情况处理不完善。  
此类问题虽然场景边缘，但会直接影响：
- CI 主分支稳定性
- cuDF 集成可信度
- 零列投影/常量计数等算子语义正确性

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：cuDF 零列表计划导致 CI 持续失败
- **Issue**: #17027  
- **状态**: Closed  
- **链接**: facebookincubator/velox Issue #17027
- **修复 PR**: #17031  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #17031

**问题概述：**
`ToCudfSelectionTest.zeroColumnCountConstantFallsBack` 失败，根因是 `CudfToVelox::getOutput()` 在 zero-column plan 下返回了空 vector，而非预期的空列/空指针语义处理。

**影响：**
- 每次合并到 `main` 都会触发 `cudf-tests` 失败。
- 属于**主线 CI 回归**，优先级较高。

**当前状态：**
- 问题已被识别并关闭。
- 修复 PR 已在 24 小时内提出，响应迅速。

---

### P2：`array_sort` 比较器返回类型声明不匹配
- **PR**: #17030  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #17030

**问题概述：**
Presto 中 `ArraySortComparatorFunction` 的 comparator lambda 返回类型是 `int`，而 Velox 之前使用 `bigint`，导致当 lambda body 返回 `INTEGER` 时出现解析失败。

**影响：**
- 属于**SQL 函数解析/类型系统兼容性问题**。
- 会影响 Presto 方言下 `array_sort` 的可用性和行为一致性。

**当前状态：**
- 已有明确修复 PR。
- 若合入，将进一步缩小 Velox 与 Presto 的函数签名差异。

---

### P2：macOS 下 grouped tests 阻碍单测定点发现
- **PR**: #17026  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #17026

**问题概述：**
由于 grouped tests 会把多个测试源文件打进同一二进制，macOS 开发环境下难以通过 `ctest -R <TestName>` 精准运行单个测试。

**影响：**
- 不一定影响生产正确性，但显著影响**开发调试效率**。
- 会降低贡献者在 macOS 上排查问题的体验。

---

### P3：表达式采样测试 flaky
- **PR**: #17002  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #17002

**问题概述：**
测试对状态机做绝对断言，易受运行环境波动影响。

**当前状态：**
- 已修复并合入。
- 短期内有助于降低 CI 噪音。

---

## 6. 功能请求与路线图信号

### 1) Iceberg V3 能力大幅扩展，极可能进入后续重点版本
- **PR**: #16959  
- **链接**: facebookincubator/velox PR #16959

这是当前最明确的路线图信号。若该 PR 逐步拆分或成功落地，Velox 将在以下方面更进一步：
- 原生 Iceberg V3 读写支持
- 行级删除与删除向量处理
- Equality delete 语义
- 元数据协议与文件系统适配

**判断：**
这类功能通常不会停留在实验状态太久，尤其当其已与 Prestissimo 联动时，纳入后续版本的概率较高。

---

### 2) CI 工作流产品化建设正在加速
- **PR**: #17015  
- **链接**: facebookincubator/velox PR #17015
- **PR**: #17024  
- **链接**: facebookincubator/velox PR #17024

其中：
- #17015 聚焦失败报告、注释、artifact
- #17024 为 `.github/workflows/` 增加 README，文档化 17 个 CI 工作流

**判断：**
这说明 Velox 正在从“能跑 CI”转向“**CI 可维护、可观测、可协作**”。这虽不是面向 SQL 用户的新功能，但对开源项目规模化协作非常关键。

---

### 3) 类型系统与函数签名兼容性仍是持续演进方向
- **PR**: #17030  
- **链接**: facebookincubator/velox PR #17030

`array_sort` comparator 返回类型修正，说明 Velox 仍在持续打磨与 Presto/Spark 等上层生态的**语义对齐**。  
后续可继续关注：
- 函数签名微差异
- Lambda 推导
- NULL/类型提升规则

---

## 7. 用户反馈摘要

基于今日 Issue/PR 内容，可以提炼出几个真实用户痛点：

### 1) 用户最在意的是“主分支合并后 CI 不应持续红”
- **Issue**: #17027  
- **链接**: facebookincubator/velox Issue #17027

从该问题描述看，`main` 分支在 PR #16522 合入后，`cudf-tests` 每次都失败。这类反馈通常意味着：
- 用户/贡献者高度依赖 CI 判断主线健康度
- GPU/加速路径虽然不是所有人的主路径，但一旦红灯，会降低整体信任感

---

### 2) 开发者希望 CI 不只是失败，还要“告诉我为什么失败”
- **PR**: #17015  
- **链接**: facebookincubator/velox PR #17015

这体现的是典型的工程效率诉求：
- 失败测试名应自动提取
- 日志和 artifact 应该开箱即用
- PR 页面应直接给出可操作反馈

这对新贡献者尤其重要，可降低项目上手门槛。

---

### 3) 本地方便复现和精确运行单测，是贡献体验关键环节
- **PR**: #17026  
- **链接**: facebookincubator/velox PR #17026

macOS 下无法通过 `ctest -R` 精确定位测试，说明部分开发者在本地调试过程中遇到了不必要阻碍。  
这类问题虽不影响终端查询性能，却会明显影响社区协作效率。

---

## 8. 待处理积压

以下长期未完成 PR 值得维护者重点关注：

### 1) TSAN 相关修复仍在积压
- **PR**: #15140  
- **标题**: fix: Rewrite tsan atomic to always use std atomic  
- **创建时间**: 2025-10-13  
- **链接**: facebookincubator/velox PR #15140

- **PR**: #15179  
- **标题**: fix: Remove tsan_lock_guard  
- **创建时间**: 2025-10-15  
- **链接**: facebookincubator/velox PR #15179

这两个 PR 都与线程安全、同步语义、TSAN 检测一致性相关。  
考虑到并发问题往往隐蔽且影响基础执行层，若长期不决，可能持续拖累稳定性建设。

---

### 2) 执行器语义重构仍未落地
- **PR**: #15491  
- **标题**: refactor: Make executor more clear about io vs cpu  
- **创建时间**: 2025-11-13  
- **链接**: facebookincubator/velox PR #15491

该 PR 试图明确 executor 的 **IO 与 CPU 角色边界**。  
这类命名/语义清理虽然看似“非功能性”，但对执行引擎配置正确性、维护成本和扩展性影响很大，建议维护者给出更明确结论：合入、拆分还是关闭。

---

### 3) 表达式到子字段过滤优化 PR 挂起时间较长
- **PR**: #15361  
- **标题**: perf: Improve expr to subfield filters  
- **创建时间**: 2025-11-01  
- **链接**: facebookincubator/velox PR #15361

这是少数直接指向**查询性能优化**的长期 PR。  
若其中收益已在 TPCH Q19 等场景体现，建议维护者尽快完成：
- 基准复核
- 风险评估
- 可拆分合入

避免性能型改进长期滞留。

---

### 4) 若 Iceberg V3 PR 过于庞大，建议拆分评审
- **PR**: #16959  
- **链接**: facebookincubator/velox PR #16959

虽然它并不算“长期积压”，但从内容覆盖面看属于**超大 PR**。  
为降低评审与回归风险，建议关注：
- 是否按 reader / delete semantics / writer / filesystem / protocol 分拆
- 是否先合入基础设施，再逐步启用完整语义

---

## 附：今日重点链接汇总

- Issue #17027: cuDF zero-column plan 回归  
  链接: facebookincubator/velox Issue #17027

- PR #17031: 修复 cuDF zero-column 回归  
  链接: facebookincubator/velox PR #17031

- PR #17030: 修复 `array_sort` comparator 返回类型  
  链接: facebookincubator/velox PR #17030

- PR #16947: Spark SQL `collect_set` 兼容性修复（已合并）  
  链接: facebookincubator/velox PR #16947

- PR #17002: expr-eval flaky test 修复（已合并）  
  链接: facebookincubator/velox PR #17002

- PR #16959: Iceberg V3 全量 C++ 支持  
  链接: facebookincubator/velox PR #16959

- PR #17015: CI 失败报告与注释增强  
  链接: facebookincubator/velox PR #17015

- PR #17024: CI 工作流 README 文档化  
  链接: facebookincubator/velox PR #17024

- PR #17026: macOS 单测发现能力修复  
  链接: facebookincubator/velox PR #17026

---

**结论**：  
今天的 Velox 处于一个典型的“**稳定性治理 + 兼容性修复 + 大功能铺垫**”阶段。短期重点是尽快合入 cuDF 回归修复、继续完善 CI 可观测性；中期最值得跟踪的是 Iceberg V3 支持，它很可能成为后续版本的重要能力增量。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-04-05）

## 1. 今日速览
过去 24 小时内，Apache Gluten 共有 **6 条 Issue 更新**、**3 条 PR 更新**，无新版本发布，整体活跃度处于 **中等偏活跃** 水平，讨论重心明显集中在 **Velox 后端的 Table Scan 内存管理、预取调度与 Mac 构建稳定性**。  
从议题分布看，今天既有 **Bug 关闭**，也有围绕同一问题域继续扩展出的 **性能/内存优化增强需求**，说明社区正在从“定位问题”转向“系统性治理”。  
PR 侧暂无合并，但 **#11879 与 #11878** 已形成典型的 “Issue → Fix PR” 快速响应链路，体现出维护者对构建可用性问题的较高响应效率。  
综合来看，项目当前重点不是新增功能面扩张，而是围绕 **Velox 扫描链路性能与内存稳定性** 做深度打磨。

---

## 2. 项目进展
今日 **无已合并 PR**，**无新增 release**。  
不过，从在审 PR 内容看，已有几项明确指向 Velox 扫描/构建链路优化的工作正在推进：

### 待合并 PR
- [#11877 [VELOX] [VL] Use UnboundedBlockingQueue when create threads pool](https://github.com/apache/gluten/pull/11877)  
  目标是调整线程池请求队列策略，避免默认 **LIFO 调度** 导致表扫描时优先处理“后来的 rowgroup 请求”，从而让前序 rowgroup 被阻塞等待。  
  这属于典型的 **扫描预取调度优化**，有望改善首批 rowgroup 的就绪顺序，降低 scan pipeline 的空等时间，并与近期多个 table scan 相关 issue 形成呼应。

- [#11879 [VELOX] Fix gluten velox build issue](https://github.com/apache/gluten/pull/11879)  
  该 PR 直接对应 [#11878](https://github.com/apache/gluten/issues/11878)，修复 **Mac 环境下 Velox backend 构建失败** 问题。  
  从摘要看，根因与 **Arrow 压缩依赖链接不稳定** 有关，同时为 macOS 使用 `otool` 替代 `ldd`，属于典型 **跨平台构建兼容性修复**。

- [#11743 [VELOX, INFRA] [DNR] Temp test](https://github.com/apache/gluten/pull/11743)  
  该 PR 标记为 **[DNR]**，更像临时性基础设施/测试用途，对产品能力推进有限，但因仍处于 open 状态，建议维护者确认是否应及时关闭或清理，避免噪音积压。

---

## 3. 社区热点

### 3.1 Velox 上游 PR 跟踪仍是最活跃长期议题
- [#11585 [VL] useful Velox PRs not merged into upstream](https://github.com/apache/gluten/issues/11585)  
  **16 条评论，4 个 👍**，是当前最活跃的讨论主题。  
  这是一个 **tracker issue**，用于跟踪 Gluten 社区提交但尚未合入 Velox 上游的有价值 PR。背后反映的技术诉求非常明确：  
  1. Gluten 对 Velox 的依赖较深；  
  2. 某些性能/稳定性改进若不能及时 upstream，会带来维护分叉和 rebase 成本；  
  3. 社区希望通过 issue 集中管理 patch 状态，降低下游自维护负担。  
  这类议题本质上是 **生态协同效率问题**，也会直接影响后续版本能否平滑吸纳 Velox 改进。

### 3.2 Table Scan 内存与预取策略成为今日技术焦点
相关议题包括：
- [#11876 [bug] [VL] table scan allocated more memory than used and caused OOM](https://github.com/apache/gluten/issues/11876)
- [#11880 [enhancement] [VL] Spill support of table scan](https://github.com/apache/gluten/issues/11880)
- [#11821 [enhancement] [VL] pick split with most data prefetched](https://github.com/apache/gluten/issues/11821)
- [#11877 PR [VL] Use UnboundedBlockingQueue when create threads pool](https://github.com/apache/gluten/pull/11877)

这些条目共同指向一个核心诉求：**当前 Velox Table Scan 的 split/rowgroup prefetch 机制虽能提升吞吐，但可能造成内存保留偏高、调度次优、局部等待放大，最终诱发 OOM 或性能波动。**  
这说明社区已经不满足于“能跑得快”，开始关注 **预取深度、内存占用、就绪优先级、是否支持 spill** 等更细粒度的执行层优化。

### 3.3 Mac 构建失败问题得到快速响应
- Issue: [#11878 [VL] Mac OS build error](https://github.com/apache/gluten/issues/11878)
- PR: [#11879 [VELOX] Fix gluten velox build issue](https://github.com/apache/gluten/pull/11879)

这是今天最完整的闭环热点：用户报告问题后，当天即出现修复 PR。  
技术诉求主要是 **提升开发者体验和跨平台可构建性**，尤其对本地开发、PoC 和社区新贡献者非常关键。

---

## 4. Bug 与稳定性
以下按严重程度排序：

### P1：Table Scan 内存分配与 OOM 风险
- [#11876 [bug] [VL] table scan allocated more memory than used and caused OOM](https://github.com/apache/gluten/issues/11876)  
  问题描述显示：即使系统总体内存利用率仅约 **64%**，Table Scan 仍可能报告 OOM。  
  这意味着当前问题不只是“机器内存不足”，更可能涉及：
  - 扫描侧内存 accounting 与实际使用不一致；
  - 预取造成的 reservation/allocated memory 偏高；
  - rowgroup / split 调度顺序导致释放不及时。  
  **是否已有 fix PR：暂无直接修复 PR。**  
  但 [#11877](https://github.com/apache/gluten/pull/11877) 与 [#11880](https://github.com/apache/gluten/issues/11880) 显然属于同一问题域的缓解方向。

### P1：OOM 判定与实际可用内存不一致
- [#11747 [bug] OOM but memory is enough](https://github.com/apache/gluten/issues/11747)  
  该 Issue 已于今日关闭：  
  [#11747](https://github.com/apache/gluten/issues/11747)  
  从摘要看，异常源于 `TableScan` 的 `Operator::getOutput failed`，属于运行时 INVALID_STATE / OOM 类错误。  
  虽然 issue 已关闭，但结合今天新开的 [#11876](https://github.com/apache/gluten/issues/11876) 与 [#11880](https://github.com/apache/gluten/issues/11880)，说明 **“内存足够却触发 OOM” 并非完全孤立个案**，更可能是扫描链路内存策略的一组相关问题。  
  **是否已有 fix PR：未在今日数据中看到直接关联 PR。**

### P2：macOS 构建失败
- [#11878 [triage] [VL] Mac OS build error](https://github.com/apache/gluten/issues/11878)  
  影响范围主要是 **开发与构建流程**，而非线上查询正确性，但会阻碍本地编译 Velox backend。  
  **是否已有 fix PR：有，见 [#11879](https://github.com/apache/gluten/pull/11879)。**

---

## 5. 功能请求与路线图信号

### 5.1 Table Scan Spill 支持是明确信号
- [#11880 [enhancement] [VL] Spill support of table scan](https://github.com/apache/gluten/issues/11880)

这是今天最值得关注的新功能请求之一。Issue 直接指出：  
当前 split 和 rowgroup prefetch 是 Gluten 性能收益的重要来源，但代价是 **较高内存消耗**；因此需要：
1. 在内存满时暂停 prefetch；或  
2. 直接为 table scan 增加 spill 能力。  

这表明社区路线图可能从“算子级 spill”继续扩展到 **scan 侧资源治理**。  
若后续与 [#11876](https://github.com/apache/gluten/issues/11876)、[#11821](https://github.com/apache/gluten/issues/11821)、[#11877](https://github.com/apache/gluten/pull/11877) 联动推进，下一版本很可能出现：
- 更保守或自适应的 prefetch 策略；
- 基于内存水位的 scan 限流；
- scan 级 spill / backpressure 机制。

### 5.2 更智能的 split 选择策略
- [#11821 [enhancement] [VL] pick split with most data prefetched](https://github.com/apache/gluten/issues/11821)

该需求希望不要简单选择第一个 `KPrepared` 的 split，而应优先选择 **预取数据最多、最接近 ready 的 split**。  
这反映出执行引擎优化重点正向 **“就绪度感知调度”** 演进，而不是仅靠静态顺序或先到先服务。  
结合 [#11877](https://github.com/apache/gluten/pull/11877) 的线程池队列策略调整，可以判断：  
**扫描调度优化大概率会成为后续版本的持续投入方向。**

### 5.3 上游合并协同仍影响路线落地速度
- [#11585 [tracker] useful Velox PRs not merged into upstream](https://github.com/apache/gluten/issues/11585)

该跟踪议题意味着一些 Gluten 依赖的重要改进尚未 upstream。  
因此，某些能力即便在社区内部已验证，也可能因为上游整合节奏而影响正式版本纳入时间。这是后续版本规划中的重要不确定因素。

---

## 6. 用户反馈摘要

基于今日 issue/PR 信息，可提炼出几类真实用户痛点：

### 6.1 “机器还有内存，但查询仍然 OOM”
对应：
- [#11747](https://github.com/apache/gluten/issues/11747)
- [#11876](https://github.com/apache/gluten/issues/11876)

这类反馈说明用户最关心的不只是吞吐，而是 **内存行为是否可解释、可预测**。  
当系统整体内存未耗尽却出现 OOM 时，用户会倾向认为这是：
- 内存统计不准确；
- 扫描侧预取过度；
- 执行器保守限额与实际资源脱节。  

这会直接影响生产环境对 Gluten + Velox 的稳定性信心。

### 6.2 高性能预取带来副作用
对应：
- [#11880](https://github.com/apache/gluten/issues/11880)
- [#11821](https://github.com/apache/gluten/issues/11821)
- [#11877](https://github.com/apache/gluten/pull/11877)

用户反馈并不是反对 prefetch，而是希望：
- 更聪明地决定先处理哪个 split/rowgroup；
- 不要因为预取顺序不佳导致 pipeline 空等；
- 不要为了吞吐牺牲过多内存。  

这说明社区用户已进入 **性能优化“第二阶段”**：从追求“更快”转向追求“更稳、更均衡”。

### 6.3 本地开发环境兼容性仍重要
对应：
- [#11878](https://github.com/apache/gluten/issues/11878)
- [#11879](https://github.com/apache/gluten/pull/11879)

Mac 构建问题虽然不一定影响生产集群，却直接影响开发者 onboarding、问题复现和本地调试效率。  
维护者当天给出修复 PR，说明项目对开发者体验仍保持关注。

---

## 7. 待处理积压

### 7.1 长期开放的 Velox 上游 PR 跟踪议题
- [#11585 [tracker] useful Velox PRs not merged into upstream](https://github.com/apache/gluten/issues/11585)

该 issue 创建于 **2026-02-07**，至今仍活跃。  
建议维护者定期清理：
- 已 upstream 的条目及时移除；
- 长期无进展的 PR 增加状态说明；
- 标注对 Gluten 当前版本影响最大的 blocker。  
否则随着条目增长，tracker 本身会变得难以维护。

### 7.2 临时测试 PR 持续挂起
- [#11743 [VELOX, INFRA] [DNR] Temp test](https://github.com/apache/gluten/pull/11743)

创建于 **2026-03-11**，当前仍为 open。  
由于标记为临时/测试性质，建议维护者确认是否：
- 已完成用途后关闭；
- 改为 draft；
- 或补充说明保留原因。  
这有助于减少 PR 列表噪声，提升社区对真正待审改动的聚焦度。

### 7.3 Table Scan 内存治理建议形成专项跟踪
当前相关条目分散在：
- [#11747](https://github.com/apache/gluten/issues/11747)
- [#11876](https://github.com/apache/gluten/issues/11876)
- [#11821](https://github.com/apache/gluten/issues/11821)
- [#11880](https://github.com/apache/gluten/issues/11880)
- [#11877](https://github.com/apache/gluten/pull/11877)

建议维护者考虑建立一个 **table scan memory/prefetch tracker**，将 OOM、prefetch、split 选择、线程池调度、spill 支持等问题统一归档，便于：
- 识别共同根因；
- 避免重复 issue；
- 为下一版本规划形成明确主题。

---

## 8. 项目健康度判断
整体来看，Apache Gluten 今日表现出 **稳定的工程活跃度与较强的问题响应能力**，尤其在 **Mac 构建问题** 上体现出较快修复节奏。  
但从多条 issue 聚焦到 **Velox Table Scan 的内存与预取机制** 可以看出，这已成为当前影响项目稳定性和可扩展性的关键风险面。  
若接下来能将 [#11877](https://github.com/apache/gluten/pull/11877) 一类调度优化，与 [#11880](https://github.com/apache/gluten/issues/11880) 一类扫描 spill/限流机制结合推进，项目在生产稳定性上的表现有望明显提升。  
短期建议维护者优先关注 **scan 内存 accounting、prefetch backpressure、跨平台构建可用性** 三条主线。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报 — 2026-04-05

## 1. 今日速览

过去 24 小时内，Apache Arrow 保持了**中等偏活跃**的项目节奏：Issues 更新 17 条、PR 更新 10 条，但**无新版本发布**。  
从变更结构看，今天的重点主要集中在 **C++ 核心稳定性修复、R 生态合规/CI、以及 Python API 演进**，而不是大规模功能落地。  
Issues 侧有 8 条关闭，显示维护者正在持续清理历史积压，但不少更新来自 **stale-warning 驱动的老问题轮转**，说明真正的新增讨论密度并不算高。  
PR 侧值得关注的是：**base64 解码错误处理已有对应修复 PR**、**Windows MinGW CI 间歇性崩溃继续推进**、**R Azure Blob 文件系统支持**仍在审核中，这些都与 Arrow 作为分析型内存/存储交换层的生产可用性直接相关。  
整体来看，项目健康度稳定，当前更像是一次**“可靠性与边缘生态补强日”**，而非核心执行引擎的大版本冲刺日。

---

## 3. 项目进展

> 注：今日数据中未看到明确“已合并”的核心功能 PR 明细；以下重点梳理今日**已关闭**或**推进明显**的 PR / Issue 所反映的项目进展。

### 3.1 C++：base64_decode 静默截断问题已进入修复阶段
- Issue: #49614  
  链接: `apache/arrow Issue #49614`
- PR: #49660  
  链接: `apache/arrow PR #49660`

这是今天最重要的**正确性修复链路**之一。问题在于 `arrow::util::base64_decode` 遇到非法字符时会**静默停止解码并返回部分结果**，而不是显式报错。这类行为在分析型系统中风险很高，因为它会造成：
- 输入数据损坏却未被发现
- 元数据、凭证、嵌入式 payload 等字段可能被部分截断
- 上层系统误以为解码成功，产生难排查的数据正确性问题

PR #49660 已针对该问题提交修复，方向是**增加 upfront validation / 非法输入检测**。  
这类修复虽然不是“查询引擎功能增强”，但对 Arrow 作为**OLAP 数据交换与序列化基础设施**的可靠性非常关键。

---

### 3.2 C++ / CI：Windows MinGW 下 arrow-json-test 间歇性 segfault 持续推进
- PR: #49462  
  链接: `apache/arrow PR #49462`

该 PR 旨在修复 `arrow-json-test` 在 AMD64 Windows MinGW CI 上的**间歇性段错误**。崩溃发生在 `ReaderTest.MultipleChunksParallel`，这暗示问题可能与：
- JSON Reader 并行读取
- chunk 边界处理
- 线程调度与平台特定 ABI/运行时差异

有关。  
这项工作直接影响 Arrow 在 Windows 开发链上的稳定性，也影响下游分析系统在多平台 CI 中的可重复构建与测试可信度。

---

### 3.3 R：CRAN 合规性与 CI 前置检查明显加强
- PR: #49653 `[R] R non-API calls reported on CRAN`  
  链接: `apache/arrow PR #49653`
- PR: #49655 `[R][CI] Add check for non-API calls onto existing r-devel job`  
  链接: `apache/arrow PR #49655`

今天 R 方向最明确的进展是：不仅在修复 CRAN 报告的 **non-API calls**，同时还将检查前置到 CI。  
这说明维护策略从“被动响应平台告警”转向“主动在 CI 阶段拦截”。对开源分析数据库生态而言，这种治理方式很重要，因为：
- 能减少 CRAN 发布阻塞
- 降低 R binding 回归风险
- 提升多语言生态（C++ / Python / R）的一致性维护能力

---

### 3.4 R：Azure Blob 文件系统暴露接口继续向前
- PR: #49553 `[R] Expose azure blob filesystem`  
  链接: `apache/arrow PR #49553`

这是今天最接近**新能力扩展**的在审 PR。Arrow C++ 与 PyArrow 已支持 Azure，R 侧补齐后，将使对象存储访问在多语言绑定中更完整。  
对 OLAP / Lakehouse 场景而言，这意味着：
- R 用户可直接接入 Azure Blob 数据湖
- 与 AWS / GCS 的云存储能力更加对齐
- 有利于 Arrow Dataset / Parquet 在企业数据平台中的统一访问层建设

如果该 PR 顺利合并，属于下一版本中**较有机会纳入的连接器能力增强**。

---

### 3.5 Python：Feather 模块弃用推进，向 IPC 统一收敛
- PR: #49590 `[Python] deprecate feather python`  
  链接: `apache/arrow PR #49590`

该 PR 延续 C++ 侧对 Feather reader/writer 的弃用趋势，推动 Python 用户从 `pyarrow.feather` 迁移到 `pyarrow.ipc`。  
这是一个重要的 API / 文档演进信号，反映项目正在减少重复抽象、统一格式入口。  
对分析引擎开发者来说，这将带来：
- IPC 文件格式认知更统一
- 减少“Feather V2 vs Arrow IPC”概念混淆
- 文档和维护面更集中

---

## 4. 社区热点

### 热点 1：R / Python 扩展类型不能同时注册
- Issue: #20265  
  链接: `apache/arrow Issue #20265`
- 评论数：7

这是今天评论最多的活跃 Issue 之一。问题聚焦于 **R bindings 与 PyArrow 在 extension type registry 上的冲突**。  
背后的技术诉求非常明确：用户希望在同一工作流中通过 `reticulate` 等桥接方式同时使用 R 和 Python，而 Arrow 作为跨语言内存格式，理应支持这类混合场景。  
这反映出一个核心挑战：**“跨语言共享格式”不等于“跨语言共享运行时注册表”**。  
如果该问题迟迟不解，会影响：
- 混合语言 notebook / 数据科学流程
- 统一 schema/extension type 的跨生态复用
- Arrow 在多语言数据产品中的嵌入体验

---

### 热点 2：Website 宣传 Acero 执行引擎
- Issue: #31983  
  链接: `apache/arrow Issue #31983`
- 评论数：7

虽然这是 Website 类 enhancement，但它背后实际折射的是 **Arrow 执行引擎品牌化与生态传播** 的需求。  
Acero 作为 C++ streaming execution engine，其定位对外界理解 Arrow 非常关键：Arrow 不只是列式格式和 IPC，也逐渐承载执行层能力。  
如果该宣传长期缺位，会导致外部开发者对 Arrow 的能力边界认知不足，不利于：
- 吸引执行引擎贡献者
- 推广 Acero 在嵌入式分析中的应用
- 建立与 DataFusion、DuckDB、Velox 等项目的差异化认知

---

### 热点 3：Python MemoryMappedFile.close() 后内存似乎不释放
- Issue: #34423  
  链接: `apache/arrow Issue #34423`
- 评论数：6

这是今天最典型的**真实用户资源管理痛点**。  
用户在遍历文件、使用 `pa.memory_map` + IPC 读取时，观察到 `MemoryMappedFile.close()` 后内存没有按预期释放。  
背后可能涉及：
- mmap 语义与 RSS 观测偏差
- Python 对象生命周期 / 引用残留
- Arrow buffer / RecordBatchReader 的下游引用链未释放
- OS 层 page cache 与用户态内存释放认知差异

这类问题对处理大规模 Parquet / IPC 文件的 OLAP 用户尤为敏感，因为它直接影响批处理任务稳定性和内存预算控制。

---

### 热点 4：Python CSV reader 容错解码诉求
- Issue: #32028  
  链接: `apache/arrow Issue #32028`
- 评论数：5

用户希望 CSV Reader 能在编码存在少量异常字节时仍继续解析，而不是严格失败。  
这背后反映的是**工程可用性优先**的诉求：在数据湖和外部接入场景中，CSV 原始文件质量经常不完美，严格 UTF 解码失败会成为接入阻塞点。  
这类需求与 OLAP 实践强相关，尤其适合：
- 批量摄取脏数据源
- ETL 预清洗前的快速采样
- 类似 pandas “尽量读出来”的兼容型体验

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：C++ base64_decode 遇非法字符静默截断
- Issue: #49614  
  链接: `apache/arrow Issue #49614`
- Fix PR: #49660  
  链接: `apache/arrow PR #49660`
- 状态：**已有修复 PR**

这是今天最严重的问题，因为它属于**数据正确性风险**，而不是单纯 crash。  
静默返回部分结果比直接报错更危险，容易在生产系统中潜伏较久。

---

### P1：Windows MinGW 下 JSON Reader 并行测试间歇性 segfault
- PR: #49462  
  链接: `apache/arrow PR #49462`
- 状态：**修复进行中**

虽然目前表现为 CI 间歇性失败，但如果根因来自并行读取或平台特定线程问题，则可能波及真实用户场景。  
如果你在 Windows + MinGW 环境下开发基于 Arrow JSON 的分析管道，应继续关注该 PR。

---

### P2：C++ 多线程日志输出串扰
- Issue: #49433  
  链接: `apache/arrow Issue #49433`
- 状态：**未见对应 fix PR**

`ARROW_LOG` 在多线程下消息可能交织，属于**可观测性与排障能力问题**。  
这不会直接破坏查询结果，但会显著降低生产环境中问题定位效率。  
对于高并发 OLAP 服务、Flight 服务端、嵌入式执行器而言，这类日志稳定性其实非常重要。

---

### P2：Python MemoryMappedFile.close() 不释放内存
- Issue: #34423  
  链接: `apache/arrow Issue #34423`
- 状态：**暂无 fix PR**

该问题影响大文件批量遍历时的资源可控性。虽然未必是严格意义上的泄漏，但从用户视角看属于**内存行为不透明/不可预测**。

---

### P3：Python / FlightRPC 服务端错误类型无法区分“业务异常”与“非预期异常”
- Issue: #31444  
  链接: `apache/arrow Issue #31444`
- 状态：**今日关闭**

这是可运维性问题：服务端希望有机制区分有意返回给客户端的错误和需要重点记录监控的内部错误。  
虽然不是今天新报 bug，但其关闭表明相关问题已不再被继续推进，值得后续确认是否已有替代设计。

---

## 6. 功能请求与路线图信号

### 6.1 R 侧 Azure Blob 文件系统支持最有希望进入后续版本
- PR: #49553  
  链接: `apache/arrow PR #49553`

这是当前最明确、最接近交付的用户能力增强。  
如果合并，Arrow R 在云对象存储访问能力上将与 C++ / Python 更趋一致，对企业用户价值较高。

---

### 6.2 Python Feather 读取前 N 行的需求，指向轻量采样/预览场景
- Issue: #32042  
  链接: `apache/arrow Issue #32042`

用户希望 `read_feather` / `read_table` 支持 `nrows`。  
这类需求常见于：
- 数据预览
- schema 检查
- 开发调试时避免全量读取

但由于 Feather V2 正向 `pyarrow.ipc` 收敛，该需求是否会在旧 API 上实现存在不确定性。更可能的路径是**在统一 IPC 入口中提供受限读取能力**。

---

### 6.3 CSV 容错解码仍是高价值 ingestion 能力
- Issue: #32028  
  链接: `apache/arrow Issue #32028`

若项目希望进一步增强 Arrow 在数据摄取链路中的地位，这一需求很值得纳入路线图。  
它不是 SQL 功能，但直接影响 Arrow Dataset / Table 构建前的数据可进入性。

---

### 6.4 Flight 传输 list 结构性能优化
- Issue: #31981  
  链接: `apache/arrow Issue #31981`

该需求反映 Flight 在复杂嵌套结构上的传输效率仍有改进空间。  
对于 GraphQL、半结构化数据服务、复杂 schema 的分析结果传输，这可能成为后续性能优化方向。

---

### 6.5 CUDA buffer 上 IPC message 读取能力
- Issue: #31986  
  链接: `apache/arrow Issue #31986`

这是典型的 GPU / 异构内存路线信号。  
如果未来推进，将进一步增强 Arrow 在 GPU 加速分析栈中的互操作价值，尤其对 RAPIDS / cuDF 生态协同有意义。

---

## 7. 用户反馈摘要

基于今日活跃 Issues，可提炼出几类真实用户痛点：

1. **跨语言互操作并不总是“无缝”**  
   - 代表 Issue: #20265  
   - 用户期望在 R 与 Python 中共享 extension types，但实际遇到注册冲突。  
   - 说明 Arrow 在“格式兼容”之外，运行时行为的一致性仍需加强。

2. **资源释放语义需要更可解释**  
   - 代表 Issue: #34423  
   - 用户最关心的不是底层 mmap 原理，而是“为什么 close 了内存还不降”。  
   - 对大规模 IPC/Parquet 读取场景，这直接影响用户对 Arrow 稳定性的信任。

3. **数据摄取希望容错优先，而不是严格失败**
   - 代表 Issue: #32028  
   - 用户实际面对的是“脏 CSV”，不是教科书式完美编码文件。  
   - Arrow 若想强化 ingestion 角色，需要在严格性与工程可用性之间给出更灵活的模式。

4. **云对象存储接入的一致性是现实需求**
   - 代表 PR: #49553  
   - R 用户明显希望与 Python/C++ 一样获得 Azure 支持。  
   - 这说明多语言绑定能力对齐仍是社区持续关注点。

5. **生产环境下可观测性问题正在显现**
   - 代表 Issue: #49433、#31444  
   - 日志串扰、服务端错误分类不清，表明 Arrow 已越来越多地运行在长期服务和复杂数据平台中，而不只是本地库调用。

---

## 8. 待处理积压

以下是今天被更新、但明显属于**长期未决/值得维护者重新评估优先级**的问题：

### 8.1 #20265 — [R][Python] Extension types cannot be registered in both R and Python
- 链接: `apache/arrow Issue #20265`
- 创建于 2022-05-30，仍处于 open 状态  
- 影响跨语言工作流，建议评估是否需要统一 registry 设计说明或显式限制文档。

### 8.2 #34423 — [Python] pyarrow MemoryMappedFile.close() does not release memory
- 链接: `apache/arrow Issue #34423`
- 创建于 2023-03-03，持续有使用者关注  
- 建议至少补充文档解释、最小复现验证结果或明确“非 bug / 预期行为”的判定标准。

### 8.3 #32028 — [Python] CSV reader: allow parsing without encoding errors
- 链接: `apache/arrow Issue #32028`
- 创建于 2022-05-29  
- 属于典型 ingestion 需求，建议明确是否接受“容错模式”设计。

### 8.4 #31981 — Arrow Flight transport speed improvement for list structures
- 链接: `apache/arrow Issue #31981`
- 创建于 2022-05-23  
- 虽评论不多，但和复杂嵌套类型传输性能直接相关，建议结合 Flight 性能路线统一评估。

### 8.5 #31986 — Incorporate cuDF's utilities for reading IPC messages composed of CUDA buffers
- 链接: `apache/arrow Issue #31986`
- 创建于 2022-05-23  
- 属于前瞻性 GPU 互操作议题，长期搁置会削弱 Arrow 在异构计算生态中的战略位置。

### 8.6 #49585 — DRAFT: set up static build of ODBC FlightSQL driver
- 链接: `apache/arrow PR #49585`
- 仍是 Draft  
- 若要推动 Flight SQL 在企业连接器生态落地，静态构建与分发体验是很关键的一环，建议维护者尽快明确方向和验收标准。

---

## 总结判断

今天的 Apache Arrow 没有版本发布，也没有特别重大的功能合并，但项目状态仍然健康：  
- **稳定性方向**：C++ base64 正确性修复、Windows CI 崩溃修复在推进；  
- **生态方向**：R 的 Azure 支持、CRAN 合规治理都有实质进展；  
- **API 方向**：Python 正在推动从 Feather 专属接口向 IPC 统一收敛；  
- **积压问题**：跨语言扩展类型、内存映射释放语义、CSV 容错摄取仍是几个长期痛点。

如果从 OLAP / 分析型存储引擎视角看，Arrow 今日最重要的信号不是“新增算子”，而是：**它正在继续巩固作为跨语言列式数据底座的可靠性、可维护性与云环境适配能力。**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*