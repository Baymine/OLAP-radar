# OLAP & 数据基础设施开源趋势日报 2026-03-15

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-15 01:28 UTC

---

# OLAP & 数据基础设施开源趋势日报  
**日期：2026-03-15**

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中与 OLAP/数据基础设施明确相关的项目仅 1 个**：

- [langflow-ai/openrag](https://github.com/langflow-ai/openrag) — RAG 平台，包含检索、索引与 OpenSearch 集成，属于**数据检索/查询基础设施**范畴，可纳入广义数据基础设施观察范围。

其余 Trending 项目主要集中在 Agent、插件、浏览器、语音、代码生成等方向，**不属于 OLAP/分析引擎/数据基础设施核心范畴，已过滤掉**。

主题搜索结果中，大多数项目与 OLAP、湖仓、查询引擎、数据仓库、BI/分析工具直接相关，纳入后续分类分析。

---

## 二、分类结果

> 说明：一个项目可多重归类，下列按“主要属性”归入。

### 🗄️ OLAP 引擎
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [crate/crate](https://github.com/crate/crate)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)

### 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [apache/polaris](https://github.com/apache/polaris)
- [apache/gravitino](https://github.com/apache/gravitino)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [relytcloud/pg_ducklake](https://github.com/relytcloud/pg_ducklake)

### ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)
- [langflow-ai/openrag](https://github.com/langflow-ai/openrag)

### 🔗 数据集成与 ETL
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [Mmodarre/Lakehouse_Plumber](https://github.com/Mmodarre/Lakehouse_Plumber)

### 🧰 数据工具
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [getredash/redash](https://github.com/getredash/redash)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [cloudera/hue](https://github.com/cloudera/hue)
- [grafana/grafana](https://github.com/grafana/grafana)
- [PostHog/posthog](https://github.com/PostHog/posthog)

---

## 三、今日速览

今天 GitHub 数据基础设施方向的**实时热榜信号并不分散**，真正进入 Trending 的核心相关项目只有 [OpenRAG](https://github.com/langflow-ai/openrag)，说明短期社区注意力仍被 AI Agent 生态占据。  
但从主题活跃仓库看，**OLAP/湖仓主航道依然非常稳固**：DuckDB、ClickHouse、Doris、StarRocks、Trino、DataFusion 继续构成分析引擎核心版图。  
同时，**Iceberg Catalog 与湖仓元数据层**持续升温，[Apache Polaris](https://github.com/apache/polaris)、[Apache Gravitino](https://github.com/apache/gravitino)、[Lakekeeper](https://github.com/lakekeeper/lakekeeper) 共同反映“开放目录层”正在成为竞争焦点。  
另一个明显趋势是，**轻量嵌入式分析引擎与云对象存储原生架构**在靠拢：DuckDB、chDB、arc、Databend 等项目都在强调本地执行、S3 原生、统一分析与更低部署复杂度。  

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐36,654  
  轻量级嵌入式 OLAP 数据库，已成为本地分析与数据应用嵌入的事实标准之一，社区热度持续高位。

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,329  
  实时分析数据库代表项目，在日志、可观测性、实时报表与云数仓替代场景中仍最具影响力。

- [Apache Doris](https://github.com/apache/doris) — ⭐15,104  
  面向统一分析的 MPP 数据库，在湖仓融合、实时数仓和高并发查询场景持续活跃。

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,477  
  强调亚秒级分析和湖上查询能力，是当前湖仓分析引擎竞争中的核心玩家。

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,759  
  高性能时序 OLAP 数据库，受实时指标、IoT 和金融行情场景驱动，关注度稳定。

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,639  
  基于 ClickHouse 的 in-process OLAP SQL 引擎，适合嵌入式分析与 Python 工作流，体现“轻量分析内嵌化”趋势。

- [Basekick arc](https://github.com/Basekick-Labs/arc) — ⭐554  
  结合 DuckDB SQL + Parquet + Arrow 的单二进制分析数据库，代表新一代低运维分析引擎设计。

- [RayforceDB](https://github.com/RayforceDB/rayforce) — ⭐112  
  SIMD 加速列式分析数据库，虽体量不大，但体现底层执行层继续追求极致性能优化。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐696  
  面向大型列式数据集的新文件格式，值得关注其是否会对 Arrow/Parquet 生态形成补充或竞争。

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,875  
  Apache Iceberg 开放 Catalog 项目，反映湖仓竞争正从“表格式”延伸到“目录控制层”。

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,907  
  面向联邦与跨地域元数据治理的数据目录，契合多引擎、多云湖仓的管理需求。

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,221  
  Rust 实现的 Iceberg REST Catalog，强调安全、性能和易用性，是开放目录层的重要新势力。

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,817  
  面向实时分析的流式存储，体现“流存储 + 分析”融合趋势，值得实时数仓团队重点跟踪。

- [Databend](https://github.com/databendlabs/databend) — ⭐9,198  
  以对象存储为中心重构的数据仓库/湖仓系统，正在向“Analytics + Search + AI”统一平台演进。

- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,134  
  大数据平台型项目，兼具存储与计算属性，适合观察超大规模湖仓基础设施的工程实现方向。

---

## ⚙️ 查询与计算

- [Trino](https://github.com/trinodb/trino) — ⭐12,640  
  分布式 SQL 查询引擎标杆，仍是跨数据源联邦分析的重要基础设施。

- [Presto](https://github.com/prestodb/presto) — ⭐16,670  
  经典大数据 SQL 引擎，尽管生态竞争激烈，仍在企业级查询层拥有广泛基础。

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,501  
  Rust 查询引擎核心组件，正成为新一代数据库、OLAP 和自定义分析系统的重要内核。

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐1,993  
  DataFusion 的分布式扩展，适合观察 Rust 数据基础设施向集群化发展的路径。

- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,940  
  浏览器与边缘分析的重要基础组件，体现查询执行正在向 WebAssembly 与前端运行时下沉。

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐193  
  自托管版分布式查询引擎，说明云数仓厂商开始更开放地释放核心计算能力。

- [Opteryx](https://github.com/mabel-dev/opteryx) — ⭐112  
  “SQL-on-everything” 查询引擎，聚焦多格式、多数据源统一查询，符合现代数据访问抽象方向。

- [OpenRAG](https://github.com/langflow-ai/openrag) — ⭐0，**+564 today**  
  作为今日唯一进入 Trending 的相关项目，它把检索、索引、OpenSearch 与 RAG 平台整合，代表“查询基础设施向 AI 检索工作负载延伸”。

---

## 🔗 数据集成与 ETL

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,307  
  面向 Apache Iceberg/Parquet 的数据库、Kafka 与对象存储复制工具，贴近实时湖仓写入需求。

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,044  
  Python 数据加载工具，开发体验优秀，是现代 ELT 工程化链路中的高活跃项目。

- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐4,374  
  事件数据采集与分发平台，连接产品数据与下游仓库/分析系统，是 CDP 与数据管道的关键一环。

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,643  
  开源 Reverse ETL 方案，说明“从仓库回写业务系统”仍是数据基础设施重要赛道。

- [Dinky](https://github.com/DataLinkDC/dinky) — ⭐3,706  
  基于 Flink 的实时数据开发平台，反映流批一体管道编排仍受工程团队欢迎。

- [Lakehouse Plumber](https://github.com/Mmodarre/Lakehouse_Plumber) — ⭐51  
  面向 Databricks/Lakeflow 的元数据驱动管道框架，虽小众但切中企业湖仓自动化建设痛点。

---

## 🧰 数据工具

- [Apache Superset](https://github.com/apache/superset) — ⭐70,962  
  开源 BI 与数据探索平台龙头，仍是分析结果消费层的主流入口。

- [Metabase](https://github.com/metabase/metabase) — ⭐46,405  
  易用型 BI 工具代表，适合中小团队快速构建自助分析体系。

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐970  
  分析数据库基准测试项目，在多引擎竞争持续升温背景下，基准体系的重要性上升。

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,273  
  dbt-native 数据可观测性工具，体现现代数据栈正从“建模”走向“质量与可靠性治理”。

- [Hue](https://github.com/cloudera/hue) — ⭐1,449  
  面向数据库/仓库的 SQL 助手与交互工具，在多引擎环境下仍有稳定价值。

- [Grafana](https://github.com/grafana/grafana) — ⭐72,649  
  虽偏可观测性，但作为多数据源统一可视化平台，仍是数据分析基础设施的重要外围工具。

- [PostHog](https://github.com/PostHog/posthog) — ⭐32,031  
  集产品分析、数据仓库与事件平台于一体，反映应用分析平台与数据仓库边界持续融合。

---

## 五、趋势信号分析

今日最强的新增关注并非传统 OLAP 引擎，而是 [OpenRAG](https://github.com/langflow-ai/openrag) 这类**面向 AI 检索与索引编排的数据基础设施**。这说明社区对“数据系统服务 AI 工作负载”的兴趣正在快速升温：底层仍是索引、检索、查询与存储，但上层叙事从 BI/报表转向了 RAG、语义检索与 Agent 数据访问。与此同时，主题活跃项目显示，**湖仓控制面**正在成为新竞争焦点，尤其是 Iceberg Catalog 相关的 Polaris、Gravitino、Lakekeeper，表明行业关注点已从单纯“表格式标准”走向“跨引擎元数据互操作”。在执行层面，DuckDB、DataFusion、chDB、arc 等项目共同强化了一个趋势：**嵌入式、轻量化、对象存储原生、可组合查询内核**正在替代部分传统重型数仓架构。这与近期湖仓/云数仓演进高度一致——开放格式、解耦存储计算、统一批流与 AI/搜索负载，正在成为新一代数据平台的共同方向。

---

## 六、社区关注热点

- **[langflow-ai/openrag](https://github.com/langflow-ai/openrag)**  
  今日少数进入实时热榜的数据相关项目，值得关注其如何把 OpenSearch、检索与 RAG 工作流产品化。

- **[apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  建议作为一个方向整体观察：**Iceberg Catalog/元数据控制面**很可能成为 2026 年湖仓生态的关键战场。

- **[duckdb/duckdb](https://github.com/duckdb/duckdb)、[chdb-io/chdb](https://github.com/chdb-io/chdb)、[Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)**  
  轻量嵌入式分析引擎持续扩张，适合关注“应用内分析”“边缘分析”“本地优先数据处理”趋势。

- **[apache/datafusion](https://github.com/apache/datafusion) 与 [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)**  
  Rust 数据基础设施正在从单机查询内核走向分布式执行栈，值得数据库内核和平台团队重点跟踪。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新列式文件格式值得持续观察；若生态支持增强，可能对湖仓底层格式选择带来新变量。  

如果你愿意，我还可以把这份日报进一步整理成：
1. **表格版 Markdown**
2. **适合公众号/周报发布的长文版**
3. **只保留“值得跟踪的 10 个项目”的精简版**

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*