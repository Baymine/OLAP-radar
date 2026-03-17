# Apache Doris 生态日报 2026-03-17

> Issues: 7 | PRs: 202 | 覆盖项目: 10 个 | 生成时间: 2026-03-17 01:25 UTC

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

# Apache Doris 项目动态日报 · 2026-03-17

## 1. 今日速览

过去 24 小时，Apache Doris 保持**高活跃开发节奏**：Issues 更新 7 条、PR 更新 202 条，其中 114 条已合并或关闭，说明主干与分支维护都在持续推进。  
今日没有新版本发布，但从大量 backport / cherry-pick PR 可以看出，社区正在**集中推进 4.0/4.1 以及 3.1 分支的稳定性修复与兼容性补强**。  
技术焦点主要集中在 **Iceberg / Paimon / ES 外部表生态、物化视图稳定性、测试体系修复、存储与云环境适配** 等方向。  
整体来看，项目健康度较好：**修复效率高、分支维护积极、生态集成持续增强**；但同时也暴露出若干长期遗留问题与云原生认证/外表兼容性痛点，值得继续跟进。

---

## 3. 项目进展

### 3.1 查询引擎与 SQL 功能推进

- **支持倒排索引 query_v2 的 BM25 打分**
  - PR: #59847 `[OPEN] [feature](score) support BM25 scoring in inverted index query_v2`
  - 链接: apache/doris PR #59847
  - 影响：这是今天最值得关注的功能型 PR 之一。BM25 是全文检索领域的核心相关性评分模型，该 PR 表明 Doris 正在继续增强**检索分析一体化**能力，尤其适合日志、文档、检索增强分析等场景。
  - 状态：尚未合并，属于中短期功能信号。

- **修复 decimalv2 的 abs() 结果错误**
  - PR: #61397 `[OPEN] [fix](decimalv2) fix wrong result of abs(decimalv2)`
  - 链接: apache/doris PR #61397
  - 影响：这是典型的**查询正确性修复**，优先级较高。若属实，会直接影响数值计算结果的可信度。
  - 状态：已 approved/reviewed，但仍处于 open，预计较快进入合并流程。

- **Nereids 相关结构优化**
  - PR: #56305 `[CLOSED] [Enhancement](nereids) optimize tableRefInfo...`
  - PR: #61407 `[OPEN] branch-4.1 ...(#56305)`
  - 链接: apache/doris PR #56305 / apache/doris PR #61407
  - 影响：属于优化查询规划器内部结构的工作，虽非用户直接可见功能，但对 Nereids 的可维护性、语义结构复用有正向作用。

### 3.2 外部表 / 湖仓生态集成

- **将 paimon-cpp 纳入 thirdparty 构建体系**
  - PR: #60296 `[CLOSED] [chore](thirdparty) Integrate paimon-cpp into thirdparty build system`
  - PR: #61369 `[CLOSED] branch-4.1 ... #60296`
  - 链接: apache/doris PR #60296 / apache/doris PR #61369
  - 影响：这是今天外部生态方向的关键进展。Paimon 过去主要依赖 JNI 读取，这次引入 **native C++ 支持**，意味着 Doris 在读取 Paimon 表时有望降低 JNI 带来的性能开销和复杂性，提升可部署性与运行效率。

- **修复读取 Iceberg 表时 schema change + equality delete 导致崩溃**
  - PR: #59984 `[CLOSED] [fix](iceberg)...`
  - PR: #61348 `[CLOSED] branch-4.0 ... (#59984)`
  - 链接: apache/doris PR #59984 / apache/doris PR #61348
  - 影响：这是今天最重要的湖仓兼容性修复之一。涉及 **Iceberg schema evolution 与 equality delete 组合场景**，属于真实生产中高复杂度、易踩坑的问题，修复价值很高。

- **修复 ES catalog 在 keyword 字段实际存储数组时的查询错误**
  - PR: #61236 `[CLOSED] [fix](es-catalog) Fix query error when ES keyword field contains array data`
  - PR: #61361 `[CLOSED] branch-4.0 ... #61236`
  - 链接: apache/doris PR #61236 / apache/doris PR #61361
  - 影响：提升 Doris 对 Elasticsearch 数据“弱模式/动态字段”的兼容性。该修复将数组序列化为 JSON 字符串，避免类型不匹配报错，属于**连接器兼容性增强**。

- **统一 FE OSS 文件系统实现到 Jindo**
  - PR: #61269 `[OPEN] [refactor](oss) unify FE OSS filesystem with Jindo`
  - 链接: apache/doris PR #61269
  - 影响：该 PR 虽未合并，但方向明确：清理 FE 侧多套 OSS 实现并统一至 Jindo FS，有助于减少 classpath 冲突、依赖复杂度和行为不一致问题。

### 3.3 存储、负载与云环境优化

- **Quorum success 统计排除 version-gap 副本**
  - PR: #60953 `[CLOSED] [enhance](load) exclude version-gap replicas from success counting in quorum success`
  - PR: #61359 `[CLOSED] branch-4.0 ... #60953`
  - 链接: apache/doris PR #60953 / apache/doris PR #61359
  - 影响：这是一个典型的**一致性语义修复**。此前 BE 在多数写成功判定中未排除存在 version gap 的副本，与 FE commit 检查逻辑不一致；修复后可减少“看似成功但后续校验失败”的状态偏差。

- **云环境支持 FDB locality aware 负载均衡**
  - PR: #61312 `[CLOSED] [opt](cloud) Support fdb locality aware load balancing`
  - PR: #61375 `[CLOSED] branch-4.0 ... #61312`
  - 链接: apache/doris PR #61312 / apache/doris PR #61375
  - 影响：面向云部署场景的优化，说明 Doris Cloud 相关能力仍在持续打磨，重点是提高访问 locality、降低跨地域/跨机架代价。

- **filecache 对空 block 文件增加检查与异常处理**
  - PR: #61203 `[CLOSED] [fix](filecache) add check and exception handle for empty block file`
  - 链接: apache/doris PR #61203
  - 影响：属于存储缓存层的稳定性补丁，可降低下载失败导致空文件、继而引发后续异常的问题。

### 3.4 测试与工程质量

- **修复 BDB JE 资源泄漏导致 FE 单测超时**
  - PR: #61404 `[OPEN] [fix](test) Fix BDB JE resource leak in BDBEnvironmentTest causing FE UT timeout`
  - 链接: apache/doris PR #61404
  - 影响：该问题会导致 JVM 退出阶段 checkpoint 线程陷入重试，触发长达数小时的 CI 超时，属于**研发效率与工程稳定性**层面的高优先修复。

- **清理重复 TVF 测试 / 修正 salt_join 用例 / 为 ASOF JOIN 文档增加回归测试**
  - PR: #61311, #59035, #61351 及其 branch-4.0 backport
  - 链接: apache/doris PR #61311 / #59035 / #61351
  - 影响：表明 Doris 正在持续补足**回归测试覆盖与文档示例一致性**，对减少后续回归非常关键。

- **FE 升级 okhttp 到 5.3.2**
  - PR: #61263 `[CLOSED] [chore](fe) upgrade okhttp to 5.3.2`
  - PR: #61370 branch-4.0
  - 链接: apache/doris PR #61263 / apache/doris PR #61370
  - 影响：依赖升级通常涉及安全性、兼容性和依赖冲突治理，尤其是 FE 集成多种外部 SDK 时非常重要。

---

## 4. 社区热点

### 热点 1：BM25 检索评分能力
- PR: #59847
- 链接: apache/doris PR #59847

**技术诉求分析：**  
Doris 已具备 OLAP 优势，但用户越来越希望其兼顾**文本检索 + 结构化分析**场景。BM25 支持意味着倒排索引不仅能过滤，还能做相关性排序，这对日志平台、站内搜索、知识库分析、RAG 检索预处理等场景非常关键。该 PR 代表 Doris 在“分析数据库 + 检索引擎融合”方向上的重要信号。

### 热点 2：Iceberg REST Catalog 自定义 Header 支持
- Issue: #61388 `[OPEN] [feature] Support custom HTTP headers for REST Iceberg catalog via header.* properties`
- 链接: apache/doris Issue #61388

**技术诉求分析：**  
用户希望 Doris 支持通过 `header.*` 属性向 Iceberg REST catalog 注入自定义 HTTP 头，这符合 Iceberg REST 规范，也常见于需要 API Gateway、认证代理、多租户路由或企业安全网关的部署环境。  
这说明 Doris 在接入 Iceberg 生态时，用户已经从“能连通”走向“适配企业级真实基础设施”。

### 热点 3：AWS Web Identity 认证无法用于 storage vault
- Issue: #55972 `[OPEN] [Bug] Storage vault unable to use AWS web identity auth`
- 链接: apache/doris Issue #55972

**技术诉求分析：**  
这是典型的 **Kubernetes + EKS + IAM Role for Service Account (IRSA)** 场景。用户不希望明文配置 AK/SK，而依赖云原生身份认证。如果 storage vault 不支持该认证路径，将直接影响 Doris 在公有云容器平台上的可运营性与安全合规能力。

### 热点 4：Nessie REST catalog + Iceberg 可见库表但不能查数
- Issue: #61191 `[OPEN] [Bug] Doris 配置 nessie rest catalog 连接 iceberg...无法查询表数据`
- 链接: apache/doris Issue #61191

**技术诉求分析：**  
该问题体现用户使用 Doris 接入现代湖仓元数据服务（Nessie）的真实需求。当前表现为“catalog 元数据可读，但数据查询失败”，说明 Doris 在 REST catalog / metadata / scan planning / credential propagation 某环节仍可能存在兼容性缺口。

---

## 5. Bug 与稳定性

以下按潜在严重程度排序：

### P1：查询结果正确性问题
1. **`abs(decimalv2)` 返回错误结果**
   - PR: #61397 `[OPEN]`
   - 链接: apache/doris PR #61397
   - 类型：查询正确性
   - 状态：已有 fix PR，已 reviewed
   - 评估：直接影响数值计算结果，应优先合并并补回归测试。

2. **Routine Load 下 partial column update 不生效**
   - Issue: #57652 `[OPEN] [Bug]`
   - 链接: apache/doris Issue #57652
   - 类型：导入语义/更新正确性
   - 状态：未见对应 fix PR
   - 评估：影响 Unique 模型更新链路，属于数据写入正确性问题，建议尽快确认是否为已知限制还是回归。

### P1/P2：外部表与湖仓兼容性
3. **Nessie REST Catalog 连接 Iceberg 能看表但不能查询**
   - Issue: #61191 `[OPEN]`
   - 链接: apache/doris Issue #61191
   - 类型：外部表查询失败
   - 状态：未见直接 fix PR
   - 评估：影响 Doris 与现代数据湖元数据系统的互操作，真实生产影响面可能较大。

4. **Iceberg schema change + equality delete 读取崩溃**
   - PR: #59984 `[CLOSED]`, branch-4.0 backport #61348
   - 链接: apache/doris PR #59984 / apache/doris PR #61348
   - 类型：崩溃/兼容性
   - 状态：已修复并回移
   - 评估：本日最重要的已解决稳定性问题之一。

5. **ES keyword 字段实际为 array 时查询失败**
   - PR: #61236 `[CLOSED]`
   - 链接: apache/doris PR #61236
   - 类型：连接器兼容性
   - 状态：已修复
   - 评估：解决 ES 动态 schema 场景中的常见报错。

### P2：分布式一致性与副本状态
6. **多数写成功判定包含 version-gap 副本**
   - PR: #60953 `[CLOSED]`
   - 链接: apache/doris PR #60953
   - 类型：副本一致性/写入成功语义
   - 状态：已修复
   - 评估：减少 FE/BE 对成功状态认知不一致的风险。

7. **BE 宕机重启后查询报 “no queryable replica found”**
   - Issue: #5869 `[OPEN] [Stale]`
   - 链接: apache/doris Issue #5869
   - 类型：副本可用性/恢复流程
   - 状态：长期未完全解决
   - 评估：虽然是老问题，但涉及节点故障恢复后的查询可用性，仍值得重新排查。

### P2/P3：云原生与安全
8. **Storage vault 无法使用 AWS Web Identity Auth**
   - Issue: #55972 `[OPEN] [Stale]`
   - 链接: apache/doris Issue #55972
   - 类型：认证/云原生部署
   - 状态：未见 fix PR
   - 评估：影响 EKS 等场景下的无密钥部署实践。

9. **LDAP 缺少 LDAPS 配置支持**
   - Issue: #60236 `[CLOSED]`
   - PR 关联信号：#61406 `branch-4.0: [enhance](auth) introduction of ldaps support via configuration property #60275`
   - 链接: apache/doris Issue #60236 / apache/doris PR #61406
   - 类型：安全增强
   - 状态：Issue 已关闭，功能实现/回移正在推进
   - 评估：说明安全协议支持已有实质进展。

---

## 6. 功能请求与路线图信号

### 6.1 Iceberg REST Catalog 企业级适配在增强
- Issue: #61388 `Support custom HTTP headers for REST Iceberg catalog via header.* properties`
- 链接: apache/doris Issue #61388

**判断：较可能进入后续版本。**  
原因：  
1. 需求符合 Iceberg REST 规范；  
2. 今日已有多个 Iceberg 相关修复和增强，说明该方向活跃；  
3. 企业接入 API Gateway / Auth Proxy 的诉求明确，优先级较高。

### 6.2 Doris 对 Paimon 的原生支持在加速
- PR: #60296 / #61369
- 链接: apache/doris PR #60296 / apache/doris PR #61369

**判断：大概率纳入后续稳定版本能力版图。**  
通过引入 paimon-cpp，Doris 对 Paimon 的支持正在从“可用”走向“高性能、低复杂度”，这是明显的产品路线信号。

### 6.3 检索分析融合能力继续演进
- PR: #59847 `support BM25 scoring in inverted index query_v2`
- 链接: apache/doris PR #59847

**判断：是中期功能重点。**  
若该 PR 合并，Doris 在全文检索相关性打分上的能力会更完整，对 AI 检索、日志分析和搜索分析市场更具吸引力。

### 6.4 运维可观测性需求：BE compaction 系统表
- Issue: #48893 `[Enhancement] add ... information_schema.be_compaction_tasks`
- 链接: apache/doris Issue #48893

**判断：值得纳入运维增强路线。**  
用户希望通过 `information_schema` 暴露 compaction 队列/运行状态元数据，这与 Doris 近年持续增强可观测性的趋势一致，对排查 compaction 积压、性能抖动很有帮助。

### 6.5 安全协议支持继续补齐
- Issue: #60236 + PR: #61406
- 链接: apache/doris Issue #60236 / apache/doris PR #61406

**判断：LDAPS 支持已经进入落地阶段。**  
这属于企业环境常规要求，预计会进入近期维护版本。

---

## 7. 用户反馈摘要

基于今日 Issues 可提炼出几类真实用户痛点：

1. **云原生部署下的认证链路不够完整**
   - 代表：#55972
   - 用户场景：Doris 通过 doris-operator 部署在 EKS，FE/BE 使用 K8s ServiceAccount 绑定 AWS 身份。
   - 痛点：用户希望完全采用云平台身份体系，不再配置静态凭证；当前 storage vault 对 web identity 支持不足，影响安全合规和运维简化。

2. **现代湖仓生态“能连接”不等于“能查询”**
   - 代表：#61191、#61388
   - 用户场景：通过 Nessie / Iceberg REST catalog 接入湖仓元数据。
   - 痛点：元数据发现成功，但真正 scan/query 阶段仍可能失败；同时企业环境还需要自定义 HTTP header 支持。
   - 含义：用户已不满足于基础连接器，而要求 Doris 真正适配生产级湖仓体系。

3. **导入与更新链路的语义一致性仍有风险**
   - 代表：#57652
   - 用户场景：Routine Load + Unique 模型部分列更新。
   - 痛点：文档支持的能力在实际运行中未生效，说明用户尤其关注**流式导入与更新语义的可靠兑现**。

4. **故障恢复后的副本可用性问题仍困扰部分老用户**
   - 代表：#5869
   - 用户场景：BE 宕机重启后查询失败。
   - 痛点：系统恢复后仍出现 `no queryable replica found`，这类问题对生产故障恢复信心影响较大。

---

## 8. 待处理积压

以下长期未充分收敛的问题，建议维护者重点关注：

### 8.1 云原生认证支持积压
- Issue: #55972 `[Stale] Storage vault unable to use AWS web identity auth`
- 链接: apache/doris Issue #55972
- 风险：影响 EKS / IRSA 等现代云部署方式，建议确认是否已有设计方案或 workaround，并避免因 stale 状态被忽略。

### 8.2 副本恢复后不可查询的老问题
- Issue: #5869 `[Stale] BE 宕机重启后... no queryable replica found`
- 链接: apache/doris Issue #5869
- 风险：问题创建于 2021 年，涉及节点恢复与副本状态一致性，若仍被用户持续触发，建议重新归档复现条件。

### 8.3 Compaction 可观测性增强长期待实现
- Issue: #48893 `[OPEN] add information_schema.be_compaction_tasks`
- 链接: apache/doris Issue #48893
- 风险：不是阻断性 bug，但对排障和平台化运维价值高，且需求已存在较长时间。

### 8.4 高价值开放 PR 需尽快推进
- PR: #59847 `BM25 scoring`
- 链接: apache/doris PR #59847
- 风险：功能价值高，但若长期悬而未决，可能影响检索能力路线推进。

- PR: #61269 `unify FE OSS filesystem with Jindo`
- 链接: apache/doris PR #61269
- 风险：涉及依赖和文件系统实现统一，拖延可能继续保留多实现并存的维护成本。

- PR: #61404 `Fix BDB JE resource leak in BDBEnvironmentTest`
- 链接: apache/doris PR #61404
- 风险：若不尽快合入，CI 资源浪费和 FE UT 超时问题可能持续影响研发效率。

---

## 附：日报结论

今天的 Apache Doris 呈现出一个很鲜明的状态：**主线开发活跃，稳定性修复密集，外部生态持续拓展**。  
从已合并 PR 看，社区正在优先处理 **Iceberg/ES/Paimon 兼容性、分支回移、测试稳定性、一致性语义修复**；从新增需求和未解决 Issue 看，下一阶段的重点可能会落在 **企业级湖仓接入、云原生认证、安全协议、检索分析融合** 上。  
如果从项目健康度评估，今天可给出：**活跃度高、修复效率高、路线清晰，但云原生认证与外部系统深度兼容仍需继续补课**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告（2026-03-17）

## 1. 生态全景

过去 24 小时，OLAP 与分析型存储引擎开源生态整体呈现出三个明显特征：**高活跃、强修复导向、湖仓/云原生持续深化**。  
从项目动态看，主流引擎几乎都在围绕 **外部表/湖仓兼容性、对象存储访问效率、查询正确性、流式/增量链路稳定性、测试与工程质量** 持续投入。  
另一个共同信号是，用户需求已从“能连通、能跑通”升级到“**企业级真实环境可稳定运行**”，包括 REST Catalog、SigV4/OAuth、K8s 身份认证、S3 请求成本、版本升级回归控制等。  
整体上，生态正从单点性能竞争，转向 **湖仓接入深度、云环境适配能力、SQL/优化器正确性、生产可运维性** 的综合竞争。

---

## 2. 各项目活跃度对比

> 注：Databend 当日摘要生成失败，以下表格不纳入横向量化比较。

| 项目 | Issues 更新 | PR 更新 | 今日 Release | 健康度评估 | 简要判断 |
|---|---:|---:|---|---|---|
| **ClickHouse** | 76 | 396 | 无 | 高 | 活跃度最高，crash/fuzz/格式与存储修复密集，工程韧性强 |
| **Apache Doris** | 7 | 202 | 无 | 高 | 分支维护积极，湖仓连接器与稳定性修复并进 |
| **StarRocks** | 36 | 104 | 无 | 中高 | 多分支维护成熟，Lake/Compaction/Iceberg 持续增强 |
| **Apache Arrow** | 27 | 15 | 无 | 中上 | 基础设施、跨平台、Python 类型系统建设明显 |
| **Apache Iceberg** | 14 | 50 | 无 | 良好偏活跃 | 核心规范/连接器/API 演进并行，Kafka Connect 压力较大 |
| **DuckDB** | 14 | 36 | 无 | 中高 | 1.5.0 发布后回归修复期，短期稳定性压力较大 |
| **Velox** | 5 | 50 | 无 | 中高 | 引擎架构演进活跃，但待合并 PR 较多、CI/兼容问题仍在 |
| **Apache Gluten** | 6 | 22 | 无 | 中高 | Spark/Velox 兼容与性能优化并进，轻查询性能仍需补课 |
| **Delta Lake** | 3 | 32 | 无 | 良好 | Kernel / DSv2 / 流式稳定性持续推进 |
| **Databend** | - | - | - | - | 当日摘要缺失 |

### 活跃度观察
- **第一梯队（超高活跃）**：ClickHouse、Doris  
- **第二梯队（高活跃）**：StarRocks、Iceberg、Velox、DuckDB、Delta Lake  
- **第三梯队（稳态活跃）**：Arrow、Gluten  
- **共同特征**：几乎所有项目当天都**没有发布新版本**，说明当前重点更多在于主干修复、回补稳定分支、为后续版本蓄水。

---

## 3. Apache Doris 在生态中的定位

### 3.1 Doris 的当前定位
Apache Doris 当前处于典型的 **“一体化 MPP OLAP 引擎 + 湖仓连接增强 + 检索分析融合尝试”** 路线上。  
与生态内同类项目相比，Doris 的特点是：
1. **内表分析能力与外部湖仓接入并重**；
2. **多维护分支（4.0/4.1/3.1）稳定性修复节奏很强**；
3. 正在从传统数仓型 OLAP，向 **外表生态 + 文本检索/倒排索引 + 云环境适配** 扩展。

### 3.2 相比同类的优势
**相对 StarRocks：**
- Doris 今天在 **Iceberg / Paimon / ES / OSS 文件系统统一** 上的连接器修复与增强更密集；
- BM25 倒排检索评分显示其在 **检索分析一体化** 上释放了更明显信号。

**相对 ClickHouse：**
- ClickHouse 仍然在存储内核、格式解析、MergeTree/对象存储路径上更强势；
- 但 Doris 在 **湖仓 catalog 接入、Paimon native 支持、企业连接器适配** 上的路线更聚焦“统一分析入口”。

**相对 DuckDB：**
- DuckDB 更偏嵌入式/本地分析与数据科学工作流；
- Doris 明显面向 **服务端集群化 OLAP、统一数仓/湖仓查询平台**。

**相对 Delta Lake / Iceberg：**
- 后两者更偏表格式/协议层与生态中间层；
- Doris 是直接面向查询执行与分析服务的完整引擎，用户更关心其 **查询、导入、外部表、云存储、权限认证** 的一体能力。

### 3.3 技术路线差异
Doris 当前的路线可概括为：

- **存算一体 OLAP 引擎** 为核心；
- **外表/湖仓生态深接入** 为中期重点；
- **检索能力增强（BM25、倒排索引 query_v2）** 为差异化尝试；
- **维护分支积极 backport**，说明其商业/生产用户对稳定版依赖强。

这和：
- ClickHouse 的“极致执行内核 + 格式/对象存储/压缩路径优化”
- StarRocks 的“Lakehouse 入口 + PK/Lake/Compaction/Arrow Flight”
- DuckDB 的“嵌入式分析 + 本地/对象存储读取优化”
- Delta/Iceberg 的“表格式协议与连接器生态”
形成了较清晰分工。

### 3.4 社区规模对比
从当日 PR/Issue 规模看：
- Doris **PR 更新 202**，显著高于 StarRocks、DuckDB、Iceberg、Delta、Velox、Gluten、Arrow；
- 仅次于 ClickHouse 的 **396 PR**；
- 这说明 Doris 当前社区吞吐已处于 **开源 OLAP 第一梯队**。

结论上，Doris 已经不是“单一中国社区活跃项目”的定位，而是处于 **全球 OLAP / Lakehouse 查询引擎高活跃阵营**，且分支维护成熟度较高。

---

## 4. 共同关注的技术方向

以下方向在多个项目中同时出现，说明已成为生态共性主题。

### 4.1 湖仓连接器与外部 Catalog 深度兼容
**涉及项目：** Doris、StarRocks、ClickHouse、Iceberg、Delta Lake、Velox、Gluten  
**具体诉求：**
- Doris：Iceberg REST catalog 自定义 header、Nessie REST catalog 可见表不可查询、Paimon native 支持
- StarRocks：Iceberg AND 谓词部分下推、REST SigV4 传递 IAM role
- ClickHouse：Iceberg DDL crash
- Velox：Iceberg positional update
- Gluten：Iceberg 上 `input_file_name()` 与元数据传播修复
- Delta：catalog-managed table 元数据更新、ServerSidePlanning/OAuth
- Iceberg：SnapshotChanges、Kafka Connect、JDBC Catalog 稳定性

**结论：**  
生态已从“读取湖仓表”升级到“**完整 catalog/认证/谓词/元数据/变更语义** 的企业级兼容”。

---

### 4.2 对象存储/S3 访问成本与效率优化
**涉及项目：** DuckDB、ClickHouse、Doris、Arrow、StarRocks、Delta Lake  
**具体诉求：**
- DuckDB：S3/Parquet 请求放大、Hive partition filter 未早下推
- ClickHouse：S3Queue Ordered Mode 枚举优化、object storage TOCTOU 修复
- Doris：云环境 FDB locality、OSS 文件系统统一
- Arrow：Parquet 写入缓存字节 API、跨平台打包/CI 稳定性
- Delta/StarRocks：云身份、SigV4、catalog 托管与对象存储接入链路

**结论：**  
对象存储已从“后端存储选项”变成主战场，重点不再只是吞吐，而是：
- API 调用成本
- 列裁剪/分区过滤是否早下推
- 身份认证与托管环境兼容
- 长尾边界场景稳定性

---

### 4.3 查询正确性与优化器回归控制
**涉及项目：** Doris、ClickHouse、DuckDB、Iceberg、Velox、Gluten、Delta Lake  
**具体诉求：**
- Doris：`abs(decimalv2)` 错误结果
- ClickHouse：regexp rewrite、PREWHERE/cache、projection/index、correlated subquery
- DuckDB：TopN/window 重写、left join null 过滤、索引损坏风险
- Iceberg：Spark 聚合下推 NaN 错误
- Velox：Spark 聚合 fuzzing、Parquet 统计信息误判
- Gluten：Spark 兼容、TIMESTAMP_NTZ、limit 路径行为
- Delta：协议校验、MapType key 语义、流式数据丢失场景测试

**结论：**  
优化器和下推路径已成为最主要风险区。生态普遍在强调：  
**性能优化不能以语义不一致为代价。**

---

### 4.4 流式/增量链路与长跑任务稳定性
**涉及项目：** Delta Lake、Iceberg、Doris、ClickHouse、Gluten  
**具体诉求：**
- Delta：initial snapshot 数据丢失场景、micro-batch 资源泄漏、CDC 支持
- Iceberg：Kafka Connect 丢消息、协调者选举日志不足
- Doris：Routine Load partial column update
- ClickHouse：Kafka + MV 稳定性
- Gluten：limit/collect 内存释放、动态过滤与 shuffle 协同

**结论：**  
生产用户越来越重视：  
**故障恢复不丢数、长时间运行不泄漏、增量读写语义可验证。**

---

### 4.5 云原生认证与企业安全治理
**涉及项目：** Doris、StarRocks、Delta Lake、ClickHouse、Arrow  
**具体诉求：**
- Doris：AWS Web Identity / IRSA、LDAPS
- StarRocks：Arrow Flight advertise host、REST SigV4 IAM role
- Delta：OAuth + credential refresh、托管 catalog 元数据原子同步
- ClickHouse：source filter grants 扩展到 REMOTE
- Arrow：Windows MSI 签名、分发可信性

**结论：**  
安全问题不再局限于库表权限，而是扩展到：
- 云身份
- 服务端鉴权
- 远程 catalog
- 安装与分发可信链路

---

## 5. 差异化定位分析

## 5.1 存储格式与外部生态支持差异

| 项目 | 存储/格式定位 | 特征 |
|---|---|---|
| **Doris** | 自有存储 + Iceberg/Paimon/ES/Hive 外表 | 正在强化统一查询入口能力 |
| **ClickHouse** | 自有 MergeTree 为核心，外部格式读取增强 | 内核最强，湖仓更多是读取与兼容拓展 |
| **StarRocks** | 自有存储 + Lake 表 + Iceberg/Paimon/Hive | 更强调 Lakehouse 查询入口 |
| **DuckDB** | Parquet/对象存储/本地文件原生强 | 轻量、嵌入式，数据湖读分析突出 |
| **Iceberg** | 表格式标准/元数据层 | 不直接做 OLAP 服务内核 |
| **Delta Lake** | 表格式 + Spark/Kernel 执行集成 | 偏协议与 Spark 生态深融合 |
| **Arrow** | 内存格式/列式交换/Parquet 工具链 | 生态底座，不是最终查询引擎 |
| **Velox** | 执行引擎库 + Hive/Iceberg/cudf 接入 | 引擎内核组件型定位 |
| **Gluten** | Spark 原生执行加速层 | 依赖 Spark + Velox 生态 |

---

## 5.2 查询引擎设计差异

- **Doris / StarRocks / ClickHouse**：服务端 MPP OLAP 引擎  
  - Doris 更平衡“内表分析 + 外部生态 + 检索”
  - StarRocks 更偏“Lakehouse 统一入口 + PK/Lake”
  - ClickHouse 更偏“高性能内核 + 自有存储最优”

- **DuckDB**：嵌入式 OLAP 引擎  
  - 优势在本地分析、Python/数据科学工作流、轻量部署

- **Iceberg / Delta Lake**：表格式与元数据协议层  
  - 更多影响引擎生态，而不是直接替代引擎

- **Velox / Arrow / Gluten**：组件型基础设施  
  - Arrow 是列式数据与格式底座
  - Velox 是执行引擎内核
  - Gluten 是 Spark 加速层

---

## 5.3 目标负载类型差异

| 项目 | 目标负载 |
|---|---|
| **Doris** | 实时分析、交互式报表、统一数仓/湖仓查询、检索分析融合 |
| **ClickHouse** | 高吞吐 OLAP、日志/事件分析、时序/大规模聚合 |
| **StarRocks** | 实时数仓、Lakehouse 查询、主键更新、MV 加速 |
| **DuckDB** | 本地 OLAP、Notebook/数据科学、临时分析、Parquet 查询 |
| **Iceberg/Delta** | 湖仓表管理、增量变更、跨引擎数据共享 |
| **Velox/Gluten** | 执行加速、中间层引擎能力复用 |
| **Arrow** | 数据交换、跨语言计算、列式格式基础设施 |

---

## 5.4 SQL 兼容性差异
- **ClickHouse**：功能扩展丰富，但仍在持续补 optimizer/analyzer 一致性
- **Doris / StarRocks**：更贴近数仓/BI SQL 语义，近期持续增强高级分析与连接器场景
- **DuckDB**：对分析 SQL、Python 工作流、窗口/子查询支持很强，但 1.5.0 暴露优化回归
- **Delta / Iceberg**：更多关心协议、元数据、Spark/Flink/Kafka Connect 语义一致性
- **Gluten / Velox**：SQL 兼容性本质上体现为与 Spark/上层系统结果一致

---

## 6. 社区热度与成熟度

## 6.1 活跃度分层

### 第一层：超高活跃、主线与维护分支并行
- **ClickHouse**
- **Apache Doris**

特点：
- PR 吞吐极高
- 有大量 bugfix、backport、fuzz/CI 修复
- 社区具有强生产用户反馈闭环

### 第二层：高活跃、功能增强与稳定性修复并进
- **StarRocks**
- **Iceberg**
- **DuckDB**
- **Velox**
- **Delta Lake**

特点：
- 一边补稳定性，一边推进较清晰的新能力路线
- 用户反馈多集中在生产深水区场景

### 第三层：基础设施稳态建设型
- **Arrow**
- **Gluten**

特点：
- 一方偏生态底座与跨平台支持
- 一方偏执行加速与兼容性补齐
- 功能爆发度不如前两层，但基础价值很高

---

## 6.2 快速迭代阶段 vs 质量巩固阶段

### 快速迭代阶段
- **Velox**：RPC、Iceberg、cuDF、多方向同时推进
- **Delta Lake**：Kernel/DSv2/流式/服务端规划并进
- **Gluten**：Spark 4.x、新类型、shuffle 过滤、Iceberg 兼容持续扩张
- **DuckDB**：1.5.0 发布后快速吸收回归修复

### 质量巩固阶段
- **ClickHouse**：fuzz → crash 修复 → must-backport 闭环很成熟
- **Doris**：多维护分支稳定性修复密集
- **Arrow**：CI/Packaging/跨平台/类型系统稳步建设
- **Iceberg**：核心正确性与连接器质量持续收敛
- **StarRocks**：多分支回移与文档/连接器/存储边界修补同步

结论：  
整个生态并非“谁更成熟谁就更少改动”，而是成熟项目正在进入 **高强度稳定化与企业级兼容补齐** 阶段。

---

## 7. 值得关注的趋势信号

## 7.1 湖仓接入已从“读表”进入“企业级互操作”
典型表现：
- REST Catalog header、SigV4、OAuth、IAM Role、Nessie、Glue、JdbcCatalog
- AND 谓词部分下推、SnapshotChanges、positional update、metadata propagation

**对架构师的意义：**  
未来选型不能只看“是否支持 Iceberg/Delta/Paimon”，而要看：
- catalog 协议支持深度
- 认证方式
- 谓词/分区/变更语义保真度
- 出错时可观测性

---

## 7.2 对象存储优化正在成为引擎竞争主战场
典型表现：
- DuckDB 的 S3 请求放大回归
- ClickHouse 的 S3Queue 枚举优化
- Doris/StarRocks/Delta 的云身份与对象存储链路修复
- Arrow 的 Parquet 写入可观测性增强

**对数据工程师的意义：**
- 未来性能瓶颈经常不在 CPU，而在 **list/get 次数、列回扫、分区发现与远程认证**
- 做架构选型或升级评估时，应加入：
  - S3 API 请求量
  - 分区过滤前移程度
  - 小文件与 metadata scan 开销
  - 身份认证链路复杂度

---

## 7.3 查询正确性正在压过“单纯性能”成为首要评价指标
典型表现：
- Spark 聚合 NaN、decimal abs、left join null filter、optimizer rewrite、projection/index 顺序、Parquet 旧统计信息兼容
- 各项目都在补 fuzz、回归测试、must-backport、E2E data loss 场景

**对技术决策者的意义：**
- 升级版本时不能只看 benchmark，应重点验证：
  - SQL 语义回归
  - 下推路径差异
  - 新旧优化器行为一致性
  - 外部表读取正确性

---

## 7.4 云原生身份与安全治理正从附加项变成刚需
典型表现：
- IRSA/Web Identity
- OAuth / credential refresh
- LDAPS
- source filter grants
- Windows 安装签名与分发可信性

**参考价值：**
- 对运行在 K8s / EKS / 托管平台的团队，未来不支持云原生身份链路的分析引擎会越来越难进入标准平台体系。

---

## 7.5 “统一分析入口”趋势在增强
典型表现：
- Doris：Paimon、Iceberg、ES、BM25
- StarRocks：Iceberg、Arrow Flight、ClickHouse 外表诉求
- ClickHouse：S3Queue、Iceberg、Parquet
- DuckDB：S3/Parquet/Hive-style partition
- Delta/Iceberg：作为生态协议中心继续外溢

**行业判断：**
未来更有竞争力的系统，往往不是“只擅长自有存储”，而是能成为：
- 湖仓查询层
- 多源统一分析层
- 流批与增量统一访问层

---

## 总结结论

从 2026-03-17 的社区动态看，开源 OLAP / 分析型存储生态已进入 **“企业级深水区竞争”**：  
竞争焦点正由单机性能或单点 SQL 功能，转向 **湖仓互操作、对象存储效率、查询正确性、云原生认证、长跑任务稳定性**。  

对 Apache Doris 而言，其当前处于非常有利的位置：  
- **活跃度位居第一梯队**
- **外部生态接入持续增强**
- **多分支维护能力成熟**
- 并已开始通过 **BM25/倒排索引** 探索差异化路线  

但若要进一步扩大生态影响力，后续仍需重点补强两类能力：
1. **云原生认证与企业 catalog 深度兼容**
2. **外部表/湖仓链路从“可见元数据”到“稳定可查询”的最后一公里**

如果你愿意，我可以继续把这份报告再整理成两种版本之一：  
1. **管理层一页纸摘要版**  
2. **面向架构评审会的“选型对比矩阵版”**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报 · 2026-03-17

## 1. 今日速览

过去 24 小时 ClickHouse 保持高活跃：Issues 更新 **76** 条，PR 更新 **396** 条，说明核心开发、CI 修复、回归处理和功能演进都在持续高速推进。  
从内容看，今天的重点仍然是 **稳定性修复 + 测试基础设施增强 + 存储/格式相关边界条件修复**，尤其集中在 Parquet、压缩编解码、MergeTree、Keeper、Analyzer 相关路径。  
没有新版本发布，但已有多条带 **must-backport / critical-bugfix** 标记的 PR，表明维护者正在为稳定分支持续吸收高优先级修复。  
整体健康度评价：**高活跃、修复导向明显、主干风险可控，但 26.2 性能回归与若干 crash/fuzz 问题值得持续跟踪**。

---

## 2. 项目进展

### 今日值得关注的已关闭 Issue / 重要推进

#### 1) `windowFunnel(strict_deduplication)` 异常结果问题关闭
- Issue: #37177  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/37177
- 影响方向: **查询函数正确性 / 分析函数**
- 说明: 历史较久的 `windowFunnel` 在 `strict_deduplication` 模式下返回非预期结果的问题已关闭，说明该类时序漏斗分析函数的语义一致性在推进中，对事件分析类用户是利好。

#### 2) StorageKafka + MV 去重配置导致异常问题关闭
- Issue: #83995  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/83995
- 影响方向: **流式接入 / Kafka / 物化视图**
- 说明: `deduplicate_blocks_in_dependent_materialized_views` 打开时 Kafka 存储抛异常的问题被关闭，意味着 Kafka → MV 的生产链路稳定性进一步提升。

#### 3) `replaceRegexpOne` 受优化开关影响结果不一致问题关闭
- Issue: #93434  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/93434
- 影响方向: **SQL 正确性 / Analyzer / 表达式重写**
- 说明: 同一 SQL 因 `optimize_rewrite_regexp_functions` 不同而产生不同结果，这类问题本质上是优化器/重写器语义泄漏。问题关闭对 SQL 兼容性和可预测性是明显正向信号。

#### 4) Query condition cache 与 PREWHERE 处理不当问题关闭
- Issue: #85222  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/85222
- 影响方向: **MergeTree 读取优化 / 查询缓存 / 正确性**
- 说明: 查询条件缓存默认开启，若与 PREWHERE 哈希/过滤 DAG 组合不正确，会带来错误跳过范围风险。该问题关闭意味着缓存正确性边界被进一步补齐。

#### 5) 多个 crash/fuzz 问题在 24 小时内被关闭
- `SEGV with process_query_plan_packet setting and hypothesis index` #81281  
  https://github.com/ClickHouse/ClickHouse/issues/81281
- `Server crash ... analyzer with nested GLOBAL IN` #99362  
  https://github.com/ClickHouse/ClickHouse/issues/99362
- `Bad cast from type A to B` fuzz issue #99401  
  https://github.com/ClickHouse/ClickHouse/issues/99401

这说明主线仍在持续吸收 **Analyzer、计划序列化、MergeTree、分布式查询** 等方向的崩溃修复。

---

### 今日活跃且具实质推进意义的 PR

#### 1) Parquet 读取路径空指针修复，且要求回补
- PR: #99677  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99677
- 标签: `pr-must-backport`, `pr-critical-bugfix`
- 说明: 修复 Parquet reader 在 `filter-in-decoder` 优化路径中遇到“整页被过滤掉”场景时的空指针解引用。
- 意义: **对象存储/湖仓读取稳定性** 的关键修复，优先级很高，且非常可能进入近期稳定分支。

#### 2) 新增多类 fuzz targets
- PR: #99653  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99653
- 说明: 为压缩编解码、NativeReader、DataTypes、Variant/Dynamic、LowCardinality、WASM 等新增 fuzz 覆盖。
- 意义: 这是典型的 **工程质量基础设施投资**。短期看不会直接增加用户功能，但会显著提升未来版本对恶意输入、边界输入、格式解析异常的发现能力。

#### 3) 修复 T64 / Multiple codec 解压崩溃
- PR: #99680  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99680
- 说明: 新 fuzz target 直接挖出了 T64 heap-buffer-overflow 与 Multiple codec abort 问题。
- 意义: 这显示出 ClickHouse 当前“**先补 fuzz 覆盖，再快速修 crash**”的闭环很有效，尤其利好压缩、导入导出、备份恢复等路径。

#### 4) 修复 merge 过程中 `injectRequiredColumns` 悬垂引用崩溃
- PR: #99679  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99679
- 说明: 由于 vector 扩容导致引用失效，触发 merge 时 crash。
- 意义: 属于 **存储引擎内部稳定性** 修复，涉及 MergeTree 列注入逻辑，风险高、收益大。

#### 5) 修复 object-storage 磁盘版本元数据校验异常
- PR: #99580  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99580
- 说明: 处理 Azure / object storage 磁盘上的 TOCTOU 场景。
- 意义: 云对象存储已是 ClickHouse 常见部署形态，这类修复直接改善云环境稳定性。

#### 6) 修复 `TABLE_UUID_MISMATCH` 非 analyzer 路径忽略问题
- PR: #99380  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99380
- 说明: 带 `must-backport` 标签，属于稳定版用户可见错误行为修复。
- 意义: 兼顾 analyzer / 非 analyzer 双路径一致性，说明项目当前仍在消除新老规划器并存时期的行为差异。

#### 7) `clickhouse-local` 新增 `ls` 元命令
- PR: #99652  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99652
- 说明: 将 `ls` 客户端侧重写为 `file()` 查询。
- 意义: 虽非核心引擎能力，但对本地分析、临时数据探索、脚本化操作非常友好，属于明显的易用性增强。

#### 8) `ARRAY JOIN` 未使用列裁剪修复
- PR: #99587  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99587
- 说明: 修复 ARRAY JOIN 路径上的无用列裁剪问题。
- 意义: 可能改善 **查询计划优化与列裁剪效率**，也可能避免错误行为，兼具性能和正确性价值。

#### 9) Variant 在 Escaped/Raw 格式下的 `\N` NULL 反序列化修复
- PR: #99648  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99648
- 意义: 属于 **SQL/格式兼容性** 细节修复，对使用文本格式交换数据的用户较重要。

---

## 3. 社区热点

### 热点 1：26.2 INSERT 性能回归引发关注
- Issue: #99241  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99241
- 标签: `performance`, `v26.2-affected`
- 评论数: 20

这是今天最值得关注的用户侧问题之一：用户反馈从 **25.12 升级到 26.2 后，同样的 INSERT 查询慢了 3 倍**。  
技术诉求非常明确：  
1. 找出 26.2 在写入路径上的回归点；  
2. 明确是否与 `ReplacingMergeTree`、merge 策略、压缩、索引更新或新 analyzer/optimizer 路径相关；  
3. 给出可复现基准和回滚/规避建议。  
这类性能回归虽然不一定导致错误结果，但会直接影响生产升级意愿，是版本 adoption 的关键阻力。

### 热点 2：S3Queue Ordered Mode 需要更高效的 S3 枚举策略
- Issue: #91522  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/91522
- 评论数: 10

用户希望 S3Queue Ordered Mode 利用 S3 `ListObjects` 的 `StartAfter` 参数，以减少大量重复 listing。  
背后反映的是：**ClickHouse 正在被更重度地用于对象存储上的增量摄取场景**，而 S3 API 调用放大不仅影响性能，也直接影响云成本。  
这类需求具备很强现实价值，且和今天另外两个 S3Queue 需求一起看，说明 **S3Queue 正在成为活跃路线图方向**。

### 热点 3：MergeTree/读取路径 CI crash 持续暴露
- Issue: #99358  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99358
- 标签: `crash-ci`
- 评论数: 4

`MergeTreeRangeReader finalize failed during data reading` 来自 CI 自动 crash 报告。  
虽然此类 issue 不一定直接映射到用户生产问题，但它通常代表 **读取器、mark range、finalize、过滤/投影/预取交互** 等内部路径仍有脆弱边界。今天多个相关 PR 说明维护团队对此保持高响应。

### 热点 4：source filter grants 扩展到更多来源类型
- Issue: #95555  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/95555
- 评论数: 4

用户希望把 source filter grants 扩展到更多 source type，尤其是 `REMOTE`。  
这反映出企业用户对 **细粒度数据源访问控制** 的需求增强，特别是在多租户、联邦查询和跨集群访问场景下，安全治理已经从“表级授权”转向“来源级限制”。

### 热点 5：ReplacingMergeTree 自动清理删除行
- Issue: #99348  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99348
- 评论数: 2

希望增加 `replacing_merge_cleanup_period_seconds`，让 deleted rows 能自动周期性清理。  
这是典型的 **运维自动化 / 存储回收诉求**，对把 ReplacingMergeTree 当作“近实时可变实体表”的用户来说非常重要。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P0 / 高优先级崩溃与内存安全

#### 1) Parquet filter-in-decoder 路径空指针
- Issue/背景关联 PR: #99677  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99677
- 状态: **已有修复 PR，且 must-backport / critical-bugfix**
- 影响: Parquet 读取，可能影响对象存储湖仓场景。
- 评估: 今日最明确、最高优先级的已识别修复之一。

#### 2) merge 期间悬垂引用导致 crash
- PR: #99679  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99679
- 状态: **已有 fix PR**
- 影响: MergeTree merge 过程。
- 评估: 存储核心路径问题，属于必须尽快合并类型。

#### 3) T64 / Multiple codec 解压越界与 abort
- PR: #99680  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/99680
- 状态: **已有 fix PR**
- 影响: 压缩编解码路径、导入导出、潜在不可信输入。
- 评估: 内存安全问题，严重性高。

#### 4) Iceberg 表执行 `ALTER TABLE MODIFY COLUMN COMMENT` 崩溃
- Issue: #99523  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99523
- 状态: **暂未在所给数据中看到对应 fix PR**
- 影响: Iceberg catalog / DDL 兼容性。
- 评估: 对湖仓集成用户影响较大，应重点关注后续修复。

### P1 / 正确性与回归

#### 5) 26.2 INSERT 性能退化 3 倍
- Issue: #99241  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99241
- 状态: **未见 fix PR**
- 影响: 升级阻塞，写入吞吐下降。
- 评估: 尽管不是 crash，但对生产升级决策的影响极大。

#### 6) projection index 下排序块顺序被破坏
- Issue: #99388  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99388
- 状态: **未见 fix PR**
- 影响: 查询正确性 / 排序语义 / projection 相关逻辑。
- 评估: 一旦可稳定复现，严重程度不低。

#### 7) `Npy` 格式负 shape 导致无限循环
- Issue: #99585  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99585
- 状态: **未见 fix PR**
- 影响: 文件格式解析，可能导致 CPU hang。
- 评估: 更偏输入校验漏洞，但对开放导入场景很关键。

#### 8) 相关子查询对 `LIMIT 0 / LIMIT n OFFSET m` 的支持与回归
- Issue: #99524  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99524
- 状态: **未见 fix PR**
- 影响: correlated subquery 兼容性。
- 评估: 反映 SQL 语义覆盖仍在扩展，且近期有回归引入。

### P2 / CI、测试与环境稳定性

#### 9) `MergeTreeRangeReader finalize failed during data reading`
- Issue: #99358  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99358
- 状态: Open
- 评估: 需观察是否被后续读取路径修复覆盖。

#### 10) 多个 flaky test 修复进行中
- PR: #99684 `Fix flaky test 02311_system_zookeeper_insert`  
  https://github.com/ClickHouse/ClickHouse/pull/99684
- PR: #99594 `Fix timeout in 02884_parallel_window_functions`  
  https://github.com/ClickHouse/ClickHouse/pull/99594
- 说明: 这表明 CI 可靠性仍是今日重点工作之一。

---

## 5. 功能请求与路线图信号

### 可能进入后续版本的需求

#### 1) S3Queue 能力持续增强
- `S3Queue Ordered Mode should use StartAfter` #91522  
  https://github.com/ClickHouse/ClickHouse/issues/91522
- `Keep the original prefixes in S3Queue after_processing = 'move'` #96062  
  https://github.com/ClickHouse/ClickHouse/issues/96062

**信号判断：较强。**  
S3Queue 相关 issue 持续活跃，且都指向生产化摄取细节，说明对象存储摄取链路是持续投入方向。

#### 2) `ReplacingMergeTree` 自动清理删除数据
- Issue: #99348  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99348

**信号判断：中等偏强。**  
这是高频使用模式下的运维诉求，若实现可明显提升 mutable workload 的易用性。

#### 3) `ALP_RD` 压缩支持
- Issue: #99139  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99139

**信号判断：中等。**  
ALP 系列编码与浮点压缩优化密切相关，若推进，有望成为列式压缩与查询性能的新卖点，特别适合高精度浮点数据场景。

#### 4) 扩展 source filter grants 到 REMOTE 等源
- Issue: #95555  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/95555

**信号判断：较强。**  
安全与治理类功能往往来自真实企业落地痛点，尤其是云和多集群场景。

#### 5) ClickHouse Keeper TTL 节点支持
- Issue: #55595  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/55595

**信号判断：中等。**  
问题较老，但仍有更新，说明需求未消失。若推进，将提升 Keeper 与 ZooKeeper 的功能对齐度。

#### 6) `system.clusters` 性能改进
- Issue: #79300  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/79300

**信号判断：中等。**  
这是典型“大规模集群自监控/元数据查询”问题，虽然不是 flashy feature，但对超大部署用户重要。

#### 7) 文件系统表函数 / 本地文件体验增强
- PR: #53610 `filesystem` table function  
  https://github.com/ClickHouse/ClickHouse/pull/53610
- PR: #99652 `clickhouse-local: add ls meta-command`  
  https://github.com/ClickHouse/ClickHouse/pull/99652

**信号判断：较强。**  
这两项放在一起看，说明 ClickHouse 正在持续强化“**SQL 作为通用数据工具层**”的方向，不只是数据库内核。

---

## 6. 用户反馈摘要

### 1) 升级后的性能稳定性仍是用户第一关注点
- 代表 issue: #99241  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99241

用户对新版本的容忍度，很大程度取决于 **升级后写入/查询是否变慢**。即便功能增加，如果 26.2 存在明显 INSERT 回归，也会直接抑制升级。

### 2) 云对象存储场景越来越主流
- 代表 issue: #91522, #96062, #98665  
- 链接:  
  - https://github.com/ClickHouse/ClickHouse/issues/91522  
  - https://github.com/ClickHouse/ClickHouse/issues/96062  
  - https://github.com/ClickHouse/ClickHouse/issues/98665

用户不再只关心“能否读写 S3”，而是关心：
- API 调用成本是否过高
- move/rename 后目录前缀是否保真
- cache layer 与 base disk 组合是否兼容

这说明对象存储集成已进入“深水区运维优化”阶段。

### 3) 湖仓兼容性成为高频触点
- 代表 issue: #99523  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/99523

Iceberg 上的 DDL crash 说明用户已不满足于“只查询外部表”，而是在期待更完整的元数据/DDL 操作兼容。

### 4) SQL 正确性和优化器一致性仍然敏感
- 代表 issue: #93434, #99524, #99362  
- 链接:  
  - https://github.com/ClickHouse/ClickHouse/issues/93434  
  - https://github.com/ClickHouse/ClickHouse/issues/99524  
  - https://github.com/ClickHouse/ClickHouse/issues/99362

随着 analyzer、新旧路径并行、更多优化开关随机化，用户更在意：
- 同一 SQL 在不同 setting 下是否语义一致
- correlated subquery 是否继续补齐标准能力
- 优化器是否会引入 crash 或错误结果

### 5) 大规模集群与自治运维能力需求增强
- 代表 issue: #79300, #99348, #55595  
- 链接:  
  - https://github.com/ClickHouse/ClickHouse/issues/79300  
  - https://github.com/ClickHouse/ClickHouse/issues/99348  
  - https://github.com/ClickHouse/ClickHouse/issues/55595

说明用户正在把 ClickHouse 用在更复杂、更长期运行的基础设施中，而不只是单纯的分析库。

---

## 7. 待处理积压

以下是值得维护者继续关注的长期或停留较久的重要事项：

### 1) `filesystem` table function PR 挂起时间较长
- PR: #53610  
- 链接: https://github.com/ClickHouse/ClickHouse/pull/53610
- 创建于: 2023-08-20
- 关注点: 该 PR 价值较高，若能推进，有助于文件系统与 SQL 的统一访问模型。长期悬而未决，建议明确设计结论或拆分落地。

### 2) ClickHouse Keeper TTL 节点支持
- Issue: #55595  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/55595
- 创建于: 2023-10-13
- 关注点: Keeper 与 ZooKeeper 功能对齐需求持续存在，建议评估实现成本与协议兼容性。

### 3) `system.clusters` 性能问题
- Issue: #79300  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/79300
- 创建于: 2025-04-17
- 关注点: 面向大集群用户的基础体验问题，虽然优先级可能不如 crash，但影响面广。

### 4) S3Queue Ordered Mode listing 优化
- Issue: #91522  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/91522
- 创建于: 2025-12-04
- 关注点: 高云成本 + 高 API 放大风险，值得尽快产品化。

### 5) source filter grants 扩展到 REMOTE
- Issue: #95555  
- 链接: https://github.com/ClickHouse/ClickHouse/issues/95555
- 创建于: 2026-01-29
- 关注点: 企业安全治理场景价值较高，适合作为权限模型补强项。

---

## 8. 结论

今天 ClickHouse 的动态呈现出非常鲜明的特征：**没有版本发布，但修复密度很高，尤其聚焦于 crash、格式解析、对象存储、MergeTree 内部路径和测试基础设施**。  
项目主线显示出较强工程韧性：一方面用 fuzz 扩大覆盖面，另一方面快速将发现的问题转化为 bugfix PR，并标记回补稳定分支。  
短期最需要关注的是 **26.2 写入性能回归**、**Iceberg DDL crash**、**projection/index 相关正确性问题**；中期则可继续观察 **S3Queue、ReplacingMergeTree 清理、权限模型扩展、文件系统查询能力** 是否进入正式路线图。  
总体上，ClickHouse 依旧保持 **高吞吐开发节奏 + 面向生产问题快速响应** 的健康状态。

如果你愿意，我还可以继续把这份日报整理成：
1. **适合内部周会汇报的一页简版**，或  
2. **按“存储 / SQL / 云集成 / 稳定性”四大模块重组的技术版**。

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB 项目动态日报（2026-03-17）

## 1. 今日速览

过去 24 小时 DuckDB 保持高活跃：Issues 更新 14 条、PR 更新 36 条，说明 1.5.0 发布后的回归修复和优化工作仍在快速推进。  
当前讨论焦点高度集中在 **1.5.0 引入的查询优化回归、S3/Parquet 访问放大、ADBC 并发流式结果兼容性** 这三类问题。  
从 PR 走势看，维护者和贡献者已经开始针对部分高影响问题提供定向修复，尤其是 **TopN/window 优化、流式执行、管线 flush、JSON/排序键细节修正**。  
整体健康度判断为：**活跃且修复节奏快，但稳定性面临版本升级后的短期压力**，特别是远程对象存储、窗口优化和计划重写相关路径值得持续关注。

---

## 3. 项目进展

> 今日无新 Release。以下聚焦已关闭/推进明显的 PR 与对核心能力的影响。

### 3.1 已关闭/收敛的重要 PR

- **PR #21397 - Grab correct row group id in ValidityColumnData::UpdateWithBase**  
  链接: duckdb/duckdb PR #21397  
  这是一个偏底层存储一致性修复，针对 **WAL 回放时更新较后 row group 可能触发 `row_id out of range`** 的问题。该修复直接改善了 **持久化恢复与更新日志重放稳定性**，对事务可靠性和崩溃恢复质量有正向作用。

- **PR #21398 - add test for #21271**  
  链接: duckdb/duckdb PR #21398  
  虽然是测试补充，但其意义在于 **把已 backport 的修复覆盖到 1.5 分支的回归测试中**，体现出 DuckDB 正在加强版本线之间的稳定性保障。

- **PR #21403 - Flush remaining operators in pipeline（已关闭，后续由 #21405 延续）**  
  链接: duckdb/duckdb PR #21403  
  该问题涉及执行引擎 pipeline flush 逻辑：当 operator 返回 `FINISHED` 时，缓冲输出可能未完全刷新。虽然原 PR 已关闭，但后续已有替代 PR #21405 持续推进，说明 **执行引擎尾部刷写与数据完整输出** 已被明确纳入修复。

- **PR #21355 - Merge `v1.5-variegata` into `main`（关闭）**  
  链接: duckdb/duckdb PR #21355  
  主要目的是同步分支修复以恢复 nightly CI，可视为 **主干稳定性维护动作**，反映项目当前仍在积极处理发布后 CI/回归噪音。

### 3.2 今日值得关注的在途 PR

- **PR #21415 - fix(adbc): support concurrent statements on the same connection**  
  链接: duckdb/duckdb PR #21415  
  直接对准 Issue #21384，修复 1.5.0 中由于结果改为流式传输后导致的 **同连接并发 statement 失效**。这属于 **接口语义兼容性修复**，对 Arrow ADBC 集成用户非常关键。

- **PR #21388 - Fix incorrect column binding in TopN window elimination with multi-column PARTITION BY**  
  链接: duckdb/duckdb PR #21388  
  针对多列 `PARTITION BY` 下 `row_number()` + 过滤重写引发绑定错误，属于 **优化器正确性修复**。这与近期窗口优化相关回归集中出现相呼应。

- **PR #21408 - skip top_n_window_elimination when struct-pack has no late materialization**  
  链接: duckdb/duckdb PR #21408  
  这是今天最关键的性能修复候选之一。它针对 `ROW_NUMBER()=1` 被重写为 `arg_max + HASH_GROUP_BY` 后在 S3/Parquet 上触发二次全列扫描、导致 **远程请求数暴涨约 50x** 的问题。若合入，将直接缓解 1.5.0 在对象存储上的重大回归。

- **PR #21405 - Flush remaining operators in pipeline**  
  链接: duckdb/duckdb PR #21405  
  继续推进 pipeline flush 修复，影响执行引擎收尾阶段的 **结果完整性与缓冲刷写行为**。

- **PR #21375 - Add row group skipping support for MAP columns in Parquet reader**  
  链接: duckdb/duckdb PR #21375  
  为 Parquet MAP 列补齐 row-group skipping，属于 **分析型存储读取优化**，有望改善包含复杂类型列的大型 Parquet 查询性能。

- **PR #21411 - Correctly limit auto-detection in read_json for files that don't have string columns**  
  链接: duckdb/duckdb PR #21411  
  属于 JSON 自动探测边界修复，改善 **半结构化数据导入的鲁棒性**。

- **PR #21412 - Avoid calling PushCollation in create_sort_key**  
  链接: duckdb/duckdb PR #21412  
  避免排序键重复应用 collation，有助于 **排序语义正确性** 与潜在性能问题收敛。

---

## 4. 社区热点

### 4.1 S3/Parquet 回归：`QUALIFY ROW_NUMBER() ... = 1` 导致远程请求暴涨
- **Issue #21348**  
  链接: duckdb/duckdb Issue #21348

这是今天最值得关注的热点问题之一。用户报告在 hive-partitioned Parquet + S3 场景下，相同查询从 1.4.4 的约 80 次 HTTP GET 激增到 1.5.0 的 4200+ 次，且整体耗时接近 3 倍。  
背后的技术诉求非常明确：用户需要 DuckDB 在 **对象存储上的查询计划重写仍保持“少列读取、少文件探测、少网络请求”** 的 OLAP 友好特性，而不是仅在本地存储场景优化。

**关联修复信号：**
- PR #21408  
  链接: duckdb/duckdb PR #21408

### 4.2 Hive partition 过滤未提前下推，先发现全部文件再裁剪
- **Issue #21347**  
  链接: duckdb/duckdb Issue #21347

该问题与 #21348 形成同一技术簇：**远程文件发现与过滤下推失效**。用户期望 partition filter 能在 glob/listing 阶段就生效，尤其在 S3 上这直接决定 listing 成本与请求数量。  
这说明社区对 DuckDB 的核心期待不只是 SQL 正确，还包括 **云对象存储上的高效读取路径**。

**长期关联 PR：**
- PR #18518 - Push Hive filtering into Glob()  
  链接: duckdb/duckdb PR #18518

该 PR 虽然较早提出且仍待 maintainer approval，但与当前问题高度相关，可能因近期回归而重新获得优先级。

### 4.3 ADBC 接口并发查询兼容性回归
- **Issue #21384**  
  链接: duckdb/duckdb Issue #21384
- **PR #21415**  
  链接: duckdb/duckdb PR #21415

DuckDB 1.5 将查询结果改为流式后，破坏了部分旧有使用方式：同一连接上先后执行两个 statement，再从前一个 stream 取数据会失败。  
这体现的是 **接口行为兼容性** 问题，而不是单纯 bug。对使用 Arrow/ADBC 的嵌入式分析系统而言，这是典型“升级后隐性破坏”场景，因此社区反应会较敏感。

### 4.4 时间戳在 WHERE 子句下转换失败
- **Issue #20708**  
  链接: duckdb/duckdb Issue #20708

这是一个已有一段时间的问题，今天再次活跃。用户反馈同样的 timestamp 字面量在 `SELECT` 中正常、在 `WHERE` 中却报 conversion error。  
这类问题虽然不一定导致崩溃，但会直接伤害用户对 **SQL 语义一致性与类型系统可信度** 的信心。

---

## 5. Bug 与稳定性

以下按严重程度和潜在影响排序。

### P0 / 高严重：崩溃、数据损坏、内部错误

1. **`COPY FROM DATABASE one TO two` 在 v1.5.0 崩溃**  
   - Issue #21392  
     链接: duckdb/duckdb Issue #21392  
   - 关联修复背景：PR #21171  
     链接: duckdb/duckdb PR #21171  
   状态为 **fixed on nightly**，说明主干上已有修复方向。问题涉及 `COPY FROM DATABASE` 的事务与多阶段执行，属于 **数据库复制/迁移稳定性高优先级问题**。

2. **DELETE 在 UPDATE + CREATE INDEX 之后触发内部错误/索引损坏**
   - Issue #21394  
     链接: duckdb/duckdb Issue #21394  
   用户报告后续 DELETE 可触发：
   - `Failed to delete all rows from index`
   - `UNIQUE constraint violation`
   - `Corrupted ART index`  
   这已经接近 **索引一致性/数据结构损坏级别**，风险高。目前未见明确 fix PR，建议维护者优先跟进。

3. **1.5.0 下 left join 子查询后无法正确过滤 NULL**
   - Issue #21407  
     链接: duckdb/duckdb Issue #21407  
   这是典型 **查询正确性回归**。如果 `IS NOT NULL` 或等值过滤在 left join + subquery 场景行为变化，会影响大量 BI/ETL SQL。

4. **`unnest` + join 回归（已关闭）**
   - Issue #21322  
     链接: duckdb/duckdb Issue #21322  
   已关闭，说明该 SQL 正确性回归已有处理，是今日稳定性上的正面信号。

### P1 / 重要：性能回归、接口兼容性、执行语义变化

5. **`QUALIFY ROW_NUMBER() ... = 1` 在 S3 上请求放大约 50x**
   - Issue #21348  
     链接: duckdb/duckdb Issue #21348  
   - 关联 fix PR：#21408  
     链接: duckdb/duckdb PR #21408  
   这是 **云上分析成本级别的回归**，不只是性能慢，更会放大对象存储 API 成本。

6. **Hive partition filter 在 1.5.0 中先枚举全部文件再裁剪**
   - Issue #21347  
     链接: duckdb/duckdb Issue #21347  
   - 关联长期 PR：#18518  
     链接: duckdb/duckdb PR #18518  
   这是与上条并列的重要远程读取退化问题。

7. **ADBC interleaved queries 在 1.5 后失效**
   - Issue #21384  
     链接: duckdb/duckdb Issue #21384  
   - fix PR：#21415  
     链接: duckdb/duckdb PR #21415  
   影响外部生态集成，尤其是依赖 Arrow/ADBC 的程序化消费场景。

8. **临时视图 + `UNION ALL` + `min()` 在 read_parquet 上明显变慢**
   - Issue #21302  
     链接: duckdb/duckdb Issue #21302  
   这是 1.5.x 的性能回归，场景来自 record linkage / Splink，具有实际分析工作负载代表性。

### P2 / 中等级：边界行为、平台兼容、工具链问题

9. **FreeBSD 15 STABLE 下测试触发 SIGILL**
   - Issue #21262  
     链接: duckdb/duckdb Issue #21262  
   平台兼容问题，影响发行打包和系统移植。

10. **`read_parquet()` 中 ETag 比较误报 changed**
   - Issue #21401  
     链接: duckdb/duckdb Issue #21401  
   在 S3-compatible object storage 上，ETag 实际相同但因引号差异被判为变化，属于 **对象存储兼容性问题**，对非 AWS 原生生态尤其敏感。

11. **`generate_grammar.py` 关键字排序逻辑仍有缺陷**
   - Issue #21400  
     链接: duckdb/duckdb Issue #21400  
   这是开发工具链问题，短期不影响终端查询，但会影响语法生成一致性。

12. **带特定 `BUILD_EXTENSIONS` 的 1.5 编译产物不可用（已关闭）**
   - Issue #21402  
     链接: duckdb/duckdb Issue #21402  
   已关闭，说明构建链路问题响应较快。

---

## 6. 功能请求与路线图信号

今天新增“纯功能需求”不多，更多是 **回归修复驱动下暴露的路线图信号**：

### 6.1 对对象存储读取路径的“早过滤、少枚举、少回扫”能力要求持续增强
- Issue #21347  
  链接: duckdb/duckdb Issue #21347
- Issue #21348  
  链接: duckdb/duckdb Issue #21348
- PR #18518  
  链接: duckdb/duckdb PR #18518

这表明社区希望 DuckDB 在 lakehouse / S3 场景中更进一步：
- Hive partition filter 更早下推到文件发现阶段
- 优化器在远程存储上避免引入二次扫描
- 规划器考虑 late materialization 是否可用

这类需求非常可能进入下一轮 1.5.x 修复或 1.6 路线重点。

### 6.2 ADBC/Arrow 生态兼容性将继续加强
- Issue #21384  
  链接: duckdb/duckdb Issue #21384
- PR #21415  
  链接: duckdb/duckdb PR #21415

这说明 DuckDB 在嵌入式分析与 Arrow 生态中的定位越来越关键。  
**并发 statement 支持、流式结果生命周期管理、连接级多查询语义** 可能继续演化，并有机会成为后续版本接口稳定性的重点。

### 6.3 Parquet 复杂类型优化仍在扩展
- PR #21375  
  链接: duckdb/duckdb PR #21375

MAP 列 row group skipping 支持是很强的信号：DuckDB 不再只优化“标量列式数据”，而是在持续补强复杂 schema 的湖仓读取效率。  
这类改动很可能被纳入下一个小版本，因为收益明确、场景普遍。

### 6.4 安全与配置治理能力在推进
- PR #20938  
  链接: duckdb/duckdb PR #20938

`allowed_configs` 用于在 `lock_configurations` 下做 allow-list，是面向 **托管环境、受控执行环境、安全加固** 的增强项。  
虽然不是今天新提，但状态已到 Ready To Merge，进入近期版本的概率较高。

### 6.5 新扩展生态继续扩张
- PR #21406 - Add lance extension  
  链接: duckdb/duckdb PR #21406
- PR #21410 - [lance] Add for v1.4-andium  
  链接: duckdb/duckdb PR #21410

这表明 DuckDB 仍在积极扩展外部格式/生态连接能力，**Lance** 相关支持值得关注。

---

## 7. 用户反馈摘要

### 7.1 用户最在意的是“升级到 1.5 后是否还能保持原有性能/语义”
多个 issue 都带有鲜明的“1.4.4 正常，1.5.0 退化/报错”的对比：
- S3 请求暴涨：#21348  
- Hive filter 失效：#21347  
- ADBC 并发流读取失效：#21384  
- left join + null 过滤回归：#21407  
- UNION ALL + 聚合性能下降：#21302  

这说明社区当前对 1.5 的评价重点是：**新优化是否破坏了成熟工作负载**。

### 7.2 真实工作负载以云对象存储和数据湖读写为主
从 Parquet/S3/Hive partition/ETag 问题集中出现可见，DuckDB 用户越来越多运行在：
- S3 或兼容对象存储
- hive-style 分区数据湖
- 大量 Parquet 文件
- 延迟敏感、请求成本敏感环境

这类用户不只关注 SQL correctness，也关注 **HTTP 请求数、文件枚举数量、列裁剪是否有效**。

### 7.3 Python/数据框与嵌入式接口用户仍是关键群体
- PandasScan + window 优化失败：#21367  
  链接: duckdb/duckdb Issue #21367
- ADBC 并发问题：#21384  
  链接: duckdb/duckdb Issue #21384

说明 DuckDB 依旧深度嵌入 Python/Arrow 工作流，任何执行计划复制、流式接口生命周期变化，都会被这类用户迅速感知。

### 7.4 用户容忍优化失败，但不能接受静默语义变化和内部错误
像：
- Internal Error
- Corrupted ART index
- crash
- unexpected conversion behavior

这类反馈表明，当前用户对 DuckDB 的期待已经不再只是“快”，而是 **可预测、可恢复、可升级**。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或半长期积压项：

### 8.1 PR #18518 - Push Hive filtering into Glob()
- 链接: duckdb/duckdb PR #18518  
创建于 2025-08-06，至今仍处于 `needs maintainer approval`。  
鉴于今天 #21347 / #21348 再次暴露 Hive + S3 过滤与文件发现路径问题，这个 PR 的优先级应明显上升。建议重新评估是否拆分、精简或部分合入。

### 8.2 PR #20938 - Add allowed_configs option for allow-listing configs when setting lock_configurations
- 链接: duckdb/duckdb PR #20938  
处于 `Ready To Merge`，属于安全治理与配置控制增强。若维护者近期有企业/托管场景规划，这个 PR 具备较高落地价值。

### 8.3 PR #21171 - Make some MultiStatements and PRAGMAs Transactional
- 链接: duckdb/duckdb PR #21171  
该 PR 与 #21392 的 `COPY FROM DATABASE` 崩溃问题存在明显关联。建议提升处理优先级，因为这不仅是功能增强，也涉及数据库复制操作的稳定性。

### 8.4 Issue #20708 - timestamp conversion failed in WHERE but not SELECT
- 链接: duckdb/duckdb Issue #20708  
创建于 2026-01-28，仍未关闭。它影响 SQL 类型转换一致性，虽不如 crash 严重，但容易长期侵蚀用户信任。

### 8.5 Issue #21262 - SIGILL in sqlite sqllogictest on FreeBSD
- 链接: duckdb/duckdb Issue #21262  
平台问题往往容易被主线开发延后，但对下游发行版和打包生态影响较大，不宜长期悬置。

---

## 结论

今天的 DuckDB 项目动态呈现出典型的 **发布后修复窗口期** 特征：  
一方面，社区快速暴露了 1.5.0 在 **S3/Parquet、窗口优化、ADBC 流式接口、索引一致性** 方面的回归与边界问题；另一方面，贡献者已经提交了多条针对性 PR，修复节奏积极。  

从 OLAP 和分析型存储引擎视角看，当前最重要的观察点有三条：

1. **对象存储访问路径是否能恢复到 1.4.x 水平的高效过滤与低请求数**
2. **优化器重写是否能在复杂计划、远程存储、Pandas/子查询场景下保持正确性**
3. **流式执行与接口兼容性是否会成为 1.5.x 的重点稳定化主题**

整体判断：**项目健康度仍高，但短期稳定性工作量较大；若关键修复及时合入，DuckDB 有望较快收敛 1.5.0 回归带来的风险面。**

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报 · 2026-03-17

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持较高活跃度：Issues 更新 36 条、PR 更新 104 条，PR 活跃度明显高于 Issue，说明项目当前仍以持续修复、分支回合并与多版本维护为主。  
今日没有新版本发布，但从 PR 动向看，查询引擎、Lake/Compaction、Iceberg 连接器、Arrow Flight 文档与兼容性修正都在持续推进。  
Issues 侧则出现了较多“长期未活跃后批量关闭”的情况，说明维护团队在做一次积压清理；与此同时，仍有若干围绕外部连接器、MV 分区、MERGE INTO、元数据高可用的需求持续被用户关注。  
整体来看，项目健康度稳定：主线开发在推进，文档和多分支 backport 流程成熟，但也反映出部分功能请求与历史 Bug 仍存在响应滞后。

---

## 3. 项目进展

### 3.1 今日已关闭/完成的重点 PR

#### 1) 移除错误的 Arrow Flight 会话级代理配置文档
- PR: #70344 `[Doc] Remove Session Level Arrow Flight Proxy`  
- 链接: StarRocks/starrocks PR #70344

**进展解读：**  
该 PR 修正文档中关于 `SET arrow_flight_proxy_enabled = true` 的错误表述，明确该配置并不支持 session level 使用。这不是内核功能变更，但对 Arrow Flight SQL 用户非常重要，可减少接入误导和错误操作。  
同时该修正已触发多分支 backport：
- #70345  
- #70346  
- #70347  

这说明 Arrow Flight 相关能力在多个维护分支中都被视为需要统一口径的重点领域。

---

#### 2) macOS 可移植性修复：JSON 模块
- PR: #70336 `[BugFix] Fix JSON portability on macOS`  
- 链接: StarRocks/starrocks PR #70336

**进展解读：**  
该修复面向开发/构建环境兼容性，虽然 PR 类型勾选偏 Refactor，但实际意义在于降低 macOS 上 JSON 相关模块的构建或运行差异。  
对 StarRocks 这类以 Linux 生产环境为主、但大量开发者使用 macOS 的项目来说，这类改动能提升本地开发与 CI 一致性。

---

#### 3) macOS 可移植性修复：ORC 模块
- PR: #70335 `[BugFix] Fix macOS portability in ORC module`  
- 链接: StarRocks/starrocks PR #70335

**进展解读：**  
与 JSON 模块类似，该修复聚焦 ORC 相关模块的跨平台兼容性。  
这类改动对外部表/湖仓连接开发者价值更高，尤其是处理 ORC connector、读取链路、编译测试时。

---

#### 4) 文档清理与依赖文档修正已完成多分支回合并
- PR: #69823 `[Doc] Remove comments`  
- PR: #69887 `[Doc] fix Dependabot issues`  
- 回合并 PR: #69925 / #69927 / #69928 / #69929 / #69930  
- 链接:  
  - StarRocks/starrocks PR #69823  
  - StarRocks/starrocks PR #69887  

**进展解读：**  
这些 PR 主要是文档仓内容规范化、MDX 注释修正、Dependabot 相关文档问题处理，并已传播到 3.4 / 3.5 / 4.0 / 4.1 分支。  
虽然不是内核功能推进，但反映了 StarRocks 当前维护模式较成熟：主分支修正后会迅速同步到多个版本线，降低用户查阅不同文档版本时的歧义。

---

### 3.2 今日仍在推进中的重点 PR

#### 5) Lake 并行 Compaction：新增 range-split 模式
- PR: #70162 `[Enhancement] Add range-split parallel compaction for non-overlapping output`
- 链接: StarRocks/starrocks PR #70162

**核心价值：**  
该 PR 为 Lake 并行 Compaction 引入按 sort key range 切分的新子任务类型 `RANGE_SPLIT`，而不是按 segment index 切分。  
其目标是让各个子任务输出天然不重叠的 key range，从而产生 non-overlapping output rowset。

**影响分析：**
- 对存储层 compaction 效率和结果质量是实质性增强；
- 对高写入、排序键明确的表更有潜在收益；
- 与近期多个 compaction / rowset / delvec 相关问题形成呼应，说明存储整理路径仍是项目重点投入方向。

---

#### 6) 修复 Lake 表在 schema change 特定状态下自动分区创建失败
- PR: #70322 `[BugFix] Fix auto partition creation failure when schema change is in FINISHED_REWRITING`
- 链接: StarRocks/starrocks PR #70322

**核心价值：**  
针对 Lake table 在 schema change job 处于 `FINISHED_REWRITING` 时，auto partition creation 失败的问题进行修复。  
该问题本质上是 DDL 状态机和自动分区流程之间的冲突处理不当。

**意义：**
- 直接提升 Lake 表在线 schema 变更与自动分区协同的稳定性；
- 对依赖自动分区的流式写入/时序场景尤其关键；
- 属于“运维层面高频踩坑点”的修补。

---

#### 7) 修正 shared-data PK tablet 统计信息中的 data_size 估算
- PR: #70340 `[BugFix] Adjust tablet stat data_size by live rows`
- 链接: StarRocks/starrocks PR #70340

**核心价值：**  
针对 shared-data 主键表，`get_tablet_stats` 中的 `data_size` 估算改为考虑 rowset live-row ratio，使 delete vectors 在 compaction 前也能反映到统计值里。

**意义：**
- 改善 tablet 统计信息准确性；
- 有助于容量评估、调度判断和观测系统结果；
- 对 PK 表 + delvec + 湖存储场景是稳定性增强，而非单纯指标美化。

---

#### 8) 优化器修复：正确处理 WindowSkewHint
- PR: #70341 `[BugFix] Handle WindowSkewHint in OptExpressionDuplicator`
- 链接: StarRocks/starrocks PR #70341

**核心价值：**  
修复优化器在表达式复制/重写时没有正确改写 skew hint column 的问题。  
这是典型的“Hint 语义在 rewrite 阶段丢失或错位”的优化器 correctness 问题。

**意义：**
- 影响复杂窗口函数执行计划的正确性和性能稳定性；
- 说明优化器 Hint 生态在持续补强；
- 对有严重数据倾斜的分析任务用户更重要。

---

#### 9) Iceberg 连接器：支持 AND 复合谓词的部分下推
- PR: #70293 `[Enhancement] Support partial pushdown for AND compound predicates in Iceberg connector`
- 链接: StarRocks/starrocks PR #70293

**核心价值：**  
目前若 `AND(left, right)` 中只有一侧可转换为 Iceberg 表达式，整个 predicate 会被丢弃。该 PR 允许“部分可转换时仍下推可下推的一侧”。

**意义：**
- 直接改善 Iceberg connector 的谓词下推能力；
- 提升查询剪枝效率，尤其是混合表达式过滤场景；
- 属于连接器性能优化和 SQL 语义保守策略放宽的重要增强。

---

#### 10) Iceberg REST + SigV4：传递 `aws.s3.iam_role_arn`
- PR: #70343 `[Feature] Propagate aws.s3.iam_role_arn to REST catalog SigV4 signer`
- 链接: StarRocks/starrocks PR #70343

**核心价值：**  
修复/增强在 Iceberg REST Catalog 使用 SigV4 签名时，对 `aws.s3.iam_role_arn` 的透传支持。  
此前 REST HTTP signer 忽略该角色参数，可能导致请求使用基础实例角色签名，迫使用户重复配置。

**意义：**
- 提升云上 Iceberg/Glue REST 接入体验；
- 明显面向企业湖仓生产场景；
- 是外部目录与云身份治理融合的务实增强。

---

## 4. 社区热点

### 热点 1：Arrow Flight 对外可达地址能力需求
- Issue: #65359 `[type/feature-request, version:4.1] Add arrow_flight_advertise_host to support external Arrow Flight SQL clients`
- 链接: StarRocks/starrocks Issue #65359

**热度表现：**
- 评论 6
- 👍 7
- 且摘要中已关联 PR：`#66348`

**技术诉求分析：**  
用户在 Kubernetes/容器环境中使用 Arrow Flight SQL 时，服务当前可能向客户端通告内部 Pod/Cluster 地址，而不是外部可访问地址。  
这本质上是：
- 服务发现与网络出口地址管理问题；
- Arrow Flight 协议对“advertise host”配置的现实需求；
- StarRocks 在云原生部署场景中需要更好支持 north-south 流量接入。

**研判：**  
结合今日文档侧对 Arrow Flight 配置口径的统一，Arrow Flight 很可能仍是 4.1 线持续打磨的重点。

---

### 热点 2：排序能力改进仍有关注，但问题被 stale 关闭
- Issue: #62605 `[CLOSED] Sorting improvements`
- 链接: StarRocks/starrocks Issue #62605

**技术诉求分析：**  
该 Issue 聚焦排序实现现状与改进方向。虽然今日被 `X-stale` 关闭，但它反映了一个长期存在的核心诉求：  
- 排序算子性能；
- 排序内存使用；
- 增量排序/部分有序数据利用。  

这与另一个已关闭但有价值的需求 `#62559 Support Incremental Sort in StarRocks` 形成主题呼应，说明排序算子仍是潜在优化热点。

---

### 热点 3：希望用 SQL 数据库存储元数据
- Issue: #62005 `[OPEN] Use SQL database to store StarRocks meta.`
- 链接: StarRocks/starrocks Issue #62005

**热度表现：**
- 评论 5

**技术诉求分析：**  
该需求直指 FE 元数据当前主要依赖本地文件系统，在 Kubernetes 高可用部署下，元数据高可用和运维复杂度较高。  
这是一个非常“架构级”的反馈，反映出用户不仅关心查询性能，还关心：
- 控制面 HA；
- 云原生状态管理；
- 与数据库式元数据服务的对齐能力。

**研判：**  
这类需求短期内通常不会快速落地，但会持续影响未来云原生控制面架构设计。

---

### 热点 4：系统表 compaction 异常导致 rowset 激增
- Issue: #62202 `[CLOSED] 【compaction问题】loads_history表rowset不合并`
- 链接: StarRocks/starrocks Issue #62202

**技术诉求分析：**  
用户反馈 `_statistics_.loads_history` 表 rowset 不合并，最终影响 cumulative compaction，并出现 version > 1000 导致写入阻塞。  
尽管今日被 stale 关闭，但这个问题暴露了系统表自身也可能成为 compaction 压力源，且会外溢影响业务写入稳定性。

**研判：**  
结合 #70162、#70340 等 PR，可以看到存储层整理、统计与 rowset 生命周期管理仍在持续加强。

---

### 热点 5：ClickHouse AggregatingMergeTree 查询兼容
- Issue: #53950 `[OPEN] Support Query ClickHouse AggregatingMergeTree Engine Table.`
- 链接: StarRocks/starrocks Issue #53950

**技术诉求分析：**  
用户尝试把 StarRocks 作为统一查询引擎来查询 ClickHouse 物化聚合表，说明“StarRocks 作为联邦查询/统一语义层”的定位持续增强。  
该需求背后是：
- 跨系统查询；
- 对外部引擎特殊表类型的兼容；
- 作为统一查询入口的野心。

---

## 5. Bug 与稳定性

以下按潜在影响严重程度排序。

### P1：Primary Key 表 stream load 期间 `_apply_compaction_commit` 报错
- Issue: #62245 `[OPEN] Stream Load data to PRIMARY KEY table， _apply_compaction_commit error: set cached delvec failed`
- 链接: StarRocks/starrocks Issue #62245
- 是否已有 fix PR：**未见明确关联 PR**

**影响判断：**  
涉及 PK 表、stream load、apply compaction commit、delvec 缓存失败，属于可能影响持续写入和 compaction 正常推进的核心稳定性问题。  
如果复现范围广，可能直接影响主键模型在生产环境下的写入可靠性。

---

### P1：查询时报 “no queryable replica found”，根因是版本可读范围不一致
- Issue: #63026 `[OPEN] No queryable replica found due to version mismatch between minReadableVersion and visibleVersion`
- 链接: StarRocks/starrocks Issue #63026
- 是否已有 fix PR：**未见明确关联 PR**

**影响判断：**  
这是典型查询可用性问题。表面上副本是 NORMAL，但扫描阶段无法选出可读副本，会直接导致查询失败。  
若根因确为 `minReadableVersion` 与 `visibleVersion` 不一致，则说明 replica/version 管理链路存在边界条件漏洞。

---

### P1：Lake 表自动分区在 schema change 特定状态下失败
- Issue 对应修复: PR #70322
- 链接: StarRocks/starrocks PR #70322
- 是否已有 fix PR：**有**

**影响判断：**  
此问题会影响 DDL 与自动分区并发场景，是典型线上运维风险点。  
好消息是已有明确修复 PR 在推进。

---

### P2：shared-data PK tablet 统计值失真
- 对应修复: PR #70340
- 链接: StarRocks/starrocks PR #70340
- 是否已有 fix PR：**有**

**影响判断：**  
不一定直接导致查询错误，但会影响容量判断、表统计观察与运维决策，尤其是在 delvec 尚未 compaction 的阶段。  
属“观测面不准确进而影响治理”的问题。

---

### P2：优化器对 WindowSkewHint 改写不正确
- 对应修复: PR #70341
- 链接: StarRocks/starrocks PR #70341
- 是否已有 fix PR：**有**

**影响判断：**  
对启用了窗口倾斜 hint 的用户，可能造成执行计划与预期不一致，性能甚至正确性都可能受影响。  
覆盖面或许不如主路径问题广，但属于高阶用户真实会遇到的优化器缺陷。

---

### P2：Paimon 0.6 Append Table 无 bucket-key 无法读取
- Issue: #62999 `[OPEN] Starrocks 3.3 can't read Paimon0.6 Append Table without bucket-key`
- 链接: StarRocks/starrocks Issue #62999
- 是否已有 fix PR：**未见明确关联 PR**

**影响判断：**  
对使用 Paimon 外表的用户是兼容性阻断问题，会直接影响查询接入。  
外部格式兼容问题通常对采用湖仓架构的团队影响较大。

---

### P3：异步物化视图替换/alter 语法错误
- Issue: #62659 `[OPEN] 异步物化视图，替换语句语法有误，alter语句语法有误`
- 链接: StarRocks/starrocks Issue #62659
- 是否已有 fix PR：**未见明确关联 PR**

**影响判断：**  
主要影响 MV 管理语句使用体验与正确性，属于 SQL 语法/文档/实现一致性问题。

---

## 6. 功能请求与路线图信号

### 1) Arrow Flight 外部客户端支持
- Issue: #65359
- 链接: StarRocks/starrocks Issue #65359

**判断：较大概率进入后续版本完善范围**  
原因：
- 已有较多用户反馈与点赞；
- 问题聚焦云原生部署常见痛点；
- 已出现相关 PR 线索；
- 今日还有 Arrow Flight 文档修正，说明该方向正在被积极维护。

---

### 2) Iceberg MV 分区支持 bucket expression
- Issue: #69350 `Support Iceberg Bucket expression in MV Partition`
- 链接: StarRocks/starrocks Issue #69350

**判断：中高概率纳入连接器/MV 能力增强路线**  
原因：
- Iceberg 在 StarRocks 路线图中长期是重点生态；
- 今日也有 Iceberg connector 谓词下推、REST SigV4 相关 PR；
- 说明团队仍在持续补足 Iceberg 语义和接入能力。

---

### 3) MERGE INTO 增强
- Issue: #62881 `MERGE INTO`
- 链接: StarRocks/starrocks Issue #62881

**判断：中期重要需求，但实现复杂度高**  
用户希望具备更接近 Spark 的复杂 merge 语义，尤其针对 Iceberg 表的 `WHEN MATCHED / NOT MATCHED BY SOURCE / BY TARGET` 等能力。  
这是现代湖仓 SQL 兼容的重要方向，但通常涉及解析器、优化器、执行器与连接器写路径的协同，短期不一定快速落地。

---

### 4) 用 SQL 数据库存储元数据
- Issue: #62005
- 链接: StarRocks/starrocks Issue #62005

**判断：长期架构议题，短期落地概率低**  
这是控制面架构演进，不是单点特性。  
若 StarRocks 更深度拥抱 Kubernetes 控制平面，这类需求未来可能被纳入大版本架构讨论，但不太像短周期功能点。

---

### 5) TopN runtime filter pushdown
- Issue: #63030
- 链接: StarRocks/starrocks Issue #63030

**判断：有潜力，取决于优化器与存储层配合优先级**  
已有 join runtime filter、aggregate filter pushdown 作为前序能力，该需求属于自然延伸。  
若团队继续强化查询下推与存储层过滤协同，这会是较合理的后续增强点。

---

### 6) ClickHouse AggregatingMergeTree 支持
- Issue: #53950
- 链接: StarRocks/starrocks Issue #53950

**判断：有生态价值，但优先级可能低于 Iceberg/Paimon/Hive**  
该需求代表统一查询入口场景，但相对主流湖仓生态而言，维护优先级可能略低。

---

## 7. 用户反馈摘要

### 1) 云原生/Kubernetes 部署仍是核心场景
- 代表 Issue: #65359, #62005
- 链接:  
  - StarRocks/starrocks Issue #65359  
  - StarRocks/starrocks Issue #62005  

**反馈提炼：**
- 用户不只关心 SQL 和性能，更关心服务地址暴露、元数据高可用、集群状态持久化；
- StarRocks 在 K8s 下的“生产化便利性”仍有提升空间；
- Arrow Flight 和 Meta 存储都被用户拿来与其他现代系统进行对比。

---

### 2) 湖仓生态兼容性是持续重点
- 代表 Issue/PR: #69350, #62881, #62999, #70293, #70343
- 链接:
  - StarRocks/starrocks Issue #69350
  - StarRocks/starrocks Issue #62881
  - StarRocks/starrocks Issue #62999
  - StarRocks/starrocks PR #70293
  - StarRocks/starrocks PR #70343

**反馈提炼：**
- 用户希望 StarRocks 不只是自有存储分析库，也能作为 Iceberg/Paimon/REST Catalog 的统一查询和计算层；
- 连接器能力已从“能连上”进入“谓词可下推、认证能继承、分区语义能识别”的精细化阶段。

---

### 3) MV、Compaction、PK 表写入稳定性仍是生产痛点
- 代表 Issue/PR: #62202, #62245, #70322, #70340
- 链接:
  - StarRocks/starrocks Issue #62202
  - StarRocks/starrocks Issue #62245
  - StarRocks/starrocks PR #70322
  - StarRocks/starrocks PR #70340

**反馈提炼：**
- 系统表 compaction、主键表 delvec、自动分区与 schema change 之间的边界场景，仍可能影响生产稳定性；
- 用户对“持续写入 + 自动维护机制”的鲁棒性要求越来越高；
- 团队今日 PR 动向也表明这些反馈正在被逐步吸收。

---

### 4) SQL 兼容性诉求在从基础语法走向高级分析语义
- 代表 Issue: #62662, #62633, #62536, #62559
- 链接:
  - StarRocks/starrocks Issue #62662
  - StarRocks/starrocks Issue #62633
  - StarRocks/starrocks Issue #62536
  - StarRocks/starrocks Issue #62559

**反馈提炼：**
- 用户已经不满足于基础 OLAP 语法，而是期待更完整的 PostgreSQL/Spark/现代分析 SQL 体验；
- 包括 timestamp generate_series、window frame、数组上的窗口处理、incremental sort 等；
- 这些需求即便被 stale 关闭，也说明高级 SQL 能力是社区长期期待方向。

---

## 8. 待处理积压

以下是值得维护者持续关注的长期未充分推进事项。

### 1) SQL 元数据存储替代本地文件系统
- Issue: #62005
- 链接: StarRocks/starrocks Issue #62005

**原因：**  
这是云原生高可用的架构级需求，虽然短期难解，但对大规模 K8s 用户价值高，建议给出 roadmap 定位或设计讨论入口。

---

### 2) ClickHouse AggregatingMergeTree 查询支持
- Issue: #53950
- 链接: StarRocks/starrocks Issue #53950

**原因：**  
该需求体现 StarRocks 作为统一查询引擎的生态扩张方向，适合明确“接受/暂缓/不计划”的策略，避免长期悬而未决。

---

### 3) MERGE INTO 复杂语义
- Issue: #62881
- 链接: StarRocks/starrocks Issue #62881

**原因：**  
湖仓用户对 DML 语义增强预期较高，该 Issue 虽评论不多，但业务价值大，建议维护者明确能力边界与优先级。

---

### 4) TopN runtime filter pushdown
- Issue: #63030
- 链接: StarRocks/starrocks Issue #63030

**原因：**  
该需求与已有 runtime filter pushdown 演进方向一致，属于技术上连续性较强的增强项，值得纳入性能路线图评估。

---

### 5) Go 语言 SQL Parser / AST 能力诉求
- Issue: #63021
- 链接: StarRocks/starrocks Issue #63021

**原因：**  
虽然这更像生态使用咨询，但反映出用户希望将 StarRocks 语法用于外围治理系统、审计系统、SQL 校验工具。  
建议维护者提供明确的 parser 能力说明、复用建议或官方支持范围。

---

## 结论

今天的 StarRocks 没有新版本发布，但开发活动密度依然很高，重点集中在三条线上：  
1. **Lake/存储稳定性与 compaction 优化**；  
2. **Iceberg/Arrow Flight 等外部生态与连接器完善**；  
3. **文档与多版本分支维护的持续标准化**。  

从社区信号看，StarRocks 正逐步从“高性能 OLAP 数据库”向“云原生湖仓分析入口”延展；但与此同时，主键表写入稳定性、compaction 边界行为、MV 运维体验和高级 SQL 兼容能力，仍是用户最在意的真实生产问题。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-17）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 保持了较高活跃度：Issues 更新 14 条、PR 更新 50 条，说明核心开发、缺陷修复与新特性探索并行推进。  
从关闭量看，Issue 关闭 10 条、PR 合并/关闭 13 条，项目在持续清理积压问题，维护节奏健康。  
当天没有新版本发布，但多项与 **Spark 正确性、JDBC 资源管理、Kafka Connect、Snapshot Changes API** 相关的工作正在推进，反映出项目当前重心仍是稳定性增强与接口演进。  
同时，**二级索引元数据 POC、SnapshotChanges 流式接口/多快照支持** 等新议题出现，释放出中期路线图可能扩展分析能力与元数据访问模型的信号。

---

## 3. 项目进展

### 已合并/关闭的重要 PR

#### 1) 修复 Spark 聚合下推在 NaN 场景下的结果错误
- PR: [#15070](https://github.com/apache/iceberg/pull/15070)
- 对应 Issue: [#15069](https://github.com/apache/iceberg/issues/15069)

这是今天最重要的查询正确性修复之一。问题出在 Spark 聚合下推遇到包含 `NaN` 的列时会返回错误结果，属于典型的 **结果正确性缺陷**。修复方案依据 Iceberg spec 中对 `NaN` 排序语义的定义，调整聚合器对 `nanValueCount` 的处理逻辑，避免错误利用文件级统计信息。

**影响判断：**
- 直接提升 Spark 查询结果可信度；
- 影响聚合下推优化路径，属于“性能优化导致的正确性边界问题修复”；
- 对生产用户价值较高，尤其是科学计算、监控指标、半结构化数据中常见浮点异常值场景。

---

#### 2) 修复 JdbcCatalog / JdbcUtil 资源泄漏
- PR: [#15463](https://github.com/apache/iceberg/pull/15463)
- 对应 Issue: [#15462](https://github.com/apache/iceberg/issues/15462)

该修复用 try-with-resources 替换手工关闭方式，解决 `ResultSet` 与 `PreparedStatement` 未及时关闭导致的 JDBC 连接/游标泄漏。  
这类问题不一定立即表现为功能错误，但会在 catalog 元数据频繁访问、长生命周期服务中转化为 **连接池耗尽、数据库游标耗尽、Catalog 不稳定**。

**推进意义：**
- 增强 `JdbcCatalog` 的生产可用性；
- 降低元数据操作中的隐性资源风险；
- 对使用关系型数据库作为 Catalog backend 的部署尤为重要。

---

#### 3) 修复 RewriteTablePathUtil 对 delete manifests 的重写
- PR: [#15155](https://github.com/apache/iceberg/pull/15155)
- 对应 Issue: [#12772](https://github.com/apache/iceberg/issues/12772)

该 PR 已关闭相关问题，修复了在 `rewrite_table_path` 处理 MoR 表时未正确创建迁移所需 deleted files 的问题。  
这属于 **表迁移/路径重写工具链稳定性修复**，特别影响采用 Merge-on-Read 更新模式的用户。

**推进意义：**
- 提升表迁移工具在 delete manifests 上的正确性；
- 减少存储路径迁移中的数据一致性风险；
- 对湖仓重构、存储桶迁移、跨环境迁移场景很关键。

---

#### 4) 文档与站点构建修复
- PR: [#15657](https://github.com/apache/iceberg/pull/15657)

该 PR 为官网站点恢复 privacy plugin，以满足 GDPR 合规和构建流程要求。虽非内核功能，但体现了项目对官网可用性与合规性的持续维护。

---

#### 5) Spark 配置接口清理
- PR: [#15591](https://github.com/apache/iceberg/pull/15591)

废弃 `SparkReadConf/SparkWriteConf` 中未使用的 `branch` 构造参数，属于 API 清理与后续维护成本控制。  
这类变更虽小，但有利于减少误用与接口歧义。

---

## 4. 社区热点

### 热点 1：Kafka Connect 在 Glue 异常时丢消息
- Issue: [#13752](https://github.com/apache/iceberg/issues/13752)
- 状态：OPEN
- 评论：26

这是当前最活跃的 Issue。用户在 k8s 环境中运行 Kafka Connect Sink，将消息写入 Iceberg 表时，遇到疑似 Glue 相关异常，重启后出现消息丢失现象。

**背后技术诉求：**
- 用户希望连接器在外部 Catalog/Glue 异常时具备更强的幂等性与恢复语义；
- 诉求集中在 **故障恢复一致性、提交协议健壮性、错误可观测性**；
- 这说明 Kafka Connect Sink 正逐步进入更严格的生产场景，用户已不满足“能跑”，而是要求“故障后不丢数”。

---

### 热点 2：改进 Kafka Connect 协调者选举日志
- Issue: [#12610](https://github.com/apache/iceberg/issues/12610)
- 状态：OPEN
- 评论：6

用户指出 Kafka Connect Sink 在 `consumer.group.id` 与 connector 期望 group 配置不匹配时，协调者选举失败但日志不够明确，表现为“静默失败”。

**背后技术诉求：**
- 更好的可观测性和故障定位能力；
- 对连接器运维友好的日志与诊断输出；
- 这类问题常见于分布式 connector 组件，说明社区正从功能补齐转向运维体验优化。

---

### 热点 3：SnapshotChanges API 演进
- Issue: [#15659](https://github.com/apache/iceberg/issues/15659)
- Issue: [#15660](https://github.com/apache/iceberg/issues/15660)
- PR: [#15656](https://github.com/apache/iceberg/pull/15656)

同一天出现两个新的功能请求，并伴随一个大范围迁移 PR，表明 `SnapshotChanges` 正成为新的核心访问抽象。

**诉求分析：**
- `#15659` 希望提供 **流式接口**，避免一次性将所有 file changes 物化到内存；
- `#15660` 希望支持 **多快照批量计算变化**，以利于并行化和统一增量分析；
- `#15656` 已在推动调用方从旧的 Snapshot 文件访问方法迁移到 Snapshot Changes。

这说明项目正在把增量变化读取从“底层快照文件访问”升级为“更高层、可扩展的变化接口”，对 CDC、增量同步、审计分析、流批一体都具有潜在意义。

---

### 热点 4：二级索引元数据 POC
- PR: [#15658](https://github.com/apache/iceberg/pull/15658)
- 早期关闭 PR: [#15644](https://github.com/apache/iceberg/pull/15644)

`#15658` 引入 `IndexCatalog`、`IndexMetadata`、`IndexSnapshot`、`IndexVersion` 等一整套二级索引元数据对象，虽然还是 POC，但信号很强。

**背后技术诉求：**
- Iceberg 社区正在探索主表之外的索引元数据治理；
- 目标可能是为高选择性过滤、加速点查/范围查、索引生命周期管理提供标准化元数据层；
- 若继续推进，将是 Iceberg 从“表格式规范”向“分析加速元数据平台”迈出的重要一步。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Spark 聚合下推结果错误（查询正确性）
- Issue: [#15069](https://github.com/apache/iceberg/issues/15069)
- Fix PR: [#15070](https://github.com/apache/iceberg/pull/15070)
- 状态：已修复并关闭

**问题描述：** 含 `NaN` 值的列在 Spark 聚合下推时可能产生错误结果。  
**风险：** 查询结果不可信，属于高优先级正确性问题。  
**结论：** 已有修复，建议相关用户尽快关注后续 release/backport 情况。

---

### P1：Kafka Connect + Glue 异常导致消息丢失风险
- Issue: [#13752](https://github.com/apache/iceberg/issues/13752)
- 状态：OPEN
- Fix PR：暂无明确关联

**问题描述：** 在 Glue 异常和重启场景下，Kafka Connect Sink 出现 drop messages。  
**风险：** 数据摄取链路丢数，影响生产数据完整性。  
**结论：** 目前仍未关闭，值得维护者重点跟进。

---

### P2：JDBC 资源泄漏
- Issue: [#15462](https://github.com/apache/iceberg/issues/15462)
- Fix PR: [#15463](https://github.com/apache/iceberg/pull/15463)
- 状态：已关闭

**问题描述：** `JdbcCatalog` 与 `JdbcUtil` 存在 `ResultSet`、`PreparedStatement` 泄漏。  
**风险：** 长期运行后元数据服务不稳定、数据库资源耗尽。  
**结论：** 已修复，属于典型稳定性增强。

---

### P2：Avro + Row Lineage 在未投影列场景读取失败
- Issue: [#15507](https://github.com/apache/iceberg/issues/15507)
- 状态：已关闭
- Fix PR：数据中未直接列出

**问题描述：** Avro 文件含 row lineage 列时，若 reader schema 未投影这些列，读取失败。  
**风险：** 影响 V3/lineage 相关读取兼容性。  
**结论：** 已关闭，表明相关兼容性问题已被处理。

---

### P2：MoR 表 rewrite_table_path 迁移缺失 deleted files
- Issue: [#12772](https://github.com/apache/iceberg/issues/12772)
- Fix PR: [#15155](https://github.com/apache/iceberg/pull/15155)
- 状态：已关闭

**问题描述：** 对 MoR 表执行路径重写时，迁移所需 deleted files 未生成。  
**风险：** 迁移后 delete 语义不完整。  
**结论：** 已修复。

---

### P3：Spark ArrowAllocator 堆内存泄漏
- Issue: [#13937](https://github.com/apache/iceberg/issues/13937)
- 状态：CLOSED as stale

**问题描述：** `ArrowAllocation.rootAllocator()` 相关堆对象泄漏。  
**风险：** 读取路径内存膨胀，可能影响长任务稳定性。  
**备注：** 虽以 stale 关闭，但问题性质不轻，若仍可复现，建议重新打开并补充最小复现。

---

## 6. 功能请求与路线图信号

### 1) SnapshotChanges 流式接口
- Issue: [#15659](https://github.com/apache/iceberg/issues/15659)

这是非常明确的 API 演进请求：希望从 eager materialization 改为支持 `CloseableIterable` 风格的 streaming interface。  
**判断：较可能纳入后续版本。**  
理由是已有配套演进 PR [#15656](https://github.com/apache/iceberg/pull/15656) 在推动依赖方迁移到 Snapshot Changes 抽象，说明维护者正在做铺垫。

---

### 2) SnapshotChanges 支持多快照
- Issue: [#15660](https://github.com/apache/iceberg/issues/15660)

目标是支持跨多个 snapshot 统一计算变更，并可能更好地并行化。  
**判断：中高概率进入后续版本设计讨论。**  
这对增量读、审计回溯、同步工具和元数据扫描器都很有吸引力。

---

### 3) Kafka Connect 支持 VARIANT 类型转换
- PR: [#15283](https://github.com/apache/iceberg/pull/15283)

该 PR 为 RecordConverter 增加将 Java 对象、Map、List、primitive 递归转换为 Iceberg `Variant` 的能力。  
**判断：有望成为 Kafka Connect 方向的重要增强。**  
这与 Iceberg V3 类型生态扩展高度一致，能提升半结构化数据接入体验。

---

### 4) Flink Sink 可扩展性增强
- PR: [#15316](https://github.com/apache/iceberg/pull/15316)

该 PR 引入 `CommittableMetadata` 扩展框架，让下游可组合自定义元数据。  
**判断：是偏平台化能力建设的中期增强。**  
反映 Iceberg 正尝试把 Sink 设计成可被下游生态复用和组合的基础设施。

---

### 5) 二级索引元数据处理 POC
- PR: [#15658](https://github.com/apache/iceberg/pull/15658)

**判断：短期难直接发布，长期战略价值高。**  
作为 POC，它更像设计探路，但一旦落地，可能显著拓展 Iceberg 在高性能分析和数据加速层的边界。

---

### 6) Kafka Connect 可插拔 Committer
- PR: [#15207](https://github.com/apache/iceberg/pull/15207)

允许用户通过配置替换默认 `CommitterImpl`。  
**判断：如果社区对定制提交策略需求强，这类扩展点很可能被接受。**  
尤其对企业内部容错、事务协调、审计策略定制很有价值。

---

## 7. 用户反馈摘要

### 1) 用户越来越关注“故障时不丢数”
- 代表 Issue: [#13752](https://github.com/apache/iceberg/issues/13752)

Kafka Connect 用户的主要痛点已从“是否支持写入”转向“Catalog 异常、重启、协调抖动时是否还能保证一致性”。  
这说明 Iceberg 连接器已经进入生产深水区，用户对 exactly-once/at-least-once 边界、恢复协议和异常处理提出更高要求。

---

### 2) 运维可观测性仍是连接器短板
- 代表 Issue: [#12610](https://github.com/apache/iceberg/issues/12610)

用户反馈不是功能缺失，而是“失败时看不懂、定位慢”。  
这类反馈通常意味着连接器本身已具备一定能力，但诊断信息不足，制约了在复杂集群中的可用性。

---

### 3) 大规模元数据/快照变更访问需要更节省内存的接口
- 代表 Issues: [#15659](https://github.com/apache/iceberg/issues/15659), [#15660](https://github.com/apache/iceberg/issues/15660)

用户希望对 SnapshotChanges 做流式化、多快照化，说明当前接口在高快照数量、大表、增量分析场景下存在内存和易用性瓶颈。  
这类诉求通常来自高级用法用户，也说明 Iceberg 被用于更复杂的数据变更分析链路。

---

### 4) 文档仍需跟上 V3 能力扩展
- Issue: [#14874](https://github.com/apache/iceberg/issues/14874)

Schema 文档缺少 V3 Types（Geo、NanoTS、Variant 等）说明，虽已关闭，但反映出 **规范/实现演进快于文档同步**。  
对新用户和生态集成方来说，这会直接影响采用速度。

---

## 8. 待处理积压

以下项目建议维护者持续关注：

### 1) Kafka Connect 丢消息问题仍未解
- Issue: [#13752](https://github.com/apache/iceberg/issues/13752)

这是当前最值得优先处理的开放问题之一，评论最多、涉及生产数据完整性，且暂无明确 fix PR。

---

### 2) Kafka Connect 协调者选举日志改进
- Issue: [#12610](https://github.com/apache/iceberg/issues/12610)

问题不算“严重 bug”，但属于高性价比改进：实现成本可能不高，却能显著提升可运维性。

---

### 3) 多个 Kafka Connect 相关 PR 处于打开状态
- PR: [#15208](https://github.com/apache/iceberg/pull/15208)
- PR: [#15207](https://github.com/apache/iceberg/pull/15207)
- PR: [#15283](https://github.com/apache/iceberg/pull/15283)
- PR: [#14797](https://github.com/apache/iceberg/pull/14797)

这些 PR 涉及：
- rebalance/无分区分配时不失败；
- 可插拔 Committer；
- VARIANT 支持；
- Delta Writer / DV 模式。

**判断：** Kafka Connect 子系统当前是明显活跃且需求集中的方向，但也呈现出“PR 堆积较多、功能面扩张较快”的特征，建议维护者做优先级梳理，避免长期挂起影响贡献者积极性。

---

### 4) Flink Sink 可扩展性 PR 需进一步推进
- PR: [#15316](https://github.com/apache/iceberg/pull/15316)

这是偏架构性的增强，一旦拖延过久，可能导致下游用户继续采用私有 fork 或外部扩展实现。

---

### 5) 大型核心演进 PR 需要尽快收敛设计
- PR: [#15656](https://github.com/apache/iceberg/pull/15656)
- PR: [#15658](https://github.com/apache/iceberg/pull/15658)
- PR: [#15590](https://github.com/apache/iceberg/pull/15590)

分别涉及：
- SnapshotChanges 替代旧文件访问路径；
- 二级索引元数据 POC；
- `MergingSnapshotProducer` 自动 flush manifest。

这些 PR 都偏核心层，设计影响面大，若缺乏及时 review，容易形成新的积压热点。

---

## 总体健康度评估

**健康度：良好偏活跃。**  
Apache Iceberg 今日表现出典型的成熟开源基础设施项目特征：一方面持续修复正确性与稳定性问题，另一方面探索更高阶的元数据接口与连接器能力。  
短期看，**Spark 正确性修复、JDBC 稳定性增强、MoR 迁移修复** 是实质性进展；中期看，**SnapshotChanges、Kafka Connect、二级索引元数据** 可能成为接下来几个迭代周期的重要主题。  
需要警惕的是，Kafka Connect 方向的生产级问题和功能 PR 正在快速积累，若 review/合并节奏跟不上，可能成为后续维护压力点。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报 — 2026-03-17

## 1. 今日速览

过去 24 小时，Delta Lake 社区整体保持**中高活跃度**：Issues 更新 3 条、PR 更新 32 条，开发重心明显集中在 **Kernel / kernel-spark、Delta-Spark DSv2、流式读取稳定性、Unity Catalog/服务端规划能力** 等方向。  
从关闭/合并情况看，今天已经落地了一批**协议一致性修复、空指针稳定性修复、过滤下推与分区能力探索**相关工作，说明项目正持续补齐查询执行与元数据校验的边角问题。  
新增 Issue 数量不高，但新开问题都带有较明确的**协议语义澄清**与**catalog-managed table 元数据更新能力**诉求，体现出用户开始深入触达 Delta 协议和 DSv2/V1 行为边界。  
总体来看，项目健康度良好：**修复类工作在加速收敛，功能开发则聚焦在下一阶段的 Spark/Kernel 集成与服务端控制面能力增强**。

---

## 3. 项目进展

### 今日已合并/关闭的重要 PR

#### 1) 修复 Kernel 协议一致性：禁止带排序规则的 MapType Key
- PR: #6291 `Reject collated StringType keys in MapType constructor`  
  链接: delta-io/delta PR #6291
- 关联 Issue: #5881  
  链接: delta-io/delta Issue #5881

**进展解读：**  
该修复针对 Kernel 在 schema 构造层面对 `MapType` key 的校验缺失问题，明确拒绝使用带 collation 的 `StringType` 作为 key。这个改动本质上是在**向 Delta protocol 与 Spark 行为对齐**，避免 Kernel 产生 Spark 侧无法接受或语义不一致的 schema。  
这类修复对 OLAP/分析引擎尤其重要，因为 schema 不一致通常不会立刻报错，而会在**跨引擎读取、计划下推或类型比较**时演变成隐藏的数据正确性问题。

#### 2) 修复 FieldMetadata 空指针问题，增强元数据稳定性
- PR: #6289 `Fix NullPointerException in FieldMetadata.equals() and hashCode()`  
  链接: delta-io/delta PR #6289
- 另一个历史相关 PR: #5887 `[KERNEL][5821] Fix null pointer exception in FieldMetadata.equals`  
  链接: delta-io/delta PR #5887

**进展解读：**  
今日关闭的 NPE 修复表明维护者正在持续清理 Kernel 元数据对象上的基础稳定性问题。`equals()/hashCode()` 出错会影响缓存命中、schema 比较、元数据变更检测，进而影响**查询计划缓存、schema 演进判断以及测试稳定性**。  
虽然属于“小修复”，但对分析型存储引擎而言属于高价值稳定性工作。

#### 3) Spark/Kernel 查询优化能力继续推进：分区报告与过滤下推
- 已关闭 PR: #6224 `[Spark] Implement SupportsReportPartitioning in DSv2 SparkScan`  
  链接: delta-io/delta PR #6224
- 已关闭 PR: #6103 `[kernel-spark] [Spark] Add In filter pushdown to ExpressionUtils`  
  链接: delta-io/delta PR #6103

**进展解读：**  
这两项工作分别触达 **Spark DSv2 分区信息上报** 与 **`IN` 过滤条件下推**。  
- `SupportsReportPartitioning` 方向有助于 Spark 利用底层分区信息做**join/shuffle 消除、分区裁剪优化**；  
- `IN` filter pushdown 则直接改善谓词下推覆盖面，对典型 BI/交互式 OLAP 查询很关键。  

虽然今天状态显示为 closed，未明确是否最终 merge，但从节奏上看，项目正在围绕 **DSv2 scan 能力补齐** 做系统性推进。

#### 4) Iceberg/目录服务诊断能力增强
- 已关闭 PR: #6273 `Add warning logging in fetchCatalogPrefix exception handler`  
  链接: delta-io/delta PR #6273
- 已关闭 PR: #6253 `Fix potential NPE`  
  链接: delta-io/delta PR #6253

**进展解读：**  
这说明 Delta Lake 在与外部 catalog / Iceberg REST 生态交互时，开始更重视**可观测性与异常可诊断性**。对于企业用户来说，catalog 前缀解析、鉴权失败、元数据 fallback 等问题往往是生产接入中的主要摩擦点，增加 warning log 价值很高。

---

## 4. 社区热点

> 说明：给定数据中 PR 评论数显示为 `undefined`，无法严格按评论排序，因此以下按“技术影响面 + 今日更新热度”筛选。

### 热点 1：catalog-managed tables 的元数据更新限制是否应解除
- Issue: #6296 `[delta-spark] Remove metadata update blocker for catalog-managed tables`  
  链接: delta-io/delta Issue #6296

**技术诉求分析：**  
该 Issue 指向 Delta-Spark V1 中对 catalog-managed tables 的元数据修改（schema、properties、partitioning 等）存在阻断逻辑，根因是**commit API 开启后缺少原子元数据同步能力**。  
这实际上是一个很强的路线图信号：一旦底层 commit API 和 metadata sync 达到原子一致，Delta 很可能放开这部分限制，进一步提升 **托管表场景下的 DDL/元数据演进能力**。  
对使用 Unity Catalog 或企业 catalog 的用户来说，这会直接影响生产可用性和运维复杂度。

### 热点 2：初始快照阶段所有 data loss 场景的端到端验证
- PR: #6298 `[kernel-spark] E2E tests on all data loss scenarios during initial snapshot`  
  链接: delta-io/delta PR #6298

**技术诉求分析：**  
这是今天最值得关注的新 PR 之一。它聚焦于 **流式/增量读取在 initial snapshot 阶段的数据丢失场景覆盖**。  
对分析型存储引擎而言，初始快照 + 后续增量是 CDC、流批一体和连续消费的关键路径。这个 PR 表明团队正在加强**正确性优先**的测试护栏，而不仅仅是增加功能。

### 热点 3：DSv2 批量列式读取能力的自动判断
- PR: #6276 `[kernel-spark] Override columnarSupportMode in DSv2 SparkScan`  
  链接: delta-io/delta PR #6276

**技术诉求分析：**  
该 PR 试图按 schema 类型兼容性和 Spark 配置动态决定 `columnarSupportMode()`，目的是让 Spark Scan 在可行时走列式批量读，不可行时显式降级。  
背后反映的是用户对 **向量化读取性能** 与 **类型兼容性安全** 的双重要求：既希望快，也不能因复杂 schema 导致执行错误或隐性回退。

### 热点 4：流式读取中的资源泄漏修复
- PR: #6297 `[kernel-spark] Fix a potential resource leak in SparkMicroBatchStream`  
  链接: delta-io/delta PR #6297

**技术诉求分析：**  
该 PR 修复 `CommitActions`/迭代器在正常路径下未及时关闭的问题，属于典型的**长跑型流作业稳定性问题**。  
这类问题短期不一定暴露，但在高频 micro-batch 或大事务日志扫描场景下，会导致**句柄泄漏、内存压力、文件系统连接耗尽**等问题，技术价值很高。

### 热点 5：协议层语义澄清请求
- Issue: #6094 `Clarify valid range for add.modificationTime (can it be 0 or negative?)`  
  链接: delta-io/delta Issue #6094

**技术诉求分析：**  
这个问题虽然表面看是文档澄清，但实质是**协议兼容性与跨实现互操作**问题。  
用户已经观察到外部环境可能写入 `0/负数` 的 `add.modificationTime`，如果协议不明确，不同实现可能出现：
- 一端接受、一端拒绝；
- 一端归零、一端保留原值；
- 基于 modificationTime 的优化/排序逻辑出现歧义。  
这类“语义空白”如果不尽快澄清，长期会影响生态一致性。

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1：流式初始快照/增量阶段的数据丢失风险验证
- PR: #6298 `[kernel-spark] E2E tests on all data loss scenarios during initial snapshot`  
  链接: delta-io/delta PR #6298

**影响：**  
涉及流式消费、初始快照切换到增量日志读取的正确性，是典型高优先级问题。  
**当前状态：** 已有测试增强 PR，但从标题看仍是验证/补强阶段，不代表所有根因都已消除。  
**建议关注：** 如果你在生产中使用 Delta 流式读或 CDC 管道，应持续跟进该 PR。

### P1：SparkMicroBatchStream 潜在资源泄漏
- PR: #6297 `[kernel-spark] Fix a potential resource leak in SparkMicroBatchStream`  
  链接: delta-io/delta PR #6297

**影响：**  
可能导致文件句柄或底层迭代器资源未释放，属于**稳定性/可靠性问题**。  
**当前状态：** 已有 fix PR，尚待合并。  
**适用场景：** 长生命周期 streaming query、频繁 commit 扫描。

### P1：Kernel 接受非法 MapType key 导致协议不兼容
- Issue: #5881 `[bug, kernel] Disable creating MapType with collated key`  
  链接: delta-io/delta Issue #5881  
- Fix PR: #6291  
  链接: delta-io/delta PR #6291

**影响：**  
可能写出与 Spark / Delta protocol 语义不一致的 schema，属于**跨引擎兼容性与正确性问题**。  
**当前状态：** Issue 已关闭，已有明确修复。

### P2：FieldMetadata.equals/hashCode 空指针
- PR: #6289 `Fix NullPointerException in FieldMetadata.equals() and hashCode()`  
  链接: delta-io/delta PR #6289

**影响：**  
主要影响元数据比较、集合操作、测试与运行时稳定性。  
**当前状态：** 已关闭，修复已完成。

### P2：协议文档未明确 modificationTime 合法范围
- Issue: #6094 `Clarify valid range for add.modificationTime (can it be 0 or negative?)`  
  链接: delta-io/delta Issue #6094

**影响：**  
当前更偏“规范不清”而非单点崩溃，但长期会演化为**跨实现兼容缺陷**。  
**当前状态：** 尚无对应 fix PR 出现在今日数据中。

---

## 6. 功能请求与路线图信号

### 1) catalog-managed table 元数据更新能力可能进入下一阶段
- Issue: #6296  
  链接: delta-io/delta Issue #6296
- 相关 PR: #6166 `[Delta-Spark] Extend stagingCatalog for non-Spark session catalog`  
  链接: delta-io/delta PR #6166
- 相关 PR: #6233 `[Delta][CI] Add temporary UC-main test setup`  
  链接: delta-io/delta PR #6233

**判断：**  
这是今天最明确的路线图信号之一。Issue 已直接指出“当前阻断逻辑应在 commit API 原子 metadata sync 可用后去除”，而相关 PR 又在推进 stagingCatalog、UC 测试体系建设。  
**推断：** 下一版本或后续几个迭代中，Delta-Spark 对 **catalog-managed table 的 schema/properties/partitioning 变更** 支持有较大概率增强。

### 2) DSv2 写路径探索加速，Kernel 与 Spark 分工边界正在调整
- PR: #6275 `[Quick POC][Experimental Branch ONLY] Option B: Spark Parquet writer with Kernel commit`  
  链接: delta-io/delta PR #6275

**判断：**  
这是典型的架构探索信号：让 Spark 直接负责 Parquet 写出，Kernel 只负责事务提交。  
**潜在收益：**
- 避免 `InternalRow -> Kernel Row` 转换开销；
- 更好复用 Spark 原生 writer；
- 降低 DSv2 写路径复杂度。  
虽然标题明确标注为实验性分支，但很可能影响后续正式实现方向。

### 3) 流式 CDC / ignoreChanges / v2 迁移在稳步推进
- PR: #6076 `[kernel-spark] Add incremental CDC support to SparkMicroBatchStream`  
  链接: delta-io/delta PR #6076
- PR: #6249 `[kernel-spark] Support ignoreChanges read option in dsv2`  
  链接: delta-io/delta PR #6249
- PR: #6294 `[kernel-spark] Migrate DeltaSourceDeletionVectorsSuite to v2`  
  链接: delta-io/delta PR #6294

**判断：**  
这些 PR 共同表明 kernel-spark 正在向 **DSv2 + 流式 + CDC + deletion vectors** 的统一能力模型收敛。  
**推断：** 后续版本很可能加强：
- 增量 CDC 读取；
- `ignoreChanges` 等兼容选项；
- deletion vectors 在 v2 路径下的正确性验证。

### 4) 服务端规划（ServerSidePlanning）与 OAuth 集成进入实作阶段
- PR: #6292 `[ServerSidePlanning] Add OAuth + credential refresh support`  
  链接: delta-io/delta PR #6292
- PR: #6295 `[ServerSidePlanning] Add e2e OAuth test with mock token server`  
  链接: delta-io/delta PR #6295

**判断：**  
这说明 Delta 正在增强与远端 catalog / planning service 的**企业级鉴权能力**。  
对接入 Unity Catalog、Iceberg REST 风格服务或统一控制面的用户，这是很关键的能力建设，尤其是 token refresh 与 e2e mock 测试意味着实现已不再停留在概念阶段。

---

## 7. 用户反馈摘要

### 1) 用户对“协议字段语义不清”非常敏感
- Issue: #6094  
  链接: delta-io/delta Issue #6094

**痛点提炼：**  
用户已在真实环境中遇到 `add.modificationTime` 为 0 或负值的情况，说明 Delta 协议被不同写入方或运行环境以不同方式实现。  
这类反馈代表用户并非只使用单一官方栈，而是在**多组件、多执行引擎、历史遗留数据**环境中使用 Delta，因此对协议边界的准确文档有强需求。

### 2) 企业托管 catalog 场景下，元数据 DDL 限制正在成为实际阻碍
- Issue: #6296  
  链接: delta-io/delta Issue #6296

**痛点提炼：**  
用户不满足于“能读写表”，而是要求在 catalog-managed 表上完成完整元数据生命周期管理，包括 schema、properties、partitioning 变更。  
这表明 Delta 的企业级用户越来越多地运行在 **统一 catalog / 托管元数据平台** 上，而不是传统文件路径直连模式。

### 3) 用户对流式读取正确性与资源稳定性要求提升
- PR: #6297  
  链接: delta-io/delta PR #6297
- PR: #6298  
  链接: delta-io/delta PR #6298

**痛点提炼：**  
近期工作集中在 micro-batch stream、initial snapshot、CDC 等路径，说明真实用户场景已经深入到**长期运行的流处理任务**。  
相比单次批处理，用户更关注：
- 会不会漏数据；
- 会不会重复数据；
- 会不会长期运行后泄漏资源。  

---

## 8. 待处理积压

以下项目建议维护者重点关注：

### 1) 协议澄清类问题仍缺少明确结论
- Issue: #6094 `Clarify valid range for add.modificationTime (can it be 0 or negative?)`  
  链接: delta-io/delta Issue #6094

**原因：**  
创建于 2026-02-20，已讨论但尚未关闭。协议语义问题越晚澄清，越容易形成多实现分叉。  
**建议：** 尽快在 `PROTOCOL.md` 中给出合法范围、非法值处理方式、兼容策略。

### 2) UC Commit Metrics 仍处于骨架接线阶段
- PR: #6155 `[UC Commit Metrics] Add skeleton transport wiring and smoke tests`  
  链接: delta-io/delta PR #6155

**原因：**  
创建于 2026-02-27，仍处于开放状态。  
**建议：** 如果该方向目标是增强提交链路观测性，应明确后续里程碑：指标模型、传输协议、采样策略、回归基线。

### 3) 流式 CDC 支持仍在长链条推进
- PR: #6076 `[kernel-spark] Add incremental CDC support to SparkMicroBatchStream`  
  链接: delta-io/delta PR #6076

**原因：**  
创建于 2026-02-19，仍未收敛。CDC 是高价值功能，但也是高复杂度路径。  
**建议：** 尽快补齐与 `ignoreChanges`、initial snapshot、deletion vectors 的交互测试矩阵。

### 4) stagingCatalog / UC 测试链条较长，可能拖慢 catalog-managed 功能落地
- PR: #6166 `[Delta-Spark] Extend stagingCatalog for non-Spark session catalog`  
  链接: delta-io/delta PR #6166
- PR: #6233 `[Delta][CI] Add temporary UC-main test setup`  
  链接: delta-io/delta PR #6233

**原因：**  
这些 PR 与 #6296 的需求高度相关，但仍在开放状态。  
**建议：** 将 catalog-managed table 元数据更新放开前置依赖梳理清楚，避免功能需求继续积压。

---

## 附：日报结论

今天的 Delta Lake 进展可以概括为两条主线：

1. **稳定性与协议一致性持续补课**：MapType key 校验、FieldMetadata NPE、流式资源管理与日志可观测性等问题被快速处理，项目基础质量在上升。  
2. **面向下一阶段的能力铺路**：DSv2、kernel-spark、CDC、服务端规划、OAuth、UC/catalog-managed table 支持等方向同步推进，显示项目正在从“文件格式 + Spark 扩展”进一步走向“多控制面、多执行路径、企业级治理能力”的演进。

如果你关注 OLAP 查询性能，建议重点跟踪 **#6276、#6224、#6103**；  
如果你关注流式正确性，重点看 **#6297、#6298、#6076、#6249**；  
如果你关注企业 catalog / 托管表能力，重点跟踪 **#6296、#6166、#6233、#6292、#6295**。

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox 项目动态日报 - 2026-03-17

## 1. 今日速览

过去 24 小时内，Velox 保持了较高开发活跃度：**Issues 更新 5 条，PR 更新 50 条**，其中 **45 条 PR 仍在推进中，5 条已合并/关闭**。整体来看，今日工作重心集中在 **执行引擎能力扩展、构建/CI 优化、Hive/Iceberg/cuDF 生态增强，以及若干正确性与稳定性修复**。  
从信号上看，项目目前处于**高频演进期**：一方面有较多基础设施与架构性改造（RPC、Hive index reader、FBThrift 替换），另一方面也持续暴露出 **Spark 兼容性、Parquet 旧版本兼容、GPU/cuDF 边界场景** 等典型 OLAP 引擎集成问题。  
健康度方面，主线开发活跃，但**待合并 PR 数量较大（45）**，说明维护者吞吐压力仍高；同时，构建失败与 fuzzing 失败问题继续出现，提示 CI 稳定性仍需投入。  

---

## 2. 项目进展

### 今日已合并 / 关闭的重要 PR

#### 2.1 UnnestNode 增加输出拆分开关，提升执行行为可控性
- **PR**: #16762  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #16762

该 PR 为 `UnnestNode` 增加了**是否拆分输出 batch** 的可配置选项，使计划层可以决定：  
- 是按 `outputBatchRows()` 进行切分，  
- 还是保证每个输入 batch 对应单个输出 batch。  

**意义分析：**
- 对查询引擎来说，这属于典型的**执行器语义与性能折中控制项**。  
- 在处理大数组、复杂嵌套类型或高膨胀 `UNNEST` 场景时，拆分策略会直接影响：
  - operator 内存峰值，
  - 下游算子 batch 粒度，
  - pipeline 调度公平性，
  - 以及与上层系统的语义对齐。  
- 这类改动通常会提升 Presto/Trino/Spark-on-Velox 场景下的可调优空间。

---

#### 2.2 Claude 工作流增强，提升自动化审查可用性
- **PR**: #16798  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #16798

为 `claude.yml` 增加 `additional_context` 与 `dry_run` 参数，用于改进自动审查工作流。  

**意义分析：**
- 虽不直接影响查询引擎功能，但有助于**提高代码审查效率**与 CI 自动化灵活性。  
- 对目前 PR 高积压状态来说，这类工具链增强具有现实价值，可能帮助维护者提升吞吐。  

---

### 今日值得关注的进行中 PR

#### 2.3 新聚合函数 `vector_sum`
- **PR**: #16498  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16498

引入 `vector_sum` 聚合函数，用于对数组列做**按元素求和**。  

**潜在价值：**
- 这是一个非常典型的**分析型函数增强**，可直接服务 embedding、特征向量、指标数组聚合等场景。  
- 与通过 `UNNEST + GROUP BY` 的传统写法相比，可能显著改善：
  - SQL 易用性，
  - 中间数据膨胀，
  - 执行效率。  

这类函数如果成熟，较可能成为下一阶段面向分析 workload 的亮点能力。

---

#### 2.4 Hive 可插拔索引读取器支持
- **PR**: #16803  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16803

该 PR 重构 `HiveIndexSource`，支持**可插拔 index reader**，将格式相关 I/O 与格式无关逻辑解耦。  

**技术意义：**
- 这是典型的**存储层抽象能力增强**。  
- 有利于未来扩展不同格式、不同索引实现的读取逻辑。  
- 对 Hive connector 的长期演进很关键，意味着 Velox 正在加强其**面向多格式索引读取的架构弹性**。

---

#### 2.5 Iceberg connector 增加 positional update 支持
- **PR**: #16761  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16761

为 Velox Iceberg connector 增加 **merge-on-read positional update** 支持。  

**技术意义：**
- Iceberg 的更新/删除语义是现代湖仓引擎兼容性的核心之一。  
- 该 PR 表明 Velox 正进一步补齐对 **Iceberg MoR（Merge-on-Read）** 的支持能力。  
- 一旦合入，将直接增强 Velox 在湖仓查询引擎中的连接器竞争力。

---

#### 2.6 RPC 执行框架持续推进
- **PR**: #16787, #16793, #16598  
- **状态**: Open  
- **链接**:  
  - facebookincubator/velox PR #16787  
  - facebookincubator/velox PR #16793  
  - facebookincubator/velox PR #16598  

RPC 方向今天继续推进，涉及：
- `RPCOperator` / `RPCState` / `RPCRateLimiter` / `RPCPlanNodeTranslator`
- sidecar discovery 的 function stubs
- remote function execution async 化

**技术意义：**
- 这不是零散功能，而是**远程函数执行体系化建设**。  
- 对 Velox 来说，这可能是未来支持：
  - 远程 UDF，
  - sidecar 计算服务，
  - 跨进程/跨节点函数调用，
  - 函数治理与限流  
  的关键基础。  
- 这是明显的**路线图信号**，值得持续跟踪。

---

## 3. 社区热点

> 说明：提供的数据中 PR 评论数未给出具体值，因此以下“热点”主要依据更新频率、功能重要性和 issue 评论量判断。

### 3.1 Spark Aggregate Fuzzer 持续失败
- **Issue**: #16327  
- **链接**: facebookincubator/velox Issue #16327

这是今日最值得关注的活跃问题之一，涉及 **Spark 与 Velox 聚合行为不一致**，并且由 fuzzer 持续触发，当前定位到 `ARRAY<TIMESTAMPS>` 场景。  

**背后技术诉求：**
- 用户需要 Velox 在 Spark 兼容层面具备**严格结果一致性**。  
- fuzzing 持续失败说明该问题不是偶发 crash，而是**语义正确性缺陷**。  
- 对接 Gluten/Spark 的用户尤其敏感，因为这类差异会直接影响生产查询结果可信度。  

---

### 3.2 Parquet 1.8.1 min/max 排序错误导致谓词裁剪误判
- **Issue**: #16743  
- **链接**: facebookincubator/velox Issue #16743

该问题指向旧版 Parquet 文件中字符串列 `min/max` 按 signed 顺序计算，与新版实现不一致，进而导致过滤查询返回空结果。  

**背后技术诉求：**
- 用户期待 Velox 在读取历史数据时具备**更强的向后兼容性**。  
- 这类问题本质上不只是格式解析，而是**统计信息可信度与谓词下推正确性**问题。  
- 如果处理不当，可能出现 silent wrong result，比单纯报错更严重。  

---

### 3.3 cuDF 集成继续扩展，但边界问题暴露
- **Issue**: #16786  
- **PR**: #16444, #16535, #15700  
- **链接**:  
  - facebookincubator/velox Issue #16786  
  - facebookincubator/velox PR #16444  
  - facebookincubator/velox PR #16535  
  - facebookincubator/velox PR #15700  

一方面，cuDF 方向有多条 PR 推进：
- 提前校验执行计划是否可在 cuDF 上运行，
- 对外暴露 `CudfConfig`,
- 推进 CI 测试。

另一方面，新 issue 暴露了 `emptyStruct` / 嵌套 struct 元数据处理错误。  

**背后技术诉求：**
- 社区希望 GPU 加速路径不仅“能跑”，还要具备**复杂嵌套类型的可用性与稳定性**。  
- 当前信号表明 cuDF 集成仍处于**能力扩展与边界补洞并行**阶段。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1. 查询正确性：Parquet 1.8.1 统计信息顺序错误导致结果为空
- **Issue**: #16743  
- **状态**: Open  
- **标签**: `bug`, `triage`  
- **链接**: facebookincubator/velox Issue #16743  
- **是否已有 fix PR**: 暂未看到直接关联 fix PR

**影响：**
- 这是典型的 **wrong result** 问题。  
- 谓词下推/数据跳过依赖 min/max 统计，一旦顺序理解错误，可能直接漏读数据。  
- 对 OLAP 系统而言，这类 silent data omission 风险高于普通 crash。  

---

### P1. Spark 聚合 fuzzing 持续失败，涉及 ARRAY<TIMESTAMPS> 一致性
- **Issue**: #16327  
- **状态**: Open  
- **标签**: `bug`, `fuzzer-found`  
- **链接**: facebookincubator/velox Issue #16327  
- **是否已有 fix PR**: 暂未看到直接关联 fix PR

**影响：**
- 关系到 Spark 兼容性与结果一致性。  
- fuzzing 已多次命中，意味着该问题具备**可复现性与系统性**。  
- 若聚合语义偏差存在于更多复杂类型上，可能影响 Gluten/Velox 的可信度。  

---

### P1. DWRF 写路径潜在悬垂指针问题
- **PR**: #16800  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16800

修复 `FlatMapColumnWriter` 中 `StringView` 作为 key 存入 `F14NodeMap` 后可能悬垂的问题。  

**影响：**
- 涉及**写路径内存安全**。  
- 描述中提到在输入 batch 释放后，rehash 可能基于已释放内存重新计算哈希，这属于高风险 bug。  
- 若属实，可能表现为随机 crash、数据损坏或难复现问题。  

**备注：**
- 虽然这是 PR 而非 issue，但从风险角度属于今天最重要的稳定性修复之一，建议优先审阅。

---

### P2. 构建失败：undefined reference 到 `registerArraySplitIntoChunksFunctions`
- **Issue**: #16785  
- **状态**: Open  
- **标签**: `build`, `triage`  
- **链接**: facebookincubator/velox Issue #16785  
- **是否已有 fix PR**: 暂未看到直接 fix PR

**影响：**
- 直接影响 CI 与开发者编译体验。  
- 此类链接错误通常意味着：
  - 源文件未纳入构建，
  - 目标链接关系缺失，
  - 或 API 重构后符号未同步。  

如果不尽快修复，会阻塞后续开发者集成与验证。

---

### P2. cuDF -> Velox 转换在 emptyStruct / 嵌套 struct 场景失败
- **Issue**: #16786  
- **状态**: Open  
- **标签**: `bug`, `triage`  
- **链接**: facebookincubator/velox Issue #16786  
- **是否已有 fix PR**: 未见直接 fix PR；但相关 cuDF 能力增强 PR 活跃

**影响：**
- 限制 GPU 加速链路对复杂 schema 的支持。  
- 对使用半结构化/嵌套数据的用户是明显阻碍。  

---

### P3. decimal cast 到 float 精度丢失问题已关闭
- **Issue**: #16586  
- **状态**: Closed  
- **链接**: facebookincubator/velox Issue #16586

该问题描述 `sum(decimal(18,4)) cast to float` 精度误差，导致与 Spark 结果不同。今日已关闭，说明相关问题可能已通过其他提交修复或确认处理。  

**意义：**
- 这是对**数值语义兼容性**的积极信号。  
- decimal/float 转换历来是 SQL 引擎一致性高风险点，关闭该 issue 有助于提升 Spark/Gluten 用户信心。

---

## 5. 功能请求与路线图信号

### 5.1 `vector_sum` 很可能进入后续版本候选
- **PR**: #16498  
- **链接**: facebookincubator/velox PR #16498

这是明确的新功能请求落地形态。其针对数组元素级聚合的需求十分贴近现代分析业务，属于**高实用性 SQL 扩展**。若评审顺利，较可能被纳入下一阶段版本。

---

### 5.2 RPC/远程函数执行正在形成完整路线
- **PRs**: #16598, #16787, #16793  
- **链接**:  
  - facebookincubator/velox PR #16598  
  - facebookincubator/velox PR #16787  
  - facebookincubator/velox PR #16793  

从异步远程函数执行，到 operator/state/rate limiter，再到 sidecar discovery stub，这一组 PR 明显不是孤立改动，而是成体系设计。  

**判断：**
- 极有可能是 Velox 下一阶段的重要方向之一。  
- 未来可能衍生出：
  - 外部 UDF 服务化，
  - coordinator 级函数发现，
  - RPC 资源治理。  

---

### 5.3 湖仓格式与连接器能力持续增强
- **PRs**: #16761, #16803  
- **链接**:  
  - facebookincubator/velox PR #16761  
  - facebookincubator/velox PR #16803  

Iceberg positional update 与 Hive pluggable index reader 都释放出明显信号：  
Velox 正继续向**更完善的湖仓读取/更新语义支持**推进，而不是停留在基础 scan/expression 执行层。

---

### 5.4 cuDF 生态仍在建设期
- **PRs**: #16444, #16535, #15700  
- **Issue**: #16786  
- **链接**:  
  - facebookincubator/velox PR #16444  
  - facebookincubator/velox PR #16535  
  - facebookincubator/velox PR #15700  
  - facebookincubator/velox Issue #16786  

虽然用户侧有复杂类型问题，但从计划检查器、配置模块拆分、CI 测试补齐三方面看，cuDF 方向仍在稳步推进。  
这意味着 GPU 路线并未降温，反而在逐步工程化。

---

## 6. 用户反馈摘要

基于今日 issue 摘要，可提炼出以下真实用户痛点：

### 6.1 用户最关心“结果对不对”，尤其是 Spark 兼容
- **相关链接**: facebookincubator/velox Issue #16327, facebookincubator/velox Issue #16586

用户反馈集中在：
- Spark 与 Velox 聚合语义不一致，
- decimal 到 float 转换精度偏差。  

**说明：**
- 对接 Spark/Gluten 的用户，把 Velox 视为生产执行引擎而非实验组件。  
- 他们对性能有要求，但对**结果一致性**要求更高。  

---

### 6.2 历史数据兼容性是实际落地障碍
- **相关链接**: facebookincubator/velox Issue #16743

Parquet 1.8.1 问题反映的不是单点 bug，而是现实中的“数据湖遗留文件兼容性”问题。  
用户场景常常不是全新数据，而是多版本、多工具链长期积累下来的混合数据资产。

---

### 6.3 GPU/嵌套类型支持仍有落差
- **相关链接**: facebookincubator/velox Issue #16786

用户在 cuDF 场景下已不仅处理简单标量，而是深入到 `struct<struct<...>>` 等复杂模式。  
这说明：
- 用户对 GPU 路径有真实需求；
- 但当前对复杂 schema 的支持还不足够稳健。  

---

### 6.4 开发者也在受 CI/构建效率困扰
- **相关链接**: facebookincubator/velox Issue #16785, facebookincubator/velox PR #16797, facebookincubator/velox PR #16767

构建失败 issue 与两条专门优化 fuzzer/CI 的 PR 同时出现，表明开发社区对以下问题感知明显：
- 构建链路成本高，
- fuzz job 太慢，
- artifact 上传下载低效。  

这类问题虽不直接影响终端查询用户，但会显著影响项目迭代速度。

---

## 7. 待处理积压

以下条目建议维护者重点关注：

### 7.1 FBThrift 替换 Apache Thrift 的大型构建改造仍未落地
- **PR**: #16019  
- **创建时间**: 2026-01-14  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16019

这是较早开启且影响面广的 PR，涉及 Parquet 等依赖链。  
**风险点**：
- 长期悬而未决会增加后续 rebase 成本；
- 依赖替换类 PR 往往越拖越难合。  

建议维护者明确 blocker，尽快收敛评审结论。

---

### 7.2 cuDF 测试纳入 CI 的 PR 持续久拖
- **PR**: #15700  
- **创建时间**: 2025-12-04  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #15700

该 PR 对 cuDF 工程化非常关键。没有稳定 CI，GPU 路线的问题就更难及时暴露。  
考虑到今天又新增了 cuDF 嵌套类型 bug，这个 PR 的优先级应提升。

---

### 7.3 异步远程函数执行主 PR 已开放半月以上，需尽快定方向
- **PR**: #16598  
- **创建时间**: 2026-03-02  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16598

该 PR 及其后续分拆 PR 构成较大特性族。  
如果核心设计不能尽快定稿，后续子 PR 容易出现接口漂移与重复工作。

---

### 7.4 Spark fuzzing 正确性问题需尽快从“发现”推进到“定位”
- **Issue**: #16327  
- **创建时间**: 2026-02-10  
- **状态**: Open  
- **链接**: facebookincubator/velox Issue #16327

该问题已存在一个多月，并持续活跃。  
对于与 Spark 对齐的用户群体，这是高优先级阻塞项，建议补充：
- 最小复现 SQL，
- 具体聚合函数定位，
- Spark 与 Velox 中间态对比。  

---

## 8. 总结判断

今天的 Velox 呈现出典型的**“高速开发 + 稳定性补强并行”**状态：  
- 功能上，RPC、Iceberg、Hive、cuDF、新聚合函数等多个方向同时推进，显示出较强的架构演进能力。  
- 风险上，Spark 正确性、Parquet 老版本兼容、DWRF 内存安全、构建失败等问题提醒我们，项目仍处于高变化带来的不稳定窗口。  
- 从版本前瞻看，**远程函数执行体系、湖仓连接器增强、数组分析函数扩展、GPU 工程化**，很可能是下一阶段最值得关注的主线。

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的短版晨报**，或  
2. **更详细的“维护者视角风险清单版”**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-17）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：Issues 更新 6 条、PR 更新 22 条，开发重心仍明显集中在 **Velox 后端、Spark SQL 兼容性、Shuffle/Scan 优化** 以及 **工程基础设施稳定性**。  
从变更结构看，关闭/合并项达到 10 条，说明项目不仅有新增讨论，也在持续消化存量工作，整体推进节奏健康。  
当天没有新版本发布，但围绕 **TIMESTAMP_NTZ、动态过滤下推、Variant 测试启用、Iceberg 元数据与文件信息函数修复** 的多条 PR/Issue，释放出下一阶段将继续强化 **SQL 类型兼容、湖仓支持与执行性能** 的信号。  
同时，社区也出现了较明确的性能负反馈：在简单 `SELECT ... LIMIT ...` 场景下，用户报告 Gluten 相比原生 Spark 慢 10 倍以上，提示项目仍需继续优化轻量查询路径。  

---

## 3. 项目进展

以下为今日值得关注的已关闭/推进中的关键 PR，按“对执行引擎能力、存储/IO 优化、兼容性修复”的影响整理。

### 3.1 查询执行与资源管理

- **#11754 [CLOSED] [VELOX] Close ColumnarBatch in ColumnarCollectLimitExec for skipped batches**  
  链接: apache/gluten PR #11754  
  该修复解决了 `ColumnarCollectLimitExec` 在处理 offset/limit 时，对“被跳过的 batch”未及时释放 `ColumnarBatch` 的问题。  
  这属于典型的 **内存泄漏修复**，虽然改动点小，但对长时间运行或大量小批次查询尤其重要，可降低 executor 内存压力和潜在 OOM 风险。  

- **#11770 [CLOSED] [VELOX] Simplify the flatten vector logic**  
  链接: apache/gluten PR #11770  
  该 PR 虽然摘要较少，但从标题判断属于 **Velox 向量处理逻辑清理/简化**。这类重构通常会降低代码复杂度，减少 corner case 触发概率，为后续表达式或列式算子优化打基础。

### 3.2 工程与 CI 稳定性

- **#11760 [CLOSED] [INFRA] [CI] Fix the concurrency of code format check**  
  链接: apache/gluten PR #11760  
  修复 CI 中 code format check 的并发组配置，避免不同提交之间错误取消任务。  
  这会直接提升贡献者体验，减少“非代码问题导致的 CI 波动”，对高频 PR 项目尤其关键。

- **#11681 [CLOSED] [CORE, VELOX, DATA_LAKE] Add missing direct dependency for each module**  
  链接: apache/gluten PR #11681  
  为各模块补齐缺失的直接依赖，属于 **构建可重复性与模块边界治理** 的重要基础工作。  
  对多后端、多模块项目而言，这能降低“隐式依赖导致编译/运行不稳定”的风险。

- **#11647 [CLOSED] [DOCS] Fix typos in HowToRelease.md**  
  链接: apache/gluten PR #11647  
  文档类小修，但对 Release 流程规范化有正向价值。

### 3.3 工具链与测试体系

- **#11768 [CLOSED] [TOOLS] Gluten-it: Various fixes**  
  链接: apache/gluten PR #11768  
  工具链修复包含：  
  1. 去除不准确的 planning time；  
  2. 使用标准化 schema 创建 catalog tables，修复分区列类型识别错误；  
  3. 修复 plan 对象过度保留导致的 OOM。  
  这说明项目不仅关注执行引擎本体，也在持续修复 **测试/基准工具链的准确性与内存占用问题**，有利于后续性能评估结果更可信。

### 3.4 持续推进中的关键能力建设

以下 PR 虽未合并，但和路线图相关度高，值得重点观察：

- **#11615 [OPEN] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation**  
  链接: apache/gluten PR #11615  
  这是今日最值得跟踪的功能/稳定性 PR 之一，涉及 **Iceberg 文件级元信息函数兼容、JNI 初始化稳定性、元数据透传**，影响数据湖查询正确性与可运维性。

- **#11711 [OPEN] Translate might_contain as a subfield filter for scan-level bloom filter pushdown**  
  链接: apache/gluten PR #11711  
  将 `might_contain` 下推为 scan-level bloom filter，属于 **扫描层过滤前移**，对减少无效 IO、提高数据湖读取效率非常关键。

- **#11769 [OPEN] Write per-block column statistics in shuffle writer**  
  链接: apache/gluten PR #11769  
  为 shuffle block 写入列统计信息，与 Issue #11605 相呼应，明显是在为 **动态过滤下推到 shuffle reader** 做铺垫，属于较强路线图信号。

- **#11720 [OPEN] Add config to disable TimestampNTZ validation fallback**  
  链接: apache/gluten PR #11720  
  为 Velox 后端开发 `TIMESTAMP_NTZ` 支持提供开关，说明该类型兼容工作已从讨论进入可落地开发阶段。

- **#11726 [OPEN] Enable Variant test suites**  
  链接: apache/gluten PR #11726  
  启用 Spark 4.0/4.1 下 Variant 测试套件，表明项目正加强对 **新类型系统/半结构化数据** 的兼容验证。

---

## 4. 社区热点

### 4.1 Velox 上游 PR 跟踪仍是高热议题
- **#11585 [OPEN] [VL] useful Velox PRs not merged into upstream**  
  链接: apache/gluten Issue #11585  
  数据：16 评论，👍 4  
  这是当前最活跃的 Issue。它本质上反映了 Gluten 与 Velox 上游协同过程中的现实问题：  
  - 社区提交了不少对 Gluten 有价值的 Velox 改动；  
  - 但这些改动尚未进入上游，导致本地 fork / pick patch / rebase 成本上升；  
  - Gluten 团队需要在“快速交付功能”和“减少长期维护分叉”之间权衡。  
  技术诉求背后是 **依赖上游引擎演进速度** 与 **下游产品交付压力** 的矛盾。

### 4.2 动态过滤推到 Shuffle Reader
- **#11605 [OPEN] [VL] Push Velox dynamic filters to shuffle reader**  
  链接: apache/gluten Issue #11605  
  数据：7 评论  
  这是很强的性能优化方向。当前讨论聚焦于利用 Velox 可扩展的 dynamic filter API，将过滤条件进一步下推到 Gluten 的 shuffle reader，减少不必要的数据物化。  
  与之相呼应的 PR：  
  - **#11769** 写 shuffle block 列统计  
  - **#11711** bloom filter 下推至 scan level  
  可见社区正在围绕“**尽可能早过滤数据**”构建一条连续优化链路。

### 4.3 TIMESTAMP_NTZ 支持进入实施阶段
- **#11622 [OPEN] [VL] Support TIMESTAMP_NTZ Type**  
  链接: apache/gluten Issue #11622  
  数据：3 评论，👍 2  
  虽然讨论量不算最高，但其战略意义较大。  
  从 Issue 描述和关联 PR #11720 来看，社区正在分步骤推进：先允许关闭 fallback 验证，再补类型支持和 Substrait 映射。  
  这说明 Gluten 在 **Spark 新类型兼容** 方面的推进方式更偏工程化、渐进式，而不是一次性大改。

### 4.4 用户性能投诉：简单 LIMIT 查询显著慢于原生 Spark
- **#11766 [OPEN] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries**  
  链接: apache/gluten Issue #11766  
  该问题虽然评论不多，但非常值得重视。  
  背后反映出列式/原生执行在 **短路径、少数据、低复杂度查询** 场景下可能存在启动和调度开销偏大的问题。  
  对 OLAP 引擎来说，这类问题会显著影响用户对“替换 Spark 默认执行路径是否值得”的整体感知。

---

## 5. Bug 与稳定性

按严重程度与影响范围整理如下：

### 高优先级

#### 5.1 简单 LIMIT 查询性能劣化超过 10 倍
- **#11766 [OPEN] [VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries**  
  链接: apache/gluten Issue #11766  
  现象：`select * from store_sales limit 10` 这类轻量查询中，Gluten 明显慢于原生 Spark，且 Spark 原生仅生成一个 task。  
  影响：  
  - 影响用户对默认启用 Gluten 的信心；  
  - 对 BI 探查、小样本预览、交互式 SQL 体验影响明显；  
  - 暗示 limit/collect/短路读取路径可能仍有额外开销。  
  **当前未看到明确 fix PR**，建议维护者优先做 profile 与复现基准。

### 中优先级

#### 5.2 Iceberg 文件元信息函数与 JNI 初始化稳定性
- **#11615 [OPEN] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation**  
  链接: apache/gluten PR #11615  
  虽然这是 PR 不是 Issue，但其修复内容涉及：  
  - `input_file_name()`、`input_file_block_start()`、`input_file_block_length()` 在 Iceberg 上行为异常；  
  - 相关 JNI crash path；  
  - 元数据传播问题。  
  影响范围较广，既关系到 **查询结果语义正确性**，也关系到 **JNI 层稳定性**。  
  **已有 fix PR，待合并。**

#### 5.3 Dynamic Partition Pruning 相关 Spark UT 失败已关闭
- **#11692 [CLOSED] [BUG] Spark UTs from suite DynamicPartitionPruningHiveScanSuite are failing**  
  链接: apache/gluten Issue #11692  
  该问题已关闭，说明相关回归已有处理结果。  
  这是一个典型的 **查询正确性/测试回归** 问题，关闭本身是积极信号，表明维护者对 Spark 官方测试套件兼容性保持持续跟进。

### 中低优先级

#### 5.4 ColumnarCollectLimitExec skipped batches 内存泄漏
- **#11754 [CLOSED] Close ColumnarBatch in ColumnarCollectLimitExec for skipped batches**  
  链接: apache/gluten PR #11754  
  已修复。  
  与 #11766 的 LIMIT 性能问题并非同一问题，但都落在 limit/collect 相关执行路径上，建议后续联动观察是否还有同类资源管理与性能问题。

#### 5.5 Gluten-it 工具链中的 OOM 与类型识别问题
- **#11768 [CLOSED] Gluten-it: Various fixes**  
  链接: apache/gluten PR #11768  
  已修复。  
  虽然不直接影响线上查询执行，但会影响测试稳定性、基准准确性和开发验证效率。

---

## 6. 功能请求与路线图信号

### 6.1 TIMESTAMP_NTZ 支持很可能进入下一阶段实现
- Issue: **#11622 [OPEN] Support TIMESTAMP_NTZ Type**  
  链接: apache/gluten Issue #11622  
- PR: **#11720 [OPEN] Add config to disable TimestampNTZ validation fallback**  
  链接: apache/gluten PR #11720  

判断：**高概率纳入后续版本迭代**。  
理由：  
1. 已有明确跟踪 Issue；  
2. 已拆解为开发开关、基础类型支持、Substrait 映射等步骤；  
3. 已出现对应落地 PR。  
这类工作通常意味着功能已经从“想法”进入“工程实施”。

### 6.2 Shuffle Reader 动态过滤是明确的性能路线
- Issue: **#11605 [OPEN] Push Velox dynamic filters to shuffle reader**  
  链接: apache/gluten Issue #11605  
- PR: **#11769 [OPEN] Write per-block column statistics in shuffle writer**  
  链接: apache/gluten PR #11769  

判断：**很可能成为下一版本的重要性能特性之一**。  
理由：该优化需要 writer/reader 两端协同，当前已开始补 writer 侧统计信息，说明设计正在逐步闭环。

### 6.3 Scan-level bloom filter pushdown 有望提升数据湖读取效率
- **#11711 [OPEN] Translate might_contain as a subfield filter for scan-level bloom filter pushdown**  
  链接: apache/gluten PR #11711  
判断：这是较成熟、收益明确的扫描优化方向，若测试充分，合入概率较高。

### 6.4 Spark 4.x / 新类型体系兼容性持续增强
- **#11145 [CLOSED] Iceberg Support Spark4.0**  
  链接: apache/gluten Issue #11145  
- **#11726 [OPEN] Enable Variant test suites**  
  链接: apache/gluten PR #11726  

判断：项目仍在持续补足 **Spark 4.0/4.1、Iceberg、Variant 类型** 兼容能力。  
其中 Issue #11145 的关闭是积极信号，但由于信息有限，建议后续关注是否还有残余子问题。

### 6.5 仓库引用从 incubator 迁移到 TLP 路径
- **#11735 [OPEN] Update repository references from incubator-gluten to gluten after TLP graduation**  
  链接: apache/gluten PR #11735  
这不是功能特性，但属于重要的项目治理信号，说明社区正在完成从 incubator 到顶级项目（TLP）后的仓库与文档路径统一。

---

## 7. 用户反馈摘要

基于今日 Issue/PR 可提炼出以下真实用户痛点与场景：

1. **用户最关心“开启 Gluten 后是否真的更快”**  
   - 来自 **#11766**  
   - 在简单 `LIMIT` 查询上比 Vanilla Spark 慢 10 倍，会直接削弱用户对 Gluten 的性能预期。  
   - 这类反馈通常来自真实交互式分析场景，而非纯离线跑批。

2. **数据湖场景下，文件元信息函数与元数据传播很重要**  
   - 来自 **#11615**  
   - `input_file_name()` 一类函数常用于审计、调试、回溯、数据质量分析。  
   - 用户不只关心“能跑”，也关心“函数语义与 Spark 保持一致”。

3. **新类型兼容是阻碍用户升级 Spark 版本的重要因素**  
   - 来自 **#11622**, **#11720**, **#11726**  
   - `TIMESTAMP_NTZ`、Variant 等能力直接关系到 Spark 4.x 用户能否顺畅迁移到 Gluten。

4. **社区对上游 Velox 合并节奏比较敏感**  
   - 来自 **#11585**  
   - 这说明 Gluten 的很多能力建设依赖 Velox 上游生态，用户/开发者也感知到了“上游合并延迟会传导到下游交付”。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期或潜在积压项：

### 8.1 长期开启的关键规则修复 PR
- **#9473 [OPEN] fix: Update sort elimination rules for Hash Aggregate**  
  链接: apache/gluten PR #9473  
  创建于 2025-04-30，已开放近一年。  
  这是一个和 **聚合语义正确性/排序依赖判断** 相关的核心规则修复，长期未处理值得警惕。此类规则问题一旦边界条件未覆盖，可能导致错误优化。

### 8.2 Velox 上游未合并 PR 跟踪
- **#11585 [OPEN] useful Velox PRs not merged into upstream**  
  链接: apache/gluten Issue #11585  
  这不是单点积压，而是“积压集合”。  
  建议维护者定期清理：区分必须继续跟踪的 patch、可放弃的 patch、可转为 Gluten 本地实现的 patch，以降低维护成本。

### 8.3 TIMESTAMP_NTZ 支持仍处于拆解推进中
- **#11622 [OPEN] Support TIMESTAMP_NTZ Type**  
  链接: apache/gluten Issue #11622  
  虽然已见进展，但功能尚未闭环。若 Spark 4.x 用户增多，这会持续成为高频诉求。

### 8.4 Iceberg 修复 PR 待合并
- **#11615 [OPEN] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation**  
  链接: apache/gluten PR #11615  
  该 PR 影响面大，建议优先 review 与验证。

---

## 总结判断

今天的 Apache Gluten 呈现出比较典型的“**高活跃、强执行、以 Velox 与 Spark 兼容性为中心推进**”的状态：  
- 好消息是，内存泄漏、CI 并发、模块依赖、测试工具 OOM 等问题正在被快速修复；  
- 更大的中期方向则集中在 **动态过滤提前下推、数据湖元数据语义修复、TIMESTAMP_NTZ/Variant 等新类型支持**；  
- 风险点在于，**简单查询性能退化** 这类用户感知非常强的问题尚未看到明确修复路径，值得列为短期重点。

如果你愿意，我还可以继续把这份日报输出为更适合内部周会/飞书群同步的 **“精简版 10 条 bullet”** 或 **“管理层摘要版”**。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-17）

## 1. 今日速览

过去 24 小时，Apache Arrow 维持较高活跃度：Issues 更新 27 条、PR 更新 15 条，但**无新版本发布**。  
从结构上看，今日工作重心明显集中在 **CI/Packaging 稳定性修复、Python 类型系统完善、跨平台支持（Windows ARM64 / POWER / Emscripten）** 三个方向。  
已关闭 Issue 达 13 条，说明维护者在持续清理历史积压；同时新开与活跃 Issue 共 14 条，表明社区需求仍然持续涌入。  
整体健康度评估为 **中上**：交付节奏平稳，但基础设施类问题（GPG、ccache、chromedriver、MinGW 间歇性崩溃）仍占据较多维护带宽。

---

## 3. 项目进展

> 今日无 Release。以下聚焦“已合并/关闭”的重要 PR 与其对应推进。

### 3.1 CI：Maven 3.9.9 升级完成，支撑 Java 构建链
- PR: #49488 — GH-49526: [CI] Update Maven version from 3.8.7 to 3.9.9  
  链接: apache/arrow PR #49488
- 对应 Issue: #49526  
  链接: apache/arrow Issue #49526

**进展解读：**
- 该变更已关闭，解决了 Arrow Java 依赖较新 Maven Plugin API 的问题。
- 虽然这不是查询执行层能力增强，但它直接影响 **Java 子项目构建稳定性与后续依赖升级空间**，对 JDBC/Flight SQL 生态的持续演进是基础保障。

### 3.2 Packaging/CI：Linux 打包 GPG 校验故障已有快速修复
- Issue: #49521 — [CI] Linux packaging jobs failing due to GPG check FAILED  
  链接: apache/arrow Issue #49521
- PR: #49525 — [CI][Packaging] Try removing KEY that seems bad from downloaded KEYS file  
  链接: apache/arrow PR #49525

**进展解读：**
- 今日最直接的稳定性修复之一。
- 该问题会阻断 Linux packaging 流程，影响二进制产物生成与分发。
- 修复方案偏临时止血，但实际价值很高：**恢复发布链路与 nightly/packaging 任务可用性**，避免对下游包消费产生连锁影响。

### 3.3 CI：Python 最小构建任务中的 ccache 失败已修复
- Issue: #49518 — [CI] example-python-minimal-build-fedora-conda fails due to ccache error  
  链接: apache/arrow Issue #49518
- PR: #49519 — [CI] Do not override HOME to empty on build_conda.sh for minimal_build  
  链接: apache/arrow PR #49519

**进展解读：**
- 问题根因是脚本将 `HOME` 置空，导致 ccache 无法创建缓存目录。
- 修复后，最小 Python 构建场景恢复正常，利好 **PyArrow 精简构建验证** 与包维护质量。
- 这类问题虽然不直接提升计算性能，但能减少“伪失败”，提高开发者迭代效率。

### 3.4 Docs：补充 `.pxi` doctest 运行说明，降低 PyArrow 开发门槛
- PR: #49520 — [Docs][Python] Document that .pxi doctests are tested via lib.pyx  
  链接: apache/arrow PR #49520
- 相关重复关闭 PR: #49516、#49517  
  链接: apache/arrow PR #49516 / apache/arrow PR #49517

**进展解读：**
- 文档澄清 Cython `.pxi` doctest 实际通过 `lib.pyx` 触发测试。
- 这改善了 PyArrow 贡献者的开发体验，减少测试方法误解。
- 虽属文档层修补，但对 **Python 扩展开发与贡献 onboarding** 有实际意义。

### 3.5 C++/Gandiva：极值整数参数导致崩溃的问题已关闭
- PR: #49471 — [C++][Gandiva] Fix crashes in substring_index and truncate with extreme integer values  
  链接: apache/arrow PR #49471

**进展解读：**
- 修复 `substring_index` 与 `truncate` 在 `INT_MIN/INT_MAX` 等极端参数下的崩溃。
- 这是今天少数直接触及**表达式执行正确性与稳定性**的改动。
- 对依赖 Gandiva 的表达式下推、SQL 函数执行场景尤其重要，可降低边界输入导致的 SIGBUS/SIGSEGV 风险。

### 3.6 历史积压清理：多条陈旧 enhancement 被关闭
今日关闭的老 Issue 包括：
- #30642 支持读取 Apache Iceberg 表  
- #31215 执行引擎增加 window join  
- #30688 compute 文档分层  
- #30654 写压缩 CSV  
- 多条 R 绑定增强与 CI 议题  
链接: apache/arrow Issue #30642 等

**解读：**
- 这些关闭不一定代表功能已完整实现，也可能是 stale/路线调整/议题迁移。
- 从项目管理角度看，有助于降低噪音；但对外部用户而言，也提示某些长期诉求未必会按原议题继续推进。

---

## 4. 社区热点

### 4.1 POWER/PPC64LE 架构支持需求持续升温
- Issue: #43817 — [CI][Python][C++] Support on Power Architecture  
  链接: apache/arrow Issue #43817
- 评论数: 32

**热点分析：**
- 这是当前最具平台扩展意味的长期议题之一。
- 背后的技术诉求是：让 Arrow 的 **C++ 核心与 PyArrow wheel** 在 POWER/PPC64LE 架构上实现官方化支持，而不是依赖私有 fork/self-hosted CI。
- 对企业级分析平台、传统服务器架构、特定 HPC/金融基础设施用户很关键。
- 与正在推进的 Windows ARM64 PR #48539 一起看，Arrow 正面临更广泛的**多架构二进制分发诉求**。

### 4.2 Python 类型系统能力建设持续推进
- Issue: #31209 — [Python] Extracting Type information from Python Objects  
  链接: apache/arrow Issue #31209
- 评论数: 33
- 相关 PR: #48622 — [Python] Add internal type system stubs  
  链接: apache/arrow PR #48622

**热点分析：**
- 这是今日最值得关注的 Python 方向主线。
- 用户希望从 Python 对象/类型提示中自动提取 Arrow 类型，用于 UDF、类型安全 API、开发工具集成。
- PR #48622 引入内部 `_types.pyi`、`_stubs_typing` 等，说明项目正在从“静态类型补丁”走向“系统化类型描述层”。
- 对 DataFrame API、UDF 注册、IDE 支持、mypy/pyright 体验均有潜在提升。

### 4.3 Windows 安装与分发可信性：Flight SQL ODBC MSI 签名
- Issue: #49404 — Manual ODBC Windows MSI installer signing  
  链接: apache/arrow Issue #49404
- 评论数: 10

**热点分析：**
- 这是面向企业用户的现实问题：Windows Defender 会拦截未签名安装包。
- 本质上不是算法/存储优化，而是 **产品可交付性与企业落地门槛** 问题。
- 对 Flight SQL 作为跨系统查询接口的推广非常关键，尤其影响 Windows BI/ODBC 客户端接入链路。

### 4.4 文档构建质量改善
- PR: #49510 — [Docs][Python][C++] Minimize warnings and docutils errors for Sphinx build html  
  链接: apache/arrow PR #49510

**热点分析：**
- 虽然讨论热度不高，但从项目维护价值看很实用。
- 文档警告减少意味着发布流程、API 文档可信度和开发者体验都会更稳。
- 对大型基础库而言，文档质量本身就是生态竞争力的一部分。

---

## 5. Bug 与稳定性

按影响面和阻断程度排序：

### P1. Linux Packaging 因 GPG 校验失败而中断
- Issue: #49521  
  链接: apache/arrow Issue #49521
- Fix PR: #49525（已关闭）  
  链接: apache/arrow PR #49525

**影响：**
- 直接阻断 Linux 打包任务，影响构建产物生成与分发。

**状态：**
- 已有修复并关闭，短期风险已缓解。

---

### P1. Emscripten CI 因 chromedriver 安装失败
- Issue: #49522 — [CI] test-conda-python-emscripten fails installing chrome driver  
  链接: apache/arrow Issue #49522
- Fix PR: #49523 — Update chrome_version for emscripten job to latest stable (v146)  
  链接: apache/arrow PR #49523

**影响：**
- 阻断 WebAssembly / Emscripten 相关测试链路。
- 对 Arrow Web/浏览器运行时支持属于基础设施风险。

**状态：**
- 已有待合并修复 PR，预计较快落地。

---

### P1. Windows MinGW 上 `arrow-json-test` 间歇性 segfault
- PR: #49462 — [C++][CI] Fix intermittent segfault in arrow-json-test with MinGW  
  链接: apache/arrow PR #49462
- 关联问题: #49272（PR 摘要引用）

**影响：**
- 间歇性崩溃会制造假红 CI，影响 Windows C++ 变更可信度。
- 涉及 JSON reader 的并行多 chunk 测试，潜在暴露并发或生命周期管理问题。

**状态：**
- 修复仍在 review 中，值得持续关注。

---

### P2. 使用 vcpkg + multi-config 时 Release 构建错误链接 debug Snappy/Brotli
- Issue: #49499 — Snappy and Brotli debug libraries linked in Release builds when using vcpkg with multi-config generators  
  链接: apache/arrow Issue #49499

**影响：**
- 造成 `LNK2038` 运行时库/迭代器调试级别不匹配。
- 主要影响 Windows CMake/vcpkg 消费者，属于集成兼容性问题。

**状态：**
- 暂未看到对应 fix PR。

---

### P2. Gandiva 函数在极端整数参数下崩溃
- PR: #49471（已关闭）  
  链接: apache/arrow PR #49471

**影响：**
- 影响表达式执行稳定性，可能波及 SQL 风格函数调用场景。

**状态：**
- 修复已关闭，风险预计已消除。

---

### P3. `example-python-minimal-build-fedora-conda` 因 ccache 失败
- Issue: #49518  
  链接: apache/arrow Issue #49518
- Fix PR: #49519（已关闭）  
  链接: apache/arrow PR #49519

**影响：**
- 影响最小构建 CI，主要是工程效率问题。

**状态：**
- 已修复。

---

## 6. 功能请求与路线图信号

### 6.1 新日期构造函数需求：由 year/month/day 生成 `date32`
- Issue: #49514 — Compute function to generate date from year / month / day  
  链接: apache/arrow Issue #49514

**信号判断：**
- 这是明显的**计算函数补齐**需求，且与已有 `date -> year/month/day` 提取函数互补。
- 对 SQL/分析表达式生态很自然，适合进入下一批 compute kernel 增强。
- 该需求已有 2 个 👍，说明用户价值明确。

**可能性：较高**
- 原因：实现边界清晰、语义明确、与现有 API 对称。

---

### 6.2 Parquet 写入端新增 `total_buffered_bytes()` API
- PR: #49527 — [C++][Parquet] Add total_buffered_bytes() API for RowGroupWriter  
  链接: apache/arrow PR #49527

**信号判断：**
- 这是对 **Parquet 写入端可观测性/自适应 row group 切分** 的直接增强。
- 有助于上层系统在写入时根据缓冲字节数判断是否切分新 row group，属于分析型存储引擎非常实用的优化点。
- 若合并，可能改善大规模导出任务的内存与 row group 控制策略。

**可能性：较高**
- 原因：已有具体实现 PR，且用途明确。

---

### 6.3 探索用 pixi 替代 conda
- Issue: #49528 — Explore options for replacing conda with pixi  
  链接: apache/arrow Issue #49528

**信号判断：**
- 这是开发工具链层面的路线讨论，核心诉求是 **lockfile + 可复现构建 + 更好的任务管理与性能**。
- 不会短期替代整个生态，但可能先在开发环境、CI 某些 job 中试点。
- 若推进，将显著改善开发者体验和环境一致性。

**可能性：中等**
- 原因：仍处于探索阶段，生态切换成本较高。

---

### 6.4 HDFS 集成测试版本升级
- Issue: #49524 — [CI][Integration] Bump HDFS versions tested on conda python integration CI jobs  
  链接: apache/arrow Issue #49524

**信号判断：**
- 反映项目仍在维护 HDFS 兼容矩阵。
- 对数据湖/大数据集成用户是积极信号，说明传统存储系统兼容性仍在考虑范围内。

---

### 6.5 Windows ARM64 与 POWER 支持形成“多架构战略”信号
- PR: #48539 — [Python][CI] Add support for building PyArrow library on Windows ARM64  
  链接: apache/arrow PR #48539
- Issue: #43817 — Support on Power Architecture  
  链接: apache/arrow Issue #43817

**信号判断：**
- Arrow 正逐步从“主流 x86_64 平台支持”扩展到更多异构 CPU 生态。
- 对二进制分发、CI 成本、依赖兼容性提出更高要求。
- 这会是未来几个版本的持续主题，而非一次性任务。

---

## 7. 用户反馈摘要

### 7.1 用户需要更强的 Python 类型推断与静态类型支持
- 代表 Issue: #31209  
  链接: apache/arrow Issue #31209
- 代表 PR: #48622  
  链接: apache/arrow PR #48622

**痛点：**
- 在 UDF、类型注解、自动化 API 包装场景中，现有 PyArrow 类型系统表达能力不足。
- 用户希望 Python 类型提示能更自然映射到 Arrow 类型，减少手工声明和推断歧义。

---

### 7.2 企业与桌面用户在意安装可信性，而不只是功能可用
- 代表 Issue: #49404  
  链接: apache/arrow Issue #49404

**痛点：**
- Windows Defender 对未签名 MSI 的阻拦，导致“功能可用但无法顺利部署”。
- 这对 Flight SQL/ODBC 在企业内网推广是实际障碍。

---

### 7.3 下游集成者对 Windows/CMake/vcpkg 组合兼容性非常敏感
- 代表 Issue: #49499  
  链接: apache/arrow Issue #49499

**痛点：**
- 多配置生成器下链接到 debug 依赖会直接中断消费方编译流程。
- 说明 Arrow 作为底层库，其“被集成体验”仍是用户最敏感的质量指标之一。

---

### 7.4 用户希望 compute API 更接近 SQL/分析表达式直觉
- 代表 Issue: #49514  
  链接: apache/arrow Issue #49514

**痛点：**
- 已有日期拆解函数，却没有对称的日期构造函数。
- 这会迫使用户回退到 Python `datetime` 或字符串转换，损失性能与表达一致性。

---

### 7.5 跨平台用户希望官方支持，而不是长期维护私有 fork
- 代表 Issue: #43817  
  链接: apache/arrow Issue #43817
- 代表 PR: #48539  
  链接: apache/arrow PR #48539

**痛点：**
- 自建 wheel、自托管 runner、私有补丁维护成本高。
- 用户希望官方 CI 和发布链路覆盖更多架构，降低长期运营成本。

---

## 8. 待处理积压

以下议题/PR 值得维护者重点关注：

### 8.1 Python 内部类型系统 stubs 长期排队，价值高
- PR: #48622 — [Python] Add internal type system stubs  
  链接: apache/arrow PR #48622

**关注原因：**
- 已创建较久，现处于 awaiting committer review。
- 这类基础性工作一旦落地，会为后续 PyArrow 类型注解、IDE 体验、API 稳定性提供长期收益。

---

### 8.2 Windows ARM64 支持推进缓慢，但战略意义强
- PR: #48539 — [Python][CI] Add support for building PyArrow library on Windows ARM64  
  链接: apache/arrow PR #48539

**关注原因：**
- 创建于 2025-12-15，仍处于 change review。
- Windows on ARM 市场增长明显，若官方长期迟滞，生态窗口可能被错过。

---

### 8.3 POWER/PPC64LE 官方支持需求持续存在
- Issue: #43817  
  链接: apache/arrow Issue #43817

**关注原因：**
- 评论活跃，说明真实用户群体存在。
- 若不明确路线（支持/不支持/社区维护级支持），会持续消耗讨论资源。

---

### 8.4 vcpkg 多配置链接错误尚无修复 PR
- Issue: #49499  
  链接: apache/arrow Issue #49499

**关注原因：**
- 直接影响下游 Windows 用户的 Release 构建。
- 建议尽快补充最小复现 CI 或提交针对性修复。

---

### 8.5 MinGW JSON 测试间歇性崩溃尚待合并
- PR: #49462  
  链接: apache/arrow PR #49462

**关注原因：**
- 间歇性 segfault 对 CI 信任度伤害较大。
- 若不尽快处理，可能掩盖后续真实回归。

---

## 附：值得关注的链接清单

- Issue #43817 — POWER/PPC64LE 支持  
  链接: apache/arrow Issue #43817
- Issue #31209 — Python 对象类型信息提取  
  链接: apache/arrow Issue #31209
- Issue #49404 — Flight SQL ODBC Windows MSI 签名  
  链接: apache/arrow Issue #49404
- Issue #49499 — vcpkg 多配置链接错误  
  链接: apache/arrow Issue #49499
- Issue #49514 — year/month/day -> date32 计算函数  
  链接: apache/arrow Issue #49514
- Issue #49522 — Emscripten chromedriver 安装失败  
  链接: apache/arrow Issue #49522
- PR #48622 — PyArrow 内部类型系统 stubs  
  链接: apache/arrow PR #48622
- PR #49527 — Parquet RowGroupWriter `total_buffered_bytes()`  
  链接: apache/arrow PR #49527
- PR #48539 — Windows ARM64 PyArrow 构建支持  
  链接: apache/arrow PR #48539
- PR #49462 — MinGW 下 JSON 测试间歇性崩溃修复  
  链接: apache/arrow PR #49462

---

**结论：**  
今日 Apache Arrow 的核心主题不是新功能大规模落地，而是**工程可用性、跨平台覆盖与 Python 开发者体验**的持续打磨。对 OLAP/分析型存储引擎生态而言，最有价值的信号来自 Parquet 写入可观测性增强、Gandiva 边界崩溃修复，以及围绕类型系统和多架构支持的长期建设。整体来看，项目仍保持稳健推进，但需要警惕基础设施问题对研发吞吐的持续侵占。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*