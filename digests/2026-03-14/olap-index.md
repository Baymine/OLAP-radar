# OLAP 生态索引日报 2026-03-14

> 生成时间: 2026-03-14 01:15 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告
**日期：2026-03-14**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个很明显的特征：**从“功能扩张”转向“正确性、确定性、可组合性”深化**。  
dbt-core 正在强化依赖锁定、配置校验和选择器能力，Spark 持续打磨 SQL 正确性、事务基础设施与数据湖读取路径，Substrait 则聚焦类型系统和规范严谨性。  
这说明行业关注点已不只是“能不能做”，而是“**不同环境是否稳定复现、跨引擎是否语义一致、复杂生产场景是否可控**”。  
对技术团队而言，未来一段时间的竞争重点会集中在：**可复现依赖管理、执行正确性、跨系统语义对齐，以及面向大型工程场景的可运维性**。

---

## 2. 各项目活跃度对比

| 项目 | 今日更新 Issues 数 | 今日更新 PR 数 | Release 情况 | 主要活跃方向 |
|---|---:|---:|---|---|
| dbt-core | 9 | 5 | 无新版本发布 | lockfile 确定性、配置校验、错误提示、selector 能力 |
| Apache Spark | 0 | 10+（重点跟踪 10 个，另有若干补充 PR） | 无新版本发布 | SQL 正确性、DSv2 Transaction API、Geo 类型、PySpark/PS、Streaming |
| Substrait | 0 | 3 | 无新版本发布 | 类型系统纠偏、nullability 规则、CI 稳定性 |

### 简要解读
- **dbt-core**：Issue 活跃度最高，说明社区正在集中暴露和讨论真实用户侧痛点，尤其是工程使用体验问题。
- **Spark**：PR 活跃度最高，说明社区更多处于“持续交付和工程推进”状态，维护节奏强。
- **Substrait**：总量较小，但讨论高度集中在规范严谨性，体现出标准项目典型特征：**变更少但影响深**。

---

## 3. 共同关注的功能方向

### 3.1 正确性与一致性
**涉及项目：dbt-core / Spark / Substrait**

这是三者最明显的共性。

- **dbt-core**
  - `package-lock.yml` 在不同命令、不同环境下生成不同哈希
  - `state:modified+` 对 YAML 列级自定义 key 变更识别问题
  - 配置缺失时报错不友好
- **Spark**
  - `asinh/acosh` 大值场景数值不稳定修复
  - SPJ partial clustering 回归测试，关注 Join 优化后的结果正确性
  - Streaming / state format / window join 相关正确性持续修补
- **Substrait**
  - `add:date_iyear` 返回类型纠偏
  - nullability 约束收紧，避免规范与实现歧义

**共同信号**：  
OLAP 基础设施正在把“**语义正确**”放在比“功能新增”更高的位置。对于生产级数据平台，这比单纯性能优化更关键。

---

### 3.2 可复现性与确定性
**涉及项目：dbt-core / Substrait，Spark 部分体现于工程稳定性**

- **dbt-core**
  - lockfile 哈希漂移
  - 环境变量进入 Git package lock 计算导致跨环境不一致
- **Substrait**
  - 通过收紧测试和类型约束，推动不同实现对同一规范产生一致结果
- **Spark**
  - 虽未直接表现为 lockfile 问题，但脚本解析、环境兼容、测试回归本质上也在提升工程行为可预测性

**共同信号**：  
生态正在更重视“**同样输入，产生同样结果**”。这对 CI/CD、跨环境部署、跨引擎互操作尤其关键。

---

### 3.3 开发者体验与易用性
**涉及项目：dbt-core / Spark / Substrait**

- **dbt-core**
  - `packages.yml` 缺失 version 时修复 KeyError
  - docs 支持 `.jinja/.jinja2/.j2`
  - selector 组合能力增强
- **Spark**
  - pandas-on-Spark Plotly 支持增强
  - docstring / docs 修复
  - `bin/pyspark` 脚本稳定性修复
  - warehouse 路径空格兼容性修复
- **Substrait**
  - commitlint / CI 依赖解析修复，改善贡献链路

**共同信号**：  
社区普遍在降低“边缘错误”“工具链摩擦”“学习成本”，这说明项目都已进入更强调开发者留存和协作效率的阶段。

---

### 3.4 面向复杂生产场景的能力增强
**涉及项目：dbt-core / Spark**

- **dbt-core**
  - selector method 可组合
  - state selection 精准化
  - 更严格的 flags/config 校验
- **Spark**
  - DSv2 Transaction API foundations
  - 分区发现深度配置
  - Geo 类型 SRID 支持
  - Streaming 正确性和状态管理修复

**共同信号**：  
两者都在服务更复杂的大型生产环境，但路径不同：dbt 偏编排与工程治理，Spark 偏执行引擎与数据处理底座。

---

## 4. 差异化定位分析

| 项目 | 功能侧重 | 目标用户 | 技术路线 | 当前典型关注点 |
|---|---|---|---|---|
| dbt-core | 数据建模编排、依赖管理、状态驱动执行 | 分析工程师、数据工程师、Analytics Engineering 团队 | 以 SQL/Jinja + 项目配置为核心，强调声明式开发和工程化治理 | lockfile、配置 strictness、selectors、错误提示 |
| Apache Spark | 通用分布式计算与 SQL 执行引擎 | 数据平台团队、引擎开发者、ETL/ML/Streaming 工程师 | 以执行引擎和数据源抽象为核心，覆盖批流一体、SQL、Python API | SQL 正确性、DSv2 事务、Geo、元数据扫描、PySpark 兼容 |
| Substrait | 跨引擎查询计划/表达式交换规范 | 查询引擎开发者、连接器开发者、规范实现方 | 以中立 IR/规范为核心，强调类型系统、函数签名、互操作标准 | 返回类型纠偏、nullability 规则、conformance/CI |

### 分项目判断

#### dbt-core
- **定位**：更偏“数据开发工作流层”和“项目治理层”。
- **核心价值**：让分析建模工作可测试、可复用、可状态感知、可纳入 CI/CD。
- **近期信号**：正在补齐“工程化成熟度”短板，特别是依赖确定性和配置严格性。

#### Spark
- **定位**：仍是 OLAP/湖仓数据处理底座中的“执行与计算核心”。
- **核心价值**：承接大规模批处理、SQL、Streaming、Python 生态工作负载。
- **近期信号**：进入“深水区优化”阶段，更多精力放在正确性、事务抽象、细粒度兼容性与平台能力扩展。

#### Substrait
- **定位**：生态互操作层的规范基础设施，而非直接面向终端数据开发者。
- **核心价值**：降低不同查询引擎、优化器、执行器之间的语义断层。
- **近期信号**：仍处于“规范收敛和边界澄清”阶段，单次变更可能小，但会对实现方产生较大影响。

---

## 5. 社区热度与成熟度

### 5.1 社区热度
从今日动态看：

- **Spark 社区最活跃**：PR 数最多，覆盖 SQL、Python、Streaming、UI、脚本等多个面，体现出大规模、多线程并行演进。
- **dbt-core 社区讨论最贴近用户痛点**：Issue 数明显更多，说明用户反馈链路活跃，产品层和工程层问题被快速暴露。
- **Substrait 社区热度较低但议题密度高**：更新少，但每个变更都集中在规范语义，属于“低频高影响”。

### 5.2 成熟度判断
- **Spark：高成熟度、持续深化阶段**
  - 没有明显的大规模方向摇摆
  - 主要围绕边界正确性、平台能力增强和生态兼容
  - 典型成熟项目特征明显

- **dbt-core：高活跃、工程治理持续收敛阶段**
  - 产品形态成熟，但在依赖管理、配置校验、错误体验上仍在快速补强
  - 社区对“strictness / fail fast / reproducibility”预期在提升

- **Substrait：规范型项目的快速收敛阶段**
  - 体量不大，但对语义准确性要求极高
  - 尚处于不断校正规则和实现契约的阶段
  - 对生态长期影响可能大于其短期活跃度表现

---

## 6. 值得关注的趋势信号

### 趋势一：可复现性正在成为数据基础设施的核心能力
从 dbt 的 lockfile 问题，到 Substrait 的类型/可空性收紧，都在说明：  
**未来数据平台不仅要跑通，还要稳定复现。**

**对数据工程师的参考价值：**
- 将 lockfile、依赖版本、环境隔离纳入正式治理
- 减少“开发环境可用、CI 环境异常”的工程风险
- 在选型时更关注工具是否支持 deterministic behavior

---

### 趋势二：正确性优先级持续上升，高于单纯性能叙事
Spark 今日最重要的 PR 很多都不是性能优化，而是：
- 数值稳定性
- Join 正确性
- Streaming 状态一致性

dbt 和 Substrait 也都在强化语义正确和边界清晰。

**参考价值：**
- 对核心数据链路，测试设计应覆盖边界条件而非只关注吞吐
- 对 SQL 引擎/建模框架升级，应重点验证结果一致性
- “回归测试能力”会成为平台团队竞争力的一部分

---

### 趋势三：大型工程场景推动“严格校验 + 更强组合能力”
dbt 的 selector method、flags strictness、state 精准检测，Spark 的 DSv2/分区发现调优，都反映出：
**项目正在从单机开发体验走向大规模组织协同和复杂生产编排。**

**参考价值：**
- 中大型团队应优先采用支持状态感知、依赖锁定、组合式选择器的工具链
- 建议把配置校验、语义校验、测试治理前移到 CI

---

### 趋势四：湖仓生态在向更强事务语义和跨引擎互操作演进
- Spark 在推进 DSv2 Transaction API foundations
- Substrait 在收紧规范语义
- dbt 在加强项目层依赖和执行选择控制

**参考价值：**
- 未来 OLAP 架构不再是单点工具竞争，而是“**编排层 + 执行层 + 规范层**”协同
- 技术选型应考虑跨层兼容性，而不是只看单一项目功能

---

### 趋势五：Databricks、Geo、Python 生态等垂直场景继续拉动底层演化
- dbt 中 Databricks 兼容性反馈持续出现
- Spark 原生 Geo 类型能力继续增强
- PySpark / pandas API on Spark 细节修补持续密集

**参考价值：**
- 垂直场景已成为基础设施演进的重要驱动力
- 若团队深度依赖 Databricks、GIS、Python notebook 分析，应更积极跟踪上游变化

---

## 结论

从今天的横向观察看，OLAP 基础设施生态的主旋律已经非常明确：  
**不是简单堆新功能，而是在可复现性、正确性、语义一致性和复杂场景工程能力上持续加固。**

对技术决策者而言：
- **dbt-core** 值得关注其依赖治理和选择器能力进展，适合作为分析工程工作流层重点评估对象；
- **Spark** 仍是执行底座中的核心项目，尤其应跟踪事务 API、SQL 正确性和数据湖可调优性；
- **Substrait** 虽然热度不高，但对跨引擎互操作的长期战略价值越来越大。

对数据工程师而言，最实际的建议是：
1. 优先建设 **可复现依赖与环境治理**；
2. 在升级引擎/框架时，把 **正确性回归** 放在性能测试之前；
3. 关注 **状态驱动执行、事务语义、跨引擎规范** 这三类能力，它们会成为未来 OLAP 平台演进的关键支点。

如果你愿意，我还可以继续把这份报告整理成以下任一版本：
1. **管理层 1 页汇报版**
2. **数据平台团队技术追踪版**
3. **附“建议动作 / 风险等级 / 关注优先级”的运营版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报（2026-03-14）

> 数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

今天 dbt-core 社区的讨论重点集中在两个方向：一是 **依赖与 lockfile 的确定性问题**，特别是 `package-lock.yml` 在不同机器、不同命令参数下出现哈希差异；二是 **配置校验与错误提示体验**，包括 `packages.yml` 缺失版本字段时报错不友好、`flags:` 配置过于宽松等。  
此外，社区也在继续推进一些易用性增强，例如支持 `.jinja/.j2` 文档文件扩展名，以及让 selector 能作为通用 selector method 使用。

---

## 3. 社区热点 Issues

> 过去 24 小时内更新的 Issue 共 9 条，以下全部纳入重点跟踪。

### 1) `package-lock.yml` 在 `--add-package` 与常规执行间生成不同哈希
- **Issue**: [#10913](https://github.com/dbt-labs/dbt-core/issues/10913)
- **标题**: `[Bug] package-lock.yml has different hashes when --add-package is used or not`
- **为什么重要**: 这是典型的 **依赖解析确定性** 问题，会直接影响团队协作、CI 稳定性以及 lockfile 是否可被可靠提交与复现。
- **社区反应**: 已有 10 条评论，是本批次中讨论最充分的问题之一，说明该问题对实际项目影响较广。
- **当前判断**: 该问题与今天另一条 env var 相关的 lockfile 议题共同表明，dbt 社区正在持续收敛“依赖锁定结果应稳定可复现”的共识。

### 2) Git package URL 中包含环境变量时，应避免无意义地重建 lockfile
- **Issue**: [#11953](https://github.com/dbt-labs/dbt-core/issues/11953)
- **标题**: `[Feature] Avoid unnecessary package-lock.yml regeneration for git packages with environment variables`
- **为什么重要**: 在企业环境中，Git 凭证、token、私有源地址常通过环境变量注入；如果这些变量进入 lock 计算，会导致 **同一依赖定义在不同环境产生不同 lockfile**。
- **社区反应**: 评论数不多，但已直接催生对应 PR（见 #11954），说明问题边界清晰、实现路径明确。
- **当前判断**: 这是当前最有进展的依赖治理问题之一，值得持续关注其合入情况。

### 3) `dbt run --empty` 与 Databricks Lakehouse Federation SQL 兼容性问题已关闭
- **Issue**: [#11676](https://github.com/dbt-labs/dbt-core/issues/11676)
- **标题**: `[Bug] Databricks Lakehouse Federation: Invalid SQL with WITH ('fetchSize' = 100000) and dbt run --empty`
- **为什么重要**: 该问题反映了 dbt 在 **方言兼容性、空跑/验证模式** 下与特定引擎 SQL 生成之间的边界问题。
- **社区反应**: 讨论不多，但已关闭，说明维护者已给出处理结论。
- **当前判断**: 对使用 Databricks 联邦访问的团队来说，这类问题虽然小众，但对生产验证链路影响较大。

### 4) 建议将项目级 `flags:` 列表变为严格校验
- **Issue**: [#12590](https://github.com/dbt-labs/dbt-core/issues/12590)
- **标题**: `[Feature] make flags: list strict`
- **为什么重要**: 当前 `flags:` 配置“几乎什么都能写”，意味着拼写错误、废弃项或自定义字段可能悄悄被接受，降低配置可靠性。
- **社区反应**: 评论不多，但该议题和 dbt 近年来强调的 **strictness / dep warnings** 方向高度一致。
- **当前判断**: 这是典型的“短期可能增加约束，长期提升可维护性”的改进方向。

### 5) Python 依赖需要兼容即将到来的 mypy 1.20.x
- **Issue**: [#12385](https://github.com/dbt-labs/dbt-core/issues/12385)
- **标题**: `[Feature] requirements compatibility with mypy 1.20.x (upcoming)`
- **为什么重要**: 这反映出 dbt-core 在 **开发工具链与 Python 生态依赖升级** 方面的压力，尤其对贡献者、本地开发和 CI 检查环境有直接影响。
- **社区反应**: 暂时讨论有限，但这类兼容性问题通常会在版本窗口临近时快速升温。
- **当前判断**: 更偏维护性需求，但对核心开发效率很关键。

### 6) Databricks Unity Catalog 中 model description 未展示问题已关闭
- **Issue**: [#12172](https://github.com/dbt-labs/dbt-core/issues/12172)
- **标题**: `[Bug] Table description not in Unity Catalog (Databricks)`
- **为什么重要**: 这关系到 dbt 的 **元数据下推与目录系统集成**，特别是数据资产治理、数据目录可读性和文档可发现性。
- **社区反应**: 讨论不多，但问题已关闭，说明已有明确处理结果。
- **当前判断**: Databricks 生态用户依然是 dbt-core 社区的重要反馈来源。

### 7) `state:modified+` 未识别 YAML 中列级自定义 key 变更的问题已关闭
- **Issue**: [#12469](https://github.com/dbt-labs/dbt-core/issues/12469)
- **标题**: `[Bug] state:modified+ fails to detect changes to column-level custom key in YAML`
- **为什么重要**: 该问题击中了 dbt 用户高度依赖的 **state selection / 增量构建 / 变更检测** 场景，直接影响 CI 精准执行和回归范围控制。
- **社区反应**: 评论不多，但问题本身价值很高，因为 state 机制是大型项目降本提效的关键。
- **当前判断**: 即便已关闭，也值得团队检查是否会影响自身依赖的自定义元数据字段。

### 8) `packages.yml` 缺失 version 时，`dbt debug` 抛出难以理解的 `KeyError`
- **Issue**: [#12649](https://github.com/dbt-labs/dbt-core/issues/12649)
- **标题**: `[Bug] Missing version specification in packages.yml leads to cryptic KeyError when using dbt debug`
- **为什么重要**: 这是一个典型的 **错误消息质量** 问题。用户配置出错不可避免，但核心工具应该返回可定位、可修复的提示，而不是底层异常。
- **社区反应**: 已迅速出现修复 PR（#12650），说明问题重现简单、修复优先级较高。
- **当前判断**: 虽然是“小 bug”，但非常影响新用户和日常排障体验。

### 9) 是否允许重复定义 data tests，社区需要明确语义
- **Issue**: [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)
- **标题**: `[Bug/Feature] Let's decide! Allow data tests to be duplicated or not`
- **为什么重要**: 这不是单纯 bug，而是 **行为定义与产品语义** 问题。重复 data test 是应视为合法复用、冲突，还是应显式报错，都会影响项目组织方式和测试治理。
- **社区反应**: 目前评论为 0，仍处于“抛出问题、等待共识”的早期阶段。
- **当前判断**: 这是未来可能牵动 test manifest、唯一性约束和 CLI 行为的一类设计议题。

---

## 4. 重要 PR 进展

> 过去 24 小时内更新的 PR 共 5 条，以下全部列为重点。

### 1) 排除环境变量参与 package lockfile 生成
- **PR**: [#11954](https://github.com/dbt-labs/dbt-core/pull/11954)
- **标题**: `Exclude environment variables when generating package lockfile`
- **核心内容**: 针对 [#11953](https://github.com/dbt-labs/dbt-core/issues/11953)，避免 Git package URL 中的环境变量影响哈希计算，从而提升 `package-lock.yml` 的稳定性与跨环境一致性。
- **意义**: 这是今天最值得关注的 PR 之一，直接服务于 **依赖可复现性** 和团队协同。

### 2) 支持 `.jinja/.jinja2/.j2` 作为 docs 文件扩展名
- **PR**: [#12653](https://github.com/dbt-labs/dbt-core/pull/12653)
- **标题**: `feat: support .jinja/.jinja2/.j2 extensions for docs files`
- **核心内容**: 除 `.md` 外，允许 dbt 解析带有 Jinja 模板扩展名的文档文件中的 doc blocks。
- **意义**: 对于使用 IDE 模板能力管理文档的团队更友好，属于 **开发体验增强** 型改进。

### 3) `dbtRunnerFs` 首个版本尝试
- **PR**: [#12652](https://github.com/dbt-labs/dbt-core/pull/12652)
- **标题**: `first pass: dbtRunnerFs`
- **核心内容**: 从标题和摘要看，这是一个面向 runner / 文件系统抽象的新能力初稿。
- **意义**: 虽然摘要信息有限，但从命名判断，这可能与运行器接口、文件系统访问抽象或新执行形态有关，值得关注后续设计细节。

### 4) 修复 package 版本校验，处理缺失字段场景
- **PR**: [#12650](https://github.com/dbt-labs/dbt-core/pull/12650)
- **标题**: `Fix package version validation to handle missing property`
- **核心内容**: 修复 [#12649](https://github.com/dbt-labs/dbt-core/issues/12649)，当 `packages.yml` 中 package 缺失 `version` 属性时，不再抛出晦涩 `KeyError`。
- **意义**: 这是一个典型的 **错误处理质量修复**，对 CLI 易用性提升明显。

### 5) 将 selector 作为 selector method 使用的实现推进
- **PR**: [#12582](https://github.com/dbt-labs/dbt-core/pull/12582)
- **标题**: `implementation of selector selector method`
- **核心内容**: 允许 selector 不仅作为默认选择器或 `--selector` 参数使用，还能像其他 selector method 一样组合使用。
- **意义**: 这将提升 **选择器表达能力与可组合性**，对大型项目、复杂 CI/CD 编排和精准执行场景价值较大。

---

## 5. 功能需求趋势

结合今天更新的 Issues 和 PR，可以看到 dbt-core 社区当前的关注重点集中在以下几个方向：

### 1) 依赖管理与 lockfile 确定性
- 代表议题：[#10913](https://github.com/dbt-labs/dbt-core/issues/10913), [#11953](https://github.com/dbt-labs/dbt-core/issues/11953), [#11954](https://github.com/dbt-labs/dbt-core/pull/11954)
- **趋势解读**: 社区越来越重视 `dbt deps` 的可复现性，希望 lockfile 能真正做到“同定义、同结果”，避免环境变量、执行路径差异带来的噪音变更。

### 2) 配置校验严格化与错误提示改进
- 代表议题：[#12590](https://github.com/dbt-labs/dbt-core/issues/12590), [#12649](https://github.com/dbt-labs/dbt-core/issues/12649), [#12650](https://github.com/dbt-labs/dbt-core/pull/12650)
- **趋势解读**: dbt 项目复杂度提升后，宽松配置带来的“隐性错误”正在成为痛点。社区倾向于更早失败（fail fast）、更清晰提示（actionable errors）。

### 3) 状态感知执行与选择器能力增强
- 代表议题：[#12469](https://github.com/dbt-labs/dbt-core/issues/12469), [#12582](https://github.com/dbt-labs/dbt-core/pull/12582)
- **趋势解读**: 大型团队更加依赖 `state:modified`、selector 组合等能力，以控制执行范围、减少 CI 成本、提升变更影响分析精度。

### 4) 多引擎/多平台兼容性，尤其是 Databricks
- 代表议题：[#11676](https://github.com/dbt-labs/dbt-core/issues/11676), [#12172](https://github.com/dbt-labs/dbt-core/issues/12172)
- **趋势解读**: Databricks 相关兼容性仍然是高频反馈来源，涉及 SQL 生成、元数据同步、目录集成等多个层面。

### 5) 文档与测试语义的易用性提升
- 代表议题：[#12653](https://github.com/dbt-labs/dbt-core/pull/12653), [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)
- **趋势解读**: 一方面是 docs 文件扩展名支持等体验优化，另一方面是 data test 重复定义这类“语义边界”问题开始被重新审视。

---

## 6. 开发者关注点

从今天的反馈看，开发者最在意的痛点主要有：

### 1) “同一项目，不同环境，不同结果”
- 主要体现在 package lockfile 哈希漂移、环境变量参与依赖计算等问题。
- 这会导致 PR 噪音、CI 不稳定、团队难以判断 lockfile 变更是否真实有效。
- 相关链接：[#10913](https://github.com/dbt-labs/dbt-core/issues/10913), [#11953](https://github.com/dbt-labs/dbt-core/issues/11953), [#11954](https://github.com/dbt-labs/dbt-core/pull/11954)

### 2) 配置写错时，报错需要“可理解、可操作”
- `KeyError` 这类底层异常暴露给用户，会放大排障成本。
- 社区明显希望 dbt 在 schema/config/deps 等入口更早做结构化校验。
- 相关链接：[#12649](https://github.com/dbt-labs/dbt-core/issues/12649), [#12650](https://github.com/dbt-labs/dbt-core/pull/12650), [#12590](https://github.com/dbt-labs/dbt-core/issues/12590)

### 3) 大型项目需要更强的选择器与状态检测能力
- 选择器可组合、state 检测更准确，直接影响 CI/CD 效率。
- 对多仓库、多环境、增量发布团队尤其重要。
- 相关链接：[#12469](https://github.com/dbt-labs/dbt-core/issues/12469), [#12582](https://github.com/dbt-labs/dbt-core/pull/12582)

### 4) 适配 Databricks 等平台时，需要更稳定的 SQL 与元数据行为
- 既包括 SQL 生成兼容性，也包括 catalog/description 这类治理元数据落地效果。
- 相关链接：[#11676](https://github.com/dbt-labs/dbt-core/issues/11676), [#12172](https://github.com/dbt-labs/dbt-core/issues/12172)

### 5) 社区对“语义一致性”要求在提升
- 比如是否允许重复 data tests，这类问题表面是 bug，实际反映的是用户希望 dbt 对对象唯一性、行为边界给出更清晰定义。
- 相关链接：[#12643](https://github.com/dbt-labs/dbt-core/issues/12643)

---

如果你愿意，我还可以继续把这份日报补充成更适合团队内部转发的版本，例如：
1. **“管理层 1 分钟摘要版”**
2. **“数据工程师重点关注版”**
3. **“附风险等级与建议动作的运营版”**

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报（2026-03-14）

> 数据来源：[`github.com/apache/spark`](https://github.com/apache/spark)

## 1. 今日速览

今天 Spark 社区没有新版本发布，也没有新的 Issue 更新，讨论焦点几乎全部集中在 Pull Request。  
从 PR 动向看，热点主要落在 **SQL/数据源能力增强、PySpark/ pandas API 细节修复、Streaming 正确性修复** 三条主线。  
其中，**DSv2 Transaction API 基础设施、地理空间类型 SRID 支持、分区发现性能调优、数值稳定性修复** 是最值得数据基础设施团队重点关注的方向。

---

## 2. 重要 PR 进展

以下挑选 10 个最值得关注的 PR：

### 1) DSv2 Transaction API foundations
- **PR**: [#54642](https://github.com/apache/spark/pull/54642)
- **标题**: `[SPARK-55855][SQL][DML] DSv2 Transaction API foundations`
- **状态**: OPEN
- **为什么重要**:  
  这是今天最值得关注的基础设施级 PR 之一。它面向 **DataSource V2 的事务 API 基础能力**，直接关系到 Spark 在 DML、表格式集成以及更强一致性写入语义上的长期演进。
- **影响判断**:  
  如果推进顺利，将为 Spark 与更现代的数据湖表生态、事务型写入接口打下更稳的抽象层基础，尤其值得关注 Lakehouse、Connector、Catalog 相关开发者。

---

### 2) 允许预置注册表中的 Geo 类型启用 SRID
- **PR**: [#54780](https://github.com/apache/spark/pull/54780)
- **标题**: `[SPARK-55981][SQL] Allow Geo Types with SRID's fro the pre-built registry`
- **状态**: OPEN
- **为什么重要**:  
  该 PR 继续推进 Spark SQL 的 **地理空间类型能力**，目标是基于预编译的 SRID 列表启用 Geometry / Geography 类型。
- **影响判断**:  
  这说明 Spark 社区正在持续补强原生空间数据能力。对于 OLAP、GIS 分析、位置数据平台、地理维度建模都具有战略意义。

---

### 3) 为分区发现增加目录遍历深度配置
- **PR**: [#54787](https://github.com/apache/spark/pull/54787)
- **标题**: `[SPARK-54923][SQL] Add configuration for directory traversal depth before parallel partition discovery`
- **状态**: OPEN
- **为什么重要**:  
  新增配置 `spark.sql.sources.parallelPartitionDiscovery.traversalDepth`，用于控制在并行分区发现前，Driver 先串行展开多少层目录。
- **影响判断**:  
  这是典型的 **大规模数据湖元数据扫描性能优化**。对于深层目录、窄树结构、多分区 Hive 风格表，能够更精细地平衡 Driver 开销与并行发现收益。

---

### 4) 修复 asinh/acosh 在大数值场景下的数值不稳定
- **PR**: [#54677](https://github.com/apache/spark/pull/54677)
- **标题**: `[SPARK-55557][SQL] Fix numerical instability in asinh/acosh for large values`
- **状态**: OPEN
- **为什么重要**:  
  该 PR 为 `asinh/acosh` 引入更稳定的公式，避免大值下 `x^2` 溢出导致错误结果。
- **影响判断**:  
  这是 **数值计算正确性** 层面的修复，对科学计算、特征工程、金融风控以及复杂 SQL 数学函数依赖场景非常关键。

---

### 5) 为 SPJ partial clustering 缺陷补充回归测试
- **PR**: [#54714](https://github.com/apache/spark/pull/54714)
- **标题**: `[SPARK-55848][SQL] Add regression tests for SPJ partial clustering de...`
- **状态**: OPEN
- **为什么重要**:  
  该 PR 虽然是测试型修改，但针对的是 **SPJ（Storage Partitioned Join）partial clustering 导致 join 后去重结果错误** 的问题。
- **影响判断**:  
  这类回归测试往往反映优化器或物理分发策略存在过真实生产坑点。对关注查询正确性和 Join 优化稳定性的团队尤其重要。

---

### 6) 支持数组集合类操作对所有数据类型做哈希
- **PR**: [#53468](https://github.com/apache/spark/pull/53468)
- **标题**: `[SQL] [SPARK-54698][SQL] Support hashing for all data types for array set like operations`
- **状态**: OPEN
- **为什么重要**:  
  目标是提升数组 set-like 操作对更多数据类型的支持范围。
- **影响判断**:  
  这类能力增强看似细节，实际上会显著提升复杂半结构化数据处理、数组列分析、多值属性计算的可用性和一致性。

---

### 7) pandas-on-Spark Plotly backend 支持 pie chart subplots
- **PR**: [#54706](https://github.com/apache/spark/pull/54706)
- **标题**: `[SPARK-50111][Python] Add subplots support for pie charts in Plotly backend`
- **状态**: OPEN
- **为什么重要**:  
  为 pandas-on-Spark 在 Plotly backend 下的饼图增加 `subplots` 与 `layout` 参数支持。
- **影响判断**:  
  这是偏开发者体验的增强，说明社区仍在持续优化 **PySpark 与 pandas API on Spark 的可视化兼容性**，利好 notebook 分析场景和轻量探索式数据分析。

---

### 8) 保留 restore_index 时的非 int64 整型索引 dtype
- **PR**: [#54789](https://github.com/apache/spark/pull/54789)
- **标题**: `[SPARK-55989][PS] Preserve non-int64 index dtypes in restore_index`
- **状态**: OPEN
- **为什么重要**:  
  修复 pandas API on Spark 在恢复索引时丢失非 `int64` 整型 dtype 的问题。
- **影响判断**:  
  这是典型的 **兼容性/语义一致性修复**。对于依赖 pandas 行为一致性的迁移用户来说，索引 dtype 保真度直接影响测试通过率与下游逻辑稳定性。

---

### 9) 修复默认 warehouse 目录在含空格路径下的问题
- **PR**: [#54794](https://github.com/apache/spark/pull/54794)
- **标题**: `[SPARK-49825] Fix the default warehouse dir for case with white spaces.`
- **状态**: OPEN
- **为什么重要**:  
  针对默认 warehouse 目录路径中包含空格时的处理问题进行修复。
- **影响判断**:  
  这是典型的 **环境兼容性与安装易用性** 修复，虽然不属于高阶功能，但对本地开发、Windows/macOS、企业桌面环境部署体验影响明显。

---

### 10) 修复 `bin/pyspark` 中 `SPARK_CONNECT_MODE` 解析逻辑
- **PR**: [#54796](https://github.com/apache/spark/pull/54796)
- **标题**: `[SPARK-52687] Fix SPARK_CONNECT_MODE parsing in bin/pyspark`
- **状态**: CLOSED
- **为什么重要**:  
  该修复将 `bin/pyspark` 中基于 stdout 的模式检测改为基于 exit code 的方式，避免 `\r`、空格、tab 等隐形字符导致解析错误。
- **影响判断**:  
  这是一个小而关键的 **CLI 稳定性修复**，尤其影响 Spark Connect 相关启动链路和脚本可靠性。
- **摘要**:  
  该 PR 已关闭，通常意味着已完成合并或被替代，值得继续跟踪其落地方式。

---

## 3. 社区热点 Issues

**今日过去 24 小时内更新的 Issues 数量为 0，因此没有可直接列出的热点 Issue。**

不过，从当天活跃 PR 所映射的问题域来看，以下 10 个“隐含热点议题”最值得持续关注：

### 1) DSv2 事务语义与 DML 能力
- 关联：[#54642](https://github.com/apache/spark/pull/54642)
- 重要性：关系到 Spark SQL 对现代数据源事务能力的抽象边界，是湖仓生态融合的重要底座。
- 社区反应：虽然当天无 Issue 更新，但能进入基础 API 层，说明这是中长期主线能力。

### 2) 原生地理空间类型演进
- 关联：[#54780](https://github.com/apache/spark/pull/54780)
- 重要性：SRID 支持是地理空间类型从“可用”走向“可生产”的关键一步。
- 社区反应：地理空间支持连续出现，说明该方向在持续推进。

### 3) 分区发现与元数据扫描性能
- 关联：[#54787](https://github.com/apache/spark/pull/54787)
- 重要性：直接影响大规模数据湖表的读取启动成本和 Driver 压力。
- 社区反应：属于典型生产场景反馈驱动的优化方向。

### 4) SQL 数学函数的数值正确性
- 关联：[#54677](https://github.com/apache/spark/pull/54677)
- 重要性：错误结果比性能问题更严重，尤其在统计建模和计算密集型场景。
- 社区反应：函数正确性修复一直是 SQL 引擎成熟度的重要信号。

### 5) Join/分区优化带来的结果正确性风险
- 关联：[#54714](https://github.com/apache/spark/pull/54714)
- 重要性：优化器相关问题往往隐蔽，且可能只在复杂数据分布下暴露。
- 社区反应：出现专门回归测试，说明问题具有实际影响面。

### 6) pandas API on Spark 的 dtype 一致性
- 关联：[#54789](https://github.com/apache/spark/pull/54789)
- 重要性：迁移 pandas 工作负载时，dtype 偏差是最常见兼容性痛点之一。
- 社区反应：相关修复持续出现，反映用户对行为一致性要求很高。

### 7) PySpark 文档质量与函数说明修正
- 关联：[#54792](https://github.com/apache/spark/pull/54792), [#54795](https://github.com/apache/spark/pull/54795)
- 重要性：文档问题虽然不影响核心执行，但会直接影响 API 学习成本与误用概率。
- 社区反应：连续两条文档修复，说明文档治理仍是活跃维护方向。

### 8) Spark Connect / PySpark 启动脚本稳定性
- 关联：[#54796](https://github.com/apache/spark/pull/54796)
- 重要性：连接模式、脚本检测逻辑属于用户“第一接触点”，任何不稳定都会放大体验问题。
- 社区反应：脚本层问题能快速被修复，说明社区对易用性比较敏感。

### 9) Structured Streaming 状态格式与窗口 Join 正确性
- 关联：[#54786](https://github.com/apache/spark/pull/54786)
- 重要性：流流 Join 和 state format 升级都属于高风险区域。
- 社区反应：相关修复被快速关闭处理，表明该方向维护节奏较快。

### 10) 本地/多平台环境兼容性问题
- 关联：[#54794](https://github.com/apache/spark/pull/54794)
- 重要性：路径空格、脚本解析、环境页面配置导出等，都是“最后一公里”工程体验问题。
- 社区反应：这类问题数量虽小，但长期高频出现，说明用户基数广、环境复杂。

---

## 4. 功能需求趋势

基于今日全部活跃 PR，可提炼出 Spark 社区当前较明显的需求趋势：

### 1) SQL 引擎正确性与边界行为持续强化
- 代表 PR：[#54677](https://github.com/apache/spark/pull/54677), [#54714](https://github.com/apache/spark/pull/54714), [#53468](https://github.com/apache/spark/pull/53468)
- 趋势判断：  
  社区不仅关注性能，也在强化 **数学函数、数组操作、Join 优化后语义一致性**。这对 OLAP 引擎成熟度尤为关键。

### 2) DataSource V2 与表能力继续向更强事务语义推进
- 代表 PR：[#54642](https://github.com/apache/spark/pull/54642)
- 趋势判断：  
  Spark 正继续夯实 **现代数据源接口层**，这可能为未来更复杂的写入控制、事务协调、DML 语义扩展奠定基础。

### 3) 地理空间能力是新兴重点方向
- 代表 PR：[#54780](https://github.com/apache/spark/pull/54780)
- 趋势判断：  
  原生 Geo Types 与 SRID 支持的持续出现，表明 Spark 正尝试补齐空间分析这一高价值扩展面。

### 4) 大规模数据湖读取路径的可调优性增强
- 代表 PR：[#54787](https://github.com/apache/spark/pull/54787)
- 趋势判断：  
  元数据遍历、分区发现、Driver/Executor 分工等方面仍是社区重点关注的性能瓶颈。

### 5) PySpark / pandas API on Spark 继续打磨兼容性与开发体验
- 代表 PR：[#54706](https://github.com/apache/spark/pull/54706), [#54789](https://github.com/apache/spark/pull/54789), [#54790](https://github.com/apache/spark/pull/54790), [#54792](https://github.com/apache/spark/pull/54792), [#54795](https://github.com/apache/spark/pull/54795)
- 趋势判断：  
  重点集中在 **API 一致性、文档修正、代码现代化、可视化支持**，说明 Python 用户仍是社区极其重要的受众。

### 6) Structured Streaming 仍以正确性修补为主
- 代表 PR：[#54786](https://github.com/apache/spark/pull/54786), [#54381](https://github.com/apache/spark/pull/54381)
- 趋势判断：  
  流处理仍然聚焦于 **状态管理、检查点目录行为、窗口 Join 正确性** 等生产稳定性问题。

---

## 5. 开发者关注点

结合今日 PR 内容，当前开发者最关心的痛点主要有以下几类：

### 1) “结果必须正确”优先于“跑得更快”
- 体现：Join 语义、数学函数稳定性、Streaming 状态管理修复。
- 说明：  
  在 Spark 进入更成熟生产阶段后，社区越来越重视边界条件下的正确性，而非单纯性能数字。

### 2) 复杂数据湖场景下的元数据开销依然突出
- 体现：分区发现深度配置、DSv2 基础能力建设。
- 说明：  
  大规模目录树、深层分区、现代表格式集成，仍然是 Spark 生产环境中的高频痛点。

### 3) Python 生态用户对“行为一致性”要求很高
- 体现：索引 dtype 保留、docstring 修正、Plotly 支持、super() 语法简化。
- 说明：  
  pandas API on Spark 和 PySpark 的使用者不只关注功能是否存在，也非常关注与 pandas / Python 习惯是否一致。

### 4) CLI、脚本与环境兼容性问题不能忽视
- 体现：`SPARK_CONNECT_MODE` 解析、warehouse 路径空格问题、Environment 页面导出配置。
- 说明：  
  这些问题看似边角，但往往是用户最先遇到、最容易造成“Spark 不稳定”印象的地方。

### 5) Spark 正在向更完整的数据平台能力演进
- 体现：事务 API、Geo 类型、UI 配置导出。
- 说明：  
  社区关注点不再只局限于执行引擎，而是逐步扩展到 **数据平台基础能力、可运维性、跨场景适配**。

---

## 6. 其他值得一看的 PR

- [#54790](https://github.com/apache/spark/pull/54790) `SPARK-52785: simplifying super() syntax in PySpark`  
  聚焦 PySpark 代码现代化与可维护性。
- [#54792](https://github.com/apache/spark/pull/54792) `[SPARK-55357][PYTHON] Fix docstring for timestamp_add`  
  修正文档说明，降低 API 误用概率。
- [#54795](https://github.com/apache/spark/pull/54795) `[SPARK-50284][PYTHON] change docs for parseJson function`  
  属于文档准确性改进。
- [#54762](https://github.com/apache/spark/pull/54762) `[SPARK-55839] Add export config button to Environment page`  
  增强 Web UI 运维便利性。
- [#54788](https://github.com/apache/spark/pull/54788) `[SPARK-55988][PS][TESTS] Compare categorical index codes by values in tests`  
  改进 pandas-on-Spark 测试稳健性。
- [#54791](https://github.com/apache/spark/pull/54791) `[WIP][SPARK-55805] fixed ignore type override for linter in _SimpleStreamReaderWrapper`  
  偏工具链与代码质量治理。

---

## 结语

今天的 Spark 社区节奏偏“工程深化”：没有版本发布，也没有新 Issue 扰动，但 PR 层面呈现出非常明确的演进方向——**SQL 正确性、数据源事务基础、地理空间能力、Python 兼容性、Streaming 稳定性**。  
对于数据工程团队而言，建议重点跟踪 **#54642、#54780、#54787、#54677、#54714**，这些变化最可能在未来版本中带来实际架构收益。

如果你愿意，我可以继续把这份日报整理成：
1. **适合发公众号/内部周报的精简版**，或  
2. **按“SQL / PySpark / Streaming / UI”分类的技术追踪版**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报（2026-03-14）

## 1. 今日速览

过去 24 小时内，Substrait 仓库没有新版本发布，也没有新的 Issue 更新，社区讨论重心主要集中在 3 个 Pull Request 上。  
其中最值得关注的是一个 **潜在破坏性变更**：`add:date_iyear` 的返回类型拟从 `timestamp` 更正为 `date`；同时，测试用例中的 **nullability 约束** 正在被进一步收紧，说明项目正在持续提升规范一致性与类型系统严谨性。

---

## 4. 重要 PR 进展

> 过去 24 小时仅有 3 个 PR 更新，以下按重要性整理。

### 1) PR #1007：修正 `add:date_iyear` 的返回类型，属于 Breaking Change
- **状态**：OPEN  
- **作者**：@nielspardon  
- **链接**：https://github.com/substrait-io/substrait/pull/1007

**内容概述**  
该 PR 将 `add:date_iyear` 操作的返回类型从 `timestamp` 更正为 `date`。因为 `interval_year` 表示年/月间隔，给 `date` 加上该间隔后，结果保持为 `date` 更符合语义。

**为什么重要**  
这是一个典型的 **扩展函数签名纠偏**，直接影响实现方对 Substrait 扩展函数的类型推断、执行兼容性以及跨引擎一致性。  
PR 标注了 `BREAKING CHANGE`，意味着依赖当前错误返回类型的实现或测试可能需要同步调整。

---

### 2) PR #989：测试用例强化 null literal 的可空性约束
- **状态**：OPEN  
- **作者**：@benbellick  
- **链接**：https://github.com/substrait-io/substrait/pull/989

**内容概述**  
该 PR 修复测试用例，使其严格遵守扩展 YAML 中每个函数定义的 `nullability` 规则。  
具体包括：
- 对于 `MIRROR` 函数：只要任一参数可空，输出就必须标记为可空（`?`）
- 对于 `DECLARED_OUTPUT` 函数：输出可空性必须与声明的返回类型一致

**为什么重要**  
这体现出 Substrait 在 **类型系统与函数契约一致性** 上的持续收敛。  
对于生成器、验证器、执行引擎和 conformance 测试实现者来说，这类修复会减少规范解释歧义，帮助不同系统之间更稳定地互操作。

---

### 3) PR #1008：修复 commitlint 在 CI 中的依赖解析失败
- **状态**：CLOSED  
- **作者**：@benbellick  
- **链接**：https://github.com/substrait-io/substrait/pull/1008

**内容概述**  
该 PR 修复 CI 环境下 `commitlint` 通过 `npx` 拉起时无法解析 `tinyexec` 传递依赖的问题。修复方式是显式安装 `@commitlint/cli`，并通过 `--no-install` 避免 `npx` 的隔离缓存带来的模块解析失败。

**为什么重要**  
虽然这不是规范层面的功能更新，但对社区协作效率很关键。  
CI 稳定性直接影响贡献者提交体验、PR 检查通过率以及维护者的合并节奏，是开源项目健康运转的重要基础设施。

---

## 5. 功能需求趋势

> 由于过去 24 小时没有 Issue 更新，以下趋势主要基于当日 PR 动向提炼。

### 1) 类型系统精确化
从 `add:date_iyear` 返回类型修正可以看出，社区正在持续校正函数签名与实际语义之间的偏差。  
这说明 **函数返回类型、参数约束、时间/日期语义一致性** 仍是 Substrait 演进中的重点方向。

### 2) Nullability 规则收紧与规范落地
PR #989 表明，社区对 **可空性传播规则** 的关注度在上升。  
对于一个面向跨引擎计划交换的规范来说，nullability 是影响类型检查、表达式推导、优化器行为和执行结果一致性的核心问题。

### 3) 开发流程与 CI 健壮性
PR #1008 反映出维护者正在改善开发者工具链与 CI 可靠性。  
随着社区协作规模扩大，**自动化校验、依赖稳定性、提交流程标准化** 也成为重要基础工作。

---

## 6. 开发者关注点

### 1) 规范与实现语义必须严格对齐
当前最明显的开发者关注点，是扩展函数定义中的 **返回类型与 nullability 规则** 必须准确无歧义。  
这对下游实现者尤其关键，因为任何细微偏差都可能导致：
- 类型推断不一致
- 跨引擎行为差异
- conformance 测试失败

### 2) Breaking Change 需要明确传达
`add:date_iyear` 的修正被明确标记为 `BREAKING CHANGE`，说明社区开始更重视对兼容性影响的显式管理。  
对数据库内核、查询编译器和连接器开发者来说，提前识别这类变更非常重要。

### 3) 贡献链路稳定性仍是基础诉求
CI 中 `commitlint` 的依赖解析问题虽然偏工程化，但它会直接影响贡献体验。  
开发者普遍希望仓库具备：
- 可复现的本地/CI 行为
- 稳定的依赖解析
- 明确的提交规范与自动检查机制

---

## 补充说明：社区热点 Issues

过去 24 小时内 **没有新的 Issue 更新**，因此今天暂无可列出的热点 Issue。  
后续若出现规范讨论、函数扩展提案或兼容性问题，通常会成为最值得跟踪的议题来源。

---

## 今日链接汇总

- PR #989：fix: enforce nullable types for null literals in test cases  
  https://github.com/substrait-io/substrait/pull/989

- PR #1007：fix(extensions)!: correct return type for `add:date_iyear` operation  
  https://github.com/substrait-io/substrait/pull/1007

- PR #1008：ci: fix commitlint tinyexec module resolution failure  
  https://github.com/substrait-io/substrait/pull/1008

如果你愿意，我还可以继续把这份日报整理成 **适合飞书/Slack 发布的短版**，或者输出成 **Markdown 周报模板**。

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*