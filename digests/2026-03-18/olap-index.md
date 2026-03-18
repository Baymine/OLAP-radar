# OLAP 生态索引日报 2026-03-18

> 生成时间: 2026-03-18 02:04 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

以下是基于 2026-03-18 的 dbt-core、Spark、Substrait 社区动态整理的横向对比分析报告。

---

# OLAP 数据基础设施生态横向对比分析报告  
**日期：2026-03-18**

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个明显特征：**“大功能创新放缓，工程化可用性与规范一致性成为主战场”**。  
dbt-core 的讨论集中在配置校验、解析稳定性和自动化集成体验，Substrait 则聚焦函数签名、扩展 YAML 规范化和测试体系补强，反映出社区重点正从“新增能力”转向“提升表达精度、兼容性和可验证性”。  
与此同时，跨平台、跨 catalog、跨执行环境的一致性要求持续上升，说明 OLAP 基础设施正越来越多地嵌入企业级数据平台与自动化流水线。  
Spark 今日缺少可用摘要，无法纳入细粒度议题比较，但从整体生态视角看，其通常仍是执行层核心枢纽，和 dbt、Substrait 分别形成“开发编排层—规范交换层—执行引擎层”的互补关系。

---

## 2. 各项目活跃度对比

| 项目 | Issues 动态 | PR 动态 | Release 情况 | 今日关注重点 |
|---|---:|---:|---|---|
| dbt-core | 10 个重点 Issue | 10 个重点 PR | 无新版本 | 配置校验、弃用提示、partial parsing、测试兼容性、selector 工程化 |
| Apache Spark | N/A | N/A | N/A | 摘要生成失败，今日无可用社区动态数据 |
| Substrait | 1 个重点 Issue | 10 个重点 PR | 无新版本 | 扩展 YAML 规范化、函数签名一致性、enum 语义、测试框架、TopNRel |

### 补充观察
- **dbt-core**：Issue 面更广，说明当前社区处于“真实用户问题驱动”的高反馈状态。
- **Substrait**：PR 密度高于 Issue，表明其社区当前更偏向“规范演进与集中式设计推进”。
- **Spark**：由于缺失摘要，今日不宜做活跃度结论，只能视为数据缺口。

---

## 3. 共同关注的功能方向

尽管 dbt-core 与 Substrait 所处层次不同，但今日动态中出现了几个明确的共同方向：

### 3.1 规范化与校验增强
**涉及项目：dbt-core、Substrait**

- **dbt-core**
  - config key 合法性检查
  - generic test 参数告警准确性
  - `packages.yml` 缺失字段时报错优化
  - selector nodes 校验一致性
- **Substrait**
  - extension YAML 中函数名唯一性
  - 返回类型修正
  - nullability 规则在测试中的强制执行
  - enum argument 与 options 的语义澄清

**共性结论**：  
社区都在加强“**输入定义是否明确、是否合法、是否可验证**”。这说明生态正在从灵活扩展走向更严格的契约治理。

---

### 3.2 错误信息与开发者体验优化
**涉及项目：dbt-core、Substrait**

- **dbt-core**
  - `KeyError` 过于底层
  - relation 冲突报错不够可操作
  - warning/error 日志格式标准化
- **Substrait**
  - 通过更清晰的函数参数建模和测试语法，减少实现方误读
  - 为 function implementation 增加 description 元数据

**共性结论**：  
两者都在降低“**语义理解成本**”和“**排障成本**”，只是 dbt 更偏 CLI/用户侧，Substrait 更偏规范/实现侧。

---

### 3.3 自动化与工程化集成能力
**涉及项目：dbt-core，间接涉及 Substrait**

- **dbt-core**
  - 支持 `select/selector/exclude` 环境变量
  - catalog integration 命令路径补齐
  - docs 文件扩展名兼容
- **Substrait**
  - 扩展 YAML 与测试 grammar 的持续规范化，本质上是在提升工具链自动生成、自动验证和跨引擎适配能力

**共性结论**：  
无论是运行时参数注入，还是规范层元数据治理，目标都指向：**更好地嵌入平台化系统与自动化流水线**。

---

### 3.4 正确性优先于单纯性能
**涉及项目：dbt-core、Substrait**

- **dbt-core**
  - partial parsing 一致性问题
  - 多线程 unit test 稳定性
  - duplicate CTE race condition 相关调整反复
- **Substrait**
  - null 语义、返回类型、枚举参数建模等“正确性”问题被优先修正
  - 测试体系同步增强

**共性结论**：  
生态正在进入一个更成熟阶段：**速度和能力扩张之外，正确性、稳定性、语义清晰度被放到更高优先级**。

---

## 4. 差异化定位分析

### 4.1 dbt-core：面向数据开发工作流的“工程编排层”
**功能侧重**
- 配置系统
- 模型选择与任务编排
- 测试、解析、依赖管理
- 多 warehouse / catalog 集成体验

**目标用户**
- 数据工程师
- Analytics Engineer
- 数据平台团队
- 使用 CI/CD 管理数据转化任务的团队

**技术路线**
- 以项目配置、编译、执行和测试为中心
- 强调 CLI、自动化调度、平台集成
- 当前重点是“配置语义治理 + 稳定性补强 + 使用体验优化”

**定位总结**
> dbt-core 更像 OLAP 数据栈中的“开发者入口与任务编排中枢”。

---

### 4.2 Substrait：面向跨引擎互操作的“规范交换层”
**功能侧重**
- 函数签名定义
- 扩展 YAML
- 测试 grammar
- 逻辑/物理计划表达
- 跨引擎一致性与可验证性

**目标用户**
- 查询引擎开发者
- 优化器/Planner 开发者
- 规范实现方
- 需要 plan interchange 的平台厂商

**技术路线**
- 通过 proto + extension schema + conformance test 驱动生态
- 重视语义严格性与标准表达能力
- 当前重点是“扩展定义规范化 + 测试体系跟进 + 物理算子建模演进”

**定位总结**
> Substrait 更像 OLAP 生态中的“查询语义中间层与跨引擎协作协议”。

---

### 4.3 Apache Spark：面向大规模计算的“执行引擎层”
**功能侧重**
- 分布式执行
- SQL / DataFrame 计算
- 批流一体与大规模数据处理

**目标用户**
- 大数据平台团队
- 数据工程师
- 数据科学与机器学习工程团队
- 湖仓平台使用者

**技术路线**
- 以统一计算引擎为核心
- 兼顾 SQL、ETL、机器学习、流处理
- 在 OLAP 生态中承担“执行与扩展承载层”

**定位总结**
> Spark 通常是 OLAP/数据平台中的“底层算力与执行核心”，与 dbt、Substrait 分别形成上层编排和中间层规范的配合关系。

> 注：由于今日 Spark 摘要缺失，上述定位分析基于其生态通用角色，而非今日动态。

---

## 5. 社区热度与成熟度

### 5.1 社区热度
- **dbt-core：今日最活跃**
  - 10 个重点 Issue + 10 个重点 PR
  - 用户问题、修复 PR、backport 需求形成快速闭环
  - 说明使用面广、反馈密集、维护响应较快

- **Substrait：活跃但更偏“核心设计推进”**
  - 1 个重点 Issue + 10 个重点 PR
  - 讨论集中在规范演进、语义澄清和测试配套
  - 说明社区规模可能不如 dbt 广泛，但核心贡献者驱动强

- **Spark：今日无数据，不作判断**
  - 缺少摘要，无法比较热度变化

---

### 5.2 成熟度判断
- **dbt-core：成熟产品进入“体验与一致性强化期”**
  - 主要问题集中在边界行为、集成兼容、错误提示、并发稳定性
  - 这通常是成熟项目在规模化 adoption 后的典型特征

- **Substrait：处于“快速规范收敛期”**
  - 仍存在 Breaking Change
  - 大量工作在修正函数语义、参数表达和测试体系
  - 说明规范本身仍在积极演进，成熟度提升中，但尚未完全稳定

- **Spark：通常属于高成熟度基础设施**
  - 但今日无法从动态验证其当前迭代状态

---

## 6. 值得关注的趋势信号

### 6.1 配置、函数、计划定义都在走向“强契约化”
从 dbt 的 config 校验，到 Substrait 的函数签名与 YAML 唯一性治理，可以看到一个共同趋势：  
**数据基础设施组件不再容忍模糊、隐式或静默失败的定义方式。**

**对数据工程师的意义**
- 应减少依赖“约定俗成”的模糊配置
- 更重视 schema、lint、测试和静态校验
- 平台建设中要优先采用可验证、可生成、可审计的定义方式

---

### 6.2 自动化平台集成正在成为核心诉求
dbt 的环境变量传参与 catalog integration 修复，反映出工具必须适应调度器、CI/CD、容器化和平台封装场景。  
Substrait 对扩展元数据和测试 grammar 的强化，也是在为自动化生成和跨系统对接铺路。

**对数据工程师的意义**
- 未来工具选型不应只看单机 CLI 体验
- 要重点评估其在编排平台、元数据系统、测试框架中的集成能力

---

### 6.3 性能优化之后，生态进入“正确性清算期”
dbt 的 partial parsing、多线程测试、CTE race condition，Substrait 的 nullability、类型返回值和 enum 参数，都说明系统在扩张后进入了**正确性治理阶段**。

**对数据工程师的意义**
- 不要把“支持并发 / 缓存 / 增量解析”简单等同于“可放心生产化”
- 对性能特性应配套回归测试、边界测试与版本验证机制

---

### 6.4 跨引擎、跨后端、跨语义层的一致性要求越来越高
dbt 面临 Snowflake + Glue、BigQuery 等异构适配问题；Substrait 则试图从规范层统一函数和物理计划表达。  
这背后体现的是：**OLAP 生态正在从单引擎时代转向多组件协同时代**。

**对数据工程师的意义**
- 架构设计应预留多后端兼容能力
- 关注中间语义层、元数据层和执行层之间的边界清晰度
- 选择工具时，应优先考虑其跨系统一致性而非单点功能数量

---

## 结论

从今日动态看，OLAP 基础设施生态的主旋律已经非常清晰：  
**不是简单地“继续堆功能”，而是持续提升规范严谨性、错误可诊断性、平台集成能力和复杂场景下的稳定性。**

- **dbt-core** 正在强化其作为数据开发与编排入口的工程可用性；
- **Substrait** 正在加速成为跨引擎语义交换与计划表达的重要规范层；
- **Spark** 虽今日缺少数据，但在生态中仍是关键执行层支柱。

对于技术决策者而言，这意味着未来的竞争不只发生在“谁功能多”，而更多发生在：  
**谁能提供更稳定的契约、更清晰的语义、更低的集成成本，以及更强的跨系统协同能力。**

如果你愿意，我可以继续把这份报告进一步整理成：
1. **适合管理层阅读的 1 页简报版**  
2. **适合团队周会汇报的表格版**  
3. **带“技术选型建议”的决策视角版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报｜2026-03-18

## 1. 今日速览

过去 24 小时内，dbt-core 没有新版本发布，但 Issues 与 PR 活跃度较高，重点集中在**配置校验与弃用提示、解析稳定性、测试命令兼容性、选择器参数可配置性**几条主线。  
从社区反馈看，当前最受关注的问题不是“新功能大改”，而是**错误提示是否清晰、边缘场景是否稳定、不同平台/目录集成是否一致可用**。  
同时，多个 Issue 已快速对应到社区 PR，说明维护者与贡献者在 **1.11.latest 回补、可用性修复、开发体验优化** 上推进较快。

---

## 3. 社区热点 Issues

### 1) #12572 缺失参数属性的泛型测试弃用告警具有误导性
- **状态**：OPEN
- **标签**：bug, backport 1.11.latest, dep warnings
- **为什么重要**：这类问题直接影响用户对弃用告警的理解，尤其在 YAML schema/test 配置迁移过程中，误导性的 warning 会增加升级成本。
- **社区反应**：已有 4 条评论，属于近期配置/弃用逻辑相关问题中互动相对较多的一条，说明社区对告警准确性比较敏感。
- **观察**：这与近期多个“deprecation warning 行为不一致”的问题形成呼应，显示 dbt 正在强化配置语义校验，但仍有边界行为待打磨。
- **链接**：dbt-labs/dbt-core Issue #12572

### 2) #12662 Snowflake + AWS Glue Catalog Integration 下 `dbt test` 失败
- **状态**：OPEN
- **标签**：bug, triage
- **为什么重要**：这是典型的**跨平台/跨 catalog 集成兼容性问题**，直接影响使用 Snowflake 且接入 AWS Glue Catalog 的团队执行测试任务。
- **社区反应**：Issue 创建当天即有 2 条评论，并迅速对应到修复 PR #12663，响应速度较快。
- **观察**：问题指向 `test` 命令缺少必要装饰器，属于“功能本身存在，但某个命令路径遗漏接线”的高优先级兼容性缺陷。
- **链接**：dbt-labs/dbt-core Issue #12662

### 3) #12193 支持 `DBT_ENGINE_{SELECTOR,SELECT,EXCLUDE}` 环境变量
- **状态**：OPEN
- **标签**：enhancement, triage
- **为什么重要**：这是**CLI 参数环境变量化**诉求，能显著改善 CI/CD、编排器调用、模板化执行场景下的使用体验。
- **社区反应**：虽然评论不多，但已演进出新的 PR #12664，说明需求已进入实质实现阶段。
- **观察**：这类需求体现 dbt 正从“命令行工具”继续向“可嵌入自动化系统的执行引擎”靠拢。
- **链接**：dbt-labs/dbt-core Issue #12193

### 4) #7513 像普通选择器一样校验 selector nodes
- **状态**：OPEN
- **标签**：enhancement, help_wanted, node selection
- **为什么重要**：selector 是大规模项目中任务编排与资源选择的核心能力，缺乏一致校验会导致运行时才暴露问题，影响可维护性。
- **社区反应**：该议题存在时间较长，但最近再次更新，说明需求长期存在且尚未彻底解决。
- **观察**：与 #12193 一起，反映出社区对**node selection / selector 体系的可预测性与工程化能力**持续关注。
- **链接**：dbt-labs/dbt-core Issue #7513

### 5) #12649 `packages.yml` 缺少 version 时，`dbt debug` 抛出晦涩 `KeyError`
- **状态**：OPEN
- **标签**：bug
- **为什么重要**：这是非常典型的**输入校验不足导致错误信息难懂**的问题，会直接影响新用户定位依赖配置错误。
- **社区反应**：已快速出现修复 PR #12650，说明问题明确、修复路径清晰。
- **观察**：此类问题虽然技术复杂度不高，但对开发者体验影响很大，尤其在包依赖调试与项目初始化阶段。
- **链接**：dbt-labs/dbt-core Issue #12649

### 6) #12542 `config` 中自定义键未触发弃用错误
- **状态**：OPEN
- **标签**：bug, backport 1.11.latest, dep warnings
- **为什么重要**：配置系统是 dbt 的核心接口之一。如果无效自定义 key 未被正确识别，会让项目产生“看似生效、实则被忽略”的风险。
- **社区反应**：已对应修复 PR #12667，并带有 backport 标记，表明维护者认为这属于应尽快回补的问题。
- **观察**：这进一步说明近期 dbt-core 正在系统性治理配置语义与 deprecation 行为。
- **链接**：dbt-labs/dbt-core Issue #12542

### 7) #12629 “发现两个相似 database identifier 的 relation” 报错信息问题
- **状态**：OPEN
- **标签**：bug
- **为什么重要**：这类编译/解析错误通常发生在 warehouse 对象命名冲突或大小写/标识符规则边缘场景下，错误文案是否清晰会直接决定排障成本。
- **社区反应**：评论数不多，但问题与既有 Issue 关联，说明并非孤立个案。
- **观察**：社区仍然希望 dbt 在 relation resolution 方面给出更具操作性的诊断信息，而不仅是技术性报错。
- **链接**：dbt-labs/dbt-core Issue #12629

### 8) #12566 更好的错误与告警信息
- **状态**：CLOSED
- **标签**：enhancement, triage
- **为什么重要**：尽管已关闭，但它代表一个高共识方向：**标准化 warning/error 输出格式，提高日志可读性**。
- **社区反应**：已由 PR #12555 处理并关闭，说明维护者认可这类“体验型优化”具备落地价值。
- **观察**：它不是单点问题，而是多个“错误太隐晦”“日志不够明显”诉求的集合体现。
- **链接**：dbt-labs/dbt-core Issue #12566

### 9) #12666 Partial parsing 在 schema.yml 变更后丢失 versioned model node
- **状态**：OPEN
- **标签**：bug, triage
- **为什么重要**：这是今天最值得关注的稳定性问题之一。它影响 dbt Cloud + partial parsing + versioned model 的组合场景，可能导致模型版本节点“找不到”。
- **社区反应**：新开 Issue，暂未形成讨论，但问题描述明确，属于潜在高影响面缺陷。
- **观察**：partial parsing 一直是性能优化关键能力，但也最容易在增量解析、缓存失效、元数据同步上暴露一致性问题。
- **链接**：dbt-labs/dbt-core Issue #12666

### 10) #12665 BigQuery 下同名 Unit Test 配合 `--threads` 表现异常
- **状态**：OPEN
- **标签**：bug, triage
- **为什么重要**：这是**并发执行 + 命名冲突**导致的测试稳定性问题，直接关系到团队在 BigQuery 上扩大测试并行度时的可靠性。
- **社区反应**：刚创建，暂无评论，但问题具备明确复现场景，后续可能吸引更多用户反馈。
- **观察**：这类问题通常指向 task graph、临时对象命名或线程隔离设计，值得持续关注。
- **链接**：dbt-labs/dbt-core Issue #12665

---

## 4. 重要 PR 进展

### 1) #12650 修复 package version 校验，正确处理缺失字段
- **状态**：OPEN
- **价值**：针对 #12649，避免 `packages.yml` 缺少 `version` 时出现晦涩 `KeyError`，属于典型的输入校验与报错体验修复。
- **意义**：能显著降低依赖配置排障成本。
- **链接**：dbt-labs/dbt-core PR #12650

### 2) #12667 为所有 config key 增加检查并简化弃用逻辑
- **状态**：OPEN
- **标签**：backport 1.11.latest
- **价值**：对应 #12542，目标是更可靠地识别非法或自定义 config key，并触发正确的 `CustomKeyInConfigDeprecation`。
- **意义**：有助于强化配置语义一致性，减少 silent failure。
- **链接**：dbt-labs/dbt-core PR #12667

### 3) #11177 让 `MAXIMUM_SEED_SIZE_MIB` 可配置
- **状态**：OPEN
- **标签**：artifact_minor_upgrade, needs_fusion_implementation
- **价值**：这是一个长期存在的重要增强项，允许用户自定义 seed 文件大小限制，而不是被固定 1 MiB 阈值约束。
- **意义**：对使用 seed 管理中小规模静态数据的团队更友好，也体现出 dbt 对“默认限制可配置化”的方向。
- **链接**：dbt-labs/dbt-core PR #11177

### 4) #12664 为 selector 参数增加环境变量支持
- **状态**：OPEN
- **标签**：community
- **价值**：实现 #12193，支持通过环境变量传递 `--select / --selector / --exclude` 相关参数。
- **意义**：非常适合 CI 工作流、容器化运行、编排器动态注入参数等自动化场景。
- **备注**：作者明确表示“提交以征求反馈”，说明方案仍可能调整。
- **链接**：dbt-labs/dbt-core PR #12664

### 5) #12663 为 `test` 命令补充 `@requires.catalogs` 装饰器
- **状态**：OPEN
- **标签**：community
- **价值**：直接修复 #12662，使 `dbt test` 在自定义 catalog integration 场景下与 run/build/parse/compile 等命令保持一致。
- **意义**：这是高性价比兼容性修复，预计落地后能立即消除一类跨 catalog 使用故障。
- **链接**：dbt-labs/dbt-core PR #12663

### 6) #12191 将 `in dict.keys()` 改为 `in dict`
- **状态**：OPEN
- **标签**：community
- **价值**：虽然是小型性能/代码质量优化，但涉及多个核心路径，提升可读性并避免不必要的 `.keys()` 使用。
- **意义**：体现社区对 dbt-core 基础代码质量和细节性能的持续改进。
- **链接**：dbt-labs/dbt-core PR #12191

### 7) #12659 Revert “Revert … duplicate CTE race condition …”
- **状态**：CLOSED
- **价值**：该 PR 虽已关闭，但信号很强：围绕 **ephemeral model 编译中的 duplicate CTE race condition**，近期仍在反复调整。
- **意义**：说明并发编译/CTE 去重相关问题仍较敏感，维护者在谨慎处理回滚与恢复策略。
- **链接**：dbt-labs/dbt-core PR #12659

### 8) #12653 支持 docs 文件使用 `.jinja/.jinja2/.j2` 扩展名
- **状态**：CLOSED
- **标签**：community
- **价值**：扩展 docs 解析支持的文件后缀，适配更多 IDE 与模板化文档工作流。
- **意义**：对文档工程化和 Jinja 模板编辑体验是实用增强。
- **链接**：dbt-labs/dbt-core PR #12653

### 9) #12559 为 macros 增加 config 支持
- **状态**：CLOSED
- **标签**：artifact_minor_upgrade, backport 1.11.latest
- **价值**：允许 `meta`、`docs` 等属性在 config 中声明，并在 patch parser 中处理优先级。
- **意义**：这是配置体系能力的一次明显扩展，有助于统一资源定义方式。
- **链接**：dbt-labs/dbt-core PR #12559

### 10) #12555 Better Logging
- **状态**：CLOSED
- **价值**：对应 #12566，改进 warning/error 的日志表现形式。
- **意义**：虽然不是大型功能，但对 CLI 可读性、自动化日志扫描、问题定位都很有帮助。
- **链接**：dbt-labs/dbt-core PR #12555

---

## 5. 功能需求趋势

### 1) 配置校验与弃用治理正在成为热点
近期多个 Issue/PR 围绕：
- config key 合法性检查
- 缺失 `+` 前缀的弃用逻辑
- generic test 参数属性告警准确性
- packages.yml 缺失字段的报错质量

这说明社区当前很关注 **“配置是否被正确解释、错误是否足够早暴露、升级是否有明确提示”**。

### 2) 选择器与命令行参数的工程化需求增强
围绕 selector 的两个方向同时升温：
- selector nodes 的校验一致性
- `select/selector/exclude` 的环境变量支持

这反映出 dbt 正被更广泛地嵌入 CI/CD、调度平台和平台化工作流，用户希望 CLI 参数具备更强的**自动化友好性**。

### 3) 测试与解析稳定性仍是高频痛点
新出现的几个 bug 都集中在：
- `dbt test` 与 catalog integration 的兼容性
- partial parsing 与 versioned model 的一致性
- BigQuery unit test 在多线程下的稳定性

说明社区在关注性能和并发能力的同时，也在持续暴露 **解析缓存、线程安全、命令路径覆盖** 等边缘问题。

### 4) 多平台/多后端兼容性要求继续提高
Snowflake + AWS Glue、BigQuery、多种 docs 文件扩展名等案例表明，dbt 用户场景越来越异构。  
社区对 dbt-core 的期望，已不仅是“能运行”，而是要在**不同 warehouse、catalog、文件组织方式、自动化环境**下都表现一致。

---

## 6. 开发者关注点

### 1) 错误信息不够直观
高频反馈包括：
- `KeyError` 过于底层，不利于定位配置问题
- relation 冲突类报错不够可操作
- warning / error 缺少统一且显眼的格式

开发者希望 dbt 能给出**更面向用户语义的错误信息**，而不是暴露内部实现细节。

### 2) 配置“静默失败”风险需要降低
像非法 config key、不完整 package 配置、generic test 属性解释偏差等问题，都会让用户误以为配置生效。  
社区明显希望 dbt 在编译前就能提供**更严格、更一致的校验反馈**。

### 3) 并发与增量解析的边缘行为仍需加强
最近的问题持续表明：
- partial parsing 在复杂 schema/versioned model 场景下仍可能失稳
- 多线程执行在某些测试命名冲突场景下可能存在非预期行为
- 早前 duplicate CTE race condition 相关改动也仍在波动

这说明性能优化能力在带来速度收益的同时，也要求更强的正确性保障。

### 4) 自动化与平台化集成是明确方向
环境变量传参、catalog integration、文档文件扩展名兼容等需求，背后都指向同一个趋势：  
**dbt-core 正越来越多地作为数据平台中的一个“可编排执行组件”来使用**。开发者希望它更适配标准化流水线与平台封装，而不是仅面向手工 CLI 操作。

---

如需，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的 300 字简版**  
2. **适合内部周报的表格版**  
3. **带优先级判断的“维护者视角”解读版**

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

⚠️ 摘要生成失败。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报 · 2026-03-18

## 1. 今日速览

过去 24 小时内，Substrait 社区没有新版本发布，但规范与扩展定义层面的活跃度很高，讨论重点集中在 **函数签名一致性、枚举参数语义澄清、测试体系补强** 以及 **Top-N / WITH TIES 物理算子建模**。  
从 PR 动向看，当前社区正在加快推进 **扩展 YAML 的规范化治理**，同时也在为执行上下文函数、统计聚合函数和物理关系表达能力补齐关键能力。  
此外，一个值得注意的变化是：`add:date_iyear` 返回类型修正已合入，属于 **Breaking Change**，实现方需要关注兼容性影响。

---

## 2. 社区热点 Issues

> 说明：过去 24 小时仅有 1 条 Issue 更新，因此本节聚焦该 Issue 的重要性与潜在影响。

### 1) 要求 extension YAML 中函数名唯一  
- **Issue**: #931 Require function names to be unique within extension YAML files  
- **状态**: OPEN  
- **作者**: @benbellick  
- **社区反馈**: 2 条评论，1 个 👍  
- **链接**: substrait-io/substrait Issue #931

**为什么重要**  
当前部分扩展 YAML 文件中存在同名函数重复声明，例如 `functions_string.yaml` 中 `regexp_replace` 出现多次。这会直接破坏工具链对扩展元数据的解析、索引和自动生成能力，尤其对依赖扩展定义生成函数目录、校验器、文档或代码绑定的实现方影响较大。

**社区反应如何**  
虽然互动量不高，但这是典型的“低噪音、高影响”问题：它关系到 **规范可验证性** 和 **生态工具可维护性**。如果不尽快收敛，后续更多函数扩展进入 YAML 后，重复命名会持续放大实现歧义。

**值得关注的原因**  
- 影响扩展函数注册与查找  
- 增加代码生成和测试校验复杂度  
- 可能推动后续 schema / lint / CI 规则收紧

---

## 3. 重要 PR 进展

> 以下挑选过去 24 小时内更新的 10 个重点 PR。

### 1) 修复 `add:date_iyear` 返回类型
- **PR**: #1007 fix(extensions)!: correct return type for `add:date_iyear` operation  
- **状态**: CLOSED  
- **作者**: @nielspardon  
- **链接**: substrait-io/substrait PR #1007

**内容概述**  
将 `add:date_iyear` 的返回类型从 `timestamp` 改为 `date`。

**意义**  
这是一个明确的 **Breaking Change**。从语义上看，`date + interval_year` 的结果应保持为 `date`，这一修正有助于统一函数类型系统，减少执行器与校验器间的歧义。

**对开发者的影响**  
- 已实现该函数的引擎需要检查返回类型映射  
- 测试基线、类型推导逻辑和函数签名缓存都可能要更新

---

### 2) 测试用例强制遵循 null literal 的可空性规则
- **PR**: #989 [PMC Ready] fix: enforce nullable types for null literals in test cases  
- **状态**: OPEN  
- **作者**: @benbellick  
- **链接**: substrait-io/substrait PR #989

**内容概述**  
规范测试用例中的 `null` 字面量类型标注，使其严格遵守扩展 YAML 中的 `nullability` 规则。

**意义**  
这项改动虽然偏测试基础设施，但影响很深：它把函数定义中的空值传播规则真正落实到了测试层，能显著提升 conformance 测试的可信度。

**重点价值**  
- 降低实现方对 null 语义的误读  
- 让 `MIRROR` / `DECLARED_OUTPUT` 等规则在测试中可验证  
- 有利于跨引擎行为一致性

---

### 3) 为函数实现增加可选 `description` 字段
- **PR**: #1013 [PMC Ready] feat: add optional description field to function implementations  
- **状态**: OPEN  
- **作者**: @benbellick  
- **链接**: substrait-io/substrait PR #1013

**内容概述**  
在扩展 schema 中为单个 function implementation 增加可选 `description` 字段，并以 `count` 的合并定义作为示例。

**意义**  
这有助于把文档粒度从“函数级”下探到“实现级”，特别适合一个函数名下存在多个签名、行为变体或兼容层说明的情况。

**潜在价值**  
- 提升扩展元数据可读性  
- 便于自动生成更精细的文档  
- 为后续做实现差异注释打基础

---

### 4) 澄清枚举参数与 options 的区别
- **PR**: #1005 feat(docs): clarify distinction between enumeration arguments and options  
- **状态**: OPEN  
- **作者**: @benbellick  
- **链接**: substrait-io/substrait PR #1005

**内容概述**  
文档层面明确区分函数中的 **enumeration arguments** 与 **options** 两类固定集合值传递机制。

**意义**  
这是近期多个相关 PR 的“上游定义澄清”。如果这层概念不清楚，后续函数签名设计、测试表示、兼容实现都容易出现偏差。

**为什么值得重点关注**  
- 直接影响扩展函数建模方式  
- 为统计函数等 PR 提供理论依据  
- 有助于减少使用者将 option 与 enum 混用的情况

---

### 5) 将 `std_dev` 和 `variance` 的 distribution 从 option 改为 enum argument
- **PR**: #1011 fix(extensions): change distribution option to enum arg for std_dev and variance  
- **状态**: OPEN  
- **作者**: @nielspardon  
- **链接**: substrait-io/substrait PR #1011

**内容概述**  
根据 #1005 的文档澄清，将 `std_dev`、`variance` 中的 distribution 参数从 option 改为 enum argument。

**意义**  
这也是 **Breaking Change**。它不只是格式调整，而是函数签名建模方式发生变化，会影响 plan 表达、解析器和兼容适配层。

**对生态的影响**  
- 统计聚合函数的参数表达更规范  
- 提升语义可验证性  
- 实现方需更新函数签名解析逻辑

---

### 6) 为 FuncTestCase 语法增加 enum argument 支持
- **PR**: #1010 feat(tests): add enum argument support to FuncTestCase grammar  
- **状态**: OPEN  
- **作者**: @nielspardon  
- **链接**: substrait-io/substrait PR #1010

**内容概述**  
修改 FuncTestCase grammar，引入新的 `enum` 数据类型，显式支持枚举参数。

**意义**  
这是对 #1005、#1011 的测试基础设施配套。没有测试语法支持，前面的规范变更难以落地验证。

**核心价值**  
- 测试输入表达更准确  
- 不再把 enum arg 错当字符串字面量  
- 改善 datetime `extract` 等函数的测试表示

---

### 7) 增加 `current_date` / `current_timestamp` / `current_timezone`
- **PR**: #945 [PMC Ready] feat: add current_date, current_timestamp and current_timezone functions  
- **状态**: OPEN  
- **作者**: @nielspardon  
- **链接**: substrait-io/substrait PR #945

**内容概述**  
新增 3 个执行上下文相关函数：`current_date`、`current_timestamp`、`current_timezone`。

**意义**  
这组函数对 SQL 方言兼容和查询重写非常关键，是很多引擎中的基础内建能力。其加入将提升 Substrait 对常见 BI / ETL / 交互式查询场景的表达完整性。

**适用场景**  
- 时间戳生成与审计字段填充  
- 时区敏感查询  
- 与主流 SQL 引擎的函数能力对齐

---

### 8) 为 `std_dev` / `variance` 增加整数参数支持
- **PR**: #1012 feat(extensions): support int arguments with std_dev and variance functions  
- **状态**: OPEN  
- **作者**: @nielspardon  
- **链接**: substrait-io/substrait PR #1012

**内容概述**  
在统计函数 `std_dev` 和 `variance` 中加入对整数参数的支持，并补充相应生成测试。

**意义**  
这增强了函数签名的实用性，也体现出社区在推动扩展定义从“可表达”走向“更贴近真实引擎行为”。

**价值点**  
- 提升与实际数据库实现的兼容度  
- 减少不必要的隐式 cast 依赖  
- 与 #1010 / #1011 形成成套改进

---

### 9) `FetchRel` 的 WITH TIES 支持提案关闭
- **PR**: #797 [Stale] feat: support with ties in FetchRel  
- **状态**: CLOSED  
- **作者**: @yongchul  
- **链接**: substrait-io/substrait PR #797

**内容概述**  
该旧提案试图在 `FetchRel` 中支持 `WITH TIES`，但现已因 stale 关闭。

**意义**  
虽然 PR 本身关闭，但它说明社区对 `WITH TIES` 需求并未消失，而是可能在更合适的抽象层重启设计。

**观察点**  
- 原思路未被直接延续  
- 社区更倾向通过新物理算子来承载该语义  
- 为 #1009 铺垫了背景

---

### 10) 新增支持 WITH TIES 的 `TopNRel` 物理算子
- **PR**: #1009 feat: add TopNRel physical operator with WITH TIES support  
- **状态**: OPEN  
- **作者**: @jcamachor  
- **链接**: substrait-io/substrait PR #1009

**内容概述**  
在 `algebra.proto` 中新增 `TopNRel` 物理关系，将排序与抓取组合成一个算子，并支持 `WITH TIES`、offset、count 等能力。

**意义**  
这是今天最值得关注的结构性提案之一。它不是给现有关系打补丁，而是补上了物理计划层对 Top-N 的明确建模能力。

**为什么重要**  
- 让物理关系文档与 protobuf 定义对齐  
- 更适合表达执行层优化语义  
- 为数据库引擎的 Top-N 下推、排序裁剪等优化提供统一表示

---

## 4. 功能需求趋势

结合当前 Issue 与 PR 动向，Substrait 社区近期最关注的功能方向主要有以下几类：

### 1) 扩展函数定义的规范化与可验证性
最明显的趋势是对 extension YAML 的治理加强，包括：
- 函数命名唯一性
- 返回类型纠正
- nullability 规则严格化
- 单函数多实现的元数据增强

这说明社区正从“快速扩展函数集合”转向“保证扩展定义质量与一致性”。

---

### 2) 枚举参数建模与函数签名语义收敛
围绕 enum arguments 与 options 的澄清，已经形成“文档定义 -> 扩展修正 -> 测试语法支持 -> 具体函数适配”的连续动作。  
这反映出社区对 **函数参数表达语义** 的关注正在升温，尤其是固定集合值参数的标准表达方式。

---

### 3) 测试框架与一致性验证能力增强
多个 PR 指向测试 grammar、null literal 规则和生成测试用例，表明社区正在强化 conformance 层。  
对一个跨引擎、跨系统的规范来说，测试表达能力与校验严格性本身就是核心基础设施。

---

### 4) SQL 常用内建函数与执行上下文能力补全
`current_date`、`current_timestamp`、`current_timezone` 的加入，说明社区仍在持续补齐与主流 SQL 引擎对齐的基础函数能力。  
这类函数往往是实际 adoption 的关键门槛之一。

---

### 5) 物理计划表达能力演进
`TopNRel` 与 `WITH TIES` 的讨论显示，Substrait 不仅在完善逻辑/函数层，也在继续增强 **物理计划层抽象**。  
这对查询优化器、执行器以及计划交换场景都很重要。

---

## 5. 开发者关注点

从今天的更新可以总结出几个开发者高频痛点：

### 1) 扩展定义容易出现歧义，缺少更强校验
例如函数重名、返回类型不准确、同名函数多实现缺少细粒度说明等，都会导致：
- 解析器实现复杂
- 自动生成工具不稳定
- 文档与行为不一致

---

### 2) 函数参数语义表达仍有学习和落地成本
`options` 与 `enum arguments` 的界限此前不够清楚，已经影响到函数定义与测试表示。  
这说明开发者需要更明确的建模指南，以及更早在 CI / lint 阶段暴露问题。

---

### 3) 测试体系必须跟上规范演进
当扩展 schema 和函数签名不断演进时，测试 grammar 与 conformance 数据若不同步，规范很难真正被实现方正确采用。  
社区显然已经意识到：**测试不是附属品，而是规范落地的主战场**。

---

### 4) Breaking Changes 正在增多，实现方需关注兼容性管理
今天至少有两个值得注意的破坏性变化方向：
- `add:date_iyear` 返回类型修正
- `std_dev` / `variance` 的参数建模变更

这意味着实现方需要：
- 建立版本追踪与兼容测试
- 关注签名变更对 planner / binder / evaluator 的影响
- 尽量避免将早期扩展定义硬编码

---

### 5) 物理算子抽象仍在演进，执行器适配需保持弹性
`TopNRel` 的出现表明，Substrait 在物理层的表达仍有新增空间。  
对执行引擎开发者来说，适配层设计最好保持可扩展，而不是过度绑定当前 proto 结构。

---

## 附：今日值得重点跟踪的链接

- Issue #931: substrait-io/substrait Issue #931  
- PR #1007: substrait-io/substrait PR #1007  
- PR #989: substrait-io/substrait PR #989  
- PR #1013: substrait-io/substrait PR #1013  
- PR #1005: substrait-io/substrait PR #1005  
- PR #1011: substrait-io/substrait PR #1011  
- PR #1010: substrait-io/substrait PR #1010  
- PR #945: substrait-io/substrait PR #945  
- PR #1012: substrait-io/substrait PR #1012  
- PR #797: substrait-io/substrait PR #797  
- PR #1009: substrait-io/substrait PR #1009

如果你愿意，我还可以进一步把这份日报整理成：
1. **适合飞书/Slack 发布的精简版**，或  
2. **面向管理层的趋势摘要版**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*