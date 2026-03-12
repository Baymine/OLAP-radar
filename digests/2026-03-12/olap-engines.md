# Apache Doris 生态日报 2026-03-12

> Issues: 25 | PRs: 113 | 覆盖项目: 10 个 | 生成时间: 2026-03-12 03:16 UTC

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

# Apache Doris 项目动态日报 · 2026-03-12

## 1. 今日速览

过去 24 小时内，Apache Doris 保持高活跃：**Issues 更新 25 条、PR 更新 113 条**，其中 **73 条 PR 仍待合并**，说明开发主线推进密集，评审与回合修改压力也较大。  
从内容看，今天的重点集中在三类：**外表/湖仓生态兼容性修复**、**查询执行与缓存/溢写优化**、以及**云模式与观测性增强**。  
稳定性方面，新增问题中出现了 **Iceberg 扫描导致 BE 崩溃**、**物化视图命中导致结果正确性异常**、**View + ORDER BY 过度列裁剪** 等较高优先级信号，反映出 Doris 在 4.0.x 上一边扩展湖仓与 AI/搜索能力，一边仍在持续补齐 correctness 与边界场景。  
社区层面，**2026 路线图讨论**仍是关注度最高的话题，显示项目方向正逐步从传统 MPP OLAP 扩展到 **AI/Hybrid Search、Lakehouse、插件化连接生态**。

---

## 2. 项目进展

### 今日已合并/关闭的重点 PR

#### 2.1 约束管理能力重构，提升元数据一致性
- **PR #61118** `[refactor](constraint): centralize constraint management in ConstraintManager`  
  链接: apache/doris PR #61118

该 PR 已关闭，核心是把约束的存储、CRUD、持久化、重命名、删除、迁移逻辑统一收敛到 `ConstraintManager`。  
这类重构短期不一定直接带来用户可见特性，但对 FE 元数据治理意义很大：
- 降低表级约束逻辑分散带来的维护成本
- 为后续约束推理、优化器利用、DDL 一致性处理打基础
- 有利于 schema 演进和 image/meta 迁移稳定性

**影响判断**：偏底层基础设施，利好中长期 SQL 语义完整性和元数据可靠性。

---

#### 2.2 倒排索引查询能力增强：MATCH 可作为虚拟列投影
- **PR #61092** `[feature](search) support MATCH projection as virtual column for inverted index evaluation`  
  链接: apache/doris PR #61092

该 PR 已关闭。其目标是让 `MATCH` 表达式在不能下推为过滤条件的场景下，仍可作为**虚拟列投影**参与倒排索引求值，例如 FULL OUTER JOIN 中的查询。  
这说明 Doris 在全文检索/混合检索路径上继续补全执行语义：

- 避免因 JOIN 语义限制而完全失去倒排索引加速
- 提高 MATCH 在复杂 SQL 中的可用性
- 与路线图里的 AI / Hybrid Search 方向一致

**影响判断**：这是搜索能力向复杂分析 SQL 语境渗透的重要一步。

---

#### 2.3 Paimon/OBS 兼容性修复已回灌多分支
- **PR #60995** `[paimon](obs) support pfs use in paimon catalog`  
  链接: apache/doris PR #60995
- **PR #61217** `branch-4.0: [paimon](obs) support pfs use in paimon catalog #60995`  
  链接: apache/doris PR #61217
- **PR #61076** `[opt](paimon) support paimon table with partition.legacy-name in date type`  
  链接: apache/doris PR #61076
- **PR #61164** `branch-40: ... partition.legacy-name in datetype`  
  链接: apache/doris PR #61164

今天关闭的多条 PR 都指向 **Paimon Catalog 与对象存储/分区兼容性**：
- 支持在 Paimon catalog 中使用 PFS/OBS
- 修复 `partition.legacy-name` 为 date 类型时的读取失败
- 且这些修复被 **cherry-pick 到 3.1.x / 4.0.x / 4.1.x 分支**

**影响判断**：
- 外表生态是当前 Doris 非常明确的主线
- 多分支回灌说明维护者认为这是**现实用户场景中的高价值兼容性问题**
- 对接云对象存储和湖仓元数据系统的稳定性继续提升

---

#### 2.4 测试稳定性修复，降低 file cache 相关误报
- **PR #61218** `[fix](test) fix unstable tests`  
  链接: apache/doris PR #61218

该 PR 主要修正 `clear_file_cache_directly()` 后，`information_schema.file_cache_statistics` 所依赖 bvar 指标不会同步刷新的问题。  
虽然表面上是“测试修复”，但背后暴露的是：
- file cache 指标更新路径和后台刷新周期之间有时序差
- 这类问题若扩展到线上观测，会影响运维对缓存状态的判断

**影响判断**：偏工程质量和可观测性修补，对保障后续 file cache 特性上线质量有帮助。

---

#### 2.5 几何函数 PR 被关闭，功能暂未进入主线
- **PR #61230** `Add GEOS-based planar geometry functions`  
  链接: apache/doris PR #61230

该 PR 今日关闭，意味着基于 GEOS 的平面几何函数暂未纳入当前主线。  
这通常反映两种可能：
- 依赖、包体或跨平台构建复杂度较高
- 需求存在，但优先级暂低于主线湖仓/搜索/执行引擎工作

---

## 3. 社区热点

### 3.1 2026 路线图仍是全社区最强信号
- **Issue #60036** `[Discuss] Doris Roadmap 2026`  
  作者: @morningman  
  评论: 12 | 👍: 15  
  链接: apache/doris Issue #60036

这是今天最值得关注的议题。摘要明确提出 2026 主题：  
**“Scale Intelligence, Accelerate Insights”**，重点押注：
- **AI & Hybrid Search**
- 查询性能提升
- 存储效率优化
- Lakehouse / 半结构化分析继续增强

**技术诉求分析**：
- Doris 已不满足于“传统数仓分析引擎”定位
- 正在向“兼具 OLAP、湖仓查询、全文/向量/混合检索”的统一分析底座演进
- 今天多个 PR（MATCH 投影、ES array keyword 修复、Paimon/Iceberg 兼容）都与此方向一致

---

### 3.2 2025 路线图正式关闭，意味着方向完成切换
- **Issue #47948** `[Discuss] Doris Roadmap 2025`  
  评论: 8 | 👍: 27  
  链接: apache/doris Issue #47948

2025 路线图在今日关闭，说明社区讨论与规划叙事已正式切换到 2026。  
从 2025 到 2026 的过渡可以看出：
- 2025 的 lakehouse / semi-structured data 基础建设已基本形成连续主线
- 2026 将更多强调 **AI 支持、混合搜索、统一索引能力**

---

### 3.3 外部数据源配置统一与插件化仍是长期热点
以下多个 stale 议题今天再次更新，虽评论不多，但集中反映了同一方向的长期诉求：

- **Issue #56015** `Optimize and unify data source property names`  
  链接: apache/doris Issue #56015
- **Issue #56016** `File system pluginization`  
  链接: apache/doris Issue #56016
- **Issue #56017** `JDBC Catalog pluginization`  
  链接: apache/doris Issue #56017
- **Issue #50238** `[Feature] refactor the connection properties`  
  链接: apache/doris Issue #50238

**背后技术诉求**：
- Catalog / 连接器属性命名不统一，增加用户接入门槛
- 文件系统与 JDBC catalog 的扩展能力尚需进一步解耦
- Doris 若要承接更广泛 lakehouse 场景，插件化和配置一致性是必经之路

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1 · BE 崩溃：Iceberg 表扫描/加载触发 SIGSEGV
- **Issue #61225** `[Bug] BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg table scanning/loading`  
  版本: v4.0.2  
  链接: apache/doris Issue #61225

**现象**：
- 读取或加载 Iceberg 表时，BE 持续崩溃
- 日志指向 `ByteArrayDictDecoder`、`std::out_of_range`

**风险**：
- 这是典型的高优先级稳定性问题
- 会直接影响外表查询可用性，且可能涉及编码/字典解码边界处理

**是否已有 fix PR**：**暂无直接对应 PR**  
**建议关注方向**：字典页解析、变长列解码、Iceberg reader 边界数据处理。

---

### P1 · 查询正确性：物化视图命中后结果不一致
- **Issue #61228** `[Bug] why the same sql select the result is different ,MATERIALIZED problem`  
  版本: 4.0.1  
  链接: apache/doris Issue #61228

**现象**：
- 相同 SQL 条件拆开查和合并查结果不同
- 用户已定位与 **命中物化视图** 有关
- 且 SQL 使用了 MV 不存在的字段，仍然发生命中，令人怀疑改写判定有误

**风险**：
- 这是比性能问题更严重的 **correctness 问题**
- 可能涉及查询改写、列血缘、补偿逻辑、聚合 MV 匹配判定

**是否已有 fix PR**：**暂无直接 fix**  
但今天有相关 MV 并发修复：
- **PR #61145** `[fix](mv) Fix ConcurrentModificationException in PartitionCompensator`  
  链接: apache/doris PR #61145

注意：该 PR 解决的是并发异常，不是这起“错误命中导致结果异常”的 correctness 问题。

---

### P1 · 查询正确性：View + ORDER BY 导致非排序列为空
- **Issue #61219** `[Bug] Doris View Order by 会过度列裁剪导致列为空`  
  版本: 4.0.1  
  链接: apache/doris Issue #61219

**现象**：
- `SELECT * FROM view ORDER BY a, b LIMIT 100`
- 除排序列 `a,b` 外，其余列为空
- 用户怀疑是优化器/执行器中的**过度列裁剪**

**风险**：
- 直接影响查询结果正确性
- 很可能与 Nereids 优化器中的 projection/column pruning 规则有关

**是否已有 fix PR**：**暂无直接 fix PR**

---

### P1 · FE/BE 异常：invalid field 导致 BE 启动后持续挂掉
- **Issue #59546** `[Bug] ... field name is invalid ...`  
  版本: 4.0.2  
  链接: apache/doris Issue #59546

**现象**：
- 用户报告日志出现 `field name is invalid`
- BE 触发后崩溃，重启仍会继续崩

**风险**：
- 可能是元数据或 schema 状态异常导致的恢复期 crash loop
- 一旦复现，影响线上恢复能力

**是否已有 fix PR**：**暂无**

---

### P2 · Nessie REST Catalog 可列库表但不能查数据
- **Issue #61191** `[Bug] Doris 配置 nessie rest catalog 连接 iceberg ，可能查看库和表，但是无法查询表数据`  
  版本: 4.0.3  
  链接: apache/doris Issue #61191

**现象**：
- 通过 Nessie REST Catalog 接 Iceberg
- 元数据浏览正常，但查询表数据失败

**风险判断**：
- 指向 **Catalog 接入链路“元数据可达但数据读取链未打通”**
- 是湖仓接入常见断层，通常与认证、位置解析、snapshot/schema 映射或读取层实现有关

**是否已有 fix PR**：暂无直接对应；今天与 Iceberg/外表相关修复仍较多，但未覆盖此问题。

---

### P2 · Stream Load + MV + Drop Column 后加载失败
- **Issue #55272** `[Bug] stream load failed for table with materialized view after drop column`  
  版本: 2.1.x / 3.0.x  
  链接: apache/doris Issue #55272

**现象**：
- 删除列后，带 MV 的表进行 stream load 失败
- 报错涉及类型转换失败

**风险判断**：
- 是 schema 演进与 MV/加载链路联动问题
- 对生产表结构迭代场景影响较大

**是否已有 fix PR**：暂无直接 fix。

---

### P2 · delete job 在 BE 永久失联时挂住
- **Issue #55971** `[Bug] delete job hangs when a be is dead forever`  
  链接: apache/doris Issue #55971

**风险判断**：
- 是典型的运维稳定性与任务收敛问题
- 影响异常节点场景下的后台任务恢复与资源回收

**是否已有 fix PR**：暂无。

---

### P3 · 其他稳定性与兼容性修复中的积极信号

以下 PR 说明维护者正在主动修补潜在问题：

- **PR #61240** `[Fix](agent task) avoid nullptr dereference in create_tablet_callback`  
  链接: apache/doris PR #61240  
  → 避免 agent task 回调中的空指针解引用，属于明显 crash fix。

- **PR #61223** `[fix](outfile) handle delete_existing_files before parallel export`  
  链接: apache/doris PR #61223  
  → 修复并行 outfile 导出时目录清理竞争，避免互删文件。

- **PR #61151** `[Fix](tz) Fix some issues about timezone`  
  链接: apache/doris PR #61151  
  → 修复 `TimestampTz`、`hour_ceil/hour_floor` 等时区相关行为。

- **PR #61236** `[fix](es-catalog) Fix query error when ES keyword field contains array data`  
  链接: apache/doris PR #61236  
  → 修复 ES 中 keyword/text 实际存数组时的查询错误，增强异构源兼容性。

- **PR #61241** `[fix](test) make hive compress split assertion multi-BE aware`  
  链接: apache/doris PR #61241  
  → 处理多 BE 环境下测试假设不成立的问题，体现执行计划分裂行为更贴近真实集群。

---

## 5. 功能请求与路线图信号

### 5.1 ASOF JOIN：时间序列/撮合类分析值得重点关注
- **PR #59591** `[feature](join) support ASOF join`  
  链接: apache/doris PR #59591

这是今天最重要的功能型 PR 之一。  
`ASOF JOIN` 常用于：
- 行情与成交对齐
- IoT 时序最近点匹配
- 实时维表近邻匹配

**判断**：如果顺利合入，将明显增强 Doris 在时序分析、金融分析场景的 SQL 表达力，具备进入下一版本的潜力。

---

### 5.2 全局单调递增 TSO：事务与分布式协调基础设施增强
- **PR #61199** `[feature](tso) Add global monotonically increasing Timestamp Oracle(TSO)`  
  链接: apache/doris PR #61199

引入全局单调递增时间戳服务，通常意味着：
- 为事务排序、全局一致性、快照语义提供统一时基
- 有利于云架构、多实例协同、未来更复杂的事务/复制语义

**判断**：偏基础设施级能力，中长期价值很高，值得持续跟踪。

---

### 5.3 Spill 多级分区：面向大查询的内存韧性增强
- **PR #61212** `[feat](spill) Support multi-level partition spilling`  
  链接: apache/doris PR #61212

当单层 spill 后内存仍不足时，继续对 spill 分区再分裂为更小子分区。  
这对于大 join / 聚合 / 重分布类查询很关键：

- 降低峰值内存
- 提高“超内存规模查询”的完成概率
- 对云上资源弹性和低配实例更友好

**判断**：这是明显的执行引擎增强，进入下一版本概率较高。

---

### 5.4 文件缓存子系统持续演进
相关 PR：
- **PR #59065** `[feature](cache) support file cache admission control`  
  链接: apache/doris PR #59065
- **PR #57410** `[feature](filecache) A 2Q-LRU mechanism for protecting hotspot data`  
  链接: apache/doris PR #57410
- **PR #60583** `[feature](file-cache) Separate file cache control for OLAP tables and external catalogs`  
  链接: apache/doris PR #60583

这些 PR 一起看，说明 Doris 正在把 file cache 从“有缓存”推进到“可控、可分层、可保护热点、可区分场景”：
- admission control 防止低价值数据污染缓存
- 2Q-LRU 保护热点
- OLAP 表与外部 Catalog 分开控制策略

**判断**：这组能力非常符合 lakehouse 查询优化方向，预计会持续进入 4.1 及后续版本。

---

### 5.5 云模式能力继续完善
- **PR #61221** `[feat](cloud) implement decouple_instance`  
  链接: apache/doris PR #61221
- **PR #61036** `[feat](cloud) Add lock wait and bthread schedule delay metrics to SyncRowset profile`  
  链接: apache/doris PR #61036
- **PR #61239** `branch-4.0: Improve information_schema.partitions getVisibleVersion latency under cloud mode`  
  链接: apache/doris PR #61239

**判断**：云原生形态不是附属方向，而是 Doris 主线能力的一部分，且正从“能用”走向“可观测、可维护、性能更稳”。

---

### 5.6 长期需求信号：生态插件化与联邦能力
以下 Issues 虽处于 stale 状态，但方向清晰：
- **Issue #56002** `Support Iceberg small file compaction and Snapshot management`  
  链接: apache/doris Issue #56002
- **Issue #56004** `Support Snowflake Iceberg table engine`  
  链接: apache/doris Issue #56004
- **Issue #56010** `Support Hive 4 transaction table`  
  链接: apache/doris Issue #56010
- **Issue #56011** `Support Doris Catalog: federated queries across multiple Doris clusters`  
  链接: apache/doris Issue #56011

**判断**：
- Iceberg 运维能力、Snowflake Iceberg、Hive 4 ACID、Doris-to-Doris 联邦查询
- 都很符合 2026 roadmap 的外部生态与统一分析方向
- 其中 **Iceberg 运维能力** 与 **联邦查询** 最值得关注，落地概率相对更高

---

## 6. 用户反馈摘要

结合今日 Issues，可提炼出几类真实用户痛点：

### 6.1 “能连上”不等于“能稳定查询”
典型案例：
- **Issue #61191** Nessie REST Catalog 可看库表但不能查数
- **Issue #61225** Iceberg 扫描直接导致 BE 崩溃

这说明用户对 Doris 的期待已经不仅是“对接外部源”，而是要求其在 **Iceberg / ES / Paimon / Hive** 等生态中达到生产稳定级别。

---

### 6.2 用户非常敏感于查询正确性问题
典型案例：
- **Issue #61228** MV 命中后结果不一致
- **Issue #61219** View + ORDER BY 后列为空

对于 OLAP 引擎来说，性能下降还能接受，但**结果错误几乎不可接受**。  
今天这两条问题都属于高关注类型，即使评论不多，也应优先处理。

---

### 6.3 Schema 演进和后台任务恢复仍是实际运维痛点
典型案例：
- **Issue #55272** drop column 后 stream load 失败
- **Issue #55967** 新增分区后 storage policy 未保存
- **Issue #55971** BE 永久失联时 delete job 卡死

这类问题说明用户正在生产环境中大量进行：
- 表结构变更
- 分区扩缩
- 存储策略调整
- 异常节点运维

Doris 的“数据库工程化能力”正在接受更高强度检验。

---

### 6.4 配置一致性和协议兼容仍有明显需求
典型案例：
- **Issue #50238** refactor the connection properties
- **Issue #56015** unify data source property names
- **Issue #55541** support PostgreSQL wire protocol（已关闭）

说明用户希望 Doris：
- 接入配置更统一
- 与现有工具链兼容更好
- 尽量减少因协议/参数差异带来的迁移成本

---

## 7. 待处理积压

以下事项虽不一定是“今天新出现”，但值得维护者重点看护。

### 7.1 高风险但尚无 fix 的 correctness / crash 问题
- **Issue #61225** Iceberg 扫描 BE crash  
  链接: apache/doris Issue #61225
- **Issue #61228** 物化视图命中导致结果不一致  
  链接: apache/doris Issue #61228
- **Issue #61219** View ORDER BY 过度列裁剪  
  链接: apache/doris Issue #61219
- **Issue #59546** invalid field 导致 BE 持续崩  
  链接: apache/doris Issue #59546

这些问题的共同点是：**影响查询正确性或服务可用性，但尚未看到明确修复 PR 对应。**

---

### 7.2 长期 stale，但方向重要的湖仓能力缺口
- **Issue #55999** `Optimize Hive, Iceberg, Paimon metadata access performance`  
  链接: apache/doris Issue #55999
- **Issue #56002** `Support Iceberg small file compaction and Snapshot management`  
  链接: apache/doris Issue #56002
- **Issue #56010** `Support Hive 4 transaction table`  
  链接: apache/doris Issue #56010
- **Issue #56011** `Support Doris Catalog`  
  链接: apache/doris Issue #56011

这些虽为 stale，但都直接对应 Doris 下一阶段的竞争力。  
尤其是：
- **元数据访问性能**
- **Iceberg 小文件治理**
- **联邦查询**
它们对大规模 lakehouse 落地非常关键。

---

### 7.3 配置与插件化重构议题长期悬而未决
- **Issue #50238** `refactor the connection properties`  
  链接: apache/doris Issue #50238
- **Issue #56015** `unify data source property names`  
  链接: apache/doris Issue #56015
- **Issue #56016** `File system pluginization`  
  链接: apache/doris Issue #56016
- **Issue #56017** `JDBC Catalog pluginization`  
  链接: apache/doris Issue #56017

这类议题不如 crash bug 紧急，但它们决定了 Doris 外部生态扩展的上限。若 2026 真要强化 AI/Hybrid Search + Lakehouse，建议尽快明确设计和拆解计划。

---

## 8. 总结判断

今天的 Apache Doris 呈现出一个非常鲜明的状态：  
**主线很强，扩展很快，但 correctness 与生态边界稳定性仍需持续加固。**

积极面：
- 搜索、云模式、缓存、spill、外表兼容等方向推进明显
- 多条外部生态修复已回灌多个稳定分支
- 路线图方向统一，社区叙事清晰

风险面：
- Iceberg / Nessie / MV / View 裁剪等问题表明，复杂场景下仍有较多边角 case
- 73 条待合并 PR 也意味着评审与收敛压力不小

**项目健康度评价：良好偏积极。**  
对于一个快速扩张能力边界的分析型数据库项目而言，当前节奏是健康的；接下来如果能优先消化 correctness 与 crash 类问题，Doris 4.x 的生产可信度会进一步提升。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**基于 2026-03-12 社区动态**

---

## 1. 生态全景

过去 24 小时的社区动态显示，OLAP 与分析型存储开源生态整体处于**高活跃、高并行演进**状态：一方面各项目都在持续扩展 **Lakehouse / Iceberg / Parquet / S3 / 对象存储** 能力，另一方面也都在集中修复 **correctness、回归、崩溃、CI 稳定性** 问题。  
一个明显趋势是，头部项目已不再满足于“高性能 OLAP”单点定位，而是在向 **统一分析底座** 演进：兼顾 SQL 分析、湖仓访问、半结构化数据、搜索/向量、云原生和多租户治理。  
从工程节奏看，**ClickHouse、Doris、StarRocks、DuckDB、Iceberg** 仍是最密集演进的核心圈层；**Delta、Arrow、Velox、Gluten、Databend** 则分别在协议层、格式层、执行引擎层或新兴数据库方向持续补位。  
总体判断：**行业创新主线很强，但“复杂生态接入后的正确性与生产稳定性”仍是 2026 年上半年的核心质量战场。**

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 今日重点方向 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 25 | 113 | 无 | 外表/湖仓兼容、缓存/溢写、云模式、搜索能力 | **良好偏积极** |
| **ClickHouse** | 39 | 210 | 无 | 性能回归、S3/Iceberg、Mutation/UDF、分布式能力 | **高活跃，需关注 26.2 回归** |
| **DuckDB** | 16 | 64 | 无 | 1.5.x 回归修复、CLI/Windows、Parquet/VARIANT、优化器 | **活跃且可控** |
| **StarRocks** | 14 | 129 | 无 | 查询正确性、MV/Iceberg、shared-data/compaction | **工程健康度较高** |
| **Apache Iceberg** | 10 | 43 | 无 | V4 Manifest、Spark/Flink/Connect、云存储 I/O | **活跃，生产稳定性待加强** |
| **Delta Lake** | 1 | 33 | 无 | Kernel/DSv2、Unity Catalog、统计与协议对齐 | **良好，主线清晰** |
| **Databend** | 9 | 15 | 无 | SQL 兼容性、JOIN 正确性、Planner/Shuffle 重构 | **健康度偏积极** |
| **Velox** | 25 | 50 | 无 | 写入链路、Iceberg connector、GPU、runtime metrics | **中上，偏稳定性收敛** |
| **Apache Gluten** | 5 | 27 | 无 | Spark 4.x 恢复、Velox 对齐、TLP 毕业改造 | **积极，但依赖上游节奏** |
| **Apache Arrow** | 25 | 25 | 无 | Parquet 安全修复、Flight SQL/ODBC、CI/打包 | **稳健** |

### 活跃度观察
- **最高活跃梯队**：ClickHouse、StarRocks、Doris  
- **高活跃梯队**：DuckDB、Iceberg、Velox、Arrow  
- **中等活跃但主线清晰**：Delta Lake、Gluten、Databend  
- **无项目发布新版本**，说明当天更偏向**主干开发、回归修复、分支回灌**而非版本交付日。

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势
与同类项目相比，Apache Doris 当前最鲜明的优势在于：

1. **统一分析面扩张快**  
   Doris 不再只强调 MPP OLAP，而是明显向 **Lakehouse + 搜索/Hybrid Search + 云模式 + 外部 Catalog** 扩展。  
   当天的 `MATCH` 投影、Paimon/OBS 修复、file cache、spill、多级分区、cloud metrics 都说明其边界在持续外扩。

2. **外部生态接入密度高**  
   Doris 当天同时涉及 **Iceberg、Paimon、Nessie、Hive、ES、OBS/PFS**。  
   这使其在“数据库 + 湖仓查询层”定位上，比传统数仓型项目更积极。

3. **多分支维护积极**  
   多条 Paimon/兼容性修复被回灌到 3.1 / 4.0 / 4.1，说明其商业/生产用户覆盖面较广，且社区愿意维护稳定分支质量。

### 3.2 Doris 的短板与风险
相较于 ClickHouse、StarRocks，Doris 当前更明显的问题是：

- **复杂场景 correctness 风险暴露较多**  
  包括 Iceberg 扫描 BE crash、MV 命中结果不一致、View + ORDER BY 列裁剪错误。  
- **PR 积压压力较大**  
  113 条 PR 更新中有 73 条待合并，意味着主线推进快，但评审与质量收敛压力也高。  
- **湖仓生态广，但边界稳定性仍需巩固**  
  “能接入”正在向“可生产稳定查询”过渡，这是 Doris 当前最核心的工程挑战。

### 3.3 与同类项目的技术路线差异

| 对比项目 | Doris 相对定位 |
|---|---|
| **ClickHouse** | Doris 更强调统一分析平台与湖仓/搜索扩展；ClickHouse 更强于底层执行与分布式写入/缓存/多租户细节打磨 |
| **StarRocks** | 两者都在抢 Lakehouse + MPP 统一分析层；Doris 更突出搜索/Hybrid Search 叙事，StarRocks 更突出 MV / shared-data / Iceberg v3 深兼容 |
| **DuckDB** | Doris 面向服务端、分布式 OLAP；DuckDB 面向嵌入式/本地分析与数据工程工作台 |
| **Databend** | 两者都在推进云与现代 SQL，但 Doris 社区规模、生态对接、PR 活跃度明显更大 |
| **Delta / Iceberg** | Doris 不是表格式项目，而是消费与加速这些格式的查询引擎/数据库层 |
| **Velox / Arrow / Gluten** | Doris 是终端数据库产品；后者更多是执行引擎、格式层或 Spark 加速底座 |

### 3.4 社区规模对比
按今日数据，Doris 处于**第一梯队活跃项目**，但仍低于 ClickHouse，接近 StarRocks：

- ClickHouse：39 Issues / 210 PR  
- StarRocks：14 Issues / 129 PR  
- **Doris：25 Issues / 113 PR**  
- DuckDB：16 / 64  
- Iceberg：10 / 43  

**结论**：Doris 已是 OLAP 开源生态中的头部项目之一，社区规模和开发密度具备较强竞争力。

---

## 4. 共同关注的技术方向

下面是多项目共同涌现的核心需求与方向。

### 4.1 Lakehouse / Iceberg / 外部表兼容与生产化
**涉及项目**：Doris、ClickHouse、StarRocks、Iceberg、Velox、Gluten、Delta  
**具体诉求**：
- Doris：Iceberg crash、Nessie catalog 查询失败、Paimon/OBS 修复
- ClickHouse：Iceberg external paths、Iceberg query_log 指标修复
- StarRocks：Iceberg v3、MV rewrite 与分区删除一致性
- Iceberg：V4 Manifest、Connect/Flink/Spark、云存储连接池
- Velox：Iceberg connector positional update
- Gluten：Parquet/Variant/Data Lake 写入语义补齐
- Delta：Kernel/DSv2 语义对齐

**共同信号**：  
Lakehouse 已从“连接能力”进入“生产稳定性、元数据语义、可观测性、写后可读正确性”的深水区。

---

### 4.2 查询正确性优先级显著上升
**涉及项目**：Doris、StarRocks、DuckDB、Databend、Velox、ClickHouse  
**具体诉求**：
- Doris：MV 命中错误、View 列裁剪错误
- StarRocks：Invalid plan、MV rewrite 读陈旧分区、查询丢行
- DuckDB：INTERNAL Error、CTAS 崩溃、优化器回归
- Databend：JOIN 空 build side 投影错误、TRY_ 函数语义修复
- Velox：TableWriteMerge mixed batch 风险、TIME/时区语义
- ClickHouse：写入去重 token、Mutation 依赖列修复

**共同信号**：  
OLAP 引擎竞争已不只是拼速度，而是拼**复杂 SQL / MV / 子查询 / join / schema evolution 场景下的结果可信度**。

---

### 4.3 云对象存储与缓存/连接管理
**涉及项目**：Doris、ClickHouse、Iceberg、StarRocks、Arrow  
**具体诉求**：
- Doris：file cache admission / 2Q-LRU / 分场景缓存控制
- ClickHouse：filesystem cache 预热、S3 function 日志误报
- Iceberg：S3/GCS 连接池、timeout、TCP 连接爆炸
- StarRocks：S3 VIP 命中同一后端、对象存储 LIST 开销
- Arrow：打包、分发与 Parquet 读写稳定性

**共同信号**：  
对象存储时代的核心问题已从“能读写”升级为“缓存命中策略、连接生命周期、成本、日志可观测性与长期稳定性”。

---

### 4.4 半结构化数据 / Variant / JSON
**涉及项目**：DuckDB、Iceberg、Delta、Gluten、ClickHouse  
**具体诉求**：
- DuckDB：JSON 过滤、VARIANT 与 Parquet 导出/存储版本兼容
- Iceberg：Variant 支持向 Spark/Flink/Connect 扩展
- Delta：Kernel 表达式语义补齐
- Gluten：Variant test suites、Parquet variant shredding
- ClickHouse：Dynamic/JSON 升级兼容性

**共同信号**：  
半结构化分析已成为主流需求，不再是附属能力。行业正在争夺“结构化 + 半结构化统一查询”的体验。

---

### 4.5 云原生、多租户、治理与可观测性
**涉及项目**：Doris、ClickHouse、Delta、Velox、StarRocks  
**具体诉求**：
- Doris：cloud mode、decouple_instance、云指标
- ClickHouse：DATABASE NAMESPACE、多租户隔离、Redis 分布式结果缓存
- Delta：Unity Catalog、CatalogOwned 边界、UC staged replace
- Velox：runtime metrics、blockedWaitFor、GPU 统计
- StarRocks：shared-data 检查、mock journal、WAL 重构

**共同信号**：  
分析引擎正加速走向**平台化、托管化、可治理化**，而不是单机/单租户数据库心智。

---

## 5. 差异化定位分析

### 5.1 存储格式与生态侧重点

| 项目 | 核心侧重 |
|---|---|
| **Doris / StarRocks / ClickHouse / Databend** | 自身是数据库/查询引擎，同时积极接入 Iceberg/Hive/Paimon/ES 等外部生态 |
| **DuckDB** | 强本地文件与嵌入式分析，Parquet/CSV/Arrow 是天然核心入口 |
| **Iceberg / Delta Lake** | 表格式/事务元数据层，不是查询引擎本体 |
| **Arrow** | 列式内存格式、Parquet/Flight/多语言互操作基础设施 |
| **Velox / Gluten** | 执行引擎与 Spark 加速层，承载查询执行而非自成完整数据库 |

---

### 5.2 查询引擎设计差异

| 类型 | 代表项目 | 特征 |
|---|---|---|
| **MPP OLAP 数据库** | Doris、StarRocks、ClickHouse、Databend | 面向服务端分析、集群部署、低延迟交互查询 |
| **嵌入式单机分析引擎** | DuckDB | 本地分析、Python/R/Notebook/应用嵌入 |
| **表格式/湖仓协议层** | Iceberg、Delta Lake | 关注元数据、事务、schema evolution、引擎互操作 |
| **执行引擎底座** | Velox、Gluten | 聚焦 operator、runtime、Spark/Presto 加速 |
| **格式/传输基础设施** | Arrow | 关注列式格式、Parquet、Flight RPC、多语言桥接 |

---

### 5.3 目标负载类型差异

| 项目 | 典型负载 |
|---|---|
| **Doris** | 实时数仓、统一分析、湖仓联查、搜索/混合检索扩展 |
| **ClickHouse** | 大规模日志/时序/高吞吐写入分析、云多租户集群 |
| **StarRocks** | 实时 OLAP + MV 加速 + shared-data / Lakehouse 加速 |
| **DuckDB** | 数据科学、ETL、中小规模本地分析、嵌入式工作负载 |
| **Databend** | 云原生数仓、现代 SQL、分布式分析 |
| **Iceberg / Delta** | 表管理、流批一体存储层、元数据治理 |
| **Velox / Gluten** | Spark/Presto 执行加速、GPU/列式执行 |
| **Arrow** | 格式互操作、驱动、数据交换、内存计算 |

---

### 5.4 SQL 兼容性差异
- **ClickHouse**：在分析能力、分布式控制、多租户方面深入，但 SQL 方言仍带有自身风格。  
- **Doris / StarRocks**：明显在向更广泛 BI/数据仓库 SQL 兼容靠拢。  
- **DuckDB**：快速补齐 SQL 方言与易用性，尤其适合本地数据工程体验。  
- **Delta / Iceberg**：不主打 SQL 方言，而是通过 Spark/Flink/Connect 等上层引擎承载 SQL。  
- **Databend**：明显在补主流数据库兼容语义细节。  
- **Gluten / Velox**：SQL 兼容性更多体现在对 Spark/Presto 语义的执行层对齐。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：高强度主干迭代
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特点：  
PR/Issue 密集、功能与修复并行推进、稳定分支回灌活跃、社区反馈快。

#### 第二层：高活跃但更聚焦特定主线
- **DuckDB**
- **Apache Iceberg**
- **Velox**
- **Apache Arrow**

特点：  
技术深度强，问题集中在核心子系统：存储兼容、格式、安全性、执行器、连接器。

#### 第三层：中活跃、方向清晰
- **Delta Lake**
- **Apache Gluten**
- **Databend**

特点：  
主线相对集中，更多是围绕既定路线做补齐与质量收敛。

---

### 6.2 快速迭代阶段 vs 质量巩固阶段

#### 处于快速迭代阶段
- **Doris**：搜索、Lakehouse、云模式、缓存、spill 同时推进
- **ClickHouse**：分布式结果缓存、多租户、Iceberg、Distributed 写入增强
- **StarRocks**：Iceberg v3、shared-data、MV rewrite、compaction 模型
- **DuckDB**：Trigger、SQL 语法扩展、C++17、VARIANT/Parquet 持续演进
- **Iceberg**：V4 Manifest、Variant、多引擎扩张

#### 处于质量巩固阶段
- **Arrow**：Parquet 安全修复、Flight SQL/ODBC 产品化
- **Velox**：flaky test、memory arbitration、write path correctness
- **Gluten**：Spark 4.x suite 恢复、TLP 毕业收尾、依赖升级
- **Delta Lake**：Kernel/DSv2 语义补齐、UC 边界收紧
- **Databend**：SQL 兼容性和执行器 correctness 收敛

---

## 7. 值得关注的趋势信号

### 7.1 “统一分析平台”成为主流叙事
Doris、StarRocks、ClickHouse 都在从单一 OLAP 引擎向更广义的统一分析平台升级：  
- 联查湖仓
- 接入对象存储
- 管理多租户/云环境
- 支持半结构化甚至搜索/向量能力

**对架构师的意义**：  
新一代分析平台选型，不应只比较 SQL 性能，还要比较 **生态兼容、缓存策略、治理、外部元数据连接能力**。

---

### 7.2 Iceberg / Delta 不再只是“格式选择”，而是生态中心
今天几乎所有数据库或执行引擎项目都在和 Iceberg/Delta 发生耦合。  
问题焦点也从“能不能读”转向：
- 元数据性能
- 分区删除与 MV 一致性
- 连接池和对象存储行为
- schema evolution / Variant / row lineage

**对数据工程师的意义**：  
选表格式不能只看协议规范，还要看目标引擎对其**生产级语义支持深度**。

---

### 7.3 正确性已压过单纯性能，成为用户最敏感信号
多个项目当天最重要的问题都不是“慢”，而是：
- 结果错误
- 命中错误 MV
- 读到陈旧分区
- join 输出错位
- INTERNAL Error
- 数据跨表污染

**对技术决策者的意义**：  
生产选型与升级策略应把 **correctness regression 测试、回归基线、灰度验证** 提到比“跑分提升”更高优先级。

---

### 7.4 对象存储时代，缓存与连接管理是核心能力
S3/GCS/OBS/PFS/Filesystem cache 几乎出现在所有主流项目中。  
关注点包括：
- admission control
- 热点保护
- timeout 与连接池
- cache warming
- 误报日志与观测指标

**对平台团队的意义**：  
云上分析平台的瓶颈，越来越多来自**远程 I/O 策略**而不是纯本地算子性能。

---

### 7.5 半结构化与 Variant 正在成为下一轮基础能力分水岭
DuckDB、Iceberg、Gluten、ClickHouse 都出现了 JSON/VARIANT/动态类型相关问题和增强。  
这意味着未来分析引擎竞争不仅看结构化 SQL，也看：
- JSON / Variant 类型是否稳定
- 能否与 Parquet / Iceberg 正确对接
- 优化器是否能在半结构化查询上继续工作

**对数据工程师的意义**：  
如果业务中半结构化数据占比持续升高，需重点评估引擎在 **类型系统一致性、导出链路、过滤/下推/索引支持** 上的成熟度。

---

## 结论

从 2026-03-12 的横向动态看，OLAP / 分析型存储开源生态已经进入一个新的竞争阶段：  
**比拼的不再只是单点查询性能，而是“统一分析能力 + 湖仓生态兼容 + 云原生工程质量 + correctness”四维综合能力。**

### 对 Apache Doris 的结论
Doris 已经处于生态头部梯队，且路线最鲜明的特征是：  
**从 MPP OLAP 向 Lakehouse + 搜索/Hybrid Search + 云模式统一分析平台演进。**  
它的优势是扩展快、生态接入广、社区活跃；当前最大挑战是复杂场景下的**correctness 与稳定性收敛**。

### 对选型者的建议
- 若看重**统一分析入口、湖仓联查、外表生态与平台扩展**：重点关注 Doris、StarRocks。  
- 若看重**极致执行性能、分布式能力、多租户云化**：重点关注 ClickHouse。  
- 若看重**本地分析、嵌入式、开发者体验**：DuckDB 依旧最强。  
- 若看重**湖仓协议与跨引擎中立层**：Iceberg / Delta 是关键基础设施。  
- 若看重**执行加速底座或 Spark/Presto 引擎演进**：Velox / Gluten / Arrow 值得持续跟踪。

如果你愿意，我可以继续把这份报告再整理成两种版本：  
1. **管理层一页版摘要**  
2. **研发/架构评审版表格清单（含风险优先级）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-12）

## 1. 今日速览

过去 24 小时 ClickHouse 维持了**很高的开发与社区活跃度**：Issues 更新 39 条、PR 更新 210 条，但**无新版本发布**。  
从议题结构看，今天的重点明显集中在三类：**性能回归与执行器行为**、**湖仓/S3/Iceberg 外表读取稳定性**、以及**CI/fuzz 驱动的稳定性修复**。  
PR 面上则呈现出“**并行推进**”特征：一边有面向用户的新特性（分布式结果缓存、多租户 namespace、Distributed 写入策略），另一边大量修复聚焦在**Mutation、UDF、去重、日志统计、Keeper/Raft**等细节可靠性。  
整体健康度判断：**活跃度高、修复节奏快，但 26.2 附近出现了需要重点关注的性能回归与若干边界稳定性问题**。

---

## 3. 项目进展

> 注：给定数据未显式列出“今日已合并 PR 明细”，以下主要基于今日更新最值得关注的 PR，分析其对查询引擎、存储层和 SQL 兼容性的推进意义。

### 3.1 分布式与多租户能力继续增强

- **PR #99264 — Allow skipping last N shards when writing to Distributed table**  
  链接：ClickHouse/ClickHouse PR #99264  
  该 PR 为 Distributed 表写入路径增加“跳过最后 N 个分片”的能力，属于**分布式写入策略增强**。这类能力常见于灰度扩容、冷热分层、灾备演练或多 AZ 渐进接入场景，说明 ClickHouse 正在继续增强其在**复杂集群拓扑下的写入控制能力**。

- **PR #98477 — Add DATABASE NAMESPACE clause for multi-tenant database isolation**  
  链接：ClickHouse/ClickHouse PR #98477  
  这是一个非常明确的**多租户路线信号**。通过 `CREATE USER` / `ALTER USER` 支持 `DATABASE NAMESPACE`，ClickHouse 正在向“**逻辑隔离更强、租户感知更明确**”的方向演进，对云上托管、平台型数据服务和共享集群运营都很关键。

### 3.2 查询缓存、分析器和优化器方向有持续投入

- **PR #98856 — Add distributed Redis-backed query result cache with stampede protection**  
  链接：ClickHouse/ClickHouse PR #98856  
  这是今天最值得关注的新特性之一。相比本地缓存，外部 Redis 支撑的分布式查询结果缓存意味着：  
  1) 缓存可跨节点共享；  
  2) 更适合无状态/弹性计算部署；  
  3) `stampede protection` 说明已考虑缓存击穿下的并发放大问题。  
  这体现出 ClickHouse 正在补齐**云原生查询加速层**能力。

- **PR #88043 — Optimize Analyzer with repeat aliases**  
  链接：ClickHouse/ClickHouse PR #88043  
  面向 Analyzer 的性能优化。重复 alias 在复杂 BI SQL、自动生成 SQL、嵌套表达式场景非常常见，这个 PR 表明团队仍在持续打磨**新分析器链路的编译/规划成本**。

### 3.3 湖仓与外表生态继续完善

- **PR #90740 — Iceberg: support external paths in tables**  
  链接：ClickHouse/ClickHouse PR #90740  
  允许 Iceberg 表中的文件位于表 location 之外，甚至在不同存储上。这是一个非常实用的改进，说明 ClickHouse 在湖仓接入上正在从“理想布局假设”走向“**真实生产数据布局兼容**”。

- **PR #99282 — fix system.query_log.read_rows showing 0 rows read for Iceberg**  
  链接：ClickHouse/ClickHouse PR #99282  
  该修复虽小，但很关键：日志观测数据错误会直接影响运维判断、成本评估和性能排障。它说明 Iceberg 支持已从“能读”进一步走向“**可观测、可运营**”。

### 3.4 写入正确性、Mutation 与 UDF 兼容性修复推进

- **PR #99206 — Fix `insert_deduplication_token` being ignored for INSERT SELECT without `ORDER BY ALL`**  
  链接：ClickHouse/ClickHouse PR #99206  
  这是典型的**写入幂等/去重正确性修复**。对于 CDC、重试写入、任务调度器重放场景非常重要，能降低重复数据风险。

- **PR #99281 — Fix mutation failure when MATERIALIZED column depends on EPHEMERAL column**  
  链接：ClickHouse/ClickHouse PR #99281  
  修复 `ALTER TABLE UPDATE/DELETE` 在特殊列依赖结构下失败的问题，属于**Mutation 正确性增强**，对使用新列语义的用户很关键。

- **PR #99232 — Change default stderr_reaction to log_last for executable UDFs**  
  链接：ClickHouse/ClickHouse PR #99232  
  这是一次明显的**兼容性友好修复**：很多 Python/NumPy 风格 UDF 会向 stderr 输出 warning，但进程并未失败。默认从 `throw` 调整为 `log_last`，可减少“误判失败”，提升外部可执行 UDF 的实用性。

### 3.5 Keeper / Raft 与测试稳定性仍在持续补强

- **PR #99133 — fix nuraft segfault**  
  链接：ClickHouse/ClickHouse PR #99133  
  Keeper / Raft 相关段错误修复，属于**基础设施级稳定性问题**。若修复进入稳定分支，将直接改善集群协调层可靠性。

- **PR #99012 — Fix flaky test 02440_mutations_finalization under TSan parallel**  
  链接：ClickHouse/ClickHouse PR #99012  
- **PR #99304 — remove flakiness of 03914_jemalloc_cache_arena_mark_cache**  
  链接：ClickHouse/ClickHouse PR #99304  
  这类 PR 不直接改变用户功能，但它们是项目工程健康度的重要体现：**测试不稳定正在被系统性治理**。

---

## 4. 社区热点

### 4.1 低负载 CPU 占用问题长期引发关注
- **Issue #60016 — Clickhouse server consumes a little of CPU with zero load**  
  链接：ClickHouse/ClickHouse Issue #60016  
  状态：已关闭  
  评论数：25

这是今天评论最多的 Issue。问题核心不是“CPU 很高”，而是**在近似空闲情况下仍有持续 CPU 消耗**，尤其发生在低规格测试机（1 vCPU / 1-2 GB RAM）上。  
背后的技术诉求是：用户希望 ClickHouse 在轻载/开发/边缘部署场景中也具备**更低后台噪声与更稳定的 idle 资源占用**。这类问题虽不一定阻塞核心功能，但会显著影响用户对“轻量化可用性”的感知。

### 4.2 文件系统缓存增量预热需求很明确
- **Issue #98004 — Filesystem cache discards fully-downloaded segments when a query fails or times out**  
  链接：ClickHouse/ClickHouse Issue #98004  
  状态：已关闭  
  评论数：11

该问题直指 S3/对象存储读取的核心体验：若首次大范围扫描因超时失败，已经下载完成的缓存段被丢弃，导致**无法形成渐进式 cache warming**。  
这背后反映的是对象存储时代用户对 ClickHouse 的诉求已从“能查”转向“**冷数据查询如何更平滑地热起来**”。

### 4.3 LowCardinality 与索引粒度的建模讨论
- **Issue #98968 — LowCardinality vs index_granularity**  
  链接：ClickHouse/ClickHouse Issue #98968  
  状态：开放  
  评论数：11

这是偏“建模与存储布局”的高质量讨论。用户在主键查找表中使用 `Array(LowCardinality(String))`，关心其与 `index_granularity` 的关系。  
这类讨论说明：成熟用户已经进入**微观存储布局调优阶段**，希望清楚知道编码、mark 粒度、读取放大之间的真实交互。

### 4.4 窗口函数并行执行的收益与副作用
- **Issue #97284 — Window function parallel evaluation can be a problem sometimes**  
  链接：ClickHouse/ClickHouse Issue #97284  
  状态：开放  
  评论数：9

窗口函数并行化本是性能增强，但用户反馈在某些情况下会带来问题。这说明 ClickHouse 的执行器优化正在进入“**并行化默认策略是否始终合适**”的新阶段。  
技术诉求是：需要更细粒度的**代价模型、启发式开关或可预测行为**。

### 4.5 26.2 插入性能回归是今日最强烈风险信号
- **Issue #99241 — INSERT queries are 3x slower after upgrading from 25.12 to 26.2**  
  链接：ClickHouse/ClickHouse Issue #99241  
  状态：开放  
  评论数：8

用户报告在 ReplacingMergeTree 上，同样的 INSERT 从 25.12 升级到 26.2 后慢了 3 倍。  
这是今天最值得持续跟踪的生产风险议题之一，因为它具备典型特征：  
- 明确版本回归；  
- 影响写入路径；  
- 放大到生产后可能直接影响吞吐和成本。  

### 4.6 JSON 升级兼容性问题已获关闭
- **Issue #98821 — JSON data became unavailable after upgrading from 24.8 to 25.8**  
  链接：ClickHouse/ClickHouse Issue #98821  
  状态：已关闭  
  评论数：8

虽然已关闭，但它释放的信号很重要：**JSON / Dynamic 类型在版本升级中的兼容性仍是敏感区**。这也与今日 PR #96504（扩展 `cast_keep_nullable` 到 Dynamic/JSON）形成呼应。

---

## 5. Bug 与稳定性

以下按严重程度与潜在影响排序：

### P1：明确版本性能回归 / 生产风险

1. **Issue #99241 — 26.2 INSERT 变慢 3 倍**  
   链接：ClickHouse/ClickHouse Issue #99241  
   标签：`performance, v26.2-affected`  
   影响：直接影响写入吞吐，且是版本升级后出现。  
   是否已有 fix PR：**当前数据中未见直接对应 fix PR**。  
   建议关注：这是今天最应被维护者快速 triage 的问题。

2. **Issue #99236 — 单个查询中压缩数据被重复解压**  
   链接：ClickHouse/ClickHouse Issue #99236  
   标签：`unexpected behaviour`  
   影响：可能带来 CPU 放大和读取性能异常。  
   是否已有 fix PR：**未见直接关联 PR**。  
   该问题与 #98968、PR #99285 一起看，说明 **LowCardinality / 字典 / 解压复用** 路径值得重点排查。

3. **Issue #97284 — 窗口函数并行执行可能带来问题**  
   链接：ClickHouse/ClickHouse Issue #97284  
   标签：`performance`  
   影响：分析查询稳定性与资源使用不可预测。  
   是否已有 fix PR：**未见直接 fix PR**。

### P1：崩溃 / 协调层稳定性

4. **PR #99133 — fix nuraft segfault**  
   链接：ClickHouse/ClickHouse PR #99133  
   性质：Keeper/Raft 相关段错误修复。  
   影响：协调层问题通常影响集群级可用性。  
   状态：开放，值得优先合入。

5. **Issue #98949 — [CI crash] Double free or corruption in MergeTreeDataPartCompact**  
   链接：ClickHouse/ClickHouse Issue #98949  
   标签：`crash-ci`  
   影响：虽来自 CI，但若是真实内存破坏路径，潜在严重性高。  
   是否已有 fix PR：**未见明确对应 PR**。

### P2：外表 / 湖仓 / 对象存储稳定性

6. **Issue #99140 — S3 Function 正常读取时仍产生 Bad Request 错误日志**  
   链接：ClickHouse/ClickHouse Issue #99140  
   影响：功能未必失败，但会污染日志、干扰运维告警。  
   受影响版本：25.6.x, 25.8.x  
   是否已有 fix PR：**未见直接 fix PR**。

7. **Issue #88126 — Iceberg 在 ORC 文件上走到 Parquet reader 并崩溃**  
   链接：ClickHouse/ClickHouse Issue #88126  
   状态：已关闭  
   影响：湖仓格式识别/路由错误属于高风险缺陷。  
   补充：与今天 Iceberg 相关 PR 活跃，说明该方向仍在快速修正中。

8. **PR #99282 — 修复 Iceberg `system.query_log.read_rows` 统计为 0**  
   链接：ClickHouse/ClickHouse PR #99282  
   影响：属于观测正确性问题，对排障和审计有影响。

### P2：写入与 Mutation 正确性

9. **PR #99206 — 修复 `insert_deduplication_token` 在部分 INSERT SELECT 场景被忽略**  
   链接：ClickHouse/ClickHouse PR #99206  
   影响：重试写入下可能产生重复数据。  
   状态：已有修复 PR。

10. **PR #99281 — 修复 MATERIALIZED 依赖 EPHEMERAL 时 Mutation 失败**  
    链接：ClickHouse/ClickHouse PR #99281  
    影响：`ALTER TABLE UPDATE/DELETE` 失败，影响 DML 可用性。  
    状态：已有修复 PR。

11. **Issue #44070 — DDLWorker 在离线副本回放 `CREATE TABLE` + `ALTER` 时失败**  
    链接：ClickHouse/ClickHouse Issue #44070  
    影响：分布式 DDL 和副本恢复路径存在一致性风险。  
    状态：长期开放，尚未解决。

### P3：CI / fuzz / 测试稳定性

12. **Issue #99258 — ReadBuffer is canceled**  
    链接：ClickHouse/ClickHouse Issue #99258  
13. **Issue #96588 — Unexpected size of tuple element**  
    链接：ClickHouse/ClickHouse Issue #96588  
14. **Issue #99194 / #99261 / #99037 — 多个 fuzz crash / segfault**  
    链接：ClickHouse/ClickHouse Issue #99194  
    链接：ClickHouse/ClickHouse Issue #99261  
    链接：ClickHouse/ClickHouse Issue #99037  

这些问题更多属于**质量门禁信号**。虽然未必直接对应用户侧故障，但表明系统在复杂输入和极端并发下仍有边界问题。

---

## 6. 功能请求与路线图信号

### 6.1 高概率进入后续版本的方向

1. **分布式查询结果缓存（Redis 后端）**  
   - PR #98856  
   - 链接：ClickHouse/ClickHouse PR #98856  
   路线图信号非常强。这类特性对云化部署和高并发 BI 查询价值大，且设计中已包含 stampede protection，成熟度较高。

2. **多租户 namespace 隔离**  
   - PR #98477  
   - 链接：ClickHouse/ClickHouse PR #98477  
   这是平台化能力的关键一步，若推进顺利，很可能成为后续版本的重要卖点。

3. **Iceberg 外部路径支持**  
   - PR #90740  
   - 链接：ClickHouse/ClickHouse PR #90740  
   直接提升湖仓兼容性，符合当前生态趋势，进入后续版本概率高。

### 6.2 来自 Issue 的新需求信号

4. **Native protocol 支持客户端可设置 `session_id`**  
   - Issue #99040  
   - 链接：ClickHouse/ClickHouse Issue #99040  
   用户场景是代理前置、连接不稳定、会话与 TCP 连接解绑。这是非常典型的**云代理 / 网关化接入需求**，技术上合理，值得关注。

5. **浮点文本输出精度可配置**  
   - Issue #99199  
   - 链接：ClickHouse/ClickHouse Issue #99199  
   希望新增 `output_format_float_precision`。这类需求不算核心引擎能力，但对导出、报表、人读格式和下游兼容很实用，且标记为 `easy task`，**落地概率不低**。

6. **Kafka 4 新 consumer group rebalance 协议支持**  
   - Issue #88482  
   - 链接：ClickHouse/ClickHouse Issue #88482  
   依赖 `librdkafka` 升级，属于连接器生态的现实需求。随着 Kafka 4 落地，该问题的重要性会继续上升。

7. **Projection Index 读取前先缩小 marks 范围**  
   - Issue #99114  
   - 链接：ClickHouse/ClickHouse Issue #99114  
   这是明显的**读取路径优化诉求**，说明高级用户已经开始关注 projection 选择之后的 mark 粒度二次裁剪。

8. **向量索引在 alias + WHERE 条件下可用**  
   - Issue #96647  
   - 链接：ClickHouse/ClickHouse Issue #96647  
   向量检索功能仍在打磨 SQL planner/optimizer 的适配。该问题反映出用户希望向量 ANN 使用方式更接近标准 SQL 书写习惯。

---

## 7. 用户反馈摘要

### 7.1 升级后的性能与兼容性是首要焦虑
用户最敏感的仍是**版本升级后行为变化**：  
- 26.2 INSERT 回归（#99241）  
- JSON 列升级后不可访问（#98821，已关闭）  
这说明 ClickHouse 在快速迭代中，用户对“**升级可预测性**”仍然高度关注。

### 7.2 对对象存储 / 湖仓访问的预期已明显提升
从 filesystem cache、S3 function、Iceberg query_log、Iceberg 格式错误等议题可见，用户已不满足于“能从 S3/Iceberg 读数据”，而是要求：  
- 缓存能渐进预热  
- 日志不要误报  
- 指标统计准确  
- 格式识别稳定  
这代表 ClickHouse 正从“外部存储接入”走向“**生产级数据湖运维体验**”。

### 7.3 复杂表结构与新类型能力被真实使用中
Dynamic/JSON、EPHEMERAL、MATERIALIZED、LowCardinality 大字典、向量索引等都出现在活跃问题中，说明用户已在大规模使用这些高级能力。  
这是一种积极信号：**新功能不是停留在演示，而是真进入生产试验场**；但也意味着边界兼容与解释性文档需要继续补足。

### 7.4 运维视角下“正确日志、正确统计、低背景噪声”越来越重要
低负载 CPU、S3 正常读时打 Bad Request、Iceberg `read_rows=0` 这些问题共同指向：  
用户不只关心“查对了”，还关心“**系统看起来是否健康、指标是否可信**”。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期开放项：

1. **Issue #44070 — DDLWorker 在离线副本回放 DDL 时 `INCOMPATIBLE_COLUMNS`**  
   链接：ClickHouse/ClickHouse Issue #44070  
   创建于 2022-12-09，至今仍开放。  
   这是典型的**分布式 DDL + 副本恢复一致性**问题，生产影响面大，建议提升优先级。

2. **PR #48941 — Simplified partition mutations**  
   链接：ClickHouse/ClickHouse PR #48941  
   创建于 2023-04-19，长期开放。  
   Mutation 体系是 MergeTree 维护成本和用户体验的核心之一，这个长期 PR 若能推进，将对表维护语义带来实质收益。

3. **Issue #68032 — PostgreSQL 复制到 ClickHouse 时 Decimal value is too big**  
   链接：ClickHouse/ClickHouse Issue #68032  
   创建于 2024-08-08，标记为 `help wanted`, `unfinished code`, `experimental feature`。  
   说明 PostgreSQL 复制链路在数值类型映射上仍不稳，影响异构同步场景。

4. **Issue #88482 — librdkafka 升级以支持 Kafka 4 协议**  
   链接：ClickHouse/ClickHouse Issue #88482  
   创建于 2025-10-13。  
   虽评论不多，但属于生态兼容型积压，未来重要性会逐步上升。

5. **PR #90740 — Iceberg support external paths**  
   链接：ClickHouse/ClickHouse PR #90740  
   虽仍在推进，但对湖仓用户价值很高，建议持续加速评审。

---

## 附：今日重点链接清单

- Issue #99241 — INSERT queries are 3x slower after upgrading from 25.12 to 26.2  
  链接：ClickHouse/ClickHouse Issue #99241
- Issue #99236 — Compressed data is decompressed repeatedly for a single query  
  链接：ClickHouse/ClickHouse Issue #99236
- Issue #97284 — Window function parallel evaluation can be a problem sometimes  
  链接：ClickHouse/ClickHouse Issue #97284
- Issue #98968 — LowCardinality vs index_granularity  
  链接：ClickHouse/ClickHouse Issue #98968
- Issue #98004 — Filesystem cache discards fully-downloaded segments when a query fails or times out  
  链接：ClickHouse/ClickHouse Issue #98004
- Issue #60016 — Clickhouse server consumes a little of CPU with zero load  
  链接：ClickHouse/ClickHouse Issue #60016
- PR #98856 — Redis-backed distributed query result cache  
  链接：ClickHouse/ClickHouse PR #98856
- PR #98477 — DATABASE NAMESPACE for multi-tenant isolation  
  链接：ClickHouse/ClickHouse PR #98477
- PR #99264 — Skip last N shards when writing to Distributed table  
  链接：ClickHouse/ClickHouse PR #99264
- PR #99133 — fix nuraft segfault  
  链接：ClickHouse/ClickHouse PR #99133
- PR #99206 — fix insert_deduplication_token handling  
  链接：ClickHouse/ClickHouse PR #99206
- PR #99281 — fix mutation with MATERIALIZED depends on EPHEMERAL  
  链接：ClickHouse/ClickHouse PR #99281
- PR #99282 — fix Iceberg query_log read_rows metrics  
  链接：ClickHouse/ClickHouse PR #99282
- PR #90740 — Iceberg external paths support  
  链接：ClickHouse/ClickHouse PR #90740

---

如果你愿意，我可以进一步把这份日报转换成：
1. **面向管理层的一页摘要版**，或  
2. **面向研发/DBA 的风险跟踪版（含优先级表格）**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 — 2026-03-12

## 1. 今日速览

过去 24 小时 DuckDB 社区保持高活跃：Issues 更新 16 条、PR 更新 64 条，说明 1.5.x 发布后的缺陷收敛、回归修复和主干演进正在同步推进。  
从问题分布看，今日重点集中在 **1.5.0 回归、CLI/Windows 兼容性、Parquet/VARIANT、优化器回归** 以及少量 **内部错误（INTERNAL Error）**。  
PR 侧既有快速止血类修复，也有中长期演进信号，例如 **C++17 升级、CREATE TRIGGER 语法解析、FROM 子句 alias 语法扩展**。  
整体健康度评估为 **活跃且可控**：高频问题持续被复现、关闭并关联修复，但 1.5.x 仍暴露出若干正确性与稳定性边缘问题，建议维护者优先压实回归测试。  

---

## 3. 项目进展

> 注：今日无新 Release。

### 已关闭 / 已推进的重要 PR 与对应技术影响

#### 1) 修复 ART 存储转换中的内存错误，直指崩溃类问题
- PR: #21270 `[CLOSED] [Ready To Merge] [Fix] Memory error when transforming to v1.0.0 ART storage`
- 链接: duckdb/duckdb PR #21270
- 关联 Issue: #21254, #21246

这是今天最关键的稳定性修复之一。根据 PR 摘要，它同时针对：
- `INSERT OR IGNORE ... read_parquet()` 导致的 `SIGTRAP` 崩溃（#21254）
- `CREATE TABLE AS SELECT` 的内存破坏/`free(): corrupted unsorted chunks`（#21246）

这说明问题根因很可能落在 **存储层/索引结构（ART）兼容转换或写入路径**，而不只是单一 SQL 形态。对 DuckDB 而言，这类修复优先级极高，因为它影响 **批量导入、CTAS、带主键写入** 等核心生产路径。

---

#### 2) 存储版本前移到 `v1.5.1`
- PR: #21287 `[CLOSED] [Ready To Merge] Bump storage version to v1.5.1`
- 链接: duckdb/duckdb PR #21287

虽然今天没有正式 Release，但存储版本 bump 往往是重要信号，意味着主干已经为下一轮存储格式/兼容性修复做准备。  
对用户而言，这通常意味着：
- 后续版本可能包含 **存储布局或兼容性补丁**
- 使用 `storage_compatibility_version` 的场景需要重点关注后续 release note

结合今天的 Issue #21321 看，**VARIANT 与存储兼容版本的关系** 很可能会是近期维护重点。

---

#### 3) CSV 头推断修复
- PR: #21292 `[CLOSED] Fix #21248: correctly expand type count in CSV header detection`
- 链接: duckdb/duckdb PR #21292

这属于数据导入链路的正确性修复。CSV 是 DuckDB 的高频入口，header/type inference 的修正虽然不是“明星特性”，但直接影响首触体验与批处理稳健性。

---

#### 4) ADBC URI 可用性增强已关闭
- PR: #21293 `[CLOSED] [ADBC] Add support for duckdb:// URI scheme in URI option`
- 链接: duckdb/duckdb PR #21293

该 PR 聚焦 ADBC 使用体验，支持 `duckdb://` URI scheme。即使今天状态为关闭，它依然体现出 DuckDB 在 **生态连接层** 的持续打磨，目标是减少与 Arrow ADBC 集成时的协议摩擦。

---

### 今日打开但值得重点关注的进行中 PR

#### 5) Windows Shell UTF-8/UTF-16 转换修复
- PR: #21319 `Windows shell: fix UTF-8 to UTF-16 conversion`
- 链接: duckdb/duckdb PR #21319

该 PR 与今日高活跃 Issue #21295 高度相关。修复点是 Windows shell 中字符串长度处理错误，导致原始内存垃圾字符被打印。  
影响面集中在 **Windows CLI 输出编码**，属于用户可见度极高的回归，预计合并优先级较高。

---

#### 6) Parquet 元数据函数支持 batch index，并改善保序下并行执行
- PR: #21314 `Add batch index support to parquet_metadata and friends...`
- 链接: duckdb/duckdb PR #21314

这是典型的分析引擎性能增强：  
在 `preserve_insertion_order=true` 的默认/常见配置下，`parquet_metadata` 等函数此前经常无法并行。PR 通过补齐 `get_partition_data` 改善并行能力。  
这说明 DuckDB 仍在持续优化 **Parquet 元信息扫描、并行调度、保序语义与性能之间的平衡**。

---

#### 7) 修复 indexed tables 在 repeated load+insert 下 row group 无界增长
- PR: #21316 `Fix unbounded row group growth for indexed tables on repeated load+insert cycles`
- 链接: duckdb/duckdb PR #21316

这是很有分量的存储修复。问题描述表明：
- 带索引表在“反复加载数据库 + 插入”场景下
- 因 `requires_new_row_group` 标记使用错误
- 会每轮都创建新 row group，导致文件持续膨胀

这直接触达 **长期运行嵌入式场景** 的存储成本与写放大问题，尤其对 DuckDB 作为应用内数据库使用者很关键。

---

#### 8) SQL 兼容性增强：FROM 子句支持 prefix aliases + column names
- PR: #21017 `[Ready For Review] Fix #20562: support prefix aliases with column names in FROM clause`
- 链接: duckdb/duckdb PR #21017

支持诸如：
```sql
FROM r(n): range(1, 3)
```
这属于 SQL 方言兼容和语法扩展，体现 DuckDB 在 **解析器与易用性** 上继续向更灵活的 SQL 写法靠拢。

---

#### 9) CREATE TRIGGER 语法解析原型
- PR: #21265 `Add parsing support for CREATE TRIGGER statements`
- 链接: duckdb/duckdb PR #21265

当前仅到 parser 层，binder/execution 仍报 “not yet supported”。  
但这已经是明确路线图信号：**Trigger 支持正在被拆分推进**。即使短期还不能执行，至少代表核心团队或贡献者已开始铺 parser/catalog 路线。

---

#### 10) C++ 标准升级到 17
- PR: #21310 `Bumping C++ Standard to 17`
- 链接: duckdb/duckdb PR #21310

这是基础设施级变更，短期对终端用户感知弱，但对：
- 编译工具链要求
- 第三方扩展兼容性
- 后续现代 C++ 特性引入

都会产生中长期影响。若推进，将是后续值得特别关注的“迁移信号”。

---

## 4. 社区热点

### 热点 1：Windows CLI `.utf8` 模式破坏 duckbox 输出
- Issue: #21295
- 链接: duckdb/duckdb Issue #21295
- 相关 PR: #21319
- 链接: duckdb/duckdb PR #21319

这是今日最典型的 **用户可见回归**。用户在 Windows 11 Terminal + Command Prompt 下启用 `.utf8` 后，duckbox 输出出现乱码如 `ΓöîΓöÇ`。  
背后技术诉求很清晰：
- CLI 作为 DuckDB 的第一入口，编码正确性直接影响产品观感
- Windows 控制台的 UTF-8/UTF-16 桥接仍是跨平台难点
- 1.5.0 后 CLI 行为变化需要更系统的终端矩阵测试

从已有 PR 看，社区响应较快，问题很可能短期内修复。

---

### 热点 2：CTAS 大表偶发崩溃
- Issue: #21246
- 链接: duckdb/duckdb Issue #21246
- 相关 PR: #21270
- 链接: duckdb/duckdb PR #21270

`CREATE TABLE AS SELECT` 在大表场景下偶发触发 `free(): corrupted unsorted chunks`，这是严重程度较高的问题。  
技术诉求在于：
- 用户希望 DuckDB 在 ETL/中间表物化中保持稳定
- “有时成功、有时崩溃”的非确定性最伤害生产信心
- 这类 bug 往往意味着底层内存或存储状态机存在缺陷

好消息是已有 fix PR 关闭，表明维护者已定位并处理。

---

### 热点 3：Arrow RecordBatchReader + Python 退出阶段 GIL 错误
- Issue: #20715
- 链接: duckdb/duckdb Issue #20715

问题表现为程序退出时出现 `PyGILState_Release` 错误，场景是从 generator 动态生成的 Arrow `RecordBatchReader` 进行查询。  
背后反映的是 DuckDB 在 **Python/Arrow 嵌入式互操作** 中的典型复杂点：
- 生命周期管理
- 解释器退出阶段清理顺序
- GIL 与外部数据源迭代器的资源释放

这类问题评论数不算最高，但技术复杂度高，且影响 Python 生态用户的稳定性认知。

---

### 热点 4：JSON 列多条件过滤正确性异常
- Issue: #20366
- 链接: duckdb/duckdb Issue #20366

用户报告 JSON 列在多 WHERE 条件组合、且条件顺序不同的情况下报错，数据库尝试将整个 JSON 值错误 cast。  
这类问题通常指向：
- 表达式重写/优化顺序
- JSON 提取表达式绑定
- 逻辑短路与类型推导

背后的技术诉求是：用户已把 DuckDB 当作半结构化分析引擎使用，希望 JSON 查询具备接近结构化列的稳定行为。

---

### 热点 5：优化器 pushdown / 剪枝回归持续被关注
- Issue: #19277
- 链接: duckdb/duckdb Issue #19277
- Issue: #21312
- 链接: duckdb/duckdb Issue #21312
- Issue: #21302
- 链接: duckdb/duckdb Issue #21302
- Issue: #20958
- 链接: duckdb/duckdb Issue #20958

这组问题共同指向同一个社区核心诉求：  
**DuckDB 不仅要“能跑”，还要在 Parquet / CTE / 宏 / 宽表场景下稳定保持 pushdown、列裁剪、物化策略的高质量。**

其中：
- #19277 已关闭，说明表达式可能抛错时的 filter pushdown 问题已有结果
- #20958 也已关闭，说明简单 pass-through CTE 阻碍列裁剪的问题得到处理
- 但新问题 #21312、#21302 说明在 **宏、UNION ALL、temp view、read_parquet** 等组合形态下，1.5.x 仍有优化退化

这代表优化器仍是当前最敏感、最容易出现版本回归的区域之一。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 高优先级：崩溃、内存破坏、内部错误

#### 1) CTAS 崩溃：`free(): corrupted unsorted chunks`
- Issue: #21246
- 链接: duckdb/duckdb Issue #21246
- 状态：OPEN / under review
- 是否已有修复：**有，相关 PR #21270 已关闭**
- 链接: duckdb/duckdb PR #21270

影响核心物化路径，且涉及内存破坏特征，建议继续确认是否已被完整覆盖到 1.5.x 补丁中。

---

#### 2) `INSERT OR IGNORE ... read_parquet()` 触发 `SIGTRAP`
- Issue: #21254
- 链接: duckdb/duckdb Issue #21254
- 状态：CLOSED
- 是否已有修复：**有，PR #21270**

该问题已关闭，说明维护者动作迅速。场景涉及：
- 复合主键
- Parquet 输入
- `TRY_CAST`
- 多文件批量插入

是典型生产负载路径。

---

#### 3) INTERNAL Error: Failed to bind column reference
- Issue: #21304
- 链接: duckdb/duckdb Issue #21304
- 状态：OPEN
- 是否已有修复：**暂未看到明确 fix PR**

`INTERNAL Error` 通常意味着不是普通用户用法错误，而是 binder/optimizer 内部状态不一致。  
该问题出现在简单 `WITH t(a,b)` + 子查询组合上，严重性较高，因为它暗示基础 SQL 绑定逻辑可能存在 1.5.0 回归。

---

#### 4) unnest + joins 回归导致 INTERNAL Error
- Issue: #21322
- 链接: duckdb/duckdb Issue #21322
- 状态：OPEN
- 是否已有修复：**暂未看到明确 fix PR**

`UNNEST(LIST_ZIP(...))` 与 join 组合在 1.5 起报：
`Failed to cast expression to type - expression type mismatch`  
这属于明显的查询正确性回归，且涉及列表/嵌套类型，是 DuckDB 的强项领域，值得优先回归测试。

---

### P1 / 较高优先级：数据格式、兼容性、正确性问题

#### 5) JSON -> VARIANT 将非负整数存为 UINT64，导致 Parquet VARIANT 导出失败
- Issue: #21311
- 链接: duckdb/duckdb Issue #21311
- 状态：OPEN / needs triage
- 是否已有修复：**暂无明确 fix PR**

这是一个很有代表性的 **新类型系统兼容问题**：
- JSON 普通整数 `42` 被保留为 `UINT64`
- Parquet VARIANT writer 不接受 `UINT64`
- 导致 `COPY ... TO PARQUET` 失败

这暴露出 **JSON、VARIANT、Parquet writer 三者之间的类型约定不一致**。如果 VARIANT 是 DuckDB 近期重点功能，这类问题会直接影响其落地速度。

---

#### 6) `storage_compatibility_version='latest' / 'v1.5.0'` 不允许 VARIANT
- Issue: #21321
- 链接: duckdb/duckdb Issue #21321
- 状态：OPEN / needs triage
- 是否已有修复：**暂无明确 fix PR**

此问题与上面的 VARIANT 兼容性相呼应，说明：
- VARIANT 不仅在导出链路上有问题
- 在存储兼容版本控制上也存在配置/语义落差

再结合 PR #21287 bump storage version 到 `v1.5.1`，可推断 **VARIANT 与存储版本协同** 很可能是近期必修课题。

---

#### 7) Windows CLI `.utf8` 模式输出乱码
- Issue: #21295
- 链接: duckdb/duckdb Issue #21295
- 状态：OPEN / reproduced
- 是否已有修复：**有，PR #21319**
- 链接: duckdb/duckdb PR #21319

虽然不是数据损坏，但属于高曝光可见 bug，影响新用户第一印象。

---

#### 8) `.multiline` dot command 在 1.5.0 报 Invalid usage
- Issue: #21308
- 链接: duckdb/duckdb Issue #21308
- 状态：OPEN / needs triage
- 是否已有修复：**未见明确 fix PR**

影响 `~/.duckdbrc` 启动脚本兼容性，属于 CLI 使用体验回归。

---

#### 9) CLI 无法 `.open` Parquet 文件
- Issue: #21259
- 链接: duckdb/duckdb Issue #21259
- 状态：CLOSED
- 是否已有修复：**已关闭，具体修复 PR 未在给定数据中明确列出**

说明 CLI 对外部文件格式支持的打包/依赖问题已有处理。

---

### P2 / 性能与优化器回归

#### 10) `min(match_key_int)` over `UNION ALL` + temp view + `read_parquet(...)` 性能显著变慢
- Issue: #21302
- 链接: duckdb/duckdb Issue #21302
- 状态：OPEN / reproduced
- 是否已有修复：**暂无明确 fix PR**

这是典型 1.5.x 性能回归，场景来自 record linkage / blocking。  
说明 **复杂子计划 + 外部文件扫描 + 聚合** 的组合仍需优化器侧进一步打磨。

---

#### 11) scalar macro 场景下 Filter Pushdown 不工作
- Issue: #21312
- 链接: duckdb/duckdb Issue #21312
- 状态：OPEN / needs triage
- 是否已有修复：**暂无明确 fix PR**

用户期望在 hive partitioning 的 `read_parquet` 上通过宏返回的 partition 条件实现裁剪。  
这体现了用户对 DuckDB 的要求已从“支持宏”升级到“宏不应阻断优化器”。

---

#### 12) RTREE index 未被使用
- Issue: #21320
- 链接: duckdb/duckdb Issue #21320
- 状态：OPEN / needs triage
- 是否已有修复：**暂无明确 fix PR**

当表同时存在 geometry 和 id 列时，RTREE index 不生效；只有 geometry 单列时可用。  
这可能是空间扩展中的 planner/index matcher 限制，值得 spatial 用户关注。

---

## 6. 功能请求与路线图信号

### 1) Trigger 支持进入“解析器先行”阶段
- PR: #21265
- 链接: duckdb/duckdb PR #21265

虽然还不能执行，但 `CREATE TRIGGER` 语法解析已开始。  
这通常意味着功能会按 **parser → binder/catalog → execution** 分阶段推进。若该 PR 获得正向反馈，未来一个或数个版本中看到基础触发器支持的概率提升。

---

### 2) SQL 语法兼容继续增强
- PR: #21017
- 链接: duckdb/duckdb PR #21017

`FROM r(n): range(1, 3)` 这类 prefix alias + column list 写法，说明 DuckDB 仍在积极提升 SQL 书写兼容性与表达力。  
这种 PR 一般阻力较小，进入下一版本的可能性较高。

---

### 3) Parquet 写出选项更细化
- PR: #20976
- 链接: duckdb/duckdb PR #20976

该 PR 允许配置“无时区时间戳”的 Parquet `isAdjustedToUTC`。  
这是典型的数据交换/湖仓互操作需求，面向与预定义 schema 对齐的企业用户。  
考虑到 DuckDB 的 Parquet 用户基数很大，这类功能进入后续版本的可能性也较高。

---

### 4) 表函数能力增强：允许 input plan stealing
- PR: #21309
- 链接: duckdb/duckdb PR #21309

这更偏内核能力建设。若落地，将使 table function 更容易“接管”已有逻辑计划，提升扩展性与高级优化空间。  
对扩展作者和内核开发者价值较大，是典型中长期架构演进信号。

---

### 5) C++17 升级是明确的工程路线图信号
- PR: #21310
- 链接: duckdb/duckdb PR #21310

如果该 PR 继续推进，意味着：
- 扩展作者需升级编译环境
- 某些旧工具链可能不再受支持
- 主干后续可采用更现代的语言特性

这是“不是功能，但影响很大”的路线图事件。

---

## 7. 用户反馈摘要

结合今日 Issues，可归纳出几类真实用户痛点：

### 1) DuckDB 正在被用于更复杂、更接近生产的 ETL/分析任务
- 典型案例：#21246、#21254、#21302
- 链接：
  - duckdb/duckdb Issue #21246
  - duckdb/duckdb Issue #21254
  - duckdb/duckdb Issue #21302

用户不只是做 ad-hoc 查询，而是在：
- 大表 CTAS
- 多文件 Parquet 批量导入
- record linkage/blocking
- 带主键约束写入

因此任何存储层和优化器回归都会被迅速放大。

---

### 2) 半结构化数据与新类型已进入真实使用
- 典型案例：#20366、#21311、#21321
- 链接：
  - duckdb/duckdb Issue #20366
  - duckdb/duckdb Issue #21311
  - duckdb/duckdb Issue #21321

JSON / VARIANT 不再是边缘功能。用户已经期待：
- 多条件 JSON 过滤稳定正确
- JSON → VARIANT 类型语义一致
- VARIANT 可参与存储兼容与 Parquet 导出

说明 DuckDB 在“结构化 + 半结构化统一分析”上的吸引力正在增强，但类型一致性仍需补课。

---

### 3) Python/Arrow 生态用户关注生命周期与退出稳定性
- 典型案例：#20715
- 链接: duckdb/duckdb Issue #20715

用户用 generator 动态供给 Arrow batches 以避免 OOM，这是很成熟的工程用法。  
反馈表明大家不仅要功能可用，还要求：
- 资源释放正确
- 嵌入式运行时安全
- 退出阶段无崩溃/无 GIL 错误

---

### 4) CLI 依然是很多用户的关键入口
- 典型案例：#21295、#21308、#21259
- 链接：
  - duckdb/duckdb Issue #21295
  - duckdb/duckdb Issue #21308
  - duckdb/duckdb Issue #21259

Windows 编码、dot command、`.open` 文件格式支持等问题说明：  
尽管 DuckDB 生态丰富，CLI 依然是非常高频的使用入口，尤其在升级到 1.5.0 后，用户对“脚本兼容性不破坏”非常敏感。

---

## 8. 待处理积压

以下项目建议维护者重点关注，避免形成新的积压点：

### 1) Python Arrow RecordBatchReader 退出阶段 GIL 错误
- Issue: #20715
- 链接: duckdb/duckdb Issue #20715

创建于 2026-01-28，至今仍 OPEN。  
该问题影响 Python 生态、难以由用户自行规避，且通常需要内核/绑定层协同修复，建议提高优先级。

---

### 2) JSON 列多 WHERE 子句导致错误
- Issue: #20366
- 链接: duckdb/duckdb Issue #20366

创建于 2026-01-02，仍处于 OPEN。  
考虑到 JSON 已是核心使用场景之一，这类正确性问题不宜长期挂起。

---

### 3) 1.5.x 性能回归链条需系统化梳理
- Issue: #21302
- 链接: duckdb/duckdb Issue #21302
- Issue: #21312
- 链接: duckdb/duckdb Issue #21312
- 已关闭参考：#20958、#19277
- 链接：
  - duckdb/duckdb Issue #20958
  - duckdb/duckdb Issue #19277

虽然部分历史问题已关闭，但新的宏、UNION ALL、temp view、read_parquet 组合回归继续出现。  
建议维护者汇总为 **1.5.x 优化器回归专项**，而不是逐个点状处理。

---

### 4) SQL 扩展类 PR 候审
- PR: #21017
- 链接: duckdb/duckdb PR #21017
- PR: #21265
- 链接: duckdb/duckdb PR #21265
- PR: #20976
- 链接: duckdb/duckdb PR #20976

这些 PR 代表未来功能方向，但当前仍未落地。若长期停留在 review 阶段，可能削弱外部贡献者积极性。  
尤其 #21017 已从 2 月中旬持续至今，建议尽快明确 review 结论。

---

## 结论

今天的 DuckDB 呈现出典型的 **“发布后修复窗口 + 主干持续演进”** 状态。  
一方面，1.5.0 暴露的存储、CLI、优化器与类型系统回归仍在持续收敛；另一方面，主干上已经出现 Trigger、SQL 语法扩展、Parquet 写出配置、C++17 升级等中长期建设信号。  
从项目健康度看，维护节奏积极，崩溃类问题已经有明确修复动作；但若要提升 1.5.x 的生产信心，接下来最关键的是：**继续压缩 INTERNAL Error、稳定 Parquet/VARIANT 语义、并系统治理优化器回归。**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-12）

## 1. 今日速览

过去 24 小时，StarRocks 项目保持**高活跃度**：Issues 更新 14 条、PR 更新 129 条，但**无新版本发布**。  
从变更结构看，今日重点仍集中在**查询正确性修复、物化视图/Iceberg 生态能力增强、共享存储与 compaction 优化**，同时伴随大量 backport 与文档/测试维护，说明项目处于**主干快速迭代 + 多版本稳定分支同步修复**的状态。  
稳定性方面，已有若干查询结果正确性问题得到快速关闭或关联修复，响应速度较好；但仍存在**分区裁剪、MV 重写、外部存储连接、UDF 泛型兼容**等需要持续关注的风险点。  
整体判断：**工程健康度较高，研发节奏快，4.0/4.1/4.2 相关能力仍在密集打磨中。**

---

## 2. 项目进展

## 今日合并/关闭的重要 PR

### 2.1 修复查询计划错误：SplitTopNRule 与分区裁剪联动问题
- **PR #70154** `[BugFix] Fix SplitTopNRule not process prune partition`（已关闭，视为已合入）
- 链接: StarRocks/starrocks PR #70154
- 关联 Issue: **#69364** `"Invalid plan" error on AGGREGATE KEY table with ORDER BY + LIMIT (v4.0.6)`  
- Issue 链接: StarRocks/starrocks Issue #69364

**进展解读：**  
该修复直接针对一个**查询计划生成错误**：在 `AGGREGATE KEY` 表上执行 `ORDER BY + LIMIT` 时触发 `Invalid plan`。从 PR 标题可见，问题核心在于 **SplitTopNRule 未正确处理 prune partition**，属于优化器规则与分区裁剪交互中的缺陷。  
这类问题影响的是**查询可执行性与正确性**，优先级较高。今天该 Issue 已关闭，且已有：
- **PR #70168** backport
- **PR #70169** backport（带 conflicts）
表明维护团队正将修复向多个稳定分支推广。

---

### 2.2 MV 重写正确性修复：避免忽略基表被删除分区
- **PR #70130** `[BugFix] Fix MV rewrite ignoring dropped partitions in base table`（Open）
- 链接: StarRocks/starrocks PR #70130

**进展解读：**  
虽然该 PR 今日尚未关闭，但其问题描述非常关键：**当基表 Iceberg 分区被删除后，物化视图透明改写仍可能命中陈旧数据**。  
这是典型的**查询结果正确性**问题，且场景涉及：
- Iceberg 外表
- 分区物化视图
- LOOSE / FORCE MV rewrite 模式

如果该修复顺利合入，将明显提升 StarRocks 在**Lakehouse 查询加速**场景下的可信度。

---

### 2.3 FE 内存治理：查询级元数据及时释放，缓解并发 OOM
- **PR #70166** `[BugFix] Release per query metadata after query planning to prevent OOM on FE during concurrent query execution (backport #68444)`（Open）
- 链接: StarRocks/starrocks PR #70166

**进展解读：**  
该修复聚焦 FE 侧资源回收：查询级 connector metadata（如 IcebergMetadata 及其 table cache）此前清理时机偏晚，在高并发下可能造成 **FE OOM**。  
这说明项目正在持续补强：
- 查询规划阶段的对象生命周期管理
- 外部 catalog / connector 的缓存回收
- FE 长稳运行能力

对生产用户而言，这是比单点 bug 更重要的**稳定性基建修复**。

---

### 2.4 存储引擎优化：并行 Compaction 引入基于范围切分的新子任务模型
- **PR #70162** `[Enhancement] Add range-split parallel compaction for non-overlapping output`（PROTO-REVIEW）
- 链接: StarRocks/starrocks PR #70162

**进展解读：**  
该 PR 提出在 lake parallel compaction 中增加 **RANGE_SPLIT** 子任务类型，按 sort key range 而非 segment index 切分工作，输出保证 **non-overlapping**。  
这类优化的潜在收益包括：
- 降低 compaction 输出重叠度
- 提升后续读路径效率
- 为 shared-data / lake 场景下的大表维护提供更稳定的存储布局

虽然仍在原型评审阶段，但这是今日最值得关注的**存储层演进信号**之一。

---

### 2.5 元数据与事务日志重构推进
- **PR #69911** `[Refactor] Transform Transaction related edit logs to WAL format`（已关闭）
- 链接: StarRocks/starrocks PR #69911

**进展解读：**  
事务相关 edit log 向 WAL 格式演进，反映出 StarRocks 对**日志一致性、恢复路径、可维护性**的持续重构。  
这类 PR 通常不会立刻体现为用户可见功能，但会影响：
- FE/元数据恢复逻辑
- 运维可观测性
- 后续事务与共享存储能力扩展

---

### 2.6 工具链与质量保障
- **PR #70129** `[Tool] Add share_data check in inspection pipeline`（已关闭）  
  链接: StarRocks/starrocks PR #70129
- **PR #70027** `[Doc] Fix lychee link check`（已关闭）  
  链接: StarRocks/starrocks PR #70027
- **PR #70171 / #70172 / #70173** 文档 backport（已关闭）  
  链接: StarRocks/starrocks PR #70171 / PR #70172 / PR #70173
- **PR #70159 / #70160** `Support mock journal for shared-data mock cluster`（Open）  
  链接: StarRocks/starrocks PR #70159 / PR #70160

**进展解读：**  
今天大量非功能性变更围绕：
- shared-data 模式检查
- mock cluster 测试能力
- 文档链路质量  
这表明项目正在加强**多部署形态测试覆盖和发布工程质量**。

---

## 3. 社区热点

## 3.1 ClickHouse AggregatingMergeTree 查询支持诉求
- **Issue #53950** `[enhancement] Support Query ClickHouse AggregatingMergeTree Engine Table`
- 链接: StarRocks/starrocks Issue #53950

**热度表现：**
- 评论 4，今日 Issues 中评论最多之一
- 标签含 `good first issue`

**技术诉求分析：**  
用户希望把 StarRocks 作为**统一查询引擎层**，直接查询 ClickHouse 的 `AggregatingMergeTree` 相关表/物化视图。  
这反映出 StarRocks 的外部查询价值已不仅限于 Hive/Iceberg/Hudi，而是在向：
- 异构 OLAP 引擎联邦查询
- 多引擎统一语义层
- 跨系统物化视图访问  
进一步延展。  
如果未来支持，将增强 StarRocks 在“**统一加速层 / SQL 门面层**”定位上的竞争力。

---

## 3.2 `GROUP BY ALL` 语法需求
- **Issue #69953** `[enhancement] Support GROUP BY ALL syntax to simplify queries`
- 链接: StarRocks/starrocks Issue #69953

**热度表现：**
- 👍 3，为今日 Issues 中反应最高

**技术诉求分析：**  
用户关注的是**SQL 易用性与兼容性**：新增 select 列时不想同步修改 `GROUP BY` 列表。  
背后诉求包括：
- 兼容更多分析型 SQL 方言
- 减少 BI/报表 SQL 维护成本
- 降低人工修改引入错误的概率

这类需求虽然不是底层核心能力，但对提升 StarRocks 的**开发者体验和迁移友好度**很重要。

---

## 3.3 Iceberg 元数据能力持续升温
- **Issue #69692** `[Feature] Add $properties Iceberg Metadata Table`
- 链接: StarRocks/starrocks Issue #69692
- **Issue #69847** `Supports the row lineage feature in Iceberg v3`
- 链接: StarRocks/starrocks Issue #69847
- **PR #69525** `[Feature] Support Iceberg v3 default value feature`（Open）
- 链接: StarRocks/starrocks PR #69525

**技术诉求分析：**  
今天最清晰的路线图信号来自 **Iceberg v3 生态支持**。社区关注点已从“能不能读写 Iceberg”提升到：
- 元数据表可查询性（`$properties`）
- row lineage
- default value（`initial-default`, `write-default`）
- MV rewrite 与分区删除一致性

这意味着 StarRocks 正向更深层的 **Lakehouse 元数据语义兼容**推进，而不只是基础读写接入。

---

## 4. Bug 与稳定性

以下按影响程度排序。

### P1：查询结果/执行正确性

#### 4.1 `ORDER BY + LIMIT` 导致 `Invalid plan`
- **Issue #69364**（已关闭）
- 链接: StarRocks/starrocks Issue #69364
- **Fix PR #70154**（已关闭）
- 链接: StarRocks/starrocks PR #70154
- **Backport PR #70168 / #70169**（Open）
- 链接: StarRocks/starrocks PR #70168 / PR #70169

**判断：**  
这是已确认并已修复的**高优先级查询计划问题**，影响 AGGREGATE KEY 表查询稳定性。

---

#### 4.2 简单查询返回缺失行
- **Issue #70145** `[type/bug] Simple query result Wrong Missing rows`
- 链接: StarRocks/starrocks Issue #70145
- 当前状态：Open
- 是否已有 fix PR：**未见明确关联**

**判断：**  
标题直接指向**查询结果错误/丢行**，属于最需要优先排查的问题之一。虽然当前评论不多，但风险高于一般崩溃类问题，因为它可能在无报错情况下返回错误结果。

---

#### 4.3 MV 改写忽略基表已删除分区，可能读到陈旧数据
- **PR #70130**（Open）
- 链接: StarRocks/starrocks PR #70130

**判断：**  
虽未直接列为 Issue，但从 PR 描述看，这是**严重正确性缺陷**，尤其影响 Iceberg + MV 用户。建议持续关注是否在近两日内合并并回补稳定分支。

---

#### 4.4 分区谓词因边界类型不匹配被意外裁剪
- **PR #70097** `[BugFix] Partition predicates are pruned unexpectedly because of mismatch types boundary comparison`
- 链接: StarRocks/starrocks PR #70097

**判断：**  
问题涉及 `str2date(column, ...)` 场景下的表达式分区边界比较。属于优化器/分区裁剪逻辑中的**隐蔽正确性问题**，可能导致扫描分区错误，从而引发漏数或错误过滤。

---

### P2：崩溃 / 内存 / 生命周期问题

#### 4.5 ExprContext use-after-free
- **PR #70164** `[WIP][BugFix] Fix the use-after-free of ExprContext when node init failed`
- 链接: StarRocks/starrocks PR #70164

**判断：**  
这是典型的 C++ 生命周期问题，描述中提到 `Node::init()` 失败后 `ExprContext` 未显式关闭，最终在 pool 销毁期间可能触发 **use-after-free**。  
虽然仍是 WIP，但风险类型较重，可能影响：
- 查询失败路径稳定性
- ASAN / 线上偶发崩溃

---

#### 4.6 FE 在并发查询下可能 OOM
- **PR #70166**（Open）
- 链接: StarRocks/starrocks PR #70166

**判断：**  
高并发 + 外部元数据场景中的资源回收问题，属**容量与稳定性风险**。若用户大量使用 Iceberg/Hive catalog，建议重点评估。

---

### P3：外部连接器 / 生态兼容

#### 4.7 S3 通过 VIP 连接时总是命中同一后端 IP
- **Issue #70024** `[type/bug] Starrocks connect S3 with vip always connect the same S3 backend IP`
- 链接: StarRocks/starrocks Issue #70024
- 当前状态：Open
- 是否已有 fix PR：**未见明确关联**

**判断：**  
更偏**负载均衡与对象存储接入行为异常**。不会立刻导致错误结果，但可能引起单节点热点、S3 集群压力不均、吞吐抖动。

---

#### 4.8 Java UDTF/UDAF 对泛型参数支持导致崩溃
- **Issue #69195**（已关闭）
- 链接: StarRocks/starrocks Issue #69195

**判断：**  
说明 Java UDF 框架在复杂签名解析上存在兼容性边界。今日关闭是积极信号，但仍提示用户在扩展函数开发上要警惕泛型反射问题。

---

#### 4.9 Routine Load 中 `str_to_date` 丢失微秒精度
- **Issue #70056**（已关闭）
- 链接: StarRocks/starrocks Issue #70056

**判断：**  
属于典型的数据摄取精度问题，虽已关闭，但说明导入链路对时间精度的处理近期仍在修复中。

---

#### 4.10 Python/Alembic 自动迁移返回 `NotImplementedError`
- **Issue #69264** `[good first issue] starrocks-python alembic returns NotImplementedError`
- 链接: StarRocks/starrocks Issue #69264

**判断：**  
影响的是 Python ORM / schema migration 生态，偏开发工具兼容，不是内核高危问题，但会影响接入体验。

---

## 5. 功能请求与路线图信号

### 5.1 Iceberg v3 能力大概率进入后续版本重点
- **Issue #69692** `Add $properties Iceberg Metadata Table`
- 链接: StarRocks/starrocks Issue #69692
- **Issue #69847** `Supports the row lineage feature in Iceberg v3`
- 链接: StarRocks/starrocks Issue #69847
- **PR #69525** `Support Iceberg v3 default value feature`
- 链接: StarRocks/starrocks PR #69525

**判断：**  
这些需求与 PR 形成明显簇状分布，说明 **Iceberg v3 支持是明确路线图方向**。尤其是：
- 默认值
- 元数据表
- row lineage  
都属于深水区兼容，不像试验性功能，更像版本级能力完善。  
其中带有 `version:4.2` 的 Issue 也进一步暗示其目标落点可能在 **4.2**。

---

### 5.2 SQL 兼容性继续增强
- **Issue #69953** `Support GROUP BY ALL syntax`
- 链接: StarRocks/starrocks Issue #69953
- **Issue #70082** `Week support for time based range partitioning (docs problem)`
- 链接: StarRocks/starrocks Issue #70082

**判断：**  
一个是新增 SQL 语法，一个是文档与实际行为不一致。两者共同反映用户对 StarRocks 的期待已从“可用”转向“**语义一致、方言友好、行为可预期**”。

---

### 5.3 联邦查询/外部引擎互操作有持续需求
- **Issue #53950** `Support Query ClickHouse AggregatingMergeTree Engine Table`
- 链接: StarRocks/starrocks Issue #53950

**判断：**  
这是较强的产品信号：用户希望 StarRocks 成为异构分析存储之上的**统一查询面**。  
如果该需求被接纳，未来可能看到更多：
- ClickHouse 表引擎兼容
- 外部系统聚合状态读取
- 统一 SQL 层能力增强

---

### 5.4 存储与运维能力仍在演进
- **Issue #69612** `tenann ... not compiled with PIC enabled`
- 链接: StarRocks/starrocks Issue #69612
- **PR #70162** `range-split parallel compaction`
- 链接: StarRocks/starrocks PR #70162
- **Issue #68783** `Remove list object storage operation when loading data into random-bucket tables`（已关闭）
- 链接: StarRocks/starrocks Issue #68783

**判断：**  
从对象存储 LIST 成本优化，到 PIC 编译、再到 compaction 任务模型增强，说明 shared-data / lake 场景下的**底层工程能力**仍是持续投入重点。

---

## 6. 用户反馈摘要

基于今日 Issues，可提炼出以下真实用户痛点：

### 6.1 StarRocks 被越来越多用作“统一查询层”
- 代表 Issue: **#53950**
- 链接: StarRocks/starrocks Issue #53950

用户不再只把 StarRocks 看成自有存储 OLAP，而是希望它能查询 ClickHouse 等外部系统对象，尤其是带聚合语义的引擎表。这说明 StarRocks 的产品认知正向**统一分析入口**扩展。

---

### 6.2 用户对“查询结果正确性”高度敏感
- 代表 Issue: **#70145**, **#69364**
- 链接: StarRocks/starrocks Issue #70145 / Issue #69364

包括丢行、Invalid plan、MV 改写陈旧数据等问题，都指向同一个核心诉求：  
**性能可以稍慢，但结果必须可信。**  
这对优化器规则、分区裁剪、MV rewrite 来说是强约束。

---

### 6.3 湖仓用户希望更深的 Iceberg 元数据可见性
- 代表 Issue: **#69692**, **#69847**
- 链接: StarRocks/starrocks Issue #69692 / Issue #69847

用户不仅要查数据，还要直接查：
- 表属性
- 行血缘
- 默认值语义  
这说明 StarRocks 已进入更成熟的企业数据平台场景，需要承担更多“元数据分析入口”的角色。

---

### 6.4 运维用户关注对象存储与网络行为的可控性
- 代表 Issue: **#70024**, **#68783**
- 链接: StarRocks/starrocks Issue #70024 / Issue #68783

反馈主要集中在：
- S3 连接负载分布
- 对象存储 LIST 开销
- shared-data 模式稳定性  
这是典型的大规模生产环境诉求，表明 StarRocks 正被用于更复杂、更高吞吐的对象存储后端场景。

---

### 6.5 开发生态仍需补齐边角兼容
- 代表 Issue: **#69195**, **#69264**
- 链接: StarRocks/starrocks Issue #69195 / Issue #69264

Java 泛型 UDF、Python Alembic 自动迁移等问题说明：  
内核以外的开发者生态已被使用，但仍有不少“最后一公里”兼容待补。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期或潜在积压项：

### 7.1 ClickHouse AggregatingMergeTree 支持需求已存在较久
- **Issue #53950**（创建于 2024-12-15，仍 Open）
- 链接: StarRocks/starrocks Issue #53950

虽然有一定讨论热度，但距今时间较长。考虑到其反映的是 StarRocks 作为统一查询层的战略诉求，建议明确：
- 是否接受该方向
- 需要支持到何种聚合状态语义
- 是否以 connector/表函数方式落地

---

### 7.2 动态分区创建优化 PR 长期停留在评审态
- **PR #67793** `[Enhancement] Optimize dynamic partition creation with CompletableFuture deduplication`
- 链接: StarRocks/starrocks PR #67793

该 PR 创建于 2026-01-12，至今仍 Open。其目标是降低 dynamic overwrite 下 FE 接收的重复建分区请求压力，对高并发写入场景很有价值。建议维护者尽快给出：
- 性能验证结果
- 并发安全评估
- 是否拆分合并

---

### 7.3 Iceberg v3 default value 功能 PR 持续待审
- **PR #69525**（创建于 2026-02-26，仍 Open）
- 链接: StarRocks/starrocks PR #69525

该功能与 Iceberg v3 兼容能力直接相关，且社区已有多个同方向需求。若继续拖延，可能影响 4.2 路线节奏与用户预期。

---

### 7.4 PIC 编译与 third-party 依赖构建问题
- **Issue #69612**
- 链接: StarRocks/starrocks Issue #69612

虽然被标记为 `good first issue`，但本质涉及 third-party build 体系与发行构建约束，不一定真是低复杂度问题。若 StarRocks 面向更多企业发行与安全编译要求，建议尽早明确支持策略。

---

## 8. 总结判断

今天 StarRocks 的核心动态可以概括为三点：

1. **查询正确性优先级很高**：`Invalid plan` 已快速修复并 backport，MV rewrite 与分区裁剪相关问题也在处理中。  
2. **Lakehouse / Iceberg 是最明确的演进主线**：默认值、row lineage、metadata table、MV 一致性都在推进。  
3. **共享存储与工程基础设施持续加强**：包括 parallel compaction、share-data 检查、mock cluster、日志/WAL 重构等。

从健康度看，项目 today 的状态是：**活跃、修复快、路线清晰，但正确性与外部生态兼容仍是接下来最关键的质量战场。**

如果你需要，我也可以继续把这份日报整理成更适合内部周报/飞书通知的 **Markdown 简版**，或者再输出一版 **“按 FE / BE / Lakehouse / SQL 四条主线分类”** 的摘要。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-12）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持**高活跃度**：Issues 更新 10 条，PR 更新 43 条，说明社区在核心引擎、连接器、元数据管理和云存储适配方面持续推进。  
从变更结构看，**PR 活跃远高于 Issue**，且新增 PR 多集中在 Spark、Flink、Core、REST/OpenAPI 与 Kafka Connect，表明项目当前重点仍是**查询引擎能力扩展、元数据可扩展性以及多云对象存储适配**。  
今日没有新版本发布，但从 PR 主题判断，项目正在为后续版本积累几个关键方向：**V4 Manifest / single-file commit 元数据演进、Spark/Flink 对 Variant 类型支持、云存储 I/O 性能与连接管理优化**。  
稳定性方面，用户反馈仍集中在**S3/GCS 连接池、Kafka Connect 路由正确性、流式/批式写入后的可扫描性**，这些问题对生产环境影响较大，值得持续关注。  

---

## 3. 项目进展

### 已关闭 / 已结束的重要 PR

#### 1) `#15580` feat: Add iceberg-lance module with Lance columnar format support
- 状态：**已关闭**
- 链接：apache/iceberg PR #15580
- 影响分析：  
  这是今天最值得关注但未落地的扩展尝试之一。PR 试图新增 `iceberg-lance` 模块，引入 **Lance 列式格式** 支持，目标场景偏向 **ML/AI、向量检索、Arrow 零拷贝访问**。  
  虽然当前已关闭，说明短期内官方主线**尚未准备接纳新的底层列式格式扩展**，但它释放了一个信号：社区已开始探索 Iceberg 在传统 BI/OLAP 之外，向 **AI 数据基础设施** 延展的可能性。  
- 判断：  
  **短期不太可能进入正式版本**，但可能会继续以生态实验或外部集成形式存在。

#### 2) `#15206` Kafka Connect: Add start and end offset for each source topic partition in iceberg snapshot as a property
- 状态：**已关闭**
- 链接：apache/iceberg PR #15206
- 影响分析：  
  该 PR 希望为 Kafka Connect sink 写入的 Iceberg snapshot 增加每个 topic-partition 的起止 offset 元信息，以增强**数据血缘、可追溯性和审计能力**。  
  本次关闭意味着 Kafka Connect 在可观测性和精细化 lineage 方面，短期内仍需依赖外部系统或自定义元数据。  
- 技术价值：  
  对流式湖仓用户非常实用，尤其适用于**回放校验、故障追踪、消费边界确认**。

#### 3) `#15205` Kafka Connect: Avoid always adding columns as optional on schema evolution
- 状态：**已关闭**
- 链接：apache/iceberg PR #15205
- 影响分析：  
  该 PR 聚焦 Kafka Connect 的 schema evolution 正确性，试图避免新增列在演进时总被标记为 nullable。  
  关闭意味着该问题尚未在主线解决，**Connect schema 与 Iceberg schema 语义一致性**依然是薄弱点，尤其影响严格 schema 管控场景。

### 今日值得关注的在途 PR

#### 4) `#15590` Core: Auto-flush accumulated data files to manifests in MergingSnapshotProducer
- 状态：**OPEN**
- 链接：apache/iceberg PR #15590
- 进展意义：  
  这是今天最重要的 Core 向优化之一。该 PR 提议在 `MergingSnapshotProducer` 中加入自动 flush 机制，当累计 `DataFile` 数达到阈值（默认 10K）时，提前落盘到 manifest。  
- 价值：  
  - 降低大批量提交（如 50 万+ 文件）时的**峰值内存占用**
  - 将 manifest 写入 I/O **平滑到提交过程中**
  - 缓解大事务 commit 尾部延迟
- 判断：  
  这是明显的**生产级稳定性与可扩展性增强**，如果评审顺利，较有机会进入下一版本。

#### 5) `#15049` API, Core: Introduce foundational types for V4 manifest support
- 状态：**OPEN**
- 链接：apache/iceberg PR #15049

#### 6) `#14533` [WIP] V4 Manifest Read Support
- 状态：**OPEN**
- 链接：apache/iceberg PR #14533
- 进展意义：  
  两个 PR 共同指向 Iceberg 元数据层的重大演进：**V4 Manifest / adaptive metadata tree / single-file commit**。  
- 价值：  
  - 改善超大表场景下的元数据组织与读取效率
  - 为未来更高效的提交路径和 manifest 读写模型打基础
- 判断：  
  这很可能是中期路线图上的核心工程，虽然短期未必立即发布，但战略优先级很高。

#### 7) `#15299` Spark 4.1: New Async Spark Micro Batch Planner
- 状态：**OPEN**
- 链接：apache/iceberg PR #15299
- 进展意义：  
  面向 Spark 4.1 的异步微批规划器，属于典型的**流式读/写性能和调度效率增强**。  
- 价值：  
  - 降低 micro-batch planning 对主执行路径的阻塞
  - 改善流处理吞吐和时延稳定性
- 判断：  
  属于 Spark 方向较强的版本前瞻特性。

#### 8) `#15061` / `#15588` Spark 自定义 snapshot properties 应用于 DELETE
- 状态：**OPEN**
- 链接：apache/iceberg PR #15061 / apache/iceberg PR #15588
- 进展意义：  
  这两个 PR 都在修复 Spark DELETE 路径与 INSERT/UPDATE 在 snapshot metadata 行为上的不一致。  
- 价值：  
  - 提升审计、血缘、作业标记等场景的一致性
  - 改善元数据治理体验
- 判断：  
  属于**SQL 语义一致性修复**，优先级不低。

---

## 4. 社区热点

### 热点 1：Athena / AWS MSK Connector 元数据写入随机停止
- Issue：`#13593`  
- 链接：apache/iceberg Issue #13593
- 状态：OPEN，评论 29，👍 3
- 现象：  
  用户反馈使用 AWS MSK Iceberg Connector + Athena + Iceberg 1.9.1 时，元数据写入会在运行一段随机时间后停止，并出现 “Commit failed, will try again next cycle”。  
- 技术诉求分析：  
  这是典型的**流式摄入可靠性问题**。用户并不只是要求修复单点异常，而是在寻求：
  1. 长时间运行下的 commit 稳定性  
  2. 连接器与 catalog/object store 之间的重试与幂等保障  
  3. 更好的可观测性，便于判断失败发生在 writer、manifest、commit 还是 catalog 层  
- 影响面：  
  对生产摄入链路影响较大，优先级偏高。

### 热点 2：AppendFiles + PartitionedFanoutWriter 后表扫描异常
- Issue：`#13973`
- 链接：apache/iceberg Issue #13973
- 状态：OPEN，评论 5，👍 1
- 现象：  
  在 Iceberg 1.5.2 中，使用 `AppendFiles` API 与 `PartitionedFanoutWriter` 写分区表后，扫描时报错。  
- 技术诉求分析：  
  背后反映的是**低层写入 API 正确性与兼容性问题**，尤其影响自研数据写入链路、CDC sink、批量导入工具。  
- 影响面：  
  如果问题可复现，其严重性高于普通功能请求，因为它直接触及**写后可读**这一核心正确性契约。

### 热点 3：Flink 侧希望支持 rewrite file 时的 z-order / sort order
- Issue：`#13928`
- 链接：apache/iceberg Issue #13928
- 状态：OPEN，评论 4
- 技术诉求分析：  
  Spark 已具备相对成熟的数据重写与排序优化能力，而 Flink 用户希望获得类似的 **z-order / clustering** 能力，以改善点查、范围过滤与跳过率。  
- 信号：  
  社区对 Flink 的期待正在从“可用”走向“性能调优能力齐平 Spark”。

### 热点 4：GCS / S3 连接池与 TCP 连接爆炸
- Issues：`#15411`, `#13863`, `#15587`
- 链接：apache/iceberg Issue #15411 / apache/iceberg Issue #13863 / apache/iceberg Issue #15587
- 技术诉求分析：  
  三个问题都指向同一个主题：**云对象存储 I/O 客户端的连接生命周期管理仍不够可控**。  
  - GCSFileIO：缺少明显的连接池复用能力，导致 TCP 连接激增  
  - S3FileIO：长期运行后出现 “Connection pool shut down”  
  - GCS 读取：缺少连接超时、读超时配置  
- 影响：  
  这是生产运维最敏感的一类问题，通常会引发**吞吐抖动、任务失败、连接资源耗尽**。

---

## 5. Bug 与稳定性

按严重程度排序：

### P1：多 topic → 多表路由错误，导致所有记录写入所有表
- Issue：`#15584`
- 链接：apache/iceberg Issue #15584
- 状态：OPEN
- 场景：Kafka Connect，Iceberg 1.6.1
- 问题描述：  
  单个 Iceberg Kafka Connect Sink connector 在配置多个 topic 路由到多个表，且 schema 相同时，**所有 topic 的记录都会被写到所有表**。  
- 严重性：**极高**
- 原因：  
  这是明显的**数据正确性问题**，可能造成跨表污染。  
- 当前 fix PR：**未看到对应修复 PR**
- 建议关注：  
  应尽快确认是否只在“无 route-field + schema identical”组合下触发，并补充回归测试。

### P1：元数据写入随机停止，commit 周期性失败
- Issue：`#13593`
- 链接：apache/iceberg Issue #13593
- 状态：OPEN
- 场景：Athena + AWS MSK Iceberg Connector
- 问题描述：  
  运行随机时长后，metadata 不再写入，commit 失败并在后续周期重试。  
- 严重性：**高**
- 风险：  
  影响流式摄入连续性，可能引发数据延迟或积压。  
- 当前 fix PR：**未看到对应 PR**

### P1：AppendFiles + PartitionedFanoutWriter 写后扫描失败
- Issue：`#13973`
- 链接：apache/iceberg Issue #13973
- 状态：OPEN
- 场景：Spark 3.5.1 / Iceberg 1.5.2
- 严重性：**高**
- 风险：  
  触及核心写读正确性。  
- 当前 fix PR：**未看到对应 PR**

### P2：S3FileIO 长时间运行后连接池关闭
- Issue：`#13863`
- 链接：apache/iceberg Issue #13863
- 状态：OPEN
- 场景：PySpark Structured Streaming + S3
- 严重性：**中高**
- 风险：  
  典型生产稳定性问题，尤其影响长跑 streaming job。  
- 当前 fix PR：**未看到对应 PR**

### P2：GCSFileIO TCP 连接数爆炸
- Issue：`#15411`
- 链接：apache/iceberg Issue #15411
- 状态：OPEN
- 严重性：**中高**
- 风险：  
  影响 MERGE/分区维护场景的连接资源与网络稳定性。  
- 当前 fix PR：**未看到直接修复 PR**

### P3：GCS 读取缺少 connection/read timeout 配置
- Issue：`#15587`
- 链接：apache/iceberg Issue #15587
- 状态：OPEN
- 严重性：**中**
- 风险：  
  更多是可运维性和异常恢复能力不足。  
- 当前 fix PR：**未看到对应 PR**

### P3：JdbcCatalog / JdbcUtil 资源泄漏修复在途
- PR：`#15463`
- 链接：apache/iceberg PR #15463
- 状态：OPEN
- 说明：  
  这是一个正向信号。虽然不是今天新报 bug，但 JDBC catalog 资源释放问题已进入修复阶段，属于**稳定性治理**的一部分。

---

## 6. 功能请求与路线图信号

### 1) V4 Manifest / single-file commit 基础设施正在成形
- PR：`#15049`, `#14533`
- 链接：apache/iceberg PR #15049 / apache/iceberg PR #14533
- 信号判断：**强**
- 含义：  
  Iceberg 正在持续推进下一代元数据组织与提交路径，这很可能是未来版本最重要的底层能力之一。

### 2) Spark/Flink/Kafka Connect 对 Variant 类型支持持续扩展
- PR：`#14297`, `#15471`, `#15283`
- 链接：apache/iceberg PR #14297 / apache/iceberg PR #15471 / apache/iceberg PR #15283
- 信号判断：**强**
- 含义：  
  Variant 正从 API/格式层走向多引擎落地：
  - Spark 写 shredded variant
  - Flink SQL 侧动态 Avro record generator
  - Kafka Connect record convert 支持 Variant  
- 判断：  
  **半结构化数据支持**已成为 Iceberg 新一轮能力扩张的重要主线。

### 3) 云存储 I/O 优化需求升温
- Issues：`#15353`, `#15411`, `#15587`
- 链接：apache/iceberg Issue #15353 / apache/iceberg Issue #15411 / apache/iceberg Issue #15587
- 信号判断：**强**
- 含义：  
  社区对 HadoopFileIO、GCSFileIO、S3FileIO 的期望，已从“能用”升级为：
  - 降低 HEAD 请求
  - 更好利用 cloud connector
  - 支持连接池和 timeout 调优
- 判断：  
  这类优化**很可能逐步纳入后续版本**，因为它们直接关系到云上成本与稳定性。

### 4) Flink 数据重写优化能力仍有明显缺口
- Issue：`#13928`
- 链接：apache/iceberg Issue #13928
- 信号判断：**中**
- 含义：  
  用户希望 Flink 拥有 Spark 类似的 z-order / sort order 重写能力。  
- 判断：  
  这类能力有价值，但实现复杂、优先级可能低于核心稳定性和元数据演进。

### 5) REST / OpenAPI 正在持续正规化
- PR：`#15450`, `#14677`
- 链接：apache/iceberg PR #15450 / apache/iceberg PR #14677
- 信号判断：**中强**
- 含义：  
  REST catalog 正朝更通用、更标准化的方向演进，尤其是 **S3 signing endpoint 主规格化**，有利于未来扩展到更多云存储后端。

---

## 7. 用户反馈摘要

### 真实痛点 1：生产环境更关心“长期稳定运行”，而非单次成功
来自 `#13593`、`#13863`、`#15411` 的反馈表明，用户最痛的问题不是功能缺失，而是：
- 流式/周期性任务运行数小时或数天后失败
- 连接池、TCP 连接数、重试策略不可控
- 出现错误时难以快速定位是 FileIO、Catalog、Commit 还是 Connector 问题

### 真实痛点 2：连接器与路由逻辑的“数据正确性”要求很高
来自 `#15584` 的反馈非常典型：  
在 Kafka Connect 多 topic 多表场景中，用户默认期待严格隔离；一旦 schema 相同就出现“全写入全表”的行为，会直接破坏下游分析可信度。  
这说明社区对连接器的要求已经从“吞吐优先”转向“**正确性与可验证性优先**”。

### 真实痛点 3：高级写入 API 的边界行为仍不够稳
`#13973` 暗示对于直接使用 Iceberg API 的高级用户，自定义 writer / append 路径仍可能踩到兼容性或元数据组织问题。  
这类用户通常是平台团队、CDC 框架开发者，他们对：
- API 行为文档
- 示例代码
- 低层 writer 契约稳定性  
有更高要求。

### 真实痛点 4：Flink 用户希望获得与 Spark 接近的优化能力
`#13928` 和 `#13919` 反映出 Flink 侧用户已经不满足于基础读写能力，而在追求：
- locality-aware split assignment
- rewrite files 的排序优化
- 更细粒度参数暴露  
这说明 Flink 生态正在从“接入阶段”进入“深度优化阶段”。

---

## 8. 待处理积压

以下为值得维护者优先关注的长期或反复活跃项：

### 1) `#13593` 元数据写入随机停止
- 链接：apache/iceberg Issue #13593
- 原因：评论数最高，问题持续时间长，且明显影响生产摄入可靠性。

### 2) `#13973` AppendFiles + PartitionedFanoutWriter 扫描异常
- 链接：apache/iceberg Issue #13973
- 原因：涉及底层 API 正确性，且仍处于 OPEN 状态。

### 3) `#13928` Flink rewrite file 支持 z-order
- 链接：apache/iceberg Issue #13928
- 原因：代表 Flink 性能优化诉求，但目前看推进较慢。

### 4) `#13863` S3FileIO connection pool shut down
- 链接：apache/iceberg Issue #13863
- 原因：与生产流式作业稳定性直接相关，建议尽快确认是否与 AWS SDK 生命周期、共享客户端关闭时机有关。

### 5) `#15122` AWS: Add support for configuring custom S3 MetricPublisher
- 链接：apache/iceberg PR #15122
- 原因：虽然是 stale 状态，但对云上可观测性价值较高，且有助于排查现有 S3FileIO 稳定性问题。

### 6) `#14677` REST: Align expression schema with ExpressionParser
- 链接：apache/iceberg PR #14677
- 原因：REST/OpenAPI 兼容性问题若长期悬而未决，会影响外部实现和客户端代码生成。

### 7) `#14533` [WIP] V4 Manifest Read Support
- 链接：apache/iceberg PR #14533
- 原因：这是路线级工作，建议持续投入 reviewer 资源，避免关键基础设施长期停留在 WIP。

---

## 总体判断

Apache Iceberg 今日整体健康度表现为：**开发活跃、方向清晰，但生产稳定性问题仍需加强收敛**。  
从 PR 结构看，项目正同时推进三条主线：

1. **底层元数据架构升级**：V4 manifest / single-file commit  
2. **多引擎能力增强**：Spark 4.1、Flink SQL、Kafka Connect、Variant 支持  
3. **云存储生产可用性提升**：S3/GCS/HadoopFileIO 的性能、连接池、超时与资源管理  

短期建议维护者优先聚焦：
- Kafka Connect 路由错误这类**数据正确性问题**
- S3/GCS 连接池与 timeout 这类**生产稳定性问题**
- V4 manifest 相关 PR 的评审推进，以巩固中长期演进主线。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报 · 2026-03-12

## 1. 今日速览

过去 24 小时，Delta Lake 保持较高开发活跃度：**1 条 Issue 更新、33 条 PR 更新**，其中 **22 条仍待合并，11 条已合并或关闭**。  
从变更主题看，今天的重点非常集中在 **Kernel / kernel-spark 的 DSv2 读路径能力补齐**、**Unity Catalog（UC）管理表约束增强**，以及 **版本线切换到 4.2.0-SNAPSHOT**。  
新增 Issue 数量不多，但唯一新增问题直接指向 **Java Kernel 数据跳过（data skipping）的大小写敏感缺陷**，属于典型的查询正确性/裁剪有效性问题，值得优先关注。  
整体来看，项目处于 **高频迭代、以基础设施和兼容性增强为主** 的状态，健康度较好，但也显示出 **Kernel 与 Spark/协议语义对齐** 仍是当前主线工作。

---

## 2. 项目进展

### 已关闭/完成的重要 PR

#### 2.1 UC staged replace handoff support
- **PR**: #6251 [CLOSED] Add UC staged replace handoff support  
- **链接**: delta-io/delta PR #6251

该 PR 关闭表明，围绕 **Unity Catalog 下 staged replace / 原子替换表流程** 的一段能力链路已经推进完成。结合近期同一作者关于 staging catalog、UC managed table、schema 传递等改动来看，这属于 **原子化建表/替换（尤其是 RTAS/CTAS 类流程）** 的连续性工作。  
技术意义在于：
- 提升 UC 托管场景下元数据交接的一致性；
- 为 Spark catalog / staging catalog 与 UC 服务端的交互打基础；
- 有助于减少“本地成功、服务端状态不一致”的 catalog 管理风险。

---

#### 2.2 Send table schema to UC server when creating managed tables
- **PR**: #6204 [CLOSED] [Spark] Send table schema to UC server when creating managed tables  
- **链接**: delta-io/delta PR #6204

这是今天较有实际落地价值的一项关闭项。该改动意味着在 **创建 UC 托管表** 时，Delta Spark 会显式向 UC 服务端发送 schema。  
推进点包括：
- 强化 **UC 侧元数据完整性**；
- 避免 managed table 创建时，客户端与服务端对 schema 认知不一致；
- 为后续 **CatalogOwned 表元数据变更限制** 提供基础约束。

这类改动通常直接改善企业用户在统一治理场景下的可预测性，尤其是多引擎、多 catalog 并存的环境。

---

#### 2.3 [kernel-spark] Support excludeRegex readOption in DSV2
- **PR**: #6088 [CLOSED] [kernel-spark] Support excludeRegex readOption in DSV2  
- **链接**: delta-io/delta PR #6088

该 PR 的关闭说明 **DSv2 读选项兼容性补齐** 正在持续推进。`excludeRegex` 这类读选项对增量读取、历史文件过滤、运维排障都较实用。  
其价值在于：
- 让 kernel-spark 的 DSV2 路径更接近传统 Spark Delta 读行为；
- 降低迁移到 DSv2 时的行为差异；
- 为后续一组 read option PR（`ignoreDeletes` / `skipChangeCommits` / `ignoreChanges` / `ignoreFileDeletion`）提供先例。

---

#### 2.4 Add StringStartsWith filter pushdown to ExpressionUtils
- **PR**: #6104 [CLOSED] [kernel-spark] [Spark] Add StringStartsWith filter pushdown to ExpressionUtils  
- **链接**: delta-io/delta PR #6104

这是一个典型的 **查询优化 / 谓词下推能力增强**。支持 `StringStartsWith` 下推后，读取层能更早裁剪数据，减少扫描量。  
对应收益：
- 提升带前缀过滤条件查询的性能；
- 改善 Spark 与 kernel-spark 在 filter 表达能力上的一致性；
- 对日志型、分区外字符串列过滤的场景尤其有帮助。

---

#### 2.5 [Spark] Improve Error Handling for NullType in UDTs
- **PR**: #6254 [CLOSED] [Spark] Improve Error Handling for NullType in UDTs  
- **链接**: delta-io/delta PR #6254

虽然是关闭而非明确合并，但从内容看它瞄准的是 **写入时对 UDT 中 NullType 的错误处理增强**。  
这反映出社区正在继续收紧 **非法/临时类型写入 Delta** 的边界，避免：
- schema 持久化出现不可预期类型；
- 与数组/Map 中 NullType 禁止规则不一致；
- 运行时才暴露更难诊断的问题。

即使未进入主线，这也体现出维护者对 **schema 正确性与错误可诊断性** 的持续关注。

---

#### 2.6 README 增补 Java 版本要求
- **PR**: #6211 [CLOSED] [WIP] Add required java version into README.md  
- **链接**: delta-io/delta PR #6211

这是文档类关闭项，本身技术影响较小，但反映出：
- Java 版本要求可能已成为社区常见安装/构建问题；
- 依赖矩阵与运行环境约束正在变复杂；
- 文档清晰度依旧是降低用户接入门槛的重要部分。

---

## 3. 社区热点

> 注：提供的数据中评论数均未给出具体数值，因此这里按“近期集中更新、技术影响面广”的议题判定热点。

### 热点 1：Kernel / DSv2 读选项能力集中补齐
相关 PR：
- #6245 [OPEN] [kernel-spark] Support read option `ignoreDeletes` in dsv2  
- #6246 [OPEN] [kernel-spark] Support `skipChangeCommits` read option in dsv2  
- #6249 [OPEN] [kernel-spark] Support `ignoreChanges` read option in dsv2  
- #6250 [OPEN] [kernel-spark] Support `ignoreFileDeletion` read option in dsv2  
- 链接：delta-io/delta PR #6245 / #6246 / #6249 / #6250

这是今天最明确的热点方向。多个 stacked PR 同时推进，说明维护者在系统性补齐 **DSv2 读取语义与 legacy/现有 Delta 读取行为** 的差距。  
背后的技术诉求很清晰：
- 用户希望在 DSv2 路径下保留现有 read option 行为；
- 增量处理、CDC 邻近场景、忽略删除/变更提交等语义需要保持兼容；
- kernel-spark 正在从“可运行”走向“可替代/可迁移”。

这组 PR 很可能会持续成为未来几天的主线。

---

### 热点 2：UC 托管表与 CatalogOwned 元数据边界收紧
相关 PR：
- #6243 [OPEN] [Spark] Block metadata changes on UC-managed CatalogOwned tables  
- #6204 [CLOSED] [Spark] Send table schema to UC server when creating managed tables  
- #6166 [OPEN] [Delta-Spark] Extend stagingCatalog for non-Spark session catalog  
- #6251 [CLOSED] Add UC staged replace handoff support  
- 链接：delta-io/delta PR #6243 / #6204 / #6166 / #6251

这组改动显示，Delta 在 **Unity Catalog 托管模式** 下正进一步强化“谁拥有元数据、谁有权修改”的治理模型。  
核心诉求包括：
- 防止 CatalogOwned 表发生“本地改了、服务端没改”的漂移；
- 支持更复杂的 staged catalog / 非 Spark session catalog 场景；
- 将托管表控制权进一步上收至 catalog/服务端。

对企业用户来说，这是治理一致性增强；对开发者来说，则意味着更多操作将受到 UC 约束，某些此前可行的元数据修改路径可能被明确禁止。

---

### 热点 3：统计信息与分区报告能力增强
相关 PR：
- #6203 [OPEN] [kernel-spark] Populate catalog stats in DSv2 scan (#5952)  
- #6224 [OPEN] [Spark] Implement SupportsReportPartitioning in DSv2 SparkScan  
- #5888 [OPEN] Add a flag to force stats collection during query optimizations  
- 链接：delta-io/delta PR #6203 / #6224 / #5888

这组工作聚焦 **优化器可见性**：
- 让 DSv2 scan 传递 catalog stats；
- 让 Spark 利用输出分区信息做 shuffle elimination 等优化；
- 探索在优化阶段强制采集统计信息。

背后反映的是 Delta 正在持续提升 **成本模型输入质量**，以便 Spark 在 join、scan、shuffle 规划上做出更优决策。  
这类改动短期不一定用户强感知，但长期对大表分析性能非常关键。

---

## 4. Bug 与稳定性

### P1：Java Kernel 数据跳过使用大小写敏感列匹配，违反协议语义
- **Issue**: #6247 [OPEN] [bug, good first issue] fix: Java Kernel data skipping uses case-sensitive column matching  
- **链接**: delta-io/delta Issue #6247

**问题描述**：  
Delta 协议要求列名大小写不敏感，但 Java Kernel 在 data skipping 路径中解析谓词列引用时，似乎采用了 **大小写敏感匹配**。这与 Delta Spark 的 `findNestedFieldIgnoreCase` 行为不一致。

**潜在影响**：
- 数据跳过可能失效，导致扫描范围扩大、性能下降；
- 在某些场景下可能影响谓词解析的正确性，造成行为与 Spark 不一致；
- 暴露出 Kernel 对协议实现与 Spark 主实现之间仍有偏差。

**严重程度判断**：高。  
原因是该问题触及 **协议一致性 + 查询裁剪正确性/有效性**，尤其在混合大小写 schema、嵌套字段、跨语言引擎接入场景下风险更大。

**是否已有 fix PR**：  
当前提供数据中**未看到直接对应的修复 PR**。由于该 Issue 带有 `good first issue`，维护者可能认为修复边界明确，但尚未进入代码修复阶段。

---

### P2：UC 托管 CatalogOwned 表元数据变更本地成功但服务端漂移风险
- **PR**: #6243 [OPEN] [Spark] Block metadata changes on UC-managed CatalogOwned tables  
- **链接**: delta-io/delta PR #6243

虽然这是一个功能/约束 PR，但其摘要明确指出：如果不阻止相关元数据修改，**CatalogOwned 表上的 metadata mutation 会在本地成功，却使远端状态失配**。  
这类问题本质上属于 **一致性与稳定性隐患**，可能导致：
- 元数据源不一致；
- 后续查询或管理操作异常；
- catalog 层审计与实际表状态偏离。

**严重程度判断**：中高。  
因为它不是单次 crash，而是治理面的一致性风险，企业场景影响更大。  
**是否已有 fix PR**：有，#6243 正在处理中。

---

### P3：UDT 中 NullType 写入的错误边界仍在收敛
- **PR**: #6254 [CLOSED] [Spark] Improve Error Handling for NullType in UDTs  
- **链接**: delta-io/delta PR #6254

该议题说明在 Spark 写入 Delta 时，**UDT 包含 NullType** 仍可能带来不清晰或不统一的行为。虽然本 PR 已关闭，但问题本身提示：
- Delta 仍在完善非法 schema 的提前阻断；
- 用户在复杂类型、临时推断 schema、UDAF/UDT 扩展场景中可能踩坑。

**严重程度判断**：中。  
主要影响开发体验与 schema 健壮性，不属于系统性 crash，但对复杂数据管道较关键。  
**是否已有 fix PR**：该 PR 已关闭，后续是否重提需继续观察。

---

## 5. 功能请求与路线图信号

### 5.1 Kernel 在 Decimal 隐式转换上的 SQL/表达式兼容性增强
- **PR**: #6257 [OPEN] [Kernel] Support implicit cast between DECIMAL types with different precisions  
- **链接**: delta-io/delta PR #6257

该 PR 显示 Kernel 正在补足 **不同精度 DECIMAL 之间的隐式类型转换**。  
这通常是表达式求值、过滤、投影、谓词推导等环节的基础能力，意味着：
- Kernel 在 SQL 语义兼容性上继续向 Spark 靠拢；
- 精度/scale 差异导致的表达式失败会减少；
- 对金融、计费、指标汇总类工作负载更友好。

**纳入下一版本概率：高。**  
因为这是低层表达式兼容能力，且变更边界相对可控。

---

### 5.2 DSv2 读路径有望在下一版本显著完善
相关 PR：
- #6245 / #6246 / #6249 / #6250  
- 链接：delta-io/delta PR #6245 / #6246 / #6249 / #6250

这些 stacked PR 强烈暗示：**kernel-spark 的 DSv2 读选项支持** 很可能是下一版本的重点之一。  
若这组改动陆续合入，下一版本可预期收益包括：
- legacy 读选项向 DSv2 平滑迁移；
- 提高 CDC/变更日志邻近场景兼容性；
- 降低用户切换新读路径的功能缺口。

**纳入下一版本概率：高。**

---

### 5.3 优化器统计与分区信息增强是中期路线
相关 PR：
- #6203、#6224、#5888  
- 链接：delta-io/delta PR #6203 / #6224 / #5888

这些 PR 指向一个中期方向：让 Delta 在 DSv2 + Spark 优化器中提供更丰富的 **statistics / partitioning metadata**。  
这说明项目不仅在补“能不能跑”，也在补“能不能跑快”。  
**纳入下一版本概率：中高。**  
其中 #6203、#6224 更贴近工程主线；#5888 属于较长期的优化开关诉求。

---

### 5.4 主分支已切到 4.2.0-SNAPSHOT
- **PR**: #6256 [OPEN] Change master version to 4.2.0-SNAPSHOT  
- **链接**: delta-io/delta PR #6256

尽管今天没有正式 release，但这个版本号切换是明显路线图信号：  
**主分支开发已开始面向 4.2.0**。  
这通常意味着：
- 当前一批 Kernel/DSv2/UC 相关工作，存在进入 4.2.0 周期的可能；
- 维护者对新一轮功能窗口已经开启；
- 未来数周可能会看到更集中、成组的基础设施 PR。

---

## 6. 用户反馈摘要

基于今天唯一新增 Issue 与多条 PR 摘要，可提炼出以下用户痛点：

### 6.1 用户希望 Kernel 严格遵守 Delta 协议，而不是“近似兼容”
- 代表链接：delta-io/delta Issue #6247

大小写不敏感是 Delta 协议中的基本约束。用户对 #6247 的反馈说明，**只要 Kernel 在解析、裁剪、谓词匹配上与 Spark 存在差异，就会被快速感知**。  
这类反馈背后反映的是：
- Java Kernel 已进入被实际使用、并与 Spark 行为对照验证的阶段；
- 用户关注的不只是功能存在，更关注协议级一致性；
- “同一张 Delta 表在不同引擎上结果/性能应一致”已成为核心期待。

---

### 6.2 企业用户正在更深入地使用 UC 托管与多 catalog 场景
- 代表链接：delta-io/delta PR #6243 / #6166 / #6204 / #6251

多条 PR 围绕 UC 托管表、CatalogOwned、stagingCatalog 展开，说明真实用户场景已不再局限于单机 Spark 读写，而是：
- 需要与 UC 服务端强一致协作；
- 需要支持非默认 session catalog；
- 需要原子替换/托管元数据交接等企业治理能力。

这表明 Delta Lake 的用户群体里，**平台型、治理型、云环境集成型** 的需求占比正在上升。

---

### 6.3 用户在迁移到 DSv2 路径时最关心“行为不要变”
- 代表链接：delta-io/delta PR #6245 / #6246 / #6249 / #6250 / #6088

今天围绕 DSV2 的多个 read option PR，清楚反映了一个现实问题：  
用户并不只想要 DSv2 的新接口，他们更希望：
- 老参数还能用；
- 老语义不变；
- 增量/容错/变更读取场景继续稳定运行。

这是典型的生产迁移诉求，说明维护者正在优先处理 **兼容性债务**。

---

## 7. 待处理积压

以下是值得维护者持续关注的长期或较长时间未完结项：

### 7.1 强制统计信息采集开关
- **PR**: #5888 [OPEN] Add a flag to force stats collection during query optimizations  
- **创建时间**: 2026-01-20  
- **最近更新**: 2026-03-11  
- **链接**: delta-io/delta PR #5888

这是一个已存在较长时间的性能优化类 PR。  
若该能力设计合理，可帮助优化器在统计信息不足时获得更稳定决策，但也可能引入额外开销。建议维护者尽快明确：
- 适用场景；
- 默认行为；
- 与自动统计策略的关系。

---

### 7.2 PrepareDeltaScan 中 V2WriteCommand fallback 判定改进
- **PR**: #5804 [OPEN] [SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan  
- **创建时间**: 2026-01-08  
- **最近更新**: 2026-03-11  
- **链接**: delta-io/delta PR #5804

该 PR 已积压两个月以上，且涉及 **Spark V2/V1 fallback 判断正确性**，属于兼容性较敏感区域。  
它关联的问题通常比较隐蔽：
- 不同表类型/写路径误判；
- Delta 之外数据源的 V2 fallback 处理不当；
- 查询计划阶段出现非预期假设。

建议提高关注优先级，避免后续 DSv2 推进时留下行为歧义。

---

### 7.3 UC Commit Metrics 系列 PR 仍在堆栈推进中
- **PR**: #6155 [OPEN] [UC Commit Metrics] Add skeleton transport wiring and smoke tests  
- **PR**: #6156 [OPEN] [UC Commit Metrics] Add full payload construction and schema tests  
- **创建时间**: 2026-02-27  
- **最近更新**: 2026-03-11  
- **链接**: delta-io/delta PR #6155 / #6156

这组 PR 若长期停留在 stack 状态，可能导致：
- UC commit metrics 能力迟迟无法形成闭环；
- 监控/审计/可观测性能力延后；
- 与 UC 生态相关的后续功能被阻塞。

建议维护者尽快给出合入路径或拆分策略。

---

### 7.4 stagingCatalog 扩展仍待收敛
- **PR**: #6166 [OPEN] [Delta-Spark] Extend stagingCatalog for non-Spark session catalog  
- **创建时间**: 2026-03-02  
- **最近更新**: 2026-03-12  
- **链接**: delta-io/delta PR #6166

该 PR 与近期多个 UC/staged replace 相关改动有关，说明这是一个正在推进但尚未完全收口的架构性工作。  
如果这一层长期悬而未决，可能影响：
- 原子替换能力在非默认 catalog 下的完整性；
- catalog 抽象的一致性；
- 后续 UC/企业治理功能的扩展节奏。

---

## 8. 健康度判断

**总体健康度：良好，偏积极。**

理由：
- PR 更新量高，说明核心维护活跃；
- 工作主题清晰，集中在 **Kernel/DSv2/UC** 三条主线；
- 已有若干围绕 UC 和 DSV2 的能力关闭/推进，表明路线在持续落实；
- 唯一新增 Issue 虽然涉及协议一致性，但问题边界明确、可复现，且属于典型可修复缺陷。

**主要风险点**：
- Kernel 与 Spark 在协议/表达式/读语义上的细节偏差仍在暴露；
- UC 托管场景下的元数据所有权与修改边界需要继续收紧；
- 多个 stacked PR 并行推进，若审阅节奏不足，可能增加合并与回归风险。

---

如果你愿意，我还可以继续把这份日报整理成更适合内部周报流转的格式，比如：
1. **管理层摘要版（更短）**
2. **研发跟踪版（按模块分组）**
3. **表格版 Markdown / 飞书文档版**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-12）

## 1. 今日速览

过去 24 小时 Databend 保持了较高活跃度：Issues 更新 9 条、PR 更新 15 条，且有多条问题在“提出—修复—关闭”链路中快速流转，显示出较强的维护响应能力。  
今天的主题集中在 **SQL 兼容性修复、查询执行正确性、测试/CI 稳定性、以及查询引擎内部重构**。  
从问题分布看，新增用户反馈主要聚焦于 **标识符大小写语义、JOIN 正确性、内建函数解析一致性**，这些都直接影响 SQL 使用体验与生产稳定性。  
整体健康度偏积极：关闭 Issues 6 条、关闭/合并 PR 5 条，没有新版本发布，但主干正在持续消化兼容性与执行层风险。  

---

## 3. 项目进展

### 已关闭/推进的重要 PR

#### 1) 支持未加引号的 Unicode / CJK 标识符与别名
- PR: [#19526](https://github.com/databendlabs/databend/pull/19526)  
- 关联 Issue: [#19522](https://github.com/databendlabs/databend/issues/19522)

该修复解决了 `AS 中文` 这类未加引号 Unicode 别名无法使用的问题，提升了 Databend 对国际化 SQL 标识符的兼容性。  
这类改动虽小，但影响面广，直接关系到中文场景、BI 工具生成 SQL、以及多语言数据团队的可用性。  
从摘要看，修复不仅放宽 lexer 对 Unicode alphabetic 的接受，还统一了 lexer 与 quote/display 规则，说明团队在做的是 **一致性修复**，不是单点补丁。

---

#### 2) 修复 `try_to_timestamp` 在非法秒值时抛错而非返回 NULL
- PR: [#19527](https://github.com/databendlabs/databend/pull/19527)  
- 关联 Issue: [#19525](https://github.com/databendlabs/databend/issues/19525)

这是一个典型的 SQL 语义正确性修复。`TRY_` 前缀函数的核心语义应是“失败返回 NULL，不中断查询”，此前 Databend 在 seconds > 59 时抛出硬错误，与用户预期不符。  
该修复有助于提升 Databend 在脏数据摄入、半结构化解析、ELT 场景下的容错性，尤其适合日志和多源异构数据清洗流程。

---

#### 3) 修复 `MERGE INTO` unmatched 分支 panic
- PR: [#19529](https://github.com/databendlabs/databend/pull/19529)  
- 关联问题说明: fixes #16885

该 PR 解决了 `MERGE INTO` 在 unmatched clause 下的 panic，属于执行计划绑定/表达式依赖收集层面的稳定性修复。  
摘要显示修复点包括：
- 将 unmatched 条件和值表达式绑定到 `mutation_input_schema`
- 将 unmatched 引用列纳入 required set

这意味着 Databend 正在补足复杂 DML 场景中的 schema 绑定严谨性，对湖仓写入、批量 upsert 和 CDC 合并类任务是积极信号。

---

#### 4) 修复测试稳定性与 CI 环境
- PR: [#19531](https://github.com/databendlabs/databend/pull/19531)  
- PR: [#19540](https://github.com/databendlabs/databend/pull/19540)

`#19531` 修复 `test_sync_agg_index`，`#19540` 则升级 Go 版本以修复 CI 错误。  
虽然这类改动不是用户可见功能，但反映出团队在持续清理工程侧噪音，降低回归检测盲区。对 Databend 这种执行引擎复杂、测试矩阵庞大的项目来说，CI 健康度就是发布节奏的基础设施。

---

### 今日仍在推进的关键 PR

#### 5) 修复内建函数名被 `unquoted_ident_case_sensitive` 错误影响
- PR: [#19537](https://github.com/databendlabs/databend/pull/19537)  
- 对应 Issue: [#19536](https://github.com/databendlabs/databend/issues/19536)

该 PR 目标明确：无论用户是否开启 `unquoted_ident_case_sensitive=1`，**内建函数名都应保持大小写不敏感**。  
这是一项重要的 SQL 兼容性修复，避免会话级配置污染系统函数解析和内部查询行为。

---

#### 6) 修复新 Hash Join 在 build side 为空时 LEFT JOIN 投影错误
- PR: [#19539](https://github.com/databendlabs/databend/pull/19539)  
- 对应 Issue: [#19533](https://github.com/databendlabs/databend/issues/19533)

这是今天最值得关注的执行正确性问题之一。  
问题发生于 `enable_experimental_new_join = 1` 时，LEFT JOIN 在 build side 为空时出现 schema / `DataBlock` 列顺序错位，在分布式执行中可进一步引发 Arrow / Flight 反序列化失败。  
修复 PR 已提交，说明维护者对实验性 Join 路径的回归处理速度较快。

---

#### 7) 查询引擎和 Planner 持续重构
- [#19538](https://github.com/databendlabs/databend/pull/19538) `refactor(expression): simplify filter and lambda evaluation`
- [#19505](https://github.com/databendlabs/databend/pull/19505) `refactor(query): refactor hash shuffle`
- [#19523](https://github.com/databendlabs/databend/pull/19523) `refactor(planner): improve consistency of column references and rewrites`
- [#19532](https://github.com/databendlabs/databend/pull/19532) `fix(planner): decorrelate correlated scalar subquery limit`
- [#19530](https://github.com/databendlabs/databend/pull/19530) `feat(query): Runtime Filter support spatial index join`

这些 PR 表明主线工作仍在围绕：
- 表达式执行路径去重
- 分布式 hash shuffle 重构
- planner 中列引用与 rewrite 机制标准化
- 相关子查询 decorrelation
- runtime filter 与 spatial index join 结合

这批工作具有明显的“**下一阶段查询优化能力建设**”特征。

---

## 4. 社区热点

### 热点 1：内建函数名大小写敏感性配置误伤系统行为
- Issue: [#19536](https://github.com/databendlabs/databend/issues/19536)
- PR: [#19537](https://github.com/databendlabs/databend/pull/19537)

这是今天最有代表性的 SQL 语义问题。  
用户诉求并不是简单的“大小写支持”，而是 **配置边界清晰**：`unquoted_ident_case_sensitive` 应只影响用户标识符，而不应改变 built-in functions 或 system internals 的解析规则。  
这背后反映的是 Databend 正在面对越来越复杂的“兼容性期望”——用户不仅要功能可用，还要求行为与主流数据库一致、可预测。

---

### 热点 2：实验性新 Join 路径的正确性风险
- Issue: [#19533](https://github.com/databendlabs/databend/issues/19533)
- PR: [#19539](https://github.com/databendlabs/databend/pull/19539)

该问题虽暂无评论堆积，但技术严重性高。  
它涉及：
- LEFT JOIN 输出投影错误
- 空 build side 的边界条件
- 分布式执行中的 Arrow / Flight 反序列化失败

这说明 Databend 新 Join 实现正在加速演进，但实验特性仍需更多边界测试覆盖。对生产用户而言，如果已开启实验性参数，应重点关注此类 correctness 风险。

---

### 热点 3：测试基础设施与 sqllogictest 体系调整
- PR: [#19528](https://github.com/databendlabs/databend/pull/19528)

将 `sqllogictest` 抽取到独立仓库，说明团队有意重组测试资产，降低主仓库耦合度。  
这通常意味着：
- 更便于独立维护测试语料
- 更清晰地复用 SQL 兼容性回归集
- 为后续更大规模的执行引擎演进腾出工程空间

这是典型的“非功能性但战略意义强”的基础设施信号。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：新 Hash Join 在 LEFT JOIN + 空 build side 下结果投影错误
- Issue: [#19533](https://github.com/databendlabs/databend/issues/19533)
- Fix PR: [#19539](https://github.com/databendlabs/databend/pull/19539)
- 状态：**已报错，已有修复 PR**

影响查询正确性，并可能在分布式链路中触发 Flight 反序列化失败。  
如果用户启用了 `enable_experimental_new_join = 1`，建议优先关注并验证修复。

---

### P1：`unquoted_ident_case_sensitive` 错误影响内建函数和系统内部查询
- Issue: [#19536](https://github.com/databendlabs/databend/issues/19536)
- Fix PR: [#19537](https://github.com/databendlabs/databend/pull/19537)
- 状态：**新增，已有修复 PR**

这是典型的系统级语义污染问题。  
风险不只在用户 SQL，还可能波及内部 system query，因此优先级较高。

---

### P2：链接检查报告出现错误
- Issue: [#19535](https://github.com/databendlabs/databend/issues/19535)
- 状态：**开放**

自动化报告显示 98 个检查项中 1 个错误。  
这不影响核心执行引擎，但会影响文档质量、开发者体验以及外部引用可信度，属于低风险运维/文档健康问题。

---

### 已关闭稳定性问题回顾

#### `try_to_timestamp` 非法输入抛错
- Issue: [#19525](https://github.com/databendlabs/databend/issues/19525)
- PR: [#19527](https://github.com/databendlabs/databend/pull/19527)
- 状态：**已关闭**

#### `AS` 别名不支持未加引号 Unicode/CJK 标识符
- Issue: [#19522](https://github.com/databendlabs/databend/issues/19522)
- PR: [#19526](https://github.com/databendlabs/databend/pull/19526)
- 状态：**已关闭**

#### 历史缺陷清理：ORC stage 查询/导入异常
- Issue: [#16068](https://github.com/databendlabs/databend/issues/16068)
- 状态：**已关闭**

#### 历史缺陷清理：重复 Prometheus 指标
- Issue: [#17948](https://github.com/databendlabs/databend/issues/17948)
- 状态：**已关闭**

#### 历史缺陷清理：`vacuum table` 断言失败
- Issue: [#13995](https://github.com/databendlabs/databend/issues/13995)
- 状态：**已关闭**

这些老问题被关闭，说明维护者在持续做 backlog 消化，尤其覆盖了对象存储格式接入、可观测性和表维护命令稳定性。

---

## 6. 功能请求与路线图信号

今天没有非常明确的新“用户功能需求 issue”，但从开放 PR 可以看到较强的路线图信号：

### 1) Runtime Filter 支持 spatial index join
- PR: [#19530](https://github.com/databendlabs/databend/pull/19530)

这是今天最明确的功能增强信号。  
如果该 PR 顺利推进，意味着 Databend 不仅在做传统 OLAP join 优化，还在尝试将 **runtime filter 与空间索引 join** 结合，属于更高阶的查询优化能力。  
这可能面向 GIS/地理位置分析、空间检索增强场景，是值得重点关注的中期特性。

---

### 2) Planner 对相关标量子查询 `LIMIT` 的 decorrelation
- PR: [#19532](https://github.com/databendlabs/databend/pull/19532)

虽然名义上是 bugfix，但实质上会提升复杂 SQL 的可支持范围和执行可靠性。  
尤其 `ORDER BY ... LIMIT` + correlated scalar subquery 这类查询，是很多 BI/分析 SQL 自动生成器常见模式。  
这类能力增强通常会被用户感知为“兼容性提升”。

---

### 3) 表达式与 lambda 执行路径统一
- PR: [#19538](https://github.com/databendlabs/databend/pull/19538)

该重构可能为数组/Map 高阶函数的稳定性和性能优化铺路。  
如果后续配套出现更多 collection functions 或 lambda 相关修复，说明 Databend 正在加强半结构化与复杂表达式处理能力。

---

### 4) table branch/tag 实现调整
- PR: [#19499](https://github.com/databendlabs/databend/pull/19499)
- PR: [#19534](https://github.com/databendlabs/databend/pull/19534)

一个在做 table branch refactor，一个在移除 legacy table branch/tag 实现。  
这通常意味着相关能力正在经历设计收敛，短期内可能不会作为对外大特性宣传，但中期可能为更清晰的数据版本管理模型做准备。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 内容，可以提炼出几类真实用户痛点：

### 1) 用户希望 SQL 行为“可预测且与主流数据库一致”
- 代表问题：
  - [#19536](https://github.com/databendlabs/databend/issues/19536)
  - [#19525](https://github.com/databendlabs/databend/issues/19525)
  - [#19522](https://github.com/databendlabs/databend/issues/19522)

用户不只是要求“有这个功能”，更关心：
- 配置是否只影响应影响的对象
- `TRY_` 语义是否真的容错
- Unicode 标识符是否与现代 SQL 工具链兼容

这说明 Databend 已进入“细节兼容性打磨期”。

---

### 2) 实验性执行路径已被真实用户或维护者用在较深入场景
- 代表问题：
  - [#19533](https://github.com/databendlabs/databend/issues/19533)

新 Join 实现暴露在分布式 Arrow/Flight 链路上的错误，表明测试和使用已不再停留于简单单机查询，而是进入真实分布式执行场景。  
这对项目是积极信号，但也意味着实验特性需要更系统的 correctness guardrail。

---

### 3) 老问题关闭显示用户场景覆盖面较广
- ORC from object storage: [#16068](https://github.com/databendlabs/databend/issues/16068)
- duplicated prometheus metrics: [#17948](https://github.com/databendlabs/databend/issues/17948)
- vacuum assert fail: [#13995](https://github.com/databendlabs/databend/issues/13995)

这些问题覆盖：
- 对象存储 + ORC 导入
- 可观测性监控
- 表维护/VACUUM 操作

说明 Databend 的实际使用场景已相当多元，不再局限于基础 SQL 查询。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或关键积压项：

### 1) 相关子查询 `LIMIT` decorrelation 仍在进行中
- PR: [#19532](https://github.com/databendlabs/databend/pull/19532)

该类 planner 修复复杂度高、回归面大，建议重点审查。  
一旦合并，将显著改善复杂 SQL 支持度。

---

### 2) Hash shuffle 重构仍未收敛
- PR: [#19505](https://github.com/databendlabs/databend/pull/19505)

作为 3 月 4 日创建、今日仍在更新的重构 PR，这类改动通常涉及分布式查询核心路径。  
建议维护者关注：
- 是否拆分为更小 PR
- 是否具备充分性能回归验证
- 是否和 join / exchange 路径重构存在耦合风险

---

### 3) table branch / tag 相关设计切换需要明确迁移策略
- PR: [#19499](https://github.com/databendlabs/databend/pull/19499)
- PR: [#19534](https://github.com/databendlabs/databend/pull/19534)

当前既有重构又有移除 legacy 实现，说明设计正在迭代。  
建议尽早补充：
- 面向用户的语义说明
- 兼容性边界
- 迁移/废弃计划

否则容易对关注数据版本能力的用户造成认知不确定性。

---

### 4) sqllogictest 外置化需关注回归可见性
- PR: [#19528](https://github.com/databendlabs/databend/pull/19528)

测试仓库拆分能提升工程清晰度，但也可能带来：
- 回归上下文分散
- CI 配置复杂化
- 外部贡献者定位测试成本上升

建议在合并前明确跨仓库 CI 和回归追踪机制。

---

## 总结

Databend 今天的开发节奏表现出两个明显特征：  
一是 **用户可感知的 SQL 兼容性修复响应很快**，如 Unicode 标识符、`try_to_timestamp`、函数名大小写解析等；  
二是 **查询引擎内部仍处于积极重构阶段**，包括 join、shuffle、planner rewrite、lambda 表达式执行等核心路径。  

从健康度看，项目状态良好，维护团队对 correctness 和兼容性问题响应及时；但也应看到，实验性执行路径和大型重构正在并行推进，短期内仍需持续加强边界测试与分布式 correctness 验证。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报 - 2026-03-12

## 1. 今日速览

过去 24 小时，Velox 保持了较高活跃度：Issues 更新 25 条、PR 更新 50 条，但无新版本发布。  
从关闭/合并节奏看，项目在**稳定性治理和基础设施修复**上推进明显，尤其是 CI 依赖下载、内存仲裁测试竞态、以及若干长期 flaky test / spilling 相关历史问题得到处理。  
同时，**TableWrite / TableWriteMerge、Iceberg connector、cuDF GPU 路径、运行时指标**是今天最集中的开发方向，显示团队正在同时推进写入链路可观测性、湖仓连接器能力与 GPU 执行成熟度。  
风险方面，今日新增/活跃问题仍暴露出**CI 可用性、Debug 构建稳定性、时区语义兼容、函数注册回归**等短期质量压力。整体判断：**项目健康度中上，活跃度高，当前重心偏向稳定性收敛与关键特性打磨，而非版本发布。**

---

## 3. 项目进展

### 已合并 / 已关闭的重要 PR

#### 3.1 修复 CI 依赖下载可靠性，降低外部站点单点故障风险
- **PR #16728** `[Merged]` Improve CI dependency download reliability  
  链接: facebookincubator/velox PR #16728

该 PR 将 GEOS 下载源从 `download.osgeo.org` 切换到 GitHub mirror，并修复 LZO 下载 URL。  
这直接对应今日新增构建问题 **Issue #16725**（osgeo.org 不可用导致构建失败），属于典型的**外部依赖可用性治理**。对 Velox 这类 C++/数据系统项目而言，CI 的稳定性直接影响回归发现速度与外部贡献者体验，因此这是今天最有价值的基础设施修复之一。

**影响判断：**
- 提升 Ubuntu debug / bundled 依赖场景的 CI 成功率
- 降低第三方下载站不可用带来的全局阻塞
- 有利于下游项目（如 Gluten 等）复现和集成

---

#### 3.2 修复内存仲裁测试竞态，继续收敛 SharedArbitrator 方向
- **PR #16731** `[Merged]` Fix race condition in `MockSharedArbitrationTest.localArbitrationRunInParallelWithGlobalArbitration`  
  链接: facebookincubator/velox PR #16731

该 PR 修复测试中 callback 注册时机晚于线程启动导致的竞态问题。它与今日关闭的长期 flaky issue 形成呼应：
- **Issue #15336** `[CLOSED]` localArbitrationRunInParallelWithGlobalArbitration is flaky  
  链接: facebookincubator/velox Issue #15336

这表明内存仲裁体系正在从历史兼容状态继续向 **SharedArbitrator 主路径**收束，测试体系也在同步补齐。

**技术意义：**
- 提升内存回收/仲裁路径测试可信度
- 降低并发执行下误报 flaky 的概率
- 为后续移除旧 arbitrator 机制提供验证基础

---

#### 3.3 头文件瘦身，减少全局编译开销
- **PR #16670** `[Merged]` Move `folly/Hash.h` include from `Type.h` to `Type.cpp`  
  链接: facebookincubator/velox PR #16670

虽然这是“小改动”，但 `Type.h` 属于高频头文件。将不必要的 `folly/Hash.h` 从头文件移除，对大型 C++ 工程的**增量编译时间、预处理膨胀、include 依赖污染**都有正向收益。

**意义：**
- 降低编译链路噪音
- 有助于后续 “folly 依赖收缩” 方向
- 属于工程健康度提升信号

---

### 今日关闭的重要 Issues，反映的推进方向

#### 3.4 spilling / memory arbitration 历史债继续清理
今日关闭多条与 spilling、hash join、arbitration、flaky test 相关 issue：
- **Issue #8218** Deprecate test inject and threshold triggered Spilling in Velox  
- **Issue #8220** Remove NoOp memory arbitrator kind  
- **Issue #3567** Fuzzer hash join test with spilling return incorrect result  
- **Issue #10027** Flaky `HashJoinTest.failedToReclaimFromHashJoinBuildersInNonReclaimableSection`  
- **Issue #10295** Flaky `AggregationTest.maxSpillBytes`  
- **Issue #11992** Flaky `HashJoinTest.reclaimDuringOutputProcessing`  
- **Issue #15119** Flaky `MockSharedArbitrationTest.freeUnusedCapacityWhenReclaimMemoryPool`  
- **Issue #13308** Flaky `HashJoinBridgeTest.multiThreading/0`  
- **Issue #10034** Flaky `MultiFragmentTest.taskTerminateWithProblematicRemainingRemoteSplits`

这些关闭动作集中说明：  
Velox 正在持续把 spilling 触发方式、内存仲裁实现、以及多线程执行下的边界测试统一到更新的执行模型上。对 OLAP 引擎而言，这类问题虽然不一定每天可见，但会直接影响**大查询稳定性、OOM 防护、join/aggregation 正确性和可回归性**。

---

#### 3.5 多线程 barrier 能力推进完成
- **Issue #16352** `[CLOSED]` Add barrier support under multi-threaded execution mode  
  链接: facebookincubator/velox Issue #16352

该 issue 关闭意味着 barrier 机制已不再局限于单线程执行模式。  
这对流式或复杂调度场景是关键能力，说明执行引擎在**多 driver / 多 operator 实例协调**上更成熟。

---

#### 3.6 cuDF 方向持续补洞
今日关闭的 cuDF 相关 issues：
- **Issue #16198** `[CLOSED]` [cuDF] Request for `kMultiRange` Filter support in CuDF  
- **Issue #16179** `[CLOSED]` [cuDF] Join Filters do not check that their expression can be evaluated by CUDF  
- **Issue #16105** `[CLOSED]` [cuDF] Add CudfVector coalescing when batches get too small  

这说明 GPU 路径从“能跑”逐步转向“更完整、更稳、更高效”：
- filter 类型支持扩展
- join filter 下推前做可执行性检查
- 小 batch 合并以提升 GPU kernel 利用率

对使用 Presto + Velox + cuDF 的场景，这是积极信号。

---

## 4. 社区热点

### 4.1 时区映射兼容性：`TimeZoneMap` 无法区分 GMT
- **Issue #16507** `[OPEN]` TimeZoneMap cannot distinguish GMT  
  链接: facebookincubator/velox Issue #16507

这是当前评论最多的活跃问题之一（10 条评论）。问题出现在 Gluten + Velox + Iceberg 测试场景中，表明这不是单纯边角语义，而是**跨项目集成兼容性问题**。  
背后技术诉求是：Velox 的时区映射/解析语义需要更精确地覆盖 SQL 引擎与数据格式系统中的别名、标准名与行为差异，避免在 Iceberg/Presto/Spark 交互时出现错误。

**分析：**
- 时区语义是 SQL 兼容中的高风险区
- 问题来自真实集成链路，而非单元测试
- 若未及时修复，可能影响外部生态采用

---

### 4.2 表写入链路成为今天最集中的开发热点
相关 PR：
- **PR #16724** Document `TableWriteNode` and `TableWriteMergeNode`
- **PR #16736** Handle mixed stats/data batches in `TableWriteMerge`
- **PR #16738** Add stats spec to `TableWrite/TableWriteMerge` `toString` output

链接：
- facebookincubator/velox PR #16724
- facebookincubator/velox PR #16736
- facebookincubator/velox PR #16738

这组 PR 明显围绕同一主题：**写入阶段数据行与统计行复用同一输出通道时的协议、调试可观测性与批处理正确性**。  
其中 #16736 尤其关键，它修复了 `TableWriteMerge` 按首行类型整批分类、从而在 mixed batch 场景下静默丢数据的风险。

**背后诉求：**
- 写入链路协议需要更清晰文档化
- 混合 batch 下必须保证数据与统计正确拆分
- explain / 调试输出需要更强可读性

这类工作虽然不如“新功能”显眼，但对生产写入稳定性和排障非常重要。

---

### 4.3 dot_product UDF 出现回滚与重加并存，暴露函数注册流程问题
相关 PR：
- **PR #16726** Add missing float array registration for `dot_product` VDF
- **PR #16739** Remove `dot_product` UDF
- **PR #16740** Re-add `dot_product` UDF with test fix

链接：
- facebookincubator/velox PR #16726
- facebookincubator/velox PR #16739
- facebookincubator/velox PR #16740

配套 issue：
- **Issue #16723** Failed test `DotProductTest.floatArrays` in debug build  
  链接: facebookincubator/velox Issue #16723

这是一组很典型的“功能引入后发现注册/测试矩阵不完整”的事件。  
问题本质不是算法本身，而是：
- 模板实现支持 float/double
- 但注册列表漏掉 float
- 测试对 REAL/DOUBLE 类型期望不一致

**背后诉求：**
- 新函数上线需要更严格的类型注册覆盖检查
- debug build 和 release build 的测试矩阵都要覆盖
- UDF 注册机制最好支持自动校验或生成

---

### 4.4 cuDF 能力与观测性需求升温
活跃 issue：
- **Issue #15772** `[OPEN]` [cuDF] Expand GPU operator support for Presto TPC-DS  
- **Issue #16722** `[OPEN]` [cudf] Add accurate runtime statistics for cudf operators  
- **Issue #16733** `[OPEN]` [cudf] Consider using new cuDF `memcpy` APIs  
- **Issue #16707** `[OPEN]` JITIFY crash on test/benchmark app exit if built Debug

链接：
- facebookincubator/velox Issue #15772
- facebookincubator/velox Issue #16722
- facebookincubator/velox Issue #16733
- facebookincubator/velox Issue #16707

可以看出社区对 GPU 路径的诉求已经从“支持更多算子”扩展到：
- 运行时统计准确性
- 更优 memcpy API
- debug 模式退出稳定性
- TPC-DS 实际 workload 覆盖率

这说明 cuDF 集成正在进入**生产可用性打磨阶段**。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1：写入链路潜在数据丢失风险
- **PR #16736** `[OPEN]` Handle mixed stats/data batches in `TableWriteMerge`  
  链接: facebookincubator/velox PR #16736

问题描述显示，`TableWriteMerge::addInput` 过去按 row 0 分类整个 batch，在 exchange 将多个 worker 输出合并到同一 vector 时，可能**静默丢弃数据行**。  
这是今天最值得关注的正确性风险之一，虽然以 PR 形式暴露，但性质接近高优先级 bug fix。

**状态：已有 fix PR，待合并。**

---

### P1：时区语义兼容问题影响 Gluten/Iceberg 集成
- **Issue #16507** `[OPEN]` TimeZoneMap cannot distinguish GMT  
  链接: facebookincubator/velox Issue #16507

影响真实用户在 Gluten + Velox backend + Spark 4.0 + Iceberg 的测试路径。  
时区错误往往会引入**结果偏差、元数据解析异常或类型转换错误**，尤其在湖仓格式中风险较高。

**状态：暂未看到对应 fix PR。**

---

### P1：Expression Fuzzer 崩溃，TIME 类型 `IS DISTINCT FROM` 与 Presto reference runner 不兼容
- **Issue #16663** `[OPEN]` [CI] Expression Fuzzer crashes: IS DISTINCT FROM with TIME type not handled by Presto reference runner  
  链接: facebookincubator/velox Issue #16663

这是 fuzzer + reference verification 问题，说明 Velox 与 Presto 参考执行器在 TIME 相关语义上仍有 gap。  
这类问题虽未必是线上 crash，但对 SQL 正确性验证体系影响较大。

**状态：未见直接修复 PR。**

---

### P1：Debug 构建中的 `dot_product` 测试失败，函数类型注册有缺口
- **Issue #16723** `[OPEN]` Failed test `DotProductTest.floatArrays` in debug build  
  链接: facebookincubator/velox Issue #16723

关联 PR：
- **PR #16726** 增加 float array 注册
- **PR #16739** 移除 `dot_product`
- **PR #16740** 重新加入并修复测试

这是今日最明显的**新函数引入回归**。  
从“补注册”到“移除”再到“重加”，说明维护者在评估最稳妥合入路径。

**状态：已有多条 fix/rollback PR，最终方案待定。**

---

### P2：构建依赖源不可用导致 CI/开发构建失败
- **Issue #16725** `[OPEN]` Builds fail because osgeo.org is unavailable  
  链接: facebookincubator/velox Issue #16725  
- **PR #16728** `[Merged]` Improve CI dependency download reliability  
  链接: facebookincubator/velox PR #16728

该问题已被快速修复，响应速度较好。  
属于外部依赖风险，不涉及执行正确性，但会严重影响开发者体验与 PR 验证。

**状态：已有合并 fix。**

---

### P2：Debug + cuDF + JITIFY 退出崩溃
- **Issue #16707** `[OPEN]` JITIFY crash on test/benchmark app exit if built Debug  
  链接: facebookincubator/velox Issue #16707

该问题影响包含 CUDF 的测试/benchmark 可执行程序，在 debug 且 `jitExpressionEnabled=true` 时退出崩溃。  
虽然更多是开发/测试态问题，但会降低 GPU 路径问题排查效率。

**状态：未见 fix PR。**

---

### P2：Spiller readahead 测试仍然 flaky
- **Issue #15817** `[OPEN]` Flaky tests: `SpillerTest/AllTypesSpillerTest.readaheadTest/N`  
  链接: facebookincubator/velox Issue #15817

这是今日仍在活跃更新的稳定性问题，说明 spilling 子系统虽然关闭了多条历史 issue，但 readahead 相关测试还未完全稳定。

**状态：未见 fix PR。**

---

## 6. 功能请求与路线图信号

### 6.1 Iceberg connector：位置更新（positional update）支持正在落地
- **PR #16715** `[OPEN]` Add positional update support for Velox Iceberg connector  
  链接: facebookincubator/velox PR #16715

这是今天最重要的功能型 PR 之一。它为 Iceberg connector 增加 merge-on-read 的列级 positional update 支持，和已有 positional delete 类似。  
这意味着 Velox 正在增强对现代湖仓表格式增量更新语义的支持。

**路线图信号：强。**  
很可能成为下一阶段版本的重要连接器能力增强点。

---

### 6.2 GPU 路径：从算子覆盖到性能与观测性
- **Issue #15772** Expand GPU operator support for Presto TPC-DS  
- **Issue #16722** Add accurate runtime statistics for cudf operators  
- **Issue #16733** Consider using new cuDF `memcpy` APIs

这些问题组合起来看，cuDF 路线图至少包括三条主线：
1. 补齐 TPC-DS 工作负载下的算子支持
2. 修正 CUDA stream 异步执行导致的 timing 统计失真
3. 跟进新 cuDF 内存拷贝 API 以获取更好性能/一致性

**路线图信号：强。**  
GPU 执行显然仍是 Velox 重要投资方向。

---

### 6.3 运行时可观测性增强持续推进
- **PR #16711** Add `blockedWaitFor` runtime metrics in `Driver::closeByTask()`  
  链接: facebookincubator/velox PR #16711  
- **PR #15430** Report number of lookups to the `AsyncDataCache`  
  链接: facebookincubator/velox PR #15430  
- **Issue #16722** accurate runtime statistics for cudf operators

Velox 继续补 runtime stats，覆盖 blocked driver、cache lookup、GPU operator timing。  
这说明维护者非常重视**线上问题诊断、性能分析与 stuck query 调试**。

**路线图信号：中强。**

---

### 6.4 序列化 API 与依赖替换仍在演进
- **PR #16710** Add name validation and string constants to VectorSerde API  
- **PR #16019** Use FBThrift instead of Apache Thrift

这两条 PR 都属于“基础接口/依赖栈重构”型工作。  
前者补 string-based API 的自描述与自校验能力；后者则是更大的依赖切换工程。

**路线图信号：中。**  
短期未必立刻进入版本亮点，但对长期 API 稳定性和构建简化意义较大。

---

## 7. 用户反馈摘要

### 7.1 外部集成用户最关心“兼容性不能出错”
来自 **Issue #16507**，用户在 Gluten + Spark 4.0 + Iceberg 场景中遇到时区问题。  
这说明用户对 Velox 的期待已不只是“性能快”，而是作为底层执行引擎时，必须在**时间类型、时区、格式兼容**上足够可靠。

---

### 7.2 GPU 用户希望减少 CPU fallback，并提升真实 workload 覆盖率
- **Issue #15772** 指向 Presto TPC-DS 运行时因缺少 cuDF 算子而退回 CPU  
这反映出 GPU 用户的真实诉求是：
- 不只是 demo 级别支持
- 而是尽量覆盖标准分析 workload
- 并减少 driver adapter 中的 fallback 影响性能收益

---

### 7.3 开发者对 CI 稳定性和 debug 可用性较敏感
- **Issue #16725** 构建因下载站不可用失败
- **Issue #16707** debug + JITIFY 退出崩溃
- **Issue #16723** debug build 下函数测试失败

这些反馈说明：Velox 社区不仅关注生产查询，还高度依赖**可重复构建、调试友好、测试可信**的开发体验。

---

### 7.4 运行时指标准确性已成为高级用户诉求
- **Issue #16722** 认为现有 timing 机制不适合异步 GPU operator

这代表社区用户已经开始深入使用 Velox 的 runtime stats 做性能分析，不再满足于“有指标”，而是要求**指标能准确反映异步执行模型**。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或仍悬而未决的条目。

### 8.1 Distinct hash aggregation spilling 仍未完成
- **Issue #3263** `[OPEN]` Add spilling support for distinct hash aggregation  
  链接: facebookincubator/velox Issue #3263

这是 2022 年遗留问题，涉及聚合在 spill 场景下的实现假设不成立。  
对大数据量聚合 workload 来说，这是**功能缺口 + 正确性风险**并存的问题，建议提高优先级。

---

### 8.2 cuDF TPC-DS 算子支持扩展仍在 backlog
- **Issue #15772** `[OPEN]` [cuDF] Expand GPU operator support for Presto TPC-DS  
  链接: facebookincubator/velox Issue #15772

虽然今天有多个 cuDF 相关 issue 关闭，但这个更“面向实际 workload”的主问题仍未完成，说明 GPU 路径完整性离广泛可用还有距离。

---

### 8.3 TextWriter compression 支持 PR 持续陈旧
- **PR #14677** `[OPEN][stale]` Support compression for `TextWriter`  
  链接: facebookincubator/velox PR #14677

该 PR 从 2025-09 持续开放至今，功能本身对导出/写文件场景有实际价值。若设计无大争议，建议维护者明确：
- 是否接受该方向
- 是否需要拆分范围
- 是否需要补齐 compression level 配置

---

### 8.4 FBThrift 替换 Apache Thrift 是中大型变更，需持续推进或明确边界
- **PR #16019** `[OPEN]` Use FBThrift instead of Apache Thrift  
  链接: facebookincubator/velox PR #16019

这是依赖栈级别变更，收益明显，但兼容面广、改造成本高。  
建议维护团队给出更清晰的迁移计划、兼容影响说明和里程碑，否则容易长期悬置。

---

### 8.5 AsyncDataCache 指标增强 PR 长期开启
- **PR #15430** `[OPEN][stale]` Report number of lookups to the AsyncDataCache  
  链接: facebookincubator/velox PR #15430

该 PR 与当前项目强调 runtime stats 的方向一致，不应长期 stale。  
建议评估是否可与其他 metrics 改动合并推进。

---

## 总结判断

今天的 Velox 动态呈现出非常鲜明的特征：  
一方面，项目继续高频清理 **spilling / arbitration / flaky test / CI 基础设施** 历史问题，工程健康度在提升；另一方面，**Iceberg connector、TableWrite 写入协议、cuDF GPU 能力、运行时指标**成为核心演进方向。  
短期最值得关注的风险是：**时区兼容、TableWriteMerge mixed batch 正确性、dot_product 函数注册回归、以及 Debug/GPU 路径稳定性**。  
如果未来几天这些待合并修复能顺利落地，Velox 的查询执行稳定性和生态集成成熟度会继续改善。

如果你愿意，我也可以进一步把这份日报整理成：
1. **适合发团队群的简版摘要**，或  
2. **按“执行引擎 / 连接器 / GPU / 稳定性”四大模块重组的技术版周报格式**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-12）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：**Issues 更新 5 条，PR 更新 27 条**，其中 **22 条 PR 仍在待合并**，**5 条 PR 已合并/关闭**。  
今天的主题非常集中，主要围绕三条主线展开：**Velox 后端能力补齐与兼容性修复、Spark 4.x 测试恢复、以及项目从 Incubator 毕业为 TLP（Top Level Project）后的仓库与流程改造**。  
从工程节奏看，项目当前处于**功能推进与工程治理同步进行**的阶段，既有 SQL/执行引擎层面的增量特性，也有大量仓库、CI、发布脚本和文档层面的批量整理。  
整体健康度偏积极，但仍存在若干**测试回归与上游依赖跟进压力**，特别是 Spark 4.x 与 Velox/Folly 版本联动带来的稳定性风险需要持续关注。

---

## 3. 项目进展

### 3.1 今日已关闭/完成的关键 PR

#### 1) Velox 原生支持 `assert_not_null` 表达式
- **PR**: #11685 `[CLOSED] [CORE, DATA_LAKE] [VL] Enable assert_not_null expression for Velox backend`
- **链接**: apache/gluten PR #11685

该 PR 将 Spark 的 `AssertNotNull` 表达式映射到 Velox 的 `assert_not_null` 函数，使得**表写入场景中的 NOT NULL 约束校验**可以在 Velox 侧原生执行，而不是退回 Spark。  
这项改动的意义主要体现在：
- **SQL 语义兼容性提升**：写表、插入时的约束校验更接近 Spark 原生行为；
- **减少 fallback**：避免因为约束表达式不支持而失去列式执行收益；
- **Data Lake 写路径更完整**：对使用 Iceberg / Delta / Hive 风格表写入的用户更有价值。

这是一个典型的“**执行引擎语义补齐**”类改进，虽然不是大功能，但对生产可用性很重要。

---

#### 2) Spark 4.1 夜间包问题后续修复
- **PR**: #11744 `[CLOSED] [INFRA] [GLUTEN-11316][VL] Followup to fix spark-4.1 nightly package`
- **链接**: apache/gluten PR #11744

该 PR 属于 Spark 4.1 夜间构建适配的后续修复，说明项目仍在快速跟进 Spark 新版本生态。  
这类改动通常不直接影响查询语义，但对以下方面很关键：
- **CI 稳定性**
- **新版本 Spark 的集成测试可持续性**
- **后续 Spark 4.1 功能启用 PR 的合并效率**

这也与当前多个 “Enable xxx suite for Spark 4.1” 的 PR/Issue 形成呼应，显示团队正在系统性恢复 Spark 4.x 支持矩阵。

---

#### 3) 启用 Spark 4.1 的 `GlutenDataFrameSubquerySuite`
- **PR**: #11727 `[CLOSED] [CORE] [GLUTEN-11550][VL] Enable GlutenDataFrameSubquerySuite for Spark 4.1`
- **链接**: apache/gluten PR #11727

该 PR 修复了 **struct join key validation**，从而恢复 Spark 4.1 下的数据子查询测试套件。  
技术价值在于：
- 修复了 `isin(Dataset)` 等产生的 **struct IN subquery** 场景；
- 相关计划可转成带有 **struct 类型 join key** 的 `BroadcastHashJoin`；
- 说明 Gluten 在复杂子查询和结构化类型上的兼容性正逐步补齐。

这对依赖 Spark SQL 高级表达式、尤其是 DataFrame API 与子查询组合使用的用户来说，是一个非常实用的兼容性进展。

---

### 3.2 今日仍在推进中的重点 PR

#### 4) 列式 Shuffle 支持“单分区多段写出”，降低峰值内存
- **PR**: #11722 `[OPEN] [CORE, VELOX, DOCS] [VL] Support multiple segments per partition in columnar shuffle`
- **链接**: apache/gluten PR #11722

这是今天最值得关注的性能/资源治理类改动之一。其目标是让 Velox 后端的列式 shuffle writer 支持**每个 partition 多 segment 输出**，以便在处理过程中**增量 flush**，而不是必须将整个分区数据长期驻留内存后再统一落盘。  
潜在收益：
- **显著降低 shuffle 写路径峰值内存**
- 改善大分区、数据倾斜场景下的稳定性
- 更适合内存受限环境与大规模批处理任务

这类优化通常对 OLAP 查询、ETL、大宽表 repartition/sort/shuffle 场景有直接价值。

---

#### 5) Parquet 类型扩宽支持
- **PR**: #11719 `[OPEN] [CORE, BUILD, VELOX] [GLUTEN-11683][VL] Add Parquet type widening support`
- **链接**: apache/gluten PR #11719

该 PR 修复 SPARK-18108、处理 parquet-thrift 兼容问题，并为 Velox 增加 **Parquet type widening** 支持，已启用 `GlutenParquetTypeWideningSuite` 中 **84 个测试里的 79 个**。  
这是一个明显的**存储格式兼容性增强**，意味着 Gluten 在以下场景将更稳：
- schema evolution
- 跨版本/跨系统写出的 Parquet 文件读取
- 上游数据类型与目标类型存在可放宽转换关系的情况

对数据湖读路径来说，这是较高价值改动，预计会是下一阶段值得优先合入的增强之一。

---

#### 6) 启用 Variant 相关测试套件
- **PR**: #11726 `[OPEN] [CORE, VELOX] [GLUTEN-11550][VL][UT] Enable Variant test suites`
- **链接**: apache/gluten PR #11726

PR 目标是启用：
- `GlutenVariantEndToEndSuite`
- `GlutenVariantShreddingSuite`
- `GlutenParquetVariantShreddingSuite`

覆盖 Spark 4.0 / 4.1。  
这说明 Gluten 正在补强对 **Variant / 半结构化数据表达** 的支持，尤其涉及：
- variant shredded struct 识别
- validator 行为修正
- Parquet variant shredding 兼容

对处理 JSON-like 半结构化数据的用户来说，这是明确的路线图信号。

---

#### 7) TimestampNTZ 验证策略可配置
- **PR**: #11720 `[OPEN] [CORE, VELOX, DOCS] [GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback`
- **链接**: apache/gluten PR #11720

当前 validator 会把 `TimestampNTZType` 视作不支持，从而触发 fallback。该 PR 新增配置，让开发和测试时可**禁用这类验证回退**。  
意义在于：
- 方便推进 TimestampNTZ 相关特性开发；
- 减少“验证器先挡住、执行器能力来不及验证”的工程阻塞；
- 为后续本地时区/无时区时间语义支持打基础。

这类 PR 往往不是最终功能落地，但很像**下一版本能力解锁前的铺路工作**。

---

#### 8) Folly 升级以跟进上游 Velox
- **PR**: #11745 `[OPEN] [VELOX] [GLUTEN-11740][VL] Bump folly to v2026.01.05`
- **链接**: apache/gluten PR #11745

该 PR 对应 issue #11740，背景是 Velox 已使用新版本 Folly API，Gluten 需要同步升级依赖。  
这类改动对最终用户不可见，但属于**后端依赖链健康度**的关键项。如果不跟进，后续 Velox 更新会越来越难集成。

---

#### 9) 移除 Spark 3.2 兼容代码
- **PR**: #11731 `[OPEN] [CORE, VELOX, CLICKHOUSE] Remove Spark 3.2 compatibility code`
- **链接**: apache/gluten PR #11731

该 PR 清理共享代码中的 `lteSpark32` 分支、删除 `shims/spark32/` 残留文件，并整理版本工具类。  
这是一个明确的维护策略信号：
- **项目已正式放弃 Spark 3.2 负担**
- 将更多工程资源集中到 Spark 4.0 / 4.1
- 可降低后续 feature 开发的分支复杂度和回归面

对于老版本用户来说，这也是升级压力的信号。

---

### 3.3 TLP 毕业后的仓库与流程改造批次

今天还有一组高关联 PR，均围绕 **Apache Gluten 从 incubator 升级为 TLP 后的仓库、脚本、CI、文档替换**：

- **#11735** Update repository references from incubator-gluten to gluten after TLP graduation  
- **#11741** Update GitHub CI workflows for TLP graduation  
- **#11742** Update dev scripts and Dockerfiles for TLP graduation  
- **#11739** Update release scripts and template for TLP graduation  
- **#11738** Remove DISCLAIMER file after TLP graduation  
- **#11737** Remove Incubating references from source code  

这些改动说明项目治理进入一个新阶段：  
**品牌、发布、CI、开发者入口、自动化流程都在从“Incubator 项目模式”切换到正式 TLP 模式。**  
从健康度角度看，这是明显利好，代表社区成熟度和 ASF 流程状态都在向前推进。

---

## 4. 社区热点

### 热点 1：Velox 社区补丁追踪，反映上游合并阻塞
- **Issue**: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **作者**: @FelixYBW
- **评论**: 16
- **👍**: 4
- **链接**: apache/gluten Issue #11585

这是当前最值得关注的长期热点之一。该 issue 用来追踪**由 Gluten 社区贡献但尚未合入 Velox 上游**的 PR。  
背后的技术诉求非常明确：
- Gluten 对 Velox 的依赖很深，很多能力必须等待上游接受；
- 社区不希望在 `gluten/velox` 长期维护大量 patch，因为 rebase 成本高；
- 这会直接影响 Gluten 某些功能是否能及时发布、稳定支持。

这类 tracker 的活跃通常意味着：  
**Gluten 已经不是单纯消费上游，而是在反向推动 Velox 特性和修复。**  
同时也意味着项目存在一定“上游吞吐瓶颈”。

---

### 热点 2：Spark 4.x 禁用测试套件恢复
- **Issue**: #11550 `[bug, triage, tracker] Spark 4.x: Tracking disabled test suites`
- **作者**: @baibaichen
- **评论**: 6
- **链接**: apache/gluten Issue #11550

这是近期功能恢复工作的主轴之一。  
与之直接相关的 PR 包括：
- #11727 启用 `GlutenDataFrameSubquerySuite`
- #11726 启用 Variant test suites

该 tracker 反映的技术诉求是：
- Spark 4.x 带来了计划、表达式、类型系统与测试行为变化；
- Gluten 需要系统性修复并重新启用被注释掉的 suite；
- 当前工作重心不是“新增大量新功能”，而是先**把 Spark 4.x 支持面做扎实**。

---

### 热点 3：项目毕业任务总表
- **Issue**: #11713 `[tracker] [Umbrella] Apache Gluten Graduation Tasks`
- **作者**: @weiting-chen
- **链接**: apache/gluten Issue #11713

虽然评论不多，但从战略重要性看，它是今天最重要的管理类 issue。  
其背后诉求不是具体 SQL 特性，而是：
- 完成 ASF TLP 迁移所需的工程与组织动作；
- 保证仓库路径、站点、文档、CI、发布流程一致；
- 避免用户和贡献者在迁移期遇到 broken links、错误脚本、错误发布模板。

这说明社区当前不仅在推进内核能力，也在处理**项目制度化和可持续运营**。

---

## 5. Bug 与稳定性

以下按严重程度和影响范围排序。

### P1：Spark `DynamicPartitionPruningHiveScanSuite` 自 1.5.1 起失败
- **Issue**: #11692 `[OPEN] [bug, triage] [VL][BUG]Spark UTs from suite DynamicPartitionPruningHiveScanSuite are failing`
- **作者**: @manikumararyas
- **创建**: 2026-03-03
- **更新**: 2026-03-11
- **评论**: 6
- **链接**: apache/gluten Issue #11692

这是今天最明确的**查询正确性/回归风险**问题。  
摘要显示自 **Gluten 1.5.1 起**，某些动态分区裁剪相关 UT 失败，涉及：
- `DynamicPartitionPruningHiveScanSuiteAEOff`
- `DynamicPartitionPruningHiveScanSuiteAEOn`

这类问题的潜在影响较大，因为 Dynamic Partition Pruning 属于 Spark SQL 优化器的重要执行路径，关系到：
- Hive/分区表读路径
- 广播子查询过滤
- 复杂过滤下的计划正确性与性能

**当前未看到数据中有明确 fix PR 关联该 issue**，建议维护者优先跟进。

---

### P1-P2：Spark 4.x 测试套件仍有系统性禁用项
- **Issue**: #11550 `[OPEN] [bug, triage, tracker] Spark 4.x: Tracking disabled test suites`
- **链接**: apache/gluten Issue #11550

虽然它是 tracker，但本质反映了一个稳定性事实：  
**Spark 4.x 的兼容性工作尚未收敛，仍存在多个被禁用 suite。**

已知相关修复推进中：
- **已有关闭 PR**: #11727
- **在途 PR**: #11726

说明问题正在被处理，但距离“全面恢复”仍有差距。对计划升级 Spark 4.1 的用户，需要保守评估生产可用性。

---

### P2：上游依赖升级带来的构建/兼容风险
- **Issue**: #11740 `[OPEN] [enhancement] [VL] Bump folly to v2026.01.05`
- **链接**: apache/gluten Issue #11740
- **对应 PR**: #11745

这不是传统 bug，但属于典型的**依赖链稳定性风险**。  
Velox 使用了新版 Folly API，Gluten 不跟进就可能出现：
- 编译失败
- ABI/API 不兼容
- 后续 Velox 日更 PR 难以同步

由于已存在对应修复 PR，风险处于可控处理中。

---

### P3：Spark 4.1 夜间包适配问题已做 follow-up
- **PR**: #11744 `[CLOSED] [INFRA] [GLUTEN-11316][VL] Followup to fix spark-4.1 nightly package`
- **链接**: apache/gluten PR #11744

该问题看起来已被快速处理，说明社区对 CI/兼容矩阵问题反应较快。  
属于“已知不稳定点被及时修补”的正向信号。

---

## 6. 功能请求与路线图信号

### 1) Velox 依赖升级和上游同步将继续成为短期重点
- **Issue**: #11740
- **PR**: #11745
- **链接**: apache/gluten Issue #11740 / PR #11745

这表明下一阶段版本中，**Velox/Folly 版本同步**仍是核心工作之一。  
对 Gluten 而言，这不是可选项，而是维持后端演进能力的基础设施工作。

---

### 2) 半结构化数据与 Variant 支持正在实质推进
- **PR**: #11726
- **链接**: apache/gluten PR #11726

启用 Variant 相关测试，通常意味着相关执行逻辑与 validator 已接近可用。  
结合 Spark 4.x 方向判断，**Variant / shredding / Parquet 组合支持**很可能进入下一版本的重要增强列表。

---

### 3) Parquet 读路径兼容性会继续增强
- **PR**: #11719
- **链接**: apache/gluten PR #11719

Parquet type widening、thrift 兼容、SPARK-18108 修复，这些都非常接近用户真实生产问题。  
如果顺利合入，下一版本在**数据湖 schema evolution 兼容性**上会更强。

---

### 4) 写路径 SQL 语义补齐仍在持续
- **PR**: #11685
- **链接**: apache/gluten PR #11685

`assert_not_null` 支持显示出一个路线图方向：  
不仅关注 scan / join / agg 等核心算子性能，也在持续补齐 **表写入、约束校验、表达式语义**。  
这对希望把 Gluten 用于更完整 ETL/写回流程的用户是积极信号。

---

### 5) 列式 Shuffle 内存优化可能成为后续性能卖点
- **PR**: #11722
- **链接**: apache/gluten PR #11722

如果该 PR 合入，预计会成为后续版本中非常值得强调的优化项，尤其适用于：
- 大 repartition
- 宽依赖 shuffle
- 内存紧张集群
- 数据倾斜场景

---

## 7. 用户反馈摘要

基于 issue 摘要与追踪信息，当前用户/贡献者的真实痛点主要集中在以下几类：

### 1) Spark 新版本可用性仍是首要关注点
- 代表 issue: #11550, #11692
- 链接: apache/gluten Issue #11550 / #11692

用户关心的不是单点新功能，而是：
- Spark 4.0 / 4.1 下到底哪些 suite 已恢复；
- 哪些功能仍会 fallback；
- 哪些场景存在回归或结果错误风险。

这说明 Gluten 的目标用户中，有相当一部分正在尝试或计划升级到 Spark 4.x。

---

### 2) 上游 Velox 合并节奏影响 Gluten 交付
- 代表 issue: #11585
- 链接: apache/gluten Issue #11585

社区贡献者反馈的核心痛点是：
- 某些对 Gluten 很关键的 Velox PR 尚未被上游合并；
- 若自行在分叉里长期维护，rebase 成本高；
- 功能交付时间因此受到外部项目节奏影响。

这对重度依赖 Velox 的用户来说，是一个现实约束。

---

### 3) 时间类型、Variant、Parquet schema 兼容是高频真实需求
- 代表 PR: #11720, #11726, #11719
- 链接: apache/gluten PR #11720 / #11726 / #11719

这些都不是“演示型功能”，而是生产场景中经常触发 fallback 或兼容问题的领域：
- `TimestampNTZ`
- 半结构化 Variant 数据
- Parquet schema evolution / widening

说明用户诉求已经从“能跑”逐步转向“复杂真实数据上稳定跑”。

---

### 4) 项目毕业后的迁移一致性也影响开发者体验
- 代表 issue/PR: #11713, #11735 ~ #11742
- 链接: apache/gluten Issue #11713

虽然这不直接影响 SQL 执行，但会影响：
- clone / build / release
- 文档跳转
- CI 模板与提交流程
- 脚本默认路径

对贡献者和运维侧用户来说，这些细节会显著影响使用体验。

---

## 8. 待处理积压

### 1) Velox 未合入上游补丁追踪应持续清理
- **Issue**: #11585
- **状态**: 长期开放，评论活跃
- **链接**: apache/gluten Issue #11585

这是典型的高价值但易长期积压的问题。  
建议维护者：
- 定期同步每个上游 PR 的状态；
- 标记哪些 patch 对当前 release blocker 关键；
- 评估是否需要临时 vendor/pick 策略。

---

### 2) Spark 4.x disabled suites tracker 需继续拆解落实
- **Issue**: #11550
- **状态**: 长期开放
- **链接**: apache/gluten Issue #11550

虽然已有 PR 在推进，但该 tracker 仍是 Spark 4.x 稳定性治理的主看板。  
建议继续：
- 按 suite/模块拆解 owner；
- 区分 correctness、performance、infra 类问题；
- 维护剩余未恢复测试的最新清单。

---

### 3) Bolt backend WIP PR 体量大、周期长，需关注是否失速
- **PR**: #11261 `[OPEN] WIP: add bolt backend in gluten`
- **创建**: 2025-12-05
- **更新**: 2026-03-12
- **链接**: apache/gluten PR #11261

这是一个明显的长期在途大 PR，涉及：
- CORE
- BUILD
- VELOX
- INFRA
- CLICKHOUSE
- DOCS
- BOLT

大体量 WIP PR 的风险在于：
- review 成本高
- 与主干漂移越来越大
- CI / 代码结构冲突逐渐增多

建议维护者评估是否应拆分为更小 PR，以降低合并难度。

---

### 4) Maven 依赖缓存优化 PR 值得尽快决策
- **PR**: #11655 `[OPEN] [VL][CI] cache maven deps m2 repo`
- **链接**: apache/gluten PR #11655

这是典型的“看起来不显眼，但对 CI 成本和开发效率持续有收益”的基础设施改进。  
若长期搁置，会持续消耗构建时间与资源。

---

## 附：今日重点链接索引

- apache/gluten Issue #11585 — `[VL] useful Velox PRs not merged into upstream`
- apache/gluten Issue #11692 — `[VL][BUG] Spark DynamicPartitionPruningHiveScanSuite failing`
- apache/gluten Issue #11550 — `Spark 4.x: Tracking disabled test suites`
- apache/gluten Issue #11713 — `[Umbrella] Apache Gluten Graduation Tasks`
- apache/gluten Issue #11740 — `[VL] Bump folly to v2026.01.05`

- apache/gluten PR #11685 — `Enable assert_not_null expression for Velox backend`
- apache/gluten PR #11727 — `Enable GlutenDataFrameSubquerySuite for Spark 4.1`
- apache/gluten PR #11744 — `Followup to fix spark-4.1 nightly package`
- apache/gluten PR #11722 — `Support multiple segments per partition in columnar shuffle`
- apache/gluten PR #11719 — `Add Parquet type widening support`
- apache/gluten PR #11726 — `Enable Variant test suites`
- apache/gluten PR #11720 — `Add config to disable TimestampNTZ validation fallback`
- apache/gluten PR #11731 — `Remove Spark 3.2 compatibility code`
- apache/gluten PR #11735 — `Update repository references from incubator-gluten to gluten after TLP graduation`

如果你愿意，我还可以继续把这份日报进一步整理成：
1. **更适合公众号/邮件发送的简版**，或  
2. **更适合研发周会汇报的表格版（风险/优先级/负责人视角）**。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-12）

## 1. 今日速览

过去 24 小时 Apache Arrow 保持**中高活跃度**：Issues 更新 25 条、PR 更新 25 条，但**无新版本发布**。  
当天工作重点明显集中在 **C++ / Parquet / FlightRPC / CI / Packaging**，说明项目当前仍以**稳定性修复、跨平台构建、SQL/ODBC 生态补齐**为主。  
从关闭项看，团队对 **Parquet 解码安全性与写入回归**响应较快，已有问题在一天内完成修复闭环；从新增项看，**Flight SQL ODBC 安装分发、打包签名、macOS/Windows 支持**正在持续推进。  
整体健康度评价：**稳健**。核心子系统有修复进展，但同时也暴露出 CI、打包、多平台依赖管理仍是近期主要压力源。

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1) 修复 Parquet BYTE_ARRAY 解码整数溢出
- PR: #49478 — [C++][Parquet] Fix multiplication overflow in PLAIN BYTE_ARRAY decoder  
- 状态：**Closed / Critical Fix**
- 链接：apache/arrow PR #49478
- 对应 Issue：#49477  
- 链接：apache/arrow Issue #49477

**影响分析：**  
这是今天最重要的稳定性修复之一。问题由 OSS-Fuzz 发现，属于 **Parquet 解码路径中的未定义行为/整数溢出**。此类问题虽然未必总能在常规数据集上触发，但对分析型存储引擎而言，解码器属于高暴露面代码，既影响**查询正确性**，也影响**安全性与鲁棒性**。  
该修复直接提升了 Arrow C++ 在 Parquet 读取链路中的安全边界，对依赖 Arrow 作为湖仓读取层、批处理扫描器或嵌入式分析引擎的用户价值较高。

---

#### 2) 修复 Meson 构建遗漏 tensor 扩展源码
- PR: #49487 — [CI][C++] Fix Meson build missing tensor extension sources  
- 状态：**Closed**
- 链接：apache/arrow PR #49487

**影响分析：**  
该 PR 修复了 Meson 构建系统与 CMake 定义不一致的问题，补齐了 tensor 相关源码与头文件安装项。  
这类改动虽然不直接增加查询功能，但会显著改善：
- 多构建系统的一致性
- 下游发行版/打包器的可维护性
- 非 CMake 用户的接入稳定性

对于 OLAP 生态来说，构建系统一致性直接影响 Arrow 被集成到查询引擎、UDF 扩展、数据服务中的成本。

---

#### 3) R 侧修复 `all.equal` 注册问题
- PR: #49481 — [R] Fix all.equal registration  
- 状态：**Closed**
- 链接：apache/arrow PR #49481

**影响分析：**  
这是 R 生态的兼容性修正，更多属于用户体验和接口行为正确性修复，对核心存储引擎影响有限，但说明项目仍在维持多语言绑定质量。

---

#### 4) 关闭了若干长期 stale enhancement / usage 项
包括：
- #30202 — [R] Investigate file closing  
- #30192 — [R] Include unused factor levels in coalesce() and if_else() output  
- #30191 — [C++][Dataset] Change scanner readahead limits to be based on bytes instead of number of batches  
- #30258 — [Doc][R] Link to the documented threading model  
- #30215 — [Python][Doc] Connecting Python to Rust  
- #30214 — [Python][Doc] Connecting Python to C++  
- #30186 — [C++] Support cast from timestamp[UTC] to string on Windows  
- #45302 — Suppress gRPC Debug Context in Error Messages  
- #45340 — [EXP][C++] Deduplicate schemas when scanning Dataset

**影响分析：**  
这些关闭动作更多是**清理历史积压**而非新功能推进。积极的一面是 backlog 在收敛；消极的一面是，像 **Dataset 扫描重读前瞻控制**、**schema 去重扫描** 这类与查询执行效率相关的话题并未在今日获得新推进。

---

## 4. 社区热点

### 热点 1：Windows MSI/ODBC 安装包签名
- Issue: #49404 — [C++][CI][Packaging][FlightPRC] Manual ODBC Windows MSI installer signing  
- 链接：apache/arrow Issue #49404

**为什么热：**  
该 Issue 评论数最高（6），聚焦于 **Windows Defender 阻止 Flight SQL ODBC 安装**的现实问题。  
**背后技术诉求：**
- Arrow 不只是内核库，正在向“可分发客户端驱动”演进
- 企业用户在 Windows 桌面/BI 工具链中接入 Flight SQL 时，安装签名是准入门槛
- 说明 Arrow 的 Flight SQL/ODBC 生态正在从“开发可用”走向“生产可部署”

---

### 热点 2：Parquet 字段级 metadata 支持
- Issue: #31018 — [C++][Parquet] Field-level metadata are not supported?  
- 链接：apache/arrow Issue #31018

**为什么热：**  
这是一个老问题再活跃，涉及 Arrow schema field metadata 与 Parquet 存储层之间的映射缺口。  
**背后技术诉求：**
- 用户希望在列级/字段级保留语义标签，而不是仅 schema-level metadata
- 这对于数据治理、语义建模、列血缘、BI 标签传递尤为重要
- 反映出 Arrow/Parquet 在“物理格式”和“高层语义元数据”之间仍有鸿沟

---

### 热点 3：LargeMap 64-bit offset 类型
- Issue: #31022 — [Format][C++] Add "LargeMap" type with 64-bit offsets  
- 链接：apache/arrow Issue #31022

**为什么热：**  
虽然评论不算多，但它是典型的**格式演进信号**。  
**背后技术诉求：**
- 与 LargeString / LargeList / LargeBinary 的能力对齐
- 面向超大嵌套列和大规模半结构化数据处理
- 对 OLAP/湖仓场景中的复杂列类型扩展有长期意义

---

### 热点 4：Flight SQL prepared statement 结果类型判定
- Issue: #49497 — [FlightSQL] Add is_update field to ActionCreatePreparedStatementResult  
- PR: #49498 — [FlightRPC] Add is_update field to ActionCreatePreparedStatementResult  
- 链接：apache/arrow Issue #49497  
- 链接：apache/arrow PR #49498

**为什么热：**  
这是今天最明确的**SQL 兼容性增强**话题之一，并且已迅速形成配套 PR。  
**背后技术诉求：**
- Prepared statement 在数据库驱动中既可能返回结果集，也可能执行更新
- 客户端需要提前知道应走哪条 Flight SQL 网络流程
- 这是 Arrow Flight SQL 向 JDBC/ODBC/数据库驱动模型靠拢的重要一步

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P0 / 高优先级：Parquet 解码未定义行为
- Issue: #49477 — [C++][CI] Undefined behavior when decoding Parquet data  
- 状态：**已关闭**
- Fix PR: #49478  
- 链接：apache/arrow Issue #49477  
- 链接：apache/arrow PR #49478

**说明：**  
由 OSS-Fuzz 报告，属于核心格式解析路径中的安全/正确性问题。已快速修复，闭环良好。

---

### P1 / 高优先级：Parquet 写入回归导致 floating point exception
- Issue: #49480 — [C++][Parquet] Regression: WriteTable and WriteRecordBatch fail with floating point exception  
- 状态：**已关闭**
- 链接：apache/arrow Issue #49480

**说明：**  
从 21.0.0 升级到 23.0.1 后出现写表崩溃，属于典型回归问题。虽然当前列表中未展示对应 PR，但 Issue 已关闭，说明问题大概率已定位或通过关联提交解决。  
这类问题对生产用户影响很大，因为它发生在**写入链路**，直接影响批处理落盘和 ETL 稳定性。

---

### P1 / 高优先级：Ubuntu clang + parquet fuzzing 导致 CI 失败
- Issue: #49495 — [C++][CI] Resolve ubuntu clang failure with parquet fuzzing  
- PR: #49496 — 已提交修复  
- 链接：apache/arrow Issue #49495  
- 链接：apache/arrow PR #49496

**说明：**  
问题来自 CRAN clang 环境，修复方式很小（增加 `typename`），但反映出模板代码/编译器兼容性仍是多平台 CI 的持续负担。  
已有 fix PR，修复前景明确。

---

### P1 / 高优先级：vcpkg 多配置生成器错误链接 debug 版 Brotli/Snappy
- Issue: #49499 — Snappy and Brotli debug libraries linked in Release builds when using vcpkg with multi-config generators  
- 状态：**Open**
- 链接：apache/arrow Issue #49499

**说明：**  
这是典型的 Windows / Visual Studio / vcpkg 集成问题，会触发 `LNK2038` 级别 ABI/运行库不匹配。  
对企业 Windows 用户影响较大，特别是以静态 triplet 集成 Arrow 的场景。当前尚未看到配套 PR。

---

### P2 / 中优先级：macOS protobuf@33 发现/运行时问题
- PR: #49491 — [CI][Python] Fix macOS protobuf@33 keg-only discovery  
- 状态：**Open**
- 链接：apache/arrow PR #49491

**说明：**  
该 PR 直接针对 Homebrew `protobuf@33` 的发现和运行时 Bus error 问题。  
这是依赖生态变动导致的构建与运行风险，不一定是 Arrow 代码逻辑错误，但对 nightly、开发者环境和 wheel 产物影响明显。

---

### P2 / 中优先级：Windows MinGW JSON 测试间歇性 segfault
- PR: #49462 — [C++][CI] Fix intermittent segfault in arrow-json-test on MinGW  
- 状态：**Open**
- 链接：apache/arrow PR #49462

**说明：**  
属于典型 flaky CI 问题。虽然影响面主要在测试稳定性，但长期会稀释 CI 信号质量，拖慢 PR 合并效率。

---

### P2 / 中优先级：CMakePresets 缺失 OpenTelemetry 选项
- Issue: #49493  
- PR: #49494  
- 链接：apache/arrow Issue #49493  
- 链接：apache/arrow PR #49494

**说明：**  
这是 Python maximal 构建配置遗漏，并非用户数据正确性问题，但会影响一致性和可复现构建。

---

## 6. 功能请求与路线图信号

### 1) Flight SQL prepared statement 增强：`is_update`
- Issue: #49497  
- PR: #49498  
- 链接：apache/arrow Issue #49497  
- 链接：apache/arrow PR #49498

**判断：高概率进入下一版本**  
需求明确、驱动接口价值高、且已有实现 PR。  
这会提升 Flight SQL 对数据库驱动、BI 工具、中间层网关的适配能力，属于**SQL 协议兼容性增强**。

---

### 2) ODBC 安装器生态补齐：Windows 签名 + macOS 安装器
- Issue: #49404 — Windows MSI 签名  
- Issue: #47876 — ODBC macOS Installer  
- PR: #49267 — [C++][FlightRPC] Fix ODBC tests for MacOS  
- 链接：apache/arrow Issue #49404  
- 链接：apache/arrow Issue #47876  
- 链接：apache/arrow PR #49267

**判断：中高概率持续推进**  
这是一个清晰的路线图簇：  
- Windows：签名与安装信任链  
- macOS：安装路径和脚本化部署  
- 测试：Mac ODBC 测试修复  
说明 Arrow Flight SQL ODBC 驱动正在向**多平台可交付产品**推进，而不只是实验性接口。

---

### 3) ODBC SQLInfo 布尔值读取能力
- Issue: #49500 — [C++][FlightRPC][ODBC] Read booleans for applicable SqlInfoOptions  
- 链接：apache/arrow Issue #49500

**判断：中概率纳入近期版本**  
该项是小而明确的 SQL 元信息兼容修复，有利于驱动层正确回答能力探测请求。  
对于 BI 工具、ORM、数据库连接层来说，这种 SQLInfo 细节很关键。

---

### 4) LargeMap 类型与 Substrait 相关议题
- Issue: #31022 — LargeMap  
- Issue: #31006 — 自动生成 Substrait extension YAML  
- Issue: #31008 — 时区字符串如何在 Substrait 中表示  
- Issue: #31007 — dictionary encoding 在 Substrait 中的表示  
- 链接：apache/arrow Issue #31022  
- 链接：apache/arrow Issue #31006  
- 链接：apache/arrow Issue #31008  
- 链接：apache/arrow Issue #31007

**判断：中长期路线信号，短期落地概率较低**  
这些问题再次活跃说明：
- Arrow 仍在寻求与 Substrait 更强的表达对齐
- 类型系统和执行计划交换格式仍有空白  
但今天没有对应落地 PR，短期更像是设计讨论和 backlog 重新浮现，而非即将发布的功能。

---

### 5) C++ / Python CSV 默认列类型参数
- PR: #47663 — Introduce optional `default_column_type` parameter  
- 链接：apache/arrow PR #47663

**判断：值得关注的潜在可用性增强**  
若合入，会改善 CSV 读取时 schema 推断不稳定的问题，尤其适合批量导入、半结构化文本入湖场景。  
这对分析引擎的 ingest 体验很有价值。

---

## 7. 用户反馈摘要

### 1) 企业用户最直接的痛点：安装分发“能不能落地”
- 相关：#49404、#47876、#49267  
- 链接：apache/arrow Issue #49404  
- 链接：apache/arrow Issue #47876  
- 链接：apache/arrow PR #49267

**反馈提炼：**
- Windows Defender 阻止未签名 MSI，说明用户已在真实桌面环境中部署 Flight SQL ODBC
- macOS 安装路径、脚本调用顺序等问题反映出驱动正在被用于实际客户端接入
- 用户关心的不再只是 API 正确，而是**安装器、证书、系统路径、驱动注册**这些产品化细节

---

### 2) Parquet 用户对“升级回归”和“安全解码”非常敏感
- 相关：#49480、#49477/#49478  
- 链接：apache/arrow Issue #49480  
- 链接：apache/arrow Issue #49477  
- 链接：apache/arrow PR #49478

**反馈提炼：**
- 从 21.0.0 升到 23.0.1 出现写入崩溃，说明用户持续在生产环境追版本
- 模糊测试发现的解码问题提醒社区：Parquet 作为核心格式，任何低层 bug 都会放大到全生态
- 用户对 Arrow 的期望是：**既快又稳，还要能承受异常/恶意输入**

---

### 3) SQL/驱动用户需要更完整的协议语义
- 相关：#49497、#49500、#43556  
- 链接：apache/arrow Issue #49497  
- 链接：apache/arrow Issue #49500  
- 链接：apache/arrow Issue #43556

**反馈提炼：**
- prepared statement 到底返回结果集还是更新计数，客户端需要明确协议指引
- SQLGetInfo 的布尔选项要正确映射，否则上层工具能力探测会失真
- Python Flight 用户甚至关注内部错误处理差异（`check_status` vs `check_flight_status`），说明接口已被深入使用，而不是浅层试用

---

### 4) 高级用户继续推动类型系统与元数据能力
- 相关：#31018、#31022  
- 链接：apache/arrow Issue #31018  
- 链接：apache/arrow Issue #31022

**反馈提炼：**
- 字段级 metadata、LargeMap 这类需求来自更复杂的数据建模场景
- 表明 Arrow 已不仅服务于“表格数据搬运”，也在承载更重的语义层与大规模嵌套类型需求

---

## 8. 待处理积压

以下是今天仍值得维护者关注的长期或重要积压项：

### 1) Parquet 字段级 metadata 支持缺口
- Issue: #31018  
- 链接：apache/arrow Issue #31018

**原因：**  
这关系到 Arrow schema 语义能否在 Parquet 中完整落地，涉及数据治理与互操作，值得重新评估优先级。

---

### 2) LargeMap 64-bit offset 类型
- Issue: #31022  
- 链接：apache/arrow Issue #31022

**原因：**  
属于格式层能力补齐，对超大嵌套数据与类型系统一致性有长期意义。

---

### 3) Substrait 一组设计问题长期悬而未决
- #31006 / #31008 / #31007  
- 链接：apache/arrow Issue #31006  
- 链接：apache/arrow Issue #31008  
- 链接：apache/arrow Issue #31007

**原因：**  
这些问题共同影响 Arrow 与 Substrait 的边界定义。若 Arrow 希望持续强化查询计划与表达式互操作，这组议题不能长期停留在 stale-warning 状态。

---

### 4) Dataset / 扫描执行层历史优化议题被关闭或停滞
- #30191 — scanner readahead 以 bytes 控制  
- #45340 — 扫描时 schema 去重实验 PR  
- 链接：apache/arrow Issue #30191  
- 链接：apache/arrow PR #45340

**原因：**  
这些点与实际扫描性能、内存占用、schema 处理效率密切相关。虽然今天被关闭/停滞，但从 OLAP 引擎角度看，仍是值得重新梳理的优化方向。

---

## 总结判断

今天的 Apache Arrow 没有版本发布，但技术信号很清晰：

1. **短期主线是稳定性与交付能力**：Parquet 安全修复、写入回归处理、CI 构建修正、Meson/CMake 对齐。  
2. **中期主线是 Flight SQL/ODBC 产品化**：Windows 签名、macOS 安装器、SQLInfo、prepared statement 语义增强。  
3. **长期主线仍是类型系统与互操作演进**：LargeMap、字段级 metadata、Substrait 表达问题。  

对关注 OLAP 查询引擎和分析型存储的使用者而言，Arrow 今日最积极的信号是：**核心格式问题处理迅速，Flight SQL 驱动生态正在从“能跑”走向“能交付”。**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*