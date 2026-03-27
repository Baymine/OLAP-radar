# OLAP & 数据基础设施开源趋势日报 2026-03-27

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-27 01:27 UTC

---

# 《OLAP & 数据基础设施开源趋势日报》  
**日期：2026-03-27**

---

## 一、过滤结果

根据给定数据，**GitHub 今日 Trending 榜单 9 个项目中，明确属于 OLAP / 数据基础设施 / 分析引擎相关的仅 1 个**：

- [datalab-to/chandra](https://github.com/datalab-to/chandra) — OCR 表格/表单解析，属于**数据获取与非结构化数据入库前处理**相关工具，可纳入广义数据基础设施观察范围。

其余 Trending 项目主要是 AI agent、语音、CRM、WiFi 感知等，不属于本日报关注范围，已排除。

主题搜索结果中的大部分项目与 OLAP、湖仓、查询引擎、分析平台、数据管道、BI/可观测性等直接相关，纳入后续分类分析。

---

## 二、分类结果

> 说明：一个项目可跨类归属，以下按“最主要类别”归类。

### 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [crate/crate](https://github.com/crate/crate)
- [apache/cloudberry](https://github.com/apache/cloudberry)

### 📦 存储格式与湖仓
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [pixelsdb/pixels](https://github.com/pixelsdb/pixels)

### ⚙️ 查询与计算
- [prestodb/presto](https://github.com/prestodb/presto)
- [trinodb/trino](https://github.com/trinodb/trino)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)

### 🔗 数据集成与 ETL
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- [datalab-to/chandra](https://github.com/datalab-to/chandra)

### 🧰 数据工具
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [cube-js/cube](https://github.com/cube-js/cube)
- [grafana/grafana](https://github.com/grafana/grafana)
- [cloudera/hue](https://github.com/cloudera/hue)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [roapi/roapi](https://github.com/roapi/roapi)

---

## 三、今日速览

1. **今日 Trending 榜单里，纯 OLAP/数据库内核类项目几乎缺席**，说明当天 GitHub 热度仍明显被 AI agent 类项目主导。  
2. 但从主题搜索结果看，**湖仓目录、流式存储、嵌入式分析引擎、Rust 查询执行栈**依然是数据基础设施社区最活跃的主线。  
3. [datalab-to/chandra](https://github.com/datalab-to/chandra) 以 **+557 今日 stars** 成为当天最值得关注的数据相关 Trending 项目，反映出“**将复杂文档/表格转成结构化数据**”的上游数据摄取需求正在升温。  
4. 在长期热度层面，ClickHouse、DuckDB、Doris、StarRocks、Trino、DataFusion 继续稳居核心位置，而 Apache Polaris、Lakekeeper、Fluss 等则体现出**围绕 Iceberg 与实时湖仓元数据/存储层的生态加速成熟**。  

---

## 四、各维度热门项目

## 🗄️ OLAP 引擎

### 1) [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- **Stars：46,556**
- **说明**：实时分析数据库代表项目，列式存储与高性能聚合能力仍是云数仓与可观测性场景的重要基础，因此持续占据 OLAP 生态中心位置。

### 2) [duckdb/duckdb](https://github.com/duckdb/duckdb)
- **Stars：36,972**
- **说明**：嵌入式分析数据库的事实标准，今天依旧值得关注，因为“本地分析 + Parquet + Python/R/浏览器”范式正在继续外溢到更多数据产品。

### 3) [apache/doris](https://github.com/apache/doris)
- **Stars：15,157**
- **说明**：统一分析数据库，兼顾实时分析与湖仓查询，反映出 HTAP 边界模糊后，一体化分析引擎仍是社区高关注方向。

### 4) [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- **Stars：11,514**
- **说明**：面向亚秒级分析和 lakehouse 查询优化，值得关注的原因是其持续强化“统一查询层”定位，贴合现代云分析架构需求。

### 5) [questdb/questdb](https://github.com/questdb/questdb)
- **Stars：16,789**
- **说明**：高性能时序 OLAP 数据库，在实时监控、工业与金融时序分析领域保持强吸引力。

### 6) [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- **Stars：10,039**
- **说明**：强调事务、分析与 AI 工作负载融合，显示数据库内核正朝统一多负载平台演进。

---

## 📦 存储格式与湖仓

### 1) [databendlabs/databend](https://github.com/databendlabs/databend)
- **Stars：9,205**
- **说明**：面向对象存储重构的数据仓库/湖仓系统，今天值得关注在于其把 Analytics、Search、AI、Python Sandbox 统一在同一架构下。

### 2) [apache/polaris](https://github.com/apache/polaris)
- **Stars：1,886**
- **说明**：Apache Iceberg 开放目录服务项目，代表**开放湖仓控制面**正成为生态焦点。

### 3) [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- **Stars：1,227**
- **说明**：Rust 实现的 Iceberg REST Catalog，值得关注因为它体现了“轻量、高性能、云原生 catalog 服务”的新一代实现路线。

### 4) [apache/gravitino](https://github.com/apache/gravitino)
- **Stars：2,926**
- **说明**：联邦元数据湖项目，指向跨区域、跨引擎、跨存储的统一元数据治理需求。

### 5) [apache/fluss](https://github.com/apache/fluss)
- **Stars：1,832**
- **说明**：面向实时分析的流式存储系统，反映出“流式 lakehouse 底座”正在从概念走向工程化落地。

### 6) [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- **Stars：3,226**
- **说明**：强调实时写入、并发更新与增量分析的湖仓框架，贴近 AI+BI 共用数据底座的趋势。

### 7) [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- **Stars：703**
- **说明**：面向大规模列式数据的新文件格式，虽体量尚小，但属于值得跟踪的底层存储创新信号。

---

## ⚙️ 查询与计算

### 1) [trinodb/trino](https://github.com/trinodb/trino)
- **Stars：12,665**
- **说明**：分布式 SQL 查询引擎标杆，仍是跨数据源联邦查询和湖仓计算层的核心选择。

### 2) [prestodb/presto](https://github.com/prestodb/presto)
- **Stars：16,667**
- **说明**：经典大数据 SQL 引擎，说明 Presto 系谱在企业级查询层仍有广泛影响力。

### 3) [apache/datafusion](https://github.com/apache/datafusion)
- **Stars：8,539**
- **说明**：Rust 查询执行引擎代表，今天值得关注是因为越来越多上层系统正把它当作可组合计算内核。

### 4) [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- **Stars：2,000**
- **说明**：DataFusion 的分布式扩展，体现“可嵌入 + 可分布式横向扩展”成为新一代查询框架的重要方向。

### 5) [chdb-io/chdb](https://github.com/chdb-io/chdb)
- **Stars：2,644**
- **说明**：基于 ClickHouse 的 in-process OLAP SQL 引擎，说明嵌入式分析执行正在成为热门交付方式。

### 6) [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- **Stars：1,950**
- **说明**：DuckDB 的 WebAssembly 版本，把分析能力带入浏览器与边缘环境，是“客户端 OLAP”趋势的重要样本。

### 7) [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- **Stars：195**
- **说明**：开源化的高性能分布式查询引擎核心，体量不大但值得观察其是否会推动新一轮云数仓内核开源竞赛。

---

## 🔗 数据集成与 ETL

### 1) [datazip-inc/olake](https://github.com/datazip-inc/olake)
- **Stars：1,313**
- **说明**：面向数据库、Kafka、S3 到 Iceberg/Parquet 的高性能复制工具，直接服务实时分析管道建设。

### 2) [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- **Stars：5,125**
- **说明**：Python 数据加载工具，持续受到欢迎，说明“低门槛数据装载”仍是数据工程团队的刚需。

### 3) [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- **Stars：4,379**
- **说明**：偏事件采集与分发的数据管道平台，在 CDP、产品分析和 warehouse-first 架构中地位稳定。

### 4) [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- **Stars：1,644**
- **说明**：开源 Reverse ETL，反映“从仓到业务系统”的激活链路已成为现代数据栈重要组成部分。

### 5) [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- **Stars：3,713**
- **说明**：基于 Flink 的实时数据开发平台，说明流处理开发体验与运维平台化持续受到重视。

### 6) [datalab-to/chandra](https://github.com/datalab-to/chandra)
- **Stars：0（+557 today）**
- **说明**：可处理复杂表格、表单、手写体与版面结构的 OCR 模型，今天值得关注，因为它补上了非结构化文档进入分析系统前的关键数据提取环节。

---

## 🧰 数据工具

### 1) [apache/superset](https://github.com/apache/superset)
- **Stars：71,154**
- **说明**：开源 BI 平台龙头，依然是连接多种 OLAP 引擎和湖仓系统的标准前端入口。

### 2) [metabase/metabase](https://github.com/metabase/metabase)
- **Stars：46,584**
- **说明**：轻量 BI 工具代表，适合快速自助分析场景，持续反映“低门槛数据消费”市场需求。

### 3) [cube-js/cube](https://github.com/cube-js/cube)
- **Stars：19,708**
- **说明**：语义层项目代表，今天值得关注在于 AI 与 BI 统一访问数据时，语义层的重要性明显上升。

### 4) [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- **Stars：975**
- **说明**：分析数据库基准测试项目，在各家引擎竞争激烈背景下，基准透明化与可复现实验越来越重要。

### 5) [elementary-data/elementary](https://github.com/elementary-data/elementary)
- **Stars：2,288**
- **说明**：面向 dbt 生态的数据可观测性工具，说明“数仓上线后如何监控质量”仍是热点问题。

### 6) [cloudera/hue](https://github.com/cloudera/hue)
- **Stars：1,451**
- **说明**：面向数据库/数仓的 SQL Query Assistant，体现 SQL 工作台和 AI 辅助查询体验仍具实用价值。

### 7) [roapi/roapi](https://github.com/roapi/roapi)
- **Stars：3,416**
- **说明**：可将静态/缓变数据快速暴露为 API，适合轻量分析服务化场景，是“数据产品化”的实用工具。

---

## 五、趋势信号分析

今天的数据相关热度并未出现在数据库内核本身，而是集中在**数据摄取前处理与可组合分析底座**。Trending 中唯一明显相关的 [chandra](https://github.com/datalab-to/chandra) 说明，社区正在关注“如何把复杂表格、表单、文档直接转成可分析数据”，这与企业非结构化数据入湖需求高度一致。另一方面，从主题活跃项目看，**Iceberg catalog、联邦元数据、流式存储、嵌入式 OLAP、Rust 查询内核**是最强信号：Polaris、Lakekeeper、Gravitino、Fluss、DataFusion、chDB、DuckDB-WASM 共同指向一个趋势——湖仓正从“存储格式统一”走向“控制面统一 + 计算形态多样化”。同时，Databend、StarRocks、Doris 等项目继续强化湖仓/云数仓一体化能力，显示下一阶段竞争点已不只是查询快，而是**实时写入、开放目录、对象存储原生、以及 AI/BI 共用的数据平面**。

---

## 六、社区关注热点

- **[datalab-to/chandra](https://github.com/datalab-to/chandra)**  
  今日少数进入 Trending 的数据项目，值得关注其是否会带动“文档到结构化数据”的新一轮开源工具热。

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg catalog 生态正在加速成型，目录服务可能成为未来湖仓控制面的关键基础设施。

- **[apache/datafusion](https://github.com/apache/datafusion) / [chdb-io/chdb](https://github.com/chdb-io/chdb) / [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)**  
  嵌入式、可组合、客户端化查询执行正变成新热点，适合关注下一代数据应用架构。

- **[apache/fluss](https://github.com/apache/fluss) / [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)**  
  实时湖仓正在从批式湖仓升级为流批一体底座，对实时分析与 AI 数据供给都很关键。

- **[databendlabs/databend](https://github.com/databendlabs/databend)**  
  “Analytics + Search + AI”统一底座路线鲜明，适合观察数据仓库是否进一步向多模分析平台演进。

--- 

如果你愿意，我可以进一步把这份日报再整理成一版更适合公众号/周报发布的 Markdown 模板，或者补一版“**国产开源项目观察视角**”。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*