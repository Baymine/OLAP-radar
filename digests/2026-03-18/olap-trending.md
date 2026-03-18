# OLAP & 数据基础设施开源趋势日报 2026-03-18

> 数据来源: GitHub Trending + GitHub Search API | 生成时间: 2026-03-18 02:04 UTC

---

# 《OLAP & 数据基础设施开源趋势日报》  
日期：2026-03-18

## 一、过滤结果

基于给定数据，**Trending 榜单中与 OLAP/数据基础设施明确相关的项目仅保留 1 个**：

- [cloudflare/workerd](https://github.com/cloudflare/workerd)：虽不是传统 OLAP 项目，但作为数据基础设施常见的边缘执行/runtime 组件，与数据服务、网关、轻量计算面存在基础设施关联，可弱相关保留观察。

其余 Trending 项目如 agent framework、知识图谱代码浏览、插件、教程集合等，**不属于 OLAP/数据基础设施核心项目，已排除**。

主题搜索结果中的 72 个仓库里，大部分属于数据基础设施范畴；以下报告聚焦**与 OLAP、分析数据库、查询引擎、湖仓、ETL、数据工具明确相关**的项目。

---

## 二、分类结果

## 1) 🗄️ OLAP 引擎
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [crate/crate](https://github.com/crate/crate)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)
- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)

## 2) 📦 存储格式与湖仓
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [apache/polaris](https://github.com/apache/polaris)
- [apache/gravitino](https://github.com/apache/gravitino)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [prestodb/presto](https://github.com/prestodb/presto)（湖仓查询入口属性明显）
- [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)

## 3) ⚙️ 查询与计算
- [trinodb/trino](https://github.com/trinodb/trino)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [KipData/KiteSQL](https://github.com/KipData/KiteSQL)
- [nazarii-piontko/datafusion-sharp](https://github.com/nazarii-piontko/datafusion-sharp)

## 4) 🔗 数据集成与 ETL
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)

## 5) 🧰 数据工具
- [apache/superset](https://github.com/apache/superset)
- [grafana/grafana](https://github.com/grafana/grafana)
- [metabase/metabase](https://github.com/metabase/metabase)
- [langfuse/langfuse](https://github.com/langfuse/langfuse)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [cloudera/hue](https://github.com/cloudera/hue)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [getredash/redash](https://github.com/getredash/redash)

---

# 三、今日速览

1. 今日 GitHub 热榜里，**纯 OLAP/数据项目并未形成集中爆发**，说明当天 GitHub 流量主要被 agent 与开发工具类项目占据。  
2. 但从主题搜索看，**分析数据库、嵌入式 OLAP、湖仓 catalog、流式存储**仍然是数据基础设施最活跃的主线。  
3. 数据库内核层面，**ClickHouse、DuckDB、Doris、StarRocks、Databend**继续稳居开源分析引擎第一梯队。  
4. 新信号主要来自**新列式格式与轻量分析引擎**，例如 [facebookincubator/nimble](https://github.com/facebookincubator/nimble)、[RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)、[Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)。  
5. 湖仓方向则从“表格式”进一步转向**catalog/metadata/control plane**，如 [apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)。

---

# 四、各维度热门项目

## 🗄️ OLAP 引擎

### 1. [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- Stars：46,375
- 今日新增：暂无
- 说明：实时分析数据库代表项目，仍是开源 OLAP 的事实标准之一，生态外溢能力强，持续值得关注。

### 2. [duckdb/duckdb](https://github.com/duckdb/duckdb)
- Stars：36,724
- 今日新增：暂无
- 说明：嵌入式分析数据库标杆，持续推动“本地/进程内 OLAP”范式，适合数据应用与 AI 工具链内嵌。

### 3. [apache/doris](https://github.com/apache/doris)
- Stars：15,119
- 今日新增：暂无
- 说明：统一分析数据库方向的核心项目，在实时分析、湖仓查询与易用性上保持强势。

### 4. [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- Stars：11,481
- 今日新增：暂无
- 说明：面向亚秒级分析与湖仓查询优化的代表，适合关注新一代高性能 MPP 演进。

### 5. [databendlabs/databend](https://github.com/databendlabs/databend)
- Stars：9,199
- 今日新增：暂无
- 说明：强调对象存储原生和 AI-ready warehouse，体现云原生数仓与 Agent 数据底座融合趋势。

### 6. [questdb/questdb](https://github.com/questdb/questdb)
- Stars：16,769
- 今日新增：暂无
- 说明：时序 OLAP 代表之一，说明 observability/IoT 场景仍是高性能分析数据库的重要战场。

### 7. [chdb-io/chdb](https://github.com/chdb-io/chdb)
- Stars：2,641
- 今日新增：暂无
- 说明：将 ClickHouse 能力下沉到 in-process 形态，反映“OLAP 引擎库化”正在加速。

### 8. [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)
- Stars：112
- 今日新增：暂无
- 说明：纯 C、SIMD 加速的列式分析数据库，虽体量小，但很符合轻量高性能引擎的新创业方向。

---

## 📦 存储格式与湖仓

### 1. [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- Stars：699
- 今日新增：暂无
- 说明：面向大规模列式数据的新文件格式，是今天最值得关注的“新格式”信号之一。

### 2. [apache/polaris](https://github.com/apache/polaris)
- Stars：1,879
- 今日新增：暂无
- 说明：面向 Apache Iceberg 的开放 catalog，代表湖仓基础设施逐渐向元数据层标准化演进。

### 3. [apache/gravitino](https://github.com/apache/gravitino)
- Stars：2,915
- 今日新增：暂无
- 说明：强调联邦与地理分布式 metadata lake，反映多引擎、多区域治理需求增强。

### 4. [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- Stars：1,222
- 今日新增：暂无
- 说明：Rust 实现的 Iceberg REST Catalog，说明 catalog 服务正在走向更轻、更云原生的实现路线。

### 5. [apache/fluss](https://github.com/apache/fluss)
- Stars：1,824
- 今日新增：暂无
- 说明：面向实时分析的流式存储项目，值得关注其在 streaming lakehouse 中的位置。

### 6. [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- Stars：2,135
- 今日新增：暂无
- 说明：大数据平台属性强，兼具湖仓基础设施色彩，适合观察一体化平台路线。

### 7. [datazip-inc/olake](https://github.com/datazip-inc/olake)
- Stars：1,310
- 今日新增：暂无
- 说明：直接面向 Iceberg/Parquet 写入的 ingestion 项目，说明湖仓格式已成为 ETL 终点的默认选择。

---

## ⚙️ 查询与计算

### 1. [trinodb/trino](https://github.com/trinodb/trino)
- Stars：12,642
- 今日新增：暂无
- 说明：分布式 SQL 查询引擎代表，仍是跨数据源联邦查询的主力项目。

### 2. [apache/datafusion](https://github.com/apache/datafusion)
- Stars：8,508
- 今日新增：暂无
- 说明：Rust 查询执行内核热度持续高企，是新一代可嵌入分析引擎的重要底座。

### 3. [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- Stars：1,993
- 今日新增：暂无
- 说明：DataFusion 的分布式执行扩展，体现单机内核向分布式计算面的自然延展。

### 4. [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- Stars：1,941
- 今日新增：暂无
- 说明：浏览器内分析执行的代表项目，说明客户端分析/本地计算正成为一个独立方向。

### 5. [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- Stars：2,616
- 今日新增：暂无
- 说明：存储无关的 MySQL 兼容查询引擎，适合关注 SQL 层与存储层解耦趋势。

### 6. [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)
- Stars：112
- 今日新增：暂无
- 说明：SQL-on-everything 路线鲜明，反映“就地查询、多格式访问”仍有持续需求。

### 7. [KipData/KiteSQL](https://github.com/KipData/KiteSQL)
- Stars：685
- 今日新增：暂无
- 说明：嵌入式 Rust 关系数据库，体量不大，但顺应本地化、可嵌入分析的长期方向。

---

## 🔗 数据集成与 ETL

### 1. [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- Stars：5,059
- 今日新增：暂无
- 说明：面向开发者的数据加载工具，简化数据入仓流程，是现代 ELT 工具链的重要代表。

### 2. [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- Stars：4,374
- 今日新增：暂无
- 说明：Segment 替代方案，连接事件采集与数据仓库，是产品数据管道的成熟基础设施。

### 3. [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- Stars：1,641
- 今日新增：暂无
- 说明：Reverse ETL 方向代表，说明“数仓到业务系统”的回流链路仍具建设价值。

### 4. [datazip-inc/olake](https://github.com/datazip-inc/olake)
- Stars：1,310
- 今日新增：暂无
- 说明：支持数据库、Kafka、S3 到 Iceberg/Parquet 的复制写入，贴近实时湖仓落地场景。

### 5. [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- Stars：3,707
- 今日新增：暂无
- 说明：基于 Flink 的实时数据开发平台，说明实时 ETL/流式作业治理仍是企业刚需。

### 6. [dalenewman/Transformalize](https://github.com/dalenewman/Transformalize)
- Stars：161
- 今日新增：暂无
- 说明：传统可配置 ETL 工具，小众但反映低代码数据处理仍有稳定需求。

---

## 🧰 数据工具

### 1. [apache/superset](https://github.com/apache/superset)
- Stars：71,004
- 今日新增：暂无
- 说明：开源 BI 平台头部项目，依旧是数据探索与仪表板领域的核心基础设施。

### 2. [grafana/grafana](https://github.com/grafana/grafana)
- Stars：72,693
- 今日新增：暂无
- 说明：虽偏 observability，但已成为多源分析与可视化统一入口，数据基础设施属性极强。

### 3. [metabase/metabase](https://github.com/metabase/metabase)
- Stars：46,433
- 今日新增：暂无
- 说明：自助式分析工具代表，持续体现“低门槛 BI”在开源生态中的强生命力。

### 4. [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- Stars：973
- 今日新增：暂无
- 说明：分析数据库基准测试项目，适合作为评估湖仓/OLAP 引擎性能的公共参照。

### 5. [cloudera/hue](https://github.com/cloudera/hue)
- Stars：1,449
- 今日新增：暂无
- 说明：SQL 工作台与仓库交互工具，说明数据入口层仍是企业数据平台体验关键。

### 6. [elementary-data/elementary](https://github.com/elementary-data/elementary)
- Stars：2,276
- 今日新增：暂无
- 说明：面向分析工程师的数据可观测性工具，体现数据质量与管道监控的重要性持续上升。

### 7. [langfuse/langfuse](https://github.com/langfuse/langfuse)
- Stars：23,325
- 今日新增：暂无
- 说明：虽然偏 LLM observability，但其数据采集、评测与分析能力已与现代数据平台深度耦合。

### 8. [getredash/redash](https://github.com/getredash/redash)
- Stars：28,281
- 今日新增：暂无
- 说明：经典 SQL 可视化工具，虽增长放缓，但仍是轻量查询分享场景的重要选择。

---

## 五、趋势信号分析

今天 GitHub 实时热榜对数据基础设施并不友好，说明**社区短期流量被 agent 开发工具显著分流**；但从主题搜索活跃仓库看，数据领域并未降温，反而在更底层的方向持续积累。最强信号来自三类：一是**嵌入式/库化 OLAP**，如 [duckdb/duckdb](https://github.com/duckdb/duckdb)、[chdb-io/chdb](https://github.com/chdb-io/chdb)、[duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)，说明分析能力正从独立数据库下沉为应用组件；二是**湖仓 catalog 与 metadata control plane**，如 [apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)，表明湖仓竞争已从存储格式扩展到治理与互操作层；三是**新列式格式与轻量执行内核**，如 [facebookincubator/nimble](https://github.com/facebookincubator/nimble)、[RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)，显示社区仍在寻找 Parquet/Arrow 之外更高效的数据布局与执行组合。这与近期云数仓、对象存储原生、实时湖仓的发展高度一致。

---

## 六、社区关注热点

- **关注新一代 catalog 基础设施**：如 [apache/polaris](https://github.com/apache/polaris)、[apache/gravitino](https://github.com/apache/gravitino)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)，原因是湖仓标准化正快速上移到元数据控制面。  
- **关注嵌入式 OLAP 普及**：如 [duckdb/duckdb](https://github.com/duckdb/duckdb)、[chdb-io/chdb](https://github.com/chdb-io/chdb)、[duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)，原因是“应用内分析”正在替代部分独立数仓使用场景。  
- **关注 Rust 查询执行生态**：如 [apache/datafusion](https://github.com/apache/datafusion)、[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)、[databendlabs/databend](https://github.com/databendlabs/databend)，原因是其正在成为新数据基础设施的默认实现语言之一。  
- **关注实时分析与流式存储结合**：如 [apache/fluss](https://github.com/apache/fluss)、[questdb/questdb](https://github.com/questdb/questdb)、[DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)，原因是流批统一与实时查询体验仍是企业平台升级重点。  
- **关注新格式/新内核试验项目**：如 [facebookincubator/nimble](https://github.com/facebookincubator/nimble)、[RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)、[Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)，原因是它们可能预示下一轮轻量分析引擎创新方向。  

如果你愿意，我还可以继续把这份日报补充成**“按成熟度分层（头部/成长中/早期观察）”版本**，或者输出成**适合公众号/周报排版的 Markdown 表格版**。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*