# Apache Doris 生态日报 2026-03-15

> Issues: 1 | PRs: 52 | 覆盖项目: 10 个 | 生成时间: 2026-03-15 01:28 UTC

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

# Apache Doris 项目动态日报 · 2026-03-15

## 1. 今日速览

过去 24 小时内，Apache Doris 的代码活动明显高于 issue 活动：**Issues 仅更新 1 条且为关闭**，但 **PR 更新达到 52 条**，说明当前项目重心仍集中在功能开发、分支回迁和版本收敛上。  
从 PR 内容看，今日活跃方向主要集中在 **外部数据湖/对象存储集成、Routine Load 云环境适配、查询执行内存优化、SQL 函数增强** 等典型分析型数据库能力建设。  
同时，多个 **branch-4.1 / branch-4.0** 的 cherry-pick PR 持续推进，表明维护者正在积极将主干能力向稳定分支回灌，项目发布工程较为活跃。  
整体判断：**项目健康度良好，开发活跃度高，短期重心偏向功能扩展与稳定性补强，而非 issue 驱动式缺陷处理。**

---

## 3. 项目进展

> 今日无新版本发布；以下聚焦过去 24 小时内已合并/关闭的重要 PR 与其技术意义。

### 3.1 已合并/关闭的重要 PR

#### 1) Load 内存占用回归修复已进入稳定分支
- **PR**: #61327 `[CLOSED] [fix](load) fix load memory usage is more than branch-3.1 (#61173)`
- **链接**: https://github.com/apache/doris/pull/61327
- **状态**: 已关闭，带有 `dev/4.0.5-merged`、`dev/4.1.0-merged`
- **解读**:  
  该修复针对 Doris 在较新分支上的 **load 内存使用高于 3.1 分支** 的问题，已经进入 4.0.5 和 4.1.0 相关分支标签，说明维护者认为这是一个有实际影响的稳定性问题。  
  对 OLAP 场景而言，导入链路的内存占用异常会直接影响 **批量装载吞吐、FE/BE 稳定性以及资源隔离表现**，因此这类修复优先级较高。

#### 2) BE JVM 监控默认开启，提升可观测性
- **PR**: #60343 `[CLOSED] [opt](jvm) enable BE jvm monitor by default`
- **链接**: https://github.com/apache/doris/pull/60343
- **状态**: 已关闭，`dev/4.1.0-merged`
- **相关回迁**: #61337 `branch-4.1: [opt](jvm) enable BE jvm monitor by default (#60343)`
- **链接**: https://github.com/apache/doris/pull/61337
- **解读**:  
  默认开启 BE JVM 监控，意味着 Doris 在 **Java 侧组件运行态可观测性** 上进一步加强。  
  对生产集群而言，这有助于更快定位 **JNI、元数据访问、外部目录接入、内存异常与线程状态问题**，尤其适合云化和多数据源接入越来越复杂的部署场景。

#### 3) 历史功能 PR 因长期无进展被 stale 关闭
- **PR**: #55074 `[CLOSED] [Stale] [Enhancement](function) Support regexp_position function`
- **链接**: https://github.com/apache/doris/pull/55074
- **解读**:  
  `regexp_position` 函数增强需求被 stale 关闭，说明该功能**并非当前版本优先事项**，或实现/评审长期未推进。  
  这类关闭并不代表需求无价值，而更可能反映维护者当前更关注基础能力与兼容性主线。

#### 4) 历史 Hudi 分支修复 PR stale 关闭
- **PR**: #55660 `[CLOSED] [Stale] branch-3.0: [fix](hudi) Fix querying hudi jni table where only partition columns ...`
- **链接**: https://github.com/apache/doris/pull/55660
- **解读**:  
  属于旧分支上的 Hudi 查询修复回迁，今日以 stale 关闭。  
  这通常意味着 **旧维护分支优先级下降**，项目资源进一步向 4.0/4.1 主线倾斜。

---

## 4. 社区热点

> 由于提供的数据中评论数多为 `undefined`，无法严格按评论排序；以下按“更新频率、主题重要性、版本影响面”综合判断热点。

### 热点 1：TVF 导出能力进入 4.1 分支
- **PR**: #61340 `branch-4.1: [feat](tvf) Support INSERT INTO TVF to export query results to local/HDFS/S3 files`
- **链接**: https://github.com/apache/doris/pull/61340
- **分析**:  
  这是一个非常典型的分析型数据库增强方向：让查询结果能够通过 TVF 直接导出到 **本地/HDFS/S3**。  
  背后技术诉求是将 Doris 从“查询引擎”进一步延展为 **分析结果分发/数据交换节点**，便于接入数据湖、离线归档、外部消费链路。  
  若顺利合并，预计会增强 Doris 在 **ETL 出口、报表落地、云存储集成** 上的竞争力。

### 热点 2：Iceberg 写能力继续扩展到 update/delete/merge into
- **PR**: #60482 `[OPEN] [feature](iceberg) Implements iceberg update delete merge into functionality.`
- **链接**: https://github.com/apache/doris/pull/60482
- **分析**:  
  这是今日最重要的湖仓生态方向之一。  
  其核心诉求是让 Doris 对 Iceberg 不止“读得好”，还要逐步具备 **更完整的 DML 改写能力**，包括 `UPDATE / DELETE / MERGE INTO`。  
  这表明 Doris 正尝试向 **统一查询 + 一定程度统一写入/变更处理** 的湖仓引擎角色靠拢。

### 热点 3：Routine Load 云原生化加速，覆盖 Kinesis 与 IAM 认证
- **PR**: #61325 `[OPEN] [feature](RoutineLoad) Support the Amazon Kinesis`
- **链接**: https://github.com/apache/doris/pull/61325
- **PR**: #61324 `[OPEN] [feature](RoutineLoad) Support RoutineLoad IAM auth`
- **链接**: https://github.com/apache/doris/pull/61324
- **分析**:  
  这两项工作共同指向 Doris 在 AWS 环境中的流式接入能力增强。  
  一个面向 **Kinesis 数据源接入**，另一个解决 **MSK/Kafka 场景中的 IAM 身份认证**。  
  背后用户诉求非常明确：在公有云环境里，用户希望 Doris 原生适配 **托管消息系统、跨账号授权、免明文密钥访问**。

### 热点 4：对象存储与数据湖 catalog 的云厂商适配增强
- **PR**: #61329 `[feature] (cloud) Add Alibaba Cloud OSS native storage vault support with STS AssumeRole`
- **链接**: https://github.com/apache/doris/pull/61329
- **PR**: #61341 `branch-4.1: [opt](jindofs)... [feat](iceberg) support aliyun dlf iceberg rest catalog`
- **链接**: https://github.com/apache/doris/pull/61341
- **分析**:  
  Doris 正在明显增强对 **阿里云 OSS / DLF / JindoFS** 等生态的兼容。  
  这类能力对中国云环境用户非常关键，意味着 Doris 在 **对象存储原生接入、临时凭证、数据湖 catalog 管理** 上正在补足企业落地短板。

---

## 5. Bug 与稳定性

> 按潜在影响程度排序；仅基于今日可见数据判断。

### 高优先级

#### 1) Hive 外表 DATE 存在时区偏移导致查询结果错误
- **PR**: #61330 `[OPEN] [fix](hive) Fix Hive DATE timezone shift in external readers`
- **链接**: https://github.com/apache/doris/pull/61330
- **问题性质**: 查询正确性
- **影响面**: Hive ORC/Parquet 外表读取
- **说明**:  
  该问题会在西半球时区（如 `-06:00`）下把 DATE 值错误地提前一天，而 Spark 保留原始逻辑日期。  
  对 BI、分区裁剪、日期统计、对账场景而言，这属于**高风险正确性缺陷**。  
- **修复状态**: **已有 fix PR，待合并**

#### 2) Variant 列空间占用显示为 0
- **PR**: #61331 `[OPEN] [fix](variant) Fix variant column space usage showing as 0`
- **链接**: https://github.com/apache/doris/pull/61331
- **问题性质**: 统计元数据/可观测性错误
- **影响面**: variant 类型存储占用分析
- **说明**:  
  该问题虽然不一定影响实际查询结果，但会影响 **容量评估、冷热数据管理、存储分析、表级运维判断**。  
  对新类型 `variant` 的运营监控和容量治理不利。
- **修复状态**: **已有 fix PR，待合并**

### 中优先级

#### 3) Load 链路内存占用高于旧分支
- **PR**: #61327 `[CLOSED] [fix](load) ...`
- **链接**: https://github.com/apache/doris/pull/61327
- **问题性质**: 性能/稳定性回归
- **说明**:  
  已确认并回迁到稳定分支，表明该问题曾对生产场景产生实际影响。  
- **修复状态**: **已合入相关分支**

#### 4) 规则过滤逻辑疑似失效的历史 Bug 被 stale 关闭
- **Issue**: #55718 `[CLOSED] [Stale] [Bug] FilteredRules::filterValidRules will not filter any rule`
- **链接**: https://github.com/apache/doris/issues/55718
- **说明**:  
  从标题看，这是 **优化器规则过滤逻辑** 相关问题，潜在影响查询规划过程。  
  但今日状态为 stale 关闭，暂无看到关联 fix PR。  
- **修复状态**: **未见今日 fix 关联，已因 stale 关闭，建议后续复核**

### 低优先级/工程稳定性

#### 5) OpenCode review 失败时 CI 通知不足
- **PR**: #61334 `[OPEN] [fix](ci) Add error handling and PR notification for OpenCode review failures`
- **链接**: https://github.com/apache/doris/pull/61334
- **说明**:  
  属于研发流程稳定性优化，可降低自动化评审静默失败带来的维护成本。

#### 6) `array_union` 测试结果不稳定
- **PR**: #61333 `[OPEN] [chore](test) Make results of array_union sorted by array_sort in test cases`
- **链接**: https://github.com/apache/doris/pull/61333
- **说明**:  
  本质是测试确定性修复，能减少 CI 抖动和误报。

---

## 6. 功能请求与路线图信号

### 6.1 强烈信号：湖仓与外部目录能力仍是主线

#### Iceberg DML 能力扩展
- **PR**: #60482
- **链接**: https://github.com/apache/doris/pull/60482
- **判断**:  
  如果该 PR 最终落地，Doris 对 Iceberg 的支持将从查询/元数据接入继续延伸到 **变更写入语义**，这很可能是下一阶段版本的重要卖点。

#### Paimon 元数据/DDL 支持进入分支
- **PR**: #61338 `branch-4.1: [feature](paimon) implement create/drop db, create/drop table for paimon (#58894)`
- **链接**: https://github.com/apache/doris/pull/61338
- **判断**:  
  `create/drop db/table` 进入稳定分支，说明 Paimon 支持不再停留在只读接入，而是在往 **更完整 catalog 管理能力** 演进。

#### MaxCompute 外部表 DDL
- **PR**: #61339 `branch-4.1: [feat](maxcompute) support create/drop table operations`
- **链接**: https://github.com/apache/doris/pull/61339
- **判断**:  
  MaxCompute 的 DDL 支持回迁到 4.1，体现 Doris 正强化其作为 **多引擎统一元数据入口** 的定位。

### 6.2 强烈信号：云原生接入能力快速增强

#### AWS 流式接入与认证
- **PR**: #61325, #61324
- **链接**:  
  - https://github.com/apache/doris/pull/61325  
  - https://github.com/apache/doris/pull/61324
- **判断**:  
  Kinesis + IAM 的组合说明 Doris 在 AWS 场景中的 **安全合规接入能力** 正显著加强，较可能纳入后续版本重点宣传。

#### 阿里云对象存储与湖仓目录
- **PR**: #61329, #61341
- **链接**:  
  - https://github.com/apache/doris/pull/61329  
  - https://github.com/apache/doris/pull/61341
- **判断**:  
  OSS STS AssumeRole、DLF Iceberg REST catalog、JindoFS 升级，都是非常明确的企业云落地诉求，**进入下个版本的概率较高**。

### 6.3 SQL 函数与检索能力持续扩张

#### 新聚合函数 entropy
- **PR**: #60833 `[Feature](agg) add agg function entropy`
- **链接**: https://github.com/apache/doris/pull/60833

#### 字符串切分增强：`SPLIT_BY_STRING` 支持 limit
- **PR**: #60892
- **链接**: https://github.com/apache/doris/pull/60892

#### 字符串相似度函数：levenshtein / hamming_distance
- **PR**: #60412
- **链接**: https://github.com/apache/doris/pull/60412

#### 倒排索引 BM25 打分
- **PR**: #59847
- **链接**: https://github.com/apache/doris/pull/59847

- **判断**:  
  这些 PR 共同表明 Doris 仍在补齐 **分析函数、文本处理、检索打分** 能力。  
  尤其 BM25 与距离函数，说明项目在尝试强化 **SQL + 检索分析融合** 的使用场景。

### 6.4 被关闭但仍值得关注的需求

#### `regexp_position`
- **PR**: #55074
- **链接**: https://github.com/apache/doris/pull/55074
- **判断**:  
  尽管 stale 关闭，但正则函数增强通常具有较广泛 SQL 兼容需求，后续仍可能以新的实现形式重提。

---

## 7. 用户反馈摘要

### 1) 云环境用户希望“免密钥、原生身份”接入
- **相关 PR**: #61324, #61325, #61329
- **链接**:  
  - https://github.com/apache/doris/pull/61324  
  - https://github.com/apache/doris/pull/61325  
  - https://github.com/apache/doris/pull/61329
- **提炼**:  
  用户在 AWS / 阿里云场景中，越来越不接受硬编码密钥模式，而更偏好 **IAM、STS AssumeRole、实例角色** 这样的云原生认证方式。  
  这说明 Doris 的用户群体正从“自建大数据集群”进一步转向“云上托管与企业安全合规部署”。

### 2) 外表查询的兼容性问题依然是实际痛点
- **相关 PR**: #61330
- **链接**: https://github.com/apache/doris/pull/61330
- **提炼**:  
  DATE 时区偏移这种问题，属于用户最难接受的“**结果看似正常但实际有偏差**”型问题。  
  用户对 Doris 与 Spark/Hive 语义一致性的要求越来越高，尤其在数据湖混合查询场景下。

### 3) 内存与可观测性仍是运维核心诉求
- **相关 PR**: #61327, #60343, #61331
- **链接**:  
  - https://github.com/apache/doris/pull/61327  
  - https://github.com/apache/doris/pull/60343  
  - https://github.com/apache/doris/pull/61331
- **提炼**:  
  用户不仅关心“能不能跑”，更关心 **导入是否省内存、BE 是否易监控、列存空间是否准确可见**。  
  这反映 Doris 已进入更成熟的生产使用阶段，用户期望从功能可用转向 **成本可控、诊断方便、指标可信**。

---

## 8. 待处理积压

> 结合今日数据，以下为值得维护者继续关注的长期或有积压风险的事项。

### 1) Iceberg update/delete/merge into 功能体量大、集成复杂
- **PR**: #60482
- **链接**: https://github.com/apache/doris/pull/60482
- **状态**: 2026-02-04 创建，至今仍为 OPEN
- **提醒**:  
  这是高价值但高复杂度 PR，涉及 **湖表事务语义、快照一致性、DML 路径、错误恢复**，建议维护者持续投入评审资源，否则容易形成长期积压。

### 2) BM25 倒排评分能力仍未落地
- **PR**: #59847
- **链接**: https://github.com/apache/doris/pull/59847
- **状态**: 2026-01-13 创建，仍为 OPEN
- **提醒**:  
  若 Doris 希望强化搜索分析融合能力，BM25 是具代表性的能力点。该 PR 持续悬而未决，建议明确评审意见或拆分实现范围。

### 3) levenshtein / hamming_distance 等 SQL 函数增强存在排队迹象
- **PR**: #60412
- **链接**: https://github.com/apache/doris/pull/60412
- **状态**: 2026-02-01 创建，仍为 OPEN
- **提醒**:  
  函数类 PR 用户感知强、落地收益直接，适合作为中小型版本增强项。若长期搁置，会削弱 SQL 兼容性迭代节奏。

### 4) entropy 聚合函数仍待推进
- **PR**: #60833
- **链接**: https://github.com/apache/doris/pull/60833
- **状态**: 2026-02-25 创建，仍为 OPEN
- **提醒**:  
  该功能对统计分析场景有实际价值，建议确认其性能实现、精度与向量化执行适配情况后尽快定论。

### 5) 已 stale 关闭但可能仍有真实需求的问题
- **Issue**: #55718
- **链接**: https://github.com/apache/doris/issues/55718
- **PR**: #55074
- **链接**: https://github.com/apache/doris/pull/55074
- **提醒**:  
  stale 关闭不等于需求消失。优化器规则过滤问题和 `regexp_position` 需求都可能在用户侧持续存在，建议定期回看高价值 stale 条目。

---

## 附：今日重点链接清单

- Issue #55718: https://github.com/apache/doris/issues/55718  
- PR #61327: https://github.com/apache/doris/pull/61327  
- PR #60343: https://github.com/apache/doris/pull/60343  
- PR #61337: https://github.com/apache/doris/pull/61337  
- PR #61340: https://github.com/apache/doris/pull/61340  
- PR #60482: https://github.com/apache/doris/pull/60482  
- PR #61325: https://github.com/apache/doris/pull/61325  
- PR #61324: https://github.com/apache/doris/pull/61324  
- PR #61329: https://github.com/apache/doris/pull/61329  
- PR #61341: https://github.com/apache/doris/pull/61341  
- PR #61330: https://github.com/apache/doris/pull/61330  
- PR #61331: https://github.com/apache/doris/pull/61331  
- PR #61212: https://github.com/apache/doris/pull/61212  
- PR #60833: https://github.com/apache/doris/pull/60833  
- PR #60892: https://github.com/apache/doris/pull/60892  
- PR #60412: https://github.com/apache/doris/pull/60412  
- PR #59847: https://github.com/apache/doris/pull/59847  

如果你愿意，我还可以继续把这份日报整理成更适合：
1. **内部周报格式**，  
2. **Markdown 发布版**，或  
3. **按“查询引擎 / 存储 / 湖仓 / 云原生”分类的管理层摘要版**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**日期：2026-03-15**

---

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储开源生态整体呈现出明显的**“高开发活跃、少发布、重收敛”**特征：多数项目没有新版本发布，但 PR 活跃度普遍较高，说明社区重点放在功能推进、回归修复和工程稳定性补强。  
从技术主题看，**湖仓互操作、对象存储访问、查询正确性、云原生认证、可观测性与执行器稳定性** 是最集中出现的方向。  
头部项目在路线分化上也更加清晰：**Doris / StarRocks** 强化统一分析与外部湖仓接入，**ClickHouse** 持续向高性能执行 + 云对象存储 + Keeper 稳定性推进，**DuckDB** 聚焦嵌入式分析与 S3/Parquet 远程读取优化，**Iceberg / Delta / Arrow** 更偏表格式、协议层和数据互操作基础设施。  
整体来看，行业已经从“拼功能覆盖”进一步转向“拼生产可用性、云环境适配和跨引擎一致性”。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 当日观察重点 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 1 | 52 | 无 | 湖仓/云存储接入、Routine Load 云适配、稳定分支回迁 | **良好，开发活跃度高** |
| **ClickHouse** | 18 | 126 | 无 | Keeper 稳定性、Analyzer 回归、安全边界、S3/湖仓性能 | **高活跃，工程化稳态推进** |
| **DuckDB** | 11 | 15 | 无 | S3/Hive 分区性能回归、Parquet 远程读取、checkpoint 修复 | **活跃，修复节奏积极** |
| **StarRocks** | 2 | 12 | 无 | 权限语义、外表/湖仓兼容、执行稳定性 | **良好，问题闭环快** |
| **Apache Iceberg** | 5 | 22 | 无 | Spark/Flink/Kafka Connect、迁移正确性、配置语义 | **持续迭代，修复链路顺畅** |
| **Delta Lake** | 2 | 3 | 无 | Java Kernel correctness、Catalog/CI 基础设施 | **稳定，但当日落地较少** |
| **Databend** | 0 | 7 | 无 | SQL Planner、递归 CTE、IN-list 稳定性、快照标签 | **中等偏稳，核心内核持续演进** |
| **Velox** | 0 | 27 | 无 | RPC/远程执行、GPU/cuDF、Iceberg/Parquet、CI | **良好偏强，研发并行度高** |
| **Apache Gluten** | 3 | 8 | 无 | Velox 同步、Spark 兼容、macOS 构建、指标修正 | **良好，但受上游依赖牵引明显** |
| **Apache Arrow** | 18 | 7 | 无 | Parquet 正确性、Gandiva 崩溃修复、依赖升级、历史 stale 清理 | **中等活跃，偏质量巩固** |

### 简要排序观察
- **绝对活跃度最高**：ClickHouse、Doris  
- **中高活跃且问题闭环快**：DuckDB、Iceberg、StarRocks  
- **偏基础设施/内核演进**：Velox、Databend、Arrow、Gluten  
- **当日活跃度较低但方向清晰**：Delta Lake  

---

## 3. Apache Doris 在生态中的定位

### 3.1 优势
相较同类项目，Apache Doris 当前最突出的优势是：  
1. **统一分析数据库定位明确**：既做高性能 MPP 分析，也持续强化外部 catalog、对象存储、数据湖接入。  
2. **云原生接入补齐速度快**：当天就能看到 **AWS Kinesis、IAM、阿里云 OSS STS AssumeRole、DLF Iceberg REST Catalog** 等工作，说明其面向企业云部署的投入很明确。  
3. **稳定分支回灌活跃**：大量 `branch-4.0 / 4.1` cherry-pick 与 merged 标签，显示发布工程和稳定性维护较成熟。  
4. **功能面覆盖广**：从 Routine Load、TVF 导出，到 Iceberg DML、Paimon/MaxCompute DDL，再到 SQL 函数和 BM25，产品边界在扩张。

### 3.2 与同类的技术路线差异
- **对比 ClickHouse**：  
  Doris 更强调“**统一数仓入口 + 湖仓与云接入**”，而 ClickHouse 更强调“**极致执行性能 + 存储/协调层工程深挖**”。  
- **对比 StarRocks**：  
  两者都走云数仓/湖仓分析路线，但 Doris 当天在**云厂商适配面**更广，StarRocks 则更聚焦执行器稳定性与企业权限语义。  
- **对比 DuckDB**：  
  Doris 是典型分布式分析数据库；DuckDB 是嵌入式/单机分析引擎，面向本地计算和远程对象存储读写优化。  
- **对比 Iceberg / Delta Lake**：  
  Doris 是执行引擎和数据库系统；Iceberg / Delta 更偏表格式与协议层，不直接等价竞争。  
- **对比 Databend**：  
  Databend 更偏新架构云原生数仓、SQL 内核持续打磨；Doris 则已在更大范围内推进生态兼容和分支维护。

### 3.3 社区规模对比
从当日活跃数据看：
- Doris：**1 Issue / 52 PR**
- ClickHouse：**18 Issue / 126 PR**
- DuckDB：**11 / 15**
- StarRocks：**2 / 12**

Doris 的 PR 活跃度明显高于多数同类项目，仅次于 ClickHouse，说明其核心开发强度处于第一梯队；但 Issues 较少，也意味着当天更多是**维护者驱动开发**而不是用户问题驱动。

---

## 4. 共同关注的技术方向

以下方向在多个项目中同时出现，说明它们已成为行业共同议题：

### 4.1 湖仓 / 外部表 / 表格式互操作
**涉及项目**：Doris、StarRocks、ClickHouse、Iceberg、Velox、Arrow、DuckDB  
**具体诉求**：
- Doris：Iceberg `UPDATE/DELETE/MERGE INTO`、Paimon/MaxCompute DDL、Hive 日期正确性修复  
- StarRocks：Paimon 统计修复、Iceberg/HDFS variant 子字段下推、Parquet UUID 支持  
- ClickHouse：Datalake/Iceberg 安全边界、S3 列表性能  
- Iceberg：Hive 迁移 null 分区、Flink/Spark/Kafka Connect 兼容  
- Velox/Arrow：Iceberg stats、Parquet widening、Bloom Filter / Parquet 写入正确性  
- DuckDB：Hive partition pruning、S3 + Parquet 远程扫描优化  

**共性判断**：  
行业已从“接入数据湖”进入“**正确读、正确写、正确优化、正确治理**”阶段。

---

### 4.2 对象存储与云原生接入
**涉及项目**：Doris、ClickHouse、DuckDB、StarRocks、Arrow  
**具体诉求**：
- Doris：OSS STS、IAM、Kinesis、S3/HDFS/本地导出  
- ClickHouse：S3 LIST 并行化、对象存储控制面性能、共享存储行为一致性  
- DuckDB：S3 请求数暴增修复、COPY TO S3 OOM、远程 Parquet 预取合并  
- StarRocks：湖仓格式兼容与 shared-data 边界稳定性  
- Arrow：HTTPS Filesystem、云依赖升级、加密 Parquet Bloom Filter

**共性判断**：  
对象存储已不只是冷数据载体，而是主流分析执行环境；用户关注的不是“能否访问”，而是**请求数、认证方式、枚举性能、云账单与行为可预测性**。

---

### 4.3 查询正确性与边界行为
**涉及项目**：Doris、ClickHouse、DuckDB、Databend、Arrow、Delta Lake、Iceberg  
**具体诉求**：
- Doris：Hive DATE 时区偏移  
- ClickHouse：`windowFunnel` 结果错误、全文索引 OR 条件错误、Analyzer 崩溃  
- DuckDB：Variant internal error、binder/type mismatch、ADBC 交错查询失败  
- Databend：correlated subquery + LIMIT、大 IN-list 栈溢出  
- Arrow：Gandiva 极值崩溃、Parquet 字典编码溢出检查  
- Delta Lake：Java Kernel data skipping 大小写匹配错误  
- Iceberg：配置前缀 regex bug、维护任务在复杂 schema 下失败  

**共性判断**：  
行业当前非常重视“**看起来能跑，但结果/路径不一致**”这类隐蔽 correctness 问题，尤其在复杂类型、边界值、外部格式、分布式 planner 上。

---

### 4.4 可观测性、指标可信度与工程稳定性
**涉及项目**：Doris、ClickHouse、StarRocks、Gluten、Velox、DuckDB  
**具体诉求**：
- Doris：BE JVM monitor 默认开启、variant 空间统计修复  
- ClickHouse：Prometheus handler 指标/日志一致性、CI crash 排查  
- StarRocks：query_pool 负内存修复  
- Gluten：修正 split 指标口径  
- Velox：CI runner 优化、fuzzer artifact 优化  
- DuckDB：CI retry、checkpoint 与权限控制路径修复  

**共性判断**：  
项目都在向成熟生产系统演进，用户要求已从“功能可用”升级到“**指标可信、诊断高效、测试稳定**”。

---

### 4.5 SQL 兼容性与函数补齐
**涉及项目**：Doris、ClickHouse、Databend、Velox、Arrow、Gluten  
**具体诉求**：
- Doris：entropy、levenshtein、hamming_distance、BM25、split limit  
- ClickHouse：printf 动态格式串、临时数据库、复杂类型表达式修复  
- Databend：递归 CTE、相关子查询、Planner 表达一致性  
- Velox：`dot_product`、`ceil(DECIMAL)`、RPC plan node  
- Arrow/Gandiva：TRUNC、FIND_IN_SET  
- Gluten：TIMESTAMP_NTZ 支持

**共性判断**：  
SQL 完备性仍然是竞争点，但已从基础函数扩展到**复杂类型、递归、Planner rewrite、跨引擎语义对齐**。

---

## 5. 差异化定位分析

### 5.1 存储格式与生态耦合

| 项目 | 主要定位 | 对存储格式/湖仓的关系 |
|---|---|---|
| **Apache Doris** | MPP 分析数据库 | 强化 Iceberg/Paimon/Hudi/Hive/MaxCompute 外部接入与部分写能力 |
| **ClickHouse** | 高性能列式分析数据库 | 强调 MergeTree 自身优势，同时增强 S3、Iceberg、外部对象存储控制面 |
| **DuckDB** | 嵌入式分析引擎 | 深度围绕 Parquet/S3/HTTP，本地+远程文件分析极强 |
| **StarRocks** | 云原生分析数据库 | 持续补强 Iceberg/Paimon/HDFS/Parquet 外部查询能力 |
| **Iceberg** | 开放表格式 | 作为多引擎共享表层，核心在元数据、维护任务、连接器 |
| **Delta Lake** | 表格式 + Spark 生态事务层 | 更偏协议一致性、Spark/Catalog 集成 |
| **Databend** | 云原生数仓/分析引擎 | 自身引擎演进更突出，湖仓话题相对当天不如 Doris/StarRocks 强 |
| **Velox** | 向量化执行引擎 | 作为底层执行内核，承接 Parquet/Iceberg/GPU/RPC 能力 |
| **Gluten** | Spark 列式加速层 | 强依赖 Velox/Spark/Substrait 的桥接能力 |
| **Arrow** | 列式内存与互操作基础设施 | 提供 Parquet、Flight、Gandiva、语言互操作基础层 |

---

### 5.2 查询引擎设计差异
- **Doris / StarRocks / ClickHouse / Databend**：偏完整数据库系统，含 Planner、执行器、存储/元数据管理。  
- **DuckDB**：单机嵌入式 OLAP，极强本地分析与文件扫描体验。  
- **Velox / Gluten / Arrow**：更像分析执行基础设施，而非最终数据库产品。  
- **Iceberg / Delta Lake**：是表层协议与生态，不是直接执行引擎。

---

### 5.3 目标负载类型差异
- **Doris / StarRocks**：实时数仓、统一分析平台、外部湖仓混合查询、流批接入。  
- **ClickHouse**：高并发分析、日志/事件、明细查询、极致性能场景。  
- **DuckDB**：本地分析、数据科学、轻量 ETL、对象存储上的临时查询。  
- **Iceberg / Delta**：作为共享数据表层，承接批流处理与多引擎访问。  
- **Velox / Gluten / Arrow**：面向引擎开发者、加速层和数据互操作场景。  
- **Databend**：云数仓和 SQL 内核能力增强并行推进。

---

### 5.4 SQL 兼容性侧重点
- **Doris / ClickHouse / Databend**：在复杂 SQL、函数、Planner 行为上持续补齐。  
- **DuckDB**：偏易用、嵌入式和文件分析语义一致性。  
- **StarRocks**：更多围绕湖仓兼容、权限和优化器输入质量。  
- **Gluten / Velox / Arrow**：SQL 支持更多取决于其上层接入引擎需求。  
- **Iceberg / Delta**：不直接拼 SQL 丰富度，而是拼协议和跨引擎行为一致性。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一梯队：高活跃、主线并行推进
- **ClickHouse**
- **Apache Doris**

特点：PR 数量大，主题广，既有新功能又有大量稳定性与基础设施修复，社区规模与工程吞吐都处于头部。

#### 第二梯队：中高活跃、问题闭环快
- **DuckDB**
- **Apache Iceberg**
- **StarRocks**

特点：用户问题和修复 PR 之间闭环明显，说明对生产反馈响应快；但总体体量略小于头部。

#### 第三梯队：内核/基础设施驱动
- **Velox**
- **Databend**
- **Apache Arrow**
- **Apache Gluten**

特点：更多是面向执行内核、构建、兼容、上游同步、长期能力建设，不一定每天有大量用户 issue 驱动。

#### 第四梯队：低频但方向稳定
- **Delta Lake**

特点：活跃度不高，但当前焦点很集中，更多在协议一致性和 Catalog 基础设施。

---

### 6.2 快速迭代 vs 质量巩固

#### 处于快速迭代阶段
- **Doris**：湖仓、云认证、Routine Load、函数和分支回迁并行  
- **ClickHouse**：Analyzer、Keeper、对象存储、安全边界、性能优化全面推进  
- **DuckDB**：1.5.x 回归修复推动对象存储路径快速调整  
- **Velox**：RPC/GPU/格式兼容/CI 多线推进

#### 处于质量巩固阶段
- **StarRocks**：Issue -> Fix PR 节奏快，更多在稳定性、权限、湖仓兼容细节  
- **Arrow**：Parquet/Gandiva/CI/依赖升级，明显偏底层可靠性  
- **Delta Lake**：协议一致性与 Catalog 基础设施补强  
- **Gluten**：上游同步、Spark 兼容、构建稳定性

#### 兼具迭代与巩固
- **Iceberg**：新能力持续扩展，同时大量精修迁移正确性、连接器和配置语义  
- **Databend**：虽活跃度不高，但内核级 SQL 能力持续增强

---

## 7. 值得关注的趋势信号

### 7.1 “统一分析引擎”正在向“统一数据入口 + 数据出口”演进
以 Doris 的 TVF 导出、DuckDB 的 S3 写出、Iceberg/Delta 的连接器增强为代表，数据库不再只是查询入口，而是逐渐承担**结果分发、跨系统交换、外部写入和维护编排**角色。  
**参考价值**：架构师在选型时，应考虑引擎是否能承担更多数据编排职责，而不只是 SQL 执行。

### 7.2 云原生身份认证正在成为标配
Doris 的 IAM / STS AssumeRole、ClickHouse 的安全边界问题、Arrow 的云依赖升级，说明企业用户越来越排斥静态 AK/SK 模式。  
**参考价值**：数据平台设计需要把 IAM、STS、实例角色、跨账号授权纳入基础能力，而不是外挂脚本。

### 7.3 对象存储瓶颈已从“吞吐”转向“控制面”
ClickHouse 的 S3 LIST、DuckDB 的请求数暴增、Doris 的云对象存储接入增强，都说明真实问题不只是 scan speed，而是**文件发现、列举、预取、请求合并、分区裁剪时机**。  
**参考价值**：做湖仓查询架构时，要重点评估控制面开销，否则账单和延迟都会失控。

### 7.4 正确性问题比纯性能问题更受重视
Doris 的 Hive DATE 偏移、ClickHouse 的全文索引/窗口结果错误、DuckDB 的 internal error、Delta 的 data skipping 大小写不一致，都是典型信号。  
**参考价值**：生产系统选型不能只看 benchmark，更要看复杂边界条件下的语义稳定性和修复速度。

### 7.5 可观测性正在成为核心竞争力
Doris 默认开启 JVM monitor、StarRocks 修 query_pool 负内存、Gluten 修指标口径、ClickHouse 修 Prometheus/query_log 行为，说明“指标是否可信”已成为企业落地关键。  
**参考价值**：运维团队应优先选择具备完整资源画像、执行诊断和稳定指标体系的引擎。

### 7.6 基础执行层生态的重要性持续上升
Velox、Gluten、Arrow 的活跃，说明数据库竞争不再只发生在最终产品层，也发生在**执行内核、向量化引擎、列式内存、跨语言接口**层。  
**参考价值**：如果企业有自研加速层或多引擎栈，Velox / Arrow 这类底层生态的成熟度值得长期跟踪。

---

# 结论

从 2026-03-15 的整体动态看，OLAP 开源生态已进入一个非常清晰的阶段：  
**功能扩展仍在继续，但真正拉开差距的，正在变成云环境适配、湖仓互操作、查询正确性、对象存储控制面效率、以及可观测性成熟度。**

对技术决策者而言：
- 若关注**统一分析数据库 + 湖仓接入 + 云原生适配**，Doris 与 StarRocks值得重点关注，其中 Doris 当天展现出更强的多云与生态扩张势头。  
- 若关注**极致执行性能与大规模工程化能力**，ClickHouse 仍是最活跃、最有深度的头部项目。  
- 若关注**嵌入式分析与对象存储文件查询**，DuckDB 的方向最明确。  
- 若关注**表格式与多引擎共享数据层**，Iceberg 仍是最活跃的生态中枢之一，Delta 更偏 Spark/协议一致性路线。  
- 若关注**底层执行与加速基础设施**，Velox、Arrow、Gluten 的信号值得持续跟踪。

如果你愿意，我下一步可以把这份报告继续整理成：
1. **管理层 1 页摘要版**  
2. **“Doris vs ClickHouse vs StarRocks”专题对比版**  
3. **按“湖仓 / 云原生 / 执行引擎 / 可观测性”四个主题重组的深度版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-15）

## 1. 今日速览

过去 24 小时 ClickHouse 社区保持**高活跃**：Issues 更新 18 条、PR 更新 126 条，说明核心开发、回归修复和功能演进都在持续推进。  
从内容看，今日重点集中在三类：**稳定性修复**（崩溃、Keeper 竞态、Analyzer/Distributed 查询异常）、**性能优化**（Join、字典、S3/对象存储访问）以及**安全边界补强**（Datalake/Iceberg 路径校验、Interserver 认证流程）。  
虽然今日**没有新版本发布**，但从活跃 PR 类型判断，项目正处于一个典型的“**发布前收敛 + 新特性并行孵化**”阶段。  
整体健康度评价为：**活跃且偏工程化稳态推进**，但需要继续关注 CI crash、Keeper 稳定性、Analyzer 相关回归，以及对象存储/湖仓场景下的边界行为。

---

## 2. 项目进展

> 说明：给定数据未列出完整 merged PR 明细，因此本节基于“今日已关闭 Issue + 今日高价值活跃 PR”总结项目推进方向，重点关注对查询引擎、存储引擎、SQL 兼容性有实质影响的变更。

### 2.1 查询引擎与 SQL 行为修复持续推进

- **分布式 IN 子查询过滤下推修复**  
  PR: [#99436](https://github.com/ClickHouse/ClickHouse/pull/99436)  
  该 PR 修复 `IN/GLOBAL IN` 子查询内部的 distributed 表无法继承 `filter_actions_dag` 的问题，否则 `force_optimize_skip_unused_shards` 等优化无法生效。  
  **意义**：这直接关系到分布式查询的裁剪能力和执行成本，属于优化器/Planner 正确性与性能双相关修复。

- **`count` 处理 `Nullable(Tuple)` 子列异常修复**  
  PR: [#99490](https://github.com/ClickHouse/ClickHouse/pull/99490)  
  修复 `count(tup.s)` 在 `Nullable(Tuple(...))` 子列上的异常。  
  **意义**：这是典型 SQL 表达式与复杂类型组合上的兼容性修复，对使用半结构化复杂类型的用户价值较高。

- **`windowFunnel(strict_deduplication)` 结果级别错误修复**  
  PR: [#99003](https://github.com/ClickHouse/ClickHouse/pull/99003)  
  **意义**：直接影响分析结果正确性，尤其是事件漏斗场景，属于业务可见型 correctness bug。

- **`CAST(value, 'Nullable(FixedString(N))')` 语义修复**  
  PR: [#98989](https://github.com/ClickHouse/ClickHouse/pull/98989)  
  使超长字符串转换时返回 `NULL` 而不是抛异常。  
  **意义**：改善 SQL 类型系统的一致性，也和今日关闭的类型转换相关 Issue 相呼应。

- **`MATERIALIZED` 依赖 `EPHEMERAL` 列时 mutation 失败修复**  
  PR: [#99281](https://github.com/ClickHouse/ClickHouse/pull/99281)  
  **意义**：这属于表定义依赖拓扑和 mutation 执行路径的修补，面向较复杂 schema 的生产用户。

### 2.2 存储与执行性能优化在加速

- **小整数范围 Hash Join 的直接索引哈希表优化**  
  PR: [#99275](https://github.com/ClickHouse/ClickHouse/pull/99275)  
  当 join key 是小范围整数时，以数组替代传统哈希表。  
  **意义**：典型的分析引擎底层优化，预期可降低探测开销、提升 cache locality，对高频维表 Join 很有潜力。

- **单字典场景避免反复失效**  
  PR: [#99285](https://github.com/ClickHouse/Clickhouse/pull/99285)  
  在 `LowCardinality` 仅有一个大字典时，避免因不连续读取造成重复 invalidation。  
  **意义**：对列式扫描和字典编码列的性能有实际收益，尤其是宽表/高重复值场景。  
  > 注意：上述链接仓库名大小写可能需跳转到标准地址，标准 PR 编号为 [#99285](https://github.com/ClickHouse/ClickHouse/pull/99285)

- **覆盖率流水线符号质量修复**  
  PR: [#99513](https://github.com/ClickHouse/ClickHouse/pull/99513)  
  解决 nightly coverage 流水线中客户端符号无法正确解析的问题。  
  **意义**：虽非用户功能，但明显提升研发可观测性和回归分析效率，有利于稳定性建设。

### 2.3 Keeper / 协调层持续收敛

- **Keeper 读请求与 session close 竞态修复**  
  PR: [#99484](https://github.com/ClickHouse/ClickHouse/pull/99484)  
  **意义**：Keeper 是集群元数据协调核心组件，此类 race fix 对集群稳定性影响大。

- **NuRaft 段错误修复**  
  PR: [#99133](https://github.com/ClickHouse/ClickHouse/pull/99133)  
  **意义**：底层 Raft 组件崩溃修复，属于高优先级稳定性工作。

- **Keeper Raft TLS 证书热重载**  
  PR: [#93455](https://github.com/ClickHouse/ClickHouse/pull/93455)  
  **意义**：提升运维友好性与安全合规能力，减少轮换证书时的中断风险。

### 2.4 今日已关闭 Issue 反映的落地修复

- **Dashboard 空结果仍显示图表标题**  
  Issue: [#85225](https://github.com/ClickHouse/ClickHouse/issues/85225)  
  **意义**：前端可用性/产品体验小修复，说明维护者仍在处理易用性细节。

- **`expire_snapshots` 共享文件重复计数问题关闭**  
  Issue: [#99340](https://github.com/ClickHouse/ClickHouse/issues/99340)  
  **意义**：涉及快照/manifest 文件统计正确性，偏数据湖和对象存储元数据管理。

- **`LowCardinality(Nullable(String))` cast 异常关闭**  
  Issue: [#95670](https://github.com/ClickHouse/ClickHouse/issues/95670)  
  **意义**：类型系统兼容性问题被修复，与当前多条类型/表达式语义修复形成一致趋势。

---

## 3. 社区热点

### 3.1 S3 列表操作并行化诉求持续受到关注
- Issue: [#65572 Parallelize listing of files on S3](https://github.com/ClickHouse/ClickHouse/issues/65572)

这是今天最值得关注的长期热点之一。问题核心在于 S3 `LIST` 请求吞吐低、分页限制严格，导致千万级对象枚举可能耗时数十分钟到数小时。  
**背后技术诉求**：  
1. ClickHouse 在湖仓/对象存储场景中的元数据发现速度；  
2. 冷数据、共享存储、外部表的初始化与 warmup 效率；  
3. 大规模数据湖接入时的“控制面性能”问题，而不仅仅是查询执行面。  
这类问题若被推进，通常会显著改善 Iceberg/Hudi/外部对象目录的大规模生产体验。

### 3.2 Keeper 升级后连接丢失问题仍有用户反馈
- Issue: [#71744 Connection Loss Issues After ClickHouse Update and Migration to ClickHouse Keeper](https://github.com/ClickHouse/ClickHouse/issues/71744)

用户从 22 升级到 24，并从 ZooKeeper 迁移到 ClickHouse Keeper 后，持续遭遇 `Connection loss`。  
**技术信号**：Keeper 生态虽在持续增强，但升级路径、负载模式、配置兼容性仍是用户高敏感区。  
结合今日活跃 PR [#99484](https://github.com/ClickHouse/ClickHouse/pull/99484)、[#99133](https://github.com/ClickHouse/ClickHouse/pull/99133)、[#93455](https://github.com/ClickHouse/ClickHouse/pull/93455)，可以判断协调层仍是近期维护重点。

### 3.3 临时数据库功能继续推进
- PR: [#92610 Introduce temporary databases](https://github.com/ClickHouse/ClickHouse/pull/92610)

虽然不是今天新开，但仍处于活跃状态。  
**背后诉求**：  
- 临时对象生命周期管理；  
- 会话级隔离实验环境；  
- ETL 中间态/开发调试场景更轻量化。  
如果该功能落地，可能补齐当前仅依靠 temporary tables 的使用边界。

### 3.4 湖仓安全边界持续收紧
- PR: [#99467 Fix one cornercase of Datalake security vulnerability](https://github.com/ClickHouse/ClickHouse/pull/99467)  
- Issue: [#99512 Interserver Mode Entered Before Secret Hash Verified](https://github.com/ClickHouse/ClickHouse/issues/99512)

今日安全相关话题值得额外关注：  
一方面，Datalake/Iceberg 路径逃逸类问题还在补 corner case；另一方面，Interserver 认证顺序问题可能导致未验证前暴露真实元数据。  
**技术诉求**：随着 ClickHouse 更广泛用于对象存储、共享计算和多租环境，协议认证和外部文件访问边界正从“边缘问题”变成核心能力要求。

---

## 4. Bug 与稳定性

> 按严重程度排序，并尽量标注是否已有相关 fix PR。

### P0 / 安全与潜在数据边界风险

1. **Interserver 认证前进入模式，可能泄露真实表元数据**  
   Issue: [#99512](https://github.com/ClickHouse/ClickHouse/issues/99512)  
   描述表明可在 secret hash 校验前进入 Interserver Mode，并返回如 `system.tables`、`system.databases` 等真实元数据。  
   **严重性**：高，涉及认证顺序与信息泄露。  
   **是否已有 fix PR**：数据中未见直接对应 PR，需尽快确认。

2. **Datalake / Iceberg 文件路径越界读取补丁跟进**  
   PR: [#99467](https://github.com/ClickHouse/ClickHouse/pull/99467)  
   修复在 #98936 之后仍存在的 corner case：manifest 可能指向 `user_files` 外部数据文件并被读取。  
   **严重性**：高，涉及外部表访问边界。  
   **状态**：已有活跃修复 PR。

### P1 / 崩溃与服务稳定性

3. **CI 崩溃：`Double free or corruption in MergeTreeDataPartCompact`**  
   Issue: [#98949](https://github.com/ClickHouse/ClickHouse/issues/98949)  
   **严重性**：高。双重释放/内存破坏类问题通常需要尽快根因定位，且与 MergeTree 核心存储路径相关。  
   **是否已有 fix PR**：未见直接关联 PR。

4. **Analyzer + 嵌套 `GLOBAL IN` 导致服务崩溃**  
   Issue: [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362)  
   新 analyzer 启用时，Distributed 表上的嵌套 `GLOBAL IN` 触发 `Segmentation fault`。  
   **严重性**：高，影响新 Planner/Analyzer 稳定性。  
   **潜在相关修复**：PR [#99436](https://github.com/ClickHouse/ClickHouse/pull/99436) 修复的是 IN 子查询中 distributed 过滤传递问题，**相关但不能确认已覆盖崩溃根因**。

5. **CI 崩溃：merge sort 阶段 `SortingQueueImpl` 构造失败**  
   Issue: [#99503](https://github.com/ClickHouse/ClickHouse/issues/99503)  
   **严重性**：中高。虽然 trace 来自非 master/release，但排序执行链路是关键组件。  
   **是否已有 fix PR**：未见。

6. **Keeper 读请求与会话关闭竞态**  
   PR: [#99484](https://github.com/ClickHouse/ClickHouse/pull/99484)  
   **严重性**：高。对协调一致性和客户端稳定性有直接影响。  
   **状态**：已有修复 PR，建议优先审查/回归。

7. **NuRaft 段错误**  
   PR: [#99133](https://github.com/ClickHouse/ClickHouse/pull/99133)  
   **严重性**：高。若落在 Keeper/Raft 复制路径，会影响集群元数据服务稳定性。  
   **状态**：已有修复 PR。

### P2 / 查询正确性与可观测性问题

8. **全文索引 + OR 条件返回错误结果**  
   Issue: [#99502](https://github.com/ClickHouse/ClickHouse/issues/99502)  
   `hasAllTokens OR hasAllTokens` 在 full text index 场景下返回实际不含目标 token 的行。  
   **严重性**：高于一般功能 bug，因为涉及查询正确性。  
   **是否已有 fix PR**：未见。

9. **Prometheus HTTP handler 不增加 rows/bytes 指标，且可能不写入 `system.query_log`**  
   Issue: [#99475](https://github.com/ClickHouse/ClickHouse/issues/99475)  
   **严重性**：中高。影响可观测性、计费统计、审计与故障排查。  
   **是否已有 fix PR**：未见。

10. **`refresh_parts_interval` 存在意外/未文档化行为**  
    Issue: [#96402](https://github.com/ClickHouse/ClickHouse/issues/96402)  
    与 one-writer-many-readers 的 S3-backed MergeTree 相关。  
    **严重性**：中。影响共享存储读取语义和预期一致性。  
    **是否已有 fix PR**：未见。

11. **`clickhouse-local` 未初始化 page cache**  
    Issue: [#99499](https://github.com/ClickHouse/ClickHouse/issues/99499)  
    **严重性**：中。不会导致错误结果，但影响本地执行性能与配置一致性。  
    **是否已有 fix PR**：未见。

12. **`optimize_inverse_dictionary_lookup` 对 `IN` 条件不生效**  
    Issue: [#99500](https://github.com/ClickHouse/ClickHouse/issues/99500)  
    **严重性**：中。属于优化未覆盖，影响性能而非正确性。  
    **是否已有 fix PR**：未见。

---

## 5. 功能请求与路线图信号

### 5.1 ReplacingMergeTree 自动清理删除行
- Issue: [#99348](https://github.com/ClickHouse/ClickHouse/issues/99348)

用户希望为 `ReplacingMergeTree` 引入 `replacing_merge_cleanup_period_seconds`，自动周期性清理 `is_deleted` 行。  
**路线图信号**：较强。  
原因是这符合 ClickHouse 近两年的典型演进方向：在保留高吞吐写入和延迟合并的同时，逐步改善“可变数据管理”的可操作性。  
若进入实现，将直接改善“软删除 + 后台回收”的运维成本。

### 5.2 二级索引内容可视化
- Issue: [#99507](https://github.com/ClickHouse/ClickHouse/issues/99507)  
- 相关重复关闭：[#99506](https://github.com/ClickHouse/ClickHouse/issues/99506)

诉求是查看 Skip Index 里实际存储的值，用于调试和教学。  
**路线图信号**：中等。  
这更像“可观测性/可解释性”增强，而不是执行引擎能力本身。若实现，可能首先以 system 表增强、调试函数或 `EXPLAIN` 扩展形式落地。

### 5.3 MergeTree 排序键支持虚拟列
- PR: [#99509](https://github.com/ClickHouse/ClickHouse/pull/99509)

这是今天非常有意思的功能信号。  
**潜在价值**：  
- 增强 MergeTree 设计灵活性；  
- 让系统派生信息参与排序/组织；  
- 可能与对象存储、分区裁剪、数据布局优化结合。  
**路线图信号**：中高，但需看复杂度和语义边界是否易于维护。

### 5.4 `printf` 支持基于列值的动态格式串
- PR: [#98991](https://github.com/ClickHouse/ClickHouse/pull/98991)

**路线图信号**：较强。  
这是非常明确的新 SQL 能力，且实现价值清晰，适合进入后续版本以增强表达式层灵活性。

### 5.5 临时数据库
- PR: [#92610](https://github.com/ClickHouse/ClickHouse/pull/92610)

**路线图信号**：很强。  
这是一个具有产品层意义的能力，不只是函数补充。若通过，可能改变开发测试、临时数据处理和多会话隔离的最佳实践。

---

## 6. 用户反馈摘要

### 6.1 对象存储/湖仓场景的“控制面性能”依然是痛点
- 代表 Issue: [#65572](https://github.com/ClickHouse/ClickHouse/issues/65572), [#96402](https://github.com/ClickHouse/ClickHouse/issues/96402)

用户不仅关心扫描速度，也关心**列目录、manifest、parts 刷新、元数据发现**等控制面操作的耗时和一致性。  
这意味着 ClickHouse 在云原生/湖仓部署中，瓶颈已从单机 SQL 执行延伸到对象存储交互模型。

### 6.2 Keeper 升级与替换 ZooKeeper 仍存在心理门槛
- 代表 Issue: [#71744](https://github.com/ClickHouse/ClickHouse/issues/71744)

用户在版本升级和协调组件迁移后遇到持续连接丢失，说明 Keeper 虽然方向明确，但在生产迁移上仍需更强的：  
- 升级指南  
- 故障模式文档  
- 参数调优建议  
- 兼容性检查工具

### 6.3 新 Analyzer 已能覆盖更多场景，但仍有回归风险
- 代表 Issue: [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362)

用户愿意启用 analyzer，但一旦在 `GLOBAL IN`、Distributed、复杂子查询上触发崩溃，会显著影响采用信心。  
这类反馈表明：**新规划器的功能推进快于生产稳定性沉淀**，仍需更强回归测试。

### 6.4 用户希望更强的“可解释性”
- 代表 Issue: [#99507](https://github.com/ClickHouse/ClickHouse/issues/99507)

查看二级索引内容、本地 page cache 行为一致性、Prometheus 接口是否写 query log，本质都反映出用户不只想要“快”，还想知道“为什么这样执行、为什么没有生效”。

---

## 7. 待处理积压

### 7.1 长期高价值但未决：S3 文件列表并行化
- Issue: [#65572](https://github.com/ClickHouse/ClickHouse/issues/65572)  
创建于 2024-06-23，至今仍活跃。  
**建议**：优先级应提高。它影响大规模对象存储场景的冷启动、数据发现和运维体验，属于系统级瓶颈。

### 7.2 临时数据库 PR 持续悬而未决
- PR: [#92610](https://github.com/ClickHouse/ClickHouse/pull/92610)  
创建于 2025-12-18。  
**建议**：若设计方向认可，应尽快给出明确 review 结论，避免大型功能长期挂起消耗贡献者热情。

### 7.3 Keeper TLS 热重载 PR 周期较长
- PR: [#93455](https://github.com/ClickHouse/ClickHouse/pull/93455)  
创建于 2026-01-05。  
**建议**：该功能对安全运维价值高，建议尽快完成验证，特别是在 Keeper 仍有稳定性反馈的背景下。

### 7.4 ORC/Parquet/Arrow 非 Range URL 读取告警
- PR: [#96988](https://github.com/ClickHouse/ClickHouse/pull/96988)  
**建议**：这是用户体验层面很有价值的“小改进”。它能提前暴露“为何读取整个文件”的性能陷阱，值得快速推进。

### 7.5 Keeper 连接丢失用户案例需要更强闭环
- Issue: [#71744](https://github.com/ClickHouse/ClickHouse/issues/71744)  
**建议**：需要维护者给出最小复现、日志收集模板或参数核查路径，否则这类升级后问题会持续积压并影响 Keeper 口碑。

---

## 8. 总结判断

今天的 ClickHouse 动态体现出一个很鲜明的特征：**主线仍是“高性能分析引擎 + 云/湖仓能力 + 协调层稳定性”的三线并进**。  
从 PR 结构看，团队在持续修补 SQL correctness、复杂类型、Planner/Analyzer、Keeper 以及对象存储边界问题；从 Issue 结构看，用户的核心诉求集中在**稳定、可解释、适配云存储和大规模生产场景**。  
短期建议重点关注：  
1. 安全边界问题（Interserver、Iceberg/Datalake）；  
2. Keeper 稳定性与升级可用性；  
3. Analyzer/Distributed 查询崩溃回归；  
4. 对象存储控制面性能。  

整体来看，项目健康度仍然很高，但**进入更多复杂生产场景后，边界条件和运维可预测性正在成为与性能同等重要的竞争点**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-15

## 1. 今日速览

过去 24 小时 DuckDB 社区保持较高活跃度：Issues 更新 11 条、PR 更新 15 条，说明 1.5.x 发布后的回归修复与性能调优正在密集推进。  
当前讨论重心非常明确，集中在 **S3/Hive 分区读取性能回归、Parquet 读取优化、CLI/Windows 兼容性、以及新引入 Variant/ADBC 相关稳定性问题**。  
从 PR 动向看，维护者对高优先级回归响应较快，尤其是 **`enable_external_access=false` 导致 checkpoint 失败** 已在 24 小时内给出修复并关闭。  
整体健康度评价为 **活跃且修复节奏积极**，但 1.5.0 相关的远程对象存储访问模式变化，已经显露出若干性能与兼容性风险，值得持续跟踪。

---

## 3. 项目进展

### 已关闭/合并的重要 PR

#### 1) 修复持久化数据库在禁用外部访问时无法 checkpoint
- **PR:** #21379 Fix #21335: correctly add checkpoint and recovery WAL to allowed paths when launching an initial db with enable_external_access set to false  
- **状态:** Closed  
- **链接:** duckdb/duckdb PR #21379

这是今天最明确的稳定性修复之一，直接对应 Issue #21335。问题表现为：当用户以 `enable_external_access=false` 打开持久化数据库时，WAL checkpoint 会因权限校验失败而报错。  
该修复说明 DuckDB 在安全限制与本地持久化路径白名单之间的边界处理已被调整，有助于提升嵌入式/受限环境部署的可靠性，尤其适用于本地应用、沙箱执行与安全默认配置场景。

---

#### 2) Parquet 远程读取请求合并优化，缓解 S3 请求暴增
- **PR:** #21373 Parquet Reader: Allow merging of prefetch column ranges for columns that do not have table filters  
- **状态:** Closed  
- **链接:** duckdb/duckdb PR #21373

该 PR 明确“部分修复”了 Issue #21348。核心改动是：即使查询中存在过滤器，只要某些列本身不参与 table filter，Parquet prefetcher 仍可合并相邻列范围读取，减少对象存储上的 HTTP GET 次数。  
这属于典型的 **分析型存储引擎 I/O 优化**，对 S3/HTTP 场景尤其关键，因为远程读的主要瓶颈常常不是吞吐，而是请求次数与延迟放大。

---

#### 3) 基于 glob 文件大小改进 Parquet 基数估计
- **PR:** #21374 In the parquet reader, if we are globbing over a directory, use file sizes from the glob to estimate cardinalities instead of relying only on the first parquet file  
- **状态:** Closed  
- **链接:** duckdb/duckdb PR #21374

这项优化针对目录/glob 扫描场景下的统计估计误差。此前 DuckDB 可能只依赖首个 Parquet 文件来估算基数，若文件分布严重偏斜，就会误导优化器。  
改进后会利用 glob/listing 返回的文件大小信息来估算整体规模，更符合湖仓对象存储的真实数据分布，有利于：
- 改善扫描代价估算
- 优化 join/order/window 等算子计划
- 减少 S3 上的误判性预取或执行策略退化

---

#### 4) CI 体系继续提速，降低无效构建开销
- **PR:** #21366 Skip costly jobs unless extensions change  
- **状态:** Closed  
- **链接:** duckdb/duckdb PR #21366

- **PR:** #21368 Fine grained retry for CI commands  
- **状态:** Closed  
- **链接:** duckdb/duckdb PR #21368

这两项虽不直接改变查询语义，但对项目交付效率影响很大：  
一方面通过“仅在 extension 变化时运行高成本 job”缩短关键路径；另一方面为 `apt/pip/cmake/build` 等命令引入更细粒度重试，降低 CI 噪音。  
对于高频修复期的 DuckDB 来说，这类基础设施优化能显著提高修复 PR 的吞吐量。

---

#### 5) Windows/MinGW 构建环境进一步规范
- **PR:** #21371 Well-defined environment for MinGW builds  
- **状态:** Closed  
- **链接:** duckdb/duckdb PR #21371

该 PR 面向 Windows 非 MSVC 工具链生态，虽然 DuckDB 官方 CLI 二进制主要基于 Visual Studio 构建，但 MinGW 仍影响测试与静态库分发链路，尤其对 `duckdb-go` 等下游生态具有现实意义。  
这说明项目在 **跨平台嵌入式分发** 上仍保持投入。

---

### 仍在推进的重要开放 PR

#### 6) 更宽松的 Filter Pushdown 推进
- **PR:** #21350 introducing TryPushdownRelaxedFilter  
- **状态:** Open / Changes Requested  
- **链接:** duckdb/duckdb PR #21350

该 PR 尝试解决诸如 `start_time > now() - INTERVAL 1 HOUR` 无法下推的问题，根因是 `TIMESTAMP` 与 `TIMESTAMP WITH TIME ZONE` 的类型转换被视为“非可逆”。  
如果后续合并，意味着 DuckDB 在 **时间类型表达式下推** 方面会更激进，对大表时间范围过滤性能提升明显，属于优化器能力增强的重要信号。

---

#### 7) Checkpoint 事务化改造
- **PR:** #21382 Checkpoint transactions  
- **状态:** Open  
- **链接:** duckdb/duckdb PR #21382

该 PR 提议让 checkpoint 在独立事务中执行，若存在 client context 则新建连接和事务。  
这是一个偏底层但很关键的存储引擎改进方向，可能改善 checkpoint 的一致性边界、错误隔离和并发可控性，也与今天关闭的 checkpoint 相关 issue 构成呼应。

---

#### 8) Parquet lazy fetch 继续细化
- **PR:** #21383 Parquet: Ignore optional filters when deciding whether or not to do a lazy fetch  
- **状态:** Open  
- **链接:** duckdb/duckdb PR #21383

该 PR 是 #21373 的后续。其思路是：optional filters 只用于 row group pruning，在已经决定读取 row group 后，不应再影响 lazy fetch 决策。  
这表明 DuckDB 团队仍在持续梳理 **Parquet 扫描器中的过滤、预取、懒加载三者交互逻辑**，很可能是下一轮对象存储性能修复的关键。

---

## 4. 社区热点

### 1) S3/Hive 分区查询在 1.5.0 中请求数暴增
- **Issue:** #21348 `QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0  
- **评论:** 5 | 👍 2  
- **链接:** duckdb/duckdb Issue #21348

这是今天最值得关注的性能热点。用户报告从 v1.4.4 到 v1.5.0，同一类窗口查询在 S3 上的 HTTP GET 请求从约 80 次暴增到 4200+ 次，墙钟时间接近 3 倍。  
背后的技术诉求是：  
- 窗口函数与 `QUALIFY` 语义不应显著破坏对象存储访问局部性  
- 优化器/扫描器需要更好地利用分区裁剪与列预取合并  
- 新版本在正确性保持的同时，不能牺牲湖仓远程读取效率

该问题已经获得 #21373 的部分修复，但看起来仍未完全闭环。

---

### 2) Hive 分区过滤可能先全量发现文件再裁剪
- **Issue:** #21347 Hive partition filters discover all files before pruning in 1.5.0  
- **评论:** 1 | 👍 2  
- **链接:** duckdb/duckdb Issue #21347

虽然互动量不高，但问题指向非常核心：如果 1.5.0 改为先全量枚举 glob/S3 文件，再应用 hive partition filter，那么对象存储环境的 listing 与 metadata 开销会被系统性放大。  
这与 #21348 共同构成一个强烈信号：**1.5.0 在 Hive 分区 + S3 的文件发现/裁剪路径上可能存在回归。**

---

### 3) S3 分区写出出现超预期内存占用
- **Issue:** #11817 Out-of-memory error when performing partitioned copy to S3  
- **评论:** 10 | 👍 8  
- **链接:** duckdb/duckdb Issue #11817

这是当天“反应最多”的活跃问题。用户在执行带 hive partitioning 的 `COPY TO S3` 时，即使数据量不大，2GiB 内存限制下仍可能 OOM。  
这反映出用户对 DuckDB 作为 **湖仓 ETL/导出引擎** 的强需求，也说明写路径在高分区并发输出时的内存模型仍需优化。

---

### 4) Windows CLI 长期兼容性问题终于关闭
- **Issue:** #10302 DuckDB CLI: highlight/autocomplete not working on Windows  
- **状态:** Closed  
- **评论:** 13 | 👍 5  
- **链接:** duckdb/duckdb Issue #10302

这是列表中评论最多的历史问题之一。它被关闭意味着 Windows CLI 体验上的一个长期痛点应已告一段落。  
尽管不是内核层能力，但对新用户、教学、交互式分析、以及本地开发体验非常重要。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高优先级：对象存储性能回归与文件发现退化
#### A. `QUALIFY ROW_NUMBER() ... = 1` 在 S3 上触发约 50x 请求数增长
- **Issue:** #21348  
- **链接:** duckdb/duckdb Issue #21348  
- **是否已有修复:** 有部分修复，见 PR #21373；可能仍需后续 PR 补全

这类回归对生产分析场景影响极大，尤其是 lakehouse 查询、去重取最新记录等常见模式。其风险不只是“慢”，还包括云账单放大。

#### B. Hive 分区过滤疑似先发现所有文件再裁剪
- **Issue:** #21347  
- **链接:** duckdb/duckdb Issue #21347  
- **是否已有修复:** 暂无明确 fix PR 直接关闭；可能与 #21374、#21383 方向相关

如果属实，会系统性影响任何基于 S3 + hive path 的按分区过滤查询。

---

### P1 / 高优先级：崩溃、内部错误、接口回归

#### C. ADBC 接口在交错查询后 `stream.get_next()` 失败
- **Issue:** #21384  
- **状态:** 新报 / needs triage  
- **链接:** duckdb/duckdb Issue #21384  
- **是否已有修复:** 暂无

这是今日新增问题中最值得关注的接口层回归。ADBC 面向 Arrow 数据互操作和嵌入式驱动集成，一旦流式结果集在交错查询时失效，将直接影响上层客户端库和中间件。

#### D. JSON 转 Variant 触发 INTERNAL Error
- **Issue:** #21352  
- **状态:** reproduced  
- **链接:** duckdb/duckdb Issue #21352  
- **是否已有修复:** 暂无

报错内容显示 Variant 编码/转换路径存在内部状态不一致：`Field is missing but untyped_value_index is not set`。  
这通常意味着新特性仍在快速演化期，建议谨慎用于生产。

#### E. INTERNAL Error: Failed to bind column reference (inequal types)
- **Issue:** #21372  
- **状态:** reproduced  
- **链接:** duckdb/duckdb Issue #21372  
- **是否已有修复:** 暂无

这是典型的绑定器/类型系统问题，若能被稳定复现，通常应优先修复，因为其影响面可能超出单一查询模板。

#### F. FreeBSD 测试中出现 SIGILL
- **Issue:** #21262  
- **状态:** needs triage  
- **链接:** duckdb/duckdb Issue #21262  
- **是否已有修复:** 暂无

SIGILL 往往与编译选项、CPU 指令集假设或平台特定路径有关。虽然主要暴露在测试环境，但对 BSD 生态兼容性是负面信号。

---

### P2 / 中优先级：CLI 与行为一致性问题

#### G. DuckDB CLI 1.5.x 中 `.tables` 与 `-table` 输出异常/崩溃
- **Issue:** #21378  
- **状态:** reproduced  
- **链接:** duckdb/duckdb Issue #21378  
- **是否已有修复:** 暂无

这反映出 DuckDB CLI 与 SQLite 风格命令兼容层、以及文本表格输出渲染之间可能存在回归，影响命令行用户体验。

#### H. Hive Partitioning 在不同嵌套层级下行为不一致
- **Issue:** #21370  
- **状态:** under review  
- **链接:** duckdb/duckdb Issue #21370  
- **是否已有修复:** 暂无

属于语义/行为一致性问题，若最终确认，会影响用户对分区目录布局的预期。

#### I. `enable_external_access=false` 阻塞 WAL checkpoint
- **Issue:** #21335  
- **状态:** 已有修复  
- **链接:** duckdb/duckdb Issue #21335  
- **Fix PR:** #21379

该问题今日已有效闭环，是维护效率较高的正面案例。

---

## 6. 功能请求与路线图信号

今天严格意义上的“新功能请求”不多，更多是围绕现有功能在生产场景下的 **能力补强**。可观察到以下路线图信号：

### 1) 更强的表达式下推能力
- **PR:** #21350  
- **链接:** duckdb/duckdb PR #21350

`TryPushdownRelaxedFilter` 表明 DuckDB 正尝试在类型转换不完全可逆的情况下，谨慎放宽 pushdown 条件。  
这很可能被纳入下一版本，因为它直接关系到大表时间过滤的性能上限，且有明确用户场景支撑。

---

### 2) Parquet/S3 扫描器持续朝“云对象存储优先”优化
- **PRs:** #21373, #21374, #21383  
- **链接:** duckdb/duckdb PR #21373 / PR #21374 / PR #21383

这些 PR 组合起来释放出非常明确的信号：  
DuckDB 正在把 Parquet 读取链路中的 **cardinality estimation、prefetch range merge、lazy fetch、row group pruning、optional filters** 进行更细粒度重构。  
这类工作大概率会持续进入 1.5.x 后续补丁版，因为它们直接应对用户已经报告的回归问题。

---

### 3) 存储引擎事务边界与 checkpoint 机制继续演进
- **PR:** #21382  
- **链接:** duckdb/duckdb PR #21382

如果该 PR 最终合并，未来 checkpoint 相关问题可能会更容易隔离和恢复，也有助于持久化数据库在复杂嵌入式场景中表现得更稳健。

---

### 4) 跨平台构建与开发者体验仍有投入
- **PRs:** #21376, #21371  
- **链接:** duckdb/duckdb PR #21376 / PR #21371

虽不属于终端 SQL 功能，但这通常意味着项目在下游集成、嵌入式构建、以及贡献者体验方面仍保持积极维护。

---

## 7. 用户反馈摘要

结合今天活跃 Issues，可以提炼出以下真实用户痛点：

### 1) 云对象存储场景下，用户对“请求数”比纯吞吐更敏感
- 相关链接：#21348, #21347, #11817  
- `duckdb/duckdb Issue #21348`  
- `duckdb/duckdb Issue #21347`  
- `duckdb/duckdb Issue #11817`

用户已不再只关注单机 SQL 正确性，而是在 **S3 上的 GET 次数、文件发现策略、分区裁剪时机、COPY 内存占用** 等云成本指标上非常敏感。  
这说明 DuckDB 已被广泛用于 lakehouse 查询与导出任务，远程 I/O 行为已成为一等公民问题。

---

### 2) 新特性采用者愿意尝鲜，但对 INTERNAL Error 容忍度低
- 相关链接：#21352, #21372  
- `duckdb/duckdb Issue #21352`  
- `duckdb/duckdb Issue #21372`

Variant、复杂 JSON 转换、类型绑定边界都是高级用户场景。用户会快速验证新能力，但一旦触发 internal error，说明系统还没有足够稳固到“可预测生产使用”的程度。

---

### 3) 嵌入式/驱动接口稳定性仍是关键诉求
- 相关链接：#21384, #21335  
- `duckdb/duckdb Issue #21384`  
- `duckdb/duckdb Issue #21335`

ADBC 流式接口与受限文件访问模式都属于典型嵌入式集成需求。  
用户期待 DuckDB 不仅能执行 SQL，还应在驱动层、权限模型、持久化行为上具备稳定且一致的语义。

---

### 4) CLI 仍然是高频入口，兼容性问题影响感知明显
- 相关链接：#10302, #21378  
- `duckdb/duckdb Issue #10302`  
- `duckdb/duckdb Issue #21378`

Windows 终端体验、`.tables` 命令兼容性、`-table` 输出排版等看似边缘，但直接影响用户第一印象和日常交互效率。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或高价值积压项：

### 1) 分区写出到 S3 的内存占用问题长期活跃
- **Issue:** #11817  
- **创建时间:** 2024-04-24  
- **链接:** duckdb/duckdb Issue #11817

该问题已存在近两年，评论与点赞均较高，说明影响用户面较广。建议优先评估：
- 分区 writer 的内存生命周期
- 小分区/多分区写出策略
- S3 multipart / buffering 策略是否过于激进

---

### 2) FreeBSD SIGILL 仍处于 needs triage
- **Issue:** #21262  
- **链接:** duckdb/duckdb Issue #21262

平台兼容性问题若长期未处理，容易削弱社区对非主流平台支持的信心。即便不是主线用户群，也建议尽快确认是否为编译参数或特定 CPU 特性导致。

---

### 3) 新近出现的 ADBC 回归需尽快定级
- **Issue:** #21384  
- **链接:** duckdb/duckdb Issue #21384

虽然是今日新 issue，但接口层回归通常影响生态广、修复优先级高，不宜在队列中停留过久。

---

### 4) `TryPushdownRelaxedFilter` 仍处于 Changes Requested
- **PR:** #21350  
- **链接:** duckdb/duckdb PR #21350

这是一个潜在收益很高的优化器增强点。若评审周期过长，可能延后大表时间过滤性能收益落地。建议明确 review 关注点，尽快推进到可合并状态。

---

## 总结

今天 DuckDB 的主线工作可以概括为两条：  
1. **快速修复 1.5.x 暴露出的稳定性与对象存储回归问题**；  
2. **继续打磨 Parquet/S3 扫描与 checkpoint/构建基础设施。**

从维护动作看，项目响应速度较快，尤其是安全访问模式下 checkpoint 失败问题已经闭环；但从用户反馈看，**S3/Hive 分区相关性能回归** 仍是当前最关键风险点，建议作为接下来版本修复的重点观察对象。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

以下是 **StarRocks 2026-03-15 项目动态日报**。

---

# StarRocks 项目动态日报｜2026-03-15

## 1. 今日速览

过去 24 小时内，StarRocks 社区整体保持**中等偏活跃**：共有 **2 条 Issue 更新**、**12 条 PR 更新**，其中 **6 条 PR 已合并/关闭**、**6 条仍在推进中**。  
从内容上看，今日工作重心仍集中在 **稳定性修复、权限语义完善、外部表/湖仓兼容性增强，以及测试与工程体系改进**。  
尤其值得关注的是，围绕 **Ranger 权限绕过逻辑**、**空 tablet 扫描崩溃**、**Paimon 统计信息错误** 等问题，项目已经体现出较快的“**Issue -> PR**”响应闭环。  
不过，今日没有新版本发布，说明这些修复和增强目前仍处在主干或分支回补阶段，尚未形成新的正式发布节奏。

---

## 3. 项目进展

### 3.1 权限与安全语义修复：root 用户绕过 Ranger 权限检查
- PR: **#70254** `[CLOSED] [BugFix] Ensure root user bypasses all Ranger permission checks`  
  链接: https://github.com/StarRocks/starrocks/pull/70254
- Backport:
  - **#70279** `version:3.5.15`  
    https://github.com/StarRocks/starrocks/pull/70279
  - **#70278** `version:4.0.8`  
    https://github.com/StarRocks/starrocks/pull/70278
  - **#70277** `version:4.1.0`  
    https://github.com/StarRocks/starrocks/pull/70277

**进展解读：**  
这是今天最明确的一项已落地修复。该改动确保 **root 用户不会再受 Ranger 中策略配置影响**，统一实现“root 超级权限”语义，并补充了测试。  
这对企业级部署尤其重要，因为 Ranger 集成通常用于统一权限治理，而 root 语义不一致会带来 **运维失效、应急排障受阻、权限模型混乱** 等问题。  
同时，该修复已被回补到 **3.5 / 4.0 / 4.1**，说明维护团队认为其具备较高的生产环境价值与修复优先级。

---

### 3.2 存储与事务优化：多语句事务支持 file bundling
- PR: **#70276** `[CLOSED] [Enhancement] Support file bundling in multi-statement transactions`  
  链接: https://github.com/StarRocks/starrocks/pull/70276

**进展解读：**  
该增强移除了此前对 **multi-statement transaction** 场景下 file bundling 的保守禁用限制。  
背后的核心价值在于：在多语句事务中，StarRocks 过去为了保持 segments 与 bundle_file_offsets 的一一对应关系，牺牲了 bundling 优化；现在则开始恢复该能力，说明项目在 **事务写入链路、文件组织效率、存储写放大优化** 方面持续深入。  
这类优化通常不会直接改变 SQL 语义，但会影响 **导入效率、写入成本和湖仓/存储层行为一致性**。

---

### 3.3 外表与半结构化查询规划增强：暴露 variant 子字段访问路径
- PR: **#70252** `[CLOSED] [PROTO-REVIEW] [Enhancement] Expose variant subfield access paths for HDFS and Iceberg scans`  
  链接: https://github.com/StarRocks/starrocks/pull/70252

**进展解读：**  
该 PR 强化了 FE 端子字段裁剪能力，使 SQL 中对 **variant 路径** 的访问可在扫描规划阶段更完整地传播到 **HDFS 与 Iceberg 外表扫描节点**。  
这意味着 StarRocks 对外部数据源的**半结构化字段下推/裁剪表达能力**进一步提升，有助于减少不必要的数据读取，改善查询性能。  
从路线图信号看，StarRocks 正持续向 **湖仓分析引擎** 方向强化，尤其聚焦 Iceberg、HDFS 与复杂类型协同。

---

## 4. 社区热点

> 注：今天数据中各条目评论数和点赞数整体很低，没有出现高讨论度线程。以下“热点”更多是从**技术影响面和修复优先级**角度选出。

### 热点 1：空 tablet + physical split 导致 CN 崩溃
- Issue: **#70280** `[OPEN] [Bug] CN crash when scanning empty tablet with physical split enabled`  
  https://github.com/StarRocks/starrocks/issues/70280
- Fix PR: **#70281** `[OPEN] [BugFix] Fix CN crash when scanning empty tablet with physical split enabled`  
  https://github.com/StarRocks/starrocks/pull/70281

**技术诉求分析：**  
这是典型的 **执行层稳定性问题**。在 shared-data 集群中，当 tablet 为空但 PhysicalSplitMorselQueue 仍以 `need_split=true` 创建时，访问 rowset 数组会越界，直接触发 **SIGSEGV**。  
这类问题的技术诉求非常明确：用户希望在极端但真实存在的分片/空数据场景下，执行器仍能安全退化，而不是因边界条件崩溃。  
Issue 创建当天即出现修复 PR，说明维护者对 **CN 稳定性、共享数据架构边界条件** 保持高敏感度。

---

### 热点 2：Paimon 列统计信息错误影响优化器
- Issue: **#70282** `[OPEN] [Bug] Paimon column statistics uses nullCount as averageRowSize instead of avgLen`  
  https://github.com/StarRocks/starrocks/issues/70282
- Fix PR: **#70283** `[OPEN] [BugFix] Fix incorrect averageRowSize in Paimon column statistics`  
  https://github.com/StarRocks/starrocks/pull/70283

**技术诉求分析：**  
问题出在 `PaimonMetadata.buildColumnStatistic()`：`averageRowSize` 错误使用了 `nullCount`，而非 `avgLen`。  
这会直接把错误统计喂给优化器，进而影响 **代价模型、行宽估算、算子选择**，属于“不会立即 crash，但可能持续拖累查询计划质量”的隐性正确性/性能问题。  
从技术方向看，社区正越来越重视 **外部表元数据质量**，因为这直接决定 StarRocks 在 Paimon/Iceberg 等湖仓场景中的优化器可信度。

---

### 热点 3：Parquet UUID/FIXED_LEN_BYTE_ARRAY 兼容性增强
- PR: **#70226** `[OPEN] [Enhancement] add support for FIXED_LEN_BYTE_ARRAY types to be read as VARCHAR(36) lazily`  
  https://github.com/StarRocks/starrocks/pull/70226

**技术诉求分析：**  
用户给出的场景非常具体：Iceberg 表中的 `UUID` 列以 Parquet `FIXED_LEN_BYTE_ARRAY` 物理类型存储，StarRocks 当前无法读取目标列。  
该 PR 计划将相关类型**懒加载地映射为 `VARCHAR(36)`**，这是一个明显的 **数据湖格式兼容性补洞**。  
这类诉求通常来自真实生产接入，信号很强：StarRocks 用户希望它不仅能“接上”外部表，还能在复杂类型与逻辑类型映射上做到**足够宽容与实用**。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高严重：CN 在空 tablet 扫描时崩溃
- Issue: **#70280**  
  https://github.com/StarRocks/starrocks/issues/70280
- Fix PR: **#70281**  
  https://github.com/StarRocks/starrocks/pull/70281

**问题性质：** 执行器崩溃 / SIGSEGV  
**影响范围：** shared-data 集群、physical split 开启、空 tablet 边界场景  
**状态：** 已有修复 PR，尚未合并

---

### P1 / 中高严重：Paimon 列统计 averageRowSize 计算错误
- Issue: **#70282**  
  https://github.com/StarRocks/starrocks/issues/70282
- Fix PR: **#70283**  
  https://github.com/StarRocks/starrocks/pull/70283

**问题性质：** 优化器输入统计错误，可能导致计划质量下降  
**影响范围：** 开启 `enable_paimon_column_statistics=true` 的 Paimon 查询场景  
**状态：** 已有修复 PR，尚未合并

---

### P1 / 中高严重：query_pool 内存出现大幅负值
- PR: **#70228** `[OPEN] [BugFix] Fix query_pool negative memory caused by bthread TLS pollution`  
  https://github.com/StarRocks/starrocks/pull/70228

**问题性质：** 内存追踪错误 / 资源监控失真  
**摘要：** 在 load-only 场景中，`query_pool` memory tracker 可能出现如 `-906GB` 的负值，根因是 bthread yield 后 TLS mem tracker 污染。  
**影响：** 虽然进程级内存跟踪仍正确，但这会严重干扰运维判断、资源画像和问题定位。  
**状态：** PR 仍在进行中，值得重点关注

---

### P2 / 中严重：基础测试在 macOS 上可用性不足
- PR: **#70275** `[OPEN] [Refactor] Make base_test work on macOS`  
  https://github.com/StarRocks/starrocks/pull/70275

**问题性质：** 工程/测试环境兼容性  
**影响：** 降低本地开发、跨平台贡献门槛，尤其对外部贡献者友好  
**状态：** 处理中

---

### P2 / 中严重：BE 单测被跳过
- PR: **#70284** `[OPEN] [Tool] Fix BE UT is skipped`  
  https://github.com/StarRocks/starrocks/pull/70284

**问题性质：** 测试覆盖缺失 / CI 可信度下降  
**影响：** 增加回归风险，尤其是底层执行与存储逻辑  
**状态：** 新开 PR，建议优先处理

---

## 6. 功能请求与路线图信号

### 6.1 湖仓格式兼容性仍是强主线
- PR: **#70226**  
  https://github.com/StarRocks/starrocks/pull/70226
- Issue/PR: **#70282 / #70283**  
  https://github.com/StarRocks/starrocks/issues/70282  
  https://github.com/StarRocks/starrocks/pull/70283
- PR: **#70252**  
  https://github.com/StarRocks/starrocks/pull/70252

**判断：**  
今天最清晰的路线图信号来自 **Iceberg / Paimon / HDFS / Parquet** 相关变更。  
无论是：
- 修复 Paimon 统计信息质量，
- 支持 Parquet `FIXED_LEN_BYTE_ARRAY` / UUID 读取，
- 还是让 variant 子字段路径更好地下推到外部扫描节点，

都说明 StarRocks 正持续加强自己作为 **统一湖仓查询引擎** 的定位。  
这些能力非常可能被纳入后续小版本，因为它们直接关系到**接入成功率、查询性能和元数据可信度**。

---

### 6.2 企业权限体系继续完善
- PR: **#70254** 及 backports  
  https://github.com/StarRocks/starrocks/pull/70254

**判断：**  
Ranger 集成相关修复已完成主干与多版本回补，表明**企业安全治理**仍是维护重点。  
未来可预期项目还会继续补齐 **权限一致性、超级用户语义、外部授权系统对齐** 等细节。

---

### 6.3 写入与事务路径仍在迭代
- PR: **#70276**  
  https://github.com/StarRocks/starrocks/pull/70276

**判断：**  
多语句事务下 file bundling 能力恢复，显示团队正在推进 **事务写入效率与存储组织优化**。  
这类改动一般会逐步影响导入稳定性、存储成本与提交效率，属于长期收益型增强。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出以下真实用户痛点：

### 7.1 外部表“能连上”不等于“能正确优化/完整读取”
- 相关链接：  
  - https://github.com/StarRocks/starrocks/issues/70282  
  - https://github.com/StarRocks/starrocks/pull/70226

**用户痛点：**  
用户已经在真实使用 Paimon / Iceberg / Parquet 等生态，但在列统计、UUID 类型映射等细节上仍遇到阻碍。  
这反映出用户对 StarRocks 的期待已从“基本兼容”升级到“**优化器可信 + 类型兼容完整**”。

---

### 7.2 执行引擎边界条件稳定性仍很关键
- 相关链接：  
  - https://github.com/StarRocks/starrocks/issues/70280  
  - https://github.com/StarRocks/starrocks/pull/70281

**用户痛点：**  
在 shared-data、physical split、空 tablet 这类看似边缘但生产中常见的场景里，用户最不能接受的是**直接 crash**。  
这说明随着部署复杂度提升，社区对 **边界条件健壮性** 的要求越来越高。

---

### 7.3 运维可观测性必须可信
- 相关链接：  
  - https://github.com/StarRocks/starrocks/pull/70228

**用户痛点：**  
内存追踪出现极端负值虽未直接导致 OOM，但会显著降低平台监控与故障分析的可信度。  
对 OLAP 系统而言，**错误的资源指标** 往往与真正的性能问题一样令人困扰。

---

## 8. 待处理积压

从今日数据看，未见明显“长期无人响应”的陈旧 Issue；大多数问题都在创建后较快进入处理。  
但以下 **开放中 PR/Issue** 建议维护者重点跟进，以避免形成新的积压：

### 需要优先推进的开放项

1. **#70281** 修复空 tablet 扫描崩溃  
   https://github.com/StarRocks/starrocks/pull/70281  
   - 原因：涉及 CN SIGSEGV，优先级最高。

2. **#70283** 修复 Paimon averageRowSize 统计错误  
   https://github.com/StarRocks/starrocks/pull/70283  
   - 原因：影响优化器估算，属于隐性性能/正确性风险。

3. **#70228** 修复 query_pool 负内存  
   https://github.com/StarRocks/starrocks/pull/70228  
   - 原因：影响资源监控可信度，容易误导生产运维。

4. **#70226** 支持 Parquet FIXED_LEN_BYTE_ARRAY/UUID 惰性读取  
   https://github.com/StarRocks/starrocks/pull/70226  
   - 原因：有明确用户场景，属于湖仓兼容性增强，落地价值高。

5. **#70284** 修复 BE UT 被跳过  
   https://github.com/StarRocks/starrocks/pull/70284  
   - 原因：测试缺口会放大未来回归风险。

---

## 结论

今天的 StarRocks 呈现出较典型的 **“工程稳态推进日”**：没有新版本发布，但在 **权限修复、执行稳定性、外部格式兼容、事务写入优化、测试基础设施** 上都有实质进展。  
项目健康度整体良好，尤其是 **Issue 到修复 PR 的响应速度快**，说明维护者对生产问题反馈保持较高敏捷性。  
接下来最值得关注的，是 **#70281、#70283、#70228** 这三类分别代表 **崩溃稳定性、优化器统计质量、可观测性可信度** 的关键修复能否尽快合入并回补版本分支。

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合飞书/企业微信发布的简版**  
2. **适合邮件周报的管理层摘要版**  
3. **按“查询引擎 / 存储 / 湖仓生态 / 工程质量”分类的技术版**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-15）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：Issues 更新 5 条、PR 更新 22 条，但**无新版本发布**。  
从变更结构看，当前工作重心仍集中在 **Spark / Flink / Kafka Connect / REST Catalog / Core API** 几条主线上，尤其是查询执行正确性、连接器能力补齐以及维护任务可扩展性。  
稳定性方面，今天新增/活跃问题以 **分区迁移、统计信息配置、多引擎兼容性、属性解析细节** 为主，说明社区正在继续打磨 Iceberg 在复杂生产场景中的边界行为。  
健康度评估上，项目整体处于**持续迭代且问题可追踪修复**的状态：多个 bug 已有对应 PR，说明反馈到修复链路较顺畅；但也存在若干长期开放或 stale 的 PR/Issue，值得维护者进一步清理和定向推进。

---

## 3. 项目进展

> 注：今日无新版本发布，因此重点关注“已关闭/合并”的 PR 及其反映的方向性进展。

### 3.1 文档、依赖与维护类收敛

#### 1) Avro 依赖升级，处理安全漏洞
- **PR**: #15607 `[CLOSED] [OPENAPI, KAFKACONNECT] Build: Bump org.apache.avro:avro from 1.12.0 to 1.12.1`
- **链接**: apache/iceberg PR #15607
- **意义**:
  - 直接处理 **CVE-2025-33042**
  - 对 OpenAPI / Kafka Connect 相关模块的供应链安全有积极作用
- **分析**:
  - 虽然这类变更通常不体现新功能，但对生产环境用户来说是高价值更新信号，说明项目仍在持续跟进上游依赖风险。

#### 2) Parquet delete writer 文档改进 PR 关闭
- **PR**: #15230 `[CLOSED] [parquet, stale] Parquet: improve Javadoc for delete writers`
- **链接**: apache/iceberg PR #15230
- **意义**:
  - 虽为文档向改进，但反映出社区对 **delete writer 语义与使用方式** 的理解门槛较高。
- **分析**:
  - PR 被关闭而非推进，说明当前维护优先级更偏向功能和 bug 修复，而非纯文档增强。

#### 3) Spark 测试稳定性修复 PR 关闭
- **PR**: #15227 `[CLOSED] [spark, stale] Spark Test: Fix flaky TestCopyOnWriteDelete tests`
- **链接**: apache/iceberg PR #15227
- **意义**:
  - 涉及 CI flaky test，说明 Spark 删除路径的测试稳定性曾有噪音。
- **分析**:
  - 虽未继续推进，但暴露出 Iceberg 在 Spark 删除/Copy-on-Write 相关测试上仍需长期稳定性治理。

#### 4) REST `refresh()` refs-only metadata 优化 PR 关闭
- **PR**: #14166 `[CLOSED] [spark, parquet, core, flink, docs, build, stale] Rest: Allow refresh() to load refs only metadata`
- **链接**: apache/iceberg PR #14166
- **意义**:
  - 该方向原本旨在减少 `table.refresh()` 时不必要的快照加载，利于 REST Catalog 元数据访问效率。
- **分析**:
  - 关闭意味着这一优化路径暂未落地，**Catalog 元数据访问开销优化** 仍是后续可关注主题。

#### 5) BigQuery rename table PR 关闭
- **PR**: #15300 `[CLOSED] [core, GCP] BigQuery: implement rename table`
- **链接**: apache/iceberg PR #15300
- **意义**:
  - GCP / BigQuery 生态能力补齐尚未稳定推进。
- **分析**:
  - 对跨云目录与外部 catalog 集成用户而言，这是一个需要继续观察的信号。

#### 6) Geospatial Bounding Box 基础能力 PR 关闭
- **PR**: #12667 `[CLOSED] [API, core] API: Add geospatial bounding box types and implement intersects checking`
- **链接**: apache/iceberg PR #12667
- **意义**:
  - 该 PR 关闭并不代表方向终止，因为后续增强 PR #14101 仍在打开状态。
- **分析**:
  - 这更像是 geospatial 能力从“单一大 PR”转为“拆分渐进式推进”。

---

## 4. 社区热点

### 4.1 Hive 表迁移中的空分区处理
- **Issue**: #15332 `[OPEN] [bug] Null partition handling of hive migration`
- **链接**: apache/iceberg Issue #15332
- **热度数据**: 评论 4
- **关注点**:
  - Hive 迁移到 Iceberg 时，`__HIVE_DEFAULT_PARTITION__` 等空分区标识如何正确映射。
- **技术诉求分析**:
  - 这类问题直接关系到 **历史数仓表迁移正确性**。
  - 企业用户常见场景是将既有 Hive 分区表批量迁移至 Iceberg，若 null 分区处理不一致，会造成查询结果偏差、分区裁剪异常，甚至元数据不一致。
- **研判**:
  - 这是典型的“迁移 correctness”问题，优先级应高于普通体验问题。

### 4.2 多列统计信息禁用配置异常
- **Issue**: #15347 `[OPEN] [bug, good first issue] Disabling statistics across multiple columns`
- **链接**: apache/iceberg Issue #15347
- **热度数据**: 评论 3
- **关注点**:
  - `write.parquet.stats-enabled.column.<COLUMN_NAME>` 仅对单列生效，多列配置疑似失效。
- **技术诉求分析**:
  - 用户希望更细粒度控制 Parquet 列统计，通常用于：
    - 避免高基数/超长字段导致 footer 膨胀
    - 降低写入成本
    - 规避某些引擎对统计信息的错误依赖
- **研判**:
  - 这是一个非常典型的**生产调优型问题**，且被标记为 `good first issue`，说明维护者认为修复路径明确，可能较快被社区贡献者接手。

### 4.3 属性前缀解析的 regex 语义 bug 与修复联动
- **Issue**: #15631 `[OPEN] PropertyUtil.propertiesWithPrefix treats prefix as regex pattern`
- **链接**: apache/iceberg Issue #15631
- **PR**: #15558 `[OPEN] [spark, parquet, core] Core: fix propertiesWithPrefix to strip prefix literally, not as regex`
- **链接**: apache/iceberg PR #15558
- **关注点**:
  - `PropertyUtil.propertiesWithPrefix` 使用 `replaceFirst(prefix, "")`，把 prefix 当成 Java regex 处理，导致包含特殊字符时行为错误。
- **技术诉求分析**:
  - 这属于 **底层工具类 correctness bug**，影响面可能超出单一模块。
  - 一旦属性 key 中使用 `.`、`*` 等 regex 特殊字符，配置解析可能静默出错，尤其容易引发“配置看起来写对了、系统却不按预期执行”的隐性问题。
- **研判**:
  - 因已有明确修复 PR，对下一个小版本纳入的概率较高。

### 4.4 Spark 4.1 UUID Writer 性能优化
- **PR**: #15302 `[OPEN] [spark, stale] Spark 4.1: Optimize UUID writer with fast-path byte parsing`
- **链接**: apache/iceberg PR #15302
- **关注点**:
  - 针对 canonical UUID 格式走字节级 fast-path，避免 UTF-8 解码和字符串解析开销。
- **技术诉求分析**:
  - 说明社区开始提前适配 **Spark 4.1**，并关注高频类型写入性能。
  - 对日志、CDC、事件表中大量 UUID 主键场景尤为有价值。
- **研判**:
  - 如果推进成功，将属于典型的“无语义变化、但显著优化 CPU 路径”的增量改进。

---

## 5. Bug 与稳定性

以下按严重程度与潜在影响排序：

### P1：Hive 迁移空分区处理可能导致数据语义错误
- **Issue**: #15332
- **链接**: apache/iceberg Issue #15332
- **问题**:
  - Hive 表迁移到 Iceberg 时，null 分区值处理存在异常。
- **影响**:
  - 可能导致迁移后表的分区语义错误，影响查询正确性与数据完整性。
- **是否已有修复 PR**:
  - **暂无明确关联 PR**

### P1：`rewrite_position_delete_files` 在 array/map 列存在时失败
- **PR**: #15632 `[OPEN]`
- **链接**: apache/iceberg PR #15632
- **相关旧 PR**: #15079 `[OPEN]`
- **链接**: apache/iceberg PR #15079
- **问题**:
  - 当表 schema 中包含 array/map 列时，`rewrite_position_delete_files` 可能触发 `ValidationException: Invalid partition field parent`。
- **影响**:
  - 直接影响 delete file 重写维护任务，属于核心运维路径上的 correctness / reliability 问题。
- **修复状态**:
  - **已有修复 PR，且出现替代实现**（#15632 替代 #15079）
- **判断**:
  - 该问题进入修复阶段，值得重点跟踪合并进度。

### P2：Flink RANGE 分布模式作业卡在 INITIALIZING
- **Issue**: #14079 `[OPEN] [bug, stale]`
- **链接**: apache/iceberg Issue #14079
- **问题**:
  - Flink 任务经过多次 savepoint 停止和恢复后，RANGE 分布模式下卡在初始化阶段。
- **影响**:
  - 对高并发、长生命周期流作业有明显生产影响。
- **是否已有修复 PR**:
  - **暂无明确关联 PR**
- **判断**:
  - 尽管是旧问题，但今天仍有更新，说明用户仍受其影响，建议维护者重新评估优先级。

### P2：多列禁用 Parquet 统计信息配置失效
- **Issue**: #15347
- **链接**: apache/iceberg Issue #15347
- **问题**:
  - 多列场景下统计信息禁用配置未按预期生效。
- **影响**:
  - 影响写入优化与存储元数据控制，不一定造成结果错误，但会影响成本和性能调优。
- **是否已有修复 PR**:
  - **暂无明确关联 PR**

### P3：`PropertyUtil.propertiesWithPrefix` 将 prefix 当 regex
- **Issue**: #15631
- **链接**: apache/iceberg Issue #15631
- **修复 PR**: #15558
- **链接**: apache/iceberg PR #15558
- **问题**:
  - 配置前缀剥离逻辑存在 regex 误用。
- **影响**:
  - 可能造成静默配置错误，波及 Core / Spark / Parquet 等多个使用属性前缀的模块。
- **修复状态**:
  - **已有开放 PR，修复路径清晰**

### P3：并发流写入下 `rewrite_data_files` 历史验证异常
- **Issue**: #13972 `[CLOSED] [question, stale]`
- **链接**: apache/iceberg Issue #13972
- **问题**:
  - 并发 streaming writes 期间执行 `rewrite_data_files`，遇到 `ValidationException: Cannot determine history`
- **影响**:
  - 暗示 compaction 与流写入并发仍是用户高频痛点。
- **当前状态**:
  - 今日已关闭，但更偏向问题讨论结案，而非一定已有代码修复。
- **判断**:
  - 从路线图角度仍值得关注事务冲突管理和维护操作可预期性。

---

## 6. 功能请求与路线图信号

### 6.1 Flink 纳秒级时间精度支持，接近落地
- **PR**: #15475 `[OPEN] [flink, INFRA, build] Flink: Add Nanosecond Precision Support for Flink-Iceberg Integration`
- **链接**: apache/iceberg PR #15475
- **信号**:
  - 面向 Iceberg V3 表，补齐 Flink 对 `TIMESTAMP(9)` / `TIMESTAMP_LTZ(9)` 的精度支持。
- **意义**:
  - 这属于明显的引擎能力增强，尤其适合金融、IoT、CDC 精细时序场景。
- **纳入下一版本概率**:
  - **中高**，因为问题陈述明确、收益清晰。

### 6.2 Flink Sink 后提交维护任务可扩展
- **PR**: #15566 `[OPEN] [flink, docs] Flink: Allow arbitrary post-commit maintenance tasks via IcebergSink Builder`
- **链接**: apache/iceberg PR #15566
- **信号**:
  - 不再把 `RewriteDataFiles` 作为唯一 post-commit 维护动作，支持通过 builder 组合 `ExpireSnapshots`、`DeleteOrphanFiles` 等。
- **意义**:
  - 这反映出社区希望把 Iceberg 的维护能力更自然地嵌入流式写入链路。
- **纳入下一版本概率**:
  - **高**，因为设计方向与生产可运维性高度一致。

### 6.3 Kafka Connect 自动建表与标识字段能力完善
- **PR**: #15615 `[OPEN] [KAFKACONNECT] [kafka]:kafka-connect:auto-create not setting identifier-field-ids`
- **链接**: apache/iceberg PR #15615
- **信号**:
  - Kafka Connect 自动建表时，标识字段 IDs 未正确设置。
- **意义**:
  - 对 CDC / upsert / 主键语义尤为关键，是连接器可用性的核心补洞。
- **纳入下一版本概率**:
  - **中高**

### 6.4 Kafka Connect 对 Debezium `ZonedTimestamp` 映射支持
- **PR**: #15027 `[OPEN] [KAFKACONNECT] Kafka-connect IcebergSink RecordConverter support ZonedDateTime to TimestampType`
- **链接**: apache/iceberg PR #15027
- **信号**:
  - 直接面向 Debezium / Avro 数据流场景，解决 `ZonedDateTime` 误转 string 的问题。
- **意义**:
  - 体现 Iceberg 社区正在补齐 CDC 生态中的真实数据类型兼容问题。
- **纳入下一版本概率**:
  - **中**

### 6.5 Geospatial 能力持续推进
- **PR**: #14101 `[OPEN] [API, core] API, Core: Add geospatial predicates and bounding box literals`
- **链接**: apache/iceberg PR #14101
- **信号**:
  - 在基础 bounding box 类型之后，继续推进 `ST_INTERSECTS` / `ST_DISJOINT` 等空间谓词。
- **意义**:
  - 表明 Iceberg 正逐步探索更丰富的分析型数据类型与谓词能力。
- **纳入下一版本概率**:
  - **中低到中**，方向明确，但跨度较大、审查周期可能较长。

### 6.6 REST Catalog functions 只读接口扩展
- **PR**: #15180 `[OPEN] [OPENAPI] REST spec: add list/load function endpoints to OpenAPI spec`
- **链接**: apache/iceberg PR #15180
- **信号**:
  - 增加函数的 list/load endpoint 定义。
- **意义**:
  - 有助于提升 REST Catalog 生态兼容度，特别是与 SQL 引擎函数元数据管理的对接。
- **纳入下一版本概率**:
  - **中**

---

## 7. 用户反馈摘要

### 7.1 老 Hive 数仓迁移仍是重要现实场景
- **来源**: #15332
- **链接**: apache/iceberg Issue #15332
- **反馈提炼**:
  - 用户正在将大规模 Hive 分区表迁移到 Iceberg，迁移工具链不仅要“能跑”，更要保证 null 分区等边界值语义完全一致。
- **说明**:
  - 这说明 Iceberg 在替代传统 Hive 表存储层方面仍有很强现实需求。

### 7.2 用户需要更精细的写入元数据成本控制
- **来源**: #15347
- **链接**: apache/iceberg Issue #15347
- **反馈提炼**:
  - 统计信息并非越多越好；在部分列上关闭 stats 是真实生产需求，而且经常是“多列一起控制”。
- **说明**:
  - 用户已从“能用 Iceberg”进入“精细调优 Iceberg”的阶段。

### 7.3 流式作业稳定恢复仍是 Flink 用户核心痛点
- **来源**: #14079
- **链接**: apache/iceberg Issue #14079
- **反馈提炼**:
  - 作业在 savepoint 恢复、多轮运行后的状态一致性和初始化行为，是 Flink 用户最关心的问题之一。
- **说明**:
  - Iceberg 在长跑型流处理场景中的稳定性体验仍需增强。

### 7.4 用户对隐藏配置 bug 的容忍度很低
- **来源**: #15631 / #15558
- **链接**: apache/iceberg Issue #15631  
- **链接**: apache/iceberg PR #15558
- **反馈提炼**:
  - 一类看似微小的工具方法 bug，会在配置驱动框架中放大，造成非常难排查的问题。
- **说明**:
  - 社区对配置 API 的“直觉一致性”和“无静默失败”提出了更高要求。

### 7.5 Kafka Connect 用户正在推动更完整 CDC / upsert 支持
- **来源**: #14797、#15615、#15027
- **链接**: apache/iceberg PR #14797  
- **链接**: apache/iceberg PR #15615  
- **链接**: apache/iceberg PR #15027
- **反馈提炼**:
  - 用户希望连接器原生支持去重、DV 模式、主键标识字段、时区时间类型等 CDC 必备能力。
- **说明**:
  - Iceberg 正逐渐从“离线表格式”向“统一批流表平台”演进。

---

## 8. 待处理积压

以下是今日值得提醒维护者关注的长期或停滞项：

### 8.1 Flink RANGE 模式初始化卡死问题仍未见修复
- **Issue**: #14079 `[OPEN] [bug, stale]`
- **链接**: apache/iceberg Issue #14079
- **原因**:
  - 影响流作业恢复可靠性，且问题已持续较久。
- **建议**:
  - 应尽快确认是否能复现、是否与特定 Flink 版本/并行度/状态恢复路径有关。

### 8.2 Spark 4.1 UUID 写入优化 PR 处于 stale 状态
- **PR**: #15302 `[OPEN] [spark, stale]`
- **链接**: apache/iceberg PR #15302
- **原因**:
  - 这类性能优化对新版本 Spark 适配有价值，但若长期停滞，可能错过新引擎窗口期。
- **建议**:
  - 建议维护者明确性能收益、兼容性风险与评审结论。

### 8.3 REST refs-only metadata 优化方向被关闭，需确认后续方案
- **PR**: #14166 `[CLOSED]`
- **链接**: apache/iceberg PR #14166
- **原因**:
  - 元数据 refresh 成本对大型 catalog 非常关键。
- **建议**:
  - 若原实现不合适，建议以 design issue 或更小 PR 重启讨论。

### 8.4 Geospatial 能力推进节奏较慢
- **PR**: #14101 `[OPEN]`
- **链接**: apache/iceberg PR #14101
- **相关已关闭基础 PR**: #12667
- **链接**: apache/iceberg PR #12667
- **原因**:
  - 空间类型与谓词是潜在高价值方向，但审查周期长。
- **建议**:
  - 可以考虑拆分成更小的 spec / API / engine-support PR，降低合并阻力。

### 8.5 Kafka Connect DV/CDC 增强 PR 体量较大
- **PR**: #14797 `[OPEN]`
- **链接**: apache/iceberg PR #14797
- **原因**:
  - 涉及 Delta Writer、CDC、upsert、DV，功能面广、评审复杂。
- **建议**:
  - 如果长期不收敛，建议拆分成更小的能力增量，优先落地关键链路。

---

## 总结

今天的 Apache Iceberg 延续了**高活跃、强工程化修正**的节奏。  
从信号上看，项目当前最明确的几个方向是：

- **Spark / Flink 的执行正确性与性能优化**
- **Kafka Connect 的 CDC / 自动建表 / 类型兼容能力补齐**
- **REST Catalog 与 OpenAPI 生态增强**
- **Core 工具类与维护任务路径的稳定性修复**

与此同时，也能看到一些需要重点关注的风险点：  
**Hive 迁移 correctness、Flink 恢复稳定性、维护操作在复杂 schema/并发写入下的鲁棒性**，这些都直接关系到 Iceberg 在生产中的可信度。

如果你愿意，我还可以继续把这份日报转换成：
1. **适合微信群/飞书播报的简版**  
2. **面向技术管理层的周报口径**  
3. **按 Spark / Flink / Kafka Connect / REST 四条线拆分的专题视图**

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下为 **Delta Lake** 在 **2026-03-15** 的项目动态日报。

---

# Delta Lake 项目日报 · 2026-03-15

## 1. 今日速览

过去 24 小时内，Delta Lake 社区活跃度 **中等偏低但较聚焦**：共有 **2 条 Issue 更新**、**3 条 PR 更新**，**无新版本发布**，也**无 PR 合并/Issue 关闭**。  
从内容看，今日焦点集中在 **Java Kernel 数据跳过（data skipping）中的大小写敏感匹配缺陷**，该问题已经形成 **Issue + 对应修复 PR** 的闭环，说明社区对查询正确性与协议一致性仍保持较快响应。  
此外，已有两条与 **Catalog / CI / stagingCatalog 扩展** 相关的 PR 持续推进，显示项目仍在为更复杂的 Spark Catalog 场景和测试基座做准备。  
整体来看，项目健康度 **稳定**，但今日没有实质性合并落地，短期更偏向 **问题澄清、补丁准备与基础设施演进**。

---

## 2. 项目进展

> 今日没有已合并/已关闭的重要 PR 或 Issue。

不过，以下在途 PR 值得持续关注，它们代表了当前开发重点：

### 2.1 修复 Java Kernel data skipping 的大小写匹配问题
- **PR**: [#6284 fix: Java Kernel data skipping uses case-sensitive column matching](https://github.com/delta-io/delta/pull/6284)
- **关联 Issue**: [#6247 fix: Java Kernel data skipping uses case-sensitive column matching](https://github.com/delta-io/delta/issues/6247)

**进展解读：**
该 PR 直接响应新近暴露的问题：Java Kernel 在进行 data skipping 谓词解析时，对列名匹配采用了 **大小写敏感** 逻辑，这与 Delta 协议和 Delta Spark 的行为不一致。  
如果修复被合入，将提升：
- **查询裁剪正确性**
- **跨实现一致性**（Kernel vs Spark）
- **大小写混合 schema 环境下的可预期行为**

这类问题虽然未必导致崩溃，但会影响 **过滤下推 / 文件跳过命中率**，进而造成 **错误的扫描范围** 或潜在结果不一致，是典型的分析型存储引擎正确性问题。

---

### 2.2 临时 UC-main 测试基座进入 CI
- **PR**: [#6233 [Delta][CI] Add temporary UC-main test setup](https://github.com/delta-io/delta/pull/6233)

**进展解读：**
该 PR 聚焦于 **CI 测试环境增强**，引入临时的 UC-main 测试配置。  
从工程信号看，这通常意味着：
- 项目正在验证 **更复杂的统一 Catalog / 元数据管理集成场景**
- 为后续功能 PR 提供稳定回归环境
- 降低 catalog 相关改动的集成风险

虽然这不是直接面向用户的特性，但对 **存储引擎稳定性、跨环境兼容性、发布质量** 都是正向投入。

---

### 2.3 扩展 stagingCatalog 以支持非 Spark session catalog
- **PR**: [#6166 [Delta-Spark] Extend stagingCatalog for non-Spark session catalog](https://github.com/delta-io/delta/pull/6166)

**进展解读：**
这是一个持续推进中的 Delta-Spark 方向改动，目标是让 `stagingCatalog` 能覆盖 **非 Spark session catalog** 场景。  
这类改动通常关联：
- 更灵活的 **Catalog 适配**
- 更复杂的建表/替换表流程（如 staged table creation / atomic RTAS 类路径）
- Delta 与不同 Spark catalog 实现之间的兼容性增强

从 OLAP 系统视角，这属于 **SQL DDL 执行链路与元数据层兼容性** 的重要基础工作，若后续合并，可能改善多 catalog 部署下的可用性。

---

## 3. 社区热点

### 3.1 最值得关注：Java Kernel data skipping 大小写敏感 Bug
- **Issue**: [#6247](https://github.com/delta-io/delta/issues/6247)
- **PR**: [#6284](https://github.com/delta-io/delta/pull/6284)

**热度表现：**
- Issue 在过去 24 小时内更新
- 当前评论数：**2**
- 已有对应修复 PR，当天创建并更新

**背后的技术诉求：**
用户关注的是 **Delta 协议语义一致性**。协议要求列名在语义上应大小写不敏感，而 Java Kernel 的 data skipping 路径若使用大小写敏感匹配，会导致：
- 谓词列解析失败或偏差
- 文件级统计跳过逻辑不符合预期
- Spark 与 Kernel 行为不一致，影响嵌入式/多引擎使用者

这反映出社区对 Delta 不仅要求“能跑”，更要求 **协议级一致、跨引擎一致、查询优化路径一致**。

---

### 3.2 治理透明度话题：TSC 成员名单在哪里
- **Issue**: [#6219 Where is the current Delta Lake TSC membership listed?](https://github.com/delta-io/delta/issues/6219)

**热度表现：**
- 过去 24 小时内更新
- 评论数：**0**
- 不是技术 bug，但属于项目治理层面的社区关注点

**背后的技术诉求：**
这类问题虽非代码缺陷，但对于开源项目健康度非常关键。  
用户团队希望明确：
- 当前 **TSC（Technical Steering Committee）成员**是谁
- 技术决策机制是否透明
- 谁在主导路线图、兼容性方向与版本治理

对企业用户而言，治理透明度会直接影响其对项目的 **采用信心、长期投入意愿与风险评估**。

---

### 3.3 持续推进的 Catalog 兼容性改造
- **PR**: [#6166](https://github.com/delta-io/delta/pull/6166)
- **PR**: [#6233](https://github.com/delta-io/delta/pull/6233)

**技术诉求分析：**
这组 stacked PR 体现出 Delta-Spark 团队正在围绕 **Catalog 抽象、staging 流程和 CI 验证链路** 打基础。  
对分析型数据库/湖仓用户来说，这通常关系到：
- 跨 catalog 的建表与替换表行为一致性
- 统一元数据环境下的 DDL 可用性
- 更复杂企业部署中的可靠回归测试

---

## 4. Bug 与稳定性

以下按严重程度排序。

### 4.1 高优先级：Java Kernel data skipping 列名大小写匹配错误
- **Issue**: [#6247](https://github.com/delta-io/delta/issues/6247)
- **Fix PR**: [#6284](https://github.com/delta-io/delta/pull/6284)
- **标签**: `bug`, `good first issue`

**问题描述：**
Java Kernel 在 data skipping 路径中使用 **大小写敏感列匹配**，与 Delta 协议“列名大小写不敏感”的约束不一致。

**潜在影响：**
- **查询正确性风险**：谓词字段解析可能偏差
- **性能风险**：文件跳过失效，导致扫描扩大
- **跨引擎一致性风险**：Spark 与 Java Kernel 结果/执行计划表现可能不一致

**当前状态：**
- 已有修复 PR 提交，说明问题可复现且已有明确修复方向
- 建议维护者优先审阅，因为该问题涉及 **协议遵循与优化器行为一致性**

---

### 4.2 中低优先级：治理信息可见性不足
- **Issue**: [#6219](https://github.com/delta-io/delta/issues/6219)

**问题性质：**
非运行时稳定性问题，但属于 **项目运营与社区信任** 风险。

**潜在影响：**
- 企业用户难以识别技术决策主体
- 不利于社区理解 roadmap 和变更裁决流程
- 降低贡献者参与感与治理透明度

**当前状态：**
- 尚未见公开回复
- 建议维护者在官网、README、治理文档或 charter 补充 TSC 成员清单入口

---

## 5. 功能请求与路线图信号

今天没有典型的新功能需求（如新增 SQL 函数、连接器、存储格式扩展）被明确提出，但从现有 Issue/PR 可提炼出以下路线图信号：

### 5.1 Java Kernel 一致性修复可能进入近期版本
- **Issue**: [#6247](https://github.com/delta-io/delta/issues/6247)
- **PR**: [#6284](https://github.com/delta-io/delta/pull/6284)

**判断：**
由于问题已有配套修复 PR，且属于协议一致性 bug，**被纳入下一次补丁版本的概率较高**。  
这类修复通常优先级高于新特性，因为它直接影响查询行为。

---

### 5.2 Catalog 兼容性与 staging 流程增强是中期方向
- **PR**: [#6166](https://github.com/delta-io/delta/pull/6166)
- **PR**: [#6233](https://github.com/delta-io/delta/pull/6233)

**判断：**
两条 PR 共同指向一个清晰信号：Delta-Spark 正在增强对 **非标准/非默认 Spark session catalog 场景** 的支持能力，并补足相应 CI 验证。  
这说明下一阶段 Delta Lake 可能继续强化：
- 多 catalog 环境下的 DDL/事务兼容
- 与更复杂元数据体系的集成
- 面向企业级部署的回归测试覆盖

这类能力未必立即对外作为“新功能”宣传，但很可能成为后续版本中的重要兼容性增强项。

---

### 5.3 治理公开化需求值得纳入路线图配套工作
- **Issue**: [#6219](https://github.com/delta-io/delta/issues/6219)

**判断：**
虽然不是产品功能，但对开源项目成熟度至关重要。  
建议在下一轮文档或官网更新中补齐：
- TSC 成员名单
- 任期与选举规则
- 会议纪要或决策记录入口

这有助于提升外部生态对 Delta Lake 的长期信任。

---

## 6. 用户反馈摘要

### 6.1 用户关注协议定义与实现一致性
- 相关链接：[Issue #6247](https://github.com/delta-io/delta/issues/6247)

从该问题可看出，用户并非只关注功能存在与否，而是会对照 **Delta 协议规范** 检查不同实现是否一致。  
这类用户往往处于：
- 自研引擎集成 Delta
- 使用 Java Kernel 做嵌入式读取/过滤
- 对查询裁剪准确性较敏感的生产环境

真实痛点在于：**同一张表在不同 Delta 实现上的行为不应出现语义分歧**。

---

### 6.2 企业用户关注项目治理透明度
- 相关链接：[Issue #6219](https://github.com/delta-io/delta/issues/6219)

用户团队尝试查找 TSC 成员名单但未找到明确信息，说明 Delta Lake 在企业采用过程中，已不只是技术选型问题，也涉及：
- 组织治理是否清晰
- 路线图由谁推动
- 重大变更由谁裁决

这类反馈表明，Delta Lake 正被放在更正式、长期的基础设施评估框架中审视。

---

## 7. 待处理积压

### 7.1 PR #6166 持续开放，属于值得维护者重点关注的兼容性改造
- **链接**: [#6166 [Delta-Spark] Extend stagingCatalog for non-Spark session catalog](https://github.com/delta-io/delta/pull/6166)
- **创建时间**: 2026-03-02

该 PR 已持续近两周，且内容涉及 **Catalog 兼容性扩展**，通常这类改动影响面较大、评审成本较高。  
建议维护者：
- 明确拆分后续合并路径
- 给出对外的评审反馈
- 结合 #6233 的 CI 支撑加速验证

否则容易形成“基础设施型 PR 长期堆积”的情况，影响贡献者推进节奏。

---

### 7.2 PR #6233 作为 stacked PR 的中间层，需避免阻塞链式提交
- **链接**: [#6233 [Delta][CI] Add temporary UC-main test setup](https://github.com/delta-io/delta/pull/6233)
- **创建时间**: 2026-03-10

这是典型的 stacked PR，如果中间 PR 长时间不处理，可能拖慢整条功能链。  
建议维护者尽快判断：
- 是否可先行合并 CI 基座
- 是否需要进一步拆小
- 是否为后续 Catalog 改动提供强依赖

---

### 7.3 Issue #6219 建议尽快响应，避免治理问题长期悬而未决
- **链接**: [#6219 Where is the current Delta Lake TSC membership listed?](https://github.com/delta-io/delta/issues/6219)
- **创建时间**: 2026-03-09

虽然不是代码问题，但它属于 **低成本、高价值** 的维护动作。  
如果长期无人回复，会释放出治理信息不透明的负面信号，建议维护者尽快补充说明并给出官方入口。

---

## 8. 综合判断

Delta Lake 今日没有发布或合并层面的“硬进展”，但从活跃条目看，项目仍围绕两条主线推进：

1. **查询正确性与协议一致性修复**  
   - 代表项：[Issue #6247](https://github.com/delta-io/delta/issues/6247), [PR #6284](https://github.com/delta-io/delta/pull/6284)

2. **Catalog/CI 基础设施增强**  
   - 代表项：[PR #6166](https://github.com/delta-io/delta/pull/6166), [PR #6233](https://github.com/delta-io/delta/pull/6233)

对 OLAP 与分析型存储引擎观察者而言，这说明 Delta Lake 当前重点仍在 **实现一致性、元数据层兼容性和工程稳定性**，而非短期堆叠大量新功能。项目整体健康度稳定，但建议维护者提升 **PR 处理效率** 和 **治理信息透明度**，以进一步增强社区信号。

如果你需要，我也可以把这份日报继续整理成：
1. **适合飞书/Slack 发布的精简版**，或  
2. **面向管理层的周报口径版**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-15）

## 1. 今日速览

过去 24 小时内，Databend 没有新的 Issue，也没有版本发布，整体节奏以 **Pull Request 推进为主**。  
PR 维度共有 7 条更新，其中 **5 条仍待合并，2 条已关闭**，说明项目当前重点集中在查询引擎重构、SQL Planner 修复与测试基础设施整理。  
从内容看，今天的改动更偏向 **内核演进与稳定性增强**，尤其涉及递归 CTE、相关子查询去关联、`IN` 列表谓词展开等查询执行与正确性问题。  
活跃度评估为 **中等偏稳**：虽然没有大量社区反馈或版本动作，但核心开发者持续在推进较深层的引擎能力建设。

---

## 3. 项目进展

### 已关闭 / 已完成的重要 PR

#### 1) 修复 correlated scalar subquery + LIMIT 的 Planner 正确性问题
- **PR**: [#19532](https://github.com/databendlabs/databend/pull/19532)
- **状态**: CLOSED
- **作者**: @sundy-li
- **类型**: bugfix

**核心内容**
- 修复带 `LIMIT` 的相关标量子查询，以及 `ORDER BY ... LIMIT` 场景的去关联处理。
- 实现方式是将其改写为基于分区的 `row_number()` 过滤。
- 同时拒绝不受支持的标量子查询聚合场景，避免错误执行。

**影响分析**
- 这是一个典型的 **SQL 正确性与 Planner 能力补洞**。
- 对复杂分析 SQL、BI 工具自动生成 SQL、以及存在嵌套子查询的业务查询尤其重要。
- 表明 Databend 在 **相关子查询 decorrelation** 路线上继续补齐边界条件，这对提升 PostgreSQL / 通用 ANSI SQL 兼容性有直接帮助。

---

#### 2) 提升列引用与重写的一致性，增强 Planner 内部语义稳定性
- **PR**: [#19523](https://github.com/databendlabs/databend/pull/19523)
- **状态**: CLOSED
- **作者**: @forsaken628
- **类型**: refactor

**核心内容**
- 改进绑定、语义分析和优化阶段中列引用的表示与传播一致性。
- 让 Planner 重写更依赖稳定的列标识，而非脆弱的表示方式。

**影响分析**
- 这类改动虽然不直接暴露为用户功能，但属于 **优化器与 Planner 基础设施加固**。
- 对后续复杂重写规则、谓词下推、子查询改写、投影裁剪等都属于“地基工程”。
- 从最近多条 SQL/Planner 相关 PR 来看，Databend 正在持续清理优化器内部表示，释放后续功能扩展空间。

---

### 今日仍在推进的重点 PR

#### 3) 支持 FUSE 表快照的实验性 table tags
- **PR**: [#19549](https://github.com/databendlabs/databend/pull/19549)
- **状态**: OPEN
- **作者**: @zhyass
- **类型**: feature

**核心内容**
- 为 FUSE table snapshots 引入新的实验性 table tags。
- 采用 **KV-backed table tag model**，而不是复用旧的 legacy table-ref branch/tag 实现。

**意义**
- 这是今天最有产品信号的功能性 PR。
- 它表明 Databend 在表快照管理、数据版本引用、以及类“标签化时间点访问”能力上继续演进。
- 对数据回溯、审计、实验分支、快照命名等场景会有吸引力，也可能成为后续更完整数据版本管理能力的前置步骤。

---

#### 4) 递归 CTE 执行改为更流式化
- **PR**: [#19545](https://github.com/databendlabs/databend/pull/19545)
- **状态**: OPEN
- **作者**: @KKould
- **类型**: refactor

**核心内容**
- 让 Recursive CTE 的执行更加 streaming-oriented。
- PR 描述提到其目标之一，是解决 Databend 无法执行某些复杂递归查询（包括 Sudoku 查询案例）的问题。
- 关联 Issue: `#18237`（PR 摘要中提及）。

**意义**
- 这是典型的 **递归查询执行模型优化**。
- 如果合并，将提升 Databend 对复杂递归 SQL 的承载能力，并降低某些场景下的物化压力。
- 对图遍历、层级数据分析、递归生成式查询等工作负载都有潜在价值。

---

#### 5) SQL 优化器 replay 支持共享化，并新增轻量 harness
- **PR**: [#19542](https://github.com/databendlabs/databend/pull/19542)
- **状态**: OPEN
- **作者**: @forsaken628
- **类型**: refactor

**核心内容**
- 将共享 optimizer replay 数据和辅助工具迁移到 `src/query/sql/test-support`。
- 抽取 `parse_raw_expr`，让 SQL 与函数测试复用同一解析能力。
- 新增更轻量的测试 harness。

**意义**
- 这是典型的 **测试基础设施升级**。
- 有助于提升优化器回归测试的复用度和构造效率，降低后续 SQL 语义修复引入回归的风险。
- 结合 #19523，可以看出团队在系统化增强 SQL/Planner 可测试性。

---

#### 6) 修复大 IN-list 展开导致栈溢出的风险
- **PR**: [#19546](https://github.com/databendlabs/databend/pull/19546)
- **状态**: OPEN
- **作者**: @SkyFan2002
- **类型**: bugfix

**核心内容**
- 在高 `max_inlist_to_or` 设置下，避免大 `IN` 列表展开成深度左倾 `OR` 树导致栈溢出。
- 同时保留 SQL `IN` / `NOT IN` 的 `NULL` 语义。

**意义**
- 这是非常实用的稳定性修复。
- 涉及 SQL 重写策略、执行安全性与语义正确性三者平衡。
- 对使用大批量字面量过滤、程序自动拼接 `IN (...)` 的场景尤其重要。

---

#### 7) 升级 databend-meta 并整合依赖
- **PR**: [#19513](https://github.com/databendlabs/databend/pull/19513)
- **状态**: OPEN
- **作者**: @drmingdrmer
- **类型**: chore

**核心内容**
- 升级 `databend-meta` 到 `v260304.0.0`。
- 整合依赖，引入 `databend_meta_client::kvapi` 等方式替代独立 crate。

**意义**
- 偏向元数据层与依赖治理。
- 对外部用户感知较弱，但对构建一致性、维护成本和后续 meta 能力演进是正向信号。

---

## 4. 社区热点

> 注：本次数据中未提供评论数、点赞数的有效值，且过去 24 小时无 Issue，因此以下“热点”主要依据 PR 技术影响范围与更新时效判断。

### 热点 1：实验性 table tags for FUSE snapshots
- **链接**: [#19549](https://github.com/databendlabs/databend/pull/19549)

**为什么值得关注**
- 这是今天最明确的新功能方向。
- 它反映出 Databend 正在探索更现代的数据版本引用模型，而不是继续依赖 legacy branch/tag 实现。

**背后的技术诉求**
- 用户需要更清晰的快照标记、版本定位、可复现分析与数据回溯能力。
- 这也是 OLAP 场景中数据治理、审计和实验分析的重要基础设施。

---

### 热点 2：递归 CTE 的流式执行改造
- **链接**: [#19545](https://github.com/databendlabs/databend/pull/19545)

**为什么值得关注**
- Recursive CTE 是 SQL 引擎能力成熟度的重要标志之一。
- PR 明确针对复杂递归案例的执行瓶颈和可执行性问题。

**背后的技术诉求**
- 用户希望 Databend 能稳定执行更复杂的标准 SQL 递归查询，而不仅限于简单层级展开。
- 这对应的是更广泛的 SQL 兼容性和更强的执行引擎表达能力。

---

### 热点 3：大 IN-list 的稳定性修复
- **链接**: [#19546](https://github.com/databendlabs/databend/pull/19546)

**为什么值得关注**
- 这类问题虽然不一定“显眼”，但非常贴近真实生产负载。
- 栈溢出一旦出现，通常表现为查询失败甚至节点异常，是优先级较高的稳定性议题。

**背后的技术诉求**
- 用户需要在大批量过滤条件下保持查询稳定执行，同时又不能破坏 `NULL` 语义。
- 说明 Databend 的优化器/重写器正在补齐极端 SQL 形态下的鲁棒性。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### 高优先级：相关标量子查询 + LIMIT / ORDER BY LIMIT 正确性问题
- **PR**: [#19532](https://github.com/databendlabs/databend/pull/19532)
- **状态**: 已关闭
- **是否已有 fix**: 是

**问题说明**
- 涉及相关标量子查询在带 `LIMIT` 或 `ORDER BY ... LIMIT` 时的 decorrelation 失败或错误处理。
- 这类问题会直接影响查询结果正确性。

**判断**
- 属于 **查询语义正确性级别** 问题，优先级高于一般性能问题。
- 已有修复是积极信号。

---

### 高优先级：大 IN-list 展开可能导致栈溢出
- **PR**: [#19546](https://github.com/databendlabs/databend/pull/19546)
- **状态**: 待合并
- **是否已有 fix**: 有修复 PR，尚未合并

**问题说明**
- 当 `max_inlist_to_or` 较高且 `IN` 列表很大时，可能形成深度左倾 `OR` 树，触发栈溢出。
- 同时需要保持 `IN` / `NOT IN` 与 `NULL` 的标准 SQL 语义。

**判断**
- 这是 **稳定性 + 正确性双重问题**。
- 若用户存在自动生成大列表过滤 SQL 的场景，应优先关注此 PR 合并进度。

---

### 中优先级：递归 CTE 执行能力不足
- **PR**: [#19545](https://github.com/databendlabs/databend/pull/19545)
- **状态**: 待合并
- **是否已有 fix**: 有改进 PR，尚未合并

**问题说明**
- 当前某些复杂递归查询无法顺利执行，PR 目标是让执行方式更流式化。
- 已知案例包括高复杂度递归问题。

**判断**
- 更偏向 **能力缺口 / 可执行性问题**。
- 对依赖标准递归 SQL 的用户属于重要兼容性增强。

---

## 6. 功能请求与路线图信号

### 1) 表快照标签化能力可能进入下一阶段功能集
- **PR**: [#19549](https://github.com/databendlabs/databend/pull/19549)

**信号解读**
- “experimental table tags” 明确表明这是正在孵化的用户可感知功能。
- 且实现上抛弃 legacy model，说明团队倾向于建设更长期可维护的新模型。

**纳入下一版本的可能性**
- **中高**。如果 PR 顺利合并，极可能先以实验特性或受限能力形式进入后续版本。

---

### 2) 递归 CTE 能力增强持续推进
- **PR**: [#19545](https://github.com/databendlabs/databend/pull/19545)

**信号解读**
- PR 直接关联已有问题，且解决的是执行模型级别问题，不是局部补丁。
- 说明团队正在提高 SQL 引擎对高级递归查询的支持上限。

**纳入下一版本的可能性**
- **中等**。若测试覆盖足够，可能成为“SQL 兼容性增强”中的一项重点。

---

### 3) SQL/Optimizer 测试平台建设正在加速
- **PR**: [#19542](https://github.com/databendlabs/databend/pull/19542)
- **PR**: [#19523](https://github.com/databendlabs/databend/pull/19523)

**信号解读**
- 虽然不是直接功能请求，但强烈表明团队接下来还会继续在 Planner、表达式解析、优化器回放与规则验证上集中投入。
- 这通常意味着更多 SQL 特性修复和优化器增强会在后续版本持续落地。

---

## 7. 用户反馈摘要

由于过去 24 小时内 **没有新的 Issue，也无可用的评论数据**，今天无法从真实用户讨论中提炼出新增痛点或满意度趋势。  
但从 PR 内容本身可以反推出当前用户/场景侧关注点主要集中在：

1. **复杂 SQL 的正确执行**
   - 例如相关子查询、递归 CTE、复杂 Planner 重写。
   - 对应 PR: [#19532](https://github.com/databendlabs/databend/pull/19532), [#19545](https://github.com/databendlabs/databend/pull/19545)

2. **极端查询形态下的稳定性**
   - 例如大 `IN` 列表展开导致栈溢出。
   - 对应 PR: [#19546](https://github.com/databendlabs/databend/pull/19546)

3. **数据版本与快照管理能力**
   - 用户可能期待更明确的表快照标签、版本引用和实验性数据管理能力。
   - 对应 PR: [#19549](https://github.com/databendlabs/databend/pull/19549)

总体上，今天呈现出的不是“社区反馈爆发”，而是 **开发团队主动消化复杂 SQL 与引擎基础设施债务** 的一天。

---

## 8. 待处理积压

### 1) databend-meta 升级与依赖整合仍待推进
- **PR**: [#19513](https://github.com/databendlabs/databend/pull/19513)

**关注原因**
- 创建时间较早（2026-03-06），仍未合并。
- 这类基础依赖升级通常影响面较大，容易成为后续功能合并的前置条件。
- 建议维护者关注其兼容性验证和冲突消解进度。

---

### 2) 递归 CTE 流式执行改造值得重点跟进
- **PR**: [#19545](https://github.com/databendlabs/databend/pull/19545)

**关注原因**
- 属于用户可感知的 SQL 能力增强。
- 如果长时间悬而未决，可能延缓递归查询相关问题的整体解决节奏。

---

### 3) FUSE snapshot table tags 是重要但潜在复杂的功能 PR
- **PR**: [#19549](https://github.com/databendlabs/databend/pull/19549)

**关注原因**
- 功能方向明确，但涉及新的 KV-backed model，说明设计层面的复杂度不低。
- 建议维护者重点审查：
  - 元数据一致性
  - 快照/tag 生命周期管理
  - 与现有 branch/tag 语义的边界
  - 实验特性开关和兼容策略

---

## 总结

Databend 今日没有版本发布，也没有新增 Issue，但从 PR 结构上看，项目正在围绕 **SQL 引擎正确性、执行模型优化、测试基础设施和表快照能力** 稳步推进。  
其中最值得关注的是：
- 已关闭的相关子查询 `LIMIT` 修复：[#19532](https://github.com/databendlabs/databend/pull/19532)
- 待合并的大 `IN` 列表稳定性修复：[#19546](https://github.com/databendlabs/databend/pull/19546)
- 面向未来的数据版本管理能力扩展：[#19549](https://github.com/databendlabs/databend/pull/19549)

项目健康度维持在 **稳定向上**：活跃度不算高峰，但核心演进方向清晰，且集中在影响中长期竞争力的内核层能力。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

以下是 **Velox 项目 2026-03-15 动态日报**。

---

# Velox 项目动态日报 · 2026-03-15

## 1. 今日速览

过去 24 小时内，Velox **无 Issue 更新、无新版本发布**，但 **PR 活跃度较高，共 27 条更新**，其中 **23 条仍在待合并**、**4 条已合并或关闭**，说明项目当天的协作重心主要集中在代码迭代、CI/构建优化和功能分支推进。  
从 PR 内容看，今日变化覆盖了 **SQL 函数补齐、远程/RPC 执行、Parquet/Iceberg 存储能力、GPU/cuDF 适配、网站与 CI 基础设施** 等多个方向，表明 Velox 仍保持较强的多线并行开发节奏。  
值得关注的是，已合并 PR 中既有 **dot_product UDF 恢复**，也有 **CI 测试拆分与 32 核 runner 优化**，显示团队同时在推进 **功能可用性** 和 **工程效率**。  
整体判断：**项目健康度良好，研发活跃；但当天缺少 Issue 侧用户反馈，外部问题信号有限，更多体现为内部迭代日。**

---

## 2. 项目进展

### 2.1 今日已合并 / 关闭的重要 PR

#### 1) 重新引入 `dot_product` UDF，补强向量计算能力
- **PR**: #16740  
- **状态**: Merged  
- **链接**: https://github.com/facebookincubator/velox/pull/16740

该 PR 重新加入 `dot_product` UDF，并修复了相关测试问题。当前实现重点覆盖 **整数数组类型**（int8/int16/int32/int64），浮点数组版本由其他路径单独注册。  
**意义**：
- 补充了 Velox 在向量/数组数值计算方面的函数能力；
- 对上层查询引擎中涉及 embedding、特征计算、向量相似度预处理等场景有实用价值；
- 体现 Velox 在 **分析函数面扩展** 上持续推进。  
**注意**：当前描述显示浮点支持并未在该 PR 内完全统一，说明函数能力仍可能处于分阶段补齐中。

---

#### 2) 优化 CI：测试拆分 + 32 核 runner，加速工程反馈周期
- **PR**: #16691  
- **状态**: Merged  
- **链接**: https://github.com/facebookincubator/velox/pull/16691

该 PR 通过升级 runner、调整并行度、拆分大型测试目标，优化 Linux/macOS CI 耗时。  
**意义**：
- 对大型 C++/引擎项目而言，CI 周期直接影响合并效率和回归发现速度；
- 测试拆分有助于更快定位失败用例，降低“单体测试目标”带来的排队和重跑成本；
- 对 Velox 当前多分支并行开发非常关键，属于明显的 **研发效率投资**。  
**影响面**：虽然不直接改变查询语义，但会显著提升后续功能交付速度和稳定性治理能力。

---

#### 3) 更新官网 VeloxCon Banner，社区运营持续推进
- **PR**: #16754  
- **状态**: Merged  
- **链接**: https://github.com/facebookincubator/velox/pull/16754

该 PR 更新了 velox-lib.io 的 VeloxCon 2026 Banner，并增加了社区展示内容。  
**意义**：
- 说明项目正在继续投入社区活动和生态传播；
- 对吸引外部贡献者、扩大部署反馈渠道有正向作用。  
后续紧接着出现了一个 lint 修复 PR（见 #16773），说明网站改动已进入快速修正阶段。

---

#### 4) Iceberg 统计信息采集功能落地
- **PR**: #16062  
- **状态**: Merged  
- **链接**: https://github.com/facebookincubator/velox/pull/16062

该 PR 实现了 **Iceberg Parquet 数据文件统计收集**，包括：
- `numRecords`
- `columnsSizes`
- `valueCounts`
- `nullValueCounts`
- `nanValueCounts`（占位）

**意义**：
- 对查询优化器和元数据层非常重要，可用于更好的 **文件裁剪、代价估计、统计推断**；
- 强化了 Velox 与现代湖仓格式生态（尤其 Iceberg）的契合度；
- 是典型的 **分析型存储与查询规划联动能力增强**。  
这类能力通常会对大表扫描、数据跳过和成本模型产生持续收益。

---

## 3. 社区热点

> 注：本次数据中 PR 的评论数均显示为 `undefined`，无法据此严格排序“讨论最热”。以下按**技术影响力与更新时效**筛选热点。

### 热点 1：远程函数执行链路继续完善
- **PR**: #16770  
- **链接**: https://github.com/facebookincubator/velox/pull/16770

该 PR 聚焦 remote function execution 的剩余事项，包括：
- 仅序列化活跃行；
- 增加 null/determinism 支持；
- 改善错误信息。

**技术诉求分析**：
这是典型的 **分布式/远程表达式执行可用性工程**。  
核心诉求并非“再加一个函数”，而是让远程执行在真实负载下具备：
- 更低网络与序列化开销；
- 更好的语义一致性（null、determinism）；
- 更可诊断的错误输出。  
如果落地，这将提升 Velox 作为执行内核在服务化 UDF/远程计算场景下的可生产化程度。

---

### 热点 2：RPC PlanNode 持续推进，释放异步 RPC 执行能力信号
- **PR**: #16727  
- **链接**: https://github.com/facebookincubator/velox/pull/16727

该 PR 在 `core/PlanNode.h` 中引入 **RPCNode**，用于异步 RPC 执行，并采用基于名称的函数引用。  
**技术诉求分析**：
- 表明 Velox 正在尝试把远程调用提升为 **执行计划一级公民**；
- 采用“函数名 + 结果类型”而不是直接保存函数实例，意味着更强的 **序列化/跨边界传递能力**；
- 与 #16770 一起看，说明远程执行、RPC 调用、执行计划建模可能是近期一条重要路线。  
这对未来接入外部函数服务、模型推理服务、远程 UDF 平台都具有较强想象空间。

---

### 热点 3：Parquet 类型扩宽支持，贴近 Spark 4.0 语义
- **PR**: #16611  
- **链接**: https://github.com/facebookincubator/velox/pull/16611

该 PR 为 Parquet reader 增加类型扩宽能力，覆盖：
- `INT -> DOUBLE/Decimal`
- `Decimal -> Decimal`

**技术诉求分析**：
- 指向真实的数据湖 schema evolution 场景；
- 明确对齐 **Spark 4.0 的 Parquet Type Widening**；
- 对混合引擎环境中的兼容性非常关键。  
这类 PR 通常来自实际用户场景驱动：表 schema 演进后仍希望旧文件可被平滑读取，而不是中断查询。

---

### 热点 4：GPU Decimal 支持进入分阶段实现
- **PR**: #16612  
- **链接**: https://github.com/facebookincubator/velox/pull/16612

该 PR 是 GPU Decimal 支持的第 1 部分，涉及：
- 保留 DECIMAL scale 的 `veloxToCudfDataType()`
- Arrow bridge 选项扩展
- expected-type-aware 的 `toVeloxColumn()` 变体

**技术诉求分析**：
- 目标是打通 CPU Velox 与 GPU/cuDF 间的 Decimal 语义；
- Decimal 是 OLAP 金融、计费、聚合场景中的高敏感类型；
- 该方向若成熟，将明显提升 Velox 在异构执行体系中的能力。  
这通常意味着未来会看到更多 **GPU 语义一致性、数据交换桥接、算子覆盖率** 相关工作。

---

### 热点 5：CI 工程化继续深入，fuzzer 工件传输优化
- **PR**: #16767  
- **链接**: https://github.com/facebookincubator/velox/pull/16767

该 PR 试图优化 `scheduled.yml` 中 14 个 fuzzer 二进制的 artifact 上传/下载流程。  
**技术诉求分析**：
- 问题本质是大型 debug 二进制导致 CI I/O 成本过高；
- 这反映 Velox 已有较成熟的 fuzzing 基础设施，但维护成本开始显现；
- 工程侧正在从“有 CI”迈向“CI 足够高效”。  
对 C++ 引擎项目而言，这是成熟度提升的重要信号。

---

## 4. Bug 与稳定性

### 高优先级

#### 1) 主动破坏测试以验证 GitHub CI 测试发现行为
- **PR**: #16771  
- **状态**: OPEN，且摘要明确标注 **DO NOT LAND**  
- **链接**: https://github.com/facebookincubator/velox/pull/16771

该 PR 故意将 `LimitTest::limitOverLocalExchange` 的期望行数从 20 改为 21，用于验证 `gtest_discover_tests()` 在 GitHub CI 中是否能正确报告单测失败。  
**风险评估**：
- 这不是生产 bug，而是一个 **CI 验证实验**；
- 如果误合并，将造成明确的测试失败和噪音；
- 当前已有“DO NOT LAND”标记，风险可控。  
**建议**：维护者应确保此类实验性 PR 与正式提交有明确隔离。

---

### 中优先级

#### 2) 网站文件 lint/pre-commit 回归修复
- **PR**: #16773  
- **链接**: https://github.com/facebookincubator/velox/pull/16773

该 PR 修复 #16754 引入的网站文件 pre-commit lint 问题，包括尾换行与尾随空白。  
**影响**：
- 不影响查询结果或引擎稳定性；
- 但会影响开发流程与提交检查，属于低层级流程回归。  
**fix 状态**：已有修复 PR，预计可快速处理。

---

#### 3) `StreamArena` 中冗余前置自增修复
- **PR**: #16717  
- **链接**: https://github.com/facebookincubator/velox/pull/16717

修复 `++currentOffset_ = 0` 这种先增后覆写为 0 的无效写法。  
**影响评估**：
- 从摘要看更像 **代码正确性/可读性修复**，未显示已造成用户可见故障；
- 但这类内存/arena 代码的小问题值得及时收敛，因为它们常处于高频路径。  
**fix 状态**：PR 已 ready-to-merge。

---

### 低优先级 / 持续观察

#### 4) 远程函数执行语义与错误处理仍在完善
- **PR**: #16770  
- **链接**: https://github.com/facebookincubator/velox/pull/16770

该 PR 本身不是 bug 报告，但其中包含：
- null 支持缺口；
- determinism 语义处理；
- 错误信息改进。  
这说明远程执行能力虽然在推进，但 **鲁棒性与语义完备性仍在收尾阶段**。  
对于计划近期采用 remote execution 的用户，应持续关注其合并和后续回归情况。

---

## 5. 功能请求与路线图信号

虽然今日没有新增 Issues，但从活跃 PR 可以读出较强的路线图信号。

### 1) 远程/RPC 执行可能成为下一阶段重点能力
相关 PR：
- #16770: https://github.com/facebookincubator/velox/pull/16770
- #16727: https://github.com/facebookincubator/velox/pull/16727

**判断**：
- 远程函数执行从“能跑”进入“语义完备 + 计划建模 + 性能优化”阶段；
- RPCNode 的引入说明并非单点补丁，而是架构级扩展；
- 很可能被纳入后续版本的重要能力演进，尤其适合服务化 UDF、异构执行、AI/模型推理外接场景。

---

### 2) SQL 兼容性补齐持续推进，Presto/Spark 生态对齐增强
相关 PR：
- #16253 `ceil(DECIMAL)`：https://github.com/facebookincubator/velox/pull/16253
- #16740 `dot_product`：https://github.com/facebookincubator/velox/pull/16740
- #16611 Parquet type widening：https://github.com/facebookincubator/velox/pull/16611
- #16769 cuDF timestamp unit config：https://github.com/facebookincubator/velox/pull/16769

**判断**：
- `ceil(DECIMAL)` 是典型的 SQL 函数补洞；
- Parquet widening 与 timestamp unit 配置则是 **跨引擎/跨格式兼容性** 工作；
- 这说明 Velox 近期仍在围绕 **Presto/Spark 双生态兼容** 持续打磨。  
其中 #16253 已标记 `ready-to-merge`，进入下一版本的概率较高。

---

### 3) GPU/cuDF 集成正在从基础类型走向高精度类型
相关 PR：
- #16612 GPU Decimal Part 1: https://github.com/facebookincubator/velox/pull/16612
- #16769 timestamp unit config: https://github.com/facebookincubator/velox/pull/16769

**判断**：
- Decimal 和 timestamp 都是最容易暴露语义差异的数据类型；
- 当前工作说明 Velox GPU 路线已不满足于简单数值型，而在追求 **生产语义一致性**；
- 若后续 Part 2/3 继续推进，GPU 加速能力会更接近可直接承接复杂 SQL 工作负载。

---

### 4) 湖仓格式与元数据优化仍是稳定主线
相关 PR：
- #16062 Iceberg stats: https://github.com/facebookincubator/velox/pull/16062
- #16611 Parquet widening: https://github.com/facebookincubator/velox/pull/16611
- #16768 native preload support: https://github.com/facebookincubator/velox/pull/16768

**判断**：
- Iceberg 统计、Parquet schema evolution、DWRF 小文件 preload 优化，共同指向一个方向：  
  **让 Velox 更适合真实数据湖工作负载，而不只是基准测试场景。**

---

## 6. 用户反馈摘要

今日 **Issues 为 0**，缺少直接来自用户的评论与问题报告，因此无法像常规日报那样从 Issue 讨论中提炼明确痛点。  
不过，从 PR 摘要仍可间接观察到若干真实使用场景：

1. **Schema Evolution 兼容性是现实需求**  
   - 见 #16611  
   用户/集成方显然需要在 Spark 4.0 风格的 Parquet widening 下保持读取能力。

2. **远程执行场景对性能与语义一致性要求较高**  
   - 见 #16770、#16727  
   “只序列化活跃行”“null/determinism 支持”“更好的错误信息”都很像生产使用中暴露的问题。

3. **GPU 执行场景下时间戳与 Decimal 语义差异明显**  
   - 见 #16612、#16769  
   这通常来自 Presto/Spark/CUDF 之间互通时的真实兼容痛点。

4. **CI 与开发者体验仍是维护重点**  
   - 见 #16691、#16767、#16773  
   说明项目规模扩大后，开发效率问题已成为维护者持续关注的核心议题。

---

## 7. 待处理积压

以下为值得维护者关注的长期未完结 PR：

### 1) Website 依赖升级积压
- **#16342** Bump axios in /website  
  链接: https://github.com/facebookincubator/velox/pull/16342
- **#16262** Bump webpack in /website  
  链接: https://github.com/facebookincubator/velox/pull/16262
- **#15880** Bump qs and express in /website  
  链接: https://github.com/facebookincubator/velox/pull/15880

**提醒**：
这些依赖升级 PR 已存在一段时间，且集中在网站子目录。虽然不影响核心执行引擎，但属于 **安全性、维护性、前端构建稳定性** 的潜在积压项。若长期不处理，后续升级成本会继续增加。

---

### 2) `ceil(DECIMAL)` 功能已接近合并，建议尽快推进
- **PR**: #16253  
- **链接**: https://github.com/facebookincubator/velox/pull/16253

该 PR 已标记 `ready-to-merge`，但创建于 2026-02-05。  
**提醒**：
这是标准 SQL/Presto 兼容性补齐项，技术风险通常可控，且能直接提升函数完备度，建议优先处理。

---

### 3) GPU Decimal 分支链较长，需防止长期漂移
- **PR**: #16612  
- **链接**: https://github.com/facebookincubator/velox/pull/16612

作为 “Part 1 of 3” 的链式 PR，如果后续分支推进不及时，容易出现：
- rebase 成本上升；
- 接口变化导致链式冲突；
- review 上下文断裂。  
**提醒**：建议维护者关注其后续子 PR 节奏，避免 GPU 路线在中途堆积。

---

### 4) Parquet widening 对生态兼容很关键，建议尽快明确评审结论
- **PR**: #16611  
- **链接**: https://github.com/facebookincubator/velox/pull/16611

该 PR 关系到 Spark 4.0 兼容与 schema evolution 读取行为，是较高业务价值的兼容性增强。  
**提醒**：即便暂不合并，也应尽快给出明确评审反馈，避免贡献者长期等待。

---

## 8. 总结判断

今天的 Velox 没有版本发布，也没有 Issue 层面的外部事件，但 **PR 面非常活跃**，且内容并不零散，而是围绕几条清晰主线展开：

- **查询/函数能力补齐**：`dot_product`、`ceil(DECIMAL)`
- **远程执行与 RPC 架构演进**：RPCNode、active rows serialization、error semantics
- **数据湖兼容与存储优化**：Iceberg stats、Parquet widening、native preload
- **GPU/cuDF 语义对齐**：Decimal、timestamp unit
- **工程效率强化**：CI 测试拆分、artifact 优化、lint 修复

从 OLAP 引擎视角看，Velox 当前呈现出较强的“**从核心算子走向系统级可生产化**”趋势：不仅继续补函数和格式兼容，还在修炼远程执行、异构计算和工程体系。  
整体健康度评价：**良好偏强，适合持续关注下一轮合并窗口。**

--- 

如果你愿意，我还可以继续把这份日报再加工成：
1. **面向管理层的 1 页简报版**  
2. **面向内核开发者的技术深读版**  
3. **按“查询执行 / 存储格式 / GPU / CI”四个主题重组的专题版**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-15）

## 1. 今日速览

过去 24 小时内，Apache Gluten 有 **3 条 Issue 更新、8 条 PR 更新**，整体活跃度处于 **中等偏活跃** 水平，重点仍集中在 **Velox 后端跟进、构建稳定性、以及 Spark 兼容性修复**。  
今日没有新版本发布，但从 PR 结构看，项目仍在持续推进 **Velox 上游同步、指标体系修正、macOS 构建支持** 等基础能力。  
Issues 侧的关注点较集中：一是 **Velox 社区尚未合入的关键补丁追踪**，二是 **TIMESTAMP_NTZ 类型支持**，三是 **branch-1.5 在 macOS 上因 glog 变更导致构建失败**。  
PR 侧没有明确“已合并”记录，但有多条关闭/待合并变更，说明当前周期更偏向 **问题收敛与兼容性打磨**，而非大规模功能发布。

---

## 2. 项目进展

### 已关闭/收敛的 PR

#### 1) 提前取消加载，优化 Velox 输入销毁路径
- **PR:** #11697 `[VELOX] [GLUTEN-9456][VL] Cancel load earlier in GlutenDirectBufferedInput destructor`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11697

该 PR 针对 `GlutenDirectBufferedInput` 析构阶段的加载取消时机进行了优化，目标是更早释放/取消底层加载过程。  
这类修改通常影响：
- 异步 IO / 预取任务的生命周期管理
- 查询取消或任务结束时的资源释放及时性
- 降低潜在的尾部等待和无效后台工作

虽然当前状态为关闭而非明确合并，但从方向看，这属于 **执行引擎稳定性和资源管理细节优化**，对 Velox 后端长期运行稳定性有正向意义。

---

#### 2) 两个 stale PR 被关闭，积压进一步清理
- **PR:** #9530 `[BUILD] [VL] Add AWS EC2 benchmark docker file`
- **状态:** CLOSED
- **链接:** apache/gluten PR #9530

- **PR:** #11428 `[CLICKHOUSE] [GLUTEN-11427][CH] Clang 19 or higher is required when build clickhouse`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11428

这两条关闭更多体现为 **存量积压清理**：
- #9530 涉及 AWS EC2 benchmark docker 环境；
- #11428 涉及 ClickHouse 构建对 Clang 19+ 的要求。

对项目推进的信号是：维护者正在继续清理长期未推进的改动，避免 backlog 失控。  
但也说明 **基准环境建设** 和 **ClickHouse 构建链路约束说明** 这两类问题，仍可能需要以新的、更小粒度 PR 重新推进。

---

### 待合并、值得关注的 PR

#### 3) 修复 Spark 新变更引入的列式写入优化兼容性问题
- **PR:** #11753 `[CORE] [GLUTEN-11752] Fix AdaptiveSparkPlanExec accessibility in columnar write optimization`
- **状态:** OPEN
- **链接:** apache/gluten PR #11753

这是今天最值得关注的核心修复之一。  
PR 目标是修复：**Gluten 的 columnar writer optimization 在 Spark PR #51432 引入变更后，影响 shuffle IDs 获取**。  
这表明 Gluten 正在持续适配 Spark 内部执行计划 API 变化，尤其是：
- `AdaptiveSparkPlanExec` 可访问性变化
- 模式匹配/反射访问路径失效
- 列式写优化与 AQE 交互的兼容性风险

如果该 PR 合入，将直接增强 Gluten 对新 Spark 行为的兼容性，减少列式写场景下的计划执行异常。

---

#### 4) Velox 日常同步继续推进
- **PR:** #11762 `[BUILD, VELOX] [GLUTEN-6887][VL] Daily Update Velox Version (2026_03_14)`
- **状态:** OPEN
- **链接:** apache/gluten PR #11762

机器人 PR 持续同步上游 Velox 提交，说明 Gluten 与 Velox 的联动仍非常紧密。  
从摘要看，上游变更涉及：
- Exchange operator stats reporting race condition 修复
- `PlanNode::requiresSingleThread()` API 增加
- Driver runtime metrics 完善

这些更新通常会影响：
- 执行计划调度语义
- 并发执行稳定性
- 指标可观测性

对 Gluten 而言，这是后端能力与上游保持一致的重要渠道。

---

#### 5) 指标口径修正：补齐 split 添加耗时
- **PR:** #11709 `[BUILD, VELOX] [VL] Metrics: Include kPreloadSplitPrepareTimeNanos in kDataSourceAddSplitWallNanos`
- **状态:** OPEN
- **链接:** apache/gluten PR #11709

该 PR 直接修正 Spark UI 中一个性能指标的统计口径，将 `preloadSplitPrepareTimeNanos` 纳入 `data source add split time total`。  
作者明确提示：  
> 这是一个 UI 上的 breaking change，指标看起来会比以前更长。

这类变更虽然不影响查询正确性，但会影响：
- 性能回归判断
- 用户对数据源切分开销的理解
- 历史指标横向对比

属于 **可观测性准确性提升**，值得在后续版本说明中突出。

---

## 3. 社区热点

### 热点 1：Velox 未合入上游补丁追踪
- **Issue:** #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **评论数:** 16
- **👍:** 4
- **状态:** OPEN
- **链接:** apache/gluten Issue #11585

这是当前最活跃的 Issue。  
它本质上是一个 **上游 Velox 补丁追踪器**，记录了由 Gluten 社区提交、但尚未被上游合入的有用 PR。  
背后的技术诉求非常明确：
1. Gluten 对 Velox 的依赖深，很多能力必须等待上游接受；
2. 社区不希望在 `gluten/velox` 做过多长期分叉维护，因为 rebase 成本高；
3. 某些功能/修复在业务上又“等不起”，因此需要显式追踪。

这说明项目当前一个核心工程挑战是：  
**如何在减少 fork 维护成本的同时，尽快消费 Velox 新能力或修复。**

---

### 热点 2：TIMESTAMP_NTZ 类型支持
- **Issue:** #11622 `[enhancement, good first issue] [VL] Support TIMESTAMP_NTZ Type`
- **评论数:** 1
- **👍:** 2
- **状态:** OPEN
- **链接:** apache/gluten Issue #11622

虽然互动不算多，但它的路线图价值很高。  
Issue 中已经明确拆分了推进任务，包括：
- 增加配置项以禁用 fallback rule，便于开发
- 基础类型支持与 Substrait 映射

这类工作意味着 Gluten 正在补齐 **Spark SQL 类型系统与 Velox/Substrait 之间的映射缺口**。  
`TIMESTAMP_NTZ` 是现代数仓和湖仓场景里很重要的时间类型，支持它将提升：
- SQL 类型兼容性
- 跨系统执行一致性
- 减少 fallback 到 Spark 原生执行的概率

---

### 热点 3：macOS 构建失败
- **Issue:** #11763 `[Build] branch-1.5 build fail on macOS due to breaking change introduced by glog`
- **状态:** OPEN
- **创建/更新:** 2026-03-14
- **链接:** apache/gluten Issue #11763

这是今日新增且最现实的用户侧稳定性问题之一。  
问题指向：
- `branch-1.5`
- macOS 环境
- `glog` 引入 breaking change 后导致构建失败

它反映出 Gluten 在本地开发、贡献者环境、以及非 Linux 平台构建链路上的脆弱点仍然存在。  
如果近期没有对应 fix PR，这个问题可能会影响：
- 新贡献者上手
- 分支版本维护
- macOS 用户的验证/调试效率

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1：branch-1.5 在 macOS 上构建失败
- **Issue:** #11763
- **链接:** apache/gluten Issue #11763
- **状态:** OPEN
- **是否已有 fix PR:** **未看到直接关联 fix PR**

**影响面：**
- branch-1.5 用户/维护者
- macOS 本地开发环境
- 构建脚本 `buildbundle-veloxbe.sh`

**根因方向：**
- 上游 `glog` 头文件或包含方式发生 breaking change
- 现有构建脚本/依赖版本锁定策略不足

**风险判断：**
- 对生产运行影响有限，但对开发者生态和分支维护影响较大
- 若 branch-1.5 仍有用户使用，建议尽快补充版本约束或兼容修复

---

### P2：Spark 兼容性回归风险——列式写优化与 AQE 交互
- **PR:** #11753
- **链接:** apache/gluten PR #11753
- **状态:** OPEN
- **是否为 fix PR:** **是**

**问题表现：**
- Spark PR #51432 引入变化后，Gluten 的列式写优化会破坏 shuffle IDs 获取

**风险判断：**
- 涉及执行计划访问逻辑
- 影响列式写入优化场景
- 若不修复，可能引发运行时失败或优化失效

这是明显的 **跨版本 Spark 兼容性修复**，优先级较高。

---

### P3：指标统计口径不完整，可能误导性能分析
- **PR:** #11709
- **链接:** apache/gluten PR #11709
- **状态:** OPEN
- **是否为 fix PR:** **是**

**问题表现：**
- 现有 `data source add split time total` 未包含 `preloadSplitPrepareTimeNanos`

**风险判断：**
- 不影响结果正确性
- 但会影响性能诊断和 UI 解释一致性

这属于 **观测层面的 correctness 修复**，对性能工程团队尤其重要。

---

### P3：异步加载取消时机偏晚
- **PR:** #11697
- **链接:** apache/gluten PR #11697
- **状态:** CLOSED
- **是否为 fix PR:** **是，但当前未合并**

**风险判断：**
- 更偏资源释放效率与稳定性改善
- 暂未看到最终合入状态，建议后续继续跟踪

---

## 5. 功能请求与路线图信号

### 1) TIMESTAMP_NTZ 支持是明确的中期路线项
- **Issue:** #11622
- **链接:** apache/gluten Issue #11622

这是今天最明确的功能路线图信号。  
从任务拆解方式看，它已经不是泛泛而谈，而是进入了可执行阶段。  
结合其标记为 `good first issue`，可以判断：
- 社区希望吸引贡献者参与类型系统补齐；
- 实现路径相对清晰；
- 很可能会在后续小版本中逐步落地。

**纳入下一版本概率：中高。**

---

### 2) Velox 上游补丁追踪将持续影响 Gluten 功能落地节奏
- **Issue:** #11585
- **链接:** apache/gluten Issue #11585

这个 tracker 虽然不是单一功能请求，但它透露了大量路线图信号：  
**一些 Gluten 需要的关键能力，实际上取决于 Velox 上游 PR 的合入速度。**

因此，接下来几个版本中，用户可能会继续看到：
- “先在 Gluten 侧适配，再等待上游合入”
- “通过版本同步 PR 周期性吸收 Velox 新特性”
- “部分能力先以 workaround 存在，而非彻底实现”

这意味着项目的演进节奏仍将显著受制于 **Velox 上游协同效率**。

---

### 3) macOS / 多平台构建能力仍在补齐中
- **PR:** #11563 `[GLUTEN-9577][VL] Enable VCPKG for MacOS build`
- **状态:** OPEN
- **链接:** apache/gluten PR #11563

结合今天新增的 macOS 构建失败 Issue #11763，可以判断 **macOS 构建支持** 仍是活跃需求。  
`Enable VCPKG for MacOS build` 说明项目正在尝试通过更一致的依赖管理方式改善本地构建体验。

**纳入下一版本概率：中等。**  
若 #11563 能推进，将有助于缓解这类平台构建问题。

---

## 6. 用户反馈摘要

结合今日 Issue/PR 信息，可以提炼出几类真实用户痛点：

### 1) 用户希望减少因上游依赖滞后导致的功能阻塞
- 典型来源：#11585
- 链接：apache/gluten Issue #11585

用户/贡献者已经明确感受到：  
某些有价值的 Velox PR 虽然来自 Gluten 社区，但长时间未进入上游，导致 Gluten 侧功能无法顺畅依赖。  
这类反馈反映的不是单点 bug，而是 **生态协同成本**。

---

### 2) 用户需要更完整的 Spark SQL 类型兼容性
- 典型来源：#11622
- 链接：apache/gluten Issue #11622

`TIMESTAMP_NTZ` 的支持诉求说明，用户正在将 Gluten 用于更复杂、更多样的 Spark SQL 工作负载。  
类型缺失会直接导致：
- fallback 增多
- SQL 兼容性下降
- 某些 ETL/分析任务无法完全列式化执行

---

### 3) 开发者对 macOS 构建可用性仍不满意
- 典型来源：#11763、#11563
- 链接：apache/gluten Issue #11763 / PR #11563

本地构建链路的不稳定，尤其是第三方依赖（如 glog）引发的 breakage，是开发者体验上的明显痛点。  
这会影响：
- 新贡献者 onboarding
- issue 复现效率
- 分支维护成本

---

### 4) 性能分析用户需要“更真实”的指标
- 典型来源：#11709
- 链接：apache/gluten PR #11709

这说明社区不仅关心“快不快”，也关心“指标是否解释得对”。  
对 OLAP 引擎来说，错误或不完整的指标会直接影响性能优化决策，因此这是一个非常现实的使用反馈方向。

---

## 7. 待处理积压

以下长期未收敛项值得维护者继续关注：

### 1) #11563 macOS VCPKG 构建支持
- **PR:** #11563
- **创建时间:** 2026-02-04
- **状态:** OPEN
- **链接:** apache/gluten PR #11563

该 PR 与今日新增的 macOS 构建失败问题存在明显关联。  
建议优先重新评估其阻塞点，因为它可能是解决 macOS 依赖管理脆弱性的关键基础设施改动。

---

### 2) #10573 避免重复调用 `identifiyBatchType`
- **PR:** #10573
- **创建时间:** 2025-08-28
- **状态:** OPEN
- **标签:** stale
- **链接:** apache/gluten PR #10573

这是一个明显的长期积压性能优化 PR。  
摘要中提到对 TPC-DS SF1000 有性能收益，说明它不是单纯代码清理，而是潜在的执行效率改进。  
但由于长期未推进，建议维护者判断：
- 是否仍适用于当前代码基线
- 是否需要拆小重提
- 是否已有更现代的替代实现

---

### 3) #11585 Velox 未合入补丁追踪
- **Issue:** #11585
- **创建时间:** 2026-02-07
- **状态:** OPEN
- **链接:** apache/gluten Issue #11585

虽然它本身是 tracker，不属于“无人响应”，但其重要性很高。  
如果不持续维护，社区很容易失去对关键上游依赖状态的可见性。  
建议保持定期整理，并在关键 PR 合入/失效时及时更新。

---

## 8. 项目健康度判断

**总体健康度：良好，但基础设施与兼容性压力较明显。**

积极信号：
- Velox 日更同步仍在持续；
- Spark 兼容性问题有针对性修复；
- 社区对类型支持、观测指标、平台构建都有明确推进项。

风险信号：
- 上游 Velox 依赖耦合较深，功能节奏受外部影响；
- macOS 构建问题再次暴露多平台支持薄弱；
- 存在若干 stale/长期未收敛 PR，部分性能与构建改进推进较慢。

**结论：**  
Apache Gluten 当前仍处于稳步演进状态，重点正从“新增能力”转向“兼容性、可维护性、构建稳定性和观测准确性”的持续打磨。这对分析型执行引擎项目而言是健康信号，但建议维护者短期内优先处理 **macOS 构建故障** 与 **Spark 兼容修复 PR #11753**，以降低开发者和用户的直接使用摩擦。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报｜2026-03-15

## 1. 今日速览

过去 24 小时内，Apache Arrow 保持中等活跃：Issues 更新 18 条、PR 更新 7 条，但**无新版本发布、无 PR 合并**。  
Issues 层面呈现明显的“存量清理”特征：9 条关闭项大多带有 `stale-warning`，说明当前维护动作更多集中在历史积压治理，而不是新需求集中落地。  
PR 方面，活跃主题集中在 **C++/Parquet 稳定性修复、Gandiva 边界值崩溃、依赖升级与 Python 类型包装**，总体偏向底层可靠性和生态能力补齐。  
从 OLAP/分析型存储引擎视角看，今天最值得关注的是：**Parquet 字典编码溢出检查修复、加密 Bloom Filter 读取支持、Gandiva 极值参数崩溃修复**，这些都直接影响大规模分析场景下的数据正确性与可用性。

---

## 3. 项目进展

> 今日无已合并 PR，以下列出对分析引擎能力最关键的在审 PR。

### 3.1 Parquet 大数据写入正确性修复：字典编码索引计数溢出检查
- **PR**: [#49513](https://github.com/apache/arrow/pull/49513)  
- **标题**: `[Parquet][C++] Fix missing overflow check for dictionary encoder indices count`
- **状态**: OPEN / awaiting review

该 PR 针对 Parquet C++ 写路径中的字典编码器补充溢出检查。问题表现为在超大内存测试场景下：
- 页数异常膨胀（预期 2 页，实际 7501 页）
- 未能在字典索引过大时正确抛错

**影响分析：**
- 对 OLAP 写入链路很关键，尤其是高基数维度列、超大批量写入、内存压力测试环境。
- 这类问题如果不修，会导致**页布局异常、写入性能恶化甚至数据正确性风险**。
- 若合入，属于典型的**存储引擎健壮性增强**。

---

### 3.2 Parquet 加密能力增强：支持读取加密 Bloom Filter
- **PR**: [#49334](https://github.com/apache/arrow/pull/49334)  
- **标题**: `Support reading encrypted bloom filters`
- **状态**: OPEN / awaiting committer review

该 PR 解决此前**读取加密 Parquet 文件中的 Bloom Filter 会抛异常**的问题，实现了：
- 对加密 Bloom Filter header 的解密与反序列化
- 对 bitset 的独立解密
- 增加必要校验和测试

**影响分析：**
- 对数据湖/湖仓环境中的安全分析场景价值高，特别是启用列级或模块级加密的企业环境。
- Bloom Filter 可用于提升谓词下推和跳读效率；若加密场景不能读取，相当于**安全与性能不可兼得**。
- 这是 Parquet 在**安全存储 + 查询优化兼容**方面的实质推进。

---

### 3.3 Gandiva 边界值稳定性修复：极端整数参数导致崩溃
- **PR**: [#49471](https://github.com/apache/arrow/pull/49471)  
- **标题**: `[C++][Gandiva] Fix crashes in substring_index and truncate with extreme integer values`
- **状态**: OPEN / awaiting committer review

修复两个函数在极端整数值下的崩溃：
- `substring_index(VARCHAR, VARCHAR, INT)` 在 `INT_MIN` 时可能 `SIGBUS`
- `truncate(BIGINT, INT)` 在 `INT_MAX/INT_MIN` 时可能 `SIGSEGV`

**影响分析：**
- 这是典型的**表达式执行引擎健壮性修复**。
- 对接 SQL 层或上层查询引擎时，边界值输入常来自用户表达式、自动生成 SQL 或脏数据，崩溃风险高。
- 若合入，将直接提升 Gandiva 在生产分析链路中的安全性。

---

### 3.4 C++ 哈希表 merge 错误处理增强
- **PR**: [#49512](https://github.com/apache/arrow/pull/49512)  
- **标题**: `[C++] Improve error handling for hash table merges`
- **状态**: OPEN / awaiting review

该 PR 为 `util/hashing.h` 增加更完善的错误处理与单测。  
**潜在价值**在于提升哈希聚合、哈希连接等底层组件在异常路径下的稳定性，减少内部错误被吞掉或以非预期方式暴露的概率。对分析引擎而言，这类修复虽不直接增加功能，但能增强**查询执行可靠性**。

---

### 3.5 Python 类型系统扩展：VariableShapeTensor 包装
- **PR**: [#40354](https://github.com/apache/arrow/pull/40354)  
- **标题**: `[Python] Add Python wrapper for VariableShapeTensor`
- **状态**: OPEN / awaiting change review

该 PR 为 `VariableShapeTensor` 增加 Python 包装层。  
这更偏向**跨语言能力补齐**，对于需要在 Python 中处理不规则张量/嵌套数据的分析与 ML 邻接场景有意义，但从当前状态看仍属长期在审项，短期落地节奏偏慢。

---

### 3.6 CI 稳定性修复：MinGW 下 arrow-json-test 间歇性段错误
- **PR**: [#49462](https://github.com/apache/arrow/pull/49462)  
- **标题**: `[C++][CI] Fix intermittent segfault in arrow-json-test with MinGW`
- **状态**: OPEN / awaiting review

修复 Windows MinGW CI 环境下 `arrow-json-test` 间歇性崩溃。  
虽然不直接影响用户功能，但对跨平台发布质量、回归检测可靠性很关键，有助于减少**假阴性 CI 失败**与后续维护成本。

---

### 3.7 依赖栈升级：Abseil / Protobuf / gRPC / Google Cloud C++
- **PR**: [#48964](https://github.com/apache/arrow/pull/48964)  
- **标题**: `[C++] Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions`
- **状态**: OPEN / awaiting change review

这是一个潜在影响较大的基础设施 PR，摘要中已明确提示：  
**“This PR includes breaking changes to public APIs.”**

**意义与风险：**
- 正面：改善依赖安全性、兼容性和后续生态接入能力
- 风险：可能引入 ABI/API 破坏，对 Flight、云存储、远程服务集成链路有连带影响

该项若推进到合并阶段，需要重点关注迁移说明与下游适配成本。

---

## 4. 社区热点

### 4.1 深拷贝 Array / ArrayData 工具需求长期存在
- **Issue**: [#30503](https://github.com/apache/arrow/issues/30503)  
- **标题**: `[C++][Python] Create utils for deep-copying an Array/ ArrayData`
- **状态**: CLOSED
- **评论数**: 9

这是今天评论数最高的 Issue 之一，尽管最终因 stale 关闭，但其技术诉求仍非常真实：  
用户希望获得标准化的 `DeepCopyArrayData(...)` 工具，用于显式复制底层 buffer、offset、length 范围。

**背后诉求：**
- Arrow 强调零拷贝，但实际工程里常有“需要明确拥有数据副本”的场景：
  - 跨线程/跨进程边界
  - 临时 buffer 生命周期不可控
  - Python / C++ 交互中的所有权管理
- 说明社区仍在寻找**零拷贝模型与工程可控性之间的平衡**。

---

### 4.2 时间解析能力：StrptimeOptions 增加格式推断
- **Issue**: [#31120](https://github.com/apache/arrow/issues/31120)  
- **标题**: `[C++][Python][R] Add format inference option to StrptimeOptions`
- **状态**: OPEN
- **评论数**: 5

该需求覆盖 C++/Python/R，多语言一致性很强。  
核心诉求是让 Arrow 时间解析更接近 `pandas.to_datetime`、`lubridate::parse_date_time` 的用户体验。

**技术意义：**
- 这类能力直接影响 CSV/JSON 等半结构化数据摄取体验。
- 对分析平台而言，可降低 ETL 前置清洗成本。
- 若未来推进，属于**易用性与兼容性增强**，对用户 adoption 有帮助。

---

### 4.3 Python Flight 自定义 RPC 能力缺口
- **Issue**: [#45761](https://github.com/apache/arrow/issues/45761)  
- **标题**: `[Python][FlightRPC] How to Extend PyArrow Flight Server with Custom RPCs?`
- **状态**: OPEN
- **评论数**: 3

用户希望在 Python Flight server 中扩展内建 `Flight.proto` 之外的 RPC，并实现类似 `DoGet` 但返回不同类型的数据流。

**背后诉求：**
- 用户不再满足于 Flight 作为单纯数据传输协议，而是希望其成为**可扩展的数据服务框架**。
- 这反映出 Arrow Flight 在数据服务化、低延迟分析接口方面的应用深入，但 Python 侧扩展能力仍显不足。

---

### 4.4 Gandiva SQL 函数持续有增补需求
- **Issue**: [#31118](https://github.com/apache/arrow/issues/31118)  
- **标题**: `[Gandiva][C++] Add TRUNC function`
- **状态**: OPEN

- **Issue**: [#31102](https://github.com/apache/arrow/issues/31102)  
- **标题**: `[C++][Gandiva] Implement Find_In_Set Function`
- **状态**: OPEN

这些函数请求虽然热度不高，但非常典型，显示社区仍希望 Gandiva 补齐与 SQL 方言兼容相关的表达式函数集。  
结合今天的崩溃修复 PR [#49471](https://github.com/apache/arrow/pull/49471) 来看，Gandiva 当前处于**“先补稳定性，再逐步补函数覆盖”**的阶段。

---

## 5. Bug 与稳定性

按严重程度排序：

### P1｜Parquet 写入正确性风险：字典编码索引计数缺少溢出检查
- **Issue/关联**: [#49502](https://github.com/apache/arrow/issues/49502)（由 PR 关闭说明引用）
- **Fix PR**: [#49513](https://github.com/apache/arrow/pull/49513)
- **影响范围**: Parquet C++ 写入、超大数据量、字典编码列

这是今天最值得关注的存储层问题。它不仅是异常处理缺失，更可能造成**页切分异常与写入行为失真**。对大规模事实表或高基数字典列写入尤其需要关注。

---

### P1｜Gandiva 表达式执行崩溃：极值整型参数触发 SIGBUS / SIGSEGV
- **Fix PR**: [#49471](https://github.com/apache/arrow/pull/49471)
- **影响范围**: Gandiva SQL/表达式执行

该问题会导致执行器直接崩溃，而不是返回正常错误，对生产系统危害较大。尤其在接收外部 SQL、用户输入或生成式表达式时，属于必须优先处理的稳定性缺陷。

---

### P2｜加密 Parquet Bloom Filter 无法读取
- **Fix PR**: [#49334](https://github.com/apache/arrow/pull/49334)
- **影响范围**: Parquet Reader、安全数据湖、加密文件分析

该问题更多体现在功能缺失/异常抛出，而非 silent corruption，但对启用加密的企业用户影响明显，会削弱加密数据上的过滤优化能力。

---

### P2｜Python `ChunkedArray.__array__` 未正确尊重 `copy=True`
- **Issue**: [#49384](https://github.com/apache/arrow/issues/49384)
- **标题**: `Single chunk ChunkedArray doesn't correctly respect copy in __array__method`
- **状态**: OPEN
- **是否已有 Fix PR**: 暂无

这是今天新增列表中最明确的 Python 侧 correctness bug。  
问题在于：单 chunk 的 `ChunkedArray` 调用 `__array__(copy=True)` 时，返回的 numpy 数组未按预期变为可写副本。

**影响分析：**
- 会造成 Python/NumPy 互操作行为不一致
- 单 chunk 与多 chunk 表现不同，增加用户困惑
- 对需要从 Arrow 安全转入 NumPy 并原地修改数组的工作流有直接影响

---

### P3｜MinGW CI 间歇性段错误
- **Fix PR**: [#49462](https://github.com/apache/arrow/pull/49462)

更偏测试基础设施问题，但跨平台质量保障仍然重要。若不修复，会持续污染 CI 信号，拖慢真实缺陷识别效率。

---

### P3｜哈希表 merge 错误处理不完善
- **Fix PR**: [#49512](https://github.com/apache/arrow/pull/49512)

目前未见明确用户事故描述，但从底层组件性质看，建议持续关注其是否涉及聚合/连接场景中的隐性错误传播。

---

## 6. 功能请求与路线图信号

### 6.1 时间格式自动推断有望成为多语言统一增强点
- **Issue**: [#31120](https://github.com/apache/arrow/issues/31120)

该需求覆盖 C++/Python/R，且与数据导入易用性高度相关。  
如果未来进入实现，预计会成为**摄取链路友好性增强**的一部分，尤其适合 CSV、日志、事件数据处理。

**纳入下一版本概率：中等**  
原因：需求明确、语言覆盖广，但目前未见对应活跃 PR。

---

### 6.2 Gandiva 函数扩展仍有持续需求
- **TRUNC**: [#31118](https://github.com/apache/arrow/issues/31118)
- **FIND_IN_SET**: [#31102](https://github.com/apache/arrow/issues/31102)

这些需求对应典型 SQL 方言兼容补齐。  
不过结合当前活跃 PR，维护者显然更优先处理**崩溃与稳定性**，所以短期内新函数进入下个版本的概率不算高。

**纳入下一版本概率：偏低到中等**

---

### 6.3 写出节点保序能力，指向更强的数据集物理布局控制
- **Issue**: [#31135](https://github.com/apache/arrow/issues/31135)  
- **标题**: `[C++] Allow the write node to respect sorting`

这是一个很有价值的分析型存储引擎方向信号。  
用户希望在写出数据集时保留排序语义，使 partition 内 chunk 顺序符合指定排序标准。

**技术价值：**
- 有助于后续扫描时提升局部性与谓词过滤效果
- 对构建近似有序的数据湖表、优化范围查询和 merge 流程都有意义
- 属于从“只会写文件”走向“理解物理组织”的引擎能力增强

**纳入下一版本概率：中等偏低**  
原因：价值大，但工程复杂度高，当前也未见对应 PR。

---

### 6.4 Flight 脱离 Python 依赖、增强独立性
- **Issue**: [#31115](https://github.com/apache/arrow/issues/31115)  
- **标题**: `[R][FlightRPC] Flight without reticulate`

这是明显的生态路线图信号：  
社区希望 R 的 Flight 使用不依赖 `reticulate`，降低部署复杂度。

**意义：**
- 改善多语言绑定的一致性
- 提高 Flight 在企业分析环境中的可部署性
- 减少对 Python 运行时的间接耦合

---

### 6.5 Python VariableShapeTensor 包装体现类型系统扩展方向
- **PR**: [#40354](https://github.com/apache/arrow/pull/40354)

虽然该 PR 已长期在审，但它说明 Arrow 正在继续向更复杂张量/嵌套表示扩展，未来可能继续增强与 ML、科学计算场景的桥接。

---

## 7. 用户反馈摘要

### 7.1 用户希望 Arrow 在“零拷贝”之外提供更清晰的“安全复制”能力
- 代表 Issue: [#30503](https://github.com/apache/arrow/issues/30503)

真实痛点并不是反对零拷贝，而是希望在生命周期复杂、跨语言、跨线程时，能有官方支持的深拷贝工具，避免自行操作底层 buffer。

---

### 7.2 文档与行为一致性仍是 Python 用户的重要诉求
- 代表 Issues:
  - [#30516](https://github.com/apache/arrow/issues/30516) `Document missing arguments for pyarrow.flight objects`
  - [#30494](https://github.com/apache/arrow/issues/30494) `Document automatic partitioning discovery`

这些条目虽已关闭，但都说明一个共同问题：  
**Python API 功能存在，但文档解释不足，用户容易误判默认行为。**

在分析场景中，这会直接带来：
- 分区发现配置误用
- Flight 参数理解偏差
- 结果与预期不符但难以定位

---

### 7.3 企业/生产部署用户关注依赖复杂度与可移植性
- 代表 Issues:
  - [#31115](https://github.com/apache/arrow/issues/31115) `Flight without reticulate`
  - [#18980](https://github.com/apache/arrow/issues/18980) `Support for HTTPS Filesystem access`
  - [#30539](https://github.com/apache/arrow/issues/30539) `build PyArrow On Mac without Conda`

这类反馈集中指向一个主题：  
用户希望 Arrow 在真实生产环境中**更易部署、更少依赖、更方便接入现有基础设施**。

---

### 7.4 时间解析与日期函数兼容性是数据接入场景的持续痛点
- 代表 Issues:
  - [#31120](https://github.com/apache/arrow/issues/31120)
  - [#30471](https://github.com/apache/arrow/issues/30471)
  - [#31118](https://github.com/apache/arrow/issues/31118)

说明用户常把 Arrow 作为数据接入、预处理和表达式执行层，希望它在时间类型处理上更接近 Pandas / lubridate / 常见 SQL 方言。

---

## 8. 待处理积压

以下条目虽在今日有更新，但明显属于长期积压，建议维护者关注：

### 8.1 长期开放的 Python/C++/R 时间格式推断
- **Issue**: [#31120](https://github.com/apache/arrow/issues/31120)
- **创建时间**: 2022-02-11

跨语言、与摄取体验强相关，长期未落地会持续影响新用户使用门槛。

---

### 8.2 Gandiva SQL 函数缺口长期未补
- **Issues**:
  - [#31118](https://github.com/apache/arrow/issues/31118) `TRUNC`
  - [#31102](https://github.com/apache/arrow/issues/31102) `Find_In_Set`

若 Arrow 仍希望 Gandiva 在表达式执行/SQL 兼容层维持吸引力，这类基础函数缺口需要系统梳理，而非零散处理。

---

### 8.3 写出节点保序需求值得进入中期路线图
- **Issue**: [#31135](https://github.com/apache/arrow/issues/31135)

这是面向分析型存储物理布局优化的高价值需求，不应仅作为普通 enhancement 长期搁置。

---

### 8.4 Python VariableShapeTensor PR 长期在审
- **PR**: [#40354](https://github.com/apache/arrow/pull/40354)
- **创建时间**: 2024-03-04

该 PR 说明类型系统扩展已有实现意图，但长期停留在 review 流程，容易导致贡献者和用户对相关能力成熟度产生疑虑。

---

### 8.5 依赖升级 PR 潜在影响大但推进缓慢
- **PR**: [#48964](https://github.com/apache/arrow/pull/48964)

这是典型需要尽早定方向的基础设施变更：  
要么推进合并并明确迁移指引，要么拆分范围降低风险；长期悬而未决会拖累后续版本规划。

---

## 总体判断

今天的 Arrow 更像是在进行一次**底层质量与历史积压的整理日**，而不是功能突进日。  
对 OLAP / 分析型存储引擎观察者而言，最重要的正向信号是：
1. **Parquet 正确性和安全读取能力持续增强**  
2. **Gandiva 稳定性问题得到优先关注**  
3. **底层哈希、CI、依赖栈等基础设施仍在持续打磨**

但同时也要看到，社区在时间解析、Flight 扩展、写出保序、SQL 函数补齐等方面的需求已积压较久，说明 Arrow 在“核心内核稳定性”与“面向终端分析用户的功能完备性”之间，仍在做资源取舍。

如果你愿意，我还可以进一步把这份日报整理成：
- **适合飞书/钉钉发布的简版摘要**
- **面向技术管理层的风险看板**
- **面向 OLAP 引擎研发团队的重点跟踪清单**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*