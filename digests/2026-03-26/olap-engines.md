# Apache Doris 生态日报 2026-03-26

> Issues: 8 | PRs: 173 | 覆盖项目: 10 个 | 生成时间: 2026-03-26 01:27 UTC

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

# Apache Doris 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时内，Apache Doris 社区保持**高活跃度**：Issues 更新 8 条，PR 更新高达 173 条，其中 81 条已合并或关闭，说明研发与分支回合并节奏都很快。  
今天的工作重心非常明确，集中在 **外部数据源兼容性修复、云/湖仓连接稳定性、4.1 分支回补（cherry-pick）** 以及若干 FE/BE 调度与认证链路优化。  
从关闭的 PR 看，**Hive / Paimon / External Catalog / Outfile** 等外部生态集成功能在持续打磨，项目对湖仓互通和生产可用性的投入明显。  
与此同时，仍有一些值得关注的稳定性问题暴露出来，尤其是 **Iceberg 扫描导致 BE 崩溃**、**K8s metaservice 日志异常** 等，提示 4.0.x 在线上复杂场景仍有边界问题待收敛。  
整体来看，项目健康度良好，主线开发活跃，但**开放 PR 积压较大（待合并 92 条）**，且存在较多陈旧 PR/Issue 需要清理与聚焦。

---

## 2. 项目进展

以下为今日合并/关闭、且对查询引擎、存储、外部生态或 SQL 兼容性有实质推进的 PR：

### 2.1 Outfile 并行导出删除逻辑修复，提升导出正确性
- **PR #61223** `[fix](outfile) handle delete_existing_files before parallel export`  
  链接: apache/doris PR #61223
- **PR #61726** `branch-4.1` 回补  
  链接: apache/doris PR #61726

**进展解读：**  
修复了 `select ... into outfile` 在 `delete_existing_files=true` 且并行导出时的竞态问题。此前多个 writer 可能并发清理目录，导致彼此已输出的文件被误删。  
这属于典型的**结果正确性 / 导出可靠性修复**，对大规模并行导出、对象存储落盘场景尤其关键。4.1 分支已同步回补，说明维护者认为这是值得尽快进入稳定分支的修复。

---

### 2.2 Hive 外表 DATE 时区偏移修复，提升 SQL 兼容性
- **PR #61330** `[fix](hive) Fix Hive DATE timezone shift in external readers`  
  链接: apache/doris PR #61330
- **PR #61722** `branch-4.1` 回补  
  链接: apache/doris PR #61722

**进展解读：**  
修复 Doris 读取 Hive 外部表 ORC/Parquet `DATE` 列时，受 session time zone 影响导致日期偏移一天的问题，尤其在西半球负时区更明显。  
这是一个典型的**查询结果正确性修复**，也直接关系 Doris 与 Spark/Hive 在湖仓数据读取上的语义一致性。  
该修复已回补到 4.1，说明外部数据源兼容性仍是当前版本线的重点。

---

### 2.3 外部 Catalog 刷新死锁修复，提升元数据链路稳定性
- **PR #61202** `[fix](catalog) avoid external catalog refresh deadlock`  
  链接: apache/doris PR #61202
- **PR #61721** `branch-4.1` 回补  
  链接: apache/doris PR #61721

**进展解读：**  
修复 external catalog 刷新缓存失效与另一个线程初始化 catalog 之间可能发生的锁反转死锁问题，并补充了单测。  
这直接影响 **外部元数据访问可用性**，对 Hive/Iceberg/Paimon 等外部 catalog 使用频繁的用户非常重要。  
从修复形态看，Doris 在 FE 元数据并发控制方面正在持续补课。

---

### 2.4 Paimon 支持 JDBC Catalog，扩展湖仓连接能力
- **PR #61094** `[feat](paimon) support jdbc catalog type`  
  链接: apache/doris PR #61094
- **PR #61694** `branch-4.1` 回补  
  链接: apache/doris PR #61694

**进展解读：**  
新增 Paimon JDBC metastore 属性与驱动加载支持，并在 catalog factory 和 thrift 转换链路中接入。  
这意味着 Doris 对 **Paimon 元数据接入方式** 的支持更加完整，适配更多企业级部署形态。  
对于正在构建统一湖仓查询入口的用户，这是一个明确的生态增强信号。

---

### 2.5 MaxCompute 写入认证补全，云数据源写入能力增强
- **PR #61717** `branch-4.1:[feature](maxcompute) supplement missing writer auth pick from #60649`  
  链接: apache/doris PR #61717

**进展解读：**  
为 4.1 分支补齐 MaxCompute 写入端认证能力，包括 `ram_role_arn` 和 `ecs_ram_role` 等认证方式。  
这表明 Doris 对公有云/云原生数据平台的**写入互通**正在持续补完，重点不仅是读，也包括安全认证链路的一致性。

---

## 3. 社区热点

### 3.1 Iceberg 扫描/加载触发 BE Crash
- **Issue #61225** `[Bug] BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg table scanning/loading`  
  链接: apache/doris Issue #61225

**热度原因：**  
这是今天最值得关注的开放 Bug 之一，问题直接指向 **BE SIGSEGV 崩溃**，且发生在 Iceberg 表扫描/加载场景。  
从描述看，涉及 `ByteArrayDictDecoder` 与 `std::out_of_range`，可能与字典解码、Parquet/列式页解析或异常边界处理有关。  
**背后技术诉求：** 用户要求 Doris 在 Iceberg 场景下具备更强的列式读取健壮性，尤其是面对复杂文件、异常编码或边界数据时不能直接导致 BE 进程崩溃。

---

### 3.2 LDAP 认证链路韧性与可观测性增强
- **PR #61673** `[fix](ldap) Improve LDAP authentication resiliency and diagnostics`  
  链接: apache/doris PR #61673

**热度原因：**  
该 PR 直指 FE 登录认证路径中的挂起、阻塞、慢搜索、诊断能力弱等问题。  
**背后技术诉求：** 企业用户对 Doris 接入统一身份认证体系的需求越来越强，认证链路不仅要“能用”，还要在 LDAP 服务器慢或不可用时具备超时控制、清晰日志与稳定退化行为。  
这类 PR 往往会被大企业用户重点关注，因为它与生产登录可用性直接相关。

---

### 3.3 INSERT INTO local 调度忽略 backend_id
- **PR #61732** `[fix](fe) Fix INSERT INTO local TVF ignoring backend_id during scheduling`  
  链接: apache/doris PR #61732

**热度原因：**  
该 PR 解决 `INSERT INTO local("backend_id"="X")` 场景下，调度器仍可能把 sink fragment 发往任意 BE 的问题。  
**背后技术诉求：** 用户希望本地文件写入、节点定向写入、调试和运维操作具有**强确定性**，而不是被调度器“优化掉”。  
这是一个很典型的 FE 调度语义修正问题。

---

### 3.4 Hive 回归测试去重
- **PR #61671** `[Fix](Regression) reduce duplicate hive2/hive3 regression runs`  
  链接: apache/doris PR #61671

**热度原因：**  
虽然不是产品功能修复，但它体现出项目正在压缩回归冗余、提升 CI 效率。  
**背后技术诉求：** 随着外部数据源功能越来越多，测试矩阵快速膨胀，社区需要在覆盖率和开发效率之间做平衡。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P0 / 严重：Iceberg 扫描导致 BE 崩溃
- **Issue #61225**  
  链接: apache/doris Issue #61225  
- 状态：**OPEN**
- 版本：**v4.0.2**

**问题概述：**  
读取或加载 Iceberg 表时，BE 稳定复现 SIGSEGV，伴随 `ByteArrayDictDecoder` 和 `std::out_of_range` 错误。  

**影响判断：**  
这是典型的**进程级稳定性问题**，优先级高于普通查询错误。若影响广泛数据文件类型，将显著削弱 Doris 在 Iceberg 场景的生产可用性。  

**是否已有 fix PR：**  
当前提供的数据中**未看到直接关联 fix PR**，建议优先跟进。

---

### P1 / 高：Metaservice 在 K8s 上不再输出 stdout 日志
- **Issue #61728**  
  链接: apache/doris Issue #61728  
- 状态：**OPEN**
- 版本：**4.0.4**

**问题概述：**  
升级到 4.0.4 后，Kubernetes 环境中的 Metaservice 不再向标准输出打印日志。  

**影响判断：**  
虽然不是数据正确性问题，但在云原生部署中属于**可观测性退化**，会直接影响日志采集、故障排查和运维监控。  
对使用 stdout/stderr 作为日志采集入口的集群来说，影响明显。

**是否已有 fix PR：**  
暂无明确关联 fix PR。

---

### P1 / 高：LDAP 认证在慢服务场景下可能登录挂起/阻塞
- **PR #61673**  
  链接: apache/doris PR #61673  
- 状态：**OPEN**

**问题概述：**  
该 PR 的问题描述表明，现有 LDAP 认证路径在 LDAP 服务慢或不可用时，可能出现登录 hang、阻塞、诊断能力差。  

**影响判断：**  
对启用 LDAP 的企业用户，这是**服务可用性问题**，影响登录与权限链路。  

**是否已有 fix PR：**  
**已有修复 PR，在审中。**

---

### P1 / 高：INSERT INTO local 忽略 backend_id
- **PR #61732**  
  链接: apache/doris PR #61732  
- 状态：**OPEN**

**问题概述：**  
`INSERT INTO local` 指定 `backend_id` 后，调度器仍可能把任务发给别的 BE。  

**影响判断：**  
属于**语义不一致 / 调度正确性问题**，影响定向写入的可预期性。  

**是否已有 fix PR：**  
**已有修复 PR，在审中。**

---

### P2 / 中：Azure Vault HTTPS 不工作
- **Issue #60971**  
  链接: apache/doris Issue #60971  
- 状态：**CLOSED**
- 版本：**4.0.3**

**问题概述：**  
Azure Vault 在 HTTPS 场景下不可用。  
今日已关闭，但从提供数据中未看到直接对应 PR，可能已在其他提交中处理或以非代码方式关闭。  
建议后续关注是否有公开修复说明。

---

### P2 / 中：BRPC Error 老问题因 stale 关闭
- **Issue #46608**  
  链接: apache/doris Issue #46608  
- 状态：**CLOSED / Stale**

**问题概述：**  
查询、写入、删除过程中会出现 BRPC 错误。  
该问题今天因 stale 机制关闭，未显示近期实质性推进。

**影响判断：**  
BRPC 错误通常涉及 RPC 稳定性、网络抖动、超时或服务端处理压力，但该条当前更多体现为**积压问题的自动清理**。

---

## 5. 功能请求与路线图信号

### 5.1 复杂密码校验支持
- **Issue #61727** `[Feature] Support complex user-password validation`  
  链接: apache/doris Issue #61727

**需求解读：**  
用户希望 Doris 支持更复杂的密码策略，如必须包含符号、数字等。  
这是明显的**企业安全合规需求**，与 LDAP、本地认证、统一身份治理场景相关。

**纳入下一版本可能性：**  
中等偏高。  
原因是今天同时出现了 **LDAP 韧性增强 PR #61673**，说明认证与安全链路正被维护者关注。若社区后续补充密码策略配置项设计，此类需求进入 4.1.x/后续小版本并不意外。

---

### 5.2 ANN 索引为何仅支持 Duplicate Key
- **Issue #61712**  
  链接: apache/doris Issue #61712

**需求解读：**  
用户询问 ANN index 为什么仅支持 Duplicate Key 表模型，是否计划支持 Unique Key / Aggregate Key。  

**技术信号：**  
这不是简单咨询，背后代表用户希望 Doris 的向量检索能力能更自然地融入更多主流表模型，而不被建模方式限制。  
这触及 Doris 在 **向量索引与存储模型语义耦合** 上的设计边界，可能涉及主键更新、聚合语义、索引维护成本与一致性策略。

**纳入下一版本可能性：**  
短期不确定。当前数据中未见直接配套 PR，因此更像是**路线图探索信号**，而非即将落地功能。

---

### 5.3 Cloud 模式 SHOW META-SERVICES
- **PR #56247** `[FE][feature] Add SHOW META-SERVICES in cloud mode`  
  链接: apache/doris PR #56247

**需求解读：**  
该长期打开 PR 说明云模式下的元服务可观测性仍有缺口。  
结合今日新 Issue #61728（Metaservice 在 K8s 无 stdout 日志），可以看出**云管控/云原生运维可观测性**是持续需求点。

**纳入下一版本可能性：**  
中等。虽然 PR 已 stale，但问题方向仍然有效。

---

## 6. 用户反馈摘要

基于今日 Issues/PR 描述，可提炼出以下真实用户痛点：

### 6.1 湖仓读取“能连通”之外，更要求结果正确
- 代表项：**Hive DATE 时区修复 PR #61330**、**Iceberg BE Crash Issue #61225**
- 用户诉求：  
  用户不只关心能否读 Hive/Iceberg/Paimon，而更关心**与上游引擎语义一致**、面对复杂数据文件时不崩溃。  
  这反映 Doris 正从“支持连接器”阶段，进入“生产级兼容性”阶段。

### 6.2 云原生部署下，可观测性问题会迅速暴露
- 代表项：**Issue #61728**
- 用户诉求：  
  K8s 用户强依赖 stdout 日志和统一日志采集链路。日志输出行为一旦变化，会迅速影响诊断与告警体系。  
  这说明 Doris 的云模式/元服务组件在发布前需要更关注容器化运行约定。

### 6.3 企业认证场景更重视稳定退化与可诊断性
- 代表项：**PR #61673**、**Issue #61727**
- 用户诉求：  
  企业用户不满足于“支持 LDAP/密码登录”，他们需要认证系统在上游变慢、异常、抖动时仍可控，并具备策略约束和清晰日志。

### 6.4 定向调度与节点级行为需要强语义保证
- 代表项：**PR #61732**
- 用户诉求：  
  当用户显式指定 `backend_id` 时，希望系统完全遵循而非模糊调度。这通常出现在本地文件导入、运维排障、节点隔离验证等场景。

---

## 7. 待处理积压

以下是值得维护者关注的长期未决或 stale 项：

### 7.1 多个依赖升级 PR 长期挂起
- **PR #52454** `jackson-core 2.13.3 -> 2.15.0`  
  链接: apache/doris PR #52454
- **PR #53029** `commons-fileupload 1.5 -> 1.6.0`  
  链接: apache/doris PR #53029
- **PR #53136** `nimbus-jose-jwt 10.0.1 -> 10.0.2`  
  链接: apache/doris PR #53136
- **PR #53138** `commons-lang3 3.17.0 -> 3.18.0`  
  链接: apache/doris PR #53138

**提醒：**  
这些 Dependabot PR 长期 stale，虽然不一定都应自动合并，但若涉及安全修复或生态兼容，应定期批量评估，避免依赖债务扩大。

---

### 7.2 云模式元服务可观测性相关 PR 挂起
- **PR #56247** `[FE][feature] Add SHOW META-SERVICES in cloud mode`  
  链接: apache/doris PR #56247

**提醒：**  
今天新出现的 K8s metaservice 日志问题，使这类云运维可观测性增强功能更具现实意义。建议重新评估。

---

### 7.3 Profile 相关修复 PR 长期未推进
- **PR #56498** `[fix](profile) Remove the same named counter on the exchange receiving`  
  链接: apache/doris PR #56498
- **PR #56500** 同主题重复 PR  
  链接: apache/doris PR #56500

**提醒：**  
两条内容近似、均 stale，说明可能存在重复提交或流程卡滞。建议维护者明确保留哪一个，减少审查噪音。

---

### 7.4 Nereids 相关老需求被 stale 关闭，但能力缺口仍可能存在
- **Issue #42631** `(nereids) implement StatsCommand in nereids`  
  链接: apache/doris Issue #42631

**提醒：**  
该需求今日因 stale 关闭，但它指向的是 **Nereids 与 legacy planner 在命令支持上的功能对齐问题**。  
若用户仍在迁移到新优化器，这类“命令覆盖不完整”问题仍值得在路线图中持续跟踪。

---

## 8. 总结判断

今天 Doris 的主线节奏偏向**稳定性修复 + 外部生态兼容 + 4.1 分支回补**。  
最有价值的成果是围绕 **Hive 日期语义、外部 catalog 死锁、outfile 并发删除竞态、Paimon JDBC catalog** 的一系列推进，说明项目在“湖仓互联 + 生产可用性”上持续做深。  
风险侧则主要集中在 **Iceberg 崩溃、K8s metaservice 可观测性退化、LDAP 认证阻塞** 等问题，这些都与企业生产环境直接相关，建议维护者优先收敛。  
从路线图信号看，**安全合规（复杂密码）、云模式可观测性、向量索引适配更多表模型**，可能会成为后续社区讨论的重点方向。

---

## 横向引擎对比

以下是基于 2026-03-26 各项目社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# OLAP / 分析型存储引擎开源生态横向对比分析报告
**日期：2026-03-26**

## 1. 生态全景

当前 OLAP 与分析型存储引擎开源生态呈现出三个非常明确的趋势：**湖仓互操作持续深化、查询正确性与稳定性成为核心竞争点、以及多引擎/多平台兼容能力快速上升**。  
从社区活动看，Doris、ClickHouse、StarRocks、DuckDB、Iceberg 等项目都在高频推进外部数据源、对象存储、Catalog、流式/增量读取、SQL 兼容和执行引擎边界修复。  
与此同时，生态已经从“能连通、能跑”阶段进入“**结果必须正确、异常要可诊断、线上行为要可预测**”阶段，尤其体现在 Hive/Iceberg/Paimon/Parquet/LDAP/对象存储等真实生产链路上。  
整体上，**引擎能力边界仍在扩张，但质量治理已成为主线**；活跃项目普遍一边扩展能力，一边承受 analyzer、复杂类型、外部连接器和跨版本兼容带来的高回归压力。

---

## 2. 各项目活跃度对比

> 说明：以下数据均来自题述日报摘要；“健康度评估”为结合活跃度、修复节奏、回归密度与风险暴露的综合判断。

| 项目 | Issues 更新 | PR 更新 | Release | 当日社区特征 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 8 | 173 | 无 | 外部生态兼容、4.1 回补、FE/BE 稳定性修复活跃 | **良好，主线强活跃，但稳定性与积压需持续收敛** |
| **ClickHouse** | 32 | 349 | 无 | SQL/对象存储/数据湖/类型系统并行推进，回归密度高 | **高活跃但高回归，高速演进型** |
| **DuckDB** | 30 | 52 | 无 | 1.5.x 回归修复、CLI/Windows、对象存储兼容、窗口优化正确性 | **良好，修复响应快，但新优化风险明显** |
| **StarRocks** | 9 | 120 | **4.0.8** | 多分支回移、外表/文件导入、连接稳定性、湖仓问题持续暴露 | **良好偏稳，版本运维能力强** |
| **Apache Iceberg** | 21 | 50 | 无 | V4 metadata、REST/OpenAPI、Spark/Flink 正确性、Variant 热度高 | **良好，方向清晰，但跨引擎一致性风险较突出** |
| **Delta Lake** | 2 | 40 | 无 | kernel-spark CDC 流式链路集中开发，DSv2 基建推进 | **良好偏强，开发主题集中，风险相对可控** |
| **Databend** | 3 | 22 | 无 | SQL 兼容、planner/join/statistics 修复、执行引擎演进 | **活跃且偏工程收敛期** |
| **Velox** | 6 | 50 | 无 | 执行引擎修复、GPU/cuDF、remote function、CI 工程治理 | **良好，但 fuzz/crash 问题需优先收敛** |
| **Apache Gluten** | 12 | 15 | 无 | Spark 4.x 兼容、Velox 跟进、GPU/CPU 混合集群问题 | **良好，兼容性攻坚阶段** |
| **Apache Arrow** | 50 | 26 | 无 | R/Python 生态、Flight SQL ODBC、Parquet 高级特性、CI 稳定性 | **良好，偏质量巩固与生态补齐** |

### 简要排序观察
- **超高活跃**：ClickHouse、Doris、StarRocks  
- **高活跃且主题集中**：DuckDB、Iceberg、Delta Lake  
- **基础设施/执行层活跃**：Velox、Arrow、Gluten  
- **中高活跃、偏收敛**：Databend

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的相对优势

与同类项目相比，Apache Doris 当前最突出的优势有三点：

1. **湖仓互联与传统 OLAP 一体化较均衡**  
   Doris 当天最核心的进展都围绕 Hive、Paimon、External Catalog、MaxCompute、Outfile 等展开，说明它并不是只做内部表分析，而是在强化“**统一查询入口 + 统一访问层**”定位。  
   相比 ClickHouse 更偏内部执行引擎与高速分析、DuckDB 更偏嵌入式分析、Iceberg 更偏表格式规范，Doris 更接近“**面向企业数仓/湖仓混合场景的统一分析数据库**”。

2. **稳定分支维护节奏明确，4.1 回补频繁**  
   当天多个修复都有 branch-4.1 cherry-pick，反映 Doris 对稳定分支运营较重视。  
   这点与 StarRocks 类似，优于一些更偏主干高速演进的项目。

3. **SQL + 存储 + 外部 Catalog 三条线同时推进**  
   Doris 既有 FE 调度语义修复、认证链路改进，也有外部表日期语义、catalog 死锁、导出竞态等修补，说明其架构覆盖面广，具备完整数据库产品属性。

### 3.2 Doris 的短板与压力点

1. **外部生态接入的 correctness/稳定性压力仍大**  
   Iceberg 扫描导致 BE Crash、Hive DATE 时区偏移、External Catalog deadlock 等问题，说明 Doris 在“连接器生产化”阶段仍有不少边界成本。  
   这与 StarRocks、ClickHouse 在湖仓连接器上的压力相似。

2. **开放 PR 积压较高**  
   当日待合并 PR 92 条，说明主线活跃，但审查/收敛压力不小。  
   若不持续清理 stale 与重复 PR，容易拉高维护噪音。

3. **云原生组件可观测性和认证链路还需补课**  
   K8s metaservice stdout 日志问题、LDAP hang/阻塞问题，都说明 Doris 正在从“数据库内核”向“企业平台组件”演进，但控制面体验还未完全稳定。

### 3.3 技术路线差异

相对于其他项目，Doris 的路线更偏：

- **全栈分析数据库**：兼顾 FE/BE、内部存储、外部表、导入导出、权限认证、Catalog
- **面向企业数仓替换/扩展**：比 DuckDB 更服务端、比 Iceberg 更数据库、比 Arrow/Velox 更产品化
- **湖仓接入型 MPP 引擎**：与 StarRocks 最相近，但 Doris 在开源生态中的连接器广度与社区多样性仍保持较强竞争力

### 3.4 社区规模对比

从当日 PR 活跃度看：

- Doris：173 PR
- StarRocks：120 PR
- DuckDB：52 PR
- Iceberg：50 PR
- Delta：40 PR
- Databend：22 PR

Doris 明显处于 **第一梯队高活跃项目**。  
虽然不及 ClickHouse 的 349 PR，但在面向“数据库产品 + 湖仓连接 + 稳定分支维护”的综合型项目中，Doris 仍属于社区规模和开发吞吐都比较强的代表。

---

## 4. 共同关注的技术方向

以下是多个项目共同涌现的需求与问题：

### 4.1 湖仓互操作与外部 Catalog 稳定性
**涉及项目**：Doris、StarRocks、ClickHouse、Iceberg、Delta Lake、Gluten、Arrow、DuckDB

**具体诉求**：
- Hive/Iceberg/Paimon/Delta/Parquet 读取语义一致
- 外部 Catalog 刷新、缓存、分区管理稳定
- 对象存储、S3-compatible、ADLS、Azure Blob 等接入可靠
- 外部元数据不能导致 OOM、死锁或静默错误结果

**典型信号**：
- Doris：Hive DATE 修复、external catalog deadlock、Paimon JDBC catalog、Iceberg crash
- StarRocks：Iceberg 百万分区 FE OOM、Paimon refresh ClassCastException、Parquet FIXED_LEN_BYTE_ARRAY
- ClickHouse：Iceberg/Parquet query_log 与 pushdown、Iceberg ALTER UPDATE 异常
- DuckDB：S3 ETag 误判、Parquet/MAP skipping、远程缓存优化
- Iceberg/Delta：REST Catalog、CDC、Flink/Spark/Connect 生态一致性

### 4.2 查询正确性优先于新功能
**涉及项目**：ClickHouse、Doris、DuckDB、StarRocks、Databend、Velox、Iceberg

**具体诉求**：
- 聚合结果不能错
- 窗口函数优化不能破坏语义
- 时间类型、Decimal、JOIN、CTE、LATERAL、subquery 等边界必须正确
- 即使输入异常，也不能 panic / SIGSEGV

**典型信号**：
- ClickHouse：Decimal MAX/MIN 错误、accurateCastOrNull 静默错误
- DuckDB：WindowSelfJoinOptimizer 错误结果、LATERAL JOIN 语义问题
- Doris：Hive DATE 偏移、INSERT INTO local backend_id 语义问题
- Databend：FULL OUTER JOIN nullability、correlated subquery over union
- Velox：HashProbe crash、Window Fuzzer SIGSEGV
- Iceberg：Spark 不同 snapshot 查询串结果

### 4.3 云对象存储与云原生可观测性
**涉及项目**：Doris、DuckDB、StarRocks、Arrow、Velox、Iceberg

**具体诉求**：
- K8s/容器化环境日志输出规范
- 云对象存储 SDK/ETag/异常类型处理一致
- Azure/S3/ABFS/Blob 客户端生命周期和性能优化
- stdout/stderr、query_log、cache metrics 等可观测性增强

### 4.4 Spark / Flink / DSv2 / 多引擎兼容
**涉及项目**：Iceberg、Delta Lake、Gluten、Arrow、Doris、StarRocks

**具体诉求**：
- Spark 4.x 兼容性
- Flink Sink 正确性与恢复语义
- DataSource V2 写入、DDL、CDC 能力成熟
- 多引擎间共享同一湖表时行为稳定一致

### 4.5 认证、安全、企业治理
**涉及项目**：Doris、StarRocks、Iceberg、Arrow

**具体诉求**：
- LDAP 韧性、复杂密码策略
- REST Catalog 细粒度权限
- 依赖 CVE 清理
- 供应链安全与 CI workflow 加固

---

## 5. 差异化定位分析

## 5.1 存储格式与数据管理定位

| 项目 | 核心定位 |
|---|---|
| **Apache Doris** | 自有 MPP 分析数据库 + 强外部表/湖仓接入 |
| **ClickHouse** | 高性能列式 OLAP 数据库，内部表分析和复杂 SQL/类型系统极强 |
| **StarRocks** | MPP 分析数据库，强调实时数仓与湖仓统一分析 |
| **DuckDB** | 嵌入式分析数据库，适合本地/单机/开发分析与数据科学工作流 |
| **Apache Iceberg** | 开放表格式与元数据规范，不是执行引擎 |
| **Delta Lake** | 湖表事务层与协议，强绑定 Spark/Kernel 生态 |
| **Databend** | 云原生分析数据库，兼顾 SQL 兼容与新型存储/执行设计 |
| **Velox** | 查询执行引擎/向量化运行时，不是完整数据库 |
| **Gluten** | Spark 列式加速层，承接 Velox/CH 后端能力 |
| **Arrow** | 列式内存格式 + 多语言计算/IO/连接协议基础设施 |

### 关键判断
- **Doris / StarRocks / ClickHouse / Databend**：完整数据库产品
- **DuckDB**：嵌入式数据库
- **Iceberg / Delta**：湖表协议与元数据层
- **Velox / Arrow / Gluten**：执行与生态基础设施层

---

## 5.2 查询引擎设计差异

### Apache Doris / StarRocks
- 都是典型 **MPP 分布式分析数据库**
- 强调服务端、多节点、数仓化工作负载
- 对外部 Catalog 和湖仓接入越来越重视
- Doris 今天更突出的是 **外部连接 correctness 和 FE/认证链路收敛**

### ClickHouse
- 更偏 **极致性能、复杂类型、对象存储/缓存和 SQL 能力快速扩张**
- 技术进化速度最快之一
- 代价是 analyzer、类型系统、数据湖路径回归密度高

### DuckDB
- 单机嵌入式最强代表
- 适合 notebook、ETL 边车、开发分析、轻服务场景
- 当前更多问题来自 **1.5.x 新优化与跨平台兼容**

### Databend
- 仍在强化 SQL 正确性、planner、join、统计基础设施
- 路线偏云原生、现代架构，但整体生态成熟度仍低于 Doris/ClickHouse/StarRocks 第一梯队

### Velox / Gluten
- 不直接与 Doris 在产品层竞争
- 更像“**执行加速底座**”
- 影响 Spark/Presto 系生态性能和原生执行覆盖率

### Iceberg / Delta / Arrow
- 不直接提供完整 OLAP 数据库体验
- 更像生态“标准层”和“中间层”
- 对 Doris 的意义在于：它们是 Doris 必须兼容的外部生态接口与事实标准

---

## 5.3 目标负载类型差异

| 项目 | 更擅长的负载 |
|---|---|
| Doris | 企业数仓、实时报表、统一湖仓查询、外部表分析 |
| ClickHouse | 高并发分析、日志/指标/事件、复杂列式计算、搜索分析融合 |
| StarRocks | 实时数仓、报表加速、湖仓融合查询 |
| DuckDB | 单机分析、数据科学、嵌入式 ETL、本地文件分析 |
| Iceberg / Delta | 湖表管理、事务与元数据、跨引擎共享 |
| Databend | 云原生分析服务、现代 SQL 分析场景 |
| Velox / Gluten | Spark/Presto 列式执行加速 |
| Arrow | 数据交换、格式互操作、Flight/ODBC/多语言分析接口 |

---

## 5.4 SQL 兼容性差异

- **ClickHouse**：正在快速补 SQL 标准能力，但仍保留强自有风格
- **Doris / StarRocks**：更强调 MySQL 风格与企业 SQL 使用习惯兼容
- **DuckDB**：兼容 PostgreSQL 风格特性较积极，适合分析师使用体验
- **Databend**：仍在持续补齐 DDL、字面量、JOIN、GROUPING 等兼容缺口
- **Gluten / Velox**：兼容性更多取决于上层 Spark/Presto 语义映射
- **Iceberg / Delta / Arrow**：SQL 不是核心竞争场，而是接口/协议能力

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：超高活跃、主线高速演进
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

特点：
- PR 数量大
- 新功能与修复并行
- 回归密度高但响应也快
- 适合需要持续关注版本行为变化的用户

### 第二层：高活跃、功能集中推进
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**
- **Arrow**

特点：
- 某几条主线很清晰
- 开发节奏稳定
- 逐步从功能扩展走向可用性增强
- 更容易识别短期路线图

### 第三层：工程收敛与能力补齐期
- **Databend**
- **Gluten**

特点：
- 问题多集中在兼容性、执行边界、配置语义、上游依赖
- 仍在打磨成熟度
- 更适合关注版本窗口与特定能力落地情况

---

## 6.2 快速迭代 vs 质量巩固

### 处于快速迭代阶段
- ClickHouse
- DuckDB
- Delta Lake
- Velox
- Gluten

表现：
- 新功能链条长
- analyzer / optimizer / GPU / CDC / DSv2 等新路径大量推进
- 边界 bug 较多，说明新能力正在接受真实负载验证

### 处于质量巩固阶段
- Doris
- StarRocks
- Arrow
- Iceberg

表现：
- 更多是修兼容性、稳分支、补可观测性、改协议边界
- 用户已大量用于生产，需要控制“错误结果、崩溃、回归”
- Doris 和 StarRocks虽仍高活跃，但明显在向“生产级收敛”倾斜

---

## 7. 值得关注的趋势信号

## 7.1 “能连通”已经不够，生态竞争进入“语义一致性”阶段
无论是 Doris 的 Hive DATE 修复、ClickHouse 的 Decimal 聚合错误、DuckDB 的窗口优化错误结果、Iceberg 的 snapshot 查询异常，还是 StarRocks 的 Iceberg stale cache，核心都指向一点：  
**跨引擎互通的下一阶段竞争，不是接口数量，而是结果是否绝对可信。**

**对架构师的启示**：  
选型时不能只看“支持 Hive/Iceberg/Paimon/Delta”，必须把：
- 时区语义
- 类型映射
- 快照一致性
- 异常文件健壮性
纳入验证清单。

---

## 7.2 湖仓控制面正在成为瓶颈
StarRocks 的百万分区 Iceberg FE OOM、Doris 的 external catalog deadlock、Iceberg 的 REST/OpenAPI 演进都表明：  
**未来瓶颈不只在扫描执行，还在元数据管理、缓存、Catalog API、权限治理。**

**对数据工程师的启示**：  
当分区数、对象数、Catalog 数量增长时，FE/控制面内存、刷新策略、缓存淘汰和 API 可观测性会成为首要问题。

---

## 7.3 对象存储与云原生部署已经是默认前提
DuckDB 的 S3 ETag 问题、Arrow 的 Azure Blob 支持、Velox 的 ABFS 性能、Doris 的 K8s metaservice 日志、StarRocks 的 ADLS 问题，说明主流项目都不再把云对象存储当“附加能力”，而是当“默认运行环境”。

**对平台团队的启示**：  
未来选型要重点看：
- S3-compatible 兼容细节
- ADLS/ABFS/Azure Blob 支持深度
- stdout/stderr 与 K8s 日志约定
- 缓存与客户端生命周期管理

---

## 7.4 SQL 兼容性仍然是数据库替换的重要抓手
ClickHouse 补 `UNIQUE(subquery)`、Databend 补 `ALTER TABLE ADD COLUMN IF NOT EXISTS`、DuckDB 补 regex/CTE/LATERAL/VALUES、StarRocks 推 CTE materialization hints，都说明：
**企业用户越来越在真实迁移，而不是只做新建系统。**

**对决策者的启示**：  
如果目标是替换传统数仓或统一分析栈，SQL 兼容与行为稳定性应与性能同等看待。

---

## 7.5 执行引擎基础设施层正在加速分化
Velox、Gluten、Arrow、Delta Kernel 这类项目的高活跃说明，生态正在从“单体数据库竞争”扩展为“**底层执行层 + 表格式层 + 连接协议层 + 上层数据库产品**”的分层竞争。

**对架构师的启示**：  
未来技术选型不一定是选一个“数据库”，而更可能是组合：
- 表格式：Iceberg / Delta
- 传输/格式层：Arrow / Flight
- 执行层：Velox / Gluten / 自研引擎
- 服务层：Doris / StarRocks / ClickHouse / Databend

---

# 结论

从 2026-03-26 的社区动态看，OLAP 开源生态已经进入一个非常清晰的新阶段：  
**数据库产品层、湖表协议层、执行加速层、数据接口层正在同步成熟，但真正的竞争焦点已经从“支持多少功能”转向“在复杂生产场景下是否正确、稳定、可诊断”。**

对 Apache Doris 而言，其当前定位非常清楚：  
它仍是 **面向企业级统一分析入口的强竞争者**，在外部生态接入广度、稳定分支维护和全栈数据库能力上具备明显优势；但与 ClickHouse、StarRocks 等第一梯队相比，仍需继续压降外部连接 correctness、云原生可观测性与控制面稳定性风险。

如果你愿意，我下一步可以继续输出以下任一版本：

1. **管理层 1 页简版**
2. **Apache Doris vs ClickHouse vs StarRocks 三强对比版**
3. **面向数据平台团队的选型建议版**
4. **Markdown 表格周报版（适合飞书/公众号）**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时 ClickHouse 继续保持**高强度活跃**：Issues 更新 32 条，PR 更新高达 349 条，说明主线开发、CI 修复、特性迭代和回归处理都在并行推进。  
从内容看，今日重点集中在三类方向：**查询引擎正确性修复**、**对象存储/缓存与数据湖集成增强**、以及**SQL 能力扩展**。  
稳定性方面，社区新报出多条与 **聚合正确性、Mutation/复制一致性、类型转换、Parquet/Iceberg 读取、Npy 边界处理** 相关的问题，表明 26.x 新功能与新路径正在接受更广泛的真实负载验证。  
总体判断：项目健康度仍高，但**回归密度偏高**，尤其在 analyzer、复杂类型、数据湖读取链路和测试基础设施方面，需要持续压降风险。

---

## 2. 项目进展

> 今日数据未单独列出“已合并 PR 明细”，以下重点基于最近活跃且已关闭/推进明显的 PR 与关闭 Issue 进行归纳。

### 2.1 查询引擎与 SQL 功能持续推进

- **支持 SQL 标准 `UNIQUE(subquery)` 谓词**
  - PR: #99877  
  - 链接: ClickHouse/ClickHouse PR #99877
  - 意义：增强 SQL 标准兼容性，补齐 `EXISTS` 之外的子查询谓词能力，对 BI/迁移型用户有吸引力。

- **AST JSON 序列化**
  - PR: #100412  
  - 链接: ClickHouse/ClickHouse PR #100412
  - 意义：这类能力通常服务于查询分析、审计、调试、IDE/代理层、以及跨系统表达式交换，对生态工具建设是正向信号。

- **Substrait 计划序列化支持（`EXPLAIN SUBSTRAIT`）**
  - PR: #94540  
  - 链接: ClickHouse/ClickHouse PR #94540
  - 意义：这是明显的开放生态方向，说明 ClickHouse 正在加强与其他查询系统/执行器的互操作能力。

- **新增 `JSONAllValues` 函数，并支持在其上构建 text index**
  - PR: #100730  
  - 链接: ClickHouse/ClickHouse PR #100730
  - 意义：面向半结构化 JSON 检索场景，兼顾函数能力与索引可用性，适合日志、事件、观测数据场景。

### 2.2 存储与缓存路径有明显优化

- **新增 `borrow_from_cache` 对象存储类型与 `memory` 元数据类型**
  - PR: #100371  
  - 链接: ClickHouse/ClickHouse PR #100371
  - 意义：这是今天最值得关注的存储方向变化之一。它把对象生命周期与文件系统缓存绑定，可能用于降低临时对象写入开销、优化短生命周期数据路径，对对象存储/缓存协同是重要探索。

- **优化 userspace page cache 热路径**
  - PR: #100300  
  - 链接: ClickHouse/ClickHouse PR #100300
  - 意义：通过预计算 hash、减少字符串复制来降低读路径开销，直接对应大文件读取场景的 CPU 与分配成本，属于典型的分析型引擎“微架构级”性能打磨。

- **按位置而非名称做 unused column removal**
  - PR: #100586  
  - 链接: ClickHouse/ClickHouse PR #100586
  - 意义：这是执行计划/列裁剪层面的健壮性改进，有助于复杂查询、重命名、投影重写等场景下减少误判。

### 2.3 数据湖与可观测性增强

- **修复 Iceberg 查询 `system.query_log.read_rows` 显示为 0**
  - PR: #99282  
  - 链接: ClickHouse/ClickHouse PR #99282
  - 对应问题：不是纯功能增强，而是**可观测性修复**。对于使用 Iceberg 的用户，读行数指标失真会影响容量评估、性能诊断和成本核算。

- **为 DataLakeCatalog 查询填充 `used_table_functions`**
  - PR: #100706  
  - 链接: ClickHouse/ClickHouse PR #100706
  - 意义：进一步改善 query_log 中数据湖访问链路的可观测性，说明官方正在补齐 Iceberg/DeltaLake 的运维分析体验。

### 2.4 近期关闭/推进的 Bug 修复

- **Npy 负 shape 维度导致无限循环**
  - Issue: #99585（已关闭）
  - 链接: ClickHouse/ClickHouse Issue #99585
  - 评价：属于典型格式解析边界漏洞，虽然偏输入异常场景，但会造成查询卡死，已关闭是积极信号。

- **行级策略 + analyzer 导致 `NOT_FOUND_COLUMN_IN_BLOCK`**
  - Issue: #100194（已关闭）
  - 链接: ClickHouse/ClickHouse Issue #100194
  - 评价：涉及访问控制与 analyzer 交互，是生产可用性问题，关闭说明该类治理已有进展。

- **支持 `FROM (VALUES (...), ...) AS alias(...)`**
  - Issue: #99605（已关闭）
  - 链接: ClickHouse/ClickHouse Issue #99605
  - 评价：这是 SQL 兼容性的积极信号，说明社区对标准/主流数据库语法补齐诉求正在被逐步吸收。

- **修复测试不稳定：`03800_use_const_adaptive_granularity_vertical_merge`**
  - PR: #100641（已关闭）
  - 链接: ClickHouse/ClickHouse PR #100641
  - 评价：虽非用户功能，但 CI 稳定性提升会直接影响合并效率和回归识别质量。

---

## 3. 社区热点

### 3.1 Settings 对象过大，影响编译与运行时复杂度
- Issue: #58797  
- 链接: ClickHouse/ClickHouse Issue #58797

这是一个持续被讨论的内部架构问题。问题不只是“结构体太大”，而是会引发：
- 大函数与大栈帧
- 过多局部变量
- 匿名 lambda 符号膨胀
- 编译/调试/二进制体积成本上升

**背后技术诉求**：随着配置项不断增加，ClickHouse 的“设置系统”正在触碰可维护性边界。这个问题虽不直接面向终端用户，但会影响开发效率、编译资源和代码演化速度，属于典型的“技术债热点”。

---

### 3.2 GPU 支持再被讨论
- Issue: #63392  
- 链接: ClickHouse/ClickHouse Issue #63392

该议题再次活跃，说明社区仍在关注 GPU 对 OLAP 的价值，尤其是：
- 向量化计算
- AI/大模型背景下 GPU 资源更普及
- 与 Spark RAPIDS、cuDF 等生态对标

**背后技术诉求**：用户希望 ClickHouse 在未来不仅是 CPU 优化极致的列存引擎，也能在 GPU 加速的大数据场景中保持竞争力。不过从当前仓库实际 PR 动向看，**短期内仍偏探索/愿景级话题**，离可交付路线图尚远。

---

### 3.3 CI 崩溃与 fuzz/sanitizer 持续高频
- Issue: #99295  
- 链接: ClickHouse/ClickHouse Issue #99295

这类 crash-ci 问题评论活跃，说明主干 CI 仍有一定不稳定度。今天同时还能看到多条 fuzz/sanitizer 相关问题：
- #100761 MemorySanitizer use-of-uninitialized-value
- #100510 Ubsan crash in `positiveModulo`
- #100556 USearch heap-buffer-overflow
- #100175 / #100158 等逻辑错误

**背后技术诉求**：维护者正在积极使用模糊测试和 sanitizer 扫描深层缺陷，这对数据库项目是健康信号；但从数量看，也说明新路径和边界条件复杂度很高。

---

### 3.4 Projection / 索引能力希望支持 `ARRAY JOIN`
- Issue: #98953  
- 链接: ClickHouse/ClickHouse Issue #98953

该需求指向 Observability 类 schema 中常见的 Map/标签多值场景，希望投影索引能更好支持多对一映射与 exploded 结构。  
**背后技术诉求**：ClickHouse 在日志/指标/Trace 场景中越来越多承担检索与分析双重职责，单纯列存扫描已不足，用户希望投影、索引、ARRAY JOIN 之间形成更完整的优化闭环。

---

## 4. Bug 与稳定性

> 以下按严重程度排序，并标注是否看到潜在 fix PR。

### P0 / 高危正确性与崩溃风险

1. **Decimal 列在 `GROUP BY` 下执行 `MAX()/MIN()` 返回错误结果**
   - Issue: #100740  
   - 链接: ClickHouse/ClickHouse Issue #100740
   - 影响：**查询结果错误**，且涉及常见聚合函数，优先级很高。
   - 现状：未看到直接对应 fix PR。

2. **ReplicatedMergeTree Mutation 出现 `CHECKSUM_DOESNT_MATCH` 并陷入循环**
   - Issue: #100493  
   - 链接: ClickHouse/ClickHouse Issue #100493
   - 影响：复制表变更执行卡死/重复拉取 part，可能影响生产集群一致性与可用性。
   - 现状：未看到明确 fix PR。

3. **`extremes=1` 与 `AggregateFunctionStateData`（如 `argMaxState`）组合触发异常**
   - Issue: #100698  
   - 链接: ClickHouse/ClickHouse Issue #100698
   - 影响：聚合状态列在某些设置下不可用，属于功能组合正确性缺陷。
   - 现状：未见对应修复 PR。

4. **`accurateCastOrNull` 到 QBit 静默产生错误值**
   - Issue: #100697  
   - 链接: ClickHouse/ClickHouse Issue #100697
   - 影响：属于**silent wrong results**，危险性高于显式报错。
   - 现状：该问题指出是某修复引入的新错误，未见当天 fix PR。

---

### P1 / 高优先级功能回归与可用性问题

5. **26.2.3 与 26.2.4 在 `session_timezone` 下相同 `INSERT` 产生不同 `DateTime`**
   - Issue: #100614  
   - 链接: ClickHouse/ClickHouse Issue #100614
   - 影响：版本升级后时间语义变化，属于显著回归风险。
   - 现状：未见直接 fix PR。
   - 相关修复方向：PR #100535 修复 numeric 到 `DateTime64/Time64` cast 时忽略 overflow setting，虽非同一问题，但说明时间类型转换链路近期在集中修补。
   - PR: #100535  
   - 链接: ClickHouse/ClickHouse PR #100535

6. **Parquet v3 native reader 对 `IN (subquery)` 的 page-level filter pushdown 不生效**
   - Issue: #100743  
   - 链接: ClickHouse/ClickHouse Issue #100743
   - 影响：主要是性能正确性/优化未生效，数据湖读取成本上升。
   - 现状：未见 fix PR。

7. **Iceberg `ALTER UPDATE` 触发逻辑错误：`partitions_count > 0`**
   - Issue: #100565  
   - 链接: ClickHouse/ClickHouse Issue #100565
   - 影响：数据湖写路径/变更路径稳定性不足。
   - 现状：未见 fix PR。

8. **`EXECUTE AS` 触发分析阶段逻辑错误**
   - Issue: #100695  
   - 链接: ClickHouse/ClickHouse Issue #100695
   - 影响：权限/模拟身份相关功能的稳定性问题。
   - 现状：未见 fix PR。

9. **`INTERSECT ALL` + 空 tuple + Variant 触发 block structure mismatch**
   - Issue: #100691  
   - 链接: ClickHouse/ClickHouse Issue #100691
   - 影响：集合操作与实验类型组合存在边界缺陷。
   - 现状：未见 fix PR。

---

### P2 / 格式解析、函数边界与测试稳定性

10. **Npy 零内层维度下 `count()` 与 `SELECT *` 结果不一致**
    - Issue: #100738  
    - 链接: ClickHouse/ClickHouse Issue #100738
    - 影响：文件格式导入场景的计数正确性问题。
    - 现状：与 #99585 同属 Npy 边界问题，说明 Npy 解析器仍需系统性补强。

11. **`positiveModulo` 触发 Ubsan crash**
    - Issue: #100510  
    - 链接: ClickHouse/ClickHouse Issue #100510
    - 影响：函数边界值处理不足。
    - 现状：未见 fix PR。

12. **USearch 中 heap-buffer-overflow**
    - Issue: #100556  
    - 链接: ClickHouse/ClickHouse Issue #100556
    - 影响：向量检索/近似搜索依赖链的内存安全问题。
    - 现状：未见 fix PR。

13. **性能测试噪声过高，61 项测试不稳定**
    - Issue: #100759  
    - 链接: ClickHouse/ClickHouse Issue #100759
    - 影响：降低性能回归检测可信度，拖慢优化类 PR 的决策速度。

14. **Spark/Delta 相关测试超时**
    - Issue: #100708  
    - 链接: ClickHouse/ClickHouse Issue #100708
    - 对应修复 PR：#100765  
    - 链接: ClickHouse/ClickHouse PR #100765
    - 状态：**已有明确 fix PR**，响应较快。

15. **LowCardinality tuple key 在 `has()` / KeyCondition 中触发 crash**
    - PR: #100760  
    - 链接: ClickHouse/ClickHouse PR #100760
    - 评价：这是当天最关键的 crash 修复之一，且标注为 `pr-critical-bugfix`、`pr-must-backport`，说明维护者认定其影响面较大。

16. **垂直合并导致 nested default 数据损坏**
    - PR: #100330  
    - 链接: ClickHouse/ClickHouse PR #100330
    - 评价：同样标注 `pr-critical-bugfix` 与 `must-backport`，属于存储层正确性关键修复，应重点关注合并进展与回补版本。

17. **相关子查询嵌入 ALIAS 列表达式导致 server crash**
    - PR: #100753  
    - 链接: ClickHouse/ClickHouse PR #100753
    - 评价：查询分析器与默认表达式校验存在 AST 深度检查缺口，修复价值较高。

18. **统计估算器在函数过滤条件下 bad cast 异常**
    - PR: #100764  
    - 链接: ClickHouse/ClickHouse PR #100764
    - 评价：优化器/统计信息链路的稳定性改进。

---

## 5. 功能请求与路线图信号

### 更可能进入下一版本/近期版本的方向

1. **SQL 兼容性继续增强**
   - `UNIQUE(subquery)`：PR #99877  
   - `VALUES` 作为 FROM 中派生表：Issue #99605（已关闭）
   - NATURAL JOIN AST 重建修复：PR #100223  
   - 链接: ClickHouse/ClickHouse PR #99877 / PR #100223 / Issue #99605

   **判断**：这些都属于明显的 SQL 语义补齐，且已有实际开发动作，进入近期版本的概率高。

2. **JSON / 半结构化查询能力增强**
   - `JSONAllValues` + text index：PR #100730  
   - 链接: ClickHouse/ClickHouse PR #100730

   **判断**：符合日志分析和搜索融合趋势，具备较强产品化价值。

3. **查询计划与生态互操作**
   - AST JSON serialization：PR #100412  
   - EXPLAIN SUBSTRAIT：PR #94540  
   - 链接: ClickHouse/ClickHouse PR #100412 / PR #94540

   **判断**：这是平台化和生态化信号，可能先以实验/工具能力形式落地。

4. **数据湖可观测性与集成完善**
   - Iceberg `read_rows` 修复：PR #99282  
   - DataLakeCatalog `used_table_functions`：PR #100706  
   - 链接: ClickHouse/ClickHouse PR #99282 / PR #100706

   **判断**：说明 ClickHouse 正持续强化 Iceberg/DeltaLake 作为一等场景的可用性。

### 中长期路线图信号

5. **Projection Index 支持 `ARRAY JOIN`**
   - Issue: #98953  
   - 链接: ClickHouse/ClickHouse Issue #98953  
   **判断**：需求真实，尤其面向 Observability，但实现复杂，短期落地概率中等。

6. **`obfuscateQuery` SQL 函数**
   - Issue: #98010  
   - 链接: ClickHouse/ClickHouse Issue #98010  
   **判断**：是“小而实用”的易任务，较有机会被快速纳入。

7. **GPU 支持**
   - Issue: #63392  
   - 链接: ClickHouse/ClickHouse Issue #63392  
   **判断**：战略讨论价值高，但短期不太像即将落地的主线。

---

## 6. 用户反馈摘要

结合今日 Issues，可提炼出几类真实用户痛点：

### 6.1 用户最关心的是“正确性优先”
- `MAX/MIN on Decimal` 错误结果、`accurateCastOrNull` 静默错误值、`DateTime` 插入语义变化等问题表明：
  - 用户不仅在做 benchmark，更在跑真实财务、计费、时序、风控类业务；
  - 一旦出现 silent wrong results，接受度会明显下降。

相关链接：
- ClickHouse/ClickHouse Issue #100740
- ClickHouse/ClickHouse Issue #100697
- ClickHouse/ClickHouse Issue #100614

### 6.2 数据湖用户要求“可观测、可诊断、可优化”
- Iceberg/Parquet 用户反馈集中在：
  - `query_log` 指标缺失或失真
  - filter pushdown 不生效
  - 变更语义不稳定

这说明 ClickHouse 已经不仅被当作“内部表分析引擎”，也被当作**统一湖仓查询层**使用。

相关链接：
- ClickHouse/ClickHouse PR #99282
- ClickHouse/ClickHouse PR #100706
- ClickHouse/ClickHouse Issue #100743
- ClickHouse/ClickHouse Issue #100565

### 6.3 复杂 SQL/分析器路径仍在被高强度验证
- 相关子查询、集合操作、row policy、`EXECUTE AS`、NATURAL JOIN、LowCardinality tuple key 等问题频繁出现，
说明用户查询形态越来越复杂，Analyzer/Planner 逐步进入“边界密集暴露期”。

相关链接：
- ClickHouse/ClickHouse PR #100753
- ClickHouse/ClickHouse Issue #100691
- ClickHouse/ClickHouse Issue #100695
- ClickHouse/ClickHouse PR #100223
- ClickHouse/ClickHouse PR #100760

### 6.4 社区对易用性和兼容性仍有明确诉求
- `VALUES`、`UNIQUE`、`obfuscateQuery`、Projection + ARRAY JOIN，都是用户希望减少迁移成本、提升调试效率、增强复杂模型支持的体现。

相关链接：
- ClickHouse/ClickHouse Issue #99605
- ClickHouse/ClickHouse PR #99877
- ClickHouse/ClickHouse Issue #98010
- ClickHouse/ClickHouse Issue #98953

---

## 7. 待处理积压

以下是值得维护者继续关注的长期或反复活跃问题：

1. **Settings 对象过大**
   - Issue: #58797  
   - 链接: ClickHouse/ClickHouse Issue #58797
   - 原因：属核心技术债，长期不处理会持续放大维护成本。

2. **GPU support**
   - Issue: #63392  
   - 链接: ClickHouse/ClickHouse Issue #63392
   - 原因：虽然短期未必实现，但作为社区战略方向值得给出更明确的路线图态度。

3. **Projection Index 中支持 `ARRAY JOIN`**
   - Issue: #98953  
   - 链接: ClickHouse/ClickHouse Issue #98953
   - 原因：与可观测性/日志分析场景直接相关，具备用户价值。

4. **多表 JOIN + `join_use_nulls` 下类型解析错误**
   - Issue: #75005  
   - 链接: ClickHouse/ClickHouse Issue #75005
   - 原因：JOIN 与 analyzer 相关问题往往影响面广，且排查成本高。

5. **CI crash / fuzz / sanitizer 噪声累积**
   - Issue: #99295, #100759 等  
   - 链接: ClickHouse/ClickHouse Issue #99295 / Issue #100759
   - 原因：这类问题虽不总是用户可见，但会直接影响研发吞吐和回归治理。

---

## 8. 结论

今天的 ClickHouse 呈现出典型的**高速演进型开源数据库**特征：  
一方面，SQL 标准兼容、JSON/文本索引、Substrait、AST 序列化、对象存储缓存路径优化等工作表明项目在持续扩大能力边界；另一方面，复杂查询分析、数据湖读取、复制一致性、类型系统与格式解析中的边界缺陷仍然密集暴露。  

如果从项目健康度来看，**开发活跃度极高、修复响应速度较快、路线图信号清晰**；但如果从生产稳定性来看，建议用户尤其关注：
- 26.x 版本中的时间类型与 Decimal 聚合正确性，
- ReplicatedMergeTree mutation 一致性，
- Iceberg/Parquet 查询优化是否真正生效，
- 以及涉及 analyzer/复杂类型的边界 SQL。

如需，我还可以继续把这份日报整理成：
1. **面向管理层的 1 页简版**，或  
2. **面向数据库内核团队的风险清单版**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-26

## 1. 今日速览

过去 24 小时 DuckDB 保持高活跃：Issues 更新 30 条、PR 更新 52 条，但**无新版本发布**。  
从内容看，当前工作重心明显集中在 **v1.5.x 回归修复、CLI/Windows 兼容性、窗口函数优化正确性、外部文件/对象存储访问稳定性**。  
项目健康度整体仍然较好：一方面有 7 个 Issue 关闭、28 个 PR 合并/关闭，说明维护节奏稳定；另一方面，今日新增/活跃问题中出现了多起 **崩溃、错误结果、并行回退**，表明 1.5 系列新优化和跨平台改动仍在快速打磨。  
整体判断：**活跃度高，修复响应快，但稳定性压力集中在新优化路径和边缘平台场景**。

---

## 3. 项目进展

### 已关闭 / 合并的关键修复

#### 1) Windows CLI 终端渲染问题已有修复落地
- PR: **#21615 [CLOSED] Windows shell: enable VT100 processing on startup**  
  链接: duckdb/duckdb PR #21615

该 PR 已关闭，说明与 Windows 终端显示异常有关的处理已推进。它直接对应近期多个 Windows CLI 乱码/提示符异常问题，属于 **客户端可用性修复**。  
这类修复虽然不触及查询引擎本身，但对 DuckDB CLI 的生产可用性影响很大，尤其是 Windows 11、管理员模式、CMD/PowerShell 环境。

相关 Issue：
- **#21571** DuckDB CLI: Windows 11 Command Prompt & PowerShell in Admin Mode Show Random Characters  
  链接: duckdb/duckdb Issue #21571
- **#21585** Duckdb 1.5.0 CLI does not prompt correctly on Windows 11  
  链接: duckdb/duckdb Issue #21585

#### 2) 外部 Catalog 下外键引用解析修复
- PR: **#21607 [CLOSED] Fix FK reference resolution for external catalogs**  
  链接: duckdb/duckdb PR #21607

该修复解决了在外部 catalog 中创建带 `FOREIGN KEY` 的表时，绑定器错误使用默认 catalog 搜索路径的问题。  
这代表 DuckDB 在 **多 catalog / 外部元数据集成 / 湖仓场景** 下的 SQL 语义一致性继续增强，对 embedding 场景和外部系统集成是积极信号。

#### 3) PEG Parser 严格模式 CI 启用
- PR: **#21590 [CLOSED] Make PEG Parser use strict mode in CI**  
  链接: duckdb/duckdb PR #21590

该 PR 将 PEG Parser 的 CI 测试切换到更严格模式，并暴露出约 40 个失败用例。  
这说明项目在 **SQL 解析器一致性与未来 parser 路线** 上持续投入，短期看会提高测试噪声和修复成本，长期有利于 SQL 兼容性和解析稳定性。

#### 4) `checkpoint_on_detach` 三态配置推进
- PR: **#21570 [CLOSED] checkpoint_on_detach 3-valued setting**  
  链接: duckdb/duckdb PR #21570

该改动为 `DETACH` 时是否执行 checkpoint 提供更细粒度控制。  
这属于 **存储引擎与生命周期管理** 方向的小而实用增强，利于嵌入式场景中平衡耐久性与性能。

#### 5) 自动补全基础抽象重构完成
- PR: **#21621 [CLOSED] [autocomplete] Use AutoCompleteCatalogProvider abstraction**  
  链接: duckdb/duckdb PR #21621

虽偏 CLI/工具链层，但该抽象为无 `ClientContext` 的补全提供了扩展基础，意味着 CLI 正在朝 **更模块化、更易扩展** 的方向演进。

---

## 4. 社区热点

### 热点 1：S3 / 对象存储 `read_parquet()` ETag 误报
- Issue: **#21401 [OPEN] Changed ETag Error but actually the ETag is the same when using read_parquet()**  
  链接: duckdb/duckdb Issue #21401

这是今日评论最多的活跃 Issue 之一（10 条评论）。问题出现在 DuckDB 使用 S3 wildcard/pattern 读取 Parquet 时，因 ETag 比较时引号差异导致误判“文件已变更”。  
背后技术诉求是：**对象存储兼容层的健壮性**。DuckDB 正越来越多被用于 MinIO、S3-compatible storage、数据湖读取场景，这类“元数据格式细节差异”会直接影响可用性。

### 热点 2：`date_part` 统计传播上界 off-by-one
- Issue: **#21478 [CLOSED] Off-by-one error in PropagateStatistics for date_part**  
  链接: duckdb/duckdb Issue #21478

该问题已关闭，但讨论价值高。它指出 `date_part` 多个时间字段统计上界被设置得偏大，导致优化器无法正确剪枝。  
诉求本质是：**优化器统计信息必须精确**，哪怕只是 +1 的误差，也会影响谓词裁剪和执行计划质量。对 OLAP 引擎而言，这是典型“不会报错但会慢”的高价值修复点。

### 热点 3：CLI `.tables` / `-table` 输出异常
- Issue: **#21378 [CLOSED] duckdb cli 1.5.x ".tables" probably with sqlite and "-table" output issues**  
  链接: duckdb/duckdb Issue #21378

该 Issue 已关闭，涉及 `.tables` 内部错误以及 `-table` 输出重复字段。  
说明 1.5.x 在 CLI 呈现层有一波较集中的回归，社区对 **命令行易用性与兼容 SQLite 式交互习惯** 的要求很高。

### 热点 4：窗口优化导致错误结果
- Issue: **#21592 [OPEN] WindowSelfJoinOptimizer produces wrong results for ROWS frames**  
  链接: duckdb/duckdb Issue #21592
- PR: **#21628 [OPEN] Issue #21592: Window Self-Join Framing**  
  链接: duckdb/duckdb PR #21628

这是今天最值得关注的正确性热点之一。新引入的 `WindowSelfJoinOptimizer` 对显式 `ROWS` frame 进行了不安全替换，导致错误结果。  
该问题体现了 DuckDB 在持续激进优化窗口函数执行，但也说明：**语义等价性验证仍是优化器演进的核心风险点**。好消息是已经有定向修复 PR 提交，响应迅速。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 正确性与崩溃风险最高

#### 1) 窗口优化产生错误结果
- Issue: **#21592 [OPEN] WindowSelfJoinOptimizer produces wrong results for ROWS frames**  
  链接: duckdb/duckdb Issue #21592
- Fix PR: **#21628 [OPEN]**  
  链接: duckdb/duckdb PR #21628

影响 SQL 正确性，属于高优先级。问题源于优化器对窗口表达式 frame 语义检查不足。  
这是典型 **“新优化引入错误结果”** 类问题，应优先进入补丁版本。

#### 2) `LEFT JOIN LATERAL ... ON TRUE` 在外层 `IS NOT NULL` 过滤下仍保留错误行
- Issue: **#21609 [OPEN] DuckDB incorrectly preserves rows from LEFT JOIN LATERAL ... ON TRUE even when an outer WHERE l.col IS NOT NULL filter should remove them**  
  链接: duckdb/duckdb Issue #21609

该问题同样属于 **错误结果**，且涉及 lateral join 语义。虽然评论还少，但从严重性看非常值得关注。  
目前未见对应 fix PR。

#### 3) `CHECKPOINT` 在固定长 ARRAY 列上崩溃并使数据库失效
- Issue: **#21601 [OPEN] CHECKPOINT crashes with Invalid bitpacking mode on fixed-size ARRAY columns (FLOAT[256])**  
  链接: duckdb/duckdb Issue #21601

这是今日最危险的存储层问题之一：`CHECKPOINT` 过程中 FATAL crash，数据库随后失效，需要恢复。  
涉及 **存储压缩/位打包/VacuumTask 路径**，如果复现稳定，应视为 P0/P1 问题。当前仍需更完整复现样例。

#### 4) Release 构建特有段错误
- Issue: **#21623 [OPEN] Segmentation fault in GetSortKeyLengthRecursive only in release build**  
  链接: duckdb/duckdb Issue #21623
- Fix PR: **#21629 [OPEN] Fix #21623: flatten input chunk in TopNHeap::CheckBoundaryValues**  
  链接: duckdb/duckdb PR #21629

仅在 release/reldebug 构建触发，说明是 **向量扁平化/嵌套类型处理** 路径的未覆盖 bug。  
已有修复 PR，响应很快。

### P1 / 影响稳定性或存在回归

#### 5) `PhysicalTableInOutFunction` 并行回退
- Issue: **#21617 [OPEN] `PhysicalTableInOutFunction` pipeline parallelism regression in v1.5.1**  
  链接: duckdb/duckdb Issue #21617

v1.5.1 中某类 `in_out_function` 表函数从并行退化为单线程，而 1.4.4 正常。  
这不是错误结果，但属于明显 **性能回归**，尤其影响 CPU 密集型 UDTF / 扩展场景。

#### 6) ADBC prepared statements / error 路径 heap-use-after-free
- Issue: **#21626 [OPEN] adbc: heap-use-after-free with prepared statements**  
  链接: duckdb/duckdb Issue #21626
- Issue: **#21584 [OPEN] adbc: heap-use-after-free on error**  
  链接: duckdb/duckdb Issue #21584

两个问题都指向 ADBC C++ 实现中的生命周期管理错误，严重时可导致 segfault。  
说明 **Arrow/ADBC 生态接入层** 仍有内存安全边角问题。

#### 7) 复杂 CTE 链绑定失败 / 内部错误
- Issue: **#21604 [OPEN] INTERNAL Error: Failed to bind column reference (inequal types INTEGER != VARCHAR) in complex CTE chain**  
  链接: duckdb/duckdb Issue #21604
- Issue: **#21582 [OPEN] INTERNAL Error: Could not find CTE definition for CTE reference**  
  链接: duckdb/duckdb Issue #21582

两条都属于 binder/CTE 处理问题，且至少一条已明确是 **v1.5.1 回归**。  
说明查询改写、宏、CTE、多层 binding 的组合路径仍需回归测试加强。

#### 8) `LOAD motherduck` 在 Windows PyInstaller 打包场景崩溃
- Issue: **#21602 [OPEN] LOAD motherduck causes access violation on Windows in PyInstaller bundle (DuckDB 1.5.x)**  
  链接: duckdb/duckdb Issue #21602

属于扩展加载兼容性问题，影响嵌入式 Windows 应用分发场景。  
体现 DuckDB 扩展机制在“冻结包 + 动态加载”组合下还有平台差异。

### P2 / 兼容性与可用性问题

#### 9) `opfs://` 路径被错误 Canonicalize
- Issue: **#21603 [OPEN] FileSystem::CanonicalizePath breaks opfs:// fake paths used by duckdb-wasm**  
  链接: duckdb/duckdb Issue #21603

影响 duckdb-wasm 在浏览器 OPFS 场景下的路径处理，属于 **WebAssembly 平台兼容性** 问题。

#### 10) `read_parquet()` 对 S3-compatible 存储 ETag 误判
- Issue: **#21401 [OPEN]**  
  链接: duckdb/duckdb Issue #21401

高频但偏兼容性问题，影响对象存储场景稳定性。

#### 11) `UNNEST(..., recursive:=true)` 未完全展开固定嵌套数组
- Issue: **#21506 [OPEN]**  
  链接: duckdb/duckdb Issue #21506

影响嵌套类型 SQL 语义完整性，但范围相对可控。

#### 12) geometry 类型 `IS NULL` 不工作
- Issue: **#21630 [OPEN] IS NULL on geometry does not work**  
  链接: duckdb/duckdb Issue #21630

属于 spatial 类型语义兼容性缺陷，刚被提出，尚待分诊。

#### 13) HTTPFS 调 OpenAI API 失败
- Issue: **#21583 [OPEN] HTTPFS - OpenAI API Request Fails (HTTP 0 Internal Server Error)**  
  链接: duckdb/duckdb Issue #21583

说明 `httpfs` 正被用户用于更通用 API 访问而非单纯文件下载，这可能推动其请求能力和错误处理进一步增强。

---

## 6. 功能请求与路线图信号

### 1) 大小写不敏感正则操作符支持
- Issue: **#16829 [OPEN] Support for case-insensitive regular expression operators**  
  链接: duckdb/duckdb Issue #16829

用户希望支持 PostgreSQL 风格 `~*` / `!~*`。  
这是明显的 **SQL 方言兼容性需求**。Issue 被标记为 “Needs Documentation”，说明团队可能先倾向澄清现有 regex 能力，而不是立即扩展操作符。

### 2) 扩展开发构建的发布节奏
- Issue: **#21622 [OPEN] Release cycle of extensions for development builds**  
  链接: duckdb/duckdb Issue #21622

这是一个很有路线图意味的信号：用户希望 dev build 与扩展二进制的发布更同步，以便提前验证。  
这表明 DuckDB 的使用方式正越来越依赖 **核心引擎 + 扩展生态** 联动，未来版本管理和 nightly 兼容矩阵可能会被更多关注。

### 3) CLI 可扩展 dot commands
- PR: **#21197 [OPEN] Allow extensibility of dot commands to the DuckDB CLI**  
  链接: duckdb/duckdb PR #21197

虽然不是当天新开，但与近期 CLI 模块化 PR（#21621、#21624、#21339）形成明显串联。  
这是一个重要信号：DuckDB CLI 正在朝 **可扩展 shell 平台** 演进，而不只是简单 SQL 终端。

### 4) Trigger 元数据与 introspection
- PR: **#21438 [OPEN] Add catalog storage and introspection for CREATE TRIGGER**  
  链接: duckdb/duckdb PR #21438

这代表 DuckDB 在向更完整的数据库对象模型推进。  
若继续落地，将增强 **DDL 能力、catalog introspection、与传统关系数据库特性的对齐**。

### 5) 外部文件缓存块对齐读与缓存
- PR: **#21395 [OPEN] Implement block-aligned read and cache for external file cache**  
  链接: duckdb/duckdb PR #21395

这是偏底层但非常关键的存储/IO 优化提案。若进入后续版本，将改善远程文件读取、缓存效率、对象存储访问性能。  
从摘要看是一个较大的设计级改动，更可能在未来次版本而非紧急补丁中推进。

### 6) Parquet MAP 列 row group skipping
- PR: **#21375 [OPEN] Add row group skipping support for MAP columns in Parquet reader**  
  链接: duckdb/duckdb PR #21375

这是典型 **分析引擎性能增强**：让 Parquet reader 在 MAP 类型参与时仍能保留更好的跳读能力。  
若合入，将直接提升半结构化数据分析体验。

---

## 7. 用户反馈摘要

### 1) DuckDB 已深入对象存储 / 湖仓工作流
- 代表问题：**#21401**, **#21395**, **#21375**  
用户不再只把 DuckDB 当本地嵌入式数据库，而是直接对接 S3-compatible 存储、远程 Parquet、外部缓存。  
真实痛点是：**元数据兼容性、远程 IO 稳定性、缓存命中与剪枝效果**。

### 2) 1.5.x 新优化带来性能机会，也引入正确性焦虑
- 代表问题：**#21592**, **#21431**, **#21617**  
用户关注窗口函数、TopN、pipeline parallelism 等高级执行优化，但也快速暴露了 OOM、错误结果、单线程退化。  
这说明核心用户群体已经在 **高复杂度分析查询、生产级负载** 上压测新版本。

### 3) Windows CLI 用户体验是当前显性痛点
- 代表问题：**#21571**, **#21585**, **#21378**  
大量反馈集中在提示符异常、乱码、表格输出不正常。  
这类问题虽不影响内核计算，但会显著影响新用户第一印象和日常交互效率。

### 4) 生态接口用户对稳定性要求提高
- 代表问题：**#21626**, **#21584**, **#21602**, **#21603**  
ADBC、PyInstaller、duckdb-wasm、motherduck 扩展等场景问题增多，反映 DuckDB 的部署方式越来越多样。  
用户期待的不只是 SQL 能跑通，而是 **跨语言、跨打包方式、跨平台的一致行为**。

### 5) 用户越来越依赖复杂 SQL 组合能力
- 代表问题：**#21604**, **#21582**, **#21609**, **#21506**  
复杂 CTE、宏、LATERAL、窗口函数、嵌套数组等功能被真实使用。  
这意味着 DuckDB 已进入“深水区”使用阶段，任何 binder/optimizer 边界错误都更容易在真实业务中出现。

---

## 8. 待处理积压

以下是值得维护者关注的长期未决事项：

### 1) UINT128 缺少十六进制转换
- Issue: **#16679 [OPEN] No Hex to UINT128 conversion**  
  链接: duckdb/duckdb Issue #16679

创建于 2025-03-16，至今仍开着。  
该问题虽不属高优先级崩溃，但在类型系统一致性上比较突兀：较小位宽 UINT 支持，UINT128 却缺失。

### 2) `struct.* glob / like / similar to` 行为异常
- Issue: **#16787 [OPEN] `struct.* glob / like / similar to` broken**  
  链接: duckdb/duckdb Issue #16787

创建于 2025-03-22，并带有 stale 标记。  
这是结构化列展开与 star-like 模式匹配交互上的语义缺陷，和当前活跃 PR **#19270** 直接相关：

- PR: **#19270 [OPEN] Fix nested `COLUMNS` expressions with star-like patterns**  
  链接: duckdb/duckdb PR #19270

建议维护者将这两者合并评估，避免修一处漏一处。

### 3) 大小写不敏感正则操作符支持
- Issue: **#16829 [OPEN] Support for case-insensitive regular expression operators**  
  链接: duckdb/duckdb Issue #16829

创建于 2025-03-25，仍处于开放状态。  
若 DuckDB 继续加强 PostgreSQL 兼容性，这类低风险语法增强值得排期。

### 4) 索引清理竞态问题修复 PR 停滞
- PR: **#21005 [OPEN] Do not cleanup indexes if table is dropped**  
  链接: duckdb/duckdb PR #21005

该 PR 处理的是事务并发下已删除索引仍被清理导致 assertion 的问题，技术重要性较高，但目前 stale。  
建议关注其是否可拆小、补测试后尽快推进。

### 5) 外部文件缓存重构 PR 存在冲突
- PR: **#21395 [OPEN] Implement block-aligned read and cache for external file cache**  
  链接: duckdb/duckdb PR #21395

这是潜在高收益 IO 优化，但当前有 merge conflict。  
如果 DuckDB 继续加码远程文件读取场景，该 PR 值得优先恢复。

---

## 附：今日值得重点跟踪的链接清单

- 错误结果修复：**#21592 / #21628**  
  duckdb/duckdb Issue #21592  
  duckdb/duckdb PR #21628

- 存储层崩溃：**#21601**  
  duckdb/duckdb Issue #21601

- Release-only 段错误修复：**#21623 / #21629**  
  duckdb/duckdb Issue #21623  
  duckdb/duckdb PR #21629

- Windows CLI 兼容性：**#21571 / #21585 / #21615**  
  duckdb/duckdb Issue #21571  
  duckdb/duckdb Issue #21585  
  duckdb/duckdb PR #21615

- 对象存储兼容性：**#21401**  
  duckdb/duckdb Issue #21401

- 性能回归：**#21617**  
  duckdb/duckdb Issue #21617

---

总体看，DuckDB 今日呈现出典型的 **高迭代期开源数据库项目画像**：功能面持续扩展，优化器与平台适配同步推进，社区反馈密集且修复响应快。短期建议维护重点放在 **1.5.x 正确性回归、Windows CLI 可用性、远程对象存储兼容、ADBC/扩展生态稳定性** 四个方向。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 · 2026-03-26

## 1. 今日速览

过去 24 小时，StarRocks 维持了较高活跃度：Issues 更新 9 条、PR 更新 120 条，并发布了 1 个新版本，说明项目仍处于高频修复与多分支维护状态。  
从 PR 结构看，今日工作重心明显偏向 **Bug 修复、回移(backport) 和发布工程**，尤其集中在 SQL 语义一致性、外部表/文件导入、连接稳定性和存储层边界场景。  
Issues 侧则暴露出几个值得关注的方向：**Iceberg/Paimon 外部目录稳定性、Azure Data Lake 文件读取崩溃、以及依赖组件 CVE 风险**。  
整体判断：项目健康度良好，版本节奏稳定，但外部湖仓连接器与大规模元数据场景仍是当前风险集中区。

---

## 2. 版本发布

## 新版本：4.0.8
- 版本：**4.0.8**
- 发布时间：**2026-03-25**
- 链接：Release 4.0.8

### 主要更新
本次发布中已明确披露的更新为一项 **行为变更（Behavior Changes）**：

- 改进 `sql_mode` 处理逻辑：当启用 `DIVISION_BY_ZERO` 或 `FAIL_PARSE_DATE` 模式时：
  - 除零错误将不再被静默忽略，而是直接返回错误；
  - `str_to_date` / `str2date` 的日期解析失败也将直接报错。  
  - 相关 PR：[#70004](https://github.com/StarRocks/StarRocks/pull/70004)

### 影响评估
这不是“接口删除”类破坏性变更，但属于 **SQL 行为收紧**，对线上作业兼容性有实际影响，尤其是：
- 依赖宽松容错逻辑的 ETL / 导入任务；
- 使用 `str_to_date` 解析脏数据的报表 SQL；
- 未显式清洗除数为 0 场景的数据处理流程。

### 迁移注意事项
建议升级到 4.0.8 的用户重点做以下检查：

1. **检查 `sql_mode` 配置**
   - 若环境开启了 `DIVISION_BY_ZERO` 或 `FAIL_PARSE_DATE`，需重新验证历史 SQL 的行为。
2. **回归测试数据导入链路**
   - 特别是 CSV / FILES() / 外表导入中，字段脏值可能从“被忽略”变成“报错中断”。
3. **审查日期解析与计算逻辑**
   - 对 `str_to_date`、`str2date`、除法表达式增加预清洗或保护条件。
4. **多版本混用场景注意行为差异**
   - 若 3.5/4.0/4.1 分支并行运行，需注意相同 SQL 在不同分支上的执行结果一致性。

---

## 3. 项目进展

以下为今日已合并/关闭、且具有代表性的 PR 进展，重点反映查询引擎、SQL 兼容性和稳定性推进。

### 3.1 修复 `INSERT INTO ... BY NAME from FILES()` 的 schema push-down 问题
- 主 PR：[#70774](https://github.com/StarRocks/StarRocks/pull/70774) 已关闭/合并
- 回移：
  - [#70799](https://github.com/StarRocks/StarRocks/pull/70799) `version:4.1.0`
  - [#70800](https://github.com/StarRocks/StarRocks/pull/70800) `version:3.5.16`
  - [#70801](https://github.com/StarRocks/StarRocks/pull/70801) `version:4.0.9`

### 技术意义
该修复针对 `INSERT INTO ... BY NAME` 且源为 `FILES()` 时，**目标列与选择列数量不完全一致**的场景。此前 `InsertAnalyzer` 过早返回，导致后续分析与类型处理被跳过。  
这类问题直接影响：
- 文件导入的列投影能力；
- 半结构化/外部文件接入的易用性；
- 导入语义与用户预期的一致性。

这是一项非常典型的 **SQL 兼容性 + 导入正确性** 修复，且已完成多分支回移，说明维护者认为其对生产用户影响较大。

---

### 3.2 follower FE 上 `USE database` 一致性问题修复完成回移处理
- PR：[#69917](https://github.com/StarRocks/StarRocks/pull/69917) 已关闭  
  （backport of journal replay wait fix）

### 技术意义
在多 FE 部署下，`CREATE DATABASE` 刚执行完，若请求打到 follower FE，`USE database` / `COM_INIT_DB` 可能报 `Unknown database`。  
这反映的是 **元数据日志重放时序与前端节点一致性** 问题，属于控制面可用性缺陷。  
虽然今天看到的是回移 PR 关闭，但其传播到稳定分支意味着：
- K8s 多 FE 场景的可用性在持续改善；
- 元数据可见性延迟带来的“偶现失败”正在被系统性治理。

---

### 3.3 CTE 复制器相关修复完成一个回移关闭
- PR：[#70791](https://github.com/StarRocks/StarRocks/pull/70791) 已关闭  
  内容：在 CTE producer 未被复制时，保留 consumer 引用

### 技术意义
这是优化器内部 `OptExpressionDuplicator` 的修复，说明团队仍在持续处理复杂查询计划变换中的边界一致性问题。  
这类修复通常对应：
- 复杂 CTE 查询；
- 计划重写后引用失配；
- 优化器在特定 hint / rewrite 场景中的稳定性。

虽然单条 PR 描述较底层，但对 **复杂 SQL 的执行可靠性** 有现实价值。

---

### 3.4 brpc 连接重试健壮性修复正在多分支推进
- 开放中的回移 PR：
  - [#70531](https://github.com/StarRocks/StarRocks/pull/70531)
  - [#70530](https://github.com/StarRocks/StarRocks/pull/70530)
- 冲突关闭版本：
  - [#70529](https://github.com/StarRocks/StarRocks/pull/70529)

### 技术意义
该修复处理 `ChannelPool.getChannel()` 将 `NoSuchElementException` 包装进 `RuntimeException` 后，重试逻辑未能识别的问题。  
这属于 **网络抖动 / 连接池瞬时失败** 下的健壮性优化，尤其适合：
- 高并发 BE/FE 通信；
- 云网络偶发丢包；
- 短时 TCP 握手异常场景。

这不是“新功能”，但对稳定性收益非常直接。

---

## 4. 社区热点

## 4.1 StarRocks Roadmap 2026
- Issue：[#67632](https://github.com/StarRocks/StarRocks/issues/67632)
- 状态：OPEN
- 评论：28
- 👍：28

这是今日最具代表性的社区热点。路线图帖持续活跃，表明社区对 2026 年 StarRocks 的核心方向高度关注。  
背后的技术诉求通常集中在：
- 湖仓互操作（Iceberg / Paimon / Hive）；
- SQL 兼容性增强；
- 查询优化器稳定性；
- 云原生部署与多租户能力；
- 导入、元数据与大规模分区场景下的成本控制。

路线图讨论持续升温，通常意味着后续数周会看到更多“预告型 PR”和能力补齐。

---

## 4.2 Iceberg 百万分区导致 FE OOM
- Issue：[#67760](https://github.com/StarRocks/StarRocks/issues/67760)
- 状态：OPEN
- 评论：7

该问题指出 FE 在处理 **拥有数百万分区的 Iceberg 表** 时，`partitionCache` 存在“急切加载所有分区”的行为，导致 FE OOM。  
这是一个很强的信号：StarRocks 在湖仓场景中已被用于超大规模元数据工作负载，但 FE 元数据缓存策略尚未完全适应这一规模。  
技术诉求清晰：
- 惰性加载；
- 分区裁剪前置；
- 元数据缓存上限控制；
- 外部 catalog 的内存隔离与可观测性。

---

## 4.3 大小写敏感配置需求被关闭
- Issue：[#40292](https://github.com/StarRocks/StarRocks/issues/40292)
- 状态：CLOSED
- 评论：8

该需求希望支持对象名大小写敏感配置。问题本身较老，但今天被关闭，说明维护团队当前可能未优先推动该兼容性方向。  
背后反映的是迁移型用户诉求：
- 与其他数据库对象命名规则保持一致；
- 兼容已有应用和数据治理规范；
- 降低异构数据库迁移的行为差异。

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P0 / 查询正确性风险：Iceberg metadata cache 可能返回永久陈旧的部分数据
- Issue：[#70522](https://github.com/StarRocks/StarRocks/issues/70522)
- 状态：CLOSED

这是今天最值得重视的已关闭问题之一。问题描述为：`Iceberg dataFileCache` 可能持续返回陈旧的部分数据，从而导致 **静默错误结果**。  
这类问题严重性高于普通 crash，因为它会在用户不知情的情况下输出错误查询结果。  
从状态看该问题已关闭，意味着已有修复或已被纳入处理流程；但日报数据中未直接给出对应 fix PR，建议维护者在后续 changelog 中明确关联修复提交，方便用户追溯。

---

### P1 / 可用性风险：Azure Data Lake 上读取 parquet 触发 Segmentation Fault
- Issue：[#70478](https://github.com/StarRocks/StarRocks/issues/70478)
- 状态：CLOSED
- 链接：[#70478](https://github.com/StarRocks/StarRocks/issues/70478)

`SELECT * FROM FILES(...)` 读取 Azure ADLS parquet 时发生段错误，属于 **外部文件访问路径中的崩溃级问题**。  
由于问题已关闭，初步判断已修复或归并处理，但当前列表未显示对应 fix PR。  
建议使用 Azure Data Lake 的用户关注后续 release notes，确认具体受影响版本与修复分支。

---

### P1 / 崩溃风险：大 VARCHAR 复制时 `UnionConstSourceOperator` SIGSEGV
- Issue：[#68656](https://github.com/StarRocks/StarRocks/issues/68656)
- 状态：CLOSED
- 链接：[#68656](https://github.com/StarRocks/StarRocks/issues/68656)

该问题说明在大 VARCHAR 列复制场景下存在执行层内存/对象处理边界问题。  
对于宽列、高基数字符串、随机分布表等场景，这类崩溃会影响：
- 导入/复制稳定性；
- 宽表查询；
- 极值数据场景的鲁棒性。

---

### P1 / 控制面稳定性：Paimon catalog refresh 触发 ClassCastException
- Issue：[#70719](https://github.com/StarRocks/StarRocks/issues/70719)
- 状态：OPEN
- 链接：[#70719](https://github.com/StarRocks/StarRocks/issues/70719)

问题出现在 `ConnectorTableMetadataProcessor` 刷新 Paimon catalog 时，将 `FormatTableImpl` 强转为 `FileStoreTable`。  
这是典型的 **外部连接器类型系统/版本兼容** 问题，影响：
- Paimon 元数据刷新；
- 外部 catalog 可用性；
- 混合格式或新版本接口适配。

目前未看到日报数据中有直接 fix PR，建议高度关注。

---

### P1 / 资源风险：Iceberg 百万分区导致 FE OOM
- Issue：[#67760](https://github.com/StarRocks/StarRocks/issues/67760)
- 状态：OPEN
- 链接：[#67760](https://github.com/StarRocks/StarRocks/issues/67760)

在 40GB Pod、24GB JVM 内存条件下 FE 仍出现 OOM，说明该问题不仅是极端边界，而是已影响真实生产环境。  
目前未见直接修复 PR。

---

### P2 / 安全依赖风险：jackson-core 漏洞
- Issue：[#70775](https://github.com/StarRocks/StarRocks/issues/70775)
- 状态：OPEN
- 链接：[#70775](https://github.com/StarRocks/StarRocks/issues/70775)

报告指出当前使用 `jackson-core 2.18.1`，建议升级到修复版本。  
这是典型供应链安全问题，短期不会影响功能，但会影响：
- 企业合规扫描；
- 镜像发布合规；
- 安全部门准入。

---

### P2 / 安全依赖风险：ZooKeeper 漏洞
- Issue：[#70777](https://github.com/StarRocks/StarRocks/issues/70777)
- 状态：OPEN
- 链接：[#70777](https://github.com/StarRocks/StarRocks/issues/70777)

当前使用 `zookeeper 3.8.4`，上游已给出修复版本。  
若 StarRocks 后续快速提交依赖升级 PR，说明安全治理链路较顺畅；否则可能在企业用户升级评审中形成阻碍。

---

## 6. 功能请求与路线图信号

## 6.1 CTE 支持 `MATERIALIZED / NOT MATERIALIZED` hints
- PR：[#70802](https://github.com/StarRocks/StarRocks/pull/70802)
- 状态：OPEN

这是今天最强的 SQL 功能信号之一。该特性可让用户显式控制 CTE：
- 是否物化；
- 是否内联；
- 是否避免复杂 SQL 膨胀。

这不仅是语法兼容增强，也体现出 StarRocks 正在向更可控的 **优化器用户接口** 演进。若顺利合并，很可能进入下一小版本或 4.1 系列。

---

## 6.2 支持 Parquet `FIXED_LEN_BYTE_ARRAY`
- PR：[#70479](https://github.com/StarRocks/StarRocks/pull/70479)
- 状态：OPEN

该 PR 主要为读取 Iceberg / Parquet 中的 `UUID` 等 `FIXED_LEN_BYTE_ARRAY` 类型提供支持。  
它反映出明显的湖仓兼容性诉求：
- 更完整的 Parquet 类型支持；
- 外部表/数据湖查询可读性增强；
- 减少因为物理编码类型导致的读取失败。

考虑到用户需求真实明确，且与 Iceberg 生态兼容直接相关，进入后续版本的概率较高。

---

## 6.3 CASE WHEN 空值比例统计
- PR：[#70221](https://github.com/StarRocks/StarRocks/pull/70221)
- 状态：OPEN

该增强用于估算 `CASE WHEN` 表达式的 null fraction。  
这属于典型的 **优化器统计信息质量提升**：
- 更好的基数估计；
- 更稳的计划选择；
- 减少复杂表达式下的误判。

虽然不易被终端用户直接感知，但对复杂查询性能有长期价值。

---

## 6.4 shared-data 模式下支持 VARCHAR 扩容的快速 schema evolution
- PR：[#70747](https://github.com/StarRocks/StarRocks/pull/70747)
- 状态：OPEN

该 PR 允许 `VARCHAR(n) -> VARCHAR(m)` 且 `m > n` 的变更走元数据级快速演化路径。  
这对生产场景非常有吸引力：
- 减少 schema change 成本；
- 缩短表结构变更时间；
- 降低共享存储架构下的运维影响。

这类“低成本 schema evolution” 往往会被企业用户强烈欢迎。

---

## 6.5 跨数据库 SQL digest 聚合能力
- PR：[#70770](https://github.com/StarRocks/StarRocks/pull/70770)
- 状态：OPEN

新增 `sql_digest_exclude_db` session variable，用于支持跨数据库 SQL digest 聚合。  
这说明 StarRocks 正在增强：
- SQL 观测性；
- Workload 分析能力；
- 多库场景下的统一性能诊断。

对平台型用户和托管服务场景尤其有价值。

---

## 7. 用户反馈摘要

结合今日 Issues，可提炼出几类真实用户痛点：

### 7.1 湖仓外部元数据规模已逼近 FE 极限
- 代表 Issue：[#67760](https://github.com/StarRocks/StarRocks/issues/67760)

用户在 Iceberg 超大分区表场景下直接遭遇 FE OOM，说明 StarRocks 已被用于非常大规模的湖仓查询控制面负载。  
用户核心诉求不是“功能有没有”，而是：
- 在百万分区级别能否稳定运行；
- 元数据缓存是否足够智能；
- FE 内存模型是否可预测。

---

### 7.2 外部 catalog 兼容性仍是生产门槛
- 代表 Issue：[#70719](https://github.com/StarRocks/StarRocks/issues/70719)
- 代表 Issue：[#70478](https://github.com/StarRocks/StarRocks/issues/70478)

无论是 Paimon 刷新异常还是 ADLS parquet 查询崩溃，都说明外部连接器的版本适配与格式健壮性依然是用户最敏感的体验点之一。  
这类用户通常运行在：
- 云对象存储；
- 多格式数据湖；
- 异构 catalog 并存环境。

---

### 7.3 用户非常在意“静默错误结果”
- 代表 Issue：[#70522](https://github.com/StarRocks/StarRocks/issues/70522)

相比 crash，用户对错误结果更敏感。该问题被明确描述为 severe bug，说明生产用户已经把 StarRocks 用在高可信分析场景中。  
这意味着：
- 查询正确性问题需要更强的发布可见性；
- 涉及 cache、一致性、外部元数据刷新路径时，用户希望看到明确的修复说明和规避建议。

---

### 7.4 SQL 兼容性和行为一致性仍是升级关键
- 代表 Release：4.0.8
- 代表 Issue：[#40292](https://github.com/StarRocks/StarRocks/issues/40292)

用户既希望获得更严格、可预测的 SQL 行为，也希望在对象名大小写、语义兼容等方面减少迁移成本。  
这说明 StarRocks 当前所面对的用户群体，已不仅是“新建数仓”，也包括越来越多的“异构迁移”和“多引擎共存”场景。

---

## 8. 待处理积压

以下为建议维护者重点关注的长期或高影响未决项：

### 8.1 Iceberg 百万分区 FE OOM
- Issue：[#67760](https://github.com/StarRocks/StarRocks/issues/67760)
- 创建时间：2026-01-12
- 状态：OPEN

这是一个持续数月仍未关闭的高影响稳定性问题，且直击湖仓扩展能力上限。建议提升优先级，并尽快公开修复路径或临时规避建议。

---

### 8.2 StarRocks Roadmap 2026
- Issue：[#67632](https://github.com/StarRocks/StarRocks/issues/67632)
- 创建时间：2026-01-08
- 状态：OPEN

虽然不是 bug，但这是社区预期管理的核心入口。建议维护团队定期更新状态，把已落地 PR/版本与 roadmap 项目显式关联，增强社区信心。

---

### 8.3 Paimon catalog 刷新 ClassCastException
- Issue：[#70719](https://github.com/StarRocks/StarRocks/issues/70719)
- 创建时间：2026-03-24
- 状态：OPEN

问题虽新，但属于外部连接器可用性缺陷，建议尽早响应并确认受影响 Paimon 版本范围。

---

### 8.4 依赖 CVE 修复跟进
- Issues：
  - [#70775](https://github.com/StarRocks/StarRocks/issues/70775)
  - [#70777](https://github.com/StarRocks/StarRocks/issues/70777)

安全问题通常不复杂，但处理节奏会直接影响企业用户升级与镜像准入，建议尽快补充升级 PR 或安全公告。

---

## 附：今日值得关注的 PR / Issue 链接汇总

- Roadmap 2026：[#67632](https://github.com/StarRocks/StarRocks/issues/67632)
- Iceberg 百万分区 FE OOM：[#67760](https://github.com/StarRocks/StarRocks/issues/67760)
- Paimon refresh ClassCastException：[#70719](https://github.com/StarRocks/StarRocks/issues/70719)
- jackson-core CVE：[#70775](https://github.com/StarRocks/StarRocks/issues/70775)
- ZooKeeper CVE：[#70777](https://github.com/StarRocks/StarRocks/issues/70777)
- `INSERT INTO BY NAME from FILES()` 修复：[#70774](https://github.com/StarRocks/StarRocks/pull/70774)
- 4.1 回移：[#70799](https://github.com/StarRocks/StarRocks/pull/70799)
- 3.5 回移：[#70800](https://github.com/StarRocks/StarRocks/pull/70800)
- 4.0 回移：[#70801](https://github.com/StarRocks/StarRocks/pull/70801)
- CTE hints 支持：[#70802](https://github.com/StarRocks/StarRocks/pull/70802)
- Parquet `FIXED_LEN_BYTE_ARRAY` 支持：[#70479](https://github.com/StarRocks/StarRocks/pull/70479)
- CASE WHEN null fraction：[#70221](https://github.com/StarRocks/StarRocks/pull/70221)
- 快速 schema evolution for VARCHAR widen：[#70747](https://github.com/StarRocks/StarRocks/pull/70747)
- sql digest 跨库聚合：[#70770](https://github.com/StarRocks/StarRocks/pull/70770)

如果你愿意，我可以继续把这份日报整理成 **适合公众号/飞书群发送的精简版**，或者输出成 **Markdown 表格周报模板**。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：Issues 更新 21 条、PR 更新 50 条，说明社区仍处于持续迭代与问题消化并行的状态。  
从主题看，今天的重点集中在 **V4 元数据/Manifest 演进、REST Catalog/OpenAPI 完善、Spark/Flink 查询与写入稳定性修复、Kafka Connect/Variant 类型扩展**。  
关闭的 Issue 有 7 条、已关闭/合并 PR 有 6 条，表明项目在处理存量问题方面有一定推进，但待合并 PR 仍高达 44 条，积压压力依旧明显。  
整体来看，项目健康度良好，核心开发方向清晰，但 **跨引擎一致性、流式写入正确性、云存储 IO 稳定性** 仍是当前风险热点。

---

## 3. 项目进展

> 注：今日数据中未给出明确“已合并 PR 列表明细”，以下基于“已关闭 PR / 已关闭 Issue”与活跃 PR 进展提炼重要推进项。

### 3.1 Flink Sink 与流式写入问题持续收敛
- **Flink 动态 Sink 缓存键问题已关闭**
  - Issue: #15731 `[CLOSED] [Flink] DynamicIcebergSink: HashKeyGenerator SelectorKey cache ignores writeParallelism and distributionMode changes`
  - 链接: apache/iceberg Issue #15731  
  - 影响：该问题会导致 Flink Sink 在运行时参数变化后仍沿用旧缓存键，带来写入分布错误或行为不一致风险。
  - 进展判断：问题已关闭，说明 Flink Sink V2/动态写入路径的正确性治理在推进。

### 3.2 Schema 变更边界被进一步补强
- **Map value 删除场景补测试**
  - PR: #15767 `[OPEN] [core] Add testDeleteMapValue in TestSchemaUpdate`
  - 链接: apache/iceberg PR #15767
- **对应改进 Issue**
  - Issue: #15766 `[OPEN] [improvement] Add testDeleteMapValue in TestSchemaUpdate`
  - 链接: apache/iceberg Issue #15766
- **相关长期需求**
  - Issue: #15313 `[OPEN] [improvement] Alter schema: allow to drop map fields`
  - 链接: apache/iceberg Issue #15313

这组变更说明社区正在厘清 **Schema evolution 对复杂类型（map key/value）删除操作的合法边界**。短期内更像是“补测试、明确约束”，而不是立即放开能力。

### 3.3 REST Catalog / OpenAPI 规范持续补全
- PR: #15180 `[OPENAPI] REST spec: add list/load function endpoints to OpenAPI spec`
  - 链接: apache/iceberg PR #15180
- PR: #15691 `[OPENAPI] REST Spec: Clarify identifier uniqueness across catalog object types`
  - 链接: apache/iceberg PR #15691
- PR: #15746 `[OPENAPI] SPEC: Add 404 response for /v1/config endpoint`
  - 链接: apache/iceberg PR #15746
- PR: #15525 `[OPEN] [API, core] API, Core: Add overwrite-aware table registration`
  - 链接: apache/iceberg PR #15525

今日 REST 方向的信号很明确：Iceberg 不仅在做实现，也在补 **Catalog 协议层的可互操作性与边界语义**。这对多引擎接入、第三方 Catalog 实现者和平台厂商尤其关键。

### 3.4 V4 元数据与 Manifest 能力继续前进
- PR: #15049 `[OPEN] [API, core] API, Core: Introduce foundational types for V4 manifest support`
  - 链接: apache/iceberg PR #15049
- PR: #15634 `[OPEN] [spark, parquet, core] Core, Parquet: Allow for Writing Parquet/Avro Manifests in V4`
  - 链接: apache/iceberg PR #15634
- PR: #15653 `[OPEN] [core] Add manifest partition pruning to DV validation in MergingSnapshotProducer`
  - 链接: apache/iceberg PR #15653

这表明 Iceberg 的 **V4 metadata tree / manifest 格式演进** 已进入较实质阶段：一方面补底层类型，另一方面推进读写与校验路径优化，尤其是 DV（deletion vectors）校验中的 manifest pruning，有望直接改善提交性能。

---

## 4. 社区热点

### 4.1 Variant 数据类型支持仍是最强热点
- Issue: #10392 `[OPEN] [proposal] Variant Data Type Support`
- 链接: apache/iceberg Issue #10392

这是今日最受关注的议题之一，累计评论 30、👍 70。其背后技术诉求非常明确：  
1. 用户希望 Iceberg 更好承载 **半结构化/动态 schema 数据**；  
2. 希望在保留 JSON/Avro/Parquet 弹性的同时获得更高效的列式存储与查询下推能力；  
3. 这也与多引擎生态中对 **统一 Variant 表达** 的需求相关。

配套信号：
- PR: #15283 `[OPEN] [KAFKACONNECT] Kafka Connect: Support VARIANT when record convert`
- 链接: apache/iceberg PR #15283

这说明 Variant 不再只是概念讨论，已经开始向连接器接入层落地。

---

### 4.2 类加载器泄漏问题引发核心稳定性质疑
- Issue: #15031 `[OPEN] [bug] Core: Static thread pools in ThreadPools.java cause ClassLoader leaks in hot-reload scenarios`
- 链接: apache/iceberg Issue #15031

这是一个典型的 **平台集成稳定性问题**。在热加载、插件式部署、长期运行服务中，静态线程池持有 ClassLoader 容易造成内存泄漏和资源无法释放。  
该问题评论较多，说明 Iceberg 已不仅运行在传统批处理任务里，也越来越多被嵌入服务端与长生命周期平台组件中。

---

### 4.3 GitHub Workflow 供应链安全成为治理重点
- Issue: #15742 `[OPEN] Harden GitHub Workflow Against Supply Chain Attacks`
- 链接: apache/iceberg Issue #15742

近期外部安全事件推动社区关注 CI/CD 供应链风险。该议题虽然不是数据面功能，但对开源项目健康度极其重要。  
其技术诉求包括：
- workflow 权限最小化；
- 第三方 action 风险收敛；
- 增强 CodeQL / 安全扫描覆盖。

---

### 4.4 REST 细粒度访问控制提案仍在发酵
- Issue: #14187 `[OPEN] [stale, proposal] [Proposal] [REST] Fine Grained Access Control`
- 链接: apache/iceberg Issue #14187

虽然评论不多，但这是非常重要的路线图信号。它说明 Iceberg REST Catalog 不再只是“元数据访问接口”，而在向 **跨引擎统一安全治理层** 演进，覆盖行级/列级权限与 masking。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Spark 查询正确性问题——不同 snapshot 查询返回同一份数据
- Issue: #15741 `[OPEN] [bug] Running 2 queries on the same table but different snapshot ID in Spark results in first snapshot's data returned for both queries`
- 链接: apache/iceberg Issue #15741

**严重性：高**  
这是直接影响查询正确性的缺陷。如果复现稳定，会破坏基于 snapshot isolation 的时点查询能力。  
当前状态：**未看到对应 fix PR**。  
建议关注：Spark SQL 计划缓存、DataSource V2 relation 复用、snapshot ID 参数绑定路径。

---

### P1：Flink + REST Catalog 恢复后重复写入
- Issue: #14425 `[OPEN] [bug] Iceberg Flink sinks duplicate data during recovery when used with the REST catalog`
- 链接: apache/iceberg Issue #14425

**严重性：高**  
该问题影响流式 exactly-once/幂等语义，属于生产环境敏感问题。  
已有修复线索：
- 摘要中明确提到 fix PR：**PR #14517**
- 链接: apache/iceberg PR #14517

这类问题通常涉及 checkpoint、committer、REST catalog 状态一致性，建议维护者优先推动 fix 合入或回移植。

---

### P1：Flink Maintenance 锁机制重试失效
- Issue: #15759 `[OPEN] [bug] Flink Maintenance: JdbcLockFactory inner catch blocks prevent ClientPoolImpl connection retry mechanism from working`
- 链接: apache/iceberg Issue #15759

**严重性：高**  
锁服务与连接重试是运维/维护作业可靠性的关键链路。当前异常包装方式阻断了 `ClientPoolImpl` 的 retry 机制，可能导致临时数据库故障无法自动恢复。  
当前状态：**暂无 fix PR 信号**。

---

### P2：Azure 文件不存在时异常类型不正确
- Issue: #15760 `[OPEN] [bug] Throw NotFoundException for inexistent input Azure file`
- 链接: apache/iceberg Issue #15760

**严重性：中高**  
问题本身不一定导致数据损坏，但会影响错误分类、上层重试策略与兼容性（尤其在 Trino 等调用方中）。  
这是典型的 **云对象存储适配语义一致性问题**。

---

### P2：ThreadPools 静态线程池导致 ClassLoader 泄漏
- Issue: #15031 `[OPEN] [bug] Core: Static thread pools in ThreadPools.java cause ClassLoader leaks in hot-reload scenarios`
- 链接: apache/iceberg Issue #15031

**严重性：中高**  
偏平台稳定性风险，短期不一定出现数据错误，但长期会造成内存泄漏、线程残留、服务重部署异常。

---

### P2：Kafka Connect / Athena 时间戳兼容性
- Issue: #15761 `[OPEN] [improvement] [Connect] Currently fields of type INT64 with logical name Timestamp are created as iceberg type TimestampType.withZone(), which is not fully supported by Athena`
- 链接: apache/iceberg Issue #15761

**严重性：中**  
属于生态兼容问题。Athena 不支持 `timestamp with time zone` 会影响 CTAS 与查询链路，直接触发用户“写得进去、查不出来/不能建表”的体验问题。

---

### P3：已关闭稳定性问题
- Issue: #15731 `[CLOSED] [Flink] DynamicIcebergSink: HashKeyGenerator SelectorKey cache ignores writeParallelism and distributionMode changes`
  - 链接: apache/iceberg Issue #15731
- Issue: #13863 `[CLOSED] [bug, stale] Connection pool shut down for io-impl S3FileIO`
  - 链接: apache/iceberg Issue #13863

这些问题虽已关闭，但分别反映了 **Flink sink 配置动态性** 与 **S3FileIO 长跑稳定性** 仍是历史痛点。

---

## 6. 功能请求与路线图信号

### 6.1 Variant 很可能进入下一阶段重点建设
- Issue: #10392 `[proposal] Variant Data Type Support`
  - 链接: apache/iceberg Issue #10392
- PR: #15283 `[KAFKACONNECT] Kafka Connect: Support VARIANT when record convert`
  - 链接: apache/iceberg PR #15283

判断：**高概率进入后续版本路线图**。  
原因：
- 用户关注度最高；
- 已有连接器层实现尝试；
- 与半结构化分析、实时摄取、湖仓统一建模强相关。

---

### 6.2 Flink Sink V2 插件化扩展信号非常强
- Issue: #15770 `Flink Sink V2: Add CommitGate plugin interface for deferred commits`
  - 链接: apache/iceberg Issue #15770
- Issue: #15768 `Flink Sink V2: Add PostCommitHook plugin interface`
  - 链接: apache/iceberg Issue #15768
- Issue: #15763 `Flink Sink V2: Add OutputFileFactoryProvider plugin interface`
  - 链接: apache/iceberg Issue #15763

判断：**中高概率被纳入 Flink Sink 能力演进**。  
这些提案展示出明显的平台化诉求：
- 延迟提交；
- 提交后钩子；
- 输出文件工厂自定义。

这意味着用户不再满足于“能写表”，而是希望 Sink 能融入更复杂的生产运维流程、目录路由、外部通知与治理体系。

---

### 6.3 REST Catalog 安全与函数能力继续扩展
- Issue: #14187 `[Proposal] [REST] Fine Grained Access Control`
  - 链接: apache/iceberg Issue #14187
- PR: #15180 `REST spec: add list/load function endpoints to OpenAPI spec`
  - 链接: apache/iceberg PR #15180

判断：**中期路线图信号明显**。  
REST Catalog 正从“目录 API”升级为“生态控制平面”，函数发现、权限控制、对象类型唯一性约束都在逐步补齐。

---

### 6.4 Schema evolution 能力仍有扩展需求
- Issue: #15313 `[improvement] Alter schema: allow to drop map fields`
  - 链接: apache/iceberg Issue #15313

判断：**短期未必直接放开**。  
当前更像是在补测试和明确定义限制条件，而不是立即支持删除 map 子字段。

---

### 6.5 物化视图与 REST 加密仍属长期大项
- PR: #9830 `Views, Spark: Add support for Materialized Views; Integrate with Spark SQL`
  - 链接: apache/iceberg PR #9830
- PR: #13225 `Encryption for REST catalog`
  - 链接: apache/iceberg PR #13225

判断：**重要但推进偏慢**。  
二者都代表 Iceberg 平台化的关键能力，但因设计面广、兼容面大，落地节奏仍偏长期。

---

## 7. 用户反馈摘要

结合今日 Issues，可提炼出以下真实痛点：

### 7.1 用户最关心“查询/恢复后结果是否正确”
- Spark 不同 snapshot 查询串结果（#15741）
- Flink + REST catalog 恢复后数据重复（#14425）

这说明用户对 Iceberg 的核心期待仍然是：  
**在多引擎、流批一体场景下，保证时点一致性与端到端正确性。**

---

### 7.2 平台型使用场景增多，资源生命周期问题更突出
- ThreadPools ClassLoader 泄漏（#15031）
- 云存储连接池与异常分类问题（#13863、#15760）

用户已经不只是“离线任务调用一个库”，而是在：
- 热加载平台；
- 长生命周期服务；
- 托管式云环境；
- 多租户计算平台  
中运行 Iceberg，因此对资源释放、异常语义、连接稳定性要求更高。

---

### 7.3 生态兼容性成为 adoption 关键
- Athena 不支持 `timestamp with time zone`（#15761）
- Kafka Connect 名称映射大小写问题修复 PR（#15393）
  - 链接: apache/iceberg PR #15393

用户往往不是只使用 Iceberg 本身，而是与 Spark/Flink/Trino/Athena/Kafka Connect 等组合使用。  
因此，一些“看似小”的类型映射或字段查找问题，实际上会直接影响生产落地。

---

### 7.4 用户希望更强的扩展点，而非固定行为
- Flink Sink V2 各类插件接口提案（#15770、#15768、#15763）

这类需求说明高级用户希望 Iceberg 提供：
- 更灵活的写入编排；
- 更可插拔的输出策略；
- 更好的与外部治理系统集成能力。

---

## 8. 待处理积压

以下事项值得维护者重点关注：

### 8.1 长期高热度：Variant 数据类型支持
- Issue: #10392
- 链接: apache/iceberg Issue #10392

高评论、高点赞，且已有周边 PR 跟进，是典型的“社区强需求但尚未正式落地”的议题。建议维护者明确：
- 规范层定义；
- 各引擎最小支持面；
- 与现有类型系统/文件格式的兼容策略。

---

### 8.2 长期大 PR：物化视图支持
- PR: #9830
- 链接: apache/iceberg PR #9830

从 2024-02 持续至今，属于战略级功能。若长期悬而未决，容易消耗贡献者与用户预期。建议给出阶段性结论：拆分范围、先落规范还是先落 Spark 集成。

---

### 8.3 长期大 PR：REST Catalog 加密
- PR: #13225
- 链接: apache/iceberg PR #13225

这是企业用户高度关注的能力，但从 2025-06 持续开放至今。建议明确是否需要：
- 缩小首版范围；
- 拆成协议、核心、Hive/REST 各子任务；
- 给出兼容性和密钥管理建议。

---

### 8.4 V4 Manifest / Metadata Tree 相关 PR 需要加速收敛
- PR: #15049
- 链接: apache/iceberg PR #15049
- PR: #15634
- 链接: apache/iceberg PR #15634
- PR: #15653
- 链接: apache/iceberg PR #15653

这组 PR 彼此关联度高，若审查节奏过慢，容易阻塞后续更多特性。建议维护者按主题进行批量评审与设计对齐。

---

### 8.5 Spark 流式 OVERWRITE 语义支持仍待推进
- PR: #15152 `[spark, docs] Spark: Add streaming-overwrite-mode option for handling OVERWRITE snapshots`
- 链接: apache/iceberg PR #15152

这是结构化流用户非常实际的需求，尤其涉及消费 OVERWRITE snapshot 时的行为定义，建议尽快形成明确语义和默认策略。

---

## 附：今日值得重点关注的链接清单

- Variant 类型提案：apache/iceberg Issue #10392  
- ThreadPools ClassLoader 泄漏：apache/iceberg Issue #15031  
- Flink + REST catalog 恢复重复写入：apache/iceberg Issue #14425  
- Spark 不同 snapshot 查询串结果：apache/iceberg Issue #15741  
- GitHub Workflow 供应链安全：apache/iceberg Issue #15742  
- REST 细粒度访问控制提案：apache/iceberg Issue #14187  
- V4 manifest 基础类型：apache/iceberg PR #15049  
- V4 manifest 写入 Parquet/Avro：apache/iceberg PR #15634  
- DV 校验 manifest pruning 优化：apache/iceberg PR #15653  
- REST OpenAPI function endpoints：apache/iceberg PR #15180  
- Kafka Connect 支持 VARIANT：apache/iceberg PR #15283  
- Spark 流式 overwrite mode：apache/iceberg PR #15152  

如果你愿意，我还可以把这份日报继续整理成：
1. **适合公众号/周报发布的精简版**，或  
2. **按 Spark / Flink / REST / Connect 四个模块拆分的技术视图版**。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时内，Delta Lake 保持**高活跃度**：共有 **40 条 PR 更新**、**2 条 Issue 更新**，但**无新版本发布**。  
从提交主题看，今天的开发重心非常明确，主要集中在 **kernel-spark 的 CDC（Change Data Capture）流式读取链路**、**DSv2 写入/DDL 基础设施**、以及 **CI/测试与连接器兼容性**。  
PR 数量远高于 Issue 数量，说明当前项目状态偏向**集中开发与功能落地阶段**，而不是大规模故障应对阶段。  
值得注意的是，今日大量 PR 由同一条 stacked PR 链组成，表明团队正在系统性推进 **Kernel + Spark V2 流式 CDC 能力**，这很可能是后续版本的重要能力增量。

---

## 3. 项目进展

### 3.1 今日已关闭/合并的重要 PR

#### 1) Pass streaming DataSource options into DeltaLog snapshot for UC external tables
- 状态：**CLOSED**
- 链接：delta-io/delta PR #6393
- 说明：该 PR 为 **UC（Unity Catalog）外部表的流式读取**补充了测试，验证 streaming DataSource 选项，尤其是 `fs.*` 这类 Hadoop 文件系统参数，能够正确传递到 `DeltaLog` snapshot。
- 影响分析：
  - 这属于**连接器/存储访问链路正确性**改进；
  - 对使用自定义对象存储、Hadoop FS 配置、云上外部表的用户尤其重要；
  - 有助于降低“配置在 batch 可用、streaming 不生效”的环境一致性问题。

#### 2) [CI] Disable python venv centric github action workflows and remove pipenv in spark_test workflow
- 状态：**CLOSED**
- 链接：delta-io/delta PR #6390
- 说明：调整 CI 工作流，禁用以 Python venv 为中心的 GitHub Actions，并在 `spark_test` workflow 中移除 `pipenv`。
- 影响分析：
  - 这是典型的**工程效率/可维护性优化**；
  - 有望减少 CI 环境差异、依赖解析不稳定、测试流水线维护成本；
  - 虽然不直接改变引擎行为，但会提升后续 PR 的交付速度与稳定性。

### 3.2 今日持续推进的核心研发方向

#### A. kernel-spark CDC 流式支持进入成体系收敛阶段
以下 PR 构成一条清晰的 stacked 开发链，围绕 **Delta Kernel + Spark DSv2 的 CDC streaming** 全面推进：

- [#6075](delta-io/delta PR #6075) `[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)`
- [#6076](delta-io/delta PR #6076) `[kernel-spark][Part 2] CDC commit processing`
- [#6391](delta-io/delta PR #6391) `[kernel-spark][Part 2.5] CDC admission limits for commit processing`
- [#6336](delta-io/delta PR #6336) `[kernel-spark][Part 3] CDC streaming offset management (finish wiring up incremental change processing)`
- [#6359](delta-io/delta PR #6359) `[kernel-spark][Part 4] CDC data reading: ReadFunc decorator and null-coalesce`
- [#6362](delta-io/delta PR #6362) `[kernel-spark][Part 5] CDC schema coordination in ApplyV2Streaming and SparkScan`
- [#6363](delta-io/delta PR #6363) `[kernel-spark][Part 6] End-to-end CDC streaming integration tests`
- [#6388](delta-io/delta PR #6388) `[kernel-spark] Support allowOutOfRange for CDC startingVersion in DSv2 streaming`
- [#6370](delta-io/delta PR #6370) `[kernel-spark][Part 7] DV+CDC same-path pairing and DeletionVector support`

**技术意义：**
- 打通 **CDC 流式消费** 的关键路径：offset 管理、commit 处理、增量变更摄取、schema 协调、读取函数装饰、端到端测试；
- 引入 **allowOutOfRange**，改善从 `startingVersion` 启动流任务时的健壮性；
- 支持 **DV（Deletion Vector）与 CDC** 协同，说明团队正在补齐复杂数据变更场景下的一致性处理能力。

**对 OLAP/分析引擎的价值：**
- 更适合做低延迟增量同步、湖仓一体流批融合、下游物化视图/特征管道；
- 使 Delta Kernel 在 Spark V2 生态中的可用性更接近成熟生产能力；
- 若该链路成功合并，将明显增强 Delta 在**变更捕获与流式分析**场景的竞争力。

#### B. DSv2 写入和 DDL 基础设施继续推进
- [#6230](delta-io/delta PR #6230) `Add executor writer: DataWriter, DeltaWriterCommitMessage`
- [#6377](delta-io/delta PR #6377) `Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE`

**分析：**
- #6230 推进 **DSv2 executor writer**，属于 Spark 数据源 V2 写入执行路径的核心基础设施；
- #6377 为 **DSv2 CREATE TABLE** 铺设基础对象模型和前置设施；
- 两者共同指向：Delta 正在补强 **Spark DSv2 原生写入/DDL 支持**，这将影响未来 SQL DDL 一致性、catalog 集成与写入路径模块化。

#### C. 查询优化与谓词下推能力增强
- [#6355](delta-io/delta PR #6355) `[kernel-spark] [Spark] Add AlwaysTrue/AlwaysFalse filter pushdown to V2 connector`

**分析：**
- 将 Spark 的 `AlwaysTrue` / `AlwaysFalse` 转换为 Kernel 谓词；
- `AlwaysFalse` 可直接触发**全文件跳过**，这是典型的查询裁剪优化；
- 属于小改动但高收益的执行层增强，能改善空结果集查询、条件折叠后的扫描效率。

#### D. 连接器与生态兼容性
- [#6188](delta-io/delta PR #6188) `[Flink] Support Catalog-Managed Table with UC`
- [#6392](delta-io/delta PR #6392) `DeltaFormatSharingSource only finish current version when startOffset is from Legacy`
- [#6389](delta-io/delta PR #6389) `[Kernel] Make DefaultFileSystemManagedTableOnlyCommitter protected`
- [#6301](delta-io/delta PR #6301) `[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings`

**分析：**
- Flink + UC 支持说明 Delta 持续扩展**多引擎 catalog 管理能力**；
- Sharing Source 偏移量处理修正，体现 streaming 兼容性细节仍在打磨；
- Geospatial stats parsing 则传递出一个信号：Delta 开始更多考虑**地理空间类型**在统计信息与下推场景中的可用性。

---

## 4. 社区热点

> 说明：给定数据未提供真实评论排序值（多处为 `undefined`），以下热点以“更新频率、技术影响面、开发链规模”综合判断。

### 热点 1：kernel-spark CDC 流式读取大规模 stacked PR 链
- 代表链接：
  - delta-io/delta PR #6075
  - delta-io/delta PR #6076
  - delta-io/delta PR #6336
  - delta-io/delta PR #6359
  - delta-io/delta PR #6362
  - delta-io/delta PR #6363
  - delta-io/delta PR #6388
  - delta-io/delta PR #6370
- 技术诉求分析：
  - 用户希望 CDC 不仅能离线读，还能在 **Spark DSv2 / Kernel** 路径下进行**可靠流式消费**；
  - 痛点集中在 offset 表达、版本边界、schema 演进、DV 兼容和 E2E 正确性；
  - 这类能力直接关系到 Delta 在实时数仓、增量同步、变更订阅中的落地深度。

### 热点 2：Kernel 异常结构化与 startingVersion 可诊断性
- 链接：delta-io/delta Issue #6380
- 技术诉求分析：
  - 当前 `startVersionNotFound()` 仅通过错误消息字符串暴露 `earliestAvailableVersion`；
  - 社区希望返回**结构化异常**，便于程序自动解析、重试、回退或告警；
  - 这说明 Delta Kernel 正被越来越多用在**自动化平台/服务端系统**中，而不只是人工调试场景。

### 热点 3：PySpark 4.0 + clusterBy 表达式分区异常
- 链接：delta-io/delta Issue #4823
- 技术诉求分析：
  - 这是一个跨 **PySpark 4.0 / partitioning expressions / clusterBy** 的兼容性问题；
  - 背后反映的是 Spark 新版本 API 行为变化与 Delta 侧分区/布局逻辑之间的适配问题；
  - 若影响范围扩大，可能涉及用户升级 Spark 版本后的写入失败或布局异常。

### 热点 4：DSv2 原生支持持续深化
- 代表链接：
  - delta-io/delta PR #6230
  - delta-io/delta PR #6377
- 技术诉求分析：
  - 社区希望 Delta 更好地融入 Spark DataSource V2 生命周期；
  - 包括写入器模型、CREATE TABLE、DDL 上下文封装等；
  - 这通常意味着项目正在为更标准化、更可插拔的 Spark 集成做架构准备。

---

## 5. Bug 与稳定性

按潜在影响程度排序：

### P1：PySpark 4.0 `clusterBy` 引发异常，涉及表达式分区
- Issue：[#4823](delta-io/delta Issue #4823)
- 标题：`[bug] [BUG] Pyspark 4.0 clusterBy raises strange errors Partitioning by expressions`
- 状态：**OPEN**
- 影响：
  - 可能影响 Spark 4.0 用户在使用 `clusterBy` 或表达式分区时的写入/规划流程；
  - 如属真实回归，属于**版本升级兼容性问题**，对生产升级有阻塞风险。
- 当前情况：
  - 已有 4 条评论，说明问题有一定复现/讨论基础；
  - **暂无明确 fix PR** 出现在今日数据中。
- 建议关注：
  - 是否与 Spark 4.0 Catalyst/partition transform 表达变化有关；
  - 是否只影响 Kernel 路径，还是 Spark 主路径也受影响。

### P2：startingVersion 不存在时异常缺乏结构化字段
- Issue：[#6380](delta-io/delta Issue #6380)
- 标题：`[Feature Request] [kernel-spark] startVersionNotFound should throw a structured exception exposing earliestAvailableVersion`
- 状态：**OPEN**
- 影响：
  - 不是 crash 型 bug，但会显著影响**自动恢复能力、程序化诊断和服务端兼容性**；
  - 对做流式订阅、断点续跑、平台托管任务的用户尤其重要。
- 关联修复迹象：
  - 今日暂无直接 fix PR；
  - 但与 [#6388](delta-io/delta PR #6388) `allowOutOfRange for CDC startingVersion` 在问题域上高度相关，说明团队已在处理版本边界可用性问题。

### P3：Sharing 流式源 startOffset/Legacy 逻辑边界
- PR：[#6392](delta-io/delta PR #6392)
- 状态：**OPEN**
- 影响：
  - 属于 streaming offset 兼容性修正；
  - 对 Delta Sharing 使用者而言可能影响版本完成条件，进而影响重复消费或漏消费风险。
- fix 状态：
  - **已有修复 PR**，尚待合并。

### P3：UC 外部表 streaming DataSource options 透传正确性
- PR：[#6393](delta-io/delta PR #6393)
- 状态：**CLOSED**
- 影响：
  - 若测试对应真实缺陷，则这类问题会导致外部表流式访问无法继承正确的文件系统参数；
  - 今天已有关闭动作，说明该方向已被处理或验证。

---

## 6. 功能请求与路线图信号

### 6.1 明确的新需求

#### 1) Kernel 结构化异常：暴露 earliestAvailableVersion
- 链接：[#6380](delta-io/delta Issue #6380)
- 信号：
  - 用户不满足于“错误文本可读”，而是希望“异常对象可编程”；
  - 这是平台化、托管化使用 Delta 的典型诉求。

#### 2) Compression setting 的协议级 RFC
- 链接：[#6324](delta-io/delta PR #6324)
- 信号：
  - 这不是普通实现 PR，而是**协议/RFC 层面的设计讨论**；
  - 表明社区可能正在评估对 Parquet compression 做更明确、可标准化的协议描述；
  - 若推进，未来可能影响写入默认值、跨引擎一致性与读写兼容矩阵。

### 6.2 可能纳入下一版本的重要方向

结合今日活跃 PR，以下方向被纳入下一版本的概率较高：

#### A. Kernel-Spark CDC streaming
- 依据：
  - 同一作者维护的多段 stacked PR 已覆盖 offset、commit、schema、DV、E2E tests；
  - 这是典型的“功能落地前冲刺”特征。
- 可能产出：
  - DSv2 流式 CDC 读取能力增强；
  - 更健壮的版本边界处理；
  - CDC + DV 组合场景支持。

#### B. DSv2 写入与 DDL 基建
- 依据：
  - [#6230](delta-io/delta PR #6230)、[#6377](delta-io/delta PR #6377) 都是架构底座类工作；
- 可能产出：
  - 更完整的 CREATE TABLE、写入器执行模型；
  - 更好的 catalog/SQL 语义整合。

#### C. Flink + UC 集成增强
- 依据：
  - [#6188](delta-io/delta PR #6188) 持续活跃；
- 可能产出：
  - Flink 环境下对 Unity Catalog 管理表的更标准支持；
  - 增强跨引擎统一治理能力。

#### D. Predicate Pushdown 与统计信息类型扩展
- 依据：
  - [#6355](delta-io/delta PR #6355)、[#6301](delta-io/delta PR #6301)；
- 可能产出：
  - 更激进的文件裁剪；
  - 对 geospatial 等复杂类型的统计信息适配。

---

## 7. 用户反馈摘要

### 1) 用户在 Spark 新版本升级中遇到兼容性摩擦
- 来源：[#4823](delta-io/delta Issue #4823)
- 摘要：
  - 用户在 PySpark 4.0 场景下使用 `clusterBy` 与表达式分区时出现“奇怪错误”；
  - 这说明对部分用户而言，Delta 的主要痛点不是功能缺失，而是**升级后行为一致性**。
- 场景推断：
  - 生产环境升级 Spark 版本；
  - 依赖 DataFrame API / 表布局优化；
  - 对错误消息可理解性和兼容性预期较高。

### 2) 用户希望异常更适合程序自动处理，而不是人工阅读
- 来源：[#6380](delta-io/delta Issue #6380)
- 摘要：
  - 用户需要直接拿到 `earliestAvailableVersion`，而不是从 message 字符串中解析；
  - 说明 Delta Kernel 正进入更多**自动化调度、平台服务、长跑流任务**场景。
- 场景推断：
  - 流任务断点恢复；
  - retention 导致历史版本不可用时的智能回退；
  - 平台侧统一异常治理。

### 3) 对多引擎、多 catalog、多存储环境的一致性要求持续增强
- 来源：
  - [#6188](delta-io/delta PR #6188)
  - [#6393](delta-io/delta PR #6393)
  - [#6392](delta-io/delta PR #6392)
- 摘要：
  - 用户不再只关心 Spark 单机语义，而是要求 **Flink / Sharing / UC / 外部表 / 自定义 FS 参数** 等场景一致工作；
  - 这对 Delta 来说意味着生态成熟度比单点功能更重要。

---

## 8. 待处理积压

以下条目值得维护者继续关注：

### 1) Spark 4.0 兼容性问题仍未见修复 PR
- 链接：[#4823](delta-io/delta Issue #4823)
- 原因：
  - 创建时间较早（2025-06-25），最近仍在更新；
  - 涉及 Spark 4.0 升级兼容，潜在影响面较大；
  - 若无修复，可能持续阻碍用户升级。

### 2) 文档补充 PR 持续未收敛
- 链接：[#6115](delta-io/delta PR #6115)
- 标题：`[Docs] Fix #5151: Add data types docs, variant Parquet mapping, and VARCHAR/...`
- 原因：
  - 创建于 2026-02-24，仍在开放；
  - 文档类 PR 往往优先级较低，但其内容涉及数据类型、Variant/Parquet mapping、VARCHAR 等用户常见困惑点；
  - 若长期不合并，会增加用户理解门槛。

### 3) Flink + UC 支持仍在推进中
- 链接：[#6188](delta-io/delta PR #6188)
- 原因：
  - 创建于 2026-03-04，今日仍活跃；
  - 这是生态扩展的重要方向，建议持续评审，避免成为跨引擎支持瓶颈。

### 4) DSv2 Executor Writer 基建 PR 需重点推进
- 链接：[#6230](delta-io/delta PR #6230)
- 原因：
  - 该 PR 是后续 DSv2 写入能力的基础设施；
  - 若评审周期过长，可能连带阻塞更多上层写入/DDL 功能落地。

### 5) Compression RFC 建议尽早形成结论
- 链接：[#6324](delta-io/delta PR #6324)
- 原因：
  - 协议/RFC 类讨论若久拖不决，容易影响跨引擎实现一致性；
  - 对存储优化、压缩策略可预期性、兼容性文档均有长期影响。

---

## 健康度结论

今天的 Delta Lake 整体健康度可评为：**良好偏强**。  
主要依据是：**PR 活跃度高、开发主题集中、无明显大规模线上事故信号、CI 和测试基础设施持续改进**。  
短期最值得关注的主线是 **kernel-spark CDC streaming 能否顺利完成整链合入**；中期则应关注 **Spark 4.0 兼容性问题、DSv2 基建成熟度，以及多引擎生态整合**。

如果你愿意，我可以进一步把这份日报整理成更适合团队周会的 **“管理层摘要版”** 或更适合工程团队跟进的 **“PR 风险追踪版”**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时 Databend 维持较高开发活跃度：Issues 更新 3 条，PR 更新 22 条，其中 20 条仍在推进中，2 条已关闭。  
从变更内容看，今日重点集中在 **SQL 兼容性补齐、查询引擎稳定性修复、错误语义治理** 三个方向，尤其是 parser / planner / join / stats / HTTP 接口等核心路径都有持续演进。  
社区信号显示，项目当前处于 **高频修 bug + 并行推进中期特性** 的节奏：一方面快速修补 planner panic、join schema、字面量解析等 correctness 问题；另一方面继续推进实验性表分支、分区 Hash Join 等更大功能。  
整体健康度评价：**活跃且偏工程收敛期**，短期目标明显是提升查询稳定性和 SQL 行为一致性，为后续版本发布做铺垫。

---

## 3. 项目进展

### 已关闭 / 已完成的重点 PR

#### 1) HTTP 查询接口增强：支持服务端参数绑定
- PR: #19601 `feat(http): add server-side parameter binding to /v1/query`
- 状态：**Closed**
- 链接：databendlabs/databend PR #19601

该 PR 为 `/v1/query` 增加了可选 `params` 字段，支持：
- 位置参数 `?`
- 命名参数 `:name`

这说明 Databend 正在加强其 **HTTP 查询接口的应用集成能力**，对 API 调用方、网关、BI 中间层、Serverless SQL 调用都更友好。  
虽然当前状态是 closed 而非明确 merged，但从方向上看，这是面向产品化接入的重要增强：可减少客户端自行拼接 SQL 的风险，并提升查询模板复用能力。

#### 2) Planner 健壮性修复：非法 LIKE ESCAPE 不再 panic
- PR: #19597 `fix(query): avoid planner panic for invalid LIKE ESCAPE literals`
- 状态：**Closed**
- 链接：databendlabs/databend PR #19597

该修复将 `LIKE / NOT LIKE / LIKE ANY ... ESCAPE` 中非法 escape literal 的处理，从 panic 调整为 **语义错误返回**。  
这类修复价值很高，因为它直接减少：
- planner 层崩溃
- 用户输入异常导致的服务不稳定
- SQL 兼容边界行为不一致

这表明 Databend 继续把“**panic -> structured error**”作为稳定性治理的重要方向。

---

### 正在推进的重要 PR

#### 3) SQL DDL 兼容性补齐：`ALTER TABLE ADD COLUMN IF NOT EXISTS`
- PR: #19615 `fix(query): support IF NOT EXISTS for ALTER TABLE ADD COLUMN`
- 状态：Open
- 链接：databendlabs/databend PR #19615

该 PR 将带来：
- parser 支持 `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- 重复加列在带 `IF NOT EXISTS` 时变为 no-op
- 增加 Rust 与 SQL 回归测试

这是典型的 **MySQL/PostgreSQL 风格 DDL 兼容性增强**，对自动化 schema 演进、幂等建表脚本、迁移工具非常关键，预计进入下一版本的概率较高。

#### 4) 错误码语义整治：重命名 `PanicError`
- PR: #19614 `fix: rename PanicError and fix executor OOM mapping`
- 状态：Open
- 链接：databendlabs/databend PR #19614

该 PR 拟：
- 将 `ErrorCode::PanicError` 重命名为 `ErrorCode::UnwindError`
- 保持错误码 1104 不变
- 修复 pipeline executor 中内存限制失败被错误映射为 panic 类错误的问题

这是一次很重要的 **错误分类治理**。它有助于：
- 降低 observability 混淆
- 提升用户对错误原因的理解
- 避免 OOM / flush 失败被误判为内部 panic

#### 5) FULL OUTER JOIN 结果模式修复
- PR: #19616 `fix(query): align full outer USING nullability`
- 状态：Open
- 链接：databendlabs/databend PR #19616

该 PR 使 `FULL OUTER JOIN` 中 `USING / NATURAL` 的可见 join key 变为 nullable，以匹配 hash join 输出 schema。  
这是 **查询正确性修复**，对：
- 结果 schema 推导
- 下游 projection
- 客户端 schema 依赖逻辑  
都有直接影响。

#### 6) 统计信息推导防溢出
- PR: #19591 `fix: avoid overflow in Scan::derive_stats for full-range UInt64 stats`
- 状态：Open
- 链接：databendlabs/databend PR #19591

修复 `Scan::derive_stats` 在处理全范围 `UInt64` 时的 NDV reduction 溢出问题，并复用安全跨度计算逻辑。  
这属于 **优化器基础设施修复**，虽然不是直接用户可见功能，但会影响：
- 基数估计
- 计划质量
- 极值统计上的稳定性

#### 7) 相关子查询 + UNION 正确性修复
- PR: #19607 `fix(sql): handle correlated subqueries over union`
- 状态：Open
- 链接：databendlabs/databend PR #19607

该 PR 保留 decorrelation 后 `UNION / UNION ALL` 分支上的相关列映射，并补充回归测试。  
这是一个较深层的 planner/rewriter correctness 修复，影响复杂分析 SQL，可视为 **高级 SQL 语义完善**。

#### 8) 二进制字面量兼容性修复
- PR: #19608 `fix(sql): treat X'...' as binary literal`
- 状态：Open
- 链接：databendlabs/databend PR #19608

将 `X'...'` 解析为 binary literal，而 `0x...` 保持数值字面量语义。  
这是重要的 SQL 方言兼容增强，尤其利好：
- MySQL 风格迁移
- 二进制数据处理
- 函数层类型推导一致性

#### 9) ASOF JOIN 扩展 unsigned key 支持
- PR: #19603 `fix(sql): support unsigned ASOF join keys`
- 状态：Open
- 链接：databendlabs/databend PR #19603

Databend 持续在时间序列/近邻匹配查询能力上补齐边界类型支持。  
该修复让 ASOF join 能支持无符号整数 key，并将 `unwrap()` 改为显式错误传播，提升 correctness 与健壮性。

#### 10) 中长期特性推进：实验性 table branch、partitioned hash join
- PR: #19551 `feat(query): support experimental table branch`
- 状态：Open
- 链接：databendlabs/databend PR #19551

- PR: #19553 `refactor(query): support partitioned hash join`
- 状态：Open
- 链接：databendlabs/databend PR #19553

这两个 PR 是当前最值得持续关注的中期演进方向：
- **experimental table branch**：可能与数据分支、实验环境、类 Git-like 表级隔离能力相关
- **partitioned hash join**：说明查询执行引擎正朝更强的可扩展 join 实现演进，潜在改善大表 join 的内存与并行表现

---

## 4. 社区热点

> 注：提供的数据中评论数均为 `undefined` 或 0，无法严格按评论/反应排序，因此以下按“技术影响面 + 更新时效 + 功能重要性”综合判断。

### 热点 1：实验性 table branch
- PR: #19551
- 链接：databendlabs/databend PR #19551

这是今天最具“路线图信号”的 PR。  
背后技术诉求可能是：
- 表级实验分支/隔离开发
- 数据版本化
- 更安全的 schema / data 试验流程
- 面向 Lakehouse / 数据协作的高级能力

若该 PR 持续推进，说明 Databend 在 OLAP 之外，也在加强数据工程工作流能力。

### 热点 2：分区 Hash Join
- PR: #19553
- 链接：databendlabs/databend PR #19553

这是引擎层的重要 refactor。  
背后诉求是典型的分析引擎优化目标：
- 降低大型 join 的内存压力
- 提升并行处理能力
- 为 spill / repartition / skew handling 打基础

对 OLAP 引擎而言，这类基础设施改造的价值通常高于单点 SQL 修复。

### 热点 3：gRPC 监听 socket 开启 `TCP_NODELAY`
- PR: #19619
- 链接：databendlabs/databend PR #19619

该 PR 通过升级 databend-meta 版本引入 `TCP_NODELAY` 修复，避免 Nagle 算法缓冲小型 gRPC 包。  
背后反映的是：
- 元数据层低延迟诉求
- 集群内控制面交互优化
- 对尾延迟敏感场景的持续打磨

对于分布式数据库，控制面通信延迟优化往往能显著改善元操作和协调性能体验。

### 热点 4：错误码命名与误用治理
- Issue: #19612
- 链接：databendlabs/databend Issue #19612
- 对应 PR: #19614
- 链接：databendlabs/databend PR #19614

这类问题虽然不是“新功能”，但体现了项目从可运行走向可运维、可观测、可诊断。  
技术诉求是：
- 错误语义清晰
- 监控指标可解释
- 减少一线排障歧义

---

## 5. Bug 与稳定性

以下按严重程度排序。

### P1：错误码语义混乱，OOM/执行器错误被误归类为 Panic
- Issue: #19612 `Rename ErrorCode::PanicError to reduce confusion and fix misuse`
- 状态：Open
- 链接：databendlabs/databend Issue #19612
- 修复 PR：#19614
- 链接：databendlabs/databend PR #19614

**影响**：
- 内部错误分类不准确
- 监控和告警误导
- 用户误判系统是否发生真正 panic

**结论**：这是运维诊断层面的高优先级问题，已有 fix 在路上。

### P1：`ALTER TABLE ADD COLUMN IF NOT EXISTS` 不支持
- Issue: #19611
- 状态：Open
- 链接：databendlabs/databend Issue #19611
- 重复/已关闭 Issue：#19613
- 链接：databendlabs/databend Issue #19613
- 修复 PR：#19615
- 链接：databendlabs/databend PR #19615

**影响**：
- DDL 幂等性差
- 自动化迁移脚本易失败
- 与主流 SQL 方言存在兼容性缺口

**结论**：属于高频易踩坑问题，已快速响应并给出修复 PR，处理效率较高。

### P1：复杂 SQL correctness / planner panic 类问题持续修复
相关 PR：
- #19616 FULL OUTER JOIN nullability 对齐  
- #19607 correlated subquery over union  
- #19602 result projection mismatch error  
- #19605 nested joins round-trip parser panic  
- #19604 empty IEJoin outer fill  
- #19595 empty LIKE ESCAPE  
- #19594 invalid `GROUPING()` semantic error  
链接：
- databendlabs/databend PR #19616
- databendlabs/databend PR #19607
- databendlabs/databend PR #19602
- databendlabs/databend PR #19605
- databendlabs/databend PR #19604
- databendlabs/databend PR #19595
- databendlabs/databend PR #19594

**共同特征**：
- 多数集中在 planner / binder / join executor 边界条件
- 修复目标大多是“panic 改为结构化错误”或“schema/行为与实际执行对齐”
- 表明 Databend 正在系统性收敛复杂 SQL 的 correctness debt

### P2：统计推导在极值 UInt64 上溢出
- PR: #19591
- 链接：databendlabs/databend PR #19591

**影响**：
- 优化器统计不稳定
- 极端数据分布下计划质量可能劣化

**结论**：对性能和计划稳定性重要，但用户体感不如 panic/correctness 类问题直接。

### P2：二进制/十六进制字面量兼容性不一致
- PR: #19608
- 链接：databendlabs/databend PR #19608

**影响**：
- 迁移 SQL 兼容性
- 函数层类型推导与结果一致性

### P3：CI stage matrix size 运行时未正确传递
- PR: #19606
- 链接：databendlabs/databend PR #19606

**影响**：
- 测试矩阵覆盖可能失真
- 影响的是工程验证质量，而非直接生产功能

---

## 6. 功能请求与路线图信号

### 可能进入下一版本的功能/修复

#### 1) `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Issue: #19611
- PR: #19615
- 链接：
  - databendlabs/databend Issue #19611
  - databendlabs/databend PR #19615

这是最明确、最接近落地的 SQL 兼容性增强。  
具备：
- 明确用户需求
- 快速提交修复
- 已补测试  
因此进入下一版本的概率很高。

#### 2) 更清晰的错误分类体系
- Issue: #19612
- PR: #19614
- 链接：
  - databendlabs/databend Issue #19612
  - databendlabs/databend PR #19614

虽然不是用户显式请求的“功能”，但这是产品成熟度升级的强信号。  
预计后续可能看到更多：
- error code 规范化
- panic 统一收敛
- observability 相关改造

### 中期路线图信号

#### 3) 实验性 table branch
- PR: #19551
- 链接：databendlabs/databend PR #19551

如果持续推进，这会是相当重要的差异化能力，可能涉及：
- 数据分支/快照工作流
- 开发测试环境隔离
- 更细粒度的数据版本管理

#### 4) Partitioned Hash Join
- PR: #19553
- 链接：databendlabs/databend PR #19553

这是典型的执行引擎演进方向。  
若落地，可能成为未来版本中“性能改进”的关键基础设施之一。

#### 5) HTTP 服务端参数绑定
- PR: #19601
- 链接：databendlabs/databend PR #19601

虽然当前为 closed，但该方向符合数据库 API 化趋势。  
后续值得观察是否以其他形式重新提交或拆分落地。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 摘要，可提炼出以下真实用户痛点：

### 1) 用户需要更强的 SQL 幂等性与迁移兼容性
- 代表：#19611 / #19613
- 链接：
  - databendlabs/databend Issue #19611
  - databendlabs/databend Issue #19613

用户在执行 schema 演进时，期望 `ADD COLUMN IF NOT EXISTS` 能像主流数据库一样工作。  
这说明 Databend 已被用于：
- 自动化 DDL 部署
- 迁移脚本复用
- 多环境同步发布流程

### 2) 用户不仅关心“报错”，更关心“报对错”
- 代表：#19612
- 链接：databendlabs/databend Issue #19612

错误码误命名会直接影响：
- 一线排障效率
- 平台告警分类
- 用户对系统稳定性的判断

这反映 Databend 用户群体中已有相当一部分进入了 **生产运维阶段**。

### 3) 复杂分析 SQL 的边界行为仍是重点打磨区
相关 PR：
- #19607, #19616, #19603, #19602, #19595, #19594
- 链接：
  - databendlabs/databend PR #19607
  - databendlabs/databend PR #19616
  - databendlabs/databend PR #19603
  - databendlabs/databend PR #19602
  - databendlabs/databend PR #19595
  - databendlabs/databend PR #19594

用户实际场景已经覆盖：
- 相关子查询
- FULL OUTER JOIN / NATURAL / USING
- ASOF JOIN
- LIKE ESCAPE
- GROUPING()

这说明 Databend 正被用于更复杂、更接近企业分析负载的 SQL 工作负载，而不只是简单查询。

---

## 8. 待处理积压

### 1) 实验性 table branch 仍在推进，值得维护者重点关注
- PR: #19551
- 创建：2026-03-15
- 链接：databendlabs/databend PR #19551

该 PR 已存在多日且仍未收敛。由于其潜在影响面大，建议维护者：
- 明确设计边界
- 提供更具体测试/文档
- 评估是否拆分为更小 PR 以加快评审

### 2) Partitioned Hash Join 属于高价值但高复杂度改造
- PR: #19553
- 创建：2026-03-16
- 链接：databendlabs/databend PR #19553

该类 refactor 对执行引擎影响深，容易因 review 成本高而拖延。  
建议：
- 增加 benchmark 数据
- 明确 spill / memory / skew 场景预期
- 尽量拆分执行框架改动与行为改动

### 3) 大量 `agent-approved` bugfix PR 同时排队，需注意合并节奏
典型包括：
- #19616, #19615, #19614, #19608, #19607, #19606, #19604, #19605, #19603, #19602, #19595, #19594, #19591
- 链接：对应各 PR

这说明当前修复吞吐量很高，但也意味着：
- 回归风险叠加
- planner / parser / join 层存在集中变更
- 需要更严格的集成测试与发布前验证

---

## 附：今日重点链接汇总

- Issue #19612: Rename ErrorCode::PanicError to reduce confusion and fix misuse  
  链接：databendlabs/databend Issue #19612
- Issue #19611: bug: ALTER TABLE ADD COLUMN should support IF NOT EXISTS  
  链接：databendlabs/databend Issue #19611
- Issue #19613: ALTER TABLE ... ADD COLUMN should support IF NOT EXISTS syntax  
  链接：databendlabs/databend Issue #19613

- PR #19615: support IF NOT EXISTS for ALTER TABLE ADD COLUMN  
  链接：databendlabs/databend PR #19615
- PR #19614: rename PanicError and fix executor OOM mapping  
  链接：databendlabs/databend PR #19614
- PR #19616: align full outer USING nullability  
  链接：databendlabs/databend PR #19616
- PR #19591: avoid overflow in Scan::derive_stats  
  链接：databendlabs/databend PR #19591
- PR #19607: handle correlated subqueries over union  
  链接：databendlabs/databend PR #19607
- PR #19608: treat X'...' as binary literal  
  链接：databendlabs/databend PR #19608
- PR #19619: enable TCP_NODELAY on gRPC listener sockets  
  链接：databendlabs/databend PR #19619
- PR #19551: support experimental table branch  
  链接：databendlabs/databend PR #19551
- PR #19553: support partitioned hash join  
  链接：databendlabs/databend PR #19553
- PR #19601: add server-side parameter binding to /v1/query  
  链接：databendlabs/databend PR #19601
- PR #19597: avoid planner panic for invalid LIKE ESCAPE literals  
  链接：databendlabs/databend PR #19597

如果你愿意，我还可以继续把这份日报再整理成：
1. **适合飞书/Slack 发布的短版摘要**，或  
2. **面向技术负责人看的“风险与路线图版”周报格式**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时内，Velox 社区保持**高活跃度**：Issues 更新 6 条、PR 更新 50 条，但**无新版本发布**。  
从变更结构看，今日工作重心集中在三类方向：**执行引擎稳定性修复**、**cuDF/GPU 能力补齐**、以及**remote function / 构建分析基础设施**的持续推进。  
已合并/关闭的 PR 有 16 条，说明维护者在持续清理存量改动，但其中不少是 stale 关闭，新增功能真正落地的比例不算特别高。  
健康度方面，项目整体仍然稳健，但 **Window Fuzzer 连续暴露出参考查询失败和 SIGSEGV 崩溃**，说明在 fuzzing 和查询正确性链路上仍有需要优先收敛的稳定性风险。  

---

## 3. 项目进展

### 3.1 今日已合并/关闭的重要 PR

#### 1) HashProbe 过滤路径健壮性修复已合并
- **PR**: #16868 `fix: Skip filter evaluation in HashProbe when no rows are selected`
- **状态**: 已合并
- **链接**: https://github.com/facebookincubator/velox/pull/16868

**影响分析：**  
该修复针对 HashProbe 在 `ANTI JOIN` 且过滤条件引用 probe-side join key 时触发的 debug-only sanity check / crash 问题。核心改进是：**当没有行被选中时，跳过 filter evaluation**，避免 `DictionaryVector::validate` 相关崩溃。  
这类修复直接提升了 **JOIN 执行路径的健壮性**，尤其是复杂过滤条件与 probe 侧 key 交织时的正确性和稳定性。

---

#### 2) Lazy probe 输入预加载修复已合并
- **PR**: #16774 `fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop`
- **状态**: 已合并
- **链接**: https://github.com/facebookincubator/velox/pull/16774

**影响分析：**  
该修复将 lazy loading 从主循环中的分散触发，调整为进入 probe 主循环前的一次性预加载，并在此之前通过 `ReclaimableSectionGuard` 给 arbitrator 释放内存机会。  
这属于典型的 **执行引擎内存管理 / 资源回收时序优化**，有助于降低在内存紧张条件下的 probe 阶段失败概率，也能减少非可回收区间里出现不可预测加载行为的风险。

---

### 3.2 今日关闭但未落地、值得关注的改动

#### 3) OR-ed bigint 单值范围合并修复被关闭
- **PR**: #15738 `fix: Allow merging OR-ed bigint single value ranges`
- **状态**: 已关闭
- **链接**: https://github.com/facebookincubator/velox/pull/15738

**意义：**  
该 PR 旨在修复 `(id = 100 OR id = 200 OR id = 300)` 这类谓词在 filter 合并后退化成不可评估 `MultiRange` 的问题。虽然本次未合入，但它反映出 **谓词下推 / filter canonicalization** 仍存在边界行为待处理，关系到查询正确性与优化效果。

---

#### 4) AsyncDataCache 观测性增强 PR 被关闭
- **PR**: #15430 `feat: Report number of lookups to the AsyncDataCache`
- **状态**: 已关闭
- **链接**: https://github.com/facebookincubator/velox/pull/15430

**意义：**  
该改动希望补齐 AsyncDataCache lookup 次数指标，以改善缓存命中分析。虽然未合入，但它揭示出社区对 **缓存可观测性和性能诊断能力** 的持续需求。

---

#### 5) TextWriter 压缩支持 PR 被关闭
- **PR**: #14677 `feat: Support compression for TextWriter`
- **状态**: 已关闭
- **链接**: https://github.com/facebookincubator/velox/pull/14677

**意义：**  
该 PR 计划为 TextWriter 增加 ZSTD/GZIP/DEFLATE 支持。虽然当前关闭，但从分析型存储与导出链路角度看，这类能力仍具实用价值，特别是日志、文本交换格式和轻量批量导出场景。

---

## 4. 社区热点

### 热点 1：S2 Presto UDFs 持续推进，SQL 地理空间能力增强
- **PR**: #15511 `feat: s2 presto UDFs`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/pull/15511

**看点：**  
该 PR 增加 S2 cell 相关 Presto UDF，包括 parent cell 获取与 surface area 计算。这是明显的 **SQL 函数生态扩展**，面向地理空间分析场景。  
**技术诉求：** 社区希望 Velox 不只是执行层，更能承载更丰富的分析函数，尤其是与 Presto 生态兼容的函数集合。

---

### 热点 2：FBThrift 替代 Apache Thrift 的长期演进
- **PR**: #16019 `build: Use FBThrift instead of Apache Thrift`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/pull/16019

**看点：**  
这是一个影响面较大的基础设施改造，目标是移除部分外部 Thrift 依赖，尤其关联 Parquet 相关能力。  
**技术诉求：** 降低外部依赖复杂度、统一 Meta 内外生态，同时改善构建一致性。但也意味着潜在 API 不兼容和迁移成本，因此推进会较谨慎。

---

### 热点 3：cuDF 后端性能优化持续进行
- **PR**: #16620 `fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/pull/16620

**看点：**  
该 PR 目标明确：减少 device-to-host copy 与 stream sync 次数，优化 `CudfToVelox` batching。  
**技术诉求：** 社区不再满足于“GPU 可运行”，而是进入 **GPU 路径性能工程** 阶段，关注跨设备同步、batch 切分成本和端到端吞吐。

---

### 热点 4：构建影响分析成为工程效率方向的新焦点
- **Issue**: #16922 `Track header files in CMake targets for build impact analysis`
- **链接**: https://github.com/facebookincubator/velox/issues/16922  
- **PR**: #16827 `build: Add build impact analysis workflow for PRs`
- **链接**: https://github.com/facebookincubator/velox/pull/16827

**看点：**  
Issue 与 PR 形成呼应：已有 PR 为 PR 变更建立受影响 target 分析，但当前仍缺少 header 到 target 的可靠映射。  
**技术诉求：** 这说明 Velox 代码规模增长后，社区开始系统性治理 **CI 成本、增量构建分析、变更影响追踪**，这是成熟工程项目的典型信号。

---

### 热点 5：Remote functions 正从原型走向可用化
- **PR**: #16928 `feat(remote): Serialize only active rows, add null/determinism support, improve errors`
- **链接**: https://github.com/facebookincubator/velox/pull/16928  
- **PR**: #16903 `fix(remote): Use VELOX_USER_FAIL for remote error re-throwing`
- **链接**: https://github.com/facebookincubator/velox/pull/16903  
- **PR**: #16904 `docs(remote): Add developer guide and design document for remote functions`
- **链接**: https://github.com/facebookincubator/velox/pull/16904

**看点：**  
这组 PR 共同指向 remote function framework 的可落地化：  
- 只序列化 active rows，降低网络与服务端负担  
- 修正错误类型，保证 `TRY()` 等上层逻辑能正确分类错误  
- 补齐开发文档与设计文档  

**技术诉求：** 远程函数已经从“功能可跑”向“性能、错误语义、开发体验”全面推进，意味着它很可能进入下一阶段重点建设名单。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0：Window Fuzzer 触发 SIGSEGV 崩溃
- **Issue**: #16918 `[fuzzer] Window Fuzzer crashes with SIGSEGV (null pointer dereference)`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/issues/16918

**问题描述：**  
Window Fuzzer 在运行早期即发生空指针解引用，出现 SIGSEGV。  
**影响：**  
这是当前最严重的稳定性问题，因为它属于 **进程级崩溃**，且由 fuzzer 触发，意味着可能存在尚未被生产流量覆盖到的深层窗口算子或执行计划边界缺陷。  
**是否已有 fix PR：** 暂未看到直接对应修复 PR。  

---

### P1：Window Fuzzer 验证率低于 50%，CI 间歇性失败
- **Issue**: #16917 `[flaky-test] Flaky Window Fuzzer: verification rate drops below 50% due to Presto reference query failures`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/issues/16917

**问题描述：**  
Window Fuzzer 的 CI job 间歇性失败，根因是参考查询失败导致 verified iterations 比例低于阈值。  
**影响：**  
这不是直接 crash，但会显著降低 **CI 信噪比**，拖慢开发效率，并可能掩盖真实回归。  
**是否已有 fix PR：** 暂未看到直接 fix。  
**研判：**  
如果参考引擎是 Presto，则问题可能既涉及 Velox 生成用例分布，也可能涉及 reference query 容错策略或验证阈值设计。

---

### P1：cuDF 路径存在算子缺口，TPC-DS 多查询回退 CPU
- **Issue**: #15772 `[enhancement] [cuDF] Expand GPU operator support for Presto TPC-DS`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/issues/15772

**问题描述：**  
在单 worker、开启 cuDF backend 和 CPU fallback 的 Presto TPC-DS SF100 运行中，部分查询因 Driver Adapter 缺少 cuDF operator 而回退 CPU。  
**影响：**  
这是 **GPU 执行完整性问题**，虽不一定影响正确性，但直接影响 GPU 加速收益与端到端性能稳定性。  
**是否已有关联修复：** 有局部补齐动作，见 #16888。  

---

### P2：EnforceSingleRow 缺少 GPU 支持
- **Issue**: #16888 `[enhancement, cudf] Add GPU support for EnforceSingleRow operator`
- **状态**: Open
- **链接**: https://github.com/facebookincubator/velox/issues/16888

**问题描述：**  
`EnforceSingleRow` 当前没有 GPU 实现，在 TPC-DS SF100 中出现 26 次，导致回退 CPU。  
**影响：**  
属于 #15772 的具体拆解项。对 GPU 查询计划连续性有实际影响。  
**是否已有 fix PR：** 尚未看到直接 PR。  

---

### P2：HashProbe 路径崩溃已获得修复
- **PR**: #16868
- **状态**: Merged
- **链接**: https://github.com/facebookincubator/velox/pull/16868

**结论：**  
这是今天稳定性面最明确的正向进展，说明维护者对执行引擎 correctness bug 的修复速度仍然较快。

---

## 6. 功能请求与路线图信号

### 6.1 GPU operator coverage 仍是明确路线图方向
- **Issue**: #15772
- **链接**: https://github.com/facebookincubator/velox/issues/15772
- **Issue**: #16888
- **链接**: https://github.com/facebookincubator/velox/issues/16888
- **PR**: #16620
- **链接**: https://github.com/facebookincubator/velox/pull/16620
- **PR**: #16864 `fix(cudf): Remove usage of cudf::detail::gather function`
- **链接**: https://github.com/facebookincubator/velox/pull/16864

**判断：**  
从 issue 跟踪、性能优化、API 适配修复三条线同时存在来看，**cuDF / GPU 路径大概率会继续成为下一版本的重要投入方向**。  
重点不仅是“支持更多算子”，还包括性能细节和上游 cuDF API 兼容性维护。

---

### 6.2 Remote functions 正在快速成型
- **PR**: #16928
- **链接**: https://github.com/facebookincubator/velox/pull/16928
- **PR**: #16903
- **链接**: https://github.com/facebookincubator/velox/pull/16903
- **PR**: #16904
- **链接**: https://github.com/facebookincubator/velox/pull/16904

**判断：**  
这组连续 PR 涵盖性能、错误处理、文档，说明 remote functions 不再是孤立实验特性，而是在往 **可集成、可调试、可维护** 的正式能力演进。  
如果近期继续看到测试、协议稳定化或 connector 结合改动，它很可能进入后续版本亮点。

---

### 6.3 SQL/表达式层能力继续扩展
- **PR**: #16927 `feat: Add ConcatExpr to IExpr hierarchy`
- **链接**: https://github.com/facebookincubator/velox/pull/16927
- **PR**: #16821 `refactor: Propagate CastRule cost through canCoerce`
- **链接**: https://github.com/facebookincubator/velox/pull/16821
- **PR**: #15511 `feat: s2 presto UDFs`
- **链接**: https://github.com/facebookincubator/velox/pull/15511

**判断：**  
Velox 在 unresolved expression tree、类型强转成本传播、Presto UDF 补齐等方向持续前进，释放出明显信号：  
**SQL 兼容性和表达式语义精细化** 仍是核心主线，尤其围绕 Presto 方言兼容。

---

### 6.4 工程效率与 CI 成本控制成为新兴方向
- **Issue**: #16922
- **链接**: https://github.com/facebookincubator/velox/issues/16922
- **PR**: #16827
- **链接**: https://github.com/facebookincubator/velox/pull/16827

**判断：**  
构建影响分析通常不会在早期项目中优先出现。现在被单独立项，说明 Velox 已进入 **规模化工程治理阶段**。这对外部贡献者也很关键，未来可能改善 CI 等待时间和 review 反馈效率。

---

## 7. 用户反馈摘要

### 1) GPU 用户的核心痛点是“能跑但不够全”
- **来源**: #15772, #16888
- **链接**:  
  - https://github.com/facebookincubator/velox/issues/15772  
  - https://github.com/facebookincubator/velox/issues/16888

**提炼：**  
用户已经在真实 TPC-DS 基准下使用 cuDF backend，不满足于 demo 级支持，而是要求 **查询计划尽量不回退 CPU**。  
这说明 Velox 的 GPU 方向已有实际使用者，但他们最关注的是 **算子覆盖率和执行连续性**，而不仅是理论支持。

---

### 2) Fuzzer/CI 使用者的痛点是“失败噪音过大”
- **来源**: #16917, #16918
- **链接**:  
  - https://github.com/facebookincubator/velox/issues/16917  
  - https://github.com/facebookincubator/velox/issues/16918

**提炼：**  
测试使用者最直接的诉求是：  
- reference query 不稳定不要误伤 CI  
- 遇到问题时不要直接 segfault  
- 失败应尽可能可诊断、可复现  

这反映出社区对 **测试基础设施可信度** 的要求很高。

---

### 3) 大型代码库开发者希望更清楚“改一个头文件影响谁”
- **来源**: #16922
- **链接**: https://github.com/facebookincubator/velox/issues/16922

**提炼：**  
该诉求非常工程化，说明有用户/贡献者已经遭遇 **构建影响不可见、增量编译不透明、CI 成本高** 的问题。  
这通常来自重度开发场景，而不是偶发贡献者。

---

### 4) 云存储用户关注 ABFS 连接复用与对象创建成本
- **来源**: #16921
- **链接**: https://github.com/facebookincubator/velox/issues/16921

**提炼：**  
Azure ABFS 用户指出每次打开文件都创建 BlobClient / DataLakeFileClient，导致 `HttpPipeline` 分配开销。  
这类反馈说明 Velox 已被用于 **高频文件打开、云对象存储访问密集** 的场景，性能瓶颈已深入到 SDK client 生命周期管理层。

---

## 8. 待处理积压

以下是建议维护者重点关注的长期未决项：

### 1) S2 Presto UDFs 长期开启
- **PR**: #15511
- **创建时间**: 2025-11-15
- **链接**: https://github.com/facebookincubator/velox/pull/15511

**提醒：**  
该 PR 已存续较久，但主题明确、价值清晰。如果设计方向认可，建议尽快给出合并路径或拆分建议，避免 SQL 功能扩展长期悬置。

---

### 2) FBThrift 替代 Apache Thrift 仍未收敛
- **PR**: #16019
- **创建时间**: 2026-01-14
- **链接**: https://github.com/facebookincubator/velox/pull/16019

**提醒：**  
这是基础设施级改动，长期悬而未决会增加后续 rebase 和依赖维护成本。建议维护者明确：  
- 是否分阶段合并  
- 哪些模块优先迁移  
- 哪些兼容性问题是 blocker  

---

### 3) EncodedVectorCopy 对 FlatMapVector 的支持仍在推进中
- **PR**: #16161
- **创建时间**: 2026-01-29
- **链接**: https://github.com/facebookincubator/velox/pull/16161

**提醒：**  
该改动与复杂向量复制能力相关，影响面较底层。建议尽快明确剩余依赖项，避免 vector 基础能力长期半完成状态。

---

### 4) cuDF 输出 batching 性能优化 PR 仍待决
- **PR**: #16620
- **创建时间**: 2026-03-04
- **链接**: https://github.com/facebookincubator/velox/pull/16620

**提醒：**  
这是 GPU 性能路径上的实质优化，且与当前 GPU operator coverage 议题强相关。若 GPU 是近期重点方向，该 PR 值得提高优先级。

---

### 5) Window Fuzzer 两个新问题应快速分诊
- **Issues**: #16917, #16918
- **链接**:  
  - https://github.com/facebookincubator/velox/issues/16917  
  - https://github.com/facebookincubator/velox/issues/16918

**提醒：**  
虽然不是“长期积压”，但由于一个是 CI flaky、一个是 crash，建议维护者在未来 1-2 天内明确 owner 和修复计划，否则会持续侵蚀开发效率与稳定性信心。

---

## 总结

Velox 今日表现出**高工程活跃度与持续演进能力**：执行引擎修复有实质落地，GPU、remote functions、SQL 表达式和 CI 工程治理都在同步推进。  
不过，稳定性面上 **Window Fuzzer 的 crash 与 flaky 问题** 是当前最需优先收敛的风险；而产品化面上，**cuDF operator coverage 与云存储访问性能** 则是用户真实诉求最集中的方向。  
整体来看，项目健康度良好，但正处于从“功能扩展”走向“稳定性和工程效率并重”的阶段。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：Issues 更新 12 条、PR 更新 15 条，整体以 **Velox 后端、Spark 4.x 兼容性、GPU/存储配置治理** 为主线。  
从关闭/合并情况看，项目当天完成了若干清理类与稳定性类改动，但核心能力建设仍主要集中在待合并 PR 上，说明当前处于 **功能推进与问题收敛并行** 的阶段。  
路线图层面，2024/2025 Roadmap 已关闭，新的 **2026 Roadmap** 已开启，显示社区已从阶段性总结转向新年度能力规划。  
稳定性方面，当天新增问题主要集中在 **Spark 4.1 CSV flaky test、GPU/CPU 混合集群行为、序列化异常**，其中 GPU 相关问题已出现对应修复 PR，响应速度较快。  
总体评估：**活跃度高，健康度良好，但 Spark 4.x 兼容性与混合部署稳定性仍是当前核心风险点。**

---

## 2. 项目进展

### 今日已关闭/合并的重要 PR

#### 2.1 清理无用 companion object，降低核心模块维护负担
- PR: #11822 `[CORE] Remove empty companion objects`
- 状态: Closed
- 链接: apache/gluten PR #11822

该 PR 删除 gluten-core 中 3 个无引用的空 companion object，属于小型代码治理改动。虽然不直接带来查询功能提升，但有助于降低代码噪音、减少后续重构与静态检查成本，体现出核心模块持续做“技术债清理”。

---

#### 2.2 跟进 Velox 上游日更，保持执行引擎同步
- PR: #11817 `[GLUTEN-6887][VL] Daily Update Velox Version (2026_03_24)`
- 状态: Closed
- 链接: apache/gluten PR #11817

该 PR 用于同步上游 Velox 最新提交，摘要中可见包含构建修复、类型处理修复等内容。  
这类日更 PR 对 Gluten 尤其关键，因为其 Velox 后端能力、行为一致性和 bug 修复很大程度依赖上游演进。即便当天未见“功能型合并”，这种同步动作仍直接影响：
- 查询执行稳定性
- 类型系统兼容性
- 构建/部署成功率

---

#### 2.3 ClickHouse 路径修复 skipped batches 资源释放问题
- PR: #11818 `[CH] Close ColumnarBatch in CHColumnarCollectLimitExec for skipped batches`
- 状态: Closed
- 链接: apache/gluten PR #11818

该 PR 针对 ClickHouse 后端在 `CollectLimitExec` 场景下跳过 batch 时未及时关闭 `ColumnarBatch` 的问题进行处理。  
这属于典型的 **资源管理/内存泄漏防护修复**，虽然影响范围可能局部，但对分析型执行引擎来说非常重要，尤其在：
- limit 查询频繁出现
- 长时间运行作业
- 高并发批处理场景  
下，资源释放不及时可能放大为内存压力或 executor 稳定性问题。

---

#### 2.4 移除 RAS，简化配置体系
- PR: #11756 `[GLUTEN-11578][CORE] Remove RAS`
- 状态: Closed
- 链接: apache/gluten PR #11756

该 PR 是当天最值得关注的关闭项之一。其摘要明确指出存在 **Breaking Change**：
- `spark.gluten.ras.costModel` 重命名为 `spark.gluten.costModel`

这表明项目正在收敛或简化原有 RAS 相关机制与配置体系。对用户而言，这不是新功能扩展，而是 **配置语义统一与技术债出清**。  
若用户依赖旧参数进行成本模型相关调优，需要在升级时完成配置迁移，否则可能出现行为不符合预期的问题。

---

## 3. 社区热点

### 3.1 2025 Roadmap 关闭，2026 Roadmap 开启
- Issue: #8226 `[enhancement] Gluten 2025 Roadmap`
- 状态: Closed
- 评论: 23 / 👍 34
- 链接: apache/gluten Issue #8226

- Issue: #11827 `[enhancement] Gluten 2026 Roadmap`
- 状态: Open
- 链接: apache/gluten Issue #11827

这是今天最强的项目级信号。2025 Roadmap 关闭意味着社区已完成阶段性收口，转向 2026 年度规划。  
从 Gluten 历史推进节奏看，路线图通常反映以下优先级：
- Spark 新版本适配
- Velox 后端功能覆盖
- 数据湖/存储格式能力补齐
- 兼容性与性能协同优化

技术诉求上，这说明社区当前不只是在“修 bug”，而是在重新定义未来一年要补齐的执行引擎与生态能力边界。

---

### 3.2 Velox 上游未合并 PR 跟踪持续活跃
- Issue: #11585 `[enhancement, tracker] [VL] useful Velox PRs not merged into upstream`
- 状态: Open
- 评论: 16
- 链接: apache/gluten Issue #11585

这条 tracker 很能体现 Gluten 的工程现实：项目大量能力建立在 Velox 之上，但部分关键改动尚未被上游正式接纳。  
背后的技术诉求包括：
- 降低维护自定义 patch 的 rebase 成本
- 尽快让社区贡献进入上游主线
- 避免功能依赖“私有分支”或长期 patch carry

这也是判断 Gluten Velox 路径成熟度的重要指标：越多关键能力停留在“未 upstream”的状态，后续版本维护成本越高。

---

### 3.3 Iceberg 配置映射需求升温
- Issue: #11703 `Map iceberg configuration with Velox configuration`
- 状态: Open
- 评论: 3
- 链接: apache/gluten Issue #11703

- 对应 PR: #11776 `Added iceberg write configs`
- 状态: Open
- 链接: apache/gluten PR #11776

这是当天最清晰的“需求-实现联动”案例。Issue 提出希望把 Iceberg 写入配置与 Velox 配置打通，PR 已直接跟进。  
这说明社区对 Gluten 的期待已经不止于“能跑 SQL”，而是进入到：
- 数据湖写入参数对齐
- 文件大小、压缩编码、row group 等写路径调优
- 引擎配置与表格式配置一致性

换言之，Gluten 正在向更完整的数据湖执行层角色靠拢。

---

## 4. Bug 与稳定性

以下按严重程度与潜在影响排序：

### P1：GPU 代码在 CPU 节点误执行，影响混合集群可用性
- Issue: #11828 `[bug, triage] [VL] GPU code shouldn't be running on CPU node when cudf is enabled`
- 状态: Open
- 链接: apache/gluten Issue #11828

**现象**：当设置 `spark.gluten.sql.columnar.cudf=true` 时，在 GPU/CPU 混合集群中，CPU 节点也会进入 GPU 路径并失败。  
**影响**：
- 混合资源集群部署不可用
- GPU 配置无法安全地全局下发
- 容易导致作业在非 GPU 节点异常退出

**已有 fix PR**：
- PR: #11830 `[GLUTEN-11828][VL] Use immutable gpu config and add cuda runtime detection`
- 状态: Open
- 链接: apache/gluten PR #11830

这是当天最重要的稳定性问题之一，也是响应最快的问题之一。修复方向“immutable gpu config + cuda runtime detection”较合理，说明团队准备从运行时检测层避免误入 GPU 路径。

---

### P1：序列化路径抛 UnsupportedOperationException，可能影响 collect/orderBy/tail 等结果回收链路
- Issue: #11819 `UnsupportedOperationException in ColumnarBatchSerializerInstanceImpl.serializeStream`
- 状态: Open
- 链接: apache/gluten Issue #11819

**复现代码**：
`spark.range(...).orderBy("id").tail(5)`

**风险判断**：
- 涉及 `serializeStream`，说明问题出现在列式批序列化链路
- 可能影响 driver 端结果提取、collect 类动作、排序后尾部读取等典型操作
- 若是通用序列化缺口，影响面可能高于单一算子 bug

**当前状态**：未见直接关联修复 PR。  
建议维护者优先确认：
1. 是否仅在 Velox 后端触发  
2. 是否仅限 tail/collect limit 类场景  
3. 是否与 Spark 4.x 序列化协议或 ColumnarBatch 回传逻辑有关

---

### P2：Spark 4.1 上 CSV 测试 flaky，暴露文件读取错误码/异常一致性问题
- Issue: #11825 `[bug, triage] [VL] Flaky test on CSV on Spark-4.1`
- 状态: Open
- 链接: apache/gluten Issue #11825

**现象**：ZSTD 压缩 CSV 在 `ignoreCorruptFiles` 相关测试中表现不稳定，异常码与预期不一致。  
**影响**：
- CI 稳定性下降
- Spark 4.1 文件格式兼容性仍在磨合
- 可能存在异常映射不一致或边界行为差异

这是典型的兼容性回归信号。考虑到 Gluten 正在推进 Spark 4.0/4.1 测试恢复，这类 flaky 问题值得优先治理，否则容易阻塞更大规模兼容性开启。

---

### P2：ClickHouse 路径 skipped batch 资源释放问题已关闭
- Issue/PR 关联: #11818
- 状态: Closed
- 链接: apache/gluten PR #11818

虽然不是当天新报 bug，但作为已关闭的稳定性修复，值得记录为当天的正向进展：ClickHouse 后端内存/资源管理更稳健。

---

## 5. 功能请求与路线图信号

### 5.1 `collect_set` 支持 ignoreNulls
- Issue: #11826 `[enhancement] [VL] Enable collect_set ignoreNulls`
- 状态: Open
- 链接: apache/gluten Issue #11826

该需求直接跟进 Velox 上游变更，属于 **SQL 函数语义对齐**。  
技术意义在于：
- 提升与 Spark 语义一致性
- 减少聚合函数在空值处理上的 fallback
- 扩大 Velox 原生执行覆盖面

这类改动很可能被纳入后续版本，因为实现依赖已逐步具备，且收益明确。

---

### 5.2 Iceberg 写入配置与 Velox 配置映射
- Issue: #11703
- PR: #11776
- 链接: apache/gluten Issue #11703
- 链接: apache/gluten PR #11776

这是近期最有落地迹象的功能请求之一。由于已存在对应 PR，判断其进入下一版本的概率较高。  
一旦合入，受益场景包括：
- Iceberg 表写入参数统一
- 压缩/文件大小/row group 调优
- 数据湖写路径可控性提升

---

### 5.3 Partial Project UDF optimization
- Issue: #11783 `Partial Project UDF optimization`
- 状态: Open
- 链接: apache/gluten Issue #11783

该需求聚焦 UDF 与列转行/ArrowColumnarRow 的转换成本，目标是优化 partial project 场景下的执行效率。  
这类问题通常对应：
- 列式与行式边界开销
- Spark fallback 或 UDF 混部场景性能损失
- 宽表/窄投影下的不同收益曲线

若后续有 PR 跟进，可能带来较有感知的 CPU 与内存效率提升。

---

### 5.4 预取 split 调度优化
- Issue: #11821 `[VL] pick split with most data prefetched`
- 状态: Open
- 链接: apache/gluten Issue #11821

这个需求很有“执行引擎味道”：当前 Velox 选取第一个 `KPrepared` split，而不是“预取数据最多”的 split，可能导致本可立即消费的数据被闲置，线程反而等待较慢 split。  
若实现，将可能改善：
- I/O 与计算重叠效率
- 扫描吞吐
- 延迟波动

这是偏底层执行调度优化，虽然用户不可见，但对大规模扫描作业可能很有价值。

---

## 6. 用户反馈摘要

基于当天 Issues 摘要与上下文，可以提炼出以下真实用户痛点：

### 6.1 Spark 4.x 兼容性仍是用户最敏感的问题
- 相关: #11825, #11816, #11720, #11656, #11719
- 链接: apache/gluten Issue #11825
- 链接: apache/gluten PR #11816
- 链接: apache/gluten PR #11720
- 链接: apache/gluten PR #11656
- 链接: apache/gluten PR #11719

无论是 CSV flaky、TimestampNTZ fallback、CurrentTimestamp/now 校验，还是 Parquet type widening，均反映用户正在尝试将 Gluten 用于 Spark 4.0/4.1 环境，并关注“能否不回退”“能否语义一致”“测试能否全开”。

---

### 6.2 混合集群部署需要更智能的硬件能力识别
- 相关: #11828, #11830
- 链接: apache/gluten Issue #11828
- 链接: apache/gluten PR #11830

用户不希望通过静态配置承担 GPU/CPU 混部风险，更希望框架具备运行时检测与自适应能力。  
这表明 Gluten 已不只是实验环境使用，而是在更复杂、更真实的异构集群环境中落地。

---

### 6.3 数据湖写入路径需要更细粒度控制
- 相关: #11703, #11776
- 链接: apache/gluten Issue #11703
- 链接: apache/gluten PR #11776

用户对 Iceberg 的关注不止于读取兼容，而是写入参数是否完整映射。这说明项目用户群正从“查询加速”扩展到“端到端数据湖作业加速”。

---

### 6.4 用户希望减少 fallback，扩大 Velox 原生覆盖面
- 相关: #11720, #11826
- 链接: apache/gluten PR #11720
- 链接: apache/gluten Issue #11826

无论是 TimestampNTZ 还是 `collect_set(ignoreNulls)`，本质诉求都是：  
**尽量让 Spark SQL 语义在 Velox 后端直接执行，而不是退回 Spark。**  
这也是 Gluten 长期竞争力的核心指标之一。

---

## 7. 待处理积压

### 7.1 全局 off-heap 内存路径重构 PR 长期未决
- PR: #11456 `[GLUTEN-11406][VL] Update global off-heap memory to reuse the execution memory allocation code path`
- 状态: Open, stale
- 创建: 2026-01-20
- 链接: apache/gluten PR #11456

这是值得维护者重点关注的老 PR。它涉及全局 off-heap 内存分配路径，属于核心运行时能力，不是边角改动。  
如果长期搁置，可能带来：
- 旧内存路径继续背负技术债
- 内存分配语义分叉
- 后续稳定性与性能优化难以统一

建议尽快明确：继续推进、拆分提交，还是关闭重开。

---

### 7.2 Spark 4.x 验证与测试恢复相关 PR 较多，需避免长期并行悬而未决
- PR: #11816 `Enable 30 disabled test suites for Spark 4.0/4.1`
- PR: #11720 `disable TimestampNTZ validation fallback`
- PR: #11656 `validation tests for CurrentTimestamp and now`
- PR: #11719 `Add Parquet type widening support`
- 链接: apache/gluten PR #11816
- 链接: apache/gluten PR #11720
- 链接: apache/gluten PR #11656
- 链接: apache/gluten PR #11719

这些 PR 共同指向 Spark 4.x 适配主线。若评审/合并节奏不够快，容易形成：
- 测试开关长期临时化
- 不同语义修复相互阻塞
- 版本发布前集中爆雷

建议维护者将其作为一个“兼容性收敛批次”统一推进。

---

### 7.3 上游 Velox 未合并 patch 跟踪仍然重要
- Issue: #11585
- 链接: apache/gluten Issue #11585

虽然不是传统意义上的“未响应积压”，但它代表了项目外部依赖风险。  
建议持续维护优先级清单，明确哪些 patch：
- 必须 upstream
- 可短期 vendoring
- 可由 Gluten 自身实现替代

---

## 8. 结论

今日 Apache Gluten 呈现出典型的 **高活跃、强工程推进、兼容性攻坚期** 特征。  
一方面，2026 Roadmap 开启、Iceberg 配置映射推进、Spark 4.x 测试与类型兼容持续补齐，显示项目仍在扩展能力边界；另一方面，GPU/CPU 混合集群行为、CSV flaky、序列化异常等问题也说明项目在真实复杂环境中的稳定性仍需进一步打磨。  
积极信号是：关键 bug 已出现快速响应，例如 #11828 很快就有对应 fix PR #11830；同时 ClickHouse 路径资源释放问题也已关闭。  
如果接下来 Spark 4.x 兼容性 PR 能加速合并，并尽快收敛长期未决的内存管理重构与上游 Velox patch 依赖，项目健康度还会继续提升。  

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合飞书/钉钉发送的简版晨报**
2. **适合公众号/周报风格的长版解读**
3. **Markdown 表格版（含风险等级和负责人视角）**

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-26）

## 1. 今日速览

过去 24 小时，Apache Arrow 保持较高活跃度：Issues 更新 50 条、PR 更新 26 条，但**无新版本发布**。  
从结构上看，今日活动高度集中在 **R 生态、Python 打包/兼容性、C++/Flight SQL ODBC 能力补齐、Parquet 能力增强** 四条主线。  
Issue 侧关闭量（33）明显高于新开/活跃量（17），说明维护团队正在持续清理历史积压，尤其是一批带 `stale-warning` 的 R/C++ 老问题被集中处理。  
PR 侧仍有 17 条待合并，说明开发推进积极，但也反映出部分重要特性——如 **R Azure Blob 文件系统支持、Flight SQL ODBC、Parquet Bloom Filter 写入/加密读取**——仍处在评审或打磨阶段。  
整体判断：**项目健康度良好，维护节奏稳定；短期重点偏向生态可用性与工程稳定性，中期路线继续向云存储接入、Flight SQL 连接能力和 Parquet 高级索引能力延展。**

---

## 2. 项目进展

> 今日无 release，以下聚焦已关闭/推进明显的 PR 与其技术意义。

### 2.1 已关闭/合入的重要 PR

#### ① 修复 archery 被 PyGithub 2.9 破坏的问题
- **PR**: #49597 `Pin PyGithub to < 2.9 to fix broken archery`
- **状态**: Closed
- **链接**: apache/arrow PR #49597

**影响分析**：  
这是典型的**开发工具链稳定性修复**。`archery` 是 Arrow 项目内部常用开发/发布辅助工具，PyGithub 上游版本变化导致工具链失效，会直接影响自动化维护、发布检查和工程协作效率。通过临时 pin 版本，团队优先恢复 CI / 开发流程可用性，属于“先止血、后根因修复”的标准工程策略。

---

#### ② 修复 R CI 因 fs 包更新引发的系统依赖缺失
- **PR**: #49594 `GH-49593: [R][CI] Add libuv-dev to CI jobs due to update to fs package`
- **状态**: Closed
- **链接**: apache/arrow PR #49594

**影响分析**：  
R 生态的构建依赖对系统包变化较敏感。`fs` 包不再内置 bundled `libuv` 后，Arrow 的 R CI 出现失败。该 PR 通过在 CI 中显式加入 `libuv-dev`，修复了**外部依赖升级导致的构建回归**。  
这类修复虽然不直接增加查询能力，但对 **R 包发布稳定性、CRAN 兼容性、贡献者体验** 非常关键。

---

#### ③ 清理 CMake 中 clang/infer 工具探测逻辑，缓解 macOS CI 波动
- **PR**: #49575 `GH-49563: [C++][CMake] Remove clang/infer tools detection`
- **状态**: Closed
- **链接**: apache/arrow PR #49575

**影响分析**：  
该变更是典型的**构建系统去脆弱化**。由于 GitHub macOS Runner 更新，工具路径解析发生变化，导致 CI 出现非代码原因失败。移除脆弱的工具自动探测逻辑，有助于减少平台环境漂移对 C++ 构建的影响。  
对于大型跨语言项目，这是提升交付可靠性的必要工作。

---

#### ④ Python 开发文档与安装行为修正
- **PR**: #49573 `GH-49572 : [Python][Docs] Remove editable section and consolidate the information`
- **状态**: Closed
- **链接**: apache/arrow PR #49573

- **PR**: #49571 `GH-49566: [Python] Skip header files when installing compiled Cython files and other Python release verification fixes`
- **状态**: Closed
- **链接**: apache/arrow PR #49571

**影响分析**：  
这两条 PR 共同反映出 Arrow Python 已进一步适配 `scikit-build-core` 新打包链路。  
其中 #49571 更偏工程修复，解决 editable install / nightly verification 相关问题；#49573 则同步清理文档，避免开发者沿用过时安装方式。  
这说明 Python 子项目当前重点之一是**构建与发布基础设施现代化**。

---

#### ⑤ R CRAN 验证相关临时 PR 完成阶段性工作
- **PR**: #49589 `WIP: [R] Verify CRAN release 23.0.1.2`
- **状态**: Closed
- **链接**: apache/arrow PR #49589

**影响分析**：  
虽然是 WIP 验证型 PR，不是功能交付，但结合 Issue #49587 与 PR #49592 看，Arrow R 团队正在集中推进 **23.0.1.2 的 CRAN patch release 准备**。  
这是一条强烈的版本运营信号：**R 子项目近期可能会有补丁版本动作**，尽管今天尚未正式发布。

---

## 3. 社区热点

### 3.1 R 表达式扩展能力：geoarrow-rs 与 Arrow R compute 体系如何对接
- **Issue**: #45438 `[R] creating arrow supported expressions`
- **状态**: Open
- **评论**: 15
- **链接**: apache/arrow Issue #45438

**热点原因**：  
这是今日评论最多的开放 Issue。问题核心不是简单 API 用法，而是：**如何让第三方 R 扩展（如 geoarrow-rs）能够生成 Arrow R 可识别、可下推、可组合的表达式**。  

**技术诉求分析**：  
- 用户希望将 Arrow R 的 dplyr/compute 表达式体系开放给外部扩展；
- 这关系到地理空间扩展、领域函数扩展、谓词下推和惰性执行；
- 本质上是 Arrow R **可扩展查询表达层** 的能力诉求。

这类需求对 OLAP/分析场景非常重要，因为它决定了 Arrow 是否能成为“执行底座 + 领域函数插件平台”。

---

### 3.2 Python compute 广播语义诉求增强
- **Issue**: #44544 `[Python] Enhance pyarrow.compute to Support Broadcasting Similar to numpy`
- **状态**: Open
- **评论**: 13
- **链接**: apache/arrow Issue #44544

**热点原因**：  
用户希望 `pyarrow.compute` 拥有类似 NumPy 的 broadcasting 语义，以便不同长度数组间进行更自然的标量/向量操作。

**技术诉求分析**：  
- 这是 Arrow compute API 向更“数组编程友好”方向演进的信号；
- 如果落地，将降低用户在 Arrow / NumPy / pandas 间切换的心智成本；
- 对表达式引擎、内核参数检查、标量扩展规则都会产生影响。  

从分析型引擎角度看，broadcasting 支持能增强**列式表达式计算的一致性与易用性**，但也会带来语义边界、性能实现和错误处理复杂度。

---

### 3.3 R 包构建与二进制兼容性问题持续受关注
- **Issue**: #40326 `[R] Package Error: ... undefined symbol ... JsonFileFormat`
- **状态**: Closed
- **评论**: 14
- **链接**: apache/arrow Issue #40326

**热点原因**：  
这是高评论的已关闭 Bug，涉及 `arrow.so` 动态链接缺失符号。  
这类问题通常出现在：
- 混合安装路径；
- 系统 Arrow 与 R 包绑定版本不一致；
- EasyBuild / HPC 环境中组件裁剪或 ABI 不匹配。

**技术诉求分析**：  
Arrow 在企业/HPC 场景下经常以“系统库 + 多语言绑定”形态部署，因此**ABI 稳定性、组件开关一致性、最小构建模式**是持续性热点。

---

### 3.4 R 侧 CRAN 发布准备成为当前最明确的短期运营主题
- **Issue**: #49587 `[R] CRAN packaging checklist for version 23.0.1.2`
- **状态**: Open
- **链接**: apache/arrow Issue #49587

**相关 PR**:
- #49592 `[R][CI] r-binary-packages crossbow job fails for CRAN patch releases`
- #49589 `[R] Verify CRAN release 23.0.1.2`
- #49594 `[R][CI] Add libuv-dev to CI jobs due to update to fs package`

**技术诉求分析**：  
这表明 Arrow R 维护者当前在做的是**补丁版发布前的合规/验证/CI 校正**，不是大规模新增功能。  
对于用户而言，这通常意味着近期会优先修正 **构建、发布、CRAN 检查、依赖兼容** 等实际安装体验问题。

---

## 4. Bug 与稳定性

以下按严重程度与影响范围排序。

### P1：Python CUDA nightly 失败，影响 GPU 集成稳定性
- **Issue**: #49437 `[Python][C++][GPU] Python Cuda jobs fail with 'cuda.bindings.driver.CUcontext' object has no attribute 'value'`
- **状态**: Open
- **链接**: apache/arrow Issue #49437

**现象**：  
CUDA Python nightly 作业在多个 Ubuntu + CUDA 版本组合上失败。

**影响**：  
- 影响 GPU 相关绑定与 CI 信心；
- 可能是上游 `cuda.bindings` API 变化造成的兼容性回归；
- 若未及时修复，可能阻碍 GPU 支持在后续版本中的可验证性。

**是否已有 fix PR**：  
- 当前数据中**未见直接 fix PR**。

---

### P1：archery 被 PyGithub 新版破坏，开发/自动化工具链回归
- **PR**: #49597 `Pin PyGithub to < 2.9 to fix broken archery`
- **状态**: Closed
- **链接**: apache/arrow PR #49597

**现象**：  
上游 PyGithub 2.9.0 破坏了 archery。

**影响**：  
- 直接影响开发和自动化脚本；
- 虽不影响最终查询结果，但会影响项目维护效率和发布流程。

**修复状态**：  
- **已有临时修复并关闭**，后续仍需根因适配。

---

### P2：R CI 因 fs 包变更失效
- **PR**: #49594
- **状态**: Closed
- **链接**: apache/arrow PR #49594

**现象**：  
外部 R 依赖升级导致 CI 失效。

**影响**：  
- 影响 R 包持续验证与补丁发布；
- 对终端用户的安装成功率有潜在影响。

**修复状态**：  
- **已修复**。

---

### P2：Python editable install / nightly verification 失败
- **PR**: #49571
- **状态**: Closed
- **链接**: apache/arrow PR #49571

**现象**：  
新打包后端下，本地导入和 nightly 校验流程出现问题。

**影响**：  
- 影响贡献者开发体验；
- 影响 Python 发布验证链路。

**修复状态**：  
- **已修复/关闭**。

---

### P2：R 动态库 undefined symbol 历史问题收敛
- **Issue**: #40326
- **状态**: Closed
- **链接**: apache/arrow Issue #40326

**影响**：  
这类问题往往说明多组件构建和运行时装配仍有复杂性，尤其在企业自建发行环境中。  
虽已关闭，但说明 Arrow 的**多语言绑定与原生库版本对齐**仍是高风险区域。

---

### P3：array.to_pandas 与 None-only string array 转换路径异常
- **PR**: #49247 `[Python] Fix array.to_pandas string type conversion for arrays with None`
- **状态**: Open
- **链接**: apache/arrow PR #49247

**影响**：  
- 影响 Arrow ↔ pandas 转换正确性；
- 对 pandas 3.0 兼容路径尤其关键。

**是否已有 fix PR**：  
- **有，PR 已在评审中**。

---

## 5. 功能请求与路线图信号

### 5.1 R 将补齐 Azure Blob 文件系统支持
- **PR**: #49553 `[R] Expose azure blob filesystem`
- **状态**: Open
- **链接**: apache/arrow PR #49553

**信号判断**：强  
Arrow C++ 和 pyarrow 已具备 Azure 支持，R 侧补齐是顺理成章的能力对齐。  
如果该 PR 合入，Arrow R 将在云对象存储接入层实现对 **AWS / GCS / Azure** 的更完整覆盖。  
这对数据湖接入、云原生分析工作流很关键，**很可能进入下一次 R 相关发布**。

---

### 5.2 Flight SQL ODBC 正在从 Windows 走向 Ubuntu/Linux
- **PR**: #49564 `[C++][FlightRPC] Add Ubuntu ODBC Support`
- **状态**: Open
- **链接**: apache/arrow PR #49564

- **PR**: #46099 `[C++] Arrow Flight SQL ODBC layer`
- **状态**: Open
- **链接**: apache/arrow PR #46099

- **PR**: #49585 `DRAFT: set up static build of ODBC FlightSQL driver`
- **状态**: Open
- **链接**: apache/arrow PR #49585

**信号判断**：很强  
这组 PR 构成了一条明确路线：  
- 先有 Flight SQL ODBC 驱动层；
- 再补 Linux/Ubuntu 支持；
- 再尝试静态构建与 CI 集成。

**意义**：  
这是 Arrow 在**标准 SQL 客户端接入能力**上的关键推进。  
一旦成熟，BI 工具、ODBC 客户端与 Flight SQL 服务的对接门槛将显著下降，对 Arrow 在分析引擎生态中的“连接器”地位非常重要。

---

### 5.3 PyArrow 正在增强 Parquet Bloom Filter 能力
- **PR**: #49377 `[Python][Parquet] Add ability to write Bloom filters from pyarrow`
- **状态**: Open
- **链接**: apache/arrow PR #49377

- **PR**: #49334 `[C++][Parquet] Support reading encrypted bloom filters`
- **状态**: Open
- **链接**: apache/arrow PR #49334

**信号判断**：很强  
Bloom Filter 是 Parquet 面向高选择性过滤场景的重要辅助索引能力。  
这两条 PR 分别覆盖：
- **写入 Bloom Filter**；
- **读取加密 Bloom Filter**。

这表明 Arrow 正在补齐 Parquet 高级能力链条，尤其面向：
- 更高效的谓词过滤；
- 与加密文件场景兼容；
- Python 用户对高级 Parquet 特性的可达性。

这类能力很可能先以“高级可选参数”形式进入下一版本，而非默认行为改变。

---

### 5.4 R dplyr 兼容性持续扩展
- **PR**: #49536 `[R] Implement dplyr recode_values(), replace_values(), and replace_when()`
- **状态**: Open
- **链接**: apache/arrow PR #49536

- **PR**: #49535 `[R] Implement dplyr's when_any() and when_all() helpers`
- **状态**: Open
- **链接**: apache/arrow PR #49535

**信号判断**：强  
Arrow R 正持续补齐 dplyr 新函数/辅助器绑定。  
这意味着维护团队仍将 **R 用户的 SQL-like 数据变换体验** 作为重点，目标是提高本地 dplyr 代码迁移到 Arrow Dataset/Acero 执行路径时的无缝程度。

---

### 5.5 Python compute 广播、其他 interval 类型支持仍偏中长期
- **Issue**: #44544 `Support Broadcasting Similar to numpy`
- **链接**: apache/arrow Issue #44544

- **Issue**: #29828 `[Python] Support other interval types`
- **链接**: apache/arrow Issue #29828

**信号判断**：中  
这类需求具备明显用户价值，但当前尚无对应推进 PR，且涉及 API 设计和跨语言一致性，短期落地概率低于上述云存储、ODBC、Parquet 增强项。

---

## 6. 用户反馈摘要

### 6.1 R 用户最痛的仍是“安装/构建/运行时环境一致性”
相关链接：
- apache/arrow Issue #40326
- apache/arrow Issue #39952
- apache/arrow PR #49594
- apache/arrow Issue #49587

**提炼**：  
用户并不只是抱怨“安装麻烦”，而是经常处在：
- CRAN / 本地源码 / 系统 libarrow 混装；
- macOS / EasyBuild / CI runner 差异；
- 最小构建选项与功能缺失之间的张力。

这说明 Arrow R 的最大真实门槛之一仍不是 API，而是**分发与环境稳定性**。

---

### 6.2 用户希望 Arrow 成为更完整的“惰性查询执行层”
相关链接：
- apache/arrow Issue #45438
- apache/arrow PR #49536
- apache/arrow PR #49535
- apache/arrow Issue #45645

**提炼**：  
R 用户不仅希望能读写 Parquet，而是希望：
- 使用 dplyr 风格表达复杂条件；
- 在不落内存的情况下处理大数据；
- 扩展自定义表达式；
- 获得与本地 dplyr 更接近的函数覆盖。

这体现了 Arrow 从“列式格式库”向“分析执行框架”角色的持续迁移。

---

### 6.3 Python 用户关注“与 NumPy/pandas 的语义对齐”
相关链接：
- apache/arrow Issue #44544
- apache/arrow PR #49247
- apache/arrow PR #49571

**提炼**：  
Python 用户的核心诉求不是新增一个独立生态，而是让 pyarrow 在：
- 广播规则；
- pandas dtype 转换；
- 新打包后端安装体验

上尽量与主流 Python 数据栈协同一致。  
这反映出 Arrow 在 Python 世界的竞争力越来越取决于**互操作性细节**。

---

### 6.4 企业接入场景对标准连接器能力需求增强
相关链接：
- apache/arrow PR #46099
- apache/arrow PR #49564
- apache/arrow PR #49585

**提炼**：  
ODBC/Flight SQL 相关 PR 集中出现，表明用户不仅要 Arrow 文件与内存格式，还希望它成为可被 BI / SQL 客户端直接消费的**数据服务接口层**。  
这对 Arrow 在 OLAP 基础设施中的角色提升是积极信号。

---

## 7. 待处理积压

以下是值得维护者额外关注的长期开放项：

### 7.1 C++ ExecuteScalarExpression 性能优化长期悬而未决
- **Issue**: #31546 `[C++] Improve performance of ExecuteScalarExpression`
- **状态**: Open
- **链接**: apache/arrow Issue #31546

**为什么重要**：  
这是执行引擎核心路径问题，直接关系小批次处理、流式执行和 CPU cache 友好性。  
对于 OLAP/表达式执行性能，这比单一 API 增补更具基础性。

---

### 7.2 线程池线程命名仍无 champion
- **Issue**: #30775 `[C++] Name the threads in thread pools`
- **状态**: Open / needs champion
- **链接**: apache/arrow Issue #30775

**为什么重要**：  
虽非用户功能，但对并发调试、性能分析、生产诊断非常有价值。  
尤其在 Flight、异步 I/O、Dataset 扫描等复杂线程模型中，线程可观测性是生产级体验的重要组成部分。

---

### 7.3 IPC Stream Reader 对额外字段缺少严格校验
- **Issue**: #31566 `[C++] IPC Stream Reader doesn't check if extra fields are present for RecordBatches`
- **状态**: Open
- **链接**: apache/arrow Issue #31566

**为什么重要**：  
这属于潜在的数据正确性/协议健壮性问题。  
如果 reader 容忍 schema 与 batch 字段不一致，可能埋下解析歧义或兼容性隐患。

---

### 7.4 Flight 数据分片传输能力长期待推动
- **Issue**: #34485 `[Format][FlightRPC] Transfer FlightData in pieces`
- **状态**: Open / needs champion
- **链接**: apache/arrow Issue #34485

**为什么重要**：  
该问题直指 gRPC 单消息大小限制，对大批量结果集传输尤其关键。  
若不解决，会限制 Flight 在超大批次、高吞吐分析传输场景中的适用性。

---

### 7.5 Python interval 类型支持仍未形成推进
- **Issue**: #29828 `[Python] Support other interval types`
- **状态**: Open / needs champion
- **链接**: apache/arrow Issue #29828

**为什么重要**：  
时间间隔类型是分析系统中常见语义，跨语言支持不完整会影响 API 一致性和用户预期。

---

## 8. 结论

今天的 Arrow 进展并非“大版本功能爆发”，而是明显呈现出**工程可用性修复 + 关键能力渐进补齐**的节奏：

- **R**：围绕 CRAN patch release、dplyr 兼容性、Azure Blob 支持持续推进；
- **Python**：继续处理打包链路、pandas 兼容细节，并酝酿 compute/Parquet 高级能力增强；
- **C++ / Flight SQL**：ODBC 方向进展最值得关注，显示 Arrow 正在加强标准 SQL 客户端接入能力；
- **Parquet**：Bloom Filter 写入与加密读取是最有潜力进入后续版本的存储层增强点。

从 OLAP 与分析型存储引擎视角看，Arrow 当前最明确的路线不是做一个“更大的数据库”，而是持续强化其作为**通用列式内存格式 + 多语言执行接口 + 存储格式能力层 + 连接协议层**的基础设施地位。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*