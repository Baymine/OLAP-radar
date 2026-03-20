# OLAP & 数据基础设施开源趋势日报 2026-03-20

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-20 01:18 UTC

---

# OLAP & 数据基础设施开源趋势日报  
**日期：2026-03-20**

---

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中仅有 1 个与数据基础设施明确相关的项目**：

- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — PDF Parser for AI-ready data，属于**非结构化数据抽取/数据摄取工具**，可纳入数据集成与 ETL 观察范围。

其余 Trending 项目主要为 AI coding agent、开发工具、自动化、游戏/仿真等，**不属于 OLAP/数据基础设施核心范畴，已过滤掉**。

主题搜索结果中的 75 个仓库里，大多数与 OLAP、查询引擎、湖仓、分析数据库、BI、数据集成直接相关，纳入后续分类分析。

---

## 二、分类结果

> 说明：一个项目可跨类，这里按**主要属性优先归类**。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [questdb/questdb](https://github.com/questdb/questdb)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [crate/crate](https://github.com/crate/crate)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)

### 📦 存储格式与湖仓
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [apache/fluss](https://github.com/apache/fluss)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)

### ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever)
- [comunica/comunica](https://github.com/comunica/comunica)
- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache)

### 🔗 数据集成与 ETL
- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [DatalinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [getredash/redash](https://github.com/getredash/redash)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)
- [data-dot-all/dataall](https://github.com/data-dot-all/dataall)

---

## 三、今日速览

1. 今日 GitHub 热榜中，**直接进入全站 Trending 的数据项目很少**，但 [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) 单日新增 **+1416 stars**，说明**非结构化数据解析/AI-ready ingestion** 正在快速升温。  
2. 在主题搜索维度，OLAP 主赛道仍由 **ClickHouse、Doris、StarRocks、DuckDB、Trino** 等成熟项目稳居中心，说明社区关注点依然集中在**高性能分析、湖仓查询与统一计算接口**。  
3. 湖仓元数据与 catalog 层持续活跃，[apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) 代表了**Iceberg 生态外围基础设施**的强化。  
4. Rust 生态继续渗透查询与存储层，[apache/datafusion](https://github.com/apache/datafusion)、[databendlabs/databend](https://github.com/databendlabs/databend)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) 等项目显示出**现代数据内核“Rust 化”**趋势。  
5. 数据工程与 AI 的结合更明显：从 PDF 抽取、AI-ready warehouse 到 agent-facing context/query engine，数据基础设施正在向**面向 AI 工作负载的分析底座**演进。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,412  
  实时分析数据库代表项目，仍是开源 OLAP 的事实标准之一，值得关注其在实时湖仓与向量化执行上的持续领先。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐36,793  
  嵌入式分析数据库的标杆，持续影响本地分析、Notebook 分析和轻量数据应用架构。

- [apache/doris](https://github.com/apache/doris) — ⭐15,128  
  统一分析数据库，兼顾 OLAP、实时分析与易用性，是国内外企业级分析引擎的重要选型。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,491  
  面向亚秒级分析和湖上查询的高性能引擎，今天仍是 lakehouse 查询加速方向的核心项目。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,775  
  高性能时序 OLAP 数据库，受实时监控、金融时序和 IoT 分析场景持续驱动。

- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase) — ⭐10,021  
  HTAP 与分布式数据库结合的代表，反映事务与分析融合架构仍受社区关注。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,643  
  基于 ClickHouse 的 in-process OLAP 引擎，适合嵌入式分析和 Python 近数据计算场景。

- [apache/cloudberry](https://github.com/apache/cloudberry) — ⭐1,191  
  成熟 MPP 数据仓库路线的开源延续，适合观察传统数仓内核在现代场景中的复兴。

---

## 📦 存储格式与湖仓

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,200  
  面向 Analytics、Search、AI 的统一 warehouse，强调对象存储原生与 AI-ready 架构，契合新一代云数仓方向。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,228  
  实时湖仓框架，强调高并发更新与增量分析，贴近实时数仓与 AI 数据底座融合趋势。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,922  
  联邦元数据湖项目，说明多引擎、多地域、多目录治理已成为湖仓落地的关键问题。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,881  
  Apache Iceberg 目录服务代表项目，是开放表格式生态中非常值得持续跟踪的基础设施层。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,825  
  为实时分析设计的 streaming storage，反映流存一体正在成为湖仓新热点。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,222  
  Rust 编写的 Iceberg REST Catalog，代表 catalog 服务朝高性能、云原生、可嵌入方向演化。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐700  
  面向大规模列式数据的新文件格式，虽体量不大，但在底层存储格式创新上具备前瞻性。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,650  
  分布式 SQL 查询引擎代表，仍是多源联邦查询和湖上 SQL 的核心基础设施。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,666  
  经典分布式查询引擎，仍具备广泛产业影响力，是观察查询引擎分叉生态的重要样本。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,516  
  Rust SQL 查询引擎，已成为新一代可组合分析内核的关键底座，生态扩展速度值得关注。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐1,993  
  DataFusion 的分布式执行层，体现“模块化查询内核 + 分布式调度”路径在开源界持续推进。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,617  
  存储无关的 MySQL 兼容查询引擎，适合嵌入式 SQL、定制化数据系统和中间层场景。

- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever) — ⭐798  
  面向 RDF/SPARQL 的高性能图查询系统，说明语义数据查询仍有专门的引擎创新空间。

- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐390  
  DataFusion 的 pushdown cache，代表查询加速已开始向更细粒度执行优化和缓存下推演进。

---

## 🔗 数据集成与 ETL

- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — ⭐0，**+1416 today**  
  今日最强数据信号项目，聚焦 PDF 到 AI-ready 数据抽取，反映非结构化文档摄取正成为新热点。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,310  
  面向 Iceberg/Parquet 的数据库、Kafka、S3 复制工具，贴合实时入湖与湖仓同步需求。

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,064  
  轻量数据加载框架，持续受欢迎，说明“开发者友好型 ETL”仍有较强社区需求。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,376  
  事件数据采集与路由基础设施，是现代产品分析与 warehouse-native 数据栈的重要入口。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,643  
  开源 Reverse ETL，反映数据仓库到业务系统的回流链路仍是数据平台建设重点。

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky) — ⭐3,711  
  基于 Flink 的实时数据开发平台，代表流式 ETL 与实时数仓工程化能力的持续需求。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit) — ⭐476  
  用 Python/SQL 开发和运行数据工作流，适合关注“轻平台化”数据工程路线。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset) — ⭐71,029  
  开源 BI 平台头部项目，仍是企业数据探索与可视化层的主流选择。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,471  
  易用型 BI 工具代表，持续稳健，说明低门槛数据消费平台需求依然强烈。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,735  
  虽偏可观测性，但已成为统一数据展示层的重要组成，对时序/日志/分析数据整合价值高。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐973  
  分析数据库 benchmark 项目，是评估 OLAP 引擎性能与生态竞争格局的重要参考。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,278  
  dbt-native 数据可观测方案，说明数据质量与 pipeline 监控已成为现代数仓标配。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,286  
  经典 SQL 查询与仪表盘工具，虽热度趋稳，但在轻 BI 和分析协作场景仍有代表性。

- [langfuse/langfuse](https://github.com/langfuse/langfuse) — ⭐23,431  
  LLM observability 平台，虽偏 AI 工程，但与分析/遥测数据基础设施强相关，值得数据团队关注。

---

## 五、趋势信号分析

今日最强烈的信号来自**非结构化数据摄取工具的爆发式关注**：  
[opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) 以 **+1416 今日 stars** 成为唯一进入全站 Trending 的数据相关项目，表明“把 PDF、文档等非结构化内容转成可检索、可分析、可供 AI 使用的数据”正在成为新入口。这类工具虽不属于传统 OLAP 引擎，但正处于现代数据栈更上游的位置，承担 AI 数据准备层角色。

从长期主线看，社区重心仍在**湖仓查询 + 统一元数据 + 实时分析**。以 [apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) 为代表的 catalog/metadata 基础设施，说明开放表格式生态已从“存储格式竞争”进入“治理与互操作层建设”阶段。与此同时，[apache/datafusion](https://github.com/apache/datafusion)、[databendlabs/databend](https://github.com/databendlabs/databend) 等项目显示，**Rust 驱动的可组合查询内核**正在与云原生湖仓、AI-ready warehouse 路线汇合，这与近期云数仓向开放、对象存储原生、面向 AI 工作负载演进的方向高度一致。

---

## 六、社区关注热点

- **[opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)**  
  今日唯一显著冲上 Trending 的数据项目，说明文档解析与 AI-ready ingestion 已成为数据工程新热点。

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) / [apache/gravitino](https://github.com/apache/gravitino)**  
  建议重点关注 Iceberg catalog 与联邦元数据层，这将直接影响未来湖仓互操作和多引擎治理能力。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  作为 Rust 查询内核代表，其生态外溢正在影响缓存、分布式执行、嵌入式 SQL 和定制分析系统设计。

- **[databendlabs/databend](https://github.com/databendlabs/databend)**  
  “Analytics + Search + AI + Python Sandbox” 的产品叙事很有代表性，反映数据仓库正在从 BI 底座扩展为 AI 时代统一执行平面。

- **[apache/fluss](https://github.com/apache/fluss) / [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)**  
  流式存储与实时湖仓值得持续跟踪，说明低延迟写入、增量计算、流批一体正成为下一阶段竞争重点。

--- 

如需，我还可以继续把这份日报补充为：
1. **“按技术栈（Java/Rust/C++/Go）观察”版本**，或  
2. **“中国团队/Apache 基金会/商业公司背景”版本**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*