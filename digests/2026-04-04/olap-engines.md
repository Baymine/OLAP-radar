# Apache Doris 生态日报 2026-04-04

> Issues: 4 | PRs: 153 | 覆盖项目: 10 个 | 生成时间: 2026-04-04 01:21 UTC

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

# Apache Doris 项目动态日报 - 2026-04-04

## 1. 今日速览

过去 24 小时内，Apache Doris 社区保持**高活跃度**：Issues 更新 4 条，PR 更新高达 **153 条**，其中 **78 条待合并，75 条已合并/关闭**，说明代码流转和分支维护都非常频繁。  
从内容上看，今日重点集中在三类方向：**查询执行与优化器增强**、**流式导入链路的安全性与健壮性修复**、以及**多目录/数据湖/云场景的工程化演进**。  
虽然没有新版本发布，但多个 PR 明确指向 **4.0.x / 4.1.x / 3.1.x** 的回合并，表明当前处于持续稳定化和功能打磨阶段。  
同时，Issue 侧出现了 **BE 崩溃、CDC + Stream Load 事务卡住、ANN 索引能力边界、第三方 Docker 启动体验** 等典型用户痛点，反映 Doris 在生产可用性和 AI/向量检索能力上仍是社区关注焦点。

---

## 3. 项目进展

> 注：今日无新 Release，以下聚焦“已合并/关闭的重要 PR”与“正在推进的关键 PR”。

### 3.1 今日已合并/关闭的重要 PR

#### 1) FE 集群治理能力解耦：引入 ClusterGuard SPI
- PR: #62031 `[feat](fe) Add ClusterGuard SPI interface for cluster-level policy enforcement`  
- 状态：**已关闭，且已进入 branch-4.1 回合并链路**
- 链接：apache/doris PR #62031  
- 回合并：#62113 `branch-4.1: [feat](fe) Add ClusterGuard SPI interface...`  
- 链接：apache/doris PR #62113

**分析：**  
该 PR 在 FE Core 中新增 ClusterGuard SPI（服务提供接口），用于把**集群级策略控制**（如节点数量限制、时间有效性检查等）从业务逻辑中抽离。  
这类改动虽然不是直接面向 SQL 功能，但对 Doris 的**企业级部署能力、插件化治理能力、商用场景扩展性**非常关键。它释放出一个明确信号：FE 正在增强“平台化”和“策略可插拔”能力，而不只是单纯查询执行层优化。

---

#### 2) 短路查询正确性修复：多层 Projection 展平
- PR: #61177 `[fix](short-circuit) flatten multi-layer projections in short-circuit point queries`
- 状态：**已关闭**
- 链接：apache/doris PR #61177

**分析：**  
该修复针对 Nereids 生成多层 projection 时，短路点查执行路径中序列化 projection list 给 BE 后可能引用中间 tuple slot 的问题。  
这属于典型的**查询正确性修复**：不是性能提升，而是确保点查/短路执行在表达式较复杂时仍能返回正确结果。对高并发 OLTP-like 点查混合场景价值较高。

---

#### 3) Cloud 场景可观测性修复：日志缺失问题
- PR: #61766 `[fix](cloud) Fix cloud not print ms log`
- 状态：**已关闭**
- 链接：apache/doris PR #61766

**分析：**  
修复 cloud / k8s 部署场景下 ms 日志未正确打印的问题。  
这类问题不会直接影响 SQL 结果，但会显著影响**运维可诊断性**。在云原生环境中，“日志可见”往往决定故障是否能快速定位，因此这是稳定性建设中的重要一环。

---

### 3.2 正在推进的关键 PR

#### 4) Pipeline 聚合能力增强：支持 bucketed agg operator
- PR: #61495 `[Feature](agg) support bucketed agg operator`
- 状态：**Open**
- 链接：apache/doris PR #61495

**分析：**  
这是今日最值得关注的执行引擎增强之一。PR 引入新的 **bucketed hash aggregation operator**，并配套重构 aggregation data variant 处理逻辑。  
如果顺利合入，这将有望改善某些按桶/分布特征明显的数据聚合场景，潜在收益包括：
- 更优的 pipeline 执行效率
- 更好的局部性与算子配合
- 为复杂聚合场景提供更细粒度执行策略

这类 PR 对 Doris 的**执行引擎现代化**非常重要。

---

#### 5) 优化器增强：支持多模式 CBO CTE Inline 策略
- PR: #60601 `[Enhancement](optimizer) Support multi-mode CBO CTE inline strategy`
- 状态：**Open / reviewed**
- 链接：apache/doris PR #60601

**分析：**  
原先 CTE inline 仅由布尔开关控制，过于粗粒度。该 PR 将其升级为**多模式策略**，以平衡：
- 规则简单时减少 CBO 比较开销
- 复杂查询时保留更优计划选择空间

这说明 Nereids 正从“功能可用”进一步走向“策略精细化”，对复杂 BI SQL、层层嵌套 CTE 的 ETL/报表查询收益较大。

---

#### 6) 存储层吞吐优化：SegmentIterator 自适应 batch size
- PR: #61535 `[feat](storage) Implement adaptive batch size for SegmentIterator`
- 状态：**Open / reviewed**
- 链接：apache/doris PR #61535

**分析：**  
该 PR 引入基于 EWMA 的 AdaptiveBlockSizePredictor，根据 `preferred_block_size_bytes` 动态调整 chunk row count。  
这属于非常典型的**分析型引擎底层性能工程**：
- 降低 block 大小波动
- 提升 scan / reader 输出稳定性
- 更好配合上层 pipeline 和内存预算

若落地，可能成为 Doris 在大扫描、宽表读取、复杂表达式投影场景下的重要性能优化。

---

#### 7) Nereids 列裁剪优化：`length(str_col)` 只读取 offset 子列
- PR: #61707 `[opt](nereids) optimize length(str_col) by only read offset sub column`
- 状态：**Open**
- 链接：apache/doris PR #61707

**分析：**  
这是典型的**子列裁剪/存储读取优化**。对于字符串列只求长度的场景，若无需读取完整数据体，只读 offset 子列即可显著减少 I/O。  
这类优化虽小，但非常符合分析型数据库的核心竞争力：**把表达式语义下推到更低层，减少无效读取**。

---

#### 8) JDBC Catalog SQL 兼容性修复：保留 query TVF 别名
- PR: #61939 `[fix](jdbc) Preserve query tvf column aliases across JDBC catalogs`
- 状态：**Open / approved / reviewed**
- 链接：apache/doris PR #61939

**分析：**  
修复 `query()` TVF 透传 SQL 到 JDBC catalog 时，返回列名未遵循 SQL 中 alias 的问题。  
这是一个典型的**跨目录 SQL 兼容性修复**，影响 BI 工具、联邦查询、数据虚拟化场景中的 schema 稳定性。  
这类问题往往不是“查不出来”，而是“列名不符合预期”，对下游报表/程序字段映射影响很大。

---

## 4. 社区热点

### 热点 1：第三方 Docker 启动性能与可用性追踪
- Issue: #62101 `[Track Issue] Optimize third-party Docker startup time and usability`
- 状态：Open
- 链接：apache/doris Issue #62101

**关注原因：**  
这是今天最明确的“路线图式” Issue。它不是单点 bug，而是一个**追踪型问题**，聚焦 Doris 第三方依赖 Docker 启动链路中的多个长期痛点：
- Hive / Iceberg 等重型组件启动慢
- 状态型外部依赖难管理
- 本地开发、回归测试、集成验证体验差

**背后技术诉求：**
- 改善开发者体验（DX）
- 降低集成测试成本
- 提升 CI 稳定性与启动成功率
- 减少数据湖生态接入门槛

这说明 Doris 正越来越多地承担**开放数据湖平台中枢**角色，围绕外部生态的工程效率正在成为重点。

---

### 热点 2：ANN 索引为何仅支持 Duplicate Key
- Issue: #61712 `Why ANN index is only supported on Duplicate Key table model ?`
- 状态：Open
- 链接：apache/doris Issue #61712

**关注原因：**  
该问题直指 Doris 向量检索能力的模型边界：为什么 ANN index 仅支持 Duplicate Key，而不支持 Unique Key / Aggregate Key。  

**背后技术诉求：**
- 向量检索能力与 Doris 主键模型深度融合
- 用户希望把 AI / embedding 检索直接用于更广泛的业务表模型
- 社区期待 Doris 不只是“能做向量检索”，而是“能在现有数仓模型中自然使用向量检索”

这是一个很强的产品化信号：AI 检索能力已经从“实验特性”进入“模型适配与生产可用性”阶段。

---

### 热点 3：流式导入链路连续出现安全与状态机修复
相关 PR：
- #62108 `[fix](fe) Mask sensitive headers in stream load logs`  
- #62109 `[fix](fe) Return early for non-master stream load precommit`  
- #62110 `[fix](be) Validate stream load content length before group commit`  
- #62111 `[fix](fe) Reject invalid stream load tokens on commit and rollback`  
- 链接：apache/doris PR #62108 / #62109 / #62110 / #62111

**关注原因：**  
这是一组高度集中的 stream load 修复，覆盖：
- 日志泄漏敏感 header
- 非 master 节点 precommit 路径处理不一致
- group commit 前 content-length 校验不足
- commit/rollback 对非法 token 校验失效

**背后技术诉求：**
- 流式写入接口的安全合规
- 导入状态机的一致性
- 错误输入的鲁棒性
- 多节点 FE 场景的行为正确性

这组 PR 表明 Doris 维护者正在系统性清理 **stream load 接口面的边界条件与安全风险**。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1：BE 崩溃问题
- Issue: #61095 `[Bug] BE crashed with a query`
- 状态：**Closed**
- 链接：apache/doris Issue #61095

**情况：**  
用户在 v4.0.2 遇到查询触发的 BE crash。  
尽管该 Issue 已关闭，但从日报数据中尚未看到直接明确关联的 fix PR，因此仍建议维护者补充：
- 根因归类
- 是否已在 4.0.x / 4.1.x 修复
- 是否需要回补回归测试

**影响评估：**  
查询导致 BE 崩溃属于高严重级别，直接影响线上稳定性。

---

### P1：CDC + Stream Load 导入事务卡在 prepare 阶段
- Issue: #56438 `[Stale] [Bug] ... fe transaction card is in the prepare stage`
- 状态：**Closed / Stale**
- 链接：apache/doris Issue #56438

**情况：**  
用户在 2.1.10 中使用 stream load 聚合 CDC 数据时，FE 事务卡在 prepare 阶段。  
虽然该 Issue 以 stale 关闭，但今天 stream load 相关连续修复 PR 非常密集，说明这一问题域并未真正“冷却”，反而仍处于治理中。

**可能相关修复方向：**
- #62109 非 master precommit 提前返回
- #62110 group commit content-length 校验
- #62111 commit/rollback token 校验
- 链接：apache/doris PR #62109 / #62110 / #62111

**影响评估：**  
事务卡住会导致数据延迟、重试风暴甚至人工干预，是生产导入链路中的高优先级问题。

---

### P1：窗口漏斗函数 `window_funnel_v2` 正确性缺陷
- PR: #62043 `[fix](function) fix wrong result of window funnel v2 + deduplication/fixed mode`
- 状态：Open
- 链接：apache/doris PR #62043

**情况：**  
修复 `window_funnel_v2` 在去重/固定模式下，同一行命中多个条件时可能返回错误结果的问题。  

**影响评估：**  
这属于**查询结果正确性 bug**，影响用户行为分析、转化漏斗分析等典型 OLAP 场景，优先级很高。

---

### P1：Scan Runtime Filter 与 Key Range 交互导致谓词丢失
- PR: #62114 `[Bug](scan) Preserve IN_LIST runtime filter predicates when key range is a scope range`
- PR: #62115 同主题修复分支
- 状态：Open
- 链接：apache/doris PR #62114 / #62115

**情况：**  
当 `MINMAX` 与 `IN` runtime filter 同时作用于同一 key 列，且 `IN` 值数量超过下推阈值时，`IN_LIST` 谓词可能被错误擦除。  

**影响评估：**
- 可能影响过滤正确性或执行效率
- 属于执行器与 runtime filter 交互边界 bug
- 在复杂 Join/过滤场景中潜在影响较大

---

### P2：Nereids 条件函数重写后的 nullability 回归
- PR: #62094 `[fix](fe) Preserve coalesce nullability after conditional rewrite`
- 状态：Open
- 链接：apache/doris PR #62094

**情况：**  
`coalesce` / `nvl` 等表达式在重写后 nullability 信息被错误传播，导致语义回归。  

**影响评估：**  
会影响计划推导、类型/可空性判断，进而可能影响优化决策或结果语义。

---

### P2：本地 Shuffle / Pooling 模式串行标记错误
- PR: #62054 `[fix](local shuffle) fix bucket shuffle exchange incorrectly marked as serial in pooling mode`
- 状态：Open
- 链接：apache/doris PR #62054

**情况：**  
带 pooled scan 的 fragment 中，BUCKET_SHUFFLE exchange 在 BE 侧可能被错误视为 serial operator。  

**影响评估：**  
更偏执行效率与并发度问题，可能引发性能退化而非结果错误。

---

### P2：Iceberg mixed-encoding position delete 文件读取问题
- PR: #62036 `branch-4.1: [fix](iceberg) Avoid dict reads on mixed-encoding position delete files`
- 状态：Open
- 链接：apache/doris PR #62036

**情况：**  
针对 Iceberg position delete 文件在 mixed encoding 场景下避免错误 dict read。  

**影响评估：**  
影响数据湖兼容性与读取稳定性，尤其是 Iceberg 生态接入场景。

---

## 6. 功能请求与路线图信号

### 1) 向量检索能力扩展到更多表模型
- Issue: #61712
- 链接：apache/doris Issue #61712

**信号判断：强**
- 用户明确要求 ANN index 支持 Unique Key / Aggregate Key。
- 这不是单纯文档问题，而是 Doris AI / 向量检索特性下一阶段演进的关键门槛。
- 若社区后续出现索引更新一致性、主键语义、聚合模型下向量列维护等设计讨论，则很可能进入中期路线图。

---

### 2) 第三方 Docker / 外部生态依赖启动优化
- Issue: #62101
- 链接：apache/doris Issue #62101

**信号判断：很强**
- 这是明确的 Track Issue，通常代表维护者已有系统性治理意图。
- 涉及 Hive、Iceberg 等组件，说明 Doris 正在强化数据湖联调/测试基础设施。
- 这类改进很可能以若干后续 PR 的形式逐步落地，而非单次大合并。

---

### 3) FS SPI / 存储抽象扩展正在推进
- PR: #62023 `Branch fs spi`
- 状态：Open
- 链接：apache/doris PR #62023  
- 相关关闭草稿：#62022
- 链接：apache/doris PR #62022

**信号判断：中强**
- 虽然摘要信息较少，但结合命名可判断与文件系统 SPI 抽象演进有关。
- 若继续推进，可能影响：
  - 外部存储接入方式
  - 存储后端插件化
  - 云对象存储 / HDFS / 定制 FS 适配层

---

### 4) 执行引擎性能路线持续强化
相关 PR：
- #61495 bucketed agg operator
- #61535 SegmentIterator adaptive batch size
- #61707 `length(str_col)` 子列读取优化
- #60601 多模式 CTE inline
- 链接：apache/doris PR #61495 / #61535 / #61707 / #60601

**信号判断：很强**
- 这些 PR 横跨执行器、优化器、存储读取层，说明 Doris 当前非常重视**端到端查询性能**。
- 预期下一版本中，性能优化不会是单点特性，而是一组系统性增强。

---

## 7. 用户反馈摘要

### 1) 生产导入链路的核心诉求是“稳”
- 来源：#56438、#62108、#62109、#62110、#62111  
- 链接：apache/doris Issue #56438；apache/doris PR #62108 / #62109 / #62110 / #62111

**提炼：**
- 用户希望 stream load 在异常输入、非 master 路由、鉴权失败等情况下给出一致且可预期的行为。
- 除了“能导入”，更在意**事务不卡住、日志不泄密、接口不吞错**。

---

### 2) 用户对查询正确性问题非常敏感
- 来源：#62043、#62094、#61177  
- 链接：apache/doris PR #62043 / #62094 / #61177

**提炼：**
- 漏斗分析、条件函数、点查短路执行等场景，一旦出现结果偏差，影响往往比单纯性能下降更严重。
- 社区近期修复集中出现在“边界语义正确性”，说明真实用户已在复杂查询上深度使用 Doris。

---

### 3) 开发与集成体验已成为显性痛点
- 来源：#62101  
- 链接：apache/doris Issue #62101

**提炼：**
- 第三方 Docker 启动慢、依赖重、状态复杂，说明 Doris 不仅在服务最终用户，也在服务大量开发者、测试者、生态集成者。
- 这类反馈通常意味着项目规模扩大后，**工程效率**已成为影响社区活跃度的重要因素。

---

### 4) AI/向量检索用户开始关注“模型适配”，而非仅仅“是否支持”
- 来源：#61712  
- 链接：apache/doris Issue #61712

**提炼：**
- 用户已经开始将向量检索放入真实表模型设计中思考。
- 这说明 Doris 的 ANN 能力已有一定关注度，下一步竞争点将转向**可维护性、与 OLAP 主模型协同、生产约束下的易用性**。

---

## 8. 待处理积压

以下是值得维护者关注的长期或半长期积压项。

### 1) 多模式 CTE inline 策略 PR 仍待推进
- PR: #60601
- 状态：Open / reviewed
- 链接：apache/doris PR #60601

**提醒：**  
这是优化器层较有战略意义的增强，若长期停留在 review 阶段，会影响 Nereids 在复杂 SQL 上的持续演进节奏。

---

### 2) SegmentIterator 自适应 batch size 属于高价值性能 PR
- PR: #61535
- 状态：Open / reviewed
- 链接：apache/doris PR #61535

**提醒：**  
该 PR 对 scan 性能与内存控制潜在收益大，建议维护者重点关注测试覆盖与回归风险，争取尽快给出合并结论。

---

### 3) Bucketed Agg Operator 是执行器层重要演进点
- PR: #61495
- 状态：Open
- 链接：apache/doris PR #61495

**提醒：**  
这是明显偏“大功能”的 PR，若设计成熟，建议配套补充：
- 适用场景说明
- 与现有 hash agg 的选择策略
- 性能基准测试
- 回退与兼容性评估

---

### 4) 数据湖读取重构 PR 需要避免长期悬而未决
- PR: #61783 `[refactoring](multi-catalog)data_lake_reader_refactoring`
- 状态：Open
- 链接：apache/doris PR #61783

**提醒：**  
多 catalog / data lake reader 重构影响面通常较广，若长时间不收敛，容易增加后续冲突与维护成本。

---

### 5) 老旧 stale 项反映出历史技术债仍需定期清理
- PR: #56322 `ui: remove unused dependencies`
- PR: #56383 `[check](expr) ...`
- PR: #56447 `branch-3.0: [fix](mysql) ...`
- Issue: #56438 `stream load ... prepare stage`
- 链接：apache/doris PR #56322 / #56383 / #56447；apache/doris Issue #56438

**提醒：**  
这些 stale 关闭项说明项目节奏快，但也提示：
- 老分支维护项容易失焦
- 部分问题可能因缺乏反馈而非真正解决而被关闭
- 建议对“导入链路、云场景、兼容性”类 stale 项做专题回看

---

## 附：健康度判断

**项目健康度：良好偏强。**  
核心依据包括：
- PR 活跃度极高，且并非纯文档更新，包含大量引擎、优化器、导入链路、云场景改动；
- 多个修复已开始跨版本回合并，说明维护流程较成熟；
- 社区问题开始从“基础可用”转向“正确性、安全性、生态工程效率、AI 场景适配”，这通常意味着项目进入更高成熟阶段。

**短期关注重点：**
1. stream load 状态机与安全修复是否尽快合并并补齐测试  
2. `window_funnel_v2`、scan runtime filter 等正确性问题是否快速落地  
3. bucketed agg、adaptive batch size、multi-mode CTE inline 等性能增强是否能在下一轮版本中形成组合收益

如果你愿意，我还可以继续把这份日报整理成更适合汇报的 **“管理层摘要版”** 或 **“研发团队跟进清单版”**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**日期：2026-04-04**

---

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储引擎开源生态整体呈现出两个非常鲜明的特征：**高活跃度**与**高质量收敛压力**并存。  
一方面，Apache Doris、ClickHouse、DuckDB、StarRocks、Iceberg、Delta Lake 等项目都保持了较高 PR 吞吐，说明行业仍处于快速演进阶段；另一方面，多个项目同时暴露出 **错误结果、崩溃、兼容性回归、CI/工程基础设施** 等问题，表明生态已从“功能扩张”进入“生产级细节打磨”阶段。  
从方向上看，社区共同聚焦于四类主题：**查询正确性与优化器边界修复、数据湖/多目录兼容、流式/CDC 链路增强、云原生与工程效率优化**。  
总体上，这一轮生态竞争的关键，已经不只是“谁功能多”，而是“谁在复杂生产场景下更稳、更兼容、更易集成”。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新数 | PR 更新数 | Release | 当日重点主题 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 4 | 153 | 无 | 执行引擎优化、Stream Load 安全修复、多目录/云场景工程化 | **良好偏强** |
| **ClickHouse** | 50 | 184 | 无 | 正确性修复、MergeTree 稳定性、执行/存储性能优化 | **良好，但回归压力高** |
| **DuckDB** | 14 | 46 | 无 | 查询正确性、窗口函数绑定重构、Parquet 精度与稳定性 | **活跃，处于工程收敛期** |
| **StarRocks** | 7 | 77 | 无 | Lake Persistent Index、shared-data 一致性、安全接口风险 | **良好，需压制高优先级风险** |
| **Apache Iceberg** | 4 | 42 | 无 | 元数据演进、Spark/Flink/Kafka Connect、REST Catalog | **良好，评审积压偏高** |
| **Delta Lake** | 2 | 27 | 无 | Kernel 能力补齐、DSv2 写路径、CDC 流式栈 | **方向清晰，处于大功能集成期** |
| **Databend** | 2 | 11 | 无 | 查询正确性、flashback 元数据一致性、branch/geometry 等特性 | **良好，中高活跃** |
| **Velox** | 4 | 50 | 无 | cuDF/GPU 回归、macOS 测试、Presto 函数兼容 | **中上，主干稳定性需跟进** |
| **Apache Gluten** | 3 | 9 | 无 | Velox 兼容、CI 修复、Spark 4.0 测试 | **良好，兼容性推进明显** |
| **Apache Arrow** | 14 | 19 | 无 | CI/构建、语言绑定完善、企业连接器交付 | **稳健偏积极** |

### 简要判断
- **最高活跃层**：ClickHouse、Apache Doris、StarRocks  
- **中高活跃层**：DuckDB、Iceberg、Velox  
- **功能集成/生态增强层**：Delta Lake、Arrow、Gluten、Databend  
- **无项目发布新版本**，说明多数项目处于 **功能收敛、回归修复、下一版本堆栈整合** 阶段。

---

## 3. Apache Doris 在生态中的定位

## 3.1 Doris 的相对优势

与同类项目相比，Apache Doris 当前最突出的优势是：**一体化分析数据库能力 + 持续增强的数据湖/多 Catalog 能力 + 高速社区交付节奏**。

具体看：

1. **一体化程度高**  
   Doris 同时覆盖：
   - MPP 查询执行
   - 存储层优化
   - 导入链路（如 Stream Load）
   - 多 Catalog / JDBC / 数据湖接入
   - 向量检索（ANN）等新能力  
   相比 Iceberg/Delta 这类表格式项目，Doris 更接近“可直接承载查询与服务的数据库系统”；相比 Velox/Arrow，这种能力更靠近终端用户。

2. **执行引擎与优化器仍在快速进化**  
   如 bucketed agg operator、SegmentIterator adaptive batch size、多模式 CTE inline、子列裁剪等，说明 Doris 没有停留在“已有 SQL 可用”，而是在持续做 **端到端性能工程**。

3. **数据湖/生态兼容能力增强明显**  
   JDBC Catalog、Iceberg 相关修复、第三方 Docker 依赖优化、FS SPI 信号，体现 Doris 正从传统 OLAP 引擎走向 **开放湖仓中枢型系统**。

4. **社区节奏非常快**  
   单日 153 条 PR 更新，在数据库项目中属于高位，说明其研发投入和维护者吞吐都很强。

---

## 3.2 Doris 的短板与压力点

与生态头部项目相比，Doris 当前也有几个明显压力点：

1. **导入链路仍是稳定性敏感区**  
   Stream Load 今日连续出现多条安全/状态机修复，说明该路径仍在高频补洞。

2. **复杂查询正确性仍需持续加固**  
   `window_funnel_v2`、runtime filter 与 key range、nullability 重写、短路点查 projection 等问题，表明 Doris 与 ClickHouse/DuckDB 一样，正进入 **优化器和执行器边界 correctness 阶段**。

3. **向量检索仍处于“能力边界被追问”的早期产品化阶段**  
   ANN 仅支持 Duplicate Key 的讨论说明：Doris 的 AI/向量检索能力已有关注度，但离“无缝融入现有数仓模型”还有距离。

---

## 3.3 Doris 与同类项目的技术路线差异

### 对比 ClickHouse
- **ClickHouse** 更偏极致性能、MergeTree 生态、类型/函数面极广，但正确性回归和新类型边界问题更频繁暴露。
- **Doris** 则更强调整体数据库产品化、一体化导入/查询/多目录能力，工程平衡感更强。

### 对比 StarRocks
- **StarRocks** 与 Doris 最接近，都在向云原生 + 湖仓一体演进。
- StarRocks 近期更聚焦 **shared-data / persistent index / 主键表云原生路径**；
- Doris 则更偏 **执行引擎、导入链路、Catalog/联邦能力** 的综合推进。

### 对比 DuckDB
- **DuckDB** 强项在嵌入式、单机分析、开发者体验和快速内核创新；
- **Doris** 强项在分布式服务化、多租户、在线分析平台化能力。

### 对比 Iceberg / Delta Lake
- Iceberg / Delta 核心是 **开放表格式与元数据规范**；
- Doris 则是 **面向查询和服务的数据库系统**，更多承担执行与数据服务角色，而非仅作为格式层。

---

## 3.4 社区规模对比

按当日活跃度粗略看：

- **第一梯队超高活跃**：ClickHouse（184 PR / 50 Issues）、Doris（153 PR）、StarRocks（77 PR）
- **第二梯队活跃**：DuckDB、Iceberg、Velox
- **第三梯队功能堆栈期**：Delta、Arrow、Databend、Gluten

从这个角度，**Doris 已明显处于 OLAP 数据库开源生态的高活跃核心层**。  
其社区规模和开发节奏已经接近或进入“头部数据库项目”序列，而不是中腰部项目。

---

## 4. 共同关注的技术方向

以下是多项目同时涌现、具有行业共性的技术主题。

### 4.1 查询正确性优先级显著上升
**涉及项目**：Doris、ClickHouse、DuckDB、Databend、StarRocks、Iceberg

**典型诉求：**
- Doris：窗口漏斗、runtime filter 谓词丢失、nullability 回归
- ClickHouse：JSON 索引丢行、JOIN 改写错误、函数派发错误
- DuckDB：窗口优化错误结果、DISTINCT + LEFT JOIN 间歇性漏行
- Databend：常量折叠忽略 session context
- Iceberg：Spark time-travel / branch cache correctness
- StarRocks：shared-data 查询可见性与 PK corruption

**结论**：  
行业已经从“做更多优化”转向“优化必须严格语义等价”。  
这对技术决策者意味着：**评估数据库时，不能只看 benchmark，还要重点看 correctness 修复密度与回归测试文化**。

---

### 4.2 数据湖/多 Catalog/开放格式兼容持续升温
**涉及项目**：Doris、StarRocks、ClickHouse、Iceberg、Delta Lake、Arrow、Gluten

**典型诉求：**
- Doris：JDBC Catalog、Iceberg 读取、第三方 Docker 生态
- StarRocks：Iceberg V3、JDBC Catalog + Iceberg 告警、Arrow 新类型
- ClickHouse：Parquet + S3 读取问题
- Iceberg：Avro/Parquet/REST Catalog/Spark/Flink/Kafka Connect
- Delta：UniForm、REST commit、Kernel 生态
- Arrow：Hive ACID、ODBC/Flight SQL、跨语言 schema 保真
- Gluten：Spark 4.0 + Iceberg 测试修复

**结论**：  
开放湖仓兼容已从“附加能力”变成主战场。  
数据库和表格式项目都在围绕 **Iceberg/Parquet/Arrow/REST/外部 Catalog** 构建互操作能力。

---

### 4.3 流式写入、CDC、增量消费能力成为共同热点
**涉及项目**：Doris、Iceberg、Delta Lake、StarRocks

**典型诉求：**
- Doris：Stream Load 安全、状态机一致性、事务卡住治理
- Iceberg：Flink CDC、Kafka Connect 静默失效
- Delta：kernel-spark CDC 流式读取全栈推进
- StarRocks：publish_version / shared-data 发布链路稳定性

**结论**：  
批处理型引擎正进一步靠近实时链路，用户要求的不再只是“能导入”，而是：
- 状态机稳定
- 失败可观测
- 增量结果正确
- 与表格式/删除向量/快照机制协同一致

---

### 4.4 云原生与工程效率正在成为核心竞争力
**涉及项目**：Doris、StarRocks、Arrow、Gluten、Velox、DuckDB

**典型诉求：**
- Doris：第三方 Docker 启动优化、Cloud 日志修复
- StarRocks：shared-data 模式、一致性与对象存储 IO 优化
- Arrow：Windows ODBC 签名/静态构建
- Gluten：CI 镜像构建修复
- Velox：macOS grouped tests 调整、cuDF CI
- DuckDB：动态 CI 作业与缓存

**结论**：  
工程效率、CI 健康、云环境可运维性，已经从“内部问题”上升为社区显性能力。  
这直接影响引擎 adoption 速度。

---

### 4.5 向量化/复杂类型/半结构化数据支持加速演进
**涉及项目**：Doris、ClickHouse、DuckDB、StarRocks、Arrow

**典型诉求：**
- Doris：ANN index 适配更多表模型
- ClickHouse：JSON、Variant、Dynamic 类型 correctness 与优化
- DuckDB：VARIANT 写 Parquet、HUGEINT 精度
- StarRocks：Arrow StringView/BinaryView
- Arrow：large_string/large_binary DictionaryArray 支持

**结论**：  
现代分析引擎的竞争，正从纯结构化 OLAP 走向 **半结构化、向量检索、复杂类型互操作**。

---

## 5. 差异化定位分析

## 5.1 存储格式层 vs 查询引擎层

| 类别 | 代表项目 | 核心定位 |
|---|---|---|
| 分析数据库/查询引擎一体机 | Doris、ClickHouse、StarRocks、Databend | 自带查询执行、存储管理、导入/服务能力 |
| 嵌入式分析引擎 | DuckDB | 单机/嵌入式 OLAP、数据交换与本地分析 |
| 开放表格式/元数据层 | Iceberg、Delta Lake | 规范与元数据管理，依赖外部执行引擎 |
| 执行内核/中间层 | Velox、Gluten | 作为上层引擎的执行加速与替换层 |
| 数据交换/列式基础设施 | Arrow | 跨语言、跨系统的内存格式与连接层 |

---

## 5.2 查询引擎设计差异

- **Doris / StarRocks**：典型 MPP 分布式 OLAP，强调 FE/BE 架构、分布式查询、湖仓一体。
- **ClickHouse**：以 MergeTree 为中心的高性能分析数据库，擅长极致吞吐与复杂类型扩展。
- **DuckDB**：向量化单机执行引擎，强调嵌入式与开发者体验。
- **Databend**：云原生架构更鲜明，正在强化版本化、branch、历史快照等能力。
- **Velox / Gluten**：更多是执行后端，不直接作为完整数据库面向终端用户。

---

## 5.3 目标负载类型差异

- **Doris / StarRocks**：企业级报表、实时数仓、联邦查询、湖仓混合负载
- **ClickHouse**：高速聚合查询、日志分析、行为分析、复杂函数型分析
- **DuckDB**：数据科学、本地分析、ETL 中间层、嵌入式处理
- **Iceberg / Delta**：批流一体数据湖、表格式管理、跨引擎共享
- **Velox / Gluten**：为 Spark/Presto 类系统提供原生执行加速
- **Arrow**：数据交换、连接器、跨语言列式互通

---

## 5.4 SQL 兼容性路线差异

- **ClickHouse**：在扩展型 SQL 与自有函数生态上最激进，也因此更容易出现语义边界问题。
- **DuckDB**：持续提升 PostgreSQL 风格兼容与标准 SQL 体验。
- **Doris / StarRocks**：偏向企业 BI/数仓兼容，重视复杂报表 SQL 和多 Catalog 查询。
- **Databend**：正在强化 binder / alias / datetime 等 SQL 语义稳定性。
- **Iceberg / Delta**：更多通过 Spark/Flink/Trino 等外部引擎继承 SQL 语义。
- **Velox / Gluten**：重点是对 Presto/Spark 语义做执行层对齐，而非独立 SQL 方言建设。

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：超高活跃、核心竞争区
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特点：
- PR 数量大
- 修复和特性并进
- 社区问题来源既有 CI/fuzz，也有大量真实生产反馈

### 第二层：高活跃、技术深耕区
- **DuckDB**
- **Apache Iceberg**
- **Velox**

特点：
- 重点在深层内核、元数据、执行器、复杂查询语义
- 正在从能力扩张转向稳定性和架构收敛

### 第三层：集成堆栈与生态补齐区
- **Delta Lake**
- **Arrow**
- **Gluten**
- **Databend**

特点：
- 更偏路线型特性、连接层增强、基础设施完善
- 不一定 issue/PR 数量最高，但对生态协同价值大

---

## 6.2 哪些项目处于快速迭代阶段

**快速迭代代表：**
- Doris
- ClickHouse
- StarRocks
- Delta Lake（虽 PR 数不极高，但大功能栈特征明显）

表现：
- 频繁大 PR
- 多条关键路径并行推进
- 新能力与修复同时高速发生

---

## 6.3 哪些项目处于质量巩固阶段

**质量巩固代表：**
- DuckDB
- Iceberg
- Arrow
- Velox
- Gluten

表现：
- correctness/兼容性/CI 问题明显增多
- 工程治理、长期积压清理、接口一致性成为重点
- 不追求短期大量面向用户的新特性，而重视长期可维护性

---

## 7. 值得关注的趋势信号

## 7.1 “错误结果”已经成为比 crash 更敏感的社区议题
无论是 ClickHouse 的 JSON 索引丢行、DuckDB 的窗口优化误结果，还是 Doris/Databend 的优化器语义回归，都说明：  
**分析型数据库进入成熟竞争阶段后，正确性优先级显著高于单纯性能。**

**对数据工程师的建议：**
- 评估引擎时要看 release note 中 correctness bug 的密度
- 对复杂 SQL、窗口、JOIN、CTE、运行时过滤等场景建立回归测试

---

## 7.2 湖仓互操作已成为所有主流项目的共同赛道
Iceberg、Delta、Arrow、Parquet、REST Catalog、JDBC Catalog、UniForm、Arrow 新类型等同时高频出现，说明：  
**未来数据库不可能脱离开放生态单独竞争。**

**对架构师的建议：**
- 新系统选型不能只看单一引擎性能，要看其在 Iceberg/Delta/Arrow/Parquet 生态中的位置
- 多引擎并存将成为常态，互操作性会直接决定平台成本

---

## 7.3 流式导入与 CDC 进入“生产级语义”竞争
Doris、Delta、Iceberg、StarRocks 都在处理 CDC、提交失败、状态机、一致性、Deletion Vector 等问题。  
这说明行业重点已从“支持 CDC”变成“**在复杂异常下仍保持一致和可恢复**”。

**对数据平台团队的建议：**
- 设计实时链路时，优先验证失败恢复、事务状态机、重复消费与删除语义
- 不要只关注吞吐指标

---

## 7.4 云原生时代，工程基础设施本身也是产品能力
第三方 Docker 启动、Windows ODBC 签名、CI 合规、macOS 测试发现、动态 CI job 等，都在告诉我们：  
**开发体验、集成效率、交付可用性，已经成为数据库竞争力的一部分。**

**对技术管理者的建议：**
- 选择项目时要评估其 CI、测试、打包、容器化成熟度
- 这直接影响二次开发成本和团队落地速度

---

## 7.5 AI / 向量 / 半结构化能力正在成为下一轮差异化焦点
Doris 的 ANN、ClickHouse 的 JSON/Variant、DuckDB 的 VARIANT、Arrow 的大字段类型支持，反映出传统 OLAP 正在向新型数据负载扩展。

**对架构师的建议：**
- 如果未来 workload 包含 embedding、事件 JSON、复杂对象列，应优先考察类型系统和正确性成熟度
- “支持”不再是判断标准，“是否能与主表模型/主查询路径自然协同”才是关键

---

# 总结结论

从 2026-04-04 的横向动态看，OLAP / 分析型存储引擎生态正处于一个非常典型的阶段：  
**头部项目继续高速演进，但竞争焦点已从“功能广度”逐步转向“正确性、生态兼容、实时链路稳定性和工程可交付性”。**

对于 Apache Doris 而言，它已经稳居这一生态的头部活跃阵营，优势在于：
- 一体化数据库能力强
- 执行引擎和多 Catalog 能力同步演进
- 社区交付速度快

但同时，它也与 ClickHouse、DuckDB、StarRocks 一样，进入了一个更苛刻的阶段：  
**谁能更快收敛复杂查询正确性、导入链路稳定性与开放生态兼容性，谁就更有可能在下一阶段赢得企业级采用。**

如果你愿意，我下一步可以继续输出两种版本之一：

1. **管理层摘要版**：1 页内，突出结论、风险、选型建议  
2. **研发跟进版**：按“查询引擎 / 数据湖 / 流式导入 / 云原生 / 向量检索”分类列出重点项目信号与建议动作

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时 ClickHouse 维持了非常高的研发活跃度：**Issues 更新 50 条，PR 更新 184 条**，但**无新版本发布**。  
从内容看，当前工作重心明显集中在三类问题：**查询正确性修复、MergeTree/索引相关稳定性、以及执行引擎与存储层性能优化**。  
社区侧也很活跃，既有 CI/crash/fuzz 自动发现的问题，也有来自生产环境用户的兼容性与升级回归反馈，说明项目仍处于**高吞吐开发 + 高频质量收敛**阶段。  
整体健康度较好：关闭了 8 个 Issue、67 个 PR 完成合并或关闭，但新增的 correctness 类问题较多，短期内仍需持续关注回归风险。

---

## 3. 项目进展

> 注：当天提供的数据未列出全部 merged PR 明细，以下重点覆盖“今日有状态推进、且影响较大的 PR/已关闭 PR”。

### 3.1 查询引擎与表达式正确性持续修补

- **修复 Variant/LowCardinality 比较常量折叠崩溃**
  - PR: #101690  
  - 链接: ClickHouse/ClickHouse PR #101690
  - 进展：修复 `LowCardinality(Nullable(...))` 与 `Variant` 中 `NULL` 值比较时触发 `ColumnUnique can't contain null values` 崩溃。
  - 意义：这类问题直接影响表达式优化器和常量折叠阶段，属于**查询前期优化导致的稳定性问题**，若合入可降低复杂类型在优化阶段的崩溃概率。

- **修复 Cross/Comma Join 约束覆盖问题**
  - PR: #101684  
  - 链接: ClickHouse/ClickHouse PR #101684
  - 进展：修复在 `RIGHT/LEFT JOIN` 嵌套于 `COMMA/CROSS JOIN` 场景中出现的 `"Cannot fold actions for projection"` 崩溃。
  - 意义：说明 Join 语义约束在查询重写/投影折叠链路上仍有边界条件，属于**复杂 SQL 组合场景正确性修复**。

- **修复 PARSING_EXCEPTION 错误提示未正确生效**
  - PR: #101675  
  - 链接: ClickHouse/ClickHouse PR #101675
  - 进展：修复测试 hint 对语法错误处理不一致的问题。
  - 意义：虽然偏测试与客户端错误处理，但会改善**语法错误定位与测试稳定性**，有助于减少误判。

### 3.2 存储引擎与 MergeTree 路径继续优化

- **修复 MergeTreeReaderWide::readRows 返回行数未限制问题**
  - PR: #101683  
  - 链接: ClickHouse/ClickHouse PR #101683
  - 进展：补齐 `IMergeTreeReader` 实现间的一致性，确保返回值不会超过 `max_rows_to_read`。
  - 意义：这是典型的**存储读取层接口契约修复**，有助于避免上层算子在极端情况下出现越界假设或统计异常。

- **优化 patch parts 应用性能**
  - PR: #101679  
  - 链接: ClickHouse/ClickHouse PR #101679
  - 进展：围绕 patch part 应用流程做性能改进。
  - 意义：若该优化成熟，将直接改善 MergeTree 相关写入/变更场景的吞吐与资源消耗，偏向**后台数据处理链路性能优化**。

- **Storage Merge 虚拟列下推改进**
  - PR: #101742  
  - 链接: ClickHouse/ClickHouse PR #101742
  - 进展：增强 `Merge` 存储的虚拟列 push-down。
  - 意义：对联合查询、分表路由及只读元信息过滤场景有价值，体现出项目对**查询裁剪与 IO 减少**的持续投入。

### 3.3 性能特性与实验功能推进

- **Keeper bench 大幅提速**
  - PR: #100670  
  - 链接: ClickHouse/ClickHouse PR #100670
  - 进展：移除无效队列与统计锁，基准从约 `500K req/s` 提升到 `12M iterations/s`。
  - 意义：虽是 benchmark 工具层改动，但释放了对 Keeper 上限的观测能力，对后续**协调服务性能评估**很有帮助。

- **BloomFilter 优化**
  - PR: #100201  
  - 链接: ClickHouse/ClickHouse PR #100201
  - 进展：通过 loop fission 与 `k=3` 特化路径优化 BloomFilter。
  - 意义：对跳数较高的过滤场景、Join runtime filter、索引判定都可能带来 CPU 收益。

- **基于统计信息禁用 Join Runtime Filter**
  - PR: #97501  
  - 链接: ClickHouse/ClickHouse PR #97501
  - 进展：当高 NDV 导致 Bloom filter 饱和时，自动避免无收益 runtime filter。
  - 意义：这是典型的**成本模型/自适应执行优化**，能减少“过滤器开销大于收益”的情况。

- **实验功能：部分聚合缓存**
  - PR: #93757  
  - 链接: ClickHouse/ClickHouse PR #93757
  - 进展：引入 `use_partial_aggregate_cache`，对 MergeTree 的 part 级 GROUP BY 中间态缓存。
  - 意义：若最终落地，将是对重复聚合分析场景很有潜力的**分析型加速特性**。

### 3.4 已关闭/完成的重要事项

- **防止创建写入不存在列的物化视图**
  - PR: #74481（已关闭）  
  - 链接: ClickHouse/ClickHouse PR #74481
  - 意义：这是物化视图可用性和数据正确性的重要增强，说明维护者正在持续补齐 MV 校验。

- **允许修改数据库 comment**
  - PR: #75622（已关闭）  
  - 链接: ClickHouse/ClickHouse PR #75622
  - 意义：属于元数据管理增强，虽非核心性能特性，但对治理和可维护性友好。

---

## 4. 社区热点

### 4.1 最活跃 Issue：CI 崩溃与内存/生命周期问题

- **#99799 Double deletion of MergeTreeDataPartCompact in multi_index**
  - 链接: ClickHouse/ClickHouse Issue #99799
  - 评论数：23
  - 观察：这是今日最热 issue，指向 `MergeTreeDataPartCompact` 在 `multi_index` 场景下的**双重释放**，属于高危内存生命周期错误。
  - 技术诉求：社区最关心的是 **MergeTree 索引与 part 生命周期的内存安全**。这类问题若进入稳定分支，风险较高。

- **#97459 Query type is ExceptionBeforeStart but memory_usage > 0 with multiple threads**
  - 链接: ClickHouse/ClickHouse Issue #97459
  - 评论数：11
  - 观察：用户反馈 HTTP 慢流式源失败后，日志中仍记为 `ExceptionBeforeStart`，但查询显然执行了很久且有内存消耗。
  - 技术诉求：不只是 bug，本质上是对 **query_log 准确性、可观测性与资源审计** 的要求。

### 4.2 高关注正确性问题：JSON、Join、优化器重写

- **#101700 MinMax index on JSON column silently drops valid rows**
  - 链接: ClickHouse/ClickHouse Issue #101700
  - 评论数：5
  - 观察：这是典型的**查询结果错误**，严重程度高于普通 crash，因为会静默漏数。
  - 技术诉求：社区对新 JSON 类型的索引支持已有较强需求，但前提是**不能牺牲正确性**。

- **#101698 tryConvertJoinToIn allows ALL strictness, producing wrong row count**
  - 链接: ClickHouse/ClickHouse Issue #101698
  - 评论数：2
  - 观察：优化器将 JOIN 改写为 IN 时忽略 strictness，导致重复键下行数变少。
  - 技术诉求：用户希望性能优化建立在**严格语义等价**之上，尤其是 JOIN 改写。

- **#101699 positiveModulo(tuple, number) dispatches to tupleDivideByNumber**
  - 链接: ClickHouse/ClickHouse Issue #101699
  - 评论数：2
  - 观察：函数分发走错路径，结果从 modulo 变成 division。
  - 技术诉求：表达式模板与 operation trait 扩展后，社区担心**算子注册/派发体系的回归**。

### 4.3 生产升级兼容性反馈

- **#101704 extract-from-config does not resolve from_env values in 26.2.5**
  - 链接: ClickHouse/ClickHouse Issue #101704
  - 评论数：2
  - 观察：影响 Docker entrypoint，属于典型升级回归。
  - 技术诉求：容器化部署用户非常依赖 **from_env 配置注入**，这类回归会直接阻断升级。

- **#99019 Error reading Parquet file in v26.2.4.23**
  - 链接: ClickHouse/ClickHouse Issue #99019
  - 评论数：4，👍 1
  - 观察：Parquet + `s3()` + where 条件读取失败，触及外部数据湖互操作。
  - 技术诉求：外部格式与对象存储兼容性依旧是生产用户的高优先级需求。

---

## 5. Bug 与稳定性

> 按严重程度排序，优先考虑“错误结果 > 崩溃 > 升级阻断 > 观测不准 > 文档/描述问题”。

### P0 / 查询结果错误

1. **JSON 列上的 MinMax 索引可能静默丢行**
   - Issue: #101700  
   - 链接: ClickHouse/ClickHouse Issue #101700
   - 风险：**静默错误结果**，比 crash 更危险。
   - 状态：暂未见直接 fix PR。

2. **JOIN 转 IN 改写在 ALL strictness 下导致行数错误**
   - Issue: #101698  
   - 链接: ClickHouse/ClickHouse Issue #101698
   - 风险：优化器错误改写导致结果集缩小。
   - 状态：暂未见直接 fix PR。

3. **positiveModulo(tuple, number) 返回除法结果**
   - Issue: #101699  
   - 链接: ClickHouse/ClickHouse Issue #101699
   - 风险：函数语义错误，可能影响业务计算逻辑。
   - 状态：暂未见直接 fix PR。

4. **多 bucket Map 在 Dynamic/Variant 中读两次路径修复不完整**
   - Issue: #101667  
   - 链接: ClickHouse/ClickHouse Issue #101667
   - 风险：复杂类型读取路径存在一致性问题。
   - 状态：暂未见直接 fix PR。

### P1 / 崩溃、断言、内存安全

5. **MergeTreeDataPartCompact 双重释放**
   - Issue: #99799  
   - 链接: ClickHouse/ClickHouse Issue #99799
   - 风险：高危内存安全问题。
   - 状态：暂未见对应 fix PR。

6. **DDL worker / txn 断言失败**
   - Issue: #101615  
   - 链接: ClickHouse/ClickHouse Issue #101615
   - 风险：fuzz 发现的一致性/事务边界问题。
   - 状态：暂无 fix PR。

7. **MemorySanitizer use-of-uninitialized-value**
   - Issue: #101649  
   - 链接: ClickHouse/ClickHouse Issue #101649
   - 风险：未初始化读，通常意味着潜在非确定性 bug。
   - 状态：暂无 fix PR。

8. **合并期间临时 part rename 失败**
   - Issue: #99307  
   - 链接: ClickHouse/ClickHouse Issue #99307
   - 风险：MergeTree 后台 merge 稳定性问题。
   - 状态：暂无 fix PR。

9. **Variant NULL + LowCardinality 比较导致 crash**
   - Issue 对应修复：
     - PR: #101690  
     - 链接: ClickHouse/ClickHouse PR #101690
   - 状态：**已有 fix PR**。

10. **Cross/Comma Join 嵌套 JOIN 崩溃**
    - Issue 对应修复：
      - PR: #101684  
      - 链接: ClickHouse/ClickHouse PR #101684
    - 状态：**已有 fix PR**。

### P2 / 升级回归与部署阻断

11. **26.2.5 中 extract-from-config 不解析 from_env**
    - Issue: #101704  
    - 链接: ClickHouse/ClickHouse Issue #101704
    - 风险：容器化启动流程失败，升级阻断。
    - 状态：暂无 fix PR。

12. **S3 cached disk 的 thread_pool_size 导致启动崩溃**
    - PR: #101712  
    - 链接: ClickHouse/ClickHouse PR #101712
    - 状态：**已有 fix PR**，问题相对明确。

13. **Parquet 文件读取异常**
    - Issue: #99019  
    - 链接: ClickHouse/ClickHouse Issue #99019
    - 风险：影响数据湖接入。
    - 状态：暂无 fix PR。

### P3 / 观测、日志、描述或辅助工具问题

14. **ExceptionBeforeStart 与实际资源消耗不一致**
    - Issue: #97459  
    - 链接: ClickHouse/ClickHouse Issue #97459
    - 风险：影响计费、审计、排障。
    - 状态：暂无 fix PR。

15. **system.s3_queue_settings / azure_queue_settings 中 alterable 描述反了**
    - Issue: #101694  
    - 链接: ClickHouse/ClickHouse Issue #101694
    - 风险：文档/系统表说明误导。
    - 状态：暂无 fix PR。

16. **SSH exit code 被错误折叠成 0/1**
    - Issue: #101741  
    - 链接: ClickHouse/ClickHouse Issue #101741
    - 风险：工具链状态判断失真。
    - 状态：暂无 fix PR。

---

## 6. 功能请求与路线图信号

### 6.1 与 SQL/类型系统相关的新需求

- **支持 `generateRandom()` 生成 JSON 类型**
  - Issue: #92360  
  - 链接: ClickHouse/ClickHouse Issue #92360
  - 信号：JSON 类型已越来越核心，测试与 benchmark 生态也开始要求原生支持。带有 `feature, easy task` 标签，**进入后续版本的概率较高**。

- **增加“SQL 标准兼容”总开关**
  - Issue: #98600  
  - 链接: ClickHouse/ClickHouse Issue #98600
  - 信号：这不是单点功能，而是**兼容性策略入口**。若推进，可能演化为一组 profile/setting preset，对迁移传统数仓用户很关键。

- **支持复合 interval literals**
  - Issue: #99611（已关闭）  
  - 链接: ClickHouse/ClickHouse Issue #99611
  - 信号：即便当前 issue 已关闭，也反映出社区仍在推动更完整 SQL 语法兼容。

### 6.2 可观测性与系统表增强

- **`system.query_log` 增加 `used_index_types`**
  - Issue: #101673  
  - 链接: ClickHouse/ClickHouse Issue #101673
  - 信号：这是很强的产品化需求，便于了解索引命中情况、支持低成本遥测。由于是 `easy task` 且内部场景明确，**落地可能性较高**。

- **查询日志补全 row policies**
  - PR: #101044  
  - 链接: ClickHouse/ClickHouse PR #101044
  - 信号：结合上面的索引使用日志需求，可以看出团队正在持续强化**治理与观测层数据面**。

### 6.3 连接器 / 外部系统 / URL 引擎能力

- **扩展 URL engine / table function 的 schema 与相对 URL**
  - Issue: #59617  
  - 链接: ClickHouse/ClickHouse Issue #59617
  - 信号：该需求已存在较久，但仍有更新，说明 URL 访问统一抽象仍有价值。

- **URL engine 写入支持 POST/PUT 重定向控制**
  - PR: #98977  
  - 链接: ClickHouse/ClickHouse PR #98977
  - 信号：说明 URL/HTTP 连接能力正在补齐，和 #59617 共同构成**外部数据接入增强**路线。

### 6.4 物化视图与缓存路线

- **物化视图校验继续加强**
  - PR: #74481，PR: #101743  
  - 链接: ClickHouse/ClickHouse PR #74481  
  - 链接: ClickHouse/ClickHouse PR #101743
  - 信号：MV 是真实用户高频踩坑点，近期持续出现“补校验”“补测试”动作，说明维护者在把 **MV 正确性/易用性** 作为重点。

- **部分聚合缓存**
  - PR: #93757  
  - 链接: ClickHouse/ClickHouse PR #93757
  - 信号：如果实验特性成熟，可能成为未来版本面向 BI/重复聚合场景的重要性能卖点。

---

## 7. 用户反馈摘要

### 7.1 真实生产痛点集中在“升级后兼容性”和“静默错误”

- Docker 与环境变量配置注入问题（#101704）表明，很多用户通过**容器编排 + 环境变量模板**部署 ClickHouse，一旦配置解析行为变化，升级成本极高。  
  链接: ClickHouse/ClickHouse Issue #101704

- Parquet/S3 读取失败（#99019）说明用户大量依赖 ClickHouse 直接查询对象存储中的开放格式文件，**数据湖互操作性** 已经是核心生产诉求。  
  链接: ClickHouse/ClickHouse Issue #99019

- JSON MinMax 索引丢行（#101700）、JOIN 转 IN 行数错误（#101698）这类问题反映出用户最不能接受的是**性能优化引入的错误结果**。  
  链接: ClickHouse/ClickHouse Issue #101700  
  链接: ClickHouse/ClickHouse Issue #101698

### 7.2 用户越来越重视可观测性与行为解释

- `ExceptionBeforeStart` 与真实执行状态不一致（#97459）说明用户不仅要“查询能跑”，还要求**query_log、memory_usage、query kind 分类**能真实反映执行过程。  
  链接: ClickHouse/ClickHouse Issue #97459

- 请求增加 `used_index_types`（#101673）说明用户希望知道“索引到底有没有生效”，这体现出从单纯使用数据库，转向**精细化优化与成本分析**。  
  链接: ClickHouse/ClickHouse Issue #101673

### 7.3 复杂 SQL 与兼容性需求在上升

- SQL 标准兼容总开关（#98600）、复合 interval 语法（#99611）、URL/HTTP 行为增强（#98977）共同表明，越来越多用户希望 ClickHouse 在保持性能优势的同时，减少与传统 SQL 系统和数据平台之间的行为差异。  
  链接: ClickHouse/ClickHouse Issue #98600  
  链接: ClickHouse/ClickHouse Issue #99611  
  链接: ClickHouse/ClickHouse PR #98977

---

## 8. 待处理积压

### 8.1 长期未解决且仍有现实影响的 Issue

- **#52605 分布式表 + UNION 子查询同别名导致 UNKNOWN_IDENTIFIER**
  - 创建时间：2023-07-26
  - 链接: ClickHouse/ClickHouse Issue #52605
  - 风险：影响复杂 SQL 在分布式环境下的可用性，属于老问题，建议维护者确认是否仍可复现并补充最小复现。

- **#53341 查询字典时出现 Update failed for dictionary**
  - 创建时间：2023-08-11
  - 链接: ClickHouse/ClickHouse Issue #53341
  - 风险：字典仍是很多维表/外部映射场景的基础能力，老 issue 持续活跃值得重新分诊。

- **#59617 扩展 URL engine schema 与相对 URL**
  - 创建时间：2024-02-05
  - 链接: ClickHouse/ClickHouse Issue #59617
  - 风险：虽不是 blocker，但长期存在说明 API/引擎统一性需求一直未被完全满足。

### 8.2 近期值得优先关注的开放 PR

- **#93757 PartialAggregateCache**
  - 链接: ClickHouse/ClickHouse PR #93757
  - 这是潜在高价值实验特性，但开放周期较长，建议维护者明确性能收益、适用边界和是否进入稳定路线。

- **#97501 统计驱动禁用 Join Runtime Filters**
  - 链接: ClickHouse/ClickHouse PR #97501
  - 该 PR 具有明显成本模型价值，若验证充分，建议优先推进。

- **#98977 URL engine 写入重定向设置**
  - 链接: ClickHouse/ClickHouse PR #98977
  - 对 HTTP 写入兼容性很实用，建议结合 #59617 一并评估为 URL 连接能力增强的一部分。

- **#99283 macOS 测试运行兼容性**
  - 链接: ClickHouse/ClickHouse PR #99283
  - CI/开发体验改进虽不直接面向用户，但对跨平台贡献者生态很重要。

---

## 总结判断

今天 ClickHouse 的主线非常清晰：  
一方面，团队在持续推进 **查询优化器、Join、MergeTree 读取路径、缓存和过滤器** 等核心引擎能力；另一方面，社区不断暴露出 **新类型（JSON/Variant/Dynamic）、复杂 SQL 改写、以及部署升级兼容性** 带来的 correctness 与稳定性压力。  
从健康度看，项目依旧保持高速度迭代，但短期最值得关注的并不是“新功能数量”，而是**错误结果类问题的收敛速度**，尤其是 JSON 索引、JOIN 改写和表达式派发相关回归。  
如果接下来几天能看到 #101700、#101698、#99799 等问题出现明确修复 PR，整体风险面会显著下降。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 — 2026-04-04

## 1. 今日速览

过去 24 小时 DuckDB 保持了很高的开发活跃度：Issues 更新 14 条、PR 更新 46 条，明显处于持续高频迭代状态。  
从内容看，今日工作重点集中在 **查询正确性修复、窗口函数绑定重构、Parquet 类型精度/稳定性、CI 与工程基础设施优化**。  
问题侧既有 **错误结果类缺陷**，也有 **内部断言/崩溃类问题**，说明 1.5.x 新功能和优化仍在快速打磨阶段。  
整体健康度评价为 **活跃且偏工程收敛期**：新功能继续推进，但稳定性与回归修复仍是当前核心主题。

---

## 3. 项目进展

> 今日无新版本发布。

### 已合并 / 已关闭的重要 PR 与事项

#### 3.1 ATTACH 语法增强推进 SQL 灵活性
- **PR #21693 — Add expression as DatabasePath argument to ATTACH**  
  链接: duckdb/duckdb PR #21693

该 PR 已关闭，摘要显示已完成 parser 层面的增强，使 `ATTACH` 的数据库路径参数支持表达式。这类改动通常提升：
- SQL 脚本动态化能力
- 嵌入式/程序化场景下的路径拼接灵活性
- 与参数化工作流的兼容性

这是偏 **SQL 语法能力增强** 的进展，对数据管道、模板 SQL、客户端集成较有价值。

---

#### 3.2 TopN Window Sets 优化修补
- **PR #21775 — Issue #21682: TopN Window Sets**  
  链接: duckdb/duckdb PR #21775

该 PR 已关闭，核心说明是：
- 在优化被 set operation 使用时，注入 schema projection

这意味着 DuckDB 对 **窗口函数优化路径与集合操作组合时的正确性/元信息一致性** 做了补强。虽然属于“补丁式”修正，但反映出窗口优化器仍在持续细化边界条件。

---

#### 3.3 ADBC 并发/竞态问题处理完成
- **PR #21800 — Fix ADBC data race**  
  链接: duckdb/duckdb PR #21800

该 PR 已关闭，且明确指向 use-after-free 类问题复现和测试补充。  
这类修复对：
- ADBC 接口稳定性
- 多语言绑定安全性
- 垃圾回收语言（尤其 Go）接入场景

非常关键。说明 DuckDB 不仅在 SQL 层迭代，也在认真修复生态接入层的线程安全与生命周期管理问题。

---

#### 3.4 CI 调度与缓存逻辑动态化
- **PR #21799 — Compute CI jobs and save_cache dynamically**  
  链接: duckdb/duckdb PR #21799

该 PR 已关闭，内容包括：
- 动态计算应运行的 CI job
- 动态处理 ccache 保存
- 改善 `merge_group` 等场景的测试逻辑

这属于典型的 **工程效率改进**。对 DuckDB 这样高频提交、高平台矩阵的项目而言，CI 优化会直接提升：
- 合并效率
- 回归发现速度
- 基础设施成本控制

---

#### 3.5 旧版窗口函数绑定重构 PR 关闭，新版本继续推进
- **PR #21562 — Internal #8500: Window Function Binding**  
  链接: duckdb/duckdb PR #21562
- **PR #21818 — Internal #8696: Window Function Binding**  
  链接: duckdb/duckdb PR #21818

可以看出旧 PR 已关闭，而新 PR 接续推进，表明 DuckDB 正在对 **窗口函数绑定逻辑** 做较大规模重构。  
这是今天最值得关注的内核演进信号之一，通常会影响：
- binder 责任边界
- 函数参数处理一致性
- `LEAD/LAG` 等窗口函数的表达方式
- `IGNORE NULLS / RESPECT NULLS` 等语义校验位置

这类重构虽不直接给终端用户带来新语法，但通常会显著改善后续功能扩展与错误定位能力。

---

## 4. 社区热点

### 4.1 历史时区/DST 显示错误
- **Issue #19804 — Incorrect Historical DST Handling in TIMESTAMPTZ Display**  
  链接: duckdb/duckdb Issue #19804

这是今日评论数最高的 Issue（21 条），虽然已关闭，但热度说明用户对 **时区、历史 DST、TIMESTAMPTZ 展示一致性** 极其敏感。  
背后技术诉求：
- 分析型数据库不仅要“算对”，还要“显示对”
- 历史时间语义不能套用当前 offset
- BI、审计、金融和日志回放场景对历史时区尤为敏感

这反映 DuckDB 在国际化时间语义上已进入更精细的 correctness 期望阶段。

---

### 4.2 VARIANT 写 Parquet 触发内部错误
- **Issue #21779 — INTERNAL Error writing VARIANT column to Parquet**  
  链接: duckdb/duckdb Issue #21779

该问题评论 6 条，属于当前非常值得关注的热点。  
背后技术诉求：
- JSON → VARIANT → Parquet 的半结构化数据落盘链路要稳定
- 大表写出接近完成时崩溃，用户成本高
- 用户希望 DuckDB 在现代数据湖格式中可靠支持复杂类型

这说明 DuckDB 用户正在更积极地把它用于 **半结构化数据 ETL 与湖仓导出**。

---

### 4.3 HUGEINT 写 Parquet 精度丢失
- **Issue #21180 — Loss of Precision when Writing HUGEINT Columns to Parquet**  
  链接: duckdb/duckdb Issue #21180  
- **PR #21252 — Fix HUGEINT/UHUGEINT precision loss when writing to Parquet**  
  链接: duckdb/duckdb PR #21252

这是一个典型的“社区痛点已被修复候选 PR 跟进”的案例。  
背后诉求非常明确：
- 超大整数不能 silently cast 为 DOUBLE
- Parquet 互操作不能牺牲精度
- 数据仓库场景要求导入导出严格保真

这类问题虽不一定导致崩溃，但对数仓用户而言属于高严重级别。

---

### 4.4 DISTINCT + LEFT JOIN 空表导致间歇性错误结果
- **Issue #21757 — SELECT DISTINCT in CTE with LEFT JOIN on empty table intermittently returns wrong results**  
  链接: duckdb/duckdb Issue #21757  
- **PR #21804 — Fix intermittent wrong result for DISTINCT CTE with LEFT JOIN on empty table**  
  链接: duckdb/duckdb PR #21804

这是今日最典型的 **查询优化器错误结果** 热点。  
技术诉求指向：
- 动态 join filter pushdown 不能穿透 DISTINCT 语义边界
- 并行执行下的偶发错误最难排查
- 用户希望优化器 aggressive 的同时保持严格正确性

这也是 DuckDB 当前优化器演进最需谨慎的领域之一。

---

## 5. Bug 与稳定性

以下按严重程度排序，并标注是否已有修复迹象。

### P0 / 高危：错误结果或内部崩溃

#### 5.1 错误结果：WindowSelfJoinOptimizer 对 ROWS frame 产生错误结果
- **Issue #21592 — WindowSelfJoinOptimizer produces wrong results for ROWS frames**  
  链接: duckdb/duckdb Issue #21592  
- 状态：OPEN
- 标签：`reproduced`, `incorrect results`

问题描述表明新引入的 `WindowSelfJoinOptimizer` 在显式 `ROWS` frame 场景下错误地将窗口聚合替换为 `GROUP BY + INNER JOIN`。  
这是 **查询正确性** 层面的严重问题，且与 1.5.0 新优化直接相关。  
**目前在给定数据中未看到明确对应 fix PR。**

---

#### 5.2 错误结果：DISTINCT CTE + LEFT JOIN 空表间歇性漏行
- **Issue #21757**  
  链接: duckdb/duckdb Issue #21757  
- **PR #21804**  
  链接: duckdb/duckdb PR #21804

该问题已经有修复 PR，修复方向是禁止 join filter pushdown 继续深入 `LOGICAL_DISTINCT` 子树。  
这是积极信号：**问题已定位到优化器具体规则，且有回归测试补充。**

---

#### 5.3 崩溃：VARIANT 写 Parquet 触发内部断言
- **Issue #21779 — INTERNAL Error writing VARIANT column to Parquet**  
  链接: duckdb/duckdb Issue #21779
- 状态：OPEN

在大型数据写出到约 96% 时崩溃，说明问题可能存在于：
- 向量索引边界
- 复杂类型序列化
- writer 末段 flush / page encode 路径

**未看到直接 fix PR。**  
若属稳定复现，这将影响 DuckDB 在半结构化数据导出场景的可信度。

---

#### 5.4 内部错误：仅 release/reldebug 构建可复现的向量越界
- **Issue #21820 — INTERNAL Error: Attempted to access index 5 within vector of size 5 only in release build**  
  链接: duckdb/duckdb Issue #21820
- 状态：OPEN
- 评论：0

只在 release/reldebug 出现而非 debug，这类问题通常危险性较高，可能涉及：
- UB/未定义行为
- 优化级别相关内存布局差异
- assert 屏蔽后的边界错误

**目前无 fix PR。**

---

### P1 / 高优先级：数据保真与存储兼容性问题

#### 5.5 Parquet 写出 HUGEINT/UHUGEINT 精度丢失
- **Issue #21180**  
  链接: duckdb/duckdb Issue #21180  
- **PR #21252**  
  链接: duckdb/duckdb PR #21252

该问题会导致超大整数经 Parquet 写出后变为 `DOUBLE` 并发生 silent precision loss。  
严重性高于一般兼容性问题，因为会造成 **不可见的数据损坏**。  
好消息是已有较明确修复 PR 在审。

---

#### 5.6 CREATE SEQUENCE 的 MINVALUE 被忽略
- **Issue #21813 — CREATE SEQUENCE minvalue parameter ignored**  
  链接: duckdb/duckdb Issue #21813  
- **PR #21821 — Fix CREATE SEQUENCE MINVALUE parsing for option order**  
  链接: duckdb/duckdb PR #21821

这是典型的 SQL 语法/元信息一致性缺陷：当 `INCREMENT` 出现在某些顺序时，会覆盖显式 `MINVALUE/MAXVALUE`。  
已有对应 PR 且根因明确，预计修复落地概率较高。

---

### P2 / 中优先级：兼容性、绑定和 parser 细节问题

#### 5.7 Java 1.5.0 存储模式下 typed macro 参数报错
- **Issue #21753 — java: 1.5.0 Creating macros with type parameters causes an error**  
  链接: duckdb/duckdb Issue #21753

问题表明 `duckdb_databases()` 中的 `storage_version` 与实际能力判断可能不一致。  
这影响 Java 用户对 macro 特性的使用，属于 **语言绑定 + 存储版本元数据兼容性** 问题。  
暂无对应 fix PR。

---

#### 5.8 Parser 未消除 `NOT(IS NULL)` / `NOT(IS NOT NULL)`
- **Issue #21809**  
  链接: duckdb/duckdb Issue #21809

这是 parser/rewriter 层的规范化优化建议，更多偏一致性与可维护性，不属于高危故障。  
短期看更像小型质量改进项。

---

### 已关闭问题

#### 5.9 Windows + PyInstaller + motherduck 扩展崩溃
- **Issue #21602**  
  链接: duckdb/duckdb Issue #21602

已关闭，说明相关访问冲突问题已有处理进展。  
这对 Windows 打包分发场景是正面信号。

#### 5.10 markdown output mode / describe 问题
- **Issue #21579**  
  链接: duckdb/duckdb Issue #21579

已标记 `fixed on nightly` 并关闭，属于 CLI/输出格式层面的可用性修复。

---

## 6. 功能请求与路线图信号

### 6.1 DML 作为 CTE body 的支持值得重点关注
- **PR #21634 — Add support for DML statements (INSERT/UPDATE/DELETE) as CTE bodies**  
  链接: duckdb/duckdb PR #21634

这是今天最强的 SQL 能力增强信号之一。若合入，将带来：
- 更接近 PostgreSQL 等数据库的 `WITH` 用法
- 支持 `INSERT/UPDATE/DELETE ... RETURNING` 嵌入复杂语句流
- 更方便构建单语句事务逻辑与 ETL 管道

虽然当前状态是 `Changes Requested`，但从功能价值看，**进入下一版本候选的可能性较高**。

---

### 6.2 窗口函数绑定重构是内核路线图级工作
- **PR #21818 — Window Function Binding**  
  链接: duckdb/duckdb PR #21818

这不是单点功能，而是后续窗口函数扩展、语义校验统一、binder 清理的基础性工程。  
该类重构通常预示：
- 未来更容易支持复杂窗口语义
- 减少 parser/binder/optimizer 的职责耦合
- 为新函数与 SQL 兼容增强铺路

---

### 6.3 TableFilters 与 Expressions 统一，可能影响优化器长期演进
- **PR #21762 — Unify TableFilters with Expressions**  
  链接: duckdb/duckdb PR #21762

这是很强的架构信号。若推进成功，可能带来：
- 谓词下推结构统一
- 减少双重表达体系维护成本
- 更容易做规则复用、优化器重写与序列化一致性

这类改动短期不一定直接可见，但长期会影响执行引擎与优化器可维护性。

---

### 6.4 更强的 projection pullup 说明优化器仍在扩张能力边界
- **PR #21776 — Pull up projections with non-colref expressions**  
  链接: duckdb/duckdb PR #21776

该 PR 将 projection pullup 从“纯列引用”扩展到更复杂表达式。  
这意味着 DuckDB 仍在推进：
- 更激进的计划重写
- 更广的规则适用面
- 复杂查询性能优化

但结合今日多个错误结果问题，也说明这类优化需要更强回归测试护栏。

---

### 6.5 系统表元信息继续增强
- **PR #21794 — Expose column tags via duckdb_columns()**  
  链接: duckdb/duckdb PR #21794

这表明 DuckDB 在逐步完善 catalog introspection 能力。  
对数据治理、元数据同步、外部工具集成很有帮助，较可能在下个小版本进入用户可见特性。

---

## 7. 用户反馈摘要

结合今日 Issues，可提炼出几类真实用户痛点：

### 7.1 用户已将 DuckDB 用于生产级数据交换，而不仅是本地分析
- Parquet 写出 HUGEINT 精度丢失
- VARIANT 写 Parquet 崩溃
- CSV ingest fatal error  
相关链接：
- duckdb/duckdb Issue #21180
- duckdb/duckdb Issue #21779
- duckdb/duckdb Issue #16792

这说明用户不再只把 DuckDB 当“轻量 SQL 工具”，而是当作 **数据处理引擎和交换中枢**。  
他们最关心的是：
- 落盘正确性
- 大数据量稳定性
- 格式兼容保真

---

### 7.2 优化器引入的新能力正在被真实复杂查询迅速检验
- `WindowSelfJoinOptimizer` 错误结果
- DISTINCT CTE + LEFT JOIN 错误结果  
相关链接：
- duckdb/duckdb Issue #21592
- duckdb/duckdb Issue #21757
- duckdb/duckdb PR #21804

用户不仅在跑简单 SELECT，而是在执行包含：
- CTE
- DISTINCT
- LEFT JOIN
- 窗口函数
- 并行执行

的复杂分析查询。  
这要求 DuckDB 在性能优化之外，进一步加强 **语义边界测试**。

---

### 7.3 多语言和打包场景需求持续增长
- Java typed macro 参数问题
- ADBC data race
- PyInstaller + Windows + extension 崩溃  
相关链接：
- duckdb/duckdb Issue #21753
- duckdb/duckdb PR #21800
- duckdb/duckdb Issue #21602

这表明 DuckDB 生态正在扩展到：
- JVM 应用
- Go / ADBC 接入
- Windows 桌面或打包程序

用户希望 DuckDB 的嵌入式优势能在不同语言/runtime 下保持一致稳定。

---

### 7.4 时间语义和 SQL 兼容细节的期望正在提高
- 历史 DST 处理
- CREATE SEQUENCE MINVALUE 解析顺序问题  
相关链接：
- duckdb/duckdb Issue #19804
- duckdb/duckdb Issue #21813
- duckdb/duckdb PR #21821

这类问题表明用户已开始检验 DuckDB 在 **细粒度 SQL 行为和时间语义** 上是否达到成熟数据库水准。

---

## 8. 待处理积压

### 8.1 长期未解决的 CSV ingest fatal error
- **Issue #16792 — Fatal error while ingesting CSV file**  
  链接: duckdb/duckdb Issue #16792

该问题创建于 2025-03-23，当前仍为 OPEN，且摘要中提到用户无法提供原始 CSV。  
虽然复现材料不足，但“导入时 fatal error”属于高影响问题，建议维护者：
- 请求最小可复现数据或 anonymized 样本
- 根据堆栈和 parser 状态尝试补做防御性修复
- 至少确认是否已被后续版本隐式修复

---

### 8.2 HUGEINT Parquet 精度修复 PR 仍未落地
- **Issue #21180**  
  链接: duckdb/duckdb Issue #21180  
- **PR #21252**  
  链接: duckdb/duckdb PR #21252

这是数据正确性问题，且已有修复方案。  
建议优先审阅并尽快合并，否则继续影响对 Parquet 保真度有要求的用户。

---

### 8.3 DML as CTE 功能价值高，但仍卡在 review
- **PR #21634**  
  链接: duckdb/duckdb PR #21634

该功能对 SQL 兼容性提升明显，若 review 周期过长，容易形成高价值功能积压。  
建议明确：
- side effect 执行语义
- 未引用 CTE 是否始终执行
- RETURNING 与优化器交互边界

---

### 8.4 seq.currval 语义修正仍在 review
- **PR #21796 — seq.currval() can only be called after seq.nextval()**  
  链接: duckdb/duckdb PR #21796

这属于标准 SQL/序列行为一致性问题，且涉及数据库重启后的状态恢复。  
建议尽早定稿，以避免 sequence 行为继续偏离用户预期。

---

## 总结判断

今天 DuckDB 的项目状态呈现出典型的 **“高速迭代 + 内核收敛”** 特征：

- **积极面**：窗口函数绑定重构、ATTACH 语法增强、catalog introspection 补齐、CI 持续优化，说明项目仍在向更成熟的分析数据库平台演进。
- **风险面**：错误结果类问题仍然值得高度警惕，尤其集中在新优化器和复杂查询组合上；Parquet 导出中的复杂类型与大整数保真问题，也直接影响用户信任。
- **短期建议关注方向**：优先处理错误结果、内部断言和 Parquet 数据保真问题，其次再推进优化器能力扩张与 SQL 新特性。

如需，我还可以把这份日报进一步整理成：
1. **面向管理层的 1 页摘要版**，或  
2. **面向内核开发者的风险清单版（按模块分类：optimizer / storage / parquet / binder / parser / client APIs）**。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持**高活跃度**：Issues 更新 7 条、PR 更新 77 条，其中 45 条已合并或关闭，说明研发与回溯修复节奏都比较快。  
从内容看，今天的工作重心非常明确，集中在 **Lake Persistent Index / 云原生主键表路径优化**、**shared-data 模式一致性修复**、以及 **部分更新/Schema 变更相关稳定性问题**。  
同时，社区也暴露出几类值得警惕的新问题：**可导致 BE 崩溃的 SIGSEGV**、**Follower FE 不可查询副本问题**、**HTTP 管理接口权限缺失的安全风险**。  
功能需求方面，**Apache Iceberg V3 支持**持续受到关注，说明 StarRocks 在湖仓兼容层面的路线图仍是用户关注重点。  
整体来看，项目健康度良好：合并效率高，但当前主线仍需优先压制 shared-data / persistent index / 安全接口三类风险。

---

## 3. 项目进展

### 3.1 存储引擎与云原生主键表优化

#### 1) 跳过 persistent index rebuild 中已覆盖行，减少无效 IO
- PR: #71082（已关闭/已合入）
- 链接: StarRocks/starrocks PR #71082

该改动针对 `persistent index rebuild in publish` 场景，避免对已经被 SSTable 覆盖的数据段继续全量读取再丢弃。  
PR 描述中给出的真实案例显示，优化前会读取大量实际上无需参与重建的数据，属于典型的**远端存储 IO 浪费**。这项改动直接推进了：
- 云原生 PK 表 publish 路径性能优化
- 远端对象存储访问成本下降
- 大规模 shared-data 场景下的尾延迟收敛

这是今天最有代表性的存储层性能推进之一。

---

#### 2) 并行打开 SSTable，缩短 `LakePersistentIndex::init()` 初始化耗时
- PR: #71145（已关闭/已合入）
- 链接: StarRocks/starrocks PR #71145

该 PR 将 `LakePersistentIndex::init()` 中原先串行的 SSTable 打开过程改为并行执行。  
根据 PR 摘要，77 个 SSTable、总计 5GB 的场景下，串行打开占据了约 1.2 秒，且主要为远端 IO。并行化后，预期收益包括：
- 缩短 publish / load 过程中的 persistent index 初始化时间
- 改善云原生主键表在对象存储上的启动与恢复效率
- 为 shared-data 模式下的大表、高 SSTable 数量场景提供更好扩展性

相关 backport 也在同步推进：
- #71278（OPEN，backport）
- #71279（CLOSED，自动回移冲突版本）
- 链接: StarRocks/starrocks PR #71278 / #71279

---

#### 3) 为 `LakePersistentIndex::init()` 增加 trace instrumentation
- PR: #71143（已关闭）
- 链接: StarRocks/starrocks PR #71143

该改动补足了 `LakePersistentIndex::init()` 阶段的可观测性，让慢 publish 链路可以进一步拆解到 SST 加载阶段。  
这意味着 StarRocks 团队不仅在做性能优化，也在做**性能诊断工具链完善**，对于线上问题定位很关键。  
相关后续回移 PR：
- #71281（CLOSED）
- 链接: StarRocks/starrocks PR #71281

---

#### 4) 回移补丁修正 rebuild 边界条件错误
- PR: #71285（已关闭）
- 链接: StarRocks/starrocks PR #71285

该 PR 是对 #71082 的替代 backport，额外包含了 #71284 所修复的边界 bug：  
当 `low_rowid == UINT32_MAX` 时，表示整个 segment 都已被 SSTable 覆盖，之前逻辑没有正确设置空 rowid range。  
这说明 persistent index rebuild 优化已进入**性能 + 正确性协同打磨阶段**，维护者对回移质量比较谨慎。

---

### 3.2 查询可用性与元数据一致性修复

#### 5) 修复 shared-data 模式下 Follower FE “no queryable replica”
- PR: #71263（OPEN）
- 链接: StarRocks/starrocks PR #71263

这是今天最值得关注的可用性修复之一。  
问题根因是：Follower FE 在将 DDL 转发给 Leader 后，只等待 FE journal replay，而没有等待 StarMgr journal replay，导致本地 StarMgr 尚未感知新建 lake table shard，从而查询时报 `no queryable replica`。  

该修复涉及：
- FE 与 StarMgr 的元数据一致性
- shared-data 模式建表后查询可见性
- DDL 完成语义与用户感知的一致性

如果此 PR 合入，将明显提升 shared-data 架构下的稳定性和“DDL 后立即查询”体验。

---

### 3.3 正确性与崩溃修复推进

#### 6) 修复 ThreadPool 在线程创建失败时的 use-after-free
- PR: #71276（OPEN）
- 链接: StarRocks/starrocks PR #71276

该问题发生在 `ThreadPool::do_submit`，当 `min_threads=0` 且 worker 全部退出后，新任务提交时若创建线程失败，可能触发 use-after-free。  
这是一个典型的底层并发内存安全问题，影响范围可能跨越多个执行路径，优先级较高。

---

#### 7) 修复 partial tablet schema 中 `num_short_key_columns` 不匹配
- PR: #71274（OPEN）
- 链接: StarRocks/starrocks PR #71274

该修复针对主键表列模式 partial update 场景，解决 `SeekTuple::short_key_encode` 中 `DCHECK` 崩溃问题。  
适用场景包含 **separate sort keys**，说明其属于相对高级但真实存在的生产配置问题。  
这类 PR 持续出现，表明 StarRocks 正在不断补齐 **PK 表 + partial update + sort key** 的复杂边界场景。

---

#### 8) 修复 UpdateTabletSchemaTask 签名冲突
- PR: #71242（OPEN）
- 链接: StarRocks/starrocks PR #71242

当同一表/分区在短时间内执行多个 ALTER TABLE 作业时，`UpdateTabletSchemaTask` 可能因 `tablets.hashCode()` 产生相同 signature，导致任务队列冲突。  
这属于**DDL 并发与任务调度正确性**问题，可能引发 alter job 执行异常或行为错乱，建议重点关注。

---

#### 9) 修复 3.5 分支中 PK tablet corruption
- PR: #69652（OPEN）
- 链接: StarRocks/starrocks PR #69652

该 PR 针对 3.5 分支，修复 column-mode partial update 导致 Primary Key tablet 损坏的问题。  
根因是 `PersistentIndex::erase()` 中 `size_t` 下溢，引发：
- `std::length_error: vector::_M_range_insert`
- BE 崩溃
- 且所有副本可能同时受影响

这属于**高严重级别的数据正确性/可用性问题**，虽然是老 PR，但今天仍处于活跃状态，说明修复与回移仍在推进。

---

## 4. 社区热点

### 热点 1：Apache Iceberg V3 Table Specification 支持呼声持续
- Issue: #60956
- 链接: StarRocks/starrocks Issue #60956

这是今天反应数最高的 Issue（👍 14），尽管并非新建，但仍在更新。  
其背后技术诉求非常明确：
- 其他湖仓引擎（如 Spark、Trino）正在逐步采用 Iceberg V3
- StarRocks 若不能尽快支持，将在 lakehouse 互操作性上面临落差
- 用户希望在 StarRocks 中无缝读取/协同更高版本 Iceberg 表

这是明显的**路线图信号**：湖格式兼容性，尤其是 Iceberg 新规范支持，仍是企业用户关心的中长期能力。

---

### 热点 2：JDBC Catalog 访问外部 Iceberg 数据时出现错误/告警日志
- Issue: #71277
- 链接: StarRocks/starrocks Issue #71277

用户反馈功能“能用”，但查询过程中会打印 error/warning，不确定是否影响性能。  
这类问题虽然未必导致功能失败，但对生产用户来说会造成：
- 运维告警噪音
- 对稳定性的信任下降
- 性能退化与异常行为难以区分

这体现出社区关注点已从“能否跑通”转向“能否稳定、干净、可运维地运行”。

---

### 热点 3：Arrow StringView / BinaryView 支持请求
- Issue: #71280
- 链接: StarRocks/starrocks Issue #71280

该需求针对 Arrow 到 StarRocks 转换器，要求支持 Arrow 新增的 `Utf8View/StringView` 与 `BinaryView` 类型。  
背后技术趋势是：
- Arrow 正在演进更高效的列式内存格式
- StarRocks 若想保持与现代数据传输/向量化生态兼容，需要及时补齐类型系统映射
- 这对连接器、导入链路、UDF/向量化交换都有潜在意义

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 安全风险

#### 1) `/api/_stop_be` 接口疑似无权限校验，可直接停止 BE
- Issue: #71249
- 链接: StarRocks/starrocks Issue #71249
- 是否已有 fix PR: 暂无明确对应 PR

如果报告属实，这属于明显的**运维接口安全缺陷**。未经权限校验即可关闭 BE 进程，会直接影响：
- 集群可用性
- 多租户环境安全
- 暴露在内网/边界网络时的攻击面

建议维护者尽快确认是否需要：
- 默认禁用
- 增加鉴权
- 限制本地访问
- 文档中补充安全告警

---

### P0 / 崩溃问题

#### 2) shared-data 模式下 `publish_version` 过程中 SIGSEGV
- Issue: #71283
- 链接: StarRocks/starrocks Issue #71283
- 是否已有 fix PR: 暂无

问题表现为 `ColumnReader::~ColumnReader()` 调用 `protobuf::Message::SpaceUsedLong()` 时发生 SIGSEGV，场景与 lake tablet metadata caching / `publish_version` 相关。  
这是典型的生产级崩溃问题，且出现于 shared-data 模式关键写入发布链路，建议高优先级排查。

---

### P1 / 查询可用性

#### 3) Follower FE 出现 “no queryable replica”
- PR: #71263（修复中）
- 链接: StarRocks/starrocks PR #71263

虽然该问题对应的是 PR 而非当天新 Issue，但从影响面看优先级很高。  
它影响 shared-data 模式下 DDL 后的可查询性，属于典型的控制面/元数据一致性故障。

---

### P1 / 数据正确性与崩溃

#### 4) PK tablet corruption in column-mode partial update
- Issue/PR: #69652
- 链接: StarRocks/starrocks PR #69652
- 是否已有 fix PR: 有，修复 PR 已在推进

该问题会导致主键表损坏与 BE 崩溃，且所有副本可能一起受影响，是较高风险的问题。  
虽然不是当天新报，但今天依然值得列入重点稳定性关注项。

---

### P1 / 依赖安全

#### 5) ZooKeeper 3.8.4 存在两个高危 CVE
- Issue: #71266
- 链接: StarRocks/starrocks Issue #71266
- 是否已有 fix PR: 暂无

涉及：
- CVE-2026-24281：reverse DNS 导致服务器/客户端冒充
- CVE-2026-24308：信息泄露

这是供应链安全问题，建议关注：
- StarRocks 是否直接暴露受影响依赖
- 受影响模块是否在默认部署路径中启用
- 是否需要升级依赖或发布安全公告

---

### P2 / 运维与兼容性

#### 6) JDBC Catalog 查询外部 Iceberg 数据时产生日志错误与告警
- Issue: #71277
- 链接: StarRocks/starrocks Issue #71277
- 是否已有 fix PR: 暂无

目前功能看起来可用，但这类“带错运行”问题会对生产排障造成较大干扰。

---

### P2 / 历史问题关闭

#### 7) Async MV 的 IVM initial backfill 不遵守 `partition_refresh_number`
- Issue: #69558（已关闭）
- 链接: StarRocks/starrocks Issue #69558

该 Issue 已关闭，说明 4.1 分支在 Async MV/IVM 初始回填分区控制方面已有处理进展。  
这对大规模 MV 构建、控制初次刷新压力具有积极意义。

---

## 6. 功能请求与路线图信号

### 1) Apache Iceberg V3 支持
- Issue: #60956
- 链接: StarRocks/starrocks Issue #60956

这是当前最明确的外部生态兼容需求。  
从用户热度与行业趋势看，**Iceberg V3 支持进入后续版本规划的概率较高**。尤其当 Spark/Trino 侧逐步采用后，StarRocks 若继续强化湖查询能力，基本无法长期回避该支持。

---

### 2) Arrow StringView / BinaryView 支持
- Issue: #71280
- 链接: StarRocks/starrocks Issue #71280

这是一个更偏底层类型兼容与高性能数据交换的需求。  
结合今天已有一个相关增强 PR 已关闭：
- #71268 `ColumnVisitorMutableAdapter and ColumnVisitorAdapter support AdaptiveNullableColumn`
- 链接: StarRocks/starrocks PR #71268

可以看出团队近期确实在持续打磨**列式类型系统、Column 抽象与向量化处理链路**。因此该需求虽然还未见直接 PR，但与当前代码演进方向一致，**有一定纳入概率**。

---

### 3) 文档/升级路线提醒：4.1 降级限制
- PR: #71170（OPEN）
- 链接: StarRocks/starrocks PR #71170

虽然不是功能请求，但它释放出非常重要的路线图信号：  
**4.1 RC 部署不能降级到 4.0.6 以下**，说明 4.1 已包含实质性元数据或行为变更。  
这意味着后续 4.1 正式推广时，维护团队需要更强调：
- 升级前备份
- 回滚策略验证
- 跨版本兼容边界

---

## 7. 用户反馈摘要

基于今日 Issues/PR，可归纳出几类真实用户痛点：

### 1) 用户已在真实生产中使用外部湖格式与 Catalog
- 相关链接: #71277, #60956  
- StarRocks/starrocks Issue #71277  
- StarRocks/starrocks Issue #60956

这说明 StarRocks 不只是内部存储引擎被使用，**外表、湖仓、JDBC Catalog、Iceberg 互操作**已经是用户日常工作负载的重要组成部分。  
用户关注点从“能否接入”转向：
- 新规范能否支持
- 查询时是否有异常日志
- 与其他引擎版本是否对齐

---

### 2) shared-data 模式进入更复杂的生产验证阶段
- 相关链接: #71283, #71263  
- StarRocks/starrocks Issue #71283  
- StarRocks/starrocks PR #71263

今天多个问题都集中在 shared-data / lake tablet / publish_version / StarMgr 相关路径。  
这反映出用户已经在更大规模、更复杂的一致性与发布链路上使用 StarRocks，团队也正在补足该模式下的稳定性边界。

---

### 3) 用户对“安全默认值”更敏感
- 相关链接: #71249, #71266  
- StarRocks/starrocks Issue #71249  
- StarRocks/starrocks Issue #71266

无论是未经鉴权的停止接口，还是第三方依赖 CVE，用户都在主动审视系统安全面。  
这类反馈说明 StarRocks 进入了一个更成熟的采用阶段：用户不再只看性能，也开始系统性审视**安全、合规、运维可控性**。

---

## 8. 待处理积压

### 1) Apache Iceberg V3 支持需求长期存在，值得维护者给出路线回应
- Issue: #60956
- 链接: StarRocks/starrocks Issue #60956

该 Issue 创建于 2025-07-15，至今仍在开放状态，且拥有当前列表中最高点赞数（14）。  
建议维护者：
- 明确是否计划支持
- 标注目标版本或依赖前置条件
- 说明只读支持、写入支持或部分特性支持的边界

---

### 2) 3.5 分支 PK tablet corruption 修复仍应加速推进
- PR: #69652
- 链接: StarRocks/starrocks PR #69652

这是影响数据正确性与稳定性的关键修复，虽然已有进展，但由于其严重性高，仍应优先推动合并/回移。

---

### 3) 4.1 降级限制文档提醒需要尽快落地
- PR: #71170
- 链接: StarRocks/starrocks PR #71170

该文档 PR 虽非代码修复，但对避免用户误操作非常重要。  
如果 4.1 RC 版本已被用户试用，降级限制说明越晚发布，潜在运维风险越高。

---

## 总结判断

今天 StarRocks 的工程活动密度很高，核心推进集中在 **云原生主键表 persistent index 性能与可观测性增强**，这是明显的主线投入方向。  
与此同时，社区问题暴露出 shared-data 模式在**元数据一致性、publish 稳定性、安全边界**上仍有若干高优先级缺口。  
从路线图信号看，**Iceberg V3、Arrow 新类型支持、外部目录与湖格式兼容性**是下一阶段最值得关注的生态能力方向。  
项目整体健康度偏积极，但建议维护者短期内优先处理：**/api/_stop_be 安全问题、SIGSEGV 崩溃问题、Follower FE 查询可用性修复**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：Issues 有 4 条更新，PR 有 42 条更新，其中 33 条仍在待合并状态，说明社区开发节奏持续但审阅/合并压力也在累积。  
今天没有新版本发布，工作重点主要集中在 **核心元数据能力、Spark/Flink/Kafka Connect 生态支持、REST Catalog 能力增强，以及若干文档和稳定性修复**。  
从内容看，项目当前一方面在推进中长期能力建设，例如 **Materialized View 规范、v4 TrackedFile、列级更新元数据、列恢复（undelete）**；另一方面也在快速响应具体正确性和稳定性问题，例如 **StrictMetricsEvaluator 谓词裁剪、Spark cache/time-travel 错误、Kafka Connect 提交失败后静默失效**。  
整体判断：**项目健康度良好、活跃度高，但存在一定 stale PR 积压，说明维护者需要在路线型大改和短期稳定性修复之间继续平衡。**

---

## 3. 项目进展

> 注：今日无新 Release，因此重点关注“已关闭/已合并”与“值得关注的推进性 PR”。

### 3.1 今日关闭的重要 PR

#### 1) PoC: 引入列更新元数据
- PR: [#15445](https://github.com/apache/iceberg/pull/15445)
- 状态: CLOSED
- 标签: `API`, `core`, `stale`

该 PR 提出了 **column update metadata** 的概念，尝试把列级变更历史写入表元数据和 manifest entry。  
虽然本次未合并并以关闭结束，但它释放出一个很强的路线图信号：**Iceberg 正在探索更细粒度的 schema/column 演化追踪能力**。这类能力对于审计、回溯、复杂 schema 演化以及未来更强的列恢复/列 lineage 支持非常关键。

**影响判断：**
- 属于中长期元数据演进方向；
- 暂未进入主线，但后续可能拆分成更小 PR 重启。

---

#### 2) Core: 支持读取 Avro local-timestamp-* 逻辑类型
- PR: [#15437](https://github.com/apache/iceberg/pull/15437)
- 状态: CLOSED
- 标签: `core`, `stale`

该 PR 计划支持读取 Avro 的 `local-timestamp-millis/micros/nanos` 逻辑类型，以提升 Iceberg 对 **外部系统写入 Avro 数据** 的兼容性。  
虽然今天被关闭，但其技术方向很明确：**增强 Iceberg 与非 Iceberg 生态产生数据的互操作性**，尤其是当上游使用较新版本 Avro 时。

**影响判断：**
- 直接关系到数据导入兼容性；
- 对多系统混合湖仓场景很重要；
- 建议维护者后续重新评估，因为这类“读兼容”需求通常用户面广。

---

#### 3) Flink: 增加 CDC 流式读取支持
- PR: [#15282](https://github.com/apache/iceberg/pull/15282)
- 状态: CLOSED
- 标签: `flink`, `stale`

该 PR 为 Flink Source 增加了 **CDC / changelog streaming read** 支持，目标是产出带 `RowKind` 的变更流（INSERT/DELETE/UPDATE_BEFORE/UPDATE_AFTER）。  
这是一个非常关键的引擎能力增强，意味着 Iceberg 不只是作为 append-only 分析表，也在持续向 **流批一体与增量消费** 场景靠近。遗憾的是该 PR 今天被 stale 关闭。

**影响判断：**
- 对 Flink 用户价值高；
- 若未来重启，将显著增强 Iceberg 在 CDC 和实时数仓链路中的竞争力。

---

#### 4) Kafka Connect: 默认值支持
- PR: [#15209](https://github.com/apache/iceberg/pull/15209)
- 状态: CLOSED
- 标签: `KAFKACONNECT`, `stale`

该 PR 为 Kafka Connect 中的 **schema 默认值提取与应用** 提供支持，覆盖自动建表和 schema evolution。  
该方向与今日新报的 Kafka Connect 稳定性问题一起看，说明 **Kafka Connect 正成为 Iceberg 社区一个真实且增长中的使用场景**。

**影响判断：**
- 能减轻 schema 演化中的脏数据/缺省值处理成本；
- 关闭意味着连接器能力补齐仍需后续投入。

---

### 3.2 今日仍在推进、值得重点关注的 PR

#### 5) StrictMetricsEvaluator: 为 `notStartsWith` 增加 bounds-based 剪枝
- PR: [#15883](https://github.com/apache/iceberg/pull/15883)
- 链接: https://github.com/apache/iceberg/pull/15883

这是对今日新 Issue 的直接响应型修复。当前 `StrictMetricsEvaluator.notStartsWith` 总是返回 `ROWS_MIGHT_NOT_MATCH`，导致无法使用文件级列边界做更强裁剪。  
PR 的目标是让 Iceberg 在某些前缀过滤场景下 **更准确地消除 residual predicate**，提升扫描规划效率。

**价值：**
- 属于典型的查询规划/文件裁剪优化；
- 对大表扫描延迟和 IO 成本有直接帮助；
- 从 Issue 到 PR 的响应速度快，体现维护效率较高。

---

#### 6) SparkTable equals/hashCode 修复时间旅行与 branch 查询缓存错误
- PR: [#15840](https://github.com/apache/iceberg/pull/15840)
- 链接: https://github.com/apache/iceberg/pull/15840

该 PR 修复了 Spark 侧 `SparkTable.equals()/hashCode()` 只比较表名的问题。  
此前对于 `branch` 或 `snapshotId` 不同但表名相同的读取，Spark 缓存会误判为同一对象，导致返回 **过期数据或错误结果**。这属于 **查询正确性问题**，优先级很高。

**价值：**
- 修复 time-travel / branch 读场景的 correctness；
- 对使用多分支开发、审计快照、回溯分析的用户尤其关键；
- 这类问题一旦确认，通常会推动较快合并。

---

#### 7) REST scan planning 轮询超时可配置
- PR: [#15863](https://github.com/apache/iceberg/pull/15863)
- 链接: https://github.com/apache/iceberg/pull/15863

为 `RESTTableScan` 增加 `rest-scan-planning.poll-timeout-ms` 配置，控制异步 scan planning 轮询等待时间。  
这项变更说明 REST Catalog / Remote Planning 场景下，已有用户遇到 **高延迟规划、超时控制不足** 的实际问题。

**价值：**
- 增强远程规划场景稳定性和可运维性；
- 对云原生 catalog、服务化元数据访问尤为关键。

---

#### 8) MergingSnapshotProducer 自动 flush manifest
- PR: [#15590](https://github.com/apache/iceberg/pull/15590)
- 链接: https://github.com/apache/iceberg/pull/15590

该 PR 通过 `DataFileAccumulator` 在累积到阈值后自动将 data files 写入 manifest，从而降低一次性 bulk add 大量文件时的峰值内存和 IO 冲击。  
这是明显的 **存储与元数据写路径优化**，对超大批量导入场景价值很高。

**价值：**
- 缓解 50 万+ data file bulk operation 的 OOM/峰值抖动；
- 有助于提升大规模写入任务稳定性。

---

#### 9) v4 `TrackedFile` 结构实现
- PR: [#15854](https://github.com/apache/iceberg/pull/15854)
- 链接: https://github.com/apache/iceberg/pull/15854

该 PR 实现了 v4 `TrackedFile` 及其 tracking / deletion vector / manifest info 结构，是 single-file-commit 设计文档方向的组成部分。  
这表明 Iceberg 在 **新一代表格式能力和提交路径演进** 上仍在稳步推进。

---

#### 10) 文档补充：Spark migrate 对 bucketed source table 会失败
- PR: [#15874](https://github.com/apache/iceberg/pull/15874)
- 链接: https://github.com/apache/iceberg/pull/15874

这是典型的 **用户易踩坑文档修复**。虽然不是代码改动，但对减少错误迁移尝试、降低支持成本很有帮助。

---

## 4. 社区热点

> 由于给定数据里 PR 评论数均显示为 `undefined`，无法严格按评论数排序。以下按“技术影响力 + 今日更新信号 + 现实使用场景”综合评估。

### 热点 1：Kafka Connect 提交失败后进入静默损坏状态
- Issue: [#15878](https://github.com/apache/iceberg/issues/15878)

**现象：**
在 AWS Glue Catalog 并发更新触发 `CommitFailedException` 后，Kafka Connect 连接器进入“silent broken state”：**没有继续写数据，也没有向外暴露明确错误**。

**背后技术诉求：**
- 连接器需要更强的失败恢复、重试与错误传播机制；
- 元数据层并发冲突不能演变成“静默不写”的不可观测状态；
- 对流式写入系统来说，可观测性和自愈比单次 commit 成败更重要。

**意义：**
这类问题影响生产数据链路可靠性，优先级高。

---

### 热点 2：StrictMetricsEvaluator 对 `notStartsWith` 缺乏列边界裁剪
- Issue: [#15882](https://github.com/apache/iceberg/issues/15882)
- 对应 PR: [#15883](https://github.com/apache/iceberg/pull/15883)

**现象：**
`StrictMetricsEvaluator.notStartsWith` 当前不利用文件级列边界，导致保守返回，影响谓词裁剪。

**背后技术诉求：**
- 用户希望 Iceberg 在 metadata pruning 上更“聪明”；
- 大表扫描中，细粒度统计信息的利用率直接影响成本和延迟；
- 这也是分析型存储引擎竞争力的重要组成部分。

**意义：**
这是典型的“ correctness-safe 前提下提升 pruning 能力”的优化点，且已迅速有修复 PR，进展积极。

---

### 热点 3：Materialized View Spec 仍在推进
- PR: [#11041](https://github.com/apache/iceberg/pull/11041)

**现象：**
该规范 PR 创建已久，今日仍有更新，表明物化视图规范仍是社区长期关注主题。

**背后技术诉求：**
- 希望 Iceberg 不仅是表格式，也成为更完整的湖仓抽象层；
- 对上层查询引擎而言，标准化物化视图元数据有助于跨引擎互通与自动优化。

**意义：**
这是高战略价值议题，但推进周期长，仍需更多设计共识。

---

### 热点 4：列恢复（undelete column）能力
- PR: [#15084](https://github.com/apache/iceberg/pull/15084)

**现象：**
该 PR 允许从历史 schema 中恢复已删除列，并提供 Spark procedure。

**背后技术诉求：**
- 用户真实存在误删列、回滚 schema 的需求；
- 反映 Iceberg schema evolution 正从“增删改名”向“恢复、审计、历史重建”扩展。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1 严重：Kafka Connect 在 CommitFailedException 后静默失效
- Issue: [#15878](https://github.com/apache/iceberg/issues/15878)
- 状态: OPEN
- 是否已有 fix PR: **暂无明确对应 PR**

**风险：**
- 持续丢写或停写；
- 无错误 surfaced，运维难以及时发现；
- 发生于 Glue 并发更新场景，具有现实生产代表性。

**建议关注：**
- 增加 commit failure 分类处理；
- 强制任务失败而非静默停摆；
- 增加 metrics / health status / DLQ 或 fatal error reporting。

---

### P1 高优先级：Spark time-travel / branch 查询缓存错误
- PR: [#15840](https://github.com/apache/iceberg/pull/15840)
- 状态: OPEN
- 是否已有 fix PR: **有，当前 PR 本身即修复**

**风险：**
- 返回错误查询结果；
- 影响 branch、snapshotId 场景的查询正确性；
- 属于 correctness bug，优先级高于纯性能问题。

---

### P2 中高：`StrictMetricsEvaluator.notStartsWith` 未利用 bounds
- Issue: [#15882](https://github.com/apache/iceberg/issues/15882)
- 对应 PR: [#15883](https://github.com/apache/iceberg/pull/15883)

**风险：**
- 主要影响扫描裁剪效果与性能；
- 一般不导致错误结果，但会降低优化器效率。

**判断：**
- 已有修复，处于积极处理状态。

---

### P3 中等：构造与更新 PartitionSpec 时对冗余 transform 校验不一致
- Issue: [#13886](https://github.com/apache/iceberg/issues/13886)
- 状态: CLOSED
- 标签: `improvement`, `stale`

**问题：**
构造 `PartitionSpec` 与 `UpdatePartitionSpec` 对同源列冗余 transform 的检查逻辑不一致。  
该 Issue 今天关闭，但从设计角度看，它暴露了 **元数据 API 行为一致性** 的问题。

**风险：**
- 更偏开发体验和 API 一致性；
- 对最终用户影响低于 correctness/稳定性问题。

---

## 6. 功能请求与路线图信号

### 1) 增加 `write.parquet.page-version` 表属性
- Issue: [#15677](https://github.com/apache/iceberg/issues/15677)

**需求概述：**
希望通过表属性控制 Parquet DataPage 版本（V1/V2）。

**技术意义：**
- 给用户更强的写路径兼容性控制；
- 一些查询引擎、旧工具链或特定压缩/编码组合对 page version 敏感；
- 这是典型的“表格式暴露底层 writer 关键参数”需求。

**纳入下一版本概率：中等偏高**
- 需求边界清晰；
- 与现有 `write.parquet.*` 属性体系一致；
- 实现代价相对可控。

---

### 2) REST staged tables 支持 credential refresh
- PR: [#15280](https://github.com/apache/iceberg/pull/15280)

**信号：**
REST Catalog 的 staged table 工作流正在增强，说明社区持续投入 **云环境临时凭证与安全访问模型**。

**纳入下一版本概率：中等**
- 与 OpenAPI spec 变更有关，需要跨实现协调；
- 但使用场景明确，且已有历史社区讨论基础。

---

### 3) 自定义 TLS keystore/truststore 支持
- PR: [#15235](https://github.com/apache/iceberg/pull/15235)

**信号：**
企业用户对安全接入、私有证书体系支持有较强需求。  
这类能力虽不“炫技”，但对生产落地很关键。

**纳入下一版本概率：中等**
- 企业需求强；
- 但 stale 状态说明维护推进较慢。

---

### 4) 列恢复（undelete column）
- PR: [#15084](https://github.com/apache/iceberg/pull/15084)

**信号：**
Schema evolution 正在向更强恢复能力延伸。  
若未来合并，将显著提升 Iceberg 在复杂治理场景下的可运维性。

**纳入下一版本概率：中等**
- 功能价值高；
- 但需谨慎处理 field id、required/optional、父字段存在性等语义。

---

### 5) Materialized View Spec
- PR: [#11041](https://github.com/apache/iceberg/pull/11041)

**信号：**
这是最明确的长期路线图之一。  
虽然短期不一定落地到下个版本，但它代表 Iceberg 正在向 **更完整的湖仓语义标准层** 演进。

**纳入近期版本概率：中低；长期概率：高**

---

## 7. 用户反馈摘要

基于今日 Issue/PR 摘要，可提炼出以下真实用户痛点：

### 1) 生产流式链路最怕“静默失败”
- 相关链接: [#15878](https://github.com/apache/iceberg/issues/15878)

Kafka Connect 用户反馈的核心不是单纯 commit 冲突，而是 **失败后系统未报错却不再写数据**。  
这说明用户对 Iceberg 连接器的诉求已经从“功能可用”升级为“生产级可观测、可恢复、可告警”。

---

### 2) 用户希望文件级统计信息被更充分利用
- 相关链接: [#15882](https://github.com/apache/iceberg/issues/15882)
- 对应 PR: [#15883](https://github.com/apache/iceberg/pull/15883)

大表用户越来越关注 predicate pruning 的细节，说明 Iceberg 已进入 **优化深水区**：  
不是“能不能查”，而是“能不能足够快、足够省”。

---

### 3) 兼容性需求持续增长，特别是 Avro、Parquet 与迁移流程
- 相关链接:
  - [#15437](https://github.com/apache/iceberg/pull/15437)
  - [#15677](https://github.com/apache/iceberg/issues/15677)
  - [#15874](https://github.com/apache/iceberg/pull/15874)

用户希望：
- 更好读取外部系统生产的数据；
- 更细控制 Parquet 写入行为；
- 在 Spark migrate 等迁移场景中有更明确的失败边界说明。

这反映出 Iceberg 的真实使用环境非常异构，兼容性和迁移体验依然是 adoption 关键。

---

### 4) Schema 演化需求变复杂
- 相关链接:
  - [#15084](https://github.com/apache/iceberg/pull/15084)
  - [#15445](https://github.com/apache/iceberg/pull/15445)

用户已不满足于基础增删列，而是希望：
- 恢复误删列；
- 跟踪列更新历史；
- 在更复杂的治理/审计场景中保持元数据完整性。

---

## 8. 待处理积压

以下长期未完成但值得维护者重点关注：

### 1) Materialized View Spec
- PR: [#11041](https://github.com/apache/iceberg/pull/11041)

**原因：**
- 战略价值高；
- 挂起时间长；
- 需要更多设计决策收敛。  
**建议：** 发起阶段性设计总结，拆分成最小可接受规范范围。

---

### 2) Add ability to undelete a column
- PR: [#15084](https://github.com/apache/iceberg/pull/15084)

**原因：**
- 用户价值高；
- 涉及 schema history、field id 以及 Spark procedure 语义。  
**建议：** 可考虑先合入 API/core 最小能力，Spark procedure 后置。

---

### 3) BasicTLSConfigurer for custom keystore/truststore support
- PR: [#15235](https://github.com/apache/iceberg/pull/15235)

**原因：**
- 企业生产接入价值明确；
- stale 但并非低价值。  
**建议：** 维护者应明确是否接受该配置模式，避免长期悬而不决。

---

### 4) Auto-flush accumulated data files to manifests
- PR: [#15590](https://github.com/apache/iceberg/pull/15590)

**原因：**
- 大规模导入性能/稳定性优化价值高；
- 对重写/批量导入用户影响直接。  
**建议：** 尽快评审其阈值策略、manifest 写放大和兼容性影响。

---

### 5) Spark 4.0 异步微批规划回移植
- PR: [#15876](https://github.com/apache/iceberg/pull/15876)

**原因：**
- 对 Spark 4.0 用户有现实价值；
- 但 backport 需警惕行为差异和测试覆盖完整性。  
**建议：** 与已合入的 4.1 工作统一梳理，避免版本分叉维护负担。

---

## 结论

今天的 Iceberg 社区呈现出一个典型特征：**“底层格式/元数据长期演进” 与 “生产场景 correctness/stability 修复” 并行推进**。  
从短期优先级看，最值得关注的是：
1. Kafka Connect 静默失效问题 [#15878](https://github.com/apache/iceberg/issues/15878)  
2. Spark branch/time-travel 缓存正确性修复 [#15840](https://github.com/apache/iceberg/pull/15840)  
3. `StrictMetricsEvaluator.notStartsWith` 的裁剪优化 [#15882](https://github.com/apache/iceberg/issues/15882) / [#15883](https://github.com/apache/iceberg/pull/15883)

从中长期看，**物化视图、列恢复、列级更新元数据、v4 tracked file、REST staged credential refresh** 是最值得持续追踪的路线图信号。  
整体而言，Iceberg 仍处于 **高活跃、强演进、但评审积压偏高** 的健康状态。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区活跃度较高：共有 **27 条 PR 更新**、**2 条 Issue 更新**，但**无新版本发布**，且仅有 **1 条 PR 在最近状态中被合并/关闭**。  
从内容看，开发重心非常集中，主要围绕三条主线推进：**Kernel 能力补齐**、**Spark DSv2 写路径落地**、以及 **kernel-spark CDC 流式读取链路的分阶段实现**。  
Issue 数量不多，但都具有较强产品信号：一个指向 **Delta Kernel 提交元数据可扩展性**，另一个指向 **协议规范文档清晰度与跨实现兼容性**。  
整体判断：项目当前处于**高开发密度、低发布频率**的迭代窗口，核心特征是大规模堆叠 PR 推进基础设施，而不是面向终端用户的版本节奏。

---

## 2. 项目进展

### 今日已合并/关闭的重要 PR

根据提供的数据，过去 24 小时 **已合并/关闭 PR 仅 1 条**；展示列表中未明确给出该条目的详情。结合当前 PR 栈状态，可以明确看出以下方向正在接近可交付阶段：

#### 2.1 Spark DSv2 写入链路正在形成端到端闭环
- [#6482 [DSv2] Add batch write implementation](https://github.com/delta-io/delta/pull/6482)
- [#6483 [DSv2] Add WriteBuilder and wire SparkTable.newWriteBuilder](https://github.com/delta-io/delta/pull/6483)
- [#6449 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6449)
- [#6450 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6450)

**推进意义：**
- Delta 正在把 **Spark DataSource V2** 与 **Delta Kernel** 更紧密地打通。
- `createTable()`、`newWriteBuilder()`、batch append 等关键节点都在补齐，说明项目正在推动 **DSv2 下的建表 + 写入 + 提交** 统一走新路径。
- 对查询引擎和连接器生态而言，这意味着未来 Delta 在 Spark 侧可能拥有更清晰的 **V2 API 兼容层**，为更标准化的 catalog / write path 奠定基础。

**技术价值：**
- 降低传统 V1/V2 双轨实现的复杂度。
- 强化 Delta Kernel 作为底层事务与元数据管理核心的角色。
- 为后续兼容更多执行引擎或 REST/远程提交路径做准备。

---

#### 2.2 kernel-spark 的 CDC 流式支持仍在持续堆叠推进
- [#6075 [kernel-spark][Part 1] CDC streaming offset management (initial snapshot)](https://github.com/delta-io/delta/pull/6075)
- [#6076 [kernel-spark][Part 2] CDC commit processing](https://github.com/delta-io/delta/pull/6076)
- [#6391 [kernel-spark][Part 2.5] CDC admission limits for commit processing](https://github.com/delta-io/delta/pull/6391)
- [#6336 [kernel-spark][Part 3] CDC streaming offset management](https://github.com/delta-io/delta/pull/6336)
- [#6359 [kernel-spark][Part 4] CDC data reading](https://github.com/delta-io/delta/pull/6359)
- [#6362 [kernel-spark][Part 5] CDC schema coordination](https://github.com/delta-io/delta/pull/6362)
- [#6363 [kernel-spark][Part 6] End-to-end CDC streaming integration tests](https://github.com/delta-io/delta/pull/6363)
- [#6370 [kernel-spark][Part 7] DV+CDC same-path pairing and DeletionVector support](https://github.com/delta-io/delta/pull/6370)
- [#6388 [kernel-spark] Support allowOutOfRange for CDC startingVersion in DSv2 streaming](https://github.com/delta-io/delta/pull/6388)

**推进意义：**
- 这是一条非常明确的路线图信号：Delta 正在系统性构建 **基于 Kernel 的 CDC 流式读取能力**。
- 相关 PR 已覆盖：
  - 初始快照 offset 管理
  - commit 级变更处理
  - admission limits
  - schema 协调
  - 端到端流式测试
  - **Deletion Vector 与 CDC 协同**
  - `startingVersion` 越界容忍策略

**技术价值：**
- 对增量消费、湖仓同步、低延迟变更订阅场景至关重要。
- 若该 PR 栈顺利落地，Delta 在 CDC 与流式语义上的工程完整度会显著提升。
- 特别是 **DV + CDC** 的处理，直接影响查询正确性与变更结果一致性。

---

#### 2.3 Delta REST / UC 管理提交流程增强
- [#6347 Plumb UC-managed schema evolution through Delta REST commits](https://github.com/delta-io/delta/pull/6347)

**推进意义：**
- 该 PR 旨在让 **UC-managed schema evolution** 能够经由 **Delta REST v1 managed commit** 正常提交。
- 这不仅是功能补洞，也反映出 Delta 在 **托管式元数据控制面** 上的演进方向。

**技术价值：**
- 允许 schema / partition / property / protocol 更新进入托管提交链路。
- 有助于统一云端控制平面与 Delta 事务提交逻辑。
- 对企业级 catalog / governance 场景价值较高。

---

#### 2.4 UniForm 相关元数据原子提交继续迭代
- [#6485 [UniForm][Deprecated] Support commit with UniForm metadata atomically for UCCommitCoordinatorClient](https://github.com/delta-io/delta/pull/6485)
- [#6486 [UniForm] Support commit with UniForm metadata atomically for UCCommitCoordinatorClient](https://github.com/delta-io/delta/pull/6486)
- [#6488 [UniForm][Prototype] Fix field ID assignment](https://github.com/delta-io/delta/pull/6488)

**推进意义：**
- 今日新增 PR 中，UniForm 是另一条值得关注的主线。
- “原子提交 UniForm metadata” 说明团队正在关注 **跨表格式元数据一致性** 与 **提交原子性**。
- “field ID assignment” 则指向 schema 演进与跨格式映射中的关键兼容问题。

**技术价值：**
- 对 Delta 与其他开放表格式的互操作很关键。
- 如果 field ID 处理不稳定，可能影响 schema mapping、读写兼容、以及下游引擎正确解析。

---

## 3. 社区热点

> 说明：给定数据中评论数大多为 `undefined`，因此这里按“主题重要性 + 活跃更新时间 + 技术影响面”综合评估。

### 热点 1：Kernel 需要支持写入 commitInfo.tags
- Issue: [#6167 Support commit tags in commitInfo for Delta Kernel](https://github.com/delta-io/delta/issues/6167)
- PR: [#6484 [Kernel] Add withCommitTags API to write custom tags to commitInfo in the Delta log](https://github.com/delta-io/delta/pull/6484)

**技术诉求分析：**
- 用户希望在 Delta Kernel 的事务提交中写入自定义 `commitInfo.tags`。
- 这类能力对 **表同步工具、审计、血缘追踪、跨系统关联标识** 很重要。
- 该需求已经快速出现对应 PR，说明维护者认可其必要性，且实现门槛相对可控。

**背后信号：**
- Delta Kernel 正从“可读写底层库”向“可嵌入事务与治理基础设施”演进。
- 对外部系统而言，提交元数据可编程性是落地集成的关键。

---

### 热点 2：协议规范中文档歧义可能影响跨实现兼容
- Issue: [#6480 docs: clarify binary partition value serialization format in protocol spec](https://github.com/delta-io/delta/issues/6480)

**技术诉求分析：**
- 该 Issue 指出 protocol spec 中 **binary partition value serialization** 的描述不够清晰。
- 这不是简单文档问题，本质上关系到：
  - 不同语言实现如何正确编码/解码
  - 分区值在 JSON / 协议文本中的精确定义
  - 第三方实现是否会因歧义出现兼容偏差

**背后信号：**
- Delta 已不只是 Spark 内部实现，而是一个需要被多引擎、多语言复刻的协议。
- 当协议文档不够精确时，最先暴露问题的往往是连接器作者与生态集成方。

---

### 热点 3：kernel-spark CDC 大型堆叠 PR 持续刷新
- 起点 PR: [#6075](https://github.com/delta-io/delta/pull/6075)
- 最新阶段 PR: [#6370](https://github.com/delta-io/delta/pull/6370)

**技术诉求分析：**
- 这一组 PR 横跨 offset、schema、数据读取、测试与 DV 支持，说明其不是局部优化，而是完整功能建设。
- 社区核心诉求是：**让 Kernel 支持真正可用的 CDC 流式消费能力**，而非仅提供底层动作解析。

**背后信号：**
- 这是未来版本最有可能成为亮点能力的方向之一。
- 一旦该链路完成，Delta 对实时分析、变更同步、增量摄取平台的吸引力会增强。

---

## 4. Bug 与稳定性

今日没有看到明确的新崩溃、数据损坏或查询结果错误类 Issue，但从当前更新内容中，仍可归纳出若干**潜在稳定性/正确性风险点**，按严重程度排序如下：

### 高优先级：CDC + Deletion Vector 协同正确性
- PR: [#6370 [kernel-spark][Part 7] DV+CDC same-path pairing and DeletionVector support](https://github.com/delta-io/delta/pull/6370)

**风险说明：**
- CDC 与 Deletion Vector 同时存在时，若路径配对、记录可见性或变更归属处理不正确，可能导致：
  - 增量流读结果不一致
  - 漏读/重读
  - 删除与变更事件语义错配

**是否已有 fix PR：**
- 有，当前该 PR 本身就是针对这一稳定性/正确性链路的实现与修正。

---

### 中优先级：UniForm field ID 分配可能影响跨格式兼容
- PR: [#6488 [UniForm][Prototype] Fix field ID assignment](https://github.com/delta-io/delta/pull/6488)

**风险说明：**
- field ID 是列演进、schema mapping、跨格式互操作的重要元数据。
- 如果 ID 分配不稳定，可能造成：
  - schema 演进后字段映射错误
  - 下游引擎读取异常
  - 格式转换元数据不一致

**是否已有 fix PR：**
- 有，当前已出现原型修复 PR。

---

### 中优先级：协议文档歧义带来的实现偏差风险
- Issue: [#6480](https://github.com/delta-io/delta/issues/6480)

**风险说明：**
- 虽然目前是文档问题，但其影响范围可能波及第三方实现。
- 对协议型项目来说，文档歧义最终可能演化为实际兼容性 bug。

**是否已有 fix PR：**
- 暂未在给定数据中看到对应修复 PR。

---

### 低优先级：Kernel 缺失 commit tags 能力导致审计与同步信息缺失
- Issue: [#6167](https://github.com/delta-io/delta/issues/6167)
- PR: [#6484](https://github.com/delta-io/delta/pull/6484)

**风险说明：**
- 不属于功能性故障，但会影响：
  - 提交审计信息完整性
  - 同步工具追踪能力
  - 外部系统关联元数据写入

**是否已有 fix PR：**
- 有，已出现针对性修复实现。

---

## 5. 功能请求与路线图信号

### 5.1 Delta Kernel 提交标签扩展大概率会被纳入后续版本
- Issue: [#6167](https://github.com/delta-io/delta/issues/6167)
- PR: [#6484](https://github.com/delta-io/delta/pull/6484)

**判断：高概率进入下一轮版本或近期里程碑。**

原因：
- 需求明确、边界清晰。
- 已有直连实现 PR。
- 对生态集成工具价值直接，属于低风险高收益能力补齐。

---

### 5.2 DSv2 + Kernel 写路径是当前最强路线图信号之一
- [#6482](https://github.com/delta-io/delta/pull/6482)
- [#6483](https://github.com/delta-io/delta/pull/6483)
- [#6449](https://github.com/delta-io/delta/pull/6449)
- [#6450](https://github.com/delta-io/delta/pull/6450)

**判断：极可能成为后续版本的重要工程成果。**

原因：
- 建表、路由、WriteBuilder、batch write 已形成成体系 PR 群。
- 这说明不是实验性补丁，而是架构级推进。
- 对 Spark connector 的现代化、标准接口兼容、后续流写扩展都有战略意义。

---

### 5.3 CDC streaming on Kernel-Spark 是中期核心主题
- [#6075](https://github.com/delta-io/delta/pull/6075) 至 [#6370](https://github.com/delta-io/delta/pull/6370)

**判断：高概率是未来版本的重要看点，但短期内仍处于集成打磨阶段。**

原因：
- PR 栈长、依赖多、覆盖面广。
- 这类能力对测试、回归、正确性验证要求高，不太像会草率合入的功能。
- 一旦合并，将显著增强 Delta 的流式与变更数据消费能力。

---

### 5.4 UniForm 原子提交与 field ID 修复代表跨格式互操作继续投入
- [#6485](https://github.com/delta-io/delta/pull/6485)
- [#6486](https://github.com/delta-io/delta/pull/6486)
- [#6488](https://github.com/delta-io/delta/pull/6488)

**判断：属于中高优先级方向，但可能先以实验/原型方式推进。**

原因：
- 标题中出现 `Prototype`、`Deprecated`，说明方案仍在收敛。
- 但同时也表明维护者正积极迭代实现路径，而非停留在讨论阶段。

---

## 6. 用户反馈摘要

### 6.1 外部同步/治理工具需要更丰富的提交元数据
- 来源：[#6167](https://github.com/delta-io/delta/issues/6167)

**用户痛点：**
- 使用 Delta Kernel 进行事务提交时，无法写入自定义 `commitInfo.tags`。
- 这限制了 Apache XTable 一类同步工具在提交日志中附带来源、批次、任务 ID 或同步上下文。

**反映出的真实场景：**
- Delta 已被用作更大数据平台中的一个底层组件，而非单一存储格式。
- 用户希望通过提交日志承载更多治理、调试和运维元数据。

---

### 6.2 协议文本不精确会阻碍第三方实现
- 来源：[#6480](https://github.com/delta-io/delta/issues/6480)

**用户痛点：**
- 二进制分区值序列化描述不清晰，容易让实现者误把 JSON 转义表示当成协议字节语义。
- 这会影响协议复现与跨语言解析正确性。

**反映出的真实场景：**
- 用户不只是调用官方实现，而是在开发/维护兼容实现、工具链或连接器。
- 说明 Delta 的生态正依赖更严格的协议定义。

---

## 7. 待处理积压

以下条目虽然近期有更新，但从时间跨度和依赖关系看，仍值得维护者重点关注：

### 7.1 kernel-spark CDC 长栈 PR 已持续超过一个半月
- [#6075](https://github.com/delta-io/delta/pull/6075)（创建于 2026-02-19）
- [#6076](https://github.com/delta-io/delta/pull/6076)（创建于 2026-02-19）
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**关注原因：**
- PR 之间强依赖，若评审和合并节奏不够快，容易造成：
  - rebase 成本上升
  - CI 噪声增加
  - 功能迟迟不能对外形成可用里程碑

**建议：**
- 维护者可考虑按阶段合并基础能力，缩短栈长度。
- 对外给出 CDC/kernel-spark 的阶段性里程碑说明，有助于稳定社区预期。

---

### 7.2 UC-managed schema evolution through REST commits 仍待落地
- [#6347](https://github.com/delta-io/delta/pull/6347)

**关注原因：**
- 这是托管式提交链路中的关键功能。
- 若长期停留在待合并状态，企业用户在 REST/UC 托管场景下的 schema evolution 能力可能继续受限。

---

### 7.3 DSv2 建表与写入链路需尽快收束成可验证主线
- [#6449](https://github.com/delta-io/delta/pull/6449)
- [#6450](https://github.com/delta-io/delta/pull/6450)
- [#6482](https://github.com/delta-io/delta/pull/6482)
- [#6483](https://github.com/delta-io/delta/pull/6483)

**关注原因：**
- 这组 PR 呈现出明显的架构转移趋势。
- 如果不能尽快形成稳定主路径，Spark 侧 V1/V2、Kernel/传统实现并行的复杂度会继续累积。

---

## 总结判断

Delta Lake 今日没有版本发布，但开发活动非常集中，且**明显围绕未来能力边界在扩展**：  
1. **Kernel 从底层读写库向可嵌入事务平台增强**，典型例子是 commit tags。  
2. **Spark DSv2 + Kernel 的写入/建表主路径正在成型**。  
3. **CDC streaming on kernel-spark** 是当前最值得关注的中期主线。  
4. **UniForm 与协议规范** 则反映出 Delta 正持续投入开放生态与跨实现兼容性。  

从健康度看，项目**研发活跃、方向清晰**；从交付节奏看，当前更像是**大规模功能栈集成期**，短期内需要更多合并收束，才能把这些进展转化为可发布成果。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时 Databend 社区整体保持**中高活跃度**：Issues 更新 2 条，PR 更新 11 条，说明当前开发重心仍集中在代码合入与功能推进，而非新增问题暴增。  
从变更类型看，今天的主题比较清晰：一方面在**查询引擎正确性与元数据一致性**上继续补洞，另一方面多个较大特性仍在推进中，包括 **table branch、几何函数、CSV/TEXT 编码支持、自动 datetime 格式识别**。  
稳定性方面，新增一个与**优化器常量折叠上下文错误**相关的问题，属于潜在的查询语义偏差风险；同时一个与 **flashback 元数据一致性** 相关的 bug 已通过 PR 关闭，说明维护者对正确性问题响应较快。  
总体看，项目健康度良好：**核心开发节奏积极，问题关闭效率尚可，但仍需关注优化器语义一致性和历史快照/DDL 交互的边界稳定性。**

---

## 3. 项目进展

### 已关闭 / 已合并的重要 PR

#### 1) 修复 Flashback / Time Travel 元数据一致性
- **PR**: #19653 `fix(query): guard metadata consistency for flashback, time travel, and DDL column operations`  
  链接: https://github.com/databendlabs/databend/pull/19653
- **对应 Issue**: #19661 `[C-bug] bug: Flashback Metadata Inconsistency`  
  链接: https://github.com/databendlabs/databend/issues/19661

**进展解读：**  
这是今天最重要的稳定性修复之一。问题核心在于当 `ALTER TABLE ... FLASHBACK TO` 回退到历史快照后，一些**依赖 schema 的元数据**（如 bloom index、policy、index、cluster key、constraints）没有与历史 schema 同步恢复，可能导致：
- 写入失败
- 查询错误
- 更严重时出现静默数据损坏风险

PR #19653 不仅修复了 **flashback / time travel** 的元数据一致性，还补上了 `DROP COLUMN` / `MODIFY COLUMN` 相关保护逻辑。这说明 Databend 在 FUSE 表的**历史快照语义闭环**方面继续加强，属于对 OLAP 生产场景非常关键的基础能力加固。

---

#### 2) 新增 macOS PR 检查，提升 CI 覆盖面
- **PR**: #19662 `ci: add macOS PR check`  
  链接: https://github.com/databendlabs/databend/pull/19662

**进展解读：**  
该 PR 为 PR 验证流程新增 macOS 检查任务。虽然不直接影响查询功能，但对项目工程质量很重要：
- 提升跨平台兼容性信心
- 更早发现平台相关构建/测试问题
- 降低外部贡献者在 macOS 环境下的集成成本

对于开源数据库项目，这类 CI 改进通常会间接提升发布稳定性。

---

#### 3) 修复 SET_VAR hint 写入共享 query_settings 的问题
- **PR**: #19663 `fix(query): SET_VAR hint write into the shared query_settings`  
  链接: https://github.com/databendlabs/databend/pull/19663

**进展解读：**  
这个修复聚焦在查询级 Hint 与共享会话/查询设置之间的边界。标题表明此前 `SET_VAR` hint 可能直接写入共享的 `query_settings`，这类问题通常会引发：
- 查询间设置串扰
- 会话隔离不符合预期
- 优化器或执行器行为出现非确定性

虽然摘要未展开细节，但从问题性质判断，这属于**查询设置作用域隔离**修复，对多并发查询环境尤为重要。

---

## 4. 社区热点

### 热点 1：优化器常量折叠未使用 session context
- **Issue**: #19656 `Optimizer constant folding uses FunctionContext::default() instead of session context`  
  链接: https://github.com/databendlabs/databend/issues/19656
- **评论数**: 2

**为何值得关注：**  
这是今天讨论度最高的 Issue。问题指出，优化器/规划器在做**常量折叠或表达式求值**时，使用了 `FunctionContext::default()`，而不是会话上下文中的 `FunctionContext`。  
这意味着所有依赖 session 级参数的表达式语义，在优化阶段可能被**静默忽略**。

**背后技术诉求：**
- 保证“优化阶段”和“执行阶段”语义一致
- 避免 session setting 影响函数行为时出现错误折叠
- 提升 SQL 正确性，尤其是日期/时区/格式相关函数

这类问题比单纯 crash 更隐蔽，因为它可能表现为“查询能跑，但结果不对”。

---

### 热点 2：实验性 table branch 特性持续推进
- **PR**: #19551 `[pr-feature] feat(query): support experimental table branch`  
  链接: https://github.com/databendlabs/databend/pull/19551

**关注原因：**  
这是当前最具路线图信号的大特性之一，PR 持续活跃。其内容包括：
- FUSE 表分支创建
- 带 branch 限定的读写
- branch 生命周期元数据
- branch-aware 垃圾回收

**技术意义：**
- 让表级数据分支管理更接近 Git-like 数据工作流
- 支持实验分析、隔离回溯、分支写入等高级数仓场景
- 有望增强 Databend 在“数据版本化分析”上的差异化能力

---

### 热点 3：Geometry 函数能力扩展
- **PR**: #19620 `[pr-feature] feat(query): Support Geometry aggregate functions`  
  链接: https://github.com/databendlabs/databend/pull/19620

**关注原因：**  
该 PR 引入 geometry 标量与聚合函数，并实现 `union` / `intersection` / `difference` 的统一 overlay pipeline。  
这类能力表明 Databend 正在向更复杂的分析函数生态扩展，不再局限于传统数值/字符串/时间类型处理。

**潜在影响：**
- 增强 GIS / 空间分析场景适配
- 丰富 SQL 分析函数体系
- 提升与支持地理空间计算的分析数据库的竞争力

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Flashback 回退后的元数据与 schema 不一致
- **Issue**: #19661 `[C-bug] bug: Flashback Metadata Inconsistency`  
  链接: https://github.com/databendlabs/databend/issues/19661
- **状态**: 已关闭
- **Fix PR**: #19653  
  链接: https://github.com/databendlabs/databend/pull/19653

**风险级别：高**  
影响历史快照恢复后的 bloom index、policy、cluster key、constraints 等 schema 关联元数据，可能导致写失败、查询失败乃至静默损坏。  
**当前状态：已有修复并关闭，响应较及时。**

---

### P1：优化器常量折叠忽略 session 级 FunctionContext
- **Issue**: #19656  
  链接: https://github.com/databendlabs/databend/issues/19656
- **状态**: Open
- **Fix PR**: 暂未看到关联 fix PR

**风险级别：高**  
这是典型的**查询正确性**问题。若某些函数的求值依赖 session 参数，则优化阶段常量折叠结果可能与执行阶段不一致，带来非预期结果。  
**建议优先跟进**，尤其在即将合入更多格式推断、datetime 解析能力时，这类上下文一致性问题风险会进一步放大。

---

### P2：SET_VAR hint 可能污染共享 query_settings
- **PR**: #19663  
  链接: https://github.com/databendlabs/databend/pull/19663
- **状态**: Closed

**风险级别：中高**  
虽然未单独挂出 Issue，但从 PR 标题看这是**配置作用域隔离**问题。若查询 hint 改写了共享设置，可能影响并发查询行为一致性。  
目前已有修复，建议后续关注是否补充回归测试覆盖。

---

### P2：广播 Join 与 merge-limit build 计划兼容性
- **PR**: #19652 `fix(query): support broadcast join with merge-limit build`  
  链接: https://github.com/databendlabs/databend/pull/19652
- **状态**: Open

**风险级别：中**  
该修复针对集群执行计划中 `Broadcast(Limit(Merge(Limit(Scan))))` 的 build side 结构，说明当前分布式执行计划在特定优化组合下仍存在边界问题。  
这是典型的复杂执行计划兼容性修复，建议尽快审阅。

---

### P2：低内存查询在全局内存压力下的 spill 行为优化
- **PR**: #19655 `feat(query): add spill backoff with sleep for low-memory queries under global pressure`  
  链接: https://github.com/databendlabs/databend/pull/19655
- **状态**: Open

**风险级别：中（偏性能/稳定性）**  
该 PR 不属于 bug 修复，但显然指向一个现实问题：在全局内存压力下，低内存查询过早 spill 可能导致系统整体效率下降。  
引入指数退避睡眠是一种**资源协调型稳定性优化**，有助于减少过度 spill。

---

## 6. 功能请求与路线图信号

### 1) Table Branch 很可能进入后续重要版本
- **PR**: #19551  
  链接: https://github.com/databendlabs/databend/pull/19551

这是最明确的路线图信号。table branch 不只是语法糖，而是涉及：
- 元数据模型
- 读写路径
- GC
- 分支生命周期管理

若顺利合入，很可能成为 Databend 面向数据版本控制/实验隔离的重要卖点。

---

### 2) 自动 datetime 格式识别正在靠近可用状态
- **PR**: #19659 `feat(sql): add AUTO datetime format detection`  
  链接: https://github.com/databendlabs/databend/pull/19659

该 PR 新增 session setting `enable_auto_detect_datetime_format`，默认关闭，支持对预定义非 ISO 格式进行确定性推断。  
这反映出 Databend 正在平衡两点：
- 提高易用性，减少导入/SQL 编写门槛
- 避免宽松解析带来不可控歧义

结合今天的 #19656 优化器上下文问题，可以看出**日期时间解析语义一致性**是近期值得重点关注的方向。

---

### 3) CSV/TEXT 编码支持具备较强落地价值
- **PR**: #19660 `feat: CSV/TEXT support encoding.`  
  链接: https://github.com/databendlabs/databend/pull/19660

该 PR 为 CSV/TEXT stage 读取增加字符集解码和基础错误策略。  
这是非常典型的用户需求信号，尤其在企业数据接入中，经常遇到：
- 非 UTF-8 文件
- 历史系统导出的本地编码数据
- 脏数据混杂

若合入，将直接增强 Databend 的**数据摄取兼容性**。

---

### 4) Geometry 聚合函数显示分析能力扩张
- **PR**: #19620  
  链接: https://github.com/databendlabs/databend/pull/19620

Geometry 功能通常不是最早期数据库优先事项，因此其推进意味着：
- 核心引擎能力已较成熟
- 社区开始推动更专业的分析能力
- Databend 正尝试拓宽行业使用场景

---

### 5) Binder alias 语义稳定化属于 SQL 兼容性深化
- **PR**: #19618 `refactor(sql): stabilize binder alias semantics across aggregate, window, and clause rewrites`  
  链接: https://github.com/databendlabs/databend/pull/19618

该 PR 虽标记为 refactor，但本质上是 SQL 语义兼容性的重要打磨。涉及 `WHERE / HAVING / QUALIFY / ORDER BY` 等子句中的 alias 语义稳定化，这类改动通常对：
- 复杂 BI SQL
- 兼容其他数据库迁移
- 用户查询可预测性

都有直接影响。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出以下真实用户痛点：

### 1) 用户最在意的是“历史快照恢复后还能不能正确写、正确查”
- 相关链接: #19661 https://github.com/databendlabs/databend/issues/19661  
这说明 Databend 的 flashback / time travel 已经进入**真实使用场景**，用户不只是演示功能，而是在依赖其做回溯恢复、历史读写和 schema 演进。  
痛点不在功能有没有，而在**元数据一致性是否足够可靠**。

### 2) 用户开始关注优化器是否改变了查询语义
- 相关链接: #19656 https://github.com/databendlabs/databend/issues/19656  
这反映出用户使用 Databend 已不再停留于简单查询，而是进入更复杂、依赖 session setting 的场景。  
他们期望：
- 优化器不要“自作主张”改变含义
- 同一表达式在 planning 和 execution 阶段行为一致

### 3) 数据接入兼容性仍是高频需求
- 相关链接: #19660 https://github.com/databendlabs/databend/pull/19660  
CSV/TEXT 编码支持说明现实中仍有大量“非标准输入数据”要处理。  
这类需求常来自企业落地，而非实验环境，说明 Databend 正持续承接更多生产接入任务。

### 4) 高级查询和资源治理能力正在被真实需求驱动
- 相关链接: #19655 https://github.com/databendlabs/databend/pull/19655  
低内存查询 spill backoff 优化说明用户场景已涉及：
- 多查询并发
- 全局资源争用
- 复杂 workload 下的吞吐/延迟折中

---

## 8. 待处理积压

以下是值得维护者重点关注的开放 PR / Issue：

### 1) 优化器 FunctionContext 语义不一致
- **Issue**: #19656  
  链接: https://github.com/databendlabs/databend/issues/19656

虽然是新问题，但性质严重，建议尽快补充 fix PR，并增加回归测试覆盖：
- session setting 影响常量折叠
- 日期/时区/格式函数
- planner/executor 结果一致性校验

---

### 2) Experimental table branch 大功能 PR 审阅周期较长
- **PR**: #19551  
  链接: https://github.com/databendlabs/databend/pull/19551

创建于 2026-03-15，已持续多周。由于改动面较大，建议维护者尽快：
- 明确设计边界
- 拆分可独立合入的子 PR
- 优先锁定 metadata / GC / SQL 语义接口

否则容易形成长期积压。

---

### 3) Binder alias 语义 refactor 复杂度较高
- **PR**: #19618  
  链接: https://github.com/databendlabs/databend/pull/19618

这类 SQL binder 改造虽然价值高，但风险也大，建议重点关注：
- 与已有方言兼容性
- 聚合/窗口函数语义回归
- BI 工具生成 SQL 的兼容情况

---

### 4) Geometry 聚合与 CSV/TEXT 编码支持值得尽快明确优先级
- **PR**: #19620  
  链接: https://github.com/databendlabs/databend/pull/19620
- **PR**: #19660  
  链接: https://github.com/databendlabs/databend/pull/19660

两者都属于“用户可感知度高”的功能：
- Geometry 偏向能力拓展
- 编码支持偏向落地实用性

建议根据产品路线明确先后顺序，避免都长期挂起。

---

## 附：今日重点链接汇总

- Issue #19656: Optimizer constant folding uses FunctionContext::default() instead of session context  
  https://github.com/databendlabs/databend/issues/19656

- Issue #19661: [C-bug] bug: Flashback Metadata Inconsistency  
  https://github.com/databendlabs/databend/issues/19661

- PR #19653: fix(query): guard metadata consistency for flashback, time travel, and DDL column operations  
  https://github.com/databendlabs/databend/pull/19653

- PR #19662: ci: add macOS PR check  
  https://github.com/databendlabs/databend/pull/19662

- PR #19663: fix(query): SET_VAR hint write into the shared query_settings  
  https://github.com/databendlabs/databend/pull/19663

- PR #19551: feat(query): support experimental table branch  
  https://github.com/databendlabs/databend/pull/19551

- PR #19620: feat(query): Support Geometry aggregate functions  
  https://github.com/databendlabs/databend/pull/19620

- PR #19659: feat(sql): add AUTO datetime format detection  
  https://github.com/databendlabs/databend/pull/19659

- PR #19660: feat: CSV/TEXT support encoding  
  https://github.com/databendlabs/databend/pull/19660

- PR #19618: refactor(sql): stabilize binder alias semantics across aggregate, window, and clause rewrites  
  https://github.com/databendlabs/databend/pull/19618

- PR #19652: fix(query): support broadcast join with merge-limit build  
  https://github.com/databendlabs/databend/pull/19652

- PR #19655: feat(query): add spill backoff with sleep for low-memory queries under global pressure  
  https://github.com/databendlabs/databend/pull/19655

如需，我也可以继续把这份日报整理成更适合发布到 **飞书 / Slack / 邮件周报** 的简版格式。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时内，Velox 社区活跃度较高：Issues 更新 4 条、PR 更新 50 条，但没有新版本发布。  
今日主题比较集中，主要围绕 **cuDF/GPU 路径回归修复**、**macOS 测试发现能力问题** 以及 **Presto 兼容函数扩展** 展开。  
从 PR 结构看，活跃 PR 很多，但真正完成合并/关闭的多为历史积压项与清理项；同时，围绕 CI 稳定性的新增 Issue 和对应修复 PR 响应较快，说明维护者对主干稳定性较为敏感。  
整体健康度评估为：**中上**——开发活跃、回归问题定位及时，但仍存在一定数量的长期 stale PR 与平台/测试体系摩擦点。

---

## 3. 项目进展

### 已合并 / 已关闭的重点变更

#### 1) cuDF 全局聚合 COUNT(*) 问题已完成收敛
- **Issue**: #16492 `[CLOSED] [enhancement] [cuDF] Implement/fix COUNT(*) (global) and re-enable test`  
  链接: https://github.com/facebookincubator/velox/issues/16492

该问题描述了 **GPU 模式下 COUNT(*) 在全局聚合场景不可用**，只能在 `GROUP BY` 聚合中工作。该 Issue 在今日关闭，说明相关修复链路已经完成并落地。  
这对 Velox 的 GPU 执行路径是一个重要推进：它补齐了 **基础聚合语义的一致性**，也意味着 cuDF 后端对 SQL 聚合正确性的覆盖在持续改善。  
对下游查询引擎而言，这类修复直接影响：
- 全局聚合查询正确性
- Spark / Presto 风格语义对齐
- GPU 回退逻辑与测试恢复

---

#### 2) cuDF 时间戳单位配置能力合入
- **PR**: #16769 `[CLOSED] [Merged] [cudf] feat(cudf): Add config to set timestamp unit`  
  链接: https://github.com/facebookincubator/velox/pull/16769

该 PR 已合并，新增 **时间戳单位配置能力**，摘要中明确指出 Spark 与 Presto 在时间戳语义上存在两类差异：
1. Spark 使用微秒，Presto 使用纳秒
2. Spark 具有时区语义，Presto 不同

这是一个非常明确的 **跨引擎兼容性增强**。其价值在于：
- 降低 GPU 路径在不同 SQL 方言间的语义偏差
- 为 Spark / Presto 混合生态接入提供配置化适配
- 避免 timestamp 精度不一致导致的结果错误、谓词误判或数据交换问题

从路线图角度看，这说明 Velox 正继续补齐 **多前端 SQL 引擎兼容层**，尤其是 cuDF 后端的语义对齐能力。

---

#### 3) 测试稳定性与随机数据生成质量提升
- **PR**: #15748 `[CLOSED] [Merged] test: Use VectorFuzzer for random RowVector generation in semiJoinDeduplicateResetCapacity test`  
  链接: https://github.com/facebookincubator/velox/pull/15748

该 PR 使用 `VectorFuzzer` 替换原有 `rand()` 随机生成逻辑，用于 `semiJoinDeduplicateResetCapacity` 测试。  
这类改动虽然偏测试工程，但对分析型执行引擎非常关键：
- 提升测试可复现性
- 扩大输入分布覆盖
- 更容易捕获 join/内存容量/去重逻辑中的边界缺陷

这反映出 Velox 在 **执行引擎 correctness 与回归测试质量** 上仍有持续投入。

---

### 今日关闭但未明显推进主线的 PR
以下关闭项多带有 `stale` 标记，更多体现为积压清理，而非今日功能性进展：
- #15756 Array concat 参数签名修正  
  https://github.com/facebookincubator/velox/pull/15756
- #15763 selective reader 字符串优化开关  
  https://github.com/facebookincubator/velox/pull/15763
- #11771 sort-merge join 结果不一致修复  
  https://github.com/facebookincubator/velox/pull/11771
- #15791 fmt 升级  
  https://github.com/facebookincubator/velox/pull/15791
- #15179 移除 `tsan_lock_guard`  
  https://github.com/facebookincubator/velox/pull/15179
- #15361 expr to subfield filters 性能优化  
  https://github.com/facebookincubator/velox/pull/15361
- #15140 原子操作改写  
  https://github.com/facebookincubator/velox/pull/15140
- #15491 executor io/cpu 语义重构  
  https://github.com/facebookincubator/velox/pull/15491

这些 PR 的关闭说明项目中仍有一批 **长期悬而未决的工程/性能/正确性改进** 没有进入主干，后续需要维护者更明确地做优先级判断。

---

## 4. 社区热点

### 热点 1：cuDF CI 持续失败，主干稳定性受影响
- **Issue**: #17028 `[OPEN] [CI] Persistent cuDF test failure: ToCudfSelectionTest.zeroColumnCountConstantFallsBack`  
  链接: https://github.com/facebookincubator/velox/issues/17028
- **Issue**: #17027 `[OPEN] [bug, cudf] fix(cudf): CudfToVelox::getOutput() returns empty vector for zero-column plans, breaking CI`  
  链接: https://github.com/facebookincubator/velox/issues/17027

这是今天最值得关注的热点。  
问题直接表现为：`Linux Build using GCC` 工作流中的 `cudf-tests` 在主干持续失败，且失败点聚焦在 `zero-column plans` 场景。技术上这说明：
- cuDF 与 Velox 向量/批次转换层在 **零列表达式/零列输出计划** 上处理不完整
- 某些常量计数、选择算子或 fallback 路径依赖“空 schema 但有行数”的语义，而当前实现错误返回了空向量

背后的技术诉求是：
1. **GPU 与 CPU 路径的结果容器语义必须一致**
2. **零列计划** 作为 SQL 优化器和执行器中的合法中间形态，必须被基础设施正确承载
3. CI 不能长期因单点回归失稳，否则会削弱主干开发效率

---

### 热点 2：macOS 上 grouped tests 破坏单测发现体验
- **Issue**: #17023 `[OPEN] Grouped tests (velox_add_grouped_tests) break individual test discovery on macOS`  
  链接: https://github.com/facebookincubator/velox/issues/17023
- **PR**: #17026 `[OPEN] fix(build): Disable grouped tests on macOS for individual test discovery`  
  链接: https://github.com/facebookincubator/velox/pull/17026

这是今日“问题提出-修复提交”响应最快的一组。  
`velox_add_grouped_tests()` 的目标是减少链接成本、提升构建效率，但副作用是在 macOS 开发机上影响 `ctest -R <TestName>` 的单个测试发现。  
这说明 Velox 当前面临一个典型工程权衡：
- **CI / 构建吞吐优化**
- **本地开发调试体验**

从维护角度看，PR #17026 倾向于在 macOS 上禁用 grouped tests，以恢复开发者诊断效率。这是一个很实用的工程决策信号：Velox 愿意为开发者体验做平台差异化处理。

---

### 热点 3：Presto 兼容函数扩展持续推进
- **PR**: #16048 `[OPEN] feat: Implement array_top_n with transform lambda argument`  
  链接: https://github.com/facebookincubator/velox/pull/16048
- **PR**: #16162 `[OPEN] feat: Add map_top_n_keys with transform lambda argument`  
  链接: https://github.com/facebookincubator/velox/pull/16162
- **PR**: #16487 `[OPEN] feat: Add array_least_frequent Presto function`  
  链接: https://github.com/facebookincubator/velox/pull/16487

虽然这些 PR 不是今天新建，但今天仍处于活跃更新状态，说明 **SQL 函数兼容性补齐** 仍是持续主线。  
技术诉求很明确：以 Velox 为执行内核时，需要尽可能对齐 **Presto Java 函数行为**，降低迁移与替换成本。  
重点方向包括：
- 数组/Map 高阶函数
- lambda 变换参与排序/Top-N
- 高频分析函数补齐

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：cuDF 主干 CI 持续回归，影响合并后稳定性
1. **#17028** `[CI] Persistent cuDF test failure`  
   链接: https://github.com/facebookincubator/velox/issues/17028
2. **#17027** `[bug, cudf] CudfToVelox::getOutput() returns empty vector for zero-column plans`  
   链接: https://github.com/facebookincubator/velox/issues/17027

**严重性判断：高**  
原因：
- 已经影响到每次 merge 后的 CI
- 属于主干持续回归，不是单次偶发现象
- 触及执行引擎中较基础的输出表示语义

**是否已有 fix PR：**  
从提供数据中，尚未看到针对 #17027/#17028 的明确修复 PR 编号；但 Issue 标题与描述已经高度定位到根因，预期会很快跟进修复。

---

### P2：macOS 单测发现机制受 grouped tests 影响
- **Issue**: #17023  
  链接: https://github.com/facebookincubator/velox/issues/17023
- **Fix PR**: #17026  
  链接: https://github.com/facebookincubator/velox/pull/17026

**严重性判断：中**  
原因：
- 不直接影响查询正确性
- 但会显著影响开发者本地调试、精确回归定位和测试选择执行

**是否已有 fix PR：有**  
而且修复响应非常及时，说明维护者对开发者工作流问题关注度较高。

---

### P3：GPU 聚合语义历史问题已关闭
- **Issue**: #16492  
  链接: https://github.com/facebookincubator/velox/issues/16492

**严重性判断：中（已解决）**  
该问题不再是当前阻塞项，但值得记录，因为它说明 cuDF 路径在聚合正确性方面此前确实存在空白，今天算是技术债的一次清偿。

---

## 6. 功能请求与路线图信号

### 高概率进入后续版本的功能方向

#### 1) Presto 高阶函数与集合函数补齐
- #16048 `array_top_n(..., lambda)`  
  https://github.com/facebookincubator/velox/pull/16048
- #16162 `map_top_n_keys(..., lambda)`  
  https://github.com/facebookincubator/velox/pull/16162
- #16487 `array_least_frequent`  
  https://github.com/facebookincubator/velox/pull/16487

这些 PR 共同指向一个清晰路线图：  
**Velox 正继续强化对 Presto Java 函数面的兼容性，尤其是数组/Map/高阶 lambda 函数。**

这类功能进入下一版本的概率较高，原因是：
- 需求明确，直接对齐上游 SQL 生态
- 与引擎 adoption 关系密切
- 多个相关函数并行推进，显示出系统性规划而不是零散提交

---

#### 2) cuDF 语义配置化与跨引擎兼容
- #16769 时间戳单位配置已合并  
  https://github.com/facebookincubator/velox/pull/16769

这类改动释放出的信号是：  
Velox 尤其在 GPU 后端上，正在从“功能可用”走向“语义可配置、可适配多前端”。  
后续可能继续扩展到：
- 时区处理
- 日期/时间精度
- 聚合/空值规则差异
- Spark / Presto 行为切换开关

---

#### 3) 存储与扫描侧索引能力增强仍在排队
- **PR**: #15878 `ScanSpec IndexBounds Support / cluster index bounds filtering`  
  链接: https://github.com/facebookincubator/velox/pull/15878

这是一个值得关注但尚未进入主线的方向：  
它涉及 `ScanSpec` 上的索引边界过滤能力，潜在收益包括：
- 更强的数据裁剪
- 更少 I/O
- 更适合分析型存储场景中的 cluster index 利用

虽然今天没有实质进展，但这是 **OLAP 存储读取优化** 上较有价值的路线图信号。

---

## 7. 用户反馈摘要

基于今日 Issues 内容，可以提炼出以下真实痛点：

### 1) 用户最敏感的是主干 CI 稳定性，特别是 GPU 路径
来自 #17028 / #17027 的反馈表明，一旦某个 merge 让 `cudf-tests` 持续失败，开发者会立即感知并追踪。  
这说明：
- cuDF 路径已经不是边缘实验代码，而是被持续使用和验证的执行后端
- 用户/维护者对于“merge 后始终红”的容忍度很低

---

### 2) 开发者非常在意本地测试可发现性与调试效率
来自 #17023 的问题表述比较典型：并不是测试本身失败，而是 **无法按单测名精确发现和执行**。  
对大型 C++ 执行引擎项目来说，这类问题会直接拖慢：
- 回归定位
- patch 验证
- 平台专属调试

说明 Velox 开发者群体对工程体验有较高要求，不仅关注功能，也关注日常开发效率。

---

### 3) SQL 兼容性需求依旧强烈
多条活跃 PR 指向 Presto 函数补齐，说明用户在把 Velox 用作执行层时，仍然期待：
- 少改 SQL
- 少做 UDF 替代
- 与现有 Presto 语义尽量一致

这体现出 Velox 的一个核心 adoption 逻辑：  
**兼容性越高，替换成本越低。**

---

## 8. 待处理积压

以下长期未决、但值得维护者重点关注：

### 1) 全外连接结果不一致修复仍未落地
- **PR**: #13907 `[OPEN] feat: Fix the full outer join result mismatch issue`  
  链接: https://github.com/facebookincubator/velox/pull/13907

这是一个典型的 **查询正确性问题**，且涉及 full outer join 这样的核心算子。  
如果问题仍真实存在，其优先级应高于一般功能型 PR。建议维护者确认：
- 是否仍可复现
- 是否已有替代修复
- 是否应拆分成更小 PR 重新推进

---

### 2) 构建依赖升级 PR 长期挂起
- **PR**: #15606 `Bump pypa/cibuildwheel from 3.0.0 to 3.3.0`  
  链接: https://github.com/facebookincubator/velox/pull/15606

依赖升级虽非核心功能，但长期堆积会带来：
- CI 环境老化
- 构建兼容性风险
- 安全与维护成本增加

---

### 3) 存储/索引读取优化类 PR 值得重新评估
- **PR**: #15878 `cluster index bounds filtering / ScanSpec index bounds`  
  链接: https://github.com/facebookincubator/velox/pull/15878

该 PR 与 OLAP 扫描优化直接相关，若设计成熟，可能对读取性能有显著帮助。  
建议维护者评估其与现有 reader / connector / ScanSpec 演进方向的一致性，避免高价值优化长期滞留。

---

### 4) 多项并发、执行器、过滤下推优化 PR 被 stale 清理
代表项：
- #15361 `Improve expr to subfield filters`  
  https://github.com/facebookincubator/velox/pull/15361
- #15491 `Make executor more clear about io vs cpu`  
  https://github.com/facebookincubator/velox/pull/15491
- #15140 `Rewrite tsan atomic to always use std atomic`  
  https://github.com/facebookincubator/velox/pull/15140
- #15179 `Remove tsan_lock_guard`  
  https://github.com/facebookincubator/velox/pull/15179

这些方向分别关系到：
- 谓词下推/过滤性能
- 执行调度语义清晰度
- 并发安全与 TSAN 一致性

即使当前 PR 已关闭，其所反映的问题域仍值得纳入后续 roadmap。

---

## 结论

今天的 Velox 动态显示出两个鲜明特征：  
一方面，**主干稳定性治理较及时**，尤其是 cuDF CI 回归和 macOS 测试体验问题都快速进入社区视野；另一方面，**功能演进仍以 Presto 兼容和 GPU 语义补齐为主线**。  
需要警惕的是，项目存在较明显的 **长期 PR 积压与 stale 清理现象**，其中不乏 join 正确性、过滤优化、执行器语义等重要议题。  
如果未来几天能尽快修复 #17027/#17028 所代表的 cuDF 零列计划回归，同时推动 #17026 合入，Velox 的近期健康度将进一步提升。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时内，Apache Gluten 项目共有 **12 条动态**：**3 条 Issue 更新**、**9 条 PR 更新**，**无新版本发布**。整体来看，项目活跃度处于**中等偏上**水平，重心明显集中在 **Velox 后端兼容性、CI/构建基础设施修复，以及 Spark 4.0 测试增强**。  
从结果上看，今日关闭/结束事项较多：**2 个 Issue 已关闭，5 个 PR 已合并或关闭**，说明维护者在持续清理问题与技术债。另一方面，仍有 4 个 PR 处于待合并状态，其中既包括 **Spark 4.0 适配**，也包括 **TimestampNTZ 回退策略可配置化**，这些都透露出下一阶段将继续强化新 Spark 版本支持与 SQL 类型兼容性。

---

## 3. 项目进展

### 3.1 查询正确性修复：CrossRelNode 表达式未参与原生校验问题已关闭
- **Issue**: #11678 `[CLOSED] [bug, triage] [VL] CrossRelNode's expression is not validated in native validation`  
  链接: apache/gluten Issue #11678
- **PR**: #11679 `[CLOSED] [VELOX] [GLUTEN-11678][VL] Native validation should check CrossRelNode's expression`  
  链接: apache/gluten PR #11679

**进展说明：**  
该问题定位到 Velox 后端在原生校验阶段遗漏了 `CrossRelNode` 中的表达式检查，导致某些 **BroadcastNestedLoopJoin** 场景下，像 `regexp_extract` 中的**不受支持表达式**没有在校验阶段及时回退，最终在 native execution 阶段失败。  
对应 PR 已关闭该问题，并补充了单测。这一修复直接提升了：
- **查询计划验证完整性**
- **不支持表达式的提前识别能力**
- **回退到 Spark 的正确性与可预期性**

这类修复对生产稳定性非常关键，因为它避免了“校验通过、执行时才崩”的延迟失败模式。

---

### 3.2 基础设施修复：CI 镜像构建兼容 Apache Actions 策略
- **Issue**: #11872 `[CLOSED] [VL] Fix Gluten CI image build`  
  链接: apache/gluten Issue #11872
- **已关闭 PR**: #11873 `[CLOSED] [BUILD, INFRA] [GLUTEN-11872][VL] Fix docker build`  
  链接: apache/gluten PR #11873
- **待合并 PR**: #11875 `[OPEN] [INFRA] [GLUTEN-11872][VL] Fix docker metadata action version`  
  链接: apache/gluten PR #11875

**进展说明：**  
该问题源于 GitHub Actions 中若干 Docker 相关 action 版本不符合 Apache 仓库策略，导致 CI 镜像构建失败。  
今日相关 issue 已关闭，但从 PR 状态看，修复动作经历了至少两轮调整：
- #11873 已关闭
- #11875 仍在推进中，聚焦 `docker metadata action` 版本修正

这表明团队正在对 **CI 构建链路** 做策略适配和版本收敛。虽然这不直接改进执行引擎功能，但它是保证：
- 日常构建稳定
- 镜像发布不中断
- 后续测试/集成验证持续可用  
的基础工作，属于典型的“平台健康度修复”。

---

### 3.3 上游 Velox 同步持续推进
- **已关闭 PR**: #11860 `[CLOSED] [CORE, BUILD, VELOX, INFRA, TOOLS, CLICKHOUSE] [GLUTEN-6887][VL] Daily Update Velox Version (2026_04_01)`  
  链接: apache/gluten PR #11860
- **待合并 PR**: #11874 `[OPEN] [BUILD, VELOX] [GLUTEN-6887][VL] Daily Update Velox Version (2026_04_03)`  
  链接: apache/gluten PR #11874

**进展说明：**  
Gluten 继续保持与上游 Velox 的高频同步。今日一条日更 PR 已关闭，另一条新的日更 PR 已开启，说明项目在持续跟进 Velox 最新提交。  
这类同步通常会影响：
- 执行引擎行为一致性
- 内存管理、表达式执行、HashTable/聚合等核心能力
- Velox 修复在 Gluten 内的落地速度

对于依赖 Velox 后端的用户而言，这是一项非常重要的“隐性进展”，因为大量性能优化与正确性修复都通过这条链路进入 Gluten。

---

## 4. 社区热点

### 4.1 最活跃 Issue：Velox 上游未合并 PR 跟踪器
- **#11585** `[OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream`  
  作者: @FelixYBW  
  评论: **16** | 👍: **4**  
  链接: apache/gluten Issue #11585

**热度分析：**  
这是当前最活跃的话题。该 Issue 本质上是一个 **Velox 上游 PR 跟踪器**，专门记录“由 Gluten 社区提交、但尚未合入 Velox upstream 的有用 PR”。  
背后的技术诉求很明确：
1. Gluten 社区对 Velox 有较深依赖，很多功能/修复必须等待上游吸收；
2. 社区希望避免在 `gluten/velox` 分支长期维护大量 patch，减少 rebase 成本；
3. 对于尚未 upstream 的关键能力，希望建立透明的跟踪面板，便于决定是否临时 pick。

这反映出 Gluten 当前的一个核心工程现实：  
**项目演进速度在很大程度上受 Velox 上游节奏影响。**

---

### 4.2 Spark 4.0 测试增强与 Iceberg 元数据适配
- **#11868** `[OPEN] [VELOX, INFRA] [VL] Enable enhanced tests for spark 4.0 & fix failures`  
  链接: apache/gluten PR #11868

**热度分析：**  
该 PR 虽然评论数据未显示，但从主题判断，它是今日最重要的在途功能性工作之一。核心内容包括：
- 启用 **Spark 4.0 enhanced tests**
- 修复 **Iceberg SQL 查询** 因新元数据列引入而导致的失败

这代表两层重要信号：
- Gluten 正在向 **Spark 4.0 正式适配/验证**迈进；
- 对 **Iceberg 数据湖场景** 的兼容性要求正在提升，特别是元数据列变化带来的执行与解析影响。

---

### 4.3 TimestampNTZ 回退策略可配置化
- **#11720** `[OPEN] [CORE, VELOX, DOCS] [GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback`  
  链接: apache/gluten PR #11720

**热度分析：**  
该 PR 聚焦 `TimestampNTZType` 在 Velox 校验器中的处理策略。目前该类型被视为不支持并强制回退 Spark，这妨碍了相关特性的开发和验证。  
技术诉求主要有两点：
- 给开发者/高级用户提供更细粒度的**回退控制能力**
- 为 **`localtimestamp()` 等函数** 的支持测试创造条件

这说明 Gluten 已不满足于“保守回退”，而是开始将一些类型兼容性问题转化为**配置化、可实验、可灰度**的能力。

---

## 5. Bug 与稳定性

以下按影响程度排序：

### P1：查询执行正确性风险 —— CrossRelNode 表达式未校验
- **Issue**: #11678  
  链接: apache/gluten Issue #11678
- **Fix PR**: #11679  
  链接: apache/gluten PR #11679
- **状态**: **已修复并关闭**

**问题描述：**  
在 `BroadcastNestedLoopJoin` + `regexp_extract` 等不受支持表达式组合下，native validation 漏检，导致查询不是安全回退，而是直接在原生执行中失败。  
**影响：**
- 查询正确性
- 原生执行稳定性
- 回退机制可信度

**结论：**  
这是今日最重要的已确认并处理的功能性 bug。

---

### P2：CI / 构建可用性风险 —— Docker Actions 版本不符合 Apache 策略
- **Issue**: #11872  
  链接: apache/gluten Issue #11872
- **相关 PR**: #11873、#11875  
  链接: apache/gluten PR #11873  
  链接: apache/gluten PR #11875
- **状态**: **Issue 已关闭，修复链路仍有后续 PR 在推进**

**问题描述：**  
CI 使用的 `docker/login-action`、`setup-buildx-action`、`metadata-action`、`build-push-action` 版本不被 Apache 仓库策略允许。  
**影响：**
- CI 镜像构建失败
- 合并验证链路受阻
- 发布相关自动化受影响

**结论：**  
这属于基础设施稳定性问题，虽然不直接影响查询结果，但对开发效率和交付可靠性影响显著。

---

### P3：Spark 4.0 / Iceberg 回归风险仍在处理中
- **PR**: #11868  
  链接: apache/gluten PR #11868
- **状态**: **处理中**

**问题描述：**  
Spark 4.0 enhanced tests 启用后暴露出 Iceberg 查询因新元数据列带来的失败。  
**影响：**
- Spark 4.0 适配进度
- Iceberg 兼容性
- 数据湖场景回归风险

**结论：**  
虽然目前还是 PR 阶段暴露的问题，但从趋势上看，这会是近期兼容性工作的重点之一。

---

## 6. 功能请求与路线图信号

### 6.1 Spark 4.0 支持正在明显进入主线
- **PR**: #11868  
  链接: apache/gluten PR #11868

从“启用 enhanced tests”这一动作看，项目已经不只是做编译层面的兼容，而是开始针对 **真实 SQL 行为与数据湖场景** 做更严格验证。这通常意味着：
- Spark 4.0 支持已进入较深阶段
- 后续版本很可能会将 Spark 4.0 兼容性作为重点卖点之一

---

### 6.2 TimestampNTZ / 时间语义支持有望进一步放开
- **PR**: #11720  
  链接: apache/gluten PR #11720

该 PR 并非直接宣称全面支持 `TimestampNTZType`，但它提出“关闭验证回退”的配置项，实质上是为：
- 新时间类型支持
- SQL 时间函数兼容性验证
- 分阶段灰度测试  
铺路。

这通常是新特性进入主线前的早期信号，预计后续可能看到：
- 更多与 `TimestampNTZ` 相关函数支持
- 更细粒度的 validator 行为配置
- 与 Spark 时间语义对齐的修复

---

### 6.3 Velox 上游能力回流仍是中长期路线关键
- **Issue**: #11585  
  链接: apache/gluten Issue #11585

该 tracker 说明 Gluten 社区希望尽快让关键 PR 进入 Velox upstream，而不是长期维护私有 patch。这释放出一个重要路线图信号：  
**未来版本中的很多性能优化与执行能力增强，很可能取决于上游 Velox 合并节奏。**

---

## 7. 用户反馈摘要

基于今日 Issue/PR 摘要，可提炼出以下真实用户与开发者痛点：

1. **“校验通过但执行失败”是不可接受的体验**  
   来自 #11678 的问题反映，用户更希望在 planning/validation 阶段明确得知某表达式不支持，并自动回退 Spark，而不是在 native 执行时崩溃。  
   链接: apache/gluten Issue #11678

2. **时间类型回退过于保守，阻碍功能开发与验证**  
   #11720 表明，当前 `TimestampNTZType` 一律回退会影响新特性的测试和落地，说明高级用户/贡献者已经在推动更细粒度的兼容策略。  
   链接: apache/gluten PR #11720

3. **Spark 4.0 + Iceberg 场景是现实使用重点**  
   #11868 直接点名 enhanced tests 与 Iceberg 元数据列失败，说明社区已在真实数据湖场景中推进新 Spark 版本适配，而不是停留在基础 API 层面。  
   链接: apache/gluten PR #11868

4. **开发基础设施合规性直接影响协作效率**  
   #11872 / #11875 表明，CI action 版本策略这类“非功能性问题”会迅速阻断开发节奏，社区对此响应较快。  
   链接: apache/gluten Issue #11872  
   链接: apache/gluten PR #11875

---

## 8. 待处理积压

### 8.1 长期跟踪事项：Velox 未合并 PR 列表需持续维护
- **#11585** `[OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream`  
  链接: apache/gluten Issue #11585

**提醒原因：**  
该 Issue 创建于 2026-02-07，至今仍活跃，评论数最高。它不是普通 bug，而是会持续影响 Gluten 获取上游能力的“依赖跟踪面板”。建议维护者继续：
- 定期同步已合并/未合并状态
- 标记对 Gluten 影响最大的上游 PR
- 评估哪些 patch 需要临时 pick

---

### 8.2 待合并重点：TimestampNTZ 回退控制
- **#11720** `[OPEN] [CORE, VELOX, DOCS] [GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback`  
  链接: apache/gluten PR #11720

**提醒原因：**  
这是兼容性与开发体验兼顾的重要改动，且已存在一段时间（创建于 2026-03-08）。如果长期不推进，可能影响后续时间类型能力扩展与相关测试覆盖。

---

### 8.3 待合并重点：Spark 4.0 enhanced tests
- **#11868** `[OPEN] [VELOX, INFRA] [VL] Enable enhanced tests for spark 4.0 & fix failures`  
  链接: apache/gluten PR #11868

**提醒原因：**  
该 PR 是近期 Spark 4.0 适配的关键入口，且关联 Iceberg 兼容性问题。建议优先审查，因为它能尽早暴露新版本支持中的系统性问题。

---

### 8.4 历史积压已清理：陈旧 PR 被关闭
- **#8056** `[CLOSED] [stale, BUILD, VELOX, DATA_LAKE] [WIP] Support read Iceberg equality delete file MOR table`  
  链接: apache/gluten PR #8056
- **#9491** `[CLOSED] [stale, BUILD, VELOX] [VL] test arrow + new thrift`  
  链接: apache/gluten PR #9491

**说明：**  
两条历史 PR 今日因 stale 被关闭，说明项目在主动压缩积压。  
其中 #8056 涉及 **Iceberg equality delete MOR** 支持，虽然本次是关闭而非推进，但它反映出数据湖复杂读路径能力仍有潜在需求，建议后续评估是否需要重新拆分需求、重新发起更小粒度 PR。

---

## 健康度结论

今日 Apache Gluten 呈现出较健康的维护态势：  
- **正确性问题有修复落地**
- **CI/构建问题得到快速响应**
- **Spark 4.0 与 Iceberg 兼容性持续推进**
- **Velox 上游同步保持高频**

风险点主要在于：  
- 对 **Velox upstream 合并节奏** 的依赖依然较强  
- **时间类型与 Spark 4.0 兼容性** 仍在过渡阶段  
- 一些数据湖复杂能力需求存在被 stale 清理的情况，需防止“需求存在但实现被搁置”

总体判断：**项目活跃、主线明确、基础设施与兼容性并行推进，健康度良好。**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-04-04）

## 1. 今日速览

过去 24 小时内，Apache Arrow 社区共出现 **33 条动态**：**14 条 Issue 更新**、**19 条 PR 更新**，整体活跃度处于**中高位**，但以 **CI/兼容性修复、语言绑定完善、历史积压清理** 为主，而非大规模核心引擎特性落地。  
Issue 侧呈现出明显的“**存量清理**”特征：14 条中有 **7 条关闭**，且多为带 `stale-warning` 的历史 enhancement；这说明维护者正在持续压缩老旧需求池。  
PR 侧则更偏向**工程化与发布链路建设**，尤其集中在 **Flight SQL ODBC Windows 构建/签名流程**、**R/CRAN 合规**、**Python 类型支持补齐** 以及 **C++/压缩兼容性**。  
今天没有新版本发布，因此对终端用户影响更直接的变化主要来自**已关闭修复**和**待审 PR 中显现的路线图信号**。  
整体来看，项目健康度良好：**问题响应存在、修复闭环清晰，但核心功能类演进节奏偏稳健**。

---

## 2. 项目进展

以下为今日值得关注的已合并/关闭 PR 与其意义。

### 2.1 MATLAB CI 权限故障已完成修复闭环
- **PR**: #49650 `GH-49611: [MATLAB] MATLAB workflow failing due to action permission error`  
  链接: apache/arrow PR #49650
- **对应 Issue**: #49611  
  链接: apache/arrow Issue #49611

**进展说明：**  
MATLAB 工作流自 3 月 20 日起因 GitHub Actions 权限策略变更而“静默失败”，属于典型的**CI 基础设施故障**。该问题已由 PR #49650 关闭，说明维护者已经恢复 MATLAB 相关自动化校验链路。

**影响分析：**
- 对查询引擎功能本身没有直接新增，但对 **跨语言绑定质量保障** 很关键。
- 若 MATLAB CI 长时间不可用，会使 MATLAB 绑定在依赖升级或接口变更时缺乏回归保护，增加发布风险。
- 该修复体现了 Arrow 对多语言生态的一贯维护力度。

---

### 2.2 Python 测试基线更适配发行版现实环境
- **PR**: #49645 `GH-49295: [Python] Remove "mimalloc" from mandatory_backends`  
  链接: apache/arrow PR #49645

**进展说明：**  
该 PR 已关闭，核心是把 `mimalloc` 从 Python 测试中的 `mandatory_backends` 中移除。原因是某些发行版（如 Debian）默认禁用了 mimalloc，导致 PyArrow 测试出现**非功能性失败**。

**影响分析：**
- 这是典型的**可移植性/打包兼容性修复**。
- 对存储引擎能力没有直接增强，但降低了下游发行版、Linux 包维护者的集成摩擦。
- 有利于 PyArrow 在“不同 allocator 配置”的环境中保持更稳定的 CI 和打包体验。

---

### 2.3 大量 Rust / DataFusion 历史 PR 被集中关闭，释放维护噪音
- **PR**: #9527, #9215, #9497, #9010, #9642, #9534, #9772  
  链接分别为:  
  - apache/arrow PR #9527  
  - apache/arrow PR #9215  
  - apache/arrow PR #9497  
  - apache/arrow PR #9010  
  - apache/arrow PR #9642  
  - apache/arrow PR #9534  
  - apache/arrow PR #9772

**进展说明：**  
这些 PR 多创建于 2020-2021 年，覆盖 Rust Arrow / DataFusion 的表达式复制优化、数组切片访问器、CSV 性能优化、schema inference、Kleene 布尔核等方向，今天集中进入 closed 状态。

**影响分析：**
- 从日报角度，这并不代表这些功能今天刚刚交付，更可能是**历史遗留 PR 的归档/清理**。
- 对维护者是积极信号：减少过期 PR 对 triage 和 review 的干扰。
- 对用户需谨慎解读：**不应视为今天 DataFusion 新能力集中落地**，而应视为仓库治理动作。

---

## 3. 社区热点

### 3.1 MATLAB CI 故障是今日最明确、最具即时性的稳定性事件
- **Issue**: #49611 `[MATLAB][CI] MATLAB workflow failing due to action permission error`  
  评论数: 4  
  链接: apache/arrow Issue #49611
- **PR**: #49650  
  链接: apache/arrow PR #49650

**技术诉求分析：**  
该问题本质不是算法缺陷，而是**企业仓库 Actions 白名单/权限策略** 与第三方 action 使用之间的冲突。  
背后的诉求是：Arrow 作为多语言、多平台项目，需要 CI 依赖尽量**可控、白名单兼容、可持续运行**。这类问题常见于安全策略收紧后，对外部 action 的使用约束增强。

---

### 3.2 Flight SQL ODBC Windows 发布链路继续推进，显示企业接入优先级较高
- **PR**: #49585 `DRAFT: set up static build of ODBC FlightSQL driver`  
  链接: apache/arrow PR #49585
- **PR**: #49603 `Windows CI to Support ODBC DLL & MSI Signing`  
  链接: apache/arrow PR #49603

**技术诉求分析：**  
两条 PR 都围绕 **Flight SQL ODBC 驱动** 展开，重点不是 SQL 语义本身，而是**Windows 平台下的构建、签名、交付**。这反映出：
- Arrow/Flight SQL 正在从“可用”走向“可发布、可企业部署”；
- ODBC 仍是 BI 工具、企业分析栈的重要接入层；
- Windows DLL/MSI 签名是进入企业终端环境的必要条件，说明项目正在补齐**分发与合规**能力，而不只是开发者功能。

---

### 3.3 R 生态围绕 CRAN 合规与元数据能力持续活跃
- **PR**: #49653 `[R] R non-API calls reported on CRAN`  
  链接: apache/arrow PR #49653
- **PR**: #49655 `[R][CI] Add check for non-API calls onto existing r-devel job`  
  链接: apache/arrow PR #49655
- **PR**: #49631 `[R] Field-level metadata`  
  链接: apache/arrow PR #49631

**技术诉求分析：**
- 一类诉求是 **生态合规**：及时发现 CRAN 检查中的 non-API call，避免发布受阻。
- 另一类诉求是 **类型系统/Schema 表达能力增强**：R 侧补齐 field-level metadata，缩小与 Python 等绑定之间的能力差距。
- 这说明 Arrow 对 R 用户不只是“读写数据”，而是在推进更完整的 **schema-preserving 分析工作流**。

---

### 3.4 Python deprecate feather 的讨论值得关注
- **PR**: #49590 `[Python] deprecate feather python`  
  链接: apache/arrow PR #49590

**技术诉求分析：**  
该 PR 指向一个清晰方向：**Feather V2 已等价于 Arrow IPC file format**，单独维护 `pyarrow.feather` 模块的必要性下降。  
背后的技术诉求是：
- 降低 API 重复；
- 将用户心智统一到 IPC；
- 为后续文档、维护、兼容测试减负。  
这类 deprecation 通常影响面较大，建议用户尽早关注迁移路径。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1. MATLAB CI 全量失效，已修复
- **Issue**: #49611  
  链接: apache/arrow Issue #49611
- **Fix PR**: #49650（已关闭）  
  链接: apache/arrow PR #49650

**问题描述：**  
MATLAB workflow 因 action 权限错误无法启动，且一度“静默失败”。  
**严重性判断：高。**  
虽然不影响核心 C++/Python 引擎运行，但会导致 MATLAB 绑定缺失回归保护。  
**状态：已修复。**

---

### P1. Hadoop 兼容性风险：LZ4 Hadoop Codec 大块压缩可能在 JVM 侧解压失败
- **PR**: #49642 `[C++] Fix Lz4HadoopCodec to split large blocks for Hadoop compatibility`  
  链接: apache/arrow PR #49642

**问题描述：**  
当前 `Lz4HadoopCodec::Compress` 将整个输入写成单个 Hadoop framed LZ4 block；而 Hadoop `Lz4Decompressor` 每块默认只有固定 256 KiB 输出缓冲，导致大块数据在 JVM 侧可能触发 `LZ4Exception`。  
**严重性判断：高。**  
这是明确的**跨系统互操作性问题**，可能影响 Arrow 与 Hadoop/JVM 生态的数据交换稳定性。  
**状态：已有 fix PR，待审。**

---

### P2. parquet_scan 参数校验错误，影响 CLI 体验与可诊断性
- **PR**: #49540 `[C++][Parquet] Fix argument count check in parquet_scan`  
  链接: apache/arrow PR #49540

**问题描述：**  
无参数运行 `parquet-scan` 时，本该打印用法说明，却因 `argc < 1` 恒为假而触发误导性的 IOError。  
**严重性判断：中。**  
不影响查询正确性，但损害工具可用性与故障定位体验。  
**状态：修复 PR 待处理。**

---

### P2. R 在 CRAN 报告 non-API calls，已进入修复与预防阶段
- **PR**: #49653  
  链接: apache/arrow PR #49653
- **PR**: #49655  
  链接: apache/arrow PR #49655

**问题描述：**  
R 包存在 CRAN 报告的 non-API calls，需要替换并纳入 CI 持续检测。  
**严重性判断：中。**  
主要影响发布合规性，而不是运行期查询正确性。  
**状态：一条修复、一条补 CI，均在进行中。**

---

### P3. Python 测试对 mimalloc 的强依赖不适合部分发行版，已关闭修复
- **PR**: #49645  
  链接: apache/arrow PR #49645

**问题描述：**  
在 Debian 等禁用 mimalloc 的环境里，PyArrow 测试会失败。  
**严重性判断：中低。**  
属于环境兼容性问题。  
**状态：已修复。**

---

## 5. 功能请求与路线图信号

### 5.1 Ruby 写入器 benchmark 新增，性能基建有望进入下一轮迭代
- **Issue**: #49656 `[Ruby] Add benchmark for writers`  
  链接: apache/arrow Issue #49656
- **PR**: #49657 `[Ruby] Add benchmark for writers`  
  链接: apache/arrow PR #49657

**判断：较大概率纳入近期版本。**  
同日开 Issue、提 PR，说明需求已快速进入实现。其目标虽不是直接新增存储格式，但对 **file writer / streaming writer 性能回归监控** 很重要。  
这类 benchmark 基建通常是后续优化工作的前置条件。

---

### 5.2 Python DictionaryArray 对 `large_string` / `large_binary` 的支持正在补齐
- **PR**: #49658  
  链接: apache/arrow PR #49658

**判断：较大概率进入下一版本。**  
该 PR 解决 Python 序列转 `DictionaryArray` 时对大值类型支持缺失的问题，属于**类型系统完整性增强**。  
对处理超大文本、二进制 payload 的分析场景尤其有意义。

---

### 5.3 R Field-level metadata 是较强的接口能力补齐信号
- **PR**: #49631  
  链接: apache/arrow PR #49631

**判断：值得重点关注。**  
一旦合入，R 侧在 schema 元数据表达上会更接近 Python/C++，有利于：
- 跨语言 schema 传递；
- 数据治理标签；
- 下游序列化与语义保真。  
这是典型的**分析型数据交换能力完善**。

---

### 5.4 Flight SQL ODBC 静态构建与签名链路，指向更成熟的企业连接器交付
- **PR**: #49585  
  链接: apache/arrow PR #49585
- **PR**: #49603  
  链接: apache/arrow PR #49603

**判断：中期路线图信号明显。**  
这类 PR 不直接增加 SQL 语法能力，但会提升 Flight SQL 作为**企业 BI / SQL 客户端入口**的落地可行性。  
对 Arrow 在分析平台中的“连接层”价值是加分项。

---

### 5.5 历史 enhancement 中仍可见潜在路线图方向
以下 Issue 虽然今天多带 `stale-warning`，但从需求本身看仍具参考价值：

- **#31998** `[C++] Add support for sorting to the Substrait consumer`  
  链接: apache/arrow Issue #31998  
  指向 Arrow 执行引擎对 **Substrait 排序关系** 的支持补齐，属于查询计划兼容性增强。

- **#31976** `[C++] Adding Suffixes support for Substrait-Join`  
  链接: apache/arrow Issue #31976  
  指向 Join 结果列冲突处理的能力表达，关系到 Substrait 与 Arrow 语义对齐。

- **#31974** `[C++][Python] Read ACID Hive tables`  
  链接: apache/arrow Issue #31974  
  指向 Hive 3 默认 ACID 表读取能力，若未来推进，将是对湖仓/数仓生态互通的重要补充。

- **#31975** `[R] Detect compression by magic number where possible`  
  链接: apache/arrow Issue #31975  
  指向更稳健的压缩检测策略，提升用户体验与格式识别准确度。

---

## 6. 用户反馈摘要

结合今日 Issue/PR 内容，可以提炼出几类真实用户痛点：

### 6.1 用户最在意的是“跨环境可用”，而不仅是单机功能正确
- MATLAB CI 权限问题说明，用户依赖的不只是代码本身，还包括**自动化验证是否持续有效**。
- Python `mimalloc` 事件反映了发行版、打包器、系统 allocator 差异会真实影响用户落地。

相关链接：
- apache/arrow Issue #49611
- apache/arrow PR #49645

---

### 6.2 企业用户关注连接器交付质量，而不只是协议设计
- Flight SQL ODBC 相关 PR 强调静态构建、Windows 签名、MSI 产物，表明实际采用方往往需要**可安装、可审计、可签名**的软件包。
- 这类需求通常来自 BI/数据平台接入场景，而非纯研发测试。

相关链接：
- apache/arrow PR #49585
- apache/arrow PR #49603

---

### 6.3 用户希望语言绑定具备一致的 schema 与类型表达能力
- R 的 field-level metadata、Python 的 large_string / large_binary DictionaryArray 支持，都是“**绑定能力对齐**”诉求。
- 对真实生产用户来说，跨语言切换时 API/语义不一致会显著提升学习成本和出错率。

相关链接：
- apache/arrow PR #49631
- apache/arrow PR #49658

---

### 6.4 用户对工具可诊断性和兼容性细节很敏感
- `parquet-scan` 参数检查问题虽小，但说明用户希望 CLI 工具在误用时给出**直接、可操作的错误信息**。
- Hadoop LZ4 兼容性问题则表明，Arrow 被用于更复杂的数据交换链路，单侧实现“理论正确”还不够，必须考虑对端系统限制。

相关链接：
- apache/arrow PR #49540
- apache/arrow PR #49642

---

## 7. 待处理积压

以下为今日值得维护者重点关注的长期未决或刚显现但影响较大的事项。

### 7.1 Substrait 排序支持长期未推进
- **Issue**: #31998 `[C++] Add support for sorting to the Substrait consumer`  
  创建于 2022-05-25，今日仍为 OPEN，且带 `stale-warning`  
  链接: apache/arrow Issue #31998

**关注原因：**  
如果 Arrow 执行引擎具备排序能力，但 Substrait consumer 无法消费 sort relation，就会形成**计划表达与执行能力脱节**。  
对基于 Substrait 的跨引擎互操作而言，这是比较关键的缺口。

---

### 7.2 Substrait Join suffix 支持仍在积压
- **Issue**: #31976 `[C++] Adding Suffixes support for Substrait-Join`  
  链接: apache/arrow Issue #31976

**关注原因：**  
Join 列名冲突处理是 SQL/关系代数落地中的常见问题。  
该需求牵涉 Arrow-Substrait 接口暴露方式，虽然可能受制于 Substrait 规范本身，但长期悬而未决会限制复杂查询计划兼容。

---

### 7.3 ACID Hive 表读取仍停留在需求层
- **Issue**: #31974 `[C++][Python] Read ACID Hive tables`  
  链接: apache/arrow Issue #31974

**关注原因：**  
Hive 3 默认 ACID 表这一背景意味着它不是边缘需求。  
若 Arrow 继续强化湖仓互通，这一能力与 Iceberg/Delta/Hudi 周边生态互操作思路有一定战略关联，值得重新评估优先级。

---

### 7.4 C++ 编译告警与文档/易用性类问题虽小，但长期 stale 反映治理压力
- **Issue**: #31994 `[C++] Unsuppress -Wno-return-stack-address`  
  链接: apache/arrow Issue #31994
- **Issue**: #31999 `[R] Binding for between() is in dplyr-funcs-type.R`  
  链接: apache/arrow Issue #31999
- **Issue**: #31975 `[R] Detect compression by magic number where possible`  
  链接: apache/arrow Issue #31975

**关注原因：**  
这些问题不一定紧急，但长期 `stale-warning` 说明社区在**小型工程改进**上的处理吞吐仍有限。  
适合通过 `good-first-issue`、领域维护者轮值等方式加速收敛。

---

## 8. 总结判断

今天的 Apache Arrow 更像是在进行一次**工程质量与仓库治理日**，而不是核心特性爆发日。  
积极面在于：
- MATLAB CI 故障已快速闭环；
- Python/R/Ruby/C++ 多语言栈都在推进；
- Flight SQL ODBC 的企业交付链路在继续完善；
- 历史 Issue/PR 有明显清理动作。

需要持续观察的点在于：
- Substrait、Hive ACID、类型系统补齐等路线图需求仍存在积压；
- 一些高价值 PR 还停留在 review/change review 阶段；
- 当前活跃度虽不低，但对“分析查询能力新增”的直接产出相对有限。

**项目健康度评价：稳健偏积极。** 若未来几天能推动 #49642、#49658、#49631、#49603 等 PR 继续前进，Arrow 在**互操作性、语言一致性、企业集成成熟度**上会有更明显提升。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*