# Apache Doris 生态日报 2026-03-24

> Issues: 4 | PRs: 105 | 覆盖项目: 10 个 | 生成时间: 2026-03-24 01:17 UTC

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

# Apache Doris 项目动态日报 · 2026-03-24

## 1. 今日速览

过去 24 小时内，Apache Doris 保持了**很高的开发活跃度**：Issues 更新 4 条、PR 更新 105 条，其中 74 条待合并、31 条已合并或关闭。  
从内容看，今日工作重心主要集中在三类方向：**湖仓连接器/外表能力增强、查询执行与存储层性能优化、以及若干高风险正确性与安全问题修复**。  
Issue 数量不多，但质量“偏重”：出现了 **Iceberg 扫描导致 BE 崩溃**、**物化视图命中导致查询结果不一致**、以及 **Ranger 列权限绕过** 等值得高度关注的问题。  
整体而言，项目健康度仍然较高，主干开发和分支回捞并行推进明显，但同时也反映出 Doris 在多目录、多格式、多权限体系下，**复杂场景正确性与安全边界**仍是近期治理重点。

---

## 2. 项目进展

> 注：所给数据中未列出完整的 31 条已合并/关闭 PR 明细，以下聚焦“今日状态发生推进、且对产品能力影响较大”的重要 PR/已关闭项。

### 2.1 查询引擎与执行层优化

- **共享 Scanner LIMIT 配额，减少并发扫描浪费**
  - PR: #61617 `[Improvement](scan) Update scanner limit controller`
  - 链接: https://github.com/apache/doris/pull/61617
  - 价值：当前多个并发 Scanner 各自持有 SQL LIMIT，可能出现 `LIMIT 10` 实际底层读取远超 10 行的问题。该 PR 在 `ScannerContext` 层引入共享原子计数器，能显著减少无效 IO/CPU 消耗。
  - 影响：这属于典型的**执行层资源利用优化**，对高并发 OLAP 查询、尤其是低 LIMIT 点查/过滤场景有直接收益。

- **Nereids 优化器下推项目表达式，为存储裁剪创造条件**
  - PR: #61635 `[dev/4.0.x] [opt](nereids) rewrite PreferPushDownProject to slots before filter-join pushdown`
  - 链接: https://github.com/apache/doris/pull/61635
  - 价值：将表达式改写为 slot/alias 后再参与 filter-join 下推，使 join 之下暴露嵌套字段访问路径，从而提升**存储层 pruning 加速**机会。
  - 影响：是典型的**优化器到存储层协同优化**，有利于复杂谓词、半结构化字段和嵌套列访问场景。

- **TopN 懒物化列合并前增加类型检查**
  - PR: #61633 `[chore](topn) check column type before merging lazy materialization columns`
  - 链接: https://github.com/apache/doris/pull/61633
  - 价值：避免列类型不匹配触发 coredump，属于对执行器鲁棒性的补强。
  - 影响：虽然是“chore”标签，但实质上是在预防**线上崩溃类问题**。

### 2.2 外部数据源 / 湖仓生态能力推进

- **外部 Catalog SPI 框架引入，ES 作为首个试点**
  - PR: #61604 `[refactor](fe) Add CatalogProvider SPI framework and migrate ES as pilot`
  - 链接: https://github.com/apache/doris/pull/61604
  - 价值：为外部数据源 catalog 建立 SPI 插件框架，支持**动态加载与 ClassLoader 隔离**，ES 已先行迁移。
  - 影响：这是很强的路线图信号，意味着 Doris 正在从“内建若干连接器”走向**插件化 catalog 生态**，后续对 Paimon/Hudi/Iceberg/JDBC 类连接器治理会更系统。

- **Paimon JNI 扫描链路 JDBC Driver 注册修复**
  - PR: #61513 `[dev/4.1.x] [fix](fe) Fix Paimon JDBC driver registration for JNI scans`
  - 链接: https://github.com/apache/doris/pull/61513
  - 价值：修复 Paimon system table 通过 BE JNI scanner 查询时 `No suitable driver found` 的问题。
  - 影响：提升 Paimon 元数据表可用性，属于**连接器可用性修复**。

- **Paimon 外表写入能力：支持 INSERT INTO / OVERWRITE**
  - PR: #61463 `[feature](paimon) implemet INSERT INTO for Paimon external tables`
  - 链接: https://github.com/apache/doris/pull/61463
  - 价值：从只读能力向写入能力扩展，是 Doris 与湖格式深度集成的重要一步。
  - 影响：若落地，将明显增强 Doris 作为**统一 SQL 入口/湖仓计算前端**的能力。

- **Iceberg Action 校验修复**
  - PR: #61381 `[fix](iceberg) Fix execute action validation gaps`
  - 链接: https://github.com/apache/doris/pull/61381
  - 价值：修复 `rollback_to_timestamp` 时间戳解析、`rewrite_data_files` 参数校验等问题。
  - 影响：说明 Doris 对 Iceberg 管理操作的覆盖在持续完善，但也表明相关路径仍处于快速迭代期。

- **Iceberg DML 能力继续推进**
  - PR: #60482 `[feature](iceberg) Implements iceberg update delete merge into functionality`
  - 链接: https://github.com/apache/doris/pull/60482
  - 价值：推进 Iceberg 的 `UPDATE/DELETE/MERGE INTO` 支持。
  - 影响：如果后续稳定合入，将是 Doris 湖仓 SQL 兼容性的重要里程碑。

### 2.3 元数据与服务治理

- **HMS Client Pool 迁移到 Commons Pool**
  - PR: #61553 `[improvement](fe) Migrate HMS client pool to Commons Pool`
  - 链接: https://github.com/apache/doris/pull/61553
  - 价值：将自管队列式池化迁移到 `commons-pool2`，改善连接池治理和资源边界。
  - 影响：对 Hive Metastore 交互稳定性、长时间运行的 FE 元数据服务健壮性都有正向作用。

- **新增每分区 bucket 数量上限配置**
  - PR: #61576 `[kind/behavior-changed, dev/4.1.x] [opt](config) add max_bucket_num_per_partition config to limit bucket number`
  - 链接: https://github.com/apache/doris/pull/61576
  - 价值：给建表/加分区时的桶数增加显式上限。
  - 影响：这是**行为变更**类优化，能避免误配置导致的小表碎片化、调度膨胀、元数据负担和 compaction 压力。

### 2.4 存储与云环境

- **S3 flush response stream 瞬时错误增加重试**
  - PR: #61636 `[fix](s3) Add retry for S3 flush response stream transient error`
  - 链接: https://github.com/apache/doris/pull/61636
  - 价值：为 AWS SDK 错判为不可重试的瞬时错误补充 bounded retry，并加入观测指标。
  - 影响：提升对象存储写入链路稳定性，对云上部署用户意义较大。

- **Cloud 场景 schema change 排队期间启用新 tablet compaction 回捞**
  - PR: #61628 / #61629
  - 链接:  
    - https://github.com/apache/doris/pull/61628  
    - https://github.com/apache/doris/pull/61629
  - 价值：将 #61089 的优化分别回捞到 4.0 / 4.1 分支。
  - 影响：说明维护者正在积极将云环境关键优化回灌至稳定分支。

### 2.5 已关闭项

- **4.1 分支 cherry-pick 打包 PR 已关闭**
  - PR: #61620 `pick memcpy alignement and datetime related pr to 4.1`
  - 链接: https://github.com/apache/doris/pull/61620
  - 说明：是一个分支维护动作，表明 4.1 线仍在积极吸收修复。

---

## 3. 社区热点

### 3.1 Iceberg 扫描/导入触发 BE 崩溃
- Issue: #61225 `[Bug] BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg table scanning/loading`
- 链接: https://github.com/apache/doris/issues/61225

**热度判断**：这是今日最值得关注的稳定性议题之一。  
**技术诉求**：用户要求 Doris 在 Iceberg 扫描/加载数据时具备更强的**编码容错、字典解码边界保护和异常隔离能力**。  
**背后信号**：Iceberg 路径当前开发很活跃（#61381、#60482、#61485 等），但活跃也意味着**复杂格式兼容和执行稳定性仍在磨合**。对于将 Doris 作为湖仓查询前端的用户，这类崩溃问题优先级极高。

### 3.2 物化视图命中导致同 SQL 结果不一致
- Issue: #61228 `[Bug] why the same sql select the result is different, MATERIALIZED problem`
- 链接: https://github.com/apache/doris/issues/61228

**热度判断**：虽然评论不多，但这是典型的**查询正确性问题**。  
**技术诉求**：用户关注物化视图改写命中的判定逻辑是否过宽，尤其在 SQL 使用了 MV 中并不存在的字段时，为什么仍然命中。  
**背后信号**：这反映了优化器/MV 改写在复杂聚合与明细字段混用场景下仍可能存在**语义校验不足**，属于比性能问题更敏感的类别。

### 3.3 Ranger 列级权限绕过
- Issue: #61631 `[Bug] Ranger column-level privilege bypass when CTE (WITH ... AS) is combined with JOIN`
- 链接: https://github.com/apache/doris/issues/61631

**热度判断**：这是今日最严重的问题之一，虽然刚创建、评论尚少，但性质为**安全漏洞级别**。  
**技术诉求**：用户要求在 CTE + JOIN 等查询重写场景下，列权限检查必须保持严格一致，不能因语义层改写而绕过 Ranger 策略。  
**背后信号**：随着 Doris SQL 能力和优化器复杂度增加，**权限系统与逻辑改写的组合验证**变得越来越关键。

### 3.4 Catalog SPI 插件化框架
- PR: #61604 `[refactor](fe) Add CatalogProvider SPI framework and migrate ES as pilot`
- 链接: https://github.com/apache/doris/pull/61604

**热度判断**：这是今天最具中长期影响力的架构性 PR 之一。  
**技术诉求**：社区希望 catalog/connector 具备更清晰的插件边界、动态装载能力和依赖隔离。  
**背后信号**：Doris 正从“功能堆叠”升级为**平台化的多数据源分析引擎**。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P0 / 安全级
1. **Ranger 列级权限绕过：CTE + JOIN 可绕过权限控制**
   - Issue: #61631
   - 链接: https://github.com/apache/doris/issues/61631
   - 影响：可能导致未授权列被访问，属于安全与合规风险。
   - 当前状态：**未见对应 fix PR** 出现在本批数据中，建议维护者优先响应。

### P0 / 崩溃级
2. **Iceberg 扫描/加载触发 BE SIGSEGV + `std::out_of_range`**
   - Issue: #61225
   - 链接: https://github.com/apache/doris/issues/61225
   - 影响：直接造成 BE 崩溃，影响线上可用性。
   - 相关 PR：
     - #61381 Iceberg action 校验修复：https://github.com/apache/doris/pull/61381
     - #61485 Data lake reader 重构：https://github.com/apache/doris/pull/61485
   - 判断：**尚无明确对口修复**，但 Iceberg 相关活跃 PR 说明维护者已在持续治理该模块。

### P1 / 正确性级
3. **命中物化视图后，同 SQL 结果不一致**
   - Issue: #61228
   - 链接: https://github.com/apache/doris/issues/61228
   - 影响：破坏查询结果可信度，是分析型数据库的核心风险之一。
   - 相关 PR：
     - #61635 Nereids 下推改写优化：https://github.com/apache/doris/pull/61635
     - #61439 回滚 COUNT_NULL 下推实现：https://github.com/apache/doris/pull/61439
   - 判断：相关优化器与执行器改动频繁，但**未见直接针对该 issue 的 fix PR**。

### P1 / 兼容性级
4. **Hive CSV 外表跨物理行读取**
   - PR: #61614 `[fix](csv) Honor Hive CSV physical line boundaries`
   - 链接: https://github.com/apache/doris/pull/61614
   - 影响：会造成记录切分错误，影响查询结果与 Hive 兼容性。
   - 当前状态：已有修复 PR，值得关注合入进度。

### P1 / 可用性级
5. **Paimon JDBC 驱动注册失败导致 system table 查询失败**
   - PR: #61513
   - 链接: https://github.com/apache/doris/pull/61513
   - 影响：Paimon 元数据访问失败，功能不可用。
   - 当前状态：已有 fix PR。

### P2 / 云环境稳定性
6. **S3 flush response stream 瞬时错误导致写入失败**
   - PR: #61636
   - 链接: https://github.com/apache/doris/pull/61636
   - 影响：对象存储写入稳定性下降。
   - 当前状态：已有 fix PR，且加入可观测指标，处理方式较完整。

### P3 / 运维配置
7. **FQDN 启用后如何关闭**
   - Issue: #61627
   - 链接: https://github.com/apache/doris/issues/61627
   - 影响：偏运维与部署体验问题，主要涉及 FE/BE 节点地址管理。
   - 当前状态：暂无关联 PR，建议文档或 FAQ 补充。

---

## 5. 功能请求与路线图信号

虽然今日新增 Issue 以 Bug 为主，但从活跃 PR 可以看到清晰的路线图方向：

### 5.1 湖仓写入与 DML 能力继续增强
- Iceberg `UPDATE/DELETE/MERGE INTO`
  - PR: #60482
  - 链接: https://github.com/apache/doris/pull/60482
- Paimon `INSERT INTO / INSERT OVERWRITE`
  - PR: #61463
  - 链接: https://github.com/apache/doris/pull/61463

**判断**：这些能力非常可能进入后续版本重点特性列表。Doris 正在从“能读外表”走向“能对湖表执行更完整 SQL 写操作”。

### 5.2 外部 Catalog 插件化
- PR: #61604
- 链接: https://github.com/apache/doris/pull/61604

**判断**：这是中长期架构演进信号，未来新增连接器、独立发布插件、依赖冲突隔离都会更容易，极有可能成为 4.x/5.x 期间的重要基础设施能力。

### 5.3 动态计算与流式元数据能力
- PR: #61382 `[feat](dynamic table) support stream part 1: stream meta data & basic DDL`
- 链接: https://github.com/apache/doris/pull/61382

**判断**：说明 Doris 在探索更实时、更持续计算的模型，可能为未来“动态表/流表/增量计算”能力打基础。

### 5.4 全局单调递增 TSO
- PR: #61199 `[feature](tso) Add global monotonically increasing Timestamp Oracle(TSO)`
- 链接: https://github.com/apache/doris/pull/61199

**判断**：这属于底层事务/时序协调能力建设，通常服务于更高级的事务一致性、流批一体或跨组件协调场景，是偏 5.0 方向的重要信号。

### 5.5 SQL 分析函数扩展
- PR: #61566 `[Improvement](function) support window funnel v2`
- 链接: https://github.com/apache/doris/pull/61566

**判断**：面向增长分析、用户路径分析等行为分析场景，说明 Doris 仍在增强面向 BI/用户行为分析的原生 SQL 函数集。

---

## 6. 用户反馈摘要

基于今日 Issues，可提炼出几类真实用户痛点：

1. **湖仓场景稳定性仍是企业用户核心关注点**
   - 代表：#61225
   - 用户在 Iceberg 表扫描/加载中直接遇到 BE 崩溃，说明外表与数据湖路径已经进入生产使用，但用户对 Doris 的期待不只是“支持”，而是“生产级稳定”。

2. **查询正确性优先于性能收益**
   - 代表：#61228
   - 用户发现物化视图命中后结果变化，这类问题会迅速削弱对优化器的信任。对 OLAP 产品而言，性能优化必须建立在**可解释、可验证的语义正确性**之上。

3. **复杂 SQL 与权限系统组合场景需要更严密测试**
   - 代表：#61631
   - 企业用户显然已在 Doris 上使用 Ranger 做细粒度治理；当 CTE、JOIN、重写与权限检查耦合时，任何漏检都具有高风险。

4. **运维可逆性与配置文档体验有待提升**
   - 代表：#61627
   - FQDN 一旦启用后如何关闭，反映出用户在集群生命周期运维中需要更明确的“变更—回滚”指导，而不只是功能说明。

---

## 7. 待处理积压

以下项目虽未必是“今天新建”，但从状态与影响看，建议维护者持续关注：

### 7.1 长期开启且影响大的功能/重构 PR
- **#57410** `[feature](filecache) A 2Q-LRU mechanism for protecting hotspot data in the normal queue`
  - 链接: https://github.com/apache/doris/pull/57410
  - 关注原因：创建于 2025-10-28，属于文件缓存热点保护机制，潜在收益大，但长期未完成，说明实现或评审复杂度较高。

- **#60482** `[feature](iceberg) Implements iceberg update delete merge into functionality`
  - 链接: https://github.com/apache/doris/pull/60482
  - 关注原因：Iceberg DML 是高价值功能，但实现面广、风险高，建议尽快明确分阶段合入策略。

- **#61199** `[feature](tso) Add global monotonically increasing Timestamp Oracle(TSO)`
  - 链接: https://github.com/apache/doris/pull/61199
  - 关注原因：底层能力重要、影响范围广，宜明确设计文档和版本落地节奏。

### 7.2 已标记 stale 的修复 PR
- **#56400** `[Stale] [fix](audit) Clean up auditEventBuilder immediately after submission`
  - 链接: https://github.com/apache/doris/pull/56400
- **#56409** `[Stale] [fix](function) fix get_json_string does not support array`
  - 链接: https://github.com/apache/doris/pull/56409

**关注原因**：如果问题仍存在，长期 stale 会影响用户对函数兼容性和审计逻辑稳定性的感知。建议维护者确认是否仍需推进，避免“已知问题悬而未决”。

### 7.3 今日高风险但暂无明确修复入口的 Issue
- **#61631** Ranger 列权限绕过
  - 链接: https://github.com/apache/doris/issues/61631
- **#61225** Iceberg 扫描 BE 崩溃
  - 链接: https://github.com/apache/doris/issues/61225
- **#61228** 物化视图命中导致结果不一致
  - 链接: https://github.com/apache/doris/issues/61228

**建议**：这三类问题分别对应**安全、稳定性、正确性**三条主线，建议优先补充 owner、复现状态、影响版本与关联修复 PR。

---

## 8. 综合评估

今天的 Apache Doris 呈现出典型的**高活跃、高演进速度**状态：  
一方面，Catalog SPI、Paimon 写入、Iceberg DML、TSO、动态表等工作显示出项目在**湖仓融合、平台化、实时化**上的强烈进取心；  
另一方面，Iceberg 崩溃、MV 正确性偏差、Ranger 权限绕过也提醒我们，随着能力快速扩张，**正确性、安全性与复杂场景回归测试**必须同步加强。  

如果只用一句话总结今天：**Doris 正在加速向统一分析与湖仓 SQL 平台演进，但当前最需要守住的是复杂场景下的稳定性、权限边界与结果可信度。**

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**日期：2026-03-24**

---

## 1. 生态全景

过去 24 小时的社区动态显示，OLAP / 分析型存储开源生态整体处于**高活跃、强演进、重正确性治理**阶段。  
一方面，几乎所有核心项目都在加强 **湖仓互操作、SQL 兼容、云对象存储适配、执行器性能优化**；另一方面，随着功能快速扩张，**错误结果、权限边界、崩溃、回归测试、CI 工程化** 成为共同治理重点。  
从趋势看，生态正在从“单一数据库能力竞争”转向“**统一分析入口 + 多格式数据访问 + 更强工程稳态**”的综合竞争。  
对于技术选型而言，性能已不再是唯一指标，**正确性、湖格式兼容深度、运维可观测性、社区修复速度**正成为同等重要的决策因子。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 今日重点 | 健康度评估 |
|---|---:|---:|---|---|---|
| **ClickHouse** | 68 | 314 | 无 | MergeTree/并行副本、SQL 标准兼容、CI 原生化、DeltaLake/Azure 正确性 | **高活跃，稳健但回归压力大** |
| **Apache Doris** | 4 | 105 | 无 | Catalog SPI、Iceberg/Paimon、执行层优化、安全/正确性修复 | **高活跃，主干推进强，但复杂场景风险突出** |
| **StarRocks** | 32 | 115 | 无 | 优化器、Iceberg/Paimon、shared-data 复制、SQL 兼容 | **高活跃，多分支维护积极，边界稳定性待收敛** |
| **DuckDB** | 17 | 43 | **v1.5.1** | 1.5.x 回归修复、Parquet/S3、事务与流式语义 | **响应快，处于版本修复窗口** |
| **Apache Iceberg** | 11 | 50 | 无 | Spark/Flink 正确性、Parquet 兼容、供应链安全、V4 manifest | **活跃且稳健，跨引擎一致性是核心挑战** |
| **Delta Lake** | 2 | 31 | 无 | CDC offset、Kernel+DSv2、UniForm/Iceberg、流式正确性 | **PR 驱动明显，方向聚焦，需警惕流式一致性** |
| **Databend** | 14 | 16 | 无 | SQL 兼容性 panic 修复、Join/Planner 稳定性、存储重构 | **修复快，但 nightly 稳定性波动较明显** |
| **Velox** | 5 | 37 | 无 | GPU/cuDF、Join 正确性、构建稳定、Iceberg/Parquet/S3 | **活跃且方向清晰，GPU 路线强势推进** |
| **Apache Arrow** | 23 | 28 | 无 | Flight SQL ODBC、Parquet 安全性、跨平台构建、R/Python 生态 | **偏工程收敛，基础设施成熟度高** |
| **Apache Gluten** | 11 | 14 | 无 | Spark 4.x 测试修复、Velox 能力补齐、动态过滤、类型兼容 | **中高活跃，处于兼容性与工程打磨阶段** |

### 活跃度简评
- **第一梯队（超高活跃）**：ClickHouse、Doris、StarRocks  
- **第二梯队（高活跃）**：DuckDB、Iceberg、Delta Lake、Velox  
- **第三梯队（中高活跃）**：Arrow、Gluten、Databend  

---

## 3. Apache Doris 在生态中的定位

### 3.1 优势
与同类项目相比，**Apache Doris 的优势在于“一体化分析数据库 + 湖仓访问能力并进”**。  
今天的动态显示，Doris 同时在推进：
- **原生 OLAP 查询引擎优化**：scanner limit、Nereids 下推、TopN 鲁棒性
- **湖仓连接器扩展**：Iceberg、Paimon、Hive、S3
- **平台化基础设施**：Catalog SPI 插件化
- **云与运维治理**：S3 重试、bucket 数量限制、HMS 连接池治理

这意味着 Doris 仍保持其典型定位：**面向统一分析平台的 MPP 数据库**，而不是单纯做 lake query adapter。

### 3.2 与同类项目的技术路线差异
- **相比 ClickHouse**：  
  Doris 更强调 **统一数仓/湖仓 SQL 平台** 和多 Catalog 接入；ClickHouse 更偏 **高性能分析内核 + MergeTree 存储演化 + SQL 标准兼容增强**。
- **相比 StarRocks**：  
  两者路线最接近，均在强化 Iceberg/Paimon/云原生能力。Doris 今天的 **Catalog SPI 插件化** 更突出平台化信号；StarRocks 则更强调 **shared-data 架构、复制与云原生表治理**。
- **相比 DuckDB**：  
  Doris 面向分布式服务型 OLAP；DuckDB 面向嵌入式分析与本地/轻服务场景。
- **相比 Iceberg / Delta Lake**：  
  Doris 是“查询与存储服务引擎”，后两者更偏“表格式与事务协议层”。
- **相比 Databend**：  
  Doris 社区规模和模块完整性更成熟，Databend 仍在快速补 SQL 边界与执行稳定性。
- **相比 Velox / Arrow / Gluten**：  
  Doris 是终端数据库产品；后者更多是执行引擎、加速层或基础组件。

### 3.3 社区规模对比
从今日数据看：
- Doris PR 更新 **105**，已属头部项目活跃区间；
- 但与 ClickHouse **314 PR** 相比，仍有明显规模差距；
- 与 StarRocks **115 PR** 基本同量级，说明二者在中文 OLAP / Lakehouse 开源阵营中竞争非常直接；
- 明显高于 DuckDB、Iceberg、Delta、Databend、Gluten 等。

**结论**：Doris 已处于开源 OLAP 生态的第一阵营，尤其在“数据库 + 湖仓入口”赛道中竞争力很强。

---

## 4. 共同关注的技术方向

下面是多项目共同出现、可视为行业级共识的技术主题。

### 4.1 湖仓格式深度兼容，不再停留在“能读”
**涉及项目**：Doris、ClickHouse、StarRocks、Iceberg、Delta Lake、Velox、Arrow、DuckDB  
**具体诉求**：
- Iceberg DML / Action / V3 / manifest 演进（Doris、StarRocks、Iceberg）
- DeltaLake Azure / schema evolution / time travel 正确性（ClickHouse、Delta Lake）
- Paimon 写入与 system table 可用性（Doris、StarRocks）
- UniForm/Iceberg 互操作（Delta Lake）
- DWRF / Parquet widening / nested type 兼容（Velox、Arrow、Iceberg、DuckDB）

**结论**：生态竞争已从“支持某格式”升级为“**是否支持复杂 schema、删除文件、快照、DML、演进与兼容边角**”。

---

### 4.2 正确性优先，错误结果比失败更受重视
**涉及项目**：Doris、ClickHouse、DuckDB、Iceberg、Delta Lake、StarRocks、Databend、Velox  
**代表问题**：
- Doris：MV 命中结果不一致、Ranger 权限绕过
- ClickHouse：Azure DeltaLake time travel 被静默忽略、JOIN 错误结果
- DuckDB：DELETE RETURNING、窗口绑定 internal error
- Iceberg：不同 snapshot 查询返回相同数据
- Delta Lake：coordinated commits 下 silent data loss
- StarRocks：`CONVERT_TZ` 结果错误
- Databend：大量 panic 本应返回 semantic error
- Velox：full outer join + filter 可能丢右侧 miss rows

**结论**：2026 年的主旋律不是“再快一点”，而是“**复杂组合场景下结果必须可信**”。

---

### 4.3 SQL 兼容性持续增强
**涉及项目**：ClickHouse、StarRocks、DuckDB、Databend、Gluten、Arrow  
**具体诉求**：
- SQL 标准 `VALUES`、`OVERLAY`、NULL 语义（ClickHouse）
- `GROUP BY ALL`（StarRocks）
- parser / binder / window binding / PostgreSQL parser 一致性（DuckDB）
- LIKE/ESCAPE/UNION/GROUPING 等边界兼容（Databend）
- TIMESTAMP_NTZ、approx_percentile（Gluten）
- 更接近 DataFrame/SQL 式 API（Arrow）

**结论**：SQL 兼容正在成为 OLAP 引擎争夺迁移用户的重要抓手。

---

### 4.4 云对象存储与云环境稳定性
**涉及项目**：Doris、DuckDB、StarRocks、Iceberg、Velox、Arrow  
**具体诉求**：
- S3 写入重试、对象存储瞬时错误治理（Doris）
- S3 glob 503、分区写 S3 OOM（DuckDB）
- Azure parquet 崩溃（StarRocks）
- GCS token refresh（Iceberg）
- S3 executor pool size / 设备队列问题（Velox）
- Azure Blob filesystem（Arrow）

**结论**：对象存储已成为事实上的共同底座，项目必须具备**生产级云 IO 韧性**。

---

### 4.5 CI、测试、供应链与工程化治理
**涉及项目**：ClickHouse、Iceberg、Delta Lake、Arrow、Gluten、DuckDB  
**具体诉求**：
- 原生 CI / fuzz / sanitizer / clang-tidy（ClickHouse）
- GitHub workflow 供应链安全（Iceberg）
- flaky test、cache 策略（Delta Lake）
- 构建兼容性、跨平台工具链（Arrow）
- Spark 4.x 测试真实性修复（Gluten）
- bugfix release 驱动的发布收敛（DuckDB）

**结论**：头部项目都在把“工程治理”视作核心竞争力，而非附属工作。

---

## 5. 差异化定位分析

### 5.1 存储格式与数据管理定位

| 项目 | 核心定位 |
|---|---|
| **Doris** | 自有分布式 OLAP 存储 + 外部 Catalog / Lakehouse 访问 |
| **ClickHouse** | MergeTree 为核心的高性能分析数据库，自有存储能力最强之一 |
| **StarRocks** | MPP OLAP + shared-data/cloud-native 演进 + 湖仓接入 |
| **DuckDB** | 嵌入式列式分析引擎，偏本地文件/对象存储分析 |
| **Iceberg** | 开放表格式 / 元数据协议层 |
| **Delta Lake** | 事务湖表协议，偏 Spark/Kernel/流式生态 |
| **Databend** | 云原生数仓，Fuse 存储格式为核心 |
| **Velox** | 执行引擎与算子层，不是完整数据库 |
| **Gluten** | Spark 原生加速层，不是存储引擎 |
| **Arrow** | 列式内存格式与数据交换/IO 基础设施 |

### 5.2 查询引擎设计差异
- **Doris / StarRocks / ClickHouse**：典型服务端分布式 OLAP 引擎  
- **DuckDB**：嵌入式单机分析引擎  
- **Databend**：云数仓导向，仍在快速补 SQL/执行能力  
- **Velox / Gluten**：作为上层系统的执行内核或加速插件  
- **Arrow**：偏数据接口与执行基础组件，不直接承担完整 SQL 服务职责

### 5.3 目标负载类型差异
- **高并发报表 / 数仓服务**：Doris、ClickHouse、StarRocks  
- **嵌入式分析 / 本地数据工程**：DuckDB  
- **湖表协议 / 数据平台底座**：Iceberg、Delta Lake  
- **云原生弹性数仓**：Databend  
- **加速执行 / heterogeneous compute**：Velox、Gluten  
- **跨语言数据交换 / 驱动连接层**：Arrow

### 5.4 SQL 兼容性风格差异
- **ClickHouse**：明显加速向标准 SQL 靠拢  
- **DuckDB**：兼容性强，偏 PostgreSQL / 分析型 SQL 体验  
- **Doris / StarRocks**：以 BI / 数仓 SQL 和湖仓接入兼容为主  
- **Databend**：当前重点是从 panic 走向稳定 semantic error  
- **Gluten / Velox**：SQL 兼容受上层 Spark/Presto 生态约束更大  
- **Arrow**：不以完整 SQL 方言为核心，但在 compute / table API 上持续靠近分析框架体验

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：头部成熟生态，活跃度极高
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特点：
- PR 量大
- 多线并行：功能、回归、CI、稳定分支回移
- 社区具备较强问题收敛能力  
但风险是：**复杂度高，回归面广**

#### 第二层：高活跃、方向明确
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**

特点：
- 要么处于版本收敛期（DuckDB）
- 要么在协议/流式/执行器关键节点上持续推进（Iceberg、Delta、Velox）
- 路线鲜明，工程投入集中

#### 第三层：中高活跃、快速迭代补短板
- **Databend**
- **Apache Gluten**
- **Apache Arrow**

特点：
- Databend：功能扩张快，稳定性仍在补课
- Gluten：兼容性与上游协同成本高
- Arrow：更偏基础设施成熟化和生态补齐

---

### 6.2 哪些项目处于快速迭代阶段
- **Databend**：大量 panic/compatibility 修复，明显处于“快速打磨”期
- **Velox**：GPU 路线快速扩张
- **Delta Lake**：Kernel+DSv2+CDC 重构推进中
- **Doris / StarRocks**：湖仓与平台能力仍在快速扩展

### 6.3 哪些项目处于质量巩固阶段
- **DuckDB**：v1.5.1 bugfix release 体现明显的修复窗口
- **Arrow**：跨平台、构建、驱动层完善为主
- **Iceberg**：多引擎一致性和工程治理持续巩固
- **ClickHouse**：虽高活跃，但越来越多工程化与兼容性治理动作，成熟度最高之一

---

## 7. 值得关注的趋势信号

### 7.1 “统一分析入口”成为事实标准
Doris、StarRocks、ClickHouse、DuckDB 都在增强对外部格式/对象存储/多 Catalog 的支持。  
**参考意义**：未来架构设计不应再把数仓、湖表、外部对象存储割裂看待，而应优先考虑 **统一 SQL 入口**。

### 7.2 湖仓竞争焦点已从“读”转向“写、删、改、快照、治理”
Paimon `INSERT`、Iceberg DML、Delta CDC、Iceberg/Delta 快照正确性，都说明生态焦点在升级。  
**对数据工程师**：选型时要重点比较 **DML、time travel、schema evolution、delete file、权限与治理**，而非只看查询能否跑通。

### 7.3 正确性与安全性正在压过纯性能优化
Doris 的权限绕过、ClickHouse 的 silent wrong result、Delta 的 silent data loss、Iceberg 的 snapshot 错误，都属高风险问题。  
**对架构师**：生产选型应建立“错误结果风险”评估机制，不能只看 benchmark。

### 7.4 SQL 标准兼容正在成为迁移门槛的关键
ClickHouse、DuckDB、StarRocks、Databend 都在补齐兼容性。  
**对平台团队**：如果目标是承接 PostgreSQL / Hive / Spark SQL / BI 工具迁移，SQL 兼容度会直接影响实施成本。

### 7.5 云对象存储生产化能力已成为必选项
S3、Azure、GCS 在多个项目中都是今日热点。  
**建议**：在对象存储为主的数据平台中，需优先验证：
- 重试与退避
- 长任务 token refresh
- 大量小文件/大规模 glob
- schema evolution 与 snapshot 读取
- 写入与 flush 稳定性

### 7.6 基础设施工程化决定长期竞争力
ClickHouse 的原生 CI、Iceberg 的供应链安全、Arrow 的跨平台构建、Gluten 的测试真实性修复，都说明成熟项目正在比拼“工程系统能力”。  
**对决策者**：看社区时，不能只看 star 和功能列表，还要看 **回归治理、分支维护、CI 与安全能力**。

---

# 总体结论

从今天的横向观察看，**Apache Doris 已稳居开源 OLAP 第一梯队**，并且在“数据库 + 湖仓统一入口”定位上非常清晰；它与 StarRocks 竞争最直接，与 ClickHouse 在架构路线和产品重心上有所区隔。  
整个生态的共同方向是：**湖仓深度互操作、SQL 兼容增强、云对象存储生产化、以及正确性/安全性优先治理**。  
对技术决策者来说，未来选型不应只问“谁更快”，而应重点问：  
**谁在复杂湖仓场景下更稳定、谁的结果更可信、谁的工程体系更成熟、谁的社区修复更快。**

如果你愿意，我可以继续把这份报告再加工成两种形式之一：  
1. **面向 CTO 的一页纸高管摘要版**  
2. **面向数据平台团队的选型评分矩阵版（Doris / ClickHouse / StarRocks / DuckDB 等）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报 — 2026-03-24

## 1. 今日速览

过去 24 小时内，ClickHouse 社区保持**高活跃度**：Issues 更新 68 条、PR 更新 314 条，说明核心开发、CI、缺陷修复和功能演进同时推进。  
从议题分布看，今天的重点仍然集中在**查询正确性、MergeTree/并行副本稳定性、DeltaLake/Azure 兼容性、CI 基础设施演进**几个方向。  
PR 活跃度显著高于 Issue 活跃度，且大量 PR 来自核心维护者，表明项目当前处于**高频修复 + 持续增强**状态。  
没有新版本发布，但从近期 PR 内容判断，主干分支正在为后续版本积累一批**SQL 标准兼容、执行器稳定性、存储引擎正确性**改进。  
整体健康度评价：**活跃且稳健，但回归类问题与 fuzz/CI 暴露的正确性问题仍值得持续关注**。

---

## 3. 项目进展

> 注：今日数据未直接给出全部“已合并 PR 明细”，以下重点结合“已关闭 PR / 活跃关键 PR”梳理对项目推进最有代表性的变化。

### 3.1 查询引擎与执行器稳定性持续增强

- **改进关闭会话后的 Keeper 请求跳过逻辑**
  - PR: #100010  
  - 状态: **已关闭**  
  - 链接: ClickHouse/ClickHouse PR #100010
  - 影响：通过跟踪 live sessions 而不是依赖有界 finished_sessions 缓存，减少 Keeper 层对过期请求处理不当的问题，提升会话关闭场景下的稳定性。
  - 研判：这类修复对高并发、会话频繁创建/销毁的生产集群尤其重要。

- **修复 ResizeProcessor / StrictResizeProcessor 的 Pipeline stuck 异常**
  - PR: #98340  
  - 状态: OPEN，但持续活跃  
  - 链接: ClickHouse/ClickHouse PR #98340
  - 影响：针对执行 pipeline 中 waiting_outputs 队列陈旧引用导致的 `LOGICAL_ERROR`，有助于提升复杂执行计划下的数据流转稳定性。
  - 研判：虽未显示今日合并，但这是典型的执行器核心稳定性修复，值得重点跟踪。

- **移除函数内部 mutable 状态，转向 `IFunctionOverloadResolver`**
  - PR: #100243  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100243
  - 影响：修复函数执行中的线程安全隐患，避免同一 `IFunction` 实例跨线程共享可变状态。
  - 研判：这是较深层的架构性清理，长期价值高，可能为后续 analyzer / expression execution 稳定性打基础。

### 3.2 MergeTree / 并行副本 / 投影相关问题继续收敛

- **修复 normal projections + parallel replicas 下的 Block structure mismatch**
  - PR: #99497  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #99497
  - 影响：解决投影读链路替换后列集不一致，在并行副本场景触发 block 结构不匹配的问题。
  - 关联问题：
    - Issue #89472 [OPEN] Block structure mismatch in patch parts stream  
      链接: ClickHouse/ClickHouse Issue #89472
  - 研判：说明 ClickHouse 在“投影优化 + 并行执行”组合路径上仍有边界条件需要补齐。

- **修复 ALTER MODIFY COLUMN 后 skip index 使用不兼容类型**
  - PR: #100526  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100526
  - 影响：针对 `READ_COLUMN` mutation 未被 `hasDataMutations()` 覆盖，导致修改列类型后索引元数据/使用路径不一致。
  - 研判：这是典型的 MergeTree schema evolution 正确性问题，若合入将直接改善线上变更安全性。

- **支持多 part 的 parallel read in order**
  - PR: #100394  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100394
  - 影响：面向 `ORDER BY`/有序读取场景的性能提升，尤其适合大量 parts 的 MergeTree 查询。
  - 关联问题：
    - Issue #99914 [OPEN] Speed up primary key ranges pruning for parts with many granules.  
      链接: ClickHouse/ClickHouse Issue #99914
  - 研判：显示项目在继续优化“大量 part/大范围 pruning”场景的延迟表现。

### 3.3 SQL 兼容性与可用性能力继续推进

- **支持 SQL 标准 `VALUES` 作为表表达式**
  - PR: #100143  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100143
  - 影响：支持 `SELECT * FROM (VALUES (...), (...)) AS t(...)` 语法，明显提升与标准 SQL / PostgreSQL / DuckDB 使用习惯兼容性。
  - 关联需求：
    - Issue #98600 [OPEN] Add a setting that makes ClickHouse compatible with the SQL standard  
      链接: ClickHouse/ClickHouse Issue #98600
  - 研判：这类 PR 明确释放出**增强 SQL 标准兼容**的路线图信号。

- **实现 `CREATE HANDLER / DROP HANDLER / ALTER HANDLER`**
  - PR: #100203  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100203
  - 影响：允许通过 SQL 动态管理 HTTP handlers，而不必手改 XML 配置，提升云环境、自动化部署和多租户场景的运维友好性。

- **为 `EXPLAIN PIPELINE` 增加 distributed 模式**
  - PR: #100513  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100513
  - 影响：加强分布式查询执行计划可观测性，便于定位 shard / initiator / exchange 行为。

### 3.4 CI 与工程体系持续强化

- **新增 `--diagnose-random-settings` 测试诊断能力**
  - PR: #100403  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100403
  - 影响：当随机 settings 导致测试失败时，自动缩小触发设置范围，直接降低随机测试问题定位成本。

- **启用 clang-tidy 检查未初始化变量**
  - PR: #100399  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse PR #100399
  - 影响：有助于提前发现未初始化读取、潜在 UB，尤其针对近期 fuzz/sanitizer 报告非常契合。

- **RFC：从 GitHub Actions 迁移到原生 CI 执行引擎**
  - Issue: #100291  
  - 状态: OPEN  
  - 链接: ClickHouse/ClickHouse Issue #100291
  - 研判：这是今日最强的基础设施信号之一，说明项目规模已推动 CI 自主化升级。

---

## 4. 社区热点

### 4.1 2026 路线图持续被关注
- Issue: #93288 — ClickHouse roadmap 2026  
- 链接: ClickHouse/ClickHouse Issue #93288

这是评论数最高的话题。路线图长期处于高讨论热度，说明社区最关心的不只是 bug 修复，更关注 **2026 年核心投入方向**：查询分析器、SQL 兼容、存储层演化、云与基础设施能力边界。  
**技术诉求分析**：企业用户需要更明确的长期承诺，以便安排升级、兼容性测试与平台建设。

### 4.2 CI 崩溃与 fuzz 问题仍是主战场
- Issue: #99799 — `[crash-ci] Double deletion of MergeTreeDataPartCompact in multi_index`  
- 链接: ClickHouse/ClickHouse Issue #99799
- Issue: #100158 — `Logical error: Bad cast from type A to B`  
- 链接: ClickHouse/ClickHouse Issue #100158
- Issue: #100469 — `MemorySanitizer: use-of-uninitialized-value`  
- 链接: ClickHouse/ClickHouse Issue #100469
- PR: #100399 — Enable clang-tidy check for uninitialized variables  
- 链接: ClickHouse/ClickHouse PR #100399

热点说明：CI 自动化发现的问题很多集中在**内存安全、类型转换、COW/对象生命周期**。  
**技术诉求分析**：ClickHouse 的执行器和存储引擎持续追求极致性能，因此 fuzz/sanitizer 对边界条件非常敏感；当前重点是把“极端输入下的正确性”进一步工程化。

### 4.3 SQL 标准兼容性诉求升温
- Issue: #99606 — `concat()/||` 遇到 NULL 时传播 NULL 的设置  
- 链接: ClickHouse/ClickHouse Issue #99606
- Issue: #99604 — 支持 `OVERLAY(...)` 函数  
- 链接: ClickHouse/ClickHouse Issue #99604
- Issue: #98600 — 增加一组兼容 SQL 标准的设置  
- 链接: ClickHouse/ClickHouse Issue #98600
- PR: #100143 — 支持 SQL 标准 `VALUES` 子句  
- 链接: ClickHouse/ClickHouse PR #100143

**技术诉求分析**：用户希望 ClickHouse 在保持分析性能优势的同时，降低从 PostgreSQL / DuckDB / 通用 SQL 工具迁移时的语义摩擦。

### 4.4 DeltaLake / Azure 兼容性成为新热点
- Issue: #100438 — `deltaLakeAzure` 对 schema-evolved tables 抛 `NOT_IMPLEMENTED`  
- 链接: ClickHouse/ClickHouse Issue #100438
- Issue: #100502 — Azure 下 `delta_lake_snapshot_version` 被静默忽略  
- 链接: ClickHouse/ClickHouse Issue #100502
- PR: #100124 — 修复 DeltaLake Tuple 子列读取异常  
- 链接: ClickHouse/ClickHouse PR #100124

**技术诉求分析**：用户不再满足于“能读外部湖仓格式”，而是要求在**schema evolution、time travel、列映射**等真实生产能力上达到可靠可用。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高危：可能导致错误结果或崩溃

1. **Azure DeltaLake 时间旅行参数被静默忽略，返回错误数据**
   - Issue: #100502 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #100502
   - 描述：`delta_lake_snapshot_version` 在 Azure/未启用 DeltaKernel 的路径下被忽略，不报错却返回最新快照，属于**silent wrong result**。
   - 是否有 fix PR：**暂无明确对应 PR**
   - 评估：错误结果比显式失败更危险，建议优先处理。

2. **ANY LEFT JOIN 在特定 dry-run / not-ready IN 子查询场景返回错误行**
   - Issue: #100029 [CLOSED]  
   - 链接: ClickHouse/ClickHouse Issue #100029
   - 描述：`FunctionIn` dry-run 返回零值触发错误 ANTI JOIN 转换，导致匹配行丢失。
   - 是否已有修复：**已关闭，说明已有修复路径**
   - 评估：这是典型查询正确性问题，虽已关闭，但建议关注是否已回补到稳定分支。

3. **MergeTreeDataPartCompact 双重删除导致 CI crash**
   - Issue: #99799 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #99799
   - 描述：`multi_index` 路径中出现对象重复释放。
   - 是否有 fix PR：**未见明确关联 PR**
   - 评估：涉及对象生命周期/内存管理，潜在崩溃级别高。

### P1 / 严重：生产回归、查询挂死、检查失败

4. **25.8 回归：`system.parts` 在 metadata lock 存在时无限挂起**
   - Issue: #99547 [CLOSED]  
   - 链接: ClickHouse/ClickHouse Issue #99547
   - 描述：相较 24.3 LTS，25.8 对系统表查询行为发生回归。
   - 状态：**已关闭**
   - 评估：说明维护者对生产回归响应较快，是积极信号。

5. **ReplicatedMergeTree 获取带未知 projection 的 part 后 `CHECK TABLE` 失败并陷入重复拉取**
   - Issue: #100413 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #100413
   - 描述：接收侧修复不完整，part 校验失败导致 re-fetch loop。
   - 是否有 fix PR：**未见明确对应 PR**
   - 评估：会放大复制流量并影响副本健康。

6. **带 row policy + analyzer 的查询抛 `NOT_FOUND_COLUMN_IN_BLOCK`**
   - Issue: #100194 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #100194
   - PR: #100361 [OPEN]  
   - 链接: ClickHouse/ClickHouse PR #100361
   - 描述：URL/S3 + Parquet + 行级过滤场景中，`updateFormatPrewhereInfo` 对 `prewhere_info` 的假设不成立。
   - 是否有 fix PR：**有，#100361**
   - 评估：修复路径明确，预计较快落地。

7. **DeltaLake Azure 对 schema evolution 表读取失败**
   - Issue: #100438 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #100438
   - 是否有 fix PR：**暂无明确对应 PR**
   - 评估：影响外部湖仓接入的可用性。

### P2 / 中等：兼容性、边界条件、执行异常

8. **`date_time_overflow_behavior='throw'` 对 Int/UInt/Float -> DateTime64/Time64 转换失效**
   - Issue: #100471 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #100471
   - 影响：用户以为启用了严格模式，但仍发生静默截断/钳制。
   - 是否有 fix PR：暂无

9. **`AMBIGUOUS_COLUMN_NAME`：SELECT 中表达式在 WHERE 复用时行为异常**
   - Issue: #95319 [OPEN]  
   - 链接: ClickHouse/ClickHouse Issue #95319

10. **MergeTree 对 `AND -2147483648` 谓词求值错误**
    - Issue: #99979 [OPEN]  
    - 链接: ClickHouse/ClickHouse Issue #99979
    - 影响：存储引擎路径与 Memory 引擎行为不一致，属于表达式求值正确性问题。

11. **ARRAY JOIN 丢失 LowCardinality 属性**
    - Issue: #95582 [OPEN]  
    - 链接: ClickHouse/ClickHouse Issue #95582
    - 影响：结果集压缩效率与网络传输收益下降，偏性能/类型保真问题。

12. **Arrow `utf8_view` 类型插入不支持**
    - Issue: #88246 [OPEN]  
    - 链接: ClickHouse/ClickHouse Issue #88246
    - 影响：阻碍 Polars/Arrow 生态接入。

---

## 6. 功能请求与路线图信号

### 6.1 SQL 标准兼容将继续增强
- Issue: #98600 — 统一的 SQL 标准兼容设置  
  链接: ClickHouse/ClickHouse Issue #98600
- Issue: #99606 — `concat()/||` 的 NULL 传播模式  
  链接: ClickHouse/ClickHouse Issue #99606
- Issue: #99604 — 支持 `OVERLAY`  
  链接: ClickHouse/ClickHouse Issue #99604
- PR: #100143 — `VALUES` 作为表表达式  
  链接: ClickHouse/ClickHouse PR #100143

**判断**：这些需求与已在推进的 PR 高度一致，预计会逐步纳入后续版本。尤其 `VALUES` 已进入实现阶段，属于最可能近期落地的能力。

### 6.2 运维与可观测性能力在增强
- PR: #100513 — 分布式 `EXPLAIN PIPELINE`  
  链接: ClickHouse/ClickHouse PR #100513
- PR: #100203 — SQL 管理 HTTP handlers  
  链接: ClickHouse/ClickHouse PR #100203

**判断**：ClickHouse 正在补足“企业级可操作性”，不仅是快，更强调**可调试、可自动化、可治理**。

### 6.3 CI 原生化是重要中长期信号
- Issue: #100291 — 从 GitHub Actions 迁移到原生 CI 执行引擎  
  链接: ClickHouse/ClickHouse Issue #100291

**判断**：这不会立刻体现在用户功能上，但会显著影响交付效率、测试容量与回归控制能力。对于如此高 PR 规模的项目，这类投入具有战略意义。

### 6.4 存储与查询性能优化仍是核心主线
- Issue: #99914 — 加速大 granules parts 的主键 range pruning  
  链接: ClickHouse/ClickHouse Issue #99914
- PR: #100394 — 多 parts 的 parallel read in order  
  链接: ClickHouse/ClickHouse PR #100394

**判断**：MergeTree 查询性能优化仍在持续迭代，尤其针对大 part、大索引区间和有序读取场景。

---

## 7. 用户反馈摘要

### 7.1 用户最关心“升级后是否会出现行为变化”
- 代表 Issue:
  - #99547 — 25.8 下 `system.parts` 挂起回归  
  - #99308 — analyzer 开启后，带 CTE 的 view 创建失败  
- 链接:
  - ClickHouse/ClickHouse Issue #99547
  - ClickHouse/ClickHouse Issue #99308

**提炼**：用户在从 24.x / 25.x 老版本升级到新 analyzer、新执行路径时，最敏感的是**兼容性回归和原有 SQL 失效**。这说明新 analyzer 虽是重要方向，但企业用户仍需要更平滑的迁移保障。

### 7.2 湖仓接入用户更在意“正确性”而不是“先跑通”
- 代表 Issue:
  - #100438
  - #100502
  - #100124
- 链接:
  - ClickHouse/ClickHouse Issue #100438
  - ClickHouse/ClickHouse Issue #100502
  - ClickHouse/ClickHouse PR #100124

**提炼**：外部格式接入已进入“深水区”，用户要求支持 schema evolution、column mapping、snapshot/time travel 等成熟能力，容忍度比早期集成阶段更低。

### 7.3 客户端与 SQL 交互体验也在被放大关注
- 代表 Issue:
  - #100405 — `clickhouse-client` 粘贴带 hard tab 的 SQL 体验差  
- 链接:
  - ClickHouse/ClickHouse Issue #100405

**提炼**：随着更多用户将 ClickHouse 用作通用 SQL 平台，CLI 易用性、小语法兼容、日常开发体验的重要性在提升。

### 7.4 高并发与连接管理问题仍是大型部署痛点
- 代表 Issue:
  - #91591 — TCP connection count limitations  
  - #49665 — killed query 在 socket 无人读取时可能挂住  
- 链接:
  - ClickHouse/ClickHouse Issue #91591
  - ClickHouse/ClickHouse Issue #49665

**提炼**：这类问题反映出超大规模集群/多租户环境下，网络连接、会话资源和取消语义仍有优化空间。

---

## 8. 待处理积压

以下是值得维护者继续关注的**长期未完全解决**议题：

1. **#49665 — Killed query might hung at processes when no one reads from the socket.**  
   链接: ClickHouse/ClickHouse Issue #49665  
   - 创建于 2023-05-08，问题直指查询取消与 socket 回压下的 hanging 行为。
   - 这是高并发生产环境中的典型稳定性隐患。

2. **#91591 — TCP connection count limitations**  
   链接: ClickHouse/ClickHouse Issue #91591  
   - 创建于 2025-12-05，属于容量规划与连接模型层面的系统性问题。
   - 对大规模客户端接入、代理层设计影响较大。

3. **#89472 — Block structure mismatch in patch parts stream**  
   链接: ClickHouse/ClickHouse Issue #89472  
   - 创建于 2025-11-04，且与今日活跃 PR #99497 所处理的问题域接近。
   - 建议维护者确认是否可以通过统一修复路径一并收敛。

4. **#88246 — Unsupported Arrow type `utf8_view`**  
   链接: ClickHouse/ClickHouse Issue #88246  
   - 创建于 2025-10-08。
   - 随着 Polars/Arrow 使用增加，此兼容性问题的重要性在上升。

5. **#95319 — `AMBIGUOUS_COLUMN_NAME` strange behavior in SELECT/WHERE**  
   链接: ClickHouse/ClickHouse Issue #95319  
   - 属于 analyzer / 名称解析相关问题，虽然评论不多，但牵涉 SQL 正确性，应避免长期悬而未决。

---

## 总结判断

今天的 ClickHouse 呈现出一个典型的成熟开源 OLAP 项目状态：  
- 一方面，核心团队在**高强度修复复杂边界问题**，特别是 MergeTree、并行副本、执行 pipeline、DeltaLake/Azure 等高复杂度区域；  
- 另一方面，项目也在同步推进**SQL 标准兼容、可运维性、CI 自主化**等中长期建设。  

从用户视角看，当前最关键的风险点仍是：**错误结果、升级回归、外部湖仓兼容性不完整**。  
从项目演进视角看，当前最明确的正向信号则是：**SQL 兼容增强正在从讨论进入实际交付阶段，CI 体系也在为更大规模开发效率做准备**。  

如果你愿意，我还可以继续基于这份日报，补一版：
1. **“面向 CTO/架构师的一页摘要版”**，或  
2. **“按模块分类的 PR / Issue 看板版（SQL / MergeTree / 湖仓 / CI）”**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 — 2026-03-24

## 1. 今日速览

过去 24 小时 DuckDB 维持高活跃度：Issues 更新 17 条、PR 更新 43 条，并发布了一个新的 bugfix 版本，说明项目当前处于明显的稳定性修复与版本收敛窗口。  
从议题分布看，热点集中在 **1.5.0 发布后的回归修复**、**Parquet/S3 读写稳定性**、**事务/流式执行语义** 以及 **SQL 绑定与优化器正确性**。  
PR 侧既有面向版本修复的小型补丁，也有较大规模的内部重构，如 window binding、DELETE 语法树重构，显示团队在“快速止血”和“持续演进”两条线上并行推进。  
整体健康度判断：**活跃且响应迅速**，但 1.5.0 之后暴露出的若干回归和边缘场景问题，说明近期仍需关注发布后稳定性与兼容性回归测试。

---

## 2. 版本发布

## 新版本：v1.5.1
- **版本**: `v1.5.1`
- **标题**: DuckDB v1.5.1 Bugfix Release
- **说明**: 这是针对 `v1.5.0` 发布后发现的一系列问题的修复版本。
- **公告**: https://duckdb.org/2026/03/23/announcing-duckdb-151

### 更新内容概述
当前给出的 release 摘要显示，该版本主要是 **bugfix release**，重点不是新特性，而是修复 1.5.0 上线后暴露的问题。可见的变更示例包括：
- `[Extensions] Preserve require order in InterpretedBenchmark`

结合当天 Issue/PR 动态，v1.5.1 很可能覆盖了以下方向的修复：
- CLI 与初始化执行顺序问题
- ADBC/流式结果集相关回归
- Parquet 读取与统计信息相关崩溃
- `COPY FROM DATABASE` 等 1.5.0 引入的新回归

### 破坏性变更
- **从当前数据看，没有明确的破坏性变更信号。**
- v1.5.1 定位为补丁版本，预期应保持与 1.5.0 的 API/SQL 兼容。

### 升级与迁移注意事项
建议 1.5.0 用户尽快升级到 1.5.1，尤其是以下场景：
1. 使用 **ADBC / Arrow 流式接口** 的嵌入式或中间件用户  
2. 使用 **Parquet**、`COPY FROM DATABASE`、S3 访问或复杂窗口函数查询的用户  
3. 在 CLI 中依赖 `-init` / `-cmd` 注入配置的自动化脚本用户  

如果你的生产环境涉及：
- 事务内流式读取
- `DELETE RETURNING`
- 加密 Parquet + `union_by_name=true`
- stdin / `/dev/stdin` 数据摄入
  
则建议升级后立即补做针对性回归验证。

---

## 3. 项目进展

以下为今日值得关注的合并/关闭 PR 与推进方向。

### 3.1 查询引擎与执行器内部改进

#### PR #21413 — ANTI IEJoin Predicates
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21413

该 PR 实现了 **ANTI IEJOIN** 的谓词支持，属于查询执行器能力增强。IEJoin 适用于不等值连接等复杂 join 场景，ANTI 语义补全后，理论上可改善某些反连接查询的性能与计划表达能力。  
虽然今日状态显示为 closed，仍然可视为近期引擎能力演进的重要信号：DuckDB 在继续增强复杂 join 算法栈，而不只是做传统等值 hash join 优化。

#### PR #21562 — Window Function Binding
- 状态：**Open / Ready For Review**
- 链接：duckdb/duckdb PR #21562

这是今日最重要的内部演进 PR 之一，主要内容包括：
- 将 window binding 从 `TransformFuncCall` 移到 `BindWindow`
- 将 `LEAD/LAG` 转为标准多参数函数
- 将 `RESPECT/IGNORE NULLS` 校验前移到 binder
- 调整 offset/default 参数绑定方式

这类重构通常不是“表面功能新增”，而是为后续 **SQL 兼容性、错误诊断质量、窗口函数扩展** 打基础。结合当天窗口绑定相关 bugfix，可以判断 DuckDB 正在加强窗口函数子系统的一致性。

---

### 3.2 SQL 正确性与绑定修复

#### PR #21564 — TopNWindowElimination Column Binding Fix
- 状态：**Open**
- 链接：duckdb/duckdb PR #21564

该 PR 明确修复了 Issue #21560，问题出现在窗口函数优化路径中列绑定次序错误，导致：
- `VARCHAR` 与 `DATE` 等不同类型列被错误对应
- 在 `ROW_NUMBER()` + `WHERE rn = 1` + 混合类型 `PARTITION BY` 场景下触发内部断言

这是一个典型的 **优化器/绑定器正确性 bug**，影响面虽然偏边缘，但一旦触发就是 internal error。已有 fix PR 是积极信号，说明维护者对查询正确性问题响应较快。

#### PR #21331 — PEG grammar fixes
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21331

该 PR修复了 PEG parser 与 PostgreSQL parser 在若干语法结果上的不一致，包括：
- extension update 相关语法
- 允许 numeric struct keys

这代表 DuckDB 持续推进：
- **解析器一致性**
- **SQL 方言兼容性**
- **复杂结构类型语法可用性**

---

### 3.3 存储与格式层修复/优化

#### PR #21532 — Fix Parquet dictionary index bit widths
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21532

修复 Parquet writer 中 dictionary id bit width 计算偏宽的问题。虽然这不一定导致立即可见的错误，但它关系到：
- Parquet 编码正确性
- 写出文件的规范性
- 压缩/存储效率
- 与其他引擎的兼容性

这是典型的“底层格式细节修复”，对生态互操作很重要。

#### PR #21382 — Checkpoint transactions
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21382

让 checkpoint 在具备 client context 时运行于其自身事务中，有助于：
- 降低 checkpoint 与用户事务之间的干扰
- 提高存储持久化流程的隔离性
- 为后续更精细的 durability/detach/checkpoint 控制铺路

#### PR #21427 — Fix stale update read during index removal
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21427

修复索引移除过程中读取 stale update 的问题，属于事务可见性/索引一致性层面的重要稳定性修复。此类问题虽然不总是高频，但对数据库正确性极其关键。

---

### 3.4 测试与发布分支整理

#### PR #21553 — [v1.5-variegata] Fix #21514: ASOF join empty right
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21553

表明维护者正在对 `v1.5` 分支进行定向补丁回填，尤其关注影响 SQL 语义正确性的 join 场景问题。

#### PR #21555 — Merge v1.5-variegata into main
- 状态：**已关闭**
- 链接：duckdb/duckdb PR #21555

这是版本分支与主干同步的直接信号，说明 bugfix 已经在 release branch 与 main 之间流转，符合 1.5.1 发布节奏。

---

## 4. 社区热点

以下按讨论热度、代表性与技术价值整理。

### 4.1 S3 大规模 glob 请求遭遇 503 Slowdown
- Issue #6153  
- 状态：Open / under review  
- 链接：duckdb/duckdb Issue #6153

**技术诉求**：当用户通过 glob 从 S3 扫描大量文件时，S3 返回 503 Slowdown，当前 DuckDB 倾向于直接失败；用户希望支持 **指数退避与重试机制**。  
**背后信号**：DuckDB 已被用于越来越多对象存储上的湖仓扫描任务，用户期待它不仅“能跑 SQL”，还要具备面向云对象存储的 **生产级弹性**。  
这是一个长期 issue 仍持续活跃，说明 S3 访问韧性是社区仍在关心的现实问题。

---

### 4.2 分区写 S3 时 OOM
- Issue #11817  
- 状态：Open / under review  
- 链接：duckdb/duckdb Issue #11817

**技术诉求**：`COPY` 到 S3 且启用 hive partitioning 时，内存占用异常偏高。  
**背后问题**：
- 分区写路径的内存释放/缓冲策略可能不够理想
- 云对象存储写出过程与分区组织的组合存在放大效应
- 用户期待 DuckDB 在 ETL/数据导出场景中具备更可控的资源占用

这是一个高 👍 问题（9），说明其影响面较广，尤其是把 DuckDB 作为轻量 ETL 引擎使用的用户。

---

### 4.3 UNIQUE 约束未考虑 collation
- Issue #19675  
- 状态：Open / reproduced  
- 链接：duckdb/duckdb Issue #19675

**技术诉求**：`VARCHAR COLLATE NOCASE UNIQUE` 允许 `'A'` 与 `'a'` 共存，违反用户对唯一约束在排序规则下语义一致性的预期。  
**背后问题**：
- SQL 兼容性与约束语义还需进一步细化
- Collation 不仅影响比较，还应贯穿索引/约束执行层

这类问题虽然不一定导致崩溃，但属于 **数据正确性与约束完整性** 问题，优先级应不低。

---

### 4.4 aggregate(df).* 语法行为不符合用户预期
- Issue #13055  
- 状态：Open / reproduced  
- 链接：duckdb/duckdb Issue #13055

**技术诉求**：用户认为 `struct.*` 展开应可用于 aggregate 结果，实际却是 syntax error。  
**背后信号**：
- DuckDB 的结构化数据类型（struct/list/json）使用越来越深入
- 用户希望星号展开规则更统一、更“表达式正交”

这反映出 DuckDB 用户群已不只关注传统 BI SQL，也在重度使用半结构化表达能力。

---

### 4.5 事务内流式读取与 DML 交错执行
- Issue #21384、PR #21569
- 链接：duckdb/duckdb Issue #21384 / duckdb/duckdb PR #21569

Issue #21384 报告 ADBC 接口中交错查询时 `stream.get_next()` 失败；而 PR #21569 进一步提出 **Suspended Query Contexts: Interleaved Streaming + DML**。  
**背后技术诉求**：
- 在同一连接、同一事务内保留未完成的流式扫描上下文
- 支持边读边写、边流式消费边更新状态
- 更适配嵌入式应用、数据管道、消息处理等场景

这是非常明确的路线图信号：DuckDB 社区正在从“批式 SQL 引擎”向“更强事务交互能力的嵌入式分析内核”扩展。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 崩溃与内部错误

#### 1) `COPY FROM DATABASE one TO two` 在 v1.5.0 崩溃
- Issue #21392
- 状态：Open / fixed on nightly
- 链接：duckdb/duckdb Issue #21392

这是明确的版本回归型崩溃问题，且已标注 **fixed on nightly**。如果 v1.5.1 尚未包含，建议用户优先验证 nightly 或确认补丁已回填。

#### 2) `read_parquet()` 在 `encryption_config + union_by_name=true` 组合下 NULL dereference
- Issue #21508
- 状态：Closed / reproduced
- 链接：duckdb/duckdb Issue #21508

典型空指针崩溃，属于 Parquet 读取组合参数路径回归。已关闭意味着修复链路大概率已完成，建议关注补丁是否进入 v1.5.1。

#### 3) Parquet 输入无统计信息时，MIN/MAX 聚合优化触发 internal error
- Issue #21477
- 状态：Closed / reproduced
- 链接：duckdb/duckdb Issue #21477

说明优化器在依赖统计信息的 fast-path 上仍有空对象防御不足。此类 bug 影响查询稳定性，也削弱用户对“优化不改变正确性”的信任。

#### 4) `WHERE rn = 1` + 混合类型 `PARTITION BY` 导致 binder internal error
- Issue #21560
- 状态：Open / PR submitted
- 链接：duckdb/duckdb Issue #21560  
- 修复 PR：duckdb/duckdb PR #21564

已有明确 fix PR，说明问题定位清晰。

---

### P1 / 查询正确性与事务语义问题

#### 5) `DELETE RETURNING` 对同一事务内刚插入的行返回空结果
- Issue #21540
- 状态：Open / under review
- 链接：duckdb/duckdb Issue #21540

删除本身成功，但 `RETURNING` 结果为空，这是典型 **MVCC 可见性/修改链读取语义** 问题。对依赖 `RETURNING` 做审计、CDC 风格处理的应用影响较大。

#### 6) UNIQUE / PRIMARY KEY 未考虑 collation
- Issue #19675
- 状态：Open / reproduced
- 链接：duckdb/duckdb Issue #19675

属于数据完整性问题，严重程度高于一般语法瑕疵。

#### 7) `date_part` 统计传播存在 off-by-one
- Issue #21478
- 状态：Open / reproduced
- 链接：duckdb/duckdb Issue #21478

不会直接产生错误结果，但会导致统计上界略宽，从而影响优化器剪枝和执行计划质量。属于 **性能正确性边界问题**。

---

### P2 / 兼容性、CLI 与 API 可用性问题

#### 8) `-init` 在 `-cmd` 之前执行，阻止配置注入
- Issue #21535
- 状态：Open / reproduced
- 链接：duckdb/duckdb Issue #21535

这是 CLI 行为与文档描述不一致的问题，影响自动化脚本、容器启动模板与 CI 场景。

#### 9) `read_csv('/dev/stdin')` 无法从 stdin 读取
- Issue #21551
- 状态：Closed / needs triage
- 链接：duckdb/duckdb Issue #21551

影响命令行流水线体验，对 Unix shell 用户尤其明显。虽然不是核心执行器问题，但对“工具化可用性”影响不小。

#### 10) C API 持久化重复插入的内存泄漏
- Issue #21539
- 状态：Open / under review
- 链接：duckdb/duckdb Issue #21539

偏嵌入式开发者问题，长期运行服务中风险更高。

---

## 6. 功能请求与路线图信号

### 6.1 更细粒度的内存治理
- Issue #21547
- 状态：Open / under review
- 链接：duckdb/duckdb Issue #21547

用户希望支持 **query-level / connection-level memory governance**，而不仅是全局 `memory_limit`。  
这说明 DuckDB 的应用方式正在从单用户分析拓展到：
- 多租户嵌入式服务
- 并发 API 服务
- 更复杂的资源隔离场景

如果后续有设置级别或 admission control 相关 PR，这可能成为较高价值的产品化能力。

---

### 6.2 事务内交错流式读取与写入
- PR #21569
- 状态：Open
- 链接：duckdb/duckdb PR #21569

这是今天最强的路线图信号之一。  
它不只是修一个 bug，而是在定义一种更强的连接上下文语义：**suspended query contexts**。若被接受，DuckDB 对流式应用、状态机式处理、数据摄取流程会更友好。

---

### 6.3 JSON 函数增强
- PR #21531
- 状态：Open
- 链接：duckdb/duckdb PR #21531

新增：
- `json_serialize_sorted(json)`
- `json_deep_merge()`

这类功能非常贴近真实用户场景：
- JSON canonicalization
- 缓存 key / 去重
- 配置合并
- 半结构化数据预处理

如果维护者认为实现简单、需求明确，这类函数较可能进入后续小版本。

---

### 6.4 DETACH 时跳过 checkpoint
- PR #21570
- 状态：Open
- 链接：duckdb/duckdb PR #21570

提出 `skip_checkpoint_on_detach` session setting，说明用户已经在更复杂地控制：
- attach/detach 生命周期
- checkpoint 时机
- 数据库文件操作延迟

这与前述 checkpoint transaction 修复形成呼应，可能逐步演化成更完善的持久化控制面。

---

### 6.5 Parquet MAP 列 row group skipping
- PR #21375
- 状态：Open / Merge Conflict
- 链接：duckdb/duckdb PR #21375

为 MAP 列启用 row group skipping，方向明确属于 **Parquet 读取优化**。  
如果解决 merge conflict，这类优化很适合进入未来版本，因为：
- 风险较可控
- 收益清晰
- 与数据湖场景高度相关

---

## 7. 用户反馈摘要

### 7.1 云对象存储场景已成刚需
S3 相关 issue（503 slowdown、分区 copy OOM）显示，用户并不只是把 DuckDB 当本地分析库，而是在实际拿它连接对象存储做生产级数据处理。  
他们的核心痛点不是 SQL 语法，而是：
- 重试机制
- 内存控制
- 大量文件访问时的稳定性
- 写出过程的资源占用

### 7.2 用户对“正确性”容忍度很低
像 `UNIQUE + collation`、`DELETE RETURNING`、窗口函数绑定 internal error 这类问题都不是单纯性能 bug，而是直接影响业务逻辑正确性。  
这表明 DuckDB 已经深入到更严肃的数据处理链路，用户期望它在约束、事务、返回结果语义上接近成熟 OLAP/嵌入式数据库标准。

### 7.3 CLI 与嵌入式 API 都在被重度使用
- CLI：`-init/-cmd`、stdin `read_csv`
- C API：重复持久化插入内存泄漏
- ADBC：交错查询/stream 失败

这说明 DuckDB 的用户面非常广：既有 shell 工具用户，也有将 DuckDB 嵌入服务、驱动框架、数据中间件的开发者。项目需要同时维护“易用性”和“嵌入式稳定性”。

### 7.4 半结构化与高级 SQL 用法持续增长
围绕 struct star、JSON 新函数、MAP skipping、嵌套 Parquet 结构等议题，说明 DuckDB 用户正在深入使用：
- JSON / struct / list
- 嵌套列式格式
- 更复杂表达式与解析器能力

DuckDB 的竞争力已不仅是“快”，还包括对现代分析数据形态的原生支持。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或高价值未决项。

### 8.1 S3 glob 请求 503 Slowdown 重试
- Issue #6153
- 创建时间：2023-02-08
- 状态：Open / under review
- 链接：duckdb/duckdb Issue #6153

这是一个持续时间很长的问题，且随着对象存储成为主流数据底座，其重要性只会增加。建议提高优先级，至少提供可配置重试/退避策略。

### 8.2 分区 COPY 到 S3 内存占用过高
- Issue #11817
- 创建时间：2024-04-24
- 状态：Open / under review
- 链接：duckdb/duckdb Issue #11817

该问题点赞数较高，表明影响面广。对于 DuckDB 作为 ETL/导出引擎的口碑十分关键。

### 8.3 `aggregate(df).*` 语义不一致
- Issue #13055
- 创建时间：2024-07-18
- 状态：Open / reproduced
- 链接：duckdb/duckdb Issue #13055

虽然不如崩溃问题紧急，但它暴露出 struct/star 展开规则在表达式系统中的不统一，长期会影响高级 SQL 用户体验。

### 8.4 `UNIQUE` 约束与 collation 不一致
- Issue #19675
- 创建时间：2025-11-06
- 状态：Open / reproduced
- 链接：duckdb/duckdb Issue #19675

这是应尽快解决的数据正确性积压项。如果 DuckDB 继续强化 PostgreSQL 兼容与企业数据质量场景，这类问题不宜长期悬而未决。

---

# 总结判断

今天 DuckDB 的项目状态可以概括为：**高活跃、高响应、版本修复驱动明显**。  
`v1.5.1` 发布表明团队在积极处理 1.5.0 后续问题，而从 Issues/PR 结构看，当前重点是：
1. **修复 1.5.x 回归与崩溃**
2. **加强 SQL 正确性与事务语义**
3. **继续提升 Parquet / S3 / JSON / 嵌套类型支持**
4. **为更复杂嵌入式使用场景扩展连接与执行上下文能力**

如果你是 DuckDB 用户，今天最值得关注的是：**尽快评估升级到 v1.5.1，并重点回归测试 Parquet、流式接口、CLI 启动参数、事务内 RETURNING 及对象存储访问场景。**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-24）

## 1. 今日速览

过去 24 小时 StarRocks 维持了较高活跃度：Issues 更新 32 条、PR 更新 115 条，代码与社区讨论都很活跃。  
从 PR 结构看，当前重点仍集中在 **查询优化器稳定性、Iceberg/Paimon 等湖仓生态兼容、shared-data 复制链路优化、以及 SQL 兼容性增强**。  
今天没有新版本发布，但多个 PR 明确带有 `3.5 / 4.0 / 4.1` 回移标签，说明维护者仍在并行推进多分支稳定性修复。  
同时，Issue 侧暴露出一些值得关注的风险点：**FE 内存溢出、CN 崩溃、时区函数正确性、外部表/对象存储读取稳定性**，显示项目在复杂生产场景下仍有不少边界问题待收敛。  
整体来看，项目健康度良好，但“高吞吐开发 + 多分支回移”的节奏也意味着回归验证压力不小。

---

## 3. 项目进展

> 今日数据未给出完整“已合并 PR 列表明细”，以下以**已关闭/已推进的重要 PR**为主，重点看对查询引擎、存储、兼容性的实质性进展。

### 3.1 查询引擎与优化器

- **修复优化器超时问题**
  - PR: [#70605](https://github.com/StarRocks/starrocks/pull/70605)
  - 状态: OPEN
  - 价值: 针对 `array_agg(distinct ...)` 多个常量输入场景，`MultiDistinctByMultiFuncRewriter` 可能生成相同逻辑计划，导致规则反复重写、优化器超时。
  - 分析: 这属于典型的 **规则重写不收敛** 问题，影响查询规划稳定性，若合入将直接提升复杂聚合 SQL 的可用性与尾延迟表现。

- **支持 CTE consumer 侧过滤下推**
  - PR: [#70673](https://github.com/StarRocks/starrocks/pull/70673)
  - 状态: OPEN
  - 价值: 将每个 CTE consumer 的谓词与 runtime filter 下推，避免所有行都经 ExchangeNode 广播到每个 consumer。
  - 分析: 这是实打实的执行层优化，尤其利好 **多消费者 CTE、复杂分析 SQL、宽表过滤场景**，有望降低网络传输和下游计算放大。

- **支持 `GROUP BY ALL` 语法**
  - PR: [#70274](https://github.com/StarRocks/starrocks/pull/70274)
  - 状态: OPEN
  - 价值: 增强 SQL 兼容性，向 SQL Server 等数据库靠拢。
  - 分析: 属于语法糖型能力，但对 BI/SQL 迁移工具链很友好，释放出 StarRocks 持续补齐 SQL 方言兼容的信号。

- **窗口函数显式 skew hint 回移出现反复**
  - PR: [#70676](https://github.com/StarRocks/starrocks/pull/70676)
  - 状态: OPEN
  - 关联关闭/回退:
    - [#70614](https://github.com/StarRocks/starrocks/pull/70614)
    - [#70672](https://github.com/StarRocks/starrocks/pull/70672)
    - [#70674](https://github.com/StarRocks/starrocks/pull/70674)
  - 分析: 同一能力在 backport 过程中经历“合入—回退—再提交”，说明该改动可能存在分支兼容性或测试覆盖不足问题。值得维护者重点关注回移链路质量。

### 3.2 存储与复制链路

- **shared-data 复制时支持 DCG 文件同步**
  - PR: [#69339](https://github.com/StarRocks/starrocks/pull/69339)
  - 状态: OPEN
  - 价值: 为 shared-nothing → shared-data 复制补上 DeltaColumnGroup (`.cols`) 文件同步，保障 **Partial Update / Generated Column** 表复制正确性。
  - 分析: 这是云原生存储演进的重要补丁，说明 shared-data 方案正在补齐“高级特性表”的复制一致性。

- **shared-data 集群复制并行化 tablet 文件拷贝**
  - PR: [#70220](https://github.com/StarRocks/starrocks/pull/70220)
  - 状态: OPEN
  - 价值: 针对单 tablet 下 segment 文件多时复制过慢，引入线程池并行复制。
  - 分析: 偏工程效率优化，但对大表迁移、扩容、容灾恢复影响明显，能缩短复制长尾。

- **为 `be_tablet_write_log` 增加 PK index SST 文件统计**
  - PR: [#69860](https://github.com/StarRocks/starrocks/pull/69860)
  - 状态: OPEN
  - 价值: 提升 shared-data 主键索引路径的可观测性。
  - 分析: 这类系统表增强通常是“平台化运营”需求的前兆，方便定位 load/compaction/publish 阶段的性能瓶颈。

- **统一 cloud-native table drop 流程**
  - PR: [#68434](https://github.com/StarRocks/starrocks/pull/68434)
  - 状态: OPEN
  - 价值: 统一云原生表与 partition 的删除流程。
  - 分析: 与下方 `DROP TABLE FORCE` 清理磁盘问题存在潜在关联，说明维护者正在系统性梳理“删除/回收/清理”链路。

### 3.3 兼容性与安全性

- **Paimon 表在 SHOW CREATE / DESC 中展示主键**
  - PR: [#70535](https://github.com/StarRocks/starrocks/pull/70535)
  - 状态: OPEN
  - 价值: 修复元数据展示不完整问题。
  - 分析: 虽然不是执行层改动，但对 **外表治理、Schema 检查、自动化建模工具** 十分关键。

- **审计日志与 SQL 脱敏增强，屏蔽用户认证串**
  - PR: [#70360](https://github.com/StarRocks/starrocks/pull/70360)
  - 状态: OPEN
  - 价值: 避免 `CREATE USER`、`ALTER USER`、`SET PASSWORD` 等语句在 audit/profile 中泄露敏感认证信息。
  - 分析: 这是生产安全合规的高优先级改进，尤其适合金融、政企等审计要求高的场景。

- **移除 `_tablet_multi_get_rpc` 重复 closure ref**
  - PR: [#70657](https://github.com/StarRocks/starrocks/pull/70657)
  - 状态: CLOSED
  - 自动回移:
    - [#70670](https://github.com/StarRocks/starrocks/pull/70670)
  - 分析: 这是偏底层 RPC 生命周期修复，虽改动小，但通常与稳定性、资源释放、并发调用安全相关。

---

## 4. 社区热点

### 4.1 `DROP TABLE FORCE` 不清理磁盘
- Issue: [#41046](https://github.com/StarRocks/starrocks/issues/41046)
- 热度: 评论 9
- 现象: 文档反馈指出 `DROP TABLE FORCE` 后磁盘未被清理。
- 技术诉求分析:
  - 用户关心的不只是“元数据删除”，而是 **物理文件回收语义是否成立**。
  - 这直接关系到云原生存储成本、磁盘容量控制、以及“删除后空间是否可回收”的运维预期。
  - 与 PR [#68434](https://github.com/StarRocks/starrocks/pull/68434) 的删除流程统一方向高度相关，建议联动验证。

### 4.2 Tableau 连接器不支持 “Sort by Field”
- Issue: [#68740](https://github.com/StarRocks/starrocks/issues/68740)
- 热度: 评论 6
- 现象: Live 连接模式下 Tableau 不显示 “Sort by → Field”，Extract 模式正常。
- 技术诉求分析:
  - 这是典型的 **BI 工具连接器能力声明 / capability metadata** 问题。
  - 用户诉求已从“连得上”转向“高级交互能力一致”，说明 StarRocks 正进入更多 BI 产品深度集成阶段。

### 4.3 Iceberg 百万分区导致 FE OOM
- Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- 热度: 评论 5
- 现象: `partitionCache` 对百万级分区 Iceberg 表进行 eager load，触发 FE OOM。
- 技术诉求分析:
  - 这是今天最值得重视的元数据扩展性问题之一。
  - 说明在超大 Iceberg 数据湖场景下，**FE 元数据缓存策略** 仍可能不适配超大规模 catalog。

### 4.4 Docker 部署样例缺失
- Issue: [#63262](https://github.com/StarRocks/starrocks/issues/63262)
- 热度: 评论 5
- 现象: 用户希望官方提供纯 Docker、多 FE/BE、配置/日志/数据映射宿主机的部署样例。
- 技术诉求分析:
  - 反映出项目文档当前更偏 K8s / 快速部署，对 **中小团队、测试环境、离线 PoC** 场景支持不足。

### 4.5 Iceberg V3 支持需求
- Issue: [#60956](https://github.com/StarRocks/starrocks/issues/60956)
- 热度: 👍 13
- 链接: [#60956](https://github.com/StarRocks/starrocks/issues/60956)
- 技术诉求分析:
  - 这是当前最强的路线图信号之一。
  - 随着 Spark/Trino 等生态推进 Iceberg V3，StarRocks 若不跟进，将在湖仓互操作性上逐渐落后。

---

## 5. Bug 与稳定性

> 按严重程度排序，并标注是否看到潜在修复线索。

### P0 / 高优先级

1. **FE OOM：Iceberg 百万分区元数据缓存一次性加载**
   - Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - 风险: FE 崩溃、Catalog 不可用、查询规划受阻。
   - 影响范围: 大规模 Iceberg 元数据场景。
   - 是否已有 fix PR: **未直接看到对应修复 PR**。

2. **CN 崩溃：`Unknown type: 0`**
   - Issue: [#63518](https://github.com/StarRocks/starrocks/issues/63518)
   - 风险: 查询直接触发 CN crash。
   - 影响范围: 3.4.7。
   - 是否已有 fix PR: **未见明确关联 PR**。

3. **Azure Data Lake 上读取 parquet 出现 Segmentation Fault**
   - Issue: [#70478](https://github.com/StarRocks/starrocks/issues/70478)
   - 状态: CLOSED
   - 风险: 外部文件查询导致进程级崩溃。
   - 是否已有 fix PR: 数据中**未明确列出关联 PR**，但 issue 已关闭，推测已有修复或被归并处理。

4. **`CONVERT_TZ` 在 Africa/Casablanca / Africa/El_Aaiun 返回 NULL**
   - Issue: [#70671](https://github.com/StarRocks/starrocks/issues/70671)
   - 关联关闭单:
     - [#70667](https://github.com/StarRocks/starrocks/issues/70667)
   - 风险: 查询结果错误，且只在 BE 执行路径触发，FE 常量折叠路径正常。
   - 技术判断:
     - 这是 **执行路径与常量折叠路径结果不一致** 的正确性问题。
     - 描述中直接指向 `cctz v2.3` 对全年 DST POSIX TZ string 解析问题。
   - 是否已有 fix PR: **尚未看到 PR**，需要尽快补丁。

### P1 / 中高优先级

5. **Iceberg eq delete 场景 `explain logical` 无限递归 / 栈溢出**
   - Issue: [#63341](https://github.com/StarRocks/starrocks/issues/63341)
   - 风险: 计划解释阶段即可触发 `StackOverflowError`。
   - 是否已有 fix PR: 暂未看到；但 Iceberg manifest cache 完整性校验 PR [#70675](https://github.com/StarRocks/starrocks/pull/70675) 说明 Iceberg 相关稳定性正在被持续修补。

6. **无可查询副本：`minReadableVersion` 与 `visibleVersion` 不匹配**
   - Issue: [#63026](https://github.com/StarRocks/starrocks/issues/63026)
   - 风险: 副本状态正常但查询失败，属于较难排查的一致性/版本可见性问题。
   - 是否已有 fix PR: 未看到直接对应项。

7. **`partitionCache` 外的另一个 Iceberg 风险：manifest cache 部分命中导致规划错误**
   - PR: [#70675](https://github.com/StarRocks/starrocks/pull/70675)
   - 状态: OPEN
   - 说明: 这是已在推进中的稳定性修复，防止把“不完整缓存”误当完整命中使用。

### P2 / 中优先级

8. **中文 tokenizer 性能差**
   - Issue: [#63477](https://github.com/StarRocks/starrocks/issues/63477)
   - 风险: 中文全文检索/GIN 索引场景吞吐不足。
   - 是否已有 fix PR: 未见。

9. **`pip_wg_scan_io` 线程导致 CPU 负载不均，甚至集群重启**
   - Issue: [#63358](https://github.com/StarRocks/starrocks/issues/63358)
   - 风险: 资源倾斜与稳定性隐患。
   - 是否已有 fix PR: 未见。

10. **空 CTE 查询触发 `NULL_TYPE is illegal in thrift stage`**
    - Issue: [#63331](https://github.com/StarRocks/starrocks/issues/63331)
    - 风险: 原型开发/临时 SQL 失败，属于语义边界问题。
    - 是否已有 fix PR: 未见。

11. **导出 parquet 即使带排序，输出仍无序**
    - Issue: [#62831](https://github.com/StarRocks/starrocks/issues/62831)
    - 风险: 用户对导出结果有序性的预期与实际不一致。
    - 是否已有 fix PR: 未见。

---

## 6. 功能请求与路线图信号

### 高概率进入后续版本的方向

1. **Iceberg 生态深化**
   - Issue: [#60956](https://github.com/StarRocks/starrocks/issues/60956) — 支持 Apache Iceberg V3
   - 旁证 PR:
     - [#70675](https://github.com/StarRocks/starrocks/pull/70675) Iceberg manifest cache 完整性校验
     - [#63405](https://github.com/StarRocks/starrocks/issues/63405) Iceberg 大小写敏感访问配置
   - 判断: Iceberg 仍是核心投资方向，V3 支持虽未见落地 PR，但相关问题密集出现，进入路线图概率高。

2. **SQL 兼容性增强**
   - PR: [#70274](https://github.com/StarRocks/starrocks/pull/70274) — `GROUP BY ALL`
   - 判断: 此类语法兼容改动门槛相对较低、用户感知强，较可能纳入近期版本。

3. **执行层数据倾斜控制**
   - PR: [#70676](https://github.com/StarRocks/starrocks/pull/70676) — 窗口函数显式 skew hint
   - 判断: 尽管回移过程中有波动，但方向明确，说明团队在关注大查询的数据倾斜治理。

4. **安全与审计合规**
   - PR: [#70360](https://github.com/StarRocks/starrocks/pull/70360) — 审计与 SQL redaction 脱敏增强
   - Issue: [#60276](https://github.com/StarRocks/starrocks/issues/60276) — BE 间支持 HTTPS 通信
   - 判断: 安全能力正在逐步补齐，审计脱敏更可能短期落地，BE 间 HTTPS 属于中长期工程项。

### 值得持续观察的需求

- **纯 Docker 部署官方样例**
  - Issue: [#63262](https://github.com/StarRocks/starrocks/issues/63262)
  - 判断: 更像文档/运维支持需求，短期可能通过 docs 补充解决。

- **移除静态链接 ICU 库，缩小二进制体积**
  - Issue: [#63097](https://github.com/StarRocks/starrocks/issues/63097)
  - 判断: 偏构建优化，优先级通常低于功能与稳定性。

- **BE 间 HTTPS 通信**
  - Issue: [#60276](https://github.com/StarRocks/starrocks/issues/60276)
  - 判断: 需求真实，但涉及 RPC、证书、性能开销与兼容性，实施复杂度较高。

- **Tableau Connector 高级特性支持**
  - Issue: [#68740](https://github.com/StarRocks/starrocks/issues/68740)
  - 判断: 若 StarRocks 持续发力 BI 生态，这类连接器能力将越来越重要。

---

## 7. 用户反馈摘要

### 7.1 生产用户更关心“边界场景稳定性”
- 典型案例:
  - Iceberg 百万分区 FE OOM：[#67760](https://github.com/StarRocks/starrocks/issues/67760)
  - CN crash `Unknown type: 0`：[#63518](https://github.com/StarRocks/starrocks/issues/63518)
  - Azure parquet 查询段错误：[#70478](https://github.com/StarRocks/starrocks/issues/70478)
- 结论:
  - 用户已不满足于基础 OLAP 能力，而是在大规模 catalog、异构对象存储、复杂数据类型下验证 StarRocks 的极限稳定性。

### 7.2 湖仓集成已成为主战场
- 典型案例:
  - Iceberg V3 支持：[#60956](https://github.com/StarRocks/starrocks/issues/60956)
  - Iceberg case-sensitive 配置：[#63405](https://github.com/StarRocks/starrocks/issues/63405)
  - Paimon 主键信息展示修复：[#70535](https://github.com/StarRocks/starrocks/pull/70535)
- 结论:
  - 用户将 StarRocks 作为 lakehouse 查询层使用的趋势更加明显，对元数据一致性、格式规范支持、跨引擎兼容性提出更高要求。

### 7.3 运维与部署体验仍有改进空间
- 典型案例:
  - Docker 部署示例缺乏：[#63262](https://github.com/StarRocks/starrocks/issues/63262)
  - `DROP TABLE FORCE` 磁盘清理语义不清：[#41046](https://github.com/StarRocks/starrocks/issues/41046)
- 结论:
  - 用户不仅关心查询性能，也关心“可部署、可观察、可回收、可维护”的完整运维闭环。

### 7.4 BI/生态连接器进入深水区
- 典型案例:
  - Tableau “Sort by Field” 不支持：[#68740](https://github.com/StarRocks/starrocks/issues/68740)
- 结论:
  - 生态诉求已从“能连”升级到“功能完整兼容”，这是产品成熟期常见信号。

---

## 8. 待处理积压

> 以下问题/PR 具有持续用户价值，但目前看响应或推进力度仍不足，建议维护者重点关注。

### Issues

- **`DROP TABLE FORCE` 不清理磁盘**
  - [#41046](https://github.com/StarRocks/starrocks/issues/41046)
  - 创建于 2024-02-16，已持续一年以上。
  - 原因: 影响删除语义可信度与存储成本回收。

- **BE 间 HTTPS 通信支持**
  - [#60276](https://github.com/StarRocks/starrocks/issues/60276)
  - 原因: 企业安全合规价值高，虽复杂但值得尽早明确路线图。

- **Iceberg V3 支持**
  - [#60956](https://github.com/StarRocks/starrocks/issues/60956)
  - 原因: 👍 数最高，生态战略意义大。

- **纯 Docker 部署文档与样例**
  - [#63262](https://github.com/StarRocks/starrocks/issues/63262)
  - 原因: 明显影响 PoC、测试环境和中小团队采用门槛。

- **主键表部分列更新失效**
  - [#61938](https://github.com/StarRocks/starrocks/issues/61938)
  - 原因: 直接关系到 PK 表核心能力，若属真实缺陷优先级应更高。

### PRs

- **统一 cloud-native table drop 流程**
  - [#68434](https://github.com/StarRocks/starrocks/pull/68434)
  - 创建时间较早，且与删除清理语义相关，建议尽快收口。

- **shared-nothing 到 shared-data 复制支持 DCG 文件同步**
  - [#69339](https://github.com/StarRocks/starrocks/pull/69339)
  - 影响高级特性表复制正确性，属于基础设施级能力补齐。

- **shared-data 集群复制并行化**
  - [#70220](https://github.com/StarRocks/starrocks/pull/70220)
  - 对迁移效率影响较大，建议优先推进。

---

## 结论

今天的 StarRocks 项目动态体现出两个鲜明特征：  
一是**核心引擎仍在快速迭代**，尤其是优化器、CTE 下推、SQL 兼容、shared-data 复制和湖仓元数据稳定性；  
二是**生产级边界问题正在集中暴露**，包括 FE OOM、CN crash、时区函数正确性和对象存储读取崩溃等。  

从路线图信号看，StarRocks 正持续向 **更强湖仓兼容、更完整 SQL 方言、更高云原生可运维性、更严格安全合规** 演进。  
短期建议维护者优先聚焦：**Iceberg 超大规模元数据问题、时区函数正确性、删除回收语义、以及回移链路的回归稳定性**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报 - 2026-03-24

## 1. 今日速览

过去 24 小时 Apache Iceberg 保持**较高活跃度**：Issues 更新 11 条、PR 更新 50 条，说明社区仍在持续推进多引擎兼容、存储稳定性和基础设施治理。  
从内容上看，今日焦点主要集中在 **Spark / Flink 查询正确性修复**、**Parquet 兼容性问题**、**GitHub Actions 供应链安全加固** 以及 **V4 manifest / Variant 能力建设**。  
已关闭/合并项虽然数量不算特别高，但关闭的问题多为**明确的回归修复或基础设施故障处理**，对项目稳定性有直接帮助。  
整体判断：**项目健康度良好，开发节奏积极；当前风险点主要集中在跨引擎行为一致性、对象存储 IO 细节，以及 CI / workflow 安全与可维护性。**

---

## 2. 项目进展

### 今日已关闭/完成的关键事项

#### 2.1 Flink 非确定性 operator UID 修复回补到 1.10.2 分支
- Issue: #15735  
- 链接: https://github.com/apache/iceberg/issues/15735

该问题是一个 **Flink 稳定性/可运维性修复的 backport 请求**，目标是把先前对 `DynamicIcebergSink` 非确定性 operator UID 的修复纳入 1.10.2。  
这类问题虽然不一定直接导致查询错误，但会影响 **Flink 作业升级、savepoint 恢复、拓扑稳定性**，对生产环境非常关键。  
今日该事项已关闭，说明维护者已完成处理或纳入对应修复流程。

---

#### 2.2 `rewrite_position_delete_files` 在 array 列场景下失败的问题已关闭
- Issue: #15080  
- 链接: https://github.com/apache/iceberg/issues/15080

问题描述为：在包含 array 列的表上执行 `rewrite_position_delete_files` 时触发 `ValidationException`，且被标记为 **Iceberg 1.10.0 引入的回归**。  
该问题已关闭，表明针对 **删除文件重写流程** 的兼容性修复已落地，直接改善了维护型 SQL/存储优化操作在复杂 schema 下的可用性。  
配套地，今天还可见一个跨 Spark 版本的跟进 PR 已关闭：

- PR: #15743 `[spark] Spark: Replicate position delete array/map fix to Spark 3.4, 3.5, and 4.0`  
- 链接: https://github.com/apache/iceberg/pull/15743

这说明修复不只是停留在主线或 Spark 4.1，而是在 **Spark 3.4 / 3.5 / 4.0 多分支同步补齐**，对生态用户非常重要。

---

#### 2.3 基础设施问题快速止损：Docker 镜像构建 workflow 失败已修复
- Issue: #15728  
- 链接: https://github.com/apache/iceberg/issues/15728
- PR: #15730 `[INFRA] Infra: Pin versions in publish-iceberg-rest-fixture-docker.yml`  
- 链接: https://github.com/apache/iceberg/pull/15730

`iceberg-rest-fixture` Docker 镜像发布流程因 GitHub Enterprise Action 白名单限制而失败，属于**CI / 发布通道阻断类问题**。  
相关 PR 已关闭，说明维护者已通过 pin 版本等方式完成修复。  
这类问题虽然不涉及查询引擎本身，但直接影响：
- 测试夹具镜像发布
- REST Catalog 相关开发/测试效率
- 项目交付链稳定性

---

#### 2.4 REST Catalog OpenAPI 404 语义处理 PR 已关闭
- PR: #14965 `API, Core: Add 404 handling for /v1/config endpoint`  
- 链接: https://github.com/apache/iceberg/pull/14965

该 PR 聚焦 REST Catalog `/v1/config` 接口在 warehouse 不存在时的 404 语义补充。  
PR 已关闭，虽然未见明确说明是合并还是放弃，但从技术方向上看，这反映出社区持续在 **完善 REST Catalog 协议细节与错误语义**。  
对于做多目录、多租户 catalog 管理的用户而言，这类 API 行为一致性非常关键。

---

## 3. 社区热点

### 3.1 GitHub Workflow 供应链安全加固
- Issue: #15742 `Harden GitHub Workflow Against Supply Chain Attacks`  
- 链接: https://github.com/apache/iceberg/issues/15742

这是今天最值得关注的话题之一。Issue 明确提到近期 GitHub workflow 供应链攻击事件，建议对 Iceberg 全项目 workflow 进行系统性加固，包括：
- CodeQL 检查 workflow 定义
- action 版本固定
- 依赖来源收敛

**技术诉求分析：**
Iceberg 作为基础数据平台项目，CI/CD 安全已经从“工程问题”上升为“供应链可信问题”。  
今天还出现了相关实验 PR：

- PR: #15749 `[INFRA] [do not merge] test ci using astral-sh/setup-uv@v7`  
- 链接: https://github.com/apache/iceberg/pull/15749

说明社区不只是讨论，还在验证更安全的 workflow 依赖策略。  
这是明显的**项目治理信号**，预计后续几天会继续有配套 PR 出现。

---

### 3.2 Spark 读取删除文件时的连接死锁问题
- PR: #15712 `[spark] Spark: preload delete files to avoid deadlocks`  
- 链接: https://github.com/apache/iceberg/pull/15712

该 PR 指向一个很实用的生产问题：  
在 Spark 中，**数据文件加载占用连接**，而延迟加载 delete file 时又尝试申请新的连接；当 `http-client.apache.max-connections` 等连接数受限时，容易形成死锁。

**技术诉求分析：**
- 面向对象存储/REST 访问的连接池上限问题在大规模 scan 中很典型
- delete file 的 lazy loading 设计在资源紧张时可能带来副作用
- 社区正推动用“预加载 delete files”换取更稳定的 scan 行为

这类修复对 **Merge-on-Read / delete-heavy workload** 用户价值很高。

---

### 3.3 V4 manifest 基础类型建设持续推进
- PR: #15049 `[API, core] API, Core: Introduce foundational types for V4 manifest support`  
- 链接: https://github.com/apache/iceberg/pull/15049

这是当前较有路线图意味的 PR。它为未来 **V4 adaptive metadata tree / single-file commit** 等能力引入基础类型。  

**技术诉求分析：**
- 降低 manifest 读写成本
- 为更大规模元数据管理做演进准备
- 给后续 manifest reader/writer 改造打基础

虽然尚未完成，但它释放了明确的架构信号：**Iceberg 元数据层正在为下一代格式演进铺路**。

---

### 3.4 Flink Variant 写入能力扩展
- PR: #15471 `[flink] Flink: SQL: Add variant avro dynamic record generator`  
- 链接: https://github.com/apache/iceberg/pull/15471

该 PR 尝试在 Flink SQL 侧增加 **Variant + Avro 动态 record 生成器**，用于将带 schema 的 Variant 数据写入 Iceberg 表。  

**技术诉求分析：**
- Variant 正成为 Iceberg 多模/半结构化数据路线的重要一环
- 用户希望从 SQL 层直接接入 Avro schema 驱动的 Variant 写入
- 与今日另一个性能请求相呼应（见 Issue #15628），说明 Variant 能力正在从“功能可用”走向“性能可衡量、生态可接入”

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1 - Spark 查询正确性：同表不同 snapshot 查询返回相同数据
- Issue: #15741  
- 链接: https://github.com/apache/iceberg/issues/15741

**现象**：在 Spark 中连续对同一表的两个不同 snapshot ID 执行 `spark.sql` 查询时，第二次查询返回的是第一次 snapshot 的数据。  
**影响**：这是典型的 **查询正确性问题**，涉及 snapshot isolation / 缓存复用错误，若可复现，影响非常严重。  
**当前状态**：新开 issue，暂未看到对应 fix PR。  
**建议关注级别**：最高。尤其影响依赖 time travel / snapshot audit 的用户。

---

### P1 - GCS 凭证无法刷新，长任务中途崩溃
- Issue: #15414  
- 链接: https://github.com/apache/iceberg/issues/15414

**现象**：`GCSAuthManager` 似乎不支持 access token refresh，导致 Spark 作业运行中途崩溃。  
**影响**：直接影响 **长时作业稳定性**，属于云存储鉴权链路缺陷。  
**当前状态**：仍为 open，已有 8 条评论，说明用户痛感明确。  
**是否已有 fix PR**：数据中未看到直接对应 PR。  
**风险判断**：对运行在 GCS 上的批处理/流处理用户影响较大，特别是 token 生命周期短、任务时间长的场景。

---

### P1 - Flink DynamicIcebergSink 缓存键遗漏参数，配置变更失效
- Issue: #15731  
- 链接: https://github.com/apache/iceberg/issues/15731

**现象**：`HashKeyGenerator.SelectorKey` 的 cache key 未包含 `writeParallelism` 与 `distributionMode`，导致运行时这些参数变化后仍沿用旧缓存。  
**影响**：会造成 **配置更新不生效**，进而影响数据分布、并行写入行为甚至性能与正确性预期。  
**是否已有 fix PR**：暂未在今日 PR 列表中看到直接对应项。  
**风险判断**：对 Flink 动态写入场景是高优先级缺陷。

---

### P2 - Spark DELETE/UPDATE/MERGE 在 MAP/LIST 列上 NPE
- PR: #15726  
- 链接: https://github.com/apache/iceberg/pull/15726

**现象**：分区表包含 MAP/LIST 列时，在 Spark 4.1 + Iceberg 1.11 运行 `DELETE/UPDATE/MERGE` 会抛 NPE。  
**状态**：已有修复 PR，说明问题已被快速接住。  
**影响范围**：影响 DML 语义与复杂类型兼容，是典型 SQL 引擎兼容性问题。  
**补充**：结合 #15080 / #15743，可看出近期社区在**集中修复复杂嵌套类型与 delete/position delete 路径的兼容性问题**。

---

### P2 - Parquet 2-level list 编码读取崩溃
- PR: #15747 `[spark, parquet, flink] Parquet: Fix readers crashing on 2-level (Thrift) list encoding`
- 链接: https://github.com/apache/iceberg/pull/15747

**现象**：Parquet reader 在处理 2-level（Thrift 风格）list encoding 时崩溃。  
**影响**：
- 影响 Spark / Flink / Parquet 共享 reader 路径
- 属于历史兼容格式读取问题
- 对接老数据或异构系统写出的 Parquet 文件时尤其关键

**状态**：已有 PR，且明确关闭历史问题 #9497。  
这是一个**高价值兼容性修复**。

---

### P3 - 随机指标生成工具 NPE
- PR: #15748 `[core] Fix NPE of generateRandomMetrics in FileGenerationUtil`
- 链接: https://github.com/apache/iceberg/pull/15748

问题发生在测试/工具层，影响面相对较小，但有助于提升测试稳定性和开发体验。

---

### P3 - Spark 远程扫描规划测试不稳定
- Issue: #15724  
- 链接: https://github.com/apache/iceberg/issues/15724

`TestRemoteScanPlanning > testTimestampAsOf()` 出现 flaky failure。  
该问题已关闭，说明测试不稳定性已被识别并处理。  
这对保持主干 CI 可信度是积极信号。

---

## 5. 功能请求与路线图信号

### 5.1 Variant 性能基准需求增强
- Issue: #15628 `Core: Add JMH benchmarks for Variants`
- 链接: https://github.com/apache/iceberg/issues/15628

用户希望增加 Variant 相关的 JMH benchmark，以评估扩展性与性能退化风险。  
这不是简单“补 benchmark”，而是说明：
- Variant 已进入真实使用/评估阶段
- 社区开始关心其规模化性能
- 后续优化需要有量化依据

结合下列 PR：
- PR #15471 Flink Variant Avro 动态 record 生成器  
  https://github.com/apache/iceberg/pull/15471

可以判断：**Variant 很可能是 Iceberg 下一阶段重点增强方向之一**，涵盖 API、执行引擎接入和性能治理。

---

### 5.2 V4 manifest / 自适应元数据树
- PR: #15049  
- 链接: https://github.com/apache/iceberg/pull/15049

虽然不是以 issue 形式提出，但它是非常明确的路线图信号。  
这类基础类型 PR 往往意味着未来数周/数月会有连续演进，可能包括：
- manifest 读写抽象调整
- metadata tree 改造
- 更高效的元数据提交与扫描

对超大规模表用户尤其值得关注。

---

### 5.3 Spark 4.1 DSv2 能力继续推进
- PR: #14948 `[WIP] Spark 4.1: Implement SupportsReportOrdering DSv2 API`
- 链接: https://github.com/apache/iceberg/pull/14948

该 PR 仍在进行中，但说明 Iceberg 正持续适配 Spark 4.1 的 DSv2 新接口。  
若落地，可能提升：
- 查询计划优化器对 ordering 信息的利用
- 更好的 scan/report ordering 语义表达
- Spark 4.1 下的原生能力对齐

---

### 5.4 AWS / S3 兼容性配置增强
- PR: #15391 `[docs, AWS] Add S3 checksum policy configuration tied to s3.checksum-enabled`
- 链接: https://github.com/apache/iceberg/pull/15391

该 PR 指向 S3-compatible 存储（如 Dell ECS）对 checksum headers 支持不足的问题。  
这类改动很可能被纳入后续版本，因为它具备：
- 明确用户场景
- 较低接口风险
- 明显兼容性收益

---

## 6. 用户反馈摘要

### 6.1 云对象存储长期作业的认证续期仍是痛点
- Issue: #15414  
- 链接: https://github.com/apache/iceberg/issues/15414

用户反馈表明，在 GCS 上运行 Spark 作业时，任务并非启动即失败，而是**运行到中途因 token 无法刷新而崩溃**。  
这说明痛点集中在：
- 长作业稳定性
- 认证组件生命周期管理
- 云厂商 SDK 与 Iceberg 认证封装的协同

---

### 6.2 用户高度关注 time travel / snapshot 查询的正确性
- Issue: #15741  
- 链接: https://github.com/apache/iceberg/issues/15741

同表不同 snapshot 查询返回相同结果，说明用户在实际使用中对 **快照级审计、回放、比对** 有明确需求。  
这类用户通常来自：
- 数据回溯
- 质量审计
- 历史版本对账

一旦结果错误，业务信任成本极高。

---

### 6.3 Flink 动态写入场景对运行时配置敏感
- Issue: #15731  
- 链接: https://github.com/apache/iceberg/issues/15731

用户反馈显示，Flink 写入管道不只是“能写”，还要求：
- 并行度调整即时生效
- 分布模式切换准确反映
- 动态 sink 行为可预测

这说明 Flink 用户群体已进入更复杂的生产调优阶段。

---

### 6.4 复杂类型兼容性仍是高频真实问题
- PR: #15726  
- 链接: https://github.com/apache/iceberg/pull/15726
- PR: #15747  
- 链接: https://github.com/apache/iceberg/pull/15747

MAP/LIST 列 DML NPE、Parquet 2-level list 崩溃都指向同一现实：  
**复杂嵌套类型与历史编码兼容性仍是用户在生产中频繁踩到的问题。**

---

## 7. 待处理积压

以下是值得维护者继续关注的长期或半长期积压项：

### 7.1 Kafka Connect upsert 能力问题被 stale 关闭，但用户诉求未必消失
- Issue: #13986 `[stale] Kafka connectors with upsert option`
- 链接: https://github.com/apache/iceberg/issues/13986

该问题今日关闭，但从描述看，用户关心的是 Kafka connector 是否支持类似 Tabular 版本中的 upsert 模式。  
这是一个**产品能力缺口类问题**，不是简单 bug。  
建议维护者：
- 明确官方 connector 的 upsert 能力边界
- 给出替代方案或路线说明
- 避免用户因 stale 关闭而误判“问题已解决”

---

### 7.2 Kafka Connect control topic 分区建议仍无人系统回答
- Issue: #13787 `[question, stale] Question: recommendation on control topic partitions`
- 链接: https://github.com/apache/iceberg/issues/13787

该 issue 反映的是 **Kafka Connect 部署与运维实践指导缺失**。  
虽然是 question，但其价值很高，因为它关系到：
- 多 Connect 集群共享 Kafka 集群时的控制面设计
- control topic 分区策略
- connector 扩展性和冲突风险

建议补充文档或 FAQ，而不只是让问题进入 stale 流程。

---

### 7.3 多个 stale PR 仍在排队，可能需要维护者明确结论
重点包括：

- PR #15397 `Infra: Optimize - Run CI workflows on fork compute via push triggers`  
  https://github.com/apache/iceberg/pull/15397

- PR #15393 `Kafka Connect: Fix case-insensitive field lookup with name mapping`  
  https://github.com/apache/iceberg/pull/15393

- PR #15379 `[FLINK] Fix s3 IO unclosed instance`  
  https://github.com/apache/iceberg/pull/15379

- PR #15226 `Spark: Include info about failed commits in the result of RewriteDataFilesAction`  
  https://github.com/apache/iceberg/pull/15226

- PR #15210 `AWS: Eager clearing of staging file list and multipart map in S3 Multipart Upload`  
  https://github.com/apache/iceberg/pull/15210

这些 PR 覆盖了：
- CI 成本优化
- Kafka Connect schema 映射正确性
- S3 IO 资源泄漏
- RewriteDataFilesAction 结果可观测性
- Multipart upload 清理

它们都不是“边角需求”，建议维护者尽快给出：
- 要求补测
- 拆分提交
- 明确拒绝
- 或安排 reviewer

---

## 8. 总结判断

今天的 Iceberg 体现出三个明显趋势：

1. **稳定性修复在继续加速**：尤其是 Spark/Flink 下复杂类型、delete file、snapshot 查询、Parquet 兼容等路径。  
2. **基础设施与安全治理权重上升**：从 Docker workflow 故障修复到供应链安全加固，说明项目对工程可信性的重视明显提高。  
3. **中长期演进方向更清晰**：Variant、V4 manifest、Spark 4.1 DSv2 适配都在释放下一阶段路线图信号。

综合来看，Apache Iceberg 当前处于**高活跃、强修复、稳演进**状态；短期内最应优先关注的是 **Spark snapshot 查询正确性** 与 **GCS 凭证刷新** 这两类直接影响生产可用性的高优先级问题。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-24）

## 1. 今日速览

过去 24 小时 Delta Lake 保持**高活跃度**：Issues 更新 2 条、PR 更新 31 条，明显以 **PR 驱动的开发推进** 为主。  
从主题分布看，今天的重点集中在 **Kernel + Spark 集成、CDC 流式消费、DSv2 连接器能力补齐、UniForm/Iceberg 兼容性、以及 CI 稳定性治理**。  
稳定性方面，出现了一个值得高度关注的 **silent data loss（静默数据丢失）** 问题，影响 coordinated commits 下的流式读取正确性，不过已同步出现回归测试与修复 PR，说明维护者对正确性问题响应较快。  
整体来看，项目健康度良好：**核心功能持续演进，兼容性和测试基础设施同步加强，但流式一致性相关风险需要持续关注。**

---

## 3. 项目进展

> 今日无新版本发布。以下聚焦已关闭/合并的重要 PR 及其代表性进展。  
> 注：数据中“已合并/关闭: 7”，但仅展示到部分 PR；以下按已关闭 PR 与有明确落地方向的事项总结。

### 3.1 UniForm / Iceberg 兼容性错误提示修复
- **PR #6352** `[CLOSED] [Spark] Fix misleading error message when UniForm Iceberg is enabled without a supported IcebergCompat version`  
  链接: delta-io/delta PR #6352

**进展解读：**
该修复针对 **UniForm Iceberg 功能开启但 IcebergCompat 版本不受支持** 时的报错体验，属于典型的 SQL/存储格式兼容性可用性改进。  
虽然不是底层存储协议变化，但它直接影响用户在开启 Delta ↔ Iceberg 互操作时的**可诊断性**，有助于减少错误配置导致的误判和支持成本。

**价值：**
- 改善 UniForm/Iceberg 功能启用时的用户体验
- 降低兼容性配置门槛
- 对多格式湖仓场景更友好

---

### 3.2 Decimal IN 谓词边界崩溃修复
- **PR #6354** `[CLOSED] [kernel-spark] [Spark] Fix decimal IN predicate crash when BigDecimal precision < scale`  
  链接: delta-io/delta PR #6354

**进展解读：**
这是一个典型的 **表达式转换 / 谓词下推边界条件修复**。问题发生在 `BigDecimal precision < scale` 的特殊数值场景下，`ExpressionUtils.convertValueToKernelLiteral` 在转换为 Kernel literal 时可能崩溃。  
修复方式是对 precision 做归一化后再调用 `Literal.ofDecimal`，并附带了单元测试。

**价值：**
- 修复 Spark ↔ Kernel 表达式桥接中的崩溃问题
- 提升 decimal 类型过滤条件的鲁棒性
- 属于典型 SQL 兼容性与查询稳定性修补

---

### 3.3 Unity Catalog 依赖升级尝试继续推进
- **PR #6357** `[CLOSED] Upgrade Unity Catalog to 0.4.1-SNAPSHOT`  
- **PR #6358** `[OPEN] Upgrade Unity Catalog to 0.4.1-SNAPSHOT`  
  链接: delta-io/delta PR #6358

**进展解读：**
#6357 关闭、#6358 重新发起，说明维护者仍在推动 **Unity Catalog 0.4.1-SNAPSHOT** 的依赖升级。  
这类“关闭后重开替代 PR”的动作通常意味着：
- 需要调整构建方式或仓库配置
- Snapshot 依赖解析存在细节问题
- 维护者在迭代更稳妥的升级路径

**价值：**
- 强化 Delta 与 UC 生态协同
- 为后续 REST 提交、目录管理、外部元数据能力奠定依赖基础

---

## 4. 社区热点

### 4.1 CDC Streaming Offset Management 大栈式 PR 持续推进
- **PR #6075** `[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)`  
- **PR #6076** `[kernel-spark][Part 2] CDC streaming offset management (add commit processing logic for incremental changes)`  
- **PR #6336** `[kernel-spark][Part 3] CDC streaming offset management (finish wiring up incremental change processing)`  
- **PR #6359** `DO NOT MERGE`  
  链接: delta-io/delta PR #6075 / #6076 / #6336 / #6359

**热点分析：**
今天最值得关注的是这组 **stacked PR**。它们围绕 **Kernel-Spark 下 CDC 流式 offset 管理** 展开，从 initial snapshot 到 incremental change processing，再到 wiring 完整打通，显示这不是局部修补，而是一个系统性的流式消费能力建设。

**背后技术诉求：**
- 统一 Delta Kernel 与 Spark Streaming 的增量变更消费语义
- 更精确地表达 snapshot → incremental 切换
- 为 Change Data Feed / CDC 场景提供更稳健的 offset 管理机制
- 降低在复杂提交场景下出现漏读、重读、顺序错乱的风险

这组 PR 很可能是后续版本中 **流式读取一致性与 CDC 产品化能力** 的关键里程碑。

---

### 4.2 coordinated commits 下的流式静默丢数问题引发关注
- **Issue #6339** `[OPEN] [bug] commitFilesIterator causing silent data loss with coordinated commits`  
- **PR #6338** `[OPEN] [Spark] Add regression test for streaming data loss with coordinated commits`  
- **PR #6353** `[OPEN] Fix race condition in commitFilesIterator causing silent data loss with coordinated commits`  
  链接: delta-io/delta Issue #6339 / PR #6338 / PR #6353

**热点分析：**
这是今天技术风险最高的话题。问题出在 `commitFilesIterator` 两阶段发现提交文件的逻辑里：  
1. 先从文件系统列出 backfilled files  
2. 再从 coordinator 查询未 backfill 的 commits  

若在两阶段之间发生并发 backfill，就可能导致某些 commit 既不在 phase 1，也不在 phase 2 中，从而造成**静默数据丢失**。

**背后技术诉求：**
- 分布式提交协调机制下的一致性保证
- 流式查询“正确性高于性能”的底线保障
- coordinated commits 与 backfill 并发时的可线性化视图

从“先有 reproducer PR，再有 fix PR”的节奏看，社区对正确性问题的处理流程比较成熟。

---

### 4.3 DSv2 + Kernel 能力持续补齐
- **PR #6313** `[Spark][DSv2] Support metadata-only create table via Kernel`  
- **PR #6249** `[kernel-spark] Support ignoreChanges read option in dsv2`  
- **PR #6250** `[kernel-spark] Support ignoreFileDeletion read option in dsv2`  
- **PR #6355** `[kernel-spark] [Spark] Add AlwaysTrue/AlwaysFalse filter pushdown to V2 connector`  
  链接: delta-io/delta PR #6313 / #6249 / #6250 / #6355

**热点分析：**
DSv2 正成为 Delta Kernel 落地 Spark 生态的重要承载层。今天活跃 PR 集中在：
- metadata-only create table
- read option 兼容 (`ignoreChanges`, `ignoreFileDeletion`)
- filter pushdown 语义补齐

**背后技术诉求：**
- 让 DSv2 connector 更接近传统 Delta Source 的行为一致性
- 提升查询优化器与 Kernel 执行层的对接质量
- 支持更多真实生产读写模式，而不仅是最小可用实现

---

## 5. Bug 与稳定性

按严重程度排序：

### P0 / 高危：coordinated commits 下可能发生静默数据丢失
- **Issue #6339** `[OPEN] [bug] commitFilesIterator causing silent data loss with coordinated commits`  
  链接: delta-io/delta Issue #6339
- **回归测试 PR #6338**  
  链接: delta-io/delta PR #6338
- **修复 PR #6353**  
  链接: delta-io/delta PR #6353

**影响：**
- 影响流式读取正确性
- 在并发 backfill 与 coordinator 交错时触发
- 由于是 silent data loss，危险性高于显式失败

**当前状态：**
- 已有复现用例
- 已有 fix PR
- 建议维护者优先审查、合并并考虑补充更多并发回归测试

---

### P1 / 中高：Decimal IN 谓词在边界精度值下崩溃
- **PR #6354** `[CLOSED] [kernel-spark] [Spark] Fix decimal IN predicate crash when BigDecimal precision < scale`  
  链接: delta-io/delta PR #6354

**影响：**
- 特定 decimal 条件查询可能直接 crash
- 影响 Spark + Kernel 表达式转换稳定性

**当前状态：**
- 已关闭，推测已处理完成或被替代
- 建议关注是否已进入主分支或由后续 PR 接续

---

### P2 / 中：UniForm Iceberg 配置错误时提示误导
- **Issue #6351** `[CLOSED] Create Delta iceberg uniform table`  
  链接: delta-io/delta Issue #6351
- **PR #6352** `[CLOSED] [Spark] Fix misleading error message when UniForm Iceberg is enabled without a supported IcebergCompat version`  
  链接: delta-io/delta PR #6352

**影响：**
- 不一定造成数据错误，但会误导用户判断根因
- 影响 UniForm/Iceberg 上手体验与兼容性排障效率

**当前状态：**
- 问题已快速关闭
- 配套修复已给出，说明维护者对用户反馈响应及时

---

### P2 / 中：测试与 CI 不稳定问题继续治理
- **PR #6348** `[CI Improvements] Fix flaky DeltaRetentionWithCatalogOwnedBatch1Suite test`  
- **PR #6334** `[CI Improvements] restrict cache writes to master to prevent PR cache eviction`  
  链接: delta-io/delta PR #6348 / #6334

**影响：**
- 直接影响开发效率与合并吞吐
- 间接影响回归检测质量

**当前状态：**
- 均在推进中
- 说明项目已开始系统性治理 flaky test 与缓存策略问题

---

## 6. 功能请求与路线图信号

### 6.1 UniForm / Iceberg 互操作仍是明确方向
- **Issue #6351** `[CLOSED] Create Delta iceberg uniform table`  
- **PR #6335** `[UniForm] Write atomic-supported property to Iceberg compact tables`  
- **PR #6270** `Skip redundant IcebergCompatV3 validation when WriterCompatV3 already ran it`  
  链接: delta-io/delta Issue #6351 / PR #6335 / #6270

**判断：**
尽管今天新增 issue 本身已关闭，但结合相关 PR 看，**UniForm + Iceberg 兼容能力** 仍然是活跃路线。  
其中 #6335 与 #6270 分别对应：
- Iceberg compact table 元数据属性写入
- 减少 IcebergCompatV3 重复校验

这表明路线图不只是“能用”，而是在向 **性能、正确性、可运维性** 继续优化。

---

### 6.2 DSv2 + Kernel 读写能力扩展大概率进入下一阶段版本
- **PR #6313** metadata-only create table via Kernel  
- **PR #6249** support `ignoreChanges`  
- **PR #6250** support `ignoreFileDeletion`  
- **PR #6355** AlwaysTrue/AlwaysFalse filter pushdown  
  链接: delta-io/delta PR #6313 / #6249 / #6250 / #6355

**判断：**
这些 PR 共同指向一个清晰趋势：**Kernel 不再只是底层库，而是逐步成为 Spark DSv2 connector 的主路径能力提供者。**  
若这些能力陆续合并，下一版本中很可能看到：
- DSv2 行为与传统 Delta Source 更一致
- 谓词下推和元数据写入路径更完整
- Spark 侧 connector 的 Kernel 化程度进一步提高

---

### 6.3 Unity Catalog 深度集成持续增强
- **PR #6347** `Plumb UC-managed schema evolution through Delta REST commits`  
- **PR #6358** `Upgrade Unity Catalog to 0.4.1-SNAPSHOT`  
  链接: delta-io/delta PR #6347 / #6358

**判断：**
今天最强的生态信号来自 UC 方向：  
- 把 **UC-managed schema evolution** 接入 Delta REST commit 路径  
- 升级 UC 依赖版本

这意味着 Delta 正在继续强化与 **统一元数据、托管 schema 变更、REST 提交协议** 的协同能力，面向企业级湖仓治理场景。

---

### 6.4 Spark 4.0 / Variant 兼容防护开始前置
- **PR #6356** `[SPARK] Add config to block Spark 4.0 clients from writing to Variant tables`  
  链接: delta-io/delta PR #6356

**判断：**
这类“显式阻断不安全写入”的 PR 很有路线图价值。它说明维护者意识到 **新 Spark 版本 + 新数据类型/表特性** 的组合还未完全稳定，倾向于先加安全阀，再逐步放开兼容性。  
这通常是成熟项目处理跨版本协议兼容的健康信号。

---

## 7. 用户反馈摘要

### 7.1 用户在 UniForm Iceberg 建表时遇到配置/报错可理解性问题
- **Issue #6351**  
  链接: delta-io/delta Issue #6351

**提炼出的痛点：**
- 用户已在真实 Spark SQL 启动环境中尝试配置 UC 与外部访问
- 触发的是“建表/启用互操作”这种真实接入场景，而非实验性 API
- 问题核心不一定是功能缺失，而是**错误信息无法准确指向 IcebergCompat 版本约束**

**说明：**
用户对 Delta + UniForm + UC + Iceberg 的组合使用意愿较强，但也意味着兼容矩阵和报错引导必须更清晰。

---

### 7.2 流式用户对“正确性问题”高度敏感
- **Issue #6339 / PR #6338**  
  链接: delta-io/delta Issue #6339 / PR #6338

**提炼出的痛点：**
- 用户不仅报告问题，还主动提供 reproducer PR
- 场景是 **100 次顺序单行提交 + streaming consumer 回放**，非常贴近真实回归测试设计
- 关注点不是性能，而是 **是否漏数**

**说明：**
Delta 的高阶用户已经把项目用于对正确性要求很高的生产场景，尤其是流式增量消费与分布式提交协调场景。

---

## 8. 待处理积压

以下是值得维护者持续关注的未完成项：

### 8.1 CDC streaming offset management 系列 PR 体量大、链路长
- **PR #6075 / #6076 / #6336**  
  链接: delta-io/delta PR #6075 / #6076 / #6336

**提醒原因：**
- 自 2 月中旬开始推进，仍在持续更新
- 属于 stacked PR，审查成本高、合并依赖强
- 一旦长期挂起，容易拖慢 CDC/Kernal-Spark 相关功能整体落地

**建议：**
- 维护者可考虑分阶段明确 merge checkpoint
- 对外同步该系列 PR 的阶段目标与风险点

---

### 8.2 DSv2 读选项兼容 PR 需要避免长期悬而未决
- **PR #6249** `Support ignoreChanges read option in dsv2`  
- **PR #6250** `Support ignoreFileDeletion read option in dsv2`  
  链接: delta-io/delta PR #6249 / #6250

**提醒原因：**
- 这两项是用户迁移到 DSv2 的关键行为兼容能力
- 若迟迟不合并，可能影响 connector 路径切换

---

### 8.3 CI 与 flaky test 改善需要持续投入
- **PR #6334** / **PR #6348**  
  链接: delta-io/delta PR #6334 / #6348

**提醒原因：**
- 这类工作短期不显眼，但对高并发 PR 项目极其重要
- 当前 PR 活跃度很高，CI 稳定性会直接决定合并效率和回归质量

---

## 总结判断

今天 Delta Lake 的主旋律非常清晰：  
1. **Kernel + Spark + DSv2** 集成继续加深；  
2. **CDC/流式 offset 管理** 是核心演进方向；  
3. **UniForm/Iceberg/Unity Catalog** 生态互操作持续加强；  
4. 项目对 **正确性与 CI 稳定性** 保持较强响应。  

短期最需要关注的是 **Issue #6339 对应的静默丢数修复** 是否能尽快落地；中期则重点观察 **CDC stacked PR** 和 **DSv2/Kernel 功能补齐** 是否进入合并节奏。整体上，Delta Lake 仍处于一个**功能扩张与工程稳态并行推进**的健康阶段。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 · 2026-03-24

## 1. 今日速览

过去 24 小时内，Databend 社区保持了较高活跃度：Issues 更新 14 条、PR 更新 16 条，且多数集中在 **SQL 解析器、查询规划器、常量折叠、Join 语义与稳定性修复**。  
整体来看，今天的信号非常明确：项目正在经历一轮 **由 DuckDB sqllogictest 迁移测试驱动的兼容性与健壮性集中修复**，暴露出不少 panic / unwrap / overflow 类问题，但对应修复 PR 也在快速跟进。  
存储与执行引擎侧也有实质进展，包括 **recluster oversized block 修复** 和 **Fuse block format 抽象重构**，说明团队并未只盯 SQL 层。  
健康度评估上，**响应速度较好、修复闭环较快**，但也反映出 nightly 版本在查询稳定性上仍有一定波动，尤其是 planner / parser / optimizer 边界条件。

---

## 3. 项目进展

### 已关闭 / 已合并的重要 PR

#### 1) 修复 BIGINT 常量乘法溢出 panic
- PR: [#19589](https://github.com/databendlabs/databend/pull/19589) `fix(functions): avoid BIGINT multiply panic during constant folding`
- 对应 Issue: [#19575](https://github.com/databendlabs/databend/issues/19575)

**进展解读：**
该修复将 `BIGINT * BIGINT` 溢出从内部 panic 转为标准 SQL overflow error，属于典型的 **查询正确性 + 错误模型规范化** 改进。  
这对 SQL 引擎非常重要：分析型数据库在常量折叠阶段若直接 panic，会影响可预期性，也不利于上层 BI / ETL 工具接入。

---

#### 2) 修复递归视图导致的 query 进程崩溃
- PR: [#19584](https://github.com/databendlabs/databend/pull/19584) `fix(query): avoid create or alter recursive views`
- 对应 Issue: [#19572](https://github.com/databendlabs/databend/issues/19572)

**进展解读：**
该修复直接阻止创建或修改递归视图，避免 `databend-query` 因递归依赖导致崩溃。  
这是一个 **高严重度稳定性问题**，因为它不只是返回错误，而是可能造成服务进程级别故障。短期内通过语义限制规避，属于合理的止血方案；长期仍可能需要更完整的依赖检测与递归语义设计。

---

#### 3) 修复 UNION 括号语义丢失导致 parse assertion failed
- PR: [#19587](https://github.com/databendlabs/databend/pull/19587) `fix(query): preserve parentheses in UNION queries`
- 对应 Issue: [#19578](https://github.com/databendlabs/databend/issues/19578)

**进展解读：**
该修复保证 AST 构造时保留 set operation 的分组括号，避免 `UNION/INTERSECT/EXCEPT` 被错误扁平化。  
这属于 **SQL 兼容性与解析正确性修复**，对复杂查询、迁移测试和 sqllogictest 覆盖都很关键。

---

#### 4) 修复 recluster 产生 oversized compact blocks
- PR: [#19577](https://github.com/databendlabs/databend/pull/19577) `fix(storage): split oversized compact blocks during recluster`

**进展解读：**
该修复针对存储层 recluster 路径，在 sort + compaction 后防止生成过大的 block。  
这说明 Databend 在 **Fuse 存储组织与后台整理流程** 上持续打磨，预期将改善大表整理、后续读取效率以及块尺寸稳定性，对 OLAP 场景较有实际价值。

---

### 仍在推进的重点 PR

#### 5) TEXT 文件格式参数增强
- PR: [#19588](https://github.com/databendlabs/databend/pull/19588) `feat(stage): add TEXT file format params`

新增参数包括：
- `empty_field_as=NULL|FieldDefault|String`
- `error_on_column_count_mismatch=true|false`

**意义：**
这是明显的 **数据导入能力增强**。对 TSV / TEXT ingestion 用户来说，空字段语义和列数不匹配容忍度是高频需求，预示 Databend 正在补齐更实用的数据落湖 / 入仓能力。

---

#### 6) Partitioned hash join 支持
- PR: [#19553](https://github.com/databendlabs/databend/pull/19553) `refactor(query): support partitioned hash join`

**意义：**
这是查询引擎层的重要路线图信号。partitioned hash join 往往与：
- 更好的大表 join 可扩展性
- 内存压力控制
- 并行执行能力增强

密切相关。虽然当前 PR 标为 refactor，但实质上是 **执行引擎能力升级** 的前置步骤。

---

#### 7) Fuse block format 抽象
- PR: [#19576](https://github.com/databendlabs/databend/pull/19576) `refactor(storage): extract fuse block format abstraction`

**意义：**
该改动统一 native/parquet 读取路径，引入共享 `ReadDataTransform`，属于存储读链路架构重构。  
如果落地顺利，后续会有利于：
- 降低格式分支复杂度
- 提升读路径可维护性
- 为更多 block format / 读取优化铺路

---

## 4. 社区热点

### 热点 1：INSERT 性能回归
- Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)  
  `[C-bug] bug: slower performance of INSERT with 1.2.881`
- 评论数：24（今日列表中最高）

**分析：**
这是当前最具“真实用户场景”特征的问题：用户从 `1.2.790` 升级到 `1.2.881-nightly` 后观察到 INSERT 变慢。  
与大量 panic 型 bug 不同，这类问题直接指向生产体验，涉及：
- ingest 吞吐
- nightly 升级信心
- 回归测试覆盖面

它说明项目当前不只是语义正确性问题，**性能回归治理** 也应成为 nightly 质量把关重点。

---

### 热点 2：GROUPING() 非法调用不应 panic
- Issue: [#19554](https://github.com/databendlabs/databend/issues/19554)
- PR: [#19592](https://github.com/databendlabs/databend/pull/19592), [#19594](https://github.com/databendlabs/databend/pull/19594)

**分析：**
该问题来自 DuckDB sqllogictest 迁移，说明 Databend 正在主动扩大 SQL 兼容性测试集。  
技术诉求很明确：**无效 SQL 应返回语义错误，而不是在 constant folding 阶段 panic**。这实际上是在完善 Databend 的错误分层模型：parser error / semantic error / runtime error 的边界需要更清晰。

---

### 热点 3：LIKE ... ESCAPE 边界条件集中爆出
- Issues:
  - [#19562](https://github.com/databendlabs/databend/issues/19562) `LIKE ... ESCAPE ''` panic
  - [#19563](https://github.com/databendlabs/databend/issues/19563) `LIKE ... ESCAPE ''''` parser reparse assertion panic
  - [#19561](https://github.com/databendlabs/databend/issues/19561) repeated `%` panic
- PRs:
  - [#19595](https://github.com/databendlabs/databend/pull/19595)
  - [#19596](https://github.com/databendlabs/databend/pull/19596)
  - [#19597](https://github.com/databendlabs/databend/pull/19597)
  - [#19590](https://github.com/databendlabs/databend/pull/19590)
  - [#19593](https://github.com/databendlabs/databend/pull/19593)

**分析：**
这是今天最密集的一组修复主题。背后暴露的问题包括：
- planner 类型检查对空 escape 字符串处理不完善
- Display / AST roundtrip 不安全
- LIKE 常量折叠逻辑对重复 `%` 假设过强

这表明 Databend 的 SQL 兼容性提升已进入 **边界条件和 roundtrip 稳定性** 阶段，属于成熟化过程中的必经工作。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高严重度：可导致进程崩溃或核心执行 panic

#### 1) 递归视图可导致 `databend-query` 崩溃
- Issue: [#19572](https://github.com/databendlabs/databend/issues/19572)
- Fix PR: [#19584](https://github.com/databendlabs/databend/pull/19584)（已关闭）

**状态：已修复闭环。**  
属于进程级崩溃问题，风险最高。

---

#### 2) Decorrelate optimizer 在 correlated subquery + UNION 上 panic
- Issue: [#19574](https://github.com/databendlabs/databend/issues/19574)

**状态：暂未看到对应 fix PR。**  
位置在 decorrelate/flatten_plan，说明是 **优化器对复杂相关子查询与集合操作组合处理不完整**。这类问题通常影响高级 SQL 支持，值得优先排查。

---

#### 3) IEJoin 空结果集越界
- Issue: [#19569](https://github.com/databendlabs/databend/issues/19569)

**状态：暂未看到 fix PR。**  
这是 range join / IEJoin 执行实现上的边界错误。空结果集都能触发 index out of bounds，说明执行器在某些“空路径”上保护不足。

---

#### 4) ASOF Join 在 UInt8 类型上 unwrap panic
- Issue: [#19570](https://github.com/databendlabs/databend/issues/19570)

**状态：暂未看到 fix PR。**  
虽然报错显示“不支持 Number(UInt8)”，但当前行为是 unwrap panic，而不是规范错误返回，属于 **功能限制被错误地实现成崩溃**。

---

### P1 / 中高严重度：查询错误、planner/parser panic、语义处理缺陷

#### 5) 非法 `GROUPING()` 调用在 constant folding 阶段 panic
- Issue: [#19554](https://github.com/databendlabs/databend/issues/19554)
- Fix PR:
  - [#19592](https://github.com/databendlabs/databend/pull/19592)
  - [#19594](https://github.com/databendlabs/databend/pull/19594)

**状态：已有修复候选。**  
重点是将 panic 改为 semantic error。

---

#### 6) `LIKE ... ESCAPE ''` planner panic
- Issue: [#19562](https://github.com/databendlabs/databend/issues/19562)
- Fix PR:
  - [#19595](https://github.com/databendlabs/databend/pull/19595)
  - [#19597](https://github.com/databendlabs/databend/pull/19597)

**状态：已有多条修复候选。**  
说明维护者对方案还在收敛，可能会择优合并。

---

#### 7) `LIKE ... ESCAPE ''''` 因 roundtrip/display 失真触发 parser assertion panic
- Issue: [#19563](https://github.com/databendlabs/databend/issues/19563)
- Fix PR:
  - [#19593](https://github.com/databendlabs/databend/pull/19593)
  - [#19596](https://github.com/databendlabs/databend/pull/19596)

**状态：已有修复候选。**  
本质是 SQL 序列化与反序列化的一致性问题。

---

#### 8) LIKE 常量折叠对重复 `%` panic
- Issue: [#19561](https://github.com/databendlabs/databend/issues/19561)
- Fix PR: [#19590](https://github.com/databendlabs/databend/pull/19590)

**状态：已有 fix PR。**  
属于明显的边界条件遗漏。

---

#### 9) UInt64 全范围列统计在 `Scan::derive_stats` 溢出
- Issue: [#19555](https://github.com/databendlabs/databend/issues/19555)
- Fix PR: [#19591](https://github.com/databendlabs/databend/pull/19591)

**状态：已有 fix PR。**  
这会影响 planner 统计推导与 NDV 估算，间接影响优化器行为。

---

#### 10) Result projection schema mismatch：Nullable(Int64) vs Int64
- Issue: [#19568](https://github.com/databendlabs/databend/issues/19568)

**状态：暂未看到 fix PR。**  
这是计划/执行阶段 schema 对齐问题，可能影响 join/left join 测试场景，属于查询正确性风险。

---

#### 11) SQL Parser 在 nested JOIN + multiple conditions 场景 panic
- Issue: [#19571](https://github.com/databendlabs/databend/issues/19571)

**状态：暂未看到 fix PR。**  
依然体现 parser/reparse assertion 机制在复杂 join 表达式上的脆弱性。

---

### P2 / 用户感知强的稳定性问题

#### 12) INSERT 性能回归
- Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)

**状态：未见对应修复 PR。**  
虽然不是崩溃，但对生产用户影响可能比单条 panic 更广，建议尽快定位回归提交范围。

---

## 6. 功能请求与路线图信号

### 1) TEXT/TSV 文件格式参数增强大概率进入下一版本
- PR: [#19588](https://github.com/databendlabs/databend/pull/19588)

这不是 issue 讨论，而是直接的 feature PR，说明需求已经比较明确。  
对数据导入用户而言，以下能力很实用：
- 空字段如何映射为 NULL / 默认值 / 字符串
- 列数不匹配是否容错

**判断：较有希望进入后续版本。**

---

### 2) Partitioned hash join 是重要执行引擎路线信号
- PR: [#19553](https://github.com/databendlabs/databend/pull/19553)

虽然以 refactor 命名，但方向非常关键。  
这通常意味着 Databend 正在向更大规模 join、更稳的内存管理演进。

**判断：中期重要路线，值得持续关注。**

---

### 3) Fuse block format 抽象将支撑更多存储优化
- PR: [#19576](https://github.com/databendlabs/databend/pull/19576)

这是平台化、架构化改造，不一定立刻带来用户可见功能，但会影响后续：
- 读性能优化
- 统一格式支持
- 存储维护成本

**判断：偏底层长期建设。**

---

### 4) 大量 SQL 兼容性修复说明测试体系正在升级
相关 Issues / PR：
- [#19554](https://github.com/databendlabs/databend/issues/19554), [#19592](https://github.com/databendlabs/databend/pull/19592)
- [#19561](https://github.com/databendlabs/databend/issues/19561), [#19590](https://github.com/databendlabs/databend/pull/19590)
- [#19562](https://github.com/databendlabs/databend/issues/19562), [#19597](https://github.com/databendlabs/databend/pull/19597)
- [#19563](https://github.com/databendlabs/databend/issues/19563), [#19596](https://github.com/databendlabs/databend/pull/19596)

**判断：**
短期路线图重心之一应是 **“减少 panic，提升 SQL 标准兼容与错误可预期性”**，尤其是 DuckDB 测试迁移持续推进后，这类工作还会继续出现。

---

## 7. 用户反馈摘要

### 1) 升级 nightly 后，用户首先感知的是写入性能
- Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)

真实用户反馈显示，相比 1.2.790，1.2.881-nightly 的 `INSERT` 变慢。  
这表明在 Databend 的实际使用中，除了查询能力外，**写入吞吐与版本回归稳定性** 仍是用户最敏感指标之一。

---

### 2) SQL 兼容性测试正暴露大量“应返回错误却变成 panic”的问题
- 代表 Issues:
  - [#19554](https://github.com/databendlabs/databend/issues/19554)
  - [#19561](https://github.com/databendlabs/databend/issues/19561)
  - [#19562](https://github.com/databendlabs/databend/issues/19562)
  - [#19563](https://github.com/databendlabs/databend/issues/19563)
  - [#19571](https://github.com/databendlabs/databend/issues/19571)

这反映出用户/贡献者对 Databend 的期待已不只是“能跑通主路径”，而是：
- 非法 SQL 要返回明确语义错误
- parser / planner / optimizer 不应因边界输入直接崩溃
- roundtrip / formatter / reparse 要更稳

---

### 3) 复杂 Join、子查询、视图场景是当前稳定性薄弱点
- 代表 Issues:
  - [#19569](https://github.com/databendlabs/databend/issues/19569)
  - [#19570](https://github.com/databendlabs/databend/issues/19570)
  - [#19572](https://github.com/databendlabs/databend/issues/19572)
  - [#19574](https://github.com/databendlabs/databend/issues/19574)
  - [#19568](https://github.com/databendlabs/databend/issues/19568)

这说明 Databend 在高级分析 SQL 能力上持续扩展的同时，**复杂计划形态的鲁棒性** 仍需加强。

---

## 8. 待处理积压

以下项目建议维护者重点关注：

### 1) INSERT 性能回归问题仍未闭环
- Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)

该问题创建已满一个月、评论活跃，但今日数据中尚未看到直接修复 PR。  
建议：
- 补充 benchmark 对比
- 标记 suspect commits
- 建立 nightly 性能回归门禁

---

### 2) Decorrelate optimizer panic 尚无修复线索
- Issue: [#19574](https://github.com/databendlabs/databend/issues/19574)

涉及 correlated subquery + UNION，属于高级 SQL 能力缺口。  
若不尽快处理，可能影响更多复杂 BI 生成 SQL。

---

### 3) Join 系列 panic 仍在积累
- Issues:
  - [#19569](https://github.com/databendlabs/databend/issues/19569)
  - [#19570](https://github.com/databendlabs/databend/issues/19570)
  - [#19571](https://github.com/databendlabs/databend/issues/19571)
  - [#19568](https://github.com/databendlabs/databend/issues/19568)

这些问题覆盖：
- IEJoin
- ASOF Join
- nested JOIN parser
- left join/nullability schema mismatch

建议维护者将其视作一个 **Join 稳定性专项**，而非逐条孤立修补。

---

## 总结判断

Databend 今日整体表现出两个鲜明特征：

1. **修复响应快**：多个 panic 类问题当天就出现对应 PR，体现出维护者对稳定性问题的高响应度。  
2. **nightly 稳定性仍承压**：大量 planner/parser/optimizer 边界问题说明项目正在快速扩展 SQL 能力，但错误处理与边界条件覆盖仍需加强。

从路线图看，近期重点大概率会落在三条线上：
- **SQL 兼容性与 panic 清零**
- **Join / 子查询 / 聚合等复杂查询能力补强**
- **存储读链路与 block format 架构优化**

如果你愿意，我还可以把这份日报进一步整理成：
1. **面向管理层的 1 页摘要版**，或  
2. **面向开发者的“风险追踪清单”版**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-24）

## 1. 今日速览

过去 24 小时内，Velox 社区保持了**较高活跃度**：Issues 更新 5 条，PR 更新 37 条，明显以 PR 推进为主，说明当前重点仍在代码落地和迭代收敛。  
从内容看，今日工作主要集中在 **cuDF/GPU 执行链路补齐**、**构建稳定性修复**、**Join/HashProbe 正确性保护** 以及 **Iceberg / Parquet / S3 等存储与连接层增强**。  
已合并/关闭的改动不多，但包含一个已快速修复的构建回归，体现出维护者对主干稳定性的响应较快。  
整体判断：**项目健康度良好，GPU 能力扩展是当前最明确的路线主线之一，构建与查询正确性也在同步加固。**

---

## 3. 项目进展

### 已合并 / 已关闭的重要 PR

#### 1) 修复 HiveCommitMessage 命名空间导致的构建失败
- **PR**: #16884 `fix(build): Use correct namespace for HiveCommitMessage`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16884

这是今日最直接影响主干稳定性的修复。问题源于前序 JSON 常量重构后，测试中引用的命名空间不一致，导致 `HiveCommitMessage` 未声明并触发编译失败。该修复与 Issue #16883 对应，属于**快速止血型 build fix**，说明维护者对 CI / 主干构建可用性较为敏感。  
推进意义：
- 保障 Hive/Iceberg 相关测试链路继续可用；
- 降低下游开发者在同步主干时遭遇构建阻塞的风险；
- 反映出近期存储元数据与 JSON 常量重构仍处于收敛期。

相关 Issue：
- **Issue**: #16883 `[build] Build break 'HiveCommitMessage' has not been declared`
- **链接**: facebookincubator/velox Issue #16883

---

#### 2) CentOS 9 构建环境兼容性修复完成
- **PR**: #16817 `fix(build): Register /usr/local/lib64 with ldconfig after gflags install on CentOS 9`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16817

该 PR 修复了 CentOS Stream 9 环境下 `gflags` 安装后动态库路径未被 `ldconfig` 正确识别的问题，避免下游构建工具如 `thrift1` 在运行时因 `libgflags.so.2.2` 缺失而失败。  
推进意义：
- 改善 Velox 在企业 Linux 发行版上的**可构建性和可移植性**；
- 对依赖 thrift / fbthrift 的用户环境更友好；
- 有助于减少“代码没问题但环境起不来”的集成成本。

---

### 今日值得关注、仍在推进中的关键 PR

#### 3) GPU Window 算子落地，补齐 cuDF 执行覆盖面
- **PR**: #16892 `feat(cudf): add GPU-accelerated Window operator`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16892

该 PR 引入 `CudfWindow`，使用 cuDF 的 `grouped_rolling_window` API 实现 GPU 版 Window 算子，同时修正 `CudfConversion` 输出类型处理与 `ToCudf` 报错信息。  
潜在价值：
- Window 是分析型 SQL 中高频且昂贵的算子之一；
- 若顺利合入，将显著减少 TPC-DS / BI 查询中的 CPU fallback；
- 对 Velox 作为 GPU 加速执行引擎的完整性意义较大。

---

#### 4) GPU Decimal 能力继续分阶段推进
- **PR**: #16750 `feat(cudf): GPU Decimal (Part 2 of 3)`
- **链接**: facebookincubator/velox PR #16750
- **PR**: #16751 `feat(cudf): GPU Decimal (Part 3 of 3)`
- **链接**: facebookincubator/velox PR #16751

Part 2 引入 Decimal 函数与相关整理，Part 3 增加 `SUM` / `AVG` 聚合支持。  
推进意义：
- Decimal 是 OLAP 和财务类场景的核心数据类型；
- 该系列一旦完成，Velox 在 GPU 上承载更真实的 Presto/Spark/BI 工作负载的能力将明显增强；
- 也意味着 GPU 路线正在从“可跑通”走向“覆盖主流 SQL 类型系统”。

---

#### 5) Iceberg Data Sink 新增 DWRF 支持
- **PR**: #16875 `feat: [velox][iceberg] Add DWRF file format support for Iceberg data sink`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16875

该 PR 为 Iceberg 数据 sink 的读写路径添加 DWRF 格式支持，并补充了插入/读取测试。  
推进意义：
- 扩展 Iceberg 与 Velox 自身生态（尤其 ORC/DWRF）之间的集成深度；
- 有助于 Meta/Presto 生态内部格式协同；
- 对 lakehouse 写路径能力是一次实质增强。

---

#### 6) Parquet 类型 widening 支持增强 schema evolution 兼容性
- **PR**: #16611 `feat(parquet): Add type widening support for INT and Decimal types with configurable narrowing`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16611

该改动面向 Spark 4.0 引入的 Parquet Type Widening 兼容需求，支持 `INT -> DOUBLE/Decimal` 和 `Decimal -> Decimal` widening，并提供可配置 narrowing。  
推进意义：
- 直接提升与 Spark 演进后数据湖表的互操作性；
- 缓解 schema evolution 导致的读取失败问题；
- 对 Velox 作为统一读取层/执行层的价值明显。

---

## 4. 社区热点

### 热点 1：cuDF 算子体系需要统一抽象
- **Issue**: #16885 `[enhancement] Unify cuDF operators with a common base class architecture`
- **链接**: facebookincubator/velox Issue #16885

这是今日讨论最有“架构味道”的新议题。当前 `CudfTopN`、`CudfLimit`、`CudfOrderBy` 等 GPU 算子都直接继承 `exec::Operator` 和 `NvtxHelper`，缺少统一基类。  
背后技术诉求：
- 降低各 GPU 算子重复实现生命周期/指标/错误处理逻辑的成本；
- 为后续新增 GPU 算子（Window、EnforceSingleRow、更多表达式函数）提供统一骨架；
- 从“单点功能补齐”转向“平台化开发 cuDF operator framework”。

这类问题往往是项目进入中后期、功能数量增长后的自然信号，说明 Velox-cuDF 正从试验性支持迈向体系化建设。

---

### 热点 2：Presto TPC-DS 的 GPU 覆盖率仍是路线图核心
- **Issue**: #15772 `[enhancement] [cuDF] Expand GPU operator support for Presto TPC-DS`
- **链接**: facebookincubator/velox Issue #15772

该长期跟踪 Issue 今日继续活跃，说明社区仍在以 **TPC-DS SF100 + 单 worker + cuDF backend** 作为 GPU 能力成熟度的重要验收基准。  
背后技术诉求：
- 减少 Driver Adapter 中因缺失算子而回退 CPU 的情况；
- 提升端到端 GPU 执行比例，而不是只优化少数 isolated operators；
- 建立可量化的覆盖率目标，以 benchmark 驱动功能优先级。

与其强关联的新增/在审工作包括：
- #16888：GPU 版 `EnforceSingleRow`
- #16892：GPU Window
- #16889：`date_diff`、`to_unixtime`
- #16357：TPC-DS benchmark with CuDF support

---

### 热点 3：本地开发环境中，IO 已开始成为 GPU benchmark 瓶颈
- **Issue**: #16890 `[enhancement, cudf] Add a mode to CudfTpchBenchmark where source data is in host memory`
- **链接**: facebookincubator/velox Issue #16890

这是一个非常有代表性的性能反馈：随着 cuDF 算子性能提升，`CudfTpchBenchmark` 从 table scan 开始的方式在本地开发机上开始受 IO 限制。  
背后技术诉求：
- benchmark 需要区分“算子性能”与“存储/扫描性能”；
- 希望增加 host memory 数据源模式，更准确评估 GPU 算子本身；
- 说明 GPU 路线已经进入“性能细分归因”阶段，而非仅仅关注功能可用性。

---

### 热点 4：长期 PR 继续推进 Join 核心路径优化
- **PR**: #13762 `feat: Optimize nested loop other join types with small build side`
- **链接**: facebookincubator/velox PR #13762

虽然是长期开放 PR，但今日仍有更新，且目标覆盖 inner、left、right、full outer、left semi 等多种 join 类型。  
背后技术诉求：
- 小 build side 场景下的 nested loop join 性能优化；
- 维护复杂 join 语义下 `ProbeMismatchRow`、build/probe row 状态正确性；
- 说明 Velox 仍在打磨非主流但关键边角 join 场景。

---

## 5. Bug 与稳定性

按严重程度排序：

### P1：主干构建失败 - `HiveCommitMessage` 未声明
- **Issue**: #16883 `[build] Build break 'HiveCommitMessage' has not been declared`
- **状态**: 已关闭
- **链接**: facebookincubator/velox Issue #16883
- **修复 PR**: #16884
- **链接**: facebookincubator/velox PR #16884

这是今日最明确的高优先级问题。其影响面在于**直接阻断编译**，属于典型主干回归。好消息是同日已完成修复，响应速度较快。

---

### P1：MergeJoin 在 full outer join + filter 组合下存在正确性缺陷
- **PR**: #16891 `fix: Skip MergeJoin for full outer join with filter in join fuzzer`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16891

问题描述非常关键：MergeJoin 在 `full outer join with filter` 场景下，若匹配到的右侧行过滤结果全部失败，可能**静默丢失右侧 miss rows**。这属于查询结果正确性问题，严重程度高于普通 crash。  
当前状态：
- 还不是根因修复，而是先在 join fuzzer 中跳过该组合，防止错误路径继续被纳入该计划形态；
- 表明维护者已识别风险，但完整修复尚未落地。

建议关注：这类问题若影响真实计划生成策略，应尽快补充执行器层面的真正 fix。

---

### P1：HashProbe 在 ANTI JOIN + probe-side key filter 下可能触发 debug-only crash
- **PR**: #16868 `fix: Skip filter evaluation in HashProbe when no rows are selected`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16868

该问题会在 `HashProbe::evalFilter` 中触发 `DictionaryVector::validate` 相关断言失败，属于 **debug-only correctness/stability 信号**。  
影响分析：
- 虽然不是 release 模式下普遍 crash，但暴露出 HashProbe filter 评估中的边界条件处理不严谨；
- 对 join 相关算子的健壮性是负面信号；
- 已有 fix PR，说明问题定位较清晰。

---

### P2：内存回收与 lazy loading 时机导致 probe 路径异常
- **PR**: #16774 `fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16774

该修复尝试把 lazy loading 前置，并在主循环前给 arbitrator 回收机会，目标是避免在不可回收段中发生内存压力异常。  
这反映出：
- Velox 在复杂 join/probe 路径上的内存管理仍在持续细化；
- 对大查询、高并发环境下的稳定性优化具有实际意义。

---

### P2：cuDF buffered input data source 在 hybrid scan reader 下的设备队列使用回归
- **PR**: #16732 `fix(cudf): Use enqueueForDevice for cudf buffered input data source`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16732

这是 GPU IO 路径的修复。重新启用 `enqueueForDevice`，说明此前在实验性的 hybrid scan reader 场景中设备调度/数据传输路径可能退化或行为不一致。  
影响：
- 不一定导致错误结果，但会影响 GPU 数据源路径的正确使用与性能可预期性；
- 对 cuDF 读路径稳定性值得继续观察。

---

## 6. 功能请求与路线图信号

### 1) GPU 算子覆盖补齐是当前最明确的短中期主线
相关条目：
- **Issue** #15772：Expand GPU operator support for Presto TPC-DS  
  链接: facebookincubator/velox Issue #15772
- **Issue** #16888：Add GPU support for EnforceSingleRow operator  
  链接: facebookincubator/velox Issue #16888
- **PR** #16892：GPU Window  
  链接: facebookincubator/velox PR #16892
- **PR** #16889：GPU `date_diff` / `to_unixtime`  
  链接: facebookincubator/velox PR #16889
- **PR** #16750 / #16751：GPU Decimal  
  链接: facebookincubator/velox PR #16750 / facebookincubator/velox PR #16751

判断：这些工作高度集中且相互关联，**极可能被纳入下一阶段版本的重点能力集**。尤其是 Window、Decimal、常用日期函数、单行语义算子，都是提升 TPC-DS 查询 GPU 覆盖率的关键拼图。

---

### 2) cuDF operator 基础设施抽象可能成为后续架构性改造
- **Issue**: #16885 `Unify cuDF operators with a common base class architecture`
- **链接**: facebookincubator/velox Issue #16885

这类需求不会立刻带来用户可见的新 SQL 功能，但会显著影响后续 GPU 特性的开发速度、代码一致性和维护成本。  
判断：若近期 GPU PR 持续增多，该议题很可能尽快演化为基础设施改造 PR。

---

### 3) Benchmark 体系正从“端到端”走向“分层可归因”
- **Issue**: #16890 `Add a mode to CudfTpchBenchmark where source data is in host memory`
- **链接**: facebookincubator/velox Issue #16890
- **PR**: #16357 `Add TPC-DS benchmark with reusable plan loader and CuDF support`
- **链接**: facebookincubator/velox PR #16357

判断：Benchmark 基础设施增强大概率会继续推进，因为它直接服务于 GPU 覆盖率提升与性能回归定位。

---

### 4) 存储与湖仓兼容性持续增强
相关条目：
- **PR** #16875：Iceberg Data Sink 支持 DWRF  
- **PR** #16611：Parquet Type Widening  
- **PR** #16879：S3 configs 增加 executor pool size

这些 PR 显示 Velox 不仅在做执行器，还在持续强化其作为**分析型存储访问层与 lakehouse 集成层**的能力。  
判断：Iceberg、Parquet schema evolution、S3 客户端调优，都是较容易进入后续版本的“实用增强型功能”。

---

## 7. 用户反馈摘要

### 1) GPU fallback 仍然是用户最核心痛点
来源：
- **Issue** #15772
- **Issue** #16888

用户在 Presto TPC-DS SF100、单 worker、启用 cuDF backend 且允许 CPU fallback 的场景下，明确观察到多个查询因缺失 GPU 算子回退到 CPU。  
这说明：
- 用户已不满足于“部分 GPU 加速”，而是希望提高**端到端 GPU 执行占比**；
- TPC-DS 仍是社区衡量 GPU 实用性的主要标尺；
- `EnforceSingleRow` 这种看似边缘的算子，实际在查询中出现频次并不低（Issue 中提到 26 次）。

---

### 2) 本地开发者开始遇到“GPU 算子快过 IO”的新瓶颈
来源：
- **Issue** #16890

反馈表明在本地开发环境中，table scan / IO 已成为 benchmark 限制项，影响对 GPU 算子真实性能的评估。  
这是一条积极信号：  
说明至少在部分路径上，计算本身的优化已经开始超过存储供给能力，社区对 benchmark 精度和可归因性的要求正在提高。

---

### 3) 构建稳定性对开发体验影响非常直接
来源：
- **Issue** #16883

一次命名空间问题就足以导致测试/构建失败，说明当前用户和贡献者对主干构建质量高度敏感。  
好处是维护响应快，但也提示：
- 最近涉及 JSON / Hive / Iceberg 的重构需要更强的 CI 覆盖；
- 存储层与元数据层改动容易引发编译级回归。

---

## 8. 待处理积压

### 1) 长期开放：VarcharN / VarbinaryN 类型支持
- **PR**: #10727 `feat(type): Add VarcharN and VarbinaryN type support`
- **创建时间**: 2024-08-12
- **状态**: Open
- **链接**: facebookincubator/velox PR #10727

这是明显的长期积压 PR。类型系统扩展通常影响函数签名、fuzzer、序列化、类型推导等多个层面，推进难度高。  
建议关注原因：
- 该能力涉及 SQL 类型兼容性与上层引擎对接；
- 长期悬而未决可能意味着范围过大，需要拆分交付。

---

### 2) 长期开放：nested loop 多 join 类型优化
- **PR**: #13762 `feat: Optimize nested loop other join types with small build side`
- **创建时间**: 2025-06-13
- **状态**: Open
- **链接**: facebookincubator/velox PR #13762

这是执行器核心路径优化，但长期未合入可能反映：
- 语义覆盖面过广，验证复杂；
- 正确性风险高于普通性能优化。  
建议维护者评估是否拆分为更小 PR，先落地风险更低的 join 类型。

---

### 3) GPU TPC-DS benchmark 基础设施仍待收敛
- **PR**: #16357 `feat(cudf): Add TPC-DS benchmark with reusable plan loader and CuDF support`
- **创建时间**: 2026-02-12
- **状态**: Open
- **链接**: facebookincubator/velox PR #16357

该 PR 对后续大量 GPU 能力验证都很关键。如果继续拖延，会影响：
- TPC-DS 回归评估效率；
- cuDF operator 优先级排序；
- benchmark 结果的一致性与复现性。

---

## 总结

今日 Velox 的核心信号很清晰：**GPU/cuDF 正在进入“功能覆盖 + 架构抽象 + benchmark 精细化”的新阶段**。同时，项目并未忽略主干稳定性，构建回归在当天即被修复，Join/HashProbe 正确性问题也已通过 PR 暂时隔离或修补。  
从版本走向看，下一阶段最值得期待的是：**GPU Window、GPU Decimal、更多日期时间函数、EnforceSingleRow 等算子补齐，以及 Iceberg/Parquet/S3 侧的实用兼容增强**。整体上，Velox 仍保持较强推进节奏，但也需要警惕长期开放 PR 和执行器边界条件 bug 的积压风险。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报 - 2026-03-24

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：Issues 更新 11 条、PR 更新 14 条，说明社区仍在持续推进 Spark 4.x 适配、Velox 能力补齐以及测试稳定性治理。  
从关闭/合并比例看，Issue 关闭 7 条、PR 合并或关闭 4 条，项目在“清理存量问题 + 推进增量特性”两条线上同时前进。  
今日没有新版本发布，但从活跃 PR 内容判断，当前开发重点集中在 **Velox SQL 类型兼容、动态过滤链路、测试修复、配置清理与执行层优化**。  
整体健康度较好：既有 roadmap/历史 enhancement 收尾，也有针对 Spark 4.x 和 Velox backend 的持续工程化推进。

---

## 2. 项目进展

以下为今日值得关注的已合并/关闭 PR 与对应推进方向：

### 2.1 Hive 扫描路径性能优化已落地
- **PR #11798** `[CORE] Improve the performance of getDistinctPartitionReadFileFormats for HiveTableScanExecTransformer`  
  链接: apache/gluten PR #11798  
- 对应 Issue: **#11797**  
  链接: apache/gluten Issue #11797  

**进展解读：**
该优化聚焦 `HiveTableScanExecTransformer` 中 `getDistinctPartitionReadFileFormats` 的性能问题，解决了：
- 对每个 partition 重复执行昂贵的 `HiveClientImpl.fromHivePartition()`
- 存在多次遍历
- 缺少缓存导致重复格式转换

这类改动虽不直接增加 SQL 功能，但会改善 **Hive 分区表扫描的 planning/metadata 处理效率**，对大量分区场景下的分析作业更有价值，属于典型的存储读取路径优化。

---

### 2.2 Spark 4.x 测试体系修正持续推进
- **PR #11800** `[CORE, BUILD] Replace GlutenTestsCommonTrait with correct Gluten test traits for Spark 4.0/4.1`  
  链接: apache/gluten PR #11800  
- **PR #11812** `[CORE] Enable GlutenMergeIntoDataFrameSuite and GlutenSparkSessionJobTaggingAndCancellationSuite`  
  链接: apache/gluten PR #11812  
- 对应跟踪 Issue: **#11550** `Spark 4.x: Tracking disabled test suites`  
  链接: apache/gluten Issue #11550  

**进展解读：**
这是今天最重要的一组稳定性进展。  
PR #11800 指出此前部分测试错误地使用了 `GlutenTestsCommonTrait`，**实际上并未加载 GlutenPlugin，也未创建启用 Gluten 的 SparkSession**，导致测试在 vanilla Spark 上通过，却被误认为“已 offload 到 Gluten”。这属于典型的测试假阳性风险。  
随后 PR #11812 重新启用了两个实际可通过的测试套件，说明 Spark 4.0/4.1 兼容性验证正在恢复真实可信状态。

**影响：**
- 提升 Spark 4.x 兼容性验证的可信度
- 降低“误判支持/误判回归”的风险
- 为后续更多 disabled suites 的恢复铺路

---

### 2.3 动态过滤下推链路出现阶段性收敛
- **PR #11657** `[VL] Push dynamic filters down to ValueStream`  
  链接: apache/gluten PR #11657  
- 相关开放 PR: **#11769** `[VL] Write per-block column statistics in shuffle writer`  
  链接: apache/gluten PR #11769  

**进展解读：**
虽然 #11657 今日状态为关闭，但其技术方向非常关键：将 `HashProbe` 生成的 dynamic filter 继续向上游 `ValueStreamDataSource` / shuffle reader 传播，以减少 materialized 数据量。  
配套 PR #11769 正在补齐 **shuffle writer 写出 per-block column statistics（min/max/hasNull）** 的能力，这是实现 block-level pruning 的必要基础设施。

**判断：**
这表明 Gluten 在 Velox 路径上，正尝试把 **动态过滤从算子级优化延展到 shuffle 数据读取层**，一旦链路闭环，将直接改善 join-heavy 查询的网络与反序列化开销。

---

## 3. 社区热点

### 3.1 2025 Roadmap 收尾关闭，路线讨论热度最高
- **Issue #8226** `[enhancement] Gluten 2025 Roadmap`  
  作者: @FelixYBW  
  评论: 22 | 👍: 34  
  链接: apache/gluten Issue #8226  

**热点分析：**
这是今日互动最强的 Issue。虽然它在过去 24 小时被关闭，但从评论数和点赞数看，仍是社区路线共识的重要载体。  
背后的技术诉求主要是：
- **Spark 4.0 支持**
- **Velox backend 能力完善**
- 更完整的算子/函数覆盖
- 工程稳定性与性能路线同步推进

该 Issue 的关闭更像是阶段性归档，而不是路线降温；结合今日大量 Spark 4.x 和 Velox PR，可视作 roadmap 正在转化为具体交付。

---

### 3.2 Velox 上游 PR 跟踪需求持续存在
- **Issue #11585** `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`  
  评论: 16 | 👍: 4  
  链接: apache/gluten Issue #11585  

**热点分析：**
这是目前最值得关注的开放讨论之一。  
核心信号是：Gluten 社区在 Velox 上有不少“有用但未被 upstream 合并”的改动，且维护者明确提到因为 rebase 成本，没有全部 pick 进 `gluten/velox`。  

**背后技术诉求：**
- 减少下游自维护 patch 的负担
- 缩短 Gluten 与 Velox 主干的能力差距
- 在性能/功能增强与可维护性之间做权衡

这反映出 Gluten 当前生态依赖的一个现实：**Velox 上游协同效率，正成为 Gluten 功能落地节奏的重要约束。**

---

### 3.3 TIMESTAMP_NTZ 支持成为明确的兼容性热点
- **Issue #11622** `[enhancement, good first issue] [VL] Support TIMESTAMP_NTZ Type`  
  评论: 6 | 👍: 2  
  链接: apache/gluten Issue #11622  
- 对应 PR: **#11626** `[VL] Add basic TIMESTAMP_NTZ type support`  
  链接: apache/gluten PR #11626  

**热点分析：**
该议题聚焦 Spark 与 Presto/Velox 在 timestamp 类型语义上的差异，属于 **SQL 类型系统兼容性** 问题，而非简单的类型映射。  
这类问题往往影响：
- 表达式求值正确性
- 跨引擎读写一致性
- 数据湖格式中的时间列语义

从 issue 到 PR 已形成联动，说明该需求具有较高进入下一版本的可能性。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1 - Spark 4.x 测试存在“假启用 Gluten”风险，已部分修复
- **Issue #11550** `Spark 4.x: Tracking disabled test suites`  
  链接: apache/gluten Issue #11550  
- 已关闭修复 PR: **#11800**, **#11812**  
  链接: apache/gluten PR #11800  
  链接: apache/gluten PR #11812  
- 后续增强 PR: **#11805** `Add golden file comparison for PlanStability test suites`  
  链接: apache/gluten PR #11805  

**问题描述：**
部分测试套件实际未加载 GlutenPlugin，却被当作 Gluten 路径测试，存在结果误导。  

**当前状态：**
已有修复，且正在补充 golden file 比对，防止未来出现 plan regression。

---

### P1 - Velox BHJ 导致栈溢出问题已关闭
- **Issue #9671** `[bug, triage] [VL] BHJ caused stackoverflow`  
  链接: apache/gluten Issue #9671  

**问题描述：**
Broadcast Hash Join 相关流程曾触发 stackoverflow，并伴随 broadcast store fail 等日志。  
这类问题属于执行层严重稳定性问题，可能直接导致作业失败。

**当前状态：**
Issue 已关闭，但当前数据中未直接给出对应 fix PR，建议持续追溯关联提交，确认修复是否已进入稳定分支。

---

### P2 - 无效/误导性配置项暴露，已有修复 PR
- **Issue #11809** `Remove unused/misleading config: spark.gluten.velox.fs.s3a.connect.timeout`  
  链接: apache/gluten Issue #11809  
- Fix PR: **#11810**  
  链接: apache/gluten PR #11810  

**问题描述：**
配置项 `spark.gluten.velox.fs.s3a.connect.timeout` 仍存在于配置定义中，但实际生效的是 Hadoop S3A 配置 `spark.hadoop.fs.s3a.connection.timeout`。  

**影响：**
- 容易让用户误以为 Gluten 自身配置可控制 S3 连接超时
- 产生排障偏差和配置误用

**当前状态：**
已有 PR 删除 dead config，属于文档/配置一致性修复。

---

### P2 - Stage 级资源管理问题归档关闭，但问题本身仍具现实意义
- **Issue #4392** `Stage level resource management to handle offheap/onheap memory conflict`  
  链接: apache/gluten Issue #4392  

**问题描述：**
当查询中既有 native operator 又有 fallback 到 vanilla Spark 的 operator 时，存在 offheap/onheap 内存冲突。  

**分析：**
这是 Gluten 混合执行模型的典型痛点，尤其在部分 SQL 无法完全 native 化的情况下更明显。  
Issue 虽关闭，但并不代表此类资源协调难题已完全消失；更多像是历史方案或路线调整后的归档。

---

### P3 - Delta Lake 写路径仍存在回退与冗余转换问题，相关 Issue 已关闭
- **Issue #11503** `[VL] deltalake partitioned write still hass a C2R converter`  
  链接: apache/gluten Issue #11503  
- **Issue #11471** `[VL] Liquid cluster deltawrite has a fallbacked project`  
  链接: apache/gluten Issue #11471  

**问题描述：**
集中指向 Delta Lake 分区写入与 liquid clustering 写路径中的 fallback / C2R 转换残留问题。  

**影响：**
- 降低原生写入链路完整性
- 影响端到端性能收益
- 可能导致用户误判“已原生加速”

**当前状态：**
Issues 已关闭，但建议关注后续 benchmark 结果与写路径 explain plan 验证。

---

## 5. 功能请求与路线图信号

### 5.1 TIMESTAMP_NTZ 支持大概率进入下一阶段交付
- **Issue #11622**  
  链接: apache/gluten Issue #11622  
- **PR #11626**  
  链接: apache/gluten PR #11626  

**判断：高概率纳入近期版本**
原因：
- 已有明确 issue 与在审 PR
- 涉及 Spark 语义兼容的基础类型能力
- 对数据湖/SQL 兼容性价值高

---

### 5.2 approx_percentile 聚合支持具备较强产品价值，但实现复杂
- **PR #11651** `[VL] feat: Support approx_percentile aggregate function`  
  链接: apache/gluten PR #11651  

**判断：中高概率，但需要更严谨验证**
该 PR 的关键难点在于：
- Velox 使用 **KLL sketch**
- Spark 使用 **GK algorithm**
- 中间态格式不兼容，fallback 时存在状态转换问题

这意味着它不是“加个函数映射”就能完成，而涉及 **聚合中间态兼容、partial/final aggregation 正确性、fallback 边界**。  
若通过，属于 SQL 聚合能力的重要增强。

---

### 5.3 动态过滤向 shuffle/value stream 延展是明确路线
- **PR #11769**  
  链接: apache/gluten PR #11769  
- 相关关闭 PR: **#11657**  
  链接: apache/gluten PR #11657  

**判断：高价值方向，可能拆分多 PR 进入**
该方向目标清晰：利用 block 级统计信息支撑更细粒度的数据裁剪。  
若后续完成，将显著提升：
- 大表 join 的扫描效率
- shuffle 读取效率
- query stage 的数据跳过能力

---

### 5.4 executeCollect 原生实现补齐执行语义
- **PR #11802** `[VL] Implement the executeCollect() method in ColumnarCollectLimitExec`  
  链接: apache/gluten PR #11802  

**判断：中概率进入近期版本**
这类改动通常影响：
- collect/limit 类 driver-side 收集场景
- 某些交互式分析与单元测试语义
- 原生执行与 Spark 行为一致性

属于执行引擎 completeness 的补洞型需求。

---

### 5.5 S3A 配置清理体现“运维可用性”方向
- **Issue #11809**  
  链接: apache/gluten Issue #11809  
- **PR #11810**  
  链接: apache/gluten PR #11810  

**判断：很可能近期合入**
虽然不是大功能，但能减少用户配置困惑，提升云存储场景的可运维性。

---

## 6. 用户反馈摘要

结合今日 Issues/PR 内容，可以提炼出以下真实用户痛点：

### 6.1 用户最关心的是“Spark 4.x 真的可用吗”
- 相关: **#11550, #11800, #11812, #11805**
- 链接: apache/gluten Issue #11550 / PR #11800 / PR #11812 / PR #11805

**反馈信号：**
用户不仅关心功能“号称支持”，更关心测试是否真实在 Gluten 路径执行。  
这说明社区已经从“能跑”转向“验证可信、行为可回归”的阶段。

---

### 6.2 时间类型与跨引擎语义差异是实际落地阻碍
- 相关: **#11622, #11626**
- 链接: apache/gluten Issue #11622 / PR #11626

**反馈信号：**
TIMESTAMP_NTZ 问题说明用户在 Spark + Velox + 数据湖场景里，已经开始深入遇到 **类型语义不一致** 的实战障碍，而不是停留在算子覆盖率层面。

---

### 6.3 用户对 fallback 残留非常敏感
- 相关: **#11471, #11503, #4392**
- 链接: apache/gluten Issue #11471 / #11503 / #4392

**反馈信号：**
用户越来越关注：
- 查询计划中是否仍有 fallback project
- 写路径是否仍有 C2R converter
- mixed execution 下内存是否冲突

这表明 Gluten 用户对“原生化纯度”和“端到端收益兑现”有更高要求。

---

### 6.4 云存储配置可解释性仍是运维痛点
- 相关: **#11809, #11810**
- 链接: apache/gluten Issue #11809 / PR #11810

**反馈信号：**
配置项存在但不生效，比缺配置更糟糕。  
用户需要的是：**配置语义明确、文档与实现一致、排障路径简单**。

---

## 7. 待处理积压

以下是建议维护者继续重点关注的开放事项：

### 7.1 Velox 上游未合并 PR 跟踪
- **Issue #11585**  
  链接: apache/gluten Issue #11585  

**关注原因：**
这是当前 Velox 协同风险的集中体现。若长期积压，会持续提高 Gluten 私有 patch 维护成本，并拖慢功能集成节奏。

---

### 7.2 TIMESTAMP_NTZ 支持 PR 待推进
- **Issue #11622**  
  链接: apache/gluten Issue #11622  
- **PR #11626**  
  链接: apache/gluten PR #11626  

**关注原因：**
属于基础 SQL 类型能力，影响面广。建议优先补齐语义说明、测试覆盖及与 Spark 行为的一致性证明。

---

### 7.3 approx_percentile 支持仍在审查
- **PR #11651**  
  链接: apache/gluten PR #11651  

**关注原因：**
该功能用户价值高，但算法与中间态兼容复杂，若长期停滞，容易形成“函数支持表面存在、实际边界不清”的风险。

---

### 7.4 PlanStability golden file 机制尚未完成
- **PR #11805**  
  链接: apache/gluten PR #11805  

**关注原因：**
这是防止 Spark 4.x 计划回归的关键测试基础设施，建议优先推进，以支撑后续更多 suite 重新启用。

---

### 7.5 executeCollect() 能力补齐仍待合入
- **PR #11802**  
  链接: apache/gluten PR #11802  

**关注原因：**
涉及原生执行语义完整性，对 collect/limit 类场景和部分测试稳定性有直接帮助。

---

## 总结

今日 Apache Gluten 的核心主题可以概括为三点：

1. **Spark 4.x 兼容性验证正在从“能测”走向“测得准”**  
2. **Velox 方向继续补齐类型系统、执行语义和动态过滤链路**  
3. **社区已明显转向更深层次的正确性、性能纯度和运维可用性问题**

虽然没有版本发布，但从今日问题关闭与 PR 活跃度看，项目处于较健康的工程推进周期。后续最值得跟踪的是：**TIMESTAMP_NTZ、approx_percentile、dynamic filter + shuffle pruning、Spark 4.x 测试恢复** 这四条主线。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-24）

## 1. 今日速览

过去 24 小时，Apache Arrow 保持较高活跃度：Issues 更新 23 条、PR 更新 28 条，但**无新版本发布**。  
从变更结构看，今日工作重点明显集中在 **C++ / FlightRPC / ODBC 跨平台支持**、**CI 与构建稳定性修复**，同时 R 与 Python 生态也有持续推进。  
关闭的 Issues 达 11 条，说明维护者在**清理历史积压与处理 stale 项**上动作较多；另一方面，待合并 PR 仍有 21 条，显示当前开发队列依然繁忙。  
整体健康度评价为：**活跃且偏向工程收敛阶段**，即近期更多在补齐平台兼容性、测试基础设施和接口细节，而非发布大版本功能。

---

## 2. 项目进展

### 今日已关闭 / 已推进的重要 PR

#### 2.1 修复 macOS + xsimd 14.1.0 构建失败
- PR: #49580 `[C++] Fix xsimd 14.1.0 build failure`
- 状态: **已关闭**
- 链接: https://github.com/apache/arrow/pull/49580

这是今天最明确的**构建稳定性修复**之一，对 C++ 核心库在 macOS 上跟随上游 SIMD 库升级非常关键。  
问题源于 xsimd 14.1.0 内部实现变化，导致 Arrow 先前的兼容处理失效。该修复有助于恢复 Arrow 在新依赖版本上的可编译性，减少开发者与 CI 环境因三方库升级带来的中断。

对应 Issue：
- #49579 `[C++] Build failure with xsimd 14.1.0 on macOS`
- 链接: https://github.com/apache/arrow/issues/49579

**影响分析**：  
这类问题虽不直接改变查询语义，但会影响 Arrow 作为分析引擎底层库在本地开发、CI/CD、打包分发链路中的稳定性，是典型的“平台可用性阻塞项”。

---

#### 2.2 修复 Parquet 几何解析中的深递归栈溢出风险
- PR: #49558 `[C++][Parquet] Fix uncontrolled recursion in WKBGeometryBounder::MergeGeometryInternal`
- 状态: **已关闭**
- 链接: https://github.com/apache/arrow/pull/49558

对应 Issue：
- #49559 `[C++][Parquet] MergeGeometryInternal may stack overflow from deeply nested WKB GeometryCollection inputs`
- 链接: https://github.com/apache/arrow/issues/49559

该修复为 `MergeGeometryInternal` 增加递归深度上限（摘要中为 128），用于防止**深层嵌套 WKB GeometryCollection 输入**触发栈溢出。  

**意义**：
- 属于典型的**输入鲁棒性 / 安全性增强**
- 对处理 GeoParquet 或空间数据链路的用户尤其重要
- 可避免异常输入导致的进程崩溃或不可控资源消耗

从 OLAP / 分析型存储视角看，这种修复提升了 Parquet 在复杂地理数据场景下的**解析稳定性与边界防护能力**。

---

#### 2.3 修复 Apple clang / macOS 14 编译兼容性
- PR: #49570 `[CI][Python][C++] Add check targetting Apple clang on deciding whether to use std::bit_width or std::log2p1`
- 状态: **已关闭**
- 链接: https://github.com/apache/arrow/pull/49570

对应 Issue：
- #49569 `[CI][Python][C++] macos 14 fails with missing std::log2p1`
- 链接: https://github.com/apache/arrow/issues/49569

该问题影响 Python + C++ 构建链路，属于**平台编译器兼容性回归**。  
虽然是 CI 级问题，但 Arrow 作为跨语言列式内存基础设施，其工具链兼容性直接决定生态开发效率。今天该问题已快速闭环，表明维护者对主流平台回归具备较强响应能力。

---

#### 2.4 Flight SQL / ODBC 测试代码清理完成
- PR: #49562 `[C++][FlightRPC][ODBC] Use SQLWCHAR array for wide string literals in test suite`
- 状态: **已关闭**
- 链接: https://github.com/apache/arrow/pull/49562

对应 Issue：
- #49561 `[C++][FlightRPC] Use SQLWCHAR array for wide string literals in test suite`
- 链接: https://github.com/apache/arrow/issues/49561

这是一个相对小型但信号明确的改进：说明 **Flight SQL ODBC 驱动方向正在持续细化测试与兼容性细节**。  
虽然不直接影响用户查询功能，但有助于提升 ODBC 驱动在宽字符 / Unicode 相关路径上的测试质量，对企业 BI / JDBC-ODBC 互通场景有正向意义。

---

## 3. 社区热点

以下为今日最值得关注的活跃议题与 PR。

### 3.1 R 生态新增 Azure Blob Filesystem 支持
- PR: #49553 `[R] Expose azure blob filesystem`
- 状态: OPEN
- 链接: https://github.com/apache/arrow/pull/49553

这是今天最具“用户面”价值的功能推进之一。Arrow C++ 和 PyArrow 已具备 Azure 支持，而 R 包此前在云对象存储支持上相对 AWS/GCS 更完整、Azure 较弱。该 PR 的意义在于：
- 补齐 R 生态云存储能力矩阵
- 提升 Arrow 在数据湖分析中的跨云一致性
- 降低 R 用户直接访问 Azure Blob 上 Parquet / Dataset 的门槛

**技术诉求分析**：  
这反映出用户希望 Arrow 不只是内存格式库，而是能作为**统一多云数据访问层**。对 OLAP 引擎、Lakehouse、远程 Dataset 扫描都非常关键。

---

### 3.2 Flight SQL ODBC 跨平台支持进入集中冲刺
相关 PR / Issue：
- PR #49564 `[C++][FlightRPC] Add Ubuntu ODBC Support`  
  https://github.com/apache/arrow/pull/49564
- PR #49583 `[C++][FlightRPC] Add ODBC Debian support`  
  https://github.com/apache/arrow/pull/49583
- PR #49575 `[C++][FlightRPC][ODBC] Remove libunwind dynamic linked library in macOS Intel CI`  
  https://github.com/apache/arrow/pull/49575
- PR #49585 `DRAFT: set up static build of ODBC FlightSQL driver`  
  https://github.com/apache/arrow/pull/49585
- 长期 PR #46099 `[C++] Arrow Flight SQL ODBC layer`  
  https://github.com/apache/arrow/pull/46099
- Issue #49582 `[C++][FlightRPC][ODBC] Enable ODBC build on Debian`  
  https://github.com/apache/arrow/issues/49582
- 新 Issue #49584 `[Java][FlightRPC] Flight SQL JDBC driver does not expose per-batch app_metadata from FlightStream`  
  https://github.com/apache/arrow/issues/49584

**热点判断**：今天最热的主线就是 **Flight SQL 驱动与 ODBC/JDBC 可用性补齐**。  

**背后技术诉求**：
1. 让 Flight SQL 从“协议能力”走向“企业可接入能力”
2. 支持更多 Linux 发行版（Ubuntu / Debian）
3. 解决 macOS Intel CI 与动态链接问题
4. 完善 JDBC / ODBC 对流式 metadata 的暴露能力，满足更丰富的 SQL 客户端行为

这说明 Arrow 社区正在强化其作为**高性能数据传输层 + SQL 接入层**的定位，而不仅仅是列式内存交换格式。

---

### 3.3 Python Decimal 计算正确性问题持续存在
- Issue: #43252 `[Python] Error thrown when multiplying decimal numbers`
- 状态: OPEN
- 链接: https://github.com/apache/arrow/issues/43252

这是今日更新中最值得关注的**计算正确性类老问题**之一。  
Decimal 是分析数据库、财务报表、精确聚合场景的关键类型；任何乘法异常都会影响 SQL 计算可信度。该问题至今未关闭，表明其修复可能涉及：
- decimal 内部表示与缩放规则
- compute kernel 的类型提升 / 溢出策略
- Python API 与 C++ compute 内核的一致性

**技术诉求**：用户需要 Arrow 在 Decimal 上具备与数据库引擎一致的可预测行为，这对 OLAP 场景尤其敏感。

---

### 3.4 Python Feather Reader/Writer 弃用信号增强
- Issue: #49232 `[Python] Deprecate Feather reader and writer`
- 状态: OPEN
- 链接: https://github.com/apache/arrow/issues/49232

这是一个明显的**路线图信号**。  
Feather 作为早期轻量格式，在功能定位上越来越被 IPC / Parquet / Dataset 能力吸收。该 Issue 的活跃更新说明 PyArrow 可能继续收敛旧接口，推动用户迁移到更现代、统一的 IO 抽象。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1：Parquet 几何解析可能导致栈溢出
- Issue: #49559  
  https://github.com/apache/arrow/issues/49559
- Fix PR: #49558  
  https://github.com/apache/arrow/pull/49558
- 状态: **已修复并关闭**

**严重性**：高  
原因是它可能导致崩溃，且由输入触发。对于处理地理空间数据的服务端场景，属于需要尽快修补的问题。

---

### P1：Python CUDA 夜构失败，疑似上下文对象 API 变化
- Issue: #49437 `[Python][C++][GPU] Python Cuda jobs fail with 'cuda.bindings.driver.CUcontext' object has no attribute 'value'`
- 链接: https://github.com/apache/arrow/issues/49437
- 状态: OPEN
- 已知 fix PR: **未在本批数据中看到明确对应修复 PR**

**严重性**：高  
这表明 Arrow 的 Python GPU / CUDA 适配层可能受上游 `cuda.bindings` API 变化影响，导致 nightly CI 失败。  
对 GPU 数据处理、零拷贝设备内存交换、GPU 加速分析链路有直接影响。

---

### P1：Python Decimal 乘法报错
- Issue: #43252
- 链接: https://github.com/apache/arrow/issues/43252
- 状态: OPEN
- 已知 fix PR: **暂无**

**严重性**：高  
属于数值计算正确性问题，尤其影响金融、计费、精确统计等场景。

---

### P2：macOS + xsimd 14.1.0 构建失败
- Issue: #49579  
  https://github.com/apache/arrow/issues/49579
- Fix PR: #49580  
  https://github.com/apache/arrow/pull/49580
- 状态: **已修复**

**严重性**：中高  
影响开发与 CI 编译，不直接影响运行期语义，但会阻断新环境构建。

---

### P2：macOS 14 / Apple clang 缺失 `std::log2p1`
- Issue: #49569  
  https://github.com/apache/arrow/issues/49569
- Fix PR: #49570  
  https://github.com/apache/arrow/pull/49570
- 状态: **已修复**

**严重性**：中  
属于平台工具链兼容性回归，已快速闭环。

---

### P2：R gcc sanitizer failure
- PR: #49581 `[CI][R] gcc sanitizer failure`
- 链接: https://github.com/apache/arrow/pull/49581
- 状态: OPEN

这是一个**CI 稳定性问题的修复 PR**，目前看是通过跳过特定测试来解除 crossbow 失败。  
短期有利于恢复 CI 健康，但从工程视角看，后续仍需追踪上游根因。

---

## 5. 功能请求与路线图信号

### 5.1 Flight SQL ODBC 正在从 Windows 扩展到 Linux 发行版
相关条目：
- PR #46099  
  https://github.com/apache/arrow/pull/46099
- PR #49564  
  https://github.com/apache/arrow/pull/49564
- PR #49583  
  https://github.com/apache/arrow/pull/49583
- PR #49585  
  https://github.com/apache/arrow/pull/49585
- Issue #49582  
  https://github.com/apache/arrow/issues/49582

**判断**：极可能纳入下一阶段版本迭代重点。  
理由：
- 同一主题出现多条配套 PR
- 包含 Ubuntu / Debian / macOS CI / static build 等完整工程项
- 说明已从原型进入落地阶段

**意义**：  
这将显著增强 Arrow Flight SQL 作为 SQL 接入协议的落地能力，利好 BI 工具、ODBC 客户端、数据网关和跨语言查询引擎集成。

---

### 5.2 R 端 Azure Blob 支持接近实用化
- PR #49553  
  https://github.com/apache/arrow/pull/49553

**判断**：较大概率进入后续版本。  
这是成熟 C++ 能力向 R 包装层的暴露，技术风险相对可控，且具明确用户价值。

---

### 5.3 Parquet Writer 可观测性增强
- PR #49527 `[C++][Parquet] Add estimated_buffered_stats() API for RowGroupWriter`
- 链接: https://github.com/apache/arrow/pull/49527
- 状态: OPEN

这是一个对分析型存储很有价值的增强。  
`estimated_buffered_stats()` 能帮助用户在写入 Parquet 时估算当前 row group 的缓冲数据量，从而更精细地控制：
- row group 切分
- 内存占用
- 刷盘时机
- 写入吞吐和扫描效率之间的平衡

**判断**：这是面向存储优化的高价值 API，值得持续关注。

---

### 5.4 排名 / 排序语义修正
- PR #49304 `[C++][Compute] Treat NaNs and nulls as distinct values in rank tie-breaking`
- 链接: https://github.com/apache/arrow/pull/49304

该 PR 触及 Arrow Compute 的**查询语义一致性**。  
如果合入，将改善 rank kernel 对 NaN / null 的处理，使其更贴近 Arrow 排序约定。这对 SQL 窗口函数、分析排名逻辑、与数据库行为对齐都有价值。

---

### 5.5 历史需求仍显示用户希望 Arrow 更像“分析框架”
一些老 Issue 虽被 stale 触达，但仍透露长期路线诉求：
- #31528 `[C++] Reduce memory usage when writing to IPC`  
  https://github.com/apache/arrow/issues/31528
- #31525 `[C++] ScannerBuilder::Filter returns an error when given an augmented field`  
  https://github.com/apache/arrow/issues/31525
- #31522 `[C++] Allow reordering fields of a StructArray via casting`  
  https://github.com/apache/arrow/issues/31522
- #30950 `[Python] Possibility of a table.drop_duplicates() function?`  
  https://github.com/apache/arrow/issues/30950

这些问题指向三个持续主题：
1. **内存效率**
2. **Dataset / Scanner 表达能力**
3. **更完整的数据帧 / SQL 风格 API**

---

## 6. 用户反馈摘要

### 6.1 用户希望 Arrow 提供更完整的表操作语义
- 代表 Issue: #30950  
  https://github.com/apache/arrow/issues/30950

虽然该 Issue 今日被关闭为 stale，但其需求非常典型：用户期待 `table.drop_duplicates()` 这样的 DataFrame 式能力。  
这说明 Arrow 在 Python 侧虽具备 compute / group_by / sort_by 等基础能力，但用户仍希望上层 API 更贴近 pandas / SQL 的日常操作范式。

---

### 6.2 用户关注 Decimal 精确计算的可靠性
- 代表 Issue: #43252  
  https://github.com/apache/arrow/issues/43252

这反映出真实生产场景中，Arrow 不仅被用于列式传输，也被直接用于数值计算。  
一旦 Decimal 运算行为不稳定，用户对其在财务、风控、报表场景中的信任会下降。

---

### 6.3 用户需要多云对象存储的统一访问体验
- 代表 PR: #49553  
  https://github.com/apache/arrow/pull/49553

R 用户已具备 AWS / GCS 支持，对 Azure 的补齐呼声说明 Arrow 正在成为跨云分析工作流中的基础工具。  
这类需求通常来自真实的数据湖接入场景，而非单纯本地文件处理。

---

### 6.4 企业接入场景要求更强 SQL 驱动兼容性
- 代表 Issue: #49584  
  https://github.com/apache/arrow/issues/49584
- 代表 PR: #46099  
  https://github.com/apache/arrow/pull/46099

JDBC 驱动未暴露 per-batch `app_metadata` 的问题，表明用户正在尝试将 Flight SQL 用于更复杂的结果流消费与协议扩展场景。  
这不是“能连上就行”的阶段，而是“需要驱动充分暴露协议能力”的阶段。

---

## 7. 待处理积压

以下问题 / PR 建议维护者重点关注。

### 7.1 长期未决的 Flight SQL ODBC 主干 PR
- PR: #46099 `[C++] Arrow Flight SQL ODBC layer`
- 链接: https://github.com/apache/arrow/pull/46099

创建于 2025-04-10，至今仍未合并。  
考虑到近期 Ubuntu / Debian / static build / macOS CI 一系列配套 PR 集中出现，说明该 PR 已成为一个“主干型长期工程”。  
**建议**：明确拆分计划、里程碑和最小可交付范围，避免长期堆积。

---

### 7.2 Decimal 乘法 bug
- Issue: #43252
- 链接: https://github.com/apache/arrow/issues/43252

虽然不是今天新开，但仍是高价值、面向正确性的长期问题。  
**建议**：优先确认是否已有 C++ compute 层复现、补充边界测试，并给出修复路径。

---

### 7.3 IPC 写入内存占用优化
- Issue: #31528 `[C++] Reduce memory usage when writing to IPC`
- 链接: https://github.com/apache/arrow/issues/31528

这是分析型系统中非常关键的工程点。  
IPC 若存在较高写入峰值内存，会影响流式交换、大批量导出、嵌入式执行环境和高并发服务端使用。

---

### 7.4 Scanner / Dataset 表达能力相关老问题
- #31525 `[C++] ScannerBuilder::Filter returns an error when given an augmented field`  
  https://github.com/apache/arrow/issues/31525
- #31522 `[C++] Allow reordering fields of a StructArray via casting`  
  https://github.com/apache/arrow/issues/31522

这些问题直接关联 Dataset 扫描、嵌套字段处理、投影与过滤语义，对 Arrow 作为查询执行底座的能力很关键。  
虽然今天只是 stale 更新，但其技术价值并未降低。

---

### 7.5 Windows ARM64 的 PyArrow 构建支持
- PR: #48539 `[Python][CI] Add support for building PyArrow library on Windows ARM64`
- 链接: https://github.com/apache/arrow/pull/48539

这是生态兼容性的重要工作，面向新硬件平台。  
随着 Windows on ARM 设备增长，该 PR 的价值会持续上升，建议推进评审。

---

## 8. 结论

今天的 Apache Arrow 动态呈现出一个很清晰的画像：

1. **核心重心在工程稳定性与跨平台接入能力**，尤其是 Flight SQL ODBC。  
2. **Parquet 与 C++ 基础层继续补强安全性和构建兼容性**，维护响应速度较快。  
3. **Python 与 R 生态仍在持续拓展用户面能力**，如 Azure 支持、文档与弃用整理。  
4. **真正值得持续警惕的风险点**仍是 Decimal 正确性、CUDA 兼容性，以及一些长期未收敛的 Dataset / IPC 内存问题。

整体来看，Apache Arrow 当前项目健康度良好，短期内最值得关注的主线是：  
**Flight SQL 驱动生态成熟化 + 分析型存储/计算边界稳定性修复。**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*