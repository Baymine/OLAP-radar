# Apache Doris 生态日报 2026-03-18

> Issues: 10 | PRs: 154 | 覆盖项目: 10 个 | 生成时间: 2026-03-18 02:04 UTC

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

# Apache Doris 项目动态日报（2026-03-18）

## 1. 今日速览

过去 24 小时 Apache Doris 社区保持高活跃：Issues 更新 10 条，PR 更新 154 条，代码流转速度很快，说明当前仍处于密集迭代期。  
从内容看，今天的重心集中在 **查询执行器编译/运行性能优化、文件缓存稳定性修复、外部数据湖/对象存储连接能力增强，以及 MaxCompute / Paimon / Iceberg 生态对接**。  
稳定性方面，新增问题以 **BE 崩溃、Iceberg 扫描异常、视图列裁剪错误、物化视图命中正确性、导入内存超限、meta_tool coredump** 为主，涉及执行引擎、优化器和外表读写链路。  
总体判断：**项目健康度良好，开发吞吐高，但 4.0.x/4.0.2/4.0.3 线上稳定性问题仍需重点盯防**，尤其是数据湖接入与查询正确性相关缺陷。

---

## 3. 项目进展

以下为今日较重要的已合并/关闭 PR 及其意义：

### 3.1 存储与缓存稳定性持续增强

- **[PR #61386](https://github.com/apache/doris/pull/61386)**  
  **[fix](cloud) fix segment footer CORRUPTION not triggering file cache retry**  
  修复了 `Segment::_open()` 中三层重试逻辑因 `if-else-if` 结构导致的分支不可达问题。当文件打开成功但 footer 解析返回 `CORRUPTION` 时，之前不会触发文件缓存重试；该修复直接提升了 **云存储 + file cache 场景下的读稳定性与容错性**。  
  - 回捞分支：**[PR #61425](https://github.com/apache/doris/pull/61425)**（branch-4.0）

- **[PR #60609](https://github.com/apache/doris/pull/60609)**  
  **[Enhancement](file-cache) Add fine-grained control for compaction file cache**  
  为 compaction 输出文件增加细粒度缓存控制，可只缓存 index 文件，降低不必要的数据缓存放大，适合 **cloud mode 下 compaction I/O 成本控制**。  
  - 对应回捞：**[PR #61354](https://github.com/apache/doris/pull/61354)**

- **[PR #61444](https://github.com/apache/doris/pull/61444)**  
  **branch-4.0: [fix](filecache) avoid SIGSEGV in background LRU update when clear cache**  
  这是 4.0 分支上的回捞修复，针对 **清理缓存时后台 LRU 更新导致 SIGSEGV** 的问题，属于较高价值稳定性补丁。

### 3.2 外部生态连接能力推进

- **[PR #61269](https://github.com/apache/doris/pull/61269)**  
  **[refactor](oss) unify FE OSS filesystem with Jindo**  
  统一 FE 侧 OSS 文件系统实现到 Jindo FS，移除旧 OSS 依赖，减少 classpath 上多实现并存引发的不确定性。  
  这对 **阿里云 OSS 兼容性、维护成本和依赖清理** 都是正向推进。  
  - 回捞分支：**[PR #61416](https://github.com/apache/doris/pull/61416)**

- **[PR #60296](https://github.com/apache/doris/pull/60296)**  
  **[chore](thirdparty) Integrate paimon-cpp into thirdparty build system**  
  将 `paimon-cpp` 正式纳入 thirdparty 构建体系，使 Doris 具备 **原生 C++ 读取 Paimon** 的能力，减少 JNI 路径带来的性能和复杂度开销。  
  这属于数据湖生态支持的重要基建。

- **[PR #60730](https://github.com/apache/doris/pull/60730)**  
  **[fix](paimon) install paimon-cpp arrow static deps into isolated dir**  
  作为上面 Paimon C++ 集成的 follow-up，修复依赖安装隔离问题，说明 **Paimon 原生链路正在进入工程化落地阶段**。

- **[PR #61094](https://github.com/apache/doris/pull/61094)**  
  **[feat](paimon) support jdbc catalog type**  
  新增 Paimon JDBC catalog 类型支持，进一步拓展 Doris 与 Paimon 元数据管理体系的对接方式，属于 **连接器能力增强**。

### 3.3 SQL 计算正确性与测试稳定性修复

- **[PR #61397](https://github.com/apache/doris/pull/61397)**  
  **[fix](decimalv2) fix wrong result of abs(decimalv2)**  
  修复 `abs(decimalv2)` 返回结果错误的问题，属于 **SQL 函数正确性修复**。  
  - 回捞分支：**[PR #61411](https://github.com/apache/doris/pull/61411)**

- **[PR #61404](https://github.com/apache/doris/pull/61404)**  
  **[fix](test) Fix BDB JE resource leak in BDBEnvironmentTest causing FE UT timeout**  
  修复 FE 单测中的 BDB JE 资源泄漏，避免 JVM 退出时陷入 checkpoint/VLSN 重试导致 CI 超时。  
  这提升了 **研发基础设施稳定性与 CI 可靠性**。  
  - 回捞分支：**[PR #61412](https://github.com/apache/doris/pull/61412)**

### 3.4 开发效率与工程优化

- **[PR #61349](https://github.com/apache/doris/pull/61349)**  
  **[env](compiler) Reduce hash join build template instantiations**  
  Hash Join build 侧模板实例化数量减少，单文件编译时间从 **69.6s 降至 48.9s**，对核心执行器代码的开发体验提升明显。  
  这反映出项目开始关注 **大规模 C++ 模板代码带来的构建成本**。

- **[PR #61429](https://github.com/apache/doris/pull/61429)**  
  **[tool](fe) add fast-compile-fe.sh for incremental FE compilation**  
  增加 FE 增量编译脚本，可只编译变化过的 Java 文件并补丁式写入 `doris-fe.jar`，减少全量 Maven rebuild 时间。  
  这对高频 FE 开发调试尤其有价值。

---

## 4. 社区热点

### 4.1 SQL 函数兼容性大议题仍然活跃
- **[Issue #48203](https://github.com/apache/doris/issues/48203)**  
  **[Good First Issue] Support All SQL Functions in Other SQL System**  
  评论数 **127**，是当前最活跃议题之一。  
  该 issue 反映出 Doris 用户对 **跨 SQL 系统函数兼容性** 的持续强需求，背后是迁移成本、BI 工具兼容、异构数据库替换场景。  
  值得注意的是，issue 摘要提到维护者对“人工逐项投入”意愿下降，并提及借助 LLM/agent 生成 PR 的思路，这说明该方向更可能演变为 **批量函数补齐 + 自动化贡献模式**，而不是单点手工推进。

### 4.2 数据湖读取稳定性问题升温
- **[Issue #61225](https://github.com/apache/doris/issues/61225)**  
  **BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg table scanning/loading**  
  这是典型的 **外表读取链路高严重度稳定性问题**。  
  背后的技术诉求是：用户不仅要 Doris 能“接得上” Iceberg，更要在生产环境中 **稳定扫描、稳定导入、稳定处理复杂编码/字典页**。

### 4.3 物化视图/视图命中正确性问题受到关注
- **[Issue #61228](https://github.com/apache/doris/issues/61228)**  
  **同一 SQL 结果不一致，定位到 MATERIALIZED VIEW 命中问题**  
  用户指出查询条件组合方式不同返回结果不一致，进一步定位到 MV 命中异常。  
  这类问题直接关系到 **查询重写正确性和用户信任度**，通常比普通性能问题更敏感。

- **[Issue #61219](https://github.com/apache/doris/issues/61219)**  
  **View + ORDER BY 触发过度列裁剪，导致非排序列为空**  
  反映出优化器在列裁剪与视图展开上的正确性边界存在缺陷，属于 **可复现、影响结果集正确性** 的问题。

### 4.4 外部接入功能继续扩展
- **[PR #61325](https://github.com/apache/doris/pull/61325)**  
  **[feature](RoutineLoad) Support the Amazon Kinesis**  
  表明社区在 Kafka 之外继续补齐流式摄入入口，背后技术诉求是 **云原生消息系统对接**，尤其面向 AWS 用户群。

---

## 5. Bug 与稳定性

以下按严重程度排序，并标注是否看到相关 fix PR 线索。

### P0 / 高严重度：崩溃与 coredump

1. **[Issue #61447](https://github.com/apache/doris/issues/61447)**  
   **meta_tool will coredump when used to handle tablet meta**  
   - 版本：3.0 and higher  
   - 影响：元数据运维工具直接 coredump，影响故障排查与离线修复能力。  
   - 当前状态：**新报，暂未看到对应 fix PR**。

2. **[Issue #61225](https://github.com/apache/doris/issues/61225)**  
   **BE Crash with SIGSEGV in ByteArrayDictDecoder / std::out_of_range during Iceberg scanning/loading**  
   - 版本：4.0.2  
   - 影响：Iceberg 读取/导入直接导致 BE crash，属于生产风险较高问题。  
   - 当前状态：**未见直接 fix PR**。  
   - 相关背景修复：今天 file cache / segment footer 方向有修复，但并不能确认与该崩溃直接相关。

3. **[Issue #61095](https://github.com/apache/doris/issues/61095)**  
   **BE crashed with a query**  
   - 版本：4.0.2  
   - 影响：查询触发 BE crash，需尽快定位执行器/表达式/扫描链路。  
   - 当前状态：**未见 fix PR**。

### P1 / 高优先级：查询正确性问题

4. **[Issue #61219](https://github.com/apache/doris/issues/61219)**  
   **View ORDER BY 过度列裁剪导致结果列为空**  
   - 版本：4.0.1  
   - 性质：优化器/视图展开正确性 bug。  
   - 当前状态：**未见 fix PR**。

5. **[Issue #61228](https://github.com/apache/doris/issues/61228)**  
   **物化视图命中导致同 SQL 结果不一致**  
   - 版本：4.0.1  
   - 性质：查询重写正确性问题，通常优先级很高。  
   - 当前状态：**未见 fix PR**。

6. **[PR #61397](https://github.com/apache/doris/pull/61397)**  
   **fix wrong result of abs(decimalv2)**  
   - 已修复并合入，且已回捞至 4.0：**[PR #61411](https://github.com/apache/doris/pull/61411)**  
   - 说明：SQL 标量函数正确性问题已被快速处理。

### P2 / 中优先级：资源与导入稳定性

7. **[Issue #61053](https://github.com/apache/doris/issues/61053)**  
   **doris-4.0.3 flink-sql streamload 导入报 MEM_LIMIT_EXCEEDED**  
   - 版本：4.0.3  
   - 场景：Flink SQL + Stream Load 写入。  
   - 性质：摄入链路内存控制与批次处理能力问题。  
   - 当前状态：**未见 fix PR**。

8. **[Issue #52760](https://github.com/apache/doris/issues/52760)**  
   **单副本 compaction 场景下 version 异常导致 transaction 暴涨**  
   - 版本：3.0.5/3.0.6  
   - 今日状态：**Closed as Stale**  
   - 风险：虽然已 stale 关闭，但描述的问题涉及 **副本 version 修复失败 + 全局 transaction 暴涨**，如果仍可复现，建议维护者主动回访确认。

### 已关闭历史功能问题

9. **[Issue #9302](https://github.com/apache/doris/issues/9302)**  
   **[Feature] Support protobuf format for routine load**  
   - 今日关闭，说明相关需求可能已通过其他实现完成或被替代。  
   - 对流式导入格式扩展是积极信号。

---

## 6. 功能请求与路线图信号

### 6.1 Iceberg REST Catalog 自定义 Header 支持
- **[Issue #61388](https://github.com/apache/doris/issues/61388)**  
  **Support custom HTTP headers for REST Iceberg catalog via header.* properties**  
  这是一个非常明确的企业级需求，目标是按 Iceberg REST catalog 规范透传 `header.*`。  
  典型适用场景包括：
  - API Gateway / 反向代理鉴权
  - 多租户路由
  - 定制 Token / Header 验证
  - 与企业数据平台网关集成  
  结合 Doris 近期对 Iceberg/Paimon/OSS 等生态持续投入判断，**该需求有较大概率进入后续版本**。

### 6.2 Routine Load 新消息源：Amazon Kinesis
- **[PR #61325](https://github.com/apache/doris/pull/61325)**  
  **Support the Amazon Kinesis**  
  这是明确的功能开发信号。若顺利合入，将意味着 Doris Routine Load 从 Kafka 向 **AWS 原生流服务** 扩展。  
  同时，历史 issue **[Issue #9302](https://github.com/apache/doris/issues/9302)** 的关闭，也说明流式导入能力仍在演进。

### 6.3 SQL 函数补齐继续推进
- **[PR #61352](https://github.com/apache/doris/pull/61352)**  
  **Support REGR_ARGX, REGR_ARGY, REGR_COUNT and REGR_R2 aggregate functions**  
  这是对统计回归类聚合函数的补齐，和 **[Issue #48203](https://github.com/apache/doris/issues/48203)** 形成呼应。  
  说明 Doris 在 SQL 兼容性上的策略不是“一次性大而全”，而是 **围绕实际需求逐步补齐函数簇**。

### 6.4 Spill / 内存管理能力继续增强
- **[PR #61212](https://github.com/apache/doris/pull/61212)**  
  **[feat](spill) Support multi-level partition spilling**  
  支持多级 repartition spill，在内存不足时将已 spill 分区进一步拆分，降低峰值内存。  
  这对大 Join / 大聚合 / 高并发压力场景非常关键，属于 **查询引擎内存韧性增强** 的核心能力，较有希望进入下一阶段主线版本。

### 6.5 MaxCompute 外表写入能力扩展
- **[PR #61443](https://github.com/apache/doris/pull/61443)**  
  **branch-4.1: Support INSERT INTO for MaxCompute external catalog tables**  
  表明 Doris 对 MaxCompute 已从“读优化”走向“写能力补齐”，路线图信号明确。

---

## 7. 用户反馈摘要

基于今日 issue/PR 内容，可以提炼出以下真实用户痛点：

1. **数据湖接入“能连上”已经不够，稳定性和正确性才是核心诉求**  
   - Iceberg 扫描崩溃、REST catalog header 诉求、Paimon/JDBC catalog 支持，都说明用户已进入深度使用阶段。  
   - 他们更关注 **企业网关兼容、复杂元数据系统适配、生产级容错能力**。

2. **查询正确性问题对用户信任影响极大**  
   - View 列裁剪错误、MV 命中导致结果不一致、`abs(decimalv2)` 结果错误，都属于用户最敏感的问题类别。  
   - 即便性能提升明显，只要结果不稳定，就会阻碍 Doris 在核心分析链路中的采用。

3. **流式导入场景对资源控制要求很高**  
   - Flink SQL + Stream Load 的 `MEM_LIMIT_EXCEEDED` 表明用户正在真实生产链路上跑持续写入，期望 Doris 在 **checkpoint、批次写入、内存上限、group commit** 等方面更稳。

4. **开发者社区开始重视工程效率**  
   - fast FE compile、hash join 编译时间优化、thirdparty 构建修复，说明维护者和贡献者都在追求更快的迭代效率。  
   - 这是项目成熟化的积极信号。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或潜在积压项：

1. **[Issue #48203](https://github.com/apache/doris/issues/48203)**  
   **Support All SQL Functions in Other SQL System**  
   - 长期开放，评论数高。  
   - 尽管维护侧已弱化手工投入，但它仍是 Doris SQL 兼容性的“总需求池”。  
   - 建议：拆分为函数族路线图，公开优先级与自动化补齐策略。

2. **[PR #59065](https://github.com/apache/doris/pull/59065)**  
   **support file cache admission control**  
   - 这是较大的缓存机制增强 PR，尚未合入。  
   - 若该功能成熟，将与今日已合入的 file-cache 细粒度控制形成体系化能力。  
   - 建议：补充英文设计说明与基准测试，推动评审。

3. **[PR #49020](https://github.com/apache/doris/pull/49020)**  
   **[opt](scan) skip zone map/bf calculation for some pages already filtered**  
   - 长期开着且带 `Stale`。  
   - 该优化方向对扫描性能可能有实际收益，但缺少推进。  
   - 建议：确认是否仍适配当前 scan 框架，否则尽快关闭或重提。

4. **[Issue #61095](https://github.com/apache/doris/issues/61095)** / **[Issue #61225](https://github.com/apache/doris/issues/61225)**  
   - 均为 4.0.2 的 BE crash。  
   - 若未快速收敛，可能影响 4.0.x 线上口碑。  
   - 建议：建立 crash issue 汇总和 fix 关联机制。

5. **[Issue #52760](https://github.com/apache/doris/issues/52760)**  
   - 虽已 stale 关闭，但问题描述涉及 compaction/version/transaction 级联异常。  
   - 建议：若社区近期仍有类似单副本 compaction 反馈，应考虑重新打开或建立统一跟踪 issue。

---

## 项目健康度结论

- **活跃度：高** —— 154 条 PR 更新显示核心开发非常活跃。  
- **功能推进：稳步前进** —— Paimon、MaxCompute、Iceberg、OSS、Kinesis 等外部生态集成持续扩展。  
- **稳定性：中等偏稳，但需警惕 4.0.x 数据湖与查询正确性问题**。  
- **工程成熟度：上升中** —— 回捞节奏快、CI 与构建效率优化明显。  

整体来看，Apache Doris 今日展现出一个 **高吞吐、高生态扩展、但仍需继续压降线上崩溃与正确性缺陷** 的成熟 OLAP 项目状态。若你需要，我还可以继续把这份日报整理成更适合内部周报/飞书消息/Markdown 邮件模板的版本。

---

## 横向引擎对比

以下是基于 **2026-03-18** 各项目社区动态整理的横向对比分析报告。

---

# OLAP / 分析型存储引擎开源生态横向对比报告
**日期：2026-03-18**

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储开源生态整体呈现出 **高活跃、强工程化、生态互联持续增强** 的态势。  
从社区动态看，主流项目普遍把重心放在四类问题上：**查询正确性与稳定性、数据湖/对象存储连接器增强、执行层内存与 spill 韧性、以及构建/发布/测试工程效率提升**。  
Lakehouse 相关格式与目录系统仍是投资核心，尤其是 **Iceberg / Paimon / MaxCompute / OSS / HDFS / Arrow Flight / REST Catalog** 等方向在多个项目中持续升温。  
整体上，行业已经从“功能接入”阶段进一步走向“生产可用”阶段，用户关注点明显转向 **复杂场景下的正确性、稳定性、兼容性与可运维性**。  
同时，SQL 兼容性补齐与云原生/企业网络环境适配，已成为各项目争夺企业级采用的重要抓手。

---

## 2. 各项目活跃度对比

> 注：ClickHouse、DuckDB、Databend 当日摘要缺失，以下表格以“摘要可见数据”为准。

| 项目 | Issues 更新 | PR 更新 | Release | 今日健康度评估 | 简要判断 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 10 | 154 | 无 | **高活跃，稳定性中等偏稳** | 吞吐最高之一，生态扩展快，但 4.0.x 仍需压降 crash/正确性问题 |
| **StarRocks** | 3 | 117 | 无 | **高活跃，工程状态积极** | 多版本回移频繁，事务/内存/外部存储稳定性修复明显 |
| **Apache Iceberg** | 20 | 43 | 无 | **活跃且稳健** | 以格式规范、REST Catalog、连接器兼容和补丁回补为主 |
| **Delta Lake** | 2 | 21 | 无 | **健康良好，路线清晰** | Kernel/DSv2/V2 connector 持续推进，聚焦协议一致性 |
| **Velox** | 4 | 46 | 无 | **良好偏积极** | 内核演进强，Spark兼容、Parquet/Hive/Iceberg 方向明显 |
| **Apache Gluten** | 8 | 15 | 无 | **活跃，处于工程收敛期** | Velox/CH 双后端并进，开始暴露性能/内存边界问题 |
| **Apache Arrow** | 31 | 19 | 无 | **健康良好，偏质量巩固** | 重点在打包、平台兼容、语言绑定与发布工程 |
| **ClickHouse** | - | - | - | **数据缺失** | 当日摘要生成失败 |
| **DuckDB** | - | - | - | **数据缺失** | 当日摘要生成失败 |
| **Databend** | - | - | - | **数据缺失** | 当日摘要生成失败 |

### 活跃度结论
- **第一梯队（超高吞吐）**：Apache Doris、StarRocks  
- **第二梯队（高活跃、方向清晰）**：Iceberg、Velox  
- **第三梯队（聚焦型演进）**：Delta Lake、Arrow、Gluten  
- **数据缺失无法评估**：ClickHouse、DuckDB、Databend

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的优势
与同类项目相比，Apache Doris 当前最突出的特点是：

1. **社区吞吐极高**  
   当日 **154 条 PR 更新**，显著高于多数同类项目，说明其核心开发与分支维护均非常活跃。

2. **“一体化分析数据库”定位清晰**  
   Doris 不只是执行引擎，也不是单纯表格式项目，而是同时覆盖：
   - 存储引擎
   - 查询执行器
   - 优化器
   - 导入链路
   - 物化视图
   - 外表 / 湖仓连接器  
   这种全栈能力使其更适合做企业统一分析平台底座。

3. **生态集成推进快**  
   当天在 **Paimon、Iceberg、OSS/Jindo、MaxCompute、Amazon Kinesis** 等方向均有进展，说明 Doris 在积极向“云上分析中枢”靠拢。

4. **工程成熟度持续上升**  
   包括：
   - file cache 稳定性修复
   - FE 增量编译脚本
   - Hash Join 编译耗时优化
   - 快速回捞到 4.0 分支  
   这些都表明其维护体系已较成熟。

### 3.2 Doris 的短板与风险
相较 StarRocks、Delta Lake、Iceberg 这类在部分领域更聚焦的项目，Doris 当前主要风险在于：

- **4.0.x 稳定性压力仍较明显**
  - BE crash
  - Iceberg 扫描异常
  - 视图列裁剪错误
  - MV 命中结果不一致
  - Stream Load 内存超限

- **数据湖接入已进入“正确性敏感期”**  
  用户不再只要求“读得到”，而是要求在复杂编码、缓存、元数据、catalog、权限网关下都能稳定工作。

### 3.3 与同类项目的技术路线差异
- **对比 StarRocks**：  
  两者都走高性能 MPP 分析数据库路线，但 Doris 在今日表现出更强的 **多生态连接器扩展广度**，而 StarRocks 更突出 **事务、Arrow Flight、外部存储异常恢复、内存治理**。
- **对比 Iceberg / Delta**：  
  Doris 是“带湖仓接入能力的分析数据库”，后两者更像“表格式/事务层标准与生态中枢”。
- **对比 Velox / Arrow**：  
  Doris 面向最终数据库能力交付；Velox/Arrow 更偏底层执行或数据交换基础设施。
- **对比 Gluten**：  
  Gluten 更像 Spark 加速层，而 Doris 是完整 OLAP 数据库产品。

### 3.4 社区规模对比
从单日活跃度看，Doris 属于当前样本中的 **头部高活跃项目**。  
如果把 Iceberg、Arrow、Velox 视作基础设施型社区，把 Delta 视作协议/内核演进社区，那么 Doris 与 StarRocks 更像是 **直接面向生产数仓替代与实时分析平台建设的强工程型社区**。

---

## 4. 共同关注的技术方向

以下是多项目共同涌现的需求与技术主题。

### 4.1 数据湖 / 外部 Catalog / 对象存储连接增强
**涉及项目：** Doris、StarRocks、Iceberg、Gluten、Velox、Delta  
**具体诉求：**
- Doris：Paimon C++、Paimon JDBC catalog、Iceberg REST header、OSS/Jindo 统一、MaxCompute 写入
- StarRocks：Paimon refresh 修复、Iceberg row lineage
- Iceberg：REST Catalog batch load、credential refresh、GCS timeout
- Velox：Iceberg positional update、Hive 可插拔 index reader
- Gluten：Iceberg metadata / input_file_name 修复
- Delta：catalog 与 stagingCatalog 扩展

**共同信号：**  
行业正在从“接入湖格式”转向“深度支持 catalog、元数据、对象存储、权限与复杂网络环境”。

---

### 4.2 查询正确性与 SQL 兼容性优先级上升
**涉及项目：** Doris、StarRocks、Velox、Delta、Arrow、Iceberg、Gluten  
**具体诉求：**
- Doris：MV 命中结果不一致、View 列裁剪错误、abs(decimalv2) 错误
- StarRocks：表达式 join key 造成 crash / wrong results，GROUP BY ALL 需求
- Velox：`from_unixtime YYYY` 与 Spark 不一致
- Delta：Java Kernel data skipping 列名大小写敏感违背协议
- Arrow：R 时间解析/转换、复杂类型兼容
- Iceberg：Flink silent empty reads、Hive migration null partition
- Gluten：ANSI 模式支持

**共同信号：**  
“兼容 Spark / SQL 方言 / 协议语义”已成为企业采用门槛，正确性问题优先级显著高于单纯性能优化。

---

### 4.3 执行层内存治理、spill 与资源稳定性
**涉及项目：** Doris、StarRocks、Gluten、Delta、Velox  
**具体诉求：**
- Doris：多级 repartition spill、导入内存超限、file cache 稳定性
- StarRocks：query_pool 负值、local exchange buffer 限制
- Gluten：HashBuild OOM、Distinct aggregation spill 后 OOM
- Delta：MicroBatch 资源泄漏
- Velox：DWRF dangling StringView、JITIFY debug crash

**共同信号：**  
随着负载进入大 Join / 大聚合 / 高并发 / 流式持续写入场景，内存控制与资源回收已成为核心竞争力。

---

### 4.4 工程效率、构建与发布体系优化
**涉及项目：** Doris、Arrow、Velox、Gluten、Iceberg  
**具体诉求：**
- Doris：fast-compile-fe、Hash Join 编译时间下降
- Arrow：Windows wheel、editable install、Maven 升级、Trusted Publishing
- Velox：CI、依赖治理、FBThrift 替换
- Gluten：TLP 毕业后的仓库/文档/CI 收尾
- Iceberg：补丁线回补、stale 清理

**共同信号：**  
项目成熟后，工程效率不再是附属议题，而是影响社区吸引力与交付质量的关键指标。

---

### 4.5 云原生网络与企业部署环境适配
**涉及项目：** Doris、StarRocks、Iceberg、Arrow、Velox  
**具体诉求：**
- Doris：Iceberg REST 自定义 header、Kinesis、OSS/Jindo
- StarRocks：Arrow Flight proxy / inaccessible nodes
- Iceberg：credential refresh、GCS timeout
- Arrow：Windows ODBC 签名/安装链路
- Velox：RPC / sidecar discovery

**共同信号：**  
企业真实环境中的网关、代理、签名、私网、临时凭证、多租户路由，正在直接塑造开源分析系统的产品能力边界。

---

## 5. 差异化定位分析

## 5.1 存储格式层 vs 数据库引擎层

| 类型 | 代表项目 | 核心定位 |
|---|---|---|
| 分析数据库 / MPP 引擎 | Doris、StarRocks | 提供完整查询执行、优化器、存储、导入和服务能力 |
| 表格式 / Lakehouse 元数据层 | Iceberg、Delta Lake | 提供表格式规范、事务语义、catalog 生态与跨引擎互操作 |
| 执行引擎 / 加速内核 | Velox、Gluten | 提供底层向量化执行、Spark 加速、连接器执行能力 |
| 数据交换 / 列式基础设施 | Arrow | 提供跨语言内存格式、Flight、Parquet 相关能力 |

### 判断
- **Doris / StarRocks** 更适合承担最终分析服务入口。
- **Iceberg / Delta** 更适合作为湖仓元数据与事务层。
- **Velox / Gluten / Arrow** 更像生态基座，服务于更上层系统。

---

## 5.2 查询引擎设计差异
- **Doris / StarRocks**：典型 MPP 分析数据库路径，强调 OLAP 查询、实时导入、物化视图、外部表融合。
- **Velox**：高性能向量化执行引擎，偏底层，供上层系统集成。
- **Gluten**：以 Spark 加速为主，依赖 Velox/ClickHouse 后端。
- **Delta / Iceberg**：不直接主打执行器，而是通过 Spark/Flink/Trino/Doris/StarRocks 等消费其表格式。
- **Arrow**：提供跨进程/跨语言数据表示与传输，不直接承担完整 SQL 引擎职责。

---

## 5.3 目标负载类型差异
- **Doris / StarRocks**：实时分析、交互式查询、明细+聚合混合负载、外表联邦分析
- **Iceberg / Delta**：湖仓统一表管理、批流一体、跨引擎共享数据
- **Gluten**：Spark SQL / ETL / 批处理加速
- **Velox**：作为 Trino/Gluten 等系统的执行内核
- **Arrow**：BI、数据科学、语言绑定、Flight/ODBC/JDBC 互通

---

## 5.4 SQL 兼容性差异
- **Doris / StarRocks**：面向替代传统分析数据库，SQL 函数兼容与方言易用性是显性竞争点。
- **Gluten / Velox**：更强调与 Spark SQL 语义兼容。
- **Delta / Iceberg**：兼容性更多体现为协议、catalog、表格式和多引擎一致性。
- **Arrow**：语言 API 语义兼容比 SQL 更重要，但其 R/Python/ODBC 生态同样会反馈出 SQL/表达式需求。

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：快速迭代、高吞吐主战场
- **Apache Doris**
- **StarRocks**

特征：
- PR 量高
- 功能与修复并行
- 多版本回移频繁
- 用户反馈集中在生产正确性和稳定性

### 第二层：平台型稳步演进
- **Apache Iceberg**
- **Velox**
- **Apache Arrow**

特征：
- 不以单日 PR 冲量取胜
- 更关注规范、兼容、基础设施、跨平台能力
- 更像生态底层支柱

### 第三层：路线集中、架构演进型
- **Delta Lake**
- **Apache Gluten**

特征：
- 活跃度不低，但主题更集中
- 更偏向特定架构主线推进
- 如 DSv2 / Kernel / Spark 加速 / ANSI 兼容等

---

## 6.2 哪些处于快速迭代阶段
- **Doris**：数据湖接入、缓存、编译效率、SQL 函数、流式导入同时推进
- **StarRocks**：Arrow Flight、内存治理、事务 HA、外部存储修复
- **Delta**：Kernel 与 DSv2/V2 connector 明显处在演进快车道
- **Velox**：RPC、Spark/Parquet/Iceberg 兼容能力持续扩展

## 6.3 哪些更偏质量巩固阶段
- **Arrow**：发布、打包、平台兼容、语言绑定完善
- **Iceberg**：规范、补丁回补、REST Catalog 能力增强与 backlog 清理
- **Gluten**：性能与稳定性问题收敛、TLP 毕业后工程整理

---

## 7. 值得关注的趋势信号

## 7.1 “能接入”不再够，必须“稳定且正确”
这是最明确的行业信号。  
无论是 Doris 的 Iceberg 扫描 crash、StarRocks 的 join wrong results、Delta 的协议大小写一致性，还是 Iceberg 的 silent empty reads，都表明用户已进入 **生产深用阶段**。  
**对数据工程师的意义：** 选型时不能只看 benchmark 和功能清单，要重点验证边界正确性、异常路径、回归测试质量。  
**对架构师的意义：** 多引擎湖仓方案中，正确性与兼容性测试必须前置到 POC 早期。

---

## 7.2 湖仓控制面正在成为竞争焦点
REST Catalog、JDBC catalog、header 透传、credential refresh、batch endpoints、row lineage、metadata propagation 等需求在多个项目同时出现。  
这说明下一阶段竞争不只是“谁能读 Iceberg/Delta”，而是“谁能在复杂企业控制面下更顺畅地管理它们”。  
**参考价值：**
- 企业网关、鉴权、代理、多租户路由将越来越重要
- catalog 能力将直接影响平台集成成本

---

## 7.3 内存韧性与 spill 能力成为核心指标
多级 spill、hash build side 选择、distinct spill OOM、buffer 限流、memory tracker 准确性，这些都反复出现。  
**对数据工程师：** 大查询稳定性越来越依赖内存治理，而不是简单堆机器。  
**对架构师：** 在高并发或资源隔离场景下，应优先评估算子级内存控制、spill 策略和观测能力。

---

## 7.4 SQL 兼容与易用性仍是数据库替代成败关键
Doris 的函数补齐、StarRocks 的 GROUP BY ALL、Gluten 的 ANSI 模式、Velox 对 Spark 日期语义对齐，都说明迁移成本仍是企业最敏感问题之一。  
**参考价值：**
- 数据库替代不只是性能迁移，更是 SQL 语义迁移
- 兼容性路线图应纳入采购或选型评估标准

---

## 7.5 工程化能力正在决定社区上限
构建速度、CI 稳定性、打包、签名、Windows 支持、分支回移效率，在多个项目中都是高频主题。  
这表明开源分析系统竞争已从“核心算法”扩大到“交付体系”。  
**参考价值：**
- 对企业来说，安装、升级、调试、回滚成本会直接影响落地速度
- 对贡献者来说，工程效率高的社区会更容易持续吸纳外部开发者

---

# 总体结论

从 2026-03-18 的社区动态看，OLAP / 分析型存储生态已进入一个很明确的新阶段：  
**上层数据库项目在拼生态接入广度与生产稳定性，下层格式与执行基础设施项目在拼协议一致性、连接器健壮性与工程成熟度。**

对 **Apache Doris** 而言，其当前处于生态中的头部活跃位置，优势在于：
- 全栈分析数据库能力
- 高吞吐社区节奏
- 数据湖与外部生态扩展快

但同时也要关注：
- 4.0.x 线上稳定性
- 查询正确性
- 数据湖链路的生产可靠性

如果从技术决策视角给出一句话判断：

- **选 Doris / StarRocks**：看重统一分析数据库能力与高性能交付；
- **选 Iceberg / Delta**：看重湖仓表格式标准与跨引擎数据治理；
- **关注 Velox / Gluten / Arrow**：看重未来执行栈、加速层与数据交换底座的演进方向。

如果你愿意，我可以继续把这份报告整理成：
1. **更适合管理层阅读的 1 页摘要版**
2. **适合内部周报的 Markdown 表格版**
3. **“Apache Doris vs StarRocks vs Iceberg” 三方重点对比版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

以下是 **StarRocks 2026-03-18 项目动态日报**。

---

# StarRocks 项目动态日报｜2026-03-18

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持了**高强度开发活跃度**：Issues 更新 3 条，PR 更新高达 117 条，其中 61 条已合并或关闭、56 条仍在推进中。  
从变更内容看，今日工作重心集中在 **查询执行稳定性、内存计量、外部存储/连接器兼容性、Arrow Flight 生态补强** 等方向。  
同时，多个 PR 带有 **3.5 / 4.0 / 4.1 多版本回移标签**，说明维护团队正在持续强化稳定分支，项目工程化健康度较好。  
今日无新版本发布，但从已合并和活跃 PR 来看，**4.1 分支仍是近期功能增强与稳定性修复的核心承载版本**。

---

## 3. 项目进展

> 今日无新 Release，以下聚焦已合并/关闭及值得关注的关键 PR 进展。

### 3.1 系统可观测性增强：`task_runs` 系统表暴露 warehouse 信息
- **PR**: #70312 `[CLOSED] [BugFix] Expose warehouse name in task_runs system table`  
  链接: StarRocks/starrocks PR #70312
- **回移 PR**: #70391 `[CLOSED] [automerge] ... (backport #70312)`  
  链接: StarRocks/starrocks PR #70391

**进展解读：**  
该改动为系统表 `task_runs` 增加 `WAREHOUSE` 列，使任务运行记录能够关联到具体 warehouse。对使用多 warehouse 资源隔离、批任务调度、异步作业排障的用户来说，这是明显的运维可观测性提升。  
这类改动虽然归类为 BugFix，但实质上提升了 **系统元数据透明度** 和 **资源归因分析能力**，对云环境和多租户场景尤为重要。

**影响方向：**
- 查询任务排障更容易定位资源归属
- 多 warehouse 调度分析能力增强
- 4.1 分支已有回移，短期内大概率可被用户直接使用

---

### 3.2 Arrow Flight 生态修复链条继续收口
今日关闭的一组 PR 继续围绕 Arrow Flight 的并发性、代理访问和上下文管理做补强：

- **PR**: #65488 `[CLOSED] [3.5, 4.0] [BugFix] Query Id Collision on Arrow Flight`  
  链接: StarRocks/starrocks PR #65488
- **PR**: #65558 `[CLOSED] [3.5-merged, 4.0-merged] [BugFix] Query Id Collision on Arrow Flight`  
  链接: StarRocks/starrocks PR #65558
- **PR**: #65644 `[CLOSED] [3.5, 4.0] [BugFix] Fix Arrow Flight Context Reset`  
  链接: StarRocks/starrocks PR #65644
- **PR**: #66348 `[CLOSED] [Feature] Support Arrow Flight Data Retrieval from Inaccessible Nodes`  
  链接: StarRocks/starrocks PR #66348
- **PR**: #67210 `[CLOSED] [BugFix] Fix Backport Merge Conflict for Arrow Flight Proxy`  
  链接: StarRocks/starrocks PR #67210
- **PR**: #67211 `[CLOSED] [Feature] Support Arrow Flight Data Retrieval from Inaccessible Nodes (backport #66348)`  
  链接: StarRocks/starrocks PR #67211
- **PR**: #67794 `[CLOSED] [3.5-merged, 4.0-merged] [BugFix] Fix FE Queries with Arrow Flight Proxy`  
  链接: StarRocks/starrocks PR #67794

**进展解读：**  
这一串 PR 表明 StarRocks 正在系统性补齐 Arrow Flight 在企业部署中的关键能力：
1. **并发查询场景下的 query id 冲突**
2. **上下文未正确 reset 导致连续查询失败**
3. **BE 节点不可直连时的数据访问**
4. **代理/私网环境下 FE 查询兼容性**

这说明 Arrow Flight 已不只是实验性集成，而是在朝 **生产级数据访问通道** 演进，尤其适用于 Kubernetes、私有网络、代理网关等现代部署环境。

---

### 3.3 活跃中的核心稳定性修复

#### A. FE 显式事务在 leader 切换后状态丢失
- **PR**: #70285 `[OPEN] [BugFix] Fix explicit transaction state loss handling on FE leader switch`  
  链接: StarRocks/starrocks PR #70285

**解读：**  
该问题会导致 leader 切换后连接仍保留过期事务 ID，从而出现：
- COMMIT/ROLLBACK 静默失败
- BEGIN 潜在 NPE

这是典型的 **控制面高可用与会话状态一致性问题**。如果修复合入，将显著提升显式事务在 FE 高可用切换场景中的可靠性。

---

#### B. ingestion 期间 `query_pool` 内存计量出现负值
- **PR**: #70228 `[OPEN] [3.5, 4.0, 4.1] [BugFix] Fix query_pool memory tracker going negative during ingestion`  
  链接: StarRocks/starrocks PR #70228

**解读：**  
该问题不一定直接导致 crash，但会造成内存统计失真，影响系统对压力、限额、诊断的判断。  
由于已标注多版本回移，说明其影响面较广，属于**中高优先级稳定性修复**。

---

#### C. HDFS close 卡顿导致过期文件系统检查器阻塞
- **PR**: #70311 `[OPEN] [3.4, 3.5, 4.0, 4.1] [BugFix] Fix FileSystemExpirationChecker blocking on slow HDFS close`  
  链接: StarRocks/starrocks PR #70311

**解读：**  
该问题会在 NameNode 不可达等异常条件下放大：
- 同一文件系统的新请求被锁阻塞
- 单线程 checker 被拖死，影响其他过期实例回收

这属于**外部存储依赖异常下的可用性问题**，对重度 HDFS 用户很关键。

---

#### D. Paimon 元数据刷新后台线程崩溃
- **PR**: #70224 `[OPEN] [BugFix] Paimon catalog refresh crashes with ClassCastException on ObjectTable`  
  链接: StarRocks/starrocks PR #70224

**解读：**  
一旦外部 catalog 中存在 `ObjectTable`，后台元数据刷新 daemon 会直接异常，进而阻断整个 catalog 刷新。  
这是典型的**连接器健壮性问题**，影响外表湖仓集成体验。

---

### 3.4 SQL / 生态兼容性增强

#### A. Iceberg compaction 写入 row lineage 物理列
- **PR**: #70128 `[OPEN] [4.1] [Enhancement] Support write iceberg row lineage fields into data files during compaction`  
  链接: StarRocks/starrocks PR #70128

**解读：**  
该 PR 支持在 v3+ Iceberg 表 compaction 时写入 `_row_id`、`_last_updated_sequence_number` 等 row lineage 字段，并通过 session variable 控制。  
这表明 StarRocks 正进一步对齐 **Iceberg 高版本表规范**，增强数据血缘、更新序列语义和生态互操作性。

---

#### B. Oracle JDBC 类型映射增强
- **PR**: #70315 `[OPEN] [4.0, 4.1] [Enhancement] oracle jdbc type mapping`  
  链接: StarRocks/starrocks PR #70315

**解读：**  
该 PR 针对 Oracle 到 StarRocks 的时间类型映射做增强，是典型的**异构数据库接入兼容性补强**。  
对于数据库迁移、联邦查询和 JDBC catalog 用户来说，这类修复的价值通常高于表面复杂度。

---

#### C. 本地 exchange buffer 增长控制
- **PR**: #70393 `[OPEN] [Enhancement] adding a config to limit the buffer size to dop * local_exchange_buffer_mem_limit_per_driver`  
  链接: StarRocks/starrocks PR #70393

**解读：**  
该改动尝试限制 union operator 下 local exchange buffer 随输入数量线性膨胀的问题，属于**查询执行内存治理**方向的重要信号。  
如果合入，将对高并发、多输入 union 场景的内存稳定性产生直接帮助。

---

## 4. 社区热点

### 热点 1：`GROUP BY ALL` SQL 语法支持请求
- **Issue**: #69953 `[OPEN] [type/enhancement, good first issue] Support GROUP BY ALL syntax to simplify queries`  
  链接: StarRocks/starrocks Issue #69953  
  数据：评论 2，👍 4

**为何值得关注：**  
这是今日反应数最高的 Issue。用户希望在 `SELECT` 列表增加非聚合列时，不必手动同步修改 `GROUP BY` 子句。  
背后诉求很明确：  
- 提升 SQL 编写效率  
- 减少人为遗漏导致的语义错误  
- 向更现代化、易用的分析 SQL 体验靠拢

**技术分析：**  
这类需求通常属于 **解析器 + 语义分析器层面的 SQL 兼容性增强**，实现复杂度不算最高，但需要谨慎处理：
- select list 中表达式展开
- 聚合函数识别
- 与别名、窗口函数、嵌套查询的交互

若社区继续给出正反馈，该特性较有机会进入后续中期版本路线图。

---

### 热点 2：表达式 Join Key 在自适应分区 Hash Join 下导致 crash / 错结果
- **Issue**: #70349 `[OPEN] [type/bug] ... merge_ht() missing expression-based key column merge causes crash/wrong results`  
  链接: StarRocks/starrocks Issue #70349  
  数据：评论 2

**为何值得关注：**  
这是今日最值得警惕的新 Bug 报告之一，直接涉及：
- 查询崩溃
- 查询结果错误
- 自适应分区 hash join
- 表达式型 join key

**技术分析：**  
问题说明 `JoinHashTable::merge_ht()` 在 merge 阶段遗漏了基于表达式计算出的 key 列，属于**执行器内部数据结构合并逻辑缺陷**。  
这类问题比普通 crash 更严重，因为同时涉及 **wrong results** 风险。

---

### 热点 3：Arrow Flight 相关长链路修复集中收尾
- **PR 集合**: #65488 / #65558 / #65644 / #66348 / #67794 等  
  链接: 见上文各 PR

**为何值得关注：**  
虽然这些 PR 单条评论不多，但从集中关闭与回移节奏看，Arrow Flight 已成为近期维护重点之一。  
背后的技术诉求包括：
- 高并发访问可靠性
- 代理网络可达性
- 私网/容器化部署适配
- 会话上下文生命周期正确性

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P0 / 高优先级：查询错误结果或崩溃
1. **表达式 Join Key 在 adaptive partition hash join 下导致 crash / wrong results**  
   - Issue: #70349  
   - 链接: StarRocks/starrocks Issue #70349  
   - 状态：**OPEN**  
   - 是否已有 fix PR：**未见直接关联 fix PR**

**判断：**  
涉及 wrong results，优先级最高，建议尽快补充复现 SQL、影响版本与回归测试。

---

### P1 / 高优先级：HA 与事务一致性风险
2. **FE leader switch 后显式事务状态丢失**  
   - PR: #70285  
   - 链接: StarRocks/starrocks PR #70285  
   - 状态：**OPEN**

**风险：**
- COMMIT/ROLLBACK 静默失败
- BEGIN 潜在空指针
- 事务用户可能误判提交状态

---

### P1 / 高优先级：外部存储异常引发系统阻塞
3. **HDFS close 变慢导致 FileSystemExpirationChecker 阻塞**  
   - PR: #70311  
   - 链接: StarRocks/starrocks PR #70311  
   - 状态：**OPEN**

**风险：**
- 锁持有时间过长
- 同文件系统请求堆积
- 资源回收线程被单点拖慢

---

### P1 / 中高优先级：连接器后台线程崩溃
4. **Paimon catalog refresh 因 ObjectTable 触发 ClassCastException**  
   - PR: #70224  
   - 链接: StarRocks/starrocks PR #70224  
   - 状态：**OPEN**

**风险：**
- 后台 metadata refresh daemon 崩溃
- 外部 catalog 中所有表刷新受阻

---

### P2 / 中优先级：内存计量失真
5. **ingestion 场景 `query_pool` memory tracker 变成负值**  
   - PR: #70228  
   - 链接: StarRocks/starrocks PR #70228  
   - 状态：**OPEN**

**风险：**
- 内存观测误导
- 限流、诊断、容量规划可能偏差

---

### P2 / 中优先级：单元测试不稳定
6. **StarRocksMetricsTest / LakeReplicationRemoteStorageTest 失败**
   - PR: #70368  
   - 链接: StarRocks/starrocks PR #70368  
   - 状态：OPEN
7. **StarRocksMetricsTest.test_metrics_register 不稳定**
   - PR: #70390  
   - 链接: StarRocks/starrocks PR #70390  
   - 状态：OPEN

**判断：**  
虽然不直接影响线上功能，但 UT 抖动往往是隐藏竞态、缓存容量设置不合理、全局状态污染的早期信号。

---

## 6. 功能请求与路线图信号

### 6.1 `GROUP BY ALL` 有望成为 SQL 易用性增强候选
- **Issue**: #69953  
  链接: StarRocks/starrocks Issue #69953

该需求已带有 `good first issue`，说明维护者认为其切入点明确、适合贡献者参与。  
结合 StarRocks 一直在增强 SQL 兼容性和开发体验的趋势，这个功能**具备进入后续版本的可能性**，尤其适合做成解析层增量特性。

---

### 6.2 Iceberg 高版本语义对齐在持续推进
- **PR**: #70128  
  链接: StarRocks/starrocks PR #70128

row lineage 字段在 compaction 中落盘，属于明显的 **湖仓格式生态深耕** 信号。  
这表明 StarRocks 后续版本很可能继续加强：
- Iceberg v3+ 特性对齐
- 更新/删除语义支持
- 跨引擎元数据一致性

---

### 6.3 JDBC 异构源兼容性仍在扩展
- **PR**: #70315  
  链接: StarRocks/starrocks PR #70315

Oracle 类型映射增强说明 StarRocks 并未只聚焦内部引擎，还在不断补齐企业常见数据源对接体验。  
推测未来版本可能持续扩展：
- JDBC 类型映射精度
- 时间/时区语义一致性
- 更多数据库方言兼容

---

### 6.4 查询执行内存治理是当前明显方向
- **PR**: #70393  
  链接: StarRocks/starrocks PR #70393
- **PR**: #70228  
  链接: StarRocks/starrocks PR #70228

一边修复 memory tracker 负值，一边控制 local exchange buffer 增长，说明团队正在关注**执行层内存稳定性与可预测性**。  
这通常预示着后续版本会继续在以下方面发力：
- 算子级内存上限
- 更准确的内存统计
- 高 DOP / 多输入查询的 buffer 管理

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出以下真实用户痛点：

### 7.1 SQL 书写维护成本高
- 来自 Issue #69953  
- 链接: StarRocks/starrocks Issue #69953

用户在分析查询中频繁修改 `SELECT` 列时，希望 `GROUP BY` 自动跟随，避免重复维护。  
这说明部分用户已将 StarRocks 用于**迭代频繁、字段变动快的分析开发场景**，对 SQL 易用性有更高期待。

---

### 7.2 复杂 Join 场景下对“正确性”的敏感度很高
- 来自 Issue #70349  
- 链接: StarRocks/starrocks Issue #70349

用户不仅报告了 crash，还强调 wrong results，这通常来自真实生产查询而非纯理论测试。  
说明社区对 StarRocks 的期待已从“跑得快”转向“**在复杂优化路径下依然绝对正确**”。

---

### 7.3 云原生/共享存储环境需要更强的自愈能力
- 来自已关闭 Issue #66015  
- 链接: StarRocks/starrocks Issue #66015

该需求围绕 shared-data 模式下云原生表文件缺失后的 repair 能力，反映用户在单副本云存储模式下对**数据修复与回滚工具链**存在明确诉求。  
虽然该 Issue 已关闭，但说明此类能力已被项目纳入处理范围。

---

### 7.4 企业部署环境下，网络拓扑复杂性是真实痛点
- 来自 Arrow Flight 系列 PR：#66348、#67794 等  
- 链接: StarRocks/starrocks PR #66348 / PR #67794

用户场景包括：
- BE 节点不可直连
- FE 查询需要经过代理
- 多线程共享连接并发执行

这类反馈显示 StarRocks 正在被用于更复杂、更真实的企业网络环境，而不仅是理想化内网集群。

---

## 8. 待处理积压

> 受限于本次数据只包含最新 3 条 Issue 与部分 PR，以下仅列出在当前快照中值得维护者继续盯进的“未解决项”。

### 8.1 表达式 Join Key 导致 wrong results 的新 Bug 需尽快立项修复
- **Issue**: #70349  
  链接: StarRocks/starrocks Issue #70349

**提醒原因：**
- 影响查询正确性
- 涉及 adaptive partition hash join 核心执行路径
- 尚未看到对应 fix PR

---

### 8.2 `GROUP BY ALL` 需求已有用户支持，适合低成本推进
- **Issue**: #69953  
  链接: StarRocks/starrocks Issue #69953

**提醒原因：**
- 👍 数在今日 Issue 中最高
- 有 `good first issue` 标签
- 适合吸引社区贡献者，提升 SQL 体验

---

### 8.3 多个关键稳定性 PR 仍未合入，应关注 review/回归节奏
- **PR**: #70285 显式事务 leader switch 修复  
  链接: StarRocks/starrocks PR #70285
- **PR**: #70228 内存 tracker 负值修复  
  链接: StarRocks/starrocks PR #70228
- **PR**: #70311 HDFS close 阻塞修复  
  链接: StarRocks/starrocks PR #70311
- **PR**: #70224 Paimon refresh 崩溃修复  
  链接: StarRocks/starrocks PR #70224

**提醒原因：**
- 均为生产稳定性相关
- 多个带有跨版本回移标签
- 一旦拖延，可能影响多个维护分支的交付节奏

---

## 总体判断

StarRocks 今日呈现出典型的 **高活跃、强维护、稳定性导向** 的工程状态。  
短期看，团队正在集中处理 **事务一致性、执行层内存、外部存储异常、连接器健壮性、Arrow Flight 企业级可用性** 等实际生产问题；中期看，**Iceberg 生态兼容、SQL 易用性增强、系统可观测性补强** 正在释放明确路线图信号。  
从项目健康度看，**多分支回移频繁、问题修复链条完整、生态方向持续扩展**，整体状态积极。

如果你愿意，我还可以继续把这份日报整理成更适合内部周报/公众号发布的 **Markdown 精简版** 或 **表格版**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-18）

## 1. 今日速览

过去 24 小时，Apache Iceberg 社区保持了**较高活跃度**：Issues 更新 20 条、PR 更新 43 条，但**无新版本发布**。  
从变化结构看，当前工作重心明显集中在三条主线：**V4 manifest / 单文件提交能力演进**、**REST Catalog / OpenAPI 批量接口扩展**、以及 **Spark / Flink / Kafka Connect 的兼容性与性能修复**。  
关闭的 Issue 中有相当一部分带有 `stale` 标签，说明维护团队在持续清理积压；与此同时，新开与活跃问题仍达到 12 条，表明用户侧在**连接器稳定性、SQL 兼容性、元数据正确性和对象存储配置能力**上仍有较强诉求。  
整体判断：项目健康度良好，研发节奏稳定，但**1.10.x 补丁线的正确性修复和安全回补**值得持续关注。

---

## 2. 项目进展

> 今日无新版本发布，以下聚焦已合并/关闭的重要 PR 与相关推进。

### 2.1 文档与配置能力补齐：HadoopTables 锁配置文档已落地
- **PR #15522** `[CLOSED] docs: document iceberg.tables.hadoop prefix used by HadoopTables for lock configuration`  
  链接: apache/iceberg PR #15522
- **对应 Issue #15493** `[CLOSED] Add docs for iceberg.tables.hadoop. to set LockManager for HadoopTables`  
  链接: apache/iceberg Issue #15493

**进展解读：**  
这一项虽然是文档修复，但实际价值不低。它补齐了 `iceberg.tables.hadoop.` 配置前缀的官方说明，使 HadoopTables 场景下的 `LockManager` 配置可被正确发现和使用。对依赖 Hadoop catalog/table 的生产用户来说，这能降低**并发写入与锁管理配置不透明**带来的使用门槛。

---

### 2.2 表级扫描规划覆盖能力相关 PR 已关闭，设计方向仍值得关注
- **PR #15572** `[CLOSED] CORE: Allow table level override for scan planning`  
  链接: apache/iceberg PR #15572

**进展解读：**  
该 PR 已关闭，未进入最终合并状态，但其关注点很重要：允许在表级别覆盖 scan planning 行为。这反映出社区正在探索更细粒度的**查询规划策略配置**，尤其适用于不同表负载特征下的读取优化。虽然今天没有形成落地功能，但这是一个明确的路线图信号。

---

### 2.3 文档错误修复 PR 关闭，GCS FileIO 包路径问题被收敛
- **PR #14711** `[CLOSED] Docs: Fix package of iceberg.catalog.io-impl`  
  链接: apache/iceberg PR #14711

**进展解读：**  
修复了 GCSFileIO 文档中的包路径错误。对于 GCP 用户而言，这种“低噪声但高实用”的文档修正能减少接入阶段的误配，属于典型的**生态可用性改进**。

---

### 2.4 与 1.10.x 补丁线相关的回补工作持续推进
- **Issue #15600** `[CLOSED] Backport #15514 for Equality Delete Schema Ordering to 1.10`  
  链接: apache/iceberg Issue #15600
- **Issue #15606** `[CLOSED] Backport Avro 1.12.1 upgrade #14369 to 1.10`  
  链接: apache/iceberg Issue #15606
- **Issue #15599** `[OPEN] Backport #15006 DV merge fix to 1.10.x branch`  
  链接: apache/iceberg Issue #15599

**进展解读：**  
今天最重要的工程信号之一，是 **1.10.2 patch release 的准备动作正在继续**。  
其中：
- Equality Delete schema ordering correctness 修复已推进关闭；
- Avro 1.12.1 升级回补涉及 **CVE-2025-33042**；
- DV merge fix 仍在 open 状态，说明 1.10.x 的补丁打磨尚未完全收尾。  

这意味着下一个 1.10.x 补丁版本大概率会是一个**以正确性和安全修复为主**的版本，而非功能型版本。

---

## 3. 社区热点

以下是今天最值得关注的活跃议题与 PR。

### 热点一：Spark / Arrow / Parquet 向量化读取继续深入，瞄准 RLE 编码页
- **PR #15410** `[OPEN] Spark, Arrow, Parquet: Add vectorized read support for parquet RLE encoded data pages`  
  链接: apache/iceberg PR #15410

**技术诉求分析：**  
这是典型的**读取性能优化**方向。Parquet v2 中 RLE 编码数据页的向量化读取支持，一旦完善，将直接影响 Spark + Arrow 路径上的扫描吞吐、CPU 利用率和解码开销。  
这类 PR 往往不是“表面功能新增”，但对分析型查询场景是高价值改进，尤其对宽表、高压缩比、批量扫描 workloads 更有意义。

---

### 热点二：V4 manifest / 单文件提交能力持续推进，已从基础类型走向读写实现
- **PR #14533** `[OPEN] [WIP] V4 Manifest Read Support`  
  链接: apache/iceberg PR #14533
- **PR #15049** `[OPEN] API, Core: Introduce foundational types for V4 manifest support`  
  链接: apache/iceberg PR #15049
- **PR #15634** `[OPEN] Core, Parquet: Allow for Writing Parquet/Avro Manifests in V4`  
  链接: apache/iceberg PR #15634

**技术诉求分析：**  
这是 Iceberg 当前最清晰的中长期演进主线之一。  
今天的信号说明：
1. V4 manifest 的**基础抽象层**已逐步成型；
2. 社区已开始推进**读取支持**；
3. 同时尝试让 V4 manifest writer 支持 **Parquet / Avro 双格式**。  

这表明 Iceberg 正在为更高效的元数据组织方式做准备，其目标很可能是进一步改善**提交扩展性、元数据访问效率和未来 adaptive metadata tree 能力**。

---

### 热点三：REST Catalog / OpenAPI 正在向批量加载和 staged table credential refresh 扩展
- **PR #15528** `[OPEN] REST Spec: add batch load endpoints for tables and views`  
  链接: apache/iceberg PR #15528
- **PR #15669** `[OPEN] Core: Add batch load endpoints for tables and views`  
  链接: apache/iceberg PR #15669
- **PR #15280** `[OPEN] Add spec support for credential refresh on staged tables`  
  链接: apache/iceberg PR #15280

**技术诉求分析：**  
REST Catalog 正从“基础可用”走向“规模化与云原生友好”：
- batch load endpoints 面向**高延迟 catalog 交互场景**，可减少客户端逐表/逐视图请求的开销；
- staged tables credential refresh 则直指**云对象存储临时凭证刷新**问题，是多租户和受控环境中的现实痛点。  

这说明 Iceberg 社区正加强其作为**统一表格式控制平面**的能力，而不仅是存储格式本身。

---

### 热点四：Kafka Connect 与 CDC / VARIANT / 安全问题仍是连接器热点
- **PR #14797** `[OPEN] Implement Iceberg Kafka Connect with Delta Writer Support in DV Mode for in-batch deduplication`  
  链接: apache/iceberg PR #14797
- **PR #15283** `[OPEN] Kafka Connect: Support VARIANT when record convert`  
  链接: apache/iceberg PR #15283
- **Issue #15621** `[OPEN] Kafka Connect: GHSA-72hv-8253-57qq in jackson-core (shaded in parquet-jackson)`  
  链接: apache/iceberg Issue #15621
- **Issue #13399** `[OPEN] Connector throughput decreased after setting a higher tasks.max`  
  链接: apache/iceberg Issue #13399

**技术诉求分析：**  
Kafka Connect 用户群体的诉求高度集中在三方面：
1. **吞吐与扩展性**：并发提高后吞吐反而下降；
2. **CDC / 去重语义**：DV 模式下 in-batch dedup；
3. **类型系统增强**：VARIANT 支持；
4. **供应链安全**：shaded 依赖中的安全漏洞。  

这说明 Iceberg 在流式摄取端的使用深度正在增加，但生产稳定性和配置经验仍有改进空间。

---

## 4. Bug 与稳定性

以下按影响面和潜在严重程度排序。

### P1：Hive 迁移中 null partition 处理可能导致迁移正确性问题
- **Issue #15332** `[OPEN] [bug] Null partition handling of hive migration`  
  链接: apache/iceberg Issue #15332

**影响：**  
Spark 3.5 + Iceberg 1.10.0 场景下，从 Hive 表迁移到 Iceberg 时，`__HIVE_DEFAULT_PARTITION__` 这类 null 分区值处理可能异常。  
**风险判断：高。** 这类问题会直接影响迁移结果的**数据正确性和分区一致性**。  
**fix PR：** 暂未见明确关联修复 PR。

---

### P1：Flink Connector 在 `USE namespace` 场景出现“静默空读”
- **Issue #15668** `[OPEN] [bug] Flink Iceberg Connector: Table name mismatch causes silent empty reads when using USE namespace`  
  链接: apache/iceberg Issue #15668

**影响：**  
即使显式指定表路径，若 Flink SQL 表名与 Iceberg catalog 表名不一致，也可能出现**无报错但读取为空**的情况。  
**风险判断：高。** “静默空读”比显式失败更危险，容易误导数据校验与作业观测。  
**fix PR：** 暂未见关联修复 PR。

---

### P1：`rewrite_position_delete_files` 遇到列名 `partition` 会失败
- **Issue #14056** `[OPEN] [bug, stale] Cannot run rewrite_position_delete_files on a table that has a column named partition`  
  链接: apache/iceberg Issue #14056

**影响：**  
属于 Spark SQL / 系统过程层面的命名冲突问题。  
**风险判断：中高。** 对依赖维护类 procedure 的用户影响明显，尤其在 delete file 重写和表维护任务中。  
**fix PR：** 暂未见明确 fix。

---

### P2：Spark 中点号列名导致“Ambiguous”歧义
- **Issue #13807** `[OPEN] [bug] "Ambiguous" column name with dot`  
  链接: apache/iceberg Issue #13807

**影响：**  
列名中包含 `.` 时，与嵌套字段解析机制冲突，造成 SQL 兼容性问题。  
**风险判断：中。** 更偏向 SQL 语法边界兼容性，但会影响某些历史表结构迁移和自动建表场景。  
**fix PR：** 暂未见。

---

### P2：SparkSchemaUtil `estimateSize` 估算表大小不准确
- **Issue #15664** `[OPEN] [question] The estimated table size is inaccurate`  
  链接: apache/iceberg Issue #15664

**影响：**  
当前是 question，但直指统计估算逻辑与实际大小偏差较大的问题。  
**风险判断：中。** 本身不一定导致数据错误，但可能影响**计划优化、资源估算和成本判断**。  
**fix PR：** 暂无。

---

### P2：GCS 读取缺少连接/读取超时配置
- **Issue #15587** `[OPEN] [improvement] Add ability to configure connection timeout and read timeout while reading google cloud storage objects in Iceberg`  
  链接: apache/iceberg Issue #15587

**影响：**  
这更像可用性缺陷而非传统 bug，但在网络抖动和跨区域访问场景下会显著影响稳定性。  
**风险判断：中。**  
**fix PR：** 暂未见。

---

### P3：历史问题清理
以下问题今日关闭，但多为 `stale` 收敛，不表示根因已系统性解决：
- **Issue #12590** Delete 未使用 `DELETE_WORKER_POOL`  
  链接: apache/iceberg Issue #12590
- **Issue #13982** S3 URI 含花括号时报 `IllegalArgumentException`  
  链接: apache/iceberg Issue #13982
- **Issue #13995** Kafka Connect coordinator offsets 回退  
  链接: apache/iceberg Issue #13995
- **Issue #13985** 多表+复合主键 Kafka connector 场景  
  链接: apache/iceberg Issue #13985
- **Issue #13959** 更灵活的 branch merge proposal  
  链接: apache/iceberg Issue #13959

**观察：**  
stale 清理提升了 backlog 可管理性，但也提示维护者应注意：某些关闭项所反映的生产场景可能仍在用户环境中存在。

---

## 5. 功能请求与路线图信号

### 5.1 Arrow 与 Iceberg 类型映射文档需求出现
- **Issue #15666** `[OPEN] feature request: arrow to iceberg type mapping`  
  链接: apache/iceberg Issue #15666

**判断：**  
这是一个小需求，但与 Arrow 生态融合趋势一致。若后续与 Spark/Arrow/Parquet 向量化读取工作结合，进入后续文档版本的概率较高。

---

### 5.2 Hive3 + Spark + Iceberg 兼容性仍是实际需求
- **Issue #14082** `[OPEN] Support Hive3 when using Iceberg with Spark`  
  链接: apache/iceberg Issue #14082

**判断：**  
用户核心诉求是 Spark 中 Hive3 相关 jar 的隔离 classloader 机制无法自然适配 Iceberg。  
这类问题实现复杂、跨组件边界重，短期不一定快速落地，但它持续活跃说明**企业混合元数据栈兼容**仍是 Iceberg 采用的重要阻力点。

---

### 5.3 Variant 能力继续向更多引擎和格式层渗透
- **Issue #14707** `[OPEN] Implement VariantVisitor (parquet) to support MERGE INTO operations`  
  链接: apache/iceberg Issue #14707
- **PR #15283** `[OPEN] Kafka Connect: Support VARIANT when record convert`  
  链接: apache/iceberg PR #15283

**判断：**  
Variant 已不再只是“类型实验”，而是在 Parquet 访问路径、MERGE INTO、Kafka Connect 数据转换中逐步落地。  
这很可能是未来几个版本持续推进的方向，尤其适合半结构化数据与 CDC 输入场景。

---

### 5.4 Flink 写入吞吐优化信号明确
- **PR #15433** `[OPEN] Flink: Add passthroughRecords option to DynamicIcebergSink`  
  链接: apache/iceberg PR #15433

**判断：**  
通过 forward edge 替代 hash edge，以减少序列化/反序列化开销，是非常务实的流式性能优化。  
若测试数据充分，这类改动较有希望进入下一版本，因为收益直接、风险相对可控。

---

### 5.5 REST Catalog 正在向规模化管理接口演进
- **PR #15528** `[OPEN] REST Spec: add batch load endpoints for tables and views`  
  链接: apache/iceberg PR #15528
- **PR #15669** `[OPEN] Core: Add batch load endpoints for tables and views`  
  链接: apache/iceberg PR #15669

**判断：**  
Spec 与 Java 实现同时推进，说明这不是孤立提案，而是**高概率纳入未来版本**的能力。  
对于大 catalog、多表批量操作、控制面性能优化而言，这会是重要增强。

---

## 6. 用户反馈摘要

基于今日 Issues，可归纳出几类真实用户痛点：

### 6.1 迁移与兼容性仍是企业落地的首要挑战
- Hive -> Iceberg 迁移中的 null partition 问题  
  链接: apache/iceberg Issue #15332
- Spark + Hive3 classloader 兼容问题  
  链接: apache/iceberg Issue #14082
- Spark 点号列名歧义  
  链接: apache/iceberg Issue #13807

**结论：**  
用户并不只是“新建 Iceberg 表”，而是在处理**遗留 Hive 元数据、历史字段命名、混合 SQL 运行时**。这要求 Iceberg 在迁移工具和边界兼容性上继续强化。

---

### 6.2 流式摄取用户关注的不只是功能，更是吞吐、正确性和隐性失败
- Kafka Connect 提高 `tasks.max` 后吞吐下降  
  链接: apache/iceberg Issue #13399
- Flink 连接器表名不匹配导致静默空读  
  链接: apache/iceberg Issue #15668
- Kafka Connect 安全漏洞关注  
  链接: apache/iceberg Issue #15621

**结论：**  
流式用户的痛点集中在：
- 配置增加后性能为何不升反降；
- connector 是否存在 silent failure；
- 依赖安全是否可控。  
这说明连接器已进入更严肃的生产使用阶段。

---

### 6.3 云对象存储场景要求更强的网络与凭证控制
- GCS 读取 timeout 可配置诉求  
  链接: apache/iceberg Issue #15587
- staged tables credential refresh spec  
  链接: apache/iceberg PR #15280

**结论：**  
云环境用户希望 Iceberg 从“能访问对象存储”进一步升级为“能精细控制对象存储交互行为”，包括超时、凭证刷新、临时授权等。

---

### 6.4 元数据与统计估算能力开始被更细致审视
- 表大小估算不准确  
  链接: apache/iceberg Issue #15664
- DV validation 增加 manifest partition pruning  
  链接: apache/iceberg PR #15653

**结论：**  
用户和开发者已经从“基本功能可用”转向关注**元数据处理效率、提交性能、统计精度**，这通常是项目成熟度提升的表现。

---

## 7. 待处理积压

以下长期未解决但仍具价值的 Issue / PR，建议维护者持续关注：

### 7.1 Materialized View 规范与实现推进缓慢
- **PR #11041** `[OPEN] Materialized View Spec`  
  链接: apache/iceberg PR #11041
- **PR #15000** `[CLOSED] [WIP] Materialized View Spec Implementation`  
  链接: apache/iceberg PR #15000

**提醒：**  
物化视图是 Iceberg 进一步向更完整湖仓语义迈进的重要能力。规范仍 open，但实现 PR 已关闭，说明从 spec 到工程落地仍存在鸿沟。

---

### 7.2 V4 Manifest 是主线，但仍处于多 PR 并行推进阶段
- **PR #14533** `[OPEN] V4 Manifest Read Support`  
  链接: apache/iceberg PR #14533
- **PR #15049** `[OPEN] foundational types for V4 manifest support`  
  链接: apache/iceberg PR #15049
- **PR #15634** `[OPEN] Writing Parquet/Avro Manifests in V4`  
  链接: apache/iceberg PR #15634

**提醒：**  
这些 PR 显示方向明确，但拆分较多、周期较长。建议保持设计一致性，避免接口抽象在多轮迭代中固化过早。

---

### 7.3 Kafka Connect 吞吐与 CDC/DV 语义仍有较多未决项
- **Issue #13399** throughput decreased after higher `tasks.max`  
  链接: apache/iceberg Issue #13399
- **PR #14797** Delta Writer Support in DV Mode for in-batch deduplication  
  链接: apache/iceberg PR #14797

**提醒：**  
这是连接器生产采用的核心问题，建议提升优先级。因为这类问题对最终用户的感知往往比底层格式增强更直接。

---

### 7.4 Spark/Flink SQL 边界兼容问题不应长期 stale 化
- **Issue #14056** `partition` 列名导致 procedure 失败  
  链接: apache/iceberg Issue #14056
- **Issue #13807** 点号列名歧义  
  链接: apache/iceberg Issue #13807
- **Issue #14082** Spark 使用 Iceberg 时支持 Hive3  
  链接: apache/iceberg Issue #14082

**提醒：**  
这些问题虽不一定影响所有用户，但一旦命中往往会阻塞落地，属于“边界兼容性高痛点”问题。

---

## 8. 总结判断

今天的 Iceberg 项目动态可以概括为一句话：**“没有版本发布，但底层能力在稳步前进，尤其是 V4 manifest、REST Catalog 扩展与多引擎性能/兼容性修复。”**  
从仓库活动看，社区当前最强的开发信号是：
1. **元数据层演进**：V4 manifest 与单文件提交链路持续推进；
2. **控制面增强**：REST/OpenAPI 向批量接口和凭证刷新扩展；
3. **执行层优化**：Spark/Flink/Kafka Connect 持续补齐性能和兼容性；
4. **补丁版本准备**：1.10.x 正在围绕正确性和安全问题进行回补。  

需要继续观察的风险点是：**流式连接器稳定性、Hive/Spark 迁移兼容、以及若干“silent failure / correctness”类问题是否能快速获得 fix PR。**

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-18）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区保持了较高活跃度：共有 **2 条 Issue 更新**、**21 条 PR 更新**，其中 **15 条仍待合并**、**6 条已合并或关闭**。  
从变更内容看，今日开发重心明显集中在 **Kernel 能力增强、DSv2 写入链路、Spark/Kernel 一致性修复、以及 SQL/表特性扩展**。  
稳定性方面，社区新暴露出一个较明确的 **查询正确性/数据跳过（data skipping）大小写匹配缺陷**，这属于协议一致性问题，值得优先关注。  
整体判断：**项目健康度良好、研发节奏偏快，且当前路线图明显偏向 Kernel 抽象层与 Spark V2 连接器演进**。

---

## 3. 项目进展

### 已关闭/合并的重要 PR

#### 1) 修复 Spark MicroBatch 流式资源泄漏风险
- **PR:** #6297 `[kernel-spark] Fix a potential resource leak in SparkMicroBatchStream`
- **状态:** Closed
- **链接:** delta-io/delta PR #6297

这项改动聚焦于 **Structured Streaming / MicroBatch** 路径下的资源管理问题。虽然摘要未展开实现细节，但从标题可判断，其目标是消除 `SparkMicroBatchStream` 中潜在的资源泄漏。  
这类修复通常直接影响：
- 长时间运行的流式作业稳定性
- executor / driver 资源占用
- checkpoint 与 snapshot 生命周期管理的可靠性

**意义：** 对生产环境的流式读取稳定性有正向价值，尤其适合高频增量消费场景。

---

#### 2) MapType Collation 限制收敛
- **PR:** #5884 `[KERNEL][5881] Disable creating MapType with non-SPARK.UTF8_BINARY collated key`
- **状态:** Closed
- **链接:** delta-io/delta PR #5884

该 PR 关闭意味着 Kernel 在 **带排序规则（collation）语义的数据类型约束** 上继续收紧。  
核心方向是：**禁止创建 key 使用非 `SPARK.UTF8_BINARY` 排序规则的 `MapType`**。这实际上是在防止：
- 不同执行引擎对 Map key 比较/哈希规则解释不一致
- 跨引擎读写时出现 schema 语义漂移
- 查询正确性与兼容性问题

**意义：** 这是典型的 **规范先行、避免隐式不兼容** 的修复，对多引擎互操作尤其重要。

---

#### 3) 非 Spark session catalog 的 stagingCatalog 扩展完成收口
- **PR:** #6166 `[Delta-Spark] Extend stagingCatalog for non-Spark session catalog`
- **状态:** Closed
- **链接:** delta-io/delta PR #6166

该 PR 指向 Delta Spark 对 **catalog 体系兼容性** 的扩展，尤其是非默认 Spark session catalog 场景。  
这通常会影响：
- RTAS / CTAS / replace table 等 DDL/DML 组合路径
- 多 catalog 环境中的事务路由
- SQL 引擎集成层的一致性

**意义：** 对接企业级 catalog 部署、外部元数据系统以及复杂 SQL 工作负载更友好，是 SQL 兼容性和部署灵活性的重要推进。

---

#### 4) NullType 校验进一步覆盖 UDT
- **PR:** #6299 `[Spark] Check NullType inside UDTs`
- **状态:** Closed
- **链接:** delta-io/delta PR #6299

这是对先前 schema 校验逻辑的补强：将 **NullType 检查扩展到 UDT（User Defined Types）内部**。  
这类修复通常用于防止：
- 流式 schema 推断或写入时遗漏非法类型
- 嵌套类型路径下的运行时失败
- 线上作业在序列化/反序列化阶段出现难定位错误

**意义：** 属于 **查询/写入正确性防线加固**，特别利好复杂 schema 和流式作业。

---

#### 5) 两个实验性 Kernel PR 被关闭，显示方案仍在快速迭代
- **PR:** #6303 `[Experimental] [Kernel] Add case-insensitive column name normalization on write path`
- **状态:** Closed
- **链接:** delta-io/delta PR #6303

- **PR:** #6302 `[Experimental] [Kernel] Add type widening metadata removal and query methods`
- **状态:** Closed
- **链接:** delta-io/delta PR #6302

这两项虽然未进入合并态，但释放出重要信号：
- 社区正在推进 **大小写不敏感列名归一化**
- 社区正在治理 **type widening 元数据** 的检查与清理

**意义：** 虽然 PR 本身关闭，但问题域与方向仍然是下一阶段 Kernel 元数据治理的重点。

---

### 仍在推进中的重点 PR

#### DSv2 写入链路持续成型
- **PR:** #6230 `[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage`
- **链接:** delta-io/delta PR #6230

这是今日最具路线图意义的 PR 之一，代表 Delta 在 **Spark DataSource V2 写路径** 上继续深入。  
如果后续合并，将推进：
- executor 端写入协议标准化
- commit message 结构化
- V2 connector 端到端写入能力完善

---

#### V2 connector 开始覆盖 OPTIMIZE 冲突解决
- **PR:** #6307 `[Experimental] Add OPTIMIZE conflict resolution and E2E SQL support for V2 connector`
- **链接:** delta-io/delta PR #6307

此 PR 非常关键，已不只是“能运行”，而是在处理 **OPTIMIZE 与事务冲突检测**。  
其摘要显示引入了：
- delete-read / delete-delete 冲突检测
- `RemoveFile` 纳入冲突判断 schema
- V2 connector 的 E2E SQL 支持

**意义：** 这说明 V2 connector 正从基础可用迈向 **事务正确性与维护型命令支持**。

---

#### Kernel 表特性持续扩张
- **PR:** #5718 `[KERNEL] Add collations table feature`
- **链接:** delta-io/delta PR #5718

- **PR:** #6235 `[KERNEL] Add GeoSpatial Table feature`
- **链接:** delta-io/delta PR #6235

- **PR:** #6301 `[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings`
- **链接:** delta-io/delta PR #6301

这些 PR 一起表明，Delta Kernel 正在扩展到更丰富的表能力：
- **排序规则 / collations**
- **地理空间类型**
- **地理空间统计信息解析**

**意义：** 这是典型的平台化信号，显示 Delta 试图支持更广泛的分析场景，而不仅限于传统数值/字符串分析表。

---

## 4. 社区热点

> 说明：当前提供的数据里 PR 评论数均为 `undefined`，无法严格按评论量排序，因此以下按“技术影响范围”和“当日关注度”综合判断。

### 热点 1：Java Kernel 的 data skipping 大小写匹配 Bug
- **Issue:** #6247 `[bug, good first issue] fix: Java Kernel data skipping uses case-sensitive column matching`
- **链接:** delta-io/delta Issue #6247

这是今日最值得关注的 Issue。  
用户指出：**Delta 协议规定列名应大小写不敏感，但 Java Kernel 在 data skipping 谓词列解析时使用了区分大小写的匹配**。  
技术诉求非常明确：
- Kernel 实现需要与协议规范一致
- Kernel 行为需要与 Delta Spark 保持一致
- 避免因为列名大小写差异导致统计裁剪失效甚至查询结果路径偏差

**背后诉求：** 用户希望 Kernel 成为真正可依赖的跨引擎实现，而不是在边界语义上与 Spark 分叉。

---

### 热点 2：TSC 成员信息透明度
- **Issue:** #6219 `Where is the current Delta Lake TSC membership listed?`
- **链接:** delta-io/delta Issue #6219

这不是代码 Bug，但反映出社区治理层面的需求：  
用户无法找到 **当前 Delta Lake Technical Steering Committee 成员名单**。  
这说明项目在工程上活跃，但在治理公开性上仍有可改进空间。

**背后诉求：**
- 开源治理透明化
- 贡献者了解决策结构
- 企业用户评估项目中立性与长期演进稳定性

---

### 热点 3：DSv2 / kernel-spark 重构与迁移仍在快速推进
- **PR:** #6308 `[DO_NOT_MERGE][kernel-spark] Refactor delta source metadata tracking log for DSv2`
- **链接:** delta-io/delta PR #6308

- **PR:** #6294 `[kernel-spark] Migrate DeltaSourceDeletionVectorsSuite to v2`
- **链接:** delta-io/delta PR #6294

- **PR:** #6298 `[kernel-spark] E2E tests on all data loss scenarios during initial snapshot`
- **链接:** delta-io/delta PR #6298

这些 PR 共同表明，`kernel-spark` 与 DSv2 迁移不只是接口改造，还在补：
- 元数据追踪
- deletion vectors 相关测试迁移
- 初始 snapshot 数据丢失场景的 E2E 覆盖

**背后诉求：** 社区正在确保新架构不牺牲流式语义与容错能力。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：Java Kernel 数据跳过列名匹配大小写错误
- **Issue:** #6247
- **状态:** Open
- **标签:** `bug`, `good first issue`
- **链接:** delta-io/delta Issue #6247

**问题类型：** 查询优化/正确性风险  
**影响范围：**
- data skipping 谓词解析
- 大小写不一致 schema 场景
- Kernel 与 Spark 行为一致性

**风险判断：**
- 若仅导致跳过失效，则是性能退化
- 若某些路径上解析错误影响过滤行为，则可能上升为结果正确性问题

**是否已有 fix PR：**
- 当前未看到直接关联 fix PR
- 但关闭的实验性 PR #6303（写路径大小写归一化）说明社区已在处理相近问题域  
  链接：delta-io/delta PR #6303

---

### P2：SparkMicroBatchStream 潜在资源泄漏
- **PR:** #6297
- **状态:** Closed
- **链接:** delta-io/delta PR #6297

**问题类型：** 稳定性 / 资源管理  
**影响范围：**
- 长生命周期流式任务
- 微批调度下资源回收
- 可能引起句柄/内存/迭代器泄漏

**是否已有修复：**
- 是，相关修复 PR 已关闭收口，需后续观察是否已合入主线或被替代

---

### P2：UDT 内部 NullType 校验遗漏
- **PR:** #6299
- **状态:** Closed
- **链接:** delta-io/delta PR #6299

**问题类型：** schema 正确性校验缺口  
**影响范围：**
- 流式写入
- 自定义类型场景
- 嵌套 schema 校验

**是否已有修复：**
- 是，PR 已关闭，表明该问题已得到处理或被后续变更吸收

---

### P2：MapType key collation 语义可能导致兼容性问题
- **PR:** #5884
- **状态:** Closed
- **链接:** delta-io/delta PR #5884

**问题类型：** 类型系统约束 / 跨引擎兼容性  
**影响范围：**
- 带 collation 的 MapType
- Kernel/Spark 语义一致性
- 复杂 schema 表定义

**是否已有修复：**
- 是，通过限制非法创建路径来规避问题

---

## 6. 功能请求与路线图信号

### 1) 地理空间能力很可能进入后续版本重点
- **PR:** #6235 `[KERNEL] Add GeoSpatial Table feature`
- **链接:** delta-io/delta PR #6235
- **PR:** #6301 `[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings`
- **链接:** delta-io/delta PR #6301

虽然没有用户 Issue 直接提出 geospatial 需求，但连续两个 PR 已覆盖：
- 表特性声明
- 统计信息解析

这通常意味着该功能已进入较实质实现阶段，**很可能成为下一阶段重要特性之一**。

---

### 2) Collations 支持处于持续推进状态
- **PR:** #5718 `[KERNEL] Add collations table feature`
- **链接:** delta-io/delta PR #5718
- **PR:** #5884 `[KERNEL][5881] Disable creating MapType with non-SPARK.UTF8_BINARY collated key`
- **链接:** delta-io/delta PR #5884

一边在加表特性，一边在补约束，说明 collations 不是概念验证，而是在向可落地方向推进。  
**判断：** 该能力有较高概率进入未来版本，但在正式发布前仍需更多兼容性限制与测试补齐。

---

### 3) DSv2 / V2 connector 是当前最明确的主线工程
- **PR:** #6230 `[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage`
- **链接:** delta-io/delta PR #6230
- **PR:** #6307 `[Experimental] Add OPTIMIZE conflict resolution and E2E SQL support for V2 connector`
- **链接:** delta-io/delta PR #6307
- **PR:** #6308 `[DO_NOT_MERGE][kernel-spark] Refactor delta source metadata tracking log for DSv2`
- **链接:** delta-io/delta PR #6308

这些 PR 贯穿写入、事务冲突、元数据跟踪，说明 **DSv2 已从局部开发进入体系化推进阶段**。  
**判断：** 这大概率会成为后续版本最核心的演进方向之一。

---

### 4) 目录治理与表属性暴露边界也在被重视
- **PR:** #6300 `Block options.fs.* from being rendered with show/describe table properties`
- **链接:** delta-io/delta PR #6300

这属于产品化细节优化，关注点是：
- 用户可见属性与底层存储参数隔离
- 避免泄露内部/敏感配置
- 提升 SQL 层表元数据展示的可用性

**判断：** 不算旗舰功能，但很可能较快进入版本，因为风险小、收益明确。

---

## 7. 用户反馈摘要

### 1) 用户对协议一致性非常敏感
- **来源:** #6247
- **链接:** delta-io/delta Issue #6247

用户明确引用 Delta 协议中“列名大小写不敏感”的要求，并指出 Java Kernel 未遵守。  
这说明真实用户已不再只关注“能不能跑”，而是在验证：
- Kernel 是否真正符合协议
- Spark 与 Kernel 是否行为一致
- 优化器路径是否也遵守规范

**用户痛点：** 同一张表在不同引擎/实现下行为不一致，会增加上线风险与排查成本。

---

### 2) 社区用户开始关心治理透明度，而不只是技术功能
- **来源:** #6219
- **链接:** delta-io/delta Issue #6219

用户寻找 TSC 成员名单未果，说明 Delta 已进入更成熟的项目阶段：  
企业和团队不仅评估技术能力，也评估：
- 决策机制
- 治理公开性
- 长期演进可预期性

**用户痛点：** 文档和治理信息不易获取，不利于企业采用决策。

---

## 8. 待处理积压

### 1) Collations 表特性 PR 持续悬而未决
- **PR:** #5718 `[KERNEL] Add collations table feature`
- **创建时间:** 2025-12-17
- **当前状态:** Open
- **链接:** delta-io/delta PR #5718

这是一个跨越数月仍未合并的重要 PR，且与近期 collation 相关限制 PR 有明显关联。  
**建议维护者关注：**
- 是否需要拆分为更小粒度 PR
- 是否存在协议或 Spark 兼容性分歧未决
- 是否需要补充更多跨引擎测试矩阵

---

### 2) GeoSpatial 功能尚在成型，需避免长期停留在特性枝干
- **PR:** #6235 `[KERNEL] Add GeoSpatial Table feature`
- **链接:** delta-io/delta PR #6235

地理空间是高价值方向，但也最容易因协议、序列化、统计信息、跨语言支持复杂而拖长周期。  
**建议维护者关注：**
- feature flag 范围界定
- stats 与 predicate pushdown 的兼容策略
- Spark/Kernel/未来其他连接器的统一表达

---

### 3) DSv2 写入与 V2 connector 多个 stacked PR 并行，需控制合并复杂度
- **PR:** #6230
- **链接:** delta-io/delta PR #6230
- **PR:** #6307
- **链接:** delta-io/delta PR #6307
- **PR:** #6308
- **链接:** delta-io/delta PR #6308

这些 PR 相互关联度高，若长期并行不收敛，容易导致：
- review 成本攀升
- rebase 冲突频繁
- 设计讨论分散

**建议维护者关注：**
- 明确 stack 合并顺序
- 尽快冻结关键接口
- 为 V2 connector 建立更清晰的阶段性里程碑

---

## 总结判断

今天的 Delta Lake 呈现出非常清晰的工程画像：  
一方面，**Kernel、DSv2、V2 connector、表特性扩展** 正在快速推进，说明项目仍处于强功能建设周期；另一方面，**大小写语义、类型系统约束、流式资源管理** 等问题也提醒我们，跨引擎协议一致性仍是当前最关键的质量主题。  

如果按版本信号判断，**DSv2 写入链路、V2 connector 事务能力、collations、geospatial、以及 Kernel 元数据校验增强**，最值得持续跟踪。

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合发群的 1 分钟简版**  
2. **适合周报汇总的表格版**  
3. **按“Spark / Kernel / CI / Governance”分栏版**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

以下为 **Velox 2026-03-18 项目动态日报**。

---

# Velox 项目日报 · 2026-03-18

## 1. 今日速览

过去 24 小时 Velox 保持了**较高活跃度**：Issues 更新 4 条、PR 更新 46 条，说明核心开发仍集中在功能扩展、兼容性修复和基础设施演进上。  
从变更主题看，今日重点集中在 **RPC 框架建设、Parquet/DWRF 存储层修复、Spark SQL 兼容性提升、Hive/Iceberg 连接器能力增强**。  
稳定性方面，新报告的问题不算多，但出现了 **日期格式语义偏差** 与 **Debug 构建下 JITIFY 退出崩溃**，其中前者已迅速出现对应修复 PR，响应较快。  
整体来看，项目健康度较好：**开发节奏快、问题到修复链路短**，但仍有若干长期 PR 和基础设施类改造在积压，后续需要维护者持续推进。

---

## 2. 项目进展

### 今日已关闭/推进的重要 PR

> 注：过去 24 小时 PR 更新 46 条，其中已合并/关闭 13 条；当前给定数据中明确展示到的“已关闭”重点项如下。

#### 2.1 cudf Round Robin 分区能力尝试被关闭
- **PR #14641** `[CLOSED] feat(cudf): Add ROUND ROBIN ROW to cudfLocalPartition`  
  链接: facebookincubator/velox PR #14641

这项工作原本尝试为 GPU 路径下的 `cudfLocalPartition` 增加 **ROUND ROBIN ROW** 分区方式，以对齐 Velox/执行计划中的已有分区能力。该 PR 最终被关闭，表明：
- cudf 方向的算子能力扩展仍在推进，但并非所有设计都进入主干；
- GPU 执行路径与 CPU 主路径在功能对齐上依然存在筛选和取舍；
- 这类功能更可能在 CI、可维护性、接口稳定性确认后重新提交。

#### 2.2 构建失败 Issue 已关闭，说明修复响应及时
- **Issue #16785** `[CLOSED] Build failing with undefined reference ... registerArraySplitIntoChunksFunctions(...)`  
  链接: facebookincubator/velox Issue #16785

虽然这是 Issue 而非 PR，但其关闭意味着一次 **构建/链接回归** 已被处理。对数据库内核项目而言，构建稳定性是 CI 可信度的底线，这类问题被快速收敛是积极信号。

---

### 今日值得关注的在途 PR

这些 PR 虽未合并，但代表了近期 Velox 的主要演进方向：

#### 2.3 RPC 框架进入连续落地阶段
- **PR #16792** `feat(rpc): Add unit tests and reference implementation for RPC framework [4/8]`  
  链接: facebookincubator/velox PR #16792
- **PR #16793** `feat(rpc): Add RPC function stubs for sidecar discovery [5/8]`  
  链接: facebookincubator/velox PR #16793

这是一组明显的系列化提交，说明 Velox 正在推进 **RPC function / sidecar discovery / async execution contract**。  
从摘要看，已经包含：
- AsyncRPCFunction 参考实现；
- 单元测试；
- sidecar 中函数发现机制；
- Java 协调层可见的函数注册接口。

这意味着 Velox 未来可能支持更丰富的 **外部函数调用、远程执行扩展、服务化 UDF/算子能力**，对大规模查询系统的扩展性很关键。

#### 2.4 Iceberg 连接器继续补全写路径能力
- **PR #16761** `feat: Add positional update support for Velox Iceberg connector`  
  链接: facebookincubator/velox PR #16761

该 PR 为 Iceberg connector 增加 **merge-on-read positional update** 支持，属于数据湖表格式语义的重要补齐。  
这说明 Velox 不再只停留在读取/删除支持，而是在逐步增强：
- Iceberg 行级变更能力；
- MoR 场景下的更新语义；
- 更完整的湖仓执行引擎适配。

#### 2.5 Hive 索引读取抽象进一步模块化
- **PR #16803** `refactor(hive): Add pluggable index reader support`  
  链接: facebookincubator/velox PR #16803

该 PR 将 HiveIndexSource 重构为 **可插拔 index reader** 架构。  
这对 OLAP 引擎非常重要，因为它意味着：
- 不同存储格式的索引读取逻辑可插拔；
- 格式相关 IO 与格式无关调度解耦；
- 后续接入新索引格式/新文件格式的工程成本降低。

#### 2.6 存储层正确性与性能修复持续活跃
- **PR #16800** `fix(dwrf): Fix dangling StringView keys in FlatMapColumnWriter`  
  链接: facebookincubator/velox PR #16800
- **PR #16744** `fix: Parquet-1.8.1 column meta min/max order use signed format...`  
  链接: facebookincubator/velox PR #16744
- **PR #16789** `feat: Add custom Parquet read support for Spark TimestampNTZ Type`  
  链接: facebookincubator/velox PR #16789
- **PR #16217** `feat(parquet): Support read TIME_MILLIS parquet type`  
  链接: facebookincubator/velox PR #16217

这些 PR 共同反映出 Velox 当前在存储适配层的重点：
- 修复 DWRF 写路径中的悬垂引用风险；
- 对齐旧版本 Parquet 元数据排序语义；
- 增强对 Spark 自定义 Parquet 语义的兼容；
- 补齐 Parquet 逻辑类型读取能力。

#### 2.7 UDF 与执行性能持续打磨
- **PR #16811** `Optimize map_except UDF for reduced BCU`  
  链接: facebookincubator/velox PR #16811
- **PR #16653** `perf(operator): Add MarkSorted performance optimizations`  
  链接: facebookincubator/velox PR #16653
- **PR #16498** `feat: Add vector_sum aggregate function using Simple API`  
  链接: facebookincubator/velox PR #16498

可以看到一条清晰主线：Velox 一边补齐 SQL/函数能力，一边持续优化算子成本与批处理性能。

---

## 3. 社区热点

### 3.1 RPC 框架系列 PR
- **PR #16792**  
  链接: facebookincubator/velox PR #16792
- **PR #16793**  
  链接: facebookincubator/velox PR #16793

这是今天最值得关注的技术热点。尽管提供的数据中评论数未给出，但从提交组织方式 `[4/8]`、`[5/8]` 来看，属于较大设计分阶段落地。  
**背后的技术诉求**：
- 将 Velox 从“本地执行引擎”扩展到支持更灵活的远程函数/服务化能力；
- 满足异步、高延迟外部调用的执行模型；
- 与上层协调器、sidecar、函数注册服务打通。

这类能力对云原生查询引擎、AI/向量函数外部化、跨进程 UDF 都有潜在价值。

---

### 3.2 SQL 日期格式兼容性修复
- **Issue #16806** `[OPEN] Velox from_unixtime YYYY date format get diff result with spark`  
  链接: facebookincubator/velox Issue #16806
- **PR #16807** `[OPEN] fix: Velox support iso week year format`  
  链接: facebookincubator/velox PR #16807

这是典型的“**查询结果正确性 + Spark 兼容性**”热点。  
问题在于 `YYYY` 被 Spark 按 **ISO WeekYear** 解释，而 Velox 当前结果与 Spark 不一致，直接导致日期计算出现年份偏差。  
技术诉求非常明确：
- Velox 需要在 SQL 日期/时间格式化行为上对齐 Spark 生态；
- 对于已存在大量 Spark SQL 作业迁移的用户，这类语义差异属于高优先级兼容问题。

好消息是，当天就有对应修复 PR，说明社区对兼容性问题非常敏感。

---

### 3.3 构建体系与依赖演进
- **PR #16019** `build: Use FBThrift instead of Apache Thrift`  
  链接: facebookincubator/velox PR #16019
- **Issue #16785** `[CLOSED] Build failing with undefined reference ...`  
  链接: facebookincubator/velox Issue #16785
- **PR #16784** `chore(ci): Cleanup CI job and switch some deps to wget`  
  链接: facebookincubator/velox PR #16784

这组变化体现出 Velox 正在持续处理 **构建依赖收敛、CI 稳定性、第三方库切换**。  
背后诉求包括：
- 降低外部依赖复杂度；
- 提升 CI 执行效率；
- 减少依赖冲突和链接问题；
- 为更大规模功能演进铺平工程基础。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### 严重级：Debug 构建下 JITIFY 退出崩溃
- **Issue #16707** `[OPEN] JITIFY crash on test/benchmark app exit if built Debug`  
  链接: facebookincubator/velox Issue #16707

**影响**：
- 命令行测试/benchmark 程序在退出时崩溃；
- 条件是 Debug 构建且启用 `jitExpressionEnabled = true`；
- 虽不一定影响生产 Release，但会显著影响开发调试体验、CI debug 诊断与 GPU/JIT 相关特性验证。

**当前状态**：
- 仍为 Open；
- 当前数据中**未看到直接对应 fix PR**。

**判断**：
- 属于开发者/测试环境高优先级问题；
- 若 Velox 持续加强 cudf/JIT 路径，此问题需要尽快收敛。

---

### 高优先级：日期格式化结果与 Spark 不一致
- **Issue #16806** `[OPEN] Velox from_unixtime YYYY date format get diff result with spark`  
  链接: facebookincubator/velox Issue #16806
- **PR #16807** `[OPEN] fix: Velox support iso week year format`  
  链接: facebookincubator/velox PR #16807

**影响**：
- 直接导致 SQL 查询结果错误；
- 用户可感知，且会影响与 Spark 的结果对账；
- 尤其在年末/跨周场景中容易触发。

**状态**：
- 已有对应修复 PR，响应非常快。

**判断**：
- 属于典型高优先级兼容性正确性问题；
- 若 PR 顺利合入，风险可快速解除。

---

### 中优先级：构建链接失败
- **Issue #16785** `[CLOSED] Build failing with undefined reference ...`  
  链接: facebookincubator/velox Issue #16785

**影响**：
- 影响构建成功率和 CI 稳定性；
- 不属于运行时数据错误，但会阻塞贡献者和测试流水线。

**状态**：
- 已关闭，说明问题已被处理。

---

### 中优先级：DWRF 写路径潜在内存安全问题
- **PR #16800** `[OPEN] fix(dwrf): Fix dangling StringView keys in FlatMapColumnWriter`  
  链接: facebookincubator/velox PR #16800

**问题性质**：
- `StringView` 非 owning，批次释放后 key 可能悬空；
- 在 rehash 期间可能访问已释放内存。

**影响**：
- 潜在崩溃、错误哈希、写出不稳定；
- 一旦触发属于较严重底层正确性/稳定性问题。

**状态**：
- 修复 PR 已提交，但尚未合并。

---

### 中优先级：Parquet 旧版本统计排序语义兼容
- **PR #16744** `[OPEN] fix: Parquet-1.8.1 column meta min/max order use signed format...`  
  链接: facebookincubator/velox PR #16744

**影响**：
- 可能影响 min/max 元数据解释；
- 进一步影响 predicate pushdown、裁剪效果甚至结果正确性判断。

**状态**：
- 已有修复 PR。

---

## 5. 功能请求与路线图信号

### 5.1 Spark 兼容性仍是显著路线
- **Issue #16806** / **PR #16807**  
  链接: facebookincubator/velox Issue #16806  
  链接: facebookincubator/velox PR #16807
- **PR #16789** `Add custom Parquet read support for Spark TimestampNTZ Type`  
  链接: facebookincubator/velox PR #16789

这表明 Velox 继续向 **Spark SQL 语义兼容层** 靠拢，重点包括：
- 时间格式化；
- TimestampNTZ 等 Spark 特有 Parquet 表示；
- 查询结果对齐。

**判断**：这些内容很可能被纳入下一批兼容性更新，优先级较高。

---

### 5.2 湖仓连接器能力持续扩展
- **PR #16761** `Add positional update support for Velox Iceberg connector`  
  链接: facebookincubator/velox PR #16761
- **PR #16803** `Add pluggable index reader support`  
  链接: facebookincubator/velox PR #16803

这反映出路线图上明显在补齐：
- Iceberg 的更新/删除语义；
- Hive/文件格式索引读取抽象；
- 更强的数据湖执行适配能力。

**判断**：这类能力属于平台级演进，进入后会显著增强 Velox 作为底层执行引擎的通用性。

---

### 5.3 新函数与向量化 API 仍在扩张
- **PR #16498** `Add vector_sum aggregate function using Simple API`  
  链接: facebookincubator/velox PR #16498
- **PR #16811** `Optimize map_except UDF for reduced BCU`  
  链接: facebookincubator/velox PR #16811

这说明 Velox 不仅在补功能，还在推动：
- 向量/数组类分析函数；
- UDF 性能优化；
- 以 Simple API 提升函数开发效率。

**判断**：数组、map、向量聚合函数仍会是未来版本的重要增长点。

---

### 5.4 外部函数/RPC 扩展可能成为新能力方向
- **PR #16792** / **PR #16793**  
  链接: facebookincubator/velox PR #16792  
  链接: facebookincubator/velox PR #16793

这是今天最明显的路线图信号之一。  
如果该系列顺利推进，Velox 未来可能具备：
- 远程 UDF 调用；
- sidecar 函数注册与发现；
- 异步 RPC 执行模型。

这对云服务化部署模式很关键，值得持续跟踪。

---

## 6. 用户反馈摘要

### 6.1 用户最敏感的是“结果是否与 Spark 一致”
- **Issue #16806**  
  链接: facebookincubator/velox Issue #16806

真实痛点非常直接：同一 SQL 在 Spark 与 Velox 上结果不同。  
这类反馈通常来自：
- Spark SQL 作业迁移；
- 混合引擎结果校验；
- BI/ETL 场景的时间格式化输出。

说明 Velox 用户不仅关注性能，更关注 **跨引擎语义一致性**。

---

### 6.2 开发者对 Debug/测试稳定性有明显诉求
- **Issue #16707**  
  链接: facebookincubator/velox Issue #16707
- **Issue #16785**  
  链接: facebookincubator/velox Issue #16785

从反馈看，Debug 构建退出崩溃、链接失败等问题会直接打断开发与验证流程。  
这说明当前用户群体中仍有相当比例是：
- 内核开发者；
- 集成方工程师；
- 做功能验证、benchmark 与二次开发的技术团队。

---

### 6.3 文档与生态链接也会影响用户信任感
- **Issue #16804** `[OPEN] Update Apache Gluten URL after TLP graduation`  
  链接: facebookincubator/velox Issue #16804

虽然不是代码 Bug，但说明用户在意：
- 官方文档是否仍指向正确生态项目；
- Velox 与 Apache Gluten 等上层项目的关系是否清晰；
- 项目主页是否保持最新状态。

这属于生态成熟度信号，建议尽快处理。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期未决项：

### 7.1 FBThrift 替换 Apache Thrift 的大型构建改造
- **PR #16019** `[OPEN] build: Use FBThrift instead of Apache Thrift`  
  创建: 2026-01-14  
  链接: facebookincubator/velox PR #16019

这是较长期、影响面很大的基础设施 PR。  
它涉及：
- Parquet 相关 thrift 依赖；
- API 不兼容处理；
- 构建环境统一。

**风险**：长期悬而未决容易导致后续依赖治理继续复杂化。  
**建议**：维护者应明确是否拆分、缩小范围或给出合入标准。

---

### 7.2 Parquet decimal 精度/scale 写入修复长期挂起
- **PR #12846** `[OPEN] fix(parquet): Fix inserting decimal type values precision and scale`  
  创建: 2025-03-29  
  链接: facebookincubator/velox PR #12846

这是非常老的 PR，且涉及 Parquet decimal 正确性。  
**风险**：
- 一旦问题仍存在，会影响数据互操作；
- decimal 是金融、报表、精确分析的重要类型，不宜长期悬置。

---

### 7.3 cudf 测试纳入 CI 仍未落地
- **PR #15700** `[OPEN] feat(cudf): Run tests in CI`  
  创建: 2025-12-04  
  链接: facebookincubator/velox PR #15700

如果 GPU/cudf 能力要持续发展，CI 覆盖是基本保障。  
**建议**：尽快明确资源限制、测试矩阵和最小可行接入方案。

---

### 7.4 Parquet TIME_MILLIS 支持已 ready-to-merge，但尚未合入
- **PR #16217** `[OPEN, ready-to-merge] feat(parquet): Support read TIME_MILLIS parquet type`  
  创建: 2026-02-03  
  链接: facebookincubator/velox PR #16217

该 PR 已具备较高成熟度标记。  
**建议**：若无额外 blocker，应尽快处理，避免 ready-to-merge 长时间停留。

---

### 7.5 文档博客类 PR 可快速释放社区价值
- **PR #16764** `[OPEN, ready-to-merge] docs: Add blog post of processing unicode with SIMD`  
  链接: facebookincubator/velox PR #16764

虽然不是核心功能，但这类内容能帮助外部用户理解 Velox 的 SIMD 优化实践，提升项目传播和开发者吸引力。建议加快处理。

---

## 8. 结论

今天的 Velox 呈现出典型的“**高强度内核开发日**”特征：  
- 功能面上，**RPC 框架、Iceberg、Hive 索引、Parquet/Spark 兼容**都在推进；  
- 稳定性上，新暴露的问题数量不多，且至少有一项正确性问题已经出现即时修复；  
- 工程面上，CI、依赖治理、构建系统仍是持续投入方向。  

**总体健康度评价：良好偏积极。**  
短期内建议优先关注三件事：  
1. 合并 Spark `YYYY` 兼容修复；  
2. 跟进 Debug 模式 JITIFY 退出崩溃；  
3. 清理 ready-to-merge 与长期悬置的 Parquet / cudf / build 类 PR。  

如果你愿意，我还可以基于这份日报继续输出一版：
- **“适合发到团队群的 10 行简报版”**
- 或 **“面向管理层的周报风格摘要版”**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-18）

## 1. 今日速览

过去 24 小时 Apache Gluten 保持较高活跃度：Issues 更新 8 条、PR 更新 15 条，问题修复、文档整理、Velox/ClickHouse 双后端演进同时推进。  
从内容看，当前重心集中在 **Velox 稳定性与性能优化**、**TLP 毕业后的仓库与文档收尾**、以及 **Shuffle / Join / Iceberg 相关能力增强**。  
值得关注的是，今天新出现的若干问题直接指向 **OOM、limit 查询性能异常、布隆过滤器优化**，说明社区正在从“功能可用”转向“极端场景性能与稳定性打磨”。  
整体健康度评价：**活跃且偏工程收敛阶段**，修复与基础设施清理并行，但仍存在一些需要维护者快速响应的高风险运行时问题。

---

## 3. 项目进展

### 已关闭 / 已收敛的 PR

#### 1) 仓库引用从 incubator 迁移到 TLP 路径的全局更新已完成/关闭
- PR: #11735 - Update repository references from incubator-gluten to gluten after TLP graduation  
- 链接: https://github.com/apache/incubator-gluten/pull/11735

这项变更覆盖 CORE、VELOX、INFRA、TOOLS、CLICKHOUSE、DOCS、DATA_LAKE、FLINK 多模块，属于 **毕业为 Apache 顶级项目（TLP）后的工程收尾工作**。  
它的意义不在查询执行本身，而在于：
- 统一仓库、站点、目录引用；
- 降低后续 CI、文档、脚本、打包流程中的路径错误风险；
- 为后续品牌与发布流程稳定化打基础。

> 备注：该 PR 已关闭，但从内容判断其工作已经对迁移方向形成明确规范。与此同时，Issue #11713 仍在跟踪毕业任务。

---

#### 2) 文档导航与 Getting Started 修复
- PR: #11772 - [GLUTEN-DOCS] Fix broken mkdocs navigation and add getting-started guide  
- 链接: https://github.com/apache/incubator-gluten/pull/11772

该 PR 修复了 mkdocs 导航中多个失效入口，并补充 getting-started 指南。  
这对项目推进的价值在于：
- 降低新用户接入门槛；
- 减少因文档路径失效导致的“安装即失败”体验；
- 为 TLP 后新站点内容重构铺路。

这是一个典型的 **非功能性但高影响面** 修复，尤其对新用户和企业 PoC 场景很重要。

---

#### 3) ClickHouse 后端清理误引入的 RAS，修复 CI
- PR: #11773 - [CH] Remove RAS  
- 链接: https://github.com/apache/incubator-gluten/pull/11773

该 PR 的目标是移除被 #11735 误重新引入的 RAS 相关内容，避免 ClickHouse CI 失败。  
说明当前 TLP 迁移带来的仓库级批量改动，已经开始暴露 **后端构建与模块边界** 的副作用。  
这类修复虽小，但对保持 ClickHouse 后端提交流畅度非常关键。

---

#### 4) Velox 配置文档补充：最大写文件大小
- PR: #11606 - [VL] Adding configurations on max write file size  
- 链接: https://github.com/apache/incubator-gluten/pull/11606

该 PR 已关闭，反映出 Velox 写路径相关配置正在逐步文档化。虽然未看到其最终合入状态，但它表明社区正在补齐 **写入侧可调参数暴露**，这通常与 Iceberg / Data Lake 落地质量、文件数控制和写出性能有关。

---

#### 5) Core 表达式转换逻辑可读性重构
- PR: #11757 - Refactor ExpressionConverter to use explicit Option return instead of Option(null)  
- 链接: https://github.com/apache/incubator-gluten/pull/11757

这是一次代码质量层面的重构，意图减少 `Option(null)` 这种隐式行为依赖。  
尽管影响范围主要在 Core 代码可维护性，但对 SQL 表达式转换链路的可读性和未来调试效率有正面作用。

---

### 今日仍在推进中的重点 PR

#### 6) 针对 HashBuild OOM 的直接修复提案
- PR: #11775 - [GLUTEN-11774][VL] Use runtime stats to choose hash build side  
- 链接: https://github.com/apache/incubator-gluten/pull/11775

该 PR 直接对应新报 Issue #11774，提出在 AQE 启用时利用 `QueryStageExec` 运行时统计信息选择更小一侧作为 build side。  
这属于 **Join 规划正确性 + 内存稳定性** 的关键修复：
- 有望减少错误 build side 导致的内存放大；
- 利用 AQE 真实统计信息，优于静态估计；
- 若合入，将明显增强 Gluten 在大表 Join 场景下的健壮性。

---

#### 7) Shuffle 写入 per-block 列统计，为动态过滤和块级裁剪铺路
- PR: #11769 - [GLUTEN-11605][VL] Write per-block column statistics in shuffle writer  
- 链接: https://github.com/apache/incubator-gluten/pull/11769

这是今天最值得关注的性能类 PR 之一。它向 shuffle writer 管道中写入块级列统计（min/max/hasNull），作为后续在 shuffle reader 侧基于动态过滤进行 block-level pruning 的前置能力。  
技术价值：
- 将动态过滤从“算子级”推进到“数据块级”；
- 有望减少无效块读取与解码；
- 对大规模 Join、分布式 Shuffle 读取、数仓型工作负载有明确收益。

这类改动通常不会立刻体现在 SQL 功能清单里，但对 OLAP 查询执行效率影响很大。

---

#### 8) Shuffle 读取与广播序列化路径减少 byte[] 频繁分配
- PR: #11777 - Reuse byte[] buffers in shuffle read and broadcast serialization paths  
- 链接: https://github.com/apache/incubator-gluten/pull/11777

该 PR 通过复用临时 byte[] 缓冲区，减少 shuffle read 和 broadcast serialization 路径中的频繁分配。  
预期收益：
- 降低 JVM 堆上短生命周期对象压力；
- 缓解 GC 抖动；
- 改善高并发或大规模任务下的吞吐与尾延迟。

这是一个典型的 **“不改 SQL 能力，但改实际运行体验”** 的底层优化。

---

#### 9) Iceberg 元数据传递与 `input_file_name()` 修复持续推进
- PR: #11615 - [GLUTEN-11513][VL][Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation  
- 链接: https://github.com/apache/incubator-gluten/pull/11615

该 PR 涵盖：
- `input_file_name()` / `input_file_block_start()` / `input_file_block_length()` 行为修复；
- JNI 初始化稳定性问题修复；
- 元数据透传增强。

它对数据湖用户非常重要，因为：
- 这些函数常用于审计、调试、质量核查；
- Iceberg 元数据不正确会直接影响可观测性和兼容性；
- JNI crash path 的修复涉及生产可用性。

---

#### 10) ClickHouse 后端版本升级
- PR: #11734 - [CH] Update Clickhouse Version (Branch_25.12_20260310)  
- 链接: https://github.com/apache/incubator-gluten/pull/11734

该 PR 将 ClickHouse 版本更新到 branch 25.12，并附带聚合函数支持及 `sparkArrayFold` lambda 类型对齐。  
这意味着 ClickHouse 后端在：
- 上游能力同步，
- 聚合函数兼容，
- Spark 表达式语义对齐  
方面仍在持续推进。

---

## 4. 社区热点

### 1) ANSI 模式支持仍是最受关注的长期兼容性议题
- Issue: #10134 - [VL] Add ANSI mode support  
- 链接: https://github.com/apache/incubator-gluten/issues/10134  
- 评论: 19 | 👍: 7

这是当前反应数最高的问题之一。  
背后的技术诉求非常明确：随着 Spark 4.0 默认开启 `spark.sql.ansi.enabled=true`，Gluten 若不能完整支持 ANSI 语义，将在类型转换、溢出、异常行为、赋值策略等方面与原生 Spark 产生偏差。  
这已不是“锦上添花”的兼容性需求，而是 **进入 Spark 新版本生态的基础门槛**。

---

### 2) Distinct aggregation OOM 持续受到关注
- Issue: #8025 - [VL] Distinct aggregation OOM when getOutput  
- 链接: https://github.com/apache/incubator-gluten/issues/8025  
- 评论: 21 | 👍: 3

这是评论最多的活跃 Issue。  
问题核心在于 Distinct aggregation spill 后，在 `getOutput()` 合并多个有序 spill 文件时，一次性读入各文件首批数据，导致内存消耗过高。  
这反映出社区对 **大数据量聚合、spill 策略、流式输出模型** 的强烈诉求，属于 Velox 后端在极端聚合负载下的关键稳定性问题。

---

### 3) Velox 上游 PR 跟踪器持续活跃
- Issue: #11585 - useful Velox PRs not merged into upstream  
- 链接: https://github.com/apache/incubator-gluten/issues/11585  
- 评论: 16 | 👍: 4

这不是单一 bug，而是一个治理型 tracker。  
它说明 Gluten 社区与 Velox 上游之间仍存在一批 **“社区认为有价值、但尚未 upstream 合入”** 的补丁。  
技术含义：
- Gluten 的创新速度可能快于上游接纳速度；
- 本地维护 patch 的 rebase 成本在增加；
- 后续版本稳定性、维护成本与 upstream 关系密切。

---

### 4) “select ... limit ...” 简单查询反而慢 10 倍，成为新的性能热点
- Issue: #11766 - Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries  
- 链接: https://github.com/apache/incubator-gluten/issues/11766  
- 评论: 2

虽然评论不多，但这是典型的 **用户感知极强** 的问题。  
对用户来说，复杂 TPC-DS 跑得快不如简单 SQL 不退化更重要。  
如果 limit 查询在任务切分、扫描剪枝、早停机制方面不如 Vanilla Spark，说明 Gluten 在轻量查询场景下可能存在规划或执行路径冗余。

---

### 5) Apache Gluten 毕业任务跟踪
- Issue: #11713 - [Umbrella] Apache Gluten Graduation Tasks  
- 链接: https://github.com/apache/incubator-gluten/issues/11713

这是项目治理层面的高优先级 tracker。  
其意义在于，项目已从“孵化中”进入“顶级项目规范化运营”阶段，后续发布、文档、品牌、仓库、网站、流程都会随之调整。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：HashBuild OOM，疑似错误选择 build side
- Issue: #11774 - HashBuild OOM caused by incorrect build side  
- 链接: https://github.com/apache/incubator-gluten/issues/11774  
- 状态: OPEN  
- 是否已有修复 PR: **有，#11775**  
- 修复 PR 链接: https://github.com/apache/incubator-gluten/pull/11775

这是今天最紧急的新问题。  
如果 Join build side 选择错误，大表被错误构建成 hash side，极易导致内存暴涨甚至查询失败。  
好消息是已有针对性修复 PR，且方案基于 AQE runtime stats，具备较强落地可行性。

---

### P1：Distinct aggregation spill 合并阶段 OOM
- Issue: #8025 - [VL] Distinct aggregation OOM when getOutput  
- 链接: https://github.com/apache/incubator-gluten/issues/8025  
- 状态: OPEN  
- 是否已有修复 PR: **未见今日数据中直接关联修复**

这是一个持续活跃的老问题，影响大规模 distinct aggregation 场景。  
风险点在于：
- spill 本应缓解内存压力；
- 但输出阶段的多文件合并策略重新放大了内存使用；
- 属于“中后期阶段爆内存”的难定位问题。

建议维护者提高优先级，因为该问题会削弱用户对 spill 机制的信任。

---

### P2：简单 limit 查询比 Vanilla Spark 慢 10 倍以上
- Issue: #11766 - Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries  
- 链接: https://github.com/apache/incubator-gluten/issues/11766  
- 状态: OPEN  
- 是否已有修复 PR: **暂无**

这是典型性能回归/性能退化问题。  
虽然不一定导致错误结果，但直接影响用户对“加速引擎”的第一印象，优先级不应低。

---

### P2：Iceberg 上 `input_file_name()` 与 JNI 初始化稳定性问题
- PR: #11615  
- 链接: https://github.com/apache/incubator-gluten/pull/11615

虽以 PR 形式体现，但本质对应：
- 元数据函数行为不正确；
- JNI 初始化可能存在 crash path。  
这是影响数据湖兼容性与稳定性的组合问题，建议持续跟进。

---

### P3：ClickHouse CI 受 RAS 误引入影响
- PR: #11773  
- 链接: https://github.com/apache/incubator-gluten/pull/11773

问题已关闭，属于工程稳定性事件。  
表明仓库级批量迁移期间，仍需加强后端模块回归验证。

---

## 6. 功能请求与路线图信号

### 1) ANSI 模式支持：高度可能进入后续核心路线图
- Issue: #10134  
- 链接: https://github.com/apache/incubator-gluten/issues/10134

这是最明确的路线图信号之一。  
随着 Spark 4.x 默认 ANSI 开启，Gluten 若想在新 Spark 版本中保持无缝替换能力，ANSI 支持几乎是必选项。  
判断：**大概率会被纳入下一阶段核心兼容性工作**。

---

### 2) Bloom Filter 优化：可能形成一条完整性能链路
- Issue: #11771 - Bloom filter optimization  
- 链接: https://github.com/apache/incubator-gluten/issues/11771

该需求聚焦 Spark 与 Velox Bloom Filter 的实现差异，核心是：
- 哈希函数数量与误判率策略不同；
- 现有实现可能存在内存与性能权衡问题。  

结合以下信息一起看：
- 已关闭 Issue #11383：Velox hash join bloom filter feature 配置支持  
  链接: https://github.com/apache/incubator-gluten/issues/11383
- 在途 PR #11769：shuffle writer 写 per-block 统计，为动态过滤/块级裁剪铺路  
  链接: https://github.com/apache/incubator-gluten/pull/11769

可以判断，社区正在把 **动态过滤 / Bloom Filter / Shuffle 裁剪** 串成一个更完整的优化方向。  
判断：**有较高概率在后续版本继续推进**。

---

### 3) Iceberg 写配置与数据湖支持继续增强
- PR: #11776 - Added iceberg write configs  
- 链接: https://github.com/apache/incubator-gluten/pull/11776

虽然是文档/配置暴露类变更，但它释放了明确信号：  
Gluten 正在持续补齐 **Iceberg 写入侧可配置项**，说明数据湖场景仍是重点投资方向。

---

### 4) ClickHouse 后端能力与版本同步继续推进
- PR: #11734  
- 链接: https://github.com/apache/incubator-gluten/pull/11734

更新 ClickHouse 版本并补充聚合/类型对齐支持，说明 ClickHouse 后端并未停留在维护模式，而是仍在迭代兼容性与函数支持。  
判断：**CH 后端仍会是并行推进的重要路线之一**。

---

## 7. 用户反馈摘要

结合今日活跃 Issues，可提炼出以下真实用户痛点：

1. **用户更关注“简单查询不退化”而非单纯 benchmark 提升**  
   - 证据：#11766  
   - `select * ... limit 10` 这类最基础查询出现 10 倍以上性能落差，会直接影响试用与迁移决策。

2. **大数据量聚合场景对内存稳定性极其敏感**  
   - 证据：#8025  
   - 用户不仅需要 spill“存在”，更要求 spill 在最终输出阶段仍然可控，否则无法信任引擎在生产高基数聚合上的表现。

3. **Join 策略错误会迅速转化为生产级故障**  
   - 证据：#11774  
   - build side 选择不当引发 OOM，说明用户使用场景已深入到 AQE、大表 Join、复杂执行计划等真实数仓负载。

4. **Spark 新语义兼容已成刚需**  
   - 证据：#10134  
   - ANSI 模式不是“附加能力”，而是升级 Spark 版本时避免行为偏差的关键基础设施。

5. **数据湖可观测性与元数据函数正确性很重要**  
   - 证据：#11615  
   - `input_file_name()` 等函数修复说明用户在 Iceberg 场景下不仅做查询，还依赖文件级元信息进行排障、审计和校验。

总体来看，用户反馈已经从“能否跑起来”转向：
- 轻量 SQL 性能体验，
- 大查询内存稳定性，
- Spark 语义一致性，
- 数据湖生产可用性。

---

## 8. 待处理积压

以下是值得维护者特别关注的长期或 stale 项：

### 1) Distinct aggregation OOM 长期未解
- Issue: #8025  
- 链接: https://github.com/apache/incubator-gluten/issues/8025

创建于 2024-11-22，至今仍活跃。  
这类 오래未解决且评论数高的问题，容易成为用户对 Velox 后端稳定性的负面标签。

---

### 2) ANSI 模式支持仍处于 tracker 状态
- Issue: #10134  
- 链接: https://github.com/apache/incubator-gluten/issues/10134

创建于 2025-07-07，评论和点赞均较高。  
建议拆解成更细粒度子任务并标注当前已完成项，否则长期 tracker 容易失去执行抓手。

---

### 3) Velox 上游未合并 PR 跟踪器反映技术债风险
- Issue: #11585  
- 链接: https://github.com/apache/incubator-gluten/issues/11585

如果长期依赖未 upstream 的补丁，后续版本升级与 rebase 成本会持续升高。  
建议维护者定期评估：
- 哪些必须继续本地维护；
- 哪些可以降级移除；
- 哪些应集中推动 upstream 合并。

---

### 4) 多个 stale PR 仍未形成结论
- PR: #10553 - Simplify StrictRule and remove unnecessary DummyLeafExec  
- 链接: https://github.com/apache/incubator-gluten/pull/10553

- PR: #11521 - Fix some UT for Spark40 and Spark41  
- 链接: https://github.com/apache/incubator-gluten/pull/11521

- PR: #11523 - Fix window to aggregate conversion with ordering expression validation  
- 链接: https://github.com/apache/incubator-gluten/pull/11523

这些 PR 涉及：
- 驱动侧性能优化，
- Spark 4.0/4.1 UT 适配，
- ClickHouse 窗口到聚合转换正确性。  

其中至少前两类与新版本兼容、性能体验直接相关，建议维护者尽快给出：
- 合并计划，
- 需要补测项，
- 或明确关闭理由。

---

## 附：今日重点链接清单

- Issue #11774 HashBuild OOM caused by incorrect build side  
  https://github.com/apache/incubator-gluten/issues/11774
- PR #11775 Use runtime stats to choose hash build side  
  https://github.com/apache/incubator-gluten/pull/11775
- Issue #8025 Distinct aggregation OOM when getOutput  
  https://github.com/apache/incubator-gluten/issues/8025
- Issue #10134 Add ANSI mode support  
  https://github.com/apache/incubator-gluten/issues/10134
- Issue #11766 simple limit 查询性能显著慢于 Vanilla Spark  
  https://github.com/apache/incubator-gluten/issues/11766
- Issue #11771 Bloom filter optimization  
  https://github.com/apache/incubator-gluten/issues/11771
- PR #11769 Write per-block column statistics in shuffle writer  
  https://github.com/apache/incubator-gluten/pull/11769
- PR #11777 Reuse byte[] buffers in shuffle read and broadcast serialization paths  
  https://github.com/apache/incubator-gluten/pull/11777
- PR #11615 Iceberg metadata/input_file_name/JNI stability fixes  
  https://github.com/apache/incubator-gluten/pull/11615
- PR #11734 Update Clickhouse Version  
  https://github.com/apache/incubator-gluten/pull/11734
- Issue #11713 Apache Gluten Graduation Tasks  
  https://github.com/apache/incubator-gluten/issues/11713

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合微信群/飞书发布的精简版**，或  
2. **适合周报归档的 Markdown 表格版**。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报 · 2026-03-18

## 1. 今日速览

过去 24 小时内，Apache Arrow 保持较高活跃度：Issues 更新 31 条、PR 更新 19 条，但**无新版本发布**。  
从变更类型看，今日工作重心明显集中在 **构建/打包链路、Windows 平台兼容性、Python 打包体系、R 绑定功能补齐、以及 C++/Parquet CLI 小修复**。  
已关闭/合并的事项多为**工程稳定性与开发者体验改进**，例如 Windows wheel 构建修复、editable install 兼容、文档构建告警收敛等。  
新增问题中，**Flight SQL/ODBC 的 Windows 发布与签名流程**、**C++ 构建依赖遗漏**、**Parquet CLI 可用性缺陷**值得重点关注。  
整体来看，项目健康度良好，社区响应及时，但仍存在一批**跨语言历史积压议题**和**平台特定打包复杂度**持续拉高维护成本。

---

## 3. 项目进展

### 已关闭 / 已完成的重要 PR 与 Issue

#### 1) 修复 Windows wheels 在 docstrings 更新步骤失败
- PR: [#49532](https://github.com/apache/arrow/pull/49532)
- Issue: [#49531](https://github.com/apache/arrow/issues/49531)

本次修复针对 Python/Packaging/CI 链路，在 Windows wheel 构建过程中，临时目录中的 DLL 仍被占用导致清理失败。修复方式是对临时目录清理增加 `ignore_cleanup_errors=True`。  
**影响分析：**
- 提升 Windows wheel 构建稳定性；
- 降低 PyArrow 发布流程中的偶发失败；
- 属于典型的**发布工程可靠性修复**，虽不直接影响查询引擎能力，但对二进制分发质量至关重要。

#### 2) 修复 editable install 下 Cython 测试失败
- PR: [#49476](https://github.com/apache/arrow/pull/49476)
- Issue: [#49473](https://github.com/apache/arrow/issues/49473)

该修复解决了在采用 `scikit-build-core` 后，`get_include()` / `get_library_dirs()` 返回路径不正确的问题。  
**影响分析：**
- 改善 Python 开发者在 editable/non-editable 两类构建模式下的头文件与库路径发现；
- 为 PyArrow 构建后端现代化铺路；
- 对后续 Python 扩展生态、下游包编译兼容性意义较大。

#### 3) 收敛 Sphinx HTML 构建告警和 docutils 错误
- PR: [#49510](https://github.com/apache/arrow/pull/49510)
- Issue: [#49509](https://github.com/apache/arrow/issues/49509)

该项主要是文档格式和拼写修正。  
**影响分析：**
- 改善文档 CI 信噪比；
- 让真实回归更容易暴露；
- 对多语言用户文档质量是正向信号。

#### 4) Maven 版本升级到 3.9.9
- PR: [#49488](https://github.com/apache/arrow/pull/49488)

这是 Java 相关构建基础设施升级，目的是适配更新的 Apache POM / Maven 插件 API。  
**影响分析：**
- 强化 Java 子项目构建兼容性；
- 降低未来 Java 发布链路阻塞风险；
- 虽非 OLAP 执行层特性，但属于平台工程必需推进。

#### 5) scikit-build-core 迁移 PR 被关闭
- PR: [#49259](https://github.com/apache/arrow/pull/49259)

该 PR 试图将 PyArrow 构建后端从 `setuptools + setup.py` 转向 `scikit-build-core`。虽然本次状态为关闭，但结合近期相关修复（#49476、#49531），说明**Python 构建体系现代化仍在推进，只是路线可能调整或拆分落地**。  
**影响分析：**
- 不是功能倒退，更像是大改拆分治理；
- 后续仍值得持续跟踪。

---

## 4. 社区热点

### 1) Trusted Publishing 上传 wheels 到 PyPI
- Issue: [#44733](https://github.com/apache/arrow/issues/44733)

这是今天最活跃的工程安全议题之一。讨论聚焦于 PyPI 的 **trusted publishing** 与数字签名/attestation。  
**背后技术诉求：**
- 提升 PyArrow wheel 发布供应链安全；
- 减少长期保管敏感凭证的风险；
- 使产物 provenance 更清晰，符合现代软件供应链要求。  
对于数据基础设施项目来说，这类改进会直接影响企业用户的合规与上线信心。

### 2) Flight SQL ODBC Windows MSI 签名
- Issue: [#49404](https://github.com/apache/arrow/issues/49404)

该议题评论活跃，核心是 **Windows Defender 对未签名 MSI/ DLL 的拦截**。  
**背后技术诉求：**
- Flight SQL ODBC 驱动在 Windows 上要进入企业可分发状态，代码签名几乎是必需项；
- 这反映出 Arrow 正在从“开发者库”向“企业可交付连接器组件”继续演进。  
与其相关的新增事项还有：
- [#49538](https://github.com/apache/arrow/issues/49538) Windows ODBC 改为静态链接
- [#49537](https://github.com/apache/arrow/issues/49537) 上传 MSI installer materials 供 `cpack`/WIX 使用

这表明 ODBC/Flight SQL 的 Windows 交付链路正在系统性补课。

### 3) R/C++ 日期时间解析与类型转换历史议题再次活跃
- Issue: [#31254](https://github.com/apache/arrow/issues/31254)
- Issue: [#31240](https://github.com/apache/arrow/issues/31240)

这两个老 Issue 今天再次更新，涉及：
- `strptime` 是否支持部分格式解析；
- `int -> date32` 转换是否支持 origin 参数，及 double -> date32 能否支持。  
**背后技术诉求：**
- 提升 Arrow 在 R 生态中的时间语义兼容；
- 降低从 base R / tidyverse 迁移到 Arrow 时的行为差异；
- 这类问题本质上关乎**SQL/表达式层时间函数一致性**与数据转换正确性。

### 4) Python 任意对象序列化到 Parquet
- Issue: [#31267](https://github.com/apache/arrow/issues/31267)

这是经典高需求但高争议议题：是否允许把 arbitrary Python objects 序列化到 Parquet。  
**背后技术诉求：**
- 用户希望“一键保存 pandas DataFrame”，即便里面包含自定义对象；
- 但 Parquet/Arrow 追求的是**跨语言、可分析、强 schema、列式语义**，与任意对象序列化天然冲突。  
这说明用户对 Arrow 的期待正处于“分析型标准格式”与“Python 便利性存储”之间拉扯。

### 5) Python extension type 在 struct 中报错
- Issue: [#44853](https://github.com/apache/arrow/issues/44853)

虽然评论不多，但 👍 数最高（4）。  
**背后技术诉求：**
- 用户希望 PyArrow 的 extension type 在嵌套结构中保持一致行为；
- 这类问题直接关联到复杂 schema、半结构化数据、向量化 UDF 输入输出等高级场景。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1 · C++ 构建依赖遗漏：Flight SQL + Examples 缺 gflags
- Issue: [#49541](https://github.com/apache/arrow/issues/49541)
- Fix PR: [#49542](https://github.com/apache/arrow/pull/49542)

问题描述：启用 `ARROW_FLIGHT_SQL=ON` 且 `ARROW_BUILD_EXAMPLES=ON` 时，构建链路遗漏 `gflags` 依赖。  
**影响：**
- 直接导致某些 C++ 构建配置失败；
- 影响 Flight SQL 示例程序与开发者验证流程；
- 对尝试集成 Arrow Flight SQL 的用户是显性阻断。  
**状态：已有修复 PR，当日即提交，响应较快。**

### P1 · parquet-scan CLI 参数校验错误
- Issue: [#49539](https://github.com/apache/arrow/issues/49539)
- Fix PR: [#49540](https://github.com/apache/arrow/pull/49540)

问题描述：`parquet-scan` 在无参数运行时，不显示 usage，而是尝试打开空文件路径。  
**影响：**
- 虽不影响核心 Parquet 引擎正确性，但影响 CLI 工具可用性和用户首体验；
- 暗示命令行入口存在基础参数校验缺陷。  
**状态：已有修复 PR。**

### P1 · vcpkg 多配置生成器下 Release 链接到 debug Snappy/Brotli
- Issue: [#49499](https://github.com/apache/arrow/issues/49499)

问题描述：在 Visual Studio + vcpkg static triplet 下，Release 构建错误链接 Debug 版 Snappy/Brotli，触发 `LNK2038` ABI/运行时不匹配。  
**影响：**
- 影响 Windows C++ 消费者集成；
- 对企业内部标准化构建系统是高摩擦问题；
- 容易在“能编译但无法链接”阶段消耗大量排障成本。  
**状态：暂未看到对应 fix PR。**

### P2 · R CI 因非 API 调用触发 NOTE
- Issue: [#49529](https://github.com/apache/arrow/issues/49529)
- PR: [#49530](https://github.com/apache/arrow/pull/49530)

问题描述：使用 `Rf_findVarInFrame` 触发 CRAN 风格的 non-API call NOTE。  
**影响：**
- 主要影响 R 包合规性与发布质量；
- 对终端用户影响较小，但对 CRAN 生态很关键。  
**状态：已有修复 PR，待进一步 review。**

### P2 · Windows wheel 构建 docstrings 更新失败
- Issue: [#49531](https://github.com/apache/arrow/issues/49531)
- PR: [#49532](https://github.com/apache/arrow/pull/49532)

**状态：已关闭修复。**

### P2 · editable install 下 Python/Cython 测试失败
- Issue: [#49473](https://github.com/apache/arrow/issues/49473)
- PR: [#49476](https://github.com/apache/arrow/pull/49476)

**状态：已关闭修复。**

### P3 · Python extension type 嵌套 struct 异常
- Issue: [#44853](https://github.com/apache/arrow/issues/44853)

问题仍未见今日 fix，但这类问题在复杂 schema 场景下可能影响正确性。建议继续跟踪。

---

## 6. 功能请求与路线图信号

### 1) R 绑定继续补齐 dplyr 语义
- Issue: [#49534](https://github.com/apache/arrow/issues/49534)
- PR: [#49536](https://github.com/apache/arrow/pull/49536)
- 相关 PR: [#49535](https://github.com/apache/arrow/pull/49535)

新增需求包括：
- `recode_values()`
- `replace_values()`
- `replace_when()`
- `when_any()`
- `when_all()`  

**路线图判断：高概率纳入近期版本。**  
理由是这些需求已快速对应到 PR，且进入 committer review 阶段，说明 R 子项目正持续增强与 dplyr 新语义的兼容性。  
对于分析引擎用户，这意味着 Arrow Dataset / dplyr 翻译层可覆盖更多数据清洗表达式。

### 2) Flight SQL ODBC Windows 交付能力增强
- Issue: [#49404](https://github.com/apache/arrow/issues/49404)
- Issue: [#49538](https://github.com/apache/arrow/issues/49538)
- Issue: [#49537](https://github.com/apache/arrow/issues/49537)

需求方向包括：
- MSI/DLL 签名；
- Windows ODBC 静态链接；
- 为 WIX/cpack 流程上传安装器物料。  

**路线图判断：高概率持续推进。**  
这是明显成套的发布工程工作，目标是将 Flight SQL ODBC 推向更可部署、可安装、可分发状态。对于 OLAP/BI 接入场景，这类工作比单个 API 更重要。

### 3) Python 类型系统与注解完善
- PR: [#48622](https://github.com/apache/arrow/pull/48622)

该 PR 为 PyArrow 内部类型系统补充 stubs。  
**路线图判断：中高概率进入未来版本。**  
信号说明 PyArrow 正朝更好的静态类型提示、IDE 支持、开发体验推进。

### 4) VariableShapeTensor Python 包装
- PR: [#40354](https://github.com/apache/arrow/pull/40354)

**路线图判断：中期机会较大，但推进较慢。**  
这对机器学习张量场景和非规则张量表示很关键，但依赖更底层 C++ 实现完整性。

### 5) Windows ARM64 PyArrow 构建支持
- PR: [#48539](https://github.com/apache/arrow/pull/48539)

**路线图判断：值得关注。**  
随着 Windows on ARM 生态增长，官方 wheel 支持会扩大 PyArrow 可用平台范围。

### 6) Trusted Publishing / 数字证明
- Issue: [#44733](https://github.com/apache/arrow/issues/44733)

**路线图判断：中高概率纳入发布工程路线。**  
虽不属于查询功能，但对企业级交付与供应链安全会越来越重要。

---

## 7. 用户反馈摘要

### 1) 用户希望 Arrow 更接近原生语言生态行为
- R 用户关注 `strptime` 部分格式解析、日期 origin 转换：
  - [#31254](https://github.com/apache/arrow/issues/31254)
  - [#31240](https://github.com/apache/arrow/issues/31240)

这说明用户在使用 Arrow 时，希望其计算/转换行为尽量贴近 base R。  
**痛点本质：** 迁移成本与语义一致性。

### 2) Python 用户对“复杂对象/复杂嵌套类型”的支持预期持续升高
- 任意 Python 对象写 Parquet：
  - [#31267](https://github.com/apache/arrow/issues/31267)
- DataFrame 列中嵌套 DataFrame 转 struct/list<struct>：
  - [#20057](https://github.com/apache/arrow/issues/20057)
- extension type 在 struct 中出错：
  - [#44853](https://github.com/apache/arrow/issues/44853)

**痛点本质：**
- 用户希望 PyArrow 能无缝承接 pandas 中更复杂的数据形态；
- 但 Arrow 的强类型列式模型与 Python 动态对象模型存在结构性张力。

### 3) 企业用户高度敏感于 Windows 平台安装与签名体验
- [#49404](https://github.com/apache/arrow/issues/49404)
- [#49538](https://github.com/apache/arrow/issues/49538)

**痛点本质：**
- 即使核心引擎功能完备，若驱动/安装器在 Windows 上被 Defender 拦截，实际采用就会受阻；
- 企业 BI / ODBC 场景非常依赖“拿来即装”的交付能力。

### 4) 下游集成者非常在意构建系统的可预测性
- `gflags` 依赖遗漏：
  - [#49541](https://github.com/apache/arrow/issues/49541)
- vcpkg Release/Debug 误链接：
  - [#49499](https://github.com/apache/arrow/issues/49499)

**痛点本质：**
- Arrow 作为底层组件被广泛嵌入，构建链路问题会直接转化为下游集成成本；
- 平台/工具链细节仍是体验短板。

---

## 8. 待处理积压

以下为长期未决且值得维护者关注的议题/PR。

### 长期 Issue 积压

#### 1) Python 计算函数未处理 `__arrow_array__`
- Issue: [#30711](https://github.com/apache/arrow/issues/30711)

这是 Arrow Python 数据互操作的一致性问题。`pa.array` 支持的协议若在 compute 层缺失，会造成 API 行为割裂。  
**建议：** 应提升优先级，因其影响生态互操作基础面。

#### 2) Python DataFrame 列嵌套 DataFrame 转换
- Issue: [#20057](https://github.com/apache/arrow/issues/20057)

这是 pandas 到 Arrow 的复杂结构映射能力缺口。  
**建议：** 若中短期不做，也应给出明确“不支持/推荐替代方案”。

#### 3) Parquet 加密能力探测 API
- Issue: [#31266](https://github.com/apache/arrow/issues/31266)

一个小而实用的 capability API，长期未落地。  
**建议：** 这类低复杂度接口适合新贡献者切入，价值高于实现成本。

#### 4) FlightRPC 向 transport-agnostic 方向重构
- Issue: [#31275](https://github.com/apache/arrow/issues/31275)
- Issue: [#31276](https://github.com/apache/arrow/issues/31276)

这是架构层长期议题，关系到 Flight 非 gRPC 数据平面与更灵活的传输抽象。  
**建议：** 如果短期不推进，最好补充 roadmap 状态，避免外部误判。

### 长期 PR 积压

#### 1) VariableShapeTensor Python wrapper
- PR: [#40354](https://github.com/apache/arrow/pull/40354)

涉及高级张量数据结构，是功能性较强但推进偏慢的 PR。  
**建议：** 明确依赖前置、拆分范围，避免长期挂起。

#### 2) Python tensor classes 文档补全
- PR: [#45160](https://github.com/apache/arrow/pull/45160)

处于 stale-warning，说明维护注意力不足。  
**建议：** 若文档结构已变化，应指导作者 rebase 或拆小。

#### 3) Windows ARM64 PyArrow 支持
- PR: [#48539](https://github.com/apache/arrow/pull/48539)

平台扩展价值高，但 review 周期偏长。  
**建议：** 对平台支持类 PR 建议集中安排基础设施 reviewer。

#### 4) Python 类型系统 stubs
- PR: [#48622](https://github.com/apache/arrow/pull/48622)

与更大的类型标注路线有关。  
**建议：** 若存在串行依赖，应在 PR 描述或项目板中公开说明。

---

## 总结判断

今天 Arrow 的主线不是新功能爆发，而是**工程化质量提升日**：  
- Python 构建/打包稳定性持续改善；
- C++ 工具链问题出现即被快速补 PR；
- R 绑定在 dplyr 兼容方向继续稳步推进；
- Flight SQL ODBC 的 Windows 企业分发能力成为明显热点。  

从 OLAP 与分析存储视角看，Arrow 正在补强两类能力：  
1. **作为底层数据交换/执行组件的可集成性**：构建、打包、平台兼容；  
2. **作为上层分析接口的语言生态可用性**：R dplyr 语义、Python 类型系统、复杂类型支持。  

如果你愿意，我还可以继续把这份日报整理成更适合内部汇报的 **“管理层摘要版”** 或 **“研发跟进清单版”**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*