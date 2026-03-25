# Apache Doris 生态日报 2026-03-25

> Issues: 4 | PRs: 136 | 覆盖项目: 10 个 | 生成时间: 2026-03-25 01:21 UTC

- [Apache Doris](https://github.com/apache/doris)
- [ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [DuckDB](https://github.com/duckdb/duckdb)
- [StarRocks](https://github.com/StarRocks/StarRocks)
- [Apache Iceberg](https://github.com/apache/iceberg)
- [Delta Lake](https://github.com/delta-io/delta)
- [Databend](https://github.com/databendlabs/databend)
- [Velox](https://github.com/facebookincubator/velox)
- [Apache Gluten](https://github.com/apache/incubator-gluten)
- [Apache Arrow](https://github.com/apache/arrow)

---

## Apache Doris 项目深度报告

⚠️ 摘要生成失败。

---

## 横向引擎对比

以下是基于 2026-03-25 各项目社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# OLAP / 分析型存储引擎开源生态横向对比报告
**日期：2026-03-25**

## 1. 生态全景

过去 24 小时的社区动态显示，分析型数据库与湖仓执行生态整体仍处于**高活跃、快速演进**状态，且重心明显从“单点性能”转向“升级稳定性、云对象存储兼容、生态接入与可观测性增强”。  
从项目分布看，**ClickHouse、StarRocks、DuckDB、Arrow、Delta Lake、Iceberg** 等均保持较高开发热度；其中数据库内核项目更关注**性能回归、执行正确性、复制/存储一致性**，湖仓与基础组件项目则更集中在**协议、连接器、云存储凭证、发布/CI治理**。  
另一个显著信号是，多项目同时在推进 **DataLake / Catalog / Arrow Flight SQL / Postgres 协议 / BI 生态兼容 / Spark 4.x 适配**，说明行业竞争已经从“谁更快”进入“谁更容易接入现有数据平台体系”。  
整体而言，当前生态呈现出两条并行主线：**一条是内核层 correctness 与稳定性治理，另一条是围绕湖仓、云原生与标准接口的中长期平台化扩展**。

---

## 2. 各项目活跃度对比

> 注：Apache Doris 当日摘要生成失败，以下表格对 Doris 相关数据标记为 N/A，并在后文做定性定位分析。

| 项目 | Issues 更新数 | PR 更新数 | Release | 今日状态/健康度评估 |
|---|---:|---:|---|---|
| **Apache Doris** | N/A | N/A | N/A | **核心参照项目，但今日数据缺失**；无法据当日活跃度定量判断 |
| **ClickHouse** | 58 | 433 | **有**：v25.12.9.61-stable | **高活跃，高健康度**；功能扩展与稳定性治理并行，但 26.2/26.3 回归风险突出 |
| **DuckDB** | 21 | 39 | 无 | **活跃且响应快**；1.5.x 回归与 correctness 问题增多，短期稳定性压力上升 |
| **StarRocks** | 14 | 116 | 无 | **高活跃，修复节奏快**；外部 Catalog / 存算分离 / 云存储兼容仍是主战场 |
| **Apache Iceberg** | 9 | 50 | 无 | **中高活跃**；Spark、REST/OpenAPI、凭证体系持续推进，但大型 PR 积压明显 |
| **Delta Lake** | 2 | 49 | 无 | **开发活跃、主线清晰**；CDC、DSv2、Variant/Geospatial 进展快，但评审带宽偏紧 |
| **Databend** | 10 | 26 | 无 | **活跃且修复导向明显**；SQL 边界语义和 planner panic 收敛较快 |
| **Velox** | 7 | 47 | 无 | **高活跃**；GPU/cuDF 路线强劲，但 correctness 与内存/下推边界需重点关注 |
| **Apache Gluten** | 7 | 20 | 无 | **健康度良好**；Spark 4.x 适配、Velox/CH 后端稳定性治理持续推进 |
| **Apache Arrow** | 28 | 24 | 无 | **活跃且偏工程收敛**；R/CRAN、CI、Flight ODBC 打包与 Python/Parquet 持续增强 |

### 简要结论
- **超高活跃层**：ClickHouse、StarRocks  
- **高活跃层**：DuckDB、Iceberg、Delta Lake、Velox  
- **中高活跃/工程收敛层**：Arrow、Databend、Gluten  
- **Doris**：因当日数据缺失，无法纳入活跃度排名，但仍适合作为 MPP OLAP 核心对照样本。

---

## 3. Apache Doris 在生态中的定位

尽管今日缺少 Doris 的动态摘要，但从其在开源 OLAP 生态中的长期位置看，**Apache Doris 仍是典型的面向实时分析与统一查询加速的 MPP 分析数据库代表**，在架构定位上最接近 **StarRocks、ClickHouse**，并与 **DuckDB、Databend、湖仓执行栈（Iceberg/Delta/Arrow/Velox）** 形成明显分层。

### 3.1 与同类相比的优势
相较于同类项目，Doris 的典型优势通常体现在：
- **面向实时数仓/即席分析的一体化体验**：存储、计算、物化视图、导入、加速能力较完整；
- **OLAP MPP 路线成熟**：对宽表分析、聚合查询、报表类负载支持稳定；
- **较强的工程化交付属性**：对企业用户而言，Doris 往往比“组件式湖仓栈”更容易形成开箱即用的平台能力；
- **在中国开发者与企业用户群中社区心智较强**，与 StarRocks 一样具备较高国内落地基础。

### 3.2 技术路线差异
与其他项目相比，Doris 的路线差异大致如下：

- **对 ClickHouse**：  
  Doris 更偏向标准 MPP 分析数据库体系，强调查询加速、数仓承载和统一平台体验；  
  ClickHouse 更强调极致执行性能、函数/引擎扩展速度、存储与协议层持续演化。

- **对 StarRocks**：  
  两者都属于现代 MPP OLAP 阵营，且都在加强湖仓与外部 Catalog 能力；  
  StarRocks 近期在 **Paimon / Iceberg / 存算分离 / warehouse 调度** 上社区声量更高，说明其更积极押注“统一湖仓加速层”定位。

- **对 DuckDB**：  
  Doris 面向服务端集群 OLAP；DuckDB 更偏嵌入式/单机分析引擎。二者服务的部署模型完全不同。

- **对 Databend**：  
  Databend 更强调云原生、对象存储、元数据演进与新型 SQL/表分支能力；  
  Doris 则更偏成熟数仓平台与 MPP 查询服务。

- **对 Iceberg/Delta/Arrow/Velox**：  
  这些项目更多是湖仓表格式、执行层或基础数据访问组件；  
  Doris 则是面向最终分析服务的完整数据库系统。

### 3.3 社区规模对比
如果仅以本日报可见数据看：
- ClickHouse、StarRocks 的 PR 流量明显处于第一梯队；
- DuckDB、Iceberg、Delta、Velox 也显示出强开发活动；
- Doris 当日无法定量比较。  

但从长期生态视角，Doris 仍可视为：
- **与 ClickHouse、StarRocks 同属第一梯队 OLAP 引擎核心玩家**；
- 在“统一查询平台 + MPP 数仓”维度仍有强竞争力；
- 相较 ClickHouse 的全球超大规模社区、DuckDB 的开发者爆发式增长，Doris 更像是**企业数仓场景中的稳态核心项目**。

---

## 4. 共同关注的技术方向

以下是多项目共同涌现的高频方向：

### 4.1 升级稳定性与性能回归治理
**涉及项目**：ClickHouse、DuckDB、Databend、Gluten、Velox  
**具体诉求**：
- ClickHouse：25.12 → 26.2 出现 INSERT 3 倍变慢、DateTime/时区行为回归；
- DuckDB：1.5.x 出现 Internal Error、错误结果、checkpoint 崩溃等回归；
- Databend：nightly 版本 INSERT 性能退化；
- Gluten：`limit` 查询比原生 Spark 慢 10 倍，已进入修复；
- Velox：Parquet 下推 + 类型扩宽导致错结果/崩溃。  

**结论**：版本升级的**性能可预测性与语义稳定性**，已成为用户最核心诉求之一。

---

### 4.2 湖仓接入、Catalog 与对象存储兼容
**涉及项目**：ClickHouse、StarRocks、Iceberg、Delta Lake、Arrow、Gluten  
**具体诉求**：
- ClickHouse：Azure + Delta Kernel DataLake、Catalog CHECK DATABASE、S3/filesystem cache/shared storage；
- StarRocks：Paimon、Iceberg、Azure Data Lake、Ranger 权限、多 warehouse；
- Iceberg：REST/OpenAPI、GCS 凭证刷新、staged table credential refresh；
- Delta Lake：DSv2 + Kernel DDL、CDC、OAuth；
- Arrow：Azure Blob filesystem、Parquet 写入增强；
- Gluten：S3 配置治理、S3CrtClient 评估。  

**结论**：对象存储与外部表格式已经从“可接入”进入“企业级稳定运行”阶段，**Catalog/凭证/元数据扩展性**成为核心竞争点。

---

### 4.3 SQL 兼容性与生态接入
**涉及项目**：ClickHouse、DuckDB、Databend、Velox、Gluten、Arrow  
**具体诉求**：
- ClickHouse：SQL 标准兼容模式、Postgres 协议、Arrow Flight SQL；
- DuckDB：窗口函数绑定器重构、Insert/QueryNode 统一、Windows CLI/宿主兼容；
- Databend：`X'...'` 标准兼容、LIKE/ESCAPE/GROUPING 等边界行为修复；
- Velox：Spark ANSI decimal、JSON wildcard 兼容；
- Gluten：TIMESTAMP_NTZ、Spark 4.0/4.1 适配；
- Arrow：R/dplyr 语义、Flight ODBC 产品化。  

**结论**：生态已经从“能执行 SQL”迈向“**能无摩擦接入现有工具链、语言生态和 BI 系统**”。

---

### 4.4 可观测性、调优与质量门禁
**涉及项目**：ClickHouse、DuckDB、Iceberg、Arrow、Velox  
**具体诉求**：
- ClickHouse：skip index query log、predicate statistics、obfuscateQuery；
- DuckDB：统计传播精度、优化器剪枝能力；
- Iceberg：Spark UI scan metrics、列裁剪可见性；
- Arrow：CI、CRAN、发布链路治理；
- Velox：build impact analysis、CI/测试治理。  

**结论**：数据库内核和基础组件都在增强**可调优性、可验证性和 CI 稳定性**，这说明用户和维护者都越来越依赖“可解释的性能”。

---

### 4.5 正确性优先于极限性能
**涉及项目**：DuckDB、Velox、ClickHouse、Databend、Delta Lake  
**具体诉求**：
- DuckDB：WindowSelfJoinOptimizer 错误结果；
- Velox：Parquet type widening + pushdown 错结果；
- ClickHouse：DateTime/overflow/mutation checksum 一致性；
- Databend：planner panic 转语义错误；
- Delta Lake：coordinated commits 下 silent data loss 修复。  

**结论**：在成熟阶段，社区更敏感的是**静默错误、数据丢失、语义偏差**，而不是单纯 benchmark 分数。

---

## 5. 差异化定位分析

## 5.1 存储格式与数据模型定位

| 项目 | 存储/格式侧定位 | 说明 |
|---|---|---|
| **Doris** | 自有 OLAP 存储 + 湖仓对接 | 典型 MPP 数仓，逐步增强外部表/湖仓能力 |
| **ClickHouse** | 自有列存 + 多引擎 + 对象存储扩展 | 存储层灵活，S3/shared storage 路线明显 |
| **StarRocks** | 自有列存 + 外部 Catalog 加速 | 对 Iceberg/Paimon/Hive 生态投入很强 |
| **DuckDB** | 单机嵌入式存储 + 多格式扫描 | Parquet/CSV/Arrow 等本地分析极强 |
| **Databend** | 云原生对象存储导向 | 更强调对象存储、元数据与版本化能力 |
| **Iceberg** | 表格式 | 不直接做查询执行，偏湖仓元数据与规范 |
| **Delta Lake** | 表格式 + 事务日志 | Spark/Kernel/CDC 路线鲜明 |
| **Arrow** | 内存格式 + I/O/连接器 | 更像生态基础设施而非数据库 |
| **Velox** | 执行引擎 | 负责算子执行，不负责表格式治理 |
| **Gluten** | Spark 插件/加速层 | 把 Spark 物理计划映射到 Velox/CH 后端 |

---

## 5.2 查询引擎设计差异

- **Doris / StarRocks / ClickHouse**：  
  都属于服务端分析数据库，但：
  - ClickHouse 更强调执行速度与引擎扩展；
  - Doris / StarRocks 更偏 MPP 数仓与统一加速平台；
  - StarRocks 当前更明显地强化“外部湖仓查询加速层”。

- **DuckDB**：  
  嵌入式、单机、向量化分析执行，目标不是大集群分布式服务。

- **Databend**：  
  云原生分离式设计导向更强，强调对象存储与元数据层演化。

- **Velox / Gluten**：  
  属于“执行层”而非“完整数据库”，服务于上层 Presto / Spark / 其他系统。

- **Iceberg / Delta**：  
  本质上是“表层协议和元数据层”，不是 SQL 引擎。

- **Arrow**：  
  是生态底座，连接内存格式、I/O、Flight、语言绑定。

---

## 5.3 目标负载类型差异

| 项目 | 目标负载 |
|---|---|
| **Doris / StarRocks** | 实时数仓、BI 报表、交互式分析、统一查询加速 |
| **ClickHouse** | 高吞吐分析、日志/时序/明细分析、复杂函数处理 |
| **DuckDB** | 本地分析、数据科学、嵌入式 OLAP、开发测试 |
| **Databend** | 云原生分析、对象存储上的数据处理 |
| **Iceberg / Delta** | 湖仓表管理、批流统一数据组织 |
| **Velox / Gluten** | 作为上层引擎加速内核，服务复杂 SQL 执行 |
| **Arrow** | 数据交换、内存计算、语言/系统间互联 |

---

## 5.4 SQL 兼容性差异

- **ClickHouse**：高速演进，正持续补齐标准兼容、协议兼容、生态接口。
- **Doris / StarRocks**：偏企业数仓 SQL 体验，通常更重视 BI/数据仓库接入稳定性。
- **DuckDB**：SQL 能力强，且在快速补齐窗口函数、CTE、宏、宿主场景。
- **Databend**：当前明显在修边界语义，向更“数据库化”的错误处理推进。
- **Velox / Gluten**：兼容性更多体现为 Spark/Presto 语义对齐。
- **Iceberg / Delta / Arrow**：不是 SQL 数据库主体，SQL 兼容性不是第一评价轴。

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：超高活跃、强迭代
- **ClickHouse**
- **StarRocks**

特点：
- PR 流量极高；
- 同时推进功能扩展和稳定性修复；
- 社区已进入高并发开发状态。

### 第二层：高活跃、主线推进明显
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**

特点：
- 明显有主线能力推进；
- correctness / 架构重构 / 平台化能力并行；
- 评审与收敛节奏成为关键。

### 第三层：中高活跃、质量收敛导向
- **Databend**
- **Apache Gluten**
- **Apache Arrow**

特点：
- 修复链路清晰；
- 工程治理、兼容性和发布稳定性占比高；
- 更像“边迭代边打磨”。

### 特殊项：Apache Doris
- 今日无数据，不参与当日热度分层；
- 但从生态位看仍属于 OLAP 主流核心玩家。

---

## 6.2 快速迭代阶段 vs 质量巩固阶段

### 快速迭代阶段
- **ClickHouse**：DataLake、Catalog、Flight SQL、协议兼容与大量引擎变更并行；
- **Delta Lake**：CDC、DSv2、Variant、Geospatial、认证能力集中推进；
- **Velox**：GPU/cuDF 算子覆盖快速扩张；
- **DuckDB**：内部重构仍多，功能前沿性强。

### 质量巩固阶段
- **Arrow**：R/CRAN、CI、安装器、依赖治理明显偏收敛；
- **Gluten**：Spark 4.x 测试回补、limit/内存/S3 配置治理；
- **Databend**：SQL 兼容与 panic 修复集中；
- **StarRocks**：虽然活跃，但大量精力用于 Catalog/云场景稳定性治理，表现为“扩展中伴随质量巩固”。

---

## 7. 值得关注的趋势信号

## 7.1 行业趋势一：湖仓与 OLAP 引擎边界进一步模糊
越来越多 OLAP 引擎不再满足于“只管理自己存储的数据”，而是在持续吸纳：
- Iceberg / Delta / Paimon Catalog
- 对象存储
- 云认证与凭证刷新
- 标准协议接口

**参考项目**：ClickHouse、StarRocks、Iceberg、Delta、Arrow、Gluten  
**对架构师的意义**：未来选型不应只看“数据库性能”，还要看其作为**统一分析入口**的生态兼容度。

---

## 7.2 行业趋势二：正确性与升级可预测性正在成为第一优先级
多个项目都出现了性能回归、错误结果、时间语义变化、静默数据丢失风险等问题。  
这意味着在成熟阶段，用户的判断标准已从“有没有新功能”转为：
- 升级后是否稳定
- 结果是否可信
- 是否能快速定位问题

**参考项目**：ClickHouse、DuckDB、Velox、Delta、Databend  
**对数据工程师的意义**：升级策略必须强化 **回归基准 + correctness case + 生产前验证**。

---

## 7.3 行业趋势三：可观测性与调优工具正在成为产品竞争力
skip index 命中日志、predicate statistics、scan metrics、build impact analysis、golden plan tests 等都在出现。  
这说明数据库和执行引擎不再只提供“结果”，而是要提供“为什么这么执行、为什么这么慢”的答案。

**参考项目**：ClickHouse、DuckDB、Iceberg、Gluten、Velox  
**对团队的意义**：选型时应关注 **Explain/日志/查询画像/指标暴露能力**，这直接决定后续运维成本。

---

## 7.4 行业趋势四：云原生对象存储已从附加能力变成基础要求
S3、ADLS、GCS、shared storage、filesystem cache、credential refresh、OAuth 都成为高频话题。  
对象存储不再只是冷数据层，而是越来越成为分析平台主存储。

**参考项目**：StarRocks、ClickHouse、Iceberg、Delta、Arrow、Gluten、Databend  
**对架构师的意义**：未来架构更偏向“**对象存储 + 计算层 + Catalog/权限/加速层**”的组合，而非传统本地盘中心模式。

---

## 7.5 行业趋势五：生态接入能力成为采用率关键
Postgres protocol、Arrow Flight SQL、ODBC、SQLAlchemy、Superset、dplyr、HTTP 参数绑定、Spark 4.x 兼容等都说明：
**用户越来越希望把新引擎无缝塞进现有数据工具链**。

**参考项目**：ClickHouse、StarRocks、Arrow、DuckDB、Databend、Gluten  
**对数据平台团队的意义**：数据库/执行引擎的价值，不再只由查询性能决定，也由其**接入 BI、编排、开发语言与治理平台的摩擦成本**决定。

---

# 结论

从 2026-03-25 的社区动态看，OLAP 与分析型存储引擎生态已明显进入 **“平台化竞争”阶段**：  
一方面，核心数据库项目仍在围绕性能、稳定性、SQL 语义和执行正确性持续打磨；另一方面，湖仓表格式、对象存储、协议兼容、连接器、可观测性和云认证正在成为新的分水岭。  

如果以技术决策视角总结：
- **追求极致执行能力与广泛扩展性**：重点看 ClickHouse、Velox 生态；
- **追求企业级统一分析平台与湖仓加速**：重点看 Doris、StarRocks；
- **追求嵌入式/本地分析与开发者友好性**：重点看 DuckDB；
- **追求云原生与湖仓协议能力**：重点看 Iceberg、Delta、Arrow、Databend；
- **追求 Spark 加速与异构执行后端**：重点看 Gluten + Velox。  

而对 Apache Doris 而言，虽然今日缺少社区动态数据，但其在生态中的核心位置并未改变：**它仍是 MPP OLAP 主流阵营中的关键项目，竞争焦点将主要来自 ClickHouse 的高活跃引擎路线，以及 StarRocks 在湖仓/存算分离方向上的强势推进。**

如果你愿意，我还可以继续输出两种衍生版本：
1. **面向 CTO/架构委员会的 1 页风险与选型摘要版**  
2. **面向数据平台团队的“Doris vs ClickHouse vs StarRocks”专项对比版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报 · 2026-03-25

## 1. 今日速览

过去 24 小时，ClickHouse 项目保持**高活跃度**：Issues 更新 58 条，PR 更新 433 条，且有 **1 个 stable 版本发布**，说明项目仍处于高频迭代与快速修复阶段。  
从议题结构看，社区关注点集中在 **26.x 升级后的性能回归、DateTime/时区行为变化、复制与存储一致性、CI/fuzz 稳定性**，同时也能看到 **DataLake、Arrow Flight SQL、Postgres 协议兼容、Catalog 能力** 等中长期演进方向持续推进。  
今天关闭/合并的事项中，既有用户可感知的 SQL/函数能力增强，也有对 S3/缓存/CI 基础设施的修复，体现出项目在**功能扩展与稳定性治理并行**的状态。  
整体判断：**项目健康度较高，但 26.2/26.3 分支上的回归与兼容性问题值得持续重点关注。**

---

## 2. 版本发布

## 新版本：v25.12.9.61-stable
- Release: **v25.12.9.61-stable**
- 链接: ClickHouse Release `v25.12.9.61-stable`

### 版本解读
本次数据仅给出版本号与发布事件，未附完整 changelog，因此无法逐项核实具体修复列表。结合版本命名判断，这是 **25.12 stable 维护分支**上的一个补丁发布，通常意味着：
- 以**稳定性修复、回归修复、安全与兼容性修补**为主；
- 一般不应引入大范围行为变化；
- 对生产用户而言，优先价值通常在于**降低已知 bug 暴露面**。

### 迁移与升级注意事项
由于社区今日热点中出现了多项 **26.2/26.3 回归问题**，对生产用户的建议是：
1. **如果当前运行 25.12 stable 且业务稳定**，短期内优先评估升级到 **25.12.9.61-stable** 这一补丁版本，而非直接跨到 26.x。
2. 若计划从 25.12 升到 26.x，请重点回归测试：
   - INSERT 吞吐与写入延迟；
   - `session_timezone` 下 `DateTime`/`DateTime64` 的写入与展示一致性；
   - ReplicatedMergeTree mutation 与 checksum 一致性；
   - 新 analyzer 相关 CTE / VIEW / DBT 场景；
   - 权限受限用户下 `clickhouse-client` 的退出流程。
3. 对涉及 **S3、filesystem cache、shared storage、plain_rewritable 元数据** 的部署，建议关注相关 issue/PR 的后续修复再做大版本切换。

### 破坏性变更
- **今日提供的数据中未出现该 stable 版本的明确 breaking changes 说明。**
- 但从 issue 信号看，**跨 25.12 → 26.x 存在行为变化与性能回归风险**，应视为迁移重点风险区。

---

## 3. 项目进展

以下为今日值得关注的已关闭/推进中的重要 PR 与对应技术影响。

### 已关闭/完成的关键事项

#### 1) 新增 SQL 函数 `obfuscateQuery`
- PR: #98305 `[CLOSED] Feat: A SQL function obfuscateQuery`
- 对应 Issue: #98010 `[CLOSED] A SQL function obfuscateQuery`
- 链接: ClickHouse/ClickHouse PR #98305 / Issue #98010

**意义**：
- 为 SQL 文本脱敏提供内建能力，便于共享查询、排障、日志导出和工单协作；
- 对云环境、支持团队、性能分析与安全合规都很实用。

**技术方向**：
- 提升可观测性与用户支持工具链能力；
- 也说明 ClickHouse 在“数据库内原生运维辅助函数”上继续扩展。

---

#### 2) 修复 executable table function 的 shell 风格参数解析
- PR: #99794 `[CLOSED] Fix parsing of shell-style quotes in arguments for the executable table function`
- 对应 Issue: #66634 `[CLOSED] Unable to pass argument containing space to the 'executable'`
- 链接: ClickHouse/ClickHouse PR #99794 / Issue #66634

**意义**：
- 修复带空格/引号参数无法正确传递的问题；
- 提升 `executable` 表函数在外部脚本集成场景中的可用性。

**技术影响**：
- 属于典型的 **SQL 与外部执行环境边界兼容性修复**；
- 对数据处理流水线、用户自定义脚本函数场景更友好。

---

#### 3) `printf` 支持基于列值的动态格式串
- PR: #98991 `[CLOSED] Support dynamic printf format strings based on column values`
- 链接: ClickHouse/ClickHouse PR #98991

**意义**：
- `printf` 从常量格式串扩展为**按行动态格式化**；
- 对报表、字符串加工、兼容旧 SQL 习惯和模板化输出有帮助。

**技术方向**：
- 反映出 SQL 函数层在向更灵活的表达能力靠拢；
- 有利于减轻用户在 ETL 中依赖外部格式化逻辑。

---

#### 4) 修复 filesystem cache I/O 错误误判数据 part 损坏
- PR: #99386 `[CLOSED] Fix: filesystem cache disk IO error must not mark MergeTree parts as broken`
- 链接: ClickHouse/ClickHouse PR #99386

**意义**：
- 在 S3 + 本地 filesystem cache 的部署中，如果只是 cache 写失败，不应把 MergeTree part 标记为损坏；
- 这对对象存储场景非常关键，能避免误告警、误修复和可用性下降。

**技术方向**：
- 属于 **存储层健壮性修复**；
- 强化了“缓存失败 ≠ 源数据损坏”的错误分类能力。

---

#### 5) CI 定向/重跑检查修复
- PR: #100627 `[CLOSED] ci: fix module scope re-entry with --dist=each in flaky/targeted check`
- 链接: ClickHouse/ClickHouse PR #100627

**意义**：
- 修复 flaky/targeted 检查中的测试框架问题；
- 可减少 CI 自身噪音，提高真实回归识别能力。

---

### 今日值得关注的进行中 PR

#### 6) 查询可观测性增强：记录 skip index 使用情况
- PR: #99793 `[OPEN] Log skip index use in query log`
- 链接: ClickHouse/ClickHouse PR #99793

**价值**：
- 让查询日志直接暴露哪些 data skipping index 被命中；
- 有助于 SQL 调优、索引有效性验证、性能归因。

---

#### 7) 谓词统计日志 / 选择率采集
- PR: #98727 `[OPEN] Predicate statistics log (selectivity collection)`
- 链接: ClickHouse/ClickHouse PR #98727

**价值**：
- 这类能力通常是后续**成本估计、优化器增强、自动调优**的前置基础；
- 是明显的优化器长期投资信号。

---

#### 8) 精确 count 优化修复
- PR: #100408 `[OPEN] Fix TOO_MANY_ROWS exception during exact count optimization with multiple parts`
- 链接: ClickHouse/ClickHouse PR #100408

**价值**：
- 与 `SELECT count()` 优化路径有关；
- 说明优化器在利用 projection / exact ranges 时，仍有边界条件待完善。

---

#### 9) Distributed + VIEW 场景 ORDER BY 下推优化
- PR: #94102 `[OPEN] Push ORDER BY from outer query into simple VIEWs for distributed optimization`
- 链接: ClickHouse/ClickHouse PR #94102

**价值**：
- 有望减少 coordinator 端全量排序，改善分布式查询的 ORDER BY + LIMIT 性能；
- 是查询引擎层面非常实用的优化。

---

#### 10) DataLake / Catalog / Arrow Flight SQL 持续推进
- PR: #86892 `Support DataLake on top of Azure with Delta Kernel`
- PR: #94690 `Add new query CHECK DATABASE for Catalog`
- PR: #91170 `Add Arrow Flight SQL support`
- 链接: ClickHouse/ClickHouse PR #86892 / #94690 / #91170

**价值**：
- 表明 ClickHouse 正持续扩展到 **湖仓接入、Catalog 治理、标准化数据访问接口**；
- 对企业级互联与生态兼容非常关键。

---

## 4. 社区热点

以下为今日最值得关注的讨论热点及背后技术诉求。

### 1) 26.2 写入性能回归：INSERT 慢 3 倍
- Issue: #99241 `[OPEN] INSERT queries are 3x slower after upgrading from 25.12 to 26.2`
- 评论: 22
- 链接: ClickHouse/ClickHouse Issue #99241

**分析**：
- 这是今天最重要的用户侧信号之一；
- 问题发生在 `ReplacingMergeTree` 场景，且是跨版本升级后的明显性能退化；
- 背后反映出用户对 **稳定升级路径、写入基准一致性、版本间性能可预测性** 的高要求。

**影响判断**：
- 若属普遍回归，将直接影响 26.2 的生产采纳节奏；
- 需要维护者尽快给出 root cause、回归范围和规避建议。

---

### 2) `plain_rewritable` + hard links 支持
- Issue: #91611 `[OPEN] Support hard links in the disks with plain_rewritable metadata`
- 评论: 11
- 链接: ClickHouse/ClickHouse Issue #91611

**分析**：
- 这是偏架构层的存储议题；
- 目标是增强 shared storage + 单写多读模式下 MergeTree 的能力；
- 体现出 ClickHouse 社区对**解耦存算、共享存储、低同步成本读扩展**的持续兴趣。

---

### 3) TCP 连接数上限与节点连接模型
- Issue: #91591 `[OPEN] TCP connection count limitations`
- 评论: 6
- 链接: ClickHouse/ClickHouse Issue #91591

**分析**：
- 这是典型的大规模部署运维问题；
- 涉及 socket tuple、端口资源、连接复用和系统级瓶颈；
- 表明用户正在把 ClickHouse 用在更高连接密度、更复杂网络拓扑下。

---

### 4) CI crash：pipeline execution 异常
- Issue: #99295 `[OPEN] [crash-ci] Exception during pipeline execution`
- 评论: 6
- 链接: ClickHouse/ClickHouse Issue #99295

**分析**：
- 属于内部质量信号；
- 如果 CI crash 长时间不收敛，会拖慢合并速度并增加回归漏检概率。

---

### 5) Npy 负 shape 导致无限循环
- Issue: #99585 `[OPEN] Npy format: negative shape dimension causes infinite loop`
- 评论: 5
- 链接: ClickHouse/ClickHouse Issue #99585

**分析**：
- 这是格式解析层的鲁棒性问题；
- 虽然看似边缘输入，但会影响 **安全性、资源耗尽防护、恶意构造文件防御**。

---

### 6) analyzer + CTE + VIEW 兼容性
- Issue: #99308 `[CLOSED] Creating a view using a CTE fails.`
- 评论: 5
- 链接: ClickHouse/ClickHouse Issue #99308

**分析**：
- 与 DBT 场景直接相关；
- 说明新 analyzer 虽然方向明确，但在复杂 SQL 工具链兼容方面仍需持续补坑。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：升级后显著性能回归
#### #99241 INSERT 查询在 26.2 比 25.12 慢 3 倍
- 状态: OPEN
- 标签: `performance`, `v26.2-affected`
- 链接: ClickHouse/ClickHouse Issue #99241
- 是否已有 fix PR: **未见明确 fix PR**

**风险**：
- 直接影响生产升级决策；
- 如果是 ReplacingMergeTree 普遍问题，范围可能较广。

---

### P1：复制/变更一致性异常
#### #100493 ReplicatedMergeTree mutation 出现 `CHECKSUM_DOESNT_MATCH`
- 状态: OPEN
- 链接: ClickHouse/ClickHouse Issue #100493
- 是否已有 fix PR: **未见明确 fix PR**

**风险**：
- 涉及副本反复 fetch part、mutation 卡住；
- 对高写入集群、UPDATE/DELETE 密集场景影响大。

---

### P1：时间语义回归
#### #100614 26.2.3 与 26.2.4 在 `session_timezone` 下同一 INSERT 产生不同 DateTime
- 状态: OPEN
- 链接: ClickHouse/ClickHouse Issue #100614
- 是否已有 fix PR: **未见明确 fix PR**

**风险**：
- 数据语义正确性问题；
- 对跨时区、审计、事件时间分析场景很敏感。

---

### P1：类型转换越界策略失效
#### #100471 `date_time_overflow_behavior='throw'` 对 Int/UInt/Float -> DateTime64/Time64 转换无效
- 状态: OPEN
- 链接: ClickHouse/ClickHouse Issue #100471
- 是否已有 fix PR: **未见明确 fix PR**

**风险**：
- 用户显式要求 `throw` 却被静默忽略，属于严重的**预期行为违背**；
- 会导致脏数据悄悄落库。

---

### P2：格式解析可能进入无限循环
#### #99585 Npy 负 shape 维度导致无限循环
- 状态: OPEN
- 链接: ClickHouse/ClickHouse Issue #99585
- 是否已有 fix PR: **未见明确 fix PR**

**风险**：
- 可能造成 CPU 持续占用；
- 属于输入校验缺失问题。

---

### P2：轻量更新相关查询失败
#### #98227 `DB::Exception: Not found column _block_number in block`
- 状态: OPEN
- 标签: `comp-lightweight-updates`
- 链接: ClickHouse/ClickHouse Issue #98227
- 是否已有 fix PR: **未见明确 fix PR**

**风险**：
- 影响 lightweight updates 场景的查询稳定性；
- 可能涉及隐藏列注入/投影规划问题。

---

### P2：Fuzz/ASan/Flaky 持续暴露内部不稳定点
- #100442 `AddressSanitizer: stack-use-after-scope`
- #100628 `Reading from materialized CTE before it has been materialized`
- #100129 flaky test: `04004_integral_col_comparison_with_float_key_condition`
- 链接: ClickHouse/ClickHouse Issue #100442 / #100628 / #100129

**说明**：
- 这类问题短期未必直接影响用户，但通常是未来线上 bug 的先兆；
- 特别是 materialized CTE 顺序问题，可能与 analyzer / planner 演进直接相关。

---

### 今日已见修复闭环的稳定性问题
#### filesystem cache IO 误判 broken part
- PR: #99386 `[CLOSED]`
- 链接: ClickHouse/ClickHouse PR #99386

#### executable 参数引号解析错误
- PR: #99794 `[CLOSED]`
- 链接: ClickHouse/ClickHouse PR #99794

#### client 权限不足退出挂起
- Issue: #99694 `[CLOSED]`
- 链接: ClickHouse/ClickHouse Issue #99694  
- 注：数据中未给出直接关联 PR，但 issue 已关闭，说明大概率已有修复或确认处置。

---

## 6. 功能请求与路线图信号

### 1) Remote Database Engine
- Issue: #59304 `[OPEN] Remote database engine`
- 链接: ClickHouse/ClickHouse Issue #59304

**信号**：
- 这是一个长期 feature / warmup task；
- 目标是像 MySQL / PostgreSQL engine 一样挂载远端 ClickHouse 数据库；
- 如果推进，将明显增强多集群管理与跨实例透明访问能力。

**纳入版本概率**：
- 中长期方向，短期落地概率一般，但战略意义高。

---

### 2) SQL 标准兼容模式
- Issue: #98600 `[OPEN] Add a setting that makes ClickHouse compatible with the SQL standard`
- 链接: ClickHouse/ClickHouse Issue #98600

**信号**：
- 反映企业用户和迁移用户希望有“一键兼容模式”；
- 如果配合 analyzer、函数行为统一、NULL/group by 语义整合，可能成为后续版本亮点。

---

### 3) `url()` / URL Engine 通配符支持
- PR: #95181 `[OPEN] Support wildcard for url table function`
- 链接: ClickHouse/ClickHouse PR #95181

**判断**：
- 这是典型用户价值高、实现边界相对清晰的功能；
- **较可能进入下一阶段版本**。

---

### 4) Arrow Flight SQL 支持
- PR: #91170 `[OPEN] Add Arrow Flight SQL support`
- 链接: ClickHouse/ClickHouse PR #91170

**信号**：
- 对 BI/高性能数据互联/标准接口生态非常重要；
- 一旦合入，将强化 ClickHouse 在现代分析接口层的竞争力。

---

### 5) Azure + Delta Kernel DataLake 支持
- PR: #86892 `[OPEN] Support DataLake on top of Azure with Delta Kernel`
- 链接: ClickHouse/ClickHouse PR #86892

**信号**：
- 表明 DataLake 接入正在向多云扩展；
- 对企业湖仓一体化场景是明显加分项。

---

### 6) Catalog 健康检查语句
- PR: #94690 `[OPEN] Add new query CHECK DATABASE for Catalog`
- 链接: ClickHouse/ClickHouse PR #94690

**判断**：
- 与 DataLakeCatalog 生态直接相关；
- 这类运维治理能力通常会优先落地，因为用户价值明确。

---

### 7) Postgres 协议兼容增强（支持 C# 客户端）
- PR: #80785 `[OPEN] Support C# client in postgres protocol`
- 链接: ClickHouse/ClickHouse PR #80785

**信号**：
- 说明 ClickHouse 在“借助 Postgres wire protocol 拓展客户端兼容面”这条路线仍在推进；
- 若落地，将显著改善 .NET 生态接入体验。

---

## 7. 用户反馈摘要

基于今日 issue/PR 信息，可归纳出几类真实用户痛点：

### 升级可预测性仍是头号诉求
- 26.2 的 INSERT 性能回归、26.2.3/26.2.4 的 DateTime 行为差异，说明用户最在意的不是新功能本身，而是**升级后性能和语义能否稳定复现**。
- 相关链接：#99241, #100614

### 企业用户越来越依赖复杂部署拓扑
- shared storage、hard links、filesystem cache、S3、ReplicatedMergeTree、Catalog、DataLake 的相关讨论都说明，用户场景已超越单机 OLAP，进入**云对象存储、多副本、多协议、多引擎互联**阶段。
- 相关链接：#91611, #100493, #86892, #94690, #99386

### SQL 兼容与生态接入需求在增强
- analyzer + DBT 的兼容性、Postgres 协议对 C# 客户端支持、SQL 标准兼容模式、Arrow Flight SQL，表明用户希望 ClickHouse 不仅“快”，还要**更容易接入现有工具链**。
- 相关链接：#99308, #80785, #98600, #91170

### 可观测性与调优工具需求提升
- skip index 使用日志、predicate statistics log、obfuscateQuery 的推进说明，用户和维护者都需要更强的**调优、审计、问题复现与支持工具**。
- 相关链接：#99793, #98727, #98305

---

## 8. 待处理积压

以下为值得维护者持续关注的长期或重要积压项：

### 1) #91611 `plain_rewritable` 元数据下支持 hard links
- 状态: OPEN
- 创建时间: 2025-12-06
- 链接: ClickHouse/ClickHouse Issue #91611

**原因**：
- 这是 shared storage 架构能力的重要拼图；
- 技术价值高，且已有持续讨论。

---

### 2) #91591 TCP connection count limitations
- 状态: OPEN
- 创建时间: 2025-12-05
- 链接: ClickHouse/ClickHouse Issue #91591

**原因**：
- 关系到大规模部署上限；
- 虽不一定是代码 bug，但需要文档、配置建议或架构层缓解方案。

---

### 3) #59304 `Remote` database engine
- 状态: OPEN
- 创建时间: 2024-01-28
- 链接: ClickHouse/ClickHouse Issue #59304

**原因**：
- 长期路线型需求；
- 若长期无人推进，建议给出设计边界或 roadmap 定位。

---

### 4) #59832 `-Sparkbar` 聚合函数组合子
- 状态: OPEN
- 创建时间: 2024-02-10
- 链接: ClickHouse/ClickHouse Issue #59832

**原因**：
- 需求虽非核心，但属于低门槛增强项；
- 适合作为社区贡献入口。

---

### 5) #96407 `port_offset` 配置参数
- 状态: OPEN
- 创建时间: 2026-02-08
- 链接: ClickHouse/ClickHouse Issue #96407

**原因**：
- 对测试、多实例本地开发非常实用；
- 实现成本可能不高，适合尽快定性。

---

### 6) #80785 Postgres 协议支持 C# 客户端
- 状态: OPEN PR
- 创建时间: 2025-05-25
- 链接: ClickHouse/ClickHouse PR #80785

**原因**：
- 挂得较久，说明兼容细节复杂；
- 但生态价值高，建议维护者明确 review 优先级。

---

### 7) #91170 Arrow Flight SQL
- 状态: OPEN PR
- 创建时间: 2025-12-01
- 链接: ClickHouse/ClickHouse PR #91170

**原因**：
- 战略价值高；
- 若评审周期过长，建议拆分功能分阶段合入。

---

## 附：今日重点链接清单

- Release: `v25.12.9.61-stable`
- 性能回归: ClickHouse/ClickHouse Issue #99241
- shared storage/hard links: ClickHouse/ClickHouse Issue #91611
- TCP 连接限制: ClickHouse/ClickHouse Issue #91591
- Npy 无限循环: ClickHouse/ClickHouse Issue #99585
- DateTime 时区回归: ClickHouse/ClickHouse Issue #100614
- Mutation checksum 异常: ClickHouse/ClickHouse Issue #100493
- `obfuscateQuery` 功能完成: ClickHouse/ClickHouse PR #98305
- executable 参数解析修复: ClickHouse/ClickHouse PR #99794
- filesystem cache 误判损坏修复: ClickHouse/ClickHouse PR #99386
- skip index 查询日志: ClickHouse/ClickHouse PR #99793
- predicate statistics log: ClickHouse/ClickHouse PR #98727
- Arrow Flight SQL: ClickHouse/ClickHouse PR #91170
- Azure Delta Kernel DataLake: ClickHouse/ClickHouse PR #86892

如果你愿意，我还可以继续把这份日报整理成：
1. **适合发飞书/Slack 的 10 行简报版**，或  
2. **面向 CTO/架构师的风险清单版**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-03-25）

## 1. 今日速览

过去 24 小时 DuckDB 保持高活跃：Issues 更新 21 条、PR 更新 39 条，说明社区反馈与核心开发都非常密集。  
从内容看，当前工作重心明显落在 **v1.5.x 稳定性修复、回归问题处理、Windows/CLI 兼容性、以及执行器/绑定器内部重构**。  
值得注意的是，今天出现了多条 **Internal Error、Segfault、错误结果** 级别的问题报告，部分已经快速对应到修复 PR，表明项目响应速度较快，但也反映出新版本引入的边缘场景回归压力较大。  
整体健康度判断：**活跃且响应迅速，但稳定性风险较前一阶段上升，短期内应继续优先消化 1.5.x 回归与 correctness 问题。**

---

## 3. 项目进展

> 今日无新 Release。以下重点关注已关闭/已推进的 PR 与其代表的引擎进展。

### 3.1 查询引擎与存储路径修复持续推进

- **简化 checkpoint 期间 row group 选择逻辑**
  - PR: #21574（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21574
  - 说明：该 PR 针对 checkpoint 过程中允许 append 后的 row group 选择做了简化，核心是提升 checkpoint 一致性逻辑的可维护性，减少“边 checkpoint 边追加”场景下遗漏/跳过 row group 的复杂度。
  - 影响：这类修改偏底层存储引擎维护性，对持久化一致性和后续 checkpoint 演进是正向信号。

- **修复 CSV 读取器 buffer 边界读取问题**
  - PR: #21577（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21577
  - 说明：CSV reader 的 buffer-boundary 读值修复，属于典型输入解析边界 bug。
  - 影响：直接关系到文件导入稳定性，尤其是大文件、特殊行边界、流式读取场景。

- **ASOF JOIN 空右表修复进入 v1.5 分支**
  - PR: #21553（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21553
  - 说明：面向 `v1.5-variegata` 的定向修复，处理 ASOF join 在右表为空时的问题。
  - 影响：这是典型 SQL 语义正确性修复，说明维护者正在持续回填 1.5 分支上的 join correctness 问题。

### 3.2 构建、发布与生态集成改进

- **修复 GCC reconfigure 编译 flag 生效问题**
  - PR: #21376（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21376
  - 说明：修复 `EXTENSION_STATIC_BUILD` 检测时机，避免 GCC 编译参数只在二次 CMake reconfigure 后才正确生效。
  - 影响：提升构建链可靠性，尤其对扩展静态编译、打包构建有帮助。

- **CI / 发布流水线提速**
  - PR: #21575（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21575
  - 说明：扩展 job 复用 Linux build，并借助 pigz 加速 artifact 压缩。
  - 影响：虽非用户功能，但能缩短发布与验证周期，利好高频补丁发布。

- **Julia 生态版本对齐**
  - PR: #21588（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21588
- **Julia 1.4 分支补齐版本 bump**
  - PR: #21589（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/pull/21589
  - 说明：完成 Julia 生态包版本同步，反映 DuckDB 多语言客户端维护仍在稳步推进。

### 3.3 仍在推进中的核心重构与优化 PR

- **Window Function 绑定器重构**
  - PR: #21562（OPEN, Ready For Review）  
  - 链接: https://github.com/duckdb/duckdb/pull/21562
  - 说明：将窗口函数绑定逻辑从 `TransformFuncCall` 下沉到 `BindWindow`，并重整 `LEAD/LAG`、`IGNORE/RESPECT NULLS` 等绑定路径。
  - 意义：这是典型的查询编译前端重构，预示着后续窗口函数语义一致性、错误提示质量和扩展能力都会提高。

- **InsertStatement 向 QueryNode 模型统一**
  - PR: #21596（OPEN）  
  - 链接: https://github.com/duckdb/duckdb/pull/21596
  - 说明：将 `InsertStatement` 重构为 `InsertQueryNode` 薄包装，与 Delete 路径对齐。
  - 意义：这是 AST / binder / planner 内部架构统一的信号，有助于后续 `INSERT ... RETURNING`、冲突处理和序列化维护。

- **Vector 数据移动到 VectorBuffer**
  - PR: #21597（OPEN）  
  - 链接: https://github.com/duckdb/duckdb/pull/21597
  - 说明：调整 `Vector` 持有 `data_ptr_t` 的方式，把数据承载迁移到 `VectorBuffer`。
  - 意义：这是执行引擎内存模型的重要整理，尤其影响 dictionary vector、array/struct vector 等复杂向量类型的表示与后续优化空间。

---

## 4. 社区热点

### 热点一：`date_part` 统计传播 off-by-one，已出现重复修复 PR
- Issue: #21478  
  链接: https://github.com/duckdb/duckdb/issues/21478
- PR: #21558  
  链接: https://github.com/duckdb/duckdb/pull/21558
- PR: #21606  
  链接: https://github.com/duckdb/duckdb/pull/21606

**分析：**  
这是今天最典型的“社区发现 -> 快速提 PR”案例。问题本身不是结果错误，而是 **统计上界比真实返回值大 1**，会导致优化器无法把诸如 `extract(week from d) = 54` 这样的不可能条件提前裁剪成 `EMPTY_RESULT`。  
背后的技术诉求是：用户越来越在意 DuckDB 的 **统计传播精度、过滤剪枝能力和优化器可证明性**，这说明项目用户已经不只关注“能跑”，而开始深度使用 DuckDB 的分析优化能力。

### 热点二：Windows CLI 显示异常连续出现
- Issue: #21585  
  链接: https://github.com/duckdb/duckdb/issues/21585
- Issue: #21571  
  链接: https://github.com/duckdb/duckdb/issues/21571
- PR: #21552  
  链接: https://github.com/duckdb/duckdb/pull/21552

**分析：**  
两条 issue 都指向 Windows 11 下 CLI 提示符/字符显示异常，尤其在 CMD、PowerShell、管理员模式中表现不稳定，而 Windows Terminal 下相对正常。  
这反映出 DuckDB CLI 在跨终端兼容性上仍有细节问题，用户诉求集中于 **原生命令行体验一致性**，对数据工具而言这会直接影响入门体验与脚本交互可用性。

### 热点三：窗口优化器引发错误结果，正确性优先级高
- Issue: #21592  
  链接: https://github.com/duckdb/duckdb/issues/21592

**分析：**  
`WindowSelfJoinOptimizer` 在 `ROWS` frame 下把窗口聚合错误替换成 `GROUP BY + INNER JOIN`，属于 **incorrect results**。  
这类问题比 crash 更敏感，因为它可能静默返回错误答案。它显示 DuckDB 在推进激进优化时，需要进一步强化 frame 语义约束和 regression coverage。

---

## 5. Bug 与稳定性

> 按严重程度排序，优先关注“错误结果 / 崩溃 / 数据损坏风险 / 回归”。

### P0 / 正确性问题

1. **WindowSelfJoinOptimizer 在 `ROWS` frame 下产生错误结果**
   - Issue: #21592  
   - 链接: https://github.com/duckdb/duckdb/issues/21592
   - 状态：OPEN
   - 影响：查询结果错误，且可能静默发生。
   - 说明：优化器缺少对 frame 是否为 full-partition 常量窗口的检查。
   - Fix PR：**暂未看到直接修复 PR**

2. **`date_part` 统计传播上界 off-by-one，导致优化器无法剪枝**
   - Issue: #21478  
   - 链接: https://github.com/duckdb/duckdb/issues/21478
   - PR: #21558 / #21606  
   - 链接: https://github.com/duckdb/duckdb/pull/21558 / https://github.com/duckdb/duckdb/pull/21606
   - 状态：Issue OPEN，已有两个修复 PR
   - 影响：主要是优化器保守，通常不致错答，但会损失剪枝与计划质量。

### P1 / 崩溃、Internal Error、数据库失效风险

3. **CHECKPOINT 在固定大小 ARRAY 列上崩溃，并可能导致数据库 invalidated**
   - Issue: #21601  
   - 链接: https://github.com/duckdb/duckdb/issues/21601
   - 状态：OPEN
   - 影响：高。涉及持久化路径、`FLOAT[256]` / `INTEGER[16]` 等 fixed-size ARRAY，并且 crash 后数据库需重启恢复。
   - Fix PR：**暂无**

4. **复杂 CTE 链在 v1.5.1 出现 Internal Error（疑似回归）**
   - Issue: #21604  
   - 链接: https://github.com/duckdb/duckdb/issues/21604
   - 状态：OPEN
   - 影响：高。涉及 Python API、CTE、窗口函数、UNION ALL、LEFT JOIN 组合查询。
   - Fix PR：**暂无**
   - 备注：报告者明确指出同脚本在旧版本正常，属于回归信号。

5. **宏 + CTE 引发 “Could not find CTE definition” Internal Error**
   - Issue: #21582  
   - 链接: https://github.com/duckdb/duckdb/issues/21582
   - 状态：OPEN
   - 影响：高。表明 binder / planner 在宏展开与 CTE 作用域交互处可能存在缺陷。
   - Fix PR：**暂无**

6. **JSON 转 Variant 触发 Internal Error**
   - Issue: #21352  
   - 链接: https://github.com/duckdb/duckdb/issues/21352
   - 状态：OPEN
   - 影响：高。涉及新 variant 编码链路。
   - Fix PR：**暂无**
   - 备注：说明 Variant 功能仍在打磨期。

7. **PyInstaller 打包 Windows 可执行中 `LOAD motherduck` 触发访问违规**
   - Issue: #21602  
   - 链接: https://github.com/duckdb/duckdb/issues/21602
   - 状态：OPEN
   - 影响：高。1.4.2/1.4.4 正常、1.5.0/1.5.1 崩溃，明显回归。
   - Fix PR：**暂无**

8. **ADBC error path heap-use-after-free**
   - Issue: #21584  
   - 链接: https://github.com/duckdb/duckdb/issues/21584
   - PR: #21605  
   - 链接: https://github.com/duckdb/duckdb/pull/21605
   - 状态：Issue OPEN，已有修复 PR
   - 影响：高。客户端接入层在错误处理时可能 segfault。

9. **ArrowBuffer 因未检查 malloc/realloc 返回值导致 segfault**
   - Issue: #21593  
   - 链接: https://github.com/duckdb/duckdb/issues/21593
   - PR: #21594  
   - 链接: https://github.com/duckdb/duckdb/pull/21594
   - 状态：Issue OPEN，已有修复 PR
   - 影响：高。内存压力下可能触发 null 指针路径，属于健壮性缺陷。

### P2 / 功能异常、兼容性问题

10. **`COPY TO` 使用参数化输出文件名时报文件创建错误**
    - Issue: #21578  
    - 链接: https://github.com/duckdb/duckdb/issues/21578
    - 状态：OPEN
    - 影响：中。影响 prepared statement 场景下的导出自动化。

11. **`UNNEST(..., recursive:=true)` 未完全展开 `integer[3][3]`**
    - Issue: #21506  
    - 链接: https://github.com/duckdb/duckdb/issues/21506
    - 状态：OPEN
    - 影响：中。影响嵌套数组语义一致性。

12. **`FileSystem::CanonicalizePath` 破坏 duckdb-wasm 的 `opfs://` 路径**
    - Issue: #21603  
    - 链接: https://github.com/duckdb/duckdb/issues/21603
    - 状态：OPEN
    - 影响：中。影响浏览器端 wasm + OPFS 存储场景。

13. **Windows 11 CLI 提示符显示异常/乱码**
    - Issue: #21585  
    - 链接: https://github.com/duckdb/duckdb/issues/21585
    - Issue: #21571  
    - 链接: https://github.com/duckdb/duckdb/issues/21571
    - 状态：OPEN
    - 影响：中。主要是交互体验问题，但用户感知强。

14. **`httpfs` 调 OpenAI API 返回 HTTP 0 / Internal Server Error**
    - Issue: #21583  
    - 链接: https://github.com/duckdb/duckdb/issues/21583
    - 状态：OPEN
    - 影响：中。扩展作为 HTTP 客户端的兼容性问题，可能涉及 header、TLS、chunking 或请求构造。

15. **`describe` 语句不支持 markdown output mode**
    - Issue: #21579  
    - 链接: https://github.com/duckdb/duckdb/issues/21579
    - 状态：OPEN
    - 影响：低到中。偏 CLI 输出一致性。

### 已关闭问题

- **C API 重复持久化 insert 的内存泄漏**
  - Issue: #21539（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/issues/21539
  - 说明：虽然详情未展开，但问题已进入关闭状态，说明维护者已完成审查或处理。

- **riscv64 发布二进制与 Python wheel 请求**
  - Issue: #21494（已关闭）  
  - 链接: https://github.com/duckdb/duckdb/issues/21494

---

## 6. 功能请求与路线图信号

### 6.1 riscv64 预编译产物诉求出现，但短期未必落地
- Issue: #21494（已关闭）  
- 链接: https://github.com/duckdb/duckdb/issues/21494

用户希望官方发布 `linux/riscv64` 二进制与 Python wheel。该需求被提出并给出“已可在原生硬件运行”的证据，说明 DuckDB 已被更广泛地部署到新兴 CPU 架构。  
不过 issue 已关闭，且当天没有看到配套构建 PR，判断为：**需求被知晓，但短期尚未进入正式发布矩阵。**

### 6.2 Parquet MAP 列 row-group skipping 仍是重要性能方向
- PR: #21375（OPEN, Merge Conflict）  
- 链接: https://github.com/duckdb/duckdb/pull/21375

这不是当天新提需求，但它是很强的路线图信号：  
DuckDB 正在继续强化 **Parquet reader 的统计利用与 row-group pruning**，并逐步覆盖更复杂的嵌套类型（MAP）。如果该 PR 后续解决冲突并合入，将明显提升复杂 Parquet 模式下的扫描性能。

### 6.3 checkpoint 行为可配置化增强
- PR: #21570（OPEN）  
- 链接: https://github.com/duckdb/duckdb/pull/21570

新增 `checkpoint_on_detach` 三值设置，是对数据库生命周期管理的可控性增强。  
这类特性通常服务于嵌入式/多数据库 attach-detach 场景，说明项目在持续增强 **事务落盘策略与会话级行为控制**。

### 6.4 SQL / 绑定层重构信号明显
- PR: #21562  
- 链接: https://github.com/duckdb/duckdb/pull/21562
- PR: #21596  
- 链接: https://github.com/duckdb/duckdb/pull/21596

这两条 PR 虽不是“新函数/新语法”，但表明维护者正在为更复杂 SQL 语义、错误校验和 planner 扩展打基础。  
判断：**这些内部重构非常可能在下一轮版本中转化为更稳的窗口函数支持、更一致的 INSERT/RETURNING/ON CONFLICT 行为。**

---

## 7. 用户反馈摘要

### 7.1 用户对“错误结果”和“回归”高度敏感
像 #21592、#21604、#21602 这类问题都明确指出 **版本回归** 或 **结果不正确**。这说明 DuckDB 已广泛进入生产/半生产分析链路，用户不仅测试功能，还在对比不同版本行为一致性。

### 7.2 Windows 终端体验仍是明显短板
- #21585: https://github.com/duckdb/duckdb/issues/21585
- #21571: https://github.com/duckdb/duckdb/issues/21571

多个独立用户在 Windows 11、CMD、PowerShell、管理员模式下报告 CLI 提示符乱码/错位/随机字符，说明问题不是个别环境。  
用户真实痛点不是 SQL 本身，而是 **CLI 首屏和交互体验影响使用信心**。

### 7.3 DuckDB 正被用于更复杂嵌入式与打包场景
- PyInstaller + MotherDuck：#21602  
- ADBC 客户端：#21584  
- duckdb-wasm + OPFS：#21603  
- `httpfs` 直接调用 API：#21583

这批 issue 说明 DuckDB 的使用边界正在快速外扩：不仅是本地 SQL 引擎，还进入 Python 打包程序、浏览器持久化、数据库互联、HTTP API 工作流。  
对项目而言，这意味着 **核心引擎之外的“宿主环境兼容性”正在成为稳定性重点。**

### 7.4 用户越来越关注优化器细节，而不只是功能可用
- `date_part` 统计传播：#21478  
- Parquet MAP row-group skipping：#21375  

这类反馈说明高级用户已经深入关注 DuckDB 的执行计划质量、统计传播精度和扫描剪枝收益，项目技术形象正从“轻量 SQL 引擎”进一步走向“严肃 OLAP 优化器”。

---

## 8. 待处理积压

### 8.1 长期未解决的类型转换缺口
- Issue: #16679  
- 链接: https://github.com/duckdb/duckdb/issues/16679

`'0x0'::UINT128` 不支持，而更小位宽 UINT 支持 hex 转换。该问题创建于 2025-03-16，现标记为 `reproduced, stale`。  
这属于 SQL 类型系统一致性问题，虽然不算高优先级，但长期悬而未决会影响用户对数值类型完整性的预期。建议维护者确认是否接受该语义并明确路线。

### 8.2 Parquet MAP 列剪枝优化 PR 长时间未合并
- PR: #21375  
- 链接: https://github.com/duckdb/duckdb/pull/21375

该 PR 具备明确性能价值，但目前处于 merge conflict。建议尽快决定是否继续推进，因为这类读取优化对大规模分析场景收益明确。

### 8.3 Variant 相关稳定性仍需持续关注
- Issue: #21352  
- 链接: https://github.com/duckdb/duckdb/issues/21352

JSON 转 Variant 的 Internal Error 说明新编码路径尚未完全稳定。考虑到 Variant 通常与半结构化数据场景强相关，建议将其纳入近期回归测试重点。

---

## 附：值得维护者优先关注的清单

1. **#21592 错误结果问题**  
   https://github.com/duckdb/duckdb/issues/21592

2. **#21601 CHECKPOINT + fixed-size ARRAY 崩溃**  
   https://github.com/duckdb/duckdb/issues/21601

3. **#21604 v1.5.1 复杂 CTE 回归 Internal Error**  
   https://github.com/duckdb/duckdb/issues/21604

4. **#21602 Windows PyInstaller + motherduck 崩溃回归**  
   https://github.com/duckdb/duckdb/issues/21602

5. **#21584 / #21605 ADBC use-after-free 已有修复待推进**  
   https://github.com/duckdb/duckdb/issues/21584  
   https://github.com/duckdb/duckdb/pull/21605

6. **#21593 / #21594 ArrowBuffer 内存分配失败处理已有修复待审**  
   https://github.com/duckdb/duckdb/issues/21593  
   https://github.com/duckdb/duckdb/pull/21594

---

如果你愿意，我还可以继续把这份日报再整理成更适合团队内部同步的 **“管理层摘要版”** 或 **“研发跟进清单版”**。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-25）

## 1. 今日速览

过去 24 小时内，StarRocks 保持了很高的开发活跃度：**Issues 更新 14 条、PR 更新 116 条**，其中 **73 条 PR 已合并或关闭**，说明维护团队处理节奏较快。  
今日没有新版本发布，但从 PR 与 Issue 走势看，项目当前重点仍集中在 **外部 Catalog 兼容性、共享存储/存算分离场景稳定性、文档体系整理，以及 Python/Superset 生态适配**。  
问题层面，**Paimon、Iceberg、Azure Data Lake、时区转换、Warehouse/CN 调度**仍是高频区域，说明 StarRocks 在扩展湖仓与多计算资源场景下持续暴露边界问题。  
整体健康度评价为：**活跃且修复响应较快，但复杂外部生态兼容性仍是稳定性主战场**。

---

## 3. 项目进展

### 3.1 今日已关闭/合并的重要修复与推进

#### 1）修复 query-scope warehouse hint 污染 ConnectContext 的问题
- PR: #70706 `[BugFix] Fix query-scope warehouse hint leaking ComputeResource in ConnectContext`  
- 状态：已关闭/已合并  
- 链接：StarRocks/starrocks PR #70706

该修复针对使用查询级 warehouse hint（如 `/*+ SET_VAR(warehouse='...') */`）后，`ConnectContext.computeResource` 被错误保留的问题。  
这类问题会影响 **多 warehouse / 存算分离环境下的查询路由正确性**，属于会在生产环境中引发“后续请求跑错仓”的隐性状态污染问题。  
从影响面看，这一修复强化了 **查询执行上下文隔离**，对多租户与弹性计算资源场景尤为关键。

相关 backport/自动回补 PR：
- #70730（4.0.9 backport）  
- #70732（automerge backport）  
链接：StarRocks/starrocks PR #70730 / #70732

---

#### 2）Paimon 相关一组问题在今日关闭，外部 Catalog 兼容性明显推进
今日关闭的多个 Issue 都集中在 **Paimon catalog 的元数据解析与权限/统计信息处理**：

- #70185 `[Bug][paimon] DESCRIBE / SHOW CREATE TABLE fails to identify Primary Key for Paimon Primary Key tables in StarRocks 3.3.20`  
- #70223 `[Bug] Paimon catalog refresh crashes with ClassCastException on ObjectTable`  
- #70282 `[Bug] Paimon column statistics uses nullCount as averageRowSize instead of avgLen`  
- #70255 `[Bug] CREATE VIEW on Paimon catalog fails on Follower FE due to Ranger permission check`

这些问题覆盖了：
- **主键表元数据展示错误**
- **catalog refresh 后台线程崩溃**
- **列统计信息错误影响优化器**
- **Follower FE 权限校验不一致**

这表明 StarRocks 正持续补齐对 **Paimon 外表查询、元数据管理、优化器统计、权限集成** 的企业级可用性。  
对使用外部数据湖作为主存储的用户而言，这类修复比单点功能新增更重要，因为它直接影响 **可运维性与查询计划质量**。

相关链接：
- StarRocks/starrocks Issue #70185  
- StarRocks/starrocks Issue #70223  
- StarRocks/starrocks Issue #70282  
- StarRocks/starrocks Issue #70255

---

#### 3）Azure Data Lake 上 parquet 查询段错误问题已关闭
- Issue: #70478 `[type/bug] Segmentation Fault when trying to query data from parquet file on azure datalake storage`
- 状态：已关闭  
- 链接：StarRocks/starrocks Issue #70478

这是一个较高优先级稳定性问题：执行 `FILES()` 访问 ADLS parquet 时直接触发 **Segmentation Fault**。  
虽然当前数据未直接给出关联修复 PR，但问题在 24 小时内关闭，说明维护者已有修复或确认处理。  
这对云上 lakehouse 接入用户非常关键，因为其属于 **“一条 SQL 即可触发进程级崩溃”** 的稳定性事故。

---

#### 4）UnionConstSourceOperator 大 VARCHAR 复制触发 SIGSEGV 的问题已关闭
- Issue: #68656 `[Bug] SIGSEGV in UnionConstSourceOperator when replicating large VARCHAR columns`
- 状态：已关闭  
- 链接：StarRocks/starrocks Issue #68656

该问题聚焦于超大 VARCHAR 列场景下执行引擎的稳定性，属于 **执行层内存/对象复制路径** 的边界缺陷。  
问题关闭说明对大字段场景的健壮性正在增强，尤其适用于日志、文本、半结构化宽字符串载荷业务。

---

#### 5）文档体系持续整理：BE Config 文档拆分与导航优化
- PR: #70702 `[Doc] Separate BE Config Docs` 已关闭  
- PR: #70737 `[Doc] Add BE Config Sidebar` 打开中  
- PR: #70736 `[Doc] missing slash` 打开中  
- PR: #70708 `[Doc] add hadoop wildfly native ssl FAQ` 打开中  

链接：
- StarRocks/starrocks PR #70702
- StarRocks/starrocks PR #70737
- StarRocks/starrocks PR #70736
- StarRocks/starrocks PR #70708

虽然这类变更不直接改变引擎行为，但能明显改善：
- **BE 参数可发现性**
- **版本分支文档一致性**
- **Hadoop/SSL 集成 FAQ 可操作性**

从多个 backport PR 同步到 3.4/3.5/4.0/4.1 分支来看，文档维护正在走向更规范化。

---

## 4. 社区热点

### 热点 1：Iceberg 百万级分区导致 FE OOM
- Issue: #67760  
- 标题：`FE OOM due to partitionCache loading all partitions eagerly for Iceberg tables with millions of partitions`
- 链接：StarRocks/starrocks Issue #67760

这是今天最值得关注的开放问题之一。用户反馈 FE 在 40 GB Pod、24 GB JVM 内存配置下，面对 **拥有数百万分区的 Iceberg 表** 时发生 OOM，核心原因是 `partitionCache` 采用了**全量 eager loading**。  
背后的技术诉求非常明确：  
1. 外部表元数据加载必须支持 **懒加载/按需加载**  
2. FE 内存模型需要适配 **超大规模 Iceberg catalog**  
3. 查询规划与元数据缓存之间需要更精细的隔离和回收机制

这说明 StarRocks 在向大规模数据湖元数据场景扩张时，**FE 元数据面** 仍有明显优化空间。

---

### 热点 2：Paimon catalog 刷新 ClassCastException
- Issue: #70719  
- 标题：`[Paimon] ClassCastException in ConnectorTableMetadataProcessor when refreshing Paimon catalog`
- 链接：StarRocks/starrocks Issue #70719

该问题是今日新增且与已关闭的 #70223 高度相关，说明 **Paimon catalog refresh 崩溃并非单点问题，而是对象类型分支覆盖不足的系列问题**。  
技术诉求包括：
- 对 Paimon 各表类型进行更完整的多态处理
- 后台 refresh daemon 的异常隔离
- catalog 级故障不能拖垮整个元数据刷新链路

---

### 热点 3：Python SQLAlchemy dialect 影响 Superset 数据集创建
- Issue: #70733  
- PR: #70734  
- 链接：StarRocks/starrocks Issue #70733 / PR #70734

这是典型的生态适配问题：`ReflectedPartitionInfo` 不可 hash，导致 **Superset 接入 StarRocks 方言创建数据集失败**。  
好消息是该问题 **当天即有修复 PR**（#70734），显示维护者对 BI 生态兼容问题响应很快。  
背后的信号是：StarRocks 不只是修内核，也在持续打磨 **Python connector / SQLAlchemy / BI 工具链** 的可用性。

---

### 热点 4：多 CN 节点 tablet 分布倾斜
- Issue: #70717  
- 标题：`Some table tablets are concentrated on two CN nodes, causing load skew`
- 链接：StarRocks/starrocks Issue #70717

该问题出现在 **存算分离 + multi-warehouse + CN 日常迁移调度** 场景中。  
用户描述了凌晨与早晨之间将 CN 在 warehouse 间移动后，tablet 分布失衡并产生负载倾斜。  
这说明在弹性调度场景下，StarRocks 仍需提升：
- tablet 迁移/重平衡策略
- CN 迁移后的拓扑感知
- warehouse 资源切换后的数据局部性恢复

这类问题对线上性能抖动影响很直接，值得持续跟踪。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高危

#### 1）FE OOM：Iceberg 百万分区元数据全量加载
- Issue: #67760  
- 状态：OPEN  
- 是否已有 fix PR：**暂无明确关联 PR**  
- 链接：StarRocks/starrocks Issue #67760

影响 FE 可用性，且属于**大规模 Iceberg 用户的架构性瓶颈**。如果不引入懒加载或缓存上限控制，问题可能持续存在。

---

#### 2）Azure Data Lake parquet 查询触发 Segmentation Fault
- Issue: #70478  
- 状态：CLOSED  
- 是否已有 fix PR：**数据中未显示，疑似已修复或已确认处理**  
- 链接：StarRocks/starrocks Issue #70478

进程级崩溃问题，严重性高。建议后续补充关联修复 PR 和回归测试覆盖情况。

---

#### 3）大 VARCHAR 复制触发 SIGSEGV
- Issue: #68656  
- 状态：CLOSED  
- 是否已有 fix PR：**未显示**  
- 链接：StarRocks/starrocks Issue #68656

属于执行引擎边界内存问题，虽然已关闭，但建议继续观察是否会在宽列导入、UNION 常量源、复制算子中复发。

---

### P1 / 重要

#### 4）`CONVERT_TZ` 在 Africa/Casablanca / Africa/El_Aaiun 上返回 NULL
- Issue: #70671  
- 状态：OPEN  
- 是否已有 fix PR：**暂无**  
- 链接：StarRocks/starrocks Issue #70671

问题表现为：
- FE 常量折叠路径正常
- BE 列值执行路径返回 NULL

这意味着存在 **FE/BE 时区解析行为不一致**，可能影响 SQL 正确性。  
特别是涉及时区报表、国际化分析与历史时间换算时，属于用户可感知的结果错误。

---

#### 5）Paimon catalog refresh 再现 ClassCastException
- Issue: #70719  
- 状态：OPEN  
- 是否已有 fix PR：**暂无，但与已关闭 #70223 高相关**  
- 链接：StarRocks/starrocks Issue #70719

说明此前修复可能未覆盖全部 Paimon 表类型，属于**相似缺陷族**，需要补齐更系统的类型判定和测试。

---

#### 6）CN 节点 tablet 集中导致负载倾斜
- Issue: #70717  
- 状态：OPEN  
- 是否已有 fix PR：暂无  
- 链接：StarRocks/starrocks Issue #70717

这类问题不一定导致错误结果，但会引发：
- 查询尾延迟升高
- load/query 仓资源利用不均
- 存算分离场景扩缩容收益下降

---

### P2 / 生态兼容

#### 7）Python SQLAlchemy dialect 导致 Superset 创建数据集失败
- Issue: #70733  
- Fix PR: #70734  
- 状态：Issue OPEN，PR OPEN  
- 链接：StarRocks/starrocks Issue #70733 / PR #70734

这是典型的外围生态兼容问题，影响范围主要在 BI 接入层。  
优点是修复响应快，预计较快合入。

---

#### 8）重启后 generic aggregate states + MV 插入报错
- Issue: #63885  
- 状态：OPEN  
- 是否已有 fix PR：暂无  
- 链接：StarRocks/starrocks Issue #63885

该问题涉及 **物化视图与泛型聚合状态持久化/恢复**，属于较深层次状态恢复问题。  
虽然非今日新建，但今日仍活跃，值得关注其是否影响生产升级与重启恢复流程。

---

## 6. 功能请求与路线图信号

### 1）FE leader 安全切换
- Issue: #63357 `[type/enhancement] FE leader safely transfer`
- 链接：StarRocks/starrocks Issue #63357

这是一个很有代表性的运维增强需求。当前用户痛点在于：**leader transfer 后旧 leader 需要强制退出**，不够平滑。  
该需求反映企业用户对：
- 高可用切主体验
- 管控面无损切换
- DBA 友好的运维操作

有明显诉求。  
从价值判断看，这类需求很可能在未来版本中被纳入，因为它直接影响金融、政企、关键业务场景的可运维性。

---

### 2）支持修复 cloud-native table 丢失文件
- Issue: #66015  
- 状态：已关闭  
- 链接：StarRocks/starrocks Issue #66015

该增强需求已关闭，说明 **shared-data 模式下的 repair table / 回滚恢复能力** 正在被纳入产品能力。  
这是非常强的路线图信号：项目正逐渐补齐云原生单副本表在异常文件丢失下的恢复工具链。

---

### 3）支持创建 Hive External Table
- PR: #42757 `[Feature] support create hive external table`
- 状态：OPEN，长期存在  
- 链接：StarRocks/starrocks PR #42757

这是较早提出但仍未完成的功能 PR，表明社区一直有诉求希望 StarRocks 不仅“读 Hive”，还能够直接进行 **Hive 外表创建管理**。  
若该功能最终落地，将增强 StarRocks 在湖仓编排中的“入口角色”。

---

### 4）Iceberg REST Catalog OAuth2 认证修复
- PR: #61748  
- 标题：`fix: resolve OAuth2 scope parameter duplication in Iceberg REST catalog authentication`
- 链接：StarRocks/starrocks PR #61748

虽然标题是 bugfix，但本质上释放了一个明显信号：  
StarRocks 正在完善对 **现代 Iceberg REST Catalog + OAuth2** 的企业级接入支持，尤其是 Polaris 一类服务。  
这与 #67760 一起看，说明 Iceberg 生态仍是项目核心投入方向之一。

---

### 5）Lake 并行 compaction 新方案
- PR: #70162 `[Enhancement] Add range-split parallel compaction for non-overlapping output`
- 状态：OPEN，PROTO-REVIEW  
- 链接：StarRocks/starrocks PR #70162

这是今日技术含量最高的在途 PR 之一。  
其思路是按 **sort key range** 而非 segment index 进行 compaction 子任务切分，输出保证 non-overlapping。  
若最终合入，潜在价值包括：
- 提高 lake table compaction 并行度
- 降低重叠段带来的后续读放大
- 优化 shared-data 场景写后整理效率

这是明确的存储引擎优化路线信号。

---

## 7. 用户反馈摘要

基于今日活跃 Issue，可归纳出几类真实用户痛点：

### 1）外部湖仓 catalog 元数据规模上来后，FE 压力非常明显
- 代表问题：#67760  
用户已不是“能不能连上”阶段，而是进入 **百万级分区、超大元数据规模** 的生产阶段。  
这说明 StarRocks 正被用于更大规模的 Iceberg 元数据治理和分析，但 FE 内存模型仍需升级。

---

### 2）Paimon 生态使用在增长，但类型兼容与元数据稳定性仍是短板
- 代表问题：#70719、#70185、#70223、#70282、#70255  
用户不只是查数据，还在做：
- `DESCRIBE / SHOW CREATE TABLE`
- catalog 自动 refresh
- Ranger 权限管理
- 统计信息优化

这说明 Paimon 用户已经进入“深度生产使用”阶段，而不只是 PoC。

---

### 3）存算分离和多 warehouse 是真实高频部署模式
- 代表问题：#70717、#70706  
用户已经广泛在用 **CN 动态迁移、load/query warehouse 分离、query-scope warehouse hint**。  
这意味着 StarRocks 的资源治理能力正在被实战检验，系统行为的一致性和资源重平衡能力成为关键体验点。

---

### 4）生态接入易用性会直接影响采用率
- 代表问题：#70733 / #70734  
Superset + SQLAlchemy 的问题虽然不是内核级故障，但会直接阻断试用和上线。  
维护者对该问题当日响应，说明项目团队也清楚：**BI 生态兼容性就是产品竞争力的一部分**。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期未决项：

### 1）创建 Hive external table 功能 PR 长期未决
- PR: #42757  
- 创建时间：2024-03-18  
- 状态：OPEN  
- 链接：StarRocks/starrocks PR #42757

这是一个超长期打开的 feature PR。若方向仍被认可，建议明确：
- 是否继续推进
- 是否需拆分范围
- 是否已被其他设计取代

---

### 2）FE leader 安全切换增强长期悬而未决
- Issue: #63357  
- 创建时间：2025-09-22  
- 状态：OPEN  
- 链接：StarRocks/starrocks Issue #63357

该需求有明确 DBA 场景价值，且已有 2 个 👍。  
建议维护者尽快给出设计结论或路线图归类，否则会持续成为运维侧痛点。

---

### 3）generic aggregate states + MV + 重启恢复问题仍未解
- Issue: #63885  
- 创建时间：2025-10-10  
- 状态：OPEN  
- 链接：StarRocks/starrocks Issue #63885

该问题涉及状态恢复与 MV 插入正确性，属于“低频但高风险”的类型。  
建议补充：
- 是否可稳定复现
- 是否仅影响特定版本
- 是否已有规避方案

---

### 4）Iceberg REST Catalog OAuth2 修复 PR 长期开启
- PR: #61748  
- 创建时间：2025-08-09  
- 状态：OPEN  
- 链接：StarRocks/starrocks PR #61748

现代数据湖接入越来越依赖 OAuth2，这个修复长期未合入会影响企业级 Iceberg REST 采用。  
建议维护者尽快明确 review 结论。

---

## 结论

今天的 StarRocks 体现出两个鲜明特征：  
1. **维护响应速度快**，尤其是 warehouse hint、Paimon 若干问题、Superset 方言兼容等；  
2. **复杂外部生态与大规模生产场景压力持续上升**，尤其集中在 Iceberg/Paimon 元数据、云存储文件访问、存算分离资源调度。  

从趋势看，StarRocks 正在从“高性能分析内核”继续向“企业级湖仓查询与统一加速平台”推进，但要真正支撑更大规模生产环境，下一阶段仍需重点补强 **FE 元数据内存控制、外部 catalog 类型兼容、CN/tablet 重平衡、以及生态连接器稳定性**。  

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/钉钉发布的简版**  
2. **适合周报汇总的表格版**  
3. **按 FE / BE / Connector / Docs 四条主线拆分的工程视角版**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-25）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 社区保持了**较高活跃度**：Issues 更新 9 条、PR 更新 50 条，但**没有新版本发布**。  
从活动结构看，当前重心仍集中在三类主题：**Spark 生态能力补齐**、**REST/OpenAPI 与存储凭证体系演进**、以及**CI/供应链安全加固**。  
关闭/合并项数量不高（Issues 关闭 3、PR 已合并/关闭 11），说明项目当前更多处于**中大型特性推进与评审堆积期**，尤其是 Spark 4.1、Variant、V4 manifest、Materialized Views 等方向。  
整体健康度中上：活跃 PR 很多、主题覆盖广，但也暴露出**长期未决 PR 较多、部分 stale 议题反复浮现**的问题。

---

## 3. 项目进展

> 今日无版本发布，以下聚焦过去 24 小时内关闭/推进的关键 PR 与议题。

### 3.1 已关闭/完成的轻量修复

#### 1) SchemaUpdate 测试可见性注解补充
- **PR**: #15756 `[CLOSED] [core] Core: Add VisibleForTesting annotation in SchemaUpdate constructor`
- **Issue**: #15755 `[CLOSED] [improvement] Add VisibleForTesting annotation in SchemaUpdate constructor`
- **链接**: apache/iceberg PR #15756 / apache/iceberg Issue #15755

这是一个较小但明确的代码可维护性改进：为 `SchemaUpdate` 构造函数增加 `VisibleForTesting` 注解，表明该入口主要服务于测试场景。  
技术价值不在功能扩展，而在于**收紧 API 使用边界**、减少误用信号，对 core 模块长期演进有积极作用。

#### 2) GitHub Actions 固定到 commit hash
- **PR**: #15753 `[CLOSED] [INFRA] ci: pin GitHub action to commit hash`
- **链接**: apache/iceberg PR #15753

该项属于基础设施安全治理，已完成 18 个 workflow 文件对 GitHub Actions 的 commit pinning。  
这意味着 Iceberg 正在系统性降低第三方 Action 供应链投毒风险，为后续更严格的 workflow 审计奠定基础。

---

### 3.2 正在推进的重要方向

#### 1) CI 安全继续加码：新增 zizmor 审计
- **PR**: #15757 `[OPEN] [INFRA] CI: Add zizmor workflow audit for unpinned actions`
- **关联 Issue**: #15742 `Harden GitHub Workflow Against Supply Chain Attacks`
- **链接**: apache/iceberg PR #15757 / apache/iceberg Issue #15742

继 pin action 之后，社区继续推进自动化审计，使用 `zizmor` 检测 workflow 中未固定版本的第三方 Actions。  
这是当前非常明确的路线图信号：**Iceberg 正把 CI 安全纳入持续性质量门禁**，而非一次性修补。

#### 2) Spark Variant 写入能力持续推进
- **PR**: #14297 `[OPEN] [spark, parquet, core] Spark: Support writing shredded variant in Iceberg-Spark`
- **Issue**: #15628 `Core, Spark: Add JMH benchmarks for Variants`
- **链接**: apache/iceberg PR #14297 / apache/iceberg Issue #15628

这一方向说明 Iceberg 正持续为 **Variant / 半结构化数据** 补齐写入链路。  
今日新增 benchmark 诉求（#15628）进一步表明社区开始从“功能可用”转向“**规模化性能可衡量**”，是特性逐步走向成熟的重要信号。

#### 3) Spark 4.1 与高级索引/写入元数据能力推进
- **PR**: #15311 `[OPEN] [spark] Bloom filter index POC`
- **PR**: #15150 `[OPEN] [spark, core] Spark 4.1: Set data file sort_order_id in manifest for writes from Spark`
- **PR**: #15726 `[OPEN] [spark] Spark: fix NPE thrown for MAP/LIST columns on DELETE, UPDATE, and MERGE operations`
- **链接**: apache/iceberg PR #15311 / #15150 / #15726

这些 PR 共同反映出 Spark 方向的三条主线：
- **查询裁剪增强**：Puffin-backed Bloom filter 索引探索；
- **写入元数据完整性提升**：manifest 中补齐 `sort_order_id`；
- **DML 稳定性修复**：MAP/LIST 列参与 DELETE/UPDATE/MERGE 时的 NPE。

从趋势看，Iceberg 对 Spark 的投入已不仅限于兼容性，而是在向**查询加速、元数据精细化、复杂类型 DML 正确性**同步演进。

#### 4) REST Catalog / OpenAPI / 凭证刷新持续扩展
- **PR**: #15280 `[OPEN] [spark, core, build, AWS, OPENAPI] Add spec support for credential refresh on staged tables`
- **PR**: #15408 `[OPEN] [API, core, stale, OPENAPI] REST: NameSpace UUID support Implementation`
- **PR**: #15595 `[OPEN] [core] Core: Simplify RESTTableScan by removing catalog internals`
- **Issue**: #15695 `[OPEN] Add scheduled refresh for the GCSFileIO held storage credentials`
- **链接**: apache/iceberg PR #15280 / #15408 / #15595 / Issue #15695

这里能看到一条非常清晰的产品演化路径：  
Iceberg 正在强化 REST Catalog 在**临时/分阶段表（staged tables）**、**云存储凭证刷新**、**命名空间标识**和**扫描实现解耦**上的能力。  
这类工作通常影响多引擎、多云环境和托管服务集成，属于中长期平台化建设。

---

## 4. 社区热点

### 热点 1：Spark 读取列裁剪行为与优化器时序问题
- **Issue**: #9268 `[OPEN] [stale] DatasourceV2 does not prune columns after V2ScanRelationPushDown`
- **链接**: apache/iceberg Issue #9268

这是今天最值得关注的“老问题再浮现”。议题聚焦 Spark DataSource V2 中，`V2ScanRelationPushDown` 之后 Spark 优化器可能重新插入 `Project`，从而导致**列裁剪未正确生效**。  
背后的技术诉求并非单点 bug，而是：
- Iceberg 与 Spark Catalyst/V2 API 的协作边界是否稳定；
- 下推与后续逻辑优化之间是否存在失配；
- 扫描列集是否会膨胀，导致额外 IO 与执行开销。

这类问题对大表扫描成本非常敏感，尤其在宽表和半结构化字段场景下影响明显。

---

### 热点 2：Spark SQL UI 扫描指标不可见
- **Issue**: #11191 `[OPEN] [bug, stale] Spark SQL UI can't show scan metrics.`
- **链接**: apache/iceberg Issue #11191

用户反馈 Spark UI 无法显示 Iceberg 扫描指标，并伴随 warning。  
其技术诉求本质上是**可观测性缺口**：即便查询结果正确，用户也无法在 UI 中确认扫描量、过滤效果和性能瓶颈。  
对生产用户来说，这直接影响：
- 查询调优；
- 成本评估；
- 运维定位与异常分析。

---

### 热点 3：GitHub Workflow 供应链安全
- **Issue**: #15742 `Harden GitHub Workflow Against Supply Chain Attacks`
- **PR**: #15757 `[OPEN] CI: Add zizmor workflow audit for unpinned actions`
- **PR**: #15753 `[CLOSED] ci: pin GitHub action to commit hash`
- **链接**: apache/iceberg Issue #15742 / PR #15757 / PR #15753

这是今天最明确且节奏最快的治理主题。  
从 issue 到已关闭 PR，再到新增审计 PR，显示维护者对**仓库级基础设施安全**采取了分层防线策略：
1. 先 pin；
2. 再自动审计；
3. 后续可能接入 CodeQL 等更系统扫描。

这类工作虽然不直接增加 SQL 或存储功能，但对 ASF 项目治理质量和发布链可信度极其重要。

---

### 热点 4：Variant 能力从功能迈向性能验证
- **Issue**: #15628 `[OPEN] Core, Spark: Add JMH benchmarks for Variants`
- **PR**: #14297 `[OPEN] Spark: Support writing shredded variant in Iceberg-Spark`
- **链接**: apache/iceberg Issue #15628 / PR #14297

社区已不满足于 Variant “能写”，开始追问：
- 写入吞吐如何；
- 数据规模扩大后行为是否稳定；
- shredded variant 相比传统结构的收益与代价如何。

这说明 Variant 正从前沿实验功能进入**可工程化评估阶段**。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Spark 4.1 对 MAP/LIST 列执行 DELETE/UPDATE/MERGE 时出现 NPE
- **PR**: #15726 `[OPEN] [spark] Spark: fix NPE thrown for MAP/LIST columns on DELETE, UPDATE, and MERGE operations`
- **链接**: apache/iceberg PR #15726

**影响范围**：Spark 4.1 + Iceberg 1.11 快照组合，涉及分区表、复杂类型列、DML 场景。  
**风险判断**：高。该问题直接导致 DML 失败，属于查询执行期崩溃。  
**修复状态**：已有 fix PR，待评审合并。  
**点评**：复杂类型与 DML 的组合是企业使用高频场景，这个问题优先级应较高。

---

### P1：DatasourceV2 列裁剪未生效，可能导致额外扫描
- **Issue**: #9268 `[OPEN] [stale] DatasourceV2 does not prune columns after V2ScanRelationPushDown`
- **链接**: apache/iceberg Issue #9268

**影响范围**：Spark V2 扫描规划。  
**风险判断**：高。虽然未必造成结果错误，但会导致**性能回退和读取放大**。  
**修复状态**：未见对应 fix PR。  
**点评**：属于“正确性边界 + 性能损失”混合问题，尤其对宽表代价大。

---

### P2：Spark SQL UI 无法展示扫描指标
- **Issue**: #11191 `[OPEN] [bug, stale] Spark SQL UI can't show scan metrics.`
- **链接**: apache/iceberg Issue #11191

**影响范围**：Spark 可观测性与用户体验。  
**风险判断**：中。不会直接破坏结果，但显著降低调优与诊断效率。  
**修复状态**：未见今日 fix PR。  
**点评**：随着企业级部署增多，这类“非功能性缺陷”会越来越影响采用体验。

---

### P2：测试工具 FileGenerationUtil 中的随机 metrics 生成 NPE
- **PR**: #15748 `[OPEN] [core] Core: Fix NPE of generateRandomMetrics in FileGenerationUtil`
- **链接**: apache/iceberg PR #15748

**影响范围**：核心测试工具链。  
**风险判断**：中。主要影响测试稳定性与开发回归验证，不一定直接影响终端用户。  
**修复状态**：已有 PR。  
**点评**：虽然用户面影响有限，但若测试基建不稳，会间接拖累主线开发效率。

---

### P2：GCS/ADLS FileIO 对 404 的处理不一致
- **PR**: #15029 `[OPEN] [GCP, AZURE] Fix inconsistent 404 handling in GCS and ADLS FileIO implementations`
- **链接**: apache/iceberg PR #15029

**影响范围**：多云对象存储 FileIO 层。  
**风险判断**：中。错误映射不一致会造成**不必要重试**，增加延迟和误判。  
**修复状态**：已有 PR，尚未合并。  
**点评**：这是典型的云平台适配细节问题，但对生产可靠性影响真实。

---

## 6. 功能请求与路线图信号

### 6.1 Variant 基准测试
- **Issue**: #15628 `[OPEN] Add JMH benchmarks for Variants`
- **链接**: apache/iceberg Issue #15628

这不是简单的“补 benchmark”，而是说明 Variant 已经发展到需要正式性能护栏的阶段。  
结合 **PR #14297**，判断该方向**很可能进入后续版本重点**，尤其是 Spark 侧写入能力成熟后。

---

### 6.2 GitHub Workflow 安全加固
- **Issue**: #15742
- **PR**: #15757, #15753
- **链接**: apache/iceberg Issue #15742 / PR #15757 / PR #15753

虽然属于基础设施，不是用户侧功能，但从推进速度看，**极有可能在近期持续落地**。  
后续预计还会看到：
- workflow 最小权限化；
- 第三方 action 准入收紧；
- 更严格的静态分析。

---

### 6.3 GCSFileIO 存储凭证定时刷新
- **Issue**: #15695 `[OPEN] Add scheduled refresh for the GCSFileIO held storage credentials`
- **链接**: apache/iceberg Issue #15695

这是面向云原生部署的实际需求。  
结合 **PR #15280**（staged tables credential refresh）判断，Iceberg 正在形成一条统一的“**存储凭证刷新能力链**”。  
因此该需求被纳入未来版本的概率较高。

---

### 6.4 REST / OpenAPI 演进：Namespace UUID 与 staged table 凭证
- **PR**: #15408, #15280
- **链接**: apache/iceberg PR #15408 / PR #15280

两项工作都属于协议层演进，通常说明社区在为更复杂的 catalog 服务化、托管化场景铺路。  
从战略上看，这比单引擎 patch 更接近**中期路线图能力**。

---

### 6.5 SQL 标准兼容：DECIMAL scale 变更
- **Issue**: #14037 `[CLOSED] Support SQL:2011 compliant DECIMAL type evolution with scale changes`
- **链接**: apache/iceberg Issue #14037

该议题虽已关闭，但它释放出一个重要信号：  
社区对 **SQL:2011 类型演进兼容性**有明确关注，只是当前可能尚未形成可接受实现或已转移到其他讨论渠道。  
后续仍值得关注是否会以更谨慎方式重启。

---

## 7. 用户反馈摘要

### 7.1 用户希望性能优化“可见且可验证”
典型代表：
- #9268 列裁剪未按预期生效
- #11191 Spark UI 看不到扫描指标  
- 链接：apache/iceberg Issue #9268 / #11191

这说明用户不只关心“是否能跑”，更关心：
- 实际扫描了哪些列；
- 谓词和裁剪是否真正下推；
- UI/指标层是否能证明优化效果。

对 OLAP 场景来说，**可观测性就是性能工程的一部分**。

---

### 7.2 云环境下凭证生命周期管理是现实痛点
典型代表：
- #15695 GCSFileIO 凭证定时刷新
- #15280 staged tables 凭证刷新支持
- 链接：apache/iceberg Issue #15695 / PR #15280

用户场景集中在托管存储、短时令牌、分阶段写入流程。  
这类反馈表明 Iceberg 已深度进入企业级云环境，用户关注点从文件格式本身转向**凭证续期、作业长跑稳定性**等平台能力。

---

### 7.3 复杂类型 + DML 组合仍有不少边角问题
典型代表：
- #15726 MAP/LIST 列在 DELETE/UPDATE/MERGE 下触发 NPE
- 链接：apache/iceberg PR #15726

这说明尽管 Iceberg 在结构化分析场景中已成熟，但当用户使用**复杂嵌套类型、较新 Spark 版本、行级变更语义**时，仍会踩到执行边界问题。

---

### 7.4 Kafka Connect 侧需求仍存在，但部分提案进入停滞
典型代表：
- #15345 `java.util.Date` 转换支持仍在推进
- #15208、#15207 已关闭
- 链接：apache/iceberg PR #15345 / #15208 / #15207

用户显然希望 Kafka Connect 在数据类型兼容、提交器扩展、rebalance 稳定性等方面更成熟。  
但从今日状态看，**该方向并非当前最高优先级**，部分提案已关闭或 stale。

---

## 8. 待处理积压

以下议题建议维护者重点关注：

### 8.1 Materialized Views 长期大 PR
- **PR**: #9830 `[OPEN] Views, Spark: Add support for Materialized Views; Integrate with Spark SQL`
- **链接**: apache/iceberg PR #9830

这是一个战略级能力，但已长期开放。  
如果继续拖延，容易造成社区预期与实现进度脱节。建议给出更明确的拆分计划或阶段性结论。

---

### 8.2 Spark shredded variant 写入
- **PR**: #14297 `[OPEN] Spark: Support writing shredded variant in Iceberg-Spark`
- **链接**: apache/iceberg PR #14297

该功能与 Variant 路线紧密相关，且已持续较长时间。  
建议维护者尽快明确：
- 是否接受当前设计；
- 是否拆分成更小 PR；
- 与 reader/writer API proposal 的一致性要求。

---

### 8.3 REST Namespace UUID 支持
- **PR**: #15408 `[OPEN] [stale] REST: NameSpace UUID support Implementation`
- **链接**: apache/iceberg PR #15408

此项属于协议层能力，若长期 stale，可能阻塞相关生态对接。  
建议尽快确认规范是否稳定、实现是否需要重构。

---

### 8.4 Spark 列裁剪旧问题
- **Issue**: #9268 `[OPEN] [stale] DatasourceV2 does not prune columns after V2ScanRelationPushDown`
- **链接**: apache/iceberg Issue #9268

虽然是旧 issue，但仍在更新，说明用户痛点没有消失。  
建议明确：
- 是否受 Spark 上游限制；
- Iceberg 是否能局部缓解；
- 是否需要文档化已知限制。

---

### 8.5 Spark UI 指标缺失
- **Issue**: #11191 `[OPEN] [bug, stale] Spark SQL UI can't show scan metrics.`
- **链接**: apache/iceberg Issue #11191

该问题虽然不影响结果，但影响生产可运维性。  
对于数据平台团队来说，这类问题会显著降低 Iceberg 的“可治理性”感知，值得优先澄清。

---

## 总体判断

今天的 Apache Iceberg 呈现出典型的“**主线特性持续扩展 + 基建安全同步加固 + 长尾兼容性问题待清理**”状态。  
短期看，最值得关注的是：
1. **Spark 4.1 复杂类型 DML 修复**；
2. **GitHub workflow 供应链安全治理**；
3. **Variant 性能基准与写入能力落地**；
4. **REST/凭证刷新相关协议演进**。

中期风险则在于：**长期未决的大型 PR 过多**，若缺乏明确裁剪和阶段交付策略，可能拖慢社区主线节奏。

--- 

如需，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的简版晨报**，或  
2. **面向技术管理层的趋势周报格式**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下是 **Delta Lake** 在 **2026-03-25** 的项目动态日报。

---

# Delta Lake 项目日报 · 2026-03-25

## 1. 今日速览

过去 24 小时内，Delta Lake 社区保持了**较高 PR 活跃度**：共有 **49 条 PR 更新**，其中 **41 条待合并，8 条已合并/关闭**；Issue 侧相对平稳，仅 **2 条活跃/新开 Issue**，无关闭记录。  
从变更主题看，今日研发重心明显集中在 **kernel-spark CDC 流式读取栈**、**DSv2 CREATE TABLE 路径建设**、**Variant / Geospatial 特性演进** 以及 **服务端规划（ServerSidePlanning）认证能力**。  
整体来看，项目处于**功能快速推进期**：核心开发者在通过成组 stacked PR 推进中长期特性，而用户侧也开始对 **治理透明度（TSC 名单）** 和 **异常结构化能力** 提出更明确诉求。  
没有新版本发布，说明当前仍偏向主干集成和功能打磨，而非发布收口阶段。项目健康度表现为：**开发活跃、路线清晰，但待审 PR 堆积明显，评审带宽可能成为短期瓶颈**。

---

## 2. 项目进展

> 注：提供的数据未逐条给出已合并/关闭的 8 个 PR 编号，因此以下重点聚焦“今日最关键的推进方向”和活跃 PR 所代表的主线工作。

### 2.1 kernel-spark 的 CDC 流式读取栈持续快速推进
这一方向是今日最明确的主线，多个 stacked PR 在同一天集中更新，显示该能力已经进入**系统联调与补齐测试**阶段。

- **Part 1：初始快照 offset 管理**  
  [#6075](https://github.com/delta-io/delta/pull/6075)  
- **Part 2：增量变更 commit 处理逻辑**  
  [#6076](https://github.com/delta-io/delta/pull/6076)  
- **Part 3：完成增量变更处理接线**  
  [#6336](https://github.com/delta-io/delta/pull/6336)  
- **Part 4：ReadFunc decorator 与 null-coalesce**  
  [#6359](https://github.com/delta-io/delta/pull/6359)  
- **Part 5：ApplyV2Streaming 与 SparkScan 的 CDC schema 协调**  
  [#6362](https://github.com/delta-io/delta/pull/6362)  
- **Part 6：端到端 CDC streaming 集成测试**  
  [#6363](https://github.com/delta-io/delta/pull/6363)  
- **Part 7：DV + CDC 同路径配对与 DeletionVector 支持**  
  [#6370](https://github.com/delta-io/delta/pull/6370)

**进展解读：**  
这组 PR 表明 Delta Lake 正在把 kernel-spark 从“能读 CDC”推进到“能稳定处理流式 CDC + 初始快照 + 增量提交 + DV 共存”的完整方案。  
这对下游分析引擎和增量消费链路很关键，因为它直接关系到：
- CDC 流式消费的一致性；
- 初始快照切换到增量模式时的正确性；
- 含 Deletion Vector 的表在 CDC 场景下的可读性；
- V2 API / SparkScan 路径下 schema 对齐与语义稳定。

从 OLAP/存储引擎角度看，这是一条**高价值基础设施能力线**，未来很可能影响 Delta 在流批一体与增量湖仓场景中的竞争力。

---

### 2.2 DSv2 CREATE TABLE 路径建设加速，面向新执行路径统一
另一条明显主线是 **DeltaCatalog.createTable() 接入 DSv2 + Kernel 路径** 的分层建设：

- **基础设施：DDLRequest POJO 与 CREATE TABLE 前置基础**  
  [#6377](https://github.com/delta-io/delta/pull/6377)
- **CreateTableBuilder + V2Mode 路由 + 集成测试**  
  [#6378](https://github.com/delta-io/delta/pull/6378)
- **DeltaCatalog.createTable() 接线至 DSv2 + Kernel path**  
  [#6379](https://github.com/delta-io/delta/pull/6379)

**进展解读：**  
这说明 Delta 正在将表创建流程从传统 Spark Catalog/命令式路径进一步迁移到 **DSv2 + Kernel 抽象**。  
其潜在收益包括：
- 减少 Spark 专有路径与跨引擎能力之间的分裂；
- 为多引擎表操作语义统一打基础；
- 让建表、元数据初始化、协议协商更容易被 Kernel 层复用。

对分析型存储引擎来说，这是**架构层面的长期演进信号**，比单点功能修复更值得关注。

---

### 2.3 Variant / Geospatial 特性继续扩展，格式能力边界在向前推
今日活跃 PR 还体现出 Delta 正在持续扩展新数据类型/表特性支持。

#### Geospatial
- **[KERNEL] Add GeoSpatial Table feature**  
  [#6235](https://github.com/delta-io/delta/pull/6235)
- **[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings**  
  [#6301](https://github.com/delta-io/delta/pull/6301)

**意义：**  
Geospatial 不再只是“能存”，而是开始涉及**统计信息解析**与 geometry/geography 的具体表示方式（WKT）。这说明团队已进入**可查询、可裁剪、可统计优化**层面的打磨阶段。  
如果后续继续补 predicate pushdown、统计裁剪或跨引擎一致性，GeoSpatial 可能会成为下一阶段较有感知度的新能力。

#### Variant
- **[CHERRYPICK][KERNEL][VARIANT] Add variant GA table feature to delta kernel java**  
  [#6349](https://github.com/delta-io/delta/pull/6349)
- **[SPARK] Add config to block Spark 4.0 clients from writing to Variant tables**  
  [#6356](https://github.com/delta-io/delta/pull/6356)

**意义：**  
一边推进 Variant 在 Kernel Java 中的 GA 表特性，一边补上 Spark 4.0 客户端写入保护，说明维护者对 Variant 的策略是：  
**“加速落地能力，但同时收紧不安全写路径，优先守住兼容性和正确性。”**  
这通常是新特性走向正式可用前的重要信号。

---

### 2.4 服务端规划（ServerSidePlanning）补 OAuth，企业集成继续增强
- **[ServerSidePlanning] Add OAuth support**  
  [#6360](https://github.com/delta-io/delta/pull/6360)

该 PR 将静态 bearer token 扩展为每请求 tokenSupplier，并接入 UC TokenProvider，以支持 OAuth client credentials flow。

**解读：**
这类改动对企业环境非常重要，尤其是：
- 多租户访问控制；
- 短期 token 刷新；
- 中央认证系统集成；
- ServerSidePlanning 在生产环境下的安全落地。

这不是“用户可见的新 SQL 功能”，但却是**平台可运营性**和**企业采纳度**提升的关键工程。

---

## 3. 社区热点

### 3.1 TSC 成员名单透明度
- Issue: **Where is the current Delta Lake TSC membership listed?**  
  [#6219](https://github.com/delta-io/delta/issues/6219)
- 对应 PR: **Add TSC members to CONTRIBUTING.md**  
  [#6382](https://github.com/delta-io/delta/pull/6382)

**热点分析：**  
这不是技术实现问题，但对开源项目治理非常关键。用户明确指出 charter 要求 TSC voting members 可查，而当前缺少权威列表。  
配套 PR 直接尝试把 TSC 成员补回 `CONTRIBUTING.md`，说明该反馈被快速响应。  
这反映出社区对 Delta 的诉求已不止于功能，还包括：
- 决策结构透明；
- 维护者责任边界清晰；
- 企业用户评估项目治理成熟度。

对成熟开源基础设施来说，这是**健康但不能忽视的信号**。

---

### 3.2 CDC 流式能力是当前最热技术主线
相关 PR：
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)

**背后技术诉求：**
- 流式 CDC 消费能否覆盖完整生命周期；
- 初始快照与增量 offset 的切换是否严格一致；
- CDC 与 Deletion Vector 并存时是否有正确性保障；
- SparkScan / ApplyV2Streaming 新路径下是否具备生产可用性。

这是典型的**分析湖仓用户真实需求驱动**：不仅要有变更数据，还要能以稳定、可恢复、可追踪的方式消费。

---

### 3.3 结构化异常与可恢复性诉求升温
- Issue: **[Feature Request] [kernel-spark] startVersionNotFound should throw a structured exception exposing earliestAvailableVersion**  
  [#6380](https://github.com/delta-io/delta/issues/6380)

**热点分析：**  
提案要求 `startVersionNotFound` 不再只把 `earliestAvailableVersion` 放在字符串错误消息里，而应通过结构化异常暴露。  
背后反映的是用户对以下能力的需求：
- 机器可解析错误；
- 自动恢复/重试逻辑；
- 流式任务从异常中做程序化 fallback；
- 避免靠 fragile 的字符串解析实现容错。

这类诉求通常来自更成熟的生产接入场景，说明 kernel-spark 已被用于更自动化、更工程化的流水线中。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1 · 协调提交下可能出现静默数据丢失
- PR: **Fix race condition in commitFilesIterator causing silent data loss with coordinated commits**  
  [#6353](https://github.com/delta-io/delta/pull/6353)

**问题概述：**  
`commitFilesIterator` 分两阶段发现 commit 文件：  
1. 从文件系统枚举回填文件；  
2. 向 coordinator 查询尚未回填的 commits。  

若两个阶段之间发生并发回填，可能导致第二阶段认为“没有未回填 commit”，从而跳过本应可见的数据，形成**silent data loss**。

**严重性判断：非常高**  
这是典型的**正确性问题**，且“静默丢失”比显式失败更危险，因为业务可能在无告警下读到不完整结果。

**状态：已有 fix PR**  
该问题已有修复 PR，但尚未确认合并。建议维护者优先审阅与回归验证，尤其关注：
- coordinated commits 环境；
- 并发写入 + 回填场景；
- iterator 可见性边界；
- 流批读取一致性。

---

### P1/P2 · kernel-spark 初始快照阶段的数据丢失场景验证
- PR: **[kernel-spark] E2E tests on all data loss scenarios during initial snapshot**  
  [#6298](https://github.com/delta-io/delta/pull/6298)

**问题性质：**  
这是测试增强 PR，不一定代表新发现的 bug，但从标题可看出团队正在系统性覆盖**初始快照期间所有数据丢失场景**。  
这通常意味着：
- 已识别出多个边界条件；
- 现有实现对竞态/版本切换较敏感；
- 需要用 E2E 测试巩固回归防线。

**状态：有验证性修复/测试 PR，建议持续关注。**

---

### P2 · Spark 4.0 与 Variant 表写入兼容性风险
- PR: **[SPARK] Add config to block Spark 4.0 clients from writing to Variant tables**  
  [#6356](https://github.com/delta-io/delta/pull/6356)

**问题性质：**  
不是线上 bug 报告，但本质上是在给潜在不兼容写入路径加“保险丝”。  
说明当前 Spark 4.0 客户端写入 Variant 表可能存在：
- 编码/协议不兼容；
- 元数据解释偏差；
- 写入后不可读或语义不一致风险。

**状态：已有保护性 PR。**  
这类保护措施对于防止新特性上线初期引入数据格式损坏非常必要。

---

### P3 · 起始版本不存在异常缺少结构化字段
- Issue: **[#6380](https://github.com/delta-io/delta/issues/6380)**

**问题性质：**  
更偏工程可用性与可恢复性，而非核心正确性 bug。  
但对于依赖自动重试和程序化恢复的生产系统，这是实际可用性问题。  
当前暂无直接修复 PR 出现，建议后续观察是否快速被纳入 kernel-spark 改进。

---

## 5. 功能请求与路线图信号

### 5.1 结构化异常：更适合自动化消费与恢复
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380)

**路线图信号：中等偏强**  
该请求虽然看似细节，但非常符合 kernel-spark 当前演进方向：当 CDC/流式能力增强后，异常对象也需要变得更“机器友好”。  
若团队继续强调生产级流式能力，这类改动进入后续版本的概率较高。

---

### 5.2 DSv2 + Kernel 的 DDL 路径很可能是后续版本重点
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**路线图信号：强**  
成组 stacked PR 通常意味着已有较清晰设计。  
这类工作一旦完成，可能为后续带来：
- 更多 DDL/元数据操作迁移到 DSv2；
- Spark 与 Kernel 逻辑统一；
- 更好的多引擎兼容基础。

---

### 5.3 CDC streaming in kernel-spark 极可能被纳入下一阶段重点能力
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)

**路线图信号：非常强**  
这是一条持续多周、分层拆解、带集成测试的主线，不像试验性质开发，更像是明确的版本目标。  
如果顺利收敛，未来版本说明中很可能出现与以下相关的条目：
- kernel-spark CDC 流式读取支持；
- 初始快照 + 增量切换；
- DV 兼容；
- 稳定性/数据丢失场景修复。

---

### 5.4 Geospatial 与 Variant 正在从“能力存在”走向“生产可用”
- Geospatial: [#6235](https://github.com/delta-io/delta/pull/6235), [#6301](https://github.com/delta-io/delta/pull/6301)
- Variant: [#6349](https://github.com/delta-io/delta/pull/6349), [#6356](https://github.com/delta-io/delta/pull/6356)

**路线图信号：强**  
这两个方向都呈现出“功能实现 + 兼容性防护 + 解析/统计增强”组合特征，通常意味着项目正在为正式推广做最后几轮打磨。

---

## 6. 用户反馈摘要

### 6.1 用户需要更透明的项目治理信息
- Issue: [#6219](https://github.com/delta-io/delta/issues/6219)

用户反馈并非抱怨功能缺失，而是指出无法找到当前 TSC 成员的权威名单。  
这反映出 Delta 的使用者里包含：
- 企业架构评审方；
- 需要评估项目治理稳定性的团队；
- 关注开源合规与决策流程的采用者。

这类反馈说明 Delta 已经不只是“代码仓库”，而是被当作**关键基础设施项目**来审视。

---

### 6.2 用户希望错误可编程处理，而不是依赖字符串解析
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380)

该反馈非常典型地来自生产集成方：  
他们不满足于“看得懂错误”，而是需要：
- 从异常对象中直接拿到 `earliestAvailableVersion`；
- 触发自动补偿、回退或重新订阅；
- 避免 brittle 的 message parsing。

这说明 kernel-spark 的用户正在朝**自动化运维与高可靠消费**方向深入。

---

## 7. 待处理积压

### 7.1 较早开启且仍活跃的 CDC stacked PR 需要尽快收敛
- [#6075](https://github.com/delta-io/delta/pull/6075)（创建于 2026-02-19）
- [#6076](https://github.com/delta-io/delta/pull/6076)（创建于 2026-02-19）

这两条 PR 已存在一个多月，且仍是后续多条 CDC PR 的基础。  
**风险：**
- stacked PR 层数越深，评审复杂度越高；
- 基础 PR 不落地，后续 Part 3~7 难以批量合并；
- 容易造成功能长期“已开发、未交付”的状态。

建议维护者优先：
1. 确认可否压缩 PR 层次；
2. 抽取最小可合并单元；
3. 明确 CDC streaming 的阶段性里程碑。

---

### 7.2 Geospatial 主功能 PR 仍需关注评审节奏
- [#6235](https://github.com/delta-io/delta/pull/6235)（创建于 2026-03-10）
- [#6301](https://github.com/delta-io/delta/pull/6301)（创建于 2026-03-17）

GeoSpatial 相关 PR 已连续活跃多日，说明实现仍在演进。  
由于该方向涉及数据类型表示、统计信息解析、潜在跨引擎一致性，建议尽早明确：
- WKT 是否为最终稳定表示；
- 统计信息如何参与裁剪；
- Spark/Kernel/其他连接器是否统一语义。

---

### 7.3 正确性高风险修复 PR 不宜久拖
- [#6353](https://github.com/delta-io/delta/pull/6353)

涉及 silent data loss 的 PR 应视作高优先级积压项。  
如果尚未进入合并窗口，建议维护者尽快补充：
- reproducer；
- 回归测试覆盖范围；
- 是否影响已发布分支；
- 是否需要 backport/cherrypick。

---

## 8. 结论

今天的 Delta Lake 呈现出典型的**核心能力推进日**：没有 release，但围绕 **CDC 流式读取、DSv2 DDL 路径、Variant/Geospatial、企业认证能力** 的多条主线同时前进。  
从项目健康度看，研发投入充足、路线明确，但 PR 堆积较高，尤其是 stacked PR 较多，后续能否高效评审和分批落地将决定功能交付速度。  
最值得持续跟踪的三件事是：
1. **kernel-spark CDC streaming** 能否从设计/联调进入可合并状态；  
2. **coordinated commits 下 silent data loss 修复** 是否快速落地；  
3. **DSv2 + Kernel 的 CREATE TABLE 路径** 是否成为后续版本中的架构级里程碑。

--- 

如需，我还可以继续把这份日报整理成：
- **更适合邮件发送的简版**
- **面向管理层的 1 分钟摘要**
- **面向研发团队的风险清单版**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 - 2026-03-25

## 1. 今日速览

过去 24 小时 Databend 维持较高活跃度：Issues 更新 10 条、PR 更新 26 条，问题修复明显快于功能发布，说明团队当前重点仍在**查询引擎稳定性、SQL 兼容性与 CI 可靠性收敛**。  
当天没有新版本发布，但围绕 `LIKE`、`ESCAPE`、`GROUPING()`、`ASOF JOIN`、`X'...'` 字面量等一批 SQL 边界条件问题，已经出现成体系的修复 PR，响应速度较快。  
从动态看，项目当前呈现“**一边补查询正确性与 panic 类缺陷，一边推进实验性表分支/标签与 HTTP 参数绑定能力**”的双线发展状态。  
整体健康度偏积极：**Bug 暴露较集中，但对应修复链路清晰，维护者处理效率较高**。

---

## 3. 项目进展

> 今日无 Release，以下聚焦已关闭/已推进的重要 PR 与 Issue。

### 3.1 SQL 兼容性与解析稳定性持续收敛

- **修复 `LIKE ... ESCAPE ''''` 的 round-trip parser panic**
  - PR: #19596  
  - 状态: Closed  
  - 链接: databendlabs/databend PR #19596
  - 对应 Issue: #19563  
  - 进展解读：该修复解决了 `Expr::Display` 对 escape 字符串中单引号未正确转义的问题，避免 SQL pretty-print 后再解析触发断言或 panic。这类问题虽然属于“边界输入”，但直接影响 parser/formatter 的自洽性，对 sqllogictest、语句重写和调试链路都很关键。

- **`X'...'` 十六进制字面量语义修复已进入 PR**
  - PR: #19608  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19608
  - 对应 Issue: #19600  
  - 进展解读：Databend 正从“将 `X'...'` 误当作 PostgreSQL 风格十六进制整数”调整为“按 SQL 标准/MySQL 兼容路径将其视为二进制字面量”。这会明显提升 SQL 标准兼容性，也有助于减少跨数据库迁移中的行为偏差。

### 3.2 查询规划器与常量折叠 panic 修复密集推进

- **修复 repeated `%` 的 `LIKE` 常量折叠 panic**
  - PR: #19590  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19590
  - 对应 Issue: #19561  
  - 价值：避免 `LIKE 'abab%%%%%'` 这类模式在 fold 后触发内部断言，属于典型查询正确性与鲁棒性修复。

- **修复空 `ESCAPE ''` 在 planner 中 panic**
  - PR: #19595 / #19597  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19595 / databendlabs/databend PR #19597
  - 对应 Issue: #19562  
  - 价值：从“unwrap 崩溃”改为语义错误或安全处理，体现出团队正系统性地把 planner 中的 panic 转换为可控错误返回。

- **修复无效 `GROUPING()` 调用导致 constant folding panic**
  - PR: #19594  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19594
  - 对应 Issue: #19554  
  - 价值：将无效聚合语义从内部崩溃改成标准语义错误，对 SQL 兼容测试和用户体验很重要。

- **修复 `UInt64` 全范围列统计触发 overflow**
  - PR: #19591  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19591
  - 对应 Issue: #19555  
  - 价值：这是 planner 统计推导中的溢出问题，影响扫描节点 NDV 估算稳定性；虽是边界统计值触发，但属于潜在高风险优化器缺陷。

### 3.3 CI 与执行行为修正

- **修复 stage matrix `size` 未传入运行时**
  - PR: #19606  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19606
  - 对应 Issue: #19598  
  - 价值：这属于 CI 配置与实际测试规模脱节的问题，会导致 stage 测试覆盖失真。修复后 `small/large` 维度可真正生效，有助于提升回归测试可信度。

- **Parquet prewhere 默认行为调整**
  - PR: #19609 / #19610  
  - 状态: #19609 Closed，#19610 Open  
  - 链接: databendlabs/databend PR #19609 / databendlabs/databend PR #19610
  - 价值：重点在于尊重 `enable_parquet_prewhere` 设置，并倾向于更保守地关闭 parquet prewhere 默认启用，这通常意味着此前该优化可能存在正确性、稳定性或收益不稳的问题。

### 3.4 新能力推进

- **HTTP `/v1/query` 增加服务端参数绑定**
  - PR: #19601  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19601
  - 价值：支持 positional `?` 与 named `:name` 占位符，是面向 API 客户端、BI 工具、应用集成的重要增强，降低 SQL 拼接风险，也有助于统一服务端执行语义。

- **实验性 table branch / table tags 持续推进**
  - PR: #19551、#19549  
  - 状态: Open  
  - 链接: databendlabs/databend PR #19551 / databendlabs/databend PR #19549
  - 价值：这是明显的路线图信号，Databend 正在强化类似数据版本化/分支标签能力，尤其围绕 FUSE table snapshot 的 KV-backed tag 模型，值得持续关注。

---

## 4. 社区热点

### 4.1 INSERT 性能回归是当前最突出的真实用户反馈
- Issue: #19481  
- 链接: databendlabs/databend Issue #19481

这是当天评论最多的 Issue（27 条），用户明确指出从 `1.2.790` 升级到 `1.2.881-nightly` 后 `INSERT` 性能下降。  
**技术诉求分析：**
1. 用户更关心**升级后性能是否可预期**，而不是单点 bug；
2. INSERT 回归通常涉及写入路径、数据块组织、索引/聚簇、事务提交、对象存储交互或 pipeline 调度；
3. 若无法快速定位，可能影响 nightly 版本的信任度，并拖慢生产用户升级节奏。  
这类问题比 parser 边界 panic 更“接近真实工作负载”，建议维护者优先给出性能 bisect、profiling 或可复现 benchmark。

### 4.2 SQL 边界语义修复成为今日高密度主题
- Issues: #19600, #19555, #19554, #19562, #19561  
- PRs: #19608, #19591, #19594, #19595, #19597, #19590  
- 链接: databendlabs/databend Issue #19600 等

今日最明显的热点不是单一功能，而是一组围绕 parser/planner/expression 的**“panic 转 semantic error / 标准行为”**收敛工作。  
这表明 Databend 正在强化：
- SQL 标准兼容性；
- planner 对非法输入的鲁棒性；
- sqllogictest/兼容测试覆盖深度。

### 4.3 平台与 API 能力继续扩展
- PR: #19601, #19551, #19549  
- 链接: databendlabs/databend PR #19601 等

HTTP 参数绑定与实验性 table branch/tag 的推进，说明项目并未因修 bug 而停滞在维护期，仍在推进**上层接口能力和数据版本管理模型**。

---

## 5. Bug 与稳定性

> 按严重程度排序，并标注是否已有 fix PR。

### P0 / 高优先级：生产性能回归
1. **INSERT 在 1.2.881-nightly 上变慢**
   - Issue: #19481  
   - 状态: Open  
   - 链接: databendlabs/databend Issue #19481
   - 风险：直接影响生产写入吞吐与升级意愿。
   - Fix PR：**暂无明确关联 PR**

### P1 / 高优先级：planner 或执行前阶段 panic
2. **`UInt64` 全范围列统计导致 `Scan::derive_stats` overflow panic**
   - Issue: #19555  
   - PR: #19591  
   - 链接: databendlabs/databend Issue #19555 / PR #19591
   - 风险：优化器统计推导异常，可能在特定表统计下阻断查询规划。
   - Fix 状态：**已有修复 PR**

3. **无效 `GROUPING()` 查询在 constant folding 中 panic**
   - Issue: #19554  
   - PR: #19594  
   - 链接: databendlabs/databend Issue #19554 / PR #19594
   - 风险：非法 SQL 未被正常拒绝，而是触发内部崩溃。
   - Fix 状态：**已有修复 PR**

4. **`LIKE ... ESCAPE ''` 在 planner type checking panic**
   - Issue: #19562  
   - PR: #19595, #19597  
   - 链接: databendlabs/databend Issue #19562 / PR #19595 / PR #19597
   - 风险：简单构造即可触发 planner panic。
   - Fix 状态：**已有修复 PR**

5. **`LIKE` 常量折叠在 repeated `%` 模式上 panic**
   - Issue: #19561  
   - PR: #19590  
   - 链接: databendlabs/databend Issue #19561 / PR #19590
   - 风险：表达式优化过程中的断言失败，影响查询稳定性。
   - Fix 状态：**已有修复 PR**

### P2 / 中优先级：SQL 行为与标准不一致
6. **`X'...'` 实现不符合 SQL 标准**
   - Issue: #19600  
   - PR: #19608  
   - 链接: databendlabs/databend Issue #19600 / PR #19608
   - 风险：跨数据库兼容性偏差，可能导致结果类型与语义错误。
   - Fix 状态：**已有修复 PR**

7. **stage matrix `size` 未接入运行时**
   - Issue: #19598  
   - PR: #19606  
   - 链接: databendlabs/databend Issue #19598 / PR #19606
   - 风险：CI 测试规模配置失效，覆盖面可能与预期不符。
   - Fix 状态：**已有修复 PR**

### 已关闭问题
8. **`LIKE ... ESCAPE ''''` 触发 parser reparse assertion**
   - Issue: #19563  
   - PR: #19596  
   - 状态: Closed  
   - 链接: databendlabs/databend Issue #19563 / PR #19596

---

## 6. 功能请求与路线图信号

### 6.1 已关闭功能需求说明部分能力已落地
- **`COPY INTO location` 支持在 `FILE_FORMAT` 中配置 compression**
  - Issue: #13023  
  - 状态: Closed  
  - 链接: databendlabs/databend Issue #13023
  - 解读：该功能请求关闭，通常意味着相关支持已经完成或通过其他方式解决。对于数据导出链路和对象存储写出非常关键。

- **支持通过 HTTP API 列出 stage files**
  - Issue: #14710  
  - 状态: Closed  
  - 链接: databendlabs/databend Issue #14710
  - 解读：这对云平台文件发现、stage 管理、外部任务编排都很有价值，关闭表明平台 API 能力在持续完善。

### 6.2 明确的下一阶段功能方向
- **服务端参数绑定**
  - PR: #19601  
  - 链接: databendlabs/databend PR #19601
  - 判断：较可能进入后续版本。它面向 HTTP 查询入口，价值明确、接口边界清晰。

- **实验性 table branch / table tags**
  - PR: #19551, #19549  
  - 链接: databendlabs/databend PR #19551 / PR #19549
  - 判断：这是强路线图信号，说明 Databend 正在加强面向快照、分支、标签的数据对象管理能力，可能逐步形成类似数据版本控制的特性集。

- **递归 CTE 能力扩展示例**
  - PR: #19599  
  - 链接: databendlabs/databend PR #19599
  - 判断：虽然是 “support sudoku” 形式，但本质上反映递归 CTE 语义与执行能力在继续拓展，可能用于增强标准 SQL 覆盖度与复杂查询表达力。

---

## 7. 用户反馈摘要

### 7.1 真实痛点主要集中在两个方向

1. **升级后的性能稳定性**
   - 代表 Issue: #19481  
   - 链接: databendlabs/databend Issue #19481
   - 用户关心升级后写入性能回归，说明 Databend 已被用于对写入吞吐敏感的实际业务场景，而不仅是分析只读负载。

2. **SQL 兼容与错误处理应更“数据库化”**
   - 代表 Issues: #19600, #19554, #19562, #19561  
   - 链接: databendlabs/databend Issue #19600 等
   - 用户和测试者希望 Databend 对非法 SQL 返回清晰语义错误，而不是 panic。这反映项目正在从“可运行”走向“工程级兼容与稳健”。

### 7.2 满意度信号
- 虽然今日 bug 较多，但多数新报问题**已有对应修复 PR**，说明维护者对回归和兼容性问题的响应速度较快。
- 关闭的功能型 Issue（#13023、#14710）也说明部分用户需求已经得到交付或吸收。

---

## 8. 待处理积压

### 8.1 值得维护者重点关注的长期或高风险项

1. **INSERT 性能回归仍未见明确修复**
   - Issue: #19481  
   - 链接: databendlabs/databend Issue #19481
   - 提醒：这是当前最接近生产影响的问题，且评论最多。建议优先补充复现脚本、profile 数据、涉及 commit 范围与 benchmark 对比。

2. **实验性 table branch / table tags PR 体量较大，需防止长期悬置**
   - PR: #19551, #19549  
   - 链接: databendlabs/databend PR #19551 / PR #19549
   - 提醒：这类功能往往横跨 catalog、metadata、snapshot 管理和 SQL 语义，若长期不合并，容易出现冲突积累与设计漂移。

3. **partitioned hash join 重构值得持续跟进**
   - PR: #19553  
   - 链接: databendlabs/databend PR #19553
   - 提醒：这是查询执行层的重要重构方向，潜在影响性能、内存使用和并行性，建议维护者关注 benchmark 与回归覆盖。

4. **聚合索引重写匹配机制重构**
   - PR: #19567  
   - 链接: databendlabs/databend PR #19567
   - 提醒：从字符串匹配转向结构匹配是正确方向，但会影响 rewrite 命中行为与优化器稳定性，需完善逻辑测试。

---

## 附：今日重点链接汇总

- INSERT 性能回归: databendlabs/databend Issue #19481
- `X'...'` 标准兼容问题: databendlabs/databend Issue #19600 / PR #19608
- `UInt64` 全范围统计 overflow: databendlabs/databend Issue #19555 / PR #19591
- `GROUPING()` panic: databendlabs/databend Issue #19554 / PR #19594
- `LIKE ... ESCAPE ''` panic: databendlabs/databend Issue #19562 / PR #19595 / PR #19597
- repeated `%` 的 `LIKE` panic: databendlabs/databend Issue #19561 / PR #19590
- CI stage size 修复: databendlabs/databend Issue #19598 / PR #19606
- HTTP 参数绑定: databendlabs/databend PR #19601
- experimental table branch/tag: databendlabs/databend PR #19551 / PR #19549

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合飞书/Slack 发布的简版播报**，或  
2. **按“查询引擎 / 存储 / 平台接口 / CI”四个维度重组的周报格式**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报 — 2026-03-25

## 1. 今日速览

过去 24 小时内，Velox 社区保持较高活跃度：Issues 更新 7 条、PR 更新 47 条，说明项目仍处于高频迭代阶段，尤其集中在 **GPU/cuDF 路线、构建系统治理、向量/内存语义修复、Spark/JSON 兼容性** 等方向。  
从变更结构看，新增和活跃 PR 远多于关闭项，表明当前更多是“功能推进 + 修复堆积待合并”的状态，而不是一次集中收敛发布周期。  
问题侧出现了几类值得关注的稳定性信号：**Parquet 类型扩宽结合 filter pushdown 的正确性/崩溃问题、聚合测试 flaky、内存回收异常、JSON wildcard 兼容性回归**。  
整体健康度评价为：**活跃且有持续交付能力，但 correctness 与 memory/IO 边界条件仍需加强回归验证**。

---

## 2. 项目进展

> 注：本次数据中未明确给出“已合并 PR 明细”，以下重点基于今日活跃且对主线能力影响较大的 PR，以及已关闭 Issue 所反映的进展。

### 2.1 查询执行与 Join 正确性修复持续推进

- **#16868 fix: Skip filter evaluation in HashProbe when no rows are selected**  
  链接: facebookincubator/velox PR #16868  
  该 PR 针对 `HashProbe::evalFilter` 在 **ANTI JOIN + probe 侧 join key 被 filter 引用** 时触发的 debug 校验失败进行修复。本质上是在“无选中行”场景跳过不必要 filter 求值，避免 `DictionaryVector::validate` 崩溃。  
  这类修复直接提升了 **复杂 Join 语义下的执行正确性与稳定性**，尤其对带过滤条件的反连接计划很关键。

- **#16774 fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop**  
  链接: facebookincubator/velox PR #16774  
  该修复将 lazy loading 前置，并在进入关键 probe 循环前给内存仲裁器一次 reclaim 机会，目标是降低 probe 阶段触发不可回收内存错误的概率。  
  对大查询、多 split、probe 侧懒加载较多的场景，这是明显的 **内存行为稳定性优化**。

### 2.2 GPU/cuDF 能力继续扩张，路线图非常明确

- **#16892 feat(cudf): Add GPU-accelerated Window operator**  
  链接: facebookincubator/velox PR #16892  
  新增 `CudfWindow`，基于 cuDF 的 `grouped_rolling_window` 与 `groupby::scan` API，将窗口算子纳入 GPU 执行范围。  
  这是 Velox GPU 执行面扩大的标志性进展，意味着过去只能 fallback 到 CPU 的一类高成本算子正在被补齐。

- **#16750 feat(cudf): GPU Decimal (Part 2 of 3)**  
  链接: facebookincubator/velox PR #16750  
- **#16751 feat(cudf): GPU Decimal (Part 3 of 3)**  
  链接: facebookincubator/velox PR #16751  
  两个 PR 持续推进 **GPU Decimal**，其中 Part 3 已覆盖 `SUM` / `AVG` 聚合。  
  这说明 cuDF 后端不再只是“基础算子加速”，而是开始补足 **金融/BI 场景不可缺少的 decimal 与聚合精度支持**。

- **#16542 feat(cudf): Add CudfLocalMerge and allow PartitionOutput without Fallback**  
  链接: facebookincubator/velox PR #16542  
  针对 Presto TPC-H/TPC-DS 跑数中仍回落 CPU 的算子缺口继续补齐，尤其是 `LocalMerge`。  
  这与活跃 Issue #15772 形成呼应，说明 GPU 路线已经从“可运行”转向“减少 fallback、提升端到端覆盖率”。

- **#16620 fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs**  
  链接: facebookincubator/velox PR #16620  
  通过重构输出 batching，减少设备到主机的同步次数和深拷贝，直接优化 **GPU→CPU 边界的数据回传效率**。  
  对混合执行、批量较大场景，这类改动对整体吞吐和尾延迟影响会非常实际。

### 2.3 SQL / 函数兼容性增强

- **#16307 feat: Support decimal type for Spark checked_multiply function**  
  链接: facebookincubator/velox PR #16307  
  为 Spark ANSI 模式提供 decimal `checked_multiply`，在溢出时抛错而非返回 null。  
  这是典型的 **Spark SQL 行为兼容性完善**，尤其对强调 ANSI 正确性的上层引擎很重要。

- **#16896 fix: Fix owner metadata missing from SimpleFunctionRegistry::getFunctionSignaturesAndMetadata**  
  链接: facebookincubator/velox PR #16896  
  修复函数元数据中 `owner` 缺失问题，改善函数签名与元信息可观测性。  
  虽不直接提升执行性能，但对 **函数注册体系、文档展示、可维护性** 是有价值的基础设施修复。

### 2.4 存储格式与数据通路能力扩展

- **#16875 feat: [velox][iceberg] Add DWRF file format support for Iceberg data sink**  
  链接: facebookincubator/velox PR #16875  
  为 Iceberg data sink 添加 DWRF 读写支持，并补充对应测试。  
  这表明 Velox 在 **表格式/文件格式生态整合** 上继续推进，利好需要将 Velox 作为写路径或统一执行层的用户。

- **#16908 feat: Wire loadClusterIndex/loadChunkIndex through configureOptions**  
  链接: facebookincubator/velox PR #16908  
  将 reader index 加载选项打通到配置层，增强 selective reader 场景下的可调控性。  
  这更偏向 **存储读取路径的可配置优化**，有助于在不同 IO/CPU 权衡下做精细 tuning。

### 2.5 构建系统与工程治理增强

- **#16827 build: Add build impact analysis workflow for PRs**  
  链接: facebookincubator/velox PR #16827  
- **#16897 build: Track header files in CMake targets via FILE_SET**  
  链接: facebookincubator/velox PR #16897  
- **#16784 refactor(ci): Cleanup CI job and switch some deps to wget**  
  链接: facebookincubator/velox PR #16784  
- **#16019 build: Use FBThrift instead of Apache Thrift**  
  链接: facebookincubator/velox PR #16019  
  今天构建与 CI 方向非常活跃。重点不只是“加快 CI”，而是在提升 **变更影响分析能力、目标归属清晰度、依赖治理能力**。  
  对一个大型 C++ OLAP 执行引擎项目来说，这直接关系到 PR 吞吐、回归定位速度和长期可维护性。

### 2.6 已关闭事项

- **#9523 Add TPCDS connector in Velox**  
  链接: facebookincubator/velox Issue #9523  
  该 Issue 在今天关闭。结合摘要可看出，它原本围绕在 Velox 中实现 TPCDS connector 以生成数据并做 benchmark。  
  虽然未给出关闭原因细节，但关闭本身通常意味着：要么已有替代方案/实现路径，要么不再作为独立工作项推进。对 benchmarking 生态来说，这是一个值得后续确认的方向变化信号。

---

## 3. 社区热点

### 3.1 cuDF 算子架构统一需求升温
- **#16885 [enhancement] Unify cuDF operators with a common base class architecture**  
  链接: facebookincubator/velox Issue #16885

这是今日评论最活跃的 Issue 之一（8 条评论）。诉求非常明确：当前 `CudfTopN`、`CudfLimit`、`CudfOrderBy` 等算子直接继承 `exec::Operator` 和 `NvtxHelper`，缺少统一基类，导致重复逻辑分散。  
背后的技术诉求是：  
1. **减少 GPU 算子实现重复代码**；  
2. 统一生命周期、指标、错误处理、NVTX tracing；  
3. 为后续更多 cuDF 算子扩张建立标准化骨架。  
考虑到 #16892、#16750、#16751、#16542 等 PR 都在扩展 cuDF 面，这个架构类 enhancement 很可能会被纳入近期路线。

### 3.2 GPU 覆盖率仍是用户最真实的性能痛点
- **#15772 [enhancement] [cuDF] Expand GPU operator support for Presto TPC-DS**  
  链接: facebookincubator/velox Issue #15772

该 Issue 持续活跃，直接描述了在 **Presto TPC-DS SF100、单 worker、启用 cuDF 且允许 CPU fallback** 的真实运行环境中，查询仍会因缺失 GPU 算子回退到 CPU。  
这不是抽象需求，而是 benchmark 驱动的能力缺口清单。今天多条 cuDF PR 与它高度相关，说明社区对 GPU 路线的关注点已经从“某个单点算子”升级为 **TPC-DS 端到端覆盖率与 fallback 最小化**。

### 3.3 构建影响分析进入工程化重点
- **#16827 build: Add build impact analysis workflow for PRs**  
  链接: facebookincubator/velox PR #16827  
- **#16897 build: Track header files in CMake targets via FILE_SET**  
  链接: facebookincubator/velox PR #16897

虽然评论数未给出，但从 PR 内容看，这两项明显属于近期工程治理重点。  
它们背后的核心诉求是：**大型 C++ 仓库的改动面越来越广，需要更精准地知道“一个 PR 会影响哪些 target、哪些测试必须跑”**。  
这类治理工作短期看不如功能 PR “显眼”，但长期会显著提升 merge 速度和回归质量。

### 3.4 Join 与向量复制语义仍是底层热点
- **#16161 feat: Allow EncodedVectorCopy to generate FlatMapVector in non-NULL vectors**  
  链接: facebookincubator/velox PR #16161  
- **#16909 test: Verify MergeJoin supports FlatMapVector**  
  链接: facebookincubator/velox PR #16909  
- **#16910 Split of "feat: Allow EncodedVectorCopy..."**  
  链接: facebookincubator/velox PR #16910

这些 PR 说明社区仍在持续推进 **FlatMapVector / EncodedVectorCopy / Join 算子** 的底层语义完善。  
这类工作对上层用户不一定“可见”，但对复杂类型处理、编码向量兼容性、Join 正确性和性能都有基础性影响。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P0 / 高优先级：查询正确性错误或直接崩溃

#### 4.1 Parquet 类型扩宽 + filter pushdown 导致崩溃或错误结果
- **#16895 [OPEN] Filter pushdown crashes or returns wrong results with Parquet type widening**  
  链接: facebookincubator/velox Issue #16895

这是今天最值得优先处理的问题之一。Issue 指出在 **Parquet type widening**（如 `INT32 -> DOUBLE`, `INT64 -> DECIMAL(25,5)`）与 **filter pushdown** 结合时，会出现两类问题：  
1. filter 类型不兼容导致 crash；  
2. 结果错误。  

这是典型 **correctness + stability 双重风险**，影响查询下推链路，且容易在生产中静默产生错误结果。  
**当前未看到明确对应 fix PR**，建议维护者优先补丁并加入回归测试。

#### 4.2 HashProbe 过滤求值导致 debug 崩溃
- **#16868 [OPEN] fix: Skip filter evaluation in HashProbe when no rows are selected**  
  链接: facebookincubator/velox PR #16868

虽然这是 PR 而非 Issue，但其修复内容直接对应引擎执行时的崩溃风险。  
属于 **已识别、已有修复在途** 的高优先级 correctness/stability 问题。

### P1 / 中高优先级：函数语义错误、兼容性回归

#### 4.3 `get_json_object` 在 `[*]` wildcard path 上返回错误结果
- **#16855 [OPEN] [bug, triage, spark-functions] get_json_object returns wrong results for [*] wildcard paths with simdjson ≥ 4.0**  
  链接: facebookincubator/velox Issue #16855

该问题影响 Spark SQL Hive 兼容测试，且与 `simdjson >= 4.0` 相关，具有明显 **依赖升级引发的兼容性回归** 特征。  
如果未及时修复，会影响 Spark 兼容层用户对 JSON 函数的结果信任。  
**暂未看到对应 fix PR**。

### P1 / 中高优先级：内存管理异常

#### 4.4 memory checker problem：超限后无法回收内存
- **#16837 [OPEN] [bug, triage] memory checker problem**  
  链接: facebookincubator/velox Issue #16837

用户反馈在超过 `system_memory_limit` 后 Velox 无法有效 shrink memory。  
从摘要日志看，问题可能与 `AsyncDataCache` shrink/reclaim 路径有关。  
这类问题对长查询和共享资源环境非常关键，会影响 **资源仲裁、服务稳定性、OOM 风险**。  

相关在途修复信号：
- **#16774** 预加载 lazy probe 向量并改善 reclaim 机会  
  链接: facebookincubator/velox PR #16774  
但它不一定直接覆盖该 Issue，仍需确认是否同根因。

### P2 / 中优先级：测试不稳定与基础设施噪音

#### 4.5 Flaky test: CountIfAggregationTest
- **#16901 [OPEN] [bug, triage, flaky-test] Flaky test: CountIfAggregationTest...**  
  链接: facebookincubator/velox Issue #16901

错误表现为尝试读取超出 source 剩余字节的大块数据，属于 **测试环境或序列化/读取边界问题**。  
虽然目前是 flaky test，但若根因在 reader/stream 边界处理，可能会演变成真实生产 bug。  
**暂未看到 fix PR**，建议尽快做最小复现和隔离。

### P2 / 中优先级：缓冲区重分配语义修复

#### 4.6 视图 buffer 误重分配风险
- **#16911 [OPEN] fix: Checks if buffer is a view before attempting to reallocate**  
  链接: facebookincubator/velox PR #16911

该 PR 修复“view buffer 不可直接 reallocate”的语义问题。  
虽然未关联公开 Issue，但这类底层内存对象修复对向量写入、复制和编码转换路径的稳定性很重要。  
属于 **已有修复在途** 的基础稳定性改进。

---

## 5. 功能请求与路线图信号

### 5.1 cuDF 统一基类大概率会进入近期开发计划
- **#16885 Unify cuDF operators with a common base class architecture**  
  链接: facebookincubator/velox Issue #16885

结合今天多条 cuDF PR 判断，这不是孤立优化，而是 GPU 功能爆发后必须做的工程收敛。  
**纳入下一版本/近期迭代的概率较高**，因为它能降低后续 Window、Decimal、Merge 等算子继续扩展的成本。

### 5.2 GPU 覆盖率提升仍是核心路线
- **#15772 Expand GPU operator support for Presto TPC-DS**  
  链接: facebookincubator/velox Issue #15772  
相关 PR：
- **#16892** Window GPU 化  
- **#16750 / #16751** Decimal GPU 化  
- **#16542** LocalMerge GPU 化  
- **#16620** GPU 输出 batching 优化

这一组信号非常明确：Velox 正在从“支持 cuDF”走向“让 Presto/TPC-DS 典型查询尽量全链路跑在 GPU”。  
**这是当前最清晰的产品路线之一。**

### 5.3 Spark SQL 兼容性会继续补齐
- **#16307 Support decimal type for Spark checked_multiply function**  
  链接: facebookincubator/velox PR #16307  
- **#16855 get_json_object wildcard paths wrong results**  
  链接: facebookincubator/velox Issue #16855

一边是 ANSI decimal 行为增强，一边是 JSON wildcard 回归问题，说明 Spark 兼容仍是持续投入方向。  
预计下一阶段会继续围绕 **函数语义、边界行为、依赖升级兼容** 做修补。

### 5.4 Iceberg + DWRF 组合值得关注
- **#16875 Add DWRF file format support for Iceberg data sink**  
  链接: facebookincubator/velox PR #16875

这释放出一个较强信号：Velox 不只是做执行引擎，也在向 **表格式写路径与文件格式集成** 延展。  
若该 PR 落地，未来可能继续看到更多 Iceberg sink / source 能力增强。

---

## 6. 用户反馈摘要

基于 Issues 摘要和评论语境，今日用户痛点主要集中在以下几类：

1. **GPU 启用后仍频繁 CPU fallback，端到端收益不足**  
   - 代表：#15772  
   - 用户场景是实际跑 Presto TPC-DS，而非纯微基准。用户关心的不是“支持某个 GPU 算子”，而是 **整条查询计划不要掉回 CPU**。  
   - 这说明 Velox GPU 用户已从“试验性接入”进入“追求完整 benchmark 覆盖和性能兑现”的阶段。

2. **查询正确性比性能更敏感**
   - 代表：#16895、#16855  
   - 一个是 Parquet 下推在类型扩宽时崩溃/错结果，一个是 JSON wildcard 路径结果错误。  
   - 这些问题说明用户在将 Velox 用于复杂 SQL/格式兼容场景时，最在意的是 **结果可信度**。

3. **内存回收行为不符合预期**
   - 代表：#16837  
   - 用户显然在共享资源或受限内存环境下使用 Velox，期待系统在超过 memory limit 后能够主动 shrink/reclaim。  
   - 这说明资源管理和 cache/reclaim 透明性仍是实际部署中的痛点。

4. **测试稳定性影响开发信心**
   - 代表：#16901  
   - flaky test 虽不一定直接影响生产，但会降低 CI 信噪比，拖慢合入效率，也影响贡献者对系统稳定性的判断。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期或滞留项：

### 7.1 较长期未合并、但价值较高的 PR

- **#16019 build: Use FBThrift instead of Apache Thrift**  
  链接: facebookincubator/velox PR #16019  
  创建于 2026-01-14。  
  这是依赖治理层面的较大改动，长期悬而未决可能阻碍 Parquet 相关依赖统一与后续清理。

- **#16161 feat: Allow EncodedVectorCopy to generate FlatMapVector in non-NULL vectors**  
  链接: facebookincubator/velox PR #16161  
  创建于 2026-01-29。  
  涉及底层向量语义，价值高但复杂度也高；如今又拆出 #16910、补测试 #16909，说明这项工作还在推进，建议集中 review 收敛。

- **#16307 feat: Support decimal type for Spark checked_multiply function**  
  链接: facebookincubator/velox PR #16307  
  创建于 2026-02-09，且已标记 `ready-to-merge`。  
  若长期停留，会拖慢 Spark ANSI 兼容闭环，建议优先处理。

- **#16542 feat(cudf): Add CudfLocalMerge and allow PartitionOutput without Fallback**  
  链接: facebookincubator/velox PR #16542  
  创建于 2026-02-26。  
  与 GPU 覆盖率目标强相关，且直接关系 benchmark 结果，值得提高优先级。

- **#16620 fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs**  
  链接: facebookincubator/velox PR #16620  
  创建于 2026-03-04。  
  明显具备性能价值，且是 GPU 数据通路上的共性优化，不应长期积压。

### 7.2 长期需求/讨论项

- **#15772 Expand GPU operator support for Presto TPC-DS**  
  链接: facebookincubator/velox Issue #15772  
  这是典型“长期路线型 Issue”，建议维护者持续维护 operator gap 清单，并和在途 PR 建立更明确映射，方便社区判断收敛进度。

### 7.3 已标记 stale 但仍值得复核

- **#15044 fix: Null handling during velox to arrow conversion**  
  链接: facebookincubator/velox PR #15044  
  创建于 2025-10-04，且被标记 `stale`。  
  该 PR 涉及 **null VARCHAR 被写成空字符串** 的数据完整性问题，属于不应轻易搁置的 correctness 类问题。建议确认是否已被其他修复覆盖，否则应重新评估。

---

## 8. 结论

今天的 Velox 动态体现出两个鲜明主题：

1. **GPU/cuDF 正在加速从“可用”迈向“完整覆盖”**  
   Window、Decimal、LocalMerge、输出 batching 优化、统一基类诉求，显示这条路线已经非常清晰。

2. **correctness 与资源稳定性是当前最需要守住的底线**  
   Parquet 类型扩宽下推错结果/崩溃、JSON wildcard 兼容回归、内存无法回收、flaky test，都说明在快速扩功能的同时，需要更强的回归测试与边界验证。

综合判断，Velox 当前项目状态为：**研发势头强、工程治理在补强、GPU 路线亮眼，但存储下推正确性与内存稳定性应作为接下来 1~2 个迭代周期的重点质量主题。**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-25）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持了较高活跃度：Issues 更新 7 条，PR 更新 20 条，且关闭/合并量达到 10 条，说明维护者在持续推进问题收敛与代码清理。  
从内容看，今日重点集中在 **Velox 后端性能修复、Spark 4.0/4.1 兼容测试恢复、S3/对象存储配置治理、ColumnarBatch 内存释放** 等方向。  
一项值得关注的进展是，针对此前 “`select ... limit ...` 比原生 Spark 慢 10 倍” 的问题，相关修复 PR 已关闭，表明性能回归已得到阶段性处理。  
同时，社区也在继续推动中长期能力建设，包括 **TIMESTAMP_NTZ 支持、复杂类型 Parquet 原生写入、approx_percentile 聚合函数、Iceberg equality delete MOR 读取** 等。  
整体判断：**项目健康度良好，活跃度高，当前处于“稳定性修补 + 功能扩展并行推进”的状态。**

---

## 3. 项目进展

### 3.1 今日已合并/关闭的重要 PR

#### 1）修复 Velox `CollectLimit` 路径性能问题
- **PR:** #11802 `[VELOX] [GLUTEN-11766][VL] Implement the executeCollect() method in ColumnarCollectLimitExec`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11802
- **对应 Issue:** #11766
- **影响分析:**  
  这是今天最关键的性能推进之一。问题源于简单 `select * ... limit 10` 查询在 Gluten+Velox 下显著慢于 Vanilla Spark。PR 通过在 `ColumnarCollectLimitExec` 中实现 `executeCollect()`，使 `limit` 场景更接近 Spark 原生短路执行模式，减少不必要任务和执行开销。  
  这说明 Gluten 正在补齐 **轻量 OLAP 查询、交互式 SQL、小结果集返回** 场景下的执行效率短板。

#### 2）修复 `CollectLimit` 路径中的 ColumnarBatch 泄漏
- **PR:** #11754 `[VELOX] [VL] Close ColumnarBatch in ColumnarCollectLimitExec for skipped batches`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11754
- **影响分析:**  
  针对 `offset/limit` 处理过程中被跳过批次未及时释放的问题进行修复，属于典型的 **列式执行内存治理**。这类问题如果累积，会在大结果分页或复杂查询中引发 executor 内存压力。

#### 3）修复 ClickHouse 后端对应的批次释放问题
- **PR:** #11818 `[CLICKHOUSE] [CH] Close ColumnarBatch in CHColumnarCollectLimitExec for skipped batches`
- **状态:** OPEN
- **链接:** apache/gluten PR #11818
- **影响分析:**  
  虽未合并，但它与 #11754 形成明显呼应：维护者正在将相同的资源管理修复扩展到 ClickHouse 后端，说明社区在推进 **跨后端一致性稳定性治理**。

#### 4）移除 RAS，统一成本模型配置
- **PR:** #11756 `[CORE, VELOX, INFRA, CLICKHOUSE, DOCS, DATA_LAKE] [GLUTEN-11578][CORE] Remove RAS`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11756
- **影响分析:**  
  这是今天最有“架构整理”意味的改动之一。PR 明确包含破坏性配置变更：  
  `spark.gluten.ras.costModel` → `spark.gluten.costModel`  
  说明项目在核心优化框架上进行了收敛，减少历史包袱，有利于后续 Spark 4.x 适配和统一配置语义。

#### 5）持续恢复 Spark 4.0/4.1 测试兼容性
- **PR:** #11812 `[CORE] [GLUTEN-11550][UT] Enable GlutenMergeIntoDataFrameSuite and GlutenSparkSessionJobTaggingAndCancellationSuite`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11812
- **PR:** #11816 `[CORE] [GLUTEN-11550][UT] Enable 30 disabled test suites for Spark 4.0/4.1`
- **状态:** OPEN
- **链接:** apache/gluten PR #11816
- **影响分析:**  
  这表明 Gluten 对 Spark 4.0/4.1 的适配已经进入 **大规模回补测试、清理禁用 case、恢复稳定基线** 的阶段。对于依赖新版本 Spark 的企业用户，这比单一功能 PR 更能体现项目成熟度。

#### 6）加强计划稳定性测试机制
- **PR:** #11805 `[CORE, BUILD] [GLUTEN-11550][UT] Add golden file comparison for PlanStability test suites`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11805
- **影响分析:**  
  增加 golden file 对比可更早发现执行计划回归，对分析型引擎尤其关键。它有助于控制插件介入后对 Spark 物理计划的非预期影响。

#### 7）S3 配置清理与文档补强
- **PR:** #11810 `[CORE, VELOX, DOCS] [VL] Remove dead config spark.gluten.velox.fs.s3a.connect.timeout`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11810
- **PR:** #11806 `[VELOX, DOCS] [VL] Enhance VeloxS3 documentation with config details`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11806
- **PR:** #11807 `[VELOX] [VL] Add executor pool config`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11807
- **PR:** #11811 `[VELOX] [VL] Use CPUThreadPoolExecutor as DBI executors`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11811
- **影响分析:**  
  今日对象存储侧动作很多，集中在 **S3 配置正确性、线程池模型、I/O 执行器优化、文档透明度**。这通常反映出用户在云存储场景下已有较多真实负载，维护者正在快速修补配置易错点与性能瓶颈。

#### 8）提升脚本可移植性
- **PR:** #11778 `[SETUP] Use #!/usr/bin/env bash instead of #!/bin/bash in scripts`
- **状态:** CLOSED
- **链接:** apache/gluten PR #11778
- **影响分析:**  
  改动虽小，但对 NixOS 等环境兼容更友好，体现构建与开发者体验的持续打磨。

---

## 4. 社区热点

### 热点 1：Velox 未合入上游的 PR 跟踪
- **Issue:** #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **评论:** 16
- **👍:** 4
- **链接:** apache/gluten Issue #11585

**分析：**  
这是当前最活跃的讨论话题。它反映出 Gluten 与上游 Velox 的协同仍是项目核心工程现实：很多对 Gluten 有价值的能力已经在社区提交给 Velox，但尚未 upstream merge。  
背后的技术诉求是：
1. **减少维护私有 patch 的 rebase 成本**；
2. **尽快消费上游能力，提高发布稳定性**；
3. **避免 gluten/velox 分叉长期扩大**。  
这类 tracker 对观察项目路线图非常重要，通常意味着未来几个版本的功能边界很大程度受上游合并节奏影响。

### 热点 2：TIMESTAMP_NTZ 支持
- **Issue:** #11622 `[enhancement, good first issue] [VL] Support TIMESTAMP_NTZ Type`
- **评论:** 6
- **👍:** 2
- **链接:** apache/gluten Issue #11622
- **关联 PR:** #11626
- **PR 链接:** apache/gluten PR #11626

**分析：**  
这属于典型的 **Spark SQL 类型兼容性补齐**。问题核心不只是“加一个类型”，而是 Spark 与 Presto/Velox 对 timestamp 语义存在差异，尤其在 timezone / local semantics / physical representation 层面。  
该需求被标记为 `good first issue`，但实际技术复杂度不低，说明社区希望引导贡献者参与，同时也承认这是必须补齐的兼容项。

### 热点 3：简单 LIMIT 查询严重慢于原生 Spark
- **Issue:** #11766 `[enhancement] [VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`
- **评论:** 6
- **链接:** apache/gluten Issue #11766
- **关联 PR:** #11802
- **状态:** 已关闭
- **分析：**  
  这类问题对用户感知极强，因为它直接影响 BI、调试 SQL、抽样验证、Notebook 交互查询体验。问题被迅速闭环，说明维护者对 **“小查询低延迟”** 场景的重视度在提升。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：新报告的序列化崩溃
- **Issue:** #11819 `[bug, triage] UnsupportedOperationException in org.apache.gluten.vectorized.ColumnarBatchSerializerInstanceImpl.serializeStream(`
- **状态:** OPEN
- **创建/更新:** 2026-03-24
- **链接:** apache/gluten Issue #11819

**影响判断：**  
这是今天最需要优先关注的新 Bug。异常出现在 `ColumnarBatchSerializerInstanceImpl.serializeStream`，涉及 Spark 存储写路径，潜在影响包括：
- shuffle / spill / cache / block 写入链路；
- 列式批次序列化兼容性；
- 特定执行场景下直接失败。  

**当前 fix 状态：**  
暂未看到明确对应修复 PR。  
**建议：** 尽快补充复现场景、Spark 版本、是否仅 Velox 后端可见，以及是否与 recently merged 的 `CollectLimit`/serializer 逻辑有关。

---

### P1：TableScan preload 触发 OOM 后抛出误导性配置异常
- **Issue:** #11125 `[bug, triage] [VL] SQL_CONF_NOT_FOUND when TableScan's preload triggers OOM`
- **状态:** CLOSED
- **链接:** apache/gluten Issue #11125

**影响判断：**  
虽然已关闭，但这类问题本质上属于 **错误传播链不准确**：真实问题是 OOM，却表现为 `SQL_CONF_NOT_FOUND`。  
这会严重干扰用户定位问题，尤其在大表扫描和 preload 打开时。关闭说明该问题已阶段性处理，但建议后续关注是否有回归。

---

### P2：`limit` 查询性能回归
- **Issue:** #11766
- **状态:** CLOSED
- **链接:** apache/gluten Issue #11766
- **修复 PR:** #11802
- **PR 链接:** apache/gluten PR #11802

**影响判断：**  
不影响正确性，但影响用户对 Gluten 的基础性能信任。该问题已快速闭环，是今日稳定性改进的亮点。

---

### P2：死配置/误导配置导致运维困惑
- **Issue:** #11809 `[enhancement] Remove unused/misleading config: spark.gluten.velox.fs.s3a.connect.timeout`
- **状态:** CLOSED
- **链接:** apache/gluten Issue #11809
- **修复 PR:** #11810
- **PR 链接:** apache/gluten PR #11810

**影响判断：**  
这不是代码崩溃类 Bug，但对线上配置治理影响不小。用户可能以为某个参数生效，实际却被忽略，容易导致调优失效和排障误判。

---

## 6. 功能请求与路线图信号

### 1）TIMESTAMP_NTZ 支持进入落地阶段
- **Issue:** #11622
- **PR:** #11626 `[GLUTEN-11622][VL] Add basic TIMESTAMP_NTZ type support`
- **PR 状态:** OPEN
- **链接:** apache/gluten Issue #11622 / apache/gluten PR #11626

**路线图判断：**  
高概率进入下一阶段版本。已有实现 PR，说明不是纯讨论阶段。若合并，Gluten 在 Spark SQL 新类型兼容上会向前迈进一步。

---

### 2）复杂类型原生 Parquet 写入
- **PR:** #11788 `[CORE, VELOX] [VL] Enable native Parquet write for complex types (Struct/Array/Map)`
- **状态:** OPEN
- **链接:** apache/gluten PR #11788

**路线图判断：**  
这是非常重要的存储引擎能力增强。复杂类型原生写入直接关系到：
- Lakehouse 数据落盘能力；
- 嵌套结构写入性能；
- 与 Delta/Iceberg 等场景的兼容性。  
若合并，将显著增强 Velox 后端在生产写入链路中的实用性。

---

### 3）`approx_percentile` 聚合函数支持
- **PR:** #11651 `[GLUTEN-4889][VL] feat: Support approx_percentile aggregate function`
- **状态:** OPEN
- **链接:** apache/gluten PR #11651

**路线图判断：**  
这是典型 OLAP SQL 能力补齐。值得注意的是，PR 摘要已明确指出 Velox 与 Spark 的中间态算法不同（KLL vs GK），意味着实现不仅是算子映射，还牵涉：
- fallback 语义；
- 聚合状态兼容；
- 混合执行正确性。  
如果处理得当，会是对分析类函数支持的重要增强；如果处理不当，也可能带来 correctness 风险。

---

### 4）评估 S3CrtClient 性能
- **Issue:** #11815 `[enhancement] [VL] Evaluate S3CrtClient performance`
- **状态:** OPEN
- **链接:** apache/gluten Issue #11815

**路线图判断：**  
这释放出明显信号：Gluten 正在关注 **云对象存储高吞吐读写** 的进一步优化。S3CrtClient 相比传统 S3Client 更偏异步事件驱动，若测试结果积极，后续可能带来更大规模 S3 I/O 性能改进。

---

### 5）Iceberg equality delete MOR 支持仍在推进
- **PR:** #8056 `[WIP][GLUTEN-8055][VL] Support read Iceberg equality delete file MOR table`
- **状态:** OPEN / stale
- **链接:** apache/gluten PR #8056

**路线图判断：**  
尽管已长期悬而未决，但它仍是极具战略价值的 data lake 功能。一旦完成，将提高 Gluten 在 Iceberg 复杂读场景下的可用性。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 可提炼出以下真实用户痛点：

### 1）用户对“小查询延迟”非常敏感
- 代表案例：#11766  
即便 Gluten 在大查询吞吐上有优势，但如果 `select ... limit ...` 这类最常见交互式操作明显慢于原生 Spark，用户会直接质疑插件收益。  
这说明 Gluten 不仅要优化批量 OLAP，也要兼顾 **低延迟交互查询体验**。

### 2）类型兼容仍是 adoption 门槛
- 代表案例：#11622 / #11626  
用户希望 Spark SQL 层暴露的类型在 Gluten 中行为一致，尤其是 timestamp 这类高敏感数据类型。  
这反映出企业采用 Gluten 时，最大的顾虑之一仍是 **语义兼容性而非单点性能**。

### 3）对象存储配置复杂且容易误解
- 代表案例：#11809 / #11810 / #11806 / #11807 / #11811 / #11815  
围绕 S3 的配置、线程池、客户端实现、文档说明在一天内出现多项改动，说明真实用户在云环境部署中遇到不少调优与认知摩擦。  
痛点集中于：
- 参数是否真正生效；
- 并发模型是否合理；
- 文档是否足够明确；
- 默认线程池是否适合生产负载。

### 4）内存释放与资源生命周期仍是列式执行重点风险
- 代表案例：#11754 / #11818 / #11819  
多个问题都指向 ColumnarBatch 生命周期管理。这类问题一旦在大批量查询、分页、shuffle 场景中叠加，容易演变为稳定性事故。

---

## 8. 待处理积压

### 1）Velox 上游 PR 跟踪项长期存在，需持续治理
- **Issue:** #11585
- **状态:** OPEN
- **链接:** apache/gluten Issue #11585

**提醒：**  
这是技术债看板型 Issue，不是单点功能。若长期堆积，会增加 fork 维护成本、拖慢版本升级、影响下游功能交付节奏。建议维护者持续同步“已被上游吸收/仍需本地维护/准备放弃”的清单状态。

---

### 2）Iceberg equality delete MOR 支持长期停滞
- **PR:** #8056
- **状态:** OPEN / stale
- **链接:** apache/gluten PR #8056

**提醒：**  
该 PR 自 2024-11-26 起存在，涉及 Iceberg MOR 复杂读取，是 data lake 场景的重要缺口。建议明确：
- 是否继续推进；
- 是否需要拆分为更小 PR；
- 是否依赖上游 Velox 或 Spark 能力。

---

### 3）旧的构建实验性 PR 仍未收敛
- **PR:** #9491 `[stale, BUILD, VELOX] [VL] test arrow + new thrift`
- **状态:** OPEN / stale
- **链接:** apache/gluten PR #9491

**提醒：**  
该 PR 自 2025-05-01 存在，描述与测试信息不充分，建议维护者尽快决定关闭、重提或补齐上下文，避免长期占用审阅注意力。

---

### 4）TIMESTAMP_NTZ 支持需尽快明确语义边界
- **Issue:** #11622
- **PR:** #11626
- **链接:** apache/gluten Issue #11622 / apache/gluten PR #11626

**提醒：**  
虽然已有实现，但 timestamp 语义问题容易在跨时区、表达式计算、读写 round-trip 中产生隐蔽错误。建议在合并前强化：
- Spark 行为对齐测试；
- timezone/NTZ 边界 case；
- fallback 一致性验证。

---

## 结论

今天的 Apache Gluten 呈现出较强的工程推进节奏：  
一方面，项目快速修复了 **Velox `limit` 查询性能回归、ColumnarBatch 生命周期问题、S3 配置误导项**；另一方面，也在稳步推进 **Spark 4.x 兼容、TIMESTAMP_NTZ、复杂类型 Parquet 写入、approx_percentile、Iceberg MOR** 等中长期能力。  
从信号看，项目当前最重要的两条主线是：

1. **把 Spark 4.x + Velox/CH 后端的稳定性和可维护性做扎实**；  
2. **继续补齐 SQL 语义、数据湖格式与云存储场景的生产能力**。  

整体而言，Apache Gluten 今日表现为：**修复效率较高、功能路线明确，但在类型语义、对象存储调优、列式资源管理方面仍需持续投入。**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-25）

## 1. 今日速览

过去 24 小时 Apache Arrow 保持较高活跃度：Issues 更新 28 条、PR 更新 24 条，但**无新版本发布**。  
从内容看，今天的工作重点非常明确，主要集中在 **R 包发布/CRAN 兼容性修复**、**C++/Flight ODBC 打包与链接改进**、以及 **Python/Parquet 功能与安装链路调整**。  
关闭的事项不少（11 个 Issue、8 个 PR 已合并/关闭），说明维护者在积极清理历史积压；但同时也能看到不少 2022 年遗留 issue 因 stale 流程被批量关闭，真实功能推进更多集中在当前活跃分支。  
整体健康度评价：**活跃且偏“工程化收敛”**——短期重心不是大版本功能发布，而是 CI 稳定性、发布管线、平台兼容和存储/连接器能力补齐。

---

## 3. 项目进展

> 注：今日无新 release，以下聚焦“已关闭/已合并 PR”与“重要关闭事项”。

### 3.1 R 方向：CRAN/CI 稳定性持续收敛

- **PR #49581** `[CI][R] gcc sanitizer failure` 已关闭  
  链接: apache/arrow PR #49581  
  对应 Issue: **#49578** 已关闭  
  链接: apache/arrow Issue #49578  
  进展说明：修复了 R nightly / crossbow 中 gcc-asan 的失败，方案是**在 sanitizer 场景下跳过上游已知有问题的测试**。这类修复虽然不直接新增分析功能，但对 Arrow 的 R 查询接口、表达式绑定和发布可信度至关重要，减少了发布前噪声。

- **PR #49530** `[R] CI job shows NOTE due to "non-API call" Rf_findVarInFrame` 已关闭  
  链接: apache/arrow PR #49530  
  对应 Issue: **#49529** 已关闭  
  链接: apache/arrow Issue #49529  
  进展说明：移除了会触发 CRAN NOTE 的非 API 调用，属于**R 包合规性修复**。这对于 Arrow R 在 CRAN 上持续发布非常关键，也有助于避免因底层运行时调用方式不规范引发未来兼容性问题。

- **PR #49588** `MINOR: [R]: Update NEWS.md for 23.0.1.X-r releases` 已关闭  
  链接: apache/arrow PR #49588  
  进展说明：同步 R patch release 的 NEWS 内容，表明维护者正在推进 **23.0.1.x R 补丁发布线** 的整理和验收。

### 3.2 C++ 核心：`std::span` 迁移完成，现代化改造落地

- **PR #49492** `GH-48588 [C++] Migrate to stdlib span` 已关闭  
  链接: apache/arrow PR #49492  
  对应 Issue: **#48588** 已关闭  
  链接: apache/arrow Issue #48588  
  进展说明：Arrow C++ 完成从自定义 `arrow::util::span` 到标准库 `std::span` 的迁移。这是一次典型的**C++20 现代化收敛**：
  - 减少自维护兼容层
  - 降低模板/工具代码负担
  - 为后续标准库能力统一铺路

  对分析型存储引擎而言，这类基础设施重构会提升长期可维护性，但也带来了编译器/标准库兼容面的新风险，今天新开的 **#49388** 就与 `span` 相关，见后文。

### 3.3 文档与历史积压清理

今日有多条 2022 年遗留 issue 被 stale 流程关闭，包括：

- **#30967** `[Python] handle timestamp type in parquet file for compatibility with older HiveQL`  
  链接: apache/arrow Issue #30967
- **#30971** `[C++][Python] Log warning when user tries to write parquet table with incompatible type`  
  链接: apache/arrow Issue #30971
- **#30969** `[Docs] Clarify existing_data_behavior docstring`  
  链接: apache/arrow Issue #30969
- **#30991** `[Dev][C++] Validate array structure in GDB extension`  
  链接: apache/arrow Issue #30991
- **#30986** `[Website] Merge script/CI do not recognize MINOR PRs`  
  链接: apache/arrow Issue #30986
- **#30985** `[C++] OT logging for memory pool allocations`  
  链接: apache/arrow Issue #30985
- **#30982** `[C++] Making warning handler configurable`  
  链接: apache/arrow Issue #30982
- **#48662** `[R] Remove trace$calls %||% trace$call once rlang > 0.4.11 is released`  
  链接: apache/arrow Issue #48662

这些关闭更多反映**维护节奏治理**而非直接功能落地。对外部用户来说，需注意：被 stale 关闭并不代表诉求不重要，只是当前没有维护资源跟进。

---

## 4. 社区热点

### 热点 1：R 生态发布与 CI 修复密集推进
- **Issue #49587** `[R] CRAN packaging checklist for version 23.0.1.2`  
  链接: apache/arrow Issue #49587
- **PR #49589** `WIP: [R] Verify CRAN release 23.0.1.2`  
  链接: apache/arrow PR #49589
- **Issue #49593** `[R][CI] Add libuv-dev to CI jobs due to update to fs package`  
  链接: apache/arrow Issue #49593
- **PR #49594** `GH-49593: [R][CI] Add libuv-dev to CI jobs due to update to fs package`  
  链接: apache/arrow PR #49594
- **Issue #49591** `[R][CI] r-binary-packages crossbow job fails for CRAN patch releases`  
  链接: apache/arrow Issue #49591
- **PR #49592** `GH-49591: [R][CI] r-binary-packages crossbow job fails for CRAN patch releases`  
  链接: apache/arrow PR #49592

**技术诉求分析：**  
Arrow R 当前最强烈的信号是“**确保补丁版本可持续发布**”。问题并不在查询语义本身，而在外围发布链路：依赖包 `fs` 改变了 libuv 的安装策略、Crossbow 对 4 段版本号支持不足、CRAN 校验要求趋严。这说明 Arrow 在 R 生态中已经进入**持续运营阶段**，维护者必须把发布自动化与系统依赖管理做得更稳。

### 热点 2：Flight ODBC 平台打包能力升温
- **Issue #49538** `[C++][FlightRPC][ODBC] Change Windows ODBC to Static Linkage`  
  链接: apache/arrow Issue #49538
- **Issue #49595** `[C++][FlightRPC][ODBC] DEB Linux Installer`  
  链接: apache/arrow Issue #49595
- **Issue #47877** `[C++][FlightRPC][ODBC] RPM Linux Installer`  
  链接: apache/arrow Issue #47877
- **PR #49575** `[C++][FlightRPC][ODBC] Remove libunwind dynamic linked library in macOS Intel CI`  
  链接: apache/arrow PR #49575

**技术诉求分析：**  
Arrow Flight SQL / ODBC 的重点正在从“功能可用”转向“**企业级分发可落地**”：  
- Windows 需要静态链接，减少 DLL 签名与部署复杂度  
- Linux 需要 DEB/RPM 安装器  
- macOS Intel CI 需要摆脱动态依赖波动

这表明 Flight ODBC 正在向更成熟的**连接器产品化**阶段推进，对 BI 工具接入、企业桌面分发和安全合规尤为关键。

### 热点 3：Python/Parquet 仍是功能演进核心
- **Issue #49474** `[Python] Memory Leak while iterating batches of pyarrow dataset`  
  链接: apache/arrow Issue #49474
- **PR #49377** `[Python][Parquet] Add ability to write Bloom filters from pyarrow`  
  链接: apache/arrow PR #49377
- **PR #49590** `deprecate feather python`  
  链接: apache/arrow PR #49590
- **PR #49571** `[Python] Skip header files when installing compiled Cython files`  
  链接: apache/arrow PR #49571
- **PR #49567** `[Python] Copy CKmsConnectionConfig instead of trying to move the const received one`  
  链接: apache/arrow PR #49567

**技术诉求分析：**  
Python 方向呈现三条线并行：
1. **Parquet 能力增强**：Bloom filter 写入支持，有利于下游谓词裁剪与读性能。
2. **安装/构建链路修复**：editable install、nightly verification、freethreading 构建问题。
3. **格式接口收敛**：Feather Python 模块计划向 IPC 统一，减少重复 API 面。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：PyArrow dataset 迭代批次疑似内存泄漏
- **Issue #49474** `[Python] Memory Leak while iterating batches of pyarrow dataset`  
  链接: apache/arrow Issue #49474  
  状态：OPEN  
  是否已有 fix PR：**暂无明确对应 PR**

**影响分析：**  
用户在 HPC 集群上迭代大型 Hive 分区 Parquet 数据集时遭遇 OOM kill，这类问题对 OLAP/批处理场景影响非常大。因为 Arrow dataset 常用于流式扫描和批次读取，一旦迭代过程中存在引用未释放或内存池回收异常，就会直接破坏“分批处理降低内存占用”的核心承诺。  
**建议关注级别：最高。**

### P1：C++/CI 在 libc++ 22.1.1 下测试失败
- **Issue #49586** `[C++][CI] StructToStructSubset test failure with libc++ 22.1.1`  
  链接: apache/arrow Issue #49586  
  状态：OPEN  
  是否已有 fix PR：**暂无**

**影响分析：**  
问题根因指向 libc++ 中 `std::multimap` 行为变化，属于**标准库升级触发的兼容性回归**。虽然目前表现为 CI 测试失败，但这类问题若扩散到运行时语义，会影响结构体投影/子集提取等数据正确性相关逻辑。应尽快定位是否仅测试假设过时，还是实现依赖了未稳定行为。

### P2：C++ 编译报错 `'span' file not found`
- **Issue #49388** `[C++] fatal error: 'span' file not found`  
  链接: apache/arrow Issue #49388  
  状态：OPEN  
  是否已有 fix PR：**间接相关：#49492 已完成 std::span 迁移**

**影响分析：**  
在 Rocky Linux 8.10 + intel-compiler-llvm 环境中出现 `span` 缺失，说明 Arrow 在拥抱 C++20 标准库后，**编译器/标准库矩阵要求变得更严格**。这不是运行时 bug，但会影响企业 HPC、旧 Linux toolchain、受限发行版上的部署。

### P2：R 发布管线对 4 段版本号支持不足
- **Issue #49591** `[R][CI] r-binary-packages crossbow job fails for CRAN patch releases`  
  链接: apache/arrow Issue #49591  
- **PR #49592** 对应修复  
  链接: apache/arrow PR #49592

**影响分析：**  
这是典型发布工程问题，影响补丁包产出，而不影响数据正确性。已有修复 PR，风险可控。

### P2：R CI 因上游 `fs` 包策略变化而失败
- **Issue #49593** `[R][CI] Add libuv-dev to CI jobs due to update to fs package`  
  链接: apache/arrow Issue #49593  
- **PR #49594** 对应修复  
  链接: apache/arrow PR #49594

**影响分析：**  
上游依赖改变导致系统包 `libuv-dev` 需要显式安装。属于**外部依赖漂移**，已有修复 PR。

### P3：Python editable install / nightly 验证失败
- **PR #49571** `[Python] Skip header files when installing compiled Cython files`  
  链接: apache/arrow PR #49571  
  状态：OPEN，awaiting changes

**影响分析：**  
主要影响开发者安装与 CI 验证，不直接影响查询运行，但会降低贡献者开发体验，拖慢 Python 侧迭代。

### P3：Python freethreading 构建问题
- **PR #49567** `[Python] Copy CKmsConnectionConfig instead of trying to move the const received one`  
  链接: apache/arrow PR #49567  
  状态：OPEN

**影响分析：**  
表明 Arrow 正在适配更新的 Python 运行时/并发模型，对未来 Python 生态兼容性有积极意义。

---

## 6. 功能请求与路线图信号

### 6.1 R：Azure Blob Filesystem 支持，落地概率高
- **PR #49553** `[R] Expose azure blob filesystem`  
  链接: apache/arrow PR #49553

**判断：高概率进入下一版本/补丁后的近期版本**  
原因：
- C++ 和 PyArrow 已经具备 Azure 支持
- R 目前已支持 AWS/GCS，补齐 Azure 属于自然延伸
- 这是典型云对象存储能力对齐，用户价值明确

**潜在影响：**
- Arrow R 用户可直接把 Azure Blob 当作统一文件系统访问
- 有助于跨云湖仓/对象存储分析场景

### 6.2 Python/Parquet：Bloom Filter 写入支持，价值高
- **PR #49377** `[Python][Parquet] Add ability to write Bloom filters from pyarrow`  
  链接: apache/arrow PR #49377

**判断：较高概率纳入后续版本**  
这是面向存储优化的实用特性。Parquet Bloom filter 能改善高选择性过滤场景下的 IO 剪枝，尤其对大规模分析型存储很重要。若 PR 顺利合并，将增强 PyArrow 在数据湖写入侧的“生产可用性”。

### 6.3 R：dplyr 语义覆盖继续扩展
- **PR #49536** `[R] Implement dplyr recode_values(), replace_values(), and replace_when()`  
  链接: apache/arrow PR #49536
- **PR #49535** `[R] Implement dplyr's when_any() and when_all() helpers`  
  链接: apache/arrow PR #49535

**判断：中高概率纳入下一版本**  
这反映 Arrow R 正继续补齐 dplyr 接口，使用户能在 Arrow 后端执行更多数据整理逻辑，增强其作为分析执行后端的吸引力。

### 6.4 Flight ODBC：安装器与静态链接需求是明确路线图信号
- **Issue #49538** Windows 静态链接  
  链接: apache/arrow Issue #49538
- **Issue #49595** DEB 安装器  
  链接: apache/arrow Issue #49595
- **Issue #47877** RPM 安装器  
  链接: apache/arrow Issue #47877

**判断：属于中期产品化路线，而非立即功能发布**  
这类工作一旦完成，将显著提升 Flight SQL/ODBC 在企业 BI 接入链条中的可部署性。

### 6.5 Python：Feather API 弃用信号明确
- **PR #49590** `deprecate feather python`  
  链接: apache/arrow PR #49590

**判断：大概率会进入后续版本，并可能伴随迁移提示**  
Feather V2 已与 Arrow IPC file format 等价，独立 `pyarrow.feather` 模块的存在价值下降。  
**迁移方向信号：**从 `pyarrow.feather` 转向 `pyarrow.ipc`。

---

## 7. 用户反馈摘要

### 7.1 HPC/大数据集用户最关心内存可控性
- **Issue #49474**  
  链接: apache/arrow Issue #49474

真实场景是：在 HPC 集群中读取并过滤大型 Hive 分区 Parquet 数据集，本应依赖 Arrow 的 batch 迭代来降低峰值内存，但用户仍遭遇 OOM。  
**提炼出的痛点：**
- 用户将 Arrow 视作“低内存流式扫描”基础设施
- 一旦内存释放不及时，实际部署价值会被严重削弱
- 该问题比功能缺失更影响生产信任

### 7.2 企业用户关注安装复杂度与签名/分发成本
- **Issue #49538**  
  链接: apache/arrow Issue #49538

Windows ODBC 静态链接诉求非常企业化，不是简单“能不能跑”，而是“**能不能低摩擦地交付到终端环境**”。  
这说明 Flight ODBC 已开始进入需要考虑 DLL 签名、安装包数量、合规流程的阶段。

### 7.3 R 用户重视 CRAN 可用性胜过新功能速度
- **Issue #49587 / #49591 / #49593**  
  链接: apache/arrow Issue #49587  
  链接: apache/arrow Issue #49591  
  链接: apache/arrow Issue #49593

从今天的 R 相关问题看，用户和维护者都更关注：
- 包能否稳定通过 CRAN
- patch 版本能否顺利构建
- 上游依赖波动是否会破坏发布

这类反馈体现出 Arrow R 已是成熟用户群在依赖的工具，而非实验性接口。

### 7.4 兼容旧生态的需求仍然存在，但优先级下降
- **Issue #30967** Hive 旧版 timestamp/INT96 兼容  
  链接: apache/arrow Issue #30967

尽管该 issue 因 stale 被关闭，但其背后反映的是现实痛点：Arrow/Parquet 用户仍需与旧版 HiveQL/传统大数据栈兼容。  
维护者没有继续推进，说明项目当前更倾向于面向现代格式和新接口，而不是长期维护历史兼容负担。

---

## 8. 待处理积压

以下事项值得维护者重点关注：

### 8.1 高风险未决：PyArrow dataset 迭代内存泄漏
- **Issue #49474**  
  链接: apache/arrow Issue #49474  
**原因：** 直接影响生产环境可用性，目前未见修复 PR。

### 8.2 Flight UCX 技术债长期存在
以下均为 2022 年遗留、今天仍有活动但长期未解决：

- **#31543** `[C++][FlightRPC] Investigate TSAN with gRPC/UCX tests`  
  链接: apache/arrow Issue #31543
- **#31536** `[C++][FlightRPC] Improve concurrent call implementation in UCX client`  
  链接: apache/arrow Issue #31536
- **#31535** `[C++][FlightRPC] Pipeline memory allocation/registration`  
  链接: apache/arrow Issue #31535
- **#31534** `[C++][FlightRPC] Implement shutdown with deadline for UCX`  
  链接: apache/arrow Issue #31534
- **#31533** `[C++][FlightRPC] UCX server should be able to shed load`  
  链接: apache/arrow Issue #31533

**提醒：**  
这些问题集中体现了 Flight UCX 在高并发、关闭语义、负载保护、TSAN 可测性等方面的长期技术债。如果 Arrow 计划继续推动 Flight 在高性能网络/分布式分析场景中的使用，这部分需要更明确的 roadmap。

### 8.3 C++20 迁移后的工具链兼容回归
- **Issue #49388**  
  链接: apache/arrow Issue #49388

`std::span` 迁移虽然已完成，但编译矩阵上的问题需要补充说明或在 CMake/文档层面给出最低工具链要求，否则会持续影响老环境用户。

### 8.4 长期开放的 Windows ARM64 PyArrow 支持
- **PR #48539** `[Python][CI] Add support for building PyArrow library on Windows ARM64`  
  链接: apache/arrow PR #48539

这是平台扩展的重要工作，但仍处于 awaiting change review。随着 Windows on ARM 设备增长，该 PR 值得重新提升优先级。

### 8.5 仍在等待评审的 Parquet 写入增强
- **PR #49527** `[C++][Parquet] Add BufferedStats API to RowGroupWriter`  
  链接: apache/arrow PR #49527
- **PR #49377** `[Python][Parquet] Add ability to write Bloom filters from pyarrow`  
  链接: apache/arrow PR #49377

这两项都与**Parquet 写入侧优化**直接相关，前者帮助更好地决定 row group 切分，后者增强过滤元数据能力，建议加快评审。

---

## 总结判断

今天的 Apache Arrow 没有版本发布，但项目活动密集且方向清晰：  
- **短期**：R/CRAN 发布链路、CI 稳定性、平台依赖修复是最强主线。  
- **中期**：Flight ODBC 正向企业可分发形态迈进，安装器与静态链接是明确路线图信号。  
- **核心能力面**：Parquet/Python 仍在持续增强，尤其是 Bloom filter 写入、安装链路与兼容性问题。  
- **主要风险**：dataset 批次迭代内存泄漏、C++20 工具链兼容、libc++ 行为变化带来的测试/语义不确定性。

如果你愿意，我可以继续把这份日报再加工成：
1. **适合内部周报的“管理层摘要版”**，或  
2. **适合技术团队的“按组件分类表格版”**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*