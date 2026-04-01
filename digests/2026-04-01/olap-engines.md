# Apache Doris 生态日报 2026-04-01

> Issues: 6 | PRs: 192 | 覆盖项目: 10 个 | 生成时间: 2026-04-01 01:49 UTC

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

# Apache Doris 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时内，Apache Doris 社区维持了**高活跃度**：Issues 更新 6 条，PR 更新达到 **192 条**，其中 **91 条待合并、101 条已合并/关闭**，说明研发推进与分支回合并都非常密集。  
今天还有 **4.0.5** 新版本发布，表明 4.0 维护线仍在持续进行稳定性修复与可用性增强。  
从议题结构看，当前重点集中在三类方向：**外表/多 Catalog 兼容性、执行引擎与聚合/Spill 优化、数据湖与文件格式稳定性修复**。  
同时，社区也暴露出若干影响生产可用性的 bug，包括 **INSERT SELECT 可见性异常、TVF 持续导入 NPE、Arrow Flight + Variant 兼容问题**，说明 Doris 在新能力扩展期仍需强化边界场景回归验证。  

---

## 2. 版本发布

## 4.0.5 发布
- **版本**: 4.0.5
- **标题**: Apache Doris 4.0.5 Release
- **变更说明**: [Change Log / Issue #61817](https://github.com/apache/doris/issues/61817)
- **下载地址**: https://doris.apache.org/download

### 发布解读
从当前 GitHub 动态看，4.0.5 属于 **4.0 维护分支上的稳定性版本**，重点更可能是：
- 查询/执行层 bugfix
- 外部表与数据湖生态兼容修复
- 回 cherry-pick 的稳定性补丁
- 回归测试与构建流程完善

### 今日可关联到 4.0 维护线的修复信号
以下 PR/回合并动作表明 4.0.x 分支仍在积极吸收修复：
- [#61857](https://github.com/apache/doris/pull/61857) `[fix](parquet)` 空字典页不再错误解压（由 [#60374](https://github.com/apache/doris/pull/60374) cherry-pick）
- [#61975](https://github.com/apache/doris/pull/61975) `branch-4.0` HMS client pool 迁移至 Commons Pool
- [#61939](https://github.com/apache/doris/pull/61939) JDBC Catalog 下保留 query tvf 列别名，目标覆盖 `dev/4.0.x`

### 破坏性变更
从给定数据中**未见明确破坏性变更说明**。目前更像是 patch release，而非语义或接口级大改版本。

### 迁移注意事项
建议升级到 4.0.5 的用户重点验证以下场景：
1. **Parquet / Iceberg / 外表读取链路**  
   尤其是空字典页、混合编码、位置删除文件等边界数据。
2. **HMS / JDBC / REST Catalog 多目录访问**  
   检查连接池、字段别名、认证配置和元数据一致性。
3. **导入链路**  
   包括 TVF 持续导入、INSERT SELECT、多副本提交可见性。
4. **回归与灰度**  
   对 4.0.2/4.0.3 升级用户，应重点做生产 workload 的读写正确性回归，而不仅是功能冒烟。

---

## 3. 项目进展

以下为今日值得关注的已合并/关闭重要 PR，以及它们体现的研发推进方向。

### 3.1 存储格式与数据湖读取稳定性修复

#### 1) Parquet 空字典页解压修复
- [#60374](https://github.com/apache/doris/pull/60374) `[fix](parquet) Don't decompress dict page when dict page is empty`
- [#61857](https://github.com/apache/doris/pull/61857) branch cherry-pick

**进展意义：**
该修复针对字符串列全为 null 时，Parquet dict page 可能为空，旧逻辑仍尝试 ZSTD 解压，导致读取报错。  
这属于典型的**文件格式边界兼容性问题**，对外部表、Lakehouse、批量分析场景影响较大。  
其被回合并到维护分支，说明维护者认为这是**生产级稳定性修复**。

---

### 3.2 回归测试体系整理

#### 2) nereids_p0 与 query_p0 用例合并
- [#61842](https://github.com/apache/doris/pull/61842) `[chore](regression) Merge nereids_p0 test cases into query_p0`

**进展意义：**
该 PR 将重复积累多年的测试目录内容进行整合，反映出 Doris 对 **Nereids 优化器测试资产治理** 的持续推进。  
这能降低回归用例重复、减轻维护负担，并提高关键 SQL 路径的统一覆盖率。  
对查询引擎而言，这属于**质量基础设施**建设，而非直接功能，但长期收益很高。

---

### 3.3 元数据与外部 Catalog 基础设施演进

#### 3) HMS Client Pool 迁移到 Commons Pool
- [#61553](https://github.com/apache/doris/pull/61553) `[improvement](fe) Migrate HMS client pool to Commons Pool`
- 分支回合并：
  - [#61975](https://github.com/apache/doris/pull/61975) branch-4.0
  - [#61976](https://github.com/apache/doris/pull/61976) branch-4.1

**进展意义：**
这是 FE 侧外部元数据访问能力的一次**工程化增强**。从自维护队列式连接池迁移到 `commons-pool2`，意味着：
- 连接生命周期管理更标准化
- 池化参数治理更成熟
- 对 Hive Metastore 高并发访问时的稳定性更有保障

这对于大量依赖 HMS 的湖仓集成用户，是非常实际的可运维性提升。

---

### 3.4 长线中的执行引擎重构仍在推进

虽然今日未见直接合并，但多个高关注 PR 持续活跃，反映引擎层正在快速演进：

- [#61690](https://github.com/apache/doris/pull/61690) `[refine](exec) Refactor aggregation code`  
  将聚合共享状态从“God Object”拆解，属于执行引擎可维护性与语义清晰化的重要重构。
- [#61232](https://github.com/apache/doris/pull/61232) `Reduce window function template instantiations`  
  目标是减少模板实例化带来的编译/二进制膨胀问题，提升窗口函数实现的工程效率。
- [#61973](https://github.com/apache/doris/pull/61973) `[fix](spill)` 修复最大重分区深度后 `revocable_mem_size` 计算错误  
  指向内存回收与 Spill 行为正确性。

这些 PR 表明 Doris 正在同时处理**性能、可维护性、内存管理正确性**三条主线。

---

## 4. 社区热点

> 注：给定数据中的 PR 评论数字段为 `undefined`，因此这里主要依据“是否被 reviewed/approved、是否多分支回合并、技术影响面”来识别热点。

### 热点 1：远程文件系统抽象统一与 SPI 化
- Issue: [#61860](https://github.com/apache/doris/issues/61860)

**讨论焦点：**
该议题提出 Doris 当前存在两套并行远程文件系统抽象，计划统一并拆分为独立 Maven SPI 模块。  
这背后的技术诉求非常明确：
- 降低 FE 文件系统层历史包袱
- 支持插件化接入更多对象存储/远程 FS
- 减少实现重复和调用路径分裂

**分析：**
这不是普通重构，而是偏**架构层路线图信号**。如果落地，将显著影响：
- 外部表/对象存储接入方式
- 代码组织与扩展机制
- 第三方生态适配成本

---

### 热点 2：聚合执行引擎重构
- PR: [#61690](https://github.com/apache/doris/pull/61690)

**讨论焦点：**
聚合代码从高度耦合状态拆分为更清晰的语义模型（GroupBy、UngroupBy、InlineCount 等）。  

**分析：**
这类 PR 技术风险高，但长期价值大。它通常意味着：
- 后续聚合算子优化更容易推进
- 正确性 bug 更容易隔离
- spill、vectorized、pipeline 路径可更干净地演化

对 OLAP 引擎来说，这是核心中的核心。

---

### 热点 3：全局单调递增 TSO
- PR: [#61199](https://github.com/apache/doris/pull/61199)

**讨论焦点：**
新增全局递增 Timestamp Oracle 服务。  

**分析：**
这是明显面向更强事务能力、全局有序语义、多系统协同的一项基础设施建设。  
虽然目标分支是 `dev/5.0.x`，短期不会进入稳定维护线，但从路线看，Doris 可能正在为更复杂事务、CDC、跨组件一致性场景铺路。

---

### 热点 4：Routine Load 接入 AWS 生态
- PR:
  - [#61324](https://github.com/apache/doris/pull/61324) Support RoutineLoad IAM auth
  - [#61325](https://github.com/apache/doris/pull/61325) Support the Amazon Kinesis

**讨论焦点：**
面向 Amazon MSK/Kinesis 的接入增强。

**分析：**
这反映社区用户需求正从传统 Kafka 扩展到**云原生流式接入**。  
对于海外或云上用户，这将直接影响 Doris 作为实时分析底座的可采用性。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1：INSERT SELECT 在 quorum success 后数据不可见
- Issue: [#61916](https://github.com/apache/doris/issues/61916)
- 标题: `[Bug](load) INSERT SELECT data invisible after quorum success with cancelled node channel`

**问题描述：**
当多副本写入中某个 node channel 在 `close_wait` 阶段超时并被取消，但没有标记为 failed，FE 仍认为事务可提交，最终导致**提交成功但数据不可见**。

**影响评估：**
这是典型的**正确性问题**，影响比 crash 更严重，因为会制造“成功假象”。  
涉及导入事务、多副本一致性、FE/BE 失败感知协议。

**fix PR：**
- 当前给定数据中**未看到明确对应 fix PR**

**建议关注级别：**
最高。应优先由维护者确认是否影响 4.0/4.1 主线，并补充回归测试。

---

### P1：TVF 持续导入出现 NPE
- Issue: [#61897](https://github.com/apache/doris/issues/61897)
- 标题: `TVF 持续导入报错 ... ConnectContext.getExecutor() is null`

**问题描述：**
长期运行的 TVF 持续导入任务突然报错，疑似与“大量大文件”场景相关，`ConnectContext.getExecutor()` 返回 null，随后触发 NPE。

**影响评估：**
- 直接导致持续导入中断
- 与长任务生命周期和资源上下文管理相关
- 可能暴露 FE 会话/执行器对象管理缺陷

**fix PR：**
- 暂未发现对应 fix PR

**建议关注级别：**
高。尤其影响生产流式/准实时导入用户。

---

### P1：Cross-cluster Catalog + Arrow Flight 无法读取 Variant 类型
- Issue: [#61883](https://github.com/apache/doris/issues/61883)
- 标题: `Cross-cluster Catalog with Arrow Flight fails to read Variant type`

**问题描述：**
4.0.3、K8s、Cloud/Disaggregated 部署下，跨集群 Catalog 使用 Arrow Flight 读取 Variant 类型失败。

**影响评估：**
- 影响新类型 Variant 的跨集群可用性
- 影响 Arrow Flight 这一高性能远程传输链路
- 反映新类型与跨集群协议协同仍不成熟

**fix PR：**
- 暂未发现对应 fix PR

**建议关注级别：**
高。对多集群/云原生用户影响明显。

---

### P2：Spill 内存可回收量计算错误
- PR: [#61973](https://github.com/apache/doris/pull/61973)

**问题描述：**
当分区达到最大重分区深度时，`revocable_mem_size()` 仍返回非 0，导致系统误以为这部分内存仍可回收，可能触发无效 spill。

**影响评估：**
- 可能造成内存管理决策错误
- 不一定导致结果错误，但会影响资源回收和查询稳定性

**状态：**
- 已有 fix PR，待合并

---

### P2：DeleteSubPredicatePB 读取路径 operator 规范化问题
- PR: [#61961](https://github.com/apache/doris/pull/61961)

**问题描述：**
给出的堆栈显示 compaction/core 路径中存在 predicate 解析异常，可能引发崩溃。

**影响评估：**
- 影响 compaction 或删除谓词读路径
- 若触发则可能属于 BE 核心路径崩溃类问题

**状态：**
- 已有 fix PR，待合并

---

### P2：JDBC Catalog 下 query TVF 列别名丢失
- PR: [#61939](https://github.com/apache/doris/pull/61939)

**问题描述：**
通过 `query()` 透传 SQL 到 JDBC catalog 时，返回列名未保留 SQL 中定义的别名。

**影响评估：**
- 主要影响 SQL 兼容性与上层应用映射逻辑
- 不一定导致错误结果，但会破坏预期 schema

**状态：**
- 已有 fix PR，覆盖多个分支

---

### P3：Parquet 空字典页异常
- PR: [#60374](https://github.com/apache/doris/pull/60374), [#61857](https://github.com/apache/doris/pull/61857)

**状态：**
- 已修复并回合并  
属于已落地的稳定性增强项。

---

### P3：`__internal_schema.column_statistics` 失效问题被 stale 关闭
- Issue: [#53633](https://github.com/apache/doris/issues/53633)

**说明：**
问题描述涉及 BE 使用 `127.0.0.1` 作为地址导致跨机器数据传输不可用，进而影响内部统计信息表。  
今日状态为 stale 关闭，并非技术上已确认解决。

**风险提示：**
如果社区仍有类似部署方式，建议维护者排查是否存在文档缺失或真实缺陷未闭环。

---

## 6. 功能请求与路线图信号

### 6.1 Doris Binlog 增加 row type
- Issue: [#61956](https://github.com/apache/doris/issues/61956)

**信号解读：**
这是一个较明确的新能力诉求，尽管当前描述尚不完整，但它表明用户希望 binlog 暴露更丰富的行级类型信息。  
若与 CDC、增量订阅、下游同步系统结合，价值较高。

**纳入下一版本可能性：**
中等。  
目前 issue 还比较粗糙，但作者表示愿意提交 PR，这类自驱型需求若设计简单，有较大机会进入后续开发。

---

### 6.2 统一远程文件系统抽象并做 SPI 模块化
- Issue: [#61860](https://github.com/apache/doris/issues/61860)

**信号解读：**
这是今天最强的架构路线图信号之一。  
其潜在收益包括：
- 降低对象存储与 DFS 接入门槛
- 统一 FE 文件系统行为
- 支持更好插件化与模块化发布

**纳入下一版本可能性：**
高，但更可能分阶段落地，不太像单一小版本能完整完成的工作。

---

### 6.3 Routine Load 云流式接入增强
- PR:
  - [#61324](https://github.com/apache/doris/pull/61324) MSK IAM
  - [#61325](https://github.com/apache/doris/pull/61325) Amazon Kinesis

**信号解读：**
这两项能力非常符合云上实时数仓趋势。  
Doris 正在从“兼容 Kafka”走向“兼容云厂商原生流服务”。

**纳入下一版本可能性：**
较高。  
它们已有较成熟 PR 形态，且目标分支明确为 `dev/4.1.x`。

---

### 6.4 Window Funnel v2
- PR: [#61935](https://github.com/apache/doris/pull/61935)

**信号解读：**
行为分析与漏斗分析是 OLAP 高频场景。  
该 PR 已进入 `branch-4.1` cherry-pick，说明相关功能已有较高成熟度。

**纳入下一版本可能性：**
高，倾向 4.1 线特性增强。

---

### 6.5 全局 TSO
- PR: [#61199](https://github.com/apache/doris/pull/61199)

**信号解读：**
这是更长期的大版本能力建设，可能关联事务一致性与分布式时序控制。

**纳入下一版本可能性：**
对 5.0 较高，对 4.x 较低。

---

## 7. 用户反馈摘要

基于今日 issue 摘要，可提炼出以下真实用户痛点：

### 1) 长时间运行任务的稳定性仍是痛点
- 相关：[#61897](https://github.com/apache/doris/issues/61897)

用户在 TVF 持续导入场景中反馈，任务“跑了很久后突然持续报错”，且怀疑与“大量大文件”有关。  
这说明 Doris 在**长期运行任务、上下文回收、资源生命周期管理**上仍需进一步强化。

---

### 2) 多副本导入成功语义与实际可见性不一致
- 相关：[#61916](https://github.com/apache/doris/issues/61916)

这是典型生产用户最敏感的问题：系统对外表现“成功”，但数据实际上不可见。  
用户关心的不只是吞吐量，而是**事务成功语义是否可信**。

---

### 3) 新类型 + 新协议 + 云原生部署的组合兼容性不足
- 相关：[#61883](https://github.com/apache/doris/issues/61883)

Variant 类型、Arrow Flight、跨集群 Catalog、K8s Operator、Disaggregated Cluster 同时出现时暴露问题，说明 Doris 在新架构组合场景下仍存在集成缝隙。  
这类问题对企业用户影响大，因为他们往往正是以这种“多新特性组合”方式部署。

---

### 4) 用户希望 Doris 更开放地融入外部生态
- 相关：
  - [#61860](https://github.com/apache/doris/issues/61860)
  - [#61324](https://github.com/apache/doris/pull/61324)
  - [#61325](https://github.com/apache/doris/pull/61325)

无论是文件系统 SPI 化，还是 AWS 流服务接入，都显示用户正在把 Doris 作为**数据平台中枢**使用，而不仅是单机分析数据库。  
这意味着 Doris 未来竞争力很大程度上取决于生态接入质量。

---

## 8. 待处理积压

以下事项建议维护者重点关注：

### 1) 高风险正确性 bug 尚无对应修复 PR
- [#61916](https://github.com/apache/doris/issues/61916)  
`INSERT SELECT` quorum success 后数据不可见

**建议：**
尽快确认受影响版本范围，补充最小复现和回归测试，必要时标记为 release blocker。

---

### 2) TVF 持续导入 NPE 尚未闭环
- [#61897](https://github.com/apache/doris/issues/61897)

**建议：**
需要 FE 执行上下文与异步任务框架的联合排查，避免仅做空指针防御而遗漏根因。

---

### 3) Arrow Flight + Variant 跨集群兼容性问题
- [#61883](https://github.com/apache/doris/issues/61883)

**建议：**
应明确这是协议层、类型序列化层还是跨集群 catalog 映射层问题，并尽量给出 workaround。

---

### 4) 执行引擎大重构 PR 需持续审查
- [#61690](https://github.com/apache/doris/pull/61690)
- [#61232](https://github.com/apache/doris/pull/61232)

**建议：**
这类核心 PR 风险高但价值大，应优先安排核心 reviewer，避免长期悬而未决。

---

### 5) 长期开启后因 stale 关闭的历史 PR/Issue 需要二次甄别
- [#53633](https://github.com/apache/doris/issues/53633)
- [#56303](https://github.com/apache/doris/pull/56303)
- [#56307](https://github.com/apache/doris/pull/56307)
- [#56322](https://github.com/apache/doris/pull/56322)
- [#56324](https://github.com/apache/doris/pull/56324)
- [#56325](https://github.com/apache/doris/pull/56325)
- [#56274](https://github.com/apache/doris/pull/56274)

**建议：**
stale 关闭有助于清理积压，但也可能掩盖尚未真正解决的问题。对于涉及：
- SQL 兼容性
- prepared statement
- exchange 通信校验
- ES 映射兼容
等主题，建议抽样复核是否仍对当前版本有效。

---

## 总结判断

Apache Doris 今日呈现出一个典型的**高迭代、强维护、架构演进与生产稳定性并行推进**的开源项目状态：  
- **健康度**：高，PR 流量大，维护分支活跃，新版本持续发布。  
- **风险点**：导入正确性、长任务稳定性、云原生/跨集群组合兼容。  
- **路线图信号**：文件系统 SPI 化、云流接入、TSO、执行引擎重构，均表明 Doris 正向更强平台化能力演化。  

如果你愿意，我还可以继续把这份日报整理成更适合团队内部分发的 **“管理层摘要版”** 或 **“研发跟进清单版”**。

---

## 横向引擎对比

以下是基于 2026-04-01 各项目社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# 开源 OLAP / 分析型存储生态横向对比报告
**日期：2026-04-01**

## 1. 生态全景

过去 24 小时的社区动态显示，开源 OLAP 与分析型存储生态整体处于 **高活跃、高演进、高兼容性压力** 的状态。  
一方面，Apache Doris、StarRocks、DuckDB、Iceberg、Delta Lake 等项目都在持续推进执行引擎、外表/Lakehouse 连接、半结构化数据、云对象存储和连接器生态；另一方面，**查询正确性、长任务稳定性、跨组件兼容性、CI/依赖治理** 成为普遍痛点。  
从趋势看，行业焦点已不再只是“单机快”或“MPP 快”，而是转向 **湖仓一体、多引擎协同、云原生接入、事务/元数据治理、半结构化类型支持**。  
整体上，生态正在从“功能扩展期”逐步进入“平台化与生产级稳定性竞争期”。

---

## 2. 各项目活跃度对比

> 注：ClickHouse 今日摘要生成失败，以下表格不纳入比较。

| 项目 | Issues 更新 | PR 更新 | Release | 今日关键信号 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 6 | **192** | **4.0.5 发布** | 外表/Catalog、执行引擎重构、Spill/Parquet 修复 | **高**：研发推进和维护线都很活跃 |
| **DuckDB** | 20 | 43 | 无 | 正确性修复、CI 改进、JSON/VARIANT/Catalog 增强 | **高**：修复快，但版本线回归压力大 |
| **StarRocks** | 14 | 126 | 无 | Iceberg 优化、低基数字符串、MV/SQL 正确性、安全修复 | **高**：迭代快，外表与 MV 边界问题较多 |
| **Apache Iceberg** | 15 | 50 | 无 | Spark/Flink/Kafka Connect、REST/OpenAPI、Variant、v4 规范 | **中高**：主线清晰，跨引擎一致性压力大 |
| **Delta Lake** | 4 | 50 | 无 | Flink Sink、Kernel/UC/DSv2、CI/供应链安全 | **中高**：方向明确，但 stacked PR 压力较大 |
| **Databend** | 11 | 17 | **v1.2.888-patch-3** | SQL 兼容修复、Trace、Table Branch、Hash Join | **中高**：节奏稳，主干功能持续扩展 |
| **Velox** | 4 | 50 | 无 | Parquet widening、GPU/cuDF、remote function、pushdown | **中高**：底层创新强，工程稳定性仍需打磨 |
| **Apache Gluten** | 3 | 15 | 无 | Spark/Velox 兼容、TimestampNTZ、Kafka 读取、并行执行 PoC | **中高**：方向清晰，但仍依赖上游节奏 |
| **Apache Arrow** | 24 | 18 | 无 | Parquet/IPC/Compute 修复、Flight SQL/ODBC、CI 治理 | **中高**：偏工程巩固和生态基础设施建设 |

### 活跃度观察
- **第一梯队（超高活跃）**：Apache Doris、StarRocks  
- **第二梯队（高活跃）**：DuckDB、Iceberg、Delta Lake、Velox  
- **第三梯队（稳步推进）**：Databend、Arrow、Gluten  
- **版本发布信号最强**：Doris 4.0.5、Databend patch release

---

## 3. Apache Doris 在生态中的定位

### 3.1 优势
与同类项目相比，**Apache Doris 的突出优势**在于：
- **社区吞吐量极高**：今日 PR 更新数达到 **192**，显著高于 DuckDB、Iceberg、Delta、Databend 等；
- **维护线活跃**：4.0.5 patch release 发布，同时多个修复回合并到 4.0/4.1，说明稳定分支维护力度强；
- **产品面均衡**：既覆盖 MPP 查询、物化视图、导入、外表/Catalog，又积极推进湖仓、云流接入、Arrow Flight、Variant、TSO 等新能力；
- **平台化趋势明显**：从远程文件系统 SPI 化、Routine Load 云接入，到全局 TSO，都体现其向数据平台中枢演进。

### 3.2 技术路线差异
相较其他项目，Doris 的路线更偏向 **“完整分析数据库 + Lakehouse 接入 + 实时/批处理融合”**：
- 相比 **DuckDB**：Doris 更偏分布式、服务端、生产实时数仓；DuckDB 更偏嵌入式/单机分析；
- 相比 **StarRocks**：两者都在强化 Lakehouse 与外表，但 Doris 更强调多 Catalog / 导入事务 / 平台化能力，StarRocks 在 Iceberg 优化和低基数执行优化上更聚焦；
- 相比 **Iceberg / Delta**：Doris 是引擎 + 数据库，后两者更多是表格式/协议/元数据层；
- 相比 **Databend**：Doris 的社区体量和维护分支活动度更高，Databend 在版本化表、观测性等方向更具实验性；
- 相比 **Velox / Arrow / Gluten**：Doris 更靠近终端可直接部署的数据库产品，而后者更多是基础执行层/格式层/加速层。

### 3.3 社区规模对比
从今日数据看：
- Doris PR 活跃度 **显著领先**；
- 在“数据库内核 + 外部生态”双线推进的项目中，Doris 与 StarRocks 最接近；
- Doris 维护分支回合并密集，说明其 **生产落地用户群与维护负担更重**，这也是成熟数据库项目的重要特征。

### 3.4 风险与短板
Doris 当前主要风险集中在：
- **正确性问题仍较敏感**：如 `INSERT SELECT` quorum success 后数据不可见；
- **长任务生命周期管理**：TVF 持续导入 NPE；
- **新能力组合兼容性**：Variant + Arrow Flight + Cross-cluster Catalog。  
这意味着 Doris 虽然功能面广，但也承受更复杂的回归面。

---

## 4. 共同关注的技术方向

以下是多项目共同涌现的重点技术方向。

### 4.1 Lakehouse / 外表 / Catalog 深化
**涉及项目**：Doris、StarRocks、Iceberg、Delta Lake、Arrow、Velox  
**具体诉求**：
- Doris：HMS client pool、Catalog 兼容、远程文件系统 SPI 化
- StarRocks：Iceberg manifest 优化、百万分区 metadata OOM
- Iceberg：REST Catalog、OpenAPI、OAuth refresh_token
- Delta：Unity Catalog + Kernel + DSv2 建表链路
- Arrow：非本地 filesystem URI、异步 filesystem API
- Velox：HiveDataSource pushdown  
**结论**：Lakehouse 生态已从“能接上”进入“元数据规模化、协议标准化、性能细化优化”阶段。

### 4.2 查询正确性优先级上升
**涉及项目**：Doris、DuckDB、StarRocks、Iceberg、Arrow、Delta  
**具体诉求**：
- Doris：导入成功但数据不可见
- DuckDB：窗口函数列值静默交换、复杂 SQL binder/internal error
- StarRocks：MV rewrite 错误结果、count/limit/time 函数异常
- Iceberg：Spark time travel 查询错误缓存
- Arrow：list filtering 结果错乱
- Delta：分区更新误重写其他分区  
**结论**：在 OLAP 场景中，**错误结果问题的优先级已全面高于纯性能优化**。

### 4.3 半结构化数据与 Variant / JSON 能力扩展
**涉及项目**：Doris、DuckDB、Iceberg、StarRocks、Delta  
**具体诉求**：
- Doris：Variant + Arrow Flight 跨集群读取
- DuckDB：JSON 函数、空 VARIANT、legacy encoding
- Iceberg：VariantVisitor、Kafka Connect VARIANT、predicate pushdown
- StarRocks：JSON/FlatJSON 一致性、FlatJSON crash
- Delta：Spark 4.0 写 Variant 表保护开关  
**结论**：半结构化类型正从“新增支持”进入“端到端可用性和跨组件一致性”阶段。

### 4.4 云原生接入与对象存储治理
**涉及项目**：Doris、DuckDB、Iceberg、Arrow、Delta、StarRocks  
**具体诉求**：
- Doris：Routine Load IAM / Kinesis、远程 FS SPI
- DuckDB：S3 多文件 Parquet 稳定性
- Iceberg：REST 安全认证、S3 signing endpoint
- Arrow：S3/GCS、Web identity、连接池
- Delta：UC 兼容与 CI 门控
- StarRocks：Iceberg 大规模 metadata 内存治理  
**结论**：云对象存储与云服务接入，已成为分析引擎“默认场景”而非附加能力。

### 4.5 执行引擎重构与 Pushdown / Spill / 并行化
**涉及项目**：Doris、DuckDB、StarRocks、Velox、Gluten、Databend  
**具体诉求**：
- Doris：aggregation refactor、spill correctness
- DuckDB：join filter pushdown、单线程源 fanout
- StarRocks：inline agg state、dictification、统计传播
- Velox：dynamic filter pushdown、GPU operator、remote function serialization
- Gluten：Velox parallel execution PoC
- Databend：partitioned hash join  
**结论**：各项目都在进入 **“执行器内部可维护性 + 性能结构性优化”** 阶段，而不只是局部调参。

---

## 5. 差异化定位分析

### 5.1 存储格式与数据管理定位
- **Doris / StarRocks / Databend**：数据库内核主导，强调自有执行层与外表/Lakehouse 接入；
- **Iceberg / Delta Lake**：表格式与事务/元数据协议主导，依赖 Spark/Flink/Trino/Doris/StarRocks 等引擎消费；
- **Arrow**：内存格式、列式交换、连接层和多语言库基础设施；
- **Velox**：查询执行引擎底座；
- **Gluten**：Spark 加速层，主要连接 Spark 与 Velox；
- **DuckDB**：单机/嵌入式分析数据库，自带存储与执行，但产品形态不同于分布式数仓。

### 5.2 查询引擎设计差异
- **Doris / StarRocks**：MPP 分布式 OLAP，强调物化视图、外表、执行器优化；
- **DuckDB**：嵌入式列式执行，强调本地分析、开发者体验与 SQL 完整性；
- **Databend**：云数仓路线更明显，实验性表分支、HTTP 查询、可观测性较突出；
- **Velox / Gluten**：更多作为底层执行与加速能力，被上层引擎复用；
- **Arrow**：不直接做完整 SQL 引擎，但支撑数据交换与部分 compute；
- **Iceberg / Delta**：不以执行器为核心，而以表层协议和事务一致性为核心。

### 5.3 目标负载类型
- **Doris / StarRocks**：实时分析 + 交互式查询 + 湖仓联合分析；
- **DuckDB**：本地分析、Notebook、嵌入式应用、单机数据科学；
- **Iceberg / Delta**：数据湖表管理、批流一体、跨引擎共享数据层；
- **Databend**：云原生分析、API 化访问、实验性数据版本能力；
- **Velox / Arrow / Gluten**：更适合作为引擎组件而非最终面向业务的数据库。

### 5.4 SQL 兼容性重点差异
- **DuckDB**：对 PostgreSQL 风格函数、约束语义、DDL 兼容诉求明显；
- **Doris / StarRocks**：更关注 SQL 正确性、Catalog 兼容、外部表语义一致性；
- **Databend**：SQL 标准兼容修复较突出，如 `X'...'`；
- **Gluten**：重点是 Spark SQL 语义对齐；
- **Iceberg / Delta**：更多关注 SQL 行为在 Spark/Flink 等宿主引擎中的一致性；
- **Arrow**：SQL 不是主体，接口更偏驱动协议与格式兼容。

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：高迭代、高流量、平台化推进
- **Apache Doris**
- **StarRocks**

特点：
- PR 数量大
- 维护分支活跃
- 功能面广
- 同时承担生产稳定性和新能力演进

#### 第二层：高速演进、生态扩张明显
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**

特点：
- 技术路线清晰
- 生态接入和架构演进并行
- 正在承受复杂生产场景带来的回归压力

#### 第三层：稳步增强、方向聚焦
- **Databend**
- **Apache Arrow**
- **Apache Gluten**

特点：
- 活跃度不低，但更聚焦于特定方向
- Arrow 偏基础设施巩固
- Gluten 偏 Spark/Velox 兼容收敛
- Databend 偏功能扩展与工程化并进

### 6.2 快速迭代阶段 vs 质量巩固阶段

**快速迭代阶段明显的项目**：
- Doris：执行引擎重构、TSO、云流接入、FS SPI
- StarRocks：Iceberg 深度优化、低基数执行扩展
- DuckDB：JSON/VARIANT、Trigger Catalog、约束语义补齐
- Delta：Kernel 化、Flink Sink、DSv2 路径打通
- Velox：GPU、remote function、pushdown

**质量巩固阶段特征更明显的项目**：
- Arrow：CI、Parquet/IPC fuzz、Flight 驱动交付治理
- Iceberg：Spark/Flink/Kafka Connect 正确性修复与 REST 标准化
- Gluten：兼容性补齐、资源管理修复
- Databend：patch release、SQL 兼容修复

---

## 7. 值得关注的趋势信号

### 7.1 行业趋势一：Lakehouse 进入“精细化优化”阶段
过去常见的“支持 Iceberg/Delta/Hive 外表”已不再是竞争壁垒。当前竞争重点转向：
- metadata scale（百万分区、manifest 裁剪）
- catalog engineering（连接池、按需加载、标准 API）
- file skipping / predicate pushdown / runtime filter  
**对架构师的意义**：选型时不能只看“是否支持 Iceberg”，要看在 **大规模元数据、高并发 FE、文件级跳读** 下的真实表现。

### 7.2 行业趋势二：正确性问题正在取代性能成为第一优先级
多个项目都出现：
- 错误结果
- 成功假象
- time travel 读错快照
- 分区更新误重写  
**对数据工程师的意义**：生产验收应增加 **结果一致性、事务语义、边界回归**，不能只做吞吐 benchmark。

### 7.3 行业趋势三：半结构化数据进入主线竞争区
Variant / JSON / FlatJSON / Arrow Flight / Kafka Connect 等能力同时升温。  
**对架构师的意义**：未来 OLAP 平台不只是处理结构化事实表，还要承担事件流、文档型字段、日志对象等混合负载。

### 7.4 行业趋势四：云原生身份认证与对象存储治理成为标配
IAM、refresh_token、S3 signing、Web identity、云流服务接入、对象存储插件化，在多个项目同时出现。  
**参考价值**：如果团队运行在 AWS/GCP/Azure/K8s 环境，应优先考察项目的：
- 凭证续期机制
- 对象存储抽象层
- 云流接入原生能力
- 日志脱敏与依赖安全

### 7.5 行业趋势五：执行器内部工程化能力成为分水岭
聚合重构、spill 正确性、pushdown、统计传播、GPU fallback、并行执行 PoC 等都说明，领先项目正从“做功能”转向“重构可持续优化的引擎骨架”。  
**对技术决策者的意义**：判断项目长期潜力时，要看其是否在建设：
- 可维护执行器模型
- 可解释 profiling / trace
- 稳定的内存与 spill 机制
- 面向多后端的抽象能力

---

# 结论

从 2026-04-01 的社区动态看，开源 OLAP / 分析存储生态正处在 **平台化深化、Lakehouse 精细化优化、半结构化扩张、正确性优先** 的新阶段。  

**Apache Doris** 在这一生态中的位置非常突出：  
- 社区活跃度处于第一梯队；
- 同时具备数据库产品深度、维护分支成熟度和平台化扩展野心；
- 与 StarRocks 构成当前最强的国产开源 OLAP 双强格局之一；
- 但也因功能面广而面临更高的正确性与兼容性回归压力。

如果你的目标是做技术选型，建议可按如下维度快速筛选：
- **分布式实时分析平台**：Doris / StarRocks
- **本地嵌入式分析**：DuckDB
- **湖表协议与多引擎数据层**：Iceberg / Delta Lake
- **云原生实验性数仓能力**：Databend
- **执行引擎与加速底座**：Velox / Gluten / Arrow

如果你愿意，我可以继续把这份报告整理成两种版本：
1. **管理层摘要版（1页）**
2. **研发选型版（按 Doris / StarRocks / DuckDB / Iceberg 四大阵营展开）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时 DuckDB 社区保持**高活跃度**：Issues 更新 20 条、PR 更新 43 条，但**无新版本发布**。  
从动态看，当前工作重心明显集中在三类：**查询正确性修复、CI/工程体系改进、SQL/JSON/Catalog 能力扩展**。  
已关闭/合并事项较多，说明维护者对回归和边缘缺陷响应较快；但同时，仍有若干**严重稳定性问题**在新增，包括索引创建崩溃、S3 多文件 Parquet 读取内部错误、复杂宏查询性能退化等。  
整体健康度判断为：**开发节奏强，修复效率较好，但 1.5.x 周期内仍处于高密度回归治理阶段**。

---

## 3. 项目进展

> 今日无新版本，以下聚焦于已合并/关闭的重要 PR 与问题处理进展。

### 3.1 查询引擎与 SQL 正确性修复

#### 1) 修复 prepared temp-table INSERT 在 DROP 后失效检测缺失的问题
- **PR**: #21712  
- **状态**: CLOSED / Ready To Merge  
- **链接**: duckdb/duckdb PR #21712

该修复解决了一个典型的**catalog dependency 注册不完整**问题：对临时表的 prepared INSERT 在表被 DROP 后，预编译语句仍可能继续存活并执行，触发 use-after-free 风险。  
这类问题直接影响嵌入式应用、长生命周期连接池和交互式 notebook 场景，属于**高价值稳定性修复**。也说明 DuckDB 正在继续补强 prepared statement 与 catalog invalidation 的一致性语义。

---

#### 2) `SET DEFAULT / DROP DEFAULT` 对存在依赖的表不再被过度阻塞
- **PR**: #21729  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21729

此前 DuckDB 对“存在依赖对象的表”上的 ALTER 操作有较保守的统一限制。该 PR 将不会影响表结构依赖关系的 `SET DEFAULT / DROP DEFAULT` 放开。  
这是一个偏**SQL DDL 兼容性和可用性**的改进，能减少用户在 schema 演化中的不必要阻塞，对 ORM、迁移框架、自动建模工具尤其友好。

---

#### 3) Window function catalog entry 内部建模增强
- **PR**: #21446  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21446

该 PR 将窗口函数目录项从 mock 模式替换为真实 catalog entry，引入 `WINDOW_FUNCTION_ENTRY`。  
这不是直接面向终端用户的 SQL 新功能，但它是**Catalog 体系完善**的重要基础设施，后续有利于：
- 更统一的函数元数据管理
- 更好的 introspection / 系统表能力
- 为扩展与窗口函数注册机制提供更清晰的抽象

属于典型的“**架构性铺路 PR**”。

---

#### 4) Semi HashJoin / IEJoin 内部修正
- **PR**: #21724, #21721  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21724 / duckdb/duckdb PR #21721

两项内部 join 修正分别涉及：
- Semi HashJoin 测试/逻辑修补
- IEJoin 过滤侧生成规则收紧为仅从 RHS 生成

虽然摘要偏内部，但这类改动通常与**复杂谓词 join 的正确性与性能边界**直接相关。说明维护者仍在持续打磨 DuckDB 高性能 join 执行路径中的特殊分支行为。

---

#### 5) 物理算子估计基数信息补全
- **PR**: #21737  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21737

该 PR 为更多 physical operators 补充 `SetEstimatedCardinality()`。  
这类改动通常不会直接改变结果，但会提升：
- explain / profiling 输出可解释性
- 优化器和调试工具的信息完整度
- 性能诊断质量

对性能工程和 benchmark 分析很有帮助。

---

#### 6) path test warning 清理
- **PR**: #21711  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21711

虽是小修，但体现测试卫生在持续改善。对于快速迭代项目，这类噪音清理有助于降低 CI 误报和 review 成本。

---

### 3.2 元数据与扩展可观测性增强

#### 7) 为 `duckdb_functions()` / `duckdb_types()` 增加 `extension_name`
- **PR**: #20752  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #20752

该改动将函数和类型的来源扩展信息暴露到系统表宏中。  
这对 DuckDB 的扩展生态非常关键，能帮助用户：
- 判断函数/类型属于 core 还是 extension
- 做依赖治理与环境排查
- 提升嵌入式部署、serverless 打包、插件冲突排查体验

这是明显的**生态可观测性增强**。

---

### 3.3 基准测试与工程体系推进

#### 8) ClickBench 基准集引入
- **PR**: #21730  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb PR #21730

新增 clickbench 查询列表与保留 benchmark 数据选项。  
这反映出项目继续强化**分析型数据库基准性能回归监控**，对 DuckDB 这类 OLAP 引擎而言非常关键，可帮助更快识别查询计划/执行器性能波动。

---

## 4. 社区热点

### 热点 1：自引用外键的 statement 级约束验证
- **Issue**: #7168  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #7168

这是今天最值得关注的长期问题之一。用户希望对**自引用外键**采用更接近主流数据库的“**语句结束时统一校验**”语义，使得单条 multi-row INSERT 可以一次性插入完整树/图结构。  
背后的技术诉求是：
- 更好的 SQL 标准/主流数据库兼容性
- 减少应用层拆分 INSERT 的复杂度
- 提升图状/层级数据加载体验

这类需求说明 DuckDB 正逐步从“轻量分析引擎”向“更完整 SQL 语义数据库”演进时，会遭遇更多事务/约束时序语义挑战。

---

### 热点 2：自引用外键表无法 TRUNCATE / 全量删除
- **Issue**: #7169  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #7169

与 #7168 同源，这个问题指向**自引用 FK 与表清空操作之间的语义冲突**。  
用户场景很真实：树/图模型经常需要重建，而当前无法直接 truncate。  
技术上反映出 DuckDB 在 referential integrity 与 bulk maintenance 操作之间，仍有待补齐更成熟的约束处理策略。

---

### 热点 3：CSV 路径含 `=` 时误解析出错误列
- **Issue**: #16852  
- **状态**: OPEN  
- **标签**: reproduced, stale, Needs Documentation  
- **链接**: duckdb/duckdb Issue #16852

这是一个非常“产品化”的兼容性问题：当 CSV 文件路径中目录名包含 `=`，DuckDB 会错误增加一列。  
这类问题说明：
- 文件路径/分区推断/参数解析之间可能存在歧义
- 面向数据湖场景的路径处理仍需加强鲁棒性
- 文档与实现语义之间可能存在偏差

对于使用 Hive-style partitioning 或自动生成目录名的用户，这是高频痛点。

---

### 热点 4：查询中断触发 assert（未刷盘块）
- **Issue**: #16921  
- **状态**: OPEN / under review  
- **链接**: duckdb/duckdb Issue #16921

该问题在 query interrupt 后，`task.reset()` 与 checkpoint/unflushed blocks 生命周期交错，可能触发断言。  
背后反映的是 DuckDB 在**并行执行、中断处理、持久化写路径**之间的复杂交互。  
这类 bug 虽不一定高频，但对嵌入式服务、交互式 IDE、超时取消场景影响很大。

---

### 热点 5：新增 `json_strip_nulls()` 提案
- **PR**: #21748  
- **状态**: OPEN  
- **链接**: duckdb/duckdb PR #21748

这个 PR 为 DuckDB 增加 PostgreSQL 风格的 `json_strip_nulls(json)`。  
技术诉求很明确：
- 增强 JSON 函数生态
- 提升 PostgreSQL 兼容性
- 方便半结构化数据清洗

考虑到 DuckDB 当前对 JSON/VARIANT 的持续投入，这类函数进入后续版本的概率较高。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 查询正确性与潜在数据损坏

#### 1) `row_number() OVER (PARTITION BY ...)` 在列顺序不一致时静默交换列值
- **Issue**: #21722  
- **状态**: CLOSED，已标注 fixed on nightly  
- **链接**: duckdb/duckdb Issue #21722

这是今日最严重的问题之一：当 `PARTITION BY` 中列顺序与表 schema 顺序不一致时，输出列值可能被**静默交换**。  
这类问题属于**结果正确性/数据损坏级别**风险。  
好消息是该问题已关闭并在 nightly 修复，说明维护者响应非常迅速。建议依赖窗口函数的用户尽快验证 nightly 或等待后续补丁版本。

---

### P1 / 崩溃与内部错误

#### 2) Ubuntu 24.04 上复合索引创建触发 `free(): corrupted unsorted chunks`
- **Issue**: #21749  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21749

在约 680 万行、25GB 数据库上，单列索引可成功，复合索引稳定崩溃。  
这很可能涉及：
- 索引构建过程中的内存管理错误
- 复合键编码/排序路径问题
- glibc 2.39 下更严格暴露出的 heap corruption

对生产用户而言，这属于**高严重度崩溃问题**，尤其影响大表二级索引构建。

---

#### 3) 读取 S3 上多文件 Parquet 时 `CachingFileHandle` 整数转换信息丢失
- **Issue**: #21669  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21669

DuckDB 在读取大型 S3 多文件 Parquet 数据集时触发：
`INTERNAL Error: Information loss on integer cast ...`  
这对数据湖/对象存储用户影响较大，说明：
- `httpfs` + parquet + multi-file 路径上的 offset/size 计算可能存在边界问题
- 大规模远端扫描场景仍有健壮性缺口

若用户处理如 Overture Maps 这类大体量开放数据，将直接受阻。

---

#### 4) Windows + PyInstaller 场景 `LOAD motherduck` 访问违规
- **Issue**: #21602  
- **状态**: OPEN / under review  
- **链接**: duckdb/duckdb Issue #21602

该问题在 DuckDB 1.5.x 中出现，而 1.4.x 正常，属于明显的**回归**。  
影响人群为：
- Windows 桌面打包应用
- Python 分发程序
- 嵌入式商业应用

这是典型的“扩展加载 + 打包运行时 + 平台兼容性”交叉问题，建议维护者优先处理。

---

#### 5) 复杂 CTE 链绑定失败 / 内部错误
- **Issue**: #21604  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb Issue #21604

涉及复杂 CTE、窗口函数、UNION ALL、LEFT JOIN 的绑定阶段内部错误，且为 1.5.1 回归。  
虽然已关闭，但它和 #21650 一起表明：**复杂 SQL 在 binder/planner 边缘路径上仍存在密集回归修复需求**。

---

#### 6) `Attempted to access index x within vector of size x`
- **Issue**: #21650  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb Issue #21650

另一起内部向量越界类错误，用户也认为可能与 #21604 同根。  
尽管已关闭，但这再次强调当前版本线在复杂查询组合上的稳定性仍需回归测试加固。

---

### P2 / 功能缺失与行为不符

#### 7) `VACUUM FULL` 未实现，删除/Drop 后无法原地回收空间
- **Issue**: #21154  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21154

这不是 crash，但对 OLAP 真实运维场景影响很大。  
用户明确指出：`VACUUM` / `VACUUM ANALYZE` / `CHECKPOINT` 都不能完成期望的空间回收，而 `VACUUM FULL` 直接报未实现。  
对于批量装载、重写、删表重建工作负载，这是非常重要的产品短板。

---

#### 8) `ieee_floating_point_ops` 与文档不符
- **Issue**: #21744  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21744

文档声明默认可返回 IEEE 754 的 NaN，但实际仍报错。  
这属于**实现与文档语义不一致**问题，容易造成用户对数值边界行为的错误预期。

---

#### 9) `secret_directory` 全局设置无效
- **Issue**: #21740  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21740

对 R / Python / client 均不生效，且与 duckdb-R 默认 secret 目录调整有关。  
这是一个偏配置管理和多语言客户端一致性的缺陷，影响凭据管理和部署可控性。

---

#### 10) `all_profiling_output` PRAGMA 失效
- **Issue**: #21735  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21735

报错提示底层表函数不存在，说明 profiling introspection 接口链路存在断裂。  
对性能调优用户来说，这会直接妨碍自动化剖析和计划采集。

---

#### 11) 无法创建空 `VARIANT` 对象
- **Issue**: #21717  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21717

`select {}::VARIANT` 语法失败，而非空对象正常。  
这是一个半结构化类型的边界行为问题，提示 VARIANT 语法/解析器仍需打磨。

---

### P3 / 性能与工具体验

#### 12) 宏查询性能问题，疑似 binder 分析阶段过慢
- **Issue**: #21747  
- **状态**: OPEN  
- **链接**: duckdb/duckdb Issue #21747

用户指出 code-generated SQL 中大量 macro + `CASE WHEN` 组合极慢。  
这很可能不是执行器瓶颈，而是**binder/analysis 阶段复杂度问题**。  
对 BI 生成 SQL、数据建模工具、dbt 风格模板系统影响较大，值得关注。

---

#### 13) dot command 自动补全后需按两次回车
- **Issue**: #21475  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb Issue #21475

CLI 交互小缺陷已关闭，说明维护者也在照顾终端用户体验。

---

#### 14) `COPY ... FROM` 头部检测与文档不一致
- **Issue**: #21653  
- **状态**: CLOSED  
- **链接**: duckdb/duckdb Issue #21653

偏文档/行为一致性问题，已关闭。  
这类收敛有利于降低导入语义歧义。

---

## 6. 功能请求与路线图信号

### 6.1 约束与事务语义增强需求持续升温
- **Issues**: #7168, #7169  
- **链接**: duckdb/duckdb Issue #7168 / duckdb/duckdb Issue #7169

自引用外键相关两个长期 issue 同时活跃，表明用户越来越希望 DuckDB 在：
- deferred constraint checking
- 自引用 FK 的 bulk insert/truncate 语义
- 更贴近 PostgreSQL/传统 RDBMS 的约束行为

这些需求如果进入实现，将是 DuckDB 从分析优先向“分析 + 更完整事务语义”迈进的重要信号。

---

### 6.2 JSON / VARIANT 能力继续扩张
- **PR**: #21748 `json_strip_nulls()`  
- **Issue**: #21717 空 VARIANT 对象  
- **PR**: #21710 重新引入 variant_legacy_encoding 相关设置  
- **链接**: duckdb/duckdb PR #21748 / duckdb/duckdb Issue #21717 / duckdb/duckdb PR #21710

可以看到 DuckDB 正在同时处理：
- JSON 函数丰富化
- VARIANT 语义补边
- Parquet/Delta 相关编码兼容

这说明半结构化数据能力仍是**近期重点投资方向**。  
其中 `json_strip_nulls()` 属于较小而清晰的函数增强，进入下一版本的概率较高。

---

### 6.3 Trigger Catalog 与元数据能力建设值得持续关注
- **PR**: #21438  
- **状态**: OPEN / Ready For Review  
- **链接**: duckdb/duckdb PR #21438

该 PR 为 `CREATE TRIGGER` 加入 catalog storage 和 introspection。  
虽然未必意味着完整 trigger 执行语义即将落地，但至少说明项目在**系统目录、一等对象建模、DDL 元数据管理**上继续深化。  
如果合并，将是 DuckDB SQL 特性覆盖面的一个显著扩展信号。

---

### 6.4 并行扫描与单线程数据源 FanOut
- **PR**: #21739  
- **状态**: OPEN / Changes Requested  
- **链接**: duckdb/duckdb PR #21739

该提案为“天然单线程数据源”加一层可选 FanOut 包装，以释放下游并行处理能力。  
这类优化若成熟，将直接改善：
- 表函数吞吐
- 生产/转换流水线解耦
- CPU 利用率

这是典型的**执行引擎性能路线图信号**，但当前仍处于设计打磨阶段。

---

### 6.5 Join Filter Pushdown 持续精细化
- **PRs**: #21743, #21742  
- **链接**: duckdb/duckdb PR #21743 / duckdb/duckdb PR #21742

两个开放 PR 分别推动：
- integral up/down cast 场景下的 join filter pushdown
- NOP collation 场景下的 join filter pushdown

这说明 DuckDB 仍在持续优化**谓词下推与 join 过滤**，对分析型查询性能有直接价值。  
较可能纳入后续小版本或下一次较大更新。

---

## 7. 用户反馈摘要

### 7.1 用户最真实的痛点仍是“复杂真实 workload 的边缘稳定性”
从 #21669、#21602、#21749、#21604、#21650 来看，用户并不是在跑玩具示例，而是在：
- S3 上扫描超大 Parquet 数据集
- PyInstaller 打包 Windows 应用
- 25GB 数据库上创建复合索引
- 执行包含 CTE / window / union / join 的复杂 SQL

这说明 DuckDB 已深度进入生产与准生产场景，但也因此暴露出更多**边缘路径稳定性问题**。

---

### 7.2 文档与实现一致性仍是用户体验关键短板之一
- `COPY FROM` 头部检测（#21653）
- `ieee_floating_point_ops` 行为（#21744）
- `all_profiling_output` 失效（#21735）
- `secret_directory` 设置不生效（#21740）

这类问题未必最严重，但会快速损害用户对“文档即契约”的信任感。  
对于一个快速扩张的数据库项目，文档与行为对齐同样影响采用率。

---

### 7.3 兼容 PostgreSQL/传统数据库语义的期待在增强
- 自引用 FK deferred validation（#7168）
- truncate 自引用表（#7169）
- `json_strip_nulls`（#21748）
- trigger catalog（#21438）

越来越多请求体现出用户在把 DuckDB 当作**更完整 SQL 数据库能力平台**来使用，而不仅仅是本地分析引擎。

---

### 7.4 性能问题开始从“执行慢”转向“分析阶段复杂度”
- **Issue**: #21747  
- **链接**: duckdb/duckdb Issue #21747

宏 + 大量 `CASE WHEN` 的场景，用户怀疑慢点在 binder。  
这很典型：当执行器足够强后，用户开始把压力转移到 SQL 生成规模、模板膨胀、编译/绑定复杂度上。  
这是 OLAP 引擎成熟阶段常见信号。

---

## 8. 待处理积压

### 8.1 自引用外键相关长期问题
- **#7168** Defer foreign key constraint validation until the end of the statement  
  链接: duckdb/duckdb Issue #7168
- **#7169** Can't truncate table containing self references  
  链接: duckdb/duckdb Issue #7169

二者创建于 2023 年，至今仍活跃，说明该类问题并不边缘，而是**长期未解的语义缺口**。建议维护者将其纳入更系统的 FK/constraint 行为梳理。

---

### 8.2 CSV 路径含 `=` 的列解析问题
- **#16852** Reading CSV File with an '=' in Title Adds A Column Incorrectly  
- **链接**: duckdb/duckdb Issue #16852

该问题带有 `Needs Documentation`，且 stale 仍在更新。  
考虑到它影响数据湖目录命名兼容性，建议尽快明确：是实现 bug、路径分区解析设计问题，还是文档需修正。

---

### 8.3 查询中断导致 assert
- **#16921** Assert triggers when interrupting a query that has unflushed blocks  
- **链接**: duckdb/duckdb Issue #16921

虽已 under review，但属于涉及并发/持久化生命周期的复杂问题。  
这类问题一旦拖久，容易在 timeout/cancel 驱动的服务端场景中演变成顽固稳定性隐患。

---

### 8.4 空间回收能力缺失
- **#21154** VACUUM FULL not implemented  
- **链接**: duckdb/duckdb Issue #21154

这是产品层面的长期短板，不是单点 bug。  
随着 DuckDB 被越来越多地用于持久化 OLAP 工作负载，磁盘空间回收机制的缺失会持续成为 adoption barrier。

---

## 总结判断

今天的 DuckDB 展现出典型的**高速演进型数据库项目画像**：  
一方面，PR 合并节奏快，能够迅速关闭回归和正确性问题，尤其是窗口函数结果错误这类高危缺陷；另一方面，随着应用场景深入生产环境，围绕**复杂 SQL、对象存储、索引、大规模数据、打包部署、半结构化数据**的边缘问题仍在持续涌现。  

从路线图信号看，后续值得重点关注：
1. **JSON/VARIANT 功能扩展**
2. **Catalog/Trigger/函数元数据基础设施**
3. **Join pushdown 与单线程源并行化**
4. **约束语义与 PostgreSQL 兼容性补齐**
5. **运维能力补课，如空间回收与配置一致性**

整体评价：**项目活跃且健康，但当前版本线仍需继续消化稳定性与兼容性债务。**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持**高活跃度**：Issues 更新 14 条，PR 更新 126 条，代码与文档推进都很密集。  
从内容看，今日重心明显集中在 **Iceberg 外表优化、查询正确性修复、低基数字符串优化、MV/IVM 稳定性增强、安全依赖升级** 几条主线上。  
风险层面，社区今天暴露出若干 **高优先级稳定性问题**，包括 FE OOM、CN SIGSEGV、use-after-free、查询结果错误、NPE 与 CVE 依赖漏洞，但不少问题已经出现对应修复 PR，说明响应速度较快。  
整体判断：**项目健康度良好，研发节奏快，但 4.x 分支在外表、MV 重写和执行引擎边界条件上仍处于高频打磨阶段。**

---

## 2. 项目进展

> 今日无新版本发布。

### 2.1 查询引擎与执行层推进

- **修复并行 segment/rowset 加载错误路径中的 use-after-free**
  - PR: [#71083](https://github.com/StarRocks/starrocks/pull/71083)
  - 状态: OPEN
  - 影响: 针对 BE 在错误路径下的内存安全问题，属于典型高危稳定性修复，涉及并行加载场景，预期可降低异常查询/加载时的崩溃风险。

- **支持 inline agg state**
  - PR: [#70958](https://github.com/StarRocks/starrocks/pull/70958)
  - 状态: OPEN / PROTO-REVIEW
  - 影响: 这是较重要的执行层增强信号，可能与聚合状态内联表示、减少中间对象/内存开销、提升聚合路径性能有关，值得持续关注。

- **为 physical filter 启用 dictification**
  - PR: [#71093](https://github.com/StarRocks/starrocks/pull/71093)
  - 状态: OPEN
  - 影响: 低基数字符串优化继续扩展到 physical filter，意味着查询执行中更多过滤场景可利用字典编码，降低 CPU 与内存开销。

- **扩展 LOW_CARD_STRING_FUNCTIONS**
  - PR: [#71094](https://github.com/StarRocks/starrocks/pull/71094)
  - 状态: OPEN
  - 影响: 与上条形成配套，说明低基数优化正在从算子层延展到函数层，属于持续性性能工程。

- **修复 unary functions 统计信息传播缺失**
  - PR: [#71087](https://github.com/StarRocks/starrocks/pull/71087)
  - 状态: OPEN
  - 影响: 优化器统计估算更准确，利于计划质量稳定，减少因 `unknown()` 统计信息导致的次优计划。

### 2.2 Iceberg / 外部数据湖能力持续增强

- **利用 Iceberg manifest metadata 直接回答 COUNT(*)/COUNT(1)**
  - PR: [#71097](https://github.com/StarRocks/starrocks/pull/71097)
  - 状态: OPEN
  - 影响: 这是今天最值得关注的外表性能优化之一。对于无 GROUP BY 的 count 查询，可绕过完整文件规划；对部分场景还能在 FE 侧短路计算，显著降低规划与扫描成本。

- **基于 runtime filter min/max 与 manifest stats 的 Iceberg 文件级跳过**
  - PR: [#71098](https://github.com/StarRocks/starrocks/pull/71098)
  - 状态: OPEN
  - 对应 Issue: [#71005](https://github.com/StarRocks/starrocks/issues/71005)
  - 影响: 在 DPP 已做分区级裁剪后，继续做文件级 pruning，是 Iceberg 星型查询性能优化的典型方向，说明 StarRocks 正加速推进 lakehouse 场景下的精细化跳读。

- **修复 Java 17 下 Iceberg 远端元数据规划兼容性问题**
  - PR: [#71096](https://github.com/StarRocks/starrocks/pull/71096)
  - 状态: OPEN
  - 影响: 针对 kryo serializer 依赖在 Java 17 模块系统下的反射限制问题，属于兼容性与生产可用性修复。

### 2.3 MV / IVM / SQL 行为与兼容性

- **修复 IVM 刷新记录不完整的 PCT 分区元数据**
  - PR: [#71092](https://github.com/StarRocks/starrocks/pull/71092)
  - 状态: OPEN
  - 影响: 与增量物化视图刷新正确性相关，直接关系到分区级增量维护的可靠性。

- **支持 CTE materialization hints**
  - PR: [#70802](https://github.com/StarRocks/starrocks/pull/70802)
  - 状态: CLOSED
  - 影响: 该特性已关闭收口，意味着用户未来可更显式控制 CTE 物化/内联策略，帮助复杂 SQL 做性能调优，也体现 SQL 行为控制能力增强。
  - 备注: 标记为 `behavior_changed`，后续版本文档需同步提示。

- **修复向 Hive CSV 表写入 array 类型**
  - PR: [#71089](https://github.com/StarRocks/starrocks/pull/71089)
  - 状态: CLOSED / backport
  - 影响: 提升 Hive 兼容性与外表写出一致性，属于实用型兼容修复。

- **修复 LEAD/LAG 窗口函数低基数重写崩溃**
  - PR: [#71090](https://github.com/StarRocks/starrocks/pull/71090)
  - 状态: CLOSED / backport
  - 影响: 典型 SQL 执行正确性与稳定性修复，说明低基数优化在窗口函数路径上已有线上经验反馈并完成补丁回传。

### 2.4 安全与可观测性

- **StmtExecutor 日志/明文 SQL 中脱敏凭证**
  - PR: [#71095](https://github.com/StarRocks/starrocks/pull/71095)
  - 状态: OPEN
  - 影响: 安全治理的重要改进，减少凭证在 query-info / detail / log 路径中泄露的可能，且标记为 `behavior_changed`，对审计输出有直接影响。

- **修复 pprof CVE**
  - PR: [#71080](https://github.com/StarRocks/starrocks/pull/71080)
  - 状态: OPEN
  - 影响: 依赖升级型安全修复，体现项目对供应链风险的持续响应。

- **BE thrift 从 0.20 升级到 0.22**
  - PR: [#70822](https://github.com/StarRocks/starrocks/pull/70822)
  - 状态: OPEN / PROTO-REVIEW
  - 影响: 基础设施升级，可能为后续协议栈、安全修复或性能改进铺路。

---

## 3. 社区热点

### 3.1 FE 因 Iceberg 百万分区表而 OOM
- Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- 状态: OPEN
- 热度: 评论 8

这是今天最值得关注的用户反馈之一。用户在 **40GB Pod、24GB JVM** 的 FE 环境中，因 `partitionCache` 对 Iceberg 百万分区表进行**全量 eager loading** 导致 OOM。  
背后的技术诉求非常明确：**StarRocks 对超大分区 lakehouse catalog 的元数据访问必须从“全量加载”转向“按需加载 / 惰性分页 / 元数据裁剪”**。  
这类问题不只是单点 bug，而是 Iceberg 超大规模生产场景的架构适配问题，对 FE 内存模型影响深远。

### 3.2 Iceberg 查询优化需求迅速转化为 PR
- Issue: [#71005](https://github.com/StarRocks/starrocks/issues/71005)
- PR: [#71098](https://github.com/StarRocks/starrocks/pull/71098)

用户提出希望在 `open()` 之前，利用 runtime filter min/max 与 manifest stats 跳过无关文件；当天即出现对应 PR。  
这说明：
1. 社区对 **Iceberg 文件级裁剪** 的需求已非常具体；
2. 维护者对 lakehouse 性能问题响应较快；
3. 这类优化很可能会进入后续 4.0/4.1 维护分支或 4.2 功能演进中。

### 3.3 文档侧开始补齐 JDBC Driver 生态
- PR: [#71099](https://github.com/StarRocks/starrocks/pull/71099)

StarRocks 新 JDBC Driver 配套文档已启动补全，包括 DataGrip 使用说明。  
这释放出一个明确信号：项目不仅关注内核，也在补齐 **开发工具链接入体验**，对 BI / IDE 用户群体是正向进展。

### 3.4 SELECT 参考文档重构
- PR: [#71071](https://github.com/StarRocks/starrocks/pull/71071)

文档结构重构通常意味着语法面与行为面正在趋于稳定，也可能是在为后续 SQL 特性扩张做铺垫。

---

## 4. Bug 与稳定性

以下按严重程度整理今日暴露或活跃的稳定性问题，并标注是否出现潜在修复方向。

### P0 / 高危

1. **FE OOM：Iceberg 百万分区表 partitionCache 全量加载**
   - Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - 状态: OPEN
   - 现象: FE JVM 内存耗尽并崩溃
   - 场景: Iceberg catalog + 百万分区表
   - fix PR: 暂未看到直接修复 PR
   - 评估: 对大规模 lakehouse 用户影响极大，建议优先级提升。

2. **CN SIGSEGV：FlatJsonColumnWriter::finish() 在 Iceberg 表异步 MV 刷新中崩溃**
   - Issue: [#69260](https://github.com/StarRocks/starrocks/issues/69260)
   - 状态: OPEN
   - 现象: CN 进程崩溃
   - 场景: shared-data / lake mode，Iceberg + boolean 列 + async MV refresh
   - fix PR: 暂未看到直接修复 PR
   - 评估: 属于进程级崩溃，且牵涉 FlatJSON 与 MV 刷新路径，风险较高。

3. **并行 segment/rowset 加载错误路径 use-after-free**
   - PR: [#71083](https://github.com/StarRocks/starrocks/pull/71083)
   - 状态: OPEN
   - 现象: 可能触发进程 abort / 崩溃
   - 评估: 虽以 PR 形式出现，但从问题性质看是高危内存安全问题，值得尽快合并回补。

4. **visitDictionaryGetExpr 空指针：源表已删除时 table.getName() 调用 null**
   - Issue: [#71070](https://github.com/StarRocks/starrocks/issues/71070)
   - 状态: OPEN
   - 现象: SQL Analyzer NPE
   - fix PR: 暂未看到直接修复 PR
   - 评估: 典型生命周期边界条件漏洞，容易在元数据并发变更场景触发。

### P1 / 查询正确性

5. **多阶段 MV rewrite 导致查询结果错误**
   - Issue: [#71058](https://github.com/StarRocks/starrocks/issues/71058)
   - 状态: OPEN
   - fix PR: 暂未看到直接修复 PR
   - 评估: 结果正确性问题优先级很高，尤其涉及 MV rewrite，可能影响生产报表可信度。

6. **optimizer bug**
   - Issue: [#71057](https://github.com/StarRocks/starrocks/issues/71057)
   - 状态: OPEN
   - fix PR: 暂未看到直接修复 PR
   - 评估: 由 sqlancer 风格 SQL 触发，说明优化器边界测试仍持续暴露问题。

7. **json function 返回结果不一致**
   - Issue: [#68789](https://github.com/StarRocks/starrocks/issues/68789)
   - 状态: OPEN
   - 场景: `flat_json.enable = true`
   - 评估: JSON 与 FlatJSON 路径的一致性仍需打磨。

8. **integration test `test_limit` 失败**
   - Issue: [#70536](https://github.com/StarRocks/starrocks/issues/70536)
   - 状态: OPEN
   - 现象: `limit offset,count` 结果与预期不符
   - 评估: 若能稳定复现，可能是 SQL 基础语义回归。

9. **使用 ORDER BY 时 count() 结果错误**
   - Issue: [#70904](https://github.com/StarRocks/starrocks/issues/70904)
   - 状态: CLOSED
   - 评估: 问题已关闭，说明相关正确性缺陷已有处理或归因完成，但仍建议后续关注是否有公开 fix PR 关联。

10. **now() - max(timestamp) 在每分钟前几秒差值异常**
    - Issue: [#70669](https://github.com/StarRocks/starrocks/issues/70669)
    - 状态: CLOSED
    - 评估: 时间函数/类型处理边界问题已被收敛。

### P1 / 安全与依赖

11. **Netty CVE-2026-33870 / CVE-2026-33871**
    - Issue: [#71015](https://github.com/StarRocks/starrocks/issues/71015)
    - 状态: OPEN
    - 建议: 升级到 `io.netty 4.1.132.Final`，并替换 `software.amazon.awssdk:bundle`
    - fix PR: 今日未见直接对应 PR
    - 评估: 属于依赖供应链风险，应尽快纳入维护分支。

12. **pprof CVE 修复**
    - PR: [#71080](https://github.com/StarRocks/starrocks/pull/71080)
    - 状态: OPEN
    - 评估: 安全响应在推进中。

13. **StmtExecutor SQL 路径凭证脱敏**
    - PR: [#71095](https://github.com/StarRocks/starrocks/pull/71095)
    - 状态: OPEN
    - 评估: 偏“安全增强”而非传统 bugfix，但对生产环境合规非常关键。

---

## 5. 功能请求与路线图信号

### 5.1 Iceberg 深度优化进入实做阶段
- Issue: [#71005](https://github.com/StarRocks/starrocks/issues/71005)
- PR: [#71098](https://github.com/StarRocks/starrocks/pull/71098)
- PR: [#71097](https://github.com/StarRocks/starrocks/pull/71097)

从“运行时过滤结合 manifest stats 做文件级跳过”，到“manifest 元数据直接回答 count”，可以看出 StarRocks 正在把 Iceberg 支持从“可查询”推进到“高效率查询”。  
**判断：这类能力非常可能被纳入后续 4.0/4.1 补丁版本或 4.2 的 lakehouse 优化主线。**

### 5.2 UDF 支持从 S3/HDFS 下载
- Issue: [#28937](https://github.com/StarRocks/starrocks/issues/28937)
- 状态: OPEN
- 标签: `type/feature-request, version:4.2`

这是一个很强的路线图信号。Issue 明确带有 `version:4.2`，且摘要中已引用相关 PR 线索，说明该需求**大概率已进入计划池**。  
这将提升 UDF 在对象存储/分布式文件系统环境中的可部署性，对云原生用户尤其重要。

### 5.3 URL Function Implementation 仍在推进
- PR: [#66206](https://github.com/StarRocks/starrocks/pull/66206)
- 状态: OPEN / PROTO-REVIEW

这是一个长期 PR，且提到 SSRF 风险处理。  
说明 StarRocks 在扩展 URL 类函数时，已将**安全性**作为设计前提，而不是单纯增加函数能力。

### 5.4 CTE 物化 Hint 已进入功能落地
- PR: [#70802](https://github.com/StarRocks/starrocks/pull/70802)
- 状态: CLOSED

这表明 SQL 调优可控性正在增强。对于复杂分析查询，这类 hint 常是高级用户的真实需求。

---

## 6. 用户反馈摘要

根据今日 Issues 内容，可以提炼出几类真实用户痛点：

1. **大规模 Iceberg 元数据场景下 FE 资源压力过大**
   - 代表: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - 用户真实环境是百万分区、有限 JVM 内存，不是实验场景。
   - 诉求不是“功能可用”，而是“在极端规模下仍能稳定运行”。

2. **Lakehouse + MV + JSON 组合路径仍存在复杂边界问题**
   - 代表: [#69260](https://github.com/StarRocks/starrocks/issues/69260), [#71058](https://github.com/StarRocks/starrocks/issues/71058), [#68789](https://github.com/StarRocks/starrocks/issues/68789)
   - 用户正在把 StarRocks 用在更复杂的混合场景中：外表、物化视图、半结构化数据一起用。
   - 这意味着核心挑战已从“单功能正确”升级为“多特性交互正确”。

3. **SQL 正确性仍是最敏感反馈点**
   - 代表: [#70904](https://github.com/StarRocks/starrocks/issues/70904), [#70536](https://github.com/StarRocks/starrocks/issues/70536), [#70669](https://github.com/StarRocks/starrocks/issues/70669), [#71057](https://github.com/StarRocks/starrocks/issues/71057)
   - 用户对 count、limit、时间差、优化器 rewrite 等基础行为非常敏感。
   - 任何“偶发错误结果”都比单纯性能问题更容易影响生产信任。

4. **安全与合规诉求正在上升**
   - 代表: [#71015](https://github.com/StarRocks/starrocks/issues/71015), [#71095](https://github.com/StarRocks/starrocks/pull/71095)
   - 用户不仅关注查询性能，也关注依赖漏洞与日志脱敏，说明 StarRocks 正进入更严格的企业生产治理场景。

---

## 7. 待处理积压

以下长期或值得提醒维护者关注的条目，建议提高可见度：

1. **UDF 支持从 S3/HDFS 下载**
   - Issue: [#28937](https://github.com/StarRocks/starrocks/issues/28937)
   - 创建于: 2023-08-09
   - 状态: OPEN
   - 原因: 时间跨度长，但已有 4.2 标签与关联 PR 线索，建议明确里程碑和交付预期。

2. **URL Function Implementation**
   - PR: [#66206](https://github.com/StarRocks/starrocks/pull/66206)
   - 创建于: 2025-12-02
   - 状态: OPEN / PROTO-REVIEW
   - 原因: 长期开发中，且涉及 SSRF 风险，建议尽快给出范围收敛或拆分计划。

3. **FE OOM on Iceberg millions partitions**
   - Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - 创建于: 2026-01-12
   - 状态: OPEN
   - 原因: 虽不算最老，但影响面大、严重度高，目前尚未见直接修复 PR，应重点跟踪。

4. **FlatJSON + Iceberg + async MV refresh SIGSEGV**
   - Issue: [#69260](https://github.com/StarRocks/starrocks/issues/69260)
   - 创建于: 2026-02-13
   - 状态: OPEN
   - 原因: 涉及进程崩溃，且影响 shared-data 模式，建议尽快补充 root cause 与修复计划。

---

## 8. 结论

今天的 StarRocks 呈现出非常典型的“**高速迭代中的成熟 OLAP 项目**”状态：  
一方面，PR 数量极高，围绕 **Iceberg 性能、低基数优化、MV 刷新、SQL 兼容、日志脱敏、安全升级** 持续推进；另一方面，也暴露出 **lakehouse 超大规模元数据、复杂特性交互、查询正确性边界** 上的压力。  

积极信号在于：  
- 外表优化需求到实现 PR 的转化速度很快；  
- 高风险问题已有多项修复在路上；  
- 文档和 JDBC 生态也在同步补齐。  

需要重点盯防的是：  
- **查询正确性问题**不能积累；  
- **Iceberg 大规模元数据内存模型**需要系统性治理；  
- **MV/JSON/外表组合路径**仍需更多回归测试覆盖。  

如果你愿意，我还可以继续把这份日报整理成更适合团队周会使用的 **“管理层简报版”** 或 **“研发跟进清单版”**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报 — 2026-04-01

## 1. 今日速览

过去 24 小时 Apache Iceberg 社区保持**高活跃度**：Issues 更新 15 条、PR 更新 50 条，代码与设计讨论同时推进。  
从主题分布看，今天的工作重点集中在 **Spark 查询正确性修复、Kafka Connect 类型/时间格式兼容、REST/OpenAPI 演进、以及 v4 规范与 Variant 类型能力建设**。  
已关闭/合并事项虽不算很多，但关闭的 PR 和 Issue 多与**历史遗留问题清理、规范演进、Spark/Flink 稳定性修复**有关，说明项目在继续压缩技术债。  
整体健康度评价为 **积极偏稳健**：主线功能仍在扩展，但也暴露出若干跨引擎一致性、缓存语义、连接器时间解析等高影响问题，需继续关注回归风险。

---

## 3. 项目进展

> 今日无新版本发布。

### 3.1 已合并/关闭的重要 PR

#### 1) Spark 4.1 异步 microbatch 计划缺陷修复已关闭
- **PR**: #15670 `Spark 4.1: Fix async microbatch plan bugs`
- **状态**: CLOSED
- **链接**: apache/iceberg PR #15670

**进展解读：**  
该 PR 聚焦 Spark 4.1 流式/微批处理中的异步执行计划问题，涉及 snapshot id 比较逻辑与停止条件。虽然这里显示为 closed，未明确是否合并，但从主题判断，这类修复直接影响 **Structured Streaming 与 Iceberg snapshot 驱动消费语义**，属于查询正确性和流处理稳定性的核心区域。  
这说明社区正在积极适配 **Spark 4.1 新行为**，并处理 review 过程中暴露的边界条件。

---

#### 2) v4 manifest 支撑基础类型 PR 已关闭
- **PR**: #15049 `API, Core: Introduce foundational types for V4 manifest support`
- **状态**: CLOSED
- **链接**: apache/iceberg PR #15049

**进展解读：**  
该变更为 **v4 adaptive metadata tree / manifest 支持**铺设底层类型基础，是 Iceberg 元数据层长期演进的重要信号。即使今天呈现为关闭，其内容表明社区正持续推进 **下一代元数据组织方式**，目标可能包括：
- 更高效的 manifest 读写；
- 改善大表元数据扩展性；
- 为单文件提交/自适应元数据树等方案做准备。

这是偏底层但战略意义很强的一类工作。

---

#### 3) OpenAPI 中 S3 签名端点提升为主规范已关闭
- **PR**: #15450 `OpenAPI: Promote the S3 signing endpoint to the main spec`
- **状态**: CLOSED
- **链接**: apache/iceberg PR #15450

**进展解读：**  
该 PR 将 S3 远程签名端点从 AWS 特定实现提升为 REST Catalog 主规范的一部分。其意义在于：
- 把对象存储签名能力从“厂商特定扩展”推进为“通用 API 能力”；
- 为 **GCS、Azure 等其他存储后端**复用同类机制创造条件；
- 强化 REST Catalog 作为多云统一元数据平面的定位。

这属于 **API 标准化和生态互操作性**的重要进展。

---

#### 4) Flink Sink 可扩展性支持 PR 关闭
- **PR**: #15316 `Flink: Add extensibility support to IcebergSink for downstream composition`
- **状态**: CLOSED
- **链接**: apache/iceberg PR #15316

**进展解读：**  
该 PR 设计了 `CommittableMetadata` 等组合式扩展点，目标是让下游系统能够在 sink 提交流水线中附加自定义元数据。  
即便当前为 closed，这反映出 Flink sink 方向上的真实需求：
- 下游 connector/平台方希望增强 commit 元数据；
- 需要更灵活地适配企业内部审计、血缘、回调或补充控制面信息；
- Flink sink 的框架性扩展正成为讨论重点。

---

### 3.2 已关闭的重要 Issues

#### 5) Spark + Hive3 兼容诉求关闭
- **Issue**: #14082 `Support Hive3 when using Iceberg with Spark`
- **状态**: CLOSED
- **链接**: apache/iceberg Issue #14082

**解读：**  
问题指向 Spark 的 Hive3 isolated classloader 机制无法自然作用到 Iceberg 路径中，说明 **Spark-Hive-Iceberg 三方集成**仍存在类加载兼容鸿沟。该 issue 关闭并不一定意味着彻底解决，也可能是 stale 关闭；对生产用户而言，这类问题仍应视作生态兼容风险点。

---

#### 6) Spark 存储过程 `rewrite_position_delete_files` 命名冲突问题关闭
- **Issue**: #14056 `Cannot run rewrite_position_delete_files on a table that has a column named partition`
- **状态**: CLOSED
- **链接**: apache/iceberg Issue #14056

**解读：**  
这是典型的 SQL/过程参数命名冲突问题。若真正得到修复，将改善 Spark 侧管理过程的健壮性与 SQL 兼容性，特别是对字段名与系统关键字/保留字重叠的表结构更友好。

---

#### 7) Spark2 测试假设清理 Issue 关闭
- **Issue**: #15821 `Remove tests assumption for Spark2`
- **状态**: CLOSED
- **链接**: apache/iceberg Issue #15821

**解读：**  
这是一个清理技术债的信号：**Spark 2 兼容已成为过去式**，测试和假设正在向 Spark 3/4 时代收敛。对维护成本和 CI 稳定性有正向意义。

---

## 4. 社区热点

### 热点 1：REST Catalog OAuth2 refresh_token 支持诉求持续活跃
- **Issue**: #12196 `[REST Catalog] OAuth 2 grant type "refresh_token" not implemented`
- **评论**: 13
- **链接**: apache/iceberg Issue #12196

**技术诉求分析：**  
这是今天评论最多的 issue。核心诉求是：在 OAuth endpoint 弃用之后，REST Catalog 应完整支持 RFC 6749 的 `refresh_token` 流程。  
背后反映出：
- 企业级部署越来越依赖 **长期运行服务/作业的 token 续期**；
- REST Catalog 正从“功能可用”向“生产级身份治理”迈进；
- 安全与认证能力已经成为 Iceberg REST 生态的关键阻塞项，而非边缘需求。

这是一个明显的 **平台化/企业化信号**。

---

### 热点 2：Parquet VariantVisitor 支撑 MERGE INTO
- **Issue**: #14707 `Implement VariantVisitor (parquet) to support MERGE INTO operations`
- **评论**: 5
- **链接**: apache/iceberg Issue #14707

**技术诉求分析：**  
随着 Variant 类型能力逐步扩展，用户不再满足于“能存能读”，而开始要求：
- 在 Parquet 中完整支持 Variant schema visitor；
- 支撑 `MERGE INTO` 等复杂 SQL 写入语义；
- 打通类型系统、文件格式、查询引擎之间的闭环。

这与今天多个 Variant 相关 PR 形成呼应，说明 **Variant 已进入从实验性能力走向可用性完善阶段**。

---

### 热点 3：Spark 时间旅行/快照查询缓存错误
- **Issue**: #15741 `Running 2 queries on the same table but different snapshot ID...`
- **评论**: 4
- **链接**: apache/iceberg Issue #15741
- **关联修复 PR**: #15840
- **链接**: apache/iceberg PR #15840

**技术诉求分析：**  
这是今天最值得关注的查询正确性问题之一：同一张表查询不同 snapshot id 时，Spark 可能返回前一次 snapshot 的结果。  
其根因已经被 PR #15840 指向：`SparkTable.equals/hashCode` 仅比较表名，忽略 snapshotId 和 branch，导致 Spark cache 误判相等。  
这类问题的影响很大，因为它破坏了：
- time travel 语义可信度；
- branch/query isolation；
- 用户对 Iceberg 历史查询结果的信任。

---

### 热点 4：Kafka Connect VARIANT 与时间戳兼容能力同时升温
- **PR**: #15283 `Kafka Connect: Support VARIANT when record convert`
- **链接**: apache/iceberg PR #15283
- **Issue**: #15838 `Sink connector crashes on timestamps with fractional seconds and colon-separated UTC offset (+HH:MM)`
- **链接**: apache/iceberg Issue #15838
- **Fix PR**: #15839
- **链接**: apache/iceberg PR #15839

**技术诉求分析：**  
Kafka Connect 正成为 Iceberg 用户的重要入口，今天热点集中在两个方向：
1. **半结构化数据写入能力增强**：支持将 Java Map/List/primitive 转为 Iceberg Variant；
2. **时间格式鲁棒性修复**：兼容带小数秒且时区偏移为 `+HH:MM` 的 timestamp 字符串。

说明连接器用户已经不再只是“批量搬表”，而是在真实处理：
- schema-flexible 事件流；
- 多源系统异构时间格式；
- 更复杂的 CDC / 事件湖仓场景。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1 / 高严重：Spark 时间旅行查询结果错误
- **Issue**: #15741
- **标题**: 不同 snapshot ID 的连续查询返回同一份旧结果
- **链接**: apache/iceberg Issue #15741
- **修复 PR**: #15840
- **链接**: apache/iceberg PR #15840

**影响面：** Spark、time travel、branch 查询、结果正确性。  
**风险判断：** 高。该问题会直接导致用户读到错误历史数据，属于“静默错误”型缺陷。  
**当前状态：** 已有针对性修复 PR，值得维护者优先评审。

---

### P1 / 高严重：Flink 2.0 DynamicIcebergSink 恢复过程中丢提交
- **Issue**: #14090
- **链接**: apache/iceberg Issue #14090

**影响面：** Flink 2.0 sink、故障恢复、提交一致性。  
**风险判断：** 高。恢复期间丢 commit 可能造成数据丢失或 checkpoint 语义破坏。  
**现状：** 今日仍活跃，未见明确 fix PR。  
**核心症状：** `DynamicWriteResultAggregator` 聚合逻辑可能生成多个 committables，导致表/分支/checkpoint 维度下的提交不一致。

---

### P1 / 高严重：Kafka Connect Sink 时间戳解析崩溃
- **Issue**: #15838
- **链接**: apache/iceberg Issue #15838
- **修复 PR**: #15839
- **链接**: apache/iceberg PR #15839

**影响面：** Kafka Connect sink、带小数秒和 `+HH:MM` 时区偏移的字符串时间戳。  
**风险判断：** 高。属于 connector 运行时直接 crash 的问题。  
**当前状态：** 已有快速 fix PR，响应及时，显示连接器方向维护较积极。

---

### P2 / 中高严重：嵌套字段作为 identifier 时无法按列读取
- **Issue**: #15826
- **链接**: apache/iceberg Issue #15826

**影响面：** 标识列语义、嵌套字段、列裁剪读取。  
**风险判断：** 中高。`select *` 正常但单列读取报错，说明在 projection / identifier 绑定逻辑中存在缺陷。  
**现状：** 暂未看到关联 fix PR。

---

### P2 / 中高严重：Spark runtime 4.0_2.13 的 sources/javadoc JAR 为空
- **Issue**: #15824
- **链接**: apache/iceberg Issue #15824

**影响面：** 开发者体验、IDE 调试、依赖发布质量。  
**风险判断：** 中。不会影响运行时，但会明显影响使用和二次开发体验。  
**现状：** 暂未见 fix PR。

---

### P2 / 中严重：Hive 建表阶段未尊重 `HIVE_LOCK_ENABLED`
- **Issue**: #14237
- **链接**: apache/iceberg Issue #14237

**影响面：** Hive 集成、锁语义、建表一致性。  
**风险判断：** 中。涉及表创建时锁策略错误回退到配置默认值，可能导致并发行为偏离预期。  
**现状：** 长期存在，今天仍活跃。

---

### P3 / 中等：manifest 压缩属性与 rewrite_manifests 预期不一致
- **Issue**: #14231
- **链接**: apache/iceberg Issue #14231

**影响面：** pyiceberg、manifest 文件压缩配置认知。  
**风险判断：** 中等。更多是配置行为与用户预期不一致，但也暴露了文档/实现边界不清的问题。

---

## 6. 功能请求与路线图信号

### 6.1 REST Catalog 安全能力增强可能进入后续版本
- **Issue**: #12196 `OAuth refresh_token`
- **链接**: apache/iceberg Issue #12196

**判断：较可能进入后续版本。**  
原因：
- 企业部署需求明确；
- 与 REST Catalog 规范成熟度直接相关；
- 安全认证链路是 adoption 的关键门槛。

---

### 6.2 Variant 能力正在快速补齐，可能成为下一阶段重点
- **Issue**: #14707 `Parquet VariantVisitor for MERGE INTO`
- **链接**: apache/iceberg Issue #14707
- **PR**: #15283 `Kafka Connect: Support VARIANT when record convert`
- **链接**: apache/iceberg PR #15283
- **PR**: #15385 `Spark: Support variant_get predicate pushdown for file skipping`
- **链接**: apache/iceberg PR #15385

**判断：非常强的路线图信号。**  
今天 Variant 相关工作同时出现在：
- 文件格式层：Parquet visitor；
- 连接器层：Kafka Connect RecordConverter；
- 查询优化层：Spark predicate pushdown / file skipping。

这说明社区不是零散修补，而是在系统性打磨 **Variant 端到端能力**。

---

### 6.3 Spark snapshot properties 正在向统一行为收敛
- **PR**: #15842 `Support session-level snapshot properties for actions`
- **链接**: apache/iceberg PR #15842
- **PR**: #15836 `Apply custom snapshot properties to Metadata-Only DELETE operations`
- **链接**: apache/iceberg PR #15836

**判断：较可能纳入下一版本。**  
这类改动虽不“显眼”，但对企业治理、审计、作业标记非常重要。  
趋势是把 `spark.sql.iceberg.snapshot-property.*` 从普通写入路径扩展到：
- action-based procedures；
- metadata-only DELETE 等特殊提交路径。

这会提升 Spark 侧行为一致性。

---

### 6.4 v4 规范持续推进
- **PR**: #15630 `[SPEC] Add relative paths to v4 spec`
- **链接**: apache/iceberg PR #15630
- **PR**: #15049 `foundational types for V4 manifest support`
- **链接**: apache/iceberg PR #15049

**判断：中长期主线。**  
v4 相关讨论已不局限于愿景层，而是在规范文本和 core 基础类型两侧同步推进，说明 Iceberg 正在为更大规模元数据与更灵活部署模型做准备。

---

### 6.5 OpenAPI / REST 函数支持逐步成型
- **PR**: #15180 `REST spec: add list/load function endpoints to OpenAPI spec`
- **链接**: apache/iceberg PR #15180

**判断：值得关注。**  
如果最终落地，REST Catalog 将不仅暴露表/命名空间，还可能更系统地暴露函数元数据，这对 SQL 引擎互联、目录服务和统一控制面都有促进作用。

---

## 7. 用户反馈摘要

### 7.1 用户对“查询正确性”高度敏感
- **Issue**: #15741
- **链接**: apache/iceberg Issue #15741

Spark 用户在实际 Scala/Spark SQL 场景中发现，连续查询不同 snapshot 却返回相同结果。这说明生产用户已深度依赖 **time travel** 做审计、回溯或比对，一旦缓存语义有误，影响远大于普通功能缺失。

---

### 7.2 流式和连接器用户更关注“恢复语义”和“格式兼容”
- **Issue**: #14090
- **链接**: apache/iceberg Issue #14090
- **Issue**: #15838
- **链接**: apache/iceberg Issue #15838

Flink 用户反馈恢复过程丢 commit，Kafka Connect 用户反馈遇到合法但常见的 timestamp 格式即崩溃。  
这表明 Iceberg 在数据接入层的真实痛点是：
- 失败恢复是否可靠；
- 异构上游数据格式是否足够宽容；
- connector 是否能稳定跑在复杂生产数据流上。

---

### 7.3 用户希望配置项行为更可预测
- **Issue**: #14231
- **链接**: apache/iceberg Issue #14231
- **Issue**: #14237
- **链接**: apache/iceberg Issue #14237

无论是 Avro/manifest 压缩属性，还是 Hive lock 属性，用户的问题都指向同一类体验：  
**“我设置了属性，但实际行为似乎没有按预期发生。”**  
这通常意味着：
- 文档表述不够精确；
- 属性作用域复杂；
- 某些建表/维护操作路径没有统一遵守配置。

---

### 7.4 开发者用户关注发布制品质量
- **Issue**: #15824
- **链接**: apache/iceberg Issue #15824

空的 sources/javadoc JAR 不影响生产运行，但会显著降低 IDE 调试、源码导航和二次集成体验。对一个被广泛嵌入的基础设施项目来说，这类反馈值得快速处理。

---

## 8. 待处理积压

以下为值得维护者重点回看的长期未决事项：

### 8.1 REST Catalog refresh token 支持
- **Issue**: #12196
- **标签**: improvement, stale
- **链接**: apache/iceberg Issue #12196

虽被标记 stale，但从企业认证需求看并不“过时”。建议提升优先级，至少明确 roadmap 或设计方向。

---

### 8.2 Flink 2.0 恢复丢提交问题
- **Issue**: #14090
- **标签**: bug, stale
- **链接**: apache/iceberg Issue #14090

这是典型不应被 stale 掩盖的问题，涉及故障恢复一致性，建议维护者尽快确认复现与修复路径。

---

### 8.3 CommitReport 缺少 metadata build/write duration
- **Issue**: #14077
- **链接**: apache/iceberg Issue #14077

对于大规模表和高频提交场景，用户需要把 commit 时间进一步拆分到 manifest list / metadata.json 构建与写入阶段。这是 **观测性与性能诊断**能力的重要补齐项。

---

### 8.4 Hive 建表锁属性不生效
- **Issue**: #14237
- **链接**: apache/iceberg Issue #14237

影响面广，且横跨多个版本分支，建议优先判断是否仍可复现，并决定是否需要 backport。

---

### 8.5 Docker Compose 官方示例镜像安全性担忧
- **Issue**: #14233
- **链接**: apache/iceberg Issue #14233

虽然不是核心引擎 bug，但官方示例使用的镜像漏洞问题会影响用户对项目“生产可用性”与“安全姿态”的感知，建议尽快回应。

---

## 结论

今天的 Apache Iceberg 呈现出两个鲜明特征：

1. **主线演进很清晰**：REST/OpenAPI、v4 规范、Variant、Spark 4.x、Kafka Connect 都在持续推进；
2. **稳定性压力也很真实**：Spark time-travel 缓存错误、Flink 恢复丢提交、Kafka Connect 时间戳崩溃，均是接近生产事故级别的问题。

整体来看，项目仍处于**高创新 + 高兼容性压力并存**的阶段。若能优先合入 Spark 查询正确性和 Kafka Connect 解析修复，并尽快给出 Flink 恢复问题的明确方案，短期健康度会进一步提升。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下是 **Delta Lake 2026-04-01 项目动态日报**。

---

# Delta Lake 项目日报 · 2026-04-01

## 1. 今日速览

过去 24 小时，Delta Lake 社区保持了**较高开发活跃度**：共有 **50 条 PR 更新**、**4 条 Issue 更新**，但**无新版本发布**。  
从提交内容看，今日重点集中在三条主线：**Flink Sink/Kernal 路线推进**、**Unity Catalog（UC）与 Kernel/DSv2 集成**、以及**CI 与第三方依赖安全加固**。  
问题反馈数量不高，但仍有一个与 **Spark 分区级更新导致非目标分区被重写** 相关的正确性 Bug 持续活跃，说明社区对写路径一致性仍保持高度关注。  
整体来看，项目处于**功能扩展与基础设施加固并行推进**的状态，健康度良好；不过，Stacked PR 较多，短期内评审与合并压力偏高。

---

## 3. 项目进展

> 注：今日数据中“已合并/关闭”共 10 条，但展示列表中明确可见的多为 **Closed** 状态，未给出完整 merged 明细。以下按“已关闭/推进明显”的重要 PR 进行分析。

### 3.1 Flink 方向持续推进，文档与 SQL API 分支有阶段性收敛
- **PR #6431 [CLOSED] [Flink] Readme & Docker Compose**  
  链接: delta-io/delta PR #6431  
  该 PR 关闭表明 Flink 子项目在**开发环境、示例与文档组织**方面做了阶段性整理。即便不是核心执行逻辑，它对降低贡献门槛、提升验证效率非常关键，通常是新连接器从“内部开发”走向“可试用”的前置信号。

- **PR #6192 [CLOSED] [Flink] Sink SQL API support**  
  链接: delta-io/delta PR #6192  
  该 PR 被关闭，说明 Flink Sink 的 **SQL API 方案**可能进行了重构、拆分或路线调整。结合 Epic Issue #5901 和当日新开 PR #6456 来看，Flink Sink 并未停滞，反而处于**实现路径重新收敛**阶段，后续更可能以分层 PR 逐步合入。

### 3.2 Kernel + Unity Catalog + DSv2 建表链路明显加速
以下一组 Stacked PR 代表了今日最值得关注的核心技术推进，目标是将 Delta 的建表/提交能力更深地接入 **Kernel 与 Spark DSv2**：

- **PR #6448 [OPEN] [Kernel] Finalize UC table creation inside Kernel commit path**  
  链接: delta-io/delta PR #6448

- **PR #6449 [OPEN] Add CreateTableBuilder + V2Mode routing + integration tests**  
  链接: delta-io/delta PR #6449

- **PR #6450 [OPEN] Wire DeltaCatalog.createTable() to DSv2 + Kernel path**  
  链接: delta-io/delta PR #6450

这组 PR 表明 Delta Lake 正在把 **Spark Catalog 建表入口**、**DSv2 路由**、**Kernel 提交路径** 和 **UC 表创建最终化流程** 串起来。  
技术意义主要有三点：

1. **统一建表语义**：减少 Spark 侧与 Kernel 侧行为差异；
2. **增强 Catalog/UC 兼容性**：为托管目录、治理元数据与外部 Catalog 生态打基础；
3. **为后续多引擎复用铺路**：如果建表与提交逻辑更多下沉至 Kernel，后续 Flink/其他引擎复用成本会更低。

### 3.3 查询执行与扫描优化：Kernel-Spark V2 连接器增强
- **PR #6332 [OPEN] [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector**  
  链接: delta-io/delta PR #6332

该 PR 为 Delta V2 connector 实现 Spark 的 `SupportsPushDownLimit`，使 `SELECT * FROM delta_table LIMIT N` 之类查询可以更早下推限制。  
这属于典型的**查询引擎接口能力补齐**，潜在收益包括：

- 降低不必要的文件/分片扫描；
- 提升小结果集查询的响应速度；
- 使 Kernel-based connector 在 Spark V2 数据源生态中更接近原生优化器预期。

### 3.4 元数据与统计能力优化
- **PR #6406 [OPEN] feat: Support getting `tableSizeBytes`, `numFiles` by incremental crc construction**  
  链接: delta-io/delta PR #6406

该 PR 指向通过增量 CRC 构建获取 `tableSizeBytes`、`numFiles` 等统计信息，意味着维护者在探索**更低成本维护表级元信息**的方法。  
如果最终落地，可能改善：

- 表统计获取延迟；
- 元数据重放成本；
- 运维与查询规划中对表规模信息的可用性。

### 3.5 CI 与兼容性回归防护加强
- **PR #6263 [OPEN] [CI Improvements] Add non-blocking CI job to test against UC main**  
  链接: delta-io/delta PR #6263

- **PR #6446 [OPEN] Gate UC tests behind UC Spark version checks**  
  链接: delta-io/delta PR #6446

这两项改动体现出 Delta 团队在主动处理 **与 Unity Catalog 主线版本的兼容性波动**。  
前者通过非阻塞 CI 提前感知 UC 主线变化，后者通过版本门控避免测试误报。对于依赖复杂外部组件的项目来说，这是很重要的工程成熟度信号。

### 3.6 第三方依赖与供应链安全加固成为当日最密集动作
- **PR #6460 [OPEN] Harden 3p dependencies throughout project**  
- **PR #6458 [OPEN] Harden 3p dependencies throughout project**  
- **PR #6459 [OPEN] Harden 3p dependencies throughout project**  
- **PR #6457 [OPEN] Harden 3p dependencies throughout project**  
- **PR #6440 [CLOSED] Harden 3p dependencies throughout project**  

链接分别为: delta-io/delta PR #6460 / #6458 / #6459 / #6457 / #6440

同主题 PR 在多个分支/分叉链路上同时出现，说明这是一次**跨分支安全补丁回灌/Cherry-pick 行动**。  
从摘要看，涉及 lock files、Dockerfile hardening、requirements.lock、工作流触发器等，属于典型的**依赖锁定、构建环境加固与 CI 供应链防护**工作。  
这类改动虽不直接面向 SQL 功能，但对开源项目安全性和可复现构建至关重要。

---

## 4. 社区热点

### 热点 1：Flink Sink 正式进入 Kernel 化建设阶段
- **Issue #5901 [OPEN] [Flink] Create Delta Kernel based Flink Sink**  
  链接: delta-io/delta Issue #5901
- **PR #6456 [OPEN] [Flink] Enable Release setting in build.sbt and add int test**  
  链接: delta-io/delta PR #6456

这是今天最明确的路线图信号。Issue #5901 是一个 Epic，明确记录“基于 Delta Kernel 构建 Flink Sink”的计划与里程碑。  
背后的技术诉求非常清晰：

- 希望 **Flink 写入能力** 不再依赖过重的专用实现；
- 通过 **Kernel 抽象统一日志/事务语义**；
- 为未来多引擎共享 Delta 写路径奠定基础。

PR #6456 新增 release setting 和 integration test，说明该工作已从框架搭建进入**可发布、可验证**阶段。

### 热点 2：Spark 分区更新正确性 Bug 持续受到关注
- **Issue #3054 [OPEN] [BUG] [SPARK] Unintended Rewrite of Other Partitions During Partition-Level Delta Table Update**  
  链接: delta-io/delta Issue #3054

这是当前最值得维护者警惕的活跃 Bug 之一。问题指向在**分区级 Delta 表更新**时，可能发生**其他分区被意外重写**。  
背后的核心诉求是：

- 确保 **分区裁剪与写入范围控制** 的正确性；
- 避免大表更新时产生额外数据改写；
- 降低因为错误 rewrite 带来的成本、性能和数据一致性风险。

对于 OLAP/湖仓场景，这类问题优先级通常高于一般性能优化。

### 热点 3：Kernel ScanBuilder 的 schema 校验需求仍未关闭
- **Issue #2149 [OPEN] [Kernel] Validate readSchema is a subset of the table schema in ScanBuilder**  
  链接: delta-io/delta Issue #2149

虽然是较早提出的 enhancement，但今日仍有更新，说明该需求仍有实际价值。  
技术诉求是让 Kernel 在 ScanBuilder 阶段显式验证 `readSchema` 是否为表 schema 的子集，从而：

- 提前发现调用方 schema 错误；
- 降低运行时模糊失败；
- 改善嵌入式/连接器场景下的接口鲁棒性。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1：分区级更新可能误改写其他分区
- **Issue #3054 [OPEN] [BUG] [SPARK] Unintended Rewrite of Other Partitions During Partition-Level Delta Table Update**  
  作者: @yatharth-zeotap  
  链接: delta-io/delta Issue #3054

**严重性判断：高**  
这是典型的**查询/写入正确性问题**。如果在只针对某一分区执行更新时触发其他分区重写，会带来：

- 非预期 IO 放大；
- 数据变更范围失控；
- 潜在的数据审计与成本问题。

**当前状态**：Issue 仍开放，今日数据中**未见明确对应 fix PR**。  
**建议关注**：维护者应尽快确认是否已可复现、影响的 Spark/Delta 版本范围，以及是否涉及 optimizer、command planning 或 file rewrite 策略。

### P2：新报告的 Flaky test
- **Issue #6451 [OPEN] [BUG] Flaky test**  
  作者: @seewishnew  
  链接: delta-io/delta Issue #6451

**严重性判断：中**  
该问题暂时不像数据正确性 Bug 那样影响生产，但会直接影响：

- CI 稳定性；
- PR 评审效率；
- 回归定位可信度。

**当前状态**：新建且暂无评论，**未见明确 fix PR**。  
考虑到今日 CI、安全和 UC 兼容性改动较多，建议优先排查是否与测试环境、依赖版本漂移或新引入门控逻辑有关。

### P3：UC/外部依赖兼容性风险正在被工程化缓解
- **PR #6263 [OPEN] Add non-blocking CI job to test against UC main**  
- **PR #6446 [OPEN] Gate UC tests behind UC Spark version checks**  

虽然不是直接 Bug 报告，但这类 PR 说明维护者已意识到 **UC 主线变化导致的回归风险**。从稳定性角度，这属于“预防性修复”。

---

## 6. 功能请求与路线图信号

### 6.1 Flink Connector / Sink 极可能进入下一阶段重点版本
- **Issue #5901 [OPEN] [Flink] Create Delta Kernel based Flink Sink**  
  链接: delta-io/delta Issue #5901
- **PR #6456 [OPEN] [Flink] Enable Release setting in build.sbt and add int test**  
  链接: delta-io/delta PR #6456

这是今日最强烈的路线图信号。Epic + 构建发布配置 + 集成测试的组合，通常意味着功能已经从“概念验证”迈向“预览交付”阶段。  
**判断**：基于 Delta Kernel 的 Flink Sink 很可能会成为未来一个重要版本的重点能力。

### 6.2 Kernel 侧 schema 校验能力仍有落地空间
- **Issue #2149 [OPEN] [Kernel] Validate readSchema is a subset of the table schema in ScanBuilder**  
  链接: delta-io/delta Issue #2149

作为带有 `good first issue` 标签的 enhancement，它实现复杂度可能相对可控，但用户价值不低。  
**判断**：如果近期 Kernel 相关重构持续推进，该需求较可能被顺手纳入后续版本，作为 API 防御性增强的一部分。

### 6.3 Spark V2 / Kernel 查询接口补齐将持续推进
- **PR #6332 [OPEN] [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector**  
  链接: delta-io/delta PR #6332

这类接口对外虽不显眼，但对新一代连接器架构非常关键。  
**判断**：后续大概率还会看到更多与 `pushdown`、`stats`、`scan planning`、`DSv2 capability` 相关的 PR。

### 6.4 Spark 4.0 与 Variant 表兼容性保护值得持续跟踪
- **PR #6356 [OPEN] [SPARK] Add config to block Spark 4.0 clients from writing to Variant tables**  
  链接: delta-io/delta PR #6356

这是一个很典型的**兼容性保护开关**需求：当新版本 Spark 客户端写入 Variant 表存在风险时，通过配置阻断危险路径。  
**判断**：这类“默认保护 + 可配置开关”的策略，非常可能被纳入正式版本，因为它能显著降低升级事故风险。

---

## 7. 用户反馈摘要

基于今日活跃 Issues/PR，可提炼出以下真实用户痛点：

### 7.1 用户最在意的仍是写入正确性，而非单纯性能
- 代表项：**Issue #3054**  
  链接: delta-io/delta Issue #3054

分区级更新误重写其他分区，反映出真实生产场景中用户对以下问题非常敏感：

- 写入范围是否可预测；
- 更新成本是否会异常放大；
- 湖表事务语义在复杂分区场景下是否可靠。

这类反馈通常来自已在生产中使用 Delta 的团队，而不是试用型用户。

### 7.2 用户希望 Kernel 接口更“防呆”、更适合构建上层连接器
- 代表项：**Issue #2149**  
  链接: delta-io/delta Issue #2149

Schema 子集校验需求说明，开发者正在将 Kernel 作为可复用底层组件使用，希望它在边界检查上更严格，减少连接器调用方的踩坑空间。

### 7.3 Flink 用户期待“官方化、可发布、可验证”的 Sink 能力
- 代表项：**Issue #5901**, **PR #6456**  
  链接: delta-io/delta Issue #5901 / PR #6456

从 Epic 和集成测试建设来看，社区对 Flink 方向的期待已经从“能不能做”转向：

- 何时可试用；
- 发布流程是否完整；
- 是否能通过官方测试体系验证。

### 7.4 维护者同样重视 CI 稳定性与供应链安全
- 代表项：**Issue #6451**, **PR #6457/#6458/#6459/#6460**  
  链接: delta-io/delta Issue #6451，相关 PR 同上

这说明项目不只是堆功能，也在投入资源解决“开发体验”和“构建可信度”问题，这对企业采用非常重要。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或潜在积压项：

### 8.1 长期开启的高风险正确性问题
- **Issue #3054 [OPEN]**  
  创建于 2024-05-06，至今仍活跃  
  链接: delta-io/delta Issue #3054

这是当前最需要警惕的积压项。问题影响面可能较广，且与写路径正确性直接相关。建议维护者：

- 明确受影响版本；
- 提供最小复现；
- 尽快关联修复 PR 或规避建议。

### 8.2 Kernel enhancement 持续悬而未决
- **Issue #2149 [OPEN]**  
  创建于 2023-10-06  
  链接: delta-io/delta Issue #2149

虽属 enhancement，但拖延时间较长。考虑到 Kernel 当前正处于能力外扩阶段，这类基础校验类问题越早解决越有利。

### 8.3 多个 Stacked PR 并行，评审负担较重
- **PR #6448 / #6449 / #6450 / #6378 / #6156 / #6333**  
  链接: 各自 PR 链接

这些 PR 反映出 UC、Kernel、DSv2、commit metrics 等子方向在快速推进，但也意味着：

- reviewer 需要跨多个上下文理解依赖关系；
- 上游未合并时，下游 PR 容易积压；
- 功能完成度高，但交付节奏可能受阻。

### 8.4 Flink 路线存在“关闭旧 PR、重组新实现”的过渡成本
- **PR #6192 [CLOSED]**, **PR #6431 [CLOSED]**, **Issue #5901 [OPEN]**, **PR #6456 [OPEN]**  
  链接: 各自条目

这说明 Flink 方向虽在推进，但也存在路线调整和实现拆分。建议维护者保持 Epic issue 的里程碑同步更新，减少外部贡献者对当前状态的理解成本。

---

## 结论

Delta Lake 今日没有版本发布，但开发面非常活跃，且重点明确：  
**一是推进 Kernel 化和多引擎接入，尤其是 Flink Sink 与 Spark DSv2/UC 建表链路；二是补齐 V2 connector 能力与元数据优化；三是加强 CI 稳定性与供应链安全。**  

项目整体健康度偏高，但仍需重点关注两个风险点：  
1. **Spark 分区更新误重写**这一长期正确性问题尚未看到明确修复；  
2. **大量 stacked PR 并行**，可能在短期内增加评审和合并瓶颈。

如果你愿意，我还可以进一步把这份日报整理成更适合团队内部同步的 **“高管摘要版”** 或 **“研发周报模板版”**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时 Databend 整体活跃度较高：**11 条 Issue 更新、17 条 PR 更新、1 个新版本发布**。  
Issues 侧几乎全部是**自动化 Link Checker 报告的清理关闭**，说明维护团队在持续处理文档与 CI 噪音；真正值得关注的用户问题主要集中在 **SQL 标准兼容性**，尤其是 `X'...'` 十六进制字面量语义。  
PR 侧则呈现出明显的“**功能推进 + 稳定性修复并行**”特征：查询追踪、实验性表分支、分区 Hash Join、空间函数、HTTP 结果模式等功能持续推进，同时修复了解析、时区、统计推导与 CI 链路问题。  
从健康度看，项目当日**关闭问题效率较高**，但待合并 PR 数量达到 **12 条**，其中不乏较大特性，说明主干正处于持续集成和功能堆叠阶段，需关注评审与合并节奏。

---

## 2. 版本发布

## 新版本：v1.2.888-patch-3
- 发布链接：`v1.2.888-patch-3`
- Changelog 对比：<https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.888-patch-3>

### 发布解读
该版本是一个 **patch 级发布**，从命名看属于稳定线补丁版本，而非功能型大版本。给出的 release note 较简略，未直接列出具体改动条目，但结合当日 PR/Issue 动态，可以合理判断其重点更偏向：
- 稳定性修复
- 文档/CI 修复
- SQL 兼容性与边界行为纠正
- 对已知回归进行快速收敛

### 破坏性变更
当前提供的数据中**未见明确的 breaking change 声明**。  
但需要注意，若用户依赖了此前非标准行为，以下修复可能产生“行为变化”：
- SQL 标准 `X'...'` 字面量从“整数十六进制路径”纠正为“**二进制字面量**”语义后，相关查询结果、类型推断、测试快照可能变化。  
  关联修复：
  - Issue #19600：<https://github.com/databendlabs/databend/issues/19600>
  - PR #19636：<https://github.com/databendlabs/databend/pull/19636>
  - PR #19651：<https://github.com/databendlabs/databend/pull/19651>

### 迁移注意事项
建议升级到该补丁版本的用户重点自查：
1. **SQL 兼容性回归测试**
   - 检查所有使用 `X'ABCD'` 的 SQL、ETL、sqllogictest 是否依赖旧行为。
2. **HTTP 查询结果消费方**
   - 若后续跟进 `http_json_result_mode`，需注意客户端 JSON 解析兼容性。  
   相关 PR：#19639  
   <https://github.com/databendlabs/databend/pull/19639>
3. **时区相关函数**
   - 若业务大量使用 naive datetime 到时区时间转换，建议回归验证。  
   相关 PR：#19647  
   <https://github.com/databendlabs/databend/pull/19647>

---

## 3. 项目进展

以下为今日已合并/关闭、且对查询引擎、存储或 SQL 兼容性有实质影响的变更：

### 3.1 SQL 标准兼容性：修复 `X'...'` 十六进制字面量语义
- PR #19636（已关闭/应视为主修复）：<https://github.com/databendlabs/databend/pull/19636>
- PR #19635（已关闭，前序/重复修复）：<https://github.com/databendlabs/databend/pull/19635>
- 对应 Issue #19600（已关闭）：<https://github.com/databendlabs/databend/issues/19600>
- 后续回归测试 PR #19651（进行中）：<https://github.com/databendlabs/databend/pull/19651>

**进展意义：**
- 将 SQL 标准 `X'...'` 从错误的整数十六进制解析路径，纠正为 **Binary 字面量**。
- 同时保留 MySQL 风格 `0x...` 作为数值路径，避免破坏已有另一套兼容语义。
- 这是一次典型的 **SQL 标准兼容性修复 + 回归防护补齐**，对查询正确性影响较大。

### 3.2 时区解析修复：naive datetime 的 timezone resolution 更准确
- PR #19647（已关闭）：<https://github.com/databendlabs/databend/pull/19647>

**进展意义：**
- 修复 `string_to_timestamp_tz` 过去采用“fake UTC”处理 naive datetime 时的偏移解析问题。
- 改为使用更合理的 zoned 转换逻辑，有助于提升：
  - 时间函数正确性
  - 跨时区查询一致性
  - ETL/日志分析场景下的时间解析稳定性

### 3.3 CI/文档稳定性：修复 link checker 破损
- PR #19649（已关闭）：<https://github.com/databendlabs/databend/pull/19649>
- PR #19645（已关闭）：<https://github.com/databendlabs/databend/pull/19645>

**进展意义：**
- 修复 SQL README 中错误链接并升级 link checker action。
- 直接关闭多条自动化 Link Checker 报告 Issue，降低仓库噪音，改善 CI 信噪比。
- 虽不属于核心引擎能力，但对维护效率和贡献者体验非常重要。

### 3.4 值得持续关注的进行中核心 PR
这些 PR 尚未合并，但已显示出较强路线图信号：

- **查询追踪调试能力**
  - PR #19642：<https://github.com/databendlabs/databend/pull/19642>
  - 新增 OTLP trace_debug dump，覆盖 direct SQL 与 HTTP `/v1/query` 路径。
  - 对排查复杂慢查询、分布式执行、链路观测很有价值。

- **分区 Hash Join 支持**
  - PR #19553：<https://github.com/databendlabs/databend/pull/19553>
  - 属于查询引擎执行层的重要演进，潜在影响大查询内存控制与并行度。

- **实验性 Table Branch**
  - PR #19551：<https://github.com/databendlabs/databend/pull/19551>
  - 为 FUSE 表引入 branch 语义，涉及元数据、读写、GC，路线图价值很高。

- **二进制 fuse32 bloom index**
  - PR #19621：<https://github.com/databendlabs/databend/pull/19621>
  - 明显是面向存储过滤效率与索引结构优化的工作。

- **Geometry / Geography 聚合函数**
  - PR #19620：<https://github.com/databendlabs/databend/pull/19620>
  - 扩展 Databend 在空间分析场景中的 SQL 能力。

---

## 4. 社区热点

> 说明：给定数据中评论数和点赞数整体偏低，今日“热点”更多来自**技术影响面**而非互动量。

### 热点 1：`X'...'` 解析不符合 SQL 标准
- Issue #19600：<https://github.com/databendlabs/databend/issues/19600>
- PR #19636：<https://github.com/databendlabs/databend/pull/19636>
- PR #19651：<https://github.com/databendlabs/databend/pull/19651>

**技术诉求分析：**
- 用户核心诉求不是新功能，而是 **SQL 标准一致性** 和 **跨数据库迁移兼容性**。
- 这类问题常见于：
  - 从 PostgreSQL / MySQL / ANSI SQL 兼容系统迁移
  - sqllogictest / 标准测试集对齐
  - 二进制字面量参与函数、比较、序列化时的行为一致性

### 热点 2：查询链路可观测性增强
- PR #19642：<https://github.com/databendlabs/databend/pull/19642>

**技术诉求分析：**
- 增加 trace_debug OTLP dump，说明社区/维护者正在处理更复杂的查询问题：
  - HTTP 查询与 direct SQL 行为差异
  - 执行链路透明度不足
  - 调试需要可复现、可导出的完整 trace
- 这是 Databend 向“**更工程化的调试与观测工具链**”演进的信号。

### 热点 3：实验性表分支（Table Branch）
- PR #19551：<https://github.com/databendlabs/databend/pull/19551>

**技术诉求分析：**
- 反映用户对数据版本化、隔离试验、类 Git 分支语义的需求。
- 对数仓场景很有吸引力，特别适用于：
  - 数据回溯与验证
  - 分支实验写入
  - 多环境隔离
  - 面向 lakehouse 的版本化表管理

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：SQL 查询正确性问题 —— `X'...'` 被错误当作整数十六进制
- Issue #19600：<https://github.com/databendlabs/databend/issues/19600>
- Fix PR #19636：<https://github.com/databendlabs/databend/pull/19636>
- Regression PR #19651：<https://github.com/databendlabs/databend/pull/19651>

**影响：**
- 影响 SQL 标准兼容性与结果正确性。
- 可能导致：
  - 类型错误
  - 结果集不一致
  - 迁移 SQL 失败或语义偏差

**状态：**
- 主修复已关闭对应问题，且追加回归覆盖正在进行。

---

### P1：统计推导边界溢出 —— `UInt64` 全范围扫描可能触发 panic
- PR #19631（Open）：<https://github.com/databendlabs/databend/pull/19631>

**影响：**
- `Scan::derive_stats` 在使用 min/max 统计推导 NDV 时，遇到 `[0, u64::MAX]` 全范围可能溢出。
- 属于 **planner/统计估算稳定性问题**，潜在影响：
  - 查询计划生成稳定性
  - 大表扫描场景
  - 极值列统计存在时的健壮性

**状态：**
- 已有 fix PR，尚待合并。

---

### P1：时区解析错误 —— naive datetime 转时区使用错误偏移逻辑
- PR #19647（Closed）：<https://github.com/databendlabs/databend/pull/19647>

**影响：**
- 影响时间函数正确性，尤其在 DST、时区边界和日志时间解析中较敏感。
- 可能导致时间结果偏移，属于隐蔽但高价值的 correctness bug。

**状态：**
- 修复已关闭，建议用户升级后回归验证相关业务 SQL。

---

### P2：CI 链路不稳定 —— Link Checker 失效/误报
- Issue #19648：<https://github.com/databendlabs/databend/issues/19648>
- Issue #19643：<https://github.com/databendlabs/databend/issues/19643>
- PR #19649：<https://github.com/databendlabs/databend/pull/19649>
- PR #19645：<https://github.com/databendlabs/databend/pull/19645>

**影响：**
- 对核心产品功能影响有限，但会显著干扰：
  - 文档质量门禁
  - PR 信号质量
  - 仓库维护效率

**状态：**
- 已修复并关闭多条相关自动化 Issue。

---

## 6. 功能请求与路线图信号

虽然今日没有“新开功能 Issue”，但从活跃 PR 可以看到清晰的产品演进方向：

### 6.1 高优先级路线图信号

#### 实验性 Table Branch
- PR #19551：<https://github.com/databendlabs/databend/pull/19551>

**判断：**
- 这是高度体系化的功能，不是小修小补。
- 涉及 branch create、branch-aware read/write、生命周期元数据、GC。
- 很可能是未来版本的重要特性之一。

#### 分区 Hash Join
- PR #19553：<https://github.com/databendlabs/databend/pull/19553>

**判断：**
- 明显属于查询执行引擎核心能力增强。
- 若完成，将提升大规模 join 的资源利用与扩展性。
- 具备进入未来版本的高概率。

#### 查询 Trace Debug / OTLP 导出
- PR #19642：<https://github.com/databendlabs/databend/pull/19642>

**判断：**
- 对可观测性和排障效率帮助极大。
- 特别适合云数仓、HTTP 查询服务化场景。
- 预计较容易进入近期版本。

### 6.2 中高优先级功能扩展

#### Geometry / Geography 聚合能力
- PR #19620：<https://github.com/databendlabs/databend/pull/19620>

**判断：**
- 显示 Databend 正尝试进入更丰富分析负载。
- 若合并，将提升在地理空间分析场景中的竞争力。

#### binary_fuse32 bloom index
- PR #19621：<https://github.com/databendlabs/databend/pull/19621>

**判断：**
- 该改动直指存储过滤索引结构，偏底层且有性能潜力。
- 适合高选择性过滤场景，可能成为 FUSE 存储优化的重要分支。

#### HTTP JSON 结果模式
- PR #19639：<https://github.com/databendlabs/databend/pull/19639>

**判断：**
- 面向 API 消费者与客户端兼容性。
- 对 BI/中台/网关集成友好，属于实用型增强。

#### `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- PR #19615：<https://github.com/databendlabs/databend/pull/19615>

**判断：**
- 属于 SQL DDL 兼容性增强。
- 实用性高、风险相对可控，进入下一版本概率较高。

---

## 7. 用户反馈摘要

基于今日 Issue/PR 内容，可以提炼出以下真实用户痛点：

### 7.1 SQL 标准兼容性仍是迁移用户核心关注点
- 代表问题：Issue #19600  
  <https://github.com/databendlabs/databend/issues/19600>

**反馈摘要：**
- 用户对 `X'...'` 行为异常非常敏感，说明 Databend 正被用于需要较高 SQL 兼容性的场景。
- 这类用户通常不是只看“能不能跑”，而是关注：
  - 是否符合 SQL 标准
  - 是否与主流数据库一致
  - 是否会影响自动化测试与迁移脚本

### 7.2 复杂查询排障需要更强可观测性
- 代表 PR：#19642  
  <https://github.com/databendlabs/databend/pull/19642>

**反馈摘要：**
- direct SQL 与 HTTP 查询路径都需要 trace dump，说明实际使用中存在：
  - 服务接口链路调试难
  - 问题复现成本高
  - 需要面向工程团队的完整追踪数据

### 7.3 文档与工具链可靠性仍影响贡献体验
- 代表 Issues：#19648、#19643、#19634、#19630  
- 代表 PR：#19649、#19645

**反馈摘要：**
- Link Checker 自动开 Issue 的机制能帮助发现问题，但如果误报或重复关闭成本较高，会稀释有效信号。
- 今日集中关闭多条报告，说明维护者在改善这类“仓库运维噪音”。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或高价值待处理项：

### 8.1 大型特性 PR 长时间待合并：实验性 Table Branch
- PR #19551：<https://github.com/databendlabs/databend/pull/19551>
- 创建于 2026-03-15，仍处于 Open

**提醒：**
- 该 PR 涉及面广，若长期悬而未决，容易造成：
  - 分支漂移
  - 评审成本上升
  - 贡献者迭代疲劳

### 8.2 查询引擎关键演进：分区 Hash Join
- PR #19553：<https://github.com/databendlabs/databend/pull/19553>
- 创建于 2026-03-16，仍处于 Open

**提醒：**
- 属于核心执行引擎改造，建议尽快明确 benchmark、内存收益、回归风险与合并门槛。

### 8.3 统计推导 panic 修复尚未落地
- PR #19631：<https://github.com/databendlabs/databend/pull/19631>

**提醒：**
- 这是稳定性问题，且带有 panic 风险。
- 建议优先于一般功能型 PR 评审合并。

### 8.4 Link Checker 历史自动化 Issue 存量较多
- 例如：
  - Issue #18598：<https://github.com/databendlabs/databend/issues/18598>
  - Issue #19449：<https://github.com/databendlabs/databend/issues/19449>

**提醒：**
- 尽管今日已集中关闭，但自动化报告长期积压说明：
  - CI 规则可能需要更强去重/聚合机制
  - 可考虑改为单一追踪 Issue 或 PR 注释模式，减少仓库噪音

---

## 附：日报结论

Databend 今日的核心主题是：**用小而关键的修复提升 SQL 正确性与工程稳定性，同时继续推进查询引擎、可观测性与存储层中长期能力建设**。  
短期最值得关注的是 `X'...'` SQL 兼容性修复及其回归测试补齐；中期则是 **partitioned hash join、table branch、trace debug、bloom index** 等特性是否能顺利进入主线。  
整体来看，项目健康度良好，维护节奏稳定，但**待合并 PR 的评审吞吐**将是接下来影响交付效率的关键指标。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时内，Velox 社区保持**高活跃度**：共有 **50 条 PR 更新**、**4 条 Issue 更新**，但**无新版本发布**。  
从变更结构看，今日重点集中在 **构建修复、Parquet/存储兼容性增强、GPU/cuDF 扩展、远程函数序列化能力、执行引擎稳定性** 等方向。  
已合并/关闭的 PR 有 **10 条**，说明项目主干仍在持续推进，尤其是 **构建可用性** 和 **读写/类型兼容性** 方面在快速收敛。  
同时，新开的 flaky test、构建依赖缺失、算子边界行为问题也表明，Velox 当前正处于**功能扩张与稳定性治理并行**的阶段。  

---

## 3. 项目进展

### 3.1 已合并/关闭的重要 PR

#### 1) Parquet 类型扩展能力增强：支持类型 widening
- **PR #16611** `[Merged] feat(parquet): Add type widening support for INT and Decimal types with configurable narrowing`  
- 链接: `facebookincubator/velox PR #16611`

**进展解读：**  
这是今天最值得关注的主干进展之一。该 PR 为 Velox Parquet reader 增加了对 **INT → DOUBLE/Decimal**、**Decimal → Decimal widening** 的支持，并允许对 narrowing 进行配置。  
这直接提升了 Velox 在 **schema evolution** 场景下的兼容性，特别是与 **Spark 4.0 Parquet Type Widening** 语义的协同。对于接入湖仓数据、历史分区 schema 演进较频繁的用户，这是很实用的能力补齐。

**影响方向：**
- 查询引擎功能：提升 Parquet 读取的 schema 演进适配能力
- 存储优化：降低因类型扩展导致的读失败或手工迁移成本
- SQL / 生态兼容性：向 Spark 生态行为对齐

---

#### 2) cuDF 可观测性增强：补充 fallback 详细日志
- **PR #16900** `[Merged] feat(cudf): Add the log to show detailed fallback messgae`  
- 链接: `facebookincubator/velox PR #16900`

**进展解读：**  
该 PR 为 cuDF 路径增加了更细粒度的 fallback 日志，帮助用户识别“表达式为何未走 GPU 加速”。  
这类改动虽然不直接提升性能，但显著增强了 **GPU 执行链路的可诊断性**。对于正在评估 Velox GPU 加速收益的团队，日志透明度往往比单点性能优化更先影响落地效率。

**影响方向：**
- 查询引擎功能：帮助定位表达式未下推至 GPU 的原因
- 用户体验：减少“只知道 fallback，但不知道为什么 fallback”的黑盒感
- 运维调试：加速 GPU 路径支持范围排查

---

#### 3) 构建系统修复：fuzzer examples 受测试开关保护
- **PR #16992** `[Merged] fix(build): Guard fuzzer examples subdirectory with VELOX_BUILD_TESTING`  
- 链接: `facebookincubator/velox PR #16992`

**进展解读：**  
该修复解决了 `VELOX_BUILD_TESTING=OFF` 时由于无条件引入 `examples` 子目录导致的构建失败问题，尤其影响 Presto GPU CI。  
这是典型的 **构建配置回归修复**，说明项目在多配置、多 CI 环境下持续打磨可移植性和工程健壮性。

---

#### 4) 工程工具链改进：build impact comment 布局优化
- **PR #16971** `[Merged] build: Improve build impact comment layout`  
- 链接: `facebookincubator/velox PR #16971`

**进展解读：**  
虽属工程效率改进，但有助于 reviewer 更快理解变更影响范围，提升大仓库下的代码审查效率。  
对于 Velox 这类跨执行引擎、连接器、表达式、文件格式的大型 C++ 项目，这种“非功能性改进”对维护成本有实际价值。

---

#### 5) 文档传播：自适应按函数 CPU 跟踪博客发布
- **PR #16945** `[Merged] docs: Add blog post for Adaptive per-function CPU tracking`  
- 链接: `facebookincubator/velox PR #16945`

**进展解读：**  
虽然是文档 PR，但传达出一个重要路线信号：**性能可观测性与自适应 profiling** 仍是 Velox 持续投入方向。  
这也意味着相关性能诊断能力未来可能继续被产品化、默认化或扩展到更多算子层面。

---

### 3.2 今日值得关注的在途 PR

#### 6) 动态过滤穿透 LocalPartition / LocalExchange
- **PR #16991** `[OPEN] feat: Support dynamic filter pushdown through LocalPartition / LocalExchange`  
- 链接: `facebookincubator/velox PR #16991`

这是执行引擎层面的重要能力增强。若完成，将使 **HashJoin 产生的 dynamic filters** 能够跨本地交换链路继续下推到 `TableScan`，有望减少扫描量、提升 join-heavy 查询性能。  
这属于**查询计划执行优化**中的高价值改进。

---

#### 7) Remote Function 新增 Arrow IPC 页格式
- **PR #16981** `[OPEN] feat(serializer): Add Arrow IPC format for RemoteFunctionPage`  
- 链接: `facebookincubator/velox PR #16981`

这是一个很强的路线图信号：Velox 正在继续拓展 **remote function framework** 的序列化互操作性。  
新增 `ARROW_IPC` 作为第三种 PageFormat，意味着未来远程函数调用可能更容易与 Arrow 生态、跨语言服务集成。

---

#### 8) HiveDataSource 与 ScanSpec extraction pushdown 集成
- **PR #16968** `[OPEN] feat: Add extraction ScanSpec pushdown and HiveDataSource integration`  
- 链接: `facebookincubator/velox PR #16968`

该 PR 指向 **扫描层下推能力增强**，包括递归 ScanSpec 配置、结构字段裁剪、map key filter 等。  
如果顺利合入，将进一步提升 Hive connector 在复杂嵌套结构上的读取效率。

---

#### 9) GPU 算子扩展：CudfMarkDistinct
- **PR #16974** `[OPEN] feat(cudf): Add CudfMarkDistinct GPU operator`  
- 链接: `facebookincubator/velox PR #16974`

MarkDistinct 是较核心的分析型算子之一。该 PR 说明 Velox 的 GPU 覆盖面正在从表达式/过滤/扫描逐步向更复杂关系算子扩展。  
这对 OLAP 场景的端到端 GPU 执行覆盖率是积极信号。

---

## 4. 社区热点

### 热点 1：Parquet thrift 依赖替换与 FBThrift 支持
- **Issue #13175** `[OPEN] Add support for FBThrift in Parquet and remove thrift dependency`  
- 链接: `facebookincubator/velox Issue #13175`

**活跃度：**
- 评论数：11
- 过去 24 小时有更新
- 👍 1

**技术诉求分析：**  
这是当前 issue 中讨论最充分的一条。其核心诉求不是单纯“加一个依赖”，而是希望 **Parquet native reader 摆脱当前 thrift 依赖形态**，转向 **FBThrift** 或更符合项目依赖策略的实现。  
背后反映的是 Velox 用户在**依赖治理、二进制体积、构建复杂度、与 Meta 内外部生态统一**方面的长期诉求。  
考虑到远程函数、跨组件序列化能力正在增强，这类基础依赖收敛问题对中长期架构一致性影响较大。

---

### 热点 2：构建失败修复快速闭环
- **Issue #16995** `[OPEN] fix(build): velox_hive_connector_test missing GTest::gmock link dependency`  
- 链接: `facebookincubator/velox Issue #16995`
- **对应修复 PR #16996** `[OPEN, ready-to-merge]`  
- 链接: `facebookincubator/velox PR #16996`

**技术诉求分析：**  
该问题定位清晰、修复直接，说明社区对 **CI/构建稳定性问题** 的响应速度较快。  
它背后体现的是：Velox 的模块化测试目标较多，任何测试 target 的依赖声明不完整，都可能在不同发行版/工具链下暴露。  
“问题提出—修复 PR 跟进”的节奏很快，是项目健康度的正向信号。

---

### 热点 3：spill 路径 flaky test 暴露序列化/反序列化稳定性隐患
- **Issue #16983** `[OPEN] [flaky-test] Flaky ModeAggregateTest.groupByString: corrupted serialized page during spill`  
- 链接: `facebookincubator/velox Issue #16983`

**技术诉求分析：**  
错误信息显示 spill 反序列化阶段发生 **checksum mismatch**，属于典型的**非确定性稳定性问题**。  
这类问题虽然初期只表现为 flaky test，但通常与以下方向有关：
- spill 写读路径并发时序问题
- page 序列化格式或 buffer 生命周期管理问题
- checksum 计算/校验边界行为不一致

由于 Velox 在大内存聚合和资源回收场景中 heavily 依赖 spill，该问题值得优先关注。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Spill 反序列化校验失败，存在查询稳定性风险
- **Issue #16983** `[OPEN] [flaky-test] Flaky ModeAggregateTest.groupByString: corrupted serialized page during spill`  
- 链接: `facebookincubator/velox Issue #16983`

**现象：**
- `ModeAggregateTest.groupByString` 间歇性失败
- 错误为 spill 反序列化期间 `checksum mismatch`

**潜在影响：**
- 可能影响聚合算子在 spill 场景下的可靠性
- 若从测试扩展到线上，可能导致查询失败或结果不可信

**当前状态：**
- 暂无给定 fix PR

---

### P1：Hive connector 单测构建失败
- **Issue #16995** `[OPEN] fix(build): velox_hive_connector_test missing GTest::gmock link dependency`  
- 链接: `facebookincubator/velox Issue #16995`
- **修复 PR：#16996** `[OPEN, ready-to-merge]`  
- 链接: `facebookincubator/velox PR #16996`

**现象：**
- `TableHandleTest.cpp` 使用了 `<gmock/gmock.h>`
- 但 CMake target 未链接 `GTest::gmock`

**影响：**
- 影响特定测试目标构建
- 属于工程阻断型问题，但修复简单明确

**当前状态：**
- 已有修复 PR，且 ready-to-merge，预计很快闭环

---

### P2：cuDF BinaryFunction 对除零检查不一致
- **Issue #16988** `[OPEN] [enhancement] enh(cudf): Add more explicit division-by-zero checks in BinaryFunction`  
- 链接: `facebookincubator/velox Issue #16988`

**现象：**
- 当前仅部分 DECIMAL 路径显式检查除零
- 其他类型路径未统一处理

**影响：**
- 可能带来 GPU/CPU 行为不一致
- 影响表达式执行的边界正确性与 SQL 语义一致性

**当前状态：**
- 暂无给定 fix PR
- 虽被标为 enhancement，但本质上带有**正确性防护**属性

---

### P2：TIMESTAMP 分区 identity 处理异常导致 worker crash
- **PR #16805** `[OPEN] fix identity timestamp gap`  
- 链接: `facebookincubator/velox PR #16805`

**现象：**
- 查询 TIMESTAMP 分区表时 Prestissimo C++ worker crash

**影响：**
- 涉及分区裁剪/分区值解释逻辑
- 可能影响湖仓分区表读取稳定性

**当前状态：**
- 修复仍在 open 状态，建议持续跟进

---

## 6. 功能请求与路线图信号

### 6.1 远程函数与跨生态序列化能力持续增强
- **PR #16981** `[OPEN] feat(serializer): Add Arrow IPC format for RemoteFunctionPage`  
- 链接: `facebookincubator/velox PR #16981`
- **Issue #13175** `[OPEN] Add support for FBThrift in Parquet and remove thrift dependency`  
- 链接: `facebookincubator/velox Issue #13175`

**判断：**  
这两条信号共同表明，Velox 正在加强 **序列化协议、跨系统互操作性、依赖治理**。  
Arrow IPC 的引入尤其可能被纳入下一版本，因为它契合 remote execution / remote function 的扩展方向，且工程价值明确。

---

### 6.2 查询执行优化：dynamic filter 与 scan pushdown 是明确热点
- **PR #16991** `[OPEN] feat: Support dynamic filter pushdown through LocalPartition / LocalExchange`  
- 链接: `facebookincubator/velox PR #16991`
- **PR #16968** `[OPEN] feat: Add extraction ScanSpec pushdown and HiveDataSource integration`  
- 链接: `facebookincubator/velox PR #16968`

**判断：**  
这是典型的下一阶段性能路线：  
- 一边增强 **Join -> Scan** 的 runtime filtering
- 一边增强 **读取层列/结构裁剪与 extraction pushdown**

二者若相继落地，将明显改善分析查询中的 IO 与 CPU 开销。

---

### 6.3 GPU 路线继续扩张
- **PR #16974** `[OPEN] feat(cudf): Add CudfMarkDistinct GPU operator`  
- 链接: `facebookincubator/velox PR #16974`
- **PR #16620** `[OPEN] fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs`  
- 链接: `facebookincubator/velox PR #16620`
- **PR #16423** `[OPEN] feat(cudf): Add cuDF join fuzzer with CI integration`  
- 链接: `facebookincubator/velox PR #16423`
- **Issue #16988** `[OPEN] enh(cudf): Add more explicit division-by-zero checks in BinaryFunction`  
- 链接: `facebookincubator/velox Issue #16988`

**判断：**  
Velox 的 cuDF 路线已经从“能跑”进入“补算子、做 fuzz、做性能、补正确性”的阶段。  
这通常意味着 GPU 执行正从实验性质走向更系统化建设，下一版本纳入部分改进的概率较高，尤其是：
- 算子覆盖扩展
- fallback 可观测性增强
- 数据搬运性能优化
- 正确性边界收敛

---

### 6.4 SQL/函数生态补充：S2 函数
- **PR #15511** `[OPEN] feat: Add s2 Presto functions`  
- 链接: `facebookincubator/velox PR #15511`

**判断：**  
该 PR 已存在较长时间但仍有更新，说明地理空间相关函数需求持续存在。  
若下游查询引擎对地理分析能力有更强需求，这类函数集补充仍可能进入后续版本。

---

## 7. 用户反馈摘要

基于今日 issue/PR 摘要，可提炼出以下真实用户痛点：

### 1) 构建与依赖问题仍是用户第一接触痛点
- 代表链接：
  - `facebookincubator/velox Issue #16995`
  - `facebookincubator/velox PR #16996`
  - `facebookincubator/velox PR #16992`

**反馈特征：**
- 用户在尝试构建测试目标或关闭 testing 选项时遇到失败
- 问题往往不复杂，但非常影响首次接入和 CI 稳定性

**解读：**
- 对基础设施项目而言，构建问题会显著放大用户摩擦成本
- Velox 今日对此类问题的响应较快，体现维护效率尚可

---

### 2) 用户希望 GPU 路径“可解释”
- 代表链接：
  - `facebookincubator/velox PR #16900`

**反馈特征：**
- 用户不满足于“表达式没被支持”
- 更需要知道：究竟哪个子表达式、哪个算子、哪类类型约束触发了 fallback

**解读：**
- 这说明用户已不只是“尝鲜 GPU”，而是在认真推进生产落地
- 可观测性成为 GPU 采用的重要前置条件

---

### 3) Schema 演进和跨引擎兼容是实战高频诉求
- 代表链接：
  - `facebookincubator/velox PR #16611`

**反馈特征：**
- 用户需要读取经过 schema widening 的 Parquet 数据
- 希望 Velox 与 Spark 等主流处理引擎在行为上更兼容

**解读：**
- Velox 正越来越多地被放入异构数据栈中使用
- “兼容湖仓真实数据，而不只是理想 schema” 已成为关键需求

---

### 4) 稳定性问题尤其集中在 spill、分区、边界语义
- 代表链接：
  - `facebookincubator/velox Issue #16983`
  - `facebookincubator/velox PR #16805`
  - `facebookincubator/velox Issue #16988`

**反馈特征：**
- 高压力/边界场景仍易暴露问题
- 包括 spill 校验、timestamp 分区解释、除零行为一致性等

**解读：**
- 这些问题与 OLAP 真实负载高度相关
- 比纯功能缺失更值得优先治理

---

## 8. 待处理积压

### 1) Parquet thrift 依赖治理问题悬而未决
- **Issue #13175** `[OPEN]`  
- 链接: `facebookincubator/velox Issue #13175`

**提醒：**  
该 issue 自 **2025-04-28** 创建，至今仍开放，且持续有讨论。  
考虑到其涉及 Parquet reader 基础依赖和远程执行能力演进，建议维护者明确：
- 是否接受 FBThrift 方向
- 是否有替代方案或阶段性计划
- 对外部贡献的边界和设计约束

---

### 2) S2 Presto functions 长期开启，建议明确结论
- **PR #15511** `[OPEN] feat: Add s2 Presto functions`  
- 链接: `facebookincubator/velox PR #15511`

**提醒：**  
该 PR 创建于 **2025-11-15**，仍处于 open 状态。  
如果功能方向明确，建议推进 review；如果优先级较低，也应尽量给出阻塞点，避免贡献者长期等待。

---

### 3) cuDF 输出 batching 优化 PR 仍未收敛
- **PR #16620** `[OPEN] fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs`  
- 链接: `facebookincubator/velox PR #16620`

**提醒：**  
这是明显有性能收益的优化项，且与 GPU 路线成熟度直接相关。  
建议维护者关注其评审推进，避免性能工程长期滞留。

---

### 4) join fuzzer + CI 集成属于高价值质量建设，值得加速
- **PR #16423** `[OPEN] feat(cudf): Add cuDF join fuzzer with CI integration`  
- 链接: `facebookincubator/velox PR #16423`

**提醒：**  
GPU join 是高复杂度高风险模块，引入 fuzz 和 CI 对长期质量收益很大。  
若评审资源有限，也建议拆分最小可合入单元，尽快落地主干。

---

## 结论

今天的 Velox 呈现出典型的**高迭代、高工程密度**状态：  
一方面，Parquet 类型扩展、GPU fallback 可观测性、远程函数 Arrow IPC、dynamic filter pushdown 等改动，显示项目仍在积极扩张分析引擎能力边界；另一方面，spill flaky、构建依赖缺失、时间分区 crash、除零检查不一致等问题，也提醒项目需要继续夯实正确性与工程稳定性。  

整体看，Velox 项目健康度仍然较好：  
- **活跃度高**
- **修复响应快**
- **中长期路线清晰（性能、互操作性、GPU、Pushdown）**
- 但也存在**积压 PR 较多、部分基础问题拖延较久**的情况，值得维护者持续关注。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时，Apache Gluten 保持了**中高活跃度**：Issues 有 3 条更新，PR 有 15 条更新，其中 9 条仍在推进、6 条已合并或关闭。  
从内容看，今日工作重心仍然集中在 **Velox 后端能力增强、Spark SQL 兼容性补齐、内存/资源管理修复** 三条主线。  
值得注意的是，**TimestampNTZ、ANSI CAST、Kafka 读取、并行执行 PoC** 等方向同时推进，说明项目正在从“功能可用”向“语义完整 + 性能扩展”演进。  
稳定性方面，**AWS SDK teardown/S3 生命周期管理问题已出现对应修复 PR 并关闭 Issue**，说明维护者对资源释放类问题响应较快。  
整体来看，项目健康度良好，但仍存在若干**长期开放的功能型 PR 和追踪型 Issue**，需要继续收敛。

---

## 3. 项目进展

### 今日已关闭/已完成的重点 PR

#### 1) 修复 Velox 内存分配统计错误
- **PR**: #11855 `[VELOX] [VL] Fix StdMemoryAllocator::allocateZeroFilled byte accounting`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11855

该 PR 修复了 `StdMemoryAllocator::allocateZeroFilled` 在调用 `std::calloc(nmemb, size)` 时的**字节统计错误**：此前仅累计了 `size`，而非实际分配的 `nmemb * size`。  
这类问题虽然不一定直接导致功能错误，但会影响：
- 内存使用统计准确性
- 调试与观测能力
- 潜在的内存控制/限额判断

这属于**底层存储与执行引擎可观测性修复**，对排查 OOM、评估执行算子内存行为很关键。

---

#### 2) 修复 AWS SDK 未正确 teardown 的资源释放问题
- **PR**: #11857 `[GLUTEN-11796][VL] Teardown the AWS SDK`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11857

该 PR 直接对应 Issue #11796，处理 Velox 后端中 **`finalizeS3FileSystem` 未调用** 导致的 AWS SDK 生命周期问题。  
结合 Issue 描述，这一问题涉及：
- S3 FileSystem 静态对象持有
- AWS C++ SDK 全局静态对象 teardown
- 进程退出前资源清理缺失

这类问题通常会表现为：
- 退出阶段异常
- 资源泄漏/析构顺序问题
- 嵌入式或长生命周期服务场景不稳定

这是今日最明确的**稳定性修复闭环**之一。

---

#### 3) Spark 4.0/4.1 测试启用与计划标记能力补齐
- **PR**: #11833 `[CORE] [GLUTEN-11550][VL] Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11833

该 PR 启用了此前在 Spark 4.0/4.1 上被禁用的测试套件，且 **150/150 TPC-DS 查询全部通过**。  
其意义不止是“打开测试”：
- 修复了 Transformer 节点替换后**逻辑计划标签未正确传播**的问题
- 改善 Spark 新版本上的行为一致性
- 提升了计划可解释性与验证能力

这是一个明显的**兼容性和工程成熟度提升信号**。

---

#### 4) 时间相关表达式验证测试补强
- **PR**: #11656 `[GLUTEN-1433] [VL] Add validation tests for CurrentTimestamp and now(foldable)`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11656

该 PR 为 `CurrentTimestamp` 和 `now` 增加验证测试，明确这类 foldable 表达式由 Spark 在规划阶段计算。  
其价值在于：
- 减少时间函数支持中的误判
- 明确 Spark 与 Velox 侧职责边界
- 为后续 Timestamp/时区相关支持打基础

它与当前开放中的 TimestampNTZ 相关 PR 形成了明显联动。

---

#### 5) GPU 代码清理
- **PR**: #11824 `[VL] Clean up GPU code: remove dead/redundant code`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11824

这是一次小规模代码清理，删除冗余判断、无意义 flush 和不可达返回路径。  
虽然不是功能性大改，但有助于：
- 降低维护成本
- 提升代码可读性
- 减少未来引入隐性 bug 的概率

---

#### 6) 自定义 direct buffered input PR 关闭
- **PR**: #11452 `[GLUTEN-9456][VL] Add custom direct buffered input`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11452

该 PR 被关闭，说明这一方向当前可能已被替代、重构或暂缓。  
从项目治理角度看，这类关闭意味着维护者正在对 Velox I/O 相关改动做收敛，避免长期悬挂。

---

### 今日仍在推进的重点 PR

#### 1) TIMESTAMP_NTZ 基础支持
- **PR**: #11626 `[GLUTEN-11622][VL] Add basic TIMESTAMP_NTZ type support`
- **状态**: OPEN
- **链接**: apache/gluten PR #11626

这是近期最重要的 SQL 类型兼容性工作之一。  
若完成，将显著提升 Gluten 在 Spark 新类型语义上的适配能力，尤其影响：
- 时间类型表达式下推
- 新版 Spark SQL 兼容性
- 与 Iceberg/Delta 等生态的语义一致性

---

#### 2) TimestampNTZ fallback 校验可配置
- **PR**: #11720 `[GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback`
- **状态**: OPEN
- **链接**: apache/gluten PR #11720

当前校验器会把 `TimestampNTZType` 视为不支持并强制 fallback。该 PR 增加配置开关，允许开发/测试阶段关闭这类 fallback 验证。  
这是典型的**“功能开发过渡期工程措施”**，表明核心功能尚未完全落稳，但社区正积极降低开发验证门槛。

---

#### 3) Kafka 读取支持
- **PR**: #11801 `[VL] Adding kafka read support for Velox backend`
- **状态**: OPEN
- **链接**: apache/gluten PR #11801

这是一项非常值得关注的功能扩展。  
如果落地，Gluten 将不再只聚焦离线文件/湖仓读取，而是进一步触达：
- 流批一体接入场景
- Spark Structured Streaming 相关生态
- 实时 ingestion 读取路径

这是明确的**连接器/数据源能力扩展信号**。

---

#### 4) Velox 并行执行 PoC
- **PR**: #11852 `[VL] Proof of concept enable Velox parallel execution`
- **状态**: OPEN
- **链接**: apache/gluten PR #11852

该 PR 仍是 PoC，作者明确标注：
- 代码未完成
- 仍有 bug 待修
- 性能收益尚不确定

但方向极其关键。并行执行若成功，将直接影响：
- 单查询吞吐
- 多核利用率
- 算子并发调度能力

这是今日最强的**性能路线图信号**之一。

---

#### 5) ANSI CAST 语义支持
- **PR**: #11854 `[VL] Add ANSI mode support for Spark CAST(NumericType as integral)`
- **状态**: OPEN
- **链接**: apache/gluten PR #11854

该 PR 让 Velox 后端在 `spark.sql.ansi.enabled=true` 时，对数值转整型溢出采用**抛错而非截断/静默转换**。  
这意味着 Gluten 正进一步补齐：
- Spark ANSI 兼容性
- 查询正确性保障
- 生产环境语义一致性

这是对“能跑”向“跑得对”转变的重要信号。

---

#### 6) UI/回退信息修复
- **PR**: #11853 `[CORE][UI] Fix fallback info for V2 writes and align plan with Spark SQL tab`
- **状态**: OPEN
- **链接**: apache/gluten PR #11853

该 PR 修复 V2 写入场景（如 Iceberg INSERT + sort order）下 UI 未显示 fallback 信息的问题，并对齐 Spark SQL Tab 的计划展示。  
这会提升：
- 运维排障效率
- 回退原因可见性
- 使用者对执行计划的信任度

对实际用户体验价值很高。

---

## 4. 社区热点

### 热点 1：Velox 上游 PR 跟踪器持续活跃
- **Issue**: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **状态**: OPEN
- **评论**: 16
- **👍**: 4
- **链接**: apache/gluten Issue #11585

这是今日**评论最多、互动最高**的议题。  
它本质上反映了一个典型技术诉求：**Gluten 社区对 Velox 上游演进高度依赖，但又不能无限制维护长期 fork**。  
背后的现实问题包括：
- 上游 PR 合并周期较长
- 本地 pick/rebase 成本高
- 某些对 Gluten 很关键的能力暂未进入 upstream

这说明 Gluten 仍然处在**深度绑定 Velox 生态、同时受制于上游节奏**的阶段。对维护者而言，这类追踪器是重要的项目风险面板。

---

### 热点 2：TimestampNTZ 支持链条逐步成型
- **PR**: #11626
- **PR**: #11720
- **PR**: #11656
- **链接**: apache/gluten PR #11626 / #11720 / #11656

虽然单条评论数未给出，但从多条相关 PR 同时推进可以看出，**TimestampNTZ 已成为近期核心兼容性热点**。  
这背后往往代表：
- Spark 新语义适配压力
- 用户希望减少时间类型导致的 fallback
- 湖仓格式和新版本 Spark 工作负载对该类型支持的实际需求上升

---

### 热点 3：并行执行与 Kafka 支持代表下一阶段扩张方向
- **PR**: #11852
- **PR**: #11801
- **链接**: apache/gluten PR #11852 / #11801

这两条 PR 分别对应**执行性能扩展**和**数据源扩展**。  
从技术路线看，项目正从单纯的“SQL 加速层”进一步走向：
- 更完整的执行能力
- 更广的数据接入能力
- 更接近生产级端到端场景支持

---

## 5. Bug 与稳定性

按严重程度排序如下：

### 高优先级：S3/AWS SDK 资源释放问题
- **Issue**: #11796 `[bug] [VL] finalizeS3FileSystem is never called`
- **状态**: CLOSED
- **链接**: apache/gluten Issue #11796
- **对应修复 PR**: #11857
- **链接**: apache/gluten PR #11857

这是今日最明确的稳定性问题。  
涉及 AWS SDK 和 S3 FileSystem 的 teardown 顺序/缺失，在服务退出或资源回收场景中风险较高。  
**已存在 fix PR，且 Issue 已关闭**，处理闭环完整。

---

### 中优先级：内存字节统计错误
- **PR**: #11855 `[VL] Fix StdMemoryAllocator::allocateZeroFilled byte accounting`
- **状态**: CLOSED
- **链接**: apache/gluten PR #11855

虽然没有对应独立 Issue，但它影响底层内存统计正确性。  
在 OLAP 引擎中，统计失真容易进一步影响：
- 内存诊断
- 资源调优
- 性能分析结论

已修复，风险已下降。

---

### 中优先级：时间类型支持导致的 fallback/兼容性问题
- **PR**: #11626
- **PR**: #11720
- **链接**: apache/gluten PR #11626 / #11720

`TimestampNTZType` 目前仍是进行中的兼容性问题，实际表现为：
- 校验器认为不支持
- 查询被迫 fallback 到 Spark
- 开发调试不便

这还不是“已报告崩溃 bug”，但对生产可用性和覆盖率影响较大，需持续关注。

---

### 中优先级：ANSI CAST 语义差异
- **PR**: #11854
- **链接**: apache/gluten PR #11854

在 ANSI 模式下，数值转整型的溢出处理必须与 Spark 一致，否则会带来**查询正确性偏差**。  
该问题尚在修复中，属于典型的**语义兼容性风险点**。

---

## 6. 功能请求与路线图信号

### 1) Flink RocksDB State 支持诉求已关闭，但方向仍具参考意义
- **Issue**: #11588 `[FLINK]Support rocksdb state`
- **状态**: CLOSED
- **链接**: apache/gluten Issue #11588

该需求本身代表 Gluten 在 Flink 方向上的状态管理能力期待，尤其是 RocksDB state 这类生产常见场景。  
尽管 Issue 已关闭且暂无更多上下文，但它说明社区并不只关心 Spark/Velox，也在关注：
- Flink 场景落地
- 状态后端兼容
- 流式执行生态

短期看，这个需求**未见直接 PR 联动**，纳入下一版本的概率相对较低。

---

### 2) Kafka 读取支持很可能进入后续版本候选
- **PR**: #11801
- **链接**: apache/gluten PR #11801

这是当前最清晰的新能力候选之一。  
如果该 PR 持续推进，极可能成为后续版本中的亮点功能，尤其适用于：
- 流式数据读取
- 实时 ETL
- 混合负载场景

---

### 3) TimestampNTZ 相关支持大概率继续推进
- **PR**: #11626
- **PR**: #11720
- **PR**: #11656
- **链接**: apache/gluten PR #11626 / #11720 / #11656

从“基础支持 + fallback 配置 + 验证测试”这一组合看，TimestampNTZ 很可能已进入明确路线图。  
这是一个**高概率纳入下一阶段版本**的方向。

---

### 4) Iceberg 写入配置增强
- **PR**: #11776 `Added iceberg write configs`
- **状态**: OPEN
- **链接**: apache/gluten PR #11776

新增 `write.target-file-size-bytes`、`write.parquet.page-size-bytes` 配置，说明社区正在增强 Gluten 对 Iceberg 写路径的可控性。  
这类能力通常对：
- 文件大小优化
- 写入性能调优
- 存储格式参数对齐

有直接价值，具备较高落地可能性。

---

### 5) 并行执行属于中长期战略方向
- **PR**: #11852
- **链接**: apache/gluten PR #11852

虽然仍是 PoC，但方向价值极高。  
短期未必进入稳定版，长期则可能成为 Gluten/Velox 执行层竞争力的重要组成。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出几类真实用户痛点：

### 1) 用户非常关心“不要无故 fallback”
典型代表是 TimestampNTZ 相关工作：
- 当前类型不支持会触发 Spark fallback
- 开发者难以验证新功能
- 用户也难以判断是“不支持”还是“配置限制”

这说明 Gluten 用户已不满足于“部分 SQL 可加速”，而是更关注**覆盖率与可预测性**。

相关链接：
- apache/gluten PR #11720
- apache/gluten PR #11626

---

### 2) 用户需要更强的资源生命周期稳定性
S3/AWS SDK teardown 问题说明，真实使用场景里不只是批处理跑通，还包括：
- 进程退出稳定
- 服务化运行
- 外部对象生命周期可控

相关链接：
- apache/gluten Issue #11796
- apache/gluten PR #11857

---

### 3) 用户在意 UI 与可观测性
V2 write fallback 信息不展示，会直接影响用户判断：
- 为什么没有完全下推
- 哪一层退回 Spark
- 最终计划是否符合预期

这反映生产使用者已把 Gluten 当作需要日常运营与排障的系统，而非纯实验性插件。

相关链接：
- apache/gluten PR #11853

---

### 4) 社区对上游依赖管理存在持续压力
Velox 未合并 PR 跟踪器说明，用户和贡献者希望：
- 关键能力尽快可用
- 避免长期 fork 维护
- 降低 rebase/pick 成本

这是一种典型的**生态协同痛点**。

相关链接：
- apache/gluten Issue #11585

---

## 8. 待处理积压

### 1) Velox 上游未合并 PR 跟踪器需持续收敛
- **Issue**: #11585
- **状态**: OPEN
- **创建时间**: 2026-02-07
- **评论**: 16
- **链接**: apache/gluten Issue #11585

这是当前最值得维护者持续关注的“积压型”议题。  
若长期存在大量关键 patch 未上游合并，将导致：
- Gluten 与 Velox 版本演进耦合复杂化
- 本地维护成本增加
- 发布与测试矩阵膨胀

建议维护者定期清理、分类并标记优先级。

---

### 2) TIMESTAMP_NTZ 基础支持 PR 停留时间较长
- **PR**: #11626
- **状态**: OPEN
- **创建时间**: 2026-02-17
- **链接**: apache/gluten PR #11626

该 PR 与 Spark 新类型兼容性高度相关，影响面较大。  
若继续悬而未决，将拖累：
- 时间类型覆盖率
- 后续相关函数/表达式支持
- 开发者对新语义的测试效率

建议优先推进设计收敛与测试补齐。

---

### 3) 文档/配置类功能 PR 需要避免长期挂起
- **PR**: #11776 `Added iceberg write configs`
- **状态**: OPEN
- **创建时间**: 2026-03-17
- **链接**: apache/gluten PR #11776

该 PR 面向实际生产调优场景，用户价值明确。  
若长期未处理，容易造成：
- 文档与实现不一致
- 用户自行 patch
- 写路径参数能力碎片化

---

### 4) 明显不应继续悬挂的测试性 PR
- **PR**: #11743 `[DNR] Temp test`
- **状态**: OPEN
- **创建时间**: 2026-03-11
- **链接**: apache/gluten PR #11743

从标题看更像临时测试/占位 PR。  
建议维护者尽快清理，以免：
- 干扰活跃 PR 视图
- 增加 triage 成本
- 降低项目治理清晰度

---

## 结论

今天的 Apache Gluten 动态显示出一个典型的**快速演进中的分析引擎项目**特征：  
一方面，底层稳定性问题能快速闭环修复，Spark 4.x 兼容性与测试覆盖持续提升；另一方面，TimestampNTZ、ANSI 语义、Kafka 读取、并行执行等关键方向仍在展开，说明项目仍有较强功能扩张势头。  
若后续能进一步收敛长期开放的兼容性 PR，并减少对未上游 Velox patch 的依赖，项目健康度还会继续提升。

--- 

如需，我还可以把这份日报继续整理成：
1. **适合飞书/Slack 发布的简版**
2. **适合邮件周报的管理层摘要版**
3. **按“Spark / Velox / Flink / Iceberg”分域的技术视图版**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-04-01）

## 1. 今日速览

过去 24 小时，Apache Arrow 保持较高活跃度：Issues 更新 24 条、PR 更新 18 条，但**无新版本发布**。  
从变更结构看，今天的重点集中在 **C++/Parquet/FlightRPC 稳定性修复**、**CI 基础设施调整**，以及 **ODBC/Flight SQL 生态建设**。  
关闭/合并项不少，说明维护节奏正常；不过大量被 `stale-warning` 触发的旧议题同时更新，也反映出项目仍存在一定的**历史积压压力**。  
整体健康度判断：**活跃且可控，偏向工程治理与稳定性收敛的一天**，其中 Parquet fuzzing、Windows 验证、R/S3 CI 问题是最值得关注的运行稳定性信号。

---

## 3. 项目进展

> 今日无 Release，以下聚焦已关闭/合并的重要 PR 与对应推进方向。

### 3.1 CI 与发布流程修复：R 访问 S3 数据集问题已快速关闭
- **PR #49625** `[R][CI] Some R CI jobs seem unable to access some S3 files on arrow-datasets bucket`  
  链接: apache/arrow PR #49625  
- 对应 Issue: **#49622**  
  链接: apache/arrow Issue #49622  

**进展解读：**
- 问题在于部分 R CI 作业无法访问 `arrow-datasets` bucket 中的某些 S3 文件。
- 修复方案不是在客户端重试或权限绕过，而是**切换到具备写权限的新 bucket**。
- 这类修复虽非核心执行引擎特性，但直接影响：
  - R 绑定的持续集成稳定性
  - dataset 相关回归测试的可信度
  - 后续发布验证质量

**影响判断：**
- 属于**基础设施可用性修复**，对用户可见性较低，但对版本质量保障很关键。
- 处理速度快，显示维护者对发布阻塞类 CI 问题响应及时。

---

### 3.2 Windows 验证链路修复：PyArrow 安装验证问题已关闭
- **PR #49624** `[CI][Python] Install built wheel on Windows verification and test in isolation`  
  链接: apache/arrow PR #49624  
- 对应 Issue: **#49623** `[CI][Python] Windows verification job fails importing PyArrow on Windows`  
  链接: apache/arrow Issue #49623  

**进展解读：**
- 问题出现在 Windows 上 RC/source verification 过程中，构建出的 wheel 导入失败。
- PR 调整验证逻辑：**安装构建好的 wheel，并在隔离环境中测试**，避免 editable install 路径掩盖真实打包问题。
- 这说明项目在 Python 打包链上正向更严格、更贴近真实用户安装路径的验证方式演进。

**影响判断：**
- 这是**发布质量与平台兼容性修复**，尤其影响 Windows 用户和 RC 验证流程。
- 对 PyArrow 发行质量意义很大，属于典型“CI 问题但实际能影响最终用户”的修复。

---

### 3.3 IPC fuzzing 防护增强：降低无效 batch 引发的内存风险
- **PR #49618** `[C++][CI] Validate all batches in IPC file fuzzer`  
  链接: apache/arrow PR #49618  
- 对应 Issue: **#49617**  
  链接: apache/arrow Issue #49617  

**进展解读：**
- 在 IPC file fuzzer 中，同时使用 IPC stream reader 做差分 fuzzing 时，之前**没有对 batch 逐一做 validate**。
- 新修复增加了完整校验，避免后续操作在无效 batch 上继续执行，降低**invalid memory access** 风险。
- 这是一类典型的“测试基础设施修复”，但价值非常高，因为它可以更早暴露内存安全问题。

**影响判断：**
- 对 Arrow 的二进制格式稳定性、模糊测试有效性有正面作用。
- 这是**稳定性与安全性治理**上的明确推进。

---

### 3.4 FlightRPC 解耦继续推进：gRPC 依赖边界被进一步收敛
- **PR #49549** `[C++][FlightRPC] Decouple Flight Serialize/Deserialize from gRPC transport`  
  链接: apache/arrow PR #49549  
- 对应 Issue: **#49548**  
  链接: apache/arrow Issue #49548  

**进展解读：**
- 本项工作将 Flight 的序列化/反序列化逻辑从 gRPC transport 细节中解耦。
- 对查询引擎和连接器生态的意义在于：
  - 为**非 gRPC transport** 留出更清晰的抽象层
  - 降低编解码层对 gRPC 内部类型的耦合
  - 方便未来更灵活的 Flight/Flight SQL 接入实现

**影响判断：**
- 这是**架构层演进**，短期对 SQL 兼容性无直接新增，但对 Flight SQL 驱动、ODBC/JDBC 生态和传输层扩展是重要铺垫。
- 与历史上的 Flight transport-agnostic 重构议题形成闭环。

---

### 3.5 Compute 正确性修复已落地：列表过滤场景的数据损坏问题关闭
- **PR #49602** `[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering`  
  链接: apache/arrow PR #49602  

**进展解读：**
- 修复了 `list<double>` 列在过滤特定行时出现的**用户可见数据错乱/child span 取值错误**问题。
- 这是直接影响查询结果正确性的 bug，不是纯内部实现瑕疵。
- 对上层 Dataset/Compute 表达式执行、过滤算子可信度有实质提升。

**影响判断：**
- 属于今天最有价值的**查询正确性修复**之一。
- 对分析型引擎场景尤为关键，因为过滤算子是高频路径。

---

## 4. 社区热点

### 4.1 Windows 文件句柄/资源释放问题持续有关注
- **Issue #31796** `[R] Permission error on Windows when deleting file previously accessed with open_dataset`  
  链接: apache/arrow Issue #31796  
  评论: 26

**热点原因：**
- 这是今天评论最多的活跃 Issue。
- 核心症状是 Windows 下 `open_dataset` 访问过的文件/目录删除时报权限错误，指向**句柄释放不及时或 reader 生命周期管理问题**。

**技术诉求分析：**
- 用户需要 Arrow 在 Windows 上具备更可预测的资源释放行为。
- 这不仅影响 R 用户体验，也关系到：
  - 临时数据集清理
  - ETL/测试流水线
  - 与 DuckDB、RecordBatchReader 等组合使用时的互操作稳定性

---

### 4.2 自定义 Python 对象写 Parquet 的需求仍在，但已被关闭
- **Issue #31267** `[Python] Allow serializing arbitrary Python objects to parquet`  
  链接: apache/arrow Issue #31267  
  评论: 10

**热点原因：**
- 虽是旧议题，但今天被关闭，说明社区对“Parquet 是否应承载任意 Python 对象”已有更明确边界。
  
**技术诉求分析：**
- 用户希望 Parquet 作为通用持久化手段，直接保存 pandas 中的自定义对象列。
- 但这与 Parquet/Arrow 的设计哲学存在张力：
  - Parquet 面向**结构化、可跨语言解释的数据**
  - arbitrary Python object 本质上偏向 pickle 语义，跨语言与可移植性弱
- 关闭此类需求，说明项目依然坚持**格式标准化优先**，而非为 Python 特例扩展存储语义。

---

### 4.3 ODBC / Flight SQL 持续升温，体现 Arrow 作为分析连接层的扩张
- **PR #49603** `[C++][FlightRPC] Windows CI to Support ODBC DLL & MSI Signing`  
  链接: apache/arrow PR #49603  
- **PR #46099** `[C++] Arrow Flight SQL ODBC layer`  
  链接: apache/arrow PR #46099  
- **PR #49585** `DRAFT: set up static build of ODBC FlightSQL driver`  
  链接: apache/arrow PR #49585  
- **Issue #49595** `[C++][FlightRPC][ODBC] DEB Linux Installer`  
  链接: apache/arrow Issue #49595  

**热点原因：**
- 多个 PR/Issue 同时围绕 ODBC 驱动构建、签名、安装包交付推进。
- 表明 Arrow 不再只停留在内存格式与库层，而是在**面向企业 BI / SQL 客户端接入层**持续建设。

**技术诉求分析：**
- 用户需要的不只是 Flight SQL 协议本身，而是：
  - Windows DLL/MSI 交付
  - Linux DEB 安装器
  - 静态构建
  - CI 中的签名与发布链路
- 这说明社区在推动 Arrow 进入更完整的**数据库连接器分发形态**。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：Parquet 编码 fuzz 失败
- **Issue #49626** `[Parquet][C++][CI] Encoding-fuzz failure`  
  链接: apache/arrow Issue #49626  
- **Fix PR #49627** `[C++][Parquet] Fix encoding fuzzing failure`  
  链接: apache/arrow PR #49627  

**问题概述：**
- OSS-Fuzz 报告 Parquet 编码/解码路径存在失败场景。
- PR 描述指出 `DELTA_BINARY_PACKED` 解码器**未能始终满足“返回请求值数量或报错”的契约**。

**风险分析：**
- 涉及 Parquet 解码正确性与鲁棒性。
- 若契约不满足，可能导致：
  - 读取结果异常
  - 上层逻辑状态不一致
  - fuzzing 进一步挖掘出更严重内存问题

**状态：**
- 已有修复 PR，响应及时。

---

### P1：C++ 空指针潜在解引用
- **Issue #49445** `Potential dereference of nullptr`  
  链接: apache/arrow Issue #49445  
- **PR #49483** `[C++]: Fix potential dereference of nullptr`  
  链接: apache/arrow PR #49483  

**问题概述：**
- `cpp/src/arrow/c/bridge.cc` 中存在 NULL 检查后仍可能发生不安全解引用的路径。
- 位于 Arrow C bridge，属于跨语言/跨 ABI 边界敏感区域。

**风险分析：**
- 可能引发崩溃，影响 embedding 或 FFI 使用场景。
- 若在异常路径触发，排查成本高。

**状态：**
- 已有修复 PR，但尚未合并。

---

### P1：Windows 上 PyArrow wheel 导入失败
- **Issue #49623**  
  链接: apache/arrow Issue #49623  
- **PR #49624**  
  链接: apache/arrow PR #49624  

**问题概述：**
- Windows 验证作业无法导入构建出的 PyArrow wheel。

**风险分析：**
- 属于发布阻塞型问题，影响 Windows 发行物质量。
- 若未在 RC 阶段发现，将直接伤害用户安装体验。

**状态：**
- 已关闭，对应修复已完成。

---

### P2：R CI 无法访问 S3 数据
- **Issue #49622**  
  链接: apache/arrow Issue #49622  
- **PR #49625**  
  链接: apache/arrow PR #49625  

**问题概述：**
- 部分 R CI 作业无法读取 `arrow-datasets` bucket 的对象。

**风险分析：**
- 主要影响 CI 稳定性与测试数据可用性。
- 对功能本身不一定是产品 bug，但会削弱回归验证信心。

**状态：**
- 已关闭。

---

### P2：IPC 文件 fuzzer 未校验全部 batch
- **Issue #49617**  
  链接: apache/arrow Issue #49617  
- **PR #49618**  
  链接: apache/arrow PR #49618  

**问题概述：**
- 差分 fuzzing 流程对部分 batch 未做 validate，可能导致后续无效内存访问。

**风险分析：**
- 属于测试防线缺口。
- 虽不是直接用户 bug，但若长期存在，会降低对二进制读取器安全性的覆盖能力。

**状态：**
- 已修复关闭。

---

### P2：Compute 过滤导致 list 数据错乱
- **PR #49602** `[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering`  
  链接: apache/arrow PR #49602  

**问题概述：**
- `list<double>` 过滤场景出现 child span 偏移溢出，导致结果错误。

**风险分析：**
- 直接影响查询正确性。
- 是分析引擎中高优先级问题，尤其在复杂嵌套列处理中影响大。

**状态：**
- 已关闭。

---

## 6. 功能请求与路线图信号

### 6.1 Flight SQL / ODBC 正在成为中期重点方向
相关条目：
- **PR #49603** Windows CI 支持 ODBC DLL & MSI 签名  
  链接: apache/arrow PR #49603
- **PR #46099** Arrow Flight SQL ODBC layer  
  链接: apache/arrow PR #46099
- **PR #49585** 静态构建 ODBC FlightSQL driver  
  链接: apache/arrow PR #49585
- **Issue #49595** ODBC DEB Linux Installer  
  链接: apache/arrow Issue #49595
- **PR #49498** `[FlightRPC] Add is_update field to ActionCreatePreparedStatementResult`  
  链接: apache/arrow PR #49498

**路线图判断：**
- 这些工作共同指向一个清晰信号：Arrow 正在补齐 **Flight SQL 驱动可分发性、安装体验、以及数据库驱动 API 语义**。
- `is_update` 字段尤其体现出对数据库驱动兼容性的增强，方便客户端区分 prepared statement 是查询还是更新命令。
- 高概率纳入后续版本持续迭代，尤其是 Windows / Linux 驱动交付链。

---

### 6.2 Parquet 写入安全性与类型转换边界继续强化
- **PR #49615** `[C++][Parquet] Check for integer overflow when coercing timestamps`  
  链接: apache/arrow PR #49615

**路线图判断：**
- 时间戳单位转换时加入整数溢出检查，解决“静默写坏数据”的风险。
- 这类改动不一定是大功能，但对分析型存储来说非常关键：**比起速度，写入正确性更优先**。
- 预计更容易进入下一版本，因为问题边界清晰、用户价值明确。

---

### 6.3 Ruby 绑定在补齐格式特性支持
- **Issue #49620** `[Ruby] Add support for custom metadata in Message`  
  链接: apache/arrow Issue #49620
- **PR #49621** `[Ruby] Add support for custom metadata in Message`  
  链接: apache/arrow PR #49621

**路线图判断：**
- 这是对 Arrow format `Message` custom metadata 的绑定补齐。
- 虽不属于 OLAP 核心执行路径，但体现多语言生态一致性建设仍在推进。
- 由于已有 PR，当期被接纳的概率较高。

---

### 6.4 云存储与异步文件系统仍有长期需求待推进
- **Issue #20314** `[C++] Add GCS connection pool size option`  
  链接: apache/arrow Issue #20314
- **Issue #20228** `[Python] Support AWS S3 Web identity credentials`  
  链接: apache/arrow Issue #20228
- **Issue #31831** `[C++] Update GetFileInfo in FromProto to use async filesystem APIs`  
  链接: apache/arrow Issue #31831
- **Issue #31834** `[C++] Add support for non-local filesystem URIs in the Substrait consumer`  
  链接: apache/arrow Issue #31834

**路线图判断：**
- 云对象存储性能、鉴权方式、异步元数据访问、Substrait 远端 URI 支持，都是 Arrow 成为现代分析引擎底座时必须补齐的点。
- 但今天没有直接配套 PR，说明这类需求仍偏中长期积压，不像 ODBC/Flight SQL 那样进入密集落地阶段。

---

## 7. 用户反馈摘要

### 7.1 Windows 资源释放问题依旧影响真实工作流
- **Issue #31796**  
  链接: apache/arrow Issue #31796

**用户痛点：**
- 打开 dataset 后文件难以及时删除，影响临时目录清理和自动化脚本。
- 尤其在 Windows 平台，这种句柄占用会让用户误以为 Arrow 存在“内存或文件锁泄漏”。

---

### 7.2 用户希望 Arrow 更自然接入云身份体系
- **Issue #20228**  
  链接: apache/arrow Issue #20228

**用户场景：**
- 在 AWS 环境中，希望 Python 层直接支持 S3 Web identity credentials。
- 这反映出 Arrow 已广泛嵌入云原生数据处理链路，用户不想为凭证桥接写额外胶水代码。

---

### 7.3 高并发云存储读取性能仍是用户关注点
- **Issue #20314**  
  链接: apache/arrow Issue #20314

**用户场景：**
- 多线程读取 GCS 时吞吐受限，希望开放连接池大小控制。
- 这类需求来自典型 OLAP/批处理场景：高延迟对象存储下，只有提升并发连接度才能榨出带宽。

---

### 7.4 内存占用与释放时机仍影响 R 用户体验
- **Issue #31825** `[R] After dataset scan, some RAM is left consumed until a garbage collection pass`  
  链接: apache/arrow Issue #31825
- **Issue #31824** `[C++] ParquetFileFragment caches parquet file metadata and there is no way to disable this`  
  链接: apache/arrow Issue #31824

**用户场景：**
- 扫描完成后，R 层观察到内存未立即回收；另有用户指出 Parquet 元数据缓存缺乏关闭开关。
- 两者背后都指向同一类诉求：**分析扫描过程中，Arrow 需要给用户更多内存行为可控性**。

---

## 8. 待处理积压

以下条目虽在今天被更新，但明显属于长期积压，建议维护者重点关注：

### 8.1 云存储性能与认证相关老问题
- **Issue #20314** `[C++] Add GCS connection pool size option`  
  创建: 2022-07-10  
  链接: apache/arrow Issue #20314
- **Issue #20228** `[Python] Support AWS S3 Web identity credentials`  
  创建: 2022-05-04  
  链接: apache/arrow Issue #20228

**原因：**
- 都是云场景中的高价值能力，且直接影响 Arrow 在数据湖/对象存储分析中的适配度。

---

### 8.2 Substrait 与异步文件系统能力仍未补齐
- **Issue #31834** `[C++] Add support for non-local filesystem URIs in the Substrait consumer`  
  链接: apache/arrow Issue #31834
- **Issue #31831** `[C++] Update GetFileInfo in FromProto to use async filesystem APIs`  
  链接: apache/arrow Issue #31831

**原因：**
- 这两项对远端数据访问和查询计划执行效率都重要。
- 如果 Arrow 要继续强化其作为查询执行底座的角色，这类问题不宜长期停留在 stale 状态。

---

### 8.3 R 平台上的资源管理问题持续存在
- **Issue #31796** Windows 删除权限错误  
  链接: apache/arrow Issue #31796
- **Issue #31825** dataset scan 后 RAM 释放滞后  
  链接: apache/arrow Issue #31825
- **Issue #33390** `[R] Allow setting field metadata`  
  链接: apache/arrow Issue #33390

**原因：**
- R 绑定在数据科学用户中仍有重要地位，资源释放、schema 元数据能力和平台兼容性问题长期悬而未决，会削弱使用体验。

---

### 8.4 大型长期 PR 需要维护者加速决策
- **PR #46099** `[C++] Arrow Flight SQL ODBC layer`  
  创建: 2025-04-10  
  链接: apache/arrow PR #46099
- **PR #48964** `[C++] Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions`  
  创建: 2026-01-23  
  链接: apache/arrow PR #48964
- **PR #48539** `[Python][CI] Add support for building PyArrow library on Windows ARM64`  
  创建: 2025-12-15  
  链接: apache/arrow PR #48539

**原因：**
- 这些 PR 都具有较强的基础设施或生态价值，但周期较长。
- 尤其是依赖栈升级与 Windows ARM64 支持，若迟迟不推进，后续维护成本和平台滞后风险会继续上升。

---

## 总结判断

今天的 Arrow 更像是在做一次**工程面收口**而非功能爆发：  
- 一方面，**Parquet、IPC、Compute、Python Windows 打包**等关键路径上的稳定性问题持续被修复；  
- 另一方面，**Flight SQL / ODBC** 方向出现明显的路线图信号，说明 Arrow 正在向更完整的分析连接器生态迈进。  

需要警惕的是，许多 2022 年遗留的云存储、R 资源管理、Substrait 文件系统能力问题仍在积压。短期看项目健康度良好；中期看，若能把这些长期未决议题与当前活跃的 Flight/ODBC 方向一并推进，Arrow 在 OLAP/湖仓分析基础设施中的竞争力会进一步增强。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*