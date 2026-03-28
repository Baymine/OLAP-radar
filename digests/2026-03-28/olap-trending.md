# OLAP & 数据基础设施开源趋势日报 2026-03-28

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-28 01:21 UTC

---

# OLAP & 数据基础设施开源趋势日报
日期：2026-03-28

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中明确属于 OLAP / 数据基础设施 / 分析引擎方向的项目基本没有直接命中**。12 个 Trending 项目主要集中在 AI Agent、语音、OCR、办公协作与通用应用，**不纳入本次 OLAP/数据基础设施分析**。

因此，今日日报的主体判断主要依据 **GitHub topic 搜索结果中的 76 个数据基础设施相关仓库**，并结合“今日 Trending 无直接数据项目上榜”这一信号做趋势分析。

---

## 二、分类结果

> 说明：一个项目可能横跨多个维度，下列按“主要属性”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [crate/crate](https://github.com/crate/crate)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)

### 📦 存储格式与湖仓
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)

### ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [roapi/roapi](https://github.com/roapi/roapi)
- [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)

### 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [data-dot-all/dataall](https://github.com/data-dot-all/dataall)
- [elbwalker/walkerOS](https://github.com/elbwalker/walkerOS)

### 🧰 数据工具
- [grafana/grafana](https://github.com/grafana/grafana)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [PostHog/posthog](https://github.com/PostHog/posthog)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)
- [plausible/analytics](https://github.com/plausible/analytics)
- [umami-software/umami](https://github.com/umami-software/umami)
- [allinurl/goaccess](https://github.com/allinurl/goaccess)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [cloudera/hue](https://github.com/cloudera/hue)

---

## 三、今日速览

1. **今日 GitHub Trending 榜单没有出现纯 OLAP/数据基础设施项目**，说明开源社区的短期注意力仍然被 Agent、内容生成和 AI 应用层吸走。  
2. 但从主题搜索看，**数据基础设施核心盘依然稳定活跃**，尤其是 ClickHouse、DuckDB、Doris、StarRocks、Trino、DataFusion 等分析引擎与查询层项目保持高热度。  
3. 湖仓方向继续向“**开放元数据目录 + 实时摄取 + 统一计算**”收敛，Apache Polaris、Gravitino、Fluss、Lakekeeper 这一组项目值得持续跟踪。  
4. 一个显著信号是：**面向 AI 的分析型数据底座**正在增多，例如 Databend、MatrixOne、SeekDB、Wren Engine 等都在强调 AI agent、混合检索或统一上下文能力。  
5. 数据工具层则继续呈现“两极化”：一端是 Superset/Metabase/Grafana 这类成熟平台，另一端是 Langfuse、Elementary 这类面向 LLM 与现代数据栈的新监控/可观测性工具。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,578  
  实时分析数据库代表项目，列式存储与高吞吐查询能力仍是开源 OLAP 的事实标准之一，今日仍是分析数据库关注中心。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,011  
  嵌入式分析数据库的标杆，持续受益于本地分析、Notebook、Parquet 直查和单机 OLAP 场景的扩张。

- [apache/doris](https://github.com/apache/doris) — ⭐15,160  
  统一分析数据库，兼顾实时分析与湖仓访问，近年在“易用型 MPP”路线中影响力持续上升。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,512  
  主打亚秒级分析与湖上查询，适合实时数仓和高并发 BI，是当前云原生 OLAP 的核心玩家之一。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,793  
  面向时间序列与实时分析的高性能数据库，在 IoT、监控和金融行情类场景中有持续吸引力。

- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase) — ⭐10,041  
  从事务型数据库扩展到 HTAP/AI workload，反映数据库一体化架构在开源世界持续升温。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,647  
  基于 ClickHouse 的 in-process OLAP SQL 引擎，适合嵌入式分析与 Python 工作流，代表轻量 OLAP 的新趋势。

- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,945  
  将实时分析能力带到 Postgres 表之上，体现“OLAP 回流 PostgreSQL 生态”的值得关注方向。

---

## 📦 存储格式与湖仓

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,206  
  以对象存储为核心重构的云数仓/湖仓系统，并开始强调 Analytics + Search + AI 的统一架构，方向很新。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,927  
  联邦式开放元数据目录，切中多引擎、多区域、跨云元数据治理痛点，是湖仓互操作的关键基础设施。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,886  
  Apache Iceberg 目录服务项目，代表湖仓生态正从“表格式”走向“标准化 catalog”。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,228  
  Rust 编写的 Apache Iceberg REST Catalog，实现轻量、安全、易部署，是新一代 catalog 服务的重要观察点。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,832  
  面向实时分析的流式存储项目，体现湖仓架构正把“流式写入 + 分析读取”做成底层原语。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,226  
  兼顾实时写入、并发更新与增量分析的湖仓框架，强调 BI 与 AI 统一场景。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐703  
  面向大规模列式数据的新文件格式，虽然体量较小，但属于值得跟踪的底层格式创新方向。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,665  
  联邦查询引擎代表，持续受益于企业多源异构数据分析需求，是湖仓时代查询层核心项目。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,669  
  经典分布式 SQL 查询引擎，依然是大数据交互式分析的重要基础设施。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,542  
  Rust 查询引擎明星项目，已成为许多新系统的执行层内核，值得重点关注其“可组合引擎”生态位。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,002  
  DataFusion 的分布式扩展，反映 Rust 数据系统正在向分布式执行能力继续演进。

- [roapi/roapi](https://github.com/roapi/roapi) — ⭐3,416  
  可直接对静态数据集暴露 API，适合轻量数据服务化，是“无代码查询服务化”的实用工具。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,621  
  存储无关的 MySQL 兼容查询引擎，适合作为嵌入式 SQL 层，技术可复用性强。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  Firebolt 分布式查询引擎的自托管版本，虽然 GitHub 星数不高，但代表商业云数仓核心能力逐步开源化。

- [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce) — ⭐114  
  纯 C 的 SIMD 列式分析数据库，小而新，体现“极简高性能执行引擎”仍有创新空间。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,130  
  Python 数据加载工具，面向现代 ELT 工作流，使用门槛低，持续受到数据工程社区欢迎。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,379  
  Segment 替代方案，聚焦隐私与安全，是事件采集、路由与仓库落地的重要开源选项。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,313  
  面向 Apache Iceberg/Parquet 的实时复制工具，覆盖数据库、Kafka 与对象存储，贴近湖仓实时入湖需求。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
  开源 Reverse ETL，反映现代数据栈已从“入仓”转向“仓到业务系统”的闭环。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit) — ⭐478  
  面向数据工作流开发、部署和运维的一体化框架，适合工程化数据管道管理。

- [data-dot-all/dataall](https://github.com/data-dot-all/dataall) — ⭐251  
  AWS 上的数据市场与协作平台，虽然星数不高，但直指数据产品化与共享治理场景。

---

## 🧰 数据工具

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,817  
  可观测性与数据可视化平台，连接多数据源，是现代分析与监控前台的基础设施级项目。

- [apache/superset](https://github.com/apache/superset) — ⭐71,187  
  最主流的开源 BI 平台之一，在语义层、可视化和 SQL 探索上的生态优势仍非常明显。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,604  
  面向业务用户的数据分析工具，低门槛与嵌入式分析能力让它长期保持强社区吸引力。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,254  
  产品分析平台已演进为更完整的数据与开发者平台，反映事件分析和应用可观测性融合趋势。

- [langfuse/langfuse](https://github.com/langfuse/langfuse) — ⭐23,906  
  LLM 可观测性平台，虽然偏 AI 工程，但本质是新型 analytics/observability 基础设施，热度非常高。

- [umami-software/umami](https://github.com/umami-software/umami) — ⭐35,876  
  轻量隐私友好的 Web Analytics 平台，适合自托管分析，说明隐私分析需求仍具稳定市场。

- [plausible/analytics](https://github.com/plausible/analytics) — ⭐24,480  
  隐私优先的网站分析工具，是 GA 替代路线中的成熟代表。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐976  
  分析数据库基准测试项目，在数据库竞争加剧时，其参考意义正在增强。

---

## 五、趋势信号分析

今天最显著的信号是：**纯 OLAP/数据基础设施项目没有进入 GitHub 全站 Trending 前列**，说明短周期流量仍由 AI 应用层主导；但在垂直主题维度，**分析数据库、联邦查询、湖仓 catalog 与数据可观测性**依旧是最稳固的活跃方向。尤其是 ClickHouse、DuckDB、Doris、StarRocks、Trino、DataFusion 代表的“高性能分析引擎 + 开放数据接口”路线，继续构成数据基础设施主航道。

新兴方向上，**catalog 与流式湖仓底座**值得重点关注：Polaris、Gravitino、Lakekeeper、Fluss 表明社区正在从“讨论 Iceberg/表格式”转向“构建可互操作的元数据控制面与实时写入层”。同时，Databend、MatrixOne、SeekDB、Wren Engine 这类项目把 **AI Agent、搜索、向量与 OLAP** 放进同一叙事中，说明湖仓/云数仓正在向“AI-native data platform”演进。与近期湖仓发展趋势一致，未来竞争焦点可能不再只是存储格式，而是**统一 catalog、统一查询层、统一实时摄取与 AI 访问接口**。

---

## 六、社区关注热点

- **[apache/polaris](https://github.com/apache/polaris)**  
  Iceberg catalog 标准化的重要节点，谁掌握 catalog，谁更可能成为多引擎湖仓互操作核心。

- **[apache/gravitino](https://github.com/apache/gravitino)**  
  面向联邦元数据治理，契合企业跨云、跨地域、跨计算引擎的数据管理现实需求。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询执行层生态越来越强，许多新数据库/AI 数据系统正在围绕它构建能力。

- **[databendlabs/databend](https://github.com/databendlabs/databend)**  
  把数仓、搜索、AI、对象存储统一在一个架构里，代表后湖仓时代的重要产品方向。

- **[Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake)**  
  Postgres 上的实时分析能力扩展值得关注，说明“基于 PostgreSQL 的 OLAP 增强”正在成为新热点。

如果你愿意，我还可以继续把这份日报输出为：
1. **表格版摘要**
2. **Markdown 可直接发布版**
3. **按“国内厂商/Apache/创业项目”进一步拆分版**

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*