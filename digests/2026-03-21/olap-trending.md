# OLAP & 数据基础设施开源趋势日报 2026-03-21

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-21 01:14 UTC

---

# OLAP & 数据基础设施开源趋势日报
**日期：2026-03-21**

---

## 一、过滤结果

基于你提供的两类数据源，先做 OLAP / 数据基础设施相关性筛选：

### 1) 今日 Trending 榜单筛选结果
今日 9 个 Trending 仓库中，**明确属于 OLAP/数据基础设施/分析引擎相关的仅 2 个**：

- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — 数据提取/非结构化文档解析，属于数据摄取前置工具
- [vas3k/TaxHacker](https://github.com/vas3k/TaxHacker) — 面向票据/交易的 AI 会计分析应用，偏垂直应用，**弱相关**

其余如 Claude 插件、编码 Agent、Minecraft 地图生成、物理仿真、交易 Agent、火箭仿真等，**均不纳入本期 OLAP/数据基础设施分析**。

> 说明：严格按“数据基础设施”口径，**TaxHacker 不作为核心基础设施项目**，仅在趋势解读中作为“AI 驱动结构化数据提取/分析应用”旁证提及。

### 2) 主题搜索结果筛选结果
主题搜索结果中，大部分与 OLAP、湖仓、查询引擎、数据仓库、观测与 BI 明确相关，可纳入分析。  
其中少量应剔除或弱化：

- 剔除：`academic/awesome-datascience`、`qax-os/excelize`、`louistrue/ifc-lite`、`zunyon/rls`、`phillipclapham/flowscript` 等非核心数据基础设施项目
- 弱相关保留观察：`mindsdb/mindsdb`、`langfuse/langfuse`、`Canner/wren-engine`、`oceanbase/seekdb`、`matrixone/matrixone`，因其体现 **AI + 查询/分析引擎融合趋势**

---

## 二、分类结果

## 1. 今日速览

1. **今日 GitHub 热榜里纯 OLAP 内核项目缺席**，但数据工程相关的新增关注主要落在**非结构化数据解析**方向，[opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) 单日 **+1812 stars**，说明“把 PDF 等非结构化内容转成可分析数据”的入口层工具正在快速升温。  
2. 主题活跃项目显示，社区主线仍然集中在三条路径：**高性能 OLAP 引擎**、**湖仓目录/流式存储**、以及 **嵌入式/轻量查询引擎**。  
3. 头部格局依旧稳固，[ClickHouse](https://github.com/ClickHouse/ClickHouse)、[DuckDB](https://github.com/duckdb/duckdb)、[Apache Doris](https://github.com/apache/doris)、[StarRocks](https://github.com/StarRocks/starrocks) 继续构成开源分析数据库第一梯队。  
4. 新一轮值得注意的方向是：**Rust/C++ 驱动的新引擎与目录服务增多**，如 [DataFusion](https://github.com/apache/datafusion)、[Databend](https://github.com/databendlabs/databend)、[Lakekeeper](https://github.com/lakekeeper/lakekeeper)、[Nimble](https://github.com/facebookincubator/nimble)。  
5. 从湖仓生态看，**Iceberg Catalog、流式湖仓存储、S3 原生分析架构**仍是最清晰的演进主线。

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎
优先关注列式数据库、分析型查询引擎、MPP/HTAP 系统。

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,421  
  实时分析数据库代表项目，仍是开源 OLAP 领域最强社区之一，生态与性能基准影响力持续扩大。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐36,815  
  嵌入式分析数据库标杆，持续定义“本地分析 / 嵌入式 OLAP”范式，对数据科学与应用内分析影响极大。

- [apache/doris](https://github.com/apache/doris) — ⭐15,132  
  面向统一分析场景的高性能 MPP 数据库，适合实时报表、数仓与湖仓联邦分析，企业采用面持续扩展。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,496  
  主打亚秒级查询和湖仓统一分析，是当前云原生 OLAP 引擎中增长势头最稳定的一类代表。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,202  
  基于对象存储重构的数据仓库/分析引擎，强调 S3 原生、Agent Ready 与 AI/搜索融合，方向前沿。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,779  
  高性能时序 OLAP 数据库，在实时指标、金融与 IoT 分析场景中持续保持较强关注度。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone) — ⭐1,876  
  MySQL 兼容 HTAP 数据库，叠加向量检索和全文搜索，体现“事务+分析+AI”一体化趋势。

- [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce) — ⭐113  
  纯 C、SIMD 加速的列式分析数据库，体量虽小，但代表了轻量高性能新内核的社区探索方向。

---

## 📦 存储格式与湖仓
关注文件格式、表格式、Catalog、湖仓框架、流式湖存储。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐700  
  面向大型列式数据集的新文件格式，值得关注其是否能在 Arrow/Parquet 之外开辟新的高性能存储路径。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,924  
  联邦元数据与开放数据目录项目，契合多引擎、多区域、多湖仓协同管理需求。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,882  
  Apache Iceberg 开放 Catalog 方向的重要项目，说明湖仓控制面正成为新的竞争焦点。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,223  
  Rust 实现的 Iceberg REST Catalog，突出安全、轻量与性能，是湖仓基础设施新秀。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,827  
  面向实时分析的流式存储，反映批流一体与低延迟湖仓的持续升温。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,228  
  端到端实时湖仓框架，强调并发更新与增量分析，适合 AI/BI 混合工作负载。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,311  
  面向 Iceberg/Parquet 的高速复制与落湖工具，直接服务实时湖仓数据摄取链路。

- [apache/cloudberry](https://github.com/apache/cloudberry) — ⭐1,191  
  成熟 MPP 数仓方向的开源延续，虽偏传统，但在现代数据仓库重构中仍具现实价值。

---

## ⚙️ 查询与计算
关注 SQL 引擎、分布式查询、向量化执行、内核能力与计算框架。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,516  
  Rust SQL 查询引擎代表，已成为新一代分析系统、嵌入式查询和自定义数据平台的重要基础层。

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,653  
  分布式 SQL 查询引擎主力，依旧是跨数据源联邦查询与湖仓访问的事实标准之一。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,665  
  老牌分布式查询引擎，仍在大数据 SQL 执行层保持可观活跃度和生产影响力。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐1,994  
  DataFusion 的分布式扩展，体现从本地向分布式 Rust 查询栈延展的趋势。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,642  
  基于 ClickHouse 的 in-process OLAP SQL 引擎，把高性能分析能力嵌入 Python/本地应用场景，关注度持续提升。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,617  
  存储无关的 MySQL 兼容查询引擎，适合做嵌入式 SQL 层或定制型数据库产品。

- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever) — ⭐798  
  高性能 RDF/SPARQL 查询引擎，虽偏知识图谱，但在大规模查询优化上具有方法论价值。

- [KipData/KiteSQL](https://github.com/KipData/KiteSQL) — ⭐685  
  Rust 嵌入式关系型查询引擎，属于轻量数据库内核持续活跃的一个信号。

---

## 🔗 数据集成与 ETL
关注连接器、加载工具、数据同步、反向 ETL、文档解析与入湖链路。

- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — ⭐0，**+1812 today**  
  今日唯一显著爆发的数据工程相关热榜项目，聚焦 PDF 到 AI-ready 数据解析，表明“非结构化数据摄取”成为新热点。

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,073  
  轻量且开发者友好的 Python 数据加载库，在现代 ELT 场景中采用门槛低，社区持续稳定。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,376  
  Segment 替代方案，服务事件采集与仓库投递，是 CDP/埋点数据基础设施的重要开源选项。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,643  
  开源 Reverse ETL，连接仓库与业务系统，反映“数据激活”链路成为数仓体系的标准组成。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,311  
  面向数据库、Kafka、S3 到 Iceberg/Parquet 的高速同步，是实时湖仓数据接入层的实用项目。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit) — ⭐477  
  统一开发、部署与运维数据工作流的框架，适合 SQL/Python 混合型数据平台团队。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  经典 ETL 配置化工具，虽不新，但对传统数仓迁移与集成仍有参考意义。

---

## 🧰 数据工具
关注 BI、可观测性、Benchmark、SQL 配套与分析平台。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐973  
  分析数据库基准测试项目，是观察各类 OLAP 引擎性能叙事和市场宣传的重要参照系。

- [apache/superset](https://github.com/apache/superset) — ⭐71,029  
  开源 BI 与数据探索平台头部项目，持续作为多种 OLAP/湖仓后端的标准可视化入口。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,484  
  易用型 BI 平台，适合中小团队快速搭建分析门户，仍是数据民主化的核心工具之一。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,291  
  老牌 SQL 查询与可视化工具，虽然增长放缓，但在自助分析链路中依然有现实影响力。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,279  
  dbt-native 数据可观测性工具，说明“数据质量与管道健康”已成为现代数仓的刚需层。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,148  
  虽然是产品分析平台，但其 data warehouse / CDP 一体化能力让其逐渐接近“分析数据平台”。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,751  
  更偏观测平台，但其多数据源分析与可视化能力使其常作为日志、指标、时序 OLAP 的前端入口。

- [langfuse/langfuse](https://github.com/langfuse/langfuse) — ⭐23,483  
  LLM 观测平台，虽不属传统 OLAP，但“AI 可观测性”正在复制数据观测平台的发展路径，值得数据团队关注。

---

## 3. 趋势信号分析

今天最强的短期爆发信号并不来自经典 OLAP 引擎，而是来自 **非结构化数据摄取与 AI-ready 数据预处理**： [opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) 单日 +1812 stars，说明社区正在把 PDF、票据、文档等“分析前数据”视作新的基础设施入口。与此同时，主题活跃项目继续验证三大主线：一是 **ClickHouse、DuckDB、Doris、StarRocks** 所代表的高性能分析引擎依旧稳固；二是 **Iceberg Catalog 与流式湖仓存储** 加速演进，典型如 [apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper](https://github.com/lakekeeper/lakekeeper)、[apache/fluss](https://github.com/apache/fluss)；三是 **嵌入式与 Rust 查询栈** 持续升温，DataFusion、chDB、Databend 等正在推动“轻量、可组合、S3 原生”的分析架构。整体看，这与近期湖仓/云数仓的发展高度一致：控制面开放化、存储与计算解耦、实时摄取增强，以及面向 AI 工作负载的数据基础设施前移。

---

## 4. 社区关注热点

- **[opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)**  
  今日最强数据相关增量信号，说明 PDF/文档解析正从“AI 应用能力”转向“数据管道入口能力”。

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) / [apache/gravitino](https://github.com/apache/gravitino)**  
  Iceberg Catalog 与联邦元数据控制面是未来湖仓平台竞争核心，建议持续跟踪接口标准和生态兼容性。

- **[apache/datafusion](https://github.com/apache/datafusion) / [chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  嵌入式查询与可组合分析引擎正在扩大使用面，适合自建数据产品、应用内分析和定制数仓场景。

- **[databendlabs/databend](https://github.com/databendlabs/databend) / [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)**  
  S3 原生、单二进制、轻部署分析系统值得关注，体现云数仓能力向更低运维成本形态下沉。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新文件格式方向虽尚早期，但如果在扫描效率、压缩率或云对象存储访问模式上建立优势，可能影响未来列式存储演进。

---

如果你愿意，我可以下一步把这份日报继续整理成：
1. **表格版摘要**  
2. **面向投资/技术决策的 Top 10 名单**  
3. **按“成熟项目 / 新兴项目 / 值得观望”三档重排版**

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*