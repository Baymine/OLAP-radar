# OLAP & 数据基础设施开源趋势日报 2026-03-23

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-23 01:23 UTC

---

# 《OLAP & 数据基础设施开源趋势日报》  
日期：2026-03-23

---

## 一、过滤结果

基于给定的 **Trending 榜单** 与 **主题搜索结果**，先做 OLAP / 数据基础设施相关性筛选：

### 1) 今日 Trending 榜单中，明确保留的数据相关项目
仅筛出与分析数据库、检索增强、数据安全扫描等“数据基础设施/分析链路”有明显关联的项目：

- [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG) — RAG 检索框架，属于数据检索/查询增强相关
- [aquasecurity/trivy](https://github.com/aquasecurity/trivy) — 安全扫描与 SBOM，偏数据治理/基础设施工具链

> 说明：其余如 agent、视频生成、渗透测试、离线 AI 电脑、Claude 插件、游戏地图生成等，不属于 OLAP / 数据基础设施核心范畴，已略去。

### 2) 主题搜索结果中，明确保留的数据基础设施项目
保留与以下方向直接相关的项目：
- OLAP/MPP/分析数据库
- Lakehouse / Catalog / Columnar 格式
- Query Engine / SQL Engine / 向量化执行
- ETL / 数据装载 / CDC / Reverse ETL
- 基准测试、BI、数据可观测性、分析平台

---

## 二、分类结果

> 一个项目可能跨多个维度，以下按“最主要类别”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [questdb/questdb](https://github.com/questdb/questdb)
- [timescale/timescaledb](https://github.com/timescale/timescaledb)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [crate/crate](https://github.com/crate/crate)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- [pixelsdb/pixels](https://github.com/pixelsdb/pixels)

### 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [roapi/roapi](https://github.com/roapi/roapi)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)

### ⚙️ 查询与计算
- [prestodb/presto](https://github.com/prestodb/presto)
- [trinodb/trino](https://github.com/trinodb/trino)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [qlever](https://github.com/ad-freiburg/qlever)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [RumbleDB/rumble](https://github.com/RumbleDB/rumble)
- [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG)

### 🔗 数据集成与 ETL
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [getredash/redash](https://github.com/getredash/redash)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [grafana/grafana](https://github.com/grafana/grafana)
- [aquasecurity/trivy](https://github.com/aquasecurity/trivy)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)

---

## 三、今日速览

今天 GitHub 热榜里，**纯 OLAP 内核项目没有直接冲上 Trending 前列**，但主题搜索显示，社区关注仍高度集中在 **实时分析数据库、湖仓 Catalog、嵌入式分析引擎** 三条主线。  
其中，**ClickHouse / Doris / StarRocks / DuckDB** 依然构成 OLAP 主流基本盘，说明“高性能 SQL 分析引擎”仍是开源数据基础设施最稳固的核心赛道。  
同时，**Apache Polaris、Gravitino、Lakekeeper** 这类 Catalog/元数据层项目持续活跃，反映出湖仓竞争已经从“存储格式”转向“开放元数据与跨引擎互操作”。  
另一个值得注意的信号是，**LightRAG** 出现在今日 Trending，说明“检索/查询融合”正在向数据基础设施边界渗透，SQL 之外的检索式访问范式热度继续抬升。  
此外，**Trivy** 上榜虽非 OLAP 核心项目，但侧面说明数据平台的 SBOM、供应链治理和运行安全，正成为工程团队采购与落地时的硬约束。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

### 1) [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- Stars：46,463（今日新增：—）
- 实时分析数据库代表项目，仍是日志分析、可观测性与实时数仓场景的事实标准之一，湖仓与嵌入式使用边界都在继续扩张。

### 2) [apache/doris](https://github.com/apache/doris)
- Stars：15,136（今日新增：—）
- 统一分析数据库，兼顾实时写入与交互式查询，在“简化数仓架构”方向上持续获得社区认可。

### 3) [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- Stars：11,499（今日新增：—）
- 面向亚秒级分析与湖上查询优化的高性能引擎，是当前湖仓查询加速路线中的强势玩家。

### 4) [duckdb/duckdb](https://github.com/duckdb/duckdb)
- Stars：36,847（今日新增：—）
- 嵌入式分析数据库代表，持续受开发者、数据科学与本地分析场景欢迎，是“单机 OLAP”最强生态中心之一。

### 5) [questdb/questdb](https://github.com/questdb/questdb)
- Stars：16,784（今日新增：—）
- 高性能时序 OLAP 数据库，在金融行情、IoT、监控分析等实时场景中具备很强吸引力。

### 6) [timescale/timescaledb](https://github.com/timescale/timescaledb)
- Stars：22,178（今日新增：—）
- 基于 Postgres 扩展的时序分析数据库，适合希望兼顾 PostgreSQL 生态与实时分析能力的团队。

### 7) [apache/cloudberry](https://github.com/apache/cloudberry)
- Stars：1,193（今日新增：—）
- 开源 MPP 数据仓库路线的新关注点，承接 Greenplum 类架构经验，适合关注传统大规模数仓体系的团队。

---

## 📦 存储格式与湖仓

### 1) [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- Stars：701（今日新增：—）
- 面向大规模列式数据的新文件格式，代表社区仍在探索 Parquet 之外的下一代列式存储形态。

### 2) [databendlabs/databend](https://github.com/databendlabs/databend)
- Stars：9,202（今日新增：—）
- 基于对象存储统一分析架构的云原生仓库，强调 Analytics / Search / AI 一体化，符合新一代数据平台融合趋势。

### 3) [apache/gravitino](https://github.com/apache/gravitino)
- Stars：2,924（今日新增：—）
- 联邦元数据湖项目，价值在于打通多地域、多引擎、多湖仓系统的元数据治理。

### 4) [apache/polaris](https://github.com/apache/polaris)
- Stars：1,884（今日新增：—）
- Apache Iceberg 生态的重要 Catalog 项目，今天值得关注的原因是开放 Catalog 正成为湖仓标准化竞争核心。

### 5) [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- Stars：1,224（今日新增：—）
- Rust 实现的 Iceberg REST Catalog，突出安全、轻量与高性能，是 Catalog 基础设施层的新兴代表。

### 6) [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- Stars：3,228（今日新增：—）
- 主打实时摄入、并发更新与增量分析的湖仓框架，更贴近实时 BI 与 AI 数据供给场景。

### 7) [apache/fluss](https://github.com/apache/fluss)
- Stars：1,828（今日新增：—）
- 面向实时分析的流式存储系统，体现流处理与分析存储边界进一步融合。

---

## ⚙️ 查询与计算

### 1) [trinodb/trino](https://github.com/trinodb/trino)
- Stars：12,656（今日新增：—）
- 分布式 SQL 查询引擎代表，在多数据源联邦查询和湖仓访问上依然是关键基础设施。

### 2) [prestodb/presto](https://github.com/prestodb/presto)
- Stars：16,664（今日新增：—）
- 经典大数据查询引擎，仍是企业联邦分析体系的重要技术参考坐标。

### 3) [apache/datafusion](https://github.com/apache/datafusion)
- Stars：8,520（今日新增：—）
- Rust SQL 查询引擎，正成为 Arrow 原生查询栈的重要核心，适合嵌入式与自定义分析平台建设。

### 4) [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- Stars：1,994（今日新增：—）
- DataFusion 的分布式执行延展，代表 Rust 查询引擎正向更大规模执行场景演进。

### 5) [chdb-io/chdb](https://github.com/chdb-io/chdb)
- Stars：2,644（今日新增：—）
- ClickHouse 驱动的进程内 OLAP SQL 引擎，顺应“嵌入式分析 + 本地数据处理”的增长趋势。

### 6) [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- Stars：2,617（今日新增：—）
- 存储无关的 MySQL 兼容查询引擎，适合作为数据产品、网关或轻量数据库内核能力复用。

### 7) [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG)
- Stars：0（今日新增：+220）
- 虽非传统 OLAP 项目，但它体现了“查询不再局限于 SQL”，检索增强框架正在进入数据访问层讨论范围。

---

## 🔗 数据集成与 ETL

### 1) [datazip-inc/olake](https://github.com/datazip-inc/olake)
- Stars：1,311（今日新增：—）
- 面向 Iceberg / Parquet 的数据库、Kafka、S3 复制工具，直接服务实时分析与湖仓数据摄入。

### 2) [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- Stars：5,092（今日新增：—）
- Python 数据装载工具，降低从应用数据到分析仓库的落地门槛，是现代 ELT 工具链的重要一环。

### 3) [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- Stars：4,376（今日新增：—）
- Segment 替代方案，承担事件采集、路由与下游仓库投递，是产品分析数据链路的核心组件。

### 4) [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- Stars：1,643（今日新增：—）
- 开源 Reverse ETL 方案，说明仓库到业务系统的反向数据激活仍是热门需求。

### 5) [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- Stars：3,711（今日新增：—）
- 基于 Flink 的实时数据开发平台，关注流式作业开发与运维效率，契合实时数仓工程化趋势。

### 6) [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)
- Stars：161（今日新增：—）
- 配置化 ETL 工具，虽体量不大，但代表低代码/可配置数据集成仍有稳定需求。

---

## 🧰 数据工具

### 1) [apache/superset](https://github.com/apache/superset)
- Stars：71,056（今日新增：—）
- 头部开源 BI 平台，持续扮演分析数据库生态“最后一公里”入口。

### 2) [metabase/metabase](https://github.com/metabase/metabase)
- Stars：46,509（今日新增：—）
- 低门槛自助分析工具，适合中小团队快速建设可视化分析能力。

### 3) [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- Stars：973（今日新增：—）
- 分析数据库基准测试项目，在 OLAP 选型竞争加剧背景下，其参考价值持续提升。

### 4) [elementary-data/elementary](https://github.com/elementary-data/elementary)
- Stars：2,281（今日新增：—）
- dbt-native 数据可观测性工具，反映数据质量与可观测性已成为现代数仓标配。

### 5) [grafana/grafana](https://github.com/grafana/grafana)
- Stars：72,800（今日新增：—）
- 虽以 observability 为主，但在多数据源分析、SQL 可视化与时序 OLAP 展示层仍有强影响力。

### 6) [aquasecurity/trivy](https://github.com/aquasecurity/trivy)
- Stars：0（今日新增：+251）
- 数据平台虽不是其唯一场景，但今日上榜反映基础设施安全、SBOM 与镜像治理已成为数据工程团队必须纳入的平台能力。

### 7) [langfuse/langfuse](https://github.com/langfuse/langfuse)
- Stars：23,568（今日新增：—）
- LLM 可观测平台与数据评测结合紧密，正在成为 AI 数据分析/Agent 数据链路的新型工具层。

---

## 五、趋势信号分析

今日热榜对 OLAP 领域的直接拉动不强，但从筛选结果看，**社区关注正从“单一数据库内核”转向“完整数据访问栈”**。一类明显升温的工具是 **嵌入式/轻量分析引擎与查询增强组件**，如 chDB、DataFusion、LightRAG 所代表的方向：前者降低分析能力嵌入应用的门槛，后者把检索式访问、非结构化索引与传统查询引擎连接起来。另一方面，**湖仓元数据层**仍是本阶段最清晰的基础设施热点，Polaris、Gravitino、Lakekeeper 等项目说明竞争焦点已从“谁支持 Iceberg/Parquet”升级为“谁能提供开放、可治理、可联邦的 Catalog 能力”。这与近期云数仓/湖仓发展高度一致：存储与计算分离已成共识，下一阶段拼的是跨引擎互操作、实时摄入、治理安全，以及面向 AI/搜索工作负载的统一数据平面。

---

## 六、社区关注热点

- **[Apache Polaris](https://github.com/apache/polaris)**  
  Iceberg Catalog 标准化价值持续上升，值得关注其是否会成为跨引擎互操作的关键中枢。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态越来越成熟，适合关注其在自定义 SQL 服务、嵌入式分析与 Arrow 原生栈中的扩张。

- **[chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  “进程内 OLAP”正在成为新产品形态，特别适合 AI 应用、本地分析工具和开发者数据产品嵌入。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)**  
  实时复制到 Iceberg/Parquet 的需求很强，说明湖仓摄入链路正从批处理转向低延迟增量同步。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新列式文件格式值得持续观察，若性能、编码效率或云对象存储适配性显著领先，可能影响未来湖仓底层格式演化。

--- 

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合公众号/邮件发送的简版**，或  
2. **面向投资/选型的“项目雷达图 + 赛道判断版”**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*