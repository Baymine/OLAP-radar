# Apache Doris 生态日报 2026-03-22

> Issues: 16 | PRs: 78 | 覆盖项目: 10 个 | 生成时间: 2026-03-22 01:22 UTC

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

# Apache Doris 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时，Apache Doris 项目整体活跃度较高：Issues 更新 16 条、PR 更新 78 条，但结构上呈现出“集中清理积压 + 少量新增开发”的特点。  
Issues 侧仅有 1 条仍处于活跃开放状态，另有 15 条被关闭，且大部分关闭项带有 **Stale** 标签，说明社区在持续清理长期未推进的问题池。  
PR 侧有 29 条待合并、49 条已合并或关闭，重点集中在 **查询引擎稳定性修复、云与外表连接器增强、半结构化/Variant 查询能力、以及分支回补**。  
今日没有新版本发布，但从多个已合并 PR 和待合并 PR 看，**4.1 分支正在快速收敛功能与稳定性修复**，并伴随 4.0/3.1 的 backport，项目整体健康度良好。  

---

## 2. 项目进展

### 2.1 今日值得关注的已合并 / 已关闭 PR

#### 1）ORC 读取链路的 coredump 修复已进入主干及分支
- **PR #61138** `[fix](orc) fix coredump because rewriteLeaves function heap-use-after-free.`  
  链接: apache/doris PR #61138
- **PR #61589** `branch-4.0: [fix](orc) ... #61138`  
  链接: apache/doris PR #61589
- **PR #61590** `branch-4.1: [fix](orc) ... #61138`  
  链接: apache/doris PR #61590

**意义：**  
这是今天最重要的稳定性进展之一。该修复针对 ORC 读取过程中的 **heap-use-after-free**，属于典型的高风险内存安全问题，可能导致 BE 崩溃。该修复已经被回补到 4.0 和 4.1，说明维护者判断其影响面较大、需要尽快覆盖稳定分支。  
**技术影响：** 有助于提升外表/湖仓场景下 ORC 格式查询的可靠性，尤其是涉及 predicate rewrite、schema leaf 重写等路径时的稳定性。

---

#### 2）NDV 聚合补齐 DECIMALV2 支持
- **PR #61546** `[Bug](function) add ndv decimalv2 support`  
  链接: apache/doris PR #61546
- **PR #61577** `branch-4.0: [Bug](function) add ndv decimalv2 support #61546`  
  链接: apache/doris PR #61577

**意义：**  
该修复增强了聚合函数对 `DECIMALV2` 的支持，尤其是 `ndv` 这类近似去重统计函数。  
**技术影响：**  
- 改善 SQL 函数兼容性与类型覆盖度  
- 降低数值型分析场景下的函数报错或行为不一致风险  
- 对 BI 报表、财务明细去重统计、精度敏感场景有直接价值

---

#### 3）Mac 编译问题得到快速处理
- **PR #61591** `fix compile on mac`  
  链接: apache/doris PR #61591

**意义：**  
虽然这是一个较小修复，但反映出 Doris 对开发者环境兼容性的持续维护。  
**技术影响：**  
- 降低本地开发、CI 辅助构建、社区贡献门槛  
- 对跨平台开发者体验有积极作用

---

### 2.2 今日重点待合并 PR

#### 4）多 Catalog / 湖仓读取链路重构
- **PR #61485** `[opt](multi-catalog) Refactor data lake reader.`  
  链接: apache/doris PR #61485

**意义：**  
该 PR 指向 Doris 在 **Lakehouse / 多数据源统一访问** 方向的核心能力建设。  
**可能带来的收益：**
- 统一 Hive / Iceberg / Paimon 等外部数据源读取链路
- 提升元数据与数据读取层可维护性
- 为后续性能优化、谓词下推、格式兼容扩展打基础

---

#### 5）Schema Change 加入副本追平保护
- **PR #61143** `[fix](schema-change) guard alter with base replica catch-up quorum`  
  链接: apache/doris PR #61143

**意义：**  
这是典型的分布式一致性与运维稳定性修复。PR 描述指出，在事务处于 `TIMEOUT_SUCC` 等部分发布成功状态时，分区可见版本可能前进，但部分 base replica 本地仍滞后，之前 schema change/rollup 可能过早下发 alter task。  
**技术影响：**
- 降低 schema change 和 rollup 期间数据不一致风险
- 提升副本落后、异常恢复场景下的 DDL 安全性
- 对生产集群的大表变更尤为关键

---

#### 6）MaxCompute Connector 修复内存泄漏并优化大数据写入
- **PR #61245** `[fix](mc) fix memory leak and optimize large data write for MaxCompute connector`  
  链接: apache/doris PR #61245

**意义：**  
该 PR 同时触达 **连接器稳定性** 与 **大批量写入性能**。  
**技术影响：**
- 修复 JNI Scanner / Writer 资源释放问题
- 降低 connector 长时间运行后的内存泄漏隐患
- 大数据块写入路径优化，有利于云数仓联邦场景

---

#### 7）云模式新增阿里云 OSS 原生 Storage Vault 能力
- **PR #61329** `[feature](cloud) Add Alibaba Cloud OSS native storage vault support with STS AssumeRole`  
  链接: apache/doris PR #61329

**意义：**  
这是今天最有产品化信号的云能力增强之一。  
**技术影响：**
- Doris Cloud 模式可原生接入阿里云 OSS
- 支持 ECS 实例身份、STS AssumeRole
- 降低显式密钥配置带来的运维和安全成本

**判断：** 若测试与文档完备，较有可能进入下一轮云版能力增强。

---

#### 8）半结构化 / Variant 检索能力继续增强
- **PR #61548** `[refactor](variant) normalize nested search predicate field resolution`  
  链接: apache/doris PR #61548
- **PR #61584** `[fix](fe) Fix MATCH crash on alias slots and push down as virtual column`  
  链接: apache/doris PR #61584
- **PR #61596** `[fix](inverted index) Make select_best_reader deterministic for multi-index columns`  
  链接: apache/doris PR #61596

**意义：**  
这三条 PR 构成了今天在 **半结构化查询 / 倒排索引 / 全文检索** 方向上最集中的推进。  
**技术影响：**
- 规范 nested predicate 的字段解析路径
- 修复 MATCH 表达式在 alias slot 上的 crash
- 多索引列场景下让倒排 reader 选择变得确定性，减少结果波动或行为不稳定

**判断：** 这表明 Doris 正持续强化 Variant/JSON/搜索分析融合能力。

---

#### 9）SQL 能力扩展：JSON 表函数与数组函数
- **PR #60910** `[Feature](func) Support table function json_each, json_each_text`  
  链接: apache/doris PR #60910
- **PR #60192** `[Feature](function) support function array_combinations`  
  链接: apache/doris PR #60192

**意义：**  
这两项功能都偏向 SQL 易用性与兼容性增强：  
- `json_each/json_each_text` 明显对齐 PostgreSQL 风格 JSON 表函数能力  
- `array_combinations` 则利于数组分析、枚举组合场景

---

## 3. 社区热点

### 3.1 路线图讨论帖关闭，但仍是最受关注的 Issue
- **Issue #47948** `[kind/community, Discuss] Doris Roadmap 2025`  
  作者: @morningman  
  链接: apache/doris Issue #47948

**热度：**
- 评论数：8
- 👍：27
- 今日状态：关闭

**分析：**  
这是今日最值得关注的社区信号。虽然该 Issue 被关闭，但它是更新列表中互动最高的条目，说明社区对 Doris 发展方向仍高度关注。  
Roadmap 摘要显示，2025 年重点仍围绕：
- **Lakehouse**
- **半结构化数据分析**
- **连接器与多数据源访问**
- **性能优化**

这与今日活跃 PR 高度一致，如 data lake reader 重构、OSS storage vault、JSON/Variant/倒排索引相关修复，说明路线图并非停留在讨论层，而是已经持续落到代码层。

---

### 3.2 内部统计表异常仍未真正解决
- **Issue #53633** `[Open][Stale][Bug] __internal_schema.column_statistics is broken`  
  作者: @yueguanyu  
  链接: apache/doris Issue #53633

**热度：**
- 今日唯一仍开放的 Issue
- 评论数：2

**分析：**  
该问题指向内部统计信息表 `__internal_schema.column_statistics` 异常，描述中涉及 BE 被以 `127.0.0.1:9030` 形式加入后，跨机器数据传输不可用，导致统计系统行为异常。  
这类问题背后的技术诉求通常是：
- 运维部署对 IP/hostname 配置的鲁棒性
- 统计信息系统在非标准网络环境中的可用性
- CBO/统计信息链路对集群配置问题的容错

由于该问题仍为 Open，建议维护者优先判断其是否影响查询优化器准确性。

---

### 3.3 旧路线图功能项大量被 Stale 关闭
典型如：
- **Issue #55999** `Optimize Hive, Iceberg, Paimon metadata access performance...`
- **Issue #56002** `Support Iceberg small file compaction and Snapshot management.`
- **Issue #56004** `Support Snowflake Iceberg table engine.`
- **Issue #56010** `Support Hive 4 transaction table.`
- **Issue #56011** `Support Doris Catalog...`
- **Issue #56015** `Optimize and unify data source property names...`
- **Issue #56016** `File system pluginization...`
- **Issue #56017** `JDBC Catalog pluginization...`

这些条目今日均被关闭，链接分别为对应的 apache/doris Issue 编号。

**分析：**  
这些需求方向本身并未失去价值，相反，它们与当前 Doris 的 lakehouse 与多 catalog 演进高度一致。被关闭更可能意味着：
1. 原始 Issue 缺少后续推进，被 stale 机制清理；
2. 部分能力已通过其他 PR/设计分拆推进；
3. 路线图式大 Issue 正在转向更细粒度实现 PR。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1：ORC 读取路径 heap-use-after-free，可能导致 BE coredump
- **Issue/背景关联：** 已通过 PR 修复
- **PR #61138** / **#61589** / **#61590**  
  链接: apache/doris PR #61138 / #61589 / #61590

**状态：已修复并回补分支**  
**影响面：** ORC 外表、湖仓读取、谓词重写相关查询  
**结论：** 今日最关键稳定性修复。

---

### P1：Schema Change 可能在副本未追平时提前执行
- **PR #61143** `[fix](schema-change) guard alter with base replica catch-up quorum`  
  链接: apache/doris PR #61143

**状态：待合并**  
**风险：**
- 影响 alter/rollup 安全性
- 在部分 publish 成功场景可能出现副本版本不一致下继续 DDL

**建议：** 该修复应优先评审，适合纳入近期稳定版本。

---

### P1：MATCH 在 alias slot 上可能 crash
- **PR #61584** `[fix](fe) Fix MATCH crash on alias slots and push down as virtual column`  
  链接: apache/doris PR #61584

**状态：待合并**  
**影响面：** Variant/全文检索/表达式别名场景  
**技术风险：** 影响查询正确性与稳定性，特别是复杂 SQL、join 上下文中的表达式下推。

---

### P1：多倒排索引场景 reader 选择不确定
- **PR #61596** `[fix](inverted index) Make select_best_reader deterministic for multi-index columns`  
  链接: apache/doris PR #61596

**状态：待合并**  
**风险：**
- 同一列多个 analyzer 时，读路径取决于迭代顺序
- 可能造成行为不稳定、结果波动、性能不可预测

---

### P2：Load 关闭状态存在并发安全问题
- **PR #61593** `[fix](load) Use atomic operations for _try_close flag and remove unused _close_wait`  
  链接: apache/doris PR #61593

**状态：待合并**  
**风险：**
- 多线程/bthread 与 pthread 之间的关闭标志竞争
- 可能导致加载任务关闭时序异常

---

### P2：MaxCompute Connector 内存泄漏
- **PR #61245** `[fix](mc) ... fix memory leak and optimize large data write ...`  
  链接: apache/doris PR #61245

**状态：待合并**  
**风险：**
- 长连接 / 大批次导入写出时的资源泄漏
- 云联邦场景稳定性受影响

---

### P2：Materialized View + Drop Column 后 Stream Load 失败
- **Issue #55272** `[Closed][Stale][Bug] stream load failed for table with materialized view after drop column`  
  链接: apache/doris Issue #55272

**状态：今日关闭，但非明确已修复**  
**风险：**
- Schema 变更后 load 链路类型转换错误
- 可能涉及 MV 列映射、schema evolution 与导入兼容性

**备注：** 由于被 stale 关闭，建议维护者确认是否已有替代修复或仍存在回归风险。

---

### P2：`COALESCE(ARRAY(1,2), ARRAY())` 报错
- **Issue #55904** `[Closed][Stale][Bug] COALESCE(ARRAY(1,2), ARRAY()) ERROR`  
  链接: apache/doris Issue #55904

**状态：今日关闭，未见对应 fix PR**  
**风险：**
- 空数组字面量类型推导不完善
- 影响 SQL 兼容性与数组函数易用性

---

### P2：Storage Policy 新增分区后未持久化
- **Issue #55967** `[Closed][Stale][Bug] storage policy is not saved when alter add a new partition`
- **PR #55931** `branch-2.7: [fix] Fix storage policy persistence problem with partition`  
  链接: apache/doris Issue #55967 / PR #55931

**状态：Issue 今日关闭；历史上已有修复 PR**  
**说明：** 从关联 PR 看，问题应已有修复路径，但需要确认是否覆盖所有分支。

---

### P3：删除任务在 BE 永久失联时挂起
- **Issue #55971** `[Closed][Stale][Bug] delete job hangs when a be is dead forever`  
  链接: apache/doris Issue #55971

**状态：今日关闭，未见直接 fix PR**  
**风险：** 运维可恢复性与任务超时机制仍值得回看。

---

## 5. 功能请求与路线图信号

### 5.1 高概率纳入下一版本/近期分支的功能方向

#### A. 湖仓读取与多 Catalog 统一化
- **PR #61485** `Refactor data lake reader`
- 关联关闭需求：
  - **Issue #55999** Hive/Iceberg/Paimon 元数据访问性能
  - **Issue #56011** Doris Catalog 联邦查询
  - **Issue #56016** 文件系统插件化
  - **Issue #56017** JDBC Catalog 插件化

**判断：**  
虽然路线图型 Issue 被 stale 关闭，但实现层 PR 仍在推进，说明这一方向是 Doris 的持续主线。

---

#### B. 云原生存储接入增强
- **PR #61329** 阿里云 OSS native storage vault + STS AssumeRole  
  链接: apache/doris PR #61329

**判断：**  
该能力贴近实际用户上云诉求，且具备明确场景价值，进入后续版本的概率较高。

---

#### C. SQL / 半结构化兼容性增强
- **PR #60910** `json_each/json_each_text`
- **PR #60192** `array_combinations`
- **PR #56303** `[fix](prepare statement) Add placeholder literal for prepare stage.`  
  链接: apache/doris PR #60910 / #60192 / #56303

**判断：**
- JSON 表函数符合 PostgreSQL 兼容增强趋势
- prepare statement placeholder 改进属于 SQL 语义完备性建设
- 数组函数扩展满足复杂分析表达式需求

---

#### D. Variant / 倒排索引 / 搜索分析融合
- **PR #61548**
- **PR #61584**
- **PR #61596**

**判断：**  
这是 Doris 差异化能力的重要方向之一，预计会持续进入 4.1 及后续版本。

---

### 5.2 今日被关闭但仍值得持续观察的需求
- **Issue #56002** Iceberg small file compaction & snapshot management
- **Issue #56004** Support Snowflake Iceberg table engine
- **Issue #56010** Support Hive 4 transaction table
- **Issue #56015** Unify data source property names

这些诉求在 lakehouse 场景中都很现实，建议后续关注是否以新的设计文档或拆分 PR 重新出现。

---

## 6. 用户反馈摘要

结合今日 Issues，可提炼出几个真实用户痛点：

### 6.1 Schema 演进后导入兼容性仍是高频风险点
- **Issue #55272**  
  链接: apache/doris Issue #55272

用户场景是：表存在物化视图，执行 drop column 后，stream load 出现 cast 失败。  
**反映问题：**
- MV 与 schema evolution 的联动仍较脆弱
- 导入链路对历史 schema / 隐式列映射兼容不够健壮

---

### 6.2 统计信息系统对部署配置较敏感
- **Issue #53633**  
  链接: apache/doris Issue #53633

用户反馈表明，BE 地址配置为回环地址后，在跨机器传输场景中无法正常工作，继而影响内部统计表。  
**反映问题：**
- 统计信息与 BE 网络配置耦合较强
- 对非标准部署或测试环境容错不足

---

### 6.3 云/冷热分层/存储策略场景存在可见性与一致性问题
- **Issue #55967**
- **Issue #55968**
- **Issue #55971**  
  链接: apache/doris Issue #55967 / #55968 / #55971

这些问题都与：
- storage policy 持久化
- cloud mode 参数支持
- 节点故障时后台任务恢复

有关，说明 Doris 在云化运维场景下，用户关注点已从“能否使用”转向“策略是否完整落地、异常情况下是否稳定”。

---

### 6.4 SQL 边界表达式兼容性仍有改进空间
- **Issue #55904** `COALESCE(ARRAY(1,2), ARRAY()) ERROR`  
  链接: apache/doris Issue #55904

反映出：
- 空数组字面量和类型推断仍存在边界缺陷
- 新增复杂类型能力后，SQL 语义打磨还需继续

---

## 7. 待处理积压

以下条目虽然今日有更新，但值得维护者重点关注：

### 7.1 长期开启且可能影响优化器/统计信息的 Issue
- **Issue #53633** `[OPEN] __internal_schema.column_statistics is broken`  
  链接: apache/doris Issue #53633

**原因：**
- 今日唯一仍开放的活跃 Issue
- 可能影响统计信息采集与优化器效果
- 与部署配置相关，较容易在用户环境中复现出“隐蔽性故障”

---

### 7.2 长期未合并但具备现实价值的 PR
- **PR #56303** `[fix](prepare statement) Add placeholder literal for prepare stage.`  
  链接: apache/doris PR #56303
- **PR #56307** `[check](exchange) check PTransmitDataParams in send and recvr`  
  链接: apache/doris PR #56307
- **PR #56322** `ui: remove unused dependencies`  
  链接: apache/doris PR #56322
- **PR #56324** / **#56325** Elasticsearch 空表 object type 处理回补  
  链接: apache/doris PR #56324 / #56325
- **PR #56274** `branch-3.0: [fix](cases) add load ddl test cases #56263`  
  链接: apache/doris PR #56274

**原因：**
- 这些 PR 从 2025-09 挂起至今，很多已带 `Stale`
- 其中 prepare statement、exchange 参数校验、ES mapping 兼容等问题都有实际价值
- 如无继续推进计划，应明确关闭原因；如仍有价值，应重新拉起评审

---

### 7.3 被 stale 批量关闭的路线图型需求需要重新归档
建议维护者将以下需求迁移为：
- 统一 roadmap 文档
- 细粒度子任务
- design doc / epic issue

代表项：
- **Issue #55999**
- **Issue #56002**
- **Issue #56004**
- **Issue #56010**
- **Issue #56011**
- **Issue #56015**
- **Issue #56016**
- **Issue #56017**

否则容易给社区造成“方向仍重要，但公开跟踪入口消失”的观感。

---

## 8. 综合评价

今日 Apache Doris 的项目状态可以概括为：**稳定性修复扎实推进，4.1 分支活跃，湖仓/半结构化/云连接器方向持续增强，但 issue 池中存在较多通过 stale 机制清理的路线图与历史问题。**  
从工程视角看，今天最有价值的成果是 **ORC 崩溃修复、DECIMALV2 聚合支持补齐、以及 schema change / inverted index / MATCH / load 并发安全等一批关键修复的推进**。  
从产品路线看，**Lakehouse、多 Catalog、JSON/Variant、云存储接入** 依然是最清晰的演进主轴。  
建议维护者下一步重点关注：**Open 的统计信息故障、待合并的高优先级稳定性 PR、以及被 stale 关闭但仍具战略价值的路线图需求重新归档。**

如果你愿意，我还可以继续把这份日报整理成更适合内部汇报的两种格式：  
1. **适合发到飞书/钉钉群的精简版**  
2. **适合周报汇总的表格版（模块 / 风险 / 优先级）**

---

## 横向引擎对比

以下是基于 2026-03-22 各项目社区动态形成的横向对比分析报告。

---

# 开源 OLAP / 分析型存储引擎生态横向对比报告（2026-03-22）

## 1. 生态全景

当前 OLAP / 分析型存储开源生态整体呈现出两个并行趋势：一方面，**稳定性修复、分支回补、CI 和测试治理** 仍是各项目的高频主线；另一方面，**Lakehouse 访问、多 Catalog、半结构化数据、云原生连接器、查询执行资源控制** 持续成为新能力投入重点。  
从活跃度看，ClickHouse、Doris、Iceberg、Arrow 仍保持较强开发密度，DuckDB、StarRocks、Databend、Delta Lake 则表现出“围绕特定主线持续收敛”的节奏。  
从技术演进方向看，行业已从“单机/单库分析性能竞争”逐渐转向 **统一访问异构数据源、提升复杂类型处理能力、加强可运维性与正确性保障**。  
对用户而言，版本升级后**性能不回退、查询结果不出错、外部格式兼容稳定、云环境凭证与存储接入更易用**，正在成为比“新增多少功能”更重要的评价标准。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release 情况 | 今日主线 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 16 | 78 | 无 | ORC 崩溃修复、4.1 收敛、Lakehouse/Variant/云连接器增强 | **良好偏强** |
| **ClickHouse** | 24 | 188 | 无 | 26.2 回归修复、内存控制、Analyzer/Variant、CI 架构演进 | **高活跃，稳定性承压** |
| **DuckDB** | 9 | 15 | 无 | CLI/JSON 修复、JOIN 正确性、向量结构重构 | **稳健推进** |
| **StarRocks** | 1 | 7 | 无 | 外部 MV 刷新、OpenSearch connector、Iceberg DDL、窗口倾斜优化 | **良好，节奏偏聚焦** |
| **Apache Iceberg** | 8 | 19 | 无 | Spark rewrite 稳定性、REST batch load、V4 manifest、Flink sink | **积极推进但稳定性压力存在** |
| **Delta Lake** | 1 | 19 | 4.2.0 RC / 主干切到 4.2.0-SNAPSHOT | UC 托管表、SSP OAuth、Kernel/CDC、发布前收敛 | **良好，进入版本收敛期** |
| **Databend** | 0 | 9 | **v1.2.888-patch-2** | SQL parser 正确性、UNLOAD 兼容、Fuse 重构、优化器 type shrinking | **良好，工程推进稳定** |
| **Velox** | 0 | 43 | 无 | Iceberg 写入/统计兼容、Join 稳定性、Presto/Spark 兼容增强 | **良好偏强** |
| **Apache Gluten** | 3 | 6 | 无 | 测试体系纠偏、collect_list 正确性、Velox 指标补齐 | **稳定，偏质量打磨** |
| **Apache Arrow** | 19 | 3 | 无 | 积压清理、Apple clang 构建兼容、Ruby metadata/benchmark、ORC pushdown 讨论 | **良好，偏维护型推进** |

### 简要判断
- **超高活跃层**：ClickHouse、Doris  
- **高活跃层**：Velox、Iceberg、Delta Lake  
- **中活跃层**：DuckDB、Databend、Arrow  
- **聚焦型推进层**：StarRocks、Gluten  

---

## 3. Apache Doris 在生态中的定位

### 3.1 相比同类的优势

**Doris 当前最突出的优势是“统一分析平台”的产品化完整度。**  
与 ClickHouse、DuckDB 这类更偏单引擎执行能力突出的项目相比，Doris 近阶段表现出更明确的综合平台路线：

- **Lakehouse / 多 Catalog / 外表访问** 同步推进  
- **云原生存储接入** 持续增强，如 OSS native storage vault + STS AssumeRole
- **半结构化 / Variant / 倒排索引 / MATCH** 等融合分析能力持续强化
- **稳定分支回补节奏明确**，4.1 主线收敛明显，同时兼顾 4.0/3.1 backport

这使 Doris 更像一个“**面向企业数据平台的一体化分析底座**”，而不是单纯的高速查询引擎。

### 3.2 技术路线差异

与主要同类相比：

- **对 ClickHouse**：  
  ClickHouse 在执行引擎、资源控制、功能扩张速度上更激进，尤其在 AI SQL 函数、HTTP handler、CI 基础设施等方向更前沿；  
  Doris 则更强调 **Lakehouse 统一访问、云化部署、SQL/索引/半结构化融合** 的平台路线。

- **对 StarRocks**：  
  两者都在向 Lakehouse + 异构查询平台演进，但 Doris 今天的信号更偏 **广覆盖能力收敛**，StarRocks 更偏 **MV、连接器和优化器增量演进**。  
  Doris 的社区活跃度和 PR 密度今天明显更高。

- **对 DuckDB**：  
  DuckDB 更偏嵌入式/本地分析引擎与开发者工具生态，Doris 则面向分布式、多租户、生产级数仓平台。

- **对 Iceberg / Delta / Arrow / Velox**：  
  这些更多是格式、元数据、执行层或基础组件；Doris 则是完整数据库产品，位于更上层。

### 3.3 社区规模对比

从今日数据看：

- Doris：**16 Issues / 78 PR**
- ClickHouse：**24 / 188**
- StarRocks：**1 / 7**
- DuckDB：**9 / 15**
- Databend：**0 / 9**

结论上，**Doris 社区规模与开发密度已稳居开源 OLAP 第一梯队，仅次于 ClickHouse 的超高活跃度**；相比 StarRocks、Databend 等同类项目，Doris 在今日体现出更强的主线并行能力和版本治理力度。

---

## 4. 共同关注的技术方向

以下需求在多个项目中同时出现，说明已成为行业共性主线。

### 4.1 Lakehouse / 多数据源统一访问
**涉及项目：Doris、StarRocks、ClickHouse、Iceberg、Delta Lake、Velox、Arrow**

具体体现：
- Doris：data lake reader 重构、多 Catalog、OSS storage vault
- StarRocks：Iceberg DDL、外部 MV、OpenSearch connector
- ClickHouse：Iceberg local table attach/detach、Iceberg 兼容修复
- Iceberg：REST Catalog batch load、Hive migration、Spark/Flink/Kafka Connect 集成
- Delta Lake：REST Catalog API、UC Managed Tables、SSP 凭证刷新
- Velox：Iceberg connector 解耦、Iceberg-compatible stats
- Arrow：ORC Dataset pushdown / stripe filtering

**共性诉求：**
- 统一访问对象存储与表格式
- 降低异构系统之间的数据搬运成本
- 在引擎侧直接感知格式与元数据能力边界

---

### 4.2 半结构化 / Variant / JSON 能力增强
**涉及项目：Doris、ClickHouse、Delta Lake、DuckDB**

具体体现：
- Doris：Variant nested predicate、MATCH crash 修复、倒排索引 reader 确定性、json_each/json_each_text
- ClickHouse：Variant adaptor 正确性、arrayFirst/arrayLast Variant 类型问题
- Delta Lake：Kernel Variant GA feature
- DuckDB：JSON copy、json_serialize_sorted、json_deep_merge

**共性诉求：**
- 在 SQL 引擎内直接处理 JSON/Variant
- 保证复杂类型表达式的正确性与类型推导稳定
- 支撑搜索分析、半结构化 ETL、数据服务一体化

---

### 4.3 查询正确性与边界语义修复
**涉及项目：Doris、ClickHouse、DuckDB、Gluten、Databend、Iceberg**

典型问题：
- Doris：MATCH crash、schema change 副本追平保护、倒排 reader 不确定性
- ClickHouse：Variant 错误静默返回 0 行、duplicate alias、26.2 写入回归
- DuckDB：ASOF LEFT JOIN 语义错误、TRY_CAST 与文档不一致、CLI segfault
- Gluten：collect_list + sort by 结果错误
- Databend：UNION 括号丢失导致 panic
- Iceberg：drop highest field ID column 失败

**共性诉求：**
- 查询结果必须可预测、边界 case 不可静默出错
- 分析引擎成熟度越来越取决于“正确性细节”

---

### 4.4 执行引擎内存与资源控制
**涉及项目：ClickHouse、Velox、Iceberg、Gluten、Doris**

具体体现：
- ClickHouse：限制 UNION ALL 活跃流数量，减少峰值内存；26.2 性能/写入回归
- Velox：lazy loading 与 reclaim 时序优化、Join 执行稳定性
- Iceberg：Spark rewrite 死锁/连接耗尽、内存泄漏
- Gluten：明明有内存却 OOM
- Doris：load 关闭标志并发安全、connector 内存泄漏

**共性诉求：**
- 大查询不能因资源放大或生命周期管理失控而崩
- 需要更精细的执行阶段内存治理与可观测性

---

### 4.5 CI、测试可信度与工程质量治理
**涉及项目：ClickHouse、Delta Lake、Gluten、Arrow、DuckDB、Doris**

典型方向：
- ClickHouse：从 GitHub Actions 向 native CI execution engine 演进；随机化测试诊断
- Delta Lake：flaky tests 收敛
- Gluten：PlanStability 测试原来没真正启用插件，开始系统纠偏
- DuckDB：CLI/JSON 快速回归修补
- Arrow：积压 stale 清理、构建兼容修复
- Doris：Mac 编译修复、长期 stale issue/PR 清理

**共性诉求：**
- 项目越成熟，测试可信度和 CI 可扩展性越重要
- 工程化治理已成为核心竞争力的一部分

---

## 5. 差异化定位分析

## 5.1 存储格式与生态位置

| 项目 | 主要定位 |
|---|---|
| **Doris / ClickHouse / StarRocks / Databend / DuckDB** | 面向查询执行与数据分析的数据库/引擎 |
| **Iceberg / Delta Lake** | 表格式与元数据层，连接多引擎 |
| **Velox / Arrow / Gluten** | 执行层/内存层/加速层基础设施 |

### 观察
- **Doris / StarRocks**：更像“统一数据分析平台”
- **ClickHouse**：高性能分析数据库，功能边界仍在快速扩张
- **DuckDB**：嵌入式分析数据库
- **Databend**：云原生数仓路线更明显
- **Iceberg / Delta**：控制面与表格式标准化
- **Velox / Arrow / Gluten**：成为多引擎共享底层能力的基础设施

---

## 5.2 查询引擎设计差异

- **ClickHouse**：执行层与资源控制优化极强，持续向更多工作负载拓展
- **Doris**：分布式 OLAP + 湖仓统一查询 + 搜索分析融合
- **StarRocks**：强调 MV、查询优化和外部数据访问整合
- **DuckDB**：单机/嵌入式、开发者友好、快速本地分析
- **Velox**：作为共享执行引擎，为 Presto/Spark/Gluten 等服务
- **Gluten**：Spark 加速层，而非独立数据库

---

## 5.3 目标负载类型差异

| 项目 | 目标负载 |
|---|---|
| **Doris** | 企业数仓、实时报表、湖仓联邦查询、半结构化分析 |
| **ClickHouse** | 高并发 OLAP、日志分析、监控、交互式分析 |
| **StarRocks** | 实时报表、外部表加速、物化视图驱动分析 |
| **DuckDB** | 本地分析、嵌入式计算、数据科学工作流 |
| **Databend** | 云数仓、对象存储为中心的分析 |
| **Iceberg / Delta** | 跨引擎数据湖表管理、批流一体元数据层 |
| **Velox / Gluten** | 上层引擎加速与执行卸载 |
| **Arrow** | 列式内存交换、格式与计算基础库 |

---

## 5.4 SQL 兼容性路线差异

- **Doris**：SQL 能力扩展与复杂类型兼容同步推进，偏“数据库产品化”
- **ClickHouse**：Analyzer、Variant、视图/DDL 语义快速迭代，但边界正确性仍是热点
- **DuckDB**：对 PostgreSQL 风格与 CLI/脚本行为兼容高度敏感
- **StarRocks**：更多聚焦 Iceberg DDL 与查询提示/优化能力
- **Databend**：parser/AST 往返正确性更受关注
- **Delta / Iceberg**：SQL 兼容主要体现在接入 Spark/Flink/REST Catalog 的生态接口，而非纯查询语法竞争

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：高速迭代核心项目
- **ClickHouse**
- **Apache Doris**

特点：
- PR/Issue 数量都高
- 主线并行很多
- 稳定性修复与新能力同时推进
- 社区规模大，分支维护频繁

### 第二层：强主线推进型
- **Apache Iceberg**
- **Delta Lake**
- **Velox**

特点：
- 活跃度高，但更围绕明确主线
- 分别聚焦格式层、catalog/UC、执行层/Iceberg 兼容

### 第三层：稳健工程推进型
- **DuckDB**
- **Databend**
- **Apache Arrow**

特点：
- 节奏更均衡
- 偏向正确性、构建体验、基础能力补齐
- 属于“持续优化+有限扩张”模式

### 第四层：聚焦打磨型
- **StarRocks**
- **Apache Gluten**

特点：
- 更新量不大，但信号集中
- 更像在重点领域集中投入，如 MV / connector 或测试纠偏

---

## 6.2 哪些处于快速迭代阶段，哪些处于质量巩固阶段

### 快速迭代阶段
- **ClickHouse**：功能边界持续外扩，实验性特性多
- **Doris**：4.1 收敛中仍保持多个方向并行
- **Iceberg**：REST/V4/Flink/Spark 线路都在推进
- **Velox**：Iceberg、Presto、Spark 多线增强

### 质量巩固阶段
- **Delta Lake**：明显进入 4.2.0 RC 收敛
- **DuckDB**：近期更注重正确性和 CLI/格式细节
- **Gluten**：测试体系和语义正确性优先
- **Arrow**：偏 backlog 清理、构建兼容与绑定补齐

---

## 7. 值得关注的趋势信号

## 7.1 “统一数据入口”正在替代“单库最强性能”成为竞争焦点
Doris、StarRocks、ClickHouse、Delta、Iceberg 都在增强 catalog、connector、外部格式和对象存储接入。  
**对架构师的意义**：未来选型不再只看单表扫描速度，而要看能否成为 **统一查询平面**。

---

## 7.2 半结构化数据已从附加能力变成主战场
Doris、ClickHouse、Delta、DuckDB 都在加码 Variant/JSON。  
**对数据工程师的意义**：JSON/Variant 不再适合作为旁路处理，越来越适合在主 SQL 引擎内直接建模和分析，但前提是关注类型边界与正确性成熟度。

---

## 7.3 正确性问题的优先级正在上升
大量热点不是新功能，而是：
- ASOF JOIN 错误
- Variant 静默返回空结果
- collect_list 顺序错乱
- schema evolution 失败
- MATCH crash  
**这说明行业正在从“功能可用”进入“结果可信”阶段。**

---

## 7.4 云环境下的凭证、身份和存储接入能力成为标配
Doris 的 OSS + STS、Delta 的 OAuth refresh、Velox/GCS、Iceberg/REST Catalog 都说明：  
**云原生访问控制和对象存储整合已成为基础能力，不再是附加选项。**

---

## 7.5 测试可信度与 CI 架构将成为下一轮分水岭
ClickHouse 在讨论原生 CI 执行引擎，Gluten 在修正“测试其实没覆盖到产品路径”，Delta/Arrow/Doris 都在做测试与 stale 清理。  
**对技术负责人而言**：评估项目成熟度时，不能只看 feature velocity，还要看其质量治理体系是否跟得上。

---

## 7.6 Lakehouse 生态正在从“可读”走向“可管理、可优化、可写入”
从 Iceberg DDL、Delta UC、Velox Iceberg 写路径、Arrow ORC pushdown、Doris data lake reader 重构可见：  
下一阶段竞争重点是：
- 更好的 metadata 操作
- 更深的格式感知优化
- 更完整的写入/维护能力  
而不仅仅是“能查询外部表”。

---

# 总体结论

如果把今天的生态动态压缩成一句话：  
**开源分析引擎正在从“高性能查询工具”集体演进为“统一湖仓访问 + 半结构化分析 + 云原生治理 + 强正确性保障”的综合数据平台能力栈。**

对 Apache Doris 而言，它当前处在一个相对有利的位置：  
- 社区活跃度高于大多数同类项目  
- 产品路线清晰，Lakehouse / Variant / 云接入主线明确  
- 同时保有较强的稳定分支治理能力  

但与 ClickHouse 相比，Doris 仍需继续强化其在**执行层极致性能、问题闭环效率和生态影响力**上的竞争表现；与 StarRocks 相比，则已在**社区规模和多线推进能力**上体现出更强势头。

---

如果你愿意，我下一步可以继续输出这份报告的两个衍生版本：

1. **管理层 1 页摘要版**  
2. **研发/架构评审用表格版（按项目 × 技术方向 × 风险等级）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，ClickHouse 项目保持**高活跃度**：Issues 更新 24 条、PR 更新 188 条，说明核心开发、CI 修复、回归处理和功能演进都在同步推进。  
从内容看，今日重点集中在 **26.2 版本回归修复、查询执行内存优化、Analyzer/Variant 正确性问题、Iceberg 生态兼容性** 以及 **CI 基础设施演进**。  
PR 侧出现多条面向稳定分支的 cherry-pick/backport，表明维护者正在积极把关键修复向 26.2、26.1、25.x 分支回灌，项目稳定性治理较为主动。  
同时，实验性方向也在扩张，例如 **SQL 内置 AI 函数**、**HTTP HANDLER DDL**、**Rust 子模块替换**，显示 ClickHouse 仍在持续扩大分析引擎边界。  
整体判断：**项目健康度良好，开发强度高，但 26.2 附近仍存在值得关注的性能与正确性回归风险。**

---

## 2. 项目进展

> 注：给定数据未直接列出“已合并 PR 明细”，以下以今日最重要的活跃 PR 与已关闭 Issue 所反映的实质进展为主。

### 2.1 查询执行与内存控制持续优化

- **限制 UNION ALL 同时活跃流数以降低峰值内存**
  - PR: #100176  
  - 链接: ClickHouse/ClickHouse PR #100176
  - 价值：针对多分支 `UNION ALL` 场景，避免一次性打开过多 read buffer，减少“分支数 × 列数 × buffer_size”带来的内存放大。这类优化对宽表、复杂联邦查询、BI 自动生成 SQL 尤其重要。
  - 影响判断：若合并，将直接改善大查询的**内存稳定性与资源利用率**。

- **修复 distributed index analysis 导致的二次数量级查询放大**
  - PR: #100287  
  - 链接: ClickHouse/ClickHouse PR #100287
  - 价值：解决分布式索引分析过程中的**quadratic number of queries**问题，属于典型的执行规划/远端探测放大缺陷。
  - 影响判断：对大规模分片集群是重要修复，可改善**元数据探测成本、延迟与控制面压力**。

- **按声明顺序执行 ALTER 命令**
  - PR: #100288  
  - 链接: ClickHouse/ClickHouse PR #100288
  - 价值：这类改动虽然标记为 `not for changelog`，但对 DDL 语义一致性很重要。复杂 ALTER 组合场景中，执行顺序可能影响列依赖、默认值、类型变更结果。
  - 影响判断：有助于减少 DDL 行为“看似合法但执行结果不符合直觉”的问题。

### 2.2 SQL 兼容性与语义正确性继续补强

- **修复 CREATE VIEW 中 WITH 函数表达式别名在 IN 子句下失效**
  - PR: #100042  
  - 链接: ClickHouse/ClickHouse PR #100042
  - 价值：涉及 AST 替换与标识符解析逻辑，属于 Analyzer/语法树访问器层面的正确性修复。
  - 技术意义：对复杂 SQL、视图定义和兼容 PostgreSQL/MySQL 风格写法的用户很关键。

- **修复 system.primes 对 `max_rows_to_read` 的遵守问题**
  - PR: #100199  
  - 链接: ClickHouse/ClickHouse PR #100199
  - 价值：系统表/表函数对资源限制设置的遵守，是 ClickHouse 一贯强调的执行可控性的一部分。
  - 技术意义：虽然不是核心业务表，但体现了系统组件在配额/限制语义上的一致性。

- **函数压力测试后续修复**
  - PR: #100270  
  - 链接: ClickHouse/ClickHouse PR #100270
  - 价值：表明最近在函数系统上做了更系统性的 stress test，且已发现并修补若干边界问题。
  - 技术意义：通常这类 PR 会提升**表达式引擎鲁棒性**，并减少 fuzz/testing 类 issue 的新增。

### 2.3 存储/格式生态方向持续推进

- **允许 attach/detach Iceberg local tables**
  - PR: #91583  
  - 链接: ClickHouse/ClickHouse PR #91583
  - 价值：提升 Iceberg 本地表的生命周期管理能力，对数据湖运维和表恢复有实际意义。
  - 背景对应：今日仍有多个 Iceberg 相关 bug/兼容问题，说明该方向仍在快速迭代中。

- **以 Rust `h3o` 替换 H3 C 库**
  - PR: #100272  
  - 链接: ClickHouse/ClickHouse PR #100272
  - 价值：通过 Rust FFI 包装保持 C API 兼容，同时替换底层实现。
  - 技术意义：这是较有代表性的工程信号：ClickHouse 正在尝试在特定基础组件上引入 Rust，以改善**安全性、可维护性或生态复用**。
  - 风险提示：涉及子模块变更和 FFI，后续需重点关注构建链、ABI 行为和性能回归。

### 2.4 新能力探索明显加速

- **实现 CREATE/DROP/ALTER HANDLER**
  - PR: #100203  
  - 链接: ClickHouse/ClickHouse PR #100203
  - 价值：允许通过 SQL 动态管理自定义 HTTP handlers，而非手改 XML。
  - 技术意义：这会显著提升 ClickHouse 在**服务化接口、轻量 API 暴露、内部工具集成**上的可操作性。

- **新增实验性 AI 函数**
  - PR: #99579  
  - 链接: ClickHouse/ClickHouse PR #99579
  - 包含：`LLMClassify`, `LLMExtract`, `LLMGenerateSQL`, `LLMTranslate`, `LLMGenerateContent`, `generateEmbedding`, `generateEmbeddingOrNull`
  - 价值：使 ClickHouse 能直接从 SQL 调用外部 LLM/Embedding 服务。
  - 技术意义：这是明显的产品边界扩展，意图把分析数据库进一步推向**“数据 + 推理调用 + 检索增强”**工作流。

---

## 3. 社区热点

### 3.1 实习任务路线图帖仍是最高讨论量入口
- Issue: #87836 `Intern Tasks 2025/2026`
- 链接: ClickHouse/ClickHouse Issue #87836
- 评论: 71

这是今日评论量最高的 Issue，虽然不是 bug，但它持续承担了**社区任务池、低门槛切入点、路线图外延池**的功能。  
背后信号是：ClickHouse 维护者仍在有意识地把一些工程债、易上手特性、研究性课题整理成可被新人承接的入口，这对社区供给和长期活跃度是正向指标。

### 3.2 26.2 INSERT 性能回归是最值得关注的用户反馈
- Issue: #99241 `INSERT queries are 3x slower after upgrading from 25.12 to 26.2`
- 链接: ClickHouse/ClickHouse Issue #99241
- 评论: 21

这是今日最重要的用户侧性能问题之一。  
从描述看，**相同 ReplacingMergeTree 表定义、相同 INSERT 查询，在 26.2 比 25.12 慢 3 倍**。  
这类问题背后的技术诉求很明确：用户升级稳定版时，最敏感的不是新功能，而是**写入吞吐不退化**。如果后续定位到 merge、索引、压缩、去重或 pipeline 初始化变更，影响面可能较大。

### 3.3 CI 崩溃与基础设施议题仍很热
- Issue: #99799 `[CI crash] Double deletion of MergeTreeDataPartCompact in multi_index`
- 链接: ClickHouse/ClickHouse Issue #99799
- 评论: 12

- Issue: #100296 `[CI crash] Failed preparation of data source in pipeline execution`
- 链接: ClickHouse/ClickHouse Issue #100296
- 评论: 5

- Issue: #100291 `RFC: Migrating from GitHub Actions to a Native CI Execution Engine`
- 链接: ClickHouse/ClickHouse Issue #100291

CI 崩溃问题仍频繁出现，而 RFC 直接提出从 GitHub Actions 向原生执行引擎迁移，说明维护者已经不只是在“修单点故障”，而是在考虑**整套 CI 执行架构的演进**。  
这背后的真实诉求包括：  
1. 降低 GitHub Actions 生态限制；  
2. 提高大规模矩阵任务调度效率；  
3. 更好整合 Praktika 的编排、产物、重试和可观测性。

### 3.4 Analyzer 与 Variant 相关正确性问题升温
- Issue: #85895 `Duplicate alias does not work with distributed table`
- 链接: ClickHouse/ClickHouse Issue #85895

- Issue: #100251 `FunctionVariantAdaptor silently returns 0 rows in WHERE when all Variant alternatives are incompatible`
- 链接: ClickHouse/ClickHouse Issue #100251

- Issue: #100253 `arrayFirst/arrayLast returned wrong type for some variant types`
- 链接: ClickHouse/ClickHouse Issue #100253

可以看出，随着 ClickHouse 类型系统和新 Analyzer 持续增强，**别名解析、分布式语义、Variant 类型推导/执行** 正在成为高频细节区。  
这通常意味着：功能越来越强，但边角组合用法需要更多回归测试覆盖。

---

## 4. Bug 与稳定性

以下按严重程度排序，并标注是否已见到可能相关修复线索。

### P1：26.2 写入性能严重回归
- Issue: #99241  
- 链接: ClickHouse/ClickHouse Issue #99241
- 问题：从 25.12 升级到 26.2 后，`INSERT` 变慢约 3 倍。
- 影响：直接影响生产写入吞吐，属于**高优先级回归**。
- 已有 fix PR：**未在给定数据中看到明确对应修复 PR**。
- 建议关注：26.2 分支上与 MergeTree、异步插入、索引/去重、pipeline 初始化有关的修复。

### P1：MergeTree 相关 use-after-free
- PR: #99483 `Fix heap-use-after-free in MergeTreeReadTask::createReaders`
- 链接: ClickHouse/ClickHouse PR #99483
- 问题：读取任务创建 readers 时存在 heap-use-after-free。
- 影响：涉及核心存储引擎读取路径，且标记 `pr-must-backport, pr-critical-bugfix`，严重级别高。
- 状态：**已有关键修复 PR，且明显计划回灌稳定分支。**

### P1：CI 崩溃——双重释放
- Issue: #99799  
- 链接: ClickHouse/ClickHouse Issue #99799
- 问题：`MergeTreeDataPartCompact` 在 `multi_index` 相关路径出现 double deletion。
- 影响：如果根因存在于真实代码路径而非纯测试环境，潜在风险较高。
- 已有 fix PR：**未看到明确一一对应 PR**。

### P1：数据源准备阶段崩溃
- Issue: #100296  
- 链接: ClickHouse/ClickHouse Issue #100296
- 问题：pipeline 执行阶段 “Failed preparation of data source”。
- 影响：属于执行引擎初始化阶段问题，若可复现到用户场景会影响较广。
- 已有 fix PR：**未明确看到对应 PR**。

### P2：Variant 类型系统正确性问题
- Issue: #100251  
- 链接: ClickHouse/ClickHouse Issue #100251
- 问题：`WHERE` 中 Variant 所有候选类型都不兼容时，静默返回 0 行，而不是报错。
- 影响：这是**查询正确性问题**，比性能问题更隐蔽，可能导致错误分析结论。
- 已有 fix PR：**未见明确对应 PR**。

- Issue: #100253  
- 链接: ClickHouse/ClickHouse Issue #100253
- 问题：`arrayFirst/arrayLast` 在某些 Variant 类型下返回错误类型/值。
- 影响：表达式求值与类型系统一致性受损。
- 已有 fix PR：**未见明确对应 PR**。

### P2：分布式表 + 重复别名问题
- Issue: #85895  
- 链接: ClickHouse/ClickHouse Issue #85895
- 问题：distributed table 上 duplicate alias 导致 `NUMBER_OF_COLUMNS_DOESNT_MATCH`。
- 影响：Analyzer/分布式 SQL 兼容性问题，影响复杂查询迁移。
- 已有 fix PR：可能与 **#88043 Optimize Analyzer with repeat aliases** 存在方向关联，但**并不能确认直接修复该 issue**。
  - PR: #88043  
  - 链接: ClickHouse/ClickHouse PR #88043

### P2：Iceberg v2 元数据解析失败
- Issue: #100304  
- 链接: ClickHouse/ClickHouse Issue #100304
- 问题：`IcebergS3` 无法解析合法的 Iceberg v2 metadata，报 `Invalid access: Can not convert empty value`。
- 影响：数据湖接入兼容性问题，阻碍 Iceberg 用户接入。
- 已有 fix PR：**未见直接对应 PR**。
- 相关演进：#91583 在推进 Iceberg 本地表 attach/detach，说明 Iceberg 方向活跃但兼容性仍需打磨。

### P3：MaterializedPostgreSQL 列数不匹配
- Issue: #83776  
- 链接: ClickHouse/ClickHouse Issue #83776
- 问题：上游 PostgreSQL 增加列后，MaterializedPostgreSQL 同步出现 “Columns number mismatch”。
- 影响：跨库 CDC/复制链路稳定性受影响。
- 已有 fix PR：**未见明确对应 PR**。
- 备注：这是很典型的真实生产场景痛点，值得提高优先级。

### P3：测试与 CI 稳定性治理继续进行
- Issue: #100178 `Idea: diagnose tests failed due to randomized settings.`
- 链接: ClickHouse/ClickHouse Issue #100178

- PR: #97547 `Randomize more optimize_* settings in clickhouse-test`
- 链接: ClickHouse/ClickHouse PR #97547

- PR: #100301 `Filter ASan false positive warnings in test runner stderr-fatal checks`
- 链接: ClickHouse/ClickHouse PR #100301

这组动态说明：维护者一方面在扩大随机化测试覆盖，另一方面也在补诊断与降噪能力，以减少 sanitizer false positive 和 flaky 处理成本。

---

## 5. 功能请求与路线图信号

### 5.1 HTTP Handler SQL 化管理，进入可实现阶段
- PR: #100203  
- 链接: ClickHouse/ClickHouse PR #100203

`CREATE/DROP/ALTER HANDLER` 已有具体实现 PR，而不再只是概念讨论。  
这意味着该能力**很有可能进入后续版本**，并成为 ClickHouse 面向 HTTP 服务编排的一项新管理接口。  
潜在用户：内部平台、轻量 API 服务、数据产品网关、Webhook 风格场景。

### 5.2 AI/Embedding SQL 函数是明显的新路线
- PR: #99579  
- 链接: ClickHouse/ClickHouse PR #99579

虽然标记为 experimental，但一次性引入 7 个 AI 函数，说明这并非试验性“玩具功能”，而是有明确方向感。  
若后续落地，ClickHouse 可能强化以下定位：  
- 数据预处理 + LLM 调用编排  
- 向量/Embedding 生成与入库  
- SQL 侧原位提取、分类、翻译、生成

### 5.3 对 `system.error_log` 增强可观测性仍有需求
- Issue: #74561  
- 链接: ClickHouse/ClickHouse Issue #74561

用户希望为 `system.error_log` 增加更多类似 `system.trace_log` 的上下文字段。  
这是比较务实的功能诉求，目标不是炫技，而是**降低排障时间、增强生产可观测性**。  
从项目方向看，这类改动很符合 ClickHouse 当前“稳定性工程化”的主线，值得被纳入中短期版本。

### 5.4 平均值函数支持 Date/DateTime 已闭环
- Issue: #89030  
- 链接: ClickHouse/ClickHouse Issue #89030

该 feature request 已关闭，表明相关需求大概率已被实现或通过其他 PR 闭合。  
这是 SQL 语义补完的典型例子：面向用户体验层面的“小特性”，但对 BI/分析用户很实用。

### 5.5 CTE MATERIALIZED 语义需求已关闭
- Issue: #53449  
- 链接: ClickHouse/ClickHouse Issue #53449

该 issue 有较高 👍（47），今日关闭，说明这一长期 SQL 兼容性诉求已有明确处理结果。  
无论是直接支持还是通过替代方案闭合，都说明 ClickHouse 正持续回应更标准化的 SQL 语义期待。

---

## 6. 用户反馈摘要

### 6.1 升级后最怕性能回退，尤其是写路径
- 代表 Issue: #99241  
- 链接: ClickHouse/ClickHouse Issue #99241

真实用户反馈显示，升级到 26.2 后写入吞吐显著下降。  
这说明在企业用户眼中，**版本升级的首要考核指标仍然是性能稳定性而非新功能数量**。  
对维护者而言，这类回归需要优先给出 root cause、规避参数或 backport 计划。

### 6.2 湖仓格式兼容性正在变成采用门槛
- 代表 Issues: #100304, #96811, #87890  
- 链接:
  - ClickHouse/ClickHouse Issue #100304
  - ClickHouse/ClickHouse Issue #96811
  - ClickHouse/ClickHouse Issue #87890

Iceberg 相关问题覆盖了 metadata 解析、chunk 列数逻辑错误、长度异常等多个面。  
这反映出用户已把 ClickHouse 视作**湖仓查询/接入引擎**，但对 Iceberg 兼容性的成熟度仍有更高期待。

### 6.3 连接器/同步链路对 schema evolution 很敏感
- 代表 Issue: #83776  
- 链接: ClickHouse/ClickHouse Issue #83776

MaterializedPostgreSQL 在上游加列后出现不匹配，是典型的 schema evolution 痛点。  
这类问题一旦发生，往往影响持续同步链路，属于用户最希望“自动处理/平滑兼容”的部分。

### 6.4 新类型系统增强后，用户更在意“错要报出来”
- 代表 Issues: #100251, #100253  
- 链接:
  - ClickHouse/ClickHouse Issue #100251
  - ClickHouse/ClickHouse Issue #100253

Variant 问题里，用户最关心的不是功能是否存在，而是：  
- 类型不兼容时不能静默吞掉；  
- 返回值类型必须稳定可预期。  
这代表 ClickHouse 用户群体已经进入更复杂、更严格的数据建模和表达式使用阶段。

---

## 7. 待处理积压

以下是值得维护者额外关注的长期或具有持续风险信号的事项。

### 7.1 Analyzer 重复别名 / 分布式场景问题
- Issue: #85895  
- 链接: ClickHouse/ClickHouse Issue #85895
- 创建时间较早：2025-08-19  
- 风险：长期未完全解决的 Analyzer 问题可能在更多复杂 SQL 场景中继续暴露。
- 相关 PR：#88043  
  - 链接: ClickHouse/ClickHouse PR #88043

### 7.2 system.error_log 可观测性增强需求
- Issue: #74561  
- 链接: ClickHouse/ClickHouse Issue #74561
- 创建时间较早：2025-01-14  
- 风险：虽是 easy task，但长期未落地说明可观测性细节可能被更高优先级工作挤压。
- 建议：这类“低成本提升运维体验”的问题适合尽快消化。

### 7.3 Iceberg attach/detach 改进 PR 长期开启
- PR: #91583  
- 链接: ClickHouse/ClickHouse PR #91583
- 创建时间较早：2025-12-05  
- 风险：Iceberg 方向当前 bug 较多，相关基础能力 PR 若长期不落地，会影响生态信心。

### 7.4 随机化测试扩展与故障诊断体系需成套推进
- PR: #97547  
- 链接: ClickHouse/ClickHouse PR #97547
- Issue: #100178  
- 链接: ClickHouse/ClickHouse Issue #100178
- 风险：如果只增加随机化而不提升失败最小化、复现和归因能力，CI 噪音可能进一步升高。

---

## 8. 结论

今天的 ClickHouse 呈现出一个典型的“高速迭代中的成熟基础设施项目”状态：

- **强项**：开发活跃、修复响应快、稳定分支回灌积极、前沿功能探索大胆。  
- **风险点**：26.2 性能回归、Variant/Analyzer 正确性、Iceberg 兼容性、CI 崩溃噪音。  
- **积极信号**：核心团队不仅在修 bug，也在推进 CI 架构升级、执行引擎资源控制和 SQL 能力扩展。  

如果从用户视角评估，当前最应持续跟踪的是：  
1. 26.2 写入性能回归是否得到明确修复；  
2. MergeTree 关键内存安全修复是否快速回灌；  
3. Iceberg 和 MaterializedPostgreSQL 的兼容性问题是否形成连续修复链。  

总体上，**项目健康度保持高位，但稳定性治理仍是短期主旋律。**

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时 DuckDB 维持中高活跃度：Issues 更新 9 条、PR 更新 15 条，说明社区反馈与核心开发都较为活跃。  
本日没有新版本发布，但有 3 个 PR/Issue 进入关闭状态，显示维护者在持续消化近期回归与 CLI/JSON 相关问题。  
从内容看，今日焦点集中在 **CLI 输出正确性、JOIN 查询语义正确性、Parquet/JSON 写出细节、内部执行与向量结构重构**。  
整体健康度评价为 **稳定推进中**：一方面有多个已确认并关闭的缺陷，另一方面仍存在 **segfault、ASOF JOIN 结果错误、TRY_CAST 行为与文档不一致** 等值得优先处理的问题。

---

## 3. 项目进展

### 已关闭 / 已落地的关键修复

#### 1) 修复 JSON `COPY TO` 双重绑定问题
- **PR**: #21522 Make JSON copy to file no longer bind twice  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21522

**进展解读：**  
该 PR 直接对应 Issue #21466，修复 `COPY (FROM read_json('/dev/stdin')) TO '/dev/stdout' (FORMAT json)` 失败的问题。  
从摘要看，问题根源在于 JSON copy 写出路径会对输入查询做两次 bind：一次推断类型，一次执行生成查询，这不仅有性能问题，也会让某些输入场景直接失败。  
这项修复推进了：
- **JSON 导入导出链路稳定性**
- **STDIN/STDOUT 管道场景兼容性**
- **Binder/执行器行为一致性**

对应 Issue：
- **Issue**: #21466 `[CLOSED] JSON COPY TO from STDIN to STDOUT with (FORMAT json) fails`
- **链接**: duckdb/duckdb Issue #21466

---

#### 2) 修复路径后缀拼接逻辑中的临时目录 bug
- **PR**: #21527 Unify adding suffixes to path in `Path:: AddSuffixToPath` - fix temp directory split bug  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21527

**进展解读：**  
这个修复聚焦文件路径处理一致性，尤其是带 URL 参数或 query string 的数据库路径。  
DuckDB 在给数据库路径追加 `.wal` / `.tmp` 后缀时，对 `?param=value` 这类路径分割处理不一致，可能导致临时目录或 WAL 路径生成错误。  
这类问题虽然不直接影响 SQL 语义，但会影响：
- **文件系统兼容性**
- **远程/特殊 URI 路径处理**
- **持久化和临时文件管理稳定性**

---

#### 3) 向量头文件拆分重构已关闭
- **PR**: #21526 Move vector types / vector buffer types to different headers  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21526

**进展解读：**  
这是一次内部代码组织调整，虽然不直接暴露为用户功能，但说明 DuckDB 仍在持续整理核心向量执行层代码结构。  
这通常有利于：
- 降低编译耦合
- 提高模块清晰度
- 为后续向量/执行器优化铺路

---

### 今日仍在推进的重要 PR

#### 4) StructVector 与 DataChunk 表示统一
- **PR**: #21534 Make StructVector have the same layout as DataChunk (vector<Vector>)
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21534

**技术意义：**  
将 `StructVector` 从 `vector<unique_ptr<Vector>>` 统一为 `vector<Vector>`，使其与 `DataChunk` 布局一致。  
这是一项很重要的底层执行引擎整合工作，价值在于：
- 简化泛型向量处理代码
- 降低结构体列与 chunk 之间的适配成本
- 为未来表达式执行、嵌套类型优化、代码复用打基础

---

#### 5) 修复 Parquet 字典索引 bit width 计算
- **PR**: #21532 Fix Parquet dictionary index bit widths
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21532

**技术意义：**  
Parquet writer 对 dictionary id 的 bit width 计算使用了 `value_count` 而非最大 dictionary id，导致在基数为 2 的幂次时会多占 1 bit。  
这属于典型的 **存储格式编码细节修复**，对以下方面有价值：
- Parquet 输出正确性/规范兼容性
- 压缩效率
- 与其他 Parquet 消费方互操作性

---

#### 6) Window catalog 正式化
- **PR**: #21446 Internal #8472: Window Catalog Entries
- **状态**: OPEN, Ready For Review
- **链接**: duckdb/duckdb PR #21446

**技术意义：**  
该 PR 将 WindowFunctionCatalogEntry 从 mock 实现替换为真实 Catalog Entry，并新增 `CatalogType::WINDOW_FUNCTION_ENTRY`。  
这释放出明显路线图信号：
- 窗口函数在 catalog 中将获得更正式的一等公民地位
- 有利于函数发现、扩展与元数据管理
- 可能为后续窗口函数扩展、反射/系统表支持铺路

---

#### 7) UPDATE 语法树重构
- **PR**: #21524 Refactor UpdateStatement as thin wrapper over UpdateQueryNode
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21524

**技术意义：**  
将 `UpdateStatement` 重构为包裹 `UpdateQueryNode` 的轻量外壳，有助于统一 DML 语句表示。  
这类改造一般影响：
- parser/binder/planner 内部一致性
- RETURNING、FROM、CTE 等复杂 UPDATE 语义维护
- 后续 SQL 兼容性迭代速度

---

## 4. 社区热点

### 1) TRY_CAST 行为与文档不一致
- **Issue**: #13097 `[OPEN] [reproduced] TRY_CAST(1::BIT AS SMALLINT) throws error but docs say it should never do that.`
- **评论**: 7
- **👍**: 1
- **链接**: duckdb/duckdb Issue #13097

**热度原因：**  
这是今日评论最多的问题之一，而且属于 **文档承诺与实际行为不一致**。`TRY_CAST` 理论上应“返回 NULL 而不是抛错”，但在 BIT → SMALLINT 转换时出现了 `Conversion Error`。  

**背后技术诉求：**
- 用户希望 `TRY_CAST` 在所有类型路径上具备一致的容错语义
- 类型系统边界行为需要统一
- 文档与实现必须严格对齐，否则会影响生产 SQL 的可预测性

---

### 2) 空结果集 JSON 输出错误在 CLI 中引发重复报告
- **Issue**: #21512 `[CLOSED] duckdb -json outputs invalid JSON [{] for empty result sets`
- **Issue**: #21530 `[CLOSED] Cli | empty outputs with -json flag returns a malformed json`
- **链接**:  
  - duckdb/duckdb Issue #21512  
  - duckdb/duckdb Issue #21530

**热度原因：**  
同一问题在短时间内被重复报告，说明影响面广、复现简单、用户感知强。  
空结果集输出 `[{]` 而不是 `[]`，属于典型的 **CLI 可用性/工具链集成问题**，会直接破坏脚本、CI、jq 管道、API 包装器。

**背后技术诉求：**
- DuckDB CLI 应在机器消费模式下提供严格稳定的输出格式
- JSON 模式被广泛用于自动化，而非仅供人工查看
- 小错误会快速放大为生态兼容性问题

---

### 3) Windows 长路径支持 PR 持续活跃
- **PR**: #20983 `[OPEN] [stale, Ready For Review] Support long paths on Windows`
- **链接**: duckdb/duckdb PR #20983

**热度原因：**  
虽然是较早提交的 PR，但今日有更新。Windows MAX_PATH 是长期痛点，涉及企业环境、深层目录、生成式数据集路径、临时目录嵌套场景。  

**背后技术诉求：**
- 更好的跨平台文件系统支持
- 减少 Windows 用户在本地开发与数据工程管道中的路径踩坑
- 增强 CLI / embedded 场景落地能力

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 高优先级：CLI `.open` 后 `.tables` 触发 segfault
- **Issue**: #21536 `[OPEN] [needs triage] .open musicbrainz-cmudb2026.db results in a segmentation fault`
- **链接**: duckdb/duckdb Issue #21536
- **是否已有 fix PR**: 暂无

**问题性质：**  
这是最严重的一类问题，涉及 **进程崩溃**。用户在 macOS/zsh 中 `.open` 数据库后执行 `.tables` 即触发段错误。  
如果可稳定复现，可能涉及：
- catalog 恢复
- 存储元数据损坏容错
- CLI 命令与数据库句柄状态同步问题

**建议关注：**  
应优先确认是否为特定数据库文件损坏、版本兼容问题或通用回归。若是通用问题，应尽快加回归测试。

---

### P1 / 查询正确性：ASOF LEFT JOIN 遇到空右表返回空结果
- **Issue**: #21514 `[OPEN] [reproduced] ASOF LEFT join with empty right table returns empty result`
- **链接**: duckdb/duckdb Issue #21514
- **是否已有 fix PR**: 暂无

**问题性质：**  
`ASOF LEFT JOIN` 在右表为空时按 LEFT JOIN 语义理应保留左表记录，但当前结果为空。  
这属于明确的 **查询语义错误**，影响面可能包括：
- 时间序列对齐查询
- 金融/行情数据回溯
- 事件流与维表关联

**风险：**  
结果“看起来合法但实际上错误”，比直接报错更危险。

---

### P1 / 语义一致性：TRY_CAST 并未始终保证“不抛错”
- **Issue**: #13097 `[OPEN] [reproduced] TRY_CAST(1::BIT AS SMALLINT) throws error...`
- **链接**: duckdb/duckdb Issue #13097
- **是否已有 fix PR**: 暂无

**问题性质：**  
类型转换边界实现不一致，会影响用户对容错 SQL 的依赖。  
对于数据清洗、半结构化导入、脏数据处理场景，`TRY_CAST` 一致性是关键承诺。

---

### P2 / CLI 行为回归：`-init` 在 `-cmd` 之前执行
- **Issue**: #21535 `[OPEN] v1.5.0: -init runs before -cmd, preventing configuration injection`
- **链接**: duckdb/duckdb Issue #21535
- **是否已有 fix PR**: 暂无

**问题性质：**  
这不是崩溃，但属于 **CLI 行为与文档/预期不符**。  
用户无法通过 `-cmd` 注入变量/宏供 `-init` 脚本使用，影响脚本化启动、模板化会话初始化、自动化运维。

---

### P2 / 新增 HTTP 方法需求，当前功能缺口
- **Issue**: #21533 `Add OPTIONS to HTTPUtil RequestType enum`
- **链接**: duckdb/duckdb Issue #21533
- **是否已有 fix PR**: 暂无

**说明：**  
这更偏功能缺失而非 bug，但会限制某些 HTTP 能力发现/协商类场景。

---

### 已修复问题

#### 空结果集 `-json` 输出非法 JSON
- **Issues**: #21512, #21530
- **链接**:
  - duckdb/duckdb Issue #21512
  - duckdb/duckdb Issue #21530

#### JSON `COPY TO` STDOUT 失败
- **Issue**: #21466
- **修复 PR**: #21522
- **链接**:
  - duckdb/duckdb Issue #21466
  - duckdb/duckdb PR #21522

#### prepared statement 对 BIGINT 最小值一元负号处理异常
- **Issue**: #21077 `[CLOSED] Out of Range Error when executing prepared statement with unary minus on BIGINT minimum value`
- **链接**: duckdb/duckdb Issue #21077

**解读：**  
该问题被关闭说明相关异常行为已有处理，体现 DuckDB 对 SQL 执行器/预处理语句一致性的持续修补。

---

## 6. 功能请求与路线图信号

### 1) JSON 新函数提案：排序序列化与深度合并
- **PR**: #21531 Add json_serialize_sorted() and json_deep_merge() scalar functions
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21531

**判断：较可能进入后续版本**  
这两个函数都很贴近真实需求：
- `json_serialize_sorted(json)`：解决稳定序列化、可比对输出、缓存键生成、测试快照一致性
- `json_deep_merge()`：解决配置合并、嵌套 JSON 更新、半结构化 ETL

如果 review 顺利，这类高实用度 JSON 函数进入下一小版本的可能性较高。

---

### 2) HTTP `OPTIONS` 支持
- **Issue**: #21533 Add OPTIONS to HTTPUtil RequestType enum
- **链接**: duckdb/duckdb Issue #21533

**判断：中等概率**  
实现面相对不大，但是否纳入核心取决于 DuckDB 内部 HTTP 用途边界。  
如果后续有对象存储、REST 接口、内容协商需求扩展，该功能有一定机会被接受。

---

### 3) CLI 环境变量路径支持
- **PR**: #21529 Fix CLI getenv on attach statement
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21529

**判断：较可能推进**  
该 PR 通过 grammar 扩展支持环境变量路径，用于 `ATTACH` 等场景。  
这类能力对脚本化、部署与跨环境配置很有帮助，属于提升工程可用性的改进。

---

### 4) PEG grammar 持续对齐 PostgreSQL
- **PR**: #21331 PEG grammar fixes: Update extension and allow numeric struct keys
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21331

**判断：路线图信号明确**  
该 PR 基于测试集对比 PEG parser 与 PostgreSQL parser 差异来修复语法兼容问题，说明 DuckDB 在继续推进：
- SQL 解析兼容性
- 新 parser 稳定化
- 复杂语法边角一致性

---

### 5) Limited DISTINCT 优化
- **PR**: #21056 Optimize Limited Distinct
- **状态**: OPEN, Changes Requested
- **链接**: duckdb/duckdb PR #21056

**判断：值得跟踪**  
这是一个典型的查询优化器增强：将 `LIMIT` 信息下推到 `DISTINCT` 聚合中，以便提前终止。  
如果最终合入，对 `SELECT DISTINCT ... LIMIT n` 这类常见 exploratory analytics 查询会有直接收益。

---

## 7. 用户反馈摘要

### 1) 用户高度依赖 DuckDB CLI 的脚本化输出稳定性
相关问题：
- #21512
- #21530
- #21535

**提炼痛点：**
- 用户把 DuckDB CLI 当作自动化工具，而不只是交互式 shell
- `-json` 输出格式错误会立刻破坏下游脚本
- `-init` / `-cmd` 顺序问题说明用户在做可参数化初始化与配置注入

这反映 DuckDB CLI 正被越来越多地用于：
- shell pipeline
- CI/CD
- 数据运维脚本
- 轻量批处理任务

---

### 2) 用户对查询语义正确性容忍度很低
相关问题：
- #21514 ASOF LEFT JOIN 错误
- #13097 TRY_CAST 不符合文档

**提炼痛点：**
- 分析型数据库用户最关心“结果是否绝对正确”
- 即使是边界 case，只要违反 LEFT JOIN 或 TRY_CAST 语义，也会损伤用户信任
- 文档与行为不一致比单纯缺功能更容易引发质疑

---

### 3) 嵌入式/本地数据库文件操作仍是重要使用场景
相关问题 / PR：
- #21536 segfault on `.open`
- #21527 path suffix fix
- #20983 Windows long path support

**提炼痛点：**
- 用户仍大量在本地文件系统上直接管理 DuckDB 数据库文件
- 文件路径、打开数据库、列出表、临时目录/WAL 处理等“外围体验”仍很关键
- 跨平台路径兼容性，尤其是 Windows，仍是长期需求

---

## 8. 待处理积压

### 1) Windows 长路径支持
- **PR**: #20983 `[OPEN] [stale, Ready For Review] Support long paths on Windows`
- **创建时间**: 2026-02-16
- **今日更新**: 2026-03-22
- **链接**: duckdb/duckdb PR #20983

**提醒：**  
该 PR 虽然标记为 Ready For Review，但又带有 stale 状态，说明评审推进不足。  
考虑到 Windows 兼容性对企业用户的重要性，建议维护者尽快给出明确结论：合并、拆分还是拒绝。

---

### 2) GCC-only 向量操作 FMV
- **PR**: #20439 `[OPEN] [Ready For Review] Enable Function Multi-Versioning (FMV) for Vector Operations (GCC-only)`
- **创建时间**: 2026-01-08
- **链接**: duckdb/duckdb PR #20439

**提醒：**  
这是偏底层性能工程的长期 PR。若方案可接受，可能带来 CPU 特性差异化优化收益；若不可接受，也应尽早给出架构层面的反馈，避免长期悬置。

---

### 3) LoongArch64 16KB page size 支持
- **PR**: #19962 `[OPEN] [CI Failure] Add LoongArch64 support with 16KB page size`
- **创建时间**: 2025-11-27
- **链接**: duckdb/duckdb PR #19962

**提醒：**  
这是明显的长期积压项，且带 CI Failure。  
尽管平台受众较窄，但架构适配类 PR 往往需要维护者及时表态，否则贡献者难以继续推进。

---

### 4) Limited DISTINCT 优化
- **PR**: #21056 `[OPEN] [Changes Requested] Optimize Limited Distinct`
- **创建时间**: 2026-02-23
- **链接**: duckdb/duckdb PR #21056

**提醒：**  
该 PR 有明确性能价值，但目前处于 Changes Requested。  
建议维护者明确 review blocking 点，因为这是对分析型工作负载有实际收益的优化。

---

## 总结判断

DuckDB 今日没有版本发布，但工程推进质量较高：  
- **短期修复** 主要集中在 CLI/JSON 与路径处理等用户高感知问题；  
- **中期演进** 则体现在窗口函数 catalog 化、UPDATE 语法树重构、StructVector 表示统一等核心架构改造；  
- **风险点** 仍是 segfault、ASOF LEFT JOIN 查询错误、TRY_CAST 语义不一致等会影响稳定性与结果可信度的问题。  

综合来看，项目当前处于 **“功能持续增强 + 快速消化回归”** 的健康状态，但建议维护者在下一轮优先处理 **崩溃与查询正确性**，其优先级应高于新增函数与工程重构。

--- 

如需，我也可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的简版**
2. **面向技术负责人看的风险清单版**
3. **按“执行引擎 / 存储 / SQL / CLI”分类的周报版**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

以下是 **StarRocks 2026-03-22 项目动态日报**。

---

# StarRocks 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，StarRocks 社区整体活跃度 **中等偏上**：共有 **1 条 Issue 更新、7 条 PR 更新**，研发重心明显集中在 **查询优化、物化视图刷新、外部连接器扩展以及分支回移（backport）**。  
从 PR 类型看，当前工作以 **增强优化类改进** 为主，同时伴随少量 **稳定性修复和测试修补**，表明项目处于持续迭代和版本线维护并行阶段。  
值得注意的是，今天没有新版本发布，但在外表物化视图、窗口函数倾斜优化、Iceberg DDL 能力以及 OpenSearch 连接器方面释放了较明确的路线图信号。  
Issue 侧新增活跃问题不多，但涉及 **分区表达式错误提示不准确**，反映出 SQL 可用性与错误诊断体验仍有改进空间。

---

## 2. 项目进展

### 已关闭 / 已完成的重要 PR

#### 2.1 窗口函数倾斜分区优化的回移 PR 已关闭
- **PR**: #70613  
- **标题**: Optimize window functions with skewed partition keys by splitting into UNION (backport #67944)  
- **状态**: CLOSED  
- **链接**: https://github.com/StarRocks/starrocks/pull/70613

**解读：**  
该 PR 是一个 backport，目标是将“**对窗口函数中倾斜 partition key 的优化**”带入维护分支。其核心思路是通过 **拆分为 UNION** 的方式，缓解热点分区造成的执行倾斜问题。  
这类优化通常直接影响 OLAP 查询中复杂分析 SQL 的尾延迟，尤其是在用户维度、地域维度、时间桶等分布高度不均的数据场景中，对大窗口聚合和排序场景价值较高。  
虽然该 PR 当前状态为 closed，数据中未明确说明最终是合并还是放弃，但从内容看，它代表了 StarRocks 在 **执行引擎抗数据倾斜能力** 上的持续推进。

---

#### 2.2 分支测试修复，保证 cherry-pick 后稳定性
- **PR**: #70612  
- **标题**: Fix UnionDictionaryManagerTest after cherry-pick on 3.5-cc  
- **状态**: CLOSED  
- **链接**: https://github.com/StarRocks/starrocks/pull/70612

**解读：**  
该修复聚焦于 **cherry-pick 后测试依赖损坏** 的问题，本质上属于版本分支维护工作。  
虽然这类改动不直接提供新功能，但对企业级数据库项目非常关键：它确保回移补丁不会破坏测试链路，降低维护分支发布风险。  
这表明 StarRocks 当前仍在积极维护多条版本线，工程质量控制和回归验证工作持续进行。

---

### 今日仍在推进中的重点 PR

#### 2.3 自适应全局 lazy materialize 策略
- **PR**: #70618  
- **标题**: global lazy materialize adaptive strategy  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70618

**技术意义：**  
该增强项直指查询执行层。`lazy materialize` 通常用于减少不必要的列物化和数据搬运，如果做成全局自适应策略，潜在收益包括：
- 降低 scan 到算子链路中的冗余列解码/读取成本
- 提升宽表查询与低选择性查询的资源效率
- 在向量化执行中进一步改善 CPU 与内存使用

这是一个典型的 **查询引擎性能优化信号**，如果进入后续版本，预计会对分析型负载产生普遍收益。

---

#### 2.4 外部表物化视图精确刷新回退修复
- **PR**: #70589  
- **标题**: [MV] Fix precise external MV refresh fallback for Iceberg-like connectors  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70589

**技术意义：**  
该修复处理的是外部表物化视图（MV）刷新路径中的一个重要兼容性问题：  
虽然 `enable_materialized_view_external_table_precise_refresh` 被应用到了所有外部表 MV 刷新路径，但并非所有连接器都支持 **分区粒度元数据刷新**。对于 Iceberg-like 连接器，如果仍进入 precise refresh 流程，可能导致刷新行为不符合实际能力边界。  

这说明 StarRocks 正在加强：
- **外部湖仓表连接器能力感知**
- **MV 刷新策略的自动回退机制**
- **跨存储格式/目录服务的一致性兼容**

对依赖 Iceberg 生态的用户来说，这类修复直接关系到 **增量刷新正确性与可用性**。

---

#### 2.5 Iceberg DDL 能力增强：支持替换分区列
- **PR**: #70508  
- **标题**: Support Iceberg ALTER TABLE REPLACE PARTITION COLUMN  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70508

**技术意义：**  
该 PR 新增 `ALTER TABLE ... REPLACE PARTITION COLUMN ... WITH ...` 语法，扩展了 StarRocks 对 Iceberg 表分区演进能力的支持。  
这是非常明确的 **SQL 兼容性与湖仓治理能力增强**，意味着用户可在 StarRocks 中更自然地执行 Iceberg 分区模型调整，而不必完全依赖外部引擎。  

潜在价值包括：
- 提升 StarRocks 作为统一 SQL 入口的能力
- 降低 Iceberg 表结构治理成本
- 使分区演进更贴近数据生命周期管理场景

---

#### 2.6 OpenSearch 连接器（Phase 1）推进
- **PR**: #70542  
- **标题**: Add OpenSearch connector (Phase 1 - HTTP)  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70542

**技术意义：**  
这是今天最具产品扩展意味的 PR 之一，新增 **OpenSearch 2.9.x 外部 catalog 连接器**，当前 Phase 1 特征包括：
- 仅支持 HTTP
- 暂不支持 HTTPS/TLS
- 暂不要求认证
- 支持 schema discovery
- 支持基础 SELECT 查询

这反映出 StarRocks 正持续扩展其外部查询生态，从传统数据湖/数仓对象继续向搜索引擎型数据源延伸。  
如果后续 Phase 2 增加 TLS、鉴权和更复杂谓词/下推支持，StarRocks 作为 **统一查询网关** 的定位会进一步增强。

---

#### 2.7 显式窗口倾斜 Hint 回移
- **PR**: #70614  
- **标题**: Support explicit skew hint for window function (backport #68739)  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70614

**技术意义：**  
这个 backport 与 #70613 形成呼应。前者偏自动优化，当前这个 PR 则提供 **显式 skew hint**，允许用户对窗口函数中的倾斜场景进行人工指导。  
这体现了 StarRocks 在优化器设计上的一个典型方向：  
**自动优化 + 专家手工 Hint 并存**，兼顾通用场景与复杂生产负载的可控性。

---

## 4. 社区热点

> 由于提供的数据中评论数大多为 undefined，以下热点以“技术影响面”和“功能关注度”综合判断。

### 热点 1：OpenSearch 连接器落地
- **PR**: #70542  
- **链接**: https://github.com/StarRocks/starrocks/pull/70542

**关注原因：**  
这是今天最清晰的功能扩展信号，代表 StarRocks 正将外部连接器生态从数据湖、Hive/Iceberg 类对象继续扩展到搜索类系统。  
**背后技术诉求** 是用户希望通过单一 OLAP SQL 引擎统一访问异构数据源，减少数据搬运和多系统查询链路复杂度。

---

### 热点 2：外部表 MV 精确刷新兼容性修复
- **PR**: #70589  
- **链接**: https://github.com/StarRocks/starrocks/pull/70589

**关注原因：**  
物化视图是 StarRocks 查询加速的重要能力，而外部表 MV 刷新的正确性直接关系到湖仓场景落地。  
**背后技术诉求** 是：用户需要在不同连接器能力不一致的情况下，仍然获得可预测、可回退、正确的刷新行为。

---

### 热点 3：Iceberg 分区列替换 DDL 支持
- **PR**: #70508  
- **链接**: https://github.com/StarRocks/starrocks/pull/70508

**关注原因：**  
该功能提升了 StarRocks 对 Iceberg 元数据演进的接入深度。  
**背后技术诉求** 是湖仓用户希望直接在 StarRocks 层完成更多治理操作，而不是仅把它当作只读查询引擎。

---

### 热点 4：分区表达式错误信息不准确
- **Issue**: #68567  
- **链接**: https://github.com/StarRocks/starrocks/issues/68567

**关注原因：**  
虽然这不是高评论量话题，但它触及 SQL 交互体验中一个很实际的问题：**错误信息质量**。  
**背后技术诉求** 是提升开发者可诊断性，尤其对新用户和复杂建表语句场景，准确报错可以显著降低排障成本。

---

## 5. Bug 与稳定性

以下按影响性质排序：

### 5.1 外部表 MV 精确刷新在 Iceberg-like 连接器上的能力误判
- **PR**: #70589  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70589

**严重程度：高**  
**问题性质：** 查询加速/刷新正确性与兼容性问题。  
如果一个连接器不支持分区粒度 metadata refresh，却仍进入 precise refresh 路径，可能造成刷新不正确、行为异常或结果不可预期。  
**是否已有 fix：** 有，修复 PR 已提交，待合并。

---

### 5.2 分区表达式错误提示不正确
- **Issue**: #68567  
- **状态**: OPEN  
- **标签**: `type/bug`, `good first issue`  
- **链接**: https://github.com/StarRocks/starrocks/issues/68567

**严重程度：中**  
**问题性质：** SQL 语义报错与用户体验问题。  
该问题不会直接表明数据损坏或查询错误，但会导致用户在建表或分区表达式配置时报错信息误导，增加定位复杂度。  
**是否已有 fix：** 当前未看到对应修复 PR。

---

### 5.3 分支 cherry-pick 后测试失效
- **PR**: #70612  
- **状态**: CLOSED  
- **链接**: https://github.com/StarRocks/starrocks/pull/70612

**严重程度：中-低**  
**问题性质：** 工程稳定性与测试回归问题。  
虽不直接影响线上查询结果，但会增加版本分支维护风险。  
**是否已有 fix：** 有，相关修复已提交且 PR 已关闭。

---

## 6. 功能请求与路线图信号

### 6.1 OpenSearch 连接器大概率进入后续版本观察名单
- **PR**: #70542  
- **链接**: https://github.com/StarRocks/starrocks/pull/70542

这是最明确的新增能力方向之一。尽管当前 Phase 1 能力较基础，但连接器框架已形成雏形。  
**判断：** 若后续补齐 TLS、鉴权、谓词下推与更完善的 schema 映射，该功能很可能被纳入下一阶段版本重点宣传内容。

---

### 6.2 Iceberg DDL 兼容性持续增强
- **PR**: #70508  
- **链接**: https://github.com/StarRocks/starrocks/pull/70508

支持 `REPLACE PARTITION COLUMN` 明确释放出一个信号：  
StarRocks 正从“查询 Iceberg”走向“更深入管理 Iceberg 元数据与表结构演进”。  
**判断：** 后续很可能继续补充更多 Iceberg DDL/元数据操作能力。

---

### 6.3 窗口函数倾斜优化进入版本线下沉阶段
- **PR**: #70613  
- **链接**: https://github.com/StarRocks/starrocks/pull/70613  
- **PR**: #70614  
- **链接**: https://github.com/StarRocks/starrocks/pull/70614

自动拆分优化与显式 skew hint 同时出现，且已进入 backport 阶段，说明该能力已不再只是主线实验，而是有意推广到维护版本。  
**判断：** 这类优化较可能在后续小版本中成为性能亮点之一，特别适合有复杂窗口分析的企业工作负载。

---

### 6.4 查询执行层自适应 lazy materialize 值得重点跟踪
- **PR**: #70618  
- **链接**: https://github.com/StarRocks/starrocks/pull/70618

这是更偏底层的执行优化，若成熟落地，影响面可能大于单点功能特性。  
**判断：** 很可能属于下一版本性能优化项，但仍需关注评审与回归测试情况。

---

## 7. 用户反馈摘要

### 7.1 SQL 报错可读性仍是实际痛点
- **Issue**: #68567  
- **链接**: https://github.com/StarRocks/starrocks/issues/68567

从当前唯一活跃 Issue 来看，用户在建表和分区表达式配置场景中，最直接的不满并非“功能缺失”，而是“**错误信息不够准确**”。  
这类反馈说明 StarRocks 在高级功能不断扩展的同时，用户仍然非常在意：
- 报错是否准确指向根因
- SQL 兼容边界是否清晰
- 文档与错误提示是否一致

对数据库产品而言，这直接影响初次接入成本和一线运维效率。

---

### 7.2 湖仓场景下，用户更关注“能力边界透明”
- **PR**: #70589  
- **链接**: https://github.com/StarRocks/starrocks/pull/70589

从外部 MV 刷新修复可看出，用户对“支持外部表”并不满足于表面可用，更关注：
- 是否真的支持分区级精确刷新
- 不支持时是否自动回退
- 不同连接器之间行为是否一致

这表明生产用户正在从“能连上”转向“**行为可预测、正确性可信**”。

---

### 7.3 用户希望 StarRocks 成为统一数据访问入口
- **PR**: #70542  
- **链接**: https://github.com/StarRocks/starrocks/pull/70542  
- **PR**: #70508  
- **链接**: https://github.com/StarRocks/starrocks/pull/70508

OpenSearch 连接器与 Iceberg DDL 能力增强共同显示，社区需求正集中在：
- 接更多异构系统
- 用统一 SQL 管理更多对象
- 降低跨系统数据协同复杂度

这也是 StarRocks 近年来平台化演进的典型方向。

---

## 8. 待处理积压

> 受限于本次数据仅覆盖“最近更新的 Issues/PR”，这里只列出当前仍开放且值得持续跟踪的项。

### 8.1 分区表达式错误提示问题仍待修复
- **Issue**: #68567  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/issues/68567

该问题创建于 **2026-01-28**，至今仍处于开放状态，虽被标注为 `good first issue`，但若长期无人接手，会持续影响 SQL 诊断体验。  
**建议：** 可由维护者引导新贡献者接手，作为低风险、高体验收益的问题优先处理。

---

### 8.2 OpenSearch 连接器仍处于早期阶段
- **PR**: #70542  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70542

功能覆盖尚处于 Phase 1，缺少 HTTPS/TLS 与认证支持。  
**建议：** 若希望尽快对外形成可用能力，应尽早明确后续 phase 计划、兼容矩阵与安全能力补齐路径。

---

### 8.3 Iceberg 外部 MV 精确刷新修复应优先合并
- **PR**: #70589  
- **状态**: OPEN  
- **链接**: https://github.com/StarRocks/starrocks/pull/70589

该问题涉及外部 MV 刷新正确性，优先级应高于一般增强项。  
**建议：** 维护者应优先完成兼容性验证，特别是针对不同 Iceberg-like connector 的行为回归。

---

## 健康度结论

总体来看，StarRocks 今日呈现出 **稳中有进** 的项目状态：  
- 工程面上，维护分支仍在持续接收 backport 与测试修复，显示出较好的版本维护纪律。  
- 产品面上，OpenSearch 连接器、Iceberg DDL、外部 MV 刷新修复等改动说明项目正继续强化 **湖仓与异构查询平台能力**。  
- 风险面上，今天暴露的问题更多偏 **兼容性与可诊断性**，尚未出现明显大规模崩溃或严重回归信号。  

**综合评估：项目健康度良好，活跃度中等偏上，当前重点在性能优化、外部生态扩展和多版本维护。**

--- 

如果你愿意，我还可以把这份日报继续整理成：
1. **适合发在飞书/Slack 的简版晨报**  
2. **适合周报汇总的表格版**  
3. **带风险等级和优先级的研发管理视图**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报 · 2026-03-22

## 1. 今日速览

过去 24 小时内，Apache Iceberg 共出现 **27 条活跃更新**（Issues 8、PRs 19），活跃度处于**较高水平**，且更新主要集中在 **Spark / Core / REST Catalog / Flink Connector** 等核心模块。  
今天**没有新版本发布**，但代码层面的推进比较密集，尤其是围绕 **Spark rewrite 稳定性、REST 批量加载能力、V4 manifest 基础能力** 和 **Flink sink 性能优化**。  
问题面上，社区继续暴露出一些 **Spark 侧内存、连接/死锁、Schema 变更正确性、Hive 迁移兼容性** 的真实生产问题，说明项目仍在持续消化多引擎集成场景下的复杂边界条件。  
整体来看，项目健康度维持在**积极推进但稳定性压力仍存**的状态：新能力建设明确，修复也在跟进，但部分 issue/PR 带有 `stale` 标签，说明仍有一定积压需要维护者集中清理。

---

## 2. 项目进展

### 已关闭 / 完成的重要事项

#### 2.1 关闭 Issue：SparkExecutorCache 导致 RewriteDataFilesSparkAction 变慢
- **Issue**: #11648  
- **状态**: CLOSED  
- **链接**: apache/iceberg Issue #11648

这是一个与 **Spark 维护任务性能退化** 直接相关的问题。用户反馈在从 1.1.0 升级到 1.7.0 后，开启某些默认行为后，`RewriteDataFilesSparkAction` 出现明显变慢。  
从今日 PR 动向看，相关讨论并未止于 issue 关闭，反而直接引出了后续修复与策略回滚：

- **PR #15714**：`Spark: revert disabling deletes cache for rewrites`  
  链接: apache/iceberg PR #15714
- **PR #15712**：`Spark: preload delete files to avoid deadlocks`  
  链接: apache/iceberg PR #15712
- **PR #15713**：`Core: close entries iterable in ManifestFilterManager`  
  链接: apache/iceberg PR #15713

这说明社区对 rewrite 路径的性能与稳定性正在进行**系统性回看**：不仅要解决“慢”，还要避免由连接池/懒加载引发的**死锁**和资源泄漏问题。

---

#### 2.2 关闭 Issue：`startsWith` 谓词严格 metrics 评估
- **Issue**: #14016  
- **状态**: CLOSED  
- **链接**: apache/iceberg Issue #14016

这是一个 **查询裁剪正确性** 方向的改进项，目标是让 `startsWith` 谓词在 metrics evaluation 上具备更严格的判断逻辑。  
虽然今天没有对应合并 PR 出现在列表中，但该 issue 的关闭释放出两个信号：

1. Iceberg 在继续补齐 **表达式下推 / 文件级裁剪** 的语义严谨性；
2. 社区对 `startsWith` / `notStartsWith` 这类字符串谓词的 pruning correctness 已有持续投入。

这类改进通常不会直接改变 SQL 接口，却会影响 **查询结果正确性边界** 和 **扫描效率**，对下游 Spark/Flink/Trino 等引擎都具有长期价值。

---

## 3. 社区热点

以下是今天最值得关注的热点讨论与开发方向。

### 3.1 Spark 内存泄漏问题持续高热
- **Issue #13297** `[bug, stale]`  
- 标题：Spark: Doing a Coalesce and foreachpartitions in spark directly on an iceberg table is leaking memory heavy iterators  
- 评论：30  
- 链接：apache/iceberg Issue #13297

这是今日**评论最多**的问题之一。用户在 Spark 直接读取 Iceberg 表后执行 `coalesce(...).foreachPartition(...)`，出现明显的内存泄漏/重迭代器对象堆积现象。  
背后的技术诉求很明确：

- Iceberg 的 Spark reader 是否在 iterator 生命周期管理上存在问题；
- DataSource V2 扫描返回对象是否与 Spark 的分区消费模型存在资源释放错位；
- 这类问题会直接影响 **批处理作业稳定性**，尤其是自定义 foreach/side-effect pipeline。

该问题虽标记 `stale`，但今天仍被更新，说明用户侧仍未完全解决。

---

### 3.2 Schema 变更正确性：删除最高 field ID 列失败
- **Issue #13850** `[bug, stale]`  
- 评论：11，👍 1  
- 链接：apache/iceberg Issue #13850

这是今天**正确性风险较高**的 schema 演进问题。用户在 1.9.2 中删除“拥有最高 field ID 的列”时失败，说明内部 field ID 管理、嵌套 schema 更新或 visitor/reassignment 逻辑可能存在边界 bug。  
这类问题的技术意义很大：

- Iceberg 的 schema evolution 是核心卖点；
- 一旦 drop column 出错，会直接阻塞表结构治理、下游模型迭代和兼容性升级；
- 如果是升级后出现，可能构成**版本回归**信号。

目前列表中**未看到直接 fix PR**，值得重点跟踪。

---

### 3.3 Spark Z-order 重写的列名冲突问题，已快速出现修复候选
- **Issue #15708**  
- 链接：apache/iceberg Issue #15708
- **相关 PR #15706**  
- 链接：apache/iceberg PR #15706

问题表现为：当表中存在列名 `ICEZVALUE` 时，Z-order rewrite 会抛出误导性错误，因为内部实现也使用了同名列。  
这是一个非常典型的 **内部保留列名与用户 schema 冲突** 问题。好消息是社区响应很快，已经有 fix PR：

- **PR #15706** 在 `SparkZOrderFileRewriteRunner` 中增加前置校验，提前抛出更明确的错误，避免执行到 DataFrame 阶段后才报难以理解的异常。

这类修复虽然不大，但反映出 Iceberg 在 **Spark SQL / rewrite action 可诊断性** 上的改进速度较快。

---

### 3.4 Spark 4.1 与高级规划能力持续推进
- **PR #14948** `[WIP] Spark 4.1: Implement SupportsReportOrdering DSv2 API`  
- 链接：apache/iceberg PR #14948

这是今天路线图意义很强的 PR。`SupportsReportOrdering` 属于 Spark DSv2 更高级的规划能力，意味着 Iceberg 正继续对齐 Spark 4.1 的接口演进。  
如果最终落地，潜在收益包括：

- 更好地向 Spark 报告数据天然排序特征；
- 帮助优化器减少不必要排序；
- 为 merge-on-read、范围扫描、ordered distribution 等更复杂场景提供基础。

这是典型的**平台适配型长期投资**。

---

### 3.5 Bloom Filter 跳读索引 POC 热度上升
- **PR #15311** `Bloom filter index POC`  
- 链接：apache/iceberg PR #15311

该 PR 引入了 **Puffin-backed Bloom-filter-based file skipping index** 的概念验证实现。  
其技术诉求非常清晰：

- 在不改变数据文件格式的情况下，通过 Puffin 索引增强 file skipping；
- 索引为 advisory / best-effort，错误时必须回退到正常规划，不影响正确性；
- 对高选择性过滤场景有较大性能潜力。

这条线如果成熟，可能成为 Iceberg 在 **二级索引 / 辅助索引 / 元数据加速** 方向的重要里程碑。

---

## 4. Bug 与稳定性

按严重程度与影响范围排序如下：

### P1：Spark rewrite/扫描路径潜在死锁与连接耗尽
1. **PR #15712** `Spark: preload delete files to avoid deadlocks`  
   链接：apache/iceberg PR #15712  
2. **PR #15713** `Core: close entries iterable in ManifestFilterManager`  
   链接：apache/iceberg PR #15713  
3. **PR #15714** `Spark: revert disabling deletes cache for rewrites`  
   链接：apache/iceberg PR #15714  
4. **关联 Issue #11648**  
   链接：apache/iceberg Issue #11648

这一组更新表明，Spark rewrite 路径中可能存在：
- 数据文件加载占满连接；
- lazy delete file loading 继续申请连接导致死锁；
- manifest entries iterable 未及时关闭，造成资源悬挂；
- 为缓解性能问题而采取的 cache 策略调整可能引入副作用。

这类问题直接影响生产上的 compaction / rewrite / maintenance job，严重时会造成任务挂死或明显退化。  
**已有 fix PR：是。**

---

### P1：Schema evolution 正确性风险
- **Issue #13850** `Schema update fails when dropping column with highest field ID`  
- 链接：apache/iceberg Issue #13850

这是典型的元数据正确性问题。若删除最高 field ID 列失败，会阻碍 schema 清理与版本演进。  
**已有 fix PR：暂未看到。**

---

### P1：Spark 内存泄漏/迭代器生命周期问题
- **Issue #13297**  
- 链接：apache/iceberg Issue #13297

涉及 `coalesce + foreachPartition` 时的内存泄漏。若属实，影响批处理与导出型任务稳定性，尤其在大分区/长时间 executor 场景下风险高。  
**已有 fix PR：暂未看到。**

---

### P2：Hive 迁移 null partition 兼容性问题
- **Issue #15332** `Null partition handling of hive migration`  
- 链接：apache/iceberg Issue #15332

用户在将 Hive 表迁移到 Iceberg 时，遇到 Hive null 分区占位值（如 `__HIVE_DEFAULT_PARTITION__`）处理异常。  
这是典型的**历史湖仓迁移兼容**问题，影响存量 Hive 数仓转 Iceberg 的平滑程度。  
**已有 fix PR：暂未看到。**

---

### P2：Z-order rewrite 内部列名冲突
- **Issue #15708**  
- 链接：apache/iceberg Issue #15708  
- **Fix PR #15706**  
- 链接：apache/iceberg PR #15706

影响范围较窄，但定位困难，因为错误信息具有误导性。  
**已有 fix PR：是。**

---

### P2：UGI 获取错误，可能影响安全上下文
- **Issue #14146** `[stale]`  
- 链接：apache/iceberg Issue #14146

问题描述显示 Spark master 更新 UGI 后，Iceberg 仍拿到初始 UGI，可能影响 HDFS/Hive/Hadoop 安全访问上下文。  
如果属实，属于多租户/安全环境中的重要稳定性问题。  
**已有 fix PR：暂未看到。**

---

## 5. 功能请求与路线图信号

### 5.1 新增 `week` 分区变换的需求
- **Issue #14220** `Adding week partition transform`  
- 链接：apache/iceberg Issue #14220

用户希望像 `day/month/year/hour` 一样支持 `week` 分区变换。  
这反映出两个真实诉求：

- 业务分析常按自然周或业务周进行汇总；
- 现有 transform 粒度在部分场景下不够贴合。

当前未看到直接实现 PR，但该诉求与 Iceberg 的分区演进模型高度一致，**具备被纳入未来版本的可能性**。

---

### 5.2 REST Catalog 批量加载能力正在成型
- **PR #15669** `Core: Add batch load endpoints for tables and views`  
- 链接：apache/iceberg PR #15669

这是今天最明确的**平台能力增强**之一。  
该 PR 为 REST 端加入 table/view 的批量加载 endpoint，包括：

- request/response model
- JSON parser
- server handler
- adapter routing
- client-side model

这通常会显著改善：
- catalog 批量元数据访问效率；
- 高并发元数据加载场景；
- 多表计划/批处理元信息预热。

这是非常强的下一版本候选能力。

---

### 5.3 V4 manifest 支撑基础能力继续铺路
- **PR #15049** `Introduce foundational types for V4 manifest support`  
- 链接：apache/iceberg PR #15049

该 PR 与 **v4 adaptive metadata tree / 单文件提交方向** 直接相关，属于偏底层但战略意义很强的基础工作。  
它不是短期“可见功能”，但它释放出很强的路线图信号：  
Iceberg 正继续推进 **下一代元数据结构**，目标可能是更高效的 metadata 管理和更可扩展的提交路径。

---

### 5.4 Flink sink 性能优化可能进入近期待发布范围
- **PR #15433** `Flink: Add passthroughRecords option to DynamicIcebergSink`  
- 链接：apache/iceberg PR #15433

通过 forward edge 替代 hash edge，让算子可链式执行，减少序列化/反序列化开销。  
这是非常实用的吞吐优化，特别适合：
- 高吞吐流式写入；
- 低延迟 ETL；
- 资源敏感型 Flink 作业。

该 PR 已较成熟，**进入近版本的概率较高**。

---

### 5.5 Kafka Connect 正在向更强 CDC / 去重能力演进
- **PR #14797**  
  链接：apache/iceberg PR #14797  
- **PR #15651**  
  链接：apache/iceberg PR #15651

这两条 PR 围绕 Kafka Connect 的 Delta Writer、DV 模式、去重与失败重试语义，说明 Iceberg 在连接器侧正承接更多 **CDC / upsert / in-batch dedup** 场景。  
这是落地价值很高的方向，尤其面向实时数仓与变更流入湖。

---

## 6. 用户反馈摘要

结合今日 issue/PR 摘要，可以提炼出以下真实用户痛点：

### 6.1 升级后性能和行为变化让维护作业变脆弱
- 代表：#11648、#15714、#15712、#15713  
- 链接：apache/iceberg Issue #11648 / PR #15714 / PR #15712 / PR #15713

用户在升级 Iceberg 后，maintenance/rewrite 作业出现**性能下降、缓存策略争议、连接池死锁**等问题。  
这说明生产用户最敏感的并不只是“功能是否可用”，而是：
- 维护任务是否稳定；
- 默认策略是否安全；
- 小改动是否会放大集群连接资源瓶颈。

---

### 6.2 Spark 与 Iceberg 的边界交互仍存在复杂资源管理问题
- 代表：#13297、#15708  
- 链接：apache/iceberg Issue #13297 / Issue #15708

从内存泄漏到内部列名冲突，说明 Spark 集成层依然是问题最密集的区域之一。  
用户期待的是：
- 更稳健的 DataSource V2 资源释放；
- 更可解释的报错；
- 对 rewrite、foreach、catalog action 这类“工程化用法”更友好。

---

### 6.3 存量迁移和兼容场景仍然重要
- 代表：#15332、#15673  
- 链接：apache/iceberg Issue #15332 / PR #15673

一个是 Hive null partition 迁移，一个是 Flink connector `table-name` alias 兼容。  
这表明大量用户还处于：
- 从旧湖仓/元存储迁移到 Iceberg；
- 在不同引擎间统一接入语义；
- 追求“配置符合直觉”的阶段。

---

### 6.4 社区对文档与易用性有持续需求
- **PR #15697** `Docs: Document Spark SQL transform functions`  
  链接：apache/iceberg PR #15697  
- **PR #15676** `Build: Integrate Scalafix to auto-fix unused Scala imports`  
  链接：apache/iceberg PR #15676

说明除了功能本身，用户也在推动：
- SQL transform 函数文档完善；
- 构建/代码清洁自动化；
- 降低新贡献者与使用者的理解成本。

---

## 7. 待处理积压

以下问题或 PR 虽然仍活跃，但带有明显积压或长期悬而未决特征，建议维护者重点关注。

### 7.1 长期未解决的 Spark 内存泄漏问题
- **Issue #13297** `[bug, stale]`  
- 链接：apache/iceberg Issue #13297

创建于 2025-06，已有 30 条评论，说明影响面或排查复杂度都较高。  
建议：
- 明确是否可复现于最新版本；
- 给出临时规避建议；
- 标注 Spark/Iceberg 哪一层更可能负责。

---

### 7.2 Schema drop column 边界错误
- **Issue #13850** `[bug, stale]`  
- 链接：apache/iceberg Issue #13850

这是 schema correctness 问题，不宜长期 stale。  
建议：
- 增加最小复现；
- 确认是否为 1.9.x 回归；
- 尽快补 TCK 或 schema evolution 回归测试。

---

### 7.3 Spark 4.1 支持 PR 仍在排队
- **PR #14948** `[WIP, stale]`  
- 链接：apache/iceberg PR #14948

属于平台兼容重要工程，但依赖上游 PR，存在堆叠评审阻塞。  
建议维护者尽快清理其依赖链，否则会影响 Spark 新版本适配节奏。

---

### 7.4 Bloom Filter 索引 POC 值得尽快明确方向
- **PR #15311** `[stale]`  
- 链接：apache/iceberg PR #15311

这是潜在的高价值性能特性，但 POC 长期停留会带来方向不明的问题。  
建议：
- 明确是否接受为实验特性；
- 拆分为更小 PR；
- 给出性能与正确性验收标准。

---

### 7.5 加密 FileIO 作为 DelegateFileIO 的设计仍待推进
- **PR #14876**  
- 链接：apache/iceberg PR #14876

该设计关系到“启用加密后是否还能保留 bulk operations 能力”，对企业用户很关键。  
如果长期不推进，会削弱 Iceberg 在安全合规场景中的易用性。

---

## 8. 结论

今天的 Apache Iceberg 呈现出一个很典型的成熟开源基础设施项目画像：  
一方面，**REST Catalog、V4 manifest、Spark 4.1、Flink sink、Bloom filter 索引** 等中长期能力在持续前进；另一方面，**Spark rewrite 稳定性、schema 演进边界、Hive 迁移兼容、资源释放与可诊断性** 仍是当前用户最关心的现实问题。  

从健康度看，项目开发活跃、方向清晰，但 `stale` issue/PR 数量提示维护面压力不小。短期内，最值得关注的是 **Spark rewrite 路径的一组稳定性修复能否顺利落地**，以及 **schema correctness / Spark 内存问题** 是否出现明确修复方案。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区保持较高活跃度：共有 **1 条 Issue 更新**、**19 条 PR 更新**，其中 **13 条仍在待合并**，**6 条已合并或关闭**。  
从变更主题看，开发重心明显集中在 **Delta Kernel / kernel-spark 能力增强**、**ServerSidePlanning 与 OAuth 凭证刷新**、以及 **CI / 测试稳定性修复**。  
此外，唯一新增/活跃 Issue 是 **4.2.0 Release Cut**，说明项目已进入 **4.2.0 RC 测试与发版准备阶段**，版本推进信号明确。  
整体来看，项目健康度良好：一方面有新版本候选推进，另一方面也在持续清理 flaky tests、完善协议说明和兼容性细节，体现出发布前的收敛节奏。

---

## 2. 项目进展

### 已合并/关闭的重要 PR

#### 2.1 分支版本切换到 4.2.0-SNAPSHOT，发版节奏进入下一阶段
- **PR #6340** `[Build] Change branch version to 4.2.0-SNAPSHOT`  
  链接: delta-io/delta PR #6340

该 PR 已关闭，核心意义在于主干版本号切换到 **4.2.0-SNAPSHOT**。这通常意味着：
- 4.2.0 的 release cut 已经启动；
- 主干开始为后续开发迭代腾挪空间；
- 与 Issue #6345 的 **4.2.0-RC0 测试发布** 形成呼应。

这是一条明显的路线图信号：**项目当前处于 4.2.0 候选发布验证 + 主干继续演进并行推进** 的状态。

---

#### 2.2 ServerSidePlanning 的 OAuth 凭证刷新能力已完成一轮实现与验证
- **PR #6292** `[ServerSidePlanning] Add OAuth + credential refresh support`  
  链接: delta-io/delta PR #6292
- **PR #6295** `[ServerSidePlanning] Add e2e OAuth test with mock token server`  
  链接: delta-io/delta PR #6295
- 后续延续 PR：**#6346** `[ServerSidePlanning] Add OAuth + credential refresh support`（仍 OPEN）  
  链接: delta-io/delta PR #6346

虽然 #6292 与 #6295 已关闭，但从后续 #6346 继续打开来看，这组工作并未结束，而是在继续重构/补充。其技术方向很清晰：
- 用 **自动刷新 token** 机制取代静态存储凭证；
- 在 SSP（Server Side Planning）启用且可拿到 UC 元数据时，改为依赖 **UC credential providers**；
- 增强与 **Unity Catalog / REST Catalog / 云存储临时凭证** 的集成能力。

这类改动直接影响：
- 目录驱动环境中的访问安全性；
- 长时运行作业的凭证过期问题；
- 云环境下跨系统访问的可运维性。

对企业用户尤其重要，属于 **平台接入能力增强**，不是单纯的代码整理。

---

#### 2.3 Spark 侧测试与示例文档收敛，提升发布稳定性
- **PR #6344** `[Spark] Fix flaky testPlanInputPartitionsGroupsFilesByPartition`  
  链接: delta-io/delta PR #6344
- **PR #6341** `Improve comment clarity in UniForm example`  
  链接: delta-io/delta PR #6341

#6344 处理的是 Spark 侧的 flaky test，问题来自测试对分区数量的假设过于刚性。此类修复虽然不直接新增功能，但对于：
- 防止 CI 偶发失败；
- 降低合并噪音；
- 提高回归测试可信度  
非常关键。

#6341 则是 UniForm 示例中的注释改进，解释 `Thread.sleep` 是为了等待异步 Iceberg 元数据转换完成。虽是文档级优化，但也侧面说明 **UniForm / Iceberg 兼容路径** 仍在被持续打磨。

---

#### 2.4 Kernel 新特性演进中，有一项长期 PR 被关闭
- **PR #5718** `[KERNEL] Add collations table feature`  
  链接: delta-io/delta PR #5718

该 PR 长期存在后于今日关闭，值得注意。  
`collations table feature` 涉及更深层的 **字符串比较规则 / 排序语义 / SQL 兼容性**，这类能力一旦落地，往往会对：
- 查询语义一致性；
- 跨引擎行为兼容；
- 未来协议与元数据表达  
产生较大影响。

本次关闭可能意味着方案调整、暂缓合入，或需要拆分重做。对关注 SQL 标准兼容性的用户来说，这是一项应持续关注的路线变化。

---

## 3. 社区热点

### 3.1 4.2.0 RC0 测试发布成为当前最重要议题
- **Issue #6345** `[OPEN] Delta 4.2.0 Release Cut`  
  链接: delta-io/delta Issue #6345

摘要显示，**Delta Lake 4.2.0-RC0 已发布供测试**，重点包括：
- **Unity Catalog Managed Tables** 的重要改进；
- Delta 在 **catalog-driven environments** 中更好地工作；
- 提及 **Streaming reads on UC...** 等方向。

这反映出当前版本的核心技术诉求：
1. **更深的 Unity Catalog 集成**；
2. **面向托管表与目录治理场景的增强**；
3. **流式读取与 catalog 管理的一致性提升**。

对云数据平台用户而言，这是非常实用的一组变化，说明 Delta 正在强化自己在现代 lakehouse 控制面下的适配能力。

---

### 3.2 kernel-spark 的 CDC 流式 offset 管理是当前最连续的功能开发主线
- **PR #6075** `[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)`  
- **PR #6076** `[kernel-spark][Part 2] CDC streaming offset management (add commit processing logic for incremental changes)`  
- **PR #6336** `[kernel-spark][Part 3] CDC streaming offset management (finish wiring up incremental change processing)`  
  链接: delta-io/delta PR #6075 / #6076 / #6336

这组三段式 stacked PR 是今天最值得关注的功能开发热点。其目标是逐步完成：
- 初始快照阶段的 offset 管理；
- 增量 commit 的处理逻辑；
- 最终将 **incremental change processing** 串接完成。

背后的技术诉求很明确：
- 让 **CDC / CDF 流式消费** 更稳定、状态管理更完整；
- 为 kernel-spark 路径下的流式读取建立更加标准化的 offset 语义；
- 提升 Delta 在增量数据订阅、变更捕获、近实时同步场景中的可用性。

这类工作若完成，将直接增强 Delta 在 **实时数仓、数据同步、审计追踪** 等场景中的竞争力。

---

### 3.3 Variant 与 REST Catalog 方向活跃，说明多类型数据与新目录接口都在推进
- **PR #6349** `[CHERRYPICK][KERNEL][VARIANT] Add variant GA table feature to delta kernel java`  
- **PR #6350** `[KERNEL][VARIANT] make kernel shredding test not use spark`  
- **PR #6347** `Delta REST Catalog API v1 client integration`  
  链接: delta-io/delta PR #6349 / #6350 / #6347

从这几条 PR 可以看出两个趋势：

**其一，Variant 类型能力持续推进。**  
`variant GA table feature` 表明 Delta Kernel Java 正在补齐对更复杂半结构化/多态数据的支持；而将 shredding 测试从 Spark 依赖中剥离，则说明项目希望增强 **Kernel 的独立性与可测试性**。

**其二，REST Catalog API v1 客户端集成开始浮现。**  
这意味着 Delta 不再只是围绕 Spark 内部元数据路径优化，而是在朝着更标准化、服务化、跨系统的 catalog 访问模型靠拢。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### 高优先级：发布前稳定性与认证链路收敛
1. **ServerSidePlanning 凭证刷新链路仍在演进**
   - 相关 PR: **#6292（closed）/#6295（closed）/#6346（open）**
   - 链接: delta-io/delta PR #6346

虽然已有实现与 e2e 测试，但仍出现后续开放 PR，说明：
- 原方案可能在集成层面仍需调整；
- OAuth token 刷新、UC 凭证提供器、云存储短期凭证的交互还在收敛；
- 对生产环境长时间运行任务而言，这属于 **高影响稳定性主题**。

**状态：已有 fix/增强 PR 持续推进中。**

---

### 中优先级：Spark 侧测试偶发失败
2. **`testPlanInputPartitionsGroupsFilesByPartition` flaky**
   - PR: **#6344** `[Spark] Fix flaky testPlanInputPartitionsGroupsFilesByPartition`
   - 链接: delta-io/delta PR #6344

问题根因是测试对小文件分组后分区数的预期过于固定，容易因执行环境差异而失败。  
这类问题不会直接影响用户查询正确性，但会影响：
- CI 稳定性；
- 回归信号可靠性；
- 发布前合并效率。

**状态：已关闭，说明修复已完成或被替代吸收。**

---

### 中优先级：Retention 相关测试波动
3. **`DeltaRetentionWithCatalogOwnedBatch1Suite` flaky**
   - PR: **#6348** `[CI Improvements] Fix flaky DeltaRetentionWithCatalogOwnedBatch1Suite test`
   - 链接: delta-io/delta PR #6348

错误表现为 checkpoint 之前应删除的 Delta 文件数不符合预期。  
从描述看，问题更可能出在 **测试环境中的时序/异步删除行为**，而非核心 retention 逻辑损坏，但这涉及：
- 日志清理；
- checkpoint 后文件生命周期；
- catalog-owned table 管理路径。

考虑到 4.2.0 聚焦 UC managed tables，这类测试需要重点盯防。

**状态：已有修复 PR。**

---

### 中低优先级：协议文档与语义澄清
4. **Checkpoint 是否应排除 tombstoned domain metadata**
   - PR: **#6337** `protocol: Clarify that checkpoints exclude tombstoned domain metadatas`
   - 链接: delta-io/delta PR #6337

这不是运行时 crash，但属于 **协议语义正确性**。  
如果实现与文档认知不一致，可能影响：
- 第三方引擎实现 checkpoint 解析；
- 快照重建正确性；
- domainMetadata 的 reconciliation 行为。

**状态：文档/协议澄清 PR 已打开。**

---

### 中低优先级：Decimal 类型处理边界
5. **Kernel 中 DECIMAL 精度/scale 处理增强**
   - PR: **#6257** `[Kernel] Support implicit cast between DECIMAL types with different precisions`
   - PR: **#6259** `[Kernel] Fix Literal.ofDecimal to handle precision < scale from Java BigDecimal`
   - 链接: delta-io/delta PR #6257 / #6259

这两条都属于查询表达式与类型系统边界问题，可能影响：
- Java BigDecimal 到 Delta DecimalType 的映射；
- Decimal 隐式类型转换；
- 某些表达式求值的兼容性与正确性。

对于金融、计量、计费类场景，这是值得关注的修复方向。

**状态：已有修复 PR，待合并。**

---

## 5. 功能请求与路线图信号

### 5.1 4.2.0 很可能纳入 Unity Catalog Managed Tables 强化
- **Issue #6345** `Delta 4.2.0 Release Cut`  
  链接: delta-io/delta Issue #6345

从 RC0 摘要可判断，**UC Managed Tables** 是 4.2.0 的核心卖点之一。结合以下 PR：
- **#6346** ServerSidePlanning OAuth + credential refresh
- **#6342** Gate UC Spark test expectations by version
- **#6348** Retention with CatalogOwned tests 修复

可以推测 4.2.0 将较大概率继续增强：
- UC 目录下的表管理；
- 托管表读写与流式行为；
- 版本差异下的测试与兼容适配。

---

### 5.2 CDC / CDF 流式能力有望成为后续重点特性
- **PR #6075 / #6076 / #6336**  
  链接: delta-io/delta PR #6075 / #6076 / #6336

这组 stacked PR 覆盖从初始快照到增量变更处理的完整链路，开发投入明显。  
若顺利合入，Delta 在 kernel-spark 路径上的 **CDC 流式 offset 管理** 能力将显著增强，可能成为 4.2.x 或后续版本的重要增量特性。

---

### 5.3 Delta Kernel 正在补齐更完善的类型系统与查询下推能力
- **PR #6332** `[kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector`  
- **PR #6257** DECIMAL implicit cast  
- **PR #6259** Decimal literal precision/scale fix  
- **PR #6349** Variant GA table feature  
  链接: delta-io/delta PR #6332 / #6257 / #6259 / #6349

这说明 Kernel 方向的路线非常清晰：
- **查询下推增强**：如 limit pushdown；
- **类型系统完善**：尤其是 decimal 和 variant；
- **减少 Spark 绑定**：提升 Kernel 独立性。

这对非 Spark 场景、嵌入式引擎、以及统一读路径都有积极意义。

---

### 5.4 REST Catalog 接口可能成为新的生态接口扩展方向
- **PR #6347** `Delta REST Catalog API v1 client integration`  
  链接: delta-io/delta PR #6347

虽然摘要信息较少，但从标题看已足以判断：
- Delta 正在探索/推进面向 REST 的 catalog client 集成；
- 这有利于跨语言、跨进程、服务化元数据访问；
- 也与 UC / catalog-driven 架构趋势吻合。

若该方向持续推进，未来可能成为 Delta 生态连接器能力的重要一环。

---

## 6. 用户反馈摘要

基于今日唯一活跃 Issue 与相关 PR 摘要，可提炼出以下用户侧痛点与场景：

### 6.1 企业用户需要更好的 catalog-driven 使用体验
- 相关链接: **Issue #6345**
- 痛点：
  - Unity Catalog 托管表下的行为一致性；
  - 流式读取在 UC 管理环境中的适配；
  - 凭证刷新与安全访问链路复杂。

这表明 Delta 的典型用户已不只是单机 Spark 开发者，而是越来越多处于 **企业数据平台、统一目录治理、云托管环境** 中。

---

### 6.2 长时任务对自动凭证刷新有刚需
- 相关链接: **PR #6346**, **#6292**, **#6295**

用户真实需求不是“支持 OAuth”这么简单，而是：
- 作业长时间运行时 token 不要过期；
- 不希望手工注入静态密钥；
- 希望存储访问和 catalog 权限能统一管理。

这属于生产环境可运维性的核心诉求。

---

### 6.3 查询引擎边界兼容问题仍然影响高级用户
- 相关链接: **PR #6257**, **#6259**, **#6332**

包括：
- Decimal 精度/scale 边界行为；
- LIMIT 下推；
- Variant 类型支持；
- 非 Spark 依赖的 kernel 测试。

这类反馈通常来自：
- 在意 SQL 兼容性的引擎开发者；
- 需要精确数值处理的业务系统；
- 希望在 Delta Kernel 上构建独立读写/查询能力的集成方。

---

## 7. 待处理积压

以下是值得维护者继续关注的长期或重要未决项：

### 7.1 CDC streaming offset management 三段式 PR 仍未合入
- **PR #6075 / #6076 / #6336**  
  链接: delta-io/delta PR #6075 / #6076 / #6336

这组 PR 自 2026-02-19 起持续演进，跨度已超过一个月，说明复杂度较高。  
建议维护者重点关注：
- API/状态机设计是否稳定；
- 是否需要拆小以便更快合并；
- 与 4.2.x 发布节奏的关系。

---

### 7.2 Decimal 类型修复 PR 已存在一段时间，建议尽快给出结论
- **PR #6257**  
- **PR #6259**  
  链接: delta-io/delta PR #6257 / #6259

这两条均创建于 2026-03-12，属于类型系统与表达式求值层面的正确性问题。  
如果迟迟不处理，可能持续影响对 Kernel 做深度集成的用户。

---

### 7.3 REST Catalog API v1 client integration 信息较少但战略意义高
- **PR #6347**  
  链接: delta-io/delta PR #6347

尽管是新 PR，但其方向重要。建议维护者尽快补充：
- 设计说明；
- 与现有 catalog 路径关系；
- 是否面向实验性或正式接口。

---

### 7.4 已关闭的 collations 特性需要给社区更明确的后续信号
- **PR #5718**  
  链接: delta-io/delta PR #5718

由于该特性涉及 SQL 兼容性与协议演进，关闭本身就是重要信号。  
建议说明是：
- 暂缓；
- 拆分重做；
- 方案被替代；
- 或已转移到其他实现路径。

否则容易让关注字符排序规则与国际化语义的用户产生不确定性。

---

## 8. 总结判断

今天的 Delta Lake 呈现出典型的 **候选版本发布前后收敛期** 特征：

- **版本层面**：4.2.0-RC0 已发出测试信号，主干已切到 `4.2.0-SNAPSHOT`；
- **功能层面**：Kernel、CDC、Variant、REST Catalog、ServerSidePlanning 都在并行推进；
- **稳定性层面**：多个 flaky test 与认证链路问题正在修复；
- **生态层面**：Unity Catalog 与 catalog-driven 环境已成为当前最明确的产品重心。

综合判断，项目活跃度高、方向清晰，短期内最值得关注的是 **4.2.0 RC 测试反馈**、**UC/SSP 认证链路收敛**，以及 **kernel-spark CDC 流式 offset 管理** 的合入进展。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

以下为 **Databend 2026-03-22 项目动态日报**。

---

# Databend 项目动态日报 · 2026-03-22

## 1. 今日速览

过去 24 小时内，Databend 仓库 **无 Issues 更新**，但 **PR 活跃度较高，共 9 条更新**，其中 **5 条待合并、4 条已合并/关闭**，说明当前开发重心仍集中在代码迭代与问题修复，而非社区问题单流入。  
从变更内容看，今日工作主要聚焦在 **SQL 解析正确性修复、查询引擎边界行为收敛、测试诊断能力增强**，同时也有 **Fuse 存储层抽象重构** 和 **优化器类型收缩能力** 的持续推进。  
另外，项目发布了一个补丁版本 **v1.2.888-patch-2**，表明维护者仍在对稳定分支进行修补和交付。  
整体来看，项目健康度良好：**核心开发持续、补丁发布正常、修复方向明确**，但由于缺少公开 issue 讨论，外部用户反馈面在今日数据中相对有限。

---

## 2. 版本发布

## v1.2.888-patch-2
- Release: **v1.2.888-patch-2**
- 链接: https://github.com/databendlabs/databend/releases/tag/v1.2.888-patch-2
- Changelog: https://github.com/databendlabs/databend/compare/v1.2.889-nightly...v1.2.888-patch-2

### 版本解读
本次为 **patch 级补丁发布**，从提供的数据中未披露详细 release notes，仅给出了与 nightly 的对比链接。结合当日 PR 主题，可合理判断该补丁分支重点仍可能围绕：
- SQL 解析与语义边界修复
- 兼容性回归修复
- 查询与测试工具链稳定性增强

### 破坏性变更
- **当前数据中未看到明确的 breaking changes 声明。**

### 迁移注意事项
由于这是 patch 版本，通常不涉及显式迁移，但仍建议用户关注以下事项：
1. 若近期依赖 **UNION / grouped set operation** 的复杂 SQL，建议升级后重点回归测试解析与打印链路。
2. 若使用 **UNLOAD** 并组合参数 `include_query_id=true`、`use_raw_path=true`，应验证兼容行为是否符合预期，因相关逻辑刚发生修复。  
3. 若使用 Fuse 表的高级快照/标签能力，需留意实验性功能 PR 仍在进行中，**不建议将未合并特性视为当前稳定版本能力**。

---

## 3. 项目进展

以下为今日已合并/关闭、且较有代表性的 PR 进展。

### 3.1 SQL 解析正确性修复：保留 UNION 分组括号
- PR: #19585 [CLOSED] fix(parser): preserve parentheses for grouped set operations  
  链接: https://github.com/databendlabs/databend/pull/19585
- PR: #19586 [CLOSED] fix(parser): preserve parentheses for grouped set operations  
  链接: https://github.com/databendlabs/databend/pull/19586
- 关联开放 PR: #19587 [OPEN] fix(query): preserve parentheses in UNION queries  
  链接: https://github.com/databendlabs/databend/pull/19587

#### 影响分析
这组修复围绕同一问题展开：**SQL 中带括号的 UNION / set operation 在 AST 转换阶段丢失括号信息，进而在 SQL display / pretty print 或后续断言中触发 panic**。  
这类问题虽然不一定造成执行层面的数据错误，但会直接影响：
- SQL parser 稳定性
- AST 往返一致性
- 查询重写/显示链路的正确性
- 某些 IDE、调试器、SQL 诊断工具的兼容性

#### 推进意义
这是典型的 **SQL 兼容性与正确性修补**，对 Databend 作为分析型数据库的上层体验非常关键，尤其对复杂 BI 查询、自动生成 SQL 的中间层系统更重要。

---

### 3.2 UNLOAD 参数兼容性修复
- PR: #19583 [CLOSED] fix: unload allow `include_query_id=true use_raw_path=true` for compat.  
  链接: https://github.com/databendlabs/databend/pull/19583

#### 影响分析
该修复处理的是导出路径生成相关参数的兼容问题。PR 摘要表明：
- `include_query_id=true`
- `use_raw_path=true`

这两个选项在逻辑上存在冲突，但此前并未充分校验；相关历史改动可能导致兼容性问题。此次修复目标是 **为兼容场景放宽或修正行为**。

#### 推进意义
这属于 **外部数据导出链路的行为稳定性修复**，对数据集成、批量导出、对象存储落盘任务影响较大。  
在 OLAP 场景下，UNLOAD 常用于报表分发、离线计算中间结果导出和与湖仓链路对接，因此这类兼容修复具有较高实用价值。

---

### 3.3 sqllogictest 失败诊断能力增强
- PR: #19528 [CLOSED] feat(test): display query_id on sqllogictest failure  
  链接: https://github.com/databendlabs/databend/pull/19528

#### 影响分析
该 PR 为 sqllogictest 失败输出增加 `query_id`，能显著提升失败定位效率。  
对于 Databend 这类执行引擎复杂、并发和优化规则较多的系统，query_id 是串联：
- 查询日志
- profile / trace
- 后端执行诊断
- CI 失败复现

的关键索引。

#### 推进意义
这不是面向终端用户的新功能，但对维护者与贡献者十分关键，能降低回归排查成本，增强 CI 可维护性，间接提升整体工程质量。

---

## 4. 社区热点

> 说明：今日数据未提供评论数与 reaction 明细，且 issue 活动为 0，因此以下“热点”依据 **更新频率、问题影响范围、功能级别** 进行判断。

### 热点 1：Fuse 存储抽象重构
- PR: #19576 [OPEN] [pr-refactor] refactor(storage): extract fuse block format abstraction  
  链接: https://github.com/databendlabs/databend/pull/19576

#### 技术诉求分析
该 PR 试图：
- 抽取 `FuseBlockFormat` 抽象
- 用共享的 `ReadDataTransform` 替代原 native/parquet 分离读取变换
- 统一 Fuse read pipeline 构建

这说明维护者正在解决 **存储格式分叉导致的读取路径复杂化** 问题。背后的核心诉求是：
- 降低 Fuse 存储层格式耦合
- 统一读路径，减少维护面
- 为后续支持更多 block format / 优化读路径打基础

这类重构通常不是“立刻可见”的用户功能，但对 **性能优化、格式演进、可测试性** 影响深远，是典型的中长期架构工作。

---

### 热点 2：优化器类型收缩规则
- PR: #19581 [OPEN] [pr-feature] feat(optimizer): introduce type shrinking rules for aggregates and joins  
  链接: https://github.com/databendlabs/databend/pull/19581

#### 技术诉求分析
该 PR 为 aggregates 和 joins 引入 **type shrinking rules**，并附带 benchmark test。  
从优化器角度看，这类工作通常旨在：
- 缩小中间结果列类型宽度
- 降低内存占用
- 改善 hash join / aggregate 的缓存与序列化效率
- 在不破坏语义的前提下提升执行效率

这释放出较强的路线图信号：Databend 正在持续打磨 **执行效率与资源利用率**，而不仅是补 SQL 功能点。

---

### 热点 3：实验性 FUSE table snapshot tags
- PR: #19549 [OPEN] [pr-feature] feat(query): support experimental table tags for FUSE table snapshots  
  链接: https://github.com/databendlabs/databend/pull/19549

#### 技术诉求分析
该 PR 引入 **KV-backed table tag model**，并显式说明不再复用 legacy table-ref branch/tag 实现。  
背后反映的需求包括：
- 快照级对象引用能力增强
- 更清晰的版本/标签模型
- 为时间旅行、数据回溯、实验性分支访问等场景奠基

对分析型存储引擎而言，这类能力有望服务：
- 数据发布版本管理
- 可重复分析
- 特定快照回放
- 多环境验证

---

## 5. Bug 与稳定性

按严重程度与影响面排序如下：

### 高优先级：SQL parser 对带括号 UNION 的处理会触发断言失败或 panic
- 相关 PR:
  - #19585 https://github.com/databendlabs/databend/pull/19585
  - #19586 https://github.com/databendlabs/databend/pull/19586
  - #19587 https://github.com/databendlabs/databend/pull/19587
- 关联问题: #19578（由 PR 摘要提及）
- 状态: **已有 fix，且同日持续修正中**

#### 风险说明
这是 **查询正确性/稳定性问题**。如果 SQL 带括号包裹的 UNION 表达式在 AST 中被错误降解，可能导致：
- parser assertion fail
- SQL display panic
- 某些查询改写/格式化流程异常

#### 严重度判断
对生产数据正确性未见直接破坏证据，但对 SQL 兼容性和可用性影响较大，尤其会打断复杂查询工作流。

---

### 中优先级：递归视图创建/修改未被阻止
- PR: #19584 [OPEN] fix(query): avoid create or alter recursive views  
  链接: https://github.com/databendlabs/databend/pull/19584
- 关联问题: #19572
- 状态: **修复 PR 已打开，待合并**

#### 风险说明
若系统允许 create/alter recursive views，可能导致：
- 解析或绑定阶段的循环依赖
- 优化器/执行器无法终止
- 元数据依赖图异常

#### 严重度判断
这是 **语义安全与元数据一致性** 问题。虽然未见已发生 crash 的描述，但应尽快阻断。

---

### 中优先级：UNLOAD 组合参数兼容行为异常
- PR: #19583 [CLOSED] fix: unload allow `include_query_id=true use_raw_path=true` for compat.  
  链接: https://github.com/databendlabs/databend/pull/19583
- 状态: **已修复**

#### 风险说明
主要影响导出路径命名与兼容行为，对已有外部任务脚本、对象存储目录布局可能造成偏差。

---

### 低优先级但重要：测试定位信息不足
- PR: #19528 [CLOSED] feat(test): display query_id on sqllogictest failure  
  链接: https://github.com/databendlabs/databend/pull/19528
- 状态: **已关闭/完成**

#### 风险说明
这不是用户侧 bug，但会影响回归问题排查效率，属于工程稳定性基础设施改进。

---

## 6. 功能请求与路线图信号

今日没有新 issue 形式的功能请求，但从开放 PR 可以看到较明确的下一阶段方向：

### 6.1 查询优化器继续向“执行效率导向”演进
- PR: #19581  
  链接: https://github.com/databendlabs/databend/pull/19581

**信号判断：高概率进入后续版本。**  
原因：
- 是已有工作延续（PR 摘要提到 continue work from #19177）
- 附带 benchmark test，说明并非概念性提交
- 涉及聚合与连接两大核心路径，收益面广

---

### 6.2 Fuse 存储读路径统一化
- PR: #19576  
  链接: https://github.com/databendlabs/databend/pull/19576

**信号判断：中高概率纳入后续版本。**  
原因：
- 这是明显的架构整合工作，不像一次性试验
- 若完成，将有助于后续格式能力扩展和维护成本下降
- 属于“内部重构先行，外部收益后显现”的典型演进路线

---

### 6.3 FUSE 表快照标签能力
- PR: #19549  
  链接: https://github.com/databendlabs/databend/pull/19549

**信号判断：可能作为实验特性逐步落地。**  
原因：
- PR 明确标注 **experimental**
- 采用全新 KV-backed tag model，说明设计层面较认真
- 该能力与数据版本治理、快照引用、表级可追溯性高度相关，符合分析型数据库发展趋势

---

## 7. 用户反馈摘要

今日 **无 Issues 更新**，因此没有可直接提炼的 issue 评论型用户反馈。  
不过可从 PR 所指向的问题类型间接观察到一些真实使用痛点：

1. **复杂 SQL 兼容性仍是显性需求**  
   UNION + parentheses 问题表明，用户或测试体系中存在较多复杂 set operation 查询，对 SQL 标准兼容和 AST 往返稳定性要求很高。  
   相关链接：
   - #19587 https://github.com/databendlabs/databend/pull/19587

2. **导出接口参数行为需要更强兼容保障**  
   UNLOAD 参数冲突修复说明用户实际依赖的脚本/工作流对行为变化较敏感。  
   相关链接：
   - #19583 https://github.com/databendlabs/databend/pull/19583

3. **运维与测试可观测性是持续需求**  
   query_id 输出增强体现出开发者/测试使用者希望更快完成故障定位，说明 Databend 已进入对稳定性工具链持续打磨的阶段。  
   相关链接：
   - #19528 https://github.com/databendlabs/databend/pull/19528

---

## 8. 待处理积压

结合今日数据，以下开放 PR 值得维护者重点关注：

### #19549 实验性 table tags 功能
- 链接: https://github.com/databendlabs/databend/pull/19549
- 创建时间: 2026-03-13
- 状态: OPEN

这是功能性较强、架构影响较深的 PR，已开放多日仍未合入。建议关注：
- 元数据模型是否稳定
- 与 legacy branch/tag 语义如何隔离
- 是否需要 feature flag 或文档说明实验性边界

---

### #19576 Fuse block format 抽象重构
- 链接: https://github.com/databendlabs/databend/pull/19576
- 创建时间: 2026-03-19
- 状态: OPEN

该 PR 涉及读路径统一，是典型高价值但高审阅成本改动。建议尽早完成：
- 性能回归验证
- native/parquet 兼容覆盖
- pipeline 构造正确性检查

---

### #19581 优化器 type shrinking
- 链接: https://github.com/databendlabs/databend/pull/19581
- 创建时间: 2026-03-19
- 状态: OPEN

该改动具有潜在性能收益，且已经包含 benchmark。建议维护者优先审阅其：
- 类型收缩边界条件
- 聚合/连接精度与语义保持
- 是否覆盖 decimal / nullable / signedness 等复杂类型

---

### #19584 递归视图限制修复
- 链接: https://github.com/databendlabs/databend/pull/19584
- 创建时间: 2026-03-21
- 状态: OPEN

虽然是新 PR，但由于它涉及元数据依赖与语义安全，建议 **高优先级处理**，避免递归视图进入更大范围使用面。

---

# 总结

Databend 今日呈现出 **“补丁发布 + 核心修复 + 中期架构演进并行”** 的典型健康节奏。  
短期内，项目重点明显落在 **SQL 正确性、导出兼容性、测试诊断能力**；中期则持续推进 **Fuse 存储抽象统一** 与 **优化器资源效率提升**。  
尽管今日缺少 issue 维度的社区反馈，但从 PR 内容看，维护者仍在积极消化真实使用中的边界问题，并为后续版本积累存储与优化器层面的技术红利。

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的简版**
2. **适合公众号/周报的长版**
3. **Markdown 表格版** 方便你直接粘贴到内部日报系统。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报 - 2026-03-22

## 1. 今日速览

过去 24 小时内，Velox 没有新增或活跃 Issue，说明当天社区外部问题反馈较少；但 PR 活跃度很高，共有 43 条更新，其中 17 条待合并、26 条已合并或关闭，研发推进节奏明显偏强。  
从内容看，今日工作重心集中在 **Iceberg 连接器/写入链路完善、构建依赖修复、查询执行稳定性修复，以及 Presto/Spark SQL 兼容能力增强**。  
值得注意的是，关闭/合并的 PR 中有一批与 Iceberg 相关的历史 PR 在同一天集中收尾，反映出该方向近期经历了较系统的整理与落地。  
整体判断：**项目健康度良好，开发活跃度高，短期重点仍围绕分析存储格式兼容与执行引擎稳定性提升。**

---

## 2. 项目进展

### 2.1 查询执行与稳定性修复

#### 1) 跳过无选中行时的 HashProbe 过滤计算，修复 ANTI JOIN 崩溃
- **PR**: #16868  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16868

该 PR 修复了 `HashProbe::evalFilter` 在特定 **ANTI JOIN + filter 引用 probe-side join key** 场景下的 debug 校验失败崩溃问题。  
技术上看，问题出现在“没有有效选中行时仍继续执行 filter 计算”，导致 `DictionaryVector::validate` 触发 sanity check failure。  
这属于典型的 **查询执行正确性/稳定性问题修复**，虽然目前仍未合并，但定位明确，预计优先级较高。

**影响判断：**
- 影响 Join 执行路径稳定性；
- 对复杂条件下的 ANTI JOIN 正确性和鲁棒性有直接帮助；
- 若用户在 debug 构建或测试环境复现该类查询，体感会比较明显。

---

#### 2) 预加载 lazy probe input，降低 probe 循环中的 reclaim 风险
- **PR**: #16774  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16774

该 PR 将 lazy loading 从 probe 主循环中前移，在进入不可回收区间前集中完成加载，同时配合 `maybeReserve` 和 `ReclaimableSectionGuard` 给内存仲裁器一个回收窗口。  
这是一次较典型的 **执行引擎内存管理与资源回收时序优化**，目标是缓解 probe 阶段因惰性加载触发的错误栈和资源竞争。

**推进意义：**
- 改善算子主循环中的内存行为；
- 降低 reclaim 相关异常；
- 对大查询、复杂 Join、受内存仲裁影响的场景更有价值。

---

### 2.2 SQL 兼容性与函数能力扩展

#### 3) 新增 Presto SQL 类型格式化能力 `toPrestoTypeSql()`
- **PR**: #16876  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16876

该 PR 将原本位于测试工具中的 `toTypeSql()` 提升到生产代码路径，并重命名为 `toPrestoTypeSql()`，用于 **Presto 方言类型 SQL 格式化**。  
同时还修复了原实现中的多个问题，包括自定义类型、复杂类型表示等。

**技术意义：**
- 强化 Velox 在 **Presto 方言兼容层** 的基础设施；
- 有助于类型系统序列化、错误提示、SQL 生成等场景；
- 从“测试工具”转为“生产可用”是明显的能力成熟信号。

---

#### 4) Spark SQL 新增 `approx_count_distinct_for_intervals` 聚合函数
- **PR**: #16595  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16595

该 PR 为 Spark SQL 增加 `approx_count_distinct_for_intervals` 聚合函数，用于支持 **Spark CBO 直方图 NDV 聚合**。  
实现上复用了 Velox 的 HLL 累加器，并强调与 Spark 对 interval 处理和重复端点语义的一致性。

**推进意义：**
- 强化 Velox 对 **Spark SQL 生态与优化器统计信息** 的兼容；
- 对依赖 CBO 的查询计划质量有潜在价值；
- 这是非常明确的“向上层引擎兼容”信号。

---

### 2.3 Iceberg / Parquet / 连接器能力推进

#### 5) Iceberg 相关构建依赖修复：ParquetWriter 链接要求补齐
- **PR**: #16867  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16867

该 PR 修复 `IcebergParquetStatsCollector` 对 `ParquetWriter` 的构建依赖问题，并顺带整理了头文件包含关系。  
这说明 Iceberg 写入与统计收集链路在工程层面仍在打磨，尤其是 **模块边界与链接依赖** 还在持续稳定化。

---

#### 6) Iceberg splitreader CMake 缺失 parquet writer 链接
- **PR**: #16877  
- **状态**: OPEN, draft  
- **链接**: facebookincubator/velox PR #16877

这是与 #16867 高度相关的另一个修复 PR，指出 `velox_hive_iceberg_splitreader` 在启用 `VELOX_ENABLE_PARQUET` 时会编译依赖 `IcebergParquetStatsCollector.cpp`，但 CMake 只链接了 header-only 的 `velox_dwio_parquet_field_id`，缺少实际 writer 依赖。  
该问题本质上属于 **条件编译场景下的构建系统不完整**。

**判断：**
- 对使用 Iceberg + Parquet 的下游集成方影响较大；
- 若构建矩阵覆盖不足，这类问题很容易延后暴露；
- 预计会较快得到修正或与 #16867 合流。

---

### 2.4 今日关闭/合并的重点成果

以下 PR 虽不是今天创建，但在今天关闭或完成，构成了本日报最重要的“已落地进展”。

#### 7) 支持 Iceberg 兼容的 min/max 统计
- **PR**: #16060  
- **状态**: CLOSED / Merged  
- **链接**: facebookincubator/velox PR #16060

这是今日最重要的已落地功能之一。该 PR 在 Parquet writer 中加入 **Iceberg-compatible min/max statistics** 计算逻辑，特别处理了：
- Decimal 使用 Iceberg 要求的 big-endian 编码；
- 与标准 Parquet 统计编码差异对齐。

**意义：**
- 直接提升 Velox 写出的数据文件对 Iceberg 元数据/统计语义的兼容度；
- 有助于下游表格式系统正确使用列统计进行裁剪与优化；
- 是 Velox 向开放湖仓格式深度对齐的重要一步。

---

#### 8) Iceberg connector 重构落地
- **PR**: #15581  
- **状态**: CLOSED / Merged  
- **链接**: facebookincubator/velox PR #15581

该 PR 将 Iceberg connector 从 Hive connector 中进一步解耦，形成独立演进基础。  
这不是简单重命名，而是架构层面的连接器边界重整。

**意义：**
- 为后续 Iceberg 特有能力独立发展铺路；
- 降低 Hive/Iceberg 代码耦合；
- 说明维护者已把 Iceberg 视为一等公民能力方向。

---

#### 9) 增加 Iceberg 分区名生成器
- **PR**: #15461  
- **状态**: CLOSED / Merged  
- **链接**: facebookincubator/velox PR #15461

实现了 Iceberg 分区表写入时所需的分区名生成逻辑，覆盖 Iceberg 与 Hive 分区命名差异。  
结合 partition transform 相关 PR，可看出 Velox 正在补齐 **Iceberg 写路径** 的关键积木。

---

#### 10) 修复 Infinity/-Infinity 下的 min/max 统计错误
- **PR**: #14603  
- **状态**: CLOSED / Merged  
- **链接**: facebookincubator/velox PR #14603

修复 Parquet writer 在 float/double 列取值为 `infinity` 或 `-infinity` 时统计信息与 Iceberg 实现不一致的问题。  
这是典型的 **边界值统计正确性修复**，对于谓词下推、文件级裁剪与元数据一致性很关键。

---

#### 11) 修复 GCS 可选配置未设置时访问异常
- **PR**: #14104  
- **状态**: CLOSED / Merged  
- **链接**: facebookincubator/velox PR #14104

修复 `hive.gcs.endpoint` 未配置时查询或写入 GCS 触发内部错误的问题。  
这是连接器配置健壮性增强，对云对象存储用户比较实用。

---

#### 12) 其他已落地工程/测试改善
- **删除冗余 Iceberg 测试**: #16091  
  链接: facebookincubator/velox PR #16091
- **修复 pre-commit 在 python14 上的 regex 问题**: #15893  
  链接: facebookincubator/velox PR #15893
- **DuckDB QueryRunner 增加 TIME 类型支持**: #15016  
  链接: facebookincubator/velox PR #15016
- **新增 `BaseVector::createFromVariants` 便捷 API**: #15955  
  链接: facebookincubator/velox PR #15955

这些变更虽然不如核心执行路径显眼，但对 **测试覆盖、开发体验、类型兼容性和基础 API 可用性** 都有正向作用。

---

## 3. 社区热点

> 注：提供的数据中评论数均显示为 `undefined`，无法严格按“评论最多”排序。以下热点按技术影响力与今日更新集中度判断。

### 热点一：Iceberg 写入与统计链路持续收敛
- **PR**: #16867, #16877, #16060, #15461, #15581, #14603  
- **链接**:  
  - facebookincubator/velox PR #16867  
  - facebookincubator/velox PR #16877  
  - facebookincubator/velox PR #16060  
  - facebookincubator/velox PR #15461  
  - facebookincubator/velox PR #15581  
  - facebookincubator/velox PR #14603  

**背后技术诉求：**
- 让 Velox 在 Iceberg 生态中不仅“能读”，而且“能正确写、能产出兼容统计、能支持分区语义”；
- 解决连接器独立演进问题；
- 修复 Parquet writer 与 Iceberg 元数据规范之间的细节偏差。

这是一条非常清晰的路线：**Velox 正从通用执行引擎，向更深的湖仓表格式兼容层延伸。**

---

### 热点二：执行引擎中的 Join/内存管理稳定性
- **PR**: #16868, #16774  
- **链接**:  
  - facebookincubator/velox PR #16868  
  - facebookincubator/velox PR #16774  

**背后技术诉求：**
- 复杂 Join 条件下避免错误过滤计算；
- 处理 lazy loading 与内存回收的时序冲突；
- 提升大查询、复杂算子流水下的鲁棒性。

这表明 Velox 当前不仅在扩功能，也在继续抛光 **算子级稳定性**，尤其是资源紧张和边界条件场景。

---

### 热点三：多 SQL 方言兼容继续增强
- **PR**: #16876, #16595  
- **链接**:  
  - facebookincubator/velox PR #16876  
  - facebookincubator/velox PR #16595  

**背后技术诉求：**
- Presto 方言需要更标准的类型 SQL 表达；
- Spark SQL 需要更高层次的统计函数兼容，以支撑 CBO 和引擎对齐。

这说明 Velox 继续扮演 **多上层引擎共享执行层** 的角色，兼容层投入没有减弱。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1：ANTI JOIN + filter 引用 probe-side key 时的崩溃风险
- **PR**: #16868  
- **状态**: 已有 fix PR（未合并）  
- **链接**: facebookincubator/velox PR #16868

**问题类型**：执行期崩溃 / Debug 校验失败  
**影响范围**：特定 Join + Filter 组合  
**风险判断**：高。涉及查询稳定性和正确性，建议优先合并验证。

---

### P1：Iceberg/Parquet 条件构建下链接依赖不完整
- **PR**: #16867, #16877  
- **状态**: 已有 fix PR（均未合并，其中 #16877 为 draft）  
- **链接**:  
  - facebookincubator/velox PR #16867  
  - facebookincubator/velox PR #16877  

**问题类型**：构建失败 / 工程集成问题  
**影响范围**：启用 Iceberg + Parquet 的构建场景  
**风险判断**：高。对下游集成与 CI 覆盖有直接影响。

---

### P2：Probe 循环中的 lazy loading 与 reclaim 时序问题
- **PR**: #16774  
- **状态**: 已有 fix PR（未合并）  
- **链接**: facebookincubator/velox PR #16774  

**问题类型**：内存管理时序 / 运行稳定性  
**影响范围**：受内存仲裁与惰性加载影响的查询  
**风险判断**：中高。更多体现在复杂生产负载下。

---

### P2：Parquet 统计信息与 Iceberg 规范不一致
- **PR**: #16060, #14603  
- **状态**: 已合并  
- **链接**:  
  - facebookincubator/velox PR #16060  
  - facebookincubator/velox PR #14603  

**问题类型**：统计信息正确性 / 格式兼容  
**影响范围**：Iceberg 写路径、谓词裁剪、元数据一致性  
**风险判断**：中。现已得到修复，对湖仓场景价值高。

---

### P3：GCS 可选配置未设置时触发内部错误
- **PR**: #14104  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #14104  

**问题类型**：连接器配置健壮性  
**影响范围**：GCS 用户  
**风险判断**：中低。问题具体，但修复实用。

---

## 5. 功能请求与路线图信号

### 1) Iceberg 能力仍是近期最强路线图信号
相关 PR：
- #15581 Iceberg connector 解耦  
- #15461 分区名生成  
- #16060 Iceberg 兼容 min/max stats  
- #13874 支持 Iceberg partition transforms（已关闭，未合并）  
- #14146 插入时收集 Iceberg data file statistics（已关闭，未合并）  
- **链接**:  
  - facebookincubator/velox PR #15581  
  - facebookincubator/velox PR #15461  
  - facebookincubator/velox PR #16060  
  - facebookincubator/velox PR #13874  
  - facebookincubator/velox PR #14146  

**判断：**
虽然 `partition transforms` 和 `插入时文件统计收集` 两个旧 PR 今日被关闭，但并不意味着方向放弃。相反，结合已合并的 connector、partition naming、stats compatibility 等工作，更像是：
- 旧实现被淘汰；
- 功能可能以新的架构路径重新提交；
- Iceberg 写路径仍会持续推进。

---

### 2) Spark SQL 聚合兼容有望继续扩展
- **PR**: #16595  
- **链接**: facebookincubator/velox PR #16595

`approx_count_distinct_for_intervals` 不是通用 SQL 基础函数，而是明显为 Spark 优化器/统计链路服务。  
这说明 Velox 对 Spark backend 的支持已进入更细分的兼容阶段，后续可能看到：
- 更多 Spark 特有聚合或表达式；
- 面向 CBO/统计信息的函数扩展；
- 与 Spark planner 语义对齐的边界行为修补。

---

### 3) Presto 方言基础设施会继续增强
- **PR**: #16876  
- **链接**: facebookincubator/velox PR #16876

将类型 SQL 格式化从测试代码迁入生产代码，通常意味着后续会有更多地方复用这一能力。  
可能的下一步包括：
- 类型打印/序列化统一；
- 错误信息和 explain 输出更规范；
- 与 Presto 生态工具链更一致。

---

## 6. 用户反馈摘要

由于今日 **Issue 更新为 0**，且所给 PR 数据未包含有效评论内容，无法直接提炼大量一手用户评论。  
但从 PR 摘要可以反推出几类真实使用痛点：

1. **湖仓格式兼容性是强诉求**  
   Iceberg 相关 PR 集中在分区转换、文件统计、min/max 编码一致性、独立 connector 上，说明用户或下游系统并不满足于“能接入”，而是要求 **元数据、统计信息、写出格式都严格兼容**。  
   相关链接：facebookincubator/velox PR #16060, #15461, #15581, #14603

2. **生产环境更关注复杂查询稳定性**  
   Join filter、lazy loading、内存 reclaim 时序问题被单独修复，说明在真实负载下，用户会遇到边界型稳定性问题，而不仅仅是功能缺失。  
   相关链接：facebookincubator/velox PR #16868, #16774

3. **多引擎兼容不仅是语法层，还包括优化器语义层**  
   Spark 的 interval NDV 聚合和 Presto 类型 SQL 格式化，都体现用户需要更深度的上层生态兼容。  
   相关链接：facebookincubator/velox PR #16595, #16876

---

## 7. 待处理积压

以下是今天仍值得维护者关注的待处理或刚关闭但反映长期积压的问题：

### 1) Spark interval NDV 聚合尚未合并
- **PR**: #16595  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16595

这是一个明确面向 Spark CBO 的功能增强，价值清晰。如果 Spark backend 是近期重点，建议加快评审。

---

### 2) Presto 类型 SQL 格式化基础设施待落地
- **PR**: #16876  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16876

该功能虽不直接提升性能，但属于长期收益高的基础设施，建议优先合并，减少方言类型处理分散实现。

---

### 3) Join 执行稳定性修复仍未合并
- **PR**: #16868  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16868

涉及潜在崩溃，建议维护者优先关注，必要时补更多回归测试。

---

### 4) Lazy loading / reclaim 时序优化仍在队列中
- **PR**: #16774  
- **状态**: OPEN  
- **链接**: facebookincubator/velox PR #16774

此类问题通常复现门槛高，但对生产鲁棒性影响大。建议重点验证高并发与内存压力场景。

---

### 5) Iceberg 历史 PR 集中关闭，需防止功能上下文丢失
- **PR**: #13874, #14146, #14518, #14147  
- **状态**: CLOSED  
- **链接**:  
  - facebookincubator/velox PR #13874  
  - facebookincubator/velox PR #14146  
  - facebookincubator/velox PR #14518  
  - facebookincubator/velox PR #14147  

这些 PR 虽已关闭，但涉及：
- partition transforms
- 插入时 data file statistics
- connector/cmake 目标命名
- 配套测试

建议维护者确保相关设计与测试意图已在新 PR 或重构路径中继承，否则可能形成“功能被拆散后未完全回补”的隐性积压。

---

## 8. 结论

Velox 在 2026-03-22 的总体表现是：**外部问题面平静，内部研发推进强劲**。  
当天最鲜明的主题是 **Iceberg 生态能力持续补强**，其次是 **执行引擎稳定性修复** 和 **Presto/Spark SQL 兼容增强**。  
如果接下来几天 #16868、#16867/#16877、#16876、#16595 能顺利推进，Velox 将在 **湖仓兼容、查询鲁棒性和多引擎适配** 三条线上继续保持积极势头。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持中等活跃：Issues 更新 3 条、PR 更新 6 条，暂无新版本发布。  
从内容看，今天的重点主要集中在 **测试体系纠偏、查询正确性修复、Velox 指标完善** 三个方向，而不是大规模新功能落地。  
一个积极信号是，`collect_list + sort by` 的结果错误问题已随关联 PR 关闭，说明项目对 SQL 语义正确性的修复在持续推进。  
同时，社区也暴露出两个值得关注的稳定性话题：**内存充足但仍 OOM 的运行时异常**，以及 **部分 Velox 社区补丁长期未进入上游**，这反映出 Gluten 在 Velox 集成链路上的工程复杂度仍然较高。  
整体来看，项目健康度稳定，当前更偏向于 **补齐测试可信度、修复边界语义问题、改善可观测性** 的打磨阶段。

---

## 3. 项目进展

### 已关闭 / 已合并的重要 PR

#### 1) 修复 Hash Aggregate 的排序消除规则，解决 `collect_list` 正确性问题
- **PR**: #9473 `[CORE, VELOX] [GLUTEN-8227][VL] fix: Update sort elimination rules for Hash Aggregate`  
- **状态**: CLOSED  
- **链接**: apache/gluten PR #9473
- **关联 Issue**: #8227  
- **链接**: apache/gluten Issue #8227

**进展解读：**  
该 PR 针对 Hash Aggregate 的 sort elimination 规则进行了收敛：只有当基础聚合原本是 sort aggregate，且被安全地改写为 hash aggregate 时，才允许移除排序依赖。  
这直接修复了 `collect_list` 在带 `sort by` 语义时可能出现的结果不一致问题。对分析型查询引擎来说，这类问题属于 **SQL 语义正确性修复**，优先级通常高于纯性能优化。  
Issue #8227 已关闭，说明对应问题已得到处理，属于今天最有价值的稳定性推进之一。

**技术意义：**
- 修复顺序敏感聚合函数的语义错误；
- 避免优化规则过度激进导致结果错乱；
- 提升 Velox 后端在复杂聚合场景下的 SQL 兼容性。

---

#### 2) 修复 PlanStability 测试套件未真正启用 Gluten 插件的问题
- **PR**: #11799 `[CORE] [GLUTEN-11550][UT] Fix PlanStability test suites for Velox backend`  
- **状态**: CLOSED  
- **链接**: apache/gluten PR #11799

**进展解读：**  
该 PR 修复了 Spark 4.0 / 4.1 下 PlanStability 测试套件的根本性问题：此前测试虽然“通过”，但实际上并未加载 GlutenPlugin，而是在原生 Spark 上执行，因此对 Gluten 计划稳定性的验证并不可信。  

这不是用户可见功能变更，但对项目工程质量意义重大：
- 纠正了“假阳性”测试结果；
- 确保后续计划稳定性测试真正覆盖 Gluten 执行路径；
- 为 Spark 4.x 适配质量提供更可靠的回归保护。

---

### 今日仍在推进的关键 PR

#### 3) 继续修正 Spark 4.0/4.1 测试 trait 使用方式
- **PR**: #11800 `[CORE] [GLUTEN-11550][UT] Replace GlutenTestsCommonTrait with correct Gluten test traits for Spark 4.0/4.1`
- **状态**: OPEN  
- **链接**: apache/gluten PR #11800

这是 #11799 的延续性工作，目标是替换错误使用的测试基类，确保测试套件真正创建启用了 Gluten 的 SparkSession。  
从节奏上看，维护者正在系统性清理 Spark 4.x 测试框架中的“表面通过、实际未覆盖”问题。

---

#### 4) 为 PlanStability 引入 Gluten 专属 golden file 对比
- **PR**: #11805 `[CORE] [GLUTEN-11550][UT] Add golden file comparison for PlanStability test suites`
- **状态**: OPEN  
- **链接**: apache/gluten PR #11805

这是测试体系建设的进一步增强。  
引入 golden file 对比后，未来一旦查询计划发生意外变化，可更早发现回归，尤其适合：
- Spark 版本升级；
- 优化规则调整；
- Velox/Gluten 集成逻辑变化。

---

#### 5) 补齐 Velox 指标：把 `kPreloadSplitPrepareTimeNanos` 纳入 `kDataSourceAddSplitWallNanos`
- **PR**: #11709 `[BUILD, VELOX] [VL] Metrics: Include kPreloadSplitPrepareTimeNanos in kDataSourceAddSplitWallNanos`
- **状态**: OPEN  
- **链接**: apache/gluten PR #11709

该 PR 聚焦可观测性，修正 Spark UI 中数据源 split 添加耗时指标的统计口径。  
作者明确说明这是 **UI 指标层面的 breaking change**：`data source add split time total` 将比以前更长，因为此前漏记了 preload 相关时间。  

**意义：**
- 让性能画像更贴近真实开销；
- 避免用户误判 scan/split 准备时间；
- 为后续定位 IO/调度瓶颈提供更准确的指标基础。

---

## 4. 社区热点

### 热点 1：Velox 上游补丁跟踪问题持续活跃
- **Issue**: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **状态**: OPEN
- **评论**: 16
- **👍**: 4
- **链接**: apache/gluten Issue #11585

这是今天讨论最活跃的话题。  
该 Issue 本质上是一个 **Velox 上游未合并补丁的追踪器**，收集来自 Gluten 社区、但尚未进入上游 Velox 的实用 PR。  

**背后的技术诉求：**
- Gluten 对 Velox 的依赖很深，部分关键能力、修复或优化无法及时从上游获得；
- 社区希望降低私有 patch 维护成本，但又不愿频繁 rebase 自维护分支；
- 这说明 Gluten 与 Velox 的协同演进仍存在“上游节奏不完全匹配”的现实问题。

这类 tracker 虽然不是直接功能需求，却是非常明确的路线图信号：  
**未来一段时间，Velox 兼容层与补丁治理仍会是 Gluten 的重要工程投入。**

---

### 热点 2：`collect_list` 正确性问题完成收口
- **Issue**: #8227 `[bug, triage] [VL] Result mismatch in CollectList when 'sort by' clause is involved`
- **状态**: CLOSED
- **评论**: 13
- **链接**: apache/gluten Issue #8227
- **关联 PR**: #9473  
- **链接**: apache/gluten PR #9473

这是今天技术价值最高的 bug 讨论之一。  
问题本质是：优化规则在特定情况下错误移除了排序依赖，导致 `collect_list` 这种顺序敏感聚合函数结果不稳定。  
关闭该问题，表明社区在 **性能优化与 SQL 语义正确性之间，优先保证正确性**，这是分析型引擎成熟度的重要体现。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：运行时 OOM/INVALID_STATE，用户反馈“内存足够但仍报 OOM”
- **Issue**: #11747 `[bug, triage] OOM but memory is enough`
- **状态**: OPEN
- **作者**: @FelixYBW
- **评论**: 2
- **链接**: apache/gluten Issue #11747

**问题概述：**  
报错链路显示为 Velox RuntimeError，发生在 `TableScan` 的 `Operator::getOutput` 阶段，用户描述为“内存看起来足够，但系统仍触发 OOM/INVALID_STATE”。  

**风险判断：**  
这类问题严重性较高，因为它可能不是简单的内存不足，而涉及：
- 内存账户统计不一致；
- 保留内存/峰值内存管理异常；
- 扫描阶段资源释放时机问题；
- Velox 与 Gluten 的内存模型映射偏差。

**是否已有 fix PR：**  
- 当前数据中 **未看到直接关联 fix PR**。

**建议关注：**
- 是否与特定文件格式、split preload、scan 并发度有关；
- 是否受 spill、memory arbitrator、fragment 执行模型影响；
- 是否与最近 metrics 统计修正相关联。

---

### P2：`collect_list` + `sort by` 结果不一致
- **Issue**: #8227
- **状态**: CLOSED
- **链接**: apache/gluten Issue #8227
- **修复 PR**: #9473
- **链接**: apache/gluten PR #9473

**问题类型：** 查询正确性问题。  
**处理状态：** 已关闭，已有修复。  
**影响范围：** 涉及顺序敏感聚合语义，在 BI/报表/ETL 查询中风险较高。  
这是今天最明确的已修复正确性 bug。

---

### P3：测试体系存在“未启用 Gluten 但测试通过”的回归风险
- **PR**: #11799（已关闭）
- **PR**: #11800（进行中）
- **PR**: #11805（进行中）
- **链接**: apache/gluten PR #11799 / #11800 / #11805

虽然这不是线上用户直接报出的 bug，但它属于高风险工程质量隐患：  
如果测试套件没有真正加载 Gluten 插件，就可能掩盖执行计划、回退逻辑、规则匹配等回归。  
从今天一系列 PR 看，维护者已经在集中补洞。

---

## 6. 功能请求与路线图信号

### 1) Velox 上游补丁治理将继续成为路线图重点
- **Issue**: #11585
- **链接**: apache/gluten Issue #11585

这不是传统意义的新功能请求，但它强烈暗示未来版本可能持续吸收：
- Velox 上游未合并的性能补丁；
- SQL 行为修复；
- 执行层兼容增强。

如果该 tracker 持续活跃，意味着下一阶段 Gluten 很可能继续在 **Velox patch 对齐、上游回灌、版本兼容治理** 上投入资源。

---

### 2) `collect_list` 相关测试覆盖面仍在扩展，说明聚合函数兼容性仍是关注点
- **PR**: #11526 `[stale, VELOX] [VL] Add comprehensive collect_list tests for type coverage and fallback`
- **状态**: OPEN
- **链接**: apache/gluten PR #11526

该 PR 提议为 `collect_list` 增加更全面的测试覆盖，包括：
- 多种原始类型；
- fallback 场景；
- 更系统的类型兼容验证。

结合 #8227 已关闭可判断：  
**聚合函数语义兼容性，尤其是顺序敏感函数，是近期被持续关注的领域。**  
这类测试 PR 虽未合入，但很可能被纳入后续版本，因为它与刚修复的真实 bug 高度相关，价值明确。

---

### 3) 性能可观测性增强可能进入下一版本
- **PR**: #11709
- **链接**: apache/gluten PR #11709

该 PR 调整 split 添加阶段的指标汇总方式，虽然是 UI 指标 breaking change，但对性能诊断非常实用。  
若被合并，下一版本用户需要重新理解 Spark UI 中对应耗时指标的口径。

---

## 7. 用户反馈摘要

根据今日 Issues/PR 信息，可以提炼出以下真实用户痛点：

### 1) 用户最在意的仍是“结果正确性”
- **参考**: #8227，#9473  
- **链接**: apache/gluten Issue #8227 / PR #9473

即便是优化规则带来的细微行为变化，只要影响 `collect_list` 这类顺序敏感结果，用户就会快速感知并反馈。  
这表明 Gluten 的使用场景已不只是追求加速，而是进入了 **对 SQL 兼容性和可替代性要求更高** 的阶段。

---

### 2) 运行时内存行为仍有不透明感
- **参考**: #11747  
- **链接**: apache/gluten Issue #11747

“明明还有内存却 OOM” 反映出用户在使用 Velox 后端时，对内存管理与报错语义存在理解和诊断困难。  
这通常意味着：
- 当前错误信息不够直观；
- 指标与真实资源消耗之间存在认知落差；
- 用户需要更好的 observability 与 troubleshooting 文档。

---

### 3) 用户和贡献者希望减少下游 patch 维护负担
- **参考**: #11585  
- **链接**: apache/gluten Issue #11585

Velox 相关 issue 的活跃讨论说明，社区在乎的不仅是单个功能点，更在乎：
- 补丁何时能回到上游；
- 下游分叉是否可持续；
- 特性升级是否会引入过高 rebase 成本。

这是一种非常典型的开源集成项目痛点。

---

## 8. 待处理积压

### 1) `collect_list` 全面测试 PR 处于 stale，建议尽快处理
- **PR**: #11526 `[stale, VELOX] [VL] Add comprehensive collect_list tests for type coverage and fallback`
- **状态**: OPEN / stale
- **创建时间**: 2026-01-30
- **链接**: apache/gluten PR #11526

**为何值得关注：**  
刚刚关闭的 #8227 已证明 `collect_list` 相关语义存在真实风险，因此 #11526 的测试增强并非“可有可无”。  
建议维护者尽快判断：
- 是否可直接合并；
- 是否需要拆分；
- 是否与 #9473 修复后的行为重新对齐。

---

### 2) Velox 上游未合并补丁追踪项需要持续梳理优先级
- **Issue**: #11585
- **状态**: OPEN
- **链接**: apache/gluten Issue #11585

该 issue 评论活跃，但 tracker 类问题容易越积越大。  
建议维护者补充：
- patch 分类；
- 对性能/稳定性/兼容性的影响等级；
- 是否需要在 Gluten 侧临时吸收；
- 对应上游 Velox 状态。

否则容易形成长期技术债。

---

### 3) OOM 问题需尽快补充复现条件和关联修复路径
- **Issue**: #11747
- **状态**: OPEN
- **链接**: apache/gluten Issue #11747

这是当前最值得优先跟进的新稳定性问题。  
建议维护者尽快要求补充：
- 任务规模、文件格式、表 schema；
- Spark/Gluten/Velox 版本；
- off-heap / executor memory / spill 配置；
- 是否特定于 scan preload 或某类 connector。

---

## 附：今日重点链接汇总

- Issue #11585: `[VL] useful Velox PRs not merged into upstream`  
  链接: apache/gluten Issue #11585
- Issue #8227: `[VL] Result mismatch in CollectList when 'sort by' clause is involved`  
  链接: apache/gluten Issue #8227
- Issue #11747: `OOM but memory is enough`  
  链接: apache/gluten Issue #11747
- PR #9473: `fix: Update sort elimination rules for Hash Aggregate`  
  链接: apache/gluten PR #9473
- PR #11799: `Fix PlanStability test suites for Velox backend`  
  链接: apache/gluten PR #11799
- PR #11800: `Replace GlutenTestsCommonTrait with correct Gluten test traits for Spark 4.0/4.1`  
  链接: apache/gluten PR #11800
- PR #11805: `Add golden file comparison for PlanStability test suites`  
  链接: apache/gluten PR #11805
- PR #11709: `Metrics: Include kPreloadSplitPrepareTimeNanos in kDataSourceAddSplitWallNanos`  
  链接: apache/gluten PR #11709
- PR #11526: `Add comprehensive collect_list tests for type coverage and fallback`  
  链接: apache/gluten PR #11526

如果你愿意，我也可以继续把这份日报整理成更适合公众号/邮件订阅格式的 **简版摘要** 或 **管理层视角周报口径**。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时，Apache Arrow 项目整体活跃度**中等偏高**：Issues 更新 19 条、PR 更新 3 条，但**无新版本发布**。  
今日动态以**历史积压问题批量清理**和**Ruby/C++ 小步功能推进**为主，8 个 Issue 被关闭，说明维护者在 backlog 整理上有所动作。  
新增/活跃议题主要集中在 **C++ 构建器性能增强、ORC predicate pushdown、Ruby 文件元数据能力、Apple clang 编译兼容性** 等方向。  
从信号看，当前项目重心更偏向**底层引擎完善、跨平台编译稳定性**和**语言绑定补齐**，而不是大规模对外发布新功能。

---

## 3. 项目进展

### 3.1 已关闭 / 已完成的重要 PR

#### 1) Ruby 读路径基准测试补齐
- **PR**: #49545 `[CLOSED] GH-49544: [Ruby] Add benchmark for readers`
- **链接**: apache/arrow PR #49545
- **对应 Issue**: #49544
- **链接**: apache/arrow Issue #49544

**进展解读：**
- 为 Ruby 增加了 **file reader / streaming reader 的 benchmark**
- 同时为 streaming reader 增加了 **mmap 支持**

**技术意义：**
- 这不是查询语义层面的变更，但对分析型存储引擎非常关键：它增强了 **I/O 路径性能可观测性**，能帮助维护者持续跟踪 Arrow 文件读取性能。
- `mmap` 支持尤其重要，通常会影响大文件顺序读、零拷贝访问和 benchmark 结果稳定性，对于面向 OLAP 的读取场景是正向投入。
- 该 PR 已关闭，对应 issue 也已关闭，表明 Ruby 子模块在**读性能工程化**方面有实质推进。

---

### 3.2 待合并的重要 PR

#### 2) Ruby/GLib 补充 Footer 自定义 metadata 支持
- **PR**: #49577 `[OPEN] [Ruby][GLib] Add support for custom metadata in Footer`
- **状态**: awaiting committer review
- **链接**: apache/arrow PR #49577
- **对应 Issue**: #49576
- **链接**: apache/arrow Issue #49576

**拟引入能力：**
- `garrow_record_batch_file_reader_get_metadata()`
- `garrow_record_batch_file_writer_new_full()`
- `ArrowFormat::FileReader#metadata`
- Writer 接口增加 `metadata`

**技术意义：**
- 这是对 Arrow 文件格式 Footer 元数据能力的语言绑定补齐。
- 对 OLAP/数据平台场景而言，自定义 metadata 常被用于写入：
  - 数据血缘
  - 业务标签
  - 合规标记
  - 导出任务上下文
- 若合并，将提升 Ruby/GLib 在**文件格式语义暴露完整性**上的能力，增强与其他语言实现的一致性。

#### 3) Apple clang 编译兼容性修复
- **PR**: #49570 `[OPEN] [Parquet][C++][CI][Python] Add check targetting Apple clang on deciding whether to use std::bit_width or std::log2p1`
- **状态**: awaiting merge
- **链接**: apache/arrow PR #49570

**进展解读：**
- 目标是修复 Homebrew LLVM / Apple clang 环境下的编译失败问题，涉及 C++/Python 构建链。
- 本质属于 **工具链兼容性与 CI 稳定性修复**。

**技术意义：**
- 这类修复虽然不直接增加查询引擎功能，但会显著影响：
  - PyArrow 本地构建成功率
  - macOS 开发者体验
  - CI 结果可信度
- 对 Arrow 这种多语言、多平台基础设施项目而言，这类 PR 的优先级通常较高，进入下一版本的概率较大。

---

## 4. 社区热点

### 热点 1：C++ StructBuilder 缺少 UnsafeAppend 系列接口
- **Issue**: #45722 `[OPEN] [C++] StructBuilder should have UnsafeAppend methods`
- **评论数**: 15（今日列表中最高）
- **链接**: apache/arrow Issue #45722

**为何是热点：**
- 这是今天最活跃的性能增强议题之一。
- 用户希望 `StructBuilder` 补齐：
  - `UnsafeAppend()`
  - `UnsafeAppendNull()`
  - `UnsafeAppendNulls(int64_t length)`

**背后技术诉求：**
- `UnsafeAppend` 类接口通常面向**高性能批量构建**路径，允许在调用方已保证 capacity/validity 约束时绕过额外检查。
- 对列式引擎来说，Struct 是嵌套类型的基础容器；如果 StructBuilder 无法走高性能 append 路径，复杂 schema 构建时会成为瓶颈。
- 这反映出 Arrow 社区持续在补齐 **nested types builder 的性能一致性**。

---

### 热点 2：ORC predicate pushdown 继续向 Dataset 层推进
- **Issue**: #49361 `[OPEN] [C++][Dataset] Add OrcFileFragment with stripe filtering and predicate pushdown`
- **链接**: apache/arrow Issue #49361

**为何值得关注：**
- 这是今天最明确的查询引擎/存储裁剪能力增强信号。
- 该议题要在 Dataset 层引入类似 `ParquetFileFragment` 的 ORC 文件片段抽象，并把 **ORC stripe 统计信息接入 Arrow expression API**。

**背后技术诉求：**
- 目标是实现扫描时的 **stripe filtering** 与 **predicate pushdown**。
- 对 OLAP 扫描性能意义很大：
  - 减少不必要 stripe 读取
  - 降低 I/O
  - 提升查询延迟表现
- 这说明 Arrow 对 ORC 的支持正在从“可读”继续走向“可优化”。

---

### 热点 3：Ruby Footer custom metadata 从需求到实现快速联动
- **Issue**: #49576
- **PR**: #49577
- **链接**: apache/arrow Issue #49576 / apache/arrow PR #49577

**分析：**
- 同一天需求提出并有 PR 跟进，说明该功能实现难度适中且需求明确。
- 属于**格式能力暴露完善**，不是底层存储格式变更，因此落地节奏通常会比较快。
- 反映出 Ruby 生态虽然整体热度低于 C++/Python，但维护响应速度较好。

---

## 5. Bug 与稳定性

> 今日没有看到大规模运行时崩溃或查询结果错误的高优先级 bug 更新；稳定性主题主要集中在**构建兼容性**与**历史行为一致性**。

### 高优先级

#### 1) Apple clang / Homebrew LLVM 编译失败
- **PR**: #49570
- **链接**: apache/arrow PR #49570
- **影响范围**: C++ / Python 构建链，macOS 开发环境
- **严重程度**: 高

**原因与影响：**
- 编译器能力探测逻辑可能在 Apple clang 场景下误判，导致 `std::bit_width` / `std::log2p1` 选择错误。
- 直接影响开发者构建、CI 通过率和发布前验证。

**是否已有 fix PR：**
- **有**，即 PR #49570，且状态为 `awaiting merge`。

---

### 中优先级

#### 2) M1 + conda + jemalloc=OFF 构建文档缺失
- **Issue**: #31459 `[OPEN] [Doc][C++][Python]Building on M1 with conda and "-DARROW_JEMALLOC=OFF"`
- **链接**: apache/arrow Issue #31459
- **严重程度**: 中

**分析：**
- 更偏文档/开发体验问题，但其背后是 Apple Silicon 开发环境的可重复构建困难。
- 若文档长期不补齐，会反复消耗新贡献者和用户的排障时间。

**fix PR：**
- 暂未看到关联修复 PR。

---

### 中低优先级

#### 3) Python FlightRPC 服务端无法区分“业务性异常”和“非预期异常”
- **Issue**: #31444 `[OPEN] [FlightRPC][Python] Differentiate between intentional and unintentional errors in server RPC handlers`
- **链接**: apache/arrow Issue #31444
- **严重程度**: 中低

**分析：**
- 不直接导致数据错误，但影响服务端可观测性、告警质量和问题排查效率。
- 对生产环境 Flight 服务尤其重要：需要知道哪些异常应透传给客户端，哪些异常应重点记录和监控。

**fix PR：**
- 今日未见 fix PR。

---

### 低优先级 / 行为一致性

#### 4) `match_substring*` 对 NULL 输入的语义可配置
- **Issue**: #31466 `[OPEN] [C++] Option for match_substring* to return false on NULL input`
- **链接**: apache/arrow Issue #31466

**分析：**
- 这更偏 SQL/表达式语义兼容性问题。
- 对接上层分析系统时，NULL 处理策略会直接影响过滤结果和用户预期，因此虽非 crash，但有查询行为层面的重要性。

---

## 6. 功能请求与路线图信号

### 1) ORC predicate pushdown 是最强路线图信号
- **Issue**: #49361
- **链接**: apache/arrow Issue #49361

**判断：高概率进入后续版本**
- 原因：
  - 已明确为 ORC predicate pushdown 子任务
  - 设计上参考 Parquet 已有成熟模式
  - 直接提升 Dataset 层查询裁剪能力
- 这是本日报中对 OLAP 最有价值的功能方向之一。

---

### 2) StructBuilder UnsafeAppend 可能纳入后续版本
- **Issue**: #45722
- **链接**: apache/arrow Issue #45722

**判断：中高概率**
- 原因：
  - 需求清晰、实现边界明确
  - 属于现有 builder API 的能力补齐
  - 已被标注 `good-first-issue`，有利于社区贡献者接手

**潜在价值：**
- 提升嵌套结构构建性能
- 改善高吞吐写入和数组构造场景

---

### 3) Footer custom metadata 支持大概率很快落地
- **Issue**: #49576
- **PR**: #49577
- **链接**: apache/arrow Issue #49576 / apache/arrow PR #49577

**判断：高概率**
- 已有对应实现 PR，且改动集中在 Ruby/GLib 绑定层。
- 若 review 顺利，短期内就可能合入。

---

### 4) “personal data” 字段元数据标记值得持续关注
- **Issue**: #48959 `[OPEN] [Python] A "personal data" boolean in field metadata`
- **链接**: apache/arrow Issue #48959

**判断：中等概率**
- 从治理与合规角度看，这个需求很有现实意义：
  - 标识包含个人数据的字段
  - 支撑跨组织数据流转、审计与合规检查
- 但它更像**元数据约定/生态规范**，而非核心执行引擎功能，因此推进速度可能慢于性能或兼容性修复。

---

### 5) Windows timezone db 环境变量开放给用户
- **Issue**: #20166
- **链接**: apache/arrow Issue #20166

**判断：中低概率**
- 需求合理，但偏平台细节。
- 若没有用户痛点持续放大，优先级可能不高。

---

## 7. 用户反馈摘要

基于今日 Issue 内容，可以提炼出几类真实用户痛点：

### 1) 用户希望 Arrow 的高性能能力在所有嵌套类型上保持一致
- **代表 Issue**: #45722
- **链接**: apache/arrow Issue #45722

**反馈信号：**
- 用户已经在使用 builder API 进行高性能数组构造，且对 `StructBuilder` 的能力缺口有明确感知。
- 说明 Arrow 在性能敏感场景中已被当作“底层构建库”使用，而不仅仅是交换格式。

---

### 2) 用户越来越关注扫描层优化，而不是仅仅“能读能写”
- **代表 Issue**: #49361
- **链接**: apache/arrow Issue #49361

**反馈信号：**
- ORC 支持的关注点正在从格式支持转向 **predicate pushdown / stripe skipping**。
- 这反映了真实分析场景对大数据量扫描性能的需求升级。

---

### 3) 多平台构建体验仍是实际门槛
- **代表 Issue/PR**: #31459, #49570
- **链接**: apache/arrow Issue #31459 / apache/arrow PR #49570

**反馈信号：**
- Apple Silicon、conda、Homebrew LLVM 等环境组合仍容易踩坑。
- 对开发者和集成方来说，“编译成功率”仍是使用体验的重要组成部分。

---

### 4) 用户希望元数据承载更多业务与治理语义
- **代表 Issue**: #48959, #49576
- **链接**: apache/arrow Issue #48959 / apache/arrow Issue #49576

**反馈信号：**
- 不论是“个人数据”标识，还是 Footer 自定义 metadata，用户都在推动 Arrow 不只是表达“数据类型”，还要表达“数据语义”和“治理属性”。

---

## 8. 待处理积压

以下议题虽今日有更新，但明显属于**长期积压**，建议维护者关注：

### 1) C++ NULL 语义兼容：`match_substring*` 在 NULL 输入时返回 false
- **Issue**: #31466
- **创建时间**: 2022-03-28
- **状态**: OPEN, stale-warning
- **链接**: apache/arrow Issue #31466

**为什么值得关注：**
- 这是典型的表达式/过滤语义问题，影响上层系统对 Arrow 计算内核的行为预期。
- 长期未处理会持续造成语言绑定层绕行实现。

---

### 2) Substrait SinkNode 可用性改进
- **Issue**: #31455
- **创建时间**: 2022-03-26
- **状态**: OPEN, stale-warning
- **链接**: apache/arrow Issue #31455

**为什么值得关注：**
- 涉及 Substrait 执行端点设计和流式执行引擎可用性。
- 对未来 Arrow 作为跨系统查询执行/计划承载层的定位有意义。

---

### 3) Python FlightRPC 异常分类能力不足
- **Issue**: #31444
- **创建时间**: 2022-03-24
- **状态**: OPEN, stale-warning
- **链接**: apache/arrow Issue #31444

**为什么值得关注：**
- 生产服务可观测性问题，影响故障诊断与运维体验。
- 属于“看起来小、实际很影响线上体验”的议题。

---

### 4) Windows timezone db path 环境变量支持
- **Issue**: #20166
- **创建时间**: 2022-03-24
- **状态**: OPEN, stale-warning
- **链接**: apache/arrow Issue #20166

**为什么值得关注：**
- 涉及时区库定位和跨平台时间语义稳定性。
- 虽不是热点，但会影响 Windows 用户的可用性。

---

### 5) R 接口层历史增强需求长期悬而未决
- **Issues**: #31453, #31450
- **链接**: apache/arrow Issue #31453 / apache/arrow Issue #31450

**为什么值得关注：**
- R 用户希望更贴近 base R 语义，并获得更直观的 schema introspection 能力。
- 这些需求虽不属于核心执行引擎，但直接影响分析工作流易用性。

---

## 附：今日关闭的积压 Issue 概览

今日关闭的 8 个 Issue 里，绝大多数是 2022 年遗留增强项，被 stale 机制或维护动作清理，包括：
- #30848 PrettyPrintOptions 最大长度选项
- #30844 R condition handling 讨论
- #30852 SIMD 文档改进
- #30827 IPC footer 单次读取优化
- #30842 exec plan 直接支持 nested field refs
- #30829 标量比较测试整理
- #30821 mmap 文件 included_fields 性能差异
- #49544 Ruby readers benchmark

**解读：**
- 这说明项目今日一个重要动作是**清理历史 enhancement backlog**。
- 正面看有助于降低维护噪音；但也意味着某些老需求可能未真正实现就被关闭，建议后续关注是否有替代 issue / PR 承接。

---

## 项目健康度结论

Apache Arrow 今日表现出**稳健但偏维护型**的演进节奏：  
- **正向信号**：积压清理明显、Ruby 子模块推进快速、ORC pushdown 方向清晰、Apple clang 兼容性问题已有修复候选。  
- **风险信号**：若干 2022 年遗留问题仍处于 stale-warning，涉及 NULL 语义、Substrait、FlightRPC、跨平台时区与构建体验，说明部分“用户实际可感知”的边缘痛点处理节奏仍偏慢。  

总体来看，项目健康度为 **良好**：核心基础设施持续迭代，短期重点仍是**性能细节、跨平台稳定性、语言绑定补齐**，中期值得重点跟踪 **ORC predicate pushdown** 是否落地。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*