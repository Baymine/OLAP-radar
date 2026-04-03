# Apache Doris 生态日报 2026-04-03

> Issues: 6 | PRs: 142 | 覆盖项目: 10 个 | 生成时间: 2026-04-03 01:27 UTC

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

# Apache Doris 项目动态日报（2026-04-03）

## 1. 今日速览

过去 24 小时内，Apache Doris 社区保持**高活跃度**：Issues 更新 6 条、PR 更新 142 条，说明研发与维护节奏都很密集。  
从内容看，今日工作重点仍集中在**查询执行稳定性、存储/日志可靠性、外部系统兼容性**以及**面向 4.0/4.1 分支的持续修复与功能演进**。  
虽然**没有新版本发布**，但多条 PR 已进入 reviewed/approved 状态，涉及 spill、executor、load、compaction、认证扩展、连接器与回归测试体系，显示项目正处于**功能扩展与工程收敛并行推进**阶段。  
社区层面，最值得关注的是 **2026 路线图讨论**，明确释放出 Doris 将继续加码 **AI / Hybrid Search、查询性能、存储效率与云原生能力** 的信号。  

---

## 3. 项目进展

> 注：今日没有新 Release，因此重点关注“已合并/关闭的重要 PR”与“处于高成熟度的关键 PR”。

### 3.1 今日已合并/关闭的重要 PR

#### 1) 修复 Stream Load / 单副本写入 close_wait 卡死
- PR: [#58024](https://github.com/apache/doris/pull/58024)  
- 回拣分支: [#62030](https://github.com/apache/doris/pull/62030)
- 状态：已关闭 / 已合入相应分支

**价值：**
该修复针对 `VNodeChannel close_wait hang`，问题出现在 stream load 执行中，当单副本写入场景遇到 slave node 为空、且没有 RPC callback 或 cancel 信号时，`close_wait` 可能进入死锁/永久等待。  
这是典型的**导入链路稳定性问题**，对使用 Stream Load 的生产用户影响较大，尤其是低副本、异常节点、网络抖动等场景。  
该修复已被 branch-4.0 回拣，说明维护者认为其具备较强的线上修复价值。

**影响方向：**
- 导入稳定性提升
- 减少 load 卡住导致的任务堆积
- 对云环境或节点异常场景更友好

---

#### 2) OIDC 认证链路集成完成阶段性收敛
- PR: [#61819](https://github.com/apache/doris/pull/61819)
- 状态：已关闭 / reviewed / approved

**价值：**
该 PR 集成了：
- FE 认证扩展模块
- MySQL 协议层 OIDC 登录桥接
- 角色映射能力

这意味着 Doris 在**企业级认证接入**方面继续完善，特别适合需要统一身份认证、SSO、OIDC 与数据库访问桥接的组织。  
虽然今天没有新版本发布，但这类能力大概率会成为后续版本的重要“平台化能力”卖点。

**影响方向：**
- 企业安全接入增强
- 与现有 IAM / IdP 系统集成更容易
- 有助于 Doris 走向更强的多租户与平台化部署

---

#### 3) 回归测试与外部依赖准备流程继续工程化
- PR: [#61852](https://github.com/apache/doris/pull/61852)
- PR: [#61869](https://github.com/apache/doris/pull/61869)
- 状态：已关闭 / reviewed / approved

**价值：**
- `#61852`：按 Hive 版本限制 bootstrap 数据，减少不必要的数据准备
- `#61869`：新增 external regression 阶段耗时统计

这类改动不直接面向用户功能，但会明显提升：
- CI/回归执行效率
- 外部生态兼容测试的可观测性
- 问题定位速度

对一个外表看似“小改动”的项目，其实反映了 Doris 在**发布工程与测试基础设施成熟度**上的持续进步。

---

### 3.2 今日值得重点跟踪的高价值在审 PR

#### 1) FE EditLog 批量写路径缺失 roll 检查
- PR: [#62060](https://github.com/apache/doris/pull/62060)

该修复指出 `logEdit(short op, List<T> entries)` 在批量写入时会增加 `txId`，但未检查是否达到 `Config.edit_log_roll_num`，可能导致当前 journal DB 持续增长而不滚动。  
这是一个偏**元数据可靠性/可维护性**问题，若长期存在，可能影响：
- FE 元数据日志膨胀
- 恢复成本与维护复杂度
- 批量分区操作等场景的稳定性

**判断：高优先级、偏基础设施关键修复。**

---

#### 2) 防止 split 处理异常导致 BE crash
- PR: [#62044](https://github.com/apache/doris/pull/62044)

该 PR 在 `TimeSharingTaskExecutor` 中对 `split->process()` 周围增加异常捕获，将异常转化为 split failure status，避免 worker 线程退出乃至 BE crash。  
这是今天最值得关注的**稳定性修复候选**之一，因为它直接触及：
- BE 进程健壮性
- 异常传播边界
- 执行器容错

**判断：若问题可复现于生产场景，应优先合入。**

---

#### 3) Spill 内存可回收判断修正
- PR: [#61973](https://github.com/apache/doris/pull/61973)

当 partition 达到最大 repartition 深度后，内存实际上已不可继续 spill/repartition，此时 `revocable_mem_size()` 应返回 0。  
该改动针对执行引擎中 **spill 策略正确性**，有助于避免无效 spill 和错误内存回收判断。

**影响方向：**
- 查询执行稳定性
- 内存管理策略准确性
- 大查询 / 复杂算子在压力下的行为可预测性

---

#### 4) Bucket shuffle exchange 被错误标记为 serial
- PR: [#62054](https://github.com/apache/doris/pull/62054)

修复 pooling mode 下 bucket shuffle / hash exchange 被错误视为 serial operator 的问题。  
这会影响并行执行模型判断，潜在影响：
- 执行并发度
- pipeline 调度效率
- 局部性能退化甚至计划行为异常

**判断：偏性能与执行模型正确性修复。**

---

## 4. 社区热点

### 4.1 2026 路线图讨论最热
- Issue: [#60036 Doris Roadmap 2026](https://github.com/apache/doris/issues/60036)
- 状态：OPEN
- 评论：14
- 👍：16

这是今日最明确的社区热点。路线图关键词包括：
- **AI & Hybrid Search**
- 查询性能优化
- 存储效率提升
- 云与生态能力增强

**背后的技术诉求：**
1. Doris 不再只被期待为传统 MPP OLAP 引擎，而是要承接**向量检索、混合检索、AI 应用数据底座**能力。
2. 用户希望 Doris 在复杂分析、近实时检索、半结构化数据和外部生态联邦上继续增强。
3. 社区正在形成“**分析数据库 + 搜索/向量能力 + 云原生平台能力**”的产品路线。

这与近期 PR 中出现的 OIDC、SPI、binlog meta、外部连接器、compaction 可观测性等方向是相互呼应的。

---

### 4.2 ClusterGuard SPI：开放式治理/策略扩展
- PR: [#62031](https://github.com/apache/doris/pull/62031)

该 PR 引入 `ClusterGuard SPI`，用于将集群级策略控制（节点数限制、时间有效性校验等）从业务逻辑中解耦。  

**技术意义：**
- 为 Doris FE 提供更清晰的扩展点
- 支撑商业版/云版/定制版策略治理
- 体现出项目正在增强**可插拔架构能力**

这是典型的“短期不一定被普通用户感知，但长期对生态与企业化部署影响很大”的改动。

---

### 4.3 Routine Load 支持 Amazon Kinesis
- PR: [#61325](https://github.com/apache/doris/pull/61325)

这是今日最明显的**连接器/数据接入能力扩展**之一。  
它表明 Doris 在实时数据接入层面不再局限于 Kafka，而是向云原生流服务延伸。

**背后的用户诉求：**
- AWS 用户希望直接对接 Kinesis
- 降低 ETL 中转成本
- 强化 Doris 作为实时数仓/实时分析引擎的摄取能力

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：BE 可能返回空 publish success，涉及版本发布时序竞争
- Issue: [#62057](https://github.com/apache/doris/issues/62057)
- 状态：OPEN
- 版本：4.0.4

**问题概述：**
当 `PUBLISH_VERSION` 先于本地 close 完成到达时，BE 可能返回空的 publish success。  
这是一个典型的**并发时序/事务发布一致性**问题，可能影响事务可见性判断、版本推进与提交结果正确性。

**当前状态：**
- 尚未看到明确对应 fix PR
- 建议维护者尽快补充复现条件和影响范围评估

**风险：**
- 导入事务状态异常
- 版本发布结果不一致
- 分布式写入路径正确性受影响

---

### P1：split 处理异常可能触发 BE crash
- PR: [#62044](https://github.com/apache/doris/pull/62044)
- 状态：OPEN，approved/reviewed

**问题概述：**
执行器线程中的异常未被妥善捕获，可能导致 worker thread 终止，进而引发 BE crash。  

**是否已有修复：**
- 有，修复 PR 已提交且成熟度较高

**建议：**
- 尽快合入主干与维护分支
- 增加回归测试覆盖异常 split 场景

---

### P1：EditLog 批量写路径可能导致日志不滚动
- PR: [#62060](https://github.com/apache/doris/pull/62060)
- 状态：OPEN

**问题概述：**
批量写 edit log 时 txId 增长，但未触发 roll 检查，可能造成 journal DB 持续膨胀。  

**风险：**
- FE 元数据日志维护风险
- 恢复/回放成本增加
- 大批量分区/元数据变更场景更容易暴露

**是否已有修复：**
- 有，PR 已提交

---

### P2：SQL Server JDBC Catalog 与 mssql-jdbc 13.x 不兼容，无法列出 dbo schema
- Issue: [#62046](https://github.com/apache/doris/issues/62046)
- 状态：OPEN
- 版本：4.0.3

**问题概述：**
使用 Microsoft JDBC Driver 13.x 创建 SQL Server JDBC Catalog 时，无法列出 `dbo` schema。  

**影响：**
- 外部 Catalog 可用性
- SQL Server 生态兼容性
- 升级 JDBC 驱动后的接入体验

**是否已有 fix PR：**
- 暂未看到直接修复 PR

---

### P2：Broker Load 失败，BE 日志出现 warning
- Issue: [#58926](https://github.com/apache/doris/issues/58926)
- 状态：OPEN
- 版本：3.0.8

**问题概述：**
用户报告 Broker Load 失败，并附带 BE warning 日志。  
从摘要看，可能与 tablet 上报/任务执行链路相关，但当前上下文不足。

**风险：**
- 导入稳定性
- 运维排障复杂度高

**是否已有 fix PR：**
- 暂未发现直接关联修复

---

### P2：shared hash table + broadcast join 时序问题
- PR: [#62056](https://github.com/apache/doris/pull/62056)
- 状态：OPEN

**问题概述：**
task 被唤醒与 terminate/close 的时序交错后，可能出现 hash table 未就绪但已被下游消费，导致类型不匹配报错。  

**性质判断：**
- 查询执行并发正确性问题
- 可能表现为偶发查询失败或执行异常

---

### P3：运行时过滤器与 key range 组合下 IN_LIST 谓词丢失
- PR: [#62027](https://github.com/apache/doris/pull/62027)
- 状态：OPEN

**问题概述：**
在 `MINMAX` 与 `IN` runtime filter 同时作用于同一 key 列、且 `IN` 值较多时，`IN_LIST` 谓词可能被错误擦除。  

**影响：**
- 查询正确性/过滤效果
- 谓词下推行为与性能表现不一致

---

## 6. 功能请求与路线图信号

### 6.1 高概率进入后续版本的能力

#### 1) 外连接重排支持（Nereids / dphyper）
- PR: [#61146](https://github.com/apache/doris/pull/61146)

支持 outer join reorder，说明 Doris 优化器仍在向更强的复杂 SQL 重写能力演进。  
这对多表复杂分析查询非常关键，属于**查询优化器能力升级**的重要信号。

---

#### 2) CBO CTE Inline 多模式策略
- PR: [#60601](https://github.com/apache/doris/pull/60601)

将原先的简单开关扩展为多模式策略，意味着 Doris 在**优化器控制粒度**上进一步细化。  
这通常会进入新版本作为性能调优能力的一部分。

---

#### 3) Compaction 可观测性增强
- PR: [#61696](https://github.com/apache/doris/pull/61696)
- PR: [#61222](https://github.com/apache/doris/pull/61222)

新增：
- `information_schema.be_compaction_tasks`
- HTTP API 查询 compaction 任务
- 手工 full compaction 线程池化

这表明 Doris 正显著增强**存储引擎后台任务透明度与治理能力**，对生产运维价值很高，极可能进入后续版本。

---

#### 4) Row Binlog Meta 模块
- PR: [#62058](https://github.com/apache/doris/pull/62058)

该 PR 为 row type binlog 引入 meta 模块，释放出 Doris 在**CDC / 变更订阅 / 增量同步**方向继续建设的信号。  
若后续配套完善，有望增强 Doris 在数据同步生态中的位置。

---

#### 5) Routine Load 对接 Amazon Kinesis
- PR: [#61325](https://github.com/apache/doris/pull/61325)

这是面向云用户非常明确的需求，若实现成熟，极可能纳入下一个较大版本或特定维护分支。

---

### 6.2 路线图级别信号

#### 1) AI / Hybrid Search 继续加码
- Issue: [#60036](https://github.com/apache/doris/issues/60036)

路线图明确提出基于 2025 年向量检索与索引能力成果，2026 年继续深化 AI 支持。  
这意味着未来 Doris 很可能继续在以下方向增强：
- 向量检索与标量分析融合
- 混合检索
- AI 应用数据底座
- 面向智能查询的索引与执行优化

---

#### 2) SPI 化、认证扩展、策略治理平台化
- PR: [#62031](https://github.com/apache/doris/pull/62031)
- PR: [#61819](https://github.com/apache/doris/pull/61819)

这两项结合看，Doris 正在提升：
- 可插拔架构
- 企业安全治理
- 集群级策略扩展能力

这通常意味着项目正在从“数据库内核”走向“平台级产品底座”。

---

## 7. 用户反馈摘要

结合今日 Issues，可提炼出几个真实用户痛点：

### 7.1 外部系统兼容性仍是高频诉求
- Issue: [#62046](https://github.com/apache/doris/issues/62046)
- Issue: [#58926](https://github.com/apache/doris/issues/58926)

用户在 JDBC Catalog、Broker Load 等场景中遇到的问题，反映 Doris 在“连接外部系统”时仍面临：
- 驱动版本兼容差异
- 日志可读性不足
- 故障定位成本偏高

对企业用户来说，稳定接入异构系统往往比单机 SQL 性能更重要。

---

### 7.2 导入链路和事务/版本时序问题依然敏感
- Issue: [#62057](https://github.com/apache/doris/issues/62057)
- PR: [#58024](https://github.com/apache/doris/pull/58024)

从 publish version 时序竞争，到 VNodeChannel close_wait hang，可以看出用户非常依赖 Doris 的实时/准实时写入能力。  
一旦导入链路在边界条件下出现卡死、返回异常或状态不一致，就会直接影响数据平台 SLA。

---

### 7.3 用户希望 Doris 更适合企业级治理与云环境
- PR: [#62031](https://github.com/apache/doris/pull/62031)
- PR: [#61325](https://github.com/apache/doris/pull/61325)
- PR: [#61819](https://github.com/apache/doris/pull/61819)

从 Kinesis、OIDC、ClusterGuard SPI 等方向看，用户已不满足于“本地 OLAP 引擎”，而是在期待 Doris 成为：
- 云上实时分析平台
- 统一认证接入节点
- 可治理、可扩展的数据基础设施

---

## 8. 待处理积压

以下项目建议维护者关注：

### 8.1 长期开启且价值较高的优化器能力 PR
- PR: [#60601](https://github.com/apache/doris/pull/60601)  
  **Support multi-mode CBO CTE inline strategy**
- PR: [#61146](https://github.com/apache/doris/pull/61146)  
  **support outer join reorder in dphyper**

这两条都属于优化器中高价值能力，若长期停留在 review 阶段，会影响 Doris 在复杂 SQL 优化上的竞争力。

---

### 8.2 Kinesis 接入能力推进值得加速
- PR: [#61325](https://github.com/apache/doris/pull/61325)

作为实时数据接入能力的重要扩展，若迟迟不落地，可能影响 AWS 用户采用 Doris 的积极性。

---

### 8.3 旧 Issue/PR 被 stale 自动关闭，可能掩盖真实需求
- Issue: [#56229](https://github.com/apache/doris/issues/56229)
- Issue: [#56355](https://github.com/apache/doris/issues/56355)
- PR: [#56249](https://github.com/apache/doris/pull/56249)
- PR: [#56400](https://github.com/apache/doris/pull/56400)
- PR: [#56409](https://github.com/apache/doris/pull/56409)

今天有多条历史问题因 stale 关闭。  
虽然这有助于控制 issue/PR 积压，但也可能带来两个风险：
1. 某些问题并非已解决，而是“缺少跟进”
2. 中文用户提交的问题更容易因沟通不足而沉没

建议对以下类别设置二次筛查：
- SQL 正确性问题
- 导入链路问题
- UDF / 插件生态兼容问题

---

## 总结

今天的 Apache Doris 呈现出明显的“双线推进”特征：  
一方面，项目在**执行器健壮性、导入稳定性、元数据日志、spill/compaction 可观测性**上持续补强内核稳定性；另一方面，也在**OIDC、SPI、Kinesis、AI/Hybrid Search 路线图**上释放出更强的平台化与生态化信号。  

从健康度看，**PR 活跃度很高、修复与功能并进、维护分支回拣及时**，整体项目状态积极；但与此同时，涉及 **BE crash、publish version 时序、外部兼容性** 的问题仍值得保持高优先级关注。  

如果你愿意，我还可以继续把这份日报整理成更适合团队内部同步的 **“高管版一页摘要”** 或 **“研发跟进清单版”**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告
**日期：2026-04-03**

---

## 1. 生态全景

过去 24 小时的社区动态显示，OLAP 与分析型存储引擎开源生态整体仍处于**高强度演进期**：一方面，各项目持续推进查询性能、SQL 兼容性、流式/CDC、对象存储与湖仓连接能力；另一方面，**正确性、稳定性、CI/测试基础设施、跨生态兼容性**成为共同主线。  
从项目分布看，**ClickHouse、Doris、StarRocks、DuckDB**在内核迭代上最活跃，**Iceberg、Delta Lake、Arrow**则更偏向格式、连接层与多引擎生态扩展。  
值得注意的是，越来越多项目不再只卷单点查询性能，而是在朝着“**分析引擎 + 湖仓/流式接入 + 企业治理 + AI/向量/检索能力**”的复合平台方向演进。  
整体上，生态进入了一个典型的“双轨阶段”：**功能扩张仍在继续，但质量收敛和工程成熟度治理的重要性明显上升**。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | 今日 Release | 健康度评估 | 简要判断 |
|---|---:|---:|---|---|---|
| **ClickHouse** | 54 | 320 | 无 | 高活跃，复杂度上升 | 功能扩展极快，但正确性/CI/湖仓兼容压力大 |
| **Apache Doris** | 6 | 142 | 无 | 积极且均衡 | 稳定性修复、平台化能力和生态扩展并进 |
| **StarRocks** | 9 | 115 | 无 | 良好偏强 | 版本分支收敛明显，Lake/外表/优化器边界持续修补 |
| **DuckDB** | 17 | 56 | 无 | 良好 | 响应快，嵌入式/多语言/复杂 SQL 场景正在经受更强验证 |
| **Velox** | 6 | 50 | 无 | 中上 | 处于工程治理期，CI、兼容性与 GPU 路线并行推进 |
| **Apache Iceberg** | 6 | 39 | 无 | 良好但评审偏慢 | 活跃度高，REST/Flink/Spark/Connect 扩展明显，PR 积压较多 |
| **Delta Lake** | 2 | 32 | 无 | 较好 | Kernel、CDC、DSv2、UniForm 主线清晰，但 stacked PR 压力大 |
| **Apache Arrow** | 33 | 20 | 无 | 良好 | Python/R/Packaging 修复密集，连接层与 Parquet 正确性持续推进 |
| **Apache Gluten** | 11 | 21 | 无 | 良好 | Spark 4.x、Velox 后端、CI 稳定性持续增强 |
| **Databend** | 5 | 14 | 无 | 良好 | Join、Flashback、一致性与存储估算是核心焦点 |

### 活跃度分层
- **第一梯队：超高活跃**
  - ClickHouse、Apache Doris、StarRocks
- **第二梯队：高活跃**
  - DuckDB、Velox、Iceberg、Delta Lake
- **第三梯队：中高活跃**
  - Arrow、Gluten、Databend

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势
与同类 OLAP 引擎相比，Apache Doris 当前展现出较均衡的产品与社区特征：

- **内核与平台能力并进**  
  今日动态同时覆盖执行器稳定性、spill、compaction、EditLog、导入链路，也覆盖 OIDC、SPI、Kinesis、AI/Hybrid Search 路线图，说明 Doris 不只是修 bug，而是在持续向**平台型分析数据库**演进。

- **工程成熟度较强**  
  Doris 今日 PR 活跃度高达 **142**，且维护分支回拣及时。相较一些只在主干推进新功能的项目，Doris 在**维护分支治理、回归测试工程化、生产问题收敛**方面更显稳健。

- **企业化与云化信号更明确**  
  OIDC、ClusterGuard SPI、Amazon Kinesis、compaction 可观测性等，说明 Doris 正持续补齐企业部署、云原生接入和治理能力，这一点比偏单机/嵌入式的 DuckDB、偏执行框架的 Velox 更完整。

### 3.2 与主要同类项目的技术路线差异

- **vs ClickHouse**  
  ClickHouse 社区规模更大、特性推进更快，尤其在索引、缓存、文本检索、标准 SQL 语法上更激进；但 Doris 在**企业治理、认证、平台化、多租户接入**上的信号更集中，路线更偏“平台数仓”。

- **vs StarRocks**  
  两者都在实时 OLAP、湖仓连接、CBO/执行优化上竞争。StarRocks 今日更偏向 **4.1 稳定性收敛、Lake replication、外部元数据兼容**；Doris 则更突出 **认证扩展、SPI 化、接入扩展和 AI/Hybrid Search 路线**。

- **vs DuckDB**  
  DuckDB 强项在嵌入式、单机分析、多语言集成与开发者体验；Doris 强项在**分布式、实时导入、平台级部署、企业生产治理**。两者不是完全正面竞争，更多是工作负载与部署模型不同。

- **vs Databend**  
  Databend 仍在加速补强 Join、Flashback、一致性和文件兼容能力；Doris 的社区成熟度、平台化功能密度和维护分支治理整体更成熟。

### 3.3 社区规模对比
按今日活动量看：
- Doris PR 活跃度 **142**，明显高于 StarRocks（115）、DuckDB（56）、Databend（14）
- 但低于 ClickHouse（320）这一超大社区项目
- 在国产/云原生实时 OLAP 阵营中，Doris 仍处于**头部活跃项目**位置

**结论**：Doris 当前处于“**头部 OLAP 引擎 + 平台化增强期**”的关键阶段，在生态中兼具活跃度、工程成熟度和企业化路线清晰度。

---

## 4. 共同关注的技术方向

以下是多个项目同时涌现的共性需求与方向：

| 技术方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| **查询正确性 / 静默错误治理** | ClickHouse、DuckDB、Databend、Velox、StarRocks、Doris | 错误结果、优化器边界、时序竞争、NaN row count、session context 不一致、Spark 语义不一致 |
| **执行器稳定性 / 崩溃修复** | Doris、ClickHouse、DuckDB、Databend、Velox | split 异常导致 crash、pipeline stuck、竞态 segfault、join panic、spill/序列化异常 |
| **Join 路径优化** | Doris、StarRocks、Databend、Gluten、ClickHouse | build side 选择、outer join reorder、partitioned/skew join、broadcast/join 时序问题 |
| **流式 / CDC / 增量同步** | Doris、Iceberg、Delta Lake、ClickHouse | Row binlog meta、Kafka Connect upsert/delete、CDC streaming、publish version/事务时序 |
| **湖仓 / 外部 Catalog / 连接器兼容** | Doris、StarRocks、ClickHouse、Iceberg、Delta、Arrow | JDBC Catalog、Iceberg/HMS、DeltaLake/Parquet/S3、REST Catalog、ODBC/Flight SQL |
| **企业认证 / 治理 / 安全** | Doris、StarRocks、Arrow、Gluten | OIDC、SPI、FIPS、凭据脱敏、CI/权限治理 |
| **CI / 测试基础设施成熟化** | Doris、ClickHouse、Velox、Arrow、Gluten、DuckDB | external regression 计时、flaky retry、fuzz harness、打包修复、依赖缓存 |
| **SQL 兼容性增强** | ClickHouse、DuckDB、Gluten、Arrow、Iceberg | 标准 INTERVAL / OVERLAY、DML in CTE、事务隔离语法、Spark Procedure/DDLv2 兼容 |
| **云对象存储与流服务接入** | Doris、StarRocks、DuckDB、Arrow | Kinesis、S3、HTTPFS、AWS SDK、对象存储 shutdown/deletion 处理 |
| **AI / 文本 / 向量 / 张量能力** | Doris、ClickHouse、Arrow | AI & Hybrid Search、text index phrase search、FixedShapeTensor/多维数组 |

### 关键判断
当前行业的共同重点，已经不是“有没有 OLAP 引擎”，而是：
1. **结果是否可信**
2. **系统是否足够稳**
3. **能否接入更多外部系统**
4. **是否适应云、CDC、AI、混合检索的新负载**

---

## 5. 差异化定位分析

### 5.1 存储格式与数据模型定位

| 项目 | 核心定位 | 存储/格式特点 |
|---|---|---|
| **Apache Doris** | 一体化实时 OLAP / 数仓引擎 | 自有存储引擎，强化导入、compaction、binlog、可观测性 |
| **ClickHouse** | 高性能列存分析数据库 | MergeTree 体系强，索引/Projection/文本检索能力突出 |
| **StarRocks** | 云原生/实时 OLAP + 湖仓联邦 | 内表 + Lake/外表并重，围绕 Iceberg/HMS/对象存储持续增强 |
| **DuckDB** | 嵌入式分析数据库 | 本地文件/内存分析强，多语言嵌入式体验突出 |
| **Databend** | 云原生分析数据库 | 更偏对象存储/云环境，逐步补齐复杂查询与元数据一致性 |
| **Iceberg** | 开放表格式 | 强调 table format / catalog / snapshot / multi-engine 语义 |
| **Delta Lake** | 表格式 + 事务日志 | 强调事务、CDF、UniForm、Spark/Kernel 路线 |
| **Arrow** | 列式内存格式与数据交换层 | 不是数据库，核心价值在跨语言、跨引擎数据表示与传输 |
| **Velox** | 执行引擎基础设施 | 不是完整数据库，更像可嵌入执行层 |
| **Gluten** | Spark 原生执行加速层 | 借助 Velox/ClickHouse backend 提升 Spark 执行性能 |

### 5.2 查询引擎设计差异
- **Doris / StarRocks / ClickHouse**：完整分布式 OLAP 引擎，覆盖存储、优化器、执行、导入、后台任务
- **DuckDB**：单机嵌入式分析，面向本地数据科学和应用嵌入
- **Velox / Gluten**：更偏执行层和加速层，不直接提供完整数据库体验
- **Iceberg / Delta / Arrow**：更偏格式、连接层、协议层，不以单体查询引擎为核心

### 5.3 目标负载类型差异
- **实时数仓 / 低延迟分析**：Doris、StarRocks、ClickHouse
- **开发分析 / 本地 OLAP / 嵌入式**：DuckDB
- **湖仓存储与多引擎共享表**：Iceberg、Delta Lake
- **跨引擎执行与加速**：Velox、Gluten
- **数据交换 / 客户端协议 / 列式互操作**：Arrow
- **云原生新兴分析数据库**：Databend

### 5.4 SQL 兼容性差异
- **ClickHouse**：近期明显加强标准 SQL / PostgreSQL 风格兼容
- **DuckDB**：对 PostgreSQL 风格 SQL、DML RETURNING、CTE、事务语法持续补齐
- **Doris / StarRocks**：更偏面向 OLAP 和 MySQL 生态兼容，同时补强优化器与外部系统接入
- **Iceberg / Delta**：SQL 能力更多受上层 Spark/Flink/引擎集成影响
- **Velox / Arrow**：本身不是 SQL 产品主体，兼容性体现在上层生态接入

---

## 6. 社区热度与成熟度

### 6.1 活跃度与阶段判断

#### A. 快速迭代阶段
- **ClickHouse**
- **DuckDB**
- **Delta Lake**
- **Velox**
- **Databend**

特点：
- 新功能多
- 回归和边界 bug 也多
- CI/fuzz/正确性问题暴露频繁
- 适合关注创新能力，但要谨慎评估生产稳定性边界

#### B. 功能扩展与质量收敛并行阶段
- **Apache Doris**
- **StarRocks**
- **Apache Iceberg**
- **Apache Gluten**

特点：
- 既有新能力推进，也有大量稳定性补丁
- 维护分支、backport、工程化测试更明显
- 更适合企业生产评估

#### C. 质量巩固与生态基础设施阶段
- **Apache Arrow**

特点：
- 核心创新节奏相对平稳
- 更多是语言绑定、打包、Parquet/ODBC/兼容性治理
- 属于生态底座型项目，成熟度高但外围兼容问题持续存在

### 6.2 成熟度判断
- **成熟头部 OLAP 引擎**：Doris、ClickHouse、StarRocks
- **成熟格式/生态底座**：Iceberg、Delta Lake、Arrow
- **高速成长型分析引擎**：DuckDB、Databend
- **引擎内核/加速基础设施**：Velox、Gluten

---

## 7. 值得关注的趋势信号

### 7.1 “性能竞争”转向“正确性 + 可治理 + 生态接入”
多个项目今天最敏感的问题都不是纯性能，而是：
- 静默错误
- 事务/时序一致性
- schema / metadata 兼容
- CI 和回归基础设施

**对架构师的意义**：选型时不能只看 benchmark，要优先看**错误结果风险、运维可观测性、升级/回滚机制**。

### 7.2 湖仓与 OLAP 的边界继续消失
StarRocks、ClickHouse、Doris、Iceberg、Delta 都在强化：
- Iceberg / Delta / Hive / S3 / REST Catalog 接入
- CDC / 流式写入 / time travel / metadata 一致性
- 外部 catalog / connector / unified API

**对数据工程师的意义**：未来主流系统不再是“仓库”和“湖”二选一，而是要求**统一元数据、统一接入、统一治理**。

### 7.3 企业化能力正在变成核心竞争项
今日明显可见：
- Doris 的 OIDC / SPI
- StarRocks 的 FIPS 与凭据脱敏
- Arrow / Gluten / Velox 的 CI 权限、签名、基础设施治理

**判断**：企业级认证、合规、安全审计、可插拔治理，正在从“附加项”变成主流特性。

### 7.4 流式、CDC、增量处理持续升温
- Delta Kernel CDC
- Iceberg Kafka Connect upsert/delete
- Doris row binlog meta / publish version
- 各类导入链路、流服务接入修复

**参考价值**：对实时数仓和数据同步架构而言，未来系统选择重点要看：
1. 增量语义是否清晰  
2. checkpoint / 恢复是否可靠  
3. delete / upsert / time travel 是否一致

### 7.5 AI / 文本 / 向量数据能力开始进入主流分析生态
- Doris 路线图明确提出 AI & Hybrid Search
- ClickHouse 继续推进 text index / lookup index
- Arrow 持续出现 tensor / 多维数组诉求

**判断**：分析型数据库正逐渐承接“**结构化分析 + 检索 + 向量/张量数据**”的融合负载。

### 7.6 执行器与优化器正在迈向更动态、更运行时感知
- Doris spill / bucket shuffle / split 异常修复
- Gluten runtime stats 选 build side
- Databend skew join / partitioned hash join
- StarRocks histogram NaN 与 CBO 修补
- DuckDB 聚合下推、宏展开控制

**结论**：下一阶段竞争点之一是**运行时自适应能力**，而不仅仅是静态优化器规则数量。

---

# 总体结论

从 2026-04-03 的横向动态看，OLAP/分析型存储引擎生态的主线已经非常清晰：  
**头部项目继续扩张边界，但真正的竞争焦点正在从“谁更快”转向“谁更稳、谁更容易接入、谁更适合企业生产和云环境”。**

对技术决策者而言：
- 若关注**分布式实时 OLAP 平台能力**：重点看 **Doris / StarRocks / ClickHouse**
- 若关注**嵌入式分析与开发者体验**：重点看 **DuckDB**
- 若关注**湖仓格式与多引擎互操作**：重点看 **Iceberg / Delta Lake / Arrow**
- 若关注**执行层能力与 Spark 加速**：重点看 **Velox / Gluten**
- 若关注**云原生新兴引擎潜力**：重点看 **Databend**

其中，**Apache Doris 当前在生态中的位置是：活跃度高、平台化信号强、企业化路径清晰、工程成熟度较均衡的头部 OLAP 项目**。它与 ClickHouse、StarRocks 一起，构成当前最值得持续跟踪的开源分析数据库第一梯队。

如果你愿意，我可以继续把这份横向报告再整理成：
1. **管理层一页版摘要**
2. **项目选型对比矩阵**
3. **Doris vs ClickHouse vs StarRocks 深度对照版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-04-03）

## 1. 今日速览

过去 24 小时 ClickHouse 保持**高强度活跃**：Issues 更新 54 条、PR 更新 320 条，说明项目在核心功能迭代、回归修复和 CI 稳定性治理上都很繁忙。  
从内容分布看，今日讨论重点集中在三类问题：**查询正确性/分析器回归**、**MergeTree/湖仓连接器稳定性**、以及**SQL 兼容性与新索引能力**。  
PR 侧虽然没有新版本发布，但可见多个中大型特性仍在推进，包括 **MergeTree LOOKUP INDEX**、**Arrow Flight SQL**、**部分聚合缓存**、**文本索引短语检索** 等，体现出项目仍处于较强的功能扩展期。  
同时，CI crash、fuzz/sanitizer、执行管线死锁与错误结果类问题持续暴露，显示项目规模扩张下，**稳定性治理仍是当前主线之一**。  

---

## 3. 项目进展

> 注：今日无新 Release。以下聚焦“已关闭/推进明显”的重要 PR 与相关工程进展。

### 3.1 已关闭/完成的重要 PR

- **升级 distroless 基础镜像到 Debian 13**  
  PR: #101678  
  链接: ClickHouse/ClickHouse PR #101678  
  进展解读：将 server/keeper 的 distroless 基础镜像从 Debian 12 升至 Debian 13，带来 **glibc 2.41** 和 **OpenSSL 3.5.5**，摘要明确指出可达 CVE 从 14 降到 0。  
  价值：这是典型的**供应链安全与运行时基线升级**，对自托管和云环境都重要，短期不直接影响 SQL 功能，但显著提升交付安全性。

- **26.3 自动回移链路推进：tokenizer 更名 backport**  
  PR: #101651（已关闭，cherry-pick 步骤）  
  PR: #101682（开放中，自动 backport 最终步骤）  
  链接: ClickHouse/ClickHouse PR #101651 / ClickHouse/ClickHouse PR #101682  
  进展解读：`unicodeWord tokenizer` 更名为 `asciiCJK` 的变更正在进入 26.3 分支。  
  价值：说明团队正在持续做**稳定分支维护与命名规范化**，也释放出 26.3 后续小版本仍在活跃整理中的信号。

### 3.2 今日推进明显、值得关注的开放 PR

- **MergeTree 新增 LOOKUP INDEX 支持**  
  PR: #101401  
  链接: ClickHouse/ClickHouse PR #101401  
  进展解读：为 MergeTree 引入表级 `LOOKUP INDEX`，并把 `Set`/`Join` 表能力索引化。它不是传统 data-skipping index，而是**可复用的内存查找结构**，适合重复 key-value 风格查询。  
  影响判断：如果落地，将是 MergeTree 在“低延迟点查/维表式查询”方向的重要补强。

- **修复 MergeTree 上 ALIAS 列影响懒读取与 Top-K 优化**  
  PR: #96487  
  链接: ClickHouse/ClickHouse PR #96487  
  进展解读：修复 `ORDER BY ... LIMIT` 场景下，选择 `ALIAS` 列时丢失 lazy read / top-K 优化的问题。  
  影响判断：这是一个很实用的查询优化修复，直接面向用户可见性能收益。

- **实验性文本索引：短语搜索支持**  
  PR: #101677  
  链接: ClickHouse/ClickHouse PR #101677  
  进展解读：在实验性 text index 中增加 phrase search。  
  影响判断：表明 ClickHouse 在日志/可观测性检索场景继续增强，尤其适合半结构化文本检索。

- **部分聚合缓存（PartialAggregateCache）**  
  PR: #93757  
  链接: ClickHouse/ClickHouse PR #93757  
  进展解读：为 MergeTree `GROUP BY` 增加**按 part 的中间聚合状态缓存**，通过 `use_partial_aggregate_cache` 控制。  
  影响判断：这是典型的分析型引擎性能特性，若命中率可观，会对重复报表/固定维度分析有明显收益。

- **Arrow Flight SQL 支持**  
  PR: #91170  
  链接: ClickHouse/ClickHouse PR #91170  
  进展解读：长期特性 PR 持续更新。  
  影响判断：这是生态连接层的重要能力，能明显增强 ClickHouse 与 BI/数据应用的互联性。

- **SQL 标准 INTERVAL 复合字面量支持**  
  PR: #100453  
  链接: ClickHouse/ClickHouse PR #100453  
  进展解读：支持 `INTERVAL 'string' KIND TO KIND` 标准语法。  
  影响判断：属于 **SQL 兼容性增强**，有利于迁移 PostgreSQL/Oracle/标准 SQL 工作负载。

- **支持 SQL 标准 `OVERLAY(... PLACING ... FROM ... FOR ...)` 语法**  
  PR: #101681  
  链接: ClickHouse/ClickHouse PR #101681  
  进展解读：为已有 `overlay` 函数增加 parser 级标准语法糖。  
  影响判断：继续强化 SQL 方言兼容，对跨引擎迁移友好。

- **CI 测试选择与进程清理修复**  
  PR: #101553 / #101636 / #98340 / #101680  
  链接: ClickHouse/ClickHouse PR #101553 / #101636 / #98340 / #101680  
  进展解读：  
  - 修复覆盖率测试选择依赖 `gh pr diff` 认证失败导致“空 diff”问题；  
  - 修复 `clickhouse-test`/`fast_test.py` 异常退出后遗留 `.sh` 测试进程；  
  - 修复 `ResizeProcessor` 导致的 “Pipeline stuck” 逻辑错误；  
  - 为 object storage blob 删除等待增加超时，防止关停死锁。  
  影响判断：今天的 CI/稳定性治理力度很大，说明维护者在补基础工程债。

---

## 4. 社区热点

### 4.1 CI crash：Compact part 双重释放
- Issue: #99799  
- 链接: ClickHouse/ClickHouse Issue #99799  
- 热度：22 评论  
- 摘要：`MergeTreeDataPartCompact` 在 `multi_index` 相关路径发生 double deletion，属于典型 CI crash。  
- 技术分析：这类问题通常指向**对象生命周期管理、共享所有权或索引/part 交互路径**中的资源释放错误。因为发生在 MergeTree part 层，虽然是 CI 报告，但其风险不宜低估。

### 4.2 系统时间回拨后的内存泄漏
- Issue: #93095  
- 链接: ClickHouse/ClickHouse Issue #93095  
- 热度：11 评论  
- 摘要：系统时间向后调整后，持续写入导致内存增长且不释放，重启后恢复。  
- 技术诉求：这反映用户对 ClickHouse 在**非理想生产环境条件**下鲁棒性的期待，尤其是时钟漂移、NTP 校时、虚拟化环境中的时间变化。

### 4.3 ReplicatedMergeTree：DELETE 后重插入被去重吞掉
- Issue: #101337（已关闭）  
- 链接: ClickHouse/ClickHouse Issue #101337  
- 热度：10 评论  
- 摘要：`ALTER TABLE ... DELETE WHERE ...` 后再次插入相同数据，被 block deduplication 静默丢弃。  
- 技术分析：这是**数据正确性**层面的高敏感问题。即使已关闭，也说明复制表去重元数据与删除语义的边界仍是用户高度关注区域。

### 4.4 Projection Index 支持 ARRAY JOIN
- Issue: #98953  
- 链接: ClickHouse/ClickHouse Issue #98953  
- 热度：8 评论  
- 摘要：用户希望在 projection/index 能力中支持 `ARRAY JOIN`，尤其面向 observability 模式下 Map/labels 展开检索。  
- 技术诉求：说明日志、标签、半结构化 schema 正推动 ClickHouse 索引能力从标量列向**数组/映射展开场景**延展。

### 4.5 单查询重复解压缩
- Issue: #99236（已关闭）  
- 链接: ClickHouse/ClickHouse Issue #99236  
- 热度：5 评论  
- 摘要：同一查询中压缩数据被重复解压，造成明显额外开销。  
- 技术分析：该问题虽已关闭，但凸显社区对**CPU 效率、列读取复用、解码缓存**的持续关注。

### 4.6 URL Engine / URL table function 扩展 schema
- Issue: #59617  
- 链接: ClickHouse/ClickHouse Issue #59617  
- 热度：4 评论  
- 摘要：希望 URL 表函数支持 `file://`、`s3://` 等 schema 及相对路径。  
- 技术诉求：这是明显的**易用性与统一连接器接口**需求，尤其适合 `clickhouse-local` 和数据导入场景。

---

## 5. Bug 与稳定性

> 按严重程度排序，并标注是否看到明显 fix 信号。

### P0 / 数据正确性风险

1. **DELETE + re-INSERT 后数据被复制去重机制静默丢弃**  
   Issue: #101337（已关闭）  
   链接: ClickHouse/ClickHouse Issue #101337  
   风险：高，直接涉及数据丢失感知。  
   状态：已关闭，但摘要未展示 fix PR 编号，建议继续追踪关联提交。

2. **相关子查询 `EXISTS` 在同表相关引用下静默返回错误结果**  
   Issue: #99310  
   链接: ClickHouse/ClickHouse Issue #99310  
   风险：高，属于 SQL 语义错误且“静默错误”比报错更危险。  
   Fix 信号：暂未在所给 PR 列表中看到直接修复。

3. **Azure DeltaLake time travel 设置被静默忽略，返回错误数据**  
   Issue: #100502  
   链接: ClickHouse/ClickHouse Issue #100502  
   风险：高，湖仓读取返回“看似正常但版本错误”的结果。  
   Fix 信号：未见直接 fix PR。

4. **`schema_inference_mode=union` 下从 tar/s3 读异构 parquet 时列值被静默丢成 null**  
   Issue: #101544  
   链接: ClickHouse/ClickHouse Issue #101544  
   风险：高，属于 26.3 regression，且是静默错误。  
   Fix 信号：未见直接 fix PR。

5. **`arrayJoin` 在特定设置组合下结果错误**  
   Issue: #101608  
   链接: ClickHouse/ClickHouse Issue #101608  
   风险：高，属于结果错误，且说明“自 v25.12 起存在”。  
   Fix 信号：未见直接 fix PR。

### P1 / 崩溃与执行器稳定性

6. **ANY LEFT JOIN + ARRAY JOIN 触发 `PARAMETER_OUT_OF_BOUND` 崩溃**  
   Issue: #101229  
   链接: ClickHouse/ClickHouse Issue #101229  
   风险：高，JOIN 与 ARRAY JOIN 组合是常见分析 SQL 模式。  
   Fix 信号：未见直接 fix PR。

7. **`getSubcolumnData` 动态分支覆盖结果，导致错误结果甚至 crash**  
   Issue: #101271  
   链接: ClickHouse/ClickHouse Issue #101271  
   风险：高，且 issue 指向已合并历史 PR 的遗留问题。  
   Fix 信号：未见直接 fix PR。

8. **CI crash：`MergeTreeDataPartCompact` 双重释放**  
   Issue: #99799  
   链接: ClickHouse/ClickHouse Issue #99799  
   风险：中高，当前主要在 CI 暴露，但潜在影响底层 part 生命周期。  
   Fix 信号：未见明确修复 PR。

9. **Shutdown deadlock 风险：等待 blob 删除无超时**  
   PR: #101680  
   链接: ClickHouse/ClickHouse PR #101680  
   风险：中高。  
   状态：已有修复 PR，属于积极信号。

10. **执行管线 `ResizeProcessor` “Pipeline stuck”**  
    PR: #98340  
    链接: ClickHouse/ClickHouse PR #98340  
    风险：中高。  
    状态：已有修复 PR，说明执行框架稳定性正在被重点修补。

### P2 / 回归、解析与类型处理问题

11. **新 analyzer 常量折叠后仍读取无关列，聚合退化为 5 倍变慢**  
    Issue: #101659（已关闭）  
    链接: ClickHouse/ClickHouse Issue #101659  
    风险：中，偏性能正确性。  
    状态：已关闭，推测已有修正。

12. **`sign()` 包裹含 Nullable 的窗口表达式在 26.2 返回全 0**  
    Issue: #100782（已关闭）  
    链接: ClickHouse/ClickHouse Issue #100782  
    风险：中，明显回归。  
    状态：已关闭。

13. **`date_time_overflow_behavior='throw'` 对 Int/UInt/Float -> DateTime64/Time64 转换被忽略**  
    Issue: #100471  
    链接: ClickHouse/ClickHouse Issue #100471  
    风险：中，影响类型语义一致性。  
    Fix 信号：未见。

14. **CSV 中 DateTime64 解析越界吞掉后续 Bool 字段**  
    Issue: #101487  
    链接: ClickHouse/ClickHouse Issue #101487  
    风险：中，影响高吞吐 CSV 导入正确性。  
    Fix 信号：未见。

15. **`PARSING_EXCEPTION` 测试 hint `'error'` 被错误拒绝**  
    Issue: #101664  
    链接: ClickHouse/ClickHouse Issue #101664  
    风险：中低，偏测试框架语义问题。  
    Fix 信号：未见。

16. **Date32 在 `INSERT VALUES(NULL)` 与 `INSERT SELECT NULL` 下 coercion 不一致**  
    Issue: #88312  
    链接: ClickHouse/ClickHouse Issue #88312  
    风险：中低，但影响用户对类型系统一致性的信任。  

### P3 / CI 与 fuzz

17. **Flaky: `test_overcommit_tracker`**  
    Issue: #101318（已关闭）  
    链接: ClickHouse/ClickHouse Issue #101318

18. **Fuzz: bad cast / unexpected return type / msan use-of-uninitialized-value**  
    Issues: #101648 / #101306（已关闭） / #101613（已关闭）  
    链接: ClickHouse/ClickHouse Issue #101648 / #101306 / #101613  
    解读：自动化质量网络持续在发现边界行为，但好消息是关闭速度较快。

---

## 6. 功能请求与路线图信号

### 高价值需求

- **Projection Index 支持 `ARRAY JOIN`**  
  Issue: #98953  
  链接: ClickHouse/ClickHouse Issue #98953  
  信号：对 observability / labels 查询非常关键。若 ClickHouse 继续强化 text index、Map/Dynamic、lookup index，这类需求进入路线图的概率较高。

- **优化器跳过无用 JOIN**  
  Issue: #101451  
  链接: ClickHouse/ClickHouse Issue #101451  
  信号：直接回应 BI 工具生成“笨 SQL”的现实。结合当前 analyzer 与列裁剪/位置裁剪相关 PR，可视为较自然的下一步优化方向。

- **URL engine/table function 支持更多 schema 与相对路径**  
  Issue: #59617  
  链接: ClickHouse/ClickHouse Issue #59617  
  信号：这是低门槛高收益的易用性改进，适合纳入近期版本。

- **默认表达式中支持 `*` 与列匹配器**  
  Issue: #92266  
  链接: ClickHouse/ClickHouse Issue #92266  
  信号：面向 schema 演化和自动 JSON 化/别名列场景，较贴近 ClickHouse 的宽表、日志表使用模式。

- **索引命名一致性：indices vs indexes**  
  Issue: #37288  
  链接: ClickHouse/ClickHouse Issue #37288  
  信号：优先级不高，但体现社区开始关注接口与命名长期一致性。

### 从 PR 看出的中期路线

- **查询性能与缓存**：#93757、#99581、#96487、#100586  
  链接: ClickHouse/ClickHouse PR #93757 / #99581 / #96487 / #100586  
  判断：围绕 `GROUP BY`、列裁剪、Top-K、分片聚合的优化仍是核心主线。

- **SQL 兼容性增强**：#100453、#101681  
  链接: ClickHouse/ClickHouse PR #100453 / #101681  
  判断：兼容标准 SQL / PostgreSQL 风格语法的趋势明显，利好迁移场景。

- **生态接入与检索能力**：#91170、#101677、#101401  
  链接: ClickHouse/ClickHouse PR #91170 / #101677 / #101401  
  判断：Arrow Flight SQL、文本检索、LOOKUP INDEX 共同表明 ClickHouse 正在扩展“分析数据库 + 交互式检索/服务化接口”的边界。

---

## 7. 用户反馈摘要

### 真实痛点 1：用户更担心“静默错误”，而不仅是报错
- 代表 Issues: #99310, #100502, #101544, #101337  
- 链接: ClickHouse/ClickHouse Issue #99310 / #100502 / #101544 / #101337  
- 总结：用户最敏感的不是查询失败，而是**查询成功但结果错了**。尤其是 analyzer、湖仓 time travel、schema union、复制去重等场景，都会影响生产信任度。

### 真实痛点 2：可观测性/日志场景需要更强的半结构化索引
- 代表 Issue/PR: #98953, #101677  
- 链接: ClickHouse/ClickHouse Issue #98953 / ClickHouse/ClickHouse PR #101677  
- 总结：Map、labels、数组、多值字段上的索引与检索诉求明显上升，说明 ClickHouse 在 observability 市场的使用强度还在提高。

### 真实痛点 3：BI 工具生成 SQL 质量差，用户希望优化器“自动兜底”
- 代表 Issue: #101451  
- 链接: ClickHouse/ClickHouse Issue #101451  
- 总结：很多用户无法控制上游 SQL 生成器，因此希望 ClickHouse 在 unused join、列裁剪、常量折叠、简单视图优化等方面更激进。

### 真实痛点 4：导入与湖仓连接器场景仍有兼容性成本
- 代表 Issues: #101487, #101544, #100502, #101595  
- 链接: ClickHouse/ClickHouse Issue #101487 / #101544 / #100502 / #101595  
- 总结：CSV、S3/tar、DeltaLake、Iceberg 等入口非常重要，但异构 schema、时间旅行、数据布局假设等细节仍容易踩坑。

### 真实痛点 5：生产环境异常条件下的稳健性
- 代表 Issues/PRs: #93095, #99799, #98340, #101680  
- 链接: ClickHouse/ClickHouse Issue #93095 / #99799 / ClickHouse/ClickHouse PR #98340 / #101680  
- 总结：用户不仅关心基准性能，也关心**时钟回拨、异常关停、对象存储清理、执行器死锁**这类运维边缘场景。

---

## 8. 待处理积压

### 值得维护者关注的长期 Issue

- **#59617 URL engine/table function schema 扩展与相对路径**  
  链接: ClickHouse/ClickHouse Issue #59617  
  原因：创建于 2024-02-05，需求普适、实现边界清晰，适合作为易用性改进切入点。

- **#37288 index 复数命名不一致（indices vs indexes）**  
  链接: ClickHouse/ClickHouse Issue #37288  
  原因：老问题虽小，但影响长期接口整洁性与文档一致性。

- **#92266 默认表达式中支持 `*` 与列匹配器**  
  链接: ClickHouse/ClickHouse Issue #92266  
  原因：对宽表/日志表建模帮助很大，且与 schema 自动化趋势一致。

- **#93095 系统时间回拨后的内存泄漏**  
  链接: ClickHouse/ClickHouse Issue #93095  
  原因：创建较久且仍活跃，涉及生产稳定性，应尽快明确是否可复现、是否归因到计时器/缓存/后台任务。

### 值得维护者关注的长期 PR

- **#91170 Arrow Flight SQL support**  
  链接: ClickHouse/ClickHouse PR #91170  
  原因：创建时间长、战略价值高，建议明确里程碑和剩余 blocker。

- **#93757 PartialAggregateCache**  
  链接: ClickHouse/ClickHouse PR #93757  
  原因：性能收益潜力大，但实验性特性通常需要更清晰的可观测性与失效策略说明。

- **#96487 ALIAS 列导致 lazy read/top-K 优化丢失修复**  
  链接: ClickHouse/ClickHouse PR #96487  
  原因：用户可见收益明确，建议优先推进合入。

---

## 总体判断

今天的 ClickHouse 呈现出典型的“大型高速演进型 OLAP 项目”特征：  
一方面，**索引、缓存、文本检索、标准 SQL 兼容、生态协议接入**等方向非常积极；另一方面，**查询正确性、湖仓适配、执行器稳定性、CI/fuzz 暴露的边界问题**也说明复杂度正在持续上升。  

从健康度看，项目仍然**非常活跃且修复响应快**，但接下来最值得关注的不是单点性能，而是：  
1. 新 analyzer / 优化器的正确性收敛；  
2. MergeTree 与湖仓连接器的静默错误治理；  
3. CI 与执行框架基础设施的进一步稳固。  

如果你愿意，我还可以继续把这份日报再整理成更适合团队群同步的 **“管理层摘要版”** 或 **“研发跟进清单版”**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-04-03

## 1. 今日速览

过去 24 小时 DuckDB 保持高活跃：**Issues 更新 17 条、PR 更新 56 条**，但**无新版本发布**。  
从内容看，今日重点集中在三类主题：**稳定性修复（崩溃/竞态/错误结果）**、**SQL 兼容性增强**、以及**执行器/优化器性能改进**。  
值得注意的是，多个新报问题都涉及 **1.5.1 回归、并发安全、Parquet/HTTPFS/S3 I/O 边界行为**，说明近期版本在扩展生态与复杂场景下正经历集中验证。  
同时，已有问题出现**快速修复闭环**，例如 ADBC 数据竞争、宏展开性能问题都已出现对应 PR，反映项目维护响应速度较快。  
整体判断：**项目健康度良好、开发节奏积极，但当前主线仍需继续收敛稳定性与回归风险。**

---

## 3. 项目进展

> 今日无新 Release，因此重点关注已关闭/推进中的 PR。

### 已关闭/完成的重要 PR

#### 1) 修复 `DELETE RETURNING` 在同事务插入场景下返回不完整
- **PR**: #21541 `Fix DELETE RETURNING for rows inserted in the same transaction`  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21541

该修复针对事务语义正确性：在同一个显式事务中刚插入的数据，随后执行 `DELETE RETURNING` 时，删除本身成功，但 `RETURNING` 结果可能遗漏事务本地存储中的行。  
这类问题直接影响 **DML 正确性与事务可见性**，对依赖 RETURNING 的应用、ORM、中间件尤其重要。它说明 DuckDB 在本地事务存储与表扫描交互上继续补齐边角语义。

#### 2) 修复 `COPY FROM CSV` 头部检测行为
- **PR**: #21734 `Fix COPY FROM CSV header detection`
- **状态**: CLOSED
- **链接**: duckdb/duckdb PR #21734

修复重点是：**在保留 CSV 方言探测的同时，维持 `COPY FROM` 默认“无 header”行为**。  
这属于典型的 **导入兼容性修复**，对批量数据管道、老脚本和自动化加载流程影响较大，能减少 CSV 导入时的隐式行为变化。

#### 3) 增强模糊测试覆盖
- **PR**: #21790 `Oss-Fuzz: add harness for csv/json targets`
- **状态**: CLOSED
- **链接**: duckdb/duckdb PR #21790

新增 CSV/JSON 目标的 fuzz harness，意味着项目在 **输入解析安全性与鲁棒性** 方面继续加强。  
虽然这不是直接面向用户的功能，但对减少解析器崩溃、越界、未定义行为等低层问题有长期价值。

#### 4) 小型 API/内部代码清理
- **PR**: #21798 `Add helper method for ConstantVector::SetNull`
- **状态**: CLOSED
- **链接**: duckdb/duckdb PR #21798

这是内部 API 简化，提升代码一致性与可维护性。  
虽然影响有限，但这类改动通常有助于降低后续向量化执行相关代码的出错率。

---

### 今日推进中的关键 PR

#### 5) ADBC/Go 并发竞态修复已提交
- **PR**: #21800 `Fix ADBC data race`
- **状态**: OPEN
- **关联 Issue**: #21772
- **链接**: duckdb/duckdb PR #21800

这是今天最值得关注的修复之一。问题涉及 **Go GC 与 ADBC 连接/流生命周期管理的 use-after-free / data race**。  
修复若顺利合入，将提升 DuckDB 在 **Go + ADBC 嵌入式分析** 场景中的稳定性。

#### 6) 宏展开性能问题已有针对性修复
- **PR**: #21801 `Fix macro expansion blow-up in CASE-heavy nested macros`
- **状态**: OPEN
- **关联 Issue**: #21747
- **链接**: duckdb/duckdb PR #21801

该 PR 针对 **深层嵌套宏 + CASE 表达式** 导致的 binder/宏展开爆炸问题，尝试跳过常量条件下不可达分支的无效扩展。  
这是非常典型的 **分析阶段性能优化**，对 SQL 代码生成器、大量模板 SQL 用户价值明显。

#### 7) 采样语法能力继续增强
- **PR**: #20859 `Support SYSTEM sampling with row counts`
- **状态**: OPEN, Ready For Review
- **链接**: duckdb/duckdb PR #20859

拟支持 `USING SAMPLE N ROWS (system)`，从百分比采样扩展到**离散行数采样**。  
这是 SQL 易用性与功能完整性的增强，对实验分析和交互式探索工作流很实用。

#### 8) Window 绑定重构持续推进
- **PR**: #21562 `Internal #8500: Window Function Binding`
- **状态**: OPEN, Ready For Review
- **链接**: duckdb/duckdb PR #21562

该 PR 涉及窗口函数绑定路径重构、`LEAD/LAG` 表达方式调整、`IGNORE/RESPECT NULLS` 校验下沉到 binder。  
这是偏底层的查询引擎整理，若合入，预计会提升 **窗口函数语义一致性与后续扩展性**。

#### 9) 聚合下推到 table scan
- **PR**: #21797 `Push min/max/count down to table scan`
- **状态**: OPEN, Changes Requested
- **链接**: duckdb/duckdb PR #21797

目标是将 `min/max/count` 聚合利用 row group/segment 统计信息直接求值，避免扫描实际数据。  
这是非常有价值的 **存储层统计信息利用优化**，若成熟后合入，预计对大表扫描类指标查询有显著收益。

#### 10) VACUUM 与索引共存路线图信号
- **PR**: #21769 `vacuum_rebuild_indexes threshold setting`
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21769

PR 描述明确提到这是“**允许带索引场景下 vacuum**”路线图的第一部分。  
虽然当前只是增加启动时可配置阈值，但这是存储维护能力走向更完整的重要信号。

---

## 4. 社区热点

### 热点 1：ADBC 与 Go GC 的竞态崩溃
- **Issue**: #21772 `Potential race condition between adbc and go garbage collector`
- **PR**: #21800 `Fix ADBC data race`
- **链接**: duckdb/duckdb Issue #21772 / duckdb/duckdb PR #21800

这是今日最有代表性的稳定性热点。用户在 CI 中遇到**间歇性 segfault**，本地难复现，体现出典型并发生命周期问题的排查难度。  
背后技术诉求是：DuckDB 作为嵌入式分析引擎，必须在 **多语言 runtime（尤其带 GC 的语言）** 中保证句柄/流对象生命周期安全。  
好消息是已有 fix PR，说明维护者已快速定位到 `active_streams` 等资源管理路径。

### 热点 2：宏查询性能退化与快速跟进修复
- **Issue**: #21747 `Performance issue for queries with macros`
- **PR**: #21801 `Fix macro expansion blow-up in CASE-heavy nested macros`
- **链接**: duckdb/duckdb Issue #21747 / duckdb/duckdb PR #21801

用户反馈的是**代码生成 SQL** 场景下，`macro + CASE WHEN` 导致异常缓慢。  
这反映 DuckDB 已越来越多被用于 **程序化生成分析 SQL**、模板化表达式编排，而不仅是手写查询。  
维护者当天就有修复 PR，说明这是被视为实际影响面较广的问题。

### 热点 3：HTTP Header 长度上限
- **PR**: #20460 `Increase httplib header max length from 8KB to 16KB`
- **状态**: OPEN, stale
- **链接**: duckdb/duckdb PR #20460

虽然是旧 PR，但今天仍有更新，问题场景非常现实：某些网站返回超大 CSP 等 HTTP 头，导致请求失败。  
背后诉求是 DuckDB 的 HTTP/远程读取能力需要适应更复杂的真实 Web/CDN 环境。  
这是 **数据访问兼容性** 而不是核心执行引擎问题，但对 `read_parquet/read_csv/httpfs` 用户体验有直接影响。

### 热点 4：事务隔离级别语法兼容
- **PR**: #21143 `Add support for setting transaction isolation level`
- **状态**: OPEN, stale
- **链接**: duckdb/duckdb PR #21143

虽然 DuckDB 当前实际上仅支持 repeatable read，但用户仍希望支持：
```sql
SHOW TRANSACTION ISOLATION LEVEL;
SET TRANSACTION ISOLATION LEVEL ...;
```
这体现出越来越多用户把 DuckDB 当作 **Postgres 风格 SQL 兼容引擎** 使用，希望脚本、ORM、迁移工具“少改即跑”。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：可能导致崩溃/内存破坏

#### 1) ADBC + Go GC 竞态，出现 segfault
- **Issue**: #21772
- **状态**: OPEN, under review
- **Fix PR**: #21800
- **链接**: duckdb/duckdb Issue #21772

影响：可能造成 CI 间歇性崩溃，涉及 use-after-free / 资源生命周期。  
判断：**高优先级**，因为属于跨语言绑定层的不安全行为。

#### 2) 复合索引创建触发 `free(): corrupted unsorted chunks`
- **Issue**: #21749
- **状态**: OPEN
- **链接**: duckdb/duckdb Issue #21749

场景：Ubuntu 24.04 / glibc 2.39，大表（600 万+ 行）上 `CREATE INDEX`，单列索引成功，复合索引崩溃。  
影响：可能是索引构建路径上的 **堆内存破坏**，对生产数据构建流程风险很高。  
当前：**未见对应 fix PR**，需重点跟进。

#### 3) 写 VARIANT 到 Parquet 出现内部断言
- **Issue**: #21779
- **状态**: OPEN
- **链接**: duckdb/duckdb Issue #21779

错误：
`Attempted to access index 2 within vector of size 2`  
说明 DuckDB 在 `JSON -> VARIANT -> Parquet` 的复杂类型导出路径仍存在边界错误。  
影响：数据导出接近完成时崩溃，破坏 ETL 稳定性。

---

### P2：查询正确性/回归风险

#### 4) 1.5.1 出现绑定错误，1.5.0 正常
- **Issue**: #21788
- **状态**: OPEN, reproduced
- **链接**: duckdb/duckdb Issue #21788

报错：
`Failed to bind column reference ... inequal types (VARCHAR != BIGINT)`  
这是明确的**版本回归信号**，影响升级信心。若复现样例具有代表性，优先级应提升。

#### 5) CTE + LEFT JOIN + 空表 + DISTINCT 间歇性返回错误结果
- **Issue**: #21757
- **状态**: OPEN, reproduced
- **链接**: duckdb/duckdb Issue #21757

这是比 crash 更隐蔽的问题：**错误结果**。  
且是“间歇性”缺行，意味着可能涉及优化器/执行顺序/去重逻辑的非稳定行为。  
这类问题对分析数据库信誉影响很大，应尽快定位。

#### 6) `ieee_floating_point_ops` 与文档不一致
- **Issue**: #21744
- **状态**: OPEN, reproduced
- **链接**: duckdb/duckdb Issue #21744

表现为文档称应返回 NaN，但实际抛错。  
这是**文档-实现不一致**，虽不一定是执行错误，但会直接影响用户对数值边界行为的预期。

#### 7) `all_profiling_output` pragma 功能异常
- **Issue**: #21735
- **状态**: CLOSED
- **链接**: duckdb/duckdb Issue #21735

虽已关闭，但说明 profiling 相关表函数命名/可见性曾存在问题。  
对依赖性能分析输出的开发者来说，这是重要工具链修复。

---

### P3：I/O、配置与兼容性问题

#### 8) Python + HTTPFS 向 S3 COPY，错误凭证下“静默成功”
- **Issue**: #21787
- **状态**: OPEN
- **链接**: duckdb/duckdb Issue #21787

这是很危险的 I/O 语义问题：**没有抛错，但数据也没写上去**。  
对自动化数据管道来说相当于“静默数据丢失”，严重性高于普通兼容性 bug。

#### 9) `LOAD motherduck` 在 1.5.1 升级后出现问题
- **Issue**: #21771
- **状态**: OPEN, needs triage
- **链接**: duckdb/duckdb Issue #21771

这是典型扩展兼容性问题，反映 DuckDB 升级后第三方生态联动仍需加强验证。

#### 10) `SET GLOBAL secret_directory` 不生效
- **Issue**: #21740
- **状态**: OPEN, reproduced, Needs Documentation
- **链接**: duckdb/duckdb Issue #21740

问题涉及 client/R/python 一致性，也牵涉文档预期。  
尤其 R 默认 `secret_directory` 路径变化后，用户对全局配置的可控性更敏感。

#### 11) Java 1.5.0 宏类型参数与 storage version 报错
- **Issue**: #21753
- **状态**: OPEN, under review
- **链接**: duckdb/duckdb Issue #21753

这个问题体现 **Java 客户端 + 物理存储模式 + 宏特性** 的组合兼容性仍有盲区。

#### 12) Debug build 多重定义 / 特定编译器断言
- **Issue**: #21108, #20295
- **状态**: OPEN, under review
- **链接**: duckdb/duckdb Issue #21108 / duckdb/duckdb Issue #20295

主要影响开发者和打包者，但对跨平台构建质量很关键。

---

## 6. 功能请求与路线图信号

### 1) 暴露表是否存在 `rowid` 伪列
- **Issue**: #21777
- **链接**: duckdb/duckdb Issue #21777

用户希望在 `duckdb_tables()` 中新增元数据列，指示表是否支持 `rowid`。  
这是很合理的**目录/元数据可发现性增强**需求，特别适用于外表、客户端驱动、可视化工具。  
从 DuckDB 越来越重视系统表与 introspection 能力的趋势看，这类需求**有机会进入后续版本**。

### 2) 支持 DML 作为 CTE body
- **PR**: #21634
- **状态**: OPEN, Changes Requested
- **链接**: duckdb/duckdb PR #21634

允许 `INSERT/UPDATE/DELETE [RETURNING]` 出现在 `WITH` 中，这是向 PostgreSQL 风格 SQL 靠拢的重要兼容性扩展。  
由于已进入实现阶段，虽然仍有 review 意见，但说明该方向**并非停留在概念讨论**。

### 3) 事务隔离级别语法兼容
- **PR**: #21143
- **状态**: OPEN
- **链接**: duckdb/duckdb PR #21143

即便底层仅支持一种隔离级别，也通过兼容语法提升接入体验。  
这类“**语法兼容先行**”通常很容易被纳入版本，只要不会误导用户。

### 4) SYSTEM 采样支持固定行数
- **PR**: #20859
- **状态**: Ready For Review
- **链接**: duckdb/duckdb PR #20859

成熟度较高，且功能边界清晰，属于比较可能进入下一小版本的增强项。

### 5) VACUUM + 索引的长期路线
- **PR**: #21769
- **链接**: duckdb/duckdb PR #21769

从 PR 描述可看出，DuckDB 正在逐步解决“**带索引情况下的 vacuum 支持**”这一历史限制。  
这是存储引擎能力演进的重要路线图信号，值得持续关注。

---

## 7. 用户反馈摘要

### 1) 嵌入式/多语言使用者最在意“稳定但可复现”
- 代表问题：#21772, #21753, #21771  
- 链接：duckdb/duckdb Issue #21772 / #21753 / #21771

Go、Java、MotherDuck 扩展相关反馈说明，用户已广泛在 **CI、生产服务、语言绑定、远程扩展** 中部署 DuckDB。  
他们最关心的不是单纯功能有无，而是：**升级后是否稳定、错误是否可观测、跨 runtime 是否安全**。

### 2) 分析型用户开始深入依赖复杂 SQL 生成与宏系统
- 代表问题：#21747
- 链接：duckdb/duckdb Issue #21747

宏展开性能问题表明 DuckDB 已被用于**自动生成大规模 SQL** 的场景。  
这类用户对 binder/optimizer 的要求更接近编译器，而非传统交互式数据库。

### 3) ETL 用户对导入导出“不能静默失败”高度敏感
- 代表问题：#21779, #21787, #21734
- 链接：duckdb/duckdb Issue #21779 / #21787 / duckdb/duckdb PR #21734

Parquet 导出崩溃、S3 COPY 静默成功、CSV header 检测兼容性问题，都集中反映：  
**DuckDB 正在被当作真实数据流水线组件使用**，因此 I/O 的错误语义、幂等性、边界一致性尤其重要。

### 4) 用户对查询正确性的容忍度最低
- 代表问题：#21757, #21788, #21541
- 链接：duckdb/duckdb Issue #21757 / #21788 / duckdb/duckdb PR #21541

无论是错误结果、版本回归，还是 RETURNING 语义缺失，都会直接影响分析可信度。  
今天这类问题的存在提醒维护者：**正确性修复优先级应继续高于新增特性**。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或 stale 项：

### 1) HTTP 头长度限制 PR 长期未合并
- **PR**: #20460
- **状态**: OPEN, stale
- **链接**: duckdb/duckdb PR #20460

问题来自真实网站兼容性，用户面广，建议尽快明确是否接受、是否需要配置化。

### 2) TrimFreeBlocks 并发写入/WAL 损坏修复
- **PR**: #21131
- **状态**: OPEN, stale, Changes Requested
- **链接**: duckdb/duckdb PR #21131

该 PR 涉及 **并发写入下块回收与 WAL 损坏风险**，虽然复杂，但属于存储层高风险问题，不宜长期搁置。

### 3) 事务隔离级别语法兼容
- **PR**: #21143
- **状态**: OPEN, stale
- **链接**: duckdb/duckdb PR #21143

功能实现成本可能不高，却能显著提升兼容性，值得重新审视优先级。

### 4) musl / arm64 构建支持完善
- **PR**: #21161, #21162
- **状态**: OPEN, stale
- **链接**: duckdb/duckdb PR #21161 / #21162

这类问题虽然不直接影响 SQL 用户，但对发行、容器化部署和边缘环境支持很关键。

### 5) 编译器/调试构建兼容问题
- **Issue**: #21108, #20295
- **链接**: duckdb/duckdb Issue #21108 / #20295

这两项都已存在一段时间，且影响开发者构建体验与平台覆盖，应避免长期拖延。

---

## 附：今日值得重点关注的链接清单

- ADBC 竞态问题：duckdb/duckdb Issue #21772  
- ADBC 修复 PR：duckdb/duckdb PR #21800  
- 宏性能问题：duckdb/duckdb Issue #21747  
- 宏性能修复 PR：duckdb/duckdb PR #21801  
- VARIANT 写 Parquet 崩溃：duckdb/duckdb Issue #21779  
- 复合索引创建崩溃：duckdb/duckdb Issue #21749  
- 1.5.1 绑定回归：duckdb/duckdb Issue #21788  
- CTE + DISTINCT 错误结果：duckdb/duckdb Issue #21757  
- S3 COPY 静默成功：duckdb/duckdb Issue #21787  
- `DELETE RETURNING` 事务修复：duckdb/duckdb PR #21541  
- CSV header 检测修复：duckdb/duckdb PR #21734  
- DML CTE 支持：duckdb/duckdb PR #21634  
- 聚合下推 table scan：duckdb/duckdb PR #21797  
- VACUUM + 索引路线：duckdb/duckdb PR #21769  

如果你愿意，我还可以继续把这份日报转换成：
1. **面向管理层的 1 页摘要版**  
2. **面向内核开发者的技术风险版**  
3. **表格化周报格式（可直接贴飞书/Notion）**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 · 2026-04-03

## 1. 今日速览

过去 24 小时 StarRocks 保持**高活跃度**：Issues 更新 9 条、PR 更新 115 条，开发节奏明显集中在 **4.1 分支稳定性修复、Lake/复制链路、SQL 优化器正确性** 以及 **文档澄清**。  
从 PR 结构看，**已合并/关闭 72 条**，说明维护者处理效率较高，当前以问题收敛和版本分支回补为主，而不是大规模新功能发布。  
今日没有新 Release，但多个 PR 涉及 **4.0/4.1 回补**，释放出临近小版本交付、强化可运维性与兼容性的信号。  
Issue 侧新增和活跃问题主要聚焦在 **元数据兼容性、Iceberg/HMS 外部目录、文件导入统计、优化器边界条件**，说明用户生产环境正在持续向湖仓一体与复杂 SQL 场景推进。

---

## 2. 项目进展

### 2.1 今日合并/关闭的重要 PR

#### 1) 修复 AWS SDK 缺失 `s3-transfer-manager` 依赖，并已回补多版本
- PR: [#71230](https://github.com/StarRocks/StarRocks/pull/71230)  
- Backport: [#71234](https://github.com/StarRocks/StarRocks/pull/71234), [#71235](https://github.com/StarRocks/StarRocks/pull/71235)

这是今日最明确的**外部存储/对象存储可用性修复**之一。缺失 `s3-transfer-manager` 会直接影响依赖 AWS SDK 的相关访问链路，修复后并同步回补到 4.0/4.1，说明问题影响面较广，且已被认定为版本级稳定性事项。  
**影响方向**：S3 生态兼容性、对象存储访问可靠性、云上部署可用性。

---

#### 2) SQL 路径中的凭据脱敏修复已关闭，继续向 insert files 场景延伸
- 已关闭 PR: [#71095](https://github.com/StarRocks/StarRocks/pull/71095)  
- 新增进行中 PR: [#71245](https://github.com/StarRocks/StarRocks/pull/71245)

`StmtExecutor` 路径的敏感信息脱敏已经落地，今天又有后续 PR 继续覆盖 `insert files` 场景，且标注了 `behavior_changed`。  
这说明 StarRocks 正在系统性补齐**日志、query-info、执行明细中的凭据泄露风险**。对企业用户尤其是多租户和云托管场景，这类修复优先级很高。  
**影响方向**：安全合规、审计、云环境运维。

---

#### 3) 文档中明确 4.1 降级风险
- PR: [#71170](https://github.com/StarRocks/StarRocks/pull/71170)

该文档 PR 提示：**4.1 rc 部署无法降级到 4.0.5 以下版本**。虽然不是代码改动，但它释放出非常重要的产品信号：  
- 4.1 存在元数据或行为层面的不兼容变更  
- 维护团队正在主动补充升级/降级边界说明  
对准备试用 4.1 的用户，这类文档比功能列表更关键。  
**影响方向**：版本迁移、升级策略、生产发布节奏。

---

#### 4) Runtime/类型系统相关重构持续推进
- 已关闭 PR: [#71244](https://github.com/StarRocks/StarRocks/pull/71244) RuntimeFilter 移入 ExecCore  
- 已关闭 PR: [#71239](https://github.com/StarRocks/StarRocks/pull/71239) 重命名 `type_traits.h`  
- 进行中 PR: [#71204](https://github.com/StarRocks/StarRocks/pull/71204) 抽取 `StorageColumnTraits`

这组 PR 表明底层执行与存储类型系统仍在持续整理。虽然短期内用户感知不强，但通常意味着：  
- 为后续执行引擎模块化、代码边界清晰化做准备  
- 为复杂类型、存储列实现、代码复用和维护性提升铺路  
**影响方向**：执行引擎可维护性、后续性能优化与新类型支持。

---

### 2.2 今日值得关注的进行中 PR

#### 5) Lake 全量复制中的 compaction_inputs 保护
- PR: [#71203](https://github.com/StarRocks/StarRocks/pull/71203)

该修复针对 full replication apply 阶段中，**新 tablet metadata 仍引用的 segment 文件可能被 Vacuum 错删** 的问题，尤其在 UUID reuse 场景下更容易触发。  
这是一个典型的**湖表复制/回放/清理链路一致性问题**，如果落地，将显著提升 Lake 场景下的复制安全性。  
**影响方向**：Lake replication、数据可靠性、后台清理正确性。

---

#### 6) 修复 alter job 间 `UpdateTabletSchemaTask` 签名冲突
- PR: [#71242](https://github.com/StarRocks/StarRocks/pull/71242)

多个 ALTER TABLE 在短时间作用于同一表/分区时，由于 signature 仅由 `tablets.hashCode()` 计算，可能发生任务冲突和错误去重。  
这类问题通常会导致**DDL 执行偶发失败、任务丢失或串扰**，属于生产环境难定位的调度层 bug。  
**影响方向**：Schema Change、AgentTaskQueue、DDL 稳定性。

---

#### 7) 修复 MCV-only histogram 下行数估计 NaN
- PR: [#71241](https://github.com/StarRocks/StarRocks/pull/71241)

当 `IS NULL` 谓词构造出只有 MCV、没有 residual bucket 的直方图时，等值比较 fallback 可能除零，从而产生 `NaN` row count，进一步污染 join reorder 成本模型。  
这是非常典型的**优化器统计边界条件导致的查询计划错误风险**，若合入，将增强复杂查询的稳定性与计划质量。  
**影响方向**：CBO 估计质量、Join Reorder、查询正确性与性能稳定性。

---

#### 8) 启用 physical filter 的 dictification
- PR: [#71093](https://github.com/StarRocks/StarRocks/pull/71093)

该增强放宽了 physical filter 上字典化优化的保守判断。  
这通常意味着在字典编码输入存在时，过滤算子可进一步利用字典化执行路径，潜在带来 CPU 与内存效率收益。  
**影响方向**：查询执行优化、低基数字符串过滤性能。

---

## 3. 社区热点

> 注：给定数据中 PR 评论数未展示具体数值，以下按“问题热度、用户价值、潜在影响面”综合判断。

### 热点 1：支持 `MERGE INTO` 的需求持续存在
- Issue: [#65949](https://github.com/StarRocks/StarRocks/issues/65949)

这是今天最值得关注的功能诉求之一，也是唯一明确获得较多 👍（12）的需求。  
用户诉求并不只是 SQL 语法补齐，而是希望在**动态分区覆盖 + Upsert/增量写入**场景中，拥有更高效、更标准的写入方式。  
**技术诉求背后**：
- 面向 CDC/增量同步/数仓修正数据的 SQL 标准化
- 降低依赖外部 ETL 拼装 overwrite/upsert 流程的复杂度
- 对标主流数仓/湖仓产品的 DML 能力

这是一个很强的路线图信号，尤其在 StarRocks 加速承接湖仓与数据集成工作负载的背景下，`MERGE INTO` 的优先级可能继续上升。

---

### 热点 2：FIPS 合规能力被正式提出
- Issue: [#71243](https://github.com/StarRocks/StarRocks/issues/71243)

该需求来自受监管行业，强调 **FIPS 140-2/3 validated cryptographic modules**。  
这类问题通常不是简单 feature，而是**企业采购与生产准入门槛**。如果 StarRocks 未来强化政企、金融、医疗落地，FIPS 支持会成为重要加分项。  
**技术诉求背后**：
- TLS/静态数据加密链路中的合规模块要求
- 安全审计与认证
- 企业版/发行版能力边界定义

---

### 热点 3：4.1 降级限制文档化
- PR: [#71170](https://github.com/StarRocks/StarRocks/pull/71170)

虽然只是文档，但其背后是很现实的升级风险管理。  
社区关注点不再只是“能否升级”，而是“升级后是否可逆、元数据是否兼容、回滚窗口如何设计”。  
这表明 StarRocks 的用户群体越来越偏生产级，版本治理能力的重要性上升。

---

## 4. Bug 与稳定性

以下按严重程度和潜在影响排序。

### P1：Lake 全量复制中 segment 文件可能被 Vacuum 错删
- PR: [#71203](https://github.com/StarRocks/StarRocks/pull/71203)

**风险**：数据文件仍被新元数据引用时被清理，可能造成复制后数据缺失或不可读。  
**状态**：已有 fix PR，尚待合并。  
**判断**：属于高优先级数据一致性问题，建议重点跟踪。

---

### P1：多 ALTER JOB 下 schema task 签名冲突
- PR: [#71242](https://github.com/StarRocks/StarRocks/pull/71242)

**风险**：DDL 任务在 AgentTaskQueue 中冲突、被误判为同一任务。  
**状态**：已有 fix PR，尚待合并。  
**判断**：属于并发 DDL 环境中的高价值稳定性修复。

---

### P1：MCV-only histogram 导致优化器 NaN 行数估计
- PR: [#71241](https://github.com/StarRocks/StarRocks/pull/71241)

**风险**：成本模型被 `NaN` 污染，进而影响 join reorder 和计划选择。  
**状态**：已有 fix PR，尚待合并。  
**判断**：虽不是 crash，但属于**查询计划正确性/性能异常**类高优先问题。

---

### P1：HMS Thrift Client 触发默认 100MB `MaxMessageSize` 限制
- Issue: [#71200](https://github.com/StarRocks/StarRocks/issues/71200)

**现象**：在 huge table 刷新等场景下，Thrift 0.20.0 默认 `MaxMessageSize` 不足。  
**风险**：Hive 元数据刷新失败、外表同步受阻。  
**状态**：暂未看到对应 fix PR。  
**判断**：对大规模 Hive Metastore 用户影响较大，建议尽快补丁或配置绕过方案。

---

### P2：`AddFilesProcedure` 对 ORC 文件统计读取错位
- Issue: [#71222](https://github.com/StarRocks/StarRocks/issues/71222)

**现象**：ORC `Reader.getStatistics()` 的 index 0 是文件级统计，真实列统计从 index 1 开始；当前实现从 0 开始遍历，导致列指标整体偏移。  
**风险**：外部文件导入/分析过程中的列统计失真。  
**状态**：暂未看到对应 fix PR。  
**判断**：对 ORC 导入质量、统计信息正确性有直接影响。

---

### P2：Iceberg catalog 中 `GRANT ALL VIEWS` 失败
- Issue: [#71211](https://github.com/StarRocks/StarRocks/issues/71211)

**风险**：外部 Iceberg REST catalog 的权限模型与 StarRocks 授权语义存在兼容性问题。  
**状态**：暂未看到 fix PR。  
**判断**：影响 Lakehouse 权限治理场景，属于连接器/外部目录兼容性缺口。

---

### P2：`information_schema.columns.EXTRA` 未报告 `auto_increment`
- Issue: [#63730](https://github.com/StarRocks/StarRocks/issues/63730)

**风险**：元数据 introspection 与 MySQL 兼容性不足，影响工具链、ORM、schema 同步程序。  
**状态**：长期 open，今日仍活跃。  
**判断**：不是致命 bug，但对生态兼容性影响持续存在。

---

### P3：SQL Analyzer 中 `visitDictionaryGetExpr` 空指针问题已关闭
- Issues: [#71070](https://github.com/StarRocks/StarRocks/issues/71070), [#70997](https://github.com/StarRocks/StarRocks/issues/70997)

这两个 AI-detected 问题都指向 `table == null` 时错误消息路径中仍调用 `table.getName()`。  
**状态**：今日已关闭。  
**判断**：说明维护团队对静态/AI 辅助发现的问题处理较快，但也提示 Analyzer 边界异常处理仍需加强。

---

### P3：优化器 bug 已关闭
- Issue: [#71057](https://github.com/StarRocks/StarRocks/issues/71057)

虽然摘要未完全展开，但已被关闭，说明相关 SQLancer 暴露的问题已有处理或确认。  
这延续了 StarRocks 对随机 SQL 测试暴露问题的快速收敛趋势。

---

## 5. 功能请求与路线图信号

### 1) `MERGE INTO` 是最强路线图信号之一
- Issue: [#65949](https://github.com/StarRocks/StarRocks/issues/65949)

结合当前 StarRocks 在动态分区覆盖、外部表、湖仓集成方面的演进，`MERGE INTO` 很可能是未来版本值得跟踪的 DML 能力。  
**原因**：
- 满足 Upsert/CDC/增量修复的标准化写入
- 降低用户端复杂 SQL/ETL 拼装成本
- 与现代分析型数据库和 Lakehouse 用户预期对齐

---

### 2) FIPS 合规可能进入企业化能力清单
- Issue: [#71243](https://github.com/StarRocks/StarRocks/issues/71243)

目前尚未看到对应 PR，但该需求具有明显的企业落地导向。  
如果后续出现 TLS、KMS、加密模块选择或发行版说明相关 PR，可视为它进入正式规划。

---

### 3) 文档与降级约束提示：4.1 正在走向更严格发布治理
- PR: [#71170](https://github.com/StarRocks/StarRocks/pull/71170)

虽然不是功能请求，但其意义在于：  
- 4.1 将更强调版本边界与迁移文档  
- 后续可能出现更多 upgrade checker、兼容性说明、回滚策略文档

---

## 6. 用户反馈摘要

基于今日 Issues，可提炼出几个真实用户痛点：

### 1) 外部元数据系统在大规模场景下仍是高频痛点
- HMS 大表刷新触发消息大小限制：[#71200](https://github.com/StarRocks/StarRocks/issues/71200)
- Iceberg REST catalog 权限语义不完整：[#71211](https://github.com/StarRocks/StarRocks/issues/71211)

这说明用户正在更广泛地把 StarRocks 放在 **Hive/Iceberg 元数据平面之上** 使用，而不仅是内部表分析。痛点集中在**规模、兼容性、权限治理**。

### 2) 元数据兼容性影响生态工具接入
- `auto_increment` 未出现在 `information_schema.columns.EXTRA`：[#63730](https://github.com/StarRocks/StarRocks/issues/63730)

这类问题通常来自 ORM、迁移工具、BI 连接器或 schema diff 工具的实际使用反馈。用户期待 StarRocks 在 MySQL 风格元数据接口上更“像 MySQL”。

### 3) 文件导入/湖表过程中的统计正确性越来越关键
- ORC 指标错位：[#71222](https://github.com/StarRocks/StarRocks/issues/71222)

这表明用户不仅关注“能导入”，也关注**导入后统计是否可信、优化器是否能依赖这些统计做正确决策**。

### 4) 企业用户开始明确提出合规要求
- FIPS compliance：[#71243](https://github.com/StarRocks/StarRocks/issues/71243)

这是 StarRocks 用户结构升级的信号：项目已进入更高合规要求的生产环境评估阶段。

---

## 7. 待处理积压

### 1) `MERGE INTO` 功能请求长期存在，且关注度较高
- Issue: [#65949](https://github.com/StarRocks/StarRocks/issues/65949)

创建于 2025-11-25，至今仍 open，且有 12 个 👍。  
建议维护者明确：
- 是否接受进入 roadmap
- 是否已有替代方案推荐
- 是否依赖现有 overwrite/upsert 语义扩展

---

### 2) `information_schema.columns.EXTRA` 未报告 `auto_increment`
- Issue: [#63730](https://github.com/StarRocks/StarRocks/issues/63730)

创建于 2025-09-30，至今仍 open。  
属于典型“非阻塞但长期影响兼容性”的问题，建议尽早定性优先级，否则会持续影响生态接入体验。

---

### 3) `be_tablets DATA_SIZE` 语义修正 PR 仍在进行中
- PR: [#70735](https://github.com/StarRocks/StarRocks/pull/70735)

该 PR 涉及 `DATA_SIZE` 指标定义与 rowset/索引字节的统计口径，对**观测性、容量评估、运维报表**影响较大。  
虽然不是高热度讨论，但属于值得持续推进的底层一致性改进。

---

## 8. 健康度评估

**总体健康度：良好偏强。**  
原因如下：
- PR 流量高，且关闭/合并数量显著，说明维护效率稳定  
- 4.0/4.1 多分支回补活跃，表明版本维护机制有效  
- 今日问题主要集中在外部系统兼容性与边界条件，而非大面积核心引擎回归  
- 但需要重点关注 Lake replication、HMS 大表元数据、优化器统计异常等高风险问题，它们都更接近真实生产负载

---

如果你愿意，我还可以继续把这份日报再加工成：
1. **适合微信群/飞书播报的 300 字简版**  
2. **适合管理层阅读的风险/趋势版**  
3. **按“查询引擎 / Lakehouse / 安全合规 / 文档发布”四栏整理的表格版**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-04-03）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 共有 **45 条仓库活动**（Issues 6、PR 39），整体活跃度 **高**，主要集中在 **Spark 4.x、Flink、REST Catalog/OpenAPI、Kafka Connect** 几条主线。  
PR 存量明显偏大：**39 条 PR 更新中仅 4 条关闭/合并，35 条仍待处理**，说明社区提交积极，但评审与合并节奏相对滞后。  
Issue 侧新增/活跃内容显示，当前用户关注点主要集中在 **Flink 正确性问题、Spark 过程调用报错、分区能力增强、许可证与依赖治理**。  
今天没有新版本发布，因此项目重点仍在 **功能扩展、兼容性演进与稳定性修复前置阶段**。

---

## 2. 项目进展

> 今日已关闭/合并的 PR 数量不多，但可看出当前维护重点仍在 **安全依赖治理、Spark 写入元数据一致性、分支回补**。

### 2.1 已关闭的重要 PR

#### ① Kafka Connect 1.10.x 安全依赖升级 PR 关闭
- **PR**: #15847 `[KAFKACONNECT] [1.10.x] Bump jackson from 2.19.2 to 2.21.2 to fix GHSA-72hv-8253-57qq`
- **状态**: CLOSED
- **链接**: apache/iceberg PR #15847

**解读**：  
该 PR 聚焦 **Kafka Connect 线路的安全依赖修复**，目标是升级 Jackson 以修补公开安全公告中的漏洞。虽然当前显示为关闭，但它释放了一个明确信号：  
Iceberg 维护者正在对 **运行时依赖、LICENSE/NOTICE、发布合规性** 做集中治理，尤其是连接器生态中的安全基线。

**影响方向**：
- Kafka Connect 部署安全性
- 1.10.x 维护分支的依赖健康度
- 后续版本发布前的许可证/依赖审计

---

#### ② Spark 写入 manifest 元数据一致性回补 PR 关闭
- **PR**: #15832 `[spark] Spark (4.0, 3.5): Set data file sort_order_id in manifest for writes from Spark`
- **状态**: CLOSED
- **链接**: apache/iceberg PR #15832

**解读**：  
该 PR 是对既有变更的 **Spark 4.0 / 3.5 回补**，目的是在 Spark 写入数据时为 manifest 中的数据文件正确设置 `sort_order_id`。  
这类修复对查询引擎用户往往“不显眼但重要”，因为它关系到：
- 元数据准确表达数据排序特征
- 后续扫描优化或重写操作的判断基础
- 多版本 Spark 模块行为一致性

若该修复最终以其他 PR 方式落地，将有助于提升 **Spark 写路径与 Iceberg 元数据语义的一致性**。

---

### 2.2 今日值得关注的推进中 PR

#### Spark 方向
- **#15876** Spark 4.0 回补 Async Micro Batch Planner  
  链接: apache/iceberg PR #15876
- **#15877** Spark 4.1 异步 planner 流式测试覆盖增强  
  链接: apache/iceberg PR #15877
- **#15875** 将 Spark 专属表属性从 core 迁移到 Spark 模块  
  链接: apache/iceberg PR #15875
- **#15874** 文档补充：Spark migrate procedure 遇到 bucketed 源表会失败  
  链接: apache/iceberg PR #15874
- **#15310** Spark：重写 manifests 时为 range partition 增加 data file path  
  链接: apache/iceberg PR #15310

**趋势判断**：Spark 线正在从“能用”进一步走向 **模块边界清晰、流式能力增强、失败场景显式化、元数据重写更稳健**。

#### Flink 方向
- **#15476** Flink 2.2 支持  
  链接: apache/iceberg PR #15476
- **#15784** Flink Sink 增加 `WriteObserver` 插件接口  
  链接: apache/iceberg PR #15784

**趋势判断**：Flink 线重点在 **版本兼容扩展** 与 **Sink 可观测性/扩展能力**，对生产环境接入价值较高。

#### REST Catalog / OpenAPI 方向
- **#15830** 增加 relation 单条/批量加载端点  
  链接: apache/iceberg PR #15830
- **#15831** relation load endpoint 的 Java 参考实现  
  链接: apache/iceberg PR #15831
- **#15180** 函数 list/load endpoint 纳入 OpenAPI spec  
  链接: apache/iceberg PR #15180
- **#15746** `/v1/config` 增加 404 响应说明  
  链接: apache/iceberg PR #15746
- **#15863** REST 扫描规划 poll timeout 可配置  
  链接: apache/iceberg PR #15863
- **#15873** RESTCatalogProperties 默认值补全  
  链接: apache/iceberg PR #15873

**趋势判断**：REST Catalog 正在加速向 **更完整的对象模型、更成熟的客户端交互语义、更生产可配置化** 演进。

#### Kafka Connect 方向
- **#15499** Kafka Connect 原生支持 Upsert/Delete  
  链接: apache/iceberg PR #15499

**趋势判断**：这是连接器方向最关键的功能之一。如果落地，Iceberg Kafka Connect 将从 **append-only** 明显走向 **CDC / upsert 场景可用**。

---

## 3. 社区热点

## 3.1 最受关注 Issue：新增 week 分区变换
- **Issue**: #14220 `[improvement] Adding week partition transform`
- **状态**: OPEN
- **评论**: 5
- **👍**: 3
- **链接**: apache/iceberg Issue #14220

**热点原因**：  
这是今天数据中 **反应数最高** 的 Issue，说明它并非偶发提议，而是用户在真实建模与分区裁剪实践中存在明确需求。  
Iceberg 已支持 `day/month/year/hour` 等时间分区变换，但缺少 `week`，对以下场景不够友好：
- 周级报表
- 周期性运维/结算任务
- 以周为自然分区粒度的数据湖布局

**技术诉求分析**：
- 用户希望更自然地表达业务周期
- 避免用 `day` 分区导致过细、用 `month` 分区又过粗
- 可能涉及跨引擎一致性：Spark/Flink/Trino 等如何暴露该 transform

这是一个明显的 **路线图信号型需求**。

---

## 3.2 Kafka Connect Upsert/Delete 仍是高价值长期话题
- **PR**: #15499 `Enable Upsert and Delete Support in Apache Iceberg Kafka Connect`
- **状态**: OPEN
- **链接**: apache/iceberg PR #15499

**热点原因**：  
虽然数据未提供评论数，但从标题和改动范围看，这是目前最具业务价值的连接器改造之一。  
当前 Kafka Connect 仅 append-only，限制了其在 **CDC、主键更新、软删除同步** 场景中的使用。

**背后诉求**：
- 用户需要 Iceberg 直接接住数据库变更流
- 希望减少中间层定制开发
- 需要与 equality delete / upsert 语义对齐

若该 PR 继续推进，将明显提升 Iceberg 在 **流式湖仓写入链路** 的竞争力。

---

## 3.3 REST Catalog 进入“对象统一加载”设计阶段
- **PR**: #15830 `REST Spec: Add single and batch endpoints for loading relational objects`
- **PR**: #15831 `Core: Add Java reference implementation for relation load endpoints`
- **链接**: apache/iceberg PR #15830 / apache/iceberg PR #15831

**热点原因**：  
这组 PR 表明 REST Catalog 已不再局限于 table 的基础管理，而是在向 **table/view/未来 materialized view 的统一关系对象接口** 演进。

**背后诉求**：
- 降低多对象类型的 API 分裂
- 为未来 View / Materialized View 奠定统一访问模型
- 更利于跨语言客户端和 catalog 服务端实现

这是非常典型的 **中长期架构演进信号**。

---

## 4. Bug 与稳定性

> 按影响面与潜在严重程度排序。

### P1：Flink Source watermark 可能错误，影响事件时间正确性
- **Issue**: #15867 `[bug] Flink Source: watermark should be min timestamp minus one`
- **状态**: OPEN
- **链接**: apache/iceberg Issue #15867

**问题描述**：  
报告指出 Flink Source 中 watermark emitter 的逻辑应为 **最小时间戳减一**，当前实现可能导致 watermark 计算不符合预期。

**潜在影响**：
- 事件时间窗口触发错误
- 下游乱序容忍与迟到数据处理异常
- 流式作业结果正确性受损

**是否已有 fix PR**：  
当前提供数据中 **未见直接对应修复 PR**，建议维护者优先确认。

---

### P1：Spark 中调用 Procedures 报错
- **Issue**: #15870 `[question] Use Iceberg in Spark, Procedures return error`
- **状态**: OPEN
- **链接**: apache/iceberg Issue #15870

**问题性质**：  
虽然标签是 question，但若与版本搭配或 catalog/procedure 注册机制有关，往往会暴露 **Spark 集成兼容性问题**。

**潜在影响**：
- 管理类 SQL/过程无法执行
- 用户难以使用 migrate、rewrite、expire snapshots 等运维能力
- 影响新用户接入体验

**是否已有 fix PR**：  
未发现直接修复 PR。需先判断是配置误用、版本不匹配还是回归缺陷。

---

### P2：1.11 许可证问题梳理
- **Issue**: #15856 `[bug] Fix up 1.11 License Issues`
- **状态**: OPEN
- **链接**: apache/iceberg Issue #15856

**问题性质**：  
这是偏 **发布工程/合规稳定性** 的问题。虽然不直接影响查询正确性，但会影响：
- 发布包合法性
- 下游发行版可分发性
- 企业内部合规引入

**相关线索**：
- **#15860** Spark 4.1 增加 `runtime-deps.txt`
- **#15847** Kafka Connect 的 Jackson 升级 PR 已关闭
  
说明维护者正在针对 **依赖清单、NOTICE/LICENSE 校验、运行时产物审计** 做系统性补强。

---

### P2：IcebergSink 内存占用与写入行数相关
- **Issue**: #15859 `[question] IcebergSink memory consumption seems to be related to number of rows written`
- **状态**: CLOSED
- **链接**: apache/iceberg Issue #15859

**问题性质**：  
用户在 Flink + equality deletes + upsert 模式下观察到内存占用与写入行数相关。  
虽然该 Issue 已关闭，但从场景看这是典型的 **高吞吐 CDC/去重写入** 痛点，值得持续追踪是否需要文档化或参数调优建议。

**可能涉及点**：
- equality delete 状态管理
- writer buffering
- checkpoint 与 flush 行为
- key 宽度及去重策略影响

---

## 5. 功能请求与路线图信号

### 5.1 week 分区变换需求值得重点评估
- **Issue**: #14220
- **链接**: apache/iceberg Issue #14220

**判断**：  
这是一个兼具 **业务普适性** 和 **实现边界清晰度** 的功能请求。若考虑纳入后续版本，需要同步评估：
- 分区 transform 规范层扩展
- Java API / SQL DDL 表达
- 跨引擎兼容策略
- 与现有 `bucket`, `truncate`, `day/month/year/hour` 的规划一致性

**纳入下一版本可能性**：中等偏高。  
原因是需求明确、用户认可度较高，但可能牵涉规范与多引擎实现协调。

---

### 5.2 Kafka Connect 原生 Upsert/Delete 是强路线图信号
- **PR**: #15499
- **链接**: apache/iceberg PR #15499

**判断**：  
该能力对 Iceberg 进入更多 **数据库 CDC 入湖** 场景极其关键。  
若合入，将显著增强：
- 主键更新流接入能力
- 删除语义传播
- Kafka Connect 在数据湖写入链路中的实用性

**纳入下一版本可能性**：高，但取决于语义一致性与评审复杂度。

---

### 5.3 Flink 2.2 支持接近“必选兼容项”
- **PR**: #15476
- **链接**: apache/iceberg PR #15476

**判断**：  
引擎版本兼容通常是发行版中最容易被优先纳入的内容之一。  
如果测试矩阵稳定，Flink 2.2 支持很可能成为下一轮版本的重要兼容增强点。

**纳入下一版本可能性**：高。

---

### 5.4 Materialized View 与 relation/object API 正形成配套
- **PR**: #11041 `Materialized View Spec`
- **PR**: #15830 / #15831 relation load endpoints
- **链接**: apache/iceberg PR #11041 / #15830 / #15831

**判断**：  
物化视图规范本身是长期议题，而 relation 统一加载接口是底层基础设施。两者同时活跃，说明社区在朝着：
- 更丰富的数据对象类型
- 更统一的 catalog 访问层
- 更完备的视图/函数/关系对象抽象

持续推进。

**纳入下一版本可能性**：  
- relation/object API：中高  
- Materialized View 完整规范：中低到中，仍偏长期

---

## 6. 用户反馈摘要

### 6.1 Spark 用户：过程调用易踩版本/配置坑
- **Issue**: #15870
- **链接**: apache/iceberg Issue #15870

**痛点提炼**：
- 使用 Spark 集成 Iceberg 时，Procedures 报错
- 用户往往难以快速判断是 catalog 配置、扩展注册、版本组合还是 SQL 调用方式问题
- 这类问题通常直接阻断运维与管理能力使用

**信号**：  
Spark 侧虽然功能持续扩展，但 **可诊断性、错误信息清晰度、文档指引** 仍有提升空间。

---

### 6.2 Flink 用户：流式写入与删除语义下的资源消耗敏感
- **Issue**: #15859
- **链接**: apache/iceberg Issue #15859

**痛点提炼**：
- 在 upsert + equality delete 场景中，内存占用对记录数敏感
- 用户在真实生产流任务中非常关注 writer 状态规模与 checkpoint 资源
- 这说明 Flink Sink 的“高级语义模式”虽可用，但成本模型还不够透明

**信号**：  
需要更多关于 **吞吐、状态大小、删除模式、分区策略** 的调优文档。

---

### 6.3 用户希望分区设计更贴近业务周期
- **Issue**: #14220
- **链接**: apache/iceberg Issue #14220

**痛点提炼**：
- 周级分析是常见场景
- 现有时间 transform 无法优雅覆盖
- 用户不想通过额外派生列或应用层绕过

**信号**：  
说明 Iceberg 的分区抽象已被广泛依赖，用户开始追求更高层的表达能力，而不只是底层存储正确性。

---

## 7. 待处理积压

> 以下项目具有“创建时间较早、仍未合并/解决、影响面较大”的特点，建议维护者关注。

### 7.1 Materialized View Spec 长期悬而未决
- **PR**: #11041 `Materialized View Spec`
- **创建时间**: 2024-08-29
- **状态**: OPEN
- **链接**: apache/iceberg PR #11041

**提醒原因**：  
这是 Iceberg 高层对象模型演进中的关键规范，但已长时间开放。若长期缺乏结论，会影响：
- 社区对 MV 支持预期
- 相关 REST/object API 设计收敛
- 下游引擎与 catalog 实现同步

---

### 7.2 增量 Changelog Scan 支持 Delete File 与分区裁剪，改动大且长期未完成
- **PR**: #14264 `[Core] Add Delete File Support and Partition Pruning for Incremental Changelog Scans`
- **创建时间**: 2025-10-06
- **状态**: OPEN
- **链接**: apache/iceberg PR #14264

**提醒原因**：  
这项工作直指 **CDC / MoR / 增量读取正确性与性能**，价值很高，但跨度大、涉及规范和多模块协同。  
若评审长期停滞，建议拆分为更小 PR 以提升合入概率。

---

### 7.3 Kafka Connect Upsert/Delete 价值高但仍待推进
- **PR**: #15499
- **创建时间**: 2026-03-03
- **状态**: OPEN
- **链接**: apache/iceberg PR #15499

**提醒原因**：  
这是连接器生态最具产品化意义的能力之一。若长期不决，会让用户继续依赖私有实现或 Databricks 分支能力，削弱官方连接器吸引力。

---

### 7.4 Flink 2.2 支持应尽快收敛
- **PR**: #15476
- **创建时间**: 2026-02-28
- **状态**: OPEN
- **链接**: apache/iceberg PR #15476

**提醒原因**：  
版本兼容项拖延过久会影响用户升级窗口，也会增加测试矩阵维护压力。

---

## 8. 健康度结论

Apache Iceberg 今日呈现出典型的 **高活跃、强扩展、审查偏慢** 状态。  
从技术方向看，社区正同时推进：
- **Spark 4.x 流式与模块整理**
- **Flink 新版本与 Sink/Source 正确性**
- **REST Catalog/OpenAPI 对象模型扩展**
- **Kafka Connect 从 append-only 走向 CDC 语义**
- **许可证与运行时依赖治理**

短期风险主要在 **Flink watermark 正确性、Spark 集成易用性、发布合规问题**；中期机会则集中在 **week 分区、Kafka Connect Upsert/Delete、relation API、Flink 2.2 支持**。  
整体来看，项目健康度仍然良好，但 **高价值 PR 的积压** 值得维护者投入更多评审资源。

--- 

如需，我还可以继续把这份日报整理成：
1. **适合飞书/钉钉发布的简版**  
2. **按 Spark / Flink / REST / Connect 四条线拆分的专题版**  
3. **表格化周报模板**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报 — 2026-04-03

## 1. 今日速览

过去 24 小时内，Delta Lake 项目保持**高 PR 活跃度**：共有 **32 条 PR 更新**，其中 **26 条待合并**、**6 条已合并/关闭**；Issues 侧相对平稳，仅 **2 条活跃/新开**，无关闭记录。  
从内容看，今日开发重心仍然集中在 **Delta Kernel、DSv2 建表链路、CDC/Streaming、UniForm 原子提交、UC 测试治理** 等核心方向，说明项目当前处于**基础能力深化与跨引擎兼容增强并行推进**阶段。  
值得注意的是，虽然没有新版本发布，但多个 PR 呈现明显的**堆叠式开发（stacked PR）**特征，尤其是 kernel-spark CDC 流式读取链路，显示团队在推进较大功能集成。  
整体健康度判断：**代码活动旺盛、路线清晰，但部分关键能力仍处于长链路开发中，短期内 review/合并压力较大。**

---

## 3. 项目进展

> 注：今日无新版本发布。

### 已合并/关闭的重要 PR

#### 1) 文档层面明确推荐 `skipChangeCommits`，弱化旧参数
- **PR**: #6472 `[CLOSED] [Docs] Recommend skipChangeCommits over legacy ignoreDeletes/ignoreChanges`  
- **链接**: delta-io/delta PR #6472  
- **影响解读**:  
  该变更虽属文档更新，但对用户使用行为有明确导向作用：项目正在推动用户从历史参数 `ignoreDeletes` / `ignoreChanges` 迁移到更现代的 `skipChangeCommits` 语义。  
  这通常意味着：
  - 旧配置在语义一致性或维护成本上存在问题；
  - 流式读取/变更感知行为正在收敛到更统一的接口；
  - 对 Structured Streaming 与 CDC 用户来说，后续文档和最佳实践将更集中于新路径。  
- **类别**: SQL/流式兼容性与使用规范收敛

#### 2) UC Commit Metrics 增加特性开关与异步派发
- **PR**: #6333 `[CLOSED] [UC Commit Metrics] Add feature flag and async dispatch`  
- **链接**: delta-io/delta PR #6333  
- **摘要要点**:
  - 新增 `spark.databricks.delta.commitMetrics.enabled` 开关，默认 `false`
  - 新增 `spark.databricks.delta.commitMetrics.threadPoolSize`，默认 `20`
  - 改为异步派发，采用 daemon thread pool + 无界队列
- **影响解读**:  
  这是一个偏**可观测性与提交路径性能隔离**的改动。将 commit metrics 采集放到 feature flag 和异步线程池之后，能够降低其对主提交路径的干扰，并给生产环境提供更保守的默认行为。  
  对大规模写入、UC 环境、元数据提交延迟敏感场景，这类改动通常有助于：
  - 降低写路径抖动；
  - 将观测功能与核心事务路径解耦；
  - 为后续逐步默认开启指标采集创造条件。  
- **类别**: 存储提交路径优化 / 稳定性治理

---

## 4. 社区热点

> 当前数据中评论数均显示为 `undefined`，因此以下热点基于“近期更新频率、功能范围、技术影响面”综合判断。

### 热点 1：Delta Kernel 建表能力继续补齐，评论/描述元数据成为缺口
- **Issue**: #6473 `[enhancement, delta-kernel] [Feature Request] Kernel to support Description/Comments`  
- **链接**: delta-io/delta Issue #6473  
- **核心诉求**:  
  当前 `CreateTableTransactionBuilder` 无法设置表描述（description/comment），导致用户在 `CREATE TABLE ... COMMENT 'x'` 场景下，即使 DSv2 路径拿到了 `DDLRequestContext.comment()`，也**无法把 comment 写入 Delta log**。  
- **背后技术信号**:
  - Delta 正在补齐 **DSv2 → Kernel → Delta Log** 的建表元数据闭环；
  - 当前重点已不再只是“能建表”，而是“能完整保留 SQL DDL 语义”；
  - 这对 Spark SQL 兼容性、Catalog 一致性、外部引擎接入都很关键。  
- **相关 PR**:
  - #6449 `Add CreateTableBuilder + V2Mode routing + integration tests`
  - #6450 `Wire DeltaCatalog.createTable() to DSv2 + Kernel path`

### 热点 2：Flink Sink 的 Kernel 化路线仍在持续推进
- **Issue**: #5901 `[delta-kernel] [Flink] Create Delta Kernel based Flink Sink`  
- **链接**: delta-io/delta Issue #5901  
- **核心诉求**:  
  这是一个 epic，记录基于 Delta Kernel 构建 Flink Sink 所需的全部改动，说明社区对 **Flink 原生/更轻量 Delta 写入接入**有明确需求。  
- **背后技术信号**:
  - Delta Kernel 正被定位为跨执行引擎的核心抽象层；
  - Flink Sink 是 Delta 拓展流式生态的重要落点；
  - 若该 epic 顺利推进，Delta 将进一步强化在多引擎实时写入场景下的生态竞争力。  
- **路线图意义**: 高，且大概率属于中期持续投入方向。

### 热点 3：kernel-spark CDC 流式读取堆叠 PR 进入系统化收尾阶段
- **代表 PR**:
  - #6075 `[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)`
  - #6076 `[kernel-spark][Part 2] CDC commit processing`
  - #6336 `[Part 3] finish wiring up incremental change processing`
  - #6359 `[Part 4] CDC data reading`
  - #6362 `[Part 5] CDC schema coordination`
  - #6363 `[Part 6] End-to-end CDC streaming integration tests`
  - #6370 `[Part 7] DV+CDC same-path pairing and DeletionVector support`
  - #6388 `allowOutOfRange for CDC startingVersion`
  - #6391 `CDC admission limits for commit processing`
- **链接**: 对应各 delta-io/delta PR 编号  
- **技术分析**:  
  这是一条非常清晰的大功能主线，涉及：
  - 初始快照与 offset 管理；
  - 增量 commit 的 CDC 处理；
  - schema 协调；
  - 端到端测试；
  - CDC 与 Deletion Vector 联动；
  - `startingVersion` 边界容忍。  
  这说明 Delta 正在系统推进 **Kernel + Spark DSv2 流式 CDC** 的生产可用性。对于依赖 CDF/CDC 的实时数仓、增量同步、审计管道用户，这是最值得持续关注的方向之一。

### 热点 4：UniForm 原子提交能力扩展
- **PRs**:
  - #6474 `[UniForm] Support commit with UniForm metadata atomically for CC supported table`
  - #6475 `[UniForm] Support commit with UniForm metadata atomically for UCCommitCoordinatorClient`
- **链接**:
  - delta-io/delta PR #6474
  - delta-io/delta PR #6475
- **技术诉求**:  
  两个 PR 指向同一目标：让 UniForm 元数据与提交过程实现**原子一致性**，分别覆盖 CC supported table 与 UCCommitCoordinatorClient 场景。  
- **意义**:
  - 直接关系多格式元数据一致性；
  - 对跨系统查询可见性和提交正确性有较高价值；
  - 若落地成熟，将增强 Delta 在开放表格式互操作场景下的可靠性。

---

## 5. Bug 与稳定性

### 高优先级：CDC / Streaming 正确性与边界行为仍在持续打磨
虽然今日没有新增明确标注为 bug 的 issue，但从一组活跃 PR 可推断，**CDC 流式链路仍是稳定性与正确性治理重点**：

#### A. `startingVersion` 越界容忍
- **PR**: #6388 `[kernel-spark] Support allowOutOfRange for CDC startingVersion in DSv2 streaming`
- **链接**: delta-io/delta PR #6388  
- **风险点**:  
  若用户指定的 CDC 起始版本超出可读范围，流式任务启动行为可能不一致或不符合预期。  
- **状态**: 有修复/增强 PR 在推进

#### B. CDC commit 处理 admission limits
- **PR**: #6391 `[kernel-spark][Part 2.5] CDC admission limits for commit processing`
- **链接**: delta-io/delta PR #6391  
- **风险点**:  
  说明 commit 处理过程中可能存在资源控制、吞吐边界或处理批次上的稳定性问题。  
- **状态**: 有修复/增强 PR 在推进

#### C. DV 与 CDC 同路径配对支持
- **PR**: #6370 `[kernel-spark][Part 7] DV+CDC same-path pairing and DeletionVector support`
- **链接**: delta-io/delta PR #6370  
- **风险点**:  
  Deletion Vector 与 CDC 同时存在时，若文件配对或语义处理不完整，容易引发查询正确性问题。  
- **状态**: 有 fix/功能完善 PR 在推进

### 中优先级：遗留 checkpoint 兼容逻辑
- **PR**: #6479 `Use MD5 fileIdHash for priming getBatch when both offsets are from legacy checkpoint`
- **链接**: delta-io/delta PR #6479  
- **问题性质**:  
  该变更表明在“两个 offset 都来自 legacy checkpoint”的情况下，`getBatch` 预热/匹配逻辑可能需要特殊处理。  
- **技术判断**:  
  这是典型的**向后兼容 + 流式状态恢复**问题，若处理不好，可能影响 checkpoint 恢复稳定性。  
- **状态**: 已有针对性修复 PR

### 中低优先级：测试稳定性治理
- **PR**: #6446 `Gate UC tests behind UC Spark version checks`
- **链接**: delta-io/delta PR #6446  
- **问题性质**:  
  说明 UC 相关测试在不同 Spark 版本下存在不兼容或不稳定风险，需要通过版本检查进行 gating。  
- **状态**: 修复中  
- **影响**:  
  主要影响 CI 稳定性与跨版本验证质量，不一定直接影响用户生产环境，但会拖慢功能交付节奏。

---

## 6. 功能请求与路线图信号

### 1) Kernel 支持表 Description/Comments
- **Issue**: #6473  
- **链接**: delta-io/delta Issue #6473  
- **判断**: **较大概率进入后续版本**
- **原因**:
  - 已有直接使用场景：`CREATE TABLE ... COMMENT`
  - 与现有 DSv2 建表 PR（#6449、#6450）高度耦合
  - 属于 SQL DDL 语义完整性缺失，不是边缘需求

### 2) 基于 Delta Kernel 的 Flink Sink
- **Issue**: #5901  
- **链接**: delta-io/delta Issue #5901  
- **判断**: **中高概率持续推进，但未必短期完成**
- **原因**:
  - 为 epic 级任务，范围较大
  - 与 Delta Kernel 战略定位高度一致
  - 生态价值高，但实施链路长、依赖面广

### 3) DSv2 + Kernel 建表链路正在从“可用”走向“完备”
- **PRs**:
  - #6449
  - #6450
- **链接**:
  - delta-io/delta PR #6449
  - delta-io/delta PR #6450  
- **判断**: **高概率进入下一批功能交付**
- **路线图意义**:
  - DeltaCatalog.createTable 走向 DSv2 + Kernel
  - 说明 Delta 正在重塑 Spark 侧建表与 catalog 接入路径
  - 后续大概率继续补齐 comment、properties、schema/constraint 等 DDL 元数据

### 4) Snapshot 值语义比较
- **PR**: #6477 `[Kernel][Spark] Add value-based equals/hashCode to Snapshot`
- **链接**: delta-io/delta PR #6477  
- **判断**: **偏基础设施增强，较可能合入**
- **意义**:
  - 有助于缓存、测试断言、对象判等与状态管理
  - 对 kernel/spark 集成质量与内部 API 一致性有价值

### 5) 移除不再需要的隐式转换配置
- **PR**: #6478 `Remove ALLOW_IMPLICIT_CASTS conf as it's no longer needed`
- **链接**: delta-io/delta PR #6478  
- **判断**: **可能是行为收敛信号**
- **意义**:
  - 说明某些历史兼容开关正在被淘汰
  - 项目倾向于减少不必要配置分叉，简化类型转换行为

---

## 7. 用户反馈摘要

基于今日 issue/PR 摘要，可提炼出以下真实用户痛点与使用场景：

### 1) 用户希望 SQL DDL 语义完整保留，而不仅是“表能创建成功”
- **来源**: #6473  
- **链接**: delta-io/delta Issue #6473  
- **反馈本质**:  
  当用户通过 Spark SQL/DSv2 执行 `CREATE TABLE COMMENT` 时，comment 已经在上层语义中存在，但在 Delta log 落盘时丢失。  
- **反映的问题**:
  - 用户越来越关注 catalog 元数据一致性；
  - Delta 与 Spark SQL 的契合点，正从执行成功扩展到“元数据不丢失”。

### 2) 流式 CDC 用户更关注边界行为与恢复一致性
- **来源**: #6075、#6076、#6336、#6388、#6391、#6370、#6479  
- **链接**: 对应 PR 编号  
- **反馈本质**:
  - 起始版本越界怎么办；
  - legacy checkpoint 如何兼容；
  - DV 与 CDC 共存时如何保证正确；
  - commit 处理如何限制资源与吞吐。  
- **反映的问题**:
  - Delta 的 CDC 用户场景已进入更复杂、更生产化阶段；
  - 用户不只要“能读”，更要“可恢复、可控、可解释”。

### 3) 多引擎生态用户期待 Kernel 继续成为统一接入层
- **来源**: #5901、#6449、#6450、#6473  
- **链接**: 对应 Issue / PR 编号  
- **反馈本质**:  
  无论是 Flink Sink，还是 Spark DSv2 建表，用户都在推动 Delta Kernel 承担更完整的引擎中立能力。  
- **反映的问题**:
  - 生态整合是现实需求；
  - Kernel 的能力边界正在从“读取/事务基础”扩展到“DDL、写入、流式”。

---

## 8. 待处理积压

### 1) Flink Sink epic 仍需维护者持续关注
- **Issue**: #5901 `[delta-kernel] [Flink] Create Delta Kernel based Flink Sink`
- **链接**: delta-io/delta Issue #5901  
- **现状**: 创建于 2026-01-21，今日仍在更新，但评论数为 0。  
- **提醒**:  
  这是高战略价值议题，虽然有项目跟踪表，但如果缺少明确里程碑验收标准、依赖拆解与 reviewer 节奏，容易演变成长周期积压。

### 2) kernel-spark CDC 堆叠 PR 链较长，存在 review/合并阻塞风险
- **代表 PRs**: #6075、#6076、#6336、#6359、#6362、#6363、#6370、#6388、#6391  
- **链接**: 对应 delta-io/delta PR 编号  
- **现状**: 多个 PR 从 2 月、3 月持续更新至今，说明功能复杂且耦合较强。  
- **提醒**:
  - 堆叠链越长，越容易出现 rebasing 成本高、review 分散、CI 反复波动的问题；
  - 建议维护者优先梳理最小可合入切片，降低长尾积压。

### 3) DSv2 + Kernel 建表链路仍待最终闭环
- **PRs / Issue**:
  - #6449
  - #6450
  - #6473
- **链接**:
  - delta-io/delta PR #6449
  - delta-io/delta PR #6450
  - delta-io/delta Issue #6473  
- **现状**: 路由与 builder 已推进，但 comment/description 仍缺失。  
- **提醒**:  
  若该链路在“建表成功但元数据不完整”的状态下长期存在，可能影响用户对 DSv2 路径的信心。

### 4) UC 测试 gating 表明跨版本兼容维护成本正在上升
- **PR**: #6446
- **链接**: delta-io/delta PR #6446  
- **提醒**:  
  测试按 Spark 版本 gating 虽能短期止血，但中长期仍需明确：
  - 哪些 UC 能力在哪些 Spark 版本正式支持；
  - 是否存在兼容矩阵文档缺口；
  - 是否需要拆分测试层级降低 CI 噪音。

---

## 附：项目健康度结论

- **活跃度**: 高，PR 更新密集  
- **交付节奏**: 中高，存在大功能堆叠开发特征  
- **主要方向**:
  1. Delta Kernel 与 Spark DSv2 深度集成  
  2. CDC/Streaming 正确性与边界增强  
  3. UniForm/UC 提交一致性与可观测性  
  4. Flink 生态接入  
- **风险点**:
  - 长链路 stacked PR review 压力较高
  - CDC 生产级复杂场景仍在持续打磨
  - 多版本 UC 测试兼容性需要持续治理

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合发内部群的 1 页简版**
2. **适合周报汇总的表格版**
3. **带“风险等级/优先级”标记的研发管理版**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-04-03）

## 1. 今日速览

过去 24 小时 Databend 保持中高活跃度：Issues 更新 5 条、PR 更新 14 条，虽然没有新版本发布，但查询引擎、存储估算、Flashback 元数据一致性、Join 执行路径等多个核心方向都在同步推进。  
从关闭/收敛情况看，今天有 2 个 Issue 关闭、4 个 PR 合并或关闭，说明团队对回归缺陷和执行层稳定性响应较快。  
技术焦点主要集中在三类：**Join 能力增强与正确性修复**、**历史快照/Flashback 元数据一致性**、**存储层 block size 估算准确性**。  
同时，多个仍在进行中的 PR 体现出较明确的路线图信号：Databend 正持续向更复杂的 OLAP 查询场景、低内存稳定性和更强文件格式兼容能力演进。  

---

## 2. 项目进展

### 已关闭 / 已收敛的重要 PR

#### 1) 修复字符串共享缓冲导致的 block size 估算膨胀
- PR: #19657 `fix(storage): inflated block size estimation caused by shared string buffers`
- 状态: CLOSED
- 链接: databendlabs/databend PR #19657

这是今天最明确的存储层稳定性修复之一。该 PR 修正了可变长数据，尤其是 `STRING` 列在共享 buffer 场景下的 block size 估算错误，避免统计信息显著偏大。  
它直接对应已关闭 Issue：
- Issue: #19658 `[C-bug] bug: inflated block size estimation by string`
- 链接: databendlabs/databend Issue #19658

**影响分析：**
- 改善 block 统计准确性；
- 降低优化器、存储层、集群调度因错误 size 估算而产生的误判；
- 对大文本列、高重复字符串数据写入场景尤为重要。

---

#### 2) 修复 IEJoin 在空结果 outer fill 场景下的 panic
- PR: #19604 `fix: handle empty IEJoin outer fill`
- 状态: CLOSED
- 链接: databendlabs/databend PR #19604

该修复处理了 IEJoin/range join 在 unmatched inner side 无数据块时的 outer-fill panic，避免因为访问空 inner block 而触发崩溃。对应关闭 Issue：
- Issue: #19569 `IEJoin (range join) index out of bounds on empty result`
- 链接: databendlabs/databend Issue #19569

**推进意义：**
- 提升 range join / IEJoin 的健壮性；
- 修复空结果边界条件下的查询崩溃；
- 对 SQL 兼容性和复杂 join 正确性是正向补强。

---

#### 3) Equi ASOF JOIN 加速尝试结束，方案未直接落地
- PR: #19654 `feat: speed up equi ASOF joins`
- 状态: CLOSED
- 链接: databendlabs/databend PR #19654

该 PR 尝试在存在等值键时复用 hash-join 路径加速 `ASOF JOIN`，同时保持 binder rewrite 后 LEFT/RIGHT 语义不被破坏。虽然本次已关闭，未见合并，但它反映出团队正在探索**将特殊 join 类型映射到更成熟执行路径**的优化方向。

---

#### 4) Table branch 重构 PR 关闭
- PR: #19499 `refactor: table branch refactor`
- 状态: CLOSED
- 链接: databendlabs/databend PR #19499

该 PR 本身没有更多公开摘要细节，但从关闭动作看，branch/table 元数据相关重构可能仍在调整方案，值得与当前 Flashback / create branch 元数据一致性问题一起观察。

---

## 3. 社区热点

### 热点 1：Skew Join 支持需求升温
- Issue: #18546 `feature: support skew join`
- 状态: OPEN
- 评论: 2 / 👍 1
- 链接: databendlabs/databend Issue #18546

这是今天从“技术价值”看最值得关注的功能请求。用户指出在 join key 数据倾斜时，Databend 会出现**节点间严重内存倾斜**，并提出可借鉴 runtime filter 的实现思路，对 hot value 做识别与特殊处理。

**背后技术诉求：**
- OLAP 集群场景下，热点 key 会导致部分节点 build/probe 压力集中；
- 这不是单纯性能问题，更会诱发 spill、OOM、任务长尾和资源利用不均；
- 该需求与当前在推进中的 join 能力增强 PR 明显呼应：
  - PR #19553 `support partitioned hash join`
  - 链接: databendlabs/databend PR #19553

这说明 Databend 在 join 执行框架层面正处于增强阶段，未来 skew join 有机会被纳入更大 Join 优化路线图。

---

### 热点 2：Flashback / Time Travel 元数据一致性
- Issue: #19661 `[C-bug] bug: Flashback Metadata Inconsistency`
- 状态: OPEN
- 链接: databendlabs/databend Issue #19661

- PR: #19653 `fix(query): guard metadata consistency for flashback, time travel, and DDL column operations`
- 状态: OPEN
- 链接: databendlabs/databend PR #19653

该问题虽然评论不多，但技术风险很高。问题描述指出：`ALTER TABLE ... FLASHBACK TO` 回退到历史 snapshot 后，依赖 schema 的元数据——包括 bloom index、policy、index、cluster key、constraints——可能与回退后的 schema 不一致，从而引发：
- 写入失败
- 查询报错
- 静默数据损坏

**技术解读：**
这是典型的“历史版本数据恢复”与“派生元数据同步回滚”不完整导致的一致性缺陷。Databend 正在通过 #19653 补强 flashback、time travel、create branch 及列级 DDL 操作下的元数据守护逻辑，属于高优先级修复方向。

---

### 热点 3：Select 输出规划统一与窗口/聚合复用
- PR: #19618 `refactor(sql): unify select output planning and preserve aggregate reuse in window analysis`
- 状态: OPEN
- 链接: databendlabs/databend PR #19618

这是今天最核心的 SQL/Planner 重构 PR 之一。该 PR 统一 SELECT 输出规划，覆盖 Projection、ORDER BY、DISTINCT 和 Dataframe 输出应用，同时保留窗口分析中的 aggregate reuse。

**背后技术价值：**
- 降低 planner 中多条输出路径分叉带来的语义不一致；
- 改善复杂 SQL 中聚合/窗口函数的复用能力；
- 可能减少重复计算，提升计划稳定性和可维护性。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1：Flashback 元数据不一致，可能导致写失败、查询错误或静默损坏
- Issue: #19661
- 链接: databendlabs/databend Issue #19661
- Fix PR: #19653（OPEN）
- 链接: databendlabs/databend PR #19653

**严重性判断：高**  
原因在于该问题涉及 schema-dependent metadata 与历史快照恢复的一致性，且明确提到可能引发**silent data corruption**。这类问题优先级通常高于普通性能或 panic 修复。

---

### P1：优化器常量折叠错误使用默认 FunctionContext，可能忽略 session 语义
- Issue: #19656 `Optimizer constant folding uses FunctionContext::default() instead of session context`
- 状态: OPEN
- 链接: databendlabs/databend Issue #19656

**严重性判断：高**  
该问题意味着优化阶段常量折叠可能未使用实际 session context，导致依赖 session 设置的表达式在“优化期”和“执行期”语义不一致。  
这属于典型的**查询正确性风险**，尤其对 datetime、时区、格式解析、兼容性开关等函数语义敏感场景影响较大。当前数据中尚未看到对应 fix PR。

---

### P2：字符串列导致 block size 估算膨胀
- Issue: #19658
- 状态: CLOSED
- 链接: databendlabs/databend Issue #19658
- Fix PR: #19657（CLOSED）
- 链接: databendlabs/databend PR #19657

**严重性判断：中高**  
虽然不一定直接造成错误结果，但会影响：
- block 统计；
- 资源估算；
- 调度与执行策略；
- 大字符串列写入性能表现。  
该问题已快速闭环，响应较及时。

---

### P2：IEJoin 空结果触发 index out of bounds panic
- Issue: #19569
- 状态: CLOSED
- 链接: databendlabs/databend Issue #19569
- Fix PR: #19604（CLOSED）
- 链接: databendlabs/databend PR #19604

**严重性判断：中高**  
此问题会直接导致查询 panic，但触发条件相对边界化，主要发生在空结果 outer-fill 组合路径。现已修复，显示 join 边界测试在持续补强。

---

### P3：广播 Join + Merge-Limit build 执行路径兼容性问题
- PR: #19652 `fix(query): support broadcast join with merge-limit build`
- 状态: OPEN
- 链接: databendlabs/databend PR #19652

**严重性判断：中**  
虽然当前未在 Issue 中单独列出，但从 PR 摘要可见，Databend 仍在修复 cluster execution 下广播 join 与 `Broadcast(Limit(Merge(Limit(Scan))))` 计划组合时的 fragment/source relationship 问题。  
这类问题通常影响分布式执行计划正确性与稳定性。

---

## 5. 功能请求与路线图信号

### 1) Skew Join 可能成为下一阶段 Join 优化重点
- Issue: #18546
- 链接: databendlabs/databend Issue #18546
- 关联 PR: #19553 `support partitioned hash join`
- 链接: databendlabs/databend PR #19553

Databend 已在推进 partitioned hash join，而用户已明确提出 skew join 需求，二者组合说明 Join 执行器正在向更复杂、更贴近生产数据分布的方向演进。  
**判断：有较高概率进入后续版本规划。**

---

### 2) CSV/TEXT 编码支持具备较强落地可能
- PR: #19660 `feat: CSV/TEXT support encoding`
- 状态: OPEN
- 链接: databendlabs/databend PR #19660

该 PR 为 stage 读取 CSV/TEXT 增加 charset decoding 和最小化 decoding error policy。  
**意义：**
- 提高外部文本文件导入兼容性；
- 覆盖非 UTF-8 数据源；
- 对企业存量数据接入非常关键。  
**判断：非常像可直接进入下一版本的实用功能。**

---

### 3) 自动 datetime 格式检测增强 SQL 兼容性
- PR: #19659 `feat(sql): add AUTO datetime format detection`
- 状态: OPEN
- 链接: databendlabs/databend PR #19659

该特性新增 session setting `enable_auto_detect_datetime_format`，在关闭默认值前提下提供可控的非 ISO datetime 自动识别。  
**判断：**
- 有利于提升数据导入和 SQL 易用性；
- 由于涉及解析语义，默认关闭是稳妥策略；
- 若与 #19656 的 FunctionContext/session 语义问题一起处理，落地价值更高。

---

### 4) 低内存查询 spill backoff 反映资源治理路线
- PR: #19655 `feat(query): add spill backoff with sleep for low-memory queries under global pressure`
- 状态: OPEN
- 链接: databendlabs/databend PR #19655

这说明 Databend 不仅关注“能否 spill”，也开始关注**在全局内存压力下，不同查询之间的公平性与系统总吞吐**。  
**判断：这是面向多租户/混合负载场景的重要工程信号。**

---

### 5) Geometry 聚合函数支持扩展分析能力边界
- PR: #19620 `feat(query): Support Geometry aggregate functions`
- 状态: OPEN
- 链接: databendlabs/databend PR #19620

该 PR 为 geometry 增加 scalar 与 aggregate functions，并实现 overlay pipeline。  
**判断：**
- 体现 Databend 正向空间分析等更复杂分析场景扩展；
- 若合入，将明显增强其 SQL 分析函数覆盖面。

---

## 6. 用户反馈摘要

结合今日 Issues，可提炼出几个真实用户痛点：

### 1) 大规模 Join 的资源倾斜仍是生产痛点
- 参考: #18546
- 链接: databendlabs/databend Issue #18546

用户反馈集中在**join key 热点值导致节点内存严重倾斜**。这说明 Databend 已能支撑较大规模分布式 join，但在极端分布下的鲁棒性仍需提升。

---

### 2) 历史回溯功能已进入更严肃的生产使用阶段
- 参考: #19661
- 链接: databendlabs/databend Issue #19661

Flashback/Time Travel 的问题不是“功能不可用”，而是用户已经在实际使用这些能力，并开始暴露 schema 回退与附属元数据同步的复杂一致性问题。  
这类反馈通常意味着相应功能正从“可用”走向“生产级可靠”。

---

### 3) 优化器与执行器语义一致性被用户关注
- 参考: #19656
- 链接: databendlabs/databend Issue #19656

用户已不满足于“查询能跑”，而开始关注 session setting 在优化期是否被正确继承。这是成熟用户群体常见诉求，说明 Databend 的使用深度在增加。

---

### 4) 文本大字段与外部文件兼容性需求明显
- 参考:
  - #19658 存储 block size 问题
  - #19660 CSV/TEXT 编码支持
- 链接:
  - databendlabs/databend Issue #19658
  - databendlabs/databend PR #19660

这反映出用户既在处理超大字符串字段，也在接入非标准编码文本文件。Databend 的数据接入与文本列处理能力正面临更多真实业务压力。

---

## 7. 待处理积压

以下条目建议维护者重点关注：

### 1) #18546 support skew join
- 状态: OPEN
- 创建时间: 2025-08-17
- 更新: 2026-04-02
- 链接: databendlabs/databend Issue #18546

这是明显的长期需求，且对分布式 Join 性能、资源均衡、稳定性都有直接影响。考虑到已有 partitioned hash join 路线，建议将其纳入 Join 执行框架统一规划。

---

### 2) #19553 support partitioned hash join
- 状态: OPEN
- 创建时间: 2026-03-16
- 更新: 2026-04-02
- 链接: databendlabs/databend PR #19553

这是与 skew join、分区执行、内存治理高度相关的基础性 PR。若迟迟不推进，多个 join 优化方向的后续能力可能都会受阻。

---

### 3) #19618 unify select output planning
- 状态: OPEN
- 创建时间: 2026-03-25
- 更新: 2026-04-03
- 链接: databendlabs/databend PR #19618

这是 SQL planner 层的重要重构，影响面广。建议维护者优先明确 review 结论，因为它关系到 projection/order/distinct/window 等多个路径的统一性与可维护性。

---

### 4) #19644 extract optional query paths into support crates
- 状态: OPEN
- 创建时间: 2026-03-30
- 更新: 2026-04-02
- 链接: databendlabs/databend PR #19644

该 PR 涉及 query 模块可选路径拆分与 feature gate 调整，属于架构整理型工作。虽然不一定最紧急，但对构建裁剪、模块边界和后续维护成本有长期影响。

---

## 8. 健康度结论

今日 Databend 项目整体健康度良好。  
一方面，团队对已报告的存储估算错误和 IEJoin 崩溃问题给出了快速闭环；另一方面，仍有两个值得重点警惕的高风险方向：**Flashback 元数据一致性**与**优化器常量折叠上下文不一致**。  
从 PR 结构看，Databend 当前明显处于“核心引擎持续加固 + 功能边界扩展”并行阶段：既在修正确性与执行细节，也在推进 geometry、文件编码、trace 调试、低内存治理等能力。  
如果接下来 #19653、#19618、#19553 等关键 PR 能顺利推进，Databend 在 OLAP 生产场景中的查询鲁棒性和复杂 SQL 支持度有望进一步提升。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-04-03）

## 1. 今日速览

过去 24 小时内，Velox 社区保持了**较高活跃度**：Issues 更新 6 条、PR 更新 50 条，说明项目仍处于快速迭代状态，重点集中在 **CI 稳定性、flaky test 治理、cuDF/GPU 扩展、类型系统与 cast 规则重构**。  
今日没有新版本发布，但从已合并 PR 看，维护者正持续清理基础设施问题，尤其是 **CI 权限、测试可观测性、线程安全与第三方依赖升级**。  
值得注意的是，最近新增和活跃问题中，**测试不稳定、spill/序列化相关偶发失败、Spark 兼容性偏差**占比偏高，显示当前项目的主要工程压力仍在**稳定性与跨引擎一致性**。  
另一方面，cuDF 相关 PR 和 Issue 持续推进，表明 **GPU 执行覆盖率提升** 已成为下一阶段的重要路线之一。

---

## 2. 项目进展

### 今日已合并/关闭的重要 PR

#### 2.1 CI 工作流权限修复，支撑自动化反馈能力
- **PR #17021** `build(ci): Grant pull-requests write permission to Linux build workflow`  
  链接: facebookincubator/velox PR #17021

该 PR 已合并，给 Linux build workflow 增加 `pull-requests: write` 权限，使可复用 workflow 能够在 PR 上回写结果。  
**意义**：这是对前序 CI 能力建设的重要补完，直接支撑失败测试自动评论、错误注解等功能，提升 PR 审阅效率和问题闭环速度。  
结合已合并的 **PR #17003**（flaky test retry + JUnit XML reporting），可以看出维护团队正在系统性改善 **CI 信噪比与失败定位效率**。

---

#### 2.2 Perfetto SDK 升级，增强 tracing 基础设施兼容性
- **PR #17004** `build: Update perfetto SDK to v54`  
  链接: facebookincubator/velox PR #17004

该 PR 已合并，升级 Perfetto SDK 至 v54，并针对 GCC 13 在更新后的头文件上触发的 `-Warray-bounds`、`-Wstringop-overflow` 警告做了专门抑制。  
**意义**：  
- 有助于维护 tracing/性能分析基础设施的现代化；  
- 体现 Velox 在工具链升级（尤其 GCC 13）场景下的兼容性维护；  
- 对生产排障和性能剖析生态是正向投入。

---

#### 2.3 cuDF 输出 batching 优化已合并，降低 GPU→CPU 同步成本
- **PR #16620** `fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs`  
  链接: facebookincubator/velox PR #16620

该 PR 已合并，重构 `CudfToVelox` 输出批处理逻辑，避免此前与批次数相关的 O(n) 级 device-to-host copy / stream sync 开销。  
**推进点**：  
- 直接改善 GPU 执行链路的数据出栈效率；  
- 对大 batch 输出场景尤为关键；  
- 是 Velox-cuDF 走向更高吞吐的重要基础优化。

---

#### 2.4 Connector 注册表线程安全改造完成
- **PR #16978** `refactor: Add thread safety to connector registry`  
  链接: facebookincubator/velox PR #16978

已合并。将 connector registry 包装为 `folly::Synchronized`，并使用 `folly::F14FastMap` 替代 `std::unordered_map`。  
**意义**：  
- 提升多线程环境下 connector 注册/查找的安全性；  
- 有助于避免并发访问下的潜在竞态；  
- 为后续 connector API 收敛和生产代码迁移（见 PR #16986）铺路。

---

#### 2.5 一个构建问题 Issue 已闭环
- **Issue #16995** `fix(build): velox_hive_connector_test missing GTest::gmock link dependency`  
  链接: facebookincubator/velox Issue #16995

该问题已关闭，表明 Hive connector 测试目标缺失 `GTest::gmock` 依赖导致的构建失败已得到处理。  
**意义**：构建系统边缘问题虽小，但会直接影响开发者本地/CI 编译体验，及时关闭有助于降低贡献门槛。

---

## 3. 社区热点

### 3.1 Spark 聚合 fuzzer 持续失败，暴露跨引擎一致性问题
- **Issue #16327** `[bug, fuzzer-found] Scheduled Spark Aggregate Fuzzer failing`  
  链接: facebookincubator/velox Issue #16327

这是当前最值得关注的活跃问题之一，评论数最高（12）。问题指向 **Spark 与 Velox 在 `ARRAY<TIMESTAMPS>` 场景下的聚合行为不一致**。  
**技术诉求分析**：  
- 用户/维护者关注的并非单点 crash，而是**查询正确性**；  
- fuzzer 持续失败意味着问题可能隐含在聚合语义、时间类型表示、空值/时区处理或序列化比较逻辑中；  
- 与当前多项时间类型、timestamp unit、Spark 兼容 PR 形成呼应，说明 **Velox 在“多执行引擎语义对齐”上仍有系统性工作量**。

---

### 3.2 cuDF 覆盖率扩展仍是长期热点
- **Issue #15772** `[enhancement] [cuDF] Expand GPU operator support for Presto TPC-DS`  
  链接: facebookincubator/velox Issue #15772

该 Issue 长期活跃，评论数 11。其核心诉求是：在 Presto TPC-DS SF100、单 worker、开启 cuDF backend 和 CPU fallback 的配置下，仍有不少查询因 **GPU operator 缺失**回退到 CPU。  
**技术诉求分析**：  
- 社区关注点正从“能不能跑”转向“能否保持整条 pipeline 在 GPU 上连续执行”；  
- 今日/近期多个 cuDF PR（如 NestedLoopJoin、EnforceSingleRow、count 聚合、timestamp unit 配置）都与该 Issue 强相关；  
- 这表明 GPU 执行并非试验性边缘能力，而是在逐步向 **TPC-DS 可用性与性能闭环**推进。

---

### 3.3 CI flaky test 治理成为基础设施主线
- **Issue #17014** `[bug, flaky-test] [CI] Flaky test: LocalPartitionTest.earlyCancelation`  
  链接: facebookincubator/velox Issue #17014
- **Issue #16901** `[bug, triage, flaky-test] Flaky test: CountIfAggregationTest ...`  
  链接: facebookincubator/velox Issue #16901
- **PR #17015** `feat(ci): Add test failure reporting with PR comments and error annotations`  
  链接: facebookincubator/velox PR #17015
- **PR #17003** `feat(ci): Add flaky test retry and JUnit XML reporting`  
  链接: facebookincubator/velox PR #17003

从问题与 PR 组合看，Velox 正在从两个方向并行治理 flaky test：  
1. **根因修复**：定位 race condition、文件读写/反序列化异常等真实缺陷；  
2. **工程缓冲**：失败重试、失败测试名提取、PR 评论回写、注解展示。  

这说明维护团队对 CI 质量的判断已经从“是否通过”升级为“是否可解释、可定位、可恢复”。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1 - 查询正确性 / 语义一致性

#### 4.1 Spark 聚合 Fuzzer 持续失败
- **Issue #16327**  
  链接: facebookincubator/velox Issue #16327

**问题类型**：查询正确性 / Spark 兼容性  
**症状**：Scheduled Spark Aggregate Fuzzer 在 `ARRAY<TIMESTAMPS>` 场景持续失败，Velox 与 Spark 结果不一致。  
**影响**：高。涉及跨引擎结果一致性，是分析引擎最敏感的问题之一。  
**是否已有 fix PR**：**未明确看到直接修复 PR**。但与时间精度、timestamp unit、AggregationFuzzer 健壮性相关 PR 可能提供旁路支撑：  
- **PR #17018** `fix: SIGSEGV in AggregationFuzzer when reference query returns empty result vector`  
  链接: facebookincubator/velox PR #17018  
- **PR #16769** `feat(cudf): Add config to set timestamp unit`  
  链接: facebookincubator/velox PR #16769

---

### P1 - 数据损坏/序列化异常导致的 flaky failure

#### 4.2 TempFilePath 初始化顺序 bug，导致 spill 反序列化损坏
- **PR #17020** `[OPEN] fix: TempFilePath fd_ member initialization order bug causing flaky test failures`  
  链接: facebookincubator/velox PR #17020
- **PR #17019** `[CLOSED] 同主题旧 PR`  
  链接: facebookincubator/velox PR #17019

**问题类型**：稳定性 / 文件句柄生命周期 / spill 读写  
**症状**：约 0.75% 概率出现 “Received corrupted serialized page” 错误。  
**根因**：`fd_` 与 `tempPath_` 成员声明顺序和构造时机不一致。  
**影响**：高。虽然触发概率不高，但错误表征为**序列化页损坏**，容易误导排障并影响 spill 可靠性。  
**是否已有 fix PR**：**有，PR #17020 正在推进**。

---

### P2 - CI race condition / 任务取消逻辑不稳定

#### 4.3 `LocalPartitionTest.earlyCancelation` 持续 flaky
- **Issue #17014**  
  链接: facebookincubator/velox Issue #17014

**问题类型**：并发竞态 / 任务取消  
**症状**：merge-to-main CI 上 GCC Linux 环境过去一周约每 5-6 次运行失败一次。  
**影响**：中高。主要影响 CI 可靠性，但其根因若存在于真实任务取消路径，也可能影响生产行为。  
**是否已有 fix PR**：**暂无直接 fix PR**。

---

### P2 - 聚合测试读取异常，疑似 I/O 或状态损坏

#### 4.4 `CountIfAggregationTest` 读超大字节数异常
- **Issue #16901**  
  链接: facebookincubator/velox Issue #16901

**问题类型**：flaky test / 读取越界或状态错乱  
**症状**：尝试读取 875705136 bytes，而 source 剩余仅 2404 bytes。  
**影响**：中高。现阶段体现为测试波动，但异常数值非常大，提示可能存在反序列化长度字段损坏、缓冲区状态错乱或内存污染。  
**是否已有 fix PR**：**未看到直接 fix PR**；可与 `TempFilePath` 修复方向一起关注。

---

### P3 - Fuzzer 稳健性问题

#### 4.5 AggregationFuzzer 空结果向量导致 SIGSEGV
- **PR #17018**  
  链接: facebookincubator/velox PR #17018

**问题类型**：工具稳定性  
**症状**：reference query 返回空 `vector<RowVectorPtr>` 时，`mergeRowVectors` 未做空检查导致崩溃。  
**影响**：中。主要影响 fuzzing 基础设施，而非直接生产查询执行。  
**是否已有 fix PR**：**有，PR 已提交待合并**。

---

### P3 - 构建系统问题已修复

#### 4.6 Hive connector test 缺失 gmock 依赖
- **Issue #16995**  
  链接: facebookincubator/velox Issue #16995

**问题类型**：构建失败  
**影响**：中低，已关闭。  
**是否已有 fix PR**：**已闭环**。

---

## 5. 功能请求与路线图信号

### 5.1 GPU operator 补齐明显进入集中落地期
- **Issue #15772** `[cuDF] Expand GPU operator support for Presto TPC-DS`  
  链接: facebookincubator/velox Issue #15772

与该需求直接相关的活跃 PR 包括：

- **PR #16942** `feat(cudf): Add GPU NestedLoopJoin (cross join) implementation`  
  链接: facebookincubator/velox PR #16942
- **PR #16920** `feat(cudf): Add CudfEnforceSingleRow GPU operator`  
  链接: facebookincubator/velox PR #16920
- **PR #16522** `fix(cudf): Enable GPU execution for count(*), count(column), and count(NULL)`  
  链接: facebookincubator/velox PR #16522
- **PR #16769** `feat(cudf): Add config to set timestamp unit`  
  链接: facebookincubator/velox PR #16769

**判断**：这些 PR 指向非常一致，说明 **Velox-cuDF 在下一版本周期中大概率会继续扩大 operator 覆盖与语义兼容能力**。  
**路线图信号**：从“补齐单算子”走向“减少 CPU fallback，提升 TPC-DS 端到端 GPU 命中率”。

---

### 5.2 时间类型系统继续扩展
- **Issue #16660** `Support TimeType with microsecond precision that is timezone-unaware`  
  链接: facebookincubator/velox Issue #16660

该需求计划包括：  
- 增加 `TIME_MICRO_UTC` 类型  
- 打通 Velox-Arrow 转换  
- 支持 fuzzer vector generation  
- 支持 DuckDB conversion  
- 增加字符串 cast

**判断**：这不是单点类型添加，而是一个跨组件类型打通任务。若完成，将增强 Velox 在 Arrow/DuckDB 生态及多引擎测试链路中的时间类型兼容性。  
**纳入下一版本可能性**：中高，因其任务项已被拆解且部分完成。

---

### 5.3 SQL 函数与 Presto 兼容性持续推进
- **PR #16048** `feat: Implement array_top_n with transform lambda argument`  
  链接: facebookincubator/velox PR #16048
- **PR #15511** `feat: s2 presto functions`  
  链接: facebookincubator/velox PR #15511

**判断**：  
- `array_top_n(..., lambda)` 属于明确的 Presto Java 功能对齐；  
- S2 几何函数则反映了更复杂地理空间分析能力的扩展需求。  

若这类 PR 顺利推进，Velox 的 **SQL 层表达能力和上层查询引擎适配度**会继续提升。

---

### 5.4 Cast 规则与类型强制转换体系重构
- **PR #17017** `feat: Migrate built-in coercions from kAllowedCoercions to CastRulesRegistry`  
  链接: facebookincubator/velox PR #17017
- **PR #17016** `refactor: Remove isSupportedFromType/isSupportedToType from CastOperator subclasses`  
  链接: facebookincubator/velox PR #17016

**路线图信号**：Velox 正尝试把 cast/coercion 规则收敛到统一注册中心。  
**潜在收益**：  
- 降低重复逻辑；  
- 让自定义类型与内建类型的 cast 规则机制统一；  
- 为未来扩展复杂类型转换、错误诊断和跨引擎语义对齐打基础。

---

## 6. 用户反馈摘要

基于今日活跃 Issue/PR，可归纳出以下真实用户痛点与场景：

### 6.1 用户更在意“结果是否与上游引擎完全一致”
- 代表问题：**Issue #16327**  
  链接: facebookincubator/velox Issue #16327

Spark 聚合 fuzzer 的持续失败说明，用户在引入 Velox 时，不只追求性能，更在意**与 Spark/Presto 等既有语义的严格一致性**。尤其是时间类型、数组嵌套类型、聚合边界行为，都是最容易破坏信任的区域。

---

### 6.2 GPU 用户希望减少 fallback，而不是接受“部分加速”
- 代表问题：**Issue #15772**  
  链接: facebookincubator/velox Issue #15772

从 TPC-DS 场景反馈看，用户期望的是**整条查询 pipeline 尽量驻留 GPU**。只要某些关键 operator 缺失，就会在 Driver Adapter 上 fallback 到 CPU，导致收益打折。  
这也是为何 NestedLoopJoin、EnforceSingleRow、count 变体等看似“边角”算子，实际都非常关键。

---

### 6.3 开发者对 flaky test 容忍度较低，期待更高可解释性
- 代表问题/PR：**Issue #17014、Issue #16901、PR #17015、PR #17003**  
  链接:  
  - facebookincubator/velox Issue #17014  
  - facebookincubator/velox Issue #16901  
  - facebookincubator/velox PR #17015  
  - facebookincubator/velox PR #17003

从最近 CI 改造方向可看出，开发者不仅需要“重试通过”，更需要知道**到底哪个测试失败、为何失败、是否属于已知 flaky case**。  
这类反馈通常来自高频贡献者，反映了项目正从“快速迭代”进入“工程成熟度提升”阶段。

---

### 6.4 构建与跨平台兼容性仍是外部集成方痛点
- 代表项：  
  - **Issue #16995** 构建依赖缺失  
    链接: facebookincubator/velox Issue #16995  
  - **PR #17010** `fix: Fix the folly FastSet and FastMap failure check in MAC`  
    链接: facebookincubator/velox PR #17010

这说明外部用户在 Mac、不同 folly 版本、不同测试目标组合下仍会遇到边缘兼容问题。虽然不一定阻塞主线功能，但会显著影响接入体验。

---

## 7. 待处理积压

以下是建议维护者重点关注的长期或重要积压项：

### 7.1 长期开启的 GPU 路线图 Issue
- **Issue #15772** `[cuDF] Expand GPU operator support for Presto TPC-DS`  
  创建: 2025-12-15  
  链接: facebookincubator/velox Issue #15772

这是明显的路线图级 Issue，已持续数月。虽然已有多个相关 PR 推进，但建议维护者：  
- 定期更新 operator gap 清单；  
- 标注已完成/阻塞项；  
- 补充 benchmark 回归结果。  
否则外部用户较难判断 GPU 支持已达到什么成熟度。

---

### 7.2 较早提出的 S2 函数 PR 仍未落地
- **PR #15511** `feat: s2 presto functions`  
  创建: 2025-11-15  
  链接: facebookincubator/velox PR #15511

该 PR 存续时间较长，反映地理空间函数扩展可能存在设计评审、依赖引入或兼容性争议。若维护者认为方向成立，建议明确：  
- 是否接受该能力进入主仓；  
- 与现有函数框架/依赖策略是否一致；  
- 是否需要拆分为更小 PR 以降低评审成本。

---

### 7.3 `array_top_n` lambda 版本功能 PR 等待推进
- **PR #16048** `feat: Implement array_top_n with transform lambda argument`  
  创建: 2026-01-16  
  链接: facebookincubator/velox PR #16048

这是明确的 SQL 兼容性增强项，且目标清晰（与 Presto Java 对齐）。长期未合并可能说明：  
- lambda 相关实现/性能还有疑问；  
- 需要更多测试覆盖；  
- 或评审资源不足。  
建议尽快给出评审结论，避免兼容性能力长期悬而未决。

---

### 7.4 时间类型扩展 Issue 需要跨组件协同推进
- **Issue #16660** `Support TimeType with microsecond precision that is timezone-unaware`  
  创建: 2026-03-06  
  链接: facebookincubator/velox Issue #16660

虽然不是最老的问题，但其依赖 Arrow、DuckDB、fuzzer、cast 多模块协同，若缺少明确 owner 和阶段性里程碑，容易停留在“部分完成”状态。建议维护者拆分成可追踪子任务并关联 PR。

---

## 8. 健康度判断

**总体健康度：中上，偏工程治理期。**

积极信号：
- PR 活跃度高，且存在连续合并；
- CI 能力、线程安全、工具链升级均有实质推进；
- GPU 路线图与 SQL 兼容性扩展持续有增量。

风险信号：
- flaky test 数量和频率仍值得警惕；
- Spark 兼容性/查询正确性问题尚未完全收敛；
- 一些长期 PR/Issue 仍需要更明确的维护者反馈和路线图管理。

**结论**：Velox 当前处于“功能扩展 + 稳定性收敛”并行阶段。短期看，最值得持续关注的是 **CI/测试稳定性、spill/序列化隐患、Spark 时间语义一致性，以及 cuDF operator 覆盖率**。这些方向若在未来 1-2 个迭代周期内继续推进，项目整体健康度将明显提升。  

如果你愿意，我还可以继续把这份日报整理成：
1. **适合发群的 10 行简版**，或  
2. **面向技术管理者的周报模板**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报 · 2026-04-03

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：Issues 更新 11 条，PR 更新 21 条，说明项目在 **Velox 后端集成、CI/构建体系、Spark 4.0 兼容性** 三条主线上持续推进。  
从关闭/合并情况看，今日已有多项问题得到落地修复，尤其集中在 **CI 依赖缓存、日志治理、AQE 下构建侧选择** 等工程稳定性方向，项目健康度总体较好。  
同时，新报告的问题主要集中在 **时区兼容、Parquet 兼容性、CI 镜像构建限制**，属于典型的跨引擎/跨环境集成问题，且部分已经出现对应修复 PR，响应速度较快。  
整体判断：**活跃度高，工程推进扎实，Velox 路线持续增强，但兼容性与基础设施仍是当前主要风险面。**

---

## 3. 项目进展

### 已关闭/落地的重要 PR

#### 1) 使用运行时统计信息选择 Hash Build Side，缓解 OOM
- PR: #11775 [CLOSED] [GLUTEN-11774][VL] Use runtime stats to choose hash build side  
  链接: apache/gluten PR #11775
- 对应 Issue: #11774 [CLOSED] HashBuild OOM caused by incorrect build side  
  链接: apache/gluten Issue #11774

**进展解读：**  
这是今天最值得关注的稳定性修复之一。该改动利用 AQE 场景下 `QueryStageExec` 的运行时统计信息，在 Hash Join 中动态选择更小的一侧作为 build side，直接针对错误 build side 导致的 **HashBuild OOM**。  
这类修复对分析型负载很关键，尤其是过滤后基数剧烈变化的 Join 查询，能够明显改善 **内存占用、执行稳定性和大查询成功率**。

---

#### 2) CI Java 依赖缓存镜像落地，缩短测试准备时间
- PR: #11655 [CLOSED] [BUILD, INFRA] [VL][CI] Adding docker image for maven cache  
  链接: apache/gluten PR #11655
- 对应 Issue: #11501 [CLOSED] [VL] Caching java dependencies in testing docker  
  链接: apache/gluten Issue #11501

**进展解读：**  
该改动通过在 CI Docker 镜像中缓存 Maven 依赖，减少每次测试时从远端仓库下载 Java 依赖的开销。  
这属于典型的基础设施优化，虽然不直接影响查询执行功能，但会实质提升：
- CI 吞吐量
- 构建稳定性
- PR 反馈速度
- 外部贡献者开发体验

对于像 Gluten 这样需要跨 Spark/Velox/ClickHouse 多矩阵验证的项目，这类优化价值很高。

---

#### 3) 降低日志噪声，改善可观测性质量
- PR: #11870 [CLOSED] [VELOX] [VL] Refine logs  
  链接: apache/gluten PR #11870
- 对应 Issue: #11863 [CLOSED] [VL] reduce log level for endpoint logs  
  链接: apache/gluten Issue #11863

**进展解读：**  
本次关闭的日志治理问题虽小，但体现出项目正在改善生产环境可运维性。将不必要的 WARN 级日志下调，有助于减少误报警、提升真正异常的可识别度。  
对运行在大规模 Spark 集群上的用户来说，日志噪声过高会直接影响问题定位效率。

---

#### 4) 修复原生 Union 结果列名问题
- PR: #11832 [CLOSED] [VELOX] [VL] Fix native `Union` result name  
  链接: apache/gluten PR #11832

**进展解读：**  
该修复与 **查询正确性/结果模式一致性** 直接相关。Union 场景下结果列名不一致会影响下游 SQL、DataFrame schema 推断及工具链兼容。  
这说明 Gluten 近期不仅在追求算子覆盖率，也在持续修补原生执行与 Spark 语义的一致性细节。

---

#### 5) Spark 4.0/4.1 测试启用继续推进
- PR: #11833 [CLOSED] [CORE] [GLUTEN-11550][VL] Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)  
  链接: apache/gluten PR #11833

**进展解读：**  
该 PR 使一个此前在 Spark 4.0/4.1 上被禁用的测试套件重新启用并通过 150/150 测试，表明 Gluten 在 **新 Spark 主线兼容性** 上继续向前。  
其根因涉及 Transformer 节点替换后逻辑计划 tag 传播，属于 Spark 物理计划/规则集成中的核心正确性问题。该修复为后续 Spark 4.x 支持打下基础。

---

## 4. 社区热点

### 热点 1：Velox 上游 PR 跟踪清单持续活跃
- Issue: #11585 [OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream  
  链接: apache/gluten Issue #11585
- 数据：16 评论，4 👍

**分析：**  
这是当前最活跃的讨论项之一。它反映出 Gluten 社区对 **Velox 上游演进速度与下游依赖关系** 的持续关注。  
背后的技术诉求是：Gluten 很多能力依赖 Velox upstream 合入，但由于上游 PR 未及时 merge，下游难以稳定 pick 或长期维护分叉补丁。  
这说明当前 Gluten 的核心挑战之一仍是 **Velox 上游协同与补丁落地节奏**，也是判断新特性何时可正式发布的重要信号源。

---

### 热点 2：Velox 时间戳支持仍在持续推进
- Issue: #1433 [OPEN] [enhancement] [VL] Support timestamp on Velox backend  
  链接: apache/gluten Issue #1433
- PR: #11626 [OPEN] [GLUTEN-11622][VL] Add basic TIMESTAMP_NTZ type support  
  链接: apache/gluten PR #11626
- PR: #11720 [OPEN] [GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback  
  链接: apache/gluten PR #11720

**分析：**  
时间戳类型支持是今天路线图信号最强的一条主线。Issue #1433 虽然创建已久，但仍在更新，表明这不是单点修复，而是一个分阶段推进的能力建设。  
当前可以看到两个方向：
1. **基础 TIMESTAMP_NTZ 类型支持** 正在补齐；
2. **验证阶段 fallback 行为可配置化**，便于开发和测试未完全成熟的能力。

这意味着 Gluten 正从“类型不支持导致整体回退”向“逐步开放受控能力”演进。

---

### 热点 3：执行后感知的动态 Join 策略选择
- Issue: #11808 [OPEN] Proposal: Add execution‑aware dynamic join strategy selection after filter execution  
  链接: apache/gluten Issue #11808

**分析：**  
这个提案与今天已关闭的 #11774/#11775 修复形成呼应。  
其核心诉求是：静态代价模型无法准确预测 filter 后 build side 的真实大小，希望在过滤执行之后再做 join strategy 选择。  
这表明社区开始从“修复单一 OOM bug”转向“构建更系统化的 execution-aware AQE 策略”，是典型的 **从问题修补走向优化框架化** 的信号。

---

### 热点 4：GMT 时区兼容问题快速进入修复
- Issue: #11862 [OPEN] [bug, triage] [VL] Native validation fails when Spark session timezone is GMT  
  链接: apache/gluten Issue #11862
- PR: #11869 [OPEN] [GLUTEN-11862][VL] Work around GMT session timezone validation failure on macOS  
  链接: apache/gluten PR #11869

**分析：**  
该问题在提出后很快有了修复 PR，说明维护者对 **跨平台时区兼容性** 非常敏感。  
背后的技术诉求不是单纯“GMT 不工作”，而是 Spark session timezone 与 Velox/底层系统时区表示之间存在语义不一致，尤其在 macOS 上表现更明显。  
这类问题对 SQL 时间函数、验证框架和结果一致性都很关键。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：HashBuild OOM，由错误 build side 选择引起
- Issue: #11774 [CLOSED] HashBuild OOM caused by incorrect build side  
  链接: apache/gluten Issue #11774
- Fix PR: #11775 [CLOSED] Use runtime stats to choose hash build side  
  链接: apache/gluten PR #11775

**影响：**  
可能导致大查询直接失败，是典型的生产级稳定性问题。  
**状态：** 已修复关闭。  
**判断：** 对 AQE 和 join 执行稳定性是正向增强。

---

### P1：Parquet-Thrift 生成文件读取失败
- Issue: #11865 [OPEN] [VL] Read Parquet file generated by parquet-thrift failed  
  链接: apache/gluten Issue #11865

**症状：**  
读取 parquet-thrift 生成的 Parquet 文件时报 `INVALID_STATE`，摘要中显示与 `VARCHAR` converted type 相关。  
**影响：**  
属于 **存储格式兼容性** 问题，可能影响特定生态链生成的数据文件读取。  
**状态：** 暂未看到对应 fix PR。  
**判断：** 若涉及历史数据或跨系统数据交换，优先级较高。

---

### P1：Spark session timezone=GMT 时原生验证失败
- Issue: #11862 [OPEN] [bug, triage] [VL] Native validation fails when Spark session timezone is GMT  
  链接: apache/gluten Issue #11862
- Fix PR: #11869 [OPEN] [VL] Work around GMT session timezone validation failure on macOS  
  链接: apache/gluten PR #11869

**影响：**  
会导致部分 Spark 3.5 + Velox backend 场景无法正常通过 native validation，尤其对时区敏感查询影响明显。  
**状态：** 已有 workaround PR，尚未合入。  
**判断：** 属于中高优先级兼容性问题，尤其影响开发机/macOS 环境与验证流程。

---

### P2：CI 镜像构建因 GitHub Actions 版本策略失败
- Issue: #11872 [OPEN] [VL] Fix Gluten CI image build  
  链接: apache/gluten Issue #11872
- Fix PR: #11873 [OPEN] [GLUTEN-11872][VL] Fix docker build  
  链接: apache/gluten PR #11873

**影响：**  
不是运行时查询 bug，但会阻塞 CI 镜像构建与持续交付流程。  
**状态：** 已有对应修复 PR。  
**判断：** 工程优先级高，预计会较快处理。

---

### P2：Generate 指标更新逻辑存在静默失败
- PR: #11861 [OPEN] [VL] Fix Generate metrics and refactor to use VeloxMetricsApi  
  链接: apache/gluten PR #11861

**症状：**  
`GenerateMetricsUpdater` 访问未定义 metrics key，`NoSuchElementException` 被 try/catch 静默吞掉，导致指标更新中止。  
**影响：**  
主要影响 **可观测性、性能诊断、算子指标可信度**。  
**状态：** 修复 PR 已打开。  
**判断：** 虽不直接影响结果正确性，但会影响性能分析和问题排查。

---

## 6. 功能请求与路线图信号

### 1) JDK 25 支持
- Issue: #11867 [OPEN] [enhancement, good first issue] [VL] Support JDK-25  
  链接: apache/gluten Issue #11867

**信号解读：**  
这是明显的生态对齐需求，目标是跟进未来 LTS JDK，并与 Spark 社区节奏一致。  
**纳入下一版本概率：中高。**  
原因：实现边界相对清晰，且对 CI/兼容矩阵扩展有直接价值。

---

### 2) ClickHouse CI 切换到新的 TPC-DS query schema
- Issue: #11871 [OPEN] [CH] Update CI to use the new TPCDS query schema  
  链接: apache/gluten Issue #11871

**信号解读：**  
虽然是 CI 需求，但本质上是 **基准测试与兼容验证体系升级**。需要重生成数据并使用新的 q30，说明 ClickHouse backend 测试基线正在演进。  
**纳入下一版本概率：高。**  
因为它直接关系到回归测试准确性与 benchmark 可信度。

---

### 3) 执行后感知的动态 Join 策略
- Issue: #11808 [OPEN] Proposal: Add execution‑aware dynamic join strategy selection after filter execution  
  链接: apache/gluten Issue #11808

**信号解读：**  
这个提案很可能成为后续 AQE 增强方向。今天 #11775 已经证明 runtime stats 选 build side 是可行路径。  
**纳入下一版本概率：中。**  
原因：方向明确，但实现复杂度较高，可能先以局部优化或实验性配置落地。

---

### 4) 时间戳/TIMESTAMP_NTZ 支持继续扩展
- Issue: #1433 [OPEN] [VL] Support timestamp on Velox backend  
  链接: apache/gluten Issue #1433
- PR: #11626 [OPEN] Add basic TIMESTAMP_NTZ type support  
  链接: apache/gluten PR #11626
- PR: #11720 [OPEN] Add config to disable TimestampNTZ validation fallback  
  链接: apache/gluten PR #11720

**信号解读：**  
这是最明确的功能路线图之一，且已有具体 PR 在推进。  
**纳入下一版本概率：高。**  
但预计会以“基础支持 + 部分函数/验证开关”的渐进式方式交付，而非一次性完整覆盖。

---

### 5) Iceberg 写入配置增强
- PR: #11776 [OPEN] [VELOX, DOCS] Added iceberg write configs  
  链接: apache/gluten PR #11776

**信号解读：**  
支持 `write.target-file-size-bytes`、`write.parquet.page-size-bytes` 等配置，表明 Gluten 正增强对 **Lakehouse 写入路径** 的控制能力。  
**纳入下一版本概率：中高。**  
对生产环境存储布局、文件大小、写入性能优化有现实价值。

---

## 7. 用户反馈摘要

### 1) 用户希望减少“不必要回退”，便于开发验证新能力
- 来源：#1433、#11720  
  链接: apache/gluten Issue #1433 / apache/gluten PR #11720

**痛点提炼：**  
当前 TimestampNTZ 在验证器中被视为 unsupported，导致查询回退 Spark，这让开发者很难验证 Velox 侧新实现。  
**反映场景：**  
不是单纯“缺某个类型”，而是用户需要更细粒度地控制 fallback 行为，以便开发、测试和逐步放量。

---

### 2) 用户对跨环境兼容性非常敏感，尤其是时区
- 来源：#11862、#11869  
  链接: apache/gluten Issue #11862 / apache/gluten PR #11869

**痛点提炼：**  
即使业务 SQL 本身没有明显问题，环境配置如 session timezone 也可能触发原生验证失败。  
**反映场景：**  
开发机、CI、macOS 与 Linux 环境之间的行为差异，正在成为 Gluten 落地时的真实障碍。

---

### 3) 用户期望读取更多“外部系统生成”的 Parquet 变体
- 来源：#11865  
  链接: apache/gluten Issue #11865

**痛点提炼：**  
当数据并非 Spark/Velox 自己生成，而是来自 parquet-thrift 等其他链路时，格式细节差异会暴露兼容性缺口。  
**反映场景：**  
混合数据平台、历史存量数据迁移、跨系统数据交换。

---

### 4) 用户非常重视 CI 速度和构建体验
- 来源：#11501、#11655、#11872、#11873  
  链接: apache/gluten Issue #11501 / apache/gluten PR #11655 / apache/gluten Issue #11872 / apache/gluten PR #11873

**痛点提炼：**  
依赖下载慢、镜像构建被策略拦截等问题，直接影响开发效率和贡献体验。  
**反映场景：**  
多后端、多 Spark 版本矩阵下，工程基础设施已经是项目交付能力的关键组成部分。

---

## 8. 待处理积压

### 1) Velox 时间戳支持主线 Issue 持续两年，仍未完全闭环
- Issue: #1433 [OPEN] [VL] Support timestamp on Velox backend  
  链接: apache/gluten Issue #1433

**提醒：**  
该问题创建于 2023-04-20，至今仍活跃，说明时间戳相关能力范围大、依赖链复杂。建议维护者继续拆分里程碑，明确：
- 已支持的数据类型边界
- 函数覆盖情况
- INT96 / timezone / NTZ 的差异
- 验证与回退策略

---

### 2) Velox 上游未合并 PR 跟踪问题持续堆积
- Issue: #11585 [OPEN] [tracker] useful Velox PRs not merged into upstream  
  链接: apache/gluten Issue #11585

**提醒：**  
这是 Gluten 与 Velox 上游协作的风险集中点。长期未 merge 的补丁会带来：
- 分叉维护成本
- 回归风险
- 版本升级阻力  
建议定期梳理优先级最高的 patch，必要时形成 pick 策略或兼容说明。

---

### 3) TIMESTAMP_NTZ 基础支持 PR 仍待推进
- PR: #11626 [OPEN] [VL] Add basic TIMESTAMP_NTZ type support  
  链接: apache/gluten PR #11626

**提醒：**  
该 PR 是时间戳路线图中的关键节点，若迟迟未合，会拖慢后续函数支持、验证开关、Spark 4.x 兼容测试等工作。  
建议关注评审阻塞点，尽快明确合入前条件。

---

### 4) Spark 4.0 增强测试与 Iceberg 失败修复仍在进行中
- PR: #11868 [OPEN] [VL] Enable enhanced tests for spark 4.0 & fix failures  
  链接: apache/gluten PR #11868

**提醒：**  
随着 Spark 4.0 主线推进，增强测试是关键质量门槛。该 PR 若长期悬而未决，可能影响对外释放 Spark 4.x 支持信心。

---

## 总结判断

今天的 Apache Gluten 体现出较强的工程推进能力：  
- **已修复** 的问题聚焦在 AQE 稳定性、CI 加速、日志治理、Spark 4.x 测试恢复；
- **新暴露** 的风险主要集中在时区兼容、Parquet 兼容、CI 构建策略；
- **路线图信号** 则非常明确地指向 TIMESTAMP/TIMESTAMP_NTZ、Spark 4.x、Iceberg 写入配置、JDK 25 兼容与执行感知型 Join 优化。

从项目健康度看，Gluten 当前处于 **高活跃、强工程迭代、兼容性持续补洞** 的阶段，适合持续关注 Velox 依赖演进与 Spark 4.x 适配进度。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-04-03）

## 1. 今日速览

过去 24 小时 Apache Arrow 维持较高活跃度：Issues 更新 33 条、PR 更新 20 条，但**无新版本发布**。  
从变更结构看，今天的重点仍集中在 **Python / R 生态兼容性、CI 稳定性、Packaging 修复**，同时 C++/Parquet/Flight SQL ODBC 方向继续推进。  
关闭类事项较多（Issues 已关闭 11、PR 已合并/关闭 10），说明维护团队在**清理积压问题、收敛历史技术债**方面动作明显。  
整体健康度评价为 **稳中偏积极**：核心执行与存储层有增量修复，外围语言绑定和构建链路修复密集，但仍有若干跨平台与 SIMD/打包问题值得持续关注。

---

## 2. 项目进展

### 2.1 今日已合并/关闭的重点 PR / Issue

#### 1）Python 内存后端测试修复，提升非默认构建可用性
- PR: #49645 `[Python] Remove "mimalloc" from mandatory_backends`
- Issue: #49295 `[Python] test_memory.py fails with -DARROW_MIMALLOC=OFF`
- 链接：
  - PR: apache/arrow PR #49645
  - Issue: apache/arrow Issue #49295

**进展说明：**  
PyArrow 的测试此前默认将 `mimalloc` 视为必需后端，导致在 Debian 等关闭 mimalloc 的构建环境中测试失败。该修复移除了硬编码假设，增强了 **Python 构建矩阵兼容性** 与发行包稳定性。  
**影响判断：** 这不是查询引擎功能增强，但对发行质量、下游 Linux 包维护和 CI 通过率非常关键。

---

#### 2）`pyarrow.gandiva` 弃用正式落地
- PR: #49637 `[Python] Deprecate pyarrow.gandiva`
- Issue: #49227 `[Python] Deprecate pyarrow.gandiva`
- 链接：
  - PR: apache/arrow PR #49637
  - Issue: apache/arrow Issue #49227

**进展说明：**  
项目已为 `pyarrow.gandiva` 增加弃用警告，计划自 24.0.0 起引导用户迁移。  
**技术意义：**  
这反映出 Arrow 在 Python API 层进一步聚焦于主线维护对象，减少低使用率、长期缺乏活跃演进模块带来的维护成本。  
**对 OLAP/分析场景的含义：**  
短期对主流数据湖、Parquet、IPC、Dataset 用户影响有限，但对依赖 Gandiva 表达式编译能力的少数用户是明确的迁移信号。

---

#### 3）R 零长度时间戳崩溃修复已完成
- PR: #49619 `[R] Fix crash with zero-length POSIXct tzone attribute`
- Issue: #48832 `[R] arrow::write_parquet error with zero-length datetimes in R 4.5.2`
- 链接：
  - PR: apache/arrow PR #49619
  - Issue: apache/arrow Issue #48832

**进展说明：**  
R 4.5.2+ 中零长度 `POSIXct` 的内部类型变化导致 Arrow 误判并触发写 Parquet 时出错。该修复已关闭问题。  
**技术意义：**  
这是一次典型的 **语言运行时升级引发的序列化兼容性回归修复**，对依赖 R 进行 ETL、导出 Parquet 的分析用户很重要。  
**存储引擎角度：**  
直接提升了 R -> Arrow -> Parquet 写链路的稳定性。

---

#### 4）Packaging/CI 技术债清理：Conan 相关链路被移除
- PR: #49647 `[CI][Packaging] Delete conan related packaging jobs and CI`
- Issue: #48766 `[CI][Packaging] conan-minimum and conan-maximum jobs are failing`
- 链接：
  - PR: apache/arrow PR #49647
  - Issue: apache/arrow Issue #48766

**进展说明：**  
Conan 相关 Docker/仓库链路已废弃并持续失败 4+ 个月，项目选择直接移除相关 Packaging Job。  
**影响判断：**  
这属于 **CI 基础设施收敛**，短期有助于降低噪音、提升主干稳定性；长期则意味着官方对某些分发路径的支持策略正在收缩或待重建。

---

#### 5）musllinux + Python 3.10 打包问题已快速闭环
- PR: #49639 `[CI][Packaging][Python] Pin setuptools < 80 ...`
- Issue: #49638 `[Python][Packaging][CI] Musllinux wheels for Python 3.10 try to build pandas from source and fail`
- 链接：
  - PR: apache/arrow PR #49639
  - Issue: apache/arrow Issue #49638

**进展说明：**  
通过限制 `setuptools < 80`，规避旧版 pandas 在 musllinux 下从源码构建失败的问题。  
**技术意义：**  
这属于典型的 **生态依赖版本漂移修复**，对 Python Wheel 发布链路至关重要，尤其影响 Alpine/musl 环境用户。

---

#### 6）C++/R 历史兼容代码清理
- PR: #49633 `[C++][R] Remove deprecated old MinGW CMake fixes for AWS`
- 链接：apache/arrow PR #49633

**进展说明：**  
移除了老旧 MinGW/AWS 相关兼容路径。  
**影响判断：**  
属于构建系统瘦身，降低未来维护复杂度，对主流用户影响较小，但有利于提升代码库可维护性。

---

## 3. 社区热点

### 3.1 讨论最活跃的 Issue / PR

#### 热点一：短年份 `%y` 解析 cutoff 可配置
- Issue: #31951 `[C++] Add a strptime option to control the cutoff between 1900 and 2000 when %y`
- 链接：apache/arrow Issue #31951

**热度：** 评论 9  
**背后诉求：**  
用户希望在解析两位年份时，能够控制诸如 `68` / `69` 被映射到 19xx 或 20xx 的分界点。  
**技术分析：**  
这是典型的 **时间语义正确性** 问题。对于 OLAP 场景，批量导入历史数据、日志归档、金融老系统迁移时，两位年份歧义非常常见。  
**信号：**  
虽然是老 Issue，但持续被触达，说明 Arrow 在 datetime ingestion 可配置性上仍有真实需求。

---

#### 热点二：NumPy 2.x 成为 Python 主依赖的路线图讨论
- Issue: #48473 `[Python] Require numpy 2.x`
- 链接：apache/arrow Issue #48473

**热度：** 评论 6  
**背后诉求：**  
NumPy 1.26 已 EOL，社区希望 Arrow Python 生态尽快完全切换到 NumPy 2.x。  
**技术分析：**  
这不只是依赖升级，而是 **ABI/兼容矩阵、打包策略、文档与集成测试** 的系统性调整。  
**路线图意义：**  
这是下一阶段 Python 发布策略的重要风向标，预计会影响 wheel 构建、最小依赖版本、下游 pandas/scipy 互操作说明。

---

#### 热点三：R 侧 Field metadata 可写能力
- Issue: #33390 `[R] Allow setting field metadata`
- 链接：apache/arrow Issue #33390

**热度：** 评论 6  
**背后诉求：**  
用户希望在 R 中创建带 metadata 的 `Field`，便于测试、Schema 表达和跨系统元数据传递。  
**技术分析：**  
对分析型系统而言，字段级元数据常用于语义标签、治理信息、血缘辅助信息。  
**路线图意义：**  
如果推进，将增强 Arrow 在 **Schema 语义层** 的跨语言一致性。

---

#### 热点四：R 文档层面对 Parquet 文件大小与排序关系的说明
- Issue: #31953 `[R][Doc] Document how sorting etc. can affect Parquet file size`
- 链接：apache/arrow Issue #31953

**热度：** 评论 6  
**背后诉求：**  
用户发现排序方式会让 Parquet 文件大小产生 2-3 倍差异，希望官方文档给出解释与建议。  
**技术分析：**  
这直接反映了压缩编码、字典编码、run-length/页面局部性对列式存储效果的影响。  
**OLAP 价值：**  
这类知识对构建高压缩比、高扫描效率的数据湖非常关键，虽然是文档请求，但本质上涉及 **存储布局优化 best practice**。

---

#### 热点五：多维 ndarray 到 FixedShapeTensorArray 的自动转换
- Issue: #35647 `[Python] Convert multidimensional arrays into FixedShapeTensorArrays automatically in pyarrow.array`
- 相关新 Issue: #49644 `[Python] Support converting list of multi-dimensional arrays to FixedShapeTensor`
- 链接：
  - apache/arrow Issue #35647
  - apache/arrow Issue #49644

**热度：** #35647 评论 5，且有 👍 3  
**背后诉求：**  
用户希望 PyArrow 在张量/多维数组数据建模上更“自然”，减少显式指定 `FixedShapeTensorType` 的样板代码。  
**技术分析：**  
这是 Arrow 从传统 tabular/columnar 走向 **AI/向量/张量数据承载** 的一个明确信号。  
**路线图判断：**  
若后续有 PR 跟进，可能成为 Python 易用性提升的重要方向。

---

## 4. Bug 与稳定性

以下按严重程度和影响范围排序：

### P1：导入阶段疑似包含 AVX 指令，可能破坏低指令集兼容性
- Issue: #49640 `[Python][C++] pyarrow._compute Contains AVX Instructions During Import`
- 链接：apache/arrow Issue #49640
- 状态：OPEN
- 是否已有 fix PR：**暂无明确对应 PR**

**风险分析：**  
如果 `pyarrow._compute` 在 import 阶段就包含/触发 AVX 指令，而文档宣称默认 SIMD 为 SSE4.2，那么在旧 CPU 或受限容器环境下可能导致 **非法指令崩溃**。  
**严重性：高**，因为它可能影响包的最基本可加载性，而不仅是某个查询函数。

---

### P1：MATLAB CI 因 GitHub Action 权限策略变更而失效
- Issue: #49611 `[MATLAB][CI] MATLAB workflow failing due to action permission error`
- PR: #49650
- 链接：
  - apache/arrow Issue #49611
  - apache/arrow PR #49650

**风险分析：**  
属于 CI 基础设施故障，已“静默失败”一段时间。虽然不直接影响 Arrow 核心运行时，但会导致 MATLAB 绑定质量失去持续验证。  
**修复状态：** 已有 PR #49650，但当前为 `awaiting changes`。  
**严重性：中高**，因其影响测试覆盖完整性。

---

### P1：LZ4 Hadoop 兼容性问题，超大 block 可能解压失败
- PR: #49642 `[C++] Fix Lz4HadoopCodec to split large blocks for Hadoop compatibility`
- 链接：apache/arrow PR #49642
- 状态：OPEN

**风险分析：**  
现实现将整个输入写成单个 Hadoop-framed LZ4 block，而 Hadoop 解压器对每块默认仅分配 256 KiB 输出缓冲，导致大块数据解压异常。  
**OLAP 影响：**  
这是典型的 **存储格式/生态互操作性问题**，影响 Arrow 与 Hadoop 生态之间的压缩兼容。  
**严重性：高**，尤其对批量交换数据、旧 Hadoop 环境用户。

---

### P2：Parquet 时间戳单位转换存在整数溢出风险
- PR: #49615 `[C++][Parquet] Check for integer overflow when coercing timestamps`
- 链接：apache/arrow PR #49615
- 状态：OPEN

**风险分析：**  
Arrow 时间戳写入 Parquet 时单位换算依赖乘法，若不检查溢出，可能 **静默写出错误数据**。  
**OLAP 影响：**  
这是查询正确性/数据正确性的核心问题。  
**修复状态：** 已有 PR，等待 committer review。  
**严重性：高**，值得维护者优先合并。

---

### P2：Linux/macOS ODBC 测试链接方式导致崩溃或构建失败
- Issues:
  - #49651 `[C++][FlightRPC][ODBC] Use static test linkage for Linux ODBC`
  - #49652 `[C++][FlightRPC][ODBC] Support static test linkage for macOS ODBC`
- 链接：
  - apache/arrow Issue #49651
  - apache/arrow Issue #49652
- 状态：OPEN
- fix PR：与 #46099、#49603 方向相关，但未见直接闭环

**风险分析：**  
Linux 上因 ODBC 驱动与测试程序同时链接 bundled gRPC，可能导致 `segmentation fault`；macOS 则仍缺 static linkage 支持。  
**意义：**  
这说明 Arrow Flight SQL ODBC 路线正在推进，但跨平台交付与测试隔离尚不成熟。  
**严重性：中高**。

---

### P3：历史/已闭环问题
1. #49295 Python mimalloc 测试失败 —— 已由 #49645 关闭  
2. #48832 R 零长度 datetime 写 Parquet 报错 —— 已由 #49619 修复  
3. #49638 musllinux wheels 构建失败 —— 已由 #49639 关闭  
4. #48766 conan packaging jobs 持续失败 —— 通过移除相关 CI 关闭

---

## 5. 功能请求与路线图信号

### 5.1 可能进入后续版本的重要方向

#### 1）Flight SQL ODBC 持续推进，Windows 交付链条更清晰
- PR: #46099 `[C++] Arrow Flight SQL ODBC layer`
- PR: #49603 `[C++][FlightRPC] Windows CI to Support ODBC DLL & MSI Signing`
- Issues: #49651 / #49652
- 链接：
  - apache/arrow PR #46099
  - apache/arrow PR #49603
  - apache/arrow Issue #49651
  - apache/arrow Issue #49652

**判断：高概率纳入后续版本持续演进。**  
这是今天最明确的“产品化”信号之一：不仅做驱动本体，还在补 Windows DLL/MSI 签名与 Linux/macOS 测试链路。  
**对分析数据库生态的意义：**  
Arrow 正在增强作为 **跨引擎 SQL 访问层 / 客户端连接器基础设施** 的能力。

---

#### 2）Python API 去冗余：Feather 与 Gandiva 同步弱化
- PR: #49590 `[Python] deprecate feather python`
- PR: #49637 `[Python] Deprecate pyarrow.gandiva`
- 链接：
  - apache/arrow PR #49590
  - apache/arrow PR #49637

**判断：高概率形成下一版本用户可见变更。**  
Feather V2 已等同 Arrow IPC file format，独立模块价值下降；Gandiva 也进入弃用状态。  
**路线图信号：**  
Python 用户 API 将进一步围绕 **IPC / Dataset / Compute 主线能力** 收敛。

---

#### 3）FixedShapeTensor 相关易用性改进值得关注
- Issues: #35647, #49644
- 链接：
  - apache/arrow Issue #35647
  - apache/arrow Issue #49644

**判断：中概率。**  
如果后续出现 PR，说明 Arrow 会继续增强对多维数组、向量嵌入、张量型数据的原生支持。  
**对 OLAP/分析引擎的意义：**  
适用于向量检索、模型特征存储、科学计算混合负载。

---

#### 4）Parquet / Dataset 读写行为可配置性仍有明显需求
- Issue: #31923 `[Python] Add option to have dataset infer the parquet schema from the last file`
- Issue: #46010 `Why arrow parquet does not support define stripe bytes size?`
- Issue: #31953 `[R][Doc] Document how sorting etc. can affect Parquet file size`
- 链接：
  - apache/arrow Issue #31923
  - apache/arrow Issue #46010
  - apache/arrow Issue #31953

**判断：中概率，短期更可能先补文档和参数讨论。**  
这些需求共同反映用户希望 Arrow 在 **schema 推断策略、写出布局控制、文件大小优化指导** 上更贴近真实数据湖生产环境。

---

#### 5）IPC 字典去重能力暴露
- Issue: #49646 `[C++] Arrow ipc format supports deduplication of dictionaries with dict_id, but there is no way to exercise it`
- 链接：apache/arrow Issue #49646

**判断：中低概率但技术价值高。**  
如果实现，能够改善 dictionary-encoded 数据在 IPC 中的序列化效率，尤其适用于高重复维度列。  
**属于典型存储优化型需求。**

---

## 6. 用户反馈摘要

### 6.1 真实使用痛点归纳

#### Parquet 文件大小对数据排序高度敏感
- Issue: #31953
- 链接：apache/arrow Issue #31953

用户明确观察到：仅改变排序方式，就会出现 **2-3 倍的 Parquet 文件大小差异**。  
**反映出：**
- 用户对 Arrow/Parquet 的压缩与编码行为有实际调优需求；
- 官方文档在“如何组织数据以优化列式存储”方面仍不够系统。

---

#### 生产环境需要更灵活的 schema 推断策略
- Issue: #31923
- 链接：apache/arrow Issue #31923

用户场景是：后期新增列，若 dataset 仅从首个文件推断 schema，则可能遗漏新列。  
**反映出：**
- Arrow Dataset 已进入真实演进式数据湖使用场景；
- 用户希望 schema discovery 更适应“历史分区 + 增量演化”的生产数据。

---

#### 短年份解析、混合 JSON 类型等“脏数据现实”处理需求强烈
- Issues:
  - #31951 `%y` cutoff 配置
  - #31403 JSON reader mixed singleton/array fields as arrays
- 链接：
  - apache/arrow Issue #31951
  - apache/arrow Issue #31403

**反映出：**
- 用户并不只需要理想化标准数据处理；
- 更需要 Arrow 在 ingestion 阶段容忍现实世界中的非规范输入，以减少预清洗成本。

---

#### Python/打包用户对平台兼容性极其敏感
- Issues/PRs:
  - #49295 / #49645 mimalloc
  - #49638 / #49639 musllinux 打包
  - #48473 NumPy 2.x
  - #49640 AVX 指令问题
- 链接：
  - apache/arrow Issue #49295
  - apache/arrow PR #49645
  - apache/arrow Issue #49638
  - apache/arrow PR #49639
  - apache/arrow Issue #48473
  - apache/arrow Issue #49640

**反映出：**
- 对很多用户而言，Arrow 首先是“基础组件”，必须能稳定安装、导入、在各种 CPU/系统上运行；
- 因此 packaging 与 CPU 指令集兼容问题会迅速成为高优先级反馈。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期未充分推进事项：

### 7.1 老而仍活跃的关键 Issue

#### #31951 `%y` 年份 cutoff 配置
- 状态：OPEN，创建于 2022-05-17，今日仍活跃
- 链接：apache/arrow Issue #31951

这是一个**典型正确性与可配置性问题**，影响 datetime 解析语义，建议尽快明确设计方案。

---

#### #31923 从最后一个文件推断 Parquet schema
- 状态：OPEN，创建于 2022-05-12
- 链接：apache/arrow Issue #31923

涉及数据湖 schema 演化的常见场景，建议评估是否提供：
- 从末尾文件推断
- 多文件并集推断
- 用户自定义 schema resolution policy

---

#### #31403 JSON mixed singleton/array 自动归一为数组
- 状态：OPEN，创建于 2022-03-19
- 链接：apache/arrow Issue #31403

这是高价值的现实世界兼容性增强，直接关系到 JSON ingestion 体验。

---

#### #31903 暴露 compute tracing 能力
- 状态：OPEN，创建于 2022-05-12
- 链接：apache/arrow Issue #31903

对执行引擎可观测性、调试复杂执行图具有价值，尤其适合高级用户和引擎集成方。

---

#### #20248 执行引擎 / Substrait consumer 失败路径测试不足
- 状态：OPEN，创建于 2022-05-16
- 链接：apache/arrow Issue #20248

虽然评论不多，但对稳定性很重要。失败路径测试不充分，容易导致 **assert / segmentation fault** 代替优雅报错。  
建议提升优先级，因为这类问题往往对生产系统伤害更大。

---

### 7.2 长期 PR 积压

#### #46099 Flight SQL ODBC layer
- 状态：OPEN，自 2025-04-10 持续推进
- 链接：apache/arrow PR #46099

这是一个**战略性较强的长期 PR**。当前已有周边 CI/签名/链接修复在配合推进，建议维护者尽早收敛拆分策略，避免长期超大 PR 持续悬挂。

---

#### #48622 Python 类型系统 stubs
- 状态：OPEN，自 2025-12-22
- 链接：apache/arrow PR #48622

对 Python 开发者体验有长期价值，但推进节奏较慢。建议明确其与前置 PR 的依赖关系和合并路径。

---

## 8. 综合判断

今天 Apache Arrow 的工作重心很清晰：  
一方面在 **Python/R 生态稳定性** 上快速修复兼容与打包问题；另一方面在 **Flight SQL ODBC、Parquet 正确性、压缩格式互操作** 上继续推进核心分析基础设施能力。  

从 OLAP 与分析型存储引擎视角看，当前最值得关注的三条主线是：
1. **Parquet/压缩/时间戳正确性修复**，直接影响数据可靠性；  
2. **Flight SQL ODBC 连接器建设**，增强 Arrow 作为跨系统数据访问层的价值；  
3. **Python API 收敛与 NumPy 2.x 迁移**，预示下一阶段生态边界与维护重点。  

**项目健康度：良好。**  
但仍建议维护者优先盯紧：#49640（AVX 导入风险）、#49615（Parquet 时间戳溢出）、#49642（LZ4 Hadoop 兼容）、#46099（ODBC 大 PR 收敛）。

--- 

如需，我还可以继续把这份日报整理成：
1. **更适合内部周报的精简版**  
2. **面向数据库内核团队的技术风险版**  
3. **带优先级表格的 PM/维护者行动清单版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*