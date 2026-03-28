# Apache Doris 生态日报 2026-03-28

> Issues: 7 | PRs: 156 | 覆盖项目: 10 个 | 生成时间: 2026-03-28 01:21 UTC

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

# Apache Doris 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Apache Doris 保持了很高的开发活跃度：Issues 更新 7 条、PR 更新 156 条，其中 86 条已合并或关闭，说明主干与多分支维护都在快速推进。  
从内容看，今天的重点集中在 **Parquet 导出兼容性修复、File Cache 内存与读路径优化、认证与安全增强、Iceberg 能力扩展** 等方向。  
稳定性方面，新增 Issue 主要是 **BE 崩溃、备份恢复后写入失败、compaction 状态切换异常、日期与 TVF 错误**，不少问题已经在当天出现对应修复 PR，响应速度较快。  
综合判断，项目当前处于 **高频迭代 + 多版本并行维护** 的健康状态，但也反映出 Doris 在复杂存储格式、恢复链路和边缘兼容场景上的回归风险仍需持续压测与治理。

---

## 3. 项目进展

### 3.1 查询引擎与 SQL/格式兼容性修复

- **修复 Parquet INT96 时间戳写出问题**
  - PR: [#61760](https://github.com/apache/doris/pull/61760)（已关闭）
  - 回溯/分支 PR: [#61837](https://github.com/apache/doris/pull/61837), [#61839](https://github.com/apache/doris/pull/61839), [#61832](https://github.com/apache/doris/pull/61832)
  - 价值：修复此前补丁导致的 Doris 导出 Parquet 时无法正确写入 `INT96` 时间戳类型的问题。这类问题直接影响 Doris 与 Spark/Hive/老生态工具的互通，是典型的 **数据交换兼容性修复**。
  - 进展判断：该修复已进入 cherry-pick 流程，说明维护者认为问题影响面较广，预计会覆盖 4.1 分支。

- **Insert 错误信息长度可配置**
  - PR: [#61075](https://github.com/apache/doris/pull/61075)（已关闭）
  - 价值：为 FE 新增 `insert_error_msg_max_length` 配置，改善大批量导入失败时的可观测性，属于 **SQL 执行错误诊断能力增强**。

- **修复时区/DST 处理错误**
  - PR: [#51454](https://github.com/apache/doris/pull/51454)（已关闭）
  - 价值：DST（夏令时）问题是典型查询正确性问题，且该修复已被多分支吸收，说明其重要性较高，对国际化场景用户尤其关键。

- **修复 HTTPS 模式下 BE 返回错误的 load error URL**
  - PR: [#61785](https://github.com/apache/doris/pull/61785)
  - 价值：虽属边缘问题，但影响运维排障闭环，能减少在安全部署场景下的错误跳转或错误诊断。

### 3.2 存储与缓存优化

- **File Cache：异步 LRU 更新 + partial hit 修复**
  - PR: [#61083](https://github.com/apache/doris/pull/61083)
  - 回溯 PR: [#61812](https://github.com/apache/doris/pull/61812)
  - 价值：修复缓存 reader 在部分命中场景下的遍历起点/计数错误，并将 LRU 更新从查询读路径解耦。这有助于：
    1. 降低远端文件读取时的额外回退开销  
    2. 降低热点查询读路径上的锁/更新负担  
    3. 提升 cache 命中后的稳定收益

- **File Cache：回收过期 tablet 热点计数器，压缩稀疏 shard**
  - PR: [#61833](https://github.com/apache/doris/pull/61833)
  - 分支 PR: [#61834](https://github.com/apache/doris/pull/61834)
  - 价值：针对 `TabletHotspot` 内存持续增长（约 1.8–2.7 GB/天）问题进行治理，直接属于 **长时间运行稳定性优化**。这对对象存储/冷热分层场景尤其重要。

### 3.3 外部表与湖仓生态能力

- **Iceberg：支持 update/delete/merge into**
  - PR: [#61818](https://github.com/apache/doris/pull/61818)
  - 价值：这是 Iceberg 生态写入/变更能力的重要补齐，意味着 Doris 对 lakehouse 事务性表操作的支持继续向前推进。

- **Iceberg v3 row lineage 支持**
  - PR: [#61398](https://github.com/apache/doris/pull/61398)
  - 价值：row lineage 是 Iceberg 新能力中的关键元数据能力，关系到变更追踪、审计和高级优化，体现 Doris 正在加快跟进上游表格式演进。

- **升级 Iceberg Docker Spark 版本到 4.0**
  - PR: [#61838](https://github.com/apache/doris/pull/61838)
  - 价值：更多偏向开发与集成测试基座更新，但通常是后续生态兼容能力推进的先导信号。

### 3.4 认证、安全与企业集成

- **集成 OIDC 认证、MySQL 登录桥接与角色映射**
  - PR: [#61819](https://github.com/apache/doris/pull/61819)
  - 价值：这是今日最值得关注的功能型 PR 之一。它将 Doris FE 认证扩展与 MySQL 协议登录路径结合，说明 Doris 正加强：
    - 企业统一身份认证接入
    - 基于 OIDC 的现代 SSO
    - 登录态到 Doris 角色的映射治理  
  - 影响：若后续合并，预计会显著提升 Doris 在企业内网、云原生和平台化部署中的可接入性。

- **支持复杂密码校验**
  - PR: [#61778](https://github.com/apache/doris/pull/61778)
  - 价值：增强密码策略，符合企业安全基线诉求。

- **LDAP 禁止空密码登录配置**
  - PR: [#61440](https://github.com/apache/doris/pull/61440)
  - 价值：补足 LDAP 场景安全治理能力，面向生产合规环境意义较大。

### 3.5 元数据与架构演进

- **Catalog 重构：Column 与非核心类解耦**
  - PR: [#61816](https://github.com/apache/doris/pull/61816)
  - 价值：属于内部架构清理，有助于降低 catalog 模块耦合度，为后续元数据扩展和维护成本下降打基础。

- **HMS Client Pool 迁移到 Commons Pool**
  - PR: [#61553](https://github.com/apache/doris/pull/61553)
  - 价值：改进 FE 侧 HMS 客户端资源管理，对 Hive Metastore 集成稳定性与连接复用有正面价值。

- **统一 JNI 读写框架，淘汰部分遗留连接器架构**
  - PR: [#61084](https://github.com/apache/doris/pull/61084)（已关闭）
  - 价值：这是较大的架构统一动作，有利于 JDBC/Paimon/Hudi/Iceberg/MaxCompute 等连接器代码路径一致化。

---

## 4. 社区热点

> 说明：提供的数据中 PR 评论数均显示为 `undefined`，无法严格按评论量排序，以下根据变更影响面、标签状态、分支回溯情况和问题关联度判断热点。

### 热点 1：Parquet INT96 导出兼容性修复链

- PR: [#61760](https://github.com/apache/doris/pull/61760)
- 分支 PR: [#61832](https://github.com/apache/doris/pull/61832), [#61837](https://github.com/apache/doris/pull/61837), [#61839](https://github.com/apache/doris/pull/61839)

**分析：**  
Parquet 的 `INT96` 虽非最现代方案，但在大量历史数仓与 Spark/Hive 生态中仍然广泛存在。此次修复和快速多分支回溯说明 Doris 对外部生态兼容性非常重视。  
**背后技术诉求** 是：导出链路必须足够“保守兼容”，避免因底层 Arrow/Parquet patch 行为变化影响用户生产交换链路。

### 热点 2：File Cache 稳定性与内存治理

- PR: [#61083](https://github.com/apache/doris/pull/61083)
- PR: [#61833](https://github.com/apache/doris/pull/61833)
- 分支 PR: [#61812](https://github.com/apache/doris/pull/61812), [#61834](https://github.com/apache/doris/pull/61834)

**分析：**  
从 partial hit 逻辑到热点计数器内存泄涨，说明 Doris 在云存储/远程文件缓存场景下已进入精细化治理阶段。  
**背后技术诉求** 是：对象存储 + 本地缓存已经是 Doris 重要生产模式，缓存命中率、内存占用和长期运行稳定性成为核心关注点。

### 热点 3：OIDC + MySQL 登录桥接

- PR: [#61819](https://github.com/apache/doris/pull/61819)

**分析：**  
这类认证能力通常不是“单点功能”，而是企业接入门槛的关键。  
**背后技术诉求** 是：用户希望用统一身份平台接入 Doris，同时不破坏现有 MySQL 协议客户端生态。

### 热点 4：4.0.5 Release Notes 预热

- Issue: [#61817](https://github.com/apache/doris/issues/61817)

**分析：**  
虽然今日无正式 release，但 release notes issue 已出现，意味着版本发布准备工作正在推进。摘要中覆盖倒排索引、BM25、MATCH projection 等，表明 Doris 4.0.5 重点之一仍是 **检索分析一体化能力增强**。

---

## 5. Bug 与稳定性

以下按严重程度和影响范围排序：

### P1：BE 崩溃 - 聚合表中 double 作为 key 导致崩溃
- Issue: [#61797](https://github.com/apache/doris/issues/61797)
- 状态：OPEN
- 现象：在 agg table 中，double 类型作为 key 触发 BE crash。
- 风险：这是典型 **服务稳定性/进程崩溃** 问题，优先级最高，可能影响建表规范边界与执行路径健壮性。
- fix PR：**暂未在给定数据中看到明确关联修复 PR**

### P1：compaction 期间若发生 balance 或其他 state change，可能导致 compaction 无法执行
- Issue: [#61823](https://github.com/apache/doris/issues/61823)
- 状态：OPEN
- 现象：状态变化与 compaction 异步任务之间存在竞态，导致 compaction 卡住或失效。
- 风险：直接影响 **存储层后台治理能力**，若长期持续可能放大写放大、版本堆积和查询性能退化。
- fix PR：**暂未看到对应 PR**

### P1：带物化视图的表在备份恢复后插入失败
- Issue: [#61827](https://github.com/apache/doris/issues/61827)
- 修复 PR: [#61829](https://github.com/apache/doris/pull/61829)
- 状态：Issue OPEN，PR OPEN
- 现象：全量同步带 MV 的表后，恢复过程未正确还原 MV 与基表 schema mapping，后续 insert/load 失败。
- 风险：影响 **灾备恢复正确性**，且会伤及带物化视图的生产表恢复链路。
- 进展：已有当日修复，响应较快。

### P2：TVF 因 thrift message 过大报错
- Issue: [#61787](https://github.com/apache/doris/issues/61787)
- 修复 PR: [#61788](https://github.com/apache/doris/pull/61788)
- 状态：Issue OPEN，PR OPEN（已 approved/reviewed）
- 风险：影响大结果集或特定 TVF 返回场景，属于 **接口传输限制触发的可用性问题**。
- 进展：已有修复，且评审状态较积极。

### P2：allow_zero_date 配置不生效
- Issue: [#61789](https://github.com/apache/doris/issues/61789)
- 修复 PR: [#61791](https://github.com/apache/doris/pull/61791)
- 状态：Issue OPEN，PR OPEN（已 approved/reviewed）
- 风险：影响 MySQL 兼容行为和历史脏数据接入场景，属于 **SQL 兼容性/数据导入正确性问题**。
- 进展：已快速给出修复。

### P2：Parquet INT96 写出错误
- PR: [#61760](https://github.com/apache/doris/pull/61760)
- 状态：已关闭并触发多分支回溯
- 风险：影响导出互操作性，对外部生态兼容非常关键。
- 进展：已实质解决。

### P3：HTTPS 模式下 load error 返回 URL 协议错误
- PR: [#61785](https://github.com/apache/doris/pull/61785)
- 风险：主要影响运维体验与排障路径，不属于核心数据正确性风险。

---

## 6. 功能请求与路线图信号

### 6.1 用 fastUtil primitive collections 全面替换 Java 标准泛型集合
- Issue: [#61835](https://github.com/apache/doris/issues/61835)

**信号解读：**  
该提案希望把 `ArrayList<Integer>`、`HashSet<Long>`、`Map<Integer, V>` 等大量装箱集合替换为 fastUtil 的原生类型集合。  
这类改动通常目标明确：
- 降低装箱/拆箱开销
- 降低 GC 压力
- 提升热点路径性能
- 改善 FE Java 侧内存效率

**是否可能纳入下一版本：**  
有一定可能，但更像 **中长期性能工程**，因为涉及面大、回归风险高，不太像短周期 patch 版功能。

### 6.2 OIDC 企业认证接入
- PR: [#61819](https://github.com/apache/doris/pull/61819)

**信号解读：**  
这很可能成为下一阶段 Doris 面向企业部署的重要卖点之一。若顺利合并，预计会进入后续小版本或次大版本特性说明。

### 6.3 安全基线增强：复杂密码、LDAP 空密码控制
- PR: [#61778](https://github.com/apache/doris/pull/61778)
- PR: [#61440](https://github.com/apache/doris/pull/61440)

**信号解读：**  
说明 Doris 正在补齐数据库产品在企业合规方面的“默认安全能力”，这类特性很容易进入正式版本说明。

### 6.4 Iceberg 更深层支持
- PR: [#61818](https://github.com/apache/doris/pull/61818)
- PR: [#61398](https://github.com/apache/doris/pull/61398)

**信号解读：**  
从 merge/update/delete 到 row lineage，Doris 对 Iceberg 的支持已从“可读”逐步走向“可管理、可变更、可追踪”。这几乎可以确定是未来版本的重要路线图方向。

### 6.5 全局单调递增 TSO
- PR: [#61199](https://github.com/apache/doris/pull/61199)

**信号解读：**  
TSO 一般与事务、全局顺序、跨节点一致性协同能力相关，是较偏底层的路线图信号。若推进成功，可能为更复杂事务语义和分布式一致性功能打基础。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出几类真实用户痛点：

1. **复杂恢复场景的可靠性仍是痛点**
   - 代表：[#61827](https://github.com/apache/doris/issues/61827)
   - 用户场景：带物化视图的表进行备份/恢复、全量同步后继续写入。
   - 反馈含义：用户不只把 Doris 当查询引擎，也作为核心生产系统，要求灾备恢复后“立即可写、语义一致”。

2. **边缘类型与兼容配置问题会迅速暴露到生产**
   - 代表：[#61797](https://github.com/apache/doris/issues/61797), [#61789](https://github.com/apache/doris/issues/61789)
   - 用户场景：double key、zero-date 兼容。
   - 反馈含义：Doris 正面对越来越复杂的历史数据和异构迁移任务，MySQL 兼容细节与类型边界尤其敏感。

3. **大数据量/大消息场景仍需要更多保护**
   - 代表：[#61787](https://github.com/apache/doris/issues/61787)
   - 用户场景：TVF 返回数据或元信息过大，触发 thrift 限制。
   - 反馈含义：用户正在把 Doris 用在更重的数据接口与表函数链路上，系统默认限制需要更弹性。

4. **长期运行的存储/缓存内存管理受到关注**
   - 代表：[#61833](https://github.com/apache/doris/pull/61833), [#61083](https://github.com/apache/doris/pull/61083)
   - 用户场景：冷热数据分层、远程文件缓存、长时间在线集群。
   - 反馈含义：用户对“跑得快”之外，也越来越关注“跑得久、跑得稳”。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或潜在积压项：

### 8.1 runtime profile 性能优化 PR 长期未落地
- PR: [#56571](https://github.com/apache/doris/pull/56571)
- 状态：OPEN / Stale
- 风险：runtime profile 是性能诊断核心工具，若性能本身存在额外开销，会影响线上诊断体验。
- 建议：明确是否继续推进；若方案过时，应尽快关闭并总结替代方向。

### 8.2 scan 层过滤优化 PR 被 stale 关闭
- PR: [#49020](https://github.com/apache/doris/pull/49020)
- 状态：CLOSED / Stale
- 风险：zone map/bloom filter 的跳过计算优化属于典型扫描性能收益点，值得确认是否已有替代实现。
- 建议：若问题仍存在，应以新 PR 重新承接。

### 8.3 TSO 特性仍在推进中
- PR: [#61199](https://github.com/apache/doris/pull/61199)
- 状态：OPEN / reviewed / meta-change
- 风险：这类底层特性周期长、影响面大，若长期悬而未决，容易阻塞上层事务能力演进。
- 建议：加强设计文档、边界说明和分阶段落地计划。

### 8.4 Iceberg v3 row lineage
- PR: [#61398](https://github.com/apache/doris/pull/61398)
- 状态：OPEN
- 风险：若 Doris 要持续强化湖仓一体能力，这类对齐上游格式版本的工作不宜长期拖延。
- 建议：尽快明确兼容范围、测试矩阵与 release 目标版本。

---

## 链接索引

### Issues
- [#61797 BE crash when double type be key in agg table](https://github.com/apache/doris/issues/61797)
- [#61835 Replace Java std generic collections with fastUtil primitive collections](https://github.com/apache/doris/issues/61835)
- [#61827 After backup/restore with materialized views, insert fails](https://github.com/apache/doris/issues/61827)
- [#61823 compaction 过程中 state change 导致无法 compaction](https://github.com/apache/doris/issues/61823)
- [#61817 4.0.5 Release Notes](https://github.com/apache/doris/issues/61817)
- [#61789 allow_zero_date do not work](https://github.com/apache/doris/issues/61789)
- [#61787 tvf error since thrift message too large](https://github.com/apache/doris/issues/61787)

### 重点 PR
- [#61760 fix parquet write timestamp int96 type](https://github.com/apache/doris/pull/61760)
- [#61832 dev/4.1.x parquet int96 fix (2/2)](https://github.com/apache/doris/pull/61832)
- [#61837 branch-4.1 parquet int96 fix](https://github.com/apache/doris/pull/61837)
- [#61839 branch-4.1 parquet int96 fix cherry-pick](https://github.com/apache/doris/pull/61839)
- [#61819 OIDC authentication + MySQL login bridge + role mapping](https://github.com/apache/doris/pull/61819)
- [#61083 filecache async lru update + partial hit fix](https://github.com/apache/doris/pull/61083)
- [#61812 branch-4.1 filecache async lru update + partial hit fix](https://github.com/apache/doris/pull/61812)
- [#61833 reclaim expired tablet hotspot counters](https://github.com/apache/doris/pull/61833)
- [#61834 branch-4.1 hotspot counters reclaim](https://github.com/apache/doris/pull/61834)
- [#61829 fix restore failure after MV backup/restore](https://github.com/apache/doris/pull/61829)
- [#61788 fix tvf thrift message too large](https://github.com/apache/doris/pull/61788)
- [#61791 fix allow_zero_date incorrect result](https://github.com/apache/doris/pull/61791)
- [#61785 fix https load error url](https://github.com/apache/doris/pull/61785)
- [#61778 support complex user-password validation](https://github.com/apache/doris/pull/61778)
- [#61818 iceberg update/delete/merge into](https://github.com/apache/doris/pull/61818)
- [#61398 support iceberg v3 row lineage](https://github.com/apache/doris/pull/61398)
- [#61553 migrate HMS client pool to Commons Pool](https://github.com/apache/doris/pull/61553)
- [#61084 unify JNI read/write architecture](https://github.com/apache/doris/pull/61084)
- [#61199 global monotonically increasing TSO](https://github.com/apache/doris/pull/61199)
- [#61440 prohibit login with empty LDAP password](https://github.com/apache/doris/pull/61440)
- [#56571 runtime profile performance opt](https://github.com/apache/doris/pull/56571)
- [#49020 skip zone map/bf calculation for filtered pages](https://github.com/apache/doris/pull/49020)

如需，我还可以继续把这份日报整理成更适合内部汇报的 **“管理层摘要版”**，或输出成 **Markdown 表格版/飞书周报格式**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比分析报告  
**日期：2026-03-28**

---

## 1. 生态全景

过去 24 小时的动态显示，OLAP 与分析型存储开源生态整体处于**高活跃、强分化、持续收敛**阶段。  
一方面，Apache Doris、ClickHouse、StarRocks、DuckDB、Databend 等“查询引擎/分析数据库”项目仍在高频修复**正确性、性能与云对象存储适配**问题；另一方面，Iceberg、Delta Lake、Arrow、Velox、Gluten 这类“格式/执行底座/互操作层”项目则在强化**生态协议、引擎接入、兼容性与工程基础设施**。  
从共同趋势看，社区关注点已不再只是“跑得快”，而是转向 **湖仓互操作、对象存储稳定性、企业认证安全、可观测性、SQL 正确性与生产可运维性**。  
整体上，生态正在从单点高性能竞争，进入“**平台化能力 + 生态兼容 + 长时间稳定运行**”的新阶段。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 今日重点方向 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 7 | 156 | 无 | Parquet INT96、File Cache、OIDC、Iceberg 扩展 | **高**：高频迭代，多分支维护成熟，修复响应快 |
| **ClickHouse** | 435 | 500 | **2 个 LTS** | 优化器、格式演进、稳定性修复、资源治理 | **很高**：超高吞吐维护能力，主干+LTS 并进 |
| **DuckDB** | 12 | 43 | 无 | S3/外部文件、崩溃修复、类型边界、执行器稳定性 | **中高**：活跃且收敛快，但 native 稳定性需关注 |
| **StarRocks** | 5 | 104 | 无 | 查询正确性、外表/湖仓、统计信息、shared-data | **高**：功能推进强，但复杂 SQL 正确性需继续压实 |
| **Apache Iceberg** | 7 | 48 | 无 | Spark 兼容、CI/JMH、V4 manifest、CDC/View 规范 | **中高**：基础设施稳，生态兼容压力上升 |
| **Delta Lake** | 3 | 50 | 无 | Kernel-Spark、DSv2、CDC、Schema/DV 正确性 | **中高**：主线清晰，架构升级期特征明显 |
| **Databend** | 3 | 15 | 无 | 聚合 spilling、Join/MERGE、SQL 兼容、表分支 | **中高**：执行层优化明确，社区规模较小但节奏稳定 |
| **Velox** | 3 | 34 | 无 | CI/构建、runtime stats、GPU/cuDF、时间语义 | **中高**：底座型项目，工程化稳步增强 |
| **Apache Gluten** | 4 | 22 | 无 | Spark 4.x、Velox 语义补齐、GPU/CPU 部署解耦 | **中高**：活跃但受上游依赖节奏影响 |
| **Apache Arrow** | 36 | 18 | 无 | Python 易用性、Parquet、Flight SQL ODBC、CI | **高**：生态底座稳定推进，语言/格式两端都活跃 |

### 活跃度简评
- **超高活跃层**：ClickHouse、Apache Doris、StarRocks  
- **高活跃层**：DuckDB、Iceberg、Delta Lake、Arrow  
- **中高活跃层/底座能力建设层**：Velox、Gluten、Databend  

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势
与同类 OLAP 项目相比，Apache Doris 当前展现出较强的综合平衡能力：

- **一体化程度高**：既覆盖 MPP 查询、导入、物化视图、缓存、备份恢复，也持续补齐 Iceberg、HMS、JNI 连接器等外部生态能力。
- **分支维护成熟**：Parquet INT96、File Cache 等修复都快速进入 cherry-pick/backport，说明其发布与稳定分支治理较成熟。
- **企业化能力加速补齐**：OIDC、LDAP 空密码限制、复杂密码策略等，明显在向企业内网与平台化部署深化。
- **湖仓融合节奏快**：Iceberg 的 update/delete/merge、row lineage 等方向表明 Doris 不只是“查湖”，而是在尝试进入“可写、可变更、可追踪”阶段。

### 3.2 与主要同类的技术路线差异
- **vs ClickHouse**：  
  ClickHouse 更偏“超高性能单体/分布式分析引擎 + 生态接入扩张”，在优化器、执行器、格式支持上吞吐极高；Doris 则更强调**数据库产品形态完整性**，在权限、恢复、导入、缓存、MySQL 兼容和多组件协同上更平衡。
- **vs StarRocks**：  
  两者都在走“云原生分析数据库 + 湖仓能力”路线。StarRocks 在 shared-data、多桶对象存储、外表观测性上信号更强；Doris 则在**企业认证、安全治理、恢复链路、连接器统一架构**上更突出。
- **vs DuckDB**：  
  DuckDB 是嵌入式/单机分析引擎，重点是本地分析、对象存储访问和多语言嵌入；Doris 面向的是**服务化、集群化、在线分析与生产平台**场景。
- **vs Iceberg / Delta**：  
  Doris 是查询与存储系统；Iceberg/Delta 更偏表格式与事务元数据层。Doris 当前明显在加强对这些格式的“上层操作能力”承接。

### 3.3 社区规模对比
从今日数据看：
- Doris：Issues 7 / PR 156  
- StarRocks：Issues 5 / PR 104  
- DuckDB：Issues 12 / PR 43  
- ClickHouse：Issues 435 / PR 500  

可见 Doris 的绝对社区体量仍低于 ClickHouse，但在国产/云原生 OLAP 主流项目中仍处于**第一梯队高活跃水平**，且多分支维护节奏较强，说明其工程组织能力已较成熟。

---

## 4. 共同关注的技术方向

以下为多项目共同涌现的需求与诉求：

| 技术方向 | 涉及项目 | 具体诉求 |
|---|---|---|
| **对象存储 / 远程文件稳定性** | Doris、DuckDB、StarRocks、Arrow、Delta | File Cache 内存治理、S3 多文件读写稳定性、对象存储导出 OOM、云文件系统一致性 |
| **湖仓格式深度集成** | Doris、StarRocks、Iceberg、Delta、Arrow、Velox | Iceberg update/delete/merge、row lineage、V4 manifest、UniForm/Iceberg 互操作、Parquet/Arrow 兼容增强 |
| **SQL 正确性与边界修复** | Doris、ClickHouse、StarRocks、DuckDB、Velox、Gluten、Delta | DST/时间语义、count/ORDER BY 错误、MERGE + DV、CTE INTERNAL Error、make_timestamp 边界、native union 错误 |
| **企业安全与身份接入** | Doris、StarRocks、Delta（间接协议层）、Gluten（部署隔离） | OIDC、LDAP、复杂密码、权限策略、CPU/GPU 运行时隔离 |
| **可观测性与诊断能力** | Doris、ClickHouse、StarRocks、Velox、Arrow | Insert 错误信息长度、part_log/profile events、外部表指标、runtime stats、构建/CI 影响分析 |
| **执行器资源控制与长期稳定性** | Doris、ClickHouse、DuckDB、Databend | File Cache 内存回收、动态线程限制、spilling、OOM 映射、块缓存/块对齐读 |
| **Spark 4.x / DSv2 / 上游兼容** | Iceberg、Delta、Gluten、Arrow | Spark 4.1 view 兼容、DSv2 CREATE TABLE、Gluten Spark 4 测试恢复、Pandas/ODBC 等上游接口变化 |

### 结论
生态共同问题高度集中在三类：
1. **云对象存储 + 外部表/文件访问成为主战场**  
2. **SQL 语义正确性比纯性能更受重视**  
3. **企业生产化能力（认证、安全、可观测、恢复）正在成为竞争焦点**

---

## 5. 差异化定位分析

### 5.1 存储格式与生态侧重点
- **Doris / StarRocks**：重视 Iceberg/HMS/Hive 外表集成，同时保留数据库内核能力。
- **ClickHouse**：更强调 Arrow/Parquet/Flight/Catalog 的查询接入与格式兼容。
- **DuckDB**：围绕 Parquet、JSON、S3/httpfs 做单机/嵌入式分析体验。
- **Iceberg / Delta**：本身是湖表格式与事务元数据层，不直接等价于 OLAP 引擎。
- **Arrow**：充当跨语言列式内存/格式交换底座。
- **Velox / Gluten**：偏执行层和加速层，承担上层引擎的算子执行与兼容桥梁。

### 5.2 查询引擎设计差异
- **Doris / StarRocks / ClickHouse**：分布式 OLAP 主力，强调服务化、并发查询和在线分析。
- **DuckDB**：嵌入式列式执行，适合本地分析、开发环境、轻量数据应用。
- **Databend**：云原生数仓路线，更强调对象存储与版本化表语义。
- **Velox / Gluten**：不直接面向终端用户，而是为 Presto/Spark/Gluten 生态提供执行底座。

### 5.3 目标负载类型差异
- **Doris / StarRocks**：实时报表、Ad-hoc、明细分析、湖仓查询、部分写回场景
- **ClickHouse**：超大规模日志、观测、时间序列、宽表聚合、低延迟分析
- **DuckDB**：本地数分、数据科学、ETL 中间层、嵌入式 OLAP
- **Iceberg / Delta**：批流一体湖表管理、事务元数据、CDC/快照演进
- **Arrow**：数据交换、语言绑定、文件格式和驱动生态
- **Velox / Gluten**：执行加速、GPU/CPU 混合运行、Spark/Presto 后端优化

### 5.4 SQL 兼容性差异
- **Doris / StarRocks**：明显强化 MySQL 风格兼容与企业 SQL 使用体验
- **ClickHouse**：更偏自身 SQL 方言演进，但正在持续增强标准能力和 BI 接入
- **DuckDB**：偏分析和数据科学友好，容忍快速迭代带来的边界调整
- **Gluten / Velox**：核心目标是对齐 Spark/Presto 语义
- **Delta / Iceberg**：SQL 兼容更多依赖上层 Spark/Flink/Trino 等引擎承载

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：超高活跃、平台级维护能力成熟
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特征：
- PR/Issue 吞吐极高
- 多分支维护与回补清晰
- 新功能与稳定性修复并行
- 已具备明显的平台化和企业化特征

#### 第二层：高活跃、架构能力快速推进
- **DuckDB**
- **Delta Lake**
- **Apache Iceberg**
- **Apache Arrow**

特征：
- 明确的技术主线
- 兼容性与生态能力持续扩张
- 经常出现“功能进入深水区后暴露的边界稳定性问题”

#### 第三层：底座演进型、质量巩固与生态协同期
- **Velox**
- **Gluten**
- **Databend**

特征：
- 不一定以海量 issue/PR 取胜
- 更偏执行层、架构层、工程化与上游协同
- 成熟度提升很依赖生态配合和长期设计演进

### 6.2 哪些处于快速迭代阶段？
- **Doris**：File Cache、OIDC、Iceberg 写能力都在快速推进
- **StarRocks**：shared-data、外表、统计/CBO 快速扩展
- **Delta**：Kernel-Spark、DSv2、CDC 是典型架构升级期
- **Gluten**：Spark 4.x 和 Velox 语义补齐仍在高变更阶段

### 6.3 哪些处于质量巩固阶段？
- **ClickHouse**：虽然仍高速前进，但 LTS 发布和大量关闭 issue 显示其强烈处于“功能演进 + 质量巩固”并行期
- **Arrow**：底座生态项目，更多是在做语言、格式、构建链路的稳态增强
- **Iceberg**：基础设施与 Spark 兼容性修复比纯新功能更突出
- **Velox**：构建分析、runtime stats、类型语义修复体现出明显的底座夯实期

---

## 7. 值得关注的趋势信号

### 7.1 行业趋势一：对象存储已成默认数据平面
从 Doris File Cache、DuckDB S3 读写问题、StarRocks shared-data、多桶存储卷、Arrow 云文件系统补齐可以看出，**对象存储 + 本地缓存 + 外部表**已成为主流架构，而不是补充场景。  
**对架构师的意义**：选型时必须重点评估缓存命中、长时间内存占用、S3/HDFS/Azure 接入细节，而不只看本地盘 benchmark。

### 7.2 行业趋势二：湖仓互操作从“能读”走向“能写、能变更、能追踪”
Doris 的 Iceberg merge/update/delete、Iceberg row lineage、Delta 的 CDC/DSv2、StarRocks 的 Iceberg/VARIANT，表明生态正在从只读查询转向**深度事务语义承接**。  
**对数据工程师的意义**：未来选型不能只比较“谁能查 Iceberg”，而要看谁支持写入语义、CDC、元数据追踪、审计和恢复。

### 7.3 行业趋势三：SQL 正确性已成为核心竞争力
今日多个项目的高优先级问题都不是“慢”，而是：
- count 错误
- MERGE 歧义
- 时间/DST 边界
- INTERNAL Error / 崩溃
- materialize/sort/order 语义错误

**结论**：OLAP 引擎进入成熟期后，用户对结果正确性的容忍度极低。  
**建议**：生产选型与升级流程中，应把 correctness regression test 放到与性能测试同等优先级。

### 7.4 行业趋势四：企业接入能力正在成为主流特性
OIDC、LDAP、复杂密码、Ranger 标签策略、GPU/CPU 依赖隔离、ODBC 驱动签名等信号表明，项目已不满足于技术上“可用”，而是要进入**企业治理、合规与平台化运维体系**。  
**对架构师的意义**：数据库/分析引擎选型要把认证、审计、权限模型、驱动交付方式纳入一等指标。

### 7.5 行业趋势五：执行引擎底座与上层系统正在重新分层
Velox、Gluten、Arrow、Iceberg、Delta 的活跃说明，生态正在形成更加清晰的分层：
- **表格式与事务层**：Iceberg / Delta
- **执行底座**：Velox / Gluten
- **数据交换层**：Arrow / Flight / ODBC
- **查询与服务层**：Doris / ClickHouse / StarRocks / DuckDB / Databend

**对技术决策者的意义**：未来很多能力不再由单一数据库独占，而是依赖整条生态栈协同。选型应从“单项目比较”升级到“生态栈组合比较”。

---

# 总结结论

如果从今天的数据做总体判断：

- **Apache Doris** 处于“高频迭代 + 多版本并行维护 + 企业能力补齐”的健康状态，在国产/云原生 OLAP 第一梯队中竞争力明显。
- **ClickHouse** 仍是社区体量和吞吐最强者，但其挑战更多转向正确性边界、兼容迁移和复杂生产场景收敛。
- **StarRocks** 与 Doris 路线接近，shared-data 和外部表治理信号更强，但正确性问题仍需重点关注。
- **DuckDB** 持续强化嵌入式和对象存储分析能力，但 native 稳定性仍是关键观察面。
- **Iceberg / Delta / Arrow / Velox / Gluten** 则代表底层生态在快速成熟，正在重塑未来分析平台的组合方式。

**对技术决策者的最终建议**：  
未来的核心竞争不再只是“单机/集群性能”，而是 **湖仓互操作、对象存储稳定性、SQL 正确性、企业接入能力、生态栈协同成熟度**。在这些维度上，Apache Doris 目前表现出较强的综合平衡性，值得持续重点跟踪。

如果你愿意，我可以继续把这份报告整理成：
1. **管理层 1 页摘要版**  
2. **Markdown 表格增强版**  
3. **重点对比 Doris vs ClickHouse vs StarRocks 的三方深度版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时 ClickHouse 仓库保持**极高活跃度**：Issues 更新 435 条、PR 更新 500 条，同时发布了 2 个 LTS 版本，说明项目处于**稳定分支持续修复 + 主干功能快速演进**并行状态。  
从关闭数据看，Issues 已关闭 367 条、PR 已合并/关闭 349 条，仓库处理效率较高，维护节奏健康。  
今日技术焦点集中在三类方向：**查询优化器/执行器增强、存储与格式兼容性演进、稳定性与正确性修复**。  
同时，若干 PR 涉及**向后不兼容调整**，加上新 LTS 发布，表明 ClickHouse 正在为后续大版本做一次较系统的接口与内部实现收敛。  

---

## 2. 版本发布

### 新发布版本
- **v26.3.2.3-lts** — Release v26.3.2.3-lts  
  链接: ClickHouse/ClickHouse Release `v26.3.2.3-lts`
- **v26.3.1.896-lts** — Release v26.3.1.896-lts  
  链接: ClickHouse/ClickHouse Release `v26.3.1.896-lts`

### 版本解读
本次数据仅给出版本标签，未附完整 changelog，但从同日活跃 PR 可以推测，LTS 分支关注点主要仍是：

- **稳定性修复**：如解析器、索引分析、测试稳定性、时间解析 UB 等问题；
- **查询执行安全性与一致性**：如 monotonicity 判断错误、物化列破坏排序键、临时表解析一致性；
- **格式/生态兼容性**：如 Arrow / Parquet 路径持续收敛。

### 潜在破坏性变更与迁移注意事项
虽然 LTS 通常以保守修复为主，但当前主干上已有数个值得提前关注的“未来迁移信号”：

1. **Parquet 旧实现移除**
   - PR: [#100949](ClickHouse/ClickHouse PR #100949)
   - 内容：移除旧的 Arrow-based Parquet reader/writer 实现。
   - 迁移建议：如果线上仍依赖历史开关  
     - `output_format_parquet_use_custom_encoder = 0`
     - `input_format_parquet_use_native_reader_v3 = 0`  
     应尽快在测试环境验证新版默认实现的输出兼容性、性能和边界行为。

2. **TEMPORARY 表与普通表解析一致性调整**
   - PR: [#100966](ClickHouse/ClickHouse PR #100966)
   - 内容：`SHOW CREATE TABLE` 与 `DESCRIBE TABLE` 对 temporary/permanent 同名表的解析行为统一。
   - 迁移建议：依赖旧行为的运维脚本、元数据抓取工具需要回归验证，避免错误抓取永久表定义。

3. **虚拟列体系调整**
   - PR: [#100766](ClickHouse/ClickHouse PR #100766)
   - 内容：合并 common virtuals 到 table-specific virtuals。
   - 迁移建议：依赖系统虚拟列名称、来源和可见性的 SQL、驱动、BI 工具应提前测试。

---

## 3. 项目进展

> 注：给定数据中未明确列出“今日已合并”的具体 PR 明细，以下以**今日最重要且仍在推进中的 PR**为主，反映项目主线进展。

### 3.1 查询引擎与优化器

#### 过滤条件下推到窗口函数之下
- PR: [#100784](ClickHouse/ClickHouse PR #100784)
- 标题：Add filter push down over window setting
- 价值：为窗口查询引入谓词下推能力，可减少不必要的数据处理量。
- 影响：这是典型的**分析型 SQL 优化器增强**，有望改善复杂报表、分组排序后再过滤的查询性能。
- 风险：PR 明确指出“**会改变部分查询结果**”，说明它涉及语义边界，发布时需提供清晰开关和兼容说明。

#### 正则条件利用主键索引
- PR: [#98988](ClickHouse/ClickHouse PR #98988)
- 标题：Optimize regex with groups/alternation for primary key index
- 价值：让类似 `^(value1|value2)$` 的正则模式可以转化为主键范围过滤。
- 影响：这会显著降低扫描量，是典型的**表达式到索引条件的语义识别增强**，尤其适合日志、维表过滤场景。

#### simple view 支持 union
- PR: [#100958](ClickHouse/ClickHouse PR #100958)
- 标题：support simple views with union
- 价值：推进视图语义与查询重写能力，改善复杂 BI SQL 兼容性与性能表现。
- 信号：说明 ClickHouse 正持续补强**上层 SQL 组织能力**，不仅仅聚焦底层算子性能。

### 3.2 执行层与资源控制

#### 根据可用空闲内存自动限制线程数
- PR: [#100383](ClickHouse/ClickHouse PR #100383)
- 标题：Limit max_threads and max_insert_threads based on available free memory
- 价值：新增基于剩余内存动态抑制 `max_threads` / `max_insert_threads` 的机制。
- 影响：这是非常重要的**稳定性导向性能优化**，对于高并发导入、大查询混跑、容器环境下的内存突刺尤其关键。

#### partial_merge_join 对 Nullable 优化
- PR: [#100945](ClickHouse/ClickHouse PR #100945)
- 标题：compareTrackAt() in partial_merge_join for nullables
- 价值：优化 nullable 情况下的 partial merge join。
- 影响：指向典型的 OLAP 大表 join 性能精修，有助于提升复杂关联分析的吞吐与尾延迟表现。

### 3.3 存储、系统观测与内部工具

#### 为 part_log 收集更完整 profile events
- PR: [#97302](ClickHouse/ClickHouse PR #97302)
- 标题：collect profiles event for part_log
- 价值：增强 `system.part_log` 的可观测性。
- 影响：对线上诊断 merge、part 生成、后台任务行为很有帮助，属于**运维可观测性增强**。

#### 启动时检查 mdraid 重建/校验状态
- PR: [#100941](ClickHouse/ClickHouse PR #100941)
- 标题：Add startup warning when mdraid is being resynchronized
- 价值：在磁盘阵列 resync/check/repair 时主动告警。
- 影响：这类“系统环境 sanity check”很实用，可降低“数据库慢其实是底层存储在重建”的排障成本。

#### keeper-bench 性能提升
- PR: [#100670](ClickHouse/ClickHouse PR #100670)
- 标题：keeper-bench: go faster
- 价值：将基准工具开销显著降低，使 Keeper 的真实性能测量更准确。
- 影响：虽然不直接影响用户查询，但有助于**分布式协调层性能评估**和后续优化。

### 3.4 SQL / 生态兼容性

#### Arrow Flight SQL 支持
- PR: [#91170](ClickHouse/ClickHouse PR #91170)
- 标题：Add Arrow Flight SQL support
- 价值：补齐现代高速数据接口协议。
- 影响：这是重要生态扩展，面向 BI、中间件、跨语言客户端、高吞吐数据交换场景，战略意义较大。

#### Arrow StringView / BinaryView 导入支持
- PR: [#100762](ClickHouse/ClickHouse PR #100762)
- 标题：Add Arrow StringView and BinaryView ingestion support and test
- 价值：增强 Arrow 数据摄入兼容性。
- 影响：说明项目正继续强化**列式格式互操作**能力，尤其利好数据湖、文件交换、Python/Arrow 生态。

#### 新增 `CHECK DATABASE` for Catalog
- PR: [#94690](ClickHouse/ClickHouse PR #94690)
- 标题：Add new query CHECK DATABASE for Catalog
- 价值：为 DataLakeCatalog 提供健康检查 SQL。
- 影响：这代表 ClickHouse 对**Catalog / 湖仓元数据治理**的支持在增强。

---

## 4. 社区热点

### 4.1 CI crash：PLACEHOLDER action 逻辑错误
- Issue: [#85460](ClickHouse/ClickHouse Issue #85460)
- 标签：`bug, comp-query-analyzer, crash-ci`
- 状态：已关闭
- 热度：44 评论

**分析：**  
这是今日最值得关注的稳定性话题之一，涉及 **query analyzer** 的内部断言失败，错误为 `[LOGICAL_ERROR] Trying to execute PLACEHOLDER action`。  
这类问题虽然出现在 CI，但其本质是**查询分析/计划构建阶段存在非法执行路径**，通常意味着某些 SQL 组合可能触发计划器不变量被破坏。  
对 ClickHouse 而言，随着 analyzer 持续演进，此类问题的关闭是积极信号，但也说明**优化器重构仍处于高变更期**。

### 4.2 2026 路线图
- Issue: [#93288](ClickHouse/ClickHouse Issue #93288)
- 状态：开放
- 热度：19 评论

**分析：**  
作为官方路线图议题，它是观察项目未来投入方向的核心窗口。  
尽管摘要中说明不覆盖基础设施、编排、文档、驱动等外围主题，但从今日 PR 可以看到，核心引擎方向很可能继续聚焦：
- 优化器能力增强
- 湖仓/catalog 接入
- Arrow / Flight / Parquet 生态
- 可观测性与稳定性

### 4.3 clickhouse-client 崩溃反馈
- Issue: [#95278](ClickHouse/ClickHouse Issue #95278)
- 标题：clickhouse-client ReplxxImpl crash
- 状态：开放（标记 invalid）
- 热度：16 评论

**分析：**  
虽然被标记为 invalid，但评论数说明用户对 **CLI 交互稳定性** 仍然敏感。  
结合今日实验性 PR [#100277](ClickHouse/ClickHouse PR #100277)（Web Terminal），可以看出项目正在探索新的终端交互路径，某种程度上也是在扩展客户端使用模型。

### 4.4 加密存储读取异常
- Issue: [#83120](ClickHouse/ClickHouse Issue #83120)
- 标题：Code: 49. DB::Exception: ReadBufferFromEncryptedFile
- 状态：开放
- 热度：15 评论

**分析：**  
该问题涉及**加密存储 + replication_queue + merge/mutation 卡住**，对生产用户影响较大。  
这是典型的“功能可用，但复杂场景下会卡后台任务”的问题，技术诉求是：
- 加密层与 MergeTree 后台流程更稳健地协作
- replication_queue / mutations 的可诊断性提升

### 4.5 ARM / HDFS / 构建兼容性老问题集中收尾
代表性议题：
- [#22222](ClickHouse/ClickHouse Issue #22222) Official ARM image for Docker
- [#15174](ClickHouse/ClickHouse Issue #15174) Add tests for AArch64 version of ClickHouse to CI
- [#8159](ClickHouse/ClickHouse Issue #8159) HDFS engine in HA mode
- [#5747](ClickHouse/ClickHouse Issue #5747) Kerberos support for ZK and HDFS

**分析：**  
今日高评论 issue 列表里，有大量历史 ARM、HDFS、Kerberos、构建系统问题被关闭，反映出维护者在**系统性清理历史积压**。  
这类问题虽老，但背后仍是重要用户群体：
- ARM 服务器/云原生用户
- 企业 Hadoop/HDFS/Kerberos 环境用户
- 自编译/私有镜像/异构平台用户

---

## 5. Bug 与稳定性

以下按严重程度整理今日最值得关注的问题与对应修复信号。

### P1：查询分析器/CI 崩溃
- Issue: [#85460](ClickHouse/ClickHouse Issue #85460)
- 问题：`[LOGICAL_ERROR] Trying to execute PLACEHOLDER action`
- 影响：可能涉及 query analyzer 执行非法 action，属于核心执行路径问题
- 状态：已关闭
- 修复信号：暂无直接关联 PR 数据，但 issue 已关闭，说明已有内部修复或关联提交落地

### P1：加密存储读异常导致复制/变更卡住
- Issue: [#83120](ClickHouse/ClickHouse Issue #83120)
- 问题：`ReadBufferFromEncryptedFile` 异常，merge/mutations/replication_queue 堵塞
- 影响：生产稳定性高风险，可能引起副本落后与 mutation 长时间堆积
- 状态：开放
- 已有 fix PR：**未在今日数据中看到直接对应 fix**

### P1：索引分析阶段除零异常
- PR: [#100928](ClickHouse/ClickHouse PR #100928)
- 问题：`divide` / `intDiv` monotonicity 判断错误，在分母区间 `[0,0]` 时仍判定单调，导致索引分析阶段抛异常
- 影响：属于**查询正确性 + 优化器安全性**问题
- 状态：开放
- 结论：这是一个明确的 bugfix，建议优先进入稳定分支

### P1：`ALTER TABLE MATERIALIZE COLUMN` 可能破坏排序
- PR: [#99647](ClickHouse/ClickHouse PR #99647)
- 问题：当列用于 sort key 函数表达式时，materialize column 可能破坏排序规则
- 影响：潜在导致 MergeTree 读取假设失效，属于高风险正确性问题
- 状态：开放
- 建议：应重点关注是否 backport 至 LTS

### P2：时间解析存在未定义行为
- PR: [#100948](ClickHouse/ClickHouse PR #100948)
- 问题：`parseDateTimeBestEffort` 对小数秒累积到 `Int64` 时可能溢出
- 影响：边界输入下的解析稳定性与安全性问题
- 状态：开放
- 特征：虽不一定大面积触发，但属于典型“输入鲁棒性缺陷”

### P2：测试不稳定暴露分布式 LIMIT 非确定性
- PR: [#100951](ClickHouse/ClickHouse PR #100951)
- 问题：`00163_shard_join_with_empty_table` flaky，`system.numbers` 分布式流 + `LIMIT` 在随机 `max_block_size` 下输出非确定
- 影响：一方面是 CI 稳定性问题，另一方面也提醒用户某些无序流上的 LIMIT 语义存在误解风险
- 状态：开放

### P3：客户端交互崩溃
- Issue: [#95278](ClickHouse/ClickHouse Issue #95278)
- 问题：`clickhouse-client` ReplxxImpl crash
- 影响：主要影响交互式使用体验
- 状态：开放 / invalid
- fix PR：今日未见直接对应修复

---

## 6. 功能请求与路线图信号

### 高概率进入后续版本的方向

#### 1）Arrow Flight SQL
- PR: [#91170](ClickHouse/ClickHouse PR #91170)
- 判断：**高概率**进入后续版本
- 原因：协议层扩展价值高，且与 Arrow 生态持续投入方向一致

#### 2）Catalog 健康检查 SQL
- PR: [#94690](ClickHouse/ClickHouse PR #94690)
- 判断：**较高概率**
- 原因：数据湖/目录服务集成是当前 ClickHouse 对外扩展的重要方向

#### 3）窗口函数上的过滤下推
- PR: [#100784](ClickHouse/ClickHouse PR #100784)
- 判断：**中高概率**
- 原因：收益明确，但因可能改变结果，预计会先以 setting 控制、逐步推广

#### 4）Web Terminal
- PR: [#100277](ClickHouse/ClickHouse PR #100277)
- 判断：**中等概率**
- 原因：实验性较强，但若顺利落地，会提升运维、演示、浏览器内诊断体验

#### 5）Arrow StringView/BinaryView 摄入
- PR: [#100762](ClickHouse/ClickHouse PR #100762)
- 判断：**高概率**
- 原因：兼容性明确，风险可控，且生态价值高

### 从社区议题看到的持续需求

#### ARM 一等支持与多架构镜像
- 相关 Issue:
  - [#22222](ClickHouse/ClickHouse Issue #22222)
  - [#2266](ClickHouse/ClickHouse Issue #2266)
  - [#15174](ClickHouse/ClickHouse Issue #15174)

**信号：**  
尽管这些 issue 多为历史问题，但持续高讨论度说明 ARM 用户群体已是长期刚需，尤其在云原生和边缘部署环境。

#### HDFS HA / Kerberos / 企业 Hadoop 兼容
- 相关 Issue:
  - [#8159](ClickHouse/ClickHouse Issue #8159)
  - [#34445](ClickHouse/ClickHouse Issue #34445)
  - [#5747](ClickHouse/ClickHouse Issue #5747)
  - [#13406](ClickHouse/ClickHouse Issue #13406)

**信号：**  
传统大数据企业环境仍在持续提出集成诉求。虽然 ClickHouse 近年更强调对象存储与湖仓格式，但 HDFS/Kerberos 仍是重要存量市场。

---

## 7. 用户反馈摘要

基于今日高活跃 Issues，可提炼出几个真实用户痛点：

### 1）异构基础设施兼容成本仍高
- ARM、WSL、Raspberry Pi、CentOS/systemd/sysV 等问题频繁出现
- 相关链接：
  - [#22222](ClickHouse/ClickHouse Issue #22222)
  - [#45219](ClickHouse/ClickHouse Issue #45219)
  - [#50852](ClickHouse/ClickHouse Issue #50852)
  - [#14298](ClickHouse/ClickHouse Issue #14298)

**用户画像：**  
大量用户并不总是在标准 x86_64 Linux 裸机上运行 ClickHouse，而是在容器、开发机、边缘 ARM、WSL 等环境中试用或生产部署。  
**反馈含义：** 项目广泛采用度高，但“非标准环境开箱即用性”仍是体验短板。

### 2）企业用户仍高度依赖 HDFS / Kerberos
- 相关链接：
  - [#8159](ClickHouse/ClickHouse Issue #8159)
  - [#34445](ClickHouse/ClickHouse Issue #34445)
  - [#22460](ClickHouse/ClickHouse Issue #22460)
  - [#5747](ClickHouse/ClickHouse Issue #5747)

**用户诉求：**
- HDFS HA 地址如何配置
- Kerberos 下读写一致性
- HDFS 引擎稳定性与崩溃排查

**反馈含义：**  
在湖仓/对象存储兴起之后，HDFS 并未消失；ClickHouse 仍需维护好企业存量生态的接入体验。

### 3）用户对“正确性”问题非常敏感
- 相关链接：
  - [#100928](ClickHouse/ClickHouse PR #100928)
  - [#99647](ClickHouse/ClickHouse PR #99647)
  - [#32638](ClickHouse/ClickHouse Issue #32638)

**反馈含义：**  
OLAP 用户可接受某些实验功能，但对**查询结果正确性、索引推断安全性、排序规则一致性**容忍度极低。  
这也是为什么今天很多高价值 PR 都集中在“修正确性边界”而非单纯追求吞吐。

### 4）线上诊断能力是刚需
- 相关链接：
  - [#97302](ClickHouse/ClickHouse PR #97302)
  - [#100941](ClickHouse/ClickHouse PR #100941)
  - [#83120](ClickHouse/ClickHouse Issue #83120)

**反馈含义：**  
用户不仅需要性能，还需要“知道为什么慢、为什么卡、为什么异常”。  
part_log 事件增强、启动时 mdraid 检查等，都表明项目正向更成熟的生产运维体验靠拢。

---

## 8. 待处理积压

以下为仍值得维护者持续关注的开放或长期拖延议题：

### 1）2026 路线图应持续细化并绑定可交付项
- Issue: [#93288](ClickHouse/ClickHouse Issue #93288)
- 风险：路线图如果只停留在宏观方向，社区难以判断优先级与版本落点
- 建议：补充里程碑、负责人、预计版本窗口

### 2）加密存储读取异常与复制队列卡死
- Issue: [#83120](ClickHouse/ClickHouse Issue #83120)
- 风险：生产影响大，涉及数据可用性
- 建议：需要更明确的 root cause、规避手册和修复 PR 跟踪

### 3）clickhouse-client 崩溃问题仍需给出清晰结论
- Issue: [#95278](ClickHouse/ClickHouse Issue #95278)
- 风险：即便被标 invalid，若无替代说明，用户仍会认为客户端不稳定
- 建议：给出复现条件、版本范围和建议 workaround

### 4）历史兼容性问题虽然关闭，但文档债务仍可能存在
重点方向：
- ARM 支持
- HDFS HA 配置
- Kerberos 集成
- WSL / Docker / 权限问题

代表链接：
- [#22222](ClickHouse/ClickHouse Issue #22222)
- [#8159](ClickHouse/ClickHouse Issue #8159)
- [#65229](ClickHouse/ClickHouse Issue #65229)
- [#68747](ClickHouse/ClickHouse Issue #68747)

**建议：**  
这些 issue 的关闭并不等于用户问题自然消失，维护者可考虑整理为 FAQ / 部署矩阵 / 平台支持声明。

---

## 总结判断

ClickHouse 在 2026-03-28 展现出**高吞吐维护能力与清晰的技术主线**：  
一方面通过 LTS 发布和大量关闭 issue 持续消化稳定性债务；另一方面在主干积极推进 **优化器、Arrow/Flight 生态、Catalog、资源治理和运维可观测性**。  
需要重点观察的风险点在于：**分析器/优化器变更带来的正确性边界、若干向后不兼容调整、以及加密存储等生产级复杂场景的稳定性**。  
总体来看，项目健康度较高，且正从“高性能数据库”进一步向“更完整的数据平台执行引擎”演进。  

如果你愿意，我还可以继续把这份日报整理成：
1. **适合 Slack/飞书发布的简版晨报**，或  
2. **面向 CTO/架构师的风险重点版**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-28

## 1. 今日速览

过去 24 小时 DuckDB 社区保持**高活跃度**：Issues 更新 12 条、PR 更新 43 条，说明核心开发仍处于密集迭代阶段。  
从内容看，今天的重点主要集中在三类问题：**S3/外部文件访问稳定性**、**内部错误与崩溃修复**、以及**SQL/类型系统边界行为完善**。  
PR 侧关闭/合并数量达到 29 条，明显高于待合并 14 条，体现出维护者对小步快跑、快速清理分支的节奏控制较好。  
不过，近期新增 Issue 中出现了多条 **INTERNAL Error、崩溃、use-after-free、OOM** 类问题，表明在复杂查询、远程存储和多语言接口场景下，稳定性仍是当前版本的重要关注点。

---

## 3. 项目进展

> 今日无新版本发布。

### 已关闭/推进的重要 PR

#### 1) `read_json_auto` 自动识别带时区时间戳
- PR: [#21660 Infer timestamps with timezone in read_json_auto](https://github.com/duckdb/duckdb/pull/21660)
- 状态：已关闭（大概率已合并/完成）
- 影响：
  - 提升 JSON 自动 schema 推断能力；
  - 改善带 timezone 的时间字符串识别；
  - 对半结构化数据分析、日志/事件数据导入更友好。
- 意义：
  - 这是典型的 **SQL 兼容性 + 数据摄取体验** 改进，降低用户手工指定 schema 的成本。

#### 2) `duckdb_columns()` 对懒绑定视图更稳健
- PR: [#21658 Avoid throwing an error when failing to bind views in `duckdb_columns`](https://github.com/duckdb/duckdb/pull/21658)
- 状态：已关闭
- 影响：
  - 在引入 lazy binding view 后，系统目录查询不再因某些 view 绑定失败而直接报错；
  - 提升元数据探查和 BI/开发工具集成稳定性。
- 意义：
  - 这是**元数据 introspection 稳定性**修复，对 JDBC/ODBC/IDE/数据目录类工具很关键。

#### 3) 外部文件缓存切换为块对齐读与块缓存
- PR: [#21395 Implement block-aligned read and cache for external file cache](https://github.com/duckdb/duckdb/pull/21395)
- 状态：已关闭
- 影响：
  - 将外部文件 IO 与缓存从“按请求”模式重构为“按块”模式；
  - 有望改善远程对象存储/大文件扫描场景下的缓存命中和重复读取效率。
- 意义：
  - 这是今天最值得关注的**存储与 IO 子系统优化**之一，后续可能直接影响 Parquet/S3/httpfs 的吞吐和成本表现。

#### 4) 统一版本标签获取逻辑，改进 Windows 文件元数据路径
- PR: [#21664 Unify `LocalFileSystem::GetVersionTag` to use `FileMetadata`](https://github.com/duckdb/duckdb/pull/21664)
- 状态：已关闭
- 影响：
  - 统一跨平台文件版本标签逻辑；
  - 在 Windows 文件列表阶段直接生成 metadata，减少额外系统调用。
- 意义：
  - 属于**文件系统抽象层优化**，可提升缓存一致性和平台行为统一性。

#### 5) 修复 Windows 规范路径泄露长路径前缀问题
- PR: [#21652 Windows: remove prefix from canonical paths](https://github.com/duckdb/duckdb/pull/21652)
- 状态：已关闭
- 影响：
  - 避免 `\\?\` / `\\?\UNC\` 前缀暴露到 SQL 客户端；
  - 改善 Windows 用户在 `temp_directory` 等配置项上的可用性和可读性。
- 意义：
  - 这是**平台兼容性与用户体验修复**，虽然不属于核心执行引擎，但对桌面/本地开发者非常实际。

#### 6) 向量迭代 helper 引入，降低执行器开发复杂度
- PR: [#21666 Add iterator helpers over vectors](https://github.com/duckdb/duckdb/pull/21666)
- 状态：已关闭
- 影响：
  - 简化对 `Vector` 的遍历，不再需要开发者频繁手写 `ToUnifiedFormat` 模板代码；
  - 有助于减少执行器/函数实现中的样板代码与潜在错误。
- 意义：
  - 虽然偏内部工程，但对**执行引擎可维护性**和后续扩展函数开发效率有正向帮助。

#### 7) 工程质量与 CI 清理
- PR: [#21647 Fix all tidy errors](https://github.com/duckdb/duckdb/pull/21647)
- PR: [#21648 Use test runner in all windows CI jobs](https://github.com/duckdb/duckdb/pull/21648)
- PR: [#21665 .git pre-commit hook for `make format-fix`](https://github.com/duckdb/duckdb/pull/21665)
- 意义：
  - 反映维护者正在补强**代码质量基线、Windows CI 覆盖、开发工作流规范化**；
  - 对降低回归和提升贡献者协作效率有积极作用。

---

## 4. 社区热点

### 热点 1：S3 分区导出内存占用异常
- Issue: [#11817 Out-of-memory error when performing partitioned copy to S3](https://github.com/duckdb/duckdb/issues/11817)
- 标签：`[under review]`
- 热度：13 评论，👍 9
- 关注点：
  - 用户在执行带 hive partitioning 的 `COPY TO S3` 时，内存占用远高于预期；
  - 即便数据量本身并不大，在 2GiB 限制下也可能失败。
- 技术诉求分析：
  - 这类问题反映出 DuckDB 在**远程写出 + 分区输出 + 对象存储协议**组合场景下，可能存在 writer buffering、分区句柄管理、上传批次策略不够节制的问题；
  - 这是典型的从“本地单机分析引擎”走向“云对象存储工作负载”时必须补齐的资源控制能力。

### 热点 2：`SUMMARIZE` 遇到 `inf/-inf` 抛异常
- Issue: [#14373 Summarize gives Out of Range Error due to inf/-inf](https://github.com/duckdb/duckdb/issues/14373)
- PR: [#21673 Return inf/nan instead of throwing for stddev/variance overflow](https://github.com/duckdb/duckdb/pull/21673)
- 热度：8 评论，👍 6
- 关注点：
  - `SUMMARIZE <table>` 在列中包含 `inf` 时触发 `STDDEV_SAMP is out of range!`；
  - 用户希望返回 `null`、`inf` 或 `nan`，而不是直接异常。
- 技术诉求分析：
  - 本质是**统计函数数值边界行为**与 IEEE-754 语义一致性问题；
  - 当前已有针对性 PR，且方案倾向于“返回 inf/nan 而不是抛错”，说明 DuckDB 正朝更符合数值分析预期的方向演进。

### 热点 3：开发版扩展发布节奏与可测试性
- Issue: [#21622 Release cycle of extensions for development builds](https://github.com/duckdb/duckdb/issues/21622)
- 标签：`[under review]`
- 关注点：
  - 用户想在正式版发布前测试开发版 Python wheel；
  - 但扩展包无法同步安装，导致实际验证受阻。
- 技术诉求分析：
  - 这暴露出 DuckDB **核心发行物与扩展生态发布节奏耦合不足**；
  - 随着空间、httpfs、iceberg 等扩展的重要性提升，扩展供应链已经成为开发版 adoption 的关键因素。

### 热点 4：触发器目录支持继续推进
- PR: [#21438 Add catalog storage and introspection for CREATE TRIGGER](https://github.com/duckdb/duckdb/pull/21438)
- 状态：Open
- 关注点：
  - 为 `CREATE TRIGGER` 增加 catalog entry、校验和 introspection 支持。
- 技术诉求分析：
  - 虽然今天评论不多，但这是明显的**路线图信号**；
  - 说明 DuckDB 正继续补齐传统关系型数据库对象管理能力，而不仅限于分析查询。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 崩溃级

#### 1) Python 客户端触发 `pointer being freed was not allocated`
- Issue: [#21651 "pointer being freed was not allocated" and crashing](https://github.com/duckdb/duckdb/issues/21651)
- 状态：Open，`[under review]`
- 严重性：**P0**
- 描述：
  - Python 3.12 + DuckDB 1.5.1 执行特定查询时直接崩溃；
  - 属于 native 内存管理错误。
- 是否已有 fix PR：**暂无明确对应 PR**
- 评估：
  - 这是最需要优先处理的问题之一，因为它影响 Python 主流用户，且属于进程级崩溃而非普通 SQL 报错。

#### 2) ADBC 出现 heap-use-after-free
- Issue: [#21584 adbc: heap-use-after-free on error](https://github.com/duckdb/duckdb/issues/21584)
- 状态：已关闭
- 严重性：**P0**
- 描述：
  - ADBC 客户端错误路径存在 use-after-free，可能导致 segfault。
- 是否已有 fix PR：**问题已关闭，说明已有处理或已被修复接收**
- 评估：
  - 跨语言接口稳定性是 DuckDB 扩展 adoption 的核心，ADBC 路径问题值得继续回归验证。

---

### P1 / INTERNAL Error 与查询执行正确性

#### 3) 读取 S3 多文件 Parquet 时整数转换信息丢失
- Issue: [#21669 INTERNAL Error: Information loss on integer cast in CachingFileHandle when reading multi-file Parquet from S3](https://github.com/duckdb/duckdb/issues/21669)
- 状态：Open
- 严重性：**P1**
- 描述：
  - 在 `httpfs` 读取大规模 S3 多文件 Parquet 数据集时崩溃；
  - 错误落在 `CachingFileHandle` 的整数转换。
- 是否已有 fix PR：**暂无**
- 评估：
  - 指向**远程文件缓存 / 偏移处理 / 多文件读取路径**，与今天关闭的块缓存重构 PR [#21395](https://github.com/duckdb/duckdb/pull/21395) 所在领域高度相关，建议维护者交叉排查是否存在同一子系统回归。

#### 4) CTE 定义丢失导致 INTERNAL Error
- Issue: [#21582 INTERNAL Error: Could not find CTE definition for CTE reference](https://github.com/duckdb/duckdb/issues/21582)
- 状态：Open，`[reproduced]`
- 严重性：**P1**
- 描述：
  - 宏、`query_table`、`MATERIALIZED` CTE 组合触发内部错误。
- 是否已有 fix PR：**暂无明确关联**
- 评估：
  - 说明 binder / optimizer 在复杂 SQL 展开场景下仍有角落问题；
  - 对高级 SQL 用户和自动生成 SQL 的系统影响较大。

#### 5) 向量越界 INTERNAL Error
- Issue: [#21650 INTERNAL Error: Attempted to access index x within vector of size x](https://github.com/duckdb/duckdb/issues/21650)
- 状态：Open，`[reproduced]`
- 严重性：**P1**
- 描述：
  - 特定 SQL 触发 vector 边界访问异常。
- 是否已有 fix PR：**暂无**
- 评估：
  - 属于执行器/表达式处理路径中的典型正确性风险，建议优先补测试。

---

### P2 / 功能行为异常与兼容性问题

#### 6) 同一 session 中第二个连接未正确拾取 attach string
- Issue: [#21618 Attach string is not picked up when creating a second connection in a session](https://github.com/duckdb/duckdb/issues/21618)
- 状态：Open，`[reproduced]`
- 严重性：**P2**
- 描述：
  - 第二次连接复用了旧 attach string；
  - 可能影响多连接、多 catalog 测试或嵌入式应用。
- 是否已有 fix PR：**暂无**

#### 7) `COPY table FROM 'file.csv'` 的 header 自动检测与文档不一致
- Issue: [#21653 Detection of header when using COPY table FROM 'file.csv'](https://github.com/duckdb/duckdb/issues/21653)
- 状态：Open，`[reproduced]`
- 严重性：**P2**
- 描述：
  - 实际行为与文档描述不一致。
- 是否已有 fix PR：**暂无**
- 评估：
  - 更偏**文档/行为一致性**问题，但会影响 ETL 脚本可预测性。

#### 8) `geometry IS NULL` 条件失效
- Issue: [#21630 IS NULL on geometry does not work](https://github.com/duckdb/duckdb/issues/21630)
- 状态：Open，`[under review]`
- 严重性：**P2**
- 描述：
  - Geometry 类型在 `IS NULL` 谓词下行为异常。
- 是否已有 fix PR：**暂无**
- 评估：
  - 这反映扩展类型在 SQL 三值逻辑上的一致性仍需加强。

#### 9) `SUMMARIZE` 对 inf/-inf 抛异常
- Issue: [#14373](https://github.com/duckdb/duckdb/issues/14373)
- PR: [#21673](https://github.com/duckdb/duckdb/pull/21673)
- 严重性：**P2**
- 说明：
  - 已有明确 fix PR，修复路径相对清晰。

#### 10) 分区写 S3 时内存过高
- Issue: [#11817](https://github.com/duckdb/duckdb/issues/11817)
- 严重性：**P2-P1 之间**
- 说明：
  - 不一定是 correctness bug，但对生产工作负载会直接造成失败；
  - 因影响对象存储导出能力，优先级应不低。

---

## 6. 功能请求与路线图信号

### 1) `UNNEST` 支持 ARRAY 类型
- PR: [#21672 FIX #21506 UNNEST ARRAY type functionality](https://github.com/duckdb/duckdb/pull/21672)
- 状态：Open
- 信号：
  - 该 PR 已实现 binder 支持与递归 unnest 兼容；
  - 若顺利合入，将显著增强 DuckDB 在复杂嵌套类型上的 SQL 易用性。
- 预测：
  - **较可能进入下一小版本**，因为改动范围清晰、需求具体。

### 2) 聚合统计函数改为返回 `inf/nan`
- PR: [#21673 Return inf/nan instead of throwing for stddev/variance overflow](https://github.com/duckdb/duckdb/pull/21673)
- 状态：Open
- 信号：
  - 与现有高热度 issue 强绑定；
  - 更贴近数值计算惯例。
- 预测：
  - **很可能近期被接受**，属于低层语义修正型改动。

### 3) `CREATE TRIGGER` 的目录存储与 introspection
- PR: [#21438 Add catalog storage and introspection for CREATE TRIGGER](https://github.com/duckdb/duckdb/pull/21438)
- 状态：Open
- 信号：
  - 说明 DuckDB 不仅在做分析能力增强，也在持续补齐数据库对象层能力。
- 预测：
  - **中期路线图信号明显**，但是否尽快合入取决于执行语义和事务语义的完整性，而不只是 catalog。

### 4) CLI `ATTACH` 支持从环境变量取路径
- PR: [#21529 Fix CLI getenv on attach statement](https://github.com/duckdb/duckdb/pull/21529)
- 状态：Open，`Changes Requested` + `CI Failure`
- 信号：
  - 需求来自实际 CLI 工作流；
  - 但设计涉及语法层解析与环境变量展开时机。
- 预测：
  - **短期内不一定合入当前形态**，可能需要进一步收敛实现方案。

### 5) 开发版扩展发布节奏
- Issue: [#21622 Release cycle of extensions for development builds](https://github.com/duckdb/duckdb/issues/21622)
- 信号：
  - 这是产品交付层面的路线图问题，不是单点功能；
  - 若要支持更多 pre-release 用户验证，扩展发布自动化可能要进入后续工程规划。

---

## 7. 用户反馈摘要

### 对象存储场景是当前最真实的压力面
- 相关链接：
  - [#11817 S3 分区写 OOM](https://github.com/duckdb/duckdb/issues/11817)
  - [#21669 S3 多文件 Parquet INTERNAL Error](https://github.com/duckdb/duckdb/issues/21669)
- 反馈特征：
  - 用户已不再只把 DuckDB 当作本地 CSV/Parquet 工具，而是在直接处理 **S3 上的分区数据集与超大多文件数据湖对象**；
  - 痛点集中在内存控制、缓存层健壮性、远程 IO 边界错误。

### Python/多语言接口用户对“崩溃”容忍度极低
- 相关链接：
  - [#21651 Python 崩溃](https://github.com/duckdb/duckdb/issues/21651)
  - [#21584 ADBC use-after-free](https://github.com/duckdb/duckdb/issues/21584)
- 反馈特征：
  - 用户接受 SQL 报错，但难以接受宿主进程被直接打崩；
  - 这对嵌入式数据库定位尤其关键，因为稳定性直接决定上层应用是否敢于生产使用。

### 用户期望更“科学计算友好”的数值语义
- 相关链接：
  - [#14373 SUMMARIZE 与 inf/-inf](https://github.com/duckdb/duckdb/issues/14373)
  - [#21673 对应修复 PR](https://github.com/duckdb/duckdb/pull/21673)
- 反馈特征：
  - 用户更希望看到 `inf/nan/null`，而不是因极值数据中断整个 summarization 流程；
  - 这说明 DuckDB 的用户画像越来越覆盖数据科学、统计计算人群。

### 扩展生态已成为“能否试用新版本”的门槛
- 相关链接：
  - [#21622 Release cycle of extensions for development builds](https://github.com/duckdb/duckdb/issues/21622)
- 反馈特征：
  - 用户愿意提前测试开发版，但依赖扩展无法同步可用；
  - 说明扩展已经从“附加组件”变成很多用户的“基本能力”。

---

## 8. 待处理积压

### 1) S3 分区写出 OOM 已悬而未决近两年
- Issue: [#11817 Out-of-memory error when performing partitioned copy to S3](https://github.com/duckdb/duckdb/issues/11817)
- 创建：2024-04-24
- 现状：仍为 Open，`under review`
- 风险：
  - 这是高热度、实际生产影响明显的问题；
  - 若长期未解决，会持续削弱 DuckDB 在云对象存储导出场景下的可信度。

### 2) `SUMMARIZE` 与 inf/-inf 的异常行为已存在较长时间
- Issue: [#14373 Summarize gives Out of Range Error due to inf/-inf](https://github.com/duckdb/duckdb/issues/14373)
- 创建：2024-10-15
- 现状：Open，但已有修复 PR [#21673](https://github.com/duckdb/duckdb/pull/21673)
- 建议：
  - 这是典型“已有方案、应尽快落地”的积压问题。

### 3) `INSERT OR REPLACE` 内存泄漏修复 PR 长时间悬置
- PR: [#21039 Fix INSERT OR REPLACE memory leak for in-memory databases](https://github.com/duckdb/duckdb/pull/21039)
- 创建：2026-02-22
- 现状：Open，`stale`, `Changes Requested`
- 风险：
  - 涉及 in-memory DB 上重复 UPSERT 场景的无界内存增长；
  - 若属实，影响典型嵌入式/测试/缓存类负载。
- 建议：
  - 值得维护者重新确认 root cause 与复现脚本，避免因 stale 被长期搁置。

### 4) WAL replay 修复仍未收口
- PR: [#21608 [Fix] to #18259 WAL replay failure](https://github.com/duckdb/duckdb/pull/21608)
- 现状：Open，`Changes Requested`
- 风险：
  - WAL replay 牵涉恢复正确性，是数据库可靠性底线问题；
  - 尤其涉及 DDL + 默认表达式 + 重启恢复组合场景。
- 建议：
  - 应保持较高优先级推进。

### 5) 兼容性存储测试并行化仍待推进
- PR: [#21328 Run compatibilty storage tests in parallel](https://github.com/duckdb/duckdb/pull/21328)
- 现状：Open
- 意义：
  - 这是基础设施优化，不直接影响功能，但能提升 CI 周转效率；
  - 对当前高频提交节奏很有价值。

---

## 项目健康度结论

DuckDB 今日整体呈现出**高迭代、高修复密度、工程化持续增强**的健康状态：大量 PR 被关闭/合入，说明维护者对代码库节奏掌控良好。  
同时，新增问题集中暴露出两个值得重点跟踪的风险面：**远程对象存储/外部文件缓存路径**，以及**Python/ADBC 等嵌入式接口的 native 稳定性**。  
从路线图信号看，DuckDB 仍在同步推进三条主线：  
1. **云数据湖与外部文件访问能力增强**；  
2. **SQL 类型系统与统计函数行为打磨**；  
3. **数据库对象层与 introspection 能力扩展**。  

如果下一阶段能尽快收敛 S3 读写稳定性、WAL 恢复正确性以及多语言客户端崩溃问题，项目健康度还会进一步提升。  

--- 

如需，我还可以继续把这份日报整理成：
1. **面向管理层的一页简报版**  
2. **面向内核开发者的技术跟踪版**  
3. **Markdown 表格版 / 飞书日报版**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时 StarRocks 保持高活跃度：Issues 更新 5 条、PR 更新 104 条，其中 69 条已合并或关闭，说明维护者处理节奏较快、版本分支回补也在持续推进。  
从内容看，今天的重点仍集中在 **查询正确性修复、外表/数据湖能力增强、统计信息与可观测性完善、共享数据架构演进**。  
风险侧也较明显：新增 Issue 中出现 **count() 结果错误、ROUTINE LOAD 对 Avro union 解析异常、BE 执行报错** 等问题，涉及 SQL 正确性与导入稳定性。  
整体判断：**项目健康度良好、研发活跃度高，但 4.x 分支在复杂查询、外部表与半结构化数据链路上仍处于快速迭代和持续收敛阶段。**

---

## 2. 项目进展

以下为今日值得关注的已合并/关闭 PR 与正在推进的重要方向。

### 2.1 查询稳定性修复已完成多分支回补：空 Tablet 扫描崩溃
- **主修复 PR**：#70281 `[BugFix] Fix CN crash when scanning empty tablet with physical split enabled`  
  链接：StarRocks/starrocks PR #70281
- **回补关闭**：
  - #70832 `3.5.16 backport`  
    链接：StarRocks/starrocks PR #70832
  - #70833 `4.0.9 backport`  
    链接：StarRocks/starrocks PR #70833
  - #70831 `4.1.1 backport`  
    链接：StarRocks/starrocks PR #70831

**影响分析：**  
该修复解决了 CN 在扫描空 tablet 且启用 physical split 时可能发生 SIGSEGV 的问题，属于典型执行层稳定性缺陷。今天能看到主修复已完成，并快速同步到 3.5、4.0、4.1 分支，说明维护团队对 **线上稳定性问题响应及时**，也表明 physical split 相关路径已进入更大规模使用阶段。

---

### 2.2 Iceberg 可观测性增强已落地：元数据表查询指标
- **主 PR**：#70825 `[Enhancement] Add iceberg metadata table query metric`  
  链接：StarRocks/starrocks PR #70825
- **回补 PR**：#70882 `backport #70825`  
  链接：StarRocks/starrocks PR #70882

**推进意义：**  
新增对 **Iceberg metadata table 查询量** 的指标统计，并同步更新中英日文档。这是 StarRocks 外部表/数据湖观测能力持续增强的信号。对混合工作负载用户来说，这类指标有助于区分“业务 SQL”与“元数据探测/诊断 SQL”的消耗，方便容量评估和性能排障。

---

### 2.3 外部表与湖仓链路仍在快速演进

#### Hive 元数据更新仲裁逻辑重构
- #70910 `[Refactor] Move partition update arbitration logic into HiveMetadata`  
  链接：StarRocks/starrocks PR #70910

该 PR 将 partition update arbitration 逻辑内聚到 `HiveMetadata`，并移除单独的仲裁类层级。  
**技术信号**：StarRocks 正在进一步收敛 Hive 外表元数据更新路径，减少抽象层级，通常意味着后续会提升 **分区刷新一致性、维护成本和行为可解释性**。

#### Iceberg Parquet 对 shredded VARIANT 虚拟列读取补强
- #70924 `[UT] Support shredded VARIANT virtual-column reads for Iceberg Parquet`  
  链接：StarRocks/starrocks PR #70924

虽然当前标记为 UT，但从摘要看，它补足了 FE 对 VARIANT leaf path 改写后，BE 在 Parquet shredded VARIANT 数据上的端到端读取能力验证。  
**技术信号**：这是 StarRocks 在 **半结构化数据 + 湖格式查询融合** 方向上的持续强化，有利于提升 Iceberg + VARIANT 场景可用性。

---

### 2.4 共享数据架构能力继续扩展

#### 跨 bucket 分布的新存储抽象
- #70926 `[Feature] Support Composite Storage Volume for cross-bucket partition distribution`  
  链接：StarRocks/starrocks PR #70926

该 PR 提出 Composite Storage Volume，使 shared-data 模式下多个云存储 bucket 可组合，并让分区自动分布。  
**价值判断**：这属于典型的大型多桶对象存储部署能力，面向成本分摊、数据隔离、容量扩展和跨团队管理场景，是企业级 shared-data 架构的重要补齐项。

#### shared-nothing 到 shared-data 复制补齐 DCG 文件同步
- #69339 `[Enhancement] Support DCG files synchronization during shared-nothing to shared-data replication`  
  链接：StarRocks/starrocks PR #69339

该 PR 针对 Partial Update / Generated Column 场景下复制失败问题，增加 `.cols` 文件同步。  
**价值判断**：这是 shared-data 路线上的“可用性修补型增强”，意味着 StarRocks 正在从“可运行”向“覆盖更多真实生产特性”迈进。

---

### 2.5 统计信息与优化器精度持续强化
- #70853 `[Enhancement] Respect enable_sync_statistics_load for all statistics querying`  
  链接：StarRocks/starrocks PR #70853
- #70865 `[Enhancement] Implement IS NULL predicate stats with MCVs`  
  链接：StarRocks/starrocks PR #70865
- #70858 `[BugFix] Use explicit cast in skew rules for MCVs`  
  链接：StarRocks/starrocks PR #70858

**综合分析：**  
这组 PR 明显聚焦 CBO/统计信息质量，尤其是 MCV（Most Common Values）、偏斜规则、同步统计加载、`IS NULL` 谓词估算等。  
这说明社区当前的核心诉求之一已经从“能跑”进一步转向 **复杂查询场景下的计划质量与性能稳定性**，尤其适合 skew、外表、统计依赖型查询。

---

### 2.6 工具链与依赖治理
- #70822 `[Tool] Bump thrift on BE from v0.20 to v0.22`  
  链接：StarRocks/starrocks PR #70822
- #70925 `[Tool] Add check for generated files`  
  链接：StarRocks/starrocks PR #70925
- #70927 `[Doc] picomatch update`  
  链接：StarRocks/starrocks PR #70927
- #70867 `[BugFix] Upgrade cctz v2.3 -> v2.4 to fix CONVERT_TZ returning NULL for Africa/Casablanca and Africa/El_Aaiun`  
  链接：StarRocks/starrocks PR #70867

**解读：**  
今天还能看到明显的工程治理动作：生成文件检查、依赖升级、安全依赖更新、时区库修复。对数据库项目而言，这类改动虽不显眼，但直接关系到 **构建可重复性、SQL 时间语义一致性和供应链安全**。

---

## 3. 社区热点

> 注：给定数据中未提供精确评论排序值，以下按“问题影响面、技术复杂度、版本关联性、活跃更新时间”综合判断热点。

### 热点 1：跨 bucket 存储卷能力
- PR：#70926 `[Feature] Support Composite Storage Volume for cross-bucket partition distribution`  
  链接：StarRocks/starrocks PR #70926

**背后诉求：**  
用户在 shared-data 模式下，已不满足单一 bucket 的容量和治理模式，开始要求将多个存储卷聚合成统一逻辑空间，让分区自动分布。  
这反映出 StarRocks 正被用于更复杂的云对象存储架构，技术关注点已上升到 **存储编排与多桶运维**。

---

### 热点 2：Hive 外表分区与 EXPLAIN 可解释性
- Issue：#70557 `[Bug] EXPLAIN reports misleading partition count for Hive tables when metastore pre-filters by string partition columns`  
  链接：StarRocks/starrocks Issue #70557

**背后诉求：**  
用户希望 `EXPLAIN` 能准确反映真正被裁剪后的分区数量，而不是显示误导性的总量/部分量。  
这不是“只影响展示”的小问题，而是会直接影响用户对 **分区裁剪是否生效、查询为何慢、谓词是否下推成功** 的判断。

---

### 热点 3：统计信息与外部表观测能力
- PR：#70533 `[Enhancement] Add per-catalog-type query metrics for external table observability`  
  链接：StarRocks/starrocks PR #70533
- PR：#70825 `[Enhancement] Add iceberg metadata table query metric`  
  链接：StarRocks/starrocks PR #70825

**背后诉求：**  
越来越多用户在 StarRocks 内部表与外部 catalog 混合运行，希望从指标层区分 Hive、Iceberg、JDBC 等不同查询来源。  
这说明项目用户画像正在转向 **统一查询平台/湖仓分析入口**，不仅要性能，还要精细化可观测性。

---

### 热点 4：Ranger 标签权限控制需求
- Issue：#67458 `[Feature Request] Tag-Based Access Control Policies for StarRocks Ranger Plugin`  
  链接：StarRocks/starrocks Issue #67458

**背后诉求：**  
大型组织不希望继续按库表列逐条编写资源策略，而是希望借助标签实现 ABAC/Tag-based policy。  
这代表企业用户在 StarRocks 上的治理需求正从“能接入 Ranger”升级到 **可大规模管理、与组织安全模型融合**。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1：查询结果正确性问题——ORDER BY 导致 count() 结果异常
- Issue：#70904 `[type/bug] Severe Bug：Incorrect count() result when using ORDER BY`  
  链接：StarRocks/starrocks Issue #70904

**严重性：高**  
这是最值得关注的新问题之一，因为它直接触及 **SQL 结果正确性**。从描述看，查询包装与 `ORDER BY` 可能影响聚合结果，若复现稳定，则属于高优先级修复项。  
**当前状态：** 暂未看到明确 fix PR 关联。  
**建议关注：** 是否与优化器重写、子查询消除、聚合下推或投影裁剪相关。

---

### P1：ROUTINE LOAD 对 Avro nullable union 处理错误
- Issue：#70928 `[type/bug] ROUTINE LOAD Avro union type ["null", "type"] not handled correctly`  
  链接：StarRocks/starrocks Issue #70928

**严重性：高**  
Avro 的 `["null", "type"]` 是标准 nullable union 形式，如果导入链路不能正确处理，会影响 Kafka + Schema Registry 的常见生产使用。  
**当前状态：** 未见 fix PR。  
**影响面：** 数据摄取兼容性，尤其是 CDC/事件流场景。

---

### P1：BE 执行错误 `invalid size_of_elem:0`
- Issue：#70884 `[type/bug] sql.SQLSyntaxErrorException: invalid size_of_elem:0: BE:1598006`  
  链接：StarRocks/starrocks Issue #70884

**严重性：高**  
报错来自 BE，且触发 SQL 为 `count(distinct sid)` + `GROUP BY`，可能涉及执行层列类型、向量化聚合或函数参数元信息异常。  
**当前状态：** 暂未看到 fix PR。  
**风险：** 可能不是语法问题，而是内部执行/表达式处理异常。

---

### P2：Hive EXPLAIN 分区数量误导
- Issue：#70557 `[type/bug] EXPLAIN reports misleading partition count for Hive tables...`  
  链接：StarRocks/starrocks Issue #70557

**严重性：中**  
不一定影响实际执行结果，但会误导优化判断和问题定位。对依赖 EXPLAIN 做性能分析的用户影响较大。  
**当前状态：** 暂未看到 fix PR。  
**相关方向：** 与 Hive metadata / metastore pre-filter / explain 展示逻辑有关。

---

### P2：已修复并完成回补——空 tablet 扫描崩溃
- PR：#70281  
  链接：StarRocks/starrocks PR #70281
- 回补：#70832 / #70833 / #70831  
  链接：StarRocks/starrocks PR #70832 / PR #70833 / PR #70831

**状态：已修复**  
此项是今天稳定性治理中的积极信号，表明维护者对崩溃类问题采取了完整的多版本修复策略。

---

## 5. 功能请求与路线图信号

### 5.1 Ranger 标签权限控制
- Issue：#67458 `Tag-Based Access Control Policies for StarRocks Ranger Plugin`  
  链接：StarRocks/starrocks Issue #67458

**路线图判断：中期值得纳入**  
该需求面向企业级权限治理，适合大规模库表资产管理。虽然当前未见直接 PR，但随着 StarRocks 在数据平台中的角色增强，这类治理能力的重要性持续上升。

---

### 5.2 UDF 从 S3 加载
- PR：#64541 `[Feature] Support loading UDF on S3`  
  链接：StarRocks/starrocks PR #64541

**路线图判断：较有希望进入后续版本**  
该 PR 已存在较长时间且仍活跃更新，说明需求真实、实现持续推进。它能提升云上可扩展性，与 StarRocks 面向对象存储和云原生部署的方向一致。

---

### 5.3 Composite Storage Volume
- PR：#70926 `[Feature] Support Composite Storage Volume for cross-bucket partition distribution`  
  链接：StarRocks/starrocks PR #70926

**路线图判断：很强的下一阶段信号**  
这是 shared-data 路线的基础设施级增强，若合入，将明显提高 StarRocks 在多桶对象存储环境中的生产适配度。

---

### 5.4 外部表细粒度观测指标
- PR：#70533 `[Enhancement] Add per-catalog-type query metrics for external table observability`  
  链接：StarRocks/starrocks PR #70533

**路线图判断：高概率被纳入**  
考虑到 #70825 已经合入了 Iceberg metadata table 指标，这个更通用的 per-catalog-type 指标很可能也会进入后续版本，形成完整的外表观测体系。

---

## 6. 用户反馈摘要

基于今日 Issues，可提炼出以下真实用户痛点：

1. **复杂 SQL 下的正确性与稳定性仍是首要诉求**  
   - `count()` 在特定 `ORDER BY` 场景结果错误（#70904）  
   - `count(distinct)` 查询触发 BE 异常（#70884）  
   这说明用户已在真实分析场景中运行较复杂聚合 SQL，对结果正确性极为敏感。

2. **数据摄取链路需要更好兼容标准生态格式**  
   - Avro nullable union 导入不正确（#70928）  
   说明用户使用的是标准 Kafka + Confluent Schema Registry 体系，希望 StarRocks 能无缝兼容常见 Schema 演化模型。

3. **外部表用户不只关注“能查”，更关注“为什么这样执行”**  
   - Hive `EXPLAIN` 分区数量展示误导（#70557）  
   用户希望通过计划信息判断裁剪是否生效，这体现出 StarRocks 作为查询引擎，**可解释性** 已成为用户体验的重要组成部分。

4. **大型组织用户开始关注权限治理规模化**  
   - Ranger 标签策略需求（#67458）  
   表明 StarRocks 正进入更复杂的企业治理环境，不再只是单集群分析引擎。

---

## 7. 待处理积压

以下事项值得维护者重点关注：

### 7.1 长期功能 PR：UDF on S3
- PR：#64541 `[Feature] Support loading UDF on S3`  
  链接：StarRocks/starrocks PR #64541

**提醒原因：**  
该 PR 自 2025-10-24 起持续存在，说明功能价值明确但合入复杂度较高。建议维护者尽快明确接口、安全模型、下载缓存与权限校验边界，避免长期悬而未决。

---

### 7.2 长期需求：Ranger Tag-Based Access Control
- Issue：#67458  
  链接：StarRocks/starrocks Issue #67458

**提醒原因：**  
这是典型企业级治理诉求，且与 StarRocks 进入大规模数据平台场景高度相关。即使短期不做，也建议维护者给出 roadmap 反馈或设计约束说明。

---

### 7.3 外部表观测增强仍在排队
- PR：#70533 `[Enhancement] Add per-catalog-type query metrics for external table observability`  
  链接：StarRocks/starrocks PR #70533

**提醒原因：**  
随着 Iceberg metadata 指标已合入，per-catalog-type 指标的优先级被进一步抬高。建议尽快推进，以形成统一观测闭环。

---

### 7.4 今日新增高优先级 Bug 尚未见修复
- #70904 `count() + ORDER BY 正确性问题`  
  链接：StarRocks/starrocks Issue #70904
- #70928 `ROUTINE LOAD Avro union 兼容性问题`  
  链接：StarRocks/starrocks Issue #70928
- #70884 `invalid size_of_elem:0`  
  链接：StarRocks/starrocks Issue #70884

**提醒原因：**  
这三项分别涉及 **查询正确性、导入兼容性、执行稳定性**，都属于最容易影响生产信心的问题，建议优先 triage 并补充版本范围、最小复现和责任模块。

---

## 8. 总结判断

今天的 StarRocks 呈现出非常典型的“高速迭代型 OLAP 项目”特征：  
一方面，PR 活跃度极高，且在 **共享数据架构、外部表能力、统计信息、可观测性** 上持续扩张；另一方面，新增 Bug 仍集中暴露在 **复杂 SQL 正确性、标准生态格式兼容、执行层边界条件** 上。  

积极信号是：  
- 崩溃类问题已能快速修复并多分支回补；  
- 可观测性建设正在体系化；  
- shared-data 与湖仓集成方向投入明显。  

需要警惕的是：  
- 新增 SQL 正确性问题优先级很高；  
- 外部表/Hive/Iceberg/Avro 等异构生态链路仍是问题密集区。  

**总体结论：项目健康度良好，研发动能强，但建议维护团队继续把“正确性与兼容性收敛”置于与功能扩展同等优先级。**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：Issues 更新 7 条，PR 更新 48 条，说明社区当前仍处于持续迭代和密集维护状态。  
从内容看，今天的工作重心主要集中在 **CI/基础设施治理、Spark 兼容性修复、Core 层性能优化，以及 V4 manifest/CDC/视图规范等中长期能力建设**。  
关闭/合并的 PR 数量达到 19 条，节奏较快，其中不少是基础设施类改进，表明项目在提高开发效率和自动化质量门槛。  
同时，Spark 4.1 与视图行为相关的问题连续出现，反映出 **上游引擎版本变动正在对 Iceberg SQL 兼容性形成实际压力**。  
整体来看，项目健康度良好，但 **Spark 兼容性、视图语义一致性、以及部分长期未收敛的大型特性 PR** 值得持续关注。

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1）CI 缓存体系升级，提升构建可靠性
- **PR #15799** - CI: Replace `actions/cache` with `gradle/actions/setup-gradle` for Gradle caching  
  链接: https://github.com/apache/iceberg/pull/15799

该 PR 已关闭并明确 `Closes #15789`，将 GitHub Actions 中的 Gradle 缓存方案切换为更理解 Gradle 内部缓存机制的官方 action。  
这类改动虽然不直接影响查询功能，但会显著提升：
- CI 缓存命中质量
- stale cache 清理能力
- PR 场景下只读缓存的安全性

这说明 Iceberg 维护者正在优先夯实工程基础，降低由于 CI 不稳定带来的回归风险。

---

#### 2）JMH 基准测试工作流修复，恢复性能回归监控
- **PR #15729** - Infra: Fix failing Recurring JMH Benchmarks  
  链接: https://github.com/apache/iceberg/pull/15729
- **PR #15802** - Test: CI: Fix JMH benchmark workflows  
  链接: https://github.com/apache/iceberg/pull/15802
- **PR #15800** - CI: Fix JMH benchmark workflows（仍开放）  
  链接: https://github.com/apache/iceberg/pull/15800

JMH 工作流故障的直接原因，是默认 Spark 版本切换到 4.1 后，Spark 3.5 子项目未被正确注册。  
这说明：
- 上游 Spark 版本变化已经开始影响 Iceberg 的测试与 benchmark 编排；
- Iceberg 社区已将这一问题纳入快速修复流程。

对项目意义在于：**性能基线监控恢复后，后续 Core/Manifest/CDC 等改动更容易被量化评估**。

---

#### 3）Core 层删除向量（DV）校验优化，减少无效 manifest 扫描
- **PR #15653** - Core: Add manifest partition pruning to DV validation in MergingSnapshotProducer  
  链接: https://github.com/apache/iceberg/pull/15653

该 PR 已关闭，核心目标是在 DV 校验过程中引入 **manifest evaluator-based filtering**，跳过不可能命中分区条件的 delete manifest。  
这是一个典型的存储侧优化，价值体现在：
- 降低 commit 期间的 manifest 打开数量
- 减少冲突检测的额外 IO
- 提升大表/高并发写入场景下的提交效率

这类优化虽然不显眼，但对 Iceberg 在高吞吐数据湖场景中的稳定写入体验很关键。

---

#### 4）安全与治理：引入 zizmor 到 CI
- **PR #15793** - ci: add zizmor github workflow（开放中）  
  链接: https://github.com/apache/iceberg/pull/15793
- 相关测试 PR：**#15794**（已关闭）  
  链接: https://github.com/apache/iceberg/pull/15794

该方向聚焦 GitHub workflow 安全扫描，说明项目在 ASF 环境下正持续提升供应链安全与 CI 配置合规性。  
虽然尚未合并，但从关联修复链路看，推进意图明确。

---

#### 5）V4 Manifest 写入能力继续推进
- **PR #15634** - Core, Parquet: Allow for Writing Parquet/Avro Manifests in V4（开放中）  
  链接: https://github.com/apache/iceberg/pull/15634
- **PR #15798** - Core: Fix TestReplacePartitions using wrong table for validation（开放中）  
  链接: https://github.com/apache/iceberg/pull/15798

#15798 明确是修复 #15634 过程中发现的测试问题，说明 V4 manifest 相关开发已进入更深层验证阶段。  
若该能力落地，意味着 Iceberg 在 metadata/manifest 编码灵活性上进一步增强，对未来的元数据性能和格式演进具有积极意义。

---

## 4. 社区热点

### 热点 1：Spark 4.1 与视图创建兼容性
- **Issue #15238** - [bug] Spark 4.1 incompatible: Create View  
  链接: https://github.com/apache/iceberg/issues/15238

这是今日最值得关注的活跃问题之一，已有 14 条评论。问题描述表明，在 Spark 4.1 上执行 `CREATE OR REPLACE VIEW` 出现异常。  
背后的技术诉求是：
- Iceberg 需要尽快适配 Spark 4.1 的视图创建/解析路径；
- 用户希望 Iceberg 的 catalog/view 行为在升级 Spark 后仍保持稳定；
- 这不仅是语法兼容问题，也涉及 catalog API、view metadata 与 Spark planner 交互。

**技术判断：** 这类问题优先级较高，因为它直接影响 SQL 元数据对象管理，且与升级 Spark 的组织用户密切相关。

---

### 热点 2：Schema 演进希望支持删除 map 字段
- **Issue #15313** - [improvement] Alter schema: allow to drop map fields  
  链接: https://github.com/apache/iceberg/issues/15313

该需求有一定讨论热度。用户希望在 schema evolution 中允许删除 map 相关字段。  
背后反映的是现实场景下的 schema 清理诉求：
- 历史字段停用后无法优雅下线；
- 复杂嵌套类型的生命周期管理不够完善；
- 这会影响长期演进的湖表 schema 可维护性。

这是一个典型的 **数据治理/模式治理能力缺口**。

---

### 热点 3：Materialized View 规范仍在长期推进
- **PR #11041** - Materialized View Spec  
  链接: https://github.com/apache/iceberg/pull/11041

这是一个长期开放的重要规范 PR。尽管不是今天新开，但仍保持更新，说明社区对物化视图标准化仍在持续推进。  
其技术诉求包括：
- 为 Iceberg View 体系补齐更高级抽象；
- 支持跨引擎可互操作的物化视图定义；
- 为未来查询加速、增量刷新、元数据治理提供规范基础。

这是路线图级别信号，价值高于普通功能 PR。

---

### 热点 4：Flink CDC 流式读取支持
- **PR #15282** - Flink: Add CDC (Change Data Capture) streaming read support  
  链接: https://github.com/apache/iceberg/pull/15282

该 PR 持续活跃，目标是在 Flink Source 中引入 CDC/changelog 流式读取能力，输出正确的 `RowKind`。  
背后的需求非常明确：
- 用户不满足于 append-only 流式读取；
- 希望 Iceberg 能原生承载 upsert/delete 语义；
- 这与现代实时湖仓架构高度契合。

若推进顺利，这将是 Flink 集成能力的重要增强。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Spark 4.1 视图创建不兼容
- **Issue #15238** - [bug] Spark 4.1 incompatible: Create View  
  链接: https://github.com/apache/iceberg/issues/15238
- 状态：OPEN
- 是否已有 fix PR：**未见明确关联 fix PR**

影响：
- 直接阻塞 Spark 4.1 用户创建/替换 View；
- 属于明显的 SQL 兼容性回归风险；
- 若 Spark 4.1 成为默认测试/开发基线，该问题影响面会扩大。

---

### P1：Spark 中 Iceberg view 被当作 table 展示
- **Issue #15779** - [bug] Spark: Iceberg views are not created as views and are appearing as tables.  
  链接: https://github.com/apache/iceberg/issues/15779
- 状态：OPEN
- 是否已有 fix PR：**未见明确 fix PR**

影响：
- 破坏用户对元数据对象类型的预期；
- 在 hive catalog 场景下，视图可见性/识别方式异常；
- 属于 catalog 集成和 SQL 元数据语义一致性问题。

与 #15238 叠加看，**Spark + View** 已成为近期稳定性风险集中区。

---

### P2：metadata.json 指向错误 manifest list 路径
- **Issue #14195** - NotFoundException - metadata.json points to wrong manifestlist path  
  链接: https://github.com/apache/iceberg/issues/14195
- 状态：OPEN
- 是否已有 fix PR：**未见明确 fix PR**

影响：
- 可能导致读取快照元数据失败；
- 涉及 metadata 与 snapshot/manifest 路径一致性；
- 若可复现，后果可能包括读失败、表状态不可访问等。

虽然该问题较旧且带有 stale 标签，但其性质偏底层元数据完整性，维护者仍应关注。

---

### P2：Z-order rewrite 在列名 `ICEZVALUE` 时报误导性错误
- **Issue #15708** - Spark: Z-order rewrite fails with misleading error when table has a column named ICEZVALUE  
  链接: https://github.com/apache/iceberg/issues/15708
- 状态：CLOSED
- 是否已有 fix PR：**问题已关闭，说明已有处理进展，但数据中未给出具体关联 PR**

这类问题体现了 Spark rewrite/优化语句与内部保留命名之间的冲突，属于 SQL 引擎层边角兼容性问题。  
关闭本身是积极信号，说明维护者对 rewrite 路径中的可诊断性问题有响应。

---

## 6. 功能请求与路线图信号

### 1）Schema 演进：允许删除 map 字段
- **Issue #15313**  
  链接: https://github.com/apache/iceberg/issues/15313

这是明确的 schema evolution 增强请求。若被采纳，将改善复杂嵌套类型治理体验。  
当前尚未看到对应 PR，但需求真实，尤其适合长期运行的大型数据平台。

---

### 2）Flink CDC 流式读取
- **PR #15282**  
  链接: https://github.com/apache/iceberg/pull/15282

这是最强烈的路线图信号之一。  
相较普通 feature request，这已经进入代码实现阶段，说明：
- 被纳入中近期开发计划的概率较高；
- 未来版本可能在 Flink changelog 语义上有实质突破。

---

### 3）Kafka Connect 默认值支持
- **PR #15209** - Add Default Value Support for Kafka Connect  
  链接: https://github.com/apache/iceberg/pull/15209

该 PR 聚焦 Kafka Connect schema 默认值自动提取与应用，影响自动建表和 schema evolution。  
这反映出 Iceberg 正持续补强连接器生态，降低接入复杂度。  
如果合并，将显著提升 Kafka Connect 落湖体验。

---

### 4）Column update metadata 概念验证
- **PR #15445** - PoC: Introduce column update metadata  
  链接: https://github.com/apache/iceberg/pull/15445

这是偏前沿设计的 Core/API 方向探索。  
它可能为未来更细粒度的列级变更追踪、审计、演进打基础，但当前仍属于 PoC，短期进入正式版本的概率低于 CDC 或 connector 改进。

---

### 5）Avro local timestamp 逻辑类型读取支持
- **PR #15437** - Core: Support reading Avro local-timestamp-* logical types  
  链接: https://github.com/apache/iceberg/pull/15437

该能力补齐 Iceberg 对外部 Avro 数据的兼容性，尤其适合混合生态接入场景。  
这是一个较务实的兼容性增强项，进入下一版本的可能性相对较高。

---

### 6）Materialized View 规范
- **PR #11041**  
  链接: https://github.com/apache/iceberg/pull/11041

这是长期路线图信号，不太像短期小版本功能，更像规范层重大里程碑。  
一旦推进，将显著影响多引擎视图生态。

---

## 7. 用户反馈摘要

结合今日 Issues/PR 内容，可提炼出以下真实用户痛点：

### 1）Spark 升级后 SQL 元数据对象行为不稳定
相关链接：
- #15238: https://github.com/apache/iceberg/issues/15238
- #15779: https://github.com/apache/iceberg/issues/15779

用户关心的不只是“能不能查”，而是：
- `CREATE VIEW` 是否能正常工作；
- View 是否会被 catalog 正确识别为 view；
- Spark 新版本升级后，Iceberg 元数据对象语义是否仍一致。

这说明企业用户已经把 Iceberg 用在较完整的数据平台场景，而不仅仅是文件格式层。

---

### 2）复杂 schema 的“退出机制”不够友好
相关链接：
- #15313: https://github.com/apache/iceberg/issues/15313

用户反馈表明，map 字段一旦引入，后续想删除会遇到限制。  
这反映 Iceberg 在 schema 治理方面，仍需更好支持“字段退役”和“历史包袱清理”。

---

### 3）底层元数据路径错误会直接伤害可用性
相关链接：
- #14195: https://github.com/apache/iceberg/issues/14195

从报错看，这类问题会让表元数据读取直接失败。  
对用户而言，这不是小瑕疵，而是会影响生产可用性的高敏感问题。

---

### 4）实时湖仓用户需要真正的 CDC/changelog 能力
相关链接：
- #15282: https://github.com/apache/iceberg/pull/15282
- #15162: https://github.com/apache/iceberg/pull/15162

用户诉求已从“能否流式读写”升级为：
- 能否保留 delete / update_before / update_after；
- 能否与下游实时计算语义对齐；
- 能否降低 connector 与格式层之间的语义损耗。

---

## 8. 待处理积压

以下长期未收敛事项建议维护者重点关注：

### 1）Materialized View Spec 长期开放
- **PR #11041**  
  链接: https://github.com/apache/iceberg/pull/11041

这是典型的大型规范 PR，战略意义高，但周期长。建议明确：
- 未决设计点
- 需要哪些引擎配合
- 分阶段落地计划

---

### 2）Flink CDC 流式读取支持
- **PR #15282**  
  链接: https://github.com/apache/iceberg/pull/15282

功能价值高，但处于 stale 状态。若长期停滞，会削弱社区对 Flink 实时能力演进的预期。

---

### 3）Column update metadata PoC
- **PR #15445**  
  链接: https://github.com/apache/iceberg/pull/15445

该 PR 方向重要，但“PoC + stale”意味着尚未进入可收敛状态。建议判断其是否需要：
- 拆分成更小的可合并单元
- 先固化 metadata 模型
- 或转为 design doc 推进

---

### 4）Avro local timestamp 支持
- **PR #15437**  
  链接: https://github.com/apache/iceberg/pull/15437

这是兼容性增强中的高实用项，但当前也处于 stale 状态。若长期未推进，可能继续阻碍外部 Avro 数据接入场景。

---

### 5）metadata.json 指向错误 manifestlist 路径
- **Issue #14195**  
  链接: https://github.com/apache/iceberg/issues/14195

虽为旧问题，但其风险偏基础设施级别。建议维护者确认：
- 是否已无法复现
- 是否缺少最小复现样例
- 是否与特定对象存储/提交重试/路径拼装逻辑有关

---

## 结论

今天的 Apache Iceberg 项目动态显示出两个明显特征：  
一方面，**基础设施与工程治理动作密集**，CI、benchmark、安全检查都在持续增强；另一方面，**Spark 4.1 兼容性和视图语义问题开始浮出水面**，这是近期最值得优先处理的用户侧风险。  
中长期看，**Flink CDC、V4 manifest、物化视图规范、连接器增强** 仍是最重要的演进方向。  
若维护者能尽快收敛 Spark view 相关 bug，并继续推动 CDC/metadata 方向的开放 PR，项目整体健康度将进一步提升。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区维持**中高活跃度**：Issues 有 3 条更新，PR 有 50 条更新，其中 30 条处于待合并状态，20 条已合并或关闭。  
从变更主题看，研发重心依然非常明确，主要集中在 **Kernel + Spark DSv2 路径建设、CDC 流式处理能力完善、DDL/Create Table 路由改造，以及若干 Schema/Deletion Vector 正确性问题修复**。  
今天没有新版本发布，但从 PR 结构看，项目正处于一轮较大的**内核能力补齐与 Spark 接入深化**阶段。  
整体健康度良好：功能推进连续、PR 栈式开发明显，但也暴露出一些**查询正确性与 schema 演进边界条件**问题，值得持续关注。

---

## 3. 项目进展

> 注：输入数据仅给出“过去24小时 PR 更新 50 条（待合并: 30，已合并/关闭: 20）”，但未提供全部已合并/关闭 PR 明细。以下重点基于今日最活跃、最具代表性的 PR 进行进展分析。

### 3.1 Kernel-Spark CDC 流式读取链路持续推进

这一组 PR 显示，Delta Lake 正在系统性补齐 **kernel-spark + DSv2** 下的 CDC（Change Data Feed）流式处理能力，覆盖 offset 管理、commit 处理、schema 协调、DV 支持和端到端测试。

- [#6075 [kernel-spark][Part 1] CDC streaming offset management (initial snapshot)](https://github.com/delta-io/delta/pull/6075)
- [#6076 [kernel-spark][Part 2] CDC commit processing (convert delta log actions to IndexedFiles)](https://github.com/delta-io/delta/pull/6076)
- [#6336 [kernel-spark][Part 3] CDC streaming offset management (finish wiring up incremental change processing)](https://github.com/delta-io/delta/pull/6336)
- [#6359 [kernel-spark][Part 4] CDC data reading: ReadFunc decorator and null-coalesce](https://github.com/delta-io/delta/pull/6359)
- [#6362 [kernel-spark][Part 5] CDC schema coordination in ApplyV2Streaming and SparkScan](https://github.com/delta-io/delta/pull/6362)
- [#6363 [kernel-spark][Part 6] End-to-end CDC streaming integration tests](https://github.com/delta-io/delta/pull/6363)
- [#6370 [kernel-spark][Part 7] DV+CDC same-path pairing and DeletionVector support](https://github.com/delta-io/delta/pull/6370)
- [#6388 [kernel-spark] Support allowOutOfRange for CDC startingVersion in DSv2 streaming](https://github.com/delta-io/delta/pull/6388)
- [#6391 [kernel-spark][Part 2.5] CDC admission limits for commit processing](https://github.com/delta-io/delta/pull/6391)

**进展解读：**
- 这是典型的**大型栈式 PR 序列**，说明 CDC 在新 connector/path 上正从“可运行”走向“可生产化”。
- 关键能力包括：
  - 初始快照与增量 offset 的统一管理；
  - 将 delta log action 转换为底层 IndexedFiles；
  - SparkScan / ApplyV2Streaming 间的 schema 协调；
  - CDC 与 Deletion Vector 的同路径配对；
  - `startingVersion` 越界行为兼容；
  - admission limits 控制，提升大提交场景下的稳定性。
- 这对 Delta Lake 在**实时数仓、增量 ETL、流批一体**场景的竞争力非常关键。

### 3.2 DSv2 CREATE TABLE 路径建设继续推进

- [#6377 Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE](https://github.com/delta-io/delta/pull/6377)
- [#6378 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6378)
- [#6379 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6379)

**进展解读：**
- 这组 PR 表明 Delta Lake 正在把 `CREATE TABLE` 相关 DDL 从传统路径逐步迁移到 **DSv2 + Kernel**。
- 这不仅是代码整理，更是架构演进信号：未来 Delta 在 Spark 侧的 catalog / table lifecycle 操作，可能更多依赖统一的 DSv2 抽象。
- 如果这条链路稳定下来，会降低 Spark 版本差异带来的维护成本，也为后续统一 DDL 行为、跨引擎复用 Kernel 奠定基础。

### 3.3 查询下推与执行优化继续补强

- [#6332 [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector](https://github.com/delta-io/delta/pull/6332)

**进展解读：**
- 该 PR 为 Delta V2 connector 实现 Spark 的 `SupportsPushDownLimit`。
- 直接意义是：`SELECT * FROM delta_table LIMIT N` 这类查询可将 `LIMIT` 更早下推到 scan 阶段，减少文件读取与扫描工作量。
- 这是一个典型的**查询引擎侧性能优化**，尤其适用于交互式分析、样本抽样、探查型查询。

### 3.4 Kernel 类型系统与表达式兼容性修复

- [#6257 [Kernel] Support implicit cast between DECIMAL types with different precisions](https://github.com/delta-io/delta/pull/6257)
- [#6259 [Kernel] Fix Literal.ofDecimal to handle precision < scale from Java BigDecimal](https://github.com/delta-io/delta/pull/6259)

**进展解读：**
- 这两项都属于**SQL 类型系统兼容性与正确性增强**。
- 重点在 Decimal 的隐式转换和 Java `BigDecimal` 到 Delta Kernel DecimalType 的边界处理。
- 对依赖金融、计费、精确计算场景的用户尤为重要，有助于减少 Spark/Java/Kernel 表达式层之间的类型不一致问题。

### 3.5 Spark 写入语义与 Replace Where 可维护性改进

- [#6374 [Spark] Refactor the REPLACE WHERE code into separate functions and make variable names clearer](https://github.com/delta-io/delta/pull/6374)
- [#6375 [Spark] Add Delta Option useNullIntolerantEqualityWithDPO, to not overwrite partitions that contain NULL in the table](https://github.com/delta-io/delta/pull/6375)

**进展解读：**
- #6374 更偏向代码结构重构，但通常是后续行为修复或语义增强的前奏。
- #6375 则明显面向实际用户痛点：在动态分区覆盖/条件覆盖相关场景中，**NULL 分区值处理可能导致过度覆盖**。
- 这反映出团队在持续收敛 Spark 写入路径中复杂且易错的边界行为。

### 3.6 共享与 UniForm 生态兼容继续扩展

- [#6392 DeltaFormatSharingSource only finish current version when startOffset is from Legacy](https://github.com/delta-io/delta/pull/6392)
- [#6430 [UniForm] Adds reading Iceberg test for IcebergConverterSuite](https://github.com/delta-io/delta/pull/6430)

**进展解读：**
- #6392 聚焦 Sharing 语义正确性，说明 Delta Sharing 在 offset / version 边界上的行为还在持续打磨。
- #6430 则体现出 UniForm 方向仍在推进，尤其是与 Iceberg 读取兼容相关的测试覆盖。
- 这释放出一个路线图信号：Delta 不仅在强化自身内核，还在继续完善**多格式互操作与共享分发能力**。

---

## 4. 社区热点

### 热点 1：Kernel-Spark CDC 大栈式 PR 序列
链接：
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**技术诉求分析：**
- 社区和维护者当前最明确的方向，是让 **Kernel-based Spark connector** 真正具备接近成熟 Spark 原生路径的 CDC 能力。
- 技术难点集中在：
  1. 流式 offset 定义与状态推进；
  2. CDC 与普通数据文件、DV 的统一抽象；
  3. schema 演进与 streaming read 的协调；
  4. 大提交和越界起始版本下的鲁棒性。
- 这意味着 Delta 正在为**下一代读取栈**做准备，而非仅在传统 Spark path 上打补丁。

### 热点 2：DSv2 DDL / CreateTable 路由改造
链接：
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**技术诉求分析：**
- 这类 PR 说明维护者不满足于查询读取层面的 DSv2 接入，而是开始向**DDL 生命周期管理**延伸。
- 背后诉求包括：
  - 统一 Spark catalog 接口；
  - 让 Kernel 真正参与 table creation；
  - 降低 legacy 路径与新路径的双维护成本。

### 热点 3：Deletion Vector 与 MERGE 正确性问题
链接：
- [#2943 [bug] [BUG][Spark] Deletion Vectors can cause `AMBIGUOUS_REFERENCE` errors on MERGE](https://github.com/delta-io/delta/issues/2943)

**技术诉求分析：**
- Deletion Vector 已是 Delta 的关键特性，但它引入了更多执行计划与列解析复杂性。
- 在 `MERGE` 这种复杂写操作中触发 `AMBIGUOUS_REFERENCE`，说明 DV 与 Spark 分析器/列绑定逻辑之间可能存在边界缺陷。
- 这类问题一旦出现，会直接影响生产写入作业可靠性，优先级较高。

---

## 5. Bug 与稳定性

以下按潜在严重程度排序。

### P1：Deletion Vectors 在 MERGE 中触发 `AMBIGUOUS_REFERENCE`
- Issue: [#2943](https://github.com/delta-io/delta/issues/2943)
- 标题：`[BUG][Spark] Deletion Vectors can cause AMBIGUOUS_REFERENCE errors on MERGE`
- 状态：OPEN
- 评论：5
- 是否已有 fix PR：**从当前提供数据看，未明确看到直接关联 fix PR**

**影响分析：**
- 这是一个**查询/写入正确性问题**，并非单纯性能退化。
- 受影响路径涉及 Spark + Delta + DV + MERGE 组合，是生产环境高价值场景。
- 若问题稳定可复现，可能阻塞启用 DV 的用户在 UPSERT / SCD 处理中的采用。

### P1：Schema evolution 错误拒绝“nullable struct + non-nullable inner fields”
- Issue: [#6428](https://github.com/delta-io/delta/issues/6428)
- 状态：OPEN
- 创建/更新：2026-03-27
- 是否已有 fix PR：**当前数据中未看到明确修复 PR**

**影响分析：**
- 报错为：`KernelException: "Cannot add non-nullable field <fieldname>"`
- 问题本质是 **schema 演进校验逻辑过严**，未正确区分“新增外层 nullable struct”与“新增顶层 non-nullable 字段”。
- 这会直接影响半结构化数据、嵌套字段演进、事件模型扩展场景。
- 对使用 Kernel 或统一 schema 校验路径的用户来说，属于**高频可见问题**。

### P2：Sharing 增量版本推进边界问题
- PR: [#6392](https://github.com/delta-io/delta/pull/6392)
- 标题：`DeltaFormatSharingSource only finish current version when startOffset is from Legacy`

**影响分析：**
- 尽管这是一条 PR 而非 issue，但标题表明 Sharing source 在 Legacy startOffset 下的 version 完成逻辑存在不一致。
- 这更偏**流式语义/offset 正确性**问题，可能在增量同步场景下造成重复消费或推进异常。
- 由于已有 PR，说明问题已进入修复流程。

### P2：Decimal 精度/scale 边界处理缺陷
- PR: [#6257](https://github.com/delta-io/delta/pull/6257)
- PR: [#6259](https://github.com/delta-io/delta/pull/6259)

**影响分析：**
- 两者属于表达式求值与类型系统边界缺陷。
- 一旦触发，表现通常是运行时报错、类型推断异常，或 SQL 兼容性不一致。
- 虽非全局阻断，但对精确计算工作负载有实际影响。

---

## 6. 功能请求与路线图信号

### 6.1 新的协议层变更提案出现
- Issue: [#6426 [PROTOCOL RFC]](https://github.com/delta-io/delta/issues/6426)

**信号解读：**
- 虽然摘要未披露完整提案内容，但以 `[PROTOCOL RFC]` 形式提交，说明社区仍在推动 **Delta Protocol 层面的演进**。
- 这类 RFC 通常意味着未来可能涉及：
  - log/action 元数据扩展；
  - 新 reader/writer feature bit；
  - 兼容性门槛变化；
  - 新连接器/新能力启用条件。
- 是否进入下一版本取决于设计成熟度，但这是明确的**路线图信号**。

### 6.2 DSv2 + Kernel 路径很可能被持续纳入下一阶段主线
相关 PR：
- [#6332](https://github.com/delta-io/delta/pull/6332)
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**判断：**
- 从 LIMIT 下推到 CREATE TABLE 路由，覆盖面已从“读”扩展到“DDL”。
- 这通常不是试验性 patch，而是架构主线。
- 高概率会在接下来几个版本中继续扩大覆盖范围，如更多扫描下推、建表/改表、catalog 交互。

### 6.3 CDC on Kernel-Spark 进入版本候选能力区
相关 PR：
- [#6075](https://github.com/delta-io/delta/pull/6075) 至 [#6391](https://github.com/delta-io/delta/pull/6391)

**判断：**
- 如此长的分阶段 PR 栈说明功能已进入较深实现阶段，而非需求讨论阶段。
- 一旦端到端测试链稳定，CDC 的 DSv2 / Kernel-Spark 支持非常可能成为下一版亮点之一。

### 6.4 多格式互操作仍在持续投入
- [#6430 [UniForm] Adds reading Iceberg test for IcebergConverterSuite](https://github.com/delta-io/delta/pull/6430)

**判断：**
- 虽然当前只是测试补充，但说明 UniForm 与 Iceberg 兼容依旧在推进。
- 这类工作往往不会立刻体现在用户可见 feature 中，但会逐步提升 Delta 在多引擎生态中的采用门槛优势。

---

## 7. 用户反馈摘要

基于今日 Issues 可提炼出几类真实用户痛点：

### 7.1 用户最在意的是“复杂写入操作 + 高级特性”的正确性
- 代表问题：[#2943](https://github.com/delta-io/delta/issues/2943)
- 用户在使用 `MERGE` 配合 Deletion Vector 时遇到分析错误，说明实际生产负载已经深入使用 Delta 的高级能力，而不仅仅是 append-only。
- 用户诉求不是“增加功能”，而是**现有高级能力在复杂 SQL 场景下必须稳定可靠**。

### 7.2 嵌套 schema 演进仍是高频痛点
- 代表问题：[#6428](https://github.com/delta-io/delta/issues/6428)
- 用户希望在不破坏历史数据的前提下演进嵌套结构，但当前校验逻辑不够精细。
- 这反映出 Delta 在半结构化、事件流、日志类数据建模中被广泛使用，schema 演进体验直接影响用户满意度。

### 7.3 社区对协议层演进仍有参与意愿
- 代表问题：[#6426](https://github.com/delta-io/delta/issues/6426)
- 说明用户或贡献者并不仅仅报告 bug，也在积极推动协议能力扩展。
- 对开源项目而言，这是健康信号，表明社区在“共建未来能力”而非只“消费当前功能”。

---

## 8. 待处理积压

以下条目建议维护者优先关注：

### 8.1 长期开启的高风险正确性问题：DV + MERGE
- [#2943](https://github.com/delta-io/delta/issues/2943)
- 创建于 2024-04-22，至今仍为 OPEN，最近于 2026-03-27 更新。

**关注原因：**
- 持续时间长；
- 涉及核心写操作 `MERGE`；
- 与 Deletion Vectors 这一关键特性直接相关；
- 有一定讨论，但尚未看到明确修复闭环。

### 8.2 长栈式 PR 的合并风险与评审吞吐
重点关注：
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**关注原因：**
- 栈式 PR 有利于拆分实现，但也容易形成：
  - review 阻塞；
  - 基线频繁漂移；
  - 上游一处改动导致整栈重做。
- 建议维护者尽快明确合并顺序与里程碑，避免 CDC 功能长期处于“接近完成但无法落地”的状态。

### 8.3 DSv2 DDL 路径改造需要尽快给出稳定性判断
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**关注原因：**
- DDL 是入口能力，影响面广。
- 若路由策略、兼容开关、失败回退逻辑不清晰，容易在 Spark 版本组合中引入隐性回归。
- 建议在合并前明确 migration/testing matrix。

---

## 结论

Delta Lake 今日的主要信号非常清晰：**项目正在围绕 Kernel 化、DSv2 化、CDC 流式能力完善以及复杂语义正确性修复持续推进**。  
从工程投入看，维护者正在做的是“下一阶段架构升级”，而不只是零散 bugfix；这对项目中长期健康度是积极信号。  
同时，**DV + MERGE 正确性**与**嵌套 schema 演进校验**这两类问题，代表了用户在生产环境中最真实的痛点，建议作为短期稳定性优先事项。  
如果后续几天 CDC 栈式 PR 和 DSv2 DDL 路径开始陆续合并，Delta Lake 很可能正在接近一个以 **Kernel-Spark 能力增强** 为核心卖点的后续版本窗口。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Databend 社区保持了较高开发活跃度：Issues 有 3 条更新，PR 有 15 条更新，其中 7 条已合并或关闭、8 条仍在推进中。  
从变更内容看，今天的重点明显集中在**查询执行引擎稳定性修复、聚合/Join 执行路径优化、以及 SQL 兼容性增强**。  
项目没有新版本发布，但多个已关闭 PR 指向**内存管理、聚合 spilling、MERGE/UPDATE 行为、错误码语义清晰化**等核心问题，说明团队正在持续收敛执行层风险。  
整体健康度评价：**活跃且偏向“性能与正确性修复日”**，工程推进节奏良好。

---

## 3. 项目进展

### 已合并/关闭的重要 PR

#### 1) 聚合 spilling 与内存使用问题修复
- **PR #19622** `fix(query): resolve spilling problems and refine memory usage in aggregation`  
  链接: databendlabs/databend PR #19622

这是今天最重要的执行引擎修复之一，直接针对**Aggregation 阶段的 spilling 问题与内存使用细化**。  
这类改动通常会影响大查询、分组聚合、内存紧张场景下的稳定性和性能表现，说明 Databend 正在加强 OLAP 核心算子在高压力下的可控性。

相关后续拆分改动仍在推进：
- **PR #19626** `fix: use spill depth partition bit in new final agg`  
  链接: databendlabs/databend PR #19626
- **PR #19627** `refactor: split oversized blocks in BlockPartitionStream and add unit tests`  
  链接: databendlabs/databend PR #19627

这表明聚合执行链路的修复并非一次性补丁，而是沿着**分区、block 切分、final agg 一致性**持续打磨。

---

#### 2) MERGE 规划开关行为修复
- **PR #19624** `fix: restore enable_merge_into_row_fetch`  
  链接: databendlabs/databend PR #19624

该 PR 恢复了 `enable_merge_into_row_fetch` 配置项的实际生效逻辑，确保在禁用该设置时，规划器不会继续生成 lazy target scan 和 `RowFetch` 计划。  
这属于**查询规划器行为一致性修复**，对于依赖配置开关进行性能调优、回归排查或稳定性隔离的用户非常关键。

---

#### 3) UPDATE + 行级访问策略修复
- **PR #19625** `fix(query): enforce row access policy for Direct UPDATE and split predicate fields`  
  链接: databendlabs/databend PR #19625

该修复确保在 **Direct UPDATE** 场景下，即使用户没有显式 `WHERE` 条件，也能正确执行 row access policy。  
这类问题同时涉及：
- SQL 执行正确性
- 安全策略生效边界
- 存储层 mutation processor 的字段处理一致性

对企业多租户与安全隔离用户来说，属于较高优先级修复。

---

#### 4) 错误码语义澄清，修复 OOM 映射混乱
- **PR #19614** `fix: rename PanicError and fix executor OOM mapping`  
  链接: databendlabs/databend PR #19614

该 PR 修复了 Issue #19612，将 `ErrorCode::PanicError` 更名为 `ErrorCode::UnwindError`，同时停止将 pipeline executor 的内存限制 flush 失败错误错误映射到 panic 类错误码。  
这项变更的价值在于：
- 提高错误诊断可读性
- 降低运维误判
- 让 executor OOM / flush failure 与真实 panic 更容易区分

对应 Issue：
- **Issue #19612** `[CLOSED] Rename ErrorCode::PanicError to reduce confusion and fix misuse`  
  链接: databendlabs/databend Issue #19612

---

#### 5) SQL Binder / Agg Rewrite 持续重构
- **PR #19579** `refactor(sql): separate aggregate registration and reuse in binder`  
  链接: databendlabs/databend PR #19579
- **PR #19549** `feat(query): support experimental table tags for FUSE table snapshots`  
  链接: databendlabs/databend PR #19549
- **PR #14703** `feat: implement partial full outer join for merge into I/O improvement`  
  链接: databendlabs/databend PR #14703

其中：
- `#19579` 统一了聚合注册/复用路径，为 builtin aggregates、UDAF、group items 等建立一致 binder 机制，有利于未来的 SQL 语义扩展和优化器演进。
- `#14703` 虽然是长期 PR，今天关闭，说明老方案可能已被替代或完成清理；其主题指向 **MERGE INTO 的 I/O 优化**，是项目长期优化方向的一个信号。
- `#19549` 关闭意味着“实验性 table tags”这一路线正在发生实现调整或被新设计替代，见下文路线图分析。

---

## 4. 社区热点

### 1) INSERT 性能回归问题仍是最值得关注的话题
- **Issue #19481** `[OPEN] [C-bug] bug: slower performance of INSERT with 1.2.881`  
  作者: @rad-pat  
  评论: 29  
  链接: databendlabs/databend Issue #19481

这是当前评论数最高的活跃 Issue。用户反馈从 `1.2.790` 升级到 `1.2.881-nightly` 后，`INSERT` 性能明显变慢。  
背后的技术诉求非常明确：
- 用户需要**版本升级后的写入性能稳定性**
- 需要明确**性能回归是否来自 planner/executor/storage path 的变化**
- 希望有**可回退配置、定位指标、回归根因说明**

作为 OLAP 数据库，批量写入和导入吞吐是核心体验指标，这类问题会直接影响 nightly 版本采纳意愿。

---

### 2) 实验性表分支能力是当前最强功能信号
- **PR #19551** `[OPEN] feat(query): support experimental table branch`  
  链接: databendlabs/databend PR #19551

该 PR 引入 FUSE table 的 table branch，包括：
- branch 创建
- branch-qualified 读写
- branch 生命周期元数据
- branch-aware GC

这代表 Databend 正在继续推进**面向数据版本化/分支管理的高级表语义**。  
结合已关闭的 table tags PR，可以看出团队正在重塑这套“表级版本引用模型”。

---

### 3) Partitioned Hash Join 仍在推进
- **PR #19553** `[OPEN] refactor(query): support partitioned hash join`  
  链接: databendlabs/databend PR #19553

这是查询执行层的重要演进。Partitioned hash join 往往关系到：
- 大表 Join 的可扩展性
- 内存压力控制
- spill / repartition 配合
- 分布式执行表现

它与今天聚合 spilling 修复形成呼应，反映团队正在系统性强化**大查询执行路径**。

---

### 4) 字符串函数 fast path 优化值得关注
- **PR #19628** `[OPEN] feat: add fast paths for substr and string column concat`  
  链接: databendlabs/databend PR #19628

该 PR 针对 `substr` 和字符串列 concat 增加 fast path，避免部分场景走通用 Arrow concat 路径。  
这意味着 Databend 不仅在优化重型查询算子，也开始细化**表达式函数层面的热点性能**，对文本处理、ETL 和轻分析场景有直接收益。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### 高优先级

#### A. INSERT 性能回归
- **Issue #19481** `[OPEN] bug: slower performance of INSERT with 1.2.881`  
  链接: databendlabs/databend Issue #19481
- 状态：**仍开放**
- 是否已有 fix PR：**未见直接关联修复 PR**

影响版本升级信心，且与写入主路径相关，属于高优先级性能回归问题。建议维护者尽快补充：
- benchmark 对比
- root cause 定位
- 是否存在配置规避手段

---

#### B. 聚合 spilling / 内存使用问题
- **PR #19622** `[CLOSED] fix(query): resolve spilling problems and refine memory usage in aggregation`  
  链接: databendlabs/databend PR #19622
- 相关进行中：
  - **PR #19626** 链接: databendlabs/databend PR #19626
  - **PR #19627** 链接: databendlabs/databend PR #19627

说明聚合执行在复杂场景下曾存在稳定性或资源控制问题，目前已有修复落地，但部分细节仍在追进。建议后续重点观察 nightly 回归情况。

---

#### C. Row access policy 在 Direct UPDATE 下可能失效
- **PR #19625** `[CLOSED] fix(query): enforce row access policy for Direct UPDATE and split predicate fields`  
  链接: databendlabs/databend PR #19625

这是典型的**正确性 + 安全边界**问题，虽然已修复，但应在后续版本说明中重点提示企业用户升级。

---

### 中优先级

#### D. 错误码误导运维排障
- **Issue #19612** `[CLOSED] Rename ErrorCode::PanicError to reduce confusion and fix misuse`  
  链接: databendlabs/databend Issue #19612
- **PR #19614** `[CLOSED] fix: rename PanicError and fix executor OOM mapping`  
  链接: databendlabs/databend PR #19614

该问题不会直接导致数据错误，但会显著影响故障归因和报警分类，属于稳定性治理中的“可观测性正确性”修复。

---

#### E. Link Checker 自动化报错
- **Issue #19629** `[OPEN] [report, automated issue] Link Checker Report`  
  链接: databendlabs/databend Issue #19629

自动化检查显示文档链接存在 1 个错误。  
这不是核心引擎问题，但会影响文档体验与开发者自助排障效率，建议维护者尽快清理。

---

## 6. 功能请求与路线图信号

### 1) 表分支/标签能力是明显路线图重点
- **PR #19551** `[OPEN] experimental table branch`  
  链接: databendlabs/databend PR #19551
- **PR #19549** `[CLOSED] experimental table tags for FUSE table snapshots`  
  链接: databendlabs/databend PR #19549

从“table tags”关闭、而“table branch”继续推进看，团队可能正在统一或重构 FUSE 表的版本引用模型。  
这类能力通常服务于：
- 数据试验分支
- 可回溯分析
- 类 Git 的数据对象管理
- 数据治理和审计

判断：**较可能进入后续重要版本，但可能先以 experimental 形态交付。**

---

### 2) Join/聚合执行引擎继续向大规模场景优化
- **PR #19553** partitioned hash join  
  链接: databendlabs/databend PR #19553
- **PR #19622/#19626/#19627** 聚合 spilling 与 block 管理  
  链接: databendlabs/databend PR #19622

路线图信号很清晰：Databend 正在加强在大数据量、内存敏感场景下的执行器鲁棒性。  
判断：**下一阶段版本很可能持续出现 Join/Agg 执行层性能与资源管理优化。**

---

### 3) SQL 兼容性和易用性持续提升
- **PR #19615** `support IF NOT EXISTS for ALTER TABLE ADD COLUMN`  
  链接: databendlabs/databend PR #19615
- **PR #19623** `fix variant cast to number`  
  链接: databendlabs/databend PR #19623
- **PR #19628** `substr and string column concat fast path`  
  链接: databendlabs/databend PR #19628

这说明项目一方面补齐 SQL 行为兼容性，一方面优化函数执行效率。  
判断：这些变更**进入下一版本的概率较高**，因为它们相对独立、收益明确、风险可控。

---

## 7. 用户反馈摘要

### 主要用户痛点

#### 1) 升级后性能不可预测
- 来自 **Issue #19481**  
  链接: databendlabs/databend Issue #19481

真实用户反馈表明，nightly 版本升级后 `INSERT` 性能下降，是当前最突出的用户体验问题。  
这反映出用户对 Databend 的主要期待之一是：
- **写入吞吐稳定**
- 升级行为可解释
- 性能回归能快速定位

---

#### 2) 需要更可控的执行器行为与配置语义
- 来自 **PR #19624**  
  链接: databendlabs/databend PR #19624

配置项 `enable_merge_into_row_fetch` 必须“关得掉、关得准”，说明用户不仅关心功能是否可用，也重视：
- 配置是否真正生效
- explain plan 是否符合预期
- 调优手段是否可靠

这通常来自已经在生产环境深度使用 Databend 的用户群体。

---

#### 3) 企业场景关注安全策略与 DML 正确性
- 来自 **PR #19625**  
  链接: databendlabs/databend PR #19625

row access policy 在 UPDATE 中的正确执行，说明用户正将 Databend 用于更复杂的权限治理场景，而不是只做离线分析。  
这是产品向企业级数仓/湖仓能力深化的重要信号。

---

## 8. 待处理积压

### 1) INSERT 性能回归 Issue 需要优先跟进
- **Issue #19481** `[OPEN] slower performance of INSERT with 1.2.881`  
  链接: databendlabs/databend Issue #19481

该 Issue 创建于 2026-02-24，至今仍开放，且评论数达到 29。  
这是当前最值得维护者持续投入的积压问题，原因在于：
- 直接影响升级决策
- 影响核心写入链路
- 社区关注度高

---

### 2) Partitioned Hash Join PR 体量较大，需持续审阅
- **PR #19553** `[OPEN] support partitioned hash join`  
  链接: databendlabs/databend PR #19553

该 PR 自 2026-03-16 持续到现在，属于执行引擎层面的重大改造。  
建议维护者重点关注：
- benchmark 结果
- spill/partition 交互
- 分布式与单机行为一致性
- 回归测试覆盖面

---

### 3) Experimental table branch PR 可能成为中期路线图核心
- **PR #19551** `[OPEN] support experimental table branch`  
  链接: databendlabs/databend PR #19551

该功能影响 FUSE 元数据、GC、读写路径和表引用模型，复杂度高。  
建议维护者关注：
- 与已关闭 table tags 路线的关系说明
- 用户接口稳定性
- 元数据兼容与回收策略

---

## 总结

今天 Databend 的开发活动以**执行引擎修复与 SQL/表语义演进并行**为主要特征。短期内，聚合 spilling、MERGE 配置语义、UPDATE 权限策略等问题已有明确进展，显示核心稳定性持续改善；中期则可以看到 **partitioned hash join** 和 **experimental table branch** 正在成为路线图上的重要方向。  
当前最需要持续跟踪的风险点仍是 **INSERT 性能回归 Issue #19481**，它对用户升级信心和生产采用有直接影响。

如果你愿意，我还可以继续把这份日报整理成：
1. **适合发在微信群/飞书的 200 字简版**，或  
2. **适合管理层汇报的“风险-进展-建议”三段式周报风格**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

以下为 **Velox 项目动态日报（2026-03-28）**。

---

## 1. 今日速览

过去 24 小时 Velox 保持了较高开发活跃度：**Issues 更新 3 条、PR 更新 34 条**，其中 **6 条 PR 已合并/关闭**，说明项目仍处于持续迭代推进状态。  
从内容看，今日变更集中在 **构建系统/CI 可观测性提升、连接器运行时统计增强、SQL 时间语义修复、GPU/cuDF 能力补齐** 几个方向，既有基础设施建设，也有面向查询正确性和性能的改进。  
社区讨论热点依然聚焦于 **cuDF GPU 执行栈统一与算子补齐**、**Parquet/Thrift 依赖演进**，这反映出 Velox 正在继续向异构执行与更灵活存储生态兼容推进。  
整体健康度评价：**活跃、稳健，且偏向工程质量提升期**；短期内可预期会看到更多围绕构建分析、GPU operator coverage、类型/时间语义兼容性的落地合并。

---

## 2. 项目进展

### 今日已合并 / 关闭的重要 PR

#### 2.1 清理 IndexLookupJoin 统计拆分逻辑
- **PR**: #16939 `refactor: Clean up IndexLookupJoin stats splitting`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16939

**进展解读：**  
该变更将 `IndexSource` 相关统计常量从实现文件匿名命名空间迁移到 `Connector.h` 中的类定义内，并整理注释风格。  
虽然这是一次偏重构性质的合并，但它直接服务于 **IndexLookupJoin / IndexSource 统计指标的规范化**，为后续：
- 连接器指标统一暴露，
- 查询剖析更稳定，
- 存储索引访问链路的性能定位  
打下基础。

这类工作通常是后续性能诊断与 connector runtime stats 扩展的前置步骤，与今日仍在推进的 #16926 形成呼应。

---

#### 2.2 通过 CMake FILE_SET 跟踪头文件归属
- **PR**: #16897 `build: Track header files in CMake targets via FILE_SET`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16897

**进展解读：**  
该 PR 将头文件正式纳入 CMake target 管理，而不再依赖脆弱的 glob 安装方式。其价值主要体现在：
- 让 **CMake File API** 能识别 header ownership；
- 为 PR 级别的 **build impact analysis** 提供更准确依赖关系；
- 降低大型重构时“改了一个头文件却不清楚影响哪些 target”的维护成本。

这属于典型的 **构建系统可维护性升级**。结合仍在进行中的 #16827，可以看出 Velox 正在构建更智能的 PR 影响分析体系，有利于减少 CI 资源浪费并缩短反馈周期。

---

#### 2.3 Session / Connector config fallback 辅助逻辑落地
- **PR**: #16687 `refactor: Add helper for session and connector config fallback with auto-inferred keys`
- **状态**: 已合并
- **链接**: facebookincubator/velox PR #16687

**进展解读：**  
该变更解决配置回退逻辑分散的问题，引入自动推断 key 的 helper。  
对用户和引擎集成方而言，这意味着：
- session 级与 connector 级配置读取逻辑更统一；
- 减少配置项重复定义与遗漏；
- 有助于未来扩展更多连接器 / 存储后端时保持配置行为一致。

这类改进虽然不直接新增 SQL 功能，但对 **多 connector 运行时配置一致性** 和 **系统可运维性** 很关键。

---

#### 2.4 CI 任务清理与依赖下载优化
- **PR**: #16784 `refactor(ci): Cleanup CI job and switch some deps to wget`
- **状态**: 已关闭/合并
- **链接**: facebookincubator/velox PR #16784

**进展解读：**  
PR 主要清理 CI job，并将部分依赖获取方式改为 `wget` 以加快下载。  
这说明维护者仍在持续优化 CI 吞吐与稳定性，间接收益包括：
- 更快的 PR 反馈循环；
- 降低外部依赖安装波动；
- 提升贡献者提交流程体验。

---

### 值得关注的在途 PR

#### 2.5 PR 级 build impact analysis 工作流
- **PR**: #16827
- **状态**: Open
- **链接**: facebookincubator/velox PR #16827

这是今日最具平台工程意义的在途 PR 之一。它尝试结合 **CMake File API + `g++ -MM` 头文件依赖扫描**，推断一个 PR 实际影响到哪些 target。  
若合并，Velox 的 CI 很可能进入更精细化执行阶段，对大型 C++ 项目尤其有价值。

---

#### 2.6 Hive 索引链路 runtime stats 增强
- **PR**: #16926
- **状态**: Open
- **链接**: facebookincubator/velox PR #16926

该 PR 为 `HiveIndexSource` 和 `FileIndexReader` 增加运行时性能指标，包括查找耗时与结果准备耗时。  
这将进一步提升 **索引查找型查询** 的可观测性，对排查 Hive connector 读取性能瓶颈很重要。

---

#### 2.7 make_timestamp 边界校验修复
- **PR**: #16944
- **状态**: Open
- **链接**: facebookincubator/velox PR #16944

修复 `make_timestamp` 对 `hour=24`、`minute=60` 的 off-by-one 校验错误。  
这是一个典型的 **SQL 语义正确性修复**，如果不修，可能导致非法输入被错误接受并生成不正确时间戳。

---

#### 2.8 GPU 算子补齐：CudfEnforceSingleRow
- **PR**: #16920
- **状态**: Open
- **链接**: facebookincubator/velox PR #16920

该 PR 为 scalar subquery 场景增加 GPU 版本 `EnforceSingleRow`，目标是减少 CPU fallback，维持 GPU pipeline 连续性。  
这与长期 issue #15772 明确关联，是 Velox-cuDF 路线上的实质推进。

---

## 3. 社区热点

### 3.1 统一 cuDF operators 基类架构
- **Issue**: #16885 `[enhancement] Unify cuDF operators with a common base class architecture`
- **评论**: 11
- **链接**: facebookincubator/velox Issue #16885

**热点分析：**  
这是今日最活跃的 Issue。核心诉求是将 `CudfTopN`、`CudfLimit`、`CudfOrderBy` 等 GPU operator 从当前各自直接继承 `exec::Operator`/`NvtxHelper` 的方式，统一到一个公共基类架构中。  

**背后技术诉求：**
- 减少重复实现与样板代码；
- 统一 GPU operator 生命周期、配置与 tracing 行为；
- 为未来快速扩展更多 GPU 算子提供可复用骨架；
- 降低 CPU/GPU 双路径维护成本。

这表明 Velox 的 cuDF 集成已经从“功能可用性补齐”逐步进入“架构收敛与可维护性优化”阶段。

---

### 3.2 Parquet 支持 FBThrift、去除 thrift 依赖
- **Issue**: #13175 `Add support for FBThrift in Parquet and remove thrift dependency`
- **评论**: 10
- **👍**: 1
- **链接**: facebookincubator/velox Issue #13175

**热点分析：**  
这是一个存续时间较长但仍持续活跃的议题，说明用户对 **Parquet reader 依赖治理** 很关注。  

**背后技术诉求：**
- 减少原生 Parquet reader 对 thrift 的直接依赖；
- 与 Meta/FB 内部或相关生态中的 FBThrift 使用路径更一致；
- 为未来 remote function execution 等能力减少依赖冲突和二进制复杂度。

这类问题通常不会快速落地，但一旦推进，会影响到 **构建依赖、部署体积、兼容性策略**，因此属于重要路线图信号。

---

### 3.3 cuDF 在 Presto TPC-DS 场景下补齐更多 GPU operator
- **Issue**: #15772 `[enhancement] [cuDF] Expand GPU operator support for Presto TPC-DS`
- **评论**: 8
- **链接**: facebookincubator/velox Issue #15772

**热点分析：**  
该 Issue 指向一个非常具体的真实场景：在 Presto TPC-DS SF100、单 worker、启用 cuDF backend 且允许 CPU fallback 时，部分查询仍因缺失 GPU operator 而回退。  

**背后技术诉求：**
- 提升 Presto + Velox-cuDF 对分析型基准查询的 GPU 覆盖率；
- 减少 driver adapter 中 CPU fallback 发生率；
- 避免 host/device 切换带来的性能损失。

今日 PR #16920 已与之直接关联，说明这不是停留在需求层面的讨论，而是正在逐步交付。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### 高优先级：SQL 时间构造函数正确性问题
- **PR**: #16944 `fix: Off-by-one boundary bug in make_timestamp validation`
- **状态**: Open，已有修复
- **链接**: facebookincubator/velox PR #16944

**问题描述：**  
`make_timestamp` 对小时和分钟的边界校验使用了 `>` 而非 `>=`，导致 `hour=24`、`minute=60` 这样的非法值可能未被拒绝。  

**影响评估：**
- 直接影响 SQL 函数结果正确性；
- 可能造成错误时间戳进入下游计算；
- 对依赖严格 SQL/Presto 语义兼容的引擎集成方影响较大。

**结论：**  
这属于 **查询正确性缺陷**，虽非崩溃类问题，但优先级应较高。好消息是已有明确 fix PR。

---

### 中优先级：cuDF 复杂类型名称转换问题
- **PR**: #16818 `fix(cudf): Fix complex data type name in format conversion and add tests(Part1)`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16818

**问题描述：**  
修复 cuDF 在格式转换中复杂数据类型名称处理的问题，并补充测试。摘要中还明确指出当前 `map` 暂不支持。  

**影响评估：**
- 影响 GPU 路径复杂类型兼容性；
- 可能导致特定 schema 在 GPU 处理时类型映射错误；
- 对试图将复杂类型工作负载迁移到 GPU 的用户影响较直接。

---

### 中优先级：GPU operator 缺失导致 CPU fallback
- **Issue**: #15772
- **相关修复进展**: #16920
- **链接**: facebookincubator/velox Issue #15772 / PR #16920

**问题描述：**  
不是单点 bug，而是功能缺口导致的稳定性/性能问题：当 operator 缺失时，查询退回 CPU 路径。  

**影响评估：**
- 不一定影响结果正确性；
- 但会严重影响端到端性能预期；
- 在混合执行场景下还会带来额外复杂度与诊断成本。

---

## 5. 功能请求与路线图信号

### 5.1 cuDF 架构统一与 GPU 扩展仍是明确主线
- **Issue**: #16885
- **Issue**: #15772
- **PR**: #16920
- **PR**: #16535
- **链接**:
  - facebookincubator/velox Issue #16885
  - facebookincubator/velox Issue #15772
  - facebookincubator/velox PR #16920
  - facebookincubator/velox PR #16535

**判断：很可能持续纳入下一阶段版本。**  
原因：
- 既有架构类 enhancement（统一基类）；
- 也有直接补 operator coverage 的功能 PR；
- 还有配置体系拆分（系统级 / 查询级）的配套改造。  
这说明 GPU 执行栈不是试验性旁支，而是较明确的演进方向。

---

### 5.2 Parquet 写入格式兼容增强
- **PR**: #16941 `feat(parquet): Support config store decimal as integer for write parquet format`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16941

**路线图信号：**  
该 PR 试图支持按配置控制 Parquet decimal 的写出编码格式，以兼容 Spark/Flink/Hive 生态中的 legacy 行为。  

**判断：有较高纳入概率。**  
因为这类特性：
- 与跨引擎数据互操作强相关；
- 有清晰的现有生态先例；
- 能显著减少“Velox 写、Spark/Hive 读”或反向链路中的兼容问题。

---

### 5.3 TIMESTAMP WITH TIME ZONE 类型转换能力增强
- **PR**: #16823
- **状态**: Open
- **链接**: facebookincubator/velox PR #16823

**路线图信号：**  
为 `TIMESTAMP WITH TIME ZONE` 增加更完整 coercion/cast 规则，属于 SQL 类型系统完善的重要一步。  
这通常意味着 Velox 正继续增强与 Presto 语义的贴合度，对上层查询引擎兼容很关键。

---

### 5.4 新编码函数：Base32
- **PR**: #16235
- **PR**: #16176
- **状态**: Open
- **链接**:
  - facebookincubator/velox PR #16235
  - facebookincubator/velox PR #16176

**路线图信号：**  
`to_base32`/`from_base32` 及共用编码工具类改造仍在推进。  
这属于用户可见的新 SQL 函数能力，若合入，将丰富 Presto 风格二进制/编码函数集。

---

### 5.5 外部 Bloom Filter 集成接口
- **PR**: #16940 `feat(type): Add kCustomBloomFilter FilterKind for external bloom filters`
- **状态**: Open
- **链接**: facebookincubator/velox PR #16940

**路线图信号：**  
该 PR 明确提到与 Apache Gluten 的联动，目标是让外部 bloom filter 能下推到 Velox 子字段过滤系统。  
这说明 Velox 正在强化其作为 **执行引擎内核** 的生态嵌入能力，而不仅是独立系统组件。

---

## 6. 用户反馈摘要

基于今日活跃 Issues/PR，可提炼出以下真实用户痛点与场景：

### 6.1 GPU 路径“能跑”还不够，用户更在意连续性与覆盖率
- 关联：#15772, #16885, #16920  
用户不只是希望 cuDF 支持少量热点算子，而是希望在 TPC-DS 这类真实分析型工作负载中，**尽可能避免 CPU fallback**。  
这反映出实际使用中，性能瓶颈往往不是单个算子，而是 **异构执行链路中断**。

---

### 6.2 配置语义要能跨 session / connector / query 统一传播
- 关联：#16687, #16535  
用户和集成方显然在乎配置读取的一致性，尤其是：
- 不同 session 有不同 query config；
- connector 层和执行层需要合理 fallback；
- 避免 singleton 风格配置限制多租户/多会话场景。  

这说明 Velox 已更多运行在复杂服务化环境中，而非单一离线进程。

---

### 6.3 数据格式互操作性是核心诉求之一
- 关联：#13175, #16941  
用户关注 Parquet 的依赖治理和 decimal 写出兼容格式，说明典型场景是：
- Velox 与 Spark / Flink / Hive 混合使用；
- 对“写出来别人能不能稳定读”、“依赖会不会冲突”非常敏感。  

这类反馈通常来自生产环境，而不仅是实验性使用。

---

### 6.4 用户开始要求更好的可观测性与性能归因
- 关联：#16926, #16939, #16827  
从索引链路 runtime stats 到 PR 影响分析，社区对“看得见系统为何慢/为何编译慢/为何变更影响面大”的需求正在增加。  
这表明项目使用规模在扩大，工程效率问题正在成为一等公民。

---

## 7. 待处理积压

以下是值得维护者持续关注的长期或潜在积压项：

### 7.1 Parquet 与 FBThrift / thrift 依赖替换
- **Issue**: #13175
- **创建时间**: 2025-04-28
- **仍活跃**
- **链接**: facebookincubator/velox Issue #13175

**提醒：**  
该问题跨越时间较长，且仍持续讨论，说明其复杂度高、牵涉面广。建议维护者明确：
- 目标依赖策略；
- 分阶段迁移计划；
- 对现有 native parquet reader 的兼容边界。

---

### 7.2 GPU operator 覆盖率扩展
- **Issue**: #15772
- **创建时间**: 2025-12-15
- **链接**: facebookincubator/velox Issue #15772

**提醒：**  
虽然已有 #16920 等推进，但从问题描述看这是一个“任务集合型”议题，不会靠单个 PR 完成。建议维护者建立：
- operator gap checklist；
- 基准覆盖矩阵；
- CPU fallback 统计与优先级排序。

---

### 7.3 Iceberg 写入 benchmark 仍未落地
- **PR**: #16506 `perf: Add iceberg write benchmark`
- **创建时间**: 2026-02-24
- **状态**: Open
- **链接**: facebookincubator/velox PR #16506

**提醒：**  
Iceberg 是关键湖仓生态之一，写入 benchmark 对性能回归防护很有价值。该 PR 若长期悬而未决，会影响后续 writer 优化的基线建设。

---

### 7.4 Base32 能力相关 PR 存续时间较长
- **PR**: #16235
- **PR**: #16176
- **状态**: Open
- **链接**:
  - facebookincubator/velox PR #16235
  - facebookincubator/velox PR #16176

**提醒：**  
这类函数增强 PR 技术复杂度通常不高，但容易因风格或共用工具类设计问题长期搁置。建议维护者尽快明确：
- 是否接受 Base32 进入函数集；
- 共用编码工具类的最终抽象边界。

---

## 8. 结论

Velox 在 2026-03-28 这一天呈现出典型的 **高活跃、重工程质量、兼顾功能补齐** 的项目状态。  
短期最值得关注的主线有三条：

1. **构建与 CI 智能化**：#16897 已合并，#16827 在途，预示更精细的增量构建/测试分析能力。  
2. **GPU/cuDF 路线持续增强**：从架构统一 (#16885) 到 operator 补齐 (#16920, #15772) 再到配置整理 (#16535)，路线清晰。  
3. **SQL / 存储兼容性修复与增强**：包括 `make_timestamp` 正确性修复 (#16944)、Parquet decimal 格式兼容 (#16941)、TIMESTAMP WITH TIME ZONE coercion (#16823)。

整体看，Velox 当前不仅在“加新功能”，也在持续补强作为分析引擎底座所需的 **可维护性、可观测性与生态兼容性**。

如果你愿意，我还可以进一步把这份日报整理成：
- **适合飞书/Slack 发布的精简版**
- **面向管理层的 1 分钟摘要**
- **按“查询执行 / 存储格式 / GPU / CI”分类的表格版**

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持了较高开发活跃度：Issues 更新 4 条、PR 更新 22 条，其中 18 条仍在推进，4 条已合并或关闭。  
从变更内容看，今日重点集中在 **Velox 后端能力补齐、Spark 4.x 兼容性修复、GPU/CPU 混合部署适配** 以及 **查询正确性与工程构建改进**。  
社区同时呈现出较明确的路线图信号：一方面继续推进 `TIMESTAMP_NTZ`、`RESPECT NULLS` 等 Spark SQL 语义兼容；另一方面开始处理 GPU 依赖隔离、运行时检测、构建元信息暴露等可运维性问题。  
整体来看，项目健康度较好，但仍存在一些 **长期跟踪型问题** 与 **未及时合并的上游 Velox 依赖**，这会持续影响功能落地速度。

---

## 3. 项目进展

> 今日无新 Release。以下聚焦已关闭/完成流转的重要 PR 与正在推进的关键改动。

### 已关闭 / 完成流转的 PR

#### 1) 为 cudf/JDK17/CUDA12.9 增加构建镜像
- **PR**: #11836 `[BUILD, INFRA] [MINOR][VL] Add cudf build docker file with JDK 17 and cuda 12.9`
- **状态**: Closed
- **链接**: https://github.com/apache/incubator-gluten/pull/11836

**影响分析：**
该 PR 为 `apache/gluten:centos-9-jdk17-cuda12.9-cudf` 镜像补齐构建基础设施，说明项目正在强化 **GPU 加速链路的工程可用性**。  
虽然这是基础设施类改动，不直接改变查询语义，但它对后续 cudf 相关功能验证、CI 环境一致性和 GPU 后端复现问题排查很关键。

---

#### 2) `map_from_entries` 支持相关工作结束流转
- **PR**: #8731 `[CORE, VELOX] [VL] Support Spark map_from_entries function`
- **状态**: Closed
- **链接**: https://github.com/apache/incubator-gluten/pull/8731

**影响分析：**
该 PR 目标是补齐 Spark SQL 中 `map_from_entries` 函数在 Velox 路径下的支持，对 **复杂类型 SQL 兼容性** 是实质推进。  
不过摘要显示其依赖外部 Velox PR（facebookincubator/velox#11934），这再次反映出 Gluten 对上游 Velox 演进存在耦合：功能是否能稳定落地，取决于上游合并节奏。

---

#### 3) Spark 4.0/4.1 相关 UT 修复 PR 关闭
- **PR**: #11521 `[CORE, stale] [GLUTEN-11088][VL] Fix some UT for Spark40 and Spark41 (#11520)`
- **状态**: Closed
- **链接**: https://github.com/apache/incubator-gluten/pull/11521

**影响分析：**
这说明 Spark 4.x 适配仍处于持续清理阶段，一些历史修复 PR 已结束流转，但并不代表兼容性问题完全收敛。  
结合今日仍活跃的跟踪 issue #11550，可判断 **Spark 4.x 测试恢复工作仍是当前重要主线之一**。

---

### 今日值得关注的在途 PR

#### 4) 补齐 Spark SQL `RESPECT NULLS` 语义
- **PR**: #11837 `[VELOX] feat(velox): Support RESPECT NULLS for collect_list/collect_set`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11837

**价值：**
为 `collect_list/collect_set` 增加 `ignoreNulls` 参数，以支持 Spark 的 `RESPECT NULLS` 语法（SPARK-55256）。  
这属于 **SQL 语义精确对齐**，对聚合结果正确性很关键，尤其会影响数据治理、ETL 聚合和结果回归测试。

---

#### 5) `TIMESTAMP_NTZ` 基础支持继续推进
- **PR**: #11626 `[CORE, BUILD, VELOX, DATA_LAKE] [GLUTEN-11622][VL] Add basic TIMESTAMP_NTZ type support`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11626

**价值：**
这是当前最明确的 **类型系统兼容性增强** 之一。  
由于 Spark 与 Presto/Velox 对 timestamp 语义存在差异，该 PR 若落地，将显著改善 Spark SQL 在时间类型上的兼容与正确性，尤其是湖仓场景中的 schema 映射和跨系统读写。

---

#### 6) GPU 配置不可变 + CUDA 运行时检测
- **PR**: #11830 `[CORE, VELOX] [GLUTEN-11828][VL] Use immutable gpu config and add cuda runtime detection`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11830

**价值：**
这是面向 **异构部署稳定性** 的关键工程改动。  
它与新 issue #11844 指向同一类问题：避免 CPU 节点因为动态库依赖而错误加载 GPU 组件。若该 PR 合并，将直接提升 CPU/GPU 混合集群中的部署健壮性。

---

#### 7) Spark 4.x 测试套件恢复
- **PR**: #11833 `[CORE] [GLUTEN-11550][VL] Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11833

**价值：**
该 PR 已说明 150/150 测试通过，并给出根因：Gluten 在物理计划替换后没有完整传播 plan tag。  
这是 **Spark 4.x 兼容性回归修复** 的高价值进展，预示更多被禁用测试套件可能逐步恢复。

---

#### 8) Parquet 写入兼容性增强
- **PR**: #11839 `[CORE, VELOX] [VL] Support config velox parquet writer option storeDecimalAsInteger ...`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11839

**价值：**
该改动对齐 Spark 配置 `spark.sql.parquet.writeLegacyFormat`，属于 **存储格式兼容性修复**。  
对于依赖传统 Decimal 编码格式的下游系统，这是很实际的互操作性增强。

---

#### 9) 分区值解析中的格式化对象复用优化
- **PR**: #11843 `[VELOX, CLICKHOUSE] Move DateFormatter and TimestampFormatter creation out of partition value loops`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11843

**价值：**
将 `DateFormatter` / `TimestampFormatter` 的创建移出文件迭代内层循环，有望降低对象构造开销。  
这是典型的 **冷热路径微优化**，对大量分区文件扫描场景更有意义。

---

## 4. 社区热点

### 热点 1：未合入上游的 Velox PR 跟踪
- **Issue**: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **评论**: 16
- **👍**: 4
- **链接**: https://github.com/apache/incubator-gluten/issues/11585

**技术诉求分析：**
这是当前最具“路线图协调”性质的议题。Gluten 社区已经积累了一批对自身有价值、但尚未被 Velox 上游合并的 PR。  
背后的核心问题不是单点 bug，而是 **下游创新速度受制于上游合并节奏**。这会带来：
- 新功能难以正式启用；
- 维护分叉 patch 成本高；
- 某些 SQL 能力或性能优化长期停留在“可用但未主线化”状态。

这类 issue 的活跃，通常意味着项目正在进入 **上游协同与技术债治理并行** 的阶段。

---

### 热点 2：`TIMESTAMP_NTZ` 类型支持
- **Issue**: #11622 `[enhancement, good first issue] [VL] Support TIMESTAMP_NTZ Type`
- **评论**: 6
- **👍**: 2
- **关联 PR**: #11626
- **链接**: https://github.com/apache/incubator-gluten/issues/11622

**技术诉求分析：**
该议题聚焦 Spark 与 Presto/Velox 在 timestamp 语义上的差异，是 **跨引擎类型系统对齐** 的典型难题。  
用户诉求并不只是“增加一个类型”，而是要求：
- 在表达层、执行层、序列化层保持一致；
- 避免时区/本地时间语义错位；
- 确保与数据湖格式交互时行为可预测。

由于已有活跃 PR，对下一阶段纳入版本的可能性较高。

---

### 热点 3：Spark 4.x 禁用测试套件跟踪
- **Issue**: #11550 `[bug, triage, tracker] Spark 4.x: Tracking disabled test suites`
- **评论**: 6
- **链接**: https://github.com/apache/incubator-gluten/issues/11550

**技术诉求分析：**
这代表项目当前对 Spark 4.x 的策略不是“宣布支持即完成”，而是通过持续恢复 test suite 来实质收敛兼容性缺陷。  
这类 tracker issue 的存在通常说明：
- 功能表面可跑，但边界行为仍有偏差；
- 单元测试/集成测试中仍存在 abort、flaky 或 correctness 风险；
- 维护者希望以可认领、可拆分的方式推动社区贡献。

---

### 热点 4：CPU 节点误加载 GPU 库
- **Issue**: #11844 `[enhancement] [VL] Not load GPU libraries on CPU node`
- **创建时间**: 2026-03-27
- **链接**: https://github.com/apache/incubator-gluten/issues/11844

**技术诉求分析：**
这是今天最值得关注的新问题之一。  
用户反映 `libvelox.so` 链接 `cudf::cudf` 后，导致所有环境都尝试加载 CUDA 库，在 CPU 节点直接抛出异常。  
本质上是 **运行时依赖隔离设计问题**，不是简单缺包；它影响的是混合集群中的可部署性与节点角色解耦，属于平台级痛点。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：CPU 节点因 GPU 动态库依赖而启动/运行失败
- **Issue**: #11844 `[VL] Not load GPU libraries on CPU node`
- **链接**: https://github.com/apache/incubator-gluten/issues/11844
- **相关 PR**: #11830
- **PR 链接**: https://github.com/apache/incubator-gluten/pull/11830

**问题描述：**
当前 `libvelox.so` 因链接到 `cudf::cudf`，导致即使在 CPU-only 环境也会尝试加载 CUDA 相关库，从而触发异常。  

**影响：**
- 混合部署环境中 CPU 节点不可用或需额外绕过；
- 降低镜像与运行环境通用性；
- 增加运维复杂度。

**状态判断：**
已有方向性修复 PR（运行时检测、GPU 配置不可变），但从 issue 描述看，社区可能还需要进一步走向 **GPU 逻辑独立动态库拆分**。

---

### P1：Spark 4.x 存在被禁用的测试套件，兼容性尚未完全收敛
- **Issue**: #11550 `Spark 4.x: Tracking disabled test suites`
- **链接**: https://github.com/apache/incubator-gluten/issues/11550
- **相关 PR**: #11833
- **PR 链接**: https://github.com/apache/incubator-gluten/pull/11833

**问题描述：**
部分 Spark 4.0/4.1 测试套件此前被注释/禁用，需要逐项修复并重新启用。  

**影响：**
- Spark 4.x 支持成熟度仍需验证；
- 边界 SQL、计划标注传播、执行器行为等可能仍有回归风险。

**状态判断：**
已有积极进展，至少一个测试套件已恢复并全量通过，说明问题正在被系统性清理。

---

### P2：Native union 结果错误
- **PR**: #11832 `[VELOX] [VL] Fix native union use column type name as column name lead to result error`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11832

**问题描述：**
native union 在某些情况下将列类型名误作列名，进而造成结果错误。  

**影响：**
这是 **查询正确性问题**，优先级高于一般性能问题，尤其会影响 schema 对齐和结果集解析。

**状态判断：**
已有修复 PR，建议维护者优先评审。

---

### P2：异常被重复包装，影响调用方捕获与定位
- **PR**: #11841 `[CORE] Preserve exception type in ClosableIterator.translateException()`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11841

**问题描述：**
当前异常转换逻辑会把已有 RuntimeException 再包装成 `GlutenException`，造成双层包装。  

**影响：**
- 上层无法准确捕获特定异常类型；
- 诊断链路变差；
- 可能掩盖真实错误边界。

**状态判断：**
属于稳定性和可观测性增强，虽然不是结果错误，但对生产排障很重要。

---

### P3：广播构建缓存同步锁可能造成性能瓶颈
- **PR**: #11834 `[VELOX] Remove the synchronized lock in VeloxBroadcastBuildSideCache`
- **状态**: Open
- **链接**: https://github.com/apache/incubator-gluten/pull/11834

**问题描述：**
缓存实现中的同步锁可能限制并发性能。  

**影响：**
更偏向性能与可扩展性问题，可能出现在广播构建高并发场景。

---

## 6. 功能请求与路线图信号

### 1) `TIMESTAMP_NTZ` 支持
- **Issue**: #11622
- **PR**: #11626
- **Issue 链接**: https://github.com/apache/incubator-gluten/issues/11622
- **PR 链接**: https://github.com/apache/incubator-gluten/pull/11626

**判断：高概率纳入后续版本。**  
原因是需求明确、语义边界清晰、且已有实现 PR 持续推进。它是 Spark SQL 兼容性的关键拼图。

---

### 2) `collect_list/collect_set` 支持 `RESPECT NULLS`
- **PR**: #11837
- **链接**: https://github.com/apache/incubator-gluten/pull/11837

**判断：较高概率纳入后续版本。**  
这是标准 Spark 语义对齐，不属于实验性能力，且实现范围相对收敛，合并阻力较小。

---

### 3) CPU/GPU 依赖解耦与运行时检测
- **Issue**: #11844
- **PR**: #11830
- **Issue 链接**: https://github.com/apache/incubator-gluten/issues/11844
- **PR 链接**: https://github.com/apache/incubator-gluten/pull/11830

**判断：将成为近期工程重点。**  
这类问题直接影响部署模型，尤其是异构资源池环境；其优先级往往高于增量 SQL 函数支持。

---

### 4) Parquet Decimal 写入兼容配置
- **PR**: #11839
- **链接**: https://github.com/apache/incubator-gluten/pull/11839

**判断：有望进入近期版本。**  
因为它直接对齐 Spark 配置，用户收益明确，且属于低争议兼容性增强。

---

### 5) 暴露 Gluten build 信息到 Spark 配置
- **PR**: #11838
- **链接**: https://github.com/apache/incubator-gluten/pull/11838

**判断：很可能被接纳。**  
这是典型运维友好型改进，有助于线上问题定位、版本追踪和作业审计，风险较低。

---

## 7. 用户反馈摘要

基于今日 issue/PR 摘要，可提炼出以下真实用户痛点：

### 1) 混合部署场景下的“依赖污染”问题突出
- 代表链接: #11844  
  https://github.com/apache/incubator-gluten/issues/11844

用户并非单纯抱怨缺少 CUDA 库，而是在强调 **CPU 节点不应被迫承担 GPU 运行时依赖**。  
这说明 Gluten 已被用于更复杂的生产形态，而不是单一后端实验环境。

---

### 2) Spark SQL 语义一致性仍是核心诉求
- 代表链接: #11622, #11837  
  https://github.com/apache/incubator-gluten/issues/11622  
  https://github.com/apache/incubator-gluten/pull/11837

无论是 `TIMESTAMP_NTZ` 还是 `RESPECT NULLS`，本质上都指向一个问题：  
**用户希望 Gluten 在加速执行的同时，不牺牲 Spark 原生 SQL 语义的精确性。**

---

### 3) 用户愿意参与 Spark 4.x 兼容性共建，但需要更清晰的任务拆分
- 代表链接: #11550  
  https://github.com/apache/incubator-gluten/issues/11550

该 tracker issue 明确鼓励贡献者在 TODO 测试上认领任务，说明社区已经形成“把兼容性债务拆解为可贡献单元”的协作方式。  
这对开源项目健康度是正向信号。

---

### 4) 上游依赖未合并影响功能落地预期
- 代表链接: #11585  
  https://github.com/apache/incubator-gluten/issues/11585

用户和贡献者都在关注哪些 Velox PR 迟迟未进入上游。  
这表明社区对“功能可实现”与“功能可长期维护”之间的差别非常敏感。

---

## 8. 待处理积压

以下长期未完全收敛的问题/PR，建议维护者持续关注：

### 1) 上游 Velox 未合并 PR 跟踪
- **Issue**: #11585
- **链接**: https://github.com/apache/incubator-gluten/issues/11585

**关注原因：**
这是影响多个功能落地速度的“总开关”型问题。若长期积压，Gluten 将持续承担 patch rebase 成本。

---

### 2) `TIMESTAMP_NTZ` 支持仍未合并
- **Issue**: #11622
- **PR**: #11626
- **链接**:  
  https://github.com/apache/incubator-gluten/issues/11622  
  https://github.com/apache/incubator-gluten/pull/11626

**关注原因：**
类型系统兼容性属于基础能力，拖延越久，相关表达式、数据源和测试覆盖的后续工作越难并行推进。

---

### 3) IWYU 工具接入仍在开放状态
- **PR**: #11287 `[BUILD, VELOX, INFRA] Use IWYU tool to check code format`
- **链接**: https://github.com/apache/incubator-gluten/pull/11287

**关注原因：**
这是长期开放的工程治理 PR。若能推进，将改善头文件依赖管理、缩短编译/维护成本，但通常容易因收益不够显性而被延后。

---

### 4) `collect_list` 全面测试覆盖 PR 处于 stale
- **PR**: #11526 `[stale, VELOX] Add comprehensive collect_list tests for type coverage and fallback`
- **链接**: https://github.com/apache/incubator-gluten/pull/11526

**关注原因：**
当前正有 #11837 推进 `collect_list/collect_set` 的 null 语义支持，此时更需要完整测试矩阵。  
建议将功能 PR 与测试覆盖 PR 联动评审，避免语义补齐后测试仍不足。

---

### 5) UnsupportedOperators 报告统计膨胀问题仍未收敛
- **PR**: #11395 `[stale, TOOLS] Operator Count Inflation in UnsupportedOperators Report`
- **链接**: https://github.com/apache/incubator-gluten/pull/11395

**关注原因：**
这是工具链可信度问题。若 unsupported operator 统计失真，会误导兼容性评估和优化优先级判断。

---

## 总结判断

今天的 Apache Gluten 重点不是版本发布，而是 **兼容性、稳定性和部署工程化能力的持续补强**。  
从信号上看，项目近期最值得跟踪的三条主线是：

1. **Spark 4.x 兼容性收敛**：以恢复禁用测试套件为标志，正在从“能运行”走向“可验证”。  
2. **Velox 语义补齐**：`TIMESTAMP_NTZ`、`RESPECT NULLS`、`map_from_entries` 等反映出 SQL 兼容面持续扩张。  
3. **异构部署可用性**：GPU 依赖隔离、CUDA 运行时检测、构建镜像完善，说明项目正向生产环境复杂部署迈进。

整体健康度：**中上，活跃且方向清晰；主要风险在于上游 Velox 依赖与部分长期积压 PR 的推进速度。**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报 — 2026-03-28

## 1. 今日速览

过去 24 小时 Apache Arrow 保持较高活跃度：Issues 更新 36 条、PR 更新 18 条，且关闭/合并节奏稳定，说明社区在持续清理积压问题并推进功能落地。  
今日没有新版本发布，但 Python、Parquet、Flight SQL ODBC、R 生态和 CI 稳定性都有明显动态，尤其是 Python 算术运算支持刚落地后，相关后续设计讨论迅速升温。  
从主题分布看，当前开发重心集中在三条主线：**Python 易用性增强**、**Parquet 能力补强（Bloom Filter/元数据）**、**Flight SQL ODBC 跨平台落地**。  
整体健康度评价为：**活跃且稳健**，但 CI/打包链路、Windows/R 兼容性和部分长期 stale 问题仍值得持续关注。

---

## 3. 项目进展

### 已合并/关闭的重要 PR 与 Issue

#### 3.1 Python 原生算术运算支持正式落地
- PR: #48085 `[Python] Support arithmetic on arrays and scalars`（已关闭，视为完成）
- Issue: #32007（已关闭）
- 链接: `apache/arrow PR #48085` / `apache/arrow Issue #32007`

这是今天最重要的功能进展之一。PyArrow 现在已支持数组和标量上的 Python 原生算术操作（如 `arr + 2`、`arr + arr`），明显降低了用户必须转向 `pyarrow.compute` API 的门槛。  
对分析引擎和上层数据框架用户而言，这属于**表达式可用性与开发体验增强**，虽然不是 SQL 引擎特性本身，但会直接影响 Python 侧列式计算的可组合性。

**进一步影响：**
- 推动 PyArrow 从“显式 compute API”向“更自然的列运算语义”演进
- 为后续布尔运算、比较运算、一致性语义调整铺路
- 已直接引出多个 follow-up 议题（见后文社区热点）

---

#### 3.2 Parquet 加密 Bloom Filter 读取能力完成
- PR: #49334 `GH-48334: [C++][Parquet] Support reading encrypted bloom filters`（已关闭）
- Issue: #48334（已关闭）
- 链接: `apache/arrow PR #49334` / `apache/arrow Issue #48334`

该改动实现了**对加密 Parquet 文件中 Bloom Filter 的读取支持**。此前遇到加密 Bloom Filter 时会直接抛异常，现在则补齐了头部与 bitset 分别解密的反序列化流程。

**技术意义：**
- 增强 Arrow 对企业级安全 Parquet 数据集的读取兼容性
- 使 Parquet Bloom Filter 在“加密 + 谓词裁剪”场景下更接近可用
- 对依赖 Parquet 作为分析型存储格式的查询引擎而言，这是典型的**存储格式能力补齐**

---

#### 3.3 R 端 dplyr 兼容性增强
- PR: #49535 `GH-49533: [R] Implement dplyr's when_any() and when_all() helpers`（已关闭）
- Issue: #49533（已关闭）
- 链接: `apache/arrow PR #49535` / `apache/arrow Issue #49533`

Arrow R 包新增对 `dplyr::when_any()` / `when_all()` 的支持。  
这属于**上层分析语义兼容性改进**，会增强 Arrow 作为 R 分析后端时对 tidyverse 工作流的承接能力。

---

#### 3.4 R 稀疏 CSV 推断错误提示改进
- PR: #49338 `GH-35806: [R] Improve error message for null type inference with sparse CSV data`（已关闭）
- Issue: #35806（已关闭）
- 链接: `apache/arrow PR #49338` / `apache/arrow Issue #35806`

该修复不改变底层推断逻辑，但改善了稀疏数据 CSV 场景下误导性的错误信息。  
这对数据导入体验很重要，尤其是湖仓场景中存在“前部全空、后部才出现非空值”的宽表或日志表。

---

#### 3.5 Parquet Row Group 大小控制讨论进入 API 补强阶段
- PR: #49527 `GH-48467: [C++][Parquet] Add BufferedStats API to RowGroupWriter`（已关闭）
- Issue: #48467（已关闭）
- 链接: `apache/arrow PR #49527` / `apache/arrow Issue #48467`

虽然原始诉求是“按字节大小限制 row group”，最终关闭路径体现为先暴露 `BufferedStats` API，供上层自行决策是否切换 row group。  
这不是完全自动化的 row-group-size 控制，但它为**写路径上的存储布局调优**提供了关键观测能力。

---

## 4. 社区热点

### 4.1 Python `__eq__` 行为变更讨论升温
- Issue: #48409 `[Python] Change the behaviour of __eq__`
- 评论: 14
- 链接: `apache/arrow Issue #48409`

这是当前最热讨论。随着 Python 原生算术运算落地，社区开始重新审视 `__eq__` 的语义：  
是继续保留当前对象级比较行为，还是转向基于 kernel 的逐元素比较（类似 `pyarrow.compute.equal`）？

**背后技术诉求：**
- Python 用户期望 Arrow Array 更像 NumPy/Pandas 一样工作
- 但逐元素比较会影响已有代码对真值、布尔上下文、对象身份比较的假设
- 本质是 **“Pythonic 易用性” 与 “API 稳定性/历史语义”** 之间的权衡

这很可能成为下一阶段 PyArrow API 设计的核心议题之一。

---

### 4.2 DLPack 扩展到 FixedShapeTensor 与导入路径
- Issue: #38868 `[C++][Python] DLPack on FixedShapeTensorArray/FixedShapeTensorScalar`
- 评论: 11
- 链接: `apache/arrow Issue #38868`

- Issue: #39295 `[C++][Python] DLPack implementation for Arrow Arrays (consuming)`
- 链接: `apache/arrow Issue #39295`

社区正在持续推进 Arrow 与深度学习/张量生态的互操作，特别是：
- Arrow Array 导出到 DLPack
- FixedShapeTensorArray / Tensor 支持 DLPack
- Arrow 消费其他框架导出的 DLPack 张量

**技术含义：**
这不仅是 Python 特性，而是 Arrow 向**张量数据交换层**演进的重要信号，利好与 PyTorch、JAX、CuPy 等生态集成。

---

### 4.3 Flight SQL ODBC 跨平台支持持续推进
- PR: #46099 `[C++] Arrow Flight SQL ODBC layer`
- PR: #49564 `[C++][FlightRPC] Add Ubuntu ODBC Support`
- PR: #49603 `[C++][FlightRPC] Windows CI to Support ODBC DLL & MSI Signing`
- PR: #49585 `DRAFT: set up static build of ODBC FlightSQL driver`
- 链接: `apache/arrow PR #46099` / `apache/arrow PR #49564` / `apache/arrow PR #49603` / `apache/arrow PR #49585`

虽然今天没有合并，但从 PR 聚集度看，**Flight SQL ODBC 驱动**是非常明确的投资方向。  
Windows 下聚焦签名与产物交付，Ubuntu 下聚焦 ODBC 构建与注册，说明项目正在向“可交付、可安装、可被 BI 工具消费”的阶段推进。

**对 OLAP/查询引擎生态的意义：**
- 提升 Arrow Flight SQL 作为数据库/查询服务接入层的企业可用性
- 有利于连接 BI 客户端、ODBC 工具链和异构 SQL 引擎
- 属于典型的**连接器与 SQL 接入能力建设**

---

### 4.4 Pandas DataFrame interchange 协议弃用带来的后续调整
- Issue: #49600 `[Python] Pandas is deprecating dataframe interchange protocol`
- 评论: 3
- 链接: `apache/arrow Issue #49600`

Pandas 正在弃用 dataframe interchange protocol，Arrow 需要调整 `pyarrow.interchange` 的相关逻辑或文档路径。  
这反映出 Arrow 作为数据交换标准层，必须跟上上游框架接口变化，否则测试与用户体验都会受到影响。

---

## 5. Bug 与稳定性

以下按严重程度与潜在影响排序：

### 5.1 高优先级：Linux 打包链路构建失败（aws-lc / C23）
- Issue: #49601 `[CI][Packaging] ubuntu-resolute Linux fail building aws-lc`
- PR: #49604 `[C++] Update bundled AWS SDK C++ for C23`
- 链接: `apache/arrow Issue #49601` / `apache/arrow PR #49604`

**问题：**
Ubuntu resolute（amd64/arm64）构建 aws-lc 失败，影响 Linux 打包和依赖链稳定性。  
**影响面：**
- 包构建、发布流程
- 依赖 S3 / AWS 相关功能的发行链路
- 新编译器/新标准兼容性

**状态：**
已有修复 PR #49604，方向是升级 bundled AWS SDK C++ 相关组件以适配 C23。

---

### 5.2 高优先级：Windows R Release CI 因测试桶失效失败
- Issue: #49609 `[CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found`
- PR: #49610
- 链接: `apache/arrow Issue #49609` / `apache/arrow PR #49610`

**问题：**
Windows AMD64 的 R release CI 因 S3 测试 bucket 不存在而失败。  
**性质：**
更偏基础设施/测试环境问题，不是核心引擎逻辑错误，但会阻断发布验证。  
**状态：**
已有对应修复 PR #49610，更新 bucket 配置。

---

### 5.3 中优先级：MinGW 下 `arrow-json-test` 间歇性崩溃
- PR: #49462 `[C++][CI] Fix intermittent segfault in arrow-json-test with MinGW`
- 关联 Issue: #49272
- 链接: `apache/arrow PR #49462`

**问题：**
Windows MinGW CI 中 `arrow-json-test` 在并行 chunk 读取测试里出现间歇性 segfault。  
**风险：**
- 可能掩盖真实回归
- 降低 CI 结果可信度
- 暗示 JSON reader 并行路径在特定 ABI/工具链组合下存在不稳定性

**状态：**
修复 PR 已在等待 committer review。

---

### 5.4 中优先级：CMake 4.x 下文档命令失效
- Issue: #49605 `Inspecting cmake presets options not available in cmake 4.x`
- 链接: `apache/arrow Issue #49605`

**问题：**
开发文档中建议的 `cmake --preset -N ...` 在 CMake 4.2.3 下无输出。  
**影响：**
主要影响开发者构建体验与文档准确性，不属于运行时 bug。  
**建议：**
尽快修正文档并兼容新 CMake 行为。

---

### 5.5 中低优先级：R 元数据告警
- Issue: #48712 `[R] "Invalid metadata$r" warning`
- PR: #49608
- 链接: `apache/arrow Issue #48712` / `apache/arrow PR #49608`

**问题：**
Schema -> Table -> data.frame 转换过程中出现 `Invalid metadata$r` 告警。  
**状态：**
已有修复 PR #49608，改用 `to_data_frame()` 路径规避 placeholder 问题。

---

### 5.6 存量兼容性问题：扩展类型 + 字典 IPC 失败
- Issue: #20196 `[C++][Python] IPC failure for dictionary with extension type with struct storage type`
- 链接: `apache/arrow Issue #20196`

这是一个长期存在的结构化扩展类型 / IPC roundtrip 兼容性问题，影响复杂 schema 的跨进程、跨文件交换稳定性。虽非今日新报，但今日仍有更新，值得持续关注。

---

## 6. 功能请求与路线图信号

### 6.1 Python 算术能力的第二阶段增强
- Issue: #49606 `[Python] Possible follow-up on arithmetic support`
- Issue: #48409 `[Python] Change the behaviour of __eq__`
- 链接: `apache/arrow Issue #49606` / `apache/arrow Issue #48409`

随着 #48085 完成，后续可能进入：
- `&` / `|` 布尔运算语义补充
- `__eq__` 比较行为重设计
- 更多算术/逻辑运算一致性补齐

**判断：**
这批功能进入下一版本的概率较高，因为主干能力已完成，剩余多为语义扩展和 API 打磨。

---

### 6.2 PyArrow 写 Parquet Bloom Filter 能力接近落地
- PR: #49377 `[Python][Parquet] Add ability to write Bloom filters from pyarrow`
- 链接: `apache/arrow PR #49377`

当前状态为 `awaiting merge`，说明成熟度较高。  
如果合并，PyArrow 将具备更完整的 Parquet Bloom Filter 写入控制能力，和今天关闭的“加密 Bloom Filter 读取支持”一起，形成较完整的 Bloom Filter 能力面。

**判断：**
非常可能进入下一版本，属于**Parquet 写优化与谓词过滤基础设施增强**。

---

### 6.3 R 生态云存储连接器扩展：Azure Blob
- PR: #49553 `[R] Expose azure blob filesystem`
- 链接: `apache/arrow PR #49553`

Arrow C++ 和 PyArrow 已有 Azure 支持，R 端补齐后将明显改善多云对象存储访问一致性。  
**判断：**
若评审顺利，进入下个版本的可能性较高，属于**连接器/文件系统能力补齐**。

---

### 6.4 Flight SQL ODBC 将成为中期重点
- PR: #46099 / #49564 / #49603 / #49585
- 链接: 见上文

这些 PR 同时覆盖：
- 驱动层实现
- Ubuntu 支持
- Windows 签名与打包
- 静态构建测试

**判断：**
虽然单个 PR 仍在 review，但从密集投入看，**Flight SQL + ODBC 的跨平台可交付**是明确路线图信号，适合数据库厂商和 BI 集成方重点跟踪。

---

### 6.5 FlatBuffers 元数据进入 Parquet footer 的探索继续
- PR: #48431 `[C++][Parquet] flatbuffers metadata integration`
- 链接: `apache/arrow PR #48431`

这是一个更偏中长期、架构层的工作，可能影响 Parquet 元数据的扩展方式与访问效率。  
短期看未必立即进入发布，但值得关注其对元数据可扩展性和生态兼容性的影响。

---

## 7. 用户反馈摘要

结合今日活跃议题，可以提炼出几类典型用户痛点：

### 7.1 用户希望 PyArrow 更像“原生分析数组库”
相关：
- #32007
- #48409
- #49606

用户并不满足于通过 `pyarrow.compute` 间接完成列计算，而是希望：
- 直接写 `arr + 1`
- 直接比较 `arr == other`
- 逻辑与布尔表达式语义自然

这说明 PyArrow 的用户群体正从“熟悉 Arrow 内核的专业开发者”扩展到“期望类似 NumPy/Pandas 体验的普通数据工程/分析用户”。

---

### 7.2 用户希望对象存储与云能力在各语言绑定中保持一致
相关：
- #49553
- #49609
- #49601

R 用户对 Azure Blob 文件系统暴露、Windows R CI 的云测试稳定性都很敏感。  
这说明 Arrow 在真实生产场景中不仅是内存格式库，更是**跨云数据访问层**，而语言绑定能力不对齐会直接影响采用率。

---

### 7.3 用户对 Parquet 写入布局与过滤能力更关注“可控性”
相关：
- #48467
- #49377
- #48334

用户关注的不只是能不能读写 Parquet，而是：
- row group 怎么控制
- Bloom Filter 能否写出
- 加密文件里 Bloom Filter 能否读取

这说明 Arrow 用户已经进入更成熟的性能优化阶段，开始围绕**扫描效率、存储布局、谓词下推辅助结构**提出更细粒度诉求。

---

### 7.4 开发者对构建系统和工具链兼容性意见增加
相关：
- #49605
- #49601
- #49462
- #40163

从 CMake 4.x、C23、MinGW、setuptools_scm API 依赖等问题看，Arrow 的外部构建/打包生态复杂度正在上升。  
这类问题虽不直接改变查询语义，但会显著影响贡献效率和发布可靠性。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期问题/PR：

### 8.1 长期开放：DLPack 与张量互操作路线
- Issue: #38868
- Issue: #39295
- 链接: `apache/arrow Issue #38868` / `apache/arrow Issue #39295`

这类问题代表 Arrow 向张量/AI 生态扩展的重要方向，建议尽快明确 API 边界与优先级，避免长期停留在讨论阶段。

---

### 8.2 长期开放：Table.cast 灵活性不足
- Issue: #27425 `[Python] Make Table.cast(schema) more flexible regarding order of fields / missing fields?`
- 链接: `apache/arrow Issue #27425`

该问题存在多年，仍在影响 schema 演进与数据对齐场景的易用性。  
对实际 ETL、宽表 schema 调整、跨系统字段顺序差异等场景都很常见，建议提高优先级。

---

### 8.3 长期开放：Scalar 构造器可调用性
- Issue: #31648 `[Python] Scalar constructors should be callable`
- 链接: `apache/arrow Issue #31648`

这是典型的 Python API 可用性问题，虽不算 blocker，但长期影响高级类型构造体验。

---

### 8.4 长期开放：IPC + ExtensionType + Struct 存储类型兼容
- Issue: #20196
- 链接: `apache/arrow Issue #20196`

这是更偏底层格式兼容性的遗留问题，对复杂类型持久化可靠性有持续影响，建议不要因评论不多而忽视。

---

### 8.5 长期开放：新一代 Hash Join 能力补齐
- Issue: #31641 `[C++] Add backpressure to hash-join node`
- Issue: #31622 `[C++] Add hash-join support for large-offset types ...`
- 链接: `apache/arrow Issue #31641` / `apache/arrow Issue #31622`

这两项直接关系到执行引擎层面的健壮性与类型覆盖：
- backpressure 关系到资源控制与流式执行稳定性
- large offsets / dictionary keys 支持关系到 join 的类型完备性

对 OLAP 引擎用户而言，这比普通 API 易用性问题更接近核心执行能力，建议重新评估优先级。

---

## 附：今日重点链接清单

- Python 算术运算支持完成：`apache/arrow PR #48085`
- Python `__eq__` 语义讨论：`apache/arrow Issue #48409`
- DLPack / Tensor 扩展：`apache/arrow Issue #38868`
- DLPack consuming：`apache/arrow Issue #39295`
- Parquet 加密 Bloom Filter 读取：`apache/arrow PR #49334`
- PyArrow 写 Bloom Filter：`apache/arrow PR #49377`
- Flight SQL ODBC 主线：`apache/arrow PR #46099`
- Ubuntu ODBC 支持：`apache/arrow PR #49564`
- Windows ODBC 签名 CI：`apache/arrow PR #49603`
- Linux aws-lc/C23 构建修复：`apache/arrow PR #49604`
- Windows R CI bucket 修复：`apache/arrow PR #49610`
- R Azure Blob filesystem：`apache/arrow PR #49553`

如果你愿意，我还可以继续把这份日报整理成更适合内部周报/飞书消息的 **“精简版（TL;DR）”** 或 **“按 OLAP/存储/连接器 分类版”**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*