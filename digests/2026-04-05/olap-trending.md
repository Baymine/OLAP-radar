# OLAP & 数据基础设施开源趋势日报 2026-04-05

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-04-05 01:44 UTC

---

# OLAP & 数据基础设施开源趋势日报
日期：2026-04-05

## 一、过滤结果

### 今日 Trending 榜单过滤结论
今日 8 个 Trending 仓库中，**无明确属于 OLAP / 数据基础设施 / 分析引擎** 的项目。  
榜单主要被 AI Agent、应用工具和通用软件占据，因此**今日新增 stars 维度暂无可直接用于数据基础设施赛道的热榜信号**。

### 纳入分析的项目来源
本日报主要基于“**数据基础设施主题搜索结果**”中的 72 个仓库，筛选出与以下方向明确相关的项目：
- OLAP/分析型数据库
- 查询引擎/执行层
- 列式/湖仓存储格式
- 数据集成、摄取、ETL
- BI、可观测性、SQL 工具、Benchmark

剔除项包括：
- 与数据基础设施无关的通用工具/前端项目
- 仅弱相关或语义噪声项目（如 `zunyon/rls`、BIM viewer 等）

---

## 二、分类结果

## 1. 今日速览

1. **今天 GitHub 实时 Trending 没有出现数据基础设施项目**，说明短期 GitHub 流量仍明显被 AI 应用层和 Agent 框架吸走。  
2. 但从主题活跃仓库看，**OLAP 引擎、湖仓目录层、嵌入式分析引擎、DataFusion 生态**依然非常活跃，是当前开源数据底座最强信号。  
3. **ClickHouse、DuckDB、Doris、StarRocks、Databend、Trino**继续构成分析引擎主干；与此同时，**Apache Polaris、Lakekeeper、Fluss、OLake**反映出湖仓元数据、流式存储和实时摄取正在持续升温。  
4. 一个明显趋势是：**“AI-ready / agent-ready” 正在成为数据基础设施项目的新叙事层**，不少项目开始把 SQL、搜索、向量、对象存储和 Python/Agent 执行环境整合到统一引擎中。  

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,702  
  实时分析数据库代表项目，列式存储与高并发分析能力依然是现代 OLAP 的事实标准之一，社区规模持续领先。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,177  
  嵌入式分析数据库标杆，凭借单机分析、Parquet 友好和开发者体验，已成为数据工程与本地分析的基础设施核心。

- [apache/doris](https://github.com/apache/doris) — ⭐15,176  
  面向统一分析的 MPP 数据库，兼顾实时与交互式查询，持续受到数仓替代与近实时分析场景关注。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,541  
  面向亚秒级分析与 Lakehouse 查询优化的代表项目，数据湖查询性能叙事很强，适合关注云数仓替代趋势。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,232  
  面向对象存储重构的数据仓库，强调 Analytics / Search / AI / Python Sandbox 一体化，是“AI-ready warehouse”典型代表。

- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase) — ⭐10,047  
  从传统分布式数据库向 HTAP/AI Workload 扩展，体现事务与分析融合基础设施的演进方向。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,825  
  高性能时序 OLAP 数据库，在实时指标、IoT、金融时序分析场景中仍具稳定吸引力。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone) — ⭐1,867  
  AI-native HTAP 数据库，融合 Git-for-Data、向量搜索与分析能力，代表新一代智能应用底座探索。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐707  
  面向大规模列式数据的新文件格式，值得关注其是否会在 Arrow/Parquet 之外形成新的高性能格式探索。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,891  
  Apache Iceberg 开放目录服务，反映湖仓竞争已从表格式扩展到 catalog 互操作层。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,240  
  Rust 实现的 Iceberg REST Catalog，轻量、安全、工程化强，是云原生湖仓控制面的重要新势力。

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,934  
  面向联邦元数据与多地域管理的数据目录系统，适合关注多引擎共享元数据趋势。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,843  
  面向实时分析的流式存储，连接流处理与湖仓分析，是“streaming lakehouse”方向的重要信号。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,227  
  实时湖仓框架，强调并发更新、增量分析与云存储场景，贴近实时 BI 与 AI 数据底座需求。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐981  
  虽非存储格式项目，但已成为分析数据库对比的事实 benchmark 基础设施，湖仓/OLAP 选型中影响力很强。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,686  
  分布式 SQL 查询引擎代表，持续承担数据湖、异构源联邦查询和开放计算层角色。

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,560  
  Rust SQL Query Engine 核心项目，正成为新一代可组合分析引擎与嵌入式计算层的重要底座。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,005  
  DataFusion 的分布式执行扩展，展示 Rust 数据引擎向集群级执行演进的路径。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,655  
  基于 ClickHouse 的 in-process OLAP SQL Engine，把高性能分析能力嵌入 Python/本地应用，值得持续跟踪。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,623  
  存储无关的 MySQL 兼容查询引擎，适合作为数据库内核与可嵌入 SQL 层观察样本。

- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐396  
  面向 DataFusion 的 pushdown cache，体现执行层优化、缓存下推与查询加速的前沿探索。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐196  
  Firebolt 分布式查询引擎的自托管版本，值得观察云数仓能力向开源内核释放的边界。

- [nazarii-piontko/datafusion-sharp](https://github.com/nazarii-piontko/datafusion-sharp) — ⭐8  
  DataFusion 的 .NET 绑定，说明其正在从 Rust 内核向更多开发生态扩散。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,169  
  Python 数据加载工具，聚焦轻量、工程友好的数据写入流程，是现代 ELT 工具链中的高活跃项目。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,314  
  面向 Apache Iceberg/Parquet 的高性能摄取工具，直接对应“数据库/Kafka/S3 → 湖仓”实时同步需求。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,384  
  开源 CDP/事件采集基础设施，虽偏产品数据，但在数据入湖与实时分发链路中依旧重要。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,648  
  开源 Reverse ETL，说明数据工程重心已从“写入仓库”向“仓库反哺业务系统”继续延伸。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit) — ⭐479  
  覆盖 Python + SQL 的数据工作流框架，适合作为企业数仓任务开发与运维一体化参考。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  经典可配置 ETL 工具，虽非头部，但体现传统 ETL 仍在特定场景具备稳固需求。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset) — ⭐72,214  
  开源 BI 平台标杆，仍是连接现代 OLAP 引擎与业务分析用户最重要的可视化入口之一。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,976  
  虽偏可观测性，但已成为多数据源统一分析与可视化控制台，跨 metrics/logs/traces/SQL 的平台属性更强。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,743  
  面向自助分析的轻量 BI 平台，适合中小团队和嵌入式分析场景，社区稳定成熟。

- [PostHog/posthog](https://github.com/PostHog/posthog) — ⭐32,391  
  产品分析平台向数据仓库/CDP/AI 助手一体化扩张，代表“分析产品平台化”趋势。

- [plausible/analytics](https://github.com/plausible/analytics) — ⭐24,533  
  轻量、隐私优先的 Web Analytics，反映“可部署、自控、低复杂度”分析工具仍有强需求。

- [langfuse/langfuse](https://github.com/langfuse/langfuse) — ⭐24,357  
  LLM Observability 平台，虽不属于传统 OLAP，但已成为新一代 AI 数据分析与评测基础设施。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,297  
  dbt-native 数据可观测性方案，说明数仓治理、数据质量与观测层仍是工程重点。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,445  
  面向数据库/仓库的 SQL Query Assistant，体现 SQL IDE 和统一访问入口在企业数据栈中的持续价值。

---

## 3. 趋势信号分析

今天虽然 GitHub 总榜没有出现数据基础设施项目，但从主题活跃仓库可以看到，**真正获得持续社区关注的并不是传统“单一数据库”，而是更靠近湖仓控制面、可嵌入计算层和 AI-ready 数据底座的项目**。一方面，**ClickHouse、DuckDB、Doris、StarRocks、Trino**仍是分析引擎主轴；另一方面，**Apache Polaris、Lakekeeper、Gravitino、Fluss**说明社区正在把注意力转向 **Iceberg catalog、联邦元数据、流式湖仓** 等基础层能力。  
另一个明显信号是 **DataFusion 生态外溢**：不仅有核心引擎、分布式版本 Ballista，还有缓存、.NET 绑定、上层 context engine 等周边项目，表明 Rust 查询内核正在形成平台效应。与此同时，**Databend、MatrixOne、SeekDB、uni-db**等项目开始把搜索、向量、对象存储、SQL 和 Agent 场景合并叙事，这与近期湖仓/云数仓向“统一分析 + AI 工作负载”演进高度一致。  

---

## 4. 社区关注热点

- **[apache/polaris](https://github.com/apache/polaris)**  
  Iceberg 目录层正在成为湖仓互操作核心，catalog 不再只是附属组件，而是平台控制面。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态持续扩张，值得关注其在嵌入式分析、可组合执行层和新数据库内核中的渗透。

- **[databendlabs/databend](https://github.com/databendlabs/databend)**  
  “Analytics + Search + AI + Python” 一体化叙事非常鲜明，是观察 AI-native warehouse 的代表样本。

- **[apache/fluss](https://github.com/apache/fluss)**  
  流式存储面向实时分析的定位很清晰，适合跟踪 streaming lakehouse 是否会成为下一阶段热点。

- **[chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  in-process OLAP 引擎趋势值得重视，说明分析能力正进一步下沉到应用、Notebook 和本地开发环境。  

如果你愿意，我还可以继续把这份日报补成一个**更适合内部周报/公众号发布的版本**，或者额外输出一份 **“项目清单表格版（按 stars 排序）”**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*