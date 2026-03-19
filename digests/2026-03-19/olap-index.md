# OLAP 生态索引日报 2026-03-19

> 生成时间: 2026-03-19 01:25 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告
**日期：2026-03-19**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个非常清晰的趋势：**系统能力正从“可运行”走向“可治理、可观测、可组合、可扩展”**。  
dbt-core 的讨论重点集中在 **命令一致性、测试可靠性、解析稳定性**；Spark 持续推进 **执行性能、开发体验、SQL 优化器与生态集成**；Substrait 则更多在打磨 **标准语义、类型系统与跨引擎互操作规范**。  
从整体上看，行业已经不再只关注单点性能，而是更重视 **正确性、边界行为、跨工具一致性、企业级集成能力**。  
这意味着 OLAP 基础设施正在进入一个更成熟的阶段：**底层标准、计算引擎、开发框架三层同时演进，并相互牵引**。

---

## 2. 各项目活跃度对比

> 说明：以下为基于日报摘要中“过去 24 小时/今日重点”可确认的数据汇总。

| 项目 | 今日活跃 Issues 数 | 今日重点 PR 数 | Release 情况 | 活跃特征 |
|---|---:|---:|---|---|
| dbt-core | 10 | 10 | 无新 Release | Issue 与 PR 双高活跃，集中在 catalogs、tests、parser 稳定性 |
| Apache Spark | 1 | 10 | 无新 Release | PR 持续推进，Issue 更新少，重心偏实现优化与工程治理 |
| Substrait | 0 | 10 | 无新 Release | 无 Issue 更新，主要通过 PR 推进规范演进与审阅收敛 |

### 解读
- **dbt-core**：今天是三者中**社区互动最密集**的项目，Issue 和 PR 同时高活跃，说明既有大量真实用户反馈，也有维护团队快速响应。
- **Spark**：更像典型成熟大项目的节奏，**新增问题不多，但 PR 面持续推进**，重点在性能、兼容性、安全和优化器演进。
- **Substrait**：活跃度主要体现在 **PR 驱动的规范演进**，Issue 面相对平静，说明当前阶段更偏向“标准打磨”而不是“用户问题爆发”。

---

## 3. 共同关注的功能方向

虽然三个项目的定位不同，但今天的动态中仍能看到几个明显的共同方向。

### 3.1 正确性与一致性
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：关注命令之间对 `catalogs.yml` 的一致支持、Core/Fusion 行为对齐、partial parsing 正确性、测试语义稳定性。
- **Spark**：关注 CBO 统计信息传播、SPJ 类型语义、CDC API 统一、依赖版本升级带来的兼容性与安全性。
- **Substrait**：重点澄清 nullability、type binding、URN 合法性、函数返回类型等规范一致性问题。

**共同诉求**：  
用户和开发者都越来越不能接受“某个场景能工作、另一个相近场景却不工作”的行为差异。  
一致性已经成为基础设施竞争力的重要组成部分。

---

### 3.2 开发体验与可诊断性提升
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：希望收集全部 YAML 错误、减少误导性 deprecation、避免底层 `AttributeError` 直接暴露。
- **Spark**：PySpark 连续优化 import time，降低启动成本；同时修复环境变量、路径空格等影响日常使用的细节问题。
- **Substrait**：增加 function impl `description`、修正文档与测试样例，降低实现者理解成本。

**共同诉求**：  
生态正在从“专家可用”走向“团队可规模化使用”，因此报错质量、启动体验、文档自描述能力都变得重要。

---

### 3.3 扩展性与生态集成
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：catalog integration、自定义 `ref` kwargs、OpenTelemetry tracing。
- **Spark**：Spark Connect、CDC DataFrame API、Iceberg/SPJ 相关增强。
- **Substrait**：扩展类型、函数补充、物理算子扩展（如 `TopNRel`）。

**共同诉求**：  
这些项目都在增强自己作为“平台组件”的能力，而不仅是独立工具。  
重点不只是新增功能，而是要更容易嵌入企业数据平台、湖仓体系和跨引擎架构。

---

### 3.4 边界场景稳定性
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：版本化模型、disabled 节点、snapshot-paths、generic test config 非法输入。
- **Spark**：TLS memory leak、warehouse dir 含空格、依赖升级、安全修复。
- **Substrait**：窗口边界、null literal 约束、`any` 类型绑定、返回类型修正。

**共同诉求**：  
社区正在集中补齐“80% 之外”的场景。  
这通常是生态成熟的重要标志：用户规模变大后，边界条件不再是小问题，而是生产事故来源。

---

## 4. 差异化定位分析

## 4.1 dbt-core：面向数据开发与治理的语义层/工程层工具
### 功能侧重
- 测试体系
- 解析器与 DAG 构建
- 命令语义一致性
- 项目配置治理
- 企业级集成能力（catalog、observability）

### 目标用户
- Analytics Engineer
- 数据建模团队
- 负责 CI/CD、规范治理的数据平台团队

### 技术路线
dbt-core 的路线是围绕 **“数据开发工程化”** 演进：  
从 SQL 转换工具继续向 **可测试、可观测、可扩展、可治理的数据构建平台** 发展。

### 今日信号
今天的动态非常明确地显示：  
dbt 正在补齐从 `run/build` 向 `compile/test` 等命令扩展时留下的一致性缺口，同时加强 parser 和 tests 的可靠性。

---

## 4.2 Apache Spark：面向统一计算与执行优化的通用分析引擎
### 功能侧重
- SQL 优化器与统计信息
- 流处理负载均衡
- Python 端启动性能
- CDC / Spark Connect / Lakehouse 集成
- 稳定性与依赖安全治理

### 目标用户
- 数据工程师
- 平台架构师
- Spark 应用/引擎开发者
- 湖仓与流批一体场景用户

### 技术路线
Spark 继续强化自己作为 **统一分析执行引擎** 的定位：  
一方面深挖 Planner/CBO/Streaming 等底层性能，另一方面提升 PySpark 和 Connect 等上层易用性。

### 今日信号
Spark 今天最强的信号不是“大功能发布”，而是**系统性优化**：  
包括 Python 导入链路瘦身、半结构化推断提速、CDC API 扩展、TLS 内存泄漏修复以及依赖安全治理。

---

## 4.3 Substrait：面向跨引擎互操作的查询表示标准
### 功能侧重
- 标准函数定义
- 类型系统扩展
- nullability / binding 规则
- 文档与测试规范
- 物理计划表达能力

### 目标用户
- 查询引擎开发者
- 连接器/适配器开发者
- 标准化与互操作生态参与者

### 技术路线
Substrait 走的是 **“标准先行、语义精炼、跨引擎兼容”** 路线。  
它不直接竞争计算框架或建模工具，而是作为它们之间的协议与语义桥梁。

### 今日信号
今天的 PR 动态显示，Substrait 正从基础逻辑表达继续向 **更完整函数层、扩展类型、物理算子能力** 延展，同时收紧规范歧义。

---

## 5. 社区热度与成熟度

## 5.1 社区活跃度判断
### 最高活跃：dbt-core
- 10 个热点 Issue + 10 个重点 PR
- 同时出现修复、backport、功能增强、行为定义讨论
- 表明用户反馈强、维护响应快、产品面变化密集

### 稳定高活跃：Spark
- Issue 更新少，但 PR 活跃持续
- 更符合成熟大型 ASF 项目的节奏
- 社区重心偏“工程推进”而非“问题爆发”

### 规范驱动活跃：Substrait
- 无活跃 Issue，但 10 个重点 PR
- 多个处于 `[PMC Ready]`
- 说明核心活跃点集中在维护者和实现者之间的规范审阅

---

## 5.2 成熟度判断
### dbt-core：高成熟度 + 快速产品迭代并存
- 已有很强用户基础
- 但测试、parser、命令一致性仍在快速演进
- 呈现“成熟产品进入深水区治理”的特征

### Spark：成熟度最高
- 更新更偏稳健增量
- 重点是性能、兼容性、安全、生态支持
- 显示出大型计算引擎的长期演进节奏

### Substrait：规范成熟度快速提升中
- 仍处于标准边界不断细化阶段
- 很多讨论聚焦“语义到底应该怎么定义”
- 属于**标准体系快速成形期**，尚未完全固化

---

## 6. 值得关注的趋势信号

## 6.1 从“功能覆盖”转向“行为一致性”
无论是 dbt 的命令一致性、Spark 的统计与 API 统一，还是 Substrait 的 nullability/类型绑定规则，今天都体现出一个核心趋势：  
**基础设施产品竞争的重点，正在从“有没有这个功能”转向“这个功能在不同场景下是否一致、稳定、可预测”。**

**对数据工程师的参考价值**：  
选型时不能只看 feature list，要重点评估：
- 不同命令/接口行为是否一致
- 边界场景是否稳定
- 升级是否容易引入语义变化

---

## 6.2 测试、验证、规范化正在成为核心生产力
- dbt 重点强化 unit test / generic data test
- Spark 强化 planner/statistics correctness
- Substrait 强化测试样例与标准语义映射

**行业信号**：  
OLAP 基础设施正在普遍接受一个事实：  
**没有可靠验证体系的性能和功能，最终很难进入企业级生产。**

**建议**：  
数据团队应增加：
- 语义回归测试
- 状态变更检测
- SQL/模型级 CI
- 标准兼容性测试

---

## 6.3 企业级集成能力正在上升为一等诉求
今天三个项目都表现出明显的平台化信号：
- dbt：catalog integration、OpenTelemetry
- Spark：Spark Connect、CDC API、Iceberg/SPJ
- Substrait：扩展类型、物理算子、跨语言标准化

**行业信号**：  
未来 OLAP 组件不再孤立部署，而是要接入：
- 元数据系统
- 观测平台
- 统一查询接口
- 湖仓格式生态
- 远程执行/多引擎架构

**建议**：  
做技术选型时，应优先考虑：
- 可观测性接口
- 标准协议兼容性
- 扩展点是否稳定
- 与现有平台的集成成本

---

## 6.4 Python 与交互式体验仍是 Spark 生态的重要战场
Spark 今天连续多个 PR 聚焦 PySpark import latency，说明 Python 体验依然是生态竞争关键点。

**对数据工程师的参考价值**：  
如果团队大量依赖 Notebook、轻量脚本、交互式调试，未来几个版本的 PySpark 启动优化值得重点关注。  
这会直接影响：
- 开发反馈速度
- 小任务执行体验
- 教学与试验成本

---

## 6.5 标准层正在向“可执行互操作”推进
Substrait 今天不仅在补函数，还在推进 `TopNRel`、窗口边界、多列排序、扩展类型等能力，这说明标准正在从“描述逻辑”走向“支撑更真实的优化器/执行器协作”。

**对平台团队的参考价值**：  
如果你在建设多引擎平台、统一 SQL 网关、查询计划转换层，Substrait 的进展值得持续跟踪。  
它未来可能成为：
- 引擎间计划交换
- 语义验证
- 连接器适配
- 查询联邦层

的重要基础。

---

## 结论

从 2026-03-19 的社区动态看，三大项目分别代表了 OLAP 基础设施的三个关键层次：

- **dbt-core**：数据开发工程化与治理层
- **Spark**：统一执行与计算引擎层
- **Substrait**：跨引擎标准与语义互操作层

三者今天虽然关注点不同，但共同指向同一个行业方向：  
**OLAP 生态正从“工具能力堆叠”迈向“标准化、工程化、平台化”的深度整合阶段。**

对于技术决策者来说，这意味着下一阶段最重要的评估维度不只是性能，而是：
- 一致性
- 可测试性
- 可观测性
- 扩展性
- 与更大平台体系的耦合能力

如果你愿意，我可以继续把这份报告再加工成以下任一种版本：  
1. **管理层 1 页摘要版**  
2. **工程团队重点跟进清单版**  
3. **适合飞书/Slack 发送的 Markdown 简报版**  
4. **带“建议关注优先级”的周报风格版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报（2026-03-19）

> 数据来源：github.com/dbt-labs/dbt-core

## 1. 今日速览

今天 dbt-core 社区的主线非常明确：**catalogs.yml / 自定义 catalog integration 的命令兼容性修复正在快速收敛**，`test` 与 `compile` 相关补丁已合并并启动 backport。与此同时，**测试体系与解析器稳定性**成为另一焦点，围绕 unit tests、generic data tests、partial parsing、版本化模型与 YAML 解析的多个问题/PR同时活跃。  

另外，一个值得关注的产品演进点是：**selector 与命令行选择器组合能力**对应方案已在 PR 中落地并关闭，意味着节点选择能力正继续向更灵活、更可组合的方向发展。

---

## 3. 社区热点 Issues

### 1) #12339 收集 `--warn-error-options` 下的全部错误，而不是首个错误
- **状态**：OPEN  
- **标签**：enhancement, Refinement  
- **为什么重要**：这是典型的**开发体验 / CI 反馈效率**问题。当前将 `NoNodeForYamlKey` 警告升级为错误时，只抛出第一个错误，会拉长修复周期，尤其在大型项目中会导致多轮提交-重跑。  
- **社区反应**：已有 5 条评论，说明问题已进入讨论阶段，但热度尚未完全释放。  
- **影响判断**：如果改进，能明显提升 YAML 校验与治理效率，利好规范化团队。  
- **链接**：dbt-labs/dbt-core Issue #12339

### 2) #12665 Unit Test 在重复名称 + `--threads` 下行为异常
- **状态**：OPEN  
- **标签**：bug, unit tests  
- **为什么重要**：这是一个**并发执行与测试命名唯一性**交叉导致的问题。随着 dbt 单元测试在 CI 中普及，多线程执行是常态，这类问题会直接影响测试结果可靠性。  
- **社区反应**：评论不多，但问题创建后很快获得关注，说明复现性较强。  
- **影响判断**：对采用大规模并行测试的团队尤其重要，属于应优先修复的“正确性”问题。  
- **链接**：dbt-labs/dbt-core Issue #12665

### 3) #12643 是否允许重复 data tests：社区正在“定规则”
- **状态**：OPEN  
- **标签**：bug, enhancement, triage, dbt tests  
- **为什么重要**：这不是单点 bug，而是**产品语义定义问题**。在某次改动后，data tests 可以重名，社区正在讨论这究竟是 feature 还是 bug。  
- **社区反应**：虽评论不多，但这是典型需要 maintainers 明确设计原则的话题。  
- **影响判断**：一旦定性，会影响测试命名规范、manifest 稳定性、并发执行与 IDE/CI 集成。  
- **链接**：dbt-labs/dbt-core Issue #12643

### 4) #12148 Unit tests / generic data tests 未使用自定义 `ref` override
- **状态**：OPEN  
- **标签**：bug  
- **为什么重要**：这是 **Core 与 Fusion 行为不一致** 的代表性问题。对于做高级宏扩展、定制 `ref` 语义的团队，测试环境与运行环境行为不一致会带来很大困扰。  
- **社区反应**：已有对应修复 PR（#12668），说明问题具备明确实现路径。  
- **影响判断**：直接关系到宏可扩展性与测试可信度。  
- **链接**：dbt-labs/dbt-core Issue #12148

### 5) #12666 Partial parsing 在 schema.yml 变更后丢失版本化模型节点
- **状态**：OPEN  
- **标签**：bug, partial_parsing, awaiting_response  
- **为什么重要**：partial parsing 是 dbt 性能优化的重要基础，但其代价是更复杂的缓存失效逻辑。该问题触及**版本化模型 + schema 变更 + 解析缓存**的关键交叉点。  
- **社区反应**：新问题，评论少，但场景非常真实，尤其常见于 dbt Cloud 开发。  
- **影响判断**：若属普遍问题，会显著影响增量开发体验与对 partial parsing 的信任。  
- **链接**：dbt-labs/dbt-core Issue #12666

### 6) #12547 `state:modified` 无法识别 function 资源 YAML 属性变化
- **状态**：OPEN  
- **标签**：bug, backport 1.11.latest  
- **为什么重要**：这关系到 **state-based CI / slim CI** 的准确性。对于使用 function 资源的新能力用户，`.yml` 属性变更未被检测到会导致漏跑。  
- **社区反应**：👍 4，说明虽非大众问题，但对目标用户很关键。  
- **影响判断**：影响变更检测链路的完整性，属于 CI 正确性问题。  
- **链接**：dbt-labs/dbt-core Issue #12547

### 7) #11367 用 OpenTelemetry 做 dbt instrumentation / tracing
- **状态**：OPEN  
- **标签**：enhancement, Refinement  
- **为什么重要**：这是今天最有代表性的**可观测性需求**。dbt 已从单机 CLI 工具走向企业级编排与治理体系，trace 能力将帮助定位编译、解析、执行阶段性能瓶颈。  
- **社区反应**：👍 11，是今天 issues 中点赞最高的一项，说明这类需求得到广泛认可。  
- **影响判断**：中长期战略价值高，尤其适合与数据平台统一观测栈集成。  
- **链接**：dbt-labs/dbt-core Issue #11367

### 8) #11948 disabled model 在 Core parse 时未正确禁用
- **状态**：OPEN  
- **标签**：enhancement, stale, awaiting_response  
- **为什么重要**：再次体现 **Core 与 Fusion 解析行为差异**。如果 disabled 资源在 Core 解析阶段仍参与图构建，会导致编译错误和迁移障碍。  
- **社区反应**：评论有限，但问题本身直指解析器一致性。  
- **影响判断**：对使用 package、source disable、迁移 Fusion/Core 的团队影响较大。  
- **链接**：dbt-labs/dbt-core Issue #11948

### 9) #12117 `snapshot-paths` 包含 `models` 会破坏 ref DAG
- **状态**：OPEN  
- **标签**：bug, stale, awaiting_response  
- **为什么重要**：这是典型的**项目路径配置误用/边界条件**引发的图构建错误。问题一旦出现，直接表现为“依赖节点不在图中”。  
- **社区反应**：👍 3，表明并非孤例。  
- **影响判断**：影响 DAG 正确性，属于配置灵活性与鲁棒性不足的体现。  
- **链接**：dbt-labs/dbt-core Issue #12117

### 10) #12672 还有哪些子命令需要 `@requires.catalogs` 装饰器？
- **状态**：OPEN  
- **标签**：enhancement, triage  
- **为什么重要**：这是对近期一系列 catalog integration 修复的**系统性追问**。不是修一个命令，而是排查整条命令面的一致性。  
- **社区反应**：刚创建，尚无评论，但与 #12663 / #12676 / #12388 等 PR 明显形成主题联动。  
- **影响判断**：这是当前最值得持续跟踪的维护方向之一，可能引出更多 backport。  
- **链接**：dbt-labs/dbt-core Issue #12672

---

## 4. 重要 PR 进展

### 1) #12676 `[Backport 1.11.latest]` 为 `test` 命令补上 `@requires.catalogs`
- **状态**：CLOSED  
- **意义**：这是对 catalog integration 兼容性的**快速 backport 落地**，说明维护团队在积极收敛 1.11 分支的命令一致性问题。  
- **关联价值**：直接呼应 #12662 暴露出的 `dbt test` 与 AWS Glue / Snowflake catalog 集成失败问题。  
- **链接**：dbt-labs/dbt-core PR #12676

### 2) #12663 为 `test` 命令补上 `@requires.catalogs`
- **状态**：CLOSED  
- **意义**：主修复 PR 已合并。此前 `test` 命令未正确解析 catalogs.yml，导致自定义 catalog integration 方案不可用。  
- **影响**：对于接入 REST Catalog / Glue Catalog / 外部 catalog 的团队，这是直接可感知的修复。  
- **链接**：dbt-labs/dbt-core PR #12663

### 3) #12388 为 `compile` 命令补上 `@requires.catalogs`
- **状态**：CLOSED  
- **意义**：`compile` 命令此前同样存在 catalog 感知缺失。该修复和 `test` 修复一起，代表 dbt 正在把 catalog support 从 `run/build` 向更多子命令扩展。  
- **影响**：提升编译与执行阶段的语义一致性。  
- **链接**：dbt-labs/dbt-core PR #12388

### 4) #12582 selector selector method 实现完成
- **状态**：CLOSED  
- **意义**：这是今天最重要的功能演进之一。它解决了 selector 只能通过 `--selector` 或默认 selector 使用的问题，使 YAML selector 能作为更通用的**节点选择方法**参与组合。  
- **关联问题**：直接解决 #5009、#10992。  
- **影响**：大幅增强命令行选择表达能力，利好复杂 DAG 的精细化执行。  
- **链接**：dbt-labs/dbt-core PR #12582

### 5) #12668 在 unit tests 与 generic data tests 中支持自定义 `ref` kwargs
- **状态**：OPEN  
- **意义**：该 PR 对齐 Core 与 Fusion 行为，解决测试体系对自定义 `ref` 宏扩展支持不足的问题。  
- **影响**：对于实现 `ref(..., revision=2)` 等高级模式的团队，测试与运行语义将更一致。  
- **链接**：dbt-labs/dbt-core PR #12668

### 6) #12667 检查全部 config key，并简化 deprecation 逻辑
- **状态**：OPEN  
- **意义**：该 PR 聚焦 `dbt_project.yml` 自定义配置键的校验逻辑，目标是减少误报/漏报并提升 deprecation 提示准确性。  
- **影响**：这类改动虽然“底层”，但对项目治理、升级兼容性和配置规范化非常关键。  
- **链接**：dbt-labs/dbt-core PR #12667

### 7) #12618 修复 generic test 顶层 config key 触发错误 deprecation
- **状态**：OPEN  
- **意义**：当前某些 generic test 配置会触发误导性的弃用警告；该 PR 试图把“真正的问题类型”反馈给用户。  
- **影响**：改善测试配置出错时的可诊断性，降低升级成本。  
- **链接**：dbt-labs/dbt-core PR #12618

### 8) #12670 同步最新 jsonschema 更新，并补充 macros config happy path 测试
- **状态**：CLOSED  
- **意义**：该 PR 将 jsonschema 宏配置与 Fusion 侧“事实标准”对齐，并消除之前的假阳性 deprecation。  
- **影响**：体现 Core/Fusion 对齐工作的推进，同时增强回归测试覆盖。  
- **链接**：dbt-labs/dbt-core PR #12670

### 9) #12671 修复 `update_semantic_model` 在 `depends_on_nodes` 为空时的 IndexError
- **状态**：OPEN  
- **意义**：这是一个典型的**边界条件健壮性修复**。虽然看似小问题，但语义模型链路上的异常通常会影响较深。  
- **影响**：利好 semantic model 相关能力的稳定性。  
- **链接**：dbt-labs/dbt-core PR #12671

### 10) #12673 / #12674 / #12677 一组解析健壮性修复
- **状态**：OPEN  
- **意义**：这三项 PR 都聚焦于**Jinja / docs / 测试配置序列化的异常输入处理**：  
  - #12673：`doc()` 非常量参数导致 AttributeError  
  - #12674：generic test config 为非 dict 标量时导致 AttributeError  
  - #12677：`msgpack_encoder` 处理 `jinja2.Undefined`  
- **影响**：说明维护团队正在集中修补 parser/encoder 的脆弱边界，提升面对“非理想输入”时的稳定性。  
- **链接**：  
  - dbt-labs/dbt-core PR #12673  
  - dbt-labs/dbt-core PR #12674  
  - dbt-labs/dbt-core PR #12677  

---

## 5. 功能需求趋势

### 1) Catalog integration 正在从“局部支持”走向“命令全覆盖”
从 `compile`、`test` 到新 issue #12672，社区明显在追问：**所有子命令是否都正确加载并传递 catalogs.yml 上下文？**  
这说明 dbt-core 正逐步适配更复杂的元数据/catalog 架构，而不再局限于传统单 catalog 场景。

### 2) 测试体系成为活跃改进区
近期高频问题集中在：
- unit tests 与 generic data tests 的行为一致性
- 重名测试的处理语义
- 并发执行下的稳定性
- `--empty`、自定义 `ref`、配置校验等边界问题

这反映出 dbt 正从“转换工具”进一步演化为**可测试的数据开发平台**，测试 UX 和正确性成为核心诉求。

### 3) Core 与 Fusion 行为对齐仍是持续主题
多个 issue/PR都提到：
- Fusion 可以正常工作，但 Core 不行
- 需要同步 Fusion 的 schema/jsonschema/config 逻辑
- 测试与解析在两个引擎间存在差异

这意味着社区对**引擎一致性**的期待持续升高。

### 4) 解析器健壮性与 partial parsing 可靠性越来越重要
最近活跃问题中，schema.yml 变更、disabled 节点、docs block、版本化模型、路径配置等都在挑战 parser 边界。  
这说明用户项目规模和复杂度增长后，**解析正确性与缓存失效机制**正成为基础设施层面的关键议题。

### 5) 可观测性开始进入产品诉求主流
OpenTelemetry issue 获得最高点赞，表明企业用户已不满足于“执行成功/失败”级别反馈，而是希望把 dbt 纳入统一 tracing / observability 体系。

---

## 6. 开发者关注点

### 1) 命令一致性不足
开发者最直接的痛点之一是：不同子命令对同一配置（特别是 catalogs.yml、自定义 catalog integration）的支持不一致。  
这会造成“run 可以、compile/test 不行”的割裂体验。

### 2) 测试结果的确定性与可维护性
围绕 unit tests / data tests 的重复命名、并发执行、空跑建表、自定义 `ref` 支持等问题，说明大家非常在意：
- 测试是否可靠
- 命名与组织是否可扩展
- CI 是否稳定
- 测试语义是否与生产执行一致

### 3) 错误信息需要更“可修复”
多个 issue/PR都在指向同一件事：  
**不是不能报错，而是要报得完整、准确、可操作。**  
包括：
- 只报第一个错误的问题
- 错误 deprecation 类型
- AttributeError 这类底层异常泄漏给用户

### 4) 复杂项目配置下的图构建鲁棒性
disabled 资源、snapshot-paths、版本化模型、function 资源 state 检测等问题，都说明大型项目更容易踩到 DAG / parser 的边界。  
用户希望 dbt 在复杂配置和增量变更场景下依然稳定可预测。

### 5) 企业级扩展能力
OpenTelemetry、自定义 `ref` kwargs、catalog integration 等需求反映出，开发者正在把 dbt 接入更大的平台体系中。  
他们需要的不只是“能跑”，而是：
- 能观测
- 能扩展
- 能集成
- 能在不同执行模式下保持一致

---

如果你愿意，我还可以继续把这份日报补充成更适合团队内部转发的版本，例如：
1. **“管理层摘要版”**（更短，突出风险与趋势）
2. **“工程师重点跟进版”**（附建议关注的 issue/PR 清单）
3. **“Markdown 可直接发飞书/Slack 版”**。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时内，Spark 仓库**没有新 Release 发布**，社区活跃度主要集中在 **PR 持续推进**，尤其是 **SQL 优化、PySpark 启动/导入性能、Streaming 内存流负载均衡** 等方向。  
Issue 层面仅有 1 条更新，但它直指 **Derby 与 Hive 依赖升级及安全漏洞治理**，反映出社区对 **依赖栈安全性与版本兼容性** 的持续关注。

---

## 2. 社区热点 Issues

> 注：过去 24 小时内更新的 Issue 仅 1 条，以下按“今日最值得关注”列出该 Issue。

### 1) Derby / Hive 依赖版本升级与安全修复
- **Issue**: #54563 [OPEN] Update Derby and Hive version  
- **链接**: apache/spark Issue #54563
- **为什么重要**:  
  该问题直接关联 Spark 内置依赖的安全性。提问者指出 **Derby 10.16.1.1 存在已知 CVE**，而 10.17.1.0 已修复；同时也关注 **Hive 版本是否有升级计划**。这类问题对发行版打包、嵌入式元数据仓库、兼容性测试都有现实影响。
- **社区反应**:  
  当前评论数不高，仅 1 条，但这是典型的“**影响面广、讨论可能后续升温**”的问题：一旦涉及依赖升级，往往会牵动 CI、生态兼容性及回归测试。
- **关键信号**:  
  Spark 社区近期不仅在推进功能演进，也在面对 **基础依赖安全债务** 的治理需求。

---

## 3. 重要 PR 进展

以下挑选 10 个最值得数据工程师和 Spark 开发者关注的 PR。

### 1) LowLatencyMemoryStream 负载均衡改进
- **PR**: #54848 [OPEN] [SPARK-56023][SS] Better load balance in LowLatencyMemoryStream  
- **链接**: apache/spark PR #54848
- **内容**:  
  面向 Structured Streaming 的 `LowLatencyMemoryStream` 做负载均衡优化。
- **意义**:  
  这类改动通常会改善低延迟场景下的数据分发均匀性，减少热点分区或局部拥塞，对流式测试框架和低时延处理链路都有价值。

### 2) PySpark 隔离 memory_profiler 以降低 import 开销
- **PR**: #54895 [OPEN] [SPARK-56062][PYTHON] Isolate memory_profiler to improve import time  
- **链接**: apache/spark PR #54895
- **内容**:  
  将 `memory_profiler` 从主导入路径中隔离，优化 PySpark 模块加载时间。
- **意义**:  
  这是非常明确的 **开发体验优化**。对 CLI 启动、Notebook 冷启动、短任务脚本都能带来更轻的导入成本。

### 3) PySpark 懒加载 numpy，加速启动
- **PR**: #54896 [OPEN] [SPARK-56066][PYTHON] Lazy import numpy to improve import speed  
- **链接**: apache/spark PR #54896
- **内容**:  
  将 `numpy` 调整为按需导入。
- **意义**:  
  与上一个 PR 形成连续动作，说明社区正系统性优化 **PySpark import path**。这对 Spark Python 用户尤其重要，因为 import 延迟是长期痛点之一。

### 4) PySpark 懒加载 psutil，加速启动
- **PR**: #54897 [OPEN] [SPARK-56067][PYTHON] Lazy import psutil to improve import speed  
- **链接**: apache/spark PR #54897
- **内容**:  
  将 `psutil` 也从默认导入链路中延迟加载。
- **意义**:  
  结合 `numpy`、`memory_profiler` 的改动，Spark 正在从多个第三方依赖点同时收紧启动时延，体现出 **PySpark 轻量化** 趋势。

### 5) toPandas 移除空表 workaround
- **PR**: #53824 [OPEN] [SQL, PYTHON] [SPARK-55059][PYTHON] Remove empty table workaround in toPandas  
- **链接**: apache/spark PR #53824
- **内容**:  
  移除 `_convert_arrow_table_to_pandas()` 中针对空表的兼容绕过逻辑。
- **意义**:  
  该 PR 说明先前依赖的 Arrow 相关问题可能已被修复，Spark 希望回归更标准的 `PyArrow to_pandas()` 路径。对 Arrow/Pandas 互操作稳定性是积极信号，也有助于减少特殊分支维护成本。

### 6) SPJ 分区键 Reducer 增加类型返回能力
- **PR**: #54884 [OPEN] [SPARK-56046][SQL] Typed SPJ partition key `Reducer`s  
- **链接**: apache/spark PR #54884
- **内容**:  
  为 SPJ（Storage Partitioned Join）分区键 reducer 引入类型返回方法。
- **意义**:  
  这是典型的 **SQL Planner / Join 优化基础设施增强**。摘要提到与 Iceberg SPJ 测试相关，说明此改动将提升 Spark 与现代表格式生态在分区裁剪、分区感知 Join 上的协同能力。

### 7) Variant shredding 的 schema 推断性能优化
- **PR**: #54343 [OPEN] [SPARK-55568][SQL] Separate schema construction from field stats collection  
- **链接**: apache/spark PR #54343
- **内容**:  
  将 schema 构建与字段统计收集分离，避免在 variant shredding 推断时频繁做昂贵的 schema merge。
- **意义**:  
  该 PR 直指 **半结构化数据推断性能**。摘要指出单文件可节省 100ms 级别成本，对大规模文件扫描、JSON/Variant 类工作负载会非常关键。

### 8) 修复 TLS 内存泄漏
- **PR**: #54894 [OPEN] [SPARK-56057] Fix TLS Memory Leak  
- **链接**: apache/spark PR #54894
- **内容**:  
  修复 TLS 相关内存泄漏问题。
- **意义**:  
  虽然摘要信息有限，但内存泄漏类问题通常优先级高，尤其在长生命周期 executor / driver、服务化 Spark 环境中，会直接影响稳定性与资源利用率。

### 9) CBO 中 Union 传播 distinctCount
- **PR**: #54883 [OPEN] [SPARK-56047][SQL] Propagate distinctCount through Union in CBO statistics estimation  
- **链接**: apache/spark PR #54883
- **内容**:  
  在代价优化器中，让 `UnionEstimation` 继续传播 `distinctCount`。
- **意义**:  
  这是 **CBO 统计信息质量** 的实质增强。统计信息更完整，意味着 Join Reorder、聚合、过滤选择率估计等决策更准确，最终可能改善执行计划质量。

### 10) CDC 查询增加 DataFrame API 与 Spark Connect 支持
- **PR**: #54739 [OPEN] [SPARK-55949][SQL] Add DataFrame API and Spark Connect support for CDC queries  
- **链接**: apache/spark PR #54739
- **内容**:  
  为 CDC 框架增加 `changes()` DataFrame API，以及 Spark Connect 支持。
- **意义**:  
  这是今天最值得关注的产品级能力之一。它表明 Spark 正把 **CDC 查询能力** 从底层框架继续向上推进到统一 API 和远程连接场景，有望增强流批一体与 Lakehouse 变更消费体验。

---

## 4. 功能需求趋势

结合今日更新的 Issue 与 PR，可以提炼出以下几个社区关注方向：

### 1) PySpark 启动与开发体验优化
- 典型 PR：#54895、#54896、#54897、#54840  
- 趋势判断：  
  社区正在系统优化 PySpark 的 **import latency**、工具链与代码格式化体验。对于 Notebook、交互分析、轻量脚本执行场景，这类优化价值很高。

### 2) SQL 优化器与统计信息质量提升
- 典型 PR：#54883、#54884、#54343  
- 趋势判断：  
  Spark SQL 持续加强 **CBO、分区感知 Join、半结构化 schema 推断**。这说明社区仍在深挖执行计划质量与 Lakehouse 读写性能。

### 3) 湖仓与生态集成能力增强
- 典型 PR：#54739、#54884、#54780  
- 趋势判断：  
  CDC、Iceberg 相关 SPJ、Geo Types/SRID 支持等都说明 Spark 正继续拓展作为 **统一分析引擎** 的生态适配边界。

### 4) 稳定性与基础设施治理
- 典型 Issue/PR：#54563、#54894、#54800、#54794  
- 趋势判断：  
  依赖升级、安全漏洞修复、内存泄漏治理、环境变量解析及路径兼容性问题，说明社区对“**工程化可用性**”保持高关注，而不仅是新增功能。

### 5) 可观测性与易用性增强
- 典型 PR：#54762、#54834  
- 趋势判断：  
  UI 导出配置、基准测试脚本便捷化等细节改动，体现出 Spark 对 **运维可视化、性能评估便利性** 的持续投入。

---

## 5. 开发者关注点

### 1) Python 端冷启动慢、依赖导入重
从多个并行 PR 看，开发者对 **PySpark 导入慢** 的痛点反馈非常集中。`numpy`、`psutil`、`memory_profiler` 被连续处理，说明这已不是单点问题，而是需要整体梳理的启动链路问题。

### 2) 查询优化依赖更准确的统计信息
`distinctCount` 在 `Union` 中传播、SPJ reducer 类型化、variant schema 推断重构，这些都指向一个核心诉求：**让优化器掌握更可靠、更低成本的元信息**，从而提升复杂查询场景的稳定收益。

### 3) 半结构化与变更数据场景持续升温
CDC API、Variant shredding、Geo 类型扩展，说明开发者越来越关注 Spark 在 **Lakehouse、事件变更消费、半结构化分析** 上的原生能力，而不只是传统批处理。

### 4) 安全与兼容性问题不容忽视
Derby/Hive 版本升级 Issue 很具代表性。社区用户不仅关心新特性，也在关注 **默认依赖是否存在 CVE、升级是否影响现有生态兼容**。这类问题通常会影响企业采用信心。

### 5) 细节兼容性仍影响生产可用性
例如：
- `SPARK_CONNECT_MODE` 解析修复：#54800  
- warehouse dir 含空格场景修复：#54794  
这类问题虽然不“炫技”，但对真实生产环境非常关键，反映出开发者希望 Spark 在边界场景下更稳健。

---

## 附：今日重点链接速查

- Issue #54563 Update Derby and Hive version  
  链接: apache/spark Issue #54563

- PR #54848 Better load balance in LowLatencyMemoryStream  
  链接: apache/spark PR #54848

- PR #54895 Isolate memory_profiler to improve import time  
  链接: apache/spark PR #54895

- PR #54896 Lazy import numpy to improve import speed  
  链接: apache/spark PR #54896

- PR #54897 Lazy import psutil to improve import speed  
  链接: apache/spark PR #54897

- PR #53824 Remove empty table workaround in toPandas  
  链接: apache/spark PR #53824

- PR #54884 Typed SPJ partition key Reducers  
  链接: apache/spark PR #54884

- PR #54343 Separate schema construction from field stats collection  
  链接: apache/spark PR #54343

- PR #54894 Fix TLS Memory Leak  
  链接: apache/spark PR #54894

- PR #54883 Propagate distinctCount through Union in CBO statistics estimation  
  链接: apache/spark PR #54883

- PR #54739 Add DataFrame API and Spark Connect support for CDC queries  
  链接: apache/spark PR #54739

如果你愿意，我还可以继续把这份日报整理成更适合公众号/邮件发送的 **Markdown 模板版**，或者输出成 **“面向管理层的 5 条摘要版”**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-19）

## 1. 今日速览

过去 24 小时内，Substrait 主仓库没有新 Release、也没有活跃 Issue 更新，社区讨论重心主要集中在 Pull Request 审阅与规范细化上。  
今天最值得关注的方向包括：**函数语义补全与修正、空值/类型绑定规则澄清、物理计划能力扩展（TopNRel）、以及窗口函数与扩展类型等规范演进**。  
整体来看，项目当前处于**规范打磨与兼容性增强并行推进**阶段，多个 PR 已进入 `[PMC Ready]` 状态，显示部分改动已接近决策或合并窗口。

---

## 2. 重要 PR 进展

> 过去 24 小时内更新的 PR 共 10 条，以下全部列为今日重点。

### 1) PR #987：新增 `has_overlap` 列表函数
- **状态**：OPEN  
- **作者**：@benbellick  
- **重要性**：为列表类型补充常见集合判定能力，可直接判断两个 list 是否存在交集。  
- **内容摘要**：新增 `has_overlap` 标量函数，并明确将其放入 `functions_list.yaml`，而非 `functions_set.yaml`，体现出按**操作对象类型**而非语义类别来组织函数定义的思路。  
- **意义**：这类函数有助于提升 Substrait 对半结构化/复杂类型表达能力，方便引擎之间统一 list 语义。  
- **链接**：https://github.com/substrait-io/substrait/pull/987

### 2) PR #989：修正测试用例中的 null literal 可空性约束
- **状态**：OPEN `[PMC Ready]`  
- **作者**：@benbellick  
- **重要性**：直接影响函数测试是否符合扩展 YAML 中的 nullability 规则，是规范一致性问题。  
- **内容摘要**：要求测试中的 null literal 严格遵守函数定义里的空值传播规则，覆盖 `MIRROR` 与 `DECLARED_OUTPUT` 等模式。  
- **意义**：这会提升测试基线质量，减少实现方因样例不严谨而产生的歧义。对各语言 SDK、验证器和执行引擎都很关键。  
- **链接**：https://github.com/substrait-io/substrait/pull/989

### 3) PR #932：窗口函数边界改为必填，并支持多列 order-by
- **状态**：OPEN `[Stale]`  
- **作者**：@benbellick  
- **重要性**：这是一个**带 BREAKING CHANGE** 的规范级调整。  
- **内容摘要**：取消窗口函数 binding 中边界默认值，同时扩展支持多个 `order-by` 列。  
- **意义**：一方面增强窗口语义表达能力，另一方面通过取消默认行为降低歧义；但会对现有实现与计划兼容性带来影响，因此值得重点评估。  
- **链接**：https://github.com/substrait-io/substrait/pull/932

### 4) PR #881：澄清合法 URN 规则
- **状态**：OPEN  
- **作者**：@benbellick  
- **重要性**：属于跨语言互操作的基础规范问题。  
- **内容摘要**：针对 Java、Python、Go 等实现对 `urn` 解析存在“恰好两个冒号”的隐含假设，补充文档澄清有效 URN 的规则与边界。  
- **意义**：这类文档修正虽然不直接新增功能，但对生态兼容性影响很大，能减少不同实现之间的解析分歧。  
- **链接**：https://github.com/substrait-io/substrait/pull/881

### 5) PR #1013：为函数实现增加可选 `description` 字段
- **状态**：OPEN `[PMC Ready]`  
- **作者**：@benbellick  
- **重要性**：增强扩展函数 schema 的可读性与文档表达能力。  
- **内容摘要**：允许在单个 function impl 层面增加 `description` 字段，并以 `count` 的多实现合并为示例。  
- **意义**：有助于扩展 YAML 变得更自描述，便于生成文档、做实现映射和审阅复杂函数重载。  
- **链接**：https://github.com/substrait-io/substrait/pull/1013

### 6) PR #1009：新增 `TopNRel` 物理算子，支持 `WITH TIES`
- **状态**：OPEN  
- **作者**：@jcamachor  
- **重要性**：这是今天最值得关注的**物理计划能力扩展**之一。  
- **内容摘要**：在 `algebra.proto` 中加入 `TopNRel`，作为结合排序与 fetch 的物理关系节点，并支持 `WITH TIES`、offset 等能力。  
- **意义**：填补现有物理关系文档与 protobuf 定义之间的空白，提升 Substrait 表达 Top-N 物理执行意图的精度，对查询优化器和执行器都很有价值。  
- **链接**：https://github.com/substrait-io/substrait/pull/1009

### 7) PR #960：澄清 nullability binding 与 `any` 类型参数的交互
- **状态**：OPEN  
- **作者**：@benbellick  
- **重要性**：这是规范精细化的重要一环，关系到函数重载、类型推导和实现一致性。  
- **内容摘要**：文档化 `MIRROR`、`DECLARED_OUTPUT`、`DISCRETE` 等 nullability 模式与 `any[\d]` 类型绑定的交互，并加入具体示例。  
- **意义**：对实现函数签名解析器、类型检查器和验证器的开发者尤其重要，可显著降低“看似匹配、实际不兼容”的边界问题。  
- **链接**：https://github.com/substrait-io/substrait/pull/960

### 8) PR #953：新增无符号整数扩展类型 `u8/u16/u32/u64`
- **状态**：OPEN `[PMC Ready]`  
- **作者**：@kadinrabo  
- **重要性**：扩展类型系统能力，是面向更广泛引擎适配的重要补充。  
- **内容摘要**：通过独立 `unsigned_integers.yaml` 定义无符号整数扩展类型，并补充加减乘除等算术函数及测试覆盖。  
- **意义**：许多执行引擎、文件格式或底层系统具备无符号类型支持，此 PR 有助于缩小 Substrait 与实际系统类型系统之间的差距。  
- **链接**：https://github.com/substrait-io/substrait/pull/953

### 9) PR #945：新增 `current_date` / `current_timestamp` / `current_timezone`
- **状态**：OPEN `[PMC Ready]`  
- **作者**：@nielspardon  
- **重要性**：补齐执行上下文相关函数，是 SQL 方言与运行时上下文映射中的高频需求。  
- **内容摘要**：引入三个与当前会话/系统时间上下文相关的函数。  
- **意义**：这些函数是数据库与查询引擎中的常用内建能力，纳入规范后可提升 Substrait 表达日常查询逻辑的完整性。  
- **链接**：https://github.com/substrait-io/substrait/pull/945

### 10) PR #1007：修正 `add:date_iyear` 返回类型
- **状态**：CLOSED  
- **作者**：@nielspardon  
- **重要性**：这是一次已关闭的**破坏性修复**，说明社区正在及时纠正规范错误。  
- **内容摘要**：将 `add:date_iyear` 的返回类型从 `timestamp` 更正为 `date`。  
- **意义**：该修复避免了日期与年月间隔运算的类型语义错误，对函数签名实现、测试和下游适配都有直接影响。  
- **链接**：https://github.com/substrait-io/substrait/pull/1007

---

## 3. 社区热点 Issues

过去 24 小时内 **没有 Issue 更新**，因此今天暂无可列出的“社区热点 Issues”。  
从日报视角看，这通常意味着当前协作活动更集中在**已提交 PR 的规范讨论、审阅与收敛**，而非新增问题反馈。

---

## 4. 功能需求趋势

虽然今天没有活跃 Issue 更新，但从当前 PR 动向中，仍可提炼出社区近期最关注的功能方向：

### 1) 函数语义补全与一致性增强
- 代表 PR：#987、#945、#1007  
- 趋势判断：社区持续补齐常见内建函数，并及时修正已有函数定义错误。  
- 说明：这反映出 Substrait 正在朝“**更完整、更可落地的标准函数层**”演进。

### 2) 空值传播、类型绑定与测试规范收紧
- 代表 PR：#989、#960  
- 趋势判断：nullability 与类型参数匹配仍是实现者最易出错的领域。  
- 说明：社区正在优先消除规范中的模糊空间，以减少跨引擎行为不一致。

### 3) 物理计划表达能力扩展
- 代表 PR：#1009、#932  
- 趋势判断：Substrait 不仅在完善逻辑层函数，也在推进更细粒度的物理算子表达。  
- 说明：Top-N、窗口函数边界、多列排序等能力，说明生态对**优化器/执行器级互通**需求在上升。

### 4) 扩展类型系统建设
- 代表 PR：#953  
- 趋势判断：社区希望通过 extension types 机制覆盖更多实际数据库类型。  
- 说明：无符号整数是一个典型切入点，未来可能继续扩展到更多厂商或引擎特有类型。

### 5) 文档与元数据可读性提升
- 代表 PR：#881、#1013  
- 趋势判断：除了“能表达”，社区也越来越重视“**如何被正确理解与实现**”。  
- 说明：URN 规则澄清、函数实现 description 增强，都服务于文档生成、生态对接和开发者体验。

---

## 5. 开发者关注点

结合今日 PR 变化，可以总结出开发者当前的几个高频痛点：

### 1) 规范边界仍需进一步消歧
- 体现在 URN 解析、nullability 规则、`any` 类型绑定等方面。  
- 开发者最担心的问题不是“没功能”，而是“同一规范被不同实现读出不同结果”。

### 2) 测试样例必须严格映射规范
- PR #989 表明，测试数据本身若对 nullability 表达不准确，会反向放大生态误解。  
- 对实现者来说，**测试即规范补充**，因此测试正确性非常关键。

### 3) 物理层表达正在成为新焦点
- `TopNRel` 和窗口函数相关变更说明，开发者不再满足于仅传递逻辑计划语义。  
- 越来越多需求开始指向**执行意图、排序规则、边界行为**等更贴近优化器/执行器的问题。

### 4) 类型系统与现实系统的贴合度
- 无符号整数扩展反映出，开发者希望 Substrait 能更自然映射到底层数据库、文件格式和计算引擎。  
- 这类需求通常来自实际集成中的“最后一公里”问题。

### 5) 函数定义需要更强自描述能力
- 给 function impl 增加 `description`，说明维护者和实现者都需要更细粒度的语义注释。  
- 当函数重载增多后，单靠名字和签名已不足以支撑高质量互操作。

---

## 附：今日关注链接汇总

- PR #987 `has_overlap`：https://github.com/substrait-io/substrait/pull/987
- PR #989 null literal 可空性修复：https://github.com/substrait-io/substrait/pull/989
- PR #932 窗口函数边界/多列排序：https://github.com/substrait-io/substrait/pull/932
- PR #881 URN 文档澄清：https://github.com/substrait-io/substrait/pull/881
- PR #1013 function impl description：https://github.com/substrait-io/substrait/pull/1013
- PR #1009 TopNRel：https://github.com/substrait-io/substrait/pull/1009
- PR #960 nullability 与 any 绑定：https://github.com/substrait-io/substrait/pull/960
- PR #953 无符号整数扩展类型：https://github.com/substrait-io/substrait/pull/953
- PR #945 current_* 函数：https://github.com/substrait-io/substrait/pull/945
- PR #1007 `add:date_iyear` 返回类型修复：https://github.com/substrait-io/substrait/pull/1007

如果你愿意，我还可以继续把这份日报整理成：
1. **适合公众号/飞书的短版摘要**，或  
2. **面向技术负责人汇报的“风险与机会”版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*