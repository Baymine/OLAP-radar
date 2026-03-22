# OLAP 生态索引日报 2026-03-22

> 生成时间: 2026-03-22 01:22 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

以下是基于 **2026-03-22 dbt-core、Apache Spark、Substrait** 社区动态整理的横向对比分析报告。

---

# OLAP 数据基础设施生态横向对比分析报告
**日期：2026-03-22**

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个很清晰的趋势：**核心项目的竞争重点，正从“单点功能扩展”转向“语义正确性、可观测性、配置治理与工程化成熟度”**。  
从 dbt-core 到 Spark，再到 Substrait，社区都在不同层面强化“边界条件下行为是否正确”“错误是否足够可理解”“规范演进是否可维护”。  
这意味着 OLAP 基础设施正在进入更成熟的发展阶段：不仅追求能力覆盖，还强调 **生产可用性、治理一致性和开发者体验**。  
对企业技术团队而言，这类信号表明，未来选型不应只看功能列表，更要看 **语义稳定性、生态协同能力和持续维护质量**。

---

## 2. 各项目活跃度对比

| 项目 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 活跃重心 |
|---|---:|---:|---|---|
| **dbt-core** | 3 | 6 | 无新版本发布 | 配置校验、错误提示、snapshot 语义、CI 工程化 |
| **Apache Spark** | 0 | 10+（重点活跃 PR） | 无新版本发布 | SQL 正确性、Streaming 状态能力、Python/pandas 3、Spark Connect、部署优化 |
| **Substrait** | 1 | 0 | 无新版本发布 | 扩展弃用流程、版本字符串自动化、规范治理 |

### 活跃度解读
- **Spark** 今日活跃度最高，且活跃内容覆盖 SQL、Streaming、Python、Infra 多条主线，显示出大型基础引擎项目的持续演进能力。
- **dbt-core** 活跃度中等，但议题高度聚焦，集中在开发者体验与配置治理，体现出产品从“功能可用”走向“可治理、可诊断”。
- **Substrait** 今日活跃度较低，但讨论内容具有明显“规范成熟化”特征，说明其发展阶段更偏向标准治理与发布工程完善。

---

## 3. 共同关注的功能方向

尽管三者所处层次不同，但从今日动态看，存在几个明显的共同关注方向。

### 3.1 配置/规范治理与失败可诊断性
**涉及项目：dbt-core、Substrait、Spark**

- **dbt-core**
  - `dbt_project.yml` 未知 flags 告警（PR #12689）
  - `packages.yml` 缺失 `version` 时改进错误信息（PR #12688）
  - contract enforcement 不支持资源类型时给出更清晰错误（Issue #9607）
- **Substrait**
  - 扩展弃用中的 release version 自动替换（Issue #1017）
- **Spark**
  - AGENTS.md 增补构建/测试说明（PR #54899）
  - Python 工具链进一步收敛到 ruff，减少开发流程摩擦

**共同信号**：  
社区普遍在减少“静默失败”“底层异常泄露”“流程依赖人工记忆”的问题。  
这说明 **开发者体验（DX）和可维护性已经成为基础设施竞争力的一部分**。

---

### 3.2 语义正确性与边界条件处理
**涉及项目：Spark、dbt-core**

- **Spark**
  - 修复运行时空表 `ROLLUP/CUBE` 缺失 grand total row（PR #54938）
  - `asinh/acosh` 对齐 fdlibm 算法（PR #54912）
  - `to_json(sortKeys)` 增强结果稳定性（PR #54717）
- **dbt-core**
  - snapshot 对 append-only 表支持不足（Issue #3878）
  - contract/resource type 能力边界提示不足（Issue #9607）

**共同信号**：  
两个项目都在处理“不是主路径功能缺失，而是复杂/边界场景下结果是否可信”的问题。  
这意味着企业用户已经不满足于“能跑通”，而要求 **在极端数据条件、复杂配置条件下也保持语义稳定**。

---

### 3.3 工程化与可观测性提升
**涉及项目：Spark、dbt-core、Substrait**

- **Spark**
  - stream-stream join state reader 支持 v4（PR #54845）
  - K8s 镜像 Java 21-jre（PR #54940）
  - YARN `ActiveProcessorCount`（PR #51948）
- **dbt-core**
  - event manager error deferral（PR #12687）
  - pytest-split 时长更新、CI 依赖升级（PR #12690、#11925）
- **Substrait**
  - 发布版本字符串自动替换，推进规范发布自动化（Issue #1017）

**共同信号**：  
各项目都在加强“底层工程能力”，包括状态可读、执行环境一致、CI/发布流程自动化。  
这说明基础设施演进已从单纯新增能力，进入 **精细化运维和持续交付优化阶段**。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 当前差异化特征 |
|---|---|---|---|---|
| **dbt-core** | 数据建模、转换治理、文档与测试、配置体验 | 分析工程师、数据工程师、平台团队 | 以 SQL + YAML 驱动的数据开发框架 | 更关注“配置正确性、项目治理、一致性建模体验” |
| **Apache Spark** | 通用分布式计算、SQL 引擎、流批处理、Python 数据生态 | 数据平台团队、引擎开发者、大规模数据处理团队 | 分布式执行引擎，覆盖 SQL/Streaming/ML/Connect | 更关注“执行语义、性能、兼容性、运行时基础设施” |
| **Substrait** | 跨引擎查询计划/表达式标准、扩展规范 | 引擎开发者、查询优化器/执行器作者、标准推动者 | 标准规范驱动，强调引擎间互操作 | 更关注“规范治理、版本演进、扩展生命周期管理” |

### 分析结论
- **dbt-core** 代表的是“上层数据开发与治理入口”，重点是让团队更安全地写配置、写模型、做文档和测试。
- **Spark** 是“底层通用执行与分析引擎”，重心在结果正确性、状态能力、Python 兼容和部署基础设施。
- **Substrait** 是“标准与互操作层”，不直接面向分析师，而是面向引擎和生态集成者。

换句话说，三者分别对应 OLAP 生态的三个层次：
1. **开发与治理层**：dbt-core  
2. **执行与计算层**：Spark  
3. **标准与互操作层**：Substrait  

---

## 5. 社区热度与成熟度

### 5.1 社区热度
从今日更新量看：

1. **Apache Spark**：热度最高  
   - PR 数量最多，且议题覆盖面广
   - 显示出庞大社区和持续高频迭代能力

2. **dbt-core**：中等热度  
   - 绝对更新量不高，但话题密度高、与用户体验直接相关
   - 社区讨论更集中在产品成熟度与治理体验

3. **Substrait**：热度较低  
   - 今日仅 1 条 Issue 更新
   - 但问题本身具有较强规范治理价值，不应单纯以数量判断影响力

### 5.2 成熟度判断
- **Spark：高成熟度 + 持续演进**
  - 典型特征是大量修正“边界语义”“兼容性细节”“基础设施默认配置”
  - 说明项目已经进入大规模生态稳定运营阶段

- **dbt-core：成熟产品向平台化治理深化**
  - 从功能扩展转向配置校验、错误提示、资源能力边界说明
  - 说明其用户群体已从个人开发者扩展到大规模团队协作场景

- **Substrait：标准成熟化早中期**
  - 关注点已从“定义规范”转向“如何高效维护和发布规范”
  - 这是标准项目从设计期走向长期治理期的重要信号

---

## 6. 值得关注的趋势信号

## 6.1 “可诊断性”正成为基础设施核心能力
今日 dbt-core 和 Spark 的多个更新都在说明一个事实：  
**用户最痛苦的往往不是缺功能，而是出问题时不知道为什么。**

对数据工程师的参考价值：
- 选型时应关注工具是否能提供明确错误信息、边界说明和调试能力
- 在平台建设中，应优先减少静默失败与底层异常直出

---

## 6.2 语义正确性比新增功能更重要
Spark 今日最重要的改动多是 SQL 正确性修复；dbt-core 的 snapshot 讨论也指向真实数据模式适配。  
这表明行业正进入一个阶段：**“结果对不对”比“支持了多少语法”更关键。**

对数据工程师的参考价值：
- 做引擎评估时，应强化边界场景测试，如空表、重复 key、append-only、数值边界
- 不要只关注 benchmark，也要关注语义回归和跨系统一致性

---

## 6.3 流式状态、执行状态、发布状态都在变得“可见”
Spark 在增强流式 join 的 state reader，dbt-core 在改进 error deferral，Substrait 在推进发布元数据自动化。  
背后的共同趋势是：**系统内部状态正在从黑盒走向可观测、可审计、可自动化处理。**

对数据工程师的参考价值：
- 平台建设要优先选择那些具备状态可读、运行可追踪、发布可自动化的组件
- 运维能力将逐渐成为数据基础设施落地成败的关键因素

---

## 6.4 Python 与上层开发体验仍然是生态主战场
Spark 今日多条 PR 指向 pandas 3、Spark Connect、Python 工具链；dbt-core 则持续优化配置与文档体验。  
这反映出一个行业现实：**基础设施再底层，最终仍要服务开发者与分析师的使用效率。**

对数据工程师的参考价值：
- 评估生态时，不应只看底层引擎能力，也要看 Python/SQL/配置体验是否顺滑
- 团队效率越来越取决于“接口友好度”而非单点性能指标

---

## 6.5 标准化项目开始进入“治理工程化”阶段
Substrait 今日虽然活跃度不高，但其唯一热点就与扩展弃用、版本替换、GitHub Actions 自动化有关。  
这说明互操作标准正在从概念推进，进入 **长期维护、发布一致性、版本治理** 的新阶段。

对数据工程师的参考价值：
- 对跨引擎平台或湖仓互联场景，应持续关注 Substrait 这类标准项目的治理成熟度
- 标准是否易于维护，直接影响未来生态集成成本

---

# 结论

从今日横向观察看，**OLAP 生态正在从“能力建设期”迈向“成熟化治理期”**。  
- **dbt-core** 的重点是配置安全、错误可理解、治理一致性；
- **Spark** 的重点是 SQL/Streaming/Python 的正确性与工程化打磨；
- **Substrait** 的重点是规范生命周期与发布自动化。

对技术决策者来说，这意味着下一阶段的基础设施评估标准应包括：
1. **语义正确性**
2. **错误可诊断性**
3. **状态与执行可观测性**
4. **工程化成熟度**
5. **标准化与生态协同潜力**

如果你愿意，我还可以进一步把这份报告整理成以下任一版本：
1. **适合团队晨会汇报的 8 条 bullet 精简版**
2. **适合发邮件/公众号的图文版**
3. **按“建模层 / 执行层 / 标准层”重构的战略分析版**
4. **附带“对企业数据平台选型建议”的决策备忘录版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，**dbt-core 没有新版本发布**，社区讨论重心集中在 **配置校验、错误提示可读性、snapshot 语义增强** 等开发者体验问题上。  
PR 侧最值得关注的是两项社区贡献：一项为 `dbt_project.yml` 中**未知 flags 增加告警**，另一项修复 `packages.yml` 缺失 `version` 时抛出底层 `KeyError` 的问题，整体反映出社区正在推动 dbt-core 朝着**更强配置治理与更友好的失败提示**演进。

---

## 3. 社区热点 Issues

> 注：本次数据中，过去 24 小时内更新的 Issue 仅 3 条，以下按全部可见热点列出。

### 1) Snapshot 支持 append-only 源表场景
- **Issue**: [#3878](https://github.com/dbt-labs/dbt-core/issues/3878)
- **标题**: dbt snapshots to handle append tables
- **为什么重要**: 这是一个典型的仓库建模痛点。现有 dbt snapshot 更偏向“源表按主键覆盖更新”的前提，而很多日志型、CDC 落地型、append-only 明细表并不满足这一假设。若该能力缺失，SCD2 历史跟踪会变得复杂，用户需自行预处理去重或重构快照输入。
- **社区反应**: 该 Issue 创建时间较早但仍在更新，说明需求长期存在；当前评论数不高，但其“存量未解 + 持续被提及”的特征，意味着这是 snapshot 体系中的结构性缺口。

### 2) sources 资源支持 `docs` 配置
- **Issue**: [#12023](https://github.com/dbt-labs/dbt-core/issues/12023)
- **标题**: [Feature] Implement 'docs' config for sources
- **为什么重要**: `docs` 配置在 dbt 文档生态中很关键，如果 source 资源不能一致支持，会造成文档治理体验割裂。对于强调血缘、语义说明、资产治理的平台团队来说，这直接影响 source 级别元数据管理。
- **社区反应**: 当前评论不多，但被标注了 `dbt-docs` 和 `docs`，说明这是产品文档能力一致性问题，属于容易引发更多用户共鸣的“体验型缺口”。

### 3) 对不支持 contract enforcement 的资源类型给出更清晰错误信息
- **Issue**: [#9607](https://github.com/dbt-labs/dbt-core/issues/9607)
- **标题**: [Feature] Raise a clearer error message for resource types that don't support enforcing contracts
- **为什么重要**: 这是典型的“不是功能缺失，而是错误反馈不足”的问题。随着 model contracts 被越来越多团队用于规范化数据接口，不同资源类型支持边界如果提示不清晰，会显著增加排障成本。
- **社区反应**: 评论数较少，但该问题与更大范围的 contract adoption 直接相关，重要性高于表面互动数据。

---

## 4. 重要 PR 进展

> 注：本次数据中，过去 24 小时内更新的 PR 仅 6 条，以下全部列出。

### 1) 在 `dbt_project.yml` 中对未知 flags 发出告警
- **PR**: [#12689](https://github.com/dbt-labs/dbt-core/pull/12689)
- **标题**: feat: warn on unknown flags in dbt_project.yml
- **状态**: OPEN
- **看点**: 当用户在 `dbt_project.yml` 里写错 flag 名称（如拼写错误）时，dbt 过去会静默忽略。这类问题非常隐蔽，常导致“配置明明写了却不生效”的错觉。
- **意义**: 这是提升配置安全性的关键改进，能显著降低初学者和大型团队在多环境配置中的误配置风险。

### 2) 改善 `packages.yml` 缺失 `version` 键时的报错
- **PR**: [#12688](https://github.com/dbt-labs/dbt-core/pull/12688)
- **标题**: Fix: improve error message when version key is missing from packages.yml
- **状态**: OPEN
- **看点**: 当前缺失 `version` 时可能直接抛出原始 `KeyError: 'version'`，暴露底层实现细节，缺乏对用户场景的解释。
- **意义**: 属于高价值 DX 修复。报错从“Python 异常”转向“用户可理解的配置错误”，能减少大量低效排查。

### 3) 新增 flag，并接入 event manager 的 error deferral
- **PR**: [#12687](https://github.com/dbt-labs/dbt-core/pull/12687)
- **标题**: add new flag and integrate event manager's error deferral
- **状态**: OPEN
- **看点**: 从描述看，这项改动涉及事件管理器与错误延迟处理机制，可能影响运行期事件收集、错误传播或输出时机。
- **意义**: 若顺利合并，可能进一步改善 dbt 在复杂执行流程中的可观测性与错误处理一致性，值得核心开发者关注。

### 4) 修正 generic test 顶层 config key 的弃用提示
- **PR**: [#12618](https://github.com/dbt-labs/dbt-core/pull/12618)
- **标题**: fix: raise correct deprecation when config key is top-level in generic test (#12572)
- **状态**: OPEN
- **看点**: 当前用户在 generic test 中错误地把 `where` 等配置放在顶层时，dbt 抛出的弃用信息具有误导性。
- **意义**: 虽然是“错误提示修正”，但对测试配置迁移和升级兼容很关键，尤其适合维护大量 schema YAML 的团队。

### 5) GitHub Actions 依赖升级：`actions/checkout` 4 → 5
- **PR**: [#11925](https://github.com/dbt-labs/dbt-core/pull/11925)
- **标题**: Bump actions/checkout from 4 to 5
- **状态**: OPEN
- **看点**: 属于 CI 基础设施升级，直接影响仓库自动化执行环境。
- **意义**: 虽不是终端功能更新，但对仓库安全性、兼容性和后续 CI 维护有持续价值。

### 6) 自动更新 pytest-split 测试时长数据
- **PR**: [#12690](https://github.com/dbt-labs/dbt-core/pull/12690)
- **标题**: Update test durations for pytest-split
- **状态**: CLOSED
- **看点**: 这是自动生成 PR，用于更新测试时长文件，以便并行 worker 更均衡地分配测试任务。
- **意义**: 说明项目在持续优化 CI 执行效率。对大型 Python 工程来说，这类“看不见的工程化改进”能直接缩短反馈回路。

---

## 5. 功能需求趋势

结合今日 Issues 与 PR，可以提炼出以下几个社区关注方向：

### 1) 配置校验与失败提示正在成为核心诉求
- 代表项：[#12689](https://github.com/dbt-labs/dbt-core/pull/12689), [#12688](https://github.com/dbt-labs/dbt-core/pull/12688), [#9607](https://github.com/dbt-labs/dbt-core/issues/9607), [#12618](https://github.com/dbt-labs/dbt-core/pull/12618)
- 趋势解读：社区并不只是要“更多功能”，而是希望 dbt 在配置错误、能力边界、弃用迁移时提供更明确的反馈。随着项目规模变大，**可诊断性**本身就是生产力。

### 2) Snapshot 能力仍是长期演进重点
- 代表项：[#3878](https://github.com/dbt-labs/dbt-core/issues/3878), [#9607](https://github.com/dbt-labs/dbt-core/issues/9607)
- 趋势解读：Snapshot 不再只是简单 SCD2 工具，用户希望它适配 append-only、CDC、多版本记录并存等更复杂的数据输入模式。这反映出 dbt 正被越来越多地用于“原始变更数据建模”而非仅服务于标准化数仓表。

### 3) 文档与元数据能力一致性需求上升
- 代表项：[#12023](https://github.com/dbt-labs/dbt-core/issues/12023)
- 趋势解读：用户希望 source、model 等不同资源在 docs 配置上具备一致体验。这背后反映的是数据治理需求升级：dbt 不只是编译/执行工具，也被当作元数据与文档平台的一部分。

### 4) 工程效率与 CI 维护持续推进
- 代表项：[#12690](https://github.com/dbt-labs/dbt-core/pull/12690), [#11925](https://github.com/dbt-labs/dbt-core/pull/11925)
- 趋势解读：核心仓库继续投入测试分片、依赖升级、自动化维护。这说明 dbt-core 团队在功能演进之外，也在持续巩固工程底座。

---

## 6. 开发者关注点

### 1) “静默失败”是高频痛点
- 相关链接：[#12689](https://github.com/dbt-labs/dbt-core/pull/12689)
- 开发者最不希望遇到的不是报错，而是**配置被忽略却没有提示**。这类问题在多环境项目、模板化项目中尤其难排查。

### 2) 底层异常泄露影响使用体验
- 相关链接：[#12688](https://github.com/dbt-labs/dbt-core/pull/12688)
- 像 `KeyError` 这样的原始异常会让用户误以为是内部 bug，而不是配置问题。社区明显希望 dbt-core 提供**面向用户语义**的错误说明。

### 3) 资源能力边界需要更明确
- 相关链接：[#9607](https://github.com/dbt-labs/dbt-core/issues/9607)
- 随着 contracts、tests、snapshots 等特性增多，不同资源类型支持什么、不支持什么，必须通过更清晰的提示呈现，否则学习成本和误用成本会快速上升。

### 4) Snapshot 对真实生产数据模式的适配仍不足
- 相关链接：[#3878](https://github.com/dbt-labs/dbt-core/issues/3878)
- append-only、重复 business key、多次到达等情况在现代数据平台中非常常见。开发者希望 dbt 能更原生地处理这些模式，而不是要求用户预先在模型层绕过。

### 5) 文档配置一致性影响治理落地
- 相关链接：[#12023](https://github.com/dbt-labs/dbt-core/issues/12023)
- 对平台团队而言，source 资源若缺少一致的 docs 配置支持，会让文档规范难以统一，影响资产目录与血缘可读性。

---

## 总结

今天的 dbt-core 社区动态没有版本发布，但信号非常清晰：**社区正在推动 dbt-core 从“功能可用”走向“配置更安全、报错更友好、治理更一致”**。  
对数据工程团队来说，近期最值得关注的方向是：**配置校验增强、snapshot 语义扩展、contracts/测试/文档等能力的用户体验打磨**。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，Apache Spark 仓库没有新版本发布，也没有新的 Issue 更新，社区讨论重心几乎全部集中在 Pull Request 流水线上。  
从 PR 内容看，今天的重点方向非常明确：**SQL 语义与兼容性修复、Structured Streaming 状态能力增强、Python / pandas 3 / Spark Connect 适配持续推进，以及基础设施与开发体验优化**。  
其中，**运行时空表上的 ROLLUP/CUBE 正确性修复、流流 Join 状态读能力升级、Spark Connect Python 内部复用优化**最值得重点关注。

---

## 2. 重要 PR 进展

> 注：过去 24 小时内无 Issue 更新，因此“社区热点 Issues”部分以下以 **值得重点关注的活跃 PR** 代替观察社区焦点。链接按题目中给出的 GitHub PR 编号标注。

### 1) [SPARK-53565][SQL] 修复运行时空表上 ROLLUP/CUBE 缺失 grand total 行
- **状态**：OPEN  
- **链接**：apache/spark PR #54938  
- **作者**：@xiaoxuandev  
- **为何重要**：这是一个典型的 **SQL 语义正确性** 问题。对于运行时为空的数据集，`ROLLUP` / `CUBE` 理论上仍应返回包含总计行的结果，但当前实现可能遗漏 grand total row。  
- **改动概述**：新增优化器规则 `SplitEmptyGroupingSet`，将包含空 grouping set 的 `Aggregate over Expand` 拆分成非空分支与空 grouping set 分支，再做 `Union` 合并。  
- **影响判断**：这类修复对 BI 查询、报表计算、兼容其他 SQL 引擎行为非常关键，尤其适用于边界条件较多的企业数仓场景。

---

### 2) [SPARK-55729][SS] 支持 stream-stream join 新 state format v4 的 state data source reader
- **状态**：OPEN  
- **链接**：apache/spark PR #54845  
- **作者**：@HeartSaVioR  
- **为何重要**：这是 **Structured Streaming 可观测性 / 可调试性** 的核心增强。  
- **改动概述**：让 state data source reader 能读取 stream-stream join 在新 state format v4 下的状态数据，并支持 `joinSide`、`storeName` 等选项。  
- **影响判断**：对于复杂流式 Join 故障排查、状态膨胀分析、运维诊断都很有价值，说明 Spark Streaming 正在持续补齐“状态可见性”能力。

---

### 3) [SPARK-55163][PYTHON][CONNECT] 复用 DataFrame 的 metadata plans
- **状态**：OPEN  
- **链接**：apache/spark PR #54939  
- **作者**：@davidgvad  
- **为何重要**：属于 **Spark Connect Python 客户端内部性能优化**。  
- **改动概述**：尝试复用 DataFrame 的 metadata plans，减少重复构造与冗余处理。  
- **影响判断**：虽然是内部实现层面的“小步优化”，但它直接反映出 Spark Connect 正在从“功能可用”走向“性能和工程质量提升”阶段，值得关注。

---

### 4) [SPARK-33902][SQL] 为 V2 数据源支持 CREATE TABLE LIKE
- **状态**：OPEN  
- **链接**：apache/spark PR #54809  
- **作者**：@viirya  
- **为何重要**：这是 **DataSource V2 能力补齐** 中非常实用的一项。  
- **改动概述**：支持在 V2 体系下执行 `CREATE TABLE LIKE`。  
- **影响判断**：这会影响 Lakehouse / Catalog 生态的一致性体验，尤其对 Iceberg、Delta 类 V2 语义用户很重要。它反映出社区仍在持续推动 V2 成为默认、完整的数据源抽象。

---

### 5) [SPARK-54878][SQL] 为 `to_json` 增加 `sortKeys` 选项
- **状态**：OPEN  
- **链接**：apache/spark PR #54717  
- **作者**：@xiaoxuandev  
- **为何重要**：看似小功能，实际对 **结果可复现性、测试稳定性、跨系统集成** 很实用。  
- **改动概述**：支持在 `to_json` 中按字母顺序输出 JSON object key，涉及 struct 与 map 的序列化逻辑。  
- **影响判断**：对需要稳定 JSON 输出用于对账、缓存命中、签名计算、Golden file 测试的场景很有帮助。

---

### 6) [SPARK-56074][INFRA] 改进 AGENTS.md，补充构建/测试命令与开发说明
- **状态**：OPEN  
- **链接**：apache/spark PR #54899  
- **作者**：@cloud-fan  
- **为何重要**：这是 **开发者体验（DX）与 AI 协作开发流程** 的信号型变更。  
- **改动概述**：重写 AGENTS.md，加入项目概述、pre-flight 检查、可执行的 SBT build/test 命令、PR 工作流说明等。  
- **影响判断**：说明 Spark 社区已经开始系统化适配 AI coding agent / 自动化开发助手，这对新贡献者 onboarding 和维护者协作效率都很重要。

---

### 7) [SPARK-53209][YARN] 为 YARN executor 和 AM 增加 ActiveProcessorCount JVM 选项
- **状态**：OPEN  
- **链接**：apache/spark PR #51948  
- **作者**：@jzhuge  
- **为何重要**：这是 **资源隔离与 JVM 行为一致性** 的基础设施改进。  
- **改动概述**：在 YARN 上启动 driver / executor 时，限制 JVM 感知到的 CPU 核数，避免 JVM 按宿主机全部核数配置 GC 或线程池。  
- **影响判断**：对多租户集群、容器化资源约束下的性能稳定性意义较大，属于“看不见但很关键”的运行时优化。

---

### 8) [SPARK-56128][K8S] K8s Dockerfile 使用 Java `21-jre` 替代 `21`
- **状态**：CLOSED  
- **链接**：apache/spark PR #54940  
- **作者**：@dongjoon-hyun  
- **为何重要**：直接影响 **Spark on Kubernetes 镜像体积、运行时依赖边界与默认部署体验**。  
- **改动概述**：Spark 4.2.0 的 Kubernetes Dockerfile 默认 Java 基础镜像从完整 JDK 改为 JRE。  
- **影响判断**：这有助于降低镜像体积、减少攻击面，也表明社区在默认容器镜像上更偏向生产运行场景而非开发调试场景。

---

### 9) [SPARK-56089][SQL] 使用 fdlibm 算法对齐 `asinh` / `acosh`
- **状态**：CLOSED  
- **链接**：apache/spark PR #54912  
- **作者**：@xiaoxuandev  
- **为何重要**：属于 **数值函数精度与跨引擎兼容性** 修复。  
- **改动概述**：将 `asinh` / `acosh` 从朴素公式替换为 OpenJDK `FdLibm` 对应实现，覆盖不同数值区间的分支逻辑。  
- **影响判断**：这种改动能减少边界输入上的误差和行为分歧，对科学计算、统计函数链路、跨引擎验证很关键。

---

### 10) [SPARK-56122][PS] `Series.cov` 改用 pandas-aware 数值 dtype 检查
- **状态**：CLOSED  
- **链接**：apache/spark PR #54933  
- **作者**：@ueshin  
- **为何重要**：继续推进 **pandas API on Spark 与 pandas 3 的兼容性对齐**。  
- **改动概述**：将 `Series.cov` 中的类型判断从 `np.issubdtype(..., np.number)` 调整为 pandas 的 `is_numeric_dtype`。  
- **影响判断**：这是典型的“兼容性细节修复”，能减少 extension dtype 等场景下的异常，是 pandas 3 适配工作的一部分。

---

## 3. 社区热点 Issues

过去 24 小时内，**没有新的 Issue 更新**。  
因此，从社区活跃度看，当前 Spark 社区主要通过 **PR 合并与评审** 推进工作，而不是在 GitHub Issues 中集中讨论。结合今日 PR，可推断当前隐性热点主要集中在以下几类：

1. **SQL 正确性与边界语义修复**  
   - 代表：PR #54938、#54912、#54717  
2. **Structured Streaming 状态格式与观测能力建设**  
   - 代表：PR #54845、#53443  
3. **Python / pandas 3 / Spark Connect 兼容与性能优化**  
   - 代表：PR #54939、#54933、#54929、#54926、#54928  
4. **基础设施与部署优化（K8s / YARN / 开发文档）**  
   - 代表：PR #54940、#51948、#54899  

---

## 4. 功能需求趋势

基于今日活跃 PR，可以提炼出 Spark 社区当前最关注的几个方向：

### 1) SQL 语义正确性与跨引擎一致性
Spark 社区仍在持续打磨 SQL 行为，尤其是边界条件和函数一致性：
- 空输入下的 grouping sets / rollup / cube 语义修复  
- 数学函数 `asinh` / `acosh` 与 fdlibm/OpenJDK 对齐  
- `to_json(sortKeys)` 提升输出稳定性  
- V2 `CREATE TABLE LIKE` 继续补齐 SQL 能力版图  

**趋势判断**：Spark SQL 正在从“功能覆盖”继续走向“细粒度行为一致、便于企业级验证”。

---

### 2) Structured Streaming 的状态可观测性增强
流流 Join 相关 PR 很突出：
- 新 state format v4 的 reader 支持  
- stream-stream join microbenchmark 基准测试（#53443，虽已关闭但体现方向）

**趋势判断**：社区重点不仅在新增流式功能，更在于提升 **性能可测、状态可读、问题可诊断** 的工程能力。

---

### 3) Python 生态深度适配：pandas 3、pandas-on-Spark、Spark Connect
今日多条 Python 相关 PR 指向同一主线：
- pandas 3 字符串恢复改进  
- `Series.cov` 数值类型检查修复  
- `GroupBy.quantile` 的 bool 处理对齐 pandas 3  
- black 检查默认关闭，转向 ruff  
- Spark Connect DataFrame metadata plan 复用

**趋势判断**：Python 生态已经不是“边缘接口”，而是 Spark 社区的主战场之一，重点正在从 API 覆盖转向 **版本兼容、行为一致、开发效率与客户端性能**。

---

### 4) 部署与运行时基础设施优化
- K8s 默认镜像改为 `21-jre`
- YARN 增加 `ActiveProcessorCount`
- AGENTS.md 改善构建与 PR 流程说明

**趋势判断**：社区正在同时优化两端：  
一端是 **生产部署的默认配置**，另一端是 **贡献者/自动化代理的开发体验**。

---

## 5. 开发者关注点

结合今日 PR，可以看到开发者反馈中的几个高频痛点：

### 1) 边界条件下的 SQL 结果正确性
例如 runtime-empty table、grouping set、数值函数特殊区间等问题，虽然不总是高频使用路径，但一旦出错会直接影响数据结果可信度。  
这说明企业用户对 Spark 的要求已经不只是“能跑”，而是“在极端情况下也要对”。

---

### 2) 流式状态难排查、难验证
关于 stream-stream join 的 state reader 与 microbenchmark 相关工作，反映出开发者和用户都需要：
- 更好地观察内部状态
- 更方便地验证新 state format 的行为
- 更可重复地评估性能变化

这类需求通常来自真实生产流式场景中的运维与调优压力。

---

### 3) pandas 3 升级带来的兼容性碎片问题
多个 pandas-on-Spark PR 都是“小修小补”式兼容：
- string dtype 恢复
- bool 行为对齐
- numeric dtype 判断修复

这说明 Python 数据生态升级后，Spark 侧需要逐个补平行为差异。  
对开发者来说，痛点不在单一大功能，而在于**大量细节兼容问题会影响稳定性与预期一致性**。

---

### 4) Spark Connect 需要继续优化内部效率
DataFrame metadata plan 复用类改动说明，Spark Connect 虽然功能快速成熟，但内部还有不少重复逻辑与性能优化空间。  
这也是从“功能建设期”走向“精细化工程期”的典型信号。

---

### 5) 构建、格式化、贡献流程仍需持续简化
- black -> ruff 的迁移余波仍在处理  
- AGENTS.md 补充更直接的 build/test 指南  
- 说明维护者希望降低贡献门槛，减少工具链摩擦

这对于大型 Apache 项目尤为重要：**开发流程越清晰，外部贡献越容易发生。**

---

## 6. 附：今日值得关注的其他 PR

- [apache/spark PR #53435](apache/spark PR #53435)  
  **[SQL, CORE, PYTHON] Zero Copy Pandas UDF**：探索通过 pyarrow-backed pandas 实现零拷贝 UDF 数据传递，方向很有前景，但目前已关闭且带有 WIP / Stale 标签。

- [apache/spark PR #53443](apache/spark PR #53443)  
  **[SS] 引入 stream-stream join microbenchmark**：虽已关闭，但体现社区对流式 Join 性能基准的重视。

- [apache/spark PR #54922](apache/spark PR #54922)  
  **[CORE] 新增 `SparkContext.isDriver()`**：统一代码中 driver 判断逻辑，属于代码可维护性提升。

- [apache/spark PR #54928](apache/spark PR #54928)  
  **[PYTHON] 默认关闭 black 检查**：确认 Python 格式化工具链转向 ruff。

---

如需，我还可以继续把这份日报整理成：
1. **适合发公众号/邮件的简版**  
2. **适合团队晨会汇报的 5 条 bullet 版**  
3. **按 SQL / Streaming / Python / Infra 分类的表格版**

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-22）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新的 Release，也没有新的 PR 更新，社区动态主要集中在 **1 条新近更新的 Issue**。  
今天最值得关注的是一个围绕 **扩展（extension）弃用流程自动化** 的工程改进提案，反映出社区正在从“功能定义”进一步走向“发布工程与规范治理”的细化阶段。  
这类问题虽然不直接改变查询语义，但对 **版本一致性、规范维护效率、发布流程可靠性** 都有实际影响。

---

## 3. 社区热点 Issues

> 过去 24 小时内仅有 1 条 Issue 更新，因此本节按实际数据列出。

### 1) 自动替换发布版本字符串，优化扩展弃用流程
- **Issue**: #1017 [Automatic release version string replacement](https://github.com/substrait-io/substrait/issues/1017)
- **状态**: OPEN
- **标签**: `github_actions`, `extension`, `1.0`
- **作者**: @yongchul
- **创建 / 更新**: 2026-03-21 / 2026-03-21
- **评论 / 👍**: 0 / 0

**为什么重要**  
该 Issue 直接关联到此前 #1014 引入的“扩展弃用（deprecating extensions）”机制。当前流程要求开发者在 PR 阶段提前写入准确的发布版本号，但这在实际协作中存在明显摩擦：一旦错过目标版本窗口，就需要重新修改 PR 中的版本信息。  
提案希望通过占位符（如 `##RELEASE_VERSION##`）加自动替换机制，把最终版本号的确定后移到发布流程中完成，从而降低维护成本与人为失误。

**对社区的意义**  
这类问题体现出 Substrait 社区已不只关注规范本身，还开始关注：
- 扩展生命周期管理是否足够可维护
- 发布流程能否减少人工同步成本
- GitHub Actions / 自动化工具链能否承接规范治理工作

**社区反应如何**  
目前还没有评论或表态，处于问题提出的早期阶段。但从问题描述看，诉求非常明确，且具有较强工程合理性，预计后续较容易转化为自动化改进或 CI/CD 流程增强。

---

## 4. 重要 PR 进展

过去 24 小时内 **没有新的 Pull Request 更新**。

---

## 5. 功能需求趋势

基于今天唯一更新的 Issue，可以看到社区当前有一个值得注意的趋势：

### 1) 规范治理与发布自动化正在成为关注点
虽然今天没有涉及查询优化、类型系统或跨引擎兼容性的新增讨论，但 #1017 表明社区正在补齐 **规范演进配套的工程能力**，尤其是：
- 扩展的弃用与版本标记
- 发布时机与版本字符串管理
- GitHub Actions 驱动的自动化发布流程

这说明 Substrait 正逐步进入一个更成熟的阶段：  
不仅要定义好标准，还要确保标准在持续演进过程中 **可发布、可维护、可审计**。

### 2) Extension 生命周期管理的重要性上升
Issue 标签中包含 `extension` 与 `1.0`，意味着这并非单纯的脚本小修，而是与 1.0 规范稳定性相关的治理工作。  
对数据引擎开发者而言，扩展何时弃用、如何标记、如何在版本间保持一致，是影响实现兼容性和升级成本的重要因素。

---

## 6. 开发者关注点

从今天的反馈中，可以提炼出几个开发者痛点：

### 1) 版本信息需要“晚绑定”
开发者不希望在功能或规范变更的提交阶段就手动锁定最终发布版本号，因为：
- 发布窗口可能变化
- PR 合并顺序不可预测
- 错过发布节奏后需要重复修改

这本质上是一个 **版本元数据与内容变更解耦** 的需求。

### 2) 弃用流程的人机工效需要提升
扩展弃用本是规范治理中的必要动作，但如果流程要求开发者掌握过多上下文（例如未来准确的 release version），就会增加协作负担。  
社区显然希望把这类“机械性步骤”交给自动化系统处理。

### 3) GitHub Actions 在规范仓库中的角色正在增强
Issue 明确带有 `github_actions` 标签，说明开发者希望借助 CI/CD 机制来保证发布流程一致性。  
这对于规范型项目尤其重要，因为其产出不仅是代码，还包括：
- 文档
- 版本元数据
- 扩展状态
- 向下兼容说明

---

### 附：今日涉及链接
- Issue #1017: https://github.com/substrait-io/substrait/issues/1017

如需，我也可以继续把这份日报整理成更适合 **飞书 / Slack / 邮件订阅** 的简版格式。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*