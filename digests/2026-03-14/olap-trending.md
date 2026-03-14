# OLAP & 数据基础设施开源趋势日报 2026-03-14

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-14 01:15 UTC

---

# OLAP & 数据基础设施开源趋势日报｜2026-03-14

## 一、过滤结果

基于今日 **Trending 榜单** 与 **主题搜索** 数据，明确属于 **OLAP / 数据基础设施 / 分析引擎** 相关的项目主要有：

- **来自 Trending 榜单**
  - [dolthub/dolt](https://github.com/dolthub/dolt) — 数据版本化数据库，属于数据基础设施
  - [langflow-ai/openrag](https://github.com/langflow-ai/openrag) — 严格说偏 RAG 平台，但依赖 OpenSearch、检索/数据索引基础设施，**弱相关**
  
> 其余 Trending 项目大多为 AI Agent、推理框架、浏览器自动化、语音或通用工具，**不纳入 OLAP/数据基础设施分析**。

- **来自主题搜索**
  - 明确相关：ClickHouse、Doris、StarRocks、Databend、DuckDB、QuestDB、DataFusion、Trino、Presto、dlt、Elementary、Superset、Metabase、ClickBench、Cloudberry、Fluss、Polaris、Lakekeeper、OLake 等
  - 弱相关但有数据基础设施属性：MindsDB、Langfuse、PostHog、Rudder、Wren Engine、chDB、duckdb-wasm 等

---

## 二、分类结果

> 说明：一个项目可跨类，这里按“**最主要定位**”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [questdb/questdb](https://github.com/questdb/questdb)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)

### 📦 存储格式与湖仓
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/fluss](https://github.com/apache/fluss)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [relytcloud/pg_ducklake](https://github.com/relytcloud/pg_ducklake)
- [databendlabs/databend](https://github.com/databendlabs/databend)

### ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)

### 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [cloudera/hue](https://github.com/cloudera/hue)
- [grafana/grafana](https://github.com/grafana/grafana)
- [dolthub/dolt](https://github.com/dolthub/dolt)
- [Canner/wren-engine](https://github.com/Canner/wren-engine)

---

## 1. 今日速览

今天 GitHub 数据基础设施方向的直接 Trending 热度并不高，**唯一明确进入实时热榜的核心数据项目是 [Dolt](https://github.com/dolthub/dolt)**，说明“数据版本化/可审计数据管理”仍持续受到关注。  
从主题搜索看，社区热度依旧集中在三条主线：**高性能 OLAP 引擎、Iceberg/湖仓 Catalog、轻量嵌入式分析引擎**。  
尤其值得注意的是，**Databend、StarRocks、Doris、ClickHouse、DuckDB** 继续构成开源分析数据库主力阵营；而 **Polaris、Lakekeeper、Gravitino** 则代表了湖仓元数据与开放 Catalog 生态的持续升温。  
此外，**DataFusion / Ballista / DuckDB-Wasm / chDB** 体现出“可嵌入、可分发、面向开发者”的新一代查询计算形态正在稳步扩张。

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)  
  ⭐46,321  
  实时分析数据库代表项目，仍是列式 OLAP 与日志/观测分析场景的事实标准之一，社区体量和生态成熟度持续领先。

- [duckdb/duckdb](https://github.com/duckdb/duckdb)  
  ⭐36,645  
  轻量嵌入式分析数据库，因“本地分析 + Parquet + 开发者友好”持续强势，是现代单机 OLAP 的核心代表。

- [apache/doris](https://github.com/apache/doris)  
  ⭐15,105  
  面向统一分析与高并发查询的 MPP OLAP 数据库，在实时数仓和即席分析场景中保持高关注。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)  
  ⭐11,475  
  强调亚秒级分析和湖仓统一查询，近年在实时分析、明细宽表与 Lakehouse 查询加速方向存在明显上升势头。

- [questdb/questdb](https://github.com/questdb/questdb)  
  ⭐16,756  
  专注时序 OLAP，适合高吞吐写入与实时聚合分析，在可观测性、IoT、金融行情等场景持续活跃。

- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)  
  ⭐10,015  
  HTAP/分布式数据库代表，兼顾事务与分析，并开始更明确地向 AI 与混合工作负载叙事靠拢。

- [apache/cloudberry](https://github.com/apache/cloudberry)  
  ⭐1,191  
  开源 MPP 数仓路线的重要补位者，作为 Greenplum 替代方向值得关注。

- [chdb-io/chdb](https://github.com/chdb-io/chdb)  
  ⭐2,639  
  ClickHouse 内核的进程内 OLAP 引擎，反映“OLAP 引擎库化/嵌入式”趋势继续增强。

---

## 📦 存储格式与湖仓

- [databendlabs/databend](https://github.com/databendlabs/databend)  
  ⭐9,197  
  以对象存储为中心重构的数据仓库，强调 Analytics、Search、AI 一体化，是湖仓原生架构中的高关注项目。

- [apache/gravitino](https://github.com/apache/gravitino)  
  ⭐2,905  
  联邦式开放元数据目录，面向多引擎、多地域和多租户治理，是湖仓控制面演进的重要信号。

- [apache/polaris](https://github.com/apache/polaris)  
  ⭐1,872  
  Apache Iceberg 开放 Catalog 核心项目，说明 Iceberg 生态正在从“表格式”进一步走向“标准化控制平面”。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  ⭐1,221  
  Rust 编写的 Iceberg REST Catalog，突出了轻量、安全和高性能元数据服务的市场需求。

- [apache/fluss](https://github.com/apache/fluss)  
  ⭐1,816  
  面向实时分析的流式存储项目，值得关注其在“流处理 + 分析存储”融合方向的潜力。

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  ⭐1,307  
  面向 Iceberg/Parquet 的实时摄取工具，直接连接数据库、Kafka、S3，体现湖仓 ingestion 层正在标准化。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)  
  ⭐696  
  新型列式文件格式，虽然仍较早期，但表明社区仍在探索更高效的列式数据表示。

- [relytcloud/pg_ducklake](https://github.com/relytcloud/pg_ducklake)  
  ⭐53  
  将 Postgres 与 DuckDB / DuckLake 结合，代表“传统数据库接口 + 湖仓底座”的新尝试。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino)  
  ⭐12,635  
  联邦 SQL 查询引擎代表，在多源数据虚拟化、Lakehouse 查询和企业大数据分析中依然非常关键。

- [prestodb/presto](https://github.com/prestodb/presto)  
  ⭐16,668  
  经典分布式 SQL 引擎，仍是大数据查询层的重要基石，持续保持较高社区影响力。

- [apache/datafusion](https://github.com/apache/datafusion)  
  ⭐8,499  
  Rust 查询执行引擎的代表项目，受益于 Arrow 生态扩张，已成为新一代数据库/计算引擎的重要内核。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)  
  ⭐1,993  
  DataFusion 的分布式延展，代表“轻内核 + 分布式执行层”的模块化查询架构方向。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)  
  ⭐1,940  
  浏览器内分析 SQL 引擎，说明 OLAP 能力正不断前移到边缘、前端和本地端执行环境。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)  
  ⭐2,617  
  存储无关的 MySQL 兼容查询引擎，适合二次开发与定制数据库内核场景。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)  
  ⭐193  
  Firebolt 的自托管分布式查询引擎版本，值得关注其是否会带动云数仓内核开源化讨论。

- [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)  
  ⭐112  
  SQL-on-everything 方向的小而新项目，契合“就地查询、多格式、多数据源”的工程需求。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)  
  ⭐5,041  
  Python 生态中极具开发者友好的加载工具，简化数据抽取与落仓流程，适合现代 ELT 工作流。

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  ⭐1,307  
  面向 Iceberg/Parquet 的高速复制与摄取工具，直接贴近实时湖仓构建需求。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)  
  ⭐4,374  
  Segment 替代方案，数据采集与路由基础设施能力成熟，在 CDP/事件流场景仍有稳定关注。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)  
  ⭐1,643  
  开源 Reverse ETL，反映“仓到业务系统”的数据回流需求正在常态化。

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)  
  ⭐3,706  
  基于 Flink 的实时数据开发平台，体现流式 ETL 和实时数仓工程化平台需求旺盛。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)  
  ⭐161  
  经典 ETL 工具形态，虽然体量较小，但仍代表配置驱动数据处理的稳定需求。

---

## 🧰 数据工具

- [dolthub/dolt](https://github.com/dolthub/dolt)  
  ⭐0（+60 today）  
  “Git for Data”，是今日实时热榜中唯一明确的数据基础设施项目；其数据版本管理、审计、回滚能力对数据协作极具吸引力。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)  
  ⭐969  
  分析数据库基准测试项目，在多家 OLAP 引擎竞争加剧背景下，基准透明度和可复现性越来越重要。

- [apache/superset](https://github.com/apache/superset)  
  ⭐70,950  
  开源 BI 平台龙头，适合作为 Lakehouse / OLAP 引擎上层可视化与探索入口。

- [metabase/metabase](https://github.com/metabase/metabase)  
  ⭐46,394  
  低门槛 BI 与查询工具，适合中小团队快速建立数据消费层。

- [elementary-data/elementary](https://github.com/elementary-data/elementary)  
  ⭐2,273  
  dbt 原生数据可观测性方案，显示数据质量与管道监控已成为现代数仓标配。

- [cloudera/hue](https://github.com/cloudera/hue)  
  ⭐1,449  
  面向数据库和数仓的 SQL Assistant，适合多引擎环境下的查询入口统一。

- [grafana/grafana](https://github.com/grafana/grafana)  
  ⭐72,634  
  虽偏可观测性，但其多数据源可视化能力在时序分析、日志分析、指标查询中仍是关键数据工具。

- [Canner/wren-engine](https://github.com/Canner/wren-engine)  
  ⭐563  
  面向 MCP Client 与 AI Agent 的语义层引擎，值得关注其是否成为“AI 访问数仓”的新接口层。

---

## 3. 趋势信号分析

今天最明显的信号不是传统 OLAP 项目集中冲上 Trending，而是**数据基础设施正与 AI、检索、语义层深度耦合**。实时热榜中只有 [Dolt](https://github.com/dolthub/dolt) 明确属于数据方向，说明短期爆发式流量仍被 Agent/RAG 占据；但从主题搜索看，社区长期关注并未偏离数据底座，反而更聚焦于三类能力：**高性能分析引擎（ClickHouse/DuckDB/StarRocks/Doris）**、**湖仓控制面（Polaris/Lakekeeper/Gravitino）**、以及**可嵌入查询内核（DataFusion/chDB/duckdb-wasm）**。  
新方向上，**Catalog 标准化**与**查询内核组件化**尤为突出：前者服务于 Iceberg 湖仓的多引擎互通，后者则让 SQL/OLAP 能力嵌入应用、浏览器和 AI 工作流。与近期湖仓/云数仓演进一致，开源社区正在从“构建数据库”转向“构建开放数据控制平面 + 轻量执行层 + 开发者接口”。

---

## 4. 社区关注热点

- **[dolthub/dolt](https://github.com/dolthub/dolt)**  
  今日少数进入实时热榜的数据项目，数据版本管理正在成为数据协作、审计与可回滚工作流的重要能力。

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) / [apache/gravitino](https://github.com/apache/gravitino)**  
  Iceberg 与联邦元数据目录明显升温，说明湖仓竞争正在从存储层转向 Catalog/控制面。

- **[apache/datafusion](https://github.com/apache/datafusion) / [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) / [chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  查询引擎内核化、库化、浏览器化趋势非常明确，适合关注新一代嵌入式分析和 AI 应用集成场景。

- **[StarRocks/starrocks](https://github.com/StarRocks/starrocks) / [apache/doris](https://github.com/apache/doris) / [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)**  
  实时分析与湖仓查询加速仍是 OLAP 主战场，这几个项目代表当前开源分析数据库的核心竞争格局。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake) / [dlt-hub/dlt](https://github.com/dlt-hub/dlt)**  
  摄取层和 ELT 工具继续活跃，说明企业对“快速接入源系统并落地 Iceberg/Parquet”的需求正在持续放大。

如果你愿意，我可以进一步把这份日报继续整理成：
1. **表格版汇总**，  
2. **按“国内团队/海外团队”拆分版**，或  
3. **附带“值得跟踪的新秀项目 Top 10”版**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*