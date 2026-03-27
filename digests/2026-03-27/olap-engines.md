# Apache Doris 生态日报 2026-03-27

> Issues: 12 | PRs: 125 | 覆盖项目: 10 个 | 生成时间: 2026-03-27 01:27 UTC

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

# Apache Doris 项目动态日报 · 2026-03-27

## 1. 今日速览

过去 24 小时，Apache Doris 保持**高强度开发活跃度**：Issues 更新 12 条，PR 更新 125 条，其中 71 条待合并、54 条已合并或关闭，代码与问题流转都很频繁。  
从内容看，今日焦点主要集中在 **4.0/4.1 版本稳定性修复、云原生部署问题、查询正确性、外部生态兼容（Iceberg / Hive / FlightSQL / LDAP / S3）**。  
值得注意的是，虽然没有新版本发布，但围绕 **安全、认证、存储读写、执行器优化、向量检索与多目录湖仓能力** 的 PR 较密集，显示项目仍在快速扩展分析型数据库与数据湖一体化能力。  
同时，今日也暴露出若干真实生产问题，包括 **K8s 日志缺失、Docker 镜像架构缺失、算术重写导致结果错误、HTTPS 下错误链接不可访问、FlightSQL 认证失败**，说明项目在快速演进中仍面临跨平台与云环境打磨压力。

---

## 2. 项目进展

> 注：给定数据未显式列出“今日已合并”的完整清单，以下以**今日关闭/推进明显、且具备实质技术信号的 PR/相关修复**为主进行分析。

### 2.1 查询引擎与执行层推进

- **算子/读取路径继续优化：SegmentIterator 自适应批大小**  
  PR: [#61535](apache/doris PR #61535)  
  该 PR 为 `SegmentIterator` 引入基于 EWMA 的自适应 block size 预测，使输出 block 更贴近 `preferred_block_size_bytes`。这类优化有助于：
  - 提升扫描阶段的 CPU/内存效率
  - 改善大表扫描与下游算子之间的数据块平衡
  - 为复杂查询和向量化执行提供更稳定的吞吐表现  
  这是典型的**存储层到执行层协同优化**信号。

- **limit pushdown 下沉到 tablet reader**  
  PR: [#61713](apache/doris PR #61713)  
  这类改动通常直接影响扫描裁剪效率，尤其适用于：
  - Top-N / LIMIT 查询
  - 明显可提前终止的数据访问路径
  - 降低 IO 与 block 构建成本  
  若后续顺利合入，将对交互式分析查询延迟优化有现实价值。

- **TopN / multiget 结果一致性增强**  
  PR: [#61781](apache/doris PR #61781)  
  该 PR 针对 `merge_multi_response` 中请求 row id 数与返回结果行数不匹配的情况增加校验，并补充 BE 单测。它强化的是**分布式读路径的正确性与防御式编程能力**，对高并发、GC 时序复杂场景很重要。

- **Join 优化器能力扩展：支持 outer join reorder in dphyper**  
  PR: [#61146](apache/doris PR #61146)  
  这是查询优化器能力增强的明显信号。Outer Join 重排序通常比 Inner Join 更复杂，因为要保证语义不变。若合入，将提升复杂 SQL 的优化空间，属于**CBO 能力深水区演进**。

- **聚合相关重构持续推进**  
  PR: [#61690](apache/doris PR #61690)  
  虽然摘要信息较少，但从命名看是聚合执行/框架重构。此类重构一般是后续性能提升、函数扩展或代码可维护性改善的前置工作。

### 2.2 存储与文件系统优化

- **File Cache 修复：不再从路径解析 tablet_id，而通过 FileReaderOptions 传递**  
  PR: [#61683](apache/doris PR #61683)  
  该修复直指 `enable_packed_file` 小文件合并场景下路径格式变化导致的兼容问题。意义在于：
  - 降低路径约定耦合
  - 提升远端缓存读取稳定性
  - 为对象存储/打包文件格式演进提供更健壮的元数据传递机制

- **S3 访问优化：确定性路径使用 HEAD 代替 LIST**  
  PR: [#61776](apache/doris PR #61776)  
  这是很有价值的云对象存储兼容性优化。对无通配符路径使用 `HEAD` 而非 `ListObjectsV2`，可：
  - 避免要求 `s3:ListBucket` 权限
  - 降低桶级 listing 成本
  - 改善受限权限环境中的可用性  
  这明显回应了企业用户在最小权限策略下接入对象存储的诉求。

- **回收站三阶段保留机制**  
  PR: [#61504](apache/doris PR #61504)  
  这是典型的运维治理增强。三阶段 retention 设计通常意味着对删除对象生命周期管理更加精细，有利于平衡：
  - 数据恢复窗口
  - 存储成本
  - 清理策略可控性

### 2.3 SQL / 生态兼容性与安全增强

- **FE 解耦 Thrift：引入纯 Java BinaryType**  
  PR: [#61786](apache/doris PR #61786)  
  将 `Function` 内部从 `TFunctionBinaryType` 中解耦出来，有助于：
  - 降低 FE 核心逻辑对 Thrift 模型的侵入
  - 改善代码可维护性
  - 为后续 SQL 函数定义与元数据抽象演进打基础  
  这是**架构层面的清理与内聚性提升**。

- **PyUDF 类型转换修复**  
  PR: [#61729](apache/doris PR #61729)  
  说明 Doris 在 Python UDF 生态支持上仍在持续补齐边角兼容问题，对数据科学/AI 场景用户友好。

- **Parquet INT96 时间戳写入修复**  
  PR: [#61760](apache/doris PR #61760)  
  Parquet 时间戳兼容问题在跨引擎读写中非常敏感。该修复对 Doris 与 Spark/Hive/Iceberg 等外部引擎之间的数据互通质量有直接价值。

- **Iceberg 生态持续增强**
  - 升级 Iceberg Docker Spark 版本到 4.0：[#61149](apache/doris PR #61149)
  - 支持 Iceberg v3 row lineage：[#61398](apache/doris PR #61398)
  - 修正 Iceberg 回归测试中的 warehouse assignment：[#61724](apache/doris PR #61724)  
  这些信号表明 Doris 正持续强化其**湖仓查询与数据格式兼容**能力。

- **安全相关增强**
  - 支持复杂密码校验：[#61778](apache/doris PR #61778)
  - LDAP filter escape 改为 `LdapEncoder.filterEncode`，防注入：[#61777](apache/doris PR #61777), [#61774](apache/doris PR #61774)
  - 引入配置项禁止空 LDAP 密码登录：[#61440](apache/doris PR #61440)  
  今天安全面动作较集中，说明 Doris 正从“可用”继续走向“企业级默认安全”。

- **向量检索：支持 IVF on-disk ANN 索引**  
  PR: [#61160](apache/doris PR #61160)  
  这是很重要的功能演进。将 IVF 倒排列表放盘而非全量驻内存，使向量检索可覆盖更大规模数据集，体现 Doris 在 **AI/向量分析负载** 上的持续投入。

---

## 3. 社区热点

### 3.1 “支持其他 SQL 系统全部函数”长期议题仍然最热
- Issue: [#48203](apache/doris Issue #48203)  
- 评论数：129

这是今天最活跃的历史热点议题。核心诉求并不只是“多几个函数”，而是：
- 降低从 MySQL / Spark SQL / Hive / Presto / Trino / ClickHouse 等迁移 Doris 的成本
- 提升 BI、ETL、SQL 资产复用能力
- 减少应用改写与函数兼容层维护成本

摘要中的更新提到，维护者认为借助当前 LLM/Agent 能更快生成符合要求的 PR，因此不再重投入人工梳理。这释放出两个信号：
1. **函数兼容性需求非常真实且长期存在**；
2. 社区可能倾向于通过“半自动化贡献”来快速补齐函数覆盖，而非中心化规划。  
这对 Doris 未来 SQL 生态扩展节奏可能有积极影响，但也对 PR 审核质量和一致性提出更高要求。

### 3.2 K8s / 云原生日志问题成为即时关注点
- Issue: [#61728](apache/doris Issue #61728)  
- 对应修复 PR: [#61766](apache/doris PR #61766)

用户反馈 Doris 4.0.4 下 Metaservice 在 Kubernetes 中不再输出日志到标准输出，这类问题虽然不一定影响核心查询功能，但会严重影响：
- 容器平台下运维排障
- 日志采集链路（Fluent Bit / Promtail / sidecar）
- 云原生生产可观测性

该问题很快有修复 PR 跟进，说明维护者对云原生部署体验比较敏感。

### 3.3 FlightSQL 认证失败出现重复反馈
- Issues:
  - [#61757](apache/doris Issue #61757)
  - [#61744](apache/doris Issue #61744)
  - [#61743](apache/doris Issue #61743)

同一作者在短时间内重复提交 3 个几乎相同的问题，说明用户在接入 FlightSQL 时遇到了真实阻塞。背后技术诉求是：
- 云环境远程接入 Doris 4.0 的标准协议能力
- Python ADBC / FlightSQL 客户端认证兼容性
- 面向现代数据访问协议的易用性与文档完整度

这类重复 issue 往往意味着**用户不知道正确配置路径，或产品行为与预期不一致**，需要维护者尽快给出明确的配置说明或修复。

### 3.4 Docker 镜像仅 ARM64 的回归引发兼容性担忧
- Issue: [#61525](apache/doris Issue #61525)

用户指出 4.0.4 Docker 镜像只支持 ARM64，AMD64 被移除。对数据库项目来说，这属于高影响面问题，因为它直接影响：
- x86 服务器部署
- 本地开发环境
- CI/CD 与 Helm/K8s 编排
- 多架构企业基础设施兼容性

这类问题若属发布构建链路回归，应尽快修复，否则会明显影响 4.0.4 的实际可部署性。

---

## 4. Bug 与稳定性

以下按严重程度大致排序：

### P1：查询正确性风险

1. **算术重写在溢出时可能产生错误结果**  
   - Issue: [#61761](apache/doris Issue #61761)  
   - 状态：OPEN  
   - 影响版本：3.1 / 3.0 / master  
   - 分析：`SimplifyArithmeticComparisonRule` 在改写比较表达式时若未考虑溢出，可能导致语义错误。这是典型的**查询结果正确性问题**，严重性高于普通崩溃，因为会产生“静默错误结果”。  
   - fix PR：**暂无明确关联 PR**

### P1：部署可用性 / 生产运维阻断

2. **4.0.4 Docker 镜像仅支持 ARM64**  
   - Issue: [#61525](apache/doris Issue #61525)  
   - 状态：OPEN  
   - 分析：对 AMD64 用户属于直接阻断，影响面广。  
   - fix PR：**暂无明确关联 PR**

3. **Metaservice 在 K8s 中不输出标准输出日志**  
   - Issue: [#61728](apache/doris Issue #61728)  
   - 状态：OPEN  
   - fix PR: [#61766](apache/doris PR #61766)  
   - 分析：影响可观测性与故障定位，尤其在容器环境中问题突出。已有修复推进，处理及时。

### P2：安全集群 / 安全访问问题

4. **安全集群中 ErrorURL 不可访问**  
   - Issue: [#61780](apache/doris Issue #61780)  
   - 状态：OPEN  
   - fix PR: [#61785](apache/doris PR #61785)  
   - 分析：BE 返回的 load error URL 在 HTTPS 模式下仍返回 HTTP，属于典型协议适配缺陷。对安全部署场景影响明显，但已有快速修复。

5. **FlightSQL 无法认证用户**  
   - Issues:
     - [#61757](apache/doris Issue #61757)
     - [#61744](apache/doris Issue #61744)
     - [#61743](apache/doris Issue #61743)  
   - 状态：OPEN  
   - 分析：可能涉及 FlightSQL 鉴权链路、文档不清或客户端协议兼容。当前未见直接修复 PR。

### P2：跨平台稳定性

6. **macOS 上 BE 启动因 fd_number overflow 崩溃**  
   - PR: [#61770](apache/doris PR #61770)  
   - 状态：OPEN，已 reviewed/approved  
   - 分析：由于 `RLIMIT_NOFILE` 可能返回 `RLIM_INFINITY` 导致溢出。虽然主要影响开发/测试环境，但属于明确崩溃问题，修复路径清晰。

### P2：并发与 RPC 正确性

7. **AutoReleaseClosure 数据竞争导致读取到新 RPC 状态**  
   - PR: [#61782](apache/doris PR #61782)  
   - 状态：OPEN  
   - 分析：这是底层 RPC callback 复用时序问题，潜在后果可能是错误状态判断甚至隐藏一致性问题。虽然来自 PR 而非独立 issue，但技术风险不低。

### P3：生态格式与读写兼容

8. **Parquet INT96 时间戳写入问题**  
   - PR: [#61760](apache/doris PR #61760)  
   - 状态：OPEN  
   - 分析：关系到与其他大数据引擎的时间类型互操作，属于典型数据兼容修复。

9. **PyUDF 类型转换错误**  
   - PR: [#61729](apache/doris PR #61729)  
   - 状态：OPEN  
   - 分析：影响 Python UDF 体验，偏向生态可用性。

---

## 5. 功能请求与路线图信号

### 5.1 SQL 兼容性仍是强需求主线
- Issue: [#48203](apache/doris Issue #48203)

“支持其他 SQL 系统全部函数”虽然是长期议题，但从热度看依然代表用户迁移诉求。结合 Doris 当前大量 FE/函数/优化器重构工作，例如：
- `Function.BinaryType` 解耦 Thrift：[#61786](apache/doris PR #61786)
- 聚合重构：[#61690](apache/doris PR #61690)
- Join reorder 能力增强：[#61146](apache/doris PR #61146)

可以判断：**SQL 能力完善、函数系统整理、优化器增强** 仍是未来版本的重要方向。

### 5.2 湖仓与外部目录能力持续加强
相关 PR：
- Iceberg v3 row lineage：[#61398](apache/doris PR #61398)
- Spark / Iceberg Docker 升级：[#61149](apache/doris PR #61149)
- Hive3 执行引擎切换到 Tez（回归验证）：[#61639](apache/doris PR #61639)
- data lake reader 重构：[#61783](apache/doris PR #61783)

这些信号显示 Doris 正持续强化：
- 外表/多目录数据访问
- Iceberg 新版本能力对齐
- Hive 生态验证
- 湖仓一体分析路径性能与兼容性

### 5.3 向量检索与 AI 场景仍在扩展
- PR: [#61160](apache/doris PR #61160)

`ivf_on_disk` 对超内存数据集向量检索非常关键，说明 Doris 在传统 OLAP 之外，仍在积极争取**向量搜索 + 分析融合**场景。

### 5.4 安全治理有望进入下一阶段默认增强
相关 PR：
- 复杂密码校验：[#61778](apache/doris PR #61778)
- LDAP 空密码配置开关：[#61440](apache/doris PR #61440)
- LDAP 注入修复：[#61777](apache/doris PR #61777)

从集中度看，安全与认证能力很可能被纳入后续版本的重点改进项，尤其面向企业部署场景。

### 5.5 测试与兼容性补强被显著重视
- BlockFileCache lazy-load 与 v2/v3 启动兼容测试需求：[#61784](apache/doris Issue #61784)
- TPC-H SF10 MOR unique key 回归测试：[#61762](apache/doris PR #61762)

说明社区开始更系统地补足：
- 启动兼容性
- 存储格式升级回归
- MOR/MOW 行为覆盖
- 云环境与对象存储边界条件

---

## 6. 用户反馈摘要

### 6.1 云原生用户最关心“可部署、可观测、可认证”
- K8s 下 metaservice 日志缺失：[#61728](apache/doris Issue #61728)
- Docker 4.0.4 镜像仅 ARM64：[#61525](apache/doris Issue #61525)
- FlightSQL 用户认证失败：[#61757](apache/doris Issue #61757)

这些问题反映出真实用户并不只关心 SQL 性能，更关心：
- 镜像能否直接部署
- 日志能否被平台采集
- 标准协议能否顺利接入

### 6.2 安全部署场景越来越常见
- HTTPS 下 ErrorURL 不可用：[#61780](apache/doris Issue #61780)
- LDAP 安全增强相关 PR：[#61440](apache/doris PR #61440), [#61777](apache/doris PR #61777)

说明 Doris 正被越来越多地用于具备严格安全基线的环境，用户希望：
- 默认支持 HTTPS / 安全集群
- LDAP 行为安全可控
- 管理链路与导入错误定位链路同样兼容安全配置

### 6.3 用户对“结果正确性”容忍度极低
- 算术重写溢出导致错误结果：[#61761](apache/doris Issue #61761)

这类 issue 虽评论少，但价值极高。分析型数据库最核心的底线就是查询正确性，任何 rewrite/cost-based 优化带来的静默错误都应被优先处理。

### 6.4 生态互通仍是核心使用场景
- Parquet INT96 写入修复：[#61760](apache/doris PR #61760)
- Iceberg / Hive / S3 一系列 PR：[#61398](apache/doris PR #61398), [#61639](apache/doris PR #61639), [#61776](apache/doris PR #61776)

用户显然在把 Doris 放到更复杂的数据平台中，而不是单机或单系统内部使用，这对 Doris 的格式兼容、权限模型、跨引擎稳定性提出了更高要求。

---

## 7. 待处理积压

以下项目建议维护者重点关注：

### 7.1 长期高热度但缺少集中推进机制的 SQL 函数兼容议题
- Issue: [#48203](apache/doris Issue #48203)

这是长期最热问题之一。尽管维护者表示可能借助 LLM/Agent 来批量生成 PR，但从项目治理角度仍建议：
- 发布函数兼容优先级清单
- 给出认领流程与验收模板
- 明确不同 SQL 系统函数兼容规范  
否则热度虽高，落地可能分散。

### 7.2 Docker 多架构镜像问题应尽快处理
- Issue: [#61525](apache/doris Issue #61525)

这类问题若持续存在，会直接影响 4.0.4 的推广与升级意愿，建议高优先级修复并补充发布说明。

### 7.3 FlightSQL 认证问题存在重复提交，说明文档/行为需要统一澄清
- Issues:
  - [#61757](apache/doris Issue #61757)
  - [#61744](apache/doris Issue #61744)
  - [#61743](apache/doris Issue #61743)

建议：
- 合并重复 issue
- 给出最小复现与正确连接示例
- 检查 4.0 默认鉴权流程是否与客户端实现一致

### 7.4 一些历史问题以 Stale 关闭，可能掩盖真实用户痛点
- 已关闭：
  - [#55972](apache/doris Issue #55972) AWS web identity auth
  - [#5869](apache/doris Issue #5869) BE 宕机重启后无可查询副本
  - [#48893](apache/doris Issue #48893) be_compaction_tasks 系统表需求

其中：
- `#55972` 关系到 AWS EKS / Web Identity 认证，属于云上常见模式；
- `#5869` 涉及副本可查询性，虽然历史久远，但场景敏感；
- `#48893` 的 compaction task 可观测性需求，对运维监控仍有现实价值。  
建议维护者定期复盘被 Stale 关闭但具有产品价值的问题，而不是单纯依赖超时清理。

---

## 8. 健康度结论

**项目健康度：积极活跃，但稳定性与云原生体验仍需持续打磨。**

- **正向信号**：
  - PR 活跃度极高，开发推进强劲
  - 查询执行、存储、生态兼容、安全治理多线并进
  - 关键线上问题能较快出现对应修复 PR（如 K8s 日志、HTTPS ErrorURL）

- **风险信号**：
  - 4.0.4 暴露出部署与兼容性问题（Docker 架构、Metaservice 日志、FlightSQL 认证）
  - 存在查询正确性类潜在高优先级缺陷（算术重写溢出）
  - 一些长期需求与历史问题依然缺少系统化收敛机制

整体来看，Apache Doris 今日呈现的是一个**高迭代、高响应、功能持续扩张中的成熟 OLAP 项目**，但在迈向更复杂云环境与更广生态接入的过程中，**版本工程质量、协议兼容与默认安全体验** 将是接下来最值得关注的质量主题。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**基于 2026-03-27 社区动态**

---

## 1. 生态全景

过去 24 小时的开源 OLAP / 分析型存储生态呈现出一个非常清晰的特征：**整体高度活跃，但“功能扩张”与“稳定性回归治理”并行存在**。  
一方面，Doris、ClickHouse、StarRocks、Iceberg、Delta Lake 等项目都在持续加强 **湖仓互通、对象存储、云原生部署、SQL 兼容性、向量/半结构化/AI 相关能力**；另一方面，多数项目也都暴露出 **查询正确性、版本回归、跨平台构建、协议兼容、CI 稳定性** 等现实问题。  
这说明行业已经从“单机性能竞争”进入到“**生态兼容 + 云环境可运维 + 企业级默认安全 + 多引擎互操作**”的新阶段。  
从技术演进节奏看，**查询引擎类项目在强化执行器和优化器，表格式/湖仓类项目在补齐多引擎行为一致性，嵌入式引擎在追求复杂 SQL 稳定性**，分工愈发清晰。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | Release | 今日关注重点 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 12 | 125 | 无 | 4.0/4.1 稳定性、云原生、Iceberg/Hive/S3/LDAP/FlightSQL、安全增强 | **积极活跃，但云原生与正确性需持续打磨** |
| **ClickHouse** | 42 | 287 | 无 | 26.2 回归、性能与正确性、缓存、Iceberg/Parquet/S3 | **开发极活跃，但 26.x 回归风险高** |
| **DuckDB** | 16 | 37 | 无 | v1.5.x 稳定性、复杂 SQL binder/CTE、Windows/CLI、WAL 恢复 | **活跃且修复快，但复杂查询稳定性承压** |
| **StarRocks** | 11 | 160 | 无 | 外部 Catalog、Iceberg 兼容、可观测性、云原生主键表 | **良好活跃，但多分支回补带来兼容风险** |
| **Apache Iceberg** | 9 | 47 | 无 | Spark/Flink 适配、schema/manifest 修复、AWS/Kafka Connect | **健康，跨引擎兼容与文档仍是摩擦点** |
| **Delta Lake** | 3 | 50 | 无 | Kernel、DSv2/UC、Flink Sink、服务端规划/OAuth | **健康，工程化推进稳健** |
| **Databend** | 0 | 14 | 无 | SQL Binder 重构、Join/聚合稳定性、FUSE 元数据与索引 | **健康良好，处于能力补强阶段** |
| **Velox** | 5 | 36 | 无 | cuDF/GPU、Spark 兼容、Hive/S3 写入、API 演进 | **良好偏高，功能扩展与兼容补齐并进** |
| **Apache Gluten** | 2 | 21 | 无 | Spark 4.x、Velox 后端、GPU 构建/正确性、SQL 兼容 | **良好，但受上游 Velox 节奏影响较大** |
| **Apache Arrow** | 46 | 22 | 无 | C++/Parquet/Flight SQL ODBC/CI 稳定性、多语言生态 | **活跃稳健，处于质量巩固+连接器扩展期** |

### 活跃度观察
- **最高活跃度梯队**：ClickHouse、StarRocks、Doris  
- **中高活跃度梯队**：Arrow、Delta Lake、Iceberg、DuckDB  
- **定向推进型梯队**：Velox、Gluten、Databend  
- **今日无项目发布新版本**，说明当前更偏向 **主干推进、回补修复、版本工程治理**。

---

## 3. Apache Doris 在生态中的定位

## 3.1 Doris 的优势

与同类 OLAP 引擎相比，Apache Doris 当前最突出的优势在于：

- **统一分析数据库定位清晰**：既强化传统 MPP OLAP，又持续补湖仓、多 Catalog、对象存储、认证安全、向量检索能力。
- **功能覆盖面广**：今天同时覆盖了查询执行优化、存储层 file cache、S3 权限最小化、Iceberg v3、LDAP 安全、PyUDF、Parquet 兼容、ANN 向量检索。
- **社区响应速度快**：K8s 日志缺失、HTTPS ErrorURL 等问题都快速出现关联修复 PR。
- **企业部署导向明显**：LDAP、复杂密码、S3 最小权限、HTTPS、Docker/K8s 等议题集中，说明其目标用户明显偏向生产集群和企业数据平台。

## 3.2 与同类项目的技术路线差异

### 对比 ClickHouse
- ClickHouse 更偏 **极致执行性能、存储引擎深度优化、缓存体系、MergeTree 体系演进**。
- Doris 更强调 **数据库产品完整性 + 湖仓互通 + 企业安全与云原生部署体验**。
- ClickHouse 今日暴露更多 **26.x 回归与 correctness 风险**；Doris 则更多体现 **生态兼容与部署打磨压力**。

### 对比 StarRocks
- Doris 与 StarRocks 路线最接近，都是 **MPP + 湖仓 + 云原生 + 外表生态**。
- Doris 今日在 **安全治理、协议兼容、认证链路、向量检索** 上更活跃。
- StarRocks 今日更突出 **外部 Catalog 可观测性、JDBC pushdown、shared-data 主键表诊断**。

### 对比 DuckDB
- DuckDB 是 **嵌入式 OLAP 引擎**，更适合本地分析、笔记本、嵌入式应用。
- Doris 是 **分布式分析数据库**，更适合服务化、多租户、生产数仓场景。
- 今日 DuckDB 主要痛点是 **复杂 SQL binder/CTE 稳定性**；Doris 主要痛点是 **云原生部署与外部协议兼容**。

### 对比 Iceberg / Delta Lake
- Iceberg / Delta Lake 是 **表格式与事务层**，不是完整查询引擎。
- Doris 的定位是 **计算引擎 + 存储系统 + 湖仓查询入口**。
- 这意味着 Doris 更直接面对 **SQL、执行、部署、认证、监控、结果正确性** 全栈问题。

## 3.3 社区规模对比

从今日活跃度看：
- Doris（PR 125）明显已处于 **一线活跃开源分析引擎** 阵营；
- 规模低于 ClickHouse（PR 287）和 StarRocks（PR 160），但高于 DuckDB、Iceberg、Delta、Databend、Velox、Gluten；
- 说明 Doris 社区在 **分析数据库主战场** 中已具备较强开发吞吐和问题响应能力。

**结论**：Doris 当前处于“**成熟 OLAP 主引擎 + 快速扩张湖仓/云原生/企业能力**”的位置，和 ClickHouse、StarRocks 共同构成开源分析数据库最活跃的一线竞争层。

---

## 4. 共同关注的技术方向

以下方向在多个项目中同时出现，说明它们已成为行业级共性需求。

## 4.1 查询正确性优先级显著上升
**涉及项目**：Doris、ClickHouse、DuckDB、StarRocks、Arrow、Gluten、Velox  
**典型诉求**：
- Doris：算术重写溢出导致错误结果
- ClickHouse：Decimal 聚合、Join、窗口函数、short-circuit 语义错误
- DuckDB：复杂 CTE / binder internal error
- StarRocks：`CONVERT_TZ` 特定时区返回 NULL
- Arrow：list 列过滤导致 silent corruption
- Gluten / Velox：union 结果错误、JSON path 行为错误

**结论**：优化器、表达式重写、复杂类型、窗口函数、跨后端兼容已经进入高风险区，**“静默错误结果”成为比 crash 更受重视的质量问题**。

---

## 4.2 湖仓与开放表格式兼容持续强化
**涉及项目**：Doris、ClickHouse、StarRocks、Iceberg、Delta Lake、Arrow  
**典型诉求**：
- Doris：Iceberg v3、Hive、Parquet INT96、S3 权限优化
- ClickHouse：Iceberg 嵌套类型、data path、Parquet pushdown、S3 client cache
- StarRocks：Iceberg V3 回归、Iceberg metadata metrics、JDBC/外部 Catalog
- Iceberg：Spark/Flink/ORC lineage、多引擎适配
- Delta：DSv2、UC、Flink Sink、Kernel
- Arrow：Parquet、Flight SQL、云对象存储、多语言生态

**结论**：**湖仓互操作已经不是增量能力，而是基础门槛**。接下来比拼的是兼容深度、正确性和跨版本稳定性。

---

## 4.3 云原生与对象存储友好性持续升温
**涉及项目**：Doris、ClickHouse、StarRocks、Iceberg、Delta、Arrow、Velox  
**典型诉求**：
- Doris：K8s 日志、Docker 多架构、S3 HEAD 替代 LIST
- ClickHouse：S3 cache、MRAP、对象存储链路优化
- StarRocks：storage volume 校验、shared-data 诊断
- Iceberg / Delta：AWS client configurability、OAuth、server-side planning
- Arrow：Azure Blob、ODBC 分发、跨平台签名
- Velox：Hive/S3 multipart 行为对齐

**结论**：数据库和数据湖项目正在从“支持对象存储”走向“**适应云权限模型、云构建链路、云可观测性、云安全认证**”。

---

## 4.4 SQL 兼容性仍是长期主线
**涉及项目**：Doris、ClickHouse、DuckDB、Gluten、Velox、Databend、Arrow R/Python  
**典型诉求**：
- Doris：函数兼容性长期高热
- ClickHouse：`UNIQUE`、`LIKE ESCAPE`、typed NULL
- DuckDB：regex operator、struct.* 语义、窗口绑定
- Gluten / Velox：Spark 函数、TimestampNTZ、collect_set/collect_list
- Databend：DDL 幂等、binder 重构
- Arrow：dplyr helper、R 表达式系统、Python 运算符友好性

**结论**：SQL 兼容的核心不再只是“支持更多函数”，而是 **语义边界、复杂类型、窗口函数、DDL 幂等、方言一致性**。

---

## 4.5 可观测性与运维能力成为必选项
**涉及项目**：Doris、ClickHouse、StarRocks、Iceberg、Delta、Arrow  
**典型诉求**：
- Doris：K8s 日志、HTTPS error URL
- ClickHouse：`system.connections`、ON CLUSTER 可预测性
- StarRocks：catalog metrics、tablet data size、内存统计体系
- Iceberg：Flink Sink metadata / observer
- Delta：结构化异常、服务端规划
- Arrow：CI 强化、ODBC 签名与交付链路

**结论**：项目成熟度竞争，越来越体现在 **排障效率、指标维度、错误模型、连接层可见性** 上。

---

## 5. 差异化定位分析

## 5.1 存储格式 / 数据模型定位

| 类别 | 代表项目 | 核心定位 |
|---|---|---|
| 分布式 OLAP 数据库 | Doris、ClickHouse、StarRocks、Databend | 自带执行引擎与存储/元数据体系，直接承载分析查询 |
| 嵌入式分析引擎 | DuckDB | 本地/嵌入式单进程分析，强调易集成与交互式体验 |
| 开放表格式 / 湖仓事务层 | Iceberg、Delta Lake | 面向对象存储和多引擎的表元数据、事务和格式规范 |
| 执行引擎 / 加速层 | Velox、Gluten | 提供向量化执行、GPU/后端加速、上层系统集成 |
| 列式基础库 / 连接底座 | Arrow | 列式内存格式、Parquet、Flight/ODBC、多语言数据交换 |

---

## 5.2 查询引擎设计差异

- **ClickHouse**：偏单体高性能列存内核，围绕 MergeTree 与执行/缓存持续深挖。
- **Doris / StarRocks**：偏完整 MPP 分布式分析数据库，重视 FE/BE、Catalog、外表、云部署与企业特性。
- **Databend**：更明显走现代云原生湖仓数据库路线，关注 FUSE、对象存储、表版本化、Rust 架构。
- **DuckDB**：嵌入式、单节点、开发者友好，适合 notebook / 本地 ETL / 应用内分析。
- **Velox / Gluten**：不是面向最终用户的数据库，而是承载 Spark/Presto 等系统的执行加速层。

---

## 5.3 目标负载类型差异

| 项目 | 更适合的负载 |
|---|---|
| Doris | 实时报表、交互式分析、湖仓统一查询、企业级数仓 |
| ClickHouse | 超大规模明细查询、日志分析、近实时聚合、高吞吐读写 |
| StarRocks | 湖仓分析、联邦查询、云原生主键表、统一查询入口 |
| DuckDB | 本地分析、数据科学、嵌入式 BI、轻量 ETL |
| Iceberg / Delta | 多引擎共享数据湖、批流一体表层治理 |
| Databend | 云原生湖仓分析、对象存储驱动的数据平台 |
| Velox / Gluten | Spark/Presto 加速、GPU/向量化执行 |
| Arrow | 列式数据交换、文件格式、连接器和执行底座 |

---

## 5.4 SQL 兼容性取向差异

- **Doris / StarRocks**：更偏传统数仓和 MySQL/Spark/Hive 迁移友好。
- **ClickHouse**：在保持自身风格基础上逐步向标准 SQL 靠拢。
- **DuckDB**：高度重视 PostgreSQL 风格与分析 SQL 体验，但近期 binder 变化带来回归压力。
- **Gluten / Velox**：主要围绕 Spark SQL 兼容。
- **Iceberg / Delta**：SQL 不是核心竞争点，重点在对象语义、Catalog 行为、多引擎一致性。
- **Arrow**：主要通过语言绑定和表达式系统服务上层，不直接承担完整 SQL 方言竞争。

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一梯队：高吞吐主战场
- **ClickHouse**
- **StarRocks**
- **Apache Doris**

特征：
- PR/Issue 吞吐极高
- 功能、回归、生态、企业能力并行推进
- 社区已进入高频版本治理阶段

### 第二梯队：稳定推进型
- **Apache Arrow**
- **Apache Iceberg**
- **Delta Lake**
- **DuckDB**

特征：
- 明确主线持续推进
- 更强调工程化、兼容性、文档和接口稳定化
- 适合观察中期路线图而非单日功能爆发

### 第三梯队：技术底座/专项加速型
- **Velox**
- **Gluten**
- **Databend**

特征：
- 活跃度不低，但更集中于特定主题
- 依赖上游协同或处于能力成型阶段
- 更像“高潜力定向演进”，不是全面铺开

## 6.2 快速迭代 vs 质量巩固

### 快速迭代阶段明显的项目
- ClickHouse
- Doris
- StarRocks
- Gluten
- Velox
- Databend

表现为：
- 新功能与修复并发密集
- 边界问题与回归明显
- 评审/回补/兼容压力大

### 质量巩固特征更强的项目
- Arrow
- Iceberg
- Delta Lake
- DuckDB（虽有回归，但维护线修补明显）

表现为：
- 更关注 API/CI/兼容/文档/结构性修复
- 主线演进相对克制
- 发布工程和生态稳定性占比更高

---

## 7. 值得关注的趋势信号

## 7.1 “数据库 + 湖仓 + 对象存储” 正在收敛为统一平台能力
Doris、StarRocks、ClickHouse、Databend 都在加强外部表、S3、Iceberg、Hive、JDBC Catalog。  
**对架构师的意义**：未来选型不再是“数仓数据库”与“数据湖引擎”的二选一，而是看谁能更稳定地承担 **统一分析入口**。

## 7.2 查询正确性将重新成为核心竞争门槛
多个项目今天都暴露出静默错误结果类问题。  
**对数据工程师的意义**：升级验证不能只看性能 benchmark，必须增加：
- 回归 SQL 集
- 边界类型测试
- 优化器 rewrite 校验
- 多版本结果对比

## 7.3 云原生成熟度正在超越“能部署”的阶段
K8s 日志、Docker 多架构、对象存储最小权限、OAuth、签名与打包、runtime detection 等议题集中爆发。  
**参考价值**：生产环境选型应把以下项纳入前置评估：
- 镜像多架构
- 日志与指标接入
- IAM / OAuth / LDAP 兼容
- HTTPS / 安全默认值
- 构建和交付链路完整性

## 7.4 SQL 兼容正在从“函数补齐”升级为“语义对齐”
现在最容易出问题的不是缺少一个函数，而是：
- Nullable 行为
- 窗口函数边界
- JOIN / USING nullability
- 复杂类型字段解析
- DDL 幂等
- 标准 SQL 对象语义

**对团队的建议**：如果要做跨引擎迁移，需优先验证**关键业务 SQL 模板**，而不是只看函数清单。

## 7.5 AI / 向量 / 半结构化能力正在成为分析引擎标配延伸
- Doris：IVF on-disk ANN
- Databend：Geometry/Geography 聚合
- Arrow / DuckDB / Delta：复杂类型、空间类型、VARIANT、统计支持
- Velox / Gluten：GPU 与复杂类型兼容推进

**判断**：未来分析引擎将继续从传统 BI 查询扩展到：
- 向量检索 + 标量分析
- 半结构化数据处理
- 地理空间分析
- GPU 加速流水线

## 7.6 执行底座与上层产品的分层趋势更明显
Velox、Gluten、Arrow、Delta Kernel 的活跃说明，生态正在形成更清晰的分层：
- **底层格式/内存/协议**：Arrow
- **事务与表层**：Iceberg / Delta
- **执行加速层**：Velox / Gluten
- **终端数据库产品**：Doris / ClickHouse / StarRocks / Databend / DuckDB

**对架构设计的意义**：未来数据平台更适合按层组合，而不是寄希望于单一系统包打天下。

---

# 总体结论

从 2026-03-27 的社区动态看，开源 OLAP / 分析型存储生态已进入一个新的成熟竞争阶段：  
**性能仍重要，但生态兼容、正确性、云原生部署、安全治理、可观测性和多引擎互操作，正在成为同等重要的评价维度。**

对 Apache Doris 而言，它当前处于：
- **一线活跃分析数据库阵营**
- **企业化与湖仓一体化路线明显**
- **功能覆盖广、响应快**
- 但仍需重点打磨 **云原生部署体验、协议接入一致性、查询正确性底线**

如果你愿意，我下一步可以把这份报告继续整理成任一格式：

1. **适合发给管理层的 1 页摘要版**  
2. **适合技术评审会的对比矩阵版（更细粒度）**  
3. **单独聚焦 Apache Doris 的竞品对比版**  
4. **面向选型的建议版：Doris vs ClickHouse vs StarRocks vs DuckDB**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报 - 2026-03-27

## 1. 今日速览

过去 24 小时 ClickHouse 仓库保持**高活跃度**：Issues 更新 42 条、PR 更新 287 条，说明社区反馈、修复推进和功能开发都非常密集。  
从内容看，今天的重点集中在三类主题：**26.2 版本回归与正确性问题**、**查询优化/缓存能力增强**、以及 **Iceberg / Parquet / S3 外部存储链路持续完善**。  
稳定性方面，CI crash、fuzz 与 flaky test 仍然较多，表明主干分支仍处在高频迭代窗口；但同时也出现了关键 bug 的自动 backport PR，说明维护节奏较快。  
整体健康度评估为：**开发活跃、修复及时，但 26.1/26.2 相关回归风险值得重点关注**。

---

## 2. 项目进展

> 说明：给定数据未提供完整“已合并 PR 明细”，以下以今日最关键的已关闭 Issue 与高价值活跃 PR 作为“进展”观察重点。

### 2.1 查询引擎与执行层优化推进

- **Limit 下推到 `UNION ALL` 分支**
  - PR: [#100364](https://github.com/ClickHouse/ClickHouse/pull/100364)
  - 价值：对 `UNION ALL` 外层带 `LIMIT/OFFSET` 的查询，在每个分支提前加 `LimitStep`，可显著减少不必要的数据处理量。
  - 影响面：典型用于多路子查询拼接、联邦查询、报表查询场景，属于**低风险高收益**的执行计划优化。

- **基于可用内存动态限制 `max_threads` / `max_insert_threads`**
  - PR: [#100383](https://github.com/ClickHouse/ClickHouse/pull/100383)
  - 价值：新增 `max_threads_min_free_memory_per_thread` 和 `max_insert_threads_min_free_memory_per_thread`，按剩余内存动态收缩线程数，直接针对高并发与大查询导致的 OOM 风险。
  - 判断：这是对实际生产“线程过多导致内存放大”的系统性修正，和今天用户侧的内存痛点高度一致。

- **Part 级聚合缓存雏形：`PartialAggregateCache`**
  - PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)
  - 价值：尝试在 MergeTree part 级别缓存部分聚合结果，若落地，将影响重复聚合查询的延迟和 CPU 成本。
  - 判断：虽然仍属 experimental，但这是典型的 **OLAP 核心能力演进**，值得持续跟踪。

- **列缓存（Columns Cache）持续推进**
  - PR: [#96844](https://github.com/ClickHouse/ClickHouse/pull/96844)
  - 价值：在反序列化列层面做缓存，目标是减少重复读取和反序列化成本。
  - 判断：若与对象存储/冷热分层场景结合，可能成为后续性能优化的重要抓手。

### 2.2 SQL 兼容性与语义增强

- **支持 SQL 标准 `UNIQUE(subquery)` 谓词**
  - PR: [#99877](https://github.com/ClickHouse/ClickHouse/pull/99877)
  - 价值：补齐 SQL 标准语义，可用于判断子查询结果是否存在重复行。
  - 意义：属于 ClickHouse 持续加强 SQL 兼容性的直接信号。

- **允许 `cluster()` 接受 table function 参数时指定 sharding key**
  - PR: [#100665](https://github.com/ClickHouse/ClickHouse/pull/100665)
  - 关联 Issue: [#93904](https://github.com/ClickHouse/ClickHouse/issues/93904)
  - 价值：提升分布式表函数用法一致性，对复杂联邦/远程查询场景更友好。

- **禁止 Tuple 元素名为 `null`，避免子列歧义**
  - PR: [#98377](https://github.com/ClickHouse/ClickHouse/pull/98377)
  - 价值：这是一个明确的**向后不兼容修复**，目的是消除 Nullable null map 与 Tuple 子字段命名冲突。
  - 风险：已有依赖该命名的用户未来升级时需要检查 schema。

### 2.3 外部表格式与湖仓接口改进

- **修复 Iceberg 读取嵌套 `Map` 类型时的异常**
  - PR: [#100122](https://github.com/ClickHouse/ClickHouse/pull/100122)
  - 价值：修复 `Map(Tuple(Int), Tuple(Int))` 等嵌套结构读取时的 `std::out_of_range`。
  - 意义：继续补强 ClickHouse 作为湖仓分析引擎的适配能力。

- **Iceberg data path 校验更灵活**
  - PR: [#99935](https://github.com/ClickHouse/ClickHouse/pull/99935)
  - 价值：提升对 Spark 风格表布局的兼容处理。
  - 判断：这类改动通常直接影响用户接入成功率。

- **共享 S3 client cache（按 bucket 维度）**
  - PR: [#96802](https://github.com/ClickHouse/ClickHouse/pull/96802)
  - 价值：降低重复创建客户端的代价，属于对象存储访问链路的性能优化。

### 2.4 构建与 CI 质量控制

- **启用 clang-tidy 未初始化变量检查**
  - PR: [#100399](https://github.com/ClickHouse/ClickHouse/pull/100399)
  - 价值：面向 C++ 代码质量的前置防线，可减少未定义行为与潜在崩溃。

- **新增 SQLStorm CI Job**
  - PR: [#100140](https://github.com/ClickHouse/ClickHouse/pull/100140)
  - 价值：增强 SQL 级别测试覆盖，利于提早发现 planner / parser / execution 回归。

- **关键 UAF 修复正在回补到 26.1 / 26.2**
  - PR: [#100853](https://github.com/ClickHouse/ClickHouse/pull/100853), [#100855](https://github.com/ClickHouse/ClickHouse/pull/100855)
  - 原始修复：[#99483](https://github.com/ClickHouse/ClickHouse/pull/99483)
  - 意义：`MergeTreeReadTask::createReaders` 的 heap-use-after-free 属于高优先级稳定性问题，自动 backport 说明维护团队已将其列为版本级风险。

---

## 3. 社区热点

### 3.1 26.2 插入性能回归
- Issue: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
- 现状：评论数最高（23），用户反馈从 25.12 升级到 26.2 后，同样的 `ReplacingMergeTree` 插入查询慢了 **3 倍**。
- 背后诉求：
  - 企业用户对升级后写入性能稳定性高度敏感；
  - 社区希望明确是 planner、写路径、后台 merge，还是 object storage 删除/调度相关变化引起；
  - 若确认为普遍回归，将直接影响 26.2 的生产采用速度。

### 3.2 MergeTree CI 崩溃与读路径稳定性
- Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
- Issue: [#100769](https://github.com/ClickHouse/ClickHouse/issues/100769)
- 现状：均为 crash-ci，分别涉及 `MergeTreeDataPartCompact` 双重删除、`MergeTreeRangeReader` granule 调整问题。
- 背后诉求：
  - MergeTree 仍是核心引擎，任何内存生命周期错误都会拖累 release 稳定性；
  - 社区对“master 分支是否已知不稳”有持续关注。

### 3.3 system.connections 系统表需求持续升温
- Issue: [#60670](https://github.com/ClickHouse/ClickHouse/issues/60670)
- 现状：老问题再次活跃，需求是新增 `system.connections` 查看当前连接来源、协议、状态、运行中的 query。
- 背后诉求：
  - 运维可观测性仍有缺口；
  - 用户希望像 `processlist` 一样看执行，也希望看**连接层状态**，特别适合云环境、多租户与安全审计。

### 3.4 DDL on cluster 与 SQL 语义一致性问题
- Issue: [#95316](https://github.com/ClickHouse/ClickHouse/issues/95316)
- Issue: [#95319](https://github.com/ClickHouse/ClickHouse/issues/95319)
- 现状：一个是 `DDLWorker` 自 25.8 起 `ON CLUSTER` 任务执行失败，一个是 `AMBIGUOUS_COLUMN_NAME` 的 SELECT/WHERE 行为异常。
- 背后诉求：
  - 用户希望分布式 DDL 更可预测；
  - SQL 语义必须在升级后保持稳定，尤其是复杂表达式复用、列名解析逻辑。

---

## 4. Bug 与稳定性

以下按严重程度排序，并注明是否看到潜在 fix / 关联修复。

### P0 / 高严重

1. **26.2 INSERT 性能退化 3 倍**
   - Issue: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
   - 影响：直接影响生产写入吞吐。
   - 状态：**未见直接修复 PR**。
   - 备注：建议维护者优先建立 benchmark bisect，确认是写路径、合并策略还是并发控制变化。

2. **MergeTree 读路径 heap-use-after-free 已在回补**
   - Backport PR: [#100853](https://github.com/ClickHouse/ClickHouse/pull/100853), [#100855](https://github.com/ClickHouse/ClickHouse/pull/100855)
   - 影响：内存安全问题，可能触发 crash 或数据读取异常。
   - 状态：**已有 fix，且正在 backport 到 26.1 / 26.2**。
   - 结论：这是今天最明确的“高优先级问题已进入修复闭环”的信号。

3. **CI crash：MergeTreeDataPartCompact 双重删除**
   - Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
   - 影响：潜在内存管理缺陷。
   - 状态：**未见对应 fix PR**。

4. **CI crash：MergeTreeRangeReader granule 调整潜在问题**
   - Issue: [#100769](https://github.com/ClickHouse/ClickHouse/issues/100769)
   - 影响：读路径稳定性、边界处理风险。
   - 状态：**未见对应 fix PR**。

### P1 / 正确性与查询语义问题

5. **Decimal 列在 `GROUP BY` + `MAX()/MIN()` 下可能返回错误结果**
   - Issue: [#100740](https://github.com/ClickHouse/ClickHouse/issues/100740)
   - 影响：查询正确性，且属于典型财务/计费敏感场景。
   - 状态：**未见 fix PR**。
   - 风险：比纯 crash 更隐蔽，因为错误结果可能不易察觉。

6. **Grace hash join 在 bucket 数配置下出现错误结果**
   - Issue: [#100781](https://github.com/ClickHouse/ClickHouse/issues/100781)
   - 影响：join 正确性。
   - 状态：**未见 fix PR**。
   - 判断：若可稳定复现，应列高优先级。

7. **`sign()` 包裹涉及 Nullable 的窗口函数表达式时，在 26.2 返回全 0**
   - Issue: [#100782](https://github.com/ClickHouse/ClickHouse/issues/100782)
   - 影响：26.2 回归，窗口函数 + Nullable 组合的结果错误。
   - 状态：**未见 fix PR**。

8. **谓词下推优化不尊重 short-circuit**
   - Issue: [#100827](https://github.com/ClickHouse/ClickHouse/issues/100827)
   - 影响：可能导致语义变化或异常执行路径。
   - 状态：**未见 fix PR**。
   - 说明：这是典型“优化改变语义”的高风险问题。

9. **`accurateCastOrNull` 目标为 Tuple 时触发 LOGICAL ERROR / 返回错误结果**
   - Issue: [#100820](https://github.com/ClickHouse/ClickHouse/issues/100820)
   - 影响：类型系统正确性。
   - 状态：**未见 fix PR**。

10. **JSON 有时被误识别为 TSKV**
    - Issue: [#100797](https://github.com/ClickHouse/ClickHouse/issues/100797)
    - 影响：自动格式识别可靠性。
    - 状态：**未见 fix PR**。

### P2 / 运维与执行异常

11. **`ON CLUSTER` DDLWorker 自 25.8 起可能失败**
    - Issue: [#95316](https://github.com/ClickHouse/ClickHouse/issues/95316)
    - 影响：分布式 schema 变更可靠性。
    - 状态：未见直接修复 PR。

12. **`INSERT INTO ... SELECT *` 容易 `MEMORY_LIMIT_EXCEEDED`**
    - Issue: [#88556](https://github.com/ClickHouse/ClickHouse/issues/88556)
    - 影响：大表搬迁、重分区、重写场景。
    - 状态：暂无直接 fix，但相关缓解方向可参考 PR [#100383](https://github.com/ClickHouse/ClickHouse/pull/100383)。

13. **聚合结果物化导致 RSS 峰值抖升 1.5x**
    - Issue: [#100775](https://github.com/ClickHouse/ClickHouse/issues/100775)
    - 影响：高内存峰值，容易触发 OOM。
    - 状态：未见 fix PR。

14. **首次 `GROUP BY` 哈希表预分配不足，峰值内存高于后续运行 44%**
    - Issue: [#100838](https://github.com/ClickHouse/ClickHouse/issues/100838)
    - 影响：冷启动查询内存浪费。
    - 状态：未见 fix PR。

### 已关闭的稳定性问题

- Flaky test: [#100129](https://github.com/ClickHouse/ClickHouse/issues/100129)
- Flaky test: [#100786](https://github.com/ClickHouse/ClickHouse/issues/100786)
- UBSan: [#100787](https://github.com/ClickHouse/ClickHouse/issues/100787)
- Intersect/Except 逻辑错误：[#100691](https://github.com/ClickHouse/ClickHouse/issues/100691)

这些关闭项说明团队仍在持续清理测试噪音与 sanitizer 问题，但 CI 噪声水平依然偏高。

---

## 5. 功能请求与路线图信号

### 高概率进入后续版本的方向

1. **查询缓存 / 聚合缓存**
   - PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)
   - 信号：Part 级部分聚合缓存是非常明确的性能路线图信号，适合重复查询与 dashboard 场景。

2. **列级缓存 / 反序列化缓存**
   - PR: [#96844](https://github.com/ClickHouse/ClickHouse/pull/96844)
   - 信号：如果成熟，将成为 ClickHouse 存储层的重要性能特性。

3. **SQL 标准兼容持续增强**
   - PR: [#99877](https://github.com/ClickHouse/ClickHouse/pull/99877) `UNIQUE`
   - Issue: [#99599](https://github.com/ClickHouse/ClickHouse/issues/99599) `LIKE ... ESCAPE`
   - Issue: [#99607](https://github.com/ClickHouse/ClickHouse/issues/99607) `CAST(NULL AS type)` 返回 typed NULL
   - 判断：这三项共同表明 ClickHouse 正在逐步缩小与主流 SQL 方言的行为差异。

4. **JSON / 文本检索能力扩展**
   - PR: [#100730](https://github.com/ClickHouse/ClickHouse/pull/100730)
   - 信号：`JSONAllValues` + text index 支持，说明半结构化文本分析能力持续增强。

5. **对象存储与湖仓生态兼容**
   - PR: [#96802](https://github.com/ClickHouse/ClickHouse/pull/96802)
   - PR: [#99935](https://github.com/ClickHouse/ClickHouse/pull/99935)
   - Issue: [#51411](https://github.com/ClickHouse/ClickHouse/issues/51411) S3 Multi-Region Access Points
   - Issue: [#100743](https://github.com/ClickHouse/ClickHouse/issues/100743) Parquet v3 page-level filter pushdown
   - 判断：这是当前最稳定的产品方向之一，外部表 / 湖仓 / 对象存储能力仍在持续加码。

### 社区功能诉求中值得重点关注的项

- **`system.connections`**
  - Issue: [#60670](https://github.com/ClickHouse/ClickHouse/issues/60670)
  - 诉求明确、运维价值高，可能被纳入未来 observability 改进包。

- **查询重写规则（RFC）**
  - Issue: [#80084](https://github.com/ClickHouse/ClickHouse/issues/80084)
  - 长期看会影响安全治理、SQL 优化和流量控制，是平台化能力的重要组成。

- **带 `FINAL` 查询支持更有效的 `PREWHERE`**
  - Issue: [#89880](https://github.com/ClickHouse/ClickHouse/issues/89880)
  - 对 ReplacingMergeTree / CollapsingMergeTree 类表的查询性能意义较大。

---

## 6. 用户反馈摘要

### 6.1 升级后最担心的不是“新功能”，而是“性能和行为是否稳定”
- 代表 Issue: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241), [#100782](https://github.com/ClickHouse/ClickHouse/issues/100782), [#100740](https://github.com/ClickHouse/ClickHouse/issues/100740)
- 用户痛点：
  - 25.x 升到 26.x 后出现**写入变慢**、**窗口函数结果异常**、**Decimal 聚合错误**；
  - 对 OLAP 用户来说，这类问题比 crash 更危险，因为可能悄悄影响结果或成本。

### 6.2 大内存查询与批量写入场景仍然存在资源放大
- 代表 Issue: [#88556](https://github.com/ClickHouse/ClickHouse/issues/88556), [#100775](https://github.com/ClickHouse/ClickHouse/issues/100775), [#100838](https://github.com/ClickHouse/ClickHouse/issues/100838)
- 典型场景：
  - `INSERT INTO ... SELECT`
  - 大聚合结果物化
  - 首次运行的大规模 `GROUP BY`
- 用户诉求：
  - 更好的内存预估、预分配策略和线程/并发自适应控制。

### 6.3 运维可观测性和分布式可控性仍需补齐
- 代表 Issue: [#60670](https://github.com/ClickHouse/ClickHouse/issues/60670), [#95316](https://github.com/ClickHouse/ClickHouse/issues/95316), [#54966](https://github.com/ClickHouse/ClickHouse/issues/54966)
- 用户想要：
  - 更清晰的连接信息；
  - 更稳定的 `ON CLUSTER` 行为；
  - 更直观的备份/恢复配置加载机制。

### 6.4 SQL 兼容性诉求来自真实迁移场景
- 代表 Issue: [#99599](https://github.com/ClickHouse/ClickHouse/issues/99599), [#99607](https://github.com/ClickHouse/ClickHouse/issues/99607), [#95319](https://github.com/ClickHouse/ClickHouse/issues/95319)
- 用户希望：
  - 与 PostgreSQL / MySQL / SQLite 更接近的行为；
  - 减少迁移时的“细小但致命”的语义差异。

---

## 7. 待处理积压

以下是长期存在且仍具产品价值的重要积压项，建议维护者关注：

1. **`system.connections` 系统表**
   - Issue: [#60670](https://github.com/ClickHouse/ClickHouse/issues/60670)
   - 创建时间：2024-03-01
   - 原因：可观测性补齐价值高，且需求长期稳定存在。

2. **S3 Multi-Region Access Points 支持**
   - Issue: [#51411](https://github.com/ClickHouse/ClickHouse/issues/51411)
   - 创建时间：2023-06-26
   - 原因：对跨区域对象存储部署用户有现实意义，符合云原生趋势。

3. **备份配置文件加载问题**
   - Issue: [#54966](https://github.com/ClickHouse/ClickHouse/issues/54966)
   - 创建时间：2023-09-25
   - 原因：备份恢复属于基础能力，文档与行为不一致会直接影响用户信任。

4. **查询重写规则（RFC）**
   - Issue: [#80084](https://github.com/ClickHouse/ClickHouse/issues/80084)
   - 创建时间：2025-05-11
   - 原因：这是高杠杆能力，可支撑优化器增强、治理规则与安全控制。

5. **`FINAL` 查询下的 `PREWHERE` 优化**
   - Issue: [#89880](https://github.com/ClickHouse/ClickHouse/issues/89880)
   - 创建时间：2025-11-11
   - 原因：对 MergeTree 家族实际查询性能价值很大。

6. **`INSERT INTO ... SELECT *` OOM 问题**
   - Issue: [#88556](https://github.com/ClickHouse/ClickHouse/issues/88556)
   - 创建时间：2025-10-15
   - 原因：属于常见数据搬迁操作，问题普适性强。

7. **DDLWorker `ON CLUSTER` 失败**
   - Issue: [#95316](https://github.com/ClickHouse/ClickHouse/issues/95316)
   - 创建时间：2026-01-27
   - 原因：直接影响集群管控可靠性，优先级应高于普通语义问题。

---

## 8. 结论

今天 ClickHouse 的项目动态呈现出一个典型特征：**创新推进很快，但 26.x 线上的回归治理压力也在同步上升**。  
一方面，缓存、执行计划优化、SQL 兼容性、Iceberg/S3 集成等方向都在快速前进；另一方面，涉及 **INSERT 性能、Decimal 聚合正确性、Join 正确性、Nullable/窗口函数语义、MergeTree 内存安全** 的问题，说明当前版本迭代需要更强的回归测试和 benchmark 护栏。  
从工程健康度看，团队对关键问题的响应并不慢，尤其是 heap-use-after-free 已进入 backport 流程；但从用户视角，**升级到 26.2 前仍建议重点验证写入性能、复杂 SQL 正确性与大内存查询行为**。

如果你愿意，我还可以继续把这份日报再整理成：
1. **适合发群的简版摘要**  
2. **适合周报汇总的表格版**  
3. **面向技术管理层的风险清单版**

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报 · 2026-03-27

## 1. 今日速览

过去 24 小时 DuckDB 保持较高活跃度：Issues 更新 16 条、PR 更新 37 条，核心开发仍集中在 **稳定性修复、Windows/CLI 体验、查询绑定器与存储恢复** 等方向。  
今日没有新版本发布，但从已关闭 PR 和新开回归问题来看，团队正在对 **v1.5.x 分支进行密集补丁修复**，同时主干继续推进窗口函数绑定、触发器 catalog、几何类型存储等中长期能力。  
问题分布上，**内部错误（INTERNAL Error）、崩溃、CTE/复杂查询回归** 仍是今日最值得关注的风险点，说明近期 binder / planner / nested type 路径变更较多。  
整体健康度评价：**活跃且修复节奏快，但稳定性面临一定压力**，特别是复杂 SQL、Python 客户端以及 Windows 路径/终端兼容性场景。

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1) CSV reader 边界读取修复已进入维护分支
- **PR #21632** `[CLOSED] Fix for CSV reader buffer-boundary value read`  
  链接: duckdb/duckdb PR #21632

该 PR 是对已有修复在 `v1.5-variegata` 分支的回移，说明 CSV 读取器在 **buffer 边界值解析** 上存在已确认问题，并被认为值得进入维护版本。  
**意义**：这属于典型的数据摄取正确性修复，影响 ETL/批量导入稳定性，优先级较高。

---

#### 2) Windows Shell VT100 处理支持关闭，CLI 体验改善进入收尾
- **PR #21615** `[CLOSED] Windows shell: enable VT100 processing on startup`  
  链接: duckdb/duckdb PR #21615

为 Windows CLI 启动时启用 VT100 处理，改善终端渲染/ANSI 控制支持。  
**意义**：虽然不是核心执行引擎改动，但直接提升 Windows 用户的 shell 可用性，结合今日另一个 Windows 路径修复 PR，可见 Windows 平台体验正被持续打磨。

---

#### 3) 工作流 lint 与 CI 质量门禁增强
- **PR #21643** `[CLOSED] Lint workflows and fix existing lint errors/warnings`  
  链接: duckdb/duckdb PR #21643

引入 workflow lint、shellcheck 等，修复现有 GitHub Actions 工作流问题。  
**意义**：这类改动不会直接改变 SQL 行为，但会提高 CI 信号质量，降低“绿灯失真”概率，对快速迭代中的稳定性保障很关键。

---

#### 4) Julia 生态同步到 v1.5.1
- **PR #21637** `[CLOSED] Bump Julia to v1.5.1`  
  链接: duckdb/duckdb PR #21637

说明多语言生态仍在紧跟主库版本。  
**意义**：对嵌入式分析工作流和多语言用户有帮助，也暗示维护者在继续做版本一致性工作。

---

#### 5) 分支合并：维护线持续整合
- **PR #21639** `[CLOSED] Merge v1.4-andium into v1.5-variegata`  
  链接: duckdb/duckdb PR #21639

体现出维护分支之间仍有补丁整合。  
**意义**：从发布工程角度看，DuckDB 正在积极整理不同维护线的修复成果，为后续补丁版本做准备。

---

### 今日仍在推进、值得关注的 PR

#### 6) 窗口函数绑定重构
- **PR #21562** `[OPEN] Internal #8500: Window Function Binding`  
  链接: duckdb/duckdb PR #21562

将窗口函数绑定逻辑从 `TransformFuncCall` 移到 `BindWindow`，并重构 `LEAD/LAG` 等处理。  
**意义**：这是较深层的 binder 架构调整，长期看有利于 SQL 兼容性和错误处理一致性，但短期也可能与今日看到的若干 CTE / binding / internal error 问题形成关联信号。

---

#### 7) CREATE TRIGGER catalog / introspection 能力扩展
- **PR #21438** `[OPEN] Add catalog storage and introspection for CREATE TRIGGER`  
  链接: duckdb/duckdb PR #21438

为 Trigger 增加一等 catalog entry、序列化与校验逻辑。  
**意义**：这是明显的功能扩展信号，说明 DuckDB 正继续向更完整的 SQL DDL / 元数据管理能力演进。

---

#### 8) WAL recovery 健壮性提升
- **PR #21645** `[OPEN] Re-organize WAL replay slightly, and correctly deal with empty checkpoint WAL files in WAL recovery`  
  链接: duckdb/duckdb PR #21645

修复空 checkpoint WAL 文件导致 recovery 失败的问题。  
**意义**：直接关系到存储恢复路径的健壮性，是数据库可靠性层面的重要补强。

---

#### 9) STRUCT 向量 resize 崩溃修复
- **PR #21644** `[OPEN] Fix crash in Vector::Resize for STRUCT types`  
  链接: duckdb/duckdb PR #21644

针对 `STRUCT` 嵌套类型的向量扩容崩溃。  
**意义**：DuckDB 正在继续强化 nested types / complex types 的执行稳定性，这与 JSON/VARIANT/STRUCT 相关 issue 活跃是同一条主线。

---

#### 10) 几何类型存储行为调整
- **PR #21641** `[OPEN] Disable regular updates for geometry`  
  链接: duckdb/duckdb PR #21641  
- **PR #21649** `[OPEN] Warn instead of error when trying to persist geometry columns with CRS in old storage format`  
  链接: duckdb/duckdb PR #21649

两条 PR 都围绕 `GEOMETRY` 的存储格式演进、更新路径限制与兼容策略展开。  
**意义**：说明空间类型在新旧存储格式之间仍有磨合，维护者倾向于先保证不崩溃/可落盘，再逐步完善能力。

---

## 4. 社区热点

### 热点 1：内存限制下 UDF 无法完成
- **Issue #16359** `[OPEN] Having set a memory limit, an UDF cannot complete`  
  链接: duckdb/duckdb Issue #16359

这是今日评论数最高的问题之一（7 条评论）。用户反馈在设置 500MB 内存限制后，即使采用 `fetchone()` 这种单行拉取模式，UDF 仍会 OOM。  
**背后诉求**：  
- 用户希望 DuckDB 的内存治理能更贴近“实际消费模式”，而不是仅按全局算子/执行阶段保守分配。  
- 暗示当前 UDF 或 Python/外部函数路径可能在 **结果物化、批处理粒度、内存回收时机** 上不够精细。  
这也与今日另一个已关闭需求 issue #21547“按 query/connection 粒度治理内存”形成呼应。

---

### 热点 2：JSON → VARIANT 转换触发 Internal Error
- **Issue #21352** `[OPEN] Internal error when converting json to variant`  
  链接: duckdb/duckdb Issue #21352

用户测试新 `VARIANT` 编码时，JSON 文本转 `JSON` 再转 `VARIANT` 会崩溃。  
**背后诉求**：  
- 用户正在积极试用 DuckDB 新型半结构化数据能力。  
- 当前实现还存在编码边界条件、typed/untyped value 管理不稳的问题。  
这表明 `VARIANT` 仍处于快速演进阶段，适合关注但未必适合所有生产场景全面使用。

---

### 热点 3：`struct.* glob/like/similar to` 语义异常
- **Issue #16787** `[OPEN] struct.* glob / like / similar to broken`  
  链接: duckdb/duckdb Issue #16787

涉及 `STRUCT` 星号展开配合模式匹配时结果错误或抛错。  
**背后诉求**：  
- 用户期待 DuckDB 在复杂列投影、列通配符与结构化类型上保持一致 SQL 直觉。  
- 这是典型的 **SQL 兼容性 + binder/planner 正确性** 问题，对高级分析查询体验影响较大。

---

### 热点 4：Windows 路径 canonicalization 外泄到 SQL 层
- **PR #21652** `[OPEN] Windows: remove prefix from canonical paths`  
  链接: duckdb/duckdb PR #21652

PR 指出 `\\?\` 或 `\\?\UNC\` 长路径前缀可能泄漏给 SQL 客户端，例如 `temp_directory` 读取结果。  
**背后诉求**：  
- 用户希望底层平台兼容处理不要污染 SQL 层可见行为。  
- 这反映 DuckDB 嵌入式数据库在跨平台路径抽象上需要更强的一致性。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P0 / 崩溃与内部错误

#### 1) Python 客户端直接崩溃：`pointer being freed was not allocated`
- **Issue #21651** `[OPEN] "pointer being freed was not allocated" and crashing`  
  链接: duckdb/duckdb Issue #21651

在 DuckDB 1.5.1 + Python 3.12 环境中，执行查询直接导致进程级崩溃。  
**风险判断**：高。  
这是典型 native memory 管理问题，影响 Python 用户生产可用性。  
**是否已有 fix PR**：未见直接对应 PR。

---

#### 2) 复杂 CTE 链回归：绑定阶段 Internal Error
- **Issue #21604** `[OPEN] Failed to bind column reference (INTEGER != VARCHAR) in complex CTE chain`  
  链接: duckdb/duckdb Issue #21604

报告明确指出是 **v1.5.1 regression**，涉及多层 CTE、窗口函数、`UNION ALL`、`LEFT JOIN`。  
**风险判断**：高。  
复杂分析 SQL 是 DuckDB 核心场景，回归会影响 BI / notebook / Python 工作流。  
**是否已有 fix PR**：暂无明确对应 PR，但可能与窗口绑定/绑定器重构相关。

---

#### 3) 向量越界 Internal Error
- **Issue #21650** `[OPEN] Attempted to access index x within vector of size x`  
  链接: duckdb/duckdb Issue #21650

报告者认为与 #21604 的根因可能相关。  
**风险判断**：高。  
出现 vector index 访问错误通常说明执行器/表达式重写/binder 输出计划存在不一致。  
**是否已有 fix PR**：未见直接修复。

---

#### 4) CTE 定义丢失 Internal Error
- **Issue #21582** `[OPEN] Could not find CTE definition for CTE reference`  
  链接: duckdb/duckdb Issue #21582

说明复杂 macro + CTE + `query_table` 路径中，绑定/解析可能存在引用管理缺陷。  
**风险判断**：高。  
和 #21604、#21650 一起，构成今日最明显的 **binder / CTE 稳定性风险簇**。  
**是否已有 fix PR**：暂无。

---

#### 5) JSON 转 VARIANT 崩溃
- **Issue #21352** `[OPEN] Internal error when converting json to variant`  
  链接: duckdb/duckdb Issue #21352

**风险判断**：高。  
说明半结构化数据新能力仍存在内部状态一致性问题。  
**是否已有 fix PR**：暂无。

---

### P1 / 查询结果正确性与回归

#### 6) `struct.* similar to / like` 行为错误
- **Issue #16787** `[OPEN] struct.* glob / like / similar to broken`  
  链接: duckdb/duckdb Issue #16787

**风险判断**：中高。  
属于 SQL 语义错误，虽然不一定崩溃，但会导致错误结果或不可预期行为。

---

#### 7) `ASOF LEFT JOIN` 右表为空时返回空结果
- **Issue #21514** `[CLOSED] ASOF LEFT join with empty right table returns empty result`  
  链接: duckdb/duckdb Issue #21514

该问题已关闭，说明已有修复或已确认处理。  
**意义**：时间序列 join 正确性得到推进。

---

#### 8) `COPY table FROM 'file.csv'` 的 header 检测与文档不一致
- **Issue #21653** `[OPEN] Detection of header when using COPY table FROM 'file.csv'`  
  链接: duckdb/duckdb Issue #21653

**风险判断**：中。  
核心是 **行为与文档偏差**，影响数据导入预期和脚本可移植性。  
**是否已有 fix PR**：暂无。

---

### P2 / 平台兼容、构建与资源管理

#### 9) `read_parquet` + `LIMIT` 触发过多打开文件
- **Issue #18831** `[OPEN] Too many open files read_parquet with LIMIT`  
  链接: duckdb/duckdb Issue #18831

**风险判断**：中。  
对大目录 parquet 场景影响明显，且已有 `Needs Documentation` 标记，说明至少文档/行为解释不足。

---

#### 10) second connection attach 复用旧 attach string
- **Issue #21618** `[OPEN] Attach string is not picked up when creating a second connection in a session`  
  链接: duckdb/duckdb Issue #21618

**风险判断**：中。  
涉及多连接/同 session 资源状态管理，容易在嵌入式应用中引发错误数据源绑定。

---

#### 11) 禁用 unity 编译时报错
- **Issue #16819** `[OPEN] Build error while unity is disabled`  
  链接: duckdb/duckdb Issue #16819

**风险判断**：中低。  
主要影响开发者构建体验、生成 compile_commands 等工具链场景。

---

#### 12) Release build 才出现的段错误已关闭
- **Issue #21623** `[CLOSED] Segmentation fault in GetSortKeyLengthRecursive only in release build`  
  链接: duckdb/duckdb Issue #21623

问题已关闭，属于积极信号。  
**意义**：release-only crash 能快速关闭，说明维护者对高严重度崩溃响应较快。

---

## 6. 功能请求与路线图信号

### 1) 更细粒度的内存治理
- **Issue #21547** `[CLOSED] Query/Connection level Memory governing`  
  链接: duckdb/duckdb Issue #21547  
- **Issue #16359** `[OPEN] Having set a memory limit, an UDF cannot complete`  
  链接: duckdb/duckdb Issue #16359

虽然 #21547 已关闭，但结合 #16359 可见，用户对 **per-query / per-connection memory governance** 的需求是真实存在的。  
**路线图判断**：短期内未必直接落地为用户可配置特性，但很可能推动执行器/内存管理的内部改进。

---

### 2) 正则表达式操作符兼容性增强
- **Issue #16830** `[OPEN] Operator transformation for regular expressions`  
  链接: duckdb/duckdb Issue #16830  
- **Issue #16829** `[CLOSED] Support for case-insensitive regular expression operators`  
  链接: duckdb/duckdb Issue #16829

用户诉求集中在 PostgreSQL 风格 regex operator 的兼容性。  
**路线图判断**：由于一部分相关 issue 已关闭，说明维护者至少在文档、支持范围或实现上有推进，后续 SQL 兼容层仍值得关注。

---

### 3) CREATE TRIGGER 能力增强具有较强落地信号
- **PR #21438** `[OPEN] Add catalog storage and introspection for CREATE TRIGGER`  
  链接: duckdb/duckdb PR #21438

这是最明确的功能演进信号之一。  
**路线图判断**：若该 PR 继续推进，DuckDB 的 DDL 元数据与触发器支持将更完整，较可能进入后续主线版本。

---

### 4) 半结构化与复杂类型持续演进
- **Issue #21352** JSON → VARIANT  
  链接: duckdb/duckdb Issue #21352  
- **PR #21644** STRUCT resize crash fix  
  链接: duckdb/duckdb PR #21644  
- **PR #21641 / #21649** geometry 存储调整  
  链接: duckdb/duckdb PR #21641, duckdb/duckdb PR #21649

**路线图判断**：`VARIANT`、`STRUCT`、`GEOMETRY` 是近期明显投入的方向，但稳定性尚在补课阶段。下一版本更可能看到“修稳”而非大规模新语法扩张。

---

## 7. 用户反馈摘要

### 1) 真实痛点：复杂分析 SQL 的稳定性
多条 issue 指向复杂 CTE、窗口函数、宏、联合查询下的 internal error。  
这说明 DuckDB 已被用户用于 **高复杂度分析 SQL**，而不仅是简单文件查询。用户期待的是“复杂查询也应像 OLAP 引擎一样稳定可预期”。

相关链接：  
- duckdb/duckdb Issue #21604  
- duckdb/duckdb Issue #21650  
- duckdb/duckdb Issue #21582  

---

### 2) 真实痛点：资源治理不够细
UDF 内存限制问题与文件句柄耗尽问题说明，用户已经在 **受限资源环境** 下使用 DuckDB，例如 notebook、服务端多租户进程、容器。  
他们不仅关心性能，还关心“是否能在固定内存/文件句柄预算内可靠运行”。

相关链接：  
- duckdb/duckdb Issue #16359  
- duckdb/duckdb Issue #18831  

---

### 3) 真实痛点：嵌入式与跨平台一致性
Windows 路径前缀泄漏、Windows shell VT100、second connection attach 状态异常，都反映出 DuckDB 的嵌入式定位让用户非常在意 **平台细节是否暴露到上层应用**。

相关链接：  
- duckdb/duckdb PR #21652  
- duckdb/duckdb PR #21615  
- duckdb/duckdb Issue #21618  

---

### 4) 用户对新类型能力有兴趣，但容错要求高
JSON/VARIANT、STRUCT、GEOMETRY 相关 issue/PR 活跃，说明用户确实在尝试把 DuckDB 用于更复杂的数据模型。  
但他们对“先可用再扩展”的诉求很强：一旦出现 internal error 或崩溃，就会显著降低新特性的生产采用意愿。

相关链接：  
- duckdb/duckdb Issue #21352  
- duckdb/duckdb PR #21644  
- duckdb/duckdb PR #21641  

---

## 8. 待处理积压

以下为长期未决、且仍值得维护者关注的问题：

### 1) UDF 在 memory_limit 下无法完成
- **Issue #16359** `[OPEN] [under review, stale]`  
  链接: duckdb/duckdb Issue #16359

创建于 2025-02-22，至今仍未解决。  
**建议关注原因**：这是资源治理与 UDF 执行模型的核心问题，影响高级用户和嵌入式场景。

---

### 2) `struct.*` 模式匹配语义错误
- **Issue #16787** `[OPEN] [reproduced]`  
  链接: duckdb/duckdb Issue #16787

创建于 2025-03-22。  
**建议关注原因**：涉及结构化列展开和模式选择，直接影响 SQL 兼容性和高级查询可用性。

---

### 3) 禁用 unity 构建失败
- **Issue #16819** `[OPEN] [reproduced, stale]`  
  链接: duckdb/duckdb Issue #16819

**建议关注原因**：影响外部贡献者、IDE 工具链和非默认构建方式，不利于开发者生态。

---

### 4) 正则表达式操作符转换问题
- **Issue #16830** `[OPEN] [reproduced, stale, Needs Documentation]`  
  链接: duckdb/duckdb Issue #16830

**建议关注原因**：SQL 兼容性问题长期悬而未决，易引发用户对 PostgreSQL 方言支持范围的误判。

---

### 5) `read_parquet` + `LIMIT` 触发 `Too many open files`
- **Issue #18831** `[OPEN] [under review, Needs Documentation]`  
  链接: duckdb/duckdb Issue #18831

**建议关注原因**：大规模 parquet 目录扫描是典型 OLAP 用例，该问题对生产批处理有直接影响。

---

## 总结

今天的 DuckDB 呈现出一个很典型的高速演进型数据库项目状态：  
- 一方面，**修复和工程化动作密集**，尤其是 CSV、WAL recovery、Windows shell、CI 质量门禁、维护分支回移等，说明团队执行力很强；  
- 另一方面，**复杂 SQL binder/CTE 回归、Python 崩溃、VARIANT/STRUCT/GEOMETRY 稳定性问题** 说明新能力扩张正在给核心稳定性带来压力。  

如果从版本信号看，短期最可能进入后续补丁版本的仍是 **崩溃修复、查询正确性修复、平台兼容性修复**；而 CREATE TRIGGER、窗口绑定重构、复杂类型能力完善，则更像后续主线版本的重要看点。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 · 2026-03-27

## 1. 今日速览

过去 24 小时 StarRocks 维持了**高活跃度**：Issues 更新 11 条，PR 更新 160 条，其中 109 条已合并或关闭，说明项目在版本迭代、回补和自动化合并方面推进很快。  
从内容看，今日重点集中在**外部 Catalog / 湖仓兼容性**、**可观测性增强**、**查询优化器执行效率**以及**云原生主键表诊断能力**。  
同时，也出现了值得警惕的稳定性信号：包括 **4.0.8 对 Iceberg V3 的兼容性回归**、**时区转换正确性缺陷**、以及此前已关闭的 **CN 扫描空 tablet 崩溃** 问题，表明近期外表生态和执行路径边界条件仍需加强回归测试。  
整体来看，项目工程节奏健康，但**4.0/4.1 多分支并行回补**带来的行为变化与兼容性风险正在上升。

---

## 3. 项目进展

> 今日无新版本发布。

### 3.1 查询引擎与 SQL 优化

- **延迟 Project 到 TopN 之后执行**
  - PR: [#58345](https://github.com/StarRocks/starrocks/pull/58345)（已关闭，主 PR 完成）
  - Backport: [#70879](https://github.com/StarRocks/starrocks/pull/70879)（已关闭）
  - 进展说明：针对 `project -> topn` 模式，将部分表达式计算推迟到 TopN 之后，可减少无效表达式求值，降低 CPU 开销，属于典型的**物理执行优化**。这类优化对 `ORDER BY ... LIMIT` 查询、BI 报表 TopN 场景较有价值。

- **修复 LIST 分区 SQL 生成问题，并补充多层表达式分区测试**
  - PR: [#70841](https://github.com/StarRocks/starrocks/pull/70841)（Open）
  - 进展说明：修复 CREATE TABLE LIKE 等路径下 LIST 分区语法生成错误，提升**DDL 正确性与 SQL 兼容性**。虽然尚未合并，但已明确指向 3.5/4.0/4.1 分支，说明维护者认为影响面较广。

### 3.2 存储与云原生表可观测性

- **为 `be_tablet_write_log` 增加 PK Index SST 文件统计**
  - PR: [#69860](https://github.com/StarRocks/starrocks/pull/69860)（已关闭，4.1-merged）
  - Backport: [#70863](https://github.com/StarRocks/starrocks/pull/70863)（已关闭）
  - 进展说明：为 shared-data 主键索引路径新增 SST 文件统计信息，有助于分析 load / compaction / publish 阶段的写入行为，明显增强**云原生主键表排障能力**。

- **修正 `be_tablets` 系统表中 DATA_SIZE 口径**
  - PR: [#70735](https://github.com/StarRocks/starrocks/pull/70735)（Open）
  - 链接: https://github.com/StarRocks/starrocks/pull/70735
  - 进展说明：将 DATA_SIZE 更准确地对齐为 rowset 列数据字节数，剔除嵌入式索引等非目标开销，并单独处理 Lake PK index 字节。这是典型的**系统表语义纠偏**，会直接影响用户对磁盘占用的认知与容量规划。

- **外表查询指标细化：按 Catalog 类型统计查询指标**
  - PR: [#70533](https://github.com/StarRocks/starrocks/pull/70533)（Open）
  - 链接: https://github.com/StarRocks/starrocks/pull/70533
  - 进展说明：为 Hive、Iceberg、JDBC 等不同 Catalog 提供独立 query metrics，有助于混合负载场景下的性能归因，是**外表可观测性体系化建设**的重要信号。

- **新增 Iceberg metadata table 查询指标**
  - PR: [#70825](https://github.com/StarRocks/starrocks/pull/70825)（已关闭）
  - Backports: [#70880](https://github.com/StarRocks/starrocks/pull/70880), [#70881](https://github.com/StarRocks/starrocks/pull/70881), [#70882](https://github.com/StarRocks/starrocks/pull/70882)（均已关闭）
  - 进展说明：补充 Iceberg 元数据表访问计数，且多语言文档同步，说明项目正在加强**湖仓元数据访问链路的监控与治理**。

### 3.3 Schema Evolution 与存储引擎能力增强

- **支持 shared-data 场景下 VARCHAR 扩容的快速 Schema Evolution**
  - PR: [#70747](https://github.com/StarRocks/starrocks/pull/70747)（Open）
  - 链接: https://github.com/StarRocks/starrocks/pull/70747
  - 进展说明：将 `VARCHAR(n) -> VARCHAR(m)`（m > n）识别为 metadata-only 修改，减少数据重写成本。这类改动对**在线 schema 演进**非常关键，尤其适合云原生共享存储部署。

- **统一云原生表 drop 与 partition drop 的回收流程**
  - PR: [#68434](https://github.com/StarRocks/starrocks/pull/68434)（Open）
  - 链接: https://github.com/StarRocks/starrocks/pull/68434
  - 进展说明：目标是统一 Lake Table 删除与分区删除的异步处理机制，提升资源回收路径的一致性与可维护性，偏向**后台存储管理架构优化**。

### 3.4 工具链与依赖升级

- **BE 侧 thrift 从 0.20 升级至 0.22**
  - PR: [#70822](https://github.com/StarRocks/starrocks/pull/70822)（Open）
  - 链接: https://github.com/StarRocks/starrocks/pull/70822

- **Hadoop 升级至 3.4.3**
  - PR: [#70873](https://github.com/StarRocks/starrocks/pull/70873)（已关闭）
  - 链接: https://github.com/StarRocks/starrocks/pull/70873

这类依赖升级短期收益主要是安全性与兼容性，但也往往是引入行为变化的潜在来源，建议持续观察回归情况。

---

## 4. 社区热点

### 热点 1：4.0.8 引入 Iceberg V3 回归，影响外表生产可用性
- Issue: [#70860](https://github.com/StarRocks/starrocks/issues/70860)
- 摘要：用户反馈升级到 4.0.8 后，**所有 Iceberg V3 表无法查询**，回滚到 4.0.6 恢复正常。
- 技术诉求分析：
  - 用户核心诉求不是“新功能”，而是**版本升级后的兼容性稳定**。
  - Iceberg V2 正常、V3 失败，说明问题可能集中在**版本特性识别、元数据解析或执行路径分支**。
  - 这是典型的**跨湖仓生态兼容回归**，影响面可能超过单个用户，值得优先处理。

### 热点 2：ClickHouse AggregatingMergeTree 查询支持
- Issue: [#53950](https://github.com/StarRocks/starrocks/issues/53950)
- 摘要：用户希望 StarRocks 作为统一查询层，支持查询 ClickHouse `AggregatingMergeTree` 表及其物化视图。
- 技术诉求分析：
  - 这是典型的**异构 OLAP 联邦查询**需求，反映 StarRocks 正被拿来充当“统一分析入口”。
  - 背后要求并不只是连通性，而是对 ClickHouse 聚合状态 / 物化视图语义的理解和兼容。
  - 该 Issue 带有 `good first issue`，说明维护者可能认为有明确切入点，但真正落地可能牵涉较深的引擎语义映射。

### 热点 3：JDBC Catalog 路线图与 Join Pushdown
- Issues:
  - [#70852](https://github.com/StarRocks/starrocks/issues/70852)
  - [#70813](https://github.com/StarRocks/starrocks/issues/70813)
- 摘要：用户明确提出 JDBC Catalog 需要支持 Join、聚合、TopN、ORDER BY 下推，以及 native passthrough。
- 技术诉求分析：
  - 这是非常清晰的**联邦查询成本控制**需求：更多算子下推给远端数据库，以减少 StarRocks 侧 CPU、内存和网络开销。
  - 从两个 Issue 同日提出看，JDBC Catalog 很可能正从“基础可用”走向“性能可用”阶段。
  - 如果未来有对应 PR 出现，这将是外部连接器能力的重要里程碑。

### 热点 4：精细化内存统计体系提案
- Issue: [#69128](https://github.com/StarRocks/starrocks/issues/69128)
- 摘要：提出建立可控、精确的内存统计系统，以帮助定位 OOM、泄漏和高内存占用来源。
- 技术诉求分析：
  - 这不是简单 feature request，而是**可观测性底座升级**。
  - 对高并发分析引擎来说，内存问题通常是最难排查的线上故障之一，该提案如果被采纳，会显著提升企业级运维体验。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：4.0.8 对 Iceberg V3 表出现向后不兼容回归
- Issue: [#70860](https://github.com/StarRocks/starrocks/issues/70860)
- 状态：Open
- 影响：升级到 4.0.8 后，Iceberg V3 表无法查询；V2 不受影响。
- 风险判断：**高**。这是明确的版本回归，且影响生产升级路径。
- fix PR：**暂未看到关联修复 PR**

### P1：CN 在开启 physical split 且扫描空 tablet 时崩溃
- Issue: [#70280](https://github.com/StarRocks/starrocks/issues/70280)
- 状态：Closed
- 链接: https://github.com/StarRocks/starrocks/issues/70280
- 影响：shared-data 集群下，空 tablet 与 PhysicalSplitMorselQueue 组合可能触发崩溃。
- 风险判断：**高**。属于直接 crash 类问题。
- fix PR：数据中未给出直接关联 PR，但 Issue 已关闭，说明修复已落地或被其他 PR 间接解决。

### P1：`CONVERT_TZ` 在 Casablanca / El_Aaiun 上对列表达式返回 NULL
- Issue: [#70671](https://github.com/StarRocks/starrocks/issues/70671)
- 状态：Open
- 链接: https://github.com/StarRocks/starrocks/issues/70671
- 影响：FE 常量折叠路径正常，但 BE 路径对表列计算返回 NULL，属于**执行路径不一致导致的查询正确性问题**。
- 风险判断：**高**。会导致结果错误，且只在特定时区触发，隐蔽性强。
- fix PR：**暂未看到关联修复 PR**

### P2：带点号的列名触发 `SemanticException`
- Issue: [#70810](https://github.com/StarRocks/starrocks/issues/70810)
- 状态：Open
- 链接: https://github.com/StarRocks/starrocks/issues/70810
- 影响：`getQueryStatisticsColumnType` 对包含 `.` 的列名处理异常。
- 风险判断：**中**。主要影响 SQL 兼容性、元信息/统计查询场景。
- fix PR：**暂未看到关联修复 PR**

### P2：ZooKeeper 依赖存在 CVE 风险
- Issue: [#70859](https://github.com/StarRocks/starrocks/issues/70859)
- 状态：Open
- 链接: https://github.com/StarRocks/starrocks/issues/70859
- 影响：`org.apache.zookeeper:zookeeper 3.8.4` 涉及 [CVE-2026-24308](https://nvd.nist.gov/vuln/detail/CVE-2026-24308)，建议升级到 3.9.5 或 3.8.6。
- 风险判断：**中到高**，取决于受影响组件是否暴露在实际部署路径上。
- fix PR：**暂未看到关联修复 PR**

### P2：Iceberg 增量 MV 刷新对 REPLACE 操作分类错误
- Issue: [#67032](https://github.com/StarRocks/starrocks/issues/67032)
- 状态：Closed
- 链接: https://github.com/StarRocks/starrocks/issues/67032
- 影响：TVR 将 REPLACE 错分为 RETRACTABLE，阻塞增量物化视图刷新。
- 风险判断：**中高**。对 IVM 场景用户影响较大。
- 进展：Issue 已关闭，说明该类 Iceberg 增量维护兼容问题已有处理。

---

## 6. 功能请求与路线图信号

### 6.1 JDBC Catalog 正成为重点能力建设方向
- Issues:
  - [#70852](https://github.com/StarRocks/starrocks/issues/70852) - JDBC Catalog roadmap
  - [#70813](https://github.com/StarRocks/starrocks/issues/70813) - JDBC Catalog can push down join
- 路线图判断：
  - 这两个 Issue 指向非常一致：**增强 JDBC 下推能力**。
  - 结合当前项目已有大量外表可观测性 PR（如 [#70533](https://github.com/StarRocks/starrocks/pull/70533)、[#70825](https://github.com/StarRocks/starrocks/pull/70825)），可推测外部 Catalog 生态是当前明确方向。
  - 预计 Join/Aggregation/TopN/ORDER BY pushdown 至少部分能力**有较高概率进入后续版本**。

### 6.2 存储卷创建前校验能力
- Issue: [#70848](https://github.com/StarRocks/starrocks/issues/70848)
- 诉求：创建 storage volume 时校验连通性与 AK/SK，并通过 `DESC STORAGE VOLUME` 展示错误信息。
- 路线图判断：
  - 这是高价值低争议的**可用性增强**，实现成本相对可控。
  - 若云原生对象存储部署是重点，该需求有较高进入短期迭代的可能。

### 6.3 ClickHouse 聚合引擎表查询支持
- Issue: [#53950](https://github.com/StarRocks/starrocks/issues/53950)
- 路线图判断：
  - 该需求战略意义较强，但技术复杂度也高。
  - 更像是中长期生态兼容能力，不太像短周期版本的直接落地项。

### 6.4 更精细的内存统计体系
- Issue: [#69128](https://github.com/StarRocks/starrocks/issues/69128)
- 路线图判断：
  - 从问题描述完整度来看，已经接近提案文档而非普通需求。
  - 若维护者重视企业运维体验，这类能力很可能以“分阶段增强”的形式逐步进入主线。

### 6.5 OAuth2 Iceberg REST Catalog 认证兼容修复
- PR: [#61748](https://github.com/StarRocks/starrocks/pull/61748)
- 路线图信号：
  - 虽是旧 PR，但近期仍活跃，说明 **Iceberg REST Catalog + OAuth2** 兼容性仍在推进中。
  - 这与今日 Iceberg V3 回归问题形成对照：Iceberg 生态支持仍是当前关键战场。

---

## 7. 用户反馈摘要

### 统一查询层需求增强
- 代表 Issue: [#53950](https://github.com/StarRocks/starrocks/issues/53950)
- 反馈要点：用户并不满足于“能接入”异构系统，而是希望 StarRocks 作为统一查询引擎，真正理解外部系统特定表引擎和物化视图语义。
- 反映出：StarRocks 正被用于**跨 OLAP 引擎统一分析入口**场景。

### 升级稳定性优先于新功能
- 代表 Issue: [#70860](https://github.com/StarRocks/starrocks/issues/70860)
- 反馈要点：用户明确指出 4.0.8 升级后 Iceberg V3 全部不可用，回滚后恢复。
- 反映出：企业用户对版本升级的预期是“零回归”，尤其在湖仓元数据兼容层面。

### 联邦查询必须“性能可用”
- 代表 Issues:
  - [#70852](https://github.com/StarRocks/starrocks/issues/70852)
  - [#70813](https://github.com/StarRocks/starrocks/issues/70813)
- 反馈要点：仅支持谓词下推已经不够，用户希望 Join、聚合、TopN 等更多算子下推到远端数据库。
- 反映出：用户已将 JDBC Catalog 用于**真实生产分析链路**，而不只是临时导入/轻量查询。

### 线上排障对可观测性要求提升
- 代表 Issue: [#69128](https://github.com/StarRocks/starrocks/issues/69128)
- 反馈要点：现有内存统计不够细，难以定位 OOM、泄漏和异常增长。
- 反映出：随着部署规模扩大，用户对 StarRocks 的要求已从“功能正确”转向“**高可运维性**”。

---

## 8. 待处理积压

### 长期活跃但尚未收敛的 PR / Issue

- **OAuth2 Iceberg REST catalog 认证参数重复**
  - PR: [#61748](https://github.com/StarRocks/starrocks/pull/61748)
  - 创建于 2025-08-09，至今仍 Open。
  - 提醒：这是外部生态接入类兼容问题，若长期未合并，可能影响 Polaris 等 OAuth2 场景用户落地。

- **ClickHouse AggregatingMergeTree 查询支持**
  - Issue: [#53950](https://github.com/StarRocks/starrocks/issues/53950)
  - 创建于 2024-12-15，近期仍活跃。
  - 提醒：虽标记为 `good first issue`，但背后其实是较深的异构引擎语义兼容问题，建议维护者确认范围和设计边界，避免长期悬而未决。

- **统一云原生表删除流程**
  - PR: [#68434](https://github.com/StarRocks/starrocks/pull/68434)
  - 创建于 2026-01-26，仍 Open。
  - 提醒：此类后台回收架构调整通常影响稳定性，建议明确 review owner 与目标版本。

- **精确内存统计系统提案**
  - Issue: [#69128](https://github.com/StarRocks/starrocks/issues/69128)
  - 创建于 2026-02-10，暂无评论。
  - 提醒：这是对运维可观测性非常关键的系统性需求，建议维护者尽早给出方向性反馈。

---

## 健康度结论

StarRocks 今日呈现出典型的**高速演进型开源项目**特征：PR 吞吐量很高，多分支回补活跃，外部 Catalog、云原生表、可观测性和查询优化并行推进。  
但与此同时，**外部生态兼容与版本回归风险**也在升高，特别是 Iceberg V3 与时区转换问题，说明项目当前最需要关注的是：在快速推进功能和 backport 的同时，进一步强化跨版本升级回归测试、外表协议兼容测试和执行路径一致性验证。  
总体健康度评价：**良好偏活跃**，但稳定性面板出现若干高优先级告警，建议维护者优先清理。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-27）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 社区保持了**较高活跃度**：Issues 更新 9 条，PR 更新 47 条，明显以代码推进和评审活动为主。  
今日没有新版本发布，但从 PR 结构看，工作重点集中在 **Spark/Flink 引擎适配、核心 schema/manifest 稳定性修复、AWS/Kafka Connect 基础设施增强**。  
值得注意的是，今天出现了多条**“Issue 当日提出、PR 当日跟进”**的联动，如 map key 短名称访问缺陷、Flink Sink metadata 扩展，说明项目对新问题响应速度较快。  
同时，也有一批历史 PR 因 stale 被关闭，反映出项目在持续清理积压，但部分长期演进议题（如 Spark 小文件异步读取、V4 manifest 支撑）仍处于推进中。  
整体来看，项目健康度良好，**开发热度高、修复响应及时，但跨引擎兼容性和文档可用性仍是当前主要摩擦点**。

---

## 3. 项目进展

> 今日无新 Release，以下聚焦已关闭/已推进的重要 PR 与其技术意义。

### 3.1 Spark 测试与行为一致性清理完成
- **PR #15765** `[CLOSED] [spark] Spark: test cleanup - eliminate unnecessary table refreshes`  
  链接: https://github.com/apache/iceberg/pull/15765

该 PR 已关闭，核心是清理 Spark 测试中不必要的 table refresh 行为，修正通过 DataFrame API 写入后返回旧 `Table` 实例导致的测试噪音。  
意义在于：
- 降低 Spark 测试中的伪失败/误导性状态；
- 为后续 Spark 3.4 / 3.5 / 4.0 多版本统一测试行为打基础；
- 提高 rewrite、action 类测试结果的可信度。

其后续移植 PR：
- **PR #15787** `[OPEN] [spark] Spark 3.4, 3.5, 4.0: test cleanup - eliminate unnecessary table refreshes`  
  链接: https://github.com/apache/iceberg/pull/15787

这说明维护者正在把已收敛的修复向多 Spark 版本扩展，属于**低风险、提升稳定性与回归测试质量**的工作。

---

### 3.2 Schema 更新边界条件修复持续推进
- **PR #15767** `[OPEN] [core] Add testDeleteMapValue in TestSchemaUpdate`  
  链接: https://github.com/apache/iceberg/pull/15767

该 PR 针对 map value 删除相关 schema update 场景补充测试，关联 issue #15766。  
虽然尚未合并，但它反映出核心 schema 演进逻辑正在被持续补强，尤其是复杂类型（map/struct）在字段删除、错误提示与兼容性方面的边界行为。

---

### 3.3 Flink Sink 可扩展性增强进入实现阶段
- **Issue #15783** `Flink Sink: Add WriteObserver plugin interface for per-record metadata`  
  链接: https://github.com/apache/iceberg/issues/15783
- **PR #15784** `[OPEN] [flink] Flink Sink: Add WriteObserver plugin interface for per-record metadata`  
  链接: https://github.com/apache/iceberg/pull/15784

该功能请求当天即有实现 PR 跟进，拟为 Sink V2 增加 `WriteObserver` 插件接口，使每条写入记录产生的元数据可沿 writer → serializer → aggregator → committer 传递，最终进入 snapshot summary。  
这类能力对以下场景价值较高：
- 审计与 lineage；
- 分 checkpoint 写入统计；
- 业务级元信息嵌入 snapshot。

这属于**Flink 写入链路可观测性/可扩展性增强**，很可能是后续版本可纳入的增量功能点。

---

### 3.4 ORC 对 V3 lineage 支持继续补齐
- **PR #15776** `[OPEN] [data, flink, ORC] ORC: Add _row_id and _last_updated_sequence_number reader in Orc to support lineage`  
  链接: https://github.com/apache/iceberg/pull/15776

该 PR 旨在补齐 ORC 对 `_row_id` 与 `_last_updated_sequence_number` 的读取支持，以覆盖 V3 表 lineage 能力。  
当前描述指出 Parquet 和 Avro 已具备，而 ORC 尚未补齐。若该 PR 合并，将显著改善：
- 多格式能力一致性；
- V3 lineage 在 ORC 上的可用性；
- TCK / 文件格式兼容测试完整性。

这是一个明确的**格式能力补平**信号。

---

### 3.5 Core 层稳定性修复：Manifest 过滤潜在死锁
- **PR #15713** `[OPEN] [core] Core: close entries iterable in ManifestFilterManager`  
  链接: https://github.com/apache/iceberg/pull/15713

该 PR 目标是修复 `ManifestFilterManager` 在某些情况下读取 manifest 两次、且首次提前返回时未关闭 iterable，进而可能导致死锁的问题。  
这是典型的核心元数据路径稳定性修复，优先级较高，因为它影响：
- manifest filtering 正确性；
- 资源释放；
- 并发/IO 可靠性。

---

## 4. 社区热点

### 4.1 Spark 视图支持与行为混乱仍是热点
- **Issue #11440** `[CLOSED] [question] Unsupported Spark Creating Views Operation for s3_catalog`  
  链接: https://github.com/apache/iceberg/issues/11440
- **Issue #15779** `[OPEN] [bug] Spark: Iceberg views are not created as views and are appearing as tables.`  
  链接: https://github.com/apache/iceberg/issues/15779

虽然 #11440 已关闭，但今天更新的相关新 bug #15779 表明：  
**Spark + Iceberg catalog 下的 view 语义和可见性仍存在用户困惑与兼容性问题。**

背后的技术诉求主要是：
- 用户希望 `CREATE VIEW` 在各 catalog 实现下有一致语义；
- 视图应在元数据层正确登记为 view，而不是 table；
- Spark 对 Hive/catalog 类型的适配应更可预测。

这类问题会直接影响 SQL 兼容性与 BI/交互式分析体验。

---

### 4.2 Spark Merge + SPJ 的性能瓶颈引发持续关注
- **Issue #14198** `[OPEN] [question, stale] Using SPJ when merge contains both match and not matched`  
  链接: https://github.com/apache/iceberg/issues/14198

该问题今天仍有更新，聚焦 **Spark Partially Clustered Join (SPJ)** 在包含 `WHEN MATCHED` 与 `WHEN NOT MATCHED` 的 merge/upsert 场景下，对高倾斜数据的性能瓶颈。  
用户关心的不是功能是否可用，而是：
- UPSERT 路径是否能真正利用 SPJ；
- skew 数据下 `NOT MATCHED` 路径是否拖垮整体吞吐；
- Spark SQL 配置与 Iceberg MERGE 执行计划是否有最佳实践。

这说明 Iceberg 在湖仓场景下，**MERGE 性能优化仍是高价值议题**。

---

### 4.3 Kafka Connect stale DataWritten 恢复逻辑仍在推进
- **PR #15651** `[OPEN] [docs, build, KAFKACONNECT] Per-commitId group separation for stale DataWritten recovery`  
  链接: https://github.com/apache/iceberg/pull/15651

该 PR 试图解决 commit 失败或超时后旧 `DataWritten` 事件残留、并在下次提交时被混入的问题。  
背后技术诉求是：
- 保证 Kafka Connect sink 的 commit 边界清晰；
- 避免 stale 事件污染新提交；
- 提升 at-least-once / recovery 语义下的数据正确性与吞吐稳定性。

这是连接器可靠性的重要主题。

---

## 5. Bug 与稳定性

以下按严重程度与影响面排序：

### P1：Spark 视图被错误表现为表，影响 SQL 语义正确性
- **Issue #15779** `[OPEN] [bug] Spark: Iceberg views are not created as views and are appearing as tables.`  
  链接: https://github.com/apache/iceberg/issues/15779
- 状态：**暂无对应 fix PR**
- 影响：
  - 破坏用户对 `CREATE VIEW` 的预期；
  - 可能影响 catalog 浏览、元数据管理与下游工具集成；
  - 属于 SQL 兼容性/对象类型语义问题。

---

### P1：Z-order rewrite 不支持 TimestampNTZ，导致 rewrite_data_files 失败
- **Issue #15777** `[OPEN] Spark: Z-order rewrite fails for TimestampNTZ columns in rewrite_data_files`  
  链接: https://github.com/apache/iceberg/issues/15777
- 状态：**暂无 fix PR**
- 影响：
  - 直接导致 `rewrite_data_files(strategy='sort', sort_order='zorder(...)')` 在特定列类型上失败；
  - 影响 Spark 上的数据布局优化；
  - 属于查询加速/文件重写能力受限问题。

---

### P1：Core Schema.findField 对 map struct key 的短路径访问异常
- **Issue #15785** `[OPEN] [bug] Core: Map struct key fields not accessible via short names`  
  链接: https://github.com/apache/iceberg/issues/15785
- **PR #15786** `[OPEN] [API] Core: Map struct key fields not accessible via short names`  
  链接: https://github.com/apache/iceberg/pull/15786
- 状态：**已有 fix PR**
- 影响：
  - 复杂 schema 下字段解析不一致；
  - map key 是 struct 时，短名寻址失败，而 value 却可用；
  - 可能波及表达式解析、schema 演进及工具链行为一致性。

这是今天最典型的“**问题发现即跟进修复**”案例。

---

### P1：Manifest 过滤流程可能引发死锁
- **PR #15713** `[OPEN] [core] Core: close entries iterable in ManifestFilterManager`  
  链接: https://github.com/apache/iceberg/pull/15713
- 状态：**修复进行中**
- 影响：
  - 核心元数据处理链路稳定性；
  - 可能造成资源泄露、阻塞与过滤异常；
  - 对高并发或复杂删除场景风险较高。

---

### P2：Flink Quickstart 在 arm64 上因 MinIO 默认镜像崩溃
- **Issue #15774** `[OPEN] [bug] Flink quickstart MinIO image defaults break on arm64`  
  链接: https://github.com/apache/iceberg/issues/15774
- **PR #15772** `[OPEN] [docs] Docs: Fix Flink Getting Started page`  
  链接: https://github.com/apache/iceberg/pull/15772
- 状态：**有文档修正 PR，但未见针对镜像默认值的完整功能修复**
- 影响：
  - 新用户 onboarding；
  - Apple Silicon / arm64 本地实验环境；
  - 文档可执行性与首次体验。

---

### P2：`write.target-file-size-bytes` 是否包含压缩后大小定义不清
- **Issue #15754** `[OPEN] [question] Question - Is write.target-file-size-bytes including compression or not?`  
  链接: https://github.com/apache/iceberg/issues/15754
- 状态：**文档/语义澄清需求，暂无修复 PR**
- 影响：
  - 文件大小调优；
  - Parquet/压缩参数与写入行为预期；
  - 性能与小文件治理策略。

虽然是 question，但本质上暴露了**关键参数语义文档不足**的问题。

---

### P3：`RewriteTablePathUtil.relativize()` 边界条件 bug 已关闭
- **Issue #15172** `[CLOSED] [bug] RewriteTablePathUtil.relativize() fails when path equals prefix`  
  链接: https://github.com/apache/iceberg/issues/15172

该问题在路径等于 prefix 时抛出异常，今天已关闭。  
这说明 `rewrite_table_path` 工具链中的一个边界行为已得到处理，属于**工具稳定性改进**。

---

## 6. 功能请求与路线图信号

### 6.1 Flink Sink per-record metadata 插件能力有较大进入版本机会
- **Issue #15783**  
  链接: https://github.com/apache/iceberg/issues/15783
- **PR #15784**  
  链接: https://github.com/apache/iceberg/pull/15784

由于 feature request 当天就有实现 PR，说明该需求：
- 场景明确；
- 设计边界清晰；
- 与现有 Sink V2 架构契合。

**纳入下一版本的概率较高**，尤其适合强调可观测性、审计与 lineage 的版本节奏。

---

### 6.2 ORC lineage 补齐是 V3 表能力完善的重要信号
- **PR #15776**  
  链接: https://github.com/apache/iceberg/pull/15776

如果合并，将补齐 ORC 在 V3 lineage 上落后于 Parquet/Avro 的短板。  
这类工作通常不是“可选增强”，而是**规范能力完成度提升**，因此很可能进入近期版本。

---

### 6.3 Spark 小文件异步读取仍是中期性能路线重点
- **PR #15341** `[OPEN] [WIP] Spark: Make Spark readers function asynchronously for many small files`  
  链接: https://github.com/apache/iceberg/pull/15341

这是一个明显的中长期性能优化方向，针对大量小文件场景通过异步打开 task 来降低 IO/open 开销。  
尽管仍处于 WIP，但它反映出项目路线图中仍在持续投入：
- Spark 读性能；
- 小文件场景吞吐；
- 读取线程与任务调度模型优化。

---

### 6.4 V4 manifest 基础类型演进持续
- **PR #15049** `[OPEN] [API, core] API, Core: Introduce foundational types for V4 manifest support`  
  链接: https://github.com/apache/iceberg/pull/15049

该 PR 指向 v4 adaptive metadata tree / single-file commit 相关演进，是**更长期的元数据架构升级**信号。  
虽然短期内不一定直接面向终端用户，但它对未来 commit、manifest 读写与 metadata tree 设计影响深远。

---

### 6.5 AWS 客户端可配置性继续增强
- **PR #15304** `[OPEN] [build, AWS] Enable to configure metrics-publisher in AWS client factory`  
  链接: https://github.com/apache/iceberg/pull/15304
- **PR #15242** `[OPEN] [AWS] AWS: Add chunked encoding configuration for S3 requests`  
  链接: https://github.com/apache/iceberg/pull/15242

这些 PR 体现出对象存储与云环境适配仍在细化，重点方向包括：
- 监控/指标发布；
- S3 请求兼容性；
- 云端连接行为可配置化。

---

## 7. 用户反馈摘要

基于今日 Issues，可归纳出以下真实用户痛点：

### 7.1 用户最在意“能不能像标准 SQL 一样工作”
- 相关：
  - **Issue #15779** Spark view 变 table  
    https://github.com/apache/iceberg/issues/15779
  - **Issue #11440** s3_catalog 下 Spark 创建 view 不支持  
    https://github.com/apache/iceberg/issues/11440

这反映出很多用户是从 Spark SQL / Hive SQL 的日常使用视角接触 Iceberg，希望 catalog 对视图等对象提供**一致、直观、接近传统数仓的语义**。

---

### 7.2 用户希望性能优化特性在复杂写入场景下真正生效
- 相关：
  - **Issue #14198** SPJ + MERGE + skew 数据性能问题  
    https://github.com/apache/iceberg/issues/14198

用户并不满足于“功能可用”，而是在乎：
- UPSERT 是否足够快；
- skew 下是否会退化；
- 配置是否能真正映射到执行优化。

这说明 Iceberg 的目标用户中，已有相当比例进入了**大规模生产 UPSERT**阶段。

---

### 7.3 用户对文件大小控制与压缩语义有较强困惑
- 相关：
  - **Issue #15754** `write.target-file-size-bytes` 是否包含压缩  
    https://github.com/apache/iceberg/issues/15754

这类问题通常出现在已经进入生产调优阶段的用户群体中，说明用户正在细化：
- 文件大小治理；
- 读写性能平衡；
- Parquet 压缩与 target size 策略。

---

### 7.4 新用户依赖文档快速起步，但文档/示例的架构兼容性不足
- 相关：
  - **Issue #15774** arm64 下 Flink quickstart 崩溃  
    https://github.com/apache/iceberg/issues/15774
  - **PR #15772** Flink 文档修订  
    https://github.com/apache/iceberg/pull/15772

这说明文档不仅要“语法正确”，还要：
- 在不同 CPU 架构上可执行；
- 版本模板正确；
- 示例与当前生态版本保持同步。

---

## 8. 待处理积压

以下长期未完成但较重要的事项值得维护者持续关注：

### 8.1 Spark 小文件异步读取 WIP，性能收益潜力大
- **PR #15341**  
  链接: https://github.com/apache/iceberg/pull/15341

该 PR 自 2026-02-16 起持续推进，目标明确、收益面广，建议维护者优先推动设计收敛与 benchmark 输出。

---

### 8.2 V4 manifest 支撑是长期架构演进关键路径
- **PR #15049**  
  链接: https://github.com/apache/iceberg/pull/15049

该 PR 自 2026-01-14 挂起至今，关系到更深层元数据演进。建议明确阶段目标、拆分子 PR，以降低评审门槛。

---

### 8.3 Jetty/GZIP 构建切换依赖外部前置条件，存在阻塞
- **PR #15043** `[OPEN] Build: Switch Jetty to use new Compression API for GZIP`  
  链接: https://github.com/apache/iceberg/pull/15043

该 PR 依赖另一个 Jetty 升级 PR，属于典型的链式阻塞。若不尽快处理，可能持续拖延 build / AWS / OpenAPI 相关模块的依赖更新。

---

### 8.4 AWS 客户端增强 PR 挂起时间较长
- **PR #15304**  
  链接: https://github.com/apache/iceberg/pull/15304
- **PR #15242**  
  链接: https://github.com/apache/iceberg/pull/15242

这两项都关系到云环境配置灵活性，建议维护者评估：
- 是否需要补测试；
- 是否存在 API 稳定性顾虑；
- 能否合并为统一的 AWS client configurability 路线。

---

## 结论

今天的 Apache Iceberg 呈现出典型的**高活跃工程化推进日**：没有版本发布，但在 Spark/Flink/Core/AWS/Kafka Connect 多条线上同步演进。  
从新增问题看，**Spark SQL 兼容性、复杂 schema 行为一致性、文档可执行性、性能调优可解释性**仍是最直接影响用户体验的主题。  
从 PR 动向看，项目短期重点是**补齐引擎适配和稳定性边角**，中长期则继续向 **V4 metadata、异步读取、小文件性能优化、lineage 完整性**推进。  
整体判断：**项目健康，响应快，但需要继续压缩 Spark 兼容性和文档落地的用户摩擦成本。**

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-27）

## 1. 今日速览

过去 24 小时，Delta Lake 维持了**较高开发活跃度**：共有 **50 条 PR 更新**，其中 **25 条仍待合并，25 条已合并或关闭**，显示出核心维护者仍在持续推进多条开发线。  
本日没有新版本发布，但从 PR 和 Issue 内容看，项目重点仍集中在 **Delta Kernel、Spark DSv2/Unity Catalog 集成、Flink Sink 路线、共享/服务端规划能力** 等方向。  
Issue 数量不多（3 条），但都具有明确技术指向：**文档一致性、Kernel 异常结构化、Flink Sink 总体路线追踪**，说明社区当前更偏向中后期能力打磨，而非大规模新问题爆发。  
整体判断：**项目健康度良好，开发节奏偏工程化与平台化，短期内可能继续围绕 Kernel API 稳定性、DSv2 建表链路和 UC/Server-side 生态能力推进。**

---

## 2. 项目进展

> 注：今日数据中未明确给出 merged 状态与逐条合并标签的完整对应关系，以下按“已关闭/推进明显的 PR”与“值得关注的进行中 PR”分别总结。

### 2.1 今日关闭/收敛的重要 PR

#### 1) 回滚 UC OSS 主干测试变更
- **PR #6312** Revert "Test UC OSS main in UC workflow"  
- 链接: delta-io/delta PR #6312

该 PR 表明维护者对 **Unity Catalog 相关 CI 工作流** 采取更谨慎策略。回滚测试主干集成通常意味着此前流程存在不稳定性、上游兼容性不足，或在当前阶段影响 CI 可靠性。  
**意义**：优先保障主仓库 CI 可预测性，避免外部依赖不稳定拖慢核心开发节奏。

#### 2) 固定 Unity Catalog CI 依赖提交
- **PR #6252** Pin Unity Catalog commit for CI  
- 链接: delta-io/delta PR #6252

该变更进一步强化了 CI 环境的可重复性。对于 Delta 这类同时覆盖 Spark / Kernel / UC / Streaming 多技术面的项目，固定依赖提交能显著减少“非代码问题导致的回归”。  
**意义**：属于基础设施稳定性改进，对后续功能开发和回归验证有直接正向作用。

#### 3) 新增 UC staged replace handoff 支持
- **PR #6251** Add UC staged replace handoff support  
- 链接: delta-io/delta PR #6251

从标题看，这是 **Unity Catalog 与 staged replace / 原子替换表流程** 相关的能力增强，可能服务于 DSv2 或 catalog 层的更完整建表/替换语义。  
**意义**：这类改动通常直接影响 **表元数据管理、原子 DDL 语义、Catalog 协作能力**，对企业级治理场景重要。

#### 4) 基础设施并行度提升
- **PR #6125** [INFRA] Increase shards from 4 to 8  
- 链接: delta-io/delta PR #6125

测试分片从 4 提升到 8，反映出测试规模上升、CI 压力增加。  
**意义**：不直接增加用户功能，但会改善开发反馈速度，缩短 PR 验证周期，间接提升项目交付能力。

---

### 2.2 今日值得关注的进行中 PR

#### 1) DSv2 CREATE TABLE 基础设施建设
- **PR #6377** Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE  
- 链接: delta-io/delta PR #6377

这是一个非常明确的信号：Delta 正在继续补强 **DataSource V2 下的 CREATE TABLE 基础设施**。  
**技术影响**：
- 有助于统一 DDL 上下文对象模型；
- 为后续 **原子建表、catalog 集成、UC 对接、SQL 兼容性增强** 打基础；
- 可能是一个 stacked PR 链的起点，后面还会有 builder、planner 或 execution 层补充。

#### 2) Snapshot 路径转换逻辑修复
- **PR #6162** [delta-metadata] [Spark] Remove path transformation from Snapshot  
- 链接: delta-io/delta PR #6162

该 PR 直指 Snapshot 中的路径变换问题，关联 fix #6159。  
**技术影响**：
- 可能涉及路径规范化错误、对象存储 URI 兼容、catalog/path 混用语义；
- 对读取一致性和元数据解析准确性有直接影响；
- 属于典型的“SQL/元数据语义修正类问题”。

#### 3) 协议层压缩设置 RFC
- **PR #6324** [RFC] for compression setting  
- 链接: delta-io/delta PR #6324

这不是直接代码实现，而是协议层或格式层的设计提案。  
**技术影响**：
- 可能重新定义或规范 **Parquet 压缩策略**；
- 对写入性能、文件大小、跨引擎行为一致性都有潜在影响；
- 若通过，可能成为后续版本的重要配置/协议演进点。

#### 4) Kernel 地理空间统计解析增强
- **PR #6301** [Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings  
- 链接: delta-io/delta PR #6301

这是一个非常有代表性的 **分析型引擎能力扩展**。  
**技术影响**：
- 改进 Kernel 对 geometry/geography 类型统计信息的解析；
- 若上层引擎依赖这些统计信息，可改善 **谓词裁剪、元数据过滤、空间数据互通**；
- 说明 Delta Kernel 正在朝着更广泛数据类型支持推进。

#### 5) Sharing 源读取 offset 结束条件修复
- **PR #6392** DeltaFormatSharingSource only finish current version when startOffset is from Legacy  
- 链接: delta-io/delta PR #6392

该 PR 指向 Delta Sharing 数据源在 offset/版本推进逻辑上的边界条件修正。  
**技术影响**：
- 涉及流式或增量读取语义；
- 若处理不当，可能出现重复消费、跳版本或读取结束判定不正确；
- 对共享场景下的正确性比较关键。

#### 6) Server-side Planning 增加 OAuth 支持
- **PR #6360** [ServerSidePlanning] Add OAuth support  
- 链接: delta-io/delta PR #6360

这是今天非常重要的一条平台化信号。  
**技术影响**：
- 将静态 bearer token 扩展为基于 `tokenSupplier` 的按请求鉴权；
- 支持 OAuth client credentials flow；
- 对企业环境、统一身份认证、长生命周期连接器来说意义很大。  
这类能力往往是走向生产化部署的前提条件。

---

## 3. 社区热点

### 热点 1：DSv2 建表链路基础设施
- **PR #6377** Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE  
- 链接: delta-io/delta PR #6377

虽然评论数未显示，但从 stacked PR 结构看，这是一个**核心架构演进型 PR**。  
**背后技术诉求**：Delta 希望更完整地拥抱 Spark DSv2 生态，把建表、替换表、catalog 对接、UC 接口统一到更现代的执行框架中。这通常意味着未来会出现更多 **SQL DDL 兼容性增强、原子建表能力、catalog 语义统一** 的改进。

### 热点 2：压缩设置 RFC
- **PR #6324** [RFC] for compression setting  
- 链接: delta-io/delta PR #6324

这类 RFC 通常是社区关注度高的议题。  
**背后技术诉求**：
- 用户需要更可控的压缩策略；
- 不同压缩算法会影响查询 IO、CPU 开销、文件体积及跨系统互操作；
- 若协议层落地，将影响 Spark 写入行为甚至其他连接器实现。

### 热点 3：Kernel 结构化异常需求
- **Issue #6380** [Feature Request] [kernel-spark] startVersionNotFound should throw a structured exception exposing earliestAvailableVersion  
- 链接: delta-io/delta Issue #6380

这是今天最值得关注的 Kernel API 反馈之一。  
**背后技术诉求**：
- 当前异常把 `earliestAvailableVersion` 仅嵌入字符串，不利于程序化恢复；
- 调用方无法可靠地根据异常字段进行 fallback、重试或自动回退；
- 这反映出 Kernel 用户开始要求 **更稳定、机器可消费的错误模型**，这是 API 走向成熟的重要标志。

### 热点 4：Flink Sink 路线图持续推进
- **Issue #5901** [Flink] Create Delta Kernel based Flink Sink  
- 链接: delta-io/delta Issue #5901

这是一个 epic issue，说明 Flink Sink 不是单点功能，而是系统性工程。  
**背后技术诉求**：
- 用 Delta Kernel 构建 Flink Sink，意味着共享底层协议/事务逻辑；
- 有助于减少 Spark/Flink 生态间的实现割裂；
- 对实时摄取、流批一体、Flink 用户群体扩展都很关键。

---

## 4. Bug 与稳定性

按严重程度排序：

### P1：共享读取版本推进语义潜在正确性问题
- **PR #6392** DeltaFormatSharingSource only finish current version when startOffset is from Legacy  
- 链接: delta-io/delta PR #6392

**风险判断**：较高。  
涉及 Sharing Source 的 offset/version 结束条件，如果逻辑错误，可能影响：
- 增量消费正确性；
- 流式处理结束判定；
- 版本边界下的数据重复或遗漏。  

**是否已有 fix PR**：有，当前 PR 即为修复候选。

---

### P2：Snapshot 路径转换可能导致元数据/读取兼容问题
- **PR #6162** [delta-metadata] [Spark] Remove path transformation from Snapshot  
- 链接: delta-io/delta PR #6162

**风险判断**：中高。  
路径变换问题通常会在以下场景触发：
- 云对象存储 URI；
- 编码/规范化差异；
- catalog 路径与物理路径交互。  

这类问题可能表现为“偶发找不到文件/错误定位快照/路径不一致”。  
**是否已有 fix PR**：有，PR 正在推进。

---

### P3：文档误导导致功能可用性认知错误
- **Issue #2748** [BUG][Documentation] withEventTimeOrder not available, confusing user experience  
- 链接: delta-io/delta Issue #2748

**风险判断**：中。  
虽然不是内核崩溃类 Bug，但对用户体验影响明确：文档宣称支持 `withEventTimeOrder`，实际在相关上下文中不可用。  
这会造成：
- 用户按文档尝试失败；
- 错误归因到自身环境；
- 对 Delta 文档可信度产生影响。  

**是否已有 fix PR**：数据中未看到直接对应修复 PR；建议维护者尽快补文档。

---

### P3：Kernel 异常模型不利于调用方恢复
- **Issue #6380** structured exception exposing earliestAvailableVersion  
- 链接: delta-io/delta Issue #6380

严格来说更偏 **可维护性/API 可用性问题**，但会影响依赖方处理版本缺失场景的稳定性。  
**是否已有 fix PR**：暂未看到对应 PR。

---

## 5. 功能请求与路线图信号

### 1) Delta Kernel 结构化异常
- **Issue #6380**  
- 链接: delta-io/delta Issue #6380

这是明确的新功能请求，而且需求表达非常具体：希望 `startVersionNotFound` 抛出**结构化异常**并暴露 `earliestAvailableVersion`。  
**纳入下一版本可能性：中高**。  
原因：
- 实现范围相对可控；
- 直接提升 API 可编程性；
- 与 Kernel 稳定化方向一致。

---

### 2) Flink Sink 持续建设
- **Issue #5901**  
- 链接: delta-io/delta Issue #5901

这是路线图级别信号，不是一次性请求。  
**纳入后续版本可能性：高**。  
原因：
- 已经以 epic 形式组织；
- 明确包含 milestone 与关联 PR；
- 说明团队已有连续投入，而非停留在讨论阶段。

---

### 3) 协议层压缩设置
- **PR #6324** [RFC] for compression setting  
- 链接: delta-io/delta PR #6324

虽然是 PR 不是 Issue，但本质上属于**功能与协议设计提案**。  
**纳入后续版本可能性：中高**。  
原因：
- 已形成 RFC；
- 压缩设置对性能/存储成本敏感，用户需求普遍；
- 但因涉及协议/兼容性，推进节奏可能谨慎。

---

### 4) 企业认证能力增强
- **PR #6360** [ServerSidePlanning] Add OAuth support  
- 链接: delta-io/delta PR #6360

这是非常强的产品化信号。  
**纳入下一版本可能性：高**。  
原因：
- 已有实现 PR；
- 适合企业生产环境；
- 与 UC / REST / 服务端规划能力演进高度一致。

---

### 5) DSv2 CREATE TABLE 能力补强
- **PR #6377** Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE  
- 链接: delta-io/delta PR #6377

**纳入下一版本可能性：高**。  
原因：
- 属于基础设施型改进；
- 已采用 stacked PR 模式系统推进；
- 往往不是实验性需求，而是既定路线的一部分。

---

## 6. 用户反馈摘要

### 1) 文档和实际能力不一致仍是直接痛点
- **Issue #2748**  
- 链接: delta-io/delta Issue #2748

用户明确指出：文档描述了 `withEventTimeOrder`，但当前上下文下不可用，造成困惑。  
**反映的真实场景**：
- 用户依赖官方文档配置流式/时序相关选项；
- 功能差异可能与 connector、版本或上下文环境有关；
- 当文档未清晰限定适用范围时，会导致用户误配。

### 2) Kernel 用户正在进入更复杂的自动化使用阶段
- **Issue #6380**  
- 链接: delta-io/delta Issue #6380

用户不满足于“人能看懂”的错误信息，而希望异常携带结构化字段。  
**反映的真实场景**：
- 调用方不是手工操作，而是程序自动处理；
- 需要依据 earliest available version 做 fallback/recovery；
- Kernel 正被更多地嵌入到中间层、网关或数据服务中。

### 3) Flink 用户期待原生而非拼装式接入
- **Issue #5901**  
- 链接: delta-io/delta Issue #5901

从 epic issue 可见，Flink 社区并不满足于外围适配，而期待**基于 Delta Kernel 的正式 Sink**。  
**反映的真实场景**：
- 实时写入 Delta 的需求增加；
- 希望复用 Kernel 统一事务/协议能力；
- 希望降低 Spark-only 依赖。

---

## 7. 待处理积压

### 1) 文档 Bug 长期开放，建议尽快处理
- **Issue #2748** opened 2024-03-12，最近更新 2026-03-26  
- 链接: delta-io/delta Issue #2748

这是一个已开放较长时间的问题，且仍可能影响新用户。  
**建议**：即使代码层暂不支持，也应尽快在文档中补充适用范围、版本条件或替代方案。

### 2) Snapshot 路径修复 PR 持续未合并
- **PR #6162** created 2026-02-27  
- 链接: delta-io/delta PR #6162

该 PR 涉及路径与元数据语义，影响面可能较广。  
**建议**：维护者应尽快明确 review 结论，避免问题长期悬而未决。

### 3) 地理空间统计支持仍在推进中
- **PR #6301** created 2026-03-17  
- 链接: delta-io/delta PR #6301

空间类型支持对部分高阶分析用户很关键。  
**建议**：若设计上无阻塞，宜尽快给出是否接受的方向性反馈。

### 4) 压缩设置 RFC 需要尽快沉淀结论
- **PR #6324** created 2026-03-19  
- 链接: delta-io/delta PR #6324

协议相关 RFC 如果长期无结论，容易让周边实现与用户配置预期分叉。  
**建议**：尽快在兼容性、默认值、跨引擎行为上形成共识。

---

## 8. 总体判断

今天的 Delta Lake 没有版本发布，但从工程推进来看是一个**“底层能力持续夯实”的工作日**：  
- **Kernel** 继续朝更成熟 API 和更丰富类型支持演进；  
- **Spark/DSv2/UC** 方向明显在补基础设施与企业集成能力；  
- **Flink Sink** 路线保持推进，说明 Delta 正持续扩展多引擎生态；  
- **稳定性方面**，Sharing offset、Snapshot 路径、CI 依赖收敛仍是当前重点。  

整体上，项目状态偏健康，且具备明确路线图信号。若接下来这些进行中的 PR 顺利合并，下一阶段版本很可能在 **DSv2 DDL、OAuth/服务端规划、Kernel API 可用性、Flink 生态扩展** 上出现更实质性的用户可见进展。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 · 2026-03-27

## 1. 今日速览

过去 24 小时，Databend 仓库整体保持**中高活跃度**：无 Issue 更新，但有 **14 条 PR 更新**，其中 **11 条待合并，3 条已合并/关闭**。  
从 PR 内容看，开发重点集中在 **查询引擎能力扩展、SQL Binder/Planner 重构、聚合/Join 内存与溢写稳定性修复，以及 FUSE 表元数据能力增强**。  
今天没有新版本发布，说明当前节奏更偏向于**持续集成与功能打磨**，而非版本交付。  
值得注意的是，多个 PR 指向同一方向：**提高 SQL 兼容性、完善执行器正确性，并为后续复杂分析场景做基础设施铺垫**。  

---

## 2. 项目进展

### 已合并/关闭的重要 PR

#### 2.1 实验性表标签能力方案调整
- **PR**: #19549 `[CLOSED]` feat(query): support experimental table tags for FUSE table snapshots  
- **链接**: https://github.com/databendlabs/databend/pull/19549

该 PR 虽已关闭，但从摘要可见，其尝试为 FUSE 表快照引入新的 **KV-backed table tag model**，不再复用旧的 branch/tag 表引用实现。这说明 Databend 正在探索更清晰的**表版本管理语义**，包括分支、标签与快照之间的治理模型。

**影响判断：**
- 对 Lakehouse/数据版本化使用场景是重要信号；
- 关闭并不意味着方向终止，更可能是方案重整或被后续 PR 替代；
- 与当前仍在开放中的 **table branch** PR 形成呼应，说明版本化表管理仍是近期重点。

---

#### 2.2 gRPC 网络传输延迟优化
- **PR**: #19619 `[CLOSED]` feat: enable TCP_NODELAY on gRPC listener sockets  
- **链接**: https://github.com/databendlabs/databend/pull/19619

该改动通过升级 `databend-meta` 版本以引入 **TCP_NODELAY** 修复，避免 Nagle 算法对小包 gRPC 消息的缓冲。  
这类改动虽然表面是网络栈调优，但对 Meta 服务的**低延迟交互、控制面响应时间、分布式协调效率**都有实际价值。

**推进意义：**
- 改善高频小消息场景下的尾延迟；
- 对元数据服务交互敏感的集群部署尤其有帮助；
- 属于典型的“用户无感但系统收益明确”的底层健康优化。

---

#### 2.3 仓库协作规范文档更新
- **PR**: #19617 `[CLOSED]` fix: clarify AGENTS.md guidance for conflicts and patterns  
- **链接**: https://github.com/databendlabs/databend/pull/19617

这是面向协作流程的文档澄清，不直接影响数据库功能，但有助于提升自动化/Agent 参与开发时的一致性和冲突处理方式。  
对项目治理层面是正向信号，不过不属于核心引擎进展。

---

### 今日值得关注的开放 PR

#### 2.4 查询引擎：实验性 table branch 支持
- **PR**: #19551 `[OPEN]` feat(query): support experimental table branch  
- **链接**: https://github.com/databendlabs/databend/pull/19551

这是今天最重要的功能线索之一。Databend 正在朝着**表级分支管理**推进，明显对标现代数据版本化工作流，适合：
- 数据实验隔离；
- 回滚与快照验证；
- 多团队并行开发数据对象。

若合入，将显著增强 Databend 在“可版本化分析存储”方向的产品辨识度。

---

#### 2.5 查询执行：分区式哈希 Join 支持
- **PR**: #19553 `[OPEN]` refactor(query): support partitioned hash join  
- **链接**: https://github.com/databendlabs/databend/pull/19553

这是典型的执行引擎基础能力增强。**partitioned hash join** 往往用于降低大表 Join 的内存压力，提升可扩展性，并为 spilling / 多阶段执行提供更好的结构基础。

**可能收益：**
- 大 Join 场景更稳；
- 更适合内存受限环境；
- 与聚合 spilling 修复形成协同，显示团队正在系统性补齐资源受限下的执行稳定性。

---

#### 2.6 聚合绑定重构
- **PR**: #19579 `[OPEN]` refactor(sql): separate aggregate registration and reuse in binder  
- **链接**: https://github.com/databendlabs/databend/pull/19579

该 PR 将 builtin aggregates、UDAF、group items、grouping metadata 纳入统一的 `AggregateInfo` 注册/绑定路径。  
这类 Binder 重构的价值通常在于：
- 降低语义分叉；
- 方便扩展 UDAF；
- 减少聚合相关 SQL 解析/绑定上的边角 bug；
- 为后续复杂聚合语义打基础。

---

#### 2.7 Projection 绑定重构
- **PR**: #19618 `[OPEN]` refactor(sql): projection-bind  
- **链接**: https://github.com/databendlabs/databend/pull/19618

虽然摘要信息较少，但从标题看是 SQL binder 中对 projection 绑定逻辑的重构。  
这通常会影响：
- 列别名解析；
- select list 语义一致性；
- planner 的输出 schema 构建。

若与聚合绑定重构一同推进，说明 Databend 正在对 SQL 前端做较系统的内部整理。

---

#### 2.8 Bloom Index：新增 binary fuse32 选项
- **PR**: #19621 `[OPEN]` feat: add binary fuse32 bloom index option  
- **链接**: https://github.com/databendlabs/databend/pull/19621

该 PR 为表选项新增 `bloom_index_type`，支持 `xor8` 和 `binary_fuse32`，默认仍为 `xor8`。  
这是非常明确的**存储层索引优化**方向，表明 Databend 正在为 FUSE 表 bloom 索引提供更灵活的实现选择。

**潜在价值：**
- 不同滤器在空间效率、构建速度、误判率上可做权衡；
- 为不同数据分布和查询模式提供更优配置；
- 说明 FUSE 存储索引层仍在持续打磨。

---

#### 2.9 空间类型聚合函数支持
- **PR**: #19620 `[OPEN]` feat(query): Support Geometry and Geography aggregate functions  
- **链接**: https://github.com/databendlabs/databend/pull/19620

这显示 Databend 正在增强 GIS / 地理空间分析能力。  
如果后续配套函数体系完整，将提升其在位置数据分析、地图数据聚合等场景中的可用性。

---

## 3. 社区热点

> 注：提供的数据中未包含评论数/点赞数的具体值，均显示为 `undefined` 或 `0`，因此这里按**技术影响面和更新活跃度**识别热点。

### 热点 1：实验性表分支能力
- **PR**: #19551  
- **链接**: https://github.com/databendlabs/databend/pull/19551

**技术诉求分析：**  
用户和维护者显然都在推动 Databend 的**数据版本管理**能力，从已关闭的 table tags 方案到当前开放的 table branch，可以看出团队在寻找更稳定、可维护的抽象方式。  
这类能力通常服务于：
- 开发/测试环境的数据隔离；
- 数据回溯与审计；
- 类 Git 的数据对象分支工作流。

---

### 热点 2：分区式哈希 Join
- **PR**: #19553  
- **链接**: https://github.com/databendlabs/databend/pull/19553

**技术诉求分析：**  
分析型数据库在大规模 Join 场景下，内存与 spill 管理是核心竞争力。这个 PR 的出现，表明 Databend 用户侧或维护侧都在关注：
- 大表 Join 稳定性；
- 内存峰值控制；
- 执行器在复杂 OLAP 查询中的可预测性。

---

### 热点 3：聚合溢写与内存使用修复
- **PR**: #19622  
- **链接**: https://github.com/databendlabs/databend/pull/19622

**技术诉求分析：**  
该 PR 直接指向 aggregation 的 spilling 问题和内存使用优化，是典型高优先级稳定性工作。  
其背后反映的真实需求通常是：
- GROUP BY / DISTINCT 场景下的 OOM 或性能抖动；
- 磁盘溢写路径不稳定；
- 执行器内存估算偏差。

---

### 热点 4：Bloom Index 可配置化
- **PR**: #19621  
- **链接**: https://github.com/databendlabs/databend/pull/19621

**技术诉求分析：**  
这说明 Databend 不仅在做“有无索引”的功能补齐，也在做**索引实现质量与可配置性**升级。  
对重过滤、低选择性扫描优化、湖仓存储表剪枝效率都有实际意义。

---

## 4. Bug 与稳定性

按影响程度排序如下：

### P1：聚合溢写与内存管理问题
- **PR**: #19622 `[OPEN]` fix(query): resolve spilling problems and refine memory usage in aggregation  
- **链接**: https://github.com/databendlabs/databend/pull/19622

**问题类型：**
- 查询执行稳定性；
- 内存占用控制；
- spill 路径正确性/可用性。

**影响：**
- 对大聚合查询影响很大；
- 可能导致 OOM、执行退化或结果生成不稳定；
- 这是典型 OLAP 生产级风险点。

**状态：**
- 已有修复 PR，尚未合并。

---

### P1：执行器 OOM 错误映射不准确
- **PR**: #19614 `[OPEN]` fix: rename PanicError and fix executor OOM mapping  
- **链接**: https://github.com/databendlabs/databend/pull/19614

**问题类型：**
- 错误码语义混淆；
- OOM/flush failure 诊断不准确；
- `PanicError` 命名误导。

**影响：**
- 影响用户排障；
- 可能误导监控告警与自动化恢复逻辑；
- 对稳定性治理和可观测性是高优先级修复。

**状态：**
- 已有 fix PR，且标记为 `agent-approved`。

---

### P1：FULL OUTER JOIN + USING 的空值性对齐问题
- **PR**: #19616 `[OPEN]` fix(query): align full outer USING nullability  
- **链接**: https://github.com/databendlabs/databend/pull/19616

**问题类型：**
- 查询正确性；
- planner 输出 schema 与 hash join 实际输出不一致。

**影响：**
- 可能导致 FULL OUTER JOIN 结果 schema 错误；
- 属于 SQL 语义正确性问题，严重程度高于普通性能 bug。

**状态：**
- 已有 fix PR。

---

### P2：ALTER TABLE ADD COLUMN IF NOT EXISTS 兼容性缺失
- **PR**: #19615 `[OPEN]` fix(query): support IF NOT EXISTS for ALTER TABLE ADD COLUMN  
- **链接**: https://github.com/databendlabs/databend/pull/19615

**问题类型：**
- SQL 兼容性；
- DDL 幂等性不足。

**影响：**
- 自动化 schema migration 工具可能受影响；
- 重复执行 DDL 时无法优雅 no-op；
- 对运维和 CI/CD 场景比较关键。

**状态：**
- 已有 fix PR，并附带 Rust/SQL 回归测试。

---

### P2：Variant 转数值转换行为修复
- **PR**: #19623 `[OPEN]` fix(query): fix variant cast to number  
- **链接**: https://github.com/databendlabs/databend/pull/19623

**问题类型：**
- 类型转换兼容性；
- 半结构化数据处理正确性。

**影响：**
- JSON/Variant 数据分析时可能出现意外转换失败；
- 当前修复允许浮点 Variant 转整数，采用 rounding 语义。

**状态：**
- 已有 fix PR。

---

### P3：gRPC 小包传输延迟
- **PR**: #19619 `[CLOSED]` feat: enable TCP_NODELAY on gRPC listener sockets  
- **链接**: https://github.com/databendlabs/databend/pull/19619

**问题类型：**
- 网络性能/尾延迟。

**影响：**
- 对控制面和元数据服务响应时间有持续影响；
- 已关闭，视为问题已被吸收或处理完毕。

---

## 5. 功能请求与路线图信号

虽然今日没有新增 Issue，但从 PR 走向可以清楚看到下一阶段路线图信号：

### 5.1 表版本化/分支管理将继续推进
- **相关 PR**: #19551, #19549  
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19551  
  - https://github.com/databendlabs/databend/pull/19549

**判断：**  
实验性 `table branch` 与此前 `table tags` 的探索说明，Databend 正把“**表对象版本控制**”作为中期能力建设方向。  
这很可能会进入后续版本，但具体 API/元数据模型可能仍在迭代。

---

### 5.2 执行引擎会继续向大查询稳定性演进
- **相关 PR**: #19553, #19622  
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19553  
  - https://github.com/databendlabs/databend/pull/19622

**判断：**  
分区式哈希 Join + 聚合溢写修复一起出现，通常不是孤立工作，而是执行引擎在向：
- 更强 spill 能力；
- 更低内存峰值；
- 更好的大规模 OLAP 稳定性  
持续演进的信号。

---

### 5.3 SQL 前端将持续重构，为 UDAF/复杂语义扩展铺路
- **相关 PR**: #19579, #19618  
- **链接**:  
  - https://github.com/databendlabs/databend/pull/19579  
  - https://github.com/databendlabs/databend/pull/19618

**判断：**  
聚合注册与 projection bind 重构，属于 SQL binder 层的系统整理。  
这通常预示着后续可能会更快支持：
- 更复杂聚合语法；
- 更好的 UDAF 扩展体验；
- 更一致的 SELECT/GROUP BY 语义处理。

---

### 5.4 FUSE 存储索引优化仍在深化
- **相关 PR**: #19621  
- **链接**: https://github.com/databendlabs/databend/pull/19621

**判断：**  
Bloom 索引引入 `binary_fuse32` 选项，说明团队不仅关注功能覆盖，也关注**底层索引实现的工程质量与可配置性**。  
这类工作很可能逐步进入默认配置策略、建表参数指导和性能调优文档。

---

### 5.5 地理空间分析能力在扩充
- **相关 PR**: #19620  
- **链接**: https://github.com/databendlabs/databend/pull/19620

**判断：**  
Geometry/Geography 聚合函数支持是一个非常具体的领域能力增强。  
若后续继续补充空间函数、索引和格式兼容，Databend 在时空数据分析方向会更有吸引力。

---

## 6. 用户反馈摘要

今天没有 Issue 更新，因此**缺少直接的用户评论样本**。不过从 PR 内容中仍可推断当前用户侧主要痛点集中在以下几个方面：

1. **复杂查询的资源稳定性**  
   - 聚合 spilling、内存使用、分区式 hash join 都指向大查询资源控制问题。  
   - 典型场景是大宽表聚合、复杂多表 Join、内存受限集群。

2. **SQL 兼容性与幂等 DDL 需求**  
   - `ALTER TABLE ADD COLUMN IF NOT EXISTS` 表明用户希望 Databend 更好适配自动化迁移框架。  
   - 这是典型生产化接入诉求。

3. **半结构化与复杂类型处理**
   - Variant cast 修复与空间类型聚合支持，说明用户正在把 Databend 用到 JSON/地理空间等更复杂的数据分析场景。

4. **数据对象版本化能力**
   - table branch / table tag 方向反映了用户或产品层面对数据开发工作流、审计、回滚、实验隔离的需求正在上升。

---

## 7. 待处理积压

以下是值得维护者持续关注的开放 PR，它们都具有较高技术价值：

### 7.1 #19551 实验性 table branch
- **状态**: OPEN，创建于 2026-03-15，最近更新 2026-03-26  
- **链接**: https://github.com/databendlabs/databend/pull/19551

**关注原因：**
- 涉及表版本管理核心抽象；
- 已存在相关关闭方案，说明设计仍可能有分歧；
- 建议尽快明确语义边界与兼容策略。

---

### 7.2 #19553 分区式哈希 Join
- **状态**: OPEN，创建于 2026-03-16，最近更新 2026-03-26  
- **链接**: https://github.com/databendlabs/databend/pull/19553

**关注原因：**
- 对执行引擎影响面大；
- 属于性能与稳定性基础设施；
- 若长期悬而未决，会拖慢后续 spilling/大查询优化链路。

---

### 7.3 #19579 聚合绑定重构
- **状态**: OPEN，创建于 2026-03-19，最近更新 2026-03-26  
- **链接**: https://github.com/databendlabs/databend/pull/19579

**关注原因：**
- SQL binder 核心逻辑改动，影响面广；
- 一旦合入，将影响未来聚合语义扩展；
- 建议重点关注回归测试覆盖度。

---

### 7.4 #19622 聚合 spilling 修复
- **状态**: OPEN，创建于 2026-03-26  
- **链接**: https://github.com/databendlabs/databend/pull/19622

**关注原因：**
- 直接关系生产稳定性；
- 虽然是新 PR，但优先级很高；
- 建议尽快补充 benchmark 或压力测试结果。

---

## 8. 健康度结论

Databend 今日没有版本发布，也没有新增/活跃 Issue，但从 PR 结构来看，项目仍处于**高质量演进状态**：  
- 一方面在推进 **table branch、空间聚合、bloom index 类型扩展** 这样的新能力；  
- 另一方面也在密集修复 **FULL OUTER JOIN 正确性、DDL 幂等、Variant cast、聚合 spill、OOM 错误映射** 等生产关键问题。  

整体判断：**项目健康度良好，研发重心明确，短期关注点集中在执行引擎稳定性与 SQL 前端重构的落地质量。**

---

如果你愿意，我还可以基于这份数据继续输出一版：
1. **更适合发到团队群里的简版日报**，或  
2. **更偏技术管理视角的周报式总结**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报（2026-03-27）

## 1. 今日速览

过去 24 小时内，Velox 共更新 **41 条开发活动**：**Issues 5 条**、**PR 36 条**，整体活跃度较高，尤其在 **cuDF/GPU 执行链路、Spark SQL 兼容性、Hive/S3 写入能力、CI 基础设施** 等方向持续推进。  
从状态看，**待合并 PR 29 条**，说明当前开发面较宽，社区与核心维护者都在积极推动功能演进；同时 **已合并/关闭 7 条 PR**，节奏稳定。  
今日没有新版本发布，但多个变更已明显指向下一阶段重点：**GPU 覆盖率提升、表达式/序列化 API 演进、云存储写路径对齐 Presto 行为**。  
稳定性方面，新增/活跃问题里既有 **查询正确性 bug**，也有 **GPU 适配缺口**，说明项目当前仍处于“快速扩展功能 + 持续补足兼容性边角”的健康迭代期。

---

## 3. 项目进展

### 已合并 / 已关闭的重要 PR

#### 1) Add ConcatExpr to IExpr hierarchy
- **PR**: #16927  
- **状态**: Merged  
- **链接**: facebookincubator/velox PR #16927

**进展解读：**  
该变更为 IExpr 表达式层次新增 `ConcatExpr`，用于在未解析表达式树中表示带字段名的 `ROW(expr AS name, ...)` 语义。这类能力对 **SQL 方言解析、Planner 到执行层之间的中间表达表示** 很关键。  
它不是直接的执行性能优化，但属于查询引擎前端能力增强，为后续 **更强的 SQL 方言兼容、命名 ROW 结构处理、表达式规范化** 打基础。

---

#### 2) Rewrite references of event_count shim target
- **PR**: #16902  
- **状态**: Merged  
- **链接**: facebookincubator/velox PR #16902

**进展解读：**  
该 PR 将仓库内对 `event_count` shim target 的引用统一替换为 `//folly/synchronization:event_count`。  
这类修改偏向 **构建依赖整理与基础设施清理**，价值在于减少技术债、避免 shim 层长期存在导致的维护复杂度，提升构建系统一致性。

---

#### 3) docs: Update official link for Gluten project
- **PR**: #16936  
- **状态**: Closed  
- **链接**: facebookincubator/velox PR #16936

**进展解读：**  
虽然只是文档更新，但反映出 Velox 与外围生态（如 Gluten）之间的联动仍在持续。对使用者来说，这有助于降低接入误导和信息过时带来的成本。

---

#### 4) build(cudf): Build the cudf in set up adapters environment
- **PR**: #16932  
- **状态**: Closed  
- **链接**: facebookincubator/velox PR #16932

**进展解读：**  
该 PR 被关闭，但从标题可看出社区正在继续打磨 **cuDF 适配器构建环境**。结合今日多个 cuDF 相关 issue/PR，可判断 GPU 方向是当前非常明确的主线，只是具体方案仍在迭代中。

---

### 今日值得关注的在途 PR

#### 5) feat(cudf): Add CudfEnforceSingleRow GPU operator
- **PR**: #16920  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16920

**价值：**  
为 `EnforceSingleRow` 增加 GPU 实现，目标是避免标量子查询场景下退回 CPU，保持 GPU pipeline 连续性。  
摘要里提到该算子在 **TPC-DS SF100 中出现 26 次**，这说明它不是边缘功能，而是影响真实分析查询的重要瓶颈点。若合入，将显著提高 cuDF 执行路径的完整度。

---

#### 6) refactor: Reland VectorSerde API changes with backward compatibility
- **PR**: #16912  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16912

**价值：**  
该 PR 是一次“带兼容保护的重引入”，通过 `VELOX_ENABLE_BACKWARD_COMPATIBILITY` 宏保护旧接口。  
这表明 Velox 在推进序列化 API 演进时，开始更重视 **下游工程（如 presto-trunk）兼容性**，有利于降低升级摩擦。

---

#### 7) feat: Add storageParameters to HiveInsertTableHandle
- **PR**: #16637  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16637

**价值：**  
为 Hive 写入句柄增加 `storageParameters`，让 coordinator 侧的表级元数据能传递到 native worker 写路径。  
这会增强 **Hive 写入语义完整性**，对连接器层和实际生产写入行为一致性都有帮助。

---

#### 8) feat(s3): Port hive.s3.min-part-size and enforce minimum part size
- **PR**: #16935  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16935

**价值：**  
将 Presto Java 的 `hive.s3.min-part-size` 行为带入 Velox，避免小文件也走 multipart upload。  
这属于典型的 **对象存储写入优化**：能减少小文件场景下不必要的分片开销，改善 S3 上传效率与行为一致性。

---

#### 9) fix: RESPECT NULLS for Spark collect_list function
- **PR**: #16933  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16933

**价值：**  
这是明显的 **Spark SQL 兼容性修复**。继 `collect_set` 之后，`collect_list` 也补齐 `RESPECT NULLS` 语义，表明 Velox 正持续消除 Spark 行为差异，利于作为 Spark 后端时的正确性表现。

---

## 4. 社区热点

### 热点 1：统一 cuDF operator 架构
- **Issue**: #16885  
- **链接**: facebookincubator/velox Issue #16885  
- **评论数**: 10

**讨论焦点：**  
当前 `CudfTopN`、`CudfLimit`、`CudfOrderBy` 等算子都直接继承 `exec::Operator` 和 `NvtxHelper`，缺乏统一基类。  
背后技术诉求很明确：  
1. **减少重复代码**  
2. **统一 GPU 算子生命周期/统计/trace 行为**  
3. **提升后续新增 cuDF 算子的开发效率与一致性**

**分析：**  
这不是简单重构，而是 GPU 子系统走向规模化维护的信号。随着 cuDF 支持面扩大，没有统一抽象层会明显拖慢演进速度。

---

### 热点 2：给 EnforceSingleRow 增加 GPU 支持
- **Issue**: #16888  
- **链接**: facebookincubator/velox Issue #16888  
- **评论数**: 3  
- **对应 PR**: #16920

**讨论焦点：**  
在 Presto TPC-DS + cuDF backend 下，`EnforceSingleRow` 因没有 GPU 实现而频繁回退 CPU。  
这是一个典型的“**单点算子缺失导致整段 pipeline 失去 GPU 连续性**”问题。

**分析：**  
从 issue 到 fix PR 的响应很快，说明维护者对 **GPU 覆盖率** 和 **真实 benchmark 场景中的 fallback 成本** 很敏感。此类补洞工作短期内仍会持续。

---

### 热点 3：分散的 GPU 支持判断需要集中管理
- **Issue**: #16930  
- **链接**: facebookincubator/velox Issue #16930

**讨论焦点：**  
目前 GPU 支持判断逻辑分散在 operator 源文件和 `OperatorAdapters.cpp` 中，存在适配器“悄悄回退”而缺乏统一判定来源的问题。  

**分析：**  
这说明 Velox 的 cuDF 方向已经从“单算子实现”走向“**系统化调度与可判定性治理**”。  
统一 eligibility check 能减少：
- 支持矩阵不一致
- 误判导致的 CPU fallback
- 维护者调试成本

---

### 热点 4：VectorSerde API 回滚后重推
- **PR**: #16912  
- **链接**: facebookincubator/velox PR #16912

**讨论焦点：**  
该 PR 是对一项曾被回退的 API 变更进行“兼容性重发”。  
这类动作往往意味着社区在 **推进内部 API 清理** 与 **兼容下游构建** 之间做平衡。

**分析：**  
对 Velox 这样一个被多个上层项目复用的执行引擎来说，序列化 API 变更影响面广，因此采用 backward compatibility guard 是更成熟的治理方式。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：查询正确性问题 - get_json_object 在 simdjson ≥ 4.0 下结果错误
- **Issue**: #16855  
- **状态**: Open  
- **标签**: bug, triage, spark-functions  
- **链接**: facebookincubator/velox Issue #16855

**问题概述：**  
`get_json_object` 对 `[*]` wildcard path 的处理在 simdjson 4.0 及以上版本出现错误结果，且已影响 `HiveQuerySuite` 中多条 Spark SQL 兼容测试。  

**影响评估：**  
这是标准的 **查询正确性回归**，优先级高于性能问题。  
涉及 Spark SQL/Hive 兼容语义，可能影响生产环境中 JSON 路径抽取结果。

**修复状态：**  
当前数据中 **未看到明确对应 fix PR**，建议维护者尽快补充回归测试并锁定 simdjson 版本差异原因。

---

### P2：GPU 执行链路缺失 - EnforceSingleRow 回退 CPU
- **Issue**: #16888  
- **状态**: Open  
- **链接**: facebookincubator/velox Issue #16888  
- **已有修复 PR**: #16920

**问题概述：**  
`EnforceSingleRow` 缺少 GPU 实现，导致标量子查询场景破坏 GPU pipeline 连续性。  

**影响评估：**  
不是结果错误，但会明显影响 **GPU 加速收益稳定性**，尤其在 TPC-DS 等复杂查询中出现频繁。  

**修复状态：**  
已有 fix PR：facebookincubator/velox PR #16920，推进速度较快。

---

### P3：GPU 支持判定逻辑不一致，可能造成错误 fallback 或维护困扰
- **Issue**: #16930  
- **状态**: Open  
- **链接**: facebookincubator/velox Issue #16930

**问题概述：**  
GPU support checks 分散在多个位置，适配器与算子本体的支持逻辑可能不一致。  

**影响评估：**  
更偏“架构稳定性/可维护性问题”，短期不一定直接导致用户可见错误，但会增加未来引入 bug 的概率。  

**修复状态：**  
暂未见对应 PR，建议结合 #16885 的统一基类重构一并治理。

---

## 6. 功能请求与路线图信号

### 1) cuDF/GPU 能力持续扩张
- **Issue**: #16885  
- **Issue**: #16888  
- **Issue**: #16930  
- **PR**: #16920  
- **PR**: #16535

**判断：高概率纳入下一版本重点。**  
今日最强的路线图信号来自 cuDF：  
- 统一 operator 架构  
- 增补缺失算子 GPU 实现  
- 拆分 query/system config  
- 统一 GPU eligibility check  

这表明 Velox 的 GPU 后端正从“可运行”向“**可维护、可配置、可规模化扩展**”演进。

---

### 2) Spark SQL 兼容性持续补齐
- **Issue**: #16855  
- **PR**: #16933  
- **PR**: #16782  
- **PR**: #16789

**判断：高概率持续进入后续版本。**  
今天可见多个 Spark 相关方向：
- `get_json_object` 正确性修复需求
- `collect_list RESPECT NULLS`
- `aes_encrypt / aes_decrypt`
- `TimestampNTZ` Parquet 读取支持

说明 Velox 正持续增强其作为 **Spark 执行/存储兼容底座** 的可用性。

---

### 3) Hive / S3 写路径增强
- **PR**: #16637  
- **PR**: #16935

**判断：中高概率进入下一版本。**  
这类变更很贴近生产落地场景：  
- 表级 `storageParameters` 透传  
- 对齐 Presto Java 的 S3 multipart 策略  

反映出社区正补足 **数据湖写入链路** 中的元数据与对象存储行为一致性。

---

### 4) 新函数与连接器生态仍在扩展
- **PR**: #16516 Google Polyline 编解码  
- **PR**: #16487 array_least_frequent  
- **PR**: #15511 s2 presto UDFs  
- **PR**: #16556 Lance connector

**判断：部分可能进入后续版本，但节奏取决于 reviewer 带宽。**  
其中函数类 PR 相对更容易合入；**Lance connector** 属于范围较大的能力扩展，可能需要更长 review 周期。

---

## 7. 用户反馈摘要

### 1) GPU 用户的核心痛点不是“不能跑”，而是“会不稳定地回退”
- **来源**: #16888, #16930, #16885  
- **链接**: facebookincubator/velox Issue #16888 / #16930 / #16885

**提炼：**  
用户已经在真实 benchmark（TPC-DS SF100）中使用 cuDF backend，说明 GPU 路线不是实验室需求，而是有实际使用场景。  
他们最关心的是：
- 算子覆盖是否完整  
- 是否会出现隐式 CPU fallback  
- 配置和适配逻辑是否统一  

这类反馈表明，社区对 GPU 功能的预期已从“支持部分查询”提升到“支撑稳定生产执行链路”。

---

### 2) Spark 兼容用户更敏感于语义边界，而不只是大功能缺失
- **来源**: #16855, #16933, #16789  
- **链接**: facebookincubator/velox Issue #16855 / PR #16933 / PR #16789

**提炼：**  
用户报告的问题集中在：
- JSON path wildcard 的细节语义
- `RESPECT NULLS` 这类聚合边界条件
- Spark `TimestampNTZ` 的存储格式映射

这反映出 Velox 在 Spark 场景中的采用已进入 **“兼容细节打磨期”**：大方向可用，但边角语义仍需持续追平。

---

### 3) 云存储与写入路径用户关注“行为一致性 + 成本效率”
- **来源**: #16935, #16637  
- **链接**: facebookincubator/velox PR #16935 / #16637

**提炼：**  
用户希望 Velox 在 Hive/S3 写路径上尽可能对齐 Presto Java 既有行为，减少迁移中的 surprise。  
尤其是对象存储 multipart 策略，不仅影响性能，也影响请求模式、成本和运维可观测性。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或相对滞留项：

### 1) s2 presto UDFs
- **PR**: #15511  
- **创建时间**: 2025-11-15  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #15511

**提醒：**  
该 PR 已存在较长时间，属于功能型扩展，若长期挂起，容易因主干变化产生 rebase 和 review 成本累积。建议明确是否继续推进。

---

### 2) Add new utility file BaseEncoderUtils.h
- **PR**: #16176  
- **创建时间**: 2026-01-30  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16176

**提醒：**  
这是典型的代码清理/复用抽象改造，价值明确但优先级常被挤压。若维护者认可方向，建议尽快给出 review 结论，避免长期悬而未决。

---

### 3) Lance connector
- **PR**: #16556  
- **创建时间**: 2026-02-26  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16556

**提醒：**  
连接器类 PR 通常范围大、维护成本高，需要尽早确认：
- 是否符合项目连接器路线图
- FFI bridge 边界是否可接受
- 需要拆分成若干子 PR 逐步合入

---

### 4) cuDF query/system config 拆分
- **PR**: #16535  
- **创建时间**: 2026-02-25  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16535

**提醒：**  
该项是 cuDF 体系化演进的重要基础设施。结合今日多个 cuDF issue，可视为高杠杆改造，建议优先 review，以免后续更多 GPU PR 建立在旧配置模型上。

---

## 总结判断

**项目健康度：良好偏高。**  
Velox 今日表现出明显的多线并进特征：  
- **GPU/cuDF**：从补算子到做架构统一，进入系统化建设阶段  
- **Spark SQL 兼容**：从功能补齐转向语义细节校准  
- **Hive/S3 写入**：持续对齐生产使用中的元数据与对象存储行为  
- **基础设施/API**：CI 拆分、依赖清理、序列化兼容治理同步推进  

**短期最值得关注的风险点** 是 `get_json_object` 在 simdjson ≥ 4.0 下的正确性问题；**最值得期待的增量** 则是 `CudfEnforceSingleRow` 合入后对 GPU pipeline 连续性的改善。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-27）

## 1. 今日速览

过去 24 小时 Apache Gluten 保持**中高活跃度**：Issues 更新 2 条、PR 更新 21 条，其中 14 条仍在推进，7 条已关闭。  
今日工作重点明显集中在 **Velox 后端能力增强、Spark 4.x 兼容性恢复、GPU 构建链路完善，以及查询正确性修复**。  
从 PR 分布看，当前项目不仅在补齐 SQL/数据类型能力，也在持续推进 **测试套恢复、CI/构建基础设施优化**，说明项目处于“功能扩展 + 稳定性加固”并行阶段。  
不过也能看到部分功能依赖上游 Velox 合入，Gluten 自身的一些能力落地节奏仍受上游协同影响。  

---

## 2. 项目进展

### 已关闭 / 完结的 PR

#### 2.1 Spark / 依赖升级类 PR 已关闭
- **#11813** `Bump org.apache.spark:spark-core_2.12 from 3.5.5 to 3.5.7`  
  链接: apache/gluten PR #11813  
  这是一条依赖升级 PR，已关闭，说明该自动升级路径暂未进入主线。对项目直接功能影响有限，但反映出团队对 Spark 3.5.x 小版本升级仍较谨慎，可能在等待兼容性验证。

- **#11814** `Bump black from 24.4.2 to 26.3.1`  
  链接: apache/gluten PR #11814  
  Python 工具链格式化依赖升级 PR 已关闭，属于外围开发工具维护，非核心执行链路。

#### 2.2 Spark 4.x 兼容打包过渡方案 PR 已关闭
- **#11820** `[GLUTEN-11316][VL] Keep old 4.x packages when building for new package`  
  链接: apache/gluten PR #11820  
  该 PR 关注 Spark 4.x 新旧包构建兼容策略，已关闭。虽然没有直接合并，但表明社区正在处理 **Spark 4.0/4.1 包结构演进带来的构建兼容问题**，这是版本迁移中的关键工程事项。

#### 2.3 GPU 序列化正确性修复 PR 已关闭
- **#11831** `[VL] Pass row count to CudfVector in GPU batch serializer`  
  链接: apache/gluten PR #11831  
  这是今天最值得关注的关闭项之一。PR 描述指出：此前 `deserialize(uint8_t* data, int32_t size)` 中的 `size` 实际是**序列化字节长度**，却被直接当成 `vector_size_t size` 传给 `CudfVector`，存在明显的**行数/字节数语义混淆**。  
  这类问题容易导致：
  - GPU 批处理反序列化结果错误
  - 行数统计不准
  - 极端情况下触发越界或执行异常  
  虽然 PR 已关闭而非合并，但它揭示了 GPU 路径上一个非常具体的**查询正确性风险点**，后续需要确认是否已有替代修复。

#### 2.4 构建依赖试验性调整 PR 已关闭
- **#11829** `[DNM][VL] TEST enable dynamic libcurl in vcpkg`  
  链接: apache/gluten PR #11829  
  明确标注 DNM/TEST，属于实验性构建验证，关闭符合预期。反映团队仍在探索更灵活的 Velox/vcpkg 依赖方式。

#### 2.5 Spark 4.x 测试套启用 WIP 关闭
- **#11670** `WIP: Enable GlutenParquetTypeWideningSuite for Spark 4.0 and 4.1`  
  链接: apache/gluten PR #11670  
  WIP PR 关闭并不意味着方向终止，反而从后续活跃 PR 看，该工作已被更完整的实现替代（见 #11719、#11816、#11833）。  
  这表明社区在 **Parquet type widening 和 Spark 4.x 测试恢复** 上正在从试验走向系统化落地。

#### 2.6 长期功能 PR 因 stale 关闭
- **#11179** `[GLUTEN-11178][VL] Support native Avro scan`  
  链接: apache/gluten PR #11179  
  原目标是支持 **Velox-native Avro scan**，通过原生扫描减少序列化开销。该 PR 被 stale 关闭，意味着：
  - Avro 原生扫描仍是潜在有价值方向；
  - 但当前优先级或维护资源不足；
  - 用户若依赖 Avro 工作负载，短期内可能仍需走现有兼容路径。  

---

## 3. 社区热点

### 3.1 Velox 上游未合入能力跟踪
- **Issue #11585** `[VL] useful Velox PRs not merged into upstream`  
  作者: @FelixYBW  
  链接: apache/gluten Issue #11585  
  这是今天**最值得关注的路线图信号**。该 issue 持续跟踪来自 Gluten 社区、但尚未被 Velox 上游合入的 PR。  
  背后的技术诉求很明确：
  1. Gluten 很多能力构建在 Velox 之上；
  2. 某些功能实现已经存在，但受限于上游合并进度；
  3. 社区希望集中管理“未 upstream 的关键 patch”，降低功能碎片化和重复 rebase 成本。  
  这说明 **Gluten 与 Velox 的协同效率** 仍然是项目交付节奏的重要影响因子。

### 3.2 新 SQL 兼容需求：`collect_set` 忽略空值
- **Issue #11826** `[VL] Enable collect_set ignoreNulls`  
  作者: @zhouyuan  
  链接: apache/gluten Issue #11826  
  该 issue 直接引用了上游 Velox 变更，目标是让 Gluten 对齐 Spark 语义，支持 `collect_set` 的 `ignoreNulls`。  
  背后技术诉求是：
  - **SQL 语义一致性**；
  - 避免 Spark 原生与 Velox 后端在聚合结果上出现差异；
  - 提升复杂 ETL / 聚合分析场景的兼容性。  
  这是典型的“不是性能优化，但对生产正确性极其关键”的需求。

### 3.3 近期热点开发方向：Spark 4.x 测试恢复
以下 PR 共同指向一个热点主题：**Spark 4.0/4.1 适配正在加速推进**。
- **#11816** `[UT] Enable 30 disabled test suites for Spark 4.0/4.1`  
  链接: apache/gluten PR #11816
- **#11833** `[VL] Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)`  
  链接: apache/gluten PR #11833
- **#11719** `[VL] Add Parquet type widening support`  
  链接: apache/gluten PR #11719

这些 PR 说明社区不仅在“让代码能编译”，而是在系统恢复 **测试覆盖、逻辑标记传播、类型拓宽语义**，这通常是版本适配进入深水区的信号。

---

## 4. Bug 与稳定性

按严重程度排序如下：

### P1 - 查询结果正确性风险：Native union 列名处理错误
- **PR #11832** `[VELOX] fix native union use column type as name lead to result error`  
  链接: apache/gluten PR #11832  
  这是今天最重要的正确性修复之一。标题已明确指出：**native union 在使用列类型作为列名时会导致结果错误**。  
  影响推测：
  - `UNION`/集合操作输出 schema 映射异常；
  - 列名与类型混淆导致投影或结果绑定错误；
  - 最终表现为查询结果错列、错值或 schema 不一致。  
  当前状态：**OPEN**，已有修复 PR，但尚未合并。  
  建议维护者优先关注，因为这是直接面向查询结果正确性的缺陷。

### P1 - GPU 批处理反序列化语义错误
- **PR #11831** `[VL] Pass row count to CudfVector in GPU batch serializer`  
  链接: apache/gluten PR #11831  
  如前所述，这是 GPU 数据反序列化路径中的高风险问题。  
  当前状态：**CLOSED**，但从现有数据看**未确认有替代 fix PR**。  
  建议跟进：
  - 是否已在其他提交中修复；
  - 是否需补充回归测试，特别是不同 batch size / variable-length 列场景。

### P2 - 广播构建缓存并发性能/稳定性隐患
- **PR #11834** `Remove the synchronized lock in VeloxBroadcastBuildSideCache`  
  链接: apache/gluten PR #11834  
  该 PR 关注 `VeloxBroadcastBuildSideCache` 的同步锁移除。  
  这通常意味着当前实现可能存在：
  - 广播 hash build-side 缓存访问竞争；
  - 串行化热点导致性能抖动；
  - 在高并发查询下放大延迟。  
  虽未明确是 bug 修复还是优化，但从组件位置看，对 **JOIN 执行稳定性和吞吐** 都有实际意义。

### P2 - GPU 配置可变性与运行时检测问题
- **PR #11830** `[VL] Use immutable gpu config and add cuda runtime detection`  
  链接: apache/gluten PR #11830  
  该 PR 说明现有 GPU 配置管理可能存在可变状态风险，且 CUDA 运行时环境检测仍不完备。  
  潜在收益：
  - 减少 GPU 初始化阶段配置漂移；
  - 更早暴露部署环境问题；
  - 降低“运行时才失败”的运维成本。

### P2 - 构建/镜像一致性优化
- **PR #11835** `[VL] refine GPU image build`  
  链接: apache/gluten PR #11835  
- **PR #11836** `[MINOR][VL] Add cudf build docker file with JDK 17 and cuda 12.9`  
  链接: apache/gluten PR #11836  
  这两条 PR 指向 GPU 构建环境标准化。它们不直接修复查询 bug，但能显著提升 **部署可重复性与 CI 稳定性**。

---

## 5. 功能请求与路线图信号

### 5.1 `collect_set(ignoreNulls)` 很可能进入后续版本
- **Issue #11826**  
  链接: apache/gluten Issue #11826  
  这是一个明确、范围清晰、且有上游 Velox 变更可跟进的 SQL 兼容增强项。  
  由于它直接影响 Spark 语义一致性，**被纳入下一批兼容性增强的概率较高**。

### 5.2 `map_from_entries` 支持仍在推进
- **PR #8731** `[VL] Support Spark map_from_entries function`  
  链接: apache/gluten PR #8731  
  这是一个存续时间较长但今日仍有更新的功能 PR，说明社区没有放弃。  
  技术价值：
  - 补齐 Spark map 构造函数能力；
  - 提升半结构化/复杂类型查询兼容性；
  - 对 ETL 和宽表转换场景有实际意义。  
  但该 PR 依赖 Velox 上游 PR，短期是否合入仍受上游节奏影响。

### 5.3 TIMESTAMP_NTZ 基础支持是高概率落地方向
- **PR #11626** `[VL] Add basic TIMESTAMP_NTZ type support`  
  链接: apache/gluten PR #11626  
  TIMESTAMP_NTZ 是 Spark SQL 中越来越重要的数据类型兼容项。  
  一旦合入，将提升：
  - 时间语义兼容性；
  - 与 Spark 3.4+/4.x 行为对齐；
  - 湖仓场景中的时间列处理一致性。  
  结合当前 Spark 4.x 适配工作，**该能力很可能成为下一阶段重点合并对象**。

### 5.4 Bloom filter 下推与 shuffle 统计增强表明执行引擎在向“更深层优化”演进
- **PR #11711** `Translate might_contain as a subfield filter for scan-level bloom filter pushdown`  
  链接: apache/gluten PR #11711  
- **PR #11769** `Write per-block column statistics in shuffle writer`  
  链接: apache/gluten PR #11769  
  这两条 PR 非常有路线图价值，说明 Gluten 不再只停留于“算子替换”，而是在推进：
  - **扫描级过滤下推**
  - **shuffle block 级剪枝**
  - **动态过滤与 IO 削减**  
  这类优化如果成熟，会对大规模 OLAP 查询的端到端性能带来更直接收益。

---

## 6. 用户反馈摘要

基于现有 issue / PR 摘要，可以提炼出以下真实用户痛点：

### 6.1 用户最关注的是 Spark 语义一致性，而不只是加速
- `collect_set(ignoreNulls)`、`map_from_entries`、`TIMESTAMP_NTZ`、Parquet type widening 等需求都表明，用户希望 Gluten 在加速之外，**尽可能无缝替代 Spark 原生执行**。  
- 这意味着“支持函数/类型/格式”的完整度，正在成为 adoption 的关键门槛。

### 6.2 Spark 4.x 升级诉求强烈
- 大量测试恢复与兼容性 PR 表明，已有用户或潜在用户正推动 Gluten 尽快稳定支持 Spark 4.0/4.1。  
- 痛点主要不在单点功能，而在：
  - 包结构变更
  - 测试套件禁用
  - 逻辑计划 tag 传递
  - Parquet widening 行为兼容

### 6.3 GPU 用户更关心“能稳定部署和正确运行”
- 今日多条 PR 聚焦 GPU config、CUDA runtime detection、镜像构建、cudf Dockerfile。  
- 这说明 GPU 场景当前瓶颈不仅是算子性能，还包括：
  - 环境配置复杂
  - 镜像不统一
  - 运行时探测不足
  - 序列化链路正确性风险

### 6.4 社区对 Velox 上游依赖的摩擦感较强
- #11585 表明用户/贡献者已经明显感受到“有用 patch 已写好，但上游迟迟未合”的阻力。  
- 这会带来：
  - 功能上线周期拉长
  - 本地 patch 维护成本上升
  - 版本组合复杂化

---

## 7. 待处理积压

以下长期或重要项建议维护者重点关注：

### 7.1 长期未落地的 SQL 函数支持
- **#8731** `[VL] Support Spark map_from_entries function`  
  链接: apache/gluten PR #8731  
  创建于 2025-02-14，至今仍未合并，且依赖上游 Velox。  
  若该函数在用户 workload 中常见，长期悬而未决会影响 SQL 覆盖率口碑。

### 7.2 TIMESTAMP_NTZ 支持仍在推进中
- **#11626** `[VL] Add basic TIMESTAMP_NTZ type support`  
  链接: apache/gluten PR #11626  
  这是 Spark 新版本兼容的重要拼图，建议优先推进评审与回归验证。

### 7.3 Maven 依赖缓存/CI 优化仍未完成
- **#11655** `[VL][CI] cache maven deps m2 repo`  
  链接: apache/gluten PR #11655  
  虽不直接影响功能，但会影响 CI 效率和开发反馈周期，属于典型“工程基础设施债务”。

### 7.4 Parquet type widening 仍需尽快收敛
- **#11719** `[VL] Add Parquet type widening support`  
  链接: apache/gluten PR #11719  
  这项工作对 Spark 4.x 兼容、数据湖读取一致性都很关键，是当前值得加速推进的核心 PR。

### 7.5 原生 Avro 扫描方向暂时搁置
- **#11179** `[VL] Support native Avro scan`  
  链接: apache/gluten PR #11179  
  尽管已 stale 关闭，但其价值仍在。如果社区有较多 Avro 用户，建议评估是否重启设计或拆分成更小 PR。

---

## 8. 总结判断

今天的 Apache Gluten 呈现出较清晰的工程主线：  
1. **补齐 Spark 4.x 兼容性**；  
2. **增强 Velox 后端 SQL/类型支持**；  
3. **修复查询正确性问题，特别是 union 与 GPU 序列化路径**；  
4. **完善 GPU 构建与运行环境管理**。  

项目整体健康度良好，活跃开发面广，但也暴露出两个持续性风险：  
- 对 **Velox 上游合并节奏** 的依赖较强；  
- 部分关键能力仍停留在长期未合并 PR 状态。  

如果接下来几天能优先推进 #11832、#11626、#11719、#11816 / #11833 这类关键 PR，Gluten 在 **Spark 4.x 可用性、SQL 兼容性和执行稳定性** 上会出现明显提升。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-27）

## 1. 今日速览

过去 24 小时，Apache Arrow 保持较高活跃度：Issues 更新 46 条、PR 更新 22 条，但**无新版本发布**。整体上看，项目今日的主线集中在 **C++/Parquet/Flight SQL ODBC/CI 稳定性**，同时 R 与 Python 生态也持续推进。  
从关闭 28 条 Issue 来看，维护者正在较积极地清理历史积压与 stale 条目；但与此同时，新增和活跃问题中仍出现了**数据正确性缺陷、CI 构建故障、平台兼容性问题**，说明项目当前重点仍是“增强功能推进 + 基础设施稳态治理”并行。  
值得注意的是，**Flight SQL ODBC** 已成为近阶段最明显的路线热点，Linux Ubuntu 支持、Windows 签名流程、静态构建均在并行推进，显示 Arrow 正在继续补齐企业连接器与跨平台交付链路。  
总体健康度评估：**活跃，且工程推进节奏稳定；但发布前仍需重点关注 CI、跨平台构建与少数查询正确性问题。**

---

## 2. 项目进展

### 已关闭/完成的重要事项

#### 2.1 大内存测试正式进入 CI，提升 C++/Parquet 稳定性保障
- Issue: #46600 `[C++][CI] Have a job with ARROW_LARGE_MEMORY_TESTS enabled`（已关闭）  
  链接: apache/arrow Issue #46600
- 对应 PR: #49490 `[C++][CI] Add job with ARROW_LARGE_MEMORY_TESTS enabled`（已关闭）  
  链接: apache/arrow PR #49490

**意义：**  
这是今天最重要的基础设施进展之一。Arrow 过去对大内存场景的覆盖并不稳定，而该 PR 将 `ARROW_LARGE_MEMORY_TESTS` 纳入 CI，并修复了如 `parquet-writer-test` 之类的大页测试问题。  
对 OLAP / 分析型存储场景而言，这直接关系到：
- 大列块、宽表、海量 page 的 Parquet 写入正确性
- 长时间运行的批处理任务稳定性
- 极端数据规模下的回归发现能力

这类改动本身不直接新增 SQL 功能，但会显著提高 Arrow 作为底层分析引擎与列式存储库的**可靠性下限**。

---

#### 2.2 一批历史 enhancement / usage / stale 问题被集中清理
今日关闭的旧 Issue 较多，典型包括：
- #31035 `[C++] Add min/max binary scalar kernels to execution engine`  
  链接: apache/arrow Issue #31035
- #36474 `[Dev] Curate CODEOWNERS`  
  链接: apache/arrow Issue #36474
- #33715 `[Python] Remove --disable-warnings with newer version of pytest-cython`  
  链接: apache/arrow Issue #33715
- #38841 `[Dev] Prompt whether an issue should be labeled as Breaking Change when merging`  
  链接: apache/arrow Issue #38841
- #45369 `[Python] OSError: Unable to load libhdfs`  
  链接: apache/arrow Issue #45369

**意义：**  
这些关闭动作反映出维护团队在做两件事：
1. 清理历史迁移自 JIRA、长期无推进的问题；
2. 收紧 issue backlog，减少噪音，提高路线图可见性。

对项目健康度而言，这是正向信号；但也意味着一些老需求未必会进入近期版本，需要社区重新以更具体的 PR/设计提案形式推动。

---

## 3. 社区热点

### 3.1 大内存测试覆盖进入 CI
- Issue #46600  
  链接: apache/arrow Issue #46600
- PR #49490  
  链接: apache/arrow PR #49490

**热度原因：** 评论数 35，为当日最活跃议题之一。  
**技术诉求：** Arrow 长期作为底层列式引擎被用于大规模 ETL、Parquet 编解码、内存映射与批处理作业，但大内存路径在 CI 中覆盖不足。社区希望把“极端规模 correctness”从手工验证提升到自动化保障。  
**研判：** 这类工作虽不显眼，但对未来版本质量极关键，尤其会影响 Parquet、Dataset、Compute 的大规模生产可用性。

---

### 3.2 R 用户希望构造 Arrow 原生支持表达式，支撑 geoarrow 等扩展生态
- Issue #45438 `[R] creating arrow supported expressions`  
  链接: apache/arrow Issue #45438

**热度原因：** 评论 18，且仍为 Open。  
**技术诉求：** 用户在 R 中为 geoarrow-rs / nanoarrow / `geoarrow_vctr` 构建绑定，希望这些函数不只在 R 向量上运行，还能直接嵌入 Arrow Dataset / dplyr 查询表达式中。  
**背后意义：**
- Arrow R 前端不仅要做 I/O 封装，还要成为**可下推表达式系统**的一部分；
- 地理空间、扩展函数、定制表达式的接入能力，正成为下一阶段生态诉求；
- 这和 OLAP 查询引擎中的“表达式可编译/可下推”需求高度一致。

---

### 3.3 list 列过滤导致数据损坏，是当前最值得关注的正确性问题
- Issue #49392 `[C++][Python] Filtering corrupts data in column containing a list array`  
  链接: apache/arrow Issue #49392
- Fix PR #49602 `[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering`  
  链接: apache/arrow PR #49602

**热度原因：** 评论 7，👍 3；涉及**用户可见数据错误**。  
**技术诉求：** 在读取 Parquet 并应用 filter、或对含 `list<double>` 列的数据表做过滤时，得到的子数组值被错误映射到其他 child span。  
**研判：**
- 这是典型的**查询正确性**问题，比性能退化更严重；
- 问题同时影响 C++ 与 Python 用户路径，说明底层 compute/filter/gather 逻辑存在共享缺陷；
- 好消息是已有修复 PR #49602，当日即进入评审，响应较快。

---

### 3.4 Flight SQL ODBC 成为近期最明确的工程主线
相关 PR：
- #46099 `[C++] Arrow Flight SQL ODBC layer`  
  链接: apache/arrow PR #46099
- #49564 `[C++][FlightRPC] Add Ubuntu ODBC Support`  
  链接: apache/arrow PR #49564
- #49585 `DRAFT: set up static build of ODBC FlightSQL driver`  
  链接: apache/arrow PR #49585
- #49603 `[C++][FlightRPC] Windows CI to Support ODBC DLL & MSI Signing`  
  链接: apache/arrow PR #49603
- Issue #49537 `[C++][FlightRPC][ODBC] Add CI steps to support Windows DLL and MSI signing`  
  链接: apache/arrow Issue #49537

**技术诉求：**
- 从仅 Windows 走向 Linux Ubuntu 支持；
- 打通 DLL / MSI 签名流程，满足企业分发要求；
- 推进静态构建与交付自动化。

**背后意义：**  
Arrow 不再只停留于列式内存格式和文件层，而是在把 Flight SQL 继续打磨成可直接接入 BI / ODBC 生态的连接方案，这对分析型数据库、数据网关、跨语言客户端接入都很关键。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1：查询结果错误 / 数据损坏
#### 4.1 过滤含 list 列时发生数据损坏
- Issue #49392  
  链接: apache/arrow Issue #49392
- Fix PR #49602  
  链接: apache/arrow PR #49602

**影响：** 高。  
**问题描述：** 对包含 `list<double>` 的列进行过滤时，结果值可能来自错误的 child span，属于 silent corruption 风险。  
**状态：** 已有修复 PR，正在 review。  
**结论：** 这是今天最严重的用户侧 correctness 缺陷。

---

### P1：CI / 打包链路中断，影响发布与平台可用性
#### 4.2 Ubuntu resolute 环境 aws-lc 构建失败
- Issue #49601 `[CI][Packaging] ubuntu-resolute Linux fail building aws-lc`  
  链接: apache/arrow Issue #49601

**影响：** 高。  
**问题描述：** `ubuntu-resolute-arm64` 与 `ubuntu-resolute-amd64` job 构建 aws-lc 失败。  
**潜在影响：**
- 新平台或新基线镜像下的包构建受阻；
- 可能波及依赖 TLS/加密链路的构建任务；
- 对发布流水线和 packaging 可信度不利。  
**状态：** 新开 issue，暂未见对应 fix PR。

---

### P2：Windows MinGW 上 json 测试间歇性段错误
- PR #49462 `[C++][CI] Fix intermittent segfault in arrow-json-test with MinGW`  
  链接: apache/arrow PR #49462
- 关联 Issue #49272  
  链接: apache/arrow PR #49462（PR 描述引用）

**影响：** 中高。  
**问题描述：** `arrow-json-test` 在 AMD64 Windows MinGW CI 上间歇性 segfault，发生于 `ReaderTest.MultipleChunksParallel`。  
**意义：**
- 说明并行 JSON 读取路径在特定编译器/平台组合下存在不稳定性；
- 虽然主要表现为 CI flakiness，但也可能暗示并发路径的潜在未定义行为。  
**状态：** PR 等待 committer review。

---

### P2：Apple M3 上 pyarrow 加载 libhdfs 失败
- Issue #45369 `[Python] OSError: Unable to load libhdfs`（已关闭）  
  链接: apache/arrow Issue #45369

**影响：** 中。  
**问题性质：** 平台兼容 / 依赖加载问题。  
**备注：** 虽然已关闭，但反映出 pyarrow 在 ARM macOS + HDFS 相关动态库链路上，用户预期和实际打包能力之间仍有落差。

---

### P3：命令行工具参数校验缺陷
- PR #49540 `[C++][Parquet] Fix argument count check in parquet_scan`  
  链接: apache/arrow PR #49540

**影响：** 中低。  
**问题描述：** `parquet-scan` 无参数执行时，返回的是混淆性的 IOError，而不是 usage 提示。  
**状态：** awaiting changes。  
**意义：** 这是典型 UX / CLI 健壮性修复，对核心引擎影响不大，但有助于工具链可用性。

---

## 5. 功能请求与路线图信号

### 5.1 R 生态：Azure Blob FileSystem 暴露，云存储接入继续补齐
- PR #49553 `[R] Expose azure blob filesystem`  
  链接: apache/arrow PR #49553

**路线图信号：** 强。  
Arrow C++ 与 PyArrow 已有 Azure 支持，现在 R 端开始补齐，表明多语言云对象存储访问能力正趋于统一。  
**潜在影响：**
- R 用户可以更自然地把 Arrow Dataset 接到 Azure Blob；
- 对云原生分析、lakehouse 读写、跨云迁移更友好。  
这类功能很可能进入后续版本，因为其依赖基础已成熟，且 PR 活跃。

---

### 5.2 Python：数组/标量原生算术运算支持
- PR #48085 `[Python] Support arithmetic on arrays and scalars`  
  链接: apache/arrow PR #48085

**路线图信号：** 中强。  
该 PR 试图让 `array + array`、`array + scalar` 这类 Python 原生表达式直接可用，而不是必须调用 `pyarrow.compute`。  
**价值：**
- 提升 PyArrow 作为“分析数组库”的直观性；
- 降低 API 使用门槛；
- 可能改善与 pandas / NumPy 用户心智模型的一致性。  
若合入，将明显增强 Python 端表达式友好度。

---

### 5.3 R：持续补齐 dplyr 新 helper
- PR #49535 `[R] Implement dplyr's when_any() and when_all() helpers`  
  链接: apache/arrow PR #49535
- PR #49536 `[R] Implement dplyr recode_values(), replace_values(), and replace_when()`  
  链接: apache/arrow PR #49536

**路线图信号：** 强。  
这表明 Arrow R 前端持续对齐 tidyverse / dplyr 的语义层，增强查询表达式兼容性。  
对分析引擎来说，这不是单纯语法糖，而是：
- 扩大可下推表达式覆盖面；
- 降低从内存数据帧到 Arrow Dataset 的迁移成本；
- 强化 R 用户对 Arrow 作为后端执行引擎的接受度。

---

### 5.4 C++ Compute：为 selective execution 铺路
- PR #47377 `[C++][Compute] Support selective execution for kernels`  
  链接: apache/arrow PR #47377

**路线图信号：** 强，但周期较长。  
该 PR 面向 kernel 的 selective execution，属于执行引擎能力增强。  
**潜在意义：**
- 为 special form / 条件执行 / 更细粒度表达式优化提供基础；
- 有机会提升过滤、条件函数、惰性执行、短路语义等能力；
- 对上层 SQL / Substrait / Dataset 执行优化是关键底座。  
这是典型“短期不显眼、长期影响深”的核心能力建设。

---

### 5.5 Parquet：加密 bloom filter 读取支持
- PR #49334 `[C++][Parquet] Support reading encrypted bloom filters`  
  链接: apache/arrow PR #49334

**路线图信号：** 中强。  
说明 Arrow 在安全与企业级 Parquet 特性上继续补课。  
对数据湖与分析存储而言，这有助于：
- 提高加密数据集的可读性完整度；
- 让 bloom filter 在加密场景下仍可用于谓词裁剪；
- 增强与安全合规场景的兼容。

---

### 5.6 Python：large_string / large_binary 的 DictionaryArray 转换支持
- Issue #49505  
  链接: apache/arrow Issue #49505

**路线图信号：** 中。  
这是典型的类型系统补洞请求。对宽字符串、大二进制字典编码场景有现实需求，尤其在大文本、高基数字典数据处理中会遇到。若后续有 PR，较可能进入近期版本。

---

## 6. 用户反馈摘要

### 6.1 用户最关心的仍是“结果是否正确”
- 代表问题：#49392  
  链接: apache/arrow Issue #49392

用户首先报告的是：**读取 Parquet 到 Pandas / PyArrow 后，一旦加过滤，list 列值被破坏。**  
这说明对 Arrow 用户而言，性能和零拷贝很重要，但前提永远是**过滤、投影、解码结果不能错**。一旦涉及 silent corruption，用户信任会快速下降。

---

### 6.2 R 用户希望 Arrow 不只是 I/O 层，而是表达式执行后端
- 代表问题：#45438  
  链接: apache/arrow Issue #45438

R 社区的诉求已明显从“能不能读写”转向“能不能把扩展函数纳入 Arrow 支持表达式并参与查询下推”。  
这说明 Arrow 在 R 中的定位正在升级为：
- Dataset 查询后端
- dplyr 翻译器
- 专业领域扩展（如地理空间）的执行平台

---

### 6.3 跨平台与企业环境兼容性仍是典型痛点
- 代表问题：#45369  
  链接: apache/arrow Issue #45369
- 代表问题：#49601  
  链接: apache/arrow Issue #49601
- 代表 PR：#49603 / #49564  
  链接: apache/arrow PR #49603 / apache/arrow PR #49564

用户与贡献者都在持续面对：
- ARM macOS 动态库依赖
- Linux 新基线构建失败
- Windows 签名与 MSI 分发
- ODBC 跨平台打包  
这说明 Arrow 的工程复杂度已经进入“产品化交付”阶段，而不只是库功能开发阶段。

---

## 7. 待处理积压

以下是值得维护者关注的长期未决事项：

### 7.1 C++ selective execution 核心能力 PR 长期悬而未决
- PR #47377  
  链接: apache/arrow PR #47377

创建于 2025-08-20，至今仍在 `awaiting changes`。  
**原因：** 该能力对 compute 执行模型影响深，评审成本高。  
**建议：** 应尽快拆分为更小 PR 或补充设计文档，否则会持续阻塞后续 special form / 执行优化能力落地。

---

### 7.2 Flight SQL ODBC 主 PR 体量过大，存在集成风险
- PR #46099  
  链接: apache/arrow PR #46099

创建于 2025-04-10，至今仍在推进。  
**问题：** 功能面覆盖 Windows/Linux/macOS、构建、驱动层、CI，过于庞杂。  
**建议：** 继续按平台、签名、静态构建、驱动功能拆分，降低 review 与回归风险。

---

### 7.3 Python 数组/标量算术支持推进较慢
- PR #48085  
  链接: apache/arrow PR #48085

这是典型高用户价值、但 API 设计需要谨慎的改动。  
**风险：**
- Python 运算符语义一致性
- 广播、空值、类型提升规则
- 与 `pyarrow.compute` 现有行为的一致性  
**建议：** 若短期难以整体合入，可先从最基础数值类型和加减乘除子集落地。

---

### 7.4 多个历史 stale 但仍有价值的 C++/Docs/R 需求未真正解决
例如：
- #31576 `[C++] cast when reasonable for join keys`  
  链接: apache/arrow Issue #31576
- #31620 `[C++][Docs] Provide more complete linking/CMake project example`  
  链接: apache/arrow Issue #31620
- #31619 `[C++] IPC listener interface should allow receiving custom_metadata`  
  链接: apache/arrow Issue #31619
- #31601 `[R] Expose FileSystemDatasetWriteOptions`  
  链接: apache/arrow Issue #31601
- #31596 `[Doc] Document parallelism of file readers`  
  链接: apache/arrow Issue #31596

这些问题虽然评论不多，但都直接影响：
- 易用性
- API 完整度
- Dataset/IPC 可扩展能力
- 文档对生产落地的支持度

---

## 8. 总结判断

今天 Arrow 的项目态势可概括为三点：

1. **工程基础设施继续加强**：大内存测试已进入 CI，说明团队正在补强“高规模场景质量保障”。  
2. **企业连接能力持续升温**：Flight SQL ODBC 成为明确主线，Linux 支持、Windows 签名、静态构建都在推进，利好 BI/数据库接入。  
3. **仍需优先守住正确性与稳定性**：含 list 列过滤的数据损坏问题和新平台构建失败，是当前比新功能更紧迫的风险项。

如果以 OLAP/分析型存储引擎视角看，Apache Arrow 今天的核心信号是：**正在从高性能列式基础库，继续向“可生产交付的跨平台分析连接与执行底座”演进。**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*