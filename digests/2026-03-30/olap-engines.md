# Apache Doris 生态日报 2026-03-30

> Issues: 6 | PRs: 28 | 覆盖项目: 10 个 | 生成时间: 2026-03-30 01:45 UTC

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

# Apache Doris 项目动态日报 - 2026-03-30

## 1. 今日速览

过去 24 小时，Apache Doris 保持中高活跃度：Issues 更新 6 条、PR 更新 28 条，但无新版本发布。  
从合并与关闭情况看，今日工作重心仍然集中在 **查询/存储稳定性修复、数据湖兼容性增强、测试覆盖补强以及多分支回补**。  
值得关注的是，**Iceberg v3、备份恢复并发能力、OLAP 扫描器缓存修复、分区指标语义修正**等方向持续推进，说明项目当前在兼顾企业级稳定性和湖仓生态能力。  
同时，Issues 侧新增讨论不多，但出现了 **集群快照备份** 这类偏平台化能力诉求，反映 Doris Cloud/大规模运维场景的需求正在上升。  
整体判断：**项目健康度良好，研发节奏稳定；但部分历史功能请求被 stale 关闭，表明维护资源更偏向核心路径和近期 roadmap。**

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1) 修复 OlapScanner 污染 schema cache 的问题，降低崩溃风险
- PR: [#61510](https://github.com/apache/doris/pull/61510)  
- 状态: 已关闭（主线修复完成，并已有 4.0/4.1 回补 PR）
- 回补:
  - [#61853](https://github.com/apache/doris/pull/61853) branch-4.0
  - [#61854](https://github.com/apache/doris/pull/61854) branch-4.1

**技术意义：**  
该 PR 直接对应一次 `SIGSEGV` 级别的崩溃栈，属于高优先级稳定性修复。问题出现在 `OlapScanner` 对 schema cache 的污染，可能导致扫描阶段访问异常对象并触发段错误。  
这类问题影响查询稳定性，尤其在复杂 schema、并发扫描、缓存复用路径中风险更高。今日即完成主线修复并快速回补到维护分支，说明维护者对线上稳定性问题响应较快。

---

#### 2) Azure 对象存储修改时间戳修复，改善外表/对象存储元数据正确性
- PR: [#61790](https://github.com/apache/doris/pull/61790)  
- 状态: 已关闭
- 链接: https://github.com/apache/doris/pull/61790

**技术意义：**  
修复 `AzureObjStorage` 在多个代码路径上错误使用时间 API，避免把“秒内秒数”当作 epoch，或时区处理不一致。  
这会影响对象文件列表、增量判断、元数据比较等逻辑，对外部存储接入的正确性非常关键。  
这类修复虽不直接涉及 SQL 功能，但对 **云存储接入可靠性** 是底层基础能力补强。

---

#### 3) 增强 MOR Unique Key 回归测试，补齐 TPC-H SF10 覆盖
- PR: [#61762](https://github.com/apache/doris/pull/61762)  
- 状态: 已关闭
- 链接: https://github.com/apache/doris/pull/61762

**技术意义：**  
新增面向 **Merge-On-Read (MOR)** Unique Key 表的 TPC-H SF10 回归测试，弥补既有测试更偏向 MOW 路径的空白。  
这意味着 Doris 团队正在提升 **Unique Key 不同实现模式下的查询语义一致性与性能回归可观测性**，对使用主键模型做实时分析的用户是积极信号。

---

#### 4) 新增 meta_tool 生成空 segment 文件能力，提升调试与测试效率
- PR: [#61703](https://github.com/apache/doris/pull/61703)  
- 状态: 已关闭
- 链接: https://github.com/apache/doris/pull/61703

**技术意义：**  
`meta_tool` 增加 `gen_empty_segment` 操作，便于构造 0 行 segment 文件。  
这对定位存储引擎边界场景、测试 compaction/segment 读取路径、分析异常元数据状态都很有帮助，属于典型的 **工程可运维性增强**。

---

#### 5) branch 回补：Parquet INT96 时间戳写出修复
- 主 PR: [#61832](https://github.com/apache/doris/pull/61832)  
- branch 回补关闭: [#61847](https://github.com/apache/doris/pull/61847)

**技术意义：**  
持续修复 Parquet 写出时间戳 INT96 类型问题，说明 Doris 团队仍在加强与主流列式格式的互操作质量。  
这类问题通常影响 Doris 导出结果与 Spark/Hive/Trino 等系统间的数据兼容性。

---

## 4. 社区热点

### 1) 集群快照备份需求升温：Cloud 场景需要周期性元数据保护
- Issue: [#61464 Doris Cluster Snapshot Backup](https://github.com/apache/doris/issues/61464)
- 评论数: 2

**热点分析：**  
该需求提出 Doris Cloud 模式下需要对集群元数据做周期性 snapshot backup，用于容灾、误操作恢复和运维审计。  
这背后的技术诉求并不是单表级 backup，而是 **更高层的集群级状态保护**，包括 FE 元数据、任务状态、catalog 配置等。  
结合当前已有并行备份恢复 PR [#61710](https://github.com/apache/doris/pull/61710)，可以看出 Doris 正从“单任务备份机制”向“更云原生、可批量、可并发”的备份恢复体系演进。

---

### 2) 数据湖样例正确性被质疑，说明文档/示例仍影响用户第一印象
- Issue: [#56687 sample that datalake `iceberg_and_paimon` is it really correct?](https://github.com/apache/doris/issues/56687)
- 评论数: 3
- 状态: Open, Stale

**热点分析：**  
虽然这是历史 issue 的再次更新，但它仍被保留在活跃列表，说明用户对 `samples/datalake/iceberg_and_paimon` 的可用性仍有疑虑。  
这类问题不一定是内核 bug，却会直接影响 Doris 在湖仓接入场景中的“开箱体验”。  
考虑到今日仍有多条 Iceberg / data lake 相关 PR 活跃（如 [#61398](https://github.com/apache/doris/pull/61398)、[#61646](https://github.com/apache/doris/pull/61646)、[#61783](https://github.com/apache/doris/pull/61783)），建议维护者同步关注 sample 与真实实现的一致性。

---

### 3) 数据湖与 Iceberg 生态持续升温
重点 PR：
- [#61398 Support iceberg v3 row lineage](https://github.com/apache/doris/pull/61398)
- [#61848 branch-4.1 backport for iceberg v3 row lineage](https://github.com/apache/doris/pull/61848)
- [#61646 Refactor iceberg system tables to use native table execution path](https://github.com/apache/doris/pull/61646)
- [#61783 data_lake_reader_refactoring](https://github.com/apache/doris/pull/61783)

**热点分析：**  
今天最明显的技术主线之一是 **Iceberg 生态能力增强 + 数据湖读取路径重构**。  
其中 `row lineage` 支持表明 Doris 不再只是“能读 Iceberg”，而是在向更深层次的 **版本/行级演进语义兼容**靠拢；而系统表执行路径原生化则意味着元数据查询与执行效率会继续改善。  
对于希望把 Doris 作为统一查询层的用户，这是一组非常重要的 roadmap 信号。

---

## 5. Bug 与稳定性

按严重程度排序：

### P1 - 查询/扫描路径崩溃风险：OlapScanner schema cache 污染
- PR: [#61510](https://github.com/apache/doris/pull/61510)
- 回补: [#61853](https://github.com/apache/doris/pull/61853), [#61854](https://github.com/apache/doris/pull/61854)

**影响：**  
可能触发 `SIGSEGV`，属于直接影响查询稳定性的高优先级问题。  
**状态：** 已有 fix，且进入维护分支回补流程。

---

### P1 - RPC 回调复用导致数据竞争
- PR: [#61782 Fix AutoReleaseClosure data race with callback reuse](https://github.com/apache/doris/pull/61782)
- 状态: Open

**影响：**  
在 callback 对象复用时，`Run()` 对 `cntl_`、`response_` 的读取可能与新 RPC 并发交错，存在读取到“下一次 RPC 状态”的风险。  
这类问题容易造成 **偶发性错误、难复现稳定性缺陷**，对高并发网络路径尤其敏感。  
**状态：** 修复 PR 已提交，但尚未关闭。

---

### P1/P2 - 导入内存压力过大：单 batch block 可能膨胀到数百 MB
- PR: [#61821 limit max block bytes per batch](https://github.com/apache/doris/pull/61821)
- 状态: Open

**影响：**  
在宽表或复杂嵌套类型导入时，仅按 `batch_size` 控制行数可能导致单批内存过大，引发内存压力、GC/allocator 抖动甚至 OOM。  
**状态：** 优化中，属于明显的可用性与稳定性改进。

---

### P2 - Parquet INT96 时间戳写出兼容性问题
- PR: [#61832](https://github.com/apache/doris/pull/61832)
- 回补: [#61847](https://github.com/apache/doris/pull/61847)

**影响：**  
可能导致 Doris 与外部 Parquet 消费系统之间出现时间字段解析偏差。  
**状态：** 修复已推进并完成部分分支回补。

---

### P2 - Azure 对象存储修改时间错误
- PR: [#61790](https://github.com/apache/doris/pull/61790)

**影响：**  
对象元数据时间不正确，可能影响文件筛选、同步、外表扫描的元数据判断。  
**状态：** 已修复。

---

### P2 - 缺失 segment 文件时查询/导入失败
- PR: [#61844 Ignore not-found segments in query and load paths](https://github.com/apache/doris/pull/61844)
- 状态: Open

**影响：**  
segment 被 GC 或外部原因删除后，用户原本会直接遭遇 IO error。  
该 PR 改为在可配置条件下跳过缺失 segment，提升容错性，但也需要权衡“容忍坏数据”与“尽早暴露问题”的边界。  
**状态：** Open，值得持续关注。

---

## 6. 功能请求与路线图信号

### 可能进入后续版本的能力

#### 1) 并发备份/恢复
- PR: [#61710 support concurrent backup/restore](https://github.com/apache/doris/pull/61710)

**判断：**  
该 PR 直接解决当前每库仅允许一个 backup/restore job 的瓶颈，特别适合 CCR、多表同步场景。  
结合 Issue [#61464](https://github.com/apache/doris/issues/61464) 的集群快照诉求，备份恢复能力很可能成为后续版本重点之一。

---

#### 2) Iceberg v3 row lineage
- PR: [#61398](https://github.com/apache/doris/pull/61398)
- 回补: [#61848](https://github.com/apache/doris/pull/61848)

**判断：**  
已获得 `approved/reviewed` 且进入分支回补，纳入后续版本的概率很高。  
这是 Doris 提升 **Iceberg 深度兼容性** 的关键信号。

---

#### 3) Iceberg 系统表原生执行路径
- PR: [#61646](https://github.com/apache/doris/pull/61646)

**判断：**  
如果落地，将提升系统表访问路径一致性，并可能改善元数据查询性能与维护成本。  
与上面的 row lineage 支持形成“功能 + 架构”双推进。

---

#### 4) SQL 函数扩展：Trino/Presto 兼容函数
- PR: [#61850 support simple sql function from Trino&Presto](https://github.com/apache/doris/pull/61850)
- PR: [#61846 Support mmhash3_u64_v2](https://github.com/apache/doris/pull/61846)

**判断：**  
这类小而明确的 SQL 函数增强通常更容易合入，能持续提升 Doris 对外部 SQL 生态的兼容性。  
其中 `human_readable_seconds` 面向易用性，`murmur_hash3_u64_v2` 面向计算与兼容场景。

---

### 今日被关闭但反映长期需求的功能请求
以下 Issue 因 stale 被关闭，不代表需求无价值：

- [#55547 on duplicate key update 语义支持](https://github.com/apache/doris/issues/55547)
- [#56258 Support MERGE INTO](https://github.com/apache/doris/issues/56258)
- [#56260 uuid v7 function support](https://github.com/apache/doris/issues/56260)
- [#56261 support read and write vortex columnar file](https://github.com/apache/doris/issues/56261)

**路线图解读：**  
这些需求集中在：
1. **标准/主流 SQL DML 语义增强**（`MERGE INTO`、`ON DUPLICATE KEY UPDATE`）  
2. **函数生态补齐**（UUID v7）  
3. **新兴列式格式接入**（Vortex）

今天它们被 stale 关闭，说明短期内 Doris 团队仍优先投入 **稳定性修复、现有生态兼容、核心路径重构**，而不是扩张式功能开发。

---

## 7. 用户反馈摘要

### 1) 用户希望 Doris 支持更贴近 MySQL/标准 SQL 的增量更新语义
- Issue: [#55547](https://github.com/apache/doris/issues/55547)
- Issue: [#56258](https://github.com/apache/doris/issues/56258)

**痛点提炼：**  
用户在 ETL 场景中，希望先全量 `insert`、后续增量只更新部分字段，期待类似 MySQL `ON DUPLICATE KEY UPDATE` 或标准 `MERGE INTO` 的表达能力。  
这说明 Doris 虽然已有主键模型，但在 **用户熟悉的 DML 编排语义** 上仍存在迁移门槛。

---

### 2) 用户关心样例与真实环境一致性
- Issue: [#56687](https://github.com/apache/doris/issues/56687)

**痛点提炼：**  
用户直接质疑 `iceberg_and_paimon` sample 是否正确，表明样例脚本版本、依赖、文档说明可能与主干实现脱节。  
对于新用户而言，这类问题会放大“产品复杂度”感知，尤其是在数据湖接入链路中。

---

### 3) 云化与大规模运维用户需要更完整的备份体系
- Issue: [#61464](https://github.com/apache/doris/issues/61464)
- PR: [#61710](https://github.com/apache/doris/pull/61710)

**痛点提炼：**  
用户场景已不再局限于单次手工备份，而是要求 **周期性、并发化、面向集群级别** 的备份恢复能力。  
这反映 Doris 正被用于更大规模、更高可用要求的生产环境。

---

## 8. 待处理积压

### 1) HTTP API 管理操作认证框架修复仍待推进
- PR: [#60761 Fix HTTP API authentication framework for admin operations](https://github.com/apache/doris/pull/60761)
- 创建时间: 2026-02-14
- 状态: Open

**关注原因：**  
涉及 FE/BE 多个 HTTP API 的权限边界划分，是安全面较大的改动。  
该 PR 已持续较长时间未关闭，建议维护者关注评审与合入节奏。

---

### 2) 云模式下 Alibaba Cloud OSS 原生 storage vault 支持仍未落地
- PR: [#61329 Add Alibaba Cloud OSS native storage vault support with STS AssumeRole](https://github.com/apache/doris/pull/61329)
- 创建时间: 2026-03-14
- 状态: Open

**关注原因：**  
面向阿里云场景的原生集成，对云上用户拓展意义较大。  
如果长期停留，会影响 Doris Cloud 在多云场景中的适配完整性。

---

### 3) MV 重写与约束变更缓存失效修复仍待确认
- PR: [#61176 unblock extra-join elimination and invalidate rewrite cache on constraint changes](https://github.com/apache/doris/pull/61176)
- 创建时间: 2026-03-10
- 状态: Open

**关注原因：**  
涉及物化视图重写正确性与优化器行为，影响较深且隐蔽。  
建议持续跟踪其测试充分性与最终合入情况。

---

### 4) 历史功能诉求被 stale 关闭，但需求类别仍值得维护者定期回看
- [#55547](https://github.com/apache/doris/issues/55547)
- [#56258](https://github.com/apache/doris/issues/56258)
- [#56260](https://github.com/apache/doris/issues/56260)
- [#56261](https://github.com/apache/doris/issues/56261)

**关注原因：**  
这些需求代表了 SQL 兼容、函数生态、列式格式支持等长期方向。  
虽然本次被 stale 清理，但若社区后续出现更多重复诉求，建议转化为 roadmap 议题，而不是重复关闭。

---

## 结论

今天的 Apache Doris 动态显示出一个比较清晰的信号：  
**核心内核仍在优先做稳定性修复与湖仓生态增强，尤其是 OLAP 扫描、对象存储、Parquet/Iceberg、备份恢复等生产关键路径。**  
与此同时，社区用户已经开始更集中地提出 **云运维能力、标准 SQL DML、样例可用性** 等更高层诉求。  
如果后续几天并发备份恢复、Iceberg v3、数据湖 reader 重构继续推进，预计 Doris 下一阶段将进一步强化其“企业级查询引擎 + 湖仓统一分析层”的定位。  

如果你愿意，我还可以把这份日报继续整理成：
1. **适合飞书/Slack 发布的 1 分钟简报版**  
2. **适合周报汇总的趋势版**  
3. **按查询引擎 / 存储 / 湖仓 / 云能力四个模块重组版**

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**基于 2026-03-30 社区动态**

---

## 1. 生态全景

过去 24 小时，开源 OLAP 与分析型存储引擎生态整体呈现出一个很清晰的特征：**高活跃、强修复、重生态集成**。多数项目没有集中发布正式版本，但都在持续推进 **稳定性修复、湖仓兼容、对象存储适配、CI/测试治理、SQL 语义补齐**。  
从项目动态看，行业已经不再停留在“单机分析快”或“MPP 查询快”的竞争阶段，而是进入 **企业级可靠性 + 多引擎互操作 + 云对象存储友好 + 数据湖协议兼容** 的综合竞争。  
同时，社区反馈也表明，用户诉求正在从传统查询性能转向更高层能力：**备份恢复、Schema Evolution、协议一致性、跨引擎可见性、样例/文档可用性、成本可控性**。  
总体上看，2026 年的开源分析引擎生态正在加速收敛到“**统一分析层 / 湖仓访问层 / 云原生数据基础设施**”这一方向。

---

## 2. 各项目活跃度对比

> 注：以下以日报提供数据为准；“健康度评估”为基于活跃度、修复节奏、稳定性信号的综合判断。

| 项目 | Issues 更新 | PR 更新 | Release | 今日状态/健康度评估 |
|---|---:|---:|---|---|
| **Apache Doris** | 6 | 28 | 无 | **健康良好，节奏稳定**；重点在稳定性修复、Iceberg/湖仓增强、备份恢复演进 |
| **ClickHouse** | 25 | 265 | 无 | **活跃且可控，但稳定性压力偏高**；高强度迭代，CI/crash/flaky 占比高 |
| **DuckDB** | 7 | 23 | 无 | **积极且稳健**；以正确性修复、Arrow/Geo 兼容、ATTACH/扩展 API 完善为主 |
| **StarRocks** | 1 | 10 | 无 | **整体稳定**；活跃度中等，聚焦规划器正确性、Schema Evolution、工具链升级 |
| **Apache Iceberg** | 3 | 19 | 无 | **健康较好**；AWS/S3、Kafka Connect、Spark/Hive 兼容边界持续打磨 |
| **Delta Lake** | 2 | 5 | 无 | **中等活跃，关键修复价值高**；协调提交一致性与 Flink/Spark Kernel 路线值得关注 |
| **Databend** | 1 | 8 | **nightly 发布** | **健康良好**；SQL 兼容与优化器边界修复推进明确 |
| **Velox** | 1 | 12 | 无 | **健康较好**；偏内核打磨，正确性、存储读路径、trace/replay 能力增强 |
| **Apache Gluten** | 1 | 5 | 无 | **稳定但偏低活跃**；对上游 Velox 依赖明显，功能推进节奏受制于上游 |
| **Apache Arrow** | 19 | 12 | 无 | **活跃但偏维护型**；API 收敛、Parquet 正确性、R/CI/Flight SQL 工程治理并行 |

### 活跃度分层观察
- **超高活跃**：ClickHouse
- **高活跃**：Doris、DuckDB、Arrow、Iceberg
- **中活跃**：StarRocks、Velox、Databend
- **中低活跃**：Delta Lake、Gluten

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势

与同类项目相比，**Apache Doris 的优势在于“面向数仓分析场景的一体化能力较平衡”**：  
- 既保持了传统 MPP OLAP 引擎的强项：高性能查询、主键模型、物化视图、较完整 SQL 使用体验；
- 又在持续增强 **Iceberg / Paimon / Parquet / Azure / OSS / S3 等湖仓和对象存储能力**；
- 同时开始往 **备份恢复并发化、集群级快照、Cloud 运维能力**延伸。

从今日动态看，Doris 当前体现出三条鲜明主线：  
1. **稳定性优先**：如 OlapScanner schema cache 污染、Parquet INT96、Azure mtime 等；  
2. **湖仓能力加深**：如 Iceberg v3 row lineage、Iceberg system table 原生执行路径、data lake reader 重构；  
3. **企业化运维增强**：如并发 backup/restore、集群 snapshot backup 需求升温。

### 3.2 与主要同类的技术路线差异

- **对比 ClickHouse**：  
  ClickHouse 更偏“极致执行性能 + MergeTree 深度工程化 + 海量功能快速演进”，但当前稳定性噪音更高；Doris 的路线更偏“数仓/湖仓统一查询平台 + 企业级可运维性 + SQL 体验平衡”。

- **对比 StarRocks**：  
  两者都属于现代 MPP 分析数据库，路线接近；但 Doris 今日信号显示其在 **备份恢复体系、Iceberg 深度兼容、Cloud 场景运维** 上的公开推进更明显。

- **对比 DuckDB**：  
  DuckDB 强在嵌入式、单机、开发者体验与多格式互操作；Doris 强在分布式在线分析、服务化部署、主键/数仓场景和集群能力。

- **对比 Databend**：  
  Databend更偏云原生/对象存储导向、现代 SQL 层兼容与存算分离思路；Doris 则保留更完整的数据仓库引擎特征，并在逐步增强湖仓统一层能力。

- **对比 Iceberg / Delta Lake / Arrow**：  
  Doris 不是底层表格式或中立列式内核，而是**直接面向查询与分析服务层**；这决定了它更强调 SQL、执行、运维、服务可用性，而不仅是协议一致性。

### 3.3 社区规模对比

从今日数据看，Doris 的社区热度处于 **第二梯队头部**：  
- 活跃度明显高于 StarRocks、Delta Lake、Databend、Velox、Gluten；  
- 低于 ClickHouse 这一超高活跃项目；  
- 与 DuckDB、Iceberg、Arrow 相比，Doris更偏“引擎内核 + 应用能力并进”，不是单纯基础设施层项目。  

结论上，Doris 当前属于：  
**“社区成熟、研发节奏稳定、企业特性增强明显、正在从 OLAP 引擎向统一分析平台演进”的主流项目。**

---

## 4. 共同关注的技术方向

以下是今日多个项目共同涌现的技术主题：

### 4.1 湖仓 / 数据湖协议兼容持续升温
**涉及项目**：Doris、ClickHouse、Iceberg、Delta Lake、Arrow、Databend  
**具体诉求**：
- Doris：Iceberg v3 row lineage、system table 原生执行路径、data lake reader 重构  
- ClickHouse：Paimon minmax index、Iceberg orphan files、Hive virtuals、url wildcard  
- Iceberg：Spark/Kafka Connect/Hive catalog/AWS 路线持续推进  
- Delta Lake：Kernel connector 下推、Flink Sink 补齐  
- Arrow：Dataset、Parquet、Flight SQL 持续演进  
- Databend：Stage 文本格式参数增强，文件接入能力加强  

**共识**：分析引擎正在全面转向“**不仅查自有表，也要查外部湖表/对象文件/多协议数据源**”。

---

### 4.2 对象存储与云环境适配成为核心基础能力
**涉及项目**：Doris、ClickHouse、Iceberg、Delta Lake、Databend、StarRocks  
**具体诉求**：
- Doris：Azure mtime 修复、OSS native vault、备份恢复并发化  
- ClickHouse：S3 TTL PUT 成本、url() 多文件读取、Dictionary from S3/GCS Parquet  
- Iceberg：AWS 连接提前关闭、STS region、chunked encoding、metrics publisher  
- Delta Lake：coordinated commits 一致性  
- StarRocks：UDF from S3  
- Databend：Stage / 文件导入能力增强  

**共识**：云对象存储已不是“外部补充”，而是主战场；关注点也从“能接入”升级为“**正确、便宜、稳定、可治理**”。

---

### 4.3 正确性与稳定性修复优先级持续上升
**涉及项目**：Doris、ClickHouse、DuckDB、Velox、Delta Lake、Arrow、Databend  
**典型问题**：
- Doris：SIGSEGV、data race、导入内存爆炸、segment 缺失容错  
- ClickHouse：double free、SIGABRT、VIEW/PROJECTION 回归、时间类型边界错误  
- DuckDB：LEFT JOIN LATERAL wrong-result、Arrow format crash、JSON→Variant internal error  
- Velox：counting join、列读取提前退出  
- Delta Lake：silent data loss in coordinated commits  
- Arrow：Parquet 时间戳溢出导致静默错误  
- Databend：UInt64 统计溢出、JOIN schema nullability 不一致  

**共识**：生态整体已进入“**正确性 > 新功能炫技**”的成熟化阶段，特别重视 wrong-result、静默数据损坏、并发一致性问题。

---

### 4.4 SQL 兼容与开发者体验持续补齐
**涉及项目**：Doris、ClickHouse、DuckDB、Databend、Gluten、Velox、StarRocks  
**具体诉求**：
- Doris：Trino/Presto 兼容函数、标准 DML 诉求（MERGE INTO / ON DUPLICATE KEY UPDATE）  
- ClickHouse：rolling hashes、输出格式精度、时间序列类型兼容  
- DuckDB：ATTACH 表达式、CLI 易用性、复杂类型展示  
- Databend：`X'...'` 二进制字面量、`ADD COLUMN IF NOT EXISTS`  
- Gluten / Velox：Spark 4.x 函数兼容、AES/Base32 等函数补齐  
- StarRocks：Schema Evolution、时区函数修复  

**共识**：用户越来越要求分析引擎具备“**迁移成本低、SQL 行为可预测、脚本可重复执行**”的能力。

---

### 4.5 CI / 测试治理与工程质量是高频主题
**涉及项目**：ClickHouse、DuckDB、Velox、Arrow、StarRocks、Doris  
**具体体现**：
- ClickHouse：flaky test、TSan/UBSan、release/backport 高频  
- DuckDB：大量 Ready For Review 修复、边界 case 收敛  
- Velox：pre-commit 缺口、flaky test 修复  
- Arrow：R CI / Windows 发布故障  
- StarRocks：clang / JIT 构建兼容性  
- Doris：MOR Unique Key、meta_tool、回归补强  

**共识**：在复杂分析引擎里，**测试/CI 不再只是工程配套，而是稳定性交付能力本身**。

---

## 5. 差异化定位分析

## 5.1 存储格式与生态角色差异

| 项目 | 主要角色定位 | 与存储格式的关系 |
|---|---|---|
| **Doris / ClickHouse / StarRocks / Databend** | 分析数据库 / 查询引擎 | 自有存储为主，同时增强 Iceberg/Parquet/Paimon/Hive 等接入 |
| **DuckDB** | 嵌入式分析引擎 | 原生多格式读取极强，强调本地/进程内分析 |
| **Iceberg / Delta Lake** | 湖仓表格式/事务协议层 | 不是主要查询引擎，而是多引擎共享的表层标准 |
| **Arrow** | 列式内存/交换与文件格式基础设施 | 作为跨系统数据表示与互操作底座 |
| **Velox** | 向量化执行内核 | 不是完整数据库，更像下游查询系统执行引擎底层 |
| **Gluten** | Spark 加速层/适配层 | 依赖 Velox/CH 后端，不是独立存储引擎 |

---

## 5.2 查询引擎设计差异

- **Doris / StarRocks**：典型 MPP 数仓分析引擎，追求交互式分析 + 数据仓库能力平衡。  
- **ClickHouse**：偏列存执行极致优化，工程复杂度高，功能面广，适合高吞吐日志/明细/时序分析。  
- **DuckDB**：单机嵌入式、开发者友好，适合 notebook、本地数据科学、边缘分析。  
- **Databend**：更偏云原生、对象存储友好、现代 SQL 兼容和分离式架构思路。  
- **Velox**：作为执行引擎内核服务于其他系统，不直接承担完整 DB 职责。  
- **Iceberg / Delta Lake / Arrow**：更偏协议/格式/中间层，不直接与完整 SQL 数仓正面竞争。

---

## 5.3 目标负载类型差异

- **Doris / StarRocks**：BI、数仓、实时分析、主键更新分析、湖仓统一查询  
- **ClickHouse**：日志、可观测性、事件分析、宽表明细、高吞吐 OLAP  
- **DuckDB**：本地 ETL、交互式探索、嵌入式应用、数据科学  
- **Databend**：云上分析、对象存储数据处理、现代平台集成  
- **Iceberg / Delta Lake**：作为多引擎共享表层，服务批流一体、湖仓治理  
- **Arrow**：数据交换、向量内存表示、跨语言计算  
- **Velox / Gluten**：作为执行加速和后端运行时基础设施

---

## 5.4 SQL 兼容性差异

- **Doris / StarRocks**：往企业数仓 SQL 与主流生态兼容靠拢，用户显著关注 DML 语义和迁移便利性。  
- **ClickHouse**：功能多，但存在较多特定语义和边界行为，用户更依赖文档/经验。  
- **DuckDB**：SQL 易用性好，兼容性与开发体验强，但重点不是传统分布式 DML。  
- **Databend**：正快速补齐标准 SQL / MySQL 风格兼容点。  
- **Gluten / Velox**：更多是在补 Spark SQL 兼容覆盖。  
- **Iceberg / Delta / Arrow**：更多是协议、API、一致性语义问题，而非完整 SQL 产品体验。

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：超高活跃、快速迭代
- **ClickHouse**
- 特征：PR 极多，修复与功能并行，回补密集，但稳定性噪音也最高。

### 第二层：高活跃、进入平台化演进
- **Apache Doris**
- **DuckDB**
- **Apache Iceberg**
- **Apache Arrow**
- 特征：不仅修 bug，也在扩展生态边界和平台能力；节奏稳定，方向清晰。

### 第三层：中活跃、聚焦关键模块打磨
- **StarRocks**
- **Databend**
- **Velox**
- 特征：更新不算爆炸，但每条变更更聚焦；更像“有节制的技术推进”。

### 第四层：中低活跃、方向明确但节奏依赖关键路径
- **Delta Lake**
- **Gluten**
- 特征：当天活动不多，但议题价值高；受协议复杂度或上游依赖影响明显。

---

## 6.2 成熟度判断：谁在扩张，谁在巩固

### 偏快速迭代阶段
- **ClickHouse**：功能面持续扩张，但需持续压制回归与 CI 噪音  
- **DuckDB**：能力边界不断外扩，尤其向 Arrow/Geo/扩展 API 深化  
- **Databend**：仍在快速补齐 SQL 兼容和边界正确性

### 偏质量巩固阶段
- **Doris**：已进入“稳定性 + 湖仓能力 + 企业运维”并重阶段  
- **Iceberg**：围绕生产可靠性、对象存储和连接器正确性持续打磨  
- **Arrow**：API 治理、文档清理、正确性修复占比较高  
- **Velox**：明显偏执行内核成熟化与工程质量提升

### 平台化 / 生态协同阶段
- **Delta Lake**：围绕 Kernel、Flink、多实现协议一致性推进  
- **Gluten**：核心挑战是与 Velox 上游协同，不完全由自身节奏决定  
- **StarRocks**：处于可用性增强和工程底座演进并行阶段

---

## 7. 值得关注的趋势信号

## 7.1 “统一分析层”正在成为主流产品方向
Doris、ClickHouse、StarRocks、Databend 都在强化对 Iceberg/Hive/Paimon/S3/Parquet 等外部生态的接入；这意味着未来分析引擎竞争不只是“谁自有存储快”，而是“**谁能更自然成为企业统一查询入口**”。

**对架构师的参考价值**：  
在选型时，不能只看单表查询性能，还要看：
- 湖仓协议兼容深度
- 外部目录/对象存储成本模型
- 元数据查询与系统表能力
- 备份恢复与运维体系

---

## 7.2 正确性问题的行业优先级显著上升
多个项目当天最重要的变化都不是新特性，而是：
- wrong-result
- 静默数据损坏
- 并发竞态导致数据丢失
- 时间类型边界错误
- planner 属性不一致

**对数据工程师的参考价值**：  
在生产使用中，应将以下能力纳入验证重点：
- 时间类型边界测试
- schema evolution 回归
- 备份恢复演练
- 并发写入与事务一致性
- 投影/视图/物化视图/统计信息组合路径

---

## 7.3 云对象存储“成本与语义”成为新焦点
社区不再只问“能不能读 S3/Azure/OSS”，而是开始问：
- PUT/GET 会不会过多？
- 元数据时间戳是否正确？
- STS region 是否继承？
- TTL / orphan file / lifecycle 是否可治理？
- UDF / vault / backup 是否能天然依赖对象存储？

**对架构师的参考价值**：  
云上架构选型时，要把对象存储行为纳入 TCO 与稳定性设计，而不能只看裸查询延迟。

---

## 7.4 SQL 兼容的竞争，已从“支持函数”升级到“支持迁移语义”
今天看到的典型诉求包括：
- MERGE INTO / ON DUPLICATE KEY UPDATE
- Spark 4.x 函数兼容
- Trino/Presto 函数对齐
- `X'...'`、`ADD COLUMN IF NOT EXISTS`
- ATTACH 表达式、复杂类型 CLI 可复制性

**信号含义**：  
用户越来越把这些系统当作“生产数据平台的一部分”，而不是专家专用数据库；迁移成本、脚本复用性、自动化执行幂等性的重要性显著上升。

---

## 7.5 文档、样例、系统表可观测性正在成为采用门槛
Doris 的 datalake sample、Iceberg 的 schema evolution 文档、Arrow 的参数文档、StarRocks 的权限文档、DuckDB 的 CLI/元数据增强，都说明一个现实：  
**开源分析系统的竞争，已经包含“是否容易被正确使用”**。

**对团队的建议**：  
做技术选型或 PoC 时，建议把以下纳入评分：
- 示例可运行度
- 错误码/报错可诊断性
- 系统表与元数据暴露能力
- 文档是否覆盖边界行为

---

# 总体结论

从 2026-03-30 的横向观察看，开源 OLAP / 分析型存储引擎生态已形成三类清晰阵营：

1. **完整分析数据库竞争层**：Doris、ClickHouse、StarRocks、Databend  
2. **嵌入式/开发者友好分析层**：DuckDB  
3. **湖仓协议与执行基础设施层**：Iceberg、Delta Lake、Arrow、Velox、Gluten  

其中，**Apache Doris 的生态位置正在从“高性能 OLAP 引擎”向“企业级统一分析平台”扩展**：  
既保留传统数仓能力，又明显加强湖仓兼容与云运维能力，这使其在当前生态中具备较强平衡性。  
如果后续 Doris 在 **并发备份恢复、Iceberg v3 深兼容、Cloud 场景运维、样例/文档一致性** 上继续推进，其在企业级统一分析层的竞争力会进一步增强。

如果你愿意，我下一步可以把这份报告继续整理成两种格式之一：  
1. **适合管理层/架构委员会阅读的 1 页高管摘要版**  
2. **适合技术团队内部流转的 Markdown 周报版（含结论、建议、风险项）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-30）

## 1. 今日速览

过去 24 小时 ClickHouse 仓库保持高强度活跃：Issues 更新 25 条，PR 更新 265 条，说明项目仍处于密集开发与持续修复阶段。  
从结构上看，今天的重点更偏向**稳定性修复、回归问题补洞、CI/测试治理**，同时也持续推进 **Paimon/Iceberg/Hive/S3 等湖仓与对象存储生态能力**。  
关闭/合并节奏也不错：9 个 Issue 关闭、74 个 PR 合并或关闭，显示维护团队对问题消化能力仍较强。  
不过，自动化扫描工具（如 ClickGap）与 CI crash/flaky test 报告占比较高，反映出项目在快速演进下，**边界语义一致性、类型转换正确性、测试稳健性**仍是当前主要风险面。  

---

## 2. 项目进展

### 2.1 今日值得关注的已关闭 / 已推进 PR

#### 统计信息驱动的 Part Pruning 完成关闭
- **PR #94140** - Add statistics-based part pruning  
  链接: ClickHouse/ClickHouse PR #94140

这是今天最值得关注的引擎侧推进之一。该改动引入基于统计信息的 part pruning，核心思想是利用 MinMax statistics 构建超矩形范围，再复用 `KeyCondition` 做过滤判断。  
这意味着 ClickHouse 在传统 partition pruning 之后，进一步向**更细粒度的数据跳读/跳过**演进，有助于降低扫描数据量，提升复杂过滤场景下的查询效率。  
对 OLAP 用户而言，这类能力通常会在宽表分析、时序/日志过滤、部分谓词复杂但仍可由统计信息近似判定的场景中产生实际收益。

#### 文本索引相关修复已进入回移流程
- **PR #101140** - Backport #100959 to 26.3: Fix text index with `IN` subquery and mismatched number of columns  
  链接: ClickHouse/ClickHouse PR #101140
- **PR #101145** - Backport #100959 to 26.1: Fix text index with `IN` subquery and mismatched number of columns  
  链接: ClickHouse/ClickHouse PR #101145

这表明文本索引相关正确性问题已被认定为需要回补到稳定分支的问题。结合今日关闭的多个 `comp-text-index` Issue，可以判断维护团队正在集中清理文本索引子系统中的**查询语义正确性缺陷**。  
对依赖全文检索/文本条件过滤的用户来说，这是积极信号：不仅修 master，还在加速 LTS / 稳定线修复。

#### 释放周期 PR 仍在推进
- **PR #100062** - Release pull request for branch 26.3  
  链接: ClickHouse/ClickHouse PR #100062

虽然今天没有新 Release 发布，但 26.3 分支的 release PR 仍在活跃，说明稳定版本线仍在持续整备中。结合多个 backport PR，可推测当前工作重点之一是**稳定分支收敛与回归修复**。

---

### 2.2 今日活跃推进中的重要 PR

#### 湖仓生态 / 外部格式集成
- **PR #100160** - Feature: Paimon minmax index  
  链接: ClickHouse/ClickHouse PR #100160  
  推进 Paimon min-max index 下推，属于典型的数据湖查询加速能力。
- **PR #99127** - Support remove_orphan_files for Iceberg tables  
  链接: ClickHouse/ClickHouse PR #99127  
  面向 Iceberg 元数据与对象存储治理，解决 orphan files 长期堆积问题。
- **PR #101069** - Native Common Virtuals for Hive  
  链接: ClickHouse/ClickHouse PR #101069  
  继续增强 Hive 生态兼容与虚拟列能力。
- **PR #95181** - Support wildcard for `url` table function  
  链接: ClickHouse/ClickHouse PR #95181  
  提升 `url()` / URL engine 的易用性，利于批量对象读取。

#### SQL / 函数 / 可用性增强
- **PR #99721** - Add `output_format_float_precision` setting  
  链接: ClickHouse/ClickHouse PR #99721  
  新增浮点输出精度控制，提升结果展示可控性，兼顾 round-trip 与固定小数位需求。
- **PR #101083** - Preserve original parameter types in timeseries aggregate functions  
  链接: ClickHouse/ClickHouse PR #101083  
  修复 timeseries 聚合函数对 Decimal 等类型的不兼容问题，改善时序分析可用性。
- **PR #101114** - Add `compress_per_column_in_compact_parts` MergeTree setting  
  链接: ClickHouse/ClickHouse PR #101114  
  这是典型的存储引擎优化方向，目标是提升 Compact Parts 下按列压缩的灵活性。
- **PR #101149** - Added `max_replicated_table_num_to_warn`  
  链接: ClickHouse/ClickHouse PR #101149  
  面向大规模集群治理与运维观测，补齐 replicated table 数量阈值告警能力。
- **PR #101126** - Add engine-specific icons for tables in Play UI sidebar  
  链接: ClickHouse/ClickHouse PR #101126  
  偏前端/产品体验改进，但对学习与演示环境可读性有帮助。

#### 稳定性 / CI 修复
- **PR #101142** - Fix flaky test_server_reload/test_change_listen_host under coverage  
  链接: ClickHouse/ClickHouse PR #101142
- **PR #101060** - Fix flaky TSan crash in `02124_buffer_with_type_map_long`  
  链接: ClickHouse/ClickHouse PR #101060
- **PR #101097** - Fix UBSan error in parseReadableSize for values near UInt64 max  
  链接: ClickHouse/ClickHouse PR #101097
- **PR #98861** - Fix assertion failure when table UUID collides with database UUID  
  链接: ClickHouse/ClickHouse PR #98861
- **PR #101147** - Fix SIGABRT crash when `aggregate_functions_null_for_empty` is used with Null combinator functions  
  链接: ClickHouse/ClickHouse PR #101147

这些 PR 说明今天的一大主题是：**修极端场景崩溃、减少竞态与 sanitizer 报警、提升配置热加载与并发测试稳定性**。

---

## 3. 社区热点

### 热点 1：CI crash - MergeTree Compact Part 双重释放
- **Issue #99799** - [crash-ci] Double deletion of MergeTreeDataPartCompact in multi_index  
  链接: ClickHouse/ClickHouse Issue #99799

这是今日最值得关注的 crash 类问题之一，评论数 19，在 Issues 中最活跃。问题指向 `MergeTreeDataPartCompact` 在 `multi_index` 场景中的 double deletion，属于典型的**内存生命周期/所有权管理问题**。  
背后技术诉求很明确：ClickHouse 在 MergeTree 复杂索引、Compact Part、以及高并发测试环境下，需要更稳健的对象管理与析构路径校验。  
这类问题若可复现在生产环境，风险等级较高，因为会直接引发 server crash。

### 热点 2：rolling hashes 功能需求
- **Issue #81183** - Functions for rolling hashes  
  链接: ClickHouse/ClickHouse Issue #81183

这是一个长期功能请求，今天再次活跃。需求面向内容定义分块（content-defined chunking）、rsync/binary diff 等场景，本质上是在数据库内提供更强的**流式字符串/二进制分块算法能力**。  
这说明部分用户已不满足于传统 SQL 聚合与文本处理，而是希望 ClickHouse 承担更多**数据切片、去重、同步、增量比对**等近存储计算任务。

### 热点 3：S3 TTL 触发大量 PUT 请求
- **Issue #100960** - Big amount of PUTs on S3 bucket  
  链接: ClickHouse/ClickHouse Issue #100960

该问题直击对象存储成本与行为可预测性：用户仅 2GB 数据，但 TTL 迁移到 S3 时出现大量 PUT。  
这类问题背后反映的不是单纯 bug，而是用户对**云存储写放大、生命周期迁移策略、对象颗粒度与费用模型**的关注。  
随着 ClickHouse 越来越多部署在 S3/GCS/Azure Blob 场景，此类问题的重要性会持续上升。

### 热点 4：URL 通配符支持与外部数据读取体验
- **PR #95181** - Support wildcard for `url` table function  
  链接: ClickHouse/ClickHouse PR #95181

虽然评论数未显示，但从需求价值看，这个 PR 非常贴近真实使用场景。它解决的是批量文件/对象读取入口过于原始的问题，属于提高数据接入便捷性的关键增强。  
如果合并，将显著改善用户从 HTTP/对象存储读取多文件数据时的体验。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P0 / 高风险崩溃类

#### 1) MergeTree Compact Part 双重删除崩溃
- **Issue #99799** - Double deletion of MergeTreeDataPartCompact in multi_index  
  链接: ClickHouse/ClickHouse Issue #99799  
- **是否已有 fix PR**：未在给定数据中明确看到对应 fix PR

涉及存储引擎底层对象生命周期，若非纯 CI 偶发，则可能影响服务稳定性。

#### 2) Null combinator + aggregate_functions_null_for_empty 导致 SIGABRT
- **PR #101147** - Fix SIGABRT crash when aggregate_functions_null_for_empty is used with Null combinator functions  
  链接: ClickHouse/ClickHouse PR #101147  
- **是否已有 fix PR**：有

这是明确的服务器崩溃修复，且描述为 stable release 可见的用户问题，优先级很高。

#### 3) UUID 冲突触发 assertion failure
- **PR #98861** - Fix assertion failure when table UUID collides with database UUID  
  链接: ClickHouse/ClickHouse PR #98861  
- **是否已有 fix PR**：有

涉及 `ON CLUSTER` 建表路径下 table UUID 与 database UUID 冲突，属于元数据边界条件下的严重稳定性问题。

---

### P1 / 查询正确性与语义错误

#### 4) VIEW + PROJECTION 出现 NOT_FOUND_COLUMN_IN_BLOCK
- **Issue #101148** - CH v26.3.2.3-lts - NOT_FOUND_COLUMN_IN_BLOCK error from VIEW with PROJECTION  
  链接: ClickHouse/ClickHouse Issue #101148  
- **是否已有 fix PR**：未见

这是今天新报的稳定版本问题，且涉及 VIEW 读取底层带 PROJECTION 的表。  
如果可稳定复现，会影响线上查询正确执行，尤其是在依赖 projection 优化的生产表上。

#### 5) toStartOfInterval 在负时间戳接近 INT64_MIN 时结果错误
- **Issue #101096** - toStartOfInterval returns wrong positive result for negative timestamps near INT64_MIN  
  链接: ClickHouse/ClickHouse Issue #101096  
- **是否已有 fix PR**：未见

属于边界数值溢出导致的时间函数错误结果，虽然触发条件极端，但这是典型的**正确性回归**问题。

#### 6) allow_statistics=0 不再阻止 ALTER TABLE ADD/DROP STATISTICS
- **Issue #101082** - allow_statistics=0 no longer blocks ALTER TABLE ADD/DROP STATISTICS after #100288  
  链接: ClickHouse/ClickHouse Issue #101082  
- **是否已有 fix PR**：未见

属于设置语义失效，说明某次重构后权限/开关校验位置发生了回归。

#### 7) SHOW MASKING POLICIES 返回错误码不正确
- **Issue #101116** - SHOW MASKING POLICIES gives UNKNOWN_TABLE (60) instead of SUPPORT_IS_DISABLED (344)  
  链接: ClickHouse/ClickHouse Issue #101116  
- **是否已有 fix PR**：未见

虽然不是崩溃，但影响 SQL 兼容性与可诊断性，尤其是工具链依赖错误码时。

#### 8) wrapWithSelectOrderBy 多列表达式崩溃
- **Issue #101107** - wrapWithSelectOrderBy crashes on multi-column SELECT due to single-alias override  
  链接: ClickHouse/ClickHouse Issue #101107  
- **是否已有 fix PR**：未见

这类问题通常出现在 SQL 语法树重写、别名解析、优化器包装逻辑中，值得分析是否会波及 analyzer / planner 路径。

#### 9) DateTime64 / Time64 数值 cast 溢出策略被静默忽略
- **Issue #101131** - date_time_overflow_behavior setting silently ignored...  
  链接: ClickHouse/ClickHouse Issue #101131  
- **是否已有 fix PR**：未见

这是比较典型的“配置项存在但不生效”问题，对依赖严格异常语义的用户影响较大。

#### 10) Time64 存储值与显示值不一致
- **Issue #101132** - ToTime64TransformSigned missing clamp causes inconsistent Time64 values...  
  链接: ClickHouse/ClickHouse Issue #101132  
- **是否已有 fix PR**：未见

这类问题影响比较严重，因为会出现“看起来相同、比较结果不同”的数据语义异常。

---

### P2 / 兼容性、导入导出、测试与 CI

#### 11) NPY 零长度字符串 dtype 被错误拒绝
- **Issue #101133** - element_size == 0 check rejects valid |S0 and <U0 NumPy types  
  链接: ClickHouse/ClickHouse Issue #101133  
- **是否已有 fix PR**：未见

影响 NumPy 数据导入兼容性，属于生态接入问题。

#### 12) getClientHTTPHeader 缺少 nondeterministic 声明
- **Issue #101120** - getClientHTTPHeader missing isDeterministic()=false override  
  链接: ClickHouse/ClickHouse Issue #101120  
- **是否已有 fix PR**：未见

会影响优化器/常量折叠/表达式缓存的正确假设，是一个容易被低估的函数语义问题。

#### 13) Keeper 测试引用硬编码路径导致 CI 失败
- **Issue #101136** - Test reference file hardcodes database-dependent ZK paths  
  链接: ClickHouse/ClickHouse Issue #101136  
- **是否已有 fix PR**：未见

#### 14) ReplicatedMergeTreeQueue 断言失败
- **Issue #101070** - broken_parts == broken_parts_to_enqueue_fetches_on_loading assertion ...  
  链接: ClickHouse/ClickHouse Issue #101070  
- **是否已有 fix PR**：未见

复制队列的断言失败虽然来自 CI，但涉及复制一致性逻辑，建议优先排查。

#### 15) Flaky test 持续出现
- **Issue #101103** - Flaky test: replicated_table_attach startup with small bg pool  
  链接: ClickHouse/ClickHouse Issue #101103  
- **PR #101142** / **PR #101060**  
  链接: ClickHouse/ClickHouse PR #101142  
  链接: ClickHouse/ClickHouse PR #101060

说明当前 CI 抖动仍明显，但已有针对性修复在推进。

---

## 5. 功能请求与路线图信号

### 5.1 对象存储 / 湖仓方向持续升温
- **Issue #101072** - Add S3/GCS sources support to Dictionary to load from Parquet  
  链接: ClickHouse/ClickHouse Issue #101072
- **PR #100160** - Paimon minmax index  
  链接: ClickHouse/ClickHouse PR #100160
- **PR #99127** - Iceberg `remove_orphan_files`  
  链接: ClickHouse/ClickHouse PR #99127
- **PR #101069** - Native Common Virtuals for Hive  
  链接: ClickHouse/ClickHouse PR #101069
- **PR #95181** - wildcard for `url` table function  
  链接: ClickHouse/ClickHouse PR #95181

这组信号非常明确：ClickHouse 仍在强化其作为**分析引擎 + 湖仓访问层**的定位。  
尤其是 Dictionary 直接从 S3/GCS Parquet 加载的需求，若落地，将明显降低外部维表接入成本，也会让对象存储成为更自然的元数据/维表来源。

### 5.2 SQL 函数能力持续扩展
- **Issue #81183** - Functions for rolling hashes  
  链接: ClickHouse/ClickHouse Issue #81183
- **PR #99721** - `output_format_float_precision`  
  链接: ClickHouse/ClickHouse PR #99721

一个代表新的函数族扩展需求，一个代表现有 SQL 输出行为可配置化。两者都说明社区仍在推动 ClickHouse 从“快”走向“**更可控、更通用、更适合嵌入复杂数据流水线**”。

### 5.3 存储层可调优项增加
- **PR #101114** - `compress_per_column_in_compact_parts`  
  链接: ClickHouse/ClickHouse PR #101114
- **PR #101149** - `max_replicated_table_num_to_warn`  
  链接: ClickHouse/ClickHouse PR #101149

这类 PR 往往不会成为 headline feature，但对大规模生产集群很重要。  
可推测下一版本仍会继续增加**MergeTree 可调节参数、对象存储行为控制、集群规模保护阈值**。

---

## 6. 用户反馈摘要

### 6.1 对象存储使用成本与写放大仍是现实痛点
- **Issue #100960**  
  链接: ClickHouse/ClickHouse Issue #100960

用户在仅 2GB 数据规模下观察到 S3 PUT 暴增，说明大家不仅关心功能可用，更关心**请求数、费用、TTL 落盘策略是否可预测**。  
这类反馈对云上用户尤为重要，可能推动后续在文档、默认参数、批处理粒度、后台迁移策略方面做改进。

### 6.2 稳定版本中的 VIEW / PROJECTION / 统计设置回归更容易引发生产关注
- **Issue #101148**  
  链接: ClickHouse/ClickHouse Issue #101148
- **Issue #101082**  
  链接: ClickHouse/ClickHouse Issue #101082

这些问题共同反映：用户正在真实使用 projection、view、statistics 等较新的优化能力，而一旦出现回归，就不再是“边缘功能 bug”，而是会直接影响线上查询与 schema 运维。

### 6.3 时间类型边界语义仍然复杂
- **Issue #101096**  
  链接: ClickHouse/ClickHouse Issue #101096
- **Issue #101131**  
  链接: ClickHouse/ClickHouse Issue #101131
- **Issue #101132**  
  链接: ClickHouse/ClickHouse Issue #101132

DateTime64/Time64 相关问题今天集中出现，说明高精度时间类型在 cast、overflow、显示/比较一致性上仍是复杂区。  
这类问题通常出现在金融、IoT、时序分析、日志归档边界时间处理等对类型语义很敏感的场景。

### 6.4 用户希望 ClickHouse 更自然接入外部文件与数据湖
- **Issue #101072**  
  链接: ClickHouse/ClickHouse Issue #101072
- **PR #95181**  
  链接: ClickHouse/ClickHouse PR #95181

无论是 Dictionary 从 Parquet/S3/GCS 读取，还是 `url()` 支持 wildcard，本质都在表达一个诉求：  
**用户希望 ClickHouse 像现代分析平台一样，把外部对象、文件集合、湖格式当作一等数据源处理。**

---

## 7. 待处理积压

以下为值得维护者持续关注的长期或高价值积压项：

### 7.1 长期高价值功能请求：rolling hashes
- **Issue #81183** - Functions for rolling hashes  
  链接: ClickHouse/ClickHouse Issue #81183

创建于 2025-06-02，至今仍在开放状态。  
该需求虽然不属于主流 SQL 功能，但在内容分块、去重、同步、增量比对等场景有明显价值，适合评估是否以 UDF、实验函数或扩展函数集方式推进。

### 7.2 长周期 PR：`url` 表函数通配符
- **PR #95181** - Support wildcard for `url` table function  
  链接: ClickHouse/ClickHouse PR #95181

创建于 2026-01-26，仍未合并。  
这是典型的高用户价值易用性增强，若技术风险可控，建议尽快明确评审意见，避免长期悬置。

### 7.3 长周期 PR：Iceberg orphan files 治理
- **PR #99127** - Support remove_orphan_files for Iceberg tables  
  链接: ClickHouse/ClickHouse PR #99127

该 PR 直接关系到 Iceberg 表长期运维成本，尤其在对象存储环境下价值很高。  
建议维护者结合 release 节奏明确是否进入下一稳定版本。

### 7.4 长期 crash / assertion 类问题需尽快闭环
- **Issue #99799** - MergeTreeDataPartCompact double deletion  
  链接: ClickHouse/ClickHouse Issue #99799
- **Issue #101070** - ReplicatedMergeTreeQueue assertion  
  链接: ClickHouse/ClickHouse Issue #101070

两者都涉及底层引擎或复制逻辑，尽管部分表现于 CI，但如果没有明确 root cause 和 fix PR，仍需维持高优先级跟踪。

---

## 8. 健康度结论

ClickHouse 今日整体健康度可评为：**活跃且可控，但稳定性压力偏高**。  
积极面在于：  
- PR 流水充足，修复与功能推进并行；
- 文本索引、统计裁剪、对象存储与湖仓生态都在持续演进；
- 稳定分支已有主动 backport 动作。  

风险面在于：  
- 自动化扫描揭示出不少**细粒度语义漏洞**；
- 时间类型、函数确定性、视图/projection、统计设置等存在回归信号；
- CI flaky、sanitizer、assertion 类问题仍较多。  

如果接下来 1-3 天内能看到对 **#99799、#101148、#101082、#101096** 这类问题的 fix PR 或 maintainer 定性，项目短期健康度会进一步提升。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 — 2026-03-30

## 1. 今日速览

过去 24 小时 DuckDB 维持了较高活跃度：Issues 有 7 条更新，PR 有 23 条更新，说明社区与核心开发者仍在密集推进 1.5 线上的稳定性修复与引擎能力扩展。  
从内容看，今天的重心明显偏向 **查询正确性修复、Arrow/Geo 兼容性问题处理、CLI 与 ATTACH 语义完善，以及扩展可观测性/API 暴露**。  
值得注意的是，今天虽然没有新版本发布，也仅有 1 个 PR 关闭，但多条 PR 进入 `Ready For Review` / `Ready To Merge` 状态，表明一批改动已接近落地。  
整体健康度评价为 **积极且稳健**：问题暴露集中在边缘场景和新功能交汇处，没有看到大面积回归，但存在若干会导致崩溃或错误结果的高优先级缺陷，需要持续关注。

---

## 3. 项目进展

### 今日已关闭/完成的重要 PR

#### 1) CLI 帮助文本补全
- **PR**: [#16626 Add `-ui` to CLI help text](https://github.com/duckdb/duckdb/pull/16626)
- **状态**: Closed
- **意义**: 这是一个小改动，但直接改善 CLI 可发现性。对于 DuckDB 这类既面向嵌入式也面向交互式分析的项目，命令行入口体验会直接影响新用户上手效率。
- **影响面**: 属于文档/CLI 交互层改进，不涉及引擎行为变更。

### 今日推进中的关键 PR

#### 2) 修复 LEFT JOIN LATERAL 错误结果
- **PR**: [#21687 Preserve LEFT LATERAL filters during pushdown](https://github.com/duckdb/duckdb/pull/21687)
- **关联 Issue**: [#21609](https://github.com/duckdb/duckdb/issues/21609)
- **意义**: 这是今天最重要的查询正确性修复之一。问题出在 filter pushdown 对 `LEFT JOIN LATERAL` 的处理不当，可能在 `WHERE l.col IS NOT NULL` 这种过滤下仍保留本应被移除的行，属于 **wrong-result** 级别缺陷。
- **技术价值**: 说明优化器在 dependent/delim join 与外层过滤交互方面正在补齐边界语义。

#### 3) 修复 Arrow 格式串解析崩溃
- **PR**: [#21692 Fix stoi crash in Arrow format string parsing for w: and +w: types](https://github.com/duckdb/duckdb/pull/21692)
- **关联 Issue**: [#21691](https://github.com/duckdb/duckdb/issues/21691)
- **意义**: 解决 `std::stoi` 因 Arrow C Data Interface format string 中扩展元数据冒号被误识别而导致的崩溃，尤其影响带 CRS 的 `GEOMETRY('ogc:crs84')` 等场景。
- **技术价值**: 直接改善 DuckDB 与 Arrow / GeoParquet / 地理空间生态的互操作稳定性。

#### 4) 外部文件缓存参数化
- **PR**: [#21700 Make external file cache size tunable](https://github.com/duckdb/duckdb/pull/21700)
- **意义**: 将此前硬编码的 external file cache block size 改为可调，是典型的 **存储/IO 路径可调优能力增强**。
- **技术价值**: 对远程文件、对象存储、分层缓存场景尤其重要，释放了面向不同 workload 的性能调优空间。

#### 5) 完善 ATTACH 路径表达式能力
- **PR**: [#21693 Add expression as DatabasePath argument to ATTACH](https://github.com/duckdb/duckdb/pull/21693)
- **关联旧 PR**: [#21529](https://github.com/duckdb/duckdb/pull/21529)
- **意义**: 推进 `ATTACH` 在新 parser 下支持更灵活的路径表达式，反映出团队正在增强 SQL 层和 CLI/环境变量场景之间的连接能力。
- **技术价值**: 对自动化脚本、动态配置、多环境部署更友好。

#### 6) C API 元数据能力补强
- **PR**: [#20960 Add duckdb_prepared_column_origin_table C API function](https://github.com/duckdb/duckdb/pull/20960)
- **状态**: Ready For Review
- **意义**: 为 prepared statement 结果列返回完整源表名 `catalog.schema.table`。
- **技术价值**: 对 BI 工具、驱动适配层、结果集血缘展示、IDE 补全都很有帮助。

#### 7) 系统表暴露扩展来源
- **PR**: [#20752 chore: add extension_name to `duckdb_functions` and `duckdb_types`](https://github.com/duckdb/duckdb/pull/20752)
- **状态**: Ready To Merge
- **意义**: 为 `duckdb_functions()` / `duckdb_types()` 增加 `extension_name`，增强可观测性与治理能力。
- **技术价值**: 对扩展生态逐步壮大的 DuckDB 来说，这是很关键的“元数据透明化”建设。

---

## 4. 社区热点

### 1) CLI 输出与 `.tables` 崩溃问题
- **Issue**: [#21378 duckdb cli 1.5.x ".tables" probably with sqlite and "-table" output issues](https://github.com/duckdb/duckdb/issues/21378)
- **状态**: Closed
- **热度**: 评论 8，为今日已展示 issue 中讨论最多。
- **看点**: 涉及 `.tables` 内部错误，以及 `-table` 输出中 varchar/timestamp 字段重复渲染等问题。
- **技术诉求分析**: 用户不仅关心核心执行引擎，也非常依赖 CLI 做轻量数据探索。CLI 若在 SQLite 兼容命令和表格输出上不稳定，会显著影响 DuckDB “开箱即用”的体验。

### 2) JSON → Variant 转换导致内部错误
- **Issue**: [#21352 Internal error when converting json to variant](https://github.com/duckdb/duckdb/issues/21352)
- **状态**: Open
- **热度**: 评论 6
- **看点**: 触发 `INTERNAL Error: Field is missing but untyped_value_index is not set`
- **技术诉求分析**: 这是新类型系统/半结构化数据能力扩展后最典型的反馈之一。用户期待 DuckDB 在 `JSON`、`Variant`、Parquet 等格式之间进行稳定转换，这也是其作为现代分析引擎的重要能力边界。

### 3) ATTACH 二次连接沿用旧 attach string
- **Issue**: [#21618 Attach string is not picked up when creating a second connection in a session](https://github.com/duckdb/duckdb/issues/21618)
- **状态**: Open
- **热度**: 评论 5
- **技术诉求分析**: 这反映的是会话级状态管理与连接器/外部 catalog 语义的一致性问题。对多连接、临时环境、嵌入式 Python 场景尤其敏感。

### 4) 结构体在 CLI 中的可复制性
- **Issue**: [#14152 Quoting struct members when shown in CLI to make copy/paste easier into where clause](https://github.com/duckdb/duckdb/issues/14152)
- **状态**: Open
- **标签**: reproduced, stale, feature
- **技术诉求分析**: 这不是性能或崩溃问题，但体现了高级类型在“查询—观察—复制—再查询”闭环中的易用性不足。随着 struct/list 等复杂类型越来越常用，这类 UX 诉求会持续增加。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高优先级：查询结果错误

#### 1) LEFT JOIN LATERAL + 外层 `IS NOT NULL` 过滤仍保留空匹配行
- **Issue**: [#21609](https://github.com/duckdb/duckdb/issues/21609)
- **Fix PR**: [#21687](https://github.com/duckdb/duckdb/pull/21687)
- **类型**: Wrong-result / 优化器语义错误
- **影响**: 可能返回错误结果，严重性高于普通崩溃，因为错误结果更难被用户察觉。
- **结论**: 已有针对性修复 PR，建议高优先级审查合并。

### P1 / 高优先级：崩溃与内部错误

#### 2) JSON 转 Variant 触发内部错误
- **Issue**: [#21352](https://github.com/duckdb/duckdb/issues/21352)
- **类型**: Internal error / 半结构化数据处理
- **现状**: 已复现，但目前未见直接修复 PR。
- **影响**: 阻碍 JSON、Parquet、Variant 工作流；对新类型功能稳定性有负面信号。

#### 3) Arrow 格式串解析对参数化类型崩溃
- **Issue**: [#21691](https://github.com/duckdb/duckdb/issues/21691)
- **Fix PR**: [#21692](https://github.com/duckdb/duckdb/pull/21692)
- **类型**: 崩溃 / 互操作兼容性
- **影响**: 波及 Arrow C Data Interface 与 GeoParquet/geometry 扩展元数据场景。
- **结论**: 已有修复，属于响应迅速的稳定性处理案例。

#### 4) row_count = 0 时出现除零
- **PR**: [#21698 Fix div by 0 when row_count is 0](https://github.com/duckdb/duckdb/pull/21698)
- **类型**: 执行/优化路径中的边界条件 bug
- **背景**: 由 filter pushdown 丢弃全部输入记录时触发。
- **影响**: 属于典型空输入边界缺陷，容易在复杂查询优化下暴露。

### P2 / 中优先级：功能错误或语义不一致

#### 5) `geometry IS NULL` 条件失效
- **Issue**: [#21630](https://github.com/duckdb/duckdb/issues/21630)
- **状态**: under review
- **类型**: SQL 语义错误 / 空值处理
- **影响**: 影响空间类型一致性，尤其是 GIS 分析场景。
- **结论**: 若属普遍复现，应提升优先级，因为 `IS NULL` 是基础语义。

#### 6) 同一 session 中第二次连接未正确采用新的 attach string
- **Issue**: [#21618](https://github.com/duckdb/duckdb/issues/21618)
- **类型**: 会话状态/连接管理问题
- **影响**: 嵌入式和多连接场景会产生混淆，可能误操作到错误数据源。

#### 7) CLI `.tables` / `-table` 输出问题
- **Issue**: [#21378](https://github.com/duckdb/duckdb/issues/21378)
- **状态**: Closed
- **类型**: CLI 稳定性与输出正确性
- **结论**: 今日已关闭，说明已有处理或确认解决。

---

## 6. 功能请求与路线图信号

### 1) ATTACH 语法继续增强，动态路径支持概率较高
- **PR**: [#21693](https://github.com/duckdb/duckdb/pull/21693)
- **相关 PR**: [#21529](https://github.com/duckdb/duckdb/pull/21529)
- **信号**: `ATTACH` 支持表达式形式的数据库路径，说明 DuckDB 正在提升 SQL 层对动态部署、环境配置和脚本化操作的支持。
- **判断**: 若 parser 兼容性和安全性讨论达成一致，进入下一版本的可能性较高。

### 2) 外部缓存参数可调，面向远程存储 workload 的调优能力增强
- **PR**: [#21700](https://github.com/duckdb/duckdb/pull/21700)
- **信号**: 这类参数化通常不是一次性 patch，而是对象存储/外部文件访问体系逐步成熟的标志。
- **判断**: 很可能被纳入后续版本，尤其适合 cloud/object-store 用户。

### 3) 扩展可观测性与可序列化接口明显增强
- **PR**:
  - [#21695 Add read-only accessors to BloomFilter and BFTableFilter](https://github.com/duckdb/duckdb/pull/21695)
  - [#21697 Add read-only accessors to PrefixRangeFilter and PrefixRangeTableFilter](https://github.com/duckdb/duckdb/pull/21697)
  - [#21696 Add read-only accessors to PerfectHashJoinExecutor and PerfectHashJoinFilter](https://github.com/duckdb/duckdb/pull/21696)
- **信号**: 这些 PR 共同指向一个方向：**让扩展能够读取并传输内部过滤器/连接执行器状态**。
- **判断**: 这对自定义扩展、分布式场景、下推/缓存/调试工具非常有价值，可能逐步成为扩展 API 路线的重要部分。

### 4) 元数据与血缘能力继续补齐
- **PR**:
  - [#20960](https://github.com/duckdb/duckdb/pull/20960)
  - [#20752](https://github.com/duckdb/duckdb/pull/20752)
- **信号**: C API 和系统表同时增强对象来源信息，说明团队正提升 DuckDB 被外部工具链集成时的“可解释性”。

### 5) CLI 复杂类型可复制性仍是未解 UX 需求
- **Issue**: [#14152](https://github.com/duckdb/duckdb/issues/14152)
- **信号**: 尽管 issue 较老且 stale，但今天仍有更新，说明用户确实在复杂类型交互方面存在持续需求。
- **判断**: 短期未必优先，但可能在 CLI/formatter 改进中被顺手纳入。

---

## 7. 用户反馈摘要

### 1) 用户越来越多地在真实生产风格数据上测试 DuckDB 的半结构化能力
- **证据**: [#21352](https://github.com/duckdb/duckdb/issues/21352)
- **反馈点**: JSON 文本 → JSON → Variant 的链路出现内部错误，说明用户已经开始把 DuckDB 当作现代多格式分析引擎，而不只是传统 SQL OLAP 引擎。

### 2) 多连接/多数据源会话管理是嵌入式用户的真实痛点
- **证据**: [#21618](https://github.com/duckdb/duckdb/issues/21618)
- **反馈点**: 第二次连接沿用旧 attach string，反映用户在 Python/程序化环境里频繁切换数据源，期望 DuckDB 具备更稳定的 session 语义。

### 3) 用户对“结果可直接复制回 SQL”有强烈期待
- **证据**: [#14152](https://github.com/duckdb/duckdb/issues/14152)
- **反馈点**: struct 输出若不能直接复制到 `WHERE` 子句，会增加分析迭代成本。这类诉求体现了 CLI 在探索式分析中的重要地位。

### 4) 地理空间与 Arrow 生态用户正在推动更多兼容性修复
- **证据**:
  - [#21691](https://github.com/duckdb/duckdb/issues/21691)
  - [#21630](https://github.com/duckdb/duckdb/issues/21630)
  - [#21688](https://github.com/duckdb/duckdb/pull/21688)
- **反馈点**: Geo/Arrow 场景的问题集中在类型解析、NULL 语义与 CRS 元数据，说明 DuckDB 的空间分析用户群在增长。

### 5) 用户对 EXPLAIN 可读性和优化器透明度也有持续需求
- **PR**: [#21694 Truncate InFilter display in EXPLAIN plans](https://github.com/duckdb/duckdb/pull/21694)
- **反馈点**: 当动态过滤阈值变大时，EXPLAIN 输出难以使用。用户不仅关心“跑得快”，也关心“能不能理解为什么快/为什么错”。

---

## 8. 待处理积压

### 1) 较老但仍活跃：CLI 中 struct 成员引用格式优化
- **Issue**: [#14152](https://github.com/duckdb/duckdb/issues/14152)
- **状态**: Open / stale / feature
- **提醒**: 虽非高优先级 bug，但它长期代表复杂类型 UX 的短板，建议维护者决定是纳入 formatter 改进计划，还是明确设计取舍。

### 2) Variant 转换内部错误尚无明确修复 PR
- **Issue**: [#21352](https://github.com/duckdb/duckdb/issues/21352)
- **提醒**: 这是影响新类型能力可信度的重要问题，应尽快确认归属模块并给出修复计划。

### 3) 索引 API 重构长期悬而未决
- **PR**: [#20638 Refactor Index API](https://github.com/duckdb/duckdb/pull/20638)
- **状态**: Open / Merge Conflict
- **提醒**: 这是基础设施级改造，牵涉 custom indexes、materialization、parallelism，价值高但拖延成本也高，建议重新切分 scope 或明确里程碑。

### 4) union casting 规则修复仍在评审
- **PR**: [#20706 Fix union type casting rules](https://github.com/duckdb/duckdb/pull/20706)
- **状态**: Ready For Review
- **提醒**: union 类型仍属较新能力，类型转换规则若长期悬置，容易形成兼容性碎片。

### 5) clang-tidy/noexcept 检测改进处于 stale
- **PR**: [#21118 Detect throw noexcept using clang-tidy](https://github.com/duckdb/duckdb/pull/21118)
- **状态**: Open / stale
- **提醒**: 虽不直接影响功能，但这类工程质量工具改进通常能提前发现异常路径问题，值得决定去留。

---

## 附：今日值得重点关注的链接

- Wrong-result 修复：[#21609](https://github.com/duckdb/duckdb/issues/21609) / [#21687](https://github.com/duckdb/duckdb/pull/21687)
- Arrow/Geo 崩溃修复：[#21691](https://github.com/duckdb/duckdb/issues/21691) / [#21692](https://github.com/duckdb/duckdb/pull/21692)
- Variant 内部错误：[#21352](https://github.com/duckdb/duckdb/issues/21352)
- ATTACH 语义与 parser 增强：[#21618](https://github.com/duckdb/duckdb/issues/21618) / [#21693](https://github.com/duckdb/duckdb/pull/21693) / [#21529](https://github.com/duckdb/duckdb/pull/21529)
- 外部缓存可调：[#21700](https://github.com/duckdb/duckdb/pull/21700)
- 扩展/元数据能力增强：[#20960](https://github.com/duckdb/duckdb/pull/20960) / [#20752](https://github.com/duckdb/duckdb/pull/20752)

**总体判断**：DuckDB 今日的开发信号非常明确——继续围绕 **正确性、互操作性、扩展生态可观测性和实际易用性** 做迭代。短期最该优先推进的是 wrong-result 与崩溃类修复；中期则可关注 ATTACH、缓存调优和扩展 API 暴露，这些很可能成为下一阶段版本价值点。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-30）

## 1. 今日速览

过去 24 小时内，StarRocks 社区整体活跃度**中等偏上**：有 **10 条 PR 更新**、**1 条 Issue 更新**，但**无新版本发布**。  
从变更内容看，今天的工作重心主要集中在 **查询规划器正确性修复、编译/工具链兼容性、时区函数稳定性、文档维护** 这几类主题。  
值得注意的是，今日唯一关闭的 PR 是一个 **clang 构建失败修复**，说明项目在持续处理底层工程稳定性问题；与此同时，多个仍在推进的 PR 涉及 **Schema 变更能力增强、Thrift 升级、UDF 从 S3 加载**，释放出面向下一阶段可用性与扩展性的路线图信号。  
Issues 侧新增内容主要是 **文档反馈周报**，说明社区当天用户侧“新缺陷爆发”并不明显，项目健康度总体保持稳定。  

---

## 3. 项目进展

### 已关闭 / 已推进的重要 PR

#### 1) 修复 clang 构建失败，提升工程稳定性
- **PR**: #70932 `[BugFix] fix clang build failure in template parameter`
- **状态**: 已关闭
- **链接**: https://github.com/StarRocks/starrocks/pull/70932

**解读：**  
该修复针对模板参数签名与聚合状态类型变更之间的不匹配问题，核心是兼容 `ArrayAggAggregateState` 在此前重构后新增的模板参数。  
这类问题虽然不直接影响 SQL 功能，但属于典型的 **构建系统/编译器兼容性回归**，会直接影响 CI、开发者本地编译以及跨环境发布稳定性。对一个含大量 C++ 模板元编程代码的分析型数据库来说，这类修复的重要性很高。

**推进意义：**
- 降低 BE 代码在 clang 环境下的构建风险
- 为后续聚合算子/模板重构提供更稳的工程基础
- 有利于多编译器链路一致性验证

---

### 今日重点推进中的 PR

#### 2) 支持 varchar 扩容的 schema evaluation，增强在线 Schema Evolution 能力
- **PR**: #70747 `[4.1] [Enhancement] Support schema evaluation for widening varchar length with key/non-key column`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/70747

**解读：**  
该 PR 目标明确：支持 **key / sort key / distribution key / partition key** 以及非 key 列的 `VARCHAR` 长度扩容，并兼容 **share-nothing** 与 **share-data** 模式，以及 **regular/fast path**。  
这属于非常关键的 **Schema Evolution 增强**。分析型数据库在生产中常见“字段长度预估不足”，若关键列也能更平滑地扩容，将显著降低线上表结构调整成本。

**可能影响：**
- 提升 DDL 兼容性与运维便利性
- 对表模型与元数据校验逻辑提出更高一致性要求
- 可能成为 4.1 版本的重要易用性增强点

---

#### 3) 修复 GLM 拆分 projection 后输出列陈旧问题，属于查询正确性/规划器稳定性修复
- **PR**: #70929 `[BugFix] Fix stale project output columns after GLM split projection`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/70929

**解读：**  
这是今天最值得关注的执行层/优化器相关修复之一。PR 描述指出：在某些 cost-based GLM 场景下，嵌入式 projection 被拆成独立 `PhysicalProjectOperator` 后，新节点继承了子节点逻辑属性，导致 `outputColumns` 与 projection 表达式不一致，进而触发 planner failure。  

**推进意义：**
- 修复优化器变换后属性不一致导致的失败
- 提升复杂查询在 GLM 场景下的稳定性
- 这是典型的 **查询规划正确性 bug**，优先级应高于一般文档或工具链改动

---

#### 4) 升级 cctz，修复 `CONVERT_TZ` 在特定非洲时区返回 NULL 的问题
- **PR**: #70867 `[4.1] [BugFix] Upgrade cctz v2.3 -> v2.4 to fix CONVERT_TZ returning NULL for Africa/Casablanca and Africa/El_Aaiun`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/70867

**解读：**  
这是一个明确的 **SQL 函数正确性/时区库依赖问题**。`CONVERT_TZ` 在 `Africa/Casablanca`、`Africa/El_Aaiun` 返回 NULL，会影响跨区域报表、时序分析与日志归档类业务。  
通过升级 `cctz` 版本修复，说明问题根源更偏向依赖库数据/实现，而非 SQL 层逻辑本身。

**推进意义：**
- 提升时区转换的结果正确性
- 降低国际化业务在特定时区上的数据偏差风险
- 若进入 4.1，将属于用户可感知度很高的修复

---

#### 5) UDF 支持从 S3 加载，扩展函数部署方式
- **PR**: #64541 `[META-REVIEW, PROTO-REVIEW, 4.0] [Feature] Support loading UDF on S3`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/64541

**解读：**  
该 PR 是今天最明显的 **功能路线图信号** 之一。当前 StarRocks UDF 仅支持 HTTP 或本地路径，新增 S3 下载能力后，用户可以通过对象存储统一管理 UDF 制品，更适合云原生部署与多集群共享场景。  

**潜在价值：**
- 改善 UDF 发布流程
- 更贴近云上数据平台的资产管理模式
- 对权限、缓存、失败重试、校验和安全策略提出更高要求

---

#### 6) 工具链升级：BE 侧 Thrift 从 0.20 升到 0.22
- **PR**: #70822 `[PROTO-REVIEW] [Tool] Bump thrift on BE from v0.20 to v0.22`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/70822

#### 7) 引入 thrift raw deserializer，推进序列化/反序列化底层重构
- **PR**: #70931 `[Refactor] Introduce thrift raw desrializer`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/70931

**解读：**  
这两个 PR 一起看更有意义：一边升级 Thrift 版本，一边引入更底层的 raw deserializer，说明 StarRocks 正在推进 **BE 通信/序列化链路的基础设施演进**。  
这类改动短期不一定对终端用户可见，但可能影响：
- RPC/元数据交互性能
- 跨版本兼容性验证
- 内存拷贝、反序列化开销
- 未来协议演进空间

---

## 4. 社区热点

> 注：给定数据中未提供评论数明细（多处为 `undefined`），因此以下热点根据“更新活跃度 + 技术影响范围”综合判断。

### 热点 1：Schema Evolution 能力增强
- **PR**: #70747
- **链接**: https://github.com/StarRocks/starrocks/pull/70747

**背后技术诉求：**  
生产环境中表结构经常需要扩展字段长度，尤其是业务主键、分区键、排序键一旦设计偏小，会造成长期运维负担。该 PR 反映出用户希望 StarRocks 的 schema change 能像现代 OLAP 引擎一样，支持更多在线、低风险的兼容性变更。

---

### 热点 2：云原生 UDF 交付能力
- **PR**: #64541
- **链接**: https://github.com/StarRocks/starrocks/pull/64541

**背后技术诉求：**  
用户已不满足于本地路径或临时 HTTP 服务分发 UDF，而希望使用 S3 这样的对象存储作为统一制品仓库。这说明 StarRocks 用户场景正在进一步走向：
- 云上部署
- 多租户平台
- 自动化发布/回滚
- 更规范的函数资产管理

---

### 热点 3：查询优化器正确性修复
- **PR**: #70929
- **链接**: https://github.com/StarRocks/starrocks/pull/70929

**背后技术诉求：**  
用户和维护者更关注的是：优化器在做复杂 rewrite 后，不能牺牲 plan property 的一致性。  
这类问题往往不是“性能波动”，而是 **直接导致 planner failure 或错误计划**，因此在分析型数据库中优先级很高。

---

### 热点 4：文档反馈自动汇总
- **Issue**: #70933 `Weekly documentation feedback from readers`
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/issues/70933

**背后技术诉求：**  
Issue 摘要显示它汇总了待读文档 PR 和读者反馈，说明 StarRocks 在持续建设 **文档反馈闭环**。这通常意味着项目不仅关注内核能力，也在提升自助化上手体验、搜索命中率和权限相关文档准确性。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：查询规划器失败风险
- **PR**: #70929 `Fix stale project output columns after GLM split projection`
- **链接**: https://github.com/StarRocks/starrocks/pull/70929
- **影响类型**: 查询正确性 / Planner failure
- **状态**: 已有修复 PR，待合并

**评估：**  
如果触发条件满足，可能直接导致查询计划生成失败，属于高优先级稳定性问题。

---

### P1：特定时区下 `CONVERT_TZ` 返回 NULL
- **PR**: #70867
- **链接**: https://github.com/StarRocks/starrocks/pull/70867
- **影响类型**: SQL 函数正确性
- **状态**: 已有修复 PR，待合并

**评估：**  
会影响使用非洲特定时区的时间转换结果，属于结果正确性问题。对国际化业务、跨时区报表较敏感。

---

### P2：clang 构建失败
- **PR**: #70932
- **链接**: https://github.com/StarRocks/starrocks/pull/70932
- **影响类型**: 编译稳定性 / 工程可维护性
- **状态**: 已关闭

**评估：**  
对终端查询结果无直接影响，但会影响开发迭代效率、CI 可靠性与版本构建链路。

---

### P2：禁用 JIT 时单元测试编译问题
- **PR**: #70930 `[UT] fix UT compile when disable JIT`
- **链接**: https://github.com/StarRocks/starrocks/pull/70930
- **状态**: Open

**评估：**  
这反映出 StarRocks 在非默认构建配置下仍存在测试覆盖/编译兼容性问题。虽然不是线上 bug，但会削弱回归验证质量。

---

## 6. 功能请求与路线图信号

### 1) UDF 从 S3 加载：较强的版本纳入信号
- **PR**: #64541
- **链接**: https://github.com/StarRocks/starrocks/pull/64541

**判断：**  
带有 `META-REVIEW`、`PROTO-REVIEW` 与版本标签 `4.0`，说明该功能处于较正式的评审流程中，不只是零散想法。  
若评审顺利，它很可能成为后续版本中面向云环境的重要增强功能。

---

### 2) varchar 扩容：高价值易用性增强，值得重点跟踪
- **PR**: #70747
- **链接**: https://github.com/StarRocks/starrocks/pull/70747

**判断：**  
该项能力覆盖 key/non-key、多种 table model 和多种执行路径，明显不是小修小补，而是系统性增强。  
这类改动一旦稳定，通常会被纳入对外版本亮点，因为它直接降低用户做 schema 变更的成本。

---

### 3) Thrift 升级与 raw deserializer：基础设施演进信号
- **PR**: #70822
- **链接**: https://github.com/StarRocks/starrocks/pull/70822
- **PR**: #70931
- **链接**: https://github.com/StarRocks/starrocks/pull/70931

**判断：**  
这类变更不是直接面向 SQL 用户的 feature，但通常是更大范围性能优化、协议演进或代码整洁化的前置工作。  
如果后续几天继续出现相关 PR，可判断 StarRocks 正在推进 BE 通信和序列化栈的阶段性重构。

---

## 7. 用户反馈摘要

### 文档侧：权限与访问控制仍是易混淆区域
- **Issue**: #70933
- **链接**: https://github.com/StarRocks/starrocks/issues/70933
- **相关 PR**: #70903、#70883（在 Issue 摘要中被提及）

**提炼出的用户痛点：**
- Web 控制台访问所需角色说明不够清晰
- Ranger 插件相关的标签访问控制文档仍需维护者关注
- 文档搜索与读者反馈机制仍在持续优化中

这说明用户在实际部署时，除了关心 SQL 与性能，也很在意：
- 权限模型是否易理解
- 控制台访问是否容易踩坑
- 安全治理文档是否与当前实现一致

---

### 国际化与时区正确性是实际生产诉求
- **PR**: #70867
- **链接**: https://github.com/StarRocks/starrocks/pull/70867

从该修复可以反推出，用户对 `CONVERT_TZ` 的使用不是边缘场景，而是真实生产场景中的常用能力。时区库版本落后导致特定地区结果异常，说明用户对 SQL 函数在全球时区范围内的一致性已有更高要求。

---

### 云上函数管理需求增强
- **PR**: #64541
- **链接**: https://github.com/StarRocks/starrocks/pull/64541

这反映出部分用户已经将 StarRocks 作为更大数据平台的一部分，希望：
- UDF 制品集中托管
- 减少本地文件分发
- 与对象存储、权限体系、CI/CD 集成

---

## 8. 待处理积压

### 1) 长期在审：S3 UDF 加载
- **PR**: #64541
- **创建时间**: 2025-10-24
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/64541

**提醒：**  
这是一个存在时间较长、但业务价值明确的功能 PR。由于它涉及 FE/下载器/云存储访问等多个方面，评审周期可能较长。建议维护者明确：
- 安全模型
- 凭证与权限策略
- 缓存/失败重试机制
- 与现有 UDF 管理方式的兼容关系

---

### 2) Schema Evolution 增强需尽快明确边界与回归覆盖
- **PR**: #70747
- **状态**: Open
- **链接**: https://github.com/StarRocks/starrocks/pull/70747

**提醒：**  
该 PR 涉及 key 列、分区列、分布列等高敏感结构变更，建议尽快补齐：
- 不同表模型的回归测试
- fast path / regular path 一致性验证
- 元数据回滚与失败恢复路径验证

---

### 3) 工具链升级类 PR 需要联动验证
- **PR**: #70822
- **链接**: https://github.com/StarRocks/starrocks/pull/70822
- **PR**: #70931
- **链接**: https://github.com/StarRocks/starrocks/pull/70931

**提醒：**  
Thrift 升级与反序列化重构存在潜在联动风险。建议维护者重点检查：
- ABI/API 兼容性
- FE/BE 交互链路
- 回归性能数据
- 跨版本集群混部场景

---

## 附：今日关注链接汇总

- Issue #70933: Weekly documentation feedback from readers  
  https://github.com/StarRocks/starrocks/issues/70933

- PR #70932: fix clang build failure in template parameter  
  https://github.com/StarRocks/starrocks/pull/70932

- PR #70929: Fix stale project output columns after GLM split projection  
  https://github.com/StarRocks/starrocks/pull/70929

- PR #70867: Upgrade cctz to fix CONVERT_TZ NULL issue  
  https://github.com/StarRocks/starrocks/pull/70867

- PR #70747: Support schema evaluation for widening varchar length  
  https://github.com/StarRocks/starrocks/pull/70747

- PR #64541: Support loading UDF on S3  
  https://github.com/StarRocks/starrocks/pull/64541

- PR #70822: Bump thrift on BE from v0.20 to v0.22  
  https://github.com/StarRocks/starrocks/pull/70822

- PR #70931: Introduce thrift raw desrializer  
  https://github.com/StarRocks/starrocks/pull/70931

如果你愿意，我还可以进一步把这份日报整理成：
1. **适合飞书/Slack 发布的简版晨报**，或  
2. **按“查询引擎 / 存储 / 生态 / 文档”四大模块重排的技术版日报**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-30）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：**Issues 更新 3 条，PR 更新 19 条**，但**无新版本发布**。  
从变更结构看，当前工作重心仍集中在 **AWS/S3 稳定性、Spark/Kafka Connect 功能补强、CI/基础设施治理，以及文档/规范完善**。  
已关闭/结束的 PR 有 3 条，但当天没有明显的大规模功能合并，说明项目目前更像处于**持续打磨与评审推进阶段**，而非集中发布阶段。  
整体健康度较好：跨模块贡献持续活跃，不过也可见部分 **stale PR/Issue 积压**，尤其在 Spark、文档治理和事务一致性相关方向上需要维护者进一步收敛。

---

## 3. 项目进展

### 今日关闭/结束的 PR

#### 1) Data: Support listing files from hive partitions with subdirectories
- 状态：**Closed**
- 链接：apache/iceberg PR #15388
- 标签：`data, stale`
- 摘要：尝试为 `TableMigrationUtil` 增加对 Hive 分区子目录中文件的扫描支持，以避免迁移 Hive 表时遗漏数据文件。

**影响分析：**
- 这是一个偏 **数据迁移正确性** 的改进，针对 Hive 生态中较常见的“分区目录下嵌套子目录”场景。
- 如果该问题不解决，可能在从 Hive 表迁移到 Iceberg 时出现 **静默漏数** 风险。
- 本次 PR 已关闭，意味着该方向暂未进入主线，相关用户场景仍需后续新方案承接。

---

#### 2) [WIP] Replace transactions rebase onto refreshed metadata
- 状态：**Closed**
- 链接：apache/iceberg PR #15092
- 标签：`core, stale`
- 摘要：试图修复 `BaseTransaction.commitReplaceTransaction()` 在并发变更下基于陈旧 metadata 提交的问题。

**影响分析：**
- 这是 **核心事务一致性** 层面的提案，涉及 `REPLACE` 类事务在并发环境中的元数据刷新与重放。
- 该问题若存在，可能引发 **并发提交下的元数据覆盖、提交语义偏差或变更丢失**，属于高价值但高复杂度修复。
- PR 被关闭且带有 WIP/stale 特征，说明维护上可能认为方案尚不成熟；这一方向仍值得重点跟踪。

---

#### 3) API, Core: Add overwrite-aware table registration
- 状态：**Closed**
- 链接：apache/iceberg PR #15525
- 标签：`API, core`
- 摘要：希望把 REST catalog 已支持的 `overwrite` 注册表能力暴露到 core `Catalog` API。

**影响分析：**
- 这是一个 **Catalog API 能力补齐** 的工作，有助于 API 与 REST catalog 行为对齐。
- 对外部引擎/接入层来说，这类能力可以提升建表/注册表的可编程性和一致性。
- 虽然 PR 已关闭，但它释放了一个清晰路线图信号：**Catalog 注册能力仍在向更完整、更可覆盖的接口语义演进**。

---

### 今日仍在推进、值得关注的方向

#### AWS / S3 稳定性增强密集推进
- [#15792](apache/iceberg PR #15792) AWS: handle premature connection close  
- [#15242](apache/iceberg PR #15242) AWS: Add chunked encoding configuration for S3 requests  
- [#15818](apache/iceberg PR #15818) AWS: Close custom AwsCredentialsProvider in RESTSigV4AuthSession  
- [#15460](apache/iceberg PR #15460) AWS: apply client.region to StsClient in AssumeRoleAwsClientFactory  
- [#15304](apache/iceberg PR #15304) Enable to configure metrics-publisher in AWS client factory  

**结论：**
AWS 模块是当前最活跃的工程面之一，重点覆盖：
- 长时间 Parquet 向量化读取下的连接提前关闭问题
- S3 请求编码配置
- 凭证 provider 生命周期释放
- STS Region 继承
- 客户端可观测性增强

这说明 Iceberg 在对象存储读写路径上的**生产级稳定性优化**仍是当前重点。

---

#### Kafka Connect 功能与正确性持续修补
- [#15639](apache/iceberg PR #15639) Fix multi-topic routing to prevent writing all records to all tables  
- [#15651](apache/iceberg PR #15651) Per-commitId group separation for stale DataWritten recovery  
- 对应 Issue：[#15293](apache/iceberg Issue #15293) Metadata is not committed after Kafka cluster recreation

**结论：**
Kafka Connect 方向今天非常值得关注，问题都集中在：
- **多 topic 路由错误导致误写表**
- **提交失败后 stale DataWritten 残留影响后续 commit**
- **Kafka 集群重建后 metadata 不再提交**

这些不是单纯易用性问题，而是直接触及 **数据正确性与元数据提交可靠性** 的生产风险。

---

#### Spark 能力仍在扩展，但部分提案进入 stale 区
- [#15472](apache/iceberg PR #15472) Spark: Add streaming-starting-offset read option  
- [#15310](apache/iceberg PR #15310) Spark: Add data file path for range partition when rewriting manifests  
- 对应 Issue：[#15779](apache/iceberg Issue #15779) Spark views are appearing as tables

**结论：**
Spark 方向一方面继续增强流式读取控制和 manifest rewrite 能力，另一方面也暴露出 **视图语义兼容性问题**，尤其是与 Hive catalog 的交互还存在边界不一致。

---

## 4. 社区热点

### 热点 1：Kafka 集群重建后 metadata 无法提交
- 链接：apache/iceberg Issue #15293
- 状态：OPEN
- 评论：2
- 👍：1

**为什么值得关注：**
这是今天最典型的生产故障类反馈。问题描述显示：
- 数据文件（parquet）已经写出成功
- 但 metadata commit 停止
- 触发条件是 **Kafka 集群整体重建**

**背后技术诉求：**
用户真正关心的是 **Kafka Connect sink 在灾难恢复、集群重建、offset/协调状态重置后的幂等恢复能力**。  
这类问题若处理不好，会导致：
- 数据文件与表元数据脱节
- 下游读者不可见新数据
- 运维排障复杂度极高

**关联修复线索：**
- [#15651](apache/iceberg PR #15651)
- [#15639](apache/iceberg PR #15639)

虽然不是直接 fix，但都说明 Kafka Connect 子系统近期正在集中治理。

---

### 热点 2：Spark 创建的 Iceberg 视图显示成表
- 链接：apache/iceberg Issue #15779
- 状态：OPEN
- 评论：2

**为什么值得关注：**
该问题指向 **Spark + Hive catalog + Iceberg views** 的对象语义不一致。用户预期创建 view，实际在 schema 中表现为 table。

**背后技术诉求：**
- 统一 Spark SQL 与 Iceberg catalog 的对象模型
- 改善 Hive catalog 下视图可见性与元数据映射
- 减少 BI/数据治理系统对“表/视图”识别混乱

这类问题对功能完整性影响大，特别是企业环境中的共享 catalog 使用场景。

---

### 热点 3：Hive Catalog 下 schema evolution 文档补充
- 链接：apache/iceberg PR #15814
- 状态：OPEN

**为什么值得关注：**
虽然是文档 PR，但它揭示了真实兼容性坑点：  
在 Hive catalog 中，涉及**列位置变化**的 schema evolution（删中间列、列重排）会触发 Hive Metastore 的不兼容校验异常。

**背后技术诉求：**
用户希望：
- 在执行 schema evolution 前明确知道哪些操作在 Hive catalog 下不可行
- 避免“SQL 看起来合法、执行时才失败”的体验
- 降低跨 catalog 使用 Iceberg 时的认知成本

这实际上反映了 Iceberg 对多 catalog 兼容边界的持续文档化需求。

---

## 5. Bug 与稳定性

以下按潜在严重程度排序。

### P1：Kafka Connect 元数据不提交，数据文件已写出
- 链接：apache/iceberg Issue #15293
- 严重程度：**高**
- 场景：Kafka 集群完全重建后，sink 停止提交 metadata，但 parquet 文件已正常写入。
- 风险：
  - 数据文件与 snapshot/metadata 脱钩
  - 下游查询不可见
  - 可能形成“存储中有数据，表里无数据”的隐蔽故障
- 是否已有 fix PR：**暂无直接修复 PR 明确关联**
- 可参考相关改进：
  - [#15651](apache/iceberg PR #15651)
  - [#15639](apache/iceberg PR #15639)

---

### P1：Kafka Connect 多 topic 路由错误可能导致跨表误写
- 链接：apache/iceberg PR #15639
- 严重程度：**高**
- 摘要：在未设置 `iceberg.tables.route-field` 时，如果多个 topic 的表具有相同 id-columns 和相似 schema，记录可能被广播写入所有表。
- 风险：
  - **数据污染**
  - 多表错误写入
  - 事后修复成本极高
- 状态：OPEN
- 判断：这是非常典型的 **查询/写入正确性问题**，优先级应高。

---

### P1：stale DataWritten 事件残留影响后续 commit
- 链接：apache/iceberg PR #15651
- 严重程度：**高**
- 摘要：当 `Coordinator.doCommit()` 失败或超时时，上一轮提交遗留的 `DataWritten` 事件会与下一轮成功提交混合。
- 风险：
  - 提交内容污染
  - 重复/错误合并写入事件
  - 影响 Kafka Connect 恢复正确性
- 状态：OPEN
- 判断：同样属于生产写入链路中的一致性缺陷修复。

---

### P2：S3 长连接读取时连接被提前关闭
- 链接：apache/iceberg PR #15792
- 严重程度：**中高**
- 摘要：Parquet 向量化读取时，`S3InputStream` 发起无限范围请求，Spark 长时间处理内存中 row group 期间若客户端不持续读取，连接可能因 TCP/服务端策略而提前关闭。
- 风险：
  - 长批次扫描稳定性下降
  - 大 row group / 慢计算场景下读取失败
  - 云存储环境中特别敏感
- 状态：OPEN
- 是否已有 fix PR：**是，该 PR 本身即修复方案**

---

### P2：Spark 视图被错误呈现为表
- 链接：apache/iceberg Issue #15779
- 严重程度：**中**
- 风险：
  - 元数据对象类型错误
  - SQL 管理体验不一致
  - 依赖 catalog introspection 的工具链可能受影响
- 是否已有 fix PR：**暂无**

---

### P3：Hive 表迁移时可能遗漏子目录文件
- 链接：apache/iceberg PR #15388
- 严重程度：**中**
- 风险：
  - 数据迁移漏文件
  - Hive 历史表兼容性不足
- 状态：CLOSED
- 是否已有 fix PR：**本 PR 已关闭，暂无落地主线**

---

### P3：事务 replace 在并发场景下可能基于陈旧 metadata 提交
- 链接：apache/iceberg PR #15092
- 严重程度：**中高，但修复未推进**
- 风险：
  - 并发元数据一致性风险
- 状态：CLOSED
- 是否已有 fix PR：**当前无**

---

## 6. 功能请求与路线图信号

### 1) Spark 流式读取起始位置控制
- 链接：apache/iceberg PR #15472
- 状态：OPEN
- 信号强度：**高**

这是一个典型的流式场景能力增强：允许在**无 checkpoint** 时控制流从哪里开始读。  
对生产用户的价值很明确：
- 首次启动可从指定 snapshot/offset 开始
- 支持重放、补数、灾备恢复
- 降低对外部状态系统的依赖

**判断：**
该能力与实际流式 ETL 场景高度贴合，虽然 PR 已 stale，但功能诉求真实且普适，**很可能以某种形式进入后续版本**。

---

### 2) AWS Client 可配置 metrics publisher
- 链接：apache/iceberg PR #15304
- 状态：OPEN
- 信号强度：**中高**

这属于典型的 **可观测性增强**。  
对于企业用户，尤其是在 S3/STS 请求量大、排障复杂的场景，暴露 metrics publisher 配置非常有价值。

**判断：**
随着 AWS 相关 PR 密集增加，可观测性与客户端配置灵活性很可能持续增强。

---

### 3) S3 chunked encoding 配置
- 链接：apache/iceberg PR #15242
- 状态：OPEN
- 信号强度：**中**

这是一个面向兼容性/网络行为调优的特性，适合：
- 特定对象存储网关
- 特殊代理链路
- 对 chunked transfer 敏感的企业网络环境

**判断：**
不一定是“广泛用户显性需求”，但非常符合 Iceberg 作为底层存储引擎适配器的演进方向。

---

### 4) overwrite-aware table registration
- 链接：apache/iceberg PR #15525
- 状态：CLOSED
- 信号强度：**中**

虽然 PR 关闭，但路线图意义仍在：  
Catalog API 与 REST catalog 的能力对齐仍是长期方向，特别是注册表、覆盖式注册、外部表接入等 catalog 语义增强。

---

## 7. 用户反馈摘要

### 1) 生产故障恢复能力仍是 Kafka Connect 用户核心痛点
- 相关链接：apache/iceberg Issue #15293

真实反馈显示，用户并不是单纯遇到“写失败”，而是遇到一种更难排查的问题：
- 文件层写成功
- 元数据层提交失败
- 故障发生在集群重建之后

这说明用户非常关注：
- **灾难恢复后的状态重建**
- **写入路径端到端一致性**
- **可观测性与故障诊断能力**

---

### 2) Spark + Hive catalog 的对象语义兼容性仍不够直观
- 相关链接：apache/iceberg Issue #15779

用户期望“创建视图就是视图”，而不是在 catalog 中表现为 table。  
这类反馈反映出企业用户对以下方面的高要求：
- SQL 语义一致性
- 目录/元数据可见性一致性
- 与现有 Hive/Spark 生态工具链的兼容

---

### 3) Hive catalog 下 schema evolution 的失败模式需要更早暴露
- 相关链接：apache/iceberg PR #15814

用户在 schema evolution 上的痛点并不只是“功能缺失”，更在于：
- 某些 DDL 操作理论可写、运行却失败
- 错误来自 Hive Metastore 底层校验，不够直观
- 迁移和运维团队需要明确的操作边界

这类反馈说明文档完善本身就是降低生产事故的重要手段。

---

## 8. 待处理积压

以下是今天值得维护者重点关注的长期或 stale 积压项：

### 1) docs: move pages away from the versioned docs
- 链接：apache/iceberg Issue #14222
- 状态：OPEN
- 标签：`bug, stale`

**关注原因：**
这是一个从 2025-09-30 持续至今的文档治理问题。  
虽然不属于运行时 bug，但会影响：
- 文档维护成本
- 版本化页面的信息一致性
- 用户获取正确文档路径的效率

---

### 2) Spark: Add streaming-starting-offset read option
- 链接：apache/iceberg PR #15472
- 状态：OPEN
- 标签：`spark, docs, stale`

**关注原因：**
这是一个需求明确、用户价值高的流式能力增强，但已进入 stale。  
建议维护者尽快给出：
- 设计反馈
- 与 #15152 的边界划分
- 是否拆分为更小 PR 的建议

---

### 3) AWS: apply client.region to StsClient in AssumeRoleAwsClientFactory
- 链接：apache/iceberg PR #15460
- 状态：OPEN
- 标签：`AWS, stale`

**关注原因：**
涉及 STS region 继承，属于企业多区域部署常见兼容性问题。  
若长期拖延，可能持续影响 AssumeRole 场景的行为一致性。

---

### 4) Checkstyle, Spotless: Force newline after closing brace
- 链接：apache/iceberg PR #15422
- 状态：OPEN
- 标签：多模块、`stale`

**关注原因：**
这是仓库级风格治理变更，影响范围极广。  
若维护策略不明确，容易长期占用评审注意力，建议尽快决定：
- 是否接受
- 是否拆分
- 是否转交统一格式化工具链处理

---

### 5) Spark: Add data file path for range partition when rewriting manifests
- 链接：apache/iceberg PR #15310
- 状态：OPEN
- 标签：`spark, stale`

**关注原因：**
该 PR 涉及 manifest rewrite 期间 range partition 的数据文件路径补齐，属于存储元数据维护路径的细节修正，建议明确是否会纳入后续优化计划。

---

## 总结

今天的 Iceberg 没有版本发布，但项目活动密度不低，且技术重心相当清晰：  
**AWS/S3 读写稳定性、Kafka Connect 写入正确性、Spark 流式/视图语义、Hive catalog 兼容边界** 是当前最值得跟踪的四条主线。  

从健康度看，社区贡献持续活跃，尤其是云存储与连接器方向；但从维护效率看，多个 stale PR 显示评审带宽仍偏紧。  
若接下来几天能优先收敛 Kafka Connect 的正确性修复和 AWS 稳定性补丁，Iceberg 的生产可用性信号会进一步增强。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-30）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区整体保持**中等活跃**：有 2 条 Issue 更新、5 条 PR 更新，但**无新版本发布**，且暂无 PR 合并或 Issue 关闭。  
从内容看，当前开发重点集中在三条主线：**提交一致性与数据正确性修复**、**Spark/Kernel 查询下推能力增强**、以及 **Flink Sink 能力补齐**。  
值得关注的是，今天最重要的工程信号来自一个高风险 PR：它修复 coordinated commits 路径下可能导致**静默数据丢失**的竞态条件，这类问题对分析型存储引擎的可靠性影响较大。  
与此同时，社区也持续暴露出 **协议实现一致性** 与 **Schema 变更可见性/刷新机制** 两类兼容性问题，说明 Delta 在多连接器、多执行引擎演进过程中仍处于打磨阶段。

---

## 2. 项目进展

> 今日没有已合并/已关闭的重要 PR。以下为最值得关注的进行中 PR，它们代表了当前项目的主要推进方向。

### 2.1 提交协议一致性与可靠性修复
- **PR #6353 — Fix race condition in commitFilesIterator causing silent data loss with coordinated commits**  
  链接: delta-io/delta PR #6353

这是今日最关键的变更候选。PR 描述指出，`commitFilesIterator` 在两阶段发现 commit 文件时存在竞态窗口：  
1. 第一阶段从文件系统列举已回填（backfilled）的 commit 文件；  
2. 第二阶段向 coordinator 查询未回填的 commit。  

如果并发写入在两阶段之间把“未回填 commit”全部回填，就可能导致第二阶段查询不到、第一阶段又未覆盖，从而出现**提交文件遗漏**，进一步导致**静默数据丢失**。  

**技术意义：**
- 这是典型的**事务日志可见性/发现一致性问题**，影响 Delta 在 coordinated commits 模式下的可靠性。
- 对 OLAP/湖仓场景来说，这类问题比显式失败更危险，因为它会影响结果正确性且不易察觉。
- 若该 PR 合并，将明显增强 Delta 在高并发写入、异步回填场景下的稳定性。

---

### 2.2 Spark / Kernel 查询下推能力增强
- **PR #6332 — [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector**  
  链接: delta-io/delta PR #6332

该 PR 为基于 Kernel 的 Delta V2 connector 实现 Spark 的 `SupportsPushDownLimit` 接口，使 `SELECT * FROM delta_table LIMIT N` 这类查询能够将 limit 下推到扫描阶段。  

**潜在收益：**
- 减少不必要的文件扫描与任务调度开销；
- 改善交互式分析、样本预览、BI 探查类查询延迟；
- 说明 Delta 正在持续补齐 **Spark DataSource V2 + Kernel** 的能力边界。

**路线信号：**
- 这是典型的“执行层优化”工作，说明 Kernel 化 connector 不仅追求功能可用，也在追求与 Spark 原生接口更紧密的性能集成。

---

### 2.3 Flink 生态持续补齐
- **PR #6191 — [Flink] Sink DataStream API implementation**  
  链接: delta-io/delta PR #6191
- **PR #6192 — [Flink] Sink SQL API support**  
  链接: delta-io/delta PR #6192
- **PR #6431 — [Flink] Readme & Docker Compose**  
  链接: delta-io/delta PR #6431

这三条 PR 共同指向一个明确信号：**Delta Lake 正在强化 Flink 写入路径及其开发者体验**。  

其中：
- #6191 面向 **DataStream API**，意味着更底层、更灵活的流式写入集成；
- #6192 面向 **SQL API**，意味着更高层、面向平台和数仓用户的接入方式；
- #6431 提供 **Readme 与 Docker Compose**，降低本地试用、复现实验和贡献门槛。

**工程解读：**
- 这不是单点功能修补，而是更像一组配套推进；
- 如果后续顺利合并，Flink 作为 Delta 写入/处理引擎的可用性会明显提升；
- 这也表明社区正尝试把 Delta 从“Spark 优先”进一步扩展到更完整的多引擎生态。

---

## 3. 社区热点

### 热点 1：coordinated commits 下的静默数据丢失风险
- **PR #6353**  
  链接: delta-io/delta PR #6353

虽然评论数未提供，但从问题性质看，这是今天**技术风险最高、最值得维护者优先审查**的变更。  
背后的核心诉求是：Delta 在引入 coordinator / backfill 等更复杂提交协议后，必须保证**日志发现过程的原子性或单调一致性**。任何竞态导致的 commit 丢失，都会直接动摇分析结果可信度。

---

### 热点 2：Kernel 是否严格遵循协议规范
- **Issue #6027 — [BUG] Kernel doesn't follow spec: writeStatsAsStruct**  
  链接: delta-io/delta Issue #6027

该 Issue 指出 Kernel 在 writer version 3+ 场景下，没有按协议要求支持 `writeStatsAsStruct`。  

**背后技术诉求：**
- Delta protocol 的“规范即契约”属性很强；
- 一旦 Kernel 实现与 `PROTOCOL.md` 不一致，就可能导致跨实现兼容问题；
- 这类问题尤其影响多语言、多引擎生态，因为外部实现通常依赖协议文档而非 Spark 特定行为。

这类问题通常优先级较高，因为它关系到**协议兼容性**而不是单一运行时 bug。

---

### 热点 3：Spark V2 connector 对 Schema 变更的可见性问题
- **Issue #6232 — [BUG] V2 connector cannot adopt schema change without refreshing the dataframe**  
  链接: delta-io/delta Issue #6232

该 Issue 反映 Spark V2 connector 在底表发生 schema 变化后，已有 dataframe 若不刷新，无法正确感知变更。  

**背后技术诉求：**
- 用户期望 Delta 在 schema evolution 后，读取层能以更自然的方式反映元数据变化；
- 问题本质涉及 **DataFrame 缓存/计划复用** 与 **表元数据刷新边界**；
- 对长生命周期会话、交互式 notebook、流批混合任务尤其敏感。

这说明 Delta 在 DataSource V2 与 Spark 元数据生命周期集成上还有待加强。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P0 / 高风险：并发提交竞态可能导致静默数据丢失
- **PR #6353 — Fix race condition in commitFilesIterator causing silent data loss with coordinated commits**  
  链接: delta-io/delta PR #6353
- **状态：已有 fix PR，尚未合并**

**影响判断：**
- 涉及**数据正确性**，不是单纯性能或报错问题；
- 若属实，将影响 coordinated commits 使用者的结果完整性；
- 建议维护者优先 review、补充回归测试与并发场景 fuzz/chaos 验证。

---

### P1 / 高优先级：Kernel 协议实现与规范不一致
- **Issue #6027 — [BUG] Kernel doesn't follow spec: writeStatsAsStruct**  
  链接: delta-io/delta Issue #6027
- **状态：暂无关联 fix PR**

**影响判断：**
- 影响 writer version 3+ 协议兼容性；
- 可能导致生成的统计信息格式不符合预期，进而影响跨引擎读取、优化器利用统计信息、或协议校验；
- 属于**规范一致性**问题，优先级高于普通功能缺失。

---

### P2 / 中优先级：V2 connector 无法自动采纳 schema change
- **Issue #6232 — [BUG] V2 connector cannot adopt schema change without refreshing the dataframe**  
  链接: delta-io/delta Issue #6232
- **状态：暂无关联 fix PR**

**影响判断：**
- 更偏向**使用体验与兼容性**问题；
- 对依赖 schema evolution 的生产作业可能造成读取失败、字段不可见或需要人工 refresh；
- 目前看尚无直接修复 PR，需要确认这是 Spark 语义限制还是 Delta connector 可修复问题。

---

## 5. 功能请求与路线图信号

虽然今天没有明显“新功能请求型” Issue，但从活跃 PR 可以提炼出清晰的路线图信号：

### 5.1 Kernel-based Spark V2 connector 正在从“可用”走向“可优化”
- **PR #6332**  
  链接: delta-io/delta PR #6332

`SupportsPushDownLimit` 的引入表明，Delta 团队并不满足于 Kernel connector 的基础读能力，而是在推进：
- 更完整的 DataSource V2 能力对齐；
- 更好的查询下推；
- 更低延迟的交互式分析支持。

这类工作很可能被纳入下一阶段版本，因为它直接提升用户可感知性能。

---

### 5.2 Flink 写入能力可能成为下一版本的重要看点
- **PR #6191 / #6192 / #6431**  
  链接:  
  - delta-io/delta PR #6191  
  - delta-io/delta PR #6192  
  - delta-io/delta PR #6431  

这组 PR 同时覆盖：
- DataStream API；
- SQL API；
- 文档与开发环境。

这通常意味着某项特性已从“概念验证”走向“准备对外可用/可推广”。  
如果这些 PR 在近期集中推进，**Flink Sink 支持**很可能会成为下一版本或近期里程碑的重要组成部分。

---

### 5.3 协议一致性问题可能触发 Kernel 补齐工作
- **Issue #6027**  
  链接: delta-io/delta Issue #6027

尽管这是 Bug 报告，但它也释放出路线图信号：  
Delta Kernel 若要成为更通用的协议实现层，就必须持续补齐对 `PROTOCOL.md` 的完整支持。后续可能出现一批围绕：
- writer feature 完整性；
- stats 编码兼容性；
- metadata/action 读写一致性  
的修复或增强 PR。

---

## 6. 用户反馈摘要

基于今日 Issue 内容，可以提炼出以下真实用户痛点：

### 6.1 用户希望协议文档与实现行为严格一致
- **Issue #6027**  
  链接: delta-io/delta Issue #6027

用户直接对照 `PROTOCOL.md` 提出 Kernel 未实现 `writeStatsAsStruct`，说明：
- 用户正在按协议规范验证行为，而非只依赖 Spark 主实现；
- Delta 已被用于需要**跨实现一致性**的环境；
- 社区对 Kernel 的期待是“标准实现层”，不是“功能子集”。

---

### 6.2 用户在 schema evolution 场景下对“自动可见性”有较高期待
- **Issue #6232**  
  链接: delta-io/delta Issue #6232

用户反馈 V2 connector 在 schema change 后需要 refresh dataframe，说明典型使用场景包括：
- 交互式分析会话中表结构被更新；
- 上游写入任务演进 schema，下游读取任务希望无缝适配；
- 用户希望减少显式 refresh 或重建 dataframe 的操作负担。

这类反馈通常反映的是**平台集成体验**问题，虽然不一定是协议错误，但会直接影响采用体验。

---

## 7. 待处理积压

以下事项建议维护者关注：

### 7.1 Flink Sink 系列 PR 持续开放，适合集中推进
- **PR #6191 — [Flink] Sink DataStream API implementation**  
  链接: delta-io/delta PR #6191
- **PR #6192 — [Flink] Sink SQL API support**  
  链接: delta-io/delta PR #6192

这两条 PR 创建于 **2026-03-04**，至今仍处于开放状态。  
考虑到它们涉及同一主题（Flink Sink），建议：
- 统一 review 口径；
- 明确依赖关系与拆分策略；
- 尽量避免因长期悬而未决导致实现漂移或冲突积累。

---

### 7.2 协议一致性 Bug 尚无修复动作
- **Issue #6027**  
  链接: delta-io/delta Issue #6027

该问题创建于 **2026-02-09**，目前仍开放，且未看到对应修复 PR。  
由于它关系到 **Kernel 与协议规范的一致性**，建议尽快确认：
- 是否确属缺陷；
- 是否已有规避方案；
- 是否需要补充 conformance test。

---

### 7.3 Spark V2 schema 变更感知问题需要明确归因
- **Issue #6232**  
  链接: delta-io/delta Issue #6232

该问题虽然较新，但影响典型 schema evolution 场景。建议维护者尽快判断：
- 是 Spark DataFrame 生命周期的既有语义；
- 还是 Delta V2 connector 元数据刷新机制的缺陷；
- 是否需要文档明确 refresh 要求。

---

## 8. 健康度结论

今天的 Delta Lake 项目呈现出**“无发布、但工程活动具有实质意义”**的状态。  
一方面，没有版本发布和合并记录，说明短期交付节奏偏稳；另一方面，活跃 PR 直指 **数据正确性、查询下推性能、Flink 接入能力** 三个关键方向，显示项目仍在持续推进核心能力。  
需要重点警惕的是：**coordinated commits 的静默数据丢失风险**与 **Kernel 协议一致性问题** 都属于高价值、高影响议题，若能尽快收敛，将显著提升项目健康度与企业用户信心。  

如果你愿意，我也可以继续把这份日报整理成更适合内部周报/飞书通知的 **Markdown 简版** 或 **高管摘要版**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 - 2026-03-30

## 1. 今日速览

过去 24 小时 Databend 保持了中等偏高的开发活跃度：**1 条 Issue 更新、8 条 PR 更新、1 个 nightly 版本发布**。  
从变更内容看，今日工作重点仍集中在 **SQL 解析兼容性修复、查询规划稳定性增强，以及 DDL 语义补齐**，尤其是 `X'...'` 二进制字面量与 `UInt64` 全范围统计溢出问题，说明团队在持续清理查询正确性与边界场景缺陷。  
PR 活跃作者高度集中，表明当前修复工作具备较强连续性，但也反映出热点问题主要由核心维护者推进。  
整体来看，项目健康度良好：**nightly 持续发布、Bug 有对应修复链路、自动化质量检查也在运行**，但仍有文档链接失效等工程细节需要跟进。

---

## 2. 版本发布

## 新版本：v1.2.891-nightly
- Release: **v1.2.891-nightly**
- 链接：<https://github.com/databendlabs/databend/releases/tag/v1.2.891-nightly>

### 已披露更新内容
根据当前可见的 release notes，主要包含以下新特性：

1. **Stage 文本文件格式参数支持**
   - PR: [#19588](https://github.com/databendlabs/databend/pull/19588)
   - 描述：`feat(stage): add TEXT file format params`
   - 影响：增强了 Databend 在外部/阶段文件导入场景中的文本格式处理能力，预计会改善文本类数据接入的灵活性，尤其适用于 ELT/批量装载流水线。

2. **HTTP 能力增强**
   - release notes 截断，仅可见 `feat(http): add se...`
   - 说明：当前数据未完整披露具体能力，推测为 HTTP 接口侧功能扩展，但需以后续完整发布说明为准。

### 破坏性变更
- **当前提供的数据中未显示明确的 breaking changes。**
- 考虑到该版本为 **nightly**，仍建议使用者将其视为预发布渠道，不直接用于高风险生产变更窗口。

### 迁移与验证建议
对于准备跟进 nightly 的用户，建议重点验证：
- **Stage / 文件导入链路**：如果使用文本格式加载，检查文件格式参数新增后是否影响原有默认行为。
- **SQL 字面量解析兼容性**：近期多条 PR 涉及 `X'...'` 语义调整，建议回归验证依赖十六进制字面量的 ETL/BI SQL。
- **统计信息与查询规划**：若数据表存在 `UInt64` 主键/分桶键/高基数字段，建议回归复杂过滤与代价估算路径。

---

## 3. 项目进展

本日“已合并/关闭”的重要 PR 主要围绕 **SQL 兼容性修复** 与 **查询规划稳定性问题闭环**。

### 3.1 SQL 标准二进制字面量修复链路推进
1. **已关闭 PR：fix(sql): treat X'...' as binary literal**
   - PR: [#19608](https://github.com/databendlabs/databend/pull/19608)
   - 状态：Closed
   - 作用：将 SQL 标准写法 `X'...'` 解析为 **Binary 字面量**，而不是误走无符号十六进制整数路径；同时保持 MySQL 风格 `0x...` 继续走数值语义。
   - 意义：这是典型的 **SQL 方言兼容性纠偏**。对执行十六进制常量表达式、二进制函数、协议适配器和兼容测试集尤为重要。

2. **后续替代/延续 PR 仍在打开**
   - [#19635](https://github.com/databendlabs/databend/pull/19635)
   - [#19636](https://github.com/databendlabs/databend/pull/19636)
   - 说明：#19608 虽关闭，但其目标并未放弃，而是继续通过新的 PR 推进，表明维护者可能在整理实现方式、回归覆盖或提交历史。

### 3.2 查询统计推导中的 UInt64 全范围溢出问题持续收敛
1. **已关闭 PR：avoid overflow in Scan::derive_stats for full-range UInt64 stats**
   - PR: [#19591](https://github.com/databendlabs/databend/pull/19591)
   - 状态：Closed
   - 作用：修复 `Scan::derive_stats` 在基于最小/最大值推导基数（NDV）时，对 `UInt64` 全范围 `[0, u64::MAX]` 的溢出问题。
   - 意义：这是 **查询优化器统计推导正确性** 问题，若处理不当可能导致 planner panic、错误估算，进而影响执行计划质量和稳定性。

2. **后续活跃修复 PR**
   - [#19631](https://github.com/databendlabs/databend/pull/19631) `fix(query): avoid panic on UInt64 full-range scan stats`
   - [#19632](https://github.com/databendlabs/databend/pull/19632) `fix(sql): avoid uint ndv overflow in scan stats`
   - 说明：关闭旧 PR、保留新 PR 的模式说明问题已被明确识别，且修复方案正在朝更稳妥的方向收敛。该问题对大表、统计信息驱动优化、极值分布场景影响较大。

### 3.3 正在推进的重要能力补齐
1. **ALTER TABLE ADD COLUMN IF NOT EXISTS**
   - PR: [#19615](https://github.com/databendlabs/databend/pull/19615)
   - 状态：Open
   - 价值：补齐 DDL 幂等语义，能显著改善 schema migration、自动建表/演进脚本、数据平台 CICD 的可重复执行能力。

2. **FULL OUTER JOIN USING 空值属性对齐**
   - PR: [#19616](https://github.com/databendlabs/databend/pull/19616)
   - 状态：Open
   - 价值：修复 `FULL OUTER JOIN` 下 `USING/NATURAL` 可见连接键的 nullability 与实际 hash-join 输出 schema 不一致问题，属于 **查询结果 schema 正确性** 修复，对 JDBC/Arrow/BI 工具消费结果元数据很关键。

---

## 4. 社区热点

今天的热点主要不是高评论讨论，而是 **修复类 PR 高度聚焦于同一组 SQL/规划问题**。由于提供数据中评论数基本为空或未定义，以下按“技术热度与关联性”排序。

### 4.1 `X'...'` 应解析为二进制字面量，而非十六进制整数
- PR:
  - [#19636](https://github.com/databendlabs/databend/pull/19636)
  - [#19635](https://github.com/databendlabs/databend/pull/19635)
  - [#19608](https://github.com/databendlabs/databend/pull/19608)
- 技术诉求分析：
  - 这是典型的 **SQL 标准兼容** 与 **多方言行为区分** 问题。
  - 用户希望 Databend 同时区分：
    - SQL 标准：`X'ABCD'` → binary/blob
    - MySQL 风格：`0xABCD` → numeric hex literal
  - 背后诉求是让 Databend 更好承接来自其他 OLAP/SQL 系统的迁移工作负载，减少 SQL 改写。

### 4.2 `UInt64` 统计推导溢出与 planner panic
- PR:
  - [#19632](https://github.com/databendlabs/databend/pull/19632)
  - [#19631](https://github.com/databendlabs/databend/pull/19631)
  - [#19591](https://github.com/databendlabs/databend/pull/19591)
- 技术诉求分析：
  - 用户需要在超大整数域、全范围统计值下保持 planner 稳定。
  - 这说明 Databend 用户已在使用较大规模、较复杂的数据模型，优化器统计边界条件开始成为真实生产问题。
  - 对 OLAP 系统而言，这类问题虽然表面是“panic 修复”，实质影响的是 **稳定性、计划质量和异常可恢复性**。

### 4.3 自动化链接检查报告
- Issue: [#19634](https://github.com/databendlabs/databend/issues/19634)
- 类型：`[report, automated issue] Link Checker Report`
- 技术诉求分析：
  - 报告显示 **117 个链接中 1 个错误**。
  - 这不是核心内核问题，但反映了项目在文档与 README 质量上的自动化治理。
  - 对开源数据库项目而言，文档链接可用性会直接影响新用户接入体验与贡献者效率。

---

## 5. Bug 与稳定性

以下按严重程度排列：

### 高优先级：查询规划统计推导溢出，可能导致 panic 或错误估算
- 相关 PR：
  - [#19632](https://github.com/databendlabs/databend/pull/19632)
  - [#19631](https://github.com/databendlabs/databend/pull/19631)
  - 已关闭前序版本：[#19591](https://github.com/databendlabs/databend/pull/19591)
- 问题描述：
  - 当 `Scan::derive_stats` 针对 `UInt64` 列，且统计范围为完整区间 `[0, u64::MAX]`` 时，在 NDV 缩减/跨度计算中可能发生整数溢出。
- 影响评估：
  - 可能引发 **planner panic**，或导致统计失真，间接影响执行计划。
  - 对依赖 min/max 统计信息的表扫描、过滤下推、代价估算路径影响较大。
- 修复状态：
  - **已有 fix PR 在推进中**，问题已被明确定位。

### 中优先级：SQL 标准 `X'...'` 字面量被错误解析
- 相关 PR：
  - [#19636](https://github.com/databendlabs/databend/pull/19636)
  - [#19635](https://github.com/databendlabs/databend/pull/19635)
  - 已关闭前序版本：[#19608](https://github.com/databendlabs/databend/pull/19608)
- 问题描述：
  - `X'...'` 本应表示 binary literal，但此前被路由到整数十六进制解析路径。
- 影响评估：
  - 会影响 SQL 兼容性与查询正确性，尤其是在二进制函数、常量表达式、外部迁移 SQL 场景中。
- 修复状态：
  - **已有活跃 fix PR**，并附带 parser 与 SQL regression 测试。

### 中优先级：FULL OUTER JOIN USING 结果 schema 的 nullability 不一致
- PR: [#19616](https://github.com/databendlabs/databend/pull/19616)
- 问题描述：
  - `FULL OUTER JOIN` 中可见 `USING/NATURAL` join key 的 nullable 属性未与实际 hash-join 输出对齐。
- 影响评估：
  - 可能造成结果 schema 与执行输出不一致，影响客户端元数据消费、结果校验及部分下游工具兼容性。
- 修复状态：
  - **Open，已有候选修复。**

### 低优先级：文档链接失效
- Issue: [#19634](https://github.com/databendlabs/databend/issues/19634)
- 问题描述：
  - 自动化 Link Checker 报告 1 处错误链接。
- 影响评估：
  - 不影响数据库运行，但影响文档质量和新用户体验。
- 修复状态：
  - **尚未看到对应修复 PR。**

---

## 6. 功能请求与路线图信号

尽管今天没有典型“用户新提需求”的 feature issue，但从 release 与活跃 PR 可观察到清晰的路线图信号：

### 6.1 文件接入与 Stage 能力继续增强
- Release 相关：
  - [#19588](https://github.com/databendlabs/databend/pull/19588)
- 信号解读：
  - `TEXT file format params` 表明 Databend 正继续强化 **外部数据摄入/Stage 管理**。
  - 这通常意味着项目在支持更多文件格式细节、导入参数化与数据湖场景兼容上持续投入。
- 纳入下一版本概率：
  - **高**，因为已进入 nightly。

### 6.2 SQL 方言兼容性将继续补齐
- 相关 PR：
  - [#19635](https://github.com/databendlabs/databend/pull/19635)
  - [#19636](https://github.com/databendlabs/databend/pull/19636)
  - [#19615](https://github.com/databendlabs/databend/pull/19615)
- 信号解读：
  - 包括 `X'...'` 语义、`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`，都属于典型的兼容性/易迁移特性。
  - 这说明 Databend 仍在提升“从其他 SQL 系统迁移过来时，SQL 尽量少改”的体验。
- 纳入下一版本概率：
  - **高**，这些改动边界清晰、附回归测试、且用户价值直接。

### 6.3 查询优化器健壮性仍是短期重点
- 相关 PR：
  - [#19631](https://github.com/databendlabs/databend/pull/19631)
  - [#19632](https://github.com/databendlabs/databend/pull/19632)
  - [#19616](https://github.com/databendlabs/databend/pull/19616)
- 信号解读：
  - 近期多个 PR 落在 planner/schema correctness 层，表明团队正在提升执行引擎外围的 **语义一致性、统计正确性、边界稳定性**。
- 纳入下一版本概率：
  - **很高**，因为这些属于修复型改动，通常优先级高于新特性。

---

## 7. 用户反馈摘要

基于今日可见数据，直接来自 Issue 评论的用户反馈有限，但仍可提炼出几个真实痛点：

1. **SQL 兼容性痛点明显**
   - 从 `X'...'` 修复链路可见，用户或测试集已经碰到了标准 SQL 二进制字面量行为不一致问题。
   - 这类问题往往出现在数据库迁移、sqllogictest、BI 工具生成 SQL 或兼容层接入过程中。

2. **大整数范围统计导致的稳定性风险已触达真实使用场景**
   - `UInt64` 全范围溢出不是边缘语法问题，而是实际数据分布和统计推导路径中的工程问题。
   - 说明 Databend 已在承载高基数、宽数值域的分析负载，用户对 planner 稳定性的要求在上升。

3. **DDL 幂等化需求明确**
   - `ALTER TABLE ADD COLUMN IF NOT EXISTS` 这类语义通常来自自动化部署、数据建模平台与反复执行迁移脚本的需要。
   - 背后反映的是用户希望 Databend 在数据平台集成中具备更好的“可自动化操作性”。

4. **文档可用性仍然重要**
   - 自动链接检查报告虽小，但说明项目持续面对文档入口可达性问题。
   - 对新用户、云服务集成方和贡献者，这类质量问题会被放大。

---

## 8. 待处理积压

基于当前数据，以下事项值得维护者继续关注：

### 8.1 `X'...'` 二进制字面量修复存在多条替代 PR，需尽快收敛
- PR：
  - [#19635](https://github.com/databendlabs/databend/pull/19635)
  - [#19636](https://github.com/databendlabs/databend/pull/19636)
  - 已关闭前序：[#19608](https://github.com/databendlabs/databend/pull/19608)
- 提醒：
  - 同一问题出现多条近似 PR，容易造成 reviewer 成本上升与上下文分散。
  - 建议尽快明确最终实现分支并合并，减少重复讨论。

### 8.2 `UInt64` 溢出修复链路也存在重复/替代提交，需统一结论
- PR：
  - [#19631](https://github.com/databendlabs/databend/pull/19631)
  - [#19632](https://github.com/databendlabs/databend/pull/19632)
  - 已关闭前序：[#19591](https://github.com/databendlabs/databend/pull/19591)
- 提醒：
  - 这是稳定性高优先级问题，建议维护者尽快确定最终修复方案，并同步回归测试覆盖范围。

### 8.3 自动化文档错误尚待处理
- Issue: [#19634](https://github.com/databendlabs/databend/issues/19634)
- 提醒：
  - 虽非核心功能阻塞，但建议尽快修复失效链接，避免文档质量持续下降。

### 8.4 已获批准但尚未合并的功能性修复值得优先推进
- PR：
  - [#19615](https://github.com/databendlabs/databend/pull/19615)
  - [#19616](https://github.com/databendlabs/databend/pull/19616)
- 提醒：
  - 两者都属于低风险高价值修复：一个增强 DDL 幂等性，一个修复 FULL OUTER JOIN schema 语义，建议尽快完成 review/merge。

---

## 附：日报结论

Databend 今日的动态体现出一个典型的成熟分析型数据库项目节奏：**nightly 持续迭代，新功能小步快跑，核心精力放在 SQL 兼容性与查询稳定性修复上**。  
从趋势看，短期内最值得关注的是两条主线：  
1. **标准 SQL / 常见方言兼容补齐**，降低迁移门槛；  
2. **优化器统计与 schema 正确性增强**，提高复杂分析负载下的稳定性。  

若这些活跃 PR 在未来 1-2 个版本窗口内顺利合并，Databend 在“可迁移性 + 稳定性”两个维度都将进一步增强。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-30）

## 1. 今日速览
过去 24 小时内，Velox 社区活跃度中等偏上：共有 **1 条 Issue 更新**、**12 条 PR 更新**，其中 **3 条已合并/关闭**、**9 条仍在推进**。  
今日工作重心明显偏向 **稳定性修复、文档完善、以及执行/存储链路的细节优化**，尤其是围绕 flaky test、spill 配置、Nimble 元数据 IO 和 join 正确性的问题。  
从变更结构来看，项目整体健康度较好：既有快速合入的小修复，也有面向未来版本的功能性 PR 持续推进，如 Spark SQL 加密函数、Base32 编解码、IndexLookupJoin trace/replay。  
需要关注的是，今日唯一新增 Issue 直接暴露了 **主分支 pre-commit 覆盖不足** 的工程流程缺口，说明 CI/代码质量门禁仍有改进空间。

---

## 3. 项目进展

### 已合并 / 已关闭的重要 PR

#### 1) 修复 SpillConfig 未初始化导致的测试不稳定
- **PR**: #16956 `fix: Fix uninitialized SpillConfig::numMaxMergeFiles causing flaky SpillerTest failure`
- **状态**: 已合并
- **链接**: [facebookincubator/velox PR #16956](https://github.com/facebookincubator/velox/pull/16956)

**进展解读：**  
该修复针对 `SpillerTest` 中的 flaky failure，根因是 `SpillConfig::numMaxMergeFiles` 未初始化，偶发取值为 1，进而触发校验失败。  
这类问题虽然表面出现在测试层，但本质上反映了 **spill 路径配置安全性与存储执行稳定性** 的隐患。修复后有助于提高 spill 相关算子和外部排序/聚合场景的可预测性。

**影响方向：**
- 分析型存储引擎的 spill 稳定性
- 测试环境一致性
- 减少随机失败，提升 CI 信噪比

---

#### 2) 文档补齐 Hash Table 三种模式
- **PR**: #16953 `docs: Document hash table modes (kArray, kNormalizedKey, kHash)`
- **状态**: 已合并
- **链接**: [facebookincubator/velox PR #16953](https://github.com/facebookincubator/velox/pull/16953)

**进展解读：**  
该 PR 补充了 Velox hash table 三种工作模式的文档说明：
- `kArray`
- `kNormalizedKey`
- `kHash`

这类文档更新虽不直接改变执行逻辑，但对 **查询引擎开发者、性能调优人员和下游集成者** 很重要。它降低了理解 join / aggregation 内部选择策略的门槛，也有利于排查性能回退和正确性问题。

**影响方向：**
- 执行引擎内部机制透明化
- 性能调优可解释性提升
- 下游引擎集成与故障定位更容易

---

#### 3) 优化 Nimble 元数据 IO 缓存
- **PR**: #16948 `feat: Optimize Nimble metadata IO with MetadataCache and pinned caching`
- **状态**: 已合并
- **链接**: [facebookincubator/velox PR #16948](https://github.com/facebookincubator/velox/pull/16948)

**进展解读：**  
这是今天最值得关注的已合入功能性优化之一。PR 针对 Nimble 元数据 IO 的缓存策略进行了增强，引入 `MetadataCache` 与 pinned caching，避免弱引用缓存过早失效，提升多 stripe-group / 多批次访问场景下的元数据复用率。  

**技术价值：**
- 降低 stripe groups、cluster index、chunk index 的重复读取成本
- 对频繁扫描、分批读取、多片段访问的分析工作负载更友好
- 属于典型的 **分析型存储读路径优化**

**影响方向：**
- 存储引擎元数据访问延迟降低
- 提升 IO 效率与缓存命中率
- 有利于 Nimble 生态与 Velox 集成表现

---

### 持续推进中的关键 PR

#### 4) 修复 Counting Join 合并逻辑中的正确性问题
- **PR**: #16949 `fix: Counting join count merge in HashTable::buildFullProbe`
- **状态**: Open
- **链接**: [facebookincubator/velox PR #16949](https://github.com/facebookincubator/velox/pull/16949)

**解读：**  
该 PR 指向 `EXCEPT ALL / INTERSECT ALL` 相关 counting join 的计数合并逻辑错误。当多个 build driver 处理重叠 key 时，合并阶段可能没有正确累计 per-key counts。  
这是典型的 **查询正确性问题**，影响 SQL 语义一致性，优先级高，值得尽快合入。

---

#### 5) 修复列读取过程中过早返回导致后续列被跳过
- **PR**: #16951 `fix: Premature return in readColumns skips remaining columns after all-null column`
- **状态**: Open
- **链接**: [facebookincubator/velox PR #16951](https://github.com/facebookincubator/velox/pull/16951)

**解读：**  
该问题出现在多列 page 反序列化场景中：若某个非末尾列被识别为 all-null 且类型不匹配，`tryReadNullColumn` 成功后直接 `return`，会导致后续列不再读取。  
这是典型的 **存储解码/读取正确性 bug**，如果进入实际数据路径，可能导致结果缺列或数据不完整。

---

#### 6) 为 IndexLookupJoin 增加 split trace 与 replay 支持
- **PR**: #16950 `feat: Trace index splits in IndexLookupJoin for replay`
- **状态**: Open
- **链接**: [facebookincubator/velox PR #16950](https://github.com/facebookincubator/velox/pull/16950)

**解读：**  
该 PR 增强了 `IndexLookupJoin` 的可回放能力，将 lookup 侧 `ConnectorSplit` 记录到 trace 中，并支持 replay。  
这对线上问题定位、复杂 join 行为复现、确定性测试建设都非常关键，属于 **可观测性/可调试性增强**。

---

## 4. 社区热点

### 热点 1：pre-commit / 代码格式门禁失效
- **Issue**: #16952 `Pre-commit ruff-format failure for Python files added in #16827`
- **状态**: Open
- **评论**: 2
- **链接**: [facebookincubator/velox Issue #16952](https://github.com/facebookincubator/velox/issues/16952)

**为什么值得关注：**  
这是今日唯一有评论的 Issue，也是最直接的工程流程问题。新增 Python 文件未通过 `ruff-format`，但因为 pre-commit workflow 只在 PR 上运行、不在 `main` push 上运行，导致主分支代码进入了“自身不满足门禁规则”的状态。  

**背后的技术诉求：**
- 保证主分支始终可通过 pre-commit
- 完善 push-to-main 的质量校验闭环
- 降低后续 PR 因无关格式问题失败的摩擦成本

这类问题虽不影响查询结果，但会显著影响贡献者体验和迭代效率。

---

### 热点 2：稳定性修复密集出现，反映 CI/并发边界在持续被压测
- **PR**: #16957、#16956、#16949、#16951
- **链接**:
  - [PR #16957](https://github.com/facebookincubator/velox/pull/16957)
  - [PR #16956](https://github.com/facebookincubator/velox/pull/16956)
  - [PR #16949](https://github.com/facebookincubator/velox/pull/16949)
  - [PR #16951](https://github.com/facebookincubator/velox/pull/16951)

**分析：**  
今日多条 PR 都集中在 flaky test、未初始化配置、join 合并计数、列读取提前退出等边界问题。  
这说明 Velox 当前开发节奏下，社区正在持续把问题从“功能可用”推进到“在并发、异常输入、复杂执行路径下也稳定正确”。对 OLAP 内核来说，这是成熟化的重要信号。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：Counting Join 结果正确性风险
- **PR**: #16949
- **链接**: [facebookincubator/velox PR #16949](https://github.com/facebookincubator/velox/pull/16949)

**问题描述：**  
`EXCEPT ALL / INTERSECT ALL` 依赖的 counting join，在多个 build drivers 存在重叠 key 时，哈希表合并过程可能没有正确累加计数。  

**风险评估：**
- 影响 SQL 结果正确性
- 属于高优先级语义级缺陷
- **已有 fix PR：是**

---

### P1：列反序列化路径可能跳过后续列
- **PR**: #16951
- **链接**: [facebookincubator/velox PR #16951](https://github.com/facebookincubator/velox/pull/16951)

**问题描述：**  
在多列 page 读取中，若某列走 all-null 特殊路径后直接退出整个循环，会导致后续列未读。  

**风险评估：**
- 影响数据读取完整性
- 可能引发查询结果缺失/异常
- **已有 fix PR：是**

---

### P2：PrintPlanWithStatsTest 存在 flaky failure
- **PR**: #16957
- **链接**: [facebookincubator/velox PR #16957](https://github.com/facebookincubator/velox/pull/16957)

**问题描述：**  
与异步加 split、driver 执行状态及 `blockedWaitForSplit` 统计字段有关，测试结果受时序影响。  

**风险评估：**
- 主要影响 CI 稳定性与开发效率
- 暂未显示合并，但修复方向明确
- **已有 fix PR：是**

---

### P2：SpillConfig 未初始化导致随机失败
- **PR**: #16956
- **状态**: 已合并
- **链接**: [facebookincubator/velox PR #16956](https://github.com/facebookincubator/velox/pull/16956)

**问题描述：**  
未初始化变量导致 `SpillerTest` 偶发失败。  

**风险评估：**
- 已修复
- 暴露出配置默认值与测试隔离上的潜在隐患
- **已有 fix PR：已合并**

---

### P3：Python 格式检查导致贡献流受阻
- **Issue**: #16952
- **链接**: [facebookincubator/velox Issue #16952](https://github.com/facebookincubator/velox/issues/16952)

**问题描述：**  
主分支新增 Python 文件未通过 `ruff-format`，导致包含这些文件 diff 的 PR 容易 pre-commit 失败。  

**风险评估：**
- 不影响线上执行正确性
- 影响贡献者体验和 CI 流程顺畅度
- **已有 fix PR：未见明确关联 PR**

---

## 6. 功能请求与路线图信号

### 1) Spark SQL 加密函数支持持续推进
- **PR**: #16782 `feat(sparksql): Add aes_encrypt and aes_decrypt functions`
- **链接**: [facebookincubator/velox PR #16782](https://github.com/facebookincubator/velox/pull/16782)

**路线图信号：**  
该 PR 支持 `aes_encrypt` / `aes_decrypt`，覆盖 ECB/CBC/GCM、128/192/256-bit key、自动 IV 等特性。  
这明显属于 **Spark SQL 兼容性补齐**，若顺利合入，将增强 Velox 作为 Spark 执行后端时的函数覆盖度。很可能进入后续版本的重要 SQL 兼容更新列表。

---

### 2) Base32 编解码能力仍在排队
- **PR**: #16235 `feat(encode): Add Base32 encoding`
- **链接**: [facebookincubator/velox PR #16235](https://github.com/facebookincubator/velox/pull/16235)

**路线图信号：**  
增加 `to_base32` / `from_base32`，属于实用型字符串/二进制函数补全。  
该 PR 创建较早但仍未合并，说明需求明确但优先级可能低于核心执行正确性和稳定性修复。

---

### 3) Trace / Replay 能力继续扩展到更复杂算子
- **PR**: #16950 `feat: Trace index splits in IndexLookupJoin for replay`
- **链接**: [facebookincubator/velox PR #16950](https://github.com/facebookincubator/velox/pull/16950)

**路线图信号：**  
Velox 正在持续建设复杂算子的 trace/replay 能力，这对大规模生产问题复现和回归测试体系很关键。  
从工程投入方向看，**可观测性、可复现性、线上问题闭环** 是当前核心路线之一。

---

### 4) README 展示最新博客与工程自动化增强
- **PR**: #16955 `feat: Show recent blog posts in README`
- **链接**: [facebookincubator/velox PR #16955](https://github.com/facebookincubator/velox/pull/16955)

**路线图信号：**  
虽然不是内核功能，但它反映维护者在强化项目对外可见性与知识传播，同时配套 pre-commit hook 自动更新 README。  
这说明项目在继续向“更易参与、更易理解”的开源协作模式演进。

---

## 7. 用户反馈摘要

### 1) 贡献者对工程门禁一致性有真实痛点
- **Issue**: #16952
- **链接**: [facebookincubator/velox Issue #16952](https://github.com/facebookincubator/velox/issues/16952)

从 Issue 描述可以看出，用户/贡献者的直接痛点不是 Python 脚本本身，而是：
- 主分支未经过同样的 pre-commit 校验
- 导致后来者在无关改动中也被格式错误“连带阻塞”
- PR 工作流与 main 分支工作流存在不一致

这类反馈通常意味着：
- 贡献成本被放大
- 开发者对 CI 结果的信任感下降
- 需要尽快建立 main 分支的等价检查

---

### 2) 下游 CI 与上游内核 bug 的联动越来越紧密
- **PR**: #16954 `docs: From flaky Axiom CI to a Velox bug fix`
- **链接**: [facebookincubator/velox PR #16954](https://github.com/facebookincubator/velox/pull/16954)

这篇博客型 PR 本身就传递了一个重要用户视角：  
**很多 Velox 问题最先并不是在 Velox 自己 CI 中暴露，而是在下游系统 CI 中被放大和定位。**

反映出的实际使用场景包括：
- 下游查询系统依赖 Velox 执行语义稳定性
- 慢速、复杂、近真实的数据/算子组合更容易触发边缘 bug
- 用户希望项目提供更强的复现、调试、信号提取方法论

---

## 8. 待处理积压

以下为值得维护者持续关注的较长期未合并 PR：

### 1) Base32 编解码 PR 挂起时间较长
- **PR**: #16235 `feat(encode): Add Base32 encoding`
- **创建时间**: 2026-02-04
- **链接**: [facebookincubator/velox PR #16235](https://github.com/facebookincubator/velox/pull/16235)

**提醒原因：**
- 已存在较长时间
- 属于用户可见功能补齐
- 若长期停留，可能影响外部对函数扩展节奏的预期

---

### 2) Spark SQL AES 加解密函数仍未落地
- **PR**: #16782 `feat(sparksql): Add aes_encrypt and aes_decrypt functions`
- **创建时间**: 2026-03-16
- **链接**: [facebookincubator/velox PR #16782](https://github.com/facebookincubator/velox/pull/16782)

**提醒原因：**
- 对 Spark SQL 兼容性价值较高
- 功能面较完整
- 建议维护者优先明确 review 反馈和合入门槛

---

### 3) Perfetto SDK 升级仍在等待
- **PR**: #16835 `build: Update perfetto SDK to v54`
- **创建时间**: 2026-03-19
- **链接**: [facebookincubator/velox PR #16835](https://github.com/facebookincubator/velox/pull/16835)

**提醒原因：**
- 构建依赖升级通常涉及编译器兼容性和警告治理
- 该 PR 已处理 GCC 13 的 `-Warray-bounds` 问题
- 若迟迟不合并，可能拖慢 tracing/性能分析相关依赖的同步

---

## 总结判断
今天的 Velox 呈现出比较健康的“内核打磨型”开发节奏：  
一方面，**Nimble 元数据缓存优化、HashTable 文档补齐** 体现了性能和可维护性同步推进；另一方面，**counting join、列读取、spill 配置、flaky test** 等修复则表明项目在持续压实正确性与稳定性基础。  
短期内建议维护者优先处理两类事项：  
1. **高优先级正确性修复**：#16949、#16951  
2. **工程流程闭环问题**：#16952  

如果需要，我还可以把这份日报继续整理成：
- **适合发群/邮件的 1 页简版**
- **Markdown 周报格式**
- **按“查询引擎 / 存储 / 工程效能”分类的管理层视图**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-30）

## 1. 今日速览

过去 24 小时内，Apache Gluten 整体活跃度中等偏低：Issue 更新 1 条、PR 更新 5 条、无新版本发布。  
从变更类型看，今日工作重心仍集中在 **Velox 后端适配、Spark 兼容性补齐、工具链依赖维护**，同时有部分历史 PR 被关闭，说明维护者在清理积压项。  
新增/活跃讨论中，最值得关注的是一个 **Velox 上游 PR 跟踪 Issue**，反映出 Gluten 社区仍在持续推动上游能力回流，而不是长期依赖私有补丁。  
总体来看，项目健康度稳定，但也暴露出一些信号：**部分功能 PR 处于 stale 状态，路线推进依赖上游 Velox 合并节奏**。

---

## 3. 项目进展

### 已关闭 / 关闭的重要 PR

#### 1) #11840 `[GLUTEN-11379][VL] remove banned class from spark-32 build`
- 状态：**CLOSED**
- 链接：apache/gluten PR #11840
- 作者：@zhouyuan
- 说明：该 PR 针对 **Spark 3.2 构建链路**中的 banned class 问题进行清理。
- 影响分析：
  - 属于 **构建合规性/依赖治理** 类改动；
  - 有助于降低 Spark 3.2 适配分支的构建风险；
  - 虽然不是直接的查询性能改进，但对发行稳定性、CI 通过率、兼容性维护有积极作用。
- 判断：该类问题通常关系到老版本 Spark 支持的可持续性，是 Gluten 多 Spark 版本兼容策略的一部分。

#### 2) #11454 `[WIP][VL] Add snappy to gluten columnar shuffle compression codec`
- 状态：**CLOSED**
- 链接：apache/gluten PR #11454
- 作者：@taiyang-li
- 说明：原本尝试为 **Gluten columnar shuffle** 增加 **Snappy 压缩 codec** 支持。
- 影响分析：
  - 该方向本身非常关键，涉及 **列式 shuffle 的网络传输与 CPU 压缩开销平衡**；
  - 但当前 PR 被关闭且带有 `stale` 标记，表明该需求暂未进入可交付阶段，可能存在设计、实现或优先级问题；
  - 对用户而言，这意味着在 shuffle 压缩策略上，短期内仍需依赖现有 codec 方案。
- 判断：这是一个值得持续关注的性能优化方向，但今天的状态更像是 **需求延后** 而非落地推进。

---

### 仍在推进中的 PR

#### 3) #11843 `[CH][VL] Move DateFormatter and TimestampFormatter creation out of partition value loops`
- 状态：**OPEN**
- 链接：apache/gluten PR #11843
- 作者：@acvictor
- 说明：将 `DateFormatter` 与 `TimestampFormatter` 的创建移出分区值循环，在 `CHIteratorApi` 和 `VeloxIteratorApi` 中复用实例。
- 技术价值：
  - 这是典型的 **热路径对象复用优化**；
  - 可减少文件迭代过程中的重复构造开销；
  - 对 **分区扫描、文件枚举、时间类型格式化** 场景可能带来更稳定的 CPU 使用表现。
- 涉及模块：
  - **Velox**
  - **ClickHouse**
- 判断：虽然改动看似较小，但属于执行链路中的细粒度优化，对大规模分区表读取可能有真实收益。

#### 4) #11549 `[VL][SPARK-46725] Support dayname function for Spark 4.0+`
- 状态：**OPEN**
- 链接：apache/gluten PR #11549
- 作者：@yaooqinn
- 说明：为 Spark 4.0/4.1 引入 `dayname` 函数支持。
- 技术价值：
  - 属于 **SQL 兼容性补齐**；
  - 对齐 Spark 新版本内置函数行为，提升 Gluten 在 Spark 4.x 场景下的表达式覆盖率；
  - 有助于减少回退到 Vanilla Spark 的概率。
- 判断：这类函数级兼容 PR 往往会优先进入后续版本，因为它直接影响 SQL 可执行性与迁移体验。

#### 5) #11846 `Bump pyasn1 from 0.4.8 to 0.6.3`
- 状态：**OPEN**
- 链接：apache/gluten PR #11846
- 作者：@dependabot[bot]
- 说明：升级 `/tools/workload/benchmark_velox/analysis` 下的 Python 依赖 `pyasn1`。
- 影响分析：
  - 属于 **工具链与安全/依赖维护**；
  - 不直接影响查询引擎执行正确性；
  - 但对 benchmark/analysis 工具环境维护有正面意义。
- 判断：这类 PR 合并门槛通常较低，但仍需确认与现有分析脚本兼容。

---

## 4. 社区热点

### 热点 1：#11585 `[VL] useful Velox PRs not merged into upstream`
- 状态：**OPEN**
- 评论：**16**
- 👍：**4**
- 链接：apache/gluten Issue #11585

#### 热点原因
这是今天最活跃的讨论主题，也是当前最能反映项目路线图的信号之一。Issue 用于跟踪 **由 Gluten 社区提交、但尚未合并进 Velox 上游的有用 PR**。

#### 背后的技术诉求
1. **减少私有补丁负担**  
   社区明确提到没有直接 pick 到 `gluten/velox`，因为 rebase 成本高。这说明维护者更倾向于推动 **上游合并优先**，避免长期维护 fork 差异。

2. **加速 Velox 能力回流**  
   Gluten 与 Velox 紧密耦合，很多查询执行能力、表达式支持、算子优化都依赖 Velox 上游演进。  
   该 Issue 本质上是在管理一个“**未上游化能力清单**”。

3. **提高可见性与协作效率**  
   鼓励开发者将自己的 PR 编号补充到跟踪贴中，说明社区正尝试用集中式方式管理上游阻塞点。

#### 分析
这类 tracker issue 虽不直接交付功能，但对项目长期健康度意义很大。它表明 Gluten 当前不仅在做功能开发，还在关注 **上游依赖治理、维护成本控制、生态协同**。

---

## 5. Bug 与稳定性

过去 24 小时内，**未见明确新报出的高严重性 Bug、崩溃、查询正确性回归问题**。当前动态更多集中在优化、兼容性和维护层面。

按风险等级梳理如下：

### 低风险：构建与依赖维护
#### #11840 `remove banned class from spark-32 build`
- 状态：已关闭
- 链接：apache/gluten PR #11840
- 风险类型：构建/依赖合规
- 是否已有 fix：**该 PR 本身即为处理尝试，但当前已关闭**
- 影响：主要影响 Spark 3.2 构建稳定性，不属于运行期 crash。

#### #11846 `Bump pyasn1 from 0.4.8 to 0.6.3`
- 状态：开放中
- 链接：apache/gluten PR #11846
- 风险类型：工具依赖老化
- 是否已有 fix：**有，PR 已提交**
- 影响：偏工具链，非核心执行面。

### 中低风险：性能与执行路径细节
#### #11843 `Move DateFormatter and TimestampFormatter creation out of partition value loops`
- 状态：开放中
- 链接：apache/gluten PR #11843
- 风险类型：性能低效 / 热路径开销
- 是否已有 fix：**有，PR 已提交**
- 影响：可能改善高分区、高文件数量扫描场景下的执行效率，但不是正确性问题。

### 暂无证据表明存在
- 新的 query correctness 回归
- 内存泄漏 / native crash
- Spark 版本升级导致的大面积功能失效

---

## 6. 功能请求与路线图信号

### 1) Velox 上游能力回流仍是核心路线
#### 相关条目：#11585
- 链接：apache/gluten Issue #11585
- 信号解读：
  - Gluten 社区持续依赖 Velox 的演进；
  - 当前重点不是“本地长期分叉”，而是“推动上游接纳”；
  - 这意味着未来版本中很多能力是否可用，将继续受 Velox PR 合并节奏影响。

### 2) Spark 4.x SQL 函数兼容正在补齐
#### 相关条目：#11549 `Support dayname function for Spark 4.0+`
- 链接：apache/gluten PR #11549
- 信号解读：
  - Spark 4.0/4.1 适配仍在持续；
  - `dayname` 这类函数级支持说明 Gluten 正逐步填补新版本 Spark 的表达式差异；
  - 预计未来版本会继续出现更多 **Spark 4.x 内置函数兼容 PR**。
- 纳入下一版本可能性：**较高**

### 3) Shuffle 压缩 codec 扩展存在需求，但节奏放缓
#### 相关条目：#11454 `Add snappy to gluten columnar shuffle compression codec`
- 链接：apache/gluten PR #11454
- 信号解读：
  - 用户/开发者对 **列式 shuffle 压缩能力增强**有实际需求；
  - 但该项目前处于关闭状态，说明短期内未成熟。
- 纳入下一版本可能性：**中低，需等待新实现或重新发起**

### 4) CH / Velox 双后端共享优化仍在持续
#### 相关条目：#11843
- 链接：apache/gluten PR #11843
- 信号解读：
  - 优化同时涉及 `CHIteratorApi` 与 `VeloxIteratorApi`，反映项目仍在维护 **双后端执行路径的一致性优化**；
  - 后续版本可能继续出现类似“共享扫描/格式化/文件迭代逻辑优化”改进。
- 纳入下一版本可能性：**较高**

---

## 7. 用户反馈摘要

基于今日活跃 Issue 的评论与摘要，可提炼出以下用户/开发者真实诉求：

### 1) 用户更关心“上游可用性”而非短期 fork 修补
#### 来自：#11585
- 链接：apache/gluten Issue #11585
- 反馈摘要：
  - 社区成员希望有一个公开列表跟踪尚未进入 Velox 上游的关键 PR；
  - 这反映出开发者在实际使用中已经感受到 fork 维护、rebase、版本漂移带来的成本；
  - 用户并不满足于“本地能跑”，更看重 **长期可维护性和上游一致性**。

### 2) Spark 新版本迁移场景仍在推进
#### 来自：#11549
- 链接：apache/gluten PR #11549
- 反馈摘要：
  - `dayname` 支持说明用户已经在尝试 Spark 4.0+；
  - 他们希望 Gluten 不只是提供基础算子加速，还能在 SQL 层尽量做到无感兼容；
  - 对最终用户而言，函数缺失会直接影响迁移可行性。

### 3) 大规模扫描路径中的微优化具有现实意义
#### 来自：#11843
- 链接：apache/gluten PR #11843
- 反馈摘要：
  - 即便只是 formatter 实例复用，也值得专门提 PR；
  - 说明在真实场景下，文件/分区遍历开销足够敏感，社区正在持续打磨执行热路径。

---

## 8. 待处理积压

以下条目建议维护者重点关注：

### 1) #11549 `[VL][SPARK-46725] Support dayname function for Spark 4.0+`
- 状态：OPEN，带 `stale`
- 链接：apache/gluten PR #11549
- 原因：
  - 该 PR 关系到 **Spark 4.x SQL 兼容性**；
  - 功能明确、用户价值直接；
  - 若长期 stale，可能影响 Spark 4.x 用户采用意愿。
- 建议：尽快完成 review，确认函数语义、fallback 行为及测试覆盖。

### 2) #11585 `[VL] useful Velox PRs not merged into upstream`
- 状态：OPEN
- 链接：apache/gluten Issue #11585
- 原因：
  - 这是路线图级别的 tracker；
  - 若长期无人维护更新，容易导致社区对“哪些能力被上游阻塞”失去透明度。
- 建议：维护者定期整理列表，增加 PR 状态、阻塞原因、替代方案。

### 3) #11454 `[WIP][VL] Add snappy to gluten columnar shuffle compression codec`
- 状态：CLOSED，带 `stale`
- 链接：apache/gluten PR #11454
- 原因：
  - 尽管已关闭，但主题本身对性能与资源利用率有潜在价值；
  - 若社区对 shuffle 压缩 codec 有持续诉求，建议转为 issue 或重开设计讨论。
- 建议：确认关闭原因，是设计不合理、缺测试、还是优先级不足。

### 4) #11843 `[CH][VL] Move DateFormatter and TimestampFormatter creation out of partition value loops`
- 状态：OPEN
- 链接：apache/gluten PR #11843
- 原因：
  - 改动范围小、收益明确，适合快速推进；
  - 若长时间搁置，会影响项目“小步快跑”的优化节奏。
- 建议：优先 review，补充 benchmark 数据会更有助于合并。

---

## 附：今日项目健康度判断

- **活跃度**：中低
- **开发重心**：Velox 上游协同、Spark 4.x 兼容、执行路径微优化、依赖治理
- **风险水平**：低到中低，暂无严重稳定性告警
- **维护信号**：存在 stale PR，需要继续清理和聚焦高价值功能项

如果你愿意，我还可以进一步把这份日报整理成：
1. **适合邮件/飞书发送的精简版**  
2. **面向管理层的周报口吻版**  
3. **面向内核开发者的技术深读版**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-30）

## 1. 今日速览

过去 24 小时内，Apache Arrow 项目共有 **31 条开发动态**：**19 条 Issue 更新**、**12 条 PR 更新**，整体活跃度处于 **中高位**，但以**存量议题清理、stale 关闭和少量增量修复推进**为主。  
今天没有新版本发布，开发重点主要集中在 **Python API 演进、C++/Parquet 正确性修复、R/CI 环境维护、Flight SQL 构建能力** 等方向。  
从关闭项分布看，多个 2022–2025 年遗留 Issue/PR 因 stale 机制被清理，说明项目在持续整理积压，但也反映出部分长期设计议题尚未形成明确落地节奏。  
值得关注的是，**Feather Python 接口弃用**已从 Issue 进入 PR 阶段，属于较明确的路线图信号；同时 **Parquet 时间戳写入整数溢出检查** 也显示出项目对数据正确性的持续加强。

---

## 3. 项目进展

> 今日无 release；以下聚焦已关闭/推进中的重要 PR 与其技术意义。

### 3.1 Python Feather 弃用推进，接口收敛到 IPC
- **PR #49590** `[OPEN]` [Python] deprecate feather python  
  链接: apache/arrow PR #49590

该 PR 直接响应 **Issue #49232**，计划弃用 Python 侧 `pyarrow.feather` 读写接口，推动用户迁移到 `pyarrow.ipc`。  
这对分析型存储引擎生态的意义在于：

- 减少语义重复接口，收敛维护成本
- 强化 Arrow IPC 作为统一列式交换格式的核心地位
- 降低 Python 侧“格式名不同、底层实际相同”带来的认知负担

这类改动不是查询引擎功能增强，但属于**API 治理和产品线简化**，通常会在后续版本中体现为弃用警告、文档迁移指南和分阶段移除策略。

---

### 3.2 Parquet 时间戳写入正确性修复在路上
- **PR #49615** `[OPEN]` [C++][Parquet] Check for integer overflow when coercing timestamps  
  链接: apache/arrow PR #49615

这是今天最值得工程团队关注的修复候选之一。PR 指出：Arrow 时间戳写入 Parquet 时，单位换算中的乘法此前**没有做整数溢出检查**，可能导致**静默写出错误数据**。  
影响面主要包括：

- 高精度/大范围时间戳数据写入 Parquet
- ETL/批处理链路中的隐蔽数据损坏风险
- 下游 OLAP 查询对时间列的正确性依赖

这类问题比普通构建失败更重要，因为它涉及**存储正确性**。若合入，属于典型的“数据可靠性增强修复”。

---

### 3.3 R/CI 基础设施修复，减少平台阻塞
- **PR #49610** `[OPEN]` [CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found  
  链接: apache/arrow PR #49610

该 PR 修复 Windows AMD64 R release 流水线因测试 bucket 不存在而失败的问题。  
虽然不直接增加功能，但它对项目健康非常关键：

- 恢复 R 平台发布/验证链路稳定性
- 减少跨平台回归掩蔽真实功能问题
- 提高后续 R 相关改动的可验证性

对于开源分析引擎项目，CI 健康度本身就是交付能力的一部分。

---

### 3.4 Flight SQL/ODBC 静态构建探索
- **PR #49585** `[OPEN][DRAFT]` set up static build of ODBC FlightSQL driver  
  链接: apache/arrow PR #49585

该草案 PR 还处于试验阶段，目标是建立 **Flight SQL ODBC 驱动静态构建**。  
如果后续成熟，潜在价值包括：

- 提升 Flight SQL 在企业桌面/BI/ODBC 客户端环境中的可分发性
- 降低部署时对动态库链的依赖复杂度
- 有助于 Arrow 作为分析系统互联协议层的落地

从 OLAP 生态视角看，这类工作有助于增强 Arrow 在**连接器与查询接入层**的渗透率。

---

### 3.5 C++ 类型系统代码整理持续推进
- **PR #46616** `[OPEN]` [C++]: Refactor - move type singleton logic into type.cc/h and tests  
  链接: apache/arrow PR #46616

这是偏内部工程质量的重构 PR。虽然不直接提供用户可见功能，但对：

- 类型系统代码边界清晰化
- 测试组织优化
- 后续类型扩展和维护效率

都有长期正面作用。Arrow 这类底层列式内核项目，很多能力演进依赖于这类“非功能性重构”铺路。

---

### 3.6 今日关闭 PR 概况
今日关闭的 PR 多数属于**文档、构建兼容性、陈旧提案清理**，包括：

- **PR #46003** `[CLOSED]` Python `pa.array(..., safe=False)` 语义一致性修正提案  
  链接: apache/arrow PR #46003
- **PR #45160** `[CLOSED]` Python Tensor 文档补充  
  链接: apache/arrow PR #45160
- **PR #44517** `[CLOSED]` JS 依赖迁移到 `devDependencies`  
  链接: apache/arrow PR #44517
- **PR #46257** `[CLOSED]` AFS 文件系统支持  
  链接: apache/arrow PR #46257
- **PR #48840** `[CLOSED]` R 文档 typo 修复  
  链接: apache/arrow PR #48840
- **PR #48852** `[CLOSED]` Boost::headers + Thrift 构建错误修复  
  链接: apache/arrow PR #48852

这些关闭项说明：今天的主基调不是功能大规模合并，而是**清理旧提案、维持构建/文档/接口治理节奏**。

---

## 4. 社区热点

### 4.1 Dataset 路径列表解析需求长期存在
- **Issue #31167** `[CLOSED]` [Dataset][Python] Parse a list of fragment paths to gather filters  
  链接: apache/arrow Issue #31167
- 评论数：**17**

这是今天评论/历史讨论最丰富的 Issue 之一。用户希望 `partitioning.parse()` 能够处理**一组路径**而非单一路径，以便在增量数据处理、覆盖写入（如 `delete_matching`）后仍能可靠提取分区过滤条件。  
背后的技术诉求很明确：

- 数据湖/数据集场景下的**多文件增量处理**
- 将文件访问结果传递给下游任务时，希望自动恢复**分区谓词**
- 降低用户自行解析路径和拼装过滤器的成本

虽然该 Issue 被 stale 关闭，但其需求本质上属于 **dataset 扫描器与分区裁剪易用性增强**，对 OLAP 增量任务非常贴近真实场景。

---

### 4.2 Python 单数组 C Stream 接口支持
- **Issue #31194** `[CLOSED]` [Python] Support C stream interface of single arrays  
  链接: apache/arrow Issue #31194
- 评论数：**12**

用户指出 pyarrow 的 C stream interface 当前似乎要求数组必须是 `StructArray`，而这与其对规范的理解不一致。  
背后的核心诉求是：

- 降低 Arrow C Data / C Stream 接口接入门槛
- 支持更细粒度的数据交换对象，而非强制包装成结构体
- 增强跨语言零拷贝互操作能力

对于数据库、UDF 引擎、向量化执行器和嵌入式分析框架，这类互操作一致性很重要。

---

### 4.3 R Schema 操作体验改进
- **Issue #35071** `[OPEN]` [R] Improve interface for working with schemas  
  链接: apache/arrow Issue #35071
- 评论数：**5**
- 优先级：**Critical**

该 Issue 虽评论不算最高，但优先级高，值得重点看。用户反馈在 R 中操作 schema、执行逻辑组合时体验较差，难以复现以 Python 为主的 Arrow 工作流。  
背后反映出：

- Arrow 多语言生态间的能力平衡仍不完全一致
- R 用户对 schema 变换、类型推导、表达式组合有明确诉求
- 分析引擎用户希望语言绑定层尽量具备相近抽象能力

---

### 4.4 Python Feather 弃用成为清晰路线图信号
- **Issue #49232** `[OPEN]` [Python] Deprecate Feather reader and writer  
  链接: apache/arrow Issue #49232
- **PR #49590** `[OPEN]` [Python] deprecate feather python  
  链接: apache/arrow PR #49590

这是今天最清晰的“Issue→PR”联动案例。说明该议题已经从讨论阶段进入实现阶段，纳入后续版本的概率较高。  
技术动机是统一 Arrow IPC 与 Feather V2 的叙事，减少重复包装。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### 5.1 高严重：Parquet 时间戳写入可能发生静默数据损坏
- **PR #49615** `[OPEN]` [C++][Parquet] Check for integer overflow when coercing timestamps  
  链接: apache/arrow PR #49615
- 关联 Issue: **#47657**（在 PR 摘要中提及）

**风险级别：高**  
问题本质是时间戳单位转换时的乘法缺少溢出检查，可能写入错误值而非显式报错。  
这类问题影响：

- 数据仓库离线入库
- 时间序列分析
- 审计、金融、日志等依赖时间精度的场景

**是否已有 fix PR：有，#49615**

---

### 5.2 中高严重：Windows R Release CI 失败
- **PR #49610** `[OPEN]` [CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found  
  链接: apache/arrow PR #49610
- 关联 Issue: **#49609**

**风险级别：中高**  
这不是运行时数据错误，但会影响：

- R Windows 平台的发布验证
- 跨平台回归发现能力
- 贡献者对 R 改动的信心

**是否已有 fix PR：有，#49610**

---

### 5.3 中等：Thrift + Boost 构建兼容性问题提案被关闭
- **PR #48852** `[CLOSED]` Fix error with Boost::headers when building with Thrift  
  链接: apache/arrow PR #48852

**风险级别：中**  
说明某些 C++/Parquet 构建组合存在依赖解析问题，但该 PR 今日已关闭，当前不清楚是否由其他路径修复或暂不接收。  
建议相关用户继续跟踪替代修复方案。

---

### 5.4 中等：Python `safe=False` 语义不一致提案关闭
- **PR #46003** `[CLOSED]` [Python] Make pa.array(..., safe=False) behave like .cast(..., safe=False)  
  链接: apache/arrow PR #46003

**风险级别：中**  
该问题涉及 API 行为一致性：用户预期 `safe=False` 允许有损转换，但实际数组构造与 cast 行为不一致。  
虽非崩溃，但会影响数据清洗和类型转换流程的可预测性。

---

### 5.5 中等偏低：Parquet 批次写入 OOM 使用问题
- **Issue #45638** `[CLOSED]` [C++] Writing batches to parquet batch-by-batch triggering OOM  
  链接: apache/arrow Issue #45638

**风险级别：中**  
用户在逐批写 Parquet 时遭遇 OOM。虽然被归类为 usage 且已 stale 关闭，但它反映出：

- 写入器缓冲/row group 策略的理解门槛较高
- 大批量持续写入时内存控制仍是常见痛点

**是否已有 fix PR：未见直接关联 fix PR**

---

### 5.6 中等偏低：树莓派上 Python wheel 构建失败
- **Issue #45634** `[CLOSED]` [C++][Python] error: invalid use of incomplete type ‘class arrow::dataset::CsvFileWriteOptions’  
  链接: apache/arrow Issue #45634

**风险级别：中低**  
这是 ARM/嵌入式平台构建兼容性问题，影响特定部署环境。虽已关闭，但表明非主流平台的打包链路仍存在摩擦。

---

## 6. 功能请求与路线图信号

### 6.1 高概率进入后续版本：Python Feather 弃用
- **Issue #49232**  
  链接: apache/arrow Issue #49232
- **PR #49590**  
  链接: apache/arrow PR #49590

这是目前最明确的路线图项。由于已进入实现阶段，预计后续版本会出现：

- 弃用警告
- 文档迁移说明
- 向 `pyarrow.ipc` 的明确迁移路径

---

### 6.2 Python 批次拼接 API 对齐 tables
- **Issue #49574** `[OPEN]` `pa.concat_batches()` to include `promote_options` like `pa.concat_tables()`  
  链接: apache/arrow Issue #49574

这是一个很实际的 Python API 增强请求。  
若实现，将提升：

- schema 不完全一致批次的拼接灵活性
- 流式处理、批次归并、增量摄取场景的开发体验
- `concat_tables` / `concat_batches` 之间的 API 一致性

从需求性质看，这种“补齐现有 API 能力”的提案有较高落地可能，但当前尚无对应 PR。

---

### 6.3 Dataset 层嵌套字段谓词下推
- **Issue #20203** `[OPEN]` [C++] Add support for pushdown filtering of nested references  
  链接: apache/arrow Issue #20203

这是非常典型的查询引擎能力增强需求。若实现，将改进：

- 嵌套结构字段的 row group / fragment 级裁剪
- Parquet + Dataset 组合下的扫描效率
- 半结构化数据分析性能

从 OLAP 角度，这属于真正的**查询优化器/存储层协同优化**，价值高，但今天未见直接推进 PR，仍属长期路线图议题。

---

### 6.4 ExecBatch 标量列向 RLE 数组演进
- **Issue #31680** `[OPEN]` [C++] abandon scalar columns of an ExecBatch in favor of RLE encoded arrays  
  链接: apache/arrow Issue #31680

该议题更偏执行引擎内部模型优化。若推进，理论上可带来：

- 标量广播表达方式更统一
- 对运行长度编码场景更友好
- 执行器内部数据表示更适合向量化/压缩表达

这是具备架构层潜力的提案，但仍停留在讨论型长期议题。

---

### 6.5 Replace-with-mask 对完整 ChunkedArray 支持
- **Issue #31665** `[OPEN]` [C++] Implement full chunked array support for replace_with_mask  
  链接: apache/arrow Issue #31665

这类内核函数能力补齐会直接改善大表分块处理体验，特别适合：

- 数据清洗
- 批式 ETL
- 多 chunk 数据上的统一算子行为

若未来有 PR，比较可能作为“内核一致性增强”纳入版本更新。

---

### 6.6 R Schema 操作体验改进
- **Issue #35071** `[OPEN]` [R] Improve interface for working with schemas  
  链接: apache/arrow Issue #35071

尽管没有对应 PR，但因其 **Critical** 标记，建议视为较强路线图信号。  
尤其在多语言分析生态中，R 绑定若持续弱于 Python，会影响 Arrow 在统计计算用户群体中的采用深度。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 更新，可提炼出以下真实用户痛点：

### 7.1 数据湖增量处理场景下，分区过滤提取仍不够顺手
- 代表链接: **Issue #31167**  
  apache/arrow Issue #31167

用户会把 file visitor 返回的路径传给下游任务，希望 Arrow 直接从**路径列表**恢复过滤条件。  
这说明 Arrow Dataset 虽强大，但在**任务编排/增量作业**集成上还有易用性缺口。

---

### 7.2 跨语言/跨运行时零拷贝接口存在“规范与实现感知不一致”
- 代表链接: **Issue #31194**  
  apache/arrow Issue #31194

用户对 C stream interface 的预期与 pyarrow 当前行为不一致，说明底层互操作能力虽强，但封装层仍有“隐式约束”让人困惑。  
这对数据库扩展、向量执行框架、FFI 使用者影响较大。

---

### 7.3 R 用户希望拥有接近 Python 的 schema 操作能力
- 代表链接: **Issue #35071**  
  apache/arrow Issue #35071

反馈显示，R 侧在 schema 检查、逻辑运算、复现博客/示例流程时摩擦较多。  
这说明多语言生态的一致体验仍是 Arrow 需要持续补齐的方向。

---

### 7.4 文档可发现性仍是用户高频诉求
- 代表链接:
  - **Issue #47499** `write_table` 文档未列出 `use_content_defined_chunking`  
    apache/arrow Issue #47499
  - **PR #47681** 时区 timestamp 的 `to_numpy()` 文档澄清  
    apache/arrow PR #47681

用户不只是要功能本身，也需要**参数可见性、边界行为说明、转换损失提示**。  
对于分析型引擎项目，文档缺失会直接转化为误用、性能问题或数据语义误解。

---

### 7.5 大数据写入与资源控制仍是实际部署中的常见痛点
- 代表链接: **Issue #45638**  
  apache/arrow Issue #45638

逐批写 Parquet 导致 OOM 的反馈说明，用户在批次大小、row group 刷盘、写入缓冲方面仍需要更明确的指导或更稳健默认值。

---

## 8. 待处理积压

以下是值得维护者关注的长期未解决议题或久未推进项：

### 8.1 嵌套字段谓词下推
- **Issue #20203** `[OPEN]`  
  链接: apache/arrow Issue #20203

这是对 Dataset/Parquet 查询性能非常关键的能力，长期搁置会影响 Arrow 在复杂嵌套数据上的竞争力。

---

### 8.2 ExecBatch 标量列表示优化
- **Issue #31680** `[OPEN]`  
  链接: apache/arrow Issue #31680

属于执行引擎内核设计问题，虽不紧急，但可能影响后续表达式执行与内部统一性。

---

### 8.3 非确定性表达式在 SimplifyWithGuarantee 中的错误折叠风险
- **Issue #31677** `[OPEN]`  
  链接: apache/arrow Issue #31677

这涉及**查询正确性**而非仅性能。即使评论不多，也应优先于一般 API 增强类需求。

---

### 8.4 nullary function / nullary batch 长度处理异常
- **Issue #20206** `[OPEN]`  
  链接: apache/arrow Issue #20206

这是执行引擎边界语义问题，可能影响特殊表达式求值与优化器行为，建议避免长期沉积。

---

### 8.5 Substrait consumer 特性感知
- **Issue #31668** `[OPEN]`  
  链接: apache/arrow Issue #31668

随着 Arrow 与 Substrait 的集成深化，消费者对编译特性缺失的优雅降级能力会越来越重要。  
这关系到计划可移植性和错误可解释性。

---

### 8.6 R Schema 体验改进
- **Issue #35071** `[OPEN][Critical]`  
  链接: apache/arrow Issue #35071

虽然不是底层内核 bug，但因标记为 Critical，且直接影响多语言生态使用体验，建议给予更明确的维护者反馈或设计方向。

---

## 总结判断

今天的 Apache Arrow 项目状态可概括为：**活跃但偏维护型的一天**。  
一方面，项目在持续清理历史 stale 议题，保持 issue/PR 池健康；另一方面，也出现了几个值得跟踪的实质性信号：

- **Python Feather 弃用进入实现阶段**
- **Parquet 时间戳写入正确性修复推进**
- **R Windows CI 故障正在处理**
- **Flight SQL/ODBC 可部署性探索持续**

从 OLAP 数据库与分析型存储引擎视角看，今日最重要的并不是新增大功能，而是**接口收敛、数据正确性、跨平台稳定性与生态接入能力**这几条主线在继续推进。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*