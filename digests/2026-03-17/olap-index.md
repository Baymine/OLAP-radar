# OLAP 生态索引日报 2026-03-17

> 生成时间: 2026-03-17 01:25 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告  
**日期：2026-03-17**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个非常明确的信号：**社区关注点正从“新增能力”转向“正确性、可观测性、配置一致性与工程化体验”**。  
dbt-core 的讨论集中在 snapshot 正确性、测试表达力、依赖管理与配置语义；Spark 则把重心放在 SQL/Catalyst 正确性、UI/指标可观测性、Streaming 状态恢复和 Python 工具链；Substrait 虽然活动较少，但仍在持续打磨规范语义，以提升跨引擎实现一致性。  
整体看，OLAP 基础设施正在进入 **深水区优化阶段**：不是简单拼功能，而是补齐生产级使用中的边界条件、可维护性和跨组件协同能力。  
这意味着，对技术团队而言，未来的选型重点将越来越偏向：**系统是否可预测、可调试、可治理，而不仅是是否“功能齐全”**。

---

## 2. 各项目活跃度对比

| 项目 | 今日活跃 Issues 数 | 今日更新 PR 数 | Release 情况 | 活跃主题 |
|---|---:|---:|---|---|
| dbt-core | 10 | 6 | 无新 Release | snapshots、tests、配置语义、依赖管理、日志 |
| Apache Spark | 1 | 10 | 无新 Release | SQL 正确性、Catalog 一致性、UI/Explain、Streaming、PySpark |
| Substrait | 0 | 1 | 无新 Release | 规范文档、函数参数语义澄清 |

### 简要解读
- **dbt-core**：Issue 侧明显更活跃，说明用户反馈面广，社区正在围绕大量真实生产问题持续打磨。
- **Spark**：PR 活跃度最高，说明核心开发仍非常强劲，更多工作集中在实现推进与工程质量修复。
- **Substrait**：整体较平稳，符合规范型项目特征，变化频率低，但单次改动对生态兼容性影响可能较大。

---

## 3. 共同关注的功能方向

虽然三个项目定位不同，但从当天动态中仍能抽出几条共同的关注主线。

### 3.1 正确性与语义一致性
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：snapshot 重复行、merge 前唯一性校验、重复列 warning、重复 test 语义边界。
- **Spark**：`dropDuplicates + exceptAll` 导致 internal error，Catalog/function registry 缓存一致性，Spark Connect 重复列名反序列化修复。
- **Substrait**：澄清 enumeration arguments 与 options 的区别，避免函数 binding 和实现歧义。

**共同诉求**：  
社区都在强化“行为必须可预测且语义清晰”，尤其是在边界条件、复杂组合场景和跨组件实现中，避免 silent failure 或 internal error。

---

### 3.2 可观测性与问题定位能力
**涉及项目：dbt-core、Spark**

- **dbt-core**：Better Logging、错误上下文增强、execute mode / env var 等信息可见性。
- **Spark**：SQL plan visualization 支持排序、GroupPartitions UI/文本展示优化、state store 云端加载指标。

**共同诉求**：  
系统不仅要“执行”，还要能解释“为什么这么执行、为什么失败、哪里慢、哪里异常”。

---

### 3.3 工程化与生产可运维性
**涉及项目：dbt-core、Spark**

- **dbt-core**：`state:modified` 恢复对 vars 变更识别、`packages.yml` 变更后自动失效、seed 大小上限可配置。
- **Spark**：Streaming AutoSnapshotRepair 阈值调整、云存储状态恢复指标补齐、Python benchmark 工具链改进。

**共同诉求**：  
围绕 CI/CD、恢复能力、回归验证、参数可配置性和生产稳定性，生态都在增强“工程可用性”。

---

### 3.4 配置/元数据管理复杂度上升
**涉及项目：dbt-core、Spark、Substrait（间接）**

- **dbt-core**：配置拆分、CLI 与项目配置优先级、`env_var(None)`、配置 merge 语义。
- **Spark**：Catalog 缓存失效、session view qualified name、对象解析边界。
- **Substrait**：函数参数模型定义更清晰，实质上也是元数据语义层治理。

**共同诉求**：  
随着系统规模扩大，配置和元数据不再只是“静态声明”，而成为影响正确性和易用性的核心层。

---

## 4. 差异化定位分析

### 4.1 dbt-core：数据建模与治理体验平台
- **功能侧重**：数据建模、测试、snapshot、依赖管理、配置治理、开发者体验。
- **目标用户**：分析工程师、数据工程师、现代数据栈团队、以 SQL 为核心的 BI/建模团队。
- **技术路线**：以声明式项目配置和 DAG 编排为核心，强调 SQL 资产管理、可复用性、可测试性和 CI 集成。

**特点**：  
dbt-core 当前最突出的特征是从“SQL 转换工具”进一步演进为“数据开发工程平台”。社区关注点高度贴近实际生产工作流，如变更检测、配置语义、日志定位与依赖缓存。

---

### 4.2 Apache Spark：统一计算引擎与执行平台
- **功能侧重**：SQL 引擎、分布式执行、Structured Streaming、Spark Connect、PySpark、UI 与性能诊断。
- **目标用户**：大规模数据平台团队、流批一体场景、数据科学与机器学习工程团队、云上分布式计算用户。
- **技术路线**：统一批流计算引擎，围绕 Catalyst、Tungsten、Streaming 状态管理和多语言接口持续演进。

**特点**：  
Spark 的社区重点明显更偏底层引擎质量和平台能力建设。相比 dbt 更靠近“开发工作流”，Spark 更靠近“执行内核与平台运行时”。

---

### 4.3 Substrait：跨引擎互操作规范层
- **功能侧重**：查询计划表示、函数签名与语义标准化、跨系统兼容。
- **目标用户**：查询引擎实现者、数据库内核开发者、计划交换层、执行器/优化器生态。
- **技术路线**：通过中立规范描述计划与函数语义，使不同引擎之间更容易交换和理解执行计划。

**特点**：  
Substrait 不追求高频产品功能发布，而更像生态“协议层”。活跃度看似不高，但其规范细节会影响 Arrow、DuckDB、Velox、Spark Connect 类场景中的跨引擎协同。

---

## 5. 社区热度与成熟度

### 社区活跃度
按当天数据看：

1. **dbt-core**：Issue 活跃度最高  
   - 10 条热点 Issue，覆盖 snapshot、tests、配置、依赖、日志等多个方向。
   - 说明用户反馈非常密集，产品已广泛进入生产复杂场景。

2. **Spark**：PR 活跃度最高  
   - 10 条重要 PR，覆盖 SQL、UI、Streaming、Python、Connect。
   - 说明核心开发投入持续强劲，工程推进节奏快。

3. **Substrait**：活动较低但稳定  
   - 0 Issue、1 PR，符合规范项目节奏。
   - 其成熟度更多体现为“谨慎演进”而非“高频提交”。

---

### 成熟度判断
- **dbt-core：高成熟度 + 快速工程化迭代**
  - 功能体系已成熟，当前主要矛盾是边界场景、配置复杂度和可运维性。
  - 属于“成熟产品进入精细化治理阶段”。

- **Spark：高成熟度 + 持续深度演进**
  - 核心引擎成熟，但仍持续在 SQL 正确性、流恢复、工具链和 UI 上快速优化。
  - 属于“成熟基础设施长期深耕阶段”。

- **Substrait：规范型成熟早期到中期**
  - 仍在定义与澄清语义边界，说明生态共识在形成中。
  - 属于“低频但关键、标准驱动型演进阶段”。

---

## 6. 值得关注的趋势信号

### 6.1 “正确性优先”正在替代“功能优先”
无论是 dbt 的 snapshot 重复行、Spark 的 internal error，还是 Substrait 的函数语义澄清，都表明行业关注点正在向 **结果正确、边界清晰、错误可预期** 收敛。  
**对数据工程师的意义**：选型和升级时，不能只看新特性，更要看社区对 correctness bug 的响应速度和修复质量。

---

### 6.2 可观测性已成为基础设施竞争力
dbt 在补日志上下文，Spark 在增强 UI/Explain/metrics。  
这意味着 OLAP 基础设施的竞争，不再只是执行能力，也包括：  
- 出错时是否容易定位  
- 慢查询是否容易解释  
- 流状态恢复是否可观测

**参考价值**：  
团队在评估平台时，应把可调试性、指标完备性、错误信息质量纳入核心标准。

---

### 6.3 配置与元数据语义会成为下一阶段复杂度中心
dbt 的配置优先级和拆分治理、Spark 的 Catalog 与 session view、Substrait 的参数定义，都在说明同一件事：  
**随着系统规模变大，最难的往往不是算子本身，而是配置和元数据语义是否一致。**

**参考价值**：  
架构设计时应优先控制配置层复杂度，建立明确的命名、依赖和覆盖规则，否则工具本身越强，维护成本可能越高。

---

### 6.4 CI/CD、增量执行与恢复能力越来越关键
dbt 的 `state:modified`、deps 失效问题，Spark 的 Streaming 自动恢复与状态拉取指标，都反映出社区已在围绕“持续交付”和“异常恢复”优化。  
**参考价值**：  
现代数据平台建设重点正在从“开发功能”延伸到“自动化变更管理”和“线上恢复机制”。这对企业级数据团队尤为重要。

---

### 6.5 生态分层正在更加清晰
- **dbt-core**：偏数据开发与治理层  
- **Spark**：偏执行与运行时层  
- **Substrait**：偏标准与互操作层  

**参考价值**：  
未来 OLAP 体系很可能进一步走向分层协作：  
- 上层用 dbt 管理模型与质量  
- 中层用 Spark 承担批流执行  
- 底层或跨系统接口用 Substrait 类规范做计划/语义交换

这类组合式架构，比单一“全能平台”更符合当前生态演进方向。

---

## 结论

从 2026-03-17 的社区动态看，OLAP 数据基础设施生态的主旋律已经非常清晰：  
**成熟项目在补正确性、可观测性和工程可用性；规范项目在补语义清晰度和跨引擎一致性。**

对技术决策者而言，建议重点关注三类信号：
1. **correctness 修复速度**：决定系统是否适合核心生产链路  
2. **可观测性建设力度**：决定排障和运维成本  
3. **配置/元数据语义清晰度**：决定系统在大规模团队中的可治理性  

对数据工程师而言，短期最值得跟踪的是：
- **dbt-core**：snapshot 正确性、state-based selection、日志增强  
- **Spark**：SQL 正确性问题、Streaming 恢复、UI/metrics 改进  
- **Substrait**：函数参数语义规范，尤其是和跨引擎执行计划实现相关的变化

如果你愿意，我还可以继续把这份报告整理成以下任一格式：  
1. **适合管理层汇报的 1 页摘要版**  
2. **适合飞书/Slack 的表格卡片版**  
3. **按“选型建议”重写的决策备忘录版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报 · 2026-03-17

## 1. 今日速览

过去 24 小时内，dbt-core 没有新版本发布，但社区讨论非常活跃，更新集中在 **snapshots、tests、依赖管理、配置语义与日志可观测性** 几条主线上。  
从 PR 动向看，维护者正在推进 **state:modified / vars 变更恢复、ephemeral 编译竞态回滚修复、seed 限制可配置化、日志增强**；从 Issue 看，**快照一致性、测试表达能力、配置与依赖易用性** 仍是当前最核心的用户诉求。

---

## 3. 社区热点 Issues

> 注：今日无新 Release，故省略“版本发布”。

### 1) #11235 使用 `check` 策略的 snapshots 有时会产生重复行
- **状态**：OPEN
- **为什么重要**：这是典型的数据正确性问题。snapshot 是很多团队做 SCD/历史追踪的核心能力，一旦出现重复行，会直接影响审计、回溯和下游指标可信度。
- **社区反应**：15 条评论、2 个赞，说明虽非最高热度，但已进入持续排查阶段；标签为 `awaiting_response`，后续可能依赖更完整复现。
- **链接**：dbt-labs/dbt-core Issue #11235

### 2) #10438 为 snapshot 的 `check_cols` 增加 exclude 模式
- **状态**：OPEN
- **为什么重要**：当前 `check_cols` 更偏白名单式配置，真实项目列很多时维护成本高。支持 exclude 能明显改善 snapshot 配置可维护性，尤其适合宽表和频繁加列场景。
- **社区反应**：9 条评论，属于功能设计已被反复提及的类型，说明需求具备普遍性。
- **链接**：dbt-labs/dbt-core Issue #10438

### 3) #9656 在 `check` snapshot 策略发现重复列时给出警告
- **状态**：OPEN
- **为什么重要**：这不是“能力扩展”，而是“防踩坑”增强。snapshot 的重复列问题往往在运行后期才暴露，前置警告能显著降低排障成本。
- **社区反应**：带 `help_wanted`，说明维护者愿意接收社区贡献；5 条评论，需求边界相对清晰。
- **链接**：dbt-labs/dbt-core Issue #9656

### 4) #10236 新增 snapshot 配置：merge 前校验唯一性
- **状态**：OPEN
- **为什么重要**：这是对 snapshot 正确性的进一步强化。若在 merge 前先验证唯一键，可避免“脏输入”直接进入历史表，对生产稳定性意义很大。
- **社区反应**：评论不多，但问题指向明确，且与最近多条 snapshot 相关 Issue 形成主题共振。
- **链接**：dbt-labs/dbt-core Issue #10236

### 5) #4723 允许 tests 按“失败比例” warn/fail
- **状态**：OPEN
- **为什么重要**：这是数据测试从“绝对失败条数”走向“相对质量阈值”的关键一步。对于大表和增量场景，百分比阈值更接近真实 SLA / 数据质量治理需求。
- **社区反应**：33 条评论，长期活跃，说明这是经典痛点；也是今天最值得持续跟踪的测试能力需求之一。
- **链接**：dbt-labs/dbt-core Issue #4723

### 6) #12643 是否允许 data tests 重复定义，需要明确语义
- **状态**：OPEN
- **为什么重要**：这涉及测试系统的规范边界。重复 test 到底是合法复用、命名冲突还是解析缺陷，会影响项目治理和 CI 稳定性。
- **社区反应**：新 Issue，但已进入 `triage`，意味着维护团队正在确认应视为 bug 还是 feature。
- **链接**：dbt-labs/dbt-core Issue #12643

### 7) #4557 当 `packages.yml` 变更时自动使 packages 目录失效
- **状态**：OPEN
- **为什么重要**：这是 dbt 依赖管理体验中的高频问题。不重新执行 `dbt deps` 导致版本滞后，既常见又隐蔽，尤其影响 Cloud / CI 使用者。
- **社区反应**：16 条评论，需求长期存在，说明“依赖缓存失效机制”仍有改进空间。
- **链接**：dbt-labs/dbt-core Issue #4557

### 8) #2955 支持在 `dbt_project.yml` 之外定义 vars / 文件夹级配置
- **状态**：CLOSED
- **为什么重要**：尽管已关闭，但这是一个高赞老议题，反映大型项目对配置解耦与模块化管理的长期诉求。随着项目复杂度上升，单一 `dbt_project.yml` 的可维护性问题越来越突出。
- **社区反应**：33 条评论、71 个赞，是本批数据里用户共识度最高的话题之一。
- **链接**：dbt-labs/dbt-core Issue #2955

### 9) #6013 `full_refresh: true` 配置应尊重 `--full-refresh/-f` 命令行参数
- **状态**：OPEN
- **为什么重要**：这是配置优先级与 CLI 语义一致性问题。当前行为容易让用户误解“命令行覆盖配置”的常识，尤其在增量模型运维中会产生执行预期偏差。
- **社区反应**：9 条评论，问题虽不算高热，但属于“语义一致性”类核心体验问题。
- **链接**：dbt-labs/dbt-core Issue #6013

### 10) #10485 `env_var` 默认值支持 `None`
- **状态**：OPEN
- **为什么重要**：涉及 Jinja / 配置系统与 Python 语义的对齐。支持 `None` 作为默认值可减少模板分支逻辑，让环境变量控制更自然。
- **社区反应**：4 条评论、1 个赞，属于“小而痛”的 Refinement 类需求。
- **链接**：dbt-labs/dbt-core Issue #10485

---

## 4. 重要 PR 进展

> 本周期仅有 6 个 PR 更新，以下全部列出。

### 1) #12660 restore state:modified vars changes
- **状态**：OPEN
- **内容**：恢复 `state:modified` 对 `vars` 变化的识别能力。
- **意义**：这直接影响 state-based selection 的准确性，尤其是 CI/CD 中基于变更范围做增量构建与测试的团队。如果 `vars` 变更未被正确识别，可能导致漏跑。
- **链接**：dbt-labs/dbt-core PR #12660

### 2) #12659 Revert "Revert 'Fix duplicate CTE race condition in ephemeral model compilation'"
- **状态**：OPEN
- **内容**：继续对此前 ephemeral model 编译阶段“重复 CTE 竞态”修复链路做回滚调整。
- **意义**：这说明相关修复存在复杂副作用，维护团队仍在谨慎平衡正确性与回归风险。涉及 ephemeral 编译稳定性，值得重点观察。
- **链接**：dbt-labs/dbt-core PR #12659

### 3) #11177 Make MAXIMUM_SEED_SIZE_MIB configurable
- **状态**：OPEN
- **内容**：将 seed 文件大小上限参数化。
- **意义**：这是典型的可配置性增强。对使用较大 CSV 做维表装载、测试基准数据或迁移过渡数据的团队非常实用，也可能带来 artifact 版本小幅升级。
- **链接**：dbt-labs/dbt-core PR #11177

### 4) #12555 Better Logging
- **状态**：OPEN
- **内容**：日志能力增强，关联 #12566。
- **意义**：结合近期多个 logging Issue，这个 PR 体现出 dbt-core 正在补齐“错误定位信息不足”的痛点。对排查 env var、execute mode、宏执行路径等问题都有潜在帮助。
- **链接**：dbt-labs/dbt-core PR #12555

### 5) #10600 Resolve relative local dependencies of local dependencies
- **状态**：CLOSED
- **内容**：修复本地依赖包的传递性相对路径解析问题。
- **意义**：这对 monorepo、本地包嵌套依赖、企业内部 package 组织方式尤其重要。虽然已关闭，但说明依赖解析复杂场景仍在持续被处理。
- **链接**：dbt-labs/dbt-core PR #10600

### 6) #11838 fix: link
- **状态**：OPEN
- **内容**：修复链接问题。
- **意义**：改动虽小，但体现社区贡献持续流入；同时也反映文档与引用链接质量仍有零碎维护工作。
- **链接**：dbt-labs/dbt-core PR #11838

### 7) PR 总体观察：配置与状态计算仍是近期主线
- **说明**：#12660 和 #11177 都围绕“让系统行为更可控、更可预测”展开，一个是变更检测准确性，一个是参数上限可配置。
- **意义**：这说明 dbt-core 当前演进重点并不只是新增功能，也在强化工程化可用性。
- **相关链接**：dbt-labs/dbt-core PR #12660 / #11177

### 8) PR 总体观察：编译器稳定性仍在修复窗口
- **说明**：#12659 的回滚再回滚，表明 ephemeral 编译中的并发/竞态问题仍然敏感。
- **意义**：对大量使用 ephemeral model 的项目，近期应关注版本升级说明与回归测试。
- **相关链接**：dbt-labs/dbt-core PR #12659

### 9) PR 总体观察：可观测性提升正在从 Issue 走向实现
- **说明**：#12555 与多个 logging 相关 Issue（如 #11070、#10803）形成呼应。
- **意义**：未来 dbt-core 报错信息有望更“面向定位”，而不只是“面向失败”。
- **相关链接**：dbt-labs/dbt-core PR #12555

### 10) PR 总体观察：依赖管理仍是长期建设项
- **说明**：#10600 与 Issue #4557 共同说明，packages/deps 的解析、缓存失效、路径处理仍是 dbt 用户体验中的复杂区域。
- **意义**：对有私有包、嵌套本地包、CI 缓存的团队，建议继续关注后续改进。
- **相关链接**：dbt-labs/dbt-core PR #10600 / Issue #4557

---

## 5. 功能需求趋势

### 1) Snapshot 可靠性与易用性持续升温
相关 Issue：#11235、#10438、#9656、#10236  
**趋势解读**：社区当前最集中诉求之一是让 snapshot 更安全、更可控、更少“隐性错误”。需求已从基础能力转向：
- 更灵活的列选择机制
- 更早期的输入校验与警告
- merge 前唯一性检查
- 避免重复行等正确性问题

这说明 snapshot 已被大量用于生产关键链路，用户对其稳定性要求显著提高。

### 2) 数据测试能力从“能跑”走向“可治理”
相关 Issue：#4723、#12643、#11229  
**趋势解读**：测试系统的需求正在细化：
- 支持按比例阈值判断失败
- 明确重复 test 的语义边界
- 处理 description / config 等参数化细节问题

这体现出数据质量管理正在向更加制度化、SLA 化演进。

### 3) 配置系统需要更模块化、更一致
相关 Issue：#2955、#6013、#10485、#12015、#12349、#4108  
**趋势解读**：大量讨论并非“新增一个配置项”，而是配置系统整体的可理解性问题：
- 配置拆分与复用
- CLI 与项目配置优先级一致性
- `None/off/plus-prefix` 等语义细节
- 继承与 merge 行为可预测性

这说明 dbt-core 作为声明式构建工具，配置语义已经成为用户体验的关键战场。

### 4) 依赖与包管理仍有明显改进空间
相关 Issue / PR：#4557、#10600、#12655  
**趋势解读**：
- package 缓存失效机制不够自动化
- 本地依赖的嵌套路径解析复杂
- Python UDF 对私有 PyPI 包支持成为新需求

表明 dbt 项目正在从“单项目 SQL 工具”扩展为“多依赖、跨语言、企业内部分发”的工程平台。

### 5) 日志与错误定位能力成为刚需
相关 Issue / PR：#11070、#10803、#12555  
**趋势解读**：社区不再满足于“报错了”，而是要求：
- 明确错误发生位置
- 提示为什么跳过执行
- 暴露 execute mode 等上下文

这类需求通常意味着用户规模扩大、项目复杂度提高，排障效率开始成为核心成本。

---

## 6. 开发者关注点

### 1) “正确性优先”成为核心痛点
snapshot 重复行、merge 前唯一性、重复列警告、测试重复语义等问题都指向同一件事：  
**开发者最担心的不是功能缺失，而是 silent failure 或隐式错误。**

### 2) 配置语义复杂，学习与维护成本高
从 `full_refresh`、`env_var(None)`、`static_analysis: off`、`MissingPlusPrefixDeprecation` 到 config merge，开发者频繁反馈：  
**dbt 的配置能力很强，但边界条件和优先级规则不够直观。**

### 3) 大型项目对模块化配置的需求更强
高赞的 #2955 说明，随着项目扩大，单一 `dbt_project.yml` 已成为维护瓶颈。  
**企业级用户希望把 vars、目录配置、环境差异配置拆分治理。**

### 4) CI/CD 与增量开发体验仍需优化
`state:modified` 对 vars 变更的识别、`packages.yml` 更新后的依赖失效、`dbt deps` 易遗漏等问题表明：  
**社区非常关注基于变更范围的精准执行与自动化流水线可靠性。**

### 5) 排障效率是高频诉求
日志类 Issue 与 PR 持续出现，说明开发者希望 dbt-core 提供更具上下文的信息，而不是让用户自行翻源码或猜测运行阶段。  
**“更好理解为什么失败/为什么跳过”正在成为重要产品方向。**

---

## 附：今日值得重点跟踪的链接

- Snapshot 重复行问题：dbt-labs/dbt-core Issue #11235  
- 测试按比例 warn/fail：dbt-labs/dbt-core Issue #4723  
- packages.yml 变更自动失效：dbt-labs/dbt-core Issue #4557  
- 配置拆分 / vars 外置：dbt-labs/dbt-core Issue #2955  
- 恢复 state:modified 对 vars 变更识别：dbt-labs/dbt-core PR #12660  
- ephemeral 编译竞态相关回滚：dbt-labs/dbt-core PR #12659  
- seed 大小上限可配置：dbt-labs/dbt-core PR #11177  
- 日志增强：dbt-labs/dbt-core PR #12555

如果你愿意，我也可以把这份日报进一步整理成：
1. **适合飞书/Slack 推送的精简版**  
2. **适合公众号/博客发布的长文版**  
3. **表格化周报模板**

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报 · 2026-03-17

## 1. 今日速览

过去 24 小时内，Spark 社区没有新的 Release 发布，但 SQL 引擎、Spark UI、PySpark 工具链、Spark Connect 与 Structured Streaming 方向都出现了较活跃的 PR 更新。  
今天最值得关注的主题是：**Catalog / Function Registry 一致性修复、SQL 执行计划可观测性增强、Python 开发体验改进，以及流处理状态存储与云端恢复能力演进**。  
Issue 层面仅有 1 条活跃更新，指向 **`dropDuplicates(columns)` 与 `exceptAll` 组合触发 Catalyst/执行阶段属性解析错误**，属于值得尽快确认影响面的 SQL 正确性问题。

---

## 2. 社区热点 Issues

> 说明：过去 24 小时内仅观测到 **1 条**更新中的 Issue，因此无法凑满 10 条。以下对这 1 条进行重点分析。

### 1) `dropDuplicates(columns)` followed by ExceptAll results in INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND
- **Issue**: #54724  
- **状态**: OPEN  
- **作者**: @BaseKan  
- **链接**: apache/spark Issue #54724

**问题概述**  
用户报告在 DataFrame 执行 `dropDuplicates(subsetCols)` 后再执行 `exceptAll` 时，Spark 抛出 `INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND`。从现象看，这不是普通语义报错，而更像是 **Catalyst 分析/优化后属性引用丢失**，最终在查询执行阶段触发内部错误。

**为什么重要**  
- 这是一个典型的 **SQL/DataFrame 正确性问题**，且错误级别是 internal error，不是用户可预期的输入错误。  
- 涉及 `dropDuplicates` 和 `exceptAll` 这类常见算子组合，潜在影响面可能覆盖 ETL 去重、数据校验、差异比对等场景。  
- 如果根因是属性映射、投影裁剪或 logical plan output schema 维护不一致，那么可能不仅限于该算子组合。

**社区反应**  
- 当前评论数较少，仅 1 条，说明还处于问题确认早期。  
- 但从报错类型和复现路径看，属于 **值得 SQL/Catalyst 维护者优先 triage** 的问题。

**建议关注点**  
- 是否只在 subset 去重时触发。  
- 是否与 `exceptAll` 对 duplicate-sensitive 语义的内部实现有关。  
- 是否在 Spark Connect、PySpark/Scala API、不同分支版本中都可复现。

---

## 3. 重要 PR 进展

> 从过去 24 小时内更新的 PR 中，挑选 10 个对数据工程、SQL 引擎、平台运维和开发体验影响较大的条目。

### 1) 清理 DROP DATABASE 后函数注册表缓存，修复 Catalog 缓存一致性
- **PR**: #54781  
- **标题**: [SPARK-55964] Cache coherence: clear function registry on DROP DATABASE  
- **状态**: OPEN  
- **链接**: apache/spark PR #54781

**内容摘要**  
为 `FunctionRegistryBase` 增加按数据库清理函数的方法，并在 `SessionCatalog.dropDatabase` 时同步清理标量函数和表函数缓存，防止数据库删除后仍解析到陈旧函数条目。

**价值**  
这是典型的 **元数据一致性 / Catalog coherence** 修复。对启用了自定义函数、临时函数及多数据库隔离场景的用户尤其重要，可减少“对象已删除但解析仍命中旧缓存”的诡异行为。

---

### 2) Qualified session view：继续推进 Session View 的限定名能力
- **PR**: #53630  
- **标题**: [SQL] [SPARK-54808] Qualified session view  
- **状态**: OPEN  
- **链接**: apache/spark PR #53630

**内容摘要**  
该 PR 持续推进 session view 的 qualified name 支持，目标是让 session 级视图在命名解析与作用域行为上更清晰。

**价值**  
这是 Spark SQL **对象解析模型** 的长期改进项。对 notebook、多租户 SQL 环境、BI 交互式查询等场景很关键，有助于减少 view、table、temp object 之间的歧义。

---

### 3) 改进 GroupPartitions 在 Spark UI 中的展示
- **PR**: #54842  
- **标题**: [SPARK-56020][SQL] Improve GroupPartitions Spark UI  
- **状态**: OPEN  
- **链接**: apache/spark PR #54842

**内容摘要**  
作为此前 GroupPartitions 工作的后续，继续完善其在 Spark UI 中的展示效果，同时优化 reducers 相关展示并修正测试。

**价值**  
对新引入的 SQL/物理执行算子而言，**Explain 可读性 + UI 可观测性** 同样重要。该 PR 有助于开发者和平台运维更好地理解 SPJ group operator 的执行行为。

---

### 4) 修复 GroupPartitions 文本表示
- **PR**: #54801  
- **标题**: [SPARK-55992][SQL] Fix GroupPartitions textual representation  
- **状态**: CLOSED  
- **链接**: apache/spark PR #54801

**内容摘要**  
优化 `GroupPartitionsExec` 在执行计划中的文本输出，避免直接暴露难读的内部对象表示。

**价值**  
虽是“显示层”改动，但对 SQL 调优非常实用。物理计划可读性越高，越容易定位 partitioning、grouping 与 shuffle 行为问题。与 #54842 形成明显的配套关系。

---

### 5) Structured Streaming：提升 AutoSnapshotRepair 默认变更回放阈值
- **PR**: #54843  
- **标题**: [SPARK-56021][SS] Increase AutoSnapshotRepair default maxChangeFileReplay threshold from 50 to 500  
- **状态**: OPEN  
- **链接**: apache/spark PR #54843

**内容摘要**  
将 AutoSnapshotRepair 的默认 `maxChangeFileReplay` 阈值从 50 提升到 500。

**价值**  
这说明社区在继续打磨 **状态恢复与快照修复策略**。对流式任务在 checkpoint 损坏、远端恢复、增量变更文件较多等情况下的健壮性和自动修复能力有直接影响。

---

### 6) 为状态存储从云端加载增加指标
- **PR**: #54567  
- **标题**: [SPARK-55751][SS] Add metrics on state store loads from cloud storage  
- **状态**: OPEN  
- **链接**: apache/spark PR #54567

**内容摘要**  
新增 `rocksdbLoadedFromCloud` 指标，用来跟踪单次 state store load 过程中从远程云存储/DFS 获取快照的次数。

**价值**  
这是非常典型的 **流处理可观测性增强**。对运行在对象存储上的 Structured Streaming 任务，排查恢复慢、checkpoint 频繁拉取、状态放大等问题会更直观。

---

### 7) PySpark 基准测试工具链改进：从仓库根目录直接运行 ASV
- **PR**: #54834  
- **标题**: [SPARK-56011][PYTHON][INFRA] Add dev/asv wrapper script for running benchmarks from repo root  
- **状态**: OPEN  
- **链接**: apache/spark PR #54834

**内容摘要**  
增加 `dev/asv` 包装脚本，让开发者可以从 Spark 仓库根目录直接运行 PySpark ASV benchmark，并更新 README。

**价值**  
这类改动虽然不直接影响用户功能，但能显著改善 **性能回归测试的可执行性**。对 PySpark 性能优化、提交前基准验证、CI/本地 benchmark 统一都很有帮助。

---

### 8) PySpark 代码风格工具升级：使用 ruff 作为 formatter
- **PR**: #54840  
- **标题**: [SPARK-56018][PYTHON] Use ruff as formatter  
- **状态**: OPEN  
- **链接**: apache/spark PR #54840

**内容摘要**  
推动 Python 代码格式化工具向 `ruff` 统一。

**价值**  
反映出 Spark Python 子项目在向 **更快、更统一的开发工具链** 收敛。对于贡献者而言，可减少格式化差异与 lint/format 成本；对于项目本身，则有利于提升维护效率。

---

### 9) Spark UI：SQL Plan Visualization 指标表支持排序
- **PR**: #54823  
- **标题**: [SPARK-56002][UI] Make SQL plan visualization metrics table sortable  
- **状态**: OPEN  
- **链接**: apache/spark PR #54823

**内容摘要**  
让 SQL 执行计划可视化侧边栏中的 metrics table 支持按列排序。

**价值**  
这是一个小而实用的 UI 增强。对于复杂查询分析，开发者常常需要快速对比 operator 的耗时、输出行数、shuffle 数据量等，排序能力会显著提升排障和调优效率。

---

### 10) Spark Connect：修复 ArrowDeserializer 对重复列名的处理
- **PR**: #54832  
- **标题**: [SPARK-56007][CONNECT] Fix ArrowDeserializer to use positional binding for rows  
- **状态**: OPEN  
- **链接**: apache/spark PR #54832

**内容摘要**  
Spark Connect Scala client 的 RowEncoder 反序列化从基于名称的查找切换为按位置绑定，以正确处理重复列名。

**价值**  
这是 Spark Connect **语义兼容性与结果正确性** 的关键修复。涉及 Arrow 反序列化链路，尤其对 join、select 表达式后产生重复列名的结果集很重要。

---

## 4. 功能需求趋势

基于今天更新的 Issue 和 PR，可以提炼出以下几个社区关注方向：

### 1) SQL 引擎正确性与对象解析一致性
从 #54724、#54781、#53630、#54841、#54828 可以看出，社区仍在持续处理：
- Catalyst 属性解析与算子组合正确性
- Catalog / function registry 缓存一致性
- view/table/function 命名解析边界
- SQL 字符串生成与语义显示正确性
- LIKE/Unicode 等边界字符兼容性

**趋势判断**：Spark SQL 已进入“深水区打磨”阶段，重点不只是新增功能，更在于复杂语义和边界场景的收敛。

---

### 2) 可观测性与可调试性增强
从 #54842、#54801、#54823、#54567 可见：
- Explain plan 可读性
- Spark UI 中算子与指标展示
- 流处理状态存储恢复指标
- SQL plan visualization 的交互体验

**趋势判断**：社区在持续把“执行了什么”与“为什么慢/为什么错”做得更容易被看懂，尤其适合生产环境排障和性能调优。

---

### 3) Structured Streaming 的状态恢复与云存储适配
从 #54843、#54567 可看出：
- AutoSnapshotRepair 默认行为在调整
- RocksDB state store 与远程存储的交互指标在补齐

**趋势判断**：流处理在云环境中的鲁棒性仍是重点，尤其是 checkpoint/state snapshot 的恢复成本、稳定性与可观测性。

---

### 4) Python 开发体验与性能工程基础设施
从 #54834、#54840 可见：
- benchmark 运行入口更统一
- Python formatter/tooling 在现代化

**趋势判断**：PySpark 社区不仅在关注 API 和运行时，也开始加强贡献者体验、性能回归流程和工具链统一。

---

### 5) 生态依赖升级与平台兼容
从 #54820、#54835、#54830 可见：
- Arrow Java 升级
- JAXB 升级
- netty-tcnative 升级

**趋势判断**：Spark 继续保持对底层依赖的主动维护，以获得 bugfix、兼容性和安全收益。这类改动虽不“显眼”，但对发行质量非常关键。

---

## 5. 开发者关注点

结合今日动态，开发者当前最关心的问题主要集中在以下几类：

### 1) “正确性优先”的 SQL 边界问题
像 `dropDuplicates + exceptAll` 触发 internal error 这类问题，最容易影响生产任务稳定性。开发者希望 Spark 在复杂算子组合下给出稳定、一致、可预期的行为，而不是内部属性缺失类异常。

### 2) 元数据缓存与 Catalog 行为透明度
数据库删除、函数注册、session view 解析等问题，反映出开发者对 **命名解析和缓存失效机制** 的一致性要求很高。尤其在多 catalog、多 database、临时对象混用时，这类问题很容易演变为线上疑难杂症。

### 3) 需要更强的 UI / Explain / Metrics 支撑调优
今天多条 PR 都围绕 plan 文本、UI 展示、指标排序、状态存储指标展开，说明开发者已经不满足于“任务能跑”，而更关注：
- 为什么慢
- 哪个节点有问题
- shuffle / state load / reducer 行为是否合理
- 执行计划是否能快速读懂

### 4) 云上流处理的恢复成本与稳定性
Structured Streaming 相关 PR 表明，开发者正在面对更多 **远程状态存储、checkpoint 修复、云端拉取快照** 的真实生产问题。他们需要更好的默认参数、更丰富的指标，以及更稳健的自动恢复机制。

### 5) Python 贡献和性能测试流程仍需降门槛
ASV wrapper 与 ruff formatter 两条 PR 的共同点，是在降低贡献成本、统一开发体验。说明 PySpark 方向的开发者希望：
- benchmark 更容易运行
- 代码格式化更快更统一
- 本地开发与 CI 行为更一致

---

## 6. 补充观察

今天虽然没有新 Release，也只有 1 条活跃 Issue，但 PR 层面信息量不小，且大多集中在 **“工程质量提升”而非大功能发布**：  
- SQL 正确性与解析一致性  
- UI/Explain/指标可观测性  
- 流处理状态恢复  
- Python 工具链现代化  
- Connect 结果反序列化正确性

对数据工程师而言，这类改动通常不会第一时间出现在功能宣传里，但会直接影响生产稳定性、排障效率和升级收益，值得持续关注。

--- 

如需，我还可以继续把这份日报补充成：
1. **按模块分类版**（SQL / Streaming / Python / Connect / Build）  
2. **面向管理层的 5 条摘要版**  
3. **适合发到微信群/飞书的精简播报版**

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-17）

## 1. 今日速览
过去 24 小时内，Substrait 仓库没有新的 Release，也没有 Issue 更新，整体社区活动较为平稳。  
唯一值得关注的是一条仍在开放状态的文档类 PR，聚焦于函数规范中 **enumeration arguments** 与 **options** 的语义区分，这对实现方理解函数签名与参数约束具有实际意义。  

---

## 4. 重要 PR 进展

### 1) PR #1005：澄清 enumeration arguments 与 options 的区别
- **状态**：OPEN  
- **作者**：@benbellick  
- **创建时间**：2026-03-12  
- **最近更新**：2026-03-16  
- **摘要**：该 PR 针对规范文档进行修订，明确 Substrait 函数中两类“固定集合字符串值”传参机制的区别：
  - **enumeration arguments**：始终为必填参数
  - **options**：表达的是函数行为配置，不应与“必需枚举参数”混淆
- **重要性**：这类修改虽然属于文档层，但对规范实现者、函数签名设计者、以及不同执行引擎的兼容实现都很关键。若概念边界不清，容易导致函数 binding、校验规则以及跨引擎语义映射出现偏差。
- **社区信号**：当前未见点赞与评论数据，说明讨论热度不高，但其影响面主要体现在规范一致性与后续实现准确性上。
- **链接**：https://github.com/substrait-io/substrait/pull/1005

---

## 5. 功能需求趋势
由于过去 24 小时内 **没有新的 Issue 更新**，今天无法从新增或活跃 Issue 中提炼出明确的功能需求趋势。  
不过，从唯一活跃 PR 的内容看，社区当前仍在持续打磨以下方向：

- **规范语义清晰化**：减少术语歧义，提升实现一致性
- **函数定义与参数模型完善**：帮助不同引擎更准确地消费 Substrait 规范
- **文档可实施性增强**：不仅描述“是什么”，也强调“应如何正确实现”

这表明社区近期关注点偏向 **规范精炼与实现对齐**，而非大规模功能扩展。

---

## 6. 开发者关注点
结合今日可见动态，开发者侧的关注点主要集中在以下方面：

1. **函数参数语义必须足够明确**  
   对数据库执行器、查询规划器、以及 UDF/内建函数映射层来说，参数是“必填枚举”还是“行为选项”，会直接影响解析与校验逻辑。

2. **跨引擎实现需要避免文档歧义**  
   Substrait 的核心价值之一在于跨系统计划表示与交换，因此任何术语模糊都可能在不同实现中被放大，造成兼容性问题。

3. **规范文档不仅服务阅读，也服务实现**  
   今天这条 PR 再次说明：开发者需要的是可操作、可验证、可映射到代码中的规范，而不是仅停留在概念层面的描述。

---

## 3. 社区热点 Issues
过去 24 小时内 **无更新 Issue**，因此今日暂无可列出的热点 Issue。  
- 仓库链接：https://github.com/substrait-io/substrait/issues

---

## 附：仓库主页
- **Substrait 仓库**：https://github.com/substrait-io/substrait

如果你愿意，我也可以进一步把这份日报改成更像公众号/飞书机器人推送的样式，或者补一版“面向 Apache Arrow / DuckDB / Velox 生态读者”的解读版。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*