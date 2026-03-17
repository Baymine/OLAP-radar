# OLAP & 数据基础设施开源趋势日报 2026-03-17

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-17 01:25 UTC

---

# 《OLAP & 数据基础设施开源趋势日报》  
日期：2026-03-17

---

## 第一步：过滤结果

基于给定两组数据筛选后：

- **Trending 榜单**：**无明确 OLAP / 数据基础设施 / 分析引擎项目入榜**。今日 Trending 基本被 AI Agent、上下文数据库、代码智能、浏览器自动化等项目占据，**不纳入本次 OLAP/数据分析**。
- **主题搜索结果**：共 71 个仓库中，筛出与 **OLAP、查询引擎、湖仓、ETL、BI/数据工具** 明确相关的项目作为本日报分析对象；明显偏通用分析站点、Excel 工具、非数据基础设施项目不作为重点。

---

## 第二步：分类

> 说明：一个项目可跨类，以下按“主要属性”归类。

### 🗄️ OLAP 引擎
- ClickHouse / ClickHouse
- duckdb / duckdb
- apache / doris
- StarRocks / starrocks
- questdb / questdb
- oceanbase / oceanbase
- crate / crate
- apache / cloudberry
- chdb-io / chdb
- Basekick-Labs / arc

### 📦 存储格式与湖仓
- apache / polaris
- lakekeeper / lakekeeper
- apache / gravitino
- apache / fluss
- ClickHouse / ClickBench（偏基准，但与分析存储生态强相关）
- facebookincubator / nimble
- ytsaurus / ytsaurus
- databendlabs / databend

### ⚙️ 查询与计算
- trinodb / trino
- prestodb / presto
- apache / datafusion
- apache / datafusion-ballista
- dolthub / go-mysql-server
- duckdb / duckdb-wasm
- mabel-dev / opteryx
- Canner / wren-engine
- qlever / qlever

### 🔗 数据集成与 ETL
- datazip-inc / olake
- dlt-hub / dlt
- rudderlabs / rudder-server
- Multiwoven / multiwoven
- DataLinkDC / dinky
- dalenewman / Transformalize

### 🧰 数据工具
- apache / superset
- metabase / metabase
- getredash / redash
- elementary-data / elementary
- cloudera / hue
- apache / doris-mcp-server
- ClickHouse / ClickBench
- langfuse / langfuse（偏 LLM observability，但已进入数据分析/观测平台交叉带）

---

## 1. 今日速览

1. **今日 GitHub Trending 榜单没有传统 OLAP 项目冲上实时热榜**，说明短期开发者注意力仍被 AI Agent 基础设施吸走，但数据基础设施主题搜索中的活跃项目依然非常集中。  
2. 从数据工程视角看，社区最强势的主线仍是 **“湖仓目录 + 高性能分析引擎 + 统一查询层”**：ClickHouse、DuckDB、Doris、StarRocks、Trino、DataFusion 持续稳居核心位置。  
3. **Apache Iceberg Catalog 相关方向明显升温**，如 [Apache Polaris](https://github.com/apache/polaris)、[Lakekeeper](https://github.com/lakekeeper/lakekeeper)、[Apache Gravitino](https://github.com/apache/gravitino) 共同体现出“开放元数据控制面”竞争加速。  
4. 另一条值得关注的趋势是 **嵌入式/轻量 OLAP 与本地分析执行**，例如 [DuckDB](https://github.com/duckdb/duckdb)、[chDB](https://github.com/chdb-io/chdb)、[duckdb-wasm](https://github.com/duckdb/duckdb-wasm)、[arc](https://github.com/Basekick-Labs/arc)。  
5. ETL 与数据接入侧则继续向 **实时复制、对象存储落地、Iceberg/Parquet 原生写入** 演进，代表项目是 [OLake](https://github.com/datazip-inc/olake) 和 [dlt](https://github.com/dlt-hub/dlt)。

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,360  
  实时分析数据库代表项目，兼具高吞吐列存与低延迟查询能力，仍是开源 OLAP 的生态中心之一。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐36,706  
  进程内分析数据库，正在成为本地分析、数据应用嵌入式执行和开发者工作流的事实标准之一。

- [apache/doris](https://github.com/apache/doris) — ⭐15,114  
  统一分析数据库，覆盖交互式分析、实时数仓和湖仓联合查询，适合企业级一体化场景。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,480  
  面向亚秒级分析和湖仓查询优化的高性能引擎，持续受关注反映实时 OLAP 需求仍强。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,766  
  面向时序与实时分析的高性能数据库，说明 observability / IoT / 金融数据场景仍是 OLAP 重要增量市场。

- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase) — ⭐10,016  
  HTAP 与分布式数据库路线代表，值得关注其“事务 + 分析 + AI workload”融合叙事。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,640  
  基于 ClickHouse 的嵌入式 OLAP SQL 引擎，反映轻量级、本地化分析引擎的开发者吸引力上升。

- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc) — ⭐557  
  DuckDB SQL + Parquet + Arrow 的单二进制分析数据库，适合边缘分析、日志和小型云原生分析场景。

---

## 📦 存储格式与湖仓

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,879  
  Apache Iceberg 的开放 Catalog 项目，今天值得关注，因为 Catalog 正在成为湖仓控制面的核心竞争点。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,221  
  Rust 编写的 Iceberg REST Catalog，强调安全、轻量与高性能，体现湖仓基础设施的云原生演化。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,910  
  面向联邦元数据与数据目录管理，适合多区域、多引擎、多存储环境下的统一治理。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,822  
  面向实时分析的流式存储项目，反映“流处理与分析存储融合”正在加快。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,201  
  基于对象存储重构的数据仓库/分析平台，兼具湖仓与云原生仓库属性，值得持续跟踪。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐698  
  新型列式文件格式方向项目，虽然体量尚小，但文件格式层创新仍可能影响未来分析引擎适配。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,135  
  大数据平台能力较全，兼具计算、存储与调度属性，是重型湖仓/数据平台路线的代表。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,643  
  统一查询层代表项目，持续受欢迎说明“跨湖仓/跨仓库联邦查询”仍是企业刚需。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,670  
  分布式 SQL 查询引擎经典项目，仍在大数据查询生态中保持影响力。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,507  
  Rust SQL 查询引擎，近年已成为新一代分析系统和自研引擎的重要内核组件。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐1,993  
  DataFusion 的分布式执行形态，体现模块化查询内核向分布式分析演进。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,941  
  DuckDB 的 WebAssembly 版本，代表浏览器侧 SQL 分析与前端本地数据处理的成熟方向。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,617  
  存储无关的 MySQL 兼容查询引擎，适合作为自定义数据系统 SQL 层基础。

- [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx) — ⭐112  
  SQL-on-everything 路线项目，面向多源与多格式查询，契合“数据就地分析”趋势。

- [Canner/wren-engine](https://github.com/Canner/wren-engine) — ⭐563  
  语义层与 MCP/AI Agent 结合的查询语义引擎，显示“数据语义层”正在进入 AI 工具链。

---

## 🔗 数据集成与 ETL

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,309  
  面向数据库、Kafka、S3 到 Iceberg/Parquet 的高速复制工具，直接命中实时数仓接入需求。

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,052  
  轻量 Python 数据加载工具，因上手门槛低和工程化友好，持续被现代数据栈采用。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,374  
  Segment 替代方向，适合事件采集、路由与仓库落地，是 CDP 与数据集成交叉层的重要项目。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,641  
  开源 Reverse ETL，反映“仓到业务系统”的反向数据同步需求持续增长。

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky) — ⭐3,707  
  基于 Flink 的实时数据开发平台，说明流式数据开发与运维一体化仍具广泛需求。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  可配置 ETL 项目，虽然体量较小，但代表传统 ETL 工具仍有稳定用户群。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset) — ⭐70,985  
  开源 BI 与数据探索平台头部项目，长期高热度说明 SQL 驱动 BI 仍是数据消费主入口。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,421  
  强调易用性的 BI 工具，适合中小团队和业务分析自助化，社区广度非常强。

- [getredash/redash](https://github.com/getredash/redash) — ⭐28,280  
  老牌查询与可视化工具，虽增长趋稳，但仍是轻量 BI/SQL 分享的重要选项。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,275  
  dbt-native 数据可观测性方案，体现数据质量与数据可靠性已成为现代数仓标配能力。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,449  
  面向多数据库/数据仓库的 SQL Assistant，适合统一查询入口与交互式分析。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐973  
  分析数据库基准测试项目，随着引擎竞争加剧，公开 benchmark 的参考价值进一步提升。

- [apache/doris-mcp-server](https://github.com/apache/doris-mcp-server) — ⭐266  
  Doris 与 MCP 生态连接的工具，说明分析数据库正在主动适配 AI Agent 调用方式。

---

## 3. 趋势信号分析

尽管今日 GitHub 实时 Trending 没有 OLAP 项目上榜，但从主题活跃度看，**社区关注最集中的仍是“高性能分析引擎 + 湖仓 Catalog + 统一查询层”**。其中，ClickHouse、DuckDB、Doris、StarRocks 代表执行与存储一体化的主战场；Trino、Presto、DataFusion 则强化跨源查询和可组合计算内核。一个明显信号是，**Iceberg Catalog 与元数据控制面正在成为新热点**，[Polaris](https://github.com/apache/polaris)、[Lakekeeper](https://github.com/lakekeeper/lakekeeper)、[Gravitino](https://github.com/apache/gravitino) 分别从标准化、云原生和联邦治理切入。另一个值得注意的方向是 **嵌入式与本地分析执行**，如 DuckDB、chDB、duckdb-wasm，反映分析能力正从集中式仓库扩展到应用内、浏览器内和边缘环境。这与近期湖仓/云数仓演进高度一致：底层对象存储和开放表格式持续标准化，上层查询执行正走向轻量化、模块化与多场景嵌入。

---

## 4. 社区关注热点

- **[Apache Polaris](https://github.com/apache/polaris)**  
  Iceberg Catalog 标准化的关键节点项目，值得关注其是否成为跨引擎互操作的新基础层。

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  Rust 查询内核已从单项目成长为生态底座，未来可能持续催生更多“可嵌入分析系统”。

- **[DuckDB](https://github.com/duckdb/duckdb)** 与 **[duckdb-wasm](https://github.com/duckdb/duckdb-wasm)**  
  本地分析、浏览器分析、应用嵌入分析的最佳观察样本，适合关注其在数据产品中的普及速度。

- **[OLake](https://github.com/datazip-inc/olake)**  
  数据接入正加速向 Iceberg/Parquet 原生写入收敛，这类复制工具会直接影响实时湖仓建设成本。

- **[Apache Doris MCP Server](https://github.com/apache/doris-mcp-server)** / **[Wren Engine](https://github.com/Canner/wren-engine)**  
  说明数据库和语义层正在主动拥抱 AI Agent 接口，未来“SQL/语义层/MCP”可能成为新的数据消费入口。

--- 

如果你愿意，我可以继续把这份日报再整理成一版更适合微信公众号/飞书周报格式的「精简版」，或者补一份 **“中美主流 OLAP 项目对比表”**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*