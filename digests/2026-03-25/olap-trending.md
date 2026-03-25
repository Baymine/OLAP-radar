# OLAP & 数据基础设施开源趋势日报 2026-03-25

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-25 01:21 UTC

---

# OLAP & 数据基础设施开源趋势日报  
**日期：2026-03-25**

---

## 一、过滤结果：今日 Trending 中与 OLAP/数据基础设施明确相关的项目

对 14 个 Trending 仓库进行筛选后，**仅 1 个可明确归入数据基础设施/分析引擎相关领域**：

- [aquasecurity/trivy](https://github.com/aquasecurity/trivy) — 偏数据工具/扫描分析基础设施，虽不属于 OLAP 核心，但属于数据工程与平台侧常用基础设施工具  
  ⭐0（**+104 today**）

其余 Trending 项目主要为 AI Agent、视频生成、金融 Agent、离线设备、WiFi 感知等，**不属于 OLAP/湖仓/查询引擎/数据基础设施核心范畴，已排除**。

> 说明：由于今日 Trending 榜单与 OLAP/数据基础设施高度相关的项目较少，本日报的主体趋势判断将更多结合“主题搜索结果（7天活跃项目）”进行分析。

---

## 二、分类结果

以下按“优先归入最主要类别”分类；部分项目具备跨类属性，但仅在最核心类别中重点呈现。

---

### 🗄️ OLAP 引擎
代表项目：
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [questdb/questdb](https://github.com/questdb/questdb)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [crate/crate](https://github.com/crate/crate)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)

### 📦 存储格式与湖仓
代表项目：
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/fluss](https://github.com/apache/fluss)
- [databendlabs/databend](https://github.com/databendlabs/databend)

### ⚙️ 查询与计算
代表项目：
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- [roapi/roapi](https://github.com/roapi/roapi)

### 🔗 数据集成与 ETL
代表项目：
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

### 🧰 数据工具
代表项目：
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [cube-js/cube](https://github.com/cube-js/cube)
- [cloudera/hue](https://github.com/cloudera/hue)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [aquasecurity/trivy](https://github.com/aquasecurity/trivy)

---

## 三、今日速览

1. **今日 GitHub Trending 对 OLAP 核心项目覆盖很弱**，实时热度明显被 AI Agent 类项目占据，数据基础设施项目中仅 [Trivy](https://github.com/aquasecurity/trivy) 进入榜单。  
2. 从主题搜索的 7 天活跃数据看，**湖仓目录层、流式存储、Rust 查询引擎、嵌入式 OLAP** 仍是当前开源数据基础设施最活跃的几条主线。  
3. **ClickHouse、Doris、StarRocks、DuckDB、Trino、DataFusion** 继续构成分析引擎主力阵营，分别覆盖实时分析、湖仓查询、嵌入式分析与可组合计算层。  
4. 湖仓侧的关注点正在从“表格式本身”转向**Catalog/元数据治理与流批一体存储**，如 [Apache Polaris](https://github.com/apache/polaris)、[Lakekeeper](https://github.com/lakekeeper/lakekeeper)、[Apache Fluss](https://github.com/apache/fluss)。  
5. 数据集成领域则更强调**面向 Iceberg/Parquet 的低延迟写入**，如 [OLake](https://github.com/datazip-inc/olake) 与 [dlt](https://github.com/dlt-hub/dlt)。

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)  
  ⭐46,513；今日新增：暂无  
  实时分析数据库代表项目，列式存储和高并发聚合能力仍是 OLAP 领域的事实标准之一，湖仓查询与可嵌入场景持续扩展。

- [apache/doris](https://github.com/apache/doris)  
  ⭐15,147；今日新增：暂无  
  统一分析数据库，兼顾高性能查询与易用性，在实时数仓、日志分析和湖仓加速场景保持高关注度。

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)  
  ⭐11,510；今日新增：暂无  
  强调亚秒级分析与 Lakehouse 查询性能，持续代表“云原生 MPP + 湖仓加速”方向。

- [duckdb/duckdb](https://github.com/duckdb/duckdb)  
  ⭐36,931；今日新增：暂无  
  嵌入式分析数据库标杆，持续推动本地分析、开发者数据工作流和轻量 OLAP 普及。

- [questdb/questdb](https://github.com/questdb/questdb)  
  ⭐16,788；今日新增：暂无  
  面向时序 OLAP 的高性能数据库，适合监控、IoT、行情等实时分析场景，时序数据库与 OLAP 融合趋势明显。

- [apache/cloudberry](https://github.com/apache/cloudberry)  
  ⭐1,194；今日新增：暂无  
  Greenplum 替代方向的开源 MPP 数据仓库，适合传统企业级分析型数据库用户关注。

- [chdb-io/chdb](https://github.com/chdb-io/chdb)  
  ⭐2,644；今日新增：暂无  
  基于 ClickHouse 的进程内 OLAP SQL 引擎，契合“嵌入式分析 + Python 生态”趋势。

---

## 📦 存储格式与湖仓

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)  
  ⭐702；今日新增：暂无  
  面向大型列式数据集的新文件格式，属于值得持续跟踪的潜在新兴列式存储方向。

- [apache/polaris](https://github.com/apache/polaris)  
  ⭐1,885；今日新增：暂无  
  Apache Iceberg 开放 Catalog 方向的重要项目，说明湖仓竞争正逐步深入到目录与元数据控制面。

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  ⭐1,224；今日新增：暂无  
  Rust 实现的 Iceberg REST Catalog，强调安全、性能与易部署，是目录服务轻量化趋势的代表。

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)  
  ⭐3,226；今日新增：暂无  
  强调实时写入、并发更新和增量分析的湖仓框架，契合实时 BI 与 AI 数据底座需求。

- [apache/gravitino](https://github.com/apache/gravitino)  
  ⭐2,926；今日新增：暂无  
  联邦元数据湖方向项目，表明跨地域、跨引擎、跨存储治理正在成为湖仓下一阶段重点。

- [apache/fluss](https://github.com/apache/fluss)  
  ⭐1,831；今日新增：暂无  
  面向实时分析的流式存储项目，体现流存一体和近实时湖仓底座的活跃演进。

- [databendlabs/databend](https://github.com/databendlabs/databend)  
  ⭐9,204；今日新增：暂无  
  基于对象存储的统一 Warehouse 架构，横跨湖仓、分析、搜索与 AI sandbox，边界正在变宽。

---

## ⚙️ 查询与计算

- [trinodb/trino](https://github.com/trinodb/trino)  
  ⭐12,657；今日新增：暂无  
  分布式 SQL 查询引擎代表，持续承担异构数据源联邦查询与湖仓计算层角色。

- [prestodb/presto](https://github.com/prestodb/presto)  
  ⭐16,663；今日新增：暂无  
  经典大数据 SQL 查询引擎，仍在超大规模分析场景拥有稳定社区基础。

- [apache/datafusion](https://github.com/apache/datafusion)  
  ⭐8,532；今日新增：暂无  
  Rust 查询引擎核心项目，Arrow 原生、可组合、可嵌入，是新一代数据计算底座的关键代表。

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)  
  ⭐1,998；今日新增：暂无  
  DataFusion 的分布式执行延展，显示 Rust 查询栈正从库级引擎向分布式计算演进。

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)  
  ⭐2,618；今日新增：暂无  
  存储无关的 MySQL 兼容查询引擎，适合关注“查询层解耦存储层”的工程模式。

- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)  
  ⭐195；今日新增：暂无  
  高性能数仓查询引擎的自托管核心版，值得关注商业云数仓技术向开源能力外溢的信号。

- [roapi/roapi](https://github.com/roapi/roapi)  
  ⭐3,416；今日新增：暂无  
  面向静态/缓变数据集自动生成 API，建立在列式数据访问之上，体现“数据即服务”的轻量查询层趋势。

---

## 🔗 数据集成与 ETL

- [datazip-inc/olake](https://github.com/datazip-inc/olake)  
  ⭐1,312；今日新增：暂无  
  聚焦数据库、Kafka、S3 到 Iceberg/Parquet 的高速复制，直接服务实时分析与湖仓落地。

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)  
  ⭐5,106；今日新增：暂无  
  Python 数据加载工具代表，开发者体验好，适合现代 ELT/数据产品团队快速构建管道。

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)  
  ⭐4,377；今日新增：暂无  
  Segment 替代方案，兼具事件采集与下游同步能力，是现代数据栈中的入口层项目。

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)  
  ⭐1,644；今日新增：暂无  
  开源 Reverse ETL，说明“仓到业务系统”的数据回流链路仍是数据平台建设重点。

- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)  
  ⭐478；今日新增：暂无  
  统一开发、部署和运行 Python/SQL 数据工作流，适合偏平台化的数据工程体系。

- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)  
  ⭐161；今日新增：暂无  
  经典 ETL 配置化工具，虽不属新热点，但对传统企业数据管道场景仍有参考价值。

---

## 🧰 数据工具

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)  
  ⭐973；今日新增：暂无  
  分析数据库基准测试项目，是评估 OLAP/湖仓引擎性能与查询模式差异的重要参考。

- [apache/superset](https://github.com/apache/superset)  
  ⭐71,092；今日新增：暂无  
  开源 BI 与数据探索平台，仍是连接数据基础设施与业务分析用户的关键入口。

- [metabase/metabase](https://github.com/metabase/metabase)  
  ⭐46,540；今日新增：暂无  
  面向广泛业务用户的轻量 BI 工具，持续降低数据分析使用门槛。

- [cube-js/cube](https://github.com/cube-js/cube)  
  ⭐19,681；今日新增：暂无  
  语义层代表项目，在 BI、嵌入式分析和 AI 查询接口中都愈发重要。

- [cloudera/hue](https://github.com/cloudera/hue)  
  ⭐1,450；今日新增：暂无  
  面向数据库/数仓的 SQL 助手型界面工具，在多引擎数据平台中仍具实用价值。

- [elementary-data/elementary](https://github.com/elementary-data/elementary)  
  ⭐2,287；今日新增：暂无  
  dbt 原生数据可观测性方案，反映数据质量与治理能力已成为数仓标配。

- [aquasecurity/trivy](https://github.com/aquasecurity/trivy)  
  ⭐0（榜单数据）；**+104 today**  
  安全扫描并非 OLAP 核心，但在数据平台、容器化数仓和云原生数据基础设施交付链中越来越重要，因此成为今日少数进入 Trending 的基础设施工具。

---

## 五、趋势信号分析

今日 GitHub 实时热榜中，OLAP 核心项目几乎没有获得头部曝光，说明**短期社区注意力被 AI Agent 强烈虹吸**；但从 7 天主题活跃仓库看，数据基础设施内部并未降温，反而在几个方向持续深化：一是 **Rust/Arrow 系查询栈**，以 [DataFusion](https://github.com/apache/datafusion)、[Ballista](https://github.com/apache/datafusion-ballista)、[Databend](https://github.com/databendlabs/databend) 为代表；二是 **Iceberg Catalog/元数据控制面**，如 [Apache Polaris](https://github.com/apache/polaris)、[Lakekeeper](https://github.com/lakekeeper/lakekeeper)、[Gravitino](https://github.com/apache/gravitino)；三是 **实时湖仓摄入**，如 [OLake](https://github.com/datazip-inc/olake) 和 [Apache Fluss](https://github.com/apache/fluss)。  
值得注意的是，[facebookincubator/nimble](https://github.com/facebookincubator/nimble) 这类**新列式文件格式**仍属早期，但已显示出社区对存储层创新的持续兴趣。整体上，当前湖仓/云数仓演进已从单纯“存算分离”进入**目录治理、流式写入、可嵌入查询与统一语义层**并行发展的阶段。

---

## 六、社区关注热点

- **[Apache Polaris](https://github.com/apache/polaris)**  
  Iceberg Catalog 标准化的重要观察点，关系到未来多引擎湖仓互操作能力。

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  Rust + Arrow 查询底座持续扩张，可能成为越来越多数据产品的内核而非独立数据库。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)**  
  面向 Iceberg/Parquet 的高速摄入很贴近真实生产需求，是实时湖仓落地的关键一环。

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  新列式文件格式值得早期跟踪，尤其适合关注下一代云存储上列式布局优化的人群。

- **[chdb-io/chdb](https://github.com/chdb-io/chdb)** / **[duckdb/duckdb](https://github.com/duckdb/duckdb)**  
  嵌入式 OLAP 持续升温，说明“把分析能力直接塞进应用/Notebook/服务进程”正在成为重要交付模式。

--- 

如果你愿意，我还可以继续把这份日报扩展成一个更适合团队内部流转的版本，例如增加：  
1. **Top 10 项目表格**、  
2. **国产/国际项目对比**、  
3. **“值得跟踪的新项目”单独榜单**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*