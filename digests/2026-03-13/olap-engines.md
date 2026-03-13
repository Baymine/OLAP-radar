# Apache Doris 生态日报 2026-03-13

> Issues: 7 | PRs: 183 | 覆盖项目: 10 个 | 生成时间: 2026-03-13 01:55 UTC

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

# Apache Doris 项目动态日报（2026-03-13）

## 1. 今日速览

过去 24 小时 Apache Doris 保持**高活跃度**：Issues 更新 7 条、PR 更新 183 条，其中 91 条已合并或关闭，说明主干和分支维护都在持续推进。  
从 PR 内容看，今天的工作重心非常明确，集中在 **查询执行优化、内存占用收缩、file cache / cache 算法增强、跨版本 cherry-pick、以及 macOS 构建兼容性修复**。  
稳定性方面，新出现的高风险问题主要集中在 **Iceberg 扫描触发的 BE 崩溃**，而已关闭 PR 显示维护者正在快速修复 **搜索语义、TopN Filter 正确性、时区与构建链路** 等问题。  
整体判断：**项目工程推进节奏快，4.0/4.1 分支维护积极，性能与稳定性并行推进，健康度较高。**

---

## 3. 项目进展

### 3.1 今日已合并/关闭的重要 PR

#### 1）搜索/全文检索语义修复：MUST_NOT 对 NULL 行处理更准确
- PR: [#61200](https://github.com/apache/doris/pull/61200)  
- 标题: `[fix](search) Replace ExcludeScorer with AndNotScorer for MUST_NOT to handle NULL rows`

**进展解读：**  
该修复解决了 `search('NOT msg:omega')` 与 `NOT search('msg:omega')` 在 NULL 行处理上的不一致问题。  
这类问题直接影响**查询正确性**，尤其是在全文检索与 SQL 布尔逻辑混用场景下，属于对 query semantics 很关键的一步。  
对外部用户而言，这提升了 Doris 在搜索分析一体化场景中的可预期性。

---

#### 2）Query V2 能力增强：新增 Prefix / PhrasePrefix / UnionPostings
- PR: [#60701](https://github.com/apache/doris/pull/60701)  
- 标题: `[feat](query_v2) Add PrefixQuery, PhrasePrefixQuery and UnionPostings support`
- 分支回拣：[#61254](https://github.com/apache/doris/pull/61254)

**进展解读：**  
该特性为 Query V2 增加前缀查询、短语前缀查询以及倒排 posting 的合并支持，意味着 Doris 在**搜索型查询、文本检索、自动补全/前缀匹配**方面继续增强。  
配合上面的搜索语义修复，说明 Doris 正在持续强化“OLAP + 检索”的能力边界。

---

#### 3）TopN Filter 外连接场景正确性修复已进入维护分支
- PR: [#59074](https://github.com/apache/doris/pull/59074)  
- 标题: `[fix](topnFilter) Fix TopN filter probe expressions to wrap nullable slots when pushed through outer joins.`
- branch-4.0 回拣：[#61268](https://github.com/apache/doris/pull/61268)

**进展解读：**  
该问题属于典型的**优化器/执行器下推规则与 NULL 语义冲突**。  
修复后，TopN Filter 在 outer join 下推时会正确处理 nullable slot，减少错误过滤或结果偏差风险。  
这说明 Doris 对复杂 SQL 优化在“性能”之外，也在补齐“正确性护栏”。

---

#### 4）执行引擎默认参数调整：并行交换性能提升
- PR: [#60141](https://github.com/apache/doris/pull/60141)  
- 标题: `[Chore](execution) update PARALLEL_EXCHANGE_INSTANCE_NUM/BATCH_SIZE default value`
- pick PR: [#61287](https://github.com/apache/doris/pull/61287)

**进展解读：**  
PR 描述中指出，增大 batch_size 带来了**约 5% 的整体性能提升**。  
这类改动虽然不是新功能，但对默认体验影响很大，尤其适用于大多数不做深度参数调优的用户。  
说明社区正在通过默认参数治理，把性能优化“产品化”。

---

#### 5）Hash 相关底层执行优化被纳入维护分支
- PR: [#59410](https://github.com/apache/doris/pull/59410)  
- 标题: `[Improvement](hash) opt for pack_fixeds`
- pick PR: [#61287](https://github.com/apache/doris/pull/61287)

**进展解读：**  
该优化聚焦 hash join / hash table 中 null map 与 key packing 处理，属于典型的**执行层热点路径优化**。  
这类 PR 往往不会直接改变 SQL 能力，但会对 join / aggregation 等核心算子的吞吐和 CPU 利用率产生持续影响。

---

#### 6）macOS 构建兼容性连续修复
- PR: [#61285](https://github.com/apache/doris/pull/61285)  
- 标题: `[fix](build) Fix Boost sigtimedwait compile error on macOS`
- 相关后续 PR: [#61291](https://github.com/apache/doris/pull/61291)  
- 标题: `[fix](build) Fix --whole-archive linker error on macOS`

**进展解读：**  
今天 Doris 对 macOS 构建链路做了连续处理：先解决 Boost 对 `sigtimedwait` 的误判，再处理 GNU ld 参数不兼容 `ld64` 的链接问题。  
这类工作虽然不是线上功能，但对**开发者体验、贡献门槛、CI 覆盖面**有直接价值。

---

## 4. 社区热点

### 热点 1：3.0.0 Release Note 仍在活跃更新
- Issue: [#37502](https://github.com/apache/doris/issues/37502)  
- 标题: `Release Note 3.0.0`

**热度信号：** 7 条评论、13 个 👍  
**分析：**  
这是今天反应数最高的 Issue，说明社区对 3.0.0 的关注依然存在。  
摘要中重点提到 **Compute-Storage Decoupled（存算分离）**，这表明 Doris 的产品定位已明显从传统 MPP OLAP 向**云原生分析数据库**演进。  
即便 issue 被标记为 stale，它仍然是观察社区路线图与外部传播重点的重要窗口。

---

### 热点 2：Nereids 与 Legacy 结果字段不一致
- Issue: [#27993](https://github.com/apache/doris/issues/27993)  
- 标题: `[Bug] User select list can't match result field when using nereids`

**热度信号：** 5 条评论  
**分析：**  
这是典型的**新老优化器/规划器兼容性问题**。  
用户关心的不只是“能不能跑”，而是 **结果字段名、结果列绑定、客户端兼容性** 是否一致。  
背后反映出 Doris 在推动 Nereids 成为主规划器时，仍需持续消除行为差异，特别是面向 BI 工具、JDBC/ORM、SQL 网关等依赖稳定列元数据的场景。

---

### 热点 3：官网 CPU 占用高
- Issue: [#42358](https://github.com/apache/doris/issues/42358)  
- 标题: `[Bug] https://doris.apache.org cpu usage is very high`

**热度信号：** 4 条评论  
**分析：**  
虽然这不是数据库内核问题，但它反映了社区对**官网/文档站点前端性能**的关注。  
对开源项目而言，官网就是新用户入口，高 CPU 占用会影响文档阅读体验，进而影响 adoption。

---

### 热点 4：缓存与内存相关 PR 显著增多
重点 PR：
- [#61292](https://github.com/apache/doris/pull/61292) `Replace boxed Long-keyed maps with fastutil primitive collections in FE`
- [#61289](https://github.com/apache/doris/pull/61289) `Reduce CloudReplica per-instance memory footprint`
- [#61271](https://github.com/apache/doris/pull/61271) `Global mem control on scan nodes`
- [#57410](https://github.com/apache/doris/pull/57410) `A 2Q-LRU mechanism for protecting hotspot data in the normal queue`
- [#61272](https://github.com/apache/doris/pull/61272) `fix LRU-K visits list key collision and stale entry on erase`

**分析：**  
这些 PR 共同指向一个非常强的技术趋势：**Doris 正在系统性治理 FE/BE 内存与缓存效率**。  
从 primitive collection、lazy-init、global mem control，到 2Q-LRU / LRU-K 修复，说明维护者已经把“高并发、大元数据规模、冷热混合负载”的内存成本与缓存命中率，视为近期关键优化方向。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：Iceberg 表扫描/导入触发 BE Crash
- Issue: [#61225](https://github.com/apache/doris/issues/61225)  
- 标题: `BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg table scanning/loading`

**影响判断：高**  
- 版本：v4.0.2  
- 场景：读取或导入 Iceberg 表时，BE 持续崩溃  
- 特征：`SIGSEGV`、`std::out_of_range`

**分析：**  
这是今天最值得关注的稳定性问题之一，因为它涉及：
1. **外部湖仓格式 Iceberg**
2. **BE 进程级崩溃**
3. **扫描与加载双路径受影响**

目前数据中**尚未看到明确对应 fix PR**，建议维护者优先跟进 root cause、影响面和可回避方案。

---

### P1：Nereids 与 Legacy 结果字段不一致
- Issue: [#27993](https://github.com/apache/doris/issues/27993)

**影响判断：高**  
虽然不是崩溃，但属于**查询结果元数据正确性**问题。  
对依赖固定 schema / 列名映射的下游系统影响大。  
目前未看到今日直接关联修复 PR。

---

### P2：UDF 与系统函数同名冲突
- Issue: [#37083](https://github.com/apache/doris/issues/37083)  
- 标题: `user-defined union_udf.date_sub(now(3),2) conflict with the system date_sub(now(3),2)`

**影响判断：中高**  
这暴露出 Doris 在**函数解析、命名空间和函数优先级规则**上的边界问题。  
如果 UDF 无法稳定覆盖或隔离系统函数，用户在做 SQL 迁移和自定义函数扩展时会面临兼容性风险。  
今日暂无对应 fix PR。

---

### P2：StreamingInsertJob replay 时 NPE
- PR: [#61253](https://github.com/apache/doris/pull/61253)  
- 标题: `[fix](streaming) Fix NPE in StreamingInsertJob when MetricRepo is not initialized during replay`

**影响判断：中高**  
这个问题虽然以 PR 形式出现，但反映的是 FE replay 路径上的稳定性缺陷。  
修复说明 Doris 对**恢复过程、重放路径、初始化顺序**问题在积极补洞。  
且该 PR 已带有 `approved, reviewed` 标记，落地概率较高。

---

### P2：ES Catalog 遇到 keyword/text 数组时报错
- PR: [#61236](https://github.com/apache/doris/pull/61236)  
- 标题: `[fix](es-catalog) Fix query error when ES keyword field contains array data`

**影响判断：中**  
外表接入 ES 时，字段 mapping 与真实数据结构不一致是常见情况。  
Doris 原先直接报类型错误，现在改为序列化为 JSON 字符串，更偏向**兼容性优先**。  
这类修复对异构数据源接入很重要。

---

### P3：File cache 元数据 stale 导致本地 NOT_FOUND
- PR: [#61205](https://github.com/apache/doris/pull/61205)  
- 标题: `[fix](filecache) self-heal stale DOWNLOADED entries on local NOT_FOUND`

**影响判断：中**  
这是一个偏底层、但很实际的问题：重启窗口中内存元数据和磁盘文件状态不一致。  
PR 的“self-heal”思路说明 Doris 在增强 file cache 的**自恢复能力**，对云存储/冷热分层场景尤为关键。

---

### P3：LRU-K 实现存在 key collision 与 stale entry 问题
- PR: [#61272](https://github.com/apache/doris/pull/61272)  
- 标题: `[opt](cache) fix LRU-K visits list key collision and stale entry on erase`

**影响判断：中**  
这是缓存淘汰正确性问题。虽然不一定立刻引发错误结果，但会造成**错误晋升、缓存污染、命中率下降**，对 IO 效率和尾延迟有负面影响。

---

## 6. 功能请求与路线图信号

### 1）新增 SQL 函数：`SPLIT_BY_STRING(..., ..., limit)`
- Issue: [#55788](https://github.com/apache/doris/issues/55788)

**需求内容：**  
为 `SPLIT_BY_STRING` 增加第三个可选参数 `limit`，控制分割后数组大小。

**路线图判断：中等概率**  
这是典型的 SQL 易用性增强，请求明确、实现边界清晰。  
结合 Doris 近阶段对 SQL 兼容性和函数体系持续补充的趋势，这类需求**比较可能进入后续版本**，尤其适合做小版本增强。

---

### 2）Postgres Streaming Job 支持列级排除
- PR: [#61267](https://github.com/apache/doris/pull/61267)  
- 标题: `[Improve](Streamingjob) support exclude_columns for Postgres streaming job`

**路线图判断：较高概率**  
虽然这是 PR 而非 Issue，但它反映出用户对 **CDC / 流式同步细粒度控制** 的明确诉求。  
支持 `exclude_columns` 后，可降低同步链路中的 schema 改动风险，也更贴近真实生产需求。  
如果顺利合并，很可能成为 Doris 流式接入能力的一个实用增强点。

---

### 3）LDAP over SSL（LDAPS）支持
- PR: [#60275](https://github.com/apache/doris/pull/60275)  
- 标题: `[enhance](auth) introduction of ldaps support via configuration property`

**路线图判断：高概率**  
企业用户对安全接入能力要求稳定，LDAPS 是典型的企业级特性。  
该 PR 已 `approved, reviewed`，从状态看纳入后续版本的可能性较高。  
这说明 Doris 正继续补强**企业身份认证与安全合规**能力。

---

### 4）外表支持 condition cache
- PR: [#60897](https://github.com/apache/doris/pull/60897)  
- 标题: `[feat](condition cache) Support condition cache for external table`

**路线图判断：中高概率**  
如果落地，将提升外部表查询在重复条件下的效率，尤其适合 lakehouse / federation 场景。  
这与今日其他 cache/filecache 优化方向一致，说明 Doris 正在持续提升**外部数据访问性能**。

---

### 5）查询进度对外暴露
- PR: [#60567](https://github.com/apache/doris/pull/60567)  
- 标题: `[improvement](executor) expose query progress when select processlist or active_queries`

**路线图判断：较高概率**  
这是明显的**可观测性增强**。  
对于平台运维、SRE、SQL 网关和多租户环境，这类能力非常实用，也符合分析型数据库产品成熟化方向。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 可提炼出以下真实用户痛点：

### 1）用户更在意“正确性一致”，而不只是性能
- 代表问题：[#27993](https://github.com/apache/doris/issues/27993)、[#59074](https://github.com/apache/doris/pull/59074)、[#61200](https://github.com/apache/doris/pull/61200)

**反馈信号：**  
用户在 Nereids、TopN Filter、全文检索布尔逻辑上，反复暴露的是“结果对不对”“字段名稳不稳”“NULL 语义是否一致”。  
这说明 Doris 已进入更成熟的使用阶段：用户不再只是尝试功能，而是在生产中要求**语义稳定、行为可预期**。

---

### 2）湖仓与异构数据源接入是高频场景
- 代表问题：[#61225](https://github.com/apache/doris/issues/61225)、[#61236](https://github.com/apache/doris/pull/61236)、[#55594](https://github.com/apache/doris/issues/55594)

**反馈信号：**  
Iceberg、Hive Catalog、ES Catalog 都在今天数据中出现。  
这说明 Doris 用户正大量运行在**联邦查询、外部表、湖仓混合架构**中。  
对应地，用户最敏感的是崩溃、谓词下推/延迟物化是否生效、以及类型兼容边界。

---

### 3）大规模实例下的内存成本正成为显性问题
- 代表 PR：[#61292](https://github.com/apache/doris/pull/61292)、[#61289](https://github.com/apache/doris/pull/61289)、[#61271](https://github.com/apache/doris/pull/61271)

**反馈信号：**  
多个 PR 同时瞄准 FE/CloudReplica/ScanNode 内存占用，说明在实际部署中，元数据规模、缓存结构、扫描并发带来的内存压力已经足够明显。  
社区正在从“单点优化”转向“系统性降本”。

---

### 4）开发与构建体验仍有改进空间
- 代表 PR：[#61285](https://github.com/apache/doris/pull/61285)、[#61291](https://github.com/apache/doris/pull/61291)

**反馈信号：**  
macOS 构建问题被连续修复，说明开发者生态中本地编译与贡献体验仍值得投入。  
这类改进会间接提升社区活跃度和外部贡献效率。

---

## 8. 待处理积压

以下是值得维护者关注的长期未决或 stale 项：

### 1）Nereids 结果字段匹配问题
- Issue: [#27993](https://github.com/apache/doris/issues/27993)  
- 创建于：2023-12-05  
- 状态：Open / Stale

**提醒：**  
该问题时间跨度长，且涉及查询结果元数据一致性，不宜长期处于 stale 状态。  
建议明确是否已被新架构覆盖、是否存在 workaround、是否需要回归测试补齐。

---

### 2）3.0.0 Release Note 仍保持 Open
- Issue: [#37502](https://github.com/apache/doris/issues/37502)

**提醒：**  
虽不是技术缺陷，但 release note 长期开着会影响版本信息整洁度。  
如果其内容已沉淀为正式文档，建议归档或关闭。

---

### 3）官网 CPU 占用高
- Issue: [#42358](https://github.com/apache/doris/issues/42358)  
- 状态：Open / Stale

**提醒：**  
文档站点问题会直接影响新用户第一印象。  
建议尽快确认是否为前端脚本、埋点、动画组件或浏览器兼容问题。

---

### 4）UDF 与系统函数冲突
- Issue: [#37083](https://github.com/apache/doris/issues/37083)  
- 状态：Open / Stale

**提醒：**  
该问题关联 SQL 扩展能力与函数命名规则，若迟迟不处理，可能持续阻碍用户自定义函数生态。

---

### 5）较老的 Stale PR 仍悬而未决
- PR: [#56022](https://github.com/apache/doris/pull/56022)  
- 标题: `[fix](json) Using CastToString::from_number to cast float to string`
- PR: [#57410](https://github.com/apache/doris/pull/57410)  
- 标题: `[feature](filecache)A 2Q-LRU mechanism for protecting hotspot data in the normal queue`

**提醒：**  
前者涉及 JSON/类型转换兼容，后者涉及 filecache 热点保护机制。  
尤其是 #57410，与今日多个 cache 优化方向高度一致，建议维护者统一评估，与 LRU-K 修复、filecache 自愈等工作是否可以整合推进。

---

## 附：今日总体判断

Apache Doris 今日表现出非常清晰的工程信号：

- **主线一：执行引擎性能优化**  
  hash、agg、parallel exchange、scan 内存控制持续推进。
- **主线二：缓存/存储体系增强**  
  filecache、2Q-LRU、LRU-K、自愈机制明显升温。
- **主线三：查询正确性和兼容性修复**  
  搜索语义、outer join + TopN filter、ES/Hive/Iceberg 外部系统兼容性是重点。
- **主线四：多分支稳定维护**  
  4.0.x / 4.1.x 的 cherry-pick 节奏快，版本维护健康。

如果你愿意，我还可以把这份日报进一步整理成：
1. **面向管理层的 1 页简报版**，或  
2. **面向研发团队的技术深读版**。

---

## 横向引擎对比

以下为基于 2026-03-13 社区动态整理的 **OLAP / 分析型存储引擎开源生态横向对比分析报告**。

---

# 开源 OLAP / 分析型存储引擎生态横向对比分析（2026-03-13）

## 1. 生态全景

过去 24 小时的动态显示，开源分析引擎生态整体处于 **高频迭代、性能与正确性并重、湖仓互操作持续加强** 的阶段。  
从 Apache Doris、Delta Lake、Databend 的有效样本看，社区关注点已不再局限于“跑得更快”，而是进一步转向 **查询语义一致性、缓存/内存效率、CDC/流批一体、外部格式兼容、以及工程可维护性**。  
其中，**Doris 更像是面向统一分析服务的数据库内核型项目**，**Delta Lake 更偏向湖仓协议与 Spark/Kernel 互操作中枢**，**Databend 则处于 SQL 能力快速补强与执行器重构并进阶段**。  
这说明当前生态竞争已从单点性能比拼，演进为 **执行引擎、开放格式、连接器能力、运维可观测性、企业级稳定性** 的综合竞争。

---

## 2. 各项目活跃度对比

> 注：仅根据已提供摘要统计；“摘要生成失败”的项目不做定量判断。

| 项目 | Issues 更新 | PR 更新 | Release | 今日技术焦点 | 健康度评估 |
|---|---:|---:|---|---|---|
| **Apache Doris** | 7 | 183 | 无 | 查询执行优化、内存收缩、file cache、搜索语义修复、macOS 构建兼容、4.0/4.1 分支维护 | **高**：活跃度最高，修复与分支维护同步推进 |
| **Delta Lake** | 4 | 49 | 无，但出现 `4.2.0-SNAPSHOT` 信号 | Kernel 事务修复、DSv2、CDC、UniForm、Iceberg 兼容、CI | **高**：路线清晰，版本推进明确 |
| **Databend** | 5 | 18 | `v1.2.888-nightly` | JOIN/聚合正确性、SQL 国际化、递归 CTE、优化器测试基础设施、branch/tag 重构 | **中高**：修复响应快，仍处于能力扩展期 |
| **ClickHouse** | — | — | — | 摘要缺失 | **数据不足** |
| **DuckDB** | — | — | — | 摘要缺失 | **数据不足** |
| **StarRocks** | — | — | — | 摘要缺失 | **数据不足** |
| **Apache Iceberg** | — | — | — | 摘要缺失 | **数据不足** |
| **Velox** | — | — | — | 摘要缺失 | **数据不足** |
| **Apache Gluten** | — | — | — | 摘要缺失 | **数据不足** |
| **Apache Arrow** | — | — | — | 摘要缺失 | **数据不足** |

### 简要结论
- **Apache Doris** 是今日样本中活跃度最高的项目，PR 数量显著领先，且多分支回拣频繁，说明其既有新特性推进，也有较强的版本维护能力。
- **Delta Lake** 虽 PR 总量不及 Doris，但主题集中、架构主线清晰，尤其是 **Kernel / DSv2 / CDC / UniForm** 已形成连续演进链条。
- **Databend** 活跃度相对小一些，但其 issue→fix PR 的闭环速度较快，显示出团队对正确性问题响应积极。

---

## 3. Apache Doris 在生态中的定位

### 3.1 核心定位
Apache Doris 当前在生态中的位置，已明显超出“传统 MPP OLAP 数据库”，正在向 **统一分析服务平台** 演进：  
一方面保留高性能 SQL 分析引擎特征，另一方面持续增强 **全文检索、外表/湖仓查询、缓存体系、云场景存算分离、流式接入、安全认证、可观测性**。

### 3.2 相比同类项目的优势
**相较 Delta Lake：**
- Doris 更偏 **数据库内核与查询服务本体**，而 Delta 更偏 **表格式 / 协议层 / Spark-Kernel 生态中枢**。
- Doris 在今日动态里体现出更强的 **执行层调优深度**：hash、parallel exchange、scan 内存控制、TopN filter、search query semantics 等都直接作用于查询运行时。

**相较 Databend：**
- Doris 的社区体量和维护节奏更大，PR 数量约为 Databend 的 10 倍级。
- Doris 的工程关注面更广，覆盖 **查询引擎、缓存、构建链路、外部系统兼容、搜索能力、企业安全能力**。
- Databend 更像是仍在快速补齐执行器和 SQL 边界能力，而 Doris 已更多进入 **“性能产品化 + 正确性治理 + 多版本稳定交付”** 阶段。

### 3.3 技术路线差异
Doris 的路线有几个鲜明特征：
1. **OLAP + 检索融合**：Query V2 持续增强 Prefix / PhrasePrefix / UnionPostings，区别于多数纯 SQL 分析引擎。
2. **外部数据访问性能化**：不仅接 Iceberg / Hive / ES，还在推进 file cache、condition cache、自愈、LRU-K/2Q-LRU 等机制。
3. **云化与工程化并进**：从 CloudReplica 内存收缩到存算分离信号，再到多分支 cherry-pick，表现出较成熟的产品线维护能力。
4. **正确性优先级上升**：MUST_NOT + NULL 语义、outer join 下 TopN filter、Nereids/Legacy 一致性等，都说明 Doris 已进入“生产级语义稳定性治理”阶段。

### 3.4 社区规模对比
以今日样本数据看：
- **Doris > Delta Lake > Databend**（按 PR 活跃度与议题覆盖广度）
- Doris 的社区表现更接近一个 **大规模、多分支、持续交付型** 开源数据库项目，而非单一方向的功能开发仓库。

---

## 4. 共同关注的技术方向

以下方向在多个项目中同时出现，说明已成为当前分析引擎生态的共同议题。

### 4.1 查询正确性与语义一致性
**涉及项目：Apache Doris、Databend、Delta Lake**

- **Doris**：MUST_NOT 对 NULL 行处理修复、TopN Filter 在 outer join 下推时的 nullable 处理、Nereids 与 Legacy 结果字段不一致。
- **Databend**：LEFT JOIN + 空 build side 投影错误、函数大小写解析错误、MERGE INTO panic。
- **Delta Lake**：事务 early-exit 失效、Deletion Vector unique id 错误、dataskipping timestamp overflow。

**共同诉求：**
- 用户已从“功能可用”走向“边界语义稳定、结果一致、元数据可靠”。
- 这对 BI、CDC、连接器、SQL 网关和自动化平台尤为关键。

---

### 4.2 内存、缓存与资源效率治理
**涉及项目：Apache Doris、Databend、Delta Lake**

- **Doris**：FE primitive collections、CloudReplica 内存收缩、scan node 全局内存控制、file cache 自愈、2Q-LRU、LRU-K 修复。
- **Databend**：GROUP_CONCAT(DISTINCT) 内存泄漏修复、执行器资源稳定性增强。
- **Delta Lake**：UniForm 大表 manifest 生成改为流式/分布式，实质上是大规模场景的内存/扩展性治理。

**共同诉求：**
- 大规模元数据、超大表、混合冷热负载下，资源效率已成为核心竞争点。
- 社区关注点从算子微优化，升级为 **系统性降本与可扩展性设计**。

---

### 4.3 湖仓互操作与外部格式兼容
**涉及项目：Apache Doris、Delta Lake**

- **Doris**：Iceberg 扫描崩溃、ES Catalog 兼容修复、condition cache for external table。
- **Delta Lake**：Kernel IcebergCompat 校验、UniForm 生成 Iceberg manifest、CDC / DSv2 / Kernel 对 Spark 与外部生态的对接。

**共同诉求：**
- 用户不再满足于单一存储格式或单一引擎，而是要求 **开放格式 + 多引擎读写 + 可迁移性**。
- 互操作能力正在成为主流分析引擎的必选项。

---

### 4.4 流式 / CDC / 增量处理能力
**涉及项目：Delta Lake、Apache Doris**

- **Delta Lake**：初始快照 CDC、增量 CDC、DSv2 读取选项 (`ignoreChanges` / `ignoreDeletes` / `skipChangeCommits`)。
- **Doris**：Postgres streaming job 支持 `exclude_columns`，StreamingInsertJob replay 稳定性修复。

**共同诉求：**
- 数据平台越来越强调 **流批一体、变更消费、实时同步**。
- CDC 已不再是外围生态功能，而是分析平台主链路的一部分。

---

### 4.5 可观测性与工程成熟度
**涉及项目：Databend、Delta Lake、Apache Doris**

- **Databend**：`EXPLAIN PERF` 增加硬件性能计数器。
- **Delta Lake**：UC main 非阻塞 CI、DSv2 扫描统计信息增强。
- **Doris**：查询进度暴露、macOS 构建修复、多分支稳定维护。

**共同诉求：**
- 项目在向“可运维、可归因、可持续集成”的成熟工程体系演进。
- 这类能力对生产环境比单次 benchmark 更有价值。

---

## 5. 差异化定位分析

| 维度 | Apache Doris | Delta Lake | Databend |
|---|---|---|---|
| **核心角色** | 分析型数据库 / MPP 查询服务引擎 | 湖仓表格式与事务协议层，兼具 Spark/Kernel 接入栈 | 云原生分析数据库 / SQL 引擎 |
| **存储格式定位** | 自身存储 + 外部表/湖仓接入 | 以 Delta 格式为核心，并强化与 Iceberg 互操作 | 自身存储体系为主，逐步扩展 SQL / 元数据能力 |
| **查询引擎设计关注点** | 执行引擎优化、搜索融合、缓存体系、外表性能 | Spark DSv2、Kernel 事务/扫描、CDC、UniForm | SQL 兼容、执行器正确性、优化器与实验特性迭代 |
| **目标负载类型** | 交互式分析、报表、联邦查询、搜索分析一体、云场景 | 数据湖表管理、批流处理、CDC、跨引擎读写 | 云分析、复杂 SQL、交互查询、实验性高级能力演进 |
| **SQL 兼容性演进** | 关注新旧优化器一致性、搜索语义、函数体系 | 更关注 Spark/DSv2 行为与协议语义 | 快速补齐边界语义、国际化标识符、递归 CTE 等 |
| **企业化能力信号** | LDAPS、查询进度、存算分离、多分支维护 | 协议成熟度、UC 集成、Kernel 稳定性 | 正在增强，但整体仍偏引擎迭代期 |

### 一句话概括
- **Doris**：更像“面向生产服务的统一分析数据库平台”
- **Delta Lake**：更像“湖仓事务与开放互操作的协议/中间层中枢”
- **Databend**：更像“快速演进中的云原生 SQL 分析引擎”

---

## 6. 社区热度与成熟度

### 6.1 活跃度分层
**第一梯队：Apache Doris**
- PR 数量显著领先。
- 既有新特性推进，也有多分支维护、回拣和稳定性修复。
- 说明项目不仅“热”，而且已经形成成熟发布节奏。

**第二梯队：Delta Lake**
- 活跃度高于多数基础格式项目的常见日常水平。
- 主题高度集中于主线架构演进，反映出清晰路线图和较强维护组织性。

**第三梯队：Databend**
- 活跃规模小一些，但改动质量密度高。
- 典型特征是：问题发现后很快有修复，说明团队仍处在快速收敛产品能力的阶段。

---

### 6.2 成熟度判断：快速迭代 vs 质量巩固

#### 更偏“质量巩固阶段”的项目
- **Apache Doris**
  - 典型信号：大量 correctness fix、多分支 cherry-pick、默认参数产品化、缓存自愈、构建链路修复。
  - 说明项目已从“加功能”进入“保体验、保稳定、保升级路径”的成熟期。

- **Delta Lake**
  - 典型信号：协议边界澄清、Kernel 事务正确性、CI 对外部依赖主干验证。
  - 虽仍在扩展能力，但整体已具有较强平台基础设施属性。

#### 更偏“快速迭代阶段”的项目
- **Databend**
  - 典型信号：实验性 Join、递归 CTE、branch/tag 重构、优化器 replay harness。
  - 表明项目还在积极拓展 SQL 覆盖度和执行器能力边界。

---

## 7. 值得关注的趋势信号

### 7.1 “正确性工程”正在成为新一轮竞争焦点
过去很多分析引擎更多强调性能 benchmark；而今天各项目高频出现的却是：
- NULL 语义
- 外连接下推
- 字段名/元数据一致性
- 删除向量标识
- 时间戳边界溢出
- 聚合状态内存安全

**对架构师的意义：**
选择引擎时，不能只看吞吐与延迟，还要重点审视其在 **复杂 SQL、边界语义、异构接入、元数据一致性** 上的成熟度。

---

### 7.2 湖仓互操作正在从“支持读取”走向“生产级可扩展互通”
Doris 的 Iceberg/ES/外表优化，Delta 的 UniForm + Iceberg manifest 重构，都说明：
- 多格式并存将成为常态；
- 用户需要的不只是“能接入”，而是 **能稳定跑、能大规模跑、能跨引擎协同跑**。

**对数据工程师的意义：**
未来平台设计应优先考虑 **开放格式、缓存机制、元数据一致性、协议演进兼容**，而不是绑定单一执行引擎。

---

### 7.3 缓存与内存控制已成为云成本优化主战场
Doris 的 file cache / LRU-K / 2Q-LRU / global mem control，Delta 的大表流式 manifest 生成，都反映出一个共识：
**资源效率 = 产品竞争力。**

**对平台团队的意义：**
在评估新引擎或升级版本时，应重点验证：
- 大元数据规模下 FE/控制面内存占用
- 外表/对象存储场景 cache 命中率
- 大查询并发下 scan 与 join 的内存护栏
- 极端大表场景的 driver / coordinator 扩展性

---

### 7.4 CDC 与增量处理正在成为分析平台标配
Delta 在 CDC 上推进明显，Doris 也在流式导入与 streaming job 细节控制上持续增强。  
这意味着 **OLAP 引擎与数据同步系统的边界正在收缩**。

**对数据工程师的意义：**
未来选型时应把以下能力纳入核心考量：
- 初始快照 + 增量变更统一消费
- 流式作业列级控制
- replay / checkpoint / recovery 稳定性
- CDC 语义与批处理结果的一致性

---

### 7.5 工程成熟度正在成为社区分水岭
从 macOS 构建修复、CI against UC main、nightly 持续发布、优化器 replay harness 可以看出：
**真正成熟的项目，不只体现在功能数量，更体现在可测试、可维护、可回归。**

**对技术决策者的意义：**
在开源项目选型中，应将以下指标纳入评估：
- 是否具备清晰分支维护策略
- 问题到修复的闭环速度
- 是否有 nightly / snapshot / CI 外部兼容验证
- 是否能从 issue / PR 中看出测试与回归基础设施投入

---

# 总结结论

## 总体判断
2026-03-13 的样本显示，开源 OLAP / 分析存储生态正进入一个新的成熟阶段：  
**性能优化仍然重要，但真正拉开差距的，是正确性、互操作性、资源效率、CDC 能力和工程成熟度。**

## Apache Doris 的结论
Apache Doris 是今天样本中最强势、最全面的项目之一，表现出：
- 高强度主干推进
- 积极的 4.0/4.1 分支维护
- 执行引擎与缓存体系的系统优化
- 对查询正确性和多源接入问题的快速响应

其生态定位已经从单一 OLAP 引擎，走向 **“数据库内核 + 湖仓访问 + 搜索分析 + 云化能力”的综合分析平台**。

## 对选型的建议
- 若关注 **统一分析服务、性能与多场景兼顾、工程维护成熟度**：优先关注 **Apache Doris**
- 若关注 **湖仓事务层、Spark/Kernel/CDC/开放格式互操作**：重点关注 **Delta Lake**
- 若关注 **新型云原生分析引擎、SQL 能力快速演进、较前沿执行器设计**：可持续跟踪 **Databend**

---

如果你愿意，我还可以继续把这份报告整理为以下两种版本之一：  
1. **管理层汇报版（1页，强调结论与风险）**  
2. **研发团队版（按执行引擎 / 湖仓 / CDC / 缓存 / SQL兼容五个主题展开）**

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

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-13）

## 1. 今日速览

过去 24 小时内，Delta Lake 社区维持**高活跃度**：Issues 更新 4 条、PR 更新 49 条，明显重心仍在 PR 推进而非问题堆积，说明当前处于**功能开发与集成强化期**。  
从主题看，今日工作主要集中在 **Spark / Kernel / DSv2 / CDC / UniForm / CI** 六个方向，既有面向查询执行与流处理的能力扩展，也有针对兼容性与稳定性的快速修复。  
关闭的 Issue 与 PR 多数都能对应到明确代码改动，反映出维护节奏较健康，尤其是 Kernel 与 DSv2 相关改动正在加速收敛。  
另外，仓库中已出现 **4.2.0-SNAPSHOT** 版本推进信号，意味着项目可能已进入下一轮版本开发窗口。  

---

## 2. 项目进展

### 已关闭 / 已落地的重要改动

#### 2.1 修复 Kernel 事务构建早退路径失效问题
- **PR**: #6271 `Fix missing return in TransactionBuilderImpl early-exit path`
- **状态**: 已关闭
- **关联 Issue**: #4713（已关闭）
- **链接**: delta-io/delta PR #6271 / delta-io/delta Issue #4713

**进展解读：**  
这是今天最明确的稳定性修复之一。问题出在 `buildTransactionInternal()` 的 early-exit 路径：当事务只包含数据更新、不涉及 metadata/protocol 变更时，本应直接返回一个轻量事务对象，但实际代码没有 return，导致流程继续落入完整的 metadata/protocol 更新管线。  
这会带来两类影响：
1. **不必要的额外开销**：事务构建做了重复工作；
2. **实现语义偏差**：原本 intended 的“短路优化”失效。

对 Kernel 用户而言，这属于**事务构建正确性与效率**修复，尤其影响嵌入式接入或 connector 层事务提交路径。

---

#### 2.2 Kernel Iceberg 兼容性校验补齐 DV 并发防护
- **PR**: #6278 `Add previous-protocol DV check in Kernel IcebergCompat validation`
- **状态**: 已关闭
- **链接**: delta-io/delta PR #6278

**进展解读：**  
该改动补齐了 Kernel 侧与 Spark 侧一致的 Deletion Vector（DV）检查逻辑：不仅检查最新 protocol，也检查 previous snapshot/protocol，防止并发写入期间启用了 DV 却被兼容性校验漏判。  
这类修复虽然偏底层，但非常关键，因为它涉及：
- **并发一致性**
- **Iceberg 兼容导出/校验正确性**
- **跨引擎行为一致性**

对 UniForm、Iceberg 互操作和多写入端场景，是一个明显的稳定性增强。

---

#### 2.3 DSv2 读选项能力栈在快速迭代，但部分 PR 已关闭重组
- **PR**:
  - #6245 `[kernel-spark] Support read option ignoreDeletes in dsv2`（已关闭）
  - #6246 `[kernel-spark] Support skipChangeCommits and ignoreDeletes read option in dsv2`（已关闭）
- **链接**: delta-io/delta PR #6245 / delta-io/delta PR #6246

**进展解读：**  
虽然这两条 PR 已关闭，但并不表示方向被放弃。结合仍然开启的：
- #6249 `Support ignoreChanges read option in dsv2`
- #6250 `Support ignoreFileDeletion read option in dsv2`

可以判断维护者正在**重组/拆分 DSv2 读取选项支持的提交栈**，以便分别推进 `ignoreChanges`、`ignoreDeletes`、`ignoreFileDeletion`、`skipChangeCommits` 等行为。  
这对 Spark Structured Streaming、增量消费和 CDC 用户很重要，因为这些选项直接关系到：
- 流式读对变更的容忍策略
- 兼容旧作业语义
- 变更日志与表快照之间的边界定义

---

## 3. 社区热点

> 注：输入数据未提供评论数排序的真实值，以下基于“更新频率、技术影响面、主题热度”综合判断。

### 热点一：Kernel/Spark CDC 流处理能力持续扩展
- **PR**:
  - #6075 `[kernel-spark] Add initial snapshot CDC support to SparkMicroBatchStream`
  - #6076 `[kernel-spark] Add incremental CDC support to SparkMicroBatchStream`
- **链接**: delta-io/delta PR #6075 / delta-io/delta PR #6076

**技术诉求分析：**  
这组 stacked PR 是当前最强的路线图信号之一。它们分别覆盖：
- **初始快照 CDC**
- **增量 CDC**

目标是让 `SparkMicroBatchStream` 更系统地支持 Change Data Feed 读取。  
这反映出社区对以下能力有明确需求：
1. 流批一体的 CDC 消费；
2. 更低成本地从 Delta 表构建下游同步/审计/订阅系统；
3. 在 Kernel-Spark 统一栈上减少 Spark 专有实现与通用引擎实现的分裂。

这很可能是下一版本的重点能力之一。

---

### 热点二：DSv2 扫描器能力增强，向 Spark 优化器更深集成
- **PR**:
  - #6224 `[Spark] Implement SupportsReportPartitioning in DSv2 SparkScan`
  - #6276 `[kernel-spark] Override columnarSupportMode in DSv2 SparkScan`
  - #6101 `[kernel-spark] [Spark] Report numRows in estimateStatistics() using per-file stats`
- **链接**: delta-io/delta PR #6224 / delta-io/delta PR #6276 / delta-io/delta PR #6101

**技术诉求分析：**  
这几条 PR 共同指向一个趋势：**让 Delta 的 DSv2 扫描器向 Spark Catalyst/Planner 暴露更多可优化信息**。  
包括：
- 输出分区信息（用于 shuffle elimination、join 优化）
- 更明确的列式读取支持模式
- 使用 per-file stats 报告 `numRows` 统计信息

这说明 Delta 正在从“可被 Spark 读取”走向“可被 Spark 更充分优化”。  
对大表 join、聚合、分区裁剪和矢量化扫描场景，收益会很直接。

---

### 热点三：UniForm 面向超大表的 Iceberg manifest 生成重构
- **PR**: #6272 `[UniForm] Streaming and distributed Iceberg manifest generation for large tables`
- **链接**: delta-io/delta PR #6272

**技术诉求分析：**  
这是今天最值得关注的存储互操作方向改动之一。该 PR 试图把 UniForm 的 Iceberg 转换路径从**driver 侧集中式生成**，改为：
- 流式、内存受控
- 可选分布式生成

核心目标是支持**百万文件级别的大表**。  
背后的用户诉求很明确：
- 现有 driver 方案在大表上存在内存/扩展性瓶颈；
- 用户希望 Delta 与 Iceberg 生态互操作时，不牺牲生产级可扩展性；
- UniForm 不应只服务中小规模表，而要能进入“超大湖仓表”场景。

---

### 热点四：CI 对 Unity Catalog 主干兼容性的前置验证
- **PR**: #6263 `[CI Improvements] Add non-blocking CI job to test against UC main`
- **链接**: delta-io/delta PR #6263

**技术诉求分析：**  
该 PR 引入对 Unity Catalog 主分支的非阻塞 CI 测试，并允许通过构建参数指定 UC 版本。  
这表明 Delta 维护者正在加强：
- 与上游依赖的持续兼容性验证
- 提前发现 API/行为漂移
- 减少集成回归在正式发布前才暴露的问题

这是典型的**工程成熟度提升**信号。

---

## 4. Bug 与稳定性

以下按潜在影响程度排序。

### P1：Kernel 删除向量唯一 ID 生成错误
- **Issue**: #6261 `[BUG][Kernel] Deletion Vector unique id in Java/Kernel concatenates Optional instead of its value`
- **状态**: Open
- **链接**: delta-io/delta Issue #6261

**问题说明：**  
`DeletionVectorDescriptor.getUniqueId()` 在 offset 存在时，错误地把 `Optional<Integer>` 对象直接拼接进字符串，而不是拼接其内部值。  
这可能导致：
- DV 唯一标识错误；
- 下游缓存、索引、比较逻辑失真；
- 在依赖 unique id 的逻辑中出现行为异常。

**严重性判断：高。**  
虽然看起来是字符串拼接问题，但对象标识错误往往会扩散到缓存一致性、去重和引用逻辑。  
**当前未看到对应 fix PR。**

---

### P1-P2：dataskipping 中时间戳溢出修复进行中
- **PR**: #6260 `[Spark] Fix timestamp overflow in dataskipping`
- **状态**: Open
- **链接**: delta-io/delta PR #6260

**问题说明：**  
数据跳过（data skipping）属于查询性能和过滤正确性的关键路径。时间戳溢出如果发生在边界值、极端时间范围或编码转换过程中，可能造成：
- 本应命中的文件被错误跳过；
- 或无法跳过文件，导致性能回退。

**严重性判断：高。**  
因为它可能同时影响**查询正确性与性能**。  
**已有 fix PR，正在推进。**

---

### P2：`add.modificationTime` 协议语义不清晰
- **Issue**: #6094 `Clarify valid range for add.modificationTime (can it be 0 or negative?)`
- **状态**: Open
- **链接**: delta-io/delta Issue #6094

**问题说明：**  
用户希望澄清 `PROTOCOL.md` 中 `add.modificationTime` 的允许范围，尤其是 0 或负值是否合法。  
这类问题不是传统“崩溃型 bug”，但属于**协议兼容性风险**：
- 不同实现可能产生不一致解释；
- 第三方 connector/reader 可能处理分歧；
- 元数据消费端可能误将其视为非法值。

**严重性判断：中。**  
对多语言、多引擎生态影响不小。  
**当前未看到直接修复 PR，仍需协议层明确。**

---

### P2：Kernel 事务早退路径 bug 已修复
- **Issue**: #4713
- **PR**: #6271
- **状态**: 均已关闭
- **链接**: delta-io/delta Issue #4713 / delta-io/delta PR #6271

**说明：**  
这是今天已完成处置的稳定性问题，属于正向信号：问题识别到修复落地链路清晰。

---

## 5. 功能请求与路线图信号

### 5.1 利用 catalog 列统计信息增强 Kernel connector
- **Issue**: #5952 `[Feature Request] Leverage column stats from catalog in kernel connector`
- **状态**: Closed
- **链接**: delta-io/delta Issue #5952

**路线图判断：**  
虽然 issue 已关闭，但从关闭时机和当前活跃 PR 看，这更像是功能进入实现/重构通道，而不是被否决。  
结合：
- #6101 使用 per-file stats 上报 `numRows`
- #6224 报告 partitioning
- DSv2 统计与优化信息增强

可推测 Delta 团队正在系统推进**统计信息驱动的查询优化能力**。  
这类能力很可能进入下一版本迭代重点，尤其针对 Spark/Kernel 统一扫描层。

---

### 5.2 CDC 能力大概率进入下一阶段主线
- **PR**: #6075 / #6076
- **链接**: delta-io/delta PR #6075 / delta-io/delta PR #6076

**路线图判断：**  
初始快照 + 增量 CDC 双线并进，是很强的产品化信号。  
如果这组 PR 顺利合并，Delta Lake 在流式增量订阅、变更传播和下游同步方面的能力会明显增强。  
**纳入下一版本概率：高。**

---

### 5.3 DSv2 写路径与执行器写入框架持续建设
- **PR**:
  - #6230 `[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage`
  - #6231 `[DSv2] Add factory + transport: DataWriterFactory, BatchWrite`
- **链接**: delta-io/delta PR #6230 / delta-io/delta PR #6231

**路线图判断：**  
这说明 Delta 并不只是在补 DSv2 读路径，也在系统建设**DSv2 写路径基础设施**。  
如果继续推进，未来将有助于：
- 更标准化地接入 Spark DSv2 写入栈；
- 改善与 Spark planner / writer lifecycle 的一致性；
- 降低维护旧式路径的复杂度。

**纳入下一版本概率：中高。**

---

### 5.4 4.2.0-SNAPSHOT 版本线已出现
- **PR**:
  - #6280 `[Build] Bump version to 4.2.0-SNAPSHOT`
  - #6256 `Change master version to 4.2.0-SNAPSHOT`
- **链接**: delta-io/delta PR #6280 / delta-io/delta PR #6256

**路线图判断：**  
虽然今天没有新 release，但版本号切换到 `4.2.0-SNAPSHOT` 是很直接的信号：  
项目可能已经开始为 **4.2.0** 整理开发主线，后续 Spark/Kernel/DSv2/CDC 相关改动都值得重点关注其是否进入该版本。

---

## 6. 用户反馈摘要

### 6.1 用户关心协议字段的“边界语义”而不仅是字段存在与否
- **Issue**: #6094
- **链接**: delta-io/delta Issue #6094

从 `add.modificationTime` 的提问可见，用户已经不仅满足于“能读写 Delta”，而是开始深入依赖协议细节构建外部系统。  
这说明 Delta 的生态使用方式正在从**单一 Spark 内部使用**扩展到：
- 第三方 connector
- 元数据治理工具
- 多引擎读写互操作

用户的痛点是：**协议文档在边界值与语义一致性上仍需更明确。**

---

### 6.2 Kernel 用户对底层对象标识和实现细节非常敏感
- **Issue**: #6261
- **链接**: delta-io/delta Issue #6261

Deletion Vector unique id 的问题，体现出用户不是在做简单查询，而是在做更底层、更工程化的集成。  
其真实痛点是：
- 需要可预测、稳定、可比较的内部标识；
- 一旦实现细节泄漏到 API 行为，就会影响外围系统的正确性。

---

### 6.3 大规模表用户对 UniForm / Iceberg 转换的可扩展性要求上升
- **PR**: #6272
- **链接**: delta-io/delta PR #6272

从该 PR 的设计目标可以反推出用户场景：  
Driver 集中式 manifest 生成已无法满足超大表，社区需要**真正可扩展的转换链路**，而不是实验性质支持。  
这说明 Delta 在多格式互操作场景里，正在被用于更大规模生产环境。

---

## 7. 待处理积压

以下项目建议维护者重点关注：

### 7.1 #6094 协议澄清类问题不宜长期悬而未决
- **Issue**: #6094
- **状态**: Open
- **创建时间**: 2026-02-20
- **链接**: delta-io/delta Issue #6094

**原因：**  
协议边界不清晰会影响第三方实现一致性，长期来看比单点 bug 更容易形成生态碎片。  
建议尽快给出：
- 合法取值范围
- 语义定义
- 历史兼容策略

---

### 7.2 #6101 统计信息上报能力值得加速
- **PR**: #6101
- **状态**: Open
- **创建时间**: 2026-02-22
- **链接**: delta-io/delta PR #6101

**原因：**  
`estimateStatistics()` 的 `numRows` 报告能力会直接影响 Spark 优化器决策，是“小改动高收益”的典型。  
若长时间不合并，可能拖慢 DSv2 扫描优化整体收益落地。

---

### 7.3 #6075 / #6076 CDC 堆栈 PR 体量较大，需防止长期悬挂
- **PR**: #6075 / #6076
- **状态**: Open
- **创建时间**: 2026-02-19
- **链接**: delta-io/delta PR #6075 / delta-io/delta PR #6076

**原因：**  
CDC 是高价值能力，但 stacked PR 长期悬挂容易带来：
- rebase 成本上升
- 评审门槛增加
- 与其他流式读取改动相互冲突

建议维护者拆分关键能力点，优先合并基础设施部分。

---

### 7.4 #6166 stagingCatalog 扩展涉及 catalog 兼容面，值得持续跟进
- **PR**: #6166
- **状态**: Open
- **创建时间**: 2026-03-02
- **链接**: delta-io/delta PR #6166

**原因：**  
该 PR 面向非 Spark session catalog 的 stagingCatalog 扩展，可能影响：
- RTAS/CTAS 语义
- catalog 插件兼容
- 跨环境部署一致性

属于中长期兼容性价值较高的工作。

---

## 8. 健康度结论

今天的 Delta Lake 项目整体呈现出**开发积极、修复及时、路线清晰**的健康状态。  
正面信号包括：
- PR 活跃度高，说明研发推进强；
- Kernel 事务 bug 已快速闭环；
- Spark/Kernel/DSv2/CDC/UniForm 多线并进，体现架构层面持续演进；
- 已出现 `4.2.0-SNAPSHOT` 版本推进信号。

需要关注的风险点主要有两类：
1. **协议和底层语义边界**仍有待澄清（如 modificationTime、DV unique id）；
2. **大型 stacked PR** 若长期未合并，可能增加维护成本与集成风险。

总体判断：**项目健康度高，当前处于下一版本能力扩张与底层重构并行阶段。**

--- 

如果你愿意，我还可以继续把这份日报整理成更适合团队内部同步的两种格式之一：
1. **面向管理层的 1 页摘要版**
2. **面向工程团队的变更跟踪版（按 Spark / Kernel / UniForm 分类）**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报（2026-03-13）

## 1. 今日速览

过去 24 小时内，Databend 保持了较高活跃度：Issues 更新 5 条，PR 更新 18 条，并发布了 1 个 nightly 版本，整体节奏偏快，且以查询引擎修复与内部重构为主。  
从关闭情况看，4 个 Issue 在当天被处理关闭，7 个 PR 已合并/关闭，说明维护者对回归问题和正确性缺陷的响应比较及时。  
技术焦点集中在 SQL 兼容性、JOIN/聚合正确性、优化器测试基础设施，以及递归 CTE、分支/标签架构重构等中长期演进方向。  
风险方面，今日仍有 1 个新开 Bug 未关闭，涉及 `GROUP_CONCAT(DISTINCT ...)` 聚合内存泄漏，但其对应修复 PR 已在当天关闭，项目健康度总体良好。  

---

## 2. 版本发布

### v1.2.888-nightly
- 发布信息：`v1.2.888-nightly`
- 链接：<https://github.com/databendlabs/databend/releases>

#### 主要更新
本次 nightly 的显式新增功能只有 1 项：

- **`EXPLAIN PERF` 增加按执行计划节点展示硬件性能计数器**
  - 来源 PR：由 `@dqhl76` 提交
  - 功能描述：为执行计划级别暴露更细粒度的硬件性能计数器，便于定位查询执行热点、CPU 行为与算子级瓶颈。
  - 价值判断：这属于典型的 OLAP 引擎可观测性增强，尤其适用于分析复杂查询、评估算子实现、跟踪回归和做性能归因。

#### 破坏性变更
- 从当前提供的 release notes 看，**未见明确破坏性变更声明**。

#### 迁移/使用注意事项
- 该版本为 **nightly**，建议优先用于：
  - 性能分析环境
  - 回归验证环境
  - 新功能试用环境
- 如团队准备使用 `EXPLAIN PERF` 新能力，建议同步检查：
  - 查询执行环境是否启用了对应性能计数支持
  - 内部性能基线脚本是否需要更新，以便消费新增的 per-plan 指标
- 对生产环境用户而言，建议等待后续稳定版本确认兼容性与开销表现。

---

## 3. 项目进展

以下为今日合并/关闭且相对重要的 PR，按“查询引擎功能 / SQL 兼容性 / 稳定性修复”分类整理。

### 3.1 查询正确性与执行引擎修复

#### 1) 修复 `GROUP_CONCAT(DISTINCT ...)` 在 group by 场景中的内存泄漏
- PR：#19544  
- 链接：<https://github.com/databendlabs/databend/pull/19544>
- 对应 Issue：#19543  
- 链接：<https://github.com/databendlabs/databend/issues/19543>

**进展说明：**
- 修复 grouped final aggregation 阶段可空聚合状态重复初始化导致的内存泄漏问题。
- 为该问题补充了无状态回归测试。

**影响分析：**
- 这是典型的分析型数据库聚合执行稳定性问题，若在高基数分组或长时间任务中出现，可能造成内存持续增长。
- 对使用字符串聚合、报表导出、标签汇总类 SQL 的用户影响更直接。

---

#### 2) 修复新 Hash Join 在空 build side 下 `LEFT JOIN` 输出投影错误
- PR：#19539  
- 链接：<https://github.com/databendlabs/databend/pull/19539>
- 对应 Issue：#19533  
- 链接：<https://github.com/databendlabs/databend/issues/19533>

**进展说明：**
- 修复 `enable_experimental_new_join = 1` 时，build 侧为空触发的 schema / DataBlock 列顺序不一致问题。
- 问题在分布式执行中可能进一步表现为 Arrow / Flight 反序列化失败。

**影响分析：**
- 该问题属于**查询正确性 + 分布式稳定性**双重风险。
- 修复后有助于提高新 Join 实现的可用性，说明 Databend 团队仍在积极推进实验性 Join 路径向可生产化演进。

---

#### 3) 修复内建函数名在大小写敏感设置下被错误影响
- PR：#19537  
- 链接：<https://github.com/databendlabs/databend/pull/19537>
- 对应 Issue：#19536  
- 链接：<https://github.com/databendlabs/databend/issues/19536>

**进展说明：**
- 修复 `unquoted_ident_case_sensitive=1` 时，内建函数名解析被错误视为大小写敏感的问题。
- 统一内建函数查找行为，使其与聚合函数工厂的大小写处理一致。

**影响分析：**
- 这是 SQL 兼容性层面的重要修复。
- 用户通常期望系统函数解析不受普通标识符大小写策略影响；该修复降低了配置项对系统内部行为的“误伤”。

---

#### 4) 支持未加引号的 Unicode / CJK 标识符与别名
- PR：#19526  
- 链接：<https://github.com/databendlabs/databend/pull/19526>
- Issue：#19522  
- 链接：<https://github.com/databendlabs/databend/issues/19522>

#### 5) 同步 AST crate 到 0.2.5，供下游消费 Unicode 标识符能力
- PR：#19541  
- 链接：<https://github.com/databendlabs/databend/pull/19541>

**进展说明：**
- Databend 现在接受未加引号的 Unicode 字母类标识符，例如 `AS 中文`。
- 同时升级 AST crate，使下游如 bendsql 也能获得该兼容性改进。

**影响分析：**
- 这是对国际化 SQL 使用体验的直接改进。
- 对中文列别名、多语言 BI 场景、Notebook 交互式分析用户很实用。

---

#### 6) 修复 `MERGE INTO` unmatched 子句 panic
- PR：#19529  
- 链接：<https://github.com/databendlabs/databend/pull/19529>

**进展说明：**
- 修复 issue #16885 对应的 `MERGE INTO` unmatched-clause panic。
- 绑定 unmatched 条件和值表达式时改用合适的 schema，并补齐所需引用列。

**影响分析：**
- 这类修复直接提升 DML 稳定性，尤其影响 CDC、数仓增量合并、维表更新等场景。

---

### 3.2 基础设施与可维护性推进

#### 7) CI 升级 Go 版本
- PR：#19540  
- 链接：<https://github.com/databendlabs/databend/pull/19540>

**意义：**
- 用于修复 CI 错误，属于工程健康度维护，减少非功能性阻塞。

#### 8) 优化器 replay 支撑能力抽取并增加轻量测试 harness
- PR：#19542（进行中）
- 链接：<https://github.com/databendlabs/databend/pull/19542>

**意义：**
- 虽未合并，但方向值得关注：优化器回放能力抽象出来，意味着后续计划优化回归定位和 SQL/函数测试统一化会更成熟。

---

## 4. 社区热点

> 注：当前数据里评论数和点赞基本都很低，说明“热度”更多体现在技术影响范围而非讨论量。

### 热点 1：`GROUP_CONCAT(DISTINCT ...)` 内存泄漏
- Issue：#19543  
- 链接：<https://github.com/databendlabs/databend/issues/19543>
- 修复 PR：#19544  
- 链接：<https://github.com/databendlabs/databend/pull/19544>

**技术诉求分析：**
- 用户核心诉求是聚合算子在复杂分组场景下的**内存安全性**。
- 在 OLAP 中，字符串聚合、去重聚合往往最容易暴露状态管理缺陷，该问题反映出聚合状态生命周期管理仍是引擎重点风险面。

---

### 热点 2：新 Join 实现的正确性成熟度
- Issue：#19533  
- 链接：<https://github.com/databendlabs/databend/issues/19533>
- 修复 PR：#19539  
- 链接：<https://github.com/databendlabs/databend/pull/19539>

**技术诉求分析：**
- 社区关注点是新 Join 路径在边界条件下能否稳定替代旧实现。
- 空 build side、分布式传输、列投影顺序，这些都是 MPP/向量化执行引擎里高频且容易隐藏 bug 的环节。

---

### 热点 3：SQL 国际化兼容性
- Issue：#19522  
- 链接：<https://github.com/databendlabs/databend/issues/19522>
- PR：#19526  
- 链接：<https://github.com/databendlabs/databend/pull/19526>
- 补充 PR：#19541  
- 链接：<https://github.com/databendlabs/databend/pull/19541>

**技术诉求分析：**
- 用户希望 Databend 在标识符解析上更贴近现代 SQL 工具链与多语言使用习惯。
- 这背后反映的是 Databend 正从“内核功能完善”继续向“生态接入与开发者体验”拓展。

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：`GROUP_CONCAT(DISTINCT ...)` grouped final aggregation 内存泄漏
- Issue：#19543  
- 链接：<https://github.com/databendlabs/databend/issues/19543>
- 状态：**Open**
- 修复 PR：#19544  
- 链接：<https://github.com/databendlabs/databend/pull/19544>
- 状态判断：**已有 fix PR，且已关闭，预计已进入主干或完成处理流程**

**风险：**
- 长查询/大分组任务可能触发内存异常增长。
- 聚合算子稳定性问题，影响生产可用性。

---

### P1：新 Hash Join 在 `LEFT JOIN + 空 build side` 下输出错列/反序列化失败
- Issue：#19533  
- 链接：<https://github.com/databendlabs/databend/issues/19533>
- 状态：**Closed**
- 修复 PR：#19539  
- 链接：<https://github.com/databendlabs/databend/pull/19539>

**风险：**
- 查询结果错误是高优先级问题。
- 在分布式执行中还能扩大为执行失败。

---

### P2：`unquoted_ident_case_sensitive` 错误影响内建函数解析
- Issue：#19536  
- 链接：<https://github.com/databendlabs/databend/issues/19536>
- 状态：**Closed**
- 修复 PR：#19537  
- 链接：<https://github.com/databendlabs/databend/pull/19537>

**风险：**
- 配置开启后可能造成系统函数不可用、内部查询异常。
- 属于 SQL 行为偏差，易造成“看似随机”的兼容性问题。

---

### P2：未加引号 Unicode/CJK alias 不支持
- Issue：#19522  
- 链接：<https://github.com/databendlabs/databend/issues/19522>
- 状态：**Closed**
- 修复 PR：#19526  
- 链接：<https://github.com/databendlabs/databend/pull/19526>

**风险：**
- 非致命，但影响国际化体验与 SQL 易用性。
- 对 BI、教学、中文分析场景更敏感。

---

### P2/P3：历史遗留 vacuum 断言失败问题关闭
- Issue：#13995  
- 链接：<https://github.com/databendlabs/databend/issues/13995>
- 状态：**Closed**

**观察：**
- 这是一个 2023 年遗留问题今日关闭，说明维护者在清理历史积压。
- 但当前数据未附带直接修复 PR，建议后续确认关闭依据：是否已被新架构覆盖、已无法复现，或由其他提交间接修复。

---

## 6. 功能请求与路线图信号

今天没有非常明确的“新功能需求型 Issue”，但从打开中的 PR 可以看出几个较强的路线图信号：

### 1) 递归 CTE 流式执行能力
- PR：#19545  
- 链接：<https://github.com/databendlabs/databend/pull/19545>

**信号判断：**
- 该 PR 提到解决 Databend 无法执行特定 Sudoku 递归查询的问题，属于 SQL 高级能力补强。
- 若合并，将显著提升复杂递归查询与图/层级问题的支持度。

---

### 2) 相关子查询 `LIMIT` 去相关化
- PR：#19532  
- 链接：<https://github.com/databendlabs/databend/pull/19532>

**信号判断：**
- 这是优化器能力增强，不只是修 bug。
- 通过改写为分区 `row_number()` 过滤，Databend 正持续补齐复杂 SQL 的 planner/optimizer 语义覆盖。

---

### 3) 运行时过滤器策略细化
- PR：#19547  
- 链接：<https://github.com/databendlabs/databend/pull/19547>
- PR：#19546  
- 链接：<https://github.com/databendlabs/databend/pull/19546>

**信号判断：**
- 一项聚焦 bloom runtime filter 选择率阈值作用域；
- 一项聚焦 IN-list rewrite 的 NULL 语义与大列表展开栈溢出问题。
- 说明团队正同时优化查询性能和 SQL 语义保真，是典型“面向生产负载精修”的阶段特征。

---

### 4) 表分支/标签（branch/tag）架构重构
- PR：#19534  
- 链接：<https://github.com/databendlabs/databend/pull/19534>
- PR：#19499  
- 链接：<https://github.com/databendlabs/databend/pull/19499>

**信号判断：**
- “移除 legacy 实现”与“table branch refactor”并行出现，说明该特性正进入架构重整期。
- 这通常意味着未来会有更统一、更可维护的版本化/数据分支能力落地。

---

## 7. 用户反馈摘要

基于今日 Issue 摘要，可提炼出以下真实用户痛点：

### 1) 用户希望配置项边界清晰，不影响系统内建行为
- 相关 Issue：#19536  
- 链接：<https://github.com/databendlabs/databend/issues/19536>

**反馈要点：**
- `unquoted_ident_case_sensitive` 应只作用于用户标识符，而不是内建函数和系统内部查询。
- 反映出用户对“配置可预测性”的要求很高。

---

### 2) 聚合算子在复杂场景下的资源稳定性仍然敏感
- 相关 Issue：#19543  
- 链接：<https://github.com/databendlabs/databend/issues/19543>

**反馈要点：**
- 用户已经在使用相对复杂的 `GROUP_CONCAT(DISTINCT ...) + GROUP BY` 组合。
- 说明 Databend 正被用于更接近真实生产分析负载，而不只是基础 SQL 测试。

---

### 3) 多语言标识符支持是实际需求，而非边缘需求
- 相关 Issue：#19522  
- 链接：<https://github.com/databendlabs/databend/issues/19522>

**反馈要点：**
- 用户明确期望未加引号的中文/Unicode alias 正常工作。
- 这通常来自交互式查询、报表命名、面向业务团队的数据分析场景。

---

### 4) 新执行路径的边界正确性非常关键
- 相关 Issue：#19533  
- 链接：<https://github.com/databendlabs/databend/issues/19533>

**反馈要点：**
- 当实验性 Join 开关开启后，用户愿意尝试新实现，但也很快暴露边界 bug。
- 说明社区既关注性能提升，也非常重视执行正确性。

---

## 8. 待处理积压

### 1) 表分支/标签重构链路较长，建议持续关注评审与收敛
- PR：#19499  
- 链接：<https://github.com/databendlabs/databend/pull/19499>
- PR：#19534  
- 链接：<https://github.com/databendlabs/databend/pull/19534>

**提醒：**
- 这是结构性改造，通常涉及元数据模型、表层抽象、兼容迁移。
- 若长时间悬而未决，容易造成旧实现与新实现并存的维护负担。

---

### 2) Hash shuffle 重构仍在推进
- PR：#19505  
- 链接：<https://github.com/databendlabs/databend/pull/19505>

**提醒：**
- 查询分发与 shuffle 是 MPP 执行关键路径。
- 该类重构若长期未合并，可能拖慢后续性能/稳定性工作叠加。

---

### 3) databend-meta 升级与依赖整合需重点关注兼容性
- PR：#19513  
- 链接：<https://github.com/databendlabs/databend/pull/19513>

**提醒：**
- 元数据层升级通常影响面广，涉及客户端接口、依赖树和部署一致性。
- 建议维护者确保升级说明和回归覆盖充分。

---

### 4) 优化器 replay 测试基础设施值得尽快落地
- PR：#19542  
- 链接：<https://github.com/databendlabs/databend/pull/19542>

**提醒：**
- 这类“测试支撑设施”短期不直接产出用户功能，但能显著提升后续优化器变更的可验证性和迭代速度。
- 对减少查询回归非常关键。

---

## 总体判断

Databend 今日表现出典型的“高频修复 + 中期架构演进并行”特征：  
一方面，团队快速处理了 JOIN、聚合、标识符解析等直接影响生产可用性的 bug；另一方面，递归 CTE、优化器回放、branch/tag、shuffle 重构等工作表明项目仍在持续扩展分析引擎深度。  
从项目健康度看，**响应速度快、修复闭环完整、nightly 持续发布**，整体状态积极；需要继续关注的主要风险点则是实验性执行路径和复杂 SQL 语义在边界条件下的稳定性。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

⚠️ 摘要生成失败。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*