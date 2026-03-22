# OLAP & 数据基础设施开源趋势日报 2026-03-22

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-22 01:22 UTC

---

# 《OLAP & 数据基础设施开源趋势日报》  
**日期：2026-03-22**

## 一、过滤结果

基于今日 Trending 榜单与“数据基础设施主题搜索”结果，按“是否与 OLAP / 数据基础设施 / 分析引擎明确相关”进行筛选：

### 1) 今日 Trending 中保留项目
今日 Trending 榜单中，**明确属于数据基础设施相关的仅 1 个**：
- [protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf) — 数据交换格式/序列化基础设施，可视为数据系统底层相关工具

其余如生财工具、系统管理、安全扫描、离线电脑、Claude 插件、Minecraft 地图生成、多模态推理框架等，**不属于本次 OLAP/数据基础设施分析范围，已排除**。

### 2) 主题搜索中保留项目
保留了与以下方向明确相关的仓库：
- OLAP/分析数据库/MPP：ClickHouse、DuckDB、Doris、StarRocks、QuestDB、Databend、Cloudberry、MatrixOne 等
- 查询引擎/执行框架：Trino、Presto、DataFusion、Ballista、chDB、go-mysql-server、QLever 等
- 存储格式/湖仓/Catalog：nimble、LakeSoul、Polaris、Gravitino、Lakekeeper、Fluss 等
- 数据集成/ETL：dlt、OLake、Rudder Server、Multiwoven、VDK 等
- 数据工具/BI/基准测试/可观测性：Superset、Metabase、Grafana、ClickBench、Elementary 等

---

## 二、分类结果

## 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [crate/crate](https://github.com/crate/crate)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)

## 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [pixelsdb/pixels](https://github.com/pixelsdb/pixels)

## ⚙️ 查询与计算
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever)
- [protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf)

## 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)

## 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [grafana/grafana](https://github.com/grafana/grafana)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [getredash/redash](https://github.com/getredash/redash)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)

---

# 三、日报正文

## 1. 今日速览

1. 今日 GitHub Trending 中，**严格意义上的 OLAP/数据基础设施项目曝光度不高**，仅 [protobuf](https://github.com/protocolbuffers/protobuf) 可归入数据底层基础设施，说明今天大众热榜更多被 AI 应用和通用工具占据。  
2. 从主题搜索看，**OLAP 主战场依然集中在 ClickHouse、DuckDB、Doris、StarRocks、Databend、Trino、DataFusion** 这批成熟项目，社区关注点继续围绕高性能分析、嵌入式分析与云原生湖仓。  
3. 湖仓方向中，**Catalog 与实时存储层持续升温**：Polaris、Gravitino、Lakekeeper、Fluss、LakeSoul 共同指向“开放元数据 + 实时分析 + Iceberg 生态整合”。  
4. 值得注意的是，**Rust 语言在查询与 OLAP 基础设施中的存在感进一步增强**，DataFusion、Databend、Lakekeeper、Ballista 等项目已形成明显技术带。  
5. 新项目层面，除成熟 OLAP 引擎外，**新型列式格式与轻量嵌入式分析路径**仍是观察重点，例如 Nimble、chDB、arc。

---

## 2. 各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)  
  ⭐ 46,440（今日新增：暂无）  
  实时分析数据库代表项目，列存与向量化执行能力成熟，仍是自建 OLAP 与日志/可观测性分析的核心参照。

- [duckdb/duckdb](https://github.com/duckdb/duckdb)  
  ⭐ 36,837（今日新增：暂无）  
  嵌入式分析数据库标杆，持续代表“本地 OLAP / 单机分析 / DataFrame 邻接 SQL”趋势，生态影响力仍在扩大。

- [apache/doris](https://github.com/apache/doris)  
  ⭐ 15,133（今日新增：暂无）  
  面向统一分析与高并发查询的 MPP 数据库，适合实时数仓、报表与明细分析，国内外社区都保持活跃。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)  
  ⭐ 11,496（今日新增：暂无）  
  强调极速查询与湖仓融合，近年来在实时分析与 Lakehouse Query 场景中关注度持续走高。

- [questdb/questdb](https://github.com/questdb/questdb)  
  ⭐ 16,783（今日新增：暂无）  
  高频时序分析数据库，在金融、IoT 和监控数据场景中具有明显定位，属于时序 OLAP 分支的重要选手。

- [databendlabs/databend](https://github.com/databendlabs/databend)  
  ⭐ 9,202（今日新增：暂无）  
  云原生分析仓库，强调对象存储上的统一架构，并把 Analytics / Search / AI 融合为一个现代数仓方向。

- [apache/cloudberry](https://github.com/apache/cloudberry)  
  ⭐ 1,192（今日新增：暂无）  
  作为 Greenplum 路线的开源延续，Cloudberry 对需要传统 MPP 数仓架构的团队仍具参考价值。

- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)  
  ⭐ 1,875（今日新增：暂无）  
  HTAP + 向量/全文检索一体化方向，体现分析数据库正在向“多模态查询平台”演进。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)  
  ⭐ 701（今日新增：暂无）  
  面向大规模列式数据的新文件格式，是今天最值得观察的“底层格式创新”项目之一。

- [apache/polaris](https://github.com/apache/polaris)  
  ⭐ 1,883（今日新增：暂无）  
  Apache Iceberg 开放 Catalog 项目，反映湖仓治理与跨引擎互操作正在成为基础设施重点。

- [apache/gravitino](https://github.com/apache/gravitino)  
  ⭐ 2,924（今日新增：暂无）  
  面向联邦元数据与地理分布式场景的开放数据目录，代表 catalog/control plane 层正在独立成核心赛道。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  ⭐ 1,224（今日新增：暂无）  
  Rust 编写的 Iceberg REST Catalog，轻量、现代、云原生，是湖仓控制面“工程化落地”的典型代表。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)  
  ⭐ 3,228（今日新增：暂无）  
  主打实时摄取、并发更新与增量分析的 Lakehouse 框架，连接 BI 与 AI 数据场景的意图明确。

- [apache/fluss](https://github.com/apache/fluss)  
  ⭐ 1,828（今日新增：暂无）  
  面向实时分析的流式存储项目，说明“流处理 + 湖仓存储”边界正进一步融合。

- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)  
  ⭐ 2,143（今日新增：暂无）  
  大规模数据平台型项目，涵盖存储、计算与调度能力，适合作为一体化大数据基础设施观察样本。

---

## ⚙️ 查询与计算

- [apache/datafusion](https://github.com/apache/datafusion)  
  ⭐ 8,518（今日新增：暂无）  
  Rust SQL 查询引擎核心项目，已成为新一代 Arrow 原生分析执行层的重要基础组件。

- [trinodb/trino](https://github.com/trinodb/trino)  
  ⭐ 12,656（今日新增：暂无）  
  分布式 SQL 查询引擎代表，仍是跨数据源联邦分析与湖仓查询的重要入口。

- [prestodb/presto](https://github.com/prestodb/presto)  
  ⭐ 16,665（今日新增：暂无）  
  Presto 路线依然维持稳定社区体量，说明传统分布式 SQL 引擎在企业数据平台中仍有深厚根基。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)  
  ⭐ 1,994（今日新增：暂无）  
  DataFusion 的分布式执行延伸，代表 Rust 查询引擎正在向更完整的集群化执行层推进。

- [chdb-io/chdb](https://github.com/chdb-io/chdb)  
  ⭐ 2,642（今日新增：暂无）  
  以 ClickHouse 为内核的嵌入式 OLAP SQL 引擎，适合 Python 场景，体现“把分析能力嵌入应用”的趋势。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)  
  ⭐ 2,617（今日新增：暂无）  
  存储无关的 MySQL 兼容查询引擎，适合作为数据库内核与 SQL 执行层研究样本。

- [ad-freiburg/qlever](https://github.com/ad-freiburg/qlever)  
  ⭐ 799（今日新增：暂无）  
  面向 RDF/SPARQL 的高性能查询引擎，提示图查询与大规模语义数据处理仍有专业化需求。

- [protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf)  
  ⭐ 0（+7 today）  
  Google 的数据交换格式基础设施，今日进入 Trending，说明底层数据序列化组件仍具广泛生态影响力。

---

## 🔗 数据集成与 ETL

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)  
  ⭐ 5,085（今日新增：暂无）  
  Python 数据加载工具，强调工程可用性与易接入性，是轻量现代 ETL 方向的重要项目。

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  ⭐ 1,311（今日新增：暂无）  
  面向数据库、Kafka、S3 到 Iceberg/Parquet 的高性能复制工具，直接贴近实时湖仓写入需求。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)  
  ⭐ 4,376（今日新增：暂无）  
  Segment 替代方案，偏事件数据采集与分发，是产品数据进入仓库的重要入口层。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)  
  ⭐ 1,643（今日新增：暂无）  
  开源 Reverse ETL，代表“仓到业务系统”的数据回流已成为现代数据栈刚需。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)  
  ⭐ 477（今日新增：暂无）  
  面向 Python/SQL 工作流开发、部署和运维的一体化框架，适合中小团队构建标准数据流水线。

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)  
  ⭐ 3,711（今日新增：暂无）  
  基于 Flink 的实时数据开发平台，表明流式 ETL 与实时数仓工程平台仍保持较高需求。

---

## 🧰 数据工具

- [apache/superset](https://github.com/apache/superset)  
  ⭐ 71,047（今日新增：暂无）  
  开源 BI 与数据探索平台头部项目，仍是连接数据库与业务分析用户的标准界面层。

- [metabase/metabase](https://github.com/metabase/metabase)  
  ⭐ 46,501（今日新增：暂无）  
  低门槛 BI 工具代表，适合快速构建组织级自助分析，社区长期稳定。

- [grafana/grafana](https://github.com/grafana/grafana)  
  ⭐ 72,781（今日新增：暂无）  
  虽以可观测性见长，但已成为分析型数据可视化与多源查询集成的重要平台型工具。

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)  
  ⭐ 973（今日新增：暂无）  
  分析数据库基准测试项目，在引擎选型、性能宣传与湖仓方案对比中影响力持续上升。

- [elementary-data/elementary](https://github.com/elementary-data/elementary)  
  ⭐ 2,281（今日新增：暂无）  
  dbt-native 数据可观测性工具，说明现代数据栈正把“数据质量与监控”前置为默认能力。

- [getredash/redash](https://github.com/getredash/redash)  
  ⭐ 28,295（今日新增：暂无）  
  老牌 SQL 分析与可视化平台，虽不如 Superset 活跃，但仍具稳定用户基础。

- [langfuse/langfuse](https://github.com/langfuse/langfuse)  
  ⭐ 23,519（今日新增：暂无）  
  虽偏 LLM Observability，但其数据采集、指标与分析能力正与现代分析平台发生交叉，值得数据团队关注。

---

## 3. 趋势信号分析

今天 GitHub 大盘热榜对纯 OLAP 项目并不友好，但从主题活跃项目看，**社区注意力仍明显向“云原生分析引擎 + 湖仓控制面 + 嵌入式查询”聚集**。一方面，ClickHouse、DuckDB、Doris、StarRocks、Databend 等成熟引擎持续占据高星核心位置，说明高性能 SQL 分析依然是数据基础设施主线；另一方面，Polaris、Gravitino、Lakekeeper、Fluss 这类项目的持续活跃，说明湖仓竞争已从“表格式”本身转向 **Catalog、元数据治理、实时写入与开放互操作**。新兴方向上，Nimble 代表的列式文件格式创新值得关注，而 chDB、DataFusion 则反映出**分析能力嵌入应用与 Arrow/Rust 原生执行层崛起**。这与近期湖仓/云数仓发展高度一致：底座对象存储化，计算层解耦，控制面标准化，查询层则朝轻量化、可嵌入和多引擎协同演进。

---

## 4. 社区关注热点

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新列式文件格式项目，适合作为 Parquet 之后“下一代分析存储格式”观察样本。

- **[apache/polaris](https://github.com/apache/polaris)** / **[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg Catalog 生态加速成形，数据平台团队应重点关注开放元数据控制面的标准化机会。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust + Arrow 查询执行路线越来越像新一代分析内核底座，值得引擎开发者持续跟进。

- **[chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  “嵌入式 OLAP”正在成为 Python 数据应用的新范式，特别适合本地分析、轻服务化和 AI Agent 数据访问。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)** / **[apache/fluss](https://github.com/apache/fluss)**  
  实时摄取到 Iceberg/Parquet、以及实时分析存储，说明湖仓正在从离线批处理走向实时数据底座。

如果你愿意，我还可以继续把这份日报补成一个**更像投资/技术雷达风格的版本**，增加：
1. **“成熟项目 / 增长项目 / 早期观察项目”三级分层**  
2. **Rust / Java / C++ 技术栈分布分析**  
3. **与 ClickHouse、DuckDB、Iceberg 生态的竞争格局图谱**

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*