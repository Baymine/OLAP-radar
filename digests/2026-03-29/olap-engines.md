# Apache Doris 生态日报 2026-03-29

> Issues: 8 | PRs: 50 | 覆盖项目: 10 个 | 生成时间: 2026-03-29 01:43 UTC

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

# Apache Doris 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时，Apache Doris 保持较高开发活跃度：**Issues 更新 8 条，PR 更新 50 条**，其中 **23 条待合并、27 条已合并或关闭**。  
从变更结构看，今天的工作重点仍集中在 **查询/执行层修复、外表与湖仓兼容、存储与缓存稳定性、内存优化** 四个方向。  
Issue 侧新增问题不多，但关闭了多条长期 stale 工单，说明维护团队在持续清理积压；与此同时，若干新 PR 直指 **Parquet、Iceberg、Paimon、RPC、FileCache、内存控制** 等核心能力，项目整体健康度偏积极。  
值得注意的是，今天没有新版本发布，因此当前信号更多体现为 **下一轮 4.1 / 5.0 迭代的功能收敛与稳定性打磨**。

---

## 2. 项目进展

### 2.1 今日已合并/关闭的重要 PR

#### 1) 构建与编译兼容性修复
- **PR #61836** `[fix](build) Fix compilation errors with implicit conversions and unnecessary virtual keywords`  
  链接: https://github.com/apache/doris/pull/61836  
  进展解读：修复了编译阶段的隐式转换告警、GCC/Clang 参数兼容问题，以及若干不必要的 virtual 声明。  
  价值：这类修复虽然不直接影响查询功能，但对 **多编译器环境、CI 稳定性、开发者构建体验** 很关键，属于工程质量提升。

#### 2) File Cache 热点计数内存增长问题修复
- **PR #61834** `branch-4.1: [fix](filecache) reclaim expired tablet hotspot counters and compact sparse shards`  
  链接: https://github.com/apache/doris/pull/61834  
  进展解读：针对 tablet hotspot 统计结构长期驻留、历史 deque 与 shard map 膨胀导致的内存增长问题进行了修复。  
  价值：这是典型的 **后台元数据/缓存统计内存泄漏式增长** 问题，修复后有助于长时间运行集群的内存稳定性，尤其适合冷热分层、远端缓存场景。

#### 3) File Cache 局部命中与 LRU 更新机制修复
- **PR #61812** `branch-4.1: [fix](filecache) add async lru update machanism and fix partial hit in cache reader`  
  链接: https://github.com/apache/doris/pull/61812  
  进展解读：修复 `CachedRemoteFileReader` 在 direct partial hit 后后续遍历位置和计数错误的问题，并引入异步 LRU 更新。  
  价值：同时改善了 **查询正确性/回退路径开销** 与 **读路径上的缓存维护成本**，对对象存储与远端文件缓存性能有直接帮助。

#### 4) SQL 解析/语义层 bug 修复
- **PR #61813** `[fix](fe) Fix duplicate RelationId bug caused by subquery in simple case when`  
  链接: https://github.com/apache/doris/pull/61813  
- **PR #61830** `branch-4.0: [fix](fe) ... #61813`  
  链接: https://github.com/apache/doris/pull/61830  
  进展解读：修复了 simple CASE 表达式中包含子查询时，FE 解析阶段重复复用同一子查询节点导致 `RelationId` 重复的问题。  
  价值：这是 **查询正确性与 SQL 兼容性** 相关修复，说明 Doris 在复杂表达式和 Nereids/逻辑计划构建上仍在持续补强。

#### 5) FileCache 与 packed file 路径兼容性修复
- **PR #61683** `[fix](filecache) pass tablet_id through FileReaderOptions instead of parsing from path`  
  链接: https://github.com/apache/doris/pull/61683  
  进展解读：避免在启用 `enable_packed_file` 时，从文件路径解析 tablet_id 失效的问题。  
  价值：这是 **存储层与文件组织格式演进** 下的兼容修复，能减少远端读取异常，提升 packed small file 场景稳定性。

#### 6) 递归 CTE 后端 pick 关闭
- **PR #61806** `[Chore](pick) rec cte be part`  
  链接: https://github.com/apache/doris/pull/61806  
  进展解读：递归 CTE 的 BE 部分 pick 工作关闭，结合仍在进行中的 FE PR，说明该能力正进入收尾整合阶段。  
  价值：这是 Doris 在 **高级 SQL 能力** 上的重要演进信号。

#### 7) Parquet INT96 时间戳写入修复已进入分支传播
- **PR #61839** `branch-4.1: [fix](parquet)fix parquet write timestamp int96 type. (1/2)`  
  链接: https://github.com/apache/doris/pull/61839  
  进展解读：表明 Parquet 时间戳兼容性修复已开始向 4.1 分支传播。  
  价值：对与 Spark/Hive/老生态互操作时仍使用 INT96 的场景尤其重要。

#### 8) Catalog 结构解耦重构
- **PR #61816** `[refactor](catalog) decouple Column from Non-essential classes`  
  链接: https://github.com/apache/doris/pull/61816  
  进展解读：属于内部结构解耦与模型清理。  
  价值：为后续 **Catalog 扩展、元数据演进、代码可维护性** 打基础。

---

## 3. 社区热点

> 由于提供的数据中评论数未完整给出，以下“热点”依据更新频率、标签状态、技术影响面和是否进入 reviewed/approved 阶段综合判断。

### 热点 1：全局单调递增 TSO
- **PR #61199** `[feature](tso) Add global monotonically increasing Timestamp Oracle(TSO)`  
  链接: https://github.com/apache/doris/pull/61199  
  技术诉求分析：  
  这是今天最值得关注的长期功能型 PR 之一。TSO 通常意味着系统正朝着 **更强事务时序能力、跨节点全局有序时间戳、潜在多表/多分区一致性增强** 的方向演进。对 OLAP 数据库来说，这可能支撑更复杂的 **事务提交顺序控制、增量消费、CDC 协调、跨组件一致性语义**。  
  路线图信号：已打上 `meta-change` 和 `dev/5.0.x`，高度可能属于 **5.0 级别战略能力**。  

### 热点 2：递归 CTE 支持持续推进
- **PR #61283** `[Feature](cte) support recursive cte fe part`  
  链接: https://github.com/apache/doris/pull/61283  
- **PR #61806** `[Chore](pick) rec cte be part`  
  链接: https://github.com/apache/doris/pull/61806  
  技术诉求分析：  
  递归 CTE 是 SQL 标准兼容和复杂层级查询的重要能力，常用于 **组织树、路径遍历、图状依赖、递归展开**。从 FE/BE 分拆推进来看，团队正在处理的不只是 parser，而是 **计划构建、执行模型、终止条件和资源控制** 等完整链路问题。  
  路线图信号：若 FE 部分近期完成，可能在 4.x 后续小版本或 5.0 中作为高级 SQL 能力落地。

### 热点 3：湖仓生态兼容持续增强
- **PR #61398** `[feat](iceberg) Support iceberg v3 row lineage`  
  链接: https://github.com/apache/doris/pull/61398  
- **PR #61848** `branch-4.1:[feat](iceberg) Support iceberg v3 row lineage`  
  链接: https://github.com/apache/doris/pull/61848  
- **PR #61513** `[fix](fe) Fix Paimon JDBC driver registration for JNI scans`  
  链接: https://github.com/apache/doris/pull/61513  
  技术诉求分析：  
  这组 PR 清晰表明 Doris 正持续加强对 **Iceberg / Paimon / 外部元数据与文件格式** 的接入质量。Iceberg v3 row lineage 属于较新的规范能力，体现 Doris 不只是“能读”，而是在向 **更完整语义支持** 迈进。  
  路线图信号：4.1 分支已有 backport，说明这类兼容增强很可能较快进入实际可用版本。

### 热点 4：执行与 RPC 正确性问题
- **PR #61782** `[fix](rpc) Fix AutoReleaseClosure data race with callback reuse`  
  链接: https://github.com/apache/doris/pull/61782  
  技术诉求分析：  
  该 PR 关注 callback 复用下的 data race，属于并发与异步回调时序问题。其影响往往隐蔽，但一旦命中，可能表现为 **错误状态读取、偶发失败、难复现异常**。  
  这类修复对大规模并发查询和数据传输链路稳定性很重要。

### 热点 5：内存控制持续收紧
- **PR #61821** `[opt](memory) limit max block bytes per batch`  
  链接: https://github.com/apache/doris/pull/61821  
- **Issue #58781** `[Enhancement] optimize memory in load(insert/delete/update) path`（已关闭）  
  链接: https://github.com/apache/doris/issues/58781  
  技术诉求分析：  
  导入/Load 路径在宽表、嵌套类型、大行记录场景下的内存峰值控制，是分析型引擎长期痛点。新 PR 与此前 enhancement 收尾形成呼应，说明团队正在系统性压缩 **批次内 block 体积、flush/memtable 扩张、写入路径内存尖峰**。

---

## 4. Bug 与稳定性

以下按潜在严重程度排序。

### P1：Compaction 过程中状态变更导致无法继续 compact
- **Issue #61823** `[Bug] compaction 过程中如果有 balance 或者其他能导致state change 。导致无法compaction`  
  链接: https://github.com/apache/doris/issues/61823  
  状态：Open  
  影响分析：  
  问题描述指向 compaction 执行期间若发生 balance 或其他 state change，可能导致 compaction 无法完成。这直接关系到 **存储层后台维护、版本收敛、读放大/写放大控制**，若普遍存在，会对长期运行的 tablet 健康造成实质影响。  
  是否已有 fix PR：**暂无明确对应 fix PR**。  
  建议关注：高优先级，需要确认是否影响所有版本与是否能造成持续积压。

### P1：RPC callback 复用引发 data race
- **PR #61782** `[fix](rpc) Fix AutoReleaseClosure data race with callback reuse`  
  链接: https://github.com/apache/doris/pull/61782  
  状态：Open  
  影响分析：  
  该问题会在 `call()` 触发新 RPC 时污染旧 RPC 的 `response_` 和 `cntl_` 读取，属于典型并发正确性缺陷。  
  是否已有 fix PR：**有，待合并**。  
  风险：可能表现为偶发错误、状态误判、难定位的线上不稳定。

### P1：Native/JNI 混用 FileScanner 时谓词过滤缺失
- **PR #61802** `[fix](scan) Fix missing predicate filter when Native and JNI readers are mixed in FileScanner`  
  链接: https://github.com/apache/doris/pull/61802  
  状态：Open  
  影响分析：  
  在 Paimon 等外表扫描中，如一个 `FileScanner` 连续处理 Native split 和 JNI split，且存在不可下推谓词，可能出现过滤缺失。  
  这是 **查询结果正确性问题**，优先级应较高。  
  是否已有 fix PR：**有，待合并**。

### P1：Parquet 写 INT96 时间戳兼容性问题
- **PR #61832** `[fix](parquet)fix parquet write timestamp int96 type. (2/2)`  
  链接: https://github.com/apache/doris/pull/61832  
- **PR #61847** `branch-4.1:[fix](parquet)...`  
  链接: https://github.com/apache/doris/pull/61847  
  状态：Open  
  影响分析：  
  涉及 Parquet 写出 timestamp INT96 类型的兼容修复。INT96 在现代标准中不算理想，但仍广泛存在于历史生态中，因此该问题会影响 **跨引擎互操作**。  
  是否已有 fix PR：**有，主线和分支均在推进**。

### P2：远端 rowset 删除失败 / 路径存在性检查失败
- **Issue #56605** `[Bug] failed to delete remote rowset failed to check path existence`  
  链接: https://github.com/apache/doris/issues/56605  
  状态：Open  
  影响分析：  
  用户使用带 Kerberos 的远端 HDFS 冷存储场景，删除 remote rowset 时失败。  
  这类问题通常影响 **冷热分层、对象/HDFS 冷数据生命周期管理、空间回收**。  
  是否已有 fix PR：**未见直接对应 PR**。

### P2：Azure 对象存储修改时间戳错误
- **PR #61790** `[fix](azure) Fix incorrect modification timestamps in AzureObjStorage`  
  链接: https://github.com/apache/doris/pull/61790  
  状态：Open  
  影响分析：  
  三条代码路径中时间戳单位/转换错误，会导致对象修改时间被错误读取。  
  这会影响 **文件枚举、增量判断、缓存/同步逻辑** 的正确性。  
  是否已有 fix PR：**有，已 reviewed/approved，值得尽快合并**。

### P2：分区 near-limit 指标语义错误
- **PR #61845** `[fix](metric) Change partition near-limit metrics from counters to gauges`  
  链接: https://github.com/apache/doris/pull/61845  
  状态：Open  
  影响分析：  
  原先用 counter 记录近上限状态，会导致条件解除后指标仍持续累加，误导运维判断。  
  这不直接影响查询结果，但影响 **监控可信度与容量预警准确性**。  
  是否已有 fix PR：**有**。

### P2：Segment 文件缺失时读写直接报错
- **PR #61844** `[opt](segment) Ignore not-found segments in query and load paths`  
  链接: https://github.com/apache/doris/pull/61844  
  状态：Open  
  影响分析：  
  当 segment 文件因 GC 或外部原因丢失时，新方案默认跳过而非直接失败。  
  这提高了系统韧性，但也带来一个取舍：**“容错继续” 与 “暴露底层异常”** 之间需要明确预期。默认 `true` 值值得进一步审视。  
  是否已有 fix PR：**有**。

### P3：S3 brace expansion 存在 OOM 风险
- **PR #61843** `[fix](s3) Add limit-aware brace expansion and fix misleading glob metrics`  
  链接: https://github.com/apache/doris/pull/61843  
  状态：Open  
  影响分析：  
  `{1..100000}` 等模式可能在路径展开前造成大量内存分配和 CPU 消耗。  
  这是典型的 **外部输入导致资源失控** 风险。  
  是否已有 fix PR：**有**。

---

## 5. 功能请求与路线图信号

### 1) 数据库/表增加 create_user 和 created_at 元信息
- **Issue #56486** `[Enhancement] add create_user and created_at for database and table in doris`  
  链接: https://github.com/apache/doris/issues/56486  
  判断：  
  这是典型的 **元数据治理/审计能力** 需求，适用于企业数据平台、多租户治理、对象生命周期追踪。  
  从 Doris 当前演进方向看，这类需求与 Catalog/权限治理是匹配的，但暂未见对应 PR，短期进入主版本的概率 **中等偏低**，更可能依赖社区推动。

### 2) SPLIT_BY_STRING 增加 limit 参数
- **PR #60892** `[feat](function) Add limit parameter support for SPLIT_BY_STRING`  
  链接: https://github.com/apache/doris/pull/60892  
  判断：  
  该能力贴近 MySQL/Spark/通用字符串函数使用习惯，可提升 SQL 易用性与兼容性。  
  已处于 reviewed 状态，**很可能纳入下一小版本**。

### 3) mmhash3_u64_v2 新函数
- **PR #61846** `[Enhancement](mmhash) Support mmhash3_u64_v2`  
  链接: https://github.com/apache/doris/pull/61846  
  判断：  
  新 hash 函数通常服务于 **分桶、去重、特征计算、兼容历史算法版本**。  
  若与文档 PR 同步推进，进入后续版本概率较高，但需看其与现有 hash 体系是否存在命名和兼容策略。

### 4) Iceberg v3 row lineage
- **PR #61398** / **PR #61848**  
  链接: https://github.com/apache/doris/pull/61398  
  链接: https://github.com/apache/doris/pull/61848  
  判断：  
  这是非常明确的路线图信号。支持 `_row_id` 和 `_last_updated_sequence_number` 等 lineage 列，说明 Doris 正把湖仓接入从“文件级兼容”提升到“表语义级兼容”。  
  **高概率进入 4.1 及后续版本**。

### 5) 递归 CTE
- **PR #61283**  
  链接: https://github.com/apache/doris/pull/61283  
  判断：  
  属于高级 SQL 能力补齐，社区价值高。  
  由于 FE/BE 都已有推进，**进入后续版本概率较高**，但需警惕执行资源控制与终止语义的边界条件。

### 6) CDC Stream TVF for MySQL / PostgreSQL
- **PR #61840** `branch-4.1: [Feature](tvf) Support cdc stream tvf for mysql and pg`  
  链接: https://github.com/apache/doris/pull/61840  
  判断：  
  这是面向实时摄取与外部变更订阅的重要能力，若主线已完成，此次分支 pick 表明它更接近实际交付。  
  对实时分析和同步链路用户来说意义较大。

### 7) Apache DataSketches 集成请求
- **Issue #56246** `[Feature] please Integrated with Apache Datasketches`  
  链接: https://github.com/apache/doris/issues/56246  
  判断：  
  虽然今天被 stale 关闭，但需求本身具有持续价值，面向 **近似去重、分位数、草图统计** 等典型 OLAP 场景。  
  当前未见对应新 PR，短期落地概率不高，但从分析型数据库方向看，这类能力未来仍有可能回归路线图。

---

## 6. 用户反馈摘要

### 1) 冷热分层与远端存储运维复杂度依然较高
- **Issue #56605**  
  链接: https://github.com/apache/doris/issues/56605  
  用户场景：使用带 Kerberos 的远端 HDFS 作为 cold storage。  
  反馈痛点：删除 remote rowset 时出现路径存在性检查失败，说明在 **安全认证 + 远端生命周期管理** 组合场景下，运维链路仍较脆弱。  
  含义：企业级部署中，用户越来越重视长期冷存储成本优化，而非仅关注热查询性能。

### 2) 存储后台任务与状态迁移之间存在耦合脆弱点
- **Issue #61823**  
  链接: https://github.com/apache/doris/issues/61823  
  用户场景：compaction 与 balance 并发发生。  
  反馈痛点：后台任务在状态切换时容易中断或失败。  
  含义：用户期待 Doris 在 **rebalance、compaction、GC、冷热迁移** 等后台动作并发时具备更强鲁棒性。

### 3) 企业用户对元数据审计能力有明确需求
- **Issue #56486**  
  链接: https://github.com/apache/doris/issues/56486  
  用户诉求：数据库、表对象记录创建人和创建时间。  
  含义：Doris 正被越来越多用作企业数据平台底座，用户已不满足于“能存、能查”，开始关注 **治理、可追踪、审计友好**。

### 4) 导入路径内存峰值仍是典型痛点
- **Issue #58781**、**PR #61821**  
  链接: https://github.com/apache/doris/issues/58781  
  链接: https://github.com/apache/doris/pull/61821  
  用户场景：insert/delete/update/load，尤其宽表和复杂类型。  
  反馈痛点：批处理内存膨胀、flush 阶段额外扩容。  
  含义：这说明 Doris 的使用面已涵盖更复杂 schema，内存治理仍是实际生产部署的重要体验指标。

---

## 7. 待处理积压

### 需要维护者重点关注的长期 Open Issue / PR

#### 1) 远端 rowset 删除失败
- **Issue #56605**  
  链接: https://github.com/apache/doris/issues/56605  
  现状：2025-09 创建，至今仍 Open，并被标记 stale。  
  风险：影响冷存储/远端存储场景的生产可用性，不宜长期悬而未决。

#### 2) branch-3.0 回归用例不稳定
- **PR #59199** `branch-3.0 [fix](regressionCase) fix unstable regression case for eager-agg`  
  链接: https://github.com/apache/doris/pull/59199  
  现状：2025-12 创建，仍 Open。  
  风险：长期未收敛的 regression case 往往意味着分支稳定性问题尚未彻底解决，建议明确是否仍需维护 3.0 分支上的该修复。

#### 3) Paimon JDBC 驱动注册修复
- **PR #61513**  
  链接: https://github.com/apache/doris/pull/61513  
  现状：影响 JNI scan 下系统表查询，属于外表兼容性修复。  
  风险：如果 Doris 持续加强湖仓生态接入，这类问题应尽快处理，否则用户会认为“接得上但不好用”。

#### 4) 递归 CTE FE 部分
- **PR #61283**  
  链接: https://github.com/apache/doris/pull/61283  
  现状：功能价值高，但仍未合并。  
  风险：若长期停留在 FE/BE 分离状态，容易导致能力长期“半完成”。

#### 5) 全局 TSO
- **PR #61199**  
  链接: https://github.com/apache/doris/pull/61199  
  现状：meta-change，影响面大。  
  风险：若评审周期过长，容易拖慢事务与一致性相关能力演进；建议尽早明确设计边界和版本目标。

---

## 8. 健康度结论

今天的 Apache Doris 呈现出比较健康的项目状态：

- **开发活跃度高**：50 条 PR 更新说明主线与分支并行推进节奏稳定。  
- **稳定性工作扎实**：FileCache、Azure、Parquet、RPC、Scanner、Build 等多个关键链路都有修复。  
- **功能方向清晰**：递归 CTE、Iceberg v3 lineage、CDC TVF、TSO 都释放出清晰路线图信号。  
- **仍需警惕的风险点**：后台 compaction 与 state change 的耦合、远端存储删除失败、查询正确性类 bug（扫描过滤缺失、并发 data race）应保持高优先级处理。

如果你愿意，我可以继续把这份日报再整理成：
1. **适合飞书/钉钉发送的简版晨报**，或  
2. **更偏技术管理层视角的周报格式**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**日期：2026-03-29**

---

## 1. 生态全景

过去 24 小时的社区动态表明，OLAP / 分析型存储引擎开源生态整体处于**高活跃、强分化、重稳定性收敛**阶段。  
一方面，ClickHouse、Doris、Iceberg、DuckDB 等项目持续推进查询正确性、湖仓兼容、对象存储、内存控制等核心能力；另一方面，Delta Lake、Velox、Gluten 等则更明显地围绕**执行内核、CDC、GPU、跨引擎集成**做深。  
从信号上看，行业竞争焦点已不再只是“谁跑得更快”，而是转向**语义正确性、对象存储成本可控、半结构化数据支持、云环境稳定性、跨格式互操作**。  
整体而言，这是一个从“功能扩张”逐步走向“生产级鲁棒性 + 生态协同”的阶段。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release 情况 | 当日重点方向 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 8 | 50 | 无 | 查询/执行修复、FileCache、Parquet/Iceberg/Paimon、内存优化 | **健康，活跃度高，稳定性收敛明显** |
| **ClickHouse** | 27 | 295 | **3 个版本发布** | Analyzer 正确性、执行管线、S3/对象存储、性能优化 | **非常健康，主线+稳定分支并进** |
| **DuckDB** | 11 | 24 | 无 | 执行器优化、外部文件缓存、类型系统、S3/ARM/时间回归 | **中上，核心推进稳定，但远程存储问题需继续收敛** |
| **StarRocks** | 1 | 9 | 无 | 外部表/数据湖集成、Schema 演进、共享存储、工具链升级 | **稳健，中等活跃，偏功能推进与分支维护** |
| **Apache Iceberg** | 6 | 24 | 无 | Flink/Spark 兼容、元数据正确性、文档/测试治理、云 catalog 稳定性 | **良好，生态型项目特征明显** |
| **Delta Lake** | 2 | 12 | 无 | Kernel-Spark CDC、Flink Sink、并发提交正确性 | **良好偏积极，但处于 stacked PR 堆叠期** |
| **Databend** | 1 | 1 | 无 | VARIANT cast 正确性、文档巡检 | **稳定但低活跃，偏基础维护日** |
| **Velox** | 0 | 9 | 无 | GPU Window/Cross Join、Join 正确性、Nimble IO 优化 | **健康，核心内核开发导向明显** |
| **Apache Gluten** | 1 | 3 | 无 | Velox 同步、Spark SQL 兼容、测试补强 | **稳健，依赖上游 Velox 节奏较强** |
| **Apache Arrow** | 17 | 6 | 无 | Linux ODBC、CI/构建、R Azure 支持、底层工具函数正确性 | **稳健，偏基础设施与多语言生态维护** |

### 活跃度观察
- **第一梯队（超高活跃）**：ClickHouse、Doris  
- **第二梯队（中高活跃）**：DuckDB、Iceberg  
- **第三梯队（中等活跃）**：StarRocks、Delta Lake、Velox、Arrow  
- **第四梯队（低活跃但仍有有效推进）**：Databend、Gluten

---

## 3. Apache Doris 在生态中的定位

### 3.1 相对优势
与同类 OLAP 引擎相比，**Apache Doris 当前的优势在于“数据库一体化能力 + 湖仓接入增强 + 工程稳定性同步推进”**：
- 相比 **ClickHouse**，Doris 在社区节奏上略弱，但在**统一 OLAP 数据库产品形态**、事务/TSO、递归 CTE、CDC TVF 等方向上展现出更明确的数据库能力补齐路线。
- 相比 **StarRocks**，Doris 今日动态覆盖面更广，尤其在 **FileCache、Parquet、Paimon、Iceberg、RPC、内存控制** 等底层链路上修复更密集，工程成熟度信号更强。
- 相比 **DuckDB**，Doris 更偏向**分布式服务端 OLAP 引擎**，在长期运行、冷热分层、后台 compaction、远端缓存等生产问题上积累更深。
- 相比 **ClickHouse / DuckDB** 的执行器或单机/分布式特化，Doris 更强调 **SQL 数据库体验 + 实时/离线一体 + 湖仓兼容**。

### 3.2 技术路线差异
Doris 当前技术路线较鲜明地落在以下组合上：
- **数据库内核化**：递归 CTE、全局 TSO、事务时序、SQL 正确性
- **湖仓兼容增强**：Iceberg v3 row lineage、Paimon JNI scan、Parquet INT96
- **远端存储/缓存稳定性**：FileCache、多层缓存、对象存储读路径
- **写入与内存治理**：load/insert/delete/update 路径内存压缩

这意味着 Doris 并不单纯追求“极致查询性能”，而是在往**通用企业级分析数据库底座**演进。

### 3.3 社区规模对比
从当日数据看：
- Doris：8 Issues / 50 PR  
- ClickHouse：27 Issues / 295 PR  
- DuckDB：11 Issues / 24 PR  
- StarRocks：1 Issue / 9 PR  

结论：
- **规模上 Doris 明显低于 ClickHouse，但显著高于 StarRocks，当日活跃度也高于 DuckDB。**
- 在中文开源 OLAP 阵营中，Doris 依然属于**第一梯队社区规模**，且主线与分支并行维护能力较强。
- 若看“数据库产品化成熟度 + 社区活跃度”的平衡，Doris 处于较有竞争力的位置。

---

## 4. 共同关注的技术方向

以下是多个项目同时涌现的共性需求与技术主题：

### 4.1 查询正确性与 Planner / Analyzer 稳定性
**涉及项目**：Doris、ClickHouse、DuckDB、Velox、Gluten  
**具体诉求**：
- Doris：CASE + 子查询 RelationId 修复、Native/JNI FileScanner 谓词缺失  
- ClickHouse：Analyzer / Planner 多个 correctness 问题、GROUPING、UNION ALL 标识符异常  
- DuckDB：struct filter、宏 + timestamptz 回归、复杂类型崩溃  
- Velox：counting join 合并正确性、Spark `collect_set` 语义回归  
- Gluten：`collect_list/collect_set` null 语义对齐 Spark  

**结论**：  
新一轮竞争焦点已转向**复杂 SQL 语义边界的稳定性**，不仅要快，还要在多引擎、多执行路径下结果一致。

---

### 4.2 湖仓格式与外表生态兼容
**涉及项目**：Doris、StarRocks、Iceberg、DuckDB、Arrow、ClickHouse  
**具体诉求**：
- Doris：Iceberg v3 row lineage、Paimon JDBC/JNI、Parquet INT96  
- StarRocks：Iceberg Parquet shredded VARIANT  
- Iceberg：Flink/Spark/ORC lineage、多云 catalog、Avro local-timestamp  
- DuckDB：Parquet VARIANT、S3 外部文件缓存  
- ClickHouse：DeltaLake 访问修复  
- Arrow：Azure / ODBC / 多语言云文件系统能力

**结论**：  
“能接入”已不是门槛，**是否支持更完整表语义、类型语义、lineage 和对象存储行为**才是下一阶段门槛。

---

### 4.3 对象存储 / 云环境 / 远程 IO
**涉及项目**：Doris、ClickHouse、DuckDB、Iceberg、Arrow、StarRocks  
**具体诉求**：
- Doris：FileCache、Azure 时间戳、远端 rowset 删除、冷存储 HDFS  
- ClickHouse：S3 PUT 激增、blob_storage_log 可观测性  
- DuckDB：S3 分区 COPY OOM、远程查询慢、外部文件缓存块对齐  
- Iceberg：ADLS 显式认证、Glue/Hive 提交正确性  
- Arrow：Azure Blob、AWS SDK / aws-lc 构建链  
- StarRocks：Composite Storage Volume 跨 bucket 分布

**结论**：  
对象存储已从“附加支持”变成主战场，重点正在从吞吐转向**请求成本、元数据一致性、缓存行为与认证可控性**。

---

### 4.4 内存管理与资源可控性
**涉及项目**：Doris、ClickHouse、DuckDB、Delta Lake、Velox  
**具体诉求**：
- Doris：limit max block bytes per batch、Load 路径内存优化  
- ClickHouse：低内存系统优化  
- DuckDB：operator_memory_limit、S3 COPY 内存不可控  
- Delta Lake：CDC admission limits  
- Velox：spill 优化、GPU 执行资源风险  

**结论**：  
资源治理已成为用户真实生产体验的核心指标，特别是在宽表、嵌套类型、流式写入、对象存储链路中。

---

### 4.5 半结构化数据 / VARIANT 类型能力
**涉及项目**：DuckDB、StarRocks、Databend、Doris、Iceberg  
**具体诉求**：
- DuckDB：C API VARIANT、Parquet VARIANT、复杂类型正确性  
- StarRocks：VARIANT 虚拟列读取  
- Databend：VARIANT cast to number  
- Doris：Paimon/Iceberg/Parquet 相关兼容  
- Iceberg：V3 lineage、加密 Avro、格式语义完善

**结论**：  
VARIANT / JSON / 嵌套类型已成为分析引擎“默认能力”，差别在于**原生类型化程度**和**跨格式一致性**。

---

## 5. 差异化定位分析

### 5.1 存储格式与湖仓关系

| 项目 | 定位侧重 |
|---|---|
| **Doris** | 数据库内核 + 湖仓接入增强，强调外表与本地存储并存 |
| **ClickHouse** | 自有存储模型强，逐步增强对象存储与外表兼容 |
| **DuckDB** | 文件/对象存储原生消费型分析引擎，嵌入式和数据湖分析突出 |
| **StarRocks** | 湖仓分析与共享存储架构强化，数据湖接入明显 |
| **Iceberg / Delta Lake** | 表格式层，不是查询引擎，聚焦元数据与跨引擎一致性 |
| **Arrow** | 数据交换层与多语言内存格式，不是完整 OLAP 数据库 |
| **Velox / Gluten** | 执行层基础设施，不直接提供完整存储产品 |
| **Databend** | 云原生分析数据库，但当日信号偏少 |

---

### 5.2 查询引擎设计差异

| 项目 | 查询/执行特点 |
|---|---|
| **Doris** | 分布式 MPP + 数据库语义强化，SQL 功能与执行稳定性并重 |
| **ClickHouse** | 极强执行优化与多版本维护能力，Analyzer 替换是主线 |
| **DuckDB** | 单机嵌入式 OLAP，引擎内聚，文件/类型系统灵活 |
| **StarRocks** | MPP + 湖仓一体，偏云数据平台场景 |
| **Velox** | 通用执行内核，强调可复用性与 GPU 扩展 |
| **Gluten** | Spark 加速层，依赖 Velox |
| **Iceberg / Delta** | 不负责主执行，负责格式和事务元数据协议 |

---

### 5.3 目标负载类型差异

| 项目 | 典型负载 |
|---|---|
| **Doris** | 实时分析、交互式 SQL、报表、数据平台底座 |
| **ClickHouse** | 大规模明细分析、日志/时序、超高吞吐 OLAP |
| **DuckDB** | 本地分析、Notebook、嵌入式 ETL、数据科学 |
| **StarRocks** | 湖仓分析、实时数仓、共享存储云部署 |
| **Iceberg / Delta** | 多引擎共享表、流批一体存储协议 |
| **Velox / Gluten** | 上层引擎执行加速 |
| **Arrow** | 数据交换、连接器、跨语言列式处理中间层 |

---

### 5.4 SQL 兼容性差异
- **Doris / ClickHouse / StarRocks**：都在补高级 SQL 能力，但 Doris 今日在递归 CTE、CASE 子查询、函数增强上更像“数据库兼容补齐”；ClickHouse 更集中在 Analyzer 替换带来的兼容修正。
- **DuckDB**：对 SQL 易用性、复杂类型、宏、ARRAY/UNNEST 的支持更贴近数据工程与交互分析。
- **Gluten / Velox**：SQL 兼容更多表现为对 Spark 语义对齐。
- **Iceberg / Delta / Arrow**：SQL 本身不是核心，更多服务于上层执行引擎。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 超高活跃 / 生态核心层
- **ClickHouse**
- **Apache Doris**

特点：
- PR 数量大
- 主线与稳定分支并进
- 大量 correctness + performance + release 并发推进
- 已具备成熟商业/生产生态牵引

#### 高活跃 / 快速迭代层
- **DuckDB**
- **Apache Iceberg**

特点：
- 社区热度高
- 用户反馈面广
- 仍有大量边界问题持续暴露
- 处于“能力快速扩张 + 生产经验回灌”阶段

#### 中等活跃 / 定向演进层
- **StarRocks**
- **Delta Lake**
- **Velox**
- **Arrow**

特点：
- 各有明确主线
- 不一定以 PR 数量取胜，但方向集中
- 要么做产品深挖，要么做底层能力平台化

#### 低活跃 / 稳态维护层
- **Databend**
- **Gluten**

特点：
- 当日活跃度不高
- 仍有关键修复和同步
- 更多体现为稳态推进而非爆发式演进

---

### 6.2 快速迭代 vs 质量巩固

**快速迭代阶段明显的项目**：
- ClickHouse：Analyzer 替换、性能优化、频繁 release
- DuckDB：文件缓存、VARIANT、内存控制、平台兼容
- Delta Lake：CDC stacked PR
- Velox：GPU 算子扩张
- Iceberg：Flink/Spark/V3 语义持续补齐

**质量巩固特征更明显的项目**：
- Doris：FileCache、RPC、Parquet、扫描正确性、内存控制
- Arrow：CI、构建、跨语言生态补齐
- Gluten：测试覆盖与语义对齐
- StarRocks：分支维护 + schema / 存储演进

结论：  
**Doris 当前最像“高速开发中的成熟数据库项目”**：既在补高级能力，又在大规模收敛生产稳定性。

---

## 7. 值得关注的趋势信号

### 趋势 1：对象存储正在成为分析引擎的“默认主战场”
不仅 Doris、ClickHouse、DuckDB、StarRocks 在强化对象存储路径，Iceberg / Arrow / Delta 也都在围绕云 catalog、Azure、S3、认证与提交一致性发力。  
**对架构师的启示**：未来选型不能只看查询性能，要重点评估对象存储下的缓存、请求成本、元数据提交、认证和容灾行为。

---

### 趋势 2：语义正确性比单点性能更受重视
多项目同时在修：
- Planner / Analyzer 正确性
- 聚合函数 null 语义
- 复杂类型过滤
- 分布式执行边界
- 并发提交 race

**对数据工程师的启示**：复杂 SQL、CDC、半结构化查询将更可用，但升级时必须做回归，尤其是 GROUPING、CTE、IN 子查询、嵌套类型、分布式别名等边界语句。

---

### 趋势 3：半结构化数据能力正在从“兼容 JSON”走向“原生类型系统”
DuckDB、Databend、StarRocks、Iceberg 都在加强 VARIANT / lineage / shredded column / cast 语义。  
**参考价值**：数据平台设计中，未来 schema-on-read 与半结构化列分析会更普遍，选型时应关注原生类型支持深度，而非只看 JSON 函数数量。

---

### 趋势 4：数据库与表格式的边界继续清晰化，但协同更紧密
- Doris / ClickHouse / StarRocks：继续增强数据库产品能力
- Iceberg / Delta：持续做格式层与事务语义
- Arrow / Velox：做交换层和执行层基础设施

**参考价值**：现代分析架构正在形成“数据库引擎 + 开放表格式 + 通用执行/交换层”的分层组合，而不是单体系统包打天下。

---

### 趋势 5：高级 SQL 与实时语义正成为 OLAP 引擎新竞争点
递归 CTE、CDC TVF、全局 TSO、CDC streaming、Spark 语义兼容、Deletion Vector 协同都表明：  
下一阶段 OLAP 竞争将不仅是离线分析，而是**实时摄取、复杂 SQL、跨系统一致性**。

**对架构师的启示**：如果未来场景涉及实时入湖、增量订阅、跨引擎共享表，需优先关注 Doris、Delta Lake、Iceberg、StarRocks 等在事务/CDC/湖仓语义上的路线成熟度。

---

## 总结判断

从 2026-03-29 的动态看，开源 OLAP / 分析型存储生态正在进入一个新阶段：  
**基础性能竞争仍在继续，但主旋律已经转向生产级稳定性、对象存储适配、湖仓语义完整性、半结构化数据支持与跨引擎协同。**

对 **Apache Doris** 而言，其当前生态定位可以概括为：  
**“位于第一梯队的分布式分析数据库，兼具数据库内核演进能力与湖仓兼容扩张能力，正在从高性能 OLAP 引擎进一步走向企业级统一分析底座。”**

如果你愿意，我可以继续把这份横向报告整理成两种版本之一：  
1. **管理层 1 页简报版**  
2. **技术选型会可直接使用的表格化对比版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时内，ClickHouse 仓库保持**高强度活跃**：Issues 更新 27 条，PR 更新 295 条，并发布了 **3 个稳定/长期支持版本**，说明项目同时在推进主线开发、稳定分支维护和 LTS 保障。  
从问题分布看，今日关注点主要集中在 **Analyzer 相关正确性问题、执行管线稳定性、对象存储/S3 行为，以及 CI/Fuzzer 暴露出的崩溃类问题**。  
PR 侧则呈现出明显的“双轨并进”特征：一方面持续修复查询规划器、分布式执行、PREWHERE/IN 子查询等 correctness 问题；另一方面也在推进 **性能优化**（字符串键聚合预取、低内存系统优化、递归 CTE 索引下推）。  
整体评估：**项目健康度较高**，但 Analyzer 迁移与执行管线相关问题仍是当前最需要持续压降风险的技术区域。

---

## 2. 版本发布

过去 24 小时发布了 3 个版本：

- [v26.2.6.27-stable](ClickHouse/ClickHouse Release v26.2.6.27-stable)
- [v26.1.7.13-stable](ClickHouse/ClickHouse Release v26.1.7.13-stable)
- [v25.8.21.7-lts](ClickHouse/ClickHouse Release v25.8.21.7-lts)

### 版本解读

本次发布覆盖了：
- **26.2 稳定分支**
- **26.1 稳定分支**
- **25.8 LTS 分支**

这通常意味着维护者正在同步回补近期修复，尤其是：
- 查询分析器/规划器相关的正确性修复
- 执行管线稳定性问题
- 日志与可观测性增强
- 云/对象存储路径上的行为修正

### 破坏性变更与迁移注意事项

当前提供的数据中**未包含具体 release notes 内容**，因此无法确认是否存在明确的 breaking changes。基于今日活跃修复方向，升级时建议重点验证：

1. **Analyzer 行为差异**
   - 涉及 `GROUPING`、`SELECT * REPLACE`、参数化视图、JOIN 类型推导、别名冲突、分布式查询常量 CAST 等。
   - 若线上仍依赖旧 analyzer 行为，建议升级后回归包含以下模式的 SQL：
     - `GROUPING SETS / ROLLUP / CUBE`
     - 复杂别名与子查询嵌套
     - `Distributed` 表上的函数下推
     - 参数化视图
   - 相关链接：  
     [#82943](ClickHouse/ClickHouse Issue #82943)  
     [#66307](ClickHouse/ClickHouse Issue #66307)  
     [#71830](ClickHouse/ClickHouse Issue #71830)  
     [#75005](ClickHouse/ClickHouse Issue #75005)

2. **对象存储与 S3 相关负载**
   - 若使用 TTL 冷热分层到 S3，建议关注 PUT/GET 请求数与账单波动。
   - 相关链接：  
     [#100960](ClickHouse/ClickHouse Issue #100960)  
     [#96867](ClickHouse/ClickHouse PR #96867)

3. **query_log / skip index 观测字段**
   - 新增观测能力后，默认路径、缓存路径是否都正确记录，是升级后可重点检查的点。
   - 相关链接：  
     [#100985](ClickHouse/ClickHouse Issue #100985)  
     [#100986](ClickHouse/ClickHouse Issue #100986)

---

## 3. 项目进展

以下为今日值得关注的推进项，重点覆盖查询引擎、存储与性能优化方向。

### 查询引擎 / Planner / Analyzer

- [#101030](ClickHouse/ClickHouse PR #101030) `Fix grouping function on Distributed table with single shard`
  - 修复 `grouping()` 在单分片 `Distributed` 表上的执行失败。
  - 说明维护者在持续补齐 **GROUPING SETS/ROLLUP/CUBE + Distributed** 的语义一致性。

- [#100770](ClickHouse/ClickHouse PR #100770) `Fix LOGICAL_ERROR "Column identifier is already registered" in UNION ALL`
  - 修复 fuzzer 触发的 `UNION ALL` 共享 AST 节点导致的标识符重复注册问题。
  - 这是典型的 **Analyzer / Planner 内部结构一致性修复**。

- [#101048](ClickHouse/ClickHouse PR #101048) `Fix exception "Column identifier is already registered" in planner`
  - 与上面相呼应，进一步修复 Planner 中重复注册列标识符异常。
  - 表明当前对 Planner/Analyzer 的健壮性打磨仍在高频进行。

- [#100375](ClickHouse/ClickHouse PR #100375) `Fix Not-ready Set exception when IN subquery is moved to PREWHERE`
  - 修复 `IN (subquery)` 被优化到 `PREWHERE` 后，Set 尚未构建即被使用的问题。
  - 属于**执行优化与正确性边界条件**修复，影响较实际。

- [#96491](ClickHouse/ClickHouse PR #96491) `[WIP] Use Analyzer in MutationsInterpreter`
  - 这是非常明确的路线图信号：**Analyzer 正在进一步接管 mutation 执行路径**。
  - 一旦完成，将减少旧分析器与新分析器并存的复杂度，但短期也可能继续带来回归验证压力。

- [#96886](ClickHouse/ClickHouse PR #96886) `[WIP] Replace ExpressionAnalyzer with Analyzer for standalone expression compilation`
  - 持续替换 legacy `ExpressionAnalyzer`。
  - 说明项目正在推进**分析框架统一化**，这是中长期架构演进主线。

### 性能优化

- [#101007](ClickHouse/ClickHouse PR #101007) `Enable hash table prefetching for string key aggregation`
  - 让字符串 key 聚合也能使用哈希表预取。
  - 对典型 OLAP 场景（维度为字符串、标签/国家/用户属性等）可能带来直接收益。

- [#97254](ClickHouse/ClickHouse PR #97254) `Push join key filters into MergeTree index during recursive CTE evaluation`
  - 将递归 CTE 中 join key 过滤下推到 MergeTree 索引。
  - 对图遍历、层级关系查询、递归依赖分析类 SQL 是非常实用的优化。

- [#100389](ClickHouse/ClickHouse PR #100389) `Optimizations on low-memory systems (e.g. 2 GiB)`
  - 面向低内存环境的系列优化，包括 Parquet 读取内存水位控制等。
  - 有利于边缘部署、小规格云实例、开发测试环境。

- [#100186](ClickHouse/ClickHouse PR #100186) `Optimize tupleElement(dictGet(...), N) into single-attribute dictGet`
  - 减少字典查询不必要属性拉取。
  - 对大量维表/字典查找场景有实际价值。

### 存储与可观测性

- [#96867](ClickHouse/ClickHouse PR #96867) `Extend blob_storage_log with Read event type`
  - 为 `system.blob_storage_log` 增加 Read 事件，并提供可控开关。
  - 这与今日 S3 PUT/存储行为讨论形成呼应，说明维护者在增强对象存储可观测性。

- [#99487](ClickHouse/ClickHouse PR #99487) `Fix DiskAccessStorage crash on restart when .sql file is missing`
  - 修复服务重启时因元数据缺失导致的崩溃。
  - 偏基础设施稳定性，影响运维可靠性。

- [#100124](ClickHouse/ClickHouse PR #100124) `Fix DeltaLake exception when accessing Tuple subcolumns with column mapping`
  - 修复 DeltaLake 兼容路径上的 Tuple 子列访问问题。
  - 体现 ClickHouse 继续加强湖仓/外部表格式兼容。

---

## 4. 社区热点

### 1）CI 崩溃与执行管线异常仍是热点
- [#99799](ClickHouse/ClickHouse Issue #99799) Double deletion of `MergeTreeDataPartCompact` in `multi_index`
- [#99295](ClickHouse/ClickHouse Issue #99295) Exception during pipeline execution
- [#100769](ClickHouse/ClickHouse Issue #100769) Potential issue in `MergeTreeRangeReader` adjusting last granule
- [#100296](ClickHouse/ClickHouse Issue #100296) Failed preparation of data source in pipeline execution

**分析：**
这些 issue 评论数较高，且都集中在 **CI crash / pipeline / MergeTree 读取链路**。背后的技术诉求是：  
- 在高并发测试与 fuzz/CI 场景下，执行引擎仍有生命周期管理、边界 granule 处理、数据源准备阶段异常等隐患。  
- 这类问题虽然很多先在 CI 暴露，但往往会映射到真实生产中的少数极端查询、取消、并发读写或 schema 组合。

### 2）Kafka 引擎超时问题继续受到关注
- [#66415](ClickHouse/ClickHouse Issue #66415) Kafka table engine frequently timeout

**分析：**
这是一个跨多个 24.3+ 版本的性能/稳定性反馈，说明用户对 **Kafka Engine 消费稳定性** 仍然敏感。  
技术诉求并非“功能缺失”，而是：
- 长时间稳定消费
- timeout/consumer close 行为可预测
- 升级后行为不要回退

### 3）SQL 易用性与兼容性需求持续出现
- [#90780](ClickHouse/ClickHouse Issue #90780) Support for trailing comma in WITH before SELECT
- [#90075](ClickHouse/ClickHouse Issue #90075) `generate_series` is not fully-compatible with PostgreSQL
- [#99608](ClickHouse/ClickHouse Issue #99608) Support `SIMILAR TO`

**分析：**
这类需求体现出 ClickHouse 在继续向“更通用 SQL 引擎”迈进。用户不只是追求性能，也希望：
- 更顺手的 SQL 编辑体验
- 与 PostgreSQL 等生态更高兼容性
- 更少迁移摩擦

### 4）S3 成本与对象存储可观测性
- [#100960](ClickHouse/ClickHouse Issue #100960) Big amount of PUTs on S3 bucket
- [#96867](ClickHouse/ClickHouse PR #96867) Extend `blob_storage_log` with Read event type

**分析：**
这里反映的是用户正在从“能用对象存储”转向“要控制成本、理解 I/O 行为、精确归因请求量”。  
这类需求通常出现在 ClickHouse 被用于更大规模冷热分层时。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P0 / 高优先级：崩溃与执行引擎稳定性

1. [#99799](ClickHouse/ClickHouse Issue #99799)  
   **问题**：`MergeTreeDataPartCompact` 双重删除，可能涉及内存/生命周期错误。  
   **影响**：崩溃类，优先级高。  
   **是否已有 fix PR**：未在给定数据中明确关联。

2. [#99295](ClickHouse/ClickHouse Issue #99295)  
   **问题**：pipeline execution 期间异常。  
   **影响**：执行链路稳定性。  
   **相关修复信号**：  
   [#98340](ClickHouse/ClickHouse PR #98340) 修复 `ResizeProcessor` 管线卡死/异常，属于同类稳定性治理。

3. [#100769](ClickHouse/ClickHouse Issue #100769)  
   **问题**：`MergeTreeRangeReader` 调整最后 granule 时潜在问题。  
   **影响**：读取正确性/稳定性，且 trace 来自主干或 release 分支。  
   **是否已有 fix PR**：未明确。

4. [#100296](ClickHouse/ClickHouse Issue #100296)  
   **问题**：pipeline 数据源准备失败。  
   **影响**：执行初始化链路。  
   **是否已有 fix PR**：未明确。

### P1 / 重要：查询正确性与 Analyzer 回归

5. [#79326](ClickHouse/ClickHouse Issue #79326)  
   **问题**：开启 analyzer 时，tuple 场景下 `GROUPING` 参数不在 `GROUP BY` keys 中。  
   **影响**：`GROUPING SETS` 语义正确性。  
   **相关 PR**：  
   [#101030](ClickHouse/ClickHouse PR #101030) 修单分片 distributed 上的 `grouping()`，但不等价于该问题完全解决。

6. [#76787](ClickHouse/ClickHouse Issue #76787)  
   **问题**：Analyzer 对带时区 `DateTime64` alias 处理异常。  
   **影响**：时间语义正确性，属于生产中较敏感问题。  
   **fix PR**：未见明确关联。

7. [#66245](ClickHouse/ClickHouse Issue #66245)  
   **问题**：分布式查询中 ALIAS 列表达式触发 `MULTIPLE_EXPRESSIONS_FOR_ALIAS`。  
   **影响**：Distributed + alias correctness。  
   **fix PR**：未见明确关联。

8. [#62914](ClickHouse/ClickHouse Issue #62914)  
   **问题**：Analyzer 下重复 alias 的错误信息不正确。  
   **影响**：诊断可用性与语义一致性。  
   **fix PR**：未见明确关联。

### P1 / 重要：对象存储与可观测性

9. [#100960](ClickHouse/ClickHouse Issue #100960)  
   **问题**：TTL 到 S3 时产生大量 PUT 请求。  
   **影响**：成本与对象存储行为异常。  
   **相关 PR**：  
   [#96867](ClickHouse/ClickHouse PR #96867) 增强读事件日志，有助于定位对象存储访问，但并非直接修复 PUT 激增。

### P2 / 已关闭但值得关注的快速修复

10. [#100793](ClickHouse/ClickHouse Issue #100793)  
    **问题**：`cast_keep_nullable=1` 时 Dynamic NULL 转 Variant 报错。  
    **状态**：已关闭。  
    **意义**：Variant/Dynamic 类型体系边界问题正在被快速修补。

11. [#100985](ClickHouse/ClickHouse Issue #100985)  
    **问题**：默认 `use_skip_indexes_on_data_read=1` 时，`query_log` 未记录 `skip_indices`。  
    **状态**：已关闭。  
    **意义**：可观测性缺口被快速发现并修复。

12. [#100986](ClickHouse/ClickHouse Issue #100986)  
    **问题**：`use_query_condition_cache=1` 时重复查询不记录 `skip_indices`。  
    **状态**：已关闭。  
    **意义**：缓存路径的可观测性一致性正在完善。

---

## 6. 功能请求与路线图信号

### 新功能/兼容性需求

- [#100994](ClickHouse/ClickHouse Issue #100994) `anyLastArray`
  - 需求背景是 `AggregatingMergeTree` + array 列在“列缺失/空数组”场景的建模困难。
  - 这是很典型的高吞吐分析场景诉求，**有实际落地价值**。

- [#99608](ClickHouse/ClickHouse Issue #99608) 支持 `SIMILAR TO`
  - 明确 SQL 兼容性增强需求，且被标记 `easy task`。
  - 若社区有人认领，进入下一版本的概率不低。

- [#90780](ClickHouse/ClickHouse Issue #90780) `WITH` 中 `SELECT` 前支持 trailing comma
  - 属于 SQL 编辑体验优化，小而明确，维护成本低。
  - 很适合作为易用性增量功能。

- [#90075](ClickHouse/ClickHouse Issue #90075) `generate_series` 与 PostgreSQL 兼容不足
  - 兼容性方向明确，若 ClickHouse 持续强化 PostgreSQL 用户迁移体验，这类问题会被优先处理。

### 从 PR 看出的中期路线图

1. **Analyzer 全面替换 legacy 路径**
   - [#96491](ClickHouse/ClickHouse PR #96491)
   - [#96886](ClickHouse/ClickHouse PR #96886)

2. **对象存储可观测性增强**
   - [#96867](ClickHouse/ClickHouse PR #96867)

3. **更激进的查询优化**
   - [#101007](ClickHouse/ClickHouse PR #101007)
   - [#97254](ClickHouse/ClickHouse PR #97254)
   - [#100186](ClickHouse/ClickHouse PR #100186)

4. **低资源环境适配**
   - [#100389](ClickHouse/ClickHouse PR #100389)

**判断：**
- 最可能进入后续版本的不是“全新大功能”，而是**Analyzer 替换、查询优化、对象存储可观测性和 SQL 兼容性小改进**。
- `SIMILAR TO`、trailing comma 这类需求，如果有对应 PR，很可能较快落地。

---

## 7. 用户反馈摘要

基于今日 issues，可提炼出以下真实使用痛点：

### 1）用户希望升级后性能与行为更稳定，而不是引入回归
- Kafka engine timeout 问题显示，用户对**长链路连接器稳定性**要求很高。  
  链接：[#66415](ClickHouse/ClickHouse Issue #66415)

### 2）Analyzer 迁移虽带来架构统一，但用户最在意的是“结果必须一致”
- 多个 issue 都围绕：
  - 别名解析
  - `GROUPING`
  - 参数化视图
  - JOIN 空值语义
  - 分布式常量 CAST
- 说明用户已经在真实 workload 中大量使用这些高级 SQL 特性。  
  链接：  
  [#79326](ClickHouse/ClickHouse Issue #79326)  
  [#76787](ClickHouse/ClickHouse Issue #76787)  
  [#66245](ClickHouse/ClickHouse Issue #66245)

### 3）对象存储场景下，用户不仅关心功能，还关心成本模型
- S3 PUT 激增 issue 反映，冷热分层与云存储已是常见部署方式，用户希望：
  - 行为可解释
  - 请求数可追踪
  - 成本异常可归因  
  链接：[#100960](ClickHouse/ClickHouse Issue #100960)

### 4）高吞吐分析用户在 schema/聚合函数设计上遇到边界限制
- `anyLastArray` 需求表明，用户在 `AggregatingMergeTree` + array 模型中需要更自然的聚合原语。  
  链接：[#100994](ClickHouse/ClickHouse Issue #100994)

### 5）SQL 兼容性和开发体验正在变成增量采用门槛
- trailing comma、`generate_series`、`SIMILAR TO` 都不是“核心引擎问题”，但直接影响迁移体验与开发效率。  
  链接：  
  [#90780](ClickHouse/ClickHouse Issue #90780)  
  [#90075](ClickHouse/ClickHouse Issue #90075)  
  [#99608](ClickHouse/ClickHouse Issue #99608)

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或反复出现的问题：

1. [#51645](ClickHouse/ClickHouse Issue #51645)  
   **问题**：Distributed 表上套一层 trivial view 会显著影响某些查询性能。  
   **状态**：自 2023-06 起存在。  
   **原因**：涉及 distributed + view + planner/optimizer 组合，可能影响真实 BI 查询路径。  
   **建议**：应补充 benchmark 与 explain 分析，明确是视图展开、分片裁剪还是计划退化所致。

2. [#66415](ClickHouse/ClickHouse Issue #66415)  
   **问题**：24.3 以来 Kafka engine timeout。  
   **状态**：2024-07 起长期存在且近期仍活跃。  
   **建议**：需要更明确的根因分类与版本回归矩阵。

3. [#66245](ClickHouse/ClickHouse Issue #66245)  
   **问题**：分布式查询下 ALIAS 表达式报错。  
   **状态**：2024-07 起仍未关闭。  
   **建议**：可结合当前 Analyzer/Planner 重构优先梳理。

4. [#62914](ClickHouse/ClickHouse Issue #62914)  
   **问题**：Analyzer 下重复 alias 的报错不正确。  
   **状态**：2024-04 起未关闭。  
   **建议**：虽属 usability/minor，但对 SQL 诊断体验影响明显，且与当前 Analyzer 替换主线相关。

5. [#76787](ClickHouse/ClickHouse Issue #76787)  
   **问题**：DateTime64 时区 alias 在 Analyzer 下行为异常。  
   **状态**：2025-02 起仍开放。  
   **建议**：时间语义问题对生产影响较大，应提高优先级。

6. [#79326](ClickHouse/ClickHouse Issue #79326)  
   **问题**：Analyzer 下 `GROUPING` 与 tuple 组合错误。  
   **状态**：今日仍更新。  
   **建议**：与 [#101030](ClickHouse/ClickHouse PR #101030) 一并验证，避免相关功能局部修复、整体仍不稳。

---

## 附：今日总体判断

ClickHouse 今天最明确的信号有三点：

1. **稳定分支维护非常积极**：一天内 3 个 release，说明项目对生产用户的版本保障力度较强。  
2. **Analyzer 替换进入更深水区**：功能覆盖在扩大，但 correctness 与边界 case 仍需持续修补。  
3. **性能与云场景并重**：既在打磨聚合、递归 CTE、低内存优化，也在补强对象存储可观测性。

如果你愿意，我还可以继续把这份日报整理成更适合你团队内部同步的两种格式之一：  
1. **面向管理层的 1 页简报版**  
2. **面向内核/数据库工程师的技术跟踪版**

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-29

## 1. 今日速览

过去 24 小时 DuckDB 项目保持较高活跃度：Issues 更新 11 条、PR 更新 24 条，但**无新版本发布**。  
从变更结构看，今天的重点仍然集中在**查询执行器优化、外部文件缓存、类型系统完善、SQL 兼容性修复**，同时也出现了若干与 **S3/远程对象存储、ARM 平台、时间戳/宏回归** 相关的用户问题。  
PR 侧有 10 条进入合并/关闭状态，说明维护节奏稳定；不过开放 PR 中带有 `stale`、`merge conflict`、`CI failure` 标记的条目较多，显示部分外部贡献正在积压。  
整体健康度评价：**中上**——核心开发持续推进，但在远程存储性能、平台兼容性和部分回归问题上仍需加快收敛。

---

## 3. 项目进展

### 已合并/关闭的重要 PR

#### 1) 外部文件缓存完成块对齐读取与缓存改造
- **PR**: #21395 Implement block-aligned read and cache for external file cache  
- **链接**: duckdb/duckdb PR #21395

这是今天最值得关注的基础设施级改动之一。该 PR 将外部文件缓存从“按请求粒度”重做为“按块粒度”，对远程文件读取链路有直接意义，尤其适用于：
- S3 / HTTP / 对象存储上的 Parquet / JSON 等文件扫描
- 重复小范围读取场景
- 远程 IO 放大和缓存命中率优化

**意义分析：**
- 有助于降低远程读取碎片化请求带来的开销；
- 为后续解决 S3 相关的慢查询、缓存行为异常等问题提供基础；
- 与今天活跃的远程存储问题形成明显呼应。

---

#### 2) 新增每连接级别的算子内存预算设置
- **PR**: #20219 Add operator_memory_limit setting for per-connection memory budgets  
- **链接**: duckdb/duckdb PR #20219

该 PR 新增 `operator_memory_limit` 会话级配置，用于限制**单连接查询中间结果**的内存预算。  
这是对现有全局/数据库级 `memory_limit` 的重要补充。

**推进点：**
- 更适合多租户或服务型嵌入式部署；
- 为应用侧控制单请求内存占用提供更细粒度手段；
- 对并发分析服务、Notebook、多 session 场景更友好。

**与现有问题的关联：**
- 对 #11817 这类 COPY 到 S3 时内存异常偏高的问题，虽然不是直接修复，但提供了更细粒度的治理工具。

---

#### 3) 常量向量优化下沉到表达式执行器
- **PR**: #21674 Handle constant vector optimization at the expression executor level instead of inside every function  
- **链接**: duckdb/duckdb PR #21674

该改动把常量向量优化从“每个函数各自处理”迁移到了表达式执行器层。  
这类改动虽然不直接暴露为用户功能，但对执行器体系结构很关键。

**意义：**
- 减少函数实现中的重复逻辑；
- 降低触发 `EvaluateScalar` 断言问题的概率；
- 有望提升表达式执行的一致性与可维护性。

这属于典型的**查询引擎内部收敛型优化**，长期有利于稳定性。

---

#### 4) 修复缺失 struct 上的过滤问题
- **PR**: #21676 Fix issue with struct filter on missing structs  
- **链接**: duckdb/duckdb PR #21676

该修复针对嵌套类型 `STRUCT` 的过滤行为。  
随着 DuckDB 在半结构化数据、Parquet/JSON、Iceberg/Variant 等方向不断增强，嵌套类型正确性问题的重要性越来越高。

**价值：**
- 改善嵌套 schema 缺字段场景下的查询正确性；
- 减少 lakehouse/数据湖数据读取中的边界错误；
- 对复杂 ETL 和 schema 演化场景更友好。

---

#### 5) ValidityMask 命名修正，提升 NULL 语义清晰度
- **PR**: #21679 Rename `ValidityMask::AllValid` to `ValidityMask::CannotHaveNull`  
- **链接**: duckdb/duckdb PR #21679

这是一个偏内部 API/语义纠正的改动。  
维护者指出原命名 `AllValid` 容易误导：它并非真的“检查所有值都有效”，而是判断“该向量是否不可能包含 NULL”。

**意义：**
- 降低开发者误用内部接口的风险；
- 提高向量化执行和 NULL 处理逻辑的可读性；
- 这类重命名通常是引擎成熟度提升的信号。

---

#### 6) 窗口查询相关内部修正
- **PR**: #21671 Internal #8553: Window TopN Except  
- **链接**: duckdb/duckdb PR #21671

该 PR 调整了 CTE 优化器相关投影行为，避免未使用列干扰优化。  
虽然是内部测试/修复，但透露出 DuckDB 仍在持续细化**窗口函数 + CTE 优化器**的交互。

---

#### 7) VARIANT 与 Parquet 生态继续推进
- **PR**: #18996 [Parquet] Emit `VARIANT` from Parquet VARIANT columns, instead of JSON  
- **链接**: duckdb/duckdb PR #18996

该 PR 已关闭，核心目标是让 Parquet 中 VARIANT 列扫描时直接输出 DuckDB 的 `VARIANT` 类型，而不是退化为 JSON。

**路线图信号很强：**
- DuckDB 正继续把半结构化数据能力从“兼容读取”升级到“原生类型表达”；
- 对 Iceberg / lakehouse 生态兼容是积极信号；
- 即便该 PR 当前关闭，其方向依然值得持续关注。

---

## 4. 社区热点

### 1) S3 分区写出时内存异常高
- **Issue**: #11817 Out-of-memory error when performing partitioned copy to S3  
- **链接**: duckdb/duckdb Issue #11817

这是今天最具代表性的生产场景问题之一。用户反馈在执行带 hive partitioning 的 `COPY TO S3` 时，即使数据量很小、分区数有限，也会在 2GiB 内存限制下失败。

**背后技术诉求：**
- 用户希望 DuckDB 的分区写出在对象存储上具备更稳定的内存曲线；
- 说明当前写路径可能存在分区级 buffering、multipart/upload、writer 生命周期管理等方面的额外开销；
- 与今天刚合并的 `operator_memory_limit`、外部文件缓存优化共同构成“云对象存储可控性”主线。

---

### 2) 远程 S3 查询 `fetch_df()` 偏慢
- **Issue**: #14095 Slow fetch_df() on S3 remote query  
- **链接**: duckdb/duckdb Issue #14095

该问题针对 on-prem k8s + Minio 场景，数据量并不大，却在 `fetch_df()` 阶段出现明显性能问题。

**技术解读：**
- 问题可能不只在扫描，还可能涉及：
  - 远程文件元数据访问
  - Python dataframe materialization
  - 分区裁剪/并发下载策略
  - 网络对象存储访问模式与缓存策略
- 与 #21395 外部文件缓存改造高度相关，值得后续观察是否能间接缓解。

---

### 3) Java JDBC 元数据接口 `getTypeInfo` 不支持
- **Issue**: #6759 Java JDBC API > java.sql.SQLFeatureNotSupportedException: getTypeInfo  
- **链接**: duckdb/duckdb Issue #6759

这是一个老问题今日关闭。其热度来自 JDBC 生态中对标准元数据接口的依赖。

**背后诉求：**
- BI 工具、数据库客户端、中间件通常要求 JDBC metadata 足够完整；
- `getTypeInfo` 缺失会影响工具自动发现类型能力；
- 该问题关闭说明 DuckDB 在 Java/JDBC 兼容性方面继续补齐。

---

### 4) 同一请求第二次执行更慢
- **Issue**: #19482 The second execution of the same request takes twice as long, even after a DROP TABLE  
- **链接**: duckdb/duckdb Issue #19482

用户报告同一查询第二次运行反而更慢，即使 `DROP TABLE` 之后仍然如此。  
这类问题对用户体验影响很大，因为它违背“缓存应让第二次更快”的直觉。

**可能涉及：**
- 文件缓存与对象生命周期
- 临时表/中间结果清理
- 统计信息、pipeline 或 spilling 相关行为
- Parquet 扫描与窗口函数组合下的资源释放时机

---

### 5) Windows ARM 扩展不可用
- **Issue**: #16647 Windows ARM Extensions  
- **链接**: duckdb/duckdb Issue #16647

用户在 Windows ARM64 上运行 `duckdb -ui` 时遇到扩展不是有效 Win32 应用的问题。

**技术诉求：**
- 官方二进制和扩展生态需要更完整覆盖 ARM 平台；
- Windows on ARM 正逐渐成为真实用户平台，而不仅是边缘环境；
- 这是 DuckDB 在“多平台分发”上的一个明显短板信号。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：崩溃 / Core Dump 类问题

#### A. 浮点异常 core dumped
- **Issue**: #21429 Floating point exception (core dumped)  
- **状态**: 已关闭  
- **链接**: duckdb/duckdb Issue #21429

这是 SQL 即可触发的崩溃问题，涉及 `CASE`、`rowid`、类型转换等组合。  
虽然已关闭，但表明表达式执行/类型推导边界条件仍存在脆弱点。

**相关修复信号：**
- #21674 将常量向量优化统一到执行器层，可能有助于减少同类执行器边界异常。  
- **链接**: duckdb/duckdb PR #21674

---

#### B. 读取 list of struct 表时浮点异常
- **Issue**: #21470 floating point exception (core dumped) when reading from table with a list of struct  
- **状态**: 已关闭  
- **链接**: duckdb/duckdb Issue #21470

这是嵌套类型读取触发崩溃的问题，而且在不同 SSH 会话中复现不一致，说明可能带有环境敏感性或未定义行为特征。

**相关修复信号：**
- #21676 修复缺失 struct 过滤问题，虽不一定直接对应，但说明嵌套类型正确性正在集中修整。  
- **链接**: duckdb/duckdb PR #21676

---

#### C. Markdown 渲染触发 UTF8 内部错误
- **Issue**: #21545 v1.5.0: INTERNAL Error in Utf8Proc::UTF8ToCodepoint when rendering markdown table with em dashes  
- **状态**: 已关闭  
- **链接**: duckdb/duckdb Issue #21545

该问题发生在 CLI 输出层，而非查询引擎核心，但会直接影响终端使用者。  
说明 DuckDB 不仅在执行层，也在输出格式化链路上继续修复 UTF-8 边界问题。

---

### P2：性能与资源管理问题

#### D. S3 分区 COPY 内存溢出
- **Issue**: #11817  
- **状态**: Open / under review  
- **链接**: duckdb/duckdb Issue #11817

这是当前最值得关注的稳定性问题之一，因其涉及对象存储写出和内存上界不可预测。  
**尚未看到直接 fix PR**，但：
- #20219 `operator_memory_limit` 提供了缓解工具；
- #21395 改善远程 IO 基础设施；
两者都属于间接支撑。

---

#### E. S3 远程查询 `fetch_df()` 性能慢
- **Issue**: #14095  
- **状态**: Open / under review / stale  
- **链接**: duckdb/duckdb Issue #14095

问题仍未闭环，且已带 `stale`，提示维护者可能尚未完全定位。  
**可能相关 PR：**
- #21395 外部文件缓存重构  
- **链接**: duckdb/duckdb PR #21395

---

#### F. 列更新为 NULL 时性能骤降
- **Issue**: #21675 Column set to NULL performance issue  
- **状态**: Open / needs triage  
- **链接**: duckdb/duckdb Issue #21675

用户反馈从 2 秒退化到 3 分钟，即便先删除索引再更新也无改善。  
这类问题很可能涉及：
- MVCC / update chain
- 索引维护残留成本
- 列存储更新路径
- VACUUM/row group rewrite 机制

**暂无 fix PR。**

---

### P3：回归与正确性问题

#### G. 宏中使用 timestamptz 出现回归
- **Issue**: #21682 Regression with timestamptz when used in macros  
- **状态**: Open / needs triage  
- **链接**: duckdb/duckdb Issue #21682

这是典型 SQL 兼容性/语义回归问题。  
涉及 `TIMESTAMPTZ` 与宏系统结合，可能影响时间序列和模板 SQL 用户。

**暂无 fix PR。**

---

#### H. 第二次执行同查询更慢
- **Issue**: #19482  
- **状态**: Open / under review  
- **链接**: duckdb/duckdb Issue #19482

更偏性能正确性/缓存行为异常，值得继续关注。

---

#### I. 第二个连接未正确拾取新的 attach 字符串
- **Issue**: #21618 Attach string is not picked up when creating a second connection in a session  
- **状态**: Open / reproduced  
- **链接**: duckdb/duckdb Issue #21618

已被标记 `reproduced`，说明问题已确认。  
这影响多连接会话、嵌入式应用、DuckLake/attach 工作流的正确性。

**暂无 fix PR。**

---

#### J. Windows ARM 扩展兼容问题
- **Issue**: #16647 Windows ARM Extensions  
- **状态**: Open  
- **链接**: duckdb/duckdb Issue #16647

属于平台兼容性问题，影响特定用户群体，但对生态完整性意义较大。

---

## 6. 功能请求与路线图信号

### 1) C API 暴露 VARIANT 类型
- **PR**: #20210 Add VARIANT type to C API  
- **状态**: Open / stale / Merge Conflict  
- **链接**: duckdb/duckdb PR #20210

这是非常明确的路线图信号。  
如果合入，意味着 DuckDB 不仅在内部支持 VARIANT，还将向 C API 和各语言驱动扩散。

**可能影响：**
- Python/R/Go/Rust 等驱动后续可更完整支持 VARIANT 列；
- lakehouse / 半结构化数据能力将更容易被上层生态消费。

---

### 2) Parquet VARIANT 直出 DuckDB VARIANT
- **PR**: #18996  
- **链接**: duckdb/duckdb PR #18996

即便该 PR 当前关闭，其方向仍表明：
- DuckDB 正把半结构化数据从 JSON 过渡到原生类型系统；
- 与 Iceberg 等新型表格式兼容度将持续增强。

---

### 3) 自定义索引 API 重构
- **PR**: #20638 Refactor Index API  
- **状态**: Open / stale / Merge Conflict  
- **链接**: duckdb/duckdb PR #20638

该 PR 引入 materialization、parallelism 等回调，并移植现有 HNSW 索引创建路径，明显不是小修小补，而是**索引扩展能力平台化**。

**路线图意义：**
- DuckDB 未来可能在向量索引、插件索引、并行索引构建上更开放；
- 对 AI 检索、近似向量搜索、定制二级索引生态有信号价值。

---

### 4) `UNNEST` 支持 ARRAY
- **PR**: #21672 FIX #21506 UNNEST ARRAY type functionality  
- **状态**: Open  
- **链接**: duckdb/duckdb PR #21672

该功能提升 SQL 一致性很明显。当前 `UNNEST` 只支持 LIST，会让 ARRAY 深层递归展开不自然。  
这类补齐通常比较有机会进入后续版本，因为：
- 改动边界较清晰；
- 用户价值直接；
- 与类型系统一致性相关。

---

### 5) SYSTEM sampling 支持固定行数
- **PR**: #20859 Support SYSTEM sampling with row counts  
- **状态**: Open / stale / Ready For Review  
- **链接**: duckdb/duckdb PR #20859

为 `USING SAMPLE N ROWS (system)` 增加支持，属于 SQL 可用性增强。  
这类特性对分析工作负载很实用，尤其是大表快速抽样与测试。

---

### 6) 元数据可观测性增强
- **PR**: #20752 add extension_name to `duckdb_functions` and `duckdb_types`  
- **链接**: duckdb/duckdb PR #20752

- **PR**: #20960 Add duckdb_prepared_column_origin_table C API function  
- **链接**: duckdb/duckdb PR #20960

这两项都反映出用户对**元数据可见性、可解释性、驱动集成能力**的持续需求。  
如果进入下一版本，将显著改善工具链、IDE、血缘分析和驱动开发体验。

---

## 7. 用户反馈摘要

### 远程对象存储仍是高频痛点
- 相关链接：
  - duckdb/duckdb Issue #11817
  - duckdb/duckdb Issue #14095

用户在 S3/Minio 场景下最关注两件事：
1. **内存是否可控**
2. **远程查询是否足够快**

这说明 DuckDB 虽然已经广泛用于数据湖读取，但在生产环境里，用户期待的不只是“能跑”，而是“云原生代价可预测”。

---

### 嵌入式/多连接使用场景更复杂了
- 相关链接：
  - duckdb/duckdb Issue #21618
  - duckdb/duckdb PR #20219

用户不再只是单机单连接跑 SQL，而是：
- 同一 session 下多连接
- 服务端嵌入式调用
- 每请求独立资源控制

这推动 DuckDB 从“本地分析工具”进一步走向“轻量分析服务引擎”。

---

### SQL 边界语义与类型系统要求更高
- 相关链接：
  - duckdb/duckdb Issue #21682
  - duckdb/duckdb PR #21672
  - duckdb/duckdb PR #20210

用户正越来越多地使用：
- `TIMESTAMPTZ`
- 宏
- ARRAY / LIST / STRUCT
- VARIANT

这说明 DuckDB 的典型用户画像正在从基础 OLAP 扩展到更复杂的数据工程、半结构化分析和程序化 SQL 生成场景。

---

### 平台兼容性和驱动完整性仍会影响采用
- 相关链接：
  - duckdb/duckdb Issue #16647
  - duckdb/duckdb Issue #6759

Windows ARM 扩展不可用、JDBC 元数据不全这类问题，虽然不是核心执行引擎 bug，但对企业接入、桌面工具集成、跨平台部署影响很大。  
这些问题往往直接决定“能否在真实环境落地”。

---

## 8. 待处理积压

以下条目建议维护者重点关注：

### 1) #11817 S3 分区 COPY 内存溢出
- **状态**: Open / under review  
- **链接**: duckdb/duckdb Issue #11817

这是高影响生产问题，且已有较强用户反馈（👍 9）。  
建议优先明确：
- 是否已有根因定位
- 是否有可复现基准
- 是否能给出临时规避建议

---

### 2) #14095 S3 远程查询性能慢
- **状态**: Open / under review / stale  
- **链接**: duckdb/duckdb Issue #14095

与当前 DuckDB 云对象存储使用趋势高度相关，不宜长期 stale。  
建议结合 #21395 新缓存实现重新回归验证。

---

### 3) #20210 C API 暴露 VARIANT
- **状态**: Open / stale / Merge Conflict  
- **链接**: duckdb/duckdb PR #20210

这是高价值生态 PR，但目前被冲突和 stale 阻塞。  
若 DuckDB 希望推进 VARIANT 生态，应尽快决定：
- 是否接受该 API 方向
- 是否由核心团队接手整理

---

### 4) #20638 索引 API 重构
- **状态**: Open / stale / Merge Conflict  
- **链接**: duckdb/duckdb PR #20638

这是战略型 PR，不适合长期悬置。  
若暂不纳入主线，也应给出更明确的设计反馈，以减少贡献者成本。

---

### 5) #16647 Windows ARM Extensions
- **状态**: Open  
- **链接**: duckdb/duckdb Issue #16647

平台支持问题往往会持续损害用户信心。  
建议明确：
- 是打包问题、扩展 ABI 问题，还是发布矩阵缺失；
- 是否已有短期 workaround。

---

## 总结

今天 DuckDB 的开发重心可以概括为三条主线：

1. **引擎内部持续收敛**：表达式执行器、NULL/Validity 语义、嵌套类型过滤等基础层继续打磨。  
2. **远程存储链路强化**：外部文件缓存重构已落地，但 S3 写出内存和远程读取性能仍是用户最强烈痛点。  
3. **类型系统与生态接口扩展**：VARIANT、ARRAY/UNNEST、元数据 API、自定义索引等方向持续释放路线图信号。

总体来看，DuckDB 依然保持健康的核心开发节奏；但若想进一步提升生产环境口碑，接下来最值得优先收敛的仍是**对象存储性能/内存可预测性**与**复杂类型场景的稳定性**。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 - 2026-03-29

## 1. 今日速览

过去 24 小时内，StarRocks 社区整体活跃度中等偏上：共更新 1 条 Issue、9 条 PR，PR 活跃明显高于 Issue，说明当前工作重心仍集中在功能演进、工程治理与版本分支维护。  
从内容看，今日变更主要聚焦在 **存储层能力扩展、外部表/数据湖集成、Schema 演进、工具链升级与文档安全更新**。  
值得注意的是，新增 Bug 报告指向 **ROUTINE LOAD + Avro + Confluent Schema Registry** 的兼容性问题，这属于真实生产链路中的数据接入稳定性风险。  
同时，多个 PR 显示出 4.1 以及多分支（3.4/3.5/4.0/4.1）并行推进，反映项目在新功能开发之外，也在持续进行成熟分支维护与可用性修补。  

---

## 3. 项目进展

### 已关闭/完成的 PR

#### 1) Add check for generated files
- **PR**: #70925  
- **状态**: CLOSED  
- **类型**: Tool  
- **链接**: StarRocks/starrocks PR #70925

**解读：**  
这是今日唯一关闭的 PR，属于工程质量治理类改进。虽然不直接影响查询引擎或存储引擎功能，但“生成文件检查”通常用于：
- 防止代码生成产物未提交导致 CI/构建不一致
- 避免 FE/BE 接口定义、Thrift/Proto 变更后产物漂移
- 降低多人协作下的构建复现问题

**项目意义：**
- 提升开发流程稳定性
- 降低合并后隐藏构建失败概率
- 为后续工具链升级（如 Thrift 升级）提供配套保障

---

## 4. 社区热点

结合当前数据，今日最值得关注的讨论热点主要集中在以下 Issue/PR：

### 1) ROUTINE LOAD 对 Avro nullable union 类型处理异常
- **Issue**: #70928  
- **标题**: [type/bug] ROUTINE LOAD Avro union type ["null", "type"] not handled correctly  
- **状态**: OPEN  
- **评论**: 1  
- **链接**: StarRocks/starrocks Issue #70928

**为什么值得关注：**  
这是今天唯一新增/活跃 Issue，且直接关联生产常见链路：
- Kafka
- Confluent Schema Registry
- Avro schema
- ROUTINE LOAD 流式导入

**背后技术诉求：**
用户使用的是 Avro 标准 nullable union，例如 `["null", "type"]` 表示可空字段。这类 schema 在流式数据平台里非常普遍，如果 StarRocks 不能正确解析，会导致：
- 可空字段导入失败或值错误
- schema registry 接入兼容性下降
- 用户在实时数仓链路中需要绕过标准 schema 设计

这反映出社区对 **标准数据格式兼容性** 和 **实时导入稳定性** 的高度需求。

---

### 2) Composite Storage Volume：跨 bucket 分区分布能力
- **PR**: #70926  
- **标题**: [Feature] Support Composite Storage Volume for cross-bucket partition distribution  
- **状态**: OPEN  
- **标签**: behavior_changed, META-REVIEW  
- **链接**: StarRocks/starrocks PR #70926

**为什么值得关注：**  
这是今天最具“架构级”影响的功能 PR 之一，面向 shared-data 模式下的多云存储 bucket 管理问题。

**背后技术诉求：**
在共享存储架构中，用户希望：
- 将多个存储卷/多个 bucket 聚合管理
- 让分区自动分散落盘
- 提升容量扩展性与成本管理灵活性
- 避免单 bucket 热点或配额压力

这是 StarRocks 在云原生分析存储方向上的重要演进信号，说明项目正在从“支持对象存储”走向“多存储资源编排”。

---

### 3) Iceberg Parquet 对 shredded VARIANT 虚拟列读取支持
- **PR**: #70924  
- **标题**: [Enhancement] Support shredded VARIANT virtual-column reads for Iceberg Parquet  
- **状态**: OPEN  
- **链接**: StarRocks/starrocks PR #70924

**为什么值得关注：**  
该 PR 直接影响半结构化数据分析能力，以及 StarRocks 对现代数据湖表格式的查询体验。

**背后技术诉求：**
PR 描述显示 FE 已能将 VARIANT 路径重写为虚拟列，但 BE 尚不能端到端读取 Parquet 中 shredded VARIANT 数据。该改动补齐后，预计会改善：
- VARIANT 子字段投影读取
- cast / aggregate / predicate evaluation 的可执行性
- 谓词下推与列裁剪能力

这是典型的 **查询引擎与存储格式协同优化**，对于 Iceberg 用户尤其重要。

---

### 4) varchar 长度扩容的 schema 演进支持
- **PR**: #70747  
- **标题**: [4.1] [Enhancement] Support schema evaluation for widening varchar length with key/non-key column  
- **状态**: OPEN  
- **链接**: StarRocks/starrocks PR #70747

**为什么值得关注：**  
Schema 演进一直是 OLAP 数据库生产可维护性的核心问题，尤其对于键列、排序键、分桶键、分区键的 varchar 扩容，历史上往往限制较多。

**背后技术诉求：**
用户希望在不重建表、不大规模迁移数据的前提下：
- 对 key / non-key 列扩展 varchar 长度
- 支持 share-nothing 与 share-data 两种架构
- 同时兼容 regular path 与 fast path

这类 PR 通常会显著降低线上 DDL 变更成本，是企业用户非常关心的能力。

---

## 5. Bug 与稳定性

以下按影响面和潜在严重程度排序：

### P1：ROUTINE LOAD 对标准 Avro nullable union 兼容性问题
- **Issue**: #70928  
- **状态**: OPEN  
- **链接**: StarRocks/starrocks Issue #70928

**问题描述：**  
ROUTINE LOAD 在消费 Kafka + Confluent Schema Registry 的 Avro 消息时，无法正确处理标准写法 `["null", "type"]` 的 union 类型。

**潜在影响：**
- 实时导入链路失败
- 可空字段解析异常
- 与 Confluent/Avro 生态兼容性受损
- 用户需修改上游 schema 或增加转换层

**严重程度判断：**  
**高**。因为它影响的是标准格式兼容和生产实时接入。

**是否已有 fix PR：**  
- 当前数据中**未见直接关联修复 PR**

---

### P2：be_tablets DATA_SIZE 统计口径修正
- **PR**: #70735  
- **状态**: OPEN  
- **标题**: [BugFix] Report be_tablets DATA_SIZE as rowset column data bytes  
- **链接**: StarRocks/starrocks PR #70735

**问题性质：**  
该 PR 修正 `be_tablets` 中 `DATA_SIZE` 的统计口径，使其更接近真实列数据字节数，而不是混入 rowset 嵌入索引、persistent PK index 等额外空间。

**影响分析：**
- 影响存储容量观测准确性
- 影响运维与成本评估
- 可能导致用户误判数据膨胀或压缩效果

**严重程度判断：**  
**中**。不直接影响查询正确性，但会影响监控、容量规划和诊断。

**修复状态：**  
- 已有修复 PR，尚未合并

---

### P3：文档依赖安全更新（picomatch）
- **PR**: #70927  
- **状态**: OPEN  
- **标题**: [Doc] picomatch update  
- **链接**: StarRocks/starrocks PR #70927

**问题性质：**  
针对文档相关依赖进行升级，以解决 CVE。

**影响分析：**
- 主要影响文档构建链路及依赖安全性
- 对数据库运行时无直接影响
- 体现项目对供应链安全的持续维护

**严重程度判断：**  
**中低**

**修复状态：**  
- 已有 PR，待合并

---

## 6. 功能请求与路线图信号

从今日 PR/Issue 动向看，StarRocks 的中短期路线信号较清晰：

### 1) 云原生共享存储能力增强
- **PR**: #70926  
- **链接**: StarRocks/starrocks PR #70926

**信号判断：**  
Composite Storage Volume 支持跨 bucket 分区分布，表明项目正在增强 shared-data 模式下的多存储资源管理能力。  
这很可能进入后续版本重点能力集，尤其适合：
- 多 bucket 隔离
- 成本优化
- 海量分区表存储分布
- 云资源弹性治理

**纳入下一版本概率：高**

---

### 2) 数据湖与半结构化查询能力继续加码
- **PR**: #70924  
- **链接**: StarRocks/starrocks PR #70924

**信号判断：**  
Iceberg + Parquet + VARIANT 虚拟列读取能力补齐，说明 StarRocks 正在持续投入：
- Iceberg 查询兼容
- 半结构化字段裁剪
- FE/BE 联动执行优化
- 复杂表达式与谓词支持

**纳入下一版本概率：高**

---

### 3) 在线 Schema 演进更灵活
- **PR**: #70747  
- **链接**: StarRocks/starrocks PR #70747

**信号判断：**  
针对 varchar 扩容支持 key/non-key 列，且覆盖 share-nothing/share-data，全表模型支持，说明项目重视 DDL 可演进性与线上变更成本。

**纳入下一版本概率：较高**

---

### 4) 外部生态接入扩展：Paimon 向量检索框架
- **PR**: #70641  
- **链接**: StarRocks/starrocks PR #70641

**信号判断：**  
虽然仍处于 `[WIP]` 和 `PROTO-REVIEW` 状态，但它释放出两个方向信号：
- StarRocks 正关注 Paimon 生态
- 社区可能在探索向量检索/向量数据场景与湖仓结合

**纳入下一版本概率：中低**  
当前更像前期探索，不像短期可落地功能。

---

### 5) 基础工具链升级：BE Thrift 0.20 -> 0.22
- **PR**: #70822  
- **链接**: StarRocks/starrocks PR #70822

**信号判断：**  
这是典型的底层工程能力建设，通常会影响：
- 代码生成
- RPC/IDL 兼容性
- 编译环境和依赖维护

**纳入下一版本概率：中高**  
若配套 CI 和 generated files 校验完善，推进速度可能较快。

---

## 7. 用户反馈摘要

### 1) 实时接入用户最关注“标准格式兼容，不要额外改造上游”
- **来源**: Issue #70928  
- **链接**: StarRocks/starrocks Issue #70928

用户场景非常典型：  
- Kafka 消息流
- Confluent Schema Registry
- Avro 标准 nullable union schema
- ROUTINE LOAD 实时导入 StarRocks

**提炼出的真实痛点：**
- 用户期待 StarRocks 对主流消息/Schema 生态“开箱即用”
- 不希望为了数据库兼容性去改造标准 Avro schema
- 对实时链路的稳定性和 schema 兼容性容错要求较高

这说明 StarRocks 在接入层的竞争力，不仅取决于吞吐和延迟，也取决于对业界标准格式的兼容深度。

---

## 8. 待处理积压

结合当前列表，以下开放 PR 值得维护者重点关注：

### 1) #70641 - Support paimon vector search framework
- **状态**: OPEN, WIP, PROTO-REVIEW  
- **创建时间**: 2026-03-23  
- **链接**: StarRocks/starrocks PR #70641

**关注原因：**
- 方向新，但仍处于早期讨论阶段
- 涉及 Paimon 与向量检索框架，技术面较大
- 若长期缺乏明确评审意见，容易形成“探索型积压 PR”

**建议：**
- 尽快明确设计边界
- 给出是否进入正式 roadmap 的信号
- 避免作者持续投入却缺少评审反馈

---

### 2) #70747 - Widening varchar length schema evolution
- **状态**: OPEN  
- **创建时间**: 2026-03-25  
- **链接**: StarRocks/starrocks PR #70747

**关注原因：**
- 功能价值高，涉及 DDL 演进核心能力
- 可能影响 key/sort/distribution/partition key 语义与兼容性
- 需要尽早确认行为边界、回滚策略和 metadata 校验逻辑

**建议：**
- 优先评审兼容性与线上迁移风险
- 明确 share-nothing / share-data 一致性行为

---

### 3) #70822 - Bump thrift on BE from v0.20 to v0.22
- **状态**: OPEN, PROTO-REVIEW  
- **创建时间**: 2026-03-26  
- **链接**: StarRocks/starrocks PR #70822

**关注原因：**
- 属于基础依赖升级
- 容易牵涉生成文件、CI、编译器环境与跨平台构建问题
- 若不尽快推进，后续相关 PR 可能被阻塞

**建议：**
- 结合 #70925 这类 generated files 检查机制一起推进
- 优先完成依赖兼容性验证

---

## 附：今日重点链接汇总

- Bug：ROUTINE LOAD Avro union 兼容性问题  
  StarRocks/starrocks Issue #70928

- Feature：Composite Storage Volume 跨 bucket 分布  
  StarRocks/starrocks PR #70926

- Enhancement：Iceberg Parquet shredded VARIANT 虚拟列读取  
  StarRocks/starrocks PR #70924

- Enhancement：varchar 长度扩容 schema 演进  
  StarRocks/starrocks PR #70747

- BugFix：be_tablets DATA_SIZE 统计口径修正  
  StarRocks/starrocks PR #70735

- Tool：BE Thrift 0.20 -> 0.22 升级  
  StarRocks/starrocks PR #70822

- 探索方向：Paimon vector search framework  
  StarRocks/starrocks PR #70641

- 已关闭：generated files 检查  
  StarRocks/starrocks PR #70925

如果你愿意，我还可以进一步把这份日报整理成：
1. **面向管理层的 1 分钟摘要版**  
2. **面向内核开发者的技术跟踪版**  
3. **Markdown 可直接发布到飞书/钉钉/公众号的排版版**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 共出现 **30 条更新**：**Issues 6 条、PR 24 条**，整体活跃度处于 **中高水平**，讨论重点集中在 **Flink/Spark 兼容性、文档修正、元数据一致性与对象存储/云 catalog 稳定性**。  
从变更结构看，今天新增或活跃的 PR 以 **小步快跑式修复** 为主，尤其是文档、规范、测试与兼容性补丁较多，说明项目正持续进行 **版本打磨和生态补齐**。  
稳定性方面，社区今天暴露出的几个问题都与 **元数据提交正确性、加密文件可读性、批处理空值状态残留** 等底层机制相关，技术影响面虽然不一定都广，但一旦触发，后果偏严重。  
同时，Flink 方向继续保持较高热度，既有 **JUnit4 依赖清理** 这类工程化工作，也有 **Sink 扩展接口** 这类能力建设，显示 Iceberg 正在继续强化多引擎生态的一致性与可维护性。

---

## 2. 项目进展

> 今日无新版本发布。以下聚焦“已关闭/关闭状态变化”的 PR 与问题，以及其代表的项目推进方向。

### 2.1 已关闭 PR

#### PR #15817 - Core: Add helper method to provide full MetricsConfig
- 状态：**已关闭**
- 链接：apache/iceberg PR #15817
- 价值判断：该 PR 试图为 `MetricsConfig` 提供一个直接生成“full metrics”配置的辅助方法，以满足 Trino 默认采集全部指标的诉求。
- 影响分析：
  - 反映出 **下游引擎（尤其 Trino）对指标采集配置 API 稳定性** 的需求；
  - 背后是 `MetricsConfig.fromProperties(...)` 已弃用后，调用方希望获得更清晰、安全的替代路径。
- 结论：虽然 PR 关闭，但这是一个明确的 API 演进信号，未来可能以 **不同接口设计** 重新进入主线。

#### PR #15805 - ci: add tag as inline comment
- 状态：**已关闭**
- 链接：apache/iceberg PR #15805
- 价值判断：聚焦 CI/infrastructure，目标是改进对 GitHub Actions `uses:` 版本钉住/tag 使用情况的提示。
- 影响分析：
  - 属于供应链/CI 卫生类工作；
  - 虽非核心查询引擎能力，但关系到仓库自动化维护质量。
- 结论：短期业务影响有限，但反映维护者对 **基础设施合规性** 依然敏感。

### 2.2 已关闭 Issue

#### Issue #14079 - Flink job stuck at the “INITIALIZING” stage when using RANGE distribution mode
- 状态：**已关闭**
- 链接：apache/iceberg Issue #14079
- 影响方向：**Flink 分布式写入稳定性**
- 问题概要：Flink 1.19 + Iceberg 1.8.1 在 `RANGE` distribution mode 下，多次 savepoint/restart 后作业可能卡在 `INITIALIZING` 阶段。
- 研判：
  - 问题涉及 **Flink sink 生命周期、状态恢复与分布策略协同**；
  - 尽管已关闭，但该类问题通常对生产环境影响较大，因为会直接表现为作业恢复失败或长时间不可用。
- 项目意义：说明社区对 Flink 写入恢复路径的边界问题仍在持续清理。

---

## 3. 社区热点

以下按“讨论热度/技术代表性”排序：

### 3.1 Issue #12937 - Remove JUnit4 dependency from Flink
- 标签：`improvement`, `good first issue`
- 评论：**18**
- 链接：apache/iceberg Issue #12937
- 关联 PR：**#15815**
- 热点原因：
  - 这是今天最明确的“**Issue -> PR 落地**”链路之一；
  - 反映 Iceberg 持续推进 **测试栈现代化**，减少 JUnit4 残留依赖。
- 技术诉求分析：
  - Flink 模块测试类路径上仍可能透传旧版 JUnit；
  - 对 Java 17+、现代构建工具与测试框架兼容性不友好；
  - 长期看有助于降低模块间依赖污染。

### 3.2 Issue #14096 - Connection lost during persistTable with Hive Locks can cause overwritten metadata location
- 标签：`bug`, `stale`
- 评论：**13**
- 链接：apache/iceberg Issue #14096
- 热点原因：
  - 问题直接指向 **Hive catalog 元数据提交正确性**；
  - 一旦连接在 `persistTable` 期间中断，可能导致 metadata location 被覆盖或提交状态不确定。
- 技术诉求分析：
  - 用户核心诉求不是“报错提示更清晰”，而是 **在网络抖动/非确定性失败下保证提交原子性和可恢复性**；
  - 这与今天另一个 Glue 方向 PR #15530 的主题高度一致，说明社区正在系统性关注 **catalog 提交语义在异常路径下的正确性**。

### 3.3 Issue #13819 - Support Explicit tenantId/clientId/clientSecret in ADLSFileIO
- 标签：`improvement`, `stale`
- 评论：**5**
- 链接：apache/iceberg Issue #13819
- 热点原因：
  - Azure 用户希望摆脱隐式认证流程，明确配置服务主体凭据。
- 技术诉求分析：
  - `DefaultAzureCredential` 虽方便，但在多租户、CI/CD、跨订阅部署场景中并不总是可控；
  - 该诉求体现出 Iceberg 云存储接入层需要提供 **更显式、可审计、可自动化配置** 的认证方式。

### 3.4 Issue #14164 - ManifestFileBean is missing keyMetadata; SparkActions can't decrypt Avro
- 标签：`bug`, `stale`
- 评论：**3**
- 链接：apache/iceberg Issue #14164
- 热点原因：
  - 这是典型的 **安全/加密能力与 Spark 批处理动作框架集成不完整** 的问题。
- 技术诉求分析：
  - 当表启用文件加密后，Spark executor 端需要足够的 key metadata 才能解密 Avro；
  - 当前序列化链路遗漏 `keyMetadata`，导致 SparkActions 无法工作。
- 说明：该问题虽评论不多，但技术重要性高，属于 **高级功能可用性缺口**。

---

## 4. Bug 与稳定性

按潜在严重程度排序：

### P1 - Hive 锁场景下元数据位置可能被覆盖
#### Issue #14096
- 状态：OPEN
- 链接：apache/iceberg Issue #14096
- 场景：Spark + Hive 3.1.2 Locks + Iceberg 1.9.2
- 风险：
  - `persistTable` 期间连接丢失后，提交结果可能处于不确定状态；
  - 最坏情况下造成 **metadata location 覆盖/元数据不一致**。
- 严重性判断：**高**
- 是否已有 fix PR：**未见直接关联 fix PR**
- 备注：这与 PR #15530 的设计思想相呼应——对 **非确定性 catalog 提交异常** 进行提交状态确认，而不是直接假定失败。

### P1 - SparkActions 在加密 Avro 场景下无法解密
#### Issue #14164
- 状态：OPEN
- 链接：apache/iceberg Issue #14164
- 场景：Iceberg 1.10.0 + Spark + table file encryption
- 风险：
  - 启用加密的表无法正常运行 SparkActions；
  - 影响依赖动作框架的维护、重写、整理类操作。
- 严重性判断：**高**
- 是否已有 fix PR：**当前数据中未见关联修复 PR**

### P2 - NullabilityHolder.reset() 未清理 isNull 数组
#### Issue #15808
- 状态：OPEN
- 链接：apache/iceberg Issue #15808
- 关联修复：**PR #15809**
- PR 链接：apache/iceberg PR #15809
- 风险：
  - `reset()` 只清 `numNulls`，不清 `isNull`，会留下前一批数据的空值标记；
  - 当前调用链“碰巧”会覆写所有位置，因此暂未直接造成错误结果，但这是一个 **隐蔽状态污染点**。
- 严重性判断：**中**
- 修复状态：**已有修复 PR，推进较快**
- 价值：体现社区对 **未来回归风险预防** 比较敏感。

### P2 - Flink RANGE 分布模式恢复时卡在 INITIALIZING
#### Issue #14079
- 状态：CLOSED
- 链接：apache/iceberg Issue #14079
- 风险：
  - 影响 Flink 作业恢复能力；
  - 对高并发、长跑作业生产环境影响明显。
- 严重性判断：**中高**
- 当前状态：**已关闭**，但建议后续关注是否有明确修复提交或版本说明落地。

### P2 - Glue 在非确定性 AWS 错误下可能误删已提交 metadata
#### PR #15530
- 状态：OPEN
- 链接：apache/iceberg PR #15530
- 风险：
  - 如果 Glue 实际已提交，但客户端因 timeout 误判失败并删除新 metadata 文件，可能造成 **表指向不存在的 metadata 文件**；
  - 属于 **catalog 提交正确性/元数据破坏** 类问题。
- 严重性判断：**高**
- 说明：虽然这是 PR 而非新 issue，但它修复的问题非常关键，值得重点关注合并进展。

---

## 5. 功能请求与路线图信号

### 5.1 Flink 去 JUnit4 化基本进入实施阶段
- Issue：#12937
- PR：#15815
- 链接：
  - apache/iceberg Issue #12937
  - apache/iceberg PR #15815
- 研判：
  - 这是一个清晰的工程治理项，且已有对应 PR；
  - 大概率会被纳入近期版本或主干，属于 **低风险、高确定性** 改进。

### 5.2 ADLSFileIO 显式认证配置是明确的云集成需求
- Issue：#13819
- 链接：apache/iceberg Issue #13819
- 研判：
  - 当前仍停留在需求层，但其业务场景真实且典型；
  - 若 Azure 生态贡献者持续推进，后续很可能进入设计/PR 阶段。
- 纳入概率：**中等**

### 5.3 Secondary Index metadata handling 仍处于 POC 探索期
- PR：#15101
- 链接：apache/iceberg PR #15101
- 研判：
  - 二级索引元数据处理是中长期能力演进信号；
  - 但目前标注为 POC，涉及 API/core/docs/OpenAPI，多模块面广，短期直接落地为正式功能的概率不高。
- 纳入概率：**中低，但战略意义高**

### 5.4 Flink Sink 可插拔 WriteObserver 暗示更强的元数据扩展能力
- PR：#15784
- 链接：apache/iceberg PR #15784
- 研判：
  - 该接口允许逐条记录观察并生成 per-checkpoint 元数据，最终写入 snapshot summary；
  - 对审计、血缘、定制指标、业务元信息沉淀都很有价值。
- 纳入概率：**中高**
- 意义：这是明显的 **Flink Sink 扩展性路线** 信号。

### 5.5 ORC lineage 支持正在补齐 V3 表能力
- PR：#15776
- 链接：apache/iceberg PR #15776
- 研判：
  - 当前 V3 lineage 在 Parquet/Avro 已有支持，ORC 侧存在缺口；
  - 此 PR 补充 `_row_id` 与 `_last_updated_sequence_number` 读取能力，属于格式能力对齐。
- 纳入概率：**中高**
- 意义：这对 Iceberg V3 特性在多文件格式上的一致性非常关键。

### 5.6 Avro local-timestamp 逻辑类型支持持续推进
- PR：#15454, #15455
- 链接：
  - apache/iceberg PR #15454
  - apache/iceberg PR #15455
- 研判：
  - Flink、Spark 双线并进，说明这不是单引擎偶发需求，而是 **格式兼容性补齐**；
  - 若测试与语义讨论收敛，有望进入后续版本。
- 纳入概率：**中高**

---

## 6. 用户反馈摘要

### 6.1 生产用户最在意的是“异常路径下元数据是否安全”
- 代表项：
  - Issue #14096
  - PR #15530
- 反馈画像：
  - 用户并非只关注吞吐和性能，更关心在 **网络中断、云服务超时、锁机制参与** 时，表元数据是否还能保持一致；
  - 这类反馈集中表明，Iceberg 在大规模生产使用中，**提交原子性与幂等恢复** 是最核心信任基础之一。

### 6.2 云环境用户希望认证方式更显式、更可控
- 代表项：Issue #13819
- 反馈画像：
  - 隐式 credential chain 对简单场景友好，但企业用户更偏好显式 `tenantId/clientId/clientSecret`；
  - 反映出多租户、自动化部署、权限审计等企业治理需求正在增强。

### 6.3 高级功能用户开始深入使用加密、血缘、WAP 等能力
- 代表项：
  - Issue #14164
  - PR #15776
  - PR #15807
- 反馈画像：
  - 社区已不再停留在“基本读写”，而是深入到 **文件加密、行级 lineage、Write-Audit-Publish** 等高级特性；
  - 这说明 Iceberg 的用户成熟度在上升，但也暴露出这些高级能力在跨模块协同时仍有细节缺口。

### 6.4 新贡献者体验仍是维护重点
- 代表项：
  - PR #15812
  - PR #15811
  - PR #15810
- 反馈画像：
  - 文档中的版本、Gradle 配置、开发站点导航过期，说明 onboarding 成本仍可能影响贡献效率；
  - 维护者和贡献者都在主动修补这些“非功能性阻塞”。

---

## 7. 待处理积压

以下是值得维护者额外关注的长期未决项：

### 7.1 Issue #14096 - Hive 提交异常路径的元数据覆盖风险
- 状态：OPEN, stale
- 链接：apache/iceberg Issue #14096
- 原因：
  - 虽标记 stale，但问题本质很严重；
  - 涉及 Hive catalog 正确性，不应仅因讨论间隔变长而降级优先级。

### 7.2 Issue #14164 - 加密 Avro + SparkActions 不兼容
- 状态：OPEN, stale
- 链接：apache/iceberg Issue #14164
- 原因：
  - 高级安全功能一旦不可用，会直接削弱企业场景采用意愿；
  - 建议尽快确认修复路径或最小 workaround。

### 7.3 Issue #13819 - ADLSFileIO 显式认证配置
- 状态：OPEN, stale
- 链接：apache/iceberg Issue #13819
- 原因：
  - 云环境适配需求明确；
  - 若长期搁置，可能促使用户自行 fork/包装，不利于统一生态。

### 7.4 PR #15101 - Secondary Index metadata handling POC
- 状态：OPEN, stale
- 链接：apache/iceberg PR #15101
- 原因：
  - 虽然是 POC，但其方向对 Iceberg 查询加速生态有潜在战略意义；
  - 建议维护者给出更明确的设计反馈：继续演进、拆分子任务，还是暂缓。

### 7.5 PR #15065 - Remove deprecated AccessController usage
- 状态：OPEN, stale
- 链接：apache/iceberg PR #15065
- 原因：
  - Java 17 已成最低版本后，这类清理工作具备现实必要性；
  - 长期悬而不决会增加后续兼容成本。

### 7.6 PR #15454 / #15455 - Avro local-timestamp 逻辑类型支持
- 状态：OPEN, stale
- 链接：
  - apache/iceberg PR #15454
  - apache/iceberg PR #15455
- 原因：
  - 格式兼容问题往往影响多引擎用户；
  - 若迟迟不合并，可能继续造成 Spark/Flink 行为不一致。

---

## 8. 结论：项目健康度评估

**总体健康度：良好偏积极。**  
今天的 Apache Iceberg 没有版本发布，但从 PR 和 Issue 活跃度看，项目仍保持稳定推进，且工作重心比较清晰：一方面在做 **工程治理、文档修缮、测试现代化**，另一方面在解决 **catalog 提交正确性、加密兼容、Flink/Spark 读写边界** 等更接近生产实际的问题。  
需要注意的是，若干标记为 `stale` 的 issue 实际技术风险并不低，尤其是 **Hive/Glue 元数据提交异常路径** 与 **加密能力可用性**，建议维护者避免仅按活跃度而忽视其优先级。  
从路线信号看，Iceberg 正持续加强 **多引擎一致性、V3 特性补齐、Flink Sink 扩展能力和云存储生态适配**，说明项目依然处于稳健演进期。

如果你愿意，我还可以进一步把这份日报整理成：
1. **适合团队群内发送的 200 字简报版**，或  
2. **适合公众号/周报归档的表格版**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-29）

## 1. 今日速览
过去 24 小时内，Delta Lake 社区活跃度中高：共有 **2 条 Issue 更新**、**12 条 PR 更新**，但**无新版本发布**、**无 PR 合并/Issue 关闭**。  
从主题分布看，开发重心非常集中，主要围绕 **Delta Kernel + Spark 的 CDC（Change Data Capture）流式处理能力** 进行成体系推进，同时 **Flink Sink** 路线也在持续铺设。  
值得注意的是，今日最重要的工程信号并非新增功能，而是一个可能导致 **静默数据丢失** 的并发提交竞态修复 PR，说明项目当前也在补强分布式提交路径上的稳定性。  
整体来看，项目处于**功能栈快速堆叠、但尚未进入收敛合并阶段**的状态：路线明确、实现活跃，但评审和落地节奏仍需继续观察。

---

## 2. 项目进展
> 今日 **无已合并/已关闭的重要 PR**。以下为当前最关键、最能代表推进方向的在途 PR。

### 2.1 Kernel-Spark CDC 流式能力进入系统化落地阶段
这一轮 PR 明显是一个 **stacked PR 序列**，显示 Delta Lake 正在将 CDC 能力从“日志动作解析”逐步推进到“流式 offset 管理、数据读取、schema 协调、端到端测试、Deletion Vector 支持”的完整链路。

- **Part 1：CDC streaming offset management（initial snapshot）**  
  链接: delta-io/delta PR #6075  
  说明：建立 CDC 流式读取的初始快照 offset 管理基础，是整条链路的起点。

- **Part 2：CDC commit processing（convert delta log actions to IndexedFiles）**  
  链接: delta-io/delta PR #6076  
  说明：把 delta log action 转为可消费的 `IndexedFiles`，属于 CDC 消费模型中的核心中间层。

- **Part 2.5：CDC admission limits for commit processing**  
  链接: delta-io/delta PR #6391  
  说明：加入 commit processing 的 admission limit，意味着开始考虑流式 CDC 在高吞吐/长日志链路下的资源控制问题。

- **Part 3：CDC streaming offset management（finish wiring up incremental change processing）**  
  链接: delta-io/delta PR #6336  
  说明：完成增量变更处理的 offset 接线，表明 CDC 不再局限于初始快照，而是在向持续增量消费闭环演进。

- **Part 4：CDC data reading: ReadFunc decorator and null-coalesce**  
  链接: delta-io/delta PR #6359  
  说明：涉及 CDC 数据读取层实现细节，尤其是读取函数包装与空值协调，反映出实现已经深入到执行层。

- **Part 5：CDC schema coordination in ApplyV2Streaming and SparkScan**  
  链接: delta-io/delta PR #6362  
  说明：处理流式 ApplyV2 与 SparkScan 的 schema 协调，是 CDC 真正可用前必须解决的兼容性问题。

- **Part 6：End-to-end CDC streaming integration tests**  
  链接: delta-io/delta PR #6363  
  说明：加入端到端集成测试，通常说明功能已经开始从“可实现”转向“可验证”。

- **Support allowOutOfRange for CDC startingVersion in DSv2 streaming**  
  链接: delta-io/delta PR #6388  
  说明：对 `startingVersion` 超范围场景做容错支持，体现出对生产环境可操作性的增强。

- **Part 7：DV+CDC same-path pairing and DeletionVector support**  
  链接: delta-io/delta PR #6370  
  说明：将 **Deletion Vector** 与 CDC 打通，是本轮最重要的兼容性推进之一，意味着 Delta 正在补齐复杂变更场景下的查询正确性能力。

### 2.2 Flink 方向继续铺设落地基础
- **[Flink] Readme & Docker Compose**  
  链接: delta-io/delta PR #6431  
  说明：虽然这是文档与环境类 PR，但对于新连接器/新 Sink 生态而言非常关键，说明 Flink 支持已不仅是设计讨论，而是在向开发者可试用、可复现实验环境迈进。

### 2.3 Sharing 兼容性细节修正持续推进
- **DeltaFormatSharingSource only finish current version when startOffset is from Legacy**  
  链接: delta-io/delta PR #6392  
  说明：该 PR 聚焦 Delta Sharing 场景下 Legacy offset 起点的版本完成逻辑，属于典型的流式语义兼容修复，体现项目在非核心主线之外也持续补边角稳定性。

### 2.4 并发提交路径出现关键稳定性修复
- **Fix race condition in commitFilesIterator causing silent data loss with coordinated commits**  
  链接: delta-io/delta PR #6353  
  说明：这是今日最值得关注的修复型 PR。其描述指出在 coordinated commits 场景下，`commitFilesIterator` 两阶段发现 commit 文件时，可能因并发 backfill 导致提交记录被遗漏，进而产生**静默数据丢失**。  
  这类问题直接触及 Delta 的事务日志可见性与读取完整性，是高优先级稳定性议题。

---

## 3. 社区热点
> 由于提供的数据中未包含完整评论数排序信息，以下按“技术影响面”和“工程信号强度”判断热点。

### 热点一：Kernel-Spark CDC 大规模堆叠 PR
涉及 PR：
- delta-io/delta PR #6075
- delta-io/delta PR #6076
- delta-io/delta PR #6336
- delta-io/delta PR #6359
- delta-io/delta PR #6362
- delta-io/delta PR #6363
- delta-io/delta PR #6370
- delta-io/delta PR #6388
- delta-io/delta PR #6391

**技术诉求分析：**
这组 PR 说明社区/核心维护者正在推动 **Delta Kernel 在 Spark DSv2 流式场景中原生支持 CDC**。  
背后的核心诉求不是单点功能，而是完整能力栈：
1. 从 delta log 提取变更；
2. 管理初始快照与增量 offset；
3. 协调 schema 演进；
4. 处理 DV 等高级存储语义；
5. 通过 E2E 测试保证正确性。

这说明 Delta Lake 正在把 CDC 从“日志能力”继续产品化为“查询引擎可稳定消费的流式接口”。

### 热点二：Flink Sink 路线开始具象化
- Issue: delta-io/delta Issue #5901
- PR: delta-io/delta PR #6431

**技术诉求分析：**
Flink Sink 不是孤立需求，而是 Delta Kernel 对外扩展生态的关键一步。  
Issue #5901 明确是一个 epic，表明维护团队已将 **基于 Delta Kernel 构建 Flink Sink** 作为正式路线追踪事项。PR #6431 补 Readme 与 Docker Compose，进一步说明这一方向正在建设开发、测试和演示基础设施。  
这通常意味着：未来 Delta 不再仅强调 Spark 生态，而是继续强化其作为**开放表格式存储层**的多引擎写入能力。

### 热点三：Kernel-Spark Engine 创建逻辑重构需求
- Issue: delta-io/delta Issue #5675

**技术诉求分析：**
该 Issue 要求将 `DefaultEngine.create(...)` 从多个散落调用点集中为统一工厂，并在创建后显式传递 engine。  
这不是用户端新功能，但对维护性非常重要，反映出 kernel-spark 当前内部存在：
- engine 生命周期管理分散；
- 实现替换不方便；
- 测试注入/扩展性较弱。  
这类重构往往是后续支持更多引擎适配、增强测试隔离和减少隐式依赖的前置工作。

---

## 4. Bug 与稳定性
按严重程度排序：

### P0 / 高风险：coordinated commits 下可能出现静默数据丢失
- **PR**: delta-io/delta PR #6353  
- **标题**: Fix race condition in commitFilesIterator causing silent data loss with coordinated commits

**问题概述：**  
`commitFilesIterator` 采用两阶段发现 commit 文件：  
1. 先从文件系统列出已 backfill 文件；  
2. 再向 coordinator 查询未 backfill 提交。  

若两个阶段之间发生并发 backfill，可能导致某些提交既不在阶段一结果里，也不在阶段二结果里，从而被遗漏。PR 描述明确指出后果是 **silent data loss**。

**影响判断：**
- 涉及事务日志发现与提交可见性；
- 属于分布式并发边界条件；
- 风险大于普通 crash，因为“静默错误”更难被用户察觉。

**修复状态：**
- 已有 fix PR，**尚未合并**。  
- 建议维护者优先评审与补充回归测试。

---

### P1 / 中高风险：Sharing 流式起点语义可能不一致
- **PR**: delta-io/delta PR #6392  
- **标题**: DeltaFormatSharingSource only finish current version when startOffset is from Legacy

**问题概述：**  
该问题聚焦 Delta Sharing Source 在 `startOffset` 来自 Legacy 场景时，对“完成当前版本”的判断逻辑。  
这类问题通常会影响：
- 流式处理边界；
- 重复消费或漏消费；
- 新旧 offset 语义兼容。

**修复状态：**
- 已有修复 PR，**尚未合并**。

---

### P2 / 预防性稳定性改进：CDC 处理资源与边界约束
- **PR**: delta-io/delta PR #6391  
- **标题**: CDC admission limits for commit processing

**问题概述：**  
虽然不一定对应已爆出的线上 bug，但 admission limits 往往用于防止 CDC commit 处理在大提交量或复杂事务场景下出现资源失控、处理抖动或延迟不可控。  
这反映 CDC 能力推进已进入“生产可运行性”阶段。

**修复/增强状态：**
- 在途 PR，属于前瞻性稳定性增强。

---

## 5. 功能请求与路线图信号

### 5.1 Flink Sink 是明确路线项，进入执行阶段
- **Issue**: delta-io/delta Issue #5901  
- **标题**: [Flink] Create Delta Kernel based Flink Sink

这是一个典型的 epic issue，且明确记录了 milestone 和关联 PR。结合当前已出现的环境/文档 PR（delta-io/delta PR #6431），可以较高置信度判断：
- **Flink Sink 很可能会进入后续版本或预览构建**
- 实现方式将以 **Delta Kernel** 为基础，而非单独再造一套 Sink 栈

这对 Delta 的生态意义很大：它有助于形成 Spark 之外的流式写入入口，提升在实时数仓/湖仓场景中的引擎中立性。

### 5.2 Kernel-Spark 引擎工厂抽象可能成为后续重构基础
- **Issue**: delta-io/delta Issue #5675  
- **标题**: Centralize DefaultEngine.create(...) and pass engine as a parameter after creation.

该需求本身不是用户可见特性，但其信号很明确：
- kernel-spark 内部结构正在为更强的可替换性、可测试性做准备；
- 若未来要支持更多运行环境、测试模式或 engine 实现，这类重构很可能是必要前置条件。

**纳入下一版本的可能性判断：**
- 若近期 kernel-spark CDC 大量合并，此类基础设施重构可能作为配套工作进入同一开发周期；
- 但优先级可能低于当前 CDC 主线与并发数据正确性修复。

### 5.3 CDC 流式支持大概率是下一阶段的核心交付主题
从 PR 数量、连续 Part 编号、覆盖范围来看，**Kernel-Spark CDC streaming** 已经是当前最强路线图信号。  
若后续几天开始出现合并，预计会成为下一个版本周期中的关键卖点之一，特别是在：
- DSv2 streaming
- startingVersion 语义
- Deletion Vector 兼容
- 端到端 CDC 可验证性

---

## 6. 用户反馈摘要
基于当前 Issue 摘要与更新内容，可归纳出以下真实痛点：

### 6.1 用户/开发者希望 Delta Kernel 能更自然地扩展到 Flink 写入侧
- 参考: delta-io/delta Issue #5901  
这表明用户场景不再局限于 Spark 主导的数据处理栈，而是希望在 **Flink 实时写入 + Delta 表存储** 的组合下获得原生支持。  
真实诉求包括：
- 降低跨引擎接入成本；
- 统一流批湖仓存储层；
- 依托 Delta Kernel 实现更轻量、更标准化的 connector/sink。

### 6.2 kernel-spark 内部实现复杂度开始影响可维护性
- 参考: delta-io/delta Issue #5675  
`DefaultEngine.create(...)` 在多个位置重复调用，说明内部依赖注入方式可能不够统一。  
这类反馈通常来自实际开发者或维护者在扩展代码时遇到的问题，痛点不是“功能缺失”，而是：
- 改动面过大；
- 实现耦合；
- 不利于 mock/test；
- 难以替换 engine 实现。

### 6.3 CDC 的真实落地场景已从“能读”转向“读得对、读得稳”
从这一轮 CDC PR 涵盖 offset、schema、DV、测试、admission limit 可见，使用者真正关心的是：
- 初始快照与增量衔接是否正确；
- schema 演进时是否稳定；
- 遇到删除向量、边界版本、超范围 startingVersion 时是否可控；
- 流式语义是否一致。  
这说明社区对 CDC 的期待已经进入生产级要求，而非实验性体验阶段。

---

## 7. 待处理积压
> 以下项目虽有更新，但从创建时间和当前状态看，值得维护者持续关注。

### 7.1 长周期 CDC stacked PR 序列，评审压力较大
涉及：
- delta-io/delta PR #6075
- delta-io/delta PR #6076
- delta-io/delta PR #6336
- delta-io/delta PR #6359
- delta-io/delta PR #6362
- delta-io/delta PR #6363
- delta-io/delta PR #6370
- delta-io/delta PR #6388
- delta-io/delta PR #6391

**关注原因：**
- 起始 PR #6075、#6076 自 2026-02-19 起已存在一个多月；
- 大量 stacked PR 虽有利于分层审查，但也可能造成“前置 PR 不合并，后续全部阻塞”的链式积压；
- 若近期不能完成主干合并，后续 rebase 和上下文理解成本会持续增加。

### 7.2 Flink Sink Epic 已启动，但仍处于路线追踪期
- delta-io/delta Issue #5901

**关注原因：**
- 已被明确为 epic，但目前从数据看仍以规划与基础设施铺设为主；
- 若缺少核心数据路径 PR 的持续推进，可能长期停留在“有路线、无可用预览”的阶段。

### 7.3 kernel-spark 内部工厂重构需求存在，但尚未见对应 PR
- delta-io/delta Issue #5675

**关注原因：**
- 此类技术债问题通常不紧急，但会放大后续功能开发成本；
- 当前 CDC 开发密集，越晚处理，越可能导致更多调用点继续扩散。

### 7.4 高优先级正确性修复 PR 需尽快处理
- delta-io/delta PR #6353

**关注原因：**
- 涉及 silent data loss；
- 如果该问题已影响真实 coordinated commits 使用者，则其优先级应高于大多数新特性 PR。

---

## 8. 健康度评估
**总体健康度：良好偏积极，但处于“开发堆叠期”。**

**积极信号：**
- 主线研发方向明确，CDC 与 Flink 路线都在持续推进；
- PR 数量高，且不是零散修补，而是成体系工程演进；
- 已开始补充 E2E 测试与边界行为支持，说明关注生产可用性。

**风险信号：**
- 今日无合并，说明评审吞吐暂时落后于开发提交速度；
- CDC stacked PR 链过长，存在积压与上下游阻塞风险；
- 出现 silent data loss 级别并发问题，提醒维护者持续关注事务日志与协调提交路径的正确性。

---

如需，我还可以继续把这份日报整理成更适合团队晨会使用的 **“TL;DR + 风险清单 + 值得跟进 PR Top 5”** 版本。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时内，Databend 项目整体活跃度较低，但仍有明确的质量修复与自动化巡检信号：新增/活跃 Issue 1 条、活跃 PR 1 条、无新版本发布。  
从内容看，今日重点不在大规模功能迭代，而是在 **SQL/类型转换兼容性修复** 与 **文档链接健康检查** 两个方面。  
当前唯一活跃 PR 聚焦 `VARIANT` 到数值类型的转换逻辑，属于查询引擎语义正确性与兼容性改进，说明团队仍在持续打磨半结构化数据处理体验。  
同时，自动化 Link Checker 报告暴露出文档中的失效链接问题，表明项目在文档治理与 CI 质量保障方面保持运转。  
综合评估：**今日活跃度偏低，但工程健康度稳定，工作重心偏向正确性修复与基础维护。**

---

## 2. 项目进展

今日无已合并/已关闭的重要 PR；当前主要推进中的变更如下：

### 进行中 PR：修复 `VARIANT` 转数值类型的行为
- **PR**: #19623 `[pr-bugfix] fix(query): fix variant cast to number`
- **状态**: OPEN
- **作者**: @b41sh
- **创建/更新**: 2026-03-26 / 2026-03-29
- **链接**: https://github.com/databendlabs/databend/pull/19623

#### 变更内容
该 PR 允许 `VARIANT` 中的浮点数值被转换为整数类型，并在转换过程中采用**四舍五入/舍入**方式处理。  
PR 摘要给出的例子表明，Databend 正在改进半结构化数据（如 JSON/VARIANT）到标量数值类型的 cast 行为。

#### 技术意义
这类修复通常影响以下几个方面：

- **SQL 兼容性**：提升与用户直觉、以及其他分析型数据库在半结构化数据处理上的一致性。
- **查询正确性**：避免 `VARIANT` 中数值在 cast 时出现不必要失败，减少运行时类型转换报错。
- **ETL/ELT 可用性**：对 ingest JSON、日志、事件数据的用户尤其重要，能降低预清洗成本。

#### 影响判断
虽然该 PR 尚未合并，但它是今日最值得关注的查询引擎修复项。若顺利合入，预计会直接改善：
- JSON/半结构化字段投影后的数值转换体验
- 数据湖/日志分析场景中的 SQL 兼容性
- 下游 BI / 数据转换任务对松散 schema 数据的容错能力

---

## 3. 社区热点

由于过去 24 小时仅有 1 条 Issue 与 1 条活跃 PR，今日热点集中度很高。

### 热点 1：`VARIANT` 转数值类型修复
- **链接**: https://github.com/databendlabs/databend/pull/19623
- **类型**: Bugfix PR
- **热度指标**: 今日唯一活跃 PR

#### 背后的技术诉求
Databend 的 `VARIANT` 类型承载了大量半结构化数据处理需求。用户通常希望：
- 从 JSON/VARIANT 中直接抽取数值字段；
- 将浮点表示的数值进一步 cast 为整数列；
- 在不额外写复杂清洗逻辑的前提下完成分析查询。

因此，该 PR 反映出社区对 **半结构化数据 SQL 语义一致性** 的持续诉求，尤其是对类型系统边界行为的明确化。

---

### 热点 2：自动化文档链接巡检
- **Issue**: #19630 `[report, automated issue] Link Checker Report`
- **状态**: OPEN
- **作者**: @github-actions[bot]
- **链接**: https://github.com/databendlabs/databend/issues/19630

#### 背后的技术诉求
该 Issue 显示自动化工具扫描了 117 个链接，其中：
- 成功：114
- 错误：1
- 排除：1

这说明项目文档体系总体健康，但仍存在至少 1 个失效链接。  
对开源数据库项目而言，文档链接质量并非“小问题”——它直接影响：
- 新用户接入体验
- 开发文档可达性
- 社区贡献者定位源码/设计文档的效率

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P2：`VARIANT` 浮点数 cast 为整数的行为不符合预期
- **关联 PR**: #19623
- **链接**: https://github.com/databendlabs/databend/pull/19623
- **状态**: 已有修复 PR，待合并

#### 问题描述
当前 Databend 在某些情况下不允许将 `VARIANT` 中的浮点数转换为整数，或转换行为不符合预期。PR 提议允许该转换，并在转换时进行舍入。

#### 影响范围
- 使用 JSON/VARIANT 存储指标、金额、事件值的查询场景
- 依赖 cast 进行 schema-on-read 的分析任务
- 需要将半结构化数值字段映射到整型指标列的 ETL 流程

#### 风险判断
这属于 **查询正确性/兼容性问题**，一般不会造成系统崩溃，但会导致：
- SQL 运行失败
- 结果与用户预期不一致
- 数据处理脚本需要额外绕行

---

### P4：文档存在失效链接
- **Issue**: #19630
- **链接**: https://github.com/databendlabs/databend/issues/19630
- **状态**: OPEN

#### 问题描述
自动化 Link Checker 报告发现 1 个链接错误，位置位于 `./src/query/sql/README...`（摘要被截断，完整路径需查看 Issue）。

#### 影响范围
- 文档可访问性
- 开发者 onboarding
- README / SQL 文档导航体验

#### 风险判断
不影响数据库内核稳定性，但会影响项目文档质量与用户认知。

---

## 5. 功能请求与路线图信号

今日没有明确的新功能请求 Issue。  
不过，从活跃 PR #19623 可以观察到一个较清晰的路线图信号：

### 信号：继续强化半结构化数据类型系统与 SQL 兼容性
- **参考 PR**: #19623
- **链接**: https://github.com/databendlabs/databend/pull/19623

#### 可能的后续方向
基于本次修复，后续很可能继续推进：
- `VARIANT` 与标量类型之间更完整的 cast 规则
- 数值边界条件、舍入/截断语义的一致化
- 与 JSON 提取函数、表达式求值、聚合前转换等场景的联动优化

#### 是否可能纳入下一版本
虽然今日没有 release，但此类修复属于：
- 用户可感知度高
- 风险相对可控
- 直接提升 SQL 可用性

因此，**若评审顺利，通过后较有可能进入下一次常规版本发布**。

---

## 6. 用户反馈摘要

今日数据中没有带评论的用户讨论，Issue/PR 的互动量较低，因此可提炼的直接用户反馈有限。  
不过，从现有变更主题可以推断出真实痛点主要集中在：

1. **半结构化数据处理不够顺滑**  
   用户希望 `VARIANT` 字段中的数值能够更自然地参与 SQL cast 与分析流程。  
   参考：#19623  
   链接：https://github.com/databendlabs/databend/pull/19623

2. **文档稳定可访问**  
   自动化巡检说明维护者仍然重视文档质量，这通常是用户持续反馈中较常见但不高声量的一类需求。  
   参考：#19630  
   链接：https://github.com/databendlabs/databend/issues/19630

整体来看，今日没有明显暴露出性能退化、重大兼容性回归或线上稳定性事故类反馈。

---

## 7. 待处理积压

基于今日给出的数据，暂未看到“长期未响应”的重要 Issue 或 PR 列表。  
但从当前活跃项来看，以下内容值得维护者尽快处理：

### 需关注 1：PR #19623 评审与合并节奏
- **链接**: https://github.com/databendlabs/databend/pull/19623

这是今日唯一与查询引擎行为修复直接相关的活跃 PR。建议优先确认：
- 舍入语义是否符合 Databend 既有类型转换规则
- 是否覆盖负数、小数边界、溢出等测试用例
- 是否与现有 SQL 兼容性策略一致

### 需关注 2：Issue #19630 文档链接修复
- **链接**: https://github.com/databendlabs/databend/issues/19630

建议尽快定位具体失效链接并修复，以避免自动化报告持续产生噪音，也能维持文档仓库整洁度。

---

## 8. 总结判断

Databend 在 2026-03-29 的项目动态以**低活跃、稳维护**为主，没有版本发布，也没有大规模特性合并。  
最值得关注的是 PR #19623，它体现了项目在 **半结构化数据支持、SQL 类型转换正确性** 方面的持续完善。  
同时，自动化文档巡检继续运作，说明项目基础工程治理保持正常。  
项目健康度整体良好，短期建议关注该 cast 修复的评审结果，以及文档链接问题的收敛速度。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

以下是 **Velox** 在 **2026-03-29** 的项目动态日报。

---

# Velox 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时内，Velox **无 Issue 更新**，但 **PR 活跃度较高**：共有 **9 条 PR 更新**，其中 **8 条处于待合并状态**、**1 条已合并/关闭**。  
从变更内容看，今日开发重点集中在 **GPU 执行能力扩展（cuDF）**、**Join 正确性修复**、**存储/元数据 IO 优化**、以及 **Spark SQL 兼容性回归修复**。  
整体上，项目表现出**典型的“核心开发推进日”特征**：外部问题反馈较少，但内部功能演进和性能/正确性打磨较活跃。  
健康度方面，Velox 当前仍保持较强的引擎演进节奏，尤其是在 **GPU 加速算子覆盖面** 与 **Nimble/Spill/Join 等基础设施优化** 上信号明确。

---

## 2. 项目进展

### 已合并 / 已关闭的重要 PR

#### 2.1 构建影响分析工作流落地，提升 PR CI 效率
- **PR**: #16827 [CLOSED][Merged] build: Add build impact analysis workflow for PRs  
- **链接**: https://github.com/facebookincubator/velox/pull/16827

**进展解读：**  
该 PR 新增了一个针对 PR 的 **build impact analysis workflow**，能够分析代码改动会影响哪些 CMake targets。它通过：
- CMake File API 建立源码到 target 的映射
- `g++ -MM` + `compile_commands.json` 扫描头文件依赖

来判断变更波及范围。

**价值：**
- 有利于缩小 CI 构建/测试范围
- 提高大仓 PR 的反馈效率
- 对频繁修改执行器、表达式、连接器的 Velox 项目尤为重要

**影响面：**
这不是查询功能本身的直接增强，但属于**研发基础设施的重要升级**，将提高后续功能 PR 的迭代速度与回归定位效率。

---

## 3. 社区热点

> 由于提供的数据中无评论数、reaction 等有效数值，以下“热点”以**技术影响范围**和**变更体量**为主进行判断。

### 3.1 GPU Window 算子：Velox GPU 执行栈继续扩张
- **PR**: #16892 [OPEN] feat(cudf): Add GPU-accelerated Window operator  
- **链接**: https://github.com/facebookincubator/velox/pull/16892

**热点原因：**  
这是今天最有代表性的功能型 PR 之一。它为 Velox 增加了基于 cuDF 的 **GPU Window operator (`CudfWindow`)**，并补充了：
- `CudfConversion` 输出类型处理修复
- `ToCudf` 错误信息增强

**技术诉求分析：**
- Window 是典型的高开销分析算子，尤其在排序、分区、rolling/scan 场景中非常消耗 CPU
- 引入 GPU 版本说明 Velox 正在把 GPU 加速从基础算子逐步扩展到**更复杂的分析型算子**
- 对于大规模 OLAP、时间序列窗口分析、宽表聚合场景有较强吸引力

---

### 3.2 GPU Cross Join：cuDF 路线从常规 join 向特殊 join 扩展
- **PR**: #16942 [OPEN] feat(cudf): add GPU NestedLoopJoin (cross join) implementation  
- **链接**: https://github.com/facebookincubator/velox/pull/16942

**热点原因：**  
该 PR 增加了 `CudfNestedLoopJoinBuild` 和 `CudfNestedLoopJoinProbe`，实现 **inner cross join（无 filter）** 的 GPU 执行。

**技术诉求分析：**
- Cross join 尽管不是最常见 join 类型，但在某些生成式分析、维度扩展、组合枚举场景中必不可少
- 这表明 Velox 的 GPU 路线不只是追求“常见 SQL 算子可跑”，而是在补齐**完整执行语义覆盖**
- 如果后续再叠加 filter 支持，GPU Join 子系统会更接近生产可用的通用引擎能力

---

### 3.3 Nimble 元数据 IO 优化：面向分析型存储访问模式的缓存增强
- **PR**: #16948 [OPEN] feat: Optimize Nimble metadata IO with MetadataCache and pinned caching  
- **链接**: https://github.com/facebookincubator/velox/pull/16948

**热点原因：**  
该 PR 直接优化 Nimble 的元数据 IO，包括：
- stripe groups
- cluster index
- chunk index

通过引入更稳定的 `MetadataCache` 与 pinned caching，解决弱引用缓存容易过早失效的问题。

**技术诉求分析：**
- 分析型查询经常跨多个 stripe/segment 反复读取元数据
- 弱引用缓存命中不稳定会引发重复 IO、元数据反序列化开销上升
- 此 PR 明显面向**高并发扫描 / 多 stripe group 访问**工作负载，属于典型的 OLAP 存储层性能优化

---

### 3.4 IndexLookupJoin 可追踪/可回放：调试与重现能力增强
- **PR**: #16950 [OPEN] feat: Trace index splits in IndexLookupJoin for replay  
- **链接**: https://github.com/facebookincubator/velox/pull/16950

**热点原因：**  
该 PR 为 `IndexLookupJoin` 增加 index side split tracing，并提供对应 replayer。

**技术诉求分析：**
- 复杂查询问题常难以复现，特别是涉及 connector split、lookup side 输入差异时
- trace + replay 能显著提升线上问题回放与调试能力
- 对执行器、连接器、远端索引访问等复杂链路问题定位非常有帮助

---

## 4. Bug 与稳定性

今天没有新的 Issue 报告，但 PR 中出现了多项**明确的正确性/兼容性修复**。按影响严重程度排序如下：

### 4.1 高优先级：Counting Join 结果错误风险修复
- **PR**: #16949 [OPEN] Fix counting join count merge in HashTable::buildFullProbe  
- **链接**: https://github.com/facebookincubator/velox/pull/16949

**问题描述：**  
在 counting join（用于 `EXCEPT ALL` / `INTERSECT ALL`）场景中，如果多个 build drivers 处理了**重叠 key**，每个 driver 都会构建带计数的本地 hash table。合并过程中，`prepareJoinTable` / `buildFullProbe` 对重复 key 的处理方式可能导致**计数合并不正确**。

**潜在影响：**
- `EXCEPT ALL`
- `INTERSECT ALL`
- 多 driver 并行构建场景下的查询结果正确性

**严重性判断：高**  
这是典型的**查询正确性问题**，优先级明显高于性能类改进。

**是否已有修复：**
- 有，修复 PR 已提交，待合并：#16949

---

### 4.2 中优先级：Spark SQL `collect_set` 向后兼容性回归
- **PR**: #16947 [OPEN] fix(sparksql): Default ignoreNulls to true for collect_set backward compatibility  
- **链接**: https://github.com/facebookincubator/velox/pull/16947

**问题描述：**  
此前引入的改动导致 `SparkCollectSetAggregate` 中 `ignoreNulls_` 默认值变为 `false`。当用户调用单参数签名 `collect_set(T)` 时，`setConstantInputs()` 收不到布尔常量，结果默认行为变成 **RESPECT NULLS**，与既有 Spark 兼容语义不一致。

**潜在影响：**
- Spark SQL 兼容性
- 聚合函数结果差异
- 依赖旧行为的现有任务可能出现语义变化

**严重性判断：中高**  
虽不是崩溃问题，但属于**SQL 语义回归**，影响实际用户结果。

**是否已有修复：**
- 有，修复 PR 已提交，待合并：#16947

---

### 4.3 中优先级：cuDF 类型转换与错误信息改进
- **PR**: #16892 [OPEN] feat(cudf): Add GPU-accelerated Window operator  
- **链接**: https://github.com/facebookincubator/velox/pull/16892

**问题描述：**  
该 PR 附带修复 `CudfConversion` 输出类型处理，以及增强 `ToCudf` 错误信息。

**潜在影响：**
- GPU 执行路径类型一致性
- 出错时的可诊断性

**严重性判断：中**  
更偏向稳健性与可运维性提升，但对 GPU 功能迭代是必要配套。

---

## 5. 功能请求与路线图信号

虽然今日无新增 Issue，但从活跃 PR 可以提炼出若干**明确的产品路线信号**。

### 5.1 GPU 执行能力正在从“可用”走向“覆盖更多复杂分析算子”
相关 PR：
- #16892 GPU Window  
  https://github.com/facebookincubator/velox/pull/16892
- #16942 GPU NestedLoopJoin / Cross Join  
  https://github.com/facebookincubator/velox/pull/16942

**路线图信号：**
- Window、Cross Join 都不是最基础的算子，说明 GPU 路线已从早期基础 operator 支持，进入**复杂 SQL 执行能力补齐阶段**
- 若这些 PR 合并，下一阶段可能继续扩展：
  - 更多 join 变体
  - 更丰富的 window frame / function 支持
  - GPU/CPU 混合执行计划优化

**纳入下一版本可能性：高**

---

### 5.2 存储层与元数据访问路径持续优化，Nimble 集成深入
相关 PR：
- #16948 Optimize Nimble metadata IO  
  https://github.com/facebookincubator/velox/pull/16948
- #16721 Optimize spill RowContainer extracts vector for string  
  https://github.com/facebookincubator/velox/pull/16721

**路线图信号：**
- 一条线在做 **Nimble 元数据缓存优化**
- 另一条线在做 **spill 路径字符串提取的零拷贝/浅拷贝优化**

这反映出 Velox 仍在强化其作为分析型引擎底座的两个核心能力：
1. 高效扫描/读取列式数据
2. 在内存压力场景下控制 spill 成本

**纳入下一版本可能性：较高**

---

### 5.3 可回放可观测性建设增强，利于复杂算子线上问题定位
相关 PR：
- #16950 Trace index splits in IndexLookupJoin for replay  
  https://github.com/facebookincubator/velox/pull/16950

**路线图信号：**
- Velox 不仅在扩功能，也在补“**可调试性基础设施**”
- replay 能力对复杂 connector / split / join 问题排障价值很高
- 未来可能扩展到更多 operator tracing / deterministic replay 方向

**纳入下一版本可能性：中高**

---

### 5.4 SQL 兼容性仍是持续投入方向
相关 PR：
- #16947 fix(sparksql): collect_set backward compatibility  
  https://github.com/facebookincubator/velox/pull/16947

**路线图信号：**
- Spark SQL 兼容性不是一次性工作，而是持续修边角
- 这意味着 Velox 仍在积极服务多上层引擎生态，对兼容层质量要求较高

**纳入下一版本可能性：高**

---

## 6. 用户反馈摘要

由于今日 **无 Issues 更新**，也未提供 PR 评论内容，因此没有足够证据提炼“直接来自用户评论”的痛点陈述。  
不过从提交内容可反推当前用户/内部使用场景的真实关注点主要集中在：

1. **大规模分析查询的 GPU 加速需求**
   - Window、Cross Join 已开始进入 GPU 版本
   - 说明用户场景已不满足于仅加速简单过滤/投影/聚合

2. **复杂 Join 与集合运算的结果正确性**
   - counting join 修复指向生产级查询正确性要求较高
   - `EXCEPT ALL` / `INTERSECT ALL` 等边缘但重要语义被认真维护

3. **Spark SQL 兼容行为稳定性**
   - `collect_set` 回归修复说明兼容性细节直接影响用户任务行为
   - 用户显然依赖“与 Spark 一致”的默认语义

4. **存储与 spill 路径的性能敏感性**
   - 元数据缓存、字符串浅拷贝优化反映出 IO 与内存拷贝仍是热点瓶颈

---

## 7. 待处理积压

以下是从当前开放 PR 中，值得维护者重点关注的条目：

### 7.1 #16721 Spill 字符串提取优化，已开放较久
- **PR**: #16721 [OPEN] feat: Optimize spill RowContainer extracts vector for string  
- **链接**: https://github.com/facebookincubator/velox/pull/16721

**关注原因：**
- 创建于 **2026-03-11**，相对今天的其他 PR 属于“挂起时间较长”
- 其优化点是 `RowContainer::extractColumn` 的 shallow string copy，在 spill 序列化路径上减少不必要字符串复制
- 对内存压力大、spill 频繁的查询可能带来持续收益

**建议：**
- 尽快完成 benchmark 与生命周期安全性审查
- 重点确认 `setNoCopy()` 在 RowContainer 生命周期内的边界是否完全可靠

---

### 7.2 #16892 GPU Window 算子，影响面大，需重点评审
- **PR**: #16892 [OPEN] feat(cudf): Add GPU-accelerated Window operator  
- **链接**: https://github.com/facebookincubator/velox/pull/16892

**关注原因：**
- 这是影响面很大的能力扩展
- Window 语义复杂，涉及 frame、ordering、partitioning、null handling、type support 等多个维度
- 需要完善覆盖测试，避免 GPU/CPU 结果不一致

---

### 7.3 #16942 GPU Cross Join，需评估资源放大与执行计划适配
- **PR**: #16942 [OPEN] feat(cudf): add GPU NestedLoopJoin (cross join) implementation  
- **链接**: https://github.com/facebookincubator/velox/pull/16942

**关注原因：**
- Cross join 天然有结果集爆炸风险
- 虽然 GPU 能加速计算，但仍需明确：
  - 内存上限控制
  - fallback 策略
  - planner/executor 对该算子的适用边界

---

## 8. 总结判断

今天 Velox 没有版本发布，也没有新增 Issue，但从 PR 结构看，项目处于**强开发推进状态**。  
核心信号包括：

- **GPU 能力持续补齐**：Window 与 Cross Join 两个重要算子正在推进
- **查询正确性持续修复**：counting join 合并逻辑问题已被识别并修补
- **兼容性稳态维护**：Spark SQL `collect_set` 回归得到快速修复
- **底层性能基础设施增强**：Nimble 元数据缓存与 spill 字符串处理优化并行推进
- **工程效率提升**：build impact analysis workflow 已合并，利于后续研发提速

整体来看，Velox 当前不仅在做“更快”，也在做“更准、更稳、更易调试”，符合成熟分析型执行引擎的演进方向。

--- 

如果你愿意，我还可以进一步把这份日报整理成：
1. **适合发内部群的 200 字简报版**  
2. **适合周报汇总的表格版**  
3. **按“执行引擎 / 存储 / SQL 兼容 / 工程效率”四象限分类版**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时内，Apache Gluten 项目整体活跃度 **中等偏稳**：共有 **1 条 Issue 更新**、**3 条 PR 更新**，但**无 PR 合并、无 Issue 关闭、无新版本发布**。  
从内容看，今日工作重点仍集中在 **Velox 上游同步** 与 **Spark SQL 兼容性增强**，尤其是 `collect_list/collect_set` 行为对齐。  
社区讨论热度最高的仍是一个长期追踪型 Issue，用于跟踪 **尚未进入 Velox upstream 的有用 PR**，这表明 Gluten 与 Velox 的协同开发仍是当前核心工程议题。  
总体来看，项目健康度良好，但今日更多体现为 **持续集成推进与功能打磨**，而非里程碑式交付。

---

## 3. 项目进展

> 今日无已合并 PR、无已关闭 Issue，因此以下聚焦于“正在推进中的关键 PR”。

### 3.1 Velox 每日同步持续推进
- **PR #11845** `[BUILD, VELOX] [GLUTEN-6887][VL] Daily Update Velox Version (2026_03_28)`  
  链接: apache/gluten PR #11845

该 PR 继续执行 Gluten 对 Velox 上游的日常版本同步，纳入了多条上游新提交。  
这类 PR 对项目的意义主要体现在：

- 让 Gluten 持续跟进 Velox 的执行引擎能力、文档更新与内部重构；
- 降低长期漂移带来的集成风险；
- 为后续 SQL 功能支持、算子修复和性能优化提供底座。

从摘要可见，本次同步包含文档、shim target 引用重写等内容，虽然不一定直接面向终端用户，但对构建系统一致性和执行栈维护很关键。

---

### 3.2 Spark SQL 空值语义兼容性继续增强
- **PR #11837** `[VELOX] feat(velox): Support RESPECT NULLS for collect_list/collect_set`  
  链接: apache/gluten PR #11837

这是今天最值得关注的功能性 PR。它为 `VeloxCollectList` / `VeloxCollectSet` 增加 `ignoreNulls` 参数，以支持 Spark 的 **`RESPECT NULLS` 语法**（关联 SPARK-55256）。

技术价值：

- 改善 Gluten + Velox 在聚合函数上的 **Spark 语义对齐度**；
- 修复此前 `collect_list` / `collect_set` 对空值处理可能与 Spark 默认行为不完全一致的问题；
- 降低用户在 SQL 迁移、混合执行、回归验证中的语义偏差风险。

这类改动直接影响 **查询正确性**，优先级通常高于纯性能优化。

---

### 3.3 `collect_list` 类型覆盖测试继续补强
- **PR #11526** `[VELOX] [VL] Add comprehensive collect_list tests for type coverage and fallback`  
  链接: apache/gluten PR #11526

该 PR 虽创建较早，但在 3 月 28 日仍有更新，说明其仍处于活跃推进状态。  
其核心目标是为 `collect_list` 增加更完整的测试覆盖，包括：

- 多种 primitive types；
- fallback 行为；
- 更全面的聚合函数正确性验证。

技术意义：

- 为 `collect_list` 的 SQL 兼容性改动提供回归安全网；
- 降低不同数据类型、不同执行路径下的行为分歧；
- 与 PR #11837 形成明显呼应：**一个补语义，一个补测试**。

---

## 4. 社区热点

### 4.1 最活跃讨论：Velox 上游未合并 PR 跟踪器
- **Issue #11585** `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`  
  作者: @FelixYBW  
  评论: **16** | 👍: **4**  
  链接: apache/gluten Issue #11585

这是当前最热的社区议题，也是今天唯一更新的 Issue。  
该 Issue 的目的不是报告单点 Bug，而是作为一个 **“Velox 上游未合并有用 PR 的登记板”**，集中追踪 Gluten 社区提交但尚未进入 upstream 的改动。

背后的技术诉求非常明确：

1. **降低 fork 维护成本**  
   Issue 明确提到，团队没有全部 pick 到 `gluten/velox`，原因是 rebase 成本高。这说明当前最大痛点之一是：  
   **Gluten 与 Velox 并行演进时，补丁长期滞留会抬高维护复杂度。**

2. **提高功能落地可见性**  
   将有价值但未 upstream 的 PR 汇总出来，能帮助社区快速判断：
   - 哪些功能已实现但还未正式吸收；
   - 哪些修复值得临时 cherry-pick；
   - 哪些能力受制于上游节奏。

3. **释放路线图信号**  
   这个 tracker 类 Issue 本质上也在告诉使用者：  
   Gluten 的部分能力推进，不仅取决于本仓库开发节奏，也强依赖 **Velox upstream 合并进度**。

这类问题对使用者影响往往不是“今天能不能跑”，而是“未来半年维护风险和升级成本如何”。

---

## 5. Bug 与稳定性

今日未见明确新报出的崩溃类、数据损坏类或严重回归类 Bug Issue，但从 PR 内容可识别出若干 **潜在稳定性/正确性关注点**：

### 高优先级：聚合函数空值语义可能存在兼容性偏差
- **相关 PR:** #11837  
  链接: apache/gluten PR #11837

`collect_list/collect_set` 对 `RESPECT NULLS` 的支持，说明此前实现中对 null 元素的处理可能与 Spark 新语义存在差异。  
这类问题属于 **查询正确性/SQL 兼容性风险**，严重性高于普通 UI 或文档问题。

- 风险类型：查询结果语义偏差
- 当前状态：**已有 fix PR**
- 建议关注：是否补充了端到端回归测试、ANSI/非 ANSI 模式下是否一致

---

### 中优先级：`collect_list` 多类型与 fallback 路径覆盖不足
- **相关 PR:** #11526  
  链接: apache/gluten PR #11526

该 PR 的存在表明当前测试覆盖尚有缺口，特别是在不同 primitive type 和 fallback 情况下。  
这通常不是“已确认生产事故”，但意味着：

- 某些类型组合可能尚未被充分验证；
- Velox 路径与 Spark fallback 路径之间仍可能存在边界差异；
- 后续功能变更若缺少测试护栏，可能引入回归。

- 风险类型：回归风险 / 边界场景正确性风险
- 当前状态：**已有测试增强 PR**

---

### 低优先级：Velox 上游补丁未及时合入带来的长期稳定性隐患
- **相关 Issue:** #11585  
  链接: apache/gluten Issue #11585

这不是单一 bug，但它反映了一个工程稳定性问题：  
一些对 Gluten 有价值的修复或能力仍停留在“未 upstream”状态，可能导致：

- 本地补丁与上游版本长期分叉；
- 升级时 rebase 困难；
- 用户难以判断某些问题到底已修、待合入，还是仅存在于分支中。

- 风险类型：维护复杂度 / 集成稳定性
- 当前状态：**无直接 fix PR，依赖上游合并节奏**

---

## 6. 功能请求与路线图信号

### 6.1 Spark 聚合函数语义继续补齐，进入下一版本的概率高
- **PR #11837**  
  链接: apache/gluten PR #11837

`RESPECT NULLS` 支持属于典型的 **SQL 兼容性增强**，而且影响范围明确、用户价值直接。  
结合已有测试补强 PR #11526，可以判断：

- `collect_list/collect_set` 的语义完善很可能是近期版本的重要内容；
- 下一阶段重点很可能继续围绕 **Spark 聚合函数对齐** 展开，而不是单点性能优化。

**纳入下一版本概率：高**

---

### 6.2 测试体系补强是近期持续路线
- **PR #11526**  
  链接: apache/gluten PR #11526

该 PR 反映出社区不仅在加功能，也在补足：
- 类型覆盖；
- fallback 覆盖；
- 回归验证。

这说明 Gluten 当前路线并非“只追新功能”，而是在 **正确性、兼容性、测试完备度** 上逐步收敛。  
对于 OLAP 执行引擎项目来说，这通常是走向稳定生产可用的重要信号。

**纳入下一版本概率：中高**

---

### 6.3 Velox 上游协同仍是隐性主线
- **Issue #11585**
- **PR #11845**  
  链接: apache/gluten Issue #11585  
  链接: apache/gluten PR #11845

虽然今天没有新 connector、新存储格式或新算子的大功能请求，但从 tracker issue 和 daily sync PR 可以看出，路线图中一个持续存在的主题是：

- 尽可能减少 Gluten 私有维护补丁；
- 推动能力回流 Velox upstream；
- 通过同步上游版本，缩短新特性进入 Gluten 的路径。

这意味着未来版本的很多改进，仍会以“上游带动下游”的形式出现。

---

## 7. 用户反馈摘要

基于今日活跃 Issue #11585 的描述与讨论方向，可以提炼出几类真实用户/开发者痛点：

### 7.1 上游未合并导致使用与维护决策困难
- 链接: apache/gluten Issue #11585

开发者希望知道：  
**哪些 Velox PR 对 Gluten 有用但尚未合入 upstream，是否值得自行 pick。**

这说明在实际使用中，用户/维护者经常面临：
- 修复已经存在，但还不能“官方可用”；
- 自行 cherry-pick 能解问题，但会增加维护负担；
- 不 pick 又可能卡住功能验证或性能调优。

---

### 7.2 对 Spark 语义一致性的要求越来越高
- 链接: apache/gluten PR #11837
- 链接: apache/gluten PR #11526

围绕 `collect_list/collect_set` 的功能与测试更新说明，用户对 Gluten 的期待已经不仅是“跑得更快”，还包括：
- 结果必须与 Spark 足够一致；
- null 语义、类型行为、fallback 路径都要可预期；
- 在复杂 SQL 和生产回归场景下不能出现细微偏差。

对分析型引擎项目来说，这是一种成熟用户群体特征：  
**性能优势已是前提，语义兼容才是规模落地门槛。**

---

## 8. 待处理积压

### 8.1 长期跟踪但仍未收敛：Velox 未合并 PR 清单
- **Issue #11585**  
  创建时间: 2026-02-07  
  更新: 2026-03-28  
  评论: 16  
  链接: apache/gluten Issue #11585

这是最需要维护者持续关注的积压项。  
原因在于它不是单一任务，而是多个潜在功能/修复的聚合入口。一旦长期不清理，可能带来：

- 重要修复散落在外部 PR，影响可发现性；
- 社区重复提交相近修复；
- 下游 fork 与上游主线差异持续扩大。

**建议维护动作：**
1. 定期梳理已过时项并自动移除；
2. 标注每个 Velox PR 的状态：待 review / blocked / superseded / worth cherry-pick；
3. 为高价值补丁建立 Gluten 侧临时落地策略。

---

### 8.2 较早创建但仍未合并的测试增强 PR
- **PR #11526**  
  创建时间: 2026-01-30  
  最近更新: 2026-03-28  
  链接: apache/gluten PR #11526

该 PR 已存在近两个月，说明测试增强类工作可能在 review、依赖关系或优先级上被延后。  
但考虑到它与当前 `collect_list` 语义修复高度相关，建议提高关注度，避免功能先行、测试滞后。

**建议优先级：中高**

---

## 总结判断

今天的 Apache Gluten 没有版本发布，也没有合并结果，但从活跃内容看，项目正围绕两条主线稳步推进：

1. **Velox 协同与上游同步**：通过 daily sync 和未合并 PR 跟踪器维持底层执行引擎演进；
2. **Spark SQL 兼容性补齐**：尤其聚焦 `collect_list/collect_set` 的 null 语义和测试覆盖。

这说明项目当前阶段的重心不是“大功能轰炸”，而是 **把执行引擎集成、SQL 正确性和测试完整性做扎实**。对于一个分析型执行引擎项目而言，这是健康且务实的信号。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-29）

## 1. 今日速览

过去 24 小时内，Apache Arrow 保持中等偏活跃：Issues 更新 17 条、PR 更新 6 条，且关闭项（7 个 issue、2 个 PR）占比不低，说明维护者在持续清理积压与推进修复。  
当天没有新版本发布，但在 **C++/FlightRPC Linux ODBC 支持**、**CI/打包链路修复**、**R 语言 Azure Blob 文件系统支持** 等方向出现了明确进展。  
从议题结构看，当前重点集中在三类问题：**跨平台构建与 CI 稳定性**、**语言绑定生态完善（R/Python/MATLAB）**、以及 **C++ 核心库边界行为与数据正确性**。  
另外，多个 2022 年遗留 issue 被 stale 机制重新触达，显示项目仍存在一定历史积压，但整体健康度仍属稳健。

---

## 3. 项目进展

### 已关闭 / 已落地的重要 PR

#### 1) Linux ODBC 支持推进落地
- **PR:** #49564 `[C++][FlightRPC] Add Ubuntu ODBC Support`（已关闭）
- **Issue:** #49463（已关闭）
- **链接:** apache/arrow PR #49564 / apache/arrow Issue #49463

这组变更解决了 Arrow Flight SQL ODBC 驱动长期仅支持 Windows / macOS 的限制，新增了 **Ubuntu/Linux 下的 ODBC 构建支持**，包括：
- Linux ODBC build enablement
- Unicode 支持
- CI 增加 Ubuntu ODBC 构建
- build 后注册 ODBC
- 新增 docker-compose 用于 Flight SQL ODBC 场景

这对 Arrow 在 **分析型数据库、BI 工具接入、SQL over Flight** 生态中的可用性是实质增强，尤其利好 Linux 为主的部署环境。虽然 PR 本身显示为关闭，但对应 issue 也已关闭，表明该能力大概率已通过相关实现或替代提交完成。  
**影响面：** 提升 Flight SQL 在 Linux 客户端/驱动链路上的落地能力，增强 Arrow 作为分析引擎数据交换层的连接器完整度。

---

#### 2) CI / Packaging：修复 ubuntu-resolute aws-lc 构建失败
- **PR:** #49604 `[C++] Update bundled AWS SDK C++ for C23`（已关闭）
- **Issue:** #49601（已关闭）
- **链接:** apache/arrow PR #49604 / apache/arrow Issue #49601

该修复针对 `ubuntu-resolute` 平台上 `aws-lc` 无法以 C23 编译的问题，通过升级 bundled AWS SDK C++ 相关依赖到上游已修复版本来解决。  
这类修复虽然不直接带来用户可见的新功能，但对 **对象存储访问、打包发布稳定性、跨平台 CI 可靠性** 非常关键，尤其 Arrow 在 S3/Azure/GCS 等云存储读写场景高度依赖相关依赖链稳定。

**技术意义：**
- 降低新编译器 / 新标准（C23）带来的构建回归
- 维持 Linux 打包链条可用性
- 为后续依赖升级和发行版适配扫清障碍

---

### 今日仍在推进中的重要 PR

#### 3) R 语言 Azure Blob 文件系统支持进入评审
- **PR:** #49553 `[R] Expose azure blob filesystem`
- **状态:** OPEN / awaiting review
- **链接:** apache/arrow PR #49553

该 PR 为 Arrow R 包增加 **Azure Blob Storage 文件系统暴露能力**。Arrow C++ 和 PyArrow 已有 Azure 支持，R 端补齐后，将显著改善多语言一致性。  
这对使用 Arrow 做 **云上 ETL、湖仓读写、跨语言数据管道** 的用户十分关键，尤其是 Azure 生态用户。

---

#### 4) 依赖栈升级 PR 仍待进一步修改
- **PR:** #48964 `[C++] Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions`
- **状态:** OPEN / awaiting change review
- **链接:** apache/arrow PR #48964

该 PR 涉及 Arrow C++ 通信与云连接核心依赖的大规模升级，且明确标注 **可能包含 public API breaking changes**。  
这意味着后续若合入，可能影响：
- Flight / gRPC 通信栈
- Google Cloud 相关连接器
- C++ 下游嵌入者的 ABI/API 兼容性

这是当前最值得持续跟踪的基础设施级 PR 之一。

---

## 4. 社区热点

### 热点 1：Linux ODBC / Flight SQL 连接器能力补齐
- **Issue:** #49463
- **PR:** #49564
- **链接:** apache/arrow Issue #49463 / apache/arrow PR #49564

这是今日最具“平台能力补齐”性质的议题。Arrow Flight SQL 作为高性能数据服务协议，其 ODBC 驱动若不能在 Linux 上构建，会限制大量服务端 / BI / 数据集成场景。  
背后的技术诉求很明确：**让 Arrow 不仅是内存格式和库，更是可被标准 SQL/ODBC 工具消费的工业级连接层**。

---

### 热点 2：CI 与供应链稳定性问题持续受关注
- **Issue:** #49601
- **PR:** #49604
- **Issue:** #49611
- **PR:** #49610
- **链接:** apache/arrow Issue #49601 / apache/arrow PR #49604 / apache/arrow Issue #49611 / apache/arrow PR #49610

今天多条更新集中在 CI 故障：
- `ubuntu-resolute` 上 aws-lc 构建失败
- MATLAB workflow 因 GitHub Action 权限策略变更而失效
- Windows R release 因测试 bucket 不存在而失败

这说明 Arrow 当前的一个真实运营重点是：**多语言、多平台、多外部服务依赖下的 CI 漂移治理**。  
对于大型分析基础设施项目而言，这类问题虽然“非功能性”，但会直接影响发布节奏、回归发现能力和贡献者体验。

---

### 热点 3：C++ 数据正确性边界问题出现新报告
- **Issue:** #49614 `[C++] arrow::util::base64_decode silently truncates...`
- **链接:** apache/arrow Issue #49614

这是今天最值得关注的新 bug 之一。问题在于 `base64_decode` 遇到非法字符时并不报错，而是**静默截断并返回部分结果**。  
背后的技术诉求是：Arrow 的底层工具函数不应在异常输入下产生“看似成功、实则错误”的输出，因为这会污染上层数据处理链路，影响：
- 查询结果正确性
- 数据导入校验
- 安全与鲁棒性假设

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：C++ base64 解码遇非法字符静默截断
- **Issue:** #49614
- **状态:** OPEN
- **链接:** apache/arrow Issue #49614

**问题描述：** `arrow::util::base64_decode` 在遇到非法字符时，不返回错误，而是提前停止并返回部分结果。  
**潜在影响：**
- 上游调用者难以感知输入非法
- 可能造成数据损坏或不完整解析
- 在认证、序列化、嵌入式 payload 等场景中风险更高

**当前是否有 fix PR：** 暂无明确修复 PR。  
**建议关注：** 应确认预期 API 语义，考虑改为显式错误返回或提供严格模式。

---

### P1：MATLAB CI 因 Action 权限策略变更而持续失败
- **Issue:** #49611
- **状态:** OPEN
- **链接:** apache/arrow Issue #49611

**问题描述：** `matlab-actions/setup-matlab@v2` 与 `run-tests@v2` 因仓库 action allowlist/权限策略而被禁用，导致 MATLAB workflow 自 3 月 20 日起静默失败。  
**影响：**
- MATLAB 绑定可能存在未被及时发现的回归
- CI 绿灯失真，降低发布前质量保障

**当前是否有 fix PR：** 未看到对应 PR。  
**严重性说明：** 对特定语言绑定影响明显，且“静默失败”会削弱项目可观测性。

---

### P2：Python 字符串存储模式下 DataFrame 行追加性能明显退化
- **Issue:** #49612
- **状态:** OPEN
- **链接:** apache/arrow Issue #49612

**问题描述：** 在 pandas `string_storage="pyarrow"` 配置下，使用 `.loc` 逐行赋值扩展字符串 DataFrame 时性能显著慢于 `"python"` 模式。  
**影响：**
- 影响 Python 用户对 Arrow-backed string dtype 的性能预期
- 对采用逐行构造表的 ETL / 数据清洗代码不友好

**当前是否有 fix PR：** 暂无。  
**判断：** 更偏性能缺陷而非正确性 bug，但对用户 adoption 有现实影响。

---

### P2：Windows R release CI 使用失效 bucket
- **Issue/PR:** #49609 / #49610
- **状态:** PR OPEN
- **链接:** apache/arrow PR #49610

**问题描述：** AMD64 Windows R release 任务因 `ursa-labs-r-test` bucket 不存在而报 `IOError`。  
**修复状态：** 已有 PR #49610 更新 bucket，等待 change review。  
**影响：** R 平台发布验证链路受阻，但已有明确修复方向。

---

### P2：ubuntu-resolute 构建 aws-lc 失败
- **Issue/PR:** #49601 / #49604
- **状态:** 已关闭
- **链接:** apache/arrow Issue #49601 / apache/arrow PR #49604

**问题描述：** 新平台/新标准环境下 aws-lc 无法构建。  
**修复状态：** 已通过依赖升级关闭。  
**评估：** 属于已及时收敛的 CI/打包回归。

---

## 6. 功能请求与路线图信号

### 1) R 语言 Azure Blob Storage 支持，进入实质落地阶段
- **PR:** #49553
- **链接:** apache/arrow PR #49553

这是最明确、最接近纳入后续版本的功能扩展之一。由于：
- C++ 已支持 Azure
- PyArrow 已支持 Azure
- R 端缺失形成多语言能力不一致

因此该功能具有很强的“补齐生态短板”属性，**进入下一版本的概率较高**。

---

### 2) Linux ODBC/Flight SQL 支持已完成收口
- **Issue:** #49463
- **PR:** #49564
- **链接:** apache/arrow Issue #49463 / apache/arrow PR #49564

从 issue/PR 双双关闭看，该能力已基本纳入主线或完成替代实现。  
这释放出一个清晰路线图信号：Arrow 在继续强化 **Flight SQL + 标准驱动接入能力**，利好数据库互联、BI 工具连接和联邦查询生态。

---

### 3) Gandiva SQL/表达式函数扩展需求仍在，但优先级不高
- **Issue:** #31118 `[Gandiva][C++] Add TRUNC function`（已关闭）
- **Issue:** #31102 `[C++][Gandiva] Implement Find_In_Set Function`（已关闭）
- **链接:** apache/arrow Issue #31118 / apache/arrow Issue #31102

这两个较早期的函数增强需求今天被关闭，更像是 stale 清理而非功能完成信号。  
从中可见：**Gandiva 函数面扩张当前并非社区最活跃方向**，项目资源更多集中在核心库、连接器和 CI 稳定性。

---

### 4) C++ 执行计划 backpressure / writer 行为文档与能力仍是长期主题
相关 issue 今天被重新触达：
- #31653 数据集 writer 在 backpressure + I/O error 条件下可能死锁
- #31657 文档化 C++ streaming exec plan 的 backpressure
- #31654 aggregate node 增加 backpressure
- #31652 OneShotFragment 忽略 batch readahead / batch size
- **链接:** apache/arrow Issue #31653 / #31657 / #31654 / #31652

这些 issue 指向同一条长期路线：**Arrow C++ 数据集/执行引擎在高吞吐、受压、异步写入场景下的调度与内存控制**。  
虽然今天没有新 PR 对应，但这仍是分析型存储引擎能力中非常核心的技术方向，值得维护者重新评估优先级。

---

## 7. 用户反馈摘要

### 真实痛点 1：云存储支持需要跨语言一致
- **PR:** #49553
- **链接:** apache/arrow PR #49553

用户明显希望 Arrow 在 AWS / GCS / Azure 三大云对象存储上实现 **多语言接口对齐**。  
R 用户并不满足于底层 C++ 已支持，他们需要包层直接可用的 filesystem API，这反映了 Arrow 的用户群正在从“底层库开发者”扩展到“数据工程与分析工作流用户”。

---

### 真实痛点 2：CI 与外部依赖漂移会直接伤害开发体验
- **Issue:** #49611
- **PR:** #49610
- **Issue:** #49601
- **链接:** apache/arrow Issue #49611 / apache/arrow PR #49610 / apache/arrow Issue #49601

多个问题都不是算法 bug，而是：
- GitHub Actions 权限策略变化
- 外部 bucket 失效
- 上游依赖构建兼容性变化

这说明 Arrow 用户和贡献者正在面对一个现实问题：**复杂生态集成项目的失败，很多来自外部系统变化，而非 Arrow 自身逻辑。**

---

### 真实痛点 3：用户期待 Arrow-backed Python 类型“既兼容又高性能”
- **Issue:** #49612
- **链接:** apache/arrow Issue #49612

Python 用户使用 `string_storage="pyarrow"`，本质上是在押注 Arrow 提供更高效的字符串表示与处理。  
当逐行 `.loc` 赋值场景出现显著性能退化时，会直接影响用户对 Arrow 字符串后端的信心。  
这反映出用户不仅关注功能可用，更关注 **与 pandas 典型工作流的行为一致性和性能稳定性**。

---

### 真实痛点 4：底层工具函数必须对错误输入更“显式”
- **Issue:** #49614
- **链接:** apache/arrow Issue #49614

base64 解码静默截断的问题体现出用户对 Arrow 底层库的期望是：  
**不能悄悄失败，更不能返回部分正确结果伪装成成功。**  
这类反馈常见于对数据正确性要求高的系统集成场景。

---

## 8. 待处理积压

以下长期未决议题值得维护者关注：

### 1) C++ 数据集 writer / exec plan 的 backpressure 与死锁风险
- **Issue:** #31653
- **链接:** apache/arrow Issue #31653

这是较老但技术价值很高的问题，涉及 I/O error 与 backpressure 叠加时的潜在死锁。  
对面向大规模数据写入、异步执行和资源受限环境的用户来说，这类问题优先级不应过低。

---

### 2) C++ streaming exec plan backpressure 文档长期缺失
- **Issue:** #31657
- **链接:** apache/arrow Issue #31657

即便功能暂不调整，文档缺失也会导致用户错误估计内存占用与吞吐行为。  
对于分析型引擎用户，**可解释性和可调优性** 与功能本身同样重要。

---

### 3) OneShotFragment 忽略 batch readahead / batch size
- **Issue:** #31652
- **链接:** apache/arrow Issue #31652

这属于典型“看似边缘、实则影响扫描一致性与资源控制”的问题，而且已被标注为 `good-first-issue` / `good-second-issue`。  
适合作为吸引新贡献者切入 C++ dataset 扫描器的候选任务。

---

### 4) 文件系统目录路径返回格式不统一
- **Issue:** #31664
- **链接:** apache/arrow Issue #31664

涉及 C++ / Python 文件系统 API 结果中目录路径是否带 `/` 的一致性问题。  
虽不属于高严重度缺陷，但这类 API 细节不一致很容易在生产代码中引发兼容性判断分支，建议尽早明确规范。

---

### 5) 大型基础依赖升级 PR 长期悬而未决
- **PR:** #48964
- **链接:** apache/arrow PR #48964

Abseil / Protobuf / gRPC / Google-Cloud-CPP 升级属于高风险但高必要性工作。  
长期停留在 `awaiting change review` 状态，意味着：
- 安全与兼容性收益尚未释放
- breaking changes 评估可能仍不充分
- 后续版本窗口可能受到影响

建议维护者尽快给出合并路径、拆分策略或明确阻塞项。

---

## 总结

今天的 Arrow 动态显示出一个成熟基础设施项目的典型特征：  
**新特性在稳步补齐（R Azure、Linux ODBC），稳定性问题被快速处理（aws-lc/CI），但多语言、多平台、长尾执行引擎议题仍有明显积压。**  
从 OLAP/分析型存储引擎视角看，最值得关注的信号有三点：

1. **Flight SQL 与 ODBC 的平台覆盖继续增强**，Arrow 作为查询互联层的价值在提升。  
2. **对象存储与云生态支持持续扩展到更多语言绑定**，有利于湖仓/ETL 工作流。  
3. **C++ 执行层的 backpressure、正确性与资源控制问题** 仍需更多工程投入，否则会限制高负载分析场景下的可预测性。

如果你愿意，我还可以继续把这份日报整理成更适合公众号/邮件周报风格的版本，或者输出成 **“管理层摘要版 + 技术团队详版”** 双栏格式。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*