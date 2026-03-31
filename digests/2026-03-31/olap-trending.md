# OLAP & 数据基础设施开源趋势日报 2026-03-31

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-31 01:28 UTC

---

# OLAP & 数据基础设施开源趋势日报
日期：2026-03-31

## 一、过滤结果

基于你提供的两类数据源，已筛除明显不属于 OLAP / 数据基础设施 / 分析引擎范畴的项目。

### 来自今日 Trending 榜单的有效项目
仅保留与数据分析、BI、数据平台明确相关的仓库：
- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB)
- [apache/superset](https://github.com/apache/superset)

其余如语音 AI、Claude 教程、换脸、系统工具、社工工具、Agent 项目均不纳入本次 OLAP/数据基础设施分析。

### 来自主题搜索的有效项目
75 个主题仓库中，大多数与 OLAP、湖仓、查询引擎、BI、数据管道、列式/时序存储相关，整体有效。个别偏泛 analytics 展示型项目未作为主分析对象，仅在工具类中择优纳入。

---

## 二、分类结果

> 说明：一个项目可跨类，这里按“最主要能力”归类，并在代表项目中优先选择当前生态影响力较强、与 OLAP/数据基础设施关系最直接者。

---

## 1. 今日速览

1. 今日 GitHub 实时热榜中，真正进入数据工程主线的项目不多，但 [Superset](https://github.com/apache/superset) 仍然上榜，说明开源 BI 与数据探索层依旧具备稳定社区关注度。  
2. 主题搜索结果显示，当前最强势的主线仍是“湖仓 + 实时分析 + 统一查询引擎”，代表项目集中在 ClickHouse、Doris、StarRocks、DuckDB、Trino、DataFusion 一线阵营。  
3. Iceberg Catalog、流式存储、Postgres 实时分析扩展等方向活跃度继续提升，反映出数据基础设施正在从“离线仓库”走向“实时湖仓 + 多引擎互操作”。  
4. Rust 在新一代数据底座中的存在感进一步增强，Databend、DataFusion、Lakekeeper、chDB、pg_mooncake 等项目共同表明，性能、安全性与嵌入式分析能力正成为下一轮创新重点。  

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎
聚焦列式数据库、分析型数据库、MPP / HTAP 系统。

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,602  
  实时分析数据库代表项目，仍是 OLAP 领域最强社区标杆之一，兼具高性能、列式存储与丰富生态。

- [apache/doris](https://github.com/apache/doris) — ⭐15,162  
  统一分析数据库，覆盖即席查询、报表与实时数仓场景，是现代云原生 OLAP 的核心候选。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,521  
  面向亚秒级分析与湖仓查询的高性能引擎，持续强化“湖上 + 库内”统一分析能力。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,073  
  嵌入式分析数据库的事实标准，在本地分析、Python 数据科学与轻量 OLAP 场景保持高热度。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,804  
  高性能时序 OLAP 数据库，适合金融、IoT、监控等实时分析负载，时序方向热度稳定。

- [timescale/timescaledb](https://github.com/timescale/timescaledb) — ⭐22,245  
  基于 Postgres 扩展的时序分析数据库，体现“在现有数据库之上增强分析能力”的路径仍很受欢迎。

- [apache/cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  开源 MPP 数据仓库路线的延续者，承接 Greenplum 生态，对于传统数仓替代有现实意义。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone) — ⭐1,865  
  AI-native HTAP 数据库，融合事务、分析与向量搜索，体现数据库朝多模态工作负载统一发展的趋势。

---

## 📦 存储格式与湖仓
聚焦表格式、Catalog、湖仓框架、对象存储上的统一数据底座。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,887  
  Apache Iceberg 目录服务项目，值得关注之处在于它直接切中多引擎共享湖仓元数据这一关键层。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,232  
  Rust 实现的 Iceberg REST Catalog，说明 Catalog 层正在从“附属组件”升级为独立基础设施。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,924  
  面向联邦元数据与跨地域数据目录的开放平台，契合多云与多引擎数据治理需求。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,225  
  实时湖仓框架，强调并发更新与增量分析，在 BI 与 AI 混合场景中有鲜明定位。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐979  
  虽非存储格式本身，但已成为分析数据库/湖仓性能对比的重要基准基础设施，影响选型。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,146  
  大数据平台型项目，兼具分布式存储与计算属性，可视作更完整的数据底座方案。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,218  
  构建在对象存储之上的现代数据仓库/湖仓体系，强调统一架构和 Agent-ready 能力，符合 AI 时代数据底座演进方向。

---

## ⚙️ 查询与计算
聚焦分布式 SQL、向量化执行、嵌入式查询、计算框架。

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,672  
  分布式 SQL 查询引擎代表，持续主导“多源联邦查询”场景，是湖仓计算层关键基础设施。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,672  
  Presto 路线依然强势，说明超大规模 SQL on Anything 需求仍然旺盛。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,546  
  Rust SQL 查询引擎核心项目，已经成为新一代可组合数据系统的重要底座。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,001  
  DataFusion 的分布式延伸，体现模块化执行引擎正在向分布式计算平滑扩展。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,646  
  基于 ClickHouse 的嵌入式 OLAP 引擎，让分析能力更接近应用侧与 Python 工作流。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,957  
  DuckDB 的 WebAssembly 版本，代表查询引擎向浏览器端和无服务器环境渗透。

- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,945  
  将实时分析能力带入 Postgres 表，说明“围绕现有 OLTP 系统附加 OLAP 能力”的路线正在升温。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,619  
  存储无关的 MySQL 兼容查询引擎，适合定制数据库、数据虚拟化与嵌入式 SQL 服务场景。

---

## 🔗 数据集成与 ETL
聚焦连接器、CDC、装载、反向 ETL、管道编排。

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,150  
  以 Python 为中心的数据装载工具，降低数据接入门槛，适合现代 ELT 工作流。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,313  
  面向数据库、Kafka、S3 到 Iceberg/Parquet 的高速复制工具，直连实时湖仓落地痛点。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,380  
  偏数据采集/CDP 基础设施，是事件流进仓的重要组成部分。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,645  
  开源 Reverse ETL 代表，反映“仓到业务系统”的数据回流需求持续增长。

- [data-dot-all/dataall](https://github.com/data-dot-all/dataall) — ⭐251  
  数据协作与数据市场平台，强化数据产品化和治理协同，适合企业级数据平台建设。

---

## 🧰 数据工具
聚焦 BI、可视化、SQL 开发、可观测性、性能基准等。

- [apache/superset](https://github.com/apache/superset) — ⭐71,938，**+49 today**  
  今日唯一明确上榜的数据基础设施核心项目之一；作为开源 BI 头部代表，持续体现数据消费层稳定需求。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,671  
  低门槛 BI 工具代表，面向更广泛业务用户，说明自助分析仍是开源数据栈高频需求。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,312  
  经典 SQL 查询与可视化工具，虽偏成熟期，但在轻量 BI 和团队数据共享上仍有影响力。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,444  
  面向数据库/数仓的 SQL Query Assistant，适合多源查询环境中的交互式分析入口。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,289  
  dbt-native 数据可观测性工具，反映数据质量与管道监控已从附加项变为主流能力。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐979  
  作为分析数据库基准测试项目，对数据库选型、性能宣传和社区比较有持续影响。

- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB) — ⭐0，**+502 today**  
  今日 Trending 中数据相关增星最明显的项目，虽偏金融数据平台，但展示了“面向分析师/Agent 的数据工作台”正在走热。

---

## 3. 趋势信号分析

今天最明确的社区信号是：**数据消费层与统一分析底座正在同步升温**。从实时热榜看，[Superset](https://github.com/apache/superset) 与 [OpenBB](https://github.com/OpenBB-finance/OpenBB) 分别代表通用 BI 与垂直数据平台，说明“让数据被更快消费”仍然比单纯底层性能叙事更容易获得广泛关注。与此同时，主题搜索结果显示，真正的基础设施创新仍集中在三条主线：其一是 **湖仓目录与元数据层**，如 Polaris、Lakekeeper、Gravitino；其二是 **可组合查询引擎**，如 Trino、DataFusion、DuckDB、chDB；其三是 **实时分析数据库**，如 ClickHouse、Doris、StarRocks、QuestDB。  
新方向上，**Postgres 增强型实时分析** 与 **Rust 驱动的数据引擎生态** 尤其值得注意：pg_mooncake、DataFusion、Databend、Lakekeeper 共同反映出社区正在寻找更轻、更安全、可嵌入且更适配对象存储的下一代分析架构。这与近期湖仓/云数仓发展高度一致——计算、Catalog、格式、BI 正在解耦，并通过开放协议重新组合。

---

## 4. 社区关注热点

- **[apache/polaris](https://github.com/apache/polaris)**  
  Iceberg Catalog 正在成为湖仓互操作的核心控制面，未来会直接影响多引擎兼容与治理体系。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态的基础项目，越来越多新数据库、SQL 服务和上下文引擎建立在其上。

- **[Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake)**  
  “Postgres 上做实时 OLAP”是非常实际的新趋势，适合希望保留 PostgreSQL 生态同时增强分析能力的团队。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)**  
  直接把数据库/Kafka/S3 高速写入 Iceberg 或 Parquet，切中实时湖仓落地中的接入瓶颈。

- **[apache/superset](https://github.com/apache/superset)**  
  今日仍能进入 GitHub 热榜，说明开源 BI 不仅没有降温，反而在湖仓普及后继续承担数据价值交付的最后一公里。

--- 

如果你愿意，我可以继续把这份日报再补充成一个更适合内部周会汇报的版本，比如增加：
1. **“中美开源 OLAP 阵营对比”**  
2. **“Rust 系数据底座版图”**  
3. **“可直接用于选型的项目对照表（ClickHouse / Doris / StarRocks / DuckDB / Trino）”**

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*