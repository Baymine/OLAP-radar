# OLAP & 数据基础设施开源趋势日报 2026-03-19

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-19 01:25 UTC

---

# OLAP & 数据基础设施开源趋势日报
日期：2026-03-19

## 一、过滤结果

### 1) 今日 Trending 榜单筛选
今日 Trending 的 6 个仓库中，**无明确属于 OLAP / 数据基础设施 / 分析引擎** 的项目。  
它们主要集中在 AI 编码代理、模型训练 UI、仿真引擎、模拟器等方向，因此**本日报不纳入**。

### 2) 纳入分析的项目范围
本次主要依据“数据基础设施主题搜索结果”中，与以下方向明确相关的仓库进行分析：
- OLAP/分析型数据库
- 列式存储/时间序列/MPP/HTAP
- 湖仓 catalog / streaming storage / benchmark
- SQL 查询引擎 / 嵌入式分析引擎 / 分布式计算
- ETL / ingestion / Reverse ETL / 数据可观测性 / BI 与 SQL 工具

---

## 二、分类结果

## 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [crate/crate](https://github.com/crate/crate)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)

## 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [apache/polaris](https://github.com/apache/polaris)
- [apache/gravitino](https://github.com/apache/gravitino)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [pixelsdb/pixels](https://github.com/pixelsdb/pixels)

## ⚙️ 查询与计算
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever)
- [KipData/KiteSQL](https://github.com/KipData/KiteSQL)
- [apache/doris](https://github.com/apache/doris)（兼具分析引擎与查询计算特征）
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)（兼具分析引擎与 lakehouse query 特征）

## 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

## 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [getredash/redash](https://github.com/getredash/redash)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [cloudera/hue](https://github.com/cloudera/hue)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/doris-mcp-server](https://github.com/apache/doris-mcp-server)

---

## 三、今日速览

1. 今日 GitHub 实时 Trending 没有直接落在 OLAP/数据基础设施赛道的项目，说明**数据工程方向今天的热度更多体现在持续活跃的主题生态，而非单日爆发榜单**。  
2. 从主题活跃仓库看，**OLAP 主引擎格局依旧稳定**，ClickHouse、DuckDB、Doris、StarRocks、Databend 仍是社区关注中心。  
3. 湖仓侧的重点不再只是“表格式”本身，而是进一步转向 **catalog、streaming storage、对象存储原生架构**，如 Polaris、Gravitino、Lakekeeper、Fluss。  
4. 查询计算层继续向 **嵌入式、Rust 化、Arrow/Parquet 生态融合** 演进，DataFusion、chDB、Arc 等项目体现出轻量化和可组合化趋势。  
5. 数据工具层则呈现“**BI/可观测性/SQL 助手/Benchmark**”协同发展，社区正在补齐从引擎到使用体验的完整链路。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

### 1. [ClickHouse](https://github.com/ClickHouse/ClickHouse)
- Stars：46,388
- 今日新增：—  
- 说明：实时分析数据库代表项目，仍是开源 OLAP 的头部基准，长期影响列式存储、向量化执行和实时聚合设计。

### 2. [DuckDB](https://github.com/duckdb/duckdb)
- Stars：36,761
- 今日新增：—  
- 说明：嵌入式分析数据库事实标准之一，持续推动“本地分析 + Parquet + DataFrame”工作流普及。

### 3. [Apache Doris](https://github.com/apache/doris)
- Stars：15,123
- 今日新增：—  
- 说明：统一分析数据库路线清晰，兼顾实时分析与 lakehouse 查询，适合关注中大型企业分析栈演进。

### 4. [StarRocks](https://github.com/StarRocks/starrocks)
- Stars：11,485
- 今日新增：—  
- 说明：主打亚秒级分析与湖仓查询融合，是当前云原生 OLAP 与外表/湖表协同的重要代表。

### 5. [Databend](https://github.com/databendlabs/databend)
- Stars：9,199
- 今日新增：—  
- 说明：强调对象存储原生和统一 Analytics/Search/AI/Python Sandbox，体现新一代“AI-ready warehouse”方向。

### 6. [QuestDB](https://github.com/questdb/questdb)
- Stars：16,772
- 今日新增：—  
- 说明：高性能时序数据库，适合关注时间序列 OLAP、可观测性后端和金融行情分析场景。

### 7. [chDB](https://github.com/chdb-io/chdb)
- Stars：2,641
- 今日新增：—  
- 说明：将 ClickHouse 能力嵌入进程内 Python 场景，是“分析引擎库化”趋势的重要样本。

### 8. [Apache Cloudberry](https://github.com/apache/cloudberry)
- Stars：1,191
- 今日新增：—  
- 说明：作为成熟 MPP 路线的开源承接者，值得关注传统 Greenplum 系生态的社区延续。

---

## 📦 存储格式与湖仓

### 1. [Apache Polaris](https://github.com/apache/polaris)
- Stars：1,879
- 今日新增：—  
- 说明：面向 Apache Iceberg 的开放 catalog，代表湖仓治理层标准化趋势。

### 2. [Apache Gravitino](https://github.com/apache/gravitino)
- Stars：2,920
- 今日新增：—  
- 说明：聚焦联邦元数据与开放数据目录，反映多引擎、多地域湖仓治理需求正在上升。

### 3. [Lakekeeper](https://github.com/lakekeeper/lakekeeper)
- Stars：1,222
- 今日新增：—  
- 说明：Rust 实现的 Iceberg REST Catalog，说明 catalog 基础设施开始向高性能、轻量部署演化。

### 4. [Apache Fluss](https://github.com/apache/fluss)
- Stars：1,824
- 今日新增：—  
- 说明：面向实时分析的 streaming storage，体现流式湖仓正在从计算层下沉到存储层设计。

### 5. [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- Stars：699
- 今日新增：—  
- 说明：新的列式数据文件格式项目，虽然仍偏早期，但对大规模列式数据存储演进具有观察价值。

### 6. [YTsaurus](https://github.com/ytsaurus/ytsaurus)
- Stars：2,136
- 今日新增：—  
- 说明：大数据平台型项目，兼具存储与计算能力，适合观察湖仓/平台一体化架构实践。

### 7. [Pixels](https://github.com/pixelsdb/pixels)
- Stars：896
- 今日新增：—  
- 说明：面向云原生分析的存储与计算引擎，值得关注其在 on-prem 与 cloud 间的统一设计。

---

## ⚙️ 查询与计算

### 1. [Apache DataFusion](https://github.com/apache/datafusion)
- Stars：8,509
- 今日新增：—  
- 说明：Rust SQL 查询引擎核心项目，已成为 Arrow 生态中最重要的通用执行内核之一。

### 2. [Trino](https://github.com/trinodb/trino)
- Stars：12,646
- 今日新增：—  
- 说明：分布式 SQL 查询引擎代表，仍是跨源联邦查询和湖仓 SQL 访问的重要基座。

### 3. [Presto](https://github.com/prestodb/presto)
- Stars：16,666
- 今日新增：—  
- 说明：经典大数据查询引擎，持续在企业级查询加速与多源 SQL 场景中保持影响力。

### 4. [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista)
- Stars：1,993
- 今日新增：—  
- 说明：DataFusion 的分布式延伸，代表 Rust 查询栈从嵌入式走向集群化。

### 5. [go-mysql-server](https://github.com/dolthub/go-mysql-server)
- Stars：2,617
- 今日新增：—  
- 说明：存储无关的 MySQL 兼容查询引擎，适合关注“引擎组件化”和 SQL runtime 内嵌场景。

### 6. [QLever](https://github.com/ad-freiburg/qlever)
- Stars：798
- 今日新增：—  
- 说明：面向 RDF/SPARQL 的高性能查询引擎，显示图查询和语义数据处理仍有独立优化空间。

### 7. [KiteSQL](https://github.com/KipData/KiteSQL)
- Stars：685
- 今日新增：—  
- 说明：嵌入式 Rust 关系数据库项目，虽体量较小，但符合轻量查询引擎持续升温的方向。

---

## 🔗 数据集成与 ETL

### 1. [dlt](https://github.com/dlt-hub/dlt)
- Stars：5,062
- 今日新增：—  
- 说明：Python 数据加载工具，贴近现代 analytics engineering 工作流，适合快速接入 warehouse/lakehouse。

### 2. [OLake](https://github.com/datazip-inc/olake)
- Stars：1,310
- 今日新增：—  
- 说明：面向数据库、Kafka、S3 到 Iceberg/Parquet 的复制工具，直接对应实时湖仓 ingestion 热点。

### 3. [Rudder Server](https://github.com/rudderlabs/rudder-server)
- Stars：4,375
- 今日新增：—  
- 说明：偏数据采集/CDP/warehouse sync 的基础设施，体现数据采集到仓库的一体化需求。

### 4. [Multiwoven](https://github.com/Multiwoven/multiwoven)
- Stars：1,643
- 今日新增：—  
- 说明：开源 Reverse ETL 代表项目，说明仓库数据反向激活仍是现代数据栈的重要环节。

### 5. [Dinky](https://github.com/DataLinkDC/dinky)
- Stars：3,709
- 今日新增：—  
- 说明：基于 Flink 的实时数据开发平台，适合关注流式 ETL、任务编排与实时数仓建设。

### 6. [Transformalize](https://github.com/dalenewman/Transformalize)
- Stars：161
- 今日新增：—  
- 说明：传统 ETL 配置化路线项目，虽热度不高，但能反映低代码数据处理需求依然存在。

---

## 🧰 数据工具

### 1. [Apache Superset](https://github.com/apache/superset)
- Stars：71,014
- 今日新增：—  
- 说明：最具代表性的开源 BI 平台之一，是 OLAP 引擎生态外层消费与可视化的重要入口。

### 2. [Metabase](https://github.com/metabase/metabase)
- Stars：46,441
- 今日新增：—  
- 说明：低门槛 BI 工具，持续承接自助分析和 embedded analytics 需求。

### 3. [Grafana](https://github.com/grafana/grafana)
- Stars：72,700
- 今日新增：—  
- 说明：虽然偏 observability，但已深度连接多类分析型数据源，是指标分析与实时可视化的核心工具。

### 4. [Elementary](https://github.com/elementary-data/elementary)
- Stars：2,277
- 今日新增：—  
- 说明：dbt-native 数据可观测性工具，反映 analytics engineering 正从建模走向质量治理。

### 5. [Hue](https://github.com/cloudera/hue)
- Stars：1,449
- 今日新增：—  
- 说明：开放 SQL 查询助手，适合多仓库/多引擎环境下的统一交互入口。

### 6. [ClickBench](https://github.com/ClickHouse/ClickBench)
- Stars：973
- 今日新增：—  
- 说明：分析数据库 benchmark 基准项目，在当前 OLAP 引擎竞争格局中具有持续参考价值。

### 7. [Apache Doris MCP Server](https://github.com/apache/doris-mcp-server)
- Stars：266
- 今日新增：—  
- 说明：把分析数据库接入 AI Agent 工具体系，是“数据库可被智能体直接消费”的新接口趋势。

---

## 五、趋势信号分析

今天虽然 GitHub 实时 Trending 没有出现直接的数据基础设施项目，但主题活跃数据清楚显示：**社区关注仍高度集中在 OLAP 引擎 + 湖仓治理 + 嵌入式查询内核** 三条主线。首先，ClickHouse、DuckDB、Doris、StarRocks、Databend 继续巩固头部地位，说明高性能分析数据库仍是开源数据栈最稳定的价值中心。其次，湖仓方向的关注点正在从单纯存储格式扩展到 **catalog、streaming storage 与对象存储原生架构**，Polaris、Gravitino、Lakekeeper、Fluss 都体现了这一趋势。再者，DataFusion、chDB、Arc 等项目表明，**轻量化、可嵌入、Rust 化、Arrow/Parquet 原生** 的查询范式正在持续升温。值得注意的是，像 nimble 这样的新列式文件格式虽未形成主流，但已释放出底层存储格式继续创新的信号。这些变化与近期湖仓/云数仓演进高度一致：开放元数据、可组合查询层、对象存储优先，正在替代传统“单体数仓”思路。

---

## 六、社区关注热点

- **[Databend](https://github.com/databendlabs/databend)**  
  值得关注其“Analytics + Search + AI + Python Sandbox”一体化定位，代表 AI 时代仓库产品形态正在扩张。

- **[Apache Polaris](https://github.com/apache/polaris)** 与 **[Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  两者共同反映 Iceberg catalog 正成为湖仓控制面的竞争焦点，未来可能像 Hive Metastore 一样成为关键基础设施层。

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态的核心支点，适合作为观察 Arrow-native 执行栈、可嵌入 SQL 引擎和自定义计算平台的窗口。

- **[chDB](https://github.com/chdb-io/chdb)**  
  进程内 OLAP 引擎能力的代表，特别适合 Python/数据科学/轻量服务化场景，可能继续扩大“数据库库化”的影响。

- **[Apache Fluss](https://github.com/apache/fluss)**  
  如果实时分析和流式湖仓继续融合，Fluss 这类 streaming storage 项目有机会成为下一阶段实时数仓架构的重要基础组件。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*