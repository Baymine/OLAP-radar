# OLAP 生态索引日报 2026-03-28

> 生成时间: 2026-03-28 01:21 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告
**日期：2026-03-28**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个非常明确的趋势：**从“功能补齐”转向“可用性、可治理性与互操作性”并进**。  
dbt-core 的讨论重心集中在配置校验、报错可定位性和 freshness 治理扩展；Spark 则继续深入优化器、DSv2、流状态与 PySpark 工程体验；Substrait 重点推进规范收敛、复杂 SQL 语义建模和扩展机制标准化。  
这说明行业正在从“能构建/能执行/能表达”进入“更稳定、更易迁移、更易治理”的阶段。  
对技术团队而言，未来竞争力不只来自性能，还来自 **错误可诊断性、语义一致性、生态兼容性和治理能力**。

---

## 2. 各项目活跃度对比

| 项目 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 活跃重点 |
|---|---:|---:|---|---|
| dbt-core | 8 | 9 | 无新版本 | 配置校验、错误提示、selector 稳定性、freshness 扩展 |
| Apache Spark | 2 | 10 | 无新版本 | SQL 优化器、DSv2、Structured Streaming 状态、PySpark 易用性 |
| Substrait | 0 | 10 | 无新版本 | 规范清理、破坏性变更、函数语义、复杂关系算子、扩展类型 |

### 简要解读
- **dbt-core**：Issue 与 PR 都较活跃，说明社区当前处于“用户问题密集反馈 + 快速修补”的状态。
- **Spark**：Issue 数不多，但 PR 很活跃，显示社区更多在沿既有路线持续推进内核能力。
- **Substrait**：几乎全部活跃度集中在 PR，说明当前是**规范设计和提案驱动**阶段，而不是用户问题驱动阶段。

---

## 3. 共同关注的功能方向

### 3.1 错误可诊断性与开发者体验提升
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：重点改善错误提示与定位能力，如 snapshot validation stacktrace 抑制、错误消息更准确、配置 typo warning。
- **Spark**：虽然今天直接的“报错优化”不多，但如 `emptyDataFrame(schema)`、类型支持修复、本地 API 打磨，本质上都在改善开发体验。
- **Substrait**：通过文档治理、breaking change policy、函数语义澄清来降低实现歧义，这也是另一种“开发者体验”。

**共同诉求**：  
生态正在从“底层能力可用”转向“出现问题时用户能否快速理解、定位并修复”。

---

### 3.2 语义一致性与配置/规范收敛
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：关注配置项被忽略、unknown flags、partial parsing 与 selector 行为不一致。
- **Spark**：关注优化器规则、SQL 语法能力、DSv2 内部抽象一致性。
- **Substrait**：集中处理 deprecated 类型移除、函数参数表达统一、窗口语义收紧、聚合字段替换。

**共同诉求**：  
无论是配置系统、查询规划器还是交换规范，社区都在减少“模糊地带”和“静默行为”，提高行为可预期性。

---

### 3.3 对现代分析型 SQL/数据模型的适配增强
**涉及项目：Spark、Substrait，dbt-core 间接受益**

- **Spark**：`QUALIFY`、增强 `INSERT REPLACE`、复杂 filter 推导、嵌套分区列支持。
- **Substrait**：GenerateRel、lateral join、窗口函数边界、多列 order-by、list 函数、无符号整数、JSON/扩展类型路线。
- **dbt-core**：虽然今天讨论焦点不在 SQL 方言本身，但 freshness 扩展、semantic model 错误定位等，反映其正向上层建模/语义治理演进。

**共同诉求**：  
生态正在适配更复杂的 SQL 表达、更丰富的类型系统和更真实的生产数据模型。

---

### 3.4 治理与可观测能力增强
**涉及项目：dbt-core、Spark**

- **dbt-core**：从 source freshness 走向 model freshness，是治理边界明显上移。
- **Spark**：对 stream-stream join state format v4 的读取支持，本质上是在增强流状态可观测性和调试能力。

**共同诉求**：  
不再只关心“任务跑完”，而是关心“状态是否可见、时效是否可控、问题是否可排查”。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 当前阶段特征 |
|---|---|---|---|---|
| dbt-core | 数据建模治理、配置管理、开发体验、freshness | 分析工程师、数据建模团队、现代数仓团队 | 以声明式建模和项目配置驱动的数据开发框架 | 向更细粒度治理与更强 DX 演进 |
| Apache Spark | 通用分布式计算、SQL 优化器、流批一体、DSv2、Python API | 数据平台团队、引擎开发者、ETL/流处理工程师 | 大规模执行引擎 + SQL/Streaming 双主线持续演进 | 内核深水区迭代，偏执行层与优化器增强 |
| Substrait | 跨引擎计划表示、函数/类型/关系语义标准化 | 查询引擎开发者、数据库内核团队、互操作平台建设者 | 通过标准规范与扩展机制实现跨系统互操作 | 快速标准化阶段，破坏性变更较多 |

### 核心差异总结

#### dbt-core：更接近“数据开发治理层”
它解决的是“模型如何定义、配置如何生效、时效如何治理、报错如何理解”的问题。  
今天的热点几乎都围绕日常开发体验和治理闭环，说明其价值中心仍是 **让数据团队更稳定地构建和维护分析模型**。

#### Spark：更接近“通用 OLAP/数据处理执行底座”
Spark 仍然承担着执行层、优化器、流处理、表访问接口等底层职责。  
今天的活跃点说明其关注重心依旧是 **执行效率、计划优化、复杂表格式接入和多语言 API 体验**。

#### Substrait：更接近“跨引擎语义交换标准”
Substrait 的重点不是直接跑任务，而是定义“计划、函数、类型、关系算子如何跨系统表达”。  
因此它的 PR 大多带有规范和破坏性变更属性，说明其核心价值在于 **互操作性和长期标准统一**。

---

## 5. 社区热度与成熟度

### 5.1 社区热度判断

#### 最“用户问题驱动”的是 dbt-core
- 8 个活跃 Issue、9 个活跃 PR；
- 热点问题多为配置被忽略、错误定位不足、缓存/解析异常等高频使用痛点。

这说明 dbt-core 社区与真实用户场景连接非常紧密，问题反馈密度高，属于**高使用强度下的活跃维护**。

#### 最“内核推进驱动”的是 Spark
- 仅 2 个活跃 Issue，但有 10 个活跃 PR；
- 大量改动落在优化器、DSv2、流状态、PySpark 类型系统等内核层。

这显示 Spark 社区已经比较成熟，很多演进由长期路线图驱动，而不完全依赖短周期问题反馈。

#### 最“规范提案驱动”的是 Substrait
- 0 个 Issue、10 个 PR；
- 聚焦 breaking change、函数系统、关系语义和文档政策。

这说明 Substrait 当前仍处于**高密度规范塑形阶段**。热度体现在设计讨论和标准演进上，而不是终端用户 bug 修复。

---

### 5.2 成熟度判断

| 项目 | 成熟度判断 | 原因 |
|---|---|---|
| dbt-core | 高成熟度产品，持续向治理深水区扩展 | 已有稳定用户面，问题更多集中在边界行为、配置一致性、DX 提升 |
| Spark | 极高成熟度基础引擎，持续精修核心能力 | 关注点已深入到 CBO、属性传播、状态格式、DSv2 内部可维护性 |
| Substrait | 生态成熟度上升中，但规范本体仍处快速迭代阶段 | 破坏性变更频繁，说明标准尚未完全稳定，但方向越来越清晰 |

---

## 6. 值得关注的趋势信号

### 趋势一：数据治理边界正在上移到“模型层”
**信号来源**：dbt-core 的 Model freshness Epic。  
**行业含义**：治理对象不再停留在 source 表，未来会向 model、semantic layer、指标层持续延伸。  
**对数据工程师的参考价值**：  
应提前规划 freshness、SLA、质量规则在模型层的落地方式，而不是只监控上游源数据。

---

### 趋势二：静默失败正在成为社区重点打击对象
**信号来源**：dbt-core 的 ignored configs / unknown flags；Spark 和 Substrait 的语义/接口收敛。  
**行业含义**：现代数据基础设施越来越重视“显式失败”“明确 warning”“语义可验证”。  
**参考价值**：  
在选型和自研时，应优先考虑那些能提供强校验、强约束、强反馈机制的工具链，因为它们能显著降低生产排障成本。

---

### 趋势三：OLAP 引擎竞争焦点正转向“优化器质量”
**信号来源**：Spark 的 CBO、outputOrdering 推导、复杂 join filter 推导；Substrait 的复杂 SQL 关系建模。  
**行业含义**：单纯支持 SQL 已不足够，谁能更准确表达和利用物理属性、执行代价、复杂语义，谁就更有优势。  
**参考价值**：  
数据平台团队应更关注执行计划质量、规则透明度、列式能力和语义表达能力，而不是只看 benchmark 峰值。

---

### 趋势四：跨引擎互操作将越来越依赖标准语义层
**信号来源**：Substrait 对函数、类型、窗口、lateral join、扩展机制的持续推进。  
**行业含义**：未来查询编译器、加速器、执行后端之间的协同，越来越可能建立在标准化 IR/计划交换之上。  
**参考价值**：  
如果团队正在布局多引擎架构、查询网关、加速层或自定义优化器，应该尽早跟踪 Substrait 一类规范。

---

### 趋势五：流处理和批处理一样，正在进入“可观测性优先”阶段
**信号来源**：Spark 对 state format v4 读取支持及其后续修复。  
**行业含义**：状态不再只是引擎内部实现细节，而是需要可读、可调试、可分析。  
**参考价值**：  
做流式平台建设时，不应只关注吞吐和延迟，也要关注状态可视化、状态兼容性和升级可运维性。

---

### 趋势六：Python 与工程化工具链体验仍在持续上升
**信号来源**：Spark 的 PySpark API 与 mypy/type hint 打磨；dbt-core 对 Python 依赖与工具链兼容性的持续处理。  
**行业含义**：数据基础设施正在向“更工程化的开发方式”靠拢。  
**参考价值**：  
团队可以更积极地引入类型检查、自动化测试、静态分析和 schema-first 开发模式，降低数据项目维护成本。

---

## 结论

从今天三大项目的动态看，OLAP 生态正在同步推进三条主线：

1. **治理上移**：从源数据管理走向模型、语义、状态与 SLA 管理；  
2. **语义收敛**：从“支持功能”走向“统一行为与标准表达”；  
3. **工程化增强**：从“可运行”走向“易诊断、易维护、易迁移”。

对技术决策者而言：
- 若关注分析工程与治理闭环，**dbt-core** 的 model freshness 和配置校验演进最值得跟踪；
- 若关注执行性能与底层平台能力，**Spark** 的优化器、DSv2 与流状态演进更关键；
- 若关注多引擎互通与长期标准化，**Substrait** 是最值得提前布局的方向。

如果你愿意，我还可以继续把这份报告整理成：
1. **适合管理层阅读的一页纸摘要版**  
2. **适合飞书/公众号发布的周报版**  
3. **带“项目建议动作”的 CTO 决策版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报 · 2026-03-28

## 1. 今日速览

过去 24 小时内，dbt-core 没有新版本发布，但社区在“错误提示可用性”“配置项校验”“解析与选择器稳定性”三个方向非常活跃。  
一方面，多条 Issue 聚焦于配置被忽略、报错定位不足、partial parsing 缓存异常等影响日常开发体验的问题；另一方面，PR 也明显集中在提升 CLI 报错质量、补齐配置校验、修复 selector / source freshness 相关行为。  
此外，**Model freshness checks** 作为新的 Epic 已进入讨论阶段，显示 dbt-core 正在从传统 source freshness 向更细粒度的模型新鲜度治理扩展。

---

## 3. 社区热点 Issues

> 注：过去 24 小时内更新的 Issue 共 8 条，以下按重要性全部纳入。

### 1) #12719 [EPIC] Model freshness checks
**为什么重要**：这是今天最值得关注的方向性议题。dbt Core 已长期支持 source freshness，而这条 Epic 说明社区正在推动“模型层新鲜度检查”，把数据时效治理从外部源表扩展到 dbt 构建产物本身。对于数仓 SLA、语义层、指标平台联动都很关键。  
**社区反应**：新开 Epic，已有讨论，说明该能力仍处于需求澄清和方案打磨阶段，但战略意义很强。  
链接：dbt-labs/dbt-core Issue #12719

### 2) #12706 [Bug] post_hook configs in dbt_project.yml are ignored for custom materializations
**为什么重要**：`post_hook` 是很多团队实现审计、授权、注释、UDF 发布后动作的重要机制。如果在自定义 materialization（如 function）场景下被静默忽略，会直接导致生产行为与预期不一致。  
**社区反应**：虽然评论不多，但问题描述清晰，且属于“静默失败”类型，通常优先级会较高。  
链接：dbt-labs/dbt-core Issue #12706

### 3) #12722 [Bug] dbt compile "relation_name none is not an allowed value" has no reference to where the breakage is
**为什么重要**：这类问题的核心不只是编译失败，而是**报错缺少定位信息**。随着 semantic model 等新能力引入，配置链路更复杂，开发者越来越依赖精准错误上下文。  
**社区反应**：刚创建不久，已被关注；属于典型 DX（开发者体验）痛点。  
链接：dbt-labs/dbt-core Issue #12722

### 4) #12327 [Bug] Warning about `dataset` that should be under config for sources
**为什么重要**：该问题带有 `backport 1.11.latest` 和 `dep warnings` 标签，说明它不仅影响当前用户，还可能进入维护分支回补。对 BigQuery 等依赖 `dataset` 概念的用户尤其敏感。  
**社区反应**：已有 13 条评论、4 个赞，讨论热度在今日 Issue 中较高。  
链接：dbt-labs/dbt-core Issue #12327

### 5) #9246 Deadlocks in postgres related to drop cascade of `__dbt_backup` tables
**为什么重要**：这是偏生产稳定性的问题。涉及 Postgres 在 `run` 期间对 `__dbt_backup` 表做 `drop cascade` 时出现死锁，影响并发运行、重建流程及线上可靠性。  
**社区反应**：虽然是较早 Issue，但持续被更新，且有 9 个赞，说明问题仍未彻底消退。  
链接：dbt-labs/dbt-core Issue #9246

### 6) #11289 [Bug] `alias` ignored and cache invalidation issue when using partial parse
**为什么重要**：partial parsing 是 dbt 提升开发与 CI 性能的重要机制，一旦缓存失效逻辑不稳定，就可能导致“偶发且随机”的错误，最难排查。`alias` 被忽略更会影响对象命名正确性。  
**社区反应**：评论和点赞不高，但这是典型高隐蔽性问题，值得核心维护者重视。  
链接：dbt-labs/dbt-core Issue #11289

### 7) #11948 [BUG] disabled model is not disabled when Core parses
**为什么重要**：虽然已关闭，但它反映了 Core 与 Fusion 在解析行为上的不一致：一个被禁用的模型/源在 Core parse 阶段仍触发错误。对 package 生态和跨运行时一致性很关键。  
**社区反应**：问题已关闭，说明近期可能已有结论或处理；对使用第三方包的团队有参考价值。  
链接：dbt-labs/dbt-core Issue #11948

### 8) #12385 [Feature] requirements compatibility with mypy 1.20.x
**为什么重要**：这是典型的开发依赖兼容性议题，关系到类型检查工具链和上游包版本演进。对贡献者、插件作者和维护 CI 的团队都重要。  
**社区反应**：已关闭且有 5 个赞，说明社区确实关注 Python 工具链兼容性。  
链接：dbt-labs/dbt-core Issue #12385

---

## 4. 重要 PR 进展

> 注：过去 24 小时内更新的 PR 共 9 条，以下全部纳入。

### 1) #12700 fix: suppress stacktrace when snapshot validation fails
**内容**：修复 YAML snapshot 缺少 `strategy` / `unique_key` 时，CLI 输出整段 Python stacktrace 的问题，改为更友好的错误提示。  
**意义**：直接提升失败场景的可读性，减少用户被底层异常淹没。属于非常典型且高价值的 DX 改进。  
链接：dbt-labs/dbt-core PR #12700

### 2) #12691 Fix: improve error message for similar database identifiers to reference correct node type
**内容**：修复 `AmbiguousCatalogMatchError` 总是写成 “created by the model” 的问题，使其能正确区分 source、seed、snapshot、model 等节点类型。  
**意义**：这是错误语义准确性的增强，尤其适合复杂项目中做 catalog / metadata 排查。  
链接：dbt-labs/dbt-core PR #12691

### 3) #12646 feat: add docs config for sources
**内容**：为 sources 增加 docs config 支持。  
**意义**：说明 dbt 正在继续补齐资源类型之间的文档配置一致性，利好文档治理、目录展示与元数据统一。  
链接：dbt-labs/dbt-core PR #12646

### 4) #12689 feat: warn on unknown flags in dbt_project.yml
**内容**：当用户在 `dbt_project.yml` 中配置了未知 flag（如拼写错误）时给出 warning，而不是静默忽略。  
**意义**：非常实用。它能显著减少配置 typo 导致的“明明写了但不生效”的排障成本。  
链接：dbt-labs/dbt-core PR #12689

### 5) #12562 fix: use tuple membership check instead of substring match in selection_arg
**内容**：修复 `show.py` / `compile.py` 中对 `selection_arg` 的一处一字符级 bug，避免 tuple 首元素参与错误匹配。  
**意义**：虽是小修，但影响 selector / 结果过滤正确性，容易引发“选中对象不对”的诡异问题。  
链接：dbt-labs/dbt-core PR #12562

### 6) #12718 Pass selectors to source freshness
**状态**：已关闭  
**内容**：将 `config.selectors` 正确传递给 `source freshness` task，修复运行时报错。  
**意义**：和今天的 freshness 主题形成呼应，说明维护者正在补 source freshness 在任务编排层的稳定性。  
链接：dbt-labs/dbt-core PR #12718

### 7) #12720 ensures that tests hit selector selector method
**状态**：已关闭  
**内容**：补测试，确保测试覆盖到 selector 相关方法。  
**意义**：虽然不是功能改动，但这是典型的回归防护，说明 selector 逻辑近期是活跃改动区。  
链接：dbt-labs/dbt-core PR #12720

### 8) #12714 updated pathspec version
**状态**：已关闭  
**内容**：更新 `pathspec` 版本，关联 #12385。  
**意义**：反映维护者在推进依赖冲突和未来兼容性治理，尤其对 Python 生态演进较敏感的用户有价值。  
链接：dbt-labs/dbt-core PR #12714

### 9) #12712 random change in README to test some weird Github issue
**状态**：已关闭  
**内容**：测试性质的 README 变更。  
**意义**：业务价值有限，但反映仓库维护过程中也存在 GitHub 工作流/平台层面的调试动作。  
链接：dbt-labs/dbt-core PR #12712

---

## 5. 功能需求趋势

### 1) 数据新鲜度治理正在从 Source 扩展到 Model
从 #12719 与 #12718 可以看出，freshness 已成为活跃主题。社区不再满足于仅监控外部源表，而是希望把 dbt 产出的模型也纳入时效校验体系。

### 2) 配置校验与“静默失败”治理成为重点
#12706、#12327、#12689 共同表明：用户最不满意的不是“报错”，而是**配置写了却被忽略**、warning 不准确、或者缺少明确反馈。未来 dbt-core 可能继续加强 YAML / project 配置层的显式校验。

### 3) 错误消息与可定位性持续改善
#12722、#12700、#12691 都指向同一趋势：社区希望报错能明确告诉用户“哪里错、哪类节点错、如何改”，而不是暴露底层异常或模糊表述。

### 4) 解析缓存与选择器稳定性仍是基础设施重点
#11289、#12562、#12720 说明 partial parsing、selection_arg、selector 测试覆盖仍是高频维护区。这类问题往往不显眼，但直接影响大项目的开发效率和行为一致性。

### 5) 依赖与工具链兼容性保持关注
#12385 与 #12714 体现出对 Python 依赖版本、类型检查生态兼容性的持续投入，说明 dbt-core 仍在积极适配更现代的开发工具链。

---

## 6. 开发者关注点

### 1) “报错能不能告诉我具体是哪个文件/节点坏了？”
这是今天最明显的痛点之一。无论是 semantic model 编译失败，还是 snapshot 配置缺失，开发者都希望收到**可直接行动**的错误信息。

### 2) “为什么配置写了却没生效？”
从 `post_hook` 被忽略、未知 flags 静默失效，到 source 的 `dataset` warning，配置层的可预期性是当前高频诉求。数据工程团队更希望 dbt 在配置错误时尽快失败或给出强提示。

### 3) “解析/缓存问题太随机，难复现也难排查”
partial parsing 相关问题之所以棘手，在于它常表现为偶发、不稳定、环境相关。对 CI 和大型 monorepo 项目尤其影响明显。

### 4) “生产环境稳定性仍需加强”
Postgres deadlock 这类问题提醒我们：dbt-core 不仅是开发工具，也是生产执行引擎。对象替换、备份表清理、DDL 行为在高并发环境下的安全性仍是核心关注点。

### 5) “freshness 需要更贴近实际建模流程”
Epic 级别的 model freshness 讨论说明，社区希望 dbt 在数据质量/时效治理上不只覆盖 source，而是支持从 source → model → semantic layer 的连续监控链路。

---

如果你愿意，我还可以继续把这份日报整理成更适合公众号/飞书群发布的 **“简版播报”** 或 **“表格版周报格式”**。

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Apache Spark 没有新版本发布，但社区在 **Spark SQL 优化器、Data Source V2、PySpark 易用性、Structured Streaming 状态管理** 等方向非常活跃。  
从 PR 动向看，今天最值得关注的是 **流状态格式 v4 支持落地并触发后续修复**、**SQL/优化器语义增强**，以及 **PySpark API 与类型系统持续打磨**。  
Issue 数量不多，但都指向较明确的产品演进方向：**CBO 更好理解列式执行成本**，以及 **SQL 语法进一步向现代数仓体验靠拢**。

---

## 2. 社区热点 Issues

> 说明：过去 24 小时内仅有 2 条 Issue 更新，因此本节按“全部值得关注 Issue”呈现，无法凑满 10 条。

### 1) Spark CBO considers columnar operator by generic interface
- **Issue**: #55058  
- **链接**: https://github.com/apache/spark/issues/55058
- **重要性**: 该议题直指 Spark SQL 优化器的核心短板之一：**CBO 目前对列式算子的收益与代价理解不足**。在现代 OLAP 场景中，列式执行常常带来更高 CPU 利用率、更好的压缩与向量化收益，但 row/column 转换也会引入额外成本。
- **为什么值得关注**: 如果 Spark 能把列式执行成本建模纳入通用接口，优化器在选择物理计划时会更准确，尤其对 **Photon/Velox/Gluten/Arrow 风格加速链路**、以及原生列式算子越来越多的生态特别关键。
- **社区反应**: 目前刚创建，暂无评论与点赞，但议题技术含金量高，预计后续会吸引 SQL/Catalyst 与执行引擎方向开发者参与讨论。

### 2) Feature Request: Add support for qualify clause in SQL
- **Issue**: #55052  
- **链接**: https://github.com/apache/spark/issues/55052
- **重要性**: `QUALIFY` 是数据仓库用户非常熟悉的 SQL 能力，可直接对窗口函数结果做过滤，避免多层子查询，显著提升 SQL 可读性与迁移便利性。
- **为什么值得关注**: 随着 Spark SQL 越来越被用于统一湖仓查询层，兼容现代分析型 SQL 方言是高频诉求。`QUALIFY` 的支持会直接改善 **Databricks / Snowflake / BigQuery** 用户迁移与日常开发体验。
- **社区反应**: 当前暂无评论，但这是典型的“用户体验型 SQL 功能”，往往能得到较广泛支持，后续要点会集中在 **语法设计、解析器兼容性、与窗口过滤语义的一致性**。

---

## 3. 重要 PR 进展

> 从过去 24 小时活跃 PR 中，筛选 10 条最值得数据工程师和内核开发者关注的变更。

### 1) 支持在 stream-stream join 上读取新 state format v4 的状态
- **PR**: #54845  
- **链接**: https://github.com/apache/spark/pull/54845
- **状态**: 已关闭（通常意味着已合入或完成流程）
- **内容**: 为 **Structured Streaming state data source reader** 增加对 **stream-stream join 的 state format v4** 读取支持。
- **意义**: 这是流式状态可观测性与调试能力的重要补强，尤其对复杂 join 状态诊断、状态排障、状态数据分析有现实价值。

### 2) 修复 SPARK-55729 / SPARK-55630 相互影响导致的测试失败
- **PR**: #55071  
- **链接**: https://github.com/apache/spark/pull/55071
- **状态**: Open
- **内容**: 针对前述流状态格式相关改动的 follow-up，修复由于两个变更存在依赖关系而引入的测试失败。
- **意义**: 这说明 **Structured Streaming 状态格式演进正在持续推进**，同时也反映出状态兼容性和测试稳定性仍是高敏感区域。

### 3) 清理 `SortExec.rowSorter` 中令人困惑的防御性代码
- **PR**: #55048  
- **链接**: https://github.com/apache/spark/pull/55048
- **状态**: Open
- **内容**: 移除 `SortExec.rowSorter` 中容易误导维护者的防御性逻辑，并补充警告注释。
- **意义**: 虽然不是功能增强，但属于 **执行引擎可维护性改进**。这类改动有助于降低未来排序相关 bug 风险，也体现出社区在持续收敛技术债。

### 4) 简化 `DataSourceV2ScanRelation` 字段提取方式
- **PR**: #55070  
- **链接**: https://github.com/apache/spark/pull/55070
- **状态**: Open
- **内容**: 减少大量依赖 case class 构造参数位置的 pattern match，降低匹配点对构造器 arity 的耦合。
- **意义**: 对 **DSv2 内核演进** 很关键。它提升的是内部 API 的可维护性和演化弹性，有利于后续继续扩展扫描关系对象。

### 5) DSV2 PartitionPredicate 支持嵌套分区列
- **PR**: #54995  
- **链接**: https://github.com/apache/spark/pull/54995
- **状态**: Open
- **内容**: 为 **Data Source V2 的分区谓词下推** 增加嵌套字段支持，包括 filter flattening 与 schema 映射处理。
- **意义**: 这是典型的 **湖仓表格式/复杂 schema 友好性增强**。对包含 struct 分区信息的数据源、复杂分区模型和高级裁剪优化都非常有价值。

### 6) 为 `KeyedPartitioning` 推导 `outputOrdering`
- **PR**: #55036  
- **链接**: https://github.com/apache/spark/pull/55036
- **状态**: Open
- **内容**: 基于 `KeyedPartitioning` 的 key 表达式推导计划节点的 `outputOrdering`。
- **意义**: 这是优化器/物理计划属性传播的重要增强。若排序属性能被更准确识别，可减少冗余排序或提升后续规则优化空间，对 SQL 性能有潜在收益。

### 7) 改进 `InferFiltersFromConstraints`，从复杂 join 表达式推导过滤条件
- **PR**: #55045  
- **链接**: https://github.com/apache/spark/pull/55045
- **状态**: Open
- **内容**: 强化 Spark SQL 优化器规则，使其能够从更复杂的 join 条件中推导 filter。
- **意义**: 这属于 **Catalyst 规则质量提升**。更强的谓词推导意味着更好的 filter pushdown、数据裁剪和 join 前过滤效果，直接关系到 OLAP 查询性能。

### 8) 新增 `INSERT INTO ... REPLACE ON/USING` SQL 语法
- **PR**: #54722  
- **链接**: https://github.com/apache/spark/pull/54722
- **状态**: Open
- **内容**: 为 `INSERT` 引入更灵活的 replacement 语法，可按条件或列进行替换。
- **意义**: 这是很有代表性的 **SQL DML 能力扩展**。如果落地，将增强 Spark SQL 在批量修正、条件覆盖、类 upsert 工作流中的表达能力。

### 9) Spark SQL `reverse` 支持 `BinaryType`
- **PR**: #55051  
- **链接**: https://github.com/apache/spark/pull/55051
- **状态**: Open
- **内容**: 修复 `reverse` 在 `BinaryType` 上报类型不匹配的问题，改为字节级反转。
- **意义**: 这是一个小而实用的函数一致性修复。对于处理二进制 payload、编码数据、哈希值等场景，能避免不必要的 UDF 或绕路实现。

### 10) PySpark 新增 `SparkSession.emptyDataFrame(schema)` API
- **PR**: #55055  
- **链接**: https://github.com/apache/spark/pull/55055
- **状态**: Open
- **内容**: 提供更直接的 API，用指定 schema 创建空 DataFrame。
- **意义**: 这是典型的 **开发体验提升**。当前用户通常需要通过 `createDataFrame([], schema)` 等方式曲线实现，新 API 会让测试、初始化、管道占位、schema-first 编程更自然。

---

## 4. 功能需求趋势

基于今天全部 Issues 与活跃 PR，可归纳出 Spark 社区的几个明显方向：

### 1) 查询优化器继续向“更懂执行代价”演进
- 代表议题：#55058、#55036、#55045  
- 趋势解读：社区不再满足于传统规则优化，而是希望 Spark 能更好理解 **列式执行收益、排序属性、复杂约束推导** 等物理层信息。这说明 Spark 正持续向更高质量的 OLAP 优化器靠拢。

### 2) SQL 语法能力向现代数据仓库体验对齐
- 代表议题：#55052、#54722、#55064  
- 趋势解读：包括 `QUALIFY`、更强的 `INSERT REPLACE`、v2 `DESCRIBE TABLE .. PARTITION` 在内，社区正在补齐常见分析型 SQL 体验。重点不只是“能跑”，而是 **迁移友好、表达简洁、语义完整**。

### 3) Data Source V2 仍是核心演进主线
- 代表议题：#54995、#55070、#55046  
- 趋势解读：DSv2 相关工作覆盖 **内部抽象、谓词下推、文档完善** 三个层面，说明其已进入“从框架搭建走向细节打磨与生态可用性提升”的阶段。

### 4) Structured Streaming 持续补强状态能力
- 代表议题：#54845、#55071、#55039  
- 趋势解读：状态格式升级、状态读取能力增强、Python Stateful Processor 序列化优化，表明流处理仍是 Spark 的重点投资方向，尤其关注 **可维护性、可观测性、跨语言性能**。

### 5) PySpark 进入“API 细节完善 + 类型系统治理”阶段
- 代表议题：#55055、#55069、#55067、#55068、#55065  
- 趋势解读：除了新增 API，今天还有多项与 type hint、mypy、导入逻辑相关的变更，体现出 PySpark 正在提升 **静态检查友好度、开发工具链兼容性、Pythonic 使用体验**。

---

## 5. 开发者关注点

### 1) 列式执行收益与转换成本缺少统一建模
- 这直接影响 Spark 在混合 row/column 执行路径中的决策质量。
- 对接向量化执行、原生列式后端时，这个问题会越来越突出。

### 2) SQL 易用性与方言兼容仍有较强诉求
- 用户希望 Spark SQL 更接近现代云数仓的使用习惯。
- `QUALIFY`、增强 DML 语法这类需求，本质上是在降低迁移和开发门槛。

### 3) DSv2 的复杂 schema 与高级裁剪能力仍在补课
- 嵌套分区列支持说明真实生产数据模型已超出“扁平 schema + 简单分区”的假设。
- 开发者期待 Spark 在复杂表元数据和下推能力上更稳健。

### 4) Structured Streaming 的状态演进带来测试与兼容性压力
- 新状态格式和读取能力提升了可观测性，但也使测试依赖关系更复杂。
- 这反映出流式状态层仍是 Spark 中最容易引发回归问题的区域之一。

### 5) Python 用户强烈需要更自然的 API 与更好的类型支持
- `emptyDataFrame` 这样的改动虽然小，但非常贴近实际开发痛点。
- 类型提示、mypy 清理等工作说明社区在认真改善 PySpark 的工程化体验。

---

## 附：今日值得跟踪的链接清单

- Issue #55058: https://github.com/apache/spark/issues/55058
- Issue #55052: https://github.com/apache/spark/issues/55052
- PR #54845: https://github.com/apache/spark/pull/54845
- PR #55071: https://github.com/apache/spark/pull/55071
- PR #55048: https://github.com/apache/spark/pull/55048
- PR #55070: https://github.com/apache/spark/pull/55070
- PR #54995: https://github.com/apache/spark/pull/54995
- PR #55036: https://github.com/apache/spark/pull/55036
- PR #55045: https://github.com/apache/spark/pull/55045
- PR #54722: https://github.com/apache/spark/pull/54722
- PR #55051: https://github.com/apache/spark/pull/55051
- PR #55055: https://github.com/apache/spark/pull/55055

如果你愿意，我也可以进一步把这份日报整理成更适合公众号/飞书周报风格的版本，或者输出成 Markdown 表格版。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-28）

## 1. 今日速览

过去 24 小时内，Substrait 主仓库没有新的 Release，也没有新的 Issue 更新，社区讨论重心几乎全部集中在 Pull Request 上。  
从 PR 动向看，当前主线非常明确：一方面持续推进 **规范清理与破坏性变更落地**，另一方面快速补齐 **函数语义、扩展类型、复杂关系算子与文档治理**。  
尤其值得关注的是，围绕 **弃用类型移除、窗口函数语义收紧、扩展函数/类型标准化、LATERAL/UNNEST 语义建模** 的提案正在形成一波集中演进。

---

## 2. 重要 PR 进展

> 过去 24 小时无 Issue 更新，因此今日重点转向 PR。以下挑选 10 个最值得数据基础设施开发者关注的变更。

### 1) PR #994 — 移除已弃用的 time / timestamp / timestamp_tz 类型
- **状态**：OPEN，PMC Ready  
- **作者**：@nielspardon  
- **重要性**：这是近期最核心的规范清理之一，属于明确的 **BREAKING CHANGE**。该 PR 将旧的时间相关类型从 proto、dialect schema、扩展 YAML、ANTLR、测试、文档等多个层面一并删除。
- **影响**：对实现方来说，这意味着旧版类型兼容层将被进一步压缩，执行引擎、计划生成器、binding/验证器都需要同步升级。
- **链接**：https://github.com/substrait-io/substrait/pull/994

### 2) PR #932 — 窗口函数必须显式指定边界，并支持多个 order-by 列
- **状态**：OPEN  
- **作者**：@benbellick  
- **重要性**：也是一个高影响的 **BREAKING CHANGE**。它收紧了窗口函数绑定语义，取消默认边界值，同时扩展了多列排序能力。
- **影响**：对窗口聚合、排序稳定性和跨引擎兼容极其关键，尤其对 SQL 编译器、计划转换器和执行层窗口算子实现者影响较大。
- **链接**：https://github.com/substrait-io/substrait/pull/932

### 3) PR #917 — 引入 GenerateRel 以支持 lateral view / unnest / explode
- **状态**：OPEN  
- **作者**：@EpsilonPrime  
- **重要性**：这是关系代数表达能力上的明显增强。GenerateRel 用于描述“每个输入行产生 0 到多行输出”的表函数展开语义。
- **影响**：对 Spark 风格 `LATERAL VIEW`、数组/嵌套结构展开、半结构化数据处理、湖仓 SQL 互操作都非常重要。
- **链接**：https://github.com/substrait-io/substrait/pull/917

### 4) PR #973 — 在 JoinRel 中引入 lateral join 以支持相关子查询求值
- **状态**：OPEN  
- **作者**：@yongchul  
- **重要性**：该 PR 试图补齐相关子查询难以完全 decorrelate 的语义表达空白。
- **影响**：对复杂 SQL 计划、联接语义、优化器与执行器之间的可移植性帮助很大，也意味着 Substrait 正在更认真地覆盖高级 SQL 语义。
- **链接**：https://github.com/substrait-io/substrait/pull/973

### 5) PR #953 — 新增无符号整数扩展类型 u8/u16/u32/u64
- **状态**：OPEN，PMC Ready  
- **作者**：@kadinrabo  
- **重要性**：为 Substrait 增加一组一等公民式扩展类型，并补充算术函数支持与测试覆盖。
- **影响**：这对 Arrow、Velox、ClickHouse、DuckDB 等不同类型系统之间的映射很有现实意义，尤其在二进制协议、湖仓元数据和跨语言运行时时常需要无符号语义。
- **链接**：https://github.com/substrait-io/substrait/pull/953

### 6) PR #1002 — 删除 Aggregate.Grouping.grouping_expressions
- **状态**：OPEN，PMC Ready  
- **作者**：@nielspardon  
- **重要性**：这是对已弃用聚合字段的正式移除，延续了近阶段“清理 deprecated surface”的治理方向。
- **影响**：聚合节点编码、解析器和兼容性测试需要切换到 `expression_references`，对实现方属于“必须跟进”的 schema 变更。
- **链接**：https://github.com/substrait-io/substrait/pull/1002

### 7) PR #1019 — 弃用 std_dev / variance 的 function options 写法，转向 enum arguments
- **状态**：OPEN  
- **作者**：@nielspardon  
- **重要性**：这是函数签名表达模型上的规范统一。PR 明确不再鼓励使用 function options 表示统计函数的模式，而改用 enum arguments。
- **影响**：这有助于减少函数系统中的歧义，提高自动化校验、代码生成和多语言 SDK 的一致性。
- **链接**：https://github.com/substrait-io/substrait/pull/1019

### 8) PR #1012 — std_dev / variance 支持整型参数
- **状态**：OPEN，PMC Ready  
- **作者**：@nielspardon  
- **重要性**：与 #1019 相辅相成。除了签名形式统一外，该 PR 还扩展了统计函数对整数输入的支持。
- **影响**：对实际 SQL 兼容性很重要，因为很多数据库默认允许对整数列直接做方差/标准差统计。
- **链接**：https://github.com/substrait-io/substrait/pull/1012

### 9) PR #1020 — 新增 subscript_operator 与 index_of 列表函数
- **状态**：OPEN  
- **作者**：@benbellick  
- **重要性**：这是核心函数库朝实用化推进的一步，直接补齐了常见 list 操作。
- **影响**：对数组/列表类型广泛使用的 OLAP、湖仓 SQL、半结构化查询场景尤其关键，也有助于减少不同引擎在数组访问语义上的碎片化。
- **链接**：https://github.com/substrait-io/substrait/pull/1020

### 10) PR #1026 — 补充“支持的库”与“破坏性变更策略”文档
- **状态**：OPEN  
- **作者**：@vbarua  
- **重要性**：虽然是文档类 PR，但战略价值很高。它试图明确生态支持范围与 breaking change policy。
- **影响**：随着规范频繁演进，开发者最需要的是稳定预期。这类治理文档直接关系到实现者是否敢于跟进、如何规划升级节奏。
- **链接**：https://github.com/substrait-io/substrait/pull/1026

---

## 3. 社区热点 Issues

过去 24 小时内 **没有新的 Issue 更新**。  
因此，今天无法基于新增活跃度筛选 10 个热点 Issue。

不过从当前活跃 PR 所映射的问题域来看，社区关注点主要集中在以下“隐含议题”：

1. **弃用能力何时彻底移除，如何给实现者留出升级窗口**  
2. **函数系统中 option、enum argument、类型绑定的边界如何统一**  
3. **复杂 SQL 语义（窗口、相关子查询、LATERAL/UNNEST）怎样稳定建模**  
4. **扩展类型与核心规范之间的边界如何划分**  
5. **文档是否足够清晰，能否降低不同实现之间的歧义**

> 由于数据源中无 Issue 条目，本文不虚构 Issue 链接与社区反馈。

---

## 4. 功能需求趋势

结合今日所有 PR，可以提炼出当前 Substrait 社区最集中的 5 个功能方向：

### 趋势一：规范收敛与弃用清理正在加速
代表 PR：
- #994 移除 deprecated 时间类型  
- #1002 删除 deprecated grouping 字段  
- #1019 弃用旧的统计函数 options 表达  
- #932 调整窗口函数默认行为

**解读**：Substrait 正从“快速扩张语义覆盖”转向“压缩历史包袱、提升一致性”。这对生态成熟是好事，但对实现者意味着升级成本会更加显性化。

---

### 趋势二：复杂 SQL / 关系代数表达能力持续增强
代表 PR：
- #917 GenerateRel  
- #973 lateral join  
- #890 AggregateRel 对 grouping set 兼容增强

**解读**：社区正在补齐过去难以标准化的 SQL 高阶语义，尤其是相关子查询、展开类操作、复杂聚合边界条件。这对查询优化器、跨引擎计划交换和联邦查询场景非常关键。

---

### 趋势三：函数系统向更严格、更可验证的方向演进
代表 PR：
- #1019 enum arguments 替代 function options  
- #1012 统计函数整型支持  
- #1005 澄清 enumeration arguments 与 options 的区别  
- #960 澄清 nullability binding 与 any type 参数的交互  
- #987 新增 has_overlap  
- #1020 新增 list 相关函数

**解读**：函数签名、参数绑定、类型推导与空值语义正在成为社区重点。这说明 Substrait 已进入“细节决定互操作质量”的阶段。

---

### 趋势四：扩展类型与半结构化数据支持升温
代表 PR：
- #953 无符号整数扩展类型  
- #887 JSON 简单扩展  
- #1020 list 函数增强

**解读**：社区需求已不满足于传统标量关系模型，正在朝半结构化、复杂类型、现代分析引擎常见数据模型靠拢。

---

### 趋势五：文档治理与规范可读性被明显重视
代表 PR：
- #1026 支持库与 breaking change policy  
- #881 澄清有效 URN  
- #874 文档与能力更新  
- #851 variadic 函数说明统一  
- #1018 extension relation 输出 schema 处理说明

**解读**：当规范逐渐复杂，文档本身开始成为“兼容性基础设施”的一部分。很多 PR 实际上是在修复“实现差异的根源”。

---

## 5. 开发者关注点

从今日活跃 PR 可以总结出几个高频痛点：

### 1) 破坏性变更越来越多，升级路径需要更透明
- 时间类型移除、聚合字段删除、窗口默认行为变化，都说明规范已进入“去历史兼容”的阶段。
- 开发者最关心的不只是“改什么”，更是 **什么时候改、是否有迁移指南、哪些库已经跟上**。
- 相关链接：
  - #994 https://github.com/substrait-io/substrait/pull/994
  - #1002 https://github.com/substrait-io/substrait/pull/1002
  - #1026 https://github.com/substrait-io/substrait/pull/1026

### 2) 函数语义仍是互操作的主要摩擦点
- enum arguments、options、variadic、nullability、列表函数、统计函数签名，这些都说明“函数如何精确表达”仍是实现差异最大的区域之一。
- 对编译器作者和执行引擎来说，这往往比新增一个算子更难统一。
- 相关链接：
  - #1019 https://github.com/substrait-io/substrait/pull/1019
  - #1012 https://github.com/substrait-io/substrait/pull/1012
  - #1005 https://github.com/substrait-io/substrait/pull/1005
  - #960 https://github.com/substrait-io/substrait/pull/960
  - #1020 https://github.com/substrait-io/substrait/pull/1020

### 3) 高级 SQL 语义建模是落地难点
- LATERAL VIEW、UNNEST、相关子查询、grouping set、窗口边界等，都是数据库之间语义细节差异最大的地方。
- 社区正在尝试把这些能力纳入统一计划表示，但这通常会伴随较长讨论周期。
- 相关链接：
  - #917 https://github.com/substrait-io/substrait/pull/917
  - #973 https://github.com/substrait-io/substrait/pull/973
  - #890 https://github.com/substrait-io/substrait/pull/890
  - #932 https://github.com/substrait-io/substrait/pull/932

### 4) 扩展机制正在从“可选能力”变成“生态关键层”
- 无符号整数、JSON、extension relation 输出 schema 等议题都表明：很多能力不会直接进入最小核心规范，而是通过扩展层落地。
- 这意味着开发者越来越需要一套 **可发现、可验证、可稳定依赖** 的扩展机制。
- 相关链接：
  - #953 https://github.com/substrait-io/substrait/pull/953
  - #887 https://github.com/substrait-io/substrait/pull/887
  - #1018 https://github.com/substrait-io/substrait/pull/1018

### 5) 文档歧义仍会直接转化为实现不兼容
- URN 格式、variadic 参数规则、扩展关系输出 schema、支持库边界等，表面是文档问题，实质是规范解释权问题。
- 对多语言 SDK 和多引擎互通来说，文档不清晰就意味着行为分叉。
- 相关链接：
  - #881 https://github.com/substrait-io/substrait/pull/881
  - #851 https://github.com/substrait-io/substrait/pull/851
  - #1026 https://github.com/substrait-io/substrait/pull/1026
  - #874 https://github.com/substrait-io/substrait/pull/874

---

## 6. 结语

今天的 Substrait 社区没有新的版本与 Issue 噪音，反而让主线变得更清楚：**规范清理、函数语义统一、复杂关系算子补齐、文档治理加强**。  
对于数据工程师、查询优化器开发者和数据库内核团队来说，接下来最值得跟踪的不是单点功能，而是 **这些变更是否会共同推动一次较大的兼容性拐点**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*