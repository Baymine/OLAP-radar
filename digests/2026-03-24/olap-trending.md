# OLAP & 数据基础设施开源趋势日报 2026-03-24

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-24 01:17 UTC

---

# OLAP & 数据基础设施开源趋势日报
**日期：2026-03-24**

---

## 1) 今日速览

1. 今日 GitHub Trending 榜单几乎被 Agent/自动化项目占据，**严格意义上的 OLAP/数据基础设施项目未进入今日实时热榜前列**，说明当日社区注意力更多被 AI Agent 工具链吸走。  
2. 不过从主题搜索结果看，**OLAP / 湖仓 / 查询引擎生态仍然保持高活跃度**，头部项目仍集中在 ClickHouse、DuckDB、Presto/Trino、Doris、StarRocks、DataFusion、Iceberg Catalog 等方向。  
3. 近期最明显的结构性趋势是：**湖仓元数据与 Catalog 层继续升温**，如 Apache Polaris、Gravitino、Lakekeeper 代表了多引擎共享元数据治理的方向。  
4. 另一个值得关注的信号是：**“Agent-ready analytics / AI-ready warehouse” 叙事正渗透进数据基础设施**，如 Databend、Cube、MindsDB、Wren Engine 等都在强化面向 AI/语义层/统一查询接口的定位。  
5. 在执行层面，**嵌入式分析引擎、Rust 查询栈、流式分析存储**持续活跃，反映出轻量部署、向量化执行和实时分析仍是社区核心主题。

---

## 2) 各维度热门项目

> 说明：  
> - 今日 Trending 榜单中**无明确 OLAP/数据基础设施项目**，因此“今日新增 stars”多数缺失。  
> - stars 以题目给出的主题搜索数据为准。  
> - 项目按“主要类别”归类，必要时可跨类理解。

---

### 🗄️ OLAP 引擎
1. [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,486  
   实时分析数据库代表项目，列式存储与高并发聚合能力仍是 OLAP 领域标杆，湖仓查询与实时分析双线能力持续受关注。

2. [duckdb/duckdb](https://github.com/duckdb/duckdb) — ⭐36,889  
   嵌入式分析数据库事实标准之一，适合本地分析、数据科学和轻量 OLAP 场景，持续引领“in-process analytics”范式。

3. [apache/doris](https://github.com/apache/doris) — ⭐15,141  
   面向统一分析的高性能分析型数据库，在实时数仓、日志分析和即席查询场景中保持较高热度。

4. [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — ⭐11,505  
   强调亚秒级分析与 Lakehouse 查询性能，是当前云上实时分析与多维分析场景中的核心选手。

5. [questdb/questdb](https://github.com/questdb/questdb) — ⭐16,786  
   面向时间序列 OLAP 的高性能数据库，在金融、IoT、监控等实时写入分析场景中很有代表性。

6. [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase) — ⭐10,036  
   HTAP/分布式数据库方向的重要项目，事务与分析混合负载能力使其在“统一数据库”趋势下值得持续关注。

7. [apache/cloudberry](https://github.com/apache/cloudberry) — ⭐1,194  
   MPP 数仓路线的开源替代项目，承接 Greenplum 生态关注度，对传统数仓用户有迁移价值。

8. [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc) — ⭐563  
   基于 DuckDB SQL 引擎、Parquet 与 Arrow 的单二进制分析数据库，体现“轻部署 + 云原生对象存储”路线的新尝试。

---

### 📦 存储格式与湖仓
1. [databendlabs/databend](https://github.com/databendlabs/databend) — ⭐9,203  
   以“AI/Analytics/Search/Python Sandbox 统一仓库”为定位，体现数据仓库平台向多工作负载融合演进的趋势。

2. [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,226  
   实时湖仓框架，强调并发更新与增量分析，反映湖仓系统从离线数仓向实时分析平台升级。

3. [apache/gravitino](https://github.com/apache/gravitino) — ⭐2,925  
   联邦元数据湖方向代表，适合多地域、多引擎、多 catalog 的统一治理，是湖仓控制面的重要信号。

4. [apache/polaris](https://github.com/apache/polaris) — ⭐1,884  
   面向 Apache Iceberg 的开放 Catalog，说明 Iceberg 生态的“标准化元数据服务层”正在成为竞争焦点。

5. [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,224  
   Rust 实现的 Iceberg REST Catalog，安全、轻量、易部署，代表新一代 Catalog 服务工程化方向。

6. [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐702  
   面向大型列式数据集的新文件格式，虽然仍偏早期，但说明底层列式格式创新仍在继续。

7. [roapi/roapi](https://github.com/roapi/roapi) — ⭐3,416  
   虽不属于传统湖仓框架，但其围绕静态/缓变列式数据集快速暴露 API 的能力，非常适合数据产品化场景。

---

### ⚙️ 查询与计算
1. [trinodb/trino](https://github.com/trinodb/trino) — ⭐12,659  
   分布式 SQL 查询引擎代表，仍是跨数据源联邦查询与 Lakehouse 计算层的重要基础设施。

2. [prestodb/presto](https://github.com/prestodb/presto) — ⭐16,663  
   Presto 路线依旧活跃，体现超大规模 SQL 联邦查询生态仍具有稳定影响力。

3. [apache/datafusion](https://github.com/apache/datafusion) — ⭐8,528  
   Rust 查询引擎明星项目，正在成为 Arrow 原生查询计算栈的核心组件，也是现代 OLAP 引擎构建底座。

4. [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — ⭐1,995  
   DataFusion 的分布式执行扩展，说明 Rust 查询栈正从嵌入式计算向集群级执行迈进。

5. [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,946  
   DuckDB 的 WebAssembly 版本，使浏览器内分析成为现实，适合前端分析、隐私计算和轻交互 BI 场景。

6. [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,617  
   存储无关的 MySQL 兼容查询引擎，适合作为嵌入式 SQL 层或自定义数据系统的执行内核。

7. [chdb-io/chdb](https://github.com/chdb-io/chdb) — ⭐2,644  
   ClickHouse 驱动的进程内 OLAP SQL 引擎，体现“把分析引擎嵌进应用/脚本”的轻量计算趋势。

8. [KipData/KiteSQL](https://github.com/KipData/KiteSQL) — ⭐685  
   嵌入式关系型数据库与 Rust 数据 API 结合，代表开发者友好型、程序内可集成计算引擎方向。

---

### 🔗 数据集成与 ETL
1. [datazip-inc/olake](https://github.com/datazip-inc/olake) — ⭐1,312  
   面向 Iceberg/Parquet 的数据库、Kafka 与对象存储复制工具，直连实时分析落地，是湖仓摄取层的重要新秀。

2. [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — ⭐5,100  
   Python 数据加载工具，降低从 API/数据库到数仓的数据装载复杂度，适合现代 ELT 工作流。

3. [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — ⭐4,377  
   Segment 替代方案，承担事件采集与路由，是产品分析、CDP 与仓库写入链路中的关键基础设施。

4. [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
   开源 Reverse ETL 项目，反映数据仓库不再只是终点，而是反向驱动业务系统的数据中心。

5. [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit) — ⭐478  
   用 Python 和 SQL 开发、部署、运营数据工作流的一体化框架，适合工程化数据管道管理。

6. [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
   经典可配置 ETL 项目，虽然规模较小，但仍代表轻量 ETL 工具在特定企业场景的持续需求。

---

### 🧰 数据工具
1. [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐974  
   分析数据库基准测试项目，在多引擎竞争加剧背景下，性能基准与可复现评测的重要性持续上升。

2. [apache/superset](https://github.com/apache/superset) — ⭐71,073  
   开源 BI 与数据探索平台头部项目，继续扮演数据仓库/湖仓结果消费层的重要入口。

3. [metabase/metabase](https://github.com/metabase/metabase) — ⭐46,519  
   强调易用性的 BI 工具，适合中小团队快速建立分析体系，社区粘性很强。

4. [cube-js/cube](https://github.com/cube-js/cube) — ⭐19,674  
   语义层代表项目，连接 BI、嵌入式分析与 AI 消费层，尤其契合多指标统一治理需求。

5. [grafana/grafana](https://github.com/grafana/grafana) — ⭐72,809  
   虽以可观测性见长，但其多数据源查询与可视化能力也使其成为实时分析与运维数据消费的重要工具。

6. [elementary-data/elementary](https://github.com/elementary-data/elementary) — ⭐2,285  
   dbt-native 数据可观测性工具，反映数仓质量治理和数据可靠性已经成为数据工程标配。

7. [cloudera/hue](https://github.com/cloudera/hue) — ⭐1,450  
   面向数据库/数仓的 SQL 查询助手，适合统一查询入口与分析操作台场景。

8. [data-dot-all/dataall](https://github.com/data-dot-all/dataall) — ⭐251  
   现代数据市场与协作平台，代表数据目录、共享和治理能力向产品化演进。

---

## 3) 趋势信号分析

今天的一个明显现象是：**GitHub 全站实时热度并未直接给到 OLAP 栈，而是被 Agent 应用层项目占据**。但从数据基础设施主题活跃仓库看，社区关注并没有减弱，只是从“数据库本体”扩展到了**湖仓元数据层、统一语义层、Agent-ready 查询接口**。其中最强信号来自 Iceberg 生态周边：Polaris、Lakekeeper、Gravitino 等项目说明，湖仓竞争正从存储格式和查询性能，进一步转向 **catalog、权限、跨引擎互操作**。  
另一个趋势是 **Rust/嵌入式查询栈持续增强**：DataFusion、chDB、DuckDB-Wasm、KiteSQL 等代表了更轻、更可嵌入、更程序化的数据计算方式。与近期云数仓和湖仓发展相呼应，未来数据平台将不只是集中式仓库，而更像是**对象存储上的开放表格式 + 可插拔查询层 + 面向 AI 的统一访问接口**。

---

## 4) 社区关注热点

- **[apache/polaris](https://github.com/apache/polaris)**  
  Iceberg Catalog 标准化的关键项目，值得关注其是否成为跨引擎共享元数据的事实接口。

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Rust 查询引擎生态核心，很多新一代 OLAP/查询系统都可能基于它构建执行层。

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)**  
  直接把数据库/Kafka/S3 数据复制到 Iceberg/Parquet，贴近实时湖仓摄取的实际需求。

- **[databendlabs/databend](https://github.com/databendlabs/databend)**  
  “Analytics + Search + AI” 一体化仓库叙事非常鲜明，适合作为下一代数据平台形态观察样本。

- **[cube-js/cube](https://github.com/cube-js/cube)**  
  语义层正在成为 BI 与 AI 应用共享指标口径的重要中间层，Cube 是这一方向的核心项目之一。

--- 

如果你愿意，我还可以继续把这份日报再补成一个更适合内部周报/公众号发布的版本，附上：
1. **“头部项目对比表”**  
2. **“本日值得跟踪的新项目/小项目”**  
3. **“湖仓、OLAP、查询引擎三条赛道的月度趋势判断”**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*