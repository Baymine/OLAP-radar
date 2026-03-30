# OLAP & 数据基础设施开源趋势日报 2026-03-30

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-30 01:45 UTC

---

# OLAP & 数据基础设施开源趋势日报  
**日期：2026-03-30**

---

## 一、过滤结果

基于今日 **Trending 榜单** 与 **数据基础设施主题搜索** 两组数据，筛选后与 **OLAP / 数据基础设施 / 分析引擎** 明确相关的项目如下：

### 来自 Trending 榜单的有效项目
仅保留 1 个：
- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB) — 金融数据平台，属于数据分析平台/数据工具范畴

> 其余 Trending 项目主要为 AI agent、语音、插件、系统工具、CRM 等，与 OLAP/数据基础设施关系不直接，已略去。

### 来自主题搜索的有效项目
涵盖以下方向：
- OLAP/分析数据库：ClickHouse、DuckDB、Doris、StarRocks、QuestDB、Databend、CrateDB、MatrixOne、Cloudberry 等
- 查询/计算引擎：Trino、Presto、DataFusion、Ballista、go-mysql-server、Firebolt Core 等
- 湖仓/目录/实时分析存储：Polaris、Gravitino、Fluss、Lakekeeper、pg_mooncake、YTsaurus、OLake 等
- 数据集成与装载：dlt、RudderStack、Multiwoven、OLake 等
- 数据工具/BI/观测：Superset、Metabase、Grafana、PostHog、Redash、Langfuse、Elementary、ClickBench、Hue 等

---

## 二、分类结果

> 说明：一个项目可跨类，这里按“最主要定位”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [crate/crate](https://github.com/crate/crate)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake)

### 📦 存储格式与湖仓
- [apache/polaris](https://github.com/apache/polaris)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/fluss](https://github.com/apache/fluss)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [pixelsdb/pixels](https://github.com/pixelsdb/pixels)

### ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [roapi/roapi](https://github.com/roapi/roapi)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [Canner/wren-engine](https://github.com/Canner/wren-engine)

### 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [PostHog/posthog](https://github.com/PostHog/posthog)（含数据仓库/CDP能力）
- [tuva-health/tuva](https://github.com/tuva-health/tuva)

### 🧰 数据工具
- [grafana/grafana](https://github.com/grafana/grafana)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [getredash/redash](https://github.com/getredash/redash)
- [PostHog/posthog](https://github.com/PostHog/posthog)
- [plausible/analytics](https://github.com/plausible/analytics)
- [umami-software/umami](https://github.com/umami-software/umami)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [cloudera/hue](https://github.com/cloudera/hue)
- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB)

---

## 三、日报正文

## 1）今日速览

1. 今日 GitHub 热榜中，真正进入数据基础设施视野的项目不多，但 [OpenBB](https://github.com/OpenBB-finance/OpenBB) 的上榜说明“面向分析师和 AI agent 的数据平台”仍在持续获得关注。  
2. 从主题搜索看，社区热度仍高度集中在 **OLAP 引擎 + 湖仓目录 + 查询层解耦** 三条主线，代表项目包括 ClickHouse、DuckDB、Doris、StarRocks、Trino、DataFusion、Polaris、Gravitino。  
3. 一个明显趋势是：越来越多项目开始强调 **AI-ready / agent-ready / unified analytics**，数据仓库、查询引擎与搜索/向量/实时摄取能力正在融合。  
4. 另一个值得关注的方向是 **轻量嵌入式分析**：DuckDB、chDB、DuckDB-Wasm、pg_mooncake 这类“嵌入式/原地分析”项目正在改变传统数仓只在服务端运行的形态。  
5. 湖仓生态中，围绕 **Iceberg Catalog、流式存储、跨源统一元数据** 的基础设施项目持续升温，显示行业正从“建仓”转向“统一治理与实时分析”。

---

## 2）各维度热门项目

### 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,591  
  实时分析数据库代表项目，列式执行与高吞吐分析能力仍是开源 OLAP 的核心标杆。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,041  
  嵌入式分析数据库事实标准之一，持续推动本地/进程内 OLAP 和开发者分析体验。

- [apache/doris](https://github.com/apache/doris) — ⭐15,161  
  面向统一分析的 MPP 数据库，在实时报表、明细聚合和湖仓联邦方面关注度稳定。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,515  
  主打亚秒级分析与 lakehouse 查询，代表“高性能 OLAP 与湖仓一体化”方向。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,797  
  时间序列 OLAP 数据库，适合实时监控、IoT、金融行情等高写入分析场景。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,215  
  强调 “Data Agent Ready Warehouse”，显示数仓产品正主动拥抱 AI 与对象存储原生架构。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,646  
  基于 ClickHouse 的进程内 OLAP SQL 引擎，适合 Python/本地分析场景，体现“轻量分析内嵌化”。

- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,945  
  在 Postgres 表之上做实时分析，反映 OLTP/OLAP 融合与原位分析需求上升。

---

### 📦 存储格式与湖仓

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,930  
  面向地理分布式和联邦场景的开放元数据目录，说明湖仓控制面正在成为竞争焦点。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,887  
  Apache Iceberg 开放 Catalog 项目，代表 Iceberg 标准化治理的核心基础设施。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,834  
  面向实时分析的流式存储，体现“批流边界消失、存储服务化”的趋势。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,231  
  Rust 实现的 Iceberg REST Catalog，说明湖仓元数据层正在走向更轻量和云原生。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,312  
  将数据库/Kafka/S3 快速复制到 Iceberg 或 Parquet，紧贴现代湖仓摄取需求。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐705  
  面向大规模列式数据的新文件格式，虽体量尚小，但属于潜在的新兴底层方向。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,146  
  大数据平台型项目，涵盖存储与计算，代表一体化湖仓/数据平台路线。

---

### ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,669  
  分布式 SQL 查询引擎代表，持续承接跨源联邦查询与湖仓访问层需求。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,669  
  老牌分布式查询引擎，仍是大数据查询层的重要参考实现。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,545  
  Rust 生态最重要的 SQL 查询引擎之一，已成为众多新一代数据库和数据应用的基础内核。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,001  
  DataFusion 的分布式延展，说明模块化执行内核正在向集群化演进。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,954  
  浏览器/边缘侧分析的重要尝试，推动“前端可运行 OLAP”成为现实。

- [roapi/roapi](https://github.com/roapi/roapi) — ⭐3,415  
  基于静态数据集快速生成 API，适合 Parquet/Arrow 数据服务化场景。

- [Canner/wren-engine](https://github.com/Canner/wren-engine) — ⭐613  
  面向 AI agents 的上下文查询引擎，说明语义层/查询层正在与 AI 工作流结合。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  开源化的高性能分布式查询引擎，值得关注其后续社区化速度。

---

### 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,145  
  Python 数据装载工具，强调“让加载更简单”，符合现代 ELT 工程的开发者趋势。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,380  
  Segment 替代方案，体现事件采集、CDP 与数据仓库集成的持续需求。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,645  
  开源 Reverse ETL，反映“仓到业务系统”的数据激活已成为成熟赛道。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,312  
  聚焦数据库/Kafka/S3 到 Iceberg/Parquet 的复制，契合湖仓摄取标准化趋势。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,269  
  虽核心是产品分析平台，但其 warehouse/CDP 一体化能力使其具备数据集成属性。

- [tuva-health/tuva](https://github.com/tuva-health/tuva) — ⭐300  
  面向医疗数据模型与质量测试，垂直行业数据工程开源化值得关注。

---

### 🧰 数据工具

- [apache/superset](https://github.com/apache/superset) — ⭐71,641  
  开源 BI 头部项目，适合连接现代 OLAP 与湖仓系统，生态成熟度高。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,835  
  虽偏可观测性，但已成为多源数据查询与可视化的重要统一入口。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,665  
  低门槛 BI 工具，适合团队级自助分析，持续保持强社区吸引力。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,269  
  产品分析、数据仓库、实验与会话回放一体化，代表“分析平台平台化”。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,309  
  经典 SQL 查询与可视化工具，仍是轻量 BI/分析工作流常见选择。

- [langfuse/langfuse](https://github.com/langfuse/langfuse) — ⭐24,021  
  LLM 观测平台，虽偏 AI 工程，但其“数据可观测/评测化”能力与分析工程正在融合。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,289  
  dbt-native 数据可观测方案，反映数据质量与管道监控成为基础能力。

- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB) — ⭐0（+137 today）  
  面向分析师、量化和 AI agent 的金融数据平台，是今日热榜里最明确的数据分析项目。

---

## 3）趋势信号分析

今天的信号并不来自传统 GitHub Trending 大规模刷榜，而更多体现在主题活跃项目的结构性变化。最值得关注的是，**“可嵌入、可组合、AI-ready 的数据基础设施”** 正在成为主流叙事：Databend、MatrixOne、Wren Engine、OpenBB 都在强调 agent 或 AI 工作流；DataFusion、DuckDB、chDB、DuckDB-Wasm 则说明查询能力正从“独立大系统”变成“可被嵌入的内核”。另一方面，湖仓方向继续向 **Iceberg Catalog、实时流式存储、开放元数据层** 收敛，Polaris、Gravitino、Lakekeeper、Fluss 形成了清晰的控制面与实时面布局。新兴格式层面，Nimble 这类列式文件格式仍处早期，但说明社区并未停止对底层存储表示的探索。整体上看，这与近期湖仓/云数仓演进高度一致：计算层解耦、存储对象化、目录标准化，以及面向实时和 AI 的统一分析平台，正成为开源生态的共同方向。

---

## 4）社区关注热点

- **[Databend](https://github.com/databendlabs/databend)**  
  直接打出 “Data Agent Ready Warehouse” 定位，值得关注其是否会定义新一代 AI 原生数仓产品形态。

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  已成为 Rust 数据系统的公共内核，未来很可能像 LLVM 之于编译器一样，成为查询引擎生态底座。

- **[Apache Polaris](https://github.com/apache/polaris) / [Apache Gravitino](https://github.com/apache/gravitino)**  
  湖仓竞争正在上移到 Catalog 和元数据治理层，Iceberg 生态标准化会持续放大这类项目的重要性。

- **[DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) / [chDB](https://github.com/chdb-io/chdb)**  
  “分析即库、分析即组件”的趋势非常明确，适合关注其在本地 BI、边缘分析、Notebook 与应用内分析中的渗透。

- **[OpenBB](https://github.com/OpenBB-finance/OpenBB)**  
  今日少数真正进入热榜的数据项目，说明垂直数据平台与 agent 结合的应用层机会仍然很大。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*