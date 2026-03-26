# OLAP & 数据基础设施开源趋势日报 2026-03-26

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-26 01:27 UTC

---

# 《OLAP & 数据基础设施开源趋势日报》  
**日期：2026-03-26**

---

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中与 OLAP/数据基础设施明确相关的项目基本为空**；榜单几乎被 AI agent、开发工具与消费级应用占据，**无典型 OLAP 引擎、湖仓、查询引擎、ETL、BI 项目上榜**。  
因此，今日报告的主体将以 **主题搜索结果中的数据基础设施项目** 为主，并明确标注：**今日新增 stars 仅 Trending 榜单可信，主题搜索结果未提供今日增量**。

**Trending 榜单筛选结论：**
- **保留：无**
- **略去：** deer-flow、litellm、supermemory 等虽与 AI 基础设施相关，但**不属于 OLAP/数据基础设施主线**

---

## 二、分类结果

> 说明：一个项目可能跨多个类别，这里按**最主要定位**归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [crate/crate](https://github.com/crate/crate)
- [apache/cloudberry](https://github.com/apache/cloudberry)

### 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/fluss](https://github.com/apache/fluss)
- [data-dot-all/dataall](https://github.com/data-dot-all/dataall)

### ⚙️ 查询与计算
- [apache/datafusion](https://github.com/apache/datafusion)
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever)

### 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [cube-js/cube](https://github.com/cube-js/cube)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [cloudera/hue](https://github.com/cloudera/hue)
- [GoogleCloudPlatform/bigquery-utils](https://github.com/GoogleCloudPlatform/bigquery-utils)

---

## 三、今日速览

1. **今日 GitHub Trending 未出现 OLAP/数据基础设施项目**，说明短期社区注意力仍集中在 AI agent 应用层，而非底层分析引擎。  
2. 从主题搜索看，**OLAP 引擎与查询计算层仍是最活跃主线**，尤其是 ClickHouse、DuckDB、Doris、StarRocks、DataFusion、Trino 等成熟项目维持高热度。  
3. **湖仓目录与元数据层持续升温**，Gravitino、Polaris、Lakekeeper 体现出社区对 Iceberg 生态治理、统一 catalog 与开放互操作的持续投入。  
4. **实时分析与流式湖仓融合加速**，Fluss、LakeSoul、OLake、Dinky 等项目显示“写入链路 + 实时查询 + 湖仓落地”正在成为工程重点。  
5. Rust 生态在分析引擎中的存在感进一步增强，**Databend、DataFusion、Lakekeeper、pg_mooncake** 等项目说明新一代数据基础设施仍在向高性能与可组合架构演进。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)  
  **⭐ 46,537｜今日新增：—**  
  实时分析数据库代表项目，列式存储与高并发聚合能力依旧是 OLAP 领域事实标准之一，今天仍是最具生态影响力的核心项目。

- [duckdb/duckdb](https://github.com/duckdb/duckdb)  
  **⭐ 36,956｜今日新增：—**  
  嵌入式分析数据库的标杆，持续推动“本地分析 / 单机 OLAP / 开发者数据栈”普及，是现代轻量分析引擎的关键风向标。

- [apache/doris](https://github.com/apache/doris)  
  **⭐ 15,154｜今日新增：—**  
  面向统一分析场景的 MPP 数据库，在实时报表、明细查询与湖仓联邦分析上持续强化，是国内外企业级部署的重要选项。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)  
  **⭐ 11,514｜今日新增：—**  
  主打亚秒级分析与 lakehouse 查询加速，反映出 OLAP 引擎正在从“仓内计算”走向“湖上统一查询”。

- [questdb/questdb](https://github.com/questdb/questdb)  
  **⭐ 16,788｜今日新增：—**  
  高性能时序数据库，持续代表“时间序列 + SQL + OLAP”融合方向，适合金融、IoT、监控分析等高写入场景。

- [databendlabs/databend](https://github.com/databendlabs/databend)  
  **⭐ 9,204｜今日新增：—**  
  云原生数仓与对象存储统一架构代表项目，今天值得关注在于其明确面向 Analytics、Search、AI Sandbox 的统一定位。

- [apache/cloudberry](https://github.com/apache/cloudberry)  
  **⭐ 1,194｜今日新增：—**  
  开源 MPP 数仓方向的重要补位项目，承接传统 Greenplum 类架构需求，适合关注成熟并行分析数据库演进的团队。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)  
  **⭐ 702｜今日新增：—**  
  面向大型列式数据集的新文件格式，值得关注在于它代表了对 Parquet/ORC 之外新型列式格式的持续探索。

- [apache/gravitino](https://github.com/apache/gravitino)  
  **⭐ 2,925｜今日新增：—**  
  开放数据目录项目，瞄准跨区域、联邦化元数据管理，是多引擎共享元数据的关键基础设施。

- [apache/polaris](https://github.com/apache/polaris)  
  **⭐ 1,885｜今日新增：—**  
  Apache Iceberg 互操作 catalog，是湖仓标准化和开放治理的重要抓手，今天依然是 Iceberg 生态的关键观察点。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  **⭐ 1,225｜今日新增：—**  
  Rust 实现的 Iceberg REST Catalog，显示 catalog 层正在从“附属组件”走向独立、高性能、可运营产品。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)  
  **⭐ 3,226｜今日新增：—**  
  实时湖仓框架，强调高并发写入、增量分析与云原生场景，代表“流批湖仓一体化”的持续落地。

- [apache/fluss](https://github.com/apache/fluss)  
  **⭐ 1,831｜今日新增：—**  
  面向实时分析的流式存储系统，说明湖仓社区正在补齐“低延迟写入 + 高效分析读取”之间的底层存储层。

- [data-dot-all/dataall](https://github.com/data-dot-all/dataall)  
  **⭐ 251｜今日新增：—**  
  数据协作与数据市场平台，反映湖仓项目正从存算问题向数据治理、共享与协作工作流延伸。

---

## ⚙️ 查询与计算

- [apache/datafusion](https://github.com/apache/datafusion)  
  **⭐ 8,536｜今日新增：—**  
  Arrow/Rust 生态中的核心 SQL 查询引擎，今天最值得关注之处在于其已成为大量新数据库和数据工具的计算底座。

- [trinodb/trino](https://github.com/trinodb/trino)  
  **⭐ 12,663｜今日新增：—**  
  分布式 SQL 查询引擎代表，继续主导跨湖仓、跨数据源联邦查询场景，是企业数据平台的关键组件。

- [prestodb/presto](https://github.com/prestodb/presto)  
  **⭐ 16,666｜今日新增：—**  
  大数据 SQL 查询引擎经典项目，虽然生态重心分化，但在数据湖查询与企业存量系统中仍具影响力。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)  
  **⭐ 2,000｜今日新增：—**  
  DataFusion 的分布式执行扩展，体现了 Rust 查询栈正从单机内核向集群执行能力外延。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)  
  **⭐ 1,948｜今日新增：—**  
  浏览器与 WASM 环境中的分析执行引擎，值得关注于“前端本地分析”“无服务端数据探索”新范式。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)  
  **⭐ 2,618｜今日新增：—**  
  存储无关的 SQL 引擎，适合做可嵌入式数据库或自定义计算层，反映查询引擎组件化趋势。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)  
  **⭐ 195｜今日新增：—**  
  开源自托管版分布式查询引擎，值得关注在于云数仓厂商开始更开放地释放内核能力。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)  
  **⭐ 5,117｜今日新增：—**  
  Python 数据加载工具，聚焦简化 ELT 开发体验，是“工程师友好型数据管道”趋势的重要代表。

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  **⭐ 1,313｜今日新增：—**  
  面向 Iceberg/Parquet 的高速复制与摄取工具，说明湖仓落地正在从查询层转向更务实的数据进入链路。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)  
  **⭐ 4,377｜今日新增：—**  
  面向事件采集与数据分发的 Segment 替代方案，是 CDP、行为数据仓与产品分析栈的重要入口。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)  
  **⭐ 1,644｜今日新增：—**  
  开源 Reverse ETL 项目，反映数据栈正从“入仓”扩展到“从仓驱动业务系统”的双向同步模式。

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)  
  **⭐ 3,712｜今日新增：—**  
  基于 Flink 的实时数据开发平台，适合关注流式 ETL、实时数仓研发效率提升的团队。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)  
  **⭐ 478｜今日新增：—**  
  面向 Python/SQL 数据工作流开发与运维的一体化框架，体现传统企业对标准化数据作业平台的持续需求。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset)  
  **⭐ 71,124｜今日新增：—**  
  开源 BI 平台代表项目，持续是数据仓库、湖仓与分析引擎对外提供自助分析能力的主流入口。

- [metabase/metabase](https://github.com/metabase/metabase)  
  **⭐ 46,563｜今日新增：—**  
  以易用性著称的 BI 工具，今天值得关注在于其仍是中小团队快速建设分析能力的高频选择。

- [grafana/grafana](https://github.com/grafana/grafana)  
  **⭐ 72,803｜今日新增：—**  
  虽以可观测性著称，但其多数据源可视化能力已深度进入实时分析与运维数据场景。

- [cube-js/cube](https://github.com/cube-js/cube)  
  **⭐ 19,696｜今日新增：—**  
  语义层代表项目，连接 BI、嵌入式分析与 AI 应用，说明“语义建模”正在成为现代数据栈中枢。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)  
  **⭐ 974｜今日新增：—**  
  分析数据库基准测试项目，今天值得关注在于社区对引擎性能比较仍高度依赖公开 benchmark。

- [elementary-data/elementary](https://github.com/elementary-data/elementary)  
  **⭐ 2,287｜今日新增：—**  
  面向 dbt 与分析工程师的数据可观测性工具，反映“数据质量与 pipeline 监控”已成数据平台标配。

- [cloudera/hue](https://github.com/cloudera/hue)  
  **⭐ 1,451｜今日新增：—**  
  SQL 查询与数据仓交互工具，持续服务于数据平台统一入口与多引擎操作场景。

---

## 五、趋势信号分析

今天最大的信号不是某个数据项目爆红，而是**数据基础设施项目集体缺席 Trending 热榜**：GitHub 短周期注意力仍被 AI agent 与应用层工具吸走。但从主题活跃项目看，社区并未降温，反而在更底层的几个方向持续加码。首先，**OLAP 引擎与查询内核继续稳定收敛到少数强生态项目**，如 ClickHouse、DuckDB、Doris、StarRocks、DataFusion、Trino，说明数据团队更重视成熟执行引擎与可生产部署能力。其次，**湖仓 catalog/元数据层明显升温**，Polaris、Gravitino、Lakekeeper 的活跃说明 Iceberg 生态正在从“表格式标准”进入“治理与互操作标准”阶段。再者，**实时湖仓与摄取链路成为实用主义热点**，Fluss、LakeSoul、OLake、Dinky 对应的是云数仓近年的核心诉求：低延迟写入、开放表格式、统一分析入口。这与近期湖仓/云数仓发展高度一致——竞争焦点正从单一查询性能，转向**开放格式、实时性、目录治理和多引擎协同**。

---

## 六、社区关注热点

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  Rust + Arrow 查询栈持续外溢，越来越多数据库、语义层和 AI 数据工具把它作为计算底座。

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg catalog 成为湖仓控制面的关键层，谁掌握 catalog 与元数据治理，谁就更接近下一代开放数仓入口。

- **[Apache Fluss](https://github.com/apache/fluss) / [LakeSoul](https://github.com/lakesoul-io/LakeSoul)**  
  实时写入与湖仓分析正在深度融合，适合重点观察“流式存储替代消息队列+离线落湖”的潜力。

- **[Databend](https://github.com/databendlabs/databend) / [StarRocks](https://github.com/StarRocks/starrocks)**  
  云原生数仓正在从纯 SQL 分析扩展到搜索、AI、对象存储原生计算，边界正在快速变宽。

- **[OLake](https://github.com/datazip-inc/olake) / [dlt](https://github.com/dlt-hub/dlt)**  
  数据进入链路重新成为热点，说明行业开始重视“如何更快、更稳地进入 Iceberg/Parquet/Lakehouse”，而不只是查询层优化。

--- 

如果你愿意，我可以进一步把这份日报再补成一个更适合内部周报传播的版本，例如增加：  
1. **“国产/海外项目对照表”**，  
2. **“Rust 数据基础设施生态图”**，  
3. **“值得跟踪的新项目（低星但方向新）”**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*