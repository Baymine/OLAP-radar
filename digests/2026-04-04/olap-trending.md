# OLAP & 数据基础设施开源趋势日报 2026-04-04

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-04-04 01:21 UTC

---

# OLAP & 数据基础设施开源趋势日报
日期：2026-04-04

---

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中明确属于 OLAP/数据基础设施/分析引擎相关的项目仅有 1 个**：

- [google-research/timesfm](https://github.com/google-research/timesfm) — 时间序列基础模型，可归入广义数据分析/时序分析基础设施

其余 Trending 项目如 AI chat、demo 工具、prompt 集合、用户名搜索、编辑器工具等，**不属于 OLAP/数据基础设施主线**，已排除。

主题搜索结果中的 72 个仓库里，大多数与数据基础设施高度相关，纳入后续分类分析。

---

## 二、分类视图

> 说明：一个项目可跨类出现，但以下按其**最主要定位**归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [questdb/questdb](https://github.com/questdb/questdb)
- [timescale/timescaledb](https://github.com/timescale/timescaledb)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [crate/crate](https://github.com/crate/crate)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)

### 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [apache/polaris](https://github.com/apache/polaris)
- [apache/gravitino](https://github.com/apache/gravitino)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [apache/fluss](https://github.com/apache/fluss)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)

### ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache)
- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever)

### 🔗 数据集成与 ETL
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [cloudera/hue](https://github.com/cloudera/hue)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [getredash/redash](https://github.com/getredash/redash)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)

---

## 三、今日速览

1. 今日 GitHub 实时热榜里，**纯 OLAP/数据基础设施项目曝光不多**，但 [TimesFM](https://github.com/google-research/timesfm) 作为时间序列基础模型登榜，说明“时序分析 + AI”正在成为数据领域新的流量入口。  
2. 从主题搜索结果看，**传统 OLAP 引擎格局仍由 ClickHouse、Doris、StarRocks、DuckDB、Trino/DataFusion 等主导**，社区关注点继续集中在实时分析、湖仓查询和嵌入式分析。  
3. 湖仓方向的重心正在从“表格式本身”向**Catalog、元数据治理、流式湖仓存储**延展，Polaris、Gravitino、Lakekeeper、Fluss 这类项目值得重点关注。  
4. Rust 生态在数据基础设施中的渗透继续增强：Databend、DataFusion、Lakekeeper、pg_mooncake、ParadeDB 等项目构成了明显的“Rust 数据栈”趋势。  
5. 数据工程与 AI 的交叉继续升温，多个项目开始强调 **AI-ready / agent-ready / hybrid search / in-database AI workflows**，反映出分析引擎正在向智能应用底座演化。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,686  
  实时分析数据库代表项目，仍是开源 OLAP 领域的事实标准之一，湖仓与高速聚合能力持续吸引社区关注。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,164  
  嵌入式分析数据库的标杆，适合本地分析、数据科学和轻量数仓场景，长期保持高热度。

- [apache/doris](https://github.com/apache/doris) — ⭐15,175  
  面向统一分析与实时查询的 MPP OLAP 系统，在湖仓与高并发分析场景中持续活跃。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,539  
  强调亚秒级分析与湖仓查询能力，是近年云原生分析数据库路线中的核心玩家。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,823  
  高性能时序 OLAP 数据库，适用于监控、IoT、行情等高写入高查询场景，代表时序分析基础设施方向。

- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,946  
  将实时分析能力直接带入 Postgres 表，是“OLAP on Postgres”路线的重要实验项目。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,653  
  基于 ClickHouse 的进程内 OLAP 引擎，适合嵌入式分析与轻部署场景，体现了 OLAP 引擎轻量化趋势。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone) — ⭐1,866  
  强调 AI-native HTAP、向量检索和 Git-for-Data，说明数据库正在从单纯分析引擎向智能数据底座扩展。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐707  
  面向大型列式数据集的新型文件格式，可视为新一代 columnar storage 探索，值得关注其与 Arrow/Parquet 生态的关系。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,890  
  Apache Iceberg 的开放 catalog 项目，反映湖仓生态竞争点正从表格式扩展到元数据控制面。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,933  
  面向联邦与地理分布式场景的数据目录，说明 metadata lake 正成为湖仓架构中的关键层。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,239  
  Rust 编写的 Iceberg REST Catalog，兼顾性能与安全，代表轻量 catalog 服务化方向。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,227  
  主打实时摄取、并发更新与增量分析，是偏实时湖仓框架的重要项目。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,841  
  面向实时分析的 streaming storage，体现“流式存储即湖仓底座”的新趋势。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,226  
  统一分析、搜索、AI 与 Python 沙箱的数据仓库，S3 原生架构非常贴合现代 lakehouse 演进方向。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,688  
  分布式 SQL 查询引擎代表，仍是跨数据源联邦查询和湖仓访问的重要基础设施。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,677  
  经典分布式查询引擎，社区基盘依然很强，是理解当代湖仓查询架构的核心项目之一。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,557  
  Arrow 原生 SQL 查询引擎，已成为 Rust 数据系统生态的计算内核，扩展速度很快。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,004  
  DataFusion 的分布式执行形态，展示了 Rust 查询栈向集群化演进的方向。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐196  
  Firebolt 开源核心查询引擎，虽然 star 体量不大，但对高性能云数仓内核爱好者具有研究价值。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,622  
  存储无关的 MySQL 兼容查询引擎，适合定制数据库和嵌入式 SQL 服务场景。

- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐396  
  面向 DataFusion 的 pushdown cache，属于查询加速与执行层优化方向的细分创新。

---

## 🔗 数据集成与 ETL

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,313  
  面向 Apache Iceberg/Parquet 的高性能复制与摄取工具，直接对接实时分析落地需求。

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,167  
  轻量数据加载框架，强调“开发者友好”的数据装载体验，是现代 ELT 工具的重要代表。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,384  
  面向事件采集和数据分发的 Segment 替代方案，适合建设行为数据与产品分析管道。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,648  
  开源 Reverse ETL，反映数据栈价值链正从仓内分析继续向业务系统回流。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  可配置 ETL 工具，虽不算热点头部，但适合关注传统 ETL 在开源生态中的长尾需求。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset) — ⭐72,207  
  开源 BI 与数据探索平台龙头，长期是数仓与分析引擎落地展示层的标准选择。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,733  
  易用型 BI 工具代表，持续覆盖中小团队自助分析场景。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,960  
  虽偏 observability，但其多数据源分析与可视化能力使其成为数据平台展示层的重要一环。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐981  
  分析数据库 benchmark 项目，在数据库选型和性能对比中影响力很高。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,296  
  dbt-native 数据可观测性工具，反映数据质量与管道可观测性已成为现代数据工程标配。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,445  
  面向数据库/仓库的 SQL Query Assistant，适合作为多数据源查询入口。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,323  
  老牌数据可视化与查询分享工具，仍在很多自建分析平台中保有生命力。

---

## 五、趋势信号分析

今天最值得注意的信号不是传统 OLAP 项目直接冲上 Trending，而是**数据分析正在与 AI、时序和 agent 场景更深地结合**。[TimesFM](https://github.com/google-research/timesfm) 登上实时热榜，说明时间序列预测正从垂直算法问题转向“可复用的数据基础模型”，这会反向拉动时序存储、特征组织和分析引擎需求。与此同时，主题搜索中可以看到另一条清晰主线：**湖仓竞争已从存储层延伸到 catalog、元数据治理、流式存储与统一控制面**，如 Polaris、Gravitino、Lakekeeper、Fluss。查询层方面，DataFusion、Trino、Presto 以及围绕它们的缓存和分布式执行项目表明，**开放查询内核 + 云对象存储 + Arrow/Iceberg** 仍是当下主流技术组合。整体看，近期湖仓/云数仓的发展已经从“建仓”走向“统一元数据、实时写入、AI-ready 查询服务”的新阶段。

---

## 六、社区关注热点

- **[google-research/timesfm](https://github.com/google-research/timesfm)**  
  今日 Trending 中唯一明确相关的数据项目，代表“时序基础模型”正在进入数据工程师视野。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新型列式文件格式值得重点跟踪，可能影响未来列存与湖仓文件层的演化路径。

- **[apache/polaris](https://github.com/apache/polaris) / [apache/gravitino](https://github.com/apache/gravitino) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  catalog 与元数据控制面正在成为湖仓下一阶段竞争焦点，值得系统关注。

- **[apache/datafusion](https://github.com/apache/datafusion) / [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)**  
  Rust 查询栈成熟度持续提升，未来可能成为新一代嵌入式和分布式分析系统的重要底座。

- **[Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) / [chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  “嵌入式 OLAP”与“Postgres 内分析增强”持续升温，反映分析能力正加速向应用侧靠近。

--- 

如果你愿意，我还可以继续把这份日报补充成：
1. **Top 10 项目对比表**，或  
2. **“与昨天/上周相比”的趋势变化版**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*