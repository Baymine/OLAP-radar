# OLAP & 数据基础设施开源趋势日报 2026-03-13

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-13 01:55 UTC

---

# OLAP & 数据基础设施开源趋势日报  
**日期：2026-03-13**

---

## 一、过滤结果

基于给定数据，**今日 Trending 榜单中明确属于 OLAP/数据基础设施/分析引擎相关的项目仅 1 个**：

- [langflow-ai/openrag](https://github.com/langflow-ai/openrag) — 虽偏 RAG 平台，但其底层依赖 Opensearch，属于“数据检索/分析基础设施”边缘相关项目，可纳入观察。

其余 Trending 项目主要集中在 AI Agent、推理框架、TTS、插件生态等方向，**不属于 OLAP / 数据基础设施核心范畴，已排除**。

主题搜索结果中，与 OLAP、查询引擎、湖仓、数据集成、分析工具明确相关的项目较多，构成今天报告的主体样本。

---

## 二、分类总览

> 注：一个项目可跨类归档，以下按“最主要定位”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [apache/cloudberry](https://github.com/apache/cloudberry)

### 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/fluss](https://github.com/apache/fluss)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [relytcloud/pg_ducklake](https://github.com/relytcloud/pg_ducklake)

### ⚙️ 查询与计算
- [apache/datafusion](https://github.com/apache/datafusion)
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)

### 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [getredash/redash](https://github.com/getredash/redash)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [langflow-ai/openrag](https://github.com/langflow-ai/openrag)

---

## 1. 今日速览

1. **今天真正进入 GitHub 实时热榜的数据基础设施项目非常少**，说明短期社区注意力明显被 Agent / AI 应用层吸走，传统 OLAP 栈在 Trending 上暂时降温。  
2. 唯一进入今日 Trending 的相关项目是 [openrag](https://github.com/langflow-ai/openrag)，它虽不是纯 OLAP，但反映出**“检索 + 搜索引擎 + 数据平台封装”**正在成为新的数据基础设施入口。  
3. 从主题搜索看，社区关注仍稳固集中在 **ClickHouse、DuckDB、Doris、StarRocks、DataFusion、Trino、Iceberg Catalog** 等成熟基础设施项目。  
4. 新信号主要来自两端：一端是 **轻量嵌入式/进程内分析引擎**（DuckDB、chDB、DuckDB-Wasm），另一端是 **湖仓元数据与实时存储层**（Polaris、Lakekeeper、Fluss、Gravitino）。  
5. 整体判断：**“AI 驱动的数据访问层”正在抬头，但底层仍由列式引擎、查询内核与湖仓目录体系持续主导。**

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)  
  ⭐ 46,305  
  实时分析数据库代表项目，仍是开源 OLAP 的流量与基准中心，生态外溢能力最强。

- [duckdb/duckdb](https://github.com/duckdb/duckdb)  
  ⭐ 36,613  
  进程内分析数据库标杆，持续推动“本地分析 / 嵌入式 OLAP / 单机高性能 SQL”成为主流范式。

- [questdb/questdb](https://github.com/questdb/questdb)  
  ⭐ 16,752  
  面向时序分析的高性能数据库，适合实时指标、IoT 与金融行情场景，体现 OLAP 与时序融合趋势。

- [apache/doris](https://github.com/apache/doris)  
  ⭐ 15,102  
  统一分析数据库，兼顾实时与离线查询，是国产开源分析型数据库的重要代表。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)  
  ⭐ 11,471  
  聚焦亚秒级分析与湖仓查询加速，代表“MPP OLAP 引擎直接面向 Lakehouse”的路线。

- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)  
  ⭐ 10,012  
  正在强化 HTAP 与 AI workload 叙事，说明传统分布式数据库正向分析与混合负载演进。

- [databendlabs/databend](https://github.com/databendlabs/databend)  
  ⭐ 9,195  
  以对象存储为中心重构的数据仓库，今天值得关注在于其明显强化了 Analytics + Search + AI 的统一定位。

- [apache/cloudberry](https://github.com/apache/cloudberry)  
  ⭐ 1,191  
  Greenplum 系 MPP 路线的开源延续，适合关注传统数据仓库架构在云原生时代的重构。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)  
  ⭐ 696  
  面向大规模列式数据的新文件格式，是今天最值得关注的“新存储格式”信号之一。

- [apache/polaris](https://github.com/apache/polaris)  
  ⭐ 1,871  
  Apache Iceberg 的开放目录服务，代表湖仓生态正从表格式竞争走向元数据控制面竞争。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  ⭐ 1,220  
  Rust 实现的 Iceberg REST Catalog，说明湖仓目录服务正在走向更轻量、可替换、云原生部署。

- [apache/gravitino](https://github.com/apache/gravitino)  
  ⭐ 2,904  
  面向多地域、联邦化元数据治理的开放数据目录，贴合多引擎共享元数据的现实需求。

- [apache/fluss](https://github.com/apache/fluss)  
  ⭐ 1,814  
  面向实时分析的流式存储，值得关注在于其尝试补足湖仓体系中“低延迟写入层”的短板。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)  
  ⭐ 2,134  
  大数据平台型项目，兼具存储与计算能力，反映一体化数据平台仍有社区空间。

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  ⭐ 1,306  
  将数据库、Kafka、S3 快速复制到 Iceberg/Parquet，直连湖仓落地，是 ingestion-to-lake 的实用派项目。

- [relytcloud/pg_ducklake](https://github.com/relytcloud/pg_ducklake)  
  ⭐ 53  
  通过 Postgres + DuckDB/Ducklake 提供原生 lakehouse 体验，属于值得持续跟踪的新组合方向。

---

## ⚙️ 查询与计算

- [apache/datafusion](https://github.com/apache/datafusion)  
  ⭐ 8,495  
  Rust SQL 查询引擎代表，已经成为新一代分析系统、数据库内核与定制执行层的重要基础件。

- [trinodb/trino](https://github.com/trinodb/trino)  
  ⭐ 12,634  
  分布式 SQL 查询引擎头部项目，今天仍是湖仓多源联邦查询的核心基础设施。

- [prestodb/presto](https://github.com/prestodb/presto)  
  ⭐ 16,668  
  Presto 路线仍保持强势存在，显示大数据查询引擎的双生态格局尚未结束。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)  
  ⭐ 1,990  
  DataFusion 的分布式执行扩展，体现社区正在把轻量查询内核向分布式化延伸。

- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)  
  ⭐ 1,937  
  将 OLAP 能力带到浏览器端，代表“客户端分析执行”逐渐从实验走向实用。

- [chdb-io/chdb](https://github.com/chdb-io/chdb)  
  ⭐ 2,633  
  基于 ClickHouse 的 in-process OLAP 引擎，说明“嵌入式分析”已不再只是 DuckDB 一家的故事。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)  
  ⭐ 2,617  
  存储无关的 MySQL-compatible 查询引擎，适合关注 SQL 执行层模块化的工程价值。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)  
  ⭐ 193  
  Firebolt 开源自托管查询引擎核心版，说明云数仓厂商也在尝试开放部分底层能力。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)  
  ⭐ 5,036  
  Python 数据加载工具，面向现代 ELT 工作流，降低从应用到仓库的数据接入门槛。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)  
  ⭐ 4,372  
  Segment 替代方案，聚焦事件采集与分发，是现代数据栈中 CDP/埋点管道的重要基础设施。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)  
  ⭐ 1,644  
  开源 Reverse ETL 方案，反映数据仓库到业务系统的“反向同步”需求正在常态化。

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  ⭐ 1,306  
  面向 Iceberg/Parquet 的高性能复制工具，连接 OLTP、消息流与湖仓，是今天很实用的 ingestion 项目。

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)  
  ⭐ 3,706  
  基于 Flink 的实时数据开发平台，体现流处理开发体验平台化的成熟趋势。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)  
  ⭐ 161  
  配置驱动的 ETL 工具，虽体量不大，但代表传统 ETL 仍有稳定细分需求。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset)  
  ⭐ 70,943  
  开源 BI 与数据探索平台龙头，依然是面向 SQL 仓库的主流可视化入口。

- [metabase/metabase](https://github.com/metabase/metabase)  
  ⭐ 46,383  
  低门槛 BI 工具，持续吸引中小团队，是“自助分析”最稳健的开源选择之一。

- [grafana/grafana](https://github.com/grafana/grafana)  
  ⭐ 72,670  
  虽主打可观测性，但其多数据源分析能力使其成为数据平台常用展示与监控层。

- [getredash/redash](https://github.com/getredash/redash)  
  ⭐ 28,276  
  老牌 SQL 查询与可视化工具，仍有大量存量用户，适合关注轻量 BI 的长期生命力。

- [elementary-data/elementary](https://github.com/elementary-data/elementary)  
  ⭐ 2,272  
  dbt-native 数据可观测性方案，反映“数据质量与可观测性”已从附加项变成标配。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)  
  ⭐ 968  
  分析数据库基准测试项目，是比较 ClickHouse、DuckDB、StarRocks、Firebolt 等性能的重要公共标尺。

- [langfuse/langfuse](https://github.com/langfuse/langfuse)  
  ⭐ 23,082  
  LLM observability 平台，虽偏 AI 工程，但本质上正演化为新的分析/追踪数据基础设施。

- [langflow-ai/openrag](https://github.com/langflow-ai/openrag)  
  ⭐ 0（+322 today）  
  基于 Langflow、Docling 与 Opensearch 的 RAG 平台，是今天唯一进入 Trending 的数据基础设施边缘项目，反映“检索基础设施产品化”正在升温。

---

## 3. 趋势信号分析

今天 GitHub 实时热榜里，**纯 OLAP 项目几乎没有直接爆发**，这说明短期社区注意力更多被 Agent 与 AI 应用层吸走；但从唯一相关上榜项目 [openrag](https://github.com/langflow-ai/openrag) 看，**搜索/检索基础设施的产品化封装**正在获得新增关注。它并非传统数仓，却代表数据基础设施正在向“可被 AI 直接消费”的访问层迁移。

从主题活跃项目看，主线依然清晰：底层由 **ClickHouse、DuckDB、Doris、StarRocks、DataFusion、Trino** 等查询与分析内核主导；中间层则由 **Polaris、Lakekeeper、Gravitino、Fluss** 等湖仓元数据与实时存储组件承接。值得注意的是，**facebookincubator/nimble** 这类新列式文件格式项目开始出现，显示社区仍在寻找 Parquet 之外更适配特定分析场景的存储优化路线。

这与近期湖仓/云数仓发展高度一致：上层在拥抱 AI 查询入口，下层在继续强化 **对象存储原生、开放 catalog、嵌入式执行与实时写入** 四个方向。

---

## 4. 社区关注热点

- **[langflow-ai/openrag](https://github.com/langflow-ai/openrag)**  
  今日唯一进入 Trending 的相关项目，说明“RAG 平台 + 搜索引擎”正在成为数据基础设施的新入口。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新列式文件格式值得重点跟踪；如果生态继续扩展，可能成为湖仓底层存储的新实验方向。

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg Catalog 生态明显升温，目录层正在从“配套组件”升级为“湖仓控制面”。

- **[duckdb/duckdb](https://github.com/duckdb/duckdb) / [chdb-io/chdb](https://github.com/chdb-io/chdb) / [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)**  
  嵌入式、浏览器端、进程内 OLAP 正在形成独立赛道，适合数据应用、Notebook、边缘分析场景。

- **[apache/datafusion](https://github.com/apache/datafusion) / [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)**  
  Rust 查询内核生态继续增强，适合关注可组合 SQL 执行层如何成为下一代数据库与数据产品的基础模块。

--- 

如需，我可以继续把这份日报扩展成：  
1. **“按国内/海外项目拆分版”**，或  
2. **“与前 7 天趋势对比版”**，或  
3. **“面向投资/选型视角的重点项目雷达图版”**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*