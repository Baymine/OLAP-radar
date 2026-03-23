# Apache Doris 生态日报 2026-03-23

> Issues: 6 | PRs: 26 | 覆盖项目: 10 个 | 生成时间: 2026-03-23 01:23 UTC

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

# Apache Doris 项目动态日报（2026-03-23）

## 1. 今日速览

过去 24 小时，Apache Doris 保持较高开发活跃度：Issues 更新 6 条、PR 更新 26 条，明显以代码推进为主，研发节奏偏快。  
本日没有新版本发布，但有多项围绕查询引擎、外部数据湖、向量检索、文件缓存与执行器观测性的 PR 持续推进。  
已关闭/合并的 4 个 PR 以稳定性修复和测试/分支维护为主，说明当前主线除了功能扩展，也在同步加强工程质量和多分支可用性。  
整体来看，项目健康度良好：一方面有新能力持续进入评审，另一方面也存在部分 Stale issue/PR 被关闭，反映维护团队在主动清理积压。  

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1) MaxCompute 连接器内存泄漏与大数据写入优化已关闭，属于稳定性增强
- PR: [#61245](https://github.com/apache/doris/pull/61245)  
- 标题: `[fix](mc) fix memory leak and optimize large data write for MaxCompute connector`

**进展解读：**  
该 PR 聚焦 MaxCompute connector 的资源释放与大批量写入路径优化，修复了 JNI Scanner/Writer 潜在内存泄漏问题，并保证异常路径下 allocator 也能被正确关闭。  
这类修复对 Doris 作为统一查询与多源联邦分析平台非常关键，尤其适用于长时间运行的数据导入导出、外表扫描和混合负载场景。  
从标签看已进入多个开发分支流程，说明维护者认为这是具有较高实用价值的修复。

---

#### 2) Cloud 场景权限测试用例修复已关闭，并已回拣到分支
- 主 PR: [#61594](https://github.com/apache/doris/pull/61594)  
- 回拣 PR: [#61597](https://github.com/apache/doris/pull/61597), [#61598](https://github.com/apache/doris/pull/61598)  
- 标题: `[fix](cloud) Fix case test_database_management_auth`

**进展解读：**  
该修复针对 cloud 相关权限测试失败问题，属于测试正确性与分支稳定性的快速响应。  
值得注意的是，修复已同步 cherry-pick 到 4.0/4.1 分支，说明该问题并非仅影响主干，而是对当前维护版本也有现实影响。  
这类问题虽然不直接体现新功能，但对云化部署、权限控制回归防护和 CI 稳定性都很关键。

---

#### 3) 两个历史 PR 被关闭，体现维护者在持续清理积压
- [#60957](https://github.com/apache/doris/pull/60957) `opt-inline-agg-func`
- [#56022](https://github.com/apache/doris/pull/56022) `[fix](json) Using CastToString::from_number to cast float to string`

**进展解读：**  
这两项关闭更像是流程治理而非功能推进：前者为 only test now 状态，后者因 Stale 被关闭。  
从项目管理角度看，这说明 Doris 维护团队在控制评审队列长度，避免低活跃度 PR 长期占用注意力。  
但也意味着部分优化/兼容性修复尚未真正落地，后续若用户需求仍在，可能需要提交更新版本的 PR。

---

### 今日仍在推进的关键功能 PR

#### 4) Delta Lake Catalog 支持进入活跃开发
- PR: [#61602](https://github.com/apache/doris/pull/61602)  
- 标题: `[feature](fe,be) Support Delta Lake catalog for reading Delta Lake tables`

**意义：**  
这是今天最值得关注的功能之一。它意味着 Doris 在外部湖仓生态接入上进一步扩展到 Delta Lake，支持通过 HMS 查询 Delta 表，并包含 Deletion Vectors 与谓词下推等能力。  
若最终合并，将显著增强 Doris 面向 Lakehouse 场景的兼容性，与 Iceberg/Hive 等生态形成更完整的数据湖接入矩阵。

---

#### 5) SummaryProfile 动态追踪重构与指标修复同时推进
- 重构 PR: [#61603](https://github.com/apache/doris/pull/61603)  
- 修复 PR: [#61601](https://github.com/apache/doris/pull/61601)

**意义：**  
这两个 PR 形成明显配套关系：一个修复 SummaryProfile / StmtExecutor 现有指标统计缺陷，另一个则尝试把 SummaryProfile 重构到 QueryTrace/ProfileSpan 动态追踪体系。  
这说明 Doris 正在从“能跑”进一步走向“可观测、可诊断”，对复杂 SQL 分析、Nereids 优化器执行过程定位和性能归因都很重要。

---

#### 6) 存储与缓存层持续优化
- File Cache 热点保护 2Q-LRU: [#57410](https://github.com/apache/doris/pull/57410)
- SegmentIterator 自适应 batch size: [#61535](https://github.com/apache/doris/pull/61535)
- 编译时间优化（cast 模板实例下沉）: [#61276](https://github.com/apache/doris/pull/61276)

**意义：**  
这些 PR 覆盖运行时缓存命中率、扫描吞吐、构建效率三个层面。  
其中 2Q-LRU 机制和自适应批大小都与分析型数据库在大扫描、冷热数据混合和内存预算受限环境下的性能稳定性密切相关，属于典型“看起来底层，但实际影响广泛”的优化。

---

#### 7) 向量检索与 ANN 能力继续扩展
- PR: [#61160](https://github.com/apache/doris/pull/61160)  
- 标题: `[feature](ann-index) Support IVF on-disk index type for ANN vector search`

**意义：**  
该 PR 引入 on-disk IVF 索引，使向量检索不再完全受限于内存容量，并结合专用 LRU cache 提升大规模向量数据集的可承载性。  
这表明 Doris 正把向量检索能力从“可用”推进到“可规模化部署”。

---

## 4. 社区热点

### 热点 1：社区新手入口与长期活跃任务池
- Issue: [#17176](https://github.com/apache/doris/issues/17176)  
- 标题: `[Good First Issue] Doris' Future`
- 评论数: 187，👍 37

**分析：**  
这是今日评论最活跃、反应最多的 Issue。它本质上不是单一问题，而是社区任务集与新贡献者入口。  
持续高互动说明 Doris 社区仍具备较强的外部贡献吸引力，维护者通过 Good First Issue 降低参与门槛。  
从项目健康度看，这类议题活跃通常代表社区有持续扩张的 contributor pipeline。

---

### 热点 2：REST Iceberg Catalog 自定义 HTTP Header 支持
- Issue: [#61388](https://github.com/apache/doris/issues/61388)  
- 标题: `Support custom HTTP headers for REST Iceberg catalog via header.* properties`

**分析：**  
该需求反映出 Doris 用户正在更深度地接入标准 Iceberg REST Catalog，且实际部署环境中存在鉴权代理、API Gateway、租户隔离或企业自定义安全头等要求。  
背后的技术诉求不是“能不能连”，而是“能否适配企业化基础设施”。  
如果 Doris 希望继续提升在 Lakehouse 集成中的竞争力，这类连接器配置能力通常优先级不低。

---

### 热点 3：Delta Lake Catalog 支持成为本日最重要新功能信号
- PR: [#61602](https://github.com/apache/doris/pull/61602)

**分析：**  
虽然评论数暂未体现，但从技术价值看，这是今天最有战略意义的 PR 之一。  
它说明 Doris 正继续补齐主流数据湖格式接入能力，推动“查询引擎 + 湖仓访问层”一体化。  
对用户而言，这会直接影响 Doris 在混合数仓、开放表格式和联邦查询场景中的选型吸引力。

---

## 5. Bug 与稳定性

以下按影响面与潜在严重程度排序：

### 高优先级

#### 1) SummaryProfile / StmtExecutor 指标统计错误
- PR: [#61601](https://github.com/apache/doris/pull/61601)

**问题性质：**  
涉及查询执行指标统计错误，包括 partition prune 时间累加字段错误等。  
这类问题不一定导致结果错误，但会严重影响性能诊断、慢查询分析、优化器调优判断。  

**是否已有修复：**  
有，修复 PR 已提交。  

---

#### 2) MaxCompute connector 潜在内存泄漏
- PR: [#61245](https://github.com/apache/doris/pull/61245)

**问题性质：**  
连接器资源泄漏在长时运行任务中可能放大为稳定性问题，尤其是批量写入、外部表扫描、JNI 资源管理场景。  

**是否已有修复：**  
有，PR 已关闭，表示已完成处理流程。  

---

#### 3) `select ... into outfile` 并行导出存在文件删除竞争
- PR: [#61223](https://github.com/apache/doris/pull/61223)  
- 标题: `[fix](outfile) handle delete_existing_files before parallel export`

**问题性质：**  
当开启 `delete_existing_files=true` 且并行导出时，多个 writer 可能竞争清理目录，导致相互删除已上传文件。  
这是典型的并发正确性问题，可能导致导出结果不完整。  

**是否已有修复：**  
有，修复 PR 在进行中。  

---

### 中优先级

#### 4) 多倒排索引列选择 reader 不确定
- PR: [#61596](https://github.com/apache/doris/pull/61596)

**问题性质：**  
同一列存在多个 analyzer 的倒排索引时，`select_best_reader()` 依赖迭代顺序返回候选 reader，导致行为非确定。  
这可能引起搜索查询结果或性能表现不稳定，属于查询路径选择正确性问题。  

**是否已有修复：**  
有，修复 PR 在进行中。  

---

#### 5) search() DSL 中斜杠字符解析错误
- PR: [#61599](https://github.com/apache/doris/pull/61599)

**问题性质：**  
如 `AC/DC` 这类 term 会被错误切分，属于搜索 DSL 词法兼容性问题。  
影响带特殊字符的全文检索/查询表达式。  

**是否已有修复：**  
有，修复 PR 在进行中。  

---

#### 6) 逻辑视图 + 聚合查询失败
- PR: [#56249](https://github.com/apache/doris/pull/56249)  
- 关联: close #56242

**问题性质：**  
该问题涉及 Nereids/逻辑视图场景下带聚合查询失败，属于 SQL 查询兼容性与规划器正确性问题。  
不过该 PR 已长期存在且带 Stale 标签，说明推进速度较慢。  

**是否已有修复：**  
有候选修复 PR，但仍未完成合并。  

---

### 低至中优先级

#### 7) UDF 与系统内建函数 `date_sub` 命名冲突
- Issue: [#37083](https://github.com/apache/doris/issues/37083)

**问题性质：**  
用户自定义别名函数 `union_udf.date_sub` 与系统函数 `date_sub` 发生冲突。  
这反映函数命名解析、命名空间优先级或函数解析策略还有边界问题。  

**状态：**  
该 Issue 今日以 Stale 关闭，暂无看到对应修复 PR。  

---

#### 8) IPv4/IPv6 UDF 开发问题
- Issue: [#56229](https://github.com/apache/doris/issues/56229)

**问题性质：**  
属于 Java UDF 开发中的网络地址处理问题，可能涉及 UDF 运行时、类型适配或函数返回语义。  

**状态：**  
Issue 仍开放，但暂无明确 fix PR。  

---

#### 9) Kettle Stream Load 插件字段顺序序列化 bug
- Issue: [#56355](https://github.com/apache/doris/issues/56355)

**问题性质：**  
源字段顺序与目标表字段顺序不一致时，插件按 record 下标取值，导致序列化错误。  
这是典型的数据接入正确性问题，影响 ETL 场景。  

**状态：**  
Issue 仍开放，暂无对应修复 PR。  

---

## 6. 功能请求与路线图信号

### 1) Delta Lake 外部目录/表支持，极可能进入后续版本
- PR: [#61602](https://github.com/apache/doris/pull/61602)

**判断：高概率进入后续版本**  
这是直接代码实现而非纯需求讨论，且覆盖 FE/BE 双端。  
如果评审顺利，Doris 的外部湖仓支持范围将进一步扩大，对企业用户吸引力明显增强。

---

### 2) Iceberg REST Catalog 自定义 Header 支持，具备较高产品化价值
- Issue: [#61388](https://github.com/apache/doris/issues/61388)

**判断：中高概率被纳入**  
虽然当前还是 Issue，但需求非常具体，且符合 Iceberg REST catalog 实际部署标准。  
对接企业 API 网关、安全代理、私有鉴权体系时，这类能力经常是“阻塞落地”的关键项，因此被采纳概率不低。

---

### 3) 全局单调递增 TSO，透露事务能力演进方向
- PR: [#61199](https://github.com/apache/doris/pull/61199)

**判断：战略级路线图信号**  
TSO 往往与全局事务排序、分布式一致性、跨组件时间戳协调有关。  
即使短期内不一定快速合并，它也清楚表明 Doris 在事务语义和系统级协调能力上正在探索更强支撑。

---

### 4) 回收站三阶段保留策略
- PR: [#61504](https://github.com/apache/doris/pull/61504)

**判断：中概率进入后续版本**  
这属于数据生命周期治理能力增强，偏运维与存储治理。  
对于企业生产环境，细粒度保留策略有助于平衡误删恢复、存储占用和清理时效。

---

### 5) 向量检索 on-disk IVF 索引
- PR: [#61160](https://github.com/apache/doris/pull/61160)

**判断：中高概率进入新版本或实验特性**  
该能力很契合当前向量检索与 AI 检索增强场景，且解决了内存容量瓶颈。  
如果 Doris 持续布局多模分析，这会是很有代表性的能力点。

---

### 6) 新 SQL 函数需求 `SPLIT_BY_STRING(..., ..., limit)`
- Issue: [#55788](https://github.com/apache/doris/issues/55788)

**判断：短期纳入概率较低**  
该需求今日被 Stale 关闭，说明维护者当前优先级不在这里。  
但它反映出用户对字符串处理函数仍有较多兼容性/易用性需求，未来仍可能以新提案形式回归。

---

## 7. 用户反馈摘要

### 1) 企业用户对“生态接入细节”要求越来越高
- 相关 Issue: [#61388](https://github.com/apache/doris/issues/61388)

用户已不满足于“支持 Iceberg/REST Catalog”这一层面，而是要求 Doris 能处理企业网关、自定义 HTTP Header、鉴权代理等复杂部署现实。  
这说明 Doris 的使用场景正在从实验性接入走向生产级深度整合。

---

### 2) ETL/插件链路中，字段映射正确性仍是痛点
- 相关 Issue: [#56355](https://github.com/apache/doris/issues/56355)

Kettle Stream Load 插件字段顺序 bug 反映，外围生态工具链在 schema 对齐、列顺序处理和序列化上还有坑点。  
对数据工程用户来说，这类问题比单纯报错更难排查，因为它可能直接造成“数据错位写入”。

---

### 3) UDF 场景的开发体验仍需打磨
- 相关 Issues: [#37083](https://github.com/apache/doris/issues/37083), [#56229](https://github.com/apache/doris/issues/56229)

用户反馈集中在两类：  
- 自定义函数与系统函数命名冲突  
- Java UDF 在网络地址类型等特殊逻辑上的开发适配问题  

这说明 Doris 虽支持 UDF 扩展，但在命名解析、类型系统边界、调试体验上仍有提升空间。

---

### 4) 观测性与性能分析能力是开发者和高级用户的真实诉求
- 相关 PRs: [#61601](https://github.com/apache/doris/pull/61601), [#61603](https://github.com/apache/doris/pull/61603)

从今天的 PR 方向看，开发团队也在回应这一诉求：  
不仅要让查询执行快，还要让 profile 数据准确、trace 结构更清晰。  
这通常出现在系统复杂度提升后，是走向成熟平台的重要信号。

---

## 8. 待处理积压

以下长期未完全解决的问题或 PR 值得维护者重点关注：

### 1) 逻辑视图聚合查询失败修复 PR 长期停滞
- PR: [#56249](https://github.com/apache/doris/pull/56249)

**提醒：**  
该问题涉及逻辑视图 + 聚合查询失败，属于 SQL 正确性问题，但 PR 已带 Stale。  
建议维护者判断是否仍适用于当前主干，并决定继续推进、拆分重提或关闭说明。

---

### 2) File Cache 2Q-LRU 热点保护 PR 持续时间较长
- PR: [#57410](https://github.com/apache/doris/pull/57410)

**提醒：**  
这是较有价值的缓存机制优化，但从 2025-10 至今仍未落地。  
建议尽快明确性能收益、回归风险和可配置策略，否则容易长期卡在“有价值但不好 merge”的状态。

---

### 3) 全局 TSO 为高价值但高复杂度特性，需持续投入评审资源
- PR: [#61199](https://github.com/apache/doris/pull/61199)

**提醒：**  
TSO 涉及系统级语义，若长期停留在评审中，容易形成高关注但难落地的路线图债务。  
建议维护者尽早给出范围控制、实验性边界或分阶段合并策略。

---

### 4) Kettle Stream Load 插件 bug 尚无配套修复 PR
- Issue: [#56355](https://github.com/apache/doris/issues/56355)

**提醒：**  
该问题直接影响实际数据接入正确性，建议优先确认是否由插件仓库单独维护、是否需要迁移到对应组件处理。

---

### 5) IPv4/IPv6 UDF 开发问题仍开放
- Issue: [#56229](https://github.com/apache/doris/issues/56229)

**提醒：**  
虽然不一定是高频主路径问题，但 UDF 生态对高级用户很重要。  
建议至少补充复现方式、兼容性说明或文档约束，避免问题长期悬而未决。

---

## 附：今日重点链接汇总

- Good First Issue 社区入口: [#17176](https://github.com/apache/doris/issues/17176)
- Delta Lake Catalog 支持: [#61602](https://github.com/apache/doris/pull/61602)
- SummaryProfile 指标修复: [#61601](https://github.com/apache/doris/pull/61601)
- SummaryProfile 动态追踪重构: [#61603](https://github.com/apache/doris/pull/61603)
- MaxCompute connector 修复: [#61245](https://github.com/apache/doris/pull/61245)
- Outfile 并行导出竞争修复: [#61223](https://github.com/apache/doris/pull/61223)
- ANN on-disk IVF 索引: [#61160](https://github.com/apache/doris/pull/61160)
- TSO 能力演进: [#61199](https://github.com/apache/doris/pull/61199)
- Iceberg REST 自定义 Header 需求: [#61388](https://github.com/apache/doris/issues/61388)
- Kettle Stream Load 插件 bug: [#56355](https://github.com/apache/doris/issues/56355)

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的简版摘要**，或  
2. **按“查询引擎 / 存储 / 湖仓生态 / 稳定性”四象限重组的技术版周报格式**。

---

## 横向引擎对比

以下是基于 2026-03-23 各项目社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# 2026-03-23 OLAP / 分析型存储引擎开源生态横向分析报告

## 1. 生态全景

过去 24 小时，开源 OLAP 与分析型存储生态整体呈现出 **“高频迭代 + 稳定性补强 + 湖仓/对象存储集成深化”** 的明显特征。  
从动态结构看，Apache Doris、Apache Iceberg、Apache Arrow、DuckDB、Gluten 等项目活跃度较高，且大量变更聚焦于 **查询正确性、执行器观测性、对象存储访问、外部表格式兼容、事务/返回语义**。  
湖仓生态继续成为主线：Delta Lake、Iceberg、Paimon、OpenSearch、MaxCompute、Iceberg REST、S3/ADLS/GCS 等外围系统正越来越深地嵌入分析引擎路线。  
同时，项目成熟度分化明显：有些项目仍在快速扩功能边界，有些则更集中于 **测试治理、兼容性修复、分支稳定性与工程质量收敛**。  
整体上，这一生态正在从“单点高性能查询”继续演进到“统一分析层 + 多源接入 + 更强可观测/可运维能力”的阶段。

---

## 2. 各项目活跃度对比

> 说明：ClickHouse 今日摘要生成失败，因此以下表格标记为 N/A。

| 项目 | Issues 更新 | PR 更新 | Release | 今日重点方向 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 6 | 26 | 无 | Delta Lake Catalog、Profile/Trace、缓存/扫描优化、ANN、连接器修复 | **高**：功能推进与稳定性治理并行，节奏快 |
| **DuckDB** | 10 | 8 | 无 | RETURNING 事务语义、C API 稳定性、CLI/UTF-8、Windows 兼容 | **高**：修复闭环快，但 v1.5.0 周边暴露若干稳定性问题 |
| **StarRocks** | 2 | 4 | 无 | OpenSearch connector、column buffer、Iceberg cache 正确性 | **中高**：活跃度不高，但有高价值缺陷与方向性开发 |
| **Apache Iceberg** | 2 | 21 | 无 | Spark 正确性、Kafka Connect、迁移兼容、多云 FileIO | **高**：PR 活跃，修复响应快，工程健康较好 |
| **Delta Lake** | 1 | 1 | 无 | 治理透明度、Spark/UC 测试门控 | **中**：节奏偏缓，当前以治理与兼容维护为主 |
| **Databend** | 0 | 6 | **v1.2.890-nightly** | partitioned hash join、table branch、Fuse 存储重构 | **中高**：核心团队驱动明显，方向清晰 |
| **Velox** | 0 | 8 | 无 | Spark 兼容函数、S3 线程池配置、Paimon、GPU/PyTorch 探索 | **中高**：底层基础设施持续推进，用户反馈面较弱 |
| **Apache Gluten** | 5 | 9 | 无 | Spark 4.x 测试治理、S3 性能、Velox 上游依赖、Join 策略优化 | **高**：活跃且问题导向明确，但上游依赖是关键变量 |
| **Apache Arrow** | 20 | 6 | 无 | ORC predicate pushdown、Parquet 可观测性、CI/平台兼容性 | **中高**：Issue 活跃，偏成熟项目的持续演进与治理 |
| **ClickHouse** | N/A | N/A | N/A | 摘要缺失 | **N/A** |

### 简要分层
- **高活跃第一梯队**：Doris、Iceberg、DuckDB、Gluten  
- **中高活跃且方向清晰**：Arrow、Databend、Velox、StarRocks  
- **低活跃/维护节奏型**：Delta Lake  
- **缺失数据**：ClickHouse

---

## 3. Apache Doris 在生态中的定位

### 3.1 相比同类项目的优势

**Apache Doris 当前最突出的优势，是“统一分析引擎 + 湖仓/联邦接入 + 工程推进速度”三者兼顾。**

和同类项目相比：

- **相较 StarRocks**：两者都在强化外部数据源和湖仓能力，但 Doris 今日展现出的活跃面更广，覆盖了 **Delta Lake、MaxCompute、Iceberg REST、ANN、Query Profile/Trace、File Cache、TSO** 等多个层面，路线更“平台化”。
- **相较 DuckDB**：DuckDB 强于嵌入式、本地分析与开发者生态；Doris 更偏向 **分布式 OLAP 服务化部署、统一查询层、生产集群能力**。
- **相较 Iceberg / Delta Lake**：后两者本质上更偏表格式和数据湖协议层；Doris 是计算与服务层，更关注 **查询执行、联邦访问、存算协同和在线分析能力**。
- **相较 Databend**：Databend 在存储重构和版本化/table branch 等方向有差异化探索；Doris 的优势在于 **社区规模更成熟、功能面更完整、企业连接器/外部表生态更广**。
- **相较 Velox / Gluten / Arrow**：这些项目更多是执行内核、加速层或基础组件；Doris 直接提供面向用户的完整数据库产品形态。

### 3.2 技术路线差异

Doris 这一天的动态显示出它的技术路线非常明确：  
**不是单纯做“快查询”，而是朝“统一数据分析平台”演进。**

主要特征包括：

1. **湖仓接入持续扩张**  
   - Delta Lake Catalog 支持是今天最强的路线信号之一。  
   - 再加上 Iceberg、Hive、MaxCompute 等，Doris 正在构建更完整的外部数据访问矩阵。

2. **执行引擎与可观测性同步增强**  
   - SummaryProfile 修复与 QueryTrace/ProfileSpan 重构同时推进，说明 Doris 已进入“复杂系统可诊断性”建设阶段。

3. **从传统 OLAP 向多模分析扩展**  
   - ANN on-disk IVF 索引显示 Doris 正在把向量检索纳入核心能力组合。

4. **工程治理保持较强节奏**  
   - 主干开发、分支 cherry-pick、Stale 清理并行，说明维护流程较成熟。

### 3.3 社区规模对比

从今日数据看，Doris 的 **PR 活跃度（26）在样本项目中处于最高梯队**，明显高于 StarRocks（4）、Databend（6）、Velox（8）、DuckDB（8）。  
同时，Doris 的社区入口型 Issue（Good First Issue）有 **187 条评论、37 个点赞**，这在同日样本中是非常突出的外部参与信号。  
这说明 Doris 不仅有核心团队驱动，也具备较强的 contributor pipeline，这一点比很多“核心开发者主导、外部用户反馈较弱”的项目更有社区扩张优势。

**结论**：  
Apache Doris 当前位于开源分析引擎生态中的 **第一梯队平台型项目**，核心特征是：
- 社区活跃度高
- 功能推进面广
- 湖仓与联邦能力持续增强
- 工程化治理成熟
- 正在向“多源统一分析 + 可观测 + AI/向量能力”综合平台演化

---

## 4. 共同关注的技术方向

以下是多个项目同时涌现的共性技术方向：

### 4.1 湖仓 / 外部表格式 / 连接器集成持续升温
**涉及项目：Doris、StarRocks、Iceberg、Velox、Gluten、Arrow、Delta Lake**

具体表现：
- Doris：Delta Lake Catalog、Iceberg REST Header、MaxCompute connector
- StarRocks：OpenSearch connector、Iceberg metadata cache 问题
- Iceberg：Delta→Iceberg 转换、Hive 子目录迁移、多云 FileIO
- Velox：Paimon append table read
- Gluten：Velox/S3、Spark 4.x、依赖 Velox 上游能力
- Arrow：ORC predicate pushdown
- Delta Lake：Spark/UC 版本门控

**共性诉求：**
- 不只是“支持某格式”，而是要求 **生产级兼容性、鉴权能力、缓存一致性、迁移工具链、性能优化与诊断能力**。

---

### 4.2 对象存储 / 云存储访问效率与线程模型
**涉及项目：Gluten、Velox、Iceberg、Arrow、Doris**

具体表现：
- Gluten：S3 大 executor.cores 场景吞吐差，新增 executor pool config
- Velox：S3 executor pool size 配置
- Iceberg：GCS/ADLS 404 行为不一致
- Arrow：ORC/Parquet 读写路径优化，平台构建兼容性
- Doris：File Cache 2Q-LRU、文件缓存热点保护

**共性诉求：**
- 对象存储已成为主流事实存储层，分析引擎需要解决：
  - 高并发线程膨胀
  - 请求模型与缓存策略
  - 云存储错误语义一致性
  - 大扫描场景下的吞吐稳定性

---

### 4.3 正确性优先：事务语义、缓存一致性、SQL 语义边界
**涉及项目：DuckDB、StarRocks、Iceberg、Databend、Arrow、Doris**

具体表现：
- DuckDB：`DELETE RETURNING` 同事务可见性错误
- StarRocks：Iceberg cache 可能导致静默错误结果
- Iceberg：Kafka Connect 多 topic 误写、stale DataWritten 混入提交
- Databend：UNION 括号语义丢失
- Arrow：Gandiva 极值崩溃
- Doris：outfile 并发导出竞争、倒排索引 reader 选择不确定、搜索 DSL 斜杠解析错误

**共性诉求：**
- 分析引擎已不再只拼性能，**结果正确性、事务边界、缓存一致性和边缘 SQL 兼容性** 成为决定生产可用性的关键。

---

### 4.4 可观测性、Profile、测试真实性、CI 健康
**涉及项目：Doris、Gluten、DuckDB、Arrow、StarRocks、Iceberg**

具体表现：
- Doris：SummaryProfile 修复 + 动态追踪重构
- Gluten：Spark 4.x 测试真实性、PlanStability golden files
- DuckDB：CLI 崩溃、debug abort、事务回归修复
- Arrow：sanitizer、macOS 构建失败、文档/CI 修复
- StarRocks：UT 不稳定修复并回移分支
- Iceberg：flaky test 快速闭环

**共性诉求：**
- 开源分析系统复杂度上升后，社区焦点已明显转向：
  - 真实可诊断
  - 测试不“假绿”
  - 多版本 CI 可控
  - 分支质量与发版信心提升

---

### 4.5 查询执行器向更智能的运行时优化演进
**涉及项目：Doris、Databend、Gluten、DuckDB**

具体表现：
- Doris：SegmentIterator 自适应 batch、QueryTrace/ProfileSpan、TSO 探索
- Databend：partitioned hash join、hash join 内存回收
- Gluten：执行后动态选择 join strategy
- DuckDB：InsertQueryNode 重构、DML 语义一致化

**共性诉求：**
- 执行器设计正在从“静态计划执行”转向“更强运行时感知、内存控制和事务/结果回显一致性”。

---

## 5. 差异化定位分析

## 5.1 存储格式 / 数据访问定位

| 项目 | 核心定位 |
|---|---|
| **Apache Doris** | 自有 OLAP 存储 + 外部湖仓/联邦接入并重 |
| **StarRocks** | 高性能 MPP OLAP，强化外部 catalog/湖仓连接器 |
| **DuckDB** | 嵌入式分析数据库，本地文件/应用内分析为强项 |
| **Apache Iceberg** | 开放表格式与元数据层，不是查询引擎 |
| **Delta Lake** | 事务型表格式/协议层，依赖外部执行引擎 |
| **Databend** | 云原生数仓，Fuse 存储引擎为核心差异 |
| **Velox** | 执行引擎/向量化内核，不直接是完整数据库 |
| **Gluten** | Spark 原生执行加速层，连接 Spark 与后端引擎 |
| **Arrow** | 列式内存格式 + I/O / 计算基础设施 |

---

## 5.2 查询引擎设计差异

- **Doris / StarRocks / Databend**：完整分布式分析数据库，面向在线分析服务。
- **DuckDB**：单机嵌入式执行内核，强调开发者体验、本地分析、轻事务工作流。
- **Velox / Gluten**：更偏“执行层组件化”，服务于 Spark/Presto 等上层系统。
- **Arrow**：偏基础库，提供格式、向量、扫描、表达式等能力，但不是端到端 OLAP 数据库。
- **Iceberg / Delta Lake**：是表格式与事务层，不直接提供完整 SQL 查询服务。

---

## 5.3 目标负载类型差异

| 项目 | 典型负载 |
|---|---|
| **Doris** | 实时数仓、联邦查询、湖仓分析、服务化 BI、向量检索扩展 |
| **StarRocks** | 高并发分析、湖仓查询、日志/检索数据联合分析 |
| **DuckDB** | 嵌入式分析、数据科学、本地 ETL、应用内 OLAP |
| **Iceberg / Delta Lake** | 湖仓表管理、批流一体元数据层 |
| **Databend** | 云原生分析、对象存储上的数仓负载 |
| **Velox / Gluten** | 作为其他系统的执行后端或加速层 |
| **Arrow** | 数据交换、列式扫描、跨语言互操作、构建上层引擎能力 |

---

## 5.4 SQL 兼容性重点差异

- **Doris / StarRocks**：面向数据库用户，关注 SQL 功能广度、优化器、外部表一致性。
- **DuckDB**：强调 SQL 易用性、链式表达式、DML RETURNING、嵌入式事务语义。
- **Databend**：仍在快速补齐复杂 SQL 语义边角，如 set operation 括号优先级。
- **Gluten / Velox**：更关注和 Spark/Presto 语义对齐，而不是独立 SQL 方言扩展。
- **Arrow**：更多是下层函数与扫描能力，而非完整 SQL 方言。

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：快速迭代 + 多线推进
- **Apache Doris**
- **Apache Iceberg**
- **DuckDB**
- **Apache Gluten**

特征：
- PR/Issue 数量高
- 新功能与修复同时推进
- 社区讨论持续
- 有明显路线图信号

### 第二层：中高活跃 + 聚焦方向型
- **Apache Arrow**
- **Databend**
- **Velox**
- **StarRocks**

特征：
- 活跃度略低于第一层
- 更偏特定主线推进
- 有一定积压项待处理
- 进入“结构性优化 + 关键问题收敛”阶段

### 第三层：低活跃 / 节奏较缓
- **Delta Lake**

特征：
- 当日更新少
- 治理/兼容类事项多于功能扩展
- 社区信号较弱，但并不代表项目价值低，更像阶段性平稳期

---

## 6.2 成熟度判断

### 处于“快速扩边界”阶段
- **Doris**：湖仓、向量检索、TSO、观测性同步扩展
- **Databend**：table branch、partitioned hash join、Fuse 抽象重构
- **Velox**：Paimon、S3 运行时配置、GPU/PyTorch 探索
- **Gluten**：Spark 4.x 兼容加速、运行时优化设想

### 处于“质量巩固”阶段
- **DuckDB**：v1.5.0 周边修复密集，强调事务语义与 API 稳定性
- **StarRocks**：测试稳定性治理 + 严重正确性问题跟踪
- **Arrow**：CI/平台兼容、ORC/Parquet 基础能力增强
- **Iceberg**：连接器正确性、迁移兼容、多云一致性修补

### 处于“治理/兼容性维护”阶段
- **Delta Lake**

---

## 7. 值得关注的趋势信号

## 7.1 “统一分析层”正成为主流方向
无论是 Doris、StarRocks，还是 Velox/Gluten 与 Iceberg/Delta 的组合，都在说明一个趋势：  
**未来分析系统不再是单一存储或单一执行器，而是围绕多源数据、开放表格式、对象存储和统一 SQL 分析层构建。**

**对架构师的参考价值：**
- 新架构选型时，应优先评估系统的外部表格式兼容、缓存一致性和对象存储调优能力，而不是只看单机 benchmark。

---

## 7.2 查询正确性正在重新成为第一优先级
今天多个项目暴露的问题都不是纯性能问题，而是：
- 错误结果
- 事务可见性不一致
- SQL 语义错误
- 多 topic 误写
- 缓存 stale 导致结果失真

**对数据工程师的参考价值：**
- 在评估引擎时，应把以下能力列入 P0 验证：
  - 同事务 DML 语义
  - 外部表缓存刷新机制
  - 并发导出/写入正确性
  - 边缘 SQL 兼容性
  - CDC/连接器提交边界

---

## 7.3 对象存储调优能力已成为生产落地分水岭
S3 / GCS / ADLS 相关问题在多个项目同时出现，说明对象存储已不是“外围适配”，而是主战场。  
真正决定可用性的，不只是能否读写，而是：
- 线程池模型
- cache 行为
- 错误语义
- stripe/row group 裁剪
- 高并发下的资源控制

**建议：**
- 面向湖仓架构的团队，需要把对象存储访问模型纳入基准测试，而不只测 SQL 执行速度。

---

## 7.4 可观测性和测试真实性正在成为成熟项目标志
Doris 的 Profile/Trace、Gluten 的真实启用测试、Arrow 的 sanitizer、StarRocks 的分支回移、Iceberg 的 flaky 快速闭环，都说明一个行业共识：  
**随着系统复杂度上升，“测得对、看得见、排得出”比单次性能数字更重要。**

**对技术负责人建议：**
- 选型时要评估：
  - Profile/Trace 是否准确
  - CI 是否能反映真实行为
  - 多版本兼容是否有清晰门禁
  - 分支维护是否有稳定 cherry-pick 机制

---

## 7.5 分析引擎正在吸收 AI / 向量检索 / 半结构化能力
- Doris：ANN on-disk IVF
- Velox：GPU/PyTorch 探索
- Gluten：VariantType / runtime-aware join
- DuckDB：嵌入式事务+分析进一步融合

这表明分析系统正在从传统 BI / 数仓引擎，扩展到更广义的数据计算平台。

**对架构师参考：**
- 若未来要兼顾 BI、搜索增强、AI 检索、半结构化分析，优先关注那些已经在执行器或索引层做前置布局的项目。

---

# 结论

如果从今天的横向观察做一句话总结：

**2026 年的开源 OLAP/分析型存储生态，正在从“高性能查询引擎竞争”升级为“统一分析平台能力竞争”，核心战场已转向湖仓兼容、对象存储生产化、正确性保障、执行器观测性与多模分析扩展。**

而在这一格局中：

- **Apache Doris**：是最具平台化扩张势头的项目之一，兼顾湖仓、联邦、可观测性、向量检索与工程治理；
- **DuckDB**：继续巩固嵌入式分析内核地位，但短期重点是稳定性与事务语义完善；
- **StarRocks**：在生态连接与底层性能上持续投入，但需优先解决外部表正确性风险；
- **Iceberg / Delta Lake**：仍是湖仓格式层核心，但焦点更多在兼容性、连接器和治理；
- **Databend / Velox / Gluten / Arrow**：分别在云原生存储、执行内核、Spark 加速与基础列式能力上承担关键生态角色。

如果你愿意，我下一步可以继续把这份内容整理成以下任一种格式：

1. **适合飞书/Slack 发布的 1 页简版**
2. **适合管理层汇报的“项目雷达图 + 风险清单”版**
3. **按“Doris 对标 StarRocks / DuckDB / Databend”的深度竞品版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-23

## 1. 今日速览

过去 24 小时 DuckDB 项目保持中高活跃：Issues 更新 10 条、PR 更新 8 条，虽然没有新版本发布，但围绕 **事务语义、C API 扩展稳定性、CLI 行为一致性、Windows 兼容性** 的讨论明显升温。  
当天新增与活跃问题中，**`RETURNING` 语义正确性**、**扩展 API 的健壮性**、**CLI/UTF-8/文件打开崩溃类问题** 是主要焦点。  
PR 侧则出现了与 Issue 紧密配套的修复，例如 `DELETE RETURNING` 同事务返回空结果已直接给出修复 PR，显示维护者与贡献者对回归/正确性问题响应较快。  
总体来看，项目当前健康度仍然较好，但 **v1.5.0 周边暴露出若干 CLI、事务边界与扩展接口稳定性问题**，短期内可能继续迎来一轮修复型提交。

---

## 3. 项目进展

### 已关闭 / 已合并的重要 PR

#### 1) 将 INSERT 表示重构为 `InsertQueryNode`
- PR: [#21518](https://github.com/duckdb/duckdb/pull/21518)
- 状态: CLOSED
- 说明: 将 `INSERT` DML 语句统一纳入 `QueryNode` 体系，令 `InsertStatement` 成为轻量包装器。

**意义分析：**
- 这是典型的编译器/解析器内部架构重构，目标是让 DML 语句与 `SELECT` 一样走更一致的表示层。
- 对后续功能扩展有直接好处：例如 `RETURNING`、`CTE`、优化器规则复用、binder/planner 一致化。
- 虽然这类 PR 对终端用户不可见，但它通常是后续 SQL 能力增强的基础设施，尤其利于复杂 DML 的标准化实现。

---

#### 2) `StructVector` 与 `DataChunk` 布局统一
- PR: [#21534](https://github.com/duckdb/duckdb/pull/21534)
- 状态: CLOSED
- 说明: 将 `StructVector` 的内部布局调整为与 `DataChunk` 更一致。

**意义分析：**
- 这是执行引擎和列式向量内部表示层的优化/统一。
- 有助于编写泛型算子或通用向量处理逻辑，降低不同容器间的适配复杂度。
- 对分析型引擎来说，这类数据结构统一通常能减少实现分叉，提升未来 SIMD/向量化算子维护效率，并降低 bug 面。

---

### 今日推进中的关键 PR

#### 3) 修复 `DELETE RETURNING` 在同事务插入行上的错误返回
- PR: [#21541](https://github.com/duckdb/duckdb/pull/21541)
- 对应 Issue: [#21540](https://github.com/duckdb/duckdb/issues/21540)
- 状态: OPEN

**推进内容：**
- 修复同一显式事务内刚插入的数据再被 `DELETE ... RETURNING` 删除时，`RETURNING` 结果集为空的问题。
- 根因在于 `table.Fetch()` 仅读取已提交 row groups，遗漏 transaction-local storage。

**影响面：**
- 这是典型的 **事务可见性 + 返回结果正确性** 问题。
- 影响使用 DuckDB 进行 ETL、数据修正、带回显的 DML 工作流，以及嵌入式程序中依赖 `RETURNING` 获取删除行内容的场景。
- 若此 PR 合入，预计将显著提升 DML 在复杂事务中的 SQL 语义一致性。

---

#### 4) 修复 C API 读取未知配置项时 debug 构建直接 abort
- PR: [#21544](https://github.com/duckdb/duckdb/pull/21544)
- 状态: OPEN

**推进内容：**
- 修复 `duckdb_client_context_get_config_option` 在传入未知 setting name 时 debug 版本直接中止进程的问题。

**意义分析：**
- 这是 **嵌入式场景 / SDK 稳定性** 的关键修复。
- 对 Rust、Python 外围绑定、第三方工具链、插件系统都很重要，因为宿主程序往往需要探测配置项，而不是因错误输入直接崩溃。
- 这类修复有助于 DuckDB 继续巩固其“可嵌入 OLAP 引擎”定位。

---

#### 5) Windows 长路径支持
- PR: [#20983](https://github.com/duckdb/duckdb/pull/20983)
- 状态: OPEN, Ready For Review

**推进内容：**
- 为 Windows 文件系统路径长度限制提供兼容方案，避免长路径导致文件访问失败。

**意义分析：**
- 对数据湖、本地缓存、多级目录分区表、自动生成深目录结构的分析工作流非常实用。
- 这属于典型的平台兼容性增强，若合入会显著改善 Windows 用户体验。

---

#### 6) 调整 OID 起始范围，减少与 PostgreSQL 生态冲突
- PR: [#20979](https://github.com/duckdb/duckdb/pull/20979)
- 状态: OPEN, stale, Ready For Review

**推进内容：**
- 让 DuckDB 的 Oids 从 20k 起步，以避免和 PostgreSQL 保留范围发生非预期冲突。

**意义分析：**
- 明显面向 **Postgres 兼容接口/生态对接**。
- 对依赖 `pg_type`、Postgres 驱动、兼容层或桥接工具的用户很重要。
- 这也是 DuckDB 持续强化“熟悉 PostgreSQL 生态接口”的一个信号。

---

## 4. 社区热点

### 1) `ifnull` 链式调用报错，`nullif` 却正常
- Issue: [#11907](https://github.com/duckdb/duckdb/issues/11907)
- 标签: reproduced
- 评论: 8

**热点原因：**
- 这是今日评论最多的活跃 Issue。
- 背后诉求并不只是单一函数 bug，而是 **函数链式调用语法的一致性**：用户期望 `ifnull` 与 `nullif` 作为相近语义的函数，在链式写法中有统一行为。

**技术分析：**
- 反映 DuckDB 在“语法糖/表达式重写”层面的边界仍存在不一致。
- 对 SQL 可用性来说，这类问题虽然不属于 crash，但会影响用户对语言设计一致性的信任。

---

### 2) `aggregate(df).*` 语法应等价于 `unnest(aggregate(df))`
- Issue: [#13055](https://github.com/duckdb/duckdb/issues/13055)
- 标签: reproduced, stale
- 评论: 6

**热点原因：**
- 涉及 struct/star expansion 语法在聚合结果上的可用性，属于高级 SQL 表达能力问题。
- 说明社区正在更深入地使用 DuckDB 的 **结构化类型 + 星号展开** 能力，而不仅是传统标量查询。

**技术分析：**
- 本质是 binder/parser 是否允许在聚合表达式结果上做 `struct.*` 展开。
- 如果未来修复，将提升 DuckDB 在嵌套结构、DataFrame 风格聚合输出、半结构化分析上的易用性。

---

### 3) `DELETE RETURNING` 同事务行为错误
- Issue: [#21540](https://github.com/duckdb/duckdb/issues/21540)
- 对应 PR: [#21541](https://github.com/duckdb/duckdb/pull/21541)

**热点原因：**
- 虽然评论数不高，但这是今天最值得关注的正确性问题之一。
- 直接关系到 ACID 事务中的可见性语义，且已经有配套修复提交。

**技术诉求：**
- 用户需要 DuckDB 在嵌入式事务工作流中，对 `RETURNING` 提供与主流数据库一致的行为。
- 这类需求典型来自应用程序编排、变更回显、同步逻辑与测试框架。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1 · 崩溃 / 内部错误

#### 1) v1.5.0 渲染 markdown 表格时遇到 em dash 触发 INTERNAL Error
- Issue: [#21545](https://github.com/duckdb/duckdb/issues/21545)
- 状态: CLOSED

**问题：**
- `.mode markdown` 输出包含 U+2014 `—` 时触发 `Utf8Proc::UTF8ToCodepoint` 内部错误。

**判断：**
- 属于 CLI 输出链路中的 UTF-8 编码/渲染异常。
- 尽管已关闭，但表明 v1.5.0 在 Unicode 输出处理上存在脆弱点，建议继续回归测试 markdown/table formatter。

---

#### 2) `.open musicbrainz-cmudb2026.db` 后 `.tables` 导致段错误
- Issue: [#21536](https://github.com/duckdb/duckdb/issues/21536)
- 状态: CLOSED
- 标签: fixed on nightly

**问题：**
- 打开特定数据库后执行 `.tables` 导致 segmentation fault。

**判断：**
- 这是更高优先级的 CLI/元数据读取稳定性问题。
- 好消息是 nightly 已修复，说明维护者对崩溃类问题响应较快。
- 建议关注该修复何时进入正式 patch release。

---

### P1/P2 · 查询正确性 / 事务语义

#### 3) `DELETE RETURNING` 对同事务插入行返回空结果
- Issue: [#21540](https://github.com/duckdb/duckdb/issues/21540)
- Fix PR: [#21541](https://github.com/duckdb/duckdb/pull/21541)
- 状态: OPEN / 有修复

**影响：**
- 删除操作本身成功，但 `RETURNING` 漏掉事务本地数据。
- 对依赖返回结果进行业务逻辑确认的应用存在隐藏风险。

---

#### 4) `ifnull` 链式调用报错
- Issue: [#11907](https://github.com/duckdb/duckdb/issues/11907)
- 状态: OPEN, reproduced

**影响：**
- SQL 语法行为不一致，损害表达式链式调用体验。
- 更偏向语言层正确性/一致性问题，严重性低于 crash，但影响开发体验。

---

#### 5) `aggregate(df).*` 语法错误
- Issue: [#13055](https://github.com/duckdb/duckdb/issues/13055)
- 状态: OPEN, reproduced, stale

**影响：**
- 高级 SQL 表达能力缺口。
- 对复杂 struct 聚合与 DataFrame 风格写法用户影响较大。

---

### P2 · C API / 扩展开发稳定性

#### 6) C API 扩展中的聚合函数在 state 为 constant vector 时可能 segfault
- Issue: [#21537](https://github.com/duckdb/duckdb/issues/21537)
- 状态: OPEN, under review

**影响：**
- 面向扩展开发者，属于引擎 API 合约边界问题。
- 一旦触发是原生层崩溃，严重性较高。
- 尽管复现样例不完整，但报告者指出“容易修”，值得尽快落地补丁。

---

#### 7) 持久化重复插入时 C API 出现内存泄漏
- Issue: [#21539](https://github.com/duckdb/duckdb/issues/21539)
- 状态: OPEN, needs triage

**影响：**
- 影响长期运行嵌入式应用、批量写入服务、边缘侧常驻进程。
- 如果属实，会削弱 DuckDB 作为持久化嵌入式分析存储引擎的稳定性口碑。

---

#### 8) 未知配置项导致 debug 构建 abort
- Issue/PR: [#21544](https://github.com/duckdb/duckdb/pull/21544)
- 状态: OPEN

**影响：**
- 对生产 release 影响可能有限，但对开发调试、绑定层测试非常不友好。
- 已有修复 PR，处理优先级较明确。

---

### P3 · CLI 行为一致性

#### 9) `-init` 在 `-cmd` 之前执行，阻止配置注入
- Issue: [#21535](https://github.com/duckdb/duckdb/issues/21535)
- 状态: OPEN, reproduced

**影响：**
- 与文档“参数按顺序处理”的预期不一致。
- 影响自动化脚本、CLI 启动模板、用 `-cmd` 给 `-init` 注入变量/宏的工作流。
- 更像启动流程设计/文档契约问题，但对 CLI 高级用户非常实际。

---

## 6. 功能请求与路线图信号

### 1) 为 HTTPUtil `RequestType` 增加 `OPTIONS`
- Issue: [#21533](https://github.com/duckdb/duckdb/issues/21533)
- 状态: OPEN, under review

**需求解读：**
- 用户希望 HTTP 工具层支持 `OPTIONS`，用于能力发现、协商、跨服务连接场景。

**路线图信号：**
- 这反映 DuckDB/扩展生态正更多与远程服务、对象存储、catalog、HTTP 数据接口结合。
- 若近期合入，说明核心库会继续补齐“嵌入式数据库 + 网络连接器/远端 catalog”能力。

---

### 2) 外部 Catalog 写操作的 `RETURNING` 投影下推
- Issue: [#21538](https://github.com/duckdb/duckdb/issues/21538)
- 状态: OPEN, under review

**需求解读：**
- 期望 `INSERT/DELETE/UPDATE ... RETURNING` 在扩展实现的外部 catalog 写算子上支持更合理的投影下推，而不是统一包一层 `LogicalProjection`。

**路线图信号：**
- 这是非常明确的 **可扩展执行引擎接口优化** 请求。
- 指向 DuckDB 对外部 catalog / remote table / extension write path 的进一步正规化。
- 如果被采纳，将提升扩展作者实现写操作返回列时的效率和一致性。

---

### 3) Windows 长路径支持
- PR: [#20983](https://github.com/duckdb/duckdb/pull/20983)

**路线图信号：**
- 虽不是“新功能”意义上的 SQL 能力，但属于平台兼容性增强。
- Ready For Review 状态表明该改动有进入后续版本的现实可能，尤其对企业 Windows 用户较关键。

---

### 4) OID 范围调整以增强 PostgreSQL 兼容性
- PR: [#20979](https://github.com/duckdb/duckdb/pull/20979)

**路线图信号：**
- 指向 DuckDB 在 PostgreSQL 兼容元数据层面继续打磨。
- 但当前带 stale 标签，短期进入下一版本的确定性不如 Windows 长路径支持高。

---

## 7. 用户反馈摘要

结合今日 Issues，可归纳出几类真实痛点：

### 1) 用户越来越依赖 DuckDB 处理“应用内事务型 DML + 分析”
- 代表问题: [#21540](https://github.com/duckdb/duckdb/issues/21540)
- 反馈要点:
  - 用户不只是跑离线分析 SQL，而是在同一事务中执行插入、删除并依赖 `RETURNING` 获取结果。
  - 这意味着 DuckDB 正被更多用作 **嵌入式 OLAP + 轻事务工作流引擎**。

### 2) 扩展开发者对 C API 稳定性要求提高
- 代表问题: [#21537](https://github.com/duckdb/duckdb/issues/21537), [#21539](https://github.com/duckdb/duckdb/issues/21539), [#21544](https://github.com/duckdb/duckdb/pull/21544)
- 反馈要点:
  - 用户在用 C API 写自定义聚合、持久化写入、配置探测。
  - 痛点集中在原生接口边界条件：崩溃、泄漏、未知参数处理不稳。
  - 这说明 DuckDB 已深入到 SDK、驱动、插件和长期运行服务中。

### 3) CLI 被用于脚本化和自动化，而不只是交互式查询
- 代表问题: [#21535](https://github.com/duckdb/duckdb/issues/21535), [#21545](https://github.com/duckdb/duckdb/issues/21545), [#21536](https://github.com/duckdb/duckdb/issues/21536)
- 反馈要点:
  - 用户关注启动参数顺序、markdown 输出、数据库打开后的元命令稳定性。
  - 说明 DuckDB CLI 已成为自动化流水线的一部分，要求更接近成熟数据库 shell 的行为确定性。

### 4) 高级 SQL 用户对语法一致性与结构化类型支持有更高期待
- 代表问题: [#11907](https://github.com/duckdb/duckdb/issues/11907), [#13055](https://github.com/duckdb/duckdb/issues/13055)
- 反馈要点:
  - 用户正在使用链式函数、struct 展开、聚合结构等高级表达能力。
  - 这反映 DuckDB 在分析型 SQL 创新上的吸引力，也暴露了边角语义仍需打磨。

---

## 8. 待处理积压

### 1) `aggregate(df).*` 语法问题已 stale，值得重新关注
- Issue: [#13055](https://github.com/duckdb/duckdb/issues/13055)

**原因：**
- 涉及 struct/star expansion 与聚合结果的 SQL 语义一致性。
- 这不是单纯语法小问题，而是高级结构化查询能力的一部分。
- 建议维护者明确：这是 parser 限制、binder 限制，还是文档应修正预期。

---

### 2) `ifnull` 链式调用问题长期未关闭
- Issue: [#11907](https://github.com/duckdb/duckdb/issues/11907)

**原因：**
- 已 reproduced，且评论活跃。
- 该问题影响用户对函数链语法的一致性理解，修复收益高、用户感知明显。

---

### 3) OID 冲突规避 PR 处于 stale
- PR: [#20979](https://github.com/duckdb/duckdb/pull/20979)

**原因：**
- 与 PostgreSQL 兼容性和生态协作有关。
- 如果团队有强化 pg 生态互操作的路线，该 PR 值得重新评审。

---

### 4) Windows 长路径支持 PR 处于待审
- PR: [#20983](https://github.com/duckdb/duckdb/pull/20983)

**原因：**
- 这是高价值的跨平台兼容增强。
- 对企业/桌面/本地开发环境影响面广，建议尽快完成 review。

---

## 结论

今天 DuckDB 的动态呈现出一个很清晰的趋势：**项目正从“高性能嵌入式分析数据库”继续向“可嵌入、可扩展、具备更完整事务与接口语义的通用分析执行内核”演进**。  
短期重点应放在三件事上：

1. **尽快合入并发布 v1.5.0 周边正确性/崩溃修复**，特别是 `DELETE RETURNING`、CLI 崩溃、UTF-8 输出问题。  
2. **加强 C API 与扩展开发路径的稳定性治理**，避免 segfault、leak、debug abort 影响生态扩展。  
3. **清理高价值积压项**，尤其是 SQL 一致性问题与平台兼容性 PR，以保持社区贡献转化效率。

如果你愿意，我还可以把这份日报进一步整理成：
- **适合发群/飞书的 1 分钟简报版**
- **面向技术管理者的风险追踪版**
- **Markdown 表格版周报模板**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-23）

## 1. 今日速览
过去 24 小时内，StarRocks 项目整体活跃度中等偏稳：Issues 更新 2 条、PR 更新 4 条，无新版本发布。  
代码侧以**测试稳定性修复收口**和**中长期功能开发推进**为主，已完成 1 个主线 PR 合并及其 1 个回移关闭。  
值得重点关注的是，一个与 **Iceberg 元数据缓存导致错误查询结果** 相关的严重 Bug 被持续跟进，这类“静默错误结果”问题对分析型数据库来说优先级很高。  
同时，OpenSearch 连接器与新列缓冲区实现两个功能型 PR 仍在推进，释放出 StarRocks 在**外部数据源连接能力**和**列式执行/存储底层优化**方面的路线图信号。

---

## 3. 项目进展

### 已合并 / 已关闭 PR

#### 1) #70606 `[UT] Fix unstable unit test failures introduced by fast-cancle lake replication txn`
- 状态：**已合并**
- 链接：<https://github.com/StarRocks/starrocks/pull/70606>

该 PR 主要修复由 “fast-cancle lake replication txn” 引入的**单元测试不稳定问题**。  
从性质上看，这不是直接面向用户的新功能或 SQL 行为变更，但它对项目健康度很关键：说明团队在 lake replication transaction 相关改动落地后，继续补齐测试体系，降低 CI 抖动和回归误报的风险。

**影响判断：**
- 对查询引擎功能：无直接新增能力；
- 对存储/事务稳定性：间接增强，尤其是 Lake Replication 相关事务路径的测试可信度；
- 对后续版本：有助于减少回归，提升 4.1 分支稳定性。

---

#### 2) #70619 `[UT] Fix unstable unit test failures introduced by fast-cancle lake replication txn (backport #70606)`
- 状态：**已关闭**
- 链接：<https://github.com/StarRocks/starrocks/pull/70619>

这是 #70606 的 **4.1.0 回移 PR**，由自动合并机器人处理并关闭，说明相关测试修复已经同步进入版本线。  
这类 backport 动作通常意味着维护者认为问题虽不影响功能语义，但会影响分支稳定性与发版质量，因此优先纳入维护分支。

**信号解读：**
- 4.1 版本线仍在进行稳定性打磨；
- 测试基础设施和事务相关路径的稳定性被持续关注。

---

### 仍在推进的重要 PR

#### 3) #69949 `[Enhancement] introduce a new column buffer`
- 状态：**Open**
- 链接：<https://github.com/StarRocks/starrocks/pull/69949>

这是一个值得重点跟踪的底层增强 PR。其目标是引入新的 **column buffer**，替代或补充当前基于 `std::vector` + `ColumnAllocator` 的列存储方式。  
PR 描述明确指出，通用容器在列式数据库场景下存在局限，说明该改动可能指向：

- 更好的列式内存布局；
- 降低 allocator 相关开销；
- 优化 append / resize / scan 的缓存友好性；
- 为后续向量化执行或高并发扫描提供更稳定的底层支撑。

**潜在价值：**
- 对查询执行性能和内存效率可能有长期正向影响；
- 若落地，可能成为后续一系列列式算子优化的基础设施。

---

#### 4) #70542 `[META-REVIEW] [Feature] Add OpenSearch connector (Phase 1 - HTTP)`
- 状态：**Open**
- 链接：<https://github.com/StarRocks/starrocks/pull/70542>

该 PR 增加 **OpenSearch 外部目录连接器** 的第一阶段能力，当前范围包括：

- HTTP 连接；
- 无认证；
- Schema discovery（索引、别名、mapping）；
- 基础 SELECT 查询支持。

这是一个非常明确的生态扩展信号，说明 StarRocks 正在继续强化外部数据源连接与联邦分析能力。  
虽然当前 Phase 1 范围较克制，不含 HTTPS/TLS 和认证，但已经足以验证连接器架构与基础查询路径。

**影响判断：**
- 对查询引擎：扩展外部表/外部 catalog 查询场景；
- 对 SQL 兼容性：体现在异构数据源接入，而非 SQL 语法本身；
- 对产品路线：很可能是后续完善安全能力、谓词下推、更多数据类型映射的起点。

---

## 4. 社区热点

> 注：今日数据中评论数和反应数整体较低，没有形成高评论线程；以下按技术重要性和潜在影响排序。

### 热点 1：Iceberg 缓存错误可能导致静默错误结果
#### #70522 `[Bug] Iceberg dataFileCache can serve permanently stale partial data, causing silent wrong query results`
- 状态：**Open**
- 链接：<https://github.com/StarRocks/starrocks/issues/70522>

这是今天最值得关注的社区热点。Issue 指出：在启用 Iceberg metadata cache 的场景下，`dataFileCache` 可能长期返回**部分过期数据**，从而导致**错误查询结果**，且错误可能是静默的。  
对 OLAP 数据库来说，这类问题严重程度高于一般 crash 或性能退化，因为它直接冲击结果正确性与用户信任。

**背后的技术诉求：**
- 外部表缓存一致性保证；
- Iceberg 元数据刷新与失效机制的正确性；
- 查询结果正确性优先于缓存命中收益；
- 对 partial/stale cache 的保护机制和可观测性提升。

---

### 热点 2：OpenSearch 连接器进入 Meta Review
#### #70542 `[META-REVIEW] [Feature] Add OpenSearch connector (Phase 1 - HTTP)`
- 状态：**Open**
- 链接：<https://github.com/StarRocks/starrocks/pull/70542>

该 PR 反映出用户和项目对**搜索引擎/日志检索系统与 OLAP 联动分析**的需求。  
OpenSearch 作为 Elasticsearch 生态的重要分支，其接入价值在于降低多系统间数据搬运成本，使 StarRocks 可直接参与日志、检索、监控类数据的分析。

**背后的技术诉求：**
- 更多异构数据源接入；
- 统一 SQL 分析入口；
- 降低 ETL 成本；
- 强化联邦查询/外部 catalog 场景。

---

### 热点 3：文档维护自动反馈
#### #70620 `[doc-feedback] Weekly documentation feedback from readers`
- 状态：**Open**
- 链接：<https://github.com/StarRocks/starrocks/issues/70620>

这是由 GitHub Actions 自动生成的文档反馈汇总，主要提醒 docs-maintainer 关注待处理文档 PR。  
虽然技术含量不如核心引擎问题高，但它释放了一个积极信号：项目在文档维护上具备自动化流程，社区反馈闭环相对成熟。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P0 / 高优先级：查询正确性风险
#### #70522 Iceberg dataFileCache 可能返回永久性陈旧的部分数据，造成错误查询结果
- 状态：**Open**
- 链接：<https://github.com/StarRocks/starrocks/issues/70522>
- 是否已有 fix PR：**暂无明确关联 fix PR**

**问题性质：**
- 影响查询正确性；
- 可能静默返回错误结果；
- 触发条件与 Iceberg catalog 的 metadata cache 配置有关。

**风险分析：**
- 这类问题对生产环境影响极大，尤其在外部湖仓数据实时更新频繁的场景；
- 如果 cache invalidation 粒度或版本校验逻辑存在缺陷，可能导致部分文件列表与真实快照不一致；
- “partial stale” 比全量 stale 更难排查，因为结果可能只在部分分区/文件上出错。

**建议关注：**
- 是否需要临时规避方案，如关闭相关 cache；
- 是否会补充一致性校验、版本戳或 snapshot-based invalidation；
- 是否需要增加回归测试覆盖外部表缓存刷新路径。

---

### P2 / 中优先级：测试稳定性问题
#### #70606 / #70619 Lake replication txn 相关单测不稳定
- #70606：<https://github.com/StarRocks/starrocks/pull/70606>
- #70619：<https://github.com/StarRocks/starrocks/pull/70619>

**问题性质：**
- 不影响用户查询语义；
- 主要影响 CI 稳定性与版本质量控制。

**当前状态：**
- 主线已修复；
- 维护分支已回移。

**评价：**
- 属于健康的工程治理动作；
- 说明团队对回归风险控制比较及时。

---

## 6. 功能请求与路线图信号

### 1) OpenSearch 连接器有较高概率进入后续版本
#### #70542 Add OpenSearch connector (Phase 1 - HTTP)
- 链接：<https://github.com/StarRocks/starrocks/pull/70542>

这是今天最明确的功能路线图信号。  
虽然还处于 Meta Review 阶段，但功能边界清晰、实现分阶段推进，符合 StarRocks 近年来持续扩展外部 catalog / connector 能力的趋势。

**纳入下一版本的可能性：较高**  
前提是：
- Phase 1 的 schema 发现与基础查询链路稳定；
- 映射规则、错误处理、基础性能达到可接受水平。

后续大概率演进方向：
- HTTPS/TLS；
- 认证机制；
- 更丰富的数据类型映射；
- 查询下推与过滤优化。

---

### 2) 新 column buffer 是底层性能路线的重要信号
#### #69949 introduce a new column buffer
- 链接：<https://github.com/StarRocks/starrocks/pull/69949>

该 PR 虽然不是直接的用户功能请求，但从架构意义上看很重要。  
它表明 StarRocks 可能正在对列式存储抽象和执行期内存结构进行持续重构，这类工作常常是后续性能提升、内存效率改善和 SIMD/向量化优化的前置条件。

**纳入下一版本的可能性：中等偏高**  
但其风险也更高，因为涉及底层数据结构，通常需要：
- 更严格的性能 benchmark；
- 更全面的兼容/正确性测试；
- 对现有 Column 体系的迁移评估。

---

### 3) 文档反馈中提到的 docs PR 也反映出外部表可观测性和 Iceberg DDL 需求
#### #70620 Weekly documentation feedback from readers
- 链接：<https://github.com/StarRocks/starrocks/issues/70620>

摘要中提到待关注的文档 PR 包括：
- “Add per-catalog-type query metrics for external table observability”
- “Support Iceberg ALTER TAB...”  

这说明社区对以下方向持续有需求：
- **外部表可观测性增强**；
- **Iceberg DDL/管理能力增强**。

这些虽未在今日直接合并，但从需求信号上看，与当前外部 catalog/湖仓生态建设方向高度一致。

---

## 7. 用户反馈摘要

### 1) 真实生产痛点：外部湖仓缓存一致性不足
来自 Issue #70522  
- 链接：<https://github.com/StarRocks/starrocks/issues/70522>

用户反馈表明，在启用 Iceberg metadata cache 的真实生产环境中，缓存可能返回错误数据，且问题严重到会影响结果可信度。  
这说明用户场景并非简单 PoC，而是已经在依赖 StarRocks 承担实际的 Iceberg 查询负载。

**提炼出的用户痛点：**
- 外部表缓存命中带来性能收益，但一致性问题不可接受；
- 用户需要更明确的 cache 行为说明、失效机制和排障手段；
- 在湖仓集成场景下，正确性优先级高于性能。

---

### 2) 用户场景在向更广泛的异构数据源扩展
来自 PR #70542  
- 链接：<https://github.com/StarRocks/starrocks/pull/70542>

OpenSearch connector 的推进表明，用户希望 StarRocks 不仅分析内部表或对象存储湖仓数据，还要直接联通搜索/日志系统。  
这反映出一个典型使用趋势：**把 StarRocks 作为统一分析层，而不是单一存储引擎。**

---

### 3) 文档流程自动化有助于降低社区使用门槛
来自 Issue #70620  
- 链接：<https://github.com/StarRocks/starrocks/issues/70620>

尽管今天没有具体评论讨论，但自动化汇总文档反馈本身说明维护者在意用户阅读体验和接入效率。  
对新用户尤其重要，因为外部 catalog、Iceberg、连接器等功能复杂，文档质量直接影响采用成本。

---

## 8. 待处理积压

### 1) #69949 新 column buffer PR 值得维护者持续关注
- 状态：Open
- 链接：<https://github.com/StarRocks/starrocks/pull/69949>

该 PR 创建于 2026-03-06，已持续一段时间仍未合并。  
考虑到其底层基础设施属性，如果长期悬而未决，可能影响一系列后续性能优化工作的推进。建议维护者：
- 明确 review blocking points；
- 补充 benchmark 和兼容性验证结论；
- 给出是否拆分提交的建议。

---

### 2) #70542 OpenSearch connector 处于关键评审窗口
- 状态：Open
- 链接：<https://github.com/StarRocks/starrocks/pull/70542>

该 PR 作为新连接器能力，当前处于 Meta Review，正是决定其是否纳入后续版本的重要阶段。  
建议维护者重点关注：
- 安全能力缺失是否允许以 Phase 1 形式先行合并；
- 查询下推边界和错误语义是否清晰；
- 与现有 external catalog 架构的一致性。

---

### 3) #70522 严重 Bug 需要尽快响应并关联修复
- 状态：Open
- 链接：<https://github.com/StarRocks/starrocks/issues/70522>

尽管该 Issue 更新时间较新，但从严重性看，不应在队列中停留过久。  
建议尽快：
- 标记优先级；
- 指派 owner；
- 给出临时规避建议；
- 创建并关联 fix PR / regression test PR。

---

## 总体健康度判断
今日 StarRocks 项目表现出**稳定推进、以工程质量和生态扩展并行**的特征：一方面测试稳定性修复已合并并回移到维护分支，体现出较好的发布治理；另一方面 OpenSearch connector 和 column buffer 等 PR 显示项目仍在持续投资未来能力。  
不过，Iceberg metadata cache 导致错误结果的 Bug 是当前最需要优先处理的风险点。如果该问题能在短期内得到明确修复或规避方案，项目整体健康度将保持良好。

--- 

如需，我可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的精简版**，或  
2. **按“引擎 / 存储 / 生态连接器 / 稳定性”分栏的周报模板版**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-23）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持较高活跃度：Issues 更新 2 条，PR 更新 21 条，其中 10 条仍待合并、11 条已合并或关闭，说明项目仍处于持续迭代与清理并行的状态。  
今日没有新版本发布，但 Spark、Kafka Connect、云存储 FileIO、数据迁移与测试稳定性等多个方向都有明显推进。  
从变更结构看，当前重点并不在大规模新特性落地，而是集中于 **Spark 正确性修复、连接器稳定性增强、跨云存储一致性、以及基础依赖升级**。  
项目整体健康度较好：活跃 PR 数量充足，问题发现到修复的闭环较快，尤其是新报出的 flaky test 已迅速出现对应修复 PR。  

---

## 3. 项目进展

### 3.1 今日关闭/合并的重要 PR

#### 1) Spark SQL transform 函数文档补齐
- **PR:** #15697 `[CLOSED] [docs] Docs: Document Spark SQL transform functions`
- **链接:** apache/iceberg PR #15697

该 PR 为 Spark 查询文档新增了 Iceberg system namespace 下的 SQL transform 函数说明，包括：
`iceberg_version`、`bucket`、`years`、`months`、`days`、`hours`、`truncate`。  
这直接回应了之前的文档改进需求，也表明 Iceberg 正在继续完善 Spark SQL 层面的可发现性与易用性。

**影响判断：**
- 提升 Spark 用户对 Iceberg transform 函数的可用性认知
- 降低 SQL 使用门槛，改善文档缺失导致的学习成本
- 对功能本身没有行为变更，但对生态采用有正向作用

---

#### 2) 一批 Java / Build 依赖升级 PR 已关闭
今日关闭了多条 Dependabot PR，涉及：
- **#15721** sqlite-jdbc 3.51.2.0 → 3.51.3.0  
- **#15723** grpc-netty-shaded 1.79.0 → 1.80.0  
- **#15722** jackson-bom 2.21.1 → 2.21.2  
- **#15720** AWS SDK BOM 2.42.13 → 2.42.18  
- **#15719** jettison 1.5.4 → 1.5.5  
- **#15718** RoaringBitmap 1.6.12 → 1.6.13  
- **#15717** spotless-plugin-gradle 8.3.0 → 8.4.0  
- **#15716** testcontainers 2.0.3 → 2.0.4  

**相关链接：**
- apache/iceberg PR #15721
- apache/iceberg PR #15723
- apache/iceberg PR #15722
- apache/iceberg PR #15720
- apache/iceberg PR #15719
- apache/iceberg PR #15718
- apache/iceberg PR #15717
- apache/iceberg PR #15716

**影响判断：**
- 这些变更大多属于底层依赖维护，不直接体现查询引擎新能力
- 但对 **构建稳定性、安全修复、测试环境兼容性、云连接依赖一致性** 有基础价值
- 说明维护者在持续清理依赖债务，项目工程健康度较好

---

#### 3) Spark 4.1 UUID writer 优化 PR 被关闭
- **PR:** #15302 `[CLOSED] [spark, stale] Spark 4.1: Optimize UUID writer with fast-path byte parsing.`
- **链接:** apache/iceberg PR #15302

该 PR 试图通过 UTF8String 的字节级 fast-path 解析优化 UUID 写入，减少 UTF-8 解码与字符串解析开销。  
虽然 PR 已关闭，但其方向非常明确：**提升 Spark 写路径中 UUID 类型的序列化性能**。

**影响判断：**
- 这是一次潜在的写入性能优化尝试
- 关闭状态说明该优化暂未进入主线，可能存在实现复杂度、维护成本或兼容性方面顾虑
- 对后续 Spark 4.1 性能调优仍有参考价值

---

## 4. 社区热点

> 注：给定数据里未提供明确评论排序值，多数 PR 的评论数显示为 undefined，因此以下热点基于“问题重要性、更新时效性、技术影响面”综合判断。

### 热点 1：Spark 远程扫描时间点查询测试不稳定
- **Issue:** #15724 `[OPEN] [bug] Flaky Test: TestRemoteScanPlanning > testTimestampAsOf()`
- **链接:** apache/iceberg Issue #15724
- **对应修复 PR:** #15725
- **链接:** apache/iceberg PR #15725

这是今天最值得关注的话题。问题集中在 Spark 3.4 / 3.5 回溯修复上，指出 `testTimestampAsOf()` 存在 flaky failure。紧接着就有修复 PR 提交，说明维护者对 **时间旅行 / 快照选择正确性** 非常敏感。

**背后的技术诉求：**
- `timestamp as of` 属于 Iceberg 核心能力，影响审计、回放、时点查询
- flaky test 通常意味着排序、时序依赖或快照选择逻辑存在不稳定因素
- 用户关心的不只是测试，而是“同一 SQL 在不同运行时是否能稳定选中同一快照”

---

### 热点 2：删除文件清理策略优化
- **PR:** #15727 `[OPEN] [spark, core] Core, Spark: scan based remove dangling delete action`
- **链接:** apache/iceberg PR #15727

该 PR 提出基于 scan 的方式移除 dangling delete files，尤其针对 equality delete 文件边界不重叠但仍被保留的问题。  
这是一个很有价值的存储维护优化方向，因为长期累积的无效 delete files 会拖慢扫描与元数据处理。

**背后的技术诉求：**
- 降低 delete 文件堆积对查询计划和扫描性能的拖累
- 提升表维护操作有效性，避免“逻辑上已无效、物理上仍保留”的存储噪音
- 这类优化对大规模 CDC / merge-on-read 使用场景尤为重要

---

### 热点 3：Kafka Connect 多 topic 路由错误
- **PR:** #15639 `[OPEN] [KAFKACONNECT] Fix multi-topic routing to prevent writing all records to all tables`
- **链接:** apache/iceberg PR #15639

该 PR 修复的是严重的路由逻辑缺陷：在未设置 `iceberg.tables.route-field` 时，如果多个 topic 共享相似 schema 和相同 id-columns，记录可能被错误写入所有表。

**背后的技术诉求：**
- 保证多 topic 场景下“topic 到 table”的严格映射
- 避免跨表污染与数据错误归档
- 对生产场景是高优先级问题，因为这不是单纯性能 bug，而是 **数据正确性风险**

---

### 热点 4：Hive 分区子目录文件迁移支持
- **PR:** #15388 `[OPEN] [data, stale] Data: Support listing files from hive partitions with subdirectories`
- **链接:** apache/iceberg PR #15388

该 PR 针对 Hive 表迁移时 partition location 下带子目录的场景。当前 `TableMigrationUtil` 不支持这类 listing，可能导致迁移时漏掉真实数据文件。

**背后的技术诉求：**
- 增强 Hive → Iceberg 迁移兼容性
- 适配历史包袱较重、目录布局不完全规范的存量湖仓
- 这是典型“企业落地迁移”中的真实需求，不是实验性功能

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Kafka Connect 多 topic 路由导致跨表误写
- **PR:** #15639 `[OPEN] [KAFKACONNECT] Fix multi-topic routing to prevent writing all records to all tables`
- **链接:** apache/iceberg PR #15639

**问题性质：**
- 多 topic 输入时，记录可能被广播写入所有表，而不是仅写入目标表

**影响：**
- 数据污染
- 下游分析结果错误
- 修复前不适合在共享 schema 的多 topic 场景放心使用

**状态：**
- 已有 fix PR，尚未合并

---

### P1：Kafka Connect stale DataWritten 事件导致错误提交
- **PR:** #15710 `[OPEN] [KAFKACONNECT] Fix stale DataWritten handling by separating commits into distinct RowDeltas`
- **链接:** apache/iceberg PR #15710

**问题性质：**
- 部分提交超时后，旧提交周期中延迟到达的 `DataWritten` 事件被错误混入下一次 commitBuffer
- 当前按 table 聚合，可能把 stale 和 current data files 混在同一 RowDelta 中提交

**影响：**
- 提交边界混乱
- 潜在数据一致性问题
- 对连接器 exactly-once / 幂等语义形成挑战

**状态：**
- 已有 fix PR，尚未合并

---

### P2：Spark `testTimestampAsOf()` flaky，影响时间旅行查询稳定性信心
- **Issue:** #15724 `[OPEN] [bug] Flaky Test: TestRemoteScanPlanning > testTimestampAsOf()`
- **链接:** apache/iceberg Issue #15724
- **Fix PR:** #15725 `[OPEN] [spark] Spark 3.4, 3.5: Backport #14894`
- **链接:** apache/iceberg PR #15725

**问题性质：**
- 测试不稳定，怀疑与 DataFrame collect 结果排序缺失有关

**影响：**
- 主要表现为 CI 不稳定
- 若根因外溢到生产逻辑，可能影响 Spark 时间点查询结果一致性

**状态：**
- 已有修复 PR，响应速度快

---

### P2：Spark `_partition` child ID 与 MAP/LIST 字段 ID 冲突
- **PR:** #15726 `[OPEN] [spark] Spark: fix _partition child ID collision with MAP/LIST columns in allUsedFieldIds`
- **链接:** apache/iceberg PR #15726

**问题性质：**
- `_partition` struct 子字段 ID 重新分配时，现有逻辑可能未正确考虑 MAP/LIST 嵌套字段，导致 ID 冲突

**影响：**
- 元数据列投影、扫描构建、schema ID 管理可能出现错误
- 这是典型内部 schema/field-id 正确性问题，虽隐蔽但风险较高

**状态：**
- 修复 PR 已提交，待评审

---

### P2：GCS / ADLS 404 处理不一致导致不必要重试
- **PR:** #15029 `[OPEN] [GCP, stale, AZURE] Fix inconsistent 404 handling in GCS and ADLS FileIO implementations`
- **链接:** apache/iceberg PR #15029

**问题性质：**
- GCS / ADLS 的 404 未统一转换为 `NotFoundException`
- 与 S3 行为不一致，可能触发 BaseMetastoreTableOperations 的不必要重试

**影响：**
- 云对象存储操作行为不一致
- 错误语义不统一，影响稳定性与性能
- 对多云部署用户尤其重要

**状态：**
- PR 长期未完成，值得关注

---

## 6. 功能请求与路线图信号

### 1) Spark SQL transform 函数文档需求已形成闭环
- **Issue:** #13156 `[CLOSED] [improvement, good first issue, spark, docs] Add docs of Spark SQL functions for Iceberg transforms`
- **链接:** apache/iceberg Issue #13156
- **对应 PR:** #15697
- **链接:** apache/iceberg PR #15697

该需求已关闭，说明文档层面的 SQL 兼容性补齐已被采纳并完成。  
这释放出一个信号：**Iceberg 正在持续增强 Spark SQL 生态的“可发现性”与“用户自助能力”**，不仅做引擎功能，也在补足文档入口。

---

### 2) Delta → Iceberg 转换能力持续演进
- **PR:** #15407 `[OPEN] [data, INFRA, docs, build] Delta: Updating Delta to Iceberg conversion`
- **链接:** apache/iceberg PR #15407

该 PR 旨在把 Delta Lake 迁移/转换能力更新到较新的 Delta 版本（read 3, write 7）。  
这代表 Iceberg 明显在加强 **跨湖格式迁移工具链**，对于吸纳 Delta 现有用户群非常关键。

**路线图信号：**
- 迁移工具兼容性会继续增强
- 文档、基础设施和构建测试会一起补齐
- 很可能成为后续版本的重要“易迁移”卖点之一

---

### 3) 元数据列 TCK 测试正在扩展
- **PR:** #15675 `[OPEN] [spark, data, flink] Data: Add TCK tests for Metadata Columns in BaseFormatModelTests`
- **链接:** apache/iceberg PR #15675

该 PR 为 metadata columns 增加 TCK 测试，覆盖：
- `FILE_PATH`
- `SPEC_ID`
- `ROW_POSITION`
- `IS_DELETED`
- lineage 字段如 `ROW_ID`、`LAST_UPDATED_SEQUENCE_NUMBER`
- 分区列及 transform / partition evolution

**路线图信号：**
- Iceberg 正在强化跨引擎一致性验证
- Spark / Flink / Data 层对元数据列的语义统一会成为重点
- 这通常是功能成熟化和规范化前的重要一步

---

### 4) Hive 表迁移兼容性需求可能进入下一版本
- **PR:** #15388 `[OPEN] [data, stale] Data: Support listing files from hive partitions with subdirectories`
- **链接:** apache/iceberg PR #15388

如果该 PR 被恢复推进，将显著改善复杂 Hive 表迁移质量。  
考虑到企业用户常见历史目录结构，这类兼容性增强进入下个版本的概率不低，但当前 `stale` 状态说明仍需维护者重新聚焦。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出以下真实用户痛点：

### 1) Spark 用户希望 SQL 能力“有功能也有文档”
- 相关链接：apache/iceberg Issue #13156
- 相关链接：apache/iceberg PR #15697

用户并非抱怨功能缺失，而是指出 Spark SQL transform 函数虽已存在，但缺少集中、系统化文档。  
这类反馈说明 Iceberg 的功能面已经较广，当前用户痛点逐渐从“没有功能”转向“功能能否快速被正确使用”。

---

### 2) 时间旅行能力的稳定性非常受关注
- 相关链接：apache/iceberg Issue #15724
- 相关链接：apache/iceberg PR #15725

即使只是测试 flaky，也会被快速提报和修复，说明用户和维护者都把 `timestamp as of` 看作核心能力。  
典型使用场景包括：
- 数据审计
- 历史回放
- 回溯分析
- 快照级验证

---

### 3) Kafka Connect 用户更在意“数据是否写对”，而不仅是“能不能写”
- 相关链接：apache/iceberg PR #15639
- 相关链接：apache/iceberg PR #15710

两条连接器相关 PR 都直接指向数据正确性与提交流程边界问题。  
这表明在生产接入场景中，用户最痛的不是吞吐，而是：
- topic/table 路由必须精确
- 延迟事件不能污染下一次提交
- 连接器必须具备可靠的一致性语义

---

### 4) 迁移用户需要更强的历史兼容性
- 相关链接：apache/iceberg PR #15388
- 相关链接：apache/iceberg PR #15407

无论是 Hive 子目录分区，还是 Delta 新版本转换支持，都说明真实采用场景里有大量异构遗留资产。  
用户希望 Iceberg 不只是“新建表格式”，而是“可承接存量数据湖升级”的中枢格式。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期未决 PR：

### 1) #15388 Hive 分区子目录迁移支持
- **状态:** OPEN / stale
- **链接:** apache/iceberg PR #15388

**原因：**
- 直接关系 Hive → Iceberg 迁移完整性
- 不支持子目录 listing 会造成数据文件遗漏，属于高实际影响兼容性问题
- 建议重新评估优先级，避免迁移用户踩坑

---

### 2) #15092 Replace transaction rebase onto refreshed metadata
- **状态:** OPEN / stale / WIP
- **链接:** apache/iceberg PR #15092

**原因：**
- 针对 `commitReplaceTransaction()` 在并发变更下提交 stale metadata 的问题
- 涉及 replace transaction 与 refreshed metadata 的重放/rebase 逻辑
- 这是偏底层但影响很深的并发正确性问题，值得核心维护者关注

---

### 3) #15029 GCS / ADLS FileIO 404 语义统一
- **状态:** OPEN / stale
- **链接:** apache/iceberg PR #15029

**原因：**
- 多云存储行为一致性是企业部署核心诉求
- 404 处理不统一会引入重试噪音和错误传播差异
- 建议优先完成，以提升 S3/GCS/ADLS 行为一致性

---

### 4) #15407 Delta 转 Iceberg 转换能力升级
- **状态:** OPEN
- **链接:** apache/iceberg PR #15407

**原因：**
- 迁移工具是 Iceberg 生态扩张的关键抓手
- PR 范围较大，涉及 docs/build/infra/data，容易长期停留
- 建议拆分评审，加快落地主路径

---

## 总体判断

今天的 Apache Iceberg 处于 **“高活跃、以稳定性和兼容性修复为主、辅以文档与迁移能力增强”** 的节奏中。  
最积极的信号是：新发现的 Spark flaky bug 很快就有对应修复 PR，说明核心链路问题处理及时。  
最值得持续盯进的方向则是：
1. **Kafka Connect 数据正确性**
2. **Spark 时间旅行与 schema/field-id 正确性**
3. **多云 FileIO 一致性**
4. **Hive / Delta 迁移兼容性**

如果你愿意，我下一步可以把这份日报再整理成一版更适合 **飞书/钉钉群播报** 的简版摘要。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-23）

## 1. 今日速览
过去 24 小时内，Delta Lake 仓库整体活跃度较低，仅有 **1 条 Issue 更新** 与 **1 条 PR 更新**，且**无新版本发布**。  
从内容看，今日动态更偏向**项目治理透明度**与**测试兼容性维护**，暂未出现大规模功能合并、性能优化落地或严重线上故障修复。  
社区侧最显著的话题是关于 **Delta Lake Technical Steering Committee（TSC）成员名单公开性** 的提问，反映出用户和生态参与方对项目治理信息透明度的关注。  
开发侧则有一条面向 **Spark/Unity Catalog 测试期望按版本进行门控** 的 PR，说明项目仍在持续处理多版本兼容与测试稳定性问题。  
综合判断：**今日项目健康度稳定，但代码推进节奏偏缓，活跃度中低。**

---

## 3. 项目进展
今日**无已合并或已关闭的重要 PR**，因此没有新增可确认落地的查询引擎功能、存储优化或 SQL 兼容性修复。

### 待合并 PR
- **#6342 [OPEN] [ai-assisted] [Spark] Gate UC Spark test expectations by version**  
  链接: delta-io/delta PR #6342

#### 进展解读
该 PR 从标题判断，主要聚焦于 **Spark 环境下 Unity Catalog（UC）相关测试预期按版本进行条件化控制**。这类改动通常不是直接新增用户可见功能，而是：
- 改善不同 Spark/UC 版本组合下的测试稳定性；
- 降低 CI 因版本差异导致的误报失败；
- 为后续功能在多版本环境中平滑演进提供基础设施支持。

#### 可能影响的技术面
- **查询引擎兼容性**：不同 Spark 版本行为差异可能导致测试断言不同，该 PR 试图显式管理这种差异。
- **集成稳定性**：若 Delta Lake 持续与 UC 集成，这类门控逻辑能减少回归噪音。
- **发布质量**：测试期望按版本分流，通常意味着维护者在为未来版本兼容打基础。

目前该 PR 尚未合并，因此还不能视为正式功能进展。

---

## 4. 社区热点

### 1) TSC 成员信息公开性讨论
- **#6219 [OPEN] Where is the current Delta Lake TSC membership listed?**  
  作者: @stackedsax  
  创建: 2026-03-09 | 更新: 2026-03-22 | 评论: 2 | 👍: 0  
  链接: delta-io/delta Issue #6219

#### 热点原因
虽然评论数不高，但在今日仅有极少量更新的背景下，这条 Issue 是最具代表性的社区话题。用户明确指出：**无法找到当前 Delta Lake 技术指导委员会（TSC）成员的权威名单**。

#### 背后的技术/社区诉求
这并非传统意义上的代码 Bug，但对开源项目同样重要，涉及：
- **项目治理透明度**：企业用户、贡献者和生态伙伴需要了解决策主体是谁；
- **路线图可信度**：当涉及协议演进、兼容性政策、连接器支持等重大方向时，TSC 信息直接影响外部协作预期；
- **社区参与门槛**：用户希望知道应与谁沟通规范提案、重大设计变更和版本政策。

#### 分析
对于 OLAP/湖仓基础设施项目，治理透明度会直接影响：
- 企业是否愿意将其作为长期生产依赖；
- 外部厂商是否投入连接器、引擎适配与生态共建；
- 社区对 roadmap 与规范稳定性的信任度。

---

### 2) Spark/UC 测试兼容性维护
- **#6342 [OPEN] [ai-assisted] [Spark] Gate UC Spark test expectations by version**  
  作者: @TimothyW553  
  创建: 2026-03-21 | 更新: 2026-03-22 | 👍: 0  
  链接: delta-io/delta PR #6342

#### 热点原因
这是今日唯一更新的 PR，体现了项目当前在 **多版本测试矩阵治理** 上的投入。

#### 背后的技术诉求
该 PR 释放出一个清晰信号：**Delta Lake 可能正在应对 Spark/UC 组合下存在行为差异的问题**，需要通过版本门控方式维护测试期望。  
这通常意味着：
- 某些行为在不同版本中是“预期差异”，而非功能错误；
- 现有 CI 或测试套件需要更精细的版本感知；
- 项目正试图在不牺牲兼容性的前提下推进迭代。

---

## 5. Bug 与稳定性
今日**未出现明确的新崩溃、数据损坏、查询正确性错误或严重回归报告**。  
但从稳定性维护角度，仍有以下值得关注的信号：

### 中等优先级：跨版本测试预期差异
- **PR #6342**  
  链接: delta-io/delta PR #6342

#### 风险判断
虽然当前不是用户直接报障，但“按版本门控测试期望”往往意味着：
- 某些行为在不同 Spark/UC 版本间存在分歧；
- 若缺乏清晰边界，可能引发升级后的行为变化；
- 测试不稳定会降低新版本发布信心。

#### 是否已有 fix PR
- **有相关修正尝试**：即 PR #6342 本身可视为稳定性修复/测试治理方向的候选修复。
- **状态**：尚未合并。

### 低优先级：治理信息不可发现
- **Issue #6219**  
  链接: delta-io/delta Issue #6219

#### 风险判断
这不属于运行时 Bug，但属于**项目运维与治理可用性问题**。对企业采用者而言，治理结构不透明会影响：
- 升级和规范变更的风险评估；
- 长期依赖决策；
- 外部贡献流程判断。

#### 是否已有 fix PR
- 暂无对应 fix PR。

---

## 6. 功能请求与路线图信号

### 1) 治理透明度相关诉求可能上升为文档/官网改进项
- **Issue #6219**  
  链接: delta-io/delta Issue #6219

#### 用户需求
用户希望获得**当前 TSC 成员的明确、可验证、官方维护的列表**。

#### 路线图信号
这不是引擎功能请求，但对项目成熟度非常关键。若维护者重视该问题，后续可能出现：
- 官网/README/治理文档补充；
- charter 链接更新；
- 新增 governance 页面或定期更新机制。

#### 纳入下一版本可能性
- **纳入代码版本的可能性低**，但**纳入文档站点/治理流程优化的可能性高**。

---

### 2) 多版本 Spark/UC 兼容治理可能持续成为近期重点
- **PR #6342**  
  链接: delta-io/delta PR #6342

#### 信号解读
虽然 PR 本身是测试层面的，但它反映出一个更大的路线图趋势：
- Delta Lake 正持续适配不同 Spark 版本；
- Unity Catalog 集成场景的重要性在提升；
- 未来版本可能会更明确区分不同引擎/目录服务组合的支持边界。

#### 纳入下一版本可能性
- **较高**。  
因为这类改动通常服务于 CI 稳定性和发布质量，较容易在后续版本中落地。

---

## 7. 用户反馈摘要

### 关于治理与决策透明度
- 来自 **Issue #6219**  
  链接: delta-io/delta Issue #6219

#### 提炼出的用户痛点
- 企业或团队在评估 Delta Lake 时，**无法方便找到当前 TSC 成员名单**；
- 用户已查阅 charter，但仍无法定位到“现任成员”的权威信息；
- 这说明现有治理信息在**可发现性**和**信息闭环**上存在不足。

#### 典型使用场景
- 企业做技术选型与风险评估；
- 外部贡献者希望理解谁在主导技术方向；
- 生态合作方需要判断规范、协议和接口演进的决策机制。

#### 满意度/信任度信号
- 这类问题虽不直接影响查询性能或存储可靠性，但会影响**项目公信力与企业级采用信心**。

---

## 8. 待处理积压

### 1) TSC 成员信息未明确公开，建议维护者尽快回应
- **#6219 [OPEN] Where is the current Delta Lake TSC membership listed?**  
  创建: 2026-03-09 | 更新: 2026-03-22  
  链接: delta-io/delta Issue #6219

#### 建议关注原因
该问题已存在约两周，且涉及项目治理透明度。即便不属于代码缺陷，也建议：
- 明确回复当前 TSC 成员名单；
- 提供长期可维护的官方链接；
- 将信息沉淀到官网或治理文档中，避免重复提问。

---

### 2) Spark/UC 测试门控 PR 需尽快评审，避免兼容性问题长期悬置
- **#6342 [OPEN] [ai-assisted] [Spark] Gate UC Spark test expectations by version**  
  创建: 2026-03-21 | 更新: 2026-03-22  
  链接: delta-io/delta PR #6342

#### 建议关注原因
若该 PR 对应真实存在的版本差异，则长期不处理可能导致：
- CI 结果噪声增多；
- 兼容性边界不清晰；
- 后续功能 PR 更难判断是真回归还是版本预期差异。

---

## 总结
Delta Lake 今日没有版本发布，也没有新的合并成果，整体处于**低活跃但稳定**状态。  
从信号上看，当前重点主要体现在两方面：
1. **社区治理透明度**：用户开始关注 TSC 名单与决策结构公开性；  
2. **多版本兼容性维护**：Spark/UC 相关测试门控 PR 表明项目仍在为复杂运行环境的稳定性投入精力。  

若维护者能及时处理上述两类问题，将有助于同时提升 **企业采用信心** 与 **发布工程质量**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 · 2026-03-23

> 项目仓库：<https://github.com/databendlabs/databend>

## 1. 今日速览

过去 24 小时内，Databend **无 Issue 更新**，但 **Pull Request 仍保持中等活跃度**：共有 6 条 PR 发生状态变化，其中 **5 条待合并、1 条已关闭**。  
从变更主题看，当前开发重心仍集中在 **查询引擎演进、存储层重构与稳定性修复** 三条主线：包括实验性表分支、分区化 Hash Join、Fuse block format 抽象，以及 recluster 路径上的大块拆分修复。  
版本侧发布了 **v1.2.890-nightly**，说明项目仍在持续推进 nightly 交付节奏，适合关注新特性的用户和贡献者跟进验证。  
整体来看，**项目健康度良好、研发节奏稳定**，但由于当天缺少公开 Issue 讨论，外部用户反馈信号偏弱，当前更多体现为核心开发团队主导的内部推进。

---

## 2. 版本发布

## 新版本：v1.2.890-nightly
- Release: **v1.2.890-nightly**
- 链接：<https://github.com/databendlabs/databend/releases/tag/v1.2.890-nightly>

### 本次版本已知更新
根据当前提供的 release 信息，版本包含以下重点方向：

#### 2.1 小型 Bloom Index 读取优化
- 相关 PR：**feat: optimize small bloom index reads**
- 链接：<https://github.com/databendlabs/databend/pull/19552>

这表明 Databend 在存储侧继续优化 **Bloom Index 的读取路径**，重点可能在于减少小索引对象读取时的 I/O 开销、请求放大或额外反序列化成本。  
对于高并发分析查询、点查过滤或高选择性谓词下的数据跳过场景，这类优化通常会带来：
- 更低的索引读取延迟
- 更好的对象存储访问效率
- 更稳定的过滤前置能力

#### 2.2 Query Runtime 相关功能
- release note 中出现：**feat(query): Runtime**
- 由于提供信息截断，当前无法确认完整标题与实现范围

从命名推断，这很可能涉及：
- 查询执行时 runtime 层能力增强
- 调度、资源管理、执行上下文或算子运行时改进
- 为后续 join / pipeline / memory 管理特性铺路

### 破坏性变更
- **当前提供的数据中未见明确破坏性变更说明**

### 迁移注意事项
由于是 **nightly 版本**，建议用户：
1. **优先在测试环境验证**，尤其是涉及存储格式读取、查询执行计划和索引路径的场景；
2. 若业务依赖 **Bloom Index 加速**，建议回归验证：
   - 谓词下推效果
   - 小表/小 block 上的过滤性能
   - 对象存储访问行为是否符合预期
3. 若尝试 query runtime 新能力，建议观察：
   - 内存峰值
   - join 执行稳定性
   - 长查询/并发查询的资源回收情况

---

## 3. 项目进展

今天没有新合并 PR，但有 1 条重要 PR 被关闭，另外 5 条开放 PR 代表了近期核心研发方向。

### 3.1 已关闭 PR：Hash Join 结束时主动回收内存
- PR：**#19556 feat(query): reclaim memory on hash join finish**
- 状态：**CLOSED**
- 链接：<https://github.com/databendlabs/databend/pull/19556>

该 PR 聚焦于 **Hash Join 完成后的内存回收**。即便本次未合并，议题本身非常重要，说明团队正在关注：
- Hash Join 生命周期末尾的内存释放时机
- 长查询或并发查询下的内存占用尾部滞留问题
- 分析型负载中 join-heavy 查询的资源效率

这类工作通常直接影响：
- 查询尾延迟
- 集群资源复用效率
- OOM 风险控制

### 3.2 存储层：recluster 路径修复 oversized compact blocks
- PR：**#19577 [pr-bugfix] fix(storage): split oversized compact blocks during recluster**
- 状态：OPEN
- 链接：<https://github.com/databendlabs/databend/pull/19577>

该 PR 试图修复 **recluster 过程中排序与 compact 后可能生成过大 block** 的问题。  
这属于典型的 **存储布局与后台整理稳定性** 问题，若不处理，可能引发：
- block 大小超出预期阈值
- 后续读取与 compaction 效率下降
- 存储组织不均衡，影响查询扫描性能

这是一条对生产环境较有价值的修复信号，说明 Databend 正在持续打磨 Fuse 存储引擎的后台维护路径。

### 3.3 存储层重构：抽象 Fuse block format
- PR：**#19576 [pr-refactor] refactor(storage): extract fuse block format abstraction**
- 状态：OPEN
- 链接：<https://github.com/databendlabs/databend/pull/19576>

该 PR 的摘要显示，它做了几项关键重构：
- 提取统一的 `FuseBlockFormat` 抽象
- 用共享的 `ReadDataTransform` 替代分离的 native/parquet 读取转换
- 统一 Fuse 读取 pipeline 构建

这类重构通常意味着：
- 存储格式兼容层更清晰
- 读取路径更易维护
- 为未来引入更多 block 编码/格式演进打下基础

从架构角度看，这是一次偏“中台化”的整理，短期未必直接体现为用户新功能，但对后续性能优化、格式扩展与 bug 收敛非常关键。

### 3.4 查询引擎：实验性 table branch 支持
- PR：**#19551 [pr-feature] feat(query): support experimental table branch**
- 状态：OPEN
- 链接：<https://github.com/databendlabs/databend/pull/19551>

这是今天最具“产品能力扩展”意味的提案之一。  
“table branch” 往往意味着对表级分支、隔离修改、实验性数据分叉或类似轻量级版本化能力的探索。若落地，潜在价值包括：
- 更方便的数据实验与回归验证
- 多分支数据开发流
- 更强的数据治理与版本管理能力

尽管目前仍是 experimental，但它释放出 Databend 在 **数据版本化/分支化语义** 上的明确信号。

### 3.5 查询引擎重构：支持 partitioned hash join
- PR：**#19553 [pr-refactor] refactor(query): support partitioned hash join**
- 状态：OPEN
- 链接：<https://github.com/databendlabs/databend/pull/19553>

这是查询执行层非常关键的一条演进。  
Partitioned Hash Join 一般用于：
- 控制大表 join 内存占用
- 改善 join 在大数据量下的扩展性
- 为 spill、并行执行、分区化处理奠定基础

该 PR 已包含 unit test 与 logic test，说明实现已具备一定成熟度。  
如果后续合并，它将是 Databend 在 **复杂 join 场景性能与稳定性** 上的重要基础设施升级。

### 3.6 SQL 正确性修复：保留 UNION 查询中的括号
- PR：**#19587 [pr-bugfix] fix(query): preserve parentheses in UNION queries**
- 状态：OPEN
- 链接：<https://github.com/databendlabs/databend/pull/19587>

该 PR 修复 grouped set-operation expression 在 AST 构建中被错误“拍平”的问题，涉及：
- `UNION`
- `INTERSECT`
- `EXCEPT`

这是一个典型的 **SQL 语义正确性/兼容性修复**。  
如果括号被错误忽略，可能导致：
- 查询优先级变化
- 执行结果错误
- 与用户预期或其他数据库行为不一致

这类修复虽然看似细节，但对于 BI 工具兼容、复杂 SQL 迁移、语法一致性非常重要。

---

## 4. 社区热点

由于今日 **无 Issue 更新**，且所给 PR 数据中未包含评论数与 reaction 的有效值，社区热点只能基于技术重要性与更新活跃度判断。

### 热点 1：Partitioned Hash Join 支持
- PR：#19553
- 链接：<https://github.com/databendlabs/databend/pull/19553>

**技术诉求分析：**
这是面向分析型数据库核心能力的基础改造。其背后的核心诉求是：
- 大规模 join 查询的可扩展性
- 内存压力控制
- 更稳健的执行框架

如果 Databend 要持续增强复杂分析场景竞争力，partitioned hash join 几乎是必经之路。

### 热点 2：实验性 table branch
- PR：#19551
- 链接：<https://github.com/databendlabs/databend/pull/19551>

**技术诉求分析：**
这反映了 Databend 不仅关注“快”，也在探索“数据开发体验”和“版本化能力”。  
背后可能对应的用户场景有：
- 数据实验环境隔离
- 低成本派生表分支
- 多人协作的数据变更验证

这类能力若成熟，有机会成为 Databend 在 Lakehouse / 数据版本管理方向上的差异化特性。

### 热点 3：Fuse block format 抽象重构
- PR：#19576
- 链接：<https://github.com/databendlabs/databend/pull/19576>

**技术诉求分析：**
这是明显的架构治理工作，目标是降低读取链路分叉和重复实现。  
它体现出团队在持续偿还技术债，并为未来：
- 存储格式演进
- 统一读取管线
- 降低维护复杂度

做准备。

---

## 5. Bug 与稳定性

今日无新 Issue 报告，因此以下内容主要来自正在推进的修复型 PR。按潜在影响排序如下：

### P1：SQL 查询正确性问题 —— UNION/INTERSECT/EXCEPT 括号语义丢失
- PR：**#19587 fix(query): preserve parentheses in UNION queries**
- 链接：<https://github.com/databendlabs/databend/pull/19587>
- 状态：**已有 fix PR，待合并**

**影响评估：高**  
这是结果正确性级别的问题。复杂集合操作查询一旦 AST 被错误展开，可能直接返回错误结果。  
对于迁移自其他数据库的 SQL、自动生成 SQL 的 BI/中间件场景，风险较高。

### P1：存储整理稳定性问题 —— recluster 产生 oversized compact blocks
- PR：**#19577 fix(storage): split oversized compact blocks during recluster**
- 链接：<https://github.com/databendlabs/databend/pull/19577>
- 状态：**已有 fix PR，待合并**

**影响评估：高**  
该问题虽未直接表述为崩溃，但会影响数据块布局质量，可能连带影响：
- 后续扫描效率
- compaction/recluster 稳定性
- 存储组织健康度

属于存储后台维护链路中的高优先级修复项。

### P2：Hash Join 结束后的内存滞留/回收不及时
- PR：**#19556 feat(query): reclaim memory on hash join finish**
- 链接：<https://github.com/databendlabs/databend/pull/19556>
- 状态：**已关闭**

**影响评估：中高**  
尽管该 PR 已关闭，但问题方向值得继续关注。若相关问题未被其他 PR 替代解决，可能持续影响：
- 内存敏感场景
- 并发 join 查询
- 长生命周期查询执行器的资源复用

建议维护者确认该问题是否已通过其他方案吸收处理。

---

## 6. 功能请求与路线图信号

今日没有新的 Issue 功能请求，但从开放 PR 可以观察到清晰的路线图信号。

### 6.1 可能进入下一阶段的重要能力

#### 实验性 table branch
- PR：#19551
- 链接：<https://github.com/databendlabs/databend/pull/19551>

这是最明显的“面向用户的新能力”候选。  
如果后续合并，可能先以实验特性进入 nightly 或 feature-gated 版本，再逐步完善语义、元数据管理和隔离行为。

#### Partitioned Hash Join
- PR：#19553
- 链接：<https://github.com/databendlabs/databend/pull/19553>

虽然标注为 refactor，但实际是典型的 **查询引擎能力升级**。  
它很可能成为未来版本中：
- 大规模 join 性能优化
- spill/partition 执行增强
- 内存可控执行模型

的重要前置条件。

#### Fuse 读取路径统一化
- PR：#19576
- 链接：<https://github.com/databendlabs/databend/pull/19576>

这是偏底层路线图信号，说明 Databend 正在把读取栈做得更统一、更可扩展。  
后续值得关注是否会带来：
- Native / Parquet 路径进一步收敛
- 新 block format 接入更容易
- 可观测性与性能调优点更集中

---

## 7. 用户反馈摘要

今日 **无新增 Issue 与 Issue 评论数据**，因此缺乏直接的外部用户声音。  
不过从 PR 主题可以反推出几类真实用户痛点：

### 7.1 复杂 SQL 兼容性仍是重要诉求
- 相关 PR：#19587
- 链接：<https://github.com/databendlabs/databend/pull/19587>

说明用户或测试用例已触达更复杂的集合运算表达式，Databend 正在补齐 SQL 语义边角兼容性。  
这通常来自：
- BI 工具自动生成 SQL
- 跨数据库迁移
- 复杂报表与分析脚本

### 7.2 大规模 Join 的资源控制受到关注
- 相关 PR：#19553、#19556
- 链接：
  - <https://github.com/databendlabs/databend/pull/19553>
  - <https://github.com/databendlabs/databend/pull/19556>

这反映用户对：
- join 场景性能
- 内存峰值
- 查询完成后的资源释放

有持续需求，尤其是典型 OLAP 工作负载下的大表关联场景。

### 7.3 存储后台整理质量影响实际使用体验
- 相关 PR：#19577、#19576
- 链接：
  - <https://github.com/databendlabs/databend/pull/19577>
  - <https://github.com/databendlabs/databend/pull/19576>

说明 Fuse 存储引擎在生产复杂负载下，用户不仅关心“能不能跑”，也关心：
- recluster / compaction 结果是否稳定
- block 布局是否合理
- 读取路径是否足够高效

---

## 8. 待处理积压

基于当前可见数据，以下开放 PR 值得维护者重点关注：

### 高优先级待处理

#### #19577 fix(storage): split oversized compact blocks during recluster
- 链接：<https://github.com/databendlabs/databend/pull/19577>

原因：涉及存储整理路径稳定性，若拖延可能继续影响后台数据组织质量。

#### #19587 fix(query): preserve parentheses in UNION queries
- 链接：<https://github.com/databendlabs/databend/pull/19587>

原因：属于 SQL 正确性修复，建议优先评审与合并，避免错误语义继续影响用户查询结果。

### 中高优先级待处理

#### #19553 refactor(query): support partitioned hash join
- 链接：<https://github.com/databendlabs/databend/pull/19553>

原因：这是后续 join 能力升级的重要基础设施，建议尽快明确设计边界、性能收益与后续 spill 策略衔接。

#### #19576 refactor(storage): extract fuse block format abstraction
- 链接：<https://github.com/databendlabs/databend/pull/19576>

原因：底层重构体量通常较大，若长期悬而未决，容易造成分支漂移与 review 成本上升。

### 值得跟踪的方向性 PR

#### #19551 feat(query): support experimental table branch
- 链接：<https://github.com/databendlabs/databend/pull/19551>

原因：这是具备产品差异化潜力的功能，但通常涉及较多语义与元数据设计，建议持续关注其边界定义和落地方式。

---

## 总结

Databend 在 2026-03-23 的动态表现为：**外部社区讨论偏平静，核心研发推进稳定**。  
当前最值得关注的三条主线分别是：
1. **查询引擎增强**：partitioned hash join、hash join 内存管理  
2. **存储层治理**：Fuse block format 抽象、recluster 大块拆分修复  
3. **SQL 兼容性补齐**：集合运算括号语义修复  

如果你愿意，我还可以继续把这份日报整理成更适合团队群播报的 **“3 分钟晨会版”**，或者输出成 **Markdown 周报模板**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-23）

## 1. 今日速览

过去 24 小时内，Velox 没有新的 Issue 更新，PR 有 8 条动态，其中 6 条仍待合并、2 条已合并或关闭，整体活跃度处于**中等偏低**水平，但研发推进仍在持续。  
从变更主题看，今日重点集中在 **SQL 类型格式化能力完善、Spark 兼容函数扩展、对象存储配置增强、构建依赖修复，以及 GPU/PyTorch 执行方向探索**。  
没有新版本发布，说明当前节奏更偏向于**功能迭代与内部收敛**，而非集中发版。  
Issues 侧完全安静，表明今日没有新增公开问题暴露，但也意味着用户侧反馈样本不足，更多信号来自 PR 本身。  
整体来看，项目健康度稳定，方向上继续朝着**查询引擎兼容性、连接器能力和异构执行支持**扩展。

---

## 3. 项目进展

### 已合并 / 已关闭 PR

#### 1) 新增 Presto SQL 类型格式化能力
- **PR**: #16876 `[CLOSED][Merged]` feat: Add toPrestoTypeSql() for Presto SQL type formatting  
- **链接**: https://github.com/facebookincubator/velox/pull/16876

**进展解读：**  
该 PR 已合并，核心是将 `toTypeSql()` 从测试工具目录迁移到生产代码路径，并重命名为 `toPrestoTypeSql()`，明确其对应 Presto 方言。  
这属于一项典型的 **SQL 兼容性与类型系统工程化增强**，意义主要体现在：

- 让生产代码能够直接生成 **Presto 风格的类型 SQL 表达**；
- 修复原实现中的若干问题；
- 改善对 **自定义类型** 的支持；
- 为后续函数签名展示、DDL/元数据输出、错误信息格式化等能力打基础。

这类改动虽然不直接提升执行性能，但对 **跨引擎兼容、调试可读性、类型系统一致性** 非常关键，尤其是 Velox 持续服务于 Presto/Trino/Spark 等多前端语义时。  

---

#### 2) 清理向后兼容旧代码
- **PR**: #15721 `[CLOSED]` refactor: Remove backward compatible code  
- **链接**: https://github.com/facebookincubator/velox/pull/15721

**进展解读：**  
该 PR 今日关闭，未显示为 merged，结合摘要看属于在上游 Presto 依赖更新之后尝试移除一部分兼容层。  
这类关闭通常释放两个信号：

- 相关兼容代码清理工作可能已由其他路径完成，或暂不适合当前主线合入；
- Velox 对上游生态版本演进保持跟进，但**兼容层收敛节奏较谨慎**。

虽然本次未形成有效合并成果，但它反映出项目仍在持续处理 **历史兼容包袱与 API 清理** 问题。

---

## 4. 社区热点

> 注：当前数据中未提供评论数与反应数的有效值，无法严格按“最热”排序；以下基于更新时间、主题重要性和潜在影响面进行分析。

### 热点 1：TorchWave 融合 PyTorch nativert 执行器
- **PR**: #16878 `[OPEN]` TorchWave fused PyTorch nativert executor  
- **链接**: https://github.com/facebookincubator/velox/pull/16878

**技术诉求分析：**  
这是今天最值得关注的方向性 PR。摘要显示 TorchWave 是一个 **GPU kernel fusion 与执行框架**，可将 nativert FX graph 编译为融合 CUDA kernel。  
这说明 Velox 社区/贡献方正在探索：

- 将分析执行引擎能力与 **PyTorch 图执行/算子融合** 结合；
- 向 **GPU 异构执行** 延伸；
- 在数据流图层面做 operator grouping、代码生成和资源管理。

如果这一方向持续推进，Velox 的定位可能进一步从“高性能列式执行引擎”扩展到更广义的 **通用向量化/异构计算基础设施**。  
这类工作技术门槛高，通常面向未来架构能力，而非短期用户功能。

---

### 热点 2：Spark SQL 新增 interval NDV 聚合函数
- **PR**: #16595 `[OPEN]` feat(spark): Add approx_count_distinct_for_intervals SparkSql aggregate function  
- **链接**: https://github.com/facebookincubator/velox/pull/16595

**技术诉求分析：**  
该 PR 增加 Spark SQL 的 `approx_count_distinct_for_intervals` 聚合函数，用于支持 Spark CBO 直方图中的 NDV 聚合。  
背后的核心诉求非常明确：

- 提升 Velox 作为 Spark 后端时的 **统计信息兼容性**；
- 对齐 Spark 在 interval 类型上的语义；
- 使优化器相关场景具备更好的语义一致性。

这不是简单“多一个函数”，而是直接作用于 **查询优化质量与计划行为一致性** 的能力补齐。对 Spark 接入方来说价值较高。

---

### 热点 3：Paimon append table 读取初始化支持
- **PR**: #16816 `[OPEN]` feat: add init support for paimon append table read  
- **链接**: https://github.com/facebookincubator/velox/pull/16816

**技术诉求分析：**  
该 PR 指向 **Paimon 表格式/湖仓生态** 支持，尤其是 append table read 的初始化能力。  
它反映出 Velox 使用者正在持续推动对更多湖仓表格式和连接器语义的适配。  
如果后续完整落地，Velox 在数据湖访问层的覆盖面会继续扩大。

---

### 热点 4：S3 executor pool size 配置增强
- **PR**: #16879 `[OPEN]` Add executor pool size to S3 configs  
- **链接**: https://github.com/facebookincubator/velox/pull/16879

**技术诉求分析：**  
该 PR 允许在 S3 配置中显式设置 executor pool size，以替代 AWS SDK 默认“每个异步调用创建并分离线程”的行为。  
这背后的真实需求非常务实：

- 控制对象存储访问的 **线程模型与资源消耗**；
- 避免高并发异步请求下线程过度膨胀；
- 改善 S3 相关 I/O 场景的 **稳定性与可预测性**。

这是典型的生产落地型增强，影响面可能比表面看起来更大。

---

## 5. Bug 与稳定性

今日没有新的 Issue 报告，因此没有新增公开的崩溃、正确性问题或回归案例。基于 PR 动态，可观察到以下稳定性相关事项：

### 高优先级：构建依赖问题
- **PR**: #16867 `[OPEN]` fix(build): IcebergParquetStatsCollector requires ParquetWriter  
- **链接**: https://github.com/facebookincubator/velox/pull/16867

**问题性质：** 构建/依赖修复  
**影响范围：** Iceberg + Parquet 相关模块编译链路  
**状态：** 已有 fix PR，待合并

**分析：**  
该 PR 表明 `IcebergParquetStatsCollector` 对 `ParquetWriter` 存在依赖要求，可能导致编译失败、链接问题或头文件依赖不完整。  
同时作者还清理了重复包含和头文件组织问题，说明这不是一次单点修复，而是对构建可维护性的顺手治理。  
这类问题虽然不一定影响运行时查询结果，但会直接影响开发者构建体验和下游集成稳定性。

---

### 中优先级：向后兼容代码清理未落地
- **PR**: #15721 `[CLOSED]` refactor: Remove backward compatible code  
- **链接**: https://github.com/facebookincubator/velox/pull/15721

**问题性质：** 技术债 / 兼容性治理  
**影响范围：** 上游 Presto 版本演进相关代码路径  
**状态：** PR 已关闭，暂无落地 fix

**分析：**  
这不属于新增 bug，但意味着部分兼容层清理工作暂未完成。  
长期来看，未收敛的兼容代码可能带来：

- 维护成本上升；
- 行为分支复杂化；
- 升级测试负担增加。

---

## 6. 功能请求与路线图信号

虽然今日没有新 Issue，但从活跃 PR 可明显看到未来版本的几个潜在方向：

### 1) Spark 兼容能力持续增强
- **PR**: #16595  
- **链接**: https://github.com/facebookincubator/velox/pull/16595

**信号判断：高概率纳入后续版本**  
理由：  
- 功能边界明确；
- 直接服务 Spark SQL 兼容；
- 对 CBO/统计信息链路有实际价值。

---

### 2) 数据湖/表格式生态继续扩展（Paimon）
- **PR**: #16816  
- **链接**: https://github.com/facebookincubator/velox/pull/16816

**信号判断：中高概率继续推进**  
理由：  
- Paimon 是湖仓生态中的实际需求点；
- append table read 初始化支持通常是后续完整读取链路的前置能力；
- 与 Velox 扩大连接器/表格式适配面的方向一致。

---

### 3) 对象存储运行时配置细化
- **PR**: #16879  
- **链接**: https://github.com/facebookincubator/velox/pull/16879

**信号判断：高概率纳入近期版本**  
理由：  
- 改动聚焦、落地价值高；
- 直接改善 S3 实际生产行为；
- 风险相对可控，属于典型可快速合入的工程优化。

---

### 4) 类型系统与 SQL 方言工具化增强
- **PR**: #16876（已合并）  
- **链接**: https://github.com/facebookincubator/velox/pull/16876

**信号判断：已进入主线方向**  
类型 SQL 格式化能力进入生产代码，意味着 Velox 正继续完善 **类型系统对外表达、方言适配和元数据一致性**。后续可能看到更多与：
- 类型签名展示，
- DDL/函数定义输出，
- 跨引擎类型映射  
相关的改进。

---

### 5) GPU / PyTorch 融合执行探索
- **PR**: #16878  
- **链接**: https://github.com/facebookincubator/velox/pull/16878

**信号判断：战略性探索，短期是否纳入版本尚不确定**  
这更像前沿方向验证，而非马上可普适交付的通用功能。  
若后续出现更多配套 PR（执行接口、kernel 生成、资源管理、测试基建），则说明该方向开始从实验走向产品化。

---

## 7. 用户反馈摘要

今日没有 Issue 评论数据，也没有提供 PR 评论内容，因此缺少直接的用户语料。结合 PR 摘要，可间接提炼出当前使用者/贡献者的真实关注点：

1. **Spark 兼容性不能只停留在 SQL 能跑**  
   - 还需要覆盖优化器依赖的聚合、统计和 interval 语义。  
   - 相关 PR：#16595  
   - 链接：https://github.com/facebookincubator/velox/pull/16595

2. **生产对象存储访问需要更强的线程与资源控制能力**  
   - 默认 SDK 行为在高并发场景下不够理想。  
   - 相关 PR：#16879  
   - 链接：https://github.com/facebookincubator/velox/pull/16879

3. **湖仓表格式接入仍是持续需求**  
   - Paimon 支持说明社区用户场景并不局限于传统 Hive/Iceberg。  
   - 相关 PR：#16816  
   - 链接：https://github.com/facebookincubator/velox/pull/16816

4. **类型系统与 SQL 文本表示的一致性很重要**  
   - 这通常影响函数签名、调试信息、元数据导出和跨引擎对接。  
   - 相关 PR：#16876  
   - 链接：https://github.com/facebookincubator/velox/pull/16876

---

## 8. 待处理积压

以下 PR 值得维护者重点关注，部分已带有 `stale` 标签，存在积压信号：

### 1) OpaqueType 注册 API 重构
- **PR**: #15844 `[OPEN][stale]` refactor: Fold registerSerialization into registerType for OpaqueType  
- **链接**: https://github.com/facebookincubator/velox/pull/15844

**风险提示：**  
这是类型系统 API 统一化改造，属于开发者接口层的重要清理。长期搁置会导致：
- API 使用方式不统一；
- 序列化注册流程复杂；
- 下游接入文档与代码样例难以收敛。

建议维护者尽快明确：
- 是否接受该 API 方向；
- 是否需要拆分成更小 PR；
- 是否存在迁移兼容顾虑。

---

### 2) Spark interval NDV 聚合函数
- **PR**: #16595 `[OPEN]`  
- **链接**: https://github.com/facebookincubator/velox/pull/16595

**风险提示：**  
功能价值较高，若长期停滞，可能影响 Spark 后端在统计/优化场景中的语义完整性。  
建议优先审阅 correctness、HLL 行为与 Spark 计划兼容边界。

---

### 3) Paimon append table 读取初始化支持
- **PR**: #16816 `[OPEN]`  
- **链接**: https://github.com/facebookincubator/velox/pull/16816

**风险提示：**  
属于生态扩展入口型工作。若社区确有 Paimon 需求，建议尽快确认范围，避免长期悬而未决导致后续 PR 难以衔接。

---

### 4) S3 executor pool size 配置
- **PR**: #16879 `[OPEN]`  
- **链接**: https://github.com/facebookincubator/velox/pull/16879

**风险提示：**  
这是一个很典型的生产优化项，通常投入小、收益直接。若审阅排队过久，可能影响实际用户在对象存储高并发访问中的资源控制能力。

---

## 总结

今天的 Velox 没有 Issue 层面的新增波动，也没有版本发布，整体呈现出**低噪音、持续迭代**的状态。  
已合并的 `toPrestoTypeSql()` 强化了类型系统与 Presto 方言表达能力，是一项扎实的基础设施改进。与此同时，待审 PR 显示项目正在沿着 **Spark 兼容、湖仓生态、S3 生产可用性、构建稳定性，以及 GPU 异构执行探索** 多线推进。  
从健康度看，项目主线稳定，但部分带 `stale` 或高价值的功能 PR 需要更快的审阅反馈，以避免积压扩大。

--- 

如需，我还可以继续把这份日报整理成：
1. **适合发在飞书/Slack 的精简版**  
2. **适合管理层阅读的周报口径版**  
3. **按“查询引擎 / 存储 / 连接器 / 生态兼容”分类的技术版**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-23）

## 1. 今日速览

过去 24 小时内，Apache Gluten 社区共更新 **14** 条开发记录，其中 **Issues 5 条、PR 9 条**，整体活跃度处于**中高水平**，且讨论重心明显集中在 **Velox 后端、Spark 4.x 测试体系补齐、S3 访问性能与 SQL 能力扩展**。  
今天没有新版本发布，但从 PR 和 Issue 的分布看，项目仍在持续推进 **Spark 4.0/4.1 兼容性完善、测试稳定性治理、执行引擎性能优化**。  
关闭/收敛的工作主要体现在一个 S3 性能相关 Issue 被关闭，以及 Spark 4.x 测试补齐大 PR 进入关闭状态，说明部分历史技术债正在被整理。  
同时，新开 Issue 提出了 **“过滤后再动态选择 Join 策略”** 的执行期优化设想，反映出社区已开始关注比静态规则/AQE 更细粒度的运行时优化能力。

---

## 2. 项目进展

### 已关闭/收敛的重要 PR 与 Issue

#### 1）Spark 4.0 / 4.1 缺失测试补齐工作阶段性收尾
- **PR #11512 [CLOSED] [CORE] [UT] Add missing Gluten test suites for Spark 4.0 and 4.1**
- 链接：apache/gluten PR #11512

该 PR 已关闭，核心目标是为 Gluten 补齐 Spark 4.0/4.1 上长期缺失的 wrapper test suites。  
从后续关联 PR 来看，这项工作并非简单结束，而是进入了**第二阶段的测试质量治理**：

- **PR #11800**：修正 Spark 4.0/4.1 测试 trait，避免测试实际上跑在 vanilla Spark 上  
- **PR #11805**：为 PlanStability 测试增加 Gluten 专属 golden file 对比

这表明项目在测试覆盖率之外，开始进一步收敛到**测试真实性、计划稳定性、回归检测能力**。对分析型引擎项目来说，这是非常关键的健康信号：不仅“有测试”，还在确保“测试真的测到了 Gluten”。

#### 2）S3 大核场景读取性能问题关闭，进入配置/实现落地阶段
- **Issue #11765 [CLOSED] [enhancement] [VL] AWS S3 read performance is very bad when executor.cores are big**
- 链接：apache/gluten Issue #11765

该问题聚焦 **Velox + AWS S3** 在 executor.cores 较大时吞吐下降的问题。  
结合今天的后续 PR：

- **PR #11807 [OPEN] [VELOX] [VL] Add executor pool config**
- 链接：apache/gluten PR #11807
- **PR #11806 [OPEN] [VELOX, DOCS] [VL] Enhance VeloxS3 documentation with config details**
- 链接：apache/gluten PR #11806

可以判断，社区对这一类性能问题的处理路径已经比较清晰：  
**先通过 issue 暴露现象与参数敏感性，再通过执行线程池配置与文档补齐给出工程化解决方案。**

这类修复虽然未体现为“功能新增”，但对对象存储上的 OLAP 工作负载落地价值很高，尤其适用于 **S3 数据湖 + 大并发 executor** 场景。

---

## 3. 社区热点

### 热点 1：Velox 上游 PR 跟踪依然是社区核心议题
- **Issue #11585 [OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream**
- 作者：@FelixYBW
- 评论：16，👍 4
- 链接：apache/gluten Issue #11585

这是今天**评论最多、反应最多**的议题。  
其本质不是单一 bug，而是一个典型的**下游引擎集成项目对上游依赖治理问题**：Gluten 社区持续向 Velox 提交能力，但这些 PR 尚未完成 upstream merge，导致功能可用性、维护成本和 rebase 成本都受影响。

**背后的技术诉求：**
1. 让 Gluten 对 Velox 的增强尽快成为上游能力，降低私有 patch 维护压力；
2. 避免在 gluten/velox 分叉中长期堆积补丁；
3. 保障 Spark + Velox 组合上的功能演进节奏。

这说明 Gluten 当前项目健康度不仅取决于自身代码，还深度受制于 **Velox 上游合并效率**。

---

### 热点 2：Spark 4.x 禁用测试追踪持续活跃
- **Issue #11550 [OPEN] [bug, triage, tracker] Spark 4.x: Tracking disabled test suites**
- 作者：@baibaichen
- 评论：6
- 链接：apache/gluten Issue #11550

这是今天最重要的**稳定性跟踪议题**之一。  
对应今日直接关联的 PR 至少包括：

- **PR #11800**：替换错误测试 trait  
- **PR #11805**：为 PlanStability 增加 golden file 比较

说明 Spark 4.x 适配不再只是“编译通过”，而是在逐步恢复和强化完整测试矩阵。  
背后反映的真实诉求是：**用户希望 Spark 4.x 上的 Gluten 能达到与 Spark 3.x 相近的正确性与回归可控性。**

---

### 热点 3：S3 访问性能与配置透明度受到集中关注
- **Issue #11765 [CLOSED] [VL] AWS S3 read performance is very bad when executor.cores are big**
- 链接：apache/gluten Issue #11765
- **PR #11807 [OPEN] [VELOX] Add executor pool config**
- 链接：apache/gluten PR #11807
- **PR #11806 [OPEN] [VELOX, DOCS] Enhance VeloxS3 documentation with config details**
- 链接：apache/gluten PR #11806

该主题今天虽然 issue 已关闭，但明显正在转化为**可配置化能力 + 文档化最佳实践**。  
这类讨论通常意味着项目已经进入更成熟阶段：不是简单修“有无问题”，而是围绕 **参数暴露、线程模型、对象存储吞吐调优** 做体系化优化。

---

## 4. Bug 与稳定性

按影响面和潜在严重程度排序如下：

### P1：Spark 4.x 测试体系失真，可能掩盖真实兼容性问题
- **Issue #11550 [OPEN] [bug, triage, tracker] Spark 4.x: Tracking disabled test suites**
- 链接：apache/gluten Issue #11550
- 相关修复 PR：
  - **PR #11800**：apache/gluten PR #11800
  - **PR #11805**：apache/gluten PR #11805

#### 风险分析
`GlutenTestsCommonTrait` 未正确启用 GlutenPlugin，导致部分测试实际上运行在原生 Spark 上，却错误地表现为“已验证 Gluten offload”。  
这类问题的严重性高于普通单测失败，因为它会造成**错误的质量感知**，进而掩盖执行计划回归、算子未下推、兼容性缺陷等问题。

#### 当前状态
已有明确修复方向，且今天连续出现两个补充 PR，修复进展积极。

---

### P1：AWS S3 在大 executor.cores 场景下读取性能差
- **Issue #11765 [CLOSED]**
- 链接：apache/gluten Issue #11765
- 相关 PR：
  - **PR #11807**：apache/gluten PR #11807
  - **PR #11806**：apache/gluten PR #11806

#### 风险分析
这类问题直接影响数据湖查询吞吐，特别是在对象存储上运行的批处理/分析型作业中，可能造成：
- executor 扩核不增速甚至退化；
- IO 线程池与任务并发不匹配；
- S3 请求模型与 Velox split preload 策略不协调。

#### 当前状态
Issue 已关闭，推测社区已识别出主要缓解方案；但真正的工程稳定性还取决于 #11807 合并及后续用户验证。

---

### P2：HiveTableScanExecTransformer 分区读格式去重逻辑存在性能损耗
- **PR #11798 [OPEN] [CORE] Improve the performance of getDistinctPartitionReadFileFormats for HiveTableScanExecTransformer**
- 链接：apache/gluten PR #11798

#### 风险分析
这不是崩溃类 bug，但会影响 Hive 表扫描阶段的元数据处理效率，尤其在**分区数量大、文件格式混合或元数据路径较重**的场景中，可能带来规划或执行前处理开销。  
PR 已给出修复，且声明经过 GA tests 和人工测试，属于较明确的性能改善项。

---

### P2：ClickHouse 后端 regex 模式校验存在兼容性/回退风险
- **PR #11548 [OPEN] [stale, CLICKHOUSE] [CH] Validate regex patterns via native RE2**
- 链接：apache/gluten PR #11548

#### 风险分析
正则表达式能力的兼容性是 SQL 函数正确性的重要组成部分。  
该 PR 试图通过 native RE2 在 CH 表达式验证阶段提前识别不支持模式，并优雅回退。若迟迟不推进，可能继续存在：
- lookaround / backreference 等模式兼容性不一致；
- 查询运行时才暴露失败；
- Gluten/CH 与 Spark 语义差异放大。

#### 当前状态
PR 已被标记 stale，需维护者重新关注。

---

## 5. 功能请求与路线图信号

### 1）执行感知型动态 Join 策略选择
- **Issue #11808 [OPEN] [enhancement] Proposal: Add execution‑aware dynamic join strategy selection after filter execution**
- 链接：apache/gluten Issue #11808

这是今天唯一明确的新功能提案，值得重点关注。  
它提出在 build side filter 真正执行后，再根据过滤后的实际大小动态选择 join strategy，而不是仅依赖静态成本模型或 AQE 的 stage boundary 调整。

#### 技术意义
对于分析型查询，尤其是：
- 高选择性维表过滤后再 join；
- 谓词下推效果强、但优化器预估不准；
- 实际 build side 大小远小于统计信息预估；

这种能力有望显著提升：
- Broadcast Hash Join 选择准确性；
- 内存使用效率；
- 大表 join 的整体执行时间。

#### 纳入路线图的可能性
**中等偏高。**  
原因是该提案贴近 Gluten 的核心价值：利用原生执行引擎在运行时做更聪明的决策。  
但其落地复杂度较高，涉及 Spark 计划控制、Velox 执行反馈、AQE 边界及统计回传机制，不太像短周期可直接合并的功能。

---

### 2）Spark 4.0 VariantType / Parquet shredding 支持
- **Issue #11371 [OPEN] [enhancement] [VL][Spark-4.0] Add Variant shredding support for Parquet reader and writer**
- 链接：apache/gluten Issue #11371

该需求与 Spark 4.0 新增 `VariantType` 直接相关，属于**SQL 类型系统与存储格式能力升级**。  
一旦支持，将增强 Gluten 对半结构化/变体数据的处理能力，尤其适合数据湖中的复杂 schema 演进场景。

#### 纳入下一版本可能性
**中等。**  
这是明确的 Spark 4.0 对齐事项，且属于“新版本兼容能力缺口”，理论上优先级不低；但其实现复杂度大，涉及 Parquet reader/writer 双向支持。

---

### 3）SQL 函数扩展：approx_count_distinct_for_intervals
- **PR #11729 [OPEN] [CORE, BUILD, VELOX, DOCS] Support approx_count_distinct_for_intervals function**
- 链接：apache/gluten PR #11729

这是一个较明确的 SQL 能力扩展，目标是将 Spark 函数映射到 Velox 后端 aggregate。  
由于 PR 标注为 **mapping-only change**，实现相对轻量，但它依赖 Velox 上游 PR：

- facebookincubator/velox#16595

#### 纳入下一版本可能性
**较高，但受上游依赖影响。**  
如果 Velox 对应能力完成合并，Gluten 侧跟进难度不大。

---

### 4）Velox S3 执行线程池配置化
- **PR #11807 [OPEN] [VELOX] [VL] Add executor pool config**
- 链接：apache/gluten PR #11807

该项虽然形式上更像性能修复，但也可以视作**面向生产场景的可运维功能增强**。  
通过对齐 `spark.hadoop.fs.s3a.executor.capacity`，使 Gluten/Velox 更好地融入现有 Spark on S3 调优体系。

#### 纳入下一版本可能性
**高。**  
原因是它具备明确场景、明确问题来源、配置语义清晰，且有对应 issue 支撑。

---

## 6. 用户反馈摘要

基于今日 Issues/PR 内容，可提炼出以下真实用户痛点：

### 1）对象存储性能调优困难
- 相关链接：
  - apache/gluten Issue #11765
  - apache/gluten PR #11807
  - apache/gluten PR #11806

用户在 **AWS S3 + Velox** 场景下已经不再满足于“能跑”，而是关注：
- executor.cores 扩大后为何性能变差；
- IO thread / preload / coalescing 参数如何协同；
- Spark 现有 S3A 配置能否被 Gluten 复用。

这反映出 Gluten 已被用于更接近生产的数据湖性能调优场景。

---

### 2）Spark 4.x 兼容性需要“真实可信”的测试保障
- 相关链接：
  - apache/gluten Issue #11550
  - apache/gluten PR #11800
  - apache/gluten PR #11805
  - apache/gluten PR #11512

用户不只是要看到“支持 Spark 4.x”，而是要求：
- 测试真正启用了 GlutenPlugin；
- PlanStability 能持续监控执行计划变化；
- 禁用的 suite 有明确恢复路径。

这说明社区对新版本兼容性的诉求已从“功能可用”上升到“质量可审计”。

---

### 3）上游依赖阻塞正在影响功能交付节奏
- 相关链接：
  - apache/gluten Issue #11585
  - apache/gluten PR #11729
  - apache/gluten PR #11807

多项工作都显式依赖 Velox 上游 PR。  
用户真实痛点是：**Gluten 功能可见，但上游未合并时难以稳定交付或维护成本过高。**  
这类反馈对路线图管理影响很大，因为很多“看起来快完成”的能力，实际受制于外部项目节奏。

---

## 7. 待处理积压

以下是值得维护者优先关注的长期或潜在积压项：

### 1）Velox 上游 PR 跟踪项长期存在
- **Issue #11585 [OPEN]**
- 创建时间：2026-02-07
- 评论：16
- 链接：apache/gluten Issue #11585

这是明显的“系统性积压”。如果该列表持续膨胀，会带来：
- 分叉维护负担加重；
- 功能文档与实际行为不一致；
- backport / rebase 成本上升。

建议维护者定期梳理优先级，识别必须临时 carry 的 patch 与可放弃的 patch。

---

### 2）Spark 4.x disabled test suites 仍需持续清零
- **Issue #11550 [OPEN]**
- 创建时间：2026-02-03
- 链接：apache/gluten Issue #11550

尽管今日已有两个关联 PR，但这个 tracker 本身仍未关闭。  
只要该 issue 未收敛，Spark 4.x 的正确性与回归稳定性就仍有潜在盲区。建议作为短期版本门禁项持续推进。

---

### 3）VariantType / Parquet shredding 需求推进缓慢
- **Issue #11371 [OPEN]**
- 创建时间：2026-01-06
- 链接：apache/gluten Issue #11371

这是 Spark 4.0 新类型支持中的关键缺口之一。  
若长期无实现，会影响 Gluten 对新一代 Spark SQL 类型能力的完整适配，尤其不利于半结构化分析场景的 adoption。

---

### 4）ClickHouse regex 校验 PR 已 stale
- **PR #11548 [OPEN, stale]**
- 创建时间：2026-02-03
- 链接：apache/gluten PR #11548

该 PR 涉及 SQL 表达式兼容性与 fallback 机制，属于用户体验敏感区。  
建议维护者确认：
- 设计方向是否仍认可；
- 是否需要拆分 JNI / fallback / 测试用例；
- 是否转为更小粒度 PR 以提升合并概率。

---

## 8. 结论

今日 Apache Gluten 没有版本发布，但项目在 **Spark 4.x 测试治理、Velox/S3 性能优化、SQL 能力补齐与上游依赖清理** 四条主线均有明显推进。  
从健康度看，项目当前最大的积极信号是：社区正在从“新增功能”转向“测试真实性、计划稳定性、生产性能调优”这类更成熟的工程议题。  
最大的风险则仍然是 **Velox 上游依赖与 Spark 4.x 测试积压**，它们将直接影响后续版本的交付节奏与质量可信度。

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/钉钉发布的简版摘要**，或  
2. **按“Velox / Spark4 / ClickHouse / Infra”分主题的周报视图**。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-23）

## 1. 今日速览

过去 24 小时内，Apache Arrow 共发生 **26 条动态**：**20 条 Issue 更新**、**6 条 PR 更新**，**无新版本发布**。整体活跃度处于 **中等偏上**，但更新内容呈现出明显的“两极分化”——一方面有少量面向 ORC、Parquet、Ruby/GLib、Gandiva 的实质性推进，另一方面大量变动来自历史遗留 issue 的 stale 清理与关闭。  
从技术方向看，**ORC predicate pushdown** 是当前最清晰的功能主线，已经从需求 issue 进入到底层 API PR 实现阶段；同时，**Parquet 写入过程可观测性**、**Python 类型标注体系**、**R 文档/CI 稳定性**也在持续推进。  
稳定性方面，今天新增了 **macOS + xsimd 14.1.0 构建失败** 与 **R sanitizer nightly 失败** 两个值得关注的问题；前者偏构建兼容性，后者涉及运行时越界，潜在风险更高。  
综合判断：项目健康度 **稳健**，但近期需要维护者更多关注 **CI 健康、平台兼容性** 与 **长期积压 issue 的有效分流**。

---

## 3. 项目进展

### 已合并/关闭的重要 PR

#### 1) [GH-49471: [C++][Gandiva] Fix crashes in substring_index and truncate with extreme integer values](https://github.com/apache/arrow/pull/49471)
- 状态：**已关闭**（从上下文看为已处理/已结束）
- 影响模块：**C++ / Gandiva**
- 进展意义：
  - 修复了两个极值输入下的崩溃问题：
    - `substring_index(VARCHAR, VARCHAR, INT)` 在 `INT_MIN` 下可能触发 **SIGBUS**
    - `truncate(BIGINT, INT)` 在 `INT_MAX/INT_MIN` 下可能触发 **SIGSEGV**
  - 这类修复直接提升了 **表达式执行引擎** 在极端参数输入下的健壮性。
- 对 OLAP / SQL 引擎的意义：
  - Gandiva 常用于向量化表达式求值，这类边界值崩溃会影响 SQL 函数执行稳定性与查询容错。
  - 本次修复属于典型的 **SQL 函数正确性/稳定性补强**，对下游查询引擎集成较重要。

#### 2) [GH-49576: [Ruby] Add support for custom metadata in Footer](https://github.com/apache/arrow/pull/49577)
- 状态：**已关闭**
- 影响模块：**Ruby / GLib**
- 进展意义：
  - 为 Arrow 文件格式 Footer 增加 **custom metadata** 读写支持。
  - 新增：
    - `garrow_record_batch_file_reader_get_metadata()`
    - `garrow_record_batch_file_writer_new_full()`
    - `ArrowFormat::FileReader#metadata`
    - 写入侧 metadata 参数
- 对分析型存储的意义：
  - 自定义 metadata 是数据血缘、生成参数、上游任务标记、schema 扩展信息承载的重要手段。
  - 对多语言生态来说，这一步增强了 **Arrow IPC/File 格式在 Ruby/GLib 侧的元数据互操作性**。

---

### 仍在推进中的关键 PR

#### 3) [GH-49360: [C++][ORC] Add stripe statistics API to ORCFileReader](https://github.com/apache/arrow/pull/49379)
- 状态：**OPEN，awaiting review**
- 关联 Issue：[ORC Predicate Pushdown #48986](https://github.com/apache/arrow/issues/48986)
- 进展意义：
  - 为 `ORCFileReader` 暴露 **stripe-level / file-level 列统计信息**。
  - 支持按 stripe 选择性读取。
- 技术价值：
  - 这是实现 **ORC 谓词下推** 的第一块基础设施。
  - 一旦上层 dataset 层消费这些统计信息，就能在读前跳过不相关 stripe，降低 IO 与解码成本。
- 对 OLAP 价值：
  - 这是最典型的 **存储层裁剪优化**，直接关系到扫描性能、云存储成本与大表过滤效率。

#### 4) [GH-48467: [C++][Parquet] Add total_buffered_bytes() API for RowGroupWriter](https://github.com/apache/arrow/pull/49527)
- 状态：**OPEN，awaiting committer review**
- 影响模块：**Parquet / C++**
- 进展意义：
  - 新增 `RowGroupWriter.total_buffered_bytes()` API，用于观测 values 与 levels 的缓冲字节数。
- 技术价值：
  - 有助于更智能地决定 **何时切分新的 row group**。
  - 对写入路径的内存控制、row group 尺寸优化、后续查询扫描效率都有帮助。
- 对存储引擎意义：
  - row group 过大或过小都会影响扫描并行度和跳读效果，这个 API 为写入器做 **更细粒度的自适应控制** 提供了基础。

#### 5) [Python] Add internal type system stubs (_types, error, _stubs_typing)](https://github.com/apache/arrow/pull/48622)
- 状态：**OPEN，awaiting change review**
- 影响模块：**Python / Documentation**
- 进展意义：
  - 持续推进 PyArrow 类型标注体系建设。
- 对用户价值：
  - 强化 IDE、静态分析、库集成体验。
  - 虽非直接 OLAP 执行能力，但有助于提升 Python 数据工程开发效率和 API 可维护性。

#### 6) [GH-49380: [R] Remove hidden CI test chunks from setup.Rmd to fix r-devdocs](https://github.com/apache/arrow/pull/49381)
- 状态：**OPEN，awaiting review**
- 影响模块：**R**
- 进展意义：
  - 修复 `r-devdocs` CI 在 C++ 包已发布而 R 包未发布窗口期的版本覆盖问题。
- 技术价值：
  - 属于 **CI 与文档构建稳定性修复**，减少跨发布阶段的假失败。

---

## 4. 社区热点

### 热点 1：ORC Predicate Pushdown 需求开始形成实现闭环
- Issue：[ORC Predicate Pushdown #48986](https://github.com/apache/arrow/issues/48986)
- 配套 PR：[Add stripe statistics API to ORCFileReader #49379](https://github.com/apache/arrow/pull/49379)

**分析：**
这是今天最明确的产品路线信号。用户指出 Arrow 的 ORC 读取当前已有列裁剪，但**缺少行级谓词下推**，导致即便过滤条件非常强，也必须先读入 stripe 再做后过滤。  
这说明 Arrow 在 ORC 支持上的核心短板，已经从“是否支持格式”转向“是否具备与 Parquet 类似的高级扫描优化能力”。而配套 PR 已实现底层统计 API，表明该需求不再停留于讨论，而是已进入可交付阶段。

**背后技术诉求：**
- 降低 ORC 扫描 IO 与 CPU
- 提高云上对象存储读取效率
- 补齐 Arrow Dataset/Scanner 在 ORC 路径上的优化能力

---

### 热点 2：C++ Dataset/Scanner 长期架构问题仍未解决
- Issue：[C++] Migrate scanner logic to ExecPlan, remove merged generator #31486](https://github.com/apache/arrow/issues/31486)

**分析：**
这是历史 issue，但其关注点非常关键：现有 scanner merged generator 的错误传播与取消语义不足，出现一个订阅报错时，其余订阅只是停止拉取，整体 error/cancel 机制不够理想。  
这反映出 Arrow Dataset 扫描模型在并发执行、错误传播、可取消性方面，仍有架构债务。对于 OLAP 场景，这类问题会影响：
- 大规模扫描时的稳定性
- 异常终止行为的一致性
- 与 ExecPlan 的统一执行语义

**背后技术诉求：**
- 执行引擎统一化
- 流式扫描错误传播更可靠
- Dataset 与计算执行层深度整合

---

### 热点 3：Python / 文档体验继续被用户推动
- Issue：[Python] Refactor documentation for generic Scanner parameters #31479](https://github.com/apache/arrow/issues/31479)
- Issue：[Python][Docs] Consolidate the information on the editable install in Python dev section #49572](https://github.com/apache/arrow/issues/49572)

**分析：**
虽然不是性能优化，但这类 issue 很能代表真实用户体验：Arrow Python API 的 Scanner 参数与开发安装文档存在“重定向式说明”“信息分散”等问题。  
这说明 PyArrow 正在从“功能够用”走向“开发者体验优化”，尤其是面向贡献者和高级用户的文档体系还在持续整理。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：R nightly sanitizer 发现运行时越界
- Issue：[CI][R] gcc sanitizer failure #49578](https://github.com/apache/arrow/issues/49578)
- 状态：**OPEN**
- 严重性：**高**
- 现象：
  - nightly `gcc-asan` 任务中出现运行时错误：
  - `icu74/common/rbbi.cpp:874:32: runtime error: index 6 out of bounds...`
- 风险判断：
  - sanitizer 告警通常意味着真实的越界/未定义行为风险，虽然表面发生在测试或依赖调用链中，但应优先排查。
  - 若问题位于 Arrow-R 与 ICU 交互路径，可能影响字符串/文本相关处理稳定性。
- 是否已有 fix PR：**暂无直接修复 PR**

### P1/P2：macOS + xsimd 14.1.0 构建失败
- Issue：[C++] Build failure with xsimd 14.1.0 on macOS #49579](https://github.com/apache/arrow/issues/49579)
- 状态：**OPEN**
- 严重性：**中高**
- 现象：
  - `bpacking_simd_default.cc.o` 编译失败
  - 触发环境：**macOS + xsimd 14.1.0**
- 风险判断：
  - 影响 C++ 构建链，属于典型的第三方依赖升级兼容性问题。
  - 对 Homebrew/macOS 开发者和 CI 覆盖面有直接影响。
- 是否已有 fix PR：**暂无**

### P2：Gandiva SQL 函数极值输入崩溃
- PR：[GH-49471](https://github.com/apache/arrow/pull/49471)
- 状态：**已关闭**
- 严重性：**中**
- 问题：
  - `substring_index` / `truncate` 在极端整数参数下崩溃。
- 当前判断：
  - 已进入修复流程，短期内风险可控。
  - 建议后续补充更多 fuzz / 边界值回归测试。

### P3：R 文档 CI 版本漂移导致 devdocs 失败
- PR：[GH-49381](https://github.com/apache/arrow/pull/49381)
- 状态：**OPEN**
- 严重性：**中低**
- 问题性质：
  - 文档中的隐藏 bash chunk 在 CI 中安装 apt 发布版 `libarrow-dev`，覆盖了当前构建版本。
- 影响：
  - 属于发布窗口期的 CI 假失败，不直接影响最终用户，但会干扰维护者判断。

---

## 6. 功能请求与路线图信号

### 1) ORC Predicate Pushdown
- Issue：[ORC Predicate Pushdown #48986](https://github.com/apache/arrow/issues/48986)
- 配套 PR：[ORC stripe statistics API #49379](https://github.com/apache/arrow/pull/49379)

**路线图判断：高概率纳入后续版本**
- 原因：
  - 需求明确
  - 已有底层实现 PR
  - 分阶段推进路径清晰（先统计 API，再接 dataset 层 predicate evaluation）

### 2) ORCFileReader 暴露 stripe/file 统计与 selective stripe read
- Issue：[Add stripe statistics API to ORCFileReader #49360](https://github.com/apache/arrow/issues/49360)
- PR：[GH-49379](https://github.com/apache/arrow/pull/49379)

**路线图判断：高概率**
- 这是 ORC 谓词下推的基础设施，单独也有 API 价值。

### 3) Parquet RowGroupWriter buffered bytes 可观测性
- PR：[Add total_buffered_bytes() API for RowGroupWriter #49527](https://github.com/apache/arrow/pull/49527)

**路线图判断：中高概率**
- 功能聚焦、实现边界清晰、对写入器和存储布局优化直接有用。
- 很适合在后续版本中作为增量 API 发布。

### 4) Python 内部类型系统 stubs
- PR：[Python stubs #48622](https://github.com/apache/arrow/pull/48622)

**路线图判断：中概率**
- 对最终运行时能力影响较小，但有利于长期 API 质量提升。
- 取决于前置 PR 与评审节奏。

### 5) Ruby Footer custom metadata
- Issue：[Ruby custom metadata in Footer #49576](https://github.com/apache/arrow/issues/49576)
- PR：[GH-49577](https://github.com/apache/arrow/pull/49577)

**路线图判断：已实质落地**
- 属于多语言生态补齐，而非远期规划。

---

## 7. 用户反馈摘要

### 1) ORC 用户关心“读得少”，不仅是“能读”
- 相关：
  - [ORC Predicate Pushdown #48986](https://github.com/apache/arrow/issues/48986)
  - [ORC stripe statistics API #49360](https://github.com/apache/arrow/issues/49360)

**提炼出的痛点：**
- 当前 ORC 读取只能做列裁剪，不能充分利用 stripe 级统计信息做过滤前裁剪。
- 在大数据扫描中，这会造成：
  - 不必要的 stripe 解码
  - 更高的对象存储访问成本
  - 较差的查询延迟表现

### 2) C++ Dataset API 对直接用户仍不够直观
- 相关：[The C++ API for writing datasets could be improved #30891](https://github.com/apache/arrow/issues/30891)

**提炼出的痛点：**
- Python/R 层已经封装掉的复杂性，在 C++ 原生用户这里仍显著暴露。
- 尤其涉及：
  - partitioning 默认行为
  - write dataset 参数理解
  - API 使用路径不够顺手
- 这类反馈说明 Arrow 核心能力强，但**底层 API 易用性**仍是 adoption 摩擦点。

### 3) Python 文档“参数复用式写法”影响可读性
- 相关：[Refactor documentation for generic Scanner parameters #31479](https://github.com/apache/arrow/issues/31479)

**提炼出的痛点：**
- 用户在阅读 `_dataset.pyx` 文档时，需要跳转到 `Scanner.from_dataset/from_fragment` 才能看完整参数说明。
- 这对高频使用 Dataset API 的开发者不友好，增加了学习成本。

### 4) HDFS 开箱即用能力仍被反复提及
- 相关：[Need a pip install option for out-of-the-box HDFS support #30903](https://github.com/apache/arrow/issues/30903)

**提炼出的痛点：**
- PyArrow 用户希望 `pip install` 后即可连接 HDFS，而不是手动拼装 Hadoop 依赖链。
- 这类反馈持续说明：**分布式存储连接器的部署复杂度** 仍是 Python 用户的重要障碍。

---

## 8. 待处理积压

以下 issue / PR 虽非今日新提，但技术重要性较高，值得维护者关注：

### 长期积压 Issue

#### 1) [C++] Migrate scanner logic to ExecPlan, remove merged generator #31486](https://github.com/apache/arrow/issues/31486)
- 创建于 2022-03-30
- 重要性：**高**
- 原因：
  - 涉及 Dataset 扫描执行模型与错误传播机制，是架构层问题。
  - 若迟迟不推进，可能长期制约扫描层与 ExecPlan 的统一。

#### 2) [C++] Add backpressure to TPC-H dbgen #31499](https://github.com/apache/arrow/issues/31499)
- 链接：https://github.com/apache/arrow/issues/31499
- 重要性：**中高**
- 原因：
  - 直接指向大 scale factor 生成时 OOM。
  - 背后是典型的流式生成/背压控制问题，对 benchmark 工具链质量有影响。

#### 3) [C++] Function to return the number of seconds in a year #20174](https://github.com/apache/arrow/issues/20174)
- 重要性：**中**
- 原因：
  - 看似小功能，但涉及时间语义、一致性与闰秒边界处理，属于基础时间库设计问题。

#### 4) [Python] `tzinfo_to_string` should accept None #20172](https://github.com/apache/arrow/issues/20172)
- 重要性：**中**
- 原因：
  - API 容错性不足，影响 Python 侧时间类型处理体验。

#### 5) [Docs] Does arrow support S3 bucket retention period setting #31489](https://github.com/apache/arrow/issues/31489)
- 重要性：**中**
- 原因：
  - 反映对象存储治理特性（object lock / retention）在 Arrow 文档或能力边界上不清晰。
  - 对企业合规场景有现实意义。

---

### 长期待审 PR

#### 6) [C++][ORC] Add stripe statistics API to ORCFileReader #49379](https://github.com/apache/arrow/pull/49379)
- 重要性：**高**
- 原因：
  - 是 ORC predicate pushdown 的关键前置。
  - 建议优先评审，避免 ORC 优化路线中断。

#### 7) [C++][Parquet] Add total_buffered_bytes() API for RowGroupWriter #49527](https://github.com/apache/arrow/pull/49527)
- 重要性：**中高**
- 原因：
  - 对写入器内存与 row group 切分策略优化很实用。
  - API 边界清晰，适合快速决策。

#### 8) [Python] Add internal type system stubs #48622](https://github.com/apache/arrow/pull/48622)
- 重要性：**中**
- 原因：
  - 作为类型注解系列 PR 的一环，拖延会影响后续 PR 链条推进。

---

## 总结判断

今天的 Arrow 项目动态显示出一个典型的成熟基础设施项目状态：**底层能力继续稳步增强，生态语言绑定持续补齐，CI/兼容性问题仍需投入维护精力**。  
最值得关注的主线是 **ORC predicate pushdown**，它代表 Arrow 在分析型文件格式支持上，正从“读写兼容”迈向“查询优化友好”。如果相关 PR 顺利合入，后续版本很可能在 ORC 扫描性能上出现明确提升。  
与此同时，**Gandiva 极值崩溃修复**、**Parquet 写入可观测性增强**、**Ruby Footer metadata 支持** 也都体现了项目在查询执行、存储布局和多语言互操作方面的持续完善。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*