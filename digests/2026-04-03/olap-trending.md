# OLAP & 数据基础设施开源趋势日报 2026-04-03

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-04-03 01:27 UTC

---

# OLAP & 数据基础设施开源趋势日报
日期：2026-04-03

## 一、过滤结果

### 今日 Trending 榜单过滤结论
今日 Trending 的 4 个仓库中：

- `siddharthvaddem/openscreen`：演示录屏工具，**非数据基础设施**
- `Yeachan-Heo/oh-my-codex`：AI/Codex 增强工具，**非数据基础设施**
- `asgeirtj/system_prompts_leaks`：提示词泄露整理，**非数据基础设施**
- `sherlock-project/sherlock`：社交账号检索工具，**非数据基础设施**

**结论：今日 GitHub Trending 榜单中，没有明确属于 OLAP / 数据基础设施 / 分析引擎方向的项目。**  
因此本日报主要基于“主题搜索”中的 73 个候选项目进行筛选与趋势分析。

### 筛选后纳入分析的核心项目
重点纳入以下明确相关项目：
ClickHouse、DuckDB、QuestDB、Apache Doris、StarRocks、OceanBase、Databend、DataFusion、Ballista、Presto、Trino、Cloudberry、chDB、LakeSoul、Apache Polaris、Apache Fluss、Lakekeeper、Nimble、dlt、Rudder Server、OLake、Multiwoven、Elementary、Hue、Superset、Metabase、Redash、ClickBench、Wren Engine、Arc、pg_mooncake、Pixels、YTsaurus、Gravitino 等。

排除或弱化的项目主要包括：
- 与 OLAP 关系弱的通用 analytics 产品或网站统计工具，如 Umami、Plausible、Matomo
- 偏知识图谱/图查询/推理框架且不以 OLAP 为核心者
- 明显与数据基础设施无关的仓库

---

## 二、分类结果

## 1. 今日速览

1. 今日 GitHub 实时 Trending 没有出现数据基础设施项目，说明**短周期爆款关注点暂时被 AI 工具和通用开发工具占据**。  
2. 但从 7 天活跃项目看，**OLAP 引擎层依旧高度集中在 ClickHouse、DuckDB、Doris、StarRocks、Databend、DataFusion 等核心基础设施**。  
3. 值得注意的是，**DataFusion 生态外溢明显**：不仅有原生引擎，还有 Ballista、Wren Engine、liquid-cache、.NET bindings 等衍生项目同步活跃。  
4. 湖仓方向上，**Iceberg Catalog/Streaming Storage/Realtime Lakehouse** 相关项目活跃度持续提升，显示社区正在从“查询引擎竞争”走向“元数据、流式写入、统一存储接口”的下一阶段。  
5. 新项目中，**Nimble、Arc、pg_mooncake、Apache Fluss、Lakekeeper** 代表了列式格式、嵌入式/轻量分析、Postgres 实时分析、流式湖仓与 Rust Catalog 等值得持续跟踪的新信号。

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,671  
  实时分析数据库的事实标准之一，列式执行、压缩与高并发分析能力仍是行业标杆，持续代表开源 OLAP 主流路线。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,145  
  嵌入式分析数据库代表，正在持续吞噬本地分析、笔记本分析、轻量数仓与开发测试场景。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,816  
  面向时序 OLAP 的高性能数据库，适合实时指标、监控与 IoT 数据场景，反映时序分析仍是重要增长点。

- [apache/doris](https://github.com/apache/doris) — ⭐15,169  
  统一分析数据库，兼顾明细、聚合和湖仓联邦查询，是企业级分析平台中的高热度选项。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,536  
  主打亚秒级分析和 Lakehouse 查询，是“高性能查询 + 湖仓融合”路线的核心项目之一。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,223  
  云原生数仓方向代表，强调对象存储之上的统一分析、搜索与 AI 代理能力，值得关注其 AI-ready warehouse 叙事。

- [apache/cloudberry](https://github.com/apache/cloudberry) — ⭐1,197  
  Greenplum 系 MPP 开源延续，代表传统大规模并行分析数据库在 Apache 基金会生态中的新承接。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,653  
  基于 ClickHouse 的 in-process OLAP SQL 引擎，体现“嵌入式分析能力产品化”趋势。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐706  
  面向大规模列式数据的新型可扩展文件格式，虽然体量还小，但“格式创新”本身非常值得关注。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,226  
  实时湖仓框架，强调高并发更新与增量分析，贴合 BI 与 AI 双场景融合需求。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,889  
  Apache Iceberg 开放 Catalog 项目，说明湖仓竞争正在上移到元数据与互操作层。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,239  
  Rust 编写的 Iceberg REST Catalog，轻量、安全、易部署，是湖仓控制面的新兴实现。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,837  
  面向实时分析的 streaming storage，体现“流存储 + 湖仓”的融合正在加速。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,934  
  联邦元数据湖方向项目，适合多地域、多引擎的数据治理与开放元数据管理。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,149  
  大数据平台型项目，兼具存储与计算属性，代表更完整的平台级数据基础设施形态。

- [pixelsdb/pixels](https://github.com/pixelsdb/pixels) — ⭐901  
  面向云原生与本地混合环境的存储与计算引擎，值得观察其是否形成差异化湖仓能力。

---

## ⚙️ 查询与计算

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,555  
  Rust SQL 查询引擎核心组件，已从单体项目演化为生态底座，是当前最值得关注的计算内核之一。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,004  
  DataFusion 的分布式执行扩展，说明社区正在补齐从嵌入式到分布式的一体化执行栈。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,677  
  经典分布式 SQL 查询引擎，在联邦查询和大数据分析场景仍保持强影响力。

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,686  
  现代数据平台中最重要的联邦查询引擎之一，连接器生态和跨湖仓查询能力持续关键。

- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,946  
  在 Postgres 表上做实时分析，代表 OLTP/OLAP 边界继续被打通，是很强的工程实践方向。

- [Canner/wren-engine](https://github.com/Canner/wren-engine) — ⭐630  
  面向 AI agent 的上下文查询引擎，建立在 Rust 与 DataFusion 之上，代表查询层开始服务 AI 应用编排。

- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐396  
  DataFusion 的 pushdown cache 项目，反映查询优化正从算子执行扩展到智能缓存层。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐196  
  Firebolt 分布式查询引擎的自托管版本，值得关注商业数仓能力向开源核心下沉的信号。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,167  
  开源 Python 数据装载工具，降低数据写入数仓/湖仓门槛，是现代 ELT 工具链中活跃度很高的一环。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,382  
  Segment 替代方案，覆盖事件采集与数据路由，连接产品数据与仓库分析体系。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,313  
  将数据库、Kafka、S3 高效复制到 Iceberg 或 Parquet，直接服务实时湖仓摄取需求。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,648  
  Reverse ETL 项目，代表数据仓库向业务系统回流的数据闭环需求增强。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  传统 ETL 配置化工具，虽热度不高，但适合观察低代码数据集成的长尾需求。

- [tuva-health/tuva](https://github.com/tuva-health/tuva) — ⭐301  
  数据模型、数据集市与质量测试结合，说明垂直行业数据栈也在逐渐开源化。

---

## 🧰 数据工具

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐981  
  分析型数据库基准测试项目，是观察 OLAP 引擎性能竞争的常用参照系。

- [apache/superset](https://github.com/apache/superset) — ⭐72,190  
  开源 BI 与探索分析平台，仍是连接数仓、OLAP 引擎与业务分析用户的重要入口。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,725  
  轻量化自助分析工具代表，适合中小团队快速消费 OLAP 能力。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,321  
  数据查询与可视化工具，虽然老牌，但仍是 SQL 分析工作流中的常见选择。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,295  
  dbt-native 数据可观测性工具，反映现代数据栈对质量监控和异常检测的重视持续增强。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,446  
  面向数据库/仓库的 SQL 助手与工作台，是数据平台操作层面的实用工具。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,351  
  虽然更偏产品分析平台，但其内置 warehouse/CDP 能力说明分析应用正持续向数据平台靠拢。

---

## 3. 趋势信号分析

今天最大的信号不是“哪一个 OLAP 项目登上总榜爆发”，而是**数据基础设施在 GitHub 实时 Trending 上整体缺席**。这通常意味着当前 GitHub 大盘的注意力被 AI 开发工具吸走，但并不代表数据基础设施降温；相反，从 7 天主题活跃度看，社区讨论正在从“谁是最快的 OLAP 数据库”逐步转向**湖仓控制面、实时摄取、嵌入式分析和可组合查询内核**。

其中最清晰的结构性趋势有三条：  
一是 **DataFusion 生态化**，从查询引擎扩展到分布式执行、缓存优化、AI 上下文引擎和多语言绑定；  
二是 **Iceberg/湖仓元数据层升温**，Polaris、Lakekeeper、Gravitino 等项目说明 Catalog 与开放接口成为新战场；  
三是 **实时湖仓与轻量分析并进**，Apache Fluss、LakeSoul、OLake、pg_mooncake、chDB、Arc 这类项目分别从流式存储、实时摄取、Postgres 分析扩展和嵌入式 OLAP 切入，契合近期云数仓向对象存储、开放表格式和混合事务/分析能力演进的大方向。

---

## 4. 社区关注热点

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态正在形成平台效应，不再只是一个库，而是新一代分析内核的“基础设施母体”。

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg Catalog 明显成为热点，谁掌握开放元数据入口，谁就更可能在湖仓生态中占据枢纽位置。

- **[apache/fluss](https://github.com/apache/fluss)**  
  流式存储为实时分析而生，值得重点关注其是否会成为流批湖仓之间的新连接层。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新列式文件格式虽仍早期，但一旦在压缩、可扩展 schema 或云对象存储读写模型上形成优势，可能影响后续湖仓底层设计。

- **[Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) / [chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  “把 OLAP 带到已有系统里”的趋势增强：一个进入 Postgres，一个变成 in-process 引擎，都在降低分析能力部署门槛。  

如果你愿意，我还可以把这份日报继续整理成：
1. **表格版清单**，便于发周报/飞书；  
2. **投资/技术雷达版**，按“成熟/上升/早期实验”三层输出；  
3. **中文 Markdown 发布版**，可直接粘贴到公众号或知识库。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*