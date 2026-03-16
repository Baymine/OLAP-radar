# OLAP & 数据基础设施开源趋势日报 2026-03-16

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-16 01:28 UTC

---

# OLAP & 数据基础设施开源趋势日报｜2026-03-16

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中与 OLAP/数据基础设施明确相关的项目基本没有传统数据仓库/OLAP 引擎项目上榜**。大多数热榜项目集中在 AI Agent、代码工具、浏览器自动化等方向，应予排除。

在 Trending 榜单中，**可勉强纳入“数据基础设施相关观察样本”**的只有：
- [volcengine/OpenViking](https://github.com/volcengine/OpenViking)：上下文数据库，偏 AI memory / context infra，不属于经典 OLAP，但属于“新型数据基础设施”
- [topoteretes/cognee](https://github.com/topoteretes/cognee)：AI Agent Memory Engine，更接近知识/记忆层，不属于 OLAP 主线
- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus)：知识图谱/Graph RAG 代码情报工具，非典型数据工程项目

**因此本日报的主体分析将以主题搜索结果中的 OLAP / 查询引擎 / 湖仓 / ETL / 数据工具项目为主。**

---

## 二、今日速览

1. **今日 GitHub 热榜对传统 OLAP 并不友好**，流量明显被 AI Agent 基础设施吸走，但这恰恰说明“数据层”正在向 **agent-ready / context-ready** 演进。  
2. 在数据工程主线上，社区关注度仍高度集中于 **Doris、Trino、DataFusion、DuckDB、ClickHouse、StarRocks、Databend** 等分析引擎与湖仓查询栈。  
3. 新信号是：**嵌入式/轻量分析引擎** 与 **Rust 驱动的数据基础设施** 持续升温，如 [databendlabs/databend](https://github.com/databendlabs/databend)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)、[apache/datafusion](https://github.com/apache/datafusion)、[chdb-io/chdb](https://github.com/chdb-io/chdb)。  
4. 另一个值得注意的方向是 **开放元数据与 Iceberg Catalog 生态**，如 [apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)，与湖仓标准化趋势高度一致。  

---

## 三、各维度热门项目

## 🗄️ OLAP 引擎

### 1) [apache/doris](https://github.com/apache/doris)
- Stars：15,111
- 说明：统一分析数据库代表项目，覆盖实时分析、报表与湖仓查询，是当前国内外社区都很稳健的 OLAP 主力选手。

### 2) [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- Stars：46,344
- 说明：实时分析数据库标杆，列式执行和高吞吐查询能力仍是行业基准，持续占据分析型数据库核心位置。

### 3) [duckdb/duckdb](https://github.com/duckdb/duckdb)
- Stars：36,678
- 说明：嵌入式分析数据库事实标准之一，适合本地分析、数据科学和轻量湖仓访问，仍然是最强势的开发者型 OLAP 项目之一。

### 4) [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- Stars：11,479
- 说明：面向亚秒级分析和湖仓融合查询，适合高并发交互式 BI，是近年增长最稳的 MPP OLAP 代表。

### 5) [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- Stars：10,014
- 说明：从分布式事务数据库向 HTAP/AI 工作负载延展，说明 OLTP/OLAP 一体化仍是大型数据库演进主线。

### 6) [questdb/questdb](https://github.com/questdb/questdb)
- Stars：16,764
- 说明：时序 OLAP 代表，实时摄取与 SQL 分析能力突出，适用于监控、IoT、金融时序场景。

### 7) [chdb-io/chdb](https://github.com/chdb-io/chdb)
- Stars：2,639
- 说明：将 ClickHouse 能力嵌入进程内，是“嵌入式 OLAP”趋势的重要样本，适合 Python/本地分析工作流。

### 8) [crate/crate](https://github.com/crate/crate)
- Stars：4,368
- 说明：结合分布式 SQL 与近实时分析能力，偏工业、IoT 与检索分析混合场景。

---

## 📦 存储格式与湖仓

### 1) [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- Stars：697
- 说明：面向大规模列式数据的新文件格式，是今天最值得留意的“新存储格式”信号之一。

### 2) [apache/polaris](https://github.com/apache/polaris)
- Stars：1,877
- 说明：Apache Iceberg 开放 Catalog 项目，反映湖仓生态正在围绕开放元数据层继续标准化。

### 3) [apache/gravitino](https://github.com/apache/gravitino)
- Stars：2,907
- 说明：联邦元数据湖目录方案，强调跨区域、跨引擎、跨湖仓元数据治理，契合多引擎时代。

### 4) [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- Stars：1,221
- 说明：Rust 编写的 Iceberg REST Catalog，体现湖仓控制面正在走向轻量化、高性能与云原生。

### 5) [apache/fluss](https://github.com/apache/fluss)
- Stars：1,819
- 说明：面向实时分析的流式存储，值得关注其是否成为流批一体湖仓中的新底座。

### 6) [databendlabs/databend](https://github.com/databendlabs/databend)
- Stars：9,200
- 说明：统一数仓/分析/搜索/AI Sandbox 的 S3 原生架构，是“面向 AI 的湖仓”代表项目。

### 7) [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- Stars：2,134
- 说明：大数据平台型基础设施，覆盖存储与计算协同，适合观察超大规模数据平台演进路径。

---

## ⚙️ 查询与计算

### 1) [trinodb/trino](https://github.com/trinodb/trino)
- Stars：12,640
- 说明：跨数据源分布式 SQL 查询引擎标杆，仍是联邦查询和数据虚拟化最重要的开源基座之一。

### 2) [apache/datafusion](https://github.com/apache/datafusion)
- Stars：8,504
- 说明：Rust 查询引擎核心项目，既可独立使用，也常被二次构建，是现代查询执行内核的重要基础设施。

### 3) [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- Stars：1,993
- 说明：DataFusion 的分布式执行扩展，反映 Rust 查询栈正在从嵌入式走向分布式。

### 4) [prestodb/presto](https://github.com/prestodb/presto)
- Stars：16,670
- 说明：虽然生态重心部分转向 Trino，但 Presto 仍是大规模 SQL-on-anything 的重要历史与现实力量。

### 5) [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- Stars：2,617
- 说明：存储无关的 MySQL 兼容查询引擎，适合嵌入式 SQL 层和自定义数据库内核实验。

### 6) [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)
- Stars：112
- 说明：面向“query data where it lives”的 SQL-on-everything 引擎，体现轻量联邦查询需求仍在增长。

### 7) [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)
- Stars：112
- 说明：SIMD 加速列式数据库，虽然体量不大，但体现了“小而快”的本地分析引擎创新趋势。

### 8) [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- Stars：1,941
- 说明：浏览器内 OLAP 查询引擎，说明分析计算正在前移到客户端和边缘执行环境。

---

## 🔗 数据集成与 ETL

### 1) [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- Stars：5,047
- 说明：Python 数据加载工具，开发体验优秀，是现代数据工程中“轻量 ELT”路线的代表。

### 2) [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- Stars：4,374
- 说明：事件采集与数据投递基础设施，适合 CDP、埋点、实时管道场景，是数据入口层的重要项目。

### 3) [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- Stars：1,643
- 说明：开源 Reverse ETL，体现仓到业务系统的回流链路正在成为现代数据栈标配。

### 4) [datazip-inc/olake](https://github.com/datazip-inc/olake)
- Stars：1,307
- 说明：数据库/Kafka/S3 到 Iceberg 或 Parquet 的高性能复制工具，直接贴合实时湖仓写入需求。

### 5) [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)
- Stars：161
- 说明：经典 ETL 配置化路线代表，虽然不新，但对企业场景仍有现实价值。

### 6) [elbwalker/walkerOS](https://github.com/elbwalker/walkerOS)
- Stars：327
- 说明：偏数据采集治理的开源 tag manager，适合前端事件数据规范化接入。

---

## 🧰 数据工具

### 1) [apache/superset](https://github.com/apache/superset)
- Stars：70,975
- 说明：最强势开源 BI 平台之一，依旧是数仓/OLAP 项目的默认可视化出口。

### 2) [metabase/metabase](https://github.com/metabase/metabase)
- Stars：46,411
- 说明：易用型 BI 工具代表，适合中小团队快速构建分析门户。

### 3) [grafana/grafana](https://github.com/grafana/grafana)
- Stars：72,677
- 说明：虽以可观测性为主，但多数据源分析与统一可视化能力使其持续处于数据工具核心生态位。

### 4) [elementary-data/elementary](https://github.com/elementary-data/elementary)
- Stars：2,273
- 说明：dbt 原生数据可观测性工具，反映“数据质量与监控”已经从加分项变成刚需。

### 5) [cloudera/hue](https://github.com/cloudera/hue)
- Stars：1,449
- 说明：经典 SQL 工作台与仓库交互入口，在企业数据平台中仍具稳定价值。

### 6) [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- Stars：971
- 说明：分析型数据库基准测试项目，是比较 OLAP 系统性能的重要公共参照。

### 7) [apache/doris-mcp-server](https://github.com/apache/doris-mcp-server)
- Stars：266
- 说明：把 Doris 接入 MCP/Agent 生态，说明传统 OLAP 正在主动拥抱 AI 调用接口层。

### 8) [PostHog/posthog](https://github.com/PostHog/posthog)
- Stars：32,042
- 说明：产品分析、数据仓库、CDP 与实验平台融合，代表“分析工具平台化”的趋势。

---

## 四、趋势信号分析

今日最强的外部信号并不来自传统 OLAP 热榜，而是来自 **AI Agent 基础设施对“数据层”的重新定义**。像 [volcengine/OpenViking](https://github.com/volcengine/OpenViking) 这类“context database”虽非经典分析引擎，却说明社区正把数据库能力扩展到记忆、上下文、知识组织与 agent runtime。与此同时，OLAP 主线上最清晰的趋势仍是三条：**一是 Rust 查询栈持续增强**，DataFusion、Databend、Lakekeeper 等项目形成从执行引擎到 catalog 的完整链路；**二是 Iceberg 周边控制面升温**，Polaris、Gravitino、Lakekeeper 表明湖仓竞争点已从“算力”扩展到“开放元数据与治理层”；**三是嵌入式分析进一步普及**，DuckDB、chDB、duckdb-wasm 代表分析能力正进入应用内、浏览器内和开发者本地工作流。整体看，这与近期湖仓/云数仓演进高度一致：计算层趋于商品化，真正稀缺的能力转向**开放格式、统一 catalog、轻量执行内核和 AI 可调用的数据接口**。

---

## 五、社区关注热点

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  值得重点跟踪的新列式文件格式信号；若生态跟进，可能影响 Arrow/Parquet 周边存储讨论。

- **[apache/polaris](https://github.com/apache/polaris) / [apache/gravitino](https://github.com/apache/gravitino) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  湖仓 catalog/control plane 明显升温，建议关注谁会成为 Iceberg 时代的事实标准控制层。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态核心枢纽，越来越像新一代“可组合 SQL 内核”。

- **[duckdb/duckdb](https://github.com/duckdb/duckdb) / [chdb-io/chdb](https://github.com/chdb-io/chdb) / [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)**  
  嵌入式 OLAP 仍然是最值得下注的开发者方向，特别适合 AI 应用内分析、边缘分析与本地数据产品。

- **[apache/doris-mcp-server](https://github.com/apache/doris-mcp-server)**  
  传统 OLAP 与 MCP/Agent 接口开始结合，预示未来数据仓库不只服务 BI，也会直接服务智能体。  

如果你愿意，我还可以继续把这份日报整理成：
1. **更像投资/行业研究风格的简版摘要**，或  
2. **面向内部周会汇报的表格版**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*