# OLAP & 数据基础设施开源趋势日报 2026-04-01

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-04-01 01:49 UTC

---

# OLAP & 数据基础设施开源趋势日报｜2026-04-01

## 1. 今日速览

1. 今日 GitHub Trending 榜单中，**严格意义上的 OLAP/数据基础设施项目很少**，仅有 **[PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)** 与 **[vas3k/TaxHacker](https://github.com/vas3k/TaxHacker)** 可勉强归入“数据提取/数据应用”相关，说明当日热度主要被 AI Agent 类项目占据，**基础数据引擎并未在实时热榜形成爆发**。  
2. 从主题搜索结果看，社区关注仍然高度集中在三条主线：**分析型数据库/OLAP 引擎**、**Lakehouse/开放表格式生态**、以及 **DataFusion / DuckDB / ClickHouse 周边的嵌入式与轻量查询栈**。  
3. **Rust 与 C++ 继续是底层数据基础设施的主力语言**：Databend、DataFusion、Lakekeeper、chDB、DuckDB 相关项目表现活跃，反映出高性能执行层与云原生控制面持续升温。  
4. 值得注意的是，**“AI-ready / AI-native analytics”** 已成为多个项目描述中的共性关键词，表明 OLAP 与数仓正在从 BI 服务扩展到 **Agent、检索、向量/混合查询、数据上下文服务**。  

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎（列式数据库、分析型查询引擎、MPP 系统）

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,619  
  实时分析数据库代表项目，列式存储与高并发分析能力依旧是 OLAP 领域事实标准之一，持续是生态锚点。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,099  
  嵌入式分析数据库的核心代表，适合本地分析、数据科学与轻量湖仓查询，仍是开发者侧最具扩散力的 OLAP 引擎。

- [apache/doris](https://github.com/apache/doris) — ⭐15,167  
  面向统一分析的高性能数据库，兼顾实时分析与交互式查询，是云数仓替代与国产 OLAP 体系的重要项目。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,526  
  以亚秒级查询和 Lakehouse 场景见长，今天值得关注在于其“湖上查询 + 高性能引擎”定位仍非常贴合当前市场需求。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,220  
  云原生 OLAP/数仓引擎，强调基于对象存储的统一架构，并显式走向 AI/搜索/分析融合。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,808  
  高性能时序数据库，适合实时指标与监控分析，反映“时序 + OLAP”仍是高热细分赛道。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone) — ⭐1,865  
  AI-native HTAP 数据库，集成向量搜索与分析能力，体现事务、分析、AI 检索融合的方向。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,646  
  基于 ClickHouse 的进程内 OLAP SQL 引擎，适合 Python/本地嵌入式分析，是“轻量执行内核”趋势的代表。

---

## 📦 存储格式与湖仓（表格格式、文件格式、湖仓框架）

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐706  
  面向大规模列式数据的新型文件格式，值得关注在于其直接落点于“下一代列式存储格式”这一底层基础设施方向。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,225  
  端到端实时 Lakehouse 框架，强调增量分析与云存储场景，贴近实时湖仓落地需求。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,927  
  联邦元数据湖项目，数据目录与跨地域元数据治理能力正在成为 Lakehouse 下一阶段竞争焦点。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,888  
  面向 Apache Iceberg 的开放 Catalog，体现 Iceberg 目录服务标准化和互操作生态继续扩张。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,233  
  Rust 编写的 Apache Iceberg REST Catalog，轻量、安全、云原生，说明 Iceberg 控制面生态正在细化。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,834  
  面向实时分析的流式存储项目，连接流处理与湖仓分析，是“Streaming Lakehouse”方向的重要信号。

- [apache/cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  成熟 MPP 数仓路线的开源替代，兼具仓库属性与大规模分析能力，是传统数仓开源化演进的一环。

- [pixelsdb/pixels](https://github.com/pixelsdb/pixels) — ⭐901  
  面向本地与云原生分析的存储与计算引擎，体现存算协同仍是湖仓底层优化重点。

---

## ⚙️ 查询与计算（查询引擎、向量化执行、查询优化）

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,548  
  Arrow 生态中的核心 SQL 查询引擎，已成为 Rust 数据系统的重要底座，今天依然是构建自定义分析引擎的首选组件之一。

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,676  
  分布式 SQL 查询引擎的事实标准之一，跨数据源联邦查询需求持续稳固其社区地位。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,673  
  经典分布式查询引擎，虽与 Trino 并行演化，但在企业查询栈与大数据生态中仍有深厚影响力。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,003  
  DataFusion 的分布式执行扩展，说明社区仍在推进 Rust 查询内核向分布式 OLAP 深化。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,959  
  DuckDB 的 WebAssembly 版本，把 OLAP 带入浏览器与边缘场景，是“无服务端分析”的代表方向。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,619  
  存储无关的 MySQL 兼容查询引擎，适合作为定制 SQL 层和嵌入式执行框架。

- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,946  
  在 Postgres 表上做实时分析，体现“OLTP 数据就地分析”与 Postgres 增强型 OLAP 的趋势。

- [cwida/pac](https://github.com/cwida/pac) — ⭐14  
  DuckDB 上的自动查询隐私化实验项目，虽然体量小，但在“分析 + 隐私保护”方向上具备前瞻性。

---

## 🔗 数据集成与 ETL（连接器、数据管道、写入工具）

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,158  
  Python 数据加载工具，强调低门槛将数据送入数仓/湖仓，是现代 ELT 工作流中的实用型基础设施。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,381  
  开源 CDP/事件管道，连接采集、路由与下游仓库，适合产品数据基础设施建设。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,646  
  开源 Reverse ETL，面向仓库到业务系统的数据回流，说明“仓内数据激活”仍是热点。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,313  
  面向 Iceberg/Parquet 的数据库、Kafka、S3 复制工具，直接服务实时湖仓摄取，今天最符合“现代湖仓入口层”趋势。

- [PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) — ⭐0（+439 today）  
  今日 Trending 中少数与“数据摄取”相关的项目，可将 PDF/图像转成结构化数据，适合作为非结构化数据入湖前置环节。

- [vas3k/TaxHacker](https://github.com/vas3k/TaxHacker) — ⭐0（+318 today）  
  自托管票据/交易分析应用，虽然不是底层数据基础设施，但反映了“文档解析 + LLM + 结构化财务数据”应用热度上升。

---

## 🧰 数据工具（监控、基准测试、SQL 工具、BI 集成）

- [apache/superset](https://github.com/apache/superset) — ⭐72,146  
  开源 BI 平台龙头，仍是数据探索、仪表盘和 SQL 分析最重要的开源入口之一。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,691  
  易用型 BI 工具代表，持续适合中小团队和业务自助分析场景。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,869  
  可观测性与分析可视化平台，已成为时序、日志、指标和多源数据查询展示的通用层。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,308  
  产品分析平台，已经从单一 analytics 扩展到数据仓库、实验、错误跟踪与 AI 助手，反映产品数据平台融合化。

- [plausible/analytics](https://github.com/plausible/analytics) — ⭐24,503  
  轻量隐私友好型网站分析工具，说明隐私驱动 analytics 仍有稳定社区需求。

- [langfuse/langfuse](https://github.com/langfuse/langfuse) — ⭐24,123  
  LLM 可观测与评估平台，虽偏 AI，但本质上属于新型分析/观测工具，反映“AI analytics”正在并入数据基础设施版图。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐979  
  分析数据库基准测试项目，是评估 OLAP 引擎性能的重要参考，适合持续追踪生态格局变化。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,444  
  SQL Query Assistant 工具，连接数据库与数仓，体现“统一查询入口”在数据平台中的长期价值。

---

## 3. 趋势信号分析

今天实时 Trending 对 OLAP 基础软件并不友好，说明 GitHub 当日流量被 Agent/应用层 AI 项目明显虹吸；但从主题搜索看，**真正获得持续社区关注的仍是分析引擎、Lakehouse 控制面和轻量查询内核**。最明显的信号是：一类数据工具正在稳定升温——**“可嵌入、可本地化、可与 AI 工作流结合”的分析引擎**，如 DuckDB、chDB、DataFusion、DuckDB-WASM。它们比传统重型 MPP 更适合作为 Agent、Notebook、浏览器、边缘任务中的执行层。  
另一方面，**新兴热点并非全新 SQL 范式，而是存储/目录层的细化分工**：Iceberg Catalog、元数据联邦、流式存储开始形成独立项目带，Lakekeeper、Polaris、Gravitino、Fluss 都说明湖仓正在从“表格式之争”进入“控制面与实时性之争”。这与近期湖仓/云数仓演进高度一致：底层对象存储标准化后，竞争焦点正上移到**目录、治理、实时写入、开放计算接口**。  

---

## 4. 社区关注热点

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎底座地位越来越稳，适合关注其在自定义 OLAP、Data App、AI 数据服务中的扩散。

- **[duckdb/duckdb](https://github.com/duckdb/duckdb)** + **[duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)**  
  本地分析与浏览器内分析继续走强，说明“嵌入式 OLAP”仍是未来几年最重要方向之一。

- **[apache/polaris](https://github.com/apache/polaris)** / **[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)** / **[apache/gravitino](https://github.com/apache/gravitino)**  
  建议重点跟踪 Iceberg Catalog 与元数据治理生态，这直接决定开放湖仓的互操作与平台化能力。

- **[databendlabs/databend](https://github.com/databendlabs/databend)** / **[matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)**  
  “AI-native 数仓/数据库”已从概念走向产品定位，值得关注其是否真正把分析、检索、Agent 执行整合为统一数据平面。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)** / **[dlt-hub/dlt](https://github.com/dlt-hub/dlt)**  
  湖仓竞争不只在查询层，数据入口与复制链路同样关键；实时摄取、CDC、Iceberg 写入能力会成为平台选型核心指标。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*