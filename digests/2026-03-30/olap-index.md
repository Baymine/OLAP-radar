# OLAP 生态索引日报 2026-03-30

> 生成时间: 2026-03-30 01:45 UTC | 覆盖项目: 3 个

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## 横向对比

# OLAP 数据基础设施生态横向对比分析报告  
**日期：2026-03-30**  
**覆盖项目：dbt-core / Apache Spark / Substrait**

---

## 1. 生态全景

当前 OLAP 数据基础设施生态呈现出一个非常清晰的演进方向：**从“功能可用”转向“工程可用、平台可集成、语义可互操作”**。  
dbt-core 的重点落在开发者体验、错误可读性和跨环境稳定性；Spark 一边修复生产级稳定性问题，一边推进 Spark Connect 与多语言扩展；Substrait 则继续强化标准层的函数语义与物理计划表达。  
三者合起来看，行业正在同步推进三层能力：**数据开发工作流层（dbt）**、**执行与计算平台层（Spark）**、**跨引擎计划/语义标准层（Substrait）**。  
这说明 OLAP 基础设施正进入更成熟的阶段：不再只比拼执行能力，而是同时竞争 **可调试性、可观测性、兼容性、标准化和生态协同能力**。

---

## 2. 各项目活跃度对比

> 注：以下统计基于给定日报内容；dbt-core 未给出“全部 PR 总数”，以下以“明确列出的重点 PR / 活跃 Issue”作为可观测口径。

| 项目 | 今日活跃 Issue 数 | 今日可观测 PR 数 | Release 情况 | 今日活跃重点 |
|---|---:|---:|---|---|
| dbt-core | 0 | 10+ | 无新版本 | 错误信息优化、CLI 体验、测试体系、跨平台兼容 |
| Apache Spark | 3 | 10 | 无新版本 | SHS 可扩展性、Spark Connect 稳定性、SQL/DSv2 能力补齐 |
| Substrait | 0 | 1 | **发布 v0.87.0** | 统计聚合函数扩展、TopNRel 物理算子建模 |

### 简要解读
- **dbt-core**：Issue 面平静，但 PR 非常密集，说明当前社区更多在进行**修复式和体验型迭代**。  
- **Spark**：Issue 与 PR 同时活跃，表明其既有现实生产问题在暴露，也有中长期能力在持续推进。  
- **Substrait**：活跃度绝对值较低，但有正式版本发布，说明其节奏偏**规范驱动型演进**，而不是高频问题修复型社区。

---

## 3. 共同关注的功能方向

尽管三个项目分属不同层次，但从今天动态中可以看到多个共性方向。

### 3.1 可读性更强的错误与结果反馈
**涉及项目：dbt-core、Spark**

- **dbt-core**：集中修复宏编译错误上下文不足、selector 错误提示不明确、测试失败与执行错误混淆、parse 阶段误用 `run_query` 提示不清等问题。
- **Spark**：DSv2 connector API 将 legacy error code 替换为具名错误；文档补充聚合函数返回类型，也是在提升行为可解释性。

**共同诉求**：  
让开发者在第一时间理解“哪里错、为什么错、该怎么改”，减少排障时间与误判成本。  
这说明 OLAP 工具链已经把 **调试效率** 视为核心产品能力，而非附属体验。

---

### 3.2 面向系统集成的结构化输出
**涉及项目：dbt-core、Spark、Substrait**

- **dbt-core**：JSON artifacts 增加 pretty-print 缩进，改善人工审查与版本比对体验。
- **Spark**：`SHOW TABLES` / `SHOW TABLE EXTENDED` 增加 `AS JSON` 输出，直接面向平台集成与自动化消费。
- **Substrait**：本质上就是将查询语义与计划表达结构化、标准化，今天的 TopNRel 也是在补齐这种结构化表达能力。

**共同诉求**：  
输出不仅要“给人看”，更要“给系统消费”。  
这反映出数据平台越来越依赖 **artifact、元数据命令、协议结构** 进行自动编排、治理和观测。

---

### 3.3 兼容性与跨环境稳定性
**涉及项目：dbt-core、Spark**

- **dbt-core**：关注 CRLF/LF 差异、Git 输出差异、受限网络中的 telemetry timeout 等。
- **Spark**：关注 MySQL `UNSIGNED TINYINT` 映射、Spark Connect 构建与连接层稳定性。

**共同诉求**：  
在异构企业环境中，工具需要具备更强的**跨平台、跨协议、跨系统容错能力**。  
这说明生态竞争已经深入到复杂生产环境，而不只是标准实验环境。

---

### 3.4 语义精确化与标准补齐
**涉及项目：Spark、Substrait**

- **Spark**：聚合函数返回类型文档、DSv2 元数据能力、SQL scripting 语义处理，都在提升语义边界清晰度。
- **Substrait**：新增 `std_dev` / `variance` 及 distribution enum，推进 TopN WITH TIES 的标准表达。

**共同诉求**：  
让系统间、组件间、语言间对同一查询行为有**更明确的一致理解**。  
这对联邦查询、跨引擎执行、UDF 扩展和查询计划交换都非常关键。

---

## 4. 差异化定位分析

### 4.1 dbt-core：聚焦数据开发工作流与工程体验
- **功能侧重**：测试、选择器、宏开发、artifact、CLI 日志、报错质量。
- **目标用户**：分析工程师、数据工程师、平台团队、CI/CD 管理者。
- **技术路线**：通过声明式建模、编译/解析机制和工件体系，提高 SQL 开发流程的可维护性和可协作性。
- **今日信号**：没有明显大功能上新，更多是对“日常使用痛点”的系统性打磨，说明其产品成熟度已较高，当前重点是**降低复杂项目的维护成本**。

### 4.2 Apache Spark：聚焦统一执行平台与生产级扩展
- **功能侧重**：大规模执行、历史服务、远程执行协议、SQL/DSv2、跨系统兼容。
- **目标用户**：数据平台团队、引擎开发者、湖仓架构师、企业数据基础设施团队。
- **技术路线**：在分布式计算内核之上，持续强化 SQL、Connect、元数据、外部系统兼容与多语言能力。
- **今日信号**：短期修复与长期战略并行推进，尤其是 **Spark Connect + language-agnostic UDF**，表明 Spark 正继续从“计算引擎”向“数据应用平台协议层”外延。

### 4.3 Substrait：聚焦跨引擎语义标准与计划互操作
- **功能侧重**：函数标准化、proto 定义、逻辑/物理计划模型、跨引擎语义一致性。
- **目标用户**：查询引擎开发者、优化器作者、联邦查询系统、标准适配层建设者。
- **技术路线**：以标准规范和 protobuf 为核心，降低不同 OLAP/查询引擎之间的计划交换与语义映射成本。
- **今日信号**：版本更新和单个关键 PR 都高度集中于“规范补齐”，说明其仍处于**标准能力逐步扩面、逐项落地**的阶段。

---

## 5. 社区热度与成熟度

### 社区热度
从今天的动态密度看：

1. **Apache Spark**：综合热度最高  
   - 同时有活跃 Issue、10 个重点 PR，覆盖核心执行、Connect、SQL、文档与兼容性。
   - 说明其用户面广、生产问题复杂、社区分工成熟。

2. **dbt-core**：PR 热度很高，Issue 热度低  
   - 没有活跃 Issue，但修复型 PR 非常集中。
   - 这通常意味着社区已进入**高频增量优化**阶段，很多问题可能已在 PR 而非公开 Issue 中快速闭环。

3. **Substrait**：绝对热度较低，但方向明确  
   - Issue 无更新、PR 很少，但有 Release。
   - 更像一个**标准型项目**：活跃度不能只看数量，更要看规范推进的质量与影响半径。

### 成熟度判断
- **dbt-core**：成熟度高，处于**体验精修期**。  
  核心能力已稳定，当前重点是减少误用、优化交互、提升贡献者体验。
  
- **Spark**：成熟度最高，但仍处于**大规模扩展与复杂演进并行期**。  
  一方面核心系统成熟，另一方面 Spark Connect、DSv2 等新方向仍在持续演化。
  
- **Substrait**：处于**快速成形的标准化迭代期**。  
  标准影响力在扩大，但仍需持续补齐函数、算子和文档/协议一致性。

---

## 6. 值得关注的趋势信号

### 趋势一：OLAP 基础设施竞争重心转向“工程可用性”
无论是 dbt 的错误提示与 CLI 输出，还是 Spark 的命名错误、JSON 输出、SHS 可观测性，社区都在强化“日常运维与开发体验”。  
**对数据工程师的意义**：选型时不能只看性能指标，也要看报错质量、artifact 结构、CLI 观测性、CI 友好度。

---

### 趋势二：结构化元数据与机器可消费接口正在成为标配
dbt 的 artifacts、Spark 的 `AS JSON`、Substrait 的标准化计划定义，本质上都在推动系统输出向结构化协议演进。  
**对数据工程师的意义**：未来平台集成会越来越依赖 JSON/proto/plan schema，而不是解析文本日志或 CLI 输出；构建自动化治理系统时，应优先选择结构化接口成熟的组件。

---

### 趋势三：跨环境兼容与异构接入仍是生产落地的主要成本源
dbt 关注行尾、Git、网络超时；Spark 关注 JDBC 类型映射、编译链路、协议栈稳定性。  
**对数据工程师的意义**：真实生产问题往往不在 SQL 本身，而在外围环境。平台治理要加强对 **操作系统、网络、依赖版本、数据库方言、协议兼容** 的测试覆盖。

---

### 趋势四：执行引擎与标准层正在同步推进多语言和跨引擎互操作
Spark 推进 language-agnostic UDF IPC，Substrait 强化统计函数与物理算子表达。  
**对数据工程师的意义**：未来数据栈将更少依赖单一语言/单一引擎，更多采用“标准协议 + 多语言执行 + 多引擎协作”的组合模式。  
这对建设 Lakehouse 平台、联邦查询平台、统一语义层尤其关键。

---

### 趋势五：标准语义精细化会直接影响平台级能力建设
Substrait 的 `variance/std_dev` 分布枚举、Spark 的返回类型文档和 `WITH TIES` 相关能力，都说明社区正在收敛细粒度语义差异。  
**对数据工程师的意义**：当你在做跨引擎迁移、指标一致性校验、查询下推优化时，必须更重视函数语义和边界行为，而不仅是 SQL 是否“能跑”。

---

## 结论

从今天三个项目的动态来看，OLAP 生态已经形成清晰分层：

- **dbt-core** 代表数据开发与工程协作层；
- **Spark** 代表执行与平台承载层；
- **Substrait** 代表跨引擎标准与语义互操作层。

它们的共同趋势是：**更强调可调试、可集成、可兼容、可标准化**。  
对技术决策者而言，这意味着未来数据平台建设应避免只围绕单点性能做决策，而应更关注整条链路的 **工程体验、协议能力、异构兼容和生态协同**。  
对数据工程师而言，最有价值的能力将不只是写 SQL 或调 Spark 参数，而是能够理解并连接这三层：**开发工作流、执行平台、标准协议**。

如果你愿意，我可以继续把这份横向报告整理成以下任一格式：
1. **适合管理层汇报的 1 页精简版**
2. **适合飞书/Slack 发布的要点版**
3. **带“选型建议 / 风险提示 / 未来 3 个月观察点”的增强版**

---

## 各项目详细报告

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core 社区动态日报 · 2026-03-30

> 数据来源：[`dbt-labs/dbt-core`](https://github.com/dbt-labs/dbt-core)

## 1. 今日速览

过去 24 小时内，`dbt-core` 没有新版本发布、也没有新的活跃 Issue，但 PR 活跃度很高，且主题高度集中在**错误信息可读性提升、CLI/工件体验优化、跨平台兼容性修复**。  
今天最值得关注的是一批来自社区的修复型 PR：它们普遍不改变核心语义，却显著改善了 dbt 在测试、选择器、宏编译、快照校验、状态比较和 JSON 工件输出上的开发者体验。  
此外，单日出现多条围绕“更清晰报错”“更可观测执行过程”“更稳定跨环境行为”的提交，说明社区当前重点正从“新增功能”转向“提升工程可用性与可维护性”。

---

## 4. 重要 PR 进展

以下为今天最值得关注的 10 个 PR：

### 1) 支持 singular data test 正确识别 `config(name=...)`
- **PR**: [#12745](https://github.com/dbt-labs/dbt-core/pull/12745)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 修复 `.sql` 形式的 singular data test 中 `{{ config(name='...') }}` 被静默忽略的问题。
- **为何重要**: 这让 singular test 与 `models.yml` 中 generic test 的命名行为更加一致，改善 `dbt test` 输出可读性，也更利于 CI 中按测试名追踪失败项。

### 2) 为 JSON artifacts 增加 pretty-print 缩进选项
- **PR**: [#12744](https://github.com/dbt-labs/dbt-core/pull/12744)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 新增 `--write-json-indent` CLI 参数与 `DBT_WRITE_JSON_INDENT` 环境变量，使 `manifest.json`、`run_results.json` 等工件支持格式化输出。
- **为何重要**: 对人工调试、代码审查、版本比对都非常友好，尤其适合依赖 artifact 做二次集成的平台团队和编排系统。

### 3) `dbt clone` 增加逐模型日志输出
- **PR**: [#12743](https://github.com/dbt-labs/dbt-core/pull/12743)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 为 `dbt clone` 增加类似其他 runner 的 `before_execute/after_execute` 日志行为。
- **为何重要**: 解决 clone 过程“过于安静”的问题，提升任务可观测性，便于确认哪些模型被 clone、跳过或失败。

### 4) Jinja 宏编译错误中补充宏名与文件路径
- **PR**: [#12742](https://github.com/dbt-labs/dbt-core/pull/12742)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 在宏存在 Jinja 语法错误时，报错信息中加入宏名与文件路径。
- **为何重要**: 对大型项目价值很高。此前只有行号，没有文件上下文，定位成本很高；该修复直接缩短排障时间。

### 5) 缩短 Snowplow telemetry 超时时间
- **PR**: [#12741](https://github.com/dbt-labs/dbt-core/pull/12741)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 将 Snowplow 上报相关 GET/POST 超时从 5 秒降至 1 秒。
- **为何重要**: 网络不可达时，dbt 命令尾部不再被遥测阻塞数秒，改善 CLI 交互体验，尤其适合受限网络环境和企业内网场景。

### 6) selector 中孤立图操作符给出明确错误
- **PR**: [#12740](https://github.com/dbt-labs/dbt-core/pull/12740)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 对 `+`、`@`、`2+`、`+ model_name` 这类不完整或带空格的 selector 写法，显式抛出可操作的错误。
- **为何重要**: 选择器是 dbt 日常使用频率最高的功能之一；这类修复能减少“静默为空”或“行为诡异”带来的误判。

### 7) 增加贡献者测试指南 `TESTING.md`
- **PR**: [#12739](https://github.com/dbt-labs/dbt-core/pull/12739)
- **状态**: OPEN
- **作者**: @jayshilj
- **内容**: 为外部贡献者补充测试编写说明文档。
- **为何重要**: 这是典型的社区基础设施建设。虽然不是功能更新，但会降低首次贡献门槛，提升 PR 质量与测试覆盖一致性。

### 8) 测试报错时不再误提示 `store_failures` 表位置
- **PR**: [#12738](https://github.com/dbt-labs/dbt-core/pull/12738)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 当测试因 SQL/数据库错误而非断言失败时，不再打印“See test failures: ...”之类误导性信息。
- **为何重要**: 能区分“测试失败”和“测试执行报错”，减少排查误导，提升测试运行反馈质量。

### 9) `validate_macro_args` 对 generic test 隐式参数避免误报
- **PR**: [#12737](https://github.com/dbt-labs/dbt-core/pull/12737)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 在 generic test 场景下，校验宏参数时跳过隐式注入的 `model` / `column_name` 参数，避免 false-positive warning。
- **为何重要**: 有助于文档化自定义测试时获得更准确的参数校验结果，降低高级用户和包维护者的噪音。

### 10) 提示 `run_query` 等 introspective query 应放在 `{% if execute %}` 中
- **PR**: [#12736](https://github.com/dbt-labs/dbt-core/pull/12736)
- **状态**: OPEN
- **作者**: @claygeo
- **内容**: 当 `run_query` 或相关宏在 parse 阶段被误用时，增加更明确警告，而不是让用户看到后续晦涩的 `NoneType` 错误。
- **为何重要**: 这是 dbt 宏开发中的典型坑点。该改动能明显降低新手与中级开发者在宏调试中的学习成本。

---

## 5. 功能需求趋势

基于今日所有活跃 PR，可以观察到社区关注点主要集中在以下几个方向：

### A. 错误提示与调试体验增强
典型 PR：
- [#12742](https://github.com/dbt-labs/dbt-core/pull/12742)
- [#12740](https://github.com/dbt-labs/dbt-core/pull/12740)
- [#12738](https://github.com/dbt-labs/dbt-core/pull/12738)
- [#12736](https://github.com/dbt-labs/dbt-core/pull/12736)
- [#12734](https://github.com/dbt-labs/dbt-core/pull/12734)
- [#12732](https://github.com/dbt-labs/dbt-core/pull/12732)
- [#12730](https://github.com/dbt-labs/dbt-core/pull/12730)
- [#12700](https://github.com/dbt-labs/dbt-core/pull/12700)

**趋势解读**：  
社区目前非常重视“出错时能否第一时间定位问题上下文”。这包括：
- 报错中携带 node/macro/file path
- 解析阶段与执行阶段行为差异的提示
- 避免误导性日志
- 让 artifact 中保留更完整失败信息

这说明 dbt-core 正在朝着**更工程化、更适合集成到 CI/CD 和数据平台运维体系**的方向发展。

### B. CLI 可观测性与交互体验
典型 PR：
- [#12743](https://github.com/dbt-labs/dbt-core/pull/12743)
- [#12741](https://github.com/dbt-labs/dbt-core/pull/12744)
- [#12741](https://github.com/dbt-labs/dbt-core/pull/12741)

**趋势解读**：  
用户越来越关注命令执行过程是否透明、是否卡顿、输出是否便于查看。`dbt clone` 日志增强、遥测超时收紧、JSON 工件支持缩进，都属于“看起来小，但直接影响日常体验”的改进。

### C. 跨平台一致性与环境兼容性
典型 PR：
- [#12731](https://github.com/dbt-labs/dbt-core/pull/12731)
- [#12728](https://github.com/dbt-labs/dbt-core/pull/12728)
- [#12700](https://github.com/dbt-labs/dbt-core/pull/12700)

**趋势解读**：  
Windows/Linux 行尾差异、Git 配置差异、受限网络环境下的超时行为，都在影响 dbt 的可靠性。社区在持续修补这些“非 SQL 逻辑层”的稳定性问题，说明 dbt 的使用范围已深入更多异构基础设施环境。

### D. 测试体系与贡献者体验
典型 PR：
- [#12745](https://github.com/dbt-labs/dbt-core/pull/12745)
- [#12739](https://github.com/dbt-labs/dbt-core/pull/12739)
- [#12737](https://github.com/dbt-labs/dbt-core/pull/12737)
- [#12735](https://github.com/dbt-labs/dbt-core/pull/12735)
- [#12589](https://github.com/dbt-labs/dbt-core/pull/12589)

**趋势解读**：  
测试相关改动占比很高，既包括终端用户使用 unit test / generic test / singular test 的体验，也包括贡献者如何为 core 提交合适的测试。说明测试能力仍是 dbt-core 生态建设的重点。

---

## 6. 开发者关注点

结合今日 PR 内容，可以总结出当前开发者最常见的痛点：

### 1) “报错太模糊，定位成本高”
常见问题包括：
- 只有行号，没有文件名/宏名
- 配置校验错误不带 node 上下文
- env var 缺失不指明触发节点
- `run-operation` 失败后 `run_results.json` 缺少 message

相关 PR：
- [#12742](https://github.com/dbt-labs/dbt-core/pull/12742)
- [#12734](https://github.com/dbt-labs/dbt-core/pull/12734)
- [#12732](https://github.com/dbt-labs/dbt-core/pull/12732)
- [#12730](https://github.com/dbt-labs/dbt-core/pull/12730)

### 2) “CLI 输出不够透明，影响运行观察与排障”
表现为：
- `dbt clone` 过程无逐模型反馈
- 测试错误与测试失败混淆
- selector 写错时行为不直观

相关 PR：
- [#12743](https://github.com/dbt-labs/dbt-core/pull/12743)
- [#12738](https://github.com/dbt-labs/dbt-core/pull/12738)
- [#12740](https://github.com/dbt-labs/dbt-core/pull/12740)

### 3) “跨环境结果不稳定，影响 CI/状态选择”
表现为：
- CRLF/LF 差异导致 `state:modified` 误判
- Git 输出格式差异导致 `dbt deps` 出错
- 遥测网络超时拖慢命令退出

相关 PR：
- [#12731](https://github.com/dbt-labs/dbt-core/pull/12731)
- [#12728](https://github.com/dbt-labs/dbt-core/pull/12728)
- [#12741](https://github.com/dbt-labs/dbt-core/pull/12741)

### 4) “高级测试与宏开发存在隐式规则，学习门槛偏高”
表现为：
- singular test 命名配置不生效
- generic test 参数校验误报
- `run_query` 在 parse 阶段误用
- ephemeral model 作为 unit test 输入时报错不清晰

相关 PR：
- [#12745](https://github.com/dbt-labs/dbt-core/pull/12745)
- [#12737](https://github.com/dbt-labs/dbt-core/pull/12737)
- [#12736](https://github.com/dbt-labs/dbt-core/pull/12736)
- [#12735](https://github.com/dbt-labs/dbt-core/pull/12735)

### 5) “社区贡献流程仍有文档缺口”
- 外部贡献者对应该补哪些测试、如何验证 PR 缺少统一指引。
- 相关 PR：[#12739](https://github.com/dbt-labs/dbt-core/pull/12739)

---

## 附：社区热点 Issues

过去 24 小时内，**没有活跃更新的 Issue**，因此今天暂无可单独展开的热点 Issue 列表。  
不过从多个 PR 所关联修复的问题可以看出，社区当前讨论的核心仍聚焦于以下议题：**报错可读性、测试体验、CLI 可观测性、跨平台兼容性、artifact 可用性**。

---

如需，我还可以继续把这份日报整理成：
1. **更适合飞书/Slack 发布的简版**
2. **更适合邮件周报的长版**
3. **表格版（PR / 类型 / 影响面 / 优先级）**

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark 社区动态日报｜2026-03-30

## 1. 今日速览

过去 24 小时内，Spark 社区没有新 Release，但开发讨论非常活跃，重点集中在 **Spark History Server（SHS）可扩展性**、**Spark Connect 稳定性与协议演进**、以及 **SQL / PySpark 文档与兼容性完善**。  
从 PR 动向看，社区正在同时推进两类工作：一类是面向生产可用性的修复与配置增强，另一类是面向中长期演进的能力建设，例如 **语言无关 UDF 协议** 和 **DSv2 / SQL 元数据能力补齐**。

---

## 3. 社区热点 Issues

> 说明：本次数据源中，过去 24 小时内更新的 Issue 仅 3 条，因此无法凑满 10 条。以下为全部值得关注的 Issue。

### 1) #55082 4.1.1 spark-connect-common module compile error
- **状态**: OPEN
- **作者**: @luanmaxiansheng
- **重要性**: 这是一个直接影响 Spark 4.1.1 分支构建体验的问题，且涉及 `spark-connect-common` 模块编译与 proto 类生成，属于 **开发者上手阻塞型问题**。
- **为什么值得关注**: Spark Connect 生态在快速推进，如果基础模块构建链路不清晰，会直接影响二次开发、源码调试和定制构建。
- **社区反馈**: 已有 3 条评论，说明社区已经开始介入排查，但目前仍未关闭，表明问题可能与构建流程、代码生成步骤或文档缺失有关。
- **链接**: [apache/spark Issue #55082](https://github.com/apache/spark/issues/55082)

### 2) #54986 [DOCS] Document return types for aggregate functions (stddev, variance, etc.)
- **状态**: OPEN
- **作者**: @sanketitnal
- **重要性**: 这是一个看似文档问题、实则影响 API 可预期性的议题。聚合函数如 `stddev`、`variance` 的返回类型如果未明确，会影响 **类型推断、下游 schema 兼容和 UDF/ETL 稳定性**。
- **为什么值得关注**: 对 PySpark 用户尤其重要，特别是在数据质量校验、自动建模与类型敏感的数据管道中。
- **社区反馈**: 2 条评论，讨论聚焦在源码行为与文档不一致/未声明的问题；同时已出现对应修复 PR，说明社区响应较快。
- **链接**: [apache/spark Issue #54986](https://github.com/apache/spark/issues/54986)

### 3) #55076 Support mapUnsignedTinyIntToShort
- **状态**: OPEN
- **作者**: @melin
- **重要性**: 这是典型的 **外部数据库兼容性问题**，涉及 MySQL `TINYINT UNSIGNED` 到 Spark 类型系统的映射。
- **为什么值得关注**: JDBC/Federation 接入是 Spark SQL 落地中的高频场景，类型映射不合理会导致越界错误、查询失败或数据截断风险。
- **社区反馈**: 2 条评论，问题指向明确，并且已快速衍生出相应 PR，说明该需求具备现实生产背景。
- **链接**: [apache/spark Issue #55076](https://github.com/apache/spark/issues/55076)

---

## 4. 重要 PR 进展

### 1) #55029 [SPARK-56234][CORE] Support disabling log directory scanning by path pattern in SHS
- **状态**: OPEN
- **看点**: 为 Spark History Server 新增 `spark.history.fs.update.scanDisabledPathPatterns` 配置，可按路径正则跳过日志目录扫描。
- **价值**: 对大规模日志目录、冷热分层存储、对象存储场景非常实用，可显著降低 SHS 扫描开销与元数据遍历成本。
- **链接**: [apache/spark PR #55029](https://github.com/apache/spark/pull/55029)

### 2) #55086 [SPARK-56278][CORE] Populate accurate metadata immediately during on-demand loading in SHS
- **状态**: OPEN
- **看点**: 优化 SHS 按需加载机制，避免先创建 dummy metadata，再异步修正。
- **价值**: 提升历史应用 UI 的元数据准确性，减少用户在首屏看到错误/占位信息的情况，属于 **SHS 可观测性体验优化**。
- **链接**: [apache/spark PR #55086](https://github.com/apache/spark/pull/55086)

### 3) #55081 [SPARK-52965][BUILD] Upgrade gRPC to 1.76.0 and Netty to 4.1.124 to fix end-of-stream mid-frame in Spark Connect
- **状态**: OPEN
- **看点**: 升级 gRPC 与 Netty，针对 Spark Connect 中 `"Encountered end-of-stream mid-frame"` 问题进行修复。
- **价值**: 这是典型的 **连接层稳定性修复**，对复杂 schema、深层嵌套结构和远程执行场景意义重大。
- **链接**: [apache/spark PR #55081](https://github.com/apache/spark/pull/55081)

### 4) #55084 [SPARK-55278][CONNECT][SQL] Add language-agnostic UDF IPC protocol (Phase 1: protocol definition + Arrow serde)
- **状态**: OPEN
- **看点**: 引入面向多语言 UDF 的 IPC 协议第一阶段实现，基于 gRPC + Apache Arrow IPC。
- **价值**: 这是今天最具战略意义的 PR 之一，意味着 Spark 未来可能更自然地承载 Python、Go、Rust 等多语言 UDF 运行模型。
- **链接**: [apache/spark PR #55084](https://github.com/apache/spark/pull/55084)

### 5) #54971 [SPARK-56207][SQL] Replace legacy error codes with named errors in DSv2 connector API
- **状态**: OPEN
- **看点**: 将 DSv2 connector API 中的临时 legacy error code 替换为具名、可读的错误条件。
- **价值**: 改善连接器开发体验、错误排查效率和 API 一致性，是 Spark SQL 平台化成熟度的重要一步。
- **链接**: [apache/spark PR #54971](https://github.com/apache/spark/pull/54971)

### 6) #55064 [SPARK-39660][SQL] Support v2 DESCRIBE TABLE .. PARTITION
- **状态**: OPEN
- **看点**: 为 Data Source V2 增加 `DESCRIBE TABLE .. PARTITION` 支持。
- **价值**: 补齐 V2 表生态的 SQL 元数据能力，对湖仓格式和外部 catalog 集成尤其关键。
- **链接**: [apache/spark PR #55064](https://github.com/apache/spark/pull/55064)

### 7) #54824 [SPARK-53840][SQL] Add AS JSON output support for SHOW TABLES and SHOW TABLE EXTENDED
- **状态**: OPEN
- **看点**: 为 `SHOW TABLES` 和 `SHOW TABLE EXTENDED` 增加 `AS JSON` 输出。
- **价值**: 对自动化运维、元数据采集、平台集成非常友好，减少对文本输出做 brittle parsing 的需求。
- **链接**: [apache/spark PR #54824](https://github.com/apache/spark/pull/54824)

### 8) #55083 [SPARK-54986][DOCS] Document return types for aggregate functions
- **状态**: OPEN
- **看点**: 为多项 PySpark 聚合函数补充返回类型说明。
- **价值**: 虽然是文档 PR，但能显著提升 PySpark API 可理解性，降低类型误判导致的链路问题。
- **链接**: [apache/spark PR #55083](https://github.com/apache/spark/pull/55083)

### 9) #55080 [SPARK-55076][SQL] Add legacy config for MySQL unsigned TINYINT type …
- **状态**: OPEN
- **看点**: 增加 `spark.sql.legacy.mysql.unsignedTinyIntMapping.enabled`，控制 MySQL `UNSIGNED TINYINT` 映射行为。
- **价值**: 这是对 JDBC 兼容性问题的务实修复，兼顾默认行为与向后兼容策略。
- **链接**: [apache/spark PR #55080](https://github.com/apache/spark/pull/55080)

### 10) #54946 [SPARK-56147][SQL] `spark-sql` cli correctly handles SQL Scripting compound blocks
- **状态**: OPEN
- **看点**: 修复/增强 `spark-sql` CLI 对 SQL Scripting compound block 的处理。
- **价值**: 这直接提升脚本式 SQL 执行能力，对批处理任务、测试脚本和数据库风格迁移都很关键。
- **链接**: [apache/spark PR #54946](https://github.com/apache/spark/pull/54946)

---

## 5. 功能需求趋势

结合今日 Issues 与 PR，可提炼出以下几个社区关注方向：

### 1) Spark Connect 进入“稳定性 + 平台化扩展”并行阶段
- 一方面，社区在处理现实问题，如编译报错、gRPC/Netty 升级、连接中断修复。
- 另一方面，也在推进更长线能力，如 **语言无关 UDF IPC 协议**。
- 这说明 Spark Connect 已从“可用性验证”转向“生产稳定 + 生态扩展”双轨演进。

### 2) SHS（Spark History Server）在大规模部署场景下持续优化
- 今日两个重要 PR 都围绕 SHS：日志扫描裁剪、按需加载时元数据准确性提升。
- 趋势非常明确：社区正在解决 **历史服务在海量 event log 场景中的性能与可用性问题**。

### 3) SQL / DSv2 元数据与管理语义继续补齐
- `DESCRIBE TABLE .. PARTITION`、`SHOW TABLES AS JSON`、命名错误码等，都指向一个方向：
- Spark SQL 正持续增强其作为 **统一元数据与查询控制平面** 的能力，尤其面向 DSv2、外部 catalog 和平台化集成。

### 4) 兼容性问题仍是高频需求
- MySQL `UNSIGNED TINYINT` 映射问题说明，实际生产中 Spark 与外部数据库/联邦查询系统之间的类型兼容仍是痛点。
- 这类问题通常影响最广，且最容易在跨系统联调时暴露。

### 5) 文档与 API 可预期性受到更多重视
- 聚合函数返回类型文档问题虽小，但反映出社区对 **开发者体验、API 契约清晰度** 的重视在增强。
- 对 PySpark 用户尤其重要，因为 Python 用户更依赖文档而非源码追踪。

---

## 6. 开发者关注点

### 1) 构建与源码开发门槛
- `spark-connect-common` 编译问题反映出部分模块的构建流程、依赖生成或 proto 代码生成步骤仍不够直观。
- 对新贡献者和企业内部二次开发团队而言，这是明显阻力。

### 2) 远程执行链路稳定性
- Spark Connect 相关问题持续出现，尤其是复杂 schema、长连接、流式/交互式通信场景下的协议稳定性。
- 开发者关注的不只是功能是否存在，更关心 **复杂生产负载下是否稳定**。

### 3) 跨系统类型映射与兼容策略
- JDBC、联邦查询、外部 catalog 接入时，类型映射错误会直接导致业务失败。
- 社区当前倾向通过 **legacy config + 渐进式兼容** 的方式降低升级风险。

### 4) 元数据接口的结构化输出需求
- `AS JSON` 相关 PR 说明，开发者越来越希望 Spark 的元数据命令不仅能“给人看”，也能“给系统消费”。
- 这与数据平台自动化、元数据治理、Catalog 同步的需求高度一致。

### 5) 文档精确性和行为可解释性
- 从聚合函数返回类型文档问题可以看出，开发者希望 Spark API 的行为边界更加明确。
- 这类需求虽不如性能优化显眼，但对减少误用、提升生产稳定性非常关键。

---

## 附：今日重点链接速查

- Issue #55082: https://github.com/apache/spark/issues/55082  
- Issue #54986: https://github.com/apache/spark/issues/54986  
- Issue #55076: https://github.com/apache/spark/issues/55076  

- PR #55029: https://github.com/apache/spark/pull/55029  
- PR #55086: https://github.com/apache/spark/pull/55086  
- PR #55081: https://github.com/apache/spark/pull/55081  
- PR #55084: https://github.com/apache/spark/pull/55084  
- PR #54971: https://github.com/apache/spark/pull/54971  
- PR #55064: https://github.com/apache/spark/pull/55064  
- PR #54824: https://github.com/apache/spark/pull/54824  
- PR #55083: https://github.com/apache/spark/pull/55083  
- PR #55080: https://github.com/apache/spark/pull/55080  
- PR #54946: https://github.com/apache/spark/pull/54946  

如果你愿意，我还可以继续把这份日报整理成：
1. **适合公众号/邮件发送的摘要版**，或  
2. **适合内部周报沉淀的表格版**。

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait 社区动态日报｜2026-03-30

## 1. 今日速览

过去 24 小时内，Substrait 社区最重要的进展是发布了 **v0.87.0**，在扩展函数层面新增了 `std_dev` 和 `variance`，并引入分布类型枚举参数，进一步完善统计聚合表达能力。  
与此同时，社区唯一活跃 PR 聚焦于新增 **TopNRel 物理算子**，试图补齐文档与 protobuf 定义之间的缺口，并支持 `WITH TIES` 语义，这对执行计划互操作性具有直接价值。

---

## 2. 版本发布

### v0.87.0
- 发布链接: https://github.com/substrait-io/substrait/releases/tag/v0.87.0

**核心更新**
- 在 `extensions` 中新增 `std_dev` 和 `variance`
- 为相关统计函数增加 **distribution enum** 参数，用于表达不同统计分布语义  
- 关联信息: [#1011](https://github.com/substrait-io/substrait/issues/1011)

**影响解读**
- 这是对 Substrait 标准统计聚合函数体系的一次实用增强，能更准确地区分不同方差/标准差计算口径。
- 对接多种执行引擎时，这类显式参数设计有助于减少语义歧义，提升跨系统计划交换的一致性。
- 对 OLAP 引擎、向量化执行器和 federated query 场景尤其重要，因为统计函数常常是聚合下推和结果校验中的关键节点。

---

## 3. 社区热点 Issues

过去 24 小时内 **无 Issue 更新**。  
- Issues 列表: https://github.com/substrait-io/substrait/issues

**观察**
- 当前社区讨论重心更偏向于 **版本演进与 PR 设计落地**，而不是新增问题反馈。
- 从已发布版本关联信息看，统计聚合函数扩展仍是近期规范演进的重要方向。

---

## 4. 重要 PR 进展

过去 24 小时内仅有 1 个 PR 更新，以下为值得重点关注的进展：

### PR #1009 - feat: add TopNRel physical operator with WITH TIES support
- 链接: https://github.com/substrait-io/substrait/pull/1009
- 状态: OPEN
- 作者: @jcamachor
- 创建时间: 2026-03-17
- 最近更新: 2026-03-29

**内容摘要**
- 向 `algebra.proto` 新增 `TopNRel` message
- 将排序与取前 N 条能力组合为单一 **物理关系算子**
- 支持：
  - `SortField`
  - `Offset`
  - `Count / Fetch`
  - `WITH TIES`

**为什么重要**
- 它补齐了 `physical_relations.md` 中已有 Top-N 概念与 protobuf 定义缺失之间的空白。
- 对查询执行计划交换来说，`TopN` 是非常高频的物理算子，尤其常见于分页、排序裁剪、局部/全局 Top-K 优化。
- `WITH TIES` 支持很关键，因为它影响结果集边界语义，不是简单 `LIMIT` 可以替代的。

**潜在影响**
- 有助于不同引擎在物理计划层面对 Top-N 进行更一致表达。
- 为后续做 cost-based optimization、pushdown、分布式 merge-topn 等能力奠定基础。
- 对需要严格 SQL 兼容性的系统更友好，尤其是支持标准排序边界语义的数据库实现。

---

## 5. 功能需求趋势

基于过去 24 小时的发布与 PR 动向，可以提炼出以下社区关注方向：

### 1）统计聚合函数语义持续细化
- 代表动态: v0.87.0 新增 `std_dev` / `variance`
- 说明社区正在补全分析型查询所需的标准函数集合，并强化函数参数语义表达。
- 这类工作对 BI、报表、科学计算和指标平台类场景很关键。

### 2）物理计划表示能力增强
- 代表动态: [PR #1009](https://github.com/substrait-io/substrait/pull/1009)
- 社区正在继续从“逻辑表达”向“可执行物理算子表达”推进。
- 这说明 Substrait 不仅关注跨引擎逻辑兼容，也在强化执行层互操作性。

### 3）减少文档与协议定义之间的落差
- PR #1009 明确提到要填补文档与 protobuf 不一致的问题。
- 这反映出社区对“规范可实现性”的关注正在提高：不仅要有概念，还要有标准化消息定义，方便各实现落地。

---

## 6. 开发者关注点

结合今日数据，开发者侧的高频关注点主要有：

### 1）跨引擎语义一致性
- 无论是 `variance/std_dev` 的分布参数，还是 `TopN WITH TIES`，本质上都在解决不同执行引擎之间的语义映射问题。
- 开发者希望 Substrait 在标准层面表达得更明确，避免实现方各自解释。

### 2）物理算子覆盖度
- 当前活跃 PR 直接指向物理算子补全，说明实现者正在推动更完整的物理计划建模能力。
- 对数据库内核、查询优化器和执行器开发者来说，这是落地 Substrait 的关键前提。

### 3）规范与实现对齐
- 文档中已有定义但 protobuf 中尚未正式建模，会增加实现成本与歧义。
- 社区显然希望规范文档、proto、扩展函数定义三者同步演进。

---

## 附：今日关注链接汇总

- Releases: https://github.com/substrait-io/substrait/releases
- v0.87.0: https://github.com/substrait-io/substrait/releases/tag/v0.87.0
- Issues: https://github.com/substrait-io/substrait/issues
- PR #1009: https://github.com/substrait-io/substrait/pull/1009
- 仓库主页: https://github.com/substrait-io/substrait

如果你愿意，我还可以继续把这份日报整理成：
1. **公众号/博客风格版本**  
2. **适合飞书/Slack 推送的精简版**  
3. **带“对 Apache Arrow / DuckDB / DataFusion 潜在影响”点评版**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*