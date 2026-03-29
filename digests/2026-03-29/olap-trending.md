# OLAP & 数据基础设施开源趋势日报 2026-03-29

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-29 01:43 UTC

---

# OLAP & 数据基础设施开源趋势日报｜2026-03-29

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中明确属于 OLAP/数据基础设施/分析平台相关的项目仅有 1 个**：

- [apache/superset](https://github.com/apache/superset) — 数据可视化与探索平台，属于 BI / 数据工具

其余 Trending 项目主要为 AI Agent、深度伪造、科研代理、CRM、OCR 等，**不纳入本次 OLAP/数据基础设施分析**。

主题搜索结果中则包含大量明确相关项目，覆盖 OLAP 数据库、查询引擎、湖仓、ETL、BI 与观测等方向。

---

## 二、分类结果

> 说明：一个项目可能跨多个类别，以下按“最主要定位”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [crate/crate](https://github.com/crate/crate)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake)

### 📦 存储格式与湖仓
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)

### ⚙️ 查询与计算
- [apache/datafusion](https://github.com/apache/datafusion)
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [Canner/wren-engine](https://github.com/Canner/wren-engine)

### 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [cloudera/hue](https://github.com/cloudera/hue)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [roapi/roapi](https://github.com/roapi/roapi)

---

## 三、今日速览

1. **今日真正进入 GitHub Trending 的数据项目只有 [Superset](https://github.com/apache/superset)**，说明在泛 AI 项目强势占榜背景下，数据基础设施方向的公开爆发点更多仍体现在长期活跃主题生态，而非短期热搜。
2. 从主题搜索看，**OLAP 主线依旧由 ClickHouse、DuckDB、Doris、StarRocks、Databend、DataFusion** 等项目主导，数据库内核与查询执行层仍是社区最稳固的关注中心。
3. 一个明显趋势是：**“分析引擎 + 湖仓 + AI/Agent 接口”正在融合**，如 Databend、MatrixOne、Wren Engine、SeekDB 等都在将查询、检索、向量/文本能力与 AI 场景结合。
4. 湖仓生态继续向**目录服务、流式存储、实时摄取**延展，Polaris、Gravitino、Fluss、OLake 这类项目说明社区关注点已从“存储格式本身”转向“开放元数据与实时数据通路”。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,585  
  实时分析数据库代表项目，仍是开源 OLAP 事实标准之一；在日志、可观测性、实时 BI 场景持续保持高热度。

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐37,028  
  嵌入式分析数据库标杆，凭借本地分析、Parquet 友好和开发者体验，持续影响“轻量 OLAP”范式。

- [apache/doris](https://github.com/apache/doris) — ⭐15,165  
  面向统一分析与高并发查询的 MPP 数据库，在实时分析与湖仓结合场景中关注度稳定。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,514  
  强调亚秒级分析和 lakehouse 查询能力，是云原生分析数据库路线的重要代表。

- [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,209  
  主打对象存储之上的统一 Warehouse 架构，并显式拥抱 AI Agent / Search / Python Sandbox，值得重点关注。

- [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,795  
  高性能时序数据库，面向金融、IoT、监控分析等实时场景，在“时序 + SQL OLAP”交叉点持续活跃。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone) — ⭐1,878  
  以 AI-native HTAP 为卖点，将事务、分析、向量检索融合，是数据库内核朝 AI 工作负载演化的信号。

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,646  
  将 ClickHouse 内核做成 in-process SQL 引擎，反映“嵌入式 OLAP”与 Python 本地分析结合的趋势。

---

## 📦 存储格式与湖仓

- [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,928  
  开放数据目录项目，面向联邦元数据与地理分布式场景；湖仓控制面正在成为独立热点。

- [apache/polaris](https://github.com/apache/polaris) — ⭐1,887  
  Apache Iceberg 互操作 catalog，说明 Iceberg 生态已从表格式走向标准化目录层建设。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,230  
  Rust 实现的 Iceberg REST Catalog，代表“轻量、高性能 catalog 服务”方向升温。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,225  
  实时、云原生 lakehouse 框架，强调增量分析与并发更新，贴近现代实时数仓需求。

- [apache/fluss](https://github.com/apache/fluss) — ⭐1,833  
  面向实时分析的 streaming storage，体现流存储与 OLAP/湖仓边界正在收敛。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,146  
  大数据平台型项目，覆盖存储与计算，是“平台级湖仓基础设施”路线代表。

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐704  
  新型列式文件格式项目，虽然仍偏底层，但值得关注其对大规模列式数据持久化的潜在影响。

---

## ⚙️ 查询与计算

- [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,545  
  Rust SQL 查询引擎核心项目，已成为新一代可组合分析系统的重要执行内核。

- [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,669  
  分布式 SQL 查询引擎代表，仍是数据湖与异构数据源联邦查询的重要选择。

- [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,668  
  经典分布式查询引擎，生态历史深厚，在大数据 SQL 查询领域仍具持续影响力。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐2,001  
  DataFusion 的分布式执行扩展，说明 Rust 查询栈正向集群化演进。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,953  
  将分析查询带入浏览器/WASM，代表“客户端本地分析”和边缘分析新范式。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  自托管分布式查询引擎版本开源，值得关注其对现代云数仓内核开源化的意义。

- [Canner/wren-engine](https://github.com/Canner/wren-engine) — ⭐610  
  以 DataFusion 为底座，面向 AI Agent 的上下文查询引擎，体现语义层与 MCP/Agent 的结合。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,135  
  Python 数据加载工具，开发体验友好，适合现代 ELT 工作流，社区采用面持续扩大。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,379  
  面向事件采集与分发的数据管道，是 CDP / warehouse 输入层的重要开源基础设施。

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,311  
  将数据库、Kafka、S3 快速复制到 Iceberg/Parquet，直接对应实时湖仓摄取这一热点需求。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
  开源 Reverse ETL，说明数据价值链已从“入仓”扩展到“从仓到业务系统”。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit) — ⭐478  
  覆盖开发、部署、运维的数据工作流框架，适合企业级 SQL/Python 数据流程管理。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset) — ⭐71,477（+31 today）  
  今日唯一进入 Trending 的数据项目；作为开源 BI 旗舰，说明“可视化消费层”仍有稳定社区关注。

- [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,827  
  可观测性与多数据源可视化平台，持续占据数据工具生态核心位置。

- [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,640  
  面向普适 BI 的开源工具，低门槛自助分析场景依旧有强大用户基础。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐976  
  分析数据库基准测试项目，在数据库性能竞争加剧背景下，基准体系的重要性持续提升。

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,289  
  dbt-native 数据可观测平台，反映数据质量与运营可观测性已成数据工程标配。

- [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,450  
  SQL 查询助手与数据仓库交互界面，代表传统数据平台工具层仍在活跃演进。

- [roapi/roapi](https://github.com/roapi/roapi) — ⭐3,416  
  为静态/缓变数据集快速暴露 API，适合轻量数据服务化场景，是分析结果产品化的一条实用途径。

---

## 五、趋势信号分析

今天的明确信号是：**数据消费层与查询内核层冷热分化明显**。GitHub Trending 上只有 [Superset](https://github.com/apache/superset) 作为数据项目出现，说明在短期舆论场中，纯数据基础设施不如 AI 应用抢眼；但从主题搜索看，社区真实活跃度仍集中在 **OLAP 引擎、查询执行框架与湖仓控制面**。尤其值得注意的是，**DataFusion、DuckDB、chDB、duckdb-wasm** 这类“可嵌入、可组合、可本地运行”的分析内核持续走强，表明查询能力正在从集中式数仓向应用内、浏览器端、边缘侧扩展。另一方面，**Polaris、Gravitino、Lakekeeper、Fluss、OLake** 反映出湖仓竞争已从表格式本身，转向 catalog、流式写入、实时同步和开放控制面。与近期湖仓/云数仓演进一致，未来焦点将是：**统一元数据 + 实时摄取 + 低延迟查询 + AI 友好接口** 的整合能力。

---

## 六、社区关注热点

- **[apache/superset](https://github.com/apache/superset)**  
  今日唯一登上 Trending 的数据项目，说明 BI 展示层依然是开源数据栈最容易获得广泛采用的入口。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询内核影响力持续扩大，越来越多新系统把它作为执行层基础设施。

- **[databendlabs/databend](https://github.com/databendlabs/databend)**  
  明确把 Analytics、Search、AI、对象存储统一到一个架构中，代表新一代“AI-ready 数仓”方向。

- **[apache/polaris](https://github.com/apache/polaris))、[apache/gravitino](https://github.com/apache/gravitino)**  
  catalog / 元数据控制面成为湖仓新焦点，值得关注其对开放生态互操作的推动。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake) 与 [apache/fluss](https://github.com/apache/fluss)**  
  实时摄取与流式存储开始成为湖仓基础能力，而不再只是附加组件。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*