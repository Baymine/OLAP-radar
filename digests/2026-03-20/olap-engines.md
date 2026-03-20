# Apache Doris 生态日报 2026-03-20

> Issues: 11 | PRs: 145 | 覆盖项目: 10 个 | 生成时间: 2026-03-20 01:18 UTC

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

# Apache Doris 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时内，Apache Doris 保持了**高活跃度**：Issues 更新 11 条，PR 更新 145 条，其中 72 条已合并或关闭、73 条仍在推进，说明社区开发与分支回捞节奏都很快。  
今天没有新版本发布，但从 PR 走势看，**4.0.x / 4.1.x 分支的稳定性修复、数据湖能力增强、认证体系扩展**是最明确的推进方向。  
查询引擎侧，围绕 `GROUP BY count(*)`、递归 CTE、Nereids/外表扫描链路的优化仍在持续；存储与连接器侧，则聚焦 **MaxCompute、Hudi、Paimon、Iceberg、云环境 schema change/compaction**。  
同时，社区也暴露出若干值得关注的问题：**视图 ORDER BY 触发错误列裁剪、4.0.4 Docker 镜像仅 ARM64、前端元数据函数 CurrentConnected 语义错误**，反映出 SQL 正确性和交付制品兼容性仍是近期稳定性重点。

---

## 2. 项目进展

以下为今日较值得关注的已合并/关闭 PR，以及它们代表的能力推进方向。

### 2.1 SQL/元数据正确性修复

- **#61087 [fix] Preserve CurrentConnected in frontends() TVF**  
  链接: apache/doris PR #61087  
  该修复解决了 `FRONTENDS()` 元数据表值函数在某些路径下丢失 `currentConnectedFE` 上下文的问题，导致 `WHERE CURRENTCONNECTED='Yes'` 总是错误匹配 master FE。  
  这属于**元数据查询正确性修复**，尤其影响运维排障、集群状态判断以及依赖 TVF 的自动化脚本。  
  该修复已继续向分支回捞：
  - **#61532** branch-4.0 回捞  
  - **#61533** branch-4.1 回捞

- **#58413 [fix](hudi) Fix Hudi query error "do not support DLA type HUDI"**  
  链接: apache/doris PR #58413  
  修复 `LogicalHudiScan` 在优化阶段未正确覆写 `withTableAlias()` / `withCachedOutput()`，导致 HUDI 表类型信息丢失并被错误当作 `PhysicalFileScan` 处理。  
  这是典型的**外表/数据湖查询正确性问题修复**，表明 Doris 在多 catalog 和湖仓查询优化链路上仍在快速补齐边角行为。

### 2.2 CI 与分支治理

- **#61364 [opt](ci) add required ci for branch-4.1**  
  链接: apache/doris PR #61364  
  为 `branch-4.1` 增加 required CI，说明 4.1 分支正在进入更严格的门禁阶段。  
  这通常是分支成熟度提升的信号，有助于降低回归风险。

- **#61530 [chore](ci) Add timeout and improve error handling for OpenCode review workflow**  
  链接: apache/doris PR #61530  
  增加超时与错误处理，虽不直接改变数据库能力，但能提升开发流程稳定性，减少机器人或审核流程卡死。

### 2.3 认证体系持续成形

今天虽然没有认证方向的新合并主 PR，但昨日更新的几条已关闭 PR 连在一起看，已经形成清晰路线：

- **#60902 [feat](authentication) Support AuthenticationIntegration DDL**  
  链接: apache/doris PR #60902
- **#61172 [feat](auth integration) unify auth integration audit metadata**  
  链接: apache/doris PR #61172
- **#61246 [feat](auth) support querying authentication integrations from system table**  
  链接: apache/doris PR #61246

这些工作共同表明 Doris 正把认证集成从“可配置”推进到“可管理、可审计、可查询”。而今天仍在打开中的：

- **#61362 [feat](authentication) Integrate authentication chain and simplify fallback config**  
  链接: apache/doris PR #61362

意味着认证链路很可能会继续成为 **4.1 周期的重要功能主题**。

### 2.4 存储与连接器优化

- **#61245 [fix](mc) fix memory leak and optimize large data write for MaxCompute connector**  
  链接: apache/doris PR #61245  
  已评审通过，修复 MaxCompute JNI Scanner/Writer 的潜在内存泄漏，并优化大批量写入路径。  
  这类修复对长期运行任务、批量导入稳定性很关键，属于**连接器工程质量提升**。

- **#61391 branch-4.1: [fix](paimon) adapt FE for paimon 1.3.1 and iceberg 1.10.1**  
  链接: apache/doris PR #61391  
  说明 Doris 正在主动适配新版本 Paimon / Iceberg 生态依赖，减少版本错配导致的 FE 行为异常。

---

## 3. 社区热点

> 注：给定数据中的 PR 评论数均显示为 `undefined`，因此以下热点主要依据“问题影响面、功能重要性、是否形成系列 PR/Issue”判断。

### 热点 1：Iceberg/MERGE/UPDATE/DELETE 能力持续推进
- **#60482 [feature](iceberg) Implements iceberg update delete merge into functionality**  
  链接: apache/doris PR #60482

这是今天最有“路线图意义”的在途 PR 之一。它表明 Doris 不仅在做 Iceberg 读取，还在向 **Iceberg 表的更新、删除、MERGE INTO 语义**靠拢。  
背后的技术诉求是典型的湖仓一体场景：用户希望在保持开放表格式的前提下，获得接近数据库原生的 DML 能力。

### 热点 2：认证集成从 DDL 走向登录链路
- **#61362 [feat](authentication) Integrate authentication chain and simplify fallback config**  
  链接: apache/doris PR #61362  
- **#60902 / #61172 / #61246**  
  链接: apache/doris PR #60902 / #61172 / #61246

这组 PR 反映出 Doris 正在把 FE 认证体系“产品化”：支持对象管理、审计信息统一、系统表查询、登录链路接入。  
背后的诉求来自企业级部署：**统一认证、外部身份集成、合规审计、运维可观察性**。

### 热点 3：云与多 catalog 数据湖读取链路重构
- **#61485 [opt](multi-catalog) Refactor data lake reader**  
  链接: apache/doris PR #61485  
- **#61089 [opt](cloud) Enable compaction on new tablets during schema change queuing**  
  链接: apache/doris PR #61089  
- **#60705 [fix](cloud) checkpoint save cloud tablet stats to image**  
  链接: apache/doris PR #60705

这些 PR 集中体现 Doris 在云环境和多 catalog 访问链路上的系统性演进。  
用户核心诉求是：**跨湖仓读取稳定、云原生 schema change 不拖垮 compaction、checkpoint/恢复状态更完整**。

### 热点 4：SQL 执行性能与资源控制优化
- **#61260 [opt](agg) Optimize the execution of GROUP BY count(*)**  
  链接: apache/doris PR #61260  
- **#61271 [feature](memory) Global mem control on scan nodes**  
  链接: apache/doris PR #61271  
- **#61130 [refactor](recursive-cte) Replace in-place PFC reset with full recreation between recursion rounds**  
  链接: apache/doris PR #61130

这组改动指向执行引擎的两个老问题：  
1) 常见聚合语句的低开销执行；  
2) 大查询/复杂查询的内存可控性与清理完整性。  
说明 Doris 仍在持续做“**高频 SQL 跑得更快，复杂 SQL 跑得更稳**”的底层工作。

---

## 4. Bug 与稳定性

以下按严重程度和影响面排序。

### P1：视图 + ORDER BY 触发过度列裁剪，导致结果列为空
- **#61219 [Bug] Doris View Order by 会过度列裁剪导致列为空**  
  链接: apache/doris Issue #61219

**问题描述**：  
在 `SELECT * FROM view_name ORDER BY a ASC, b LIMIT 100` 场景下，视图中除 `ORDER BY` 引用的列外，其余列被错误裁剪为空。  

**影响判断**：  
这是典型的**查询正确性问题**，对结果可信度影响很大，严重程度高于一般崩溃类问题，因为它可能产生“成功返回但结果错误”的情况。  

**是否已有 fix PR**：  
当前提供数据中**未看到直接关联修复 PR**，建议优先跟进。

---

### P1：4.0.4 Docker 镜像仅支持 ARM64，AMD64 缺失
- **#61525 [Bug] Docker image of 4.0.4 only support ARM64**  
  链接: apache/doris Issue #61525

**问题描述**：  
用户反馈 4.0.4 Docker 镜像只发布了 ARM64，AMD64 支持被移除。  

**影响判断**：  
这是**交付制品级别的可用性问题**。对 x86 服务器用户影响直接，尤其是评估部署、CI、测试环境构建都会受阻。  
虽然不属于核心引擎 bug，但从落地影响看非常高。

**是否已有 fix PR**：  
当前数据中**未看到对应修复 PR**。

---

### P2：`frontends()` TVF 的 CurrentConnected 判断错误
- **#61087 [fix] Preserve CurrentConnected in frontends() TVF**  
  链接: apache/doris PR #61087

**问题性质**：  
元数据查询正确性问题。  
**状态**：已修复并向 `branch-4.0` / `branch-4.1` 回捞（#61532 / #61533）。  
这说明维护者对线上可见行为错误响应较快，项目健康度较好。

---

### P2：Hudi 查询被错误识别为不支持的 DLA 类型
- **#58413 [fix](hudi) Fix Hudi query error "do not support DLA type HUDI"**  
  链接: apache/doris PR #58413

**问题性质**：  
数据湖表扫描链路中的优化器/计划节点信息丢失。  
**状态**：已关闭，已进入 4.0.3 合并标记。  
这类问题往往说明 Doris 在多源外表能力上已覆盖较广，但优化器路径还需持续打磨。

---

### P3：MaxCompute connector 潜在内存泄漏
- **#61245 [fix](mc) fix memory leak and optimize large data write for MaxCompute connector**  
  链接: apache/doris PR #61245

**问题性质**：  
资源泄漏 + 大数据写入效率问题。  
**状态**：PR 已 reviewed，修复路径较明确。  
如果 MaxCompute 是目标市场重点，该修复值得尽快落地。

---

### P3：zonemap datetimev2 字符串编码精度一致性
- **#61529 [bugfix](zonemap string) datetimev2 should always using scale 6 to produce string**  
  链接: apache/doris PR #61529

**问题性质**：  
更偏底层存储索引/序列化一致性问题。  
可能影响 zonemap 判断或不同精度时间类型的行为一致性。  
**状态**：打开中，建议继续观察是否会影响查询裁剪正确性。

---

## 5. 功能请求与路线图信号

今天的功能请求虽然不少带有 `Stale` 标记，但结合活跃 PR，可以看出一些未来版本可能纳入的方向。

### 5.1 MERGE INTO / 更完整的 UPSERT 语义
- **#56258 [Feature] Support MERGE INTO**  
  链接: apache/doris Issue #56258
- **#55547 [Feature] 希望可以支持 mysql 那种 on duplicate key update 语义**  
  链接: apache/doris Issue #55547
- **#60482 [feature](iceberg) Implements iceberg update delete merge into functionality**  
  链接: apache/doris PR #60482

**判断**：  
这是今天最强的路线图信号之一。  
尽管用户层面提出的是标准 SQL `MERGE INTO` 和 MySQL 风格 `ON DUPLICATE KEY UPDATE`，当前已存在 Iceberg 侧 update/delete/merge 支持的在途实现，说明 Doris 团队对**DML 丰富化**已有实质推进。  
短期更可能先在**数据湖对象或特定表类型**落地，再逐步向更统一的 SQL 语义扩展。

### 5.2 新 UUID 函数支持
- **#56260 [Feature] uuid v7 function support**  
  链接: apache/doris Issue #56260

**判断**：  
该需求契合现代分布式系统对**时间有序 ID**的偏好，技术门槛不高，但优先级通常低于核心执行/湖仓能力。  
如果 Doris 后续增强函数生态，有机会进入某个次版本。

### 5.3 新列式格式支持：Vortex
- **#56261 [Feature] support read and write vortex columnar file**  
  链接: apache/doris Issue #56261

**判断**：  
从生态趋势看，Doris 正在加强 Iceberg / Paimon / Hudi / 多 catalog 读取，对新列式格式的兴趣真实存在。  
但相较已有主流湖仓格式，Vortex 当前更像前瞻性探索，**短期进入正式版本的概率低于 Iceberg/Paimon 方向**。

### 5.4 Azure Blob 上 Hive Catalog 支持
- **#55654 Is hive catalog support azure blob?**  
  链接: apache/doris Issue #55654

**判断**：  
这类需求反映 Doris 用户已经从 AWS/HDFS 进一步走向 Azure 云对象存储。  
结合 `RoutineLoad IAM auth`、多 catalog 重构、Paimon/Iceberg 适配，说明 Doris 的多云适配是明确方向，但该具体 issue 当前已 stale 关闭，仍需产品化推进。

### 5.5 编译工具链升级到 C++23
- **#61522 [Proposal] Upgrade Apache Doris to C++23**  
  链接: apache/doris Issue #61522

**判断**：  
这是典型的长期工程提案。  
对 BE 代码可维护性、现代语言特性利用有益，但会牵涉编译器、依赖、CI、发布平台兼容性。  
**短期纳入次版本的可能性较低**，更适合作为中长期演进议题。

### 5.6 Recycle Bin 生命周期管理增强
- **#61504 [feature](recycle-bin) support three-phase retention for recycle bin**  
  链接: apache/doris PR #61504

**判断**：  
虽然不是 issue，而是在途 PR，但它透露出 Doris 在企业运维能力上的增强：回收站保留策略更细化，有助于兼顾误删保护、成本控制与治理策略。  
这类功能较有希望进入近期版本。

### 5.7 Routine Load 支持 AWS MSK IAM 认证
- **#61324 [feature](RoutineLoad) Support RoutineLoad IAM auth**  
  链接: apache/doris PR #61324

**判断**：  
这是非常明确的企业云场景需求，且实现边界清晰。  
相比一些前瞻提案，它**更有机会被近期版本接纳**，因为能直接提升 Doris 在 AWS 托管 Kafka 场景下的接入能力。

---

## 6. 用户反馈摘要

结合今日 issue 内容，可以提炼出几类真实用户痛点：

### 6.1 用户最在意的仍是“SQL 语义兼容 + 查询结果正确”
- **#61219** 视图 + `ORDER BY` 错误列裁剪  
- **#55644** `JOIN USING` 不符合 SQL 标准  
- **#55821** `count_substrings` 函数不存在  
链接: apache/doris Issue #61219 / #55644 / #55821

这说明用户不只是在“能不能跑”，而是在关注 Doris 是否能作为**更完整、更可信的 SQL 引擎**。  
尤其在 BI、报表、应用迁移场景里，语法兼容和结果正确性是采用门槛。

### 6.2 用户希望 Doris 具备更强的数据库式 DML 体验
- **#55547** MySQL 风格 `on duplicate key update`  
- **#56258** 标准 SQL `MERGE INTO`  
链接: apache/doris Issue #55547 / #56258

这类反馈说明一些用户正把 Doris 用在**实时数仓 + 轻量更新写入**场景，而不满足于纯 append-only 分析。  
与 Iceberg DML PR 联动看，社区需求已比较明确。

### 6.3 多云与多架构部署兼容性成为现实需求
- **#61525** 4.0.4 Docker 镜像仅 ARM64  
- **#55654** Hive Catalog on Azure Blob  
链接: apache/doris Issue #61525 / #55654

这类反馈说明 Doris 已经进入更广泛的基础设施环境，不再局限于传统 x86 + HDFS 部署。  
对项目而言，这意味着发布制品、对象存储适配、认证链路都需要更“云原生”。

### 6.4 先进生态能力需求开始出现
- **#56261** Vortex 列式格式  
- **#56260** UUID v7  
- **#61522** C++23  
链接: apache/doris Issue #56261 / #56260 / #61522

这些需求未必短期高优，但能看出用户已开始把 Doris 与更现代的数据系统、编译工具链、开放格式生态进行对标。

---

## 7. 待处理积压

以下是值得维护者额外关注的长期或陈旧但仍有产品价值的话题。

### 7.1 SQL DML 语义增强需求长期悬而未决
- **#55547 [Feature] on duplicate key update**  
  链接: apache/doris Issue #55547
- **#56258 [Feature] Support MERGE INTO**  
  链接: apache/doris Issue #56258

虽然都被标记为 stale，但它们代表非常真实的用户诉求。  
建议维护者至少给出**语义边界说明**：哪些表模型、哪些 catalog、哪些版本计划支持。

### 7.2 新函数与格式支持请求缺少路线反馈
- **#56260 [Feature] uuid v7 function support**  
  链接: apache/doris Issue #56260
- **#56261 [Feature] support read and write vortex columnar file**  
  链接: apache/doris Issue #56261

建议为函数类、小型生态类需求建立“**评估中 / 暂不计划 / 欢迎社区贡献**”的标签化反馈，降低用户等待不确定性。

### 7.3 仍需明确处理的近期高优先级 bug
- **#61219 [Bug] View ORDER BY 导致列为空**  
  链接: apache/doris Issue #61219
- **#61525 [Bug] 4.0.4 Docker image only support ARM64**  
  链接: apache/doris Issue #61525

这两项并非陈旧问题，但从影响面看应进入**近期优先处理队列**。  
前者影响查询可信度，后者影响部署可用性。

### 7.4 长期开启的大型特性 PR 需持续推进或拆分
- **#60482 [feature](iceberg) Implements iceberg update delete merge into functionality**  
  链接: apache/doris PR #60482

这是非常重要但范围也很大的 PR。  
建议维护者关注：
- 是否能拆分成更小的可审阅 patch；
- 是否补充回归测试矩阵；
- 是否明确支持范围（Iceberg 版本、操作类型、事务语义）。

---

## 8. 总体健康度判断

从今日数据看，Apache Doris 项目处于**高吞吐开发状态**：  
- PR 更新量非常高，且合并/关闭比接近 1:1，说明维护与审阅链路并未严重阻塞；  
- 4.0.x / 4.1.x 分支存在明显的回捞与稳定性治理动作，表明发布分支管理较积极；  
- 数据湖、认证、云环境、连接器、执行引擎四条主线都在推进，方向清晰。  

需要警惕的点主要有两个：  
1. **SQL 正确性问题的优先级要继续保持高位**，尤其是结果 silently wrong 的问题；  
2. **制品发布与多架构兼容性**正在成为与核心代码同样重要的用户体验因素。  

整体来看，Doris 当前健康度良好，且正在从“高性能分析引擎”继续向“企业级、云原生、湖仓一体分析平台”演进。

---

## 横向引擎对比

以下是基于 2026-03-20 各项目社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# OLAP / 分析型存储引擎开源生态横向对比分析报告
**日期：2026-03-20**

---

## 1. 生态全景

过去 24 小时内，OLAP 与分析型存储引擎开源生态整体呈现出 **高活跃、强分化、重稳定性治理** 的特征。  
一方面，Apache Doris、ClickHouse、DuckDB、StarRocks 等核心查询引擎持续高频迭代，围绕 **查询优化、湖仓集成、云对象存储、认证与运维能力** 同步推进；另一方面，Iceberg、Delta Lake、Arrow 等基础设施项目则继续强化 **协议、格式、连接器与跨引擎互操作性**。  
从热点来看，行业共同关注点已从“跑得快”扩展到“**结果正确、生态兼容、云上稳定、发布可交付**”。  
同时，越来越多项目暴露出 **对象存储、流式恢复、缓存一致性、复杂 SQL 边界** 上的问题，说明生态正在进入从能力扩张走向工程成熟的关键阶段。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release 情况 | 当日状态判断 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 11 | 145 | 无 | 4.0/4.1 分支稳定性修复、认证体系、湖仓连接器增强 | **高** |
| **ClickHouse** | 63 | 389 | **3 个 stable/LTS 版本发布** | 主线开发 + 稳定分支维护并行，裁剪优化与分布式修复活跃 | **高** |
| **DuckDB** | 78 | 42 | 无 | Parquet/S3、优化器、存储正确性持续推进 | **高** |
| **StarRocks** | 9 | 137 | 无 | backport 密集，文档/稳定性修复明显，湖仓 correctness 风险上升 | **中高** |
| **Apache Iceberg** | 11 | 46 | 无 | REST Catalog、Spark/Flink 修复、1.10.x 补丁准备 | **中高** |
| **Delta Lake** | 2 | 29 | 无 | DSv2/Kernel 路线持续推进，协议文档化与技术债治理并行 | **中高** |
| **Databend** | 4 | 12 | 无 | 优化器/存储重构推进，但 panic/assert 类问题明显 | **中** |
| **Velox** | 9 | 50 | 无 | Join/GPU/Iceberg 写路径增强，兼容性与 OSS 构建问题并存 | **中高** |
| **Apache Gluten** | 8 | 12 | 无 | Velox 后端功能扩展明显，Flink/GPU 稳定性压力上升 | **中** |
| **Apache Arrow** | 22 | 17 | 无 | Flight SQL ODBC、Parquet 稳定性、跨平台交付链路推进 | **中高** |

### 简要结论
- **活跃度第一梯队**：ClickHouse、Doris、StarRocks、DuckDB  
- **基础设施高活跃梯队**：Iceberg、Velox、Arrow  
- **方向清晰但吞吐较小梯队**：Delta Lake、Databend、Gluten  

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势

与同类项目相比，Apache Doris 当前最突出的优势在于：

1. **“数据库内核 + 湖仓连接 + 企业能力”三线并进**
   - 当天同时覆盖：
     - SQL 执行优化：`GROUP BY count(*)`、recursive CTE、scan/memory control
     - 湖仓连接器：Hudi、Paimon、Iceberg、MaxCompute
     - 企业能力：认证集成、审计、系统表查询、Routine Load IAM
   - 这说明 Doris 并非只卷单点性能，而是在做完整平台化建设。

2. **稳定分支治理节奏强**
   - 4.0.x / 4.1.x 回捞频繁，且新增 `branch-4.1 required CI`
   - 相比部分仍偏主线推进的项目，Doris 在发布分支纪律和线上修复响应上更成熟。

3. **SQL 引擎与湖仓访问结合更紧**
   - Doris 不像 Iceberg/Delta 那样偏表格式，也不像 Arrow 那样偏基础库；
   - 它在“高性能 MPP SQL 引擎”基础上快速补湖仓能力，这一点与 StarRocks 最接近，但在认证、系统表、云原生治理上今天更显体系化。

### 3.2 技术路线差异

与其他主要项目相比：

- **vs ClickHouse**  
  Doris 更强调 **标准 SQL、企业权限/认证、湖仓多 catalog 集成**；  
  ClickHouse 更强调 **高吞吐执行、裁剪优化、分布式副本、底层执行器极致性能**。

- **vs StarRocks**  
  两者都在走 **MPP OLAP + 湖仓融合** 路线；  
  但今天看 Doris 在 **认证体系、连接器工程质量、版本治理** 上更突出，StarRocks 则更多暴露在 **Iceberg cache correctness / JSON / Join correctness** 这类高风险问题上。

- **vs DuckDB**  
  Doris 是面向服务端/集群部署的分析数据库；  
  DuckDB 更偏嵌入式、单机、对象存储直读和数据科学工作流。

- **vs Iceberg / Delta Lake**  
  Doris 是查询执行平台；Iceberg/Delta 是开放表格式与事务协议层。  
  Doris 的路线是“**兼容并利用这些湖格式**”，而不是替代它们。

### 3.3 社区规模对比

按当天 PR/Issue 活跃度粗看：

- **超大规模社区**：ClickHouse
- **大规模高吞吐社区**：Doris、StarRocks、DuckDB
- **中大型基础设施社区**：Iceberg、Arrow、Velox
- **中等规模但方向鲜明**：Delta Lake、Databend、Gluten

Doris 已属于 **头部分析数据库社区**，尤其在中国及湖仓一体场景中具备较强存在感。

---

## 4. 共同关注的技术方向

以下是多个项目在同一天同时涌现的共性主题。

### 4.1 湖仓 / 开放表格式深度集成
**涉及项目**：Doris、StarRocks、Iceberg、Delta Lake、Velox、Gluten、DuckDB  
**具体诉求**：
- Doris：Hudi/Paimon/Iceberg/MaxCompute 连接器修复与适配
- StarRocks：Iceberg metadata cache、一致性、MV refresh
- Iceberg：REST Catalog、Flink/Spark 流式/恢复正确性
- Delta Lake：Kernel + DSv2 统一读写栈
- Velox：Iceberg deletion vector / DWRF 写路径
- DuckDB：Parquet/MAP/复杂 schema 裁剪
- Gluten：Parquet type widening、复杂类型原生写入

**结论**：  
行业已经从“支持读开放表格式”走向“**支持写、支持维护任务、支持缓存一致性与 schema 演进**”。

---

### 4.2 对象存储 / 云环境稳定性
**涉及项目**：DuckDB、ClickHouse、Iceberg、Arrow、Delta Lake、StarRocks、Gluten  
**具体诉求**：
- DuckDB：S3 请求激增、503 Slowdown、ETag 误判、高内存 COPY TO S3
- ClickHouse：对象存储删除异步化语义争议
- Iceberg：GCS 凭证刷新失败
- Arrow：S3 URI 解析错误可能回落到 Local FS
- Delta Lake：Snapshot 额外 N.json 加载增加云端请求
- StarRocks：Azure Data Lake parquet 扫描、云原生 repair
- Gluten：S3 finalize 生命周期问题

**结论**：  
对象存储不再只是“存储介质”，而是分析引擎的主战场。  
核心矛盾变成：**请求数、认证刷新、一致性、生命周期、错误语义**。

---

### 4.3 查询正确性优先级显著上升
**涉及项目**：Doris、StarRocks、Databend、DuckDB、ClickHouse、Iceberg  
**具体诉求**：
- Doris：View + ORDER BY 过度列裁剪、frontends() 语义错误
- StarRocks：Iceberg cache silent wrong results、表达式 join key 崩溃/错结果
- Databend：decorrelate panic、overflow panic、parser assertion
- DuckDB：CASE + UNNEST、TRY_CAST、random() 子查询行为
- ClickHouse：语法回归、UUID schema 语义丢失
- Iceberg：Flink 恢复后重复写入、静默空读

**结论**：  
生态进入成熟期后，最敏感的问题已不是 crash，而是 **silent wrong result**。  
这将直接影响企业用户对系统可托付性的判断。

---

### 4.4 查询裁剪、Top-K、复杂类型下推优化
**涉及项目**：ClickHouse、DuckDB、Doris、Gluten、Velox、Iceberg  
**具体诉求**：
- ClickHouse：statistics-based part pruning、ORDER BY LIMIT part pruning、top-k dynamic filtering
- DuckDB：struct/variant extract filter pushdown、MAP row-group skipping
- Doris：GROUP BY count(*)、scan node 全局内存控制
- Gluten：shuffle block-level stats + dynamic pruning
- Velox：Join/数组聚合/向量化能力增强
- Iceberg：Structured Streaming filter pushdown 请求

**结论**：  
优化器竞争正从传统谓词下推扩展到 **统计裁剪、复杂类型裁剪、流式读取裁剪和执行早停**。

---

### 4.5 企业级控制面与可运维性
**涉及项目**：Doris、StarRocks、ClickHouse、Delta Lake、Arrow  
**具体诉求**：
- Doris：认证链、审计元数据、系统表可查
- StarRocks：BE dynamic config、Resource Group 文档、log4j 外置化诉求
- ClickHouse：CREATE HANDLER、后台完成交互式查询
- Delta Lake：UC commit metrics、Kernel/DSv2 统一
- Arrow：ODBC 安装、签名、跨平台交付

**结论**：  
“数据库能力”之外，**配置、认证、发布制品、运维控制面** 已成为项目成熟度的核心指标。

---

## 5. 差异化定位分析

### 5.1 按存储格式 / 数据模型定位

| 项目 | 核心定位 |
|---|---|
| **Doris / StarRocks / ClickHouse / Databend** | 自有分析数据库 / MPP 或列式执行引擎 |
| **DuckDB** | 嵌入式分析数据库，兼具数据湖直读能力 |
| **Iceberg / Delta Lake** | 开放表格式、事务/元数据协议层 |
| **Arrow** | 内存格式、数据交换、连接与文件格式基础设施 |
| **Velox / Gluten** | 执行引擎内核 / 加速层，不直接以完整数据库形态面向用户 |

---

### 5.2 按查询引擎设计定位

| 项目 | 查询引擎特征 |
|---|---|
| **Doris** | MPP 分布式分析数据库，SQL + 湖仓连接 + 企业控制面 |
| **ClickHouse** | 高吞吐列式执行，分布式读取与裁剪优化极强 |
| **StarRocks** | 面向实时分析和湖仓融合的 MPP 引擎 |
| **DuckDB** | 单机向量化执行、嵌入式场景强 |
| **Databend** | 云原生分析数据库，优化器与存储抽象演进中 |
| **Velox** | 可嵌入执行引擎，服务上层系统 |
| **Gluten** | Spark/Flink 的原生加速层，依托 Velox/ClickHouse backend |

---

### 5.3 按目标负载类型定位

| 项目 | 目标负载 |
|---|---|
| **ClickHouse** | 日志、时序、事件明细、高吞吐聚合 |
| **Doris / StarRocks** | 数仓分析、报表、实时分析、湖仓联合查询 |
| **DuckDB** | 数据科学、本地分析、嵌入式 ETL、对象存储直读 |
| **Iceberg / Delta** | 湖仓表管理、跨引擎共享数据 |
| **Arrow** | 数据交换、驱动、跨语言生态 |
| **Velox / Gluten** | SQL 执行加速、GPU/Native backend、上层引擎提速 |

---

### 5.4 SQL 兼容性差异

- **Doris / StarRocks**：更强调数据库式 SQL 体验、系统表、认证、DML 演进
- **ClickHouse**：性能导向强，但用户对 SQL/语义兼容问题反馈持续增多
- **DuckDB**：对高级 SQL 语义要求越来越高，用户已将其视作严肃 SQL 引擎
- **Iceberg / Delta**：不以完整 SQL 引擎为主，更多承载表级语义
- **Velox / Gluten**：兼容性主要体现为对 Spark / Presto 上层行为的对齐

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层

#### 第一层：超高活跃 + 多线并进
- **ClickHouse**
- **Apache Doris**
- **DuckDB**
- **StarRocks**

特点：
- PR / Issue 吞吐高
- 同时推进主线开发与稳定分支维护
- 用户反馈密集，回归风险也更快暴露

#### 第二层：基础设施强活跃
- **Apache Iceberg**
- **Apache Arrow**
- **Velox**

特点：
- 不一定有最多 PR，但路线图清晰
- 影响多个上层系统
- 更偏协议、执行基础设施和生态兼容

#### 第三层：方向明确、处于快速迭代或能力补齐期
- **Delta Lake**
- **Databend**
- **Gluten**

特点：
- 主题集中
- 若干长期 PR / WIP 较多
- 在某些能力线上处于“从可用走向成熟”的阶段

---

### 6.2 哪些处于快速迭代阶段，哪些在质量巩固阶段

#### 快速迭代阶段
- **DuckDB**：对象存储、Parquet、优化器边界快速变化
- **Databend**：优化器/解析器重构明显，但 panic 边界仍多
- **Gluten**：Flink/GPU/Parquet 写路径快速扩张
- **Velox**：GPU/Iceberg/Join 能力加速扩展

#### 质量巩固阶段
- **Doris**：4.0/4.1 分支门禁与回捞强
- **ClickHouse**：stable/LTS 持续发版，明显在做质量收口
- **StarRocks**：大量 backport 与文档治理，稳定线维护明显
- **Iceberg**：1.10.x patch 准备信号强
- **Arrow**：更偏交付链路与兼容打磨

---

## 7. 值得关注的趋势信号

### 趋势 1：湖仓一体进入“深水区”
参考项目：Doris、StarRocks、Iceberg、Delta、Velox、DuckDB  
**信号**：  
已不只是“支持 Iceberg/Delta/Hudi 读取”，而是进入：
- 写路径
- deletion vector / merge / update / delete
- schema 演进
- cache 一致性
- maintenance action
- branch / snapshot 生命周期  
**对架构师的意义**：  
选型时必须关注“读兼容”之外的 **写入语义、缓存一致性和维护任务支持**。

---

### 趋势 2：对象存储成为核心性能与稳定性战场
参考项目：DuckDB、ClickHouse、Iceberg、Arrow、Delta、StarRocks  
**信号**：  
S3/GCS/Azure Blob 上的问题已覆盖：
- 请求数爆炸
- 凭证刷新
- 删除语义
- ETag/URI 解析
- Slowdown 重试
- 文件枚举与裁剪  
**对数据工程师的意义**：  
架构设计时，不能只看 SQL 层 benchmark，要关注 **对象存储交互模型**。

---

### 趋势 3：正确性压倒“单纯更快”
参考项目：Doris、StarRocks、Databend、DuckDB、Iceberg、ClickHouse  
**信号**：  
社区最危险的问题越来越是：
- silent wrong results
- 重复写入
- 静默空读
- 语义偏差
- 类型/格式元数据丢失  
**建议**：  
生产选型要把 **回归测试、版本回捞、稳定分支纪律** 纳入核心评估项。

---

### 趋势 4：优化器竞争进入复杂类型与统计裁剪时代
参考项目：ClickHouse、DuckDB、Doris、Gluten、Velox  
**信号**：  
优化方向从传统谓词下推升级到：
- statistics-based pruning
- top-k / in-order 裁剪
- struct / variant / MAP 下推
- shuffle block 统计裁剪
- 小查询并行度自适应  
**参考价值**：  
对于高并发交互式分析、半结构化分析和对象存储直读场景，这些能力会越来越关键。

---

### 趋势 5：企业级可运维能力成为分水岭
参考项目：Doris、StarRocks、ClickHouse、Arrow、Delta  
**信号**：  
认证、审计、动态配置、发布制品、ODBC 驱动、签名、系统表、控制面 SQL 化都在升温。  
**意义**：  
未来头部项目的竞争，已经不只是执行引擎，而是 **能否成为企业级数据平台的一部分**。

---

## 结论：Apache Doris 的生态位置判断

综合当天动态，**Apache Doris 处于当前分析型数据库生态的头部阵营**，且其差异化竞争力正在进一步清晰：

- 相比 ClickHouse：Doris 更偏 **企业 SQL + 湖仓融合 + 管理能力**
- 相比 StarRocks：两者路线接近，但 Doris 今天在 **认证体系、稳定分支治理、连接器质量修复** 上更成体系
- 相比 DuckDB：Doris 更适合 **服务端分布式数仓与多租户平台**
- 相比 Iceberg/Delta：Doris 是执行与服务平台，而非单纯表格式层

### 对技术决策者的建议
如果你的目标是：
- **统一湖仓分析入口**
- **兼顾数据库体验与开放表格式**
- **需要较完整的认证、运维、系统表与企业化能力**
- **希望社区保持较高开发吞吐且有稳定分支治理**

那么 Apache Doris 依然是当前值得重点跟踪和评估的头部方案之一。

---

如果你愿意，我可以继续把这份报告进一步整理成以下任一版本：

1. **管理层 1 页摘要版**
2. **研发团队跟进版（按 SQL/存储/湖仓/云原生分类）**
3. **只聚焦 Apache Doris vs ClickHouse vs StarRocks 的三强对比版**
4. **适合飞书/企业微信发送的 500 字简报版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时 ClickHouse 维持**高强度活跃**：Issues 更新 63 条、PR 更新 389 条，并发布了 **3 个稳定版本**，说明项目同时在推进主线开发、稳定分支维护与缺陷收敛。  
从议题结构看，今天的重点集中在三类：**查询裁剪/执行优化**、**分布式/并行副本行为修正**、以及 **CI/模糊测试驱动的稳定性修复**。  
社区讨论中，既有面向未来的特性设计（后台继续执行交互式查询、Remote database engine、CREATE HANDLER），也有对近期行为变化的强烈反馈（如对象存储删除异步化）。  
整体健康度判断为：**开发活跃、版本维护积极，但 CI 崩溃与 fuzz/sanitizer 噪音仍然较高，稳定性治理仍是当前主线之一。**

---

## 2. 版本发布

过去 24 小时发布了 3 个版本：

- [v26.2.5.45-stable](ClickHouse/ClickHouse Release v26.2.5.45-stable)
- [v26.1.5.41-stable](ClickHouse/ClickHouse Release v26.1.5.41-stable)
- [v25.8.19.20-lts](ClickHouse/ClickHouse Release v25.8.19.20-lts)

### 发布解读

从版本号判断，本次属于**稳定分支补丁发布**，覆盖：
- 当前稳定线 `26.2`
- 上一个稳定线 `26.1`
- 长期支持线 `25.8-lts`

这反映出 ClickHouse 维护策略较成熟：**新功能继续在主线推进，生产用户则通过 stable/LTS 获得回补修复**。

### 今日可见的相关修复/变更信号

虽然题面未提供完整 release notes，但结合今日活跃 PR/Issue，可推测这些版本重点可能涉及：

- 崩溃与未定义行为修复  
  - [#99697 Fix undefined behavior in Avro reader](ClickHouse/ClickHouse PR #99697)
  - [#99823 Fix abort in DataTypeTuple::createColumn when serialization is SerializationDetached](ClickHouse/ClickHouse PR #99823)
  - [#100147 Fix Logical error: data->allocated_size != debug_allocated_size](ClickHouse/ClickHouse PR #100147)

- SQL/解析器兼容性修复  
  - [#100136 Allow parenthesized queries in EXPLAIN](ClickHouse/ClickHouse PR #100136)
  - [#100132 Fix `accurateCastOrDefault` losing Const column type](ClickHouse/ClickHouse PR #100132)

- 性能默认值或执行器行为优化  
  - [#99537 Enable `use_top_k_dynamic_filtering` and `use_skip_indexes_for_top_k` by default](ClickHouse/ClickHouse PR #99537)

### 破坏性变更与迁移注意事项

今天最值得用户注意的并不是明确的“破坏性变更公告”，而是**近期行为变化引发的生产感知差异**：

1. **DROP TABLE 与对象存储删除的异步化**
   - 相关反馈：[#99996 Add option to return syncrhonous deletion blob storage data during DROP TABLE ... SYNC execution](ClickHouse/ClickHouse Issue #99996)
   - 风险：26.2 起对象磁盘删除变为异步后，`DROP TABLE ... SYNC` 的用户预期与实际可能不一致，尤其在合规删除、空间回收确认、外部编排流程中。
   - 建议：升级到 26.2+ 的用户应验证对象存储清理链路，不要再默认把 `SYNC` 理解为“底层 blob 已全部删除”。

2. **v26 上语法兼容性回归**
   - 相关问题：[#100031 DESCRIBE TABLE (...) AS <alias> syntax broken since version 26](ClickHouse/ClickHouse Issue #100031)
   - 建议：升级至 v26 的用户，若依赖工具生成 SQL 或元数据探测语句，应补跑解析兼容回归测试。

3. **格式/类型互操作的元数据一致性**
   - 相关问题：[#100119 Arrow-based Parquet writer does not set UUID logical type in schema](ClickHouse/ClickHouse Issue #100119)
   - 建议：如果使用 Arrow 路径导出 Parquet 并与 Spark/Trino/Arrow 生态互通，需特别检查 UUID 列的逻辑类型标注。

---

## 3. 项目进展

今日数据中未给出“已合并 PR 明细列表”，但从**已关闭 PR**与高活跃 open PR 可以看出当前推进方向。

### 已关闭/完成的重要工程项

#### 1) CI 构建矩阵收敛，减少 UBSan 独立构建
- [#99657 CI: combine ASan+UBSan into single builds, remove UBSan](ClickHouse/ClickHouse PR #99657)
- 意义：
  - 说明维护者正在主动压缩 CI 成本与复杂度；
  - 将 Sanitizer 检查组合化，有助于提升反馈效率；
  - 但也意味着后续需要观察是否会降低某些独立 UBSan 场景的可观测性。

### 今日高价值推进中的 PR

#### 2) 查询裁剪能力继续增强
- [#94140 Add statistics-based part pruning](ClickHouse/ClickHouse PR #94140)
- 作用：
  - 基于 part 统计信息和 MinMax 超矩形做裁剪；
  - 这是对现有 partition pruning / primary key pruning 的补强；
  - 若落地，将直接改善大表扫描成本，尤其对过滤条件可映射为统计边界的场景有效。

#### 3) ORDER BY LIMIT 在分区表上进一步优化
- [#99533 perf: Prune parts for `ORDER BY LIMIT` queries on partitioned tables when `optimize_read_in_order=1`](ClickHouse/ClickHouse PR #99533)
- 作用：
  - 面向 Top-N/最近数据读取类场景；
  - 对日志、时序、事件表非常关键；
  - 与统计裁剪一起，释放出明确路线图：**减少不必要 part 访问，缩短读路径。**

#### 4) GROUP BY 小数据集并行度控制
- [#99495 Add `GradualResizeProcessor` to limit effective parallelism for GROUP BY on small data volumes](ClickHouse/ClickHouse PR #99495)
- 作用：
  - 避免小数据量却创建大量聚合线程和部分哈希表；
  - 直接针对“高并发 + 小查询”场景的 CPU 浪费与聚合 merge 开销；
  - 这属于执行引擎层面的实际收益优化。

#### 5) 分布式查询与并行副本行为修复/增强
- [#100146 Fix distributed task iterator not initialized exception with parallel replicas](ClickHouse/ClickHouse PR #100146)
- [#100139 Add parallel_replicas_prefer_local_replica setting](ClickHouse/ClickHouse PR #100139)
- [#100141 Allow skipping local shard with missing table when `skip_unavailable_shards` is enabled](ClickHouse/ClickHouse PR #100141)
- 作用：
  - 修正 parallel replicas 在 table function 场景下误启 distributed_processing 的问题；
  - 增加更细粒度的副本选择策略；
  - 让本地 shard 缺表时也能与 skip_unavailable_shards 语义保持一致。
- 结论：**分布式执行的一致性与容错性正在快速打磨。**

#### 6) SQL 语义与表达式框架兼容修复
- [#100132 Fix `accurateCastOrDefault` losing Const column type](ClickHouse/ClickHouse PR #100132)
- [#100136 Allow parenthesized queries in EXPLAIN](ClickHouse/ClickHouse PR #100136)
- 意义：
  - 一个修表达式常量列属性保持；
  - 一个修 EXPLAIN 对括号查询支持；
  - 都属于“看似小、实际影响工具链和查询框架兼容性”的问题。

---

## 4. 社区热点

### 1) CI 崩溃：事务提交日志 finalize 失败
- [#85468 [CI crash] Transaction log finalize failed during commit](ClickHouse/ClickHouse Issue #85468)
- 评论：25
- 分析：
  - 这是今天评论最多的问题，说明**事务/提交路径上的稳定性问题**仍受到持续关注；
  - 尽管发生在 CI，但这类栈通常值得优先排查，因为它可能映射到 MergeTree 事务提交边界条件。

### 2) 交互式查询断连后继续后台完成
- [#49683 Allow interactive queries finish in the background](ClickHouse/ClickHouse Issue #49683)
- 评论：15，👍 43
- 分析：
  - 这是今天**用户价值最明确、反应最高**的话题之一；
  - 核心诉求是把 ClickHouse 从“连接绑定执行”进一步推进到“任务化执行”；
  - 对长时间 `INSERT ... SELECT`、BI 会话、Notebook、代理层超时都很重要。
- 路线图信号：这是很强的产品级需求，长期看有进入主版本的潜力。

### 3) 时序分区表的自动谓词优化
- [#99960 Automatically Optimize Queries on Time-Partitioned Tables](ClickHouse/ClickHouse Issue #99960)
- 评论：10
- 分析：
  - 用户希望系统自动将 `timestamp` 上的范围条件映射到排序键上的单调函数表达式，比如 `toStartOfHour(timestamp)`；
  - 这与当前多个 part pruning / top-k pruning PR 高度同向，说明**优化器自动推导能力**是当前热点。

### 4) 对对象存储异步删除行为的强烈反馈
- [#99996 Add option to return syncrhonous deletion blob storage data during DROP TABLE ... SYNC execution](ClickHouse/ClickHouse Issue #99996)
- 评论：4
- 分析：
  - 评论不算多，但措辞强烈，反映的是**生产行为语义变化**；
  - 这是典型“用户不一定反对优化实现，但需要严格语义保证与可配置性”的案例。

### 5) 新 SQL 能力：CREATE HANDLER
- [#100000 Implement CREATE HANDLER query](ClickHouse/ClickHouse Issue #100000)
- 评论：3
- 分析：
  - 试图通过 SQL 管理 HTTP handler，而非编辑配置文件；
  - 这释放出一个明显方向：**将更多服务端控制面能力 SQL 化/声明式化**。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 高优先级崩溃与未定义行为

#### 1) 事务日志提交阶段 CI 崩溃
- [#85468 Transaction log finalize failed during commit](ClickHouse/ClickHouse Issue #85468)
- 状态：Open
- 是否已有 fix PR：**未见直接关联 PR**
- 影响判断：
  - 涉及事务提交 finalize，若可在真实负载复现，风险高；
  - 当前仍需关注是否只是 CI 特定路径。

#### 2) multi_index 中 MergeTreeDataPartCompact 双重删除
- [#99799 [CI crash] Double deletion of MergeTreeDataPartCompact in multi_index](ClickHouse/ClickHouse Issue #99799)
- 状态：Open
- 是否已有 fix PR：**未见直接关联 PR**
- 影响判断：
  - 双重释放属于典型内存安全问题；
  - 与数据 part 生命周期管理相关，需优先关注。

#### 3) AST Fuzzer / UBSan 未定义行为
- [#100052 UndefinedBehaviorSanitizer: undefined behavior (STID: 2527-362b)](ClickHouse/ClickHouse Issue #100052)
- 状态：Open
- 是否已有 fix PR：部分同类问题今天有修复动作，如 [#99697](ClickHouse/ClickHouse PR #99697)、[#99539](ClickHouse/ClickHouse PR #99539)，但**非该 issue 的直接 fix**
- 影响判断：
  - 虽多出现在 fuzz/sanitizer 环境，但经常是潜在正确性或崩溃隐患前兆。

### P1 / 用户可见回归与兼容性问题

#### 4) v26 语法回归：DESCRIBE TABLE 子查询别名失效
- [#100031 DESCRIBE TABLE (...) AS <alias> syntax broken since version 26](ClickHouse/ClickHouse Issue #100031)
- 状态：Open
- 是否已有 fix PR：**未见直接关联**
- 影响判断：
  - 属于升级后显式回归；
  - 会影响依赖 SQL introspection 的工具和自动化脚本。

#### 5) Arrow 路径写 Parquet 时 UUID 逻辑类型丢失
- [#100119 Arrow-based Parquet writer does not set UUID logical type in schema](ClickHouse/ClickHouse Issue #100119)
- 状态：Open
- 是否已有 fix PR：**未见直接关联**
- 影响判断：
  - 不一定导致本地读取错误，但会破坏跨系统 schema 语义；
  - 对数据湖/多引擎互通用户影响较大。

#### 6) 查询参数解析忽略 format settings
- [#95913 Query parameter parsing ignores format settings](ClickHouse/ClickHouse Issue #95913)
- 状态：Open
- 是否已有 fix PR：**未见直接关联**
- 影响判断：
  - 直接影响 ADBC/Arrow 客户端参数化查询的类型精度与语义一致性。

### P2 / 已关闭问题，显示稳定性治理仍在推进

#### 7) 角色修改触发服务崩溃
- [#99810 Server crashes (std::terminate) on role change when disallow_config_defined_profiles_for_sql_defined_users is enabled](ClickHouse/ClickHouse Issue #99810)
- 状态：Closed
- 意义：访问控制路径上的崩溃已被处理，表明权限/配置交叉场景正在补洞。

#### 8) Analyzer/Fuzzer 逻辑错误已关闭
- [#83442 Logical error: Unexpected node type for table expression ... IDENTIFIER](ClickHouse/ClickHouse Issue #83442)
- 状态：Closed

#### 9) 多个 flaky tests 已关闭
- [#92129](ClickHouse/ClickHouse Issue #92129)
- [#92486](ClickHouse/ClickHouse Issue #92486)
- [#94656](ClickHouse/ClickHouse Issue #94656)
- [#93160](ClickHouse/ClickHouse Issue #93160)
- [#92347](ClickHouse/ClickHouse Issue #92347)
- 说明：测试噪音虽高，但维护者对 CI 稳定性仍在持续清理。

---

## 6. 功能请求与路线图信号

### 高可能性进入后续版本的方向

#### 1) 更激进的查询裁剪与自动优化
- Issue: [#99960 Automatically Optimize Queries on Time-Partitioned Tables](ClickHouse/ClickHouse Issue #99960)
- 对应 PR 信号：
  - [#94140 Add statistics-based part pruning](ClickHouse/ClickHouse PR #94140)
  - [#99533 Prune parts for `ORDER BY LIMIT` queries on partitioned tables](ClickHouse/ClickHouse PR #99533)
  - [#99537 Enable top-k dynamic filtering by default](ClickHouse/ClickHouse PR #99537)
- 判断：
  - 这是今天最强的一条路线图主线；
  - 优化器“自动推导过滤条件 → 更少读 part/mark”明显会继续增强。

#### 2) 分布式与并行副本调度可控性
- PR:
  - [#100139 Add parallel_replicas_prefer_local_replica setting](ClickHouse/ClickHouse PR #100139)
  - [#100141 Allow skipping local shard with missing table when `skip_unavailable_shards` is enabled](ClickHouse/ClickHouse PR #100141)
  - [#100146 Fix distributed task iterator ... with parallel replicas](ClickHouse/ClickHouse PR #100146)
- 判断：
  - 并行副本已不只是“提速功能”，而是在向**生产可控、负载均衡、容错一致性**迈进；
  - 预计 26.3 附近会继续有相关参数和修复。

### 中长期需求信号

#### 3) 交互式查询后台完成
- [#49683 Allow interactive queries finish in the background](ClickHouse/ClickHouse Issue #49683)
- 判断：
  - 高点赞、高场景价值；
  - 若落地，可能伴随 query lifecycle、session detach、结果持久化等设计变化；
  - 更像中期功能，不太像短平快补丁。

#### 4) Remote database engine
- [#59304 `Remote` database engine](ClickHouse/ClickHouse Issue #59304)
- 判断：
  - 与现有 MySQL/PostgreSQL engine 类比，需求明确；
  - 若推进，将补足跨 ClickHouse 集群/实例的数据库级接入能力。

#### 5) CREATE HANDLER
- [#100000 Implement CREATE HANDLER query](ClickHouse/ClickHouse Issue #100000)
- 判断：
  - 是很有“平台化”意味的能力；
  - 适合 Cloud/托管场景，也利于统一运维；
  - 但涉及安全与配置生命周期，预计设计审慎。

#### 6) clickhouse-keeper 递归列目录请求
- [#99916 Introduce `getChildrenRecursive` request for clickhouse-keeper and keeper client](ClickHouse/ClickHouse Issue #99916)
- 判断：
  - 属于 keeper API 补强；
  - 对大规模元数据列举、树形目录递归读取有实用价值。

#### 7) PostgreSQL engine 设置支持
- [#52343 Add settings for PostgreSQL engine](ClickHouse/ClickHouse Issue #52343)
- 判断：
  - 属于长期积压但需求合理的连接器补齐项；
  - 若有人领任务，进入某个次版本的概率不低。

---

## 7. 用户反馈摘要

### 1) 用户希望 ClickHouse 更“任务化”，而非仅“连接存活驱动”
- 代表问题：[#49683](ClickHouse/ClickHouse Issue #49683)
- 痛点：
  - 长时间 `INSERT SELECT` 因客户端断线被取消；
  - BI/Notebook/网关类场景对连接稳定性过度敏感。
- 用户真实诉求：
  - 查询应能脱离会话持续执行；
  - 至少应提供显式后台运行模式。

### 2) 用户对对象存储语义变化非常敏感
- 代表问题：[#99996](ClickHouse/ClickHouse Issue #99996)
- 痛点：
  - `DROP TABLE ... SYNC` 无法再作为“数据已物理清除”的可靠信号；
  - 影响外部工作流、审计与存储成本治理。
- 反馈意义：
  - 对存储优化类改动，用户更看重**语义稳定和可配置性**。

### 3) 用户希望优化器理解时间表达式与排序键的关系
- 代表问题：[#99960](ClickHouse/ClickHouse Issue #99960)
- 痛点：
  - 表按 `toStartOfHour(timestamp)` 排序，但 WHERE 使用原始 `timestamp` 范围时无法自动发挥最佳裁剪效果。
- 反馈意义：
  - 用户已不满足于“手工改写 SQL 才快”，希望系统自己做等价推导。

### 4) 跨格式/跨生态兼容性仍是实际生产问题
- 代表问题：
  - [#100119](ClickHouse/ClickHouse Issue #100119)
  - [#95913](ClickHouse/ClickHouse Issue #95913)
- 痛点：
  - Arrow / Parquet / ADBC 的 schema 与参数语义不一致；
  - 这类问题常不是“读不出来”，而是“跨系统行为微妙出错”。

---

## 8. 待处理积压

以下议题值得维护者重点关注：

### 1) 高热度长期特性：后台继续执行交互式查询
- [#49683 Allow interactive queries finish in the background](ClickHouse/ClickHouse Issue #49683)
- 原因：
  - 创建于 2023-05-09，至今仍活跃；
  - 点赞高、用户面广，具备明显产品价值。

### 2) Remote database engine
- [#59304 `Remote` database engine](ClickHouse/ClickHouse Issue #59304)
- 原因：
  - 创建于 2024-01-28；
  - 虽评论不多，但方向清晰，能补齐跨实例访问能力。

### 3) PostgreSQL engine 设置支持
- [#52343 Add settings for PostgreSQL engine](ClickHouse/ClickHouse Issue #52343)
- 原因：
  - 创建于 2023-07-20；
  - 属于连接器能力完善型需求，用户预期明确。

### 4) 统计裁剪 PR 值得优先审阅
- [#94140 Add statistics-based part pruning](ClickHouse/ClickHouse PR #94140)
- 原因：
  - 这是潜在高收益的查询优化增强；
  - 若设计稳定，能与当前多条 pruning 优化形成体系。

### 5) 序列化对象池 PR 值得关注风险与收益平衡
- [#96563 Added a serialization object pool](ClickHouse/ClickHouse PR #96563)
- 原因：
  - 涉及共享对象与类型命名唯一性；
  - 性能潜力明显，但也可能带来 subtle correctness 风险，值得深入 review。

---

## 附：今日重点链接清单

- Releases  
  - [v26.2.5.45-stable](ClickHouse/ClickHouse Release v26.2.5.45-stable)  
  - [v26.1.5.41-stable](ClickHouse/ClickHouse Release v26.1.5.41-stable)  
  - [v25.8.19.20-lts](ClickHouse/ClickHouse Release v25.8.19.20-lts)  

- 热点 Issues  
  - [#85468](ClickHouse/ClickHouse Issue #85468)  
  - [#49683](ClickHouse/ClickHouse Issue #49683)  
  - [#99960](ClickHouse/ClickHouse Issue #99960)  
  - [#99996](ClickHouse/ClickHouse Issue #99996)  
  - [#100119](ClickHouse/ClickHouse Issue #100119)  
  - [#100031](ClickHouse/ClickHouse Issue #100031)  

- 重点 PR  
  - [#94140](ClickHouse/ClickHouse PR #94140)  
  - [#99495](ClickHouse/ClickHouse PR #99495)  
  - [#99533](ClickHouse/ClickHouse PR #99533)  
  - [#99537](ClickHouse/ClickHouse PR #99537)  
  - [#100139](ClickHouse/ClickHouse PR #100139)  
  - [#100141](ClickHouse/ClickHouse PR #100141)  
  - [#100146](ClickHouse/ClickHouse PR #100146)  
  - [#99697](ClickHouse/ClickHouse PR #99697)  
  - [#99823](ClickHouse/ClickHouse PR #99823)  
  - [#99657](ClickHouse/ClickHouse PR #99657)  

如果你愿意，我还可以继续把这份日报整理成更适合内部周报/飞书通知的 **“管理层摘要版”** 或 **“研发跟进版（按模块分类）”**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-20

## 1. 今日速览

过去 24 小时 DuckDB 社区保持高活跃：Issues 更新 78 条、PR 更新 42 条，说明当前项目处于持续高频迭代状态，尤其集中在 **Parquet/S3 访问路径、查询优化器、存储层正确性** 和 **SQL 语义边界** 上。  
今天没有新版本发布，但有多条 PR 在 3 月 19 日被关闭/合并，显示维护者正在加快修复 **存储编码、指标统计、Parquet 配置项** 等细节问题。  
从热点讨论看，用户最关心的仍是 **对象存储上的性能回归与稳定性**、**复杂 SQL 语义的一致性**、以及 **大规模数据场景下的资源使用**。  
整体健康度评价：**活跃且工程推进扎实，但 1.5.x 周期的远程存储与执行计划回归问题仍值得持续警惕**。

---

## 3. 项目进展

### 今日已合并/关闭的重点 PR

#### 1) 修复字符串存储回滚时字典大小未恢复问题
- 链接: duckdb/duckdb PR #21489
- 状态: CLOSED
- 影响方向: **存储引擎正确性 / 写入回滚一致性**

该 PR 修复了在未压缩字符串存储中，发生主键冲突导致 append 回滚时，字符串字典大小未同步回退的问题。  
这类问题虽然未必立刻导致查询错误，但会造成 **存储元数据与实际引用状态不一致**，长期可能影响空间管理、统计信息甚至调试复杂度。  
这说明 DuckDB 团队正在继续补强 **事务冲突路径下的存储一致性**。

---

#### 2) 修复存储层整数解码溢出检测
- 链接: duckdb/duckdb PR #21482
- 状态: CLOSED
- 影响方向: **存储解码安全性 / 正确性**

该 PR 修复了从存储层解码整数时的溢出检测问题。  
这类修复通常优先级较高，因为它涉及：
- 数据页读取的健壮性
- 边界值处理
- 潜在的数据损坏或错误结果风险

虽然摘要未展开，但从标题看属于典型的 **底层数据正确性修复**。

---

#### 3) 修复 TOTAL_BYTES_WRITTEN 指标错误
- 链接: duckdb/duckdb PR #21504
- 状态: CLOSED
- 影响方向: **可观测性 / profiler / 进度统计**

该修复针对 `TOTAL_BYTES_WRITTEN` 指标统计错误。  
这与今天仍处于打开状态的两个相关 PR 一起看，说明团队正在系统性整理 **写入字节统计、进度条、profiler 展示**：
- duckdb/duckdb PR #21501
- duckdb/duckdb PR #21502

对于依赖 DuckDB 做批处理、导出、远程写入的用户，这类指标准确性会直接影响：
- 性能评估
- 资源归因
- 用户界面上的进度反馈

---

#### 4) Parquet 写出新增时间戳 UTC 调整配置
- 链接: duckdb/duckdb PR #20976
- 状态: CLOSED
- 影响方向: **Parquet 兼容性 / 跨系统数据交换**

该 PR 为 Parquet `COPY` 增加了 `timestamp_notz_adjusted_to_utc` 配置项，使无时区时间戳写出时可配置 `isAdjustedToUTC`。  
这对以下场景非常重要：
- 与预定义 Parquet schema 对接
- 和 Spark / Arrow / 数据湖生态互通
- 避免时间戳逻辑解释不一致

这是一个典型的 **湖仓互操作性增强**，很可能会被下游工具链用户直接受益。

---

### 今日仍在推进的重点 PR

#### 5) 支持对 struct/variant extract 做 filter pushdown
- 链接: duckdb/duckdb PR #21498
- 状态: OPEN
- 影响方向: **查询优化 / 半结构化数据性能**

该 PR 允许对 pushdown extract 列索引启用过滤下推，从而可以在 `struct extract` 和 `variant extract` 上做过滤优化。  
如果落地，将显著改善以下查询：
- 只筛选嵌套字段的半结构化数据查询
- JSON/variant 风格列上的选择型扫描
- 减少不必要的数据物化与上层过滤

这是很明确的 **下一阶段优化器能力增强信号**。

---

#### 6) 为 Parquet MAP 列增加 row-group skipping 支持
- 链接: duckdb/duckdb PR #21375
- 状态: OPEN
- 影响方向: **Parquet 读取优化 / 列式存储裁剪**

当前 DuckDB 对 MAP 列的统计支持不足，会阻碍 row group skipping。  
该 PR 目标是：即使存在 MAP 列，也不应妨碍对其他列做统计裁剪。  
这将直接提升包含复杂嵌套 schema 的 Parquet 数据集扫描效率，是 **分析型存储读取优化** 的重要增量。

---

#### 7) 将 COPY TO 文件写出迁移到 Prepare/Flush Batch API
- 链接: duckdb/duckdb PR #21480
- 状态: OPEN
- 影响方向: **导出路径透明性 / 文件写出控制 / 潜在内存优化**

该 PR 计划把 `PhysicalCopyToFile` 迁移到新的 Prepare/Flush Batch API。  
意义在于：
- 写出算子可以明确感知每个文件写入了多少数据
- 比原有 opaque 的 Sink/Combine API 更透明
- 为控制文件大小、顺序写、批量 flush 策略提供基础

结合长期热点 Issue #3316，这一方向可能正是解决 **COPY TO 生成 Parquet 文件过大** 等问题的基础设施改造。

---

#### 8) 引入 WindowFunctionCatalogEntry
- 链接: duckdb/duckdb PR #21446
- 状态: OPEN
- 影响方向: **Catalog 架构演进 / 窗口函数元数据**

该 PR 把窗口函数从 mock catalog entry 替换为真正的一类 catalog entry。  
这类工作虽然用户感知较弱，但往往是：
- 完善函数元数据系统
- 支持更统一的 introspection / serialization
- 为后续 SQL 扩展打底

属于 **内核架构升级型改造**。

---

#### 9) DML 进入 QueryNode AST
- 链接: duckdb/duckdb PR #21505
- 状态: OPEN
- 影响方向: **SQL 前端架构 / AST 统一 / 序列化**

该 PR 为 `INSERT/UPDATE/DELETE` 增加 QueryNode 变体。  
这将帮助 DuckDB：
- 统一 DML 与 SELECT 类语句的 AST 处理
- 改善序列化与 CTE 风格绑定路径
- 为后续更复杂 SQL 语法与优化框架铺路

这是明显的 **SQL 编译器基础设施建设**。

---

## 4. 社区热点

### 1) COPY TO 导出的 Parquet 文件明显偏大
- 链接: duckdb/duckdb Issue #3316
- 状态: OPEN
- 评论: 34

这是今日评论最多的 Issue。问题核心是：DuckDB 的 `COPY TO` 生成的 Parquet 文件比 `pyarrow.parquet.write_table()` 大得多。  
背后的技术诉求包括：
- Parquet 编码策略与压缩率优化
- row group / page / dictionary 编码选择
- 导出路径可控性与与生态工具的一致性

结合 PR #21480，可看出社区对 **高质量 Parquet 导出** 的需求非常稳定且长期存在。

---

### 2) 小表 join 却极慢，怀疑 join 算法选择失误
- 链接: duckdb/duckdb Issue #10037
- 状态: OPEN
- 评论: 24

这是一个典型的查询优化器热点：数据规模不大，但计划选择导致执行非常慢。  
用户诉求指向：
- join algorithm selection
- cardinality estimation
- cost model 稳定性
- 特定查询形态下的退化路径识别

这类问题对 OLAP 数据库尤其关键，因为它会削弱用户对 “ad hoc SQL 很快” 的信心。

---

### 3) ODBC 驱动未正确处理数据库路径
- 链接: duckdb/duckdb Issue #11380
- 状态: OPEN
- 评论: 21

ODBC 路径解析问题说明 DuckDB 在 BI/ETL 工具接入链路上仍有边缘兼容性缺口。  
这类问题虽然不属于执行引擎核心，但直接影响：
- dbt
- 桌面 BI 工具
- 企业驱动接入场景

说明 DuckDB 社区正在从“嵌入式分析引擎”继续向“标准 SQL 连接生态节点”扩展。

---

### 4) 扩展排序规则支持
- 链接: duckdb/duckdb Issue #604
- 状态: OPEN
- 评论: 20

这是一个非常长期、仍持续活跃的话题。  
需求涉及：
- DISTINCT 聚合中的 collation
- LIKE/REGEX 的 NOCASE 支持
- index 中的 collation
- GREATEST/LEAST 等表达式中的排序规则

这表明 DuckDB 在 **国际化文本处理与 SQL 标准细节兼容** 上仍有路线图空间。

---

### 5) CASE 中不应允许 UNNEST
- 链接: duckdb/duckdb Issue #13466
- 状态: OPEN
- 评论: 15

用户发现 `CASE` 的 THEN 分支会被非严格地处理，从而让 `unnest(generate_series(...))` 一类表达式产生违反直觉的结果。  
该问题本质上反映了：
- 标量/集合表达式边界
- CASE 惰性求值语义
- binder/type checker 对 set-returning function 的限制不足

这类问题影响 SQL 语义可预测性，属于高级用户关注的正确性热点。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### 高优先级：对象存储 / S3 / Hive 分区回归与稳定性

#### A. 1.5.0 中 Hive 分区过滤先发现全部文件再裁剪
- 链接: duckdb/duckdb Issue #21347
- 状态: CLOSED

该问题描述 1.5.0 在 S3 上读取 Hive 分区 Parquet 时，先枚举所有文件再做分区过滤，而 1.4.4 似乎只访问匹配文件。  
影响非常直接：
- S3 list / HEAD / GET 成本上升
- 延迟上升
- 大目录场景体验显著退化

虽已关闭，但它是 1.5.x 周期需要持续回归验证的代表问题。

---

#### B. `QUALIFY ROW_NUMBER() ... = 1` 在 1.5.0 上导致 S3 请求量暴增约 50 倍
- 链接: duckdb/duckdb Issue #21348
- 状态: CLOSED

该回归从 ~80 次 GET 激增到 4200+，且墙钟时间接近三倍。  
这说明窗口函数 + QUALIFY + Hive Parquet 的组合，在新版本上可能触发了不理想的计划或下推失效。  
虽然 issue 已关闭，但对生产用户是很重要的 **性能回归信号**。

---

#### C. S3 wildcard 读取时 ETag 误判变更
- 链接: duckdb/duckdb Issue #21401
- 状态: OPEN

`read_parquet()` 使用 S3 兼容对象存储时，DuckDB 报告文件 ETag 变化，但新旧值仅引号形式不同。  
这属于明显的远程存储兼容性 bug，影响：
- S3-compatible 存储接入
- 大规模通配读取稳定性
- 增量/缓存逻辑可信度

目前未见对应 fix PR 出现在给定列表中，值得关注。

---

#### D. S3 glob 遇到 503 Slowdown 未做退避
- 链接: duckdb/duckdb Issue #6153
- 状态: OPEN

面对大量文件 glob 请求时，S3 返回 503 Slowdown，当前行为是直接失败而非指数退避。  
这类 bug 在大规模数据湖扫描场景中会显著放大，是 **云上稳定性** 关键缺口。  
尚未看到今日直接修复 PR。

---

#### E. 分区 COPY 到 S3 时内存占用异常高
- 链接: duckdb/duckdb Issue #11817
- 状态: OPEN

用户反馈仅 30 个分区、每分区 1k 行，在 2GiB 限制下就可能 OOM。  
这说明：
- 分区写出过程中缓冲/并发策略可能偏激进
- 内存与文件句柄/批次管理需要优化

与 PR #21480 的写出管线改造可能存在潜在关联，但目前尚非直接 fix。

---

### 中优先级：查询正确性 / SQL 语义

#### F. CASE 中允许 UNNEST 导致违反直觉结果
- 链接: duckdb/duckdb Issue #13466
- 状态: OPEN

属于 SQL 语义与 binder 约束不足问题。  
和 #14012 一起看，DuckDB 对 set-returning function 在表达式上下文中的限制可能仍需收紧。

---

#### G. `generate_series` 在 CASE 中触发静态类型检查问题
- 链接: duckdb/duckdb Issue #14012
- 状态: OPEN

表明类型系统与集合函数位置约束仍存在缺口，可能需要文档+行为双修复。

---

#### H. `TRY_CAST(1::BIT AS SMALLINT)` 抛错，与文档不符
- 链接: duckdb/duckdb Issue #13097
- 状态: OPEN

这是明显的 **文档-实现不一致**。  
对用户来说，`TRY_CAST` 的可预测性非常重要，因为它经常被用于脏数据清洗。

---

#### I. `DROP TABLE IF EXISTS` 遇到同名 VIEW 失败
- 链接: duckdb/duckdb Issue #13620
- 状态: OPEN

这属于 DDL 兼容性与错误语义问题。  
虽然不致命，但影响自动化部署、幂等建模脚本和迁移工具。

---

#### J. 使用 `random()` 的非相关子查询重复结果
- 链接: duckdb/duckdb Issue #13639
- 状态: OPEN

涉及非确定性函数在优化/重写中的求值时机。  
如果属实，会影响模拟、采样、测试类 SQL 的正确性预期。

---

### 中低优先级：格式、驱动、构建与兼容性

#### K. C++ UDF 遇到回车字符导致 fatal crash
- 链接: duckdb/duckdb Issue #13500
- 状态: OPEN

这是开发者扩展接口上的稳定性问题，若可复现应优先避免“崩溃”而改为报错。

#### L. 处理 `list<struct>` 嵌套 Parquet 时卡死
- 链接: duckdb/duckdb Issue #13822
- 状态: OPEN

涉及复杂嵌套 Parquet schema 的读取稳定性，影响地图、日志、事件等现代数据集。

#### M. 大 JSON 无法解析
- 链接: duckdb/duckdb Issue #14204
- 状态: OPEN

与大对象流式解析、内存管理有关。

#### N. ODBC 路径处理错误
- 链接: duckdb/duckdb Issue #11380
- 状态: OPEN

影响外部工具集成。

#### O. 1.1 在 Raspberry Pi 上链接 atomic 失败
- 链接: duckdb/duckdb Issue #13855
- 状态: OPEN

属于平台构建兼容性问题。

#### P. `inet_extension.hpp` 缺失导致构建失败
- 链接: duckdb/duckdb Issue #13971
- 状态: OPEN

反映扩展头文件打包/构建说明仍有边缘问题。

---

## 6. 功能请求与路线图信号

### 可能进入下一版本或后续周期的方向

#### 1) 临时 catalog 中支持创建 schema
- 链接: duckdb/duckdb PR #19969

该 PR 允许 `CREATE SCHEMA temp.foobar`，让临时对象可以被更好地命名空间化。  
这对复杂会话、多阶段中间结果管理很有价值，尤其适合：
- Notebook
- dbt-like 工作流
- 复杂 ETL 临时表组织

属于用户可感知度很高的 SQL 能力增强。

---

#### 2) CREATE TRIGGER 的 catalog 存储与 introspection
- 链接: duckdb/duckdb PR #21438

该 PR 不只是语法支持，而是把 trigger 作为一等 catalog entry 管理。  
这意味着 DuckDB 在往更完整的数据库对象系统推进。  
如果后续继续完善执行语义，这会是明显的 **数据库特性扩展信号**。

---

#### 3) Window function catalog 正式化
- 链接: duckdb/duckdb PR #21446

说明函数系统和 catalog 正在进一步规范化。  
长期看有利于：
- introspection
- 扩展开发
- 统一函数注册机制

---

#### 4) 复杂类型上的 filter pushdown
- 链接: duckdb/duckdb PR #21498

这是性能路线图里的明确信号：DuckDB 正在把优化能力向 **struct / variant / 半结构化字段** 延伸。  
这通常意味着未来对 JSON、嵌套列、现代 lakehouse schema 的查询体验会继续提升。

---

#### 5) Parquet 复杂类型扫描裁剪增强
- 链接: duckdb/duckdb PR #21375

针对 MAP 列的 row group skipping 说明团队非常关注“复杂 schema 不应拖累整表扫描优化”。  
这非常符合 DuckDB 作为湖上分析引擎的演化方向。

---

#### 6) Linux CLI 增加 riscv64 发布构建
- 链接: duckdb/duckdb PR #21496

这是平台覆盖面的扩展信号。  
虽然不是核心功能，但说明社区对更多 CPU 架构支持有实际需求。

---

### 长期功能诉求

#### 7) 更完整的 collation 支持
- 链接: duckdb/duckdb Issue #604

属于长期路线图候选项。  
若要深入企业/国际化文本分析场景，这是迟早要补齐的能力。

---

## 7. 用户反馈摘要

### 1) 云上数据湖用户最在意“请求数”和“计划退化”
多个热点都围绕 S3/Hive 分区：
- duckdb/duckdb Issue #21347
- duckdb/duckdb Issue #21348
- duckdb/duckdb Issue #21401
- duckdb/duckdb Issue #6153
- duckdb/duckdb Issue #11817

可以看出，用户已经不只是关心查询能不能跑通，而是非常关注：
- 会不会多扫文件
- 会不会多发 HTTP 请求
- 会不会错误判定文件变化
- 会不会在写出时爆内存

这说明 DuckDB 在云对象存储场景中已进入 **性能与稳定性精细化要求阶段**。

---

### 2) 高级 SQL 用户对语义一致性要求提升
相关问题包括：
- duckdb/duckdb Issue #13466
- duckdb/duckdb Issue #14012
- duckdb/duckdb Issue #13639
- duckdb/duckdb Issue #13097
- duckdb/duckdb Issue #13620

这些反馈表明，越来越多用户把 DuckDB 当作严肃 SQL 引擎使用，而不仅是“方便的数据帧后端”。  
他们关心的是：
- CASE 是否短路
- set-returning function 是否被严格限制
- TRY_CAST 是否绝不抛错
- DDL 是否幂等
- 非确定函数是否被错误缓存/提升

---

### 3) 数据交换与生态兼容是持续痛点
相关问题与 PR：
- duckdb/duckdb Issue #3316
- duckdb/duckdb Issue #11380
- duckdb/duckdb PR #20976

用户在意的不只是本地查询性能，还有：
- Parquet 写出质量是否接近 PyArrow
- ODBC 是否能稳定接入 BI / dbt
- 时间戳元数据是否能对接外部 schema 体系

这说明 DuckDB 的核心竞争力正在从“单机快”扩展到“生态互操作性好”。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期未解、但仍持续活跃的问题：

### 1) Parquet 导出体积偏大
- 链接: duckdb/duckdb Issue #3316
- 创建时间: 2022-03-29
- 状态: OPEN

这是一个跨多年仍在讨论的问题，且直接影响 DuckDB 作为数据导出引擎的口碑。  
建议结合 PR #21480 的写出架构改造持续推进。

---

### 2) 扩展排序规则支持
- 链接: duckdb/duckdb Issue #604
- 创建时间: 2020-04-29
- 状态: OPEN

这是典型的长期能力缺口，涉及 SQL 标准兼容与国际化文本分析。

---

### 3) S3 Slowdown 重试机制缺失
- 链接: duckdb/duckdb Issue #6153
- 创建时间: 2023-02-08
- 状态: OPEN

对象存储大规模访问是 DuckDB 关键场景之一，该问题拖延过久会持续影响生产可用性。

---

### 4) 小表 join 计划异常缓慢
- 链接: duckdb/duckdb Issue #10037
- 创建时间: 2023-12-19
- 状态: OPEN

优化器对用户体验影响极大，这类“反直觉慢查询”应尽量减少长期悬而未决。

---

### 5) XDG Base Directory 规范支持
- 链接: duckdb/duckdb Issue #11779
- 创建时间: 2024-04-23
- 状态: OPEN

虽然不属于核心执行引擎问题，但有 9 个 👍，表明 CLI/桌面开发者社区对开发体验较为敏感。

---

### 6) 分区 COPY 到 S3 的高内存问题
- 链接: duckdb/duckdb Issue #11817
- 创建时间: 2024-04-24
- 状态: OPEN

这类问题如果不解决，会限制 DuckDB 在“直接导出到对象存储”场景中的可用规模。

---

## 总结

今日 DuckDB 没有版本发布，但工程活动非常密集。已关闭的 PR 主要集中在 **存储正确性、指标统计、Parquet 兼容性**；打开中的关键 PR 则清晰指向 **复杂类型 filter pushdown、Parquet 复杂 schema 优化、文件写出架构升级、SQL/catalog 基础设施演进**。  
社区热点依旧由 **S3/Parquet/对象存储性能与稳定性** 主导，其次是 **SQL 语义一致性** 与 **生态兼容性**。  
如果以项目健康度衡量，DuckDB 仍保持强劲迭代势头；但从用户反馈密度看，**1.5.x 周期的远程访问回归风险和长期积压的存储/兼容性议题**，仍是接下来最值得维护者优先投入的方向。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时 StarRocks 维持**高活跃度**：Issues 更新 9 条、PR 更新 137 条，说明项目在 bug 修复、文档回补和多分支 backport 上推进明显。  
当日**无新版本发布**，但从大量文档类 PR、稳定性修复及跨 3.5/4.0/4.1 分支回合并来看，团队当前重心仍偏向**发布线维护与线上可用性提升**。  
Issues 侧出现了多条值得警惕的**查询正确性与崩溃类问题**，尤其涉及 Join、Iceberg metadata cache、JSON 解析写入路径和外表文件读取，反映出执行引擎与外部湖仓集成仍是当前风险集中区。  
整体判断：**项目健康度良好，但 correctness/stability 风险信号偏强**，建议维护者优先关注“错误结果”与“BE 崩溃”类问题。

---

## 3. 项目进展

> 注：今日数据中展示的已关闭/已合并 PR 以文档修复和 backport 为主，但仍能看出若干对查询引擎、存储行为和 SQL 兼容性的重要推进。

### 3.1 查询优化与正确性修复

#### 1) 修复 Partition.hasStorageData 假设导致的优化/刷新错误
- PR: [#69751](https://github.com/StarRocks/starrocks/pull/69751)  
- Backport: [#70259](https://github.com/StarRocks/starrocks/pull/70259)

**进展解读：**  
该修复针对 `PartitionColumnMinMaxRewriteRule` 以及部分物化视图刷新逻辑对“partition visibleVersion > initVersion 即认为有数据”的错误假设。  
这类问题会直接影响：
- 分区裁剪和 min/max 重写的正确性
- MV refresh 的判断逻辑
- 空分区或特殊分区状态下的执行行为

这是一个典型的**优化器语义假设修正**，价值不在性能本身，而在**避免错误推导引发错误结果或错误刷新**。并且该修复已进入多个版本线，说明维护者认定其具备较高线上影响面。

---

#### 2) 修复 Iceberg 物化视图在 snapshot 过期后的重复刷新问题
- PR: [#70523](https://github.com/StarRocks/starrocks/pull/70523)（OPEN）

**进展解读：**  
该 PR 处理 Iceberg 基表 snapshot 过期后，`last_updated_snapshot_id` 变为 null 导致 MV refresh 失败并可能重复刷新的问题。  
这说明 StarRocks 对 Iceberg 的集成正在从“能读能刷”进一步走向“**生命周期异常场景可恢复**”，尤其适合：
- 开启 snapshot expiration 的数据湖场景
- 长周期物化视图同步
- 湖仓混合数仓任务

若该 PR 合入，将提升 StarRocks 在**外部表/湖格式增量刷新语义**上的稳定性。

---

### 3.2 存储与云原生元数据处理优化

#### 3) 为 cloud native tablet metadata fetch 引入专用线程池
- 原始 PR backport 展示: [#70524](https://github.com/StarRocks/starrocks/pull/70524), [#70525](https://github.com/StarRocks/starrocks/pull/70525)

**进展解读：**  
摘要显示此前 lake metadata fetch（如 `get_tablet_stats`、`get_tablet_metadatas`）与其他任务共享 `UPDATE_TABLET_META_INFO` 线程池，可能造成争用并影响 repair 效率。  
引入专用线程池意味着：
- 云原生表元数据拉取与其他后台任务解耦
- 降低维修/修复任务被阻塞概率
- 改善 shared-data / lakehouse 场景下的元数据服务稳定性

这属于**典型的后台资源隔离优化**，不是用户界面层面的特性，但对大规模集群稳定性很关键。

---

### 3.3 运维与文档体验改进

#### 4) 新增更新 BE Dynamic Config 的方法说明
- PR: [#70532](https://github.com/StarRocks/starrocks/pull/70532)
- Backports: [#70544](https://github.com/StarRocks/starrocks/pull/70544), [#70545](https://github.com/StarRocks/starrocks/pull/70545), [#70546](https://github.com/StarRocks/starrocks/pull/70546), [#70547](https://github.com/StarRocks/starrocks/pull/70547)

**进展解读：**  
虽然是文档类 PR，但它释放了明确的产品信号：**BE 动态配置在线调整能力正在被强化和标准化**。  
对运维团队的意义：
- 降低改配置需重启的认知成本
- 提高线上参数调优效率
- 有利于性能压测和故障处置的 SOP 化

---

#### 5) 修正文档中 Resource Group 描述
- PR: [#70528](https://github.com/StarRocks/starrocks/pull/70528)
- Backports: [#70548](https://github.com/StarRocks/starrocks/pull/70548), [#70549](https://github.com/StarRocks/starrocks/pull/70549), [#70550](https://github.com/StarRocks/starrocks/pull/70550), [#70551](https://github.com/StarRocks/starrocks/pull/70551)

**进展解读：**  
Resource Group 是 StarRocks 多租户资源隔离、查询治理的重要能力。文档修正虽然不改变功能，但往往意味着：
- 现有描述存在歧义或误导
- 用户在资源组使用中已有理解偏差
- 团队正加强资源治理特性的可操作性表达

---

#### 6) FE config 文档过大导致搜索不可用
- PR: [#70474](https://github.com/StarRocks/starrocks/pull/70474)
- Backports closed with conflicts: [#70552](https://github.com/StarRocks/starrocks/pull/70552), [#70553](https://github.com/StarRocks/starrocks/pull/70553), [#70554](https://github.com/StarRocks/starrocks/pull/70554), [#70555](https://github.com/StarRocks/starrocks/pull/70555)

**进展解读：**  
这暴露出 StarRocks 文档体系的一个现实问题：**配置项规模已大到影响检索与导航体验**。  
从项目治理角度看，这是成熟项目常见的“文档复杂度债务”，后续可能推动：
- FE 配置按主题拆分
- Edition-specific 内容抽象
- 搜索索引适配优化

---

## 4. 社区热点

### 热点 1：自适应分区 Hash Join 下表达式 key 合并缺失，可能崩溃或错误结果
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)

**关注原因：**  
这是今天最值得关注的 correctness 问题之一。问题描述指出 `JoinHashTable::merge_ht()` 在处理**表达式型 join key**（非直接列引用，如 `COALESCE(a.key2, 'default')`）时缺少 key column merge，可能在 adaptive partition hash join 下造成：
- 查询崩溃
- silent wrong results

**背后技术诉求：**
- 执行引擎对复杂 join key 的中间列/表达式列管理要更稳健
- adaptive partition hash join 的分区合并路径需要与普通 hash join 保持语义一致
- 对表达式下推、投影裁剪、运行时列物化之间的边界要更严格验证

这类问题属于**高风险引擎 correctness 缺陷**。

---

### 热点 2：Iceberg metadata cache 返回永久陈旧的部分数据，导致静默错误结果
- Issue: [#70522](https://github.com/StarRocks/starrocks/issues/70522)

**关注原因：**  
该问题直接指向 `dataFileCache` 可能长期提供 stale partial data，并产生**silent wrong query results**。  
对于 OLAP 系统而言，错误结果通常比查询失败更危险，因为用户可能长期无感知地消费错误数据。

**背后技术诉求：**
- Iceberg metadata cache 必须具备更严格的一致性失效策略
- partial cache 命中/回填逻辑需要避免“部分旧、部分新”的混合视图
- 湖仓接入场景下，缓存正确性优先级应高于命中率

这说明社区用户已在**真实 Iceberg 生产场景**中对缓存一致性提出更高要求。

---

### 热点 3：parse_json 在 SELECT 正常、INSERT OVERWRITE 崩溃，执行路径不一致
- Issue: [#70521](https://github.com/StarRocks/starrocks/issues/70521)

**关注原因：**  
该问题明确指出同一 SQL 在 SELECT 正常，但在 `INSERT OVERWRITE` 下直接挂 BE，堆栈指向 `_full_json_query_impl`，并怀疑与 `InsertOverwriteJobRunner` 触发的特定 flatten/执行路径相关。

**背后技术诉求：**
- 读路径与写路径的表达式执行语义需要一致
- JSON 函数族在 pipeline / insert overwrite 场景下要做额外回归
- 半结构化数据能力正从查询扩展到生产写入链路，稳定性要求更高

这是一个**半结构化数据处理能力成熟度**的典型信号。

---

### 热点 4：支持存储过程（SQL Procedural Language）
- Issue: [#67805](https://github.com/StarRocks/starrocks/issues/67805)

**关注原因：**  
该需求获得 4 个 👍，是当前列表中反馈相对更明确的 feature request。  
用户希望将遗留 Oracle/传统数仓中的 ETL/ELT 流程迁移至 StarRocks，但当前缺乏 stored procedures 成为阻碍。

**背后技术诉求：**
- 提升对传统数据库 SQL 方言和过程式编程的兼容
- 减少用户迁移时对外部调度/脚本的依赖
- 拓展 StarRocks 从查询引擎到“轻数据处理平台”的边界

这更像是**中长期路线图诉求**，短期落地概率不高，但迁移市场价值明显。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P0 / 高优先级：可能产生错误结果

#### 1) Iceberg dataFileCache 可能长期返回陈旧部分数据，导致静默错误结果
- Issue: [#70522](https://github.com/StarRocks/starrocks/issues/70522)
- 是否已有 fix PR：**未见直接关联 fix PR**

**影响分析：**  
这类 bug 风险极高，因为结果错误不一定能被立刻发现，尤其在报表、增量分析和跨系统校验不严格的场景下。

---

#### 2) 自适应分区 Hash Join 对表达式 key 合并缺失，可能崩溃或错误结果
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)
- 是否已有 fix PR：**未见直接关联 fix PR**

**影响分析：**  
涉及 join 核心执行路径，且触发条件并不罕见（表达式型 join key）。建议尽快补充 regression test。

---

### P1 / 高优先级：BE 崩溃与执行路径不一致

#### 3) parse_json 在 INSERT OVERWRITE 路径触发 BE 崩溃
- Issue: [#70521](https://github.com/StarRocks/starrocks/issues/70521)
- 是否已有 fix PR：**未见直接关联 fix PR**

**影响分析：**  
半结构化函数在写入链路崩溃，说明执行器不同上下文下仍存在行为分叉。  
若用户将 JSON 清洗逻辑嵌入 ETL 写入 SQL，此问题会直接阻塞生产作业。

---

#### 4) 查询 Azure Data Lake 上 parquet 文件时触发 Segmentation Fault
- Issue: [#70478](https://github.com/StarRocks/starrocks/issues/70478)
- 状态：**已关闭**
- 链接: [#70478](https://github.com/StarRocks/starrocks/issues/70478)

**影响分析：**  
虽然 issue 已关闭，但从现象看属于外部文件扫描/对象存储接入链路的稳定性问题。  
建议后续确认关闭原因是已修复、用户环境问题还是转其他 PR/Issue 跟踪。

---

### P2 / 中优先级：测试回归与边界行为

#### 5) integration test `test_limit` 失败
- Issue: [#70536](https://github.com/StarRocks/starrocks/issues/70536)
- 是否已有 fix PR：**未见直接关联 fix PR**

**影响分析：**  
`select count(*) from (select * from t0 limit 10, 20) xx;` 预期返回 20，测试失败说明 LIMIT offset/count 语义、子查询下推或执行计划处理可能存在回归。  
这类问题若扩散，可能影响 MySQL 兼容性与基础 SQL 语义可信度。

---

#### 6) brpc connection retry 未处理 wrapped NoSuchElementException
- Issue: [#70205](https://github.com/StarRocks/starrocks/issues/70205)
- 状态：**已关闭**
- 链接: [#70205](https://github.com/StarRocks/starrocks/issues/70205)

**影响分析：**  
该问题说明 FE/BE 通讯异常时，连接重试逻辑对异常包装层不够健壮。  
已关闭意味着此类网络瞬断容错能力已有进展，有助于提升线上查询韧性。

---

#### 7) 云原生表缺失文件时的 repair 支持
- Issue: [#66015](https://github.com/StarRocks/starrocks/issues/66015)
- 状态：**已关闭**
- 链接: [#66015](https://github.com/StarRocks/starrocks/issues/66015)

**影响分析：**  
对 shared-data 模式尤其重要。结合“专用 metadata fetch 线程池”的 PR，可以看出团队正在持续补强**云原生表恢复能力**。

---

## 6. 功能请求与路线图信号

### 1) 外置化 log4j 配置
- Issue: [#69220](https://github.com/StarRocks/starrocks/issues/69220)

**需求解读：**  
用户希望将 log4j 配置从应用构建产物中解耦，避免修改日志级别、Appender、格式或输出目的地时必须重新构建和部署。

**路线图判断：中等概率纳入**
- 原因：这是典型的运维可用性增强，实施边界清晰，收益直接。
- 与今日文档中“BE dynamic config 更新方法”信号相呼应，说明团队在强化**在线运维与配置动态化**能力。

---

### 2) 支持 Stored Procedures / SQL Procedural Language
- Issue: [#67805](https://github.com/StarRocks/starrocks/issues/67805)

**需求解读：**  
目标是降低从 Oracle 等传统数据库迁移 ETL/ELT 作业到 StarRocks 的门槛。

**路线图判断：短期概率较低，中长期值得关注**
- 原因：该功能涉及 parser、planner、执行模型、权限与事务语义，复杂度很高。
- 当前 StarRocks 当日 PR 重心仍集中在 correctness、云原生存储、Iceberg 和运维文档，而非过程式 SQL 扩展。

---

## 7. 用户反馈摘要

基于今日 Issues 可提炼出几类真实用户痛点：

1. **用户已将 StarRocks 用于复杂生产 SQL，而不仅是简单报表查询。**  
   如 join key 使用表达式、JSON 嵌套提取写入、Iceberg MV 增量刷新，都说明使用场景已深入到 ETL/数仓核心链路。  
   相关链接：[#70349](https://github.com/StarRocks/starrocks/issues/70349), [#70521](https://github.com/StarRocks/starrocks/issues/70521), [#70522](https://github.com/StarRocks/starrocks/issues/70522)

2. **用户对“查询正确性”的敏感度显著提高。**  
   今天最严重的问题都不是“慢”，而是“silent wrong results”或“SELECT/INSERT 行为不一致”。这意味着 StarRocks 在成熟用户群体中已进入“可信赖数据平台”阶段，正确性容忍度极低。  
   相关链接：[#70522](https://github.com/StarRocks/starrocks/issues/70522), [#70349](https://github.com/StarRocks/starrocks/issues/70349)

3. **云原生与湖仓场景正在成为主战场。**  
   Azure Data Lake parquet 扫描、Iceberg metadata cache、expired snapshot MV refresh、cloud native repair/thread pool 等都表明，用户广泛运行在对象存储+外表格式生态中。  
   相关链接：[#70478](https://github.com/StarRocks/starrocks/issues/70478), [#70522](https://github.com/StarRocks/starrocks/issues/70522), [#70523](https://github.com/StarRocks/starrocks/pull/70523), [#66015](https://github.com/StarRocks/starrocks/issues/66015)

4. **运维和文档可达性仍是用户体验关键一环。**  
   FE config 文档过大导致搜索不可用、log4j 外置化需求、BE 动态配置文档更新，都说明用户希望项目在“可操作性”上继续降低门槛。  
   相关链接：[#70474](https://github.com/StarRocks/starrocks/pull/70474), [#69220](https://github.com/StarRocks/starrocks/issues/69220), [#70532](https://github.com/StarRocks/starrocks/pull/70532)

---

## 8. 待处理积压

以下是值得维护者持续关注的长期或尚未明确推进的重要项：

### 1) Stored Procedures 支持
- Issue: [#67805](https://github.com/StarRocks/starrocks/issues/67805)

**提醒原因：**  
该需求直接关系到传统数据库迁移竞争力，虽实现复杂，但战略价值高。建议维护者给出路线图态度：不支持 / 规划中 / 推荐替代方案。

---

### 2) 外置化 log4j 配置
- Issue: [#69220](https://github.com/StarRocks/starrocks/issues/69220)

**提醒原因：**  
已存在一段时间，且属于运维体验类“低争议高收益”事项。若短期不做，也建议补充当前推荐实践，减少重复提问。

---

### 3) JoinHashTable 表达式 key merge 缺陷
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)

**提醒原因：**  
虽非最老 issue，但其风险等级高，且可能影响查询正确性。应优先于一般增强项。

---

### 4) Iceberg metadata cache 陈旧数据问题
- Issue: [#70522](https://github.com/StarRocks/starrocks/issues/70522)

**提醒原因：**  
这是今天最值得快速分派 owner 的问题之一。建议尽快确认是否需要：
- 临时关闭相关 cache
- 增加一致性校验开关
- 添加回归与压力测试

---

## 结论

今天的 StarRocks 呈现出一个典型的成熟 OLAP 项目特征：**工程活跃度高、backport 密集、文档和运维能力持续完善**；同时，随着用户深入使用湖仓、物化视图、复杂表达式 join 与半结构化处理，**正确性与异常路径稳定性**成为当前最重要的质量主题。  
如果以“下一阶段最值得投入的方向”来概括，建议优先级排序为：

1. **错误结果类问题清零**（Join / Iceberg cache）  
2. **BE 崩溃类问题止血**（JSON 写入路径 / 外部文件扫描）  
3. **湖仓元数据与修复链路加固**  
4. **运维动态配置与文档体系继续拆分优化**

如需，我还可以把这份日报继续整理成：
- **适合发在飞书/企业微信的精简版**
- **管理层 1 分钟摘要版**
- **研发团队按模块（FE/BE/湖仓/文档）分组版**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 维持**高活跃度**：Issues 更新 11 条、PR 更新 46 条，但**没有新版本发布**。  
从变更结构看，当前工作重心主要集中在三类方向：**REST Catalog / OpenAPI 完善**、**Spark/Flink 查询与流式能力修复**、以及**1.10.x 补丁版本准备**。  
值得注意的是，今日关闭/合并的 PR 多为**稳定性修复、回移(backport)和规范补齐**，说明社区正在为后续小版本发布和接口一致性做收口。  
另一方面，新报问题中出现了**Flink 恢复后重复写入、GCS 凭证刷新导致作业中途崩溃、表大小估算失真**等直接影响生产稳定性的反馈，需持续关注。

---

## 3. 项目进展

> 今日没有新 Release；以下聚焦过去 24 小时内已合并/关闭的重要 PR 及其意义。

### 3.1 REST Catalog / OpenAPI 规范持续收敛

- **PR #15609 - Core: Fix useSnapshotSchema logic and projection in RESTTableScan**  
  链接: https://github.com/apache/iceberg/pull/15609  
  该 PR 已关闭，修复了 `RESTTableScan` 中 `useSnapshotSchema` 判断逻辑错误，以及 projection 只选中顶层 field 的问题。  
  **影响**：
  - 提升 REST Catalog 读取场景下的**查询正确性**
  - 对 tag / direct snapshot / branch 的语义区分更清晰
  - 减少 schema 投影不完整引发的读取异常或结果偏差  
  **解读**：这是典型的“接口语义与执行逻辑对齐”修复，对依赖 REST Catalog 的引擎接入尤其重要。

- **PR #14965 - API, Core: Add 404 handling for /v1/config endpoint**  
  链接: https://github.com/apache/iceberg/pull/14965  
  为 `/v1/config` 增补 404 响应文档与核心库异常处理。  
  **影响**：
  - 提升 REST API 行为的**规范一致性**
  - 有助于 Catalog 客户端在 warehouse 不存在时实现更明确的错误分支处理  
  **解读**：虽是接口层改进，但对多租户 Catalog、自动化平台集成很关键。

- **PR #15690 - Flink: Backport: Add branch support to RewriteDataFiles maintenance task**  
  链接: https://github.com/apache/iceberg/pull/15690  
  已完成回移到 Flink 1.20 / 2.0。  
  **影响**：
  - Flink 维护任务对 branch 的支持增强
  - 有利于数据治理和多分支维护操作在 Flink 环境中的落地  
  **解读**：这类 backport 信号通常说明相关能力已被认为足够稳定，适合进入维护线。

### 3.2 Spark / Parquet 兼容性与生态适配继续推进

- **PR #13786 - Spark: Encapsulate parquet objects for Comet**  
  链接: https://github.com/apache/iceberg/pull/13786  
  PR 已关闭，围绕 Comet/Parquet shading 兼容问题完成剩余 Iceberg 侧修复。  
  **影响**：
  - 改善 Spark + Comet + Parquet 生态下的类隔离/依赖冲突问题
  - 提升新型加速执行栈中的可用性  
  **解读**：这是 Iceberg 在 Spark 执行加速生态中持续适配的重要一步。

- **PR #15154 - Spark 4.1: Optimize ExpireSnapshotsSparkAction with manifest-level filtering**  
  链接: https://github.com/apache/iceberg/pull/15154  
  尽管 PR 已关闭未进入主线，但提出的“manifest 级过滤后再读取 orphan manifests”的方向，反映了 Spark maintenance action 优化的明确诉求。  
  **解读**：即使未合并，也说明社区正在尝试降低 `ExpireSnapshots` 的扫描成本。

- **PR #15678 - AWS: Add scheduled refresh for the S3FileIO held storage credentials**  
  链接: https://github.com/apache/iceberg/pull/15678  
  PR 已关闭，但其问题意识很明确：**FileIO 长生命周期凭证刷新**已成为云上稳定性焦点。  
  **解读**：这与今日 GCS 凭证刷新 issue 遥相呼应，说明“对象存储凭证生命周期管理”正在成为跨云共同痛点。

---

## 4. 社区热点

### 4.1 Flink 恢复后重复写入：生产级正确性问题
- **Issue #14425 - Iceberg Flink sinks duplicate data during recovery when used with the REST catalog**  
  链接: https://github.com/apache/iceberg/issues/14425  
  这是当前最值得关注的问题之一。用户报告在 **Flink + REST Catalog + DynamicIcebergSink** 组合下，故障恢复后出现**重复数据写入**。Issue 摘要中已明确指出修复 PR：**#14517**。  
  **技术诉求分析**：
  - 用户真正关心的是**exactly-once 语义在恢复场景下是否成立**
  - REST Catalog 增加了状态交互复杂度，放大了 checkpoint / commit / retry 细节问题
  - 该问题直接影响流式写入可信度，优先级很高

### 4.2 GCS 凭证刷新失败：长跑 Spark 作业稳定性
- **Issue #15414 - GCSAuthManager does not seem to support credentials refresh - jobs crash mid**  
  链接: https://github.com/apache/iceberg/issues/15414  
  用户反馈 Spark 作业运行中途因 GCS OAuth2Credentials 无法刷新而崩溃。  
  **技术诉求分析**：
  - 长时间运行的 Spark / ETL 作业需要**自动凭证轮换**
  - Iceberg 在云对象存储层的认证处理，正从“能连上”走向“能长稳运行”
  - 这类问题通常影响面大，尤其在托管云环境和安全策略较严格的企业中

### 4.3 REST Spec 继续细化对象标识符约束
- **PR #15691 - REST Spec: Clarify identifier uniqueness across catalog object types**  
  链接: https://github.com/apache/iceberg/pull/15691  
  该 PR 明确 table/view 在同一 namespace 下不能重名。  
  **技术诉求分析**：
  - Catalog 端语义必须跨实现保持一致
  - 这类规范性 PR 往往是多语言客户端、多 Catalog 实现互操作性的基础
  - 说明社区正在把 REST Catalog 推向更严格、更可验证的协议层成熟度

### 4.4 物化视图仍是长期热点方向
- **PR #9830 - Views, Spark: Add support for Materialized Views; Integrate with Spark SQL**  
  链接: https://github.com/apache/iceberg/pull/9830  
  虽是长期 PR，但今日仍有更新，说明**Materialized Views** 仍在持续推进。  
  **技术诉求分析**：
  - 用户希望 Iceberg 不仅是表格式，还能承载更高层次的分析对象
  - 对 Spark SQL 集成的诉求尤其强，反映 Iceberg 在数仓语义层的演进期待

---

## 5. Bug 与稳定性

> 按严重程度排序，并标注是否已有 fix PR / backport 信号。

### P0 / 高优先级：数据正确性与作业崩溃

1. **Flink 恢复后重复写入，影响 exactly-once**
   - **Issue #14425**  
     链接: https://github.com/apache/iceberg/issues/14425  
   - 场景：Flink Sink + REST Catalog，恢复后重复数据  
   - 风险：**数据重复、下游统计失真、审计风险**
   - 状态：**已有修复 PR #14517**
   - 结论：这是当前最紧急的生产正确性问题之一

2. **GCS 凭证无法刷新，长跑作业中途崩溃**
   - **Issue #15414**  
     链接: https://github.com/apache/iceberg/issues/15414  
   - 场景：Spark + GCSAuthManager
   - 风险：**作业失败、重试放大成本**
   - 状态：未见明确 fix PR 关联
   - 结论：云环境稳定性问题，建议维护者优先确认修复路径

### P1 / 中高优先级：查询行为异常或结果误导

3. **Flink Connector 在 `USE namespace` 下表名不一致时静默空读**
   - **Issue #15668**  
     链接: https://github.com/apache/iceberg/issues/15668  
   - 风险：不会直接报错，而是**返回空结果**，容易造成误判
   - 影响：查询正确性、易用性和排障效率
   - 状态：暂未见关联 fix PR
   - 结论：静默失败类问题应优先转为显式异常或更严格校验

4. **estimated table size 不准确**
   - **Issue #15684**  
     链接: https://github.com/apache/iceberg/issues/15684  
   - **Issue #15664**  
     链接: https://github.com/apache/iceberg/issues/15664  
   - 场景：`SparkSchemaUtil.estimateSize`
   - 风险：误导优化器或运维判断，可能造成资源估算偏差
   - 状态：暂无 fix PR
   - 结论：不一定影响结果正确性，但可能影响执行计划质量和容量评估

### P1 / 补丁发布准备项

5. **Avro Row Lineage 相关 backport**
   - **Issue #15686 - Backport #15187**  
     链接: https://github.com/apache/iceberg/issues/15686  
   - **Issue #15685 - Backport #15508**  
     链接: https://github.com/apache/iceberg/issues/15685  
   - 含义：这两项明确指向 **1.10.2 patch release** 准备工作
   - 风险：ROW_ID/ROW LINEAGE 在特定读取或投影场景下行为不正确
   - 结论：说明 1.10.x 线上的 Avro 行级血缘能力仍在快速修补中

---

## 6. 功能请求与路线图信号

### 6.1 Spark Structured Streaming 过滤下推
- **Issue #15692 - Support Filter Pushdown for Spark Structured Streaming Reads**  
  链接: https://github.com/apache/iceberg/issues/15692  
该需求希望把 batch 读取已有的 manifest/file 级 pruning 能力带到 Spark Structured Streaming。  
**信号判断**：
- 这是非常合理且高价值的增强
- 若落地，将显著改善流式读取延迟与扫描成本
- 与当前 Spark 方向上的多个 PR 一致，**有较高概率进入后续版本讨论**

### 6.2 Variants 性能基准
- **Issue #15628 - Core: Add JMH benchmarks for Variants**  
  链接: https://github.com/apache/iceberg/issues/15628  
该需求聚焦 Variants 的可扩展性评估。  
**信号判断**：
- 表明社区已不满足于“功能可用”，开始要求**性能可量化**
- 若 Variants 是后续重点能力，benchmark 会是重要前置工作

### 6.3 默认 Parquet 列统计开关
- **Issue #13035 - add default parquet column statistic enable config flag**  
  链接: https://github.com/apache/iceberg/issues/13035  
这是一个长期改进项，依赖 parquet-java 上游修复。  
**信号判断**：
- 该需求与查询裁剪、文件统计质量密切相关
- 一旦上游依赖成熟，进入主线的可能性较高

### 6.4 REST 批量加载与对象语义增强
- **PR #15669 - Core: Add batch load endpoints for tables and views**  
  链接: https://github.com/apache/iceberg/pull/15669  
- **PR #15691 - REST Spec: Clarify identifier uniqueness across catalog object types**  
  链接: https://github.com/apache/iceberg/pull/15691  
**信号判断**：
- REST Catalog 明显仍是路线图核心
- 批量加载、对象唯一性、错误码明确化，都在提升 Catalog 作为“标准协议层”的成熟度
- 预计未来版本会继续围绕 REST API 完善

### 6.5 Spark 流式 OVERWRITE 处理
- **PR #15152 - Spark: Add streaming-overwrite-mode option for handling OVERWRITE snapshots**  
  链接: https://github.com/apache/iceberg/pull/15152  
**信号判断**：
- 这是长久存在的真实需求
- 若合并，将改善 Structured Streaming 面对 overwrite snapshot 时的可控性
- 与 #15692 一起看，说明 **Spark 流式读取/消费语义** 是持续投入方向

---

## 7. 用户反馈摘要

基于今日 Issues 可提炼出几类真实用户痛点：

1. **流式场景最在意恢复语义和正确性**  
   Flink 用户对“恢复后是否重复写入”极其敏感，说明 Iceberg 在生产流式写入中的核心评价标准依旧是：**故障恢复是否可靠、语义是否稳定**。  
   代表问题：#14425  
   链接: https://github.com/apache/iceberg/issues/14425

2. **云存储认证生命周期已成为实际阻塞点**  
   GCS 凭证刷新失败导致作业中途崩溃，反映很多用户已经把 Iceberg 跑在**长期、托管、云原生**环境中。  
   代表问题：#15414  
   链接: https://github.com/apache/iceberg/issues/15414

3. **用户希望优化器相关指标更贴近真实数据**  
   表大小估算失真问题说明，用户不仅关心“能跑”，也关心**统计信息是否能支撑更准确的执行计划和资源配置**。  
   代表问题：#15684 / #15664  
   链接:  
   - https://github.com/apache/iceberg/issues/15684  
   - https://github.com/apache/iceberg/issues/15664

4. **Flink SQL 易用性仍有改进空间**  
   `USE namespace` 下表名不一致导致静默空读，说明当前某些连接器行为对用户而言过于隐式，缺乏足够的错误提示。  
   代表问题：#15668  
   链接: https://github.com/apache/iceberg/issues/15668

---

## 8. 待处理积压

> 以下为长期存在、今日仍有更新、且值得维护者关注的重要积压项。

### 8.1 物化视图长期 PR
- **PR #9830 - Add support for Materialized Views; Integrate with Spark SQL**  
  链接: https://github.com/apache/iceberg/pull/9830  
创建时间较早，影响面大，是 Iceberg 向更完整分析语义扩展的关键特性。建议维护者明确：
- 规范边界
- Spark SQL 交互方式
- 刷新语义与元数据模型

### 8.2 Kafka Connect 路由能力
- **PR #11623 - Kafka Connect: Add mechanisms for routing records by topic name**  
  链接: https://github.com/apache/iceberg/pull/11623  
长期未决但业务价值明确，关系到多 topic 路由与接入灵活性，建议评估是否拆分成更易审阅的小 PR。

### 8.3 Kafka Connect 控制主题解耦
- **PR #14816 - Decouple control topic processing from record poll loop**  
  链接: https://github.com/apache/iceberg/pull/14816  
该改动直指吞吐与可靠性，技术价值较高，但实现复杂。建议维护者重点确认：
- 启动阶段控制消息丢失风险
- 线程模型与可观测性
- 对现有 connector 行为的兼容性

### 8.4 Spark 小文件异步读取
- **PR #15341 - [WIP] Make Spark readers function asynchronously for many small files**  
  链接: https://github.com/apache/iceberg/pull/15341  
这是典型的性能提升型工作，若设计成熟，对小文件场景帮助很大。建议关注其：
- 与现有 reader 生命周期管理的兼容性
- 背压与内存占用
- benchmark 数据完整性

### 8.5 站点与构建类低优先但易积压事项
- **PR #15266 - improve homepage responsiveness on smaller screens**  
  链接: https://github.com/apache/iceberg/pull/15266  
- **Issue #14094 - Upgrade to Gradle 9.4.1**  
  链接: https://github.com/apache/iceberg/issues/14094  
这些事项不直接影响查询正确性，但长期积压会增加维护成本。

---

## 总结判断

今天的 Iceberg 整体表现为：**活跃、健康，但稳定性议题权重上升**。  
一方面，REST Catalog、Spark/Flink、OpenAPI、回移补丁等工作持续推进，显示项目在协议层和多引擎支持上仍在稳步扩展；另一方面，生产场景中的**恢复正确性、凭证刷新、流式读取优化、统计估算准确性**正在成为用户最真实的诉求。  
若后续几天继续出现 1.10.x backport 和 Avro/ROW LINEAGE 修复动作，可以较高概率判断：**社区正在为 1.10.2 补丁版做准备**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

以下是 **Delta Lake** 在 **2026-03-20** 的项目动态日报。

---

# Delta Lake 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区保持了较高活跃度：**2 条 Issue 更新、29 条 PR 更新**，其中 **24 条 PR 仍在推进、5 条已关闭**，但**无新版本发布**。  
从变更主题看，当前开发重心集中在 **Spark/DSv2 路径完善、Kernel 能力扩展、CI 与 Unity Catalog 集成、协议层文档化**。  
今日没有大规模合并落地，但出现了多条具有明显路线图信号的 PR/Issue，说明项目正处于 **新能力铺设和技术债清理并行推进** 的阶段。  
整体健康度良好：维护节奏稳定，方向明确，但也可见部分长期 PR 持续堆积，提示评审与合并吞吐仍有压力。

---

## 2. 项目进展

### 今日关闭/结束的 PR

#### 1) DSv2 读取选项支持链路持续收敛
- **PR #6245** `[kernel-spark] Support read option ignoreDeletes in dsv2`（已关闭）  
  链接: delta-io/delta PR #6245
- **PR #6246** `[kernel-spark] Support skipChangeCommits and ignoreDeletes read option in dsv2`（已关闭）  
  链接: delta-io/delta PR #6246

这两条关闭的 PR 都属于 **stacked PR 演进过程中的中间层**，虽然本身未直接形成最终落地，但反映出 **Kernel-Spark DSv2 读取语义** 正在被系统性补齐。其后续拆分 PR 仍在继续推进，例如：
- **PR #6249** `[kernel-spark] Support ignoreChanges read option in dsv2`  
  链接: delta-io/delta PR #6249
- **PR #6250** `[kernel-spark] Support ignoreFileDeletion read option in dsv2`  
  链接: delta-io/delta PR #6250

**影响解读：**
- 对 Structured Streaming / 增量消费类场景尤为关键；
- 有助于 DSv2 路径逐步追平传统 Spark DeltaSource 的读取行为；
- 说明 Delta 正在把 **“Kernel + DSv2”** 作为未来统一读写栈的重要方向。

#### 2) 测试迁移类工作有裁撤/重组迹象
- **PR #6294** `[kernel-spark] Migrate DeltaSourceDeletionVectorsSuite to v2`（已关闭）  
  链接: delta-io/delta PR #6294

该 PR 被关闭意味着 **Deletion Vectors 相关测试迁移** 可能进行了重构、重切分或被其他更完整的提交替代。  
这类关闭通常不是功能撤销，而是开发者为适配更大的 DSv2/Kernal-spark 改造而进行的 **提交整理**。

#### 3) 实验性分支整理
- **PR #6318** `Dsv2 experimental`（已关闭）  
  链接: delta-io/delta PR #6318

这更像是实验性/占位性质的 PR，被关闭表明当前 DSv2 开发正在从“试验性总入口”转向**按能力拆分、逐项推进**。  
对项目管理而言，这是积极信号：说明相关工作正逐渐从探索期进入可审阅、可测试的工程化阶段。

---

## 3. 社区热点

> 由于提供数据中 PR 评论数均显示为 `undefined`，以下热点主要依据**更新时间、主题重要性、潜在影响范围**综合判断。

### 热点 1：Spark DSv2 与 Kernel 深度融合继续加速
- **PR #6313** `[Spark][DSv2] Support metadata-only create table via Kernel`  
  链接: delta-io/delta PR #6313
- **PR #6249** `[kernel-spark] Support ignoreChanges read option in dsv2`  
  链接: delta-io/delta PR #6249
- **PR #6250** `[kernel-spark] Support ignoreFileDeletion read option in dsv2`  
  链接: delta-io/delta PR #6250

**技术诉求分析：**
- 社区正在把原先偏 Spark 内部实现的 Delta 行为，迁移到 **Kernel 驱动、DSv2 暴露** 的统一栈；
- `metadata-only CREATE TABLE` 表明不仅是读取链路，**建表/目录初始化/版本 0 提交** 也开始走 Kernel；
- `ignoreChanges / ignoreFileDeletion` 等选项的接入说明 Delta 想在 DSv2 下恢复用户熟悉的流式和增量消费语义。

这组工作是今天最强的路线图信号之一：**Delta Lake 正朝统一接口层、减少 Spark 内部特化逻辑的方向演进。**

---

### 热点 2：协议层开始补文档，压缩配置可能标准化
- **Issue #6323** `[PROTOCOL RFC] Document delta.parquet.compression.codec`  
  链接: delta-io/delta Issue #6323
- **PR #6324** `[RFC] for compression setting`  
  链接: delta-io/delta PR #6324

**技术诉求分析：**
- `delta.parquet.compression.codec` 目前是部分系统依赖的“约定”，但未被正式纳入协议文档；
- 这类问题本质上属于 **跨引擎互操作性与行为可预期性** 问题；
- 一旦文档化甚至协议化，将降低不同 writer/reader 对压缩策略理解不一致的风险。

这是很典型的 Delta 成熟期信号：从“实现可用”转向“协议清晰、生态一致”。

---

### 热点 3：Spark 核心路径的稳定性与兼容性修复持续推进
- **PR #5804** `[SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan`  
  链接: delta-io/delta PR #5804
- **PR #6097** `[Spark] Make txn readFiles and readTheWholeTable thread safe`  
  链接: delta-io/delta PR #6097
- **PR #6162** `[Spark] Remove path transformation from Snapshot`  
  链接: delta-io/delta PR #6162
- **PR #6314** `[Spark] Add sanity check in getBatch to detect missing trailing commits`  
  链接: delta-io/delta PR #6314

**技术诉求分析：**
- 这些 PR 聚焦于 **写入路径判定、线程安全、路径一致性、流式读取正确性**；
- 说明社区当前关注点不仅是新功能，也在补强高并发、对象存储、混合 V1/V2 兼容环境下的行为可靠性；
- 对生产用户而言，这类改动虽然不“显眼”，但价值极高。

---

## 4. Bug 与稳定性

以下按潜在严重程度排序：

### P1：流批边界下可能出现“尾部 commit 丢失”导致读取正确性问题
- **PR #6314** `[Spark] Add sanity check in getBatch to detect missing trailing commits`  
  链接: delta-io/delta PR #6314

**问题概述：**
在 `latestOffset` 与 `getBatch` 之间，如果尾部 commit 文件消失，当前行为可能导致读取结果异常，而不是显式报错。  
这属于 **查询正确性 / 流式一致性** 风险，尤其影响基于 transaction log 增量推进的场景。

**状态：**
- 已有修复 PR，尚未合并。

**影响评估：**
- 对 Structured Streaming 用户风险较高；
- 在对象存储最终一致性、外部清理、异常恢复场景下值得重点关注。

---

### P1：事务读路径线程安全隐患
- **PR #6097** `[Spark] Make txn readFiles and readTheWholeTable thread safe`  
  链接: delta-io/delta PR #6097

**问题概述：**
`OptimisticTransaction.readPredicates` 可能被多线程并发更新，造成事务读取状态竞争。  
这类问题容易引发 **非确定性行为、错误统计、异常冲突判断**，属于典型并发稳定性问题。

**状态：**
- 已有修复 PR，仍在审查中。

**影响评估：**
- 对高并发读写、复杂 Spark 执行计划下的事务行为有潜在影响；
- 若迟迟不合并，建议维护者尽快确认修复正确性。

---

### P2：路径转换逻辑可能引入快照访问异常或兼容性问题
- **PR #6162** `[Spark] Remove path transformation from Snapshot`  
  链接: delta-io/delta PR #6162

**问题概述：**
该 PR 明确指出 “不应对 path 做变换”。  
这通常意味着历史实现中的路径规范化/变换可能在某些文件系统、URI 方案或目录布局下导致错误行为。

**状态：**
- Fix PR 已存在，尚未合并。

**影响评估：**
- 对多云存储、特殊 URI、跨 catalog / 跨文件系统场景可能尤为重要。

---

### P2：V2 fallback 到 V1 的判定逻辑不严谨
- **PR #5804** `[SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan`  
  链接: delta-io/delta PR #5804

**问题概述：**
原实现假设写入总是 Delta table，或所有 V2 情况都会 fallback 到 V1，但实际并非如此。  
这可能导致 **查询计划分析错误、写入路径判定错误、兼容性异常**。

**状态：**
- Fix PR 存在，但为较长期开放 PR，值得关注。

---

### P3：异常链丢失，影响问题诊断
- **PR #6325** `Preserve exception cause chain when rethrowing wrapped exceptions`  
  链接: delta-io/delta PR #6325

**问题概述：**
`S3SingleDriverLogStore` 在将 Hadoop `FileAlreadyExistsException` 包装为 Java 同名异常时丢失了原始 cause。  
虽然这不一定改变运行结果，但会显著降低 **S3/LogStore 问题的可排障性**。

**状态：**
- 已有修复 PR。

---

### P3：Kernel 当前为读取 in-commit-timestamp 可能触发额外云端请求
- **Issue #4914** `[Kernel] Remove unecessary N.json loading for InCommitTimestamp value`  
  链接: delta-io/delta Issue #4914

**问题概述：**
Kernel 在获取 Snapshot 时，会为读取 `CommitInfo` 中的 in-commit-timestamp 额外加载最新 `N.json`。  
Issue 指出这在 **99.99% 场景下可避免**，属于明显的远端 I/O 浪费。

**状态：**
- 尚未关闭，暂无对应 fix PR 出现在今日数据中。

**影响评估：**
- 属于性能/延迟优化问题；
- 对高频快照加载、云对象存储场景会有实际收益。

---

## 5. 功能请求与路线图信号

### 1) Parquet 压缩配置文档化/协议化
- **Issue #6323** `[PROTOCOL RFC] Document delta.parquet.compression.codec`  
  链接: delta-io/delta Issue #6323
- **PR #6324** `[RFC] for compression setting`  
  链接: delta-io/delta PR #6324

这是今天最明确的新需求之一。  
它不是新增“功能按钮”，而是把已有事实标准提升为 **协议层规范**。这通常会优先进入后续版本，因为它：
- 对兼容性收益大；
- 风险较低；
- 能直接改善生态系统一致性。

**纳入下一版本概率：高。**

---

### 2) DSv2 读取选项补齐
- **PR #6249** `Support ignoreChanges read option in dsv2`  
  链接: delta-io/delta PR #6249
- **PR #6250** `Support ignoreFileDeletion read option in dsv2`  
  链接: delta-io/delta PR #6250

这是对现有用户能力的迁移和补完，而非纯新增。  
如果 Delta 计划推动 DSv2/Kernel 成为主路径，这些读取选项几乎是必需项。

**纳入下一版本概率：高。**

---

### 3) DSv2 下通过 Kernel 执行 metadata-only create table
- **PR #6313** `[Spark][DSv2] Support metadata-only create table via Kernel`  
  链接: delta-io/delta PR #6313

这个方向有较强架构意义：
- 让建表流程也能统一到 Kernel；
- 减少 Spark 专有逻辑；
- 为未来跨引擎一致性打基础。

**纳入下一版本概率：中高。**

---

### 4) Variant GA table feature 向 Kernel Java 扩展
- **PR #6322** `[KERNEL][VARIANT] Add variant GA table feature to delta kernel java`  
  链接: delta-io/delta PR #6322

这说明 **VARIANT/半结构化能力** 可能继续向 Kernel 层对齐。  
若该功能是平台级路线的一部分，则 Kernel 支持是必经步骤。

**纳入下一版本概率：中。**  
取决于协议成熟度和下游引擎接入节奏。

---

### 5) Unity Catalog 集成测试和 Commit Metrics 持续深化
- **PR #6263** `[CI Improvements] Add non-blocking CI job to test against UC main`  
  链接: delta-io/delta PR #6263
- **PR #6155** `[UC Commit Metrics] Add skeleton transport wiring and smoke tests`  
  链接: delta-io/delta PR #6155
- **PR #6156** `[UC Commit Metrics] Add full payload construction and schema tests`  
  链接: delta-io/delta PR #6156

这组 PR 传递出两个信号：
1. Delta 与 Unity Catalog 的集成正在变得更核心；
2. Commit 可观测性/指标上报能力可能成为后续企业级特性重点。

**纳入下一版本概率：中高。**

---

## 6. 用户反馈摘要

基于今日 Issue/PR 摘要，可提炼出以下真实用户痛点：

### 1) 云存储额外请求成本仍是用户敏感点
- **Issue #4914**  
  链接: delta-io/delta Issue #4914

用户关注的不只是“能不能读”，更在意 **每次 Snapshot 初始化是否会触发不必要的对象存储请求**。  
这反映出 Delta 在云环境中的典型使用方式：高频元数据访问、对尾延迟和请求成本敏感。

### 2) 用户希望协议行为“写清楚”，而非依赖隐含约定
- **Issue #6323 / PR #6324**  
  链接: delta-io/delta Issue #6323  
  链接: delta-io/delta PR #6324

围绕压缩 codec 的讨论说明，生态用户越来越依赖 Delta 作为 **跨系统共享表格式**，而不是单一引擎内部格式。  
因此，任何未文档化的约定都会演变为兼容性隐患。

### 3) DSv2 路径必须尽快补足传统能力
- **PR #6249 / #6250 / #6313**  
  链接: delta-io/delta PR #6249  
  链接: delta-io/delta PR #6250  
  链接: delta-io/delta PR #6313

持续出现的 stacked PR 表明，用户/开发者并不满足于 DSv2 “基本可用”，而是要求其具备 **生产级完整语义**，包括：
- 读取选项兼容；
- 建表行为一致；
- 流式/增量场景对齐。

### 4) 运维与排障体验也是核心诉求
- **PR #6325**  
  链接: delta-io/delta PR #6325

异常 cause chain 的修复显示，用户在真实生产环境中需要更好地诊断 S3/文件系统问题。  
这类改进虽小，但通常源于实际故障排查痛点。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期未收敛条目：

### 1) 长期开启的 Spark 写入兼容性修复
- **PR #5804** `[SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan`  
  创建: 2026-01-08  
  链接: delta-io/delta PR #5804

已开放两个多月，且问题涉及 **V1/V2 写入路径兼容**，建议优先明确是否仍符合主线架构方向，避免长期悬而未决。

---

### 2) 旧 Scala LogStore 清理仍未完成
- **PR #5874** `[Spark] Remove the old scala LogStores`  
  创建: 2026-01-18  
  链接: delta-io/delta PR #5874

这是明显的技术债清理工作。  
其意义不止于代码整洁，还关系到：
- 新旧 LogStore 实现统一；
- Java 路径取代历史 Scala 实现；
- 后续跨模块维护成本下降。

建议维护者评估阻塞点，尽快推动结论。

---

### 3) 事务线程安全修复久未落地
- **PR #6097** `[Spark] Make txn readFiles and readTheWholeTable thread safe`  
  创建: 2026-02-20  
  链接: delta-io/delta PR #6097

考虑到其涉及并发正确性，若验证已充分，建议提高优先级。

---

### 4) Kernel Snapshot 路径与 path 行为相关修复仍在堆积
- **PR #6162** `[Spark] Remove path transformation from Snapshot`  
  链接: delta-io/delta PR #6162
- **Issue #4914** `[Kernel] Remove unecessary N.json loading for InCommitTimestamp value`  
  链接: delta-io/delta Issue #4914

这两项分别指向 **路径一致性** 与 **快照获取开销**，都属于底层高频路径问题，修复收益较大。

---

## 8. 总结判断

今天 Delta Lake 没有版本发布，但从开发信号看，项目正持续围绕三个主轴推进：

1. **Spark / DSv2 / Kernel 一体化演进**  
   读写选项、建表流程、测试迁移都在指向这一目标。

2. **协议与生态互操作性增强**  
   压缩 codec 文档化是典型例子，说明项目正强化“开放表格式”的规范角色。

3. **生产稳定性与技术债治理并行**  
   涉及线程安全、路径处理、流式 batch 正确性、异常可诊断性的修复持续出现。

**整体评价：活跃度高，方向清晰，健康度良好。**  
需要关注的主要风险不是功能缺失，而是 **长期开放 PR 的评审吞吐**，这可能影响关键稳定性修复的落地速度。

--- 

如需，我还可以把这份日报继续整理成：
1. **适合发在微信群/飞书的 300 字简报版**，或  
2. **面向技术管理者的“风险/机会”摘要版**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

以下为 **Databend 2026-03-20 项目动态日报**。

---

# Databend 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时内，Databend 社区整体保持 **中高活跃度**：共更新 **4 条 Issue**、**12 条 PR**，其中 **9 条 PR 仍在推进中**，说明核心开发仍集中在查询优化、存储层重构和 SQL 兼容性完善。  
今日没有新版本发布，但从 PR 分布看，项目正在持续推进 **查询执行内存管理、优化器规则重构、Fuse 存储抽象统一、文本格式命名演进** 等中长期工作。  
稳定性方面，今日新增的几个 Issue 都较值得重视，尤其集中在 **panic、assertion failure、常量折叠溢出错误处理、相关子查询 decorrelate** 等查询引擎正确性问题，反映出近期优化器/解析器边界条件仍需加固。  
同时，一个与 Python 绑定 `bendpy` CSV 注册相关的问题已被关闭，显示社区对外部接口和易用性问题响应较快。  
整体来看，Databend 当前处于 **“功能演进持续推进 + 查询正确性修复压力上升”** 的阶段，项目健康度良好，但需要优先压制新增 panic 类缺陷。

---

## 3. 项目进展

### 已关闭 / 已完成的重要 PR

#### 1) bendpy CSV 注册问题后续修复完成
- **PR**: [#19557](https://github.com/databendlabs/databend/pull/19557)  
- **标题**: `[pr-bugfix] fix: bendpy register csv column positions followup`
- **关联 Issue**: [#19443](https://github.com/databendlabs/databend/issues/19443)

**进展解读：**  
该修复解决了 Python 绑定 `register_csv()` / `register_tsv()` 在创建视图时对 CSV/TSV 文件使用 `SELECT *` 导致语义错误的问题。问题本质是外表/文件视图查询对列位置信息有更严格要求，不能简单沿用普通表的投影方式。

**影响：**
- 提升 `bendpy` 的可用性和首用成功率。
- 修复 Python 用户在数据探索、Notebook 场景下常见的 CSV 注册失败问题。
- 对 Databend 的生态接入体验是直接利好。

---

#### 2) Query Stage 大小写处理改进 PR 已关闭
- **PR**: [#19566](https://github.com/databendlabs/databend/pull/19566)  
- **标题**: `[pr-feature] feat: better case handling for query stage.`

**进展解读：**  
该改动针对通过 Stage 查询 Parquet 文件时的大小写处理进行了优化，涉及：
- `SELECT ... FROM @my_stage/...`
- 以及 `COPY/INSERT/REPLACE ... FROM (SELECT ... FROM @my_stage/...)` 等场景

尽管该 PR 当前状态为关闭，但从方向上看，它反映出 Databend 正在持续完善 **外部/暂存区文件查询的兼容性和易用性**。后续很可能会以调整后版本重新提交。

---

#### 3) Tokenizer 向 REPL 暴露未闭合状态的重构已关闭
- **PR**: [#19573](https://github.com/databendlabs/databend/pull/19573)  
- **标题**: `[pr-refactor] refactor: expose unclosed state from tokenizer for REPL consumers`

**进展解读：**  
该 PR 将字符串、反引号、dollar-quote 和 block comment 的未闭合状态，从基于 regex 的匹配改为自定义 handler，并显式暴露给 REPL 消费端。  
虽然 PR 被关闭，但其技术方向很明确：Databend 正在改善 **交互式 SQL 体验** 和 **解析前端的错误感知能力**，这对于 shell/CLI/IDE 集成非常重要。

---

## 4. 社区热点

> 注：今日数据中所有 Issue/PR 的评论和 👍 基本为 0，因此“热点”主要依据 **技术影响范围、故障严重程度、模块关键性** 来判断。

### 热点 1：Decorrelate 优化器在相关子查询 + UNION 上 panic
- **Issue**: [#19574](https://github.com/databendlabs/databend/issues/19574)
- **标题**: `[C-bug] Panic in decorrelate optimizer with correlated subquery over UNION`

**技术诉求分析：**  
这是一个典型的优化器健壮性问题。相关子查询 decorrelate 本身就复杂，再叠加 `UNION / UNION ALL` 集合操作后，计划 flatten 过程中出现 `Option::unwrap()` 的 `None` panic，说明优化器对该类计划形态的覆盖仍不完整。  
这类问题影响较大，因为：
- 不是普通报错，而是 **panic 级崩溃**；
- 涉及 **复杂 SQL 场景**，对 BI 工具或自动生成 SQL 的系统影响更明显；
- 暗示 decorrelate 规则对 set operation 的语义约束处理不足。

---

### 热点 2：BIGINT 常量折叠溢出不返回 SQL 错误而是 PanicError
- **Issue**: [#19575](https://github.com/databendlabs/databend/issues/19575)
- **标题**: `[C-bug] BIGINT multiply overflow returns PanicError 1104 during constant folding`

**技术诉求分析：**  
用户希望 Databend 在编译期常量折叠遇到整型溢出时，返回 **规范 SQL overflow error**，而不是内部 PanicError。  
这背后反映的是：
- 表达式求值和常量折叠路径的错误模型不一致；
- binder / optimizer / evaluator 对“可恢复错误”和“内部不变量破坏”的边界需要更清晰；
- 对用户而言，这属于 **正确性 + 可诊断性** 双重问题。

---

### 热点 3：解析器 assertion failed
- **Issue**: [#19578](https://github.com/databendlabs/databend/issues/19578)
- **标题**: `parse assertion failed`

**技术诉求分析：**  
该问题显示 parser 在 `UNION` 嵌套表达式上触发 assertion，属于前端解析/AST 正确性缺陷。  
断言失败通常意味着：
- 开发阶段假设被用户输入击穿；
- parser 对特定 SQL 归一化/格式化结果的一致性存在漏洞；
- 对外暴露的是系统鲁棒性不足，而不只是某条 SQL 不支持。

---

### 热点 4：TEXT/TSV 命名演进
- **PR**: [#19580](https://github.com/databendlabs/databend/pull/19580)
- **标题**: `[pr-feature] feat: rename TSV to TEXT.`

**技术诉求分析：**  
这是一个带有产品语义和兼容性信号的 PR：内部和文档将主要使用 `TEXT`，同时保留 `TSV` 作为兼容别名。  
背后的需求是统一“文本导入导出格式”的概念模型，避免用户将“TSV”误解为必须有 tab 分隔、或受历史命名限制。这通常意味着 Databend 在文件格式/Stage/Unload 体验上正在做更统一的抽象。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0：优化器 panic —— correlated subquery over UNION
- **Issue**: [#19574](https://github.com/databendlabs/databend/issues/19574)
- **状态**: OPEN
- **严重性**: 极高
- **问题类型**: 查询优化器 panic / 正确性
- **现象**: `flatten_plan.rs` 中 `Option::unwrap()` 触发 panic
- **是否已有 fix PR**: **暂无明确关联 PR**

**判断：**  
该问题会直接导致查询崩溃，且与复杂 SQL 生成场景密切相关，应优先处理。

---

### P0：BIGINT 常量折叠溢出导致 PanicError
- **Issue**: [#19575](https://github.com/databendlabs/databend/issues/19575)
- **状态**: OPEN
- **严重性**: 极高
- **问题类型**: 表达式求值 / 常量折叠错误处理
- **现象**: 溢出时报 `PanicError 1104`，而非 SQL 层 overflow error
- **是否已有 fix PR**: **暂无明确关联 PR**

**判断：**  
虽然场景局限于常量表达式，但这是典型的 SQL 语义层错误映射问题，容易影响测试稳定性和用户对引擎成熟度的判断。

---

### P1：Parser assertion failed
- **Issue**: [#19578](https://github.com/databendlabs/databend/issues/19578)
- **状态**: OPEN
- **严重性**: 高
- **问题类型**: 解析器断言失败
- **现象**: `SELECT 1 UNION (SELECT 1 UNION SELECT 1 UNION SELECT 1)` 等语句触发 assertion
- **是否已有 fix PR**: **暂无明确关联 PR**

**判断：**  
解析器不应对用户输入触发 assertion。即使最终语法不支持，也应返回可读错误。这类问题优先级略低于优化器 panic，但仍应尽快修复。

---

### P2：bendpy register_csv 语义错误已关闭
- **Issue**: [#19443](https://github.com/databendlabs/databend/issues/19443)
- **状态**: CLOSED
- **修复 PR**: [#19557](https://github.com/databendlabs/databend/pull/19557)

**判断：**  
这是今日稳定性面的正向信号：用户态接口问题能够被较快闭环，说明 Python 生态层面维护是积极的。

---

## 6. 功能请求与路线图信号

今日没有特别明确、独立成 Issue 的新功能请求，但从活跃 PR 可以提炼出几个 **路线图信号**：

### 1) 查询引擎正在继续深挖执行期内存优化
- **PR**: [#19556](https://github.com/databendlabs/databend/pull/19556)  
- **标题**: `feat(query): reclaim memory on hash join finish`

**信号解读：**  
Hash Join 结束后主动回收内存，说明 Databend 正在优化复杂查询、特别是大 Join 场景下的内存峰值。  
这类改进通常会被优先纳入后续版本，因为它直接影响：
- OOM 风险
- 多租户并发稳定性
- 大查询的资源使用效率

---

### 2) 优化器正在推进“类型收缩”和更激进的重写能力
- **PR**: [#19581](https://github.com/databendlabs/databend/pull/19581)  
- **标题**: `feat(optimizer): introduce type shrinking rules for aggregates and joins`

**信号解读：**  
该 PR 延续了此前工作，目标是对聚合和 Join 中的类型做 shrinking。  
这意味着 Databend 优化器未来可能在以下方面继续增强：
- 更低的中间结果内存消耗
- 更优的 hash key / aggregation state 布局
- 更强的成本导向型表达式/物理计划优化

这类工作通常不一定以用户可见功能命名出现，但很可能在下一版本中体现为 **性能提升**。

---

### 3) 文件格式与对外语义统一正在推进
- **PR**: [#19580](https://github.com/databendlabs/databend/pull/19580)  
- **标题**: `feat: rename TSV to TEXT.`

**信号解读：**  
这说明 Databend 可能在下一版本中进一步统一：
- 文件格式命名
- unload/export/import 语义
- 文档和 SQL 接口层对“文本格式”的表达方式

兼容性上保留 `TSV` alias，意味着这是 **渐进式演进**，而不是强制破坏性替换。

---

### 4) 存储层正在进行 Fuse 抽象统一
- **PR**: [#19576](https://github.com/databendlabs/databend/pull/19576)  
- **标题**: `refactor(storage): extract fuse block format abstraction`

**信号解读：**  
该重构抽取 `FuseBlockFormat` 抽象，并统一 native/parquet 读取 transform，表明 Databend 在为：
- 更统一的读取管线
- 更少重复逻辑
- 后续格式扩展与维护成本下降

做基础工程建设。  
这类 PR 往往不是“立刻可见”的功能，但会为后续性能优化和格式能力扩展铺路。

---

## 7. 用户反馈摘要

基于今日 Issues 与已关闭问题，可提炼出以下真实用户痛点：

### 1) 用户最不能接受的是“内部崩溃”而不是“可理解错误”
相关链接：
- [#19574](https://github.com/databendlabs/databend/issues/19574)
- [#19575](https://github.com/databendlabs/databend/issues/19575)
- [#19578](https://github.com/databendlabs/databend/issues/19578)

**反馈含义：**
- 用户愿意接受“不支持”或“溢出”错误；
- 但无法接受 panic、assertion fail、unwrap 崩溃这类暴露内部实现细节的失败方式。  
这表明 Databend 当前在高阶 SQL 和边界表达式上的稳定性预期已经提升，用户开始更关注 **错误质量** 而非单纯“有没有功能”。

---

### 2) Python/数据科学工作流对 CSV 注册体验敏感
相关链接：
- [#19443](https://github.com/databendlabs/databend/issues/19443)
- [#19557](https://github.com/databendlabs/databend/pull/19557)

**反馈含义：**
- 用户希望 `register_csv()` 这类 API 开箱即用；
- 文件查询场景中，列位置、schema 推断、视图生成方式需要足够稳健；
- Databend 的 Python 绑定正进入更广泛的试用场景。

---

### 3) 外部文件查询与 Stage 场景仍是兼容性建设重点
相关链接：
- [#19566](https://github.com/databendlabs/databend/pull/19566)
- [#19580](https://github.com/databendlabs/databend/pull/19580)

**反馈含义：**
- 用户正在大量使用 Stage + 文件格式能力；
- 大小写、格式命名、导出后缀、语义一致性等“产品细节”开始成为真实使用阻力；
- 说明 Databend 已不只是数据库内核竞争，也在强化数据湖入口体验。

---

## 8. 待处理积压

### 值得维护者优先关注的开放 PR

#### 1) Hash Join 结束后回收内存
- **PR**: [#19556](https://github.com/databendlabs/databend/pull/19556)

**原因：**  
这类性能/资源优化对生产环境收益明确，且已经附带 logic test，值得尽快评审推进。

---

#### 2) 优化器类型收缩规则
- **PR**: [#19581](https://github.com/databendlabs/databend/pull/19581)

**原因：**  
涉及聚合与 Join 的底层优化潜力，且包含 benchmark test，说明作者已考虑性能收益验证，适合重点 review。

---

#### 3) 聚合索引重写结构化匹配
- **PR**: [#19567](https://github.com/databendlabs/databend/pull/19567)
- **标题**: `refactor(sql): improve agg index rewrite matching`

**原因：**  
从字符串匹配改为结构化表达式匹配，是提升 rewrite 正确性与可维护性的关键一步，长期价值高。

---

#### 4) Eager Aggregation 重写改进
- **PR**: [#19559](https://github.com/databendlabs/databend/pull/19559)

**原因：**  
规则拆分后更利于后续扩展与定位问题，是典型“可维护性 + 优化器演进”基础工作。

---

### 值得警惕的新增缺陷积压

#### 1) [#19574](https://github.com/databendlabs/databend/issues/19574)  
Decorrelate + UNION panic，暂无修复 PR，建议作为最高优先级。

#### 2) [#19575](https://github.com/databendlabs/databend/issues/19575)  
常量折叠 overflow PanicError，影响 SQL 错误模型一致性，建议尽快补 fix。

#### 3) [#19578](https://github.com/databendlabs/databend/issues/19578)  
解析器 assertion failed，建议至少先加回归测试并降级为正常语法错误。

---

## 结论

Databend 今日的开发重点非常清晰：  
一方面，项目在 **查询引擎优化、Fuse 存储抽象统一、SQL 重写规则重构、外部文件格式体验** 上持续推进；另一方面，新增 Issue 暴露出 **优化器、解析器、常量折叠路径** 上若干 panic/断言类稳定性问题，需要尽快转化为普通 SQL 错误并补齐回归测试。  

从健康度看，项目仍然保持良好的开发节奏和问题闭环能力，尤其是 Python 生态问题已完成修复；但如果未来几天 panic 类问题继续增加，可能会影响用户对复杂 SQL 场景可用性的信心。短期建议维护者将 **查询正确性与错误处理一致性** 提升到与性能优化同等优先级。

--- 

如需，我还可以继续把这份日报整理成：
1. **适合发在飞书/Slack 的简版摘要**
2. **适合周报汇总的趋势版**
3. **按“查询引擎 / 存储 / 生态”分类的技术视图版**

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

以下是 **Velox 项目 2026-03-20 动态日报**。

---

# Velox 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时内，Velox 社区保持了**高活跃度**：Issues 更新 9 条、PR 更新 50 条，其中 14 条 PR 已合并或关闭，说明主干开发节奏仍然很快。  
从内容看，今日重点集中在三类方向：**Join/聚合能力增强、Iceberg/Hive 存储路径扩展、GPU/cuDF 能力补齐与稳定性修复**。  
同时，项目也暴露出若干**查询正确性与构建稳定性问题**，尤其是 Spark 兼容性 fuzz 失败、RPC 新代码导致的外部构建失败，以及时间格式语义差异。  
整体判断：**项目健康度良好，功能演进积极，但跨引擎兼容性和 OSS 构建矩阵仍是当前稳定性重点。**

---

## 3. 项目进展

### 3.1 今日已合并/关闭的重要 PR

#### 1）新增 counting semi/anti join，补齐多重集语义执行能力
- PR: **#16841 feat(joins): Add counting semi-join and anti-join**  
  链接: facebookincubator/velox PR #16841
- 对应 Issue: **#16838 Add counting semi-join and anti-join**  
  链接: facebookincubator/velox Issue #16838

**进展解读：**  
该变更为 Velox 引入 `kCountingLeftSemiFilter` 和 `kCountingAnti` 两类 Join 语义，在 build 侧对 key 去重并维护计数，在 probe 命中时递减计数，从而支持 **`INTERSECT ALL` / `EXCEPT ALL`** 这类多重集语义。  
这不是简单的性能优化，而是**执行模型能力增强**：以前 semi/anti join 更偏集合语义，现在开始具备按出现次数计算的能力，对 ANSI SQL 多重集操作支持更完整。  
对上层引擎（尤其 Presto/自研 planner）而言，这是一个明显的路线图信号：**Velox 正在补足更精细的关系代数算子语义。**

---

#### 2）新增 `vector_sum` 聚合函数，扩展数组型分析能力
- PR: **#16498 feat: Add vector_sum aggregate function using Simple API**  
  链接: facebookincubator/velox PR #16498

**进展解读：**  
该 PR 引入了 `vector_sum` 聚合函数，用于对数组列进行**逐元素求和**。  
这类函数对于 embedding、特征向量、指标数组等 OLAP/AI 混合负载非常实用，避免用户手工 `unnest + group by + rebuild array` 的高成本 SQL 写法。  
这表明 Velox 正持续加强**复杂类型上的原生聚合能力**，不再局限于标量数值聚合。

---

#### 3）GPU Decimal 支持进入第一阶段，cuDF 执行面持续扩大
- PR: **#16612 feat(cudf): GPU Decimal (Part 1 of 3)**  
  链接: facebookincubator/velox PR #16612

**进展解读：**  
该 PR 是 GPU Decimal 支持的第一部分，核心包括：
- 在 Velox 与 cuDF 类型映射中保留 decimal scale；
- 扩展 Arrow bridge 选项；
- 为列转换提供 expected-type-aware 逻辑。

这意味着 Velox 的 GPU 路径正在从“能跑基础算子”逐步走向“能承载真实数据仓库精度类型”。  
**Decimal 是分析场景中的关键类型**，若后续 Part 2/3 落地，GPU 后端对金融、计费、报表等负载的可用性会明显提高。

---

#### 4）Hive 索引读取路径增强：支持多 split 合并结果迭代
- PR: **#16812 feat(hive): Add UnionResultIterator for multi-split index lookup**  
  链接: facebookincubator/velox PR #16812

**进展解读：**  
该改动增加 `UnionResultIterator`，可按输入命中顺序合并多个 split 级别的索引查询结果，使单个 `HiveIndexSource` 可以管理多个文件。  
这类改进对于**多文件、多 split、混合格式索引查找**非常关键，说明 Hive 读路径正在向更通用、更可组合的索引访问模型演进。  
结合今日未合并的 Flux/Nimble 相关 PR，可看出 Velox 在**格式无关的索引层抽象**上持续推进。

---

#### 5）SIMD 通用工具沉淀，底层向量化基础设施复用增强
- PR: **#16845 feat: Add simdFill utility to SimdUtil**  
  链接: facebookincubator/velox PR #16845

**进展解读：**  
该 PR 将原本服务于 Nimble RLE 编码的 `simdFill` 抽离到通用 `SimdUtil.h` 中，适用于短变长重复填充场景。  
虽然属于底层优化，但它释放了一个信号：Velox 团队正在把编码层、执行层中验证过的高收益 SIMD 逻辑抽象成**可复用基础设施**，未来可能被更多编码器、向量构造和算子路径使用。

---

## 4. 社区热点

### 热点 1：Spark Aggregate Fuzzer 持续失败，兼容性问题再次成为焦点
- Issue: **#16327 [bug, fuzzer-found] Scheduled Spark Aggregate Fuzzer failing**  
  链接: facebookincubator/velox Issue #16327
- 关联 Issue: **#16509 [bug, fuzzer, fuzzer-found] Spark Aggregate fuzzer fails on TableScan**  
  链接: facebookincubator/velox Issue #16509
- 关联 PR: **#16843 fix(fuzzer): Reduce Spark aggregate fuzzer test pressure**  
  链接: facebookincubator/velox PR #16843

**热度原因：**  
这是当前最有代表性的稳定性议题之一。问题集中出现在 **Spark 与 Velox 的聚合语义不一致**，涉及 `ARRAY<TIMESTAMPS>` 等复杂类型，日志又不足以快速定位具体 aggregate。  
技术诉求很明确：社区不仅要“让 fuzz 不红”，更希望**建立 Spark 兼容行为的可诊断性与可收敛机制**。  
目前 #16843 仅表现为**降低测试压力**，更像缓解措施，不是根因修复。

---

### 热点 2：DuckDB 升级 PR 体量大，潜在兼容面广
- PR: **#16650 build: Upgrade Velox DuckDB from 0.8.1 to 1.4.4**  
  链接: facebookincubator/velox PR #16650

**热度原因：**  
该 PR 虽未合并，但影响面很大：DuckDB 版本从 0.8.1 直接升到 1.4.4，跨度非常大。  
这类依赖升级通常会影响：
- 头文件结构；
- 内部 API；
- 第三方集成行为；
- 测试与构建脚本。

技术诉求是：**跟上上游生态版本，同时降低手工维护兼容层的成本**。  
如果合并，可能成为近期最重要的基础依赖升级之一。

---

### 热点 3：Iceberg 写路径明显升温，删除向量与 DWRF 成为新焦点
- PR: **#16831 Add Iceberg V3 deletion vector write path...**  
  链接: facebookincubator/velox PR #16831
- PR: **#16834 Add sequence number conflict resolution for positional deletes and deletion vectors**  
  链接: facebookincubator/velox PR #16834
- PR: **#16844 Add DWRF file format support for Iceberg read and write paths**  
  链接: facebookincubator/velox PR #16844

**热度原因：**  
今天 Iceberg 方向出现了一组明显成体系的 PR：  
- V3 deletion vector 写路径；
- positional deletes / deletion vectors 的 sequence number 冲突处理；
- Iceberg 对 DWRF 格式的读写支持。

这说明 Velox 不再只停留在“读取 Iceberg 数据”的集成层面，而是在向**完整表格式事务语义与写路径能力**扩展。  
背后技术诉求是：让 Velox 更适合作为**云数仓/湖仓执行内核**，承担更深的 Iceberg 原生职责。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：新 RPC 代码导致外部 CI 构建失败
- Issue: **#16847 [build, triage] Build failure in new RPC code**  
  链接: facebookincubator/velox Issue #16847
- 关联 PR: **#16848 fix(rpc): Remove gmock dependency from RPCNodeTest to fix OSS GCC-14 build**  
  链接: facebookincubator/velox PR #16848

**影响：**  
该问题已在 `rapidsai/velox-testing` CI 中复现，且明确指向某主干提交后的回归。  
这类问题优先级很高，因为它会直接阻塞外部依赖方同步主干、验证新功能和保持集成健康。

**状态：**  
已有 fix PR（#16848），且已标记 ready-to-merge，预计短期内可缓解。

---

### P1：Spark 聚合 fuzzer 持续失败，存在查询正确性风险
- Issue: **#16327 Scheduled Spark Aggregate Fuzzer failing**  
  链接: facebookincubator/velox Issue #16327
- Issue: **#16509 Spark Aggregate fuzzer fails on TableScan**  
  链接: facebookincubator/velox Issue #16509
- 关联 PR: **#16843 fix(fuzzer): Reduce Spark aggregate fuzzer test pressure**  
  链接: facebookincubator/velox PR #16843

**影响：**  
涉及 Spark 兼容聚合与 TableScan 相关路径，且由定时 fuzzer 持续触发，说明并非偶发现象。  
若未收敛，可能影响 SparkSQL 适配层在复杂类型和某些 scan/aggregate 组合下的正确性可信度。

**状态：**  
目前仅有减压式修复 PR，尚未看到根因级修复。

---

### P2：`from_unixtime` 对 `YYYY` 格式解析与 Spark 不一致
- Issue: **#16806 Velox from_unixtime YYYY date format get diff result with spark**  
  链接: facebookincubator/velox Issue #16806

**影响：**  
`YYYY` 在 Spark 中按 ISO WeekYear 处理，而 Velox 当前结果表现为普通年或其他不同语义，导致返回年份偏差。  
这属于典型的**SQL 兼容性正确性问题**，尤其影响迁移 Spark SQL 工作负载的用户。

**状态：**  
尚未看到对应 fix PR。

---

### P2：memory checker 统计口径可能存在偏差
- Issue: **#16837 [bug, triage] memory checker problem**  
  链接: facebookincubator/velox Issue #16837

**影响：**  
用户指出 Velox 使用 `inactive_non + active_non` 估算内存，与 `/proc/meminfo` 中 `MemAvailable` 存在较大差距。  
这不一定直接导致查询错误，但会影响：
- 内存保护阈值判断；
- OOM 预警准确性；
- 自适应资源管理策略。

**状态：**  
暂无 fix PR，值得尽快确认是否为 Linux 内存指标选择不当。

---

### P2：cuDF 新字符串 CONCAT 存在间歇性失败
- PR: **#16824 fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)**  
  链接: facebookincubator/velox PR #16824

**影响：**  
问题由无效 `string_scalar` separator 引发，属于 GPU 字符串处理路径的不稳定性。  
间歇性失败比稳定复现更危险，因为它会拉高 CI 噪音并削弱用户对 GPU 后端稳定性的信任。

**状态：**  
已有修复 PR，且 ready-to-merge。

---

## 6. 功能请求与路线图信号

### 1）Spark `collect_list` 需要对齐 `RESPECT NULLS`
- Issue: **#16839 feat(sparksql): Apply same RESPECT NULLS pattern to collect_list**  
  链接: facebookincubator/velox Issue #16839
- 关联 PR: **#16416 feat(sparksql): Support RESPECT NULLS for Spark collect_set aggregate function**  
  链接: facebookincubator/velox PR #16416

**判断：高度可能纳入下一版本。**  
因为 `collect_set` 的同类改动已接近 ready-to-merge，`collect_list` 只是同一设计模式的延续。  
这表明 SparkSQL 兼容层在**NULL 语义细节**上进入系统性补齐阶段。

---

### 2）GPU 对 Presto TPC-DS 的算子覆盖继续扩大
- Issue: **#15772 [cuDF] Expand GPU operator support for Presto TPC-DS**  
  链接: facebookincubator/velox Issue #15772
- 关联 PR:  
  - **#16522 fix(cudf): Support zero-column count(*)**  
    链接: facebookincubator/velox PR #16522  
  - **#16714 feat(cudf): Implement LEFT SEMI PROJECT join**  
    链接: facebookincubator/velox PR #16714

**判断：属于明确主线。**  
从 issue 到多个 PR 可以看出，Velox-cuDF 不是零散修补，而是在按 TPC-DS 查询缺口逐步补算子。  
这对 GPU OLAP 方向是非常强的路线图信号。

---

### 3）Parquet 去 thrift 依赖、支持 FBThrift
- Issue: **#13175 Add support for FBThrift in Parquet and remove thrift dependency**  
  链接: facebookincubator/velox Issue #13175

**判断：中期重要方向，但推进节奏偏慢。**  
这个需求关系到：
- 原生 parquet reader 依赖收敛；
- 远程函数执行场景；
- 与 Meta 内部/外部 RPC 栈的兼容。

虽然 issue 今日有更新，但评论不多，说明仍处于中长期推进状态。

---

### 4）Iceberg 正向完整写路径与格式扩展演进
- PR: **#16831 / #16834 / #16844**  
  链接分别见上

**判断：极可能成为下一阶段重点能力集。**  
特别是 deletion vector、sequence number 冲突处理、DWRF 支持这三者组合出现，说明 Iceberg 已不只是“支持读取”，而是在向**更完整的数据湖写入与删除语义**演化。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 更新，可归纳出用户真实痛点主要集中在以下几类：

### 1）“能运行”不等于“能对齐上游引擎语义”
- 代表链接：  
  - facebookincubator/velox Issue #16327  
  - facebookincubator/velox Issue #16806

用户越来越关注与 **Spark SQL 行为逐项对齐**，尤其是：
- 时间格式化语义；
- 聚合函数 NULL 处理；
- 复杂类型上的边界行为。

这说明 Velox 已进入一个新阶段：用户不再只关心性能，而开始用它承载**生产级兼容工作负载**。

---

### 2）GPU 后端正在被真实数仓场景压力测试
- 代表链接：  
  - facebookincubator/velox Issue #15772  
  - facebookincubator/velox PR #16522  
  - facebookincubator/velox PR #16714  
  - facebookincubator/velox PR #16612

反馈表明，用户在实际跑 **Presto TPC-DS / Decimal / 字符串函数 / 特殊聚合** 时，仍会触发 CPU fallback 或不稳定行为。  
这说明社区对 GPU 路径的期待已经从 demo 级别提升到**替代 CPU 主路径**的程度。

---

### 3）外部集成方非常在意 OSS 构建稳定性
- 代表链接：  
  - facebookincubator/velox Issue #16847  
  - facebookincubator/velox PR #16848

从 rapidsai 外部 CI 暴露的问题看，Velox 的每次底层改动都可能影响下游生态。  
用户痛点不是功能缺失，而是：**主干改动是否稳定、是否容易持续集成、是否会因测试依赖污染而破坏外部构建。**

---

### 4）资源管理与内存观测口径仍需更可信
- 代表链接：  
  - facebookincubator/velox Issue #16837

对于运行在 Linux 宿主机/容器中的用户来说，内存 checker 的统计是否贴近系统真实可用内存，直接影响他们对 Velox 在生产环境中的信任。  
这类反馈通常来自**高负载、长时间运行、资源敏感场景**，需要特别关注。

---

## 8. 待处理积压

以下为值得维护者持续关注的长期或重要积压项：

### 1）DuckDB 大版本升级 PR 长时间未落地
- PR: **#16650 build: Upgrade Velox DuckDB from 0.8.1 to 1.4.4**  
  链接: facebookincubator/velox PR #16650

**提醒原因：**  
升级跨度大、影响基础依赖面广，若长期悬而未决，后续 rebase 与兼容成本会不断增加。  
建议维护者尽快给出：
- 风险评估；
- 兼容性测试范围；
- 分阶段合并策略。

---

### 2）Hive InsertTableHandle 元数据透传改动仍未合并
- PR: **#16637 feat: Add storageParameters to HiveInsertTableHandle**  
  链接: facebookincubator/velox PR #16637

**提醒原因：**  
该改动影响 Hive 写路径元数据携带方式，属于 connector 能力完善项。  
如果写入生态正在增强（尤其伴随 Iceberg/Hive 写路径扩展），这类基础字段支持不宜长期滞留。

---

### 3）FBThrift/Parquet 依赖治理议题拖得较久
- Issue: **#13175 Add support for FBThrift in Parquet and remove thrift dependency**  
  链接: facebookincubator/velox Issue #13175

**提醒原因：**  
这是一个创建已近一年的结构性议题，涉及依赖治理与远程执行方向。  
虽然不是短期 blocker，但长期不推进会持续增加技术债。

---

### 4）cuDF TPC-DS 覆盖缺口仍是中长期 backlog
- Issue: **#15772 Expand GPU operator support for Presto TPC-DS**  
  链接: facebookincubator/velox Issue #15772

**提醒原因：**  
该 issue 不是单点 bug，而是 GPU OLAP 完整性的总入口。  
建议继续用“按查询缺口/按算子缺口”的形式拆解跟踪，避免成为长期大而全的模糊积压。

---

# 总结判断

今天的 Velox 呈现出非常清晰的演进方向：  
一方面，**执行引擎能力继续增强**，包括 counting join、多值数组聚合、SIMD 基础设施沉淀；另一方面，**湖仓与 GPU 两大战略方向加速推进**，Iceberg 写路径、DWRF、Decimal GPU 支持都在快速前进。  
需要警惕的是，项目当前也进入了“复杂度上升期”——Spark 兼容性、外部构建稳定性、内存观测准确性这些问题，决定了 Velox 从高性能内核走向大规模生产采用的成熟度。  
整体上，今日项目状态可评价为：**功能推进强劲，生态集成活跃，稳定性治理需同步加强。**

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 的简版晨报**，或  
2. **按“查询引擎 / 存储格式 / GPU / 稳定性”分类的管理层摘要版**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-20）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：Issues 更新 8 条、PR 更新 12 条，说明社区当前仍处于“高频修复 + 功能推进 + Flink 场景扩展”并行阶段。  
从内容看，Velox 后端依然是主战场，涉及 Parquet 写入、类型拓宽、shuffle 统计、SQL 函数支持等核心能力；同时 Flink 方向的问题与优化明显增多，显示 Gluten 正在持续拓展 Spark 之外的执行场景。  
稳定性方面，今日新增多条 bug 报告，覆盖 S3 生命周期、GPU BHJ、Flink Nexmark 与 RocksDB 状态后端，暴露出多运行时、多后端组合下的边界问题。  
总体健康度评价为：**活跃度高，功能演进积极，但稳定性压力上升，尤其是 Flink 与特定执行路径的可靠性需要重点关注。**

---

## 2. 项目进展

### 今日关闭/结束的 PR

#### 1) README 下载地址修复
- **PR**: #11786 `[DOCS] [MINOR] Fix Link to Package Repository in README`
- **状态**: Closed
- **链接**: https://github.com/apache/gluten/pull/11786

这是一项文档层面的修复，将 README 中的包下载地址从 `downloads.apache.org/incubator/gluten/` 修正为 `downloads.apache.org/gluten/`。  
虽然不涉及执行引擎能力，但它直接影响用户获取发布包的成功率，属于发布后体验修正，对新用户接入有实际帮助。

---

#### 2) Spark 3.3 特定规则作用域限制
- **PR**: #11787 `[VELOX] Only apply VeloxParquetWriterInjects and NativeWritePostRule for Spark 3.3`
- **状态**: Closed
- **链接**: https://github.com/apache/gluten/pull/11787

该 PR 试图将 Velox Parquet Writer 注入规则和 NativeWritePostRule 限定在 Spark 3.3 生效。  
虽然最终关闭，但它释放出一个明确的工程信号：**原生写路径与 Spark 多版本兼容性仍然敏感**，规则注入的版本边界需要更谨慎处理。  
这与当前 Gluten 在 Spark 3.3/3.4/3.5 多版本适配中的维护复杂度一致。

---

#### 3) Scala 2.13 + JDK8 构建兼容修复
- **PR**: #11784 `[CORE] [INFRA] Fix Scala 2.13 build on JDK 8 by using release 8 instead of 1.8`
- **状态**: Closed
- **链接**: https://github.com/apache/gluten/pull/11784

该改动针对基础设施与构建链路，目标是修复 Scala 2.13 在 JDK 8 环境下的构建问题。  
虽然 PR 已关闭，但反映出 Gluten 仍在持续处理 **编译工具链兼容性**，这对企业环境尤其重要，因为很多用户仍保留 JDK 8 或历史构建矩阵。

---

#### 4) 原生 Avro Scan 支持 PR 被关闭
- **PR**: #11179 `[CORE, stale, BUILD, VELOX] [GLUTEN-11178][VL] Support native Avro scan`
- **状态**: Closed
- **链接**: https://github.com/apache/gluten/pull/11179

这是今天值得关注的一项关闭：该 PR 原计划为 Velox 增加原生 Avro scan，以减少序列化开销。  
其关闭意味着 **Avro 原生读取支持短期内未进入主线**，也反映出维护者当前可能优先聚焦 Parquet、Shuffle、函数兼容和写路径等更高优先级议题。  
对于依赖 Avro 数据湖/消息归档读取的用户，这意味着仍需依赖回退路径或后续重提方案。

---

## 3. 社区热点

### 热点 1：Velox 上游 PR 跟踪清单持续活跃
- **Issue**: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- **评论**: 16
- **👍**: 4
- **链接**: https://github.com/apache/gluten/issues/11585

这是当前最活跃的讨论主题之一。该 issue 用于跟踪 Gluten 社区提交到 Velox 上游但尚未合并的 PR。  
背后的技术诉求非常明确：**Gluten 对 Velox 的依赖已深入核心功能演进，但上游合并节奏与 Gluten 交付节奏并不完全一致**。  
这类 tracker 的活跃说明社区面临两个现实问题：
1. 某些关键能力必须先在 Gluten 侧消费或跟踪；
2. 不直接维护大量 patch pick 进入 `gluten/velox`，是为了降低 rebase 成本和维护负担。

这也是观察 Gluten 路线图的重要窗口：凡是长期挂在该 tracker 上的 Velox 能力，往往都与后续版本性能或功能突破有关。

---

### 热点 2：简单 `LIMIT` 查询性能竟比 Vanilla Spark 慢 10x+
- **Issue**: #11766 `[enhancement] [VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries`
- **评论**: 5
- **链接**: https://github.com/apache/gluten/issues/11766

这是今天最值得重视的用户性能反馈之一。  
用户报告一个极简单的查询：

```sql
select * from store_sales limit 10;
```

在 Vanilla Spark 上仅生成一个 task，而 Gluten 明显更慢，且达到 10 倍以上差距。  
这反映出 Gluten/Velox 在 **小结果集、早停（early termination）、limit pushdown、任务裁剪或 scan 调度路径** 上可能存在优化缺失。  

技术诉求主要集中在：
- 简单查询不应因列式/原生链路引入过高固定开销；
- `LIMIT` 类交互式查询需要更强的任务级短路能力；
- 用户不仅关心 TPC-DS/TPC-H 大查询吞吐，也关心“Lakehouse 交互式秒级响应”。

这是典型的“真实用户体验问题”，优先级可能会上升。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1：GPU 执行在 BHJ 路径失败
- **Issue**: #11794 `[bug, triage] [VL] GPU failed on BHJ`
- **链接**: https://github.com/apache/gluten/issues/11794
- **状态**: Open
- **是否已有 fix PR**: 暂无

这类问题影响的是 **Broadcast Hash Join 执行稳定性**，且发生在 GPU 场景，通常意味着执行计划、内存布局、批处理边界或设备侧兼容存在问题。  
如果该问题可稳定复现，将直接影响 GPU 加速场景下的查询可用性，严重程度较高。

---

### P1：Flink + RocksDB 状态后端运行 Nexmark 出现内存泄漏/TaskManager 崩溃
- **Issue**: #11791 `[bug, triage] [FLINK] Memory leak when trying to run nexmark with rocksdb state backend`
- **链接**: https://github.com/apache/gluten/issues/11791
- **状态**: Open
- **是否已有 fix PR**: 暂无

用户反馈运行 Nexmark q4 且状态后端使用 RocksDB 时，TaskManager 异常退出，日志指向潜在泄漏或崩溃。  
这属于 **流式场景稳定性重大问题**，因为它不只是性能下降，而是直接造成作业失败。  
若问题最终定位为 JNI/native memory 生命周期管理不当，将对 Flink 集成成熟度构成明显挑战。

---

### P1：Flink Nexmark Q3 提交即失败
- **Issue**: #11790 `[bug, triage] [FLINK] Nexmark Q3 submission error`
- **链接**: https://github.com/apache/gluten/issues/11790
- **状态**: Open
- **是否已有 fix PR**: 暂无

该问题表明在 flink-19.2 + gluten + velox4j 组合下，Nexmark Q3 无法正常提交，而 Q0-Q2 虽可运行但“很慢”。  
这说明 Flink 支持当前仍处在 **功能可用性验证阶段**，特别是复杂 query pattern 与作业提交链路尚不稳定。

---

### P2：S3 文件系统未执行 finalize，存在资源释放风险
- **Issue**: #11796 `[bug, triage] [VL] finalizeS3FileSystem is never called`
- **链接**: https://github.com/apache/gluten/issues/11796
- **状态**: Open
- **是否已有 fix PR**: 暂无

Issue 指出 AWS SDK C++ teardown 没有被正确调用。  
这可能导致：
- 进程退出阶段资源未释放；
- 全局静态对象析构顺序问题；
- 长生命周期服务中的句柄/状态残留。  

该问题短期内可能不像查询失败那样显性，但对生产环境资源稳定性与进程退出行为影响较大。

---

### P2：Flink CI 构建失败
- **Issue**: #11793 `[triage] [FLINK] CI build failure for flink-test`
- **链接**: https://github.com/apache/gluten/issues/11793
- **状态**: Open
- **是否已有 fix PR**: 暂无

CI 构建问题虽然不是线上 bug，但会直接拖慢修复节奏、阻塞 PR 合入。  
从描述看，问题可能与依赖头文件、fmt/folly 或编译环境组合有关，建议尽快修复，否则 Flink 相关改动的验证可信度会下降。

---

### P2：Iceberg 上 `input_file_name()` 返回空字符串
- **Issue**: #11513 `[enhancement, good first issue] [VL] Input_file_name() returns "" on iceberg tables`
- **状态**: Closed
- **链接**: https://github.com/apache/gluten/issues/11513

该问题已关闭，意味着 **Iceberg 元数据函数兼容性问题已有阶段性结果**。  
虽然未给出对应 fix PR，但这是一个积极信号：Gluten 对数据湖场景下 Spark SQL 语义兼容仍在持续补齐。

---

## 5. 功能请求与路线图信号

### 1) 原生 Parquet 复杂类型写入能力增强
- **PR**: #11788 `[CORE, VELOX] [VL] Enable native Parquet write for complex types (Struct/Array/Map)`
- **链接**: https://github.com/apache/gluten/pull/11788

这是今天最强的功能演进信号之一。  
该 PR 允许 Velox 后端对 `Struct/Array/Map` 等复杂类型执行原生 Parquet 写入，意味着 Gluten 正从“读优化”继续向“写路径完整能力”推进。  
对数据湖场景来说，这很关键，因为复杂类型广泛存在于半结构化分析、嵌套 Schema 和宽表 ETL 中。  
**很可能成为下一版本的重要能力候选。**

---

### 2) Parquet 类型拓宽支持持续推进
- **PR**: #11719 `[CORE, BUILD, VELOX] [GLUTEN-11683][VL] Add Parquet type widening support`
- **链接**: https://github.com/apache/gluten/pull/11719

该 PR 不仅修复 Spark 兼容问题，还推进 Parquet type widening。  
它解决的是典型数据湖演进问题：schema 演进后，读路径如何兼容历史文件与新 schema。  
这属于高价值企业能力，和 Delta/Iceberg/Hive 表长期演进场景高度相关。  
**若近期合入，将显著提升 Gluten 在生产湖仓环境中的落地可信度。**

---

### 3) `approx_percentile` 聚合函数支持
- **PR**: #11651 `[CORE, VELOX, CLICKHOUSE] [GLUTEN-4889][VL] feat: Support approx_percentile aggregate function`
- **链接**: https://github.com/apache/gluten/pull/11651

该 PR 为 Spark 增加 Velox `approx_percentile` 支持。  
不过其描述也揭示了一个重要兼容性难点：Velox 使用 KLL sketch，而 Spark 使用 GK algorithm，中间态格式不兼容，导致 fallback 语义复杂。  
这说明 Gluten 在扩展 SQL 函数支持时，不仅是“能不能算”，更是“与 Spark 中间态和回退链路是否兼容”。  
**此类函数支持有望纳入后续版本，但可能需要对 fallback 语义做更明确约束。**

---

### 4) Shuffle block 级列统计，为动态过滤裁剪铺路
- **PR**: #11769 `[VELOX] [GLUTEN-11605][VL] Write per-block column statistics in shuffle writer`
- **链接**: https://github.com/apache/gluten/pull/11769

这是一个偏底层但很有战略价值的优化。  
它在 shuffle writer 中写入 block 级列统计信息（min/max/hasNull），目的是支持 reader 端结合动态过滤进行 block-level pruning。  
若落地，将带来：
- 减少无效 block 读取；
- 降低 shuffle 网络/反序列化成本；
- 提升 join/filter 密集型查询效率。  

这属于 **分析引擎深度优化能力**，值得持续跟踪。

---

### 5) DPP 多 key 支持修复
- **PR**: #11795 `[CORE] Fix multi-key DPP support in ColumnarSubqueryBroadcastExec`
- **链接**: https://github.com/apache/gluten/pull/11795

这项改动修复动态分区裁剪（DPP）在多过滤键场景下只使用首个 key 的问题。  
如果合入，将显著提升复杂 join/filter 查询下的 **查询正确性与裁剪效果**，属于典型“正确性修复 + 性能收益”双重价值项。

---

## 6. 用户反馈摘要

### 1) 交互式简单查询体验仍是短板
- 代表 Issue: #11766
- 链接: https://github.com/apache/gluten/issues/11766

用户明确指出极简单的 `LIMIT` 查询下，Gluten 比 Vanilla Spark 慢一个数量级。  
这表明真实用户并不只关注长跑型 benchmark，**他们同样重视低延迟、少任务、快速返回结果的交互式 SQL 体验**。  
这是产品化 adoption 的关键门槛。

---

### 2) Flink 集成仍存在“能跑但不稳/不快”问题
- 代表 Issues: #11790, #11791, #11793
- 链接:
  - https://github.com/apache/gluten/issues/11790
  - https://github.com/apache/gluten/issues/11791
  - https://github.com/apache/gluten/issues/11793

从用户描述看，Flink + Velox4j 在 Nexmark 场景下存在提交失败、运行崩溃、性能偏慢、CI 不稳等一系列问题。  
这说明 Flink 方向目前更像是 **快速迭代中的实验/增强路径**，距离全面稳定仍需时间。

---

### 3) 数据湖与云存储兼容仍是高频诉求
- 代表 Issues/PRs:
  - #11513 Iceberg `input_file_name()` 问题
  - #11796 S3 finalize 问题
  - #11788 Parquet 复杂类型写入
  - #11719 Parquet 类型拓宽
- 链接:
  - https://github.com/apache/gluten/issues/11513
  - https://github.com/apache/gluten/issues/11796
  - https://github.com/apache/gluten/pull/11788
  - https://github.com/apache/gluten/pull/11719

可以看到，用户越来越多地在真实 lakehouse 场景中验证 Gluten，而不是仅在纯 benchmark 环境中使用。  
他们关心的是：
- Iceberg/Hive/Delta 行为一致性；
- S3 生命周期与资源管理；
- Parquet 复杂类型与 schema 演进支持。

---

## 7. 待处理积压

### 1) Velox 上游未合并 PR 跟踪长期存在
- **Issue**: #11585
- **链接**: https://github.com/apache/gluten/issues/11585

这是明显的长期积压项。  
它本身不是 bug，但反映出 Gluten 某些能力推进依赖 Velox 上游节奏。建议维护者定期梳理：
- 哪些 patch 需要继续等待上游；
- 哪些值得以临时 vendor/pick 方式落地；
- 哪些已失去合并价值应清理。

---

### 2) `approx_percentile` 支持 PR 挂起时间较长
- **PR**: #11651
- **创建时间**: 2026-02-25
- **链接**: https://github.com/apache/gluten/pull/11651

这是一个高价值 SQL 能力增强，但由于中间态兼容问题复杂，可能存在设计评审阻力。  
建议维护者尽快明确：
- 是否接受与 Spark 不完全兼容的中间态；
- 是否要求禁止 fallback；
- 是否需通过配置门控限制使用范围。

---

### 3) Bolt backend WIP 长期未落地
- **PR**: #11261 `WIP: add bolt backend in gluten`
- **创建时间**: 2025-12-05
- **链接**: https://github.com/apache/gluten/pull/11261

该 PR 已存在较长时间，且仍是 WIP。  
它代表 Gluten 在后端多样化上的探索，但长期未收敛会带来：
- 评审与分支维护成本；
- 路线图信号混乱；
- 外部贡献者对后端支持范围的误判。  
建议维护者明确其状态：继续推进、拆分提交，或阶段性冻结。

---

### 4) 原生 Avro Scan 支持被 stale 关闭，值得确认是否重启
- **PR**: #11179
- **链接**: https://github.com/apache/gluten/pull/11179

虽然已关闭，但 Avro 读取在部分数仓和归档链路中仍有实际需求。  
如果社区中仍有明确用户场景，建议后续评估是否以更小范围 PR 重新提交，而不是完全搁置。

---

## 8. 结论

今天的 Apache Gluten 呈现出非常典型的“高速演进期”特征：  
一方面，Velox 后端在 Parquet 写入、类型拓宽、动态过滤、近似聚合等方面持续增强，底层性能与功能面都在扩展；另一方面，Flink 集成和部分复杂运行环境下的稳定性问题开始集中暴露。  

若从版本信号看，**下一阶段最可能进入主线的能力**包括：
- Parquet 复杂类型原生写入（#11788）
- Parquet type widening（#11719）
- DPP 多 key 支持修复（#11795）
- shuffle block 级列统计（#11769）

而需要维护者优先处置的风险点则是：
- Flink Nexmark/RocksDB 相关崩溃与提交失败
- GPU BHJ 失败
- 简单 LIMIT 查询性能显著落后 Vanilla Spark

整体而言，项目活跃、方向清晰，但当前最需要的是把新增能力与跨引擎稳定性一起收敛，避免功能扩张快于可用性提升。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报 · 2026-03-20

## 1. 今日速览

过去 24 小时，Apache Arrow 保持较高活跃度：Issues 更新 22 条、PR 更新 17 条，但**没有新版本发布，也没有 PR 合并/Issue 关闭**，说明当前更多处于“集中开发与评审推进期”。  
今天的技术重心非常明确，主要集中在 **Flight SQL ODBC 跨平台支持与 Windows 签名发布链路**、**Parquet/C++ 稳定性修复**、以及 **Python/R 文档与生态接入能力完善**。  
从议题分布看，Arrow 继续强化其作为分析型数据交换与存储基础设施的定位：一边补齐 ODBC/打包/CI 等交付能力，一边推进 Parquet、Dataset、Compute、云存储连接器等核心能力。  
项目健康度总体良好，但也暴露出两个信号：**ODBC/Flight SQL 仍在快速演进阶段**，以及若干 **2022 年遗留 enhancement 长期未决**，需要维护者持续清理积压。

---

## 2. 项目进展

> 今日无已合并/关闭的重要 PR。以下列出最值得关注的“推进中”PR，它们代表了当前最实际的功能落地方向。

### Flight SQL / ODBC 跨平台推进
1. **为 Linux 启用 ODBC 支持**
   - PR: **#49564** `GH-49463: [C++][FlightRPC] Add Ubuntu ODBC Support`
   - 链接: apache/arrow PR #49564
   - 进展意义：这是今天最重要的功能推进之一。该 PR 将 Flight SQL ODBC 从原先偏 Windows/macOS 的支持面，扩展到 **Ubuntu/Linux**，包含 Unicode 支持、CI 构建、docker-compose 和驱动注册步骤。
   - 对分析引擎价值：有助于 Arrow Flight SQL 更自然地接入 Linux 侧 BI/ETL/数据平台部署环境，提升其作为 **高性能 SQL 连接协议** 的实用性。

2. **Flight SQL ODBC 驱动主线开发持续推进**
   - PR: **#46099** `GH-46734: [C++] Arrow Flight SQL ODBC layer`
   - 链接: apache/arrow PR #46099
   - 进展意义：这是 ODBC 驱动建设的主干 PR，今天仍在活跃更新。结合 #49564、#49562 等配套 PR，可以判断 Arrow 社区正系统性补齐 **ODBC 驱动、测试、构建与发行** 全链路。

3. **ODBC 测试套件宽字符处理改进**
   - PR: **#49562** `GH-49561: [C++][FlightRPC][ODBC] Use SQLWCHAR array for wide string literals in test suite`
   - 链接: apache/arrow PR #49562
   - 进展意义：虽然是测试层变更，但反映出 ODBC 兼容性工作正在深入到字符编码和平台差异层面，对 SQL 兼容和驱动稳定性有直接帮助。

### Parquet / 存储引擎能力
4. **修复深层嵌套 WKB GeometryCollection 栈溢出风险**
   - PR: **#49558** `GH-49559: [C++][Parquet] Fix uncontrolled recursion in WKBGeometryBounder::MergeGeometryInternal`
   - 链接: apache/arrow PR #49558
   - 进展意义：通过给递归深度加上限制（128），避免解析深层嵌套几何对象时的栈溢出。这属于典型的 **鲁棒性/安全性修复**，对 geospatial 相关 Parquet 数据读取尤其关键。

5. **Parquet RowGroupWriter 暴露 total_buffered_bytes()**
   - PR: **#49527** `GH-48467: [C++][Parquet] Add total_buffered_bytes() API for RowGroupWriter`
   - 链接: apache/arrow PR #49527
   - 进展意义：这是面向写入路径的实用增强。该 API 能帮助调用方更好地判断何时切分 row group，从而更精细地控制内存占用与文件布局，属于**写入端存储优化能力**。

### 生态与语言绑定
6. **R 接入 Azure Blob Storage 文件系统**
   - PR: **#49553** `GH-32123: [R] Expose azure blob filesystem`
   - 链接: apache/arrow PR #49553
   - 进展意义：Arrow R 侧云存储支持补齐，向 Python 已有能力对齐。若合并，将显著增强 R 用户在 Azure 数据湖/对象存储上的分析工作流。

7. **PyArrow 发布链路新增 riscv64 manylinux wheel**
   - PR: **#49556** `GH-49555: [Python][Packaging] Add riscv64 manylinux wheel builds to release pipeline`
   - 链接: apache/arrow PR #49556
   - 进展意义：有利于 Arrow 在 RISC-V 生态中的可安装性和分发成熟度，属于平台覆盖面的重要信号。

---

## 3. 社区热点

### 1）Flight SQL ODBC Windows 签名与发布链路
- Issue: **#49404** `[C++][CI][Packaging][FlightPRC] Manual ODBC Windows MSI installer signing`
- 链接: apache/arrow Issue #49404
- 热度：评论 **13**
- 相关议题：
  - **#49560** `[Release][CI][FlightSQL] Create release script and GHA workflow for Windows signing`
  - **#49537** `[C++][FlightRPC][ODBC] Upload MSI installer materials for cpack WIX generator`
  - **#49538** `[C++][FlightRPC][ODBC] Change Windows ODBC to Static Linkage`
- 技术诉求分析：  
  这不是简单的打包问题，而是 **Flight SQL ODBC 从“能构建”走向“可正式分发与可被企业安装”** 的关键一步。Windows Defender、MSI 签名、DLL 签名、静态链接减少签名工件数量，这些都表明社区正把 ODBC 驱动视为面向外部用户的正式交付物，而非实验性产物。

### 2）R 语言 Azure Blob Storage 文件系统支持
- Issue: **#32123** `[R] Expose Azure Blob Storage filesystem`
- 链接: apache/arrow Issue #32123
- 热度：评论 **10**，👍 **2**
- 对应 PR：
  - **#49553** `GH-32123: [R] Expose azure blob filesystem`
- 技术诉求分析：  
  用户希望 R 生态在云对象存储能力上与 Python 对齐，尤其是在 Azure 环境中直接访问数据湖数据。这反映出 Arrow 作为跨语言分析基础层时，**各语言绑定功能对齐** 仍是社区关注重点。

### 3）PyCapsule 协议文档化与生态兼容透明度
- Issue: **#47696** `[Docs][Python] PyCapsule protocol implementation status`
- 链接: apache/arrow Issue #47696
- 热度：评论 **9**
- 对应 PR：
  - **#49550** `GH-47696: [Docs] PyCapsule protocol implementation status`
- 技术诉求分析：  
  社区不仅关心协议是否存在，更关心**哪些库已经实现、生态互操作现实可达性如何**。这对零拷贝数据交换、Python 分析生态协作、以及用户选型都非常重要。

### 4）StructBuilder 高性能 UnsafeAppend 接口
- Issue: **#45722** `[C++] StructBuilder should have UnsafeAppend methods`
- 链接: apache/arrow Issue #45722
- 热度：评论 **14**
- 技术诉求分析：  
  这是面向构建器热路径的性能需求。用户希望 `StructBuilder` 拥有与其他 builder 一致的 `UnsafeAppend/UnsafeAppendNull/UnsafeAppendNulls`，本质上是在推动 **复杂嵌套类型的高吞吐构建性能**，对批量写入、向量化构建和上层执行引擎接入都有价值。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1：Parquet 几何解析可能导致栈溢出
- Issue: **#49559** `[C++][Parquet] MergeGeometryInternal may stack overflow from deeply nested WKB GeometryCollection inputs`
- 链接: apache/arrow Issue #49559
- 影响：深层嵌套 WKB GeometryCollection 输入可触发递归过深，导致栈溢出。对处理不受信任或异常 geospatial 数据的场景有较高风险。
- 状态：**已有修复 PR**
  - PR: **#49558**
  - 链接: apache/arrow PR #49558

### P1-P2：PyArrow Dataset 迭代 batch 过程中疑似内存泄漏
- Issue: **#49474** `[Python] Memory Leak while iterating batches of pyarrow dataset`
- 链接: apache/arrow Issue #49474
- 影响：在 HPC 集群上遍历大型 Hive 分区 Parquet dataset 时出现 OOM，被用户明确报告为实际生产阻碍。
- 状态：**暂未看到对应 fix PR**
- 研判：如果问题可复现，优先级应较高，因为这直接影响 Arrow Dataset 在受限内存环境中的可用性。

### P2：macOS Intel CI 出现意外 `libunwind` 依赖
- Issue: **#49563** `[C++][FlightRPC][ODBC] Unexpected dependency libunwind in macOS Intel CI`
- 链接: apache/arrow Issue #49563
- 影响：CI 依赖检查失败，影响 ODBC/macOS 构建链路稳定性。
- 状态：暂无单独 fix PR，但很可能会在 ODBC 相关 PR 中联动处理。
- 研判：虽然属于 CI/打包层问题，但会直接阻碍交付。

### P2：S3 URI 含空格时错误回落到 LocalFileSystem
- PR: **#49372** `GH-41365: [Python] Fix S3 URI with whitespace silently falling back to LocalFileSystem`
- 链接: apache/arrow PR #49372
- 影响：这是潜在的**路径解析正确性问题**。如果云 URI 解析失败后静默回落到本地文件系统，可能导致难以发现的数据读取错误。
- 状态：PR 仍在 review/change review 阶段。

### P3：ODBC 相关跨平台兼容性问题密集暴露
- 相关 Issues：
  - **#49463** Linux 启用 ODBC 构建
  - **#49538** Windows 改静态链接
  - **#49537** 上传 MSI 安装材料
  - **#49561** 测试宽字符字面量处理
- 链接：
  - apache/arrow Issue #49463
  - apache/arrow Issue #49538
  - apache/arrow Issue #49537
  - apache/arrow Issue #49561
- 研判：这些并非单点 bug，而是一个尚在快速成型中的子系统在走向生产化时必然出现的兼容性补洞阶段。

---

## 5. 功能请求与路线图信号

### 1）Flight SQL ODBC 将成为接下来一段时间的重点方向
- 核心信号：
  - Issue **#49404** Windows MSI 签名
  - Issue **#49463** Linux ODBC build
  - PR **#49564** Ubuntu ODBC support
  - PR **#46099** ODBC layer 主线
  - Issue **#49560** 发布脚本与签名工作流
- 结论：  
  可以较强判断，**Arrow Flight SQL ODBC 驱动的跨平台支持、可安装性、发布自动化** 很可能被纳入下一阶段重点交付内容。

### 2）R 云存储连接器补齐很可能近期落地
- Issue: **#32123**
- PR: **#49553**
- 链接：
  - apache/arrow Issue #32123
  - apache/arrow PR #49553
- 结论：  
  该需求存在多年，当前已有对应 PR，说明 **R 对 Azure Blob Storage 的支持** 非常接近可交付状态。

### 3）PyArrow 增加 riscv64 预编译 wheel
- Issue: **#49555**
- PR: **#49556**
- 链接：
  - apache/arrow Issue #49555
  - apache/arrow PR #49556
- 结论：  
  这是明显的平台扩展信号。随着 RISC-V 生态成熟，Arrow 正在提前补齐分发能力。

### 4）新增日期构造计算函数需求值得关注
- Issue: **#49514** `[C++][Python] Compute function to generate date from year / month / day`
- 链接: apache/arrow Issue #49514
- 结论：  
  这是典型的面向分析表达式层的增强，类似 SQL 中 `make_date` 一类能力。若后续出现 PR，可能成为 **Compute/表达式 API 的易用性增强点**。

### 5）StructBuilder 高性能接口可能被纳入 C++ 性能优化清单
- Issue: **#45722**
- 链接: apache/arrow Issue #45722
- 结论：  
  该需求技术上清晰、影响面集中、且属于 builder API 一致性补齐，进入后续版本的概率较高。

---

## 6. 用户反馈摘要

### 1）真实生产痛点：受限内存环境中的 Dataset 扫描
- 来源：Issue **#49474**
- 链接: apache/arrow Issue #49474
- 摘要：  
  用户在 HPC 集群上处理大型 Hive 分区 Parquet 数据集，因内存限制多次被 OOM kill。说明在真实分析场景中，用户不仅关心 Arrow 的吞吐，也高度关注 **batch 迭代是否真正流式、是否存在隐性内存滞留**。

### 2）云对象存储接入一致性仍是语言绑定的重要诉求
- 来源：Issue **#32123**
- 链接: apache/arrow Issue #32123
- 摘要：  
  R 用户明确以 Python 现有能力为参照，希望 Arrow R 能无缝访问 Azure Blob Storage。这表明用户预期 Arrow 各语言前端在对象存储接入上具备**一致能力模型**。

### 3）用户需要更强的文档可发现性，而非仅有底层功能
- 来源：
  - Issue **#47696** / PR **#49550**
  - PR **#49557**
  - PR **#49515**
- 链接：
  - apache/arrow Issue #47696
  - apache/arrow PR #49550
  - apache/arrow PR #49557
  - apache/arrow PR #49515
- 摘要：  
  社区今天有多项文档 PR，集中在 PyCapsule 实现状态、Python 文档目录分层、Cython `.pxi` doctest 机制说明等。反映出用户不仅需要“有功能”，还需要 **可理解、可导航、可贡献** 的文档体系。

### 4）构建器/表达式 API 的“缺一块”会直接影响开发体验
- 来源：
  - Issue **#45722** StructBuilder UnsafeAppend
  - Issue **#49514** 从 year/month/day 生成 date 的 compute 函数
- 链接：
  - apache/arrow Issue #45722
  - apache/arrow Issue #49514
- 摘要：  
  这些需求都不是宏大新模块，而是“日常使用时明显缺失的一块拼图”。这种反馈通常优先级不低，因为它们直接影响上层分析引擎或用户代码的实现简洁度。

---

## 7. 待处理积压

以下是值得维护者特别关注的长期未决议题或老 PR：

### 长期 Issue 积压
1. **#32123** `[R] Expose Azure Blob Storage filesystem`
   - 创建于 2022-06-08，今天终于有 PR 对应。
   - 链接: apache/arrow Issue #32123
   - 建议：加快评审，尽快关闭多年积压。

2. **#31324** `[C++] Strptime issues umbrella`
   - 创建于 2022-03-09
   - 链接: apache/arrow Issue #31324
   - 建议：作为 umbrella issue，应定期整理子问题状态，避免时间解析相关问题长期分散。

3. **#31315** `[C++][Docs] Document that the strptime kernel ignores %Z`
   - 创建于 2022-03-09，带 stale-warning
   - 链接: apache/arrow Issue #31315
   - 建议：即便短期不修功能，也应优先补文档，降低用户误判。

4. **#31383** `[C++] Add option to consolidate key columns in hash join`
   - 创建于 2022-03-16，带 stale-warning
   - 链接: apache/arrow Issue #31383
   - 建议：这与查询结果 schema 设计和 join 语义易用性相关，值得重新评估优先级。

5. **#31370** `[C++] Filter which files to be read in as part of filesystem`
   - 创建于 2022-03-15，带 stale-warning
   - 链接: apache/arrow Issue #31370
   - 建议：涉及 Dataset 文件选择策略，对湖仓/分区数据读取体验有实际价值。

### 长期 PR 积压
1. **#40354** `[Python] Add Python wrapper for VariableShapeTensor`
   - 创建于 2024-03-04，仍处于 change review
   - 链接: apache/arrow PR #40354
   - 建议：该能力关系到张量/不规则张量在 Python 的可用性，值得明确 blocker。

2. **#46099** `[C++] Arrow Flight SQL ODBC layer`
   - 创建于 2025-04-10，仍在 change review
   - 链接: apache/arrow PR #46099
   - 建议：这是 ODBC 方向主线 PR，建议继续拆小、分阶段合并，降低评审复杂度。

3. **#47397** `[Python] CSV and JSON options lack a nice repr/str`
   - 创建于 2025-08-21
   - 链接: apache/arrow PR #47397
   - 建议：属于低风险易用性改进，可考虑加快定论，减少 contributor 等待成本。

---

## 8. 总结判断

今天的 Arrow 没有版本层面的里程碑，但从开发信号看，项目正在围绕几个高价值方向持续推进：  
- **Flight SQL ODBC 生产化**：Linux 支持、Windows 签名、发布自动化、测试兼容性一起推进，说明这是当前最强路线图信号。  
- **Parquet 稳定性与写入控制增强**：几何解析安全修复和 row group 缓冲字节统计 API 都很实用。  
- **生态补齐与平台扩展**：R 的 Azure Blob、PyArrow 的 riscv64 wheel、Python 文档改进都指向更广泛的用户覆盖。  

整体上，Apache Arrow 今日表现为：**工程推进扎实、方向明确，但评审/合并吞吐略慢，积压治理仍有提升空间。**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*