# Apache Doris 生态日报 2026-03-16

> Issues: 4 | PRs: 49 | 覆盖项目: 10 个 | 生成时间: 2026-03-16 01:28 UTC

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

# Apache Doris 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时 Apache Doris 维持了较高活跃度：Issues 更新 4 条、PR 更新 49 条，说明社区当前开发节奏依然偏快，重点集中在查询引擎增强、外部生态连接器扩展以及稳定性修复。  
从 PR 内容看，近期工作重心非常明显：一方面持续补齐 Iceberg / Hive / Paimon / MaxCompute / JuiceFS / OSS / Kinesis 等湖仓与云生态能力，另一方面对执行层、聚合、递归 CTE、catalog 刷新、导出并发等细节进行修复和优化。  
今天没有新版本发布，因此观察重点更多落在“4.0.x / 4.1 分支回补”和“主干功能前推”两条线上。  
整体健康度评价：**活跃度高，功能演进积极，但仍存在若干查询正确性与配置易错性问题需要持续收敛**。

---

## 3. 项目进展

> 注：本批数据中“已合并/关闭 PR 共 4 条”，但未给出完整编号明细；以下聚焦今日更新中最值得关注、且最可能影响近期版本能力面的 PR。

### 查询引擎与 SQL 能力推进

- **[feat](group commit) add group_commit_mode in table property**  
  PR: #61242  
  链接: https://github.com/apache/doris/pull/61242  
  进展：为建表与 ALTER TABLE 增加 `group_commit_mode` 表属性。  
  影响：这意味着导入/写入路径的 group commit 能力正在从“系统级能力”进一步走向“表级可控”，有助于不同业务表按延迟/吞吐诉求做差异化配置，对高频写入场景尤其重要。

- **[Enhancement](doris-future) Support REGR_ARGX, REGR_ARGY, REGR_COUNT and REGR_R2 aggregate functions**  
  PR: #61352  
  链接: https://github.com/apache/doris/pull/61352  
  进展：补齐统计回归类聚合函数。  
  影响：这类 SQL 函数通常服务于数据分析、A/B、特征评估、回归诊断等场景，说明 Doris 正继续补强分析型 SQL 的完整性。

- **[Feature](func) Support table function json_each, json_each_text**  
  PR: #60910  
  链接: https://github.com/apache/doris/pull/60910  
  进展：新增 JSON 拆解表函数。  
  影响：对半结构化数据分析非常实用，特别适合日志、事件流、埋点数据的行转列处理，提升与 PostgreSQL / 现代分析数据库的函数体验对齐度。

- **[Feature](func) Support REGEXP_EXTRACT_ALL_ARRAY**  
  PR: #61156  
  链接: https://github.com/apache/doris/pull/61156  
  进展：新增返回 `array<string>` 的正则提取函数。  
  影响：强化文本分析和 ETL 表达能力，适合日志解析、标签抽取、规则匹配等场景。

- **Add levenshtein and hamming_distance functions**  
  PR: #60412  
  链接: https://github.com/apache/doris/pull/60412  
  进展：新增字符串距离函数。  
  影响：补齐模糊匹配、数据清洗、近似字符串检索等需求，对数据治理与文本相似度计算有实际价值。

### 执行层与性能优化

- **[opt](agg) Optimize the execution of GROUP BY count(*)**  
  PR: #61260  
  链接: https://github.com/apache/doris/pull/61260  
  进展：针对 `GROUP BY ... count(*)` 做执行优化。  
  影响：这是典型热点聚合场景，优化后有望直接改善报表聚合与宽表统计类查询性能。

- **[env](compiler) Reduce hash join build template instantiations**  
  PR: #61349  
  链接: https://github.com/apache/doris/pull/61349  
  进展：降低 hash join build 阶段模板实例化，编译时间显著下降。  
  影响：虽不直接提升运行时性能，但能改善工程构建效率，降低大规模 C++ 代码迭代成本。

- **[refactor](recursive-cte) Replace in-place PFC reset with full recreation between recursion rounds**  
  PR: #61130  
  链接: https://github.com/apache/doris/pull/61130  
  进展：重构 recursive CTE 相关的 pipeline fragment context 与 runtime filter 处理。  
  影响：更偏稳定性与资源回收治理，通常指向复杂递归查询场景中的资源泄露、状态污染或执行不一致问题。

### 湖仓 / 外部表 / 连接器生态推进

- **[feature](RoutineLoad) Support the Amazon Kinesis**  
  PR: #61325  
  链接: https://github.com/apache/doris/pull/61325  
  进展：Routine Load 支持 Amazon Kinesis。  
  影响：这是 Doris 向 AWS 原生流式摄取场景靠拢的重要一步，说明其云上实时数据接入能力在继续扩展。

- **[feature](RoutineLoad) Support RoutineLoad IAM auth**  
  PR: #61324  
  链接: https://github.com/apache/doris/pull/61324  
  进展：支持 AWS MSK IAM 鉴权。  
  影响：对企业云上安全合规非常关键，尤其是跨账号、Assume Role 等复杂认证场景。

- **[feature](iceberg) Implements iceberg update delete merge into functionality**  
  PR: #60482  
  链接: https://github.com/apache/doris/pull/60482  
  进展：推进 Iceberg Update/Delete/Merge Into。  
  影响：这是湖仓事务语义和数据变更能力的关键补齐，对与 Iceberg 生态深度集成意义重大。

- **branch-4.1:[feature](iceberg) support read iceberg v3 deletion vector**  
  PR: #61347  
  链接: https://github.com/apache/doris/pull/61347  
  进展：4.1 分支回补 Iceberg v3 deletion vector 读取能力。  
  影响：表明 Doris 对新版本 Iceberg 元数据/删除语义的适配在加速，兼容性持续增强。

- **branch-4.1: [feature](paimon) implement create/drop db, create/drop table for paimon**  
  PR: #61338  
  链接: https://github.com/apache/doris/pull/61338  
  进展：4.1 分支回补 Paimon DDL 能力。  
  影响：不仅是读写接入，更在向“统一元数据与对象管理”能力延伸。

- **[feature] Treat JuiceFS (jfs://) as HDFS-compatible in FE/BE**  
  PR: #61031  
  链接: https://github.com/apache/doris/pull/61031  
  进展：将 JuiceFS 视作 HDFS 兼容文件系统。  
  影响：有利于国产/云原生文件系统适配，降低接入门槛。

- **[feature] (cloud) Add Alibaba Cloud OSS native storage vault support with STS AssumeRole**  
  PR: #61329  
  链接: https://github.com/apache/doris/pull/61329  
  进展：云模式新增阿里云 OSS 原生 storage vault，支持 STS AssumeRole。  
  影响：强化 Doris 在阿里云环境中的原生部署体验，与 AWS 方向形成对应。

### 稳定性与兼容性修复

- **[fix](hive) Fix Hive DATE timezone shift in external readers**  
  PR: #61330  
  链接: https://github.com/apache/doris/pull/61330  
  进展：修复 Hive 外表 ORC/Parquet DATE 字段受 session 时区影响导致日期偏移。  
  影响：这是典型“查询结果正确性”问题，优先级高，尤其影响跨时区部署。

- **[fix](catalog) avoid external catalog refresh deadlock**  
  PR: #61202  
  链接: https://github.com/apache/doris/pull/61202  
  进展：修复 external catalog refresh 与 cache loader 并发导致的死锁。  
  影响：这是稳定性核心修复，关系到外部元数据系统可用性。

- **[fix](outfile) handle delete_existing_files before parallel export**  
  PR: #61223  
  链接: https://github.com/apache/doris/pull/61223  
  进展：修复并行导出时目录清理竞态，避免 writer 相互删文件。  
  影响：对大规模导出作业尤为关键。

- **[fix](mc) fix memory leak and optimize large data write for MaxCompute connector**  
  PR: #61245  
  链接: https://github.com/apache/doris/pull/61245  
  进展：修复 MaxCompute connector 内存泄漏并优化大数据量写入。  
  影响：说明外部连接器的工程质量仍在快速补强中。

- **[fix](variant) Fix variant column space usage showing as 0**  
  PR: #61331  
  链接: https://github.com/apache/doris/pull/61331  
  进展：修复 variant 列空间占用统计为 0 的问题。  
  影响：属于可观测性/运维统计层问题，虽不一定影响读写，但会误导容量分析。

---

## 4. 社区热点

### 1）单机版查询性能异常慢
- Issue: #26097  
- 链接: https://github.com/apache/doris/issues/26097  

**现象**：刚搭建的单机版 Doris，4 万多条数据查询耗时 70 多秒。  
**技术诉求分析**：  
这是非常典型的新用户落地体验问题。它不一定意味着引擎本身存在性能缺陷，更可能涉及：
- 单机资源配置不合理；
- FE/BE 部署与 compaction / metadata warmup 状态；
- 查询未命中索引/分区/前缀裁剪；
- 首次查询、配置项、磁盘类型、日志级别等环境因素。  

但从社区信号看，这类 issue 持续活跃，说明 Doris 在“默认开箱性能体验”和“问题诊断可观测性”上仍有提升空间。

---

### 2）Nereids 统计命令支持缺口
- Issue: #42631  
- 链接: https://github.com/apache/doris/issues/42631  

**现象**：Nereids 尚未实现 legacy planner 已支持的 StatsCommand。  
**技术诉求分析**：  
这是新旧规划器功能对齐的典型问题。社区对 Nereids 的期待，已经不止于“可用”，而是要求在管理命令、元数据统计、Explain/Stats 体系等方面实现全面替代。  
这类 enhancement 对 Doris 的长期路线图意义较大，因为它关系到 Nereids 成为默认/唯一规划器后的功能完整度。

---

### 3）BE HTTPS 配置易错导致启动失败
- Issue: #56103  
- 链接: https://github.com/apache/doris/issues/56103  

**现象**：BE 开启 `enable_https` 时，`ssl_private_key_path` 必须是明文私钥，否则 BE 启动失败。  
**技术诉求分析**：  
这暴露的是**配置约束不够显式、错误提示可能不够友好**的问题。对企业用户而言，TLS 私钥常涉及加密保护或统一证书管理，若系统只接受明文私钥，就需要：
- 更明确的文档说明；
- 更直观的启动报错；
- 更强的 PEM/PKCS 兼容性支持。  

这是典型的“运维门槛”问题，对生产化部署体验影响较大。

---

### 4）View + ORDER BY 列裁剪导致返回列为空
- Issue: #61219  
- 链接: https://github.com/apache/doris/issues/61219  

**现象**：在 Doris 4.0.1 中，`SELECT * FROM view ORDER BY a, b LIMIT 100` 时，视图发生过度列裁剪，除排序列外其余列为空。  
**技术诉求分析**：  
这属于高优先级查询正确性问题，且和优化器列裁剪规则直接相关。  
背后信号是：随着 Nereids/优化器演进，列裁剪、投影下推、排序与视图展开的组合路径越来越复杂，正确性回归测试需要持续加强。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：查询结果正确性问题

1. **View + ORDER BY 过度列裁剪，非排序列为空**  
   - Issue: #61219  
   - 链接: https://github.com/apache/doris/issues/61219  
   - 状态：Open  
   - 影响：直接导致结果错误。  
   - 是否已有 fix PR：**当前提供的数据中未见明确对应 fix PR**。  
   - 判断：优先级最高，应尽快补充回归用例。

2. **Hive DATE 在外表读取中发生时区偏移**  
   - PR: #61330  
   - 链接: https://github.com/apache/doris/pull/61330  
   - 影响：跨时区环境下 DATE 值被错误提前/偏移一天。  
   - 是否已有 fix PR：**有，PR 已 reviewed/approved**。  
   - 判断：这是典型跨引擎兼容性正确性修复，建议优先进入发布分支。

### P1/P2：可用性与死锁风险

3. **External catalog refresh 死锁**  
   - PR: #61202  
   - 链接: https://github.com/apache/doris/pull/61202  
   - 影响：外部 catalog 刷新与初始化并发时可能死锁。  
   - 是否已有 fix PR：**有，PR 已 reviewed/approved**。  
   - 判断：对依赖外部元数据源的生产环境影响较大。

### P2：并发与资源管理问题

4. **并行 outfile 导出误删其他 writer 文件**  
   - PR: #61223  
   - 链接: https://github.com/apache/doris/pull/61223  
   - 影响：并发导出作业的数据一致性与完整性受影响。  
   - 是否已有 fix PR：**有**。

5. **MaxCompute connector 潜在内存泄漏**  
   - PR: #61245  
   - 链接: https://github.com/apache/doris/pull/61245  
   - 影响：长时间运行与大数据量写入场景稳定性受损。  
   - 是否已有 fix PR：**有**。

### P2/P3：部署与运维易错性

6. **BE HTTPS 仅接受明文私钥，配置错误将启动失败**  
   - Issue: #56103  
   - 链接: https://github.com/apache/doris/issues/56103  
   - 状态：Open  
   - 是否已有 fix PR：**未见对应 fix PR**。  
   - 判断：偏部署体验问题，但会直接阻塞上线。

7. **variant 列空间占用显示为 0**  
   - PR: #61331  
   - 链接: https://github.com/apache/doris/pull/61331  
   - 影响：容量分析与运维观测失真。  
   - 是否已有 fix PR：**有**。

8. **单机版查询异常慢**  
   - Issue: #26097  
   - 链接: https://github.com/apache/doris/issues/26097  
   - 状态：Open  
   - 是否已有 fix PR：**无直接对应**。  
   - 判断：更可能是“性能诊断类”问题，但因影响新用户感知，也值得关注。

---

## 6. 功能请求与路线图信号

从今日 PR 与 issue 可看到几条非常明确的路线图信号：

### 1）云厂商生态与流式摄取持续增强
- Kinesis 支持：PR #61325  
  https://github.com/apache/doris/pull/61325
- RoutineLoad IAM 认证：PR #61324  
  https://github.com/apache/doris/pull/61324
- 阿里云 OSS Storage Vault + STS：PR #61329  
  https://github.com/apache/doris/pull/61329

**判断**：AWS / 阿里云两侧都在推进，且不仅做“能连”，还补到 IAM / STS / AssumeRole 级别，说明 Doris 正在强化云原生数据接入与存储认证能力，这类功能**很可能进入下一阶段的重点版本**。

### 2）湖仓兼容性是持续主线
- Iceberg Update/Delete/Merge Into：PR #60482  
  https://github.com/apache/doris/pull/60482
- Iceberg v3 deletion vector：PR #61347  
  https://github.com/apache/doris/pull/61347
- Paimon DDL：PR #61338  
  https://github.com/apache/doris/pull/61338
- JuiceFS 兼容 HDFS：PR #61031  
  https://github.com/apache/doris/pull/61031

**判断**：这不是零散需求，而是明显的产品战略方向。下一版本大概率继续围绕 Iceberg / Paimon / 外部 catalog / 对象存储展开。

### 3）SQL 分析函数与半结构化能力持续补齐
- REGR 系列函数：PR #61352  
  https://github.com/apache/doris/pull/61352
- json_each / json_each_text：PR #60910  
  https://github.com/apache/doris/pull/60910
- REGEXP_EXTRACT_ALL_ARRAY：PR #61156  
  https://github.com/apache/doris/pull/61156
- levenshtein / hamming_distance：PR #60412  
  https://github.com/apache/doris/pull/60412

**判断**：Doris 在 SQL 完备性方面仍然很积极，目标不只是 OLAP 聚合快，还要覆盖更完整的数据分析、文本处理和半结构化处理能力。

### 4）Nereids 功能对齐仍是未完成事项
- Issue: #42631  
  https://github.com/apache/doris/issues/42631

**判断**：StatsCommand 缺失是一个信号，表明新规划器替代老规划器尚存在边界能力差距。  
这类问题虽然短期不一定最“显眼”，但对长期主线至关重要，值得维护者持续投入。

---

## 7. 用户反馈摘要

### 新用户最关心：为什么“看起来很小的数据量”查询也会慢？
- Issue: #26097  
- 链接: https://github.com/apache/doris/issues/26097  

反馈说明，用户对 Doris 的预期是“开箱即可获得明显优于传统数据库/数仓的分析性能”。当 4 万行数据查询达到 70 秒时，用户感知会非常差。  
这类问题往往说明：
- 文档中的最小化部署与性能调优指导还不够“新手友好”；
- 性能诊断路径（profile、explain、系统指标）需要更易用；
- 社区应加强针对单机版/测试环境的最佳实践说明。

### 企业用户更关注安全与运维可控性
- Issue: #56103  
- 链接: https://github.com/apache/doris/issues/56103  

HTTPS 私钥格式限制反映出生产环境用户对 TLS、证书、密钥托管兼容性要求更高。  
这说明 Doris 用户群体已经不仅仅是实验性使用，而是在真正走向更严肃的生产部署。

### 用户对查询正确性的容忍度极低
- Issue: #61219  
- 链接: https://github.com/apache/doris/issues/61219  

View + ORDER BY 的列裁剪错误说明，用户越来越在真实 BI / SQL 查询链路中使用 Doris，一旦结果错误，影响比性能波动更严重。  
这类反馈强调：**优化器演进必须与正确性回归测试同步加强**。

---

## 8. 待处理积压

以下是值得维护者关注的长期未决或 stale 项：

### 1）Nereids StatsCommand 支持缺失
- Issue: #42631  
- 链接: https://github.com/apache/doris/issues/42631  
- 创建时间：2024-10-28  
- 状态：Stale / Open  

**建议**：如果 Nereids 是中长期默认规划器，该问题应尽快明确优先级，否则会持续形成新旧 planner 能力割裂。

### 2）BE HTTPS 私钥格式限制导致启动失败
- Issue: #56103  
- 链接: https://github.com/apache/doris/issues/56103  
- 创建时间：2025-09-16  
- 状态：Stale / Open  

**建议**：即便短期不支持加密私钥，也应补充显式校验与文档提示，降低运维踩坑概率。

### 3）broker storage path 参数未正确删除，影响 BE 启动
- PR: #55706  
- 链接: https://github.com/apache/doris/pull/55706  
- 创建时间：2025-09-05  
- 状态：Stale / Open  

**建议**：该问题涉及 BE 无法启动，属于可用性问题，不宜长期滞留。

### 4）S3 ClientConfiguration 初始化耗时过长
- PR: #56081  
- 链接: https://github.com/apache/doris/pull/56081  
- 创建时间：2025-09-16  
- 状态：Stale / Open  

**建议**：如果属启动慢或连接超时类问题，对云环境体验影响较大，建议重新评估价值。

### 5）Nereids broker file group data description 优化
- PR: #56089  
- 链接: https://github.com/apache/doris/pull/56089  
- 创建时间：2025-09-16  
- 状态：Stale / Open  

**建议**：如已被其他 PR 覆盖应及时关闭；否则需明确是否仍符合当前架构方向。

### 6）filecache 2Q-LRU 热点保护机制
- PR: #57410  
- 链接: https://github.com/apache/doris/pull/57410  
- 创建时间：2025-10-28  
- 状态：Open  

**建议**：这是潜在高价值性能优化项，特别适用于扫描与热点混合负载场景，值得明确评审结论。

---

## 结论

今天的 Doris 社区动态显示出几个鲜明特征：  
1. **生态集成持续外扩**：AWS、阿里云、Iceberg、Paimon、JuiceFS 等方向推进明显；  
2. **SQL 能力持续补齐**：统计函数、JSON 表函数、正则与字符串函数持续增强；  
3. **稳定性修复质量较高**：死锁、内存泄漏、时区日期偏移、并发导出竞态等问题都有明确修复动作；  
4. **正确性与运维体验仍需加固**：视图列裁剪错误、HTTPS 配置易错、单机性能体验差等问题仍然影响用户口碑。  

综合来看，Apache Doris 当前项目状态可评为：**开发活跃、方向清晰、生态扩张显著，但应继续加强优化器正确性回归与生产部署友好性**。

---

## 横向引擎对比

以下是基于 2026-03-16 各项目社区动态形成的横向对比分析报告。

---

# OLAP / 分析型存储引擎开源生态横向对比报告  
**日期：2026-03-16**

## 1. 生态全景

过去 24 小时的社区动态显示，OLAP / 分析型存储引擎生态整体仍处于**高活跃、强演进、重生态集成**阶段。  
主流项目的共同重点已经不再只是“查询更快”，而是同步推进 **湖仓格式兼容、云对象存储接入、SQL 完备性、连接器能力、执行器正确性和运维可观测性**。  
从风险面看，多项目都暴露出相似问题：**优化器/新规划器回归、复杂 SQL 语义边界、对象存储长尾性能、外部 catalog / Iceberg 兼容性、生产部署易错性**。  
总体而言，行业正在从“单一高性能分析内核竞争”转向“**查询引擎 + 湖仓生态 + 云原生连接 + 企业级稳定性**”的综合竞争。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 当日健康度评估 |
|---|---:|---:|---|---|
| **ClickHouse** | 12 | 91 | 无 | 活跃度极高；主线功能推进快，但 analyzer / Iceberg / HTTP 格式等存在 crash 与回归风险 |
| **Apache Doris** | 4 | 49 | 无 | 活跃度高；湖仓与云生态扩展明显，稳定性修复积极，但优化器正确性与运维易错性仍需加强 |
| **Apache Arrow** | 22 | 5 | 无 | 中高活跃；偏维护与修补日，Python 类型系统与执行稳定性持续增强 |
| **Velox** | 1 | 20 | 无 | 中高活跃；以执行引擎、类型系统、Iceberg/DWRF 路径增强和 CI 质量提升为主 |
| **Apache Iceberg** | 4 | 14 | 无 | 中高活跃；连接器、Flink/Kafka Connect、V4 manifest 持续推进，但 TLS/路由正确性需关注 |
| **DuckDB** | 14 | 14 | 无 | 高活跃；1.5.0 后进入回归收敛期，优化器、S3/Hive 分区和稳定性问题集中暴露 |
| **StarRocks** | 5 | 22 | 无 | 较高活跃；Iceberg 谓词下推与 shared-data 能力增强明显，修复节奏较快 |
| **Apache Gluten** | 4 | 11 | 无 | 中高活跃；重点在 Velox 对齐、Spark 兼容和真实生产性能问题定位 |
| **Delta Lake** | 0 | 10 | 无 | 中等活跃；主要由核心贡献者推进，聚焦 Kernel-Spark、catalog 与过滤下推正确性 |
| **Databend** | 0 | 9 | **1 个 nightly** | 中等偏高活跃；主干持续演进，偏查询执行优化、branch/tag 实验能力和稳定性修复 |

### 简要观察
- **活跃度第一梯队**：ClickHouse、Doris  
- **中高活跃并持续扩边**：DuckDB、StarRocks、Iceberg、Arrow、Velox  
- **较偏核心开发驱动**：Delta Lake、Databend、Gluten

---

## 3. Apache Doris 在生态中的定位

### 3.1 相比同类的优势

**1）“数据库内核 + 湖仓连接器 + 云生态接入”三线并进较均衡**  
Doris 今天的 PR 非常集中地体现了其优势：既有分析函数和 JSON/正则/字符串能力补齐，也有 Iceberg / Paimon / Hive / MaxCompute / JuiceFS / OSS / Kinesis / IAM / STS 等外部生态扩展。这说明 Doris 的路线不是单点突破，而是向**企业级统一分析平台**靠拢。

**2）对中国云与本土生态适配更积极**  
相比 ClickHouse、DuckDB、Velox 这类更偏“内核或通用分析引擎”的项目，Doris 对 **阿里云 OSS、MaxCompute、JuiceFS** 等能力的推进更贴近国内企业落地场景。

**3）OLAP 数据库产品化程度较高**  
和 Arrow、Velox、Gluten、Iceberg 这类“组件型项目”不同，Doris 直接面向终端用户提供完整数据库能力；和 DuckDB 相比，Doris 更偏分布式服务化部署；和 Delta / Iceberg 相比，Doris 更强调查询服务能力而非纯表格式标准。

### 3.2 技术路线差异

- **对比 ClickHouse**：  
  Doris 更强调 **统一湖仓接入 + MPP 数据库能力 + catalog/连接器扩展**；  
  ClickHouse 仍然更强于 **内核迭代速度、格式互通、异构 SQL 兼容探索**，但主线功能快速演进带来更多 crash / analyzer 边界问题。

- **对比 StarRocks**：  
  两者都在强化 Iceberg、对象存储、shared-data / 云原生能力。  
  StarRocks 今天更突出的是 **Iceberg 谓词下推细化和 shared-data 架构**；  
  Doris 则在 **连接器广度、SQL 函数补齐、云认证链路** 上覆盖面更广。

- **对比 DuckDB**：  
  DuckDB 偏嵌入式、单机、开发者工具链；  
  Doris 偏服务端、分布式、实时分析与数仓场景。

- **对比 Delta / Iceberg**：  
  Doris 是消费和管理这些表格式生态的查询引擎/数据库；  
  Delta / Iceberg 更像数据湖表格式与元数据协议层。

### 3.3 社区规模对比

按今日活跃度看：
- Doris（4 Issues / 49 PR）明显高于 StarRocks、DuckDB、Iceberg、Delta、Databend、Gluten；
- 低于 ClickHouse 这种超高频主线开发社区（12 / 91）；
- 作为数据库产品项目，Doris 的活跃度已处于**开源 OLAP 第一梯队**。

### 3.4 当前短板

- **优化器正确性**：View + ORDER BY 列裁剪错误说明查询正确性仍是高优先项；
- **新用户开箱体验**：单机小数据查询很慢的问题仍影响认知；
- **运维友好性**：HTTPS 私钥格式限制、外部 catalog 死锁等问题提示生产化细节仍需打磨。

---

## 4. 共同关注的技术方向

以下是多项目共同涌现的需求和信号。

### 4.1 湖仓格式与 Iceberg 生态持续升温
**涉及项目**：Doris、ClickHouse、StarRocks、Iceberg、Velox、Gluten、Delta Lake  
**具体诉求**：
- Doris：Iceberg Update/Delete/Merge Into、v3 deletion vector
- ClickHouse：Iceberg orphan files 清理、Iceberg DDL crash 修复
- StarRocks：Iceberg 谓词下推、null 分区值正确性
- Velox：equality delete sequence number 解析
- Gluten：Iceberg 元数据函数正确性
- Iceberg：Kafka Connect / DV / routing 修复
- Delta Lake：REST / catalog / kernel 交互增强

**结论**：  
Iceberg 已不只是“兼容一个外表格式”，而是成为分析引擎竞争的**标准生态接口层**。

---

### 4.2 对象存储 / 云原生访问性能与认证
**涉及项目**：Doris、DuckDB、ClickHouse、StarRocks、Gluten、Iceberg、Databend  
**具体诉求**：
- Doris：OSS Storage Vault + STS、Kinesis、IAM、JuiceFS
- DuckDB：S3 + Hive 分区 Parquet 回归、请求数暴涨
- ClickHouse：远程 URL Range 读取告警
- Gluten：S3 在大 executor.cores 下性能恶化
- StarRocks：shared-data 跨集群复制与缓存观测
- Databend：小 Bloom index 读取优化
- Iceberg：TLS / HTTPClient 稳定性

**结论**：  
对象存储已成为主战场，竞争点从“能读”转向“**少请求、低成本、高并发、认证友好、跨云稳定**”。

---

### 4.3 SQL 兼容性与复杂查询语义
**涉及项目**：Doris、ClickHouse、DuckDB、Gluten、Velox、Arrow  
**具体诉求**：
- Doris：统计函数、JSON 表函数、字符串距离函数；同时暴露 View + ORDER BY 正确性问题
- ClickHouse：30+ SQL 方言 transpiler、correlated subquery、GLOBAL IN analyzer 回归
- DuckDB：窗口函数优化回归、timestamp 语义争议
- Gluten / Velox：TimestampNTZ、CurrentTimestamp、Spark timestamp 兼容
- Arrow：argmin/argmax、复杂类型 Join 等老需求仍在

**结论**：  
SQL 竞争点正从“基础 OLAP 语法”升级为“**复杂子查询、时间类型、半结构化、跨方言迁移、表达式语义一致性**”。

---

### 4.4 正确性与稳定性优先级上升
**涉及项目**：几乎全部  
**典型问题**：
- Doris：查询结果错误、时区 DATE 偏移、catalog 死锁
- ClickHouse：服务 crash、Iceberg DDL crash、HTTP Pretty 异常
- DuckDB：CREATE INDEX 崩溃、COPY FROM DATABASE 崩溃
- StarRocks：CN crash、事务状态丢失
- Velox：lazy probe + reclaim 稳定性
- Arrow：Gandiva 极值 crash
- Iceberg：多 topic 路由错误可导致跨表写入

**结论**：  
随着项目能力越来越复杂，社区对“**合法输入不能 crash、不能错结果、不能静默失败**”的要求显著提高。

---

### 4.5 连接器与 catalog 能力增强
**涉及项目**：Doris、StarRocks、Delta Lake、Iceberg、ClickHouse  
**具体诉求**：
- Doris：Kinesis、IAM、Paimon DDL、OSS vault
- StarRocks：ADBC / Arrow Flight SQL external catalog
- Delta Lake：stagingCatalog 扩展到非 Spark session catalog
- Iceberg：Kafka Connect、REST / OpenAPI、Flink Sink extensibility
- ClickHouse：polyglot SQL transpiler 也可视为入口兼容层建设

**结论**：  
“引擎孤岛”在消失，**连接器、catalog、协议适配层** 正成为产品竞争核心。

---

## 5. 差异化定位分析

### 5.1 存储格式与数据管理定位

| 项目 | 核心定位 |
|---|---|
| **Apache Doris / StarRocks / ClickHouse / Databend** | 以查询服务为中心的分析数据库 / 数据仓库 |
| **DuckDB** | 嵌入式分析数据库，偏单机本地执行 |
| **Iceberg / Delta Lake** | 湖仓表格式与事务/元数据规范 |
| **Velox / Arrow / Gluten** | 执行引擎 / 列式内存与中间层 / Spark 加速组件 |

### 5.2 查询引擎设计差异

- **Doris / StarRocks**：典型 MPP 分布式查询引擎，重 OLAP 服务化、外表接入和统一分析平台  
- **ClickHouse**：高性能列存内核，执行器与格式支持极强，主线演进速度最快  
- **DuckDB**：嵌入式、向量化、开发者友好，适合本地分析与程序内集成  
- **Velox**：执行内核组件，服务于上层系统；不直接作为完整数据库面向终端用户  
- **Gluten**：Spark 执行加速层，价值依赖 Spark + Velox 生态  
- **Arrow**：更偏数据交换、计算组件和跨语言标准，不是完整数据库

### 5.3 目标负载类型差异

| 项目 | 更偏好的负载 |
|---|---|
| **Doris** | 实时分析、报表、统一湖仓查询、服务端 OLAP |
| **ClickHouse** | 高吞吐分析、日志/事件、复杂聚合、异构数据接入 |
| **StarRocks** | 低延迟分析、湖仓查询、shared-data 云架构 |
| **DuckDB** | 本地数据探索、Notebook、嵌入式分析、S3/Parquet 即席查询 |
| **Delta / Iceberg** | 湖仓数据管理、增量写入、事务/元数据规范 |
| **Gluten / Velox** | Spark 加速、查询执行中间层 |
| **Arrow** | 数据交换、内存格式、跨语言分析组件 |

### 5.4 SQL 兼容性差异

- **ClickHouse**：开始探索 30+ 方言转译，兼容入口野心最大  
- **Doris / StarRocks**：持续补齐标准分析函数、半结构化函数、外表 SQL 能力  
- **DuckDB**：SQL 体验强，但当前更聚焦优化器正确性修复  
- **Gluten / Velox**：重点是 Spark 语义兼容，不以通用 SQL 方言为第一目标  
- **Arrow / Iceberg / Delta**：更偏底层生态，不以完整 SQL 方言竞争为核心

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：超高活跃、快速迭代
- **ClickHouse**
- **Apache Doris**

特点：PR 数量多、功能扩张快、主线变化密集，适合观察新能力和风险并存状态。

#### 第二层：中高活跃、功能与修复并进
- **DuckDB**
- **StarRocks**
- **Apache Iceberg**
- **Velox**
- **Apache Arrow**

特点：既有功能推进，也有明显质量收敛和生态补齐动作。

#### 第三层：核心团队驱动、定向推进
- **Delta Lake**
- **Databend**
- **Apache Gluten**

特点：公开问题反馈较少，更多由核心维护者围绕明确路线推进。

### 6.2 快速迭代阶段 vs 质量巩固阶段

#### 快速迭代阶段
- **ClickHouse**：功能和兼容层推进猛，crash / analyzer 问题也较集中
- **Doris**：生态能力快速外扩，SQL 和连接器持续扩边
- **StarRocks**：Iceberg / shared-data / external connector 演进明显
- **Databend**：branch/tag、recursive CTE 等实验能力信号强

#### 质量巩固阶段
- **DuckDB**：1.5.0 后明显进入回归收敛期
- **Arrow**：更多是历史积压整理、文档和稳定性修复
- **Gluten**：关注真实生产性能和兼容性回归
- **Velox**：底层执行稳定性、类型和 CI 工程质量持续打磨

#### 生态协议深化阶段
- **Iceberg**
- **Delta Lake**

它们更像在推进表格式、catalog、连接器、元数据协议的成熟化，而非传统数据库式功能竞速。

---

## 7. 值得关注的趋势信号

### 7.1 “湖仓兼容”已从卖点变成基础能力
几乎所有主流分析引擎都在加强 Iceberg / Delta / Paimon / Parquet / Arrow / Avro 相关能力。  
**对架构师的意义**：未来选型不能只看引擎自身性能，还要看其在主流表格式和对象存储生态中的兼容深度。

### 7.2 对象存储时代，性能瓶颈转向“请求数”和“元数据路径”
DuckDB、Gluten、ClickHouse、Databend、Doris 的动态都指向同一个现实：  
真正影响云上成本和体验的，往往不是扫描算子本身，而是 **文件发现、range 读取、预取策略、row group prune、远程认证与 LIST/HEAD/GET 数量**。  
**对数据工程师的意义**：优化对象存储查询时，应优先观测 HTTP 请求数、分区发现策略、谓词下推命中率，而不只看 CPU 时间。

### 7.3 正确性问题正在压过纯性能问题
Doris 的列裁剪错误、ClickHouse 的 crash、DuckDB 的 internal error、StarRocks 的事务状态问题、Iceberg 的跨表写入风险，都说明社区更关注“**能不能信任结果**”。  
**对决策者的意义**：生产选型时，应把“复杂 SQL 正确性回归体系、CI/fuzz 覆盖、外表/时区/删除语义处理”列入关键评估项。

### 7.4 连接器、catalog、认证链路成为企业落地决定因素
Doris 的 IAM / STS / OSS，StarRocks 的 ADBC / Flight SQL，Delta 的 multi-catalog，Iceberg 的 REST / OpenAPI，说明引擎边界正在向外扩。  
**对架构师的意义**：未来数据平台将更像“统一分析入口 + 多 catalog / 多协议路由层”，而非单库封闭系统。

### 7.5 SQL 兼容性竞争从“语法支持”升级到“迁移成本控制”
ClickHouse 的多方言 transpiler、Doris 的分析函数补齐、DuckDB/Gluten/Velox 的时间类型兼容，都说明用户越来越在乎**迁移和互操作成本**。  
**对数据工程师的意义**：评估引擎时，要关注复杂子查询、窗口函数、时间语义、半结构化函数和 BI 工具兼容，而不只看 SELECT/GROUP BY 基准测试。

### 7.6 执行引擎组件化趋势继续加强
Velox、Arrow、Gluten 的持续活跃说明，越来越多系统会采用“**上层平台 + 下层共享执行内核/列式内存层**”架构。  
**对技术团队的意义**：如果你在构建自研查询平台，组件复用会比完全自建更现实，关键是处理好上游依赖和兼容边界。

---

# 结论

从 2026-03-16 的社区动态看，开源 OLAP / 分析型存储生态已经进入一个新的竞争阶段：  
核心不再只是“谁更快”，而是“**谁能在湖仓、云、SQL 兼容、连接器、正确性和运维友好性上形成更完整的生产能力**”。

**Apache Doris** 当前处于这个生态中的**强竞争位**：  
- 活跃度高，社区规模处于第一梯队；  
- 湖仓与云生态适配广度突出；  
- SQL 能力和连接器能力持续补齐；  
- 但仍需继续收敛优化器正确性、新用户开箱体验和生产部署友好性。

如果你愿意，我下一步可以把这份报告继续整理成以下任一格式：  
1. **管理层一页纸摘要版**  
2. **研发团队周会对比表版**  
3. **以 Apache Doris 为主视角的竞品对标版**  
4. **Markdown 表格增强版（适合直接发内部 wiki/飞书）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时 ClickHouse 维持高活跃：**Issues 更新 12 条，PR 更新 91 条**，说明主线开发、CI 修复、功能迭代都在持续推进。  
从内容结构看，今天的重点集中在 **CI/稳定性治理、Iceberg/Arrow 等外部格式兼容、SQL 能力扩展** 三条线上。  
Issue 侧新增了数个值得关注的 **服务崩溃与回归问题**，尤其涉及 **analyzer、Iceberg、HTTP Pretty 输出**，表明近期功能演进仍在消化边界条件。  
PR 侧则出现了多个较强路线图信号，包括 **多方言 SQL transpiler、非只读查询 detached execution、Iceberg orphan files 清理、Arrow/Avro/Parquet 兼容增强**。  
整体判断：**项目健康度较好、开发活跃度很高，但当前 master 分支仍处于功能快速演进与稳定性修补并行阶段。**

---

## 3. 项目进展

> 注：给定数据未显式列出“今日已合并 PR 明细”，以下基于今日关闭/推进明显、且对功能演进有代表性的 PR/相关修复动向进行总结。

### 3.1 查询引擎与 SQL 能力持续扩展

- **多方言 SQL 转译能力接入实验推进**  
  PR: #99496 — Integrate polyglot SQL transpiler for 30+ SQL dialects  
  链接: ClickHouse/ClickHouse PR #99496  
  该 PR 计划通过 Rust 库 `polyglot-sql` 将 **MySQL、PostgreSQL、SQLite、Snowflake、DuckDB 等 30+ 方言**转成 ClickHouse SQL，再进入原生解析流程。  
  这不是简单语法糖，而是明显面向 **跨数据库迁移、BI 工具兼容、代理层接入** 的能力建设，若最终落地，将显著降低异构 SQL 迁移成本。

- **非只读查询支持 detached execution**  
  PR: #96823 — Add detached execution for non-readonly queries  
  链接: ClickHouse/ClickHouse PR #96823  
  新特性允许在开启设置后，将 `INSERT` / `INSERT ... SELECT` 等非只读语句异步化执行，服务端立即返回 `query_id`。  
  这对 **长时间写入任务、批处理提交、任务编排系统对接** 很有价值，也反映出 ClickHouse 正在增强“数据库即执行平台”的异步作业能力。

- **参数化视图显式 schema v2 持续推进**  
  PR: #98708 — Implement/parameterized view explicit schema v2  
  链接: ClickHouse/ClickHouse PR #98708  
  该方向有助于降低参数化视图在 schema 推断上的不确定性，改善 **可维护性、部署稳定性与用户预期一致性**。

- **新增 `limit after` 特性探索**  
  PR: #99508 — limit after  
  链接: ClickHouse/ClickHouse PR #99508  
  尽管摘要信息有限，但该 PR 表明查询语义层仍在扩展，可能与 **结果裁剪/后处理阶段语义** 有关，值得后续观察。

### 3.2 存储引擎与湖仓生态集成继续增强

- **Iceberg 支持清理 orphan files**  
  PR: #99127 — Support ALTER TABLE ... EXECUTE remove_orphan_files for Iceberg tables  
  链接: ClickHouse/ClickHouse PR #99127  
  这是今天最值得关注的湖仓方向 PR 之一。它直击 Iceberg 使用中的真实运维问题：**失败写入、半途 compaction、异常中断** 导致存储层遗留无元数据引用文件，长期积累会推高存储成本。  
  若合入，将补足 ClickHouse 作为 Iceberg 查询/管理端的治理能力。

- **副本抓取策略优化：最小 part level 控制**  
  PR: #98625 — Replicated fetches min part level  
  链接: ClickHouse/ClickHouse PR #98625  
  新增 `replicated_fetches_min_part_level` 及超时配置，目标是让副本优先抓取更“大/更成熟”的 part，减少低层级碎片复制。  
  这对 **副本同步效率、网络利用率、后台 merge 压力** 都是有意义的存储侧优化。

- **补丁应用前校验列结构，降低 schema evolution 风险**  
  PR: #99531 — validate column structure before applying patches  
  链接: ClickHouse/ClickHouse PR #99531  
  该修复针对 patch 列按名称匹配而未做类型验证的问题，属于典型的 **schema 演进下数据修补安全性增强**。  
  对 CDC、增量 patch、列类型变更后的容错尤其关键。

### 3.3 格式与序列化兼容性修复在加速

- **修复 Avro 输出遇到未知 Enum 值时的逻辑错误**  
  PR: #99332 — Fix logical error in Avro output for unknown enum values  
  链接: ClickHouse/ClickHouse PR #99332  
  该 PR 将原先的 `std::out_of_range` 异常路径改为更明确的 `BAD_ARGUMENTS`。  
  这类修复虽然粒度小，但对外部格式导出场景至关重要，体现出项目对 **错误语义可诊断性** 的重视。

- **当 URL 不支持 Range Byte offsets 时对 ORC/Parquet/Arrow 读取发出告警**  
  PR: #96988 — ORC/Parquet/Arrow: warn when URL doesn't support Range Byte offsets  
  链接: ClickHouse/ClickHouse PR #96988  
  该改动非常贴近用户体验：很多“远程文件读取很慢”的问题并非 ClickHouse 算法本身，而是底层对象存储/HTTP 源不支持随机 range 读取，最终导致 **整文件下载到内存**。  
  加告警有助于提升可观测性，减少“性能玄学”排障成本。

### 3.4 稳定性与 CI 防线持续加固

- **PR 中启用 libFuzzer**  
  PR: #99530 — CI: run libFuzzers in PRs, w/o corpus upload  
  链接: ClickHouse/ClickHouse PR #99530  
  这是显著的质量工程信号。把 fuzzing 更前移到 PR 阶段，有助于更早发现解析器、执行器、格式读写中的边界漏洞。

- **固定 sqllogictest 上游提交，降低 CI 非确定性**  
  PR: #99514 — Pin sqllogictest repo to a specific commit and bump threshold  
  链接: ClickHouse/ClickHouse PR #99514  
  这是典型的 CI 稳定性治理：避免上游仓库变化导致测试结果漂移。

- **捕获 `MergeTreeTransaction::afterCommit` 异常，避免 `std::terminate`**  
  PR: #99494 — Catch exceptions in MergeTreeTransaction::afterCommit to prevent std::terminate  
  链接: ClickHouse/ClickHouse PR #99494  
  这类改动非常关键，说明维护者正在修补 **异常逃逸至 `noexcept` 路径** 导致进程级终止的问题，对线上稳定性有直接帮助。

- **修复取消 merge 后 vertical merge 的 rows_sources 断言**  
  PR: #99532 — Fix vertical merge rows_sources assertion with cancelled merges  
  链接: ClickHouse/ClickHouse PR #99532  
  指向 MergeTree 后台合并流程中较深的边界条件，表明存储内核仍在积极清理断言类故障。

---

## 4. 社区热点

### 4.1 多方言 SQL 转译成为今日最强路线图话题
- PR: #99496  
- 链接: ClickHouse/ClickHouse PR #99496

这是今天最具战略意味的 PR。其背后技术诉求很明确：  
1. **降低从 PostgreSQL/MySQL/Snowflake 等迁移到 ClickHouse 的 SQL 改写成本**；  
2. **为第三方工具接入提供兼容层**；  
3. 在不破坏 ClickHouse 原生语义的前提下，扩大 SQL 入口兼容面。  

如果后续稳定，这将不只是“语法兼容”，而是 ClickHouse 向 **多源 SQL 网关/统一分析执行层** 方向迈进的重要信号。

---

### 4.2 Arrow 格式兼容性问题持续被用户追问
- Issue: #72639 — Support UUID for format Arrow  
- 链接: ClickHouse/ClickHouse Issue #72639
- Issue: #97849 — Support Interval types in format ArrowStream  
- 链接: ClickHouse/ClickHouse Issue #97849

Arrow 相关需求连续出现，说明用户在 **数据交换、Python/Arrow 生态、列式内存格式互通** 上的诉求很强。  
当前 UUID、Interval 等类型在 Arrow / ArrowStream 中的支持不足，已经从“边缘兼容问题”变成 **生态接入阻塞点**。  
这也与 PR #96988、PR #99332 共同构成一个清晰趋势：**ClickHouse 正被更多地用于开放格式互联，而不仅是自有 SQL/自有存储闭环。**

---

### 4.3 correlated subquery / analyzer 回归继续暴露查询语义边界
- Issue: #99524 — Support LIMIT 0 or LIMIT n OFFSET m in correlated subqueries  
- 链接: ClickHouse/ClickHouse Issue #99524
- Issue: #99362 — Server crash ... analyzer with nested GLOBAL IN  
- 链接: ClickHouse/ClickHouse Issue #99362

这两条 Issue 指向同一个深层主题：**新 analyzer 与复杂子查询语义的稳定性仍在爬坡**。  
用户诉求不是“能不能优化得更快”，而是更基础的：  
- 语义不要回归；  
- 错结果不要变成异常；  
- 更不能因为复杂子查询触发 crash。  

这说明 analyzer 虽然是未来方向，但在分布式、GLOBAL IN、correlated EXISTS 这些复杂场景上，仍需持续补课。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 服务崩溃级

#### 1) analyzer + nested GLOBAL IN 导致服务崩溃
- Issue: #99362  
- 链接: ClickHouse/ClickHouse Issue #99362

问题描述：在 Distributed 表上执行嵌套 `GLOBAL IN` 查询，且启用新 analyzer 时触发 `Segmentation fault`。  
影响判断：**高危**。这是典型查询级输入触发服务进程崩溃，且涉及 analyzer 主线能力。  
现状：Issue 已打开，**未见直接对应 fix PR**。  
建议关注：应优先定位空指针/生命周期问题，并补充分布式 + analyzer 回归测试。

#### 2) Iceberg 表执行 `ALTER TABLE ... MODIFY COLUMN COMMENT` 崩溃
- Issue: #99523  
- 链接: ClickHouse/ClickHouse Issue #99523

问题描述：针对 Apache Iceberg 表修改列注释时发生空指针解引用，导致服务崩溃。  
影响判断：**高危**。Iceberg DDL 场景触发 crash，说明外表/湖仓抽象层在元数据修改路径上仍有未覆盖分支。  
现状：**未见针对该 Issue 的 fix PR**。  
关联背景：今天另有 Iceberg 相关 PR 持续推进，说明该子系统活跃但仍不稳定。

#### 3) HTTP + Pretty 查询 `system.asynchronous_inserts` 抛 `std::length_error`
- Issue: #99528  
- 链接: ClickHouse/ClickHouse Issue #99528

问题描述：通过 HTTP 接口查询 `system.asynchronous_inserts`，若使用任意 `Pretty*` 格式，会抛出 `std::length_error`，即便结果为空。  
影响判断：**高危到中高危之间**。虽然是特定系统表 + 格式组合，但属于用户直接可见的查询失败，且接口行为不一致（CLI 正常，HTTP 异常）。  
现状：**暂无 fix PR**。  
技术含义：可能涉及 Pretty formatter 对某字段宽度/字符串构造处理异常。

---

### P1 / 数据正确性或查询语义回归

#### 4) correlated subquery 对 LIMIT/OFFSET 支持出现回归
- Issue: #99524  
- 链接: ClickHouse/ClickHouse Issue #99524

问题描述：PR #99005 引入回归，使得原本“返回错误结果”的 correlated EXISTS 子查询，现在变成抛异常，触发条件与 `LIMIT 0` 或 `LIMIT n OFFSET m` 有关。  
影响判断：**高优先级正确性问题**。  
虽然“错结果变异常”比“静默错误”略好，但本质仍是 SQL 语义未正确覆盖。  
现状：**暂无 fix PR**。  
信号：相关子查询重写/分析路径仍不成熟。

#### 5) 成功 INSERT 却写入 3 条异常 system.errors 记录
- Issue: #51175  
- 链接: ClickHouse/ClickHouse Issue #51175

问题描述：插入成功，但系统错误表出现异常日志。  
影响判断：**中优先级**。不一定破坏数据，但会污染可观测性，影响告警质量与运维判断。  
值得注意的是，这是 **2023 年遗留 Issue**，今日仍被更新，表明该问题长期未彻底消化。

---

### P2 / CI 与内部稳定性

#### 6) CI crash: MergeTreeDataPartCompact 双重释放
- Issue: #98949 [已关闭]  
- 链接: ClickHouse/ClickHouse Issue #98949

已关闭说明该类 crash 已被识别并消化，属于积极信号。  
问题涉及 `MergeTreeDataPartCompact` 的 double free / corruption，反映了存储层对象生命周期治理仍是稳定性重点。

#### 7) CI crash: merge sort 中 SortingQueueImpl 构造失败
- Issue: #99503  
- 链接: ClickHouse/ClickHouse Issue #99503

当前仍打开，且来自 CI crash 机器人。  
这类问题未必已影响稳定版，但通常是主线未来线上故障的前置信号。

#### 8) fuzz / 测试触发逻辑错误
- Issue: #96657 [已关闭]  
- 链接: ClickHouse/ClickHouse Issue #96657
- Issue: #99375 [已关闭]  
- 链接: ClickHouse/ClickHouse Issue #99375

两条 fuzz/testing 相关 Issue 在今日关闭，说明 fuzz 与 CI 机制仍在有效产出问题并推动收敛。  
结合 PR #99530（PR 中运行 libFuzzer），可判断质量防线正在前移。

---

### P2 / 安全与审计

#### 9) Audit Log Spoofing
- Issue: #99526  
- 链接: ClickHouse/ClickHouse Issue #99526

问题描述：`validate_tcp_client_information` 默认关闭；即便开启，也仅校验 `interface` 与 `client_name`，允许伪造 `os_user`、`client_hostname`、`quota_key` 等审计字段。  
影响判断：**中高优先级安全/审计可信性问题**。  
这不一定导致数据泄露，但会削弱审计日志的证据效力，对合规场景影响较大。  
现状：**暂无 fix PR**。

---

## 6. 功能请求与路线图信号

### 6.1 Arrow 类型支持很可能进入后续版本重点
- Issue: #72639 — Support UUID for format Arrow  
  链接: ClickHouse/ClickHouse Issue #72639
- Issue: #97849 — Support Interval types in format ArrowStream  
  链接: ClickHouse/ClickHouse Issue #97849

结合近期格式兼容 PR 的密度，Arrow 生态互通能力提升大概率会持续推进。  
特别是 UUID、Interval 这类“不是最基础但实际很常见”的类型，一旦补齐，会显著提升 Python/Polars/DataFusion/Arrow 下游兼容性。

### 6.2 correlated subquery 能力仍是明确路线图方向
- Issue: #99524  
  链接: ClickHouse/ClickHouse Issue #99524

虽然这条是回归问题，但它本身释放出信号：维护者正在积极扩展 correlated subquery 支持面。  
短期内相关能力更可能经历 **“先覆盖语义，再修边界，再做性能优化”** 的演化过程。

### 6.3 湖仓管理能力继续增强
- PR: #99127 — Iceberg orphan files 清理  
  链接: ClickHouse/ClickHouse PR #99127
- Issue: #99523 — Iceberg DDL crash  
  链接: ClickHouse/ClickHouse Issue #99523

一边增加运维能力，一边暴露稳定性问题，说明 Iceberg 集成正处于从“可用”向“可运维、可生产”阶段推进。  
预计后续版本会继续补足 **DDL、元数据修改、垃圾回收、异常恢复** 等管理功能。

### 6.4 SQL 兼容层是中长期重要方向
- PR: #99496 — polyglot SQL transpiler  
  链接: ClickHouse/ClickHouse PR #99496

这是今天最强烈的路线图信号之一。若维护者持续投入，ClickHouse 未来可能不仅强化“高性能 OLAP 内核”，还将强化“多 SQL 方言统一执行入口”的产品定位。

---

## 7. 用户反馈摘要

基于今日 Issues，可提炼出以下真实用户痛点：

1. **格式兼容比单纯性能更影响落地**  
   Arrow 的 UUID/Interval 不支持，Avro/Parquet/Arrow 在边界条件下表现不一致，说明许多用户已将 ClickHouse 放在 **数据交换链路中心**，而不仅是查询终点。  
   相关链接：#72639, #97849, #99332, #96988

2. **用户更难接受“直接崩溃”而非“功能缺失”**  
   analyzer、Iceberg DDL、HTTP Pretty 格式相关问题都属于“一个合法查询/命令导致服务或请求失败”，这比单纯缺功能更影响生产信心。  
   相关链接：#99362, #99523, #99528

3. **复杂 SQL 语义正确性仍是采用门槛**  
   correlated subquery、GLOBAL IN 这类能力是用户从传统关系型系统迁移时绕不过去的内容。  
   只要这些场景仍有回归或 crash，迁移团队就不得不保留大量绕行 SQL。  
   相关链接：#99524, #99362

4. **审计与系统表行为正在进入更严肃的生产关注范围**  
   `system.asynchronous_inserts` 的 HTTP 行为不一致，以及 audit log spoofing 问题，都说明用户不仅关心“能不能查”，还关心 **平台可观测性、接口一致性、审计可信度**。  
   相关链接：#99528, #99526

---

## 8. 待处理积压

以下是值得维护者优先关注的长期或潜在积压项：

### 8.1 长期开放的 Arrow UUID 支持
- Issue: #72639  
- 链接: ClickHouse/ClickHouse Issue #72639

创建于 2024-11-29，至今仍开放。  
这不是冷门功能，而是 Arrow 互通中的常见类型缺口。建议尽快与 ArrowStream / Parquet / ORC 的类型映射策略统一规划。

### 8.2 成功 INSERT 却产生 system.errors 的旧问题
- Issue: #51175  
- 链接: ClickHouse/ClickHouse Issue #51175

创建于 2023-06-20，问题存续时间长。  
即便它不直接破坏数据，也会影响错误监控体系的可信度，是典型“不会立刻炸，但长期侵蚀平台体验”的问题。

### 8.3 非只读 detached execution PR 挂起时间较长
- PR: #96823  
- 链接: ClickHouse/ClickHouse PR #96823

这是较有价值的新特性，但从 2026-02-13 持续到今天仍未合入，说明设计、资源治理、查询生命周期管理方面可能还有审查点。  
建议维护者明确：  
- 后台执行的配额与取消语义；  
- query_log / system.processes 暴露方式；  
- 失败重试与客户端幂等性边界。

### 8.4 参数化视图显式 schema v2 仍在推进
- PR: #98708  
- 链接: ClickHouse/ClickHouse PR #98708

该 PR 影响用户建模体验，且与 schema 稳定性密切相关。  
建议尽快明确兼容策略和文档说明，避免用户在视图定义升级中踩坑。

---

## 附：今日重点链接清单

- Issue #99362 — analyzer + nested GLOBAL IN 崩溃  
  链接: ClickHouse/ClickHouse Issue #99362
- Issue #99523 — Iceberg MODIFY COLUMN COMMENT 崩溃  
  链接: ClickHouse/ClickHouse Issue #99523
- Issue #99528 — HTTP Pretty 查询 system.asynchronous_inserts 抛异常  
  链接: ClickHouse/ClickHouse Issue #99528
- Issue #99524 — correlated subquery 中 LIMIT/OFFSET 支持回归  
  链接: ClickHouse/ClickHouse Issue #99524
- Issue #99526 — Audit Log Spoofing  
  链接: ClickHouse/ClickHouse Issue #99526
- Issue #72639 — Arrow 支持 UUID  
  链接: ClickHouse/ClickHouse Issue #72639
- Issue #97849 — ArrowStream 支持 Interval  
  链接: ClickHouse/ClickHouse Issue #97849
- PR #99496 — 30+ SQL 方言 transpiler  
  链接: ClickHouse/ClickHouse PR #99496
- PR #96823 — 非只读查询 detached execution  
  链接: ClickHouse/ClickHouse PR #96823
- PR #99127 — Iceberg remove_orphan_files  
  链接: ClickHouse/ClickHouse PR #99127
- PR #99531 — patch 应用前做列结构校验  
  链接: ClickHouse/ClickHouse PR #99531
- PR #99332 — Avro 未知 Enum 值逻辑错误修复  
  链接: ClickHouse/ClickHouse PR #99332
- PR #99530 — PR 中运行 libFuzzer  
  链接: ClickHouse/ClickHouse PR #99530
- PR #99494 — afterCommit 捕获异常防止 terminate  
  链接: ClickHouse/ClickHouse PR #99494

---

如果你愿意，我还可以继续把这份日报整理成更适合团队同步的 **“管理层摘要版”** 或 **“研发值班版（按优先级/责任域拆分）”**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时 DuckDB 保持较高活跃度：Issues 与 PR 各更新 14 条，说明社区在 **1.5.0 版本后的回归修复、查询优化与兼容性完善** 上持续加速。  
从内容看，今日焦点明显集中在三类问题：**窗口函数优化导致的绑定/执行错误**、**S3/Hive 分区 Parquet 的性能回退**、以及 **CLI / checkpoint / COPY FROM DATABASE 等稳定性问题**。  
好消息是，部分问题已经形成快速闭环：至少 3 个 Issue/PR 在 24 小时内关闭，且多个新报错已同步出现对应修复 PR，维护响应较快。  
整体健康度评估：**活跃度高，修复节奏快，但 1.5.0 在远程对象存储、窗口优化器和部分运维路径上暴露出较多回归，需要后续小版本尽快收敛。**

---

## 3. 项目进展

### 已关闭 / 已落地的重要 PR

#### 1) CLI `.tables` 渲染问题修复
- PR: [#21389 CLI: Fix .tables rendering for large database names](duckdb/duckdb PR #21389)
- 对应 Issue: [#21378 duckdb cli 1.5.x ".tables" probably with sqlite and "-table" output issues](duckdb/duckdb Issue #21378)

该修复针对 **CLI 输出层** 的稳定性问题，解决了数据库名较长时 `.tables` 不必要截断、甚至因截断逻辑错误触发 internal error 的情况。  
这类问题虽然不涉及执行引擎核心路径，但会直接影响 **本地开发、调试、演示及脚本化运维体验**。Issue 已关闭，说明 CLI 侧已有明确修复进展。

#### 2) Parquet 跳读过程中的 define buffer 损坏修复
- PR: [#21298 parquet: avoid corrupting define buffers during skips](duckdb/duckdb PR #21298)

这是较重要的 **Parquet 读取正确性/稳定性** 修复。PR 说明 `ColumnReader::ApplyPendingSkips` 在 skip 场景中复用调用方缓冲区作为 scratch space，可能破坏 define/repeat buffer。  
该问题属于底层列式读取器细节，一旦出错可能影响 **嵌套类型、可选字段、跳读路径** 的正确性，修复对 Parquet 读取稳定性有直接正向作用。

#### 3) Parquet lazy fetch 决策中过滤 optional filters
- PR: [#21383 Parquet: Ignore optional filters when deciding whether or not to do a lazy fetch](duckdb/duckdb PR #21383)

这是对先前优化的 follow-up。核心是：**optional filters 仅用于 row group pruning，不应参与 lazy fetch 是否执行的判断**。  
这说明 DuckDB 当前正在持续打磨 Parquet 读取器在 **剪枝、延迟加载、过滤下推** 之间的协同逻辑，有助于减少不必要 I/O 与错误的取数策略判断。

#### 4) `enable_external_access=false` 阻塞 WAL checkpoint 问题已关闭
- Issue: [#21335 `enable_external_access=false` blocks WAL checkpoint on persistent databases](duckdb/duckdb Issue #21335)

虽然这里未直接列出对应合并 PR，但 Issue 已关闭，说明 **持久化数据库在受限外部访问模式下的 checkpoint 路径** 已得到处理。  
这对强调安全隔离、沙箱执行、嵌入式部署的用户尤其关键。

---

## 4. 社区热点

### 1) `timestamptz + interval/day` 的 DST / UTC offset 语义争议
- Issue: [#20845 DuckDB doesn't preserve UTC offset when adding a day to timestamptz column](duckdb/duckdb Issue #20845)

这是今日评论最多的 Issue（7 条评论）。问题核心不是简单崩溃，而是 **时间语义正确性**：  
在 `'Europe/Amsterdam'` 时区下对 `timestamptz` 加一天，DST 切换导致本地时间不存在，DuckDB 当前会“前移”到下一个合法时间点，而用户预期是更明确地保留 offset / calendar-day 语义。  
背后反映的是分析型数据库常见难题：**“日历时间运算”与“绝对时间点运算”是否分离、时区规范与文档是否足够明确**。该 Issue 还带有 `Needs Documentation`，说明文档层面也需要补足。

### 2) S3 + Hive 分区 Parquet 在 1.5.0 出现明显回归
- Issue: [#21348 `QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0](duckdb/duckdb Issue #21348)
- Issue: [#21347 Hive partition filters discover all files before pruning in 1.5.0](duckdb/duckdb Issue #21347)
- Issue: [#21385 CREATE VIEW with S3-Bucket, Hive-Partitioned Parquet Data takes very long | v1.5.0 Regression](duckdb/duckdb Issue #21385)

这组问题是今天最值得关注的热点主题。  
用户报告在 1.5.0 中，对 S3 上 Hive 分区 Parquet 的访问出现：
- `QUALIFY ROW_NUMBER() ... = 1` 场景下 HTTP GET 数量从约 80 暴增到 4200+；
- Hive 分区过滤似乎先全量发现文件，再做 pruning；
- 基于该数据集的 `CREATE VIEW` 也显著变慢。

这三者共同指向：**分区发现、谓词下推、窗口/TopN 相关优化与远程文件扫描之间的协同退化**。  
背后的技术诉求很明确：对象存储上的分析 workload 对“少列读、少文件枚举、少 HTTP 请求”极其敏感，任何优化路径变化都会被放大为成本和时延问题。

### 3) `CREATE INDEX` 直接触发堆损坏/进程崩溃
- Issue: [#21390 CREATE INDEX fails with free(): corrupted unsorted chunks](duckdb/duckdb Issue #21390)

这是今天最危险的新问题之一。错误形态是 `free(): corrupted unsorted chunks` / `corrupted double-linked list`，属于 **内存破坏级别** 症状。  
相比普通 SQL 错误，这类问题意味着某些索引创建路径上可能存在：
- 非法内存访问；
- 生命周期管理错误；
- native 层结构损坏。  
如果能稳定复现，优先级应显著高于普通兼容性问题。

### 4) 窗口函数优化器相关 internal error 快速出现 fix
- Issue: [#21387 INTERNAL Error: row_number() with multi-column PARTITION BY causes incorrect column type binding](duckdb/duckdb Issue #21387)
- PR: [#21388 Fix incorrect column binding in TopN window elimination with multi-column PARTITION BY](duckdb/duckdb PR #21388)
- Issue: [#21372 INTERNAL Error: Failed to bind column reference (inequal types)](duckdb/duckdb Issue #21372)
- PR: [#21386 Fix invalid common subplan CTE reuse for issue #21372](duckdb/duckdb PR #21386)

这是今日“报错—定位—修复”节奏最快的一组。  
说明 1.5.0 在 **窗口函数 TopN 消除、子计划复用、绑定重写** 等优化上虽然更激进，但也带来了一些边界条件失稳。积极信号是已有针对性修复 PR，维护团队对 optimizer regression 响应迅速。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高危崩溃类

#### 1) `CREATE INDEX` 导致内存损坏与进程崩溃
- Issue: [#21390 CREATE INDEX fails with free(): corrupted unsorted chunks](duckdb/duckdb Issue #21390)
- 状态：OPEN
- 是否已有 fix PR：**暂无明确对应 PR**

影响面可能覆盖 **索引/主键创建** 的核心 DDL 路径。  
出现 glibc 堆损坏错误，属于典型高优先级稳定性事件，建议优先排查是否与 1.5.0 新改动或特定 schema/data pattern 有关。

#### 2) `COPY FROM DATABASE one TO two` 在 1.5.0 崩溃
- Issue: [#21392 `COPY FROM DATABASE one TO two` crashes on DuckDB v1.5.0](duckdb/duckdb Issue #21392)
- 状态：OPEN
- 是否已有 fix PR：**暂无**

这是明显影响运维与数据迁移的稳定性问题。用户已尝试 `READ_ONLY`、`threads=1`、日志排查等，说明问题不是简单配置误用。  
若复现稳定，可能影响 **数据库复制、备份迁移、环境切换** 等实际生产流程。

---

### P1 / 查询正确性与内部错误

#### 3) 多列 `PARTITION BY` + `row_number()` 触发绑定类型错误
- Issue: [#21387](duckdb/duckdb Issue #21387)
- PR: [#21388](duckdb/duckdb PR #21388)
- 状态：Issue OPEN，PR OPEN

问题出在 **TopN window elimination** 优化绑定列时错误使用原始 partition 绑定，导致类型错绑。  
这是典型的 optimizer rewrite correctness bug，但已有针对性 fix，修复希望较大。

#### 4) `INTERNAL Error: Failed to bind column reference (inequal types)`
- Issue: [#21372](duckdb/duckdb Issue #21372)
- PR: [#21386](duckdb/duckdb PR #21386)
- 状态：Issue OPEN，PR OPEN

PR 描述表明根因是 **common_subplan 将重复子计划物化为内部 CTE 时过于激进**，消费者列重映射不一致。  
这属于优化器层 correctness regression，影响复杂 SQL 的可执行性。

#### 5) `WHERE` 子句中的 timestamp 转换失败，但 `SELECT` 中正常
- Issue: [#20708 timestamp conversion failed when using sql where clause but it is correct under select clause](duckdb/duckdb Issue #20708)
- 状态：OPEN
- 是否已有 fix PR：**暂无**

这是较值得关注的 **表达式上下文不一致** 问题：同样的 timestamp 字面量/转换逻辑在 `SELECT` 与 `WHERE` 中表现不同。  
若确认属实，说明 binder/cast rewrite 在 filter context 存在特殊路径问题。

#### 6) ADBC 接口在交错查询时 `stream.get_next()` 失败
- Issue: [#21384 ADBC interface: stream.get_next() fails with interleaved queries since DuckDB 1.5](duckdb/duckdb Issue #21384)
- 状态：OPEN
- 是否已有 fix PR：**暂无**

这直接影响 **Arrow ADBC 驱动集成场景**，尤其是多 statement / 多 stream 交错消费场景。  
属于接口兼容性回归，对驱动生态用户影响较大。

---

### P1 / 性能回归类

#### 7) `QUALIFY ROW_NUMBER() ... = 1` 导致 S3 请求暴涨约 50 倍
- Issue: [#21348](duckdb/duckdb Issue #21348)
- 状态：OPEN
- 是否已有 fix PR：**暂无明确对应**

该问题不仅是速度变慢，而是直接放大为 **远程 I/O 成本** 问题，对云上分析尤为敏感。

#### 8) Hive 分区过滤在 1.5.0 先发现全部文件再剪枝
- Issue: [#21347](duckdb/duckdb Issue #21347)
- 状态：OPEN
- 是否已有 fix PR：**暂无**

如果成立，会显著削弱 DuckDB 在对象存储上“按分区条件高效访问”的优势。

#### 9) 基于 S3 Hive 分区 Parquet 的 `CREATE VIEW` 明显变慢
- Issue: [#21385](duckdb/duckdb Issue #21385)
- 状态：OPEN
- 是否已有 fix PR：**暂无**

很可能与上面两个问题共享根因：**catalog/view 解析阶段即触发昂贵的远程文件发现或 schema 推断流程**。

---

### P2 / 兼容性与语义类

#### 10) `timestamptz` 加一天不保留预期 UTC offset
- Issue: [#20845](duckdb/duckdb Issue #20845)
- 状态：OPEN
- 标签：Needs Documentation, expected behavior

这更像 **语义定义与文档澄清** 问题，未必是纯 bug，但会影响用户对时间计算结果的信任。

#### 11) in-memory 数据库无法通过 `duckdb.connect(..., config)` 启用 `COMPRESS`
- Issue: [#21342 COMPRESS option not supported via duckdb.connect() for in-memory databases](duckdb/duckdb Issue #21342)
- 状态：OPEN

这是 API 一致性问题。功能本身存在，但不同入口行为不一致，影响 Python/嵌入式用户体验。

---

## 6. 功能请求与路线图信号

### 1) `CREATE TRIGGER` 语法支持正在推进
- PR: [#21265 Add parsing support for `CREATE TRIGGER` statements](duckdb/duckdb PR #21265)

这是今天最明确的路线图信号之一。  
虽然当前仅实现了解析，执行层仍会报 “not yet supported”，但该 PR 表明 DuckDB 已开始为 **Trigger 支持** 铺路。  
短期看，不太可能在一个补丁版本内完整落地；中期看，若后续 catalog/binder/execution PR 持续出现，触发器可能成为未来大版本的重要 SQL 兼容性增强点。

### 2) C++ 标准提升到 17
- PR: [#21310 Bumping C++ Standard to 17](duckdb/duckdb PR #21310)

这是基础设施层的重要信号。  
若落地，将影响：
- 扩展开发者的编译环境；
- 嵌入式/发行版打包；
- 第三方依赖兼容矩阵。  
该 PR 被标记 `Needs Documentation`，说明这是潜在的 **迁移注意事项**，值得提前向生态同步。

### 3) 向量操作 FMV（函数多版本化）探索
- PR: [#20439 Enable Function Multi-Versioning (FMV) for Vector Operations (GCC-only)](duckdb/duckdb PR #20439)

这是性能路线上的中长期信号。  
如果推进，将使 DuckDB 在 GCC 环境下对不同 CPU 指令集自动选择更优实现，有望提升 **向量化执行** 性能。  
但由于是 GCC-only，生态兼容性与维护成本仍需权衡。

### 4) 地理空间兼容性持续增强
- PR: [#21333 Read geoparquet file with null CRS. Fix #21332](duckdb/duckdb PR #21333)

这表明 GeoParquet / 空间数据生态仍在持续完善。  
如果合入，将改善 DuckDB 在处理 **缺失 CRS 元数据** 文件时的兼容性，对 GIS 用户更友好。

### 5) Parquet MAP 列 row group skipping
- PR: [#21375 Add row group skipping support for MAP columns in Parquet reader](duckdb/duckdb PR #21375)

这不是全新用户可见语法，但属于明显的 **存储层优化路线**。  
说明项目正在进一步减少复杂嵌套类型对剪枝优化的阻碍，有助于提升复杂 Parquet schema 的扫描效率。

---

## 7. 用户反馈摘要

### 1) 云上分析用户最关心的是“请求数”，不只是查询时间
相关链接：
- [#21348](duckdb/duckdb Issue #21348)
- [#21347](duckdb/duckdb Issue #21347)
- [#21385](duckdb/duckdb Issue #21385)

用户反馈表明，在 S3/Hive 分区场景中，DuckDB 的价值不仅在本地执行快，更在于 **尽量少枚举文件、少发 HTTP GET、少做无效 schema/metadata 读取**。  
1.5.0 的回归之所以敏感，是因为它会被直接放大为 **云成本增加与交互体验恶化**。

### 2) 用户对“优化器引入 internal error”容忍度很低
相关链接：
- [#21372](duckdb/duckdb Issue #21372)
- [#21387](duckdb/duckdb Issue #21387)
- [#21391](duckdb/duckdb PR #21391)

多个问题都显示：当 DuckDB 在窗口函数、子计划复用、PandasScan 等路径上做更激进优化时，用户会立刻在复杂分析 SQL 中触发 internal error。  
这说明核心用户群已经在使用 **较复杂的分析语句和多数据源桥接能力**，优化正确性比单纯 benchmark 提升更重要。

### 3) 嵌入式/程序化接口用户关注 API 语义一致性
相关链接：
- [#21342](duckdb/duckdb Issue #21342)
- [#21384](duckdb/duckdb Issue #21384)

无论是 `duckdb.connect()` 的 config 行为，还是 ADBC stream 的交错读取，用户都期待 **不同入口、不同驱动下行为一致且可预测**。  
这反映 DuckDB 的使用场景已远超 SQL CLI，越来越多用户通过 Python、Arrow、ADBC 等方式嵌入系统。

### 4) 时间语义仍是高敏感领域
相关链接：
- [#20845](duckdb/duckdb Issue #20845)
- [#20708](duckdb/duckdb Issue #20708)

用户对 timestamp/timestamptz 的期望非常高，特别是：
- DST 切换；
- 字面量解析；
- `WHERE` 与 `SELECT` 语义一致性。  
这类问题即使不是 crash，也会影响分析结果可信度。

---

## 8. 待处理积压

以下是值得维护者持续关注的“非当天新开，但今天仍活跃”的重要积压项：

### 1) DST 下 `timestamptz` 日历运算语义
- Issue: [#20845](duckdb/duckdb Issue #20845)

创建于 2026-02-06，至今仍在讨论，且被标注 `Needs Documentation`。  
建议尽快给出：
- 当前行为是否符合设计；
- 与 PostgreSQL/其他系统的对齐策略；
- 文档示例与迁移建议。

### 2) `WHERE` 子句 timestamp 转换异常
- Issue: [#20708](duckdb/duckdb Issue #20708)

创建于 2026-01-28，今天仍更新，但尚未看到明确 fix PR。  
由于涉及 filter 语义，建议提高优先级，避免影响用户对 SQL 结果一致性的信任。

### 3) GCC-only 向量 FMV PR 长期挂起
- PR: [#20439](duckdb/duckdb PR #20439)

创建于 2026-01-08，仍未合入。  
该 PR 涉及性能潜力较大，但技术/平台权衡复杂，若短期不推进，建议给出更明确的评审结论，避免贡献者长期等待。

### 4) `CREATE TRIGGER` 解析支持后续路线需明确
- PR: [#21265](duckdb/duckdb PR #21265)

当前只完成第一阶段。  
建议维护者说明 Trigger 是否确属 roadmap 内项目、预期分阶段范围是什么，以便社区理解后续贡献方向。

---

## 附：值得关注的新增/活跃修复 PR 清单

- [#21391 Fix window self-join optimizer when plan copy fails (e.g. PandasScan)](duckdb/duckdb PR #21391)  
  目标是修复窗口自连接优化在 plan copy 失败场景下的问题，覆盖 PandasScan 等外部数据源路径。

- [#21388 Fix incorrect column binding in TopN window elimination with multi-column PARTITION BY](duckdb/duckdb PR #21388)  
  针对 `row_number()` + 多列分区的绑定错误，属于典型 1.5.0 optimizer regression fix。

- [#21386 Fix invalid common subplan CTE reuse for issue #21372](duckdb/duckdb PR #21386)  
  收紧 common subplan 物化策略，修复内部 CTE 复用导致的列映射不一致问题。

- [#21382 Checkpoint transactions](duckdb/duckdb PR #21382)  
  让 checkpoint 在独立事务中运行，是一个偏底层但很重要的事务/持久化稳定性改进，可能与近期 checkpoint 相关问题收敛有关。

- [#21375 Add row group skipping support for MAP columns in Parquet reader](duckdb/duckdb PR #21375)  
  继续增强复杂 Parquet 类型上的扫描优化能力。

---

## 总结

今天的 DuckDB 项目动态呈现出一个很典型的版本后收敛阶段特征：  
一方面，社区和维护者对 **1.5.0 的回归问题** 响应很快，多个 internal error 已在同日出现修复 PR；另一方面，**S3/Hive 分区性能回退、索引/复制崩溃、时间语义一致性** 这些问题仍提示当前版本在部分关键场景下存在不小风险。  

从项目演进方向看，DuckDB 仍在同步推进：
- 查询优化器修复与增强；
- Parquet 读取与剪枝优化；
- SQL 兼容性扩展（如 Trigger）；
- 构建/运行时基础设施升级（C++17、FMV）。  

整体判断：**项目健康度良好，修复活跃，但建议短期重点关注 1.5.0 回归收敛，尤其是对象存储访问路径和 optimizer correctness。**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 · 2026-03-16

## 1. 今日速览

过去 24 小时内，StarRocks 保持较高活跃度：Issues 更新 5 条、PR 更新 22 条，说明项目在查询引擎、湖仓连接器、共享存储模式和文档维护多个方向同时推进。  
从主题分布看，**Iceberg 生态相关问题和增强最集中**，既有用户报告的分区值错位 Bug，也有针对谓词下推能力的连续增强 PR，表明湖仓查询兼容性仍是当前核心演进方向。  
稳定性方面，今天出现的修复点覆盖 **CN 崩溃、事务状态丢失、persistent index reload 后 compaction 失败、LIKE 转义匹配错误** 等，说明项目对生产问题的响应较快。  
整体健康度判断：**活跃度高，修复与增强并重，4.1 分支演进尤为明显**。

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1) 修复 LIKE 反斜杠转义匹配错误，提升 SQL 兼容性与查询正确性
- PR: #69775 `[BugFix] Fix incorrect LIKE pattern matching with backslash escape sequences`  
  链接: https://github.com/StarRocks/starrocks/pull/69775
- Backport: #69839 `[BugFix] Fix incorrect LIKE pattern matching with backslash escape sequences (backport #69775)`  
  链接: https://github.com/StarRocks/starrocks/pull/69839

**进展解读：**  
该修复解决了 `LIKE` 谓词在包含反斜杠转义序列时结果错误的问题，例如 `\\`、`\%` 等场景。这个问题本质上属于 **SQL 语义兼容性和结果正确性缺陷**，对依赖字符串过滤、日志检索、ETL 清洗的用户影响较大。  
同时该修复已经回补到 3.5 版本线，说明维护者认为其具备较高实际影响面。

---

#### 2) 补充共享数据跨集群复制文档，强化复制链路可靠性说明
- PR: #70260 `[Enhancement] Add file integrity verification for shared-data cross-cluster replication with non-segment file copy (backport #70093)`  
  链接: https://github.com/StarRocks/starrocks/pull/70260

**进展解读：**  
该 PR 已关闭，内容聚焦于为 shared-data cross-cluster replication 增加文件完整性校验相关文档说明，特别是 `.sst/.delvec/.del/.cols` 等非 segment 文件复制时的大小校验与重试机制。  
虽然这是文档/回补类更新，但其释放出的信号很明确：**共享数据模式下跨集群复制的工程可靠性正在持续补强**。

---

#### 3) MacOS 开发/测试兼容性改进
- PR: #70288 `[Refactor] Make types_core_test work on MacOS`  
  链接: https://github.com/StarRocks/starrocks/pull/70288
- PR: #70287 `[Refactor] Make common_test work on MacOS`  
  链接: https://github.com/StarRocks/starrocks/pull/70287

**进展解读：**  
这两项关闭的重构 PR 主要改善本地开发环境与测试可移植性。虽然不直接影响线上查询能力，但对贡献者生态有积极作用，有助于降低 **跨平台开发和 CI 之外复现问题的门槛**。

---

#### 4) 重提并保留的 Variant/Parquet 读取路径优化
- 关闭 PR: #70289 `[Enhancement] push variant column access paths to parquet shredded readers`  
  链接: https://github.com/StarRocks/starrocks/pull/70289
- 当前有效 PR: #70291 `[Enhancement] push variant column access paths to parquet shredded readers`  
  链接: https://github.com/StarRocks/starrocks/pull/70291

**进展解读：**  
虽然旧 PR 因标题规范等原因关闭，但新 PR 已续接，目标是将 FE 已提取的 variant 子字段访问路径真正传递到 BE parquet shredded reader。  
这将减少无关 typed columns 的自动发现与物化，对 **半结构化数据查询性能、IO 与列裁剪效率** 都是直接优化。

---

## 4. 社区热点

### 热点 1：Iceberg 分区值错位 Bug 持续活跃
- Issue: #63029 `[type/bug] IcebergTable Partition tableName error with null partition values`  
  链接: https://github.com/StarRocks/starrocks/issues/63029

**热度依据：** 今日 Issues 中评论数最高（13）。  

**技术诉求分析：**  
用户反馈 Iceberg 分区值中出现 `null` 时，分区数组偏移导致后续值错位，影响 Materialized View ingest 场景。  
这反映出当前用户对 StarRocks + Iceberg 集成的诉求，已经不只是“能查”，而是要求在 **空值语义、分区映射、增量构建与物化视图链路** 上都具备生产级正确性。

---

### 热点 2：Iceberg 谓词下推增强形成“成组推进”
- Issue: #70294 `Support numeric widening cast in Iceberg predicate pushdown`  
  链接: https://github.com/StarRocks/starrocks/issues/70294
- 配套 PR: #70295  
  链接: https://github.com/StarRocks/starrocks/pull/70295

- Issue: #70292 `Iceberg AND compound predicate partial pushdown`  
  链接: https://github.com/StarRocks/starrocks/issues/70292
- 配套 PR: #70293  
  链接: https://github.com/StarRocks/starrocks/pull/70293

**技术诉求分析：**  
这两组 issue+PR 都来自同一方向：**提升 Iceberg connector 的谓词下推命中率**。  
当前痛点包括：
- 字面量与列类型不一致时，numeric widening cast 失败，导致常见查询如 `WHERE bigint_col = 1` 无法下推；
- `AND` 复合谓词中只要有一侧不可转换，整个谓词就被放弃，策略过于保守。

这说明社区当前不满足于“下推框架存在”，而是开始追求 **更细粒度、更鲁棒的下推能力**，目标是减少扫描量、改善远端湖仓数据访问性能。

---

### 热点 3：新增 ADBC / Arrow Flight SQL 外部 Catalog Connector
- PR: #70297 `[Feature] Add ADBC (Arrow Flight SQL) external catalog connector`  
  链接: https://github.com/StarRocks/starrocks/pull/70297

**技术诉求分析：**  
这是今天最值得关注的新功能项之一。PR 计划引入基于 **ADBC / Arrow Flight SQL** 的外部 catalog connector。  
其背后反映的诉求是：
- 用户希望 StarRocks 接入更现代的高速数据访问协议；
- 不仅局限于 JDBC 等传统连接方式，而是走向 **Arrow 生态互通与低开销数据访问**；
- 连接器能力正在成为项目路线图中的重要扩展面。

需要注意的是，该 PR 明确提到 **暂未纳入 CI 集成测试**，说明功能方向明确，但落地成熟度仍需基础设施配合。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：CN 扫描空 Tablet 时可能崩溃
- PR: #70281 `[BugFix] Fix CN crash when scanning empty tablet with physical split enabled`  
  链接: https://github.com/StarRocks/starrocks/pull/70281

**问题描述：**  
在 empty tablet 且启用 physical split 时，访问 rowset 数组越界，导致 SIGSEGV。  

**影响判断：**  
属于 **明确的运行时崩溃问题**，影响计算节点稳定性，优先级高。  
**状态：已有 fix PR，覆盖 3.5/4.0/4.1。**

---

### P1：FE leader 切换后显式事务状态丢失
- PR: #70285 `[BugFix] Fix explicit transaction state loss handling on FE leader switch`  
  链接: https://github.com/StarRocks/starrocks/pull/70285

**问题描述：**  
FE leader 切换后，连接仍持有陈旧 transaction ID，可能导致：
- COMMIT/ROLLBACK 静默失败；
- BEGIN 过程潜在 NPE。

**影响判断：**  
这是 **事务一致性与可观测性问题**，对在线写入、应用侧事务管理影响很大。  
**状态：已有 fix PR。**

---

### P1：Persistent index reload 后 standalone sstable fileset_id 不匹配
- PR: #70210 `[BugFix] Fix standalone sstable fileset_id mismatch after persistent index reload`  
  链接: https://github.com/StarRocks/starrocks/pull/70210

**问题描述：**  
persistent index reload 之后，`apply_opcompaction()` 可能出现 “no matching sstable fileset found for compaction”。  

**影响判断：**  
涉及 **存储引擎 compaction 正确性与后台维护稳定性**，若触发可能影响写入后整理流程。  
**状态：已有修复 PR，4.1 分支。**

---

### P2：Iceberg 分区值含 null 时映射错位
- Issue: #63029  
  链接: https://github.com/StarRocks/starrocks/issues/63029

**问题描述：**  
分区值数组在存在 null 时发生偏移，进而影响表名/分区值解析，已在 3.5.4 的 MV ingest 场景暴露。  

**影响判断：**  
对 Iceberg + MV 用户而言是 **功能正确性问题**，可能导致错误分区识别甚至数据读取异常。  
**状态：暂无关联 fix PR 出现在今日数据中。**

---

### P2：Java UDF 创建导致 StackOverflow
- Issue: #70262 `[type/bug] create java udf StackOverflow`  
  链接: https://github.com/StarRocks/starrocks/issues/70262

**影响判断：**  
涉及 UDF 扩展能力与 FE/执行链路健壮性。  
**状态：Issue 今日已关闭**，但当前数据未附带直接对应 PR，建议维护者在关闭说明中补充关联修复链接，便于追踪。

---

### P2：LIKE 转义语义错误已修复
- PR: #69775 / #69839  
  链接: https://github.com/StarRocks/starrocks/pull/69775  
  链接: https://github.com/StarRocks/starrocks/pull/69839

**影响判断：**  
属于结果正确性问题，影响 SQL 兼容与业务过滤准确性。  
**状态：已修复并回补。**

---

## 6. 功能请求与路线图信号

### 1) Iceberg 谓词下推能力增强，极可能进入下一版本
- Issue: #70294 / PR: #70295  
  链接: https://github.com/StarRocks/starrocks/issues/70294  
  链接: https://github.com/StarRocks/starrocks/pull/70295
- Issue: #70292 / PR: #70293  
  链接: https://github.com/StarRocks/starrocks/issues/70292  
  链接: https://github.com/StarRocks/starrocks/pull/70293

**判断：高概率纳入 4.1。**  
理由：
- 已同步提交实现 PR；
- 均打上 `4.1` 与 `behavior_changed` 标记；
- 变更收益明确，兼容风险相对可控。

---

### 2) ADBC / Arrow Flight SQL 连接器是明显的前沿功能信号
- PR: #70297  
  链接: https://github.com/StarRocks/starrocks/pull/70297

**判断：中高关注，是否近期落地取决于测试基础设施。**  
这是外部 catalog / 连接器路线的重要扩展，若顺利推进，将增强 StarRocks 在 **联邦查询、外部系统接入、Arrow 生态兼容** 方面的竞争力。  
但 CI 尚未接入，意味着短期内更可能先以实验性或逐步完善方式推进。

---

### 3) 共享数据模式继续深化
- PR: #70187 `support dummy select _CACHE_STATS_ in shared-data cluster`  
  链接: https://github.com/StarRocks/starrocks/pull/70187
- PR: #70286 `Enable file bundling for multi-statement transactions`  
  链接: https://github.com/StarRocks/starrocks/pull/70286

**判断：shared-data 仍是主线投资方向。**  
一个偏观测/诊断（缓存统计），一个偏写入与小文件治理（file bundling），说明团队正在同时补齐 **可观测性 + 写放大/小文件治理** 两端能力。

---

### 4) Variant/Parquet 路径裁剪能力增强值得持续关注
- PR: #70291  
  链接: https://github.com/StarRocks/starrocks/pull/70291

**判断：较可能进入后续版本。**  
该优化针对半结构化数据查询的读放大问题，符合当前分析型引擎在 JSON/Variant 数据上的演进趋势。

---

## 7. 用户反馈摘要

### 1) 湖仓集成用户最关心的是“正确地下推”和“正确处理 null/快照”
从 #63029、#70292、#70294、#69825 可见，Iceberg 用户已进入更深层使用阶段，涉及：
- 含 null 的分区值处理；
- AND 复合谓词的部分下推；
- 数值 widening cast；
- IVM 对 REPLACE snapshot 的识别。  

这说明用户使用场景已从基础外表查询升级到 **物化视图、增量刷新、复杂过滤、生产级优化**。

相关链接：
- https://github.com/StarRocks/starrocks/issues/63029
- https://github.com/StarRocks/starrocks/issues/70292
- https://github.com/StarRocks/starrocks/issues/70294
- https://github.com/StarRocks/starrocks/pull/69825

---

### 2) 共享数据架构用户关注复制可靠性、事务写入效率与观测能力
从 #70260、#70187、#70286 可以看到，shared-data 模式用户的核心诉求包括：
- 跨集群复制的文件完整性；
- `_CACHE_STATS_` 这类诊断入口；
- 多语句事务导致的小文件问题。  

这表明 shared-data 已不再只是实验特性，用户开始系统性关注 **运维稳定性与成本效率**。

相关链接：
- https://github.com/StarRocks/starrocks/pull/70260
- https://github.com/StarRocks/starrocks/pull/70187
- https://github.com/StarRocks/starrocks/pull/70286

---

### 3) SQL 兼容与事务语义仍是生产用户敏感点
- LIKE 转义错误修复说明用户对 SQL 结果正确性容忍度很低；
- leader 切换导致事务状态丢失说明高可用场景下，用户希望错误能被显式报告，而不是静默失败。

相关链接：
- https://github.com/StarRocks/starrocks/pull/69775
- https://github.com/StarRocks/starrocks/pull/70285

---

## 8. 待处理积压

### 1) Iceberg null 分区值错位问题需尽快给出修复路径
- Issue: #63029  
  链接: https://github.com/StarRocks/starrocks/issues/63029

**提醒原因：**  
该问题创建时间较早（2025-09-11），今日仍活跃且已有 13 条评论，说明它不是孤立提问，而是持续影响用户的真实生产场景。  
建议维护者优先：
- 确认影响版本范围；
- 给出最小复现与临时规避方案；
- 关联修复 PR 或明确修复计划版本。

---

### 2) ADBC 连接器需要尽早明确测试与发布策略
- PR: #70297  
  链接: https://github.com/StarRocks/starrocks/pull/70297

**提醒原因：**  
功能方向有价值，但缺少 CI 集成测试将影响合并信心与后续维护成本。  
建议维护者尽快明确：
- 是否先以实验特性引入；
- 是否允许仅单测覆盖先合入；
- 外部 Flight SQL 服务在 CI 中如何编排。

---

### 3) 文档维护待处理项已被自动汇总，需避免积压扩散
- Issue: #70296 `[doc-feedback] Weekly documentation feedback from readers`  
  链接: https://github.com/StarRocks/starrocks/issues/70296

**提醒原因：**  
自动汇总 issue 提示当前仍有 docs-maintainer 标记 PR 待处理。若长期堆积，会影响新特性的可发现性与用户自助排障效率。

---

## 附：今日值得重点跟踪的 PR / Issue

- Iceberg null 分区错位 Bug: #63029  
  https://github.com/StarRocks/starrocks/issues/63029
- Iceberg numeric widening cast 下推: #70294 / #70295  
  https://github.com/StarRocks/starrocks/issues/70294  
  https://github.com/StarRocks/starrocks/pull/70295
- Iceberg AND 部分下推: #70292 / #70293  
  https://github.com/StarRocks/starrocks/issues/70292  
  https://github.com/StarRocks/starrocks/pull/70293
- ADBC / Arrow Flight SQL connector: #70297  
  https://github.com/StarRocks/starrocks/pull/70297
- FE leader 切换事务状态修复: #70285  
  https://github.com/StarRocks/starrocks/pull/70285
- CN 空 tablet 崩溃修复: #70281  
  https://github.com/StarRocks/starrocks/pull/70281

如果你愿意，我还可以继续把这份日报整理成：
1. **适合发飞书/钉钉的简版摘要**，或  
2. **按“查询引擎 / 存储 / 湖仓 / 文档”分类的周报视图**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 共发生 **18 条开发活动**：**4 条 Issue 更新**、**14 条 PR 更新**，整体活跃度处于 **中高水平**。  
从结构上看，今天的重点不在版本发布，而在 **连接器能力增强、Flink/Sink 可扩展性、Kafka Connect 路由修复、V4 Manifest 写入能力演进** 等方向。  
Issue 侧新增问题不多，但出现了一个值得关注的 **TLS hostname verification 回归问题**，这类问题可能直接影响 REST/HTTP 集成可用性。  
另外，若干关闭项主要是 **stale 清理** 和 **依赖升级 PR 关闭**，说明项目在保持日常维护节奏，但也存在部分历史讨论被自动收口的现象。

---

## 3. 项目进展

### 已关闭 / 已合并 / 结束处理的 PR

#### 1) OpenAPI 代码生成工具升级链路继续清理
- **PR #14791** `[CLOSED] [OPENAPI] Build: Bump datamodel-code-generator from 0.36.0 to 0.41.0`  
  链接: apache/iceberg PR #14791
- **PR #14962** `[CLOSED] [OPENAPI] Build: Bump datamodel-code-generator from 0.49.0 to 0.52.1`  
  链接: apache/iceberg PR #14962

这两个 PR 都以 **“Supersedes”** 方式被后续升级替代，说明 Iceberg 在 **OpenAPI 生成链路** 上持续推进，但维护策略偏向“直接追最新可用版本”，而不是逐步合并历史升级。  
这对 REST catalog / API 客户端生态是正向信号：**生成模型和 API schema tooling 正在持续更新**，有利于减少生成代码差异和工具链老化问题。

#### 2) 依赖升级 PR 批量关闭
- **PR #15638** `[CLOSED] [dependencies, java] Build: Bump software.amazon.awssdk:bom from 2.42.8 to 2.42.13`  
  链接: apache/iceberg PR #15638
- **PR #15637** `[CLOSED] [dependencies, java] Build: Bump com.google.cloud:libraries-bom from 26.77.0 to 26.78.0`  
  链接: apache/iceberg PR #15637
- **PR #15636** `[CLOSED] [dependencies, java] Build: Bump nessie from 0.107.3 to 0.107.4`  
  链接: apache/iceberg PR #15636

这 3 个关闭项都属于 **例行依赖升级**，对用户可见功能提升有限，但反映出以下维护面向：
- **AWS / GCP 云集成栈**仍在持续跟进；
- **Nessie 版本联动**仍是 Iceberg 生态维护重点；
- 关闭而非合并，说明维护者对自动化依赖升级采取更谨慎的筛选策略，可能等待更大批量统一处理或人工验证。

### 今日仍在推进的关键 PR

#### 3) Kafka Connect：DV 模式 Delta Writer 持续推进
- **PR #14797** `[OPEN] [docs, build, KAFKACONNECT] Implement Iceberg Kafka Connect with Delta Writer Support in DV Mode for in-batch deduplication`  
  链接: apache/iceberg PR #14797

这是今天最值得关注的功能型 PR 之一。它试图在 Kafka Connect 中为 Iceberg 引入：
- **Delta Writer**
- **CDC / upsert 模式**
- **DV（Deletion Vectors）支持**
- **批内去重能力**

这表明 Iceberg 正继续强化 **流式摄取与变更数据捕获（CDC）** 场景，尤其是面向连接器侧的低延迟写入与去重控制。  
若该 PR 最终落地，将显著增强 Iceberg 作为实时湖仓表格式在 **Kafka Connect ingestion** 场景中的竞争力。

#### 4) Flink Sink 扩展点建设
- **PR #15316** `[OPEN] [flink, stale] Flink: Add extensibility support to IcebergSink for downstream composition`  
  链接: apache/iceberg PR #15316

该 PR 增加了 `CommittableMetadata` 框架，并开放部分 Sink 类的访问修饰符，目标是让下游系统能更容易地：
- 在 sink pipeline 中附加自定义 metadata
- 复用 IcebergSink 内部提交链路
- 做下游 connector 级组合开发

这类改动虽然不直接影响 SQL 行为，但对 **Flink 生态扩展性** 非常关键。它释放的信号是：Iceberg 正从“提供一个标准 sink”走向“提供可复用 sink 基础设施”。

#### 5) V4 Manifest 写入能力增强
- **PR #15634** `[OPEN] [parquet, core] Core, Parquet: Allow for Writing Parquet/Avro Manifests in V4`  
  链接: apache/iceberg PR #15634

该 PR 允许 V4 Manifest Writer 根据文件扩展名写出 **Parquet 或 Avro manifest**，并给 SDK 默认启用 **V4 + Parquet manifests**。  
这属于典型的 **存储元数据层优化**，潜在影响包括：
- Manifest 文件格式灵活性提升
- 未来在 manifest 读取/压缩/列式访问上的性能空间增大
- 为 Iceberg V4 元数据路径提供更现实的默认实现

从路线图角度看，这说明 **V4 元数据格式能力** 正在加速补全。

#### 6) Core 属性处理正确性修复
- **PR #15558** `[OPEN] [spark, parquet, core] Core: fix propertiesWithPrefix to strip prefix literally, not as regex`  
  链接: apache/iceberg PR #15558

该修复针对 `PropertyUtil.propertiesWithPrefix` 使用 `replaceFirst` 带来的 regex 语义问题。  
影响虽然细节化，但属于典型 **配置处理正确性 bug**：
- 某些包含正则特殊字符的前缀会被错误剥离
- 导致配置读取结果异常或静默失配

这类问题通常影响面比表面更大，因为会波及 **Spark / Parquet / Core 配置解析路径**，建议维护者优先合并。

#### 7) Kafka Connect 多 Topic 路由修复
- **PR #15639** `[OPEN] [KAFKACONNECT] Fix multi-topic routing to prevent writing all records to all tables`  
  链接: apache/iceberg PR #15639

这是一个非常实用的正确性修复：当未设置 `iceberg.tables.route-field` 时，旧逻辑可能把多个 topic 的记录 **广播写入所有表**。  
潜在后果非常严重：
- 跨表脏写
- 数据污染
- 多租户/多流写入场景下表数据错乱

该修复对 Kafka Connect 用户应属高优先级。

---

## 4. 社区热点

### 热点 1：REST Fixture Catalog 异常语义问题
- **Issue #13915** `[CLOSED] [bug, stale] REST Fixture Catalog throws misleading exceptions...`  
  链接: apache/iceberg Issue #13915  
  评论数：**11**

这是今天评论最多的 Issue。问题核心不是操作失败，而是 **成功路径上抛出误导性异常**，例如：
- `NoSuchNamespaceException`
- `NoSuchViewException`

背后的技术诉求很明确：  
社区希望 **REST catalog / fixture 测试环境** 的异常语义更准确，否则会：
- 干扰集成测试判断
- 增加客户端实现复杂度
- 模糊 catalog API 的行为契约

虽然该 Issue 以 stale 关闭，但它反映出 Iceberg 在 **REST catalog 行为一致性与可测试性** 上仍有用户关注。

### 热点 2：Snapshot Isolation 语义理解
- **Issue #13974** `[CLOSED] [question, stale] Understanding Snapshot Isolation Level`  
  链接: apache/iceberg Issue #13974  
  评论数：**3**

这个问题聚焦并发写入，尤其是 Spark `MERGE INTO` 场景下的隔离级别理解。  
它代表了 Iceberg 用户长期存在的一个核心诉求：  
**“快照隔离到底如何作用于并发 upsert / merge / overwrite？”**

虽然今天没有新结论，但这类问题持续出现，说明：
- 用户对 Iceberg 的并发控制模型仍有学习成本；
- 文档层面对 **snapshot isolation / serializable / optimistic concurrency** 的解释可能还不够场景化。

### 热点 3：Kafka Connect Delta Writer + DV
- **PR #14797** `[OPEN] [docs, build, KAFKACONNECT] Implement Iceberg Kafka Connect with Delta Writer Support in DV Mode for in-batch deduplication`  
  链接: apache/iceberg PR #14797

从功能价值看，这是今天最有“路线图信号”的 PR。  
它所回应的不是单点 bug，而是用户在流处理场景中的系统性需求：
- CDC 支持
- Upsert 语义
- 批内去重
- DV 在连接器写入链路中的落地方式

这说明 Iceberg 社区正在把更多精力投入到 **实时数据摄取 + 变更合并** 生态中。

---

## 5. Bug 与稳定性

按严重程度排序：

### P1：HTTPClient TLS 主机名校验回归
- **Issue #15598** `[OPEN] [bug] HTTPClient: regression in TLS hostname verification`  
  链接: apache/iceberg Issue #15598

**严重性：高**  
该问题指出 Iceberg 1.10 到即将到来的 1.11 之间，`HTTPClient` 的 TLS 配置可能出现 **hostname verification 回归**。  
这类问题直接影响：
- REST catalog
- 依赖 HTTPS 的服务端集成
- 自定义证书 / 企业内网 TLS 场景

如果属实，其影响不仅是连接失败，还可能涉及 **安全配置行为偏差**。  
**当前未看到明确 fix PR 关联**，建议维护者优先确认并补丁化处理。

### P1：Kafka Connect 多 Topic 路由错误导致跨表写入
- **PR #15639** `[OPEN] [KAFKACONNECT] Fix multi-topic routing to prevent writing all records to all tables`  
  链接: apache/iceberg PR #15639

**严重性：高**  
虽然以 PR 形式出现，但其实对应的是明显的 **数据正确性风险**。  
在多 topic 写多表场景下，如果路由逻辑错误，会导致所有记录被写到所有表。  
**已有 fix PR，建议高优先级推进评审和合并。**

### P2：Spark 启用 SPJ 时查询失败
- **Issue #15602** `[CLOSED] [bug] Spark query failure while using SPJ`  
  链接: apache/iceberg Issue #15602

**严重性：中高**  
用户报告 Spark 在执行 `MERGE` 查询且启用 SPJ 时失败。  
这类问题影响：
- Spark 写路径稳定性
- 合并类 SQL 语句可用性
- 特定优化开关下的执行兼容性

不过该 Issue 已在 3 月 15 日关闭，说明：
- 要么已识别为使用问题；
- 要么已有外部修复/重复问题处理；
- 但从当前数据中 **未看到直接关联修复 PR**，后续仍建议追踪根因归档。

### P3：配置前缀剥离逻辑错误
- **PR #15558** `[OPEN] [spark, parquet, core] Core: fix propertiesWithPrefix to strip prefix literally, not as regex`  
  链接: apache/iceberg PR #15558

**严重性：中**  
属于配置解析正确性问题，可能引发非预期配置失效。  
**已有 fix PR，待合并。**

### P3：REST Fixture Catalog 抛出误导性异常
- **Issue #13915** `[CLOSED] [bug, stale] ... misleading exceptions ...`  
  链接: apache/iceberg Issue #13915

**严重性：中低**  
主要影响测试与开发体验，对生产数据正确性影响有限，但会增加调试成本。  
当前已 stale 关闭，**暂无修复落地信号**。

---

## 6. 功能请求与路线图信号

### 1) Kafka Connect 的 CDC / Upsert / DV 支持很可能进入后续版本重点
- **PR #14797**  
  链接: apache/iceberg PR #14797

这是最明显的路线图信号。若合并，将强化 Iceberg 在以下场景的能力：
- Kafka Connect CDC 摄取
- in-batch dedup
- upsert 模式
- Deletion Vectors 实践化

这与行业对湖仓实时化、增量化写入的需求高度一致，**很可能是下一阶段连接器方向的重点能力**。

### 2) Flink Sink 扩展性建设值得持续关注
- **PR #15316**  
  链接: apache/iceberg PR #15316

该 PR 指向的并非“新 SQL 功能”，而是 **平台能力开放**。  
如果落地，下游开发者可更方便地围绕 IcebergSink 做二次集成，这通常是成熟生态的重要标志。

### 3) V4 Manifest 的格式灵活性是元数据演进信号
- **PR #15634**  
  链接: apache/iceberg PR #15634

支持 V4 下写 Parquet/Avro manifests，说明 V4 不再停留于抽象设计，而是在逐步具备 **可用默认实现与工程化细节**。  
这类 PR 往往是未来大版本演进的前哨。

### 4) 文档与示例环境也在调整
- **PR #14928** `[OPEN] [docs, stale] docs: replace minio with rustfs in quick start`  
  链接: apache/iceberg PR #14928
- **PR #15623** `[OPEN] [docs] Improve benchmark docs page coverage and formatting`  
  链接: apache/iceberg PR #15623

文档方面有两个信号：
- Quick start 可能从 **MinIO 转向 RustFS**
- Benchmark 页面正在补全和规范化

这说明社区正在改善 **上手体验与性能基线可读性**，对新用户很重要。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 内容，可以归纳出几个真实用户痛点：

### 1) 企业集成用户非常关心 TLS/HTTP 行为稳定性
- 参考：**Issue #15598**  
  链接: apache/iceberg Issue #15598

用户并非只关心 SQL 层；在 REST catalog、服务化接入越来越普遍后，**HTTP client 的 TLS 细节** 已成为生产阻断级问题。  
这表明 Iceberg 正从“文件格式/表格式”进一步走向“平台级服务集成组件”，底层网络行为必须更稳定。

### 2) Spark 用户仍在持续遭遇复杂 SQL 与优化开关组合问题
- 参考：**Issue #15602**  
  链接: apache/iceberg Issue #15602

`MERGE INTO`、SPJ、分区过滤、优化器行为等组合场景仍然容易暴露兼容性问题。  
用户真实使用已不再是简单 append，而是复杂 DML 和批改写场景。

### 3) 流式摄取用户要求更强的正确性与去重语义
- 参考：**PR #14797、PR #15639**  
  链接: apache/iceberg PR #14797  
  链接: apache/iceberg PR #15639

Kafka Connect 相关两个 PR 传递出非常明确的需求：
- 不只是“能写入 Iceberg”
- 而是要 **准确路由、支持 CDC、支持 upsert、控制批内重复**

这类需求说明 Iceberg 正越来越多地被用作 **准实时主存表/明细湖仓表**。

### 4) 用户对并发控制模型仍有理解门槛
- 参考：**Issue #13974**  
  链接: apache/iceberg Issue #13974

快照隔离与并发写冲突语义的提问，说明文档还需更多：
- 真实 SQL 案例
- Spark/Flink 对比
- `MERGE INTO` 并发冲突示意

---

## 8. 待处理积压

以下是值得维护者关注的长期未决或存在停滞迹象的条目：

### 1) Kafka Connect Delta Writer / DV 大功能 PR 长期开放
- **PR #14797**  
  链接: apache/iceberg PR #14797

创建于 2025-12-08，至今仍处于开放状态。  
这是高价值功能 PR，但时间跨度较长，建议：
- 明确拆分范围
- 聚焦最小可合并子集
- 避免因设计过大长期悬置

### 2) Flink Sink 扩展性 PR 已出现 stale 信号
- **PR #15316**  
  链接: apache/iceberg PR #15316

该 PR 涉及架构扩展点，价值高但评审成本也高。  
若长期不推进，可能错失 Flink 生态协作者的贡献窗口。

### 3) Quick Start 文档替换 MinIO 为 RustFS 仍未落地
- **PR #14928**  
  链接: apache/iceberg PR #14928

文档不是最高优先级，但它会影响新用户第一印象。  
考虑到 MinIO 已进入 maintenance mode，这项调整具有现实意义。

### 4) TLS hostname verification 回归需尽快补充修复 PR
- **Issue #15598**  
  链接: apache/iceberg Issue #15598

这是当前最值得新增 owner 跟进的问题之一。  
若短期无修复，将对 1.11 前的稳定性预期形成负面影响。

---

## 总体判断

今天的 Apache Iceberg 呈现出一种典型的 **“功能演进活跃、正式发布空窗、稳定性细节需盯紧”** 的状态。  
积极面在于：
- Kafka Connect 与 Flink 生态能力继续增强；
- V4 manifest、配置正确性等底层能力持续推进；
- 文档与基建工具链也在更新。

风险面在于：
- **HTTP/TLS 回归** 这类基础设施问题需快速处理；
- 若干高价值 PR 已长期挂起；
- 并发控制、REST 行为语义等老问题仍在用户侧反复出现。

整体来看，项目健康度仍然良好，但接下来更需要的是 **加速高价值 PR 收敛** 与 **优先修复集成层回归问题**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下为 **Delta Lake（delta-io/delta）2026-03-16 项目动态日报**。

---

# Delta Lake 项目日报（2026-03-16）

## 1. 今日速览

过去 24 小时内，Delta Lake **无 Issue 更新**，说明当天社区问题反馈面相对平稳，没有新增公开故障或用户集中报障。与此同时，**PR 侧有 10 条更新**，其中 **8 条仍处于待合并状态，2 条已关闭**，整体活跃度主要集中在代码变更和功能推进而非问题分流。  
从内容看，当前开发重点聚焦在 **Spark / Kernel-Spark 连接层、过滤下推正确性、UC（Unity Catalog）托管表属性配置、CI 与 catalog 能力扩展**。这表明项目仍处于较积极的迭代期，尤其是在 **查询优化、连接器语义一致性和云目录集成** 上持续打磨。  
综合判断：**项目健康度良好，开发活跃中等偏高，但当天缺少公开 Issue 讨论，社区外部反馈信号偏弱，主要以核心贡献者推进为主。**

---

## 2. 项目进展

### 已关闭/结束的 PR

#### 2.1 修复 Deletion Vector 内联判断中的字符串比较错误
- **PR**: #6265  
- **状态**: CLOSED  
- **链接**: https://github.com/delta-io/delta/pull/6265

**内容概述**  
该 PR 指出 `DeletionVectorDescriptor.isInline()` 中使用了 `==` 比较字符串，而不是使用 `.equals()`。对于 Java/Scala 生态来说，这是典型的值相等与引用相等混淆问题，容易在运行时触发非预期判断。

**技术意义**  
这类问题虽然代码层面较小，但对分析型存储引擎而言属于 **元数据解释正确性** 范畴：  
- 如果 DV（Deletion Vector）是否“内联”被误判，可能影响删除标记的读取路径；
- 进一步可能影响扫描阶段的行可见性判断与存储元数据解释一致性。

**影响判断**  
从问题描述看，这更像是一个 **潜在正确性隐患修复**，属于中低范围但值得尽快处理的稳定性问题。当前 PR 已关闭，但从日报角度应继续关注是否有替代修复进入主线。

---

#### 2.2 为 SSP / REST 客户端引入瞬时失败重试逻辑
- **PR**: #6274  
- **状态**: CLOSED  
- **链接**: https://github.com/delta-io/delta/pull/6274

**内容概述**  
该 PR 试图为 `IcebergRESTCatalogPlanningClient` 增加针对临时性 HTTP 失败的重试逻辑，覆盖网络抖动、`IOException`、5xx 等场景。

**技术意义**  
这类改动直接面向 **远程 catalog/元数据服务可用性**：  
- 能降低查询因短暂网络故障而直接失败的概率；
- 对混合 lakehouse 场景、云上 catalog 集成尤其重要；
- 对 OLAP 查询任务的稳定性和长链路依赖容错有现实价值。

**现状判断**  
虽然该 PR 已关闭，但其暴露出的需求很明确：**Delta 在外部 catalog / REST 元数据交互上的容错能力仍是关注点**。后续很可能会以其他实现方式回归。

---

## 3. 社区热点

> 由于数据中未提供评论数和 reaction 明细，以下“热点”主要依据 **更新时间、主题重要性、对核心能力的影响面** 进行判断。

### 3.1 UC 托管表 checkpoint 统计信息格式配置
- **PR**: #6229  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6229

**主题**  
为 UC managed tables 设置：
- `delta.checkpoint.writeStatsAsJson=false`
- `delta.checkpoint.writeStatsAsStruct=true`

**技术诉求分析**  
这是一个非常明确的 **checkpoint 元数据格式规范化** 信号。背后诉求通常包括：  
- 提升 checkpoint 统计信息的结构化可读性；
- 减少 JSON 形式带来的解析成本或歧义；
- 增强与 UC 管理表、Spark 优化器和下游元数据消费链路的一致性。

**潜在影响**  
这可能影响：
- 统计信息读取方式；
- 查询规划时的文件裁剪/统计推断；
- 与外部工具对 checkpoint 的兼容性预期。

这是当天最值得关注的 PR 之一，因为它触及 **存储元数据表示方式**，可能对性能和兼容性同时产生影响。

---

### 3.2 V2 Connector decimal 过滤下推类型不匹配修复
- **PR**: #6285  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6285

**主题**  
修复 V2 connector 在将带 decimal 字面量的过滤条件下推到 Kernel 时，字面量类型与列声明类型不完全一致导致 evaluator 抛错的问题。

**技术诉求分析**  
这是标准的 **查询正确性 + 连接器兼容性** 问题。  
典型场景：字面量 `100.00` 的内部类型可能是 `Decimal(5,2)`，而列类型是 `Decimal(7,2)`；若 Kernel 要求严格一致，就会导致本可合法执行的谓词在 pushdown 过程中失败。

**潜在影响**  
- 影响 Spark DataSource V2 / Kernel 协同；
- 影响 decimal 谓词的过滤下推可用性；
- 可能造成查询报错、下推回退，甚至结果正确性风险。

对 OLAP 用户而言，这是比一般代码整理更重要的修复方向，因为它直接影响 **SQL 条件表达式在执行链上的语义保真**。

---

### 3.3 非 Spark session catalog 的 stagingCatalog 扩展
- **PR**: #6166  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6166

**主题**  
将 `stagingCatalog` 能力扩展到非 Spark session catalog。

**技术诉求分析**  
这释放出一个清晰路线图信号：Delta 正在增强 **更通用的 catalog 抽象层适配能力**。  
这通常意味着：
- 降低对 Spark 默认 session catalog 的假设；
- 让原子建表/替换表等操作更容易适配不同 catalog 实现；
- 增强与 UC、Iceberg REST、外部元数据系统的互操作。

**为什么值得关注**  
对于企业级 lakehouse 用户，这类工作决定了 Delta 是否能更好地融入多 catalog、跨平台治理体系。

---

### 3.4 临时 UC-main 测试环境建设
- **PR**: #6233  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6233

**主题**  
添加临时 UC-main 测试 setup。

**技术诉求分析**  
这通常不是功能本身，而是 **为更大功能合并做基础设施铺垫**。  
结合 #6166，可以推测维护者正在为涉及 UC / atomic RTAS / catalog 语义的改动补齐测试覆盖，降低合并风险。

---

## 4. Bug 与稳定性

以下按潜在严重程度排序：

### 高优先级：Decimal 谓词下推类型不匹配，可能导致查询失败
- **PR**: #6285  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6285

**问题描述**  
过滤下推时 decimal literal 类型与列类型不精确一致，Kernel evaluator 报错。

**风险等级**  
高。因为它会直接影响：
- 谓词下推是否可执行；
- SQL 查询是否报错；
- Spark V2 connector 与 Kernel 的表达式兼容性。

**是否已有修复**  
有，修复 PR 已提交并处于开放状态。

---

### 中优先级：Deletion Vector 内联状态判断可能失真
- **PR**: #6265  
- **状态**: CLOSED  
- **链接**: https://github.com/delta-io/delta/pull/6265

**问题描述**  
使用字符串引用相等而非值相等判断 `storageType`。

**风险等级**  
中。  
若触发条件成立，可能影响 DV 元数据解释逻辑，进而影响读路径判断。

**是否已有修复**  
有提案，但 PR 当前已关闭，需关注是否另有替代修复。

---

### 中优先级：fetchCatalogPrefix 异常被静默吞掉，影响问题定位
- **PR**: #6273  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6273

**问题描述**  
`fetchCatalogPrefix()` catch 了异常但没有任何 warning 日志，导致故障诊断困难。

**风险等级**  
中。  
该问题不一定直接导致功能错误，但会显著降低：
- catalog 相关问题可观测性；
- 运维排障效率；
- 线上 fallback 行为的可解释性。

**是否已有修复**  
有，PR 已提交，增加 warning log 并保留 fallback。

---

### 中低优先级：REST catalog/SSP 客户端缺少瞬时失败重试
- **PR**: #6274  
- **状态**: CLOSED  
- **链接**: https://github.com/delta-io/delta/pull/6274

**问题描述**  
临时网络故障或 5xx 直接导致请求失败。

**风险等级**  
中低到中，视部署环境而定。云环境、远程 catalog 场景中影响会更大。

**是否已有修复**  
有提案，但当前 PR 已关闭，说明方案尚未进入主线。

---

## 5. 功能请求与路线图信号

虽然当天没有新增 Issue，但从 PR 方向可以观察到较清晰的路线图信号：

### 5.1 下一版本可能继续强化 UC / catalog 集成
- **相关 PR**: #6229, #6233, #6166  
- **链接**:  
  - https://github.com/delta-io/delta/pull/6229  
  - https://github.com/delta-io/delta/pull/6233  
  - https://github.com/delta-io/delta/pull/6166  

**判断依据**  
- UC managed table 的 checkpoint 属性单独配置；
- UC-main 的临时测试基础设施建设；
- stagingCatalog 扩展到非 Spark session catalog。

**路线图信号**  
这表明 Delta 正在向 **更强的统一目录治理、多 catalog 兼容与企业级元数据集成** 方向推进，很可能成为后续版本的重要主题。

---

### 5.2 Kernel-Spark 连接层的表达式与统计信息能力仍在持续补强
- **相关 PR**: #6285, #6101, #6103  
- **链接**:  
  - https://github.com/delta-io/delta/pull/6285  
  - https://github.com/delta-io/delta/pull/6101  
  - https://github.com/delta-io/delta/pull/6103  

**具体方向**
1. **过滤下推正确性修复**（decimal type mismatch）  
2. **`In` 过滤下推支持**  
3. **`estimateStatistics()` 中基于 per-file stats 报告 `numRows`**

**路线图信号**  
这些改动共同指向一个目标：让 Kernel-Spark / V2 connector 在：
- 谓词表达能力，
- 统计信息质量，
- 成本估算与规划能力  
上更接近成熟数据源实现。

这类工作很可能被纳入下一版本，因为它们直接提升 **查询优化器利用 Delta 元数据的能力**。

---

### 5.3 主干版本已切换到 4.2.0-SNAPSHOT
- **PR**: #6256  
- **状态**: OPEN  
- **链接**: https://github.com/delta-io/delta/pull/6256

**意义**  
这通常意味着：
- 新开发周期已经开启；
- 已开始为 4.2.0 收集功能与修复；
- 当前若干开放 PR 有机会进入下一小/中版本范围。

---

## 6. 用户反馈摘要

> 由于过去 24 小时无 Issue 更新，且提供数据中没有评论正文，以下摘要主要基于 PR 描述中的真实使用痛点提炼。

### 6.1 用户最核心痛点集中在“兼容性正确但实现过严”
代表案例是 **decimal 过滤下推**：
- 用户写出的 SQL / DataFrame 条件在语义上是合法的；
- 但连接器/Kernel 对类型一致性要求过于严格，导致报错。  
这说明用户诉求不是“更多功能”，而是 **已有功能在复杂类型系统下更稳地工作**。  
链接：https://github.com/delta-io/delta/pull/6285

### 6.2 企业用户非常在意 catalog 场景的可观测性与可恢复性
从日志补充和 HTTP retry 提案可见，用户在使用外部 catalog / REST 服务时，最痛的不是单点失败本身，而是：
- 失败无法快速定位；
- 暂时性失败没有自动缓冲；
- fallback 发生后不透明。  
这类反馈典型来自生产环境，而不是纯开发测试环境。  
链接：  
- https://github.com/delta-io/delta/pull/6273  
- https://github.com/delta-io/delta/pull/6274

### 6.3 用户希望 Delta 在 UC 和多 catalog 体系中行为更一致
与 UC managed tables、staging catalog、测试基建相关的改动表明，用户场景已不再局限于传统 Spark session catalog，而是更关注：
- 统一治理；
- 原子元数据操作；
- 托管表配置默认值一致性。  
链接：  
- https://github.com/delta-io/delta/pull/6229  
- https://github.com/delta-io/delta/pull/6166  
- https://github.com/delta-io/delta/pull/6233

---

## 7. 待处理积压

以下 PR 创建时间较早、仍未合并，建议维护者重点关注：

### 7.1 #6101 使用 per-file stats 改进 estimateStatistics() 中的 numRows
- **状态**: OPEN  
- **创建时间**: 2026-02-22  
- **链接**: https://github.com/delta-io/delta/pull/6101

**为什么值得关注**  
该改动直接影响统计信息质量，而统计信息又影响：
- CBO；
- 扫描计划；
- join 策略选择。  
对 OLAP 引擎来说，这类优化的收益可能是系统性的。

---

### 7.2 #6103 为 ExpressionUtils 增加 In 过滤下推
- **状态**: OPEN  
- **创建时间**: 2026-02-22  
- **链接**: https://github.com/delta-io/delta/pull/6103

**为什么值得关注**  
`IN` 是高频 SQL 谓词，若下推支持完善，可显著改善：
- 文件裁剪；
- 数据跳过；
- 扫描性能。  
这是典型的“用户感知强、实现价值高”的优化项。

---

### 7.3 #6166 非 Spark session catalog 的 stagingCatalog 扩展
- **状态**: OPEN  
- **创建时间**: 2026-03-02  
- **链接**: https://github.com/delta-io/delta/pull/6166

**为什么值得关注**  
该 PR 很可能是较大功能栈的一部分，若长期悬而未决，可能拖慢：
- UC 相关能力落地；
- atomic RTAS / catalog 行为统一；
- 企业用户采用多 catalog 方案的进度。

---

### 7.4 #6229 UC 托管表 checkpoint 统计信息写出格式调整
- **状态**: OPEN  
- **创建时间**: 2026-03-10  
- **链接**: https://github.com/delta-io/delta/pull/6229

**为什么值得关注**  
该 PR 涉及元数据格式与默认行为，若缺乏明确结论，可能造成：
- 管理表行为预期不清；
- 与现有工具链兼容性评估延后；
- 4.2.0 周期内相关功能栈不易收敛。

---

## 8. 总结判断

今天的 Delta Lake 项目动态呈现出一个典型特征：**外部问题面平静，内部开发面持续推进**。  
短期内最值得关注的是两条主线：

1. **Kernel-Spark / V2 connector 查询正确性与优化能力增强**  
   - decimal 谓词下推修复  
   - `IN` 下推  
   - 基于文件级统计的 `numRows` 估算  
   这直接关系到 Delta 作为 OLAP 数据源时的执行质量。  

2. **UC / 多 catalog 集成能力持续加强**  
   - managed table checkpoint 属性规范  
   - stagingCatalog 扩展  
   - UC 测试基建  
   这说明 Delta 正持续向企业级元数据治理和统一目录体系靠拢。  

整体看，项目处于 **稳定推进、以查询引擎接入与元数据治理为重点的健康状态**。若后续这些开放 PR 在 4.2.0-SNAPSHOT 周期内收敛，Delta Lake 在 **连接器正确性、catalog 集成、统计信息利用** 三个方面都有望获得实质增强。

--- 

如需，我还可以继续把这份日报输出成：
1. **适合飞书/钉钉群发布的简版**  
2. **适合周报汇总的表格版**  
3. **面向 OLAP 内核开发者的技术深读版**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时 Databend 项目整体活跃度中等偏高：**无 Issue 更新**，但 **PR 更新达到 9 条**，且有 **1 个 nightly 版本发布**，说明当前开发重心主要集中在代码提交、功能推进与稳定性修复，而不是社区问题流入。  
从 PR 类型看，今天的变更覆盖了 **查询执行引擎优化、索引读取性能、实验性表分支/标签能力、SQL 正确性修复** 等多个方向，研发节奏较连续。  
已关闭/合并的 4 个 PR 以 **bugfix 和 query refactor** 为主，显示项目近期在持续压实执行层稳定性与查询优化器行为。  
总体来看，项目健康度良好：**主干持续演进，回归修复及时，但外部用户反馈面较安静**，短期内更像是内部迭代驱动的一天。

---

## 2. 版本发布

## 新版本：v1.2.889-nightly
- Release: **v1.2.889-nightly**
- 链接：<https://github.com/databendlabs/databend/releases/tag/v1.2.889-nightly>

### 更新内容
本次 nightly 仅包含 1 项明确列出的修复：

- **fix(query): avoid reinitializing nullable aggregate states during merge**  
  PR 链接：<https://github.com/databendlabs/databend/pull/1>

### 影响分析
该修复指向 **聚合算子在 merge 阶段对 nullable aggregate state 的处理**。这类问题通常会影响：
- 分布式聚合或多阶段聚合的结果正确性；
- `NULL` 参与聚合时的状态合并行为；
- 某些聚合函数在 partial/final merge 中的稳定性与一致性。

### 破坏性变更
- **未观察到发布说明中声明的破坏性变更**。

### 迁移与升级注意事项
- 对 nightly 用户，建议重点回归以下 SQL 场景：
  - 包含 `NULL` 值的 `SUM/AVG/COUNT DISTINCT/聚合状态合并` 类查询；
  - 分布式执行下的聚合结果一致性；
  - 物化中间聚合态再 merge 的查询链路。
- 若生产环境依赖稳定版本而非 nightly，可先在测试环境验证聚合正确性后再跟进。

---

## 3. 项目进展

## 今日已合并/关闭的重要 PR

### 1) 修复运行时过滤器选择率阈值作用域
- PR：#19547  
- 标题：**fix(query): scope runtime filter selectivity to bloom**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19547>

#### 进展意义
该修复将 `join_runtime_filter_selectivity_threshold` 的作用范围**限制到 bloom runtime filter**，同时保留了 **IN-list** 和 **min-max runtime filter** 在某些场景下的可用性。  
这说明 Databend 在运行时过滤器策略上做了更细粒度控制，避免单一阈值误伤其他类型过滤器，提升：
- Join 查询的剪枝稳定性；
- 不同 runtime filter 类型的策略独立性；
- 查询计划在复杂数据分布下的鲁棒性。

---

### 2) 修复大 IN-list 展开导致的表达式树问题
- PR：#19546  
- 标题：**fix: flatten IN-list OR predicates**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19546>

#### 进展意义
该 PR 主要解决：
- 大型 `IN` 列表在高 `max_inlist_to_or` 配置下展开时可能导致**栈溢出**；
- 在规避左深 `OR` 表达式树的同时，**保留 `IN / NOT IN` 的 NULL 语义正确性**。

这属于典型的 **SQL 正确性 + 稳定性** 修复，对以下场景尤其重要：
- BI 工具自动生成超长 `IN (...)` 条件；
- 用户做 ID 批量过滤或半结构化维度筛选；
- 优化器/表达式重写阶段的极端输入防护。

---

### 3) 查询层 hash shuffle 重构
- PR：#19505  
- 标题：**refactor(query): refactor hash shuffle**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19505>

#### 进展意义
虽然这是 refactor，但 hash shuffle 是分布式执行中的核心组件，关系到：
- 数据 repartition 行为；
- Join/Aggregation 等算子的并行执行效率；
- 网络传输与算子均衡。

这类重构通常为后续性能优化、可维护性提升和执行语义统一做铺垫，说明 Databend 在持续打磨分布式 query engine 内核。

---

### 4) SQL 编译/类型检查小修复
- PR：#19550  
- 标题：**fix(sql): add missing SExpr import in type_check.rs**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19550>

#### 进展意义
这是一个较小但直接影响构建/类型检查链路的修复，体现项目对 SQL 编译路径问题保持快速响应。  
虽然影响范围可能有限，但这类修复有助于避免：
- CI/构建失败；
- 类型检查模块的不一致；
- 代码重构后遗留的小型回归。

---

## 4. 社区热点

> 注：今日无 Issue 更新，且提供数据中 PR 的评论数均为 `undefined`、点赞均为 0，因此“最活跃”主要根据**技术影响面与最近更新频率**判断。

### 热点 1：递归 CTE 流式执行改造
- PR：#19545  
- 标题：**[pr-refactor] refactor: make Recursive CTE execution more streaming-oriented**  
- 状态：Open  
- 链接：<https://github.com/databendlabs/databend/pull/19545>

#### 技术诉求分析
该 PR 明确指向 **Recursive CTE 执行模型**，并试图让其更偏向 **streaming-oriented**。这通常反映出当前实现可能存在：
- 中间结果物化过重；
- 内存峰值偏高；
- 对复杂递归查询（摘要中提到 Sudoku query）的支持不足；
- 执行延迟与可扩展性受限。

这是一个高价值方向，意味着 Databend 正在补强更复杂 SQL 语义的执行能力。若后续落地，可能明显提升：
- 图遍历/层级查询支持；
- 递归分析类 SQL 可用性；
- 标准 SQL 兼容度。

---

### 热点 2：小型 Bloom Index 读取优化
- PR：#19552  
- 标题：**[pr-feature] feat: optimize small bloom index reads**  
- 状态：Open  
- 链接：<https://github.com/databendlabs/databend/pull/19552>

#### 技术诉求分析
该 PR 试图通过“**一次性加载可用文件并从同一内存 buffer 解码 metadata 与 filters**”来优化小 Bloom 索引读取路径。  
背后诉求非常明确：
- 降低小文件/小索引对象的 I/O 放大；
- 减少重复读取和解码开销；
- 改善 bloom pruning 与 ngram index 读取链路的一致性。

这类优化对对象存储场景尤其重要，因为小对象读取的请求成本经常高于纯 CPU 解码成本。若合入，预计会改善：
- 选择性过滤查询的延迟；
- 高频小数据块裁剪性能；
- 二级索引在实际负载下的收益兑现。

---

### 热点 3：实验性表分支与标签能力
- PR：#19551  
- 标题：**[pr-feature] feat(query): support experimental table branch**  
- 状态：Open  
- 链接：<https://github.com/databendlabs/databend/pull/19551>

- PR：#19549  
- 标题：**[pr-feature] feat(query): support experimental table tags for FUSE table snapshots**  
- 状态：Open  
- 链接：<https://github.com/databendlabs/databend/pull/19549>

#### 技术诉求分析
这两条 PR 可以结合看，明显指向 Databend 在 **表级版本化/快照引用模型** 上的能力扩展：
- branch：偏向可演进的表状态分支；
- tags：偏向快照锚点与可命名引用。

摘要中提到新实现基于 **KV-backed table tag model**，而不是沿用旧的 table-ref branch/tag 机制，说明项目在做更清晰、更底层一致的数据版本管理抽象。  
这可能服务于：
- 数据实验与回溯；
- 类 Git 的数据分支工作流；
- 快照治理、审计、可重复分析。

这是非常强的路线图信号。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### 高：大 IN-list 展开可能导致栈溢出
- PR：#19546  
- 标题：**fix: flatten IN-list OR predicates**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19546>

#### 风险说明
在高 `max_inlist_to_or` 配置下，大 `IN` 列表展开会形成左深 `OR` 树，可能触发**栈溢出**。  
这是典型的稳定性风险，严重时会造成：
- 查询失败；
- 进程异常；
- 某些自动生成 SQL 的业务不可用。

#### 修复状态
- **已有 fix，PR 已关闭。**

---

### 中高：运行时过滤器阈值误作用，影响剪枝效果
- PR：#19547  
- 标题：**fix(query): scope runtime filter selectivity to bloom**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19547>

#### 风险说明
如果 selectivity threshold 错误作用于 bloom 之外的 runtime filters，可能导致：
- 本应保留的过滤器被抑制；
- Join 剪枝不足；
- 查询性能不稳定，甚至计划行为与预期不一致。

#### 修复状态
- **已有 fix，PR 已关闭。**

---

### 中：聚合 merge 阶段 nullable 状态重复初始化
- Release：v1.2.889-nightly  
- 链接：<https://github.com/databendlabs/databend/releases/tag/v1.2.889-nightly>

#### 风险说明
从发布说明看，该问题涉及 nullable aggregate state 在 merge 阶段的错误处理，潜在影响包括：
- 聚合结果错误；
- 聚合状态丢失或重复初始化；
- 分布式聚合正确性风险。

#### 修复状态
- **已在 nightly 中修复。**

---

### 低：类型检查文件缺少导入导致构建/检查异常
- PR：#19550  
- 标题：**fix(sql): add missing SExpr import in type_check.rs**  
- 状态：Closed  
- 链接：<https://github.com/databendlabs/databend/pull/19550>

#### 风险说明
影响偏工程链路，主要是构建与编译正确性，不属于运行期高危问题。

#### 修复状态
- **已有 fix，PR 已关闭。**

---

## 6. 功能请求与路线图信号

今日无新增 Issue，因此没有来自用户侧的新功能请求文本证据；不过从活跃 PR 可以提炼出较强的路线图信号：

### 1) 递归 SQL 能力继续增强
- PR：#19545  
- 链接：<https://github.com/databendlabs/databend/pull/19545>

**信号判断：高概率纳入后续版本。**  
原因是该 PR 明确关联已有问题背景（摘要中引用 issue `#18237`），且涉及递归 CTE 这类基础 SQL 能力短板补齐。  
若成功合并，Databend 在复杂分析 SQL、图式递归查询上的能力会有明显提升。

---

### 2) 表级 branch/tag 能力正在成体系推进
- PR：#19551  
- 链接：<https://github.com/databendlabs/databend/pull/19551>
- PR：#19549  
- 链接：<https://github.com/databendlabs/databend/pull/19549>

**信号判断：非常强，可能分阶段进入实验特性。**  
从“experimental”表述和 branch/tag 成对推进看，这不是孤立特性，而是一个更大的**数据版本控制/快照引用模型**建设。  
预计会率先以实验特性进入 nightly 或后续小版本，再逐步完善语义和元数据模型。

---

### 3) 存储索引读取链路继续做对象存储友好优化
- PR：#19552  
- 链接：<https://github.com/databendlabs/databend/pull/19552>

**信号判断：较可能进入近期版本。**  
Bloom index 读取优化是典型的“收益明确、风险可控”的性能 PR，尤其适合快速落地到后续 nightly/stable。  
这类优化通常不会引入 SQL 语义变化，但对实际查询性能改善直接。

---

### 4) 元数据与依赖整合持续推进
- PR：#19513  
- 标题：**chore: upgrade databend-meta to v260304.0.0 and consolidate dependencies**  
- 状态：Open  
- 链接：<https://github.com/databendlabs/databend/pull/19513>

**信号判断：中等偏高。**  
该 PR 虽属 chore，但涉及 databend-meta 版本升级与依赖整合，可能为后续元数据接口统一、crate 边界清理和维护成本下降铺路。

---

## 7. 用户反馈摘要

今天 **没有 Issue 更新**，因此缺乏新的直接用户评论、故障复现或场景描述。  
不过从 PR 摘要中仍可间接提炼出近期用户/使用场景痛点：

### 1) 自动生成 SQL 的复杂条件表达式容易触发极端执行问题
- 相关 PR：#19546  
- 链接：<https://github.com/databendlabs/databend/pull/19546>

**推测场景**：BI 报表、应用侧批量筛选、大规模 ID 过滤。  
**痛点**：超长 `IN` 列表会给优化器/表达式重写带来压力，影响稳定性与语义一致性。

---

### 2) 用户对 Join 剪枝和运行时过滤性能较敏感
- 相关 PR：#19547  
- 链接：<https://github.com/databendlabs/databend/pull/19547>
- 相关 PR：#19552  
- 链接：<https://github.com/databendlabs/databend/pull/19552>

**推测场景**：大表 Join、选择性过滤、对象存储上的分析负载。  
**痛点**：过滤器策略若过粗，会影响剪枝效果；索引读取若存在冗余 I/O，会放大长尾延迟。

---

### 3) 高级 SQL 语义支持仍在被持续补强
- 相关 PR：#19545  
- 链接：<https://github.com/databendlabs/databend/pull/19545>

**推测场景**：递归层级查询、复杂图式分析、标准 SQL 迁移。  
**痛点**：用户希望 Databend 不仅“快”，还要能稳定执行更复杂、更标准的 SQL。

---

## 8. 待处理积压

> 今日没有 Issue 可用于识别长期未响应问题，以下仅根据仍处于打开状态且值得关注的 PR 进行维护提示。

### 1) Recursive CTE 流式化改造值得优先评审
- PR：#19545  
- 创建时间：2026-03-12  
- 状态：Open  
- 链接：<https://github.com/databendlabs/databend/pull/19545>

**关注原因**：  
涉及 SQL 能力边界与执行模型升级，技术价值高，且可能影响较大范围的执行逻辑。建议维护者尽快给出：
- 正确性验证结论；
- 内存/性能 benchmark；
- 对递归终止与循环检测的说明。

---

### 2) experimental table branch / tags 应统一评审口径
- PR：#19551  
- 链接：<https://github.com/databendlabs/databend/pull/19551>
- PR：#19549  
- 链接：<https://github.com/databendlabs/databend/pull/19549>

**关注原因**：  
二者明显属于同一特性面，若分别推进但缺少统一设计说明，后续可能出现：
- SQL 语义不一致；
- 元数据模型重复；
- 用户认知成本上升。

建议维护者从路线图层面明确：
- branch/tag 的语义边界；
- 与 snapshot、time travel、table-ref 的关系；
- 实验特性的开关与兼容策略。

---

### 3) databend-meta 升级 PR 需防止拖成长期积压
- PR：#19513  
- 链接：<https://github.com/databendlabs/databend/pull/19513>

**关注原因**：  
依赖整合和 meta 升级如果长期悬而未决，容易造成后续 PR 冲突增加，也会提高代码基线维护成本。  
建议尽快确认：
- 升级兼容性；
- crate 边界调整是否稳定；
- 是否需要拆分成更小 PR 便于合并。

---

## 总结

Databend 今日呈现出明显的**工程推进型活跃**：没有新的用户问题涌入，但核心研发在查询执行、表达式稳定性、运行时过滤、索引读取优化和实验性数据版本能力上持续推进。  
已关闭 PR 主要集中在 **正确性与稳定性修复**，而打开中的 PR 则透露出中短期路线图：**Recursive CTE、表分支/标签、对象存储友好的索引优化**。  
从项目健康度看，Databend 当前处于**持续迭代、稳定性修补和能力扩边并行**的良好状态。

如果你愿意，我还可以把这份日报继续整理成：
1. **适合飞书/Slack 发布的简版**  
2. **适合公众号/博客的长版周报风格**  
3. **Markdown 表格版（便于直接粘贴到内部日报系统）**

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时，Velox 社区整体活跃度 **中高**：共有 **20 条 PR 更新**、**1 条 Issue 更新**，但 **无新版本发布**。  
从变更结构看，今日工作重心主要集中在 **代码整理、性能优化、CI 基础设施、Iceberg/DWRF 存储路径增强，以及 Spark/Gluten 兼容性修复**。  
已合并/关闭的 PR 数量不多（3 条），但待合并 PR 中包含多项 **ready-to-merge** 的实质性改进，说明项目处于 **持续推进、待集中落地主线能力** 的状态。  
同时，新的 Spark 时间戳类型需求与一系列 time/type 扩展准备工作相呼应，释放出 **SQL 类型系统和跨引擎兼容性将继续演进** 的路线信号。

---

## 3. 项目进展

### 已合并/关闭的重要 PR

#### 1) 向 VectorSerde 暴露 serde 名称，改善组件可发现性与集成可维护性
- **PR**: #16772 `refactor: Add name getter to VectorSerde classes`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16772

该 PR 为 `PrestoVectorSerde`、`CompactRowVectorSerde`、`UnsafeRowVectorSerde` 增加了公开 `name()` 方法，使调用方可以直接获取 serde 类型标识，而不必硬编码字符串。  
这类改动虽偏重构，但对 **多序列化格式并存** 的场景很重要，尤其是在：
- 查询引擎接入层做 serde 注册/识别；
- 测试与监控中输出标准化 serde 名称；
- 减少因字符串字面量不一致导致的隐式兼容性问题。

这属于 **接口规范化和工程可维护性增强**，对后续扩展更多行/列式 serde 也有正向作用。

---

#### 2) 修复网站 pre-commit lint 问题，保障开发流程稳定
- **PR**: #16773 `fix: Build pre-commit lint issues in website files`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16773

此 PR 修复了官网/文档站点文件中的格式问题（缺失换行、尾随空格）。  
虽然不涉及查询执行引擎本身，但它直接影响：
- 提交前检查通过率；
- 文档/官网修改的开发体验；
- CI 噪音与维护成本。

说明项目在继续清理 **非核心代码路径中的工程阻塞项**。

---

#### 3) 修复 StreamArena 中无效的前置自增表达式
- **PR**: #16717 `fix: Fix redundant prefix increment before assignment in StreamArena`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16717

该改动将 `++currentOffset_ = 0` 简化为 `currentOffset_ = 0`，消除了一个逻辑上无意义的自增操作。  
这类修复虽小，但反映出维护者对 **底层内存/流式分配组件** 的代码质量控制较严格。对于分析型执行引擎而言，底层 arena/allocator 代码的可读性和确定性尤为重要。

---

### 待合并但值得重点关注的 PR

#### 4) Iceberg equality delete 引入 sequence number 冲突解析
- **PR**: #16775 `Add sequence number conflict resolution for equality deletes`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16775

这是今日最重要的存储语义增强之一。该 PR 按照 **Iceberg V2+ 规范**，仅将 equality delete 文件应用到 `data sequence number` 严格小于 delete 文件的数据文件上。  
技术意义：
- 避免并发写入场景中错误删除“新数据”；
- 提升 Velox 作为 Iceberg 读取/执行层时的 **事务语义正确性**；
- 对湖仓查询一致性尤为关键。

这类改动属于 **正确性优先级很高** 的增强，预计较有机会进入下一轮重要集成版本。

---

#### 5) 预加载 lazy probe 输入，降低 Hash Join/Probe 路径中的 reclaim 风险
- **PR**: #16774 `fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16774

该修复将 lazy loading 集中到主 probe 循环之前，并通过 `maybeReserve` + `ReclaimableSectionGuard` 给 arbitrator 留出回收时机。  
从摘要看，它针对的是 **内存回收与非 reclaimable probe loop** 之间的时序问题，属于执行期稳定性修复，影响场景可能包括：
- Hash Join probe；
- 懒加载列在高压内存下的批量访问；
- 分布式 Hive/Spark 读路径中的 reclaim 失败。

这是一个典型的 **高价值稳定性修复**，建议维护者优先审查。

---

#### 6) DWRF 小文件预加载能力扩展到 Direct/Cached BufferedInput
- **PR**: #16768 `feat: Add native preload support to DirectBufferedInput and CachedBufferedInput`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16768

该 PR 将“小文件一次性预读”能力从基础 `BufferedInput` 扩展到 `DirectBufferedInput` 与 `CachedBufferedInput`。  
技术收益主要包括：
- 对小型 DWRF 文件减少 footer + stripe 分离 IO；
- 降低元数据/数据多次读取带来的延迟；
- 提升冷读或缓存穿透场景下的读取效率。

这是比较典型的 **分析型存储读路径优化**，对高并发小文件工作负载很有价值。

---

#### 7) Unicode truncate 路径 SIMD 优化
- **PR**: #16428 `perf: Optimize cappedLengthUnicode and cappedByteLengthUnicode with SIMD`
- **状态**: ready-to-merge
- **链接**: facebookincubator/velox PR #16428

该 PR 加速了 Iceberg truncate 热路径中的 Unicode 长度判断逻辑。  
如果落地，将对以下场景形成直接收益：
- 非 ASCII 字符串截断；
- Iceberg 分区/规范化处理；
- 字符串处理热点中的 CPU 降耗。

这表明 Velox 持续在 **低层字符串向量化优化** 上投入，符合 OLAP 引擎性能演进方向。

---

#### 8) 结果计数不再物化全部数据，降低测试内存占用
- **PR**: #16462 `perf(test): Count result rows without accumulating the data`
- **状态**: ready-to-merge
- **链接**: facebookincubator/velox PR #16462

虽然属于测试基础设施，但它改进了 `AssertQueryBuilder` / `QueryAssertions` 的结果统计方式，实现按 batch 计数而非全量缓存。  
对项目意义在于：
- 大结果集测试更稳；
- CI 内存压力下降；
- 有助于编写更接近真实大数据场景的回归测试。

---

## 4. 社区热点

> 说明：给定数据中评论数与点赞数整体较低，大多数条目 `comment` 未提供，因此本节以“技术重要性 + 当日更新热度”综合判断。

### 热点 1：Spark 新时间戳表示需求
- **Issue**: #16776 `[enhancement] [Spark] Add new Timestamp represents microseconds`
- **状态**: Open
- **链接**: facebookincubator/velox Issue #16776

这是当天唯一的新 Issue，也是最明确的功能诉求。  
核心问题是：**Spark Timestamp 使用 `int64_t` 微秒表示，而 Velox 当前沿用 Presto 风格 `int128_t` Timestamp**。在 Gluten shuffle 场景下，为了兼容 reducer 反序列化，不得不写出 `int128_t`，引入了额外数据体积和潜在兼容复杂度。

背后的技术诉求包括：
- 降低 Spark/Gluten 生态中的序列化开销；
- 改善跨引擎时间类型映射；
- 推动 Velox 时间类型体系从单一表示向多精度/多语义方向演进。

这与下面的 PR #16662 高度呼应，说明 **时间类型扩展正逐步从准备阶段进入实际需求驱动阶段**。

---

### 热点 2：Time 类型扩展前置准备
- **PR**: #16662 `misc: Prepare for time type extension`
- **状态**: ready-to-merge
- **链接**: facebookincubator/velox PR #16662

该 PR 明确提到是为扩展 time type、支持更多精度和时区行为做准备。  
结合 Issue #16776 可判断，Velox 类型系统近期的重点之一是：
- 扩展时间/时间戳精度；
- 调整 SQL 行为兼容边界；
- 保证现有功能在过渡期不被破坏。

这类“准备型 PR + 立即出现用户需求”的组合，通常意味着后续会有一系列相关改动持续进入主干。

---

### 热点 3：Iceberg 删除语义正确性增强
- **PR**: #16775 `Add sequence number conflict resolution for equality deletes`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16775

湖仓场景下，删除文件和数据文件的时序关系非常关键。  
这项改动反映出 Velox 正在补强 **Iceberg V2 级别的细粒度语义正确性**，而不仅仅是“能读能跑”。这对下游使用 Velox 作为查询层、执行层的系统是重要信号。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：懒加载 probe 输入与内存回收时序冲突，可能引发执行期错误
- **PR**: #16774 `fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop`
- **状态**: 已有 fix PR
- **链接**: facebookincubator/velox PR #16774

这是今天最值得关注的稳定性问题。  
从描述看，问题发生在 probe 主循环内零散触发 lazy loading，而该阶段又是 non-reclaimable section，导致 arbitrator 难以及时回收内存，最终可能引发失败。  
影响面可能涉及：
- Join probe 热路径；
- 惰性列加载；
- 内存紧张的生产查询。

**结论**：已有修复 PR，建议优先合并。

---

### P2：`cast(sum(decimal(...)) as float)` 与 Spark 结果存在精度偏差
- **PR**: #16588 `fix: Fix cast sum(decimal(18,4)) to float precision miss`
- **状态**: ready-to-merge
- **关联**: Fix #16586
- **链接**: facebookincubator/velox PR #16588

这是典型的 **查询正确性 / SQL 兼容性 bug**。  
问题集中在 decimal 聚合后再 cast 到 float 的结果与 Spark 不一致，摘要里给出了可复现 SQL，说明：
- 问题对 Gluten + Velox 用户较现实；
- 兼容 Spark 的数值语义仍是重点打磨方向；
- 若不修复，可能在财务/统计报表中造成细微但不可接受的偏差。

**结论**：已有 fix PR，且较接近可合并状态。

---

### P3：网站 lint/提交流程问题影响 CI 通过率
- **PR**: #16773 `fix: Build pre-commit lint issues in website files`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16773

这是流程稳定性而非运行时稳定性问题，但对开发效率有直接影响。已解决。

---

### P4：StreamArena 中无效前置自增，属于低风险代码质量缺陷
- **PR**: #16717 `fix: Fix redundant prefix increment before assignment in StreamArena`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16717

影响较低，但已清理，属于底层代码健康度提升。

---

### 实验性风险项：故意破坏测试以验证 CI 测试发现机制
- **PR**: #16771 `Break LimitTest to test CI test discovery`
- **状态**: Open，且明确 “DO NOT LAND”
- **链接**: facebookincubator/velox PR #16771

这是一个刻意制造失败用例的实验 PR，不应合并。  
它反映维护者正在验证 GitHub CI 对单测失败粒度的报告能力，说明项目在继续改善 **测试可观测性**。

---

## 6. 功能请求与路线图信号

### 1) Spark 微秒级 Timestamp 表示
- **Issue**: #16776
- **链接**: facebookincubator/velox Issue #16776

这是今天最明确的新功能请求。  
诉求不只是新增一个类型，更是：
- 缩小 Spark 与 Velox 时间戳内部表示差异；
- 降低 Gluten shuffle 序列化膨胀；
- 让 Spark 生态下的反序列化更自然。

**路线判断**：  
结合 PR #16662（time type extension 准备）来看，这类需求 **很可能被纳入近期版本规划**，至少会推动时间类型抽象进一步泛化。

---

### 2) 更完整的 Time/Timestamp 类型体系扩展
- **PR**: #16662
- **链接**: facebookincubator/velox PR #16662

该 PR 不是终态功能，而是为后续扩展铺路。  
说明 Velox 在类型系统上的演进目标可能包括：
- 多精度 time/timestamp；
- 可能的 timezone 语义扩展；
- 降低 Presto 历史类型模型对 Spark/其他引擎兼容的约束。

---

### 3) Iceberg 读取与删除语义进一步完善
- **PR**: #16775、#16746
- **链接**: facebookincubator/velox PR #16775
- **链接**: facebookincubator/velox PR #16746

一项是 equality delete sequence number 解析，一项是 `PositionalDeleteFileReader` 注释和接口修正。  
这组信号说明 Velox 正在继续加深对 **Iceberg delete files** 相关能力的建设，不仅是实现功能，也在提升代码可维护性。

---

### 4) GPU / cuDF 集成持续推进
- **PR**: #15700 `feat(cudf): Run tests in CI`
- **PR**: #16752 `feat(cudf): Update cudf and related dependency pins to 2026-03-12`
- **链接**: facebookincubator/velox PR #15700
- **链接**: facebookincubator/velox PR #16752

这表明 cuDF 路线仍在推进：
- 一边补齐 CI 测试能力；
- 一边跟进上游 RAPIDS 依赖变更。

**路线判断**：  
GPU 加速相关集成虽然节奏不算快，但依旧是活跃方向，尤其适合高吞吐分析执行场景。

---

## 7. 用户反馈摘要

基于今日新增/活跃条目，可以提炼出以下真实用户痛点：

### 1) Spark/Gluten 兼容场景下，时间戳表示过重
- **来源**: Issue #16776
- **链接**: facebookincubator/velox Issue #16776

用户明确指出 Spark Timestamp 是 `int64_t` 微秒表示，而 Velox 当前使用更重的 `int128_t` 表示，导致 Gluten shuffle 中：
- 写出数据更大；
- 序列化与反序列化链路更绕；
- 兼容性处理成本上升。

这说明在实际生产集成中，用户对 **跨引擎数据表示统一** 非常敏感，不只是功能可用，还关心数据体积和序列化效率。

---

### 2) Spark 对齐仍是 SQL 语义修复的重要来源
- **来源**: PR #16588
- **链接**: facebookincubator/velox PR #16588

从 decimal sum 再 cast float 的修复可以看出，用户正在使用 Velox 跑与 Spark 对齐的 SQL，并会对细粒度精度差异进行验证。  
这类反馈说明 Velox 在作为 **Spark 替代/加速执行层** 时，兼容性门槛已提升到“数值语义级别”。

---

### 3) 内存回收与 lazy load 交互是复杂生产场景中的痛点
- **来源**: PR #16774
- **链接**: facebookincubator/velox PR #16774

摘要中的调用栈暗示问题并非理论上的边角异常，而是实际查询中暴露出的执行稳定性问题。  
用户/维护者关注点已经从单纯性能，转向：
- reclaim 时机；
- 非 reclaimable 区段设计；
- lazy vector 的批量加载策略。

这说明 Velox 正在面对更复杂、资源受限的真实工作负载。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或高价值待处理 PR：

### 1) cuDF CI 测试接入长期未落地
- **PR**: #15700 `feat(cudf): Run tests in CI`
- **创建时间**: 2025-12-04
- **状态**: Open, ready-to-merge
- **链接**: facebookincubator/velox PR #15700

这是明显的长期积压项。  
若 GPU 路线仍是战略方向，CI 测试接入应尽快完成，否则后续 cuDF 相关功能会持续缺少稳定保障。

---

### 2) semiJoin 随机 RowVector 生成改造长期未合并
- **PR**: #15748 `fix: Use VectorFuzzer for random RowVector generation in semiJoinDeduplicateResetCapacity`
- **创建时间**: 2025-12-11
- **状态**: Open
- **链接**: facebookincubator/velox PR #15748

该 PR 旨在用 `VectorFuzzer` 替换 `rand()`，改进测试随机性和可重复性。  
虽然不是高优先级功能，但长时间未处理会影响测试质量治理的一致性。

---

### 3) MarkDistinct Fuzzer 仍在等待推进
- **PR**: #16600 `feat: Add MarkDistinct Fuzzer`
- **创建时间**: 2026-03-02
- **状态**: Open
- **链接**: facebookincubator/velox PR #16600

这是一个很有价值的正确性测试增强项，采用 Velox 与 DuckDB 的多层比较。  
考虑到 MarkDistinct 涉及去重与聚合语义，这种 fuzzer 对防止回归很有意义，建议尽快推进。

---

### 4) 一批 ready-to-merge PR 集中待处理
- **PRs**: #16428, #16462, #16565, #16588, #16662, #16667, #16687, #16720, #16746
- **链接**:
  - facebookincubator/velox PR #16428
  - facebookincubator/velox PR #16462
  - facebookincubator/velox PR #16565
  - facebookincubator/velox PR #16588
  - facebookincubator/velox PR #16662
  - facebookincubator/velox PR #16667
  - facebookincubator/velox PR #16687
  - facebookincubator/velox PR #16720
  - facebookincubator/velox PR #16746

这说明维护队列中已有一批成熟改动等待最终处理。  
若能尽快合并，将同时改善：
- 字符串路径性能；
- 测试内存效率；
- Spark 数值兼容性；
- time 类型扩展准备；
- CI 基础设施；
- Iceberg 代码可维护性。

---

## 健康度结论

Velox 今日整体健康度表现为 **稳健偏积极**：

- **活跃度**：PR 更新密集，开发节奏正常；
- **工程质量**：持续清理重构、lint、测试与底层代码细节；
- **功能演进**：Iceberg、DWRF、Time 类型、cuDF 等方向均有推进；
- **风险点**：Spark 兼容性与执行期内存/懒加载稳定性仍是近期重点风险区；
- **维护建议**：优先处理 #16774、#16588、#16775、#16662 等对正确性和路线影响较大的 PR。

如果你愿意，我还可以继续把这份日报转成：
1. **适合飞书/Slack 发布的简版摘要**，或  
2. **按“查询引擎 / 存储 / 兼容性 / CI”分类的管理视图**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时 Apache Gluten 保持中高活跃度：**4 条 Issue 更新、11 条 PR 更新**，其中 **8 个 PR 处于待合并状态，3 个 PR 已关闭**。  
今日没有新版本发布，但从 PR 内容看，项目正在围绕 **Velox 后端能力补齐、Spark 兼容性修复、Iceberg 元数据正确性、仓库 TLP 毕业后的基础设施清理** 持续推进。  
Issue 侧的关注点较集中：一类是 **实际生产性能问题**，例如 S3 读取随 executor.cores 增大而恶化、简单 `LIMIT` 查询性能显著落后于 Vanilla Spark；另一类是 **GPU shuffle reader** 等前沿能力诉求。  
整体来看，项目健康度稳定，且信号明确：**近期重点仍是 Velox 生态整合、查询兼容性验证、以及面向生产场景的性能稳定性优化**。

---

## 3. 项目进展

### 已关闭 / 已完成的重要 PR

#### 1) 更新 GitHub CI 工作流以适配 TLP 毕业
- **PR**: #11741 `Update GitHub CI workflows for TLP graduation`
- **状态**: Closed
- **链接**: apache/gluten PR #11741

该 PR 完成了 GitHub CI 工作流与模板中从 `incubator-gluten` 到 `gluten` 的引用切换，属于项目从孵化器毕业后的必要基础设施收尾工作。  
这类修改虽然不直接影响查询执行性能，但对 **CI 稳定性、贡献流程、Issue/PR 模板一致性** 非常关键，可减少链接失效、自动化脚本异常和贡献者入口混乱。

#### 2) 移除源码中的 Incubating 相关表述
- **PR**: #11737 `Remove Incubating references from source code`
- **状态**: Closed
- **链接**: apache/gluten PR #11737

该 PR 清理了源码和文档中残留的 “Incubating” 表述，进一步完成 TLP 毕业后的品牌与文档统一。  
对外部用户而言，这有助于减少下载地址、文档路径、依赖引用的歧义；对内部维护而言，则降低了后续文档维护成本。

#### 3) Daily Update Velox Version (2026_03_13)
- **PR**: #11755 `[VL] Daily Update Velox Version (2026_03_13)`
- **状态**: Closed
- **链接**: apache/gluten PR #11755

这是常规的 Velox 上游同步 PR。虽然摘要中未明确写明“合并”还是“关闭未合并”，但从项目节奏看，**持续跟踪并对齐 Velox 上游** 仍是 Gluten 的核心维护动作之一。  
该类 PR 对 Gluten 的意义在于：  
- 持续吸收上游执行引擎优化；  
- 缩短功能差距；  
- 为后续 SQL 能力、算子行为、序列化/写入路径改进打基础。

---

### 待合并但值得关注的关键 PR

#### 4) 增加关闭 TimestampNTZ 校验回退的配置
- **PR**: #11720 `[GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback`
- **状态**: Open
- **链接**: apache/gluten PR #11720

这是今天最值得关注的 SQL 兼容性推进之一。当前 Velox 后端在校验阶段将 `TimestampNTZType` 视为不支持，导致查询回退到 Spark，阻碍相关功能开发和验证。  
该 PR 引入了一个配置项，让开发者可以 **关闭该校验回退**，并补充了 `localtimestamp()` 测试。  
意义在于：
- 为 `TimestampNTZ` 相关表达式能力逐步放开验证；
- 降低“明明执行逻辑可行，却被 validator 提前拦截”的开发摩擦；
- 有望加速 Spark SQL 时间类型兼容性完善。

#### 5) 为 CurrentTimestamp / now(foldable) 增加验证测试
- **PR**: #11656 `[GLUTEN-1433] [VL] Add validation tests for CurrentTimestamp and now(foldable)`
- **状态**: Open
- **链接**: apache/gluten PR #11656

该 PR 主要补足 `CurrentTimestamp` 与 `now` 在 foldable 场景下的验证测试。  
它释放出的信号是：项目并非只关注“是否能跑”，而是在补齐 **Spark planner 与 Velox backend 之间表达式语义一致性**。这类测试建设是后续减少回归、提升 SQL 兼容性的关键。

#### 6) 修复 Iceberg 上 `input_file_name()` 及相关元数据函数
- **PR**: #11615 `[GLUTEN-11513][VL][Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation`
- **状态**: Open
- **链接**: apache/gluten PR #11615

这是今天最重要的功能/稳定性修复候选之一。该 PR 同时涉及：
- `input_file_name()`
- `input_file_block_start()`
- `input_file_block_length()`
- JNI 初始化稳定性
- 元数据透传

这说明 Gluten 在 **Data Lake 场景（尤其 Iceberg）** 中，已从纯算子加速逐步深入到 **文件级元数据正确性与 JNI 边界稳定性**。如果合入，将显著提升 Iceberg 用户在调试、审计、数据追踪类查询中的可用性和可靠性。

#### 7) 修复列式写优化下 AdaptiveSparkPlanExec 可访问性问题
- **PR**: #11753 `[GLUTEN-11752] Fix AdaptiveSparkPlanExec accessibility in columnar write optimization`
- **状态**: Open
- **链接**: apache/gluten PR #11753

该 PR 修复了 Spark 上游变更引入的兼容性问题：在列式写优化场景下，Gluten 获取 shuffle IDs 的方式被 Spark PR #51432 影响。  
这属于典型的 **“Spark 上游演进 -> Gluten 适配修复”** 类型工作，对生产用户非常重要，因为它直接关系到：
- AQE 相关路径是否稳定；
- 列式写优化是否能继续工作；
- 升级 Spark 后是否发生功能回退。

#### 8) 仓库路径与引用迁移总清理
- **PR**: #11735 `Update repository references from incubator-gluten to gluten after TLP graduation`
- **状态**: Open
- **链接**: apache/gluten PR #11735

这是一个覆盖面广的基础设施与文档清理 PR，涉及 CORE、VELOX、INFRA、TOOLS、CLICKHOUSE、DOCS、DATA_LAKE、FLINK 等多个模块。  
它虽然不是引擎能力增强，但对 **构建脚本、文档导航、子项目引用、自动化工具链** 的一致性非常重要，预计会在近期进入合并窗口。

---

## 4. 社区热点

### 热点 1：Velox 上游有价值 PR 跟踪
- **Issue**: #11585 `[VL] useful Velox PRs not merged into upstream`
- **评论**: 16
- **👍**: 4
- **链接**: apache/gluten Issue #11585

这是当前最活跃的讨论帖。它集中跟踪 Gluten 社区提交到 Velox、但尚未被上游合并的有价值 PR。  
背后技术诉求很明确：**Gluten 的很多能力建设依赖 Velox 上游演进速度**，但社区又不希望在 `gluten/velox` 上长期维持大量私有 patch，因为 rebase 成本很高。  
这反映出两个现实：
1. Gluten 与 Velox 的协同深度很高；
2. 某些关键能力推进仍受制于上游合并节奏。

这类 tracker 对路线图判断非常重要：如果某能力长期停留在这里，说明其短期内可能仍需 workaround，而不是正式版本能力承诺。

---

### 热点 2：S3 读取性能在大核数 executor 下显著变差
- **Issue**: #11765 `[VL] AWS S3 read performance is very bad when executor.cores are big`
- **链接**: apache/gluten Issue #11765

这是今天最值得重视的生产性能反馈之一。Issue 中提供了多组参数实验，包括：
- executors × cores
- IOThreads
- loadQuantum
- maxCoalescedBytes
- maxCoalescedDistanceBytes
- prefetchRowGroups
- SplitPreloadPerDriver
- elapsed

问题表明：**随着 executor.cores 增大，S3 读性能未线性提升，反而可能恶化**。  
这通常意味着以下潜在瓶颈之一：
- S3 远端 IO 并发模型与线程配置不匹配；
- Velox/Gluten 的预取、合并读取、row group preload 参数在高并发下出现资源争抢；
- task 并发、driver preload、对象存储吞吐和 CPU 调度之间存在结构性失衡。

对云上 Lakehouse 用户来说，这是高优先级问题，因为它直接影响到 **对象存储场景下的横向扩展收益**。

---

### 热点 3：简单 `select ... limit ...` 查询比 Vanilla Spark 慢 10 倍以上
- **Issue**: #11766 `[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`
- **链接**: apache/gluten Issue #11766

这是另一个非常典型、且用户感知极强的性能问题。`LIMIT` 小结果集查询本应是加速引擎展示“低延迟”的场景，但用户反馈 Gluten 比 Vanilla Spark 慢 10 倍以上。  
这类问题通常指向：
- 任务裁剪不足；
- 计划下推/早停策略没有生效；
- scan / limit 协同执行策略不理想；
- 轻量查询被 JNI、初始化、线程调度等固定成本淹没。

如果问题被复现并确认，这会影响用户对 Gluten 的“默认收益预期”，因为很多交互式分析、BI 探查、SQL 调试都依赖快速返回的小结果集查询。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：简单 `LIMIT` 查询性能异常退化
- **Issue**: #11766
- **状态**: Open
- **链接**: apache/gluten Issue #11766
- **是否已有 fix PR**: 暂无直接关联 PR

影响面很大。`select * ... limit 10` 是最基础查询之一，如果在该路径上比 Vanilla Spark 慢 10 倍以上，说明 Gluten 在 **短查询、早停、任务规划或固定开销控制** 上可能存在系统性问题。  
建议维护者优先确认：
- 是否只影响 Velox 后端；
- 是否与文件源、表格式、AQE、分区数相关；
- 是否存在“只生成一个 task 的 Spark vs 多 task 的 Gluten”计划差异。

---

### P1：AWS S3 在大 executor.cores 配置下读取性能差
- **Issue**: #11765
- **状态**: Open
- **链接**: apache/gluten Issue #11765
- **是否已有 fix PR**: 暂无直接关联 PR

这是典型的生产环境吞吐/扩展性问题。对对象存储用户而言，规模放大后性能下降比单点 bug 更危险，因为它会误导资源规划和成本预估。  
建议后续关注是否会出现：
- IO scheduler 调优 PR；
- S3 读取并发模型优化；
- Velox 文件扫描/预取参数自动调优相关改动。

---

### P2：Iceberg 元数据函数正确性与 JNI 初始化稳定性
- **PR**: #11615
- **状态**: Open
- **链接**: apache/gluten PR #11615
- **关联问题**: #11513

虽然今天没有对应新 Issue，但从 PR 内容判断，这属于 **已识别并正在修复的正确性/稳定性问题**。  
如果不修复，影响可能包括：
- `input_file_name()` 等函数结果不正确；
- 元数据字段无法正确透传；
- JNI 初始化路径潜在崩溃。

这类问题对 Data Lake 场景用户非常敏感，尤其是依赖文件粒度血缘、审计和排障的团队。

---

### P2：列式写优化与 Spark 新版本兼容性问题
- **PR**: #11753
- **状态**: Open
- **链接**: apache/gluten PR #11753
- **是否已有问题单**: 已关联 `GLUTEN-11752`

这属于升级兼容型问题。虽然用户未通过 Issue 明确反馈，但从描述看，若不修复，可能导致列式写优化路径在某些 Spark 新版本上失效或行为异常。  
对正在跟进 Spark 新版本的用户来说，建议跟踪该 PR 合入进度。

---

## 6. 功能请求与路线图信号

### 1) GPU Shuffle Reader 支持
- **Issue**: #10933 `[VL] Support GPU shuffle reader`
- **状态**: Open
- **链接**: apache/gluten Issue #10933

这是明确的新能力诉求，且技术目标比较具体：
- 把锁从 `WholeStageResultIterator` 构造函数迁移到 shuffle reader；
- 提前准备首批数据；
- 在 CPU 侧完成解压与 batch resize，再转到 GPU；
- 面向大 batch（可达 1GB）优化处理链路。

这说明社区中已经有人在探索 **GPU 加速与 Gluten/Velox 执行链路的更深融合**。  
不过从当前状态看，尚未看到直接配套 PR，因此短期更像中期路线探索，而非下一版即将落地的确定功能。

---

### 2) TimestampNTZ / 时间表达式兼容性增强
- **PR**: #11720
- **PR**: #11656
- **链接**: apache/gluten PR #11720 / #11656

这两项 PR 组合起来，释放出清晰信号：**Velox 后端的时间类型与时间函数兼容性正在被系统性补齐**。  
相比 GPU 方向，这类能力更接近主线版本价值，因为：
- 直接影响 SQL 兼容率；
- 有测试覆盖；
- 有开关、有验证路径；
- 更容易在近期版本中合入。

因此可以判断：**TimestampNTZ、CurrentTimestamp、now/localtimestamp 相关支持增强，很可能进入下一轮版本迭代重点**。

---

### 3) Join pullout pre-project 支持
- **PR**: #10851 `[WIP][GLUTEN-4213] Join support pullout pre-project`
- **状态**: Open，长期 WIP
- **链接**: apache/gluten PR #10851

这是一个较长期的优化方向，涉及 join 前投影下沉/提取策略。  
如果最终完成，理论上可能改善：
- join 输入裁剪；
- 表达式计算时机；
- 执行计划简化；
- 某些复杂查询的性能。

但由于该 PR 从 2025-10 即已存在，仍为 WIP，说明实现复杂度不低，短期进入正式版本的确定性不强。

---

### 4) MacOS 构建启用 VCPKG
- **PR**: #11563 `[VL] Enable VCPKG for MacOS build`
- **状态**: Open
- **链接**: apache/gluten PR #11563

这更多是开发者体验和跨平台构建能力提升。  
如果合入，将改善 MacOS 环境下的依赖管理和构建一致性，对本地开发、CI 覆盖、社区贡献门槛都有积极作用。  
虽然不直接属于查询能力，但很可能被纳入近期版本，因为它属于“基础设施收益较高”的改进。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 可提炼出以下用户真实痛点：

### 1) 生产性能并非只看吞吐，更看“小查询延迟”
用户对 `select ... limit ...` 这类简单查询的性能退化非常敏感。  
这说明 Gluten 的目标用户不仅有批处理/离线加速场景，也有明显的 **交互式分析、SQL 探查、开发调试** 诉求。只要简单查询体验差，用户就会直接拿 Vanilla Spark 做基准比较。

### 2) 云对象存储场景下，扩展性比单机加速更关键
S3 读取性能问题表明，用户已在真实集群规模下评估 Gluten，而不是停留在单机 benchmark。  
他们关注的是：**executor 配置变更后，性能是否稳定、是否可预测、是否真的能随资源增加而受益**。

### 3) Iceberg 等 Data Lake 场景要求“正确性 + 可观测性”
`input_file_name()`、block 元数据、JNI 初始化等问题说明，用户不再满足于“能跑 SQL”，而是要求：
- 元数据函数行为正确；
- 文件级诊断能力完整；
- JVM/native 边界稳定。

### 4) 社区对 Velox 上游依赖高度敏感
Issue #11585 的活跃度表明，开发者非常关心哪些 Velox patch 还未 upstream。  
这意味着用户和贡献者都意识到：**Gluten 的很多能力上线节奏，受上游 Velox 合并状态显著影响**。

---

## 8. 待处理积压

以下长期未完成但值得维护者重点关注：

### 1) Join support pullout pre-project
- **PR**: #10851
- **创建时间**: 2025-10-08
- **状态**: Open / WIP
- **链接**: apache/gluten PR #10851

这是明显的长期积压 PR。涉及 join 相关优化，技术价值高，但长时间未落地通常意味着：
- 设计复杂；
- 与多后端或 Catalyst/执行计划适配耦合较深；
- 测试覆盖或边界行为仍未收敛。

建议维护者确认其是否仍是 roadmap 项，避免长期 WIP 占用评审注意力。

---

### 2) MacOS build 启用 VCPKG
- **PR**: #11563
- **创建时间**: 2026-02-04
- **状态**: Open
- **链接**: apache/gluten PR #11563

该 PR 对社区开发体验有实际价值，但已经开放一个多月仍未完成，说明可能存在构建链兼容性或 CI 覆盖问题。  
建议尽快明确是否作为官方支持路径推进，否则应在文档中说明推荐替代方案。

---

### 3) Iceberg 元数据函数与 JNI 稳定性修复
- **PR**: #11615
- **创建时间**: 2026-02-14
- **状态**: Open
- **链接**: apache/gluten PR #11615

这不是“可以慢慢排”的低优先级改进，而是兼具 **正确性 + 稳定性** 的核心问题。  
如果评审资源有限，建议优先于部分文档或清理类 PR。

---

### 4) Velox 上游未合并补丁跟踪
- **Issue**: #11585
- **状态**: Open
- **链接**: apache/gluten Issue #11585

虽然它是 tracker，不是 bug，但它反映的是项目架构层面的积压：  
**关键能力可能长期滞留在“已开发、未 upstream、未正式可依赖”的状态。**  
建议维护者定期梳理：
- 哪些 patch 应继续 upstream 推进；
- 哪些应临时 vendoring；
- 哪些需要在 Gluten 文档中明确标注依赖状态。

---

## 结论

今天的 Apache Gluten 没有版本发布，但开发重点非常清晰：  
- **面向 Velox 的 SQL/类型兼容性补齐** 正在推进；  
- **Iceberg 与 Spark 新版本适配** 持续改进；  
- **对象存储与小查询性能问题** 开始成为社区最值得关注的用户反馈；  
- **TLP 毕业后的仓库与 CI 清理** 正在收尾。  

如果接下来几天能看到 #11720、#11615、#11753 等 PR 合入，同时对 #11765、#11766 给出可复现与修复路径，那么项目短期健康度会进一步提升。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-16）

## 1. 今日速览

过去 24 小时内，Apache Arrow 共发生 **27 条开发活动**：**22 条 Issue 更新**、**5 条 PR 更新**，但 **无新版本发布**。整体看，项目活跃度处于 **中等偏上**，以 **存量问题清理、文档完善、Python 类型系统建设、以及 C++/Gandiva 稳定性修复** 为主。  
Issue 侧有明显的“老问题批量触达/关闭”特征：22 条更新中有不少带 `stale-warning`，说明维护者正在推进历史积压清理。PR 侧则呈现 **1 条缺陷修复已关闭、4 条待审** 的状态，新增改动主要集中在 **Python 类型注解、文档体验、以及 C++ 哈希表错误处理**。  
从技术方向看，今日没有大规模查询引擎能力落地，但对 **表达式执行稳定性、开发者体验、Python API 完整性** 的改进信号较强。整体健康度稳定，不过仍存在一些长期未决的 C++ Dataset / Compute / Join 诉求值得关注。

---

## 2. 项目进展

### 已关闭 / 已完成的重要 PR

#### 1) 修复 Gandiva 极值整数输入导致的崩溃
- **PR**: #49471 `[C++][Gandiva] Fix crashes in substring_index and truncate with extreme integer values`
- 状态：**Closed**
- 链接：apache/arrow PR #49471

该 PR 对应修复了 Gandiva 在极端整数参数下的崩溃问题，覆盖两个函数：
- `substring_index(VARCHAR, VARCHAR, INT)` 在 `INT_MIN` 下崩溃
- `truncate(BIGINT, INT)` 在 `INT_MAX` / `INT_MIN` 下崩溃

这类修复直接关系到：
- **表达式执行稳定性**
- **SQL/函数兼容性边界行为**
- **异常输入下的查询引擎健壮性**

对应 Issue：
- **Issue**: #49470 `[C++][Gandiva] Functions substring_index and truncate crash with extreme integer values`
- 状态：**Closed**
- 链接：apache/arrow Issue #49470

**分析**：虽然这是 Gandiva 子模块中的边界缺陷，但其影响本质上属于 **计算引擎的正确性与稳定性问题**。对依赖 Arrow SQL 表达式、UDF 风格函数或嵌入式执行的系统来说，这类修复优先级较高。

---

### 待审中的值得关注 PR

#### 2) C++ 哈希表合并错误处理增强
- **PR**: #49512 `GH-32381: [C++] Improve error handling for hash table merges`
- 状态：**OPEN / awaiting review**
- 链接：apache/arrow PR #49512

该改动强化了 `util/hashing.h` 的错误处理，并增加了单测。  
**意义**：
- 改善 **聚合/Join/哈希类算子底层鲁棒性**
- 减少哈希表合并阶段的异常传播不清晰问题
- 有利于排查复杂执行计划中的内存或状态错误

虽然尚未合并，但对分析型执行引擎来说，这属于典型的 **“非功能性但高价值”基础设施修复**。

#### 3) Python 内部类型系统 stub 建设继续推进
- **PR**: #48622 `GH-49103: [Python] Add internal type system stubs (_types, error, _stubs_typing)`
- 状态：**OPEN / awaiting committer review**
- 链接：apache/arrow PR #48622

该 PR 是 pyarrow 类型注解系列的一部分，新增内部类型 stub。  
**意义**：
- 提升 IDE / 静态类型检查体验
- 让 pyarrow API 在工程化数据平台中更易集成
- 长期有助于降低 Python 用户误用 API 的概率

这不是查询性能特性，但对 **Python 生态可用性与企业级开发体验** 很重要。

#### 4) 文档改进：澄清 `.pxi` doctest 测试方式
- **PR**: #49516 `GH-49503: [Docs][Python] Document .pxi doctests`
- **PR**: #49515 `GH-49503: [Docs][Python] Documenting .pxi doctests are tested via lib.pyx`
- 状态：**OPEN / awaiting review**
- 链接：apache/arrow PR #49516  
- 链接：apache/arrow PR #49515

今天出现了 **两个针对同一 Issue 的文档 PR**，都在解决 `.pxi` doctest 运行方式不透明的问题。  
**意义**：
- 降低新贡献者在 Cython / pyarrow 开发上的上手门槛
- 提升文档可维护性
- 也反映出社区对“可贡献性”的持续关注

---

## 3. 社区热点

以下为今日最值得关注的高讨论度议题：

### 1) Dataset / Python：希望支持从一组 fragment 路径解析分区过滤条件
- **Issue**: #31167 `[Dataset][Python] Parse a list of fragment paths to gather filters`
- 评论数：**17**
- 状态：OPEN
- 链接：apache/arrow Issue #31167

**技术诉求分析**：  
用户希望 `partitioning.parse()` 不仅能处理单一路径，还能处理 **路径列表**，以适配增量写入、覆盖写入、`delete_matching` 等复杂数据湖场景。  
这背后反映出 Arrow Dataset 在真实生产环境中，已经被用于：
- 分区目录增量处理
- 文件级变更传播
- 下游任务按 fragment 精准过滤

这是典型的 **“数据湖编排 + 分区裁剪可用性”** 需求，和 OLAP / ETL 任务调度高度相关。

---

### 2) Python / C++：单数组的 C stream interface 支持
- **Issue**: #31194 `[Python] Support C stream interface of single arrays`
- 评论数：**12**
- 状态：OPEN
- 链接：apache/arrow Issue #31194

**技术诉求分析**：  
当前 pyarrow 的 C stream interface 看起来更偏向结构化批数据，而用户希望 **单个 Array** 也能走标准化互操作接口。  
这说明社区在推动 Arrow 的核心价值之一：
- **跨语言零拷贝互通**
- **标准 ABI / FFI 接口更一致**
- 更好对接 NumPy、数据库扩展、UDF 运行时或外部执行器

如果后续推进，这类改动会增强 Arrow 作为 **分析系统中间交换层** 的地位。

---

### 3) Windows ODBC 安装包签名
- **Issue**: #49404 `[C++][CI][Packaging][FlightPRC] Manual ODBC Windows MSI installer signing`
- 评论数：**7**
- 状态：OPEN
- 链接：apache/arrow Issue #49404

**技术诉求分析**：  
用户/维护者希望为 Flight SQL ODBC 的 Windows MSI 安装包和 DLL 增加签名，以避免 Windows Defender 阻拦。  
这看似是打包问题，实际反映了 Arrow 正在继续补强：
- **企业终端部署体验**
- **Flight SQL 连接器可分发性**
- **Windows 平台合规交付**

对于 BI 工具接入、ODBC 消费者、企业桌面环境来说，这属于落地阻塞项，优先级不低。

---

### 4) C++ Dataset：按分区键过滤时仍存在过多目录/文件 IO
- **Issue**: #31174 `[C++] Reduce directory and file IO when reading partition parquet dataset with partition key filters`
- 评论数：**6**
- 状态：OPEN
- 链接：apache/arrow Issue #31174

**技术诉求分析**：  
这是典型的 **分区裁剪不彻底 / 元数据剪枝不足** 问题。用户反馈即使过滤条件明确，仍会访问大量不匹配分区乃至文件。  
这直接关系到：
- 查询延迟
- 对象存储 LIST / HEAD 成本
- 湖仓查询引擎的可扩展性

若后续有实质修复，将对 Arrow Dataset 在大规模分区 Parquet 场景中的竞争力形成明显加分。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### 高优先级：Gandiva 函数在极端整数值下崩溃
- **Issue**: #49470
- 状态：**Closed**
- 链接：apache/arrow Issue #49470
- **Fix PR**: #49471
- 链接：apache/arrow PR #49471

**问题性质**：崩溃（SIGBUS / SIGSEGV），属于明确的稳定性缺陷。  
**影响范围**：Gandiva 表达式执行，可能影响 SQL 函数求值或嵌入式计算场景。  
**结论**：今日已有对应修复，属于积极信号。

---

### 中优先级：哈希表合并阶段错误处理不足
- **PR**: #49512
- 状态：OPEN
- 链接：apache/arrow PR #49512

**问题性质**：不是新增 bug 报告，但属于潜在查询执行稳定性隐患。  
**影响范围**：可能波及哈希聚合、哈希 Join、内部状态合并等过程。  
**结论**：已有改进 PR，建议维护者尽快审阅。

---

### 中优先级：DictionaryArray 对 `large_string` / `large_binary` 转换缺失
- **Issue**: #49505
- 状态：OPEN
- 链接：apache/arrow Issue #49505

**问题性质**：功能缺失 / 实现不完整，当前报错为 `ArrowNotImplementedError`。  
**影响范围**：
- Python 数据构造路径
- 大字符串/大二进制类型的字典编码使用
- 某些高基数字符串列处理场景

**结论**：暂无修复 PR。虽然不是崩溃，但会影响 Python 用户对复杂类型的使用完整性。

---

### 中低优先级：FIFO / named pipe 输入流使用场景不清晰
- **Issue**: #45791 `[C++] InputStream implementation for reading from a FIFO?`
- 状态：OPEN
- 链接：apache/arrow Issue #45791

**问题性质**：使用问题，但反映出 I/O 抽象和文档在流式 IPC 场景中的可发现性不足。  
**影响范围**：Linux 管道、流式 IPC、非文件常规输入源。  
**结论**：更偏开发者支持与文档完善问题。

---

## 5. 功能请求与路线图信号

### 1) pyarrow 增加由 year/month/day 生成 date 的计算函数
- **Issue**: #49514
- 状态：OPEN
- 链接：apache/arrow Issue #49514

这是一条新鲜且合理的 API 对称性需求。当前已有 date -> year/month/day 的拆解函数，但缺少逆向构造。  
**路线图信号**：
- 若 Arrow 持续增强 Python compute API 的完整性，这类函数很适合纳入后续版本
- 对数据清洗、维表构造、日期列生成场景有直接价值

**纳入可能性：中高**

---

### 2) DictionaryArray 支持 `pa.large_string` / `pa.large_binary`
- **Issue**: #49505
- 状态：OPEN
- 链接：apache/arrow Issue #49505

这是比较明确的类型系统补全需求。  
**路线图信号**：
- 属于“现有类型族支持不完整”的缺口
- 如果 pyarrow 正推进类型 stub 和类型一致性建设，此类实现空白后续被补上的概率不低

**纳入可能性：中等**

---

### 3) 单数组 C stream interface 支持
- **Issue**: #31194
- 状态：OPEN
- 链接：apache/arrow Issue #31194

这是跨语言互操作方向的重要需求。  
**路线图信号**：
- 符合 Arrow 长期核心战略
- 但涉及 Python/C++/规范实现一致性，落地成本可能高于普通 API 补全

**纳入可能性：中等偏高**

---

### 4) Dataset 多路径分区解析
- **Issue**: #31167
- 状态：OPEN
- 链接：apache/arrow Issue #31167

面向真实数据湖处理流程，实用性很强。  
**路线图信号**：
- 若维护者继续加强 Dataset API 在增量处理和复杂目录布局中的适配性，该需求有持续价值
- 但因 issue 较老且仍处于 stale 警示，近期优先级未必高

**纳入可能性：中等**

---

### 5) 分区过滤下进一步减少 IO
- **Issue**: #31174
- 状态：OPEN
- 链接：apache/arrow Issue #31174

这是典型的性能优化请求，和 OLAP 场景直接相关。  
**路线图信号**：
- 一旦有可量化性能收益，往往容易获得关注
- 但实现可能涉及目录发现、表达式裁剪、文件系统抽象等多层逻辑

**纳入可能性：中等偏高**

---

## 6. 用户反馈摘要

从今日更新内容可提炼出几类真实用户痛点：

### 1) 数据湖分区处理仍有“最后一公里”摩擦
- 相关链接：apache/arrow Issue #31167、apache/arrow Issue #31174

用户不仅关注 Arrow 能否“读数据”，更关注：
- 能否高效处理 **覆盖写 / 增量写**
- 能否通过 **分区条件准确裁剪**
- 能否减少对象存储和目录扫描成本

这说明 Arrow Dataset 已进入更复杂的生产工作流，但在 **路径级过滤表达、分区解析和 IO 剪枝** 上仍有提升空间。

---

### 2) Python 用户对类型系统完整性和易用性要求提高
- 相关链接：apache/arrow PR #48622、apache/arrow Issue #49505、apache/arrow Issue #49514

Python 生态用户当前关注的不是单纯“能不能用”，而是：
- 类型提示是否完善
- 特定 Arrow 类型是否支持完整
- compute API 是否对称、直观

这表明 pyarrow 正在从“底层高性能接口”向“工程友好型数据开发库”继续演化。

---

### 3) 企业部署场景要求更高
- 相关链接：apache/arrow Issue #49404

ODBC MSI 签名问题说明，用户/维护者已经不只关注核心库功能，还关注：
- Windows 安装体验
- 安全软件兼容性
- 企业终端部署顺畅度

这是 Arrow / Flight SQL 面向企业级 BI 连接的重要成熟度指标。

---

### 4) 开发者对贡献体验和测试链路透明度敏感
- 相关链接：apache/arrow Issue #49503、apache/arrow PR #49515、apache/arrow PR #49516

两条并行文档 PR 指向同一问题，反映新贡献者容易在 pyarrow/Cython 测试方式上踩坑。  
这类问题虽不影响终端用户，但会影响：
- 社区贡献效率
- 新人首次提交成功率
- 维护者代码审查负担

---

## 7. 待处理积压

以下问题虽在今天有更新，但多数已存在较久，值得维护者额外关注：

### 1) Dataset 多路径分区解析
- **Issue**: #31167
- 创建时间：2022-02-17
- 状态：OPEN / stale-warning
- 链接：apache/arrow Issue #31167

**原因**：评论数最高，且与数据湖增量处理场景紧密相关，用户价值明确。

### 2) 单数组 C stream interface 支持
- **Issue**: #31194
- 创建时间：2022-02-21
- 状态：OPEN / stale-warning
- 链接：apache/arrow Issue #31194

**原因**：Arrow 核心互操作能力的重要拼图，长期悬而未决。

### 3) 分区过滤下减少目录与文件 IO
- **Issue**: #31174
- 创建时间：2022-02-17
- 状态：OPEN / stale-warning
- 链接：apache/arrow Issue #31174

**原因**：直指大规模 Dataset 查询性能，是 OLAP 用户非常敏感的问题。

### 4) 列包含 list 时 Join 受限
- **Issue**: #31180 `[C++] Enable joins when data contains a list column`
- 创建时间：2022-02-18
- 状态：OPEN / stale-warning
- 链接：apache/arrow Issue #31180

**原因**：影响复杂 schema 的 Join 可用性，属于查询引擎能力边界问题。

### 5) argmin / argmax 类聚合能力
- **Issue**: #31184 `[C++] Aggregate functions for min and max index`
- 创建时间：2022-02-20
- 状态：OPEN / stale-warning
- 链接：apache/arrow Issue #31184

**原因**：这是常见分析函数诉求，与 NumPy / Pandas 语义对齐价值高。

### 6) Flight 进程内性能基准
- **Issue**: #31201 `[C++][FlightRPC] Benchmark in-process Flight performance`
- 创建时间：2022-02-22
- 状态：OPEN / stale-warning
- 链接：apache/arrow Issue #31201

**原因**：对 Flight 在嵌入式/本地环回场景的性能认知仍不充分，不利于系统选型。

### 7) 长期待审 PR：Python 类型 stub 系列
- **PR**: #48622
- 创建时间：2025-12-22
- 状态：OPEN / awaiting committer review
- 链接：apache/arrow PR #48622

**原因**：这是 pyarrow 类型系统建设链路中的关键 PR，拖延会影响后续相关 PR 的串行推进。

---

## 8. 总结判断

今天的 Apache Arrow 没有版本发布，也没有大规模功能合并，但出现了几个值得关注的明确信号：

1. **稳定性方面有实质进展**：Gandiva 极端整数崩溃问题已获得修复闭环。  
2. **Python 工程化能力持续增强**：类型 stub 与开发文档改进正在推进。  
3. **Dataset 与查询引擎老诉求仍然存在**：尤其是分区 IO 剪枝、复杂 schema Join、跨语言流接口等问题，体现出 Arrow 在 OLAP/数据湖核心路径上仍有优化空间。  
4. **企业化交付诉求上升**：Flight SQL ODBC 的 Windows 签名问题说明项目正在面对更真实的生产部署要求。

**整体健康度评价：稳健，偏维护与修补日。** 若接下来 #49512、#48622 等 PR 获得推进，项目在执行稳定性与 Python 开发体验上会继续改善。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*